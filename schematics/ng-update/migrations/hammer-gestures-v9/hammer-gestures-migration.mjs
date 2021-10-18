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
            const { standardEvents, customEvents } = (0, hammer_template_check_1.isHammerJsUsedInTemplate)(template.content);
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
        const newConfigPath = (0, core_1.join)(sourceRoot, this._getAvailableGestureConfigFileName(sourceRoot));
        // Copy gesture config template into the CLI project.
        this.fileSystem.create(newConfigPath, (0, fs_1.readFileSync)(require.resolve(GESTURE_CONFIG_TEMPLATE_PATH), 'utf8'));
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
                (0, remove_array_element_1.removeElementFromArrayExpression)(node, recorder);
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
            const importData = (0, schematics_1.getImportOfIdentifier)(node, this.typeChecker);
            if (importData &&
                importData.symbolName === HAMMER_CONFIG_TOKEN_NAME &&
                importData.moduleName === HAMMER_CONFIG_TOKEN_MODULE) {
                this._hammerConfigTokenReferences.push({
                    node,
                    importData,
                    isImport: ts.isImportSpecifier(node.parent),
                });
            }
        }
    }
    /**
     * Checks if the given node is a reference to the HammerModule from
     * "@angular/platform-browser". If so, keeps track of the reference.
     */
    _checkForHammerModuleReference(node) {
        if (ts.isIdentifier(node)) {
            const importData = (0, schematics_1.getImportOfIdentifier)(node, this.typeChecker);
            if (importData &&
                importData.symbolName === HAMMER_MODULE_NAME &&
                importData.moduleName === HAMMER_MODULE_IMPORT) {
                this._hammerModuleReferences.push({
                    node,
                    importData,
                    isImport: ts.isImportSpecifier(node.parent),
                });
            }
        }
    }
    /**
     * Checks if the given node is an import to the HammerJS package. Imports to
     * HammerJS which load specific symbols from the package are considered as
     * runtime usage of Hammer. e.g. `import {Symbol} from "hammerjs";`.
     */
    _checkHammerImports(node) {
        if (ts.isImportDeclaration(node) &&
            ts.isStringLiteral(node.moduleSpecifier) &&
            node.moduleSpecifier.text === HAMMER_MODULE_SPECIFIER) {
            // If there is an import to HammerJS that imports symbols, or is namespaced
            // (e.g. "import {A, B} from ..." or "import * as hammer from ..."), then we
            // assume that some exports are used at runtime.
            if (node.importClause &&
                !(node.importClause.namedBindings &&
                    ts.isNamedImports(node.importClause.namedBindings) &&
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
        if (ts.isElementAccessExpression(node) &&
            ts.isStringLiteral(node.argumentExpression) &&
            node.argumentExpression.text === 'Hammer') {
            const originExpr = unwrapExpression(node.expression);
            if (ts.isIdentifier(originExpr) && originExpr.text === 'window') {
                this._usedInRuntime = true;
            }
            return;
        }
        // Handles usages of plain identifier with the name "Hammer". These usage
        // are valid if they resolve to "@types/hammerjs". e.g. "new Hammer(myElement)".
        if (ts.isIdentifier(node) &&
            node.text === 'Hammer' &&
            !ts.isPropertyAccessExpression(node.parent) &&
            !ts.isElementAccessExpression(node.parent)) {
            const symbol = this._getDeclarationSymbolOfNode(node);
            if (symbol &&
                symbol.valueDeclaration &&
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
            const importData = (0, schematics_1.getImportOfIdentifier)(node, this.typeChecker);
            if (importData &&
                importData.symbolName === GESTURE_CONFIG_CLASS_NAME &&
                importData.moduleName.startsWith('@angular/material/')) {
                this._gestureConfigReferences.push({
                    node,
                    importData,
                    isImport: ts.isImportSpecifier(node.parent),
                });
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
        if (!propertyAssignment ||
            !ts.isPropertyAssignment(propertyAssignment) ||
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
        if (!this.fileSystem.fileExists((0, core_1.join)(sourceRoot, `${GESTURE_CONFIG_FILE_NAME}.ts`))) {
            return `${GESTURE_CONFIG_FILE_NAME}.ts`;
        }
        let possibleName = `${GESTURE_CONFIG_FILE_NAME}-`;
        let index = 1;
        while (this.fileSystem.fileExists((0, core_1.join)(sourceRoot, `${possibleName}-${index}.ts`))) {
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
                    `Please clean up the provider.`,
            });
            return;
        }
        // Removes the object literal from the parent array expression. Removes
        // the trailing comma token if present.
        (0, remove_array_element_1.removeElementFromArrayExpression)(objectLiteralExpr, recorder);
    }
    /** Removes the given hammer config token import if it is not used. */
    _removeHammerConfigTokenImportIfUnused({ node, importData }) {
        const sourceFile = node.getSourceFile();
        const isTokenUsed = this._hammerConfigTokenReferences.some(r => !r.isImport &&
            !isNamespacedIdentifierAccess(r.node) &&
            r.node.getSourceFile() === sourceFile &&
            !this._deletedIdentifiers.includes(r.node));
        // We don't want to remove the import for the token if the token is
        // still used somewhere.
        if (!isTokenUsed) {
            this._importManager.deleteNamedBindingImport(sourceFile, HAMMER_CONFIG_TOKEN_NAME, importData.moduleName);
        }
    }
    /** Removes Hammer from all index HTML files of the current project. */
    _removeHammerFromIndexFile() {
        const indexFilePaths = (0, schematics_1.getProjectIndexFiles)(this.context.project);
        indexFilePaths.forEach(filePath => {
            if (!this.fileSystem.fileExists(filePath)) {
                return;
            }
            const htmlContent = this.fileSystem.read(filePath);
            const recorder = this.fileSystem.edit(filePath);
            (0, find_hammer_script_tags_1.findHammerScriptImportElements)(htmlContent).forEach(el => (0, remove_element_from_html_1.removeElementFromHtml)(el, recorder));
        });
    }
    /** Sets up the Hammer gesture config in the root module if needed. */
    _setupNewGestureConfigInRootModule(gestureConfigPath) {
        const { project } = this.context;
        const mainFilePath = (0, schematics_1.getProjectMainFile)(project);
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
        const metadata = (0, schematics_1.getDecoratorMetadata)(sourceFile, 'NgModule', '@angular/core');
        // If no "NgModule" definition is found inside the source file, we just do nothing.
        if (!metadata.length) {
            return;
        }
        const filePath = this.fileSystem.resolve(sourceFile.fileName);
        const recorder = this.fileSystem.edit(filePath);
        const providersField = (0, schematics_1.getMetadataField)(metadata[0], 'providers')[0];
        const providerIdentifiers = providersField
            ? findMatchingChildNodes(providersField, ts.isIdentifier)
            : null;
        const gestureConfigExpr = this._importManager.addImportToSourceFile(sourceFile, GESTURE_CONFIG_CLASS_NAME, getModuleSpecifier(gestureConfigPath, filePath), false, this._getGestureConfigIdentifiersOfFile(sourceFile));
        const hammerConfigTokenExpr = this._importManager.addImportToSourceFile(sourceFile, HAMMER_CONFIG_TOKEN_NAME, HAMMER_CONFIG_TOKEN_MODULE);
        const newProviderNode = ts.createObjectLiteral([
            ts.createPropertyAssignment('provide', hammerConfigTokenExpr),
            ts.createPropertyAssignment('useClass', gestureConfigExpr),
        ]);
        // If the providers field exists and already contains references to the hammer gesture
        // config token and the gesture config, we naively assume that the gesture config is
        // already set up. We only want to add the gesture config provider if it is not set up.
        if (!providerIdentifiers ||
            !(this._hammerConfigTokenReferences.some(r => providerIdentifiers.includes(r.node)) &&
                this._gestureConfigReferences.some(r => providerIdentifiers.includes(r.node)))) {
            const symbolName = this._printNode(newProviderNode, sourceFile);
            (0, schematics_1.addSymbolToNgModuleMetadata)(sourceFile, sourceFile.fileName, 'providers', symbolName, null).forEach(change => {
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
        const appModuleExpr = (0, find_main_module_1.findMainModuleExpression)(mainFile);
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
        const mainFilePath = (0, schematics_1.getProjectMainFile)(project);
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
        const metadata = (0, schematics_1.getDecoratorMetadata)(sourceFile, 'NgModule', '@angular/core');
        if (!metadata.length) {
            return;
        }
        const importsField = (0, schematics_1.getMetadataField)(metadata[0], 'imports')[0];
        const importIdentifiers = importsField
            ? findMatchingChildNodes(importsField, ts.isIdentifier)
            : null;
        const recorder = this.fileSystem.edit(this.fileSystem.resolve(sourceFile.fileName));
        const hammerModuleExpr = this._importManager.addImportToSourceFile(sourceFile, HAMMER_MODULE_NAME, HAMMER_MODULE_IMPORT);
        // If the "HammerModule" is not already imported in the app module, we set it up
        // by adding it to the "imports" field of the app module.
        if (!importIdentifiers ||
            !this._hammerModuleReferences.some(r => importIdentifiers.includes(r.node))) {
            const symbolName = this._printNode(hammerModuleExpr, sourceFile);
            (0, schematics_1.addSymbolToNgModuleMetadata)(sourceFile, sourceFile.fileName, 'imports', symbolName, null).forEach(change => {
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
        return this._gestureConfigReferences
            .filter(d => d.node.getSourceFile() === sourceFile)
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
    let result = (0, core_1.relative)((0, core_1.dirname)(containingFile), newPath).replace(/\\/g, '/').replace(/\.ts$/, '');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLWdlc3R1cmVzLW1pZ3JhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL2hhbW1lci1nZXN0dXJlcy12OS9oYW1tZXItZ2VzdHVyZXMtbWlncmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILCtDQUFtRTtBQUVuRSx3REFhaUM7QUFDakMsK0RBQWdFO0FBQ2hFLDJCQUFnQztBQUNoQyxpQ0FBaUM7QUFFakMsdUVBQXlFO0FBQ3pFLHlEQUE0RDtBQUM1RCxtRUFBaUU7QUFDakUscURBQStDO0FBQy9DLGlFQUF3RTtBQUN4RSx5RUFBaUU7QUFFakUsTUFBTSx5QkFBeUIsR0FBRyxlQUFlLENBQUM7QUFDbEQsTUFBTSx3QkFBd0IsR0FBRyxnQkFBZ0IsQ0FBQztBQUNsRCxNQUFNLDRCQUE0QixHQUFHLDJCQUEyQixDQUFDO0FBRWpFLE1BQU0sd0JBQXdCLEdBQUcsdUJBQXVCLENBQUM7QUFDekQsTUFBTSwwQkFBMEIsR0FBRywyQkFBMkIsQ0FBQztBQUUvRCxNQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQztBQUMxQyxNQUFNLG9CQUFvQixHQUFHLDJCQUEyQixDQUFDO0FBRXpELE1BQU0sdUJBQXVCLEdBQUcsVUFBVSxDQUFDO0FBRTNDLE1BQU0sNkJBQTZCLEdBQUcscUVBQXFFLENBQUM7QUFZNUcsTUFBYSx1QkFBd0IsU0FBUSw0QkFBcUI7SUFBbEU7O1FBQ0UseUZBQXlGO1FBQ3pGLHlFQUF5RTtRQUN6RSw0RkFBNEY7UUFDNUYsWUFBTyxHQUNMLENBQUMsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsR0FBRyxDQUFDO1lBQ3JGLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FB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RSxTQUFTLDRCQUE0QixDQUFDLElBQW1CO0lBQ3ZELE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBUyxzQkFBc0IsQ0FDN0IsTUFBZSxFQUNmLFNBQXVDO0lBRXZDLE1BQU0sTUFBTSxHQUFRLEVBQUUsQ0FBQztJQUN2QixNQUFNLFNBQVMsR0FBRyxDQUFDLElBQWEsRUFBRSxFQUFFO1FBQ2xDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbkI7UUFDRCxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUM7SUFDRixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuQyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7am9pbiwgUGF0aCwgcmVsYXRpdmUsIGRpcm5hbWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7U2NoZW1hdGljQ29udGV4dCwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhLFxuICBEZXZraXRNaWdyYXRpb24sXG4gIGdldERlY29yYXRvck1ldGFkYXRhLFxuICBnZXRJbXBvcnRPZklkZW50aWZpZXIsXG4gIGdldE1ldGFkYXRhRmllbGQsXG4gIGdldFByb2plY3RJbmRleEZpbGVzLFxuICBnZXRQcm9qZWN0TWFpbkZpbGUsXG4gIEltcG9ydCxcbiAgTWlncmF0aW9uRmFpbHVyZSxcbiAgUG9zdE1pZ3JhdGlvbkFjdGlvbixcbiAgUmVzb2x2ZWRSZXNvdXJjZSxcbiAgVGFyZ2V0VmVyc2lvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtJbnNlcnRDaGFuZ2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jaGFuZ2UnO1xuaW1wb3J0IHtyZWFkRmlsZVN5bmN9IGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2ZpbmRIYW1tZXJTY3JpcHRJbXBvcnRFbGVtZW50c30gZnJvbSAnLi9maW5kLWhhbW1lci1zY3JpcHQtdGFncyc7XG5pbXBvcnQge2ZpbmRNYWluTW9kdWxlRXhwcmVzc2lvbn0gZnJvbSAnLi9maW5kLW1haW4tbW9kdWxlJztcbmltcG9ydCB7aXNIYW1tZXJKc1VzZWRJblRlbXBsYXRlfSBmcm9tICcuL2hhbW1lci10ZW1wbGF0ZS1jaGVjayc7XG5pbXBvcnQge0ltcG9ydE1hbmFnZXJ9IGZyb20gJy4vaW1wb3J0LW1hbmFnZXInO1xuaW1wb3J0IHtyZW1vdmVFbGVtZW50RnJvbUFycmF5RXhwcmVzc2lvbn0gZnJvbSAnLi9yZW1vdmUtYXJyYXktZWxlbWVudCc7XG5pbXBvcnQge3JlbW92ZUVsZW1lbnRGcm9tSHRtbH0gZnJvbSAnLi9yZW1vdmUtZWxlbWVudC1mcm9tLWh0bWwnO1xuXG5jb25zdCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FID0gJ0dlc3R1cmVDb25maWcnO1xuY29uc3QgR0VTVFVSRV9DT05GSUdfRklMRV9OQU1FID0gJ2dlc3R1cmUtY29uZmlnJztcbmNvbnN0IEdFU1RVUkVfQ09ORklHX1RFTVBMQVRFX1BBVEggPSAnLi9nZXN0dXJlLWNvbmZpZy50ZW1wbGF0ZSc7XG5cbmNvbnN0IEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSA9ICdIQU1NRVJfR0VTVFVSRV9DT05GSUcnO1xuY29uc3QgSEFNTUVSX0NPTkZJR19UT0tFTl9NT0RVTEUgPSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmNvbnN0IEhBTU1FUl9NT0RVTEVfTkFNRSA9ICdIYW1tZXJNb2R1bGUnO1xuY29uc3QgSEFNTUVSX01PRFVMRV9JTVBPUlQgPSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmNvbnN0IEhBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSID0gJ2hhbW1lcmpzJztcblxuY29uc3QgQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1IgPSBgQ2Fubm90IHJlbW92ZSByZWZlcmVuY2UgdG8gXCJHZXN0dXJlQ29uZmlnXCIuIFBsZWFzZSByZW1vdmUgbWFudWFsbHkuYDtcblxuaW50ZXJmYWNlIElkZW50aWZpZXJSZWZlcmVuY2Uge1xuICBub2RlOiB0cy5JZGVudGlmaWVyO1xuICBpbXBvcnREYXRhOiBJbXBvcnQ7XG4gIGlzSW1wb3J0OiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgUGFja2FnZUpzb24ge1xuICBkZXBlbmRlbmNpZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG59XG5cbmV4cG9ydCBjbGFzcyBIYW1tZXJHZXN0dXJlc01pZ3JhdGlvbiBleHRlbmRzIERldmtpdE1pZ3JhdGlvbjxudWxsPiB7XG4gIC8vIE9ubHkgZW5hYmxlIHRoaXMgcnVsZSBpZiB0aGUgbWlncmF0aW9uIHRhcmdldHMgdjkgb3IgdjEwIGFuZCBpcyBydW5uaW5nIGZvciBhIG5vbi10ZXN0XG4gIC8vIHRhcmdldC4gV2UgY2Fubm90IG1pZ3JhdGUgdGVzdCB0YXJnZXRzIHNpbmNlIHRoZXkgaGF2ZSBhIGxpbWl0ZWQgc2NvcGVcbiAgLy8gKGluIHJlZ2FyZHMgdG8gc291cmNlIGZpbGVzKSBhbmQgdGhlcmVmb3JlIHRoZSBIYW1tZXJKUyB1c2FnZSBkZXRlY3Rpb24gY2FuIGJlIGluY29ycmVjdC5cbiAgZW5hYmxlZCA9XG4gICAgKHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WOSB8fCB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjEwKSAmJlxuICAgICF0aGlzLmNvbnRleHQuaXNUZXN0VGFyZ2V0O1xuXG4gIHByaXZhdGUgX3ByaW50ZXIgPSB0cy5jcmVhdGVQcmludGVyKCk7XG4gIHByaXZhdGUgX2ltcG9ydE1hbmFnZXIgPSBuZXcgSW1wb3J0TWFuYWdlcih0aGlzLmZpbGVTeXN0ZW0sIHRoaXMuX3ByaW50ZXIpO1xuICBwcml2YXRlIF9ub2RlRmFpbHVyZXM6IHtub2RlOiB0cy5Ob2RlOyBtZXNzYWdlOiBzdHJpbmd9W10gPSBbXTtcblxuICAvKipcbiAgICogV2hldGhlciBjdXN0b20gSGFtbWVySlMgZXZlbnRzIHByb3ZpZGVkIGJ5IHRoZSBNYXRlcmlhbCBnZXN0dXJlXG4gICAqIGNvbmZpZyBhcmUgdXNlZCBpbiBhIHRlbXBsYXRlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGUgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciBzdGFuZGFyZCBIYW1tZXJKUyBldmVudHMgYXJlIHVzZWQgaW4gYSB0ZW1wbGF0ZS4gKi9cbiAgcHJpdmF0ZSBfc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIEhhbW1lckpTIGlzIGFjY2Vzc2VkIGF0IHJ1bnRpbWUuICovXG4gIHByaXZhdGUgX3VzZWRJblJ1bnRpbWUgPSBmYWxzZTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpbXBvcnRzIHRoYXQgbWFrZSBcImhhbW1lcmpzXCIgYXZhaWxhYmxlIGdsb2JhbGx5LiBXZSBrZWVwIHRyYWNrIG9mIHRoZXNlXG4gICAqIHNpbmNlIHdlIG1pZ2h0IG5lZWQgdG8gcmVtb3ZlIHRoZW0gaWYgSGFtbWVyIGlzIG5vdCB1c2VkLlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5zdGFsbEltcG9ydHM6IHRzLkltcG9ydERlY2xhcmF0aW9uW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCByZXNvbHZlIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyBmcm9tIEFuZ3VsYXIgTWF0ZXJpYWwuXG4gICAqL1xuICBwcml2YXRlIF9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlczogSWRlbnRpZmllclJlZmVyZW5jZVtdID0gW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggcmVzb2x2ZSB0byB0aGUgXCJIQU1NRVJfR0VTVFVSRV9DT05GSUdcIiB0b2tlbiBmcm9tXG4gICAqIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzOiBJZGVudGlmaWVyUmVmZXJlbmNlW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCByZXNvbHZlIHRvIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb21cbiAgICogXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuXG4gICAqL1xuICBwcml2YXRlIF9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzOiBJZGVudGlmaWVyUmVmZXJlbmNlW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB0aGF0IGhhdmUgYmVlbiBkZWxldGVkIGZyb20gc291cmNlIGZpbGVzLiBUaGlzIGNhbiBiZVxuICAgKiB1c2VkIHRvIGRldGVybWluZSBpZiBjZXJ0YWluIGltcG9ydHMgYXJlIHN0aWxsIHVzZWQgb3Igbm90LlxuICAgKi9cbiAgcHJpdmF0ZSBfZGVsZXRlZElkZW50aWZpZXJzOiB0cy5JZGVudGlmaWVyW10gPSBbXTtcblxuICBvdmVycmlkZSB2aXNpdFRlbXBsYXRlKHRlbXBsYXRlOiBSZXNvbHZlZFJlc291cmNlKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZSB8fCAhdGhpcy5fc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSkge1xuICAgICAgY29uc3Qge3N0YW5kYXJkRXZlbnRzLCBjdXN0b21FdmVudHN9ID0gaXNIYW1tZXJKc1VzZWRJblRlbXBsYXRlKHRlbXBsYXRlLmNvbnRlbnQpO1xuICAgICAgdGhpcy5fY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGUgPSB0aGlzLl9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZSB8fCBjdXN0b21FdmVudHM7XG4gICAgICB0aGlzLl9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlID0gdGhpcy5fc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSB8fCBzdGFuZGFyZEV2ZW50cztcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrSGFtbWVySW1wb3J0cyhub2RlKTtcbiAgICB0aGlzLl9jaGVja0ZvclJ1bnRpbWVIYW1tZXJVc2FnZShub2RlKTtcbiAgICB0aGlzLl9jaGVja0Zvck1hdGVyaWFsR2VzdHVyZUNvbmZpZyhub2RlKTtcbiAgICB0aGlzLl9jaGVja0ZvckhhbW1lckdlc3R1cmVDb25maWdUb2tlbihub2RlKTtcbiAgICB0aGlzLl9jaGVja0ZvckhhbW1lck1vZHVsZVJlZmVyZW5jZShub2RlKTtcbiAgfVxuXG4gIG92ZXJyaWRlIHBvc3RBbmFseXNpcygpOiB2b2lkIHtcbiAgICAvLyBXYWxrIHRocm91Z2ggYWxsIGhhbW1lciBjb25maWcgdG9rZW4gcmVmZXJlbmNlcyBhbmQgY2hlY2sgaWYgdGhlcmVcbiAgICAvLyBpcyBhIHBvdGVudGlhbCBjdXN0b20gZ2VzdHVyZSBjb25maWcgc2V0dXAuXG4gICAgY29uc3QgaGFzQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwID0gdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUociA9PlxuICAgICAgdGhpcy5fY2hlY2tGb3JDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAociksXG4gICAgKTtcbiAgICBjb25zdCB1c2VkSW5UZW1wbGF0ZSA9IHRoaXMuX3N0YW5kYXJkRXZlbnRzVXNlZEluVGVtcGxhdGUgfHwgdGhpcy5fY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGU7XG5cbiAgICAvKlxuICAgICAgUG9zc2libGUgc2NlbmFyaW9zIGFuZCBob3cgdGhlIG1pZ3JhdGlvbiBzaG91bGQgY2hhbmdlIHRoZSBwcm9qZWN0OlxuICAgICAgICAxLiBXZSBkZXRlY3QgdGhhdCBhIGN1c3RvbSBIYW1tZXJKUyBnZXN0dXJlIGNvbmZpZyBpcyBzZXQgdXA6XG4gICAgICAgICAgICAtIFJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyBpZiBubyBIYW1tZXJKUyBldmVudCBpcyB1c2VkLlxuICAgICAgICAgICAgLSBQcmludCBhIHdhcm5pbmcgYWJvdXQgYW1iaWd1b3VzIGNvbmZpZ3VyYXRpb24gdGhhdCBjYW5ub3QgYmUgaGFuZGxlZCBjb21wbGV0ZWx5XG4gICAgICAgICAgICAgIGlmIHRoZXJlIGFyZSByZWZlcmVuY2VzIHRvIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICAgICAgMi4gV2UgZGV0ZWN0IHRoYXQgSGFtbWVySlMgaXMgb25seSB1c2VkIHByb2dyYW1tYXRpY2FsbHk6XG4gICAgICAgICAgICAtIFJlbW92ZSByZWZlcmVuY2VzIHRvIEdlc3R1cmVDb25maWcgb2YgTWF0ZXJpYWwuXG4gICAgICAgICAgICAtIFJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBcIkhhbW1lck1vZHVsZVwiIGlmIHByZXNlbnQuXG4gICAgICAgIDMuIFdlIGRldGVjdCB0aGF0IHN0YW5kYXJkIEhhbW1lckpTIGV2ZW50cyBhcmUgdXNlZCBpbiBhIHRlbXBsYXRlOlxuICAgICAgICAgICAgLSBTZXQgdXAgdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbSBwbGF0Zm9ybS1icm93c2VyLlxuICAgICAgICAgICAgLSBSZW1vdmUgYWxsIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZXMuXG4gICAgICAgIDQuIFdlIGRldGVjdCB0aGF0IGN1c3RvbSBIYW1tZXJKUyBldmVudHMgcHJvdmlkZWQgYnkgdGhlIE1hdGVyaWFsIGdlc3R1cmVcbiAgICAgICAgICAgY29uZmlnIGFyZSB1c2VkLlxuICAgICAgICAgICAgLSBDb3B5IHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyBpbnRvIHRoZSBhcHAuXG4gICAgICAgICAgICAtIFJld3JpdGUgYWxsIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZXMgdG8gdGhlIG5ld2x5IGNvcGllZCBvbmUuXG4gICAgICAgICAgICAtIFNldCB1cCB0aGUgbmV3IGdlc3R1cmUgY29uZmlnIGluIHRoZSByb290IGFwcCBtb2R1bGUuXG4gICAgICAgICAgICAtIFNldCB1cCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBmcm9tIHBsYXRmb3JtLWJyb3dzZXIuXG4gICAgICAgIDQuIFdlIGRldGVjdCBubyBIYW1tZXJKUyB1c2FnZSBhdCBhbGw6XG4gICAgICAgICAgICAtIFJlbW92ZSBIYW1tZXIgaW1wb3J0c1xuICAgICAgICAgICAgLSBSZW1vdmUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlc1xuICAgICAgICAgICAgLSBSZW1vdmUgSGFtbWVyTW9kdWxlIHNldHVwIGlmIHByZXNlbnQuXG4gICAgICAgICAgICAtIFJlbW92ZSBIYW1tZXIgc2NyaXB0IGltcG9ydHMgaW4gXCJpbmRleC5odG1sXCIgZmlsZXMuXG4gICAgKi9cblxuICAgIGlmIChoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXApIHtcbiAgICAgIC8vIElmIGEgY3VzdG9tIGdlc3R1cmUgY29uZmlnIGlzIHByb3ZpZGVkLCB3ZSBhbHdheXMgYXNzdW1lIHRoYXQgSGFtbWVySlMgaXMgdXNlZC5cbiAgICAgIEhhbW1lckdlc3R1cmVzTWlncmF0aW9uLmdsb2JhbFVzZXNIYW1tZXIgPSB0cnVlO1xuICAgICAgaWYgKCF1c2VkSW5UZW1wbGF0ZSAmJiB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gSWYgdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBldmVudHMgYXJlIG5vdCB1c2VkIGFuZCB3ZSBmb3VuZCBhIGN1c3RvbVxuICAgICAgICAvLyBnZXN0dXJlIGNvbmZpZywgd2UgY2FuIHNhZmVseSByZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWdcbiAgICAgICAgLy8gc2luY2UgZXZlbnRzIHByb3ZpZGVkIGJ5IHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyBhcmUgZ3VhcmFudGVlZCB0byBiZSB1bnVzZWQuXG4gICAgICAgIHRoaXMuX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gICAgICAgIHRoaXMucHJpbnRJbmZvKFxuICAgICAgICAgICdUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIENvbXBvbmVudHMgZGV0ZWN0ZWQgdGhhdCBIYW1tZXJKUyBpcyAnICtcbiAgICAgICAgICAgICdtYW51YWxseSBzZXQgdXAgaW4gY29tYmluYXRpb24gd2l0aCByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgJyArXG4gICAgICAgICAgICAnY29uZmlnLiBUaGlzIHRhcmdldCBjYW5ub3QgYmUgbWlncmF0ZWQgY29tcGxldGVseSwgYnV0IGFsbCByZWZlcmVuY2VzIHRvIHRoZSAnICtcbiAgICAgICAgICAgICdkZXByZWNhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBoYXZlIGJlZW4gcmVtb3ZlZC4gUmVhZCBtb3JlIGhlcmU6ICcgK1xuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0LmlvL25nLW1hdGVyaWFsLXY5LWhhbW1lci1hbWJpZ3VvdXMtdXNhZ2UnLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmICh1c2VkSW5UZW1wbGF0ZSAmJiB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gU2luY2UgdGhlcmUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcsIGFuZCB3ZSBkZXRlY3RlZFxuICAgICAgICAvLyB1c2FnZSBvZiBhIGdlc3R1cmUgZXZlbnQgdGhhdCBjb3VsZCBiZSBwcm92aWRlZCBieSBBbmd1bGFyIE1hdGVyaWFsLCB3ZSAqY2Fubm90KlxuICAgICAgICAvLyBhdXRvbWF0aWNhbGx5IHJlbW92ZSByZWZlcmVuY2VzLiBUaGlzIGlzIGJlY2F1c2Ugd2UgZG8gKm5vdCoga25vdyB3aGV0aGVyIHRoZVxuICAgICAgICAvLyBldmVudCBpcyBhY3R1YWxseSBwcm92aWRlZCBieSB0aGUgY3VzdG9tIGNvbmZpZyBvciBieSB0aGUgTWF0ZXJpYWwgY29uZmlnLlxuICAgICAgICB0aGlzLnByaW50SW5mbyhcbiAgICAgICAgICAnVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBDb21wb25lbnRzIGRldGVjdGVkIHRoYXQgSGFtbWVySlMgaXMgJyArXG4gICAgICAgICAgICAnbWFudWFsbHkgc2V0IHVwIGluIGNvbWJpbmF0aW9uIHdpdGggcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlICcgK1xuICAgICAgICAgICAgJ2NvbmZpZy4gVGhpcyB0YXJnZXQgY2Fubm90IGJlIG1pZ3JhdGVkIGNvbXBsZXRlbHkuIFBsZWFzZSBtYW51YWxseSByZW1vdmUgJyArXG4gICAgICAgICAgICAncmVmZXJlbmNlcyB0byB0aGUgZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLiBSZWFkIG1vcmUgaGVyZTogJyArXG4gICAgICAgICAgICAnaHR0cHM6Ly9naXQuaW8vbmctbWF0ZXJpYWwtdjktaGFtbWVyLWFtYmlndW91cy11c2FnZScsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLl91c2VkSW5SdW50aW1lIHx8IHVzZWRJblRlbXBsYXRlKSB7XG4gICAgICAvLyBXZSBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgSGFtbWVyIGlzIHVzZWQgZ2xvYmFsbHkuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugd2VcbiAgICAgIC8vIHdhbnQgdG8gb25seSByZW1vdmUgSGFtbWVyIGZyb20gdGhlIFwicGFja2FnZS5qc29uXCIgaWYgaXQgaXMgbm90IHVzZWQgaW4gYW55IHByb2plY3RcbiAgICAgIC8vIHRhcmdldC4gSnVzdCBiZWNhdXNlIGl0IGlzbid0IHVzZWQgaW4gb25lIHRhcmdldCBkb2Vzbid0IG1lYW4gdGhhdCB3ZSBjYW4gc2FmZWx5XG4gICAgICAvLyByZW1vdmUgdGhlIGRlcGVuZGVuY3kuXG4gICAgICBIYW1tZXJHZXN0dXJlc01pZ3JhdGlvbi5nbG9iYWxVc2VzSGFtbWVyID0gdHJ1ZTtcblxuICAgICAgLy8gSWYgaGFtbWVyIGlzIG9ubHkgdXNlZCBhdCBydW50aW1lLCB3ZSBkb24ndCBuZWVkIHRoZSBnZXN0dXJlIGNvbmZpZyBvciBcIkhhbW1lck1vZHVsZVwiXG4gICAgICAvLyBhbmQgY2FuIHJlbW92ZSBpdCAoYWxvbmcgd2l0aCB0aGUgaGFtbWVyIGNvbmZpZyB0b2tlbiBpbXBvcnQgaWYgbm8gbG9uZ2VyIG5lZWRlZCkuXG4gICAgICBpZiAoIXVzZWRJblRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUhhbW1lck1vZHVsZVJlZmVyZW5jZXMoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSAmJiAhdGhpcy5fY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy5fc2V0dXBIYW1tZXJXaXRoU3RhbmRhcmRFdmVudHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NldHVwSGFtbWVyV2l0aEN1c3RvbUV2ZW50cygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZW1vdmVIYW1tZXJTZXR1cCgpO1xuICAgIH1cblxuICAgIC8vIFJlY29yZCB0aGUgY2hhbmdlcyBjb2xsZWN0ZWQgaW4gdGhlIGltcG9ydCBtYW5hZ2VyLiBDaGFuZ2VzIG5lZWQgdG8gYmUgYXBwbGllZFxuICAgIC8vIG9uY2UgdGhlIGltcG9ydCBtYW5hZ2VyIHJlZ2lzdGVyZWQgYWxsIGltcG9ydCBtb2RpZmljYXRpb25zLiBUaGlzIGF2b2lkcyBjb2xsaXNpb25zLlxuICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIucmVjb3JkQ2hhbmdlcygpO1xuXG4gICAgLy8gQ3JlYXRlIG1pZ3JhdGlvbiBmYWlsdXJlcyB0aGF0IHdpbGwgYmUgcHJpbnRlZCBieSB0aGUgdXBkYXRlLXRvb2wgb24gbWlncmF0aW9uXG4gICAgLy8gY29tcGxldGlvbi4gV2UgbmVlZCBzcGVjaWFsIGxvZ2ljIGZvciB1cGRhdGluZyBmYWlsdXJlIHBvc2l0aW9ucyB0byByZWZsZWN0XG4gICAgLy8gdGhlIG5ldyBzb3VyY2UgZmlsZSBhZnRlciBtb2RpZmljYXRpb25zIGZyb20gdGhlIGltcG9ydCBtYW5hZ2VyLlxuICAgIHRoaXMuZmFpbHVyZXMucHVzaCguLi50aGlzLl9jcmVhdGVNaWdyYXRpb25GYWlsdXJlcygpKTtcblxuICAgIC8vIFRoZSB0ZW1wbGF0ZSBjaGVjayBmb3IgSGFtbWVySlMgZXZlbnRzIGlzIG5vdCBjb21wbGV0ZWx5IHJlbGlhYmxlIGFzIHRoZSBldmVudFxuICAgIC8vIG91dHB1dCBjb3VsZCBhbHNvIGJlIGZyb20gYSBjb21wb25lbnQgaGF2aW5nIGFuIG91dHB1dCBuYW1lZCBzaW1pbGFybHkgdG8gYSBrbm93blxuICAgIC8vIGhhbW1lcmpzIGV2ZW50IChlLmcuIFwiQE91dHB1dCgpIHNsaWRlXCIpLiBUaGUgdXNhZ2UgaXMgdGhlcmVmb3JlIHNvbWV3aGF0IGFtYmlndW91c1xuICAgIC8vIGFuZCB3ZSB3YW50IHRvIHByaW50IGEgbWVzc2FnZSB0aGF0IGRldmVsb3BlcnMgbWlnaHQgYmUgYWJsZSB0byByZW1vdmUgSGFtbWVyIG1hbnVhbGx5LlxuICAgIGlmICghaGFzQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwICYmICF0aGlzLl91c2VkSW5SdW50aW1lICYmIHVzZWRJblRlbXBsYXRlKSB7XG4gICAgICB0aGlzLnByaW50SW5mbyhcbiAgICAgICAgJ1RoZSBIYW1tZXJKUyB2OSBtaWdyYXRpb24gZm9yIEFuZ3VsYXIgQ29tcG9uZW50cyBtaWdyYXRlZCB0aGUgJyArXG4gICAgICAgICAgJ3Byb2plY3QgdG8ga2VlcCBIYW1tZXJKUyBpbnN0YWxsZWQsIGJ1dCBkZXRlY3RlZCBhbWJpZ3VvdXMgdXNhZ2Ugb2YgSGFtbWVySlMuIFBsZWFzZSAnICtcbiAgICAgICAgICAnbWFudWFsbHkgY2hlY2sgaWYgeW91IGNhbiByZW1vdmUgSGFtbWVySlMgZnJvbSB5b3VyIGFwcGxpY2F0aW9uLiBNb3JlIGRldGFpbHM6ICcgK1xuICAgICAgICAgICdodHRwczovL2dpdC5pby9uZy1tYXRlcmlhbC12OS1oYW1tZXItYW1iaWd1b3VzLXVzYWdlJyxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgY3VycmVudCBwcm9qZWN0LiBUbyBhY2hpZXZlIHRoaXMsIHRoZVxuICAgKiBmb2xsb3dpbmcgc3RlcHMgYXJlIHBlcmZvcm1lZDpcbiAgICogICAxKSBDcmVhdGUgY29weSBvZiBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgKiAgIDIpIFJld3JpdGUgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgdG8gdGhlXG4gICAqICAgICAgbmV3IGdlc3R1cmUgY29uZmlnLlxuICAgKiAgIDMpIFNldHVwIHRoZSBIQU1NRVJfR0VTVFVSRV9DT05GSUcgaW4gdGhlIHJvb3QgYXBwIG1vZHVsZSAoaWYgbm90IGRvbmUgYWxyZWFkeSkuXG4gICAqICAgNCkgU2V0dXAgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaW4gdGhlIHJvb3QgYXBwIG1vZHVsZSAoaWYgbm90IGRvbmUgYWxyZWFkeSkuXG4gICAqL1xuICBwcml2YXRlIF9zZXR1cEhhbW1lcldpdGhDdXN0b21FdmVudHMoKSB7XG4gICAgY29uc3QgcHJvamVjdCA9IHRoaXMuY29udGV4dC5wcm9qZWN0O1xuICAgIGNvbnN0IHNvdXJjZVJvb3QgPSB0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShwcm9qZWN0LnNvdXJjZVJvb3QgfHwgcHJvamVjdC5yb290KTtcbiAgICBjb25zdCBuZXdDb25maWdQYXRoID0gam9pbihzb3VyY2VSb290LCB0aGlzLl9nZXRBdmFpbGFibGVHZXN0dXJlQ29uZmlnRmlsZU5hbWUoc291cmNlUm9vdCkpO1xuXG4gICAgLy8gQ29weSBnZXN0dXJlIGNvbmZpZyB0ZW1wbGF0ZSBpbnRvIHRoZSBDTEkgcHJvamVjdC5cbiAgICB0aGlzLmZpbGVTeXN0ZW0uY3JlYXRlKFxuICAgICAgbmV3Q29uZmlnUGF0aCxcbiAgICAgIHJlYWRGaWxlU3luYyhyZXF1aXJlLnJlc29sdmUoR0VTVFVSRV9DT05GSUdfVEVNUExBVEVfUEFUSCksICd1dGY4JyksXG4gICAgKTtcblxuICAgIC8vIFJlcGxhY2UgYWxsIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZXMgdG8gcmVzb2x2ZSB0byB0aGVcbiAgICAvLyBuZXdseSBjb3BpZWQgZ2VzdHVyZSBjb25maWcuXG4gICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuZm9yRWFjaChpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5maWxlU3lzdGVtLnJlc29sdmUoaS5ub2RlLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5fcmVwbGFjZUdlc3R1cmVDb25maWdSZWZlcmVuY2UoXG4gICAgICAgIGksXG4gICAgICAgIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsXG4gICAgICAgIGdldE1vZHVsZVNwZWNpZmllcihuZXdDb25maWdQYXRoLCBmaWxlUGF0aCksXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgLy8gU2V0dXAgdGhlIGdlc3R1cmUgY29uZmlnIHByb3ZpZGVyIGFuZCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpbiB0aGUgcm9vdCBtb2R1bGVcbiAgICAvLyBpZiBub3QgZG9uZSBhbHJlYWR5LiBUaGUgXCJIYW1tZXJNb2R1bGVcIiBpcyBuZWVkZWQgaW4gdjkgc2luY2UgaXQgZW5hYmxlcyB0aGVcbiAgICAvLyBIYW1tZXIgZXZlbnQgcGx1Z2luIHRoYXQgd2FzIHByZXZpb3VzbHkgZW5hYmxlZCBieSBkZWZhdWx0IGluIHY4LlxuICAgIHRoaXMuX3NldHVwTmV3R2VzdHVyZUNvbmZpZ0luUm9vdE1vZHVsZShuZXdDb25maWdQYXRoKTtcbiAgICB0aGlzLl9zZXR1cEhhbW1lck1vZHVsZUluUm9vdE1vZHVsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgdGhlIHN0YW5kYXJkIGhhbW1lciBtb2R1bGUgaW4gdGhlIHByb2plY3QgYW5kIHJlbW92ZXMgYWxsXG4gICAqIHJlZmVyZW5jZXMgdG8gdGhlIGRlcHJlY2F0ZWQgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgX3NldHVwSGFtbWVyV2l0aFN0YW5kYXJkRXZlbnRzKCkge1xuICAgIC8vIFNldHVwIHRoZSBIYW1tZXJNb2R1bGUuIFRoZSBIYW1tZXJNb2R1bGUgZW5hYmxlcyBzdXBwb3J0IGZvclxuICAgIC8vIHRoZSBzdGFuZGFyZCBIYW1tZXJKUyBldmVudHMuXG4gICAgdGhpcy5fc2V0dXBIYW1tZXJNb2R1bGVJblJvb3RNb2R1bGUoKTtcbiAgICB0aGlzLl9yZW1vdmVNYXRlcmlhbEdlc3R1cmVDb25maWdTZXR1cCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgSGFtbWVyIGZyb20gdGhlIGN1cnJlbnQgcHJvamVjdC4gVGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgcGVyZm9ybWVkOlxuICAgKiAgIDEpIERlbGV0ZSBhbGwgVHlwZVNjcmlwdCBpbXBvcnRzIHRvIFwiaGFtbWVyanNcIi5cbiAgICogICAyKSBSZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICogICAzKSBSZW1vdmUgXCJoYW1tZXJqc1wiIGZyb20gYWxsIGluZGV4IEhUTUwgZmlsZXMgb2YgdGhlIGN1cnJlbnQgcHJvamVjdC5cbiAgICovXG4gIHByaXZhdGUgX3JlbW92ZUhhbW1lclNldHVwKCkge1xuICAgIHRoaXMuX2luc3RhbGxJbXBvcnRzLmZvckVhY2goaSA9PiB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZUltcG9ydEJ5RGVjbGFyYXRpb24oaSkpO1xuXG4gICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgICB0aGlzLl9yZW1vdmVIYW1tZXJNb2R1bGVSZWZlcmVuY2VzKCk7XG4gICAgdGhpcy5fcmVtb3ZlSGFtbWVyRnJvbUluZGV4RmlsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGdlc3R1cmUgY29uZmlnIHNldHVwIGJ5IGRlbGV0aW5nIGFsbCBmb3VuZCByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyXG4gICAqIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLiBBZGRpdGlvbmFsbHksIHVudXNlZCBpbXBvcnRzIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWdcbiAgICogdG9rZW4gZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIiB3aWxsIGJlIHJlbW92ZWQgYXMgd2VsbC5cbiAgICovXG4gIHByaXZhdGUgX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCkge1xuICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLmZvckVhY2gociA9PiB0aGlzLl9yZW1vdmVHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKHIpKTtcblxuICAgIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5mb3JFYWNoKHIgPT4ge1xuICAgICAgaWYgKHIuaXNJbXBvcnQpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlSGFtbWVyQ29uZmlnVG9rZW5JbXBvcnRJZlVudXNlZChyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuICovXG4gIHByaXZhdGUgX3JlbW92ZUhhbW1lck1vZHVsZVJlZmVyZW5jZXMoKSB7XG4gICAgdGhpcy5faGFtbWVyTW9kdWxlUmVmZXJlbmNlcy5mb3JFYWNoKCh7bm9kZSwgaXNJbXBvcnQsIGltcG9ydERhdGF9KSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZmlsZVN5c3RlbS5lZGl0KHRoaXMuZmlsZVN5c3RlbS5yZXNvbHZlKHNvdXJjZUZpbGUuZmlsZU5hbWUpKTtcblxuICAgICAgLy8gT25seSByZW1vdmUgdGhlIGltcG9ydCBmb3IgdGhlIEhhbW1lck1vZHVsZSBpZiB0aGUgbW9kdWxlIGhhcyBiZWVuIGFjY2Vzc2VkXG4gICAgICAvLyB0aHJvdWdoIGEgbm9uLW5hbWVzcGFjZWQgaWRlbnRpZmllciBhY2Nlc3MuXG4gICAgICBpZiAoIWlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZSkpIHtcbiAgICAgICAgdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoXG4gICAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgICBIQU1NRVJfTU9EVUxFX05BTUUsXG4gICAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3IgcmVmZXJlbmNlcyBmcm9tIHdpdGhpbiBhbiBpbXBvcnQsIHdlIGRvIG5vdCBuZWVkIHRvIGRvIGFueXRoaW5nIG90aGVyIHRoYW5cbiAgICAgIC8vIHJlbW92aW5nIHRoZSBpbXBvcnQuIEZvciBvdGhlciByZWZlcmVuY2VzLCB3ZSByZW1vdmUgdGhlIGltcG9ydCBhbmQgdGhlIGFjdHVhbFxuICAgICAgLy8gaWRlbnRpZmllciBpbiB0aGUgbW9kdWxlIGltcG9ydHMuXG4gICAgICBpZiAoaXNJbXBvcnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpcyByZWZlcmVuY2VkIHdpdGhpbiBhbiBhcnJheSBsaXRlcmFsLCB3ZSBjYW5cbiAgICAgIC8vIHJlbW92ZSB0aGUgZWxlbWVudCBlYXNpbHkuIE90aGVyd2lzZSBpZiBpdCdzIG91dHNpZGUgb2YgYW4gYXJyYXkgbGl0ZXJhbCxcbiAgICAgIC8vIHdlIG5lZWQgdG8gcmVwbGFjZSB0aGUgcmVmZXJlbmNlIHdpdGggYW4gZW1wdHkgb2JqZWN0IGxpdGVyYWwgdy8gdG9kbyB0b1xuICAgICAgLy8gbm90IGJyZWFrIHRoZSBhcHBsaWNhdGlvbi5cbiAgICAgIGlmICh0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24obm9kZS5wYXJlbnQpKSB7XG4gICAgICAgIC8vIFJlbW92ZXMgdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbSB0aGUgcGFyZW50IGFycmF5IGV4cHJlc3Npb24uIFJlbW92ZXNcbiAgICAgICAgLy8gdGhlIHRyYWlsaW5nIGNvbW1hIHRva2VuIGlmIHByZXNlbnQuXG4gICAgICAgIHJlbW92ZUVsZW1lbnRGcm9tQXJyYXlFeHByZXNzaW9uKG5vZGUsIHJlY29yZGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlY29yZGVyLnJlbW92ZShub2RlLmdldFN0YXJ0KCksIG5vZGUuZ2V0V2lkdGgoKSk7XG4gICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5vZGUuZ2V0U3RhcnQoKSwgYC8qIFRPRE86IHJlbW92ZSAqLyB7fWApO1xuICAgICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7XG4gICAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIGRlbGV0ZSByZWZlcmVuY2UgdG8gXCJIYW1tZXJNb2R1bGVcIi4nLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZ1xuICAgKiB0b2tlbiBmcm9tIHBsYXRmb3JtLWJyb3dzZXIuIElmIHNvLCBrZWVwcyB0cmFjayBvZiB0aGUgcmVmZXJlbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JIYW1tZXJHZXN0dXJlQ29uZmlnVG9rZW4obm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkpIHtcbiAgICAgIGNvbnN0IGltcG9ydERhdGEgPSBnZXRJbXBvcnRPZklkZW50aWZpZXIobm9kZSwgdGhpcy50eXBlQ2hlY2tlcik7XG4gICAgICBpZiAoXG4gICAgICAgIGltcG9ydERhdGEgJiZcbiAgICAgICAgaW1wb3J0RGF0YS5zeW1ib2xOYW1lID09PSBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUgJiZcbiAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lID09PSBIQU1NRVJfQ09ORklHX1RPS0VOX01PRFVMRVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGltcG9ydERhdGEsXG4gICAgICAgICAgaXNJbXBvcnQ6IHRzLmlzSW1wb3J0U3BlY2lmaWVyKG5vZGUucGFyZW50KSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBpcyBhIHJlZmVyZW5jZSB0byB0aGUgSGFtbWVyTW9kdWxlIGZyb21cbiAgICogXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuIElmIHNvLCBrZWVwcyB0cmFjayBvZiB0aGUgcmVmZXJlbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JIYW1tZXJNb2R1bGVSZWZlcmVuY2Uobm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkpIHtcbiAgICAgIGNvbnN0IGltcG9ydERhdGEgPSBnZXRJbXBvcnRPZklkZW50aWZpZXIobm9kZSwgdGhpcy50eXBlQ2hlY2tlcik7XG4gICAgICBpZiAoXG4gICAgICAgIGltcG9ydERhdGEgJiZcbiAgICAgICAgaW1wb3J0RGF0YS5zeW1ib2xOYW1lID09PSBIQU1NRVJfTU9EVUxFX05BTUUgJiZcbiAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lID09PSBIQU1NRVJfTU9EVUxFX0lNUE9SVFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX2hhbW1lck1vZHVsZVJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBpbXBvcnREYXRhLFxuICAgICAgICAgIGlzSW1wb3J0OiB0cy5pc0ltcG9ydFNwZWNpZmllcihub2RlLnBhcmVudCksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYW4gaW1wb3J0IHRvIHRoZSBIYW1tZXJKUyBwYWNrYWdlLiBJbXBvcnRzIHRvXG4gICAqIEhhbW1lckpTIHdoaWNoIGxvYWQgc3BlY2lmaWMgc3ltYm9scyBmcm9tIHRoZSBwYWNrYWdlIGFyZSBjb25zaWRlcmVkIGFzXG4gICAqIHJ1bnRpbWUgdXNhZ2Ugb2YgSGFtbWVyLiBlLmcuIGBpbXBvcnQge1N5bWJvbH0gZnJvbSBcImhhbW1lcmpzXCI7YC5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrSGFtbWVySW1wb3J0cyhub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKFxuICAgICAgdHMuaXNJbXBvcnREZWNsYXJhdGlvbihub2RlKSAmJlxuICAgICAgdHMuaXNTdHJpbmdMaXRlcmFsKG5vZGUubW9kdWxlU3BlY2lmaWVyKSAmJlxuICAgICAgbm9kZS5tb2R1bGVTcGVjaWZpZXIudGV4dCA9PT0gSEFNTUVSX01PRFVMRV9TUEVDSUZJRVJcbiAgICApIHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIGFuIGltcG9ydCB0byBIYW1tZXJKUyB0aGF0IGltcG9ydHMgc3ltYm9scywgb3IgaXMgbmFtZXNwYWNlZFxuICAgICAgLy8gKGUuZy4gXCJpbXBvcnQge0EsIEJ9IGZyb20gLi4uXCIgb3IgXCJpbXBvcnQgKiBhcyBoYW1tZXIgZnJvbSAuLi5cIiksIHRoZW4gd2VcbiAgICAgIC8vIGFzc3VtZSB0aGF0IHNvbWUgZXhwb3J0cyBhcmUgdXNlZCBhdCBydW50aW1lLlxuICAgICAgaWYgKFxuICAgICAgICBub2RlLmltcG9ydENsYXVzZSAmJlxuICAgICAgICAhKFxuICAgICAgICAgIG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MgJiZcbiAgICAgICAgICB0cy5pc05hbWVkSW1wb3J0cyhub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSAmJlxuICAgICAgICAgIG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHMubGVuZ3RoID09PSAwXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2luc3RhbGxJbXBvcnRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBhY2Nlc3NlcyB0aGUgZ2xvYmFsIFwiSGFtbWVyXCIgc3ltYm9sIGF0IHJ1bnRpbWUuIElmIHNvLFxuICAgKiB0aGUgbWlncmF0aW9uIHJ1bGUgc3RhdGUgd2lsbCBiZSB1cGRhdGVkIHRvIHJlZmxlY3QgdGhhdCBIYW1tZXIgaXMgdXNlZCBhdCBydW50aW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JSdW50aW1lSGFtbWVyVXNhZ2Uobm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0aGlzLl91c2VkSW5SdW50aW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRGV0ZWN0cyB1c2FnZXMgb2YgXCJ3aW5kb3cuSGFtbWVyXCIuXG4gICAgaWYgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUpICYmIG5vZGUubmFtZS50ZXh0ID09PSAnSGFtbWVyJykge1xuICAgICAgY29uc3Qgb3JpZ2luRXhwciA9IHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgICAgIGlmICh0cy5pc0lkZW50aWZpZXIob3JpZ2luRXhwcikgJiYgb3JpZ2luRXhwci50ZXh0ID09PSAnd2luZG93Jykge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZXRlY3RzIHVzYWdlcyBvZiBcIndpbmRvd1snSGFtbWVyJ11cIi5cbiAgICBpZiAoXG4gICAgICB0cy5pc0VsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKG5vZGUpICYmXG4gICAgICB0cy5pc1N0cmluZ0xpdGVyYWwobm9kZS5hcmd1bWVudEV4cHJlc3Npb24pICYmXG4gICAgICBub2RlLmFyZ3VtZW50RXhwcmVzc2lvbi50ZXh0ID09PSAnSGFtbWVyJ1xuICAgICkge1xuICAgICAgY29uc3Qgb3JpZ2luRXhwciA9IHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgICAgIGlmICh0cy5pc0lkZW50aWZpZXIob3JpZ2luRXhwcikgJiYgb3JpZ2luRXhwci50ZXh0ID09PSAnd2luZG93Jykge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGVzIHVzYWdlcyBvZiBwbGFpbiBpZGVudGlmaWVyIHdpdGggdGhlIG5hbWUgXCJIYW1tZXJcIi4gVGhlc2UgdXNhZ2VcbiAgICAvLyBhcmUgdmFsaWQgaWYgdGhleSByZXNvbHZlIHRvIFwiQHR5cGVzL2hhbW1lcmpzXCIuIGUuZy4gXCJuZXcgSGFtbWVyKG15RWxlbWVudClcIi5cbiAgICBpZiAoXG4gICAgICB0cy5pc0lkZW50aWZpZXIobm9kZSkgJiZcbiAgICAgIG5vZGUudGV4dCA9PT0gJ0hhbW1lcicgJiZcbiAgICAgICF0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLnBhcmVudCkgJiZcbiAgICAgICF0cy5pc0VsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKG5vZGUucGFyZW50KVxuICAgICkge1xuICAgICAgY29uc3Qgc3ltYm9sID0gdGhpcy5fZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZSk7XG4gICAgICBpZiAoXG4gICAgICAgIHN5bWJvbCAmJlxuICAgICAgICBzeW1ib2wudmFsdWVEZWNsYXJhdGlvbiAmJlxuICAgICAgICBzeW1ib2wudmFsdWVEZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUuaW5jbHVkZXMoJ0B0eXBlcy9oYW1tZXJqcycpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fdXNlZEluUnVudGltZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSByZWZlcmVuY2VzIHRoZSBnZXN0dXJlIGNvbmZpZyBmcm9tIEFuZ3VsYXIgTWF0ZXJpYWwuXG4gICAqIElmIHNvLCB3ZSBrZWVwIHRyYWNrIG9mIHRoZSBmb3VuZCBzeW1ib2wgcmVmZXJlbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JNYXRlcmlhbEdlc3R1cmVDb25maWcobm9kZTogdHMuTm9kZSkge1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkpIHtcbiAgICAgIGNvbnN0IGltcG9ydERhdGEgPSBnZXRJbXBvcnRPZklkZW50aWZpZXIobm9kZSwgdGhpcy50eXBlQ2hlY2tlcik7XG4gICAgICBpZiAoXG4gICAgICAgIGltcG9ydERhdGEgJiZcbiAgICAgICAgaW1wb3J0RGF0YS5zeW1ib2xOYW1lID09PSBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FICYmXG4gICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZS5zdGFydHNXaXRoKCdAYW5ndWxhci9tYXRlcmlhbC8nKVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgaW1wb3J0RGF0YSxcbiAgICAgICAgICBpc0ltcG9ydDogdHMuaXNJbXBvcnRTcGVjaWZpZXIobm9kZS5wYXJlbnQpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBIYW1tZXIgZ2VzdHVyZSBjb25maWcgdG9rZW4gcmVmZXJlbmNlIGlzIHBhcnQgb2YgYW5cbiAgICogQW5ndWxhciBwcm92aWRlciBkZWZpbml0aW9uIHRoYXQgc2V0cyB1cCBhIGN1c3RvbSBnZXN0dXJlIGNvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9yQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKHRva2VuUmVmOiBJZGVudGlmaWVyUmVmZXJlbmNlKTogYm9vbGVhbiB7XG4gICAgLy8gV2FsayB1cCB0aGUgdHJlZSB0byBsb29rIGZvciBhIHBhcmVudCBwcm9wZXJ0eSBhc3NpZ25tZW50IG9mIHRoZVxuICAgIC8vIHJlZmVyZW5jZSB0byB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnIHRva2VuLlxuICAgIGxldCBwcm9wZXJ0eUFzc2lnbm1lbnQ6IHRzLk5vZGUgPSB0b2tlblJlZi5ub2RlO1xuICAgIHdoaWxlIChwcm9wZXJ0eUFzc2lnbm1lbnQgJiYgIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5QXNzaWdubWVudCkpIHtcbiAgICAgIHByb3BlcnR5QXNzaWdubWVudCA9IHByb3BlcnR5QXNzaWdubWVudC5wYXJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgIXByb3BlcnR5QXNzaWdubWVudCB8fFxuICAgICAgIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5QXNzaWdubWVudCkgfHxcbiAgICAgIGdldFByb3BlcnR5TmFtZVRleHQocHJvcGVydHlBc3NpZ25tZW50Lm5hbWUpICE9PSAncHJvdmlkZSdcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBvYmplY3RMaXRlcmFsRXhwciA9IHByb3BlcnR5QXNzaWdubWVudC5wYXJlbnQ7XG4gICAgY29uc3QgbWF0Y2hpbmdJZGVudGlmaWVycyA9IGZpbmRNYXRjaGluZ0NoaWxkTm9kZXMob2JqZWN0TGl0ZXJhbEV4cHIsIHRzLmlzSWRlbnRpZmllcik7XG5cbiAgICAvLyBXZSBuYWl2ZWx5IGFzc3VtZSB0aGF0IGlmIHRoZXJlIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBcIkdlc3R1cmVDb25maWdcIiBleHBvcnRcbiAgICAvLyBmcm9tIEFuZ3VsYXIgTWF0ZXJpYWwgaW4gdGhlIHByb3ZpZGVyIGxpdGVyYWwsIHRoYXQgdGhlIHByb3ZpZGVyIHNldHMgdXAgdGhlXG4gICAgLy8gQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICByZXR1cm4gIXRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLnNvbWUociA9PiBtYXRjaGluZ0lkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgYW4gYXZhaWxhYmxlIGZpbGUgbmFtZSBmb3IgdGhlIGdlc3R1cmUgY29uZmlnIHdoaWNoIHNob3VsZFxuICAgKiBiZSBzdG9yZWQgaW4gdGhlIHNwZWNpZmllZCBmaWxlIHBhdGguXG4gICAqL1xuICBwcml2YXRlIF9nZXRBdmFpbGFibGVHZXN0dXJlQ29uZmlnRmlsZU5hbWUoc291cmNlUm9vdDogUGF0aCkge1xuICAgIGlmICghdGhpcy5maWxlU3lzdGVtLmZpbGVFeGlzdHMoam9pbihzb3VyY2VSb290LCBgJHtHRVNUVVJFX0NPTkZJR19GSUxFX05BTUV9LnRzYCkpKSB7XG4gICAgICByZXR1cm4gYCR7R0VTVFVSRV9DT05GSUdfRklMRV9OQU1FfS50c2A7XG4gICAgfVxuXG4gICAgbGV0IHBvc3NpYmxlTmFtZSA9IGAke0dFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRX0tYDtcbiAgICBsZXQgaW5kZXggPSAxO1xuICAgIHdoaWxlICh0aGlzLmZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhqb2luKHNvdXJjZVJvb3QsIGAke3Bvc3NpYmxlTmFtZX0tJHtpbmRleH0udHNgKSkpIHtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICAgIHJldHVybiBgJHtwb3NzaWJsZU5hbWUgKyBpbmRleH0udHNgO1xuICB9XG5cbiAgLyoqIFJlcGxhY2VzIGEgZ2l2ZW4gZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlIHdpdGggYSBuZXcgaW1wb3J0LiAqL1xuICBwcml2YXRlIF9yZXBsYWNlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZShcbiAgICB7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnR9OiBJZGVudGlmaWVyUmVmZXJlbmNlLFxuICAgIHN5bWJvbE5hbWU6IHN0cmluZyxcbiAgICBtb2R1bGVTcGVjaWZpZXI6IHN0cmluZyxcbiAgKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5maWxlU3lzdGVtLmVkaXQodGhpcy5maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSkpO1xuXG4gICAgLy8gTGlzdCBvZiBhbGwgaWRlbnRpZmllcnMgcmVmZXJyaW5nIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgY3VycmVudCBmaWxlLiBUaGlzXG4gICAgLy8gYWxsb3dzIHVzIHRvIGFkZCBhbiBpbXBvcnQgZm9yIHRoZSBjb3BpZWQgZ2VzdHVyZSBjb25maWd1cmF0aW9uIHdpdGhvdXQgZ2VuZXJhdGluZyBhXG4gICAgLy8gbmV3IGlkZW50aWZpZXIgZm9yIHRoZSBpbXBvcnQgdG8gYXZvaWQgY29sbGlzaW9ucy4gaS5lLiBcIkdlc3R1cmVDb25maWdfMVwiLiBUaGUgaW1wb3J0XG4gICAgLy8gbWFuYWdlciBjaGVja3MgZm9yIHBvc3NpYmxlIG5hbWUgY29sbGlzaW9ucywgYnV0IGlzIGFibGUgdG8gaWdub3JlIHNwZWNpZmljIGlkZW50aWZpZXJzLlxuICAgIC8vIFdlIHVzZSB0aGlzIHRvIGlnbm9yZSBhbGwgcmVmZXJlbmNlcyB0byB0aGUgb3JpZ2luYWwgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyxcbiAgICAvLyBiZWNhdXNlIHRoZXNlIHdpbGwgYmUgcmVwbGFjZWQgYW5kIHRoZXJlZm9yZSB3aWxsIG5vdCBpbnRlcmZlcmUuXG4gICAgY29uc3QgZ2VzdHVyZUlkZW50aWZpZXJzSW5GaWxlID0gdGhpcy5fZ2V0R2VzdHVyZUNvbmZpZ0lkZW50aWZpZXJzT2ZGaWxlKHNvdXJjZUZpbGUpO1xuXG4gICAgLy8gSWYgdGhlIHBhcmVudCBvZiB0aGUgaWRlbnRpZmllciBpcyBhY2Nlc3NlZCB0aHJvdWdoIGEgbmFtZXNwYWNlLCB3ZSBjYW4ganVzdFxuICAgIC8vIGltcG9ydCB0aGUgbmV3IGdlc3R1cmUgY29uZmlnIHdpdGhvdXQgcmV3cml0aW5nIHRoZSBpbXBvcnQgZGVjbGFyYXRpb24gYmVjYXVzZVxuICAgIC8vIHRoZSBjb25maWcgaGFzIGJlZW4gaW1wb3J0ZWQgdGhyb3VnaCBhIG5hbWVzcGFjZWQgaW1wb3J0LlxuICAgIGlmIChpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGUpKSB7XG4gICAgICBjb25zdCBuZXdFeHByZXNzaW9uID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgIHN5bWJvbE5hbWUsXG4gICAgICAgIG1vZHVsZVNwZWNpZmllcixcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIGdlc3R1cmVJZGVudGlmaWVyc0luRmlsZSxcbiAgICAgICk7XG5cbiAgICAgIHJlY29yZGVyLnJlbW92ZShub2RlLnBhcmVudC5nZXRTdGFydCgpLCBub2RlLnBhcmVudC5nZXRXaWR0aCgpKTtcbiAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5vZGUucGFyZW50LmdldFN0YXJ0KCksIHRoaXMuX3ByaW50Tm9kZShuZXdFeHByZXNzaW9uLCBzb3VyY2VGaWxlKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRGVsZXRlIHRoZSBvbGQgaW1wb3J0IHRvIHRoZSBcIkdlc3R1cmVDb25maWdcIi5cbiAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChcbiAgICAgIHNvdXJjZUZpbGUsXG4gICAgICBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLFxuICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lLFxuICAgICk7XG5cbiAgICAvLyBJZiB0aGUgY3VycmVudCByZWZlcmVuY2UgaXMgbm90IGZyb20gaW5zaWRlIG9mIGEgaW1wb3J0LCB3ZSBuZWVkIHRvIGFkZCBhIG5ld1xuICAgIC8vIGltcG9ydCB0byB0aGUgY29waWVkIGdlc3R1cmUgY29uZmlnIGFuZCByZXBsYWNlIHRoZSBpZGVudGlmaWVyLiBGb3IgcmVmZXJlbmNlc1xuICAgIC8vIHdpdGhpbiBhbiBpbXBvcnQsIHdlIGRvIG5vdGhpbmcgYnV0IHJlbW92aW5nIHRoZSBhY3R1YWwgaW1wb3J0LiBUaGlzIGFsbG93cyB1c1xuICAgIC8vIHRvIHJlbW92ZSB1bnVzZWQgaW1wb3J0cyB0byB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAgaWYgKCFpc0ltcG9ydCkge1xuICAgICAgY29uc3QgbmV3RXhwcmVzc2lvbiA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICBzeW1ib2xOYW1lLFxuICAgICAgICBtb2R1bGVTcGVjaWZpZXIsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICBnZXN0dXJlSWRlbnRpZmllcnNJbkZpbGUsXG4gICAgICApO1xuXG4gICAgICByZWNvcmRlci5yZW1vdmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCkpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQobm9kZS5nZXRTdGFydCgpLCB0aGlzLl9wcmludE5vZGUobmV3RXhwcmVzc2lvbiwgc291cmNlRmlsZSkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgZ2l2ZW4gZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlIGFuZCBpdHMgY29ycmVzcG9uZGluZyBpbXBvcnQgZnJvbVxuICAgKiBpdHMgY29udGFpbmluZyBzb3VyY2UgZmlsZS4gSW1wb3J0cyB3aWxsIGJlIGFsd2F5cyByZW1vdmVkLCBidXQgaW4gc29tZSBjYXNlcyxcbiAgICogd2hlcmUgaXQncyBub3QgZ3VhcmFudGVlZCB0aGF0IGEgcmVtb3ZhbCBjYW4gYmUgcGVyZm9ybWVkIHNhZmVseSwgd2UganVzdFxuICAgKiBjcmVhdGUgYSBtaWdyYXRpb24gZmFpbHVyZSAoYW5kIGFkZCBhIFRPRE8gaWYgcG9zc2libGUpLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZSh7bm9kZSwgaW1wb3J0RGF0YSwgaXNJbXBvcnR9OiBJZGVudGlmaWVyUmVmZXJlbmNlKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5maWxlU3lzdGVtLmVkaXQodGhpcy5maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSkpO1xuICAgIC8vIE9ubHkgcmVtb3ZlIHRoZSBpbXBvcnQgZm9yIHRoZSBnZXN0dXJlIGNvbmZpZyBpZiB0aGUgZ2VzdHVyZSBjb25maWcgaGFzXG4gICAgLy8gYmVlbiBhY2Nlc3NlZCB0aHJvdWdoIGEgbm9uLW5hbWVzcGFjZWQgaWRlbnRpZmllciBhY2Nlc3MuXG4gICAgaWYgKCFpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGUpKSB7XG4gICAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChcbiAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSxcbiAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBGb3IgcmVmZXJlbmNlcyBmcm9tIHdpdGhpbiBhbiBpbXBvcnQsIHdlIGRvIG5vdCBuZWVkIHRvIGRvIGFueXRoaW5nIG90aGVyIHRoYW5cbiAgICAvLyByZW1vdmluZyB0aGUgaW1wb3J0LiBGb3Igb3RoZXIgcmVmZXJlbmNlcywgd2UgcmVtb3ZlIHRoZSBpbXBvcnQgYW5kIHRoZSByZWZlcmVuY2VcbiAgICAvLyBpZGVudGlmaWVyIGlmIHVzZWQgaW5zaWRlIG9mIGEgcHJvdmlkZXIgZGVmaW5pdGlvbi5cbiAgICBpZiAoaXNJbXBvcnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcm92aWRlckFzc2lnbm1lbnQgPSBub2RlLnBhcmVudDtcblxuICAgIC8vIE9ubHkgcmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlIGdlc3R1cmUgY29uZmlnIHdoaWNoIGFyZSBwYXJ0IG9mIGEgc3RhdGljYWxseVxuICAgIC8vIGFuYWx5emFibGUgcHJvdmlkZXIgZGVmaW5pdGlvbi4gV2Ugb25seSBzdXBwb3J0IHRoZSBjb21tb24gY2FzZSBvZiBhIGdlc3R1cmVcbiAgICAvLyBjb25maWcgcHJvdmlkZXIgZGVmaW5pdGlvbiB3aGVyZSB0aGUgY29uZmlnIGlzIHNldCB1cCB0aHJvdWdoIFwidXNlQ2xhc3NcIi5cbiAgICAvLyBPdGhlcndpc2UsIGl0J3Mgbm90IGd1YXJhbnRlZWQgdGhhdCB3ZSBjYW4gc2FmZWx5IHJlbW92ZSB0aGUgcHJvdmlkZXIgZGVmaW5pdGlvbi5cbiAgICBpZiAoXG4gICAgICAhdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvdmlkZXJBc3NpZ25tZW50KSB8fFxuICAgICAgZ2V0UHJvcGVydHlOYW1lVGV4dChwcm92aWRlckFzc2lnbm1lbnQubmFtZSkgIT09ICd1c2VDbGFzcydcbiAgICApIHtcbiAgICAgIHRoaXMuX25vZGVGYWlsdXJlcy5wdXNoKHtub2RlLCBtZXNzYWdlOiBDQU5OT1RfUkVNT1ZFX1JFRkVSRU5DRV9FUlJPUn0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9iamVjdExpdGVyYWxFeHByID0gcHJvdmlkZXJBc3NpZ25tZW50LnBhcmVudDtcbiAgICBjb25zdCBwcm92aWRlVG9rZW4gPSBvYmplY3RMaXRlcmFsRXhwci5wcm9wZXJ0aWVzLmZpbmQoXG4gICAgICAocCk6IHAgaXMgdHMuUHJvcGVydHlBc3NpZ25tZW50ID0+XG4gICAgICAgIHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHApICYmIGdldFByb3BlcnR5TmFtZVRleHQocC5uYW1lKSA9PT0gJ3Byb3ZpZGUnLFxuICAgICk7XG5cbiAgICAvLyBEbyBub3QgcmVtb3ZlIHRoZSByZWZlcmVuY2UgaWYgdGhlIGdlc3R1cmUgY29uZmlnIGlzIG5vdCBwYXJ0IG9mIGEgcHJvdmlkZXIgZGVmaW5pdGlvbixcbiAgICAvLyBvciBpZiB0aGUgcHJvdmlkZWQgdG9rZSBpcyBub3QgcmVmZXJyaW5nIHRvIHRoZSBrbm93biBIQU1NRVJfR0VTVFVSRV9DT05GSUcgdG9rZW5cbiAgICAvLyBmcm9tIHBsYXRmb3JtLWJyb3dzZXIuXG4gICAgaWYgKCFwcm92aWRlVG9rZW4gfHwgIXRoaXMuX2lzUmVmZXJlbmNlVG9IYW1tZXJDb25maWdUb2tlbihwcm92aWRlVG9rZW4uaW5pdGlhbGl6ZXIpKSB7XG4gICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7bm9kZSwgbWVzc2FnZTogQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1J9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDb2xsZWN0IGFsbCBuZXN0ZWQgaWRlbnRpZmllcnMgd2hpY2ggd2lsbCBiZSBkZWxldGVkLiBUaGlzIGhlbHBzIHVzXG4gICAgLy8gZGV0ZXJtaW5pbmcgaWYgd2UgY2FuIHJlbW92ZSBpbXBvcnRzIGZvciB0aGUgXCJIQU1NRVJfR0VTVFVSRV9DT05GSUdcIiB0b2tlbi5cbiAgICB0aGlzLl9kZWxldGVkSWRlbnRpZmllcnMucHVzaCguLi5maW5kTWF0Y2hpbmdDaGlsZE5vZGVzKG9iamVjdExpdGVyYWxFeHByLCB0cy5pc0lkZW50aWZpZXIpKTtcblxuICAgIC8vIEluIGNhc2UgdGhlIGZvdW5kIHByb3ZpZGVyIGRlZmluaXRpb24gaXMgbm90IHBhcnQgb2YgYW4gYXJyYXkgbGl0ZXJhbCxcbiAgICAvLyB3ZSBjYW5ub3Qgc2FmZWx5IHJlbW92ZSB0aGUgcHJvdmlkZXIuIFRoaXMgaXMgYmVjYXVzZSBpdCBjb3VsZCBiZSBkZWNsYXJlZFxuICAgIC8vIGFzIGEgdmFyaWFibGUuIGUuZy4gXCJjb25zdCBnZXN0dXJlUHJvdmlkZXIgPSB7cHJvdmlkZTogLi4sIHVzZUNsYXNzOiBHZXN0dXJlQ29uZmlnfVwiLlxuICAgIC8vIEluIHRoYXQgY2FzZSwgd2UganVzdCBhZGQgYW4gZW1wdHkgb2JqZWN0IGxpdGVyYWwgd2l0aCBUT0RPIGFuZCBwcmludCBhIGZhaWx1cmUuXG4gICAgaWYgKCF0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24ob2JqZWN0TGl0ZXJhbEV4cHIucGFyZW50KSkge1xuICAgICAgcmVjb3JkZXIucmVtb3ZlKG9iamVjdExpdGVyYWxFeHByLmdldFN0YXJ0KCksIG9iamVjdExpdGVyYWxFeHByLmdldFdpZHRoKCkpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQob2JqZWN0TGl0ZXJhbEV4cHIuZ2V0U3RhcnQoKSwgYC8qIFRPRE86IHJlbW92ZSAqLyB7fWApO1xuICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe1xuICAgICAgICBub2RlOiBvYmplY3RMaXRlcmFsRXhwcixcbiAgICAgICAgbWVzc2FnZTpcbiAgICAgICAgICBgVW5hYmxlIHRvIGRlbGV0ZSBwcm92aWRlciBkZWZpbml0aW9uIGZvciBcIkdlc3R1cmVDb25maWdcIiBjb21wbGV0ZWx5LiBgICtcbiAgICAgICAgICBgUGxlYXNlIGNsZWFuIHVwIHRoZSBwcm92aWRlci5gLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlcyB0aGUgb2JqZWN0IGxpdGVyYWwgZnJvbSB0aGUgcGFyZW50IGFycmF5IGV4cHJlc3Npb24uIFJlbW92ZXNcbiAgICAvLyB0aGUgdHJhaWxpbmcgY29tbWEgdG9rZW4gaWYgcHJlc2VudC5cbiAgICByZW1vdmVFbGVtZW50RnJvbUFycmF5RXhwcmVzc2lvbihvYmplY3RMaXRlcmFsRXhwciwgcmVjb3JkZXIpO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgdGhlIGdpdmVuIGhhbW1lciBjb25maWcgdG9rZW4gaW1wb3J0IGlmIGl0IGlzIG5vdCB1c2VkLiAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJDb25maWdUb2tlbkltcG9ydElmVW51c2VkKHtub2RlLCBpbXBvcnREYXRhfTogSWRlbnRpZmllclJlZmVyZW5jZSkge1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCBpc1Rva2VuVXNlZCA9IHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKFxuICAgICAgciA9PlxuICAgICAgICAhci5pc0ltcG9ydCAmJlxuICAgICAgICAhaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2VzcyhyLm5vZGUpICYmXG4gICAgICAgIHIubm9kZS5nZXRTb3VyY2VGaWxlKCkgPT09IHNvdXJjZUZpbGUgJiZcbiAgICAgICAgIXRoaXMuX2RlbGV0ZWRJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpLFxuICAgICk7XG5cbiAgICAvLyBXZSBkb24ndCB3YW50IHRvIHJlbW92ZSB0aGUgaW1wb3J0IGZvciB0aGUgdG9rZW4gaWYgdGhlIHRva2VuIGlzXG4gICAgLy8gc3RpbGwgdXNlZCBzb21ld2hlcmUuXG4gICAgaWYgKCFpc1Rva2VuVXNlZCkge1xuICAgICAgdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoXG4gICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgIEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSxcbiAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVtb3ZlcyBIYW1tZXIgZnJvbSBhbGwgaW5kZXggSFRNTCBmaWxlcyBvZiB0aGUgY3VycmVudCBwcm9qZWN0LiAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJGcm9tSW5kZXhGaWxlKCkge1xuICAgIGNvbnN0IGluZGV4RmlsZVBhdGhzID0gZ2V0UHJvamVjdEluZGV4RmlsZXModGhpcy5jb250ZXh0LnByb2plY3QpO1xuICAgIGluZGV4RmlsZVBhdGhzLmZvckVhY2goZmlsZVBhdGggPT4ge1xuICAgICAgaWYgKCF0aGlzLmZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhmaWxlUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBodG1sQ29udGVudCA9IHRoaXMuZmlsZVN5c3RlbS5yZWFkKGZpbGVQYXRoKSE7XG4gICAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZmlsZVN5c3RlbS5lZGl0KGZpbGVQYXRoKTtcblxuICAgICAgZmluZEhhbW1lclNjcmlwdEltcG9ydEVsZW1lbnRzKGh0bWxDb250ZW50KS5mb3JFYWNoKGVsID0+XG4gICAgICAgIHJlbW92ZUVsZW1lbnRGcm9tSHRtbChlbCwgcmVjb3JkZXIpLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSBIYW1tZXIgZ2VzdHVyZSBjb25maWcgaW4gdGhlIHJvb3QgbW9kdWxlIGlmIG5lZWRlZC4gKi9cbiAgcHJpdmF0ZSBfc2V0dXBOZXdHZXN0dXJlQ29uZmlnSW5Sb290TW9kdWxlKGdlc3R1cmVDb25maWdQYXRoOiBQYXRoKSB7XG4gICAgY29uc3Qge3Byb2plY3R9ID0gdGhpcy5jb250ZXh0O1xuICAgIGNvbnN0IG1haW5GaWxlUGF0aCA9IGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KTtcbiAgICBjb25zdCByb290TW9kdWxlU3ltYm9sID0gdGhpcy5fZ2V0Um9vdE1vZHVsZVN5bWJvbChtYWluRmlsZVBhdGgpO1xuXG4gICAgaWYgKHJvb3RNb2R1bGVTeW1ib2wgPT09IG51bGwgfHwgcm9vdE1vZHVsZVN5bWJvbC52YWx1ZURlY2xhcmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiBtYWluRmlsZVBhdGgsXG4gICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgYENvdWxkIG5vdCBzZXR1cCBIYW1tZXIgZ2VzdHVyZXMgaW4gbW9kdWxlLiBQbGVhc2UgYCArXG4gICAgICAgICAgYG1hbnVhbGx5IGVuc3VyZSB0aGF0IHRoZSBIYW1tZXIgZ2VzdHVyZSBjb25maWcgaXMgc2V0IHVwLmAsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VGaWxlID0gcm9vdE1vZHVsZVN5bWJvbC52YWx1ZURlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCBtZXRhZGF0YSA9IGdldERlY29yYXRvck1ldGFkYXRhKFxuICAgICAgc291cmNlRmlsZSxcbiAgICAgICdOZ01vZHVsZScsXG4gICAgICAnQGFuZ3VsYXIvY29yZScsXG4gICAgKSBhcyB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbltdO1xuXG4gICAgLy8gSWYgbm8gXCJOZ01vZHVsZVwiIGRlZmluaXRpb24gaXMgZm91bmQgaW5zaWRlIHRoZSBzb3VyY2UgZmlsZSwgd2UganVzdCBkbyBub3RoaW5nLlxuICAgIGlmICghbWV0YWRhdGEubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZVBhdGggPSB0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZmlsZVN5c3RlbS5lZGl0KGZpbGVQYXRoKTtcbiAgICBjb25zdCBwcm92aWRlcnNGaWVsZCA9IGdldE1ldGFkYXRhRmllbGQobWV0YWRhdGFbMF0sICdwcm92aWRlcnMnKVswXTtcbiAgICBjb25zdCBwcm92aWRlcklkZW50aWZpZXJzID0gcHJvdmlkZXJzRmllbGRcbiAgICAgID8gZmluZE1hdGNoaW5nQ2hpbGROb2Rlcyhwcm92aWRlcnNGaWVsZCwgdHMuaXNJZGVudGlmaWVyKVxuICAgICAgOiBudWxsO1xuICAgIGNvbnN0IGdlc3R1cmVDb25maWdFeHByID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICBzb3VyY2VGaWxlLFxuICAgICAgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSxcbiAgICAgIGdldE1vZHVsZVNwZWNpZmllcihnZXN0dXJlQ29uZmlnUGF0aCwgZmlsZVBhdGgpLFxuICAgICAgZmFsc2UsXG4gICAgICB0aGlzLl9nZXRHZXN0dXJlQ29uZmlnSWRlbnRpZmllcnNPZkZpbGUoc291cmNlRmlsZSksXG4gICAgKTtcbiAgICBjb25zdCBoYW1tZXJDb25maWdUb2tlbkV4cHIgPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgIHNvdXJjZUZpbGUsXG4gICAgICBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUsXG4gICAgICBIQU1NRVJfQ09ORklHX1RPS0VOX01PRFVMRSxcbiAgICApO1xuICAgIGNvbnN0IG5ld1Byb3ZpZGVyTm9kZSA9IHRzLmNyZWF0ZU9iamVjdExpdGVyYWwoW1xuICAgICAgdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KCdwcm92aWRlJywgaGFtbWVyQ29uZmlnVG9rZW5FeHByKSxcbiAgICAgIHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgndXNlQ2xhc3MnLCBnZXN0dXJlQ29uZmlnRXhwciksXG4gICAgXSk7XG5cbiAgICAvLyBJZiB0aGUgcHJvdmlkZXJzIGZpZWxkIGV4aXN0cyBhbmQgYWxyZWFkeSBjb250YWlucyByZWZlcmVuY2VzIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZVxuICAgIC8vIGNvbmZpZyB0b2tlbiBhbmQgdGhlIGdlc3R1cmUgY29uZmlnLCB3ZSBuYWl2ZWx5IGFzc3VtZSB0aGF0IHRoZSBnZXN0dXJlIGNvbmZpZyBpc1xuICAgIC8vIGFscmVhZHkgc2V0IHVwLiBXZSBvbmx5IHdhbnQgdG8gYWRkIHRoZSBnZXN0dXJlIGNvbmZpZyBwcm92aWRlciBpZiBpdCBpcyBub3Qgc2V0IHVwLlxuICAgIGlmIChcbiAgICAgICFwcm92aWRlcklkZW50aWZpZXJzIHx8XG4gICAgICAhKFxuICAgICAgICB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHByb3ZpZGVySWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSkgJiZcbiAgICAgICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuc29tZShyID0+IHByb3ZpZGVySWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSlcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IHN5bWJvbE5hbWUgPSB0aGlzLl9wcmludE5vZGUobmV3UHJvdmlkZXJOb2RlLCBzb3VyY2VGaWxlKTtcbiAgICAgIGFkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YShcbiAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgc291cmNlRmlsZS5maWxlTmFtZSxcbiAgICAgICAgJ3Byb3ZpZGVycycsXG4gICAgICAgIHN5bWJvbE5hbWUsXG4gICAgICAgIG51bGwsXG4gICAgICApLmZvckVhY2goY2hhbmdlID0+IHtcbiAgICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBUeXBlU2NyaXB0IHN5bWJvbCBvZiB0aGUgcm9vdCBtb2R1bGUgYnkgbG9va2luZyBmb3IgdGhlIG1vZHVsZVxuICAgKiBib290c3RyYXAgZXhwcmVzc2lvbiBpbiB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0Um9vdE1vZHVsZVN5bWJvbChtYWluRmlsZVBhdGg6IFBhdGgpOiB0cy5TeW1ib2wgfCBudWxsIHtcbiAgICBjb25zdCBtYWluRmlsZSA9IHRoaXMucHJvZ3JhbS5nZXRTb3VyY2VGaWxlKG1haW5GaWxlUGF0aCk7XG4gICAgaWYgKCFtYWluRmlsZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYXBwTW9kdWxlRXhwciA9IGZpbmRNYWluTW9kdWxlRXhwcmVzc2lvbihtYWluRmlsZSk7XG4gICAgaWYgKCFhcHBNb2R1bGVFeHByKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhcHBNb2R1bGVTeW1ib2wgPSB0aGlzLl9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZSh1bndyYXBFeHByZXNzaW9uKGFwcE1vZHVsZUV4cHIpKTtcbiAgICBpZiAoIWFwcE1vZHVsZVN5bWJvbCB8fCAhYXBwTW9kdWxlU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gYXBwTW9kdWxlU3ltYm9sO1xuICB9XG5cbiAgLyoqIFNldHMgdXAgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaW4gdGhlIHJvb3QgbW9kdWxlIG9mIHRoZSBjdXJyZW50IHByb2plY3QuICovXG4gIHByaXZhdGUgX3NldHVwSGFtbWVyTW9kdWxlSW5Sb290TW9kdWxlKCkge1xuICAgIGNvbnN0IHtwcm9qZWN0fSA9IHRoaXMuY29udGV4dDtcbiAgICBjb25zdCBtYWluRmlsZVBhdGggPSBnZXRQcm9qZWN0TWFpbkZpbGUocHJvamVjdCk7XG4gICAgY29uc3Qgcm9vdE1vZHVsZVN5bWJvbCA9IHRoaXMuX2dldFJvb3RNb2R1bGVTeW1ib2wobWFpbkZpbGVQYXRoKTtcblxuICAgIGlmIChyb290TW9kdWxlU3ltYm9sID09PSBudWxsIHx8IHJvb3RNb2R1bGVTeW1ib2wudmFsdWVEZWNsYXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmZhaWx1cmVzLnB1c2goe1xuICAgICAgICBmaWxlUGF0aDogbWFpbkZpbGVQYXRoLFxuICAgICAgICBtZXNzYWdlOlxuICAgICAgICAgIGBDb3VsZCBub3Qgc2V0dXAgSGFtbWVyTW9kdWxlLiBQbGVhc2UgbWFudWFsbHkgc2V0IHVwIHRoZSBcIkhhbW1lck1vZHVsZVwiIGAgK1xuICAgICAgICAgIGBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLmAsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VGaWxlID0gcm9vdE1vZHVsZVN5bWJvbC52YWx1ZURlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCBtZXRhZGF0YSA9IGdldERlY29yYXRvck1ldGFkYXRhKFxuICAgICAgc291cmNlRmlsZSxcbiAgICAgICdOZ01vZHVsZScsXG4gICAgICAnQGFuZ3VsYXIvY29yZScsXG4gICAgKSBhcyB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbltdO1xuICAgIGlmICghbWV0YWRhdGEubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW1wb3J0c0ZpZWxkID0gZ2V0TWV0YWRhdGFGaWVsZChtZXRhZGF0YVswXSwgJ2ltcG9ydHMnKVswXTtcbiAgICBjb25zdCBpbXBvcnRJZGVudGlmaWVycyA9IGltcG9ydHNGaWVsZFxuICAgICAgPyBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzKGltcG9ydHNGaWVsZCwgdHMuaXNJZGVudGlmaWVyKVxuICAgICAgOiBudWxsO1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5maWxlU3lzdGVtLmVkaXQodGhpcy5maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSkpO1xuICAgIGNvbnN0IGhhbW1lck1vZHVsZUV4cHIgPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgIHNvdXJjZUZpbGUsXG4gICAgICBIQU1NRVJfTU9EVUxFX05BTUUsXG4gICAgICBIQU1NRVJfTU9EVUxFX0lNUE9SVCxcbiAgICApO1xuXG4gICAgLy8gSWYgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaXMgbm90IGFscmVhZHkgaW1wb3J0ZWQgaW4gdGhlIGFwcCBtb2R1bGUsIHdlIHNldCBpdCB1cFxuICAgIC8vIGJ5IGFkZGluZyBpdCB0byB0aGUgXCJpbXBvcnRzXCIgZmllbGQgb2YgdGhlIGFwcCBtb2R1bGUuXG4gICAgaWYgKFxuICAgICAgIWltcG9ydElkZW50aWZpZXJzIHx8XG4gICAgICAhdGhpcy5faGFtbWVyTW9kdWxlUmVmZXJlbmNlcy5zb21lKHIgPT4gaW1wb3J0SWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSlcbiAgICApIHtcbiAgICAgIGNvbnN0IHN5bWJvbE5hbWUgPSB0aGlzLl9wcmludE5vZGUoaGFtbWVyTW9kdWxlRXhwciwgc291cmNlRmlsZSk7XG4gICAgICBhZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEoXG4gICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgIHNvdXJjZUZpbGUuZmlsZU5hbWUsXG4gICAgICAgICdpbXBvcnRzJyxcbiAgICAgICAgc3ltYm9sTmFtZSxcbiAgICAgICAgbnVsbCxcbiAgICAgICkuZm9yRWFjaChjaGFuZ2UgPT4ge1xuICAgICAgICBpZiAoY2hhbmdlIGluc3RhbmNlb2YgSW5zZXJ0Q2hhbmdlKSB7XG4gICAgICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFByaW50cyBhIGdpdmVuIG5vZGUgd2l0aGluIHRoZSBzcGVjaWZpZWQgc291cmNlIGZpbGUuICovXG4gIHByaXZhdGUgX3ByaW50Tm9kZShub2RlOiB0cy5Ob2RlLCBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcHJpbnRlci5wcmludE5vZGUodHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsIG5vZGUsIHNvdXJjZUZpbGUpO1xuICB9XG5cbiAgLyoqIEdldHMgYWxsIHJlZmVyZW5jZWQgZ2VzdHVyZSBjb25maWcgaWRlbnRpZmllcnMgb2YgYSBnaXZlbiBzb3VyY2UgZmlsZSAqL1xuICBwcml2YXRlIF9nZXRHZXN0dXJlQ29uZmlnSWRlbnRpZmllcnNPZkZpbGUoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IHRzLklkZW50aWZpZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzXG4gICAgICAuZmlsdGVyKGQgPT4gZC5ub2RlLmdldFNvdXJjZUZpbGUoKSA9PT0gc291cmNlRmlsZSlcbiAgICAgIC5tYXAoZCA9PiBkLm5vZGUpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHN5bWJvbCB0aGF0IGNvbnRhaW5zIHRoZSB2YWx1ZSBkZWNsYXJhdGlvbiBvZiB0aGUgc3BlY2lmaWVkIG5vZGUuICovXG4gIHByaXZhdGUgX2dldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKG5vZGU6IHRzLk5vZGUpOiB0cy5TeW1ib2wgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHN5bWJvbCA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihub2RlKTtcblxuICAgIC8vIFN5bWJvbHMgY2FuIGJlIGFsaWFzZXMgb2YgdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC4gZS5nLiBpbiBuYW1lZCBpbXBvcnQgc3BlY2lmaWVycy5cbiAgICAvLyBXZSBuZWVkIHRvIHJlc29sdmUgdGhlIGFsaWFzZWQgc3ltYm9sIGJhY2sgdG8gdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYml0d2lzZVxuICAgIGlmIChzeW1ib2wgJiYgKHN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSAhPT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudHlwZUNoZWNrZXIuZ2V0QWxpYXNlZFN5bWJvbChzeW1ib2wpO1xuICAgIH1cbiAgICByZXR1cm4gc3ltYm9sO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBleHByZXNzaW9uIHJlc29sdmVzIHRvIGEgaGFtbWVyIGdlc3R1cmUgY29uZmlnXG4gICAqIHRva2VuIHJlZmVyZW5jZSBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfaXNSZWZlcmVuY2VUb0hhbW1lckNvbmZpZ1Rva2VuKGV4cHI6IHRzLkV4cHJlc3Npb24pIHtcbiAgICBjb25zdCB1bndyYXBwZWQgPSB1bndyYXBFeHByZXNzaW9uKGV4cHIpO1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIodW53cmFwcGVkKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gci5ub2RlID09PSB1bndyYXBwZWQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24odW53cmFwcGVkKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT4gci5ub2RlID09PSB1bndyYXBwZWQubmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIG1pZ3JhdGlvbiBmYWlsdXJlcyBvZiB0aGUgY29sbGVjdGVkIG5vZGUgZmFpbHVyZXMuIFRoZSByZXR1cm5lZCBtaWdyYXRpb25cbiAgICogZmFpbHVyZXMgYXJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgcG9zdC1taWdyYXRpb24gc3RhdGUgb2Ygc291cmNlIGZpbGVzLiBNZWFuaW5nXG4gICAqIHRoYXQgZmFpbHVyZSBwb3NpdGlvbnMgYXJlIGNvcnJlY3RlZCBpZiBzb3VyY2UgZmlsZSBtb2RpZmljYXRpb25zIHNoaWZ0ZWQgbGluZXMuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVNaWdyYXRpb25GYWlsdXJlcygpOiBNaWdyYXRpb25GYWlsdXJlW10ge1xuICAgIHJldHVybiB0aGlzLl9ub2RlRmFpbHVyZXMubWFwKCh7bm9kZSwgbWVzc2FnZX0pID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICAgIGNvbnN0IG9mZnNldCA9IG5vZGUuZ2V0U3RhcnQoKTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdHMuZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24oc291cmNlRmlsZSwgbm9kZS5nZXRTdGFydCgpKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aW9uOiB0aGlzLl9pbXBvcnRNYW5hZ2VyLmNvcnJlY3ROb2RlUG9zaXRpb24obm9kZSwgb2Zmc2V0LCBwb3NpdGlvbiksXG4gICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIGZpbGVQYXRoOiB0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShzb3VyY2VGaWxlLmZpbGVOYW1lKSxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKiogR2xvYmFsIHN0YXRlIG9mIHdoZXRoZXIgSGFtbWVyIGlzIHVzZWQgaW4gYW55IGFuYWx5emVkIHByb2plY3QgdGFyZ2V0LiAqL1xuICBzdGF0aWMgZ2xvYmFsVXNlc0hhbW1lciA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBTdGF0aWMgbWlncmF0aW9uIHJ1bGUgbWV0aG9kIHRoYXQgd2lsbCBiZSBjYWxsZWQgb25jZSBhbGwgcHJvamVjdCB0YXJnZXRzXG4gICAqIGhhdmUgYmVlbiBtaWdyYXRlZCBpbmRpdmlkdWFsbHkuIFRoaXMgbWV0aG9kIGNhbiBiZSB1c2VkIHRvIG1ha2UgY2hhbmdlcyBiYXNlZFxuICAgKiBvbiB0aGUgYW5hbHlzaXMgb2YgdGhlIGluZGl2aWR1YWwgdGFyZ2V0cy4gRm9yIGV4YW1wbGU6IHdlIG9ubHkgcmVtb3ZlIEhhbW1lclxuICAgKiBmcm9tIHRoZSBcInBhY2thZ2UuanNvblwiIGlmIGl0IGlzIG5vdCB1c2VkIGluICphbnkqIHByb2plY3QgdGFyZ2V0LlxuICAgKi9cbiAgc3RhdGljIG92ZXJyaWRlIGdsb2JhbFBvc3RNaWdyYXRpb24odHJlZTogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCk6IFBvc3RNaWdyYXRpb25BY3Rpb24ge1xuICAgIC8vIEFsd2F5cyBub3RpZnkgdGhlIGRldmVsb3BlciB0aGF0IHRoZSBIYW1tZXIgdjkgbWlncmF0aW9uIGRvZXMgbm90IG1pZ3JhdGUgdGVzdHMuXG4gICAgY29udGV4dC5sb2dnZXIuaW5mbyhcbiAgICAgICdcXG7imqAgIEdlbmVyYWwgbm90aWNlOiBUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIENvbXBvbmVudHMgaXMgbm90IGFibGUgdG8gJyArXG4gICAgICAgICdtaWdyYXRlIHRlc3RzLiBQbGVhc2UgbWFudWFsbHkgY2xlYW4gdXAgdGVzdHMgaW4geW91ciBwcm9qZWN0IGlmIHRoZXkgcmVseSBvbiAnICtcbiAgICAgICAgKHRoaXMuZ2xvYmFsVXNlc0hhbW1lciA/ICd0aGUgZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLicgOiAnSGFtbWVySlMuJyksXG4gICAgKTtcbiAgICBjb250ZXh0LmxvZ2dlci5pbmZvKFxuICAgICAgJ1JlYWQgbW9yZSBhYm91dCBtaWdyYXRpbmcgdGVzdHM6IGh0dHBzOi8vZ2l0LmlvL25nLW1hdGVyaWFsLXY5LWhhbW1lci1taWdyYXRlLXRlc3RzJyxcbiAgICApO1xuXG4gICAgaWYgKCF0aGlzLmdsb2JhbFVzZXNIYW1tZXIgJiYgdGhpcy5fcmVtb3ZlSGFtbWVyRnJvbVBhY2thZ2VKc29uKHRyZWUpKSB7XG4gICAgICAvLyBTaW5jZSBIYW1tZXIgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSB3b3Jrc3BhY2UgXCJwYWNrYWdlLmpzb25cIiBmaWxlLFxuICAgICAgLy8gd2Ugc2NoZWR1bGUgYSBub2RlIHBhY2thZ2UgaW5zdGFsbCB0YXNrIHRvIHJlZnJlc2ggdGhlIGxvY2sgZmlsZS5cbiAgICAgIHJldHVybiB7cnVuUGFja2FnZU1hbmFnZXI6IHRydWV9O1xuICAgIH1cblxuICAgIC8vIENsZWFuIGdsb2JhbCBzdGF0ZSBvbmNlIHRoZSB3b3Jrc3BhY2UgaGFzIGJlZW4gbWlncmF0ZWQuIFRoaXMgaXMgdGVjaG5pY2FsbHlcbiAgICAvLyBub3QgbmVjZXNzYXJ5IGluIFwibmcgdXBkYXRlXCIsIGJ1dCBpbiB0ZXN0cyB3ZSByZS11c2UgdGhlIHNhbWUgcnVsZSBjbGFzcy5cbiAgICB0aGlzLmdsb2JhbFVzZXNIYW1tZXIgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBoYW1tZXIgcGFja2FnZSBmcm9tIHRoZSB3b3Jrc3BhY2UgXCJwYWNrYWdlLmpzb25cIi5cbiAgICogQHJldHVybnMgV2hldGhlciBIYW1tZXIgd2FzIHNldCB1cCBhbmQgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBcInBhY2thZ2UuanNvblwiXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBfcmVtb3ZlSGFtbWVyRnJvbVBhY2thZ2VKc29uKHRyZWU6IFRyZWUpOiBib29sZWFuIHtcbiAgICBpZiAoIXRyZWUuZXhpc3RzKCcvcGFja2FnZS5qc29uJykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBwYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UodHJlZS5yZWFkKCcvcGFja2FnZS5qc29uJykhLnRvU3RyaW5nKCd1dGY4JykpIGFzIFBhY2thZ2VKc29uO1xuXG4gICAgLy8gV2UgZG8gbm90IGhhbmRsZSB0aGUgY2FzZSB3aGVyZSBzb21lb25lIG1hbnVhbGx5IGFkZGVkIFwiaGFtbWVyanNcIiB0byB0aGUgZGV2IGRlcGVuZGVuY2llcy5cbiAgICBpZiAocGFja2FnZUpzb24uZGVwZW5kZW5jaWVzICYmIHBhY2thZ2VKc29uLmRlcGVuZGVuY2llc1tIQU1NRVJfTU9EVUxFX1NQRUNJRklFUl0pIHtcbiAgICAgIGRlbGV0ZSBwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXNbSEFNTUVSX01PRFVMRV9TUEVDSUZJRVJdO1xuICAgICAgdHJlZS5vdmVyd3JpdGUoJy9wYWNrYWdlLmpzb24nLCBKU09OLnN0cmluZ2lmeShwYWNrYWdlSnNvbiwgbnVsbCwgMikpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IHVud3JhcHMgYSBnaXZlbiBleHByZXNzaW9uIGlmIGl0IGlzIHdyYXBwZWRcbiAqIGJ5IHBhcmVudGhlc2lzLCB0eXBlIGNhc3RzIG9yIHR5cGUgYXNzZXJ0aW9ucy5cbiAqL1xuZnVuY3Rpb24gdW53cmFwRXhwcmVzc2lvbihub2RlOiB0cy5Ob2RlKTogdHMuTm9kZSB7XG4gIGlmICh0cy5pc1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgcmV0dXJuIHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgfSBlbHNlIGlmICh0cy5pc0FzRXhwcmVzc2lvbihub2RlKSkge1xuICAgIHJldHVybiB1bndyYXBFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gIH0gZWxzZSBpZiAodHMuaXNUeXBlQXNzZXJ0aW9uKG5vZGUpKSB7XG4gICAgcmV0dXJuIHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgfVxuICByZXR1cm4gbm9kZTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyB0aGUgc3BlY2lmaWVkIHBhdGggdG8gYSB2YWxpZCBUeXBlU2NyaXB0IG1vZHVsZSBzcGVjaWZpZXIgd2hpY2ggaXNcbiAqIHJlbGF0aXZlIHRvIHRoZSBnaXZlbiBjb250YWluaW5nIGZpbGUuXG4gKi9cbmZ1bmN0aW9uIGdldE1vZHVsZVNwZWNpZmllcihuZXdQYXRoOiBQYXRoLCBjb250YWluaW5nRmlsZTogUGF0aCkge1xuICBsZXQgcmVzdWx0ID0gcmVsYXRpdmUoZGlybmFtZShjb250YWluaW5nRmlsZSksIG5ld1BhdGgpLnJlcGxhY2UoL1xcXFwvZywgJy8nKS5yZXBsYWNlKC9cXC50cyQvLCAnJyk7XG4gIGlmICghcmVzdWx0LnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgIHJlc3VsdCA9IGAuLyR7cmVzdWx0fWA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSBuYW1lLlxuICogQHJldHVybnMgVGV4dCBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgbmFtZS4gTnVsbCBpZiBub3Qgc3RhdGljYWxseSBhbmFseXphYmxlLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eU5hbWVUZXh0KG5vZGU6IHRzLlByb3BlcnR5TmFtZSk6IHN0cmluZyB8IG51bGwge1xuICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpIHx8IHRzLmlzU3RyaW5nTGl0ZXJhbExpa2Uobm9kZSkpIHtcbiAgICByZXR1cm4gbm9kZS50ZXh0O1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIGlkZW50aWZpZXIgaXMgcGFydCBvZiBhIG5hbWVzcGFjZWQgYWNjZXNzLiAqL1xuZnVuY3Rpb24gaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2Vzcyhub2RlOiB0cy5JZGVudGlmaWVyKTogYm9vbGVhbiB7XG4gIHJldHVybiB0cy5pc1F1YWxpZmllZE5hbWUobm9kZS5wYXJlbnQpIHx8IHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUucGFyZW50KTtcbn1cblxuLyoqXG4gKiBXYWxrcyB0aHJvdWdoIHRoZSBzcGVjaWZpZWQgbm9kZSBhbmQgcmV0dXJucyBhbGwgY2hpbGQgbm9kZXMgd2hpY2ggbWF0Y2ggdGhlXG4gKiBnaXZlbiBwcmVkaWNhdGUuXG4gKi9cbmZ1bmN0aW9uIGZpbmRNYXRjaGluZ0NoaWxkTm9kZXM8VCBleHRlbmRzIHRzLk5vZGU+KFxuICBwYXJlbnQ6IHRzLk5vZGUsXG4gIHByZWRpY2F0ZTogKG5vZGU6IHRzLk5vZGUpID0+IG5vZGUgaXMgVCxcbik6IFRbXSB7XG4gIGNvbnN0IHJlc3VsdDogVFtdID0gW107XG4gIGNvbnN0IHZpc2l0Tm9kZSA9IChub2RlOiB0cy5Ob2RlKSA9PiB7XG4gICAgaWYgKHByZWRpY2F0ZShub2RlKSkge1xuICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XG4gICAgfVxuICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCB2aXNpdE5vZGUpO1xuICB9O1xuICB0cy5mb3JFYWNoQ2hpbGQocGFyZW50LCB2aXNpdE5vZGUpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl19