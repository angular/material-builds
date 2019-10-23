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
            if (this._usedInRuntime || this._usedInTemplate) {
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
                // If HammerJS could not be detected, but we detected a custom gesture config
                // setup, we only remove all references to the Angular Material gesture config.
                if (hasCustomGestureConfigSetup) {
                    this._removeMaterialGestureConfigSetup();
                    // Print a message if we found a custom gesture config setup in combination with
                    // references to the Angular Material gesture config. This is ambiguous and the
                    // migration just removes the Material gesture config setup, but we still want
                    // to create an information message.
                    if (this._gestureConfigReferences.length) {
                        this.printInfo('The HammerJS v9 migration for Angular components detected that HammerJS is' +
                            'manually set up in combination with references to the Angular Material gesture ' +
                            'config. The migration is unable to perform the full migration for this target, ' +
                            'but removed all references to the deprecated Angular Material gesture config.');
                    }
                }
                else {
                    this._removeHammerSetup();
                }
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
            if (!this._usedInRuntime && this._usedInTemplate) {
                this.printInfo(chalk_1.default.yellow('The HammerJS v9 migration for Angular components migrated the ' +
                    'project to keep HammerJS installed, but detected ambiguous usage of HammerJS. Please ' +
                    'manually check if you can remove HammerJS from your application.'));
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
            if (!this.globalUsesHammer && this._removeHammerFromPackageJson(tree)) {
                // Since Hammer has been removed from the workspace "package.json" file,
                // we schedule a node package install task to refresh the lock file.
                return { runPackageManager: true };
            }
            context.logger.info(chalk_1.default.yellow('⚠ The HammerJS v9 migration for Angular components is not able to migrate tests. ' +
                'Please manually clean up tests in your project if they rely on HammerJS.'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLWdlc3R1cmVzLXJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvdXBncmFkZS1ydWxlcy9oYW1tZXItZ2VzdHVyZXMtdjkvaGFtbWVyLWdlc3R1cmVzLXJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCwrQ0FJOEI7SUFDOUIsMkRBQXVGO0lBQ3ZGLHdEQVFpQztJQUNqQyxxRUFJK0M7SUFDL0MsK0RBQXdFO0lBQ3hFLCtEQUFnRTtJQUVoRSxpQ0FBMEI7SUFDMUIsMkJBQWdDO0lBQ2hDLCtCQUE2QztJQUM3QyxpQ0FBaUM7SUFFakMseUhBQXNEO0lBQ3RELDZJQUF5RTtJQUN6RSwrSEFBNEQ7SUFDNUQseUlBQWlFO0lBQ2pFLG1JQUFtRTtJQUNuRSwySEFBK0M7SUFDL0MsdUlBQXdFO0lBQ3hFLCtJQUFpRTtJQUVqRSxNQUFNLHlCQUF5QixHQUFHLGVBQWUsQ0FBQztJQUNsRCxNQUFNLHdCQUF3QixHQUFHLGdCQUFnQixDQUFDO0lBQ2xELE1BQU0sNEJBQTRCLEdBQUcsMkJBQTJCLENBQUM7SUFFakUsTUFBTSx3QkFBd0IsR0FBRyx1QkFBdUIsQ0FBQztJQUN6RCxNQUFNLDBCQUEwQixHQUFHLDJCQUEyQixDQUFDO0lBRS9ELE1BQU0sa0JBQWtCLEdBQUcsY0FBYyxDQUFDO0lBQzFDLE1BQU0sb0JBQW9CLEdBQUcsMkJBQTJCLENBQUM7SUFFekQsTUFBTSx1QkFBdUIsR0FBRyxVQUFVLENBQUM7SUFFM0MsTUFBTSw2QkFBNkIsR0FDL0IscUVBQXFFLENBQUM7SUFFMUUsTUFBTSw2QkFBNkIsR0FBRyxvREFBb0Q7UUFDdEYsMkRBQTJELENBQUM7SUFRaEUsTUFBYSxrQkFBbUIsU0FBUSwwQkFBbUI7UUFBM0Q7O1lBQ0UseUZBQXlGO1lBQ3pGLHlFQUF5RTtZQUN6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aEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVMsbUJBQW1CLENBQUMsSUFBcUI7UUFDaEQsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6RCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDbEI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCwwRUFBMEU7SUFDMUUsU0FBUyw0QkFBNEIsQ0FBQyxJQUFtQjtRQUN2RCxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVMsc0JBQXNCLENBQzNCLE1BQWUsRUFBRSxTQUF1QztRQUMxRCxNQUFNLE1BQU0sR0FBUSxFQUFFLENBQUM7UUFDdkIsTUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFhLEVBQUUsRUFBRTtZQUNsQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNuQjtZQUNELEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQztRQUNGLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25DLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgam9pbiBhcyBkZXZraXRKb2luLFxuICBub3JtYWxpemUgYXMgZGV2a2l0Tm9ybWFsaXplLFxuICBQYXRoIGFzIERldmtpdFBhdGhcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtTY2hlbWF0aWNDb250ZXh0LCBTY2hlbWF0aWNzRXhjZXB0aW9uLCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBnZXRQcm9qZWN0SW5kZXhGaWxlcyxcbiAgZ2V0UHJvamVjdE1haW5GaWxlLFxuICBNaWdyYXRpb25GYWlsdXJlLFxuICBNaWdyYXRpb25SdWxlLFxuICBQb3N0TWlncmF0aW9uQWN0aW9uLFxuICBSZXNvbHZlZFJlc291cmNlLFxuICBUYXJnZXRWZXJzaW9uXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGFkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YSxcbiAgZ2V0RGVjb3JhdG9yTWV0YWRhdGEsXG4gIGdldE1ldGFkYXRhRmllbGRcbn0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2FzdC11dGlscyc7XG5pbXBvcnQge0NoYW5nZSwgSW5zZXJ0Q2hhbmdlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvY2hhbmdlJztcbmltcG9ydCB7Z2V0V29ya3NwYWNlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvY29uZmlnJztcbmltcG9ydCB7V29ya3NwYWNlUHJvamVjdH0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZS1tb2RlbHMnO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCB7cmVhZEZpbGVTeW5jfSBmcm9tICdmcyc7XG5pbXBvcnQge2Rpcm5hbWUsIGpvaW4sIHJlbGF0aXZlfSBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2dldFByb2plY3RGcm9tUHJvZ3JhbX0gZnJvbSAnLi9jbGktd29ya3NwYWNlJztcbmltcG9ydCB7ZmluZEhhbW1lclNjcmlwdEltcG9ydEVsZW1lbnRzfSBmcm9tICcuL2ZpbmQtaGFtbWVyLXNjcmlwdC10YWdzJztcbmltcG9ydCB7ZmluZE1haW5Nb2R1bGVFeHByZXNzaW9ufSBmcm9tICcuL2ZpbmQtbWFpbi1tb2R1bGUnO1xuaW1wb3J0IHtpc0hhbW1lckpzVXNlZEluVGVtcGxhdGV9IGZyb20gJy4vaGFtbWVyLXRlbXBsYXRlLWNoZWNrJztcbmltcG9ydCB7Z2V0SW1wb3J0T2ZJZGVudGlmaWVyLCBJbXBvcnR9IGZyb20gJy4vaWRlbnRpZmllci1pbXBvcnRzJztcbmltcG9ydCB7SW1wb3J0TWFuYWdlcn0gZnJvbSAnLi9pbXBvcnQtbWFuYWdlcic7XG5pbXBvcnQge3JlbW92ZUVsZW1lbnRGcm9tQXJyYXlFeHByZXNzaW9ufSBmcm9tICcuL3JlbW92ZS1hcnJheS1lbGVtZW50JztcbmltcG9ydCB7cmVtb3ZlRWxlbWVudEZyb21IdG1sfSBmcm9tICcuL3JlbW92ZS1lbGVtZW50LWZyb20taHRtbCc7XG5cbmNvbnN0IEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUgPSAnR2VzdHVyZUNvbmZpZyc7XG5jb25zdCBHRVNUVVJFX0NPTkZJR19GSUxFX05BTUUgPSAnZ2VzdHVyZS1jb25maWcnO1xuY29uc3QgR0VTVFVSRV9DT05GSUdfVEVNUExBVEVfUEFUSCA9ICcuL2dlc3R1cmUtY29uZmlnLnRlbXBsYXRlJztcblxuY29uc3QgSEFNTUVSX0NPTkZJR19UT0tFTl9OQU1FID0gJ0hBTU1FUl9HRVNUVVJFX0NPTkZJRyc7XG5jb25zdCBIQU1NRVJfQ09ORklHX1RPS0VOX01PRFVMRSA9ICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuY29uc3QgSEFNTUVSX01PRFVMRV9OQU1FID0gJ0hhbW1lck1vZHVsZSc7XG5jb25zdCBIQU1NRVJfTU9EVUxFX0lNUE9SVCA9ICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuY29uc3QgSEFNTUVSX01PRFVMRV9TUEVDSUZJRVIgPSAnaGFtbWVyanMnO1xuXG5jb25zdCBDQU5OT1RfUkVNT1ZFX1JFRkVSRU5DRV9FUlJPUiA9XG4gICAgYENhbm5vdCByZW1vdmUgcmVmZXJlbmNlIHRvIFwiR2VzdHVyZUNvbmZpZ1wiLiBQbGVhc2UgcmVtb3ZlIG1hbnVhbGx5LmA7XG5cbmNvbnN0IENBTk5PVF9TRVRVUF9BUFBfTU9EVUxFX0VSUk9SID0gYENvdWxkIG5vdCBzZXR1cCBIYW1tZXIgZ2VzdHVyZXMgaW4gbW9kdWxlLiBQbGVhc2UgYCArXG4gICAgYG1hbnVhbGx5IGVuc3VyZSB0aGF0IHRoZSBIYW1tZXIgZ2VzdHVyZSBjb25maWcgaXMgc2V0IHVwLmA7XG5cbmludGVyZmFjZSBJZGVudGlmaWVyUmVmZXJlbmNlIHtcbiAgbm9kZTogdHMuSWRlbnRpZmllcjtcbiAgaW1wb3J0RGF0YTogSW1wb3J0O1xuICBpc0ltcG9ydDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEhhbW1lckdlc3R1cmVzUnVsZSBleHRlbmRzIE1pZ3JhdGlvblJ1bGU8bnVsbD4ge1xuICAvLyBPbmx5IGVuYWJsZSB0aGlzIHJ1bGUgaWYgdGhlIG1pZ3JhdGlvbiB0YXJnZXRzIHY5IG9yIHYxMCBhbmQgaXMgcnVubmluZyBmb3IgYSBub24tdGVzdFxuICAvLyB0YXJnZXQuIFdlIGNhbm5vdCBtaWdyYXRlIHRlc3QgdGFyZ2V0cyBzaW5jZSB0aGV5IGhhdmUgYSBsaW1pdGVkIHNjb3BlXG4gIC8vIChpbiByZWdhcmRzIHRvIHNvdXJjZSBmaWxlcykgYW5kIHRoZXJlZm9yZSB0aGUgSGFtbWVySlMgdXNhZ2UgZGV0ZWN0aW9uIGNhbiBiZSBpbmNvcnJlY3QuXG4gIHJ1bGVFbmFibGVkID1cbiAgICAgICh0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjkgfHwgdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlYxMCkgJiZcbiAgICAgICF0aGlzLmlzVGVzdFRhcmdldDtcblxuICBwcml2YXRlIF9wcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcigpO1xuICBwcml2YXRlIF9pbXBvcnRNYW5hZ2VyID0gbmV3IEltcG9ydE1hbmFnZXIodGhpcy5nZXRVcGRhdGVSZWNvcmRlciwgdGhpcy5fcHJpbnRlcik7XG4gIHByaXZhdGUgX25vZGVGYWlsdXJlczoge25vZGU6IHRzLk5vZGUsIG1lc3NhZ2U6IHN0cmluZ31bXSA9IFtdO1xuXG4gIC8qKiBXaGV0aGVyIEhhbW1lckpTIGlzIGV4cGxpY2l0bHkgdXNlZCBpbiBhbnkgY29tcG9uZW50IHRlbXBsYXRlLiAqL1xuICBwcml2YXRlIF91c2VkSW5UZW1wbGF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIEhhbW1lckpTIGlzIGFjY2Vzc2VkIGF0IHJ1bnRpbWUuICovXG4gIHByaXZhdGUgX3VzZWRJblJ1bnRpbWUgPSBmYWxzZTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpbXBvcnRzIHRoYXQgbWFrZSBcImhhbW1lcmpzXCIgYXZhaWxhYmxlIGdsb2JhbGx5LiBXZSBrZWVwIHRyYWNrIG9mIHRoZXNlXG4gICAqIHNpbmNlIHdlIG1pZ2h0IG5lZWQgdG8gcmVtb3ZlIHRoZW0gaWYgSGFtbWVyIGlzIG5vdCB1c2VkLlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5zdGFsbEltcG9ydHM6IHRzLkltcG9ydERlY2xhcmF0aW9uW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCByZXNvbHZlIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyBmcm9tIEFuZ3VsYXIgTWF0ZXJpYWwuXG4gICAqL1xuICBwcml2YXRlIF9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlczogSWRlbnRpZmllclJlZmVyZW5jZVtdID0gW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggcmVzb2x2ZSB0byB0aGUgXCJIQU1NRVJfR0VTVFVSRV9DT05GSUdcIiB0b2tlbiBmcm9tXG4gICAqIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzOiBJZGVudGlmaWVyUmVmZXJlbmNlW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCByZXNvbHZlIHRvIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb21cbiAgICogXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuXG4gICAqL1xuICBwcml2YXRlIF9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzOiBJZGVudGlmaWVyUmVmZXJlbmNlW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB0aGF0IGhhdmUgYmVlbiBkZWxldGVkIGZyb20gc291cmNlIGZpbGVzLiBUaGlzIGNhbiBiZVxuICAgKiB1c2VkIHRvIGRldGVybWluZSBpZiBjZXJ0YWluIGltcG9ydHMgYXJlIHN0aWxsIHVzZWQgb3Igbm90LlxuICAgKi9cbiAgcHJpdmF0ZSBfZGVsZXRlZElkZW50aWZpZXJzOiB0cy5JZGVudGlmaWVyW10gPSBbXTtcblxuICB2aXNpdFRlbXBsYXRlKHRlbXBsYXRlOiBSZXNvbHZlZFJlc291cmNlKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl91c2VkSW5UZW1wbGF0ZSAmJiBpc0hhbW1lckpzVXNlZEluVGVtcGxhdGUodGVtcGxhdGUuY29udGVudCkpIHtcbiAgICAgIHRoaXMuX3VzZWRJblRlbXBsYXRlID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrSGFtbWVySW1wb3J0cyhub2RlKTtcbiAgICB0aGlzLl9jaGVja0ZvclJ1bnRpbWVIYW1tZXJVc2FnZShub2RlKTtcbiAgICB0aGlzLl9jaGVja0Zvck1hdGVyaWFsR2VzdHVyZUNvbmZpZyhub2RlKTtcbiAgICB0aGlzLl9jaGVja0ZvckhhbW1lckdlc3R1cmVDb25maWdUb2tlbihub2RlKTtcbiAgICB0aGlzLl9jaGVja0ZvckhhbW1lck1vZHVsZVJlZmVyZW5jZShub2RlKTtcbiAgfVxuXG4gIHBvc3RBbmFseXNpcygpOiB2b2lkIHtcbiAgICAvLyBXYWxrIHRocm91Z2ggYWxsIGhhbW1lciBjb25maWcgdG9rZW4gcmVmZXJlbmNlcyBhbmQgY2hlY2sgaWYgdGhlcmVcbiAgICAvLyBpcyBhIHBvdGVudGlhbCBjdXN0b20gZ2VzdHVyZSBjb25maWcgc2V0dXAuXG4gICAgY29uc3QgaGFzQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwID1cbiAgICAgICAgdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUociA9PiB0aGlzLl9jaGVja0ZvckN1c3RvbUdlc3R1cmVDb25maWdTZXR1cChyKSk7XG5cbiAgICBpZiAodGhpcy5fdXNlZEluUnVudGltZSB8fCB0aGlzLl91c2VkSW5UZW1wbGF0ZSkge1xuICAgICAgLy8gV2Uga2VlcCB0cmFjayBvZiB3aGV0aGVyIEhhbW1lciBpcyB1c2VkIGdsb2JhbGx5LiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHdlXG4gICAgICAvLyB3YW50IHRvIG9ubHkgcmVtb3ZlIEhhbW1lciBmcm9tIHRoZSBcInBhY2thZ2UuanNvblwiIGlmIGl0IGlzIG5vdCB1c2VkIGluIGFueSBwcm9qZWN0XG4gICAgICAvLyB0YXJnZXQuIEp1c3QgYmVjYXVzZSBpdCBpc24ndCB1c2VkIGluIG9uZSB0YXJnZXQgZG9lc24ndCBtZWFuIHRoYXQgd2UgY2FuIHNhZmVseVxuICAgICAgLy8gcmVtb3ZlIHRoZSBkZXBlbmRlbmN5LlxuICAgICAgSGFtbWVyR2VzdHVyZXNSdWxlLmdsb2JhbFVzZXNIYW1tZXIgPSB0cnVlO1xuXG4gICAgICAvLyBJZiBoYW1tZXIgaXMgb25seSB1c2VkIGF0IHJ1bnRpbWUsIHdlIGRvbid0IG5lZWQgdGhlIGdlc3R1cmUgY29uZmlnIG9yIFwiSGFtbWVyTW9kdWxlXCJcbiAgICAgIC8vIGFuZCBjYW4gcmVtb3ZlIGl0IChhbG9uZyB3aXRoIHRoZSBoYW1tZXIgY29uZmlnIHRva2VuIGltcG9ydCBpZiBubyBsb25nZXIgbmVlZGVkKS5cbiAgICAgIGlmICghdGhpcy5fdXNlZEluVGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlSGFtbWVyTW9kdWxlUmVmZXJlbmNlcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2V0dXBIYW1tZXJHZXN0dXJlQ29uZmlnKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIEhhbW1lckpTIGNvdWxkIG5vdCBiZSBkZXRlY3RlZCwgYnV0IHdlIGRldGVjdGVkIGEgY3VzdG9tIGdlc3R1cmUgY29uZmlnXG4gICAgICAvLyBzZXR1cCwgd2Ugb25seSByZW1vdmUgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAgICBpZiAoaGFzQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gICAgICAgIC8vIFByaW50IGEgbWVzc2FnZSBpZiB3ZSBmb3VuZCBhIGN1c3RvbSBnZXN0dXJlIGNvbmZpZyBzZXR1cCBpbiBjb21iaW5hdGlvbiB3aXRoXG4gICAgICAgIC8vIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuIFRoaXMgaXMgYW1iaWd1b3VzIGFuZCB0aGVcbiAgICAgICAgLy8gbWlncmF0aW9uIGp1c3QgcmVtb3ZlcyB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgc2V0dXAsIGJ1dCB3ZSBzdGlsbCB3YW50XG4gICAgICAgIC8vIHRvIGNyZWF0ZSBhbiBpbmZvcm1hdGlvbiBtZXNzYWdlLlxuICAgICAgICBpZiAodGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5wcmludEluZm8oXG4gICAgICAgICAgICAgICdUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIGNvbXBvbmVudHMgZGV0ZWN0ZWQgdGhhdCBIYW1tZXJKUyBpcycgK1xuICAgICAgICAgICAgICAnbWFudWFsbHkgc2V0IHVwIGluIGNvbWJpbmF0aW9uIHdpdGggcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlICcgK1xuICAgICAgICAgICAgICAnY29uZmlnLiBUaGUgbWlncmF0aW9uIGlzIHVuYWJsZSB0byBwZXJmb3JtIHRoZSBmdWxsIG1pZ3JhdGlvbiBmb3IgdGhpcyB0YXJnZXQsICcgK1xuICAgICAgICAgICAgICAnYnV0IHJlbW92ZWQgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIGRlcHJlY2F0ZWQgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy4nKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlSGFtbWVyU2V0dXAoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZWNvcmQgdGhlIGNoYW5nZXMgY29sbGVjdGVkIGluIHRoZSBpbXBvcnQgbWFuYWdlci4gQ2hhbmdlcyBuZWVkIHRvIGJlIGFwcGxpZWRcbiAgICAvLyBvbmNlIHRoZSBpbXBvcnQgbWFuYWdlciByZWdpc3RlcmVkIGFsbCBpbXBvcnQgbW9kaWZpY2F0aW9ucy4gVGhpcyBhdm9pZHMgY29sbGlzaW9ucy5cbiAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLnJlY29yZENoYW5nZXMoKTtcblxuICAgIC8vIENyZWF0ZSBtaWdyYXRpb24gZmFpbHVyZXMgdGhhdCB3aWxsIGJlIHByaW50ZWQgYnkgdGhlIHVwZGF0ZS10b29sIG9uIG1pZ3JhdGlvblxuICAgIC8vIGNvbXBsZXRpb24uIFdlIG5lZWQgc3BlY2lhbCBsb2dpYyBmb3IgdXBkYXRpbmcgZmFpbHVyZSBwb3NpdGlvbnMgdG8gcmVmbGVjdFxuICAgIC8vIHRoZSBuZXcgc291cmNlIGZpbGUgYWZ0ZXIgbW9kaWZpY2F0aW9ucyBmcm9tIHRoZSBpbXBvcnQgbWFuYWdlci5cbiAgICB0aGlzLmZhaWx1cmVzLnB1c2goLi4udGhpcy5fY3JlYXRlTWlncmF0aW9uRmFpbHVyZXMoKSk7XG5cbiAgICAvLyBUaGUgdGVtcGxhdGUgY2hlY2sgZm9yIEhhbW1lckpTIGV2ZW50cyBpcyBub3QgY29tcGxldGVseSByZWxpYWJsZSBhcyB0aGUgZXZlbnRcbiAgICAvLyBvdXRwdXQgY291bGQgYWxzbyBiZSBmcm9tIGEgY29tcG9uZW50IGhhdmluZyBhbiBvdXRwdXQgbmFtZWQgc2ltaWxhcmx5IHRvIGEga25vd25cbiAgICAvLyBoYW1tZXJqcyBldmVudCAoZS5nLiBcIkBPdXRwdXQoKSBzbGlkZVwiKS4gVGhlIHVzYWdlIGlzIHRoZXJlZm9yZSBzb21ld2hhdCBhbWJpZ3VvdXNcbiAgICAvLyBhbmQgd2Ugd2FudCB0byBwcmludCBhIG1lc3NhZ2UgdGhhdCBkZXZlbG9wZXJzIG1pZ2h0IGJlIGFibGUgdG8gcmVtb3ZlIEhhbW1lciBtYW51YWxseS5cbiAgICBpZiAoIXRoaXMuX3VzZWRJblJ1bnRpbWUgJiYgdGhpcy5fdXNlZEluVGVtcGxhdGUpIHtcbiAgICAgIHRoaXMucHJpbnRJbmZvKGNoYWxrLnllbGxvdyhcbiAgICAgICAgICAnVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBjb21wb25lbnRzIG1pZ3JhdGVkIHRoZSAnICtcbiAgICAgICAgICAncHJvamVjdCB0byBrZWVwIEhhbW1lckpTIGluc3RhbGxlZCwgYnV0IGRldGVjdGVkIGFtYmlndW91cyB1c2FnZSBvZiBIYW1tZXJKUy4gUGxlYXNlICcgK1xuICAgICAgICAgICdtYW51YWxseSBjaGVjayBpZiB5b3UgY2FuIHJlbW92ZSBIYW1tZXJKUyBmcm9tIHlvdXIgYXBwbGljYXRpb24uJykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVwIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWcgaW4gdGhlIGN1cnJlbnQgcHJvamVjdC4gVG8gYWNoaWV2ZSB0aGlzLCB0aGVcbiAgICogZm9sbG93aW5nIHN0ZXBzIGFyZSBwZXJmb3JtZWQ6XG4gICAqICAgMSkgQ3JlYXRlIGNvcHkgb2YgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICogICAyKSBSZXdyaXRlIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIHRvIHRoZVxuICAgKiAgICAgIG5ld2x5IGNvcGllZCBnZXN0dXJlIGNvbmZpZy5cbiAgICogICAzKSBTZXR1cCB0aGUgSEFNTUVSX0dFU1RVUkVfQ09ORklHIHByb3ZpZGVyIGluIHRoZSByb290IGFwcCBtb2R1bGVcbiAgICogICAgICAoaWYgbm90IGRvbmUgYWxyZWFkeSkuXG4gICAqL1xuICBwcml2YXRlIF9zZXR1cEhhbW1lckdlc3R1cmVDb25maWcoKSB7XG4gICAgY29uc3QgcHJvamVjdCA9IHRoaXMuX2dldFByb2plY3RPclRocm93KCk7XG4gICAgY29uc3Qgc291cmNlUm9vdCA9IGRldmtpdE5vcm1hbGl6ZShwcm9qZWN0LnNvdXJjZVJvb3QgfHwgcHJvamVjdC5yb290KTtcbiAgICBjb25zdCBnZXN0dXJlQ29uZmlnUGF0aCA9XG4gICAgICAgIGRldmtpdEpvaW4oc291cmNlUm9vdCwgdGhpcy5fZ2V0QXZhaWxhYmxlR2VzdHVyZUNvbmZpZ0ZpbGVOYW1lKHNvdXJjZVJvb3QpKTtcblxuICAgIC8vIENvcHkgZ2VzdHVyZSBjb25maWcgdGVtcGxhdGUgaW50byB0aGUgQ0xJIHByb2plY3QuXG4gICAgdGhpcy50cmVlLmNyZWF0ZShcbiAgICAgICAgZ2VzdHVyZUNvbmZpZ1BhdGgsIHJlYWRGaWxlU3luYyhyZXF1aXJlLnJlc29sdmUoR0VTVFVSRV9DT05GSUdfVEVNUExBVEVfUEFUSCksICd1dGY4JykpO1xuXG4gICAgLy8gUmVwbGFjZSBhbGwgcmVmZXJlbmNlcyB0byB0aGUgZ2VzdHVyZSBjb25maWcgb2YgTWF0ZXJpYWwuXG4gICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuZm9yRWFjaChcbiAgICAgICAgaSA9PiB0aGlzLl9yZXBsYWNlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZShpLCBnZXN0dXJlQ29uZmlnUGF0aCkpO1xuXG4gICAgLy8gU2V0dXAgdGhlIGdlc3R1cmUgY29uZmlnIHByb3ZpZGVyIGFuZCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpbiB0aGUgcHJvamVjdCBhcHBcbiAgICAvLyBtb2R1bGUgaWYgbm90IGRvbmUgYWxyZWFkeS5cbiAgICB0aGlzLl9zZXR1cEhhbW1lckdlc3R1cmVzSW5BcHBNb2R1bGUocHJvamVjdCwgZ2VzdHVyZUNvbmZpZ1BhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgSGFtbWVyIGZyb20gdGhlIGN1cnJlbnQgcHJvamVjdC4gVGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgcGVyZm9ybWVkOlxuICAgKiAgIDEpIERlbGV0ZSBhbGwgVHlwZVNjcmlwdCBpbXBvcnRzIHRvIFwiaGFtbWVyanNcIi5cbiAgICogICAyKSBSZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICogICAzKSBSZW1vdmUgXCJoYW1tZXJqc1wiIGZyb20gYWxsIGluZGV4IEhUTUwgZmlsZXMgb2YgdGhlIGN1cnJlbnQgcHJvamVjdC5cbiAgICovXG4gIHByaXZhdGUgX3JlbW92ZUhhbW1lclNldHVwKCkge1xuICAgIGNvbnN0IHByb2plY3QgPSB0aGlzLl9nZXRQcm9qZWN0T3JUaHJvdygpO1xuXG4gICAgdGhpcy5faW5zdGFsbEltcG9ydHMuZm9yRWFjaChpID0+IHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlSW1wb3J0QnlEZWNsYXJhdGlvbihpKSk7XG5cbiAgICB0aGlzLl9yZW1vdmVNYXRlcmlhbEdlc3R1cmVDb25maWdTZXR1cCgpO1xuICAgIHRoaXMuX3JlbW92ZUhhbW1lck1vZHVsZVJlZmVyZW5jZXMoKTtcbiAgICB0aGlzLl9yZW1vdmVIYW1tZXJGcm9tSW5kZXhGaWxlKHByb2plY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGdlc3R1cmUgY29uZmlnIHNldHVwIGJ5IGRlbGV0aW5nIGFsbCBmb3VuZCByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyXG4gICAqIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLiBBZGRpdGlvbmFsbHksIHVudXNlZCBpbXBvcnRzIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWdcbiAgICogdG9rZW4gZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIiB3aWxsIGJlIHJlbW92ZWQgYXMgd2VsbC5cbiAgICovXG4gIHByaXZhdGUgX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCkge1xuICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLmZvckVhY2gociA9PiB0aGlzLl9yZW1vdmVHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKHIpKTtcblxuICAgIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5mb3JFYWNoKHIgPT4ge1xuICAgICAgaWYgKHIuaXNJbXBvcnQpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlSGFtbWVyQ29uZmlnVG9rZW5JbXBvcnRJZlVudXNlZChyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuICovXG4gIHByaXZhdGUgX3JlbW92ZUhhbW1lck1vZHVsZVJlZmVyZW5jZXMoKSB7XG4gICAgdGhpcy5faGFtbWVyTW9kdWxlUmVmZXJlbmNlcy5mb3JFYWNoKCh7bm9kZSwgaXNJbXBvcnQsIGltcG9ydERhdGF9KSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZ2V0VXBkYXRlUmVjb3JkZXIoc291cmNlRmlsZS5maWxlTmFtZSk7XG5cbiAgICAgIC8vIE9ubHkgcmVtb3ZlIHRoZSBpbXBvcnQgZm9yIHRoZSBIYW1tZXJNb2R1bGUgaWYgdGhlIG1vZHVsZSBoYXMgYmVlbiBhY2Nlc3NlZFxuICAgICAgLy8gdGhyb3VnaCBhIG5vbi1uYW1lc3BhY2VkIGlkZW50aWZpZXIgYWNjZXNzLlxuICAgICAgaWYgKCFpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGUpKSB7XG4gICAgICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICAgICAgc291cmNlRmlsZSwgSEFNTUVSX01PRFVMRV9OQU1FLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3IgcmVmZXJlbmNlcyBmcm9tIHdpdGhpbiBhbiBpbXBvcnQsIHdlIGRvIG5vdCBuZWVkIHRvIGRvIGFueXRoaW5nIG90aGVyIHRoYW5cbiAgICAgIC8vIHJlbW92aW5nIHRoZSBpbXBvcnQuIEZvciBvdGhlciByZWZlcmVuY2VzLCB3ZSByZW1vdmUgdGhlIGltcG9ydCBhbmQgdGhlIGFjdHVhbFxuICAgICAgLy8gaWRlbnRpZmllciBpbiB0aGUgbW9kdWxlIGltcG9ydHMuXG4gICAgICBpZiAoaXNJbXBvcnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpcyByZWZlcmVuY2VkIHdpdGhpbiBhbiBhcnJheSBsaXRlcmFsLCB3ZSBjYW5cbiAgICAgIC8vIHJlbW92ZSB0aGUgZWxlbWVudCBlYXNpbHkuIE90aGVyd2lzZSBpZiBpdCdzIG91dHNpZGUgb2YgYW4gYXJyYXkgbGl0ZXJhbCxcbiAgICAgIC8vIHdlIG5lZWQgdG8gcmVwbGFjZSB0aGUgcmVmZXJlbmNlIHdpdGggYW4gZW1wdHkgb2JqZWN0IGxpdGVyYWwgdy8gdG9kbyB0b1xuICAgICAgLy8gbm90IGJyZWFrIHRoZSBhcHBsaWNhdGlvbi5cbiAgICAgIGlmICh0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24obm9kZS5wYXJlbnQpKSB7XG4gICAgICAgIC8vIFJlbW92ZXMgdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbSB0aGUgcGFyZW50IGFycmF5IGV4cHJlc3Npb24uIFJlbW92ZXNcbiAgICAgICAgLy8gdGhlIHRyYWlsaW5nIGNvbW1hIHRva2VuIGlmIHByZXNlbnQuXG4gICAgICAgIHJlbW92ZUVsZW1lbnRGcm9tQXJyYXlFeHByZXNzaW9uKG5vZGUsIHJlY29yZGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlY29yZGVyLnJlbW92ZShub2RlLmdldFN0YXJ0KCksIG5vZGUuZ2V0V2lkdGgoKSk7XG4gICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5vZGUuZ2V0U3RhcnQoKSwgYC8qIFRPRE86IHJlbW92ZSAqLyB7fWApO1xuICAgICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7XG4gICAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIGRlbGV0ZSByZWZlcmVuY2UgdG8gXCJIYW1tZXJNb2R1bGVcIi4nLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZ1xuICAgKiB0b2tlbiBmcm9tIHBsYXRmb3JtLWJyb3dzZXIuIElmIHNvLCBrZWVwcyB0cmFjayBvZiB0aGUgcmVmZXJlbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JIYW1tZXJHZXN0dXJlQ29uZmlnVG9rZW4obm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkpIHtcbiAgICAgIGNvbnN0IGltcG9ydERhdGEgPSBnZXRJbXBvcnRPZklkZW50aWZpZXIobm9kZSwgdGhpcy50eXBlQ2hlY2tlcik7XG4gICAgICBpZiAoaW1wb3J0RGF0YSAmJiBpbXBvcnREYXRhLnN5bWJvbE5hbWUgPT09IEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSAmJlxuICAgICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZSA9PT0gSEFNTUVSX0NPTkZJR19UT0tFTl9NT0RVTEUpIHtcbiAgICAgICAgdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnB1c2goXG4gICAgICAgICAgICB7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnQ6IHRzLmlzSW1wb3J0U3BlY2lmaWVyKG5vZGUucGFyZW50KX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIEhhbW1lck1vZHVsZSBmcm9tXG4gICAqIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLiBJZiBzbywga2VlcHMgdHJhY2sgb2YgdGhlIHJlZmVyZW5jZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9ySGFtbWVyTW9kdWxlUmVmZXJlbmNlKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICBjb25zdCBpbXBvcnREYXRhID0gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGUsIHRoaXMudHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKGltcG9ydERhdGEgJiYgaW1wb3J0RGF0YS5zeW1ib2xOYW1lID09PSBIQU1NRVJfTU9EVUxFX05BTUUgJiZcbiAgICAgICAgICBpbXBvcnREYXRhLm1vZHVsZU5hbWUgPT09IEhBTU1FUl9NT0RVTEVfSU1QT1JUKSB7XG4gICAgICAgIHRoaXMuX2hhbW1lck1vZHVsZVJlZmVyZW5jZXMucHVzaChcbiAgICAgICAgICAgIHtub2RlLCBpbXBvcnREYXRhLCBpc0ltcG9ydDogdHMuaXNJbXBvcnRTcGVjaWZpZXIobm9kZS5wYXJlbnQpfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBpcyBhbiBpbXBvcnQgdG8gdGhlIEhhbW1lckpTIHBhY2thZ2UuIEltcG9ydHMgdG9cbiAgICogSGFtbWVySlMgd2hpY2ggbG9hZCBzcGVjaWZpYyBzeW1ib2xzIGZyb20gdGhlIHBhY2thZ2UgYXJlIGNvbnNpZGVyZWQgYXNcbiAgICogcnVudGltZSB1c2FnZSBvZiBIYW1tZXIuIGUuZy4gYGltcG9ydCB7U3ltYm9sfSBmcm9tIFwiaGFtbWVyanNcIjtgLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tIYW1tZXJJbXBvcnRzKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJbXBvcnREZWNsYXJhdGlvbihub2RlKSAmJiB0cy5pc1N0cmluZ0xpdGVyYWwobm9kZS5tb2R1bGVTcGVjaWZpZXIpICYmXG4gICAgICAgIG5vZGUubW9kdWxlU3BlY2lmaWVyLnRleHQgPT09IEhBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSKSB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBhbiBpbXBvcnQgdG8gSGFtbWVySlMgdGhhdCBpbXBvcnRzIHN5bWJvbHMsIG9yIGlzIG5hbWVzcGFjZWRcbiAgICAgIC8vIChlLmcuIFwiaW1wb3J0IHtBLCBCfSBmcm9tIC4uLlwiIG9yIFwiaW1wb3J0ICogYXMgaGFtbWVyIGZyb20gLi4uXCIpLCB0aGVuIHdlXG4gICAgICAvLyBhc3N1bWUgdGhhdCBzb21lIGV4cG9ydHMgYXJlIHVzZWQgYXQgcnVudGltZS5cbiAgICAgIGlmIChub2RlLmltcG9ydENsYXVzZSAmJlxuICAgICAgICAgICEobm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncyAmJiB0cy5pc05hbWVkSW1wb3J0cyhub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSAmJlxuICAgICAgICAgICAgbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cy5sZW5ndGggPT09IDApKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5faW5zdGFsbEltcG9ydHMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGFjY2Vzc2VzIHRoZSBnbG9iYWwgXCJIYW1tZXJcIiBzeW1ib2wgYXQgcnVudGltZS4gSWYgc28sXG4gICAqIHRoZSBtaWdyYXRpb24gcnVsZSBzdGF0ZSB3aWxsIGJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGF0IEhhbW1lciBpcyB1c2VkIGF0IHJ1bnRpbWUuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0ZvclJ1bnRpbWVIYW1tZXJVc2FnZShub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRoaXMuX3VzZWRJblJ1bnRpbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZXRlY3RzIHVzYWdlcyBvZiBcIndpbmRvdy5IYW1tZXJcIi5cbiAgICBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZSkgJiYgbm9kZS5uYW1lLnRleHQgPT09ICdIYW1tZXInKSB7XG4gICAgICBjb25zdCBvcmlnaW5FeHByID0gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihvcmlnaW5FeHByKSAmJiBvcmlnaW5FeHByLnRleHQgPT09ICd3aW5kb3cnKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIERldGVjdHMgdXNhZ2VzIG9mIFwid2luZG93WydIYW1tZXInXVwiLlxuICAgIGlmICh0cy5pc0VsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKG5vZGUpICYmIHRzLmlzU3RyaW5nTGl0ZXJhbChub2RlLmFyZ3VtZW50RXhwcmVzc2lvbikgJiZcbiAgICAgICAgbm9kZS5hcmd1bWVudEV4cHJlc3Npb24udGV4dCA9PT0gJ0hhbW1lcicpIHtcbiAgICAgIGNvbnN0IG9yaWdpbkV4cHIgPSB1bndyYXBFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gICAgICBpZiAodHMuaXNJZGVudGlmaWVyKG9yaWdpbkV4cHIpICYmIG9yaWdpbkV4cHIudGV4dCA9PT0gJ3dpbmRvdycpIHtcbiAgICAgICAgdGhpcy5fdXNlZEluUnVudGltZSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlcyB1c2FnZXMgb2YgcGxhaW4gaWRlbnRpZmllciB3aXRoIHRoZSBuYW1lIFwiSGFtbWVyXCIuIFRoZXNlIHVzYWdlXG4gICAgLy8gYXJlIHZhbGlkIGlmIHRoZXkgcmVzb2x2ZSB0byBcIkB0eXBlcy9oYW1tZXJqc1wiLiBlLmcuIFwibmV3IEhhbW1lcihteUVsZW1lbnQpXCIuXG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSAmJiBub2RlLnRleHQgPT09ICdIYW1tZXInICYmXG4gICAgICAgICF0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLnBhcmVudCkgJiYgIXRzLmlzRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24obm9kZS5wYXJlbnQpKSB7XG4gICAgICBjb25zdCBzeW1ib2wgPSB0aGlzLl9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlKTtcbiAgICAgIGlmIChzeW1ib2wgJiYgc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24gJiZcbiAgICAgICAgICBzeW1ib2wudmFsdWVEZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUuaW5jbHVkZXMoJ0B0eXBlcy9oYW1tZXJqcycpKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgcmVmZXJlbmNlcyB0aGUgZ2VzdHVyZSBjb25maWcgZnJvbSBBbmd1bGFyIE1hdGVyaWFsLlxuICAgKiBJZiBzbywgd2Uga2VlcCB0cmFjayBvZiB0aGUgZm91bmQgc3ltYm9sIHJlZmVyZW5jZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9yTWF0ZXJpYWxHZXN0dXJlQ29uZmlnKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICBjb25zdCBpbXBvcnREYXRhID0gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGUsIHRoaXMudHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKGltcG9ydERhdGEgJiYgaW1wb3J0RGF0YS5zeW1ib2xOYW1lID09PSBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FICYmXG4gICAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lLnN0YXJ0c1dpdGgoJ0Bhbmd1bGFyL21hdGVyaWFsLycpKSB7XG4gICAgICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLnB1c2goXG4gICAgICAgICAgICB7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnQ6IHRzLmlzSW1wb3J0U3BlY2lmaWVyKG5vZGUucGFyZW50KX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIEhhbW1lciBnZXN0dXJlIGNvbmZpZyB0b2tlbiByZWZlcmVuY2UgaXMgcGFydCBvZiBhblxuICAgKiBBbmd1bGFyIHByb3ZpZGVyIGRlZmluaXRpb24gdGhhdCBzZXRzIHVwIGEgY3VzdG9tIGdlc3R1cmUgY29uZmlnLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAodG9rZW5SZWY6IElkZW50aWZpZXJSZWZlcmVuY2UpOiBib29sZWFuIHtcbiAgICAvLyBXYWxrIHVwIHRoZSB0cmVlIHRvIGxvb2sgZm9yIGEgcGFyZW50IHByb3BlcnR5IGFzc2lnbm1lbnQgb2YgdGhlXG4gICAgLy8gcmVmZXJlbmNlIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWcgdG9rZW4uXG4gICAgbGV0IHByb3BlcnR5QXNzaWdubWVudDogdHMuTm9kZSA9IHRva2VuUmVmLm5vZGU7XG4gICAgd2hpbGUgKHByb3BlcnR5QXNzaWdubWVudCAmJiAhdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcGVydHlBc3NpZ25tZW50KSkge1xuICAgICAgcHJvcGVydHlBc3NpZ25tZW50ID0gcHJvcGVydHlBc3NpZ25tZW50LnBhcmVudDtcbiAgICB9XG5cbiAgICBpZiAoIXByb3BlcnR5QXNzaWdubWVudCB8fCAhdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcGVydHlBc3NpZ25tZW50KSB8fFxuICAgICAgICBnZXRQcm9wZXJ0eU5hbWVUZXh0KHByb3BlcnR5QXNzaWdubWVudC5uYW1lKSAhPT0gJ3Byb3ZpZGUnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgb2JqZWN0TGl0ZXJhbEV4cHIgPSBwcm9wZXJ0eUFzc2lnbm1lbnQucGFyZW50O1xuICAgIGNvbnN0IG1hdGNoaW5nSWRlbnRpZmllcnMgPSBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzKG9iamVjdExpdGVyYWxFeHByLCB0cy5pc0lkZW50aWZpZXIpO1xuXG4gICAgLy8gV2UgbmFpdmVseSBhc3N1bWUgdGhhdCBpZiB0aGVyZSBpcyBhIHJlZmVyZW5jZSB0byB0aGUgXCJHZXN0dXJlQ29uZmlnXCIgZXhwb3J0XG4gICAgLy8gZnJvbSBBbmd1bGFyIE1hdGVyaWFsIGluIHRoZSBwcm92aWRlciBsaXRlcmFsLCB0aGF0IHRoZSBwcm92aWRlciBzZXRzIHVwIHRoZVxuICAgIC8vIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAgcmV0dXJuICF0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5zb21lKHIgPT4gbWF0Y2hpbmdJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGFuIGF2YWlsYWJsZSBmaWxlIG5hbWUgZm9yIHRoZSBnZXN0dXJlIGNvbmZpZyB3aGljaCBzaG91bGRcbiAgICogYmUgc3RvcmVkIGluIHRoZSBzcGVjaWZpZWQgZmlsZSBwYXRoLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0QXZhaWxhYmxlR2VzdHVyZUNvbmZpZ0ZpbGVOYW1lKHNvdXJjZVJvb3Q6IERldmtpdFBhdGgpIHtcbiAgICBpZiAoIXRoaXMudHJlZS5leGlzdHMoZGV2a2l0Sm9pbihzb3VyY2VSb290LCBgJHtHRVNUVVJFX0NPTkZJR19GSUxFX05BTUV9LnRzYCkpKSB7XG4gICAgICByZXR1cm4gYCR7R0VTVFVSRV9DT05GSUdfRklMRV9OQU1FfS50c2A7XG4gICAgfVxuXG4gICAgbGV0IHBvc3NpYmxlTmFtZSA9IGAke0dFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRX0tYDtcbiAgICBsZXQgaW5kZXggPSAxO1xuICAgIHdoaWxlICh0aGlzLnRyZWUuZXhpc3RzKGRldmtpdEpvaW4oc291cmNlUm9vdCwgYCR7cG9zc2libGVOYW1lfS0ke2luZGV4fS50c2ApKSkge1xuICAgICAgaW5kZXgrKztcbiAgICB9XG4gICAgcmV0dXJuIGAke3Bvc3NpYmxlTmFtZSArIGluZGV4fS50c2A7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZXMgYSBnaXZlbiBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2UgYnkgZW5zdXJpbmcgdGhhdCBpdCBpcyBpbXBvcnRlZFxuICAgKiBmcm9tIHRoZSBuZXcgc3BlY2lmaWVkIHBhdGguXG4gICAqL1xuICBwcml2YXRlIF9yZXBsYWNlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZShcbiAgICAgIHtub2RlLCBpbXBvcnREYXRhLCBpc0ltcG9ydH06IElkZW50aWZpZXJSZWZlcmVuY2UsIG5ld1BhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZ2V0VXBkYXRlUmVjb3JkZXIoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgY29uc3QgbmV3TW9kdWxlU3BlY2lmaWVyID0gZ2V0TW9kdWxlU3BlY2lmaWVyKG5ld1BhdGgsIHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuXG4gICAgLy8gTGlzdCBvZiBhbGwgaWRlbnRpZmllcnMgcmVmZXJyaW5nIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgY3VycmVudCBmaWxlLiBUaGlzXG4gICAgLy8gYWxsb3dzIHVzIHRvIGFkZCBhbiBpbXBvcnQgZm9yIHRoZSBjb3BpZWQgZ2VzdHVyZSBjb25maWd1cmF0aW9uIHdpdGhvdXQgZ2VuZXJhdGluZyBhXG4gICAgLy8gbmV3IGlkZW50aWZpZXIgZm9yIHRoZSBpbXBvcnQgdG8gYXZvaWQgY29sbGlzaW9ucy4gaS5lLiBcIkdlc3R1cmVDb25maWdfMVwiLiBUaGUgaW1wb3J0XG4gICAgLy8gbWFuYWdlciBjaGVja3MgZm9yIHBvc3NpYmxlIG5hbWUgY29sbGlzaW9ucywgYnV0IGlzIGFibGUgdG8gaWdub3JlIHNwZWNpZmljIGlkZW50aWZpZXJzLlxuICAgIC8vIFdlIHVzZSB0aGlzIHRvIGlnbm9yZSBhbGwgcmVmZXJlbmNlcyB0byB0aGUgb3JpZ2luYWwgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyxcbiAgICAvLyBiZWNhdXNlIHRoZXNlIHdpbGwgYmUgcmVwbGFjZWQgYW5kIHRoZXJlZm9yZSB3aWxsIG5vdCBpbnRlcmZlcmUuXG4gICAgY29uc3QgZ2VzdHVyZUlkZW50aWZpZXJzSW5GaWxlID0gdGhpcy5fZ2V0R2VzdHVyZUNvbmZpZ0lkZW50aWZpZXJzT2ZGaWxlKHNvdXJjZUZpbGUpO1xuXG4gICAgLy8gSWYgdGhlIHBhcmVudCBvZiB0aGUgaWRlbnRpZmllciBpcyBhY2Nlc3NlZCB0aHJvdWdoIGEgbmFtZXNwYWNlLCB3ZSBjYW4ganVzdFxuICAgIC8vIGltcG9ydCB0aGUgbmV3IGdlc3R1cmUgY29uZmlnIHdpdGhvdXQgcmV3cml0aW5nIHRoZSBpbXBvcnQgZGVjbGFyYXRpb24gYmVjYXVzZVxuICAgIC8vIHRoZSBjb25maWcgaGFzIGJlZW4gaW1wb3J0ZWQgdGhyb3VnaCBhIG5hbWVzcGFjZWQgaW1wb3J0LlxuICAgIGlmIChpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGUpKSB7XG4gICAgICBjb25zdCBuZXdFeHByZXNzaW9uID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgICAgc291cmNlRmlsZSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSwgbmV3TW9kdWxlU3BlY2lmaWVyLCBmYWxzZSxcbiAgICAgICAgICBnZXN0dXJlSWRlbnRpZmllcnNJbkZpbGUpO1xuXG4gICAgICByZWNvcmRlci5yZW1vdmUobm9kZS5wYXJlbnQuZ2V0U3RhcnQoKSwgbm9kZS5wYXJlbnQuZ2V0V2lkdGgoKSk7XG4gICAgICByZWNvcmRlci5pbnNlcnRSaWdodChub2RlLnBhcmVudC5nZXRTdGFydCgpLCB0aGlzLl9wcmludE5vZGUobmV3RXhwcmVzc2lvbiwgc291cmNlRmlsZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIERlbGV0ZSB0aGUgb2xkIGltcG9ydCB0byB0aGUgXCJHZXN0dXJlQ29uZmlnXCIuXG4gICAgdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoXG4gICAgICAgIHNvdXJjZUZpbGUsIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsIGltcG9ydERhdGEubW9kdWxlTmFtZSk7XG5cbiAgICAvLyBJZiB0aGUgY3VycmVudCByZWZlcmVuY2UgaXMgbm90IGZyb20gaW5zaWRlIG9mIGEgaW1wb3J0LCB3ZSBuZWVkIHRvIGFkZCBhIG5ld1xuICAgIC8vIGltcG9ydCB0byB0aGUgY29waWVkIGdlc3R1cmUgY29uZmlnIGFuZCByZXBsYWNlIHRoZSBpZGVudGlmaWVyLiBGb3IgcmVmZXJlbmNlc1xuICAgIC8vIHdpdGhpbiBhbiBpbXBvcnQsIHdlIGRvIG5vdGhpbmcgYnV0IHJlbW92aW5nIHRoZSBhY3R1YWwgaW1wb3J0LiBUaGlzIGFsbG93cyB1c1xuICAgIC8vIHRvIHJlbW92ZSB1bnVzZWQgaW1wb3J0cyB0byB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAgaWYgKCFpc0ltcG9ydCkge1xuICAgICAgY29uc3QgbmV3RXhwcmVzc2lvbiA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICAgIHNvdXJjZUZpbGUsIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsIG5ld01vZHVsZVNwZWNpZmllciwgZmFsc2UsXG4gICAgICAgICAgZ2VzdHVyZUlkZW50aWZpZXJzSW5GaWxlKTtcblxuICAgICAgcmVjb3JkZXIucmVtb3ZlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpKTtcbiAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5vZGUuZ2V0U3RhcnQoKSwgdGhpcy5fcHJpbnROb2RlKG5ld0V4cHJlc3Npb24sIHNvdXJjZUZpbGUpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGdpdmVuIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZSBhbmQgaXRzIGNvcnJlc3BvbmRpbmcgaW1wb3J0IGZyb21cbiAgICogaXRzIGNvbnRhaW5pbmcgc291cmNlIGZpbGUuIEltcG9ydHMgd2lsbCBiZSBhbHdheXMgcmVtb3ZlZCwgYnV0IGluIHNvbWUgY2FzZXMsXG4gICAqIHdoZXJlIGl0J3Mgbm90IGd1YXJhbnRlZWQgdGhhdCBhIHJlbW92YWwgY2FuIGJlIHBlcmZvcm1lZCBzYWZlbHksIHdlIGp1c3RcbiAgICogY3JlYXRlIGEgbWlncmF0aW9uIGZhaWx1cmUgKGFuZCBhZGQgYSBUT0RPIGlmIHBvc3NpYmxlKS5cbiAgICovXG4gIHByaXZhdGUgX3JlbW92ZUdlc3R1cmVDb25maWdSZWZlcmVuY2Uoe25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0fTogSWRlbnRpZmllclJlZmVyZW5jZSkge1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZ2V0VXBkYXRlUmVjb3JkZXIoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgLy8gT25seSByZW1vdmUgdGhlIGltcG9ydCBmb3IgdGhlIGdlc3R1cmUgY29uZmlnIGlmIHRoZSBnZXN0dXJlIGNvbmZpZyBoYXNcbiAgICAvLyBiZWVuIGFjY2Vzc2VkIHRocm91Z2ggYSBub24tbmFtZXNwYWNlZCBpZGVudGlmaWVyIGFjY2Vzcy5cbiAgICBpZiAoIWlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZSkpIHtcbiAgICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICAgIHNvdXJjZUZpbGUsIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsIGltcG9ydERhdGEubW9kdWxlTmFtZSk7XG4gICAgfVxuXG4gICAgLy8gRm9yIHJlZmVyZW5jZXMgZnJvbSB3aXRoaW4gYW4gaW1wb3J0LCB3ZSBkbyBub3QgbmVlZCB0byBkbyBhbnl0aGluZyBvdGhlciB0aGFuXG4gICAgLy8gcmVtb3ZpbmcgdGhlIGltcG9ydC4gRm9yIG90aGVyIHJlZmVyZW5jZXMsIHdlIHJlbW92ZSB0aGUgaW1wb3J0IGFuZCB0aGUgcmVmZXJlbmNlXG4gICAgLy8gaWRlbnRpZmllciBpZiB1c2VkIGluc2lkZSBvZiBhIHByb3ZpZGVyIGRlZmluaXRpb24uXG4gICAgaWYgKGlzSW1wb3J0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdmlkZXJBc3NpZ25tZW50ID0gbm9kZS5wYXJlbnQ7XG5cbiAgICAvLyBPbmx5IHJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyB3aGljaCBhcmUgcGFydCBvZiBhIHN0YXRpY2FsbHlcbiAgICAvLyBhbmFseXphYmxlIHByb3ZpZGVyIGRlZmluaXRpb24uIFdlIG9ubHkgc3VwcG9ydCB0aGUgY29tbW9uIGNhc2Ugb2YgYSBnZXN0dXJlXG4gICAgLy8gY29uZmlnIHByb3ZpZGVyIGRlZmluaXRpb24gd2hlcmUgdGhlIGNvbmZpZyBpcyBzZXQgdXAgdGhyb3VnaCBcInVzZUNsYXNzXCIuXG4gICAgLy8gT3RoZXJ3aXNlLCBpdCdzIG5vdCBndWFyYW50ZWVkIHRoYXQgd2UgY2FuIHNhZmVseSByZW1vdmUgdGhlIHByb3ZpZGVyIGRlZmluaXRpb24uXG4gICAgaWYgKCF0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwcm92aWRlckFzc2lnbm1lbnQpIHx8XG4gICAgICAgIGdldFByb3BlcnR5TmFtZVRleHQocHJvdmlkZXJBc3NpZ25tZW50Lm5hbWUpICE9PSAndXNlQ2xhc3MnKSB7XG4gICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7bm9kZSwgbWVzc2FnZTogQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1J9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvYmplY3RMaXRlcmFsRXhwciA9IHByb3ZpZGVyQXNzaWdubWVudC5wYXJlbnQ7XG4gICAgY29uc3QgcHJvdmlkZVRva2VuID0gb2JqZWN0TGl0ZXJhbEV4cHIucHJvcGVydGllcy5maW5kKFxuICAgICAgICAocCk6IHAgaXMgdHMuUHJvcGVydHlBc3NpZ25tZW50ID0+XG4gICAgICAgICAgICB0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwKSAmJiBnZXRQcm9wZXJ0eU5hbWVUZXh0KHAubmFtZSkgPT09ICdwcm92aWRlJyk7XG5cbiAgICAvLyBEbyBub3QgcmVtb3ZlIHRoZSByZWZlcmVuY2UgaWYgdGhlIGdlc3R1cmUgY29uZmlnIGlzIG5vdCBwYXJ0IG9mIGEgcHJvdmlkZXIgZGVmaW5pdGlvbixcbiAgICAvLyBvciBpZiB0aGUgcHJvdmlkZWQgdG9rZSBpcyBub3QgcmVmZXJyaW5nIHRvIHRoZSBrbm93biBIQU1NRVJfR0VTVFVSRV9DT05GSUcgdG9rZW5cbiAgICAvLyBmcm9tIHBsYXRmb3JtLWJyb3dzZXIuXG4gICAgaWYgKCFwcm92aWRlVG9rZW4gfHwgIXRoaXMuX2lzUmVmZXJlbmNlVG9IYW1tZXJDb25maWdUb2tlbihwcm92aWRlVG9rZW4uaW5pdGlhbGl6ZXIpKSB7XG4gICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7bm9kZSwgbWVzc2FnZTogQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1J9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDb2xsZWN0IGFsbCBuZXN0ZWQgaWRlbnRpZmllcnMgd2hpY2ggd2lsbCBiZSBkZWxldGVkLiBUaGlzIGhlbHBzIHVzXG4gICAgLy8gZGV0ZXJtaW5pbmcgaWYgd2UgY2FuIHJlbW92ZSBpbXBvcnRzIGZvciB0aGUgXCJIQU1NRVJfR0VTVFVSRV9DT05GSUdcIiB0b2tlbi5cbiAgICB0aGlzLl9kZWxldGVkSWRlbnRpZmllcnMucHVzaCguLi5maW5kTWF0Y2hpbmdDaGlsZE5vZGVzKG9iamVjdExpdGVyYWxFeHByLCB0cy5pc0lkZW50aWZpZXIpKTtcblxuICAgIC8vIEluIGNhc2UgdGhlIGZvdW5kIHByb3ZpZGVyIGRlZmluaXRpb24gaXMgbm90IHBhcnQgb2YgYW4gYXJyYXkgbGl0ZXJhbCxcbiAgICAvLyB3ZSBjYW5ub3Qgc2FmZWx5IHJlbW92ZSB0aGUgcHJvdmlkZXIuIFRoaXMgaXMgYmVjYXVzZSBpdCBjb3VsZCBiZSBkZWNsYXJlZFxuICAgIC8vIGFzIGEgdmFyaWFibGUuIGUuZy4gXCJjb25zdCBnZXN0dXJlUHJvdmlkZXIgPSB7cHJvdmlkZTogLi4sIHVzZUNsYXNzOiBHZXN0dXJlQ29uZmlnfVwiLlxuICAgIC8vIEluIHRoYXQgY2FzZSwgd2UganVzdCBhZGQgYW4gZW1wdHkgb2JqZWN0IGxpdGVyYWwgd2l0aCBUT0RPIGFuZCBwcmludCBhIGZhaWx1cmUuXG4gICAgaWYgKCF0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24ob2JqZWN0TGl0ZXJhbEV4cHIucGFyZW50KSkge1xuICAgICAgcmVjb3JkZXIucmVtb3ZlKG9iamVjdExpdGVyYWxFeHByLmdldFN0YXJ0KCksIG9iamVjdExpdGVyYWxFeHByLmdldFdpZHRoKCkpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQob2JqZWN0TGl0ZXJhbEV4cHIuZ2V0U3RhcnQoKSwgYC8qIFRPRE86IHJlbW92ZSAqLyB7fWApO1xuICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe1xuICAgICAgICBub2RlOiBvYmplY3RMaXRlcmFsRXhwcixcbiAgICAgICAgbWVzc2FnZTogYFVuYWJsZSB0byBkZWxldGUgcHJvdmlkZXIgZGVmaW5pdGlvbiBmb3IgXCJHZXN0dXJlQ29uZmlnXCIgY29tcGxldGVseS4gYCArXG4gICAgICAgICAgICBgUGxlYXNlIGNsZWFuIHVwIHRoZSBwcm92aWRlci5gXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmVzIHRoZSBvYmplY3QgbGl0ZXJhbCBmcm9tIHRoZSBwYXJlbnQgYXJyYXkgZXhwcmVzc2lvbi4gUmVtb3Zlc1xuICAgIC8vIHRoZSB0cmFpbGluZyBjb21tYSB0b2tlbiBpZiBwcmVzZW50LlxuICAgIHJlbW92ZUVsZW1lbnRGcm9tQXJyYXlFeHByZXNzaW9uKG9iamVjdExpdGVyYWxFeHByLCByZWNvcmRlcik7XG4gIH1cblxuICAvKiogUmVtb3ZlcyB0aGUgZ2l2ZW4gaGFtbWVyIGNvbmZpZyB0b2tlbiBpbXBvcnQgaWYgaXQgaXMgbm90IHVzZWQuICovXG4gIHByaXZhdGUgX3JlbW92ZUhhbW1lckNvbmZpZ1Rva2VuSW1wb3J0SWZVbnVzZWQoe25vZGUsIGltcG9ydERhdGF9OiBJZGVudGlmaWVyUmVmZXJlbmNlKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IGlzVG9rZW5Vc2VkID0gdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUoXG4gICAgICAgIHIgPT4gIXIuaXNJbXBvcnQgJiYgIWlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Moci5ub2RlKSAmJlxuICAgICAgICAgICAgci5ub2RlLmdldFNvdXJjZUZpbGUoKSA9PT0gc291cmNlRmlsZSAmJiAhdGhpcy5fZGVsZXRlZElkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpO1xuXG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB0byByZW1vdmUgdGhlIGltcG9ydCBmb3IgdGhlIHRva2VuIGlmIHRoZSB0b2tlbiBpc1xuICAgIC8vIHN0aWxsIHVzZWQgc29tZXdoZXJlLlxuICAgIGlmICghaXNUb2tlblVzZWQpIHtcbiAgICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICAgIHNvdXJjZUZpbGUsIEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVtb3ZlcyBIYW1tZXIgZnJvbSBhbGwgaW5kZXggSFRNTCBmaWxlcyBvZiB0aGUgZ2l2ZW4gcHJvamVjdC4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyRnJvbUluZGV4RmlsZShwcm9qZWN0OiBXb3Jrc3BhY2VQcm9qZWN0KSB7XG4gICAgY29uc3QgaW5kZXhGaWxlUGF0aHMgPSBnZXRQcm9qZWN0SW5kZXhGaWxlcyhwcm9qZWN0KTtcbiAgICBpbmRleEZpbGVQYXRocy5mb3JFYWNoKGZpbGVQYXRoID0+IHtcbiAgICAgIGlmICghdGhpcy50cmVlLmV4aXN0cyhmaWxlUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBodG1sQ29udGVudCA9IHRoaXMudHJlZS5yZWFkKGZpbGVQYXRoKSEudG9TdHJpbmcoJ3V0ZjgnKTtcbiAgICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5nZXRVcGRhdGVSZWNvcmRlcihmaWxlUGF0aCk7XG5cbiAgICAgIGZpbmRIYW1tZXJTY3JpcHRJbXBvcnRFbGVtZW50cyhodG1sQ29udGVudClcbiAgICAgICAgICAuZm9yRWFjaChlbCA9PiByZW1vdmVFbGVtZW50RnJvbUh0bWwoZWwsIHJlY29yZGVyKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogU2V0cyB1cCB0aGUgSGFtbWVyIGdlc3R1cmUgY29uZmlnIHByb3ZpZGVyIGluIHRoZSBhcHAgbW9kdWxlIGlmIG5lZWRlZC4gKi9cbiAgcHJpdmF0ZSBfc2V0dXBIYW1tZXJHZXN0dXJlc0luQXBwTW9kdWxlKHByb2plY3Q6IFdvcmtzcGFjZVByb2plY3QsIGdlc3R1cmVDb25maWdQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYWluRmlsZVBhdGggPSBqb2luKHRoaXMuYmFzZVBhdGgsIGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KSk7XG4gICAgY29uc3QgbWFpbkZpbGUgPSB0aGlzLnByb2dyYW0uZ2V0U291cmNlRmlsZShtYWluRmlsZVBhdGgpO1xuICAgIGlmICghbWFpbkZpbGUpIHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiBtYWluRmlsZVBhdGgsXG4gICAgICAgIG1lc3NhZ2U6IENBTk5PVF9TRVRVUF9BUFBfTU9EVUxFX0VSUk9SLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYXBwTW9kdWxlRXhwciA9IGZpbmRNYWluTW9kdWxlRXhwcmVzc2lvbihtYWluRmlsZSk7XG4gICAgaWYgKCFhcHBNb2R1bGVFeHByKSB7XG4gICAgICB0aGlzLmZhaWx1cmVzLnB1c2goe1xuICAgICAgICBmaWxlUGF0aDogbWFpbkZpbGVQYXRoLFxuICAgICAgICBtZXNzYWdlOiBDQU5OT1RfU0VUVVBfQVBQX01PRFVMRV9FUlJPUixcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFwcE1vZHVsZVN5bWJvbCA9IHRoaXMuX2dldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKHVud3JhcEV4cHJlc3Npb24oYXBwTW9kdWxlRXhwcikpO1xuICAgIGlmICghYXBwTW9kdWxlU3ltYm9sIHx8ICFhcHBNb2R1bGVTeW1ib2wudmFsdWVEZWNsYXJhdGlvbikge1xuICAgICAgdGhpcy5mYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgZmlsZVBhdGg6IG1haW5GaWxlUGF0aCxcbiAgICAgICAgbWVzc2FnZTogQ0FOTk9UX1NFVFVQX0FQUF9NT0RVTEVfRVJST1IsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VGaWxlID0gYXBwTW9kdWxlU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHRoaXMuYmFzZVBhdGgsIHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IGhhbW1lck1vZHVsZUV4cHIgPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgc291cmNlRmlsZSwgSEFNTUVSX01PRFVMRV9OQU1FLCBIQU1NRVJfTU9EVUxFX0lNUE9SVCk7XG4gICAgY29uc3QgaGFtbWVyQ29uZmlnVG9rZW5FeHByID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgIHNvdXJjZUZpbGUsIEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSwgSEFNTUVSX0NPTkZJR19UT0tFTl9NT0RVTEUpO1xuICAgIGNvbnN0IGdlc3R1cmVDb25maWdFeHByID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgIHNvdXJjZUZpbGUsIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsXG4gICAgICAgIGdldE1vZHVsZVNwZWNpZmllcihnZXN0dXJlQ29uZmlnUGF0aCwgc291cmNlRmlsZS5maWxlTmFtZSksIGZhbHNlLFxuICAgICAgICB0aGlzLl9nZXRHZXN0dXJlQ29uZmlnSWRlbnRpZmllcnNPZkZpbGUoc291cmNlRmlsZSkpO1xuXG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IG5ld1Byb3ZpZGVyTm9kZSA9IHRzLmNyZWF0ZU9iamVjdExpdGVyYWwoW1xuICAgICAgdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KCdwcm92aWRlJywgaGFtbWVyQ29uZmlnVG9rZW5FeHByKSxcbiAgICAgIHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgndXNlQ2xhc3MnLCBnZXN0dXJlQ29uZmlnRXhwcilcbiAgICBdKTtcblxuICAgIC8vIElmIG5vIFwiTmdNb2R1bGVcIiBkZWZpbml0aW9uIGlzIGZvdW5kIGluc2lkZSB0aGUgc291cmNlIGZpbGUsIHdlIGp1c3QgZG8gbm90aGluZy5cbiAgICBjb25zdCBtZXRhZGF0YSA9IGdldERlY29yYXRvck1ldGFkYXRhKHNvdXJjZUZpbGUsICdOZ01vZHVsZScsICdAYW5ndWxhci9jb3JlJykgYXNcbiAgICAgICAgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25bXTtcbiAgICBpZiAoIW1ldGFkYXRhLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3ZpZGVyc0ZpZWxkID0gZ2V0TWV0YWRhdGFGaWVsZChtZXRhZGF0YVswXSwgJ3Byb3ZpZGVycycpWzBdO1xuICAgIGNvbnN0IGltcG9ydHNGaWVsZCA9IGdldE1ldGFkYXRhRmllbGQobWV0YWRhdGFbMF0sICdpbXBvcnRzJylbMF07XG5cbiAgICBjb25zdCBwcm92aWRlcklkZW50aWZpZXJzID1cbiAgICAgICAgcHJvdmlkZXJzRmllbGQgPyBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzKHByb3ZpZGVyc0ZpZWxkLCB0cy5pc0lkZW50aWZpZXIpIDogbnVsbDtcbiAgICBjb25zdCBpbXBvcnRJZGVudGlmaWVycyA9XG4gICAgICAgIGltcG9ydHNGaWVsZCA/IGZpbmRNYXRjaGluZ0NoaWxkTm9kZXMoaW1wb3J0c0ZpZWxkLCB0cy5pc0lkZW50aWZpZXIpIDogbnVsbDtcbiAgICBjb25zdCBjaGFuZ2VBY3Rpb25zOiBDaGFuZ2VbXSA9IFtdO1xuXG4gICAgLy8gSWYgdGhlIHByb3ZpZGVycyBmaWVsZCBleGlzdHMgYW5kIGFscmVhZHkgY29udGFpbnMgcmVmZXJlbmNlcyB0byB0aGUgaGFtbWVyIGdlc3R1cmVcbiAgICAvLyBjb25maWcgdG9rZW4gYW5kIHRoZSBnZXN0dXJlIGNvbmZpZywgd2UgbmFpdmVseSBhc3N1bWUgdGhhdCB0aGUgZ2VzdHVyZSBjb25maWcgaXNcbiAgICAvLyBhbHJlYWR5IHNldCB1cC4gV2Ugb25seSB3YW50IHRvIGFkZCB0aGUgZ2VzdHVyZSBjb25maWcgcHJvdmlkZXIgaWYgaXQgaXMgbm90IHNldCB1cC5cbiAgICBpZiAoIXByb3ZpZGVySWRlbnRpZmllcnMgfHxcbiAgICAgICAgISh0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHByb3ZpZGVySWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSkgJiZcbiAgICAgICAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5zb21lKHIgPT4gcHJvdmlkZXJJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKSkpIHtcbiAgICAgIGNoYW5nZUFjdGlvbnMucHVzaCguLi5hZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEoXG4gICAgICAgICAgc291cmNlRmlsZSwgcmVsYXRpdmVQYXRoLCAncHJvdmlkZXJzJywgdGhpcy5fcHJpbnROb2RlKG5ld1Byb3ZpZGVyTm9kZSwgc291cmNlRmlsZSksXG4gICAgICAgICAgbnVsbCkpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBcIkhhbW1lck1vZHVsZVwiIGlzIG5vdCBhbHJlYWR5IGltcG9ydGVkIGluIHRoZSBhcHAgbW9kdWxlLCB3ZSBzZXQgaXQgdXBcbiAgICAvLyBieSBhZGRpbmcgaXQgdG8gdGhlIFwiaW1wb3J0c1wiIGZpZWxkLlxuICAgIGlmICghaW1wb3J0SWRlbnRpZmllcnMgfHxcbiAgICAgICAgIXRoaXMuX2hhbW1lck1vZHVsZVJlZmVyZW5jZXMuc29tZShyID0+IGltcG9ydElkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpKSB7XG4gICAgICBjaGFuZ2VBY3Rpb25zLnB1c2goLi4uYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhKFxuICAgICAgICAgIHNvdXJjZUZpbGUsIHJlbGF0aXZlUGF0aCwgJ2ltcG9ydHMnLCB0aGlzLl9wcmludE5vZGUoaGFtbWVyTW9kdWxlRXhwciwgc291cmNlRmlsZSksXG4gICAgICAgICAgbnVsbCkpO1xuICAgIH1cblxuICAgIGNoYW5nZUFjdGlvbnMuZm9yRWFjaChjaGFuZ2UgPT4ge1xuICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICByZWNvcmRlci5pbnNlcnRSaWdodChjaGFuZ2UucG9zLCBjaGFuZ2UudG9BZGQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIFByaW50cyBhIGdpdmVuIG5vZGUgd2l0aGluIHRoZSBzcGVjaWZpZWQgc291cmNlIGZpbGUuICovXG4gIHByaXZhdGUgX3ByaW50Tm9kZShub2RlOiB0cy5Ob2RlLCBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcHJpbnRlci5wcmludE5vZGUodHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsIG5vZGUsIHNvdXJjZUZpbGUpO1xuICB9XG5cbiAgLyoqIEdldHMgYWxsIHJlZmVyZW5jZWQgZ2VzdHVyZSBjb25maWcgaWRlbnRpZmllcnMgb2YgYSBnaXZlbiBzb3VyY2UgZmlsZSAqL1xuICBwcml2YXRlIF9nZXRHZXN0dXJlQ29uZmlnSWRlbnRpZmllcnNPZkZpbGUoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IHRzLklkZW50aWZpZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLmZpbHRlcihkID0+IGQubm9kZS5nZXRTb3VyY2VGaWxlKCkgPT09IHNvdXJjZUZpbGUpXG4gICAgICAgIC5tYXAoZCA9PiBkLm5vZGUpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHN5bWJvbCB0aGF0IGNvbnRhaW5zIHRoZSB2YWx1ZSBkZWNsYXJhdGlvbiBvZiB0aGUgc3BlY2lmaWVkIG5vZGUuICovXG4gIHByaXZhdGUgX2dldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKG5vZGU6IHRzLk5vZGUpOiB0cy5TeW1ib2x8dW5kZWZpbmVkIHtcbiAgICBjb25zdCBzeW1ib2wgPSB0aGlzLnR5cGVDaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24obm9kZSk7XG5cbiAgICAvLyBTeW1ib2xzIGNhbiBiZSBhbGlhc2VzIG9mIHRoZSBkZWNsYXJhdGlvbiBzeW1ib2wuIGUuZy4gaW4gbmFtZWQgaW1wb3J0IHNwZWNpZmllcnMuXG4gICAgLy8gV2UgbmVlZCB0byByZXNvbHZlIHRoZSBhbGlhc2VkIHN5bWJvbCBiYWNrIHRvIHRoZSBkZWNsYXJhdGlvbiBzeW1ib2wuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWJpdHdpc2VcbiAgICBpZiAoc3ltYm9sICYmIChzeW1ib2wuZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5BbGlhcykgIT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnR5cGVDaGVja2VyLmdldEFsaWFzZWRTeW1ib2woc3ltYm9sKTtcbiAgICB9XG4gICAgcmV0dXJuIHN5bWJvbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gZXhwcmVzc2lvbiByZXNvbHZlcyB0byBhIGhhbW1lciBnZXN0dXJlIGNvbmZpZ1xuICAgKiB0b2tlbiByZWZlcmVuY2UgZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi5cbiAgICovXG4gIHByaXZhdGUgX2lzUmVmZXJlbmNlVG9IYW1tZXJDb25maWdUb2tlbihleHByOiB0cy5FeHByZXNzaW9uKSB7XG4gICAgY29uc3QgdW53cmFwcGVkID0gdW53cmFwRXhwcmVzc2lvbihleHByKTtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKHVud3JhcHBlZCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHIubm9kZSA9PT0gdW53cmFwcGVkKTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKHVud3JhcHBlZCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHIubm9kZSA9PT0gdW53cmFwcGVkLm5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBtaWdyYXRpb24gZmFpbHVyZXMgb2YgdGhlIGNvbGxlY3RlZCBub2RlIGZhaWx1cmVzLiBUaGUgcmV0dXJuZWQgbWlncmF0aW9uXG4gICAqIGZhaWx1cmVzIGFyZSB1cGRhdGVkIHRvIHJlZmxlY3QgdGhlIHBvc3QtbWlncmF0aW9uIHN0YXRlIG9mIHNvdXJjZSBmaWxlcy4gTWVhbmluZ1xuICAgKiB0aGF0IGZhaWx1cmUgcG9zaXRpb25zIGFyZSBjb3JyZWN0ZWQgaWYgc291cmNlIGZpbGUgbW9kaWZpY2F0aW9ucyBzaGlmdGVkIGxpbmVzLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlTWlncmF0aW9uRmFpbHVyZXMoKTogTWlncmF0aW9uRmFpbHVyZVtdIHtcbiAgICByZXR1cm4gdGhpcy5fbm9kZUZhaWx1cmVzLm1hcCgoe25vZGUsIG1lc3NhZ2V9KSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgICBjb25zdCBvZmZzZXQgPSBub2RlLmdldFN0YXJ0KCk7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRzLmdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKG5vZGUuZ2V0U291cmNlRmlsZSgpLCBub2RlLmdldFN0YXJ0KCkpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zaXRpb246IHRoaXMuX2ltcG9ydE1hbmFnZXIuY29ycmVjdE5vZGVQb3NpdGlvbihub2RlLCBvZmZzZXQsIHBvc2l0aW9uKSxcbiAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgZmlsZVBhdGg6IHNvdXJjZUZpbGUuZmlsZU5hbWUsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHByb2plY3QgZnJvbSB0aGUgY3VycmVudCBwcm9ncmFtIG9yIHRocm93cyBpZiBubyBwcm9qZWN0XG4gICAqIGNvdWxkIGJlIGZvdW5kLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0UHJvamVjdE9yVGhyb3coKTogV29ya3NwYWNlUHJvamVjdCB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gZ2V0V29ya3NwYWNlKHRoaXMudHJlZSk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tUHJvZ3JhbSh3b3Jrc3BhY2UsIHRoaXMucHJvZ3JhbSk7XG5cbiAgICBpZiAoIXByb2plY3QpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKFxuICAgICAgICAgICdDb3VsZCBub3QgZmluZCBwcm9qZWN0IHRvIHBlcmZvcm0gSGFtbWVySlMgdjkgbWlncmF0aW9uLiAnICtcbiAgICAgICAgICAnUGxlYXNlIGVuc3VyZSB5b3VyIHdvcmtzcGFjZSBjb25maWd1cmF0aW9uIGRlZmluZXMgYSBwcm9qZWN0LicpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9qZWN0O1xuICB9XG5cbiAgLyoqIEdsb2JhbCBzdGF0ZSBvZiB3aGV0aGVyIEhhbW1lciBpcyB1c2VkIGluIGFueSBhbmFseXplZCBwcm9qZWN0IHRhcmdldC4gKi9cbiAgc3RhdGljIGdsb2JhbFVzZXNIYW1tZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogU3RhdGljIG1pZ3JhdGlvbiBydWxlIG1ldGhvZCB0aGF0IHdpbGwgYmUgY2FsbGVkIG9uY2UgYWxsIHByb2plY3QgdGFyZ2V0c1xuICAgKiBoYXZlIGJlZW4gbWlncmF0ZWQgaW5kaXZpZHVhbGx5LiBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCB0byBtYWtlIGNoYW5nZXMgYmFzZWRcbiAgICogb24gdGhlIGFuYWx5c2lzIG9mIHRoZSBpbmRpdmlkdWFsIHRhcmdldHMuIEZvciBleGFtcGxlOiB3ZSBvbmx5IHJlbW92ZSBIYW1tZXJcbiAgICogZnJvbSB0aGUgXCJwYWNrYWdlLmpzb25cIiBpZiBpdCBpcyBub3QgdXNlZCBpbiAqYW55KiBwcm9qZWN0IHRhcmdldC5cbiAgICovXG4gIHN0YXRpYyBnbG9iYWxQb3N0TWlncmF0aW9uKHRyZWU6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpOiBQb3N0TWlncmF0aW9uQWN0aW9uIHtcbiAgICBpZiAoIXRoaXMuZ2xvYmFsVXNlc0hhbW1lciAmJiB0aGlzLl9yZW1vdmVIYW1tZXJGcm9tUGFja2FnZUpzb24odHJlZSkpIHtcbiAgICAgIC8vIFNpbmNlIEhhbW1lciBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHdvcmtzcGFjZSBcInBhY2thZ2UuanNvblwiIGZpbGUsXG4gICAgICAvLyB3ZSBzY2hlZHVsZSBhIG5vZGUgcGFja2FnZSBpbnN0YWxsIHRhc2sgdG8gcmVmcmVzaCB0aGUgbG9jayBmaWxlLlxuICAgICAgcmV0dXJuIHtydW5QYWNrYWdlTWFuYWdlcjogdHJ1ZX07XG4gICAgfVxuXG4gICAgY29udGV4dC5sb2dnZXIuaW5mbyhjaGFsay55ZWxsb3coXG4gICAgICAgICfimqAgVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBjb21wb25lbnRzIGlzIG5vdCBhYmxlIHRvIG1pZ3JhdGUgdGVzdHMuICcgK1xuICAgICAgICAnUGxlYXNlIG1hbnVhbGx5IGNsZWFuIHVwIHRlc3RzIGluIHlvdXIgcHJvamVjdCBpZiB0aGV5IHJlbHkgb24gSGFtbWVySlMuJykpO1xuXG4gICAgLy8gQ2xlYW4gZ2xvYmFsIHN0YXRlIG9uY2UgdGhlIHdvcmtzcGFjZSBoYXMgYmVlbiBtaWdyYXRlZC4gVGhpcyBpcyB0ZWNobmljYWxseVxuICAgIC8vIG5vdCBuZWNlc3NhcnkgaW4gXCJuZyB1cGRhdGVcIiwgYnV0IGluIHRlc3RzIHdlIHJlLXVzZSB0aGUgc2FtZSBydWxlIGNsYXNzLlxuICAgIHRoaXMuZ2xvYmFsVXNlc0hhbW1lciA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGhhbW1lciBwYWNrYWdlIGZyb20gdGhlIHdvcmtzcGFjZSBcInBhY2thZ2UuanNvblwiLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIEhhbW1lciB3YXMgc2V0IHVwIGFuZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIFwicGFja2FnZS5qc29uXCJcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIF9yZW1vdmVIYW1tZXJGcm9tUGFja2FnZUpzb24odHJlZTogVHJlZSk6IGJvb2xlYW4ge1xuICAgIGlmICghdHJlZS5leGlzdHMoJy9wYWNrYWdlLmpzb24nKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZSh0cmVlLnJlYWQoJy9wYWNrYWdlLmpzb24nKSEudG9TdHJpbmcoJ3V0ZjgnKSk7XG5cbiAgICAvLyBXZSBkbyBub3QgaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHNvbWVvbmUgbWFudWFsbHkgYWRkZWQgXCJoYW1tZXJqc1wiXG4gICAgLy8gdG8gdGhlIGRldiBkZXBlbmRlbmNpZXMuXG4gICAgaWYgKHBhY2thZ2VKc29uLmRlcGVuZGVuY2llc1tIQU1NRVJfTU9EVUxFX1NQRUNJRklFUl0pIHtcbiAgICAgIGRlbGV0ZSBwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXNbSEFNTUVSX01PRFVMRV9TUEVDSUZJRVJdO1xuICAgICAgdHJlZS5vdmVyd3JpdGUoJy9wYWNrYWdlLmpzb24nLCBKU09OLnN0cmluZ2lmeShwYWNrYWdlSnNvbiwgbnVsbCwgMikpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IHVud3JhcHMgYSBnaXZlbiBleHByZXNzaW9uIGlmIGl0IGlzIHdyYXBwZWRcbiAqIGJ5IHBhcmVudGhlc2lzLCB0eXBlIGNhc3RzIG9yIHR5cGUgYXNzZXJ0aW9ucy5cbiAqL1xuZnVuY3Rpb24gdW53cmFwRXhwcmVzc2lvbihub2RlOiB0cy5Ob2RlKTogdHMuTm9kZSB7XG4gIGlmICh0cy5pc1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgcmV0dXJuIHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgfSBlbHNlIGlmICh0cy5pc0FzRXhwcmVzc2lvbihub2RlKSkge1xuICAgIHJldHVybiB1bndyYXBFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gIH0gZWxzZSBpZiAodHMuaXNUeXBlQXNzZXJ0aW9uKG5vZGUpKSB7XG4gICAgcmV0dXJuIHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgfVxuICByZXR1cm4gbm9kZTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyB0aGUgc3BlY2lmaWVkIHBhdGggdG8gYSB2YWxpZCBUeXBlU2NyaXB0IG1vZHVsZSBzcGVjaWZpZXIgd2hpY2ggaXNcbiAqIHJlbGF0aXZlIHRvIHRoZSBnaXZlbiBjb250YWluaW5nIGZpbGUuXG4gKi9cbmZ1bmN0aW9uIGdldE1vZHVsZVNwZWNpZmllcihuZXdQYXRoOiBzdHJpbmcsIGNvbnRhaW5pbmdGaWxlOiBzdHJpbmcpIHtcbiAgbGV0IHJlc3VsdCA9IHJlbGF0aXZlKGRpcm5hbWUoY29udGFpbmluZ0ZpbGUpLCBuZXdQYXRoKS5yZXBsYWNlKC9cXFxcL2csICcvJykucmVwbGFjZSgvXFwudHMkLywgJycpO1xuICBpZiAoIXJlc3VsdC5zdGFydHNXaXRoKCcuJykpIHtcbiAgICByZXN1bHQgPSBgLi8ke3Jlc3VsdH1gO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgdGV4dCBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgbmFtZS5cbiAqIEByZXR1cm5zIFRleHQgb2YgdGhlIGdpdmVuIHByb3BlcnR5IG5hbWUuIE51bGwgaWYgbm90IHN0YXRpY2FsbHkgYW5hbHl6YWJsZS5cbiAqL1xuZnVuY3Rpb24gZ2V0UHJvcGVydHlOYW1lVGV4dChub2RlOiB0cy5Qcm9wZXJ0eU5hbWUpOiBzdHJpbmd8bnVsbCB7XG4gIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkgfHwgdHMuaXNTdHJpbmdMaXRlcmFsTGlrZShub2RlKSkge1xuICAgIHJldHVybiBub2RlLnRleHQ7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gaWRlbnRpZmllciBpcyBwYXJ0IG9mIGEgbmFtZXNwYWNlZCBhY2Nlc3MuICovXG5mdW5jdGlvbiBpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGU6IHRzLklkZW50aWZpZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRzLmlzUXVhbGlmaWVkTmFtZShub2RlLnBhcmVudCkgfHwgdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZS5wYXJlbnQpO1xufVxuXG4vKipcbiAqIFdhbGtzIHRocm91Z2ggdGhlIHNwZWNpZmllZCBub2RlIGFuZCByZXR1cm5zIGFsbCBjaGlsZCBub2RlcyB3aGljaCBtYXRjaCB0aGVcbiAqIGdpdmVuIHByZWRpY2F0ZS5cbiAqL1xuZnVuY3Rpb24gZmluZE1hdGNoaW5nQ2hpbGROb2RlczxUIGV4dGVuZHMgdHMuTm9kZT4oXG4gICAgcGFyZW50OiB0cy5Ob2RlLCBwcmVkaWNhdGU6IChub2RlOiB0cy5Ob2RlKSA9PiBub2RlIGlzIFQpOiBUW10ge1xuICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdO1xuICBjb25zdCB2aXNpdE5vZGUgPSAobm9kZTogdHMuTm9kZSkgPT4ge1xuICAgIGlmIChwcmVkaWNhdGUobm9kZSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKG5vZGUpO1xuICAgIH1cbiAgICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgdmlzaXROb2RlKTtcbiAgfTtcbiAgdHMuZm9yRWFjaENoaWxkKHBhcmVudCwgdmlzaXROb2RlKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==