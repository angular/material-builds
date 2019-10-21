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
    /** Global state of whether Hammer is used in any analyzed project target. */
    HammerGesturesRule.globalUsesHammer = false;
    exports.HammerGesturesRule = HammerGesturesRule;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLWdlc3R1cmVzLXJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvdXBncmFkZS1ydWxlcy9oYW1tZXItZ2VzdHVyZXMtdjkvaGFtbWVyLWdlc3R1cmVzLXJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCwrQ0FJOEI7SUFDOUIsMkRBQXVGO0lBQ3ZGLHdEQVFpQztJQUNqQyxxRUFJK0M7SUFDL0MsK0RBQXdFO0lBQ3hFLCtEQUFnRTtJQUVoRSxpQ0FBMEI7SUFDMUIsMkJBQWdDO0lBQ2hDLCtCQUE2QztJQUM3QyxpQ0FBaUM7SUFFakMseUhBQXNEO0lBQ3RELDZJQUF5RTtJQUN6RSwrSEFBNEQ7SUFDNUQseUlBQWlFO0lBQ2pFLG1JQUFtRTtJQUNuRSwySEFBK0M7SUFDL0MsdUlBQXdFO0lBQ3hFLCtJQUFpRTtJQUVqRSxNQUFNLHlCQUF5QixHQUFHLGVBQWUsQ0FBQztJQUNsRCxNQUFNLHdCQUF3QixHQUFHLGdCQUFnQixDQUFDO0lBQ2xELE1BQU0sNEJBQTRCLEdBQUcsMkJBQTJCLENBQUM7SUFFakUsTUFBTSx3QkFBd0IsR0FBRyx1QkFBdUIsQ0FBQztJQUN6RCxNQUFNLDBCQUEwQixHQUFHLDJCQUEyQixDQUFDO0lBRS9ELE1BQU0sa0JBQWtCLEdBQUcsY0FBYyxDQUFDO0lBQzFDLE1BQU0sb0JBQW9CLEdBQUcsMkJBQTJCLENBQUM7SUFFekQsTUFBTSx1QkFBdUIsR0FBRyxVQUFVLENBQUM7SUFFM0MsTUFBTSw2QkFBNkIsR0FDL0IscUVBQXFFLENBQUM7SUFFMUUsTUFBTSw2QkFBNkIsR0FBRyxvREFBb0Q7UUFDdEYsMkRBQTJELENBQUM7SUFRaEUsTUFBYSxrQkFBbUIsU0FBUSwwQkFBbUI7UUFBM0Q7O1lBQ0UseUZBQXlGO1lBQ3pGLHlFQUF5RTtZQUN6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QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxtQkFBbUIsQ0FBQyxJQUFxQjtRQUNoRCxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztTQUNsQjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELDBFQUEwRTtJQUMxRSxTQUFTLDRCQUE0QixDQUFDLElBQW1CO1FBQ3ZELE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxzQkFBc0IsQ0FDM0IsTUFBZSxFQUFFLFNBQXVDO1FBQzFELE1BQU0sTUFBTSxHQUFRLEVBQUUsQ0FBQztRQUN2QixNQUFNLFNBQVMsR0FBRyxDQUFDLElBQWEsRUFBRSxFQUFFO1lBQ2xDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25CO1lBQ0QsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDO1FBQ0YsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkMsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBqb2luIGFzIGRldmtpdEpvaW4sXG4gIG5vcm1hbGl6ZSBhcyBkZXZraXROb3JtYWxpemUsXG4gIFBhdGggYXMgRGV2a2l0UGF0aFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQge1NjaGVtYXRpY0NvbnRleHQsIFNjaGVtYXRpY3NFeGNlcHRpb24sIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGdldFByb2plY3RJbmRleEZpbGVzLFxuICBnZXRQcm9qZWN0TWFpbkZpbGUsXG4gIE1pZ3JhdGlvbkZhaWx1cmUsXG4gIE1pZ3JhdGlvblJ1bGUsXG4gIFBvc3RNaWdyYXRpb25BY3Rpb24sXG4gIFJlc29sdmVkUmVzb3VyY2UsXG4gIFRhcmdldFZlcnNpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhLFxuICBnZXREZWNvcmF0b3JNZXRhZGF0YSxcbiAgZ2V0TWV0YWRhdGFGaWVsZFxufSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvYXN0LXV0aWxzJztcbmltcG9ydCB7Q2hhbmdlLCBJbnNlcnRDaGFuZ2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jaGFuZ2UnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jb25maWcnO1xuaW1wb3J0IHtXb3Jrc3BhY2VQcm9qZWN0fSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlLW1vZGVscyc7XG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuaW1wb3J0IHtyZWFkRmlsZVN5bmN9IGZyb20gJ2ZzJztcbmltcG9ydCB7ZGlybmFtZSwgam9pbiwgcmVsYXRpdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Z2V0UHJvamVjdEZyb21Qcm9ncmFtfSBmcm9tICcuL2NsaS13b3Jrc3BhY2UnO1xuaW1wb3J0IHtmaW5kSGFtbWVyU2NyaXB0SW1wb3J0RWxlbWVudHN9IGZyb20gJy4vZmluZC1oYW1tZXItc2NyaXB0LXRhZ3MnO1xuaW1wb3J0IHtmaW5kTWFpbk1vZHVsZUV4cHJlc3Npb259IGZyb20gJy4vZmluZC1tYWluLW1vZHVsZSc7XG5pbXBvcnQge2lzSGFtbWVySnNVc2VkSW5UZW1wbGF0ZX0gZnJvbSAnLi9oYW1tZXItdGVtcGxhdGUtY2hlY2snO1xuaW1wb3J0IHtnZXRJbXBvcnRPZklkZW50aWZpZXIsIEltcG9ydH0gZnJvbSAnLi9pZGVudGlmaWVyLWltcG9ydHMnO1xuaW1wb3J0IHtJbXBvcnRNYW5hZ2VyfSBmcm9tICcuL2ltcG9ydC1tYW5hZ2VyJztcbmltcG9ydCB7cmVtb3ZlRWxlbWVudEZyb21BcnJheUV4cHJlc3Npb259IGZyb20gJy4vcmVtb3ZlLWFycmF5LWVsZW1lbnQnO1xuaW1wb3J0IHtyZW1vdmVFbGVtZW50RnJvbUh0bWx9IGZyb20gJy4vcmVtb3ZlLWVsZW1lbnQtZnJvbS1odG1sJztcblxuY29uc3QgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSA9ICdHZXN0dXJlQ29uZmlnJztcbmNvbnN0IEdFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRSA9ICdnZXN0dXJlLWNvbmZpZyc7XG5jb25zdCBHRVNUVVJFX0NPTkZJR19URU1QTEFURV9QQVRIID0gJy4vZ2VzdHVyZS1jb25maWcudGVtcGxhdGUnO1xuXG5jb25zdCBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUgPSAnSEFNTUVSX0dFU1RVUkVfQ09ORklHJztcbmNvbnN0IEhBTU1FUl9DT05GSUdfVE9LRU5fTU9EVUxFID0gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5jb25zdCBIQU1NRVJfTU9EVUxFX05BTUUgPSAnSGFtbWVyTW9kdWxlJztcbmNvbnN0IEhBTU1FUl9NT0RVTEVfSU1QT1JUID0gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5jb25zdCBIQU1NRVJfTU9EVUxFX1NQRUNJRklFUiA9ICdoYW1tZXJqcyc7XG5cbmNvbnN0IENBTk5PVF9SRU1PVkVfUkVGRVJFTkNFX0VSUk9SID1cbiAgICBgQ2Fubm90IHJlbW92ZSByZWZlcmVuY2UgdG8gXCJHZXN0dXJlQ29uZmlnXCIuIFBsZWFzZSByZW1vdmUgbWFudWFsbHkuYDtcblxuY29uc3QgQ0FOTk9UX1NFVFVQX0FQUF9NT0RVTEVfRVJST1IgPSBgQ291bGQgbm90IHNldHVwIEhhbW1lciBnZXN0dXJlcyBpbiBtb2R1bGUuIFBsZWFzZSBgICtcbiAgICBgbWFudWFsbHkgZW5zdXJlIHRoYXQgdGhlIEhhbW1lciBnZXN0dXJlIGNvbmZpZyBpcyBzZXQgdXAuYDtcblxuaW50ZXJmYWNlIElkZW50aWZpZXJSZWZlcmVuY2Uge1xuICBub2RlOiB0cy5JZGVudGlmaWVyO1xuICBpbXBvcnREYXRhOiBJbXBvcnQ7XG4gIGlzSW1wb3J0OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgSGFtbWVyR2VzdHVyZXNSdWxlIGV4dGVuZHMgTWlncmF0aW9uUnVsZTxudWxsPiB7XG4gIC8vIE9ubHkgZW5hYmxlIHRoaXMgcnVsZSBpZiB0aGUgbWlncmF0aW9uIHRhcmdldHMgdjkgb3IgdjEwIGFuZCBpcyBydW5uaW5nIGZvciBhIG5vbi10ZXN0XG4gIC8vIHRhcmdldC4gV2UgY2Fubm90IG1pZ3JhdGUgdGVzdCB0YXJnZXRzIHNpbmNlIHRoZXkgaGF2ZSBhIGxpbWl0ZWQgc2NvcGVcbiAgLy8gKGluIHJlZ2FyZHMgdG8gc291cmNlIGZpbGVzKSBhbmQgdGhlcmVmb3JlIHRoZSBIYW1tZXJKUyB1c2FnZSBkZXRlY3Rpb24gY2FuIGJlIGluY29ycmVjdC5cbiAgcnVsZUVuYWJsZWQgPVxuICAgICAgKHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WOSB8fCB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjEwKSAmJlxuICAgICAgIXRoaXMuaXNUZXN0VGFyZ2V0O1xuXG4gIHByaXZhdGUgX3ByaW50ZXIgPSB0cy5jcmVhdGVQcmludGVyKCk7XG4gIHByaXZhdGUgX2ltcG9ydE1hbmFnZXIgPSBuZXcgSW1wb3J0TWFuYWdlcih0aGlzLmdldFVwZGF0ZVJlY29yZGVyLCB0aGlzLl9wcmludGVyKTtcbiAgcHJpdmF0ZSBfbm9kZUZhaWx1cmVzOiB7bm9kZTogdHMuTm9kZSwgbWVzc2FnZTogc3RyaW5nfVtdID0gW107XG5cbiAgLyoqIFdoZXRoZXIgSGFtbWVySlMgaXMgZXhwbGljaXRseSB1c2VkIGluIGFueSBjb21wb25lbnQgdGVtcGxhdGUuICovXG4gIHByaXZhdGUgX3VzZWRJblRlbXBsYXRlID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgSGFtbWVySlMgaXMgYWNjZXNzZWQgYXQgcnVudGltZS4gKi9cbiAgcHJpdmF0ZSBfdXNlZEluUnVudGltZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGltcG9ydHMgdGhhdCBtYWtlIFwiaGFtbWVyanNcIiBhdmFpbGFibGUgZ2xvYmFsbHkuIFdlIGtlZXAgdHJhY2sgb2YgdGhlc2VcbiAgICogc2luY2Ugd2UgbWlnaHQgbmVlZCB0byByZW1vdmUgdGhlbSBpZiBIYW1tZXIgaXMgbm90IHVzZWQuXG4gICAqL1xuICBwcml2YXRlIF9pbnN0YWxsSW1wb3J0czogdHMuSW1wb3J0RGVjbGFyYXRpb25bXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHJlc29sdmUgdG8gdGhlIGdlc3R1cmUgY29uZmlnIGZyb20gQW5ndWxhciBNYXRlcmlhbC5cbiAgICovXG4gIHByaXZhdGUgX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzOiBJZGVudGlmaWVyUmVmZXJlbmNlW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCByZXNvbHZlIHRvIHRoZSBcIkhBTU1FUl9HRVNUVVJFX0NPTkZJR1wiIHRva2VuIGZyb21cbiAgICogXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuXG4gICAqL1xuICBwcml2YXRlIF9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXM6IElkZW50aWZpZXJSZWZlcmVuY2VbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHJlc29sdmUgdG8gdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbVxuICAgKiBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi5cbiAgICovXG4gIHByaXZhdGUgX2hhbW1lck1vZHVsZVJlZmVyZW5jZXM6IElkZW50aWZpZXJSZWZlcmVuY2VbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHRoYXQgaGF2ZSBiZWVuIGRlbGV0ZWQgZnJvbSBzb3VyY2UgZmlsZXMuIFRoaXMgY2FuIGJlXG4gICAqIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGNlcnRhaW4gaW1wb3J0cyBhcmUgc3RpbGwgdXNlZCBvciBub3QuXG4gICAqL1xuICBwcml2YXRlIF9kZWxldGVkSWRlbnRpZmllcnM6IHRzLklkZW50aWZpZXJbXSA9IFtdO1xuXG4gIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFJlc29sdmVkUmVzb3VyY2UpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3VzZWRJblRlbXBsYXRlICYmIGlzSGFtbWVySnNVc2VkSW5UZW1wbGF0ZSh0ZW1wbGF0ZS5jb250ZW50KSkge1xuICAgICAgdGhpcy5fdXNlZEluVGVtcGxhdGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tIYW1tZXJJbXBvcnRzKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9yUnVudGltZUhhbW1lclVzYWdlKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9yTWF0ZXJpYWxHZXN0dXJlQ29uZmlnKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9ySGFtbWVyR2VzdHVyZUNvbmZpZ1Rva2VuKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9ySGFtbWVyTW9kdWxlUmVmZXJlbmNlKG5vZGUpO1xuICB9XG5cbiAgcG9zdEFuYWx5c2lzKCk6IHZvaWQge1xuICAgIC8vIFdhbGsgdGhyb3VnaCBhbGwgaGFtbWVyIGNvbmZpZyB0b2tlbiByZWZlcmVuY2VzIGFuZCBjaGVjayBpZiB0aGVyZVxuICAgIC8vIGlzIGEgcG90ZW50aWFsIGN1c3RvbSBnZXN0dXJlIGNvbmZpZyBzZXR1cC5cbiAgICBjb25zdCBoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAgPVxuICAgICAgICB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHRoaXMuX2NoZWNrRm9yQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKHIpKTtcblxuICAgIGlmICh0aGlzLl91c2VkSW5SdW50aW1lIHx8IHRoaXMuX3VzZWRJblRlbXBsYXRlKSB7XG4gICAgICAvLyBXZSBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgSGFtbWVyIGlzIHVzZWQgZ2xvYmFsbHkuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugd2VcbiAgICAgIC8vIHdhbnQgdG8gb25seSByZW1vdmUgSGFtbWVyIGZyb20gdGhlIFwicGFja2FnZS5qc29uXCIgaWYgaXQgaXMgbm90IHVzZWQgaW4gYW55IHByb2plY3RcbiAgICAgIC8vIHRhcmdldC4gSnVzdCBiZWNhdXNlIGl0IGlzbid0IHVzZWQgaW4gb25lIHRhcmdldCBkb2Vzbid0IG1lYW4gdGhhdCB3ZSBjYW4gc2FmZWx5XG4gICAgICAvLyByZW1vdmUgdGhlIGRlcGVuZGVuY3kuXG4gICAgICBIYW1tZXJHZXN0dXJlc1J1bGUuZ2xvYmFsVXNlc0hhbW1lciA9IHRydWU7XG5cbiAgICAgIC8vIElmIGhhbW1lciBpcyBvbmx5IHVzZWQgYXQgcnVudGltZSwgd2UgZG9uJ3QgbmVlZCB0aGUgZ2VzdHVyZSBjb25maWcgb3IgXCJIYW1tZXJNb2R1bGVcIlxuICAgICAgLy8gYW5kIGNhbiByZW1vdmUgaXQgKGFsb25nIHdpdGggdGhlIGhhbW1lciBjb25maWcgdG9rZW4gaW1wb3J0IGlmIG5vIGxvbmdlciBuZWVkZWQpLlxuICAgICAgaWYgKCF0aGlzLl91c2VkSW5UZW1wbGF0ZSkge1xuICAgICAgICB0aGlzLl9yZW1vdmVNYXRlcmlhbEdlc3R1cmVDb25maWdTZXR1cCgpO1xuICAgICAgICB0aGlzLl9yZW1vdmVIYW1tZXJNb2R1bGVSZWZlcmVuY2VzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zZXR1cEhhbW1lckdlc3R1cmVDb25maWcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgSGFtbWVySlMgY291bGQgbm90IGJlIGRldGVjdGVkLCBidXQgd2UgZGV0ZWN0ZWQgYSBjdXN0b20gZ2VzdHVyZSBjb25maWdcbiAgICAgIC8vIHNldHVwLCB3ZSBvbmx5IHJlbW92ZSBhbGwgcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICAgIGlmIChoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXApIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgICAgICAgLy8gUHJpbnQgYSBtZXNzYWdlIGlmIHdlIGZvdW5kIGEgY3VzdG9tIGdlc3R1cmUgY29uZmlnIHNldHVwIGluIGNvbWJpbmF0aW9uIHdpdGhcbiAgICAgICAgLy8gcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy4gVGhpcyBpcyBhbWJpZ3VvdXMgYW5kIHRoZVxuICAgICAgICAvLyBtaWdyYXRpb24ganVzdCByZW1vdmVzIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyBzZXR1cCwgYnV0IHdlIHN0aWxsIHdhbnRcbiAgICAgICAgLy8gdG8gY3JlYXRlIGFuIGluZm9ybWF0aW9uIG1lc3NhZ2UuXG4gICAgICAgIGlmICh0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLnByaW50SW5mbyhcbiAgICAgICAgICAgICAgJ1RoZSBIYW1tZXJKUyB2OSBtaWdyYXRpb24gZm9yIEFuZ3VsYXIgY29tcG9uZW50cyBkZXRlY3RlZCB0aGF0IEhhbW1lckpTIGlzJyArXG4gICAgICAgICAgICAgICdtYW51YWxseSBzZXQgdXAgaW4gY29tYmluYXRpb24gd2l0aCByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgJyArXG4gICAgICAgICAgICAgICdjb25maWcuIFRoZSBtaWdyYXRpb24gaXMgdW5hYmxlIHRvIHBlcmZvcm0gdGhlIGZ1bGwgbWlncmF0aW9uIGZvciB0aGlzIHRhcmdldCwgJyArXG4gICAgICAgICAgICAgICdidXQgcmVtb3ZlZCBhbGwgcmVmZXJlbmNlcyB0byB0aGUgZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZW1vdmVIYW1tZXJTZXR1cCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlY29yZCB0aGUgY2hhbmdlcyBjb2xsZWN0ZWQgaW4gdGhlIGltcG9ydCBtYW5hZ2VyLiBDaGFuZ2VzIG5lZWQgdG8gYmUgYXBwbGllZFxuICAgIC8vIG9uY2UgdGhlIGltcG9ydCBtYW5hZ2VyIHJlZ2lzdGVyZWQgYWxsIGltcG9ydCBtb2RpZmljYXRpb25zLiBUaGlzIGF2b2lkcyBjb2xsaXNpb25zLlxuICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIucmVjb3JkQ2hhbmdlcygpO1xuXG4gICAgLy8gQ3JlYXRlIG1pZ3JhdGlvbiBmYWlsdXJlcyB0aGF0IHdpbGwgYmUgcHJpbnRlZCBieSB0aGUgdXBkYXRlLXRvb2wgb24gbWlncmF0aW9uXG4gICAgLy8gY29tcGxldGlvbi4gV2UgbmVlZCBzcGVjaWFsIGxvZ2ljIGZvciB1cGRhdGluZyBmYWlsdXJlIHBvc2l0aW9ucyB0byByZWZsZWN0XG4gICAgLy8gdGhlIG5ldyBzb3VyY2UgZmlsZSBhZnRlciBtb2RpZmljYXRpb25zIGZyb20gdGhlIGltcG9ydCBtYW5hZ2VyLlxuICAgIHRoaXMuZmFpbHVyZXMucHVzaCguLi50aGlzLl9jcmVhdGVNaWdyYXRpb25GYWlsdXJlcygpKTtcblxuICAgIC8vIFRoZSB0ZW1wbGF0ZSBjaGVjayBmb3IgSGFtbWVySlMgZXZlbnRzIGlzIG5vdCBjb21wbGV0ZWx5IHJlbGlhYmxlIGFzIHRoZSBldmVudFxuICAgIC8vIG91dHB1dCBjb3VsZCBhbHNvIGJlIGZyb20gYSBjb21wb25lbnQgaGF2aW5nIGFuIG91dHB1dCBuYW1lZCBzaW1pbGFybHkgdG8gYSBrbm93blxuICAgIC8vIGhhbW1lcmpzIGV2ZW50IChlLmcuIFwiQE91dHB1dCgpIHNsaWRlXCIpLiBUaGUgdXNhZ2UgaXMgdGhlcmVmb3JlIHNvbWV3aGF0IGFtYmlndW91c1xuICAgIC8vIGFuZCB3ZSB3YW50IHRvIHByaW50IGEgbWVzc2FnZSB0aGF0IGRldmVsb3BlcnMgbWlnaHQgYmUgYWJsZSB0byByZW1vdmUgSGFtbWVyIG1hbnVhbGx5LlxuICAgIGlmICghdGhpcy5fdXNlZEluUnVudGltZSAmJiB0aGlzLl91c2VkSW5UZW1wbGF0ZSkge1xuICAgICAgdGhpcy5wcmludEluZm8oY2hhbGsueWVsbG93KFxuICAgICAgICAgICdUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIGNvbXBvbmVudHMgbWlncmF0ZWQgdGhlICcgK1xuICAgICAgICAgICdwcm9qZWN0IHRvIGtlZXAgSGFtbWVySlMgaW5zdGFsbGVkLCBidXQgZGV0ZWN0ZWQgYW1iaWd1b3VzIHVzYWdlIG9mIEhhbW1lckpTLiBQbGVhc2UgJyArXG4gICAgICAgICAgJ21hbnVhbGx5IGNoZWNrIGlmIHlvdSBjYW4gcmVtb3ZlIEhhbW1lckpTIGZyb20geW91ciBhcHBsaWNhdGlvbi4nKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgY3VycmVudCBwcm9qZWN0LiBUbyBhY2hpZXZlIHRoaXMsIHRoZVxuICAgKiBmb2xsb3dpbmcgc3RlcHMgYXJlIHBlcmZvcm1lZDpcbiAgICogICAxKSBDcmVhdGUgY29weSBvZiBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgKiAgIDIpIFJld3JpdGUgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgdG8gdGhlXG4gICAqICAgICAgbmV3bHkgY29waWVkIGdlc3R1cmUgY29uZmlnLlxuICAgKiAgIDMpIFNldHVwIHRoZSBIQU1NRVJfR0VTVFVSRV9DT05GSUcgcHJvdmlkZXIgaW4gdGhlIHJvb3QgYXBwIG1vZHVsZVxuICAgKiAgICAgIChpZiBub3QgZG9uZSBhbHJlYWR5KS5cbiAgICovXG4gIHByaXZhdGUgX3NldHVwSGFtbWVyR2VzdHVyZUNvbmZpZygpIHtcbiAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5fZ2V0UHJvamVjdE9yVGhyb3coKTtcbiAgICBjb25zdCBzb3VyY2VSb290ID0gZGV2a2l0Tm9ybWFsaXplKHByb2plY3Quc291cmNlUm9vdCB8fCBwcm9qZWN0LnJvb3QpO1xuICAgIGNvbnN0IGdlc3R1cmVDb25maWdQYXRoID1cbiAgICAgICAgZGV2a2l0Sm9pbihzb3VyY2VSb290LCB0aGlzLl9nZXRBdmFpbGFibGVHZXN0dXJlQ29uZmlnRmlsZU5hbWUoc291cmNlUm9vdCkpO1xuXG4gICAgLy8gQ29weSBnZXN0dXJlIGNvbmZpZyB0ZW1wbGF0ZSBpbnRvIHRoZSBDTEkgcHJvamVjdC5cbiAgICB0aGlzLnRyZWUuY3JlYXRlKFxuICAgICAgICBnZXN0dXJlQ29uZmlnUGF0aCwgcmVhZEZpbGVTeW5jKHJlcXVpcmUucmVzb2x2ZShHRVNUVVJFX0NPTkZJR19URU1QTEFURV9QQVRIKSwgJ3V0ZjgnKSk7XG5cbiAgICAvLyBSZXBsYWNlIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyBvZiBNYXRlcmlhbC5cbiAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5mb3JFYWNoKFxuICAgICAgICBpID0+IHRoaXMuX3JlcGxhY2VHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKGksIGdlc3R1cmVDb25maWdQYXRoKSk7XG5cbiAgICAvLyBTZXR1cCB0aGUgZ2VzdHVyZSBjb25maWcgcHJvdmlkZXIgYW5kIHRoZSBcIkhhbW1lck1vZHVsZVwiIGluIHRoZSBwcm9qZWN0IGFwcFxuICAgIC8vIG1vZHVsZSBpZiBub3QgZG9uZSBhbHJlYWR5LlxuICAgIHRoaXMuX3NldHVwSGFtbWVyR2VzdHVyZXNJbkFwcE1vZHVsZShwcm9qZWN0LCBnZXN0dXJlQ29uZmlnUGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBIYW1tZXIgZnJvbSB0aGUgY3VycmVudCBwcm9qZWN0LiBUaGUgZm9sbG93aW5nIHN0ZXBzIGFyZSBwZXJmb3JtZWQ6XG4gICAqICAgMSkgRGVsZXRlIGFsbCBUeXBlU2NyaXB0IGltcG9ydHMgdG8gXCJoYW1tZXJqc1wiLlxuICAgKiAgIDIpIFJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgKiAgIDMpIFJlbW92ZSBcImhhbW1lcmpzXCIgZnJvbSBhbGwgaW5kZXggSFRNTCBmaWxlcyBvZiB0aGUgY3VycmVudCBwcm9qZWN0LlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyU2V0dXAoKSB7XG4gICAgY29uc3QgcHJvamVjdCA9IHRoaXMuX2dldFByb2plY3RPclRocm93KCk7XG5cbiAgICB0aGlzLl9pbnN0YWxsSW1wb3J0cy5mb3JFYWNoKGkgPT4gdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVJbXBvcnRCeURlY2xhcmF0aW9uKGkpKTtcblxuICAgIHRoaXMuX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gICAgdGhpcy5fcmVtb3ZlSGFtbWVyTW9kdWxlUmVmZXJlbmNlcygpO1xuICAgIHRoaXMuX3JlbW92ZUhhbW1lckZyb21JbmRleEZpbGUocHJvamVjdCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgZ2VzdHVyZSBjb25maWcgc2V0dXAgYnkgZGVsZXRpbmcgYWxsIGZvdW5kIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXJcbiAgICogTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuIEFkZGl0aW9uYWxseSwgdW51c2VkIGltcG9ydHMgdG8gdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZ1xuICAgKiB0b2tlbiBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiIHdpbGwgYmUgcmVtb3ZlZCBhcyB3ZWxsLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKSB7XG4gICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuZm9yRWFjaChyID0+IHRoaXMuX3JlbW92ZUdlc3R1cmVDb25maWdSZWZlcmVuY2UocikpO1xuXG4gICAgdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLmZvckVhY2gociA9PiB7XG4gICAgICBpZiAoci5pc0ltcG9ydCkge1xuICAgICAgICB0aGlzLl9yZW1vdmVIYW1tZXJDb25maWdUb2tlbkltcG9ydElmVW51c2VkKHIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyTW9kdWxlUmVmZXJlbmNlcygpIHtcbiAgICB0aGlzLl9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzLmZvckVhY2goKHtub2RlLCBpc0ltcG9ydCwgaW1wb3J0RGF0YX0pID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5nZXRVcGRhdGVSZWNvcmRlcihzb3VyY2VGaWxlLmZpbGVOYW1lKTtcblxuICAgICAgLy8gT25seSByZW1vdmUgdGhlIGltcG9ydCBmb3IgdGhlIEhhbW1lck1vZHVsZSBpZiB0aGUgbW9kdWxlIGhhcyBiZWVuIGFjY2Vzc2VkXG4gICAgICAvLyB0aHJvdWdoIGEgbm9uLW5hbWVzcGFjZWQgaWRlbnRpZmllciBhY2Nlc3MuXG4gICAgICBpZiAoIWlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZSkpIHtcbiAgICAgICAgdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoXG4gICAgICAgICAgICBzb3VyY2VGaWxlLCBIQU1NRVJfTU9EVUxFX05BTUUsIGltcG9ydERhdGEubW9kdWxlTmFtZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZvciByZWZlcmVuY2VzIGZyb20gd2l0aGluIGFuIGltcG9ydCwgd2UgZG8gbm90IG5lZWQgdG8gZG8gYW55dGhpbmcgb3RoZXIgdGhhblxuICAgICAgLy8gcmVtb3ZpbmcgdGhlIGltcG9ydC4gRm9yIG90aGVyIHJlZmVyZW5jZXMsIHdlIHJlbW92ZSB0aGUgaW1wb3J0IGFuZCB0aGUgYWN0dWFsXG4gICAgICAvLyBpZGVudGlmaWVyIGluIHRoZSBtb2R1bGUgaW1wb3J0cy5cbiAgICAgIGlmIChpc0ltcG9ydCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZSBcIkhhbW1lck1vZHVsZVwiIGlzIHJlZmVyZW5jZWQgd2l0aGluIGFuIGFycmF5IGxpdGVyYWwsIHdlIGNhblxuICAgICAgLy8gcmVtb3ZlIHRoZSBlbGVtZW50IGVhc2lseS4gT3RoZXJ3aXNlIGlmIGl0J3Mgb3V0c2lkZSBvZiBhbiBhcnJheSBsaXRlcmFsLFxuICAgICAgLy8gd2UgbmVlZCB0byByZXBsYWNlIHRoZSByZWZlcmVuY2Ugd2l0aCBhbiBlbXB0eSBvYmplY3QgbGl0ZXJhbCB3LyB0b2RvIHRvXG4gICAgICAvLyBub3QgYnJlYWsgdGhlIGFwcGxpY2F0aW9uLlxuICAgICAgaWYgKHRzLmlzQXJyYXlMaXRlcmFsRXhwcmVzc2lvbihub2RlLnBhcmVudCkpIHtcbiAgICAgICAgLy8gUmVtb3ZlcyB0aGUgXCJIYW1tZXJNb2R1bGVcIiBmcm9tIHRoZSBwYXJlbnQgYXJyYXkgZXhwcmVzc2lvbi4gUmVtb3Zlc1xuICAgICAgICAvLyB0aGUgdHJhaWxpbmcgY29tbWEgdG9rZW4gaWYgcHJlc2VudC5cbiAgICAgICAgcmVtb3ZlRWxlbWVudEZyb21BcnJheUV4cHJlc3Npb24obm9kZSwgcmVjb3JkZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVjb3JkZXIucmVtb3ZlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpKTtcbiAgICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQobm9kZS5nZXRTdGFydCgpLCBgLyogVE9ETzogcmVtb3ZlICovIHt9YCk7XG4gICAgICAgIHRoaXMuX25vZGVGYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gZGVsZXRlIHJlZmVyZW5jZSB0byBcIkhhbW1lck1vZHVsZVwiLicsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBpcyBhIHJlZmVyZW5jZSB0byB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnXG4gICAqIHRva2VuIGZyb20gcGxhdGZvcm0tYnJvd3Nlci4gSWYgc28sIGtlZXBzIHRyYWNrIG9mIHRoZSByZWZlcmVuY2UuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0ZvckhhbW1lckdlc3R1cmVDb25maWdUb2tlbihub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgICAgY29uc3QgaW1wb3J0RGF0YSA9IGdldEltcG9ydE9mSWRlbnRpZmllcihub2RlLCB0aGlzLnR5cGVDaGVja2VyKTtcbiAgICAgIGlmIChpbXBvcnREYXRhICYmIGltcG9ydERhdGEuc3ltYm9sTmFtZSA9PT0gSEFNTUVSX0NPTkZJR19UT0tFTl9OQU1FICYmXG4gICAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lID09PSBIQU1NRVJfQ09ORklHX1RPS0VOX01PRFVMRSkge1xuICAgICAgICB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMucHVzaChcbiAgICAgICAgICAgIHtub2RlLCBpbXBvcnREYXRhLCBpc0ltcG9ydDogdHMuaXNJbXBvcnRTcGVjaWZpZXIobm9kZS5wYXJlbnQpfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBpcyBhIHJlZmVyZW5jZSB0byB0aGUgSGFtbWVyTW9kdWxlIGZyb21cbiAgICogXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuIElmIHNvLCBrZWVwcyB0cmFjayBvZiB0aGUgcmVmZXJlbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JIYW1tZXJNb2R1bGVSZWZlcmVuY2Uobm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkpIHtcbiAgICAgIGNvbnN0IGltcG9ydERhdGEgPSBnZXRJbXBvcnRPZklkZW50aWZpZXIobm9kZSwgdGhpcy50eXBlQ2hlY2tlcik7XG4gICAgICBpZiAoaW1wb3J0RGF0YSAmJiBpbXBvcnREYXRhLnN5bWJvbE5hbWUgPT09IEhBTU1FUl9NT0RVTEVfTkFNRSAmJlxuICAgICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZSA9PT0gSEFNTUVSX01PRFVMRV9JTVBPUlQpIHtcbiAgICAgICAgdGhpcy5faGFtbWVyTW9kdWxlUmVmZXJlbmNlcy5wdXNoKFxuICAgICAgICAgICAge25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0OiB0cy5pc0ltcG9ydFNwZWNpZmllcihub2RlLnBhcmVudCl9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGlzIGFuIGltcG9ydCB0byB0aGUgSGFtbWVySlMgcGFja2FnZS4gSW1wb3J0cyB0b1xuICAgKiBIYW1tZXJKUyB3aGljaCBsb2FkIHNwZWNpZmljIHN5bWJvbHMgZnJvbSB0aGUgcGFja2FnZSBhcmUgY29uc2lkZXJlZCBhc1xuICAgKiBydW50aW1lIHVzYWdlIG9mIEhhbW1lci4gZS5nLiBgaW1wb3J0IHtTeW1ib2x9IGZyb20gXCJoYW1tZXJqc1wiO2AuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0hhbW1lckltcG9ydHMobm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0cy5pc0ltcG9ydERlY2xhcmF0aW9uKG5vZGUpICYmIHRzLmlzU3RyaW5nTGl0ZXJhbChub2RlLm1vZHVsZVNwZWNpZmllcikgJiZcbiAgICAgICAgbm9kZS5tb2R1bGVTcGVjaWZpZXIudGV4dCA9PT0gSEFNTUVSX01PRFVMRV9TUEVDSUZJRVIpIHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIGFuIGltcG9ydCB0byBIYW1tZXJKUyB0aGF0IGltcG9ydHMgc3ltYm9scywgb3IgaXMgbmFtZXNwYWNlZFxuICAgICAgLy8gKGUuZy4gXCJpbXBvcnQge0EsIEJ9IGZyb20gLi4uXCIgb3IgXCJpbXBvcnQgKiBhcyBoYW1tZXIgZnJvbSAuLi5cIiksIHRoZW4gd2VcbiAgICAgIC8vIGFzc3VtZSB0aGF0IHNvbWUgZXhwb3J0cyBhcmUgdXNlZCBhdCBydW50aW1lLlxuICAgICAgaWYgKG5vZGUuaW1wb3J0Q2xhdXNlICYmXG4gICAgICAgICAgIShub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzICYmIHRzLmlzTmFtZWRJbXBvcnRzKG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpICYmXG4gICAgICAgICAgICBub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzLmVsZW1lbnRzLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgdGhpcy5fdXNlZEluUnVudGltZSA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9pbnN0YWxsSW1wb3J0cy5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgYWNjZXNzZXMgdGhlIGdsb2JhbCBcIkhhbW1lclwiIHN5bWJvbCBhdCBydW50aW1lLiBJZiBzbyxcbiAgICogdGhlIG1pZ3JhdGlvbiBydWxlIHN0YXRlIHdpbGwgYmUgdXBkYXRlZCB0byByZWZsZWN0IHRoYXQgSGFtbWVyIGlzIHVzZWQgYXQgcnVudGltZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9yUnVudGltZUhhbW1lclVzYWdlKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodGhpcy5fdXNlZEluUnVudGltZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIERldGVjdHMgdXNhZ2VzIG9mIFwid2luZG93LkhhbW1lclwiLlxuICAgIGlmICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlKSAmJiBub2RlLm5hbWUudGV4dCA9PT0gJ0hhbW1lcicpIHtcbiAgICAgIGNvbnN0IG9yaWdpbkV4cHIgPSB1bndyYXBFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gICAgICBpZiAodHMuaXNJZGVudGlmaWVyKG9yaWdpbkV4cHIpICYmIG9yaWdpbkV4cHIudGV4dCA9PT0gJ3dpbmRvdycpIHtcbiAgICAgICAgdGhpcy5fdXNlZEluUnVudGltZSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRGV0ZWN0cyB1c2FnZXMgb2YgXCJ3aW5kb3dbJ0hhbW1lciddXCIuXG4gICAgaWYgKHRzLmlzRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24obm9kZSkgJiYgdHMuaXNTdHJpbmdMaXRlcmFsKG5vZGUuYXJndW1lbnRFeHByZXNzaW9uKSAmJlxuICAgICAgICBub2RlLmFyZ3VtZW50RXhwcmVzc2lvbi50ZXh0ID09PSAnSGFtbWVyJykge1xuICAgICAgY29uc3Qgb3JpZ2luRXhwciA9IHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgICAgIGlmICh0cy5pc0lkZW50aWZpZXIob3JpZ2luRXhwcikgJiYgb3JpZ2luRXhwci50ZXh0ID09PSAnd2luZG93Jykge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGVzIHVzYWdlcyBvZiBwbGFpbiBpZGVudGlmaWVyIHdpdGggdGhlIG5hbWUgXCJIYW1tZXJcIi4gVGhlc2UgdXNhZ2VcbiAgICAvLyBhcmUgdmFsaWQgaWYgdGhleSByZXNvbHZlIHRvIFwiQHR5cGVzL2hhbW1lcmpzXCIuIGUuZy4gXCJuZXcgSGFtbWVyKG15RWxlbWVudClcIi5cbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpICYmIG5vZGUudGV4dCA9PT0gJ0hhbW1lcicgJiZcbiAgICAgICAgIXRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUucGFyZW50KSAmJiAhdHMuaXNFbGVtZW50QWNjZXNzRXhwcmVzc2lvbihub2RlLnBhcmVudCkpIHtcbiAgICAgIGNvbnN0IHN5bWJvbCA9IHRoaXMuX2dldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKG5vZGUpO1xuICAgICAgaWYgKHN5bWJvbCAmJiBzeW1ib2wudmFsdWVEZWNsYXJhdGlvbiAmJlxuICAgICAgICAgIHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZS5pbmNsdWRlcygnQHR5cGVzL2hhbW1lcmpzJykpIHtcbiAgICAgICAgdGhpcy5fdXNlZEluUnVudGltZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSByZWZlcmVuY2VzIHRoZSBnZXN0dXJlIGNvbmZpZyBmcm9tIEFuZ3VsYXIgTWF0ZXJpYWwuXG4gICAqIElmIHNvLCB3ZSBrZWVwIHRyYWNrIG9mIHRoZSBmb3VuZCBzeW1ib2wgcmVmZXJlbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JNYXRlcmlhbEdlc3R1cmVDb25maWcobm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkpIHtcbiAgICAgIGNvbnN0IGltcG9ydERhdGEgPSBnZXRJbXBvcnRPZklkZW50aWZpZXIobm9kZSwgdGhpcy50eXBlQ2hlY2tlcik7XG4gICAgICBpZiAoaW1wb3J0RGF0YSAmJiBpbXBvcnREYXRhLnN5bWJvbE5hbWUgPT09IEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUgJiZcbiAgICAgICAgICBpbXBvcnREYXRhLm1vZHVsZU5hbWUuc3RhcnRzV2l0aCgnQGFuZ3VsYXIvbWF0ZXJpYWwvJykpIHtcbiAgICAgICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMucHVzaChcbiAgICAgICAgICAgIHtub2RlLCBpbXBvcnREYXRhLCBpc0ltcG9ydDogdHMuaXNJbXBvcnRTcGVjaWZpZXIobm9kZS5wYXJlbnQpfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gSGFtbWVyIGdlc3R1cmUgY29uZmlnIHRva2VuIHJlZmVyZW5jZSBpcyBwYXJ0IG9mIGFuXG4gICAqIEFuZ3VsYXIgcHJvdmlkZXIgZGVmaW5pdGlvbiB0aGF0IHNldHMgdXAgYSBjdXN0b20gZ2VzdHVyZSBjb25maWcuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0ZvckN1c3RvbUdlc3R1cmVDb25maWdTZXR1cCh0b2tlblJlZjogSWRlbnRpZmllclJlZmVyZW5jZSk6IGJvb2xlYW4ge1xuICAgIC8vIFdhbGsgdXAgdGhlIHRyZWUgdG8gbG9vayBmb3IgYSBwYXJlbnQgcHJvcGVydHkgYXNzaWdubWVudCBvZiB0aGVcbiAgICAvLyByZWZlcmVuY2UgdG8gdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZyB0b2tlbi5cbiAgICBsZXQgcHJvcGVydHlBc3NpZ25tZW50OiB0cy5Ob2RlID0gdG9rZW5SZWYubm9kZTtcbiAgICB3aGlsZSAocHJvcGVydHlBc3NpZ25tZW50ICYmICF0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwcm9wZXJ0eUFzc2lnbm1lbnQpKSB7XG4gICAgICBwcm9wZXJ0eUFzc2lnbm1lbnQgPSBwcm9wZXJ0eUFzc2lnbm1lbnQucGFyZW50O1xuICAgIH1cblxuICAgIGlmICghcHJvcGVydHlBc3NpZ25tZW50IHx8ICF0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwcm9wZXJ0eUFzc2lnbm1lbnQpIHx8XG4gICAgICAgIGdldFByb3BlcnR5TmFtZVRleHQocHJvcGVydHlBc3NpZ25tZW50Lm5hbWUpICE9PSAncHJvdmlkZScpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBvYmplY3RMaXRlcmFsRXhwciA9IHByb3BlcnR5QXNzaWdubWVudC5wYXJlbnQ7XG4gICAgY29uc3QgbWF0Y2hpbmdJZGVudGlmaWVycyA9IGZpbmRNYXRjaGluZ0NoaWxkTm9kZXMob2JqZWN0TGl0ZXJhbEV4cHIsIHRzLmlzSWRlbnRpZmllcik7XG5cbiAgICAvLyBXZSBuYWl2ZWx5IGFzc3VtZSB0aGF0IGlmIHRoZXJlIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBcIkdlc3R1cmVDb25maWdcIiBleHBvcnRcbiAgICAvLyBmcm9tIEFuZ3VsYXIgTWF0ZXJpYWwgaW4gdGhlIHByb3ZpZGVyIGxpdGVyYWwsIHRoYXQgdGhlIHByb3ZpZGVyIHNldHMgdXAgdGhlXG4gICAgLy8gQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICByZXR1cm4gIXRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLnNvbWUociA9PiBtYXRjaGluZ0lkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgYW4gYXZhaWxhYmxlIGZpbGUgbmFtZSBmb3IgdGhlIGdlc3R1cmUgY29uZmlnIHdoaWNoIHNob3VsZFxuICAgKiBiZSBzdG9yZWQgaW4gdGhlIHNwZWNpZmllZCBmaWxlIHBhdGguXG4gICAqL1xuICBwcml2YXRlIF9nZXRBdmFpbGFibGVHZXN0dXJlQ29uZmlnRmlsZU5hbWUoc291cmNlUm9vdDogRGV2a2l0UGF0aCkge1xuICAgIGlmICghdGhpcy50cmVlLmV4aXN0cyhkZXZraXRKb2luKHNvdXJjZVJvb3QsIGAke0dFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRX0udHNgKSkpIHtcbiAgICAgIHJldHVybiBgJHtHRVNUVVJFX0NPTkZJR19GSUxFX05BTUV9LnRzYDtcbiAgICB9XG5cbiAgICBsZXQgcG9zc2libGVOYW1lID0gYCR7R0VTVFVSRV9DT05GSUdfRklMRV9OQU1FfS1gO1xuICAgIGxldCBpbmRleCA9IDE7XG4gICAgd2hpbGUgKHRoaXMudHJlZS5leGlzdHMoZGV2a2l0Sm9pbihzb3VyY2VSb290LCBgJHtwb3NzaWJsZU5hbWV9LSR7aW5kZXh9LnRzYCkpKSB7XG4gICAgICBpbmRleCsrO1xuICAgIH1cbiAgICByZXR1cm4gYCR7cG9zc2libGVOYW1lICsgaW5kZXh9LnRzYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlcyBhIGdpdmVuIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZSBieSBlbnN1cmluZyB0aGF0IGl0IGlzIGltcG9ydGVkXG4gICAqIGZyb20gdGhlIG5ldyBzcGVjaWZpZWQgcGF0aC5cbiAgICovXG4gIHByaXZhdGUgX3JlcGxhY2VHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKFxuICAgICAge25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0fTogSWRlbnRpZmllclJlZmVyZW5jZSwgbmV3UGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5nZXRVcGRhdGVSZWNvcmRlcihzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICBjb25zdCBuZXdNb2R1bGVTcGVjaWZpZXIgPSBnZXRNb2R1bGVTcGVjaWZpZXIobmV3UGF0aCwgc291cmNlRmlsZS5maWxlTmFtZSk7XG5cbiAgICAvLyBMaXN0IG9mIGFsbCBpZGVudGlmaWVycyByZWZlcnJpbmcgdG8gdGhlIGdlc3R1cmUgY29uZmlnIGluIHRoZSBjdXJyZW50IGZpbGUuIFRoaXNcbiAgICAvLyBhbGxvd3MgdXMgdG8gYWRkIGFuIGltcG9ydCBmb3IgdGhlIGNvcGllZCBnZXN0dXJlIGNvbmZpZ3VyYXRpb24gd2l0aG91dCBnZW5lcmF0aW5nIGFcbiAgICAvLyBuZXcgaWRlbnRpZmllciBmb3IgdGhlIGltcG9ydCB0byBhdm9pZCBjb2xsaXNpb25zLiBpLmUuIFwiR2VzdHVyZUNvbmZpZ18xXCIuIFRoZSBpbXBvcnRcbiAgICAvLyBtYW5hZ2VyIGNoZWNrcyBmb3IgcG9zc2libGUgbmFtZSBjb2xsaXNpb25zLCBidXQgaXMgYWJsZSB0byBpZ25vcmUgc3BlY2lmaWMgaWRlbnRpZmllcnMuXG4gICAgLy8gV2UgdXNlIHRoaXMgdG8gaWdub3JlIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBvcmlnaW5hbCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLFxuICAgIC8vIGJlY2F1c2UgdGhlc2Ugd2lsbCBiZSByZXBsYWNlZCBhbmQgdGhlcmVmb3JlIHdpbGwgbm90IGludGVyZmVyZS5cbiAgICBjb25zdCBnZXN0dXJlSWRlbnRpZmllcnNJbkZpbGUgPSB0aGlzLl9nZXRHZXN0dXJlQ29uZmlnSWRlbnRpZmllcnNPZkZpbGUoc291cmNlRmlsZSk7XG5cbiAgICAvLyBJZiB0aGUgcGFyZW50IG9mIHRoZSBpZGVudGlmaWVyIGlzIGFjY2Vzc2VkIHRocm91Z2ggYSBuYW1lc3BhY2UsIHdlIGNhbiBqdXN0XG4gICAgLy8gaW1wb3J0IHRoZSBuZXcgZ2VzdHVyZSBjb25maWcgd2l0aG91dCByZXdyaXRpbmcgdGhlIGltcG9ydCBkZWNsYXJhdGlvbiBiZWNhdXNlXG4gICAgLy8gdGhlIGNvbmZpZyBoYXMgYmVlbiBpbXBvcnRlZCB0aHJvdWdoIGEgbmFtZXNwYWNlZCBpbXBvcnQuXG4gICAgaWYgKGlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZSkpIHtcbiAgICAgIGNvbnN0IG5ld0V4cHJlc3Npb24gPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgICBzb3VyY2VGaWxlLCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLCBuZXdNb2R1bGVTcGVjaWZpZXIsIGZhbHNlLFxuICAgICAgICAgIGdlc3R1cmVJZGVudGlmaWVyc0luRmlsZSk7XG5cbiAgICAgIHJlY29yZGVyLnJlbW92ZShub2RlLnBhcmVudC5nZXRTdGFydCgpLCBub2RlLnBhcmVudC5nZXRXaWR0aCgpKTtcbiAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5vZGUucGFyZW50LmdldFN0YXJ0KCksIHRoaXMuX3ByaW50Tm9kZShuZXdFeHByZXNzaW9uLCBzb3VyY2VGaWxlKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRGVsZXRlIHRoZSBvbGQgaW1wb3J0IHRvIHRoZSBcIkdlc3R1cmVDb25maWdcIi5cbiAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChcbiAgICAgICAgc291cmNlRmlsZSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lKTtcblxuICAgIC8vIElmIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBpcyBub3QgZnJvbSBpbnNpZGUgb2YgYSBpbXBvcnQsIHdlIG5lZWQgdG8gYWRkIGEgbmV3XG4gICAgLy8gaW1wb3J0IHRvIHRoZSBjb3BpZWQgZ2VzdHVyZSBjb25maWcgYW5kIHJlcGxhY2UgdGhlIGlkZW50aWZpZXIuIEZvciByZWZlcmVuY2VzXG4gICAgLy8gd2l0aGluIGFuIGltcG9ydCwgd2UgZG8gbm90aGluZyBidXQgcmVtb3ZpbmcgdGhlIGFjdHVhbCBpbXBvcnQuIFRoaXMgYWxsb3dzIHVzXG4gICAgLy8gdG8gcmVtb3ZlIHVudXNlZCBpbXBvcnRzIHRvIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICBpZiAoIWlzSW1wb3J0KSB7XG4gICAgICBjb25zdCBuZXdFeHByZXNzaW9uID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgICAgc291cmNlRmlsZSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSwgbmV3TW9kdWxlU3BlY2lmaWVyLCBmYWxzZSxcbiAgICAgICAgICBnZXN0dXJlSWRlbnRpZmllcnNJbkZpbGUpO1xuXG4gICAgICByZWNvcmRlci5yZW1vdmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCkpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQobm9kZS5nZXRTdGFydCgpLCB0aGlzLl9wcmludE5vZGUobmV3RXhwcmVzc2lvbiwgc291cmNlRmlsZSkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgZ2l2ZW4gZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlIGFuZCBpdHMgY29ycmVzcG9uZGluZyBpbXBvcnQgZnJvbVxuICAgKiBpdHMgY29udGFpbmluZyBzb3VyY2UgZmlsZS4gSW1wb3J0cyB3aWxsIGJlIGFsd2F5cyByZW1vdmVkLCBidXQgaW4gc29tZSBjYXNlcyxcbiAgICogd2hlcmUgaXQncyBub3QgZ3VhcmFudGVlZCB0aGF0IGEgcmVtb3ZhbCBjYW4gYmUgcGVyZm9ybWVkIHNhZmVseSwgd2UganVzdFxuICAgKiBjcmVhdGUgYSBtaWdyYXRpb24gZmFpbHVyZSAoYW5kIGFkZCBhIFRPRE8gaWYgcG9zc2libGUpLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZSh7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnR9OiBJZGVudGlmaWVyUmVmZXJlbmNlKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5nZXRVcGRhdGVSZWNvcmRlcihzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICAvLyBPbmx5IHJlbW92ZSB0aGUgaW1wb3J0IGZvciB0aGUgZ2VzdHVyZSBjb25maWcgaWYgdGhlIGdlc3R1cmUgY29uZmlnIGhhc1xuICAgIC8vIGJlZW4gYWNjZXNzZWQgdGhyb3VnaCBhIG5vbi1uYW1lc3BhY2VkIGlkZW50aWZpZXIgYWNjZXNzLlxuICAgIGlmICghaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2Vzcyhub2RlKSkge1xuICAgICAgdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoXG4gICAgICAgICAgc291cmNlRmlsZSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lKTtcbiAgICB9XG5cbiAgICAvLyBGb3IgcmVmZXJlbmNlcyBmcm9tIHdpdGhpbiBhbiBpbXBvcnQsIHdlIGRvIG5vdCBuZWVkIHRvIGRvIGFueXRoaW5nIG90aGVyIHRoYW5cbiAgICAvLyByZW1vdmluZyB0aGUgaW1wb3J0LiBGb3Igb3RoZXIgcmVmZXJlbmNlcywgd2UgcmVtb3ZlIHRoZSBpbXBvcnQgYW5kIHRoZSByZWZlcmVuY2VcbiAgICAvLyBpZGVudGlmaWVyIGlmIHVzZWQgaW5zaWRlIG9mIGEgcHJvdmlkZXIgZGVmaW5pdGlvbi5cbiAgICBpZiAoaXNJbXBvcnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcm92aWRlckFzc2lnbm1lbnQgPSBub2RlLnBhcmVudDtcblxuICAgIC8vIE9ubHkgcmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlIGdlc3R1cmUgY29uZmlnIHdoaWNoIGFyZSBwYXJ0IG9mIGEgc3RhdGljYWxseVxuICAgIC8vIGFuYWx5emFibGUgcHJvdmlkZXIgZGVmaW5pdGlvbi4gV2Ugb25seSBzdXBwb3J0IHRoZSBjb21tb24gY2FzZSBvZiBhIGdlc3R1cmVcbiAgICAvLyBjb25maWcgcHJvdmlkZXIgZGVmaW5pdGlvbiB3aGVyZSB0aGUgY29uZmlnIGlzIHNldCB1cCB0aHJvdWdoIFwidXNlQ2xhc3NcIi5cbiAgICAvLyBPdGhlcndpc2UsIGl0J3Mgbm90IGd1YXJhbnRlZWQgdGhhdCB3ZSBjYW4gc2FmZWx5IHJlbW92ZSB0aGUgcHJvdmlkZXIgZGVmaW5pdGlvbi5cbiAgICBpZiAoIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3ZpZGVyQXNzaWdubWVudCkgfHxcbiAgICAgICAgZ2V0UHJvcGVydHlOYW1lVGV4dChwcm92aWRlckFzc2lnbm1lbnQubmFtZSkgIT09ICd1c2VDbGFzcycpIHtcbiAgICAgIHRoaXMuX25vZGVGYWlsdXJlcy5wdXNoKHtub2RlLCBtZXNzYWdlOiBDQU5OT1RfUkVNT1ZFX1JFRkVSRU5DRV9FUlJPUn0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9iamVjdExpdGVyYWxFeHByID0gcHJvdmlkZXJBc3NpZ25tZW50LnBhcmVudDtcbiAgICBjb25zdCBwcm92aWRlVG9rZW4gPSBvYmplY3RMaXRlcmFsRXhwci5wcm9wZXJ0aWVzLmZpbmQoXG4gICAgICAgIChwKTogcCBpcyB0cy5Qcm9wZXJ0eUFzc2lnbm1lbnQgPT5cbiAgICAgICAgICAgIHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHApICYmIGdldFByb3BlcnR5TmFtZVRleHQocC5uYW1lKSA9PT0gJ3Byb3ZpZGUnKTtcblxuICAgIC8vIERvIG5vdCByZW1vdmUgdGhlIHJlZmVyZW5jZSBpZiB0aGUgZ2VzdHVyZSBjb25maWcgaXMgbm90IHBhcnQgb2YgYSBwcm92aWRlciBkZWZpbml0aW9uLFxuICAgIC8vIG9yIGlmIHRoZSBwcm92aWRlZCB0b2tlIGlzIG5vdCByZWZlcnJpbmcgdG8gdGhlIGtub3duIEhBTU1FUl9HRVNUVVJFX0NPTkZJRyB0b2tlblxuICAgIC8vIGZyb20gcGxhdGZvcm0tYnJvd3Nlci5cbiAgICBpZiAoIXByb3ZpZGVUb2tlbiB8fCAhdGhpcy5faXNSZWZlcmVuY2VUb0hhbW1lckNvbmZpZ1Rva2VuKHByb3ZpZGVUb2tlbi5pbml0aWFsaXplcikpIHtcbiAgICAgIHRoaXMuX25vZGVGYWlsdXJlcy5wdXNoKHtub2RlLCBtZXNzYWdlOiBDQU5OT1RfUkVNT1ZFX1JFRkVSRU5DRV9FUlJPUn0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENvbGxlY3QgYWxsIG5lc3RlZCBpZGVudGlmaWVycyB3aGljaCB3aWxsIGJlIGRlbGV0ZWQuIFRoaXMgaGVscHMgdXNcbiAgICAvLyBkZXRlcm1pbmluZyBpZiB3ZSBjYW4gcmVtb3ZlIGltcG9ydHMgZm9yIHRoZSBcIkhBTU1FUl9HRVNUVVJFX0NPTkZJR1wiIHRva2VuLlxuICAgIHRoaXMuX2RlbGV0ZWRJZGVudGlmaWVycy5wdXNoKC4uLmZpbmRNYXRjaGluZ0NoaWxkTm9kZXMob2JqZWN0TGl0ZXJhbEV4cHIsIHRzLmlzSWRlbnRpZmllcikpO1xuXG4gICAgLy8gSW4gY2FzZSB0aGUgZm91bmQgcHJvdmlkZXIgZGVmaW5pdGlvbiBpcyBub3QgcGFydCBvZiBhbiBhcnJheSBsaXRlcmFsLFxuICAgIC8vIHdlIGNhbm5vdCBzYWZlbHkgcmVtb3ZlIHRoZSBwcm92aWRlci4gVGhpcyBpcyBiZWNhdXNlIGl0IGNvdWxkIGJlIGRlY2xhcmVkXG4gICAgLy8gYXMgYSB2YXJpYWJsZS4gZS5nLiBcImNvbnN0IGdlc3R1cmVQcm92aWRlciA9IHtwcm92aWRlOiAuLiwgdXNlQ2xhc3M6IEdlc3R1cmVDb25maWd9XCIuXG4gICAgLy8gSW4gdGhhdCBjYXNlLCB3ZSBqdXN0IGFkZCBhbiBlbXB0eSBvYmplY3QgbGl0ZXJhbCB3aXRoIFRPRE8gYW5kIHByaW50IGEgZmFpbHVyZS5cbiAgICBpZiAoIXRzLmlzQXJyYXlMaXRlcmFsRXhwcmVzc2lvbihvYmplY3RMaXRlcmFsRXhwci5wYXJlbnQpKSB7XG4gICAgICByZWNvcmRlci5yZW1vdmUob2JqZWN0TGl0ZXJhbEV4cHIuZ2V0U3RhcnQoKSwgb2JqZWN0TGl0ZXJhbEV4cHIuZ2V0V2lkdGgoKSk7XG4gICAgICByZWNvcmRlci5pbnNlcnRSaWdodChvYmplY3RMaXRlcmFsRXhwci5nZXRTdGFydCgpLCBgLyogVE9ETzogcmVtb3ZlICovIHt9YCk7XG4gICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7XG4gICAgICAgIG5vZGU6IG9iamVjdExpdGVyYWxFeHByLFxuICAgICAgICBtZXNzYWdlOiBgVW5hYmxlIHRvIGRlbGV0ZSBwcm92aWRlciBkZWZpbml0aW9uIGZvciBcIkdlc3R1cmVDb25maWdcIiBjb21wbGV0ZWx5LiBgICtcbiAgICAgICAgICAgIGBQbGVhc2UgY2xlYW4gdXAgdGhlIHByb3ZpZGVyLmBcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZXMgdGhlIG9iamVjdCBsaXRlcmFsIGZyb20gdGhlIHBhcmVudCBhcnJheSBleHByZXNzaW9uLiBSZW1vdmVzXG4gICAgLy8gdGhlIHRyYWlsaW5nIGNvbW1hIHRva2VuIGlmIHByZXNlbnQuXG4gICAgcmVtb3ZlRWxlbWVudEZyb21BcnJheUV4cHJlc3Npb24ob2JqZWN0TGl0ZXJhbEV4cHIsIHJlY29yZGVyKTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIHRoZSBnaXZlbiBoYW1tZXIgY29uZmlnIHRva2VuIGltcG9ydCBpZiBpdCBpcyBub3QgdXNlZC4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyQ29uZmlnVG9rZW5JbXBvcnRJZlVudXNlZCh7bm9kZSwgaW1wb3J0RGF0YX06IElkZW50aWZpZXJSZWZlcmVuY2UpIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgaXNUb2tlblVzZWQgPSB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShcbiAgICAgICAgciA9PiAhci5pc0ltcG9ydCAmJiAhaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2VzcyhyLm5vZGUpICYmXG4gICAgICAgICAgICByLm5vZGUuZ2V0U291cmNlRmlsZSgpID09PSBzb3VyY2VGaWxlICYmICF0aGlzLl9kZWxldGVkSWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSk7XG5cbiAgICAvLyBXZSBkb24ndCB3YW50IHRvIHJlbW92ZSB0aGUgaW1wb3J0IGZvciB0aGUgdG9rZW4gaWYgdGhlIHRva2VuIGlzXG4gICAgLy8gc3RpbGwgdXNlZCBzb21ld2hlcmUuXG4gICAgaWYgKCFpc1Rva2VuVXNlZCkge1xuICAgICAgdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoXG4gICAgICAgICAgc291cmNlRmlsZSwgSEFNTUVSX0NPTkZJR19UT0tFTl9OQU1FLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZW1vdmVzIEhhbW1lciBmcm9tIGFsbCBpbmRleCBIVE1MIGZpbGVzIG9mIHRoZSBnaXZlbiBwcm9qZWN0LiAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJGcm9tSW5kZXhGaWxlKHByb2plY3Q6IFdvcmtzcGFjZVByb2plY3QpIHtcbiAgICBjb25zdCBpbmRleEZpbGVQYXRocyA9IGdldFByb2plY3RJbmRleEZpbGVzKHByb2plY3QpO1xuICAgIGluZGV4RmlsZVBhdGhzLmZvckVhY2goZmlsZVBhdGggPT4ge1xuICAgICAgaWYgKCF0aGlzLnRyZWUuZXhpc3RzKGZpbGVQYXRoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGh0bWxDb250ZW50ID0gdGhpcy50cmVlLnJlYWQoZmlsZVBhdGgpIS50b1N0cmluZygndXRmOCcpO1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKGZpbGVQYXRoKTtcblxuICAgICAgZmluZEhhbW1lclNjcmlwdEltcG9ydEVsZW1lbnRzKGh0bWxDb250ZW50KVxuICAgICAgICAgIC5mb3JFYWNoKGVsID0+IHJlbW92ZUVsZW1lbnRGcm9tSHRtbChlbCwgcmVjb3JkZXIpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSBIYW1tZXIgZ2VzdHVyZSBjb25maWcgcHJvdmlkZXIgaW4gdGhlIGFwcCBtb2R1bGUgaWYgbmVlZGVkLiAqL1xuICBwcml2YXRlIF9zZXR1cEhhbW1lckdlc3R1cmVzSW5BcHBNb2R1bGUocHJvamVjdDogV29ya3NwYWNlUHJvamVjdCwgZ2VzdHVyZUNvbmZpZ1BhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IG1haW5GaWxlUGF0aCA9IGpvaW4odGhpcy5iYXNlUGF0aCwgZ2V0UHJvamVjdE1haW5GaWxlKHByb2plY3QpKTtcbiAgICBjb25zdCBtYWluRmlsZSA9IHRoaXMucHJvZ3JhbS5nZXRTb3VyY2VGaWxlKG1haW5GaWxlUGF0aCk7XG4gICAgaWYgKCFtYWluRmlsZSkge1xuICAgICAgdGhpcy5mYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgZmlsZVBhdGg6IG1haW5GaWxlUGF0aCxcbiAgICAgICAgbWVzc2FnZTogQ0FOTk9UX1NFVFVQX0FQUF9NT0RVTEVfRVJST1IsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhcHBNb2R1bGVFeHByID0gZmluZE1haW5Nb2R1bGVFeHByZXNzaW9uKG1haW5GaWxlKTtcbiAgICBpZiAoIWFwcE1vZHVsZUV4cHIpIHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiBtYWluRmlsZVBhdGgsXG4gICAgICAgIG1lc3NhZ2U6IENBTk5PVF9TRVRVUF9BUFBfTU9EVUxFX0VSUk9SLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYXBwTW9kdWxlU3ltYm9sID0gdGhpcy5fZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUodW53cmFwRXhwcmVzc2lvbihhcHBNb2R1bGVFeHByKSk7XG4gICAgaWYgKCFhcHBNb2R1bGVTeW1ib2wgfHwgIWFwcE1vZHVsZVN5bWJvbC52YWx1ZURlY2xhcmF0aW9uKSB7XG4gICAgICB0aGlzLmZhaWx1cmVzLnB1c2goe1xuICAgICAgICBmaWxlUGF0aDogbWFpbkZpbGVQYXRoLFxuICAgICAgICBtZXNzYWdlOiBDQU5OT1RfU0VUVVBfQVBQX01PRFVMRV9FUlJPUixcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBhcHBNb2R1bGVTeW1ib2wudmFsdWVEZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmUodGhpcy5iYXNlUGF0aCwgc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgY29uc3QgaGFtbWVyTW9kdWxlRXhwciA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICBzb3VyY2VGaWxlLCBIQU1NRVJfTU9EVUxFX05BTUUsIEhBTU1FUl9NT0RVTEVfSU1QT1JUKTtcbiAgICBjb25zdCBoYW1tZXJDb25maWdUb2tlbkV4cHIgPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgc291cmNlRmlsZSwgSEFNTUVSX0NPTkZJR19UT0tFTl9OQU1FLCBIQU1NRVJfQ09ORklHX1RPS0VOX01PRFVMRSk7XG4gICAgY29uc3QgZ2VzdHVyZUNvbmZpZ0V4cHIgPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgc291cmNlRmlsZSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSxcbiAgICAgICAgZ2V0TW9kdWxlU3BlY2lmaWVyKGdlc3R1cmVDb25maWdQYXRoLCBzb3VyY2VGaWxlLmZpbGVOYW1lKSwgZmFsc2UsXG4gICAgICAgIHRoaXMuX2dldEdlc3R1cmVDb25maWdJZGVudGlmaWVyc09mRmlsZShzb3VyY2VGaWxlKSk7XG5cbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZ2V0VXBkYXRlUmVjb3JkZXIoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgY29uc3QgbmV3UHJvdmlkZXJOb2RlID0gdHMuY3JlYXRlT2JqZWN0TGl0ZXJhbChbXG4gICAgICB0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQoJ3Byb3ZpZGUnLCBoYW1tZXJDb25maWdUb2tlbkV4cHIpLFxuICAgICAgdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KCd1c2VDbGFzcycsIGdlc3R1cmVDb25maWdFeHByKVxuICAgIF0pO1xuXG4gICAgLy8gSWYgbm8gXCJOZ01vZHVsZVwiIGRlZmluaXRpb24gaXMgZm91bmQgaW5zaWRlIHRoZSBzb3VyY2UgZmlsZSwgd2UganVzdCBkbyBub3RoaW5nLlxuICAgIGNvbnN0IG1ldGFkYXRhID0gZ2V0RGVjb3JhdG9yTWV0YWRhdGEoc291cmNlRmlsZSwgJ05nTW9kdWxlJywgJ0Bhbmd1bGFyL2NvcmUnKSBhc1xuICAgICAgICB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbltdO1xuICAgIGlmICghbWV0YWRhdGEubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdmlkZXJzRmllbGQgPSBnZXRNZXRhZGF0YUZpZWxkKG1ldGFkYXRhWzBdLCAncHJvdmlkZXJzJylbMF07XG4gICAgY29uc3QgaW1wb3J0c0ZpZWxkID0gZ2V0TWV0YWRhdGFGaWVsZChtZXRhZGF0YVswXSwgJ2ltcG9ydHMnKVswXTtcblxuICAgIGNvbnN0IHByb3ZpZGVySWRlbnRpZmllcnMgPVxuICAgICAgICBwcm92aWRlcnNGaWVsZCA/IGZpbmRNYXRjaGluZ0NoaWxkTm9kZXMocHJvdmlkZXJzRmllbGQsIHRzLmlzSWRlbnRpZmllcikgOiBudWxsO1xuICAgIGNvbnN0IGltcG9ydElkZW50aWZpZXJzID1cbiAgICAgICAgaW1wb3J0c0ZpZWxkID8gZmluZE1hdGNoaW5nQ2hpbGROb2RlcyhpbXBvcnRzRmllbGQsIHRzLmlzSWRlbnRpZmllcikgOiBudWxsO1xuICAgIGNvbnN0IGNoYW5nZUFjdGlvbnM6IENoYW5nZVtdID0gW107XG5cbiAgICAvLyBJZiB0aGUgcHJvdmlkZXJzIGZpZWxkIGV4aXN0cyBhbmQgYWxyZWFkeSBjb250YWlucyByZWZlcmVuY2VzIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZVxuICAgIC8vIGNvbmZpZyB0b2tlbiBhbmQgdGhlIGdlc3R1cmUgY29uZmlnLCB3ZSBuYWl2ZWx5IGFzc3VtZSB0aGF0IHRoZSBnZXN0dXJlIGNvbmZpZyBpc1xuICAgIC8vIGFscmVhZHkgc2V0IHVwLiBXZSBvbmx5IHdhbnQgdG8gYWRkIHRoZSBnZXN0dXJlIGNvbmZpZyBwcm92aWRlciBpZiBpdCBpcyBub3Qgc2V0IHVwLlxuICAgIGlmICghcHJvdmlkZXJJZGVudGlmaWVycyB8fFxuICAgICAgICAhKHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gcHJvdmlkZXJJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKSAmJlxuICAgICAgICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLnNvbWUociA9PiBwcm92aWRlcklkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpKSkge1xuICAgICAgY2hhbmdlQWN0aW9ucy5wdXNoKC4uLmFkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YShcbiAgICAgICAgICBzb3VyY2VGaWxlLCByZWxhdGl2ZVBhdGgsICdwcm92aWRlcnMnLCB0aGlzLl9wcmludE5vZGUobmV3UHJvdmlkZXJOb2RlLCBzb3VyY2VGaWxlKSxcbiAgICAgICAgICBudWxsKSk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaXMgbm90IGFscmVhZHkgaW1wb3J0ZWQgaW4gdGhlIGFwcCBtb2R1bGUsIHdlIHNldCBpdCB1cFxuICAgIC8vIGJ5IGFkZGluZyBpdCB0byB0aGUgXCJpbXBvcnRzXCIgZmllbGQuXG4gICAgaWYgKCFpbXBvcnRJZGVudGlmaWVycyB8fFxuICAgICAgICAhdGhpcy5faGFtbWVyTW9kdWxlUmVmZXJlbmNlcy5zb21lKHIgPT4gaW1wb3J0SWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSkpIHtcbiAgICAgIGNoYW5nZUFjdGlvbnMucHVzaCguLi5hZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEoXG4gICAgICAgICAgc291cmNlRmlsZSwgcmVsYXRpdmVQYXRoLCAnaW1wb3J0cycsIHRoaXMuX3ByaW50Tm9kZShoYW1tZXJNb2R1bGVFeHByLCBzb3VyY2VGaWxlKSxcbiAgICAgICAgICBudWxsKSk7XG4gICAgfVxuXG4gICAgY2hhbmdlQWN0aW9ucy5mb3JFYWNoKGNoYW5nZSA9PiB7XG4gICAgICBpZiAoY2hhbmdlIGluc3RhbmNlb2YgSW5zZXJ0Q2hhbmdlKSB7XG4gICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogUHJpbnRzIGEgZ2l2ZW4gbm9kZSB3aXRoaW4gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS4gKi9cbiAgcHJpdmF0ZSBfcHJpbnROb2RlKG5vZGU6IHRzLk5vZGUsIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgbm9kZSwgc291cmNlRmlsZSk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgcmVmZXJlbmNlZCBnZXN0dXJlIGNvbmZpZyBpZGVudGlmaWVycyBvZiBhIGdpdmVuIHNvdXJjZSBmaWxlICovXG4gIHByaXZhdGUgX2dldEdlc3R1cmVDb25maWdJZGVudGlmaWVyc09mRmlsZShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogdHMuSWRlbnRpZmllcltdIHtcbiAgICByZXR1cm4gdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuZmlsdGVyKGQgPT4gZC5ub2RlLmdldFNvdXJjZUZpbGUoKSA9PT0gc291cmNlRmlsZSlcbiAgICAgICAgLm1hcChkID0+IGQubm9kZSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc3ltYm9sIHRoYXQgY29udGFpbnMgdGhlIHZhbHVlIGRlY2xhcmF0aW9uIG9mIHRoZSBzcGVjaWZpZWQgbm9kZS4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZTogdHMuTm9kZSk6IHRzLlN5bWJvbHx1bmRlZmluZWQge1xuICAgIGNvbnN0IHN5bWJvbCA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihub2RlKTtcblxuICAgIC8vIFN5bWJvbHMgY2FuIGJlIGFsaWFzZXMgb2YgdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC4gZS5nLiBpbiBuYW1lZCBpbXBvcnQgc3BlY2lmaWVycy5cbiAgICAvLyBXZSBuZWVkIHRvIHJlc29sdmUgdGhlIGFsaWFzZWQgc3ltYm9sIGJhY2sgdG8gdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYml0d2lzZVxuICAgIGlmIChzeW1ib2wgJiYgKHN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSAhPT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudHlwZUNoZWNrZXIuZ2V0QWxpYXNlZFN5bWJvbChzeW1ib2wpO1xuICAgIH1cbiAgICByZXR1cm4gc3ltYm9sO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBleHByZXNzaW9uIHJlc29sdmVzIHRvIGEgaGFtbWVyIGdlc3R1cmUgY29uZmlnXG4gICAqIHRva2VuIHJlZmVyZW5jZSBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfaXNSZWZlcmVuY2VUb0hhbW1lckNvbmZpZ1Rva2VuKGV4cHI6IHRzLkV4cHJlc3Npb24pIHtcbiAgICBjb25zdCB1bndyYXBwZWQgPSB1bndyYXBFeHByZXNzaW9uKGV4cHIpO1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIodW53cmFwcGVkKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gci5ub2RlID09PSB1bndyYXBwZWQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24odW53cmFwcGVkKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gci5ub2RlID09PSB1bndyYXBwZWQubmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIG1pZ3JhdGlvbiBmYWlsdXJlcyBvZiB0aGUgY29sbGVjdGVkIG5vZGUgZmFpbHVyZXMuIFRoZSByZXR1cm5lZCBtaWdyYXRpb25cbiAgICogZmFpbHVyZXMgYXJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgcG9zdC1taWdyYXRpb24gc3RhdGUgb2Ygc291cmNlIGZpbGVzLiBNZWFuaW5nXG4gICAqIHRoYXQgZmFpbHVyZSBwb3NpdGlvbnMgYXJlIGNvcnJlY3RlZCBpZiBzb3VyY2UgZmlsZSBtb2RpZmljYXRpb25zIHNoaWZ0ZWQgbGluZXMuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVNaWdyYXRpb25GYWlsdXJlcygpOiBNaWdyYXRpb25GYWlsdXJlW10ge1xuICAgIHJldHVybiB0aGlzLl9ub2RlRmFpbHVyZXMubWFwKCh7bm9kZSwgbWVzc2FnZX0pID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICAgIGNvbnN0IG9mZnNldCA9IG5vZGUuZ2V0U3RhcnQoKTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdHMuZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24obm9kZS5nZXRTb3VyY2VGaWxlKCksIG5vZGUuZ2V0U3RhcnQoKSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGlvbjogdGhpcy5faW1wb3J0TWFuYWdlci5jb3JyZWN0Tm9kZVBvc2l0aW9uKG5vZGUsIG9mZnNldCwgcG9zaXRpb24pLFxuICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICBmaWxlUGF0aDogc291cmNlRmlsZS5maWxlTmFtZSxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgcHJvamVjdCBmcm9tIHRoZSBjdXJyZW50IHByb2dyYW0gb3IgdGhyb3dzIGlmIG5vIHByb2plY3RcbiAgICogY291bGQgYmUgZm91bmQuXG4gICAqL1xuICBwcml2YXRlIF9nZXRQcm9qZWN0T3JUaHJvdygpOiBXb3Jrc3BhY2VQcm9qZWN0IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UodGhpcy50cmVlKTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Qcm9ncmFtKHdvcmtzcGFjZSwgdGhpcy5wcm9ncmFtKTtcblxuICAgIGlmICghcHJvamVjdCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oXG4gICAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIHByb2plY3QgdG8gcGVyZm9ybSBIYW1tZXJKUyB2OSBtaWdyYXRpb24uICcgK1xuICAgICAgICAgICdQbGVhc2UgZW5zdXJlIHlvdXIgd29ya3NwYWNlIGNvbmZpZ3VyYXRpb24gZGVmaW5lcyBhIHByb2plY3QuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2plY3Q7XG4gIH1cblxuICAvKiogR2xvYmFsIHN0YXRlIG9mIHdoZXRoZXIgSGFtbWVyIGlzIHVzZWQgaW4gYW55IGFuYWx5emVkIHByb2plY3QgdGFyZ2V0LiAqL1xuICBzdGF0aWMgZ2xvYmFsVXNlc0hhbW1lciA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBTdGF0aWMgbWlncmF0aW9uIHJ1bGUgbWV0aG9kIHRoYXQgd2lsbCBiZSBjYWxsZWQgb25jZSBhbGwgcHJvamVjdCB0YXJnZXRzXG4gICAqIGhhdmUgYmVlbiBtaWdyYXRlZCBpbmRpdmlkdWFsbHkuIFRoaXMgbWV0aG9kIGNhbiBiZSB1c2VkIHRvIG1ha2UgY2hhbmdlcyBiYXNlZFxuICAgKiBvbiB0aGUgYW5hbHlzaXMgb2YgdGhlIGluZGl2aWR1YWwgdGFyZ2V0cy4gRm9yIGV4YW1wbGU6IHdlIG9ubHkgcmVtb3ZlIEhhbW1lclxuICAgKiBmcm9tIHRoZSBcInBhY2thZ2UuanNvblwiIGlmIGl0IGlzIG5vdCB1c2VkIGluICphbnkqIHByb2plY3QgdGFyZ2V0LlxuICAgKi9cbiAgc3RhdGljIGdsb2JhbFBvc3RNaWdyYXRpb24odHJlZTogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCk6IFBvc3RNaWdyYXRpb25BY3Rpb24ge1xuICAgIGlmICghdGhpcy5nbG9iYWxVc2VzSGFtbWVyICYmIHRoaXMuX3JlbW92ZUhhbW1lckZyb21QYWNrYWdlSnNvbih0cmVlKSkge1xuICAgICAgLy8gU2luY2UgSGFtbWVyIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgd29ya3NwYWNlIFwicGFja2FnZS5qc29uXCIgZmlsZSxcbiAgICAgIC8vIHdlIHNjaGVkdWxlIGEgbm9kZSBwYWNrYWdlIGluc3RhbGwgdGFzayB0byByZWZyZXNoIHRoZSBsb2NrIGZpbGUuXG4gICAgICByZXR1cm4ge3J1blBhY2thZ2VNYW5hZ2VyOiB0cnVlfTtcbiAgICB9XG5cbiAgICBjb250ZXh0LmxvZ2dlci5pbmZvKGNoYWxrLnllbGxvdyhcbiAgICAgICAgJ+KaoCBUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIGNvbXBvbmVudHMgaXMgbm90IGFibGUgdG8gbWlncmF0ZSB0ZXN0cy4gJyArXG4gICAgICAgICdQbGVhc2UgbWFudWFsbHkgY2xlYW4gdXAgdGVzdHMgaW4geW91ciBwcm9qZWN0IGlmIHRoZXkgcmVseSBvbiBIYW1tZXJKUy4nKSk7XG5cbiAgICAvLyBDbGVhbiBnbG9iYWwgc3RhdGUgb25jZSB0aGUgd29ya3NwYWNlIGhhcyBiZWVuIG1pZ3JhdGVkLiBUaGlzIGlzIHRlY2huaWNhbGx5XG4gICAgLy8gbm90IG5lY2Vzc2FyeSBpbiBcIm5nIHVwZGF0ZVwiLCBidXQgaW4gdGVzdHMgd2UgcmUtdXNlIHRoZSBzYW1lIHJ1bGUgY2xhc3MuXG4gICAgdGhpcy5nbG9iYWxVc2VzSGFtbWVyID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgaGFtbWVyIHBhY2thZ2UgZnJvbSB0aGUgd29ya3NwYWNlIFwicGFja2FnZS5qc29uXCIuXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgSGFtbWVyIHdhcyBzZXQgdXAgYW5kIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgXCJwYWNrYWdlLmpzb25cIlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgX3JlbW92ZUhhbW1lckZyb21QYWNrYWdlSnNvbih0cmVlOiBUcmVlKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0cmVlLmV4aXN0cygnL3BhY2thZ2UuanNvbicpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHRyZWUucmVhZCgnL3BhY2thZ2UuanNvbicpIS50b1N0cmluZygndXRmOCcpKTtcblxuICAgIC8vIFdlIGRvIG5vdCBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgc29tZW9uZSBtYW51YWxseSBhZGRlZCBcImhhbW1lcmpzXCJcbiAgICAvLyB0byB0aGUgZGV2IGRlcGVuZGVuY2llcy5cbiAgICBpZiAocGFja2FnZUpzb24uZGVwZW5kZW5jaWVzW0hBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSXSkge1xuICAgICAgZGVsZXRlIHBhY2thZ2VKc29uLmRlcGVuZGVuY2llc1tIQU1NRVJfTU9EVUxFX1NQRUNJRklFUl07XG4gICAgICB0cmVlLm92ZXJ3cml0ZSgnL3BhY2thZ2UuanNvbicsIEpTT04uc3RyaW5naWZ5KHBhY2thZ2VKc29uLCBudWxsLCAyKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgdW53cmFwcyBhIGdpdmVuIGV4cHJlc3Npb24gaWYgaXQgaXMgd3JhcHBlZFxuICogYnkgcGFyZW50aGVzaXMsIHR5cGUgY2FzdHMgb3IgdHlwZSBhc3NlcnRpb25zLlxuICovXG5mdW5jdGlvbiB1bndyYXBFeHByZXNzaW9uKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlIHtcbiAgaWYgKHRzLmlzUGFyZW50aGVzaXplZEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9IGVsc2UgaWYgKHRzLmlzQXNFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgcmV0dXJuIHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgfSBlbHNlIGlmICh0cy5pc1R5cGVBc3NlcnRpb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9XG4gIHJldHVybiBub2RlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBzcGVjaWZpZWQgcGF0aCB0byBhIHZhbGlkIFR5cGVTY3JpcHQgbW9kdWxlIHNwZWNpZmllciB3aGljaCBpc1xuICogcmVsYXRpdmUgdG8gdGhlIGdpdmVuIGNvbnRhaW5pbmcgZmlsZS5cbiAqL1xuZnVuY3Rpb24gZ2V0TW9kdWxlU3BlY2lmaWVyKG5ld1BhdGg6IHN0cmluZywgY29udGFpbmluZ0ZpbGU6IHN0cmluZykge1xuICBsZXQgcmVzdWx0ID0gcmVsYXRpdmUoZGlybmFtZShjb250YWluaW5nRmlsZSksIG5ld1BhdGgpLnJlcGxhY2UoL1xcXFwvZywgJy8nKS5yZXBsYWNlKC9cXC50cyQvLCAnJyk7XG4gIGlmICghcmVzdWx0LnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgIHJlc3VsdCA9IGAuLyR7cmVzdWx0fWA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSBuYW1lLlxuICogQHJldHVybnMgVGV4dCBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgbmFtZS4gTnVsbCBpZiBub3Qgc3RhdGljYWxseSBhbmFseXphYmxlLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eU5hbWVUZXh0KG5vZGU6IHRzLlByb3BlcnR5TmFtZSk6IHN0cmluZ3xudWxsIHtcbiAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSB8fCB0cy5pc1N0cmluZ0xpdGVyYWxMaWtlKG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGUudGV4dDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBpZGVudGlmaWVyIGlzIHBhcnQgb2YgYSBuYW1lc3BhY2VkIGFjY2Vzcy4gKi9cbmZ1bmN0aW9uIGlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZTogdHMuSWRlbnRpZmllcik6IGJvb2xlYW4ge1xuICByZXR1cm4gdHMuaXNRdWFsaWZpZWROYW1lKG5vZGUucGFyZW50KSB8fCB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLnBhcmVudCk7XG59XG5cbi8qKlxuICogV2Fsa3MgdGhyb3VnaCB0aGUgc3BlY2lmaWVkIG5vZGUgYW5kIHJldHVybnMgYWxsIGNoaWxkIG5vZGVzIHdoaWNoIG1hdGNoIHRoZVxuICogZ2l2ZW4gcHJlZGljYXRlLlxuICovXG5mdW5jdGlvbiBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzPFQgZXh0ZW5kcyB0cy5Ob2RlPihcbiAgICBwYXJlbnQ6IHRzLk5vZGUsIHByZWRpY2F0ZTogKG5vZGU6IHRzLk5vZGUpID0+IG5vZGUgaXMgVCk6IFRbXSB7XG4gIGNvbnN0IHJlc3VsdDogVFtdID0gW107XG4gIGNvbnN0IHZpc2l0Tm9kZSA9IChub2RlOiB0cy5Ob2RlKSA9PiB7XG4gICAgaWYgKHByZWRpY2F0ZShub2RlKSkge1xuICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XG4gICAgfVxuICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCB2aXNpdE5vZGUpO1xuICB9O1xuICB0cy5mb3JFYWNoQ2hpbGQocGFyZW50LCB2aXNpdE5vZGUpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl19