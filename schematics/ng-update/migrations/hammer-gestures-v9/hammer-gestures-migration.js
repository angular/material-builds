"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HammerGesturesMigration = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular/cdk/schematics");
const change_1 = require("@schematics/angular/utility/change");
const fs_1 = require("fs");
const path_1 = require("path");
const ts = require("typescript");
const find_hammer_script_tags_1 = require("./find-hammer-script-tags");
const find_main_module_1 = require("./find-main-module");
const hammer_template_check_1 = require("./hammer-template-check");
const import_manager_1 = require("./import-manager");
const remove_array_element_1 = require("./remove-array-element");
const remove_element_from_html_1 = require("./remove-element-from-html");
const GESTURE_CONFIG_CLASS_NAME = 'GestureConfig';
const GESTURE_CONFIG_FILE_NAME = 'gesture-config';
const GESTURE_CONFIG_TEMPLATE_PATH = './gesture-config.template';
const HAMMER_CONFIG_TOKEN_NAME = 'HAMMER_GESTURE_CONFIG';
const HAMMER_CONFIG_TOKEN_MODULE = '@angular/platform-browser';
const HAMMER_MODULE_NAME = 'HammerModule';
const HAMMER_MODULE_IMPORT = '@angular/platform-browser';
const HAMMER_MODULE_SPECIFIER = 'hammerjs';
const CANNOT_REMOVE_REFERENCE_ERROR = `Cannot remove reference to "GestureConfig". Please remove manually.`;
class HammerGesturesMigration extends schematics_1.DevkitMigration {
    constructor() {
        super(...arguments);
        // Only enable this rule if the migration targets v9 or v10 and is running for a non-test
        // target. We cannot migrate test targets since they have a limited scope
        // (in regards to source files) and therefore the HammerJS usage detection can be incorrect.
        this.enabled = (this.targetVersion === schematics_1.TargetVersion.V9 || this.targetVersion === schematics_1.TargetVersion.V10) &&
            !this.context.isTestTarget;
        this._printer = ts.createPrinter();
        this._importManager = new import_manager_1.ImportManager(this.fileSystem, this._printer);
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
            HammerGesturesMigration.globalUsesHammer = true;
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
            HammerGesturesMigration.globalUsesHammer = true;
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
        const project = this.context.project;
        const sourceRoot = core_1.normalize(project.sourceRoot || project.root);
        const newConfigPath = core_1.join(sourceRoot, this._getAvailableGestureConfigFileName(sourceRoot));
        // Copy gesture config template into the CLI project.
        this.fileSystem.create(newConfigPath, fs_1.readFileSync(require.resolve(GESTURE_CONFIG_TEMPLATE_PATH), 'utf8'));
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
        this._removeHammerFromIndexFile();
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
            const recorder = this.fileSystem.edit(this.fileSystem.resolve(sourceFile.fileName));
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
        if (!this.fileSystem.exists(core_1.join(sourceRoot, `${GESTURE_CONFIG_FILE_NAME}.ts`))) {
            return `${GESTURE_CONFIG_FILE_NAME}.ts`;
        }
        let possibleName = `${GESTURE_CONFIG_FILE_NAME}-`;
        let index = 1;
        while (this.fileSystem.exists(core_1.join(sourceRoot, `${possibleName}-${index}.ts`))) {
            index++;
        }
        return `${possibleName + index}.ts`;
    }
    /** Replaces a given gesture config reference with a new import. */
    _replaceGestureConfigReference({ node, importData, isImport }, symbolName, moduleSpecifier) {
        const sourceFile = node.getSourceFile();
        const recorder = this.fileSystem.edit(this.fileSystem.resolve(sourceFile.fileName));
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
        const recorder = this.fileSystem.edit(this.fileSystem.resolve(sourceFile.fileName));
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
    /** Removes Hammer from all index HTML files of the current project. */
    _removeHammerFromIndexFile() {
        const indexFilePaths = schematics_1.getProjectIndexFiles(this.context.project);
        indexFilePaths.forEach(filePath => {
            if (!this.fileSystem.exists(filePath)) {
                return;
            }
            const htmlContent = this.fileSystem.read(filePath);
            const recorder = this.fileSystem.edit(filePath);
            find_hammer_script_tags_1.findHammerScriptImportElements(htmlContent)
                .forEach(el => remove_element_from_html_1.removeElementFromHtml(el, recorder));
        });
    }
    /** Sets up the Hammer gesture config in the root module if needed. */
    _setupNewGestureConfigInRootModule(gestureConfigPath) {
        const { workspaceFsPath, project } = this.context;
        const mainFilePath = schematics_1.getProjectMainFile(project);
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
        const relativePath = path_1.relative(workspaceFsPath, sourceFile.fileName);
        const metadata = schematics_1.getDecoratorMetadata(sourceFile, 'NgModule', '@angular/core');
        // If no "NgModule" definition is found inside the source file, we just do nothing.
        if (!metadata.length) {
            return;
        }
        const recorder = this.fileSystem.edit(this.fileSystem.resolve(sourceFile.fileName));
        const providersField = schematics_1.getMetadataField(metadata[0], 'providers')[0];
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
            schematics_1.addSymbolToNgModuleMetadata(sourceFile, relativePath, 'providers', this._printNode(newProviderNode, sourceFile), null)
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
        const mainFile = this.program.getSourceFile(path_1.resolve(this.context.workspaceFsPath, mainFilePath));
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
    /** Sets up the "HammerModule" in the root module of the current project. */
    _setupHammerModuleInRootModule() {
        const { workspaceFsPath, project } = this.context;
        const mainFilePath = schematics_1.getProjectMainFile(project);
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
        const relativePath = path_1.relative(workspaceFsPath, sourceFile.fileName);
        const metadata = schematics_1.getDecoratorMetadata(sourceFile, 'NgModule', '@angular/core');
        if (!metadata.length) {
            return;
        }
        const importsField = schematics_1.getMetadataField(metadata[0], 'imports')[0];
        const importIdentifiers = importsField ? findMatchingChildNodes(importsField, ts.isIdentifier) : null;
        const recorder = this.fileSystem.edit(this.fileSystem.resolve(sourceFile.fileName));
        const hammerModuleExpr = this._importManager.addImportToSourceFile(sourceFile, HAMMER_MODULE_NAME, HAMMER_MODULE_IMPORT);
        // If the "HammerModule" is not already imported in the app module, we set it up
        // by adding it to the "imports" field of the app module.
        if (!importIdentifiers ||
            !this._hammerModuleReferences.some(r => importIdentifiers.includes(r.node))) {
            schematics_1.addSymbolToNgModuleMetadata(sourceFile, relativePath, 'imports', this._printNode(hammerModuleExpr, sourceFile), null)
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
            const position = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart());
            return {
                position: this._importManager.correctNodePosition(node, offset, position),
                message: message,
                filePath: this.fileSystem.resolve(sourceFile.fileName),
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
        // We do not handle the case where someone manually added "hammerjs" to the dev dependencies.
        if (packageJson.dependencies && packageJson.dependencies[HAMMER_MODULE_SPECIFIER]) {
            delete packageJson.dependencies[HAMMER_MODULE_SPECIFIER];
            tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));
            return true;
        }
        return false;
    }
}
exports.HammerGesturesMigration = HammerGesturesMigration;
/** Global state of whether Hammer is used in any analyzed project target. */
HammerGesturesMigration.globalUsesHammer = false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLWdlc3R1cmVzLW1pZ3JhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL2hhbW1lci1nZXN0dXJlcy12OS9oYW1tZXItZ2VzdHVyZXMtbWlncmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILCtDQUs4QjtBQUU5Qix3REFhaUM7QUFDakMsK0RBQWdFO0FBQ2hFLDJCQUFnQztBQUNoQywrQkFBZ0Q7QUFDaEQsaUNBQWlDO0FBRWpDLHVFQUF5RTtBQUN6RSx5REFBNEQ7QUFDNUQsbUVBQWlFO0FBQ2pFLHFEQUErQztBQUMvQyxpRUFBd0U7QUFDeEUseUVBQWlFO0FBRWpFLE1BQU0seUJBQXlCLEdBQUcsZUFBZSxDQUFDO0FBQ2xELE1BQU0sd0JBQXdCLEdBQUcsZ0JBQWdCLENBQUM7QUFDbEQsTUFBTSw0QkFBNEIsR0FBRywyQkFBMkIsQ0FBQztBQUVqRSxNQUFNLHdCQUF3QixHQUFHLHVCQUF1QixDQUFDO0FBQ3pELE1BQU0sMEJBQTBCLEdBQUcsMkJBQTJCLENBQUM7QUFFL0QsTUFBTSxrQkFBa0IsR0FBRyxjQUFjLENBQUM7QUFDMUMsTUFBTSxvQkFBb0IsR0FBRywyQkFBMkIsQ0FBQztBQUV6RCxNQUFNLHVCQUF1QixHQUFHLFVBQVUsQ0FBQztBQUUzQyxNQUFNLDZCQUE2QixHQUMvQixxRUFBcUUsQ0FBQztBQVExRSxNQUFhLHVCQUF3QixTQUFRLDRCQUFxQjtJQUFsRTs7UUFDRSx5RkFBeUY7UUFDekYseUVBQXlFO1FBQ3pFLDRGQUE0RjtRQUM1RixZQUFPLEdBQ0gsQ0FBQyxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxHQUFHLENBQUM7WUFDckYsQ0FBQyxJQUFJ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QztJQUN2QixNQUFNLFNBQVMsR0FBRyxDQUFDLElBQWEsRUFBRSxFQUFFO1FBQ2xDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbkI7UUFDRCxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUM7SUFDRixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuQyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIGpvaW4gYXMgZGV2a2l0Sm9pbixcbiAgbm9ybWFsaXplIGFzIGRldmtpdE5vcm1hbGl6ZSxcbiAgUGF0aCxcbiAgUGF0aCBhcyBEZXZraXRQYXRoXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7U2NoZW1hdGljQ29udGV4dCwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhLFxuICBEZXZraXRNaWdyYXRpb24sXG4gIGdldERlY29yYXRvck1ldGFkYXRhLFxuICBnZXRJbXBvcnRPZklkZW50aWZpZXIsXG4gIGdldE1ldGFkYXRhRmllbGQsXG4gIGdldFByb2plY3RJbmRleEZpbGVzLFxuICBnZXRQcm9qZWN0TWFpbkZpbGUsXG4gIEltcG9ydCxcbiAgTWlncmF0aW9uRmFpbHVyZSxcbiAgUG9zdE1pZ3JhdGlvbkFjdGlvbixcbiAgUmVzb2x2ZWRSZXNvdXJjZSxcbiAgVGFyZ2V0VmVyc2lvblxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge0luc2VydENoYW5nZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NoYW5nZSc7XG5pbXBvcnQge3JlYWRGaWxlU3luY30gZnJvbSAnZnMnO1xuaW1wb3J0IHtkaXJuYW1lLCByZWxhdGl2ZSwgcmVzb2x2ZX0gZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtmaW5kSGFtbWVyU2NyaXB0SW1wb3J0RWxlbWVudHN9IGZyb20gJy4vZmluZC1oYW1tZXItc2NyaXB0LXRhZ3MnO1xuaW1wb3J0IHtmaW5kTWFpbk1vZHVsZUV4cHJlc3Npb259IGZyb20gJy4vZmluZC1tYWluLW1vZHVsZSc7XG5pbXBvcnQge2lzSGFtbWVySnNVc2VkSW5UZW1wbGF0ZX0gZnJvbSAnLi9oYW1tZXItdGVtcGxhdGUtY2hlY2snO1xuaW1wb3J0IHtJbXBvcnRNYW5hZ2VyfSBmcm9tICcuL2ltcG9ydC1tYW5hZ2VyJztcbmltcG9ydCB7cmVtb3ZlRWxlbWVudEZyb21BcnJheUV4cHJlc3Npb259IGZyb20gJy4vcmVtb3ZlLWFycmF5LWVsZW1lbnQnO1xuaW1wb3J0IHtyZW1vdmVFbGVtZW50RnJvbUh0bWx9IGZyb20gJy4vcmVtb3ZlLWVsZW1lbnQtZnJvbS1odG1sJztcblxuY29uc3QgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSA9ICdHZXN0dXJlQ29uZmlnJztcbmNvbnN0IEdFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRSA9ICdnZXN0dXJlLWNvbmZpZyc7XG5jb25zdCBHRVNUVVJFX0NPTkZJR19URU1QTEFURV9QQVRIID0gJy4vZ2VzdHVyZS1jb25maWcudGVtcGxhdGUnO1xuXG5jb25zdCBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUgPSAnSEFNTUVSX0dFU1RVUkVfQ09ORklHJztcbmNvbnN0IEhBTU1FUl9DT05GSUdfVE9LRU5fTU9EVUxFID0gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5jb25zdCBIQU1NRVJfTU9EVUxFX05BTUUgPSAnSGFtbWVyTW9kdWxlJztcbmNvbnN0IEhBTU1FUl9NT0RVTEVfSU1QT1JUID0gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5jb25zdCBIQU1NRVJfTU9EVUxFX1NQRUNJRklFUiA9ICdoYW1tZXJqcyc7XG5cbmNvbnN0IENBTk5PVF9SRU1PVkVfUkVGRVJFTkNFX0VSUk9SID1cbiAgICBgQ2Fubm90IHJlbW92ZSByZWZlcmVuY2UgdG8gXCJHZXN0dXJlQ29uZmlnXCIuIFBsZWFzZSByZW1vdmUgbWFudWFsbHkuYDtcblxuaW50ZXJmYWNlIElkZW50aWZpZXJSZWZlcmVuY2Uge1xuICBub2RlOiB0cy5JZGVudGlmaWVyO1xuICBpbXBvcnREYXRhOiBJbXBvcnQ7XG4gIGlzSW1wb3J0OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgSGFtbWVyR2VzdHVyZXNNaWdyYXRpb24gZXh0ZW5kcyBEZXZraXRNaWdyYXRpb248bnVsbD4ge1xuICAvLyBPbmx5IGVuYWJsZSB0aGlzIHJ1bGUgaWYgdGhlIG1pZ3JhdGlvbiB0YXJnZXRzIHY5IG9yIHYxMCBhbmQgaXMgcnVubmluZyBmb3IgYSBub24tdGVzdFxuICAvLyB0YXJnZXQuIFdlIGNhbm5vdCBtaWdyYXRlIHRlc3QgdGFyZ2V0cyBzaW5jZSB0aGV5IGhhdmUgYSBsaW1pdGVkIHNjb3BlXG4gIC8vIChpbiByZWdhcmRzIHRvIHNvdXJjZSBmaWxlcykgYW5kIHRoZXJlZm9yZSB0aGUgSGFtbWVySlMgdXNhZ2UgZGV0ZWN0aW9uIGNhbiBiZSBpbmNvcnJlY3QuXG4gIGVuYWJsZWQgPVxuICAgICAgKHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WOSB8fCB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjEwKSAmJlxuICAgICAgIXRoaXMuY29udGV4dC5pc1Rlc3RUYXJnZXQ7XG5cbiAgcHJpdmF0ZSBfcHJpbnRlciA9IHRzLmNyZWF0ZVByaW50ZXIoKTtcbiAgcHJpdmF0ZSBfaW1wb3J0TWFuYWdlciA9IG5ldyBJbXBvcnRNYW5hZ2VyKHRoaXMuZmlsZVN5c3RlbSwgdGhpcy5fcHJpbnRlcik7XG4gIHByaXZhdGUgX25vZGVGYWlsdXJlczoge25vZGU6IHRzLk5vZGUsIG1lc3NhZ2U6IHN0cmluZ31bXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGN1c3RvbSBIYW1tZXJKUyBldmVudHMgcHJvdmlkZWQgYnkgdGhlIE1hdGVyaWFsIGdlc3R1cmVcbiAgICogY29uZmlnIGFyZSB1c2VkIGluIGEgdGVtcGxhdGUuXG4gICAqL1xuICBwcml2YXRlIF9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHN0YW5kYXJkIEhhbW1lckpTIGV2ZW50cyBhcmUgdXNlZCBpbiBhIHRlbXBsYXRlLiAqL1xuICBwcml2YXRlIF9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgSGFtbWVySlMgaXMgYWNjZXNzZWQgYXQgcnVudGltZS4gKi9cbiAgcHJpdmF0ZSBfdXNlZEluUnVudGltZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGltcG9ydHMgdGhhdCBtYWtlIFwiaGFtbWVyanNcIiBhdmFpbGFibGUgZ2xvYmFsbHkuIFdlIGtlZXAgdHJhY2sgb2YgdGhlc2VcbiAgICogc2luY2Ugd2UgbWlnaHQgbmVlZCB0byByZW1vdmUgdGhlbSBpZiBIYW1tZXIgaXMgbm90IHVzZWQuXG4gICAqL1xuICBwcml2YXRlIF9pbnN0YWxsSW1wb3J0czogdHMuSW1wb3J0RGVjbGFyYXRpb25bXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHJlc29sdmUgdG8gdGhlIGdlc3R1cmUgY29uZmlnIGZyb20gQW5ndWxhciBNYXRlcmlhbC5cbiAgICovXG4gIHByaXZhdGUgX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzOiBJZGVudGlmaWVyUmVmZXJlbmNlW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCByZXNvbHZlIHRvIHRoZSBcIkhBTU1FUl9HRVNUVVJFX0NPTkZJR1wiIHRva2VuIGZyb21cbiAgICogXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuXG4gICAqL1xuICBwcml2YXRlIF9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXM6IElkZW50aWZpZXJSZWZlcmVuY2VbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHJlc29sdmUgdG8gdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbVxuICAgKiBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi5cbiAgICovXG4gIHByaXZhdGUgX2hhbW1lck1vZHVsZVJlZmVyZW5jZXM6IElkZW50aWZpZXJSZWZlcmVuY2VbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHRoYXQgaGF2ZSBiZWVuIGRlbGV0ZWQgZnJvbSBzb3VyY2UgZmlsZXMuIFRoaXMgY2FuIGJlXG4gICAqIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGNlcnRhaW4gaW1wb3J0cyBhcmUgc3RpbGwgdXNlZCBvciBub3QuXG4gICAqL1xuICBwcml2YXRlIF9kZWxldGVkSWRlbnRpZmllcnM6IHRzLklkZW50aWZpZXJbXSA9IFtdO1xuXG4gIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFJlc29sdmVkUmVzb3VyY2UpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2N1c3RvbUV2ZW50c1VzZWRJblRlbXBsYXRlIHx8ICF0aGlzLl9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlKSB7XG4gICAgICBjb25zdCB7c3RhbmRhcmRFdmVudHMsIGN1c3RvbUV2ZW50c30gPSBpc0hhbW1lckpzVXNlZEluVGVtcGxhdGUodGVtcGxhdGUuY29udGVudCk7XG4gICAgICB0aGlzLl9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZSA9IHRoaXMuX2N1c3RvbUV2ZW50c1VzZWRJblRlbXBsYXRlIHx8IGN1c3RvbUV2ZW50cztcbiAgICAgIHRoaXMuX3N0YW5kYXJkRXZlbnRzVXNlZEluVGVtcGxhdGUgPSB0aGlzLl9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlIHx8IHN0YW5kYXJkRXZlbnRzO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tIYW1tZXJJbXBvcnRzKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9yUnVudGltZUhhbW1lclVzYWdlKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9yTWF0ZXJpYWxHZXN0dXJlQ29uZmlnKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9ySGFtbWVyR2VzdHVyZUNvbmZpZ1Rva2VuKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9ySGFtbWVyTW9kdWxlUmVmZXJlbmNlKG5vZGUpO1xuICB9XG5cbiAgcG9zdEFuYWx5c2lzKCk6IHZvaWQge1xuICAgIC8vIFdhbGsgdGhyb3VnaCBhbGwgaGFtbWVyIGNvbmZpZyB0b2tlbiByZWZlcmVuY2VzIGFuZCBjaGVjayBpZiB0aGVyZVxuICAgIC8vIGlzIGEgcG90ZW50aWFsIGN1c3RvbSBnZXN0dXJlIGNvbmZpZyBzZXR1cC5cbiAgICBjb25zdCBoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAgPVxuICAgICAgICB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHRoaXMuX2NoZWNrRm9yQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKHIpKTtcbiAgICBjb25zdCB1c2VkSW5UZW1wbGF0ZSA9IHRoaXMuX3N0YW5kYXJkRXZlbnRzVXNlZEluVGVtcGxhdGUgfHwgdGhpcy5fY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGU7XG5cbiAgICAvKlxuICAgICAgUG9zc2libGUgc2NlbmFyaW9zIGFuZCBob3cgdGhlIG1pZ3JhdGlvbiBzaG91bGQgY2hhbmdlIHRoZSBwcm9qZWN0OlxuICAgICAgICAxLiBXZSBkZXRlY3QgdGhhdCBhIGN1c3RvbSBIYW1tZXJKUyBnZXN0dXJlIGNvbmZpZyBpcyBzZXQgdXA6XG4gICAgICAgICAgICAtIFJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyBpZiBubyBIYW1tZXJKUyBldmVudCBpcyB1c2VkLlxuICAgICAgICAgICAgLSBQcmludCBhIHdhcm5pbmcgYWJvdXQgYW1iaWd1b3VzIGNvbmZpZ3VyYXRpb24gdGhhdCBjYW5ub3QgYmUgaGFuZGxlZCBjb21wbGV0ZWx5XG4gICAgICAgICAgICAgIGlmIHRoZXJlIGFyZSByZWZlcmVuY2VzIHRvIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICAgICAgMi4gV2UgZGV0ZWN0IHRoYXQgSGFtbWVySlMgaXMgb25seSB1c2VkIHByb2dyYW1tYXRpY2FsbHk6XG4gICAgICAgICAgICAtIFJlbW92ZSByZWZlcmVuY2VzIHRvIEdlc3R1cmVDb25maWcgb2YgTWF0ZXJpYWwuXG4gICAgICAgICAgICAtIFJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBcIkhhbW1lck1vZHVsZVwiIGlmIHByZXNlbnQuXG4gICAgICAgIDMuIFdlIGRldGVjdCB0aGF0IHN0YW5kYXJkIEhhbW1lckpTIGV2ZW50cyBhcmUgdXNlZCBpbiBhIHRlbXBsYXRlOlxuICAgICAgICAgICAgLSBTZXQgdXAgdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbSBwbGF0Zm9ybS1icm93c2VyLlxuICAgICAgICAgICAgLSBSZW1vdmUgYWxsIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZXMuXG4gICAgICAgIDQuIFdlIGRldGVjdCB0aGF0IGN1c3RvbSBIYW1tZXJKUyBldmVudHMgcHJvdmlkZWQgYnkgdGhlIE1hdGVyaWFsIGdlc3R1cmVcbiAgICAgICAgICAgY29uZmlnIGFyZSB1c2VkLlxuICAgICAgICAgICAgLSBDb3B5IHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyBpbnRvIHRoZSBhcHAuXG4gICAgICAgICAgICAtIFJld3JpdGUgYWxsIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZXMgdG8gdGhlIG5ld2x5IGNvcGllZCBvbmUuXG4gICAgICAgICAgICAtIFNldCB1cCB0aGUgbmV3IGdlc3R1cmUgY29uZmlnIGluIHRoZSByb290IGFwcCBtb2R1bGUuXG4gICAgICAgICAgICAtIFNldCB1cCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBmcm9tIHBsYXRmb3JtLWJyb3dzZXIuXG4gICAgICAgIDQuIFdlIGRldGVjdCBubyBIYW1tZXJKUyB1c2FnZSBhdCBhbGw6XG4gICAgICAgICAgICAtIFJlbW92ZSBIYW1tZXIgaW1wb3J0c1xuICAgICAgICAgICAgLSBSZW1vdmUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlc1xuICAgICAgICAgICAgLSBSZW1vdmUgSGFtbWVyTW9kdWxlIHNldHVwIGlmIHByZXNlbnQuXG4gICAgICAgICAgICAtIFJlbW92ZSBIYW1tZXIgc2NyaXB0IGltcG9ydHMgaW4gXCJpbmRleC5odG1sXCIgZmlsZXMuXG4gICAgKi9cblxuICAgIGlmIChoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXApIHtcbiAgICAgIC8vIElmIGEgY3VzdG9tIGdlc3R1cmUgY29uZmlnIGlzIHByb3ZpZGVkLCB3ZSBhbHdheXMgYXNzdW1lIHRoYXQgSGFtbWVySlMgaXMgdXNlZC5cbiAgICAgIEhhbW1lckdlc3R1cmVzTWlncmF0aW9uLmdsb2JhbFVzZXNIYW1tZXIgPSB0cnVlO1xuICAgICAgaWYgKCF1c2VkSW5UZW1wbGF0ZSAmJiB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gSWYgdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBldmVudHMgYXJlIG5vdCB1c2VkIGFuZCB3ZSBmb3VuZCBhIGN1c3RvbVxuICAgICAgICAvLyBnZXN0dXJlIGNvbmZpZywgd2UgY2FuIHNhZmVseSByZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWdcbiAgICAgICAgLy8gc2luY2UgZXZlbnRzIHByb3ZpZGVkIGJ5IHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyBhcmUgZ3VhcmFudGVlZCB0byBiZSB1bnVzZWQuXG4gICAgICAgIHRoaXMuX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gICAgICAgIHRoaXMucHJpbnRJbmZvKFxuICAgICAgICAgICAgJ1RoZSBIYW1tZXJKUyB2OSBtaWdyYXRpb24gZm9yIEFuZ3VsYXIgQ29tcG9uZW50cyBkZXRlY3RlZCB0aGF0IEhhbW1lckpTIGlzICcgK1xuICAgICAgICAgICAgJ21hbnVhbGx5IHNldCB1cCBpbiBjb21iaW5hdGlvbiB3aXRoIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSAnICtcbiAgICAgICAgICAgICdjb25maWcuIFRoaXMgdGFyZ2V0IGNhbm5vdCBiZSBtaWdyYXRlZCBjb21wbGV0ZWx5LCBidXQgYWxsIHJlZmVyZW5jZXMgdG8gdGhlICcgK1xuICAgICAgICAgICAgJ2RlcHJlY2F0ZWQgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGhhdmUgYmVlbiByZW1vdmVkLiBSZWFkIG1vcmUgaGVyZTogJyArXG4gICAgICAgICAgICAnaHR0cHM6Ly9naXQuaW8vbmctbWF0ZXJpYWwtdjktaGFtbWVyLWFtYmlndW91cy11c2FnZScpO1xuICAgICAgfSBlbHNlIGlmICh1c2VkSW5UZW1wbGF0ZSAmJiB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gU2luY2UgdGhlcmUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcsIGFuZCB3ZSBkZXRlY3RlZFxuICAgICAgICAvLyB1c2FnZSBvZiBhIGdlc3R1cmUgZXZlbnQgdGhhdCBjb3VsZCBiZSBwcm92aWRlZCBieSBBbmd1bGFyIE1hdGVyaWFsLCB3ZSAqY2Fubm90KlxuICAgICAgICAvLyBhdXRvbWF0aWNhbGx5IHJlbW92ZSByZWZlcmVuY2VzLiBUaGlzIGlzIGJlY2F1c2Ugd2UgZG8gKm5vdCoga25vdyB3aGV0aGVyIHRoZVxuICAgICAgICAvLyBldmVudCBpcyBhY3R1YWxseSBwcm92aWRlZCBieSB0aGUgY3VzdG9tIGNvbmZpZyBvciBieSB0aGUgTWF0ZXJpYWwgY29uZmlnLlxuICAgICAgICB0aGlzLnByaW50SW5mbyhcbiAgICAgICAgICAgICdUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIENvbXBvbmVudHMgZGV0ZWN0ZWQgdGhhdCBIYW1tZXJKUyBpcyAnICtcbiAgICAgICAgICAgICdtYW51YWxseSBzZXQgdXAgaW4gY29tYmluYXRpb24gd2l0aCByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgJyArXG4gICAgICAgICAgICAnY29uZmlnLiBUaGlzIHRhcmdldCBjYW5ub3QgYmUgbWlncmF0ZWQgY29tcGxldGVseS4gUGxlYXNlIG1hbnVhbGx5IHJlbW92ZSAnICtcbiAgICAgICAgICAgICdyZWZlcmVuY2VzIHRvIHRoZSBkZXByZWNhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuIFJlYWQgbW9yZSBoZXJlOiAnICtcbiAgICAgICAgICAgICdodHRwczovL2dpdC5pby9uZy1tYXRlcmlhbC12OS1oYW1tZXItYW1iaWd1b3VzLXVzYWdlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLl91c2VkSW5SdW50aW1lIHx8IHVzZWRJblRlbXBsYXRlKSB7XG4gICAgICAvLyBXZSBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgSGFtbWVyIGlzIHVzZWQgZ2xvYmFsbHkuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugd2VcbiAgICAgIC8vIHdhbnQgdG8gb25seSByZW1vdmUgSGFtbWVyIGZyb20gdGhlIFwicGFja2FnZS5qc29uXCIgaWYgaXQgaXMgbm90IHVzZWQgaW4gYW55IHByb2plY3RcbiAgICAgIC8vIHRhcmdldC4gSnVzdCBiZWNhdXNlIGl0IGlzbid0IHVzZWQgaW4gb25lIHRhcmdldCBkb2Vzbid0IG1lYW4gdGhhdCB3ZSBjYW4gc2FmZWx5XG4gICAgICAvLyByZW1vdmUgdGhlIGRlcGVuZGVuY3kuXG4gICAgICBIYW1tZXJHZXN0dXJlc01pZ3JhdGlvbi5nbG9iYWxVc2VzSGFtbWVyID0gdHJ1ZTtcblxuICAgICAgLy8gSWYgaGFtbWVyIGlzIG9ubHkgdXNlZCBhdCBydW50aW1lLCB3ZSBkb24ndCBuZWVkIHRoZSBnZXN0dXJlIGNvbmZpZyBvciBcIkhhbW1lck1vZHVsZVwiXG4gICAgICAvLyBhbmQgY2FuIHJlbW92ZSBpdCAoYWxvbmcgd2l0aCB0aGUgaGFtbWVyIGNvbmZpZyB0b2tlbiBpbXBvcnQgaWYgbm8gbG9uZ2VyIG5lZWRlZCkuXG4gICAgICBpZiAoIXVzZWRJblRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUhhbW1lck1vZHVsZVJlZmVyZW5jZXMoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSAmJiAhdGhpcy5fY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy5fc2V0dXBIYW1tZXJXaXRoU3RhbmRhcmRFdmVudHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NldHVwSGFtbWVyV2l0aEN1c3RvbUV2ZW50cygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZW1vdmVIYW1tZXJTZXR1cCgpO1xuICAgIH1cblxuICAgIC8vIFJlY29yZCB0aGUgY2hhbmdlcyBjb2xsZWN0ZWQgaW4gdGhlIGltcG9ydCBtYW5hZ2VyLiBDaGFuZ2VzIG5lZWQgdG8gYmUgYXBwbGllZFxuICAgIC8vIG9uY2UgdGhlIGltcG9ydCBtYW5hZ2VyIHJlZ2lzdGVyZWQgYWxsIGltcG9ydCBtb2RpZmljYXRpb25zLiBUaGlzIGF2b2lkcyBjb2xsaXNpb25zLlxuICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIucmVjb3JkQ2hhbmdlcygpO1xuXG4gICAgLy8gQ3JlYXRlIG1pZ3JhdGlvbiBmYWlsdXJlcyB0aGF0IHdpbGwgYmUgcHJpbnRlZCBieSB0aGUgdXBkYXRlLXRvb2wgb24gbWlncmF0aW9uXG4gICAgLy8gY29tcGxldGlvbi4gV2UgbmVlZCBzcGVjaWFsIGxvZ2ljIGZvciB1cGRhdGluZyBmYWlsdXJlIHBvc2l0aW9ucyB0byByZWZsZWN0XG4gICAgLy8gdGhlIG5ldyBzb3VyY2UgZmlsZSBhZnRlciBtb2RpZmljYXRpb25zIGZyb20gdGhlIGltcG9ydCBtYW5hZ2VyLlxuICAgIHRoaXMuZmFpbHVyZXMucHVzaCguLi50aGlzLl9jcmVhdGVNaWdyYXRpb25GYWlsdXJlcygpKTtcblxuICAgIC8vIFRoZSB0ZW1wbGF0ZSBjaGVjayBmb3IgSGFtbWVySlMgZXZlbnRzIGlzIG5vdCBjb21wbGV0ZWx5IHJlbGlhYmxlIGFzIHRoZSBldmVudFxuICAgIC8vIG91dHB1dCBjb3VsZCBhbHNvIGJlIGZyb20gYSBjb21wb25lbnQgaGF2aW5nIGFuIG91dHB1dCBuYW1lZCBzaW1pbGFybHkgdG8gYSBrbm93blxuICAgIC8vIGhhbW1lcmpzIGV2ZW50IChlLmcuIFwiQE91dHB1dCgpIHNsaWRlXCIpLiBUaGUgdXNhZ2UgaXMgdGhlcmVmb3JlIHNvbWV3aGF0IGFtYmlndW91c1xuICAgIC8vIGFuZCB3ZSB3YW50IHRvIHByaW50IGEgbWVzc2FnZSB0aGF0IGRldmVsb3BlcnMgbWlnaHQgYmUgYWJsZSB0byByZW1vdmUgSGFtbWVyIG1hbnVhbGx5LlxuICAgIGlmICghaGFzQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwICYmICF0aGlzLl91c2VkSW5SdW50aW1lICYmIHVzZWRJblRlbXBsYXRlKSB7XG4gICAgICB0aGlzLnByaW50SW5mbyhcbiAgICAgICAgICAnVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBDb21wb25lbnRzIG1pZ3JhdGVkIHRoZSAnICtcbiAgICAgICAgICAncHJvamVjdCB0byBrZWVwIEhhbW1lckpTIGluc3RhbGxlZCwgYnV0IGRldGVjdGVkIGFtYmlndW91cyB1c2FnZSBvZiBIYW1tZXJKUy4gUGxlYXNlICcgK1xuICAgICAgICAgICdtYW51YWxseSBjaGVjayBpZiB5b3UgY2FuIHJlbW92ZSBIYW1tZXJKUyBmcm9tIHlvdXIgYXBwbGljYXRpb24uIE1vcmUgZGV0YWlsczogJyArXG4gICAgICAgICAgJ2h0dHBzOi8vZ2l0LmlvL25nLW1hdGVyaWFsLXY5LWhhbW1lci1hbWJpZ3VvdXMtdXNhZ2UnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB1cCB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnIGluIHRoZSBjdXJyZW50IHByb2plY3QuIFRvIGFjaGlldmUgdGhpcywgdGhlXG4gICAqIGZvbGxvd2luZyBzdGVwcyBhcmUgcGVyZm9ybWVkOlxuICAgKiAgIDEpIENyZWF0ZSBjb3B5IG9mIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAqICAgMikgUmV3cml0ZSBhbGwgcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyB0byB0aGVcbiAgICogICAgICBuZXcgZ2VzdHVyZSBjb25maWcuXG4gICAqICAgMykgU2V0dXAgdGhlIEhBTU1FUl9HRVNUVVJFX0NPTkZJRyBpbiB0aGUgcm9vdCBhcHAgbW9kdWxlIChpZiBub3QgZG9uZSBhbHJlYWR5KS5cbiAgICogICA0KSBTZXR1cCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpbiB0aGUgcm9vdCBhcHAgbW9kdWxlIChpZiBub3QgZG9uZSBhbHJlYWR5KS5cbiAgICovXG4gIHByaXZhdGUgX3NldHVwSGFtbWVyV2l0aEN1c3RvbUV2ZW50cygpIHtcbiAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5jb250ZXh0LnByb2plY3Q7XG4gICAgY29uc3Qgc291cmNlUm9vdCA9IGRldmtpdE5vcm1hbGl6ZShwcm9qZWN0LnNvdXJjZVJvb3QgfHwgcHJvamVjdC5yb290KTtcbiAgICBjb25zdCBuZXdDb25maWdQYXRoID1cbiAgICAgICAgZGV2a2l0Sm9pbihzb3VyY2VSb290LCB0aGlzLl9nZXRBdmFpbGFibGVHZXN0dXJlQ29uZmlnRmlsZU5hbWUoc291cmNlUm9vdCkpO1xuXG4gICAgLy8gQ29weSBnZXN0dXJlIGNvbmZpZyB0ZW1wbGF0ZSBpbnRvIHRoZSBDTEkgcHJvamVjdC5cbiAgICB0aGlzLmZpbGVTeXN0ZW0uY3JlYXRlKFxuICAgICAgICBuZXdDb25maWdQYXRoLCByZWFkRmlsZVN5bmMocmVxdWlyZS5yZXNvbHZlKEdFU1RVUkVfQ09ORklHX1RFTVBMQVRFX1BBVEgpLCAndXRmOCcpKTtcblxuICAgIC8vIFJlcGxhY2UgYWxsIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZXMgdG8gcmVzb2x2ZSB0byB0aGVcbiAgICAvLyBuZXdseSBjb3BpZWQgZ2VzdHVyZSBjb25maWcuXG4gICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuZm9yRWFjaChcbiAgICAgICAgaSA9PiB0aGlzLl9yZXBsYWNlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZShcbiAgICAgICAgICAgIGksIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsXG4gICAgICAgICAgICBnZXRNb2R1bGVTcGVjaWZpZXIobmV3Q29uZmlnUGF0aCwgaS5ub2RlLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZSkpKTtcblxuICAgIC8vIFNldHVwIHRoZSBnZXN0dXJlIGNvbmZpZyBwcm92aWRlciBhbmQgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaW4gdGhlIHJvb3QgbW9kdWxlXG4gICAgLy8gaWYgbm90IGRvbmUgYWxyZWFkeS4gVGhlIFwiSGFtbWVyTW9kdWxlXCIgaXMgbmVlZGVkIGluIHY5IHNpbmNlIGl0IGVuYWJsZXMgdGhlXG4gICAgLy8gSGFtbWVyIGV2ZW50IHBsdWdpbiB0aGF0IHdhcyBwcmV2aW91c2x5IGVuYWJsZWQgYnkgZGVmYXVsdCBpbiB2OC5cbiAgICB0aGlzLl9zZXR1cE5ld0dlc3R1cmVDb25maWdJblJvb3RNb2R1bGUobmV3Q29uZmlnUGF0aCk7XG4gICAgdGhpcy5fc2V0dXBIYW1tZXJNb2R1bGVJblJvb3RNb2R1bGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVwIHRoZSBzdGFuZGFyZCBoYW1tZXIgbW9kdWxlIGluIHRoZSBwcm9qZWN0IGFuZCByZW1vdmVzIGFsbFxuICAgKiByZWZlcmVuY2VzIHRvIHRoZSBkZXByZWNhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAqL1xuICBwcml2YXRlIF9zZXR1cEhhbW1lcldpdGhTdGFuZGFyZEV2ZW50cygpIHtcbiAgICAvLyBTZXR1cCB0aGUgSGFtbWVyTW9kdWxlLiBUaGUgSGFtbWVyTW9kdWxlIGVuYWJsZXMgc3VwcG9ydCBmb3JcbiAgICAvLyB0aGUgc3RhbmRhcmQgSGFtbWVySlMgZXZlbnRzLlxuICAgIHRoaXMuX3NldHVwSGFtbWVyTW9kdWxlSW5Sb290TW9kdWxlKCk7XG4gICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIEhhbW1lciBmcm9tIHRoZSBjdXJyZW50IHByb2plY3QuIFRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHBlcmZvcm1lZDpcbiAgICogICAxKSBEZWxldGUgYWxsIFR5cGVTY3JpcHQgaW1wb3J0cyB0byBcImhhbW1lcmpzXCIuXG4gICAqICAgMikgUmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAqICAgMykgUmVtb3ZlIFwiaGFtbWVyanNcIiBmcm9tIGFsbCBpbmRleCBIVE1MIGZpbGVzIG9mIHRoZSBjdXJyZW50IHByb2plY3QuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJTZXR1cCgpIHtcbiAgICB0aGlzLl9pbnN0YWxsSW1wb3J0cy5mb3JFYWNoKGkgPT4gdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVJbXBvcnRCeURlY2xhcmF0aW9uKGkpKTtcblxuICAgIHRoaXMuX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gICAgdGhpcy5fcmVtb3ZlSGFtbWVyTW9kdWxlUmVmZXJlbmNlcygpO1xuICAgIHRoaXMuX3JlbW92ZUhhbW1lckZyb21JbmRleEZpbGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBnZXN0dXJlIGNvbmZpZyBzZXR1cCBieSBkZWxldGluZyBhbGwgZm91bmQgcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhclxuICAgKiBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy4gQWRkaXRpb25hbGx5LCB1bnVzZWQgaW1wb3J0cyB0byB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnXG4gICAqIHRva2VuIGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIgd2lsbCBiZSByZW1vdmVkIGFzIHdlbGwuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVNYXRlcmlhbEdlc3R1cmVDb25maWdTZXR1cCgpIHtcbiAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5mb3JFYWNoKHIgPT4gdGhpcy5fcmVtb3ZlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZShyKSk7XG5cbiAgICB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuZm9yRWFjaChyID0+IHtcbiAgICAgIGlmIChyLmlzSW1wb3J0KSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZUhhbW1lckNvbmZpZ1Rva2VuSW1wb3J0SWZVbnVzZWQocik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogUmVtb3ZlcyBhbGwgcmVmZXJlbmNlcyB0byB0aGUgXCJIYW1tZXJNb2R1bGVcIiBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLiAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJNb2R1bGVSZWZlcmVuY2VzKCkge1xuICAgIHRoaXMuX2hhbW1lck1vZHVsZVJlZmVyZW5jZXMuZm9yRWFjaCgoe25vZGUsIGlzSW1wb3J0LCBpbXBvcnREYXRhfSkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdCh0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShzb3VyY2VGaWxlLmZpbGVOYW1lKSk7XG5cbiAgICAgIC8vIE9ubHkgcmVtb3ZlIHRoZSBpbXBvcnQgZm9yIHRoZSBIYW1tZXJNb2R1bGUgaWYgdGhlIG1vZHVsZSBoYXMgYmVlbiBhY2Nlc3NlZFxuICAgICAgLy8gdGhyb3VnaCBhIG5vbi1uYW1lc3BhY2VkIGlkZW50aWZpZXIgYWNjZXNzLlxuICAgICAgaWYgKCFpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGUpKSB7XG4gICAgICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICAgICAgc291cmNlRmlsZSwgSEFNTUVSX01PRFVMRV9OQU1FLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3IgcmVmZXJlbmNlcyBmcm9tIHdpdGhpbiBhbiBpbXBvcnQsIHdlIGRvIG5vdCBuZWVkIHRvIGRvIGFueXRoaW5nIG90aGVyIHRoYW5cbiAgICAgIC8vIHJlbW92aW5nIHRoZSBpbXBvcnQuIEZvciBvdGhlciByZWZlcmVuY2VzLCB3ZSByZW1vdmUgdGhlIGltcG9ydCBhbmQgdGhlIGFjdHVhbFxuICAgICAgLy8gaWRlbnRpZmllciBpbiB0aGUgbW9kdWxlIGltcG9ydHMuXG4gICAgICBpZiAoaXNJbXBvcnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpcyByZWZlcmVuY2VkIHdpdGhpbiBhbiBhcnJheSBsaXRlcmFsLCB3ZSBjYW5cbiAgICAgIC8vIHJlbW92ZSB0aGUgZWxlbWVudCBlYXNpbHkuIE90aGVyd2lzZSBpZiBpdCdzIG91dHNpZGUgb2YgYW4gYXJyYXkgbGl0ZXJhbCxcbiAgICAgIC8vIHdlIG5lZWQgdG8gcmVwbGFjZSB0aGUgcmVmZXJlbmNlIHdpdGggYW4gZW1wdHkgb2JqZWN0IGxpdGVyYWwgdy8gdG9kbyB0b1xuICAgICAgLy8gbm90IGJyZWFrIHRoZSBhcHBsaWNhdGlvbi5cbiAgICAgIGlmICh0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24obm9kZS5wYXJlbnQpKSB7XG4gICAgICAgIC8vIFJlbW92ZXMgdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbSB0aGUgcGFyZW50IGFycmF5IGV4cHJlc3Npb24uIFJlbW92ZXNcbiAgICAgICAgLy8gdGhlIHRyYWlsaW5nIGNvbW1hIHRva2VuIGlmIHByZXNlbnQuXG4gICAgICAgIHJlbW92ZUVsZW1lbnRGcm9tQXJyYXlFeHByZXNzaW9uKG5vZGUsIHJlY29yZGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlY29yZGVyLnJlbW92ZShub2RlLmdldFN0YXJ0KCksIG5vZGUuZ2V0V2lkdGgoKSk7XG4gICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5vZGUuZ2V0U3RhcnQoKSwgYC8qIFRPRE86IHJlbW92ZSAqLyB7fWApO1xuICAgICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7XG4gICAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIGRlbGV0ZSByZWZlcmVuY2UgdG8gXCJIYW1tZXJNb2R1bGVcIi4nLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZ1xuICAgKiB0b2tlbiBmcm9tIHBsYXRmb3JtLWJyb3dzZXIuIElmIHNvLCBrZWVwcyB0cmFjayBvZiB0aGUgcmVmZXJlbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JIYW1tZXJHZXN0dXJlQ29uZmlnVG9rZW4obm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkpIHtcbiAgICAgIGNvbnN0IGltcG9ydERhdGEgPSBnZXRJbXBvcnRPZklkZW50aWZpZXIobm9kZSwgdGhpcy50eXBlQ2hlY2tlcik7XG4gICAgICBpZiAoaW1wb3J0RGF0YSAmJiBpbXBvcnREYXRhLnN5bWJvbE5hbWUgPT09IEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSAmJlxuICAgICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZSA9PT0gSEFNTUVSX0NPTkZJR19UT0tFTl9NT0RVTEUpIHtcbiAgICAgICAgdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnB1c2goXG4gICAgICAgICAgICB7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnQ6IHRzLmlzSW1wb3J0U3BlY2lmaWVyKG5vZGUucGFyZW50KX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIEhhbW1lck1vZHVsZSBmcm9tXG4gICAqIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLiBJZiBzbywga2VlcHMgdHJhY2sgb2YgdGhlIHJlZmVyZW5jZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9ySGFtbWVyTW9kdWxlUmVmZXJlbmNlKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICBjb25zdCBpbXBvcnREYXRhID0gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGUsIHRoaXMudHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKGltcG9ydERhdGEgJiYgaW1wb3J0RGF0YS5zeW1ib2xOYW1lID09PSBIQU1NRVJfTU9EVUxFX05BTUUgJiZcbiAgICAgICAgICBpbXBvcnREYXRhLm1vZHVsZU5hbWUgPT09IEhBTU1FUl9NT0RVTEVfSU1QT1JUKSB7XG4gICAgICAgIHRoaXMuX2hhbW1lck1vZHVsZVJlZmVyZW5jZXMucHVzaChcbiAgICAgICAgICAgIHtub2RlLCBpbXBvcnREYXRhLCBpc0ltcG9ydDogdHMuaXNJbXBvcnRTcGVjaWZpZXIobm9kZS5wYXJlbnQpfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBpcyBhbiBpbXBvcnQgdG8gdGhlIEhhbW1lckpTIHBhY2thZ2UuIEltcG9ydHMgdG9cbiAgICogSGFtbWVySlMgd2hpY2ggbG9hZCBzcGVjaWZpYyBzeW1ib2xzIGZyb20gdGhlIHBhY2thZ2UgYXJlIGNvbnNpZGVyZWQgYXNcbiAgICogcnVudGltZSB1c2FnZSBvZiBIYW1tZXIuIGUuZy4gYGltcG9ydCB7U3ltYm9sfSBmcm9tIFwiaGFtbWVyanNcIjtgLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tIYW1tZXJJbXBvcnRzKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJbXBvcnREZWNsYXJhdGlvbihub2RlKSAmJiB0cy5pc1N0cmluZ0xpdGVyYWwobm9kZS5tb2R1bGVTcGVjaWZpZXIpICYmXG4gICAgICAgIG5vZGUubW9kdWxlU3BlY2lmaWVyLnRleHQgPT09IEhBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSKSB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBhbiBpbXBvcnQgdG8gSGFtbWVySlMgdGhhdCBpbXBvcnRzIHN5bWJvbHMsIG9yIGlzIG5hbWVzcGFjZWRcbiAgICAgIC8vIChlLmcuIFwiaW1wb3J0IHtBLCBCfSBmcm9tIC4uLlwiIG9yIFwiaW1wb3J0ICogYXMgaGFtbWVyIGZyb20gLi4uXCIpLCB0aGVuIHdlXG4gICAgICAvLyBhc3N1bWUgdGhhdCBzb21lIGV4cG9ydHMgYXJlIHVzZWQgYXQgcnVudGltZS5cbiAgICAgIGlmIChub2RlLmltcG9ydENsYXVzZSAmJlxuICAgICAgICAgICEobm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncyAmJiB0cy5pc05hbWVkSW1wb3J0cyhub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSAmJlxuICAgICAgICAgICAgbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cy5sZW5ndGggPT09IDApKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5faW5zdGFsbEltcG9ydHMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGFjY2Vzc2VzIHRoZSBnbG9iYWwgXCJIYW1tZXJcIiBzeW1ib2wgYXQgcnVudGltZS4gSWYgc28sXG4gICAqIHRoZSBtaWdyYXRpb24gcnVsZSBzdGF0ZSB3aWxsIGJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGF0IEhhbW1lciBpcyB1c2VkIGF0IHJ1bnRpbWUuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0ZvclJ1bnRpbWVIYW1tZXJVc2FnZShub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRoaXMuX3VzZWRJblJ1bnRpbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZXRlY3RzIHVzYWdlcyBvZiBcIndpbmRvdy5IYW1tZXJcIi5cbiAgICBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZSkgJiYgbm9kZS5uYW1lLnRleHQgPT09ICdIYW1tZXInKSB7XG4gICAgICBjb25zdCBvcmlnaW5FeHByID0gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihvcmlnaW5FeHByKSAmJiBvcmlnaW5FeHByLnRleHQgPT09ICd3aW5kb3cnKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIERldGVjdHMgdXNhZ2VzIG9mIFwid2luZG93WydIYW1tZXInXVwiLlxuICAgIGlmICh0cy5pc0VsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKG5vZGUpICYmIHRzLmlzU3RyaW5nTGl0ZXJhbChub2RlLmFyZ3VtZW50RXhwcmVzc2lvbikgJiZcbiAgICAgICAgbm9kZS5hcmd1bWVudEV4cHJlc3Npb24udGV4dCA9PT0gJ0hhbW1lcicpIHtcbiAgICAgIGNvbnN0IG9yaWdpbkV4cHIgPSB1bndyYXBFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gICAgICBpZiAodHMuaXNJZGVudGlmaWVyKG9yaWdpbkV4cHIpICYmIG9yaWdpbkV4cHIudGV4dCA9PT0gJ3dpbmRvdycpIHtcbiAgICAgICAgdGhpcy5fdXNlZEluUnVudGltZSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlcyB1c2FnZXMgb2YgcGxhaW4gaWRlbnRpZmllciB3aXRoIHRoZSBuYW1lIFwiSGFtbWVyXCIuIFRoZXNlIHVzYWdlXG4gICAgLy8gYXJlIHZhbGlkIGlmIHRoZXkgcmVzb2x2ZSB0byBcIkB0eXBlcy9oYW1tZXJqc1wiLiBlLmcuIFwibmV3IEhhbW1lcihteUVsZW1lbnQpXCIuXG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSAmJiBub2RlLnRleHQgPT09ICdIYW1tZXInICYmXG4gICAgICAgICF0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLnBhcmVudCkgJiYgIXRzLmlzRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24obm9kZS5wYXJlbnQpKSB7XG4gICAgICBjb25zdCBzeW1ib2wgPSB0aGlzLl9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlKTtcbiAgICAgIGlmIChzeW1ib2wgJiYgc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24gJiZcbiAgICAgICAgICBzeW1ib2wudmFsdWVEZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUuaW5jbHVkZXMoJ0B0eXBlcy9oYW1tZXJqcycpKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgcmVmZXJlbmNlcyB0aGUgZ2VzdHVyZSBjb25maWcgZnJvbSBBbmd1bGFyIE1hdGVyaWFsLlxuICAgKiBJZiBzbywgd2Uga2VlcCB0cmFjayBvZiB0aGUgZm91bmQgc3ltYm9sIHJlZmVyZW5jZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9yTWF0ZXJpYWxHZXN0dXJlQ29uZmlnKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICBjb25zdCBpbXBvcnREYXRhID0gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGUsIHRoaXMudHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKGltcG9ydERhdGEgJiYgaW1wb3J0RGF0YS5zeW1ib2xOYW1lID09PSBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FICYmXG4gICAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lLnN0YXJ0c1dpdGgoJ0Bhbmd1bGFyL21hdGVyaWFsLycpKSB7XG4gICAgICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLnB1c2goXG4gICAgICAgICAgICB7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnQ6IHRzLmlzSW1wb3J0U3BlY2lmaWVyKG5vZGUucGFyZW50KX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIEhhbW1lciBnZXN0dXJlIGNvbmZpZyB0b2tlbiByZWZlcmVuY2UgaXMgcGFydCBvZiBhblxuICAgKiBBbmd1bGFyIHByb3ZpZGVyIGRlZmluaXRpb24gdGhhdCBzZXRzIHVwIGEgY3VzdG9tIGdlc3R1cmUgY29uZmlnLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAodG9rZW5SZWY6IElkZW50aWZpZXJSZWZlcmVuY2UpOiBib29sZWFuIHtcbiAgICAvLyBXYWxrIHVwIHRoZSB0cmVlIHRvIGxvb2sgZm9yIGEgcGFyZW50IHByb3BlcnR5IGFzc2lnbm1lbnQgb2YgdGhlXG4gICAgLy8gcmVmZXJlbmNlIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWcgdG9rZW4uXG4gICAgbGV0IHByb3BlcnR5QXNzaWdubWVudDogdHMuTm9kZSA9IHRva2VuUmVmLm5vZGU7XG4gICAgd2hpbGUgKHByb3BlcnR5QXNzaWdubWVudCAmJiAhdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcGVydHlBc3NpZ25tZW50KSkge1xuICAgICAgcHJvcGVydHlBc3NpZ25tZW50ID0gcHJvcGVydHlBc3NpZ25tZW50LnBhcmVudDtcbiAgICB9XG5cbiAgICBpZiAoIXByb3BlcnR5QXNzaWdubWVudCB8fCAhdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcGVydHlBc3NpZ25tZW50KSB8fFxuICAgICAgICBnZXRQcm9wZXJ0eU5hbWVUZXh0KHByb3BlcnR5QXNzaWdubWVudC5uYW1lKSAhPT0gJ3Byb3ZpZGUnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgb2JqZWN0TGl0ZXJhbEV4cHIgPSBwcm9wZXJ0eUFzc2lnbm1lbnQucGFyZW50O1xuICAgIGNvbnN0IG1hdGNoaW5nSWRlbnRpZmllcnMgPSBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzKG9iamVjdExpdGVyYWxFeHByLCB0cy5pc0lkZW50aWZpZXIpO1xuXG4gICAgLy8gV2UgbmFpdmVseSBhc3N1bWUgdGhhdCBpZiB0aGVyZSBpcyBhIHJlZmVyZW5jZSB0byB0aGUgXCJHZXN0dXJlQ29uZmlnXCIgZXhwb3J0XG4gICAgLy8gZnJvbSBBbmd1bGFyIE1hdGVyaWFsIGluIHRoZSBwcm92aWRlciBsaXRlcmFsLCB0aGF0IHRoZSBwcm92aWRlciBzZXRzIHVwIHRoZVxuICAgIC8vIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAgcmV0dXJuICF0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5zb21lKHIgPT4gbWF0Y2hpbmdJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGFuIGF2YWlsYWJsZSBmaWxlIG5hbWUgZm9yIHRoZSBnZXN0dXJlIGNvbmZpZyB3aGljaCBzaG91bGRcbiAgICogYmUgc3RvcmVkIGluIHRoZSBzcGVjaWZpZWQgZmlsZSBwYXRoLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0QXZhaWxhYmxlR2VzdHVyZUNvbmZpZ0ZpbGVOYW1lKHNvdXJjZVJvb3Q6IERldmtpdFBhdGgpIHtcbiAgICBpZiAoIXRoaXMuZmlsZVN5c3RlbS5leGlzdHMoZGV2a2l0Sm9pbihzb3VyY2VSb290LCBgJHtHRVNUVVJFX0NPTkZJR19GSUxFX05BTUV9LnRzYCkpKSB7XG4gICAgICByZXR1cm4gYCR7R0VTVFVSRV9DT05GSUdfRklMRV9OQU1FfS50c2A7XG4gICAgfVxuXG4gICAgbGV0IHBvc3NpYmxlTmFtZSA9IGAke0dFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRX0tYDtcbiAgICBsZXQgaW5kZXggPSAxO1xuICAgIHdoaWxlICh0aGlzLmZpbGVTeXN0ZW0uZXhpc3RzKGRldmtpdEpvaW4oc291cmNlUm9vdCwgYCR7cG9zc2libGVOYW1lfS0ke2luZGV4fS50c2ApKSkge1xuICAgICAgaW5kZXgrKztcbiAgICB9XG4gICAgcmV0dXJuIGAke3Bvc3NpYmxlTmFtZSArIGluZGV4fS50c2A7XG4gIH1cblxuICAvKiogUmVwbGFjZXMgYSBnaXZlbiBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2Ugd2l0aCBhIG5ldyBpbXBvcnQuICovXG4gIHByaXZhdGUgX3JlcGxhY2VHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKFxuICAgICAge25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0fTogSWRlbnRpZmllclJlZmVyZW5jZSwgc3ltYm9sTmFtZTogc3RyaW5nLFxuICAgICAgbW9kdWxlU3BlY2lmaWVyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdCh0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShzb3VyY2VGaWxlLmZpbGVOYW1lKSk7XG5cbiAgICAvLyBMaXN0IG9mIGFsbCBpZGVudGlmaWVycyByZWZlcnJpbmcgdG8gdGhlIGdlc3R1cmUgY29uZmlnIGluIHRoZSBjdXJyZW50IGZpbGUuIFRoaXNcbiAgICAvLyBhbGxvd3MgdXMgdG8gYWRkIGFuIGltcG9ydCBmb3IgdGhlIGNvcGllZCBnZXN0dXJlIGNvbmZpZ3VyYXRpb24gd2l0aG91dCBnZW5lcmF0aW5nIGFcbiAgICAvLyBuZXcgaWRlbnRpZmllciBmb3IgdGhlIGltcG9ydCB0byBhdm9pZCBjb2xsaXNpb25zLiBpLmUuIFwiR2VzdHVyZUNvbmZpZ18xXCIuIFRoZSBpbXBvcnRcbiAgICAvLyBtYW5hZ2VyIGNoZWNrcyBmb3IgcG9zc2libGUgbmFtZSBjb2xsaXNpb25zLCBidXQgaXMgYWJsZSB0byBpZ25vcmUgc3BlY2lmaWMgaWRlbnRpZmllcnMuXG4gICAgLy8gV2UgdXNlIHRoaXMgdG8gaWdub3JlIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBvcmlnaW5hbCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLFxuICAgIC8vIGJlY2F1c2UgdGhlc2Ugd2lsbCBiZSByZXBsYWNlZCBhbmQgdGhlcmVmb3JlIHdpbGwgbm90IGludGVyZmVyZS5cbiAgICBjb25zdCBnZXN0dXJlSWRlbnRpZmllcnNJbkZpbGUgPSB0aGlzLl9nZXRHZXN0dXJlQ29uZmlnSWRlbnRpZmllcnNPZkZpbGUoc291cmNlRmlsZSk7XG5cbiAgICAvLyBJZiB0aGUgcGFyZW50IG9mIHRoZSBpZGVudGlmaWVyIGlzIGFjY2Vzc2VkIHRocm91Z2ggYSBuYW1lc3BhY2UsIHdlIGNhbiBqdXN0XG4gICAgLy8gaW1wb3J0IHRoZSBuZXcgZ2VzdHVyZSBjb25maWcgd2l0aG91dCByZXdyaXRpbmcgdGhlIGltcG9ydCBkZWNsYXJhdGlvbiBiZWNhdXNlXG4gICAgLy8gdGhlIGNvbmZpZyBoYXMgYmVlbiBpbXBvcnRlZCB0aHJvdWdoIGEgbmFtZXNwYWNlZCBpbXBvcnQuXG4gICAgaWYgKGlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZSkpIHtcbiAgICAgIGNvbnN0IG5ld0V4cHJlc3Npb24gPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgICBzb3VyY2VGaWxlLCBzeW1ib2xOYW1lLCBtb2R1bGVTcGVjaWZpZXIsIGZhbHNlLCBnZXN0dXJlSWRlbnRpZmllcnNJbkZpbGUpO1xuXG4gICAgICByZWNvcmRlci5yZW1vdmUobm9kZS5wYXJlbnQuZ2V0U3RhcnQoKSwgbm9kZS5wYXJlbnQuZ2V0V2lkdGgoKSk7XG4gICAgICByZWNvcmRlci5pbnNlcnRSaWdodChub2RlLnBhcmVudC5nZXRTdGFydCgpLCB0aGlzLl9wcmludE5vZGUobmV3RXhwcmVzc2lvbiwgc291cmNlRmlsZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIERlbGV0ZSB0aGUgb2xkIGltcG9ydCB0byB0aGUgXCJHZXN0dXJlQ29uZmlnXCIuXG4gICAgdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoXG4gICAgICAgIHNvdXJjZUZpbGUsIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsIGltcG9ydERhdGEubW9kdWxlTmFtZSk7XG5cbiAgICAvLyBJZiB0aGUgY3VycmVudCByZWZlcmVuY2UgaXMgbm90IGZyb20gaW5zaWRlIG9mIGEgaW1wb3J0LCB3ZSBuZWVkIHRvIGFkZCBhIG5ld1xuICAgIC8vIGltcG9ydCB0byB0aGUgY29waWVkIGdlc3R1cmUgY29uZmlnIGFuZCByZXBsYWNlIHRoZSBpZGVudGlmaWVyLiBGb3IgcmVmZXJlbmNlc1xuICAgIC8vIHdpdGhpbiBhbiBpbXBvcnQsIHdlIGRvIG5vdGhpbmcgYnV0IHJlbW92aW5nIHRoZSBhY3R1YWwgaW1wb3J0LiBUaGlzIGFsbG93cyB1c1xuICAgIC8vIHRvIHJlbW92ZSB1bnVzZWQgaW1wb3J0cyB0byB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAgaWYgKCFpc0ltcG9ydCkge1xuICAgICAgY29uc3QgbmV3RXhwcmVzc2lvbiA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICAgIHNvdXJjZUZpbGUsIHN5bWJvbE5hbWUsIG1vZHVsZVNwZWNpZmllciwgZmFsc2UsIGdlc3R1cmVJZGVudGlmaWVyc0luRmlsZSk7XG5cbiAgICAgIHJlY29yZGVyLnJlbW92ZShub2RlLmdldFN0YXJ0KCksIG5vZGUuZ2V0V2lkdGgoKSk7XG4gICAgICByZWNvcmRlci5pbnNlcnRSaWdodChub2RlLmdldFN0YXJ0KCksIHRoaXMuX3ByaW50Tm9kZShuZXdFeHByZXNzaW9uLCBzb3VyY2VGaWxlKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBnaXZlbiBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2UgYW5kIGl0cyBjb3JyZXNwb25kaW5nIGltcG9ydCBmcm9tXG4gICAqIGl0cyBjb250YWluaW5nIHNvdXJjZSBmaWxlLiBJbXBvcnRzIHdpbGwgYmUgYWx3YXlzIHJlbW92ZWQsIGJ1dCBpbiBzb21lIGNhc2VzLFxuICAgKiB3aGVyZSBpdCdzIG5vdCBndWFyYW50ZWVkIHRoYXQgYSByZW1vdmFsIGNhbiBiZSBwZXJmb3JtZWQgc2FmZWx5LCB3ZSBqdXN0XG4gICAqIGNyZWF0ZSBhIG1pZ3JhdGlvbiBmYWlsdXJlIChhbmQgYWRkIGEgVE9ETyBpZiBwb3NzaWJsZSkuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKHtub2RlLCBpbXBvcnREYXRhLCBpc0ltcG9ydH06IElkZW50aWZpZXJSZWZlcmVuY2UpIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdCh0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShzb3VyY2VGaWxlLmZpbGVOYW1lKSk7XG4gICAgLy8gT25seSByZW1vdmUgdGhlIGltcG9ydCBmb3IgdGhlIGdlc3R1cmUgY29uZmlnIGlmIHRoZSBnZXN0dXJlIGNvbmZpZyBoYXNcbiAgICAvLyBiZWVuIGFjY2Vzc2VkIHRocm91Z2ggYSBub24tbmFtZXNwYWNlZCBpZGVudGlmaWVyIGFjY2Vzcy5cbiAgICBpZiAoIWlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZSkpIHtcbiAgICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICAgIHNvdXJjZUZpbGUsIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsIGltcG9ydERhdGEubW9kdWxlTmFtZSk7XG4gICAgfVxuXG4gICAgLy8gRm9yIHJlZmVyZW5jZXMgZnJvbSB3aXRoaW4gYW4gaW1wb3J0LCB3ZSBkbyBub3QgbmVlZCB0byBkbyBhbnl0aGluZyBvdGhlciB0aGFuXG4gICAgLy8gcmVtb3ZpbmcgdGhlIGltcG9ydC4gRm9yIG90aGVyIHJlZmVyZW5jZXMsIHdlIHJlbW92ZSB0aGUgaW1wb3J0IGFuZCB0aGUgcmVmZXJlbmNlXG4gICAgLy8gaWRlbnRpZmllciBpZiB1c2VkIGluc2lkZSBvZiBhIHByb3ZpZGVyIGRlZmluaXRpb24uXG4gICAgaWYgKGlzSW1wb3J0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdmlkZXJBc3NpZ25tZW50ID0gbm9kZS5wYXJlbnQ7XG5cbiAgICAvLyBPbmx5IHJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyB3aGljaCBhcmUgcGFydCBvZiBhIHN0YXRpY2FsbHlcbiAgICAvLyBhbmFseXphYmxlIHByb3ZpZGVyIGRlZmluaXRpb24uIFdlIG9ubHkgc3VwcG9ydCB0aGUgY29tbW9uIGNhc2Ugb2YgYSBnZXN0dXJlXG4gICAgLy8gY29uZmlnIHByb3ZpZGVyIGRlZmluaXRpb24gd2hlcmUgdGhlIGNvbmZpZyBpcyBzZXQgdXAgdGhyb3VnaCBcInVzZUNsYXNzXCIuXG4gICAgLy8gT3RoZXJ3aXNlLCBpdCdzIG5vdCBndWFyYW50ZWVkIHRoYXQgd2UgY2FuIHNhZmVseSByZW1vdmUgdGhlIHByb3ZpZGVyIGRlZmluaXRpb24uXG4gICAgaWYgKCF0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwcm92aWRlckFzc2lnbm1lbnQpIHx8XG4gICAgICAgIGdldFByb3BlcnR5TmFtZVRleHQocHJvdmlkZXJBc3NpZ25tZW50Lm5hbWUpICE9PSAndXNlQ2xhc3MnKSB7XG4gICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7bm9kZSwgbWVzc2FnZTogQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1J9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvYmplY3RMaXRlcmFsRXhwciA9IHByb3ZpZGVyQXNzaWdubWVudC5wYXJlbnQ7XG4gICAgY29uc3QgcHJvdmlkZVRva2VuID0gb2JqZWN0TGl0ZXJhbEV4cHIucHJvcGVydGllcy5maW5kKFxuICAgICAgICAocCk6IHAgaXMgdHMuUHJvcGVydHlBc3NpZ25tZW50ID0+XG4gICAgICAgICAgICB0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwKSAmJiBnZXRQcm9wZXJ0eU5hbWVUZXh0KHAubmFtZSkgPT09ICdwcm92aWRlJyk7XG5cbiAgICAvLyBEbyBub3QgcmVtb3ZlIHRoZSByZWZlcmVuY2UgaWYgdGhlIGdlc3R1cmUgY29uZmlnIGlzIG5vdCBwYXJ0IG9mIGEgcHJvdmlkZXIgZGVmaW5pdGlvbixcbiAgICAvLyBvciBpZiB0aGUgcHJvdmlkZWQgdG9rZSBpcyBub3QgcmVmZXJyaW5nIHRvIHRoZSBrbm93biBIQU1NRVJfR0VTVFVSRV9DT05GSUcgdG9rZW5cbiAgICAvLyBmcm9tIHBsYXRmb3JtLWJyb3dzZXIuXG4gICAgaWYgKCFwcm92aWRlVG9rZW4gfHwgIXRoaXMuX2lzUmVmZXJlbmNlVG9IYW1tZXJDb25maWdUb2tlbihwcm92aWRlVG9rZW4uaW5pdGlhbGl6ZXIpKSB7XG4gICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7bm9kZSwgbWVzc2FnZTogQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1J9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDb2xsZWN0IGFsbCBuZXN0ZWQgaWRlbnRpZmllcnMgd2hpY2ggd2lsbCBiZSBkZWxldGVkLiBUaGlzIGhlbHBzIHVzXG4gICAgLy8gZGV0ZXJtaW5pbmcgaWYgd2UgY2FuIHJlbW92ZSBpbXBvcnRzIGZvciB0aGUgXCJIQU1NRVJfR0VTVFVSRV9DT05GSUdcIiB0b2tlbi5cbiAgICB0aGlzLl9kZWxldGVkSWRlbnRpZmllcnMucHVzaCguLi5maW5kTWF0Y2hpbmdDaGlsZE5vZGVzKG9iamVjdExpdGVyYWxFeHByLCB0cy5pc0lkZW50aWZpZXIpKTtcblxuICAgIC8vIEluIGNhc2UgdGhlIGZvdW5kIHByb3ZpZGVyIGRlZmluaXRpb24gaXMgbm90IHBhcnQgb2YgYW4gYXJyYXkgbGl0ZXJhbCxcbiAgICAvLyB3ZSBjYW5ub3Qgc2FmZWx5IHJlbW92ZSB0aGUgcHJvdmlkZXIuIFRoaXMgaXMgYmVjYXVzZSBpdCBjb3VsZCBiZSBkZWNsYXJlZFxuICAgIC8vIGFzIGEgdmFyaWFibGUuIGUuZy4gXCJjb25zdCBnZXN0dXJlUHJvdmlkZXIgPSB7cHJvdmlkZTogLi4sIHVzZUNsYXNzOiBHZXN0dXJlQ29uZmlnfVwiLlxuICAgIC8vIEluIHRoYXQgY2FzZSwgd2UganVzdCBhZGQgYW4gZW1wdHkgb2JqZWN0IGxpdGVyYWwgd2l0aCBUT0RPIGFuZCBwcmludCBhIGZhaWx1cmUuXG4gICAgaWYgKCF0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24ob2JqZWN0TGl0ZXJhbEV4cHIucGFyZW50KSkge1xuICAgICAgcmVjb3JkZXIucmVtb3ZlKG9iamVjdExpdGVyYWxFeHByLmdldFN0YXJ0KCksIG9iamVjdExpdGVyYWxFeHByLmdldFdpZHRoKCkpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQob2JqZWN0TGl0ZXJhbEV4cHIuZ2V0U3RhcnQoKSwgYC8qIFRPRE86IHJlbW92ZSAqLyB7fWApO1xuICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe1xuICAgICAgICBub2RlOiBvYmplY3RMaXRlcmFsRXhwcixcbiAgICAgICAgbWVzc2FnZTogYFVuYWJsZSB0byBkZWxldGUgcHJvdmlkZXIgZGVmaW5pdGlvbiBmb3IgXCJHZXN0dXJlQ29uZmlnXCIgY29tcGxldGVseS4gYCArXG4gICAgICAgICAgICBgUGxlYXNlIGNsZWFuIHVwIHRoZSBwcm92aWRlci5gXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmVzIHRoZSBvYmplY3QgbGl0ZXJhbCBmcm9tIHRoZSBwYXJlbnQgYXJyYXkgZXhwcmVzc2lvbi4gUmVtb3Zlc1xuICAgIC8vIHRoZSB0cmFpbGluZyBjb21tYSB0b2tlbiBpZiBwcmVzZW50LlxuICAgIHJlbW92ZUVsZW1lbnRGcm9tQXJyYXlFeHByZXNzaW9uKG9iamVjdExpdGVyYWxFeHByLCByZWNvcmRlcik7XG4gIH1cblxuICAvKiogUmVtb3ZlcyB0aGUgZ2l2ZW4gaGFtbWVyIGNvbmZpZyB0b2tlbiBpbXBvcnQgaWYgaXQgaXMgbm90IHVzZWQuICovXG4gIHByaXZhdGUgX3JlbW92ZUhhbW1lckNvbmZpZ1Rva2VuSW1wb3J0SWZVbnVzZWQoe25vZGUsIGltcG9ydERhdGF9OiBJZGVudGlmaWVyUmVmZXJlbmNlKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IGlzVG9rZW5Vc2VkID0gdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUoXG4gICAgICAgIHIgPT4gIXIuaXNJbXBvcnQgJiYgIWlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Moci5ub2RlKSAmJlxuICAgICAgICAgICAgci5ub2RlLmdldFNvdXJjZUZpbGUoKSA9PT0gc291cmNlRmlsZSAmJiAhdGhpcy5fZGVsZXRlZElkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpO1xuXG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB0byByZW1vdmUgdGhlIGltcG9ydCBmb3IgdGhlIHRva2VuIGlmIHRoZSB0b2tlbiBpc1xuICAgIC8vIHN0aWxsIHVzZWQgc29tZXdoZXJlLlxuICAgIGlmICghaXNUb2tlblVzZWQpIHtcbiAgICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICAgIHNvdXJjZUZpbGUsIEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVtb3ZlcyBIYW1tZXIgZnJvbSBhbGwgaW5kZXggSFRNTCBmaWxlcyBvZiB0aGUgY3VycmVudCBwcm9qZWN0LiAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJGcm9tSW5kZXhGaWxlKCkge1xuICAgIGNvbnN0IGluZGV4RmlsZVBhdGhzID0gZ2V0UHJvamVjdEluZGV4RmlsZXModGhpcy5jb250ZXh0LnByb2plY3QpO1xuICAgIGluZGV4RmlsZVBhdGhzLmZvckVhY2goZmlsZVBhdGggPT4ge1xuICAgICAgaWYgKCF0aGlzLmZpbGVTeXN0ZW0uZXhpc3RzKGZpbGVQYXRoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGh0bWxDb250ZW50ID0gdGhpcy5maWxlU3lzdGVtLnJlYWQoZmlsZVBhdGgpITtcbiAgICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5maWxlU3lzdGVtLmVkaXQoZmlsZVBhdGgpO1xuXG4gICAgICBmaW5kSGFtbWVyU2NyaXB0SW1wb3J0RWxlbWVudHMoaHRtbENvbnRlbnQpXG4gICAgICAgICAgLmZvckVhY2goZWwgPT4gcmVtb3ZlRWxlbWVudEZyb21IdG1sKGVsLCByZWNvcmRlcikpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFNldHMgdXAgdGhlIEhhbW1lciBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgcm9vdCBtb2R1bGUgaWYgbmVlZGVkLiAqL1xuICBwcml2YXRlIF9zZXR1cE5ld0dlc3R1cmVDb25maWdJblJvb3RNb2R1bGUoZ2VzdHVyZUNvbmZpZ1BhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHt3b3Jrc3BhY2VGc1BhdGgsIHByb2plY3R9ID0gdGhpcy5jb250ZXh0O1xuICAgIGNvbnN0IG1haW5GaWxlUGF0aCA9IGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KTtcbiAgICBjb25zdCByb290TW9kdWxlU3ltYm9sID0gdGhpcy5fZ2V0Um9vdE1vZHVsZVN5bWJvbChtYWluRmlsZVBhdGgpO1xuXG4gICAgaWYgKHJvb3RNb2R1bGVTeW1ib2wgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiBtYWluRmlsZVBhdGgsXG4gICAgICAgIG1lc3NhZ2U6IGBDb3VsZCBub3Qgc2V0dXAgSGFtbWVyIGdlc3R1cmVzIGluIG1vZHVsZS4gUGxlYXNlIGAgK1xuICAgICAgICAgICAgYG1hbnVhbGx5IGVuc3VyZSB0aGF0IHRoZSBIYW1tZXIgZ2VzdHVyZSBjb25maWcgaXMgc2V0IHVwLmAsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VGaWxlID0gcm9vdE1vZHVsZVN5bWJvbC52YWx1ZURlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCByZWxhdGl2ZVBhdGggPSByZWxhdGl2ZSh3b3Jrc3BhY2VGc1BhdGgsIHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IG1ldGFkYXRhID0gZ2V0RGVjb3JhdG9yTWV0YWRhdGEoc291cmNlRmlsZSwgJ05nTW9kdWxlJywgJ0Bhbmd1bGFyL2NvcmUnKSBhc1xuICAgICAgICB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbltdO1xuXG4gICAgLy8gSWYgbm8gXCJOZ01vZHVsZVwiIGRlZmluaXRpb24gaXMgZm91bmQgaW5zaWRlIHRoZSBzb3VyY2UgZmlsZSwgd2UganVzdCBkbyBub3RoaW5nLlxuICAgIGlmICghbWV0YWRhdGEubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdCh0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShzb3VyY2VGaWxlLmZpbGVOYW1lKSk7XG4gICAgY29uc3QgcHJvdmlkZXJzRmllbGQgPSBnZXRNZXRhZGF0YUZpZWxkKG1ldGFkYXRhWzBdLCAncHJvdmlkZXJzJylbMF07XG4gICAgY29uc3QgcHJvdmlkZXJJZGVudGlmaWVycyA9XG4gICAgICAgIHByb3ZpZGVyc0ZpZWxkID8gZmluZE1hdGNoaW5nQ2hpbGROb2Rlcyhwcm92aWRlcnNGaWVsZCwgdHMuaXNJZGVudGlmaWVyKSA6IG51bGw7XG4gICAgY29uc3QgZ2VzdHVyZUNvbmZpZ0V4cHIgPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgc291cmNlRmlsZSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSxcbiAgICAgICAgZ2V0TW9kdWxlU3BlY2lmaWVyKGdlc3R1cmVDb25maWdQYXRoLCBzb3VyY2VGaWxlLmZpbGVOYW1lKSwgZmFsc2UsXG4gICAgICAgIHRoaXMuX2dldEdlc3R1cmVDb25maWdJZGVudGlmaWVyc09mRmlsZShzb3VyY2VGaWxlKSk7XG4gICAgY29uc3QgaGFtbWVyQ29uZmlnVG9rZW5FeHByID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgIHNvdXJjZUZpbGUsIEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSwgSEFNTUVSX0NPTkZJR19UT0tFTl9NT0RVTEUpO1xuICAgIGNvbnN0IG5ld1Byb3ZpZGVyTm9kZSA9IHRzLmNyZWF0ZU9iamVjdExpdGVyYWwoW1xuICAgICAgdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KCdwcm92aWRlJywgaGFtbWVyQ29uZmlnVG9rZW5FeHByKSxcbiAgICAgIHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgndXNlQ2xhc3MnLCBnZXN0dXJlQ29uZmlnRXhwcilcbiAgICBdKTtcblxuICAgIC8vIElmIHRoZSBwcm92aWRlcnMgZmllbGQgZXhpc3RzIGFuZCBhbHJlYWR5IGNvbnRhaW5zIHJlZmVyZW5jZXMgdG8gdGhlIGhhbW1lciBnZXN0dXJlXG4gICAgLy8gY29uZmlnIHRva2VuIGFuZCB0aGUgZ2VzdHVyZSBjb25maWcsIHdlIG5haXZlbHkgYXNzdW1lIHRoYXQgdGhlIGdlc3R1cmUgY29uZmlnIGlzXG4gICAgLy8gYWxyZWFkeSBzZXQgdXAuIFdlIG9ubHkgd2FudCB0byBhZGQgdGhlIGdlc3R1cmUgY29uZmlnIHByb3ZpZGVyIGlmIGl0IGlzIG5vdCBzZXQgdXAuXG4gICAgaWYgKCFwcm92aWRlcklkZW50aWZpZXJzIHx8XG4gICAgICAgICEodGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUociA9PiBwcm92aWRlcklkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpICYmXG4gICAgICAgICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuc29tZShyID0+IHByb3ZpZGVySWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSkpKSB7XG4gICAgICBhZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEoXG4gICAgICAgICAgc291cmNlRmlsZSwgcmVsYXRpdmVQYXRoLCAncHJvdmlkZXJzJywgdGhpcy5fcHJpbnROb2RlKG5ld1Byb3ZpZGVyTm9kZSwgc291cmNlRmlsZSksIG51bGwpXG4gICAgICAgICAgLmZvckVhY2goY2hhbmdlID0+IHtcbiAgICAgICAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRDaGFuZ2UpIHtcbiAgICAgICAgICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgVHlwZVNjcmlwdCBzeW1ib2wgb2YgdGhlIHJvb3QgbW9kdWxlIGJ5IGxvb2tpbmcgZm9yIHRoZSBtb2R1bGVcbiAgICogYm9vdHN0cmFwIGV4cHJlc3Npb24gaW4gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS5cbiAgICovXG4gIHByaXZhdGUgX2dldFJvb3RNb2R1bGVTeW1ib2wobWFpbkZpbGVQYXRoOiBQYXRoKTogdHMuU3ltYm9sfG51bGwge1xuICAgIGNvbnN0IG1haW5GaWxlID0gdGhpcy5wcm9ncmFtLmdldFNvdXJjZUZpbGUocmVzb2x2ZShcbiAgICAgICAgdGhpcy5jb250ZXh0LndvcmtzcGFjZUZzUGF0aCwgbWFpbkZpbGVQYXRoKSk7XG4gICAgaWYgKCFtYWluRmlsZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYXBwTW9kdWxlRXhwciA9IGZpbmRNYWluTW9kdWxlRXhwcmVzc2lvbihtYWluRmlsZSk7XG4gICAgaWYgKCFhcHBNb2R1bGVFeHByKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhcHBNb2R1bGVTeW1ib2wgPSB0aGlzLl9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZSh1bndyYXBFeHByZXNzaW9uKGFwcE1vZHVsZUV4cHIpKTtcbiAgICBpZiAoIWFwcE1vZHVsZVN5bWJvbCB8fCAhYXBwTW9kdWxlU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gYXBwTW9kdWxlU3ltYm9sO1xuICB9XG5cbiAgLyoqIFNldHMgdXAgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaW4gdGhlIHJvb3QgbW9kdWxlIG9mIHRoZSBjdXJyZW50IHByb2plY3QuICovXG4gIHByaXZhdGUgX3NldHVwSGFtbWVyTW9kdWxlSW5Sb290TW9kdWxlKCkge1xuICAgIGNvbnN0IHt3b3Jrc3BhY2VGc1BhdGgsIHByb2plY3R9ID0gdGhpcy5jb250ZXh0O1xuICAgIGNvbnN0IG1haW5GaWxlUGF0aCA9IGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KTtcbiAgICBjb25zdCByb290TW9kdWxlU3ltYm9sID0gdGhpcy5fZ2V0Um9vdE1vZHVsZVN5bWJvbChtYWluRmlsZVBhdGgpO1xuXG4gICAgaWYgKHJvb3RNb2R1bGVTeW1ib2wgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiBtYWluRmlsZVBhdGgsXG4gICAgICAgIG1lc3NhZ2U6IGBDb3VsZCBub3Qgc2V0dXAgSGFtbWVyTW9kdWxlLiBQbGVhc2UgbWFudWFsbHkgc2V0IHVwIHRoZSBcIkhhbW1lck1vZHVsZVwiIGAgK1xuICAgICAgICAgICAgYGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuYCxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSByb290TW9kdWxlU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHdvcmtzcGFjZUZzUGF0aCwgc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgY29uc3QgbWV0YWRhdGEgPSBnZXREZWNvcmF0b3JNZXRhZGF0YShzb3VyY2VGaWxlLCAnTmdNb2R1bGUnLCAnQGFuZ3VsYXIvY29yZScpIGFzXG4gICAgICAgIHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uW107XG4gICAgaWYgKCFtZXRhZGF0YS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbXBvcnRzRmllbGQgPSBnZXRNZXRhZGF0YUZpZWxkKG1ldGFkYXRhWzBdLCAnaW1wb3J0cycpWzBdO1xuICAgIGNvbnN0IGltcG9ydElkZW50aWZpZXJzID1cbiAgICAgICAgaW1wb3J0c0ZpZWxkID8gZmluZE1hdGNoaW5nQ2hpbGROb2RlcyhpbXBvcnRzRmllbGQsIHRzLmlzSWRlbnRpZmllcikgOiBudWxsO1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5maWxlU3lzdGVtLmVkaXQodGhpcy5maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSkpO1xuICAgIGNvbnN0IGhhbW1lck1vZHVsZUV4cHIgPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgc291cmNlRmlsZSwgSEFNTUVSX01PRFVMRV9OQU1FLCBIQU1NRVJfTU9EVUxFX0lNUE9SVCk7XG5cbiAgICAvLyBJZiB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpcyBub3QgYWxyZWFkeSBpbXBvcnRlZCBpbiB0aGUgYXBwIG1vZHVsZSwgd2Ugc2V0IGl0IHVwXG4gICAgLy8gYnkgYWRkaW5nIGl0IHRvIHRoZSBcImltcG9ydHNcIiBmaWVsZCBvZiB0aGUgYXBwIG1vZHVsZS5cbiAgICBpZiAoIWltcG9ydElkZW50aWZpZXJzIHx8XG4gICAgICAgICF0aGlzLl9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzLnNvbWUociA9PiBpbXBvcnRJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKSkge1xuICAgICAgYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhKFxuICAgICAgICAgIHNvdXJjZUZpbGUsIHJlbGF0aXZlUGF0aCwgJ2ltcG9ydHMnLCB0aGlzLl9wcmludE5vZGUoaGFtbWVyTW9kdWxlRXhwciwgc291cmNlRmlsZSksIG51bGwpXG4gICAgICAgICAgLmZvckVhY2goY2hhbmdlID0+IHtcbiAgICAgICAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRDaGFuZ2UpIHtcbiAgICAgICAgICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogUHJpbnRzIGEgZ2l2ZW4gbm9kZSB3aXRoaW4gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS4gKi9cbiAgcHJpdmF0ZSBfcHJpbnROb2RlKG5vZGU6IHRzLk5vZGUsIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgbm9kZSwgc291cmNlRmlsZSk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgcmVmZXJlbmNlZCBnZXN0dXJlIGNvbmZpZyBpZGVudGlmaWVycyBvZiBhIGdpdmVuIHNvdXJjZSBmaWxlICovXG4gIHByaXZhdGUgX2dldEdlc3R1cmVDb25maWdJZGVudGlmaWVyc09mRmlsZShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogdHMuSWRlbnRpZmllcltdIHtcbiAgICByZXR1cm4gdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuZmlsdGVyKGQgPT4gZC5ub2RlLmdldFNvdXJjZUZpbGUoKSA9PT0gc291cmNlRmlsZSlcbiAgICAgICAgLm1hcChkID0+IGQubm9kZSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc3ltYm9sIHRoYXQgY29udGFpbnMgdGhlIHZhbHVlIGRlY2xhcmF0aW9uIG9mIHRoZSBzcGVjaWZpZWQgbm9kZS4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZTogdHMuTm9kZSk6IHRzLlN5bWJvbHx1bmRlZmluZWQge1xuICAgIGNvbnN0IHN5bWJvbCA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihub2RlKTtcblxuICAgIC8vIFN5bWJvbHMgY2FuIGJlIGFsaWFzZXMgb2YgdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC4gZS5nLiBpbiBuYW1lZCBpbXBvcnQgc3BlY2lmaWVycy5cbiAgICAvLyBXZSBuZWVkIHRvIHJlc29sdmUgdGhlIGFsaWFzZWQgc3ltYm9sIGJhY2sgdG8gdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYml0d2lzZVxuICAgIGlmIChzeW1ib2wgJiYgKHN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSAhPT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudHlwZUNoZWNrZXIuZ2V0QWxpYXNlZFN5bWJvbChzeW1ib2wpO1xuICAgIH1cbiAgICByZXR1cm4gc3ltYm9sO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBleHByZXNzaW9uIHJlc29sdmVzIHRvIGEgaGFtbWVyIGdlc3R1cmUgY29uZmlnXG4gICAqIHRva2VuIHJlZmVyZW5jZSBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfaXNSZWZlcmVuY2VUb0hhbW1lckNvbmZpZ1Rva2VuKGV4cHI6IHRzLkV4cHJlc3Npb24pIHtcbiAgICBjb25zdCB1bndyYXBwZWQgPSB1bndyYXBFeHByZXNzaW9uKGV4cHIpO1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIodW53cmFwcGVkKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gci5ub2RlID09PSB1bndyYXBwZWQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24odW53cmFwcGVkKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gci5ub2RlID09PSB1bndyYXBwZWQubmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIG1pZ3JhdGlvbiBmYWlsdXJlcyBvZiB0aGUgY29sbGVjdGVkIG5vZGUgZmFpbHVyZXMuIFRoZSByZXR1cm5lZCBtaWdyYXRpb25cbiAgICogZmFpbHVyZXMgYXJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgcG9zdC1taWdyYXRpb24gc3RhdGUgb2Ygc291cmNlIGZpbGVzLiBNZWFuaW5nXG4gICAqIHRoYXQgZmFpbHVyZSBwb3NpdGlvbnMgYXJlIGNvcnJlY3RlZCBpZiBzb3VyY2UgZmlsZSBtb2RpZmljYXRpb25zIHNoaWZ0ZWQgbGluZXMuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVNaWdyYXRpb25GYWlsdXJlcygpOiBNaWdyYXRpb25GYWlsdXJlW10ge1xuICAgIHJldHVybiB0aGlzLl9ub2RlRmFpbHVyZXMubWFwKCh7bm9kZSwgbWVzc2FnZX0pID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICAgIGNvbnN0IG9mZnNldCA9IG5vZGUuZ2V0U3RhcnQoKTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdHMuZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24oc291cmNlRmlsZSwgbm9kZS5nZXRTdGFydCgpKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aW9uOiB0aGlzLl9pbXBvcnRNYW5hZ2VyLmNvcnJlY3ROb2RlUG9zaXRpb24obm9kZSwgb2Zmc2V0LCBwb3NpdGlvbiksXG4gICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIGZpbGVQYXRoOiB0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShzb3VyY2VGaWxlLmZpbGVOYW1lKSxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKiogR2xvYmFsIHN0YXRlIG9mIHdoZXRoZXIgSGFtbWVyIGlzIHVzZWQgaW4gYW55IGFuYWx5emVkIHByb2plY3QgdGFyZ2V0LiAqL1xuICBzdGF0aWMgZ2xvYmFsVXNlc0hhbW1lciA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBTdGF0aWMgbWlncmF0aW9uIHJ1bGUgbWV0aG9kIHRoYXQgd2lsbCBiZSBjYWxsZWQgb25jZSBhbGwgcHJvamVjdCB0YXJnZXRzXG4gICAqIGhhdmUgYmVlbiBtaWdyYXRlZCBpbmRpdmlkdWFsbHkuIFRoaXMgbWV0aG9kIGNhbiBiZSB1c2VkIHRvIG1ha2UgY2hhbmdlcyBiYXNlZFxuICAgKiBvbiB0aGUgYW5hbHlzaXMgb2YgdGhlIGluZGl2aWR1YWwgdGFyZ2V0cy4gRm9yIGV4YW1wbGU6IHdlIG9ubHkgcmVtb3ZlIEhhbW1lclxuICAgKiBmcm9tIHRoZSBcInBhY2thZ2UuanNvblwiIGlmIGl0IGlzIG5vdCB1c2VkIGluICphbnkqIHByb2plY3QgdGFyZ2V0LlxuICAgKi9cbiAgc3RhdGljIGdsb2JhbFBvc3RNaWdyYXRpb24odHJlZTogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCk6IFBvc3RNaWdyYXRpb25BY3Rpb24ge1xuICAgIC8vIEFsd2F5cyBub3RpZnkgdGhlIGRldmVsb3BlciB0aGF0IHRoZSBIYW1tZXIgdjkgbWlncmF0aW9uIGRvZXMgbm90IG1pZ3JhdGUgdGVzdHMuXG4gICAgY29udGV4dC5sb2dnZXIuaW5mbyhcbiAgICAgICAgJ1xcbuKaoCAgR2VuZXJhbCBub3RpY2U6IFRoZSBIYW1tZXJKUyB2OSBtaWdyYXRpb24gZm9yIEFuZ3VsYXIgQ29tcG9uZW50cyBpcyBub3QgYWJsZSB0byAnICtcbiAgICAgICAgJ21pZ3JhdGUgdGVzdHMuIFBsZWFzZSBtYW51YWxseSBjbGVhbiB1cCB0ZXN0cyBpbiB5b3VyIHByb2plY3QgaWYgdGhleSByZWx5IG9uICcgK1xuICAgICAgICAodGhpcy5nbG9iYWxVc2VzSGFtbWVyID8gJ3RoZSBkZXByZWNhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuJyA6ICdIYW1tZXJKUy4nKSk7XG4gICAgY29udGV4dC5sb2dnZXIuaW5mbyhcbiAgICAgICAgJ1JlYWQgbW9yZSBhYm91dCBtaWdyYXRpbmcgdGVzdHM6IGh0dHBzOi8vZ2l0LmlvL25nLW1hdGVyaWFsLXY5LWhhbW1lci1taWdyYXRlLXRlc3RzJyk7XG5cbiAgICBpZiAoIXRoaXMuZ2xvYmFsVXNlc0hhbW1lciAmJiB0aGlzLl9yZW1vdmVIYW1tZXJGcm9tUGFja2FnZUpzb24odHJlZSkpIHtcbiAgICAgIC8vIFNpbmNlIEhhbW1lciBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHdvcmtzcGFjZSBcInBhY2thZ2UuanNvblwiIGZpbGUsXG4gICAgICAvLyB3ZSBzY2hlZHVsZSBhIG5vZGUgcGFja2FnZSBpbnN0YWxsIHRhc2sgdG8gcmVmcmVzaCB0aGUgbG9jayBmaWxlLlxuICAgICAgcmV0dXJuIHtydW5QYWNrYWdlTWFuYWdlcjogdHJ1ZX07XG4gICAgfVxuXG4gICAgLy8gQ2xlYW4gZ2xvYmFsIHN0YXRlIG9uY2UgdGhlIHdvcmtzcGFjZSBoYXMgYmVlbiBtaWdyYXRlZC4gVGhpcyBpcyB0ZWNobmljYWxseVxuICAgIC8vIG5vdCBuZWNlc3NhcnkgaW4gXCJuZyB1cGRhdGVcIiwgYnV0IGluIHRlc3RzIHdlIHJlLXVzZSB0aGUgc2FtZSBydWxlIGNsYXNzLlxuICAgIHRoaXMuZ2xvYmFsVXNlc0hhbW1lciA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGhhbW1lciBwYWNrYWdlIGZyb20gdGhlIHdvcmtzcGFjZSBcInBhY2thZ2UuanNvblwiLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIEhhbW1lciB3YXMgc2V0IHVwIGFuZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIFwicGFja2FnZS5qc29uXCJcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIF9yZW1vdmVIYW1tZXJGcm9tUGFja2FnZUpzb24odHJlZTogVHJlZSk6IGJvb2xlYW4ge1xuICAgIGlmICghdHJlZS5leGlzdHMoJy9wYWNrYWdlLmpzb24nKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZSh0cmVlLnJlYWQoJy9wYWNrYWdlLmpzb24nKSEudG9TdHJpbmcoJ3V0ZjgnKSk7XG5cbiAgICAvLyBXZSBkbyBub3QgaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHNvbWVvbmUgbWFudWFsbHkgYWRkZWQgXCJoYW1tZXJqc1wiIHRvIHRoZSBkZXYgZGVwZW5kZW5jaWVzLlxuICAgIGlmIChwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXMgJiYgcGFja2FnZUpzb24uZGVwZW5kZW5jaWVzW0hBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSXSkge1xuICAgICAgZGVsZXRlIHBhY2thZ2VKc29uLmRlcGVuZGVuY2llc1tIQU1NRVJfTU9EVUxFX1NQRUNJRklFUl07XG4gICAgICB0cmVlLm92ZXJ3cml0ZSgnL3BhY2thZ2UuanNvbicsIEpTT04uc3RyaW5naWZ5KHBhY2thZ2VKc29uLCBudWxsLCAyKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgdW53cmFwcyBhIGdpdmVuIGV4cHJlc3Npb24gaWYgaXQgaXMgd3JhcHBlZFxuICogYnkgcGFyZW50aGVzaXMsIHR5cGUgY2FzdHMgb3IgdHlwZSBhc3NlcnRpb25zLlxuICovXG5mdW5jdGlvbiB1bndyYXBFeHByZXNzaW9uKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlIHtcbiAgaWYgKHRzLmlzUGFyZW50aGVzaXplZEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9IGVsc2UgaWYgKHRzLmlzQXNFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgcmV0dXJuIHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgfSBlbHNlIGlmICh0cy5pc1R5cGVBc3NlcnRpb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9XG4gIHJldHVybiBub2RlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBzcGVjaWZpZWQgcGF0aCB0byBhIHZhbGlkIFR5cGVTY3JpcHQgbW9kdWxlIHNwZWNpZmllciB3aGljaCBpc1xuICogcmVsYXRpdmUgdG8gdGhlIGdpdmVuIGNvbnRhaW5pbmcgZmlsZS5cbiAqL1xuZnVuY3Rpb24gZ2V0TW9kdWxlU3BlY2lmaWVyKG5ld1BhdGg6IHN0cmluZywgY29udGFpbmluZ0ZpbGU6IHN0cmluZykge1xuICBsZXQgcmVzdWx0ID0gcmVsYXRpdmUoZGlybmFtZShjb250YWluaW5nRmlsZSksIG5ld1BhdGgpLnJlcGxhY2UoL1xcXFwvZywgJy8nKS5yZXBsYWNlKC9cXC50cyQvLCAnJyk7XG4gIGlmICghcmVzdWx0LnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgIHJlc3VsdCA9IGAuLyR7cmVzdWx0fWA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSBuYW1lLlxuICogQHJldHVybnMgVGV4dCBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgbmFtZS4gTnVsbCBpZiBub3Qgc3RhdGljYWxseSBhbmFseXphYmxlLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eU5hbWVUZXh0KG5vZGU6IHRzLlByb3BlcnR5TmFtZSk6IHN0cmluZ3xudWxsIHtcbiAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSB8fCB0cy5pc1N0cmluZ0xpdGVyYWxMaWtlKG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGUudGV4dDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBpZGVudGlmaWVyIGlzIHBhcnQgb2YgYSBuYW1lc3BhY2VkIGFjY2Vzcy4gKi9cbmZ1bmN0aW9uIGlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZTogdHMuSWRlbnRpZmllcik6IGJvb2xlYW4ge1xuICByZXR1cm4gdHMuaXNRdWFsaWZpZWROYW1lKG5vZGUucGFyZW50KSB8fCB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLnBhcmVudCk7XG59XG5cbi8qKlxuICogV2Fsa3MgdGhyb3VnaCB0aGUgc3BlY2lmaWVkIG5vZGUgYW5kIHJldHVybnMgYWxsIGNoaWxkIG5vZGVzIHdoaWNoIG1hdGNoIHRoZVxuICogZ2l2ZW4gcHJlZGljYXRlLlxuICovXG5mdW5jdGlvbiBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzPFQgZXh0ZW5kcyB0cy5Ob2RlPihcbiAgICBwYXJlbnQ6IHRzLk5vZGUsIHByZWRpY2F0ZTogKG5vZGU6IHRzLk5vZGUpID0+IG5vZGUgaXMgVCk6IFRbXSB7XG4gIGNvbnN0IHJlc3VsdDogVFtdID0gW107XG4gIGNvbnN0IHZpc2l0Tm9kZSA9IChub2RlOiB0cy5Ob2RlKSA9PiB7XG4gICAgaWYgKHByZWRpY2F0ZShub2RlKSkge1xuICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XG4gICAgfVxuICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCB2aXNpdE5vZGUpO1xuICB9O1xuICB0cy5mb3JFYWNoQ2hpbGQocGFyZW50LCB2aXNpdE5vZGUpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl19