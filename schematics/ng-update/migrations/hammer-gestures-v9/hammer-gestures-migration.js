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
        const sourceRoot = this.fileSystem.resolve(project.sourceRoot || project.root);
        const newConfigPath = core_1.join(sourceRoot, this._getAvailableGestureConfigFileName(sourceRoot));
        // Copy gesture config template into the CLI project.
        this.fileSystem.create(newConfigPath, fs_1.readFileSync(require.resolve(GESTURE_CONFIG_TEMPLATE_PATH), 'utf8'));
        // Replace all Material gesture config references to resolve to the
        // newly copied gesture config.
        this._gestureConfigReferences.forEach(i => {
            const filePath = this.fileSystem.resolve(i.node.getSourceFile().fileName);
            return this._replaceGestureConfigReference(i, GESTURE_CONFIG_CLASS_NAME, getModuleSpecifier(newConfigPath, filePath));
        });
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
        const { project } = this.context;
        const mainFilePath = schematics_1.getProjectMainFile(project);
        const rootModuleSymbol = this._getRootModuleSymbol(mainFilePath);
        if (rootModuleSymbol === null || rootModuleSymbol.valueDeclaration === undefined) {
            this.failures.push({
                filePath: mainFilePath,
                message: `Could not setup Hammer gestures in module. Please ` +
                    `manually ensure that the Hammer gesture config is set up.`,
            });
            return;
        }
        const sourceFile = rootModuleSymbol.valueDeclaration.getSourceFile();
        const metadata = schematics_1.getDecoratorMetadata(sourceFile, 'NgModule', '@angular/core');
        // If no "NgModule" definition is found inside the source file, we just do nothing.
        if (!metadata.length) {
            return;
        }
        const filePath = this.fileSystem.resolve(sourceFile.fileName);
        const recorder = this.fileSystem.edit(filePath);
        const providersField = schematics_1.getMetadataField(metadata[0], 'providers')[0];
        const providerIdentifiers = providersField ? findMatchingChildNodes(providersField, ts.isIdentifier) : null;
        const gestureConfigExpr = this._importManager.addImportToSourceFile(sourceFile, GESTURE_CONFIG_CLASS_NAME, getModuleSpecifier(gestureConfigPath, filePath), false, this._getGestureConfigIdentifiersOfFile(sourceFile));
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
            const symbolName = this._printNode(newProviderNode, sourceFile);
            schematics_1.addSymbolToNgModuleMetadata(sourceFile, sourceFile.fileName, 'providers', symbolName, null)
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
    /** Sets up the "HammerModule" in the root module of the current project. */
    _setupHammerModuleInRootModule() {
        const { project } = this.context;
        const mainFilePath = schematics_1.getProjectMainFile(project);
        const rootModuleSymbol = this._getRootModuleSymbol(mainFilePath);
        if (rootModuleSymbol === null || rootModuleSymbol.valueDeclaration === undefined) {
            this.failures.push({
                filePath: mainFilePath,
                message: `Could not setup HammerModule. Please manually set up the "HammerModule" ` +
                    `from "@angular/platform-browser".`,
            });
            return;
        }
        const sourceFile = rootModuleSymbol.valueDeclaration.getSourceFile();
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
            const symbolName = this._printNode(hammerModuleExpr, sourceFile);
            schematics_1.addSymbolToNgModuleMetadata(sourceFile, sourceFile.fileName, 'imports', symbolName, null)
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
    let result = core_1.relative(core_1.dirname(containingFile), newPath).replace(/\\/g, '/').replace(/\.ts$/, '');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLWdlc3R1cmVzLW1pZ3JhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL2hhbW1lci1nZXN0dXJlcy12OS9oYW1tZXItZ2VzdHVyZXMtbWlncmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILCtDQUs4QjtBQUU5Qix3REFhaUM7QUFDakMsK0RBQWdFO0FBQ2hFLDJCQUFnQztBQUNoQyxpQ0FBaUM7QUFFakMsdUVBQXlFO0FBQ3pFLHlEQUE0RDtBQUM1RCxtRUFBaUU7QUFDakUscURBQStDO0FBQy9DLGlFQUF3RTtBQUN4RSx5RUFBaUU7QUFFakUsTUFBTSx5QkFBeUIsR0FBRyxlQUFlLENBQUM7QUFDbEQsTUFBTSx3QkFBd0IsR0FBRyxnQkFBZ0IsQ0FBQztBQUNsRCxNQUFNLDRCQUE0QixHQUFHLDJCQUEyQixDQUFDO0FBRWpFLE1BQU0sd0JBQXdCLEdBQUcsdUJBQXVCLENBQUM7QUFDekQsTUFBTSwwQkFBMEIsR0FBRywyQkFBMkIsQ0FBQztBQUUvRCxNQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQztBQUMxQyxNQUFNLG9CQUFvQixHQUFHLDJCQUEyQixDQUFDO0FBRXpELE1BQU0sdUJBQXVCLEdBQUcsVUFBVSxDQUFDO0FBRTNDLE1BQU0sNkJBQTZCLEdBQy9CLHFFQUFxRSxDQUFDO0FBWTFFLE1BQWEsdUJBQXdCLFNBQVEsNEJBQXFCO0lBQWxFOztRQUNFLHlGQUF5RjtRQUN6Rix5RUFBeUU7UUFDekUsNEZBQTRGO1FBQzVGLFlBQU8sR0FDSCxDQUFDLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEdBQUcsQ0FBQztZQUNyRixDQUFDLElBQUksQ0FBQyxPQUFPLENB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U0FBUyxzQkFBc0IsQ0FDM0IsTUFBZSxFQUFFLFNBQXVDO0lBQzFELE1BQU0sTUFBTSxHQUFRLEVBQUUsQ0FBQztJQUN2QixNQUFNLFNBQVMsR0FBRyxDQUFDLElBQWEsRUFBRSxFQUFFO1FBQ2xDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbkI7UUFDRCxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUM7SUFDRixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuQyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIGpvaW4sXG4gIFBhdGgsXG4gIHJlbGF0aXZlLFxuICBkaXJuYW1lXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7U2NoZW1hdGljQ29udGV4dCwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhLFxuICBEZXZraXRNaWdyYXRpb24sXG4gIGdldERlY29yYXRvck1ldGFkYXRhLFxuICBnZXRJbXBvcnRPZklkZW50aWZpZXIsXG4gIGdldE1ldGFkYXRhRmllbGQsXG4gIGdldFByb2plY3RJbmRleEZpbGVzLFxuICBnZXRQcm9qZWN0TWFpbkZpbGUsXG4gIEltcG9ydCxcbiAgTWlncmF0aW9uRmFpbHVyZSxcbiAgUG9zdE1pZ3JhdGlvbkFjdGlvbixcbiAgUmVzb2x2ZWRSZXNvdXJjZSxcbiAgVGFyZ2V0VmVyc2lvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtJbnNlcnRDaGFuZ2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jaGFuZ2UnO1xuaW1wb3J0IHtyZWFkRmlsZVN5bmN9IGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2ZpbmRIYW1tZXJTY3JpcHRJbXBvcnRFbGVtZW50c30gZnJvbSAnLi9maW5kLWhhbW1lci1zY3JpcHQtdGFncyc7XG5pbXBvcnQge2ZpbmRNYWluTW9kdWxlRXhwcmVzc2lvbn0gZnJvbSAnLi9maW5kLW1haW4tbW9kdWxlJztcbmltcG9ydCB7aXNIYW1tZXJKc1VzZWRJblRlbXBsYXRlfSBmcm9tICcuL2hhbW1lci10ZW1wbGF0ZS1jaGVjayc7XG5pbXBvcnQge0ltcG9ydE1hbmFnZXJ9IGZyb20gJy4vaW1wb3J0LW1hbmFnZXInO1xuaW1wb3J0IHtyZW1vdmVFbGVtZW50RnJvbUFycmF5RXhwcmVzc2lvbn0gZnJvbSAnLi9yZW1vdmUtYXJyYXktZWxlbWVudCc7XG5pbXBvcnQge3JlbW92ZUVsZW1lbnRGcm9tSHRtbH0gZnJvbSAnLi9yZW1vdmUtZWxlbWVudC1mcm9tLWh0bWwnO1xuXG5jb25zdCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FID0gJ0dlc3R1cmVDb25maWcnO1xuY29uc3QgR0VTVFVSRV9DT05GSUdfRklMRV9OQU1FID0gJ2dlc3R1cmUtY29uZmlnJztcbmNvbnN0IEdFU1RVUkVfQ09ORklHX1RFTVBMQVRFX1BBVEggPSAnLi9nZXN0dXJlLWNvbmZpZy50ZW1wbGF0ZSc7XG5cbmNvbnN0IEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSA9ICdIQU1NRVJfR0VTVFVSRV9DT05GSUcnO1xuY29uc3QgSEFNTUVSX0NPTkZJR19UT0tFTl9NT0RVTEUgPSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmNvbnN0IEhBTU1FUl9NT0RVTEVfTkFNRSA9ICdIYW1tZXJNb2R1bGUnO1xuY29uc3QgSEFNTUVSX01PRFVMRV9JTVBPUlQgPSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmNvbnN0IEhBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSID0gJ2hhbW1lcmpzJztcblxuY29uc3QgQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1IgPVxuICAgIGBDYW5ub3QgcmVtb3ZlIHJlZmVyZW5jZSB0byBcIkdlc3R1cmVDb25maWdcIi4gUGxlYXNlIHJlbW92ZSBtYW51YWxseS5gO1xuXG5pbnRlcmZhY2UgSWRlbnRpZmllclJlZmVyZW5jZSB7XG4gIG5vZGU6IHRzLklkZW50aWZpZXI7XG4gIGltcG9ydERhdGE6IEltcG9ydDtcbiAgaXNJbXBvcnQ6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBQYWNrYWdlSnNvbiB7XG4gIGRlcGVuZGVuY2llczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn1cblxuZXhwb3J0IGNsYXNzIEhhbW1lckdlc3R1cmVzTWlncmF0aW9uIGV4dGVuZHMgRGV2a2l0TWlncmF0aW9uPG51bGw+IHtcbiAgLy8gT25seSBlbmFibGUgdGhpcyBydWxlIGlmIHRoZSBtaWdyYXRpb24gdGFyZ2V0cyB2OSBvciB2MTAgYW5kIGlzIHJ1bm5pbmcgZm9yIGEgbm9uLXRlc3RcbiAgLy8gdGFyZ2V0LiBXZSBjYW5ub3QgbWlncmF0ZSB0ZXN0IHRhcmdldHMgc2luY2UgdGhleSBoYXZlIGEgbGltaXRlZCBzY29wZVxuICAvLyAoaW4gcmVnYXJkcyB0byBzb3VyY2UgZmlsZXMpIGFuZCB0aGVyZWZvcmUgdGhlIEhhbW1lckpTIHVzYWdlIGRldGVjdGlvbiBjYW4gYmUgaW5jb3JyZWN0LlxuICBlbmFibGVkID1cbiAgICAgICh0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjkgfHwgdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlYxMCkgJiZcbiAgICAgICF0aGlzLmNvbnRleHQuaXNUZXN0VGFyZ2V0O1xuXG4gIHByaXZhdGUgX3ByaW50ZXIgPSB0cy5jcmVhdGVQcmludGVyKCk7XG4gIHByaXZhdGUgX2ltcG9ydE1hbmFnZXIgPSBuZXcgSW1wb3J0TWFuYWdlcih0aGlzLmZpbGVTeXN0ZW0sIHRoaXMuX3ByaW50ZXIpO1xuICBwcml2YXRlIF9ub2RlRmFpbHVyZXM6IHtub2RlOiB0cy5Ob2RlLCBtZXNzYWdlOiBzdHJpbmd9W10gPSBbXTtcblxuICAvKipcbiAgICogV2hldGhlciBjdXN0b20gSGFtbWVySlMgZXZlbnRzIHByb3ZpZGVkIGJ5IHRoZSBNYXRlcmlhbCBnZXN0dXJlXG4gICAqIGNvbmZpZyBhcmUgdXNlZCBpbiBhIHRlbXBsYXRlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGUgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciBzdGFuZGFyZCBIYW1tZXJKUyBldmVudHMgYXJlIHVzZWQgaW4gYSB0ZW1wbGF0ZS4gKi9cbiAgcHJpdmF0ZSBfc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIEhhbW1lckpTIGlzIGFjY2Vzc2VkIGF0IHJ1bnRpbWUuICovXG4gIHByaXZhdGUgX3VzZWRJblJ1bnRpbWUgPSBmYWxzZTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpbXBvcnRzIHRoYXQgbWFrZSBcImhhbW1lcmpzXCIgYXZhaWxhYmxlIGdsb2JhbGx5LiBXZSBrZWVwIHRyYWNrIG9mIHRoZXNlXG4gICAqIHNpbmNlIHdlIG1pZ2h0IG5lZWQgdG8gcmVtb3ZlIHRoZW0gaWYgSGFtbWVyIGlzIG5vdCB1c2VkLlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5zdGFsbEltcG9ydHM6IHRzLkltcG9ydERlY2xhcmF0aW9uW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCByZXNvbHZlIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyBmcm9tIEFuZ3VsYXIgTWF0ZXJpYWwuXG4gICAqL1xuICBwcml2YXRlIF9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlczogSWRlbnRpZmllclJlZmVyZW5jZVtdID0gW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggcmVzb2x2ZSB0byB0aGUgXCJIQU1NRVJfR0VTVFVSRV9DT05GSUdcIiB0b2tlbiBmcm9tXG4gICAqIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzOiBJZGVudGlmaWVyUmVmZXJlbmNlW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCByZXNvbHZlIHRvIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb21cbiAgICogXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuXG4gICAqL1xuICBwcml2YXRlIF9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzOiBJZGVudGlmaWVyUmVmZXJlbmNlW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB0aGF0IGhhdmUgYmVlbiBkZWxldGVkIGZyb20gc291cmNlIGZpbGVzLiBUaGlzIGNhbiBiZVxuICAgKiB1c2VkIHRvIGRldGVybWluZSBpZiBjZXJ0YWluIGltcG9ydHMgYXJlIHN0aWxsIHVzZWQgb3Igbm90LlxuICAgKi9cbiAgcHJpdmF0ZSBfZGVsZXRlZElkZW50aWZpZXJzOiB0cy5JZGVudGlmaWVyW10gPSBbXTtcblxuICB2aXNpdFRlbXBsYXRlKHRlbXBsYXRlOiBSZXNvbHZlZFJlc291cmNlKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZSB8fCAhdGhpcy5fc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSkge1xuICAgICAgY29uc3Qge3N0YW5kYXJkRXZlbnRzLCBjdXN0b21FdmVudHN9ID0gaXNIYW1tZXJKc1VzZWRJblRlbXBsYXRlKHRlbXBsYXRlLmNvbnRlbnQpO1xuICAgICAgdGhpcy5fY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGUgPSB0aGlzLl9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZSB8fCBjdXN0b21FdmVudHM7XG4gICAgICB0aGlzLl9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlID0gdGhpcy5fc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSB8fCBzdGFuZGFyZEV2ZW50cztcbiAgICB9XG4gIH1cblxuICB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrSGFtbWVySW1wb3J0cyhub2RlKTtcbiAgICB0aGlzLl9jaGVja0ZvclJ1bnRpbWVIYW1tZXJVc2FnZShub2RlKTtcbiAgICB0aGlzLl9jaGVja0Zvck1hdGVyaWFsR2VzdHVyZUNvbmZpZyhub2RlKTtcbiAgICB0aGlzLl9jaGVja0ZvckhhbW1lckdlc3R1cmVDb25maWdUb2tlbihub2RlKTtcbiAgICB0aGlzLl9jaGVja0ZvckhhbW1lck1vZHVsZVJlZmVyZW5jZShub2RlKTtcbiAgfVxuXG4gIHBvc3RBbmFseXNpcygpOiB2b2lkIHtcbiAgICAvLyBXYWxrIHRocm91Z2ggYWxsIGhhbW1lciBjb25maWcgdG9rZW4gcmVmZXJlbmNlcyBhbmQgY2hlY2sgaWYgdGhlcmVcbiAgICAvLyBpcyBhIHBvdGVudGlhbCBjdXN0b20gZ2VzdHVyZSBjb25maWcgc2V0dXAuXG4gICAgY29uc3QgaGFzQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwID1cbiAgICAgICAgdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUociA9PiB0aGlzLl9jaGVja0ZvckN1c3RvbUdlc3R1cmVDb25maWdTZXR1cChyKSk7XG4gICAgY29uc3QgdXNlZEluVGVtcGxhdGUgPSB0aGlzLl9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlIHx8IHRoaXMuX2N1c3RvbUV2ZW50c1VzZWRJblRlbXBsYXRlO1xuXG4gICAgLypcbiAgICAgIFBvc3NpYmxlIHNjZW5hcmlvcyBhbmQgaG93IHRoZSBtaWdyYXRpb24gc2hvdWxkIGNoYW5nZSB0aGUgcHJvamVjdDpcbiAgICAgICAgMS4gV2UgZGV0ZWN0IHRoYXQgYSBjdXN0b20gSGFtbWVySlMgZ2VzdHVyZSBjb25maWcgaXMgc2V0IHVwOlxuICAgICAgICAgICAgLSBSZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgaWYgbm8gSGFtbWVySlMgZXZlbnQgaXMgdXNlZC5cbiAgICAgICAgICAgIC0gUHJpbnQgYSB3YXJuaW5nIGFib3V0IGFtYmlndW91cyBjb25maWd1cmF0aW9uIHRoYXQgY2Fubm90IGJlIGhhbmRsZWQgY29tcGxldGVseVxuICAgICAgICAgICAgICBpZiB0aGVyZSBhcmUgcmVmZXJlbmNlcyB0byB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAgICAgIDIuIFdlIGRldGVjdCB0aGF0IEhhbW1lckpTIGlzIG9ubHkgdXNlZCBwcm9ncmFtbWF0aWNhbGx5OlxuICAgICAgICAgICAgLSBSZW1vdmUgcmVmZXJlbmNlcyB0byBHZXN0dXJlQ29uZmlnIG9mIE1hdGVyaWFsLlxuICAgICAgICAgICAgLSBSZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpZiBwcmVzZW50LlxuICAgICAgICAzLiBXZSBkZXRlY3QgdGhhdCBzdGFuZGFyZCBIYW1tZXJKUyBldmVudHMgYXJlIHVzZWQgaW4gYSB0ZW1wbGF0ZTpcbiAgICAgICAgICAgIC0gU2V0IHVwIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb20gcGxhdGZvcm0tYnJvd3Nlci5cbiAgICAgICAgICAgIC0gUmVtb3ZlIGFsbCBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2VzLlxuICAgICAgICA0LiBXZSBkZXRlY3QgdGhhdCBjdXN0b20gSGFtbWVySlMgZXZlbnRzIHByb3ZpZGVkIGJ5IHRoZSBNYXRlcmlhbCBnZXN0dXJlXG4gICAgICAgICAgIGNvbmZpZyBhcmUgdXNlZC5cbiAgICAgICAgICAgIC0gQ29weSB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgaW50byB0aGUgYXBwLlxuICAgICAgICAgICAgLSBSZXdyaXRlIGFsbCBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2VzIHRvIHRoZSBuZXdseSBjb3BpZWQgb25lLlxuICAgICAgICAgICAgLSBTZXQgdXAgdGhlIG5ldyBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgcm9vdCBhcHAgbW9kdWxlLlxuICAgICAgICAgICAgLSBTZXQgdXAgdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbSBwbGF0Zm9ybS1icm93c2VyLlxuICAgICAgICA0LiBXZSBkZXRlY3Qgbm8gSGFtbWVySlMgdXNhZ2UgYXQgYWxsOlxuICAgICAgICAgICAgLSBSZW1vdmUgSGFtbWVyIGltcG9ydHNcbiAgICAgICAgICAgIC0gUmVtb3ZlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZXNcbiAgICAgICAgICAgIC0gUmVtb3ZlIEhhbW1lck1vZHVsZSBzZXR1cCBpZiBwcmVzZW50LlxuICAgICAgICAgICAgLSBSZW1vdmUgSGFtbWVyIHNjcmlwdCBpbXBvcnRzIGluIFwiaW5kZXguaHRtbFwiIGZpbGVzLlxuICAgICovXG5cbiAgICBpZiAoaGFzQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKSB7XG4gICAgICAvLyBJZiBhIGN1c3RvbSBnZXN0dXJlIGNvbmZpZyBpcyBwcm92aWRlZCwgd2UgYWx3YXlzIGFzc3VtZSB0aGF0IEhhbW1lckpTIGlzIHVzZWQuXG4gICAgICBIYW1tZXJHZXN0dXJlc01pZ3JhdGlvbi5nbG9iYWxVc2VzSGFtbWVyID0gdHJ1ZTtcbiAgICAgIGlmICghdXNlZEluVGVtcGxhdGUgJiYgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIElmIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgZXZlbnRzIGFyZSBub3QgdXNlZCBhbmQgd2UgZm91bmQgYSBjdXN0b21cbiAgICAgICAgLy8gZ2VzdHVyZSBjb25maWcsIHdlIGNhbiBzYWZlbHkgcmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnXG4gICAgICAgIC8vIHNpbmNlIGV2ZW50cyBwcm92aWRlZCBieSB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgYXJlIGd1YXJhbnRlZWQgdG8gYmUgdW51c2VkLlxuICAgICAgICB0aGlzLl9yZW1vdmVNYXRlcmlhbEdlc3R1cmVDb25maWdTZXR1cCgpO1xuICAgICAgICB0aGlzLnByaW50SW5mbyhcbiAgICAgICAgICAgICdUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIENvbXBvbmVudHMgZGV0ZWN0ZWQgdGhhdCBIYW1tZXJKUyBpcyAnICtcbiAgICAgICAgICAgICdtYW51YWxseSBzZXQgdXAgaW4gY29tYmluYXRpb24gd2l0aCByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgJyArXG4gICAgICAgICAgICAnY29uZmlnLiBUaGlzIHRhcmdldCBjYW5ub3QgYmUgbWlncmF0ZWQgY29tcGxldGVseSwgYnV0IGFsbCByZWZlcmVuY2VzIHRvIHRoZSAnICtcbiAgICAgICAgICAgICdkZXByZWNhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBoYXZlIGJlZW4gcmVtb3ZlZC4gUmVhZCBtb3JlIGhlcmU6ICcgK1xuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0LmlvL25nLW1hdGVyaWFsLXY5LWhhbW1lci1hbWJpZ3VvdXMtdXNhZ2UnKTtcbiAgICAgIH0gZWxzZSBpZiAodXNlZEluVGVtcGxhdGUgJiYgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIFNpbmNlIHRoZXJlIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLCBhbmQgd2UgZGV0ZWN0ZWRcbiAgICAgICAgLy8gdXNhZ2Ugb2YgYSBnZXN0dXJlIGV2ZW50IHRoYXQgY291bGQgYmUgcHJvdmlkZWQgYnkgQW5ndWxhciBNYXRlcmlhbCwgd2UgKmNhbm5vdCpcbiAgICAgICAgLy8gYXV0b21hdGljYWxseSByZW1vdmUgcmVmZXJlbmNlcy4gVGhpcyBpcyBiZWNhdXNlIHdlIGRvICpub3QqIGtub3cgd2hldGhlciB0aGVcbiAgICAgICAgLy8gZXZlbnQgaXMgYWN0dWFsbHkgcHJvdmlkZWQgYnkgdGhlIGN1c3RvbSBjb25maWcgb3IgYnkgdGhlIE1hdGVyaWFsIGNvbmZpZy5cbiAgICAgICAgdGhpcy5wcmludEluZm8oXG4gICAgICAgICAgICAnVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBDb21wb25lbnRzIGRldGVjdGVkIHRoYXQgSGFtbWVySlMgaXMgJyArXG4gICAgICAgICAgICAnbWFudWFsbHkgc2V0IHVwIGluIGNvbWJpbmF0aW9uIHdpdGggcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlICcgK1xuICAgICAgICAgICAgJ2NvbmZpZy4gVGhpcyB0YXJnZXQgY2Fubm90IGJlIG1pZ3JhdGVkIGNvbXBsZXRlbHkuIFBsZWFzZSBtYW51YWxseSByZW1vdmUgJyArXG4gICAgICAgICAgICAncmVmZXJlbmNlcyB0byB0aGUgZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLiBSZWFkIG1vcmUgaGVyZTogJyArXG4gICAgICAgICAgICAnaHR0cHM6Ly9naXQuaW8vbmctbWF0ZXJpYWwtdjktaGFtbWVyLWFtYmlndW91cy11c2FnZScpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5fdXNlZEluUnVudGltZSB8fCB1c2VkSW5UZW1wbGF0ZSkge1xuICAgICAgLy8gV2Uga2VlcCB0cmFjayBvZiB3aGV0aGVyIEhhbW1lciBpcyB1c2VkIGdsb2JhbGx5LiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHdlXG4gICAgICAvLyB3YW50IHRvIG9ubHkgcmVtb3ZlIEhhbW1lciBmcm9tIHRoZSBcInBhY2thZ2UuanNvblwiIGlmIGl0IGlzIG5vdCB1c2VkIGluIGFueSBwcm9qZWN0XG4gICAgICAvLyB0YXJnZXQuIEp1c3QgYmVjYXVzZSBpdCBpc24ndCB1c2VkIGluIG9uZSB0YXJnZXQgZG9lc24ndCBtZWFuIHRoYXQgd2UgY2FuIHNhZmVseVxuICAgICAgLy8gcmVtb3ZlIHRoZSBkZXBlbmRlbmN5LlxuICAgICAgSGFtbWVyR2VzdHVyZXNNaWdyYXRpb24uZ2xvYmFsVXNlc0hhbW1lciA9IHRydWU7XG5cbiAgICAgIC8vIElmIGhhbW1lciBpcyBvbmx5IHVzZWQgYXQgcnVudGltZSwgd2UgZG9uJ3QgbmVlZCB0aGUgZ2VzdHVyZSBjb25maWcgb3IgXCJIYW1tZXJNb2R1bGVcIlxuICAgICAgLy8gYW5kIGNhbiByZW1vdmUgaXQgKGFsb25nIHdpdGggdGhlIGhhbW1lciBjb25maWcgdG9rZW4gaW1wb3J0IGlmIG5vIGxvbmdlciBuZWVkZWQpLlxuICAgICAgaWYgKCF1c2VkSW5UZW1wbGF0ZSkge1xuICAgICAgICB0aGlzLl9yZW1vdmVNYXRlcmlhbEdlc3R1cmVDb25maWdTZXR1cCgpO1xuICAgICAgICB0aGlzLl9yZW1vdmVIYW1tZXJNb2R1bGVSZWZlcmVuY2VzKCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3N0YW5kYXJkRXZlbnRzVXNlZEluVGVtcGxhdGUgJiYgIXRoaXMuX2N1c3RvbUV2ZW50c1VzZWRJblRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMuX3NldHVwSGFtbWVyV2l0aFN0YW5kYXJkRXZlbnRzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zZXR1cEhhbW1lcldpdGhDdXN0b21FdmVudHMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVtb3ZlSGFtbWVyU2V0dXAoKTtcbiAgICB9XG5cbiAgICAvLyBSZWNvcmQgdGhlIGNoYW5nZXMgY29sbGVjdGVkIGluIHRoZSBpbXBvcnQgbWFuYWdlci4gQ2hhbmdlcyBuZWVkIHRvIGJlIGFwcGxpZWRcbiAgICAvLyBvbmNlIHRoZSBpbXBvcnQgbWFuYWdlciByZWdpc3RlcmVkIGFsbCBpbXBvcnQgbW9kaWZpY2F0aW9ucy4gVGhpcyBhdm9pZHMgY29sbGlzaW9ucy5cbiAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLnJlY29yZENoYW5nZXMoKTtcblxuICAgIC8vIENyZWF0ZSBtaWdyYXRpb24gZmFpbHVyZXMgdGhhdCB3aWxsIGJlIHByaW50ZWQgYnkgdGhlIHVwZGF0ZS10b29sIG9uIG1pZ3JhdGlvblxuICAgIC8vIGNvbXBsZXRpb24uIFdlIG5lZWQgc3BlY2lhbCBsb2dpYyBmb3IgdXBkYXRpbmcgZmFpbHVyZSBwb3NpdGlvbnMgdG8gcmVmbGVjdFxuICAgIC8vIHRoZSBuZXcgc291cmNlIGZpbGUgYWZ0ZXIgbW9kaWZpY2F0aW9ucyBmcm9tIHRoZSBpbXBvcnQgbWFuYWdlci5cbiAgICB0aGlzLmZhaWx1cmVzLnB1c2goLi4udGhpcy5fY3JlYXRlTWlncmF0aW9uRmFpbHVyZXMoKSk7XG5cbiAgICAvLyBUaGUgdGVtcGxhdGUgY2hlY2sgZm9yIEhhbW1lckpTIGV2ZW50cyBpcyBub3QgY29tcGxldGVseSByZWxpYWJsZSBhcyB0aGUgZXZlbnRcbiAgICAvLyBvdXRwdXQgY291bGQgYWxzbyBiZSBmcm9tIGEgY29tcG9uZW50IGhhdmluZyBhbiBvdXRwdXQgbmFtZWQgc2ltaWxhcmx5IHRvIGEga25vd25cbiAgICAvLyBoYW1tZXJqcyBldmVudCAoZS5nLiBcIkBPdXRwdXQoKSBzbGlkZVwiKS4gVGhlIHVzYWdlIGlzIHRoZXJlZm9yZSBzb21ld2hhdCBhbWJpZ3VvdXNcbiAgICAvLyBhbmQgd2Ugd2FudCB0byBwcmludCBhIG1lc3NhZ2UgdGhhdCBkZXZlbG9wZXJzIG1pZ2h0IGJlIGFibGUgdG8gcmVtb3ZlIEhhbW1lciBtYW51YWxseS5cbiAgICBpZiAoIWhhc0N1c3RvbUdlc3R1cmVDb25maWdTZXR1cCAmJiAhdGhpcy5fdXNlZEluUnVudGltZSAmJiB1c2VkSW5UZW1wbGF0ZSkge1xuICAgICAgdGhpcy5wcmludEluZm8oXG4gICAgICAgICAgJ1RoZSBIYW1tZXJKUyB2OSBtaWdyYXRpb24gZm9yIEFuZ3VsYXIgQ29tcG9uZW50cyBtaWdyYXRlZCB0aGUgJyArXG4gICAgICAgICAgJ3Byb2plY3QgdG8ga2VlcCBIYW1tZXJKUyBpbnN0YWxsZWQsIGJ1dCBkZXRlY3RlZCBhbWJpZ3VvdXMgdXNhZ2Ugb2YgSGFtbWVySlMuIFBsZWFzZSAnICtcbiAgICAgICAgICAnbWFudWFsbHkgY2hlY2sgaWYgeW91IGNhbiByZW1vdmUgSGFtbWVySlMgZnJvbSB5b3VyIGFwcGxpY2F0aW9uLiBNb3JlIGRldGFpbHM6ICcgK1xuICAgICAgICAgICdodHRwczovL2dpdC5pby9uZy1tYXRlcmlhbC12OS1oYW1tZXItYW1iaWd1b3VzLXVzYWdlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgY3VycmVudCBwcm9qZWN0LiBUbyBhY2hpZXZlIHRoaXMsIHRoZVxuICAgKiBmb2xsb3dpbmcgc3RlcHMgYXJlIHBlcmZvcm1lZDpcbiAgICogICAxKSBDcmVhdGUgY29weSBvZiBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgKiAgIDIpIFJld3JpdGUgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgdG8gdGhlXG4gICAqICAgICAgbmV3IGdlc3R1cmUgY29uZmlnLlxuICAgKiAgIDMpIFNldHVwIHRoZSBIQU1NRVJfR0VTVFVSRV9DT05GSUcgaW4gdGhlIHJvb3QgYXBwIG1vZHVsZSAoaWYgbm90IGRvbmUgYWxyZWFkeSkuXG4gICAqICAgNCkgU2V0dXAgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaW4gdGhlIHJvb3QgYXBwIG1vZHVsZSAoaWYgbm90IGRvbmUgYWxyZWFkeSkuXG4gICAqL1xuICBwcml2YXRlIF9zZXR1cEhhbW1lcldpdGhDdXN0b21FdmVudHMoKSB7XG4gICAgY29uc3QgcHJvamVjdCA9IHRoaXMuY29udGV4dC5wcm9qZWN0O1xuICAgIGNvbnN0IHNvdXJjZVJvb3QgPSB0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShwcm9qZWN0LnNvdXJjZVJvb3QgfHwgcHJvamVjdC5yb290KTtcbiAgICBjb25zdCBuZXdDb25maWdQYXRoID1cbiAgICAgICAgam9pbihzb3VyY2VSb290LCB0aGlzLl9nZXRBdmFpbGFibGVHZXN0dXJlQ29uZmlnRmlsZU5hbWUoc291cmNlUm9vdCkpO1xuXG4gICAgLy8gQ29weSBnZXN0dXJlIGNvbmZpZyB0ZW1wbGF0ZSBpbnRvIHRoZSBDTEkgcHJvamVjdC5cbiAgICB0aGlzLmZpbGVTeXN0ZW0uY3JlYXRlKFxuICAgICAgICBuZXdDb25maWdQYXRoLCByZWFkRmlsZVN5bmMocmVxdWlyZS5yZXNvbHZlKEdFU1RVUkVfQ09ORklHX1RFTVBMQVRFX1BBVEgpLCAndXRmOCcpKTtcblxuICAgIC8vIFJlcGxhY2UgYWxsIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZXMgdG8gcmVzb2x2ZSB0byB0aGVcbiAgICAvLyBuZXdseSBjb3BpZWQgZ2VzdHVyZSBjb25maWcuXG4gICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuZm9yRWFjaChpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5maWxlU3lzdGVtLnJlc29sdmUoaS5ub2RlLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5fcmVwbGFjZUdlc3R1cmVDb25maWdSZWZlcmVuY2UoaSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSxcbiAgICAgICAgZ2V0TW9kdWxlU3BlY2lmaWVyKG5ld0NvbmZpZ1BhdGgsIGZpbGVQYXRoKSk7XG4gICAgfSk7XG5cbiAgICAvLyBTZXR1cCB0aGUgZ2VzdHVyZSBjb25maWcgcHJvdmlkZXIgYW5kIHRoZSBcIkhhbW1lck1vZHVsZVwiIGluIHRoZSByb290IG1vZHVsZVxuICAgIC8vIGlmIG5vdCBkb25lIGFscmVhZHkuIFRoZSBcIkhhbW1lck1vZHVsZVwiIGlzIG5lZWRlZCBpbiB2OSBzaW5jZSBpdCBlbmFibGVzIHRoZVxuICAgIC8vIEhhbW1lciBldmVudCBwbHVnaW4gdGhhdCB3YXMgcHJldmlvdXNseSBlbmFibGVkIGJ5IGRlZmF1bHQgaW4gdjguXG4gICAgdGhpcy5fc2V0dXBOZXdHZXN0dXJlQ29uZmlnSW5Sb290TW9kdWxlKG5ld0NvbmZpZ1BhdGgpO1xuICAgIHRoaXMuX3NldHVwSGFtbWVyTW9kdWxlSW5Sb290TW9kdWxlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB1cCB0aGUgc3RhbmRhcmQgaGFtbWVyIG1vZHVsZSBpbiB0aGUgcHJvamVjdCBhbmQgcmVtb3ZlcyBhbGxcbiAgICogcmVmZXJlbmNlcyB0byB0aGUgZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0dXBIYW1tZXJXaXRoU3RhbmRhcmRFdmVudHMoKSB7XG4gICAgLy8gU2V0dXAgdGhlIEhhbW1lck1vZHVsZS4gVGhlIEhhbW1lck1vZHVsZSBlbmFibGVzIHN1cHBvcnQgZm9yXG4gICAgLy8gdGhlIHN0YW5kYXJkIEhhbW1lckpTIGV2ZW50cy5cbiAgICB0aGlzLl9zZXR1cEhhbW1lck1vZHVsZUluUm9vdE1vZHVsZSgpO1xuICAgIHRoaXMuX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBIYW1tZXIgZnJvbSB0aGUgY3VycmVudCBwcm9qZWN0LiBUaGUgZm9sbG93aW5nIHN0ZXBzIGFyZSBwZXJmb3JtZWQ6XG4gICAqICAgMSkgRGVsZXRlIGFsbCBUeXBlU2NyaXB0IGltcG9ydHMgdG8gXCJoYW1tZXJqc1wiLlxuICAgKiAgIDIpIFJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgKiAgIDMpIFJlbW92ZSBcImhhbW1lcmpzXCIgZnJvbSBhbGwgaW5kZXggSFRNTCBmaWxlcyBvZiB0aGUgY3VycmVudCBwcm9qZWN0LlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyU2V0dXAoKSB7XG4gICAgdGhpcy5faW5zdGFsbEltcG9ydHMuZm9yRWFjaChpID0+IHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlSW1wb3J0QnlEZWNsYXJhdGlvbihpKSk7XG5cbiAgICB0aGlzLl9yZW1vdmVNYXRlcmlhbEdlc3R1cmVDb25maWdTZXR1cCgpO1xuICAgIHRoaXMuX3JlbW92ZUhhbW1lck1vZHVsZVJlZmVyZW5jZXMoKTtcbiAgICB0aGlzLl9yZW1vdmVIYW1tZXJGcm9tSW5kZXhGaWxlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgZ2VzdHVyZSBjb25maWcgc2V0dXAgYnkgZGVsZXRpbmcgYWxsIGZvdW5kIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXJcbiAgICogTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuIEFkZGl0aW9uYWxseSwgdW51c2VkIGltcG9ydHMgdG8gdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZ1xuICAgKiB0b2tlbiBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiIHdpbGwgYmUgcmVtb3ZlZCBhcyB3ZWxsLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKSB7XG4gICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuZm9yRWFjaChyID0+IHRoaXMuX3JlbW92ZUdlc3R1cmVDb25maWdSZWZlcmVuY2UocikpO1xuXG4gICAgdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLmZvckVhY2gociA9PiB7XG4gICAgICBpZiAoci5pc0ltcG9ydCkge1xuICAgICAgICB0aGlzLl9yZW1vdmVIYW1tZXJDb25maWdUb2tlbkltcG9ydElmVW51c2VkKHIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyTW9kdWxlUmVmZXJlbmNlcygpIHtcbiAgICB0aGlzLl9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzLmZvckVhY2goKHtub2RlLCBpc0ltcG9ydCwgaW1wb3J0RGF0YX0pID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5maWxlU3lzdGVtLmVkaXQodGhpcy5maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSkpO1xuXG4gICAgICAvLyBPbmx5IHJlbW92ZSB0aGUgaW1wb3J0IGZvciB0aGUgSGFtbWVyTW9kdWxlIGlmIHRoZSBtb2R1bGUgaGFzIGJlZW4gYWNjZXNzZWRcbiAgICAgIC8vIHRocm91Z2ggYSBub24tbmFtZXNwYWNlZCBpZGVudGlmaWVyIGFjY2Vzcy5cbiAgICAgIGlmICghaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2Vzcyhub2RlKSkge1xuICAgICAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChcbiAgICAgICAgICAgIHNvdXJjZUZpbGUsIEhBTU1FUl9NT0RVTEVfTkFNRSwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lKTtcbiAgICAgIH1cblxuICAgICAgLy8gRm9yIHJlZmVyZW5jZXMgZnJvbSB3aXRoaW4gYW4gaW1wb3J0LCB3ZSBkbyBub3QgbmVlZCB0byBkbyBhbnl0aGluZyBvdGhlciB0aGFuXG4gICAgICAvLyByZW1vdmluZyB0aGUgaW1wb3J0LiBGb3Igb3RoZXIgcmVmZXJlbmNlcywgd2UgcmVtb3ZlIHRoZSBpbXBvcnQgYW5kIHRoZSBhY3R1YWxcbiAgICAgIC8vIGlkZW50aWZpZXIgaW4gdGhlIG1vZHVsZSBpbXBvcnRzLlxuICAgICAgaWYgKGlzSW1wb3J0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaXMgcmVmZXJlbmNlZCB3aXRoaW4gYW4gYXJyYXkgbGl0ZXJhbCwgd2UgY2FuXG4gICAgICAvLyByZW1vdmUgdGhlIGVsZW1lbnQgZWFzaWx5LiBPdGhlcndpc2UgaWYgaXQncyBvdXRzaWRlIG9mIGFuIGFycmF5IGxpdGVyYWwsXG4gICAgICAvLyB3ZSBuZWVkIHRvIHJlcGxhY2UgdGhlIHJlZmVyZW5jZSB3aXRoIGFuIGVtcHR5IG9iamVjdCBsaXRlcmFsIHcvIHRvZG8gdG9cbiAgICAgIC8vIG5vdCBicmVhayB0aGUgYXBwbGljYXRpb24uXG4gICAgICBpZiAodHMuaXNBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUucGFyZW50KSkge1xuICAgICAgICAvLyBSZW1vdmVzIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb20gdGhlIHBhcmVudCBhcnJheSBleHByZXNzaW9uLiBSZW1vdmVzXG4gICAgICAgIC8vIHRoZSB0cmFpbGluZyBjb21tYSB0b2tlbiBpZiBwcmVzZW50LlxuICAgICAgICByZW1vdmVFbGVtZW50RnJvbUFycmF5RXhwcmVzc2lvbihub2RlLCByZWNvcmRlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWNvcmRlci5yZW1vdmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCkpO1xuICAgICAgICByZWNvcmRlci5pbnNlcnRSaWdodChub2RlLmdldFN0YXJ0KCksIGAvKiBUT0RPOiByZW1vdmUgKi8ge31gKTtcbiAgICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe1xuICAgICAgICAgIG5vZGU6IG5vZGUsXG4gICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byBkZWxldGUgcmVmZXJlbmNlIHRvIFwiSGFtbWVyTW9kdWxlXCIuJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWdcbiAgICogdG9rZW4gZnJvbSBwbGF0Zm9ybS1icm93c2VyLiBJZiBzbywga2VlcHMgdHJhY2sgb2YgdGhlIHJlZmVyZW5jZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9ySGFtbWVyR2VzdHVyZUNvbmZpZ1Rva2VuKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICBjb25zdCBpbXBvcnREYXRhID0gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGUsIHRoaXMudHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKGltcG9ydERhdGEgJiYgaW1wb3J0RGF0YS5zeW1ib2xOYW1lID09PSBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUgJiZcbiAgICAgICAgICBpbXBvcnREYXRhLm1vZHVsZU5hbWUgPT09IEhBTU1FUl9DT05GSUdfVE9LRU5fTU9EVUxFKSB7XG4gICAgICAgIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5wdXNoKFxuICAgICAgICAgICAge25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0OiB0cy5pc0ltcG9ydFNwZWNpZmllcihub2RlLnBhcmVudCl9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBIYW1tZXJNb2R1bGUgZnJvbVxuICAgKiBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi4gSWYgc28sIGtlZXBzIHRyYWNrIG9mIHRoZSByZWZlcmVuY2UuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0ZvckhhbW1lck1vZHVsZVJlZmVyZW5jZShub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgICAgY29uc3QgaW1wb3J0RGF0YSA9IGdldEltcG9ydE9mSWRlbnRpZmllcihub2RlLCB0aGlzLnR5cGVDaGVja2VyKTtcbiAgICAgIGlmIChpbXBvcnREYXRhICYmIGltcG9ydERhdGEuc3ltYm9sTmFtZSA9PT0gSEFNTUVSX01PRFVMRV9OQU1FICYmXG4gICAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lID09PSBIQU1NRVJfTU9EVUxFX0lNUE9SVCkge1xuICAgICAgICB0aGlzLl9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzLnB1c2goXG4gICAgICAgICAgICB7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnQ6IHRzLmlzSW1wb3J0U3BlY2lmaWVyKG5vZGUucGFyZW50KX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYW4gaW1wb3J0IHRvIHRoZSBIYW1tZXJKUyBwYWNrYWdlLiBJbXBvcnRzIHRvXG4gICAqIEhhbW1lckpTIHdoaWNoIGxvYWQgc3BlY2lmaWMgc3ltYm9scyBmcm9tIHRoZSBwYWNrYWdlIGFyZSBjb25zaWRlcmVkIGFzXG4gICAqIHJ1bnRpbWUgdXNhZ2Ugb2YgSGFtbWVyLiBlLmcuIGBpbXBvcnQge1N5bWJvbH0gZnJvbSBcImhhbW1lcmpzXCI7YC5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrSGFtbWVySW1wb3J0cyhub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgJiYgdHMuaXNTdHJpbmdMaXRlcmFsKG5vZGUubW9kdWxlU3BlY2lmaWVyKSAmJlxuICAgICAgICBub2RlLm1vZHVsZVNwZWNpZmllci50ZXh0ID09PSBIQU1NRVJfTU9EVUxFX1NQRUNJRklFUikge1xuICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gaW1wb3J0IHRvIEhhbW1lckpTIHRoYXQgaW1wb3J0cyBzeW1ib2xzLCBvciBpcyBuYW1lc3BhY2VkXG4gICAgICAvLyAoZS5nLiBcImltcG9ydCB7QSwgQn0gZnJvbSAuLi5cIiBvciBcImltcG9ydCAqIGFzIGhhbW1lciBmcm9tIC4uLlwiKSwgdGhlbiB3ZVxuICAgICAgLy8gYXNzdW1lIHRoYXQgc29tZSBleHBvcnRzIGFyZSB1c2VkIGF0IHJ1bnRpbWUuXG4gICAgICBpZiAobm9kZS5pbXBvcnRDbGF1c2UgJiZcbiAgICAgICAgICAhKG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MgJiYgdHMuaXNOYW1lZEltcG9ydHMobm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykgJiZcbiAgICAgICAgICAgIG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHMubGVuZ3RoID09PSAwKSkge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2luc3RhbGxJbXBvcnRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBhY2Nlc3NlcyB0aGUgZ2xvYmFsIFwiSGFtbWVyXCIgc3ltYm9sIGF0IHJ1bnRpbWUuIElmIHNvLFxuICAgKiB0aGUgbWlncmF0aW9uIHJ1bGUgc3RhdGUgd2lsbCBiZSB1cGRhdGVkIHRvIHJlZmxlY3QgdGhhdCBIYW1tZXIgaXMgdXNlZCBhdCBydW50aW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JSdW50aW1lSGFtbWVyVXNhZ2Uobm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0aGlzLl91c2VkSW5SdW50aW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRGV0ZWN0cyB1c2FnZXMgb2YgXCJ3aW5kb3cuSGFtbWVyXCIuXG4gICAgaWYgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUpICYmIG5vZGUubmFtZS50ZXh0ID09PSAnSGFtbWVyJykge1xuICAgICAgY29uc3Qgb3JpZ2luRXhwciA9IHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgICAgIGlmICh0cy5pc0lkZW50aWZpZXIob3JpZ2luRXhwcikgJiYgb3JpZ2luRXhwci50ZXh0ID09PSAnd2luZG93Jykge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZXRlY3RzIHVzYWdlcyBvZiBcIndpbmRvd1snSGFtbWVyJ11cIi5cbiAgICBpZiAodHMuaXNFbGVtZW50QWNjZXNzRXhwcmVzc2lvbihub2RlKSAmJiB0cy5pc1N0cmluZ0xpdGVyYWwobm9kZS5hcmd1bWVudEV4cHJlc3Npb24pICYmXG4gICAgICAgIG5vZGUuYXJndW1lbnRFeHByZXNzaW9uLnRleHQgPT09ICdIYW1tZXInKSB7XG4gICAgICBjb25zdCBvcmlnaW5FeHByID0gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihvcmlnaW5FeHByKSAmJiBvcmlnaW5FeHByLnRleHQgPT09ICd3aW5kb3cnKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZXMgdXNhZ2VzIG9mIHBsYWluIGlkZW50aWZpZXIgd2l0aCB0aGUgbmFtZSBcIkhhbW1lclwiLiBUaGVzZSB1c2FnZVxuICAgIC8vIGFyZSB2YWxpZCBpZiB0aGV5IHJlc29sdmUgdG8gXCJAdHlwZXMvaGFtbWVyanNcIi4gZS5nLiBcIm5ldyBIYW1tZXIobXlFbGVtZW50KVwiLlxuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkgJiYgbm9kZS50ZXh0ID09PSAnSGFtbWVyJyAmJlxuICAgICAgICAhdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZS5wYXJlbnQpICYmICF0cy5pc0VsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKG5vZGUucGFyZW50KSkge1xuICAgICAgY29uc3Qgc3ltYm9sID0gdGhpcy5fZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZSk7XG4gICAgICBpZiAoc3ltYm9sICYmIHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uICYmXG4gICAgICAgICAgc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lLmluY2x1ZGVzKCdAdHlwZXMvaGFtbWVyanMnKSkge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIHJlZmVyZW5jZXMgdGhlIGdlc3R1cmUgY29uZmlnIGZyb20gQW5ndWxhciBNYXRlcmlhbC5cbiAgICogSWYgc28sIHdlIGtlZXAgdHJhY2sgb2YgdGhlIGZvdW5kIHN5bWJvbCByZWZlcmVuY2UuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0Zvck1hdGVyaWFsR2VzdHVyZUNvbmZpZyhub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgICAgY29uc3QgaW1wb3J0RGF0YSA9IGdldEltcG9ydE9mSWRlbnRpZmllcihub2RlLCB0aGlzLnR5cGVDaGVja2VyKTtcbiAgICAgIGlmIChpbXBvcnREYXRhICYmIGltcG9ydERhdGEuc3ltYm9sTmFtZSA9PT0gR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSAmJlxuICAgICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZS5zdGFydHNXaXRoKCdAYW5ndWxhci9tYXRlcmlhbC8nKSkge1xuICAgICAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5wdXNoKFxuICAgICAgICAgICAge25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0OiB0cy5pc0ltcG9ydFNwZWNpZmllcihub2RlLnBhcmVudCl9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBIYW1tZXIgZ2VzdHVyZSBjb25maWcgdG9rZW4gcmVmZXJlbmNlIGlzIHBhcnQgb2YgYW5cbiAgICogQW5ndWxhciBwcm92aWRlciBkZWZpbml0aW9uIHRoYXQgc2V0cyB1cCBhIGN1c3RvbSBnZXN0dXJlIGNvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9yQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKHRva2VuUmVmOiBJZGVudGlmaWVyUmVmZXJlbmNlKTogYm9vbGVhbiB7XG4gICAgLy8gV2FsayB1cCB0aGUgdHJlZSB0byBsb29rIGZvciBhIHBhcmVudCBwcm9wZXJ0eSBhc3NpZ25tZW50IG9mIHRoZVxuICAgIC8vIHJlZmVyZW5jZSB0byB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnIHRva2VuLlxuICAgIGxldCBwcm9wZXJ0eUFzc2lnbm1lbnQ6IHRzLk5vZGUgPSB0b2tlblJlZi5ub2RlO1xuICAgIHdoaWxlIChwcm9wZXJ0eUFzc2lnbm1lbnQgJiYgIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5QXNzaWdubWVudCkpIHtcbiAgICAgIHByb3BlcnR5QXNzaWdubWVudCA9IHByb3BlcnR5QXNzaWdubWVudC5wYXJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKCFwcm9wZXJ0eUFzc2lnbm1lbnQgfHwgIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5QXNzaWdubWVudCkgfHxcbiAgICAgICAgZ2V0UHJvcGVydHlOYW1lVGV4dChwcm9wZXJ0eUFzc2lnbm1lbnQubmFtZSkgIT09ICdwcm92aWRlJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG9iamVjdExpdGVyYWxFeHByID0gcHJvcGVydHlBc3NpZ25tZW50LnBhcmVudDtcbiAgICBjb25zdCBtYXRjaGluZ0lkZW50aWZpZXJzID0gZmluZE1hdGNoaW5nQ2hpbGROb2RlcyhvYmplY3RMaXRlcmFsRXhwciwgdHMuaXNJZGVudGlmaWVyKTtcblxuICAgIC8vIFdlIG5haXZlbHkgYXNzdW1lIHRoYXQgaWYgdGhlcmUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIFwiR2VzdHVyZUNvbmZpZ1wiIGV4cG9ydFxuICAgIC8vIGZyb20gQW5ndWxhciBNYXRlcmlhbCBpbiB0aGUgcHJvdmlkZXIgbGl0ZXJhbCwgdGhhdCB0aGUgcHJvdmlkZXIgc2V0cyB1cCB0aGVcbiAgICAvLyBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgIHJldHVybiAhdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuc29tZShyID0+IG1hdGNoaW5nSWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBhbiBhdmFpbGFibGUgZmlsZSBuYW1lIGZvciB0aGUgZ2VzdHVyZSBjb25maWcgd2hpY2ggc2hvdWxkXG4gICAqIGJlIHN0b3JlZCBpbiB0aGUgc3BlY2lmaWVkIGZpbGUgcGF0aC5cbiAgICovXG4gIHByaXZhdGUgX2dldEF2YWlsYWJsZUdlc3R1cmVDb25maWdGaWxlTmFtZShzb3VyY2VSb290OiBQYXRoKSB7XG4gICAgaWYgKCF0aGlzLmZpbGVTeXN0ZW0uZXhpc3RzKGpvaW4oc291cmNlUm9vdCwgYCR7R0VTVFVSRV9DT05GSUdfRklMRV9OQU1FfS50c2ApKSkge1xuICAgICAgcmV0dXJuIGAke0dFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRX0udHNgO1xuICAgIH1cblxuICAgIGxldCBwb3NzaWJsZU5hbWUgPSBgJHtHRVNUVVJFX0NPTkZJR19GSUxFX05BTUV9LWA7XG4gICAgbGV0IGluZGV4ID0gMTtcbiAgICB3aGlsZSAodGhpcy5maWxlU3lzdGVtLmV4aXN0cyhqb2luKHNvdXJjZVJvb3QsIGAke3Bvc3NpYmxlTmFtZX0tJHtpbmRleH0udHNgKSkpIHtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICAgIHJldHVybiBgJHtwb3NzaWJsZU5hbWUgKyBpbmRleH0udHNgO1xuICB9XG5cbiAgLyoqIFJlcGxhY2VzIGEgZ2l2ZW4gZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlIHdpdGggYSBuZXcgaW1wb3J0LiAqL1xuICBwcml2YXRlIF9yZXBsYWNlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZShcbiAgICAgIHtub2RlLCBpbXBvcnREYXRhLCBpc0ltcG9ydH06IElkZW50aWZpZXJSZWZlcmVuY2UsIHN5bWJvbE5hbWU6IHN0cmluZyxcbiAgICAgIG1vZHVsZVNwZWNpZmllcjogc3RyaW5nKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5maWxlU3lzdGVtLmVkaXQodGhpcy5maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSkpO1xuXG4gICAgLy8gTGlzdCBvZiBhbGwgaWRlbnRpZmllcnMgcmVmZXJyaW5nIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgY3VycmVudCBmaWxlLiBUaGlzXG4gICAgLy8gYWxsb3dzIHVzIHRvIGFkZCBhbiBpbXBvcnQgZm9yIHRoZSBjb3BpZWQgZ2VzdHVyZSBjb25maWd1cmF0aW9uIHdpdGhvdXQgZ2VuZXJhdGluZyBhXG4gICAgLy8gbmV3IGlkZW50aWZpZXIgZm9yIHRoZSBpbXBvcnQgdG8gYXZvaWQgY29sbGlzaW9ucy4gaS5lLiBcIkdlc3R1cmVDb25maWdfMVwiLiBUaGUgaW1wb3J0XG4gICAgLy8gbWFuYWdlciBjaGVja3MgZm9yIHBvc3NpYmxlIG5hbWUgY29sbGlzaW9ucywgYnV0IGlzIGFibGUgdG8gaWdub3JlIHNwZWNpZmljIGlkZW50aWZpZXJzLlxuICAgIC8vIFdlIHVzZSB0aGlzIHRvIGlnbm9yZSBhbGwgcmVmZXJlbmNlcyB0byB0aGUgb3JpZ2luYWwgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyxcbiAgICAvLyBiZWNhdXNlIHRoZXNlIHdpbGwgYmUgcmVwbGFjZWQgYW5kIHRoZXJlZm9yZSB3aWxsIG5vdCBpbnRlcmZlcmUuXG4gICAgY29uc3QgZ2VzdHVyZUlkZW50aWZpZXJzSW5GaWxlID0gdGhpcy5fZ2V0R2VzdHVyZUNvbmZpZ0lkZW50aWZpZXJzT2ZGaWxlKHNvdXJjZUZpbGUpO1xuXG4gICAgLy8gSWYgdGhlIHBhcmVudCBvZiB0aGUgaWRlbnRpZmllciBpcyBhY2Nlc3NlZCB0aHJvdWdoIGEgbmFtZXNwYWNlLCB3ZSBjYW4ganVzdFxuICAgIC8vIGltcG9ydCB0aGUgbmV3IGdlc3R1cmUgY29uZmlnIHdpdGhvdXQgcmV3cml0aW5nIHRoZSBpbXBvcnQgZGVjbGFyYXRpb24gYmVjYXVzZVxuICAgIC8vIHRoZSBjb25maWcgaGFzIGJlZW4gaW1wb3J0ZWQgdGhyb3VnaCBhIG5hbWVzcGFjZWQgaW1wb3J0LlxuICAgIGlmIChpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGUpKSB7XG4gICAgICBjb25zdCBuZXdFeHByZXNzaW9uID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgICAgc291cmNlRmlsZSwgc3ltYm9sTmFtZSwgbW9kdWxlU3BlY2lmaWVyLCBmYWxzZSwgZ2VzdHVyZUlkZW50aWZpZXJzSW5GaWxlKTtcblxuICAgICAgcmVjb3JkZXIucmVtb3ZlKG5vZGUucGFyZW50LmdldFN0YXJ0KCksIG5vZGUucGFyZW50LmdldFdpZHRoKCkpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQobm9kZS5wYXJlbnQuZ2V0U3RhcnQoKSwgdGhpcy5fcHJpbnROb2RlKG5ld0V4cHJlc3Npb24sIHNvdXJjZUZpbGUpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZWxldGUgdGhlIG9sZCBpbXBvcnQgdG8gdGhlIFwiR2VzdHVyZUNvbmZpZ1wiLlxuICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICBzb3VyY2VGaWxlLCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUpO1xuXG4gICAgLy8gSWYgdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGlzIG5vdCBmcm9tIGluc2lkZSBvZiBhIGltcG9ydCwgd2UgbmVlZCB0byBhZGQgYSBuZXdcbiAgICAvLyBpbXBvcnQgdG8gdGhlIGNvcGllZCBnZXN0dXJlIGNvbmZpZyBhbmQgcmVwbGFjZSB0aGUgaWRlbnRpZmllci4gRm9yIHJlZmVyZW5jZXNcbiAgICAvLyB3aXRoaW4gYW4gaW1wb3J0LCB3ZSBkbyBub3RoaW5nIGJ1dCByZW1vdmluZyB0aGUgYWN0dWFsIGltcG9ydC4gVGhpcyBhbGxvd3MgdXNcbiAgICAvLyB0byByZW1vdmUgdW51c2VkIGltcG9ydHMgdG8gdGhlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgIGlmICghaXNJbXBvcnQpIHtcbiAgICAgIGNvbnN0IG5ld0V4cHJlc3Npb24gPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgICBzb3VyY2VGaWxlLCBzeW1ib2xOYW1lLCBtb2R1bGVTcGVjaWZpZXIsIGZhbHNlLCBnZXN0dXJlSWRlbnRpZmllcnNJbkZpbGUpO1xuXG4gICAgICByZWNvcmRlci5yZW1vdmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCkpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQobm9kZS5nZXRTdGFydCgpLCB0aGlzLl9wcmludE5vZGUobmV3RXhwcmVzc2lvbiwgc291cmNlRmlsZSkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgZ2l2ZW4gZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlIGFuZCBpdHMgY29ycmVzcG9uZGluZyBpbXBvcnQgZnJvbVxuICAgKiBpdHMgY29udGFpbmluZyBzb3VyY2UgZmlsZS4gSW1wb3J0cyB3aWxsIGJlIGFsd2F5cyByZW1vdmVkLCBidXQgaW4gc29tZSBjYXNlcyxcbiAgICogd2hlcmUgaXQncyBub3QgZ3VhcmFudGVlZCB0aGF0IGEgcmVtb3ZhbCBjYW4gYmUgcGVyZm9ybWVkIHNhZmVseSwgd2UganVzdFxuICAgKiBjcmVhdGUgYSBtaWdyYXRpb24gZmFpbHVyZSAoYW5kIGFkZCBhIFRPRE8gaWYgcG9zc2libGUpLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZSh7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnR9OiBJZGVudGlmaWVyUmVmZXJlbmNlKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5maWxlU3lzdGVtLmVkaXQodGhpcy5maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSkpO1xuICAgIC8vIE9ubHkgcmVtb3ZlIHRoZSBpbXBvcnQgZm9yIHRoZSBnZXN0dXJlIGNvbmZpZyBpZiB0aGUgZ2VzdHVyZSBjb25maWcgaGFzXG4gICAgLy8gYmVlbiBhY2Nlc3NlZCB0aHJvdWdoIGEgbm9uLW5hbWVzcGFjZWQgaWRlbnRpZmllciBhY2Nlc3MuXG4gICAgaWYgKCFpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGUpKSB7XG4gICAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChcbiAgICAgICAgICBzb3VyY2VGaWxlLCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUpO1xuICAgIH1cblxuICAgIC8vIEZvciByZWZlcmVuY2VzIGZyb20gd2l0aGluIGFuIGltcG9ydCwgd2UgZG8gbm90IG5lZWQgdG8gZG8gYW55dGhpbmcgb3RoZXIgdGhhblxuICAgIC8vIHJlbW92aW5nIHRoZSBpbXBvcnQuIEZvciBvdGhlciByZWZlcmVuY2VzLCB3ZSByZW1vdmUgdGhlIGltcG9ydCBhbmQgdGhlIHJlZmVyZW5jZVxuICAgIC8vIGlkZW50aWZpZXIgaWYgdXNlZCBpbnNpZGUgb2YgYSBwcm92aWRlciBkZWZpbml0aW9uLlxuICAgIGlmIChpc0ltcG9ydCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3ZpZGVyQXNzaWdubWVudCA9IG5vZGUucGFyZW50O1xuXG4gICAgLy8gT25seSByZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgZ2VzdHVyZSBjb25maWcgd2hpY2ggYXJlIHBhcnQgb2YgYSBzdGF0aWNhbGx5XG4gICAgLy8gYW5hbHl6YWJsZSBwcm92aWRlciBkZWZpbml0aW9uLiBXZSBvbmx5IHN1cHBvcnQgdGhlIGNvbW1vbiBjYXNlIG9mIGEgZ2VzdHVyZVxuICAgIC8vIGNvbmZpZyBwcm92aWRlciBkZWZpbml0aW9uIHdoZXJlIHRoZSBjb25maWcgaXMgc2V0IHVwIHRocm91Z2ggXCJ1c2VDbGFzc1wiLlxuICAgIC8vIE90aGVyd2lzZSwgaXQncyBub3QgZ3VhcmFudGVlZCB0aGF0IHdlIGNhbiBzYWZlbHkgcmVtb3ZlIHRoZSBwcm92aWRlciBkZWZpbml0aW9uLlxuICAgIGlmICghdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvdmlkZXJBc3NpZ25tZW50KSB8fFxuICAgICAgICBnZXRQcm9wZXJ0eU5hbWVUZXh0KHByb3ZpZGVyQXNzaWdubWVudC5uYW1lKSAhPT0gJ3VzZUNsYXNzJykge1xuICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe25vZGUsIG1lc3NhZ2U6IENBTk5PVF9SRU1PVkVfUkVGRVJFTkNFX0VSUk9SfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb2JqZWN0TGl0ZXJhbEV4cHIgPSBwcm92aWRlckFzc2lnbm1lbnQucGFyZW50O1xuICAgIGNvbnN0IHByb3ZpZGVUb2tlbiA9IG9iamVjdExpdGVyYWxFeHByLnByb3BlcnRpZXMuZmluZChcbiAgICAgICAgKHApOiBwIGlzIHRzLlByb3BlcnR5QXNzaWdubWVudCA9PlxuICAgICAgICAgICAgdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocCkgJiYgZ2V0UHJvcGVydHlOYW1lVGV4dChwLm5hbWUpID09PSAncHJvdmlkZScpO1xuXG4gICAgLy8gRG8gbm90IHJlbW92ZSB0aGUgcmVmZXJlbmNlIGlmIHRoZSBnZXN0dXJlIGNvbmZpZyBpcyBub3QgcGFydCBvZiBhIHByb3ZpZGVyIGRlZmluaXRpb24sXG4gICAgLy8gb3IgaWYgdGhlIHByb3ZpZGVkIHRva2UgaXMgbm90IHJlZmVycmluZyB0byB0aGUga25vd24gSEFNTUVSX0dFU1RVUkVfQ09ORklHIHRva2VuXG4gICAgLy8gZnJvbSBwbGF0Zm9ybS1icm93c2VyLlxuICAgIGlmICghcHJvdmlkZVRva2VuIHx8ICF0aGlzLl9pc1JlZmVyZW5jZVRvSGFtbWVyQ29uZmlnVG9rZW4ocHJvdmlkZVRva2VuLmluaXRpYWxpemVyKSkge1xuICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe25vZGUsIG1lc3NhZ2U6IENBTk5PVF9SRU1PVkVfUkVGRVJFTkNFX0VSUk9SfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ29sbGVjdCBhbGwgbmVzdGVkIGlkZW50aWZpZXJzIHdoaWNoIHdpbGwgYmUgZGVsZXRlZC4gVGhpcyBoZWxwcyB1c1xuICAgIC8vIGRldGVybWluaW5nIGlmIHdlIGNhbiByZW1vdmUgaW1wb3J0cyBmb3IgdGhlIFwiSEFNTUVSX0dFU1RVUkVfQ09ORklHXCIgdG9rZW4uXG4gICAgdGhpcy5fZGVsZXRlZElkZW50aWZpZXJzLnB1c2goLi4uZmluZE1hdGNoaW5nQ2hpbGROb2RlcyhvYmplY3RMaXRlcmFsRXhwciwgdHMuaXNJZGVudGlmaWVyKSk7XG5cbiAgICAvLyBJbiBjYXNlIHRoZSBmb3VuZCBwcm92aWRlciBkZWZpbml0aW9uIGlzIG5vdCBwYXJ0IG9mIGFuIGFycmF5IGxpdGVyYWwsXG4gICAgLy8gd2UgY2Fubm90IHNhZmVseSByZW1vdmUgdGhlIHByb3ZpZGVyLiBUaGlzIGlzIGJlY2F1c2UgaXQgY291bGQgYmUgZGVjbGFyZWRcbiAgICAvLyBhcyBhIHZhcmlhYmxlLiBlLmcuIFwiY29uc3QgZ2VzdHVyZVByb3ZpZGVyID0ge3Byb3ZpZGU6IC4uLCB1c2VDbGFzczogR2VzdHVyZUNvbmZpZ31cIi5cbiAgICAvLyBJbiB0aGF0IGNhc2UsIHdlIGp1c3QgYWRkIGFuIGVtcHR5IG9iamVjdCBsaXRlcmFsIHdpdGggVE9ETyBhbmQgcHJpbnQgYSBmYWlsdXJlLlxuICAgIGlmICghdHMuaXNBcnJheUxpdGVyYWxFeHByZXNzaW9uKG9iamVjdExpdGVyYWxFeHByLnBhcmVudCkpIHtcbiAgICAgIHJlY29yZGVyLnJlbW92ZShvYmplY3RMaXRlcmFsRXhwci5nZXRTdGFydCgpLCBvYmplY3RMaXRlcmFsRXhwci5nZXRXaWR0aCgpKTtcbiAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG9iamVjdExpdGVyYWxFeHByLmdldFN0YXJ0KCksIGAvKiBUT0RPOiByZW1vdmUgKi8ge31gKTtcbiAgICAgIHRoaXMuX25vZGVGYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgbm9kZTogb2JqZWN0TGl0ZXJhbEV4cHIsXG4gICAgICAgIG1lc3NhZ2U6IGBVbmFibGUgdG8gZGVsZXRlIHByb3ZpZGVyIGRlZmluaXRpb24gZm9yIFwiR2VzdHVyZUNvbmZpZ1wiIGNvbXBsZXRlbHkuIGAgK1xuICAgICAgICAgICAgYFBsZWFzZSBjbGVhbiB1cCB0aGUgcHJvdmlkZXIuYFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlcyB0aGUgb2JqZWN0IGxpdGVyYWwgZnJvbSB0aGUgcGFyZW50IGFycmF5IGV4cHJlc3Npb24uIFJlbW92ZXNcbiAgICAvLyB0aGUgdHJhaWxpbmcgY29tbWEgdG9rZW4gaWYgcHJlc2VudC5cbiAgICByZW1vdmVFbGVtZW50RnJvbUFycmF5RXhwcmVzc2lvbihvYmplY3RMaXRlcmFsRXhwciwgcmVjb3JkZXIpO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgdGhlIGdpdmVuIGhhbW1lciBjb25maWcgdG9rZW4gaW1wb3J0IGlmIGl0IGlzIG5vdCB1c2VkLiAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJDb25maWdUb2tlbkltcG9ydElmVW51c2VkKHtub2RlLCBpbXBvcnREYXRhfTogSWRlbnRpZmllclJlZmVyZW5jZSkge1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCBpc1Rva2VuVXNlZCA9IHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKFxuICAgICAgICByID0+ICFyLmlzSW1wb3J0ICYmICFpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKHIubm9kZSkgJiZcbiAgICAgICAgICAgIHIubm9kZS5nZXRTb3VyY2VGaWxlKCkgPT09IHNvdXJjZUZpbGUgJiYgIXRoaXMuX2RlbGV0ZWRJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKTtcblxuICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gcmVtb3ZlIHRoZSBpbXBvcnQgZm9yIHRoZSB0b2tlbiBpZiB0aGUgdG9rZW4gaXNcbiAgICAvLyBzdGlsbCB1c2VkIHNvbWV3aGVyZS5cbiAgICBpZiAoIWlzVG9rZW5Vc2VkKSB7XG4gICAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChcbiAgICAgICAgICBzb3VyY2VGaWxlLCBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUsIGltcG9ydERhdGEubW9kdWxlTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlbW92ZXMgSGFtbWVyIGZyb20gYWxsIGluZGV4IEhUTUwgZmlsZXMgb2YgdGhlIGN1cnJlbnQgcHJvamVjdC4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyRnJvbUluZGV4RmlsZSgpIHtcbiAgICBjb25zdCBpbmRleEZpbGVQYXRocyA9IGdldFByb2plY3RJbmRleEZpbGVzKHRoaXMuY29udGV4dC5wcm9qZWN0KTtcbiAgICBpbmRleEZpbGVQYXRocy5mb3JFYWNoKGZpbGVQYXRoID0+IHtcbiAgICAgIGlmICghdGhpcy5maWxlU3lzdGVtLmV4aXN0cyhmaWxlUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBodG1sQ29udGVudCA9IHRoaXMuZmlsZVN5c3RlbS5yZWFkKGZpbGVQYXRoKSE7XG4gICAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZmlsZVN5c3RlbS5lZGl0KGZpbGVQYXRoKTtcblxuICAgICAgZmluZEhhbW1lclNjcmlwdEltcG9ydEVsZW1lbnRzKGh0bWxDb250ZW50KVxuICAgICAgICAgIC5mb3JFYWNoKGVsID0+IHJlbW92ZUVsZW1lbnRGcm9tSHRtbChlbCwgcmVjb3JkZXIpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSBIYW1tZXIgZ2VzdHVyZSBjb25maWcgaW4gdGhlIHJvb3QgbW9kdWxlIGlmIG5lZWRlZC4gKi9cbiAgcHJpdmF0ZSBfc2V0dXBOZXdHZXN0dXJlQ29uZmlnSW5Sb290TW9kdWxlKGdlc3R1cmVDb25maWdQYXRoOiBQYXRoKSB7XG4gICAgY29uc3Qge3Byb2plY3R9ID0gdGhpcy5jb250ZXh0O1xuICAgIGNvbnN0IG1haW5GaWxlUGF0aCA9IGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KTtcbiAgICBjb25zdCByb290TW9kdWxlU3ltYm9sID0gdGhpcy5fZ2V0Um9vdE1vZHVsZVN5bWJvbChtYWluRmlsZVBhdGgpO1xuXG4gICAgaWYgKHJvb3RNb2R1bGVTeW1ib2wgPT09IG51bGwgfHwgcm9vdE1vZHVsZVN5bWJvbC52YWx1ZURlY2xhcmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiBtYWluRmlsZVBhdGgsXG4gICAgICAgIG1lc3NhZ2U6IGBDb3VsZCBub3Qgc2V0dXAgSGFtbWVyIGdlc3R1cmVzIGluIG1vZHVsZS4gUGxlYXNlIGAgK1xuICAgICAgICAgICAgYG1hbnVhbGx5IGVuc3VyZSB0aGF0IHRoZSBIYW1tZXIgZ2VzdHVyZSBjb25maWcgaXMgc2V0IHVwLmAsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VGaWxlID0gcm9vdE1vZHVsZVN5bWJvbC52YWx1ZURlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCBtZXRhZGF0YSA9IGdldERlY29yYXRvck1ldGFkYXRhKHNvdXJjZUZpbGUsICdOZ01vZHVsZScsICdAYW5ndWxhci9jb3JlJykgYXNcbiAgICAgICAgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25bXTtcblxuICAgIC8vIElmIG5vIFwiTmdNb2R1bGVcIiBkZWZpbml0aW9uIGlzIGZvdW5kIGluc2lkZSB0aGUgc291cmNlIGZpbGUsIHdlIGp1c3QgZG8gbm90aGluZy5cbiAgICBpZiAoIW1ldGFkYXRhLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdChmaWxlUGF0aCk7XG4gICAgY29uc3QgcHJvdmlkZXJzRmllbGQgPSBnZXRNZXRhZGF0YUZpZWxkKG1ldGFkYXRhWzBdLCAncHJvdmlkZXJzJylbMF07XG4gICAgY29uc3QgcHJvdmlkZXJJZGVudGlmaWVycyA9XG4gICAgICAgIHByb3ZpZGVyc0ZpZWxkID8gZmluZE1hdGNoaW5nQ2hpbGROb2Rlcyhwcm92aWRlcnNGaWVsZCwgdHMuaXNJZGVudGlmaWVyKSA6IG51bGw7XG4gICAgY29uc3QgZ2VzdHVyZUNvbmZpZ0V4cHIgPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgc291cmNlRmlsZSwgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSxcbiAgICAgICAgZ2V0TW9kdWxlU3BlY2lmaWVyKGdlc3R1cmVDb25maWdQYXRoLCBmaWxlUGF0aCksIGZhbHNlLFxuICAgICAgICB0aGlzLl9nZXRHZXN0dXJlQ29uZmlnSWRlbnRpZmllcnNPZkZpbGUoc291cmNlRmlsZSkpO1xuICAgIGNvbnN0IGhhbW1lckNvbmZpZ1Rva2VuRXhwciA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICBzb3VyY2VGaWxlLCBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUsIEhBTU1FUl9DT05GSUdfVE9LRU5fTU9EVUxFKTtcbiAgICBjb25zdCBuZXdQcm92aWRlck5vZGUgPSB0cy5jcmVhdGVPYmplY3RMaXRlcmFsKFtcbiAgICAgIHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgncHJvdmlkZScsIGhhbW1lckNvbmZpZ1Rva2VuRXhwciksXG4gICAgICB0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQoJ3VzZUNsYXNzJywgZ2VzdHVyZUNvbmZpZ0V4cHIpXG4gICAgXSk7XG5cbiAgICAvLyBJZiB0aGUgcHJvdmlkZXJzIGZpZWxkIGV4aXN0cyBhbmQgYWxyZWFkeSBjb250YWlucyByZWZlcmVuY2VzIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZVxuICAgIC8vIGNvbmZpZyB0b2tlbiBhbmQgdGhlIGdlc3R1cmUgY29uZmlnLCB3ZSBuYWl2ZWx5IGFzc3VtZSB0aGF0IHRoZSBnZXN0dXJlIGNvbmZpZyBpc1xuICAgIC8vIGFscmVhZHkgc2V0IHVwLiBXZSBvbmx5IHdhbnQgdG8gYWRkIHRoZSBnZXN0dXJlIGNvbmZpZyBwcm92aWRlciBpZiBpdCBpcyBub3Qgc2V0IHVwLlxuICAgIGlmICghcHJvdmlkZXJJZGVudGlmaWVycyB8fFxuICAgICAgICAhKHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gcHJvdmlkZXJJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKSAmJlxuICAgICAgICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLnNvbWUociA9PiBwcm92aWRlcklkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpKSkge1xuICAgICAgY29uc3Qgc3ltYm9sTmFtZSA9IHRoaXMuX3ByaW50Tm9kZShuZXdQcm92aWRlck5vZGUsIHNvdXJjZUZpbGUpO1xuICAgICAgYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhKHNvdXJjZUZpbGUsIHNvdXJjZUZpbGUuZmlsZU5hbWUsICdwcm92aWRlcnMnLCBzeW1ib2xOYW1lLCBudWxsKVxuICAgICAgICAuZm9yRWFjaChjaGFuZ2UgPT4ge1xuICAgICAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRDaGFuZ2UpIHtcbiAgICAgICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgVHlwZVNjcmlwdCBzeW1ib2wgb2YgdGhlIHJvb3QgbW9kdWxlIGJ5IGxvb2tpbmcgZm9yIHRoZSBtb2R1bGVcbiAgICogYm9vdHN0cmFwIGV4cHJlc3Npb24gaW4gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS5cbiAgICovXG4gIHByaXZhdGUgX2dldFJvb3RNb2R1bGVTeW1ib2wobWFpbkZpbGVQYXRoOiBQYXRoKTogdHMuU3ltYm9sfG51bGwge1xuICAgIGNvbnN0IG1haW5GaWxlID0gdGhpcy5wcm9ncmFtLmdldFNvdXJjZUZpbGUobWFpbkZpbGVQYXRoKTtcbiAgICBpZiAoIW1haW5GaWxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhcHBNb2R1bGVFeHByID0gZmluZE1haW5Nb2R1bGVFeHByZXNzaW9uKG1haW5GaWxlKTtcbiAgICBpZiAoIWFwcE1vZHVsZUV4cHIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGFwcE1vZHVsZVN5bWJvbCA9IHRoaXMuX2dldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKHVud3JhcEV4cHJlc3Npb24oYXBwTW9kdWxlRXhwcikpO1xuICAgIGlmICghYXBwTW9kdWxlU3ltYm9sIHx8ICFhcHBNb2R1bGVTeW1ib2wudmFsdWVEZWNsYXJhdGlvbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBhcHBNb2R1bGVTeW1ib2w7XG4gIH1cblxuICAvKiogU2V0cyB1cCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpbiB0aGUgcm9vdCBtb2R1bGUgb2YgdGhlIGN1cnJlbnQgcHJvamVjdC4gKi9cbiAgcHJpdmF0ZSBfc2V0dXBIYW1tZXJNb2R1bGVJblJvb3RNb2R1bGUoKSB7XG4gICAgY29uc3Qge3Byb2plY3R9ID0gdGhpcy5jb250ZXh0O1xuICAgIGNvbnN0IG1haW5GaWxlUGF0aCA9IGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KTtcbiAgICBjb25zdCByb290TW9kdWxlU3ltYm9sID0gdGhpcy5fZ2V0Um9vdE1vZHVsZVN5bWJvbChtYWluRmlsZVBhdGgpO1xuXG4gICAgaWYgKHJvb3RNb2R1bGVTeW1ib2wgPT09IG51bGwgfHwgcm9vdE1vZHVsZVN5bWJvbC52YWx1ZURlY2xhcmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiBtYWluRmlsZVBhdGgsXG4gICAgICAgIG1lc3NhZ2U6IGBDb3VsZCBub3Qgc2V0dXAgSGFtbWVyTW9kdWxlLiBQbGVhc2UgbWFudWFsbHkgc2V0IHVwIHRoZSBcIkhhbW1lck1vZHVsZVwiIGAgK1xuICAgICAgICAgICAgYGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuYCxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSByb290TW9kdWxlU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IG1ldGFkYXRhID0gZ2V0RGVjb3JhdG9yTWV0YWRhdGEoc291cmNlRmlsZSwgJ05nTW9kdWxlJywgJ0Bhbmd1bGFyL2NvcmUnKSBhc1xuICAgICAgICB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbltdO1xuICAgIGlmICghbWV0YWRhdGEubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW1wb3J0c0ZpZWxkID0gZ2V0TWV0YWRhdGFGaWVsZChtZXRhZGF0YVswXSwgJ2ltcG9ydHMnKVswXTtcbiAgICBjb25zdCBpbXBvcnRJZGVudGlmaWVycyA9XG4gICAgICAgIGltcG9ydHNGaWVsZCA/IGZpbmRNYXRjaGluZ0NoaWxkTm9kZXMoaW1wb3J0c0ZpZWxkLCB0cy5pc0lkZW50aWZpZXIpIDogbnVsbDtcbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZmlsZVN5c3RlbS5lZGl0KHRoaXMuZmlsZVN5c3RlbS5yZXNvbHZlKHNvdXJjZUZpbGUuZmlsZU5hbWUpKTtcbiAgICBjb25zdCBoYW1tZXJNb2R1bGVFeHByID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgIHNvdXJjZUZpbGUsIEhBTU1FUl9NT0RVTEVfTkFNRSwgSEFNTUVSX01PRFVMRV9JTVBPUlQpO1xuXG4gICAgLy8gSWYgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaXMgbm90IGFscmVhZHkgaW1wb3J0ZWQgaW4gdGhlIGFwcCBtb2R1bGUsIHdlIHNldCBpdCB1cFxuICAgIC8vIGJ5IGFkZGluZyBpdCB0byB0aGUgXCJpbXBvcnRzXCIgZmllbGQgb2YgdGhlIGFwcCBtb2R1bGUuXG4gICAgaWYgKCFpbXBvcnRJZGVudGlmaWVycyB8fFxuICAgICAgICAhdGhpcy5faGFtbWVyTW9kdWxlUmVmZXJlbmNlcy5zb21lKHIgPT4gaW1wb3J0SWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSkpIHtcbiAgICAgIGNvbnN0IHN5bWJvbE5hbWUgPSB0aGlzLl9wcmludE5vZGUoaGFtbWVyTW9kdWxlRXhwciwgc291cmNlRmlsZSk7XG4gICAgICBhZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEoc291cmNlRmlsZSwgc291cmNlRmlsZS5maWxlTmFtZSwgJ2ltcG9ydHMnLCBzeW1ib2xOYW1lLCBudWxsKVxuICAgICAgICAuZm9yRWFjaChjaGFuZ2UgPT4ge1xuICAgICAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRDaGFuZ2UpIHtcbiAgICAgICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogUHJpbnRzIGEgZ2l2ZW4gbm9kZSB3aXRoaW4gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS4gKi9cbiAgcHJpdmF0ZSBfcHJpbnROb2RlKG5vZGU6IHRzLk5vZGUsIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgbm9kZSwgc291cmNlRmlsZSk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgcmVmZXJlbmNlZCBnZXN0dXJlIGNvbmZpZyBpZGVudGlmaWVycyBvZiBhIGdpdmVuIHNvdXJjZSBmaWxlICovXG4gIHByaXZhdGUgX2dldEdlc3R1cmVDb25maWdJZGVudGlmaWVyc09mRmlsZShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogdHMuSWRlbnRpZmllcltdIHtcbiAgICByZXR1cm4gdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuZmlsdGVyKGQgPT4gZC5ub2RlLmdldFNvdXJjZUZpbGUoKSA9PT0gc291cmNlRmlsZSlcbiAgICAgICAgLm1hcChkID0+IGQubm9kZSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc3ltYm9sIHRoYXQgY29udGFpbnMgdGhlIHZhbHVlIGRlY2xhcmF0aW9uIG9mIHRoZSBzcGVjaWZpZWQgbm9kZS4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZTogdHMuTm9kZSk6IHRzLlN5bWJvbHx1bmRlZmluZWQge1xuICAgIGNvbnN0IHN5bWJvbCA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihub2RlKTtcblxuICAgIC8vIFN5bWJvbHMgY2FuIGJlIGFsaWFzZXMgb2YgdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC4gZS5nLiBpbiBuYW1lZCBpbXBvcnQgc3BlY2lmaWVycy5cbiAgICAvLyBXZSBuZWVkIHRvIHJlc29sdmUgdGhlIGFsaWFzZWQgc3ltYm9sIGJhY2sgdG8gdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYml0d2lzZVxuICAgIGlmIChzeW1ib2wgJiYgKHN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSAhPT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudHlwZUNoZWNrZXIuZ2V0QWxpYXNlZFN5bWJvbChzeW1ib2wpO1xuICAgIH1cbiAgICByZXR1cm4gc3ltYm9sO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBleHByZXNzaW9uIHJlc29sdmVzIHRvIGEgaGFtbWVyIGdlc3R1cmUgY29uZmlnXG4gICAqIHRva2VuIHJlZmVyZW5jZSBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfaXNSZWZlcmVuY2VUb0hhbW1lckNvbmZpZ1Rva2VuKGV4cHI6IHRzLkV4cHJlc3Npb24pIHtcbiAgICBjb25zdCB1bndyYXBwZWQgPSB1bndyYXBFeHByZXNzaW9uKGV4cHIpO1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIodW53cmFwcGVkKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gci5ub2RlID09PSB1bndyYXBwZWQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24odW53cmFwcGVkKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gci5ub2RlID09PSB1bndyYXBwZWQubmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIG1pZ3JhdGlvbiBmYWlsdXJlcyBvZiB0aGUgY29sbGVjdGVkIG5vZGUgZmFpbHVyZXMuIFRoZSByZXR1cm5lZCBtaWdyYXRpb25cbiAgICogZmFpbHVyZXMgYXJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgcG9zdC1taWdyYXRpb24gc3RhdGUgb2Ygc291cmNlIGZpbGVzLiBNZWFuaW5nXG4gICAqIHRoYXQgZmFpbHVyZSBwb3NpdGlvbnMgYXJlIGNvcnJlY3RlZCBpZiBzb3VyY2UgZmlsZSBtb2RpZmljYXRpb25zIHNoaWZ0ZWQgbGluZXMuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVNaWdyYXRpb25GYWlsdXJlcygpOiBNaWdyYXRpb25GYWlsdXJlW10ge1xuICAgIHJldHVybiB0aGlzLl9ub2RlRmFpbHVyZXMubWFwKCh7bm9kZSwgbWVzc2FnZX0pID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICAgIGNvbnN0IG9mZnNldCA9IG5vZGUuZ2V0U3RhcnQoKTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdHMuZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24oc291cmNlRmlsZSwgbm9kZS5nZXRTdGFydCgpKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aW9uOiB0aGlzLl9pbXBvcnRNYW5hZ2VyLmNvcnJlY3ROb2RlUG9zaXRpb24obm9kZSwgb2Zmc2V0LCBwb3NpdGlvbiksXG4gICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIGZpbGVQYXRoOiB0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShzb3VyY2VGaWxlLmZpbGVOYW1lKSxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKiogR2xvYmFsIHN0YXRlIG9mIHdoZXRoZXIgSGFtbWVyIGlzIHVzZWQgaW4gYW55IGFuYWx5emVkIHByb2plY3QgdGFyZ2V0LiAqL1xuICBzdGF0aWMgZ2xvYmFsVXNlc0hhbW1lciA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBTdGF0aWMgbWlncmF0aW9uIHJ1bGUgbWV0aG9kIHRoYXQgd2lsbCBiZSBjYWxsZWQgb25jZSBhbGwgcHJvamVjdCB0YXJnZXRzXG4gICAqIGhhdmUgYmVlbiBtaWdyYXRlZCBpbmRpdmlkdWFsbHkuIFRoaXMgbWV0aG9kIGNhbiBiZSB1c2VkIHRvIG1ha2UgY2hhbmdlcyBiYXNlZFxuICAgKiBvbiB0aGUgYW5hbHlzaXMgb2YgdGhlIGluZGl2aWR1YWwgdGFyZ2V0cy4gRm9yIGV4YW1wbGU6IHdlIG9ubHkgcmVtb3ZlIEhhbW1lclxuICAgKiBmcm9tIHRoZSBcInBhY2thZ2UuanNvblwiIGlmIGl0IGlzIG5vdCB1c2VkIGluICphbnkqIHByb2plY3QgdGFyZ2V0LlxuICAgKi9cbiAgc3RhdGljIGdsb2JhbFBvc3RNaWdyYXRpb24odHJlZTogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCk6IFBvc3RNaWdyYXRpb25BY3Rpb24ge1xuICAgIC8vIEFsd2F5cyBub3RpZnkgdGhlIGRldmVsb3BlciB0aGF0IHRoZSBIYW1tZXIgdjkgbWlncmF0aW9uIGRvZXMgbm90IG1pZ3JhdGUgdGVzdHMuXG4gICAgY29udGV4dC5sb2dnZXIuaW5mbyhcbiAgICAgICAgJ1xcbuKaoCAgR2VuZXJhbCBub3RpY2U6IFRoZSBIYW1tZXJKUyB2OSBtaWdyYXRpb24gZm9yIEFuZ3VsYXIgQ29tcG9uZW50cyBpcyBub3QgYWJsZSB0byAnICtcbiAgICAgICAgJ21pZ3JhdGUgdGVzdHMuIFBsZWFzZSBtYW51YWxseSBjbGVhbiB1cCB0ZXN0cyBpbiB5b3VyIHByb2plY3QgaWYgdGhleSByZWx5IG9uICcgK1xuICAgICAgICAodGhpcy5nbG9iYWxVc2VzSGFtbWVyID8gJ3RoZSBkZXByZWNhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuJyA6ICdIYW1tZXJKUy4nKSk7XG4gICAgY29udGV4dC5sb2dnZXIuaW5mbyhcbiAgICAgICAgJ1JlYWQgbW9yZSBhYm91dCBtaWdyYXRpbmcgdGVzdHM6IGh0dHBzOi8vZ2l0LmlvL25nLW1hdGVyaWFsLXY5LWhhbW1lci1taWdyYXRlLXRlc3RzJyk7XG5cbiAgICBpZiAoIXRoaXMuZ2xvYmFsVXNlc0hhbW1lciAmJiB0aGlzLl9yZW1vdmVIYW1tZXJGcm9tUGFja2FnZUpzb24odHJlZSkpIHtcbiAgICAgIC8vIFNpbmNlIEhhbW1lciBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHdvcmtzcGFjZSBcInBhY2thZ2UuanNvblwiIGZpbGUsXG4gICAgICAvLyB3ZSBzY2hlZHVsZSBhIG5vZGUgcGFja2FnZSBpbnN0YWxsIHRhc2sgdG8gcmVmcmVzaCB0aGUgbG9jayBmaWxlLlxuICAgICAgcmV0dXJuIHtydW5QYWNrYWdlTWFuYWdlcjogdHJ1ZX07XG4gICAgfVxuXG4gICAgLy8gQ2xlYW4gZ2xvYmFsIHN0YXRlIG9uY2UgdGhlIHdvcmtzcGFjZSBoYXMgYmVlbiBtaWdyYXRlZC4gVGhpcyBpcyB0ZWNobmljYWxseVxuICAgIC8vIG5vdCBuZWNlc3NhcnkgaW4gXCJuZyB1cGRhdGVcIiwgYnV0IGluIHRlc3RzIHdlIHJlLXVzZSB0aGUgc2FtZSBydWxlIGNsYXNzLlxuICAgIHRoaXMuZ2xvYmFsVXNlc0hhbW1lciA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGhhbW1lciBwYWNrYWdlIGZyb20gdGhlIHdvcmtzcGFjZSBcInBhY2thZ2UuanNvblwiLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIEhhbW1lciB3YXMgc2V0IHVwIGFuZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIFwicGFja2FnZS5qc29uXCJcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIF9yZW1vdmVIYW1tZXJGcm9tUGFja2FnZUpzb24odHJlZTogVHJlZSk6IGJvb2xlYW4ge1xuICAgIGlmICghdHJlZS5leGlzdHMoJy9wYWNrYWdlLmpzb24nKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZSh0cmVlLnJlYWQoJy9wYWNrYWdlLmpzb24nKSEudG9TdHJpbmcoJ3V0ZjgnKSkgYXMgUGFja2FnZUpzb247XG5cbiAgICAvLyBXZSBkbyBub3QgaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHNvbWVvbmUgbWFudWFsbHkgYWRkZWQgXCJoYW1tZXJqc1wiIHRvIHRoZSBkZXYgZGVwZW5kZW5jaWVzLlxuICAgIGlmIChwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXMgJiYgcGFja2FnZUpzb24uZGVwZW5kZW5jaWVzW0hBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSXSkge1xuICAgICAgZGVsZXRlIHBhY2thZ2VKc29uLmRlcGVuZGVuY2llc1tIQU1NRVJfTU9EVUxFX1NQRUNJRklFUl07XG4gICAgICB0cmVlLm92ZXJ3cml0ZSgnL3BhY2thZ2UuanNvbicsIEpTT04uc3RyaW5naWZ5KHBhY2thZ2VKc29uLCBudWxsLCAyKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgdW53cmFwcyBhIGdpdmVuIGV4cHJlc3Npb24gaWYgaXQgaXMgd3JhcHBlZFxuICogYnkgcGFyZW50aGVzaXMsIHR5cGUgY2FzdHMgb3IgdHlwZSBhc3NlcnRpb25zLlxuICovXG5mdW5jdGlvbiB1bndyYXBFeHByZXNzaW9uKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlIHtcbiAgaWYgKHRzLmlzUGFyZW50aGVzaXplZEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9IGVsc2UgaWYgKHRzLmlzQXNFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgcmV0dXJuIHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgfSBlbHNlIGlmICh0cy5pc1R5cGVBc3NlcnRpb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9XG4gIHJldHVybiBub2RlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBzcGVjaWZpZWQgcGF0aCB0byBhIHZhbGlkIFR5cGVTY3JpcHQgbW9kdWxlIHNwZWNpZmllciB3aGljaCBpc1xuICogcmVsYXRpdmUgdG8gdGhlIGdpdmVuIGNvbnRhaW5pbmcgZmlsZS5cbiAqL1xuZnVuY3Rpb24gZ2V0TW9kdWxlU3BlY2lmaWVyKG5ld1BhdGg6IFBhdGgsIGNvbnRhaW5pbmdGaWxlOiBQYXRoKSB7XG4gIGxldCByZXN1bHQgPSByZWxhdGl2ZShkaXJuYW1lKGNvbnRhaW5pbmdGaWxlKSwgbmV3UGF0aCkucmVwbGFjZSgvXFxcXC9nLCAnLycpLnJlcGxhY2UoL1xcLnRzJC8sICcnKTtcbiAgaWYgKCFyZXN1bHQuc3RhcnRzV2l0aCgnLicpKSB7XG4gICAgcmVzdWx0ID0gYC4vJHtyZXN1bHR9YDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHRleHQgb2YgdGhlIGdpdmVuIHByb3BlcnR5IG5hbWUuXG4gKiBAcmV0dXJucyBUZXh0IG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSBuYW1lLiBOdWxsIGlmIG5vdCBzdGF0aWNhbGx5IGFuYWx5emFibGUuXG4gKi9cbmZ1bmN0aW9uIGdldFByb3BlcnR5TmFtZVRleHQobm9kZTogdHMuUHJvcGVydHlOYW1lKTogc3RyaW5nfG51bGwge1xuICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpIHx8IHRzLmlzU3RyaW5nTGl0ZXJhbExpa2Uobm9kZSkpIHtcbiAgICByZXR1cm4gbm9kZS50ZXh0O1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIGlkZW50aWZpZXIgaXMgcGFydCBvZiBhIG5hbWVzcGFjZWQgYWNjZXNzLiAqL1xuZnVuY3Rpb24gaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2Vzcyhub2RlOiB0cy5JZGVudGlmaWVyKTogYm9vbGVhbiB7XG4gIHJldHVybiB0cy5pc1F1YWxpZmllZE5hbWUobm9kZS5wYXJlbnQpIHx8IHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUucGFyZW50KTtcbn1cblxuLyoqXG4gKiBXYWxrcyB0aHJvdWdoIHRoZSBzcGVjaWZpZWQgbm9kZSBhbmQgcmV0dXJucyBhbGwgY2hpbGQgbm9kZXMgd2hpY2ggbWF0Y2ggdGhlXG4gKiBnaXZlbiBwcmVkaWNhdGUuXG4gKi9cbmZ1bmN0aW9uIGZpbmRNYXRjaGluZ0NoaWxkTm9kZXM8VCBleHRlbmRzIHRzLk5vZGU+KFxuICAgIHBhcmVudDogdHMuTm9kZSwgcHJlZGljYXRlOiAobm9kZTogdHMuTm9kZSkgPT4gbm9kZSBpcyBUKTogVFtdIHtcbiAgY29uc3QgcmVzdWx0OiBUW10gPSBbXTtcbiAgY29uc3QgdmlzaXROb2RlID0gKG5vZGU6IHRzLk5vZGUpID0+IHtcbiAgICBpZiAocHJlZGljYXRlKG5vZGUpKSB7XG4gICAgICByZXN1bHQucHVzaChub2RlKTtcbiAgICB9XG4gICAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIHZpc2l0Tm9kZSk7XG4gIH07XG4gIHRzLmZvckVhY2hDaGlsZChwYXJlbnQsIHZpc2l0Tm9kZSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG4iXX0=