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
        // The migration is enabled when v9 or v10 are targeted, but actual targets are only
        // migrated if they are not test targets. We cannot migrate test targets since they have
        // a limited scope, in regards to their source files, and therefore the HammerJS usage
        // detection could be incorrect.
        this.enabled = HammerGesturesMigration._isAllowedVersion(this.targetVersion) && !this.context.isTestTarget;
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
                    'https://github.com/angular/components/blob/3a204da37fd1366cae411b5c234517ecad199737/guides/v9-hammerjs-migration.md#the-migration-reported-ambiguous-usage-what-should-i-do');
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
                    'https://github.com/angular/components/blob/3a204da37fd1366cae411b5c234517ecad199737/guides/v9-hammerjs-migration.md#the-migration-reported-ambiguous-usage-what-should-i-do');
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
                'https://github.com/angular/components/blob/3a204da37fd1366cae411b5c234517ecad199737/guides/v9-hammerjs-migration.md#the-migration-reported-ambiguous-usage-what-should-i-do');
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
        const newProviderNode = ts.factory.createObjectLiteralExpression([
            ts.factory.createPropertyAssignment('provide', hammerConfigTokenExpr),
            ts.factory.createPropertyAssignment('useClass', gestureConfigExpr),
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
    static globalPostMigration(tree, target, context) {
        // Skip printing any global messages when the target version is not allowed.
        if (!this._isAllowedVersion(target)) {
            return;
        }
        // Always notify the developer that the Hammer v9 migration does not migrate tests.
        context.logger.info('\n⚠  General notice: The HammerJS v9 migration for Angular Components is not able to ' +
            'migrate tests. Please manually clean up tests in your project if they rely on ' +
            (this.globalUsesHammer ? 'the deprecated Angular Material gesture config.' : 'HammerJS.'));
        context.logger.info('Read more about migrating tests: https://github.com/angular/components/blob/3a204da37fd1366cae411b5c234517ecad199737/guides/v9-hammerjs-migration.md#how-to-migrate-my-tests');
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
    /** Gets whether the migration is allowed to run for specified target version. */
    static _isAllowedVersion(target) {
        // This migration is only allowed to run for v9 or v10 target versions.
        return target === schematics_1.TargetVersion.V9 || target === schematics_1.TargetVersion.V10;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLWdlc3R1cmVzLW1pZ3JhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL2hhbW1lci1nZXN0dXJlcy12OS9oYW1tZXItZ2VzdHVyZXMtbWlncmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILCtDQUFtRTtBQUVuRSx3REFhaUM7QUFDakMsK0RBQWdFO0FBQ2hFLDJCQUFnQztBQUNoQyxpQ0FBaUM7QUFFakMsdUVBQXlFO0FBQ3pFLHlEQUE0RDtBQUM1RCxtRUFBaUU7QUFDakUscURBQStDO0FBQy9DLGlFQUF3RTtBQUN4RSx5RUFBaUU7QUFFakUsTUFBTSx5QkFBeUIsR0FBRyxlQUFlLENBQUM7QUFDbEQsTUFBTSx3QkFBd0IsR0FBRyxnQkFBZ0IsQ0FBQztBQUNsRCxNQUFNLDRCQUE0QixHQUFHLDJCQUEyQixDQUFDO0FBRWpFLE1BQU0sd0JBQXdCLEdBQUcsdUJBQXVCLENBQUM7QUFDekQsTUFBTSwwQkFBMEIsR0FBRywyQkFBMkIsQ0FBQztBQUUvRCxNQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQztBQUMxQyxNQUFNLG9CQUFvQixHQUFHLDJCQUEyQixDQUFDO0FBRXpELE1BQU0sdUJBQXVCLEdBQUcsVUFBVSxDQUFDO0FBRTNDLE1BQU0sNkJBQTZCLEdBQUcscUVBQXFFLENBQUM7QUFrQjVHLE1BQWEsdUJBQXdCLFNBQVEsNEJBQXFCO0lBQWxFOztRQUNFLG9GQUFvRjtRQUNwRix3RkFBd0Y7UUFDeEYsc0ZBQXNGO1FBQ3RGLGdDQUFnQztRQUNoQyxZQUFPLEdBQ0wsdUJBQXVCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFFdEYsYUFBUSxHQUFHLEVB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LENBQUM7S0FDeEI7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBUyxtQkFBbUIsQ0FBQyxJQUFxQjtJQUNoRCxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3pELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztLQUNsQjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELDBFQUEwRTtBQUMxRSxTQUFTLDRCQUE0QixDQUFDLElBQW1CO0lBQ3ZELE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBUyxzQkFBc0IsQ0FDN0IsTUFBZSxFQUNmLFNBQXVDO0lBRXZDLE1BQU0sTUFBTSxHQUFRLEVBQUUsQ0FBQztJQUN2QixNQUFNLFNBQVMsR0FBRyxDQUFDLElBQWEsRUFBRSxFQUFFO1FBQ2xDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbkI7UUFDRCxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUM7SUFDRixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuQyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7ZGlybmFtZSwgam9pbiwgUGF0aCwgcmVsYXRpdmV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7U2NoZW1hdGljQ29udGV4dCwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhLFxuICBEZXZraXRNaWdyYXRpb24sXG4gIGdldERlY29yYXRvck1ldGFkYXRhLFxuICBnZXRJbXBvcnRPZklkZW50aWZpZXIsXG4gIGdldE1ldGFkYXRhRmllbGQsXG4gIGdldFByb2plY3RJbmRleEZpbGVzLFxuICBnZXRQcm9qZWN0TWFpbkZpbGUsXG4gIEltcG9ydCxcbiAgTWlncmF0aW9uRmFpbHVyZSxcbiAgUG9zdE1pZ3JhdGlvbkFjdGlvbixcbiAgUmVzb2x2ZWRSZXNvdXJjZSxcbiAgVGFyZ2V0VmVyc2lvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtJbnNlcnRDaGFuZ2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jaGFuZ2UnO1xuaW1wb3J0IHtyZWFkRmlsZVN5bmN9IGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2ZpbmRIYW1tZXJTY3JpcHRJbXBvcnRFbGVtZW50c30gZnJvbSAnLi9maW5kLWhhbW1lci1zY3JpcHQtdGFncyc7XG5pbXBvcnQge2ZpbmRNYWluTW9kdWxlRXhwcmVzc2lvbn0gZnJvbSAnLi9maW5kLW1haW4tbW9kdWxlJztcbmltcG9ydCB7aXNIYW1tZXJKc1VzZWRJblRlbXBsYXRlfSBmcm9tICcuL2hhbW1lci10ZW1wbGF0ZS1jaGVjayc7XG5pbXBvcnQge0ltcG9ydE1hbmFnZXJ9IGZyb20gJy4vaW1wb3J0LW1hbmFnZXInO1xuaW1wb3J0IHtyZW1vdmVFbGVtZW50RnJvbUFycmF5RXhwcmVzc2lvbn0gZnJvbSAnLi9yZW1vdmUtYXJyYXktZWxlbWVudCc7XG5pbXBvcnQge3JlbW92ZUVsZW1lbnRGcm9tSHRtbH0gZnJvbSAnLi9yZW1vdmUtZWxlbWVudC1mcm9tLWh0bWwnO1xuXG5jb25zdCBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FID0gJ0dlc3R1cmVDb25maWcnO1xuY29uc3QgR0VTVFVSRV9DT05GSUdfRklMRV9OQU1FID0gJ2dlc3R1cmUtY29uZmlnJztcbmNvbnN0IEdFU1RVUkVfQ09ORklHX1RFTVBMQVRFX1BBVEggPSAnLi9nZXN0dXJlLWNvbmZpZy50ZW1wbGF0ZSc7XG5cbmNvbnN0IEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSA9ICdIQU1NRVJfR0VTVFVSRV9DT05GSUcnO1xuY29uc3QgSEFNTUVSX0NPTkZJR19UT0tFTl9NT0RVTEUgPSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmNvbnN0IEhBTU1FUl9NT0RVTEVfTkFNRSA9ICdIYW1tZXJNb2R1bGUnO1xuY29uc3QgSEFNTUVSX01PRFVMRV9JTVBPUlQgPSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmNvbnN0IEhBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSID0gJ2hhbW1lcmpzJztcblxuY29uc3QgQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1IgPSBgQ2Fubm90IHJlbW92ZSByZWZlcmVuY2UgdG8gXCJHZXN0dXJlQ29uZmlnXCIuIFBsZWFzZSByZW1vdmUgbWFudWFsbHkuYDtcblxuaW50ZXJmYWNlIElkZW50aWZpZXJSZWZlcmVuY2Uge1xuICBub2RlOiB0cy5JZGVudGlmaWVyO1xuICBpbXBvcnREYXRhOiBJbXBvcnQ7XG4gIGlzSW1wb3J0OiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgUGFja2FnZUpzb24ge1xuICBkZXBlbmRlbmNpZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG59XG5cbi8qKlxuICogVXNlZCB0byB0ZW1wb3JhcmlseSBjYXN0IHR5cGVzIHRvIGBhbnlgIHRvIHVuYmxvY2sgdGhlIHVwZ3JhZGUgdG8gVHlwZVNjcmlwdCA0LjguXG4gKiBUT0RPKGNyaXNiZXRvKTogUmVtb3ZlIHRoaXMgb25jZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLWNsaS9wdWxsLzIzNzY0IGlzIHJlbGVhc2VkLlxuICovXG50eXBlIFRzNDhNaWdyYXRpb25BbnkgPSBhbnk7XG5cbmV4cG9ydCBjbGFzcyBIYW1tZXJHZXN0dXJlc01pZ3JhdGlvbiBleHRlbmRzIERldmtpdE1pZ3JhdGlvbjxudWxsPiB7XG4gIC8vIFRoZSBtaWdyYXRpb24gaXMgZW5hYmxlZCB3aGVuIHY5IG9yIHYxMCBhcmUgdGFyZ2V0ZWQsIGJ1dCBhY3R1YWwgdGFyZ2V0cyBhcmUgb25seVxuICAvLyBtaWdyYXRlZCBpZiB0aGV5IGFyZSBub3QgdGVzdCB0YXJnZXRzLiBXZSBjYW5ub3QgbWlncmF0ZSB0ZXN0IHRhcmdldHMgc2luY2UgdGhleSBoYXZlXG4gIC8vIGEgbGltaXRlZCBzY29wZSwgaW4gcmVnYXJkcyB0byB0aGVpciBzb3VyY2UgZmlsZXMsIGFuZCB0aGVyZWZvcmUgdGhlIEhhbW1lckpTIHVzYWdlXG4gIC8vIGRldGVjdGlvbiBjb3VsZCBiZSBpbmNvcnJlY3QuXG4gIGVuYWJsZWQgPVxuICAgIEhhbW1lckdlc3R1cmVzTWlncmF0aW9uLl9pc0FsbG93ZWRWZXJzaW9uKHRoaXMudGFyZ2V0VmVyc2lvbikgJiYgIXRoaXMuY29udGV4dC5pc1Rlc3RUYXJnZXQ7XG5cbiAgcHJpdmF0ZSBfcHJpbnRlciA9IHRzLmNyZWF0ZVByaW50ZXIoKTtcbiAgcHJpdmF0ZSBfaW1wb3J0TWFuYWdlciA9IG5ldyBJbXBvcnRNYW5hZ2VyKHRoaXMuZmlsZVN5c3RlbSwgdGhpcy5fcHJpbnRlcik7XG4gIHByaXZhdGUgX25vZGVGYWlsdXJlczoge25vZGU6IHRzLk5vZGU7IG1lc3NhZ2U6IHN0cmluZ31bXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGN1c3RvbSBIYW1tZXJKUyBldmVudHMgcHJvdmlkZWQgYnkgdGhlIE1hdGVyaWFsIGdlc3R1cmVcbiAgICogY29uZmlnIGFyZSB1c2VkIGluIGEgdGVtcGxhdGUuXG4gICAqL1xuICBwcml2YXRlIF9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHN0YW5kYXJkIEhhbW1lckpTIGV2ZW50cyBhcmUgdXNlZCBpbiBhIHRlbXBsYXRlLiAqL1xuICBwcml2YXRlIF9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgSGFtbWVySlMgaXMgYWNjZXNzZWQgYXQgcnVudGltZS4gKi9cbiAgcHJpdmF0ZSBfdXNlZEluUnVudGltZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGltcG9ydHMgdGhhdCBtYWtlIFwiaGFtbWVyanNcIiBhdmFpbGFibGUgZ2xvYmFsbHkuIFdlIGtlZXAgdHJhY2sgb2YgdGhlc2VcbiAgICogc2luY2Ugd2UgbWlnaHQgbmVlZCB0byByZW1vdmUgdGhlbSBpZiBIYW1tZXIgaXMgbm90IHVzZWQuXG4gICAqL1xuICBwcml2YXRlIF9pbnN0YWxsSW1wb3J0czogdHMuSW1wb3J0RGVjbGFyYXRpb25bXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHJlc29sdmUgdG8gdGhlIGdlc3R1cmUgY29uZmlnIGZyb20gQW5ndWxhciBNYXRlcmlhbC5cbiAgICovXG4gIHByaXZhdGUgX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzOiBJZGVudGlmaWVyUmVmZXJlbmNlW10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCByZXNvbHZlIHRvIHRoZSBcIkhBTU1FUl9HRVNUVVJFX0NPTkZJR1wiIHRva2VuIGZyb21cbiAgICogXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuXG4gICAqL1xuICBwcml2YXRlIF9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXM6IElkZW50aWZpZXJSZWZlcmVuY2VbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHJlc29sdmUgdG8gdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbVxuICAgKiBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi5cbiAgICovXG4gIHByaXZhdGUgX2hhbW1lck1vZHVsZVJlZmVyZW5jZXM6IElkZW50aWZpZXJSZWZlcmVuY2VbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHRoYXQgaGF2ZSBiZWVuIGRlbGV0ZWQgZnJvbSBzb3VyY2UgZmlsZXMuIFRoaXMgY2FuIGJlXG4gICAqIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGNlcnRhaW4gaW1wb3J0cyBhcmUgc3RpbGwgdXNlZCBvciBub3QuXG4gICAqL1xuICBwcml2YXRlIF9kZWxldGVkSWRlbnRpZmllcnM6IHRzLklkZW50aWZpZXJbXSA9IFtdO1xuXG4gIG92ZXJyaWRlIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFJlc29sdmVkUmVzb3VyY2UpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2N1c3RvbUV2ZW50c1VzZWRJblRlbXBsYXRlIHx8ICF0aGlzLl9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlKSB7XG4gICAgICBjb25zdCB7c3RhbmRhcmRFdmVudHMsIGN1c3RvbUV2ZW50c30gPSBpc0hhbW1lckpzVXNlZEluVGVtcGxhdGUodGVtcGxhdGUuY29udGVudCk7XG4gICAgICB0aGlzLl9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZSA9IHRoaXMuX2N1c3RvbUV2ZW50c1VzZWRJblRlbXBsYXRlIHx8IGN1c3RvbUV2ZW50cztcbiAgICAgIHRoaXMuX3N0YW5kYXJkRXZlbnRzVXNlZEluVGVtcGxhdGUgPSB0aGlzLl9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlIHx8IHN0YW5kYXJkRXZlbnRzO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tIYW1tZXJJbXBvcnRzKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9yUnVudGltZUhhbW1lclVzYWdlKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9yTWF0ZXJpYWxHZXN0dXJlQ29uZmlnKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9ySGFtbWVyR2VzdHVyZUNvbmZpZ1Rva2VuKG5vZGUpO1xuICAgIHRoaXMuX2NoZWNrRm9ySGFtbWVyTW9kdWxlUmVmZXJlbmNlKG5vZGUpO1xuICB9XG5cbiAgb3ZlcnJpZGUgcG9zdEFuYWx5c2lzKCk6IHZvaWQge1xuICAgIC8vIFdhbGsgdGhyb3VnaCBhbGwgaGFtbWVyIGNvbmZpZyB0b2tlbiByZWZlcmVuY2VzIGFuZCBjaGVjayBpZiB0aGVyZVxuICAgIC8vIGlzIGEgcG90ZW50aWFsIGN1c3RvbSBnZXN0dXJlIGNvbmZpZyBzZXR1cC5cbiAgICBjb25zdCBoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAgPSB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+XG4gICAgICB0aGlzLl9jaGVja0ZvckN1c3RvbUdlc3R1cmVDb25maWdTZXR1cChyKSxcbiAgICApO1xuICAgIGNvbnN0IHVzZWRJblRlbXBsYXRlID0gdGhpcy5fc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSB8fCB0aGlzLl9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZTtcblxuICAgIC8qXG4gICAgICBQb3NzaWJsZSBzY2VuYXJpb3MgYW5kIGhvdyB0aGUgbWlncmF0aW9uIHNob3VsZCBjaGFuZ2UgdGhlIHByb2plY3Q6XG4gICAgICAgIDEuIFdlIGRldGVjdCB0aGF0IGEgY3VzdG9tIEhhbW1lckpTIGdlc3R1cmUgY29uZmlnIGlzIHNldCB1cDpcbiAgICAgICAgICAgIC0gUmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIGlmIG5vIEhhbW1lckpTIGV2ZW50IGlzIHVzZWQuXG4gICAgICAgICAgICAtIFByaW50IGEgd2FybmluZyBhYm91dCBhbWJpZ3VvdXMgY29uZmlndXJhdGlvbiB0aGF0IGNhbm5vdCBiZSBoYW5kbGVkIGNvbXBsZXRlbHlcbiAgICAgICAgICAgICAgaWYgdGhlcmUgYXJlIHJlZmVyZW5jZXMgdG8gdGhlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgICAgICAyLiBXZSBkZXRlY3QgdGhhdCBIYW1tZXJKUyBpcyBvbmx5IHVzZWQgcHJvZ3JhbW1hdGljYWxseTpcbiAgICAgICAgICAgIC0gUmVtb3ZlIHJlZmVyZW5jZXMgdG8gR2VzdHVyZUNvbmZpZyBvZiBNYXRlcmlhbC5cbiAgICAgICAgICAgIC0gUmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlIFwiSGFtbWVyTW9kdWxlXCIgaWYgcHJlc2VudC5cbiAgICAgICAgMy4gV2UgZGV0ZWN0IHRoYXQgc3RhbmRhcmQgSGFtbWVySlMgZXZlbnRzIGFyZSB1c2VkIGluIGEgdGVtcGxhdGU6XG4gICAgICAgICAgICAtIFNldCB1cCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBmcm9tIHBsYXRmb3JtLWJyb3dzZXIuXG4gICAgICAgICAgICAtIFJlbW92ZSBhbGwgZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlcy5cbiAgICAgICAgNC4gV2UgZGV0ZWN0IHRoYXQgY3VzdG9tIEhhbW1lckpTIGV2ZW50cyBwcm92aWRlZCBieSB0aGUgTWF0ZXJpYWwgZ2VzdHVyZVxuICAgICAgICAgICBjb25maWcgYXJlIHVzZWQuXG4gICAgICAgICAgICAtIENvcHkgdGhlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIGludG8gdGhlIGFwcC5cbiAgICAgICAgICAgIC0gUmV3cml0ZSBhbGwgZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlcyB0byB0aGUgbmV3bHkgY29waWVkIG9uZS5cbiAgICAgICAgICAgIC0gU2V0IHVwIHRoZSBuZXcgZ2VzdHVyZSBjb25maWcgaW4gdGhlIHJvb3QgYXBwIG1vZHVsZS5cbiAgICAgICAgICAgIC0gU2V0IHVwIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb20gcGxhdGZvcm0tYnJvd3Nlci5cbiAgICAgICAgNC4gV2UgZGV0ZWN0IG5vIEhhbW1lckpTIHVzYWdlIGF0IGFsbDpcbiAgICAgICAgICAgIC0gUmVtb3ZlIEhhbW1lciBpbXBvcnRzXG4gICAgICAgICAgICAtIFJlbW92ZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2VzXG4gICAgICAgICAgICAtIFJlbW92ZSBIYW1tZXJNb2R1bGUgc2V0dXAgaWYgcHJlc2VudC5cbiAgICAgICAgICAgIC0gUmVtb3ZlIEhhbW1lciBzY3JpcHQgaW1wb3J0cyBpbiBcImluZGV4Lmh0bWxcIiBmaWxlcy5cbiAgICAqL1xuXG4gICAgaWYgKGhhc0N1c3RvbUdlc3R1cmVDb25maWdTZXR1cCkge1xuICAgICAgLy8gSWYgYSBjdXN0b20gZ2VzdHVyZSBjb25maWcgaXMgcHJvdmlkZWQsIHdlIGFsd2F5cyBhc3N1bWUgdGhhdCBIYW1tZXJKUyBpcyB1c2VkLlxuICAgICAgSGFtbWVyR2VzdHVyZXNNaWdyYXRpb24uZ2xvYmFsVXNlc0hhbW1lciA9IHRydWU7XG4gICAgICBpZiAoIXVzZWRJblRlbXBsYXRlICYmIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLmxlbmd0aCkge1xuICAgICAgICAvLyBJZiB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGV2ZW50cyBhcmUgbm90IHVzZWQgYW5kIHdlIGZvdW5kIGEgY3VzdG9tXG4gICAgICAgIC8vIGdlc3R1cmUgY29uZmlnLCB3ZSBjYW4gc2FmZWx5IHJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZ1xuICAgICAgICAvLyBzaW5jZSBldmVudHMgcHJvdmlkZWQgYnkgdGhlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIGFyZSBndWFyYW50ZWVkIHRvIGJlIHVudXNlZC5cbiAgICAgICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgICAgICAgdGhpcy5wcmludEluZm8oXG4gICAgICAgICAgJ1RoZSBIYW1tZXJKUyB2OSBtaWdyYXRpb24gZm9yIEFuZ3VsYXIgQ29tcG9uZW50cyBkZXRlY3RlZCB0aGF0IEhhbW1lckpTIGlzICcgK1xuICAgICAgICAgICAgJ21hbnVhbGx5IHNldCB1cCBpbiBjb21iaW5hdGlvbiB3aXRoIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSAnICtcbiAgICAgICAgICAgICdjb25maWcuIFRoaXMgdGFyZ2V0IGNhbm5vdCBiZSBtaWdyYXRlZCBjb21wbGV0ZWx5LCBidXQgYWxsIHJlZmVyZW5jZXMgdG8gdGhlICcgK1xuICAgICAgICAgICAgJ2RlcHJlY2F0ZWQgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGhhdmUgYmVlbiByZW1vdmVkLiBSZWFkIG1vcmUgaGVyZTogJyArXG4gICAgICAgICAgICAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9ibG9iLzNhMjA0ZGEzN2ZkMTM2NmNhZTQxMWI1YzIzNDUxN2VjYWQxOTk3MzcvZ3VpZGVzL3Y5LWhhbW1lcmpzLW1pZ3JhdGlvbi5tZCN0aGUtbWlncmF0aW9uLXJlcG9ydGVkLWFtYmlndW91cy11c2FnZS13aGF0LXNob3VsZC1pLWRvJyxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAodXNlZEluVGVtcGxhdGUgJiYgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIFNpbmNlIHRoZXJlIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLCBhbmQgd2UgZGV0ZWN0ZWRcbiAgICAgICAgLy8gdXNhZ2Ugb2YgYSBnZXN0dXJlIGV2ZW50IHRoYXQgY291bGQgYmUgcHJvdmlkZWQgYnkgQW5ndWxhciBNYXRlcmlhbCwgd2UgKmNhbm5vdCpcbiAgICAgICAgLy8gYXV0b21hdGljYWxseSByZW1vdmUgcmVmZXJlbmNlcy4gVGhpcyBpcyBiZWNhdXNlIHdlIGRvICpub3QqIGtub3cgd2hldGhlciB0aGVcbiAgICAgICAgLy8gZXZlbnQgaXMgYWN0dWFsbHkgcHJvdmlkZWQgYnkgdGhlIGN1c3RvbSBjb25maWcgb3IgYnkgdGhlIE1hdGVyaWFsIGNvbmZpZy5cbiAgICAgICAgdGhpcy5wcmludEluZm8oXG4gICAgICAgICAgJ1RoZSBIYW1tZXJKUyB2OSBtaWdyYXRpb24gZm9yIEFuZ3VsYXIgQ29tcG9uZW50cyBkZXRlY3RlZCB0aGF0IEhhbW1lckpTIGlzICcgK1xuICAgICAgICAgICAgJ21hbnVhbGx5IHNldCB1cCBpbiBjb21iaW5hdGlvbiB3aXRoIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSAnICtcbiAgICAgICAgICAgICdjb25maWcuIFRoaXMgdGFyZ2V0IGNhbm5vdCBiZSBtaWdyYXRlZCBjb21wbGV0ZWx5LiBQbGVhc2UgbWFudWFsbHkgcmVtb3ZlICcgK1xuICAgICAgICAgICAgJ3JlZmVyZW5jZXMgdG8gdGhlIGRlcHJlY2F0ZWQgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy4gUmVhZCBtb3JlIGhlcmU6ICcgK1xuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvYmxvYi8zYTIwNGRhMzdmZDEzNjZjYWU0MTFiNWMyMzQ1MTdlY2FkMTk5NzM3L2d1aWRlcy92OS1oYW1tZXJqcy1taWdyYXRpb24ubWQjdGhlLW1pZ3JhdGlvbi1yZXBvcnRlZC1hbWJpZ3VvdXMtdXNhZ2Utd2hhdC1zaG91bGQtaS1kbycsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLl91c2VkSW5SdW50aW1lIHx8IHVzZWRJblRlbXBsYXRlKSB7XG4gICAgICAvLyBXZSBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgSGFtbWVyIGlzIHVzZWQgZ2xvYmFsbHkuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugd2VcbiAgICAgIC8vIHdhbnQgdG8gb25seSByZW1vdmUgSGFtbWVyIGZyb20gdGhlIFwicGFja2FnZS5qc29uXCIgaWYgaXQgaXMgbm90IHVzZWQgaW4gYW55IHByb2plY3RcbiAgICAgIC8vIHRhcmdldC4gSnVzdCBiZWNhdXNlIGl0IGlzbid0IHVzZWQgaW4gb25lIHRhcmdldCBkb2Vzbid0IG1lYW4gdGhhdCB3ZSBjYW4gc2FmZWx5XG4gICAgICAvLyByZW1vdmUgdGhlIGRlcGVuZGVuY3kuXG4gICAgICBIYW1tZXJHZXN0dXJlc01pZ3JhdGlvbi5nbG9iYWxVc2VzSGFtbWVyID0gdHJ1ZTtcblxuICAgICAgLy8gSWYgaGFtbWVyIGlzIG9ubHkgdXNlZCBhdCBydW50aW1lLCB3ZSBkb24ndCBuZWVkIHRoZSBnZXN0dXJlIGNvbmZpZyBvciBcIkhhbW1lck1vZHVsZVwiXG4gICAgICAvLyBhbmQgY2FuIHJlbW92ZSBpdCAoYWxvbmcgd2l0aCB0aGUgaGFtbWVyIGNvbmZpZyB0b2tlbiBpbXBvcnQgaWYgbm8gbG9uZ2VyIG5lZWRlZCkuXG4gICAgICBpZiAoIXVzZWRJblRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUhhbW1lck1vZHVsZVJlZmVyZW5jZXMoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSAmJiAhdGhpcy5fY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy5fc2V0dXBIYW1tZXJXaXRoU3RhbmRhcmRFdmVudHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NldHVwSGFtbWVyV2l0aEN1c3RvbUV2ZW50cygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZW1vdmVIYW1tZXJTZXR1cCgpO1xuICAgIH1cblxuICAgIC8vIFJlY29yZCB0aGUgY2hhbmdlcyBjb2xsZWN0ZWQgaW4gdGhlIGltcG9ydCBtYW5hZ2VyLiBDaGFuZ2VzIG5lZWQgdG8gYmUgYXBwbGllZFxuICAgIC8vIG9uY2UgdGhlIGltcG9ydCBtYW5hZ2VyIHJlZ2lzdGVyZWQgYWxsIGltcG9ydCBtb2RpZmljYXRpb25zLiBUaGlzIGF2b2lkcyBjb2xsaXNpb25zLlxuICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIucmVjb3JkQ2hhbmdlcygpO1xuXG4gICAgLy8gQ3JlYXRlIG1pZ3JhdGlvbiBmYWlsdXJlcyB0aGF0IHdpbGwgYmUgcHJpbnRlZCBieSB0aGUgdXBkYXRlLXRvb2wgb24gbWlncmF0aW9uXG4gICAgLy8gY29tcGxldGlvbi4gV2UgbmVlZCBzcGVjaWFsIGxvZ2ljIGZvciB1cGRhdGluZyBmYWlsdXJlIHBvc2l0aW9ucyB0byByZWZsZWN0XG4gICAgLy8gdGhlIG5ldyBzb3VyY2UgZmlsZSBhZnRlciBtb2RpZmljYXRpb25zIGZyb20gdGhlIGltcG9ydCBtYW5hZ2VyLlxuICAgIHRoaXMuZmFpbHVyZXMucHVzaCguLi50aGlzLl9jcmVhdGVNaWdyYXRpb25GYWlsdXJlcygpKTtcblxuICAgIC8vIFRoZSB0ZW1wbGF0ZSBjaGVjayBmb3IgSGFtbWVySlMgZXZlbnRzIGlzIG5vdCBjb21wbGV0ZWx5IHJlbGlhYmxlIGFzIHRoZSBldmVudFxuICAgIC8vIG91dHB1dCBjb3VsZCBhbHNvIGJlIGZyb20gYSBjb21wb25lbnQgaGF2aW5nIGFuIG91dHB1dCBuYW1lZCBzaW1pbGFybHkgdG8gYSBrbm93blxuICAgIC8vIGhhbW1lcmpzIGV2ZW50IChlLmcuIFwiQE91dHB1dCgpIHNsaWRlXCIpLiBUaGUgdXNhZ2UgaXMgdGhlcmVmb3JlIHNvbWV3aGF0IGFtYmlndW91c1xuICAgIC8vIGFuZCB3ZSB3YW50IHRvIHByaW50IGEgbWVzc2FnZSB0aGF0IGRldmVsb3BlcnMgbWlnaHQgYmUgYWJsZSB0byByZW1vdmUgSGFtbWVyIG1hbnVhbGx5LlxuICAgIGlmICghaGFzQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwICYmICF0aGlzLl91c2VkSW5SdW50aW1lICYmIHVzZWRJblRlbXBsYXRlKSB7XG4gICAgICB0aGlzLnByaW50SW5mbyhcbiAgICAgICAgJ1RoZSBIYW1tZXJKUyB2OSBtaWdyYXRpb24gZm9yIEFuZ3VsYXIgQ29tcG9uZW50cyBtaWdyYXRlZCB0aGUgJyArXG4gICAgICAgICAgJ3Byb2plY3QgdG8ga2VlcCBIYW1tZXJKUyBpbnN0YWxsZWQsIGJ1dCBkZXRlY3RlZCBhbWJpZ3VvdXMgdXNhZ2Ugb2YgSGFtbWVySlMuIFBsZWFzZSAnICtcbiAgICAgICAgICAnbWFudWFsbHkgY2hlY2sgaWYgeW91IGNhbiByZW1vdmUgSGFtbWVySlMgZnJvbSB5b3VyIGFwcGxpY2F0aW9uLiBNb3JlIGRldGFpbHM6ICcgK1xuICAgICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2Jsb2IvM2EyMDRkYTM3ZmQxMzY2Y2FlNDExYjVjMjM0NTE3ZWNhZDE5OTczNy9ndWlkZXMvdjktaGFtbWVyanMtbWlncmF0aW9uLm1kI3RoZS1taWdyYXRpb24tcmVwb3J0ZWQtYW1iaWd1b3VzLXVzYWdlLXdoYXQtc2hvdWxkLWktZG8nLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB1cCB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnIGluIHRoZSBjdXJyZW50IHByb2plY3QuIFRvIGFjaGlldmUgdGhpcywgdGhlXG4gICAqIGZvbGxvd2luZyBzdGVwcyBhcmUgcGVyZm9ybWVkOlxuICAgKiAgIDEpIENyZWF0ZSBjb3B5IG9mIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAqICAgMikgUmV3cml0ZSBhbGwgcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyB0byB0aGVcbiAgICogICAgICBuZXcgZ2VzdHVyZSBjb25maWcuXG4gICAqICAgMykgU2V0dXAgdGhlIEhBTU1FUl9HRVNUVVJFX0NPTkZJRyBpbiB0aGUgcm9vdCBhcHAgbW9kdWxlIChpZiBub3QgZG9uZSBhbHJlYWR5KS5cbiAgICogICA0KSBTZXR1cCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpbiB0aGUgcm9vdCBhcHAgbW9kdWxlIChpZiBub3QgZG9uZSBhbHJlYWR5KS5cbiAgICovXG4gIHByaXZhdGUgX3NldHVwSGFtbWVyV2l0aEN1c3RvbUV2ZW50cygpIHtcbiAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5jb250ZXh0LnByb2plY3Q7XG4gICAgY29uc3Qgc291cmNlUm9vdCA9IHRoaXMuZmlsZVN5c3RlbS5yZXNvbHZlKHByb2plY3Quc291cmNlUm9vdCB8fCBwcm9qZWN0LnJvb3QpO1xuICAgIGNvbnN0IG5ld0NvbmZpZ1BhdGggPSBqb2luKHNvdXJjZVJvb3QsIHRoaXMuX2dldEF2YWlsYWJsZUdlc3R1cmVDb25maWdGaWxlTmFtZShzb3VyY2VSb290KSk7XG5cbiAgICAvLyBDb3B5IGdlc3R1cmUgY29uZmlnIHRlbXBsYXRlIGludG8gdGhlIENMSSBwcm9qZWN0LlxuICAgIHRoaXMuZmlsZVN5c3RlbS5jcmVhdGUoXG4gICAgICBuZXdDb25maWdQYXRoLFxuICAgICAgcmVhZEZpbGVTeW5jKHJlcXVpcmUucmVzb2x2ZShHRVNUVVJFX0NPTkZJR19URU1QTEFURV9QQVRIKSwgJ3V0ZjgnKSxcbiAgICApO1xuXG4gICAgLy8gUmVwbGFjZSBhbGwgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgcmVmZXJlbmNlcyB0byByZXNvbHZlIHRvIHRoZVxuICAgIC8vIG5ld2x5IGNvcGllZCBnZXN0dXJlIGNvbmZpZy5cbiAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5mb3JFYWNoKGkgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSB0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShpLm5vZGUuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lKTtcbiAgICAgIHJldHVybiB0aGlzLl9yZXBsYWNlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZShcbiAgICAgICAgaSxcbiAgICAgICAgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSxcbiAgICAgICAgZ2V0TW9kdWxlU3BlY2lmaWVyKG5ld0NvbmZpZ1BhdGgsIGZpbGVQYXRoKSxcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICAvLyBTZXR1cCB0aGUgZ2VzdHVyZSBjb25maWcgcHJvdmlkZXIgYW5kIHRoZSBcIkhhbW1lck1vZHVsZVwiIGluIHRoZSByb290IG1vZHVsZVxuICAgIC8vIGlmIG5vdCBkb25lIGFscmVhZHkuIFRoZSBcIkhhbW1lck1vZHVsZVwiIGlzIG5lZWRlZCBpbiB2OSBzaW5jZSBpdCBlbmFibGVzIHRoZVxuICAgIC8vIEhhbW1lciBldmVudCBwbHVnaW4gdGhhdCB3YXMgcHJldmlvdXNseSBlbmFibGVkIGJ5IGRlZmF1bHQgaW4gdjguXG4gICAgdGhpcy5fc2V0dXBOZXdHZXN0dXJlQ29uZmlnSW5Sb290TW9kdWxlKG5ld0NvbmZpZ1BhdGgpO1xuICAgIHRoaXMuX3NldHVwSGFtbWVyTW9kdWxlSW5Sb290TW9kdWxlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB1cCB0aGUgc3RhbmRhcmQgaGFtbWVyIG1vZHVsZSBpbiB0aGUgcHJvamVjdCBhbmQgcmVtb3ZlcyBhbGxcbiAgICogcmVmZXJlbmNlcyB0byB0aGUgZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0dXBIYW1tZXJXaXRoU3RhbmRhcmRFdmVudHMoKSB7XG4gICAgLy8gU2V0dXAgdGhlIEhhbW1lck1vZHVsZS4gVGhlIEhhbW1lck1vZHVsZSBlbmFibGVzIHN1cHBvcnQgZm9yXG4gICAgLy8gdGhlIHN0YW5kYXJkIEhhbW1lckpTIGV2ZW50cy5cbiAgICB0aGlzLl9zZXR1cEhhbW1lck1vZHVsZUluUm9vdE1vZHVsZSgpO1xuICAgIHRoaXMuX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBIYW1tZXIgZnJvbSB0aGUgY3VycmVudCBwcm9qZWN0LiBUaGUgZm9sbG93aW5nIHN0ZXBzIGFyZSBwZXJmb3JtZWQ6XG4gICAqICAgMSkgRGVsZXRlIGFsbCBUeXBlU2NyaXB0IGltcG9ydHMgdG8gXCJoYW1tZXJqc1wiLlxuICAgKiAgIDIpIFJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgKiAgIDMpIFJlbW92ZSBcImhhbW1lcmpzXCIgZnJvbSBhbGwgaW5kZXggSFRNTCBmaWxlcyBvZiB0aGUgY3VycmVudCBwcm9qZWN0LlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyU2V0dXAoKSB7XG4gICAgdGhpcy5faW5zdGFsbEltcG9ydHMuZm9yRWFjaChpID0+IHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlSW1wb3J0QnlEZWNsYXJhdGlvbihpKSk7XG5cbiAgICB0aGlzLl9yZW1vdmVNYXRlcmlhbEdlc3R1cmVDb25maWdTZXR1cCgpO1xuICAgIHRoaXMuX3JlbW92ZUhhbW1lck1vZHVsZVJlZmVyZW5jZXMoKTtcbiAgICB0aGlzLl9yZW1vdmVIYW1tZXJGcm9tSW5kZXhGaWxlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgZ2VzdHVyZSBjb25maWcgc2V0dXAgYnkgZGVsZXRpbmcgYWxsIGZvdW5kIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXJcbiAgICogTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuIEFkZGl0aW9uYWxseSwgdW51c2VkIGltcG9ydHMgdG8gdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZ1xuICAgKiB0b2tlbiBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiIHdpbGwgYmUgcmVtb3ZlZCBhcyB3ZWxsLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKSB7XG4gICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuZm9yRWFjaChyID0+IHRoaXMuX3JlbW92ZUdlc3R1cmVDb25maWdSZWZlcmVuY2UocikpO1xuXG4gICAgdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLmZvckVhY2gociA9PiB7XG4gICAgICBpZiAoci5pc0ltcG9ydCkge1xuICAgICAgICB0aGlzLl9yZW1vdmVIYW1tZXJDb25maWdUb2tlbkltcG9ydElmVW51c2VkKHIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyTW9kdWxlUmVmZXJlbmNlcygpIHtcbiAgICB0aGlzLl9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzLmZvckVhY2goKHtub2RlLCBpc0ltcG9ydCwgaW1wb3J0RGF0YX0pID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5maWxlU3lzdGVtLmVkaXQodGhpcy5maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSkpO1xuXG4gICAgICAvLyBPbmx5IHJlbW92ZSB0aGUgaW1wb3J0IGZvciB0aGUgSGFtbWVyTW9kdWxlIGlmIHRoZSBtb2R1bGUgaGFzIGJlZW4gYWNjZXNzZWRcbiAgICAgIC8vIHRocm91Z2ggYSBub24tbmFtZXNwYWNlZCBpZGVudGlmaWVyIGFjY2Vzcy5cbiAgICAgIGlmICghaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2Vzcyhub2RlKSkge1xuICAgICAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChcbiAgICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAgIEhBTU1FUl9NT0RVTEVfTkFNRSxcbiAgICAgICAgICBpbXBvcnREYXRhLm1vZHVsZU5hbWUsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZvciByZWZlcmVuY2VzIGZyb20gd2l0aGluIGFuIGltcG9ydCwgd2UgZG8gbm90IG5lZWQgdG8gZG8gYW55dGhpbmcgb3RoZXIgdGhhblxuICAgICAgLy8gcmVtb3ZpbmcgdGhlIGltcG9ydC4gRm9yIG90aGVyIHJlZmVyZW5jZXMsIHdlIHJlbW92ZSB0aGUgaW1wb3J0IGFuZCB0aGUgYWN0dWFsXG4gICAgICAvLyBpZGVudGlmaWVyIGluIHRoZSBtb2R1bGUgaW1wb3J0cy5cbiAgICAgIGlmIChpc0ltcG9ydCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZSBcIkhhbW1lck1vZHVsZVwiIGlzIHJlZmVyZW5jZWQgd2l0aGluIGFuIGFycmF5IGxpdGVyYWwsIHdlIGNhblxuICAgICAgLy8gcmVtb3ZlIHRoZSBlbGVtZW50IGVhc2lseS4gT3RoZXJ3aXNlIGlmIGl0J3Mgb3V0c2lkZSBvZiBhbiBhcnJheSBsaXRlcmFsLFxuICAgICAgLy8gd2UgbmVlZCB0byByZXBsYWNlIHRoZSByZWZlcmVuY2Ugd2l0aCBhbiBlbXB0eSBvYmplY3QgbGl0ZXJhbCB3LyB0b2RvIHRvXG4gICAgICAvLyBub3QgYnJlYWsgdGhlIGFwcGxpY2F0aW9uLlxuICAgICAgaWYgKHRzLmlzQXJyYXlMaXRlcmFsRXhwcmVzc2lvbihub2RlLnBhcmVudCkpIHtcbiAgICAgICAgLy8gUmVtb3ZlcyB0aGUgXCJIYW1tZXJNb2R1bGVcIiBmcm9tIHRoZSBwYXJlbnQgYXJyYXkgZXhwcmVzc2lvbi4gUmVtb3Zlc1xuICAgICAgICAvLyB0aGUgdHJhaWxpbmcgY29tbWEgdG9rZW4gaWYgcHJlc2VudC5cbiAgICAgICAgcmVtb3ZlRWxlbWVudEZyb21BcnJheUV4cHJlc3Npb24obm9kZSwgcmVjb3JkZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVjb3JkZXIucmVtb3ZlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpKTtcbiAgICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQobm9kZS5nZXRTdGFydCgpLCBgLyogVE9ETzogcmVtb3ZlICovIHt9YCk7XG4gICAgICAgIHRoaXMuX25vZGVGYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gZGVsZXRlIHJlZmVyZW5jZSB0byBcIkhhbW1lck1vZHVsZVwiLicsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBpcyBhIHJlZmVyZW5jZSB0byB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnXG4gICAqIHRva2VuIGZyb20gcGxhdGZvcm0tYnJvd3Nlci4gSWYgc28sIGtlZXBzIHRyYWNrIG9mIHRoZSByZWZlcmVuY2UuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0ZvckhhbW1lckdlc3R1cmVDb25maWdUb2tlbihub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgICAgY29uc3QgaW1wb3J0RGF0YSA9IGdldEltcG9ydE9mSWRlbnRpZmllcihub2RlLCB0aGlzLnR5cGVDaGVja2VyKTtcbiAgICAgIGlmIChcbiAgICAgICAgaW1wb3J0RGF0YSAmJlxuICAgICAgICBpbXBvcnREYXRhLnN5bWJvbE5hbWUgPT09IEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSAmJlxuICAgICAgICBpbXBvcnREYXRhLm1vZHVsZU5hbWUgPT09IEhBTU1FUl9DT05GSUdfVE9LRU5fTU9EVUxFXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgaW1wb3J0RGF0YSxcbiAgICAgICAgICBpc0ltcG9ydDogdHMuaXNJbXBvcnRTcGVjaWZpZXIobm9kZS5wYXJlbnQpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBIYW1tZXJNb2R1bGUgZnJvbVxuICAgKiBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi4gSWYgc28sIGtlZXBzIHRyYWNrIG9mIHRoZSByZWZlcmVuY2UuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0ZvckhhbW1lck1vZHVsZVJlZmVyZW5jZShub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgICAgY29uc3QgaW1wb3J0RGF0YSA9IGdldEltcG9ydE9mSWRlbnRpZmllcihub2RlLCB0aGlzLnR5cGVDaGVja2VyKTtcbiAgICAgIGlmIChcbiAgICAgICAgaW1wb3J0RGF0YSAmJlxuICAgICAgICBpbXBvcnREYXRhLnN5bWJvbE5hbWUgPT09IEhBTU1FUl9NT0RVTEVfTkFNRSAmJlxuICAgICAgICBpbXBvcnREYXRhLm1vZHVsZU5hbWUgPT09IEhBTU1FUl9NT0RVTEVfSU1QT1JUXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5faGFtbWVyTW9kdWxlUmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGltcG9ydERhdGEsXG4gICAgICAgICAgaXNJbXBvcnQ6IHRzLmlzSW1wb3J0U3BlY2lmaWVyKG5vZGUucGFyZW50KSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gbm9kZSBpcyBhbiBpbXBvcnQgdG8gdGhlIEhhbW1lckpTIHBhY2thZ2UuIEltcG9ydHMgdG9cbiAgICogSGFtbWVySlMgd2hpY2ggbG9hZCBzcGVjaWZpYyBzeW1ib2xzIGZyb20gdGhlIHBhY2thZ2UgYXJlIGNvbnNpZGVyZWQgYXNcbiAgICogcnVudGltZSB1c2FnZSBvZiBIYW1tZXIuIGUuZy4gYGltcG9ydCB7U3ltYm9sfSBmcm9tIFwiaGFtbWVyanNcIjtgLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tIYW1tZXJJbXBvcnRzKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAoXG4gICAgICB0cy5pc0ltcG9ydERlY2xhcmF0aW9uKG5vZGUpICYmXG4gICAgICB0cy5pc1N0cmluZ0xpdGVyYWwobm9kZS5tb2R1bGVTcGVjaWZpZXIpICYmXG4gICAgICBub2RlLm1vZHVsZVNwZWNpZmllci50ZXh0ID09PSBIQU1NRVJfTU9EVUxFX1NQRUNJRklFUlxuICAgICkge1xuICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gaW1wb3J0IHRvIEhhbW1lckpTIHRoYXQgaW1wb3J0cyBzeW1ib2xzLCBvciBpcyBuYW1lc3BhY2VkXG4gICAgICAvLyAoZS5nLiBcImltcG9ydCB7QSwgQn0gZnJvbSAuLi5cIiBvciBcImltcG9ydCAqIGFzIGhhbW1lciBmcm9tIC4uLlwiKSwgdGhlbiB3ZVxuICAgICAgLy8gYXNzdW1lIHRoYXQgc29tZSBleHBvcnRzIGFyZSB1c2VkIGF0IHJ1bnRpbWUuXG4gICAgICBpZiAoXG4gICAgICAgIG5vZGUuaW1wb3J0Q2xhdXNlICYmXG4gICAgICAgICEoXG4gICAgICAgICAgbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncyAmJlxuICAgICAgICAgIHRzLmlzTmFtZWRJbXBvcnRzKG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpICYmXG4gICAgICAgICAgbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cy5sZW5ndGggPT09IDBcbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5faW5zdGFsbEltcG9ydHMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGFjY2Vzc2VzIHRoZSBnbG9iYWwgXCJIYW1tZXJcIiBzeW1ib2wgYXQgcnVudGltZS4gSWYgc28sXG4gICAqIHRoZSBtaWdyYXRpb24gcnVsZSBzdGF0ZSB3aWxsIGJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGF0IEhhbW1lciBpcyB1c2VkIGF0IHJ1bnRpbWUuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0ZvclJ1bnRpbWVIYW1tZXJVc2FnZShub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRoaXMuX3VzZWRJblJ1bnRpbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZXRlY3RzIHVzYWdlcyBvZiBcIndpbmRvdy5IYW1tZXJcIi5cbiAgICBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZSkgJiYgbm9kZS5uYW1lLnRleHQgPT09ICdIYW1tZXInKSB7XG4gICAgICBjb25zdCBvcmlnaW5FeHByID0gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihvcmlnaW5FeHByKSAmJiBvcmlnaW5FeHByLnRleHQgPT09ICd3aW5kb3cnKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIERldGVjdHMgdXNhZ2VzIG9mIFwid2luZG93WydIYW1tZXInXVwiLlxuICAgIGlmIChcbiAgICAgIHRzLmlzRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24obm9kZSkgJiZcbiAgICAgIHRzLmlzU3RyaW5nTGl0ZXJhbChub2RlLmFyZ3VtZW50RXhwcmVzc2lvbikgJiZcbiAgICAgIG5vZGUuYXJndW1lbnRFeHByZXNzaW9uLnRleHQgPT09ICdIYW1tZXInXG4gICAgKSB7XG4gICAgICBjb25zdCBvcmlnaW5FeHByID0gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihvcmlnaW5FeHByKSAmJiBvcmlnaW5FeHByLnRleHQgPT09ICd3aW5kb3cnKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZXMgdXNhZ2VzIG9mIHBsYWluIGlkZW50aWZpZXIgd2l0aCB0aGUgbmFtZSBcIkhhbW1lclwiLiBUaGVzZSB1c2FnZVxuICAgIC8vIGFyZSB2YWxpZCBpZiB0aGV5IHJlc29sdmUgdG8gXCJAdHlwZXMvaGFtbWVyanNcIi4gZS5nLiBcIm5ldyBIYW1tZXIobXlFbGVtZW50KVwiLlxuICAgIGlmIChcbiAgICAgIHRzLmlzSWRlbnRpZmllcihub2RlKSAmJlxuICAgICAgbm9kZS50ZXh0ID09PSAnSGFtbWVyJyAmJlxuICAgICAgIXRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUucGFyZW50KSAmJlxuICAgICAgIXRzLmlzRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24obm9kZS5wYXJlbnQpXG4gICAgKSB7XG4gICAgICBjb25zdCBzeW1ib2wgPSB0aGlzLl9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlKTtcbiAgICAgIGlmIChcbiAgICAgICAgc3ltYm9sICYmXG4gICAgICAgIHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uICYmXG4gICAgICAgIHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZS5pbmNsdWRlcygnQHR5cGVzL2hhbW1lcmpzJylcbiAgICAgICkge1xuICAgICAgICB0aGlzLl91c2VkSW5SdW50aW1lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIHJlZmVyZW5jZXMgdGhlIGdlc3R1cmUgY29uZmlnIGZyb20gQW5ndWxhciBNYXRlcmlhbC5cbiAgICogSWYgc28sIHdlIGtlZXAgdHJhY2sgb2YgdGhlIGZvdW5kIHN5bWJvbCByZWZlcmVuY2UuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0Zvck1hdGVyaWFsR2VzdHVyZUNvbmZpZyhub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgICAgY29uc3QgaW1wb3J0RGF0YSA9IGdldEltcG9ydE9mSWRlbnRpZmllcihub2RlLCB0aGlzLnR5cGVDaGVja2VyKTtcbiAgICAgIGlmIChcbiAgICAgICAgaW1wb3J0RGF0YSAmJlxuICAgICAgICBpbXBvcnREYXRhLnN5bWJvbE5hbWUgPT09IEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUgJiZcbiAgICAgICAgaW1wb3J0RGF0YS5tb2R1bGVOYW1lLnN0YXJ0c1dpdGgoJ0Bhbmd1bGFyL21hdGVyaWFsLycpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBpbXBvcnREYXRhLFxuICAgICAgICAgIGlzSW1wb3J0OiB0cy5pc0ltcG9ydFNwZWNpZmllcihub2RlLnBhcmVudCksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIEhhbW1lciBnZXN0dXJlIGNvbmZpZyB0b2tlbiByZWZlcmVuY2UgaXMgcGFydCBvZiBhblxuICAgKiBBbmd1bGFyIHByb3ZpZGVyIGRlZmluaXRpb24gdGhhdCBzZXRzIHVwIGEgY3VzdG9tIGdlc3R1cmUgY29uZmlnLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tGb3JDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAodG9rZW5SZWY6IElkZW50aWZpZXJSZWZlcmVuY2UpOiBib29sZWFuIHtcbiAgICAvLyBXYWxrIHVwIHRoZSB0cmVlIHRvIGxvb2sgZm9yIGEgcGFyZW50IHByb3BlcnR5IGFzc2lnbm1lbnQgb2YgdGhlXG4gICAgLy8gcmVmZXJlbmNlIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWcgdG9rZW4uXG4gICAgbGV0IHByb3BlcnR5QXNzaWdubWVudDogdHMuTm9kZSA9IHRva2VuUmVmLm5vZGU7XG4gICAgd2hpbGUgKHByb3BlcnR5QXNzaWdubWVudCAmJiAhdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcGVydHlBc3NpZ25tZW50KSkge1xuICAgICAgcHJvcGVydHlBc3NpZ25tZW50ID0gcHJvcGVydHlBc3NpZ25tZW50LnBhcmVudDtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAhcHJvcGVydHlBc3NpZ25tZW50IHx8XG4gICAgICAhdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcGVydHlBc3NpZ25tZW50KSB8fFxuICAgICAgZ2V0UHJvcGVydHlOYW1lVGV4dChwcm9wZXJ0eUFzc2lnbm1lbnQubmFtZSkgIT09ICdwcm92aWRlJ1xuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG9iamVjdExpdGVyYWxFeHByID0gcHJvcGVydHlBc3NpZ25tZW50LnBhcmVudDtcbiAgICBjb25zdCBtYXRjaGluZ0lkZW50aWZpZXJzID0gZmluZE1hdGNoaW5nQ2hpbGROb2RlcyhvYmplY3RMaXRlcmFsRXhwciwgdHMuaXNJZGVudGlmaWVyKTtcblxuICAgIC8vIFdlIG5haXZlbHkgYXNzdW1lIHRoYXQgaWYgdGhlcmUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIFwiR2VzdHVyZUNvbmZpZ1wiIGV4cG9ydFxuICAgIC8vIGZyb20gQW5ndWxhciBNYXRlcmlhbCBpbiB0aGUgcHJvdmlkZXIgbGl0ZXJhbCwgdGhhdCB0aGUgcHJvdmlkZXIgc2V0cyB1cCB0aGVcbiAgICAvLyBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgIHJldHVybiAhdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuc29tZShyID0+IG1hdGNoaW5nSWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBhbiBhdmFpbGFibGUgZmlsZSBuYW1lIGZvciB0aGUgZ2VzdHVyZSBjb25maWcgd2hpY2ggc2hvdWxkXG4gICAqIGJlIHN0b3JlZCBpbiB0aGUgc3BlY2lmaWVkIGZpbGUgcGF0aC5cbiAgICovXG4gIHByaXZhdGUgX2dldEF2YWlsYWJsZUdlc3R1cmVDb25maWdGaWxlTmFtZShzb3VyY2VSb290OiBQYXRoKSB7XG4gICAgaWYgKCF0aGlzLmZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhqb2luKHNvdXJjZVJvb3QsIGAke0dFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRX0udHNgKSkpIHtcbiAgICAgIHJldHVybiBgJHtHRVNUVVJFX0NPTkZJR19GSUxFX05BTUV9LnRzYDtcbiAgICB9XG5cbiAgICBsZXQgcG9zc2libGVOYW1lID0gYCR7R0VTVFVSRV9DT05GSUdfRklMRV9OQU1FfS1gO1xuICAgIGxldCBpbmRleCA9IDE7XG4gICAgd2hpbGUgKHRoaXMuZmlsZVN5c3RlbS5maWxlRXhpc3RzKGpvaW4oc291cmNlUm9vdCwgYCR7cG9zc2libGVOYW1lfS0ke2luZGV4fS50c2ApKSkge1xuICAgICAgaW5kZXgrKztcbiAgICB9XG4gICAgcmV0dXJuIGAke3Bvc3NpYmxlTmFtZSArIGluZGV4fS50c2A7XG4gIH1cblxuICAvKiogUmVwbGFjZXMgYSBnaXZlbiBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2Ugd2l0aCBhIG5ldyBpbXBvcnQuICovXG4gIHByaXZhdGUgX3JlcGxhY2VHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKFxuICAgIHtub2RlLCBpbXBvcnREYXRhLCBpc0ltcG9ydH06IElkZW50aWZpZXJSZWZlcmVuY2UsXG4gICAgc3ltYm9sTmFtZTogc3RyaW5nLFxuICAgIG1vZHVsZVNwZWNpZmllcjogc3RyaW5nLFxuICApIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdCh0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShzb3VyY2VGaWxlLmZpbGVOYW1lKSk7XG5cbiAgICAvLyBMaXN0IG9mIGFsbCBpZGVudGlmaWVycyByZWZlcnJpbmcgdG8gdGhlIGdlc3R1cmUgY29uZmlnIGluIHRoZSBjdXJyZW50IGZpbGUuIFRoaXNcbiAgICAvLyBhbGxvd3MgdXMgdG8gYWRkIGFuIGltcG9ydCBmb3IgdGhlIGNvcGllZCBnZXN0dXJlIGNvbmZpZ3VyYXRpb24gd2l0aG91dCBnZW5lcmF0aW5nIGFcbiAgICAvLyBuZXcgaWRlbnRpZmllciBmb3IgdGhlIGltcG9ydCB0byBhdm9pZCBjb2xsaXNpb25zLiBpLmUuIFwiR2VzdHVyZUNvbmZpZ18xXCIuIFRoZSBpbXBvcnRcbiAgICAvLyBtYW5hZ2VyIGNoZWNrcyBmb3IgcG9zc2libGUgbmFtZSBjb2xsaXNpb25zLCBidXQgaXMgYWJsZSB0byBpZ25vcmUgc3BlY2lmaWMgaWRlbnRpZmllcnMuXG4gICAgLy8gV2UgdXNlIHRoaXMgdG8gaWdub3JlIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBvcmlnaW5hbCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLFxuICAgIC8vIGJlY2F1c2UgdGhlc2Ugd2lsbCBiZSByZXBsYWNlZCBhbmQgdGhlcmVmb3JlIHdpbGwgbm90IGludGVyZmVyZS5cbiAgICBjb25zdCBnZXN0dXJlSWRlbnRpZmllcnNJbkZpbGUgPSB0aGlzLl9nZXRHZXN0dXJlQ29uZmlnSWRlbnRpZmllcnNPZkZpbGUoc291cmNlRmlsZSk7XG5cbiAgICAvLyBJZiB0aGUgcGFyZW50IG9mIHRoZSBpZGVudGlmaWVyIGlzIGFjY2Vzc2VkIHRocm91Z2ggYSBuYW1lc3BhY2UsIHdlIGNhbiBqdXN0XG4gICAgLy8gaW1wb3J0IHRoZSBuZXcgZ2VzdHVyZSBjb25maWcgd2l0aG91dCByZXdyaXRpbmcgdGhlIGltcG9ydCBkZWNsYXJhdGlvbiBiZWNhdXNlXG4gICAgLy8gdGhlIGNvbmZpZyBoYXMgYmVlbiBpbXBvcnRlZCB0aHJvdWdoIGEgbmFtZXNwYWNlZCBpbXBvcnQuXG4gICAgaWYgKGlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZSkpIHtcbiAgICAgIGNvbnN0IG5ld0V4cHJlc3Npb24gPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgc3ltYm9sTmFtZSxcbiAgICAgICAgbW9kdWxlU3BlY2lmaWVyLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgZ2VzdHVyZUlkZW50aWZpZXJzSW5GaWxlLFxuICAgICAgKTtcblxuICAgICAgcmVjb3JkZXIucmVtb3ZlKG5vZGUucGFyZW50LmdldFN0YXJ0KCksIG5vZGUucGFyZW50LmdldFdpZHRoKCkpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQobm9kZS5wYXJlbnQuZ2V0U3RhcnQoKSwgdGhpcy5fcHJpbnROb2RlKG5ld0V4cHJlc3Npb24sIHNvdXJjZUZpbGUpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZWxldGUgdGhlIG9sZCBpbXBvcnQgdG8gdGhlIFwiR2VzdHVyZUNvbmZpZ1wiLlxuICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgc291cmNlRmlsZSxcbiAgICAgIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsXG4gICAgICBpbXBvcnREYXRhLm1vZHVsZU5hbWUsXG4gICAgKTtcblxuICAgIC8vIElmIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBpcyBub3QgZnJvbSBpbnNpZGUgb2YgYSBpbXBvcnQsIHdlIG5lZWQgdG8gYWRkIGEgbmV3XG4gICAgLy8gaW1wb3J0IHRvIHRoZSBjb3BpZWQgZ2VzdHVyZSBjb25maWcgYW5kIHJlcGxhY2UgdGhlIGlkZW50aWZpZXIuIEZvciByZWZlcmVuY2VzXG4gICAgLy8gd2l0aGluIGFuIGltcG9ydCwgd2UgZG8gbm90aGluZyBidXQgcmVtb3ZpbmcgdGhlIGFjdHVhbCBpbXBvcnQuIFRoaXMgYWxsb3dzIHVzXG4gICAgLy8gdG8gcmVtb3ZlIHVudXNlZCBpbXBvcnRzIHRvIHRoZSBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICBpZiAoIWlzSW1wb3J0KSB7XG4gICAgICBjb25zdCBuZXdFeHByZXNzaW9uID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgIHN5bWJvbE5hbWUsXG4gICAgICAgIG1vZHVsZVNwZWNpZmllcixcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIGdlc3R1cmVJZGVudGlmaWVyc0luRmlsZSxcbiAgICAgICk7XG5cbiAgICAgIHJlY29yZGVyLnJlbW92ZShub2RlLmdldFN0YXJ0KCksIG5vZGUuZ2V0V2lkdGgoKSk7XG4gICAgICByZWNvcmRlci5pbnNlcnRSaWdodChub2RlLmdldFN0YXJ0KCksIHRoaXMuX3ByaW50Tm9kZShuZXdFeHByZXNzaW9uLCBzb3VyY2VGaWxlKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBnaXZlbiBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2UgYW5kIGl0cyBjb3JyZXNwb25kaW5nIGltcG9ydCBmcm9tXG4gICAqIGl0cyBjb250YWluaW5nIHNvdXJjZSBmaWxlLiBJbXBvcnRzIHdpbGwgYmUgYWx3YXlzIHJlbW92ZWQsIGJ1dCBpbiBzb21lIGNhc2VzLFxuICAgKiB3aGVyZSBpdCdzIG5vdCBndWFyYW50ZWVkIHRoYXQgYSByZW1vdmFsIGNhbiBiZSBwZXJmb3JtZWQgc2FmZWx5LCB3ZSBqdXN0XG4gICAqIGNyZWF0ZSBhIG1pZ3JhdGlvbiBmYWlsdXJlIChhbmQgYWRkIGEgVE9ETyBpZiBwb3NzaWJsZSkuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKHtub2RlLCBpbXBvcnREYXRhLCBpc0ltcG9ydH06IElkZW50aWZpZXJSZWZlcmVuY2UpIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdCh0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShzb3VyY2VGaWxlLmZpbGVOYW1lKSk7XG4gICAgLy8gT25seSByZW1vdmUgdGhlIGltcG9ydCBmb3IgdGhlIGdlc3R1cmUgY29uZmlnIGlmIHRoZSBnZXN0dXJlIGNvbmZpZyBoYXNcbiAgICAvLyBiZWVuIGFjY2Vzc2VkIHRocm91Z2ggYSBub24tbmFtZXNwYWNlZCBpZGVudGlmaWVyIGFjY2Vzcy5cbiAgICBpZiAoIWlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Mobm9kZSkpIHtcbiAgICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLFxuICAgICAgICBpbXBvcnREYXRhLm1vZHVsZU5hbWUsXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIEZvciByZWZlcmVuY2VzIGZyb20gd2l0aGluIGFuIGltcG9ydCwgd2UgZG8gbm90IG5lZWQgdG8gZG8gYW55dGhpbmcgb3RoZXIgdGhhblxuICAgIC8vIHJlbW92aW5nIHRoZSBpbXBvcnQuIEZvciBvdGhlciByZWZlcmVuY2VzLCB3ZSByZW1vdmUgdGhlIGltcG9ydCBhbmQgdGhlIHJlZmVyZW5jZVxuICAgIC8vIGlkZW50aWZpZXIgaWYgdXNlZCBpbnNpZGUgb2YgYSBwcm92aWRlciBkZWZpbml0aW9uLlxuICAgIGlmIChpc0ltcG9ydCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3ZpZGVyQXNzaWdubWVudCA9IG5vZGUucGFyZW50O1xuXG4gICAgLy8gT25seSByZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgZ2VzdHVyZSBjb25maWcgd2hpY2ggYXJlIHBhcnQgb2YgYSBzdGF0aWNhbGx5XG4gICAgLy8gYW5hbHl6YWJsZSBwcm92aWRlciBkZWZpbml0aW9uLiBXZSBvbmx5IHN1cHBvcnQgdGhlIGNvbW1vbiBjYXNlIG9mIGEgZ2VzdHVyZVxuICAgIC8vIGNvbmZpZyBwcm92aWRlciBkZWZpbml0aW9uIHdoZXJlIHRoZSBjb25maWcgaXMgc2V0IHVwIHRocm91Z2ggXCJ1c2VDbGFzc1wiLlxuICAgIC8vIE90aGVyd2lzZSwgaXQncyBub3QgZ3VhcmFudGVlZCB0aGF0IHdlIGNhbiBzYWZlbHkgcmVtb3ZlIHRoZSBwcm92aWRlciBkZWZpbml0aW9uLlxuICAgIGlmIChcbiAgICAgICF0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwcm92aWRlckFzc2lnbm1lbnQpIHx8XG4gICAgICBnZXRQcm9wZXJ0eU5hbWVUZXh0KHByb3ZpZGVyQXNzaWdubWVudC5uYW1lKSAhPT0gJ3VzZUNsYXNzJ1xuICAgICkge1xuICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe25vZGUsIG1lc3NhZ2U6IENBTk5PVF9SRU1PVkVfUkVGRVJFTkNFX0VSUk9SfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb2JqZWN0TGl0ZXJhbEV4cHIgPSBwcm92aWRlckFzc2lnbm1lbnQucGFyZW50O1xuICAgIGNvbnN0IHByb3ZpZGVUb2tlbiA9IG9iamVjdExpdGVyYWxFeHByLnByb3BlcnRpZXMuZmluZChcbiAgICAgIChwKTogcCBpcyB0cy5Qcm9wZXJ0eUFzc2lnbm1lbnQgPT5cbiAgICAgICAgdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocCkgJiYgZ2V0UHJvcGVydHlOYW1lVGV4dChwLm5hbWUpID09PSAncHJvdmlkZScsXG4gICAgKTtcblxuICAgIC8vIERvIG5vdCByZW1vdmUgdGhlIHJlZmVyZW5jZSBpZiB0aGUgZ2VzdHVyZSBjb25maWcgaXMgbm90IHBhcnQgb2YgYSBwcm92aWRlciBkZWZpbml0aW9uLFxuICAgIC8vIG9yIGlmIHRoZSBwcm92aWRlZCB0b2tlIGlzIG5vdCByZWZlcnJpbmcgdG8gdGhlIGtub3duIEhBTU1FUl9HRVNUVVJFX0NPTkZJRyB0b2tlblxuICAgIC8vIGZyb20gcGxhdGZvcm0tYnJvd3Nlci5cbiAgICBpZiAoIXByb3ZpZGVUb2tlbiB8fCAhdGhpcy5faXNSZWZlcmVuY2VUb0hhbW1lckNvbmZpZ1Rva2VuKHByb3ZpZGVUb2tlbi5pbml0aWFsaXplcikpIHtcbiAgICAgIHRoaXMuX25vZGVGYWlsdXJlcy5wdXNoKHtub2RlLCBtZXNzYWdlOiBDQU5OT1RfUkVNT1ZFX1JFRkVSRU5DRV9FUlJPUn0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENvbGxlY3QgYWxsIG5lc3RlZCBpZGVudGlmaWVycyB3aGljaCB3aWxsIGJlIGRlbGV0ZWQuIFRoaXMgaGVscHMgdXNcbiAgICAvLyBkZXRlcm1pbmluZyBpZiB3ZSBjYW4gcmVtb3ZlIGltcG9ydHMgZm9yIHRoZSBcIkhBTU1FUl9HRVNUVVJFX0NPTkZJR1wiIHRva2VuLlxuICAgIHRoaXMuX2RlbGV0ZWRJZGVudGlmaWVycy5wdXNoKC4uLmZpbmRNYXRjaGluZ0NoaWxkTm9kZXMob2JqZWN0TGl0ZXJhbEV4cHIsIHRzLmlzSWRlbnRpZmllcikpO1xuXG4gICAgLy8gSW4gY2FzZSB0aGUgZm91bmQgcHJvdmlkZXIgZGVmaW5pdGlvbiBpcyBub3QgcGFydCBvZiBhbiBhcnJheSBsaXRlcmFsLFxuICAgIC8vIHdlIGNhbm5vdCBzYWZlbHkgcmVtb3ZlIHRoZSBwcm92aWRlci4gVGhpcyBpcyBiZWNhdXNlIGl0IGNvdWxkIGJlIGRlY2xhcmVkXG4gICAgLy8gYXMgYSB2YXJpYWJsZS4gZS5nLiBcImNvbnN0IGdlc3R1cmVQcm92aWRlciA9IHtwcm92aWRlOiAuLiwgdXNlQ2xhc3M6IEdlc3R1cmVDb25maWd9XCIuXG4gICAgLy8gSW4gdGhhdCBjYXNlLCB3ZSBqdXN0IGFkZCBhbiBlbXB0eSBvYmplY3QgbGl0ZXJhbCB3aXRoIFRPRE8gYW5kIHByaW50IGEgZmFpbHVyZS5cbiAgICBpZiAoIXRzLmlzQXJyYXlMaXRlcmFsRXhwcmVzc2lvbihvYmplY3RMaXRlcmFsRXhwci5wYXJlbnQpKSB7XG4gICAgICByZWNvcmRlci5yZW1vdmUob2JqZWN0TGl0ZXJhbEV4cHIuZ2V0U3RhcnQoKSwgb2JqZWN0TGl0ZXJhbEV4cHIuZ2V0V2lkdGgoKSk7XG4gICAgICByZWNvcmRlci5pbnNlcnRSaWdodChvYmplY3RMaXRlcmFsRXhwci5nZXRTdGFydCgpLCBgLyogVE9ETzogcmVtb3ZlICovIHt9YCk7XG4gICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7XG4gICAgICAgIG5vZGU6IG9iamVjdExpdGVyYWxFeHByLFxuICAgICAgICBtZXNzYWdlOlxuICAgICAgICAgIGBVbmFibGUgdG8gZGVsZXRlIHByb3ZpZGVyIGRlZmluaXRpb24gZm9yIFwiR2VzdHVyZUNvbmZpZ1wiIGNvbXBsZXRlbHkuIGAgK1xuICAgICAgICAgIGBQbGVhc2UgY2xlYW4gdXAgdGhlIHByb3ZpZGVyLmAsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmVzIHRoZSBvYmplY3QgbGl0ZXJhbCBmcm9tIHRoZSBwYXJlbnQgYXJyYXkgZXhwcmVzc2lvbi4gUmVtb3Zlc1xuICAgIC8vIHRoZSB0cmFpbGluZyBjb21tYSB0b2tlbiBpZiBwcmVzZW50LlxuICAgIHJlbW92ZUVsZW1lbnRGcm9tQXJyYXlFeHByZXNzaW9uKG9iamVjdExpdGVyYWxFeHByLCByZWNvcmRlcik7XG4gIH1cblxuICAvKiogUmVtb3ZlcyB0aGUgZ2l2ZW4gaGFtbWVyIGNvbmZpZyB0b2tlbiBpbXBvcnQgaWYgaXQgaXMgbm90IHVzZWQuICovXG4gIHByaXZhdGUgX3JlbW92ZUhhbW1lckNvbmZpZ1Rva2VuSW1wb3J0SWZVbnVzZWQoe25vZGUsIGltcG9ydERhdGF9OiBJZGVudGlmaWVyUmVmZXJlbmNlKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IGlzVG9rZW5Vc2VkID0gdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUoXG4gICAgICByID0+XG4gICAgICAgICFyLmlzSW1wb3J0ICYmXG4gICAgICAgICFpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKHIubm9kZSkgJiZcbiAgICAgICAgci5ub2RlLmdldFNvdXJjZUZpbGUoKSA9PT0gc291cmNlRmlsZSAmJlxuICAgICAgICAhdGhpcy5fZGVsZXRlZElkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSksXG4gICAgKTtcblxuICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gcmVtb3ZlIHRoZSBpbXBvcnQgZm9yIHRoZSB0b2tlbiBpZiB0aGUgdG9rZW4gaXNcbiAgICAvLyBzdGlsbCB1c2VkIHNvbWV3aGVyZS5cbiAgICBpZiAoIWlzVG9rZW5Vc2VkKSB7XG4gICAgICB0aGlzLl9pbXBvcnRNYW5hZ2VyLmRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChcbiAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgSEFNTUVSX0NPTkZJR19UT0tFTl9OQU1FLFxuICAgICAgICBpbXBvcnREYXRhLm1vZHVsZU5hbWUsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZW1vdmVzIEhhbW1lciBmcm9tIGFsbCBpbmRleCBIVE1MIGZpbGVzIG9mIHRoZSBjdXJyZW50IHByb2plY3QuICovXG4gIHByaXZhdGUgX3JlbW92ZUhhbW1lckZyb21JbmRleEZpbGUoKSB7XG4gICAgY29uc3QgaW5kZXhGaWxlUGF0aHMgPSBnZXRQcm9qZWN0SW5kZXhGaWxlcyh0aGlzLmNvbnRleHQucHJvamVjdCk7XG4gICAgaW5kZXhGaWxlUGF0aHMuZm9yRWFjaChmaWxlUGF0aCA9PiB7XG4gICAgICBpZiAoIXRoaXMuZmlsZVN5c3RlbS5maWxlRXhpc3RzKGZpbGVQYXRoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGh0bWxDb250ZW50ID0gdGhpcy5maWxlU3lzdGVtLnJlYWQoZmlsZVBhdGgpITtcbiAgICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5maWxlU3lzdGVtLmVkaXQoZmlsZVBhdGgpO1xuXG4gICAgICBmaW5kSGFtbWVyU2NyaXB0SW1wb3J0RWxlbWVudHMoaHRtbENvbnRlbnQpLmZvckVhY2goZWwgPT5cbiAgICAgICAgcmVtb3ZlRWxlbWVudEZyb21IdG1sKGVsLCByZWNvcmRlciksXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFNldHMgdXAgdGhlIEhhbW1lciBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgcm9vdCBtb2R1bGUgaWYgbmVlZGVkLiAqL1xuICBwcml2YXRlIF9zZXR1cE5ld0dlc3R1cmVDb25maWdJblJvb3RNb2R1bGUoZ2VzdHVyZUNvbmZpZ1BhdGg6IFBhdGgpIHtcbiAgICBjb25zdCB7cHJvamVjdH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgY29uc3QgbWFpbkZpbGVQYXRoID0gZ2V0UHJvamVjdE1haW5GaWxlKHByb2plY3QpO1xuICAgIGNvbnN0IHJvb3RNb2R1bGVTeW1ib2wgPSB0aGlzLl9nZXRSb290TW9kdWxlU3ltYm9sKG1haW5GaWxlUGF0aCk7XG5cbiAgICBpZiAocm9vdE1vZHVsZVN5bWJvbCA9PT0gbnVsbCB8fCByb290TW9kdWxlU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5mYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgZmlsZVBhdGg6IG1haW5GaWxlUGF0aCxcbiAgICAgICAgbWVzc2FnZTpcbiAgICAgICAgICBgQ291bGQgbm90IHNldHVwIEhhbW1lciBnZXN0dXJlcyBpbiBtb2R1bGUuIFBsZWFzZSBgICtcbiAgICAgICAgICBgbWFudWFsbHkgZW5zdXJlIHRoYXQgdGhlIEhhbW1lciBnZXN0dXJlIGNvbmZpZyBpcyBzZXQgdXAuYCxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSByb290TW9kdWxlU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IG1ldGFkYXRhID0gZ2V0RGVjb3JhdG9yTWV0YWRhdGEoXG4gICAgICBzb3VyY2VGaWxlIGFzIFRzNDhNaWdyYXRpb25BbnksXG4gICAgICAnTmdNb2R1bGUnLFxuICAgICAgJ0Bhbmd1bGFyL2NvcmUnLFxuICAgICkgYXMgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25bXTtcblxuICAgIC8vIElmIG5vIFwiTmdNb2R1bGVcIiBkZWZpbml0aW9uIGlzIGZvdW5kIGluc2lkZSB0aGUgc291cmNlIGZpbGUsIHdlIGp1c3QgZG8gbm90aGluZy5cbiAgICBpZiAoIW1ldGFkYXRhLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdChmaWxlUGF0aCk7XG4gICAgY29uc3QgcHJvdmlkZXJzRmllbGQgPSBnZXRNZXRhZGF0YUZpZWxkKG1ldGFkYXRhWzBdIGFzIFRzNDhNaWdyYXRpb25BbnksICdwcm92aWRlcnMnKVswXTtcbiAgICBjb25zdCBwcm92aWRlcklkZW50aWZpZXJzID0gcHJvdmlkZXJzRmllbGRcbiAgICAgID8gZmluZE1hdGNoaW5nQ2hpbGROb2Rlcyhwcm92aWRlcnNGaWVsZCBhcyBUczQ4TWlncmF0aW9uQW55LCB0cy5pc0lkZW50aWZpZXIpXG4gICAgICA6IG51bGw7XG4gICAgY29uc3QgZ2VzdHVyZUNvbmZpZ0V4cHIgPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgIHNvdXJjZUZpbGUsXG4gICAgICBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLFxuICAgICAgZ2V0TW9kdWxlU3BlY2lmaWVyKGdlc3R1cmVDb25maWdQYXRoLCBmaWxlUGF0aCksXG4gICAgICBmYWxzZSxcbiAgICAgIHRoaXMuX2dldEdlc3R1cmVDb25maWdJZGVudGlmaWVyc09mRmlsZShzb3VyY2VGaWxlKSxcbiAgICApO1xuICAgIGNvbnN0IGhhbW1lckNvbmZpZ1Rva2VuRXhwciA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgc291cmNlRmlsZSxcbiAgICAgIEhBTU1FUl9DT05GSUdfVE9LRU5fTkFNRSxcbiAgICAgIEhBTU1FUl9DT05GSUdfVE9LRU5fTU9EVUxFLFxuICAgICk7XG4gICAgY29uc3QgbmV3UHJvdmlkZXJOb2RlID0gdHMuZmFjdG9yeS5jcmVhdGVPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihbXG4gICAgICB0cy5mYWN0b3J5LmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgncHJvdmlkZScsIGhhbW1lckNvbmZpZ1Rva2VuRXhwciksXG4gICAgICB0cy5mYWN0b3J5LmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgndXNlQ2xhc3MnLCBnZXN0dXJlQ29uZmlnRXhwciksXG4gICAgXSk7XG5cbiAgICAvLyBJZiB0aGUgcHJvdmlkZXJzIGZpZWxkIGV4aXN0cyBhbmQgYWxyZWFkeSBjb250YWlucyByZWZlcmVuY2VzIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZVxuICAgIC8vIGNvbmZpZyB0b2tlbiBhbmQgdGhlIGdlc3R1cmUgY29uZmlnLCB3ZSBuYWl2ZWx5IGFzc3VtZSB0aGF0IHRoZSBnZXN0dXJlIGNvbmZpZyBpc1xuICAgIC8vIGFscmVhZHkgc2V0IHVwLiBXZSBvbmx5IHdhbnQgdG8gYWRkIHRoZSBnZXN0dXJlIGNvbmZpZyBwcm92aWRlciBpZiBpdCBpcyBub3Qgc2V0IHVwLlxuICAgIGlmIChcbiAgICAgICFwcm92aWRlcklkZW50aWZpZXJzIHx8XG4gICAgICAhKFxuICAgICAgICB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHByb3ZpZGVySWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSkgJiZcbiAgICAgICAgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMuc29tZShyID0+IHByb3ZpZGVySWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSlcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IHN5bWJvbE5hbWUgPSB0aGlzLl9wcmludE5vZGUobmV3UHJvdmlkZXJOb2RlLCBzb3VyY2VGaWxlKTtcbiAgICAgIGFkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YShcbiAgICAgICAgc291cmNlRmlsZSBhcyBUczQ4TWlncmF0aW9uQW55LFxuICAgICAgICBzb3VyY2VGaWxlLmZpbGVOYW1lLFxuICAgICAgICAncHJvdmlkZXJzJyxcbiAgICAgICAgc3ltYm9sTmFtZSxcbiAgICAgICAgbnVsbCxcbiAgICAgICkuZm9yRWFjaChjaGFuZ2UgPT4ge1xuICAgICAgICBpZiAoY2hhbmdlIGluc3RhbmNlb2YgSW5zZXJ0Q2hhbmdlKSB7XG4gICAgICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIFR5cGVTY3JpcHQgc3ltYm9sIG9mIHRoZSByb290IG1vZHVsZSBieSBsb29raW5nIGZvciB0aGUgbW9kdWxlXG4gICAqIGJvb3RzdHJhcCBleHByZXNzaW9uIGluIHRoZSBzcGVjaWZpZWQgc291cmNlIGZpbGUuXG4gICAqL1xuICBwcml2YXRlIF9nZXRSb290TW9kdWxlU3ltYm9sKG1haW5GaWxlUGF0aDogUGF0aCk6IHRzLlN5bWJvbCB8IG51bGwge1xuICAgIGNvbnN0IG1haW5GaWxlID0gdGhpcy5wcm9ncmFtLmdldFNvdXJjZUZpbGUobWFpbkZpbGVQYXRoKTtcbiAgICBpZiAoIW1haW5GaWxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhcHBNb2R1bGVFeHByID0gZmluZE1haW5Nb2R1bGVFeHByZXNzaW9uKG1haW5GaWxlKTtcbiAgICBpZiAoIWFwcE1vZHVsZUV4cHIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGFwcE1vZHVsZVN5bWJvbCA9IHRoaXMuX2dldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKHVud3JhcEV4cHJlc3Npb24oYXBwTW9kdWxlRXhwcikpO1xuICAgIGlmICghYXBwTW9kdWxlU3ltYm9sIHx8ICFhcHBNb2R1bGVTeW1ib2wudmFsdWVEZWNsYXJhdGlvbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBhcHBNb2R1bGVTeW1ib2w7XG4gIH1cblxuICAvKiogU2V0cyB1cCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpbiB0aGUgcm9vdCBtb2R1bGUgb2YgdGhlIGN1cnJlbnQgcHJvamVjdC4gKi9cbiAgcHJpdmF0ZSBfc2V0dXBIYW1tZXJNb2R1bGVJblJvb3RNb2R1bGUoKSB7XG4gICAgY29uc3Qge3Byb2plY3R9ID0gdGhpcy5jb250ZXh0O1xuICAgIGNvbnN0IG1haW5GaWxlUGF0aCA9IGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KTtcbiAgICBjb25zdCByb290TW9kdWxlU3ltYm9sID0gdGhpcy5fZ2V0Um9vdE1vZHVsZVN5bWJvbChtYWluRmlsZVBhdGgpO1xuXG4gICAgaWYgKHJvb3RNb2R1bGVTeW1ib2wgPT09IG51bGwgfHwgcm9vdE1vZHVsZVN5bWJvbC52YWx1ZURlY2xhcmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiBtYWluRmlsZVBhdGgsXG4gICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgYENvdWxkIG5vdCBzZXR1cCBIYW1tZXJNb2R1bGUuIFBsZWFzZSBtYW51YWxseSBzZXQgdXAgdGhlIFwiSGFtbWVyTW9kdWxlXCIgYCArXG4gICAgICAgICAgYGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIuYCxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSByb290TW9kdWxlU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IG1ldGFkYXRhID0gZ2V0RGVjb3JhdG9yTWV0YWRhdGEoXG4gICAgICBzb3VyY2VGaWxlIGFzIFRzNDhNaWdyYXRpb25BbnksXG4gICAgICAnTmdNb2R1bGUnLFxuICAgICAgJ0Bhbmd1bGFyL2NvcmUnLFxuICAgICkgYXMgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25bXTtcbiAgICBpZiAoIW1ldGFkYXRhLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGltcG9ydHNGaWVsZCA9IGdldE1ldGFkYXRhRmllbGQobWV0YWRhdGFbMF0gYXMgVHM0OE1pZ3JhdGlvbkFueSwgJ2ltcG9ydHMnKVswXTtcbiAgICBjb25zdCBpbXBvcnRJZGVudGlmaWVycyA9IGltcG9ydHNGaWVsZFxuICAgICAgPyBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzKGltcG9ydHNGaWVsZCBhcyBUczQ4TWlncmF0aW9uQW55LCB0cy5pc0lkZW50aWZpZXIpXG4gICAgICA6IG51bGw7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdCh0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShzb3VyY2VGaWxlLmZpbGVOYW1lKSk7XG4gICAgY29uc3QgaGFtbWVyTW9kdWxlRXhwciA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgc291cmNlRmlsZSxcbiAgICAgIEhBTU1FUl9NT0RVTEVfTkFNRSxcbiAgICAgIEhBTU1FUl9NT0RVTEVfSU1QT1JULFxuICAgICk7XG5cbiAgICAvLyBJZiB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpcyBub3QgYWxyZWFkeSBpbXBvcnRlZCBpbiB0aGUgYXBwIG1vZHVsZSwgd2Ugc2V0IGl0IHVwXG4gICAgLy8gYnkgYWRkaW5nIGl0IHRvIHRoZSBcImltcG9ydHNcIiBmaWVsZCBvZiB0aGUgYXBwIG1vZHVsZS5cbiAgICBpZiAoXG4gICAgICAhaW1wb3J0SWRlbnRpZmllcnMgfHxcbiAgICAgICF0aGlzLl9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzLnNvbWUociA9PiBpbXBvcnRJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKVxuICAgICkge1xuICAgICAgY29uc3Qgc3ltYm9sTmFtZSA9IHRoaXMuX3ByaW50Tm9kZShoYW1tZXJNb2R1bGVFeHByLCBzb3VyY2VGaWxlKTtcbiAgICAgIGFkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YShcbiAgICAgICAgc291cmNlRmlsZSBhcyBUczQ4TWlncmF0aW9uQW55LFxuICAgICAgICBzb3VyY2VGaWxlLmZpbGVOYW1lLFxuICAgICAgICAnaW1wb3J0cycsXG4gICAgICAgIHN5bWJvbE5hbWUsXG4gICAgICAgIG51bGwsXG4gICAgICApLmZvckVhY2goY2hhbmdlID0+IHtcbiAgICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBQcmludHMgYSBnaXZlbiBub2RlIHdpdGhpbiB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlLiAqL1xuICBwcml2YXRlIF9wcmludE5vZGUobm9kZTogdHMuTm9kZSwgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCBub2RlLCBzb3VyY2VGaWxlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFsbCByZWZlcmVuY2VkIGdlc3R1cmUgY29uZmlnIGlkZW50aWZpZXJzIG9mIGEgZ2l2ZW4gc291cmNlIGZpbGUgKi9cbiAgcHJpdmF0ZSBfZ2V0R2VzdHVyZUNvbmZpZ0lkZW50aWZpZXJzT2ZGaWxlKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiB0cy5JZGVudGlmaWVyW10ge1xuICAgIHJldHVybiB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlc1xuICAgICAgLmZpbHRlcihkID0+IGQubm9kZS5nZXRTb3VyY2VGaWxlKCkgPT09IHNvdXJjZUZpbGUpXG4gICAgICAubWFwKGQgPT4gZC5ub2RlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzeW1ib2wgdGhhdCBjb250YWlucyB0aGUgdmFsdWUgZGVjbGFyYXRpb24gb2YgdGhlIHNwZWNpZmllZCBub2RlLiAqL1xuICBwcml2YXRlIF9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlOiB0cy5Ob2RlKTogdHMuU3ltYm9sIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBzeW1ib2wgPSB0aGlzLnR5cGVDaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24obm9kZSk7XG5cbiAgICAvLyBTeW1ib2xzIGNhbiBiZSBhbGlhc2VzIG9mIHRoZSBkZWNsYXJhdGlvbiBzeW1ib2wuIGUuZy4gaW4gbmFtZWQgaW1wb3J0IHNwZWNpZmllcnMuXG4gICAgLy8gV2UgbmVlZCB0byByZXNvbHZlIHRoZSBhbGlhc2VkIHN5bWJvbCBiYWNrIHRvIHRoZSBkZWNsYXJhdGlvbiBzeW1ib2wuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWJpdHdpc2VcbiAgICBpZiAoc3ltYm9sICYmIChzeW1ib2wuZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5BbGlhcykgIT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnR5cGVDaGVja2VyLmdldEFsaWFzZWRTeW1ib2woc3ltYm9sKTtcbiAgICB9XG4gICAgcmV0dXJuIHN5bWJvbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gZXhwcmVzc2lvbiByZXNvbHZlcyB0byBhIGhhbW1lciBnZXN0dXJlIGNvbmZpZ1xuICAgKiB0b2tlbiByZWZlcmVuY2UgZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi5cbiAgICovXG4gIHByaXZhdGUgX2lzUmVmZXJlbmNlVG9IYW1tZXJDb25maWdUb2tlbihleHByOiB0cy5FeHByZXNzaW9uKSB7XG4gICAgY29uc3QgdW53cmFwcGVkID0gdW53cmFwRXhwcmVzc2lvbihleHByKTtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKHVud3JhcHBlZCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHIubm9kZSA9PT0gdW53cmFwcGVkKTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKHVud3JhcHBlZCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHIubm9kZSA9PT0gdW53cmFwcGVkLm5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBtaWdyYXRpb24gZmFpbHVyZXMgb2YgdGhlIGNvbGxlY3RlZCBub2RlIGZhaWx1cmVzLiBUaGUgcmV0dXJuZWQgbWlncmF0aW9uXG4gICAqIGZhaWx1cmVzIGFyZSB1cGRhdGVkIHRvIHJlZmxlY3QgdGhlIHBvc3QtbWlncmF0aW9uIHN0YXRlIG9mIHNvdXJjZSBmaWxlcy4gTWVhbmluZ1xuICAgKiB0aGF0IGZhaWx1cmUgcG9zaXRpb25zIGFyZSBjb3JyZWN0ZWQgaWYgc291cmNlIGZpbGUgbW9kaWZpY2F0aW9ucyBzaGlmdGVkIGxpbmVzLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlTWlncmF0aW9uRmFpbHVyZXMoKTogTWlncmF0aW9uRmFpbHVyZVtdIHtcbiAgICByZXR1cm4gdGhpcy5fbm9kZUZhaWx1cmVzLm1hcCgoe25vZGUsIG1lc3NhZ2V9KSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgICBjb25zdCBvZmZzZXQgPSBub2RlLmdldFN0YXJ0KCk7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRzLmdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKHNvdXJjZUZpbGUsIG5vZGUuZ2V0U3RhcnQoKSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGlvbjogdGhpcy5faW1wb3J0TWFuYWdlci5jb3JyZWN0Tm9kZVBvc2l0aW9uKG5vZGUsIG9mZnNldCwgcG9zaXRpb24pLFxuICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICBmaWxlUGF0aDogdGhpcy5maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSksXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEdsb2JhbCBzdGF0ZSBvZiB3aGV0aGVyIEhhbW1lciBpcyB1c2VkIGluIGFueSBhbmFseXplZCBwcm9qZWN0IHRhcmdldC4gKi9cbiAgc3RhdGljIGdsb2JhbFVzZXNIYW1tZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogU3RhdGljIG1pZ3JhdGlvbiBydWxlIG1ldGhvZCB0aGF0IHdpbGwgYmUgY2FsbGVkIG9uY2UgYWxsIHByb2plY3QgdGFyZ2V0c1xuICAgKiBoYXZlIGJlZW4gbWlncmF0ZWQgaW5kaXZpZHVhbGx5LiBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCB0byBtYWtlIGNoYW5nZXMgYmFzZWRcbiAgICogb24gdGhlIGFuYWx5c2lzIG9mIHRoZSBpbmRpdmlkdWFsIHRhcmdldHMuIEZvciBleGFtcGxlOiB3ZSBvbmx5IHJlbW92ZSBIYW1tZXJcbiAgICogZnJvbSB0aGUgXCJwYWNrYWdlLmpzb25cIiBpZiBpdCBpcyBub3QgdXNlZCBpbiAqYW55KiBwcm9qZWN0IHRhcmdldC5cbiAgICovXG4gIHN0YXRpYyBvdmVycmlkZSBnbG9iYWxQb3N0TWlncmF0aW9uKFxuICAgIHRyZWU6IFRyZWUsXG4gICAgdGFyZ2V0OiBUYXJnZXRWZXJzaW9uLFxuICAgIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQsXG4gICk6IFBvc3RNaWdyYXRpb25BY3Rpb24ge1xuICAgIC8vIFNraXAgcHJpbnRpbmcgYW55IGdsb2JhbCBtZXNzYWdlcyB3aGVuIHRoZSB0YXJnZXQgdmVyc2lvbiBpcyBub3QgYWxsb3dlZC5cbiAgICBpZiAoIXRoaXMuX2lzQWxsb3dlZFZlcnNpb24odGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEFsd2F5cyBub3RpZnkgdGhlIGRldmVsb3BlciB0aGF0IHRoZSBIYW1tZXIgdjkgbWlncmF0aW9uIGRvZXMgbm90IG1pZ3JhdGUgdGVzdHMuXG4gICAgY29udGV4dC5sb2dnZXIuaW5mbyhcbiAgICAgICdcXG7imqAgIEdlbmVyYWwgbm90aWNlOiBUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIENvbXBvbmVudHMgaXMgbm90IGFibGUgdG8gJyArXG4gICAgICAgICdtaWdyYXRlIHRlc3RzLiBQbGVhc2UgbWFudWFsbHkgY2xlYW4gdXAgdGVzdHMgaW4geW91ciBwcm9qZWN0IGlmIHRoZXkgcmVseSBvbiAnICtcbiAgICAgICAgKHRoaXMuZ2xvYmFsVXNlc0hhbW1lciA/ICd0aGUgZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLicgOiAnSGFtbWVySlMuJyksXG4gICAgKTtcbiAgICBjb250ZXh0LmxvZ2dlci5pbmZvKFxuICAgICAgJ1JlYWQgbW9yZSBhYm91dCBtaWdyYXRpbmcgdGVzdHM6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvYmxvYi8zYTIwNGRhMzdmZDEzNjZjYWU0MTFiNWMyMzQ1MTdlY2FkMTk5NzM3L2d1aWRlcy92OS1oYW1tZXJqcy1taWdyYXRpb24ubWQjaG93LXRvLW1pZ3JhdGUtbXktdGVzdHMnLFxuICAgICk7XG5cbiAgICBpZiAoIXRoaXMuZ2xvYmFsVXNlc0hhbW1lciAmJiB0aGlzLl9yZW1vdmVIYW1tZXJGcm9tUGFja2FnZUpzb24odHJlZSkpIHtcbiAgICAgIC8vIFNpbmNlIEhhbW1lciBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHdvcmtzcGFjZSBcInBhY2thZ2UuanNvblwiIGZpbGUsXG4gICAgICAvLyB3ZSBzY2hlZHVsZSBhIG5vZGUgcGFja2FnZSBpbnN0YWxsIHRhc2sgdG8gcmVmcmVzaCB0aGUgbG9jayBmaWxlLlxuICAgICAgcmV0dXJuIHtydW5QYWNrYWdlTWFuYWdlcjogdHJ1ZX07XG4gICAgfVxuXG4gICAgLy8gQ2xlYW4gZ2xvYmFsIHN0YXRlIG9uY2UgdGhlIHdvcmtzcGFjZSBoYXMgYmVlbiBtaWdyYXRlZC4gVGhpcyBpcyB0ZWNobmljYWxseVxuICAgIC8vIG5vdCBuZWNlc3NhcnkgaW4gXCJuZyB1cGRhdGVcIiwgYnV0IGluIHRlc3RzIHdlIHJlLXVzZSB0aGUgc2FtZSBydWxlIGNsYXNzLlxuICAgIHRoaXMuZ2xvYmFsVXNlc0hhbW1lciA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGhhbW1lciBwYWNrYWdlIGZyb20gdGhlIHdvcmtzcGFjZSBcInBhY2thZ2UuanNvblwiLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIEhhbW1lciB3YXMgc2V0IHVwIGFuZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIFwicGFja2FnZS5qc29uXCJcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIF9yZW1vdmVIYW1tZXJGcm9tUGFja2FnZUpzb24odHJlZTogVHJlZSk6IGJvb2xlYW4ge1xuICAgIGlmICghdHJlZS5leGlzdHMoJy9wYWNrYWdlLmpzb24nKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZSh0cmVlLnJlYWQoJy9wYWNrYWdlLmpzb24nKSEudG9TdHJpbmcoJ3V0ZjgnKSkgYXMgUGFja2FnZUpzb247XG5cbiAgICAvLyBXZSBkbyBub3QgaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHNvbWVvbmUgbWFudWFsbHkgYWRkZWQgXCJoYW1tZXJqc1wiIHRvIHRoZSBkZXYgZGVwZW5kZW5jaWVzLlxuICAgIGlmIChwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXMgJiYgcGFja2FnZUpzb24uZGVwZW5kZW5jaWVzW0hBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSXSkge1xuICAgICAgZGVsZXRlIHBhY2thZ2VKc29uLmRlcGVuZGVuY2llc1tIQU1NRVJfTU9EVUxFX1NQRUNJRklFUl07XG4gICAgICB0cmVlLm92ZXJ3cml0ZSgnL3BhY2thZ2UuanNvbicsIEpTT04uc3RyaW5naWZ5KHBhY2thZ2VKc29uLCBudWxsLCAyKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgbWlncmF0aW9uIGlzIGFsbG93ZWQgdG8gcnVuIGZvciBzcGVjaWZpZWQgdGFyZ2V0IHZlcnNpb24uICovXG4gIHByaXZhdGUgc3RhdGljIF9pc0FsbG93ZWRWZXJzaW9uKHRhcmdldDogVGFyZ2V0VmVyc2lvbikge1xuICAgIC8vIFRoaXMgbWlncmF0aW9uIGlzIG9ubHkgYWxsb3dlZCB0byBydW4gZm9yIHY5IG9yIHYxMCB0YXJnZXQgdmVyc2lvbnMuXG4gICAgcmV0dXJuIHRhcmdldCA9PT0gVGFyZ2V0VmVyc2lvbi5WOSB8fCB0YXJnZXQgPT09IFRhcmdldFZlcnNpb24uVjEwO1xuICB9XG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgdW53cmFwcyBhIGdpdmVuIGV4cHJlc3Npb24gaWYgaXQgaXMgd3JhcHBlZFxuICogYnkgcGFyZW50aGVzaXMsIHR5cGUgY2FzdHMgb3IgdHlwZSBhc3NlcnRpb25zLlxuICovXG5mdW5jdGlvbiB1bndyYXBFeHByZXNzaW9uKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlIHtcbiAgaWYgKHRzLmlzUGFyZW50aGVzaXplZEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9IGVsc2UgaWYgKHRzLmlzQXNFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgcmV0dXJuIHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgfSBlbHNlIGlmICh0cy5pc1R5cGVBc3NlcnRpb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9XG4gIHJldHVybiBub2RlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBzcGVjaWZpZWQgcGF0aCB0byBhIHZhbGlkIFR5cGVTY3JpcHQgbW9kdWxlIHNwZWNpZmllciB3aGljaCBpc1xuICogcmVsYXRpdmUgdG8gdGhlIGdpdmVuIGNvbnRhaW5pbmcgZmlsZS5cbiAqL1xuZnVuY3Rpb24gZ2V0TW9kdWxlU3BlY2lmaWVyKG5ld1BhdGg6IFBhdGgsIGNvbnRhaW5pbmdGaWxlOiBQYXRoKSB7XG4gIGxldCByZXN1bHQgPSByZWxhdGl2ZShkaXJuYW1lKGNvbnRhaW5pbmdGaWxlKSwgbmV3UGF0aCkucmVwbGFjZSgvXFxcXC9nLCAnLycpLnJlcGxhY2UoL1xcLnRzJC8sICcnKTtcbiAgaWYgKCFyZXN1bHQuc3RhcnRzV2l0aCgnLicpKSB7XG4gICAgcmVzdWx0ID0gYC4vJHtyZXN1bHR9YDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHRleHQgb2YgdGhlIGdpdmVuIHByb3BlcnR5IG5hbWUuXG4gKiBAcmV0dXJucyBUZXh0IG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSBuYW1lLiBOdWxsIGlmIG5vdCBzdGF0aWNhbGx5IGFuYWx5emFibGUuXG4gKi9cbmZ1bmN0aW9uIGdldFByb3BlcnR5TmFtZVRleHQobm9kZTogdHMuUHJvcGVydHlOYW1lKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkgfHwgdHMuaXNTdHJpbmdMaXRlcmFsTGlrZShub2RlKSkge1xuICAgIHJldHVybiBub2RlLnRleHQ7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gaWRlbnRpZmllciBpcyBwYXJ0IG9mIGEgbmFtZXNwYWNlZCBhY2Nlc3MuICovXG5mdW5jdGlvbiBpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGU6IHRzLklkZW50aWZpZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRzLmlzUXVhbGlmaWVkTmFtZShub2RlLnBhcmVudCkgfHwgdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZS5wYXJlbnQpO1xufVxuXG4vKipcbiAqIFdhbGtzIHRocm91Z2ggdGhlIHNwZWNpZmllZCBub2RlIGFuZCByZXR1cm5zIGFsbCBjaGlsZCBub2RlcyB3aGljaCBtYXRjaCB0aGVcbiAqIGdpdmVuIHByZWRpY2F0ZS5cbiAqL1xuZnVuY3Rpb24gZmluZE1hdGNoaW5nQ2hpbGROb2RlczxUIGV4dGVuZHMgdHMuTm9kZT4oXG4gIHBhcmVudDogdHMuTm9kZSxcbiAgcHJlZGljYXRlOiAobm9kZTogdHMuTm9kZSkgPT4gbm9kZSBpcyBULFxuKTogVFtdIHtcbiAgY29uc3QgcmVzdWx0OiBUW10gPSBbXTtcbiAgY29uc3QgdmlzaXROb2RlID0gKG5vZGU6IHRzLk5vZGUpID0+IHtcbiAgICBpZiAocHJlZGljYXRlKG5vZGUpKSB7XG4gICAgICByZXN1bHQucHVzaChub2RlKTtcbiAgICB9XG4gICAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIHZpc2l0Tm9kZSk7XG4gIH07XG4gIHRzLmZvckVhY2hDaGlsZChwYXJlbnQsIHZpc2l0Tm9kZSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG4iXX0=