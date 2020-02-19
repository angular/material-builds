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
        define("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-gestures-rule", ["require", "exports", "@angular-devkit/core", "@angular/cdk/schematics", "@schematics/angular/utility/ast-utils", "@schematics/angular/utility/change", "fs", "path", "typescript", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/find-hammer-script-tags", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/find-main-module", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-template-check", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/import-manager", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/remove-array-element", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/remove-element-from-html"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const core_1 = require("@angular-devkit/core");
    const schematics_1 = require("@angular/cdk/schematics");
    const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
    const change_1 = require("@schematics/angular/utility/change");
    const fs_1 = require("fs");
    const path_1 = require("path");
    const ts = require("typescript");
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
    class HammerGesturesRule extends schematics_1.MigrationRule {
        constructor() {
            super(...arguments);
            // Only enable this rule if the migration targets v9 or v10 and is running for a non-test
            // target. We cannot migrate test targets since they have a limited scope
            // (in regards to source files) and therefore the HammerJS usage detection can be incorrect.
            this.ruleEnabled = (this.targetVersion === schematics_1.TargetVersion.V9 || this.targetVersion === schematics_1.TargetVersion.V10) &&
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
            const sourceRoot = core_1.normalize(this.project.sourceRoot || this.project.root);
            const newConfigPath = core_1.join(sourceRoot, this._getAvailableGestureConfigFileName(sourceRoot));
            // Copy gesture config template into the CLI project.
            this.tree.create(newConfigPath, fs_1.readFileSync(require.resolve(GESTURE_CONFIG_TEMPLATE_PATH), 'utf8'));
            // Replace all Material gesture config references to resolve to the
            // newly copied gesture config.
            this._gestureConfigReferences.forEach(i => this._replaceGestureConfigReference(i, GESTURE_CONFIG_CLASS_NAME, getModuleSpecifier(newConfigPath, i.node.getSourceFile().fileName)));
            // Setup the gesture config provider and the "HammerModule" in the root module
            // if not done already. The "HammerModule" is needed in v9 since it enables the
            // Hammer event plugin that was previously enabled by default in v8.
            this._setupNewGestureConfigInRootModule(newConfigPath);
            this._setupHammerModuleInRootModule();
        }
        /**
         * Sets up the standard hammer module in the project and removes all
         * references to the deprecated Angular Material gesture config.
         */
        _setupHammerWithStandardEvents() {
            // Setup the HammerModule. The HammerModule enables support for
            // the standard HammerJS events.
            this._setupHammerModuleInRootModule();
            this._removeMaterialGestureConfigSetup();
        }
        /**
         * Removes Hammer from the current project. The following steps are performed:
         *   1) Delete all TypeScript imports to "hammerjs".
         *   2) Remove references to the Angular Material gesture config.
         *   3) Remove "hammerjs" from all index HTML files of the current project.
         */
        _removeHammerSetup() {
            this._installImports.forEach(i => this._importManager.deleteImportByDeclaration(i));
            this._removeMaterialGestureConfigSetup();
            this._removeHammerModuleReferences();
            this._removeHammerFromIndexFile(this.project);
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
                const importData = schematics_1.getImportOfIdentifier(node, this.typeChecker);
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
                const importData = schematics_1.getImportOfIdentifier(node, this.typeChecker);
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
                const importData = schematics_1.getImportOfIdentifier(node, this.typeChecker);
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
            const indexFilePaths = schematics_1.getProjectIndexFiles(project);
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
        _setupNewGestureConfigInRootModule(gestureConfigPath) {
            const mainFilePath = path_1.join(this.basePath, schematics_1.getProjectMainFile(this.project));
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
        _setupHammerModuleInRootModule() {
            const mainFilePath = path_1.join(this.basePath, schematics_1.getProjectMainFile(this.project));
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
         * Static migration rule method that will be called once all project targets
         * have been migrated individually. This method can be used to make changes based
         * on the analysis of the individual targets. For example: we only remove Hammer
         * from the "package.json" if it is not used in *any* project target.
         */
        static globalPostMigration(tree, context) {
            // Always notify the developer that the Hammer v9 migration does not migrate tests.
            context.logger.info('\n⚠  General notice: The HammerJS v9 migration for Angular Components is not able to ' +
                'migrate tests. Please manually clean up tests in your project if they rely on ' +
                (this.globalUsesHammer ? 'the deprecated Angular Material gesture config.' : 'HammerJS.'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLWdlc3R1cmVzLXJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvdXBncmFkZS1ydWxlcy9oYW1tZXItZ2VzdHVyZXMtdjkvaGFtbWVyLWdlc3R1cmVzLXJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCwrQ0FJOEI7SUFFOUIsd0RBVWlDO0lBQ2pDLHFFQUkrQztJQUMvQywrREFBZ0U7SUFFaEUsMkJBQWdDO0lBQ2hDLCtCQUE2QztJQUM3QyxpQ0FBaUM7SUFFakMsNklBQXlFO0lBQ3pFLCtIQUE0RDtJQUM1RCx5SUFBaUU7SUFDakUsMkhBQStDO0lBQy9DLHVJQUF3RTtJQUN4RSwrSUFBaUU7SUFFakUsTUFBTSx5QkFBeUIsR0FBRyxlQUFlLENBQUM7SUFDbEQsTUFBTSx3QkFBd0IsR0FBRyxnQkFBZ0IsQ0FBQztJQUNsRCxNQUFNLDRCQUE0QixHQUFHLDJCQUEyQixDQUFDO0lBRWpFLE1BQU0sd0JBQXdCLEdBQUcsdUJBQXVCLENBQUM7SUFDekQsTUFBTSwwQkFBMEIsR0FBRywyQkFBMkIsQ0FBQztJQUUvRCxNQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQztJQUMxQyxNQUFNLG9CQUFvQixHQUFHLDJCQUEyQixDQUFDO0lBRXpELE1BQU0sdUJBQXVCLEdBQUcsVUFBVSxDQUFDO0lBRTNDLE1BQU0sNkJBQTZCLEdBQy9CLHFFQUFxRSxDQUFDO0lBUTFFLE1BQWEsa0JBQW1CLFNBQVEsMEJBQW1CO1FBQTNEOztZQUNFLHlGQUF5RjtZQUN6Rix5RUFBeUU7WUFDekUsNEZBQTRGO1lBQzVGLGdCQUFXLEdBQ1AsQ0FBQyxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxHQUFHLENBQUM7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SSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQztRQUNGLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25DLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgam9pbiBhcyBkZXZraXRKb2luLFxuICBub3JtYWxpemUgYXMgZGV2a2l0Tm9ybWFsaXplLFxuICBQYXRoIGFzIERldmtpdFBhdGhcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtTY2hlbWF0aWNDb250ZXh0LCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBnZXRJbXBvcnRPZklkZW50aWZpZXIsXG4gIGdldFByb2plY3RJbmRleEZpbGVzLFxuICBnZXRQcm9qZWN0TWFpbkZpbGUsXG4gIEltcG9ydCxcbiAgTWlncmF0aW9uRmFpbHVyZSxcbiAgTWlncmF0aW9uUnVsZSxcbiAgUG9zdE1pZ3JhdGlvbkFjdGlvbixcbiAgUmVzb2x2ZWRSZXNvdXJjZSxcbiAgVGFyZ2V0VmVyc2lvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhLFxuICBnZXREZWNvcmF0b3JNZXRhZGF0YSxcbiAgZ2V0TWV0YWRhdGFGaWVsZFxufSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvYXN0LXV0aWxzJztcbmltcG9ydCB7SW5zZXJ0Q2hhbmdlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvY2hhbmdlJztcbmltcG9ydCB7V29ya3NwYWNlUHJvamVjdH0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZS1tb2RlbHMnO1xuaW1wb3J0IHtyZWFkRmlsZVN5bmN9IGZyb20gJ2ZzJztcbmltcG9ydCB7ZGlybmFtZSwgam9pbiwgcmVsYXRpdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7ZmluZEhhbW1lclNjcmlwdEltcG9ydEVsZW1lbnRzfSBmcm9tICcuL2ZpbmQtaGFtbWVyLXNjcmlwdC10YWdzJztcbmltcG9ydCB7ZmluZE1haW5Nb2R1bGVFeHByZXNzaW9ufSBmcm9tICcuL2ZpbmQtbWFpbi1tb2R1bGUnO1xuaW1wb3J0IHtpc0hhbW1lckpzVXNlZEluVGVtcGxhdGV9IGZyb20gJy4vaGFtbWVyLXRlbXBsYXRlLWNoZWNrJztcbmltcG9ydCB7SW1wb3J0TWFuYWdlcn0gZnJvbSAnLi9pbXBvcnQtbWFuYWdlcic7XG5pbXBvcnQge3JlbW92ZUVsZW1lbnRGcm9tQXJyYXlFeHByZXNzaW9ufSBmcm9tICcuL3JlbW92ZS1hcnJheS1lbGVtZW50JztcbmltcG9ydCB7cmVtb3ZlRWxlbWVudEZyb21IdG1sfSBmcm9tICcuL3JlbW92ZS1lbGVtZW50LWZyb20taHRtbCc7XG5cbmNvbnN0IEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUgPSAnR2VzdHVyZUNvbmZpZyc7XG5jb25zdCBHRVNUVVJFX0NPTkZJR19GSUxFX05BTUUgPSAnZ2VzdHVyZS1jb25maWcnO1xuY29uc3QgR0VTVFVSRV9DT05GSUdfVEVNUExBVEVfUEFUSCA9ICcuL2dlc3R1cmUtY29uZmlnLnRlbXBsYXRlJztcblxuY29uc3QgSEFNTUVSX0NPTkZJR19UT0tFTl9OQU1FID0gJ0hBTU1FUl9HRVNUVVJFX0NPTkZJRyc7XG5jb25zdCBIQU1NRVJfQ09ORklHX1RPS0VOX01PRFVMRSA9ICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuY29uc3QgSEFNTUVSX01PRFVMRV9OQU1FID0gJ0hhbW1lck1vZHVsZSc7XG5jb25zdCBIQU1NRVJfTU9EVUxFX0lNUE9SVCA9ICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuY29uc3QgSEFNTUVSX01PRFVMRV9TUEVDSUZJRVIgPSAnaGFtbWVyanMnO1xuXG5jb25zdCBDQU5OT1RfUkVNT1ZFX1JFRkVSRU5DRV9FUlJPUiA9XG4gICAgYENhbm5vdCByZW1vdmUgcmVmZXJlbmNlIHRvIFwiR2VzdHVyZUNvbmZpZ1wiLiBQbGVhc2UgcmVtb3ZlIG1hbnVhbGx5LmA7XG5cbmludGVyZmFjZSBJZGVudGlmaWVyUmVmZXJlbmNlIHtcbiAgbm9kZTogdHMuSWRlbnRpZmllcjtcbiAgaW1wb3J0RGF0YTogSW1wb3J0O1xuICBpc0ltcG9ydDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEhhbW1lckdlc3R1cmVzUnVsZSBleHRlbmRzIE1pZ3JhdGlvblJ1bGU8bnVsbD4ge1xuICAvLyBPbmx5IGVuYWJsZSB0aGlzIHJ1bGUgaWYgdGhlIG1pZ3JhdGlvbiB0YXJnZXRzIHY5IG9yIHYxMCBhbmQgaXMgcnVubmluZyBmb3IgYSBub24tdGVzdFxuICAvLyB0YXJnZXQuIFdlIGNhbm5vdCBtaWdyYXRlIHRlc3QgdGFyZ2V0cyBzaW5jZSB0aGV5IGhhdmUgYSBsaW1pdGVkIHNjb3BlXG4gIC8vIChpbiByZWdhcmRzIHRvIHNvdXJjZSBmaWxlcykgYW5kIHRoZXJlZm9yZSB0aGUgSGFtbWVySlMgdXNhZ2UgZGV0ZWN0aW9uIGNhbiBiZSBpbmNvcnJlY3QuXG4gIHJ1bGVFbmFibGVkID1cbiAgICAgICh0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjkgfHwgdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlYxMCkgJiZcbiAgICAgICF0aGlzLmlzVGVzdFRhcmdldDtcblxuICBwcml2YXRlIF9wcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcigpO1xuICBwcml2YXRlIF9pbXBvcnRNYW5hZ2VyID0gbmV3IEltcG9ydE1hbmFnZXIodGhpcy5nZXRVcGRhdGVSZWNvcmRlciwgdGhpcy5fcHJpbnRlcik7XG4gIHByaXZhdGUgX25vZGVGYWlsdXJlczoge25vZGU6IHRzLk5vZGUsIG1lc3NhZ2U6IHN0cmluZ31bXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGN1c3RvbSBIYW1tZXJKUyBldmVudHMgcHJvdmlkZWQgYnkgdGhlIE1hdGVyaWFsIGdlc3R1cmVcbiAgICogY29uZmlnIGFyZSB1c2VkIGluIGEgdGVtcGxhdGUuXG4gICAqL1xuICBwcml2YXRlIF9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHN0YW5kYXJkIEhhbW1lckpTIGV2ZW50cyBhcmUgdXNlZCBpbiBhIHRlbXBsYXRlLiAqL1xuICBwcml2YXRlIF9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgSGFtbWVySlMgaXMgYWNjZXNzZWQgYXQgcnVudGltZS4gKi9cbiAgcHJpdmF0ZSBfdXNlZEluUnVudGltZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGltcG9ydHMgdGhhdCBtYWtlIFwiaGFtbWVyanNcIiBhdmFpbGFibGUgZ2xvYmFsbHkuIFdlIGtlZXAgdHJhY2sgb2YgdGhlc2VcbiAgICogc2luY2Ugd2UgbWlnaHQgbmVlZCB0byByZW1vdmUgdGhlbSBpZiBIYW1tZXIgaXMgbm90IHVzZWQuXG4gICAqL1xuICBwcml2YXRlIF9pbnN0YWxsSW1wb3J0czogdHMuSW1wb3J0RGVjbGFyYXRpb25bXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHJlc29sdmUgdG8gdGhlIGdlc3R1cmUgY29uZmlnIGZyb20gQW5ndWxhciBNYXRlcmlhbC5cbiAgICovXG4gIHByaXZhdGUgX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzOiBJZGVudGlmaWVyUmVmZXJlbmNlW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCByZXNvbHZlIHRvIHRoZSBcIkhBTU1FUl9HRVNUVVJFX0NPTkZJR1wiIHRva2VuIGZyb21cbiAgICogXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuXG4gICAqL1xuICBwcml2YXRlIF9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXM6IElkZW50aWZpZXJSZWZlcmVuY2VbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHJlc29sdmUgdG8gdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbVxuICAgKiBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi5cbiAgICovXG4gIHByaXZhdGUgX2hhbW1lck1vZHVsZVJlZmVyZW5jZXM6IElkZW50aWZpZXJSZWZlcmVuY2VbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHRoYXQgaGF2ZSBiZWVuIGRlbGV0ZWQgZnJvbSBzb3VyY2UgZmlsZXMuIFRoaXMgY2FuIGJlXG4gICAqIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGNlcnRhaW4gaW1wb3J0cyBhcmUgc3RpbGwgdXNlZCBvciBub3QuXG4gICAqL1xuICBwcml2YXRlIF9kZWxldGVkSWRlbnRpZmllcnM6IHRzLklkZW50aWZpZXJbXSA9IFtdO1xuXG4gIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFJlc29sdmVkUmVzb3VyY2UpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2N1c3RvbUV2ZW50c1VzZWRJblRlbXBsYXRlIHx8ICF0aGlzLl9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlKSB7XG4gICAgICBjb25zdCB7c3RhbmRhcmRFdmVudHMsIGN1c3RvbUV2ZW50c30gPSBpc0hhbW1lckpzVXNlZEluVGVtcGxhdGUodGVtcGxhdGUuY29udGVudCk7XG4gICAgICB0aGlzLl9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZSA9IHRoaXMuX2N1c3RvbUV2ZW50c1VzZWRJblRlbXBsYXRlIHx8IGN1c3RvbUV2ZW50cztcbiAgICAgIHRoaXMuX3N0YW5kYXJkRXZlbnRzVXNlZEluVGVtcGxhdGUgPSB0aGlzLl9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlIHx8IHN0YW5kYXJkRXZlbnRzO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tIYW1tZXJJbXBvcnRzKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9yUnVudGltZUhhbW1lclVzYWdlKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9yTWF0ZXJpYWxHZXN0dXJlQ29uZmlnKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9ySGFtbWVyR2VzdHVyZUNvbmZpZ1Rva2VuKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9ySGFtbWVyTW9kdWxlUmVmZXJlbmNlKG5vZGUpO1xuICB9XG5cbiAgcG9zdEFuYWx5c2lzKCk6IHZvaWQge1xuICAgIC8vIFdhbGsgdGhyb3VnaCBhbGwgaGFtbWVyIGNvbmZpZyB0b2tlbiByZWZlcmVuY2VzIGFuZCBjaGVjayBpZiB0aGVyZVxuICAgIC8vIGlzIGEgcG90ZW50aWFsIGN1c3RvbSBnZXN0dXJlIGNvbmZpZyBzZXR1cC5cbiAgICBjb25zdCBoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAgPVxuICAgICAgICB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHRoaXMuX2NoZWNrRm9yQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKHIpKTtcbiAgICBjb25zdCB1c2VkSW5UZW1wbGF0ZSA9IHRoaXMuX3N0YW5kYXJkRXZlbnRzVXNlZEluVGVtcGxhdGUgfHwgdGhpcy5fY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGU7XG5cbiAgICAvKlxuICAgICAgUG9zc2libGUgc2NlbmFyaW9zIGFuZCBob3cgdGhlIG1pZ3JhdGlvbiBzaG91bGQgY2hhbmdlIHRoZSBwcm9qZWN0OlxuICAgICAgICAxLiBXZSBkZXRlY3QgdGhhdCBhIGN1c3RvbSBIYW1tZXJKUyBnZXN0dXJlIGNvbmZpZyBpcyBzZXQgdXA6XG4gICAgICAgICAgICAtIFJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyBpZiBubyBIYW1tZXJKUyBldmVudCBpcyB1c2VkLlxuICAgICAgICAgICAgLSBQcmludCBhIHdhcm5pbmcgYWJvdXQgYW1iaWd1b3VzIGNvbmZpZ3VyYXRpb24gdGhhdCBjYW5ub3QgYmUgaGFuZGxlZCBjb21wbGV0ZWx5XG4gICAgICAgICAgICAgIGlmIHRoZXJlIGFyZSByZWZlcmVuY2VzIHRvIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICAgICAgMi4gV2UgZGV0ZWN0IHRoYXQgSGFtbWVySlMgaXMgb25seSB1c2VkIHByb2dyYW1tYXRpY2FsbHk6XG4gICAgICAgICAgICAtIFJlbW92ZSByZWZlcmVuY2VzIHRvIEdlc3R1cmVDb25maWcgb2YgTWF0ZXJpYWwuXG4gICAgICAgICAgICAtIFJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBcIkhhbW1lck1vZHVsZVwiIGlmIHByZXNlbnQuXG4gICAgICAgIDMuIFdlIGRldGVjdCB0aGF0IHN0YW5kYXJkIEhhbW1lckpTIGV2ZW50cyBhcmUgdXNlZCBpbiBhIHRlbXBsYXRlOlxuICAgICAgICAgICAgLSBTZXQgdXAgdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbSBwbGF0Zm9ybS1icm93c2VyLlxuICAgICAgICAgICAgLSBSZW1vdmUgYWxsIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZXMuXG4gICAgICAgIDQuIFdlIGRldGVjdCB0aGF0IGN1c3RvbSBIYW1tZXJKUyBldmVudHMgcHJvdmlkZWQgYnkgdGhlIE1hdGVyaWFsIGdlc3R1cmVcbiAgICAgICAgICAgY29uZmlnIGFyZSB1c2VkLlxuICAgICAgICAgICAgLSBDb3B5IHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyBpbnRvIHRoZSBhcHAuXG4gICAgICAgICAgICAtIFJld3JpdGUgYWxsIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZXMgdG8gdGhlIG5ld2x5IGNvcGllZCBvbmUuXG4gICAgICAgICAgICAtIFNldCB1cCB0aGUgbmV3IGdlc3R1cmUgY29uZmlnIGluIHRoZSByb290IGFwcCBtb2R1bGUuXG4gICAgICAgICAgICAtIFNldCB1cCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBmcm9tIHBsYXRmb3JtLWJyb3dzZXIuXG4gICAgICAgIDQuIFdlIGRldGVjdCBubyBIYW1tZXJKUyB1c2FnZSBhdCBhbGw6XG4gICAgICAgICAgICAtIFJlbW92ZSBIYW1tZXIgaW1wb3J0c1xuICAgICAgICAgICAgLSBSZW1vdmUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlc1xuICAgICAgICAgICAgLSBSZW1vdmUgSGFtbWVyTW9kdWxlIHNldHVwIGlmIHByZXNlbnQuXG4gICAgICAgICAgICAtIFJlbW92ZSBIYW1tZXIgc2NyaXB0IGltcG9ydHMgaW4gXCJpbmRleC5odG1sXCIgZmlsZXMuXG4gICAgKi9cblxuICAgIGlmIChoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXApIHtcbiAgICAgIC8vIElmIGEgY3VzdG9tIGdlc3R1cmUgY29uZmlnIGlzIHByb3ZpZGVkLCB3ZSBhbHdheXMgYXNzdW1lIHRoYXQgSGFtbWVySlMgaXMgdXNlZC5cbiAgICAgIEhhbW1lckdlc3R1cmVzUnVsZS5nbG9iYWxVc2VzSGFtbWVyID0gdHJ1ZTtcbiAgICAgIGlmICghdXNlZEluVGVtcGxhdGUgJiYgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIElmIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgZXZlbnRzIGFyZSBub3QgdXNlZCBhbmQgd2UgZm91bmQgYSBjdXN0b21cbiAgICAgICAgLy8gZ2VzdHVyZSBjb25maWcsIHdlIGNhbiBzYWZlbHkgcmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnXG4gICAgICAgIC8vIHNpbmNlIGV2ZW50cyBwcm92aWRlZCBieSB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgYXJlIGd1YXJhbnRlZWQgdG8gYmUgdW51c2VkLlxuICAgICAgICB0aGlzLl9yZW1vdmVNYXRlcmlhbEdlc3R1cmVDb25maWdTZXR1cCgpO1xuICAgICAgICB0aGlzLnByaW50SW5mbyhcbiAgICAgICAgICAgICdUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIENvbXBvbmVudHMgZGV0ZWN0ZWQgdGhhdCBIYW1tZXJKUyBpcyAnICtcbiAgICAgICAgICAgICdtYW51YWxseSBzZXQgdXAgaW4gY29tYmluYXRpb24gd2l0aCByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgJyArXG4gICAgICAgICAgICAnY29uZmlnLiBUaGlzIHRhcmdldCBjYW5ub3QgYmUgbWlncmF0ZWQgY29tcGxldGVseSwgYnV0IGFsbCByZWZlcmVuY2VzIHRvIHRoZSAnICtcbiAgICAgICAgICAgICdkZXByZWNhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBoYXZlIGJlZW4gcmVtb3ZlZC4gUmVhZCBtb3JlIGhlcmU6ICcgK1xuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0LmlvL25nLW1hdGVyaWFsLXY5LWhhbW1lci1hbWJpZ3VvdXMtdXNhZ2UnKTtcbiAgICAgIH0gZWxzZSBpZiAodXNlZEluVGVtcGxhdGUgJiYgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIFNpbmNlIHRoZXJlIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLCBhbmQgd2UgZGV0ZWN0ZWRcbiAgICAgICAgLy8gdXNhZ2Ugb2YgYSBnZXN0dXJlIGV2ZW50IHRoYXQgY291bGQgYmUgcHJvdmlkZWQgYnkgQW5ndWxhciBNYXRlcmlhbCwgd2UgKmNhbm5vdCpcbiAgICAgICAgLy8gYXV0b21hdGljYWxseSByZW1vdmUgcmVmZXJlbmNlcy4gVGhpcyBpcyBiZWNhdXNlIHdlIGRvICpub3QqIGtub3cgd2hldGhlciB0aGVcbiAgICAgICAgLy8gZXZlbnQgaXMgYWN0dWFsbHkgcHJvdmlkZWQgYnkgdGhlIGN1c3RvbSBjb25maWcgb3IgYnkgdGhlIE1hdGVyaWFsIGNvbmZpZy5cbiAgICAgICAgdGhpcy5wcmludEluZm8oXG4gICAgICAgICAgICAnVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBDb21wb25lbnRzIGRldGVjdGVkIHRoYXQgSGFtbWVySlMgaXMgJyArXG4gICAgICAgICAgICAnbWFudWFsbHkgc2V0IHVwIGluIGNvbWJpbmF0aW9uIHdpdGggcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlICcgK1xuICAgICAgICAgICAgJ2NvbmZpZy4gVGhpcyB0YXJnZXQgY2Fubm90IGJlIG1pZ3JhdGVkIGNvbXBsZXRlbHkuIFBsZWFzZSBtYW51YWxseSByZW1vdmUgJyArXG4gICAgICAgICAgICAncmVmZXJlbmNlcyB0byB0aGUgZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLiBSZWFkIG1vcmUgaGVyZTogJyArXG4gICAgICAgICAgICAnaHR0cHM6Ly9naXQuaW8vbmctbWF0ZXJpYWwtdjktaGFtbWVyLWFtYmlndW91cy11c2FnZScpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5fdXNlZEluUnVudGltZSB8fCB1c2VkSW5UZW1wbGF0ZSkge1xuICAgICAgLy8gV2Uga2VlcCB0cmFjayBvZiB3aGV0aGVyIEhhbW1lciBpcyB1c2VkIGdsb2JhbGx5LiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHdlXG4gICAgICAvLyB3YW50IHRvIG9ubHkgcmVtb3ZlIEhhbW1lciBmcm9tIHRoZSBcInBhY2thZ2UuanNvblwiIGlmIGl0IGlzIG5vdCB1c2VkIGluIGFueSBwcm9qZWN0XG4gICAgICAvLyB0YXJnZXQuIEp1c3QgYmVjYXVzZSBpdCBpc24ndCB1c2VkIGluIG9uZSB0YXJnZXQgZG9lc24ndCBtZWFuIHRoYXQgd2UgY2FuIHNhZmVseVxuICAgICAgLy8gcmVtb3ZlIHRoZSBkZXBlbmRlbmN5LlxuICAgICAgSGFtbWVyR2VzdHVyZXNSdWxlLmdsb2JhbFVzZXNIYW1tZXIgPSB0cnVlO1xuXG4gICAgICAvLyBJZiBoYW1tZXIgaXMgb25seSB1c2VkIGF0IHJ1bnRpbWUsIHdlIGRvbid0IG5lZWQgdGhlIGdlc3R1cmUgY29uZmlnIG9yIFwiSGFtbWVyTW9kdWxlXCJcbiAgICAgIC8vIGFuZCBjYW4gcmVtb3ZlIGl0IChhbG9uZyB3aXRoIHRoZSBoYW1tZXIgY29uZmlnIHRva2VuIGltcG9ydCBpZiBubyBsb25nZXIgbmVlZGVkKS5cbiAgICAgIGlmICghdXNlZEluVGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlSGFtbWVyTW9kdWxlUmVmZXJlbmNlcygpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlICYmICF0aGlzLl9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZSkge1xuICAgICAgICB0aGlzLl9zZXR1cEhhbW1lcldpdGhTdGFuZGFyZEV2ZW50cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2V0dXBIYW1tZXJXaXRoQ3VzdG9tRXZlbnRzKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3JlbW92ZUhhbW1lclNldHVwKCk7XG4gICAgfVxuXG4gICAgLy8gUmVjb3JkIHRoZSBjaGFuZ2VzIGNvbGxlY3RlZCBpbiB0aGUgaW1wb3J0IG1hbmFnZXIuIENoYW5nZXMgbmVlZCB0byBiZSBhcHBsaWVkXG4gICAgLy8gb25jZSB0aGUgaW1wb3J0IG1hbmFnZXIgcmVnaXN0ZXJlZCBhbGwgaW1wb3J0IG1vZGlmaWNhdGlvbnMuIFRoaXMgYXZvaWRzIGNvbGxpc2lvbnMuXG4gICAgdGhpcy5faW1wb3J0TWFuYWdlci5yZWNvcmRDaGFuZ2VzKCk7XG5cbiAgICAvLyBDcmVhdGUgbWlncmF0aW9uIGZhaWx1cmVzIHRoYXQgd2lsbCBiZSBwcmludGVkIGJ5IHRoZSB1cGRhdGUtdG9vbCBvbiBtaWdyYXRpb25cbiAgICAvLyBjb21wbGV0aW9uLiBXZSBuZWVkIHNwZWNpYWwgbG9naWMgZm9yIHVwZGF0aW5nIGZhaWx1cmUgcG9zaXRpb25zIHRvIHJlZmxlY3RcbiAgICAvLyB0aGUgbmV3IHNvdXJjZSBmaWxlIGFmdGVyIG1vZGlmaWNhdGlvbnMgZnJvbSB0aGUgaW1wb3J0IG1hbmFnZXIuXG4gICAgdGhpcy5mYWlsdXJlcy5wdXNoKC4uLnRoaXMuX2NyZWF0ZU1pZ3JhdGlvbkZhaWx1cmVzKCkpO1xuXG4gICAgLy8gVGhlIHRlbXBsYXRlIGNoZWNrIGZvciBIYW1tZXJKUyBldmVudHMgaXMgbm90IGNvbXBsZXRlbHkgcmVsaWFibGUgYXMgdGhlIGV2ZW50XG4gICAgLy8gb3V0cHV0IGNvdWxkIGFsc28gYmUgZnJvbSBhIGNvbXBvbmVudCBoYXZpbmcgYW4gb3V0cHV0IG5hbWVkIHNpbWlsYXJseSB0byBhIGtub3duXG4gICAgLy8gaGFtbWVyanMgZXZlbnQgKGUuZy4gXCJAT3V0cHV0KCkgc2xpZGVcIikuIFRoZSB1c2FnZSBpcyB0aGVyZWZvcmUgc29tZXdoYXQgYW1iaWd1b3VzXG4gICAgLy8gYW5kIHdlIHdhbnQgdG8gcHJpbnQgYSBtZXNzYWdlIHRoYXQgZGV2ZWxvcGVycyBtaWdodCBiZSBhYmxlIHRvIHJlbW92ZSBIYW1tZXIgbWFudWFsbHkuXG4gICAgaWYgKCFoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAgJiYgIXRoaXMuX3VzZWRJblJ1bnRpbWUgJiYgdXNlZEluVGVtcGxhdGUpIHtcbiAgICAgIHRoaXMucHJpbnRJbmZvKFxuICAgICAgICAgICdUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIENvbXBvbmVudHMgbWlncmF0ZWQgdGhlICcgK1xuICAgICAgICAgICdwcm9qZWN0IHRvIGtlZXAgSGFtbWVySlMgaW5zdGFsbGVkLCBidXQgZGV0ZWN0ZWQgYW1iaWd1b3VzIHVzYWdlIG9mIEhhbW1lckpTLiBQbGVhc2UgJyArXG4gICAgICAgICAgJ21hbnVhbGx5IGNoZWNrIGlmIHlvdSBjYW4gcmVtb3ZlIEhhbW1lckpTIGZyb20geW91ciBhcHBsaWNhdGlvbi4gTW9yZSBkZXRhaWxzOiAnICtcbiAgICAgICAgICAnaHR0cHM6Ly9naXQuaW8vbmctbWF0ZXJpYWwtdjktaGFtbWVyLWFtYmlndW91cy11c2FnZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVwIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWcgaW4gdGhlIGN1cnJlbnQgcHJvamVjdC4gVG8gYWNoaWV2ZSB0aGlzLCB0aGVcbiAgICogZm9sbG93aW5nIHN0ZXBzIGFyZSBwZXJmb3JtZWQ6XG4gICAqICAgMSkgQ3JlYXRlIGNvcHkgb2YgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICogICAyKSBSZXdyaXRlIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIHRvIHRoZVxuICAgKiAgICAgIG5ldyBnZXN0dXJlIGNvbmZpZy5cbiAgICogICAzKSBTZXR1cCB0aGUgSEFNTUVSX0dFU1RVUkVfQ09ORklHIGluIHRoZSByb290IGFwcCBtb2R1bGUgKGlmIG5vdCBkb25lIGFscmVhZHkpLlxuICAgKiAgIDQpIFNldHVwIHRoZSBcIkhhbW1lck1vZHVsZVwiIGluIHRoZSByb290IGFwcCBtb2R1bGUgKGlmIG5vdCBkb25lIGFscmVhZHkpLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0dXBIYW1tZXJXaXRoQ3VzdG9tRXZlbnRzKCkge1xuICAgIGNvbnN0IHNvdXJjZVJvb3QgPSBkZXZraXROb3JtYWxpemUodGhpcy5wcm9qZWN0LnNvdXJjZVJvb3QgfHwgdGhpcy5wcm9qZWN0LnJvb3QpO1xuICAgIGNvbnN0IG5ld0NvbmZpZ1BhdGggPVxuICAgICAgICBkZXZraXRKb2luKHNvdXJjZVJvb3QsIHRoaXMuX2dldEF2YWlsYWJsZUdlc3R1cmVDb25maWdGaWxlTmFtZShzb3VyY2VSb290KSk7XG5cbiAgICAvLyBDb3B5IGdlc3R1cmUgY29uZmlnIHRlbXBsYXRlIGludG8gdGhlIENMSSBwcm9qZWN0LlxuICAgIHRoaXMudHJlZS5jcmVhdGUoXG4gICAgICAgIG5ld0NvbmZpZ1BhdGgsIHJlYWRGaWxlU3luYyhyZXF1aXJlLnJlc29sdmUoR0VTVFVSRV9DT05GSUdfVEVNUExBVEVfUEFUSCksICd1dGY4JykpO1xuXG4gICAgLy8gUmVwbGFjZSBhbGwgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlcyB0byByZXNvbHZlIHRvIHRoZVxuICAgIC8vIG5ld2x5IGNvcGllZCBnZXN0dXJlIGNvbmZpZy5cbiAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5mb3JFYWNoKFxuICAgICAgICBpID0+IHRoaXMuX3JlcGxhY2VHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKFxuICAgICAgICAgICAgaSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSxcbiAgICAgICAgICAgIGdldE1vZHVsZVNwZWNpZmllcihuZXdDb25maWdQYXRoLCBpLm5vZGUuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lKSkpO1xuXG4gICAgLy8gU2V0dXAgdGhlIGdlc3R1cmUgY29uZmlnIHByb3ZpZGVyIGFuZCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpbiB0aGUgcm9vdCBtb2R1bGVcbiAgICAvLyBpZiBub3QgZG9uZSBhbHJlYWR5LiBUaGUgXCJIYW1tZXJNb2R1bGVcIiBpcyBuZWVkZWQgaW4gdjkgc2luY2UgaXQgZW5hYmxlcyB0aGVcbiAgICAvLyBIYW1tZXIgZXZlbnQgcGx1Z2luIHRoYXQgd2FzIHByZXZpb3VzbHkgZW5hYmxlZCBieSBkZWZhdWx0IGluIHY4LlxuICAgIHRoaXMuX3NldHVwTmV3R2VzdHVyZUNvbmZpZ0luUm9vdE1vZHVsZShuZXdDb25maWdQYXRoKTtcbiAgICB0aGlzLl9zZXR1cEhhbW1lck1vZHVsZUluUm9vdE1vZHVsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgdGhlIHN0YW5kYXJkIGhhbW1lciBtb2R1bGUgaW4gdGhlIHByb2plY3QgYW5kIHJlbW92ZXMgYWxsXG4gICAqIHJlZmVyZW5jZXMgdG8gdGhlIGRlcHJlY2F0ZWQgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgX3NldHVwSGFtbWVyV2l0aFN0YW5kYXJkRXZlbnRzKCkge1xuICAgIC8vIFNldHVwIHRoZSBIYW1tZXJNb2R1bGUuIFRoZSBIYW1tZXJNb2R1bGUgZW5hYmxlcyBzdXBwb3J0IGZvclxuICAgIC8vIHRoZSBzdGFuZGFyZCBIYW1tZXJKUyBldmVudHMuXG4gICAgdGhpcy5fc2V0dXBIYW1tZXJNb2R1bGVJblJvb3RNb2R1bGUoKTtcbiAgICB0aGlzLl9yZW1vdmVNYXRlcmlhbEdlc3R1cmVDb25maWdTZXR1cCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgSGFtbWVyIGZyb20gdGhlIGN1cnJlbnQgcHJvamVjdC4gVGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgcGVyZm9ybWVkOlxuICAgKiAgIDEpIERlbGV0ZSBhbGwgVHlwZVNjcmlwdCBpbXBvcnRzIHRvIFwiaGFtbWVyanNcIi5cbiAgICogICAyKSBSZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICogICAzKSBSZW1vdmUgXCJoYW1tZXJqc1wiIGZyb20gYWxsIGluZGV4IEhUTUwgZmlsZXMgb2YgdGhlIGN1cnJlbnQgcHJvamVjdC5cbiAgICovXG4gIHByaXZhdGUgX3JlbW92ZUhhbW1lclNldHVwKCkge1xuICAgIHRoaXMuX2luc3RhbGxJbXBvcnRzLmZvckVhY2goaSA9PiB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZUltcG9ydEJ5RGVjbGFyYXRpb24oaSkpO1xuXG4gICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgICB0aGlzLl9yZW1vdmVIYW1tZXJNb2R1bGVSZWZlcmVuY2VzKCk7XG4gICAgdGhpcy5fcmVtb3ZlSGFtbWVyRnJvbUluZGV4RmlsZSh0aGlzLnByb2plY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGdlc3R1cmUgY29uZmlnIHNldHVwIGJ5IGRlbGV0aW5nIGFsbCBmb3VuZCByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyXG4gICAqIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLiBBZGRpdGlvbmFsbHksIHVudXNlZCBpbXBvcnRzIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWdcbiAgICogdG9rZW4gZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIiB3aWxsIGJlIHJlbW92ZWQgYXMgd2VsbC5cbiAgICovXG4gIHByaXZhdGUgX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCkge1xuICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLmZvckVhY2gociA9PiB0aGlzLl9yZW1vdmVHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKHIpKTtcblxuICAgIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5mb3JFYWNoKHIgPT4ge1xuICAgICAgaWYgKHIuaXNJbXBvcnQpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlSGFtbWVyQ29uZmlnVG9rZW5JbXBvcnRJZlVudXNlZChyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuICovXG4gIHByaXZhdGUgX3JlbW92ZUhhbW1lck1vZHVsZVJlZmVyZW5jZXMoKSB7XG4gICAgdGhpcy5faGFtbWVyTW9kdWxlUmVmZXJlbmNlcy5mb3JFYWNoKCh7bm9kZSwgaXNJbXBvcnQsIGltcG9ydERhdGF9KSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZ2V0VXBkYXRlUmVjb3JkZXIoc291cmNlRmlsZS5maWxlTmFtZSk7XG5cbiAgICAgIC8vIE9ubHkgcmVtb3ZlIHRoZSBpbXBvcnQgZm9yIHRoZSBIYW1tZXJNb2R1bGUgaWYgdGhlIG1vZHVsZSBoYXMgYmVlbiBhY2Nlc3NlZFxuICAgICAgLy8gdGhyb3VnaCBhIG5vbi1uYW1lc3BhY2VkIGlkZW50aWZpZXIgYWNjZXNzLlxuICAgICAgaWYgKCFpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGUpKSB7XG4gICAgICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICAgICAgc291cmNlRmlsZSwgSEFNTUVSX01PRFVMRV9OQU1FLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3IgcmVmZXJlbmNlcyBmcm9tIHdpdGhpbiBhbiBpbXBvcnQsIHdlIGRvIG5vdCBuZWVkIHRvIGRvIGFueXRoaW5nIG90aGVyIHRoYW5cbiAgICAgIC8vIHJlbW92aW5nIHRoZSBpbXBvcnQuIEZvciBvdGhlciByZWZlcmVuY2VzLCB3ZSByZW1vdmUgdGhlIGltcG9ydCBhbmQgdGhlIGFjdHVhbFxuICAgICAgLy8gaWRlbnRpZmllciBpbiB0aGUgbW9kdWxlIGltcG9ydHMuXG4gICAgICBpZiAoaXNJbXBvcnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpcyByZWZlcmVuY2VkIHdpdGhpbiBhbiBhcnJheSBsaXRlcmFsLCB3ZSBjYW5cbiAgICAgIC8vIHJlbW92ZSB0aGUgZWxlbWVudCBlYXNpbHkuIE90aGVyd2lzZSBpZiBpdCdzIG91dHNpZGUgb2YgYW4gYXJyYXkgbGl0ZXJhbCxcbiAgICAgIC8vIHdlIG5lZWQgdG8gcmVwbGFjZSB0aGUgcmVmZXJlbmNlIHdpdGggYW4gZW1wdHkgb2JqZWN0IGxpdGVyYWwgdy8gdG9kbyB0b1xuICAgICAgLy8gbm90IGJyZWFrIHRoZSBhcHBsaWNhdGlvbi5cbiAgICAgIGlmICh0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24obm9kZS5wYXJlbnQpKSB7XG4gICAgICAgIC8vIFJlbW92ZXMgdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbSB0aGUgcGFyZW50IGFycmF5IGV4cHJlc3Npb24uIFJlbW92ZXNcbiAgICAgICAgLy8gdGhlIHRyYWlsaW5nIGNvbW1hIHRva2VuIGlmIHByZXNlbnQuXG4gICAgICAgIHJlbW92ZUVsZW1lbnRGcm9tQXJyYXlFeHByZXNzaW9uKG5vZGUsIHJlY29yZGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlY29yZGVyLnJlbW92ZShub2RlLmdldFN0YXJ0KCksIG5vZGUuZ2V0V2lkdGgoKSk7XG4gICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5vZGUuZ2V0U3RhcnQoKSwgYC8qIFRPRE86IHJlbW92ZSAqLyB7fWApO1xuICAgICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7XG4gICAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIGRlbGV0ZSByZWZlcmVuY2UgdG8gXCJIYW1tZXJNb2R1bGVcIi4nLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZ1xuICAgKiB0b2tlbiBmcm9tIHBsYXRmb3JtLWJyb3dzZXIuIElmIHNvLCBrZWVwcyB0cmFjayBvZiB0aGUgcmVmZXJlbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JIYW1tZXJHZXN0dXJlQ29uZmlnVG9rZW4obm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkpIHtcbiAgICAgIGNvbnN0IGltcG9ydERhdGEgPSBnZXRJbXBvcnRPZklkZW50aWZpZXIobm9kZSwgdGhpcy50eXBlQ2hlY2tlcik7XG4gICAgICBpZiAoaW1wb3J0RGF0YSAmJiBpbXBvcnREYXRhLnN5bWJvbE5hbWUgPT09IEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSAmJlxuICAgICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZSA9PT0gSEFNTUVSX0NPTkZJR19UT0tFTl9NT0RVTEUpIHtcbiAgICAgICAgdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnB1c2goXG4gICAgICAgICAgICB7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnQ6IHRzLmlzSW1wb3J0U3BlY2lmaWVyKG5vZGUucGFyZW50KX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIEhhbW1lck1vZHVsZSBmcm9tXG4gICAqIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLiBJZiBzbywga2VlcHMgdHJhY2sgb2YgdGhlIHJlZmVyZW5jZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9ySGFtbWVyTW9kdWxlUmVmZXJlbmNlKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICBjb25zdCBpbXBvcnREYXRhID0gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGUsIHRoaXMudHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKGltcG9ydERhdGEgJiYgaW1wb3J0RGF0YS5zeW1ib2xOYW1lID09PSBIQU1NRVJfTU9EVUxFX05BTUUgJiZcbiAgICAgICAgICBpbXBvcnREYXRhLm1vZHVsZU5hbWUgPT09IEhBTU1FUl9NT0RVTEVfSU1QT1JUKSB7XG4gICAgICAgIHRoaXMuX2hhbW1lck1vZHVsZVJlZmVyZW5jZXMucHVzaChcbiAgICAgICAgICAgIHtub2RlLCBpbXBvcnREYXRhLCBpc0ltcG9ydDogdHMuaXNJbXBvcnRTcGVjaWZpZXIobm9kZS5wYXJlbnQpfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBpcyBhbiBpbXBvcnQgdG8gdGhlIEhhbW1lckpTIHBhY2thZ2UuIEltcG9ydHMgdG9cbiAgICogSGFtbWVySlMgd2hpY2ggbG9hZCBzcGVjaWZpYyBzeW1ib2xzIGZyb20gdGhlIHBhY2thZ2UgYXJlIGNvbnNpZGVyZWQgYXNcbiAgICogcnVudGltZSB1c2FnZSBvZiBIYW1tZXIuIGUuZy4gYGltcG9ydCB7U3ltYm9sfSBmcm9tIFwiaGFtbWVyanNcIjtgLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tIYW1tZXJJbXBvcnRzKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJbXBvcnREZWNsYXJhdGlvbihub2RlKSAmJiB0cy5pc1N0cmluZ0xpdGVyYWwobm9kZS5tb2R1bGVTcGVjaWZpZXIpICYmXG4gICAgICAgIG5vZGUubW9kdWxlU3BlY2lmaWVyLnRleHQgPT09IEhBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSKSB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBhbiBpbXBvcnQgdG8gSGFtbWVySlMgdGhhdCBpbXBvcnRzIHN5bWJvbHMsIG9yIGlzIG5hbWVzcGFjZWRcbiAgICAgIC8vIChlLmcuIFwiaW1wb3J0IHtBLCBCfSBmcm9tIC4uLlwiIG9yIFwiaW1wb3J0ICogYXMgaGFtbWVyIGZyb20gLi4uXCIpLCB0aGVuIHdlXG4gICAgICAvLyBhc3N1bWUgdGhhdCBzb21lIGV4cG9ydHMgYXJlIHVzZWQgYXQgcnVudGltZS5cbiAgICAgIGlmIChub2RlLmltcG9ydENsYXVzZSAmJlxuICAgICAgICAgICEobm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncyAmJiB0cy5pc05hbWVkSW1wb3J0cyhub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSAmJlxuICAgICAgICAgICAgbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cy5sZW5ndGggPT09IDApKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5faW5zdGFsbEltcG9ydHMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGFjY2Vzc2VzIHRoZSBnbG9iYWwgXCJIYW1tZXJcIiBzeW1ib2wgYXQgcnVudGltZS4gSWYgc28sXG4gICAqIHRoZSBtaWdyYXRpb24gcnVsZSBzdGF0ZSB3aWxsIGJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGF0IEhhbW1lciBpcyB1c2VkIGF0IHJ1bnRpbWUuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0ZvclJ1bnRpbWVIYW1tZXJVc2FnZShub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRoaXMuX3VzZWRJblJ1bnRpbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZXRlY3RzIHVzYWdlcyBvZiBcIndpbmRvdy5IYW1tZXJcIi5cbiAgICBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZSkgJiYgbm9kZS5uYW1lLnRleHQgPT09ICdIYW1tZXInKSB7XG4gICAgICBjb25zdCBvcmlnaW5FeHByID0gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihvcmlnaW5FeHByKSAmJiBvcmlnaW5FeHByLnRleHQgPT09ICd3aW5kb3cnKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIERldGVjdHMgdXNhZ2VzIG9mIFwid2luZG93WydIYW1tZXInXVwiLlxuICAgIGlmICh0cy5pc0VsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKG5vZGUpICYmIHRzLmlzU3RyaW5nTGl0ZXJhbChub2RlLmFyZ3VtZW50RXhwcmVzc2lvbikgJiZcbiAgICAgICAgbm9kZS5hcmd1bWVudEV4cHJlc3Npb24udGV4dCA9PT0gJ0hhbW1lcicpIHtcbiAgICAgIGNvbnN0IG9yaWdpbkV4cHIgPSB1bndyYXBFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gICAgICBpZiAodHMuaXNJZGVudGlmaWVyKG9yaWdpbkV4cHIpICYmIG9yaWdpbkV4cHIudGV4dCA9PT0gJ3dpbmRvdycpIHtcbiAgICAgICAgdGhpcy5fdXNlZEluUnVudGltZSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlcyB1c2FnZXMgb2YgcGxhaW4gaWRlbnRpZmllciB3aXRoIHRoZSBuYW1lIFwiSGFtbWVyXCIuIFRoZXNlIHVzYWdlXG4gICAgLy8gYXJlIHZhbGlkIGlmIHRoZXkgcmVzb2x2ZSB0byBcIkB0eXBlcy9oYW1tZXJqc1wiLiBlLmcuIFwibmV3IEhhbW1lcihteUVsZW1lbnQpXCIuXG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSAmJiBub2RlLnRleHQgPT09ICdIYW1tZXInICYmXG4gICAgICAgICF0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLnBhcmVudCkgJiYgIXRzLmlzRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24obm9kZS5wYXJlbnQpKSB7XG4gICAgICBjb25zdCBzeW1ib2wgPSB0aGlzLl9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlKTtcbiAgICAgIGlmIChzeW1ib2wgJiYgc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24gJiZcbiAgICAgICAgICBzeW1ib2wudmFsdWVEZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUuaW5jbHVkZXMoJ0B0eXBlcy9oYW1tZXJqcycpKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgcmVmZXJlbmNlcyB0aGUgZ2VzdHVyZSBjb25maWcgZnJvbSBBbmd1bGFyIE1hdGVyaWFsLlxuICAgKiBJZiBzbywgd2Uga2VlcCB0cmFjayBvZiB0aGUgZm91bmQgc3ltYm9sIHJlZmVyZW5jZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9yTWF0ZXJpYWxHZXN0dXJlQ29uZmlnKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICBjb25zdCBpbXBvcnREYXRhID0gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGUsIHRoaXMudHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKGltcG9ydERhdGEgJiYgaW1wb3J0RGF0YS5zeW1ib2xOYW1lID09PSBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FICYmXG4gICAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lLnN0YXJ0c1dpdGgoJ0Bhbmd1bGFyL21hdGVyaWFsLycpKSB7XG4gICAgICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLnB1c2goXG4gICAgICAgICAgICB7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnQ6IHRzLmlzSW1wb3J0U3BlY2lmaWVyKG5vZGUucGFyZW50KX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIEhhbW1lciBnZXN0dXJlIGNvbmZpZyB0b2tlbiByZWZlcmVuY2UgaXMgcGFydCBvZiBhblxuICAgKiBBbmd1bGFyIHByb3ZpZGVyIGRlZmluaXRpb24gdGhhdCBzZXRzIHVwIGEgY3VzdG9tIGdlc3R1cmUgY29uZmlnLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAodG9rZW5SZWY6IElkZW50aWZpZXJSZWZlcmVuY2UpOiBib29sZWFuIHtcbiAgICAvLyBXYWxrIHVwIHRoZSB0cmVlIHRvIGxvb2sgZm9yIGEgcGFyZW50IHByb3BlcnR5IGFzc2lnbm1lbnQgb2YgdGhlXG4gICAgLy8gcmVmZXJlbmNlIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWcgdG9rZW4uXG4gICAgbGV0IHByb3BlcnR5QXNzaWdubWVudDogdHMuTm9kZSA9IHRva2VuUmVmLm5vZGU7XG4gICAgd2hpbGUgKHByb3BlcnR5QXNzaWdubWVudCAmJiAhdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcGVydHlBc3NpZ25tZW50KSkge1xuICAgICAgcHJvcGVydHlBc3NpZ25tZW50ID0gcHJvcGVydHlBc3NpZ25tZW50LnBhcmVudDtcbiAgICB9XG5cbiAgICBpZiAoIXByb3BlcnR5QXNzaWdubWVudCB8fCAhdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcGVydHlBc3NpZ25tZW50KSB8fFxuICAgICAgICBnZXRQcm9wZXJ0eU5hbWVUZXh0KHByb3BlcnR5QXNzaWdubWVudC5uYW1lKSAhPT0gJ3Byb3ZpZGUnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgb2JqZWN0TGl0ZXJhbEV4cHIgPSBwcm9wZXJ0eUFzc2lnbm1lbnQucGFyZW50O1xuICAgIGNvbnN0IG1hdGNoaW5nSWRlbnRpZmllcnMgPSBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzKG9iamVjdExpdGVyYWxFeHByLCB0cy5pc0lkZW50aWZpZXIpO1xuXG4gICAgLy8gV2UgbmFpdmVseSBhc3N1bWUgdGhhdCBpZiB0aGVyZSBpcyBhIHJlZmVyZW5jZSB0byB0aGUgXCJHZXN0dXJlQ29uZmlnXCIgZXhwb3J0XG4gICAgLy8gZnJvbSBBbmd1bGFyIE1hdGVyaWFsIGluIHRoZSBwcm92aWRlciBsaXRlcmFsLCB0aGF0IHRoZSBwcm92aWRlciBzZXRzIHVwIHRoZVxuICAgIC8vIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAgcmV0dXJuICF0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5zb21lKHIgPT4gbWF0Y2hpbmdJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGFuIGF2YWlsYWJsZSBmaWxlIG5hbWUgZm9yIHRoZSBnZXN0dXJlIGNvbmZpZyB3aGljaCBzaG91bGRcbiAgICogYmUgc3RvcmVkIGluIHRoZSBzcGVjaWZpZWQgZmlsZSBwYXRoLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0QXZhaWxhYmxlR2VzdHVyZUNvbmZpZ0ZpbGVOYW1lKHNvdXJjZVJvb3Q6IERldmtpdFBhdGgpIHtcbiAgICBpZiAoIXRoaXMudHJlZS5leGlzdHMoZGV2a2l0Sm9pbihzb3VyY2VSb290LCBgJHtHRVNUVVJFX0NPTkZJR19GSUxFX05BTUV9LnRzYCkpKSB7XG4gICAgICByZXR1cm4gYCR7R0VTVFVSRV9DT05GSUdfRklMRV9OQU1FfS50c2A7XG4gICAgfVxuXG4gICAgbGV0IHBvc3NpYmxlTmFtZSA9IGAke0dFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRX0tYDtcbiAgICBsZXQgaW5kZXggPSAxO1xuICAgIHdoaWxlICh0aGlzLnRyZWUuZXhpc3RzKGRldmtpdEpvaW4oc291cmNlUm9vdCwgYCR7cG9zc2libGVOYW1lfS0ke2luZGV4fS50c2ApKSkge1xuICAgICAgaW5kZXgrKztcbiAgICB9XG4gICAgcmV0dXJuIGAke3Bvc3NpYmxlTmFtZSArIGluZGV4fS50c2A7XG4gIH1cblxuICAvKiogUmVwbGFjZXMgYSBnaXZlbiBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2Ugd2l0aCBhIG5ldyBpbXBvcnQuICovXG4gIHByaXZhdGUgX3JlcGxhY2VHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKFxuICAgICAge25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0fTogSWRlbnRpZmllclJlZmVyZW5jZSwgc3ltYm9sTmFtZTogc3RyaW5nLFxuICAgICAgbW9kdWxlU3BlY2lmaWVyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuXG4gICAgLy8gTGlzdCBvZiBhbGwgaWRlbnRpZmllcnMgcmVmZXJyaW5nIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgY3VycmVudCBmaWxlLiBUaGlzXG4gICAgLy8gYWxsb3dzIHVzIHRvIGFkZCBhbiBpbXBvcnQgZm9yIHRoZSBjb3BpZWQgZ2VzdHVyZSBjb25maWd1cmF0aW9uIHdpdGhvdXQgZ2VuZXJhdGluZyBhXG4gICAgLy8gbmV3IGlkZW50aWZpZXIgZm9yIHRoZSBpbXBvcnQgdG8gYXZvaWQgY29sbGlzaW9ucy4gaS5lLiBcIkdlc3R1cmVDb25maWdfMVwiLiBUaGUgaW1wb3J0XG4gICAgLy8gbWFuYWdlciBjaGVja3MgZm9yIHBvc3NpYmxlIG5hbWUgY29sbGlzaW9ucywgYnV0IGlzIGFibGUgdG8gaWdub3JlIHNwZWNpZmljIGlkZW50aWZpZXJzLlxuICAgIC8vIFdlIHVzZSB0aGlzIHRvIGlnbm9yZSBhbGwgcmVmZXJlbmNlcyB0byB0aGUgb3JpZ2luYWwgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyxcbiAgICAvLyBiZWNhdXNlIHRoZXNlIHdpbGwgYmUgcmVwbGFjZWQgYW5kIHRoZXJlZm9yZSB3aWxsIG5vdCBpbnRlcmZlcmUuXG4gICAgY29uc3QgZ2VzdHVyZUlkZW50aWZpZXJzSW5GaWxlID0gdGhpcy5fZ2V0R2VzdHVyZUNvbmZpZ0lkZW50aWZpZXJzT2ZGaWxlKHNvdXJjZUZpbGUpO1xuXG4gICAgLy8gSWYgdGhlIHBhcmVudCBvZiB0aGUgaWRlbnRpZmllciBpcyBhY2Nlc3NlZCB0aHJvdWdoIGEgbmFtZXNwYWNlLCB3ZSBjYW4ganVzdFxuICAgIC8vIGltcG9ydCB0aGUgbmV3IGdlc3R1cmUgY29uZmlnIHdpdGhvdXQgcmV3cml0aW5nIHRoZSBpbXBvcnQgZGVjbGFyYXRpb24gYmVjYXVzZVxuICAgIC8vIHRoZSBjb25maWcgaGFzIGJlZW4gaW1wb3J0ZWQgdGhyb3VnaCBhIG5hbWVzcGFjZWQgaW1wb3J0LlxuICAgIGlmIChpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGUpKSB7XG4gICAgICBjb25zdCBuZXdFeHByZXNzaW9uID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgICAgc291cmNlRmlsZSwgc3ltYm9sTmFtZSwgbW9kdWxlU3BlY2lmaWVyLCBmYWxzZSwgZ2VzdHVyZUlkZW50aWZpZXJzSW5GaWxlKTtcblxuICAgICAgcmVjb3JkZXIucmVtb3ZlKG5vZGUucGFyZW50LmdldFN0YXJ0KCksIG5vZGUucGFyZW50LmdldFdpZHRoKCkpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQobm9kZS5wYXJlbnQuZ2V0U3RhcnQoKSwgdGhpcy5fcHJpbnROb2RlKG5ld0V4cHJlc3Npb24sIHNvdXJjZUZpbGUpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZWxldGUgdGhlIG9sZCBpbXBvcnQgdG8gdGhlIFwiR2VzdHVyZUNvbmZpZ1wiLlxuICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICBzb3VyY2VGaWxlLCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUpO1xuXG4gICAgLy8gSWYgdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGlzIG5vdCBmcm9tIGluc2lkZSBvZiBhIGltcG9ydCwgd2UgbmVlZCB0byBhZGQgYSBuZXdcbiAgICAvLyBpbXBvcnQgdG8gdGhlIGNvcGllZCBnZXN0dXJlIGNvbmZpZyBhbmQgcmVwbGFjZSB0aGUgaWRlbnRpZmllci4gRm9yIHJlZmVyZW5jZXNcbiAgICAvLyB3aXRoaW4gYW4gaW1wb3J0LCB3ZSBkbyBub3RoaW5nIGJ1dCByZW1vdmluZyB0aGUgYWN0dWFsIGltcG9ydC4gVGhpcyBhbGxvd3MgdXNcbiAgICAvLyB0byByZW1vdmUgdW51c2VkIGltcG9ydHMgdG8gdGhlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgIGlmICghaXNJbXBvcnQpIHtcbiAgICAgIGNvbnN0IG5ld0V4cHJlc3Npb24gPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgICBzb3VyY2VGaWxlLCBzeW1ib2xOYW1lLCBtb2R1bGVTcGVjaWZpZXIsIGZhbHNlLCBnZXN0dXJlSWRlbnRpZmllcnNJbkZpbGUpO1xuXG4gICAgICByZWNvcmRlci5yZW1vdmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCkpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQobm9kZS5nZXRTdGFydCgpLCB0aGlzLl9wcmludE5vZGUobmV3RXhwcmVzc2lvbiwgc291cmNlRmlsZSkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgZ2l2ZW4gZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlIGFuZCBpdHMgY29ycmVzcG9uZGluZyBpbXBvcnQgZnJvbVxuICAgKiBpdHMgY29udGFpbmluZyBzb3VyY2UgZmlsZS4gSW1wb3J0cyB3aWxsIGJlIGFsd2F5cyByZW1vdmVkLCBidXQgaW4gc29tZSBjYXNlcyxcbiAgICogd2hlcmUgaXQncyBub3QgZ3VhcmFudGVlZCB0aGF0IGEgcmVtb3ZhbCBjYW4gYmUgcGVyZm9ybWVkIHNhZmVseSwgd2UganVzdFxuICAgKiBjcmVhdGUgYSBtaWdyYXRpb24gZmFpbHVyZSAoYW5kIGFkZCBhIFRPRE8gaWYgcG9zc2libGUpLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZSh7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnR9OiBJZGVudGlmaWVyUmVmZXJlbmNlKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5nZXRVcGRhdGVSZWNvcmRlcihzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICAvLyBPbmx5IHJlbW92ZSB0aGUgaW1wb3J0IGZvciB0aGUgZ2VzdHVyZSBjb25maWcgaWYgdGhlIGdlc3R1cmUgY29uZmlnIGhhc1xuICAgIC8vIGJlZW4gYWNjZXNzZWQgdGhyb3VnaCBhIG5vbi1uYW1lc3BhY2VkIGlkZW50aWZpZXIgYWNjZXNzLlxuICAgIGlmICghaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2Vzcyhub2RlKSkge1xuICAgICAgdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoXG4gICAgICAgICAgc291cmNlRmlsZSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lKTtcbiAgICB9XG5cbiAgICAvLyBGb3IgcmVmZXJlbmNlcyBmcm9tIHdpdGhpbiBhbiBpbXBvcnQsIHdlIGRvIG5vdCBuZWVkIHRvIGRvIGFueXRoaW5nIG90aGVyIHRoYW5cbiAgICAvLyByZW1vdmluZyB0aGUgaW1wb3J0LiBGb3Igb3RoZXIgcmVmZXJlbmNlcywgd2UgcmVtb3ZlIHRoZSBpbXBvcnQgYW5kIHRoZSByZWZlcmVuY2VcbiAgICAvLyBpZGVudGlmaWVyIGlmIHVzZWQgaW5zaWRlIG9mIGEgcHJvdmlkZXIgZGVmaW5pdGlvbi5cbiAgICBpZiAoaXNJbXBvcnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcm92aWRlckFzc2lnbm1lbnQgPSBub2RlLnBhcmVudDtcblxuICAgIC8vIE9ubHkgcmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlIGdlc3R1cmUgY29uZmlnIHdoaWNoIGFyZSBwYXJ0IG9mIGEgc3RhdGljYWxseVxuICAgIC8vIGFuYWx5emFibGUgcHJvdmlkZXIgZGVmaW5pdGlvbi4gV2Ugb25seSBzdXBwb3J0IHRoZSBjb21tb24gY2FzZSBvZiBhIGdlc3R1cmVcbiAgICAvLyBjb25maWcgcHJvdmlkZXIgZGVmaW5pdGlvbiB3aGVyZSB0aGUgY29uZmlnIGlzIHNldCB1cCB0aHJvdWdoIFwidXNlQ2xhc3NcIi5cbiAgICAvLyBPdGhlcndpc2UsIGl0J3Mgbm90IGd1YXJhbnRlZWQgdGhhdCB3ZSBjYW4gc2FmZWx5IHJlbW92ZSB0aGUgcHJvdmlkZXIgZGVmaW5pdGlvbi5cbiAgICBpZiAoIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3ZpZGVyQXNzaWdubWVudCkgfHxcbiAgICAgICAgZ2V0UHJvcGVydHlOYW1lVGV4dChwcm92aWRlckFzc2lnbm1lbnQubmFtZSkgIT09ICd1c2VDbGFzcycpIHtcbiAgICAgIHRoaXMuX25vZGVGYWlsdXJlcy5wdXNoKHtub2RlLCBtZXNzYWdlOiBDQU5OT1RfUkVNT1ZFX1JFRkVSRU5DRV9FUlJPUn0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9iamVjdExpdGVyYWxFeHByID0gcHJvdmlkZXJBc3NpZ25tZW50LnBhcmVudDtcbiAgICBjb25zdCBwcm92aWRlVG9rZW4gPSBvYmplY3RMaXRlcmFsRXhwci5wcm9wZXJ0aWVzLmZpbmQoXG4gICAgICAgIChwKTogcCBpcyB0cy5Qcm9wZXJ0eUFzc2lnbm1lbnQgPT5cbiAgICAgICAgICAgIHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHApICYmIGdldFByb3BlcnR5TmFtZVRleHQocC5uYW1lKSA9PT0gJ3Byb3ZpZGUnKTtcblxuICAgIC8vIERvIG5vdCByZW1vdmUgdGhlIHJlZmVyZW5jZSBpZiB0aGUgZ2VzdHVyZSBjb25maWcgaXMgbm90IHBhcnQgb2YgYSBwcm92aWRlciBkZWZpbml0aW9uLFxuICAgIC8vIG9yIGlmIHRoZSBwcm92aWRlZCB0b2tlIGlzIG5vdCByZWZlcnJpbmcgdG8gdGhlIGtub3duIEhBTU1FUl9HRVNUVVJFX0NPTkZJRyB0b2tlblxuICAgIC8vIGZyb20gcGxhdGZvcm0tYnJvd3Nlci5cbiAgICBpZiAoIXByb3ZpZGVUb2tlbiB8fCAhdGhpcy5faXNSZWZlcmVuY2VUb0hhbW1lckNvbmZpZ1Rva2VuKHByb3ZpZGVUb2tlbi5pbml0aWFsaXplcikpIHtcbiAgICAgIHRoaXMuX25vZGVGYWlsdXJlcy5wdXNoKHtub2RlLCBtZXNzYWdlOiBDQU5OT1RfUkVNT1ZFX1JFRkVSRU5DRV9FUlJPUn0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENvbGxlY3QgYWxsIG5lc3RlZCBpZGVudGlmaWVycyB3aGljaCB3aWxsIGJlIGRlbGV0ZWQuIFRoaXMgaGVscHMgdXNcbiAgICAvLyBkZXRlcm1pbmluZyBpZiB3ZSBjYW4gcmVtb3ZlIGltcG9ydHMgZm9yIHRoZSBcIkhBTU1FUl9HRVNUVVJFX0NPTkZJR1wiIHRva2VuLlxuICAgIHRoaXMuX2RlbGV0ZWRJZGVudGlmaWVycy5wdXNoKC4uLmZpbmRNYXRjaGluZ0NoaWxkTm9kZXMob2JqZWN0TGl0ZXJhbEV4cHIsIHRzLmlzSWRlbnRpZmllcikpO1xuXG4gICAgLy8gSW4gY2FzZSB0aGUgZm91bmQgcHJvdmlkZXIgZGVmaW5pdGlvbiBpcyBub3QgcGFydCBvZiBhbiBhcnJheSBsaXRlcmFsLFxuICAgIC8vIHdlIGNhbm5vdCBzYWZlbHkgcmVtb3ZlIHRoZSBwcm92aWRlci4gVGhpcyBpcyBiZWNhdXNlIGl0IGNvdWxkIGJlIGRlY2xhcmVkXG4gICAgLy8gYXMgYSB2YXJpYWJsZS4gZS5nLiBcImNvbnN0IGdlc3R1cmVQcm92aWRlciA9IHtwcm92aWRlOiAuLiwgdXNlQ2xhc3M6IEdlc3R1cmVDb25maWd9XCIuXG4gICAgLy8gSW4gdGhhdCBjYXNlLCB3ZSBqdXN0IGFkZCBhbiBlbXB0eSBvYmplY3QgbGl0ZXJhbCB3aXRoIFRPRE8gYW5kIHByaW50IGEgZmFpbHVyZS5cbiAgICBpZiAoIXRzLmlzQXJyYXlMaXRlcmFsRXhwcmVzc2lvbihvYmplY3RMaXRlcmFsRXhwci5wYXJlbnQpKSB7XG4gICAgICByZWNvcmRlci5yZW1vdmUob2JqZWN0TGl0ZXJhbEV4cHIuZ2V0U3RhcnQoKSwgb2JqZWN0TGl0ZXJhbEV4cHIuZ2V0V2lkdGgoKSk7XG4gICAgICByZWNvcmRlci5pbnNlcnRSaWdodChvYmplY3RMaXRlcmFsRXhwci5nZXRTdGFydCgpLCBgLyogVE9ETzogcmVtb3ZlICovIHt9YCk7XG4gICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7XG4gICAgICAgIG5vZGU6IG9iamVjdExpdGVyYWxFeHByLFxuICAgICAgICBtZXNzYWdlOiBgVW5hYmxlIHRvIGRlbGV0ZSBwcm92aWRlciBkZWZpbml0aW9uIGZvciBcIkdlc3R1cmVDb25maWdcIiBjb21wbGV0ZWx5LiBgICtcbiAgICAgICAgICAgIGBQbGVhc2UgY2xlYW4gdXAgdGhlIHByb3ZpZGVyLmBcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZXMgdGhlIG9iamVjdCBsaXRlcmFsIGZyb20gdGhlIHBhcmVudCBhcnJheSBleHByZXNzaW9uLiBSZW1vdmVzXG4gICAgLy8gdGhlIHRyYWlsaW5nIGNvbW1hIHRva2VuIGlmIHByZXNlbnQuXG4gICAgcmVtb3ZlRWxlbWVudEZyb21BcnJheUV4cHJlc3Npb24ob2JqZWN0TGl0ZXJhbEV4cHIsIHJlY29yZGVyKTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIHRoZSBnaXZlbiBoYW1tZXIgY29uZmlnIHRva2VuIGltcG9ydCBpZiBpdCBpcyBub3QgdXNlZC4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyQ29uZmlnVG9rZW5JbXBvcnRJZlVudXNlZCh7bm9kZSwgaW1wb3J0RGF0YX06IElkZW50aWZpZXJSZWZlcmVuY2UpIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgaXNUb2tlblVzZWQgPSB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShcbiAgICAgICAgciA9PiAhci5pc0ltcG9ydCAmJiAhaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2VzcyhyLm5vZGUpICYmXG4gICAgICAgICAgICByLm5vZGUuZ2V0U291cmNlRmlsZSgpID09PSBzb3VyY2VGaWxlICYmICF0aGlzLl9kZWxldGVkSWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSk7XG5cbiAgICAvLyBXZSBkb24ndCB3YW50IHRvIHJlbW92ZSB0aGUgaW1wb3J0IGZvciB0aGUgdG9rZW4gaWYgdGhlIHRva2VuIGlzXG4gICAgLy8gc3RpbGwgdXNlZCBzb21ld2hlcmUuXG4gICAgaWYgKCFpc1Rva2VuVXNlZCkge1xuICAgICAgdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoXG4gICAgICAgICAgc291cmNlRmlsZSwgSEFNTUVSX0NPTkZJR19UT0tFTl9OQU1FLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZW1vdmVzIEhhbW1lciBmcm9tIGFsbCBpbmRleCBIVE1MIGZpbGVzIG9mIHRoZSBnaXZlbiBwcm9qZWN0LiAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJGcm9tSW5kZXhGaWxlKHByb2plY3Q6IFdvcmtzcGFjZVByb2plY3QpIHtcbiAgICBjb25zdCBpbmRleEZpbGVQYXRocyA9IGdldFByb2plY3RJbmRleEZpbGVzKHByb2plY3QpO1xuICAgIGluZGV4RmlsZVBhdGhzLmZvckVhY2goZmlsZVBhdGggPT4ge1xuICAgICAgaWYgKCF0aGlzLnRyZWUuZXhpc3RzKGZpbGVQYXRoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGh0bWxDb250ZW50ID0gdGhpcy50cmVlLnJlYWQoZmlsZVBhdGgpIS50b1N0cmluZygndXRmOCcpO1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKGZpbGVQYXRoKTtcblxuICAgICAgZmluZEhhbW1lclNjcmlwdEltcG9ydEVsZW1lbnRzKGh0bWxDb250ZW50KVxuICAgICAgICAgIC5mb3JFYWNoKGVsID0+IHJlbW92ZUVsZW1lbnRGcm9tSHRtbChlbCwgcmVjb3JkZXIpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSBIYW1tZXIgZ2VzdHVyZSBjb25maWcgaW4gdGhlIHJvb3QgbW9kdWxlIGlmIG5lZWRlZC4gKi9cbiAgcHJpdmF0ZSBfc2V0dXBOZXdHZXN0dXJlQ29uZmlnSW5Sb290TW9kdWxlKGdlc3R1cmVDb25maWdQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYWluRmlsZVBhdGggPSBqb2luKHRoaXMuYmFzZVBhdGgsIGdldFByb2plY3RNYWluRmlsZSh0aGlzLnByb2plY3QpKTtcbiAgICBjb25zdCByb290TW9kdWxlU3ltYm9sID0gdGhpcy5fZ2V0Um9vdE1vZHVsZVN5bWJvbChtYWluRmlsZVBhdGgpO1xuXG4gICAgaWYgKHJvb3RNb2R1bGVTeW1ib2wgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiBtYWluRmlsZVBhdGgsXG4gICAgICAgIG1lc3NhZ2U6IGBDb3VsZCBub3Qgc2V0dXAgSGFtbWVyIGdlc3R1cmVzIGluIG1vZHVsZS4gUGxlYXNlIGAgK1xuICAgICAgICAgICAgYG1hbnVhbGx5IGVuc3VyZSB0aGF0IHRoZSBIYW1tZXIgZ2VzdHVyZSBjb25maWcgaXMgc2V0IHVwLmAsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VGaWxlID0gcm9vdE1vZHVsZVN5bWJvbC52YWx1ZURlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCByZWxhdGl2ZVBhdGggPSByZWxhdGl2ZSh0aGlzLmJhc2VQYXRoLCBzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICBjb25zdCBtZXRhZGF0YSA9IGdldERlY29yYXRvck1ldGFkYXRhKHNvdXJjZUZpbGUsICdOZ01vZHVsZScsICdAYW5ndWxhci9jb3JlJykgYXNcbiAgICAgICAgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25bXTtcblxuICAgIC8vIElmIG5vIFwiTmdNb2R1bGVcIiBkZWZpbml0aW9uIGlzIGZvdW5kIGluc2lkZSB0aGUgc291cmNlIGZpbGUsIHdlIGp1c3QgZG8gbm90aGluZy5cbiAgICBpZiAoIW1ldGFkYXRhLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5nZXRVcGRhdGVSZWNvcmRlcihzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICBjb25zdCBwcm92aWRlcnNGaWVsZCA9IGdldE1ldGFkYXRhRmllbGQobWV0YWRhdGFbMF0sICdwcm92aWRlcnMnKVswXTtcbiAgICBjb25zdCBwcm92aWRlcklkZW50aWZpZXJzID1cbiAgICAgICAgcHJvdmlkZXJzRmllbGQgPyBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzKHByb3ZpZGVyc0ZpZWxkLCB0cy5pc0lkZW50aWZpZXIpIDogbnVsbDtcbiAgICBjb25zdCBnZXN0dXJlQ29uZmlnRXhwciA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICBzb3VyY2VGaWxlLCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLFxuICAgICAgICBnZXRNb2R1bGVTcGVjaWZpZXIoZ2VzdHVyZUNvbmZpZ1BhdGgsIHNvdXJjZUZpbGUuZmlsZU5hbWUpLCBmYWxzZSxcbiAgICAgICAgdGhpcy5fZ2V0R2VzdHVyZUNvbmZpZ0lkZW50aWZpZXJzT2ZGaWxlKHNvdXJjZUZpbGUpKTtcbiAgICBjb25zdCBoYW1tZXJDb25maWdUb2tlbkV4cHIgPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgc291cmNlRmlsZSwgSEFNTUVSX0NPTkZJR19UT0tFTl9OQU1FLCBIQU1NRVJfQ09ORklHX1RPS0VOX01PRFVMRSk7XG4gICAgY29uc3QgbmV3UHJvdmlkZXJOb2RlID0gdHMuY3JlYXRlT2JqZWN0TGl0ZXJhbChbXG4gICAgICB0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQoJ3Byb3ZpZGUnLCBoYW1tZXJDb25maWdUb2tlbkV4cHIpLFxuICAgICAgdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KCd1c2VDbGFzcycsIGdlc3R1cmVDb25maWdFeHByKVxuICAgIF0pO1xuXG4gICAgLy8gSWYgdGhlIHByb3ZpZGVycyBmaWVsZCBleGlzdHMgYW5kIGFscmVhZHkgY29udGFpbnMgcmVmZXJlbmNlcyB0byB0aGUgaGFtbWVyIGdlc3R1cmVcbiAgICAvLyBjb25maWcgdG9rZW4gYW5kIHRoZSBnZXN0dXJlIGNvbmZpZywgd2UgbmFpdmVseSBhc3N1bWUgdGhhdCB0aGUgZ2VzdHVyZSBjb25maWcgaXNcbiAgICAvLyBhbHJlYWR5IHNldCB1cC4gV2Ugb25seSB3YW50IHRvIGFkZCB0aGUgZ2VzdHVyZSBjb25maWcgcHJvdmlkZXIgaWYgaXQgaXMgbm90IHNldCB1cC5cbiAgICBpZiAoIXByb3ZpZGVySWRlbnRpZmllcnMgfHxcbiAgICAgICAgISh0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHByb3ZpZGVySWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSkgJiZcbiAgICAgICAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5zb21lKHIgPT4gcHJvdmlkZXJJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKSkpIHtcbiAgICAgIGFkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YShcbiAgICAgICAgICBzb3VyY2VGaWxlLCByZWxhdGl2ZVBhdGgsICdwcm92aWRlcnMnLCB0aGlzLl9wcmludE5vZGUobmV3UHJvdmlkZXJOb2RlLCBzb3VyY2VGaWxlKSwgbnVsbClcbiAgICAgICAgICAuZm9yRWFjaChjaGFuZ2UgPT4ge1xuICAgICAgICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICAgICAgICByZWNvcmRlci5pbnNlcnRSaWdodChjaGFuZ2UucG9zLCBjaGFuZ2UudG9BZGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBUeXBlU2NyaXB0IHN5bWJvbCBvZiB0aGUgcm9vdCBtb2R1bGUgYnkgbG9va2luZyBmb3IgdGhlIG1vZHVsZVxuICAgKiBib290c3RyYXAgZXhwcmVzc2lvbiBpbiB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0Um9vdE1vZHVsZVN5bWJvbChtYWluRmlsZVBhdGg6IHN0cmluZyk6IHRzLlN5bWJvbHxudWxsIHtcbiAgICBjb25zdCBtYWluRmlsZSA9IHRoaXMucHJvZ3JhbS5nZXRTb3VyY2VGaWxlKG1haW5GaWxlUGF0aCk7XG4gICAgaWYgKCFtYWluRmlsZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYXBwTW9kdWxlRXhwciA9IGZpbmRNYWluTW9kdWxlRXhwcmVzc2lvbihtYWluRmlsZSk7XG4gICAgaWYgKCFhcHBNb2R1bGVFeHByKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhcHBNb2R1bGVTeW1ib2wgPSB0aGlzLl9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZSh1bndyYXBFeHByZXNzaW9uKGFwcE1vZHVsZUV4cHIpKTtcbiAgICBpZiAoIWFwcE1vZHVsZVN5bWJvbCB8fCAhYXBwTW9kdWxlU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gYXBwTW9kdWxlU3ltYm9sO1xuICB9XG5cbiAgLyoqIFNldHMgdXAgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaW4gdGhlIHJvb3QgbW9kdWxlIG9mIHRoZSBwcm9qZWN0LiAqL1xuICBwcml2YXRlIF9zZXR1cEhhbW1lck1vZHVsZUluUm9vdE1vZHVsZSgpIHtcbiAgICBjb25zdCBtYWluRmlsZVBhdGggPSBqb2luKHRoaXMuYmFzZVBhdGgsIGdldFByb2plY3RNYWluRmlsZSh0aGlzLnByb2plY3QpKTtcbiAgICBjb25zdCByb290TW9kdWxlU3ltYm9sID0gdGhpcy5fZ2V0Um9vdE1vZHVsZVN5bWJvbChtYWluRmlsZVBhdGgpO1xuXG4gICAgaWYgKHJvb3RNb2R1bGVTeW1ib2wgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiBtYWluRmlsZVBhdGgsXG4gICAgICAgIG1lc3NhZ2U6IGBDb3VsZCBub3Qgc2V0dXAgSGFtbWVyTW9kdWxlLiBQbGVhc2UgbWFudWFsbHkgc2V0IHVwIHRoZSBcIkhhbW1lck1vZHVsZVwiIGAgK1xuICAgICAgICAgICAgYGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuYCxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSByb290TW9kdWxlU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHRoaXMuYmFzZVBhdGgsIHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IG1ldGFkYXRhID0gZ2V0RGVjb3JhdG9yTWV0YWRhdGEoc291cmNlRmlsZSwgJ05nTW9kdWxlJywgJ0Bhbmd1bGFyL2NvcmUnKSBhc1xuICAgICAgICB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbltdO1xuICAgIGlmICghbWV0YWRhdGEubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW1wb3J0c0ZpZWxkID0gZ2V0TWV0YWRhdGFGaWVsZChtZXRhZGF0YVswXSwgJ2ltcG9ydHMnKVswXTtcbiAgICBjb25zdCBpbXBvcnRJZGVudGlmaWVycyA9XG4gICAgICAgIGltcG9ydHNGaWVsZCA/IGZpbmRNYXRjaGluZ0NoaWxkTm9kZXMoaW1wb3J0c0ZpZWxkLCB0cy5pc0lkZW50aWZpZXIpIDogbnVsbDtcbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZ2V0VXBkYXRlUmVjb3JkZXIoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgY29uc3QgaGFtbWVyTW9kdWxlRXhwciA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICBzb3VyY2VGaWxlLCBIQU1NRVJfTU9EVUxFX05BTUUsIEhBTU1FUl9NT0RVTEVfSU1QT1JUKTtcblxuICAgIC8vIElmIHRoZSBcIkhhbW1lck1vZHVsZVwiIGlzIG5vdCBhbHJlYWR5IGltcG9ydGVkIGluIHRoZSBhcHAgbW9kdWxlLCB3ZSBzZXQgaXQgdXBcbiAgICAvLyBieSBhZGRpbmcgaXQgdG8gdGhlIFwiaW1wb3J0c1wiIGZpZWxkIG9mIHRoZSBhcHAgbW9kdWxlLlxuICAgIGlmICghaW1wb3J0SWRlbnRpZmllcnMgfHxcbiAgICAgICAgIXRoaXMuX2hhbW1lck1vZHVsZVJlZmVyZW5jZXMuc29tZShyID0+IGltcG9ydElkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpKSB7XG4gICAgICBhZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEoXG4gICAgICAgICAgc291cmNlRmlsZSwgcmVsYXRpdmVQYXRoLCAnaW1wb3J0cycsIHRoaXMuX3ByaW50Tm9kZShoYW1tZXJNb2R1bGVFeHByLCBzb3VyY2VGaWxlKSwgbnVsbClcbiAgICAgICAgICAuZm9yRWFjaChjaGFuZ2UgPT4ge1xuICAgICAgICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICAgICAgICByZWNvcmRlci5pbnNlcnRSaWdodChjaGFuZ2UucG9zLCBjaGFuZ2UudG9BZGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBQcmludHMgYSBnaXZlbiBub2RlIHdpdGhpbiB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlLiAqL1xuICBwcml2YXRlIF9wcmludE5vZGUobm9kZTogdHMuTm9kZSwgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCBub2RlLCBzb3VyY2VGaWxlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFsbCByZWZlcmVuY2VkIGdlc3R1cmUgY29uZmlnIGlkZW50aWZpZXJzIG9mIGEgZ2l2ZW4gc291cmNlIGZpbGUgKi9cbiAgcHJpdmF0ZSBfZ2V0R2VzdHVyZUNvbmZpZ0lkZW50aWZpZXJzT2ZGaWxlKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiB0cy5JZGVudGlmaWVyW10ge1xuICAgIHJldHVybiB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5maWx0ZXIoZCA9PiBkLm5vZGUuZ2V0U291cmNlRmlsZSgpID09PSBzb3VyY2VGaWxlKVxuICAgICAgICAubWFwKGQgPT4gZC5ub2RlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzeW1ib2wgdGhhdCBjb250YWlucyB0aGUgdmFsdWUgZGVjbGFyYXRpb24gb2YgdGhlIHNwZWNpZmllZCBub2RlLiAqL1xuICBwcml2YXRlIF9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlOiB0cy5Ob2RlKTogdHMuU3ltYm9sfHVuZGVmaW5lZCB7XG4gICAgY29uc3Qgc3ltYm9sID0gdGhpcy50eXBlQ2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUpO1xuXG4gICAgLy8gU3ltYm9scyBjYW4gYmUgYWxpYXNlcyBvZiB0aGUgZGVjbGFyYXRpb24gc3ltYm9sLiBlLmcuIGluIG5hbWVkIGltcG9ydCBzcGVjaWZpZXJzLlxuICAgIC8vIFdlIG5lZWQgdG8gcmVzb2x2ZSB0aGUgYWxpYXNlZCBzeW1ib2wgYmFjayB0byB0aGUgZGVjbGFyYXRpb24gc3ltYm9sLlxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1iaXR3aXNlXG4gICAgaWYgKHN5bWJvbCAmJiAoc3ltYm9sLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuQWxpYXMpICE9PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy50eXBlQ2hlY2tlci5nZXRBbGlhc2VkU3ltYm9sKHN5bWJvbCk7XG4gICAgfVxuICAgIHJldHVybiBzeW1ib2w7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIGV4cHJlc3Npb24gcmVzb2x2ZXMgdG8gYSBoYW1tZXIgZ2VzdHVyZSBjb25maWdcbiAgICogdG9rZW4gcmVmZXJlbmNlIGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuXG4gICAqL1xuICBwcml2YXRlIF9pc1JlZmVyZW5jZVRvSGFtbWVyQ29uZmlnVG9rZW4oZXhwcjogdHMuRXhwcmVzc2lvbikge1xuICAgIGNvbnN0IHVud3JhcHBlZCA9IHVud3JhcEV4cHJlc3Npb24oZXhwcik7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcih1bndyYXBwZWQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUociA9PiByLm5vZGUgPT09IHVud3JhcHBlZCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbih1bndyYXBwZWQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUociA9PiByLm5vZGUgPT09IHVud3JhcHBlZC5uYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgbWlncmF0aW9uIGZhaWx1cmVzIG9mIHRoZSBjb2xsZWN0ZWQgbm9kZSBmYWlsdXJlcy4gVGhlIHJldHVybmVkIG1pZ3JhdGlvblxuICAgKiBmYWlsdXJlcyBhcmUgdXBkYXRlZCB0byByZWZsZWN0IHRoZSBwb3N0LW1pZ3JhdGlvbiBzdGF0ZSBvZiBzb3VyY2UgZmlsZXMuIE1lYW5pbmdcbiAgICogdGhhdCBmYWlsdXJlIHBvc2l0aW9ucyBhcmUgY29ycmVjdGVkIGlmIHNvdXJjZSBmaWxlIG1vZGlmaWNhdGlvbnMgc2hpZnRlZCBsaW5lcy5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU1pZ3JhdGlvbkZhaWx1cmVzKCk6IE1pZ3JhdGlvbkZhaWx1cmVbXSB7XG4gICAgcmV0dXJuIHRoaXMuX25vZGVGYWlsdXJlcy5tYXAoKHtub2RlLCBtZXNzYWdlfSkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gbm9kZS5nZXRTdGFydCgpO1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0cy5nZXRMaW5lQW5kQ2hhcmFjdGVyT2ZQb3NpdGlvbihub2RlLmdldFNvdXJjZUZpbGUoKSwgbm9kZS5nZXRTdGFydCgpKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aW9uOiB0aGlzLl9pbXBvcnRNYW5hZ2VyLmNvcnJlY3ROb2RlUG9zaXRpb24obm9kZSwgb2Zmc2V0LCBwb3NpdGlvbiksXG4gICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIGZpbGVQYXRoOiBzb3VyY2VGaWxlLmZpbGVOYW1lLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBHbG9iYWwgc3RhdGUgb2Ygd2hldGhlciBIYW1tZXIgaXMgdXNlZCBpbiBhbnkgYW5hbHl6ZWQgcHJvamVjdCB0YXJnZXQuICovXG4gIHN0YXRpYyBnbG9iYWxVc2VzSGFtbWVyID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFN0YXRpYyBtaWdyYXRpb24gcnVsZSBtZXRob2QgdGhhdCB3aWxsIGJlIGNhbGxlZCBvbmNlIGFsbCBwcm9qZWN0IHRhcmdldHNcbiAgICogaGF2ZSBiZWVuIG1pZ3JhdGVkIGluZGl2aWR1YWxseS4gVGhpcyBtZXRob2QgY2FuIGJlIHVzZWQgdG8gbWFrZSBjaGFuZ2VzIGJhc2VkXG4gICAqIG9uIHRoZSBhbmFseXNpcyBvZiB0aGUgaW5kaXZpZHVhbCB0YXJnZXRzLiBGb3IgZXhhbXBsZTogd2Ugb25seSByZW1vdmUgSGFtbWVyXG4gICAqIGZyb20gdGhlIFwicGFja2FnZS5qc29uXCIgaWYgaXQgaXMgbm90IHVzZWQgaW4gKmFueSogcHJvamVjdCB0YXJnZXQuXG4gICAqL1xuICBzdGF0aWMgZ2xvYmFsUG9zdE1pZ3JhdGlvbih0cmVlOiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KTogUG9zdE1pZ3JhdGlvbkFjdGlvbiB7XG4gICAgLy8gQWx3YXlzIG5vdGlmeSB0aGUgZGV2ZWxvcGVyIHRoYXQgdGhlIEhhbW1lciB2OSBtaWdyYXRpb24gZG9lcyBub3QgbWlncmF0ZSB0ZXN0cy5cbiAgICBjb250ZXh0LmxvZ2dlci5pbmZvKFxuICAgICAgICAnXFxu4pqgICBHZW5lcmFsIG5vdGljZTogVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBDb21wb25lbnRzIGlzIG5vdCBhYmxlIHRvICcgK1xuICAgICAgICAnbWlncmF0ZSB0ZXN0cy4gUGxlYXNlIG1hbnVhbGx5IGNsZWFuIHVwIHRlc3RzIGluIHlvdXIgcHJvamVjdCBpZiB0aGV5IHJlbHkgb24gJyArXG4gICAgICAgICh0aGlzLmdsb2JhbFVzZXNIYW1tZXIgPyAndGhlIGRlcHJlY2F0ZWQgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy4nIDogJ0hhbW1lckpTLicpKTtcbiAgICBjb250ZXh0LmxvZ2dlci5pbmZvKFxuICAgICAgICAnUmVhZCBtb3JlIGFib3V0IG1pZ3JhdGluZyB0ZXN0czogaHR0cHM6Ly9naXQuaW8vbmctbWF0ZXJpYWwtdjktaGFtbWVyLW1pZ3JhdGUtdGVzdHMnKTtcblxuICAgIGlmICghdGhpcy5nbG9iYWxVc2VzSGFtbWVyICYmIHRoaXMuX3JlbW92ZUhhbW1lckZyb21QYWNrYWdlSnNvbih0cmVlKSkge1xuICAgICAgLy8gU2luY2UgSGFtbWVyIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgd29ya3NwYWNlIFwicGFja2FnZS5qc29uXCIgZmlsZSxcbiAgICAgIC8vIHdlIHNjaGVkdWxlIGEgbm9kZSBwYWNrYWdlIGluc3RhbGwgdGFzayB0byByZWZyZXNoIHRoZSBsb2NrIGZpbGUuXG4gICAgICByZXR1cm4ge3J1blBhY2thZ2VNYW5hZ2VyOiB0cnVlfTtcbiAgICB9XG5cbiAgICAvLyBDbGVhbiBnbG9iYWwgc3RhdGUgb25jZSB0aGUgd29ya3NwYWNlIGhhcyBiZWVuIG1pZ3JhdGVkLiBUaGlzIGlzIHRlY2huaWNhbGx5XG4gICAgLy8gbm90IG5lY2Vzc2FyeSBpbiBcIm5nIHVwZGF0ZVwiLCBidXQgaW4gdGVzdHMgd2UgcmUtdXNlIHRoZSBzYW1lIHJ1bGUgY2xhc3MuXG4gICAgdGhpcy5nbG9iYWxVc2VzSGFtbWVyID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgaGFtbWVyIHBhY2thZ2UgZnJvbSB0aGUgd29ya3NwYWNlIFwicGFja2FnZS5qc29uXCIuXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgSGFtbWVyIHdhcyBzZXQgdXAgYW5kIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgXCJwYWNrYWdlLmpzb25cIlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgX3JlbW92ZUhhbW1lckZyb21QYWNrYWdlSnNvbih0cmVlOiBUcmVlKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0cmVlLmV4aXN0cygnL3BhY2thZ2UuanNvbicpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHRyZWUucmVhZCgnL3BhY2thZ2UuanNvbicpIS50b1N0cmluZygndXRmOCcpKTtcblxuICAgIC8vIFdlIGRvIG5vdCBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgc29tZW9uZSBtYW51YWxseSBhZGRlZCBcImhhbW1lcmpzXCJcbiAgICAvLyB0byB0aGUgZGV2IGRlcGVuZGVuY2llcy5cbiAgICBpZiAocGFja2FnZUpzb24uZGVwZW5kZW5jaWVzW0hBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSXSkge1xuICAgICAgZGVsZXRlIHBhY2thZ2VKc29uLmRlcGVuZGVuY2llc1tIQU1NRVJfTU9EVUxFX1NQRUNJRklFUl07XG4gICAgICB0cmVlLm92ZXJ3cml0ZSgnL3BhY2thZ2UuanNvbicsIEpTT04uc3RyaW5naWZ5KHBhY2thZ2VKc29uLCBudWxsLCAyKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgdW53cmFwcyBhIGdpdmVuIGV4cHJlc3Npb24gaWYgaXQgaXMgd3JhcHBlZFxuICogYnkgcGFyZW50aGVzaXMsIHR5cGUgY2FzdHMgb3IgdHlwZSBhc3NlcnRpb25zLlxuICovXG5mdW5jdGlvbiB1bndyYXBFeHByZXNzaW9uKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlIHtcbiAgaWYgKHRzLmlzUGFyZW50aGVzaXplZEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9IGVsc2UgaWYgKHRzLmlzQXNFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgcmV0dXJuIHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgfSBlbHNlIGlmICh0cy5pc1R5cGVBc3NlcnRpb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9XG4gIHJldHVybiBub2RlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBzcGVjaWZpZWQgcGF0aCB0byBhIHZhbGlkIFR5cGVTY3JpcHQgbW9kdWxlIHNwZWNpZmllciB3aGljaCBpc1xuICogcmVsYXRpdmUgdG8gdGhlIGdpdmVuIGNvbnRhaW5pbmcgZmlsZS5cbiAqL1xuZnVuY3Rpb24gZ2V0TW9kdWxlU3BlY2lmaWVyKG5ld1BhdGg6IHN0cmluZywgY29udGFpbmluZ0ZpbGU6IHN0cmluZykge1xuICBsZXQgcmVzdWx0ID0gcmVsYXRpdmUoZGlybmFtZShjb250YWluaW5nRmlsZSksIG5ld1BhdGgpLnJlcGxhY2UoL1xcXFwvZywgJy8nKS5yZXBsYWNlKC9cXC50cyQvLCAnJyk7XG4gIGlmICghcmVzdWx0LnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgIHJlc3VsdCA9IGAuLyR7cmVzdWx0fWA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSBuYW1lLlxuICogQHJldHVybnMgVGV4dCBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgbmFtZS4gTnVsbCBpZiBub3Qgc3RhdGljYWxseSBhbmFseXphYmxlLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eU5hbWVUZXh0KG5vZGU6IHRzLlByb3BlcnR5TmFtZSk6IHN0cmluZ3xudWxsIHtcbiAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSB8fCB0cy5pc1N0cmluZ0xpdGVyYWxMaWtlKG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGUudGV4dDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBpZGVudGlmaWVyIGlzIHBhcnQgb2YgYSBuYW1lc3BhY2VkIGFjY2Vzcy4gKi9cbmZ1bmN0aW9uIGlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZTogdHMuSWRlbnRpZmllcik6IGJvb2xlYW4ge1xuICByZXR1cm4gdHMuaXNRdWFsaWZpZWROYW1lKG5vZGUucGFyZW50KSB8fCB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLnBhcmVudCk7XG59XG5cbi8qKlxuICogV2Fsa3MgdGhyb3VnaCB0aGUgc3BlY2lmaWVkIG5vZGUgYW5kIHJldHVybnMgYWxsIGNoaWxkIG5vZGVzIHdoaWNoIG1hdGNoIHRoZVxuICogZ2l2ZW4gcHJlZGljYXRlLlxuICovXG5mdW5jdGlvbiBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzPFQgZXh0ZW5kcyB0cy5Ob2RlPihcbiAgICBwYXJlbnQ6IHRzLk5vZGUsIHByZWRpY2F0ZTogKG5vZGU6IHRzLk5vZGUpID0+IG5vZGUgaXMgVCk6IFRbXSB7XG4gIGNvbnN0IHJlc3VsdDogVFtdID0gW107XG4gIGNvbnN0IHZpc2l0Tm9kZSA9IChub2RlOiB0cy5Ob2RlKSA9PiB7XG4gICAgaWYgKHByZWRpY2F0ZShub2RlKSkge1xuICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XG4gICAgfVxuICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCB2aXNpdE5vZGUpO1xuICB9O1xuICB0cy5mb3JFYWNoQ2hpbGQocGFyZW50LCB2aXNpdE5vZGUpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl19