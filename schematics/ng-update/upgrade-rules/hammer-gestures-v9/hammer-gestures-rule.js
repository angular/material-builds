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
        define("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-gestures-rule", ["require", "exports", "@angular-devkit/core", "@angular-devkit/schematics", "@angular-devkit/schematics/tasks", "@angular/cdk/schematics", "@schematics/angular/utility/ast-utils", "@schematics/angular/utility/change", "@schematics/angular/utility/config", "@schematics/angular/utility/ng-ast-utils", "chalk", "fs", "path", "typescript", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/cli-workspace", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/find-hammer-script-tags", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-template-check", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/identifier-imports", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/import-manager", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/remove-array-element", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/remove-element-from-html"], factory);
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
    const ng_ast_utils_1 = require("@schematics/angular/utility/ng-ast-utils");
    const chalk_1 = require("chalk");
    const fs_1 = require("fs");
    const path_1 = require("path");
    const ts = require("typescript");
    const cli_workspace_1 = require("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/cli-workspace");
    const find_hammer_script_tags_1 = require("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/find-hammer-script-tags");
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
            const appModulePath = ng_ast_utils_1.getAppModulePath(this.tree, schematics_2.getProjectMainFile(project));
            const sourceFile = this.program.getSourceFile(path_1.join(this.basePath, appModulePath));
            if (!sourceFile) {
                this.failures.push({
                    filePath: appModulePath,
                    message: `Could not setup HammerJS gesture in module. Please manually ensure that ` +
                        `the Hammer gesture config is set up.`,
                    position: { character: 0, line: 0 }
                });
                return;
            }
            // Setup the gesture config provider in the project app module if not done.
            this._setupGestureConfigProviderIfNeeded(sourceFile, appModulePath, gestureConfigPath);
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
        /**
         * Sets up the Hammer gesture config provider in the given app module
         * if needed.
         */
        _setupGestureConfigProviderIfNeeded(sourceFile, appModulePath, configPath) {
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
            const changeActions = ast_utils_1.addSymbolToNgModuleMetadata(sourceFile, appModulePath, 'providers', this._printNode(newProviderNode, sourceFile), null);
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
            context.logger.info(chalk_1.default.yellow('  ⚠   The HammerJS v9 migration for Angular components is not able to migrate tests. ' +
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLWdlc3R1cmVzLXJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvdXBncmFkZS1ydWxlcy9oYW1tZXItZ2VzdHVyZXMtdjkvaGFtbWVyLWdlc3R1cmVzLXJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCwrQ0FJOEI7SUFDOUIsMkRBQXVGO0lBQ3ZGLDREQUF3RTtJQUN4RSx3REFPaUM7SUFDakMscUVBSStDO0lBQy9DLCtEQUFnRTtJQUNoRSwrREFBZ0U7SUFDaEUsMkVBQTBFO0lBRTFFLGlDQUEwQjtJQUMxQiwyQkFBZ0M7SUFDaEMsK0JBQTZDO0lBQzdDLGlDQUFpQztJQUVqQyx5SEFBc0Q7SUFDdEQsNklBQXlFO0lBQ3pFLHlJQUFpRTtJQUNqRSxtSUFBbUU7SUFDbkUsMkhBQStDO0lBQy9DLHVJQUF3RTtJQUN4RSwrSUFBaUU7SUFFakUsTUFBTSx5QkFBeUIsR0FBRyxlQUFlLENBQUM7SUFDbEQsTUFBTSx3QkFBd0IsR0FBRyxnQkFBZ0IsQ0FBQztJQUNsRCxNQUFNLDRCQUE0QixHQUFHLDJCQUEyQixDQUFDO0lBQ2pFLE1BQU0sd0JBQXdCLEdBQUcsdUJBQXVCLENBQUM7SUFDekQsTUFBTSwwQkFBMEIsR0FBRywyQkFBMkIsQ0FBQztJQUMvRCxNQUFNLHVCQUF1QixHQUFHLFVBQVUsQ0FBQztJQUUzQyxNQUFNLDZCQUE2QixHQUMvQixxRUFBcUUsQ0FBQztJQVExRSxNQUFhLGtCQUFtQixTQUFRLDBCQUFtQjtRQUEzRDs7WUFDRSx5RkFBeUY7WUFDekYseUVBQXlFO1lBQ3pFLDRGQUE0RjtZQUM1RixnQkFBVyxHQUNQLENBQUMsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsR0FBRyxDQUFDO2dCQUNyRixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7WUFFZixhQUFRLEdBQUcsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzlCLG1CQUFjLEdBQUcsSUFBSSw4QkFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUUsa0JBQWEsR0FBdUMsRUFBRSxDQUFDO1lBRS9ELHFFQUFxRTtZQUM3RCxvQkFBZSxHQUFHLEtBQUssQ0FBQztZQUVoQywrQ0FBK0M7WUFDdkMsbUJBQWMsR0FBRyxLQUFLLENBQUM7WUFFL0I7OztlQUdHO1lBQ0ssb0JBQWUsR0FBMkIsRUFBRSxDQUFDO1lBRXJEOztlQUVHO1lBQ0ssNkJBQXdCLEdBQTBCLEVBQUUsQ0FBQztZQUU3RDs7O2VBR0c7WUFDSyxpQ0FBNEIsR0FBMEIsRUFBRSxDQUFDO1lBRWpFOzs7ZUFHRztZQUNLLHdCQUFtQixHQUFvQixFQUFFLENBQUM7UUFzbEJwRCxDQUFDO1FBcGxCQyxhQUFhLENBQUMsUUFBMEI7WUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksZ0RBQXdCLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUN2RSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQzthQUM3QjtRQUNILENBQUM7UUFFRCxTQUFTLENBQUMsSUFBYTtZQUNyQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUVELFlBQVk7WUFDVixxRUFBcUU7WUFDckUsOENBQThDO1lBQzlDLE1BQU0sMkJBQTJCLEdBQzdCLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUzRixJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtnQkFDL0MsaUZBQWlGO2dCQUNqRixzRkFBc0Y7Z0JBQ3RGLG1GQUFtRjtnQkFDbkYseUJBQXlCO2dCQUN6QixrQkFBa0IsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Z0JBRTNDLHNFQUFzRTtnQkFDdEUscUVBQXFFO2dCQUNyRSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDekIsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7aUJBQ2xDO3FCQUFNO29CQUNMLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO2lCQUNsQzthQUNGO2lCQUFNO2dCQUNMLHNFQUFzRTtnQkFDdEUsc0VBQXNFO2dCQUN0RSx3RUFBd0U7Z0JBQ3hFLElBQUksMkJBQTJCLEVBQUU7b0JBQy9CLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO29CQUNqQyxnRkFBZ0Y7b0JBQ2hGLCtFQUErRTtvQkFDL0UsOEVBQThFO29CQUM5RSxvQ0FBb0M7b0JBQ3BDLElBQUksSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRTt3QkFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFLLENBQUMsTUFBTSxDQUN2Qiw2RUFBNkU7NEJBQzdFLCtFQUErRTs0QkFDL0UsMEVBQTBFLENBQUMsQ0FBQyxDQUFDO3FCQUNsRjtpQkFDRjtxQkFBTTtvQkFDTCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztpQkFDM0I7YUFDRjtZQUVELGlGQUFpRjtZQUNqRix1RkFBdUY7WUFDdkYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUVwQyxpRkFBaUY7WUFDakYsOEVBQThFO1lBQzlFLG1FQUFtRTtZQUNuRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQUM7WUFFdkQsaUZBQWlGO1lBQ2pGLG9GQUFvRjtZQUNwRixxRkFBcUY7WUFDckYsMEZBQTBGO1lBQzFGLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ2hELElBQUksQ0FBQyxTQUFTLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FDdkIsZ0VBQWdFO29CQUNoRSx1RkFBdUY7b0JBQ3ZGLGtFQUFrRSxDQUFDLENBQUMsQ0FBQzthQUMxRTtRQUNILENBQUM7UUFFRDs7Ozs7Ozs7V0FRRztRQUNLLHlCQUF5QjtZQUMvQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMxQyxNQUFNLFVBQVUsR0FBRyxnQkFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0saUJBQWlCLEdBQ25CLFdBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFFaEYscURBQXFEO1lBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUNaLGlCQUFpQixFQUFFLGlCQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFNUYsNERBQTREO1lBQzVELElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQ2pDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFFcEUsTUFBTSxhQUFhLEdBQUcsK0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSwrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQy9FLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFdBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFFbEYsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDZixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDakIsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLE9BQU8sRUFBRSwwRUFBMEU7d0JBQy9FLHNDQUFzQztvQkFDMUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFDO2lCQUNsQyxDQUFDLENBQUM7Z0JBQ0gsT0FBTzthQUNSO1lBRUQsMkVBQTJFO1lBQzNFLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDekYsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0ssa0JBQWtCO1lBQ3hCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBRTFDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXBGLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1lBQ2pDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNLLHlCQUF5QjtZQUMvQixJQUFJLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbEYsSUFBSSxDQUFDLDRCQUE0QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDNUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFO29CQUNkLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDaEQ7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRDs7O1dBR0c7UUFDSyxpQ0FBaUMsQ0FBQyxJQUFhO1lBQ3JELElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDekIsTUFBTSxVQUFVLEdBQUcsMENBQXFCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDakUsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLFVBQVUsS0FBSyx3QkFBd0I7b0JBQ2hFLFVBQVUsQ0FBQyxVQUFVLEtBQUssMEJBQTBCLEVBQUU7b0JBQ3hELElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQ2xDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLENBQUM7aUJBQ3RFO2FBQ0Y7UUFDSCxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNLLG1CQUFtQixDQUFDLElBQWE7WUFDdkMsSUFBSSxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO2dCQUN4RSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksS0FBSyx1QkFBdUIsRUFBRTtnQkFDekQsMkVBQTJFO2dCQUMzRSw0RUFBNEU7Z0JBQzVFLGdEQUFnRDtnQkFDaEQsSUFBSSxJQUFJLENBQUMsWUFBWTtvQkFDakIsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxJQUFJLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUM7d0JBQ3JGLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQzVELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2lCQUM1QjtxQkFBTTtvQkFDTCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDakM7YUFDRjtRQUNILENBQUM7UUFFRDs7O1dBR0c7UUFDSywyQkFBMkIsQ0FBQyxJQUFhO1lBQy9DLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDdkIsT0FBTzthQUNSO1lBRUQscUNBQXFDO1lBQ3JDLElBQUksRUFBRSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtnQkFDdEUsTUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7b0JBQy9ELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2lCQUM1QjtnQkFDRCxPQUFPO2FBQ1I7WUFFRCx3Q0FBd0M7WUFDeEMsSUFBSSxFQUFFLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7Z0JBQ2pGLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUM3QyxNQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3JELElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtvQkFDL0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7aUJBQzVCO2dCQUNELE9BQU87YUFDUjtZQUVELHlFQUF5RTtZQUN6RSxnRkFBZ0Y7WUFDaEYsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtnQkFDL0MsQ0FBQyxFQUFFLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDN0YsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0RCxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsZ0JBQWdCO29CQUNqQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO29CQUNoRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztpQkFDNUI7YUFDRjtRQUNILENBQUM7UUFFRDs7O1dBR0c7UUFDSyw4QkFBOEIsQ0FBQyxJQUFhO1lBQ2xELElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDekIsTUFBTSxVQUFVLEdBQUcsMENBQXFCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDakUsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLFVBQVUsS0FBSyx5QkFBeUI7b0JBQ2pFLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLEVBQUU7b0JBQzFELElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQzlCLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLENBQUM7aUJBQ3RFO2FBQ0Y7UUFDSCxDQUFDO1FBRUQ7OztXQUdHO1FBQ0ssaUNBQWlDLENBQUMsUUFBNkI7WUFDckUsbUVBQW1FO1lBQ25FLGdEQUFnRDtZQUNoRCxJQUFJLGtCQUFrQixHQUFZLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDaEQsT0FBTyxrQkFBa0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO2dCQUN6RSxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7YUFDaEQ7WUFFRCxJQUFJLENBQUMsa0JBQWtCLElBQUksQ0FBQyxFQUFFLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLENBQUM7Z0JBQ25FLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDOUQsT0FBTyxLQUFLLENBQUM7YUFDZDtZQUVELE1BQU0saUJBQWlCLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDO1lBQ3BELE1BQU0sbUJBQW1CLEdBQUcsc0JBQXNCLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRXZGLCtFQUErRTtZQUMvRSwrRUFBK0U7WUFDL0UsbUNBQW1DO1lBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3hGLENBQUM7UUFFRDs7O1dBR0c7UUFDSyxrQ0FBa0MsQ0FBQyxVQUFzQjtZQUMvRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVSxDQUFDLFVBQVUsRUFBRSxHQUFHLHdCQUF3QixLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUMvRSxPQUFPLEdBQUcsd0JBQXdCLEtBQUssQ0FBQzthQUN6QztZQUVELElBQUksWUFBWSxHQUFHLEdBQUcsd0JBQXdCLEdBQUcsQ0FBQztZQUNsRCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDZCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVUsQ0FBQyxVQUFVLEVBQUUsR0FBRyxZQUFZLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUM5RSxLQUFLLEVBQUUsQ0FBQzthQUNUO1lBQ0QsT0FBTyxHQUFHLFlBQVksR0FBRyxLQUFLLEtBQUssQ0FBQztRQUN0QyxDQUFDO1FBRUQ7OztXQUdHO1FBQ0ssOEJBQThCLENBQ2xDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQXNCLEVBQUUsT0FBZTtZQUNwRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDeEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3RCxvRkFBb0Y7WUFDcEYsbUZBQW1GO1lBQ25GLG1GQUFtRjtZQUNuRixtRkFBbUY7WUFDbkYsTUFBTSx3QkFBd0IsR0FDMUIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEtBQUssVUFBVSxDQUFDO2lCQUMzRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFMUIsTUFBTSxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTVFLCtFQUErRTtZQUMvRSxpRkFBaUY7WUFDakYsNERBQTREO1lBQzVELElBQUksNEJBQTRCLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3RDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQzNELFVBQVUsRUFBRSx5QkFBeUIsRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQ2hFLHdCQUF3QixDQUFDLENBQUM7Z0JBRTlCLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ2hFLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN6RixPQUFPO2FBQ1I7WUFFRCxnREFBZ0Q7WUFDaEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsQ0FDeEMsVUFBVSxFQUFFLHlCQUF5QixFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVsRSxnRkFBZ0Y7WUFDaEYsaUZBQWlGO1lBQ2pGLGlGQUFpRjtZQUNqRiwyREFBMkQ7WUFDM0QsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDYixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUMzRCxVQUFVLEVBQUUseUJBQXlCLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUNoRSx3QkFBd0IsQ0FBQyxDQUFDO2dCQUU5QixRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDbEQsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUNuRjtRQUNILENBQUM7UUFFRDs7Ozs7V0FLRztRQUNLLDZCQUE2QixDQUFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQXNCO1lBQ3JGLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdELDBFQUEwRTtZQUMxRSw0REFBNEQ7WUFDNUQsSUFBSSxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLHdCQUF3QixDQUN4QyxVQUFVLEVBQUUseUJBQXlCLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ25FO1lBRUQsaUZBQWlGO1lBQ2pGLG9GQUFvRjtZQUNwRixzREFBc0Q7WUFDdEQsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osT0FBTzthQUNSO1lBRUQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBRXZDLDhFQUE4RTtZQUM5RSwrRUFBK0U7WUFDL0UsNEVBQTRFO1lBQzVFLG9GQUFvRjtZQUNwRixJQUFJLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDO2dCQUM1QyxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxVQUFVLEVBQUU7Z0JBQy9ELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSw2QkFBNkIsRUFBQyxDQUFDLENBQUM7Z0JBQ3hFLE9BQU87YUFDUjtZQUVELE1BQU0saUJBQWlCLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDO1lBQ3BELE1BQU0sWUFBWSxHQUFHLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQ2xELENBQUMsQ0FBQyxFQUE4QixFQUFFLENBQzlCLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUM7WUFFakYsMEZBQTBGO1lBQzFGLG9GQUFvRjtZQUNwRix5QkFBeUI7WUFDekIsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQ3BGLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSw2QkFBNkIsRUFBQyxDQUFDLENBQUM7Z0JBQ3hFLE9BQU87YUFDUjtZQUVELHNFQUFzRTtZQUN0RSw4RUFBOEU7WUFDOUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxHQUFHLHNCQUFzQixDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBRTdGLHlFQUF5RTtZQUN6RSw2RUFBNkU7WUFDN0Usd0ZBQXdGO1lBQ3hGLG1GQUFtRjtZQUNuRixJQUFJLENBQUMsRUFBRSxDQUFDLHdCQUF3QixDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUMxRCxRQUFRLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxFQUFFLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQzVFLFFBQVEsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztnQkFDNUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7b0JBQ3RCLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLE9BQU8sRUFBRSx1RUFBdUU7d0JBQzVFLCtCQUErQjtpQkFDcEMsQ0FBQyxDQUFDO2dCQUNILE9BQU87YUFDUjtZQUVELHVFQUF1RTtZQUN2RSx1Q0FBdUM7WUFDdkMsdURBQWdDLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUVELHNFQUFzRTtRQUM5RCxzQ0FBc0MsQ0FBQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQXNCO1lBQ3BGLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUN0RCxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3JELENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEtBQUssVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUU3RixtRUFBbUU7WUFDbkUsd0JBQXdCO1lBQ3hCLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxjQUFjLENBQUMsd0JBQXdCLENBQ3hDLFVBQVUsRUFBRSx3QkFBd0IsRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDbEU7UUFDSCxDQUFDO1FBRUQscUVBQXFFO1FBQzdELDBCQUEwQixDQUFDLE9BQXlCO1lBQzFELE1BQU0sY0FBYyxHQUFHLGlDQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JELGNBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDL0IsT0FBTztpQkFDUjtnQkFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQy9ELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFbEQsd0RBQThCLENBQUMsV0FBVyxDQUFDO3FCQUN0QyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxnREFBcUIsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUMxRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRDs7O1dBR0c7UUFDSyxtQ0FBbUMsQ0FDdkMsVUFBeUIsRUFBRSxhQUFxQixFQUFFLFVBQWtCO1lBQ3RFLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FDbkUsVUFBVSxFQUFFLHdCQUF3QixFQUFFLDBCQUEwQixDQUFDLENBQUM7WUFDdEUsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUMvRCxVQUFVLEVBQUUseUJBQXlCLEVBQUUsa0JBQWtCLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBRWhHLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0QsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDO2dCQUM3QyxFQUFFLENBQUMsd0JBQXdCLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDO2dCQUM3RCxFQUFFLENBQUMsd0JBQXdCLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDO2FBQzNELENBQUMsQ0FBQztZQUVILG1GQUFtRjtZQUNuRixNQUFNLFFBQVEsR0FBRyxnQ0FBb0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FDN0MsQ0FBQztZQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDcEIsT0FBTzthQUNSO1lBRUQsTUFBTSxjQUFjLEdBQUcsNEJBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sbUJBQW1CLEdBQ3JCLGNBQWMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBRXBGLDhFQUE4RTtZQUM5RSxrRkFBa0Y7WUFDbEYsaUZBQWlGO1lBQ2pGLGdGQUFnRjtZQUNoRiwrRUFBK0U7WUFDL0UsbUZBQW1GO1lBQ25GLCtFQUErRTtZQUMvRSxvRkFBb0Y7WUFDcEYsOEVBQThFO1lBQzlFLElBQUksbUJBQW1CO2dCQUNuQixJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDakYsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtnQkFDakYsT0FBTzthQUNSO1lBRUQsTUFBTSxhQUFhLEdBQUcsdUNBQTJCLENBQzdDLFVBQVUsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRWhHLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzdCLElBQUksTUFBTSxZQUFZLHFCQUFZLEVBQUU7b0JBQ2xDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2hEO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsNERBQTREO1FBQ3BELFVBQVUsQ0FBQyxJQUFhLEVBQUUsVUFBeUI7WUFDekQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDNUUsQ0FBQztRQUVELGlGQUFpRjtRQUN6RSwyQkFBMkIsQ0FBQyxJQUFhO1lBQy9DLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFMUQscUZBQXFGO1lBQ3JGLHdFQUF3RTtZQUN4RSxzQ0FBc0M7WUFDdEMsSUFBSSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN6RCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDbEQ7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBRUQ7OztXQUdHO1FBQ0ssK0JBQStCLENBQUMsSUFBbUI7WUFDekQsTUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekMsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUM5QixPQUFPLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDO2FBQzFFO2lCQUFNLElBQUksRUFBRSxDQUFDLDBCQUEwQixDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNuRCxPQUFPLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMvRTtZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSyx3QkFBd0I7WUFDOUIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxFQUFFLEVBQUU7Z0JBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDeEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUMvQixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUN6RixPQUFPO29CQUNMLFFBQVEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDO29CQUN6RSxPQUFPLEVBQUUsT0FBTztvQkFDaEIsUUFBUSxFQUFFLFVBQVUsQ0FBQyxRQUFRO2lCQUM5QixDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQ7OztXQUdHO1FBQ0ssa0JBQWtCO1lBQ3hCLE1BQU0sU0FBUyxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFDLE1BQU0sT0FBTyxHQUFHLHFDQUFxQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFL0QsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDWixNQUFNLElBQUksZ0NBQW1CLENBQ3pCLDJEQUEyRDtvQkFDM0QsK0RBQStELENBQUMsQ0FBQzthQUN0RTtZQUVELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFLRDs7Ozs7V0FLRztRQUNILE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFVLEVBQUUsT0FBeUI7WUFDOUQsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3JFLHdFQUF3RTtnQkFDeEUsb0VBQW9FO2dCQUNwRSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksOEJBQXNCLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzdEO1lBRUQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FDNUIsdUZBQXVGO2dCQUN2RiwwRUFBMEUsQ0FBQyxDQUFDLENBQUM7WUFFakYsK0VBQStFO1lBQy9FLDRFQUE0RTtZQUM1RSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQ2hDLENBQUM7UUFFRDs7O1dBR0c7UUFDSyxNQUFNLENBQUMsNEJBQTRCLENBQUMsSUFBVTtZQUNwRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDakMsT0FBTyxLQUFLLENBQUM7YUFDZDtZQUVELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUU3RSxvRUFBb0U7WUFDcEUsMkJBQTJCO1lBQzNCLElBQUksV0FBVyxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFO2dCQUNyRCxPQUFPLFdBQVcsQ0FBQyxZQUFZLENBQUMsdUJBQXVCLENBQUMsQ0FBQztnQkFDekQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RFLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7O0lBNUNELDZFQUE2RTtJQUN0RSxtQ0FBZ0IsR0FBRyxLQUFLLENBQUM7SUFqbEJsQyxnREE2bkJDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxnQkFBZ0IsQ0FBQyxJQUFhO1FBQ3JDLElBQUksRUFBRSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3RDLE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzFDO2FBQU0sSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xDLE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzFDO2FBQU0sSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25DLE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxrQkFBa0IsQ0FBQyxPQUFlLEVBQUUsY0FBc0I7UUFDakUsSUFBSSxNQUFNLEdBQUcsZUFBUSxDQUFDLGNBQU8sQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDM0IsTUFBTSxHQUFHLEtBQUssTUFBTSxFQUFFLENBQUM7U0FDeEI7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxtQkFBbUIsQ0FBQyxJQUFxQjtRQUNoRCxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztTQUNsQjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELDBFQUEwRTtJQUMxRSxTQUFTLDRCQUE0QixDQUFDLElBQW1CO1FBQ3ZELE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxzQkFBc0IsQ0FDM0IsTUFBZSxFQUFFLFNBQXVDO1FBQzFELE1BQU0sTUFBTSxHQUFRLEVBQUUsQ0FBQztRQUN2QixNQUFNLFNBQVMsR0FBRyxDQUFDLElBQWEsRUFBRSxFQUFFO1lBQ2xDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25CO1lBQ0QsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDO1FBQ0YsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkMsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBqb2luIGFzIGRldmtpdEpvaW4sXG4gIG5vcm1hbGl6ZSBhcyBkZXZraXROb3JtYWxpemUsXG4gIFBhdGggYXMgRGV2a2l0UGF0aFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQge1NjaGVtYXRpY0NvbnRleHQsIFNjaGVtYXRpY3NFeGNlcHRpb24sIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Tm9kZVBhY2thZ2VJbnN0YWxsVGFza30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHtcbiAgZ2V0UHJvamVjdEluZGV4RmlsZXMsXG4gIGdldFByb2plY3RNYWluRmlsZSxcbiAgTWlncmF0aW9uRmFpbHVyZSxcbiAgTWlncmF0aW9uUnVsZSxcbiAgUmVzb2x2ZWRSZXNvdXJjZSxcbiAgVGFyZ2V0VmVyc2lvblxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBhZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEsXG4gIGdldERlY29yYXRvck1ldGFkYXRhLFxuICBnZXRNZXRhZGF0YUZpZWxkXG59IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9hc3QtdXRpbHMnO1xuaW1wb3J0IHtJbnNlcnRDaGFuZ2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jaGFuZ2UnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jb25maWcnO1xuaW1wb3J0IHtnZXRBcHBNb2R1bGVQYXRofSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvbmctYXN0LXV0aWxzJztcbmltcG9ydCB7V29ya3NwYWNlUHJvamVjdH0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZS1tb2RlbHMnO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCB7cmVhZEZpbGVTeW5jfSBmcm9tICdmcyc7XG5pbXBvcnQge2Rpcm5hbWUsIGpvaW4sIHJlbGF0aXZlfSBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2dldFByb2plY3RGcm9tUHJvZ3JhbX0gZnJvbSAnLi9jbGktd29ya3NwYWNlJztcbmltcG9ydCB7ZmluZEhhbW1lclNjcmlwdEltcG9ydEVsZW1lbnRzfSBmcm9tICcuL2ZpbmQtaGFtbWVyLXNjcmlwdC10YWdzJztcbmltcG9ydCB7aXNIYW1tZXJKc1VzZWRJblRlbXBsYXRlfSBmcm9tICcuL2hhbW1lci10ZW1wbGF0ZS1jaGVjayc7XG5pbXBvcnQge2dldEltcG9ydE9mSWRlbnRpZmllciwgSW1wb3J0fSBmcm9tICcuL2lkZW50aWZpZXItaW1wb3J0cyc7XG5pbXBvcnQge0ltcG9ydE1hbmFnZXJ9IGZyb20gJy4vaW1wb3J0LW1hbmFnZXInO1xuaW1wb3J0IHtyZW1vdmVFbGVtZW50RnJvbUFycmF5RXhwcmVzc2lvbn0gZnJvbSAnLi9yZW1vdmUtYXJyYXktZWxlbWVudCc7XG5pbXBvcnQge3JlbW92ZUVsZW1lbnRGcm9tSHRtbH0gZnJvbSAnLi9yZW1vdmUtZWxlbWVudC1mcm9tLWh0bWwnO1xuXG5jb25zdCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FID0gJ0dlc3R1cmVDb25maWcnO1xuY29uc3QgR0VTVFVSRV9DT05GSUdfRklMRV9OQU1FID0gJ2dlc3R1cmUtY29uZmlnJztcbmNvbnN0IEdFU1RVUkVfQ09ORklHX1RFTVBMQVRFX1BBVEggPSAnLi9nZXN0dXJlLWNvbmZpZy50ZW1wbGF0ZSc7XG5jb25zdCBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUgPSAnSEFNTUVSX0dFU1RVUkVfQ09ORklHJztcbmNvbnN0IEhBTU1FUl9DT05GSUdfVE9LRU5fTU9EVUxFID0gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuY29uc3QgSEFNTUVSX01PRFVMRV9TUEVDSUZJRVIgPSAnaGFtbWVyanMnO1xuXG5jb25zdCBDQU5OT1RfUkVNT1ZFX1JFRkVSRU5DRV9FUlJPUiA9XG4gICAgYENhbm5vdCByZW1vdmUgcmVmZXJlbmNlIHRvIFwiR2VzdHVyZUNvbmZpZ1wiLiBQbGVhc2UgcmVtb3ZlIG1hbnVhbGx5LmA7XG5cbmludGVyZmFjZSBJZGVudGlmaWVyUmVmZXJlbmNlIHtcbiAgbm9kZTogdHMuSWRlbnRpZmllcjtcbiAgaW1wb3J0RGF0YTogSW1wb3J0O1xuICBpc0ltcG9ydDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEhhbW1lckdlc3R1cmVzUnVsZSBleHRlbmRzIE1pZ3JhdGlvblJ1bGU8bnVsbD4ge1xuICAvLyBPbmx5IGVuYWJsZSB0aGlzIHJ1bGUgaWYgdGhlIG1pZ3JhdGlvbiB0YXJnZXRzIHY5IG9yIHYxMCBhbmQgaXMgcnVubmluZyBmb3IgYSBub24tdGVzdFxuICAvLyB0YXJnZXQuIFdlIGNhbm5vdCBtaWdyYXRlIHRlc3QgdGFyZ2V0cyBzaW5jZSB0aGV5IGhhdmUgYSBsaW1pdGVkIHNjb3BlXG4gIC8vIChpbiByZWdhcmRzIHRvIHNvdXJjZSBmaWxlcykgYW5kIHRoZXJlZm9yZSB0aGUgSGFtbWVySlMgdXNhZ2UgZGV0ZWN0aW9uIGNhbiBiZSBpbmNvcnJlY3QuXG4gIHJ1bGVFbmFibGVkID1cbiAgICAgICh0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjkgfHwgdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlYxMCkgJiZcbiAgICAgICF0aGlzLmlzVGVzdFRhcmdldDtcblxuICBwcml2YXRlIF9wcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcigpO1xuICBwcml2YXRlIF9pbXBvcnRNYW5hZ2VyID0gbmV3IEltcG9ydE1hbmFnZXIodGhpcy5nZXRVcGRhdGVSZWNvcmRlciwgdGhpcy5fcHJpbnRlcik7XG4gIHByaXZhdGUgX25vZGVGYWlsdXJlczoge25vZGU6IHRzLk5vZGUsIG1lc3NhZ2U6IHN0cmluZ31bXSA9IFtdO1xuXG4gIC8qKiBXaGV0aGVyIEhhbW1lckpTIGlzIGV4cGxpY2l0bHkgdXNlZCBpbiBhbnkgY29tcG9uZW50IHRlbXBsYXRlLiAqL1xuICBwcml2YXRlIF91c2VkSW5UZW1wbGF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIEhhbW1lckpTIGlzIGFjY2Vzc2VkIGF0IHJ1bnRpbWUuICovXG4gIHByaXZhdGUgX3VzZWRJblJ1bnRpbWUgPSBmYWxzZTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpbXBvcnRzIHRoYXQgbWFrZSBcImhhbW1lcmpzXCIgYXZhaWxhYmxlIGdsb2JhbGx5LiBXZSBrZWVwIHRyYWNrIG9mIHRoZXNlXG4gICAqIHNpbmNlIHdlIG1pZ2h0IG5lZWQgdG8gcmVtb3ZlIHRoZW0gaWYgSGFtbWVyIGlzIG5vdCB1c2VkLlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5zdGFsbEltcG9ydHM6IHRzLkltcG9ydERlY2xhcmF0aW9uW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCByZXNvbHZlIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyBmcm9tIEFuZ3VsYXIgTWF0ZXJpYWwuXG4gICAqL1xuICBwcml2YXRlIF9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlczogSWRlbnRpZmllclJlZmVyZW5jZVtdID0gW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggcmVzb2x2ZSB0byBcIkhBTU1FUl9HRVNUVVJFX0NPTkZJR1wiIHRva2VuIGZyb21cbiAgICogXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuXG4gICAqL1xuICBwcml2YXRlIF9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXM6IElkZW50aWZpZXJSZWZlcmVuY2VbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHRoYXQgaGF2ZSBiZWVuIGRlbGV0ZWQgZnJvbSBzb3VyY2UgZmlsZXMuIFRoaXMgY2FuIGJlXG4gICAqIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGNlcnRhaW4gaW1wb3J0cyBhcmUgc3RpbGwgdXNlZCBvciBub3QuXG4gICAqL1xuICBwcml2YXRlIF9kZWxldGVkSWRlbnRpZmllcnM6IHRzLklkZW50aWZpZXJbXSA9IFtdO1xuXG4gIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFJlc29sdmVkUmVzb3VyY2UpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3VzZWRJblRlbXBsYXRlICYmIGlzSGFtbWVySnNVc2VkSW5UZW1wbGF0ZSh0ZW1wbGF0ZS5jb250ZW50KSkge1xuICAgICAgdGhpcy5fdXNlZEluVGVtcGxhdGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tIYW1tZXJJbXBvcnRzKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9yUnVudGltZUhhbW1lclVzYWdlKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9yTWF0ZXJpYWxHZXN0dXJlQ29uZmlnKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9ySGFtbWVyR2VzdHVyZUNvbmZpZ1Rva2VuKG5vZGUpO1xuICB9XG5cbiAgcG9zdEFuYWx5c2lzKCk6IHZvaWQge1xuICAgIC8vIFdhbGsgdGhyb3VnaCBhbGwgaGFtbWVyIGNvbmZpZyB0b2tlbiByZWZlcmVuY2VzIGFuZCBjaGVjayBpZiB0aGVyZVxuICAgIC8vIGlzIGEgcG90ZW50aWFsIGN1c3RvbSBnZXN0dXJlIGNvbmZpZyBzZXR1cC5cbiAgICBjb25zdCBoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAgPVxuICAgICAgICB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHRoaXMuX2NoZWNrRm9yQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKHIpKTtcblxuICAgIGlmICh0aGlzLl91c2VkSW5SdW50aW1lIHx8IHRoaXMuX3VzZWRJblRlbXBsYXRlKSB7XG4gICAgICAvLyBXZSBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgSGFtbWVyIGlzIHVzZWQgZ2xvYmFsbHkuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugd2VcbiAgICAgIC8vIHdhbnQgdG8gb25seSByZW1vdmUgSGFtbWVyIGZyb20gdGhlIFwicGFja2FnZS5qc29uXCIgaWYgaXQgaXMgbm90IHVzZWQgaW4gYW55IHByb2plY3RcbiAgICAgIC8vIHRhcmdldC4gSnVzdCBiZWNhdXNlIGl0IGlzbid0IHVzZWQgaW4gb25lIHRhcmdldCBkb2Vzbid0IG1lYW4gdGhhdCB3ZSBjYW4gc2FmZWx5XG4gICAgICAvLyByZW1vdmUgdGhlIGRlcGVuZGVuY3kuXG4gICAgICBIYW1tZXJHZXN0dXJlc1J1bGUuZ2xvYmFsVXNlc0hhbW1lciA9IHRydWU7XG5cbiAgICAgIC8vIElmIGhhbW1lciBpcyBvbmx5IHVzZWQgYXQgcnVudGltZSwgd2UgZG9uJ3QgbmVlZCB0aGUgZ2VzdHVyZSBjb25maWdcbiAgICAgIC8vIGFuZCBjYW4gcmVtb3ZlIGl0IChhbG9uZyB3aXRoIHRoZSBoYW1tZXIgY29uZmlnIHRva2VuIGlmIHBvc3NpYmxlKVxuICAgICAgaWYgKCF0aGlzLl91c2VkSW5UZW1wbGF0ZSkge1xuICAgICAgICB0aGlzLl9yZW1vdmVHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NldHVwSGFtbWVyR2VzdHVyZUNvbmZpZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBIYW1tZXJKUyBjb3VsZCBub3QgYmUgZGV0ZWN0ZWQsIGJ1dCB3ZSBkZXRlY3RlZCBhIGN1c3RvbSBnZXN0dXJlXG4gICAgICAvLyBjb25maWcgc2V0dXAsIHdlIGp1c3QgcmVtb3ZlIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsXG4gICAgICAvLyBnZXN0dXJlIGNvbmZpZy4gT3RoZXJ3aXNlIHdlIGNvbXBsZXRlbHkgcmVtb3ZlIEhhbW1lckpTIGZyb20gdGhlIGFwcC5cbiAgICAgIGlmIChoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXApIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gICAgICAgIC8vIFByaW50IGEgbWVzc2FnZSBpZiB3ZSBmb3VuZCBhIGN1c3RvbSBnZXN0dXJlIGNvbmZpZyBzZXR1cCBpbiBjb21iaW5hdGlvbiB3aXRoXG4gICAgICAgIC8vIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuIFRoaXMgaXMgYW1iaWd1b3VzIGFuZCB0aGVcbiAgICAgICAgLy8gbWlncmF0aW9uIGp1c3QgcmVtb3ZlcyB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgc2V0dXAsIGJ1dCB3ZSBzdGlsbCB3YW50XG4gICAgICAgIC8vIHRvIGNyZWF0ZSBhbiBpbmZvcm1hdGlvbiBtZXNzYWdlLlxuICAgICAgICBpZiAodGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5wcmludEluZm8oY2hhbGsueWVsbG93KFxuICAgICAgICAgICAgICAnVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBjb21wb25lbnRzIGRldGVjdGVkIHRoYXQgdGhlIEFuZ3VsYXIgJyArXG4gICAgICAgICAgICAgICdNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyBpcyB1c2VkIHdoaWxlIGEgY3VzdG9tIGdlc3R1cmUgY29uZmlnIGlzIHNldCB1cC4gVGhlICcgK1xuICAgICAgICAgICAgICAnbWlncmF0aW9uIHJlbW92ZWQgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuJykpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZW1vdmVIYW1tZXJTZXR1cCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlY29yZCB0aGUgY2hhbmdlcyBjb2xsZWN0ZWQgaW4gdGhlIGltcG9ydCBtYW5hZ2VyLiBDaGFuZ2VzIG5lZWQgdG8gYmUgYXBwbGllZFxuICAgIC8vIG9uY2UgdGhlIGltcG9ydCBtYW5hZ2VyIHJlZ2lzdGVyZWQgYWxsIGltcG9ydCBtb2RpZmljYXRpb25zLiBUaGlzIGF2b2lkcyBjb2xsaXNpb25zLlxuICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIucmVjb3JkQ2hhbmdlcygpO1xuXG4gICAgLy8gQ3JlYXRlIG1pZ3JhdGlvbiBmYWlsdXJlcyB0aGF0IHdpbGwgYmUgcHJpbnRlZCBieSB0aGUgdXBkYXRlLXRvb2wgb24gbWlncmF0aW9uXG4gICAgLy8gY29tcGxldGlvbi4gV2UgbmVlZCBzcGVjaWFsIGxvZ2ljIGZvciB1cGRhdGluZyBmYWlsdXJlIHBvc2l0aW9ucyB0byByZWZsZWN0XG4gICAgLy8gdGhlIG5ldyBzb3VyY2UgZmlsZSBhZnRlciBtb2RpZmljYXRpb25zIGZyb20gdGhlIGltcG9ydCBtYW5hZ2VyLlxuICAgIHRoaXMuZmFpbHVyZXMucHVzaCguLi50aGlzLl9jcmVhdGVNaWdyYXRpb25GYWlsdXJlcygpKTtcblxuICAgIC8vIFRoZSB0ZW1wbGF0ZSBjaGVjayBmb3IgSGFtbWVySlMgZXZlbnRzIGlzIG5vdCBjb21wbGV0ZWx5IHJlbGlhYmxlIGFzIHRoZSBldmVudFxuICAgIC8vIG91dHB1dCBjb3VsZCBhbHNvIGJlIGZyb20gYSBjb21wb25lbnQgaGF2aW5nIGFuIG91dHB1dCBuYW1lZCBzaW1pbGFybHkgdG8gYSBrbm93blxuICAgIC8vIGhhbW1lcmpzIGV2ZW50IChlLmcuIFwiQE91dHB1dCgpIHNsaWRlXCIpLiBUaGUgdXNhZ2UgaXMgdGhlcmVmb3JlIHNvbWV3aGF0IGFtYmlndW91c1xuICAgIC8vIGFuZCB3ZSB3YW50IHRvIHByaW50IGEgbWVzc2FnZSB0aGF0IGRldmVsb3BlcnMgbWlnaHQgYmUgYWJsZSB0byByZW1vdmUgSGFtbWVyIG1hbnVhbGx5LlxuICAgIGlmICghdGhpcy5fdXNlZEluUnVudGltZSAmJiB0aGlzLl91c2VkSW5UZW1wbGF0ZSkge1xuICAgICAgdGhpcy5wcmludEluZm8oY2hhbGsueWVsbG93KFxuICAgICAgICAgICdUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIGNvbXBvbmVudHMgbWlncmF0ZWQgdGhlICcgK1xuICAgICAgICAgICdwcm9qZWN0IHRvIGtlZXAgSGFtbWVySlMgaW5zdGFsbGVkLCBidXQgZGV0ZWN0ZWQgYW1iaWd1b3VzIHVzYWdlIG9mIEhhbW1lckpTLiBQbGVhc2UgJyArXG4gICAgICAgICAgJ21hbnVhbGx5IGNoZWNrIGlmIHlvdSBjYW4gcmVtb3ZlIEhhbW1lckpTIGZyb20geW91ciBhcHBsaWNhdGlvbi4nKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgY3VycmVudCBwcm9qZWN0LiBUbyBhY2hpZXZlIHRoaXMsIHRoZVxuICAgKiBmb2xsb3dpbmcgc3RlcHMgYXJlIHBlcmZvcm1lZDpcbiAgICogICAxKSBDcmVhdGUgY29weSBvZiBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgKiAgIDIpIFJld3JpdGUgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgdG8gdGhlXG4gICAqICAgICAgbmV3bHkgY29waWVkIGdlc3R1cmUgY29uZmlnLlxuICAgKiAgIDMpIFNldHVwIHRoZSBIQU1NRVJfR0VTVFVSRV9DT05GSUcgcHJvdmlkZXIgaW4gdGhlIHJvb3QgYXBwIG1vZHVsZVxuICAgKiAgICAgIChpZiBub3QgZG9uZSBhbHJlYWR5KS5cbiAgICovXG4gIHByaXZhdGUgX3NldHVwSGFtbWVyR2VzdHVyZUNvbmZpZygpIHtcbiAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5fZ2V0UHJvamVjdE9yVGhyb3coKTtcbiAgICBjb25zdCBzb3VyY2VSb290ID0gZGV2a2l0Tm9ybWFsaXplKHByb2plY3Quc291cmNlUm9vdCB8fCBwcm9qZWN0LnJvb3QpO1xuICAgIGNvbnN0IGdlc3R1cmVDb25maWdQYXRoID1cbiAgICAgICAgZGV2a2l0Sm9pbihzb3VyY2VSb290LCB0aGlzLl9nZXRBdmFpbGFibGVHZXN0dXJlQ29uZmlnRmlsZU5hbWUoc291cmNlUm9vdCkpO1xuXG4gICAgLy8gQ29weSBnZXN0dXJlIGNvbmZpZyB0ZW1wbGF0ZSBpbnRvIHRoZSBDTEkgcHJvamVjdC5cbiAgICB0aGlzLnRyZWUuY3JlYXRlKFxuICAgICAgICBnZXN0dXJlQ29uZmlnUGF0aCwgcmVhZEZpbGVTeW5jKHJlcXVpcmUucmVzb2x2ZShHRVNUVVJFX0NPTkZJR19URU1QTEFURV9QQVRIKSwgJ3V0ZjgnKSk7XG5cbiAgICAvLyBSZXBsYWNlIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyBvZiBNYXRlcmlhbC5cbiAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5mb3JFYWNoKFxuICAgICAgICBpID0+IHRoaXMuX3JlcGxhY2VHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKGksIGdlc3R1cmVDb25maWdQYXRoKSk7XG5cbiAgICBjb25zdCBhcHBNb2R1bGVQYXRoID0gZ2V0QXBwTW9kdWxlUGF0aCh0aGlzLnRyZWUsIGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KSk7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IHRoaXMucHJvZ3JhbS5nZXRTb3VyY2VGaWxlKGpvaW4odGhpcy5iYXNlUGF0aCwgYXBwTW9kdWxlUGF0aCkpO1xuXG4gICAgaWYgKCFzb3VyY2VGaWxlKSB7XG4gICAgICB0aGlzLmZhaWx1cmVzLnB1c2goe1xuICAgICAgICBmaWxlUGF0aDogYXBwTW9kdWxlUGF0aCxcbiAgICAgICAgbWVzc2FnZTogYENvdWxkIG5vdCBzZXR1cCBIYW1tZXJKUyBnZXN0dXJlIGluIG1vZHVsZS4gUGxlYXNlIG1hbnVhbGx5IGVuc3VyZSB0aGF0IGAgK1xuICAgICAgICAgICAgYHRoZSBIYW1tZXIgZ2VzdHVyZSBjb25maWcgaXMgc2V0IHVwLmAsXG4gICAgICAgIHBvc2l0aW9uOiB7Y2hhcmFjdGVyOiAwLCBsaW5lOiAwfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gU2V0dXAgdGhlIGdlc3R1cmUgY29uZmlnIHByb3ZpZGVyIGluIHRoZSBwcm9qZWN0IGFwcCBtb2R1bGUgaWYgbm90IGRvbmUuXG4gICAgdGhpcy5fc2V0dXBHZXN0dXJlQ29uZmlnUHJvdmlkZXJJZk5lZWRlZChzb3VyY2VGaWxlLCBhcHBNb2R1bGVQYXRoLCBnZXN0dXJlQ29uZmlnUGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBIYW1tZXIgZnJvbSB0aGUgY3VycmVudCBwcm9qZWN0LiBUaGUgZm9sbG93aW5nIHN0ZXBzIGFyZSBwZXJmb3JtZWQ6XG4gICAqICAgMSkgRGVsZXRlIGFsbCBUeXBlU2NyaXB0IGltcG9ydHMgdG8gXCJoYW1tZXJqc1wiLlxuICAgKiAgIDIpIFJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgKiAgIDMpIFJlbW92ZSBcImhhbW1lcmpzXCIgZnJvbSBhbGwgaW5kZXggSFRNTCBmaWxlcyBvZiB0aGUgY3VycmVudCBwcm9qZWN0LlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyU2V0dXAoKSB7XG4gICAgY29uc3QgcHJvamVjdCA9IHRoaXMuX2dldFByb2plY3RPclRocm93KCk7XG5cbiAgICB0aGlzLl9pbnN0YWxsSW1wb3J0cy5mb3JFYWNoKGkgPT4gdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVJbXBvcnRCeURlY2xhcmF0aW9uKGkpKTtcblxuICAgIHRoaXMuX3JlbW92ZUdlc3R1cmVDb25maWdTZXR1cCgpO1xuICAgIHRoaXMuX3JlbW92ZUhhbW1lckZyb21JbmRleEZpbGUocHJvamVjdCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgZ2VzdHVyZSBjb25maWcgc2V0dXAgYnkgZGVsZXRpbmcgYWxsIGZvdW5kIHJlZmVyZW5jZXNcbiAgICogdG8gYSBnZXN0dXJlIGNvbmZpZy4gQWRkaXRpb25hbGx5LCB1bnVzZWQgaW1wb3J0cyB0byB0aGUgaGFtbWVyIGdlc3R1cmVcbiAgICogY29uZmlnIHRva2VuIGZyb20gcGxhdGZvcm0tYnJvd3NlciBhcmUgcmVtb3ZlZCBhcyB3ZWxsLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlR2VzdHVyZUNvbmZpZ1NldHVwKCkge1xuICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLmZvckVhY2gociA9PiB0aGlzLl9yZW1vdmVHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKHIpKTtcblxuICAgIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5mb3JFYWNoKHIgPT4ge1xuICAgICAgaWYgKHIuaXNJbXBvcnQpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlSGFtbWVyQ29uZmlnVG9rZW5JbXBvcnRJZlVudXNlZChyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZ1xuICAgKiB0b2tlbiBmcm9tIHBsYXRmb3JtLWJyb3dzZXIuIElmIHNvLCBrZWVwcyB0cmFjayBvZiB0aGUgcmVmZXJlbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JIYW1tZXJHZXN0dXJlQ29uZmlnVG9rZW4obm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkpIHtcbiAgICAgIGNvbnN0IGltcG9ydERhdGEgPSBnZXRJbXBvcnRPZklkZW50aWZpZXIobm9kZSwgdGhpcy50eXBlQ2hlY2tlcik7XG4gICAgICBpZiAoaW1wb3J0RGF0YSAmJiBpbXBvcnREYXRhLnN5bWJvbE5hbWUgPT09IEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSAmJlxuICAgICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZSA9PT0gSEFNTUVSX0NPTkZJR19UT0tFTl9NT0RVTEUpIHtcbiAgICAgICAgdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnB1c2goXG4gICAgICAgICAgICB7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnQ6IHRzLmlzSW1wb3J0U3BlY2lmaWVyKG5vZGUucGFyZW50KX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYW4gaW1wb3J0IHRvIHRoZSBIYW1tZXJKUyBwYWNrYWdlLiBJbXBvcnRzIHRvXG4gICAqIEhhbW1lckpTIHdoaWNoIGxvYWQgc3BlY2lmaWMgc3ltYm9scyBmcm9tIHRoZSBwYWNrYWdlIGFyZSBjb25zaWRlcmVkIGFzXG4gICAqIHJ1bnRpbWUgdXNhZ2Ugb2YgSGFtbWVyLiBlLmcuIGBpbXBvcnQge1N5bWJvbH0gZnJvbSBcImhhbW1lcmpzXCI7YC5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrSGFtbWVySW1wb3J0cyhub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgJiYgdHMuaXNTdHJpbmdMaXRlcmFsKG5vZGUubW9kdWxlU3BlY2lmaWVyKSAmJlxuICAgICAgICBub2RlLm1vZHVsZVNwZWNpZmllci50ZXh0ID09PSBIQU1NRVJfTU9EVUxFX1NQRUNJRklFUikge1xuICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gaW1wb3J0IHRvIEhhbW1lckpTIHRoYXQgaW1wb3J0cyBzeW1ib2xzLCBvciBpcyBuYW1lc3BhY2VkXG4gICAgICAvLyAoZS5nLiBcImltcG9ydCB7QSwgQn0gZnJvbSAuLi5cIiBvciBcImltcG9ydCAqIGFzIGhhbW1lciBmcm9tIC4uLlwiKSwgdGhlbiB3ZVxuICAgICAgLy8gYXNzdW1lIHRoYXQgc29tZSBleHBvcnRzIGFyZSB1c2VkIGF0IHJ1bnRpbWUuXG4gICAgICBpZiAobm9kZS5pbXBvcnRDbGF1c2UgJiZcbiAgICAgICAgICAhKG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MgJiYgdHMuaXNOYW1lZEltcG9ydHMobm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykgJiZcbiAgICAgICAgICAgIG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHMubGVuZ3RoID09PSAwKSkge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2luc3RhbGxJbXBvcnRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBhY2Nlc3NlcyB0aGUgZ2xvYmFsIFwiSGFtbWVyXCIgc3ltYm9sIGF0IHJ1bnRpbWUuIElmIHNvLFxuICAgKiB0aGUgbWlncmF0aW9uIHJ1bGUgc3RhdGUgd2lsbCBiZSB1cGRhdGVkIHRvIHJlZmxlY3QgdGhhdCBIYW1tZXIgaXMgdXNlZCBhdCBydW50aW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JSdW50aW1lSGFtbWVyVXNhZ2Uobm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0aGlzLl91c2VkSW5SdW50aW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRGV0ZWN0cyB1c2FnZXMgb2YgXCJ3aW5kb3cuSGFtbWVyXCIuXG4gICAgaWYgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUpICYmIG5vZGUubmFtZS50ZXh0ID09PSAnSGFtbWVyJykge1xuICAgICAgY29uc3Qgb3JpZ2luRXhwciA9IHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgICAgIGlmICh0cy5pc0lkZW50aWZpZXIob3JpZ2luRXhwcikgJiYgb3JpZ2luRXhwci50ZXh0ID09PSAnd2luZG93Jykge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZXRlY3RzIHVzYWdlcyBvZiBcIndpbmRvd1snSGFtbWVyJ11cIi5cbiAgICBpZiAodHMuaXNFbGVtZW50QWNjZXNzRXhwcmVzc2lvbihub2RlKSAmJiB0cy5pc1N0cmluZ0xpdGVyYWwobm9kZS5hcmd1bWVudEV4cHJlc3Npb24pICYmXG4gICAgICAgIG5vZGUuYXJndW1lbnRFeHByZXNzaW9uLnRleHQgPT09ICdIYW1tZXInKSB7XG4gICAgICBjb25zdCBvcmlnaW5FeHByID0gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihvcmlnaW5FeHByKSAmJiBvcmlnaW5FeHByLnRleHQgPT09ICd3aW5kb3cnKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZXMgdXNhZ2VzIG9mIHBsYWluIGlkZW50aWZpZXIgd2l0aCB0aGUgbmFtZSBcIkhhbW1lclwiLiBUaGVzZSB1c2FnZVxuICAgIC8vIGFyZSB2YWxpZCBpZiB0aGV5IHJlc29sdmUgdG8gXCJAdHlwZXMvaGFtbWVyanNcIi4gZS5nLiBcIm5ldyBIYW1tZXIobXlFbGVtZW50KVwiLlxuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkgJiYgbm9kZS50ZXh0ID09PSAnSGFtbWVyJyAmJlxuICAgICAgICAhdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZS5wYXJlbnQpICYmICF0cy5pc0VsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKG5vZGUucGFyZW50KSkge1xuICAgICAgY29uc3Qgc3ltYm9sID0gdGhpcy5fZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZSk7XG4gICAgICBpZiAoc3ltYm9sICYmIHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uICYmXG4gICAgICAgICAgc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lLmluY2x1ZGVzKCdAdHlwZXMvaGFtbWVyanMnKSkge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIHJlZmVyZW5jZXMgdGhlIGdlc3R1cmUgY29uZmlnIGZyb20gQW5ndWxhciBNYXRlcmlhbC5cbiAgICogSWYgc28sIHdlIGtlZXAgdHJhY2sgb2YgdGhlIGZvdW5kIHN5bWJvbCByZWZlcmVuY2UuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0Zvck1hdGVyaWFsR2VzdHVyZUNvbmZpZyhub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgICAgY29uc3QgaW1wb3J0RGF0YSA9IGdldEltcG9ydE9mSWRlbnRpZmllcihub2RlLCB0aGlzLnR5cGVDaGVja2VyKTtcbiAgICAgIGlmIChpbXBvcnREYXRhICYmIGltcG9ydERhdGEuc3ltYm9sTmFtZSA9PT0gR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSAmJlxuICAgICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZS5zdGFydHNXaXRoKCdAYW5ndWxhci9tYXRlcmlhbC8nKSkge1xuICAgICAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5wdXNoKFxuICAgICAgICAgICAge25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0OiB0cy5pc0ltcG9ydFNwZWNpZmllcihub2RlLnBhcmVudCl9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBIYW1tZXIgZ2VzdHVyZSBjb25maWcgdG9rZW4gcmVmZXJlbmNlIGlzIHBhcnQgb2YgYW5cbiAgICogQW5ndWxhciBwcm92aWRlciBkZWZpbml0aW9uIHRoYXQgc2V0cyB1cCBhIGN1c3RvbSBnZXN0dXJlIGNvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9yQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKHRva2VuUmVmOiBJZGVudGlmaWVyUmVmZXJlbmNlKTogYm9vbGVhbiB7XG4gICAgLy8gV2FsayB1cCB0aGUgdHJlZSB0byBsb29rIGZvciBhIHBhcmVudCBwcm9wZXJ0eSBhc3NpZ25tZW50IG9mIHRoZVxuICAgIC8vIHJlZmVyZW5jZSB0byB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnIHRva2VuLlxuICAgIGxldCBwcm9wZXJ0eUFzc2lnbm1lbnQ6IHRzLk5vZGUgPSB0b2tlblJlZi5ub2RlO1xuICAgIHdoaWxlIChwcm9wZXJ0eUFzc2lnbm1lbnQgJiYgIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5QXNzaWdubWVudCkpIHtcbiAgICAgIHByb3BlcnR5QXNzaWdubWVudCA9IHByb3BlcnR5QXNzaWdubWVudC5wYXJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKCFwcm9wZXJ0eUFzc2lnbm1lbnQgfHwgIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5QXNzaWdubWVudCkgfHxcbiAgICAgICAgZ2V0UHJvcGVydHlOYW1lVGV4dChwcm9wZXJ0eUFzc2lnbm1lbnQubmFtZSkgIT09ICdwcm92aWRlJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG9iamVjdExpdGVyYWxFeHByID0gcHJvcGVydHlBc3NpZ25tZW50LnBhcmVudDtcbiAgICBjb25zdCBtYXRjaGluZ0lkZW50aWZpZXJzID0gZmluZE1hdGNoaW5nQ2hpbGROb2RlcyhvYmplY3RMaXRlcmFsRXhwciwgdHMuaXNJZGVudGlmaWVyKTtcblxuICAgIC8vIFdlIG5haXZlbHkgYXNzdW1lIHRoYXQgaWYgdGhlcmUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIFwiR2VzdHVyZUNvbmZpZ1wiIGV4cG9ydFxuICAgIC8vIGZyb20gQW5ndWxhciBNYXRlcmlhbCBpbiB0aGUgcHJvdmlkZXIgbGl0ZXJhbCwgdGhhdCB0aGUgcHJvdmlkZXIgc2V0cyB1cCB0aGVcbiAgICAvLyBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgIHJldHVybiAhdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuc29tZShyID0+IG1hdGNoaW5nSWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBhbiBhdmFpbGFibGUgZmlsZSBuYW1lIGZvciB0aGUgZ2VzdHVyZSBjb25maWcgd2hpY2ggc2hvdWxkXG4gICAqIGJlIHN0b3JlZCBpbiB0aGUgc3BlY2lmaWVkIGZpbGUgcGF0aC5cbiAgICovXG4gIHByaXZhdGUgX2dldEF2YWlsYWJsZUdlc3R1cmVDb25maWdGaWxlTmFtZShzb3VyY2VSb290OiBEZXZraXRQYXRoKSB7XG4gICAgaWYgKCF0aGlzLnRyZWUuZXhpc3RzKGRldmtpdEpvaW4oc291cmNlUm9vdCwgYCR7R0VTVFVSRV9DT05GSUdfRklMRV9OQU1FfS50c2ApKSkge1xuICAgICAgcmV0dXJuIGAke0dFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRX0udHNgO1xuICAgIH1cblxuICAgIGxldCBwb3NzaWJsZU5hbWUgPSBgJHtHRVNUVVJFX0NPTkZJR19GSUxFX05BTUV9LWA7XG4gICAgbGV0IGluZGV4ID0gMTtcbiAgICB3aGlsZSAodGhpcy50cmVlLmV4aXN0cyhkZXZraXRKb2luKHNvdXJjZVJvb3QsIGAke3Bvc3NpYmxlTmFtZX0tJHtpbmRleH0udHNgKSkpIHtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICAgIHJldHVybiBgJHtwb3NzaWJsZU5hbWUgKyBpbmRleH0udHNgO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIGEgZ2l2ZW4gZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlIGJ5IGVuc3VyaW5nIHRoYXQgaXQgaXMgaW1wb3J0ZWRcbiAgICogZnJvbSB0aGUgbmV3IHNwZWNpZmllZCBwYXRoLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVwbGFjZUdlc3R1cmVDb25maWdSZWZlcmVuY2UoXG4gICAgICB7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnR9OiBJZGVudGlmaWVyUmVmZXJlbmNlLCBuZXdQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIC8vIExpc3Qgb2YgYWxsIGlkZW50aWZpZXJzIHJlZmVycmluZyB0byB0aGUgZ2VzdHVyZSBjb25maWcgaW4gdGhlIGN1cnJlbnQgZmlsZS4gVGhpc1xuICAgIC8vIGFsbG93cyB1cyB0byBhZGQgYSBpbXBvcnQgZm9yIHRoZSBuZXcgZ2VzdHVyZSBjb25maWd1cmF0aW9uIHdpdGhvdXQgZ2VuZXJhdGluZyBhXG4gICAgLy8gbmV3IHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgaW1wb3J0LiBpLmUuIFwiR2VzdHVyZUNvbmZpZ18xXCIuIFRoZSBpbXBvcnQgbWFuYWdlclxuICAgIC8vIGNoZWNrcyBmb3IgcG9zc2libGUgbmFtZSBjb2xsaXNpb25zLCBidXQgaXMgYWJsZSB0byBpZ25vcmUgc3BlY2lmaWMgaWRlbnRpZmllcnMuXG4gICAgY29uc3QgZ2VzdHVyZUlkZW50aWZpZXJzSW5GaWxlID1cbiAgICAgICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuZmlsdGVyKGQgPT4gZC5ub2RlLmdldFNvdXJjZUZpbGUoKSA9PT0gc291cmNlRmlsZSlcbiAgICAgICAgICAgIC5tYXAoZCA9PiBkLm5vZGUpO1xuXG4gICAgY29uc3QgbmV3TW9kdWxlU3BlY2lmaWVyID0gZ2V0TW9kdWxlU3BlY2lmaWVyKG5ld1BhdGgsIHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuXG4gICAgLy8gSWYgdGhlIHBhcmVudCBvZiB0aGUgaWRlbnRpZmllciBpcyBhY2Nlc3NlZCB0aHJvdWdoIGEgbmFtZXNwYWNlLCB3ZSBjYW4ganVzdFxuICAgIC8vIGltcG9ydCB0aGUgbmV3IGdlc3R1cmUgY29uZmlnIHdpdGhvdXQgcmV3cml0aW5nIHRoZSBpbXBvcnQgZGVjbGFyYXRpb24gYmVjYXVzZVxuICAgIC8vIHRoZSBjb25maWcgaGFzIGJlZW4gaW1wb3J0ZWQgdGhyb3VnaCBhIG5hbWVzcGFjZWQgaW1wb3J0LlxuICAgIGlmIChpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGUpKSB7XG4gICAgICBjb25zdCBuZXdFeHByZXNzaW9uID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgICAgc291cmNlRmlsZSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSwgbmV3TW9kdWxlU3BlY2lmaWVyLCBmYWxzZSxcbiAgICAgICAgICBnZXN0dXJlSWRlbnRpZmllcnNJbkZpbGUpO1xuXG4gICAgICByZWNvcmRlci5yZW1vdmUobm9kZS5wYXJlbnQuZ2V0U3RhcnQoKSwgbm9kZS5wYXJlbnQuZ2V0V2lkdGgoKSk7XG4gICAgICByZWNvcmRlci5pbnNlcnRSaWdodChub2RlLnBhcmVudC5nZXRTdGFydCgpLCB0aGlzLl9wcmludE5vZGUobmV3RXhwcmVzc2lvbiwgc291cmNlRmlsZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIERlbGV0ZSB0aGUgb2xkIGltcG9ydCB0byB0aGUgXCJHZXN0dXJlQ29uZmlnXCIuXG4gICAgdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoXG4gICAgICAgIHNvdXJjZUZpbGUsIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsIGltcG9ydERhdGEubW9kdWxlTmFtZSk7XG5cbiAgICAvLyBJZiB0aGUgY3VycmVudCByZWZlcmVuY2UgaXMgbm90IGZyb20gaW5zaWRlIG9mIGEgaW1wb3J0LCB3ZSBuZWVkIHRvIGFkZCBhIG5ld1xuICAgIC8vIGltcG9ydCB0byB0aGUgY29waWVkIGdlc3R1cmUgY29uZmlnIGFuZCByZXBsYWNlIHRoZSBpZGVudGlmaWVyLiBGb3IgcmVmZXJlbmNlc1xuICAgIC8vIHdpdGhpbiBhbiBpbXBvcnQsIHdlIGRvIG5vdGhpbmcgYnV0IHJlbW92aW5nIHRoZSBhY3R1YWwgaW1wb3J0LiBUaGlzIGFsbG93cyB1c1xuICAgIC8vIHRvIHJlbW92ZSB1bnVzZWQgaW1wb3J0cyB0byB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAgaWYgKCFpc0ltcG9ydCkge1xuICAgICAgY29uc3QgbmV3RXhwcmVzc2lvbiA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICAgIHNvdXJjZUZpbGUsIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsIG5ld01vZHVsZVNwZWNpZmllciwgZmFsc2UsXG4gICAgICAgICAgZ2VzdHVyZUlkZW50aWZpZXJzSW5GaWxlKTtcblxuICAgICAgcmVjb3JkZXIucmVtb3ZlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpKTtcbiAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5vZGUuZ2V0U3RhcnQoKSwgdGhpcy5fcHJpbnROb2RlKG5ld0V4cHJlc3Npb24sIHNvdXJjZUZpbGUpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGdpdmVuIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZSBhbmQgaXRzIGNvcnJlc3BvbmRpbmcgaW1wb3J0IGZyb21cbiAgICogaXRzIGNvbnRhaW5pbmcgc291cmNlIGZpbGUuIEltcG9ydHMgd2lsbCBiZSBhbHdheXMgcmVtb3ZlZCwgYnV0IGluIHNvbWUgY2FzZXMsXG4gICAqIHdoZXJlIGl0J3Mgbm90IGd1YXJhbnRlZWQgdGhhdCBhIHJlbW92YWwgY2FuIGJlIHBlcmZvcm1lZCBzYWZlbHksIHdlIGp1c3RcbiAgICogY3JlYXRlIGEgbWlncmF0aW9uIGZhaWx1cmUgKGFuZCBhZGQgYSBUT0RPIGlmIHBvc3NpYmxlKS5cbiAgICovXG4gIHByaXZhdGUgX3JlbW92ZUdlc3R1cmVDb25maWdSZWZlcmVuY2Uoe25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0fTogSWRlbnRpZmllclJlZmVyZW5jZSkge1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZ2V0VXBkYXRlUmVjb3JkZXIoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgLy8gT25seSByZW1vdmUgdGhlIGltcG9ydCBmb3IgdGhlIGdlc3R1cmUgY29uZmlnIGlmIHRoZSBnZXN0dXJlIGNvbmZpZyBoYXNcbiAgICAvLyBiZWVuIGFjY2Vzc2VkIHRocm91Z2ggYSBub24tbmFtZXNwYWNlZCBpZGVudGlmaWVyIGFjY2Vzcy5cbiAgICBpZiAoIWlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZSkpIHtcbiAgICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICAgIHNvdXJjZUZpbGUsIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsIGltcG9ydERhdGEubW9kdWxlTmFtZSk7XG4gICAgfVxuXG4gICAgLy8gRm9yIHJlZmVyZW5jZXMgZnJvbSB3aXRoaW4gYW4gaW1wb3J0LCB3ZSBkbyBub3QgbmVlZCB0byBkbyBhbnl0aGluZyBvdGhlciB0aGFuXG4gICAgLy8gcmVtb3ZpbmcgdGhlIGltcG9ydC4gRm9yIG90aGVyIHJlZmVyZW5jZXMsIHdlIHJlbW92ZSB0aGUgaW1wb3J0IGFuZCB0aGUgcmVmZXJlbmNlXG4gICAgLy8gaWRlbnRpZmllciBpZiB1c2VkIGluc2lkZSBvZiBhIHByb3ZpZGVyIGRlZmluaXRpb24uXG4gICAgaWYgKGlzSW1wb3J0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdmlkZXJBc3NpZ25tZW50ID0gbm9kZS5wYXJlbnQ7XG5cbiAgICAvLyBPbmx5IHJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyB3aGljaCBhcmUgcGFydCBvZiBhIHN0YXRpY2FsbHlcbiAgICAvLyBhbmFseXphYmxlIHByb3ZpZGVyIGRlZmluaXRpb24uIFdlIG9ubHkgc3VwcG9ydCB0aGUgY29tbW9uIGNhc2Ugb2YgYSBnZXN0dXJlXG4gICAgLy8gY29uZmlnIHByb3ZpZGVyIGRlZmluaXRpb24gd2hlcmUgdGhlIGNvbmZpZyBpcyBzZXQgdXAgdGhyb3VnaCBcInVzZUNsYXNzXCIuXG4gICAgLy8gT3RoZXJ3aXNlLCBpdCdzIG5vdCBndWFyYW50ZWVkIHRoYXQgd2UgY2FuIHNhZmVseSByZW1vdmUgdGhlIHByb3ZpZGVyIGRlZmluaXRpb24uXG4gICAgaWYgKCF0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwcm92aWRlckFzc2lnbm1lbnQpIHx8XG4gICAgICAgIGdldFByb3BlcnR5TmFtZVRleHQocHJvdmlkZXJBc3NpZ25tZW50Lm5hbWUpICE9PSAndXNlQ2xhc3MnKSB7XG4gICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7bm9kZSwgbWVzc2FnZTogQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1J9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvYmplY3RMaXRlcmFsRXhwciA9IHByb3ZpZGVyQXNzaWdubWVudC5wYXJlbnQ7XG4gICAgY29uc3QgcHJvdmlkZVRva2VuID0gb2JqZWN0TGl0ZXJhbEV4cHIucHJvcGVydGllcy5maW5kKFxuICAgICAgICAocCk6IHAgaXMgdHMuUHJvcGVydHlBc3NpZ25tZW50ID0+XG4gICAgICAgICAgICB0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwKSAmJiBnZXRQcm9wZXJ0eU5hbWVUZXh0KHAubmFtZSkgPT09ICdwcm92aWRlJyk7XG5cbiAgICAvLyBEbyBub3QgcmVtb3ZlIHRoZSByZWZlcmVuY2UgaWYgdGhlIGdlc3R1cmUgY29uZmlnIGlzIG5vdCBwYXJ0IG9mIGEgcHJvdmlkZXIgZGVmaW5pdGlvbixcbiAgICAvLyBvciBpZiB0aGUgcHJvdmlkZWQgdG9rZSBpcyBub3QgcmVmZXJyaW5nIHRvIHRoZSBrbm93biBIQU1NRVJfR0VTVFVSRV9DT05GSUcgdG9rZW5cbiAgICAvLyBmcm9tIHBsYXRmb3JtLWJyb3dzZXIuXG4gICAgaWYgKCFwcm92aWRlVG9rZW4gfHwgIXRoaXMuX2lzUmVmZXJlbmNlVG9IYW1tZXJDb25maWdUb2tlbihwcm92aWRlVG9rZW4uaW5pdGlhbGl6ZXIpKSB7XG4gICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7bm9kZSwgbWVzc2FnZTogQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1J9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDb2xsZWN0IGFsbCBuZXN0ZWQgaWRlbnRpZmllcnMgd2hpY2ggd2lsbCBiZSBkZWxldGVkLiBUaGlzIGhlbHBzIHVzXG4gICAgLy8gZGV0ZXJtaW5pbmcgaWYgd2UgY2FuIHJlbW92ZSBpbXBvcnRzIGZvciB0aGUgXCJIQU1NRVJfR0VTVFVSRV9DT05GSUdcIiB0b2tlbi5cbiAgICB0aGlzLl9kZWxldGVkSWRlbnRpZmllcnMucHVzaCguLi5maW5kTWF0Y2hpbmdDaGlsZE5vZGVzKG9iamVjdExpdGVyYWxFeHByLCB0cy5pc0lkZW50aWZpZXIpKTtcblxuICAgIC8vIEluIGNhc2UgdGhlIGZvdW5kIHByb3ZpZGVyIGRlZmluaXRpb24gaXMgbm90IHBhcnQgb2YgYW4gYXJyYXkgbGl0ZXJhbCxcbiAgICAvLyB3ZSBjYW5ub3Qgc2FmZWx5IHJlbW92ZSB0aGUgcHJvdmlkZXIuIFRoaXMgaXMgYmVjYXVzZSBpdCBjb3VsZCBiZSBkZWNsYXJlZFxuICAgIC8vIGFzIGEgdmFyaWFibGUuIGUuZy4gXCJjb25zdCBnZXN0dXJlUHJvdmlkZXIgPSB7cHJvdmlkZTogLi4sIHVzZUNsYXNzOiBHZXN0dXJlQ29uZmlnfVwiLlxuICAgIC8vIEluIHRoYXQgY2FzZSwgd2UganVzdCBhZGQgYW4gZW1wdHkgb2JqZWN0IGxpdGVyYWwgd2l0aCBUT0RPIGFuZCBwcmludCBhIGZhaWx1cmUuXG4gICAgaWYgKCF0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24ob2JqZWN0TGl0ZXJhbEV4cHIucGFyZW50KSkge1xuICAgICAgcmVjb3JkZXIucmVtb3ZlKG9iamVjdExpdGVyYWxFeHByLmdldFN0YXJ0KCksIG9iamVjdExpdGVyYWxFeHByLmdldFdpZHRoKCkpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQob2JqZWN0TGl0ZXJhbEV4cHIuZ2V0U3RhcnQoKSwgYC8qIFRPRE86IHJlbW92ZSAqLyB7fWApO1xuICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe1xuICAgICAgICBub2RlOiBvYmplY3RMaXRlcmFsRXhwcixcbiAgICAgICAgbWVzc2FnZTogYFVuYWJsZSB0byBkZWxldGUgcHJvdmlkZXIgZGVmaW5pdGlvbiBmb3IgXCJHZXN0dXJlQ29uZmlnXCIgY29tcGxldGVseS4gYCArXG4gICAgICAgICAgICBgUGxlYXNlIGNsZWFuIHVwIHRoZSBwcm92aWRlci5gXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmVzIHRoZSBvYmplY3QgbGl0ZXJhbCBmcm9tIHRoZSBwYXJlbnQgYXJyYXkgZXhwcmVzc2lvbi4gUmVtb3Zlc1xuICAgIC8vIHRoZSB0cmFpbGluZyBjb21tYSB0b2tlbiBpZiBwcmVzZW50LlxuICAgIHJlbW92ZUVsZW1lbnRGcm9tQXJyYXlFeHByZXNzaW9uKG9iamVjdExpdGVyYWxFeHByLCByZWNvcmRlcik7XG4gIH1cblxuICAvKiogUmVtb3ZlcyB0aGUgZ2l2ZW4gaGFtbWVyIGNvbmZpZyB0b2tlbiBpbXBvcnQgaWYgaXQgaXMgbm90IHVzZWQuICovXG4gIHByaXZhdGUgX3JlbW92ZUhhbW1lckNvbmZpZ1Rva2VuSW1wb3J0SWZVbnVzZWQoe25vZGUsIGltcG9ydERhdGF9OiBJZGVudGlmaWVyUmVmZXJlbmNlKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IGlzVG9rZW5Vc2VkID0gdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUoXG4gICAgICAgIHIgPT4gIXIuaXNJbXBvcnQgJiYgIWlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Moci5ub2RlKSAmJlxuICAgICAgICAgICAgci5ub2RlLmdldFNvdXJjZUZpbGUoKSA9PT0gc291cmNlRmlsZSAmJiAhdGhpcy5fZGVsZXRlZElkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpO1xuXG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB0byByZW1vdmUgdGhlIGltcG9ydCBmb3IgdGhlIHRva2VuIGlmIHRoZSB0b2tlbiBpc1xuICAgIC8vIHN0aWxsIHVzZWQgc29tZXdoZXJlLlxuICAgIGlmICghaXNUb2tlblVzZWQpIHtcbiAgICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICAgIHNvdXJjZUZpbGUsIEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVtb3ZlcyBIYW1tZXIgZnJvbSBhbGwgaW5kZXggSFRNTCBmaWxlcyBvZiB0aGUgZ2l2ZW4gcHJvamVjdC4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyRnJvbUluZGV4RmlsZShwcm9qZWN0OiBXb3Jrc3BhY2VQcm9qZWN0KSB7XG4gICAgY29uc3QgaW5kZXhGaWxlUGF0aHMgPSBnZXRQcm9qZWN0SW5kZXhGaWxlcyhwcm9qZWN0KTtcbiAgICBpbmRleEZpbGVQYXRocy5mb3JFYWNoKGZpbGVQYXRoID0+IHtcbiAgICAgIGlmICghdGhpcy50cmVlLmV4aXN0cyhmaWxlUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBodG1sQ29udGVudCA9IHRoaXMudHJlZS5yZWFkKGZpbGVQYXRoKSEudG9TdHJpbmcoJ3V0ZjgnKTtcbiAgICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5nZXRVcGRhdGVSZWNvcmRlcihmaWxlUGF0aCk7XG5cbiAgICAgIGZpbmRIYW1tZXJTY3JpcHRJbXBvcnRFbGVtZW50cyhodG1sQ29udGVudClcbiAgICAgICAgICAuZm9yRWFjaChlbCA9PiByZW1vdmVFbGVtZW50RnJvbUh0bWwoZWwsIHJlY29yZGVyKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB1cCB0aGUgSGFtbWVyIGdlc3R1cmUgY29uZmlnIHByb3ZpZGVyIGluIHRoZSBnaXZlbiBhcHAgbW9kdWxlXG4gICAqIGlmIG5lZWRlZC5cbiAgICovXG4gIHByaXZhdGUgX3NldHVwR2VzdHVyZUNvbmZpZ1Byb3ZpZGVySWZOZWVkZWQoXG4gICAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCBhcHBNb2R1bGVQYXRoOiBzdHJpbmcsIGNvbmZpZ1BhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IGhhbW1lckNvbmZpZ1Rva2VuRXhwciA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICBzb3VyY2VGaWxlLCBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUsIEhBTU1FUl9DT05GSUdfVE9LRU5fTU9EVUxFKTtcbiAgICBjb25zdCBnZXN0dXJlQ29uZmlnRXhwciA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICBzb3VyY2VGaWxlLCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLCBnZXRNb2R1bGVTcGVjaWZpZXIoY29uZmlnUGF0aCwgc291cmNlRmlsZS5maWxlTmFtZSkpO1xuXG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IG5ld1Byb3ZpZGVyTm9kZSA9IHRzLmNyZWF0ZU9iamVjdExpdGVyYWwoW1xuICAgICAgdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KCdwcm92aWRlJywgaGFtbWVyQ29uZmlnVG9rZW5FeHByKSxcbiAgICAgIHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgndXNlQ2xhc3MnLCBnZXN0dXJlQ29uZmlnRXhwcilcbiAgICBdKTtcblxuICAgIC8vIElmIG5vIFwiTmdNb2R1bGVcIiBkZWZpbml0aW9uIGlzIGZvdW5kIGluc2lkZSB0aGUgc291cmNlIGZpbGUsIHdlIGp1c3QgZG8gbm90aGluZy5cbiAgICBjb25zdCBtZXRhZGF0YSA9IGdldERlY29yYXRvck1ldGFkYXRhKHNvdXJjZUZpbGUsICdOZ01vZHVsZScsICdAYW5ndWxhci9jb3JlJykgYXNcbiAgICAgICAgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25bXTtcbiAgICBpZiAoIW1ldGFkYXRhLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3ZpZGVyc0ZpZWxkID0gZ2V0TWV0YWRhdGFGaWVsZChtZXRhZGF0YVswXSwgJ3Byb3ZpZGVycycpWzBdO1xuICAgIGNvbnN0IHByb3ZpZGVySWRlbnRpZmllcnMgPVxuICAgICAgICBwcm92aWRlcnNGaWVsZCA/IGZpbmRNYXRjaGluZ0NoaWxkTm9kZXMocHJvdmlkZXJzRmllbGQsIHRzLmlzSWRlbnRpZmllcikgOiBudWxsO1xuXG4gICAgLy8gSWYgdGhlIHByb3ZpZGVycyBmaWVsZCBleGlzdHMgYW5kIGFscmVhZHkgY29udGFpbnMgcmVmZXJlbmNlcyB0byB0aGUgaGFtbWVyXG4gICAgLy8gZ2VzdHVyZSBjb25maWcgdG9rZW4gYW5kIHRoZSBnZXN0dXJlIGNvbmZpZywgd2UgbmFpdmVseSBhc3N1bWUgdGhhdCB0aGUgZ2VzdHVyZVxuICAgIC8vIGNvbmZpZyBpcyBhbHJlYWR5IHNldCB1cC4gVGhpcyBjaGVjayBpcyBzbGlnaHRseSBuYWl2ZSBiZWNhdXNlIGl0IGFzc3VtZXMgdGhhdFxuICAgIC8vIHJlZmVyZW5jZXMgdG8gdGhlc2UgdHdvIHRva2VucyBhbHdheXMgbWVhbiB0aGF0IHRoZXkgYXJlIHNldCB1cCBhcyBhIHByb3ZpZGVyXG4gICAgLy8gZGVmaW5pdGlvbi4gVGhpcyBpcyBub3QgZ3VhcmFudGVlZCBiZWNhdXNlIGl0IGNvdWxkIGJlIGp1c3QgYnkgaW5jaWRlbnQgdGhhdFxuICAgIC8vIGdlc3R1cmUgY29uZmlnIGlzIHNvbWVob3cgcmVmZXJlbmNlcyBpbiBhIGRpZmZlcmVudCBwcm92aWRlciB0aGFuIGZvciBzZXR0aW5nIHVwXG4gICAgLy8gdGhlIGdlc3R1cmUgY29uZmlnIHRva2VuIGZyb20gcGxhdGZvcm0tYnJvd3Nlci4gVGhpcyBjaGVjayBjYW4gbmV2ZXIgYmUgdmVyeVxuICAgIC8vIHJvYnVzdCB3aXRob3V0IGFjdHVhbGx5IGludGVycHJldGluZyB0aGUgcHJvdmlkZXJzIGZpZWxkIGxpa2UgTkdDIG9yIG5ndHNjIHdvdWxkLlxuICAgIC8vICh0aGlzIHdvdWxkIGludm9sdmUgcGFydGlhbCBpbnRlcnByZXRhdGlvbiB3aXRoIG1ldGFkYXRhLmpzb24gZmlsZSBzdXBwb3J0KVxuICAgIGlmIChwcm92aWRlcklkZW50aWZpZXJzICYmXG4gICAgICAgIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gcHJvdmlkZXJJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKSAmJlxuICAgICAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5zb21lKHIgPT4gcHJvdmlkZXJJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYW5nZUFjdGlvbnMgPSBhZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEoXG4gICAgICAgIHNvdXJjZUZpbGUsIGFwcE1vZHVsZVBhdGgsICdwcm92aWRlcnMnLCB0aGlzLl9wcmludE5vZGUobmV3UHJvdmlkZXJOb2RlLCBzb3VyY2VGaWxlKSwgbnVsbCk7XG5cbiAgICBjaGFuZ2VBY3Rpb25zLmZvckVhY2goY2hhbmdlID0+IHtcbiAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRDaGFuZ2UpIHtcbiAgICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBQcmludHMgYSBnaXZlbiBub2RlIHdpdGhpbiB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlLiAqL1xuICBwcml2YXRlIF9wcmludE5vZGUobm9kZTogdHMuTm9kZSwgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCBub2RlLCBzb3VyY2VGaWxlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzeW1ib2wgdGhhdCBjb250YWlucyB0aGUgdmFsdWUgZGVjbGFyYXRpb24gb2YgdGhlIHNwZWNpZmllZCBub2RlLiAqL1xuICBwcml2YXRlIF9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlOiB0cy5Ob2RlKTogdHMuU3ltYm9sfHVuZGVmaW5lZCB7XG4gICAgY29uc3Qgc3ltYm9sID0gdGhpcy50eXBlQ2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUpO1xuXG4gICAgLy8gU3ltYm9scyBjYW4gYmUgYWxpYXNlcyBvZiB0aGUgZGVjbGFyYXRpb24gc3ltYm9sLiBlLmcuIGluIG5hbWVkIGltcG9ydCBzcGVjaWZpZXJzLlxuICAgIC8vIFdlIG5lZWQgdG8gcmVzb2x2ZSB0aGUgYWxpYXNlZCBzeW1ib2wgYmFjayB0byB0aGUgZGVjbGFyYXRpb24gc3ltYm9sLlxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1iaXR3aXNlXG4gICAgaWYgKHN5bWJvbCAmJiAoc3ltYm9sLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuQWxpYXMpICE9PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy50eXBlQ2hlY2tlci5nZXRBbGlhc2VkU3ltYm9sKHN5bWJvbCk7XG4gICAgfVxuICAgIHJldHVybiBzeW1ib2w7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIGV4cHJlc3Npb24gcmVzb2x2ZXMgdG8gYSBoYW1tZXIgZ2VzdHVyZSBjb25maWdcbiAgICogdG9rZW4gcmVmZXJlbmNlIGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuXG4gICAqL1xuICBwcml2YXRlIF9pc1JlZmVyZW5jZVRvSGFtbWVyQ29uZmlnVG9rZW4oZXhwcjogdHMuRXhwcmVzc2lvbikge1xuICAgIGNvbnN0IHVud3JhcHBlZCA9IHVud3JhcEV4cHJlc3Npb24oZXhwcik7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcih1bndyYXBwZWQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUociA9PiByLm5vZGUgPT09IHVud3JhcHBlZCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbih1bndyYXBwZWQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUociA9PiByLm5vZGUgPT09IHVud3JhcHBlZC5uYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgbWlncmF0aW9uIGZhaWx1cmVzIG9mIHRoZSBjb2xsZWN0ZWQgbm9kZSBmYWlsdXJlcy4gVGhlIHJldHVybmVkIG1pZ3JhdGlvblxuICAgKiBmYWlsdXJlcyBhcmUgdXBkYXRlZCB0byByZWZsZWN0IHRoZSBwb3N0LW1pZ3JhdGlvbiBzdGF0ZSBvZiBzb3VyY2UgZmlsZXMuIE1lYW5pbmdcbiAgICogdGhhdCBmYWlsdXJlIHBvc2l0aW9ucyBhcmUgY29ycmVjdGVkIGlmIHNvdXJjZSBmaWxlIG1vZGlmaWNhdGlvbnMgc2hpZnRlZCBsaW5lcy5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU1pZ3JhdGlvbkZhaWx1cmVzKCk6IE1pZ3JhdGlvbkZhaWx1cmVbXSB7XG4gICAgcmV0dXJuIHRoaXMuX25vZGVGYWlsdXJlcy5tYXAoKHtub2RlLCBtZXNzYWdlfSkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gbm9kZS5nZXRTdGFydCgpO1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0cy5nZXRMaW5lQW5kQ2hhcmFjdGVyT2ZQb3NpdGlvbihub2RlLmdldFNvdXJjZUZpbGUoKSwgbm9kZS5nZXRTdGFydCgpKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aW9uOiB0aGlzLl9pbXBvcnRNYW5hZ2VyLmNvcnJlY3ROb2RlUG9zaXRpb24obm9kZSwgb2Zmc2V0LCBwb3NpdGlvbiksXG4gICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIGZpbGVQYXRoOiBzb3VyY2VGaWxlLmZpbGVOYW1lLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBwcm9qZWN0IGZyb20gdGhlIGN1cnJlbnQgcHJvZ3JhbSBvciB0aHJvd3MgaWYgbm8gcHJvamVjdFxuICAgKiBjb3VsZCBiZSBmb3VuZC5cbiAgICovXG4gIHByaXZhdGUgX2dldFByb2plY3RPclRocm93KCk6IFdvcmtzcGFjZVByb2plY3Qge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGdldFdvcmtzcGFjZSh0aGlzLnRyZWUpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVByb2dyYW0od29ya3NwYWNlLCB0aGlzLnByb2dyYW0pO1xuXG4gICAgaWYgKCFwcm9qZWN0KSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihcbiAgICAgICAgICAnQ291bGQgbm90IGZpbmQgcHJvamVjdCB0byBwZXJmb3JtIEhhbW1lckpTIHY5IG1pZ3JhdGlvbi4gJyArXG4gICAgICAgICAgJ1BsZWFzZSBlbnN1cmUgeW91ciB3b3Jrc3BhY2UgY29uZmlndXJhdGlvbiBkZWZpbmVzIGEgcHJvamVjdC4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvamVjdDtcbiAgfVxuXG4gIC8qKiBHbG9iYWwgc3RhdGUgb2Ygd2hldGhlciBIYW1tZXIgaXMgdXNlZCBpbiBhbnkgYW5hbHl6ZWQgcHJvamVjdCB0YXJnZXQuICovXG4gIHN0YXRpYyBnbG9iYWxVc2VzSGFtbWVyID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFN0YXRpYyBtaWdyYXRpb24gcnVsZSBtZXRob2QgdGhhdCB3aWxsIGJlIGNhbGxlZCBvbmNlIGFsbCBwcm9qZWN0IHRhcmdldHNcbiAgICogaGF2ZSBiZWVuIG1pZ3JhdGVkIGluZGl2aWR1YWxseS4gVGhpcyBtZXRob2QgY2FuIGJlIHVzZWQgdG8gbWFrZSBjaGFuZ2VzIGJhc2VkXG4gICAqIG9uIHRoZSBhbmFseXNpcyBvZiB0aGUgaW5kaXZpZHVhbCB0YXJnZXRzLiBGb3IgZXhhbXBsZTogd2Ugb25seSByZW1vdmUgSGFtbWVyXG4gICAqIGZyb20gdGhlIFwicGFja2FnZS5qc29uXCIgaWYgaXQgaXMgbm90IHVzZWQgaW4gKmFueSogcHJvamVjdCB0YXJnZXQuXG4gICAqL1xuICBzdGF0aWMgZ2xvYmFsUG9zdE1pZ3JhdGlvbih0cmVlOiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSB7XG4gICAgaWYgKCF0aGlzLmdsb2JhbFVzZXNIYW1tZXIgJiYgdGhpcy5fcmVtb3ZlSGFtbWVyRnJvbVBhY2thZ2VKc29uKHRyZWUpKSB7XG4gICAgICAvLyBTaW5jZSBIYW1tZXIgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSB3b3Jrc3BhY2UgXCJwYWNrYWdlLmpzb25cIiBmaWxlLFxuICAgICAgLy8gd2Ugc2NoZWR1bGUgYSBub2RlIHBhY2thZ2UgaW5zdGFsbCB0YXNrIHRvIHJlZnJlc2ggdGhlIGxvY2sgZmlsZS5cbiAgICAgIGNvbnRleHQuYWRkVGFzayhuZXcgTm9kZVBhY2thZ2VJbnN0YWxsVGFzayh7cXVpZXQ6IGZhbHNlfSkpO1xuICAgIH1cblxuICAgIGNvbnRleHQubG9nZ2VyLmluZm8oY2hhbGsueWVsbG93KFxuICAgICAgICAnICDimqAgICBUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIGNvbXBvbmVudHMgaXMgbm90IGFibGUgdG8gbWlncmF0ZSB0ZXN0cy4gJyArXG4gICAgICAgICdQbGVhc2UgbWFudWFsbHkgY2xlYW4gdXAgdGVzdHMgaW4geW91ciBwcm9qZWN0IGlmIHRoZXkgcmVseSBvbiBIYW1tZXJKUy4nKSk7XG5cbiAgICAvLyBDbGVhbiBnbG9iYWwgc3RhdGUgb25jZSB0aGUgd29ya3NwYWNlIGhhcyBiZWVuIG1pZ3JhdGVkLiBUaGlzIGlzIHRlY2huaWNhbGx5XG4gICAgLy8gbm90IG5lY2Vzc2FyeSBpbiBcIm5nIHVwZGF0ZVwiLCBidXQgaW4gdGVzdHMgd2UgcmUtdXNlIHRoZSBzYW1lIHJ1bGUgY2xhc3MuXG4gICAgdGhpcy5nbG9iYWxVc2VzSGFtbWVyID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgaGFtbWVyIHBhY2thZ2UgZnJvbSB0aGUgd29ya3NwYWNlIFwicGFja2FnZS5qc29uXCIuXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgSGFtbWVyIHdhcyBzZXQgdXAgYW5kIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgXCJwYWNrYWdlLmpzb25cIlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgX3JlbW92ZUhhbW1lckZyb21QYWNrYWdlSnNvbih0cmVlOiBUcmVlKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0cmVlLmV4aXN0cygnL3BhY2thZ2UuanNvbicpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHRyZWUucmVhZCgnL3BhY2thZ2UuanNvbicpIS50b1N0cmluZygndXRmOCcpKTtcblxuICAgIC8vIFdlIGRvIG5vdCBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgc29tZW9uZSBtYW51YWxseSBhZGRlZCBcImhhbW1lcmpzXCJcbiAgICAvLyB0byB0aGUgZGV2IGRlcGVuZGVuY2llcy5cbiAgICBpZiAocGFja2FnZUpzb24uZGVwZW5kZW5jaWVzW0hBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSXSkge1xuICAgICAgZGVsZXRlIHBhY2thZ2VKc29uLmRlcGVuZGVuY2llc1tIQU1NRVJfTU9EVUxFX1NQRUNJRklFUl07XG4gICAgICB0cmVlLm92ZXJ3cml0ZSgnL3BhY2thZ2UuanNvbicsIEpTT04uc3RyaW5naWZ5KHBhY2thZ2VKc29uLCBudWxsLCAyKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgdW53cmFwcyBhIGdpdmVuIGV4cHJlc3Npb24gaWYgaXQgaXMgd3JhcHBlZFxuICogYnkgcGFyZW50aGVzaXMsIHR5cGUgY2FzdHMgb3IgdHlwZSBhc3NlcnRpb25zLlxuICovXG5mdW5jdGlvbiB1bndyYXBFeHByZXNzaW9uKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlIHtcbiAgaWYgKHRzLmlzUGFyZW50aGVzaXplZEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9IGVsc2UgaWYgKHRzLmlzQXNFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgcmV0dXJuIHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgfSBlbHNlIGlmICh0cy5pc1R5cGVBc3NlcnRpb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9XG4gIHJldHVybiBub2RlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBzcGVjaWZpZWQgcGF0aCB0byBhIHZhbGlkIFR5cGVTY3JpcHQgbW9kdWxlIHNwZWNpZmllciB3aGljaCBpc1xuICogcmVsYXRpdmUgdG8gdGhlIGdpdmVuIGNvbnRhaW5pbmcgZmlsZS5cbiAqL1xuZnVuY3Rpb24gZ2V0TW9kdWxlU3BlY2lmaWVyKG5ld1BhdGg6IHN0cmluZywgY29udGFpbmluZ0ZpbGU6IHN0cmluZykge1xuICBsZXQgcmVzdWx0ID0gcmVsYXRpdmUoZGlybmFtZShjb250YWluaW5nRmlsZSksIG5ld1BhdGgpLnJlcGxhY2UoL1xcXFwvZywgJy8nKS5yZXBsYWNlKC9cXC50cyQvLCAnJyk7XG4gIGlmICghcmVzdWx0LnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgIHJlc3VsdCA9IGAuLyR7cmVzdWx0fWA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSBuYW1lLlxuICogQHJldHVybnMgVGV4dCBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgbmFtZS4gTnVsbCBpZiBub3Qgc3RhdGljYWxseSBhbmFseXphYmxlLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eU5hbWVUZXh0KG5vZGU6IHRzLlByb3BlcnR5TmFtZSk6IHN0cmluZ3xudWxsIHtcbiAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSB8fCB0cy5pc1N0cmluZ0xpdGVyYWxMaWtlKG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGUudGV4dDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBpZGVudGlmaWVyIGlzIHBhcnQgb2YgYSBuYW1lc3BhY2VkIGFjY2Vzcy4gKi9cbmZ1bmN0aW9uIGlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZTogdHMuSWRlbnRpZmllcik6IGJvb2xlYW4ge1xuICByZXR1cm4gdHMuaXNRdWFsaWZpZWROYW1lKG5vZGUucGFyZW50KSB8fCB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLnBhcmVudCk7XG59XG5cbi8qKlxuICogV2Fsa3MgdGhyb3VnaCB0aGUgc3BlY2lmaWVkIG5vZGUgYW5kIHJldHVybnMgYWxsIGNoaWxkIG5vZGVzIHdoaWNoIG1hdGNoIHRoZVxuICogZ2l2ZW4gcHJlZGljYXRlLlxuICovXG5mdW5jdGlvbiBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzPFQgZXh0ZW5kcyB0cy5Ob2RlPihcbiAgICBwYXJlbnQ6IHRzLk5vZGUsIHByZWRpY2F0ZTogKG5vZGU6IHRzLk5vZGUpID0+IG5vZGUgaXMgVCk6IFRbXSB7XG4gIGNvbnN0IHJlc3VsdDogVFtdID0gW107XG4gIGNvbnN0IHZpc2l0Tm9kZSA9IChub2RlOiB0cy5Ob2RlKSA9PiB7XG4gICAgaWYgKHByZWRpY2F0ZShub2RlKSkge1xuICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XG4gICAgfVxuICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCB2aXNpdE5vZGUpO1xuICB9O1xuICB0cy5mb3JFYWNoQ2hpbGQocGFyZW50LCB2aXNpdE5vZGUpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl19