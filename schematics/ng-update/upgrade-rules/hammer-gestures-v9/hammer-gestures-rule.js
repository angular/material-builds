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
        define("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-gestures-rule", ["require", "exports", "@angular-devkit/core", "@angular-devkit/schematics", "@angular-devkit/schematics/tasks", "@angular/cdk/schematics", "@schematics/angular/utility/ast-utils", "@schematics/angular/utility/change", "@schematics/angular/utility/config", "chalk", "fs", "path", "typescript", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/cli-workspace", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/find-hammer-script-tags", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/find-main-module", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-template-check", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/identifier-imports", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/import-manager", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/remove-array-element", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/remove-element-from-html"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const core_1 = require("@angular-devkit/core");
    const schematics_1 = require("@angular-devkit/schematics");
    const tasks_1 = require("@angular-devkit/schematics/tasks");
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
    const HAMMER_MODULE_SPECIFIER = 'hammerjs';
    const CANNOT_REMOVE_REFERENCE_ERROR = `Cannot remove reference to "GestureConfig". Please remove manually.`;
    const CANNOT_SETUP_APP_MODULE_ERROR = `Could not setup HammerJS gesture in module. Please ` +
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
             * List of identifiers which resolve to "HAMMER_GESTURE_CONFIG" token from
             * "@angular/platform-browser".
             */
            this._hammerConfigTokenReferences = [];
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
                // If hammer is only used at runtime, we don't need the gesture config
                // and can remove it (along with the hammer config token if possible)
                if (!this._usedInTemplate) {
                    this._removeGestureConfigSetup();
                }
                else {
                    this._setupHammerGestureConfig();
                }
            }
            else {
                // If HammerJS could not be detected, but we detected a custom gesture
                // config setup, we just remove all references to the Angular Material
                // gesture config. Otherwise we completely remove HammerJS from the app.
                if (hasCustomGestureConfigSetup) {
                    this._removeGestureConfigSetup();
                    // Print a message if we found a custom gesture config setup in combination with
                    // references to the Angular Material gesture config. This is ambiguous and the
                    // migration just removes the Material gesture config setup, but we still want
                    // to create an information message.
                    if (this._gestureConfigReferences.length) {
                        this.printInfo(chalk_1.default.yellow('The HammerJS v9 migration for Angular components detected that the Angular ' +
                            'Material gesture config is used while a custom gesture config is set up. The ' +
                            'migration removed all references to the Angular Material gesture config.'));
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
            // Setup the gesture config provider in the project app module if not done already.
            this._setupGestureConfigInAppModule(project, gestureConfigPath);
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
            this._removeGestureConfigSetup();
            this._removeHammerFromIndexFile(project);
        }
        /**
         * Removes the gesture config setup by deleting all found references
         * to a gesture config. Additionally, unused imports to the hammer gesture
         * config token from platform-browser are removed as well.
         */
        _removeGestureConfigSetup() {
            this._gestureConfigReferences.forEach(r => this._removeGestureConfigReference(r));
            this._hammerConfigTokenReferences.forEach(r => {
                if (r.isImport) {
                    this._removeHammerConfigTokenImportIfUnused(r);
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
            // List of all identifiers referring to the gesture config in the current file. This
            // allows us to add a import for the new gesture configuration without generating a
            // new unique identifier for the import. i.e. "GestureConfig_1". The import manager
            // checks for possible name collisions, but is able to ignore specific identifiers.
            const gestureIdentifiersInFile = this._gestureConfigReferences.filter(d => d.node.getSourceFile() === sourceFile)
                .map(d => d.node);
            const newModuleSpecifier = getModuleSpecifier(newPath, sourceFile.fileName);
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
        _setupGestureConfigInAppModule(project, configPath) {
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
            const hammerConfigTokenExpr = this._importManager.addImportToSourceFile(sourceFile, HAMMER_CONFIG_TOKEN_NAME, HAMMER_CONFIG_TOKEN_MODULE);
            const gestureConfigExpr = this._importManager.addImportToSourceFile(sourceFile, GESTURE_CONFIG_CLASS_NAME, getModuleSpecifier(configPath, sourceFile.fileName));
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
            const providerIdentifiers = providersField ? findMatchingChildNodes(providersField, ts.isIdentifier) : null;
            // If the providers field exists and already contains references to the hammer
            // gesture config token and the gesture config, we naively assume that the gesture
            // config is already set up. This check is slightly naive because it assumes that
            // references to these two tokens always mean that they are set up as a provider
            // definition. This is not guaranteed because it could be just by incident that
            // gesture config is somehow references in a different provider than for setting up
            // the gesture config token from platform-browser. This check can never be very
            // robust without actually interpreting the providers field like NGC or ngtsc would.
            // (this would involve partial interpretation with metadata.json file support)
            if (providerIdentifiers &&
                this._hammerConfigTokenReferences.some(r => providerIdentifiers.includes(r.node)) &&
                this._gestureConfigReferences.some(r => providerIdentifiers.includes(r.node))) {
                return;
            }
            const changeActions = ast_utils_1.addSymbolToNgModuleMetadata(sourceFile, relativePath, 'providers', this._printNode(newProviderNode, sourceFile), null);
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
                context.addTask(new tasks_1.NodePackageInstallTask({ quiet: false }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLWdlc3R1cmVzLXJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvdXBncmFkZS1ydWxlcy9oYW1tZXItZ2VzdHVyZXMtdjkvaGFtbWVyLWdlc3R1cmVzLXJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCwrQ0FJOEI7SUFDOUIsMkRBQXVGO0lBQ3ZGLDREQUF3RTtJQUN4RSx3REFPaUM7SUFDakMscUVBSStDO0lBQy9DLCtEQUFnRTtJQUNoRSwrREFBZ0U7SUFFaEUsaUNBQTBCO0lBQzFCLDJCQUFnQztJQUNoQywrQkFBNkM7SUFDN0MsaUNBQWlDO0lBRWpDLHlIQUFzRDtJQUN0RCw2SUFBeUU7SUFDekUsK0hBQTREO0lBQzVELHlJQUFpRTtJQUNqRSxtSUFBbUU7SUFDbkUsMkhBQStDO0lBQy9DLHVJQUF3RTtJQUN4RSwrSUFBaUU7SUFFakUsTUFBTSx5QkFBeUIsR0FBRyxlQUFlLENBQUM7SUFDbEQsTUFBTSx3QkFBd0IsR0FBRyxnQkFBZ0IsQ0FBQztJQUNsRCxNQUFNLDRCQUE0QixHQUFHLDJCQUEyQixDQUFDO0lBQ2pFLE1BQU0sd0JBQXdCLEdBQUcsdUJBQXVCLENBQUM7SUFDekQsTUFBTSwwQkFBMEIsR0FBRywyQkFBMkIsQ0FBQztJQUMvRCxNQUFNLHVCQUF1QixHQUFHLFVBQVUsQ0FBQztJQUUzQyxNQUFNLDZCQUE2QixHQUMvQixxRUFBcUUsQ0FBQztJQUUxRSxNQUFNLDZCQUE2QixHQUFHLHFEQUFxRDtRQUN6RiwyREFBMkQsQ0FBQztJQVE5RCxNQUFhLGtCQUFtQixTQUFRLDBCQUFtQjtRQUEzRDs7WUFDRSx5RkFBeUY7WUFDekYseUVBQXlFO1lBQ3pFLDRGQUE0RjtZQUM1RixnQkFBVyxHQUNQLENBQUMsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsR0FBRyxDQUFDO2dCQUNyRixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7WUFFZixhQUFRLEdBQUcsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzlCLG1CQUFjLEdBQUcsSUFBSSw4QkFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUUsa0JBQWEsR0FBdUMsRUFBRSxDQUFDO1lBRS9ELHFFQUFxRTtZQUM3RCxvQkFBZSxHQUFHLEtBQUssQ0FBQztZQUVoQywrQ0FBK0M7WUFDdkMsbUJBQWMsR0FBRyxLQUFLLENBQUM7WUFFL0I7OztlQUdHO1lBQ0ssb0JBQWUsR0FBMkIsRUFBRSxDQUFDO1lBRXJEOztlQUVHO1lBQ0ssNkJBQXdCLEdBQTBCLEVBQUUsQ0FBQztZQUU3RDs7O2VBR0c7WUFDSyxpQ0FBNEIsR0FBMEIsRUFBRSxDQUFDO1lBRWpFOzs7ZUFHRztZQUNLLHdCQUFtQixHQUFvQixFQUFFLENBQUM7UUFtbUJwRCxDQUFDO1FBam1CQyxhQUFhLENBQUMsUUFBMEI7WUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksZ0RBQXdCLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUN2RSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQzthQUM3QjtRQUNILENBQUM7UUFFRCxTQUFTLENBQUMsSUFBYTtZQUNyQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUVELFlBQVk7WUFDVixxRUFBcUU7WUFDckUsOENBQThDO1lBQzlDLE1BQU0sMkJBQTJCLEdBQzdCLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUzRixJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtnQkFDL0MsaUZBQWlGO2dCQUNqRixzRkFBc0Y7Z0JBQ3RGLG1GQUFtRjtnQkFDbkYseUJBQXlCO2dCQUN6QixrQkFBa0IsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Z0JBRTNDLHNFQUFzRTtnQkFDdEUscUVBQXFFO2dCQUNyRSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDekIsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7aUJBQ2xDO3FCQUFNO29CQUNMLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO2lCQUNsQzthQUNGO2lCQUFNO2dCQUNMLHNFQUFzRTtnQkFDdEUsc0VBQXNFO2dCQUN0RSx3RUFBd0U7Z0JBQ3hFLElBQUksMkJBQTJCLEVBQUU7b0JBQy9CLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO29CQUNqQyxnRkFBZ0Y7b0JBQ2hGLCtFQUErRTtvQkFDL0UsOEVBQThFO29CQUM5RSxvQ0FBb0M7b0JBQ3BDLElBQUksSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRTt3QkFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFLLENBQUMsTUFBTSxDQUN2Qiw2RUFBNkU7NEJBQzdFLCtFQUErRTs0QkFDL0UsMEVBQTBFLENBQUMsQ0FBQyxDQUFDO3FCQUNsRjtpQkFDRjtxQkFBTTtvQkFDTCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztpQkFDM0I7YUFDRjtZQUVELGlGQUFpRjtZQUNqRix1RkFBdUY7WUFDdkYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUVwQyxpRkFBaUY7WUFDakYsOEVBQThFO1lBQzlFLG1FQUFtRTtZQUNuRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQUM7WUFFdkQsaUZBQWlGO1lBQ2pGLG9GQUFvRjtZQUNwRixxRkFBcUY7WUFDckYsMEZBQTBGO1lBQzFGLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ2hELElBQUksQ0FBQyxTQUFTLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FDdkIsZ0VBQWdFO29CQUNoRSx1RkFBdUY7b0JBQ3ZGLGtFQUFrRSxDQUFDLENBQUMsQ0FBQzthQUMxRTtRQUNILENBQUM7UUFFRDs7Ozs7Ozs7V0FRRztRQUNLLHlCQUF5QjtZQUMvQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMxQyxNQUFNLFVBQVUsR0FBRyxnQkFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0saUJBQWlCLEdBQ25CLFdBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFFaEYscURBQXFEO1lBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUNaLGlCQUFpQixFQUFFLGlCQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFNUYsNERBQTREO1lBQzVELElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQ2pDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFFcEUsbUZBQW1GO1lBQ25GLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUNsRSxDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSyxrQkFBa0I7WUFDeEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFFMUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFcEYsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFFRDs7OztXQUlHO1FBQ0sseUJBQXlCO1lBQy9CLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVsRixJQUFJLENBQUMsNEJBQTRCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUM1QyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUU7b0JBQ2QsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNoRDtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVEOzs7V0FHRztRQUNLLGlDQUFpQyxDQUFDLElBQWE7WUFDckQsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN6QixNQUFNLFVBQVUsR0FBRywwQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNqRSxJQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsVUFBVSxLQUFLLHdCQUF3QjtvQkFDaEUsVUFBVSxDQUFDLFVBQVUsS0FBSywwQkFBMEIsRUFBRTtvQkFDeEQsSUFBSSxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FDbEMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsQ0FBQztpQkFDdEU7YUFDRjtRQUNILENBQUM7UUFFRDs7OztXQUlHO1FBQ0ssbUJBQW1CLENBQUMsSUFBYTtZQUN2QyxJQUFJLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7Z0JBQ3hFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxLQUFLLHVCQUF1QixFQUFFO2dCQUN6RCwyRUFBMkU7Z0JBQzNFLDRFQUE0RTtnQkFDNUUsZ0RBQWdEO2dCQUNoRCxJQUFJLElBQUksQ0FBQyxZQUFZO29CQUNqQixDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQzt3QkFDckYsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsRUFBRTtvQkFDNUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7aUJBQzVCO3FCQUFNO29CQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNqQzthQUNGO1FBQ0gsQ0FBQztRQUVEOzs7V0FHRztRQUNLLDJCQUEyQixDQUFDLElBQWE7WUFDL0MsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO2dCQUN2QixPQUFPO2FBQ1I7WUFFRCxxQ0FBcUM7WUFDckMsSUFBSSxFQUFFLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUN0RSxNQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3JELElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtvQkFDL0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7aUJBQzVCO2dCQUNELE9BQU87YUFDUjtZQUVELHdDQUF3QztZQUN4QyxJQUFJLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztnQkFDakYsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQzdDLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDckQsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO29CQUMvRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztpQkFDNUI7Z0JBQ0QsT0FBTzthQUNSO1lBRUQseUVBQXlFO1lBQ3pFLGdGQUFnRjtZQUNoRixJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRO2dCQUMvQyxDQUFDLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUM3RixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RELElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0I7b0JBQ2pDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7b0JBQ2hGLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2lCQUM1QjthQUNGO1FBQ0gsQ0FBQztRQUVEOzs7V0FHRztRQUNLLDhCQUE4QixDQUFDLElBQWE7WUFDbEQsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN6QixNQUFNLFVBQVUsR0FBRywwQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNqRSxJQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsVUFBVSxLQUFLLHlCQUF5QjtvQkFDakUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsRUFBRTtvQkFDMUQsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FDOUIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsQ0FBQztpQkFDdEU7YUFDRjtRQUNILENBQUM7UUFFRDs7O1dBR0c7UUFDSyxpQ0FBaUMsQ0FBQyxRQUE2QjtZQUNyRSxtRUFBbUU7WUFDbkUsZ0RBQWdEO1lBQ2hELElBQUksa0JBQWtCLEdBQVksUUFBUSxDQUFDLElBQUksQ0FBQztZQUNoRCxPQUFPLGtCQUFrQixJQUFJLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDLEVBQUU7Z0JBQ3pFLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQzthQUNoRDtZQUVELElBQUksQ0FBQyxrQkFBa0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQztnQkFDbkUsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUM5RCxPQUFPLEtBQUssQ0FBQzthQUNkO1lBRUQsTUFBTSxpQkFBaUIsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7WUFDcEQsTUFBTSxtQkFBbUIsR0FBRyxzQkFBc0IsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFdkYsK0VBQStFO1lBQy9FLCtFQUErRTtZQUMvRSxtQ0FBbUM7WUFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDeEYsQ0FBQztRQUVEOzs7V0FHRztRQUNLLGtDQUFrQyxDQUFDLFVBQXNCO1lBQy9ELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFVLENBQUMsVUFBVSxFQUFFLEdBQUcsd0JBQXdCLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQy9FLE9BQU8sR0FBRyx3QkFBd0IsS0FBSyxDQUFDO2FBQ3pDO1lBRUQsSUFBSSxZQUFZLEdBQUcsR0FBRyx3QkFBd0IsR0FBRyxDQUFDO1lBQ2xELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNkLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVSxDQUFDLFVBQVUsRUFBRSxHQUFHLFlBQVksSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQzlFLEtBQUssRUFBRSxDQUFDO2FBQ1Q7WUFDRCxPQUFPLEdBQUcsWUFBWSxHQUFHLEtBQUssS0FBSyxDQUFDO1FBQ3RDLENBQUM7UUFFRDs7O1dBR0c7UUFDSyw4QkFBOEIsQ0FDbEMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBc0IsRUFBRSxPQUFlO1lBQ3BFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdELG9GQUFvRjtZQUNwRixtRkFBbUY7WUFDbkYsbUZBQW1GO1lBQ25GLG1GQUFtRjtZQUNuRixNQUFNLHdCQUF3QixHQUMxQixJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxVQUFVLENBQUM7aUJBQzNFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUxQixNQUFNLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFNUUsK0VBQStFO1lBQy9FLGlGQUFpRjtZQUNqRiw0REFBNEQ7WUFDNUQsSUFBSSw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FDM0QsVUFBVSxFQUFFLHlCQUF5QixFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFDaEUsd0JBQXdCLENBQUMsQ0FBQztnQkFFOUIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDaEUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pGLE9BQU87YUFDUjtZQUVELGdEQUFnRDtZQUNoRCxJQUFJLENBQUMsY0FBYyxDQUFDLHdCQUF3QixDQUN4QyxVQUFVLEVBQUUseUJBQXlCLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRWxFLGdGQUFnRjtZQUNoRixpRkFBaUY7WUFDakYsaUZBQWlGO1lBQ2pGLDJEQUEyRDtZQUMzRCxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNiLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQzNELFVBQVUsRUFBRSx5QkFBeUIsRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQ2hFLHdCQUF3QixDQUFDLENBQUM7Z0JBRTlCLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUNsRCxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO2FBQ25GO1FBQ0gsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0ssNkJBQTZCLENBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBc0I7WUFDckYsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3hDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0QsMEVBQTBFO1lBQzFFLDREQUE0RDtZQUM1RCxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxjQUFjLENBQUMsd0JBQXdCLENBQ3hDLFVBQVUsRUFBRSx5QkFBeUIsRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDbkU7WUFFRCxpRkFBaUY7WUFDakYsb0ZBQW9GO1lBQ3BGLHNEQUFzRDtZQUN0RCxJQUFJLFFBQVEsRUFBRTtnQkFDWixPQUFPO2FBQ1I7WUFFRCxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFFdkMsOEVBQThFO1lBQzlFLCtFQUErRTtZQUMvRSw0RUFBNEU7WUFDNUUsb0ZBQW9GO1lBQ3BGLElBQUksQ0FBQyxFQUFFLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLENBQUM7Z0JBQzVDLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLFVBQVUsRUFBRTtnQkFDL0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLDZCQUE2QixFQUFDLENBQUMsQ0FBQztnQkFDeEUsT0FBTzthQUNSO1lBRUQsTUFBTSxpQkFBaUIsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7WUFDcEQsTUFBTSxZQUFZLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FDbEQsQ0FBQyxDQUFDLEVBQThCLEVBQUUsQ0FDOUIsRUFBRSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQztZQUVqRiwwRkFBMEY7WUFDMUYsb0ZBQW9GO1lBQ3BGLHlCQUF5QjtZQUN6QixJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDcEYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLDZCQUE2QixFQUFDLENBQUMsQ0FBQztnQkFDeEUsT0FBTzthQUNSO1lBRUQsc0VBQXNFO1lBQ3RFLDhFQUE4RTtZQUM5RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEdBQUcsc0JBQXNCLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFFN0YseUVBQXlFO1lBQ3pFLDZFQUE2RTtZQUM3RSx3RkFBd0Y7WUFDeEYsbUZBQW1GO1lBQ25GLElBQUksQ0FBQyxFQUFFLENBQUMsd0JBQXdCLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzFELFFBQVEsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLEVBQUUsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDNUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2dCQUM1RSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztvQkFDdEIsSUFBSSxFQUFFLGlCQUFpQjtvQkFDdkIsT0FBTyxFQUFFLHVFQUF1RTt3QkFDNUUsK0JBQStCO2lCQUNwQyxDQUFDLENBQUM7Z0JBQ0gsT0FBTzthQUNSO1lBRUQsdUVBQXVFO1lBQ3ZFLHVDQUF1QztZQUN2Qyx1REFBZ0MsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBRUQsc0VBQXNFO1FBQzlELHNDQUFzQyxDQUFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBc0I7WUFDcEYsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3hDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQ3RELENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDckQsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRTdGLG1FQUFtRTtZQUNuRSx3QkFBd0I7WUFDeEIsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsQ0FDeEMsVUFBVSxFQUFFLHdCQUF3QixFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNsRTtRQUNILENBQUM7UUFFRCxxRUFBcUU7UUFDN0QsMEJBQTBCLENBQUMsT0FBeUI7WUFDMUQsTUFBTSxjQUFjLEdBQUcsaUNBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUMvQixPQUFPO2lCQUNSO2dCQUVELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDL0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUVsRCx3REFBOEIsQ0FBQyxXQUFXLENBQUM7cUJBQ3RDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLGdEQUFxQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzFELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELDhFQUE4RTtRQUN0RSw4QkFBOEIsQ0FBQyxPQUF5QixFQUFFLFVBQWtCO1lBQ2xGLE1BQU0sWUFBWSxHQUFHLFdBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLCtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDdEUsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDYixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDakIsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLE9BQU8sRUFBRSw2QkFBNkI7aUJBQ3ZDLENBQUMsQ0FBQztnQkFDSCxPQUFPO2FBQ1I7WUFFRCxNQUFNLGFBQWEsR0FBRywyQ0FBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDakIsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLE9BQU8sRUFBRSw2QkFBNkI7aUJBQ3ZDLENBQUMsQ0FBQztnQkFDSCxPQUFPO2FBQ1I7WUFFRCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUMxRixJQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFO2dCQUN6RCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDakIsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLE9BQU8sRUFBRSw2QkFBNkI7aUJBQ3ZDLENBQUMsQ0FBQztnQkFDSCxPQUFPO2FBQ1I7WUFFRCxNQUFNLFVBQVUsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDcEUsTUFBTSxZQUFZLEdBQUcsZUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FDbkUsVUFBVSxFQUFFLHdCQUF3QixFQUFFLDBCQUEwQixDQUFDLENBQUM7WUFDdEUsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUMvRCxVQUFVLEVBQUUseUJBQXlCLEVBQUUsa0JBQWtCLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBRWhHLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0QsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDO2dCQUM3QyxFQUFFLENBQUMsd0JBQXdCLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDO2dCQUM3RCxFQUFFLENBQUMsd0JBQXdCLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDO2FBQzNELENBQUMsQ0FBQztZQUVILG1GQUFtRjtZQUNuRixNQUFNLFFBQVEsR0FBRyxnQ0FBb0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FDN0MsQ0FBQztZQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDcEIsT0FBTzthQUNSO1lBRUQsTUFBTSxjQUFjLEdBQUcsNEJBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sbUJBQW1CLEdBQ3JCLGNBQWMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBRXBGLDhFQUE4RTtZQUM5RSxrRkFBa0Y7WUFDbEYsaUZBQWlGO1lBQ2pGLGdGQUFnRjtZQUNoRiwrRUFBK0U7WUFDL0UsbUZBQW1GO1lBQ25GLCtFQUErRTtZQUMvRSxvRkFBb0Y7WUFDcEYsOEVBQThFO1lBQzlFLElBQUksbUJBQW1CO2dCQUNuQixJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDakYsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtnQkFDakYsT0FBTzthQUNSO1lBRUQsTUFBTSxhQUFhLEdBQUcsdUNBQTJCLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQ25GLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRXhELGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzdCLElBQUksTUFBTSxZQUFZLHFCQUFZLEVBQUU7b0JBQ2xDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2hEO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsNERBQTREO1FBQ3BELFVBQVUsQ0FBQyxJQUFhLEVBQUUsVUFBeUI7WUFDekQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDNUUsQ0FBQztRQUVELGlGQUFpRjtRQUN6RSwyQkFBMkIsQ0FBQyxJQUFhO1lBQy9DLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFMUQscUZBQXFGO1lBQ3JGLHdFQUF3RTtZQUN4RSxzQ0FBc0M7WUFDdEMsSUFBSSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN6RCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDbEQ7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBRUQ7OztXQUdHO1FBQ0ssK0JBQStCLENBQUMsSUFBbUI7WUFDekQsTUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekMsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUM5QixPQUFPLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDO2FBQzFFO2lCQUFNLElBQUksRUFBRSxDQUFDLDBCQUEwQixDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNuRCxPQUFPLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMvRTtZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSyx3QkFBd0I7WUFDOUIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxFQUFFLEVBQUU7Z0JBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDeEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUMvQixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUN6RixPQUFPO29CQUNMLFFBQVEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDO29CQUN6RSxPQUFPLEVBQUUsT0FBTztvQkFDaEIsUUFBUSxFQUFFLFVBQVUsQ0FBQyxRQUFRO2lCQUM5QixDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQ7OztXQUdHO1FBQ0ssa0JBQWtCO1lBQ3hCLE1BQU0sU0FBUyxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFDLE1BQU0sT0FBTyxHQUFHLHFDQUFxQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFL0QsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDWixNQUFNLElBQUksZ0NBQW1CLENBQ3pCLDJEQUEyRDtvQkFDM0QsK0RBQStELENBQUMsQ0FBQzthQUN0RTtZQUVELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFLRDs7Ozs7V0FLRztRQUNILE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFVLEVBQUUsT0FBeUI7WUFDOUQsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3JFLHdFQUF3RTtnQkFDeEUsb0VBQW9FO2dCQUNwRSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksOEJBQXNCLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzdEO1lBRUQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FDNUIsbUZBQW1GO2dCQUNuRiwwRUFBMEUsQ0FBQyxDQUFDLENBQUM7WUFFakYsK0VBQStFO1lBQy9FLDRFQUE0RTtZQUM1RSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQ2hDLENBQUM7UUFFRDs7O1dBR0c7UUFDSyxNQUFNLENBQUMsNEJBQTRCLENBQUMsSUFBVTtZQUNwRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDakMsT0FBTyxLQUFLLENBQUM7YUFDZDtZQUVELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUU3RSxvRUFBb0U7WUFDcEUsMkJBQTJCO1lBQzNCLElBQUksV0FBVyxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFO2dCQUNyRCxPQUFPLFdBQVcsQ0FBQyxZQUFZLENBQUMsdUJBQXVCLENBQUMsQ0FBQztnQkFDekQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RFLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7O0lBNUNELDZFQUE2RTtJQUN0RSxtQ0FBZ0IsR0FBRyxLQUFLLENBQUM7SUE5bEJsQyxnREEwb0JDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxnQkFBZ0IsQ0FBQyxJQUFhO1FBQ3JDLElBQUksRUFBRSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3RDLE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzFDO2FBQU0sSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xDLE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzFDO2FBQU0sSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25DLE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxrQkFBa0IsQ0FBQyxPQUFlLEVBQUUsY0FBc0I7UUFDakUsSUFBSSxNQUFNLEdBQUcsZUFBUSxDQUFDLGNBQU8sQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDM0IsTUFBTSxHQUFHLEtBQUssTUFBTSxFQUFFLENBQUM7U0FDeEI7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxtQkFBbUIsQ0FBQyxJQUFxQjtRQUNoRCxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztTQUNsQjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELDBFQUEwRTtJQUMxRSxTQUFTLDRCQUE0QixDQUFDLElBQW1CO1FBQ3ZELE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxzQkFBc0IsQ0FDM0IsTUFBZSxFQUFFLFNBQXVDO1FBQzFELE1BQU0sTUFBTSxHQUFRLEVBQUUsQ0FBQztRQUN2QixNQUFNLFNBQVMsR0FBRyxDQUFDLElBQWEsRUFBRSxFQUFFO1lBQ2xDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25CO1lBQ0QsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDO1FBQ0YsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkMsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBqb2luIGFzIGRldmtpdEpvaW4sXG4gIG5vcm1hbGl6ZSBhcyBkZXZraXROb3JtYWxpemUsXG4gIFBhdGggYXMgRGV2a2l0UGF0aFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQge1NjaGVtYXRpY0NvbnRleHQsIFNjaGVtYXRpY3NFeGNlcHRpb24sIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Tm9kZVBhY2thZ2VJbnN0YWxsVGFza30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHtcbiAgZ2V0UHJvamVjdEluZGV4RmlsZXMsXG4gIGdldFByb2plY3RNYWluRmlsZSxcbiAgTWlncmF0aW9uRmFpbHVyZSxcbiAgTWlncmF0aW9uUnVsZSxcbiAgUmVzb2x2ZWRSZXNvdXJjZSxcbiAgVGFyZ2V0VmVyc2lvblxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBhZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEsXG4gIGdldERlY29yYXRvck1ldGFkYXRhLFxuICBnZXRNZXRhZGF0YUZpZWxkXG59IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9hc3QtdXRpbHMnO1xuaW1wb3J0IHtJbnNlcnRDaGFuZ2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jaGFuZ2UnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jb25maWcnO1xuaW1wb3J0IHtXb3Jrc3BhY2VQcm9qZWN0fSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlLW1vZGVscyc7XG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuaW1wb3J0IHtyZWFkRmlsZVN5bmN9IGZyb20gJ2ZzJztcbmltcG9ydCB7ZGlybmFtZSwgam9pbiwgcmVsYXRpdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Z2V0UHJvamVjdEZyb21Qcm9ncmFtfSBmcm9tICcuL2NsaS13b3Jrc3BhY2UnO1xuaW1wb3J0IHtmaW5kSGFtbWVyU2NyaXB0SW1wb3J0RWxlbWVudHN9IGZyb20gJy4vZmluZC1oYW1tZXItc2NyaXB0LXRhZ3MnO1xuaW1wb3J0IHtmaW5kTWFpbk1vZHVsZUV4cHJlc3Npb259IGZyb20gJy4vZmluZC1tYWluLW1vZHVsZSc7XG5pbXBvcnQge2lzSGFtbWVySnNVc2VkSW5UZW1wbGF0ZX0gZnJvbSAnLi9oYW1tZXItdGVtcGxhdGUtY2hlY2snO1xuaW1wb3J0IHtnZXRJbXBvcnRPZklkZW50aWZpZXIsIEltcG9ydH0gZnJvbSAnLi9pZGVudGlmaWVyLWltcG9ydHMnO1xuaW1wb3J0IHtJbXBvcnRNYW5hZ2VyfSBmcm9tICcuL2ltcG9ydC1tYW5hZ2VyJztcbmltcG9ydCB7cmVtb3ZlRWxlbWVudEZyb21BcnJheUV4cHJlc3Npb259IGZyb20gJy4vcmVtb3ZlLWFycmF5LWVsZW1lbnQnO1xuaW1wb3J0IHtyZW1vdmVFbGVtZW50RnJvbUh0bWx9IGZyb20gJy4vcmVtb3ZlLWVsZW1lbnQtZnJvbS1odG1sJztcblxuY29uc3QgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSA9ICdHZXN0dXJlQ29uZmlnJztcbmNvbnN0IEdFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRSA9ICdnZXN0dXJlLWNvbmZpZyc7XG5jb25zdCBHRVNUVVJFX0NPTkZJR19URU1QTEFURV9QQVRIID0gJy4vZ2VzdHVyZS1jb25maWcudGVtcGxhdGUnO1xuY29uc3QgSEFNTUVSX0NPTkZJR19UT0tFTl9OQU1FID0gJ0hBTU1FUl9HRVNUVVJFX0NPTkZJRyc7XG5jb25zdCBIQU1NRVJfQ09ORklHX1RPS0VOX01PRFVMRSA9ICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmNvbnN0IEhBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSID0gJ2hhbW1lcmpzJztcblxuY29uc3QgQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1IgPVxuICAgIGBDYW5ub3QgcmVtb3ZlIHJlZmVyZW5jZSB0byBcIkdlc3R1cmVDb25maWdcIi4gUGxlYXNlIHJlbW92ZSBtYW51YWxseS5gO1xuXG5jb25zdCBDQU5OT1RfU0VUVVBfQVBQX01PRFVMRV9FUlJPUiA9IGBDb3VsZCBub3Qgc2V0dXAgSGFtbWVySlMgZ2VzdHVyZSBpbiBtb2R1bGUuIFBsZWFzZSBgICtcbiAgYG1hbnVhbGx5IGVuc3VyZSB0aGF0IHRoZSBIYW1tZXIgZ2VzdHVyZSBjb25maWcgaXMgc2V0IHVwLmA7XG5cbmludGVyZmFjZSBJZGVudGlmaWVyUmVmZXJlbmNlIHtcbiAgbm9kZTogdHMuSWRlbnRpZmllcjtcbiAgaW1wb3J0RGF0YTogSW1wb3J0O1xuICBpc0ltcG9ydDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEhhbW1lckdlc3R1cmVzUnVsZSBleHRlbmRzIE1pZ3JhdGlvblJ1bGU8bnVsbD4ge1xuICAvLyBPbmx5IGVuYWJsZSB0aGlzIHJ1bGUgaWYgdGhlIG1pZ3JhdGlvbiB0YXJnZXRzIHY5IG9yIHYxMCBhbmQgaXMgcnVubmluZyBmb3IgYSBub24tdGVzdFxuICAvLyB0YXJnZXQuIFdlIGNhbm5vdCBtaWdyYXRlIHRlc3QgdGFyZ2V0cyBzaW5jZSB0aGV5IGhhdmUgYSBsaW1pdGVkIHNjb3BlXG4gIC8vIChpbiByZWdhcmRzIHRvIHNvdXJjZSBmaWxlcykgYW5kIHRoZXJlZm9yZSB0aGUgSGFtbWVySlMgdXNhZ2UgZGV0ZWN0aW9uIGNhbiBiZSBpbmNvcnJlY3QuXG4gIHJ1bGVFbmFibGVkID1cbiAgICAgICh0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjkgfHwgdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlYxMCkgJiZcbiAgICAgICF0aGlzLmlzVGVzdFRhcmdldDtcblxuICBwcml2YXRlIF9wcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcigpO1xuICBwcml2YXRlIF9pbXBvcnRNYW5hZ2VyID0gbmV3IEltcG9ydE1hbmFnZXIodGhpcy5nZXRVcGRhdGVSZWNvcmRlciwgdGhpcy5fcHJpbnRlcik7XG4gIHByaXZhdGUgX25vZGVGYWlsdXJlczoge25vZGU6IHRzLk5vZGUsIG1lc3NhZ2U6IHN0cmluZ31bXSA9IFtdO1xuXG4gIC8qKiBXaGV0aGVyIEhhbW1lckpTIGlzIGV4cGxpY2l0bHkgdXNlZCBpbiBhbnkgY29tcG9uZW50IHRlbXBsYXRlLiAqL1xuICBwcml2YXRlIF91c2VkSW5UZW1wbGF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIEhhbW1lckpTIGlzIGFjY2Vzc2VkIGF0IHJ1bnRpbWUuICovXG4gIHByaXZhdGUgX3VzZWRJblJ1bnRpbWUgPSBmYWxzZTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpbXBvcnRzIHRoYXQgbWFrZSBcImhhbW1lcmpzXCIgYXZhaWxhYmxlIGdsb2JhbGx5LiBXZSBrZWVwIHRyYWNrIG9mIHRoZXNlXG4gICAqIHNpbmNlIHdlIG1pZ2h0IG5lZWQgdG8gcmVtb3ZlIHRoZW0gaWYgSGFtbWVyIGlzIG5vdCB1c2VkLlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5zdGFsbEltcG9ydHM6IHRzLkltcG9ydERlY2xhcmF0aW9uW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCByZXNvbHZlIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyBmcm9tIEFuZ3VsYXIgTWF0ZXJpYWwuXG4gICAqL1xuICBwcml2YXRlIF9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlczogSWRlbnRpZmllclJlZmVyZW5jZVtdID0gW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggcmVzb2x2ZSB0byBcIkhBTU1FUl9HRVNUVVJFX0NPTkZJR1wiIHRva2VuIGZyb21cbiAgICogXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuXG4gICAqL1xuICBwcml2YXRlIF9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXM6IElkZW50aWZpZXJSZWZlcmVuY2VbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHRoYXQgaGF2ZSBiZWVuIGRlbGV0ZWQgZnJvbSBzb3VyY2UgZmlsZXMuIFRoaXMgY2FuIGJlXG4gICAqIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGNlcnRhaW4gaW1wb3J0cyBhcmUgc3RpbGwgdXNlZCBvciBub3QuXG4gICAqL1xuICBwcml2YXRlIF9kZWxldGVkSWRlbnRpZmllcnM6IHRzLklkZW50aWZpZXJbXSA9IFtdO1xuXG4gIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFJlc29sdmVkUmVzb3VyY2UpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3VzZWRJblRlbXBsYXRlICYmIGlzSGFtbWVySnNVc2VkSW5UZW1wbGF0ZSh0ZW1wbGF0ZS5jb250ZW50KSkge1xuICAgICAgdGhpcy5fdXNlZEluVGVtcGxhdGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tIYW1tZXJJbXBvcnRzKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9yUnVudGltZUhhbW1lclVzYWdlKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9yTWF0ZXJpYWxHZXN0dXJlQ29uZmlnKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9ySGFtbWVyR2VzdHVyZUNvbmZpZ1Rva2VuKG5vZGUpO1xuICB9XG5cbiAgcG9zdEFuYWx5c2lzKCk6IHZvaWQge1xuICAgIC8vIFdhbGsgdGhyb3VnaCBhbGwgaGFtbWVyIGNvbmZpZyB0b2tlbiByZWZlcmVuY2VzIGFuZCBjaGVjayBpZiB0aGVyZVxuICAgIC8vIGlzIGEgcG90ZW50aWFsIGN1c3RvbSBnZXN0dXJlIGNvbmZpZyBzZXR1cC5cbiAgICBjb25zdCBoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAgPVxuICAgICAgICB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHRoaXMuX2NoZWNrRm9yQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKHIpKTtcblxuICAgIGlmICh0aGlzLl91c2VkSW5SdW50aW1lIHx8IHRoaXMuX3VzZWRJblRlbXBsYXRlKSB7XG4gICAgICAvLyBXZSBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgSGFtbWVyIGlzIHVzZWQgZ2xvYmFsbHkuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugd2VcbiAgICAgIC8vIHdhbnQgdG8gb25seSByZW1vdmUgSGFtbWVyIGZyb20gdGhlIFwicGFja2FnZS5qc29uXCIgaWYgaXQgaXMgbm90IHVzZWQgaW4gYW55IHByb2plY3RcbiAgICAgIC8vIHRhcmdldC4gSnVzdCBiZWNhdXNlIGl0IGlzbid0IHVzZWQgaW4gb25lIHRhcmdldCBkb2Vzbid0IG1lYW4gdGhhdCB3ZSBjYW4gc2FmZWx5XG4gICAgICAvLyByZW1vdmUgdGhlIGRlcGVuZGVuY3kuXG4gICAgICBIYW1tZXJHZXN0dXJlc1J1bGUuZ2xvYmFsVXNlc0hhbW1lciA9IHRydWU7XG5cbiAgICAgIC8vIElmIGhhbW1lciBpcyBvbmx5IHVzZWQgYXQgcnVudGltZSwgd2UgZG9uJ3QgbmVlZCB0aGUgZ2VzdHVyZSBjb25maWdcbiAgICAgIC8vIGFuZCBjYW4gcmVtb3ZlIGl0IChhbG9uZyB3aXRoIHRoZSBoYW1tZXIgY29uZmlnIHRva2VuIGlmIHBvc3NpYmxlKVxuICAgICAgaWYgKCF0aGlzLl91c2VkSW5UZW1wbGF0ZSkge1xuICAgICAgICB0aGlzLl9yZW1vdmVHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NldHVwSGFtbWVyR2VzdHVyZUNvbmZpZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBIYW1tZXJKUyBjb3VsZCBub3QgYmUgZGV0ZWN0ZWQsIGJ1dCB3ZSBkZXRlY3RlZCBhIGN1c3RvbSBnZXN0dXJlXG4gICAgICAvLyBjb25maWcgc2V0dXAsIHdlIGp1c3QgcmVtb3ZlIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsXG4gICAgICAvLyBnZXN0dXJlIGNvbmZpZy4gT3RoZXJ3aXNlIHdlIGNvbXBsZXRlbHkgcmVtb3ZlIEhhbW1lckpTIGZyb20gdGhlIGFwcC5cbiAgICAgIGlmIChoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXApIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gICAgICAgIC8vIFByaW50IGEgbWVzc2FnZSBpZiB3ZSBmb3VuZCBhIGN1c3RvbSBnZXN0dXJlIGNvbmZpZyBzZXR1cCBpbiBjb21iaW5hdGlvbiB3aXRoXG4gICAgICAgIC8vIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuIFRoaXMgaXMgYW1iaWd1b3VzIGFuZCB0aGVcbiAgICAgICAgLy8gbWlncmF0aW9uIGp1c3QgcmVtb3ZlcyB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgc2V0dXAsIGJ1dCB3ZSBzdGlsbCB3YW50XG4gICAgICAgIC8vIHRvIGNyZWF0ZSBhbiBpbmZvcm1hdGlvbiBtZXNzYWdlLlxuICAgICAgICBpZiAodGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5wcmludEluZm8oY2hhbGsueWVsbG93KFxuICAgICAgICAgICAgICAnVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBjb21wb25lbnRzIGRldGVjdGVkIHRoYXQgdGhlIEFuZ3VsYXIgJyArXG4gICAgICAgICAgICAgICdNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyBpcyB1c2VkIHdoaWxlIGEgY3VzdG9tIGdlc3R1cmUgY29uZmlnIGlzIHNldCB1cC4gVGhlICcgK1xuICAgICAgICAgICAgICAnbWlncmF0aW9uIHJlbW92ZWQgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuJykpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZW1vdmVIYW1tZXJTZXR1cCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlY29yZCB0aGUgY2hhbmdlcyBjb2xsZWN0ZWQgaW4gdGhlIGltcG9ydCBtYW5hZ2VyLiBDaGFuZ2VzIG5lZWQgdG8gYmUgYXBwbGllZFxuICAgIC8vIG9uY2UgdGhlIGltcG9ydCBtYW5hZ2VyIHJlZ2lzdGVyZWQgYWxsIGltcG9ydCBtb2RpZmljYXRpb25zLiBUaGlzIGF2b2lkcyBjb2xsaXNpb25zLlxuICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIucmVjb3JkQ2hhbmdlcygpO1xuXG4gICAgLy8gQ3JlYXRlIG1pZ3JhdGlvbiBmYWlsdXJlcyB0aGF0IHdpbGwgYmUgcHJpbnRlZCBieSB0aGUgdXBkYXRlLXRvb2wgb24gbWlncmF0aW9uXG4gICAgLy8gY29tcGxldGlvbi4gV2UgbmVlZCBzcGVjaWFsIGxvZ2ljIGZvciB1cGRhdGluZyBmYWlsdXJlIHBvc2l0aW9ucyB0byByZWZsZWN0XG4gICAgLy8gdGhlIG5ldyBzb3VyY2UgZmlsZSBhZnRlciBtb2RpZmljYXRpb25zIGZyb20gdGhlIGltcG9ydCBtYW5hZ2VyLlxuICAgIHRoaXMuZmFpbHVyZXMucHVzaCguLi50aGlzLl9jcmVhdGVNaWdyYXRpb25GYWlsdXJlcygpKTtcblxuICAgIC8vIFRoZSB0ZW1wbGF0ZSBjaGVjayBmb3IgSGFtbWVySlMgZXZlbnRzIGlzIG5vdCBjb21wbGV0ZWx5IHJlbGlhYmxlIGFzIHRoZSBldmVudFxuICAgIC8vIG91dHB1dCBjb3VsZCBhbHNvIGJlIGZyb20gYSBjb21wb25lbnQgaGF2aW5nIGFuIG91dHB1dCBuYW1lZCBzaW1pbGFybHkgdG8gYSBrbm93blxuICAgIC8vIGhhbW1lcmpzIGV2ZW50IChlLmcuIFwiQE91dHB1dCgpIHNsaWRlXCIpLiBUaGUgdXNhZ2UgaXMgdGhlcmVmb3JlIHNvbWV3aGF0IGFtYmlndW91c1xuICAgIC8vIGFuZCB3ZSB3YW50IHRvIHByaW50IGEgbWVzc2FnZSB0aGF0IGRldmVsb3BlcnMgbWlnaHQgYmUgYWJsZSB0byByZW1vdmUgSGFtbWVyIG1hbnVhbGx5LlxuICAgIGlmICghdGhpcy5fdXNlZEluUnVudGltZSAmJiB0aGlzLl91c2VkSW5UZW1wbGF0ZSkge1xuICAgICAgdGhpcy5wcmludEluZm8oY2hhbGsueWVsbG93KFxuICAgICAgICAgICdUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIGNvbXBvbmVudHMgbWlncmF0ZWQgdGhlICcgK1xuICAgICAgICAgICdwcm9qZWN0IHRvIGtlZXAgSGFtbWVySlMgaW5zdGFsbGVkLCBidXQgZGV0ZWN0ZWQgYW1iaWd1b3VzIHVzYWdlIG9mIEhhbW1lckpTLiBQbGVhc2UgJyArXG4gICAgICAgICAgJ21hbnVhbGx5IGNoZWNrIGlmIHlvdSBjYW4gcmVtb3ZlIEhhbW1lckpTIGZyb20geW91ciBhcHBsaWNhdGlvbi4nKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgY3VycmVudCBwcm9qZWN0LiBUbyBhY2hpZXZlIHRoaXMsIHRoZVxuICAgKiBmb2xsb3dpbmcgc3RlcHMgYXJlIHBlcmZvcm1lZDpcbiAgICogICAxKSBDcmVhdGUgY29weSBvZiBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgKiAgIDIpIFJld3JpdGUgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgdG8gdGhlXG4gICAqICAgICAgbmV3bHkgY29waWVkIGdlc3R1cmUgY29uZmlnLlxuICAgKiAgIDMpIFNldHVwIHRoZSBIQU1NRVJfR0VTVFVSRV9DT05GSUcgcHJvdmlkZXIgaW4gdGhlIHJvb3QgYXBwIG1vZHVsZVxuICAgKiAgICAgIChpZiBub3QgZG9uZSBhbHJlYWR5KS5cbiAgICovXG4gIHByaXZhdGUgX3NldHVwSGFtbWVyR2VzdHVyZUNvbmZpZygpIHtcbiAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5fZ2V0UHJvamVjdE9yVGhyb3coKTtcbiAgICBjb25zdCBzb3VyY2VSb290ID0gZGV2a2l0Tm9ybWFsaXplKHByb2plY3Quc291cmNlUm9vdCB8fCBwcm9qZWN0LnJvb3QpO1xuICAgIGNvbnN0IGdlc3R1cmVDb25maWdQYXRoID1cbiAgICAgICAgZGV2a2l0Sm9pbihzb3VyY2VSb290LCB0aGlzLl9nZXRBdmFpbGFibGVHZXN0dXJlQ29uZmlnRmlsZU5hbWUoc291cmNlUm9vdCkpO1xuXG4gICAgLy8gQ29weSBnZXN0dXJlIGNvbmZpZyB0ZW1wbGF0ZSBpbnRvIHRoZSBDTEkgcHJvamVjdC5cbiAgICB0aGlzLnRyZWUuY3JlYXRlKFxuICAgICAgICBnZXN0dXJlQ29uZmlnUGF0aCwgcmVhZEZpbGVTeW5jKHJlcXVpcmUucmVzb2x2ZShHRVNUVVJFX0NPTkZJR19URU1QTEFURV9QQVRIKSwgJ3V0ZjgnKSk7XG5cbiAgICAvLyBSZXBsYWNlIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyBvZiBNYXRlcmlhbC5cbiAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5mb3JFYWNoKFxuICAgICAgICBpID0+IHRoaXMuX3JlcGxhY2VHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKGksIGdlc3R1cmVDb25maWdQYXRoKSk7XG5cbiAgICAvLyBTZXR1cCB0aGUgZ2VzdHVyZSBjb25maWcgcHJvdmlkZXIgaW4gdGhlIHByb2plY3QgYXBwIG1vZHVsZSBpZiBub3QgZG9uZSBhbHJlYWR5LlxuICAgIHRoaXMuX3NldHVwR2VzdHVyZUNvbmZpZ0luQXBwTW9kdWxlKHByb2plY3QsIGdlc3R1cmVDb25maWdQYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIEhhbW1lciBmcm9tIHRoZSBjdXJyZW50IHByb2plY3QuIFRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHBlcmZvcm1lZDpcbiAgICogICAxKSBEZWxldGUgYWxsIFR5cGVTY3JpcHQgaW1wb3J0cyB0byBcImhhbW1lcmpzXCIuXG4gICAqICAgMikgUmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAqICAgMykgUmVtb3ZlIFwiaGFtbWVyanNcIiBmcm9tIGFsbCBpbmRleCBIVE1MIGZpbGVzIG9mIHRoZSBjdXJyZW50IHByb2plY3QuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJTZXR1cCgpIHtcbiAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5fZ2V0UHJvamVjdE9yVGhyb3coKTtcblxuICAgIHRoaXMuX2luc3RhbGxJbXBvcnRzLmZvckVhY2goaSA9PiB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZUltcG9ydEJ5RGVjbGFyYXRpb24oaSkpO1xuXG4gICAgdGhpcy5fcmVtb3ZlR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gICAgdGhpcy5fcmVtb3ZlSGFtbWVyRnJvbUluZGV4RmlsZShwcm9qZWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBnZXN0dXJlIGNvbmZpZyBzZXR1cCBieSBkZWxldGluZyBhbGwgZm91bmQgcmVmZXJlbmNlc1xuICAgKiB0byBhIGdlc3R1cmUgY29uZmlnLiBBZGRpdGlvbmFsbHksIHVudXNlZCBpbXBvcnRzIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZVxuICAgKiBjb25maWcgdG9rZW4gZnJvbSBwbGF0Zm9ybS1icm93c2VyIGFyZSByZW1vdmVkIGFzIHdlbGwuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVHZXN0dXJlQ29uZmlnU2V0dXAoKSB7XG4gICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuZm9yRWFjaChyID0+IHRoaXMuX3JlbW92ZUdlc3R1cmVDb25maWdSZWZlcmVuY2UocikpO1xuXG4gICAgdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLmZvckVhY2gociA9PiB7XG4gICAgICBpZiAoci5pc0ltcG9ydCkge1xuICAgICAgICB0aGlzLl9yZW1vdmVIYW1tZXJDb25maWdUb2tlbkltcG9ydElmVW51c2VkKHIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBpcyBhIHJlZmVyZW5jZSB0byB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnXG4gICAqIHRva2VuIGZyb20gcGxhdGZvcm0tYnJvd3Nlci4gSWYgc28sIGtlZXBzIHRyYWNrIG9mIHRoZSByZWZlcmVuY2UuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0ZvckhhbW1lckdlc3R1cmVDb25maWdUb2tlbihub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgICAgY29uc3QgaW1wb3J0RGF0YSA9IGdldEltcG9ydE9mSWRlbnRpZmllcihub2RlLCB0aGlzLnR5cGVDaGVja2VyKTtcbiAgICAgIGlmIChpbXBvcnREYXRhICYmIGltcG9ydERhdGEuc3ltYm9sTmFtZSA9PT0gSEFNTUVSX0NPTkZJR19UT0tFTl9OQU1FICYmXG4gICAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lID09PSBIQU1NRVJfQ09ORklHX1RPS0VOX01PRFVMRSkge1xuICAgICAgICB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMucHVzaChcbiAgICAgICAgICAgIHtub2RlLCBpbXBvcnREYXRhLCBpc0ltcG9ydDogdHMuaXNJbXBvcnRTcGVjaWZpZXIobm9kZS5wYXJlbnQpfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBpcyBhbiBpbXBvcnQgdG8gdGhlIEhhbW1lckpTIHBhY2thZ2UuIEltcG9ydHMgdG9cbiAgICogSGFtbWVySlMgd2hpY2ggbG9hZCBzcGVjaWZpYyBzeW1ib2xzIGZyb20gdGhlIHBhY2thZ2UgYXJlIGNvbnNpZGVyZWQgYXNcbiAgICogcnVudGltZSB1c2FnZSBvZiBIYW1tZXIuIGUuZy4gYGltcG9ydCB7U3ltYm9sfSBmcm9tIFwiaGFtbWVyanNcIjtgLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tIYW1tZXJJbXBvcnRzKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJbXBvcnREZWNsYXJhdGlvbihub2RlKSAmJiB0cy5pc1N0cmluZ0xpdGVyYWwobm9kZS5tb2R1bGVTcGVjaWZpZXIpICYmXG4gICAgICAgIG5vZGUubW9kdWxlU3BlY2lmaWVyLnRleHQgPT09IEhBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSKSB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBhbiBpbXBvcnQgdG8gSGFtbWVySlMgdGhhdCBpbXBvcnRzIHN5bWJvbHMsIG9yIGlzIG5hbWVzcGFjZWRcbiAgICAgIC8vIChlLmcuIFwiaW1wb3J0IHtBLCBCfSBmcm9tIC4uLlwiIG9yIFwiaW1wb3J0ICogYXMgaGFtbWVyIGZyb20gLi4uXCIpLCB0aGVuIHdlXG4gICAgICAvLyBhc3N1bWUgdGhhdCBzb21lIGV4cG9ydHMgYXJlIHVzZWQgYXQgcnVudGltZS5cbiAgICAgIGlmIChub2RlLmltcG9ydENsYXVzZSAmJlxuICAgICAgICAgICEobm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncyAmJiB0cy5pc05hbWVkSW1wb3J0cyhub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSAmJlxuICAgICAgICAgICAgbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cy5sZW5ndGggPT09IDApKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5faW5zdGFsbEltcG9ydHMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGFjY2Vzc2VzIHRoZSBnbG9iYWwgXCJIYW1tZXJcIiBzeW1ib2wgYXQgcnVudGltZS4gSWYgc28sXG4gICAqIHRoZSBtaWdyYXRpb24gcnVsZSBzdGF0ZSB3aWxsIGJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGF0IEhhbW1lciBpcyB1c2VkIGF0IHJ1bnRpbWUuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0ZvclJ1bnRpbWVIYW1tZXJVc2FnZShub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRoaXMuX3VzZWRJblJ1bnRpbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZXRlY3RzIHVzYWdlcyBvZiBcIndpbmRvdy5IYW1tZXJcIi5cbiAgICBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZSkgJiYgbm9kZS5uYW1lLnRleHQgPT09ICdIYW1tZXInKSB7XG4gICAgICBjb25zdCBvcmlnaW5FeHByID0gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihvcmlnaW5FeHByKSAmJiBvcmlnaW5FeHByLnRleHQgPT09ICd3aW5kb3cnKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIERldGVjdHMgdXNhZ2VzIG9mIFwid2luZG93WydIYW1tZXInXVwiLlxuICAgIGlmICh0cy5pc0VsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKG5vZGUpICYmIHRzLmlzU3RyaW5nTGl0ZXJhbChub2RlLmFyZ3VtZW50RXhwcmVzc2lvbikgJiZcbiAgICAgICAgbm9kZS5hcmd1bWVudEV4cHJlc3Npb24udGV4dCA9PT0gJ0hhbW1lcicpIHtcbiAgICAgIGNvbnN0IG9yaWdpbkV4cHIgPSB1bndyYXBFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gICAgICBpZiAodHMuaXNJZGVudGlmaWVyKG9yaWdpbkV4cHIpICYmIG9yaWdpbkV4cHIudGV4dCA9PT0gJ3dpbmRvdycpIHtcbiAgICAgICAgdGhpcy5fdXNlZEluUnVudGltZSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlcyB1c2FnZXMgb2YgcGxhaW4gaWRlbnRpZmllciB3aXRoIHRoZSBuYW1lIFwiSGFtbWVyXCIuIFRoZXNlIHVzYWdlXG4gICAgLy8gYXJlIHZhbGlkIGlmIHRoZXkgcmVzb2x2ZSB0byBcIkB0eXBlcy9oYW1tZXJqc1wiLiBlLmcuIFwibmV3IEhhbW1lcihteUVsZW1lbnQpXCIuXG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSAmJiBub2RlLnRleHQgPT09ICdIYW1tZXInICYmXG4gICAgICAgICF0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLnBhcmVudCkgJiYgIXRzLmlzRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24obm9kZS5wYXJlbnQpKSB7XG4gICAgICBjb25zdCBzeW1ib2wgPSB0aGlzLl9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlKTtcbiAgICAgIGlmIChzeW1ib2wgJiYgc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24gJiZcbiAgICAgICAgICBzeW1ib2wudmFsdWVEZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUuaW5jbHVkZXMoJ0B0eXBlcy9oYW1tZXJqcycpKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgcmVmZXJlbmNlcyB0aGUgZ2VzdHVyZSBjb25maWcgZnJvbSBBbmd1bGFyIE1hdGVyaWFsLlxuICAgKiBJZiBzbywgd2Uga2VlcCB0cmFjayBvZiB0aGUgZm91bmQgc3ltYm9sIHJlZmVyZW5jZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9yTWF0ZXJpYWxHZXN0dXJlQ29uZmlnKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICBjb25zdCBpbXBvcnREYXRhID0gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGUsIHRoaXMudHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKGltcG9ydERhdGEgJiYgaW1wb3J0RGF0YS5zeW1ib2xOYW1lID09PSBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FICYmXG4gICAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lLnN0YXJ0c1dpdGgoJ0Bhbmd1bGFyL21hdGVyaWFsLycpKSB7XG4gICAgICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLnB1c2goXG4gICAgICAgICAgICB7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnQ6IHRzLmlzSW1wb3J0U3BlY2lmaWVyKG5vZGUucGFyZW50KX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIEhhbW1lciBnZXN0dXJlIGNvbmZpZyB0b2tlbiByZWZlcmVuY2UgaXMgcGFydCBvZiBhblxuICAgKiBBbmd1bGFyIHByb3ZpZGVyIGRlZmluaXRpb24gdGhhdCBzZXRzIHVwIGEgY3VzdG9tIGdlc3R1cmUgY29uZmlnLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAodG9rZW5SZWY6IElkZW50aWZpZXJSZWZlcmVuY2UpOiBib29sZWFuIHtcbiAgICAvLyBXYWxrIHVwIHRoZSB0cmVlIHRvIGxvb2sgZm9yIGEgcGFyZW50IHByb3BlcnR5IGFzc2lnbm1lbnQgb2YgdGhlXG4gICAgLy8gcmVmZXJlbmNlIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWcgdG9rZW4uXG4gICAgbGV0IHByb3BlcnR5QXNzaWdubWVudDogdHMuTm9kZSA9IHRva2VuUmVmLm5vZGU7XG4gICAgd2hpbGUgKHByb3BlcnR5QXNzaWdubWVudCAmJiAhdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcGVydHlBc3NpZ25tZW50KSkge1xuICAgICAgcHJvcGVydHlBc3NpZ25tZW50ID0gcHJvcGVydHlBc3NpZ25tZW50LnBhcmVudDtcbiAgICB9XG5cbiAgICBpZiAoIXByb3BlcnR5QXNzaWdubWVudCB8fCAhdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcGVydHlBc3NpZ25tZW50KSB8fFxuICAgICAgICBnZXRQcm9wZXJ0eU5hbWVUZXh0KHByb3BlcnR5QXNzaWdubWVudC5uYW1lKSAhPT0gJ3Byb3ZpZGUnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgb2JqZWN0TGl0ZXJhbEV4cHIgPSBwcm9wZXJ0eUFzc2lnbm1lbnQucGFyZW50O1xuICAgIGNvbnN0IG1hdGNoaW5nSWRlbnRpZmllcnMgPSBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzKG9iamVjdExpdGVyYWxFeHByLCB0cy5pc0lkZW50aWZpZXIpO1xuXG4gICAgLy8gV2UgbmFpdmVseSBhc3N1bWUgdGhhdCBpZiB0aGVyZSBpcyBhIHJlZmVyZW5jZSB0byB0aGUgXCJHZXN0dXJlQ29uZmlnXCIgZXhwb3J0XG4gICAgLy8gZnJvbSBBbmd1bGFyIE1hdGVyaWFsIGluIHRoZSBwcm92aWRlciBsaXRlcmFsLCB0aGF0IHRoZSBwcm92aWRlciBzZXRzIHVwIHRoZVxuICAgIC8vIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAgcmV0dXJuICF0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5zb21lKHIgPT4gbWF0Y2hpbmdJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGFuIGF2YWlsYWJsZSBmaWxlIG5hbWUgZm9yIHRoZSBnZXN0dXJlIGNvbmZpZyB3aGljaCBzaG91bGRcbiAgICogYmUgc3RvcmVkIGluIHRoZSBzcGVjaWZpZWQgZmlsZSBwYXRoLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0QXZhaWxhYmxlR2VzdHVyZUNvbmZpZ0ZpbGVOYW1lKHNvdXJjZVJvb3Q6IERldmtpdFBhdGgpIHtcbiAgICBpZiAoIXRoaXMudHJlZS5leGlzdHMoZGV2a2l0Sm9pbihzb3VyY2VSb290LCBgJHtHRVNUVVJFX0NPTkZJR19GSUxFX05BTUV9LnRzYCkpKSB7XG4gICAgICByZXR1cm4gYCR7R0VTVFVSRV9DT05GSUdfRklMRV9OQU1FfS50c2A7XG4gICAgfVxuXG4gICAgbGV0IHBvc3NpYmxlTmFtZSA9IGAke0dFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRX0tYDtcbiAgICBsZXQgaW5kZXggPSAxO1xuICAgIHdoaWxlICh0aGlzLnRyZWUuZXhpc3RzKGRldmtpdEpvaW4oc291cmNlUm9vdCwgYCR7cG9zc2libGVOYW1lfS0ke2luZGV4fS50c2ApKSkge1xuICAgICAgaW5kZXgrKztcbiAgICB9XG4gICAgcmV0dXJuIGAke3Bvc3NpYmxlTmFtZSArIGluZGV4fS50c2A7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZXMgYSBnaXZlbiBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2UgYnkgZW5zdXJpbmcgdGhhdCBpdCBpcyBpbXBvcnRlZFxuICAgKiBmcm9tIHRoZSBuZXcgc3BlY2lmaWVkIHBhdGguXG4gICAqL1xuICBwcml2YXRlIF9yZXBsYWNlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZShcbiAgICAgIHtub2RlLCBpbXBvcnREYXRhLCBpc0ltcG9ydH06IElkZW50aWZpZXJSZWZlcmVuY2UsIG5ld1BhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZ2V0VXBkYXRlUmVjb3JkZXIoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgLy8gTGlzdCBvZiBhbGwgaWRlbnRpZmllcnMgcmVmZXJyaW5nIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgY3VycmVudCBmaWxlLiBUaGlzXG4gICAgLy8gYWxsb3dzIHVzIHRvIGFkZCBhIGltcG9ydCBmb3IgdGhlIG5ldyBnZXN0dXJlIGNvbmZpZ3VyYXRpb24gd2l0aG91dCBnZW5lcmF0aW5nIGFcbiAgICAvLyBuZXcgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBpbXBvcnQuIGkuZS4gXCJHZXN0dXJlQ29uZmlnXzFcIi4gVGhlIGltcG9ydCBtYW5hZ2VyXG4gICAgLy8gY2hlY2tzIGZvciBwb3NzaWJsZSBuYW1lIGNvbGxpc2lvbnMsIGJ1dCBpcyBhYmxlIHRvIGlnbm9yZSBzcGVjaWZpYyBpZGVudGlmaWVycy5cbiAgICBjb25zdCBnZXN0dXJlSWRlbnRpZmllcnNJbkZpbGUgPVxuICAgICAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5maWx0ZXIoZCA9PiBkLm5vZGUuZ2V0U291cmNlRmlsZSgpID09PSBzb3VyY2VGaWxlKVxuICAgICAgICAgICAgLm1hcChkID0+IGQubm9kZSk7XG5cbiAgICBjb25zdCBuZXdNb2R1bGVTcGVjaWZpZXIgPSBnZXRNb2R1bGVTcGVjaWZpZXIobmV3UGF0aCwgc291cmNlRmlsZS5maWxlTmFtZSk7XG5cbiAgICAvLyBJZiB0aGUgcGFyZW50IG9mIHRoZSBpZGVudGlmaWVyIGlzIGFjY2Vzc2VkIHRocm91Z2ggYSBuYW1lc3BhY2UsIHdlIGNhbiBqdXN0XG4gICAgLy8gaW1wb3J0IHRoZSBuZXcgZ2VzdHVyZSBjb25maWcgd2l0aG91dCByZXdyaXRpbmcgdGhlIGltcG9ydCBkZWNsYXJhdGlvbiBiZWNhdXNlXG4gICAgLy8gdGhlIGNvbmZpZyBoYXMgYmVlbiBpbXBvcnRlZCB0aHJvdWdoIGEgbmFtZXNwYWNlZCBpbXBvcnQuXG4gICAgaWYgKGlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZSkpIHtcbiAgICAgIGNvbnN0IG5ld0V4cHJlc3Npb24gPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgICBzb3VyY2VGaWxlLCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLCBuZXdNb2R1bGVTcGVjaWZpZXIsIGZhbHNlLFxuICAgICAgICAgIGdlc3R1cmVJZGVudGlmaWVyc0luRmlsZSk7XG5cbiAgICAgIHJlY29yZGVyLnJlbW92ZShub2RlLnBhcmVudC5nZXRTdGFydCgpLCBub2RlLnBhcmVudC5nZXRXaWR0aCgpKTtcbiAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5vZGUucGFyZW50LmdldFN0YXJ0KCksIHRoaXMuX3ByaW50Tm9kZShuZXdFeHByZXNzaW9uLCBzb3VyY2VGaWxlKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRGVsZXRlIHRoZSBvbGQgaW1wb3J0IHRvIHRoZSBcIkdlc3R1cmVDb25maWdcIi5cbiAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChcbiAgICAgICAgc291cmNlRmlsZSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lKTtcblxuICAgIC8vIElmIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBpcyBub3QgZnJvbSBpbnNpZGUgb2YgYSBpbXBvcnQsIHdlIG5lZWQgdG8gYWRkIGEgbmV3XG4gICAgLy8gaW1wb3J0IHRvIHRoZSBjb3BpZWQgZ2VzdHVyZSBjb25maWcgYW5kIHJlcGxhY2UgdGhlIGlkZW50aWZpZXIuIEZvciByZWZlcmVuY2VzXG4gICAgLy8gd2l0aGluIGFuIGltcG9ydCwgd2UgZG8gbm90aGluZyBidXQgcmVtb3ZpbmcgdGhlIGFjdHVhbCBpbXBvcnQuIFRoaXMgYWxsb3dzIHVzXG4gICAgLy8gdG8gcmVtb3ZlIHVudXNlZCBpbXBvcnRzIHRvIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICBpZiAoIWlzSW1wb3J0KSB7XG4gICAgICBjb25zdCBuZXdFeHByZXNzaW9uID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgICAgc291cmNlRmlsZSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSwgbmV3TW9kdWxlU3BlY2lmaWVyLCBmYWxzZSxcbiAgICAgICAgICBnZXN0dXJlSWRlbnRpZmllcnNJbkZpbGUpO1xuXG4gICAgICByZWNvcmRlci5yZW1vdmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCkpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQobm9kZS5nZXRTdGFydCgpLCB0aGlzLl9wcmludE5vZGUobmV3RXhwcmVzc2lvbiwgc291cmNlRmlsZSkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgZ2l2ZW4gZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlIGFuZCBpdHMgY29ycmVzcG9uZGluZyBpbXBvcnQgZnJvbVxuICAgKiBpdHMgY29udGFpbmluZyBzb3VyY2UgZmlsZS4gSW1wb3J0cyB3aWxsIGJlIGFsd2F5cyByZW1vdmVkLCBidXQgaW4gc29tZSBjYXNlcyxcbiAgICogd2hlcmUgaXQncyBub3QgZ3VhcmFudGVlZCB0aGF0IGEgcmVtb3ZhbCBjYW4gYmUgcGVyZm9ybWVkIHNhZmVseSwgd2UganVzdFxuICAgKiBjcmVhdGUgYSBtaWdyYXRpb24gZmFpbHVyZSAoYW5kIGFkZCBhIFRPRE8gaWYgcG9zc2libGUpLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZSh7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnR9OiBJZGVudGlmaWVyUmVmZXJlbmNlKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5nZXRVcGRhdGVSZWNvcmRlcihzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICAvLyBPbmx5IHJlbW92ZSB0aGUgaW1wb3J0IGZvciB0aGUgZ2VzdHVyZSBjb25maWcgaWYgdGhlIGdlc3R1cmUgY29uZmlnIGhhc1xuICAgIC8vIGJlZW4gYWNjZXNzZWQgdGhyb3VnaCBhIG5vbi1uYW1lc3BhY2VkIGlkZW50aWZpZXIgYWNjZXNzLlxuICAgIGlmICghaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2Vzcyhub2RlKSkge1xuICAgICAgdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoXG4gICAgICAgICAgc291cmNlRmlsZSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lKTtcbiAgICB9XG5cbiAgICAvLyBGb3IgcmVmZXJlbmNlcyBmcm9tIHdpdGhpbiBhbiBpbXBvcnQsIHdlIGRvIG5vdCBuZWVkIHRvIGRvIGFueXRoaW5nIG90aGVyIHRoYW5cbiAgICAvLyByZW1vdmluZyB0aGUgaW1wb3J0LiBGb3Igb3RoZXIgcmVmZXJlbmNlcywgd2UgcmVtb3ZlIHRoZSBpbXBvcnQgYW5kIHRoZSByZWZlcmVuY2VcbiAgICAvLyBpZGVudGlmaWVyIGlmIHVzZWQgaW5zaWRlIG9mIGEgcHJvdmlkZXIgZGVmaW5pdGlvbi5cbiAgICBpZiAoaXNJbXBvcnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcm92aWRlckFzc2lnbm1lbnQgPSBub2RlLnBhcmVudDtcblxuICAgIC8vIE9ubHkgcmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlIGdlc3R1cmUgY29uZmlnIHdoaWNoIGFyZSBwYXJ0IG9mIGEgc3RhdGljYWxseVxuICAgIC8vIGFuYWx5emFibGUgcHJvdmlkZXIgZGVmaW5pdGlvbi4gV2Ugb25seSBzdXBwb3J0IHRoZSBjb21tb24gY2FzZSBvZiBhIGdlc3R1cmVcbiAgICAvLyBjb25maWcgcHJvdmlkZXIgZGVmaW5pdGlvbiB3aGVyZSB0aGUgY29uZmlnIGlzIHNldCB1cCB0aHJvdWdoIFwidXNlQ2xhc3NcIi5cbiAgICAvLyBPdGhlcndpc2UsIGl0J3Mgbm90IGd1YXJhbnRlZWQgdGhhdCB3ZSBjYW4gc2FmZWx5IHJlbW92ZSB0aGUgcHJvdmlkZXIgZGVmaW5pdGlvbi5cbiAgICBpZiAoIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3ZpZGVyQXNzaWdubWVudCkgfHxcbiAgICAgICAgZ2V0UHJvcGVydHlOYW1lVGV4dChwcm92aWRlckFzc2lnbm1lbnQubmFtZSkgIT09ICd1c2VDbGFzcycpIHtcbiAgICAgIHRoaXMuX25vZGVGYWlsdXJlcy5wdXNoKHtub2RlLCBtZXNzYWdlOiBDQU5OT1RfUkVNT1ZFX1JFRkVSRU5DRV9FUlJPUn0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9iamVjdExpdGVyYWxFeHByID0gcHJvdmlkZXJBc3NpZ25tZW50LnBhcmVudDtcbiAgICBjb25zdCBwcm92aWRlVG9rZW4gPSBvYmplY3RMaXRlcmFsRXhwci5wcm9wZXJ0aWVzLmZpbmQoXG4gICAgICAgIChwKTogcCBpcyB0cy5Qcm9wZXJ0eUFzc2lnbm1lbnQgPT5cbiAgICAgICAgICAgIHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHApICYmIGdldFByb3BlcnR5TmFtZVRleHQocC5uYW1lKSA9PT0gJ3Byb3ZpZGUnKTtcblxuICAgIC8vIERvIG5vdCByZW1vdmUgdGhlIHJlZmVyZW5jZSBpZiB0aGUgZ2VzdHVyZSBjb25maWcgaXMgbm90IHBhcnQgb2YgYSBwcm92aWRlciBkZWZpbml0aW9uLFxuICAgIC8vIG9yIGlmIHRoZSBwcm92aWRlZCB0b2tlIGlzIG5vdCByZWZlcnJpbmcgdG8gdGhlIGtub3duIEhBTU1FUl9HRVNUVVJFX0NPTkZJRyB0b2tlblxuICAgIC8vIGZyb20gcGxhdGZvcm0tYnJvd3Nlci5cbiAgICBpZiAoIXByb3ZpZGVUb2tlbiB8fCAhdGhpcy5faXNSZWZlcmVuY2VUb0hhbW1lckNvbmZpZ1Rva2VuKHByb3ZpZGVUb2tlbi5pbml0aWFsaXplcikpIHtcbiAgICAgIHRoaXMuX25vZGVGYWlsdXJlcy5wdXNoKHtub2RlLCBtZXNzYWdlOiBDQU5OT1RfUkVNT1ZFX1JFRkVSRU5DRV9FUlJPUn0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENvbGxlY3QgYWxsIG5lc3RlZCBpZGVudGlmaWVycyB3aGljaCB3aWxsIGJlIGRlbGV0ZWQuIFRoaXMgaGVscHMgdXNcbiAgICAvLyBkZXRlcm1pbmluZyBpZiB3ZSBjYW4gcmVtb3ZlIGltcG9ydHMgZm9yIHRoZSBcIkhBTU1FUl9HRVNUVVJFX0NPTkZJR1wiIHRva2VuLlxuICAgIHRoaXMuX2RlbGV0ZWRJZGVudGlmaWVycy5wdXNoKC4uLmZpbmRNYXRjaGluZ0NoaWxkTm9kZXMob2JqZWN0TGl0ZXJhbEV4cHIsIHRzLmlzSWRlbnRpZmllcikpO1xuXG4gICAgLy8gSW4gY2FzZSB0aGUgZm91bmQgcHJvdmlkZXIgZGVmaW5pdGlvbiBpcyBub3QgcGFydCBvZiBhbiBhcnJheSBsaXRlcmFsLFxuICAgIC8vIHdlIGNhbm5vdCBzYWZlbHkgcmVtb3ZlIHRoZSBwcm92aWRlci4gVGhpcyBpcyBiZWNhdXNlIGl0IGNvdWxkIGJlIGRlY2xhcmVkXG4gICAgLy8gYXMgYSB2YXJpYWJsZS4gZS5nLiBcImNvbnN0IGdlc3R1cmVQcm92aWRlciA9IHtwcm92aWRlOiAuLiwgdXNlQ2xhc3M6IEdlc3R1cmVDb25maWd9XCIuXG4gICAgLy8gSW4gdGhhdCBjYXNlLCB3ZSBqdXN0IGFkZCBhbiBlbXB0eSBvYmplY3QgbGl0ZXJhbCB3aXRoIFRPRE8gYW5kIHByaW50IGEgZmFpbHVyZS5cbiAgICBpZiAoIXRzLmlzQXJyYXlMaXRlcmFsRXhwcmVzc2lvbihvYmplY3RMaXRlcmFsRXhwci5wYXJlbnQpKSB7XG4gICAgICByZWNvcmRlci5yZW1vdmUob2JqZWN0TGl0ZXJhbEV4cHIuZ2V0U3RhcnQoKSwgb2JqZWN0TGl0ZXJhbEV4cHIuZ2V0V2lkdGgoKSk7XG4gICAgICByZWNvcmRlci5pbnNlcnRSaWdodChvYmplY3RMaXRlcmFsRXhwci5nZXRTdGFydCgpLCBgLyogVE9ETzogcmVtb3ZlICovIHt9YCk7XG4gICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7XG4gICAgICAgIG5vZGU6IG9iamVjdExpdGVyYWxFeHByLFxuICAgICAgICBtZXNzYWdlOiBgVW5hYmxlIHRvIGRlbGV0ZSBwcm92aWRlciBkZWZpbml0aW9uIGZvciBcIkdlc3R1cmVDb25maWdcIiBjb21wbGV0ZWx5LiBgICtcbiAgICAgICAgICAgIGBQbGVhc2UgY2xlYW4gdXAgdGhlIHByb3ZpZGVyLmBcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZXMgdGhlIG9iamVjdCBsaXRlcmFsIGZyb20gdGhlIHBhcmVudCBhcnJheSBleHByZXNzaW9uLiBSZW1vdmVzXG4gICAgLy8gdGhlIHRyYWlsaW5nIGNvbW1hIHRva2VuIGlmIHByZXNlbnQuXG4gICAgcmVtb3ZlRWxlbWVudEZyb21BcnJheUV4cHJlc3Npb24ob2JqZWN0TGl0ZXJhbEV4cHIsIHJlY29yZGVyKTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIHRoZSBnaXZlbiBoYW1tZXIgY29uZmlnIHRva2VuIGltcG9ydCBpZiBpdCBpcyBub3QgdXNlZC4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyQ29uZmlnVG9rZW5JbXBvcnRJZlVudXNlZCh7bm9kZSwgaW1wb3J0RGF0YX06IElkZW50aWZpZXJSZWZlcmVuY2UpIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgaXNUb2tlblVzZWQgPSB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShcbiAgICAgICAgciA9PiAhci5pc0ltcG9ydCAmJiAhaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2VzcyhyLm5vZGUpICYmXG4gICAgICAgICAgICByLm5vZGUuZ2V0U291cmNlRmlsZSgpID09PSBzb3VyY2VGaWxlICYmICF0aGlzLl9kZWxldGVkSWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSk7XG5cbiAgICAvLyBXZSBkb24ndCB3YW50IHRvIHJlbW92ZSB0aGUgaW1wb3J0IGZvciB0aGUgdG9rZW4gaWYgdGhlIHRva2VuIGlzXG4gICAgLy8gc3RpbGwgdXNlZCBzb21ld2hlcmUuXG4gICAgaWYgKCFpc1Rva2VuVXNlZCkge1xuICAgICAgdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoXG4gICAgICAgICAgc291cmNlRmlsZSwgSEFNTUVSX0NPTkZJR19UT0tFTl9OQU1FLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZW1vdmVzIEhhbW1lciBmcm9tIGFsbCBpbmRleCBIVE1MIGZpbGVzIG9mIHRoZSBnaXZlbiBwcm9qZWN0LiAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJGcm9tSW5kZXhGaWxlKHByb2plY3Q6IFdvcmtzcGFjZVByb2plY3QpIHtcbiAgICBjb25zdCBpbmRleEZpbGVQYXRocyA9IGdldFByb2plY3RJbmRleEZpbGVzKHByb2plY3QpO1xuICAgIGluZGV4RmlsZVBhdGhzLmZvckVhY2goZmlsZVBhdGggPT4ge1xuICAgICAgaWYgKCF0aGlzLnRyZWUuZXhpc3RzKGZpbGVQYXRoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGh0bWxDb250ZW50ID0gdGhpcy50cmVlLnJlYWQoZmlsZVBhdGgpIS50b1N0cmluZygndXRmOCcpO1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKGZpbGVQYXRoKTtcblxuICAgICAgZmluZEhhbW1lclNjcmlwdEltcG9ydEVsZW1lbnRzKGh0bWxDb250ZW50KVxuICAgICAgICAgIC5mb3JFYWNoKGVsID0+IHJlbW92ZUVsZW1lbnRGcm9tSHRtbChlbCwgcmVjb3JkZXIpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSBIYW1tZXIgZ2VzdHVyZSBjb25maWcgcHJvdmlkZXIgaW4gdGhlIGFwcCBtb2R1bGUgaWYgbmVlZGVkLiAqL1xuICBwcml2YXRlIF9zZXR1cEdlc3R1cmVDb25maWdJbkFwcE1vZHVsZShwcm9qZWN0OiBXb3Jrc3BhY2VQcm9qZWN0LCBjb25maWdQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYWluRmlsZVBhdGggPSBqb2luKHRoaXMuYmFzZVBhdGgsIGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KSk7XG4gICAgY29uc3QgbWFpbkZpbGUgPSB0aGlzLnByb2dyYW0uZ2V0U291cmNlRmlsZShtYWluRmlsZVBhdGgpO1xuICAgIGlmICghbWFpbkZpbGUpIHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiBtYWluRmlsZVBhdGgsXG4gICAgICAgIG1lc3NhZ2U6IENBTk5PVF9TRVRVUF9BUFBfTU9EVUxFX0VSUk9SLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYXBwTW9kdWxlRXhwciA9IGZpbmRNYWluTW9kdWxlRXhwcmVzc2lvbihtYWluRmlsZSk7XG4gICAgaWYgKCFhcHBNb2R1bGVFeHByKSB7XG4gICAgICB0aGlzLmZhaWx1cmVzLnB1c2goe1xuICAgICAgICBmaWxlUGF0aDogbWFpbkZpbGVQYXRoLFxuICAgICAgICBtZXNzYWdlOiBDQU5OT1RfU0VUVVBfQVBQX01PRFVMRV9FUlJPUixcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFwcE1vZHVsZVN5bWJvbCA9IHRoaXMuX2dldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKHVud3JhcEV4cHJlc3Npb24oYXBwTW9kdWxlRXhwcikpO1xuICAgIGlmICghYXBwTW9kdWxlU3ltYm9sIHx8ICFhcHBNb2R1bGVTeW1ib2wudmFsdWVEZWNsYXJhdGlvbikge1xuICAgICAgdGhpcy5mYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgZmlsZVBhdGg6IG1haW5GaWxlUGF0aCxcbiAgICAgICAgbWVzc2FnZTogQ0FOTk9UX1NFVFVQX0FQUF9NT0RVTEVfRVJST1IsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VGaWxlID0gYXBwTW9kdWxlU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHRoaXMuYmFzZVBhdGgsIHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IGhhbW1lckNvbmZpZ1Rva2VuRXhwciA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICBzb3VyY2VGaWxlLCBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUsIEhBTU1FUl9DT05GSUdfVE9LRU5fTU9EVUxFKTtcbiAgICBjb25zdCBnZXN0dXJlQ29uZmlnRXhwciA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICBzb3VyY2VGaWxlLCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLCBnZXRNb2R1bGVTcGVjaWZpZXIoY29uZmlnUGF0aCwgc291cmNlRmlsZS5maWxlTmFtZSkpO1xuXG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IG5ld1Byb3ZpZGVyTm9kZSA9IHRzLmNyZWF0ZU9iamVjdExpdGVyYWwoW1xuICAgICAgdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KCdwcm92aWRlJywgaGFtbWVyQ29uZmlnVG9rZW5FeHByKSxcbiAgICAgIHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgndXNlQ2xhc3MnLCBnZXN0dXJlQ29uZmlnRXhwcilcbiAgICBdKTtcblxuICAgIC8vIElmIG5vIFwiTmdNb2R1bGVcIiBkZWZpbml0aW9uIGlzIGZvdW5kIGluc2lkZSB0aGUgc291cmNlIGZpbGUsIHdlIGp1c3QgZG8gbm90aGluZy5cbiAgICBjb25zdCBtZXRhZGF0YSA9IGdldERlY29yYXRvck1ldGFkYXRhKHNvdXJjZUZpbGUsICdOZ01vZHVsZScsICdAYW5ndWxhci9jb3JlJykgYXNcbiAgICAgICAgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25bXTtcbiAgICBpZiAoIW1ldGFkYXRhLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3ZpZGVyc0ZpZWxkID0gZ2V0TWV0YWRhdGFGaWVsZChtZXRhZGF0YVswXSwgJ3Byb3ZpZGVycycpWzBdO1xuICAgIGNvbnN0IHByb3ZpZGVySWRlbnRpZmllcnMgPVxuICAgICAgICBwcm92aWRlcnNGaWVsZCA/IGZpbmRNYXRjaGluZ0NoaWxkTm9kZXMocHJvdmlkZXJzRmllbGQsIHRzLmlzSWRlbnRpZmllcikgOiBudWxsO1xuXG4gICAgLy8gSWYgdGhlIHByb3ZpZGVycyBmaWVsZCBleGlzdHMgYW5kIGFscmVhZHkgY29udGFpbnMgcmVmZXJlbmNlcyB0byB0aGUgaGFtbWVyXG4gICAgLy8gZ2VzdHVyZSBjb25maWcgdG9rZW4gYW5kIHRoZSBnZXN0dXJlIGNvbmZpZywgd2UgbmFpdmVseSBhc3N1bWUgdGhhdCB0aGUgZ2VzdHVyZVxuICAgIC8vIGNvbmZpZyBpcyBhbHJlYWR5IHNldCB1cC4gVGhpcyBjaGVjayBpcyBzbGlnaHRseSBuYWl2ZSBiZWNhdXNlIGl0IGFzc3VtZXMgdGhhdFxuICAgIC8vIHJlZmVyZW5jZXMgdG8gdGhlc2UgdHdvIHRva2VucyBhbHdheXMgbWVhbiB0aGF0IHRoZXkgYXJlIHNldCB1cCBhcyBhIHByb3ZpZGVyXG4gICAgLy8gZGVmaW5pdGlvbi4gVGhpcyBpcyBub3QgZ3VhcmFudGVlZCBiZWNhdXNlIGl0IGNvdWxkIGJlIGp1c3QgYnkgaW5jaWRlbnQgdGhhdFxuICAgIC8vIGdlc3R1cmUgY29uZmlnIGlzIHNvbWVob3cgcmVmZXJlbmNlcyBpbiBhIGRpZmZlcmVudCBwcm92aWRlciB0aGFuIGZvciBzZXR0aW5nIHVwXG4gICAgLy8gdGhlIGdlc3R1cmUgY29uZmlnIHRva2VuIGZyb20gcGxhdGZvcm0tYnJvd3Nlci4gVGhpcyBjaGVjayBjYW4gbmV2ZXIgYmUgdmVyeVxuICAgIC8vIHJvYnVzdCB3aXRob3V0IGFjdHVhbGx5IGludGVycHJldGluZyB0aGUgcHJvdmlkZXJzIGZpZWxkIGxpa2UgTkdDIG9yIG5ndHNjIHdvdWxkLlxuICAgIC8vICh0aGlzIHdvdWxkIGludm9sdmUgcGFydGlhbCBpbnRlcnByZXRhdGlvbiB3aXRoIG1ldGFkYXRhLmpzb24gZmlsZSBzdXBwb3J0KVxuICAgIGlmIChwcm92aWRlcklkZW50aWZpZXJzICYmXG4gICAgICAgIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gcHJvdmlkZXJJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKSAmJlxuICAgICAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5zb21lKHIgPT4gcHJvdmlkZXJJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYW5nZUFjdGlvbnMgPSBhZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEoc291cmNlRmlsZSwgcmVsYXRpdmVQYXRoLCAncHJvdmlkZXJzJyxcbiAgICAgICAgdGhpcy5fcHJpbnROb2RlKG5ld1Byb3ZpZGVyTm9kZSwgc291cmNlRmlsZSksIG51bGwpO1xuXG4gICAgY2hhbmdlQWN0aW9ucy5mb3JFYWNoKGNoYW5nZSA9PiB7XG4gICAgICBpZiAoY2hhbmdlIGluc3RhbmNlb2YgSW5zZXJ0Q2hhbmdlKSB7XG4gICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogUHJpbnRzIGEgZ2l2ZW4gbm9kZSB3aXRoaW4gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS4gKi9cbiAgcHJpdmF0ZSBfcHJpbnROb2RlKG5vZGU6IHRzLk5vZGUsIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgbm9kZSwgc291cmNlRmlsZSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc3ltYm9sIHRoYXQgY29udGFpbnMgdGhlIHZhbHVlIGRlY2xhcmF0aW9uIG9mIHRoZSBzcGVjaWZpZWQgbm9kZS4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZTogdHMuTm9kZSk6IHRzLlN5bWJvbHx1bmRlZmluZWQge1xuICAgIGNvbnN0IHN5bWJvbCA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihub2RlKTtcblxuICAgIC8vIFN5bWJvbHMgY2FuIGJlIGFsaWFzZXMgb2YgdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC4gZS5nLiBpbiBuYW1lZCBpbXBvcnQgc3BlY2lmaWVycy5cbiAgICAvLyBXZSBuZWVkIHRvIHJlc29sdmUgdGhlIGFsaWFzZWQgc3ltYm9sIGJhY2sgdG8gdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYml0d2lzZVxuICAgIGlmIChzeW1ib2wgJiYgKHN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSAhPT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudHlwZUNoZWNrZXIuZ2V0QWxpYXNlZFN5bWJvbChzeW1ib2wpO1xuICAgIH1cbiAgICByZXR1cm4gc3ltYm9sO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBleHByZXNzaW9uIHJlc29sdmVzIHRvIGEgaGFtbWVyIGdlc3R1cmUgY29uZmlnXG4gICAqIHRva2VuIHJlZmVyZW5jZSBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfaXNSZWZlcmVuY2VUb0hhbW1lckNvbmZpZ1Rva2VuKGV4cHI6IHRzLkV4cHJlc3Npb24pIHtcbiAgICBjb25zdCB1bndyYXBwZWQgPSB1bndyYXBFeHByZXNzaW9uKGV4cHIpO1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIodW53cmFwcGVkKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gci5ub2RlID09PSB1bndyYXBwZWQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24odW53cmFwcGVkKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gci5ub2RlID09PSB1bndyYXBwZWQubmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIG1pZ3JhdGlvbiBmYWlsdXJlcyBvZiB0aGUgY29sbGVjdGVkIG5vZGUgZmFpbHVyZXMuIFRoZSByZXR1cm5lZCBtaWdyYXRpb25cbiAgICogZmFpbHVyZXMgYXJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgcG9zdC1taWdyYXRpb24gc3RhdGUgb2Ygc291cmNlIGZpbGVzLiBNZWFuaW5nXG4gICAqIHRoYXQgZmFpbHVyZSBwb3NpdGlvbnMgYXJlIGNvcnJlY3RlZCBpZiBzb3VyY2UgZmlsZSBtb2RpZmljYXRpb25zIHNoaWZ0ZWQgbGluZXMuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVNaWdyYXRpb25GYWlsdXJlcygpOiBNaWdyYXRpb25GYWlsdXJlW10ge1xuICAgIHJldHVybiB0aGlzLl9ub2RlRmFpbHVyZXMubWFwKCh7bm9kZSwgbWVzc2FnZX0pID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICAgIGNvbnN0IG9mZnNldCA9IG5vZGUuZ2V0U3RhcnQoKTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdHMuZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24obm9kZS5nZXRTb3VyY2VGaWxlKCksIG5vZGUuZ2V0U3RhcnQoKSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGlvbjogdGhpcy5faW1wb3J0TWFuYWdlci5jb3JyZWN0Tm9kZVBvc2l0aW9uKG5vZGUsIG9mZnNldCwgcG9zaXRpb24pLFxuICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICBmaWxlUGF0aDogc291cmNlRmlsZS5maWxlTmFtZSxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgcHJvamVjdCBmcm9tIHRoZSBjdXJyZW50IHByb2dyYW0gb3IgdGhyb3dzIGlmIG5vIHByb2plY3RcbiAgICogY291bGQgYmUgZm91bmQuXG4gICAqL1xuICBwcml2YXRlIF9nZXRQcm9qZWN0T3JUaHJvdygpOiBXb3Jrc3BhY2VQcm9qZWN0IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UodGhpcy50cmVlKTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Qcm9ncmFtKHdvcmtzcGFjZSwgdGhpcy5wcm9ncmFtKTtcblxuICAgIGlmICghcHJvamVjdCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oXG4gICAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIHByb2plY3QgdG8gcGVyZm9ybSBIYW1tZXJKUyB2OSBtaWdyYXRpb24uICcgK1xuICAgICAgICAgICdQbGVhc2UgZW5zdXJlIHlvdXIgd29ya3NwYWNlIGNvbmZpZ3VyYXRpb24gZGVmaW5lcyBhIHByb2plY3QuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2plY3Q7XG4gIH1cblxuICAvKiogR2xvYmFsIHN0YXRlIG9mIHdoZXRoZXIgSGFtbWVyIGlzIHVzZWQgaW4gYW55IGFuYWx5emVkIHByb2plY3QgdGFyZ2V0LiAqL1xuICBzdGF0aWMgZ2xvYmFsVXNlc0hhbW1lciA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBTdGF0aWMgbWlncmF0aW9uIHJ1bGUgbWV0aG9kIHRoYXQgd2lsbCBiZSBjYWxsZWQgb25jZSBhbGwgcHJvamVjdCB0YXJnZXRzXG4gICAqIGhhdmUgYmVlbiBtaWdyYXRlZCBpbmRpdmlkdWFsbHkuIFRoaXMgbWV0aG9kIGNhbiBiZSB1c2VkIHRvIG1ha2UgY2hhbmdlcyBiYXNlZFxuICAgKiBvbiB0aGUgYW5hbHlzaXMgb2YgdGhlIGluZGl2aWR1YWwgdGFyZ2V0cy4gRm9yIGV4YW1wbGU6IHdlIG9ubHkgcmVtb3ZlIEhhbW1lclxuICAgKiBmcm9tIHRoZSBcInBhY2thZ2UuanNvblwiIGlmIGl0IGlzIG5vdCB1c2VkIGluICphbnkqIHByb2plY3QgdGFyZ2V0LlxuICAgKi9cbiAgc3RhdGljIGdsb2JhbFBvc3RNaWdyYXRpb24odHJlZTogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkge1xuICAgIGlmICghdGhpcy5nbG9iYWxVc2VzSGFtbWVyICYmIHRoaXMuX3JlbW92ZUhhbW1lckZyb21QYWNrYWdlSnNvbih0cmVlKSkge1xuICAgICAgLy8gU2luY2UgSGFtbWVyIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgd29ya3NwYWNlIFwicGFja2FnZS5qc29uXCIgZmlsZSxcbiAgICAgIC8vIHdlIHNjaGVkdWxlIGEgbm9kZSBwYWNrYWdlIGluc3RhbGwgdGFzayB0byByZWZyZXNoIHRoZSBsb2NrIGZpbGUuXG4gICAgICBjb250ZXh0LmFkZFRhc2sobmV3IE5vZGVQYWNrYWdlSW5zdGFsbFRhc2soe3F1aWV0OiBmYWxzZX0pKTtcbiAgICB9XG5cbiAgICBjb250ZXh0LmxvZ2dlci5pbmZvKGNoYWxrLnllbGxvdyhcbiAgICAgICAgJ+KaoCBUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIGNvbXBvbmVudHMgaXMgbm90IGFibGUgdG8gbWlncmF0ZSB0ZXN0cy4gJyArXG4gICAgICAgICdQbGVhc2UgbWFudWFsbHkgY2xlYW4gdXAgdGVzdHMgaW4geW91ciBwcm9qZWN0IGlmIHRoZXkgcmVseSBvbiBIYW1tZXJKUy4nKSk7XG5cbiAgICAvLyBDbGVhbiBnbG9iYWwgc3RhdGUgb25jZSB0aGUgd29ya3NwYWNlIGhhcyBiZWVuIG1pZ3JhdGVkLiBUaGlzIGlzIHRlY2huaWNhbGx5XG4gICAgLy8gbm90IG5lY2Vzc2FyeSBpbiBcIm5nIHVwZGF0ZVwiLCBidXQgaW4gdGVzdHMgd2UgcmUtdXNlIHRoZSBzYW1lIHJ1bGUgY2xhc3MuXG4gICAgdGhpcy5nbG9iYWxVc2VzSGFtbWVyID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgaGFtbWVyIHBhY2thZ2UgZnJvbSB0aGUgd29ya3NwYWNlIFwicGFja2FnZS5qc29uXCIuXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgSGFtbWVyIHdhcyBzZXQgdXAgYW5kIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgXCJwYWNrYWdlLmpzb25cIlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgX3JlbW92ZUhhbW1lckZyb21QYWNrYWdlSnNvbih0cmVlOiBUcmVlKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0cmVlLmV4aXN0cygnL3BhY2thZ2UuanNvbicpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHRyZWUucmVhZCgnL3BhY2thZ2UuanNvbicpIS50b1N0cmluZygndXRmOCcpKTtcblxuICAgIC8vIFdlIGRvIG5vdCBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgc29tZW9uZSBtYW51YWxseSBhZGRlZCBcImhhbW1lcmpzXCJcbiAgICAvLyB0byB0aGUgZGV2IGRlcGVuZGVuY2llcy5cbiAgICBpZiAocGFja2FnZUpzb24uZGVwZW5kZW5jaWVzW0hBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSXSkge1xuICAgICAgZGVsZXRlIHBhY2thZ2VKc29uLmRlcGVuZGVuY2llc1tIQU1NRVJfTU9EVUxFX1NQRUNJRklFUl07XG4gICAgICB0cmVlLm92ZXJ3cml0ZSgnL3BhY2thZ2UuanNvbicsIEpTT04uc3RyaW5naWZ5KHBhY2thZ2VKc29uLCBudWxsLCAyKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgdW53cmFwcyBhIGdpdmVuIGV4cHJlc3Npb24gaWYgaXQgaXMgd3JhcHBlZFxuICogYnkgcGFyZW50aGVzaXMsIHR5cGUgY2FzdHMgb3IgdHlwZSBhc3NlcnRpb25zLlxuICovXG5mdW5jdGlvbiB1bndyYXBFeHByZXNzaW9uKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlIHtcbiAgaWYgKHRzLmlzUGFyZW50aGVzaXplZEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9IGVsc2UgaWYgKHRzLmlzQXNFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgcmV0dXJuIHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgfSBlbHNlIGlmICh0cy5pc1R5cGVBc3NlcnRpb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9XG4gIHJldHVybiBub2RlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBzcGVjaWZpZWQgcGF0aCB0byBhIHZhbGlkIFR5cGVTY3JpcHQgbW9kdWxlIHNwZWNpZmllciB3aGljaCBpc1xuICogcmVsYXRpdmUgdG8gdGhlIGdpdmVuIGNvbnRhaW5pbmcgZmlsZS5cbiAqL1xuZnVuY3Rpb24gZ2V0TW9kdWxlU3BlY2lmaWVyKG5ld1BhdGg6IHN0cmluZywgY29udGFpbmluZ0ZpbGU6IHN0cmluZykge1xuICBsZXQgcmVzdWx0ID0gcmVsYXRpdmUoZGlybmFtZShjb250YWluaW5nRmlsZSksIG5ld1BhdGgpLnJlcGxhY2UoL1xcXFwvZywgJy8nKS5yZXBsYWNlKC9cXC50cyQvLCAnJyk7XG4gIGlmICghcmVzdWx0LnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgIHJlc3VsdCA9IGAuLyR7cmVzdWx0fWA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSBuYW1lLlxuICogQHJldHVybnMgVGV4dCBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgbmFtZS4gTnVsbCBpZiBub3Qgc3RhdGljYWxseSBhbmFseXphYmxlLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eU5hbWVUZXh0KG5vZGU6IHRzLlByb3BlcnR5TmFtZSk6IHN0cmluZ3xudWxsIHtcbiAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSB8fCB0cy5pc1N0cmluZ0xpdGVyYWxMaWtlKG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGUudGV4dDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBpZGVudGlmaWVyIGlzIHBhcnQgb2YgYSBuYW1lc3BhY2VkIGFjY2Vzcy4gKi9cbmZ1bmN0aW9uIGlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZTogdHMuSWRlbnRpZmllcik6IGJvb2xlYW4ge1xuICByZXR1cm4gdHMuaXNRdWFsaWZpZWROYW1lKG5vZGUucGFyZW50KSB8fCB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLnBhcmVudCk7XG59XG5cbi8qKlxuICogV2Fsa3MgdGhyb3VnaCB0aGUgc3BlY2lmaWVkIG5vZGUgYW5kIHJldHVybnMgYWxsIGNoaWxkIG5vZGVzIHdoaWNoIG1hdGNoIHRoZVxuICogZ2l2ZW4gcHJlZGljYXRlLlxuICovXG5mdW5jdGlvbiBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzPFQgZXh0ZW5kcyB0cy5Ob2RlPihcbiAgICBwYXJlbnQ6IHRzLk5vZGUsIHByZWRpY2F0ZTogKG5vZGU6IHRzLk5vZGUpID0+IG5vZGUgaXMgVCk6IFRbXSB7XG4gIGNvbnN0IHJlc3VsdDogVFtdID0gW107XG4gIGNvbnN0IHZpc2l0Tm9kZSA9IChub2RlOiB0cy5Ob2RlKSA9PiB7XG4gICAgaWYgKHByZWRpY2F0ZShub2RlKSkge1xuICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XG4gICAgfVxuICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCB2aXNpdE5vZGUpO1xuICB9O1xuICB0cy5mb3JFYWNoQ2hpbGQocGFyZW50LCB2aXNpdE5vZGUpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl19