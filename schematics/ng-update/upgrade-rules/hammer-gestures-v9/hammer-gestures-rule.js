/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-gestures-rule", ["require", "exports", "@angular-devkit/core", "@angular-devkit/schematics", "@angular/cdk/schematics", "@schematics/angular/utility/ast-utils", "@schematics/angular/utility/change", "@schematics/angular/utility/config", "chalk", "fs", "path", "typescript", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/cli-workspace", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/find-hammer-script-tags", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/find-main-module", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-template-check", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/import-manager", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/remove-array-element", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/remove-element-from-html"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const core_1 = require("@angular-devkit/core");
    const schematics_1 = require("@angular-devkit/schematics");
    const schematics_2 = require("@angular/cdk/schematics");
    const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
    const change_1 = require("@schematics/angular/utility/change");
    const config_1 = require("@schematics/angular/utility/config");
    const chalk_1 = require("chalk");
    const fs_1 = require("fs");
    const path_1 = require("path");
    const ts = require("typescript");
    const cli_workspace_1 = require("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/cli-workspace");
    const find_hammer_script_tags_1 = require("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/find-hammer-script-tags");
    const find_main_module_1 = require("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/find-main-module");
    const hammer_template_check_1 = require("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-template-check");
    const import_manager_1 = require("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/import-manager");
    const remove_array_element_1 = require("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/remove-array-element");
    const remove_element_from_html_1 = require("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/remove-element-from-html");
    const GESTURE_CONFIG_CLASS_NAME = 'GestureConfig';
    const GESTURE_CONFIG_FILE_NAME = 'gesture-config';
    const GESTURE_CONFIG_TEMPLATE_PATH = './gesture-config.template';
    const HAMMER_CONFIG_TOKEN_NAME = 'HAMMER_GESTURE_CONFIG';
    const HAMMER_CONFIG_TOKEN_MODULE = '@angular/platform-browser';
    const HAMMER_MODULE_NAME = 'HammerModule';
    const HAMMER_MODULE_IMPORT = '@angular/platform-browser';
    const HAMMER_MODULE_SPECIFIER = 'hammerjs';
    const CANNOT_REMOVE_REFERENCE_ERROR = `Cannot remove reference to "GestureConfig". Please remove manually.`;
    class HammerGesturesRule extends schematics_2.MigrationRule {
        constructor() {
            super(...arguments);
            // Only enable this rule if the migration targets v9 or v10 and is running for a non-test
            // target. We cannot migrate test targets since they have a limited scope
            // (in regards to source files) and therefore the HammerJS usage detection can be incorrect.
            this.ruleEnabled = (this.targetVersion === schematics_2.TargetVersion.V9 || this.targetVersion === schematics_2.TargetVersion.V10) &&
                !this.isTestTarget;
            this._printer = ts.createPrinter();
            this._importManager = new import_manager_1.ImportManager(this.getUpdateRecorder, this._printer);
            this._nodeFailures = [];
            /**
             * Whether custom HammerJS events provided by the Material gesture
             * config are used in a template.
             */
            this._customEventsUsedInTemplate = false;
            /** Whether standard HammerJS events are used in a template. */
            this._standardEventsUsedInTemplate = false;
            /** Whether HammerJS is accessed at runtime. */
            this._usedInRuntime = false;
            /**
             * List of imports that make "hammerjs" available globally. We keep track of these
             * since we might need to remove them if Hammer is not used.
             */
            this._installImports = [];
            /**
             * List of identifiers which resolve to the gesture config from Angular Material.
             */
            this._gestureConfigReferences = [];
            /**
             * List of identifiers which resolve to the "HAMMER_GESTURE_CONFIG" token from
             * "@angular/platform-browser".
             */
            this._hammerConfigTokenReferences = [];
            /**
             * List of identifiers which resolve to the "HammerModule" from
             * "@angular/platform-browser".
             */
            this._hammerModuleReferences = [];
            /**
             * List of identifiers that have been deleted from source files. This can be
             * used to determine if certain imports are still used or not.
             */
            this._deletedIdentifiers = [];
        }
        visitTemplate(template) {
            if (!this._customEventsUsedInTemplate || !this._standardEventsUsedInTemplate) {
                const { standardEvents, customEvents } = hammer_template_check_1.isHammerJsUsedInTemplate(template.content);
                this._customEventsUsedInTemplate = this._customEventsUsedInTemplate || customEvents;
                this._standardEventsUsedInTemplate = this._standardEventsUsedInTemplate || standardEvents;
            }
        }
        visitNode(node) {
            this._checkHammerImports(node);
            this._checkForRuntimeHammerUsage(node);
            this._checkForMaterialGestureConfig(node);
            this._checkForHammerGestureConfigToken(node);
            this._checkForHammerModuleReference(node);
        }
        postAnalysis() {
            // Walk through all hammer config token references and check if there
            // is a potential custom gesture config setup.
            const hasCustomGestureConfigSetup = this._hammerConfigTokenReferences.some(r => this._checkForCustomGestureConfigSetup(r));
            const usedInTemplate = this._standardEventsUsedInTemplate || this._customEventsUsedInTemplate;
            /*
              Possible scenarios and how the migration should change the project:
                1. We detect that a custom HammerJS gesture config is set up:
                    - Remove references to the Material gesture config if no HammerJS event is used.
                    - Print a warning about ambiguous configuration that cannot be handled completely
                      if there are references to the Material gesture config.
                2. We detect that HammerJS is only used programmatically:
                    - Remove references to GestureConfig of Material.
                    - Remove references to the "HammerModule" if present.
                3. We detect that standard HammerJS events are used in a template:
                    - Set up the "HammerModule" from platform-browser.
                    - Remove all gesture config references.
                4. We detect that custom HammerJS events provided by the Material gesture
                   config are used.
                    - Copy the Material gesture config into the app.
                    - Rewrite all gesture config references to the newly copied one.
                    - Set up the new gesture config in the root app module.
                    - Set up the "HammerModule" from platform-browser.
                4. We detect no HammerJS usage at all:
                    - Remove Hammer imports
                    - Remove Material gesture config references
                    - Remove HammerModule setup if present.
                    - Remove Hammer script imports in "index.html" files.
            */
            if (hasCustomGestureConfigSetup) {
                // If a custom gesture config is provided, we always assume that HammerJS is used.
                HammerGesturesRule.globalUsesHammer = true;
                if (!usedInTemplate && this._gestureConfigReferences.length) {
                    // If the Angular Material gesture events are not used and we found a custom
                    // gesture config, we can safely remove references to the Material gesture config
                    // since events provided by the Material gesture config are guaranteed to be unused.
                    this._removeMaterialGestureConfigSetup();
                    this.printInfo('The HammerJS v9 migration for Angular Components detected that HammerJS is ' +
                        'manually set up in combination with references to the Angular Material gesture ' +
                        'config. This target cannot be migrated completely, but all references to the ' +
                        'deprecated Angular Material gesture have been removed. Read more here: ' +
                        'https://git.io/ng-material-v9-hammer-ambiguous-usage');
                }
                else if (usedInTemplate && this._gestureConfigReferences.length) {
                    // Since there is a reference to the Angular Material gesture config, and we detected
                    // usage of a gesture event that could be provided by Angular Material, we *cannot*
                    // automatically remove references. This is because we do *not* know whether the
                    // event is actually provided by the custom config or by the Material config.
                    this.printInfo('The HammerJS v9 migration for Angular Components detected that HammerJS is ' +
                        'manually set up in combination with references to the Angular Material gesture ' +
                        'config. This target cannot be migrated completely. Please manually remove ' +
                        'references to the deprecated Angular Material gesture config. Read more here: ' +
                        'https://git.io/ng-material-v9-hammer-ambiguous-usage');
                }
            }
            else if (this._usedInRuntime || usedInTemplate) {
                // We keep track of whether Hammer is used globally. This is necessary because we
                // want to only remove Hammer from the "package.json" if it is not used in any project
                // target. Just because it isn't used in one target doesn't mean that we can safely
                // remove the dependency.
                HammerGesturesRule.globalUsesHammer = true;
                // If hammer is only used at runtime, we don't need the gesture config or "HammerModule"
                // and can remove it (along with the hammer config token import if no longer needed).
                if (!usedInTemplate) {
                    this._removeMaterialGestureConfigSetup();
                    this._removeHammerModuleReferences();
                }
                else if (this._standardEventsUsedInTemplate && !this._customEventsUsedInTemplate) {
                    this._setupHammerWithStandardEvents();
                }
                else {
                    this._setupHammerWithCustomEvents();
                }
            }
            else {
                this._removeHammerSetup();
            }
            // Record the changes collected in the import manager. Changes need to be applied
            // once the import manager registered all import modifications. This avoids collisions.
            this._importManager.recordChanges();
            // Create migration failures that will be printed by the update-tool on migration
            // completion. We need special logic for updating failure positions to reflect
            // the new source file after modifications from the import manager.
            this.failures.push(...this._createMigrationFailures());
            // The template check for HammerJS events is not completely reliable as the event
            // output could also be from a component having an output named similarly to a known
            // hammerjs event (e.g. "@Output() slide"). The usage is therefore somewhat ambiguous
            // and we want to print a message that developers might be able to remove Hammer manually.
            if (!hasCustomGestureConfigSetup && !this._usedInRuntime && usedInTemplate) {
                this.printInfo('The HammerJS v9 migration for Angular Components migrated the ' +
                    'project to keep HammerJS installed, but detected ambiguous usage of HammerJS. Please ' +
                    'manually check if you can remove HammerJS from your application. More details: ' +
                    'https://git.io/ng-material-v9-hammer-ambiguous-usage');
            }
        }
        /**
         * Sets up the hammer gesture config in the current project. To achieve this, the
         * following steps are performed:
         *   1) Create copy of Angular Material gesture config.
         *   2) Rewrite all references to the Angular Material gesture config to the
         *      new gesture config.
         *   3) Setup the HAMMER_GESTURE_CONFIG in the root app module (if not done already).
         *   4) Setup the "HammerModule" in the root app module (if not done already).
         */
        _setupHammerWithCustomEvents() {
            const project = this._getProjectOrThrow();
            const sourceRoot = core_1.normalize(project.sourceRoot || project.root);
            const newConfigPath = core_1.join(sourceRoot, this._getAvailableGestureConfigFileName(sourceRoot));
            // Copy gesture config template into the CLI project.
            this.tree.create(newConfigPath, fs_1.readFileSync(require.resolve(GESTURE_CONFIG_TEMPLATE_PATH), 'utf8'));
            // Replace all Material gesture config references to resolve to the
            // newly copied gesture config.
            this._gestureConfigReferences.forEach(i => this._replaceGestureConfigReference(i, GESTURE_CONFIG_CLASS_NAME, getModuleSpecifier(newConfigPath, i.node.getSourceFile().fileName)));
            // Setup the gesture config provider and the "HammerModule" in the root module
            // if not done already. The "HammerModule" is needed in v9 since it enables the
            // Hammer event plugin that was previously enabled by default in v8.
            this._setupNewGestureConfigInRootModule(project, newConfigPath);
            this._setupHammerModuleInRootModule(project);
        }
        /**
         * Sets up the standard hammer module in the project and removes all
         * references to the deprecated Angular Material gesture config.
         */
        _setupHammerWithStandardEvents() {
            const project = this._getProjectOrThrow();
            // Setup the HammerModule. The HammerModule enables support for
            // the standard HammerJS events.
            this._setupHammerModuleInRootModule(project);
            this._removeMaterialGestureConfigSetup();
        }
        /**
         * Removes Hammer from the current project. The following steps are performed:
         *   1) Delete all TypeScript imports to "hammerjs".
         *   2) Remove references to the Angular Material gesture config.
         *   3) Remove "hammerjs" from all index HTML files of the current project.
         */
        _removeHammerSetup() {
            const project = this._getProjectOrThrow();
            this._installImports.forEach(i => this._importManager.deleteImportByDeclaration(i));
            this._removeMaterialGestureConfigSetup();
            this._removeHammerModuleReferences();
            this._removeHammerFromIndexFile(project);
        }
        /**
         * Removes the gesture config setup by deleting all found references to the Angular
         * Material gesture config. Additionally, unused imports to the hammer gesture config
         * token from "@angular/platform-browser" will be removed as well.
         */
        _removeMaterialGestureConfigSetup() {
            this._gestureConfigReferences.forEach(r => this._removeGestureConfigReference(r));
            this._hammerConfigTokenReferences.forEach(r => {
                if (r.isImport) {
                    this._removeHammerConfigTokenImportIfUnused(r);
                }
            });
        }
        /** Removes all references to the "HammerModule" from "@angular/platform-browser". */
        _removeHammerModuleReferences() {
            this._hammerModuleReferences.forEach(({ node, isImport, importData }) => {
                const sourceFile = node.getSourceFile();
                const recorder = this.getUpdateRecorder(sourceFile.fileName);
                // Only remove the import for the HammerModule if the module has been accessed
                // through a non-namespaced identifier access.
                if (!isNamespacedIdentifierAccess(node)) {
                    this._importManager.deleteNamedBindingImport(sourceFile, HAMMER_MODULE_NAME, importData.moduleName);
                }
                // For references from within an import, we do not need to do anything other than
                // removing the import. For other references, we remove the import and the actual
                // identifier in the module imports.
                if (isImport) {
                    return;
                }
                // If the "HammerModule" is referenced within an array literal, we can
                // remove the element easily. Otherwise if it's outside of an array literal,
                // we need to replace the reference with an empty object literal w/ todo to
                // not break the application.
                if (ts.isArrayLiteralExpression(node.parent)) {
                    // Removes the "HammerModule" from the parent array expression. Removes
                    // the trailing comma token if present.
                    remove_array_element_1.removeElementFromArrayExpression(node, recorder);
                }
                else {
                    recorder.remove(node.getStart(), node.getWidth());
                    recorder.insertRight(node.getStart(), `/* TODO: remove */ {}`);
                    this._nodeFailures.push({
                        node: node,
                        message: 'Unable to delete reference to "HammerModule".',
                    });
                }
            });
        }
        /**
         * Checks if the given node is a reference to the hammer gesture config
         * token from platform-browser. If so, keeps track of the reference.
         */
        _checkForHammerGestureConfigToken(node) {
            if (ts.isIdentifier(node)) {
                const importData = schematics_2.getImportOfIdentifier(node, this.typeChecker);
                if (importData && importData.symbolName === HAMMER_CONFIG_TOKEN_NAME &&
                    importData.moduleName === HAMMER_CONFIG_TOKEN_MODULE) {
                    this._hammerConfigTokenReferences.push({ node, importData, isImport: ts.isImportSpecifier(node.parent) });
                }
            }
        }
        /**
         * Checks if the given node is a reference to the HammerModule from
         * "@angular/platform-browser". If so, keeps track of the reference.
         */
        _checkForHammerModuleReference(node) {
            if (ts.isIdentifier(node)) {
                const importData = schematics_2.getImportOfIdentifier(node, this.typeChecker);
                if (importData && importData.symbolName === HAMMER_MODULE_NAME &&
                    importData.moduleName === HAMMER_MODULE_IMPORT) {
                    this._hammerModuleReferences.push({ node, importData, isImport: ts.isImportSpecifier(node.parent) });
                }
            }
        }
        /**
         * Checks if the given node is an import to the HammerJS package. Imports to
         * HammerJS which load specific symbols from the package are considered as
         * runtime usage of Hammer. e.g. `import {Symbol} from "hammerjs";`.
         */
        _checkHammerImports(node) {
            if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) &&
                node.moduleSpecifier.text === HAMMER_MODULE_SPECIFIER) {
                // If there is an import to HammerJS that imports symbols, or is namespaced
                // (e.g. "import {A, B} from ..." or "import * as hammer from ..."), then we
                // assume that some exports are used at runtime.
                if (node.importClause &&
                    !(node.importClause.namedBindings && ts.isNamedImports(node.importClause.namedBindings) &&
                        node.importClause.namedBindings.elements.length === 0)) {
                    this._usedInRuntime = true;
                }
                else {
                    this._installImports.push(node);
                }
            }
        }
        /**
         * Checks if the given node accesses the global "Hammer" symbol at runtime. If so,
         * the migration rule state will be updated to reflect that Hammer is used at runtime.
         */
        _checkForRuntimeHammerUsage(node) {
            if (this._usedInRuntime) {
                return;
            }
            // Detects usages of "window.Hammer".
            if (ts.isPropertyAccessExpression(node) && node.name.text === 'Hammer') {
                const originExpr = unwrapExpression(node.expression);
                if (ts.isIdentifier(originExpr) && originExpr.text === 'window') {
                    this._usedInRuntime = true;
                }
                return;
            }
            // Detects usages of "window['Hammer']".
            if (ts.isElementAccessExpression(node) && ts.isStringLiteral(node.argumentExpression) &&
                node.argumentExpression.text === 'Hammer') {
                const originExpr = unwrapExpression(node.expression);
                if (ts.isIdentifier(originExpr) && originExpr.text === 'window') {
                    this._usedInRuntime = true;
                }
                return;
            }
            // Handles usages of plain identifier with the name "Hammer". These usage
            // are valid if they resolve to "@types/hammerjs". e.g. "new Hammer(myElement)".
            if (ts.isIdentifier(node) && node.text === 'Hammer' &&
                !ts.isPropertyAccessExpression(node.parent) && !ts.isElementAccessExpression(node.parent)) {
                const symbol = this._getDeclarationSymbolOfNode(node);
                if (symbol && symbol.valueDeclaration &&
                    symbol.valueDeclaration.getSourceFile().fileName.includes('@types/hammerjs')) {
                    this._usedInRuntime = true;
                }
            }
        }
        /**
         * Checks if the given node references the gesture config from Angular Material.
         * If so, we keep track of the found symbol reference.
         */
        _checkForMaterialGestureConfig(node) {
            if (ts.isIdentifier(node)) {
                const importData = schematics_2.getImportOfIdentifier(node, this.typeChecker);
                if (importData && importData.symbolName === GESTURE_CONFIG_CLASS_NAME &&
                    importData.moduleName.startsWith('@angular/material/')) {
                    this._gestureConfigReferences.push({ node, importData, isImport: ts.isImportSpecifier(node.parent) });
                }
            }
        }
        /**
         * Checks if the given Hammer gesture config token reference is part of an
         * Angular provider definition that sets up a custom gesture config.
         */
        _checkForCustomGestureConfigSetup(tokenRef) {
            // Walk up the tree to look for a parent property assignment of the
            // reference to the hammer gesture config token.
            let propertyAssignment = tokenRef.node;
            while (propertyAssignment && !ts.isPropertyAssignment(propertyAssignment)) {
                propertyAssignment = propertyAssignment.parent;
            }
            if (!propertyAssignment || !ts.isPropertyAssignment(propertyAssignment) ||
                getPropertyNameText(propertyAssignment.name) !== 'provide') {
                return false;
            }
            const objectLiteralExpr = propertyAssignment.parent;
            const matchingIdentifiers = findMatchingChildNodes(objectLiteralExpr, ts.isIdentifier);
            // We naively assume that if there is a reference to the "GestureConfig" export
            // from Angular Material in the provider literal, that the provider sets up the
            // Angular Material gesture config.
            return !this._gestureConfigReferences.some(r => matchingIdentifiers.includes(r.node));
        }
        /**
         * Determines an available file name for the gesture config which should
         * be stored in the specified file path.
         */
        _getAvailableGestureConfigFileName(sourceRoot) {
            if (!this.tree.exists(core_1.join(sourceRoot, `${GESTURE_CONFIG_FILE_NAME}.ts`))) {
                return `${GESTURE_CONFIG_FILE_NAME}.ts`;
            }
            let possibleName = `${GESTURE_CONFIG_FILE_NAME}-`;
            let index = 1;
            while (this.tree.exists(core_1.join(sourceRoot, `${possibleName}-${index}.ts`))) {
                index++;
            }
            return `${possibleName + index}.ts`;
        }
        /** Replaces a given gesture config reference with a new import. */
        _replaceGestureConfigReference({ node, importData, isImport }, symbolName, moduleSpecifier) {
            const sourceFile = node.getSourceFile();
            const recorder = this.getUpdateRecorder(sourceFile.fileName);
            // List of all identifiers referring to the gesture config in the current file. This
            // allows us to add an import for the copied gesture configuration without generating a
            // new identifier for the import to avoid collisions. i.e. "GestureConfig_1". The import
            // manager checks for possible name collisions, but is able to ignore specific identifiers.
            // We use this to ignore all references to the original Angular Material gesture config,
            // because these will be replaced and therefore will not interfere.
            const gestureIdentifiersInFile = this._getGestureConfigIdentifiersOfFile(sourceFile);
            // If the parent of the identifier is accessed through a namespace, we can just
            // import the new gesture config without rewriting the import declaration because
            // the config has been imported through a namespaced import.
            if (isNamespacedIdentifierAccess(node)) {
                const newExpression = this._importManager.addImportToSourceFile(sourceFile, symbolName, moduleSpecifier, false, gestureIdentifiersInFile);
                recorder.remove(node.parent.getStart(), node.parent.getWidth());
                recorder.insertRight(node.parent.getStart(), this._printNode(newExpression, sourceFile));
                return;
            }
            // Delete the old import to the "GestureConfig".
            this._importManager.deleteNamedBindingImport(sourceFile, GESTURE_CONFIG_CLASS_NAME, importData.moduleName);
            // If the current reference is not from inside of a import, we need to add a new
            // import to the copied gesture config and replace the identifier. For references
            // within an import, we do nothing but removing the actual import. This allows us
            // to remove unused imports to the Material gesture config.
            if (!isImport) {
                const newExpression = this._importManager.addImportToSourceFile(sourceFile, symbolName, moduleSpecifier, false, gestureIdentifiersInFile);
                recorder.remove(node.getStart(), node.getWidth());
                recorder.insertRight(node.getStart(), this._printNode(newExpression, sourceFile));
            }
        }
        /**
         * Removes a given gesture config reference and its corresponding import from
         * its containing source file. Imports will be always removed, but in some cases,
         * where it's not guaranteed that a removal can be performed safely, we just
         * create a migration failure (and add a TODO if possible).
         */
        _removeGestureConfigReference({ node, importData, isImport }) {
            const sourceFile = node.getSourceFile();
            const recorder = this.getUpdateRecorder(sourceFile.fileName);
            // Only remove the import for the gesture config if the gesture config has
            // been accessed through a non-namespaced identifier access.
            if (!isNamespacedIdentifierAccess(node)) {
                this._importManager.deleteNamedBindingImport(sourceFile, GESTURE_CONFIG_CLASS_NAME, importData.moduleName);
            }
            // For references from within an import, we do not need to do anything other than
            // removing the import. For other references, we remove the import and the reference
            // identifier if used inside of a provider definition.
            if (isImport) {
                return;
            }
            const providerAssignment = node.parent;
            // Only remove references to the gesture config which are part of a statically
            // analyzable provider definition. We only support the common case of a gesture
            // config provider definition where the config is set up through "useClass".
            // Otherwise, it's not guaranteed that we can safely remove the provider definition.
            if (!ts.isPropertyAssignment(providerAssignment) ||
                getPropertyNameText(providerAssignment.name) !== 'useClass') {
                this._nodeFailures.push({ node, message: CANNOT_REMOVE_REFERENCE_ERROR });
                return;
            }
            const objectLiteralExpr = providerAssignment.parent;
            const provideToken = objectLiteralExpr.properties.find((p) => ts.isPropertyAssignment(p) && getPropertyNameText(p.name) === 'provide');
            // Do not remove the reference if the gesture config is not part of a provider definition,
            // or if the provided toke is not referring to the known HAMMER_GESTURE_CONFIG token
            // from platform-browser.
            if (!provideToken || !this._isReferenceToHammerConfigToken(provideToken.initializer)) {
                this._nodeFailures.push({ node, message: CANNOT_REMOVE_REFERENCE_ERROR });
                return;
            }
            // Collect all nested identifiers which will be deleted. This helps us
            // determining if we can remove imports for the "HAMMER_GESTURE_CONFIG" token.
            this._deletedIdentifiers.push(...findMatchingChildNodes(objectLiteralExpr, ts.isIdentifier));
            // In case the found provider definition is not part of an array literal,
            // we cannot safely remove the provider. This is because it could be declared
            // as a variable. e.g. "const gestureProvider = {provide: .., useClass: GestureConfig}".
            // In that case, we just add an empty object literal with TODO and print a failure.
            if (!ts.isArrayLiteralExpression(objectLiteralExpr.parent)) {
                recorder.remove(objectLiteralExpr.getStart(), objectLiteralExpr.getWidth());
                recorder.insertRight(objectLiteralExpr.getStart(), `/* TODO: remove */ {}`);
                this._nodeFailures.push({
                    node: objectLiteralExpr,
                    message: `Unable to delete provider definition for "GestureConfig" completely. ` +
                        `Please clean up the provider.`
                });
                return;
            }
            // Removes the object literal from the parent array expression. Removes
            // the trailing comma token if present.
            remove_array_element_1.removeElementFromArrayExpression(objectLiteralExpr, recorder);
        }
        /** Removes the given hammer config token import if it is not used. */
        _removeHammerConfigTokenImportIfUnused({ node, importData }) {
            const sourceFile = node.getSourceFile();
            const isTokenUsed = this._hammerConfigTokenReferences.some(r => !r.isImport && !isNamespacedIdentifierAccess(r.node) &&
                r.node.getSourceFile() === sourceFile && !this._deletedIdentifiers.includes(r.node));
            // We don't want to remove the import for the token if the token is
            // still used somewhere.
            if (!isTokenUsed) {
                this._importManager.deleteNamedBindingImport(sourceFile, HAMMER_CONFIG_TOKEN_NAME, importData.moduleName);
            }
        }
        /** Removes Hammer from all index HTML files of the given project. */
        _removeHammerFromIndexFile(project) {
            const indexFilePaths = schematics_2.getProjectIndexFiles(project);
            indexFilePaths.forEach(filePath => {
                if (!this.tree.exists(filePath)) {
                    return;
                }
                const htmlContent = this.tree.read(filePath).toString('utf8');
                const recorder = this.getUpdateRecorder(filePath);
                find_hammer_script_tags_1.findHammerScriptImportElements(htmlContent)
                    .forEach(el => remove_element_from_html_1.removeElementFromHtml(el, recorder));
            });
        }
        /** Sets up the Hammer gesture config in the root module if needed. */
        _setupNewGestureConfigInRootModule(project, gestureConfigPath) {
            const mainFilePath = path_1.join(this.basePath, schematics_2.getProjectMainFile(project));
            const rootModuleSymbol = this._getRootModuleSymbol(mainFilePath);
            if (rootModuleSymbol === null) {
                this.failures.push({
                    filePath: mainFilePath,
                    message: `Could not setup Hammer gestures in module. Please ` +
                        `manually ensure that the Hammer gesture config is set up.`,
                });
                return;
            }
            const sourceFile = rootModuleSymbol.valueDeclaration.getSourceFile();
            const relativePath = path_1.relative(this.basePath, sourceFile.fileName);
            const metadata = ast_utils_1.getDecoratorMetadata(sourceFile, 'NgModule', '@angular/core');
            // If no "NgModule" definition is found inside the source file, we just do nothing.
            if (!metadata.length) {
                return;
            }
            const recorder = this.getUpdateRecorder(sourceFile.fileName);
            const providersField = ast_utils_1.getMetadataField(metadata[0], 'providers')[0];
            const providerIdentifiers = providersField ? findMatchingChildNodes(providersField, ts.isIdentifier) : null;
            const gestureConfigExpr = this._importManager.addImportToSourceFile(sourceFile, GESTURE_CONFIG_CLASS_NAME, getModuleSpecifier(gestureConfigPath, sourceFile.fileName), false, this._getGestureConfigIdentifiersOfFile(sourceFile));
            const hammerConfigTokenExpr = this._importManager.addImportToSourceFile(sourceFile, HAMMER_CONFIG_TOKEN_NAME, HAMMER_CONFIG_TOKEN_MODULE);
            const newProviderNode = ts.createObjectLiteral([
                ts.createPropertyAssignment('provide', hammerConfigTokenExpr),
                ts.createPropertyAssignment('useClass', gestureConfigExpr)
            ]);
            // If the providers field exists and already contains references to the hammer gesture
            // config token and the gesture config, we naively assume that the gesture config is
            // already set up. We only want to add the gesture config provider if it is not set up.
            if (!providerIdentifiers ||
                !(this._hammerConfigTokenReferences.some(r => providerIdentifiers.includes(r.node)) &&
                    this._gestureConfigReferences.some(r => providerIdentifiers.includes(r.node)))) {
                ast_utils_1.addSymbolToNgModuleMetadata(sourceFile, relativePath, 'providers', this._printNode(newProviderNode, sourceFile), null)
                    .forEach(change => {
                    if (change instanceof change_1.InsertChange) {
                        recorder.insertRight(change.pos, change.toAdd);
                    }
                });
            }
        }
        /**
         * Gets the TypeScript symbol of the root module by looking for the module
         * bootstrap expression in the specified source file.
         */
        _getRootModuleSymbol(mainFilePath) {
            const mainFile = this.program.getSourceFile(mainFilePath);
            if (!mainFile) {
                return null;
            }
            const appModuleExpr = find_main_module_1.findMainModuleExpression(mainFile);
            if (!appModuleExpr) {
                return null;
            }
            const appModuleSymbol = this._getDeclarationSymbolOfNode(unwrapExpression(appModuleExpr));
            if (!appModuleSymbol || !appModuleSymbol.valueDeclaration) {
                return null;
            }
            return appModuleSymbol;
        }
        /** Sets up the "HammerModule" in the root module of the project. */
        _setupHammerModuleInRootModule(project) {
            const mainFilePath = path_1.join(this.basePath, schematics_2.getProjectMainFile(project));
            const rootModuleSymbol = this._getRootModuleSymbol(mainFilePath);
            if (rootModuleSymbol === null) {
                this.failures.push({
                    filePath: mainFilePath,
                    message: `Could not setup HammerModule. Please manually set up the "HammerModule" ` +
                        `from "@angular/platform-browser".`,
                });
                return;
            }
            const sourceFile = rootModuleSymbol.valueDeclaration.getSourceFile();
            const relativePath = path_1.relative(this.basePath, sourceFile.fileName);
            const metadata = ast_utils_1.getDecoratorMetadata(sourceFile, 'NgModule', '@angular/core');
            if (!metadata.length) {
                return;
            }
            const importsField = ast_utils_1.getMetadataField(metadata[0], 'imports')[0];
            const importIdentifiers = importsField ? findMatchingChildNodes(importsField, ts.isIdentifier) : null;
            const recorder = this.getUpdateRecorder(sourceFile.fileName);
            const hammerModuleExpr = this._importManager.addImportToSourceFile(sourceFile, HAMMER_MODULE_NAME, HAMMER_MODULE_IMPORT);
            // If the "HammerModule" is not already imported in the app module, we set it up
            // by adding it to the "imports" field of the app module.
            if (!importIdentifiers ||
                !this._hammerModuleReferences.some(r => importIdentifiers.includes(r.node))) {
                ast_utils_1.addSymbolToNgModuleMetadata(sourceFile, relativePath, 'imports', this._printNode(hammerModuleExpr, sourceFile), null)
                    .forEach(change => {
                    if (change instanceof change_1.InsertChange) {
                        recorder.insertRight(change.pos, change.toAdd);
                    }
                });
            }
        }
        /** Prints a given node within the specified source file. */
        _printNode(node, sourceFile) {
            return this._printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
        }
        /** Gets all referenced gesture config identifiers of a given source file */
        _getGestureConfigIdentifiersOfFile(sourceFile) {
            return this._gestureConfigReferences.filter(d => d.node.getSourceFile() === sourceFile)
                .map(d => d.node);
        }
        /** Gets the symbol that contains the value declaration of the specified node. */
        _getDeclarationSymbolOfNode(node) {
            const symbol = this.typeChecker.getSymbolAtLocation(node);
            // Symbols can be aliases of the declaration symbol. e.g. in named import specifiers.
            // We need to resolve the aliased symbol back to the declaration symbol.
            // tslint:disable-next-line:no-bitwise
            if (symbol && (symbol.flags & ts.SymbolFlags.Alias) !== 0) {
                return this.typeChecker.getAliasedSymbol(symbol);
            }
            return symbol;
        }
        /**
         * Checks whether the given expression resolves to a hammer gesture config
         * token reference from "@angular/platform-browser".
         */
        _isReferenceToHammerConfigToken(expr) {
            const unwrapped = unwrapExpression(expr);
            if (ts.isIdentifier(unwrapped)) {
                return this._hammerConfigTokenReferences.some(r => r.node === unwrapped);
            }
            else if (ts.isPropertyAccessExpression(unwrapped)) {
                return this._hammerConfigTokenReferences.some(r => r.node === unwrapped.name);
            }
            return false;
        }
        /**
         * Creates migration failures of the collected node failures. The returned migration
         * failures are updated to reflect the post-migration state of source files. Meaning
         * that failure positions are corrected if source file modifications shifted lines.
         */
        _createMigrationFailures() {
            return this._nodeFailures.map(({ node, message }) => {
                const sourceFile = node.getSourceFile();
                const offset = node.getStart();
                const position = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart());
                return {
                    position: this._importManager.correctNodePosition(node, offset, position),
                    message: message,
                    filePath: sourceFile.fileName,
                };
            });
        }
        /**
         * Gets the project from the current program or throws if no project
         * could be found.
         */
        _getProjectOrThrow() {
            const workspace = config_1.getWorkspace(this.tree);
            const project = cli_workspace_1.getProjectFromProgram(workspace, this.program);
            if (!project) {
                throw new schematics_1.SchematicsException('Could not find project to perform HammerJS v9 migration. ' +
                    'Please ensure your workspace configuration defines a project.');
            }
            return project;
        }
        /**
         * Static migration rule method that will be called once all project targets
         * have been migrated individually. This method can be used to make changes based
         * on the analysis of the individual targets. For example: we only remove Hammer
         * from the "package.json" if it is not used in *any* project target.
         */
        static globalPostMigration(tree, context) {
            // Always notify the developer that the Hammer v9 migration does not migrate tests.
            context.logger.info(chalk_1.default.yellow('\n⚠  General notice: The HammerJS v9 migration for Angular Components is not able to ' +
                'migrate tests. Please manually clean up tests in your project if they rely on ' +
                (this.globalUsesHammer ? 'the deprecated Angular Material gesture config.' : 'HammerJS.')));
            context.logger.info('Read more about migrating tests: https://git.io/ng-material-v9-hammer-migrate-tests');
            if (!this.globalUsesHammer && this._removeHammerFromPackageJson(tree)) {
                // Since Hammer has been removed from the workspace "package.json" file,
                // we schedule a node package install task to refresh the lock file.
                return { runPackageManager: true };
            }
            // Clean global state once the workspace has been migrated. This is technically
            // not necessary in "ng update", but in tests we re-use the same rule class.
            this.globalUsesHammer = false;
        }
        /**
         * Removes the hammer package from the workspace "package.json".
         * @returns Whether Hammer was set up and has been removed from the "package.json"
         */
        static _removeHammerFromPackageJson(tree) {
            if (!tree.exists('/package.json')) {
                return false;
            }
            const packageJson = JSON.parse(tree.read('/package.json').toString('utf8'));
            // We do not handle the case where someone manually added "hammerjs"
            // to the dev dependencies.
            if (packageJson.dependencies[HAMMER_MODULE_SPECIFIER]) {
                delete packageJson.dependencies[HAMMER_MODULE_SPECIFIER];
                tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));
                return true;
            }
            return false;
        }
    }
    exports.HammerGesturesRule = HammerGesturesRule;
    /** Global state of whether Hammer is used in any analyzed project target. */
    HammerGesturesRule.globalUsesHammer = false;
    /**
     * Recursively unwraps a given expression if it is wrapped
     * by parenthesis, type casts or type assertions.
     */
    function unwrapExpression(node) {
        if (ts.isParenthesizedExpression(node)) {
            return unwrapExpression(node.expression);
        }
        else if (ts.isAsExpression(node)) {
            return unwrapExpression(node.expression);
        }
        else if (ts.isTypeAssertion(node)) {
            return unwrapExpression(node.expression);
        }
        return node;
    }
    /**
     * Converts the specified path to a valid TypeScript module specifier which is
     * relative to the given containing file.
     */
    function getModuleSpecifier(newPath, containingFile) {
        let result = path_1.relative(path_1.dirname(containingFile), newPath).replace(/\\/g, '/').replace(/\.ts$/, '');
        if (!result.startsWith('.')) {
            result = `./${result}`;
        }
        return result;
    }
    /**
     * Gets the text of the given property name.
     * @returns Text of the given property name. Null if not statically analyzable.
     */
    function getPropertyNameText(node) {
        if (ts.isIdentifier(node) || ts.isStringLiteralLike(node)) {
            return node.text;
        }
        return null;
    }
    /** Checks whether the given identifier is part of a namespaced access. */
    function isNamespacedIdentifierAccess(node) {
        return ts.isQualifiedName(node.parent) || ts.isPropertyAccessExpression(node.parent);
    }
    /**
     * Walks through the specified node and returns all child nodes which match the
     * given predicate.
     */
    function findMatchingChildNodes(parent, predicate) {
        const result = [];
        const visitNode = (node) => {
            if (predicate(node)) {
                result.push(node);
            }
            ts.forEachChild(node, visitNode);
        };
        ts.forEachChild(parent, visitNode);
        return result;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLWdlc3R1cmVzLXJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvdXBncmFkZS1ydWxlcy9oYW1tZXItZ2VzdHVyZXMtdjkvaGFtbWVyLWdlc3R1cmVzLXJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCwrQ0FJOEI7SUFDOUIsMkRBQXVGO0lBQ3ZGLHdEQVVpQztJQUNqQyxxRUFJK0M7SUFDL0MsK0RBQWdFO0lBQ2hFLCtEQUFnRTtJQUVoRSxpQ0FBMEI7SUFDMUIsMkJBQWdDO0lBQ2hDLCtCQUE2QztJQUM3QyxpQ0FBaUM7SUFFakMseUhBQXNEO0lBQ3RELDZJQUF5RTtJQUN6RSwrSEFBNEQ7SUFDNUQseUlBQWlFO0lBQ2pFLDJIQUErQztJQUMvQyx1SUFBd0U7SUFDeEUsK0lBQWlFO0lBRWpFLE1BQU0seUJBQXlCLEdBQUcsZUFBZSxDQUFDO0lBQ2xELE1BQU0sd0JBQXdCLEdBQUcsZ0JBQWdCLENBQUM7SUFDbEQsTUFBTSw0QkFBNEIsR0FBRywyQkFBMkIsQ0FBQztJQUVqRSxNQUFNLHdCQUF3QixHQUFHLHVCQUF1QixDQUFDO0lBQ3pELE1BQU0sMEJBQTBCLEdBQUcsMkJBQTJCLENBQUM7SUFFL0QsTUFBTSxrQkFBa0IsR0FBRyxjQUFjLENBQUM7SUFDMUMsTUFBTSxvQkFBb0IsR0FBRywyQkFBMkIsQ0FBQztJQUV6RCxNQUFNLHVCQUF1QixHQUFHLFVBQVUsQ0FBQztJQUUzQyxNQUFNLDZCQUE2QixHQUMvQixxRUFBcUUsQ0FBQztJQVExRSxNQUFhLGtCQUFtQixTQUFRLDBCQUFtQjtRQUEzRDs7WUFDRSx5RkFBeUY7WUFDekYseUVBQXlFO1lBQ3pFLDRGQUE0RjtZQUM1RixnQkFBVyxHQUNQLENBQUMsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFD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SSxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDekQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ2xCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsMEVBQTBFO0lBQzFFLFNBQVMsNEJBQTRCLENBQUMsSUFBbUI7UUFDdkQsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTLHNCQUFzQixDQUMzQixNQUFlLEVBQUUsU0FBdUM7UUFDMUQsTUFBTSxNQUFNLEdBQVEsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBYSxFQUFFLEVBQUU7WUFDbEMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbkI7WUFDRCxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUM7UUFDRixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNuQyxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIGpvaW4gYXMgZGV2a2l0Sm9pbixcbiAgbm9ybWFsaXplIGFzIGRldmtpdE5vcm1hbGl6ZSxcbiAgUGF0aCBhcyBEZXZraXRQYXRoXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7U2NoZW1hdGljQ29udGV4dCwgU2NoZW1hdGljc0V4Y2VwdGlvbiwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgZ2V0SW1wb3J0T2ZJZGVudGlmaWVyLFxuICBnZXRQcm9qZWN0SW5kZXhGaWxlcyxcbiAgZ2V0UHJvamVjdE1haW5GaWxlLFxuICBJbXBvcnQsXG4gIE1pZ3JhdGlvbkZhaWx1cmUsXG4gIE1pZ3JhdGlvblJ1bGUsXG4gIFBvc3RNaWdyYXRpb25BY3Rpb24sXG4gIFJlc29sdmVkUmVzb3VyY2UsXG4gIFRhcmdldFZlcnNpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGFkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YSxcbiAgZ2V0RGVjb3JhdG9yTWV0YWRhdGEsXG4gIGdldE1ldGFkYXRhRmllbGRcbn0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2FzdC11dGlscyc7XG5pbXBvcnQge0luc2VydENoYW5nZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NoYW5nZSc7XG5pbXBvcnQge2dldFdvcmtzcGFjZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NvbmZpZyc7XG5pbXBvcnQge1dvcmtzcGFjZVByb2plY3R9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UtbW9kZWxzJztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQge3JlYWRGaWxlU3luY30gZnJvbSAnZnMnO1xuaW1wb3J0IHtkaXJuYW1lLCBqb2luLCByZWxhdGl2ZX0gZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtnZXRQcm9qZWN0RnJvbVByb2dyYW19IGZyb20gJy4vY2xpLXdvcmtzcGFjZSc7XG5pbXBvcnQge2ZpbmRIYW1tZXJTY3JpcHRJbXBvcnRFbGVtZW50c30gZnJvbSAnLi9maW5kLWhhbW1lci1zY3JpcHQtdGFncyc7XG5pbXBvcnQge2ZpbmRNYWluTW9kdWxlRXhwcmVzc2lvbn0gZnJvbSAnLi9maW5kLW1haW4tbW9kdWxlJztcbmltcG9ydCB7aXNIYW1tZXJKc1VzZWRJblRlbXBsYXRlfSBmcm9tICcuL2hhbW1lci10ZW1wbGF0ZS1jaGVjayc7XG5pbXBvcnQge0ltcG9ydE1hbmFnZXJ9IGZyb20gJy4vaW1wb3J0LW1hbmFnZXInO1xuaW1wb3J0IHtyZW1vdmVFbGVtZW50RnJvbUFycmF5RXhwcmVzc2lvbn0gZnJvbSAnLi9yZW1vdmUtYXJyYXktZWxlbWVudCc7XG5pbXBvcnQge3JlbW92ZUVsZW1lbnRGcm9tSHRtbH0gZnJvbSAnLi9yZW1vdmUtZWxlbWVudC1mcm9tLWh0bWwnO1xuXG5jb25zdCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FID0gJ0dlc3R1cmVDb25maWcnO1xuY29uc3QgR0VTVFVSRV9DT05GSUdfRklMRV9OQU1FID0gJ2dlc3R1cmUtY29uZmlnJztcbmNvbnN0IEdFU1RVUkVfQ09ORklHX1RFTVBMQVRFX1BBVEggPSAnLi9nZXN0dXJlLWNvbmZpZy50ZW1wbGF0ZSc7XG5cbmNvbnN0IEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSA9ICdIQU1NRVJfR0VTVFVSRV9DT05GSUcnO1xuY29uc3QgSEFNTUVSX0NPTkZJR19UT0tFTl9NT0RVTEUgPSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmNvbnN0IEhBTU1FUl9NT0RVTEVfTkFNRSA9ICdIYW1tZXJNb2R1bGUnO1xuY29uc3QgSEFNTUVSX01PRFVMRV9JTVBPUlQgPSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmNvbnN0IEhBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSID0gJ2hhbW1lcmpzJztcblxuY29uc3QgQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1IgPVxuICAgIGBDYW5ub3QgcmVtb3ZlIHJlZmVyZW5jZSB0byBcIkdlc3R1cmVDb25maWdcIi4gUGxlYXNlIHJlbW92ZSBtYW51YWxseS5gO1xuXG5pbnRlcmZhY2UgSWRlbnRpZmllclJlZmVyZW5jZSB7XG4gIG5vZGU6IHRzLklkZW50aWZpZXI7XG4gIGltcG9ydERhdGE6IEltcG9ydDtcbiAgaXNJbXBvcnQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBIYW1tZXJHZXN0dXJlc1J1bGUgZXh0ZW5kcyBNaWdyYXRpb25SdWxlPG51bGw+IHtcbiAgLy8gT25seSBlbmFibGUgdGhpcyBydWxlIGlmIHRoZSBtaWdyYXRpb24gdGFyZ2V0cyB2OSBvciB2MTAgYW5kIGlzIHJ1bm5pbmcgZm9yIGEgbm9uLXRlc3RcbiAgLy8gdGFyZ2V0LiBXZSBjYW5ub3QgbWlncmF0ZSB0ZXN0IHRhcmdldHMgc2luY2UgdGhleSBoYXZlIGEgbGltaXRlZCBzY29wZVxuICAvLyAoaW4gcmVnYXJkcyB0byBzb3VyY2UgZmlsZXMpIGFuZCB0aGVyZWZvcmUgdGhlIEhhbW1lckpTIHVzYWdlIGRldGVjdGlvbiBjYW4gYmUgaW5jb3JyZWN0LlxuICBydWxlRW5hYmxlZCA9XG4gICAgICAodGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlY5IHx8IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WMTApICYmXG4gICAgICAhdGhpcy5pc1Rlc3RUYXJnZXQ7XG5cbiAgcHJpdmF0ZSBfcHJpbnRlciA9IHRzLmNyZWF0ZVByaW50ZXIoKTtcbiAgcHJpdmF0ZSBfaW1wb3J0TWFuYWdlciA9IG5ldyBJbXBvcnRNYW5hZ2VyKHRoaXMuZ2V0VXBkYXRlUmVjb3JkZXIsIHRoaXMuX3ByaW50ZXIpO1xuICBwcml2YXRlIF9ub2RlRmFpbHVyZXM6IHtub2RlOiB0cy5Ob2RlLCBtZXNzYWdlOiBzdHJpbmd9W10gPSBbXTtcblxuICAvKipcbiAgICogV2hldGhlciBjdXN0b20gSGFtbWVySlMgZXZlbnRzIHByb3ZpZGVkIGJ5IHRoZSBNYXRlcmlhbCBnZXN0dXJlXG4gICAqIGNvbmZpZyBhcmUgdXNlZCBpbiBhIHRlbXBsYXRlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGUgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciBzdGFuZGFyZCBIYW1tZXJKUyBldmVudHMgYXJlIHVzZWQgaW4gYSB0ZW1wbGF0ZS4gKi9cbiAgcHJpdmF0ZSBfc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIEhhbW1lckpTIGlzIGFjY2Vzc2VkIGF0IHJ1bnRpbWUuICovXG4gIHByaXZhdGUgX3VzZWRJblJ1bnRpbWUgPSBmYWxzZTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpbXBvcnRzIHRoYXQgbWFrZSBcImhhbW1lcmpzXCIgYXZhaWxhYmxlIGdsb2JhbGx5LiBXZSBrZWVwIHRyYWNrIG9mIHRoZXNlXG4gICAqIHNpbmNlIHdlIG1pZ2h0IG5lZWQgdG8gcmVtb3ZlIHRoZW0gaWYgSGFtbWVyIGlzIG5vdCB1c2VkLlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5zdGFsbEltcG9ydHM6IHRzLkltcG9ydERlY2xhcmF0aW9uW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCByZXNvbHZlIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyBmcm9tIEFuZ3VsYXIgTWF0ZXJpYWwuXG4gICAqL1xuICBwcml2YXRlIF9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlczogSWRlbnRpZmllclJlZmVyZW5jZVtdID0gW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggcmVzb2x2ZSB0byB0aGUgXCJIQU1NRVJfR0VTVFVSRV9DT05GSUdcIiB0b2tlbiBmcm9tXG4gICAqIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzOiBJZGVudGlmaWVyUmVmZXJlbmNlW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCByZXNvbHZlIHRvIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb21cbiAgICogXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuXG4gICAqL1xuICBwcml2YXRlIF9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzOiBJZGVudGlmaWVyUmVmZXJlbmNlW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB0aGF0IGhhdmUgYmVlbiBkZWxldGVkIGZyb20gc291cmNlIGZpbGVzLiBUaGlzIGNhbiBiZVxuICAgKiB1c2VkIHRvIGRldGVybWluZSBpZiBjZXJ0YWluIGltcG9ydHMgYXJlIHN0aWxsIHVzZWQgb3Igbm90LlxuICAgKi9cbiAgcHJpdmF0ZSBfZGVsZXRlZElkZW50aWZpZXJzOiB0cy5JZGVudGlmaWVyW10gPSBbXTtcblxuICB2aXNpdFRlbXBsYXRlKHRlbXBsYXRlOiBSZXNvbHZlZFJlc291cmNlKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZSB8fCAhdGhpcy5fc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSkge1xuICAgICAgY29uc3Qge3N0YW5kYXJkRXZlbnRzLCBjdXN0b21FdmVudHN9ID0gaXNIYW1tZXJKc1VzZWRJblRlbXBsYXRlKHRlbXBsYXRlLmNvbnRlbnQpO1xuICAgICAgdGhpcy5fY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGUgPSB0aGlzLl9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZSB8fCBjdXN0b21FdmVudHM7XG4gICAgICB0aGlzLl9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlID0gdGhpcy5fc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSB8fCBzdGFuZGFyZEV2ZW50cztcbiAgICB9XG4gIH1cblxuICB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrSGFtbWVySW1wb3J0cyhub2RlKTtcbiAgICB0aGlzLl9jaGVja0ZvclJ1bnRpbWVIYW1tZXJVc2FnZShub2RlKTtcbiAgICB0aGlzLl9jaGVja0Zvck1hdGVyaWFsR2VzdHVyZUNvbmZpZyhub2RlKTtcbiAgICB0aGlzLl9jaGVja0ZvckhhbW1lckdlc3R1cmVDb25maWdUb2tlbihub2RlKTtcbiAgICB0aGlzLl9jaGVja0ZvckhhbW1lck1vZHVsZVJlZmVyZW5jZShub2RlKTtcbiAgfVxuXG4gIHBvc3RBbmFseXNpcygpOiB2b2lkIHtcbiAgICAvLyBXYWxrIHRocm91Z2ggYWxsIGhhbW1lciBjb25maWcgdG9rZW4gcmVmZXJlbmNlcyBhbmQgY2hlY2sgaWYgdGhlcmVcbiAgICAvLyBpcyBhIHBvdGVudGlhbCBjdXN0b20gZ2VzdHVyZSBjb25maWcgc2V0dXAuXG4gICAgY29uc3QgaGFzQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwID1cbiAgICAgICAgdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUociA9PiB0aGlzLl9jaGVja0ZvckN1c3RvbUdlc3R1cmVDb25maWdTZXR1cChyKSk7XG4gICAgY29uc3QgdXNlZEluVGVtcGxhdGUgPSB0aGlzLl9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlIHx8IHRoaXMuX2N1c3RvbUV2ZW50c1VzZWRJblRlbXBsYXRlO1xuXG4gICAgLypcbiAgICAgIFBvc3NpYmxlIHNjZW5hcmlvcyBhbmQgaG93IHRoZSBtaWdyYXRpb24gc2hvdWxkIGNoYW5nZSB0aGUgcHJvamVjdDpcbiAgICAgICAgMS4gV2UgZGV0ZWN0IHRoYXQgYSBjdXN0b20gSGFtbWVySlMgZ2VzdHVyZSBjb25maWcgaXMgc2V0IHVwOlxuICAgICAgICAgICAgLSBSZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgaWYgbm8gSGFtbWVySlMgZXZlbnQgaXMgdXNlZC5cbiAgICAgICAgICAgIC0gUHJpbnQgYSB3YXJuaW5nIGFib3V0IGFtYmlndW91cyBjb25maWd1cmF0aW9uIHRoYXQgY2Fubm90IGJlIGhhbmRsZWQgY29tcGxldGVseVxuICAgICAgICAgICAgICBpZiB0aGVyZSBhcmUgcmVmZXJlbmNlcyB0byB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAgICAgIDIuIFdlIGRldGVjdCB0aGF0IEhhbW1lckpTIGlzIG9ubHkgdXNlZCBwcm9ncmFtbWF0aWNhbGx5OlxuICAgICAgICAgICAgLSBSZW1vdmUgcmVmZXJlbmNlcyB0byBHZXN0dXJlQ29uZmlnIG9mIE1hdGVyaWFsLlxuICAgICAgICAgICAgLSBSZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpZiBwcmVzZW50LlxuICAgICAgICAzLiBXZSBkZXRlY3QgdGhhdCBzdGFuZGFyZCBIYW1tZXJKUyBldmVudHMgYXJlIHVzZWQgaW4gYSB0ZW1wbGF0ZTpcbiAgICAgICAgICAgIC0gU2V0IHVwIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb20gcGxhdGZvcm0tYnJvd3Nlci5cbiAgICAgICAgICAgIC0gUmVtb3ZlIGFsbCBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2VzLlxuICAgICAgICA0LiBXZSBkZXRlY3QgdGhhdCBjdXN0b20gSGFtbWVySlMgZXZlbnRzIHByb3ZpZGVkIGJ5IHRoZSBNYXRlcmlhbCBnZXN0dXJlXG4gICAgICAgICAgIGNvbmZpZyBhcmUgdXNlZC5cbiAgICAgICAgICAgIC0gQ29weSB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgaW50byB0aGUgYXBwLlxuICAgICAgICAgICAgLSBSZXdyaXRlIGFsbCBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2VzIHRvIHRoZSBuZXdseSBjb3BpZWQgb25lLlxuICAgICAgICAgICAgLSBTZXQgdXAgdGhlIG5ldyBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgcm9vdCBhcHAgbW9kdWxlLlxuICAgICAgICAgICAgLSBTZXQgdXAgdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbSBwbGF0Zm9ybS1icm93c2VyLlxuICAgICAgICA0LiBXZSBkZXRlY3Qgbm8gSGFtbWVySlMgdXNhZ2UgYXQgYWxsOlxuICAgICAgICAgICAgLSBSZW1vdmUgSGFtbWVyIGltcG9ydHNcbiAgICAgICAgICAgIC0gUmVtb3ZlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZXNcbiAgICAgICAgICAgIC0gUmVtb3ZlIEhhbW1lck1vZHVsZSBzZXR1cCBpZiBwcmVzZW50LlxuICAgICAgICAgICAgLSBSZW1vdmUgSGFtbWVyIHNjcmlwdCBpbXBvcnRzIGluIFwiaW5kZXguaHRtbFwiIGZpbGVzLlxuICAgICovXG5cbiAgICBpZiAoaGFzQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKSB7XG4gICAgICAvLyBJZiBhIGN1c3RvbSBnZXN0dXJlIGNvbmZpZyBpcyBwcm92aWRlZCwgd2UgYWx3YXlzIGFzc3VtZSB0aGF0IEhhbW1lckpTIGlzIHVzZWQuXG4gICAgICBIYW1tZXJHZXN0dXJlc1J1bGUuZ2xvYmFsVXNlc0hhbW1lciA9IHRydWU7XG4gICAgICBpZiAoIXVzZWRJblRlbXBsYXRlICYmIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLmxlbmd0aCkge1xuICAgICAgICAvLyBJZiB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGV2ZW50cyBhcmUgbm90IHVzZWQgYW5kIHdlIGZvdW5kIGEgY3VzdG9tXG4gICAgICAgIC8vIGdlc3R1cmUgY29uZmlnLCB3ZSBjYW4gc2FmZWx5IHJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZ1xuICAgICAgICAvLyBzaW5jZSBldmVudHMgcHJvdmlkZWQgYnkgdGhlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIGFyZSBndWFyYW50ZWVkIHRvIGJlIHVudXNlZC5cbiAgICAgICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgICAgICAgdGhpcy5wcmludEluZm8oXG4gICAgICAgICAgICAnVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBDb21wb25lbnRzIGRldGVjdGVkIHRoYXQgSGFtbWVySlMgaXMgJyArXG4gICAgICAgICAgICAnbWFudWFsbHkgc2V0IHVwIGluIGNvbWJpbmF0aW9uIHdpdGggcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlICcgK1xuICAgICAgICAgICAgJ2NvbmZpZy4gVGhpcyB0YXJnZXQgY2Fubm90IGJlIG1pZ3JhdGVkIGNvbXBsZXRlbHksIGJ1dCBhbGwgcmVmZXJlbmNlcyB0byB0aGUgJyArXG4gICAgICAgICAgICAnZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgaGF2ZSBiZWVuIHJlbW92ZWQuIFJlYWQgbW9yZSBoZXJlOiAnICtcbiAgICAgICAgICAgICdodHRwczovL2dpdC5pby9uZy1tYXRlcmlhbC12OS1oYW1tZXItYW1iaWd1b3VzLXVzYWdlJyk7XG4gICAgICB9IGVsc2UgaWYgKHVzZWRJblRlbXBsYXRlICYmIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLmxlbmd0aCkge1xuICAgICAgICAvLyBTaW5jZSB0aGVyZSBpcyBhIHJlZmVyZW5jZSB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZywgYW5kIHdlIGRldGVjdGVkXG4gICAgICAgIC8vIHVzYWdlIG9mIGEgZ2VzdHVyZSBldmVudCB0aGF0IGNvdWxkIGJlIHByb3ZpZGVkIGJ5IEFuZ3VsYXIgTWF0ZXJpYWwsIHdlICpjYW5ub3QqXG4gICAgICAgIC8vIGF1dG9tYXRpY2FsbHkgcmVtb3ZlIHJlZmVyZW5jZXMuIFRoaXMgaXMgYmVjYXVzZSB3ZSBkbyAqbm90KiBrbm93IHdoZXRoZXIgdGhlXG4gICAgICAgIC8vIGV2ZW50IGlzIGFjdHVhbGx5IHByb3ZpZGVkIGJ5IHRoZSBjdXN0b20gY29uZmlnIG9yIGJ5IHRoZSBNYXRlcmlhbCBjb25maWcuXG4gICAgICAgIHRoaXMucHJpbnRJbmZvKFxuICAgICAgICAgICAgJ1RoZSBIYW1tZXJKUyB2OSBtaWdyYXRpb24gZm9yIEFuZ3VsYXIgQ29tcG9uZW50cyBkZXRlY3RlZCB0aGF0IEhhbW1lckpTIGlzICcgK1xuICAgICAgICAgICAgJ21hbnVhbGx5IHNldCB1cCBpbiBjb21iaW5hdGlvbiB3aXRoIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSAnICtcbiAgICAgICAgICAgICdjb25maWcuIFRoaXMgdGFyZ2V0IGNhbm5vdCBiZSBtaWdyYXRlZCBjb21wbGV0ZWx5LiBQbGVhc2UgbWFudWFsbHkgcmVtb3ZlICcgK1xuICAgICAgICAgICAgJ3JlZmVyZW5jZXMgdG8gdGhlIGRlcHJlY2F0ZWQgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy4gUmVhZCBtb3JlIGhlcmU6ICcgK1xuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0LmlvL25nLW1hdGVyaWFsLXY5LWhhbW1lci1hbWJpZ3VvdXMtdXNhZ2UnKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuX3VzZWRJblJ1bnRpbWUgfHwgdXNlZEluVGVtcGxhdGUpIHtcbiAgICAgIC8vIFdlIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBIYW1tZXIgaXMgdXNlZCBnbG9iYWxseS4gVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSB3ZVxuICAgICAgLy8gd2FudCB0byBvbmx5IHJlbW92ZSBIYW1tZXIgZnJvbSB0aGUgXCJwYWNrYWdlLmpzb25cIiBpZiBpdCBpcyBub3QgdXNlZCBpbiBhbnkgcHJvamVjdFxuICAgICAgLy8gdGFyZ2V0LiBKdXN0IGJlY2F1c2UgaXQgaXNuJ3QgdXNlZCBpbiBvbmUgdGFyZ2V0IGRvZXNuJ3QgbWVhbiB0aGF0IHdlIGNhbiBzYWZlbHlcbiAgICAgIC8vIHJlbW92ZSB0aGUgZGVwZW5kZW5jeS5cbiAgICAgIEhhbW1lckdlc3R1cmVzUnVsZS5nbG9iYWxVc2VzSGFtbWVyID0gdHJ1ZTtcblxuICAgICAgLy8gSWYgaGFtbWVyIGlzIG9ubHkgdXNlZCBhdCBydW50aW1lLCB3ZSBkb24ndCBuZWVkIHRoZSBnZXN0dXJlIGNvbmZpZyBvciBcIkhhbW1lck1vZHVsZVwiXG4gICAgICAvLyBhbmQgY2FuIHJlbW92ZSBpdCAoYWxvbmcgd2l0aCB0aGUgaGFtbWVyIGNvbmZpZyB0b2tlbiBpbXBvcnQgaWYgbm8gbG9uZ2VyIG5lZWRlZCkuXG4gICAgICBpZiAoIXVzZWRJblRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUhhbW1lck1vZHVsZVJlZmVyZW5jZXMoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSAmJiAhdGhpcy5fY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy5fc2V0dXBIYW1tZXJXaXRoU3RhbmRhcmRFdmVudHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NldHVwSGFtbWVyV2l0aEN1c3RvbUV2ZW50cygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZW1vdmVIYW1tZXJTZXR1cCgpO1xuICAgIH1cblxuICAgIC8vIFJlY29yZCB0aGUgY2hhbmdlcyBjb2xsZWN0ZWQgaW4gdGhlIGltcG9ydCBtYW5hZ2VyLiBDaGFuZ2VzIG5lZWQgdG8gYmUgYXBwbGllZFxuICAgIC8vIG9uY2UgdGhlIGltcG9ydCBtYW5hZ2VyIHJlZ2lzdGVyZWQgYWxsIGltcG9ydCBtb2RpZmljYXRpb25zLiBUaGlzIGF2b2lkcyBjb2xsaXNpb25zLlxuICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIucmVjb3JkQ2hhbmdlcygpO1xuXG4gICAgLy8gQ3JlYXRlIG1pZ3JhdGlvbiBmYWlsdXJlcyB0aGF0IHdpbGwgYmUgcHJpbnRlZCBieSB0aGUgdXBkYXRlLXRvb2wgb24gbWlncmF0aW9uXG4gICAgLy8gY29tcGxldGlvbi4gV2UgbmVlZCBzcGVjaWFsIGxvZ2ljIGZvciB1cGRhdGluZyBmYWlsdXJlIHBvc2l0aW9ucyB0byByZWZsZWN0XG4gICAgLy8gdGhlIG5ldyBzb3VyY2UgZmlsZSBhZnRlciBtb2RpZmljYXRpb25zIGZyb20gdGhlIGltcG9ydCBtYW5hZ2VyLlxuICAgIHRoaXMuZmFpbHVyZXMucHVzaCguLi50aGlzLl9jcmVhdGVNaWdyYXRpb25GYWlsdXJlcygpKTtcblxuICAgIC8vIFRoZSB0ZW1wbGF0ZSBjaGVjayBmb3IgSGFtbWVySlMgZXZlbnRzIGlzIG5vdCBjb21wbGV0ZWx5IHJlbGlhYmxlIGFzIHRoZSBldmVudFxuICAgIC8vIG91dHB1dCBjb3VsZCBhbHNvIGJlIGZyb20gYSBjb21wb25lbnQgaGF2aW5nIGFuIG91dHB1dCBuYW1lZCBzaW1pbGFybHkgdG8gYSBrbm93blxuICAgIC8vIGhhbW1lcmpzIGV2ZW50IChlLmcuIFwiQE91dHB1dCgpIHNsaWRlXCIpLiBUaGUgdXNhZ2UgaXMgdGhlcmVmb3JlIHNvbWV3aGF0IGFtYmlndW91c1xuICAgIC8vIGFuZCB3ZSB3YW50IHRvIHByaW50IGEgbWVzc2FnZSB0aGF0IGRldmVsb3BlcnMgbWlnaHQgYmUgYWJsZSB0byByZW1vdmUgSGFtbWVyIG1hbnVhbGx5LlxuICAgIGlmICghaGFzQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwICYmICF0aGlzLl91c2VkSW5SdW50aW1lICYmIHVzZWRJblRlbXBsYXRlKSB7XG4gICAgICB0aGlzLnByaW50SW5mbyhcbiAgICAgICAgICAnVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBDb21wb25lbnRzIG1pZ3JhdGVkIHRoZSAnICtcbiAgICAgICAgICAncHJvamVjdCB0byBrZWVwIEhhbW1lckpTIGluc3RhbGxlZCwgYnV0IGRldGVjdGVkIGFtYmlndW91cyB1c2FnZSBvZiBIYW1tZXJKUy4gUGxlYXNlICcgK1xuICAgICAgICAgICdtYW51YWxseSBjaGVjayBpZiB5b3UgY2FuIHJlbW92ZSBIYW1tZXJKUyBmcm9tIHlvdXIgYXBwbGljYXRpb24uIE1vcmUgZGV0YWlsczogJyArXG4gICAgICAgICAgJ2h0dHBzOi8vZ2l0LmlvL25nLW1hdGVyaWFsLXY5LWhhbW1lci1hbWJpZ3VvdXMtdXNhZ2UnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB1cCB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnIGluIHRoZSBjdXJyZW50IHByb2plY3QuIFRvIGFjaGlldmUgdGhpcywgdGhlXG4gICAqIGZvbGxvd2luZyBzdGVwcyBhcmUgcGVyZm9ybWVkOlxuICAgKiAgIDEpIENyZWF0ZSBjb3B5IG9mIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAqICAgMikgUmV3cml0ZSBhbGwgcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyB0byB0aGVcbiAgICogICAgICBuZXcgZ2VzdHVyZSBjb25maWcuXG4gICAqICAgMykgU2V0dXAgdGhlIEhBTU1FUl9HRVNUVVJFX0NPTkZJRyBpbiB0aGUgcm9vdCBhcHAgbW9kdWxlIChpZiBub3QgZG9uZSBhbHJlYWR5KS5cbiAgICogICA0KSBTZXR1cCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpbiB0aGUgcm9vdCBhcHAgbW9kdWxlIChpZiBub3QgZG9uZSBhbHJlYWR5KS5cbiAgICovXG4gIHByaXZhdGUgX3NldHVwSGFtbWVyV2l0aEN1c3RvbUV2ZW50cygpIHtcbiAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5fZ2V0UHJvamVjdE9yVGhyb3coKTtcbiAgICBjb25zdCBzb3VyY2VSb290ID0gZGV2a2l0Tm9ybWFsaXplKHByb2plY3Quc291cmNlUm9vdCB8fCBwcm9qZWN0LnJvb3QpO1xuICAgIGNvbnN0IG5ld0NvbmZpZ1BhdGggPVxuICAgICAgICBkZXZraXRKb2luKHNvdXJjZVJvb3QsIHRoaXMuX2dldEF2YWlsYWJsZUdlc3R1cmVDb25maWdGaWxlTmFtZShzb3VyY2VSb290KSk7XG5cbiAgICAvLyBDb3B5IGdlc3R1cmUgY29uZmlnIHRlbXBsYXRlIGludG8gdGhlIENMSSBwcm9qZWN0LlxuICAgIHRoaXMudHJlZS5jcmVhdGUoXG4gICAgICAgIG5ld0NvbmZpZ1BhdGgsIHJlYWRGaWxlU3luYyhyZXF1aXJlLnJlc29sdmUoR0VTVFVSRV9DT05GSUdfVEVNUExBVEVfUEFUSCksICd1dGY4JykpO1xuXG4gICAgLy8gUmVwbGFjZSBhbGwgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlcyB0byByZXNvbHZlIHRvIHRoZVxuICAgIC8vIG5ld2x5IGNvcGllZCBnZXN0dXJlIGNvbmZpZy5cbiAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5mb3JFYWNoKFxuICAgICAgICBpID0+IHRoaXMuX3JlcGxhY2VHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKFxuICAgICAgICAgICAgaSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSxcbiAgICAgICAgICAgIGdldE1vZHVsZVNwZWNpZmllcihuZXdDb25maWdQYXRoLCBpLm5vZGUuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lKSkpO1xuXG4gICAgLy8gU2V0dXAgdGhlIGdlc3R1cmUgY29uZmlnIHByb3ZpZGVyIGFuZCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpbiB0aGUgcm9vdCBtb2R1bGVcbiAgICAvLyBpZiBub3QgZG9uZSBhbHJlYWR5LiBUaGUgXCJIYW1tZXJNb2R1bGVcIiBpcyBuZWVkZWQgaW4gdjkgc2luY2UgaXQgZW5hYmxlcyB0aGVcbiAgICAvLyBIYW1tZXIgZXZlbnQgcGx1Z2luIHRoYXQgd2FzIHByZXZpb3VzbHkgZW5hYmxlZCBieSBkZWZhdWx0IGluIHY4LlxuICAgIHRoaXMuX3NldHVwTmV3R2VzdHVyZUNvbmZpZ0luUm9vdE1vZHVsZShwcm9qZWN0LCBuZXdDb25maWdQYXRoKTtcbiAgICB0aGlzLl9zZXR1cEhhbW1lck1vZHVsZUluUm9vdE1vZHVsZShwcm9qZWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVwIHRoZSBzdGFuZGFyZCBoYW1tZXIgbW9kdWxlIGluIHRoZSBwcm9qZWN0IGFuZCByZW1vdmVzIGFsbFxuICAgKiByZWZlcmVuY2VzIHRvIHRoZSBkZXByZWNhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAqL1xuICBwcml2YXRlIF9zZXR1cEhhbW1lcldpdGhTdGFuZGFyZEV2ZW50cygpIHtcbiAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5fZ2V0UHJvamVjdE9yVGhyb3coKTtcblxuICAgIC8vIFNldHVwIHRoZSBIYW1tZXJNb2R1bGUuIFRoZSBIYW1tZXJNb2R1bGUgZW5hYmxlcyBzdXBwb3J0IGZvclxuICAgIC8vIHRoZSBzdGFuZGFyZCBIYW1tZXJKUyBldmVudHMuXG4gICAgdGhpcy5fc2V0dXBIYW1tZXJNb2R1bGVJblJvb3RNb2R1bGUocHJvamVjdCk7XG4gICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIEhhbW1lciBmcm9tIHRoZSBjdXJyZW50IHByb2plY3QuIFRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHBlcmZvcm1lZDpcbiAgICogICAxKSBEZWxldGUgYWxsIFR5cGVTY3JpcHQgaW1wb3J0cyB0byBcImhhbW1lcmpzXCIuXG4gICAqICAgMikgUmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAqICAgMykgUmVtb3ZlIFwiaGFtbWVyanNcIiBmcm9tIGFsbCBpbmRleCBIVE1MIGZpbGVzIG9mIHRoZSBjdXJyZW50IHByb2plY3QuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJTZXR1cCgpIHtcbiAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5fZ2V0UHJvamVjdE9yVGhyb3coKTtcblxuICAgIHRoaXMuX2luc3RhbGxJbXBvcnRzLmZvckVhY2goaSA9PiB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZUltcG9ydEJ5RGVjbGFyYXRpb24oaSkpO1xuXG4gICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgICB0aGlzLl9yZW1vdmVIYW1tZXJNb2R1bGVSZWZlcmVuY2VzKCk7XG4gICAgdGhpcy5fcmVtb3ZlSGFtbWVyRnJvbUluZGV4RmlsZShwcm9qZWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBnZXN0dXJlIGNvbmZpZyBzZXR1cCBieSBkZWxldGluZyBhbGwgZm91bmQgcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhclxuICAgKiBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy4gQWRkaXRpb25hbGx5LCB1bnVzZWQgaW1wb3J0cyB0byB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnXG4gICAqIHRva2VuIGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIgd2lsbCBiZSByZW1vdmVkIGFzIHdlbGwuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVNYXRlcmlhbEdlc3R1cmVDb25maWdTZXR1cCgpIHtcbiAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5mb3JFYWNoKHIgPT4gdGhpcy5fcmVtb3ZlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZShyKSk7XG5cbiAgICB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuZm9yRWFjaChyID0+IHtcbiAgICAgIGlmIChyLmlzSW1wb3J0KSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZUhhbW1lckNvbmZpZ1Rva2VuSW1wb3J0SWZVbnVzZWQocik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogUmVtb3ZlcyBhbGwgcmVmZXJlbmNlcyB0byB0aGUgXCJIYW1tZXJNb2R1bGVcIiBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLiAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJNb2R1bGVSZWZlcmVuY2VzKCkge1xuICAgIHRoaXMuX2hhbW1lck1vZHVsZVJlZmVyZW5jZXMuZm9yRWFjaCgoe25vZGUsIGlzSW1wb3J0LCBpbXBvcnREYXRhfSkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuXG4gICAgICAvLyBPbmx5IHJlbW92ZSB0aGUgaW1wb3J0IGZvciB0aGUgSGFtbWVyTW9kdWxlIGlmIHRoZSBtb2R1bGUgaGFzIGJlZW4gYWNjZXNzZWRcbiAgICAgIC8vIHRocm91Z2ggYSBub24tbmFtZXNwYWNlZCBpZGVudGlmaWVyIGFjY2Vzcy5cbiAgICAgIGlmICghaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2Vzcyhub2RlKSkge1xuICAgICAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChcbiAgICAgICAgICAgIHNvdXJjZUZpbGUsIEhBTU1FUl9NT0RVTEVfTkFNRSwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lKTtcbiAgICAgIH1cblxuICAgICAgLy8gRm9yIHJlZmVyZW5jZXMgZnJvbSB3aXRoaW4gYW4gaW1wb3J0LCB3ZSBkbyBub3QgbmVlZCB0byBkbyBhbnl0aGluZyBvdGhlciB0aGFuXG4gICAgICAvLyByZW1vdmluZyB0aGUgaW1wb3J0LiBGb3Igb3RoZXIgcmVmZXJlbmNlcywgd2UgcmVtb3ZlIHRoZSBpbXBvcnQgYW5kIHRoZSBhY3R1YWxcbiAgICAgIC8vIGlkZW50aWZpZXIgaW4gdGhlIG1vZHVsZSBpbXBvcnRzLlxuICAgICAgaWYgKGlzSW1wb3J0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaXMgcmVmZXJlbmNlZCB3aXRoaW4gYW4gYXJyYXkgbGl0ZXJhbCwgd2UgY2FuXG4gICAgICAvLyByZW1vdmUgdGhlIGVsZW1lbnQgZWFzaWx5LiBPdGhlcndpc2UgaWYgaXQncyBvdXRzaWRlIG9mIGFuIGFycmF5IGxpdGVyYWwsXG4gICAgICAvLyB3ZSBuZWVkIHRvIHJlcGxhY2UgdGhlIHJlZmVyZW5jZSB3aXRoIGFuIGVtcHR5IG9iamVjdCBsaXRlcmFsIHcvIHRvZG8gdG9cbiAgICAgIC8vIG5vdCBicmVhayB0aGUgYXBwbGljYXRpb24uXG4gICAgICBpZiAodHMuaXNBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUucGFyZW50KSkge1xuICAgICAgICAvLyBSZW1vdmVzIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb20gdGhlIHBhcmVudCBhcnJheSBleHByZXNzaW9uLiBSZW1vdmVzXG4gICAgICAgIC8vIHRoZSB0cmFpbGluZyBjb21tYSB0b2tlbiBpZiBwcmVzZW50LlxuICAgICAgICByZW1vdmVFbGVtZW50RnJvbUFycmF5RXhwcmVzc2lvbihub2RlLCByZWNvcmRlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWNvcmRlci5yZW1vdmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCkpO1xuICAgICAgICByZWNvcmRlci5pbnNlcnRSaWdodChub2RlLmdldFN0YXJ0KCksIGAvKiBUT0RPOiByZW1vdmUgKi8ge31gKTtcbiAgICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe1xuICAgICAgICAgIG5vZGU6IG5vZGUsXG4gICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byBkZWxldGUgcmVmZXJlbmNlIHRvIFwiSGFtbWVyTW9kdWxlXCIuJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWdcbiAgICogdG9rZW4gZnJvbSBwbGF0Zm9ybS1icm93c2VyLiBJZiBzbywga2VlcHMgdHJhY2sgb2YgdGhlIHJlZmVyZW5jZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9ySGFtbWVyR2VzdHVyZUNvbmZpZ1Rva2VuKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICBjb25zdCBpbXBvcnREYXRhID0gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGUsIHRoaXMudHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKGltcG9ydERhdGEgJiYgaW1wb3J0RGF0YS5zeW1ib2xOYW1lID09PSBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUgJiZcbiAgICAgICAgICBpbXBvcnREYXRhLm1vZHVsZU5hbWUgPT09IEhBTU1FUl9DT05GSUdfVE9LRU5fTU9EVUxFKSB7XG4gICAgICAgIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5wdXNoKFxuICAgICAgICAgICAge25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0OiB0cy5pc0ltcG9ydFNwZWNpZmllcihub2RlLnBhcmVudCl9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBIYW1tZXJNb2R1bGUgZnJvbVxuICAgKiBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi4gSWYgc28sIGtlZXBzIHRyYWNrIG9mIHRoZSByZWZlcmVuY2UuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0ZvckhhbW1lck1vZHVsZVJlZmVyZW5jZShub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgICAgY29uc3QgaW1wb3J0RGF0YSA9IGdldEltcG9ydE9mSWRlbnRpZmllcihub2RlLCB0aGlzLnR5cGVDaGVja2VyKTtcbiAgICAgIGlmIChpbXBvcnREYXRhICYmIGltcG9ydERhdGEuc3ltYm9sTmFtZSA9PT0gSEFNTUVSX01PRFVMRV9OQU1FICYmXG4gICAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lID09PSBIQU1NRVJfTU9EVUxFX0lNUE9SVCkge1xuICAgICAgICB0aGlzLl9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzLnB1c2goXG4gICAgICAgICAgICB7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnQ6IHRzLmlzSW1wb3J0U3BlY2lmaWVyKG5vZGUucGFyZW50KX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYW4gaW1wb3J0IHRvIHRoZSBIYW1tZXJKUyBwYWNrYWdlLiBJbXBvcnRzIHRvXG4gICAqIEhhbW1lckpTIHdoaWNoIGxvYWQgc3BlY2lmaWMgc3ltYm9scyBmcm9tIHRoZSBwYWNrYWdlIGFyZSBjb25zaWRlcmVkIGFzXG4gICAqIHJ1bnRpbWUgdXNhZ2Ugb2YgSGFtbWVyLiBlLmcuIGBpbXBvcnQge1N5bWJvbH0gZnJvbSBcImhhbW1lcmpzXCI7YC5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrSGFtbWVySW1wb3J0cyhub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgJiYgdHMuaXNTdHJpbmdMaXRlcmFsKG5vZGUubW9kdWxlU3BlY2lmaWVyKSAmJlxuICAgICAgICBub2RlLm1vZHVsZVNwZWNpZmllci50ZXh0ID09PSBIQU1NRVJfTU9EVUxFX1NQRUNJRklFUikge1xuICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gaW1wb3J0IHRvIEhhbW1lckpTIHRoYXQgaW1wb3J0cyBzeW1ib2xzLCBvciBpcyBuYW1lc3BhY2VkXG4gICAgICAvLyAoZS5nLiBcImltcG9ydCB7QSwgQn0gZnJvbSAuLi5cIiBvciBcImltcG9ydCAqIGFzIGhhbW1lciBmcm9tIC4uLlwiKSwgdGhlbiB3ZVxuICAgICAgLy8gYXNzdW1lIHRoYXQgc29tZSBleHBvcnRzIGFyZSB1c2VkIGF0IHJ1bnRpbWUuXG4gICAgICBpZiAobm9kZS5pbXBvcnRDbGF1c2UgJiZcbiAgICAgICAgICAhKG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MgJiYgdHMuaXNOYW1lZEltcG9ydHMobm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykgJiZcbiAgICAgICAgICAgIG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHMubGVuZ3RoID09PSAwKSkge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2luc3RhbGxJbXBvcnRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBhY2Nlc3NlcyB0aGUgZ2xvYmFsIFwiSGFtbWVyXCIgc3ltYm9sIGF0IHJ1bnRpbWUuIElmIHNvLFxuICAgKiB0aGUgbWlncmF0aW9uIHJ1bGUgc3RhdGUgd2lsbCBiZSB1cGRhdGVkIHRvIHJlZmxlY3QgdGhhdCBIYW1tZXIgaXMgdXNlZCBhdCBydW50aW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JSdW50aW1lSGFtbWVyVXNhZ2Uobm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0aGlzLl91c2VkSW5SdW50aW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRGV0ZWN0cyB1c2FnZXMgb2YgXCJ3aW5kb3cuSGFtbWVyXCIuXG4gICAgaWYgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUpICYmIG5vZGUubmFtZS50ZXh0ID09PSAnSGFtbWVyJykge1xuICAgICAgY29uc3Qgb3JpZ2luRXhwciA9IHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgICAgIGlmICh0cy5pc0lkZW50aWZpZXIob3JpZ2luRXhwcikgJiYgb3JpZ2luRXhwci50ZXh0ID09PSAnd2luZG93Jykge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZXRlY3RzIHVzYWdlcyBvZiBcIndpbmRvd1snSGFtbWVyJ11cIi5cbiAgICBpZiAodHMuaXNFbGVtZW50QWNjZXNzRXhwcmVzc2lvbihub2RlKSAmJiB0cy5pc1N0cmluZ0xpdGVyYWwobm9kZS5hcmd1bWVudEV4cHJlc3Npb24pICYmXG4gICAgICAgIG5vZGUuYXJndW1lbnRFeHByZXNzaW9uLnRleHQgPT09ICdIYW1tZXInKSB7XG4gICAgICBjb25zdCBvcmlnaW5FeHByID0gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihvcmlnaW5FeHByKSAmJiBvcmlnaW5FeHByLnRleHQgPT09ICd3aW5kb3cnKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZXMgdXNhZ2VzIG9mIHBsYWluIGlkZW50aWZpZXIgd2l0aCB0aGUgbmFtZSBcIkhhbW1lclwiLiBUaGVzZSB1c2FnZVxuICAgIC8vIGFyZSB2YWxpZCBpZiB0aGV5IHJlc29sdmUgdG8gXCJAdHlwZXMvaGFtbWVyanNcIi4gZS5nLiBcIm5ldyBIYW1tZXIobXlFbGVtZW50KVwiLlxuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkgJiYgbm9kZS50ZXh0ID09PSAnSGFtbWVyJyAmJlxuICAgICAgICAhdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZS5wYXJlbnQpICYmICF0cy5pc0VsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKG5vZGUucGFyZW50KSkge1xuICAgICAgY29uc3Qgc3ltYm9sID0gdGhpcy5fZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZSk7XG4gICAgICBpZiAoc3ltYm9sICYmIHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uICYmXG4gICAgICAgICAgc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lLmluY2x1ZGVzKCdAdHlwZXMvaGFtbWVyanMnKSkge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIHJlZmVyZW5jZXMgdGhlIGdlc3R1cmUgY29uZmlnIGZyb20gQW5ndWxhciBNYXRlcmlhbC5cbiAgICogSWYgc28sIHdlIGtlZXAgdHJhY2sgb2YgdGhlIGZvdW5kIHN5bWJvbCByZWZlcmVuY2UuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0Zvck1hdGVyaWFsR2VzdHVyZUNvbmZpZyhub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgICAgY29uc3QgaW1wb3J0RGF0YSA9IGdldEltcG9ydE9mSWRlbnRpZmllcihub2RlLCB0aGlzLnR5cGVDaGVja2VyKTtcbiAgICAgIGlmIChpbXBvcnREYXRhICYmIGltcG9ydERhdGEuc3ltYm9sTmFtZSA9PT0gR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSAmJlxuICAgICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZS5zdGFydHNXaXRoKCdAYW5ndWxhci9tYXRlcmlhbC8nKSkge1xuICAgICAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5wdXNoKFxuICAgICAgICAgICAge25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0OiB0cy5pc0ltcG9ydFNwZWNpZmllcihub2RlLnBhcmVudCl9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBIYW1tZXIgZ2VzdHVyZSBjb25maWcgdG9rZW4gcmVmZXJlbmNlIGlzIHBhcnQgb2YgYW5cbiAgICogQW5ndWxhciBwcm92aWRlciBkZWZpbml0aW9uIHRoYXQgc2V0cyB1cCBhIGN1c3RvbSBnZXN0dXJlIGNvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9yQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKHRva2VuUmVmOiBJZGVudGlmaWVyUmVmZXJlbmNlKTogYm9vbGVhbiB7XG4gICAgLy8gV2FsayB1cCB0aGUgdHJlZSB0byBsb29rIGZvciBhIHBhcmVudCBwcm9wZXJ0eSBhc3NpZ25tZW50IG9mIHRoZVxuICAgIC8vIHJlZmVyZW5jZSB0byB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnIHRva2VuLlxuICAgIGxldCBwcm9wZXJ0eUFzc2lnbm1lbnQ6IHRzLk5vZGUgPSB0b2tlblJlZi5ub2RlO1xuICAgIHdoaWxlIChwcm9wZXJ0eUFzc2lnbm1lbnQgJiYgIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5QXNzaWdubWVudCkpIHtcbiAgICAgIHByb3BlcnR5QXNzaWdubWVudCA9IHByb3BlcnR5QXNzaWdubWVudC5wYXJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKCFwcm9wZXJ0eUFzc2lnbm1lbnQgfHwgIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5QXNzaWdubWVudCkgfHxcbiAgICAgICAgZ2V0UHJvcGVydHlOYW1lVGV4dChwcm9wZXJ0eUFzc2lnbm1lbnQubmFtZSkgIT09ICdwcm92aWRlJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG9iamVjdExpdGVyYWxFeHByID0gcHJvcGVydHlBc3NpZ25tZW50LnBhcmVudDtcbiAgICBjb25zdCBtYXRjaGluZ0lkZW50aWZpZXJzID0gZmluZE1hdGNoaW5nQ2hpbGROb2RlcyhvYmplY3RMaXRlcmFsRXhwciwgdHMuaXNJZGVudGlmaWVyKTtcblxuICAgIC8vIFdlIG5haXZlbHkgYXNzdW1lIHRoYXQgaWYgdGhlcmUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIFwiR2VzdHVyZUNvbmZpZ1wiIGV4cG9ydFxuICAgIC8vIGZyb20gQW5ndWxhciBNYXRlcmlhbCBpbiB0aGUgcHJvdmlkZXIgbGl0ZXJhbCwgdGhhdCB0aGUgcHJvdmlkZXIgc2V0cyB1cCB0aGVcbiAgICAvLyBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgIHJldHVybiAhdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuc29tZShyID0+IG1hdGNoaW5nSWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBhbiBhdmFpbGFibGUgZmlsZSBuYW1lIGZvciB0aGUgZ2VzdHVyZSBjb25maWcgd2hpY2ggc2hvdWxkXG4gICAqIGJlIHN0b3JlZCBpbiB0aGUgc3BlY2lmaWVkIGZpbGUgcGF0aC5cbiAgICovXG4gIHByaXZhdGUgX2dldEF2YWlsYWJsZUdlc3R1cmVDb25maWdGaWxlTmFtZShzb3VyY2VSb290OiBEZXZraXRQYXRoKSB7XG4gICAgaWYgKCF0aGlzLnRyZWUuZXhpc3RzKGRldmtpdEpvaW4oc291cmNlUm9vdCwgYCR7R0VTVFVSRV9DT05GSUdfRklMRV9OQU1FfS50c2ApKSkge1xuICAgICAgcmV0dXJuIGAke0dFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRX0udHNgO1xuICAgIH1cblxuICAgIGxldCBwb3NzaWJsZU5hbWUgPSBgJHtHRVNUVVJFX0NPTkZJR19GSUxFX05BTUV9LWA7XG4gICAgbGV0IGluZGV4ID0gMTtcbiAgICB3aGlsZSAodGhpcy50cmVlLmV4aXN0cyhkZXZraXRKb2luKHNvdXJjZVJvb3QsIGAke3Bvc3NpYmxlTmFtZX0tJHtpbmRleH0udHNgKSkpIHtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICAgIHJldHVybiBgJHtwb3NzaWJsZU5hbWUgKyBpbmRleH0udHNgO1xuICB9XG5cbiAgLyoqIFJlcGxhY2VzIGEgZ2l2ZW4gZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlIHdpdGggYSBuZXcgaW1wb3J0LiAqL1xuICBwcml2YXRlIF9yZXBsYWNlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZShcbiAgICAgIHtub2RlLCBpbXBvcnREYXRhLCBpc0ltcG9ydH06IElkZW50aWZpZXJSZWZlcmVuY2UsIHN5bWJvbE5hbWU6IHN0cmluZyxcbiAgICAgIG1vZHVsZVNwZWNpZmllcjogc3RyaW5nKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5nZXRVcGRhdGVSZWNvcmRlcihzb3VyY2VGaWxlLmZpbGVOYW1lKTtcblxuICAgIC8vIExpc3Qgb2YgYWxsIGlkZW50aWZpZXJzIHJlZmVycmluZyB0byB0aGUgZ2VzdHVyZSBjb25maWcgaW4gdGhlIGN1cnJlbnQgZmlsZS4gVGhpc1xuICAgIC8vIGFsbG93cyB1cyB0byBhZGQgYW4gaW1wb3J0IGZvciB0aGUgY29waWVkIGdlc3R1cmUgY29uZmlndXJhdGlvbiB3aXRob3V0IGdlbmVyYXRpbmcgYVxuICAgIC8vIG5ldyBpZGVudGlmaWVyIGZvciB0aGUgaW1wb3J0IHRvIGF2b2lkIGNvbGxpc2lvbnMuIGkuZS4gXCJHZXN0dXJlQ29uZmlnXzFcIi4gVGhlIGltcG9ydFxuICAgIC8vIG1hbmFnZXIgY2hlY2tzIGZvciBwb3NzaWJsZSBuYW1lIGNvbGxpc2lvbnMsIGJ1dCBpcyBhYmxlIHRvIGlnbm9yZSBzcGVjaWZpYyBpZGVudGlmaWVycy5cbiAgICAvLyBXZSB1c2UgdGhpcyB0byBpZ25vcmUgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIG9yaWdpbmFsIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcsXG4gICAgLy8gYmVjYXVzZSB0aGVzZSB3aWxsIGJlIHJlcGxhY2VkIGFuZCB0aGVyZWZvcmUgd2lsbCBub3QgaW50ZXJmZXJlLlxuICAgIGNvbnN0IGdlc3R1cmVJZGVudGlmaWVyc0luRmlsZSA9IHRoaXMuX2dldEdlc3R1cmVDb25maWdJZGVudGlmaWVyc09mRmlsZShzb3VyY2VGaWxlKTtcblxuICAgIC8vIElmIHRoZSBwYXJlbnQgb2YgdGhlIGlkZW50aWZpZXIgaXMgYWNjZXNzZWQgdGhyb3VnaCBhIG5hbWVzcGFjZSwgd2UgY2FuIGp1c3RcbiAgICAvLyBpbXBvcnQgdGhlIG5ldyBnZXN0dXJlIGNvbmZpZyB3aXRob3V0IHJld3JpdGluZyB0aGUgaW1wb3J0IGRlY2xhcmF0aW9uIGJlY2F1c2VcbiAgICAvLyB0aGUgY29uZmlnIGhhcyBiZWVuIGltcG9ydGVkIHRocm91Z2ggYSBuYW1lc3BhY2VkIGltcG9ydC5cbiAgICBpZiAoaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2Vzcyhub2RlKSkge1xuICAgICAgY29uc3QgbmV3RXhwcmVzc2lvbiA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICAgIHNvdXJjZUZpbGUsIHN5bWJvbE5hbWUsIG1vZHVsZVNwZWNpZmllciwgZmFsc2UsIGdlc3R1cmVJZGVudGlmaWVyc0luRmlsZSk7XG5cbiAgICAgIHJlY29yZGVyLnJlbW92ZShub2RlLnBhcmVudC5nZXRTdGFydCgpLCBub2RlLnBhcmVudC5nZXRXaWR0aCgpKTtcbiAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5vZGUucGFyZW50LmdldFN0YXJ0KCksIHRoaXMuX3ByaW50Tm9kZShuZXdFeHByZXNzaW9uLCBzb3VyY2VGaWxlKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRGVsZXRlIHRoZSBvbGQgaW1wb3J0IHRvIHRoZSBcIkdlc3R1cmVDb25maWdcIi5cbiAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChcbiAgICAgICAgc291cmNlRmlsZSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lKTtcblxuICAgIC8vIElmIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBpcyBub3QgZnJvbSBpbnNpZGUgb2YgYSBpbXBvcnQsIHdlIG5lZWQgdG8gYWRkIGEgbmV3XG4gICAgLy8gaW1wb3J0IHRvIHRoZSBjb3BpZWQgZ2VzdHVyZSBjb25maWcgYW5kIHJlcGxhY2UgdGhlIGlkZW50aWZpZXIuIEZvciByZWZlcmVuY2VzXG4gICAgLy8gd2l0aGluIGFuIGltcG9ydCwgd2UgZG8gbm90aGluZyBidXQgcmVtb3ZpbmcgdGhlIGFjdHVhbCBpbXBvcnQuIFRoaXMgYWxsb3dzIHVzXG4gICAgLy8gdG8gcmVtb3ZlIHVudXNlZCBpbXBvcnRzIHRvIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICBpZiAoIWlzSW1wb3J0KSB7XG4gICAgICBjb25zdCBuZXdFeHByZXNzaW9uID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgICAgc291cmNlRmlsZSwgc3ltYm9sTmFtZSwgbW9kdWxlU3BlY2lmaWVyLCBmYWxzZSwgZ2VzdHVyZUlkZW50aWZpZXJzSW5GaWxlKTtcblxuICAgICAgcmVjb3JkZXIucmVtb3ZlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpKTtcbiAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5vZGUuZ2V0U3RhcnQoKSwgdGhpcy5fcHJpbnROb2RlKG5ld0V4cHJlc3Npb24sIHNvdXJjZUZpbGUpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGdpdmVuIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZSBhbmQgaXRzIGNvcnJlc3BvbmRpbmcgaW1wb3J0IGZyb21cbiAgICogaXRzIGNvbnRhaW5pbmcgc291cmNlIGZpbGUuIEltcG9ydHMgd2lsbCBiZSBhbHdheXMgcmVtb3ZlZCwgYnV0IGluIHNvbWUgY2FzZXMsXG4gICAqIHdoZXJlIGl0J3Mgbm90IGd1YXJhbnRlZWQgdGhhdCBhIHJlbW92YWwgY2FuIGJlIHBlcmZvcm1lZCBzYWZlbHksIHdlIGp1c3RcbiAgICogY3JlYXRlIGEgbWlncmF0aW9uIGZhaWx1cmUgKGFuZCBhZGQgYSBUT0RPIGlmIHBvc3NpYmxlKS5cbiAgICovXG4gIHByaXZhdGUgX3JlbW92ZUdlc3R1cmVDb25maWdSZWZlcmVuY2Uoe25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0fTogSWRlbnRpZmllclJlZmVyZW5jZSkge1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZ2V0VXBkYXRlUmVjb3JkZXIoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgLy8gT25seSByZW1vdmUgdGhlIGltcG9ydCBmb3IgdGhlIGdlc3R1cmUgY29uZmlnIGlmIHRoZSBnZXN0dXJlIGNvbmZpZyBoYXNcbiAgICAvLyBiZWVuIGFjY2Vzc2VkIHRocm91Z2ggYSBub24tbmFtZXNwYWNlZCBpZGVudGlmaWVyIGFjY2Vzcy5cbiAgICBpZiAoIWlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZSkpIHtcbiAgICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICAgIHNvdXJjZUZpbGUsIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsIGltcG9ydERhdGEubW9kdWxlTmFtZSk7XG4gICAgfVxuXG4gICAgLy8gRm9yIHJlZmVyZW5jZXMgZnJvbSB3aXRoaW4gYW4gaW1wb3J0LCB3ZSBkbyBub3QgbmVlZCB0byBkbyBhbnl0aGluZyBvdGhlciB0aGFuXG4gICAgLy8gcmVtb3ZpbmcgdGhlIGltcG9ydC4gRm9yIG90aGVyIHJlZmVyZW5jZXMsIHdlIHJlbW92ZSB0aGUgaW1wb3J0IGFuZCB0aGUgcmVmZXJlbmNlXG4gICAgLy8gaWRlbnRpZmllciBpZiB1c2VkIGluc2lkZSBvZiBhIHByb3ZpZGVyIGRlZmluaXRpb24uXG4gICAgaWYgKGlzSW1wb3J0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdmlkZXJBc3NpZ25tZW50ID0gbm9kZS5wYXJlbnQ7XG5cbiAgICAvLyBPbmx5IHJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyB3aGljaCBhcmUgcGFydCBvZiBhIHN0YXRpY2FsbHlcbiAgICAvLyBhbmFseXphYmxlIHByb3ZpZGVyIGRlZmluaXRpb24uIFdlIG9ubHkgc3VwcG9ydCB0aGUgY29tbW9uIGNhc2Ugb2YgYSBnZXN0dXJlXG4gICAgLy8gY29uZmlnIHByb3ZpZGVyIGRlZmluaXRpb24gd2hlcmUgdGhlIGNvbmZpZyBpcyBzZXQgdXAgdGhyb3VnaCBcInVzZUNsYXNzXCIuXG4gICAgLy8gT3RoZXJ3aXNlLCBpdCdzIG5vdCBndWFyYW50ZWVkIHRoYXQgd2UgY2FuIHNhZmVseSByZW1vdmUgdGhlIHByb3ZpZGVyIGRlZmluaXRpb24uXG4gICAgaWYgKCF0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwcm92aWRlckFzc2lnbm1lbnQpIHx8XG4gICAgICAgIGdldFByb3BlcnR5TmFtZVRleHQocHJvdmlkZXJBc3NpZ25tZW50Lm5hbWUpICE9PSAndXNlQ2xhc3MnKSB7XG4gICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7bm9kZSwgbWVzc2FnZTogQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1J9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvYmplY3RMaXRlcmFsRXhwciA9IHByb3ZpZGVyQXNzaWdubWVudC5wYXJlbnQ7XG4gICAgY29uc3QgcHJvdmlkZVRva2VuID0gb2JqZWN0TGl0ZXJhbEV4cHIucHJvcGVydGllcy5maW5kKFxuICAgICAgICAocCk6IHAgaXMgdHMuUHJvcGVydHlBc3NpZ25tZW50ID0+XG4gICAgICAgICAgICB0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwKSAmJiBnZXRQcm9wZXJ0eU5hbWVUZXh0KHAubmFtZSkgPT09ICdwcm92aWRlJyk7XG5cbiAgICAvLyBEbyBub3QgcmVtb3ZlIHRoZSByZWZlcmVuY2UgaWYgdGhlIGdlc3R1cmUgY29uZmlnIGlzIG5vdCBwYXJ0IG9mIGEgcHJvdmlkZXIgZGVmaW5pdGlvbixcbiAgICAvLyBvciBpZiB0aGUgcHJvdmlkZWQgdG9rZSBpcyBub3QgcmVmZXJyaW5nIHRvIHRoZSBrbm93biBIQU1NRVJfR0VTVFVSRV9DT05GSUcgdG9rZW5cbiAgICAvLyBmcm9tIHBsYXRmb3JtLWJyb3dzZXIuXG4gICAgaWYgKCFwcm92aWRlVG9rZW4gfHwgIXRoaXMuX2lzUmVmZXJlbmNlVG9IYW1tZXJDb25maWdUb2tlbihwcm92aWRlVG9rZW4uaW5pdGlhbGl6ZXIpKSB7XG4gICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7bm9kZSwgbWVzc2FnZTogQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1J9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDb2xsZWN0IGFsbCBuZXN0ZWQgaWRlbnRpZmllcnMgd2hpY2ggd2lsbCBiZSBkZWxldGVkLiBUaGlzIGhlbHBzIHVzXG4gICAgLy8gZGV0ZXJtaW5pbmcgaWYgd2UgY2FuIHJlbW92ZSBpbXBvcnRzIGZvciB0aGUgXCJIQU1NRVJfR0VTVFVSRV9DT05GSUdcIiB0b2tlbi5cbiAgICB0aGlzLl9kZWxldGVkSWRlbnRpZmllcnMucHVzaCguLi5maW5kTWF0Y2hpbmdDaGlsZE5vZGVzKG9iamVjdExpdGVyYWxFeHByLCB0cy5pc0lkZW50aWZpZXIpKTtcblxuICAgIC8vIEluIGNhc2UgdGhlIGZvdW5kIHByb3ZpZGVyIGRlZmluaXRpb24gaXMgbm90IHBhcnQgb2YgYW4gYXJyYXkgbGl0ZXJhbCxcbiAgICAvLyB3ZSBjYW5ub3Qgc2FmZWx5IHJlbW92ZSB0aGUgcHJvdmlkZXIuIFRoaXMgaXMgYmVjYXVzZSBpdCBjb3VsZCBiZSBkZWNsYXJlZFxuICAgIC8vIGFzIGEgdmFyaWFibGUuIGUuZy4gXCJjb25zdCBnZXN0dXJlUHJvdmlkZXIgPSB7cHJvdmlkZTogLi4sIHVzZUNsYXNzOiBHZXN0dXJlQ29uZmlnfVwiLlxuICAgIC8vIEluIHRoYXQgY2FzZSwgd2UganVzdCBhZGQgYW4gZW1wdHkgb2JqZWN0IGxpdGVyYWwgd2l0aCBUT0RPIGFuZCBwcmludCBhIGZhaWx1cmUuXG4gICAgaWYgKCF0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24ob2JqZWN0TGl0ZXJhbEV4cHIucGFyZW50KSkge1xuICAgICAgcmVjb3JkZXIucmVtb3ZlKG9iamVjdExpdGVyYWxFeHByLmdldFN0YXJ0KCksIG9iamVjdExpdGVyYWxFeHByLmdldFdpZHRoKCkpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQob2JqZWN0TGl0ZXJhbEV4cHIuZ2V0U3RhcnQoKSwgYC8qIFRPRE86IHJlbW92ZSAqLyB7fWApO1xuICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe1xuICAgICAgICBub2RlOiBvYmplY3RMaXRlcmFsRXhwcixcbiAgICAgICAgbWVzc2FnZTogYFVuYWJsZSB0byBkZWxldGUgcHJvdmlkZXIgZGVmaW5pdGlvbiBmb3IgXCJHZXN0dXJlQ29uZmlnXCIgY29tcGxldGVseS4gYCArXG4gICAgICAgICAgICBgUGxlYXNlIGNsZWFuIHVwIHRoZSBwcm92aWRlci5gXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmVzIHRoZSBvYmplY3QgbGl0ZXJhbCBmcm9tIHRoZSBwYXJlbnQgYXJyYXkgZXhwcmVzc2lvbi4gUmVtb3Zlc1xuICAgIC8vIHRoZSB0cmFpbGluZyBjb21tYSB0b2tlbiBpZiBwcmVzZW50LlxuICAgIHJlbW92ZUVsZW1lbnRGcm9tQXJyYXlFeHByZXNzaW9uKG9iamVjdExpdGVyYWxFeHByLCByZWNvcmRlcik7XG4gIH1cblxuICAvKiogUmVtb3ZlcyB0aGUgZ2l2ZW4gaGFtbWVyIGNvbmZpZyB0b2tlbiBpbXBvcnQgaWYgaXQgaXMgbm90IHVzZWQuICovXG4gIHByaXZhdGUgX3JlbW92ZUhhbW1lckNvbmZpZ1Rva2VuSW1wb3J0SWZVbnVzZWQoe25vZGUsIGltcG9ydERhdGF9OiBJZGVudGlmaWVyUmVmZXJlbmNlKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IGlzVG9rZW5Vc2VkID0gdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUoXG4gICAgICAgIHIgPT4gIXIuaXNJbXBvcnQgJiYgIWlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Moci5ub2RlKSAmJlxuICAgICAgICAgICAgci5ub2RlLmdldFNvdXJjZUZpbGUoKSA9PT0gc291cmNlRmlsZSAmJiAhdGhpcy5fZGVsZXRlZElkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpO1xuXG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB0byByZW1vdmUgdGhlIGltcG9ydCBmb3IgdGhlIHRva2VuIGlmIHRoZSB0b2tlbiBpc1xuICAgIC8vIHN0aWxsIHVzZWQgc29tZXdoZXJlLlxuICAgIGlmICghaXNUb2tlblVzZWQpIHtcbiAgICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICAgIHNvdXJjZUZpbGUsIEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVtb3ZlcyBIYW1tZXIgZnJvbSBhbGwgaW5kZXggSFRNTCBmaWxlcyBvZiB0aGUgZ2l2ZW4gcHJvamVjdC4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyRnJvbUluZGV4RmlsZShwcm9qZWN0OiBXb3Jrc3BhY2VQcm9qZWN0KSB7XG4gICAgY29uc3QgaW5kZXhGaWxlUGF0aHMgPSBnZXRQcm9qZWN0SW5kZXhGaWxlcyhwcm9qZWN0KTtcbiAgICBpbmRleEZpbGVQYXRocy5mb3JFYWNoKGZpbGVQYXRoID0+IHtcbiAgICAgIGlmICghdGhpcy50cmVlLmV4aXN0cyhmaWxlUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBodG1sQ29udGVudCA9IHRoaXMudHJlZS5yZWFkKGZpbGVQYXRoKSEudG9TdHJpbmcoJ3V0ZjgnKTtcbiAgICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5nZXRVcGRhdGVSZWNvcmRlcihmaWxlUGF0aCk7XG5cbiAgICAgIGZpbmRIYW1tZXJTY3JpcHRJbXBvcnRFbGVtZW50cyhodG1sQ29udGVudClcbiAgICAgICAgICAuZm9yRWFjaChlbCA9PiByZW1vdmVFbGVtZW50RnJvbUh0bWwoZWwsIHJlY29yZGVyKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogU2V0cyB1cCB0aGUgSGFtbWVyIGdlc3R1cmUgY29uZmlnIGluIHRoZSByb290IG1vZHVsZSBpZiBuZWVkZWQuICovXG4gIHByaXZhdGUgX3NldHVwTmV3R2VzdHVyZUNvbmZpZ0luUm9vdE1vZHVsZShwcm9qZWN0OiBXb3Jrc3BhY2VQcm9qZWN0LCBnZXN0dXJlQ29uZmlnUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgbWFpbkZpbGVQYXRoID0gam9pbih0aGlzLmJhc2VQYXRoLCBnZXRQcm9qZWN0TWFpbkZpbGUocHJvamVjdCkpO1xuICAgIGNvbnN0IHJvb3RNb2R1bGVTeW1ib2wgPSB0aGlzLl9nZXRSb290TW9kdWxlU3ltYm9sKG1haW5GaWxlUGF0aCk7XG5cbiAgICBpZiAocm9vdE1vZHVsZVN5bWJvbCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5mYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgZmlsZVBhdGg6IG1haW5GaWxlUGF0aCxcbiAgICAgICAgbWVzc2FnZTogYENvdWxkIG5vdCBzZXR1cCBIYW1tZXIgZ2VzdHVyZXMgaW4gbW9kdWxlLiBQbGVhc2UgYCArXG4gICAgICAgICAgICBgbWFudWFsbHkgZW5zdXJlIHRoYXQgdGhlIEhhbW1lciBnZXN0dXJlIGNvbmZpZyBpcyBzZXQgdXAuYCxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSByb290TW9kdWxlU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHRoaXMuYmFzZVBhdGgsIHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IG1ldGFkYXRhID0gZ2V0RGVjb3JhdG9yTWV0YWRhdGEoc291cmNlRmlsZSwgJ05nTW9kdWxlJywgJ0Bhbmd1bGFyL2NvcmUnKSBhc1xuICAgICAgICB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbltdO1xuXG4gICAgLy8gSWYgbm8gXCJOZ01vZHVsZVwiIGRlZmluaXRpb24gaXMgZm91bmQgaW5zaWRlIHRoZSBzb3VyY2UgZmlsZSwgd2UganVzdCBkbyBub3RoaW5nLlxuICAgIGlmICghbWV0YWRhdGEubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IHByb3ZpZGVyc0ZpZWxkID0gZ2V0TWV0YWRhdGFGaWVsZChtZXRhZGF0YVswXSwgJ3Byb3ZpZGVycycpWzBdO1xuICAgIGNvbnN0IHByb3ZpZGVySWRlbnRpZmllcnMgPVxuICAgICAgICBwcm92aWRlcnNGaWVsZCA/IGZpbmRNYXRjaGluZ0NoaWxkTm9kZXMocHJvdmlkZXJzRmllbGQsIHRzLmlzSWRlbnRpZmllcikgOiBudWxsO1xuICAgIGNvbnN0IGdlc3R1cmVDb25maWdFeHByID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgIHNvdXJjZUZpbGUsIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsXG4gICAgICAgIGdldE1vZHVsZVNwZWNpZmllcihnZXN0dXJlQ29uZmlnUGF0aCwgc291cmNlRmlsZS5maWxlTmFtZSksIGZhbHNlLFxuICAgICAgICB0aGlzLl9nZXRHZXN0dXJlQ29uZmlnSWRlbnRpZmllcnNPZkZpbGUoc291cmNlRmlsZSkpO1xuICAgIGNvbnN0IGhhbW1lckNvbmZpZ1Rva2VuRXhwciA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICBzb3VyY2VGaWxlLCBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUsIEhBTU1FUl9DT05GSUdfVE9LRU5fTU9EVUxFKTtcbiAgICBjb25zdCBuZXdQcm92aWRlck5vZGUgPSB0cy5jcmVhdGVPYmplY3RMaXRlcmFsKFtcbiAgICAgIHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgncHJvdmlkZScsIGhhbW1lckNvbmZpZ1Rva2VuRXhwciksXG4gICAgICB0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQoJ3VzZUNsYXNzJywgZ2VzdHVyZUNvbmZpZ0V4cHIpXG4gICAgXSk7XG5cbiAgICAvLyBJZiB0aGUgcHJvdmlkZXJzIGZpZWxkIGV4aXN0cyBhbmQgYWxyZWFkeSBjb250YWlucyByZWZlcmVuY2VzIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZVxuICAgIC8vIGNvbmZpZyB0b2tlbiBhbmQgdGhlIGdlc3R1cmUgY29uZmlnLCB3ZSBuYWl2ZWx5IGFzc3VtZSB0aGF0IHRoZSBnZXN0dXJlIGNvbmZpZyBpc1xuICAgIC8vIGFscmVhZHkgc2V0IHVwLiBXZSBvbmx5IHdhbnQgdG8gYWRkIHRoZSBnZXN0dXJlIGNvbmZpZyBwcm92aWRlciBpZiBpdCBpcyBub3Qgc2V0IHVwLlxuICAgIGlmICghcHJvdmlkZXJJZGVudGlmaWVycyB8fFxuICAgICAgICAhKHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gcHJvdmlkZXJJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKSAmJlxuICAgICAgICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLnNvbWUociA9PiBwcm92aWRlcklkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpKSkge1xuICAgICAgYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhKFxuICAgICAgICAgIHNvdXJjZUZpbGUsIHJlbGF0aXZlUGF0aCwgJ3Byb3ZpZGVycycsIHRoaXMuX3ByaW50Tm9kZShuZXdQcm92aWRlck5vZGUsIHNvdXJjZUZpbGUpLCBudWxsKVxuICAgICAgICAgIC5mb3JFYWNoKGNoYW5nZSA9PiB7XG4gICAgICAgICAgICBpZiAoY2hhbmdlIGluc3RhbmNlb2YgSW5zZXJ0Q2hhbmdlKSB7XG4gICAgICAgICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIFR5cGVTY3JpcHQgc3ltYm9sIG9mIHRoZSByb290IG1vZHVsZSBieSBsb29raW5nIGZvciB0aGUgbW9kdWxlXG4gICAqIGJvb3RzdHJhcCBleHByZXNzaW9uIGluIHRoZSBzcGVjaWZpZWQgc291cmNlIGZpbGUuXG4gICAqL1xuICBwcml2YXRlIF9nZXRSb290TW9kdWxlU3ltYm9sKG1haW5GaWxlUGF0aDogc3RyaW5nKTogdHMuU3ltYm9sfG51bGwge1xuICAgIGNvbnN0IG1haW5GaWxlID0gdGhpcy5wcm9ncmFtLmdldFNvdXJjZUZpbGUobWFpbkZpbGVQYXRoKTtcbiAgICBpZiAoIW1haW5GaWxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhcHBNb2R1bGVFeHByID0gZmluZE1haW5Nb2R1bGVFeHByZXNzaW9uKG1haW5GaWxlKTtcbiAgICBpZiAoIWFwcE1vZHVsZUV4cHIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGFwcE1vZHVsZVN5bWJvbCA9IHRoaXMuX2dldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKHVud3JhcEV4cHJlc3Npb24oYXBwTW9kdWxlRXhwcikpO1xuICAgIGlmICghYXBwTW9kdWxlU3ltYm9sIHx8ICFhcHBNb2R1bGVTeW1ib2wudmFsdWVEZWNsYXJhdGlvbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBhcHBNb2R1bGVTeW1ib2w7XG4gIH1cblxuICAvKiogU2V0cyB1cCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpbiB0aGUgcm9vdCBtb2R1bGUgb2YgdGhlIHByb2plY3QuICovXG4gIHByaXZhdGUgX3NldHVwSGFtbWVyTW9kdWxlSW5Sb290TW9kdWxlKHByb2plY3Q6IFdvcmtzcGFjZVByb2plY3QpIHtcbiAgICBjb25zdCBtYWluRmlsZVBhdGggPSBqb2luKHRoaXMuYmFzZVBhdGgsIGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KSk7XG4gICAgY29uc3Qgcm9vdE1vZHVsZVN5bWJvbCA9IHRoaXMuX2dldFJvb3RNb2R1bGVTeW1ib2wobWFpbkZpbGVQYXRoKTtcblxuICAgIGlmIChyb290TW9kdWxlU3ltYm9sID09PSBudWxsKSB7XG4gICAgICB0aGlzLmZhaWx1cmVzLnB1c2goe1xuICAgICAgICBmaWxlUGF0aDogbWFpbkZpbGVQYXRoLFxuICAgICAgICBtZXNzYWdlOiBgQ291bGQgbm90IHNldHVwIEhhbW1lck1vZHVsZS4gUGxlYXNlIG1hbnVhbGx5IHNldCB1cCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBgICtcbiAgICAgICAgICAgIGBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLmAsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VGaWxlID0gcm9vdE1vZHVsZVN5bWJvbC52YWx1ZURlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCByZWxhdGl2ZVBhdGggPSByZWxhdGl2ZSh0aGlzLmJhc2VQYXRoLCBzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICBjb25zdCBtZXRhZGF0YSA9IGdldERlY29yYXRvck1ldGFkYXRhKHNvdXJjZUZpbGUsICdOZ01vZHVsZScsICdAYW5ndWxhci9jb3JlJykgYXNcbiAgICAgICAgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25bXTtcbiAgICBpZiAoIW1ldGFkYXRhLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGltcG9ydHNGaWVsZCA9IGdldE1ldGFkYXRhRmllbGQobWV0YWRhdGFbMF0sICdpbXBvcnRzJylbMF07XG4gICAgY29uc3QgaW1wb3J0SWRlbnRpZmllcnMgPVxuICAgICAgICBpbXBvcnRzRmllbGQgPyBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzKGltcG9ydHNGaWVsZCwgdHMuaXNJZGVudGlmaWVyKSA6IG51bGw7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IGhhbW1lck1vZHVsZUV4cHIgPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgc291cmNlRmlsZSwgSEFNTUVSX01PRFVMRV9OQU1FLCBIQU1NRVJfTU9EVUxFX0lNUE9SVCk7XG5cbiAgICAvLyBJZiB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpcyBub3QgYWxyZWFkeSBpbXBvcnRlZCBpbiB0aGUgYXBwIG1vZHVsZSwgd2Ugc2V0IGl0IHVwXG4gICAgLy8gYnkgYWRkaW5nIGl0IHRvIHRoZSBcImltcG9ydHNcIiBmaWVsZCBvZiB0aGUgYXBwIG1vZHVsZS5cbiAgICBpZiAoIWltcG9ydElkZW50aWZpZXJzIHx8XG4gICAgICAgICF0aGlzLl9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzLnNvbWUociA9PiBpbXBvcnRJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKSkge1xuICAgICAgYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhKFxuICAgICAgICAgIHNvdXJjZUZpbGUsIHJlbGF0aXZlUGF0aCwgJ2ltcG9ydHMnLCB0aGlzLl9wcmludE5vZGUoaGFtbWVyTW9kdWxlRXhwciwgc291cmNlRmlsZSksIG51bGwpXG4gICAgICAgICAgLmZvckVhY2goY2hhbmdlID0+IHtcbiAgICAgICAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRDaGFuZ2UpIHtcbiAgICAgICAgICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogUHJpbnRzIGEgZ2l2ZW4gbm9kZSB3aXRoaW4gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS4gKi9cbiAgcHJpdmF0ZSBfcHJpbnROb2RlKG5vZGU6IHRzLk5vZGUsIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgbm9kZSwgc291cmNlRmlsZSk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgcmVmZXJlbmNlZCBnZXN0dXJlIGNvbmZpZyBpZGVudGlmaWVycyBvZiBhIGdpdmVuIHNvdXJjZSBmaWxlICovXG4gIHByaXZhdGUgX2dldEdlc3R1cmVDb25maWdJZGVudGlmaWVyc09mRmlsZShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogdHMuSWRlbnRpZmllcltdIHtcbiAgICByZXR1cm4gdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuZmlsdGVyKGQgPT4gZC5ub2RlLmdldFNvdXJjZUZpbGUoKSA9PT0gc291cmNlRmlsZSlcbiAgICAgICAgLm1hcChkID0+IGQubm9kZSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc3ltYm9sIHRoYXQgY29udGFpbnMgdGhlIHZhbHVlIGRlY2xhcmF0aW9uIG9mIHRoZSBzcGVjaWZpZWQgbm9kZS4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZTogdHMuTm9kZSk6IHRzLlN5bWJvbHx1bmRlZmluZWQge1xuICAgIGNvbnN0IHN5bWJvbCA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihub2RlKTtcblxuICAgIC8vIFN5bWJvbHMgY2FuIGJlIGFsaWFzZXMgb2YgdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC4gZS5nLiBpbiBuYW1lZCBpbXBvcnQgc3BlY2lmaWVycy5cbiAgICAvLyBXZSBuZWVkIHRvIHJlc29sdmUgdGhlIGFsaWFzZWQgc3ltYm9sIGJhY2sgdG8gdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYml0d2lzZVxuICAgIGlmIChzeW1ib2wgJiYgKHN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSAhPT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudHlwZUNoZWNrZXIuZ2V0QWxpYXNlZFN5bWJvbChzeW1ib2wpO1xuICAgIH1cbiAgICByZXR1cm4gc3ltYm9sO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBleHByZXNzaW9uIHJlc29sdmVzIHRvIGEgaGFtbWVyIGdlc3R1cmUgY29uZmlnXG4gICAqIHRva2VuIHJlZmVyZW5jZSBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfaXNSZWZlcmVuY2VUb0hhbW1lckNvbmZpZ1Rva2VuKGV4cHI6IHRzLkV4cHJlc3Npb24pIHtcbiAgICBjb25zdCB1bndyYXBwZWQgPSB1bndyYXBFeHByZXNzaW9uKGV4cHIpO1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIodW53cmFwcGVkKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gci5ub2RlID09PSB1bndyYXBwZWQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24odW53cmFwcGVkKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gci5ub2RlID09PSB1bndyYXBwZWQubmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIG1pZ3JhdGlvbiBmYWlsdXJlcyBvZiB0aGUgY29sbGVjdGVkIG5vZGUgZmFpbHVyZXMuIFRoZSByZXR1cm5lZCBtaWdyYXRpb25cbiAgICogZmFpbHVyZXMgYXJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgcG9zdC1taWdyYXRpb24gc3RhdGUgb2Ygc291cmNlIGZpbGVzLiBNZWFuaW5nXG4gICAqIHRoYXQgZmFpbHVyZSBwb3NpdGlvbnMgYXJlIGNvcnJlY3RlZCBpZiBzb3VyY2UgZmlsZSBtb2RpZmljYXRpb25zIHNoaWZ0ZWQgbGluZXMuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVNaWdyYXRpb25GYWlsdXJlcygpOiBNaWdyYXRpb25GYWlsdXJlW10ge1xuICAgIHJldHVybiB0aGlzLl9ub2RlRmFpbHVyZXMubWFwKCh7bm9kZSwgbWVzc2FnZX0pID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICAgIGNvbnN0IG9mZnNldCA9IG5vZGUuZ2V0U3RhcnQoKTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdHMuZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24obm9kZS5nZXRTb3VyY2VGaWxlKCksIG5vZGUuZ2V0U3RhcnQoKSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGlvbjogdGhpcy5faW1wb3J0TWFuYWdlci5jb3JyZWN0Tm9kZVBvc2l0aW9uKG5vZGUsIG9mZnNldCwgcG9zaXRpb24pLFxuICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICBmaWxlUGF0aDogc291cmNlRmlsZS5maWxlTmFtZSxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgcHJvamVjdCBmcm9tIHRoZSBjdXJyZW50IHByb2dyYW0gb3IgdGhyb3dzIGlmIG5vIHByb2plY3RcbiAgICogY291bGQgYmUgZm91bmQuXG4gICAqL1xuICBwcml2YXRlIF9nZXRQcm9qZWN0T3JUaHJvdygpOiBXb3Jrc3BhY2VQcm9qZWN0IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UodGhpcy50cmVlKTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Qcm9ncmFtKHdvcmtzcGFjZSwgdGhpcy5wcm9ncmFtKTtcblxuICAgIGlmICghcHJvamVjdCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oXG4gICAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIHByb2plY3QgdG8gcGVyZm9ybSBIYW1tZXJKUyB2OSBtaWdyYXRpb24uICcgK1xuICAgICAgICAgICdQbGVhc2UgZW5zdXJlIHlvdXIgd29ya3NwYWNlIGNvbmZpZ3VyYXRpb24gZGVmaW5lcyBhIHByb2plY3QuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2plY3Q7XG4gIH1cblxuICAvKiogR2xvYmFsIHN0YXRlIG9mIHdoZXRoZXIgSGFtbWVyIGlzIHVzZWQgaW4gYW55IGFuYWx5emVkIHByb2plY3QgdGFyZ2V0LiAqL1xuICBzdGF0aWMgZ2xvYmFsVXNlc0hhbW1lciA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBTdGF0aWMgbWlncmF0aW9uIHJ1bGUgbWV0aG9kIHRoYXQgd2lsbCBiZSBjYWxsZWQgb25jZSBhbGwgcHJvamVjdCB0YXJnZXRzXG4gICAqIGhhdmUgYmVlbiBtaWdyYXRlZCBpbmRpdmlkdWFsbHkuIFRoaXMgbWV0aG9kIGNhbiBiZSB1c2VkIHRvIG1ha2UgY2hhbmdlcyBiYXNlZFxuICAgKiBvbiB0aGUgYW5hbHlzaXMgb2YgdGhlIGluZGl2aWR1YWwgdGFyZ2V0cy4gRm9yIGV4YW1wbGU6IHdlIG9ubHkgcmVtb3ZlIEhhbW1lclxuICAgKiBmcm9tIHRoZSBcInBhY2thZ2UuanNvblwiIGlmIGl0IGlzIG5vdCB1c2VkIGluICphbnkqIHByb2plY3QgdGFyZ2V0LlxuICAgKi9cbiAgc3RhdGljIGdsb2JhbFBvc3RNaWdyYXRpb24odHJlZTogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCk6IFBvc3RNaWdyYXRpb25BY3Rpb24ge1xuICAgIC8vIEFsd2F5cyBub3RpZnkgdGhlIGRldmVsb3BlciB0aGF0IHRoZSBIYW1tZXIgdjkgbWlncmF0aW9uIGRvZXMgbm90IG1pZ3JhdGUgdGVzdHMuXG4gICAgY29udGV4dC5sb2dnZXIuaW5mbyhjaGFsay55ZWxsb3coXG4gICAgICAgICdcXG7imqAgIEdlbmVyYWwgbm90aWNlOiBUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIENvbXBvbmVudHMgaXMgbm90IGFibGUgdG8gJyArXG4gICAgICAgICdtaWdyYXRlIHRlc3RzLiBQbGVhc2UgbWFudWFsbHkgY2xlYW4gdXAgdGVzdHMgaW4geW91ciBwcm9qZWN0IGlmIHRoZXkgcmVseSBvbiAnICtcbiAgICAgICAgKHRoaXMuZ2xvYmFsVXNlc0hhbW1lciA/ICd0aGUgZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLicgOiAnSGFtbWVySlMuJykpKTtcbiAgICBjb250ZXh0LmxvZ2dlci5pbmZvKFxuICAgICAgICAnUmVhZCBtb3JlIGFib3V0IG1pZ3JhdGluZyB0ZXN0czogaHR0cHM6Ly9naXQuaW8vbmctbWF0ZXJpYWwtdjktaGFtbWVyLW1pZ3JhdGUtdGVzdHMnKTtcblxuICAgIGlmICghdGhpcy5nbG9iYWxVc2VzSGFtbWVyICYmIHRoaXMuX3JlbW92ZUhhbW1lckZyb21QYWNrYWdlSnNvbih0cmVlKSkge1xuICAgICAgLy8gU2luY2UgSGFtbWVyIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgd29ya3NwYWNlIFwicGFja2FnZS5qc29uXCIgZmlsZSxcbiAgICAgIC8vIHdlIHNjaGVkdWxlIGEgbm9kZSBwYWNrYWdlIGluc3RhbGwgdGFzayB0byByZWZyZXNoIHRoZSBsb2NrIGZpbGUuXG4gICAgICByZXR1cm4ge3J1blBhY2thZ2VNYW5hZ2VyOiB0cnVlfTtcbiAgICB9XG5cbiAgICAvLyBDbGVhbiBnbG9iYWwgc3RhdGUgb25jZSB0aGUgd29ya3NwYWNlIGhhcyBiZWVuIG1pZ3JhdGVkLiBUaGlzIGlzIHRlY2huaWNhbGx5XG4gICAgLy8gbm90IG5lY2Vzc2FyeSBpbiBcIm5nIHVwZGF0ZVwiLCBidXQgaW4gdGVzdHMgd2UgcmUtdXNlIHRoZSBzYW1lIHJ1bGUgY2xhc3MuXG4gICAgdGhpcy5nbG9iYWxVc2VzSGFtbWVyID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgaGFtbWVyIHBhY2thZ2UgZnJvbSB0aGUgd29ya3NwYWNlIFwicGFja2FnZS5qc29uXCIuXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgSGFtbWVyIHdhcyBzZXQgdXAgYW5kIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgXCJwYWNrYWdlLmpzb25cIlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgX3JlbW92ZUhhbW1lckZyb21QYWNrYWdlSnNvbih0cmVlOiBUcmVlKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0cmVlLmV4aXN0cygnL3BhY2thZ2UuanNvbicpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHRyZWUucmVhZCgnL3BhY2thZ2UuanNvbicpIS50b1N0cmluZygndXRmOCcpKTtcblxuICAgIC8vIFdlIGRvIG5vdCBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgc29tZW9uZSBtYW51YWxseSBhZGRlZCBcImhhbW1lcmpzXCJcbiAgICAvLyB0byB0aGUgZGV2IGRlcGVuZGVuY2llcy5cbiAgICBpZiAocGFja2FnZUpzb24uZGVwZW5kZW5jaWVzW0hBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSXSkge1xuICAgICAgZGVsZXRlIHBhY2thZ2VKc29uLmRlcGVuZGVuY2llc1tIQU1NRVJfTU9EVUxFX1NQRUNJRklFUl07XG4gICAgICB0cmVlLm92ZXJ3cml0ZSgnL3BhY2thZ2UuanNvbicsIEpTT04uc3RyaW5naWZ5KHBhY2thZ2VKc29uLCBudWxsLCAyKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgdW53cmFwcyBhIGdpdmVuIGV4cHJlc3Npb24gaWYgaXQgaXMgd3JhcHBlZFxuICogYnkgcGFyZW50aGVzaXMsIHR5cGUgY2FzdHMgb3IgdHlwZSBhc3NlcnRpb25zLlxuICovXG5mdW5jdGlvbiB1bndyYXBFeHByZXNzaW9uKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlIHtcbiAgaWYgKHRzLmlzUGFyZW50aGVzaXplZEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9IGVsc2UgaWYgKHRzLmlzQXNFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgcmV0dXJuIHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgfSBlbHNlIGlmICh0cy5pc1R5cGVBc3NlcnRpb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9XG4gIHJldHVybiBub2RlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBzcGVjaWZpZWQgcGF0aCB0byBhIHZhbGlkIFR5cGVTY3JpcHQgbW9kdWxlIHNwZWNpZmllciB3aGljaCBpc1xuICogcmVsYXRpdmUgdG8gdGhlIGdpdmVuIGNvbnRhaW5pbmcgZmlsZS5cbiAqL1xuZnVuY3Rpb24gZ2V0TW9kdWxlU3BlY2lmaWVyKG5ld1BhdGg6IHN0cmluZywgY29udGFpbmluZ0ZpbGU6IHN0cmluZykge1xuICBsZXQgcmVzdWx0ID0gcmVsYXRpdmUoZGlybmFtZShjb250YWluaW5nRmlsZSksIG5ld1BhdGgpLnJlcGxhY2UoL1xcXFwvZywgJy8nKS5yZXBsYWNlKC9cXC50cyQvLCAnJyk7XG4gIGlmICghcmVzdWx0LnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgIHJlc3VsdCA9IGAuLyR7cmVzdWx0fWA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSBuYW1lLlxuICogQHJldHVybnMgVGV4dCBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgbmFtZS4gTnVsbCBpZiBub3Qgc3RhdGljYWxseSBhbmFseXphYmxlLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eU5hbWVUZXh0KG5vZGU6IHRzLlByb3BlcnR5TmFtZSk6IHN0cmluZ3xudWxsIHtcbiAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSB8fCB0cy5pc1N0cmluZ0xpdGVyYWxMaWtlKG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGUudGV4dDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBpZGVudGlmaWVyIGlzIHBhcnQgb2YgYSBuYW1lc3BhY2VkIGFjY2Vzcy4gKi9cbmZ1bmN0aW9uIGlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZTogdHMuSWRlbnRpZmllcik6IGJvb2xlYW4ge1xuICByZXR1cm4gdHMuaXNRdWFsaWZpZWROYW1lKG5vZGUucGFyZW50KSB8fCB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLnBhcmVudCk7XG59XG5cbi8qKlxuICogV2Fsa3MgdGhyb3VnaCB0aGUgc3BlY2lmaWVkIG5vZGUgYW5kIHJldHVybnMgYWxsIGNoaWxkIG5vZGVzIHdoaWNoIG1hdGNoIHRoZVxuICogZ2l2ZW4gcHJlZGljYXRlLlxuICovXG5mdW5jdGlvbiBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzPFQgZXh0ZW5kcyB0cy5Ob2RlPihcbiAgICBwYXJlbnQ6IHRzLk5vZGUsIHByZWRpY2F0ZTogKG5vZGU6IHRzLk5vZGUpID0+IG5vZGUgaXMgVCk6IFRbXSB7XG4gIGNvbnN0IHJlc3VsdDogVFtdID0gW107XG4gIGNvbnN0IHZpc2l0Tm9kZSA9IChub2RlOiB0cy5Ob2RlKSA9PiB7XG4gICAgaWYgKHByZWRpY2F0ZShub2RlKSkge1xuICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XG4gICAgfVxuICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCB2aXNpdE5vZGUpO1xuICB9O1xuICB0cy5mb3JFYWNoQ2hpbGQocGFyZW50LCB2aXNpdE5vZGUpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl19