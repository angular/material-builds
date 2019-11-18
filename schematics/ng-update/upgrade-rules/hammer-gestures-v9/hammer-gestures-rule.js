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
        define("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-gestures-rule", ["require", "exports", "@angular-devkit/core", "@angular-devkit/schematics", "@angular/cdk/schematics", "@schematics/angular/utility/ast-utils", "@schematics/angular/utility/change", "@schematics/angular/utility/config", "chalk", "fs", "path", "typescript", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/cli-workspace", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/find-hammer-script-tags", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/find-main-module", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-template-check", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/identifier-imports", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/import-manager", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/remove-array-element", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/remove-element-from-html"], factory);
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
    const identifier_imports_1 = require("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/identifier-imports");
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
    const CANNOT_SETUP_APP_MODULE_ERROR = `Could not setup Hammer gestures in module. Please ` +
        `manually ensure that the Hammer gesture config is set up.`;
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
            /** Whether HammerJS is explicitly used in any component template. */
            this._usedInTemplate = false;
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
            if (!this._usedInTemplate && hammer_template_check_1.isHammerJsUsedInTemplate(template.content)) {
                this._usedInTemplate = true;
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
            /*
              Possible scenarios and how the migration should change the project:
                1. We detect that a custom HammerJS gesture config is set up:
                    - Remove references to the Material gesture config if no event from the
                      Angular Material gesture config is used.
                    - Print a warning about ambiguous configuration that cannot be handled completely
                      if there are references to the Material gesture config.
                2. We detect that HammerJS is only used programmatically:
                    - Remove references to GestureConfig of Material.
                    - Remove references to the "HammerModule" if present.
                3. We detect that HammerJS is used in a template:
                    - Copy the Material gesture config into the app.
                    - Rewrite all gesture config references to the newly copied one.
                    - Set up the new gesture config in the root app module.
                4. We detect no HammerJS usage at all:
                    - Remove Hammer imports
                    - Remove Material gesture config references
                    - Remove HammerModule setup if present.
                    - Remove Hammer script imports in "index.html" files.
            */
            if (hasCustomGestureConfigSetup) {
                // If a custom gesture config is provided, we always assume that HammerJS is used.
                HammerGesturesRule.globalUsesHammer = true;
                if (!this._usedInTemplate && this._gestureConfigReferences.length) {
                    // If the Angular Material gesture events are not used and we found a custom
                    // gesture config, we can safely remove references to the Material gesture config
                    // since events provided by the Material gesture config are guaranteed to be unused.
                    this._removeMaterialGestureConfigSetup();
                    this.printInfo('The HammerJS v9 migration for Angular Components detected that HammerJS is ' +
                        'manually set up in combination with references to the Angular Material gesture ' +
                        'config. This target cannot be migrated completely, but all references to the ' +
                        'deprecated Angular Material gesture have been removed.');
                }
                else if (this._usedInTemplate && this._gestureConfigReferences.length) {
                    // Since there is a reference to the Angular Material gesture config, and we detected
                    // usage of a gesture event that could be provided by Angular Material, we *cannot*
                    // automatically remove references. This is because we do *not* know whether the
                    // event is actually provided by the custom config or by the Material config.
                    this.printInfo('The HammerJS v9 migration for Angular Components detected that HammerJS is ' +
                        'manually set up in combination with references to the Angular Material gesture ' +
                        'config. This target cannot be migrated completely. Please manually remove references ' +
                        'to the deprecated Angular Material gesture config.');
                }
            }
            else if (this._usedInRuntime || this._usedInTemplate) {
                // We keep track of whether Hammer is used globally. This is necessary because we
                // want to only remove Hammer from the "package.json" if it is not used in any project
                // target. Just because it isn't used in one target doesn't mean that we can safely
                // remove the dependency.
                HammerGesturesRule.globalUsesHammer = true;
                // If hammer is only used at runtime, we don't need the gesture config or "HammerModule"
                // and can remove it (along with the hammer config token import if no longer needed).
                if (!this._usedInTemplate) {
                    this._removeMaterialGestureConfigSetup();
                    this._removeHammerModuleReferences();
                }
                else {
                    this._setupHammerGestureConfig();
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
            if (!hasCustomGestureConfigSetup && !this._usedInRuntime && this._usedInTemplate) {
                this.printInfo('The HammerJS v9 migration for Angular Components migrated the ' +
                    'project to keep HammerJS installed, but detected ambiguous usage of HammerJS. Please ' +
                    'manually check if you can remove HammerJS from your application.');
            }
        }
        /**
         * Sets up the hammer gesture config in the current project. To achieve this, the
         * following steps are performed:
         *   1) Create copy of Angular Material gesture config.
         *   2) Rewrite all references to the Angular Material gesture config to the
         *      newly copied gesture config.
         *   3) Setup the HAMMER_GESTURE_CONFIG provider in the root app module
         *      (if not done already).
         */
        _setupHammerGestureConfig() {
            const project = this._getProjectOrThrow();
            const sourceRoot = core_1.normalize(project.sourceRoot || project.root);
            const gestureConfigPath = core_1.join(sourceRoot, this._getAvailableGestureConfigFileName(sourceRoot));
            // Copy gesture config template into the CLI project.
            this.tree.create(gestureConfigPath, fs_1.readFileSync(require.resolve(GESTURE_CONFIG_TEMPLATE_PATH), 'utf8'));
            // Replace all references to the gesture config of Material.
            this._gestureConfigReferences.forEach(i => this._replaceGestureConfigReference(i, gestureConfigPath));
            // Setup the gesture config provider and the "HammerModule" in the project app
            // module if not done already.
            this._setupHammerGesturesInAppModule(project, gestureConfigPath);
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
                const importData = identifier_imports_1.getImportOfIdentifier(node, this.typeChecker);
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
                const importData = identifier_imports_1.getImportOfIdentifier(node, this.typeChecker);
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
                const importData = identifier_imports_1.getImportOfIdentifier(node, this.typeChecker);
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
        /**
         * Replaces a given gesture config reference by ensuring that it is imported
         * from the new specified path.
         */
        _replaceGestureConfigReference({ node, importData, isImport }, newPath) {
            const sourceFile = node.getSourceFile();
            const recorder = this.getUpdateRecorder(sourceFile.fileName);
            const newModuleSpecifier = getModuleSpecifier(newPath, sourceFile.fileName);
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
                const newExpression = this._importManager.addImportToSourceFile(sourceFile, GESTURE_CONFIG_CLASS_NAME, newModuleSpecifier, false, gestureIdentifiersInFile);
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
                const newExpression = this._importManager.addImportToSourceFile(sourceFile, GESTURE_CONFIG_CLASS_NAME, newModuleSpecifier, false, gestureIdentifiersInFile);
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
        /** Sets up the Hammer gesture config provider in the app module if needed. */
        _setupHammerGesturesInAppModule(project, gestureConfigPath) {
            const mainFilePath = path_1.join(this.basePath, schematics_2.getProjectMainFile(project));
            const mainFile = this.program.getSourceFile(mainFilePath);
            if (!mainFile) {
                this.failures.push({
                    filePath: mainFilePath,
                    message: CANNOT_SETUP_APP_MODULE_ERROR,
                });
                return;
            }
            const appModuleExpr = find_main_module_1.findMainModuleExpression(mainFile);
            if (!appModuleExpr) {
                this.failures.push({
                    filePath: mainFilePath,
                    message: CANNOT_SETUP_APP_MODULE_ERROR,
                });
                return;
            }
            const appModuleSymbol = this._getDeclarationSymbolOfNode(unwrapExpression(appModuleExpr));
            if (!appModuleSymbol || !appModuleSymbol.valueDeclaration) {
                this.failures.push({
                    filePath: mainFilePath,
                    message: CANNOT_SETUP_APP_MODULE_ERROR,
                });
                return;
            }
            const sourceFile = appModuleSymbol.valueDeclaration.getSourceFile();
            const relativePath = path_1.relative(this.basePath, sourceFile.fileName);
            const hammerModuleExpr = this._importManager.addImportToSourceFile(sourceFile, HAMMER_MODULE_NAME, HAMMER_MODULE_IMPORT);
            const hammerConfigTokenExpr = this._importManager.addImportToSourceFile(sourceFile, HAMMER_CONFIG_TOKEN_NAME, HAMMER_CONFIG_TOKEN_MODULE);
            const gestureConfigExpr = this._importManager.addImportToSourceFile(sourceFile, GESTURE_CONFIG_CLASS_NAME, getModuleSpecifier(gestureConfigPath, sourceFile.fileName), false, this._getGestureConfigIdentifiersOfFile(sourceFile));
            const recorder = this.getUpdateRecorder(sourceFile.fileName);
            const newProviderNode = ts.createObjectLiteral([
                ts.createPropertyAssignment('provide', hammerConfigTokenExpr),
                ts.createPropertyAssignment('useClass', gestureConfigExpr)
            ]);
            // If no "NgModule" definition is found inside the source file, we just do nothing.
            const metadata = ast_utils_1.getDecoratorMetadata(sourceFile, 'NgModule', '@angular/core');
            if (!metadata.length) {
                return;
            }
            const providersField = ast_utils_1.getMetadataField(metadata[0], 'providers')[0];
            const importsField = ast_utils_1.getMetadataField(metadata[0], 'imports')[0];
            const providerIdentifiers = providersField ? findMatchingChildNodes(providersField, ts.isIdentifier) : null;
            const importIdentifiers = importsField ? findMatchingChildNodes(importsField, ts.isIdentifier) : null;
            const changeActions = [];
            // If the providers field exists and already contains references to the hammer gesture
            // config token and the gesture config, we naively assume that the gesture config is
            // already set up. We only want to add the gesture config provider if it is not set up.
            if (!providerIdentifiers ||
                !(this._hammerConfigTokenReferences.some(r => providerIdentifiers.includes(r.node)) &&
                    this._gestureConfigReferences.some(r => providerIdentifiers.includes(r.node)))) {
                changeActions.push(...ast_utils_1.addSymbolToNgModuleMetadata(sourceFile, relativePath, 'providers', this._printNode(newProviderNode, sourceFile), null));
            }
            // If the "HammerModule" is not already imported in the app module, we set it up
            // by adding it to the "imports" field.
            if (!importIdentifiers ||
                !this._hammerModuleReferences.some(r => importIdentifiers.includes(r.node))) {
                changeActions.push(...ast_utils_1.addSymbolToNgModuleMetadata(sourceFile, relativePath, 'imports', this._printNode(hammerModuleExpr, sourceFile), null));
            }
            changeActions.forEach(change => {
                if (change instanceof change_1.InsertChange) {
                    recorder.insertRight(change.pos, change.toAdd);
                }
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLWdlc3R1cmVzLXJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvdXBncmFkZS1ydWxlcy9oYW1tZXItZ2VzdHVyZXMtdjkvaGFtbWVyLWdlc3R1cmVzLXJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCwrQ0FJOEI7SUFDOUIsMkRBQXVGO0lBQ3ZGLHdEQVFpQztJQUNqQyxxRUFJK0M7SUFDL0MsK0RBQXdFO0lBQ3hFLCtEQUFnRTtJQUVoRSxpQ0FBMEI7SUFDMUIsMkJBQWdDO0lBQ2hDLCtCQUE2QztJQUM3QyxpQ0FBaUM7SUFFakMseUhBQXNEO0lBQ3RELDZJQUF5RTtJQUN6RSwrSEFBNEQ7SUFDNUQseUlBQWlFO0lBQ2pFLG1JQUFtRTtJQUNuRSwySEFBK0M7SUFDL0MsdUlBQXdFO0lBQ3hFLCtJQUFpRTtJQUVqRSxNQUFNLHlCQUF5QixHQUFHLGVBQWUsQ0FBQztJQUNsRCxNQUFNLHdCQUF3QixHQUFHLGdCQUFnQixDQUFDO0lBQ2xELE1BQU0sNEJBQTRCLEdBQUcsMkJBQTJCLENBQUM7SUFFakUsTUFBTSx3QkFBd0IsR0FBRyx1QkFBdUIsQ0FBQztJQUN6RCxNQUFNLDBCQUEwQixHQUFHLDJCQUEyQixDQUFDO0lBRS9ELE1BQU0sa0JBQWtCLEdBQUcsY0FBYyxDQUFDO0lBQzFDLE1BQU0sb0JBQW9CLEdBQUcsMkJBQTJCLENBQUM7SUFFekQsTUFBTSx1QkFBdUIsR0FBRyxVQUFVLENBQUM7SUFFM0MsTUFBTSw2QkFBNkIsR0FDL0IscUVBQXFFLENBQUM7SUFFMUUsTUFBTSw2QkFBNkIsR0FBRyxvREFBb0Q7UUFDdEYsMkRBQTJELENBQUM7SUFRaEUsTUFBYSxrQkFBbUIsU0FBUSwwQkFBbUI7UUFBM0Q7O1lBQ0UseUZBQXlGO1lBQ3pGLHlFQUF5RTtZQUN6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YUFDbkI7WUFDRCxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUM7UUFDRixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNuQyxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIGpvaW4gYXMgZGV2a2l0Sm9pbixcbiAgbm9ybWFsaXplIGFzIGRldmtpdE5vcm1hbGl6ZSxcbiAgUGF0aCBhcyBEZXZraXRQYXRoXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7U2NoZW1hdGljQ29udGV4dCwgU2NoZW1hdGljc0V4Y2VwdGlvbiwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgZ2V0UHJvamVjdEluZGV4RmlsZXMsXG4gIGdldFByb2plY3RNYWluRmlsZSxcbiAgTWlncmF0aW9uRmFpbHVyZSxcbiAgTWlncmF0aW9uUnVsZSxcbiAgUG9zdE1pZ3JhdGlvbkFjdGlvbixcbiAgUmVzb2x2ZWRSZXNvdXJjZSxcbiAgVGFyZ2V0VmVyc2lvblxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBhZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEsXG4gIGdldERlY29yYXRvck1ldGFkYXRhLFxuICBnZXRNZXRhZGF0YUZpZWxkXG59IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9hc3QtdXRpbHMnO1xuaW1wb3J0IHtDaGFuZ2UsIEluc2VydENoYW5nZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NoYW5nZSc7XG5pbXBvcnQge2dldFdvcmtzcGFjZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NvbmZpZyc7XG5pbXBvcnQge1dvcmtzcGFjZVByb2plY3R9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UtbW9kZWxzJztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQge3JlYWRGaWxlU3luY30gZnJvbSAnZnMnO1xuaW1wb3J0IHtkaXJuYW1lLCBqb2luLCByZWxhdGl2ZX0gZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtnZXRQcm9qZWN0RnJvbVByb2dyYW19IGZyb20gJy4vY2xpLXdvcmtzcGFjZSc7XG5pbXBvcnQge2ZpbmRIYW1tZXJTY3JpcHRJbXBvcnRFbGVtZW50c30gZnJvbSAnLi9maW5kLWhhbW1lci1zY3JpcHQtdGFncyc7XG5pbXBvcnQge2ZpbmRNYWluTW9kdWxlRXhwcmVzc2lvbn0gZnJvbSAnLi9maW5kLW1haW4tbW9kdWxlJztcbmltcG9ydCB7aXNIYW1tZXJKc1VzZWRJblRlbXBsYXRlfSBmcm9tICcuL2hhbW1lci10ZW1wbGF0ZS1jaGVjayc7XG5pbXBvcnQge2dldEltcG9ydE9mSWRlbnRpZmllciwgSW1wb3J0fSBmcm9tICcuL2lkZW50aWZpZXItaW1wb3J0cyc7XG5pbXBvcnQge0ltcG9ydE1hbmFnZXJ9IGZyb20gJy4vaW1wb3J0LW1hbmFnZXInO1xuaW1wb3J0IHtyZW1vdmVFbGVtZW50RnJvbUFycmF5RXhwcmVzc2lvbn0gZnJvbSAnLi9yZW1vdmUtYXJyYXktZWxlbWVudCc7XG5pbXBvcnQge3JlbW92ZUVsZW1lbnRGcm9tSHRtbH0gZnJvbSAnLi9yZW1vdmUtZWxlbWVudC1mcm9tLWh0bWwnO1xuXG5jb25zdCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FID0gJ0dlc3R1cmVDb25maWcnO1xuY29uc3QgR0VTVFVSRV9DT05GSUdfRklMRV9OQU1FID0gJ2dlc3R1cmUtY29uZmlnJztcbmNvbnN0IEdFU1RVUkVfQ09ORklHX1RFTVBMQVRFX1BBVEggPSAnLi9nZXN0dXJlLWNvbmZpZy50ZW1wbGF0ZSc7XG5cbmNvbnN0IEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSA9ICdIQU1NRVJfR0VTVFVSRV9DT05GSUcnO1xuY29uc3QgSEFNTUVSX0NPTkZJR19UT0tFTl9NT0RVTEUgPSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmNvbnN0IEhBTU1FUl9NT0RVTEVfTkFNRSA9ICdIYW1tZXJNb2R1bGUnO1xuY29uc3QgSEFNTUVSX01PRFVMRV9JTVBPUlQgPSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmNvbnN0IEhBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSID0gJ2hhbW1lcmpzJztcblxuY29uc3QgQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1IgPVxuICAgIGBDYW5ub3QgcmVtb3ZlIHJlZmVyZW5jZSB0byBcIkdlc3R1cmVDb25maWdcIi4gUGxlYXNlIHJlbW92ZSBtYW51YWxseS5gO1xuXG5jb25zdCBDQU5OT1RfU0VUVVBfQVBQX01PRFVMRV9FUlJPUiA9IGBDb3VsZCBub3Qgc2V0dXAgSGFtbWVyIGdlc3R1cmVzIGluIG1vZHVsZS4gUGxlYXNlIGAgK1xuICAgIGBtYW51YWxseSBlbnN1cmUgdGhhdCB0aGUgSGFtbWVyIGdlc3R1cmUgY29uZmlnIGlzIHNldCB1cC5gO1xuXG5pbnRlcmZhY2UgSWRlbnRpZmllclJlZmVyZW5jZSB7XG4gIG5vZGU6IHRzLklkZW50aWZpZXI7XG4gIGltcG9ydERhdGE6IEltcG9ydDtcbiAgaXNJbXBvcnQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBIYW1tZXJHZXN0dXJlc1J1bGUgZXh0ZW5kcyBNaWdyYXRpb25SdWxlPG51bGw+IHtcbiAgLy8gT25seSBlbmFibGUgdGhpcyBydWxlIGlmIHRoZSBtaWdyYXRpb24gdGFyZ2V0cyB2OSBvciB2MTAgYW5kIGlzIHJ1bm5pbmcgZm9yIGEgbm9uLXRlc3RcbiAgLy8gdGFyZ2V0LiBXZSBjYW5ub3QgbWlncmF0ZSB0ZXN0IHRhcmdldHMgc2luY2UgdGhleSBoYXZlIGEgbGltaXRlZCBzY29wZVxuICAvLyAoaW4gcmVnYXJkcyB0byBzb3VyY2UgZmlsZXMpIGFuZCB0aGVyZWZvcmUgdGhlIEhhbW1lckpTIHVzYWdlIGRldGVjdGlvbiBjYW4gYmUgaW5jb3JyZWN0LlxuICBydWxlRW5hYmxlZCA9XG4gICAgICAodGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlY5IHx8IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WMTApICYmXG4gICAgICAhdGhpcy5pc1Rlc3RUYXJnZXQ7XG5cbiAgcHJpdmF0ZSBfcHJpbnRlciA9IHRzLmNyZWF0ZVByaW50ZXIoKTtcbiAgcHJpdmF0ZSBfaW1wb3J0TWFuYWdlciA9IG5ldyBJbXBvcnRNYW5hZ2VyKHRoaXMuZ2V0VXBkYXRlUmVjb3JkZXIsIHRoaXMuX3ByaW50ZXIpO1xuICBwcml2YXRlIF9ub2RlRmFpbHVyZXM6IHtub2RlOiB0cy5Ob2RlLCBtZXNzYWdlOiBzdHJpbmd9W10gPSBbXTtcblxuICAvKiogV2hldGhlciBIYW1tZXJKUyBpcyBleHBsaWNpdGx5IHVzZWQgaW4gYW55IGNvbXBvbmVudCB0ZW1wbGF0ZS4gKi9cbiAgcHJpdmF0ZSBfdXNlZEluVGVtcGxhdGUgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciBIYW1tZXJKUyBpcyBhY2Nlc3NlZCBhdCBydW50aW1lLiAqL1xuICBwcml2YXRlIF91c2VkSW5SdW50aW1lID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaW1wb3J0cyB0aGF0IG1ha2UgXCJoYW1tZXJqc1wiIGF2YWlsYWJsZSBnbG9iYWxseS4gV2Uga2VlcCB0cmFjayBvZiB0aGVzZVxuICAgKiBzaW5jZSB3ZSBtaWdodCBuZWVkIHRvIHJlbW92ZSB0aGVtIGlmIEhhbW1lciBpcyBub3QgdXNlZC5cbiAgICovXG4gIHByaXZhdGUgX2luc3RhbGxJbXBvcnRzOiB0cy5JbXBvcnREZWNsYXJhdGlvbltdID0gW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggcmVzb2x2ZSB0byB0aGUgZ2VzdHVyZSBjb25maWcgZnJvbSBBbmd1bGFyIE1hdGVyaWFsLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXM6IElkZW50aWZpZXJSZWZlcmVuY2VbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHJlc29sdmUgdG8gdGhlIFwiSEFNTUVSX0dFU1RVUkVfQ09ORklHXCIgdG9rZW4gZnJvbVxuICAgKiBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi5cbiAgICovXG4gIHByaXZhdGUgX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlczogSWRlbnRpZmllclJlZmVyZW5jZVtdID0gW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggcmVzb2x2ZSB0byB0aGUgXCJIYW1tZXJNb2R1bGVcIiBmcm9tXG4gICAqIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGFtbWVyTW9kdWxlUmVmZXJlbmNlczogSWRlbnRpZmllclJlZmVyZW5jZVtdID0gW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaWRlbnRpZmllcnMgdGhhdCBoYXZlIGJlZW4gZGVsZXRlZCBmcm9tIHNvdXJjZSBmaWxlcy4gVGhpcyBjYW4gYmVcbiAgICogdXNlZCB0byBkZXRlcm1pbmUgaWYgY2VydGFpbiBpbXBvcnRzIGFyZSBzdGlsbCB1c2VkIG9yIG5vdC5cbiAgICovXG4gIHByaXZhdGUgX2RlbGV0ZWRJZGVudGlmaWVyczogdHMuSWRlbnRpZmllcltdID0gW107XG5cbiAgdmlzaXRUZW1wbGF0ZSh0ZW1wbGF0ZTogUmVzb2x2ZWRSZXNvdXJjZSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fdXNlZEluVGVtcGxhdGUgJiYgaXNIYW1tZXJKc1VzZWRJblRlbXBsYXRlKHRlbXBsYXRlLmNvbnRlbnQpKSB7XG4gICAgICB0aGlzLl91c2VkSW5UZW1wbGF0ZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGVja0hhbW1lckltcG9ydHMobm9kZSk7XG4gICAgdGhpcy5fY2hlY2tGb3JSdW50aW1lSGFtbWVyVXNhZ2Uobm9kZSk7XG4gICAgdGhpcy5fY2hlY2tGb3JNYXRlcmlhbEdlc3R1cmVDb25maWcobm9kZSk7XG4gICAgdGhpcy5fY2hlY2tGb3JIYW1tZXJHZXN0dXJlQ29uZmlnVG9rZW4obm9kZSk7XG4gICAgdGhpcy5fY2hlY2tGb3JIYW1tZXJNb2R1bGVSZWZlcmVuY2Uobm9kZSk7XG4gIH1cblxuICBwb3N0QW5hbHlzaXMoKTogdm9pZCB7XG4gICAgLy8gV2FsayB0aHJvdWdoIGFsbCBoYW1tZXIgY29uZmlnIHRva2VuIHJlZmVyZW5jZXMgYW5kIGNoZWNrIGlmIHRoZXJlXG4gICAgLy8gaXMgYSBwb3RlbnRpYWwgY3VzdG9tIGdlc3R1cmUgY29uZmlnIHNldHVwLlxuICAgIGNvbnN0IGhhc0N1c3RvbUdlc3R1cmVDb25maWdTZXR1cCA9XG4gICAgICAgIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gdGhpcy5fY2hlY2tGb3JDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAocikpO1xuXG4gICAgLypcbiAgICAgIFBvc3NpYmxlIHNjZW5hcmlvcyBhbmQgaG93IHRoZSBtaWdyYXRpb24gc2hvdWxkIGNoYW5nZSB0aGUgcHJvamVjdDpcbiAgICAgICAgMS4gV2UgZGV0ZWN0IHRoYXQgYSBjdXN0b20gSGFtbWVySlMgZ2VzdHVyZSBjb25maWcgaXMgc2V0IHVwOlxuICAgICAgICAgICAgLSBSZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgaWYgbm8gZXZlbnQgZnJvbSB0aGVcbiAgICAgICAgICAgICAgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyBpcyB1c2VkLlxuICAgICAgICAgICAgLSBQcmludCBhIHdhcm5pbmcgYWJvdXQgYW1iaWd1b3VzIGNvbmZpZ3VyYXRpb24gdGhhdCBjYW5ub3QgYmUgaGFuZGxlZCBjb21wbGV0ZWx5XG4gICAgICAgICAgICAgIGlmIHRoZXJlIGFyZSByZWZlcmVuY2VzIHRvIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICAgICAgMi4gV2UgZGV0ZWN0IHRoYXQgSGFtbWVySlMgaXMgb25seSB1c2VkIHByb2dyYW1tYXRpY2FsbHk6XG4gICAgICAgICAgICAtIFJlbW92ZSByZWZlcmVuY2VzIHRvIEdlc3R1cmVDb25maWcgb2YgTWF0ZXJpYWwuXG4gICAgICAgICAgICAtIFJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBcIkhhbW1lck1vZHVsZVwiIGlmIHByZXNlbnQuXG4gICAgICAgIDMuIFdlIGRldGVjdCB0aGF0IEhhbW1lckpTIGlzIHVzZWQgaW4gYSB0ZW1wbGF0ZTpcbiAgICAgICAgICAgIC0gQ29weSB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgaW50byB0aGUgYXBwLlxuICAgICAgICAgICAgLSBSZXdyaXRlIGFsbCBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2VzIHRvIHRoZSBuZXdseSBjb3BpZWQgb25lLlxuICAgICAgICAgICAgLSBTZXQgdXAgdGhlIG5ldyBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgcm9vdCBhcHAgbW9kdWxlLlxuICAgICAgICA0LiBXZSBkZXRlY3Qgbm8gSGFtbWVySlMgdXNhZ2UgYXQgYWxsOlxuICAgICAgICAgICAgLSBSZW1vdmUgSGFtbWVyIGltcG9ydHNcbiAgICAgICAgICAgIC0gUmVtb3ZlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZXNcbiAgICAgICAgICAgIC0gUmVtb3ZlIEhhbW1lck1vZHVsZSBzZXR1cCBpZiBwcmVzZW50LlxuICAgICAgICAgICAgLSBSZW1vdmUgSGFtbWVyIHNjcmlwdCBpbXBvcnRzIGluIFwiaW5kZXguaHRtbFwiIGZpbGVzLlxuICAgICovXG5cbiAgICBpZiAoaGFzQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKSB7XG4gICAgICAvLyBJZiBhIGN1c3RvbSBnZXN0dXJlIGNvbmZpZyBpcyBwcm92aWRlZCwgd2UgYWx3YXlzIGFzc3VtZSB0aGF0IEhhbW1lckpTIGlzIHVzZWQuXG4gICAgICBIYW1tZXJHZXN0dXJlc1J1bGUuZ2xvYmFsVXNlc0hhbW1lciA9IHRydWU7XG4gICAgICBpZiAoIXRoaXMuX3VzZWRJblRlbXBsYXRlICYmIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLmxlbmd0aCkge1xuICAgICAgICAvLyBJZiB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGV2ZW50cyBhcmUgbm90IHVzZWQgYW5kIHdlIGZvdW5kIGEgY3VzdG9tXG4gICAgICAgIC8vIGdlc3R1cmUgY29uZmlnLCB3ZSBjYW4gc2FmZWx5IHJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZ1xuICAgICAgICAvLyBzaW5jZSBldmVudHMgcHJvdmlkZWQgYnkgdGhlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIGFyZSBndWFyYW50ZWVkIHRvIGJlIHVudXNlZC5cbiAgICAgICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgICAgICAgdGhpcy5wcmludEluZm8oXG4gICAgICAgICAgJ1RoZSBIYW1tZXJKUyB2OSBtaWdyYXRpb24gZm9yIEFuZ3VsYXIgQ29tcG9uZW50cyBkZXRlY3RlZCB0aGF0IEhhbW1lckpTIGlzICcgK1xuICAgICAgICAgICdtYW51YWxseSBzZXQgdXAgaW4gY29tYmluYXRpb24gd2l0aCByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgJyArXG4gICAgICAgICAgJ2NvbmZpZy4gVGhpcyB0YXJnZXQgY2Fubm90IGJlIG1pZ3JhdGVkIGNvbXBsZXRlbHksIGJ1dCBhbGwgcmVmZXJlbmNlcyB0byB0aGUgJyArXG4gICAgICAgICAgJ2RlcHJlY2F0ZWQgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGhhdmUgYmVlbiByZW1vdmVkLicpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl91c2VkSW5UZW1wbGF0ZSAmJiB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gU2luY2UgdGhlcmUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcsIGFuZCB3ZSBkZXRlY3RlZFxuICAgICAgICAvLyB1c2FnZSBvZiBhIGdlc3R1cmUgZXZlbnQgdGhhdCBjb3VsZCBiZSBwcm92aWRlZCBieSBBbmd1bGFyIE1hdGVyaWFsLCB3ZSAqY2Fubm90KlxuICAgICAgICAvLyBhdXRvbWF0aWNhbGx5IHJlbW92ZSByZWZlcmVuY2VzLiBUaGlzIGlzIGJlY2F1c2Ugd2UgZG8gKm5vdCoga25vdyB3aGV0aGVyIHRoZVxuICAgICAgICAvLyBldmVudCBpcyBhY3R1YWxseSBwcm92aWRlZCBieSB0aGUgY3VzdG9tIGNvbmZpZyBvciBieSB0aGUgTWF0ZXJpYWwgY29uZmlnLlxuICAgICAgICB0aGlzLnByaW50SW5mbyhcbiAgICAgICAgICAnVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBDb21wb25lbnRzIGRldGVjdGVkIHRoYXQgSGFtbWVySlMgaXMgJyArXG4gICAgICAgICAgJ21hbnVhbGx5IHNldCB1cCBpbiBjb21iaW5hdGlvbiB3aXRoIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSAnICtcbiAgICAgICAgICAnY29uZmlnLiBUaGlzIHRhcmdldCBjYW5ub3QgYmUgbWlncmF0ZWQgY29tcGxldGVseS4gUGxlYXNlIG1hbnVhbGx5IHJlbW92ZSByZWZlcmVuY2VzICcgK1xuICAgICAgICAgICd0byB0aGUgZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLicpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5fdXNlZEluUnVudGltZSB8fCB0aGlzLl91c2VkSW5UZW1wbGF0ZSkge1xuICAgICAgLy8gV2Uga2VlcCB0cmFjayBvZiB3aGV0aGVyIEhhbW1lciBpcyB1c2VkIGdsb2JhbGx5LiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHdlXG4gICAgICAvLyB3YW50IHRvIG9ubHkgcmVtb3ZlIEhhbW1lciBmcm9tIHRoZSBcInBhY2thZ2UuanNvblwiIGlmIGl0IGlzIG5vdCB1c2VkIGluIGFueSBwcm9qZWN0XG4gICAgICAvLyB0YXJnZXQuIEp1c3QgYmVjYXVzZSBpdCBpc24ndCB1c2VkIGluIG9uZSB0YXJnZXQgZG9lc24ndCBtZWFuIHRoYXQgd2UgY2FuIHNhZmVseVxuICAgICAgLy8gcmVtb3ZlIHRoZSBkZXBlbmRlbmN5LlxuICAgICAgSGFtbWVyR2VzdHVyZXNSdWxlLmdsb2JhbFVzZXNIYW1tZXIgPSB0cnVlO1xuXG4gICAgICAvLyBJZiBoYW1tZXIgaXMgb25seSB1c2VkIGF0IHJ1bnRpbWUsIHdlIGRvbid0IG5lZWQgdGhlIGdlc3R1cmUgY29uZmlnIG9yIFwiSGFtbWVyTW9kdWxlXCJcbiAgICAgIC8vIGFuZCBjYW4gcmVtb3ZlIGl0IChhbG9uZyB3aXRoIHRoZSBoYW1tZXIgY29uZmlnIHRva2VuIGltcG9ydCBpZiBubyBsb25nZXIgbmVlZGVkKS5cbiAgICAgIGlmICghdGhpcy5fdXNlZEluVGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlSGFtbWVyTW9kdWxlUmVmZXJlbmNlcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2V0dXBIYW1tZXJHZXN0dXJlQ29uZmlnKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3JlbW92ZUhhbW1lclNldHVwKCk7XG4gICAgfVxuXG4gICAgLy8gUmVjb3JkIHRoZSBjaGFuZ2VzIGNvbGxlY3RlZCBpbiB0aGUgaW1wb3J0IG1hbmFnZXIuIENoYW5nZXMgbmVlZCB0byBiZSBhcHBsaWVkXG4gICAgLy8gb25jZSB0aGUgaW1wb3J0IG1hbmFnZXIgcmVnaXN0ZXJlZCBhbGwgaW1wb3J0IG1vZGlmaWNhdGlvbnMuIFRoaXMgYXZvaWRzIGNvbGxpc2lvbnMuXG4gICAgdGhpcy5faW1wb3J0TWFuYWdlci5yZWNvcmRDaGFuZ2VzKCk7XG5cbiAgICAvLyBDcmVhdGUgbWlncmF0aW9uIGZhaWx1cmVzIHRoYXQgd2lsbCBiZSBwcmludGVkIGJ5IHRoZSB1cGRhdGUtdG9vbCBvbiBtaWdyYXRpb25cbiAgICAvLyBjb21wbGV0aW9uLiBXZSBuZWVkIHNwZWNpYWwgbG9naWMgZm9yIHVwZGF0aW5nIGZhaWx1cmUgcG9zaXRpb25zIHRvIHJlZmxlY3RcbiAgICAvLyB0aGUgbmV3IHNvdXJjZSBmaWxlIGFmdGVyIG1vZGlmaWNhdGlvbnMgZnJvbSB0aGUgaW1wb3J0IG1hbmFnZXIuXG4gICAgdGhpcy5mYWlsdXJlcy5wdXNoKC4uLnRoaXMuX2NyZWF0ZU1pZ3JhdGlvbkZhaWx1cmVzKCkpO1xuXG4gICAgLy8gVGhlIHRlbXBsYXRlIGNoZWNrIGZvciBIYW1tZXJKUyBldmVudHMgaXMgbm90IGNvbXBsZXRlbHkgcmVsaWFibGUgYXMgdGhlIGV2ZW50XG4gICAgLy8gb3V0cHV0IGNvdWxkIGFsc28gYmUgZnJvbSBhIGNvbXBvbmVudCBoYXZpbmcgYW4gb3V0cHV0IG5hbWVkIHNpbWlsYXJseSB0byBhIGtub3duXG4gICAgLy8gaGFtbWVyanMgZXZlbnQgKGUuZy4gXCJAT3V0cHV0KCkgc2xpZGVcIikuIFRoZSB1c2FnZSBpcyB0aGVyZWZvcmUgc29tZXdoYXQgYW1iaWd1b3VzXG4gICAgLy8gYW5kIHdlIHdhbnQgdG8gcHJpbnQgYSBtZXNzYWdlIHRoYXQgZGV2ZWxvcGVycyBtaWdodCBiZSBhYmxlIHRvIHJlbW92ZSBIYW1tZXIgbWFudWFsbHkuXG4gICAgaWYgKCFoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAgJiYgIXRoaXMuX3VzZWRJblJ1bnRpbWUgJiYgdGhpcy5fdXNlZEluVGVtcGxhdGUpIHtcbiAgICAgIHRoaXMucHJpbnRJbmZvKFxuICAgICAgICAgICdUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIENvbXBvbmVudHMgbWlncmF0ZWQgdGhlICcgK1xuICAgICAgICAgICdwcm9qZWN0IHRvIGtlZXAgSGFtbWVySlMgaW5zdGFsbGVkLCBidXQgZGV0ZWN0ZWQgYW1iaWd1b3VzIHVzYWdlIG9mIEhhbW1lckpTLiBQbGVhc2UgJyArXG4gICAgICAgICAgJ21hbnVhbGx5IGNoZWNrIGlmIHlvdSBjYW4gcmVtb3ZlIEhhbW1lckpTIGZyb20geW91ciBhcHBsaWNhdGlvbi4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB1cCB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnIGluIHRoZSBjdXJyZW50IHByb2plY3QuIFRvIGFjaGlldmUgdGhpcywgdGhlXG4gICAqIGZvbGxvd2luZyBzdGVwcyBhcmUgcGVyZm9ybWVkOlxuICAgKiAgIDEpIENyZWF0ZSBjb3B5IG9mIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAqICAgMikgUmV3cml0ZSBhbGwgcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyB0byB0aGVcbiAgICogICAgICBuZXdseSBjb3BpZWQgZ2VzdHVyZSBjb25maWcuXG4gICAqICAgMykgU2V0dXAgdGhlIEhBTU1FUl9HRVNUVVJFX0NPTkZJRyBwcm92aWRlciBpbiB0aGUgcm9vdCBhcHAgbW9kdWxlXG4gICAqICAgICAgKGlmIG5vdCBkb25lIGFscmVhZHkpLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0dXBIYW1tZXJHZXN0dXJlQ29uZmlnKCkge1xuICAgIGNvbnN0IHByb2plY3QgPSB0aGlzLl9nZXRQcm9qZWN0T3JUaHJvdygpO1xuICAgIGNvbnN0IHNvdXJjZVJvb3QgPSBkZXZraXROb3JtYWxpemUocHJvamVjdC5zb3VyY2VSb290IHx8IHByb2plY3Qucm9vdCk7XG4gICAgY29uc3QgZ2VzdHVyZUNvbmZpZ1BhdGggPVxuICAgICAgICBkZXZraXRKb2luKHNvdXJjZVJvb3QsIHRoaXMuX2dldEF2YWlsYWJsZUdlc3R1cmVDb25maWdGaWxlTmFtZShzb3VyY2VSb290KSk7XG5cbiAgICAvLyBDb3B5IGdlc3R1cmUgY29uZmlnIHRlbXBsYXRlIGludG8gdGhlIENMSSBwcm9qZWN0LlxuICAgIHRoaXMudHJlZS5jcmVhdGUoXG4gICAgICAgIGdlc3R1cmVDb25maWdQYXRoLCByZWFkRmlsZVN5bmMocmVxdWlyZS5yZXNvbHZlKEdFU1RVUkVfQ09ORklHX1RFTVBMQVRFX1BBVEgpLCAndXRmOCcpKTtcblxuICAgIC8vIFJlcGxhY2UgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIGdlc3R1cmUgY29uZmlnIG9mIE1hdGVyaWFsLlxuICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLmZvckVhY2goXG4gICAgICAgIGkgPT4gdGhpcy5fcmVwbGFjZUdlc3R1cmVDb25maWdSZWZlcmVuY2UoaSwgZ2VzdHVyZUNvbmZpZ1BhdGgpKTtcblxuICAgIC8vIFNldHVwIHRoZSBnZXN0dXJlIGNvbmZpZyBwcm92aWRlciBhbmQgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaW4gdGhlIHByb2plY3QgYXBwXG4gICAgLy8gbW9kdWxlIGlmIG5vdCBkb25lIGFscmVhZHkuXG4gICAgdGhpcy5fc2V0dXBIYW1tZXJHZXN0dXJlc0luQXBwTW9kdWxlKHByb2plY3QsIGdlc3R1cmVDb25maWdQYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIEhhbW1lciBmcm9tIHRoZSBjdXJyZW50IHByb2plY3QuIFRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHBlcmZvcm1lZDpcbiAgICogICAxKSBEZWxldGUgYWxsIFR5cGVTY3JpcHQgaW1wb3J0cyB0byBcImhhbW1lcmpzXCIuXG4gICAqICAgMikgUmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAqICAgMykgUmVtb3ZlIFwiaGFtbWVyanNcIiBmcm9tIGFsbCBpbmRleCBIVE1MIGZpbGVzIG9mIHRoZSBjdXJyZW50IHByb2plY3QuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJTZXR1cCgpIHtcbiAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5fZ2V0UHJvamVjdE9yVGhyb3coKTtcblxuICAgIHRoaXMuX2luc3RhbGxJbXBvcnRzLmZvckVhY2goaSA9PiB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZUltcG9ydEJ5RGVjbGFyYXRpb24oaSkpO1xuXG4gICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgICB0aGlzLl9yZW1vdmVIYW1tZXJNb2R1bGVSZWZlcmVuY2VzKCk7XG4gICAgdGhpcy5fcmVtb3ZlSGFtbWVyRnJvbUluZGV4RmlsZShwcm9qZWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBnZXN0dXJlIGNvbmZpZyBzZXR1cCBieSBkZWxldGluZyBhbGwgZm91bmQgcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhclxuICAgKiBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy4gQWRkaXRpb25hbGx5LCB1bnVzZWQgaW1wb3J0cyB0byB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnXG4gICAqIHRva2VuIGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIgd2lsbCBiZSByZW1vdmVkIGFzIHdlbGwuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVNYXRlcmlhbEdlc3R1cmVDb25maWdTZXR1cCgpIHtcbiAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5mb3JFYWNoKHIgPT4gdGhpcy5fcmVtb3ZlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZShyKSk7XG5cbiAgICB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuZm9yRWFjaChyID0+IHtcbiAgICAgIGlmIChyLmlzSW1wb3J0KSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZUhhbW1lckNvbmZpZ1Rva2VuSW1wb3J0SWZVbnVzZWQocik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogUmVtb3ZlcyBhbGwgcmVmZXJlbmNlcyB0byB0aGUgXCJIYW1tZXJNb2R1bGVcIiBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLiAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJNb2R1bGVSZWZlcmVuY2VzKCkge1xuICAgIHRoaXMuX2hhbW1lck1vZHVsZVJlZmVyZW5jZXMuZm9yRWFjaCgoe25vZGUsIGlzSW1wb3J0LCBpbXBvcnREYXRhfSkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuXG4gICAgICAvLyBPbmx5IHJlbW92ZSB0aGUgaW1wb3J0IGZvciB0aGUgSGFtbWVyTW9kdWxlIGlmIHRoZSBtb2R1bGUgaGFzIGJlZW4gYWNjZXNzZWRcbiAgICAgIC8vIHRocm91Z2ggYSBub24tbmFtZXNwYWNlZCBpZGVudGlmaWVyIGFjY2Vzcy5cbiAgICAgIGlmICghaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2Vzcyhub2RlKSkge1xuICAgICAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChcbiAgICAgICAgICAgIHNvdXJjZUZpbGUsIEhBTU1FUl9NT0RVTEVfTkFNRSwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lKTtcbiAgICAgIH1cblxuICAgICAgLy8gRm9yIHJlZmVyZW5jZXMgZnJvbSB3aXRoaW4gYW4gaW1wb3J0LCB3ZSBkbyBub3QgbmVlZCB0byBkbyBhbnl0aGluZyBvdGhlciB0aGFuXG4gICAgICAvLyByZW1vdmluZyB0aGUgaW1wb3J0LiBGb3Igb3RoZXIgcmVmZXJlbmNlcywgd2UgcmVtb3ZlIHRoZSBpbXBvcnQgYW5kIHRoZSBhY3R1YWxcbiAgICAgIC8vIGlkZW50aWZpZXIgaW4gdGhlIG1vZHVsZSBpbXBvcnRzLlxuICAgICAgaWYgKGlzSW1wb3J0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaXMgcmVmZXJlbmNlZCB3aXRoaW4gYW4gYXJyYXkgbGl0ZXJhbCwgd2UgY2FuXG4gICAgICAvLyByZW1vdmUgdGhlIGVsZW1lbnQgZWFzaWx5LiBPdGhlcndpc2UgaWYgaXQncyBvdXRzaWRlIG9mIGFuIGFycmF5IGxpdGVyYWwsXG4gICAgICAvLyB3ZSBuZWVkIHRvIHJlcGxhY2UgdGhlIHJlZmVyZW5jZSB3aXRoIGFuIGVtcHR5IG9iamVjdCBsaXRlcmFsIHcvIHRvZG8gdG9cbiAgICAgIC8vIG5vdCBicmVhayB0aGUgYXBwbGljYXRpb24uXG4gICAgICBpZiAodHMuaXNBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUucGFyZW50KSkge1xuICAgICAgICAvLyBSZW1vdmVzIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb20gdGhlIHBhcmVudCBhcnJheSBleHByZXNzaW9uLiBSZW1vdmVzXG4gICAgICAgIC8vIHRoZSB0cmFpbGluZyBjb21tYSB0b2tlbiBpZiBwcmVzZW50LlxuICAgICAgICByZW1vdmVFbGVtZW50RnJvbUFycmF5RXhwcmVzc2lvbihub2RlLCByZWNvcmRlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWNvcmRlci5yZW1vdmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCkpO1xuICAgICAgICByZWNvcmRlci5pbnNlcnRSaWdodChub2RlLmdldFN0YXJ0KCksIGAvKiBUT0RPOiByZW1vdmUgKi8ge31gKTtcbiAgICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe1xuICAgICAgICAgIG5vZGU6IG5vZGUsXG4gICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byBkZWxldGUgcmVmZXJlbmNlIHRvIFwiSGFtbWVyTW9kdWxlXCIuJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWdcbiAgICogdG9rZW4gZnJvbSBwbGF0Zm9ybS1icm93c2VyLiBJZiBzbywga2VlcHMgdHJhY2sgb2YgdGhlIHJlZmVyZW5jZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9ySGFtbWVyR2VzdHVyZUNvbmZpZ1Rva2VuKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICBjb25zdCBpbXBvcnREYXRhID0gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGUsIHRoaXMudHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKGltcG9ydERhdGEgJiYgaW1wb3J0RGF0YS5zeW1ib2xOYW1lID09PSBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUgJiZcbiAgICAgICAgICBpbXBvcnREYXRhLm1vZHVsZU5hbWUgPT09IEhBTU1FUl9DT05GSUdfVE9LRU5fTU9EVUxFKSB7XG4gICAgICAgIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5wdXNoKFxuICAgICAgICAgICAge25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0OiB0cy5pc0ltcG9ydFNwZWNpZmllcihub2RlLnBhcmVudCl9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBIYW1tZXJNb2R1bGUgZnJvbVxuICAgKiBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi4gSWYgc28sIGtlZXBzIHRyYWNrIG9mIHRoZSByZWZlcmVuY2UuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0ZvckhhbW1lck1vZHVsZVJlZmVyZW5jZShub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgICAgY29uc3QgaW1wb3J0RGF0YSA9IGdldEltcG9ydE9mSWRlbnRpZmllcihub2RlLCB0aGlzLnR5cGVDaGVja2VyKTtcbiAgICAgIGlmIChpbXBvcnREYXRhICYmIGltcG9ydERhdGEuc3ltYm9sTmFtZSA9PT0gSEFNTUVSX01PRFVMRV9OQU1FICYmXG4gICAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lID09PSBIQU1NRVJfTU9EVUxFX0lNUE9SVCkge1xuICAgICAgICB0aGlzLl9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzLnB1c2goXG4gICAgICAgICAgICB7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnQ6IHRzLmlzSW1wb3J0U3BlY2lmaWVyKG5vZGUucGFyZW50KX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYW4gaW1wb3J0IHRvIHRoZSBIYW1tZXJKUyBwYWNrYWdlLiBJbXBvcnRzIHRvXG4gICAqIEhhbW1lckpTIHdoaWNoIGxvYWQgc3BlY2lmaWMgc3ltYm9scyBmcm9tIHRoZSBwYWNrYWdlIGFyZSBjb25zaWRlcmVkIGFzXG4gICAqIHJ1bnRpbWUgdXNhZ2Ugb2YgSGFtbWVyLiBlLmcuIGBpbXBvcnQge1N5bWJvbH0gZnJvbSBcImhhbW1lcmpzXCI7YC5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrSGFtbWVySW1wb3J0cyhub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgJiYgdHMuaXNTdHJpbmdMaXRlcmFsKG5vZGUubW9kdWxlU3BlY2lmaWVyKSAmJlxuICAgICAgICBub2RlLm1vZHVsZVNwZWNpZmllci50ZXh0ID09PSBIQU1NRVJfTU9EVUxFX1NQRUNJRklFUikge1xuICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gaW1wb3J0IHRvIEhhbW1lckpTIHRoYXQgaW1wb3J0cyBzeW1ib2xzLCBvciBpcyBuYW1lc3BhY2VkXG4gICAgICAvLyAoZS5nLiBcImltcG9ydCB7QSwgQn0gZnJvbSAuLi5cIiBvciBcImltcG9ydCAqIGFzIGhhbW1lciBmcm9tIC4uLlwiKSwgdGhlbiB3ZVxuICAgICAgLy8gYXNzdW1lIHRoYXQgc29tZSBleHBvcnRzIGFyZSB1c2VkIGF0IHJ1bnRpbWUuXG4gICAgICBpZiAobm9kZS5pbXBvcnRDbGF1c2UgJiZcbiAgICAgICAgICAhKG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MgJiYgdHMuaXNOYW1lZEltcG9ydHMobm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykgJiZcbiAgICAgICAgICAgIG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHMubGVuZ3RoID09PSAwKSkge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2luc3RhbGxJbXBvcnRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBhY2Nlc3NlcyB0aGUgZ2xvYmFsIFwiSGFtbWVyXCIgc3ltYm9sIGF0IHJ1bnRpbWUuIElmIHNvLFxuICAgKiB0aGUgbWlncmF0aW9uIHJ1bGUgc3RhdGUgd2lsbCBiZSB1cGRhdGVkIHRvIHJlZmxlY3QgdGhhdCBIYW1tZXIgaXMgdXNlZCBhdCBydW50aW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JSdW50aW1lSGFtbWVyVXNhZ2Uobm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0aGlzLl91c2VkSW5SdW50aW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRGV0ZWN0cyB1c2FnZXMgb2YgXCJ3aW5kb3cuSGFtbWVyXCIuXG4gICAgaWYgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUpICYmIG5vZGUubmFtZS50ZXh0ID09PSAnSGFtbWVyJykge1xuICAgICAgY29uc3Qgb3JpZ2luRXhwciA9IHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgICAgIGlmICh0cy5pc0lkZW50aWZpZXIob3JpZ2luRXhwcikgJiYgb3JpZ2luRXhwci50ZXh0ID09PSAnd2luZG93Jykge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZXRlY3RzIHVzYWdlcyBvZiBcIndpbmRvd1snSGFtbWVyJ11cIi5cbiAgICBpZiAodHMuaXNFbGVtZW50QWNjZXNzRXhwcmVzc2lvbihub2RlKSAmJiB0cy5pc1N0cmluZ0xpdGVyYWwobm9kZS5hcmd1bWVudEV4cHJlc3Npb24pICYmXG4gICAgICAgIG5vZGUuYXJndW1lbnRFeHByZXNzaW9uLnRleHQgPT09ICdIYW1tZXInKSB7XG4gICAgICBjb25zdCBvcmlnaW5FeHByID0gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihvcmlnaW5FeHByKSAmJiBvcmlnaW5FeHByLnRleHQgPT09ICd3aW5kb3cnKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZXMgdXNhZ2VzIG9mIHBsYWluIGlkZW50aWZpZXIgd2l0aCB0aGUgbmFtZSBcIkhhbW1lclwiLiBUaGVzZSB1c2FnZVxuICAgIC8vIGFyZSB2YWxpZCBpZiB0aGV5IHJlc29sdmUgdG8gXCJAdHlwZXMvaGFtbWVyanNcIi4gZS5nLiBcIm5ldyBIYW1tZXIobXlFbGVtZW50KVwiLlxuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkgJiYgbm9kZS50ZXh0ID09PSAnSGFtbWVyJyAmJlxuICAgICAgICAhdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZS5wYXJlbnQpICYmICF0cy5pc0VsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKG5vZGUucGFyZW50KSkge1xuICAgICAgY29uc3Qgc3ltYm9sID0gdGhpcy5fZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZSk7XG4gICAgICBpZiAoc3ltYm9sICYmIHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uICYmXG4gICAgICAgICAgc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lLmluY2x1ZGVzKCdAdHlwZXMvaGFtbWVyanMnKSkge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIHJlZmVyZW5jZXMgdGhlIGdlc3R1cmUgY29uZmlnIGZyb20gQW5ndWxhciBNYXRlcmlhbC5cbiAgICogSWYgc28sIHdlIGtlZXAgdHJhY2sgb2YgdGhlIGZvdW5kIHN5bWJvbCByZWZlcmVuY2UuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0Zvck1hdGVyaWFsR2VzdHVyZUNvbmZpZyhub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgICAgY29uc3QgaW1wb3J0RGF0YSA9IGdldEltcG9ydE9mSWRlbnRpZmllcihub2RlLCB0aGlzLnR5cGVDaGVja2VyKTtcbiAgICAgIGlmIChpbXBvcnREYXRhICYmIGltcG9ydERhdGEuc3ltYm9sTmFtZSA9PT0gR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSAmJlxuICAgICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZS5zdGFydHNXaXRoKCdAYW5ndWxhci9tYXRlcmlhbC8nKSkge1xuICAgICAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5wdXNoKFxuICAgICAgICAgICAge25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0OiB0cy5pc0ltcG9ydFNwZWNpZmllcihub2RlLnBhcmVudCl9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBIYW1tZXIgZ2VzdHVyZSBjb25maWcgdG9rZW4gcmVmZXJlbmNlIGlzIHBhcnQgb2YgYW5cbiAgICogQW5ndWxhciBwcm92aWRlciBkZWZpbml0aW9uIHRoYXQgc2V0cyB1cCBhIGN1c3RvbSBnZXN0dXJlIGNvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9yQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKHRva2VuUmVmOiBJZGVudGlmaWVyUmVmZXJlbmNlKTogYm9vbGVhbiB7XG4gICAgLy8gV2FsayB1cCB0aGUgdHJlZSB0byBsb29rIGZvciBhIHBhcmVudCBwcm9wZXJ0eSBhc3NpZ25tZW50IG9mIHRoZVxuICAgIC8vIHJlZmVyZW5jZSB0byB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnIHRva2VuLlxuICAgIGxldCBwcm9wZXJ0eUFzc2lnbm1lbnQ6IHRzLk5vZGUgPSB0b2tlblJlZi5ub2RlO1xuICAgIHdoaWxlIChwcm9wZXJ0eUFzc2lnbm1lbnQgJiYgIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5QXNzaWdubWVudCkpIHtcbiAgICAgIHByb3BlcnR5QXNzaWdubWVudCA9IHByb3BlcnR5QXNzaWdubWVudC5wYXJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKCFwcm9wZXJ0eUFzc2lnbm1lbnQgfHwgIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5QXNzaWdubWVudCkgfHxcbiAgICAgICAgZ2V0UHJvcGVydHlOYW1lVGV4dChwcm9wZXJ0eUFzc2lnbm1lbnQubmFtZSkgIT09ICdwcm92aWRlJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG9iamVjdExpdGVyYWxFeHByID0gcHJvcGVydHlBc3NpZ25tZW50LnBhcmVudDtcbiAgICBjb25zdCBtYXRjaGluZ0lkZW50aWZpZXJzID0gZmluZE1hdGNoaW5nQ2hpbGROb2RlcyhvYmplY3RMaXRlcmFsRXhwciwgdHMuaXNJZGVudGlmaWVyKTtcblxuICAgIC8vIFdlIG5haXZlbHkgYXNzdW1lIHRoYXQgaWYgdGhlcmUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIFwiR2VzdHVyZUNvbmZpZ1wiIGV4cG9ydFxuICAgIC8vIGZyb20gQW5ndWxhciBNYXRlcmlhbCBpbiB0aGUgcHJvdmlkZXIgbGl0ZXJhbCwgdGhhdCB0aGUgcHJvdmlkZXIgc2V0cyB1cCB0aGVcbiAgICAvLyBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgIHJldHVybiAhdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuc29tZShyID0+IG1hdGNoaW5nSWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBhbiBhdmFpbGFibGUgZmlsZSBuYW1lIGZvciB0aGUgZ2VzdHVyZSBjb25maWcgd2hpY2ggc2hvdWxkXG4gICAqIGJlIHN0b3JlZCBpbiB0aGUgc3BlY2lmaWVkIGZpbGUgcGF0aC5cbiAgICovXG4gIHByaXZhdGUgX2dldEF2YWlsYWJsZUdlc3R1cmVDb25maWdGaWxlTmFtZShzb3VyY2VSb290OiBEZXZraXRQYXRoKSB7XG4gICAgaWYgKCF0aGlzLnRyZWUuZXhpc3RzKGRldmtpdEpvaW4oc291cmNlUm9vdCwgYCR7R0VTVFVSRV9DT05GSUdfRklMRV9OQU1FfS50c2ApKSkge1xuICAgICAgcmV0dXJuIGAke0dFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRX0udHNgO1xuICAgIH1cblxuICAgIGxldCBwb3NzaWJsZU5hbWUgPSBgJHtHRVNUVVJFX0NPTkZJR19GSUxFX05BTUV9LWA7XG4gICAgbGV0IGluZGV4ID0gMTtcbiAgICB3aGlsZSAodGhpcy50cmVlLmV4aXN0cyhkZXZraXRKb2luKHNvdXJjZVJvb3QsIGAke3Bvc3NpYmxlTmFtZX0tJHtpbmRleH0udHNgKSkpIHtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICAgIHJldHVybiBgJHtwb3NzaWJsZU5hbWUgKyBpbmRleH0udHNgO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIGEgZ2l2ZW4gZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlIGJ5IGVuc3VyaW5nIHRoYXQgaXQgaXMgaW1wb3J0ZWRcbiAgICogZnJvbSB0aGUgbmV3IHNwZWNpZmllZCBwYXRoLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVwbGFjZUdlc3R1cmVDb25maWdSZWZlcmVuY2UoXG4gICAgICB7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnR9OiBJZGVudGlmaWVyUmVmZXJlbmNlLCBuZXdQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IG5ld01vZHVsZVNwZWNpZmllciA9IGdldE1vZHVsZVNwZWNpZmllcihuZXdQYXRoLCBzb3VyY2VGaWxlLmZpbGVOYW1lKTtcblxuICAgIC8vIExpc3Qgb2YgYWxsIGlkZW50aWZpZXJzIHJlZmVycmluZyB0byB0aGUgZ2VzdHVyZSBjb25maWcgaW4gdGhlIGN1cnJlbnQgZmlsZS4gVGhpc1xuICAgIC8vIGFsbG93cyB1cyB0byBhZGQgYW4gaW1wb3J0IGZvciB0aGUgY29waWVkIGdlc3R1cmUgY29uZmlndXJhdGlvbiB3aXRob3V0IGdlbmVyYXRpbmcgYVxuICAgIC8vIG5ldyBpZGVudGlmaWVyIGZvciB0aGUgaW1wb3J0IHRvIGF2b2lkIGNvbGxpc2lvbnMuIGkuZS4gXCJHZXN0dXJlQ29uZmlnXzFcIi4gVGhlIGltcG9ydFxuICAgIC8vIG1hbmFnZXIgY2hlY2tzIGZvciBwb3NzaWJsZSBuYW1lIGNvbGxpc2lvbnMsIGJ1dCBpcyBhYmxlIHRvIGlnbm9yZSBzcGVjaWZpYyBpZGVudGlmaWVycy5cbiAgICAvLyBXZSB1c2UgdGhpcyB0byBpZ25vcmUgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIG9yaWdpbmFsIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcsXG4gICAgLy8gYmVjYXVzZSB0aGVzZSB3aWxsIGJlIHJlcGxhY2VkIGFuZCB0aGVyZWZvcmUgd2lsbCBub3QgaW50ZXJmZXJlLlxuICAgIGNvbnN0IGdlc3R1cmVJZGVudGlmaWVyc0luRmlsZSA9IHRoaXMuX2dldEdlc3R1cmVDb25maWdJZGVudGlmaWVyc09mRmlsZShzb3VyY2VGaWxlKTtcblxuICAgIC8vIElmIHRoZSBwYXJlbnQgb2YgdGhlIGlkZW50aWZpZXIgaXMgYWNjZXNzZWQgdGhyb3VnaCBhIG5hbWVzcGFjZSwgd2UgY2FuIGp1c3RcbiAgICAvLyBpbXBvcnQgdGhlIG5ldyBnZXN0dXJlIGNvbmZpZyB3aXRob3V0IHJld3JpdGluZyB0aGUgaW1wb3J0IGRlY2xhcmF0aW9uIGJlY2F1c2VcbiAgICAvLyB0aGUgY29uZmlnIGhhcyBiZWVuIGltcG9ydGVkIHRocm91Z2ggYSBuYW1lc3BhY2VkIGltcG9ydC5cbiAgICBpZiAoaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2Vzcyhub2RlKSkge1xuICAgICAgY29uc3QgbmV3RXhwcmVzc2lvbiA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICAgIHNvdXJjZUZpbGUsIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsIG5ld01vZHVsZVNwZWNpZmllciwgZmFsc2UsXG4gICAgICAgICAgZ2VzdHVyZUlkZW50aWZpZXJzSW5GaWxlKTtcblxuICAgICAgcmVjb3JkZXIucmVtb3ZlKG5vZGUucGFyZW50LmdldFN0YXJ0KCksIG5vZGUucGFyZW50LmdldFdpZHRoKCkpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQobm9kZS5wYXJlbnQuZ2V0U3RhcnQoKSwgdGhpcy5fcHJpbnROb2RlKG5ld0V4cHJlc3Npb24sIHNvdXJjZUZpbGUpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZWxldGUgdGhlIG9sZCBpbXBvcnQgdG8gdGhlIFwiR2VzdHVyZUNvbmZpZ1wiLlxuICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICBzb3VyY2VGaWxlLCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUpO1xuXG4gICAgLy8gSWYgdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGlzIG5vdCBmcm9tIGluc2lkZSBvZiBhIGltcG9ydCwgd2UgbmVlZCB0byBhZGQgYSBuZXdcbiAgICAvLyBpbXBvcnQgdG8gdGhlIGNvcGllZCBnZXN0dXJlIGNvbmZpZyBhbmQgcmVwbGFjZSB0aGUgaWRlbnRpZmllci4gRm9yIHJlZmVyZW5jZXNcbiAgICAvLyB3aXRoaW4gYW4gaW1wb3J0LCB3ZSBkbyBub3RoaW5nIGJ1dCByZW1vdmluZyB0aGUgYWN0dWFsIGltcG9ydC4gVGhpcyBhbGxvd3MgdXNcbiAgICAvLyB0byByZW1vdmUgdW51c2VkIGltcG9ydHMgdG8gdGhlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgIGlmICghaXNJbXBvcnQpIHtcbiAgICAgIGNvbnN0IG5ld0V4cHJlc3Npb24gPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgICBzb3VyY2VGaWxlLCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLCBuZXdNb2R1bGVTcGVjaWZpZXIsIGZhbHNlLFxuICAgICAgICAgIGdlc3R1cmVJZGVudGlmaWVyc0luRmlsZSk7XG5cbiAgICAgIHJlY29yZGVyLnJlbW92ZShub2RlLmdldFN0YXJ0KCksIG5vZGUuZ2V0V2lkdGgoKSk7XG4gICAgICByZWNvcmRlci5pbnNlcnRSaWdodChub2RlLmdldFN0YXJ0KCksIHRoaXMuX3ByaW50Tm9kZShuZXdFeHByZXNzaW9uLCBzb3VyY2VGaWxlKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBnaXZlbiBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2UgYW5kIGl0cyBjb3JyZXNwb25kaW5nIGltcG9ydCBmcm9tXG4gICAqIGl0cyBjb250YWluaW5nIHNvdXJjZSBmaWxlLiBJbXBvcnRzIHdpbGwgYmUgYWx3YXlzIHJlbW92ZWQsIGJ1dCBpbiBzb21lIGNhc2VzLFxuICAgKiB3aGVyZSBpdCdzIG5vdCBndWFyYW50ZWVkIHRoYXQgYSByZW1vdmFsIGNhbiBiZSBwZXJmb3JtZWQgc2FmZWx5LCB3ZSBqdXN0XG4gICAqIGNyZWF0ZSBhIG1pZ3JhdGlvbiBmYWlsdXJlIChhbmQgYWRkIGEgVE9ETyBpZiBwb3NzaWJsZSkuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKHtub2RlLCBpbXBvcnREYXRhLCBpc0ltcG9ydH06IElkZW50aWZpZXJSZWZlcmVuY2UpIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIC8vIE9ubHkgcmVtb3ZlIHRoZSBpbXBvcnQgZm9yIHRoZSBnZXN0dXJlIGNvbmZpZyBpZiB0aGUgZ2VzdHVyZSBjb25maWcgaGFzXG4gICAgLy8gYmVlbiBhY2Nlc3NlZCB0aHJvdWdoIGEgbm9uLW5hbWVzcGFjZWQgaWRlbnRpZmllciBhY2Nlc3MuXG4gICAgaWYgKCFpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGUpKSB7XG4gICAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChcbiAgICAgICAgICBzb3VyY2VGaWxlLCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUpO1xuICAgIH1cblxuICAgIC8vIEZvciByZWZlcmVuY2VzIGZyb20gd2l0aGluIGFuIGltcG9ydCwgd2UgZG8gbm90IG5lZWQgdG8gZG8gYW55dGhpbmcgb3RoZXIgdGhhblxuICAgIC8vIHJlbW92aW5nIHRoZSBpbXBvcnQuIEZvciBvdGhlciByZWZlcmVuY2VzLCB3ZSByZW1vdmUgdGhlIGltcG9ydCBhbmQgdGhlIHJlZmVyZW5jZVxuICAgIC8vIGlkZW50aWZpZXIgaWYgdXNlZCBpbnNpZGUgb2YgYSBwcm92aWRlciBkZWZpbml0aW9uLlxuICAgIGlmIChpc0ltcG9ydCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3ZpZGVyQXNzaWdubWVudCA9IG5vZGUucGFyZW50O1xuXG4gICAgLy8gT25seSByZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgZ2VzdHVyZSBjb25maWcgd2hpY2ggYXJlIHBhcnQgb2YgYSBzdGF0aWNhbGx5XG4gICAgLy8gYW5hbHl6YWJsZSBwcm92aWRlciBkZWZpbml0aW9uLiBXZSBvbmx5IHN1cHBvcnQgdGhlIGNvbW1vbiBjYXNlIG9mIGEgZ2VzdHVyZVxuICAgIC8vIGNvbmZpZyBwcm92aWRlciBkZWZpbml0aW9uIHdoZXJlIHRoZSBjb25maWcgaXMgc2V0IHVwIHRocm91Z2ggXCJ1c2VDbGFzc1wiLlxuICAgIC8vIE90aGVyd2lzZSwgaXQncyBub3QgZ3VhcmFudGVlZCB0aGF0IHdlIGNhbiBzYWZlbHkgcmVtb3ZlIHRoZSBwcm92aWRlciBkZWZpbml0aW9uLlxuICAgIGlmICghdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvdmlkZXJBc3NpZ25tZW50KSB8fFxuICAgICAgICBnZXRQcm9wZXJ0eU5hbWVUZXh0KHByb3ZpZGVyQXNzaWdubWVudC5uYW1lKSAhPT0gJ3VzZUNsYXNzJykge1xuICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe25vZGUsIG1lc3NhZ2U6IENBTk5PVF9SRU1PVkVfUkVGRVJFTkNFX0VSUk9SfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb2JqZWN0TGl0ZXJhbEV4cHIgPSBwcm92aWRlckFzc2lnbm1lbnQucGFyZW50O1xuICAgIGNvbnN0IHByb3ZpZGVUb2tlbiA9IG9iamVjdExpdGVyYWxFeHByLnByb3BlcnRpZXMuZmluZChcbiAgICAgICAgKHApOiBwIGlzIHRzLlByb3BlcnR5QXNzaWdubWVudCA9PlxuICAgICAgICAgICAgdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocCkgJiYgZ2V0UHJvcGVydHlOYW1lVGV4dChwLm5hbWUpID09PSAncHJvdmlkZScpO1xuXG4gICAgLy8gRG8gbm90IHJlbW92ZSB0aGUgcmVmZXJlbmNlIGlmIHRoZSBnZXN0dXJlIGNvbmZpZyBpcyBub3QgcGFydCBvZiBhIHByb3ZpZGVyIGRlZmluaXRpb24sXG4gICAgLy8gb3IgaWYgdGhlIHByb3ZpZGVkIHRva2UgaXMgbm90IHJlZmVycmluZyB0byB0aGUga25vd24gSEFNTUVSX0dFU1RVUkVfQ09ORklHIHRva2VuXG4gICAgLy8gZnJvbSBwbGF0Zm9ybS1icm93c2VyLlxuICAgIGlmICghcHJvdmlkZVRva2VuIHx8ICF0aGlzLl9pc1JlZmVyZW5jZVRvSGFtbWVyQ29uZmlnVG9rZW4ocHJvdmlkZVRva2VuLmluaXRpYWxpemVyKSkge1xuICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe25vZGUsIG1lc3NhZ2U6IENBTk5PVF9SRU1PVkVfUkVGRVJFTkNFX0VSUk9SfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ29sbGVjdCBhbGwgbmVzdGVkIGlkZW50aWZpZXJzIHdoaWNoIHdpbGwgYmUgZGVsZXRlZC4gVGhpcyBoZWxwcyB1c1xuICAgIC8vIGRldGVybWluaW5nIGlmIHdlIGNhbiByZW1vdmUgaW1wb3J0cyBmb3IgdGhlIFwiSEFNTUVSX0dFU1RVUkVfQ09ORklHXCIgdG9rZW4uXG4gICAgdGhpcy5fZGVsZXRlZElkZW50aWZpZXJzLnB1c2goLi4uZmluZE1hdGNoaW5nQ2hpbGROb2RlcyhvYmplY3RMaXRlcmFsRXhwciwgdHMuaXNJZGVudGlmaWVyKSk7XG5cbiAgICAvLyBJbiBjYXNlIHRoZSBmb3VuZCBwcm92aWRlciBkZWZpbml0aW9uIGlzIG5vdCBwYXJ0IG9mIGFuIGFycmF5IGxpdGVyYWwsXG4gICAgLy8gd2UgY2Fubm90IHNhZmVseSByZW1vdmUgdGhlIHByb3ZpZGVyLiBUaGlzIGlzIGJlY2F1c2UgaXQgY291bGQgYmUgZGVjbGFyZWRcbiAgICAvLyBhcyBhIHZhcmlhYmxlLiBlLmcuIFwiY29uc3QgZ2VzdHVyZVByb3ZpZGVyID0ge3Byb3ZpZGU6IC4uLCB1c2VDbGFzczogR2VzdHVyZUNvbmZpZ31cIi5cbiAgICAvLyBJbiB0aGF0IGNhc2UsIHdlIGp1c3QgYWRkIGFuIGVtcHR5IG9iamVjdCBsaXRlcmFsIHdpdGggVE9ETyBhbmQgcHJpbnQgYSBmYWlsdXJlLlxuICAgIGlmICghdHMuaXNBcnJheUxpdGVyYWxFeHByZXNzaW9uKG9iamVjdExpdGVyYWxFeHByLnBhcmVudCkpIHtcbiAgICAgIHJlY29yZGVyLnJlbW92ZShvYmplY3RMaXRlcmFsRXhwci5nZXRTdGFydCgpLCBvYmplY3RMaXRlcmFsRXhwci5nZXRXaWR0aCgpKTtcbiAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG9iamVjdExpdGVyYWxFeHByLmdldFN0YXJ0KCksIGAvKiBUT0RPOiByZW1vdmUgKi8ge31gKTtcbiAgICAgIHRoaXMuX25vZGVGYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgbm9kZTogb2JqZWN0TGl0ZXJhbEV4cHIsXG4gICAgICAgIG1lc3NhZ2U6IGBVbmFibGUgdG8gZGVsZXRlIHByb3ZpZGVyIGRlZmluaXRpb24gZm9yIFwiR2VzdHVyZUNvbmZpZ1wiIGNvbXBsZXRlbHkuIGAgK1xuICAgICAgICAgICAgYFBsZWFzZSBjbGVhbiB1cCB0aGUgcHJvdmlkZXIuYFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlcyB0aGUgb2JqZWN0IGxpdGVyYWwgZnJvbSB0aGUgcGFyZW50IGFycmF5IGV4cHJlc3Npb24uIFJlbW92ZXNcbiAgICAvLyB0aGUgdHJhaWxpbmcgY29tbWEgdG9rZW4gaWYgcHJlc2VudC5cbiAgICByZW1vdmVFbGVtZW50RnJvbUFycmF5RXhwcmVzc2lvbihvYmplY3RMaXRlcmFsRXhwciwgcmVjb3JkZXIpO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgdGhlIGdpdmVuIGhhbW1lciBjb25maWcgdG9rZW4gaW1wb3J0IGlmIGl0IGlzIG5vdCB1c2VkLiAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJDb25maWdUb2tlbkltcG9ydElmVW51c2VkKHtub2RlLCBpbXBvcnREYXRhfTogSWRlbnRpZmllclJlZmVyZW5jZSkge1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCBpc1Rva2VuVXNlZCA9IHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKFxuICAgICAgICByID0+ICFyLmlzSW1wb3J0ICYmICFpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKHIubm9kZSkgJiZcbiAgICAgICAgICAgIHIubm9kZS5nZXRTb3VyY2VGaWxlKCkgPT09IHNvdXJjZUZpbGUgJiYgIXRoaXMuX2RlbGV0ZWRJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKTtcblxuICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gcmVtb3ZlIHRoZSBpbXBvcnQgZm9yIHRoZSB0b2tlbiBpZiB0aGUgdG9rZW4gaXNcbiAgICAvLyBzdGlsbCB1c2VkIHNvbWV3aGVyZS5cbiAgICBpZiAoIWlzVG9rZW5Vc2VkKSB7XG4gICAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChcbiAgICAgICAgICBzb3VyY2VGaWxlLCBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUsIGltcG9ydERhdGEubW9kdWxlTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlbW92ZXMgSGFtbWVyIGZyb20gYWxsIGluZGV4IEhUTUwgZmlsZXMgb2YgdGhlIGdpdmVuIHByb2plY3QuICovXG4gIHByaXZhdGUgX3JlbW92ZUhhbW1lckZyb21JbmRleEZpbGUocHJvamVjdDogV29ya3NwYWNlUHJvamVjdCkge1xuICAgIGNvbnN0IGluZGV4RmlsZVBhdGhzID0gZ2V0UHJvamVjdEluZGV4RmlsZXMocHJvamVjdCk7XG4gICAgaW5kZXhGaWxlUGF0aHMuZm9yRWFjaChmaWxlUGF0aCA9PiB7XG4gICAgICBpZiAoIXRoaXMudHJlZS5leGlzdHMoZmlsZVBhdGgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaHRtbENvbnRlbnQgPSB0aGlzLnRyZWUucmVhZChmaWxlUGF0aCkhLnRvU3RyaW5nKCd1dGY4Jyk7XG4gICAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZ2V0VXBkYXRlUmVjb3JkZXIoZmlsZVBhdGgpO1xuXG4gICAgICBmaW5kSGFtbWVyU2NyaXB0SW1wb3J0RWxlbWVudHMoaHRtbENvbnRlbnQpXG4gICAgICAgICAgLmZvckVhY2goZWwgPT4gcmVtb3ZlRWxlbWVudEZyb21IdG1sKGVsLCByZWNvcmRlcikpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFNldHMgdXAgdGhlIEhhbW1lciBnZXN0dXJlIGNvbmZpZyBwcm92aWRlciBpbiB0aGUgYXBwIG1vZHVsZSBpZiBuZWVkZWQuICovXG4gIHByaXZhdGUgX3NldHVwSGFtbWVyR2VzdHVyZXNJbkFwcE1vZHVsZShwcm9qZWN0OiBXb3Jrc3BhY2VQcm9qZWN0LCBnZXN0dXJlQ29uZmlnUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgbWFpbkZpbGVQYXRoID0gam9pbih0aGlzLmJhc2VQYXRoLCBnZXRQcm9qZWN0TWFpbkZpbGUocHJvamVjdCkpO1xuICAgIGNvbnN0IG1haW5GaWxlID0gdGhpcy5wcm9ncmFtLmdldFNvdXJjZUZpbGUobWFpbkZpbGVQYXRoKTtcbiAgICBpZiAoIW1haW5GaWxlKSB7XG4gICAgICB0aGlzLmZhaWx1cmVzLnB1c2goe1xuICAgICAgICBmaWxlUGF0aDogbWFpbkZpbGVQYXRoLFxuICAgICAgICBtZXNzYWdlOiBDQU5OT1RfU0VUVVBfQVBQX01PRFVMRV9FUlJPUixcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFwcE1vZHVsZUV4cHIgPSBmaW5kTWFpbk1vZHVsZUV4cHJlc3Npb24obWFpbkZpbGUpO1xuICAgIGlmICghYXBwTW9kdWxlRXhwcikge1xuICAgICAgdGhpcy5mYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgZmlsZVBhdGg6IG1haW5GaWxlUGF0aCxcbiAgICAgICAgbWVzc2FnZTogQ0FOTk9UX1NFVFVQX0FQUF9NT0RVTEVfRVJST1IsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhcHBNb2R1bGVTeW1ib2wgPSB0aGlzLl9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZSh1bndyYXBFeHByZXNzaW9uKGFwcE1vZHVsZUV4cHIpKTtcbiAgICBpZiAoIWFwcE1vZHVsZVN5bWJvbCB8fCAhYXBwTW9kdWxlU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pIHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiBtYWluRmlsZVBhdGgsXG4gICAgICAgIG1lc3NhZ2U6IENBTk5PVF9TRVRVUF9BUFBfTU9EVUxFX0VSUk9SLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc291cmNlRmlsZSA9IGFwcE1vZHVsZVN5bWJvbC52YWx1ZURlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCByZWxhdGl2ZVBhdGggPSByZWxhdGl2ZSh0aGlzLmJhc2VQYXRoLCBzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICBjb25zdCBoYW1tZXJNb2R1bGVFeHByID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgIHNvdXJjZUZpbGUsIEhBTU1FUl9NT0RVTEVfTkFNRSwgSEFNTUVSX01PRFVMRV9JTVBPUlQpO1xuICAgIGNvbnN0IGhhbW1lckNvbmZpZ1Rva2VuRXhwciA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICBzb3VyY2VGaWxlLCBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUsIEhBTU1FUl9DT05GSUdfVE9LRU5fTU9EVUxFKTtcbiAgICBjb25zdCBnZXN0dXJlQ29uZmlnRXhwciA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICBzb3VyY2VGaWxlLCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLFxuICAgICAgICBnZXRNb2R1bGVTcGVjaWZpZXIoZ2VzdHVyZUNvbmZpZ1BhdGgsIHNvdXJjZUZpbGUuZmlsZU5hbWUpLCBmYWxzZSxcbiAgICAgICAgdGhpcy5fZ2V0R2VzdHVyZUNvbmZpZ0lkZW50aWZpZXJzT2ZGaWxlKHNvdXJjZUZpbGUpKTtcblxuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5nZXRVcGRhdGVSZWNvcmRlcihzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICBjb25zdCBuZXdQcm92aWRlck5vZGUgPSB0cy5jcmVhdGVPYmplY3RMaXRlcmFsKFtcbiAgICAgIHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgncHJvdmlkZScsIGhhbW1lckNvbmZpZ1Rva2VuRXhwciksXG4gICAgICB0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQoJ3VzZUNsYXNzJywgZ2VzdHVyZUNvbmZpZ0V4cHIpXG4gICAgXSk7XG5cbiAgICAvLyBJZiBubyBcIk5nTW9kdWxlXCIgZGVmaW5pdGlvbiBpcyBmb3VuZCBpbnNpZGUgdGhlIHNvdXJjZSBmaWxlLCB3ZSBqdXN0IGRvIG5vdGhpbmcuXG4gICAgY29uc3QgbWV0YWRhdGEgPSBnZXREZWNvcmF0b3JNZXRhZGF0YShzb3VyY2VGaWxlLCAnTmdNb2R1bGUnLCAnQGFuZ3VsYXIvY29yZScpIGFzXG4gICAgICAgIHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uW107XG4gICAgaWYgKCFtZXRhZGF0YS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcm92aWRlcnNGaWVsZCA9IGdldE1ldGFkYXRhRmllbGQobWV0YWRhdGFbMF0sICdwcm92aWRlcnMnKVswXTtcbiAgICBjb25zdCBpbXBvcnRzRmllbGQgPSBnZXRNZXRhZGF0YUZpZWxkKG1ldGFkYXRhWzBdLCAnaW1wb3J0cycpWzBdO1xuXG4gICAgY29uc3QgcHJvdmlkZXJJZGVudGlmaWVycyA9XG4gICAgICAgIHByb3ZpZGVyc0ZpZWxkID8gZmluZE1hdGNoaW5nQ2hpbGROb2Rlcyhwcm92aWRlcnNGaWVsZCwgdHMuaXNJZGVudGlmaWVyKSA6IG51bGw7XG4gICAgY29uc3QgaW1wb3J0SWRlbnRpZmllcnMgPVxuICAgICAgICBpbXBvcnRzRmllbGQgPyBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzKGltcG9ydHNGaWVsZCwgdHMuaXNJZGVudGlmaWVyKSA6IG51bGw7XG4gICAgY29uc3QgY2hhbmdlQWN0aW9uczogQ2hhbmdlW10gPSBbXTtcblxuICAgIC8vIElmIHRoZSBwcm92aWRlcnMgZmllbGQgZXhpc3RzIGFuZCBhbHJlYWR5IGNvbnRhaW5zIHJlZmVyZW5jZXMgdG8gdGhlIGhhbW1lciBnZXN0dXJlXG4gICAgLy8gY29uZmlnIHRva2VuIGFuZCB0aGUgZ2VzdHVyZSBjb25maWcsIHdlIG5haXZlbHkgYXNzdW1lIHRoYXQgdGhlIGdlc3R1cmUgY29uZmlnIGlzXG4gICAgLy8gYWxyZWFkeSBzZXQgdXAuIFdlIG9ubHkgd2FudCB0byBhZGQgdGhlIGdlc3R1cmUgY29uZmlnIHByb3ZpZGVyIGlmIGl0IGlzIG5vdCBzZXQgdXAuXG4gICAgaWYgKCFwcm92aWRlcklkZW50aWZpZXJzIHx8XG4gICAgICAgICEodGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUociA9PiBwcm92aWRlcklkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpICYmXG4gICAgICAgICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuc29tZShyID0+IHByb3ZpZGVySWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSkpKSB7XG4gICAgICBjaGFuZ2VBY3Rpb25zLnB1c2goLi4uYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhKFxuICAgICAgICAgIHNvdXJjZUZpbGUsIHJlbGF0aXZlUGF0aCwgJ3Byb3ZpZGVycycsIHRoaXMuX3ByaW50Tm9kZShuZXdQcm92aWRlck5vZGUsIHNvdXJjZUZpbGUpLFxuICAgICAgICAgIG51bGwpKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpcyBub3QgYWxyZWFkeSBpbXBvcnRlZCBpbiB0aGUgYXBwIG1vZHVsZSwgd2Ugc2V0IGl0IHVwXG4gICAgLy8gYnkgYWRkaW5nIGl0IHRvIHRoZSBcImltcG9ydHNcIiBmaWVsZC5cbiAgICBpZiAoIWltcG9ydElkZW50aWZpZXJzIHx8XG4gICAgICAgICF0aGlzLl9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzLnNvbWUociA9PiBpbXBvcnRJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKSkge1xuICAgICAgY2hhbmdlQWN0aW9ucy5wdXNoKC4uLmFkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YShcbiAgICAgICAgICBzb3VyY2VGaWxlLCByZWxhdGl2ZVBhdGgsICdpbXBvcnRzJywgdGhpcy5fcHJpbnROb2RlKGhhbW1lck1vZHVsZUV4cHIsIHNvdXJjZUZpbGUpLFxuICAgICAgICAgIG51bGwpKTtcbiAgICB9XG5cbiAgICBjaGFuZ2VBY3Rpb25zLmZvckVhY2goY2hhbmdlID0+IHtcbiAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRDaGFuZ2UpIHtcbiAgICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBQcmludHMgYSBnaXZlbiBub2RlIHdpdGhpbiB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlLiAqL1xuICBwcml2YXRlIF9wcmludE5vZGUobm9kZTogdHMuTm9kZSwgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCBub2RlLCBzb3VyY2VGaWxlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFsbCByZWZlcmVuY2VkIGdlc3R1cmUgY29uZmlnIGlkZW50aWZpZXJzIG9mIGEgZ2l2ZW4gc291cmNlIGZpbGUgKi9cbiAgcHJpdmF0ZSBfZ2V0R2VzdHVyZUNvbmZpZ0lkZW50aWZpZXJzT2ZGaWxlKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiB0cy5JZGVudGlmaWVyW10ge1xuICAgIHJldHVybiB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5maWx0ZXIoZCA9PiBkLm5vZGUuZ2V0U291cmNlRmlsZSgpID09PSBzb3VyY2VGaWxlKVxuICAgICAgICAubWFwKGQgPT4gZC5ub2RlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzeW1ib2wgdGhhdCBjb250YWlucyB0aGUgdmFsdWUgZGVjbGFyYXRpb24gb2YgdGhlIHNwZWNpZmllZCBub2RlLiAqL1xuICBwcml2YXRlIF9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlOiB0cy5Ob2RlKTogdHMuU3ltYm9sfHVuZGVmaW5lZCB7XG4gICAgY29uc3Qgc3ltYm9sID0gdGhpcy50eXBlQ2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUpO1xuXG4gICAgLy8gU3ltYm9scyBjYW4gYmUgYWxpYXNlcyBvZiB0aGUgZGVjbGFyYXRpb24gc3ltYm9sLiBlLmcuIGluIG5hbWVkIGltcG9ydCBzcGVjaWZpZXJzLlxuICAgIC8vIFdlIG5lZWQgdG8gcmVzb2x2ZSB0aGUgYWxpYXNlZCBzeW1ib2wgYmFjayB0byB0aGUgZGVjbGFyYXRpb24gc3ltYm9sLlxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1iaXR3aXNlXG4gICAgaWYgKHN5bWJvbCAmJiAoc3ltYm9sLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuQWxpYXMpICE9PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy50eXBlQ2hlY2tlci5nZXRBbGlhc2VkU3ltYm9sKHN5bWJvbCk7XG4gICAgfVxuICAgIHJldHVybiBzeW1ib2w7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIGV4cHJlc3Npb24gcmVzb2x2ZXMgdG8gYSBoYW1tZXIgZ2VzdHVyZSBjb25maWdcbiAgICogdG9rZW4gcmVmZXJlbmNlIGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuXG4gICAqL1xuICBwcml2YXRlIF9pc1JlZmVyZW5jZVRvSGFtbWVyQ29uZmlnVG9rZW4oZXhwcjogdHMuRXhwcmVzc2lvbikge1xuICAgIGNvbnN0IHVud3JhcHBlZCA9IHVud3JhcEV4cHJlc3Npb24oZXhwcik7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcih1bndyYXBwZWQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUociA9PiByLm5vZGUgPT09IHVud3JhcHBlZCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbih1bndyYXBwZWQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUociA9PiByLm5vZGUgPT09IHVud3JhcHBlZC5uYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgbWlncmF0aW9uIGZhaWx1cmVzIG9mIHRoZSBjb2xsZWN0ZWQgbm9kZSBmYWlsdXJlcy4gVGhlIHJldHVybmVkIG1pZ3JhdGlvblxuICAgKiBmYWlsdXJlcyBhcmUgdXBkYXRlZCB0byByZWZsZWN0IHRoZSBwb3N0LW1pZ3JhdGlvbiBzdGF0ZSBvZiBzb3VyY2UgZmlsZXMuIE1lYW5pbmdcbiAgICogdGhhdCBmYWlsdXJlIHBvc2l0aW9ucyBhcmUgY29ycmVjdGVkIGlmIHNvdXJjZSBmaWxlIG1vZGlmaWNhdGlvbnMgc2hpZnRlZCBsaW5lcy5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU1pZ3JhdGlvbkZhaWx1cmVzKCk6IE1pZ3JhdGlvbkZhaWx1cmVbXSB7XG4gICAgcmV0dXJuIHRoaXMuX25vZGVGYWlsdXJlcy5tYXAoKHtub2RlLCBtZXNzYWdlfSkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gbm9kZS5nZXRTdGFydCgpO1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0cy5nZXRMaW5lQW5kQ2hhcmFjdGVyT2ZQb3NpdGlvbihub2RlLmdldFNvdXJjZUZpbGUoKSwgbm9kZS5nZXRTdGFydCgpKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aW9uOiB0aGlzLl9pbXBvcnRNYW5hZ2VyLmNvcnJlY3ROb2RlUG9zaXRpb24obm9kZSwgb2Zmc2V0LCBwb3NpdGlvbiksXG4gICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIGZpbGVQYXRoOiBzb3VyY2VGaWxlLmZpbGVOYW1lLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBwcm9qZWN0IGZyb20gdGhlIGN1cnJlbnQgcHJvZ3JhbSBvciB0aHJvd3MgaWYgbm8gcHJvamVjdFxuICAgKiBjb3VsZCBiZSBmb3VuZC5cbiAgICovXG4gIHByaXZhdGUgX2dldFByb2plY3RPclRocm93KCk6IFdvcmtzcGFjZVByb2plY3Qge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGdldFdvcmtzcGFjZSh0aGlzLnRyZWUpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVByb2dyYW0od29ya3NwYWNlLCB0aGlzLnByb2dyYW0pO1xuXG4gICAgaWYgKCFwcm9qZWN0KSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihcbiAgICAgICAgICAnQ291bGQgbm90IGZpbmQgcHJvamVjdCB0byBwZXJmb3JtIEhhbW1lckpTIHY5IG1pZ3JhdGlvbi4gJyArXG4gICAgICAgICAgJ1BsZWFzZSBlbnN1cmUgeW91ciB3b3Jrc3BhY2UgY29uZmlndXJhdGlvbiBkZWZpbmVzIGEgcHJvamVjdC4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvamVjdDtcbiAgfVxuXG4gIC8qKiBHbG9iYWwgc3RhdGUgb2Ygd2hldGhlciBIYW1tZXIgaXMgdXNlZCBpbiBhbnkgYW5hbHl6ZWQgcHJvamVjdCB0YXJnZXQuICovXG4gIHN0YXRpYyBnbG9iYWxVc2VzSGFtbWVyID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFN0YXRpYyBtaWdyYXRpb24gcnVsZSBtZXRob2QgdGhhdCB3aWxsIGJlIGNhbGxlZCBvbmNlIGFsbCBwcm9qZWN0IHRhcmdldHNcbiAgICogaGF2ZSBiZWVuIG1pZ3JhdGVkIGluZGl2aWR1YWxseS4gVGhpcyBtZXRob2QgY2FuIGJlIHVzZWQgdG8gbWFrZSBjaGFuZ2VzIGJhc2VkXG4gICAqIG9uIHRoZSBhbmFseXNpcyBvZiB0aGUgaW5kaXZpZHVhbCB0YXJnZXRzLiBGb3IgZXhhbXBsZTogd2Ugb25seSByZW1vdmUgSGFtbWVyXG4gICAqIGZyb20gdGhlIFwicGFja2FnZS5qc29uXCIgaWYgaXQgaXMgbm90IHVzZWQgaW4gKmFueSogcHJvamVjdCB0YXJnZXQuXG4gICAqL1xuICBzdGF0aWMgZ2xvYmFsUG9zdE1pZ3JhdGlvbih0cmVlOiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KTogUG9zdE1pZ3JhdGlvbkFjdGlvbiB7XG4gICAgLy8gQWx3YXlzIG5vdGlmeSB0aGUgZGV2ZWxvcGVyIHRoYXQgdGhlIEhhbW1lciB2OSBtaWdyYXRpb24gZG9lcyBub3QgbWlncmF0ZSB0ZXN0cy5cbiAgICBjb250ZXh0LmxvZ2dlci5pbmZvKGNoYWxrLnllbGxvdyhcbiAgICAgICdcXG7imqAgIEdlbmVyYWwgbm90aWNlOiBUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIENvbXBvbmVudHMgaXMgbm90IGFibGUgdG8gJyArXG4gICAgICAnbWlncmF0ZSB0ZXN0cy4gUGxlYXNlIG1hbnVhbGx5IGNsZWFuIHVwIHRlc3RzIGluIHlvdXIgcHJvamVjdCBpZiB0aGV5IHJlbHkgb24gJyArXG4gICAgICAodGhpcy5nbG9iYWxVc2VzSGFtbWVyID8gJ3RoZSBkZXByZWNhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuJyA6ICdIYW1tZXJKUy4nKSkpO1xuXG4gICAgaWYgKCF0aGlzLmdsb2JhbFVzZXNIYW1tZXIgJiYgdGhpcy5fcmVtb3ZlSGFtbWVyRnJvbVBhY2thZ2VKc29uKHRyZWUpKSB7XG4gICAgICAvLyBTaW5jZSBIYW1tZXIgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSB3b3Jrc3BhY2UgXCJwYWNrYWdlLmpzb25cIiBmaWxlLFxuICAgICAgLy8gd2Ugc2NoZWR1bGUgYSBub2RlIHBhY2thZ2UgaW5zdGFsbCB0YXNrIHRvIHJlZnJlc2ggdGhlIGxvY2sgZmlsZS5cbiAgICAgIHJldHVybiB7cnVuUGFja2FnZU1hbmFnZXI6IHRydWV9O1xuICAgIH1cblxuICAgIC8vIENsZWFuIGdsb2JhbCBzdGF0ZSBvbmNlIHRoZSB3b3Jrc3BhY2UgaGFzIGJlZW4gbWlncmF0ZWQuIFRoaXMgaXMgdGVjaG5pY2FsbHlcbiAgICAvLyBub3QgbmVjZXNzYXJ5IGluIFwibmcgdXBkYXRlXCIsIGJ1dCBpbiB0ZXN0cyB3ZSByZS11c2UgdGhlIHNhbWUgcnVsZSBjbGFzcy5cbiAgICB0aGlzLmdsb2JhbFVzZXNIYW1tZXIgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBoYW1tZXIgcGFja2FnZSBmcm9tIHRoZSB3b3Jrc3BhY2UgXCJwYWNrYWdlLmpzb25cIi5cbiAgICogQHJldHVybnMgV2hldGhlciBIYW1tZXIgd2FzIHNldCB1cCBhbmQgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBcInBhY2thZ2UuanNvblwiXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBfcmVtb3ZlSGFtbWVyRnJvbVBhY2thZ2VKc29uKHRyZWU6IFRyZWUpOiBib29sZWFuIHtcbiAgICBpZiAoIXRyZWUuZXhpc3RzKCcvcGFja2FnZS5qc29uJykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBwYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UodHJlZS5yZWFkKCcvcGFja2FnZS5qc29uJykhLnRvU3RyaW5nKCd1dGY4JykpO1xuXG4gICAgLy8gV2UgZG8gbm90IGhhbmRsZSB0aGUgY2FzZSB3aGVyZSBzb21lb25lIG1hbnVhbGx5IGFkZGVkIFwiaGFtbWVyanNcIlxuICAgIC8vIHRvIHRoZSBkZXYgZGVwZW5kZW5jaWVzLlxuICAgIGlmIChwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXNbSEFNTUVSX01PRFVMRV9TUEVDSUZJRVJdKSB7XG4gICAgICBkZWxldGUgcGFja2FnZUpzb24uZGVwZW5kZW5jaWVzW0hBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSXTtcbiAgICAgIHRyZWUub3ZlcndyaXRlKCcvcGFja2FnZS5qc29uJywgSlNPTi5zdHJpbmdpZnkocGFja2FnZUpzb24sIG51bGwsIDIpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBSZWN1cnNpdmVseSB1bndyYXBzIGEgZ2l2ZW4gZXhwcmVzc2lvbiBpZiBpdCBpcyB3cmFwcGVkXG4gKiBieSBwYXJlbnRoZXNpcywgdHlwZSBjYXN0cyBvciB0eXBlIGFzc2VydGlvbnMuXG4gKi9cbmZ1bmN0aW9uIHVud3JhcEV4cHJlc3Npb24obm9kZTogdHMuTm9kZSk6IHRzLk5vZGUge1xuICBpZiAodHMuaXNQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihub2RlKSkge1xuICAgIHJldHVybiB1bndyYXBFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gIH0gZWxzZSBpZiAodHMuaXNBc0V4cHJlc3Npb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9IGVsc2UgaWYgKHRzLmlzVHlwZUFzc2VydGlvbihub2RlKSkge1xuICAgIHJldHVybiB1bndyYXBFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gIH1cbiAgcmV0dXJuIG5vZGU7XG59XG5cbi8qKlxuICogQ29udmVydHMgdGhlIHNwZWNpZmllZCBwYXRoIHRvIGEgdmFsaWQgVHlwZVNjcmlwdCBtb2R1bGUgc3BlY2lmaWVyIHdoaWNoIGlzXG4gKiByZWxhdGl2ZSB0byB0aGUgZ2l2ZW4gY29udGFpbmluZyBmaWxlLlxuICovXG5mdW5jdGlvbiBnZXRNb2R1bGVTcGVjaWZpZXIobmV3UGF0aDogc3RyaW5nLCBjb250YWluaW5nRmlsZTogc3RyaW5nKSB7XG4gIGxldCByZXN1bHQgPSByZWxhdGl2ZShkaXJuYW1lKGNvbnRhaW5pbmdGaWxlKSwgbmV3UGF0aCkucmVwbGFjZSgvXFxcXC9nLCAnLycpLnJlcGxhY2UoL1xcLnRzJC8sICcnKTtcbiAgaWYgKCFyZXN1bHQuc3RhcnRzV2l0aCgnLicpKSB7XG4gICAgcmVzdWx0ID0gYC4vJHtyZXN1bHR9YDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHRleHQgb2YgdGhlIGdpdmVuIHByb3BlcnR5IG5hbWUuXG4gKiBAcmV0dXJucyBUZXh0IG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSBuYW1lLiBOdWxsIGlmIG5vdCBzdGF0aWNhbGx5IGFuYWx5emFibGUuXG4gKi9cbmZ1bmN0aW9uIGdldFByb3BlcnR5TmFtZVRleHQobm9kZTogdHMuUHJvcGVydHlOYW1lKTogc3RyaW5nfG51bGwge1xuICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpIHx8IHRzLmlzU3RyaW5nTGl0ZXJhbExpa2Uobm9kZSkpIHtcbiAgICByZXR1cm4gbm9kZS50ZXh0O1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIGlkZW50aWZpZXIgaXMgcGFydCBvZiBhIG5hbWVzcGFjZWQgYWNjZXNzLiAqL1xuZnVuY3Rpb24gaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2Vzcyhub2RlOiB0cy5JZGVudGlmaWVyKTogYm9vbGVhbiB7XG4gIHJldHVybiB0cy5pc1F1YWxpZmllZE5hbWUobm9kZS5wYXJlbnQpIHx8IHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUucGFyZW50KTtcbn1cblxuLyoqXG4gKiBXYWxrcyB0aHJvdWdoIHRoZSBzcGVjaWZpZWQgbm9kZSBhbmQgcmV0dXJucyBhbGwgY2hpbGQgbm9kZXMgd2hpY2ggbWF0Y2ggdGhlXG4gKiBnaXZlbiBwcmVkaWNhdGUuXG4gKi9cbmZ1bmN0aW9uIGZpbmRNYXRjaGluZ0NoaWxkTm9kZXM8VCBleHRlbmRzIHRzLk5vZGU+KFxuICAgIHBhcmVudDogdHMuTm9kZSwgcHJlZGljYXRlOiAobm9kZTogdHMuTm9kZSkgPT4gbm9kZSBpcyBUKTogVFtdIHtcbiAgY29uc3QgcmVzdWx0OiBUW10gPSBbXTtcbiAgY29uc3QgdmlzaXROb2RlID0gKG5vZGU6IHRzLk5vZGUpID0+IHtcbiAgICBpZiAocHJlZGljYXRlKG5vZGUpKSB7XG4gICAgICByZXN1bHQucHVzaChub2RlKTtcbiAgICB9XG4gICAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIHZpc2l0Tm9kZSk7XG4gIH07XG4gIHRzLmZvckVhY2hDaGlsZChwYXJlbnQsIHZpc2l0Tm9kZSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG4iXX0=