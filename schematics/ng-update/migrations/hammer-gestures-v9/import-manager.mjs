"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportManager = void 0;
const path_1 = require("path");
const ts = require("typescript");
/** Checks whether an analyzed import has the given import flag set. */
const hasFlag = (data, flag) => (data.state & flag) !== 0;
/**
 * Import manager that can be used to add or remove TypeScript imports within source
 * files. The manager ensures that multiple transformations are applied properly
 * without shifted offsets and that existing imports are re-used.
 */
class ImportManager {
    constructor(_fileSystem, _printer) {
        this._fileSystem = _fileSystem;
        this._printer = _printer;
        /** Map of source-files and their previously used identifier names. */
        this._usedIdentifierNames = new Map();
        /** Map of source files and their analyzed imports. */
        this._importCache = new Map();
    }
    /**
     * Analyzes the import of the specified source file if needed. In order to perform
     * modifications to imports of a source file, we store all imports in memory and
     * update the source file once all changes have been made. This is essential to
     * ensure that we can re-use newly added imports and not break file offsets.
     */
    _analyzeImportsIfNeeded(sourceFile) {
        if (this._importCache.has(sourceFile)) {
            return this._importCache.get(sourceFile);
        }
        const result = [];
        for (let node of sourceFile.statements) {
            if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) {
                continue;
            }
            const moduleName = node.moduleSpecifier.text;
            // Handles side-effect imports which do neither have a name or
            // specifiers. e.g. `import "my-package";`
            if (!node.importClause) {
                result.push({ moduleName, node, state: 0 /* UNMODIFIED */ });
                continue;
            }
            // Handles imports resolving to default exports of a module.
            // e.g. `import moment from "moment";`
            if (!node.importClause.namedBindings) {
                result.push({ moduleName, node, name: node.importClause.name, state: 0 /* UNMODIFIED */ });
                continue;
            }
            // Handles imports with individual symbol specifiers.
            // e.g. `import {A, B, C} from "my-module";`
            if (ts.isNamedImports(node.importClause.namedBindings)) {
                result.push({
                    moduleName,
                    node,
                    specifiers: node.importClause.namedBindings.elements.map(el => ({ name: el.name, propertyName: el.propertyName })),
                    state: 0 /* UNMODIFIED */,
                });
            }
            else {
                // Handles namespaced imports. e.g. `import * as core from "my-pkg";`
                result.push({
                    moduleName,
                    node,
                    name: node.importClause.namedBindings.name,
                    namespace: true,
                    state: 0 /* UNMODIFIED */,
                });
            }
        }
        this._importCache.set(sourceFile, result);
        return result;
    }
    /**
     * Checks whether the given specifier, which can be relative to the base path,
     * matches the passed module name.
     */
    _isModuleSpecifierMatching(basePath, specifier, moduleName) {
        return specifier.startsWith('.') ?
            (0, path_1.resolve)(basePath, specifier) === (0, path_1.resolve)(basePath, moduleName) :
            specifier === moduleName;
    }
    /** Deletes a given named binding import from the specified source file. */
    deleteNamedBindingImport(sourceFile, symbolName, moduleName) {
        const sourceDir = (0, path_1.dirname)(sourceFile.fileName);
        const fileImports = this._analyzeImportsIfNeeded(sourceFile);
        for (let importData of fileImports) {
            if (!this._isModuleSpecifierMatching(sourceDir, importData.moduleName, moduleName) ||
                !importData.specifiers) {
                continue;
            }
            const specifierIndex = importData.specifiers.findIndex(d => (d.propertyName || d.name).text === symbolName);
            if (specifierIndex !== -1) {
                importData.specifiers.splice(specifierIndex, 1);
                // if the import does no longer contain any specifiers after the removal of the
                // given symbol, we can just mark the whole import for deletion. Otherwise, we mark
                // it as modified so that it will be re-printed.
                if (importData.specifiers.length === 0) {
                    importData.state |= 8 /* DELETED */;
                }
                else {
                    importData.state |= 2 /* MODIFIED */;
                }
            }
        }
    }
    /** Deletes the import that matches the given import declaration if found. */
    deleteImportByDeclaration(declaration) {
        const fileImports = this._analyzeImportsIfNeeded(declaration.getSourceFile());
        for (let importData of fileImports) {
            if (importData.node === declaration) {
                importData.state |= 8 /* DELETED */;
            }
        }
    }
    /**
     * Adds an import to the given source file and returns the TypeScript expression that
     * can be used to access the newly imported symbol.
     *
     * Whenever an import is added to a source file, it's recommended that the returned
     * expression is used to reference th symbol. This is necessary because the symbol
     * could be aliased if it would collide with existing imports in source file.
     *
     * @param sourceFile Source file to which the import should be added.
     * @param symbolName Name of the symbol that should be imported. Can be null if
     *    the default export is requested.
     * @param moduleName Name of the module of which the symbol should be imported.
     * @param typeImport Whether the symbol is a type.
     * @param ignoreIdentifierCollisions List of identifiers which can be ignored when
     *    the import manager checks for import collisions.
     */
    addImportToSourceFile(sourceFile, symbolName, moduleName, typeImport = false, ignoreIdentifierCollisions = []) {
        const sourceDir = (0, path_1.dirname)(sourceFile.fileName);
        const fileImports = this._analyzeImportsIfNeeded(sourceFile);
        let existingImport = null;
        for (let importData of fileImports) {
            if (!this._isModuleSpecifierMatching(sourceDir, importData.moduleName, moduleName)) {
                continue;
            }
            // If no symbol name has been specified, the default import is requested. In that
            // case we search for non-namespace and non-specifier imports.
            if (!symbolName && !importData.namespace && !importData.specifiers) {
                return ts.createIdentifier(importData.name.text);
            }
            // In case a "Type" symbol is imported, we can't use namespace imports
            // because these only export symbols available at runtime (no types)
            if (importData.namespace && !typeImport) {
                return ts.createPropertyAccess(ts.createIdentifier(importData.name.text), ts.createIdentifier(symbolName || 'default'));
            }
            else if (importData.specifiers && symbolName) {
                const existingSpecifier = importData.specifiers.find(s => s.propertyName ? s.propertyName.text === symbolName : s.name.text === symbolName);
                if (existingSpecifier) {
                    return ts.createIdentifier(existingSpecifier.name.text);
                }
                // In case the symbol could not be found in an existing import, we
                // keep track of the import declaration as it can be updated to include
                // the specified symbol name without having to create a new import.
                existingImport = importData;
            }
        }
        // If there is an existing import that matches the specified module, we
        // just update the import specifiers to also import the requested symbol.
        if (existingImport) {
            const propertyIdentifier = ts.createIdentifier(symbolName);
            const generatedUniqueIdentifier = this._getUniqueIdentifier(sourceFile, symbolName, ignoreIdentifierCollisions);
            const needsGeneratedUniqueName = generatedUniqueIdentifier.text !== symbolName;
            const importName = needsGeneratedUniqueName ? generatedUniqueIdentifier : propertyIdentifier;
            existingImport.specifiers.push({
                name: importName,
                propertyName: needsGeneratedUniqueName ? propertyIdentifier : undefined,
            });
            existingImport.state |= 2 /* MODIFIED */;
            if (hasFlag(existingImport, 8 /* DELETED */)) {
                // unset the deleted flag if the import is pending deletion, but
                // can now be used for the new imported symbol.
                existingImport.state &= ~8 /* DELETED */;
            }
            return importName;
        }
        let identifier = null;
        let newImport = null;
        if (symbolName) {
            const propertyIdentifier = ts.createIdentifier(symbolName);
            const generatedUniqueIdentifier = this._getUniqueIdentifier(sourceFile, symbolName, ignoreIdentifierCollisions);
            const needsGeneratedUniqueName = generatedUniqueIdentifier.text !== symbolName;
            identifier = needsGeneratedUniqueName ? generatedUniqueIdentifier : propertyIdentifier;
            const newImportDecl = ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, ts.createNamedImports([])), ts.createStringLiteral(moduleName));
            newImport = {
                moduleName,
                node: newImportDecl,
                specifiers: [{
                        propertyName: needsGeneratedUniqueName ? propertyIdentifier : undefined,
                        name: identifier
                    }],
                state: 4 /* ADDED */,
            };
        }
        else {
            identifier =
                this._getUniqueIdentifier(sourceFile, 'defaultExport', ignoreIdentifierCollisions);
            const newImportDecl = ts.createImportDeclaration(undefined, undefined, ts.createImportClause(identifier, undefined), ts.createStringLiteral(moduleName));
            newImport = {
                moduleName,
                node: newImportDecl,
                name: identifier,
                state: 4 /* ADDED */,
            };
        }
        fileImports.push(newImport);
        return identifier;
    }
    /**
     * Applies the recorded changes in the update recorders of the corresponding source files.
     * The changes are applied separately after all changes have been recorded because otherwise
     * file offsets will change and the source files would need to be re-parsed after each change.
     */
    recordChanges() {
        this._importCache.forEach((fileImports, sourceFile) => {
            const recorder = this._fileSystem.edit(this._fileSystem.resolve(sourceFile.fileName));
            const lastUnmodifiedImport = fileImports.reverse().find(i => i.state === 0 /* UNMODIFIED */);
            const importStartIndex = lastUnmodifiedImport ? this._getEndPositionOfNode(lastUnmodifiedImport.node) : 0;
            fileImports.forEach(importData => {
                if (importData.state === 0 /* UNMODIFIED */) {
                    return;
                }
                if (hasFlag(importData, 8 /* DELETED */)) {
                    // Imports which do not exist in source file, can be just skipped as
                    // we do not need any replacement to delete the import.
                    if (!hasFlag(importData, 4 /* ADDED */)) {
                        recorder.remove(importData.node.getFullStart(), importData.node.getFullWidth());
                    }
                    return;
                }
                if (importData.specifiers) {
                    const namedBindings = importData.node.importClause.namedBindings;
                    const importSpecifiers = importData.specifiers.map(s => ts.createImportSpecifier(s.propertyName, s.name));
                    const updatedBindings = ts.updateNamedImports(namedBindings, importSpecifiers);
                    // In case an import has been added newly, we need to print the whole import
                    // declaration and insert it at the import start index. Otherwise, we just
                    // update the named bindings to not re-print the whole import (which could
                    // cause unnecessary formatting changes)
                    if (hasFlag(importData, 4 /* ADDED */)) {
                        const updatedImport = ts.updateImportDeclaration(importData.node, undefined, undefined, ts.createImportClause(undefined, updatedBindings), ts.createStringLiteral(importData.moduleName));
                        const newImportText = this._printer.printNode(ts.EmitHint.Unspecified, updatedImport, sourceFile);
                        recorder.insertLeft(importStartIndex, importStartIndex === 0 ? `${newImportText}\n` : `\n${newImportText}`);
                        return;
                    }
                    else if (hasFlag(importData, 2 /* MODIFIED */)) {
                        const newNamedBindingsText = this._printer.printNode(ts.EmitHint.Unspecified, updatedBindings, sourceFile);
                        recorder.remove(namedBindings.getStart(), namedBindings.getWidth());
                        recorder.insertRight(namedBindings.getStart(), newNamedBindingsText);
                        return;
                    }
                }
                else if (hasFlag(importData, 4 /* ADDED */)) {
                    const newImportText = this._printer.printNode(ts.EmitHint.Unspecified, importData.node, sourceFile);
                    recorder.insertLeft(importStartIndex, importStartIndex === 0 ? `${newImportText}\n` : `\n${newImportText}`);
                    return;
                }
                // we should never hit this, but we rather want to print a custom exception
                // instead of just skipping imports silently.
                throw Error('Unexpected import modification.');
            });
        });
    }
    /**
     * Corrects the line and character position of a given node. Since nodes of
     * source files are immutable and we sometimes make changes to the containing
     * source file, the node position might shift (e.g. if we add a new import before).
     *
     * This method can be used to retrieve a corrected position of the given node. This
     * is helpful when printing out error messages which should reflect the new state of
     * source files.
     */
    correctNodePosition(node, offset, position) {
        const sourceFile = node.getSourceFile();
        if (!this._importCache.has(sourceFile)) {
            return position;
        }
        const newPosition = { ...position };
        const fileImports = this._importCache.get(sourceFile);
        for (let importData of fileImports) {
            const fullEnd = importData.node.getFullStart() + importData.node.getFullWidth();
            // Subtract or add lines based on whether an import has been deleted or removed
            // before the actual node offset.
            if (offset > fullEnd && hasFlag(importData, 8 /* DELETED */)) {
                newPosition.line--;
            }
            else if (offset > fullEnd && hasFlag(importData, 4 /* ADDED */)) {
                newPosition.line++;
            }
        }
        return newPosition;
    }
    /**
     * Returns an unique identifier name for the specified symbol name.
     * @param sourceFile Source file to check for identifier collisions.
     * @param symbolName Name of the symbol for which we want to generate an unique name.
     * @param ignoreIdentifierCollisions List of identifiers which should be ignored when
     *    checking for identifier collisions in the given source file.
     */
    _getUniqueIdentifier(sourceFile, symbolName, ignoreIdentifierCollisions) {
        if (this._isUniqueIdentifierName(sourceFile, symbolName, ignoreIdentifierCollisions)) {
            this._recordUsedIdentifier(sourceFile, symbolName);
            return ts.createIdentifier(symbolName);
        }
        let name = null;
        let counter = 1;
        do {
            name = `${symbolName}_${counter++}`;
        } while (!this._isUniqueIdentifierName(sourceFile, name, ignoreIdentifierCollisions));
        this._recordUsedIdentifier(sourceFile, name);
        return ts.createIdentifier(name);
    }
    /**
     * Checks whether the specified identifier name is used within the given source file.
     * @param sourceFile Source file to check for identifier collisions.
     * @param name Name of the identifier which is checked for its uniqueness.
     * @param ignoreIdentifierCollisions List of identifiers which should be ignored when
     *    checking for identifier collisions in the given source file.
     */
    _isUniqueIdentifierName(sourceFile, name, ignoreIdentifierCollisions) {
        if (this._usedIdentifierNames.has(sourceFile) &&
            this._usedIdentifierNames.get(sourceFile).indexOf(name) !== -1) {
            return false;
        }
        // Walk through the source file and search for an identifier matching
        // the given name. In that case, it's not guaranteed that this name
        // is unique in the given declaration scope and we just return false.
        const nodeQueue = [sourceFile];
        while (nodeQueue.length) {
            const node = nodeQueue.shift();
            if (ts.isIdentifier(node) && node.text === name &&
                !ignoreIdentifierCollisions.includes(node)) {
                return false;
            }
            nodeQueue.push(...node.getChildren());
        }
        return true;
    }
    /**
     * Records that the given identifier is used within the specified source file. This
     * is necessary since we do not apply changes to source files per change, but still
     * want to avoid conflicts with newly imported symbols.
     */
    _recordUsedIdentifier(sourceFile, identifierName) {
        this._usedIdentifierNames.set(sourceFile, (this._usedIdentifierNames.get(sourceFile) || []).concat(identifierName));
    }
    /**
     * Determines the full end of a given node. By default the end position of a node is
     * before all trailing comments. This could mean that generated imports shift comments.
     */
    _getEndPositionOfNode(node) {
        const nodeEndPos = node.getEnd();
        const commentRanges = ts.getTrailingCommentRanges(node.getSourceFile().text, nodeEndPos);
        if (!commentRanges || !commentRanges.length) {
            return nodeEndPos;
        }
        return commentRanges[commentRanges.length - 1].end;
    }
}
exports.ImportManager = ImportManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9oYW1tZXItZ2VzdHVyZXMtdjkvaW1wb3J0LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBR0gsK0JBQXNDO0FBQ3RDLGlDQUFpQztBQTRCakMsdUVBQXVFO0FBQ3ZFLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBb0IsRUFBRSxJQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXZGOzs7O0dBSUc7QUFDSCxNQUFhLGFBQWE7SUFPeEIsWUFDWSxXQUF1QixFQUN2QixRQUFvQjtRQURwQixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN2QixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBUmhDLHNFQUFzRTtRQUM5RCx5QkFBb0IsR0FBRyxJQUFJLEdBQUcsRUFBMkIsQ0FBQztRQUVsRSxzREFBc0Q7UUFDOUMsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBbUMsQ0FBQztJQUkvQixDQUFDO0lBRXBDOzs7OztPQUtHO0lBQ0ssdUJBQXVCLENBQUMsVUFBeUI7UUFDdkQsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNyQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBRSxDQUFDO1NBQzNDO1FBRUQsTUFBTSxNQUFNLEdBQXFCLEVBQUUsQ0FBQztRQUNwQyxLQUFLLElBQUksSUFBSSxJQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUU7WUFDdEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENB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QUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN6RixJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUMzQyxPQUFPLFVBQVUsQ0FBQztTQUNuQjtRQUNELE9BQU8sYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFDO0lBQ3RELENBQUM7Q0FDRjtBQWhhRCxzQ0FnYUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGaWxlU3lzdGVtfSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge2Rpcm5hbWUsIHJlc29sdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8vIHRzbGludDpkaXNhYmxlOm5vLWJpdHdpc2VcblxuLyoqIEVudW0gZGVzY3JpYmluZyB0aGUgcG9zc2libGUgc3RhdGVzIG9mIGFuIGFuYWx5emVkIGltcG9ydC4gKi9cbmNvbnN0IGVudW0gSW1wb3J0U3RhdGUge1xuICBVTk1PRElGSUVEID0gMGIwLFxuICBNT0RJRklFRCA9IDBiMTAsXG4gIEFEREVEID0gMGIxMDAsXG4gIERFTEVURUQgPSAwYjEwMDAsXG59XG5cbi8qKiBJbnRlcmZhY2UgZGVzY3JpYmluZyBhbiBpbXBvcnQgc3BlY2lmaWVyLiAqL1xuaW50ZXJmYWNlIEltcG9ydFNwZWNpZmllciB7XG4gIG5hbWU6IHRzLklkZW50aWZpZXI7XG4gIHByb3BlcnR5TmFtZT86IHRzLklkZW50aWZpZXI7XG59XG5cbi8qKiBJbnRlcmZhY2UgZGVzY3JpYmluZyBhbiBhbmFseXplZCBpbXBvcnQuICovXG5pbnRlcmZhY2UgQW5hbHl6ZWRJbXBvcnQge1xuICBub2RlOiB0cy5JbXBvcnREZWNsYXJhdGlvbjtcbiAgbW9kdWxlTmFtZTogc3RyaW5nO1xuICBuYW1lPzogdHMuSWRlbnRpZmllcjtcbiAgc3BlY2lmaWVycz86IEltcG9ydFNwZWNpZmllcltdO1xuICBuYW1lc3BhY2U/OiBib29sZWFuO1xuICBzdGF0ZTogSW1wb3J0U3RhdGU7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciBhbiBhbmFseXplZCBpbXBvcnQgaGFzIHRoZSBnaXZlbiBpbXBvcnQgZmxhZyBzZXQuICovXG5jb25zdCBoYXNGbGFnID0gKGRhdGE6IEFuYWx5emVkSW1wb3J0LCBmbGFnOiBJbXBvcnRTdGF0ZSkgPT4gKGRhdGEuc3RhdGUgJiBmbGFnKSAhPT0gMDtcblxuLyoqXG4gKiBJbXBvcnQgbWFuYWdlciB0aGF0IGNhbiBiZSB1c2VkIHRvIGFkZCBvciByZW1vdmUgVHlwZVNjcmlwdCBpbXBvcnRzIHdpdGhpbiBzb3VyY2VcbiAqIGZpbGVzLiBUaGUgbWFuYWdlciBlbnN1cmVzIHRoYXQgbXVsdGlwbGUgdHJhbnNmb3JtYXRpb25zIGFyZSBhcHBsaWVkIHByb3Blcmx5XG4gKiB3aXRob3V0IHNoaWZ0ZWQgb2Zmc2V0cyBhbmQgdGhhdCBleGlzdGluZyBpbXBvcnRzIGFyZSByZS11c2VkLlxuICovXG5leHBvcnQgY2xhc3MgSW1wb3J0TWFuYWdlciB7XG4gIC8qKiBNYXAgb2Ygc291cmNlLWZpbGVzIGFuZCB0aGVpciBwcmV2aW91c2x5IHVzZWQgaWRlbnRpZmllciBuYW1lcy4gKi9cbiAgcHJpdmF0ZSBfdXNlZElkZW50aWZpZXJOYW1lcyA9IG5ldyBNYXA8dHMuU291cmNlRmlsZSwgc3RyaW5nW10+KCk7XG5cbiAgLyoqIE1hcCBvZiBzb3VyY2UgZmlsZXMgYW5kIHRoZWlyIGFuYWx5emVkIGltcG9ydHMuICovXG4gIHByaXZhdGUgX2ltcG9ydENhY2hlID0gbmV3IE1hcDx0cy5Tb3VyY2VGaWxlLCBBbmFseXplZEltcG9ydFtdPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfZmlsZVN5c3RlbTogRmlsZVN5c3RlbSxcbiAgICAgIHByaXZhdGUgX3ByaW50ZXI6IHRzLlByaW50ZXIpIHt9XG5cbiAgLyoqXG4gICAqIEFuYWx5emVzIHRoZSBpbXBvcnQgb2YgdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZSBpZiBuZWVkZWQuIEluIG9yZGVyIHRvIHBlcmZvcm1cbiAgICogbW9kaWZpY2F0aW9ucyB0byBpbXBvcnRzIG9mIGEgc291cmNlIGZpbGUsIHdlIHN0b3JlIGFsbCBpbXBvcnRzIGluIG1lbW9yeSBhbmRcbiAgICogdXBkYXRlIHRoZSBzb3VyY2UgZmlsZSBvbmNlIGFsbCBjaGFuZ2VzIGhhdmUgYmVlbiBtYWRlLiBUaGlzIGlzIGVzc2VudGlhbCB0b1xuICAgKiBlbnN1cmUgdGhhdCB3ZSBjYW4gcmUtdXNlIG5ld2x5IGFkZGVkIGltcG9ydHMgYW5kIG5vdCBicmVhayBmaWxlIG9mZnNldHMuXG4gICAqL1xuICBwcml2YXRlIF9hbmFseXplSW1wb3J0c0lmTmVlZGVkKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBBbmFseXplZEltcG9ydFtdIHtcbiAgICBpZiAodGhpcy5faW1wb3J0Q2FjaGUuaGFzKHNvdXJjZUZpbGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5faW1wb3J0Q2FjaGUuZ2V0KHNvdXJjZUZpbGUpITtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQ6IEFuYWx5emVkSW1wb3J0W10gPSBbXTtcbiAgICBmb3IgKGxldCBub2RlIG9mIHNvdXJjZUZpbGUuc3RhdGVtZW50cykge1xuICAgICAgaWYgKCF0cy5pc0ltcG9ydERlY2xhcmF0aW9uKG5vZGUpIHx8ICF0cy5pc1N0cmluZ0xpdGVyYWwobm9kZS5tb2R1bGVTcGVjaWZpZXIpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtb2R1bGVOYW1lID0gbm9kZS5tb2R1bGVTcGVjaWZpZXIudGV4dDtcblxuICAgICAgLy8gSGFuZGxlcyBzaWRlLWVmZmVjdCBpbXBvcnRzIHdoaWNoIGRvIG5laXRoZXIgaGF2ZSBhIG5hbWUgb3JcbiAgICAgIC8vIHNwZWNpZmllcnMuIGUuZy4gYGltcG9ydCBcIm15LXBhY2thZ2VcIjtgXG4gICAgICBpZiAoIW5vZGUuaW1wb3J0Q2xhdXNlKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHttb2R1bGVOYW1lLCBub2RlLCBzdGF0ZTogSW1wb3J0U3RhdGUuVU5NT0RJRklFRH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlcyBpbXBvcnRzIHJlc29sdmluZyB0byBkZWZhdWx0IGV4cG9ydHMgb2YgYSBtb2R1bGUuXG4gICAgICAvLyBlLmcuIGBpbXBvcnQgbW9tZW50IGZyb20gXCJtb21lbnRcIjtgXG4gICAgICBpZiAoIW5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goXG4gICAgICAgICAgICB7bW9kdWxlTmFtZSwgbm9kZSwgbmFtZTogbm9kZS5pbXBvcnRDbGF1c2UubmFtZSwgc3RhdGU6IEltcG9ydFN0YXRlLlVOTU9ESUZJRUR9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZXMgaW1wb3J0cyB3aXRoIGluZGl2aWR1YWwgc3ltYm9sIHNwZWNpZmllcnMuXG4gICAgICAvLyBlLmcuIGBpbXBvcnQge0EsIEIsIEN9IGZyb20gXCJteS1tb2R1bGVcIjtgXG4gICAgICBpZiAodHMuaXNOYW1lZEltcG9ydHMobm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBzcGVjaWZpZXJzOiBub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzLmVsZW1lbnRzLm1hcChcbiAgICAgICAgICAgICAgZWwgPT4gKHtuYW1lOiBlbC5uYW1lLCBwcm9wZXJ0eU5hbWU6IGVsLnByb3BlcnR5TmFtZX0pKSxcbiAgICAgICAgICBzdGF0ZTogSW1wb3J0U3RhdGUuVU5NT0RJRklFRCxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBIYW5kbGVzIG5hbWVzcGFjZWQgaW1wb3J0cy4gZS5nLiBgaW1wb3J0ICogYXMgY29yZSBmcm9tIFwibXktcGtnXCI7YFxuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG5hbWU6IG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MubmFtZSxcbiAgICAgICAgICBuYW1lc3BhY2U6IHRydWUsXG4gICAgICAgICAgc3RhdGU6IEltcG9ydFN0YXRlLlVOTU9ESUZJRUQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9pbXBvcnRDYWNoZS5zZXQoc291cmNlRmlsZSwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBzcGVjaWZpZXIsIHdoaWNoIGNhbiBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSBwYXRoLFxuICAgKiBtYXRjaGVzIHRoZSBwYXNzZWQgbW9kdWxlIG5hbWUuXG4gICAqL1xuICBwcml2YXRlIF9pc01vZHVsZVNwZWNpZmllck1hdGNoaW5nKGJhc2VQYXRoOiBzdHJpbmcsIHNwZWNpZmllcjogc3RyaW5nLCBtb2R1bGVOYW1lOiBzdHJpbmcpOlxuICAgICAgYm9vbGVhbiB7XG4gICAgcmV0dXJuIHNwZWNpZmllci5zdGFydHNXaXRoKCcuJykgP1xuICAgICAgICByZXNvbHZlKGJhc2VQYXRoLCBzcGVjaWZpZXIpID09PSByZXNvbHZlKGJhc2VQYXRoLCBtb2R1bGVOYW1lKSA6XG4gICAgICAgIHNwZWNpZmllciA9PT0gbW9kdWxlTmFtZTtcbiAgfVxuXG4gIC8qKiBEZWxldGVzIGEgZ2l2ZW4gbmFtZWQgYmluZGluZyBpbXBvcnQgZnJvbSB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlLiAqL1xuICBkZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgc3ltYm9sTmFtZTogc3RyaW5nLCBtb2R1bGVOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBzb3VyY2VEaXIgPSBkaXJuYW1lKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IGZpbGVJbXBvcnRzID0gdGhpcy5fYW5hbHl6ZUltcG9ydHNJZk5lZWRlZChzb3VyY2VGaWxlKTtcblxuICAgIGZvciAobGV0IGltcG9ydERhdGEgb2YgZmlsZUltcG9ydHMpIHtcbiAgICAgIGlmICghdGhpcy5faXNNb2R1bGVTcGVjaWZpZXJNYXRjaGluZyhzb3VyY2VEaXIsIGltcG9ydERhdGEubW9kdWxlTmFtZSwgbW9kdWxlTmFtZSkgfHxcbiAgICAgICAgICAhaW1wb3J0RGF0YS5zcGVjaWZpZXJzKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzcGVjaWZpZXJJbmRleCA9XG4gICAgICAgICAgaW1wb3J0RGF0YS5zcGVjaWZpZXJzLmZpbmRJbmRleChkID0+IChkLnByb3BlcnR5TmFtZSB8fCBkLm5hbWUpLnRleHQgPT09IHN5bWJvbE5hbWUpO1xuICAgICAgaWYgKHNwZWNpZmllckluZGV4ICE9PSAtMSkge1xuICAgICAgICBpbXBvcnREYXRhLnNwZWNpZmllcnMuc3BsaWNlKHNwZWNpZmllckluZGV4LCAxKTtcbiAgICAgICAgLy8gaWYgdGhlIGltcG9ydCBkb2VzIG5vIGxvbmdlciBjb250YWluIGFueSBzcGVjaWZpZXJzIGFmdGVyIHRoZSByZW1vdmFsIG9mIHRoZVxuICAgICAgICAvLyBnaXZlbiBzeW1ib2wsIHdlIGNhbiBqdXN0IG1hcmsgdGhlIHdob2xlIGltcG9ydCBmb3IgZGVsZXRpb24uIE90aGVyd2lzZSwgd2UgbWFya1xuICAgICAgICAvLyBpdCBhcyBtb2RpZmllZCBzbyB0aGF0IGl0IHdpbGwgYmUgcmUtcHJpbnRlZC5cbiAgICAgICAgaWYgKGltcG9ydERhdGEuc3BlY2lmaWVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBpbXBvcnREYXRhLnN0YXRlIHw9IEltcG9ydFN0YXRlLkRFTEVURUQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW1wb3J0RGF0YS5zdGF0ZSB8PSBJbXBvcnRTdGF0ZS5NT0RJRklFRDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBEZWxldGVzIHRoZSBpbXBvcnQgdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBpbXBvcnQgZGVjbGFyYXRpb24gaWYgZm91bmQuICovXG4gIGRlbGV0ZUltcG9ydEJ5RGVjbGFyYXRpb24oZGVjbGFyYXRpb246IHRzLkltcG9ydERlY2xhcmF0aW9uKSB7XG4gICAgY29uc3QgZmlsZUltcG9ydHMgPSB0aGlzLl9hbmFseXplSW1wb3J0c0lmTmVlZGVkKGRlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKSk7XG4gICAgZm9yIChsZXQgaW1wb3J0RGF0YSBvZiBmaWxlSW1wb3J0cykge1xuICAgICAgaWYgKGltcG9ydERhdGEubm9kZSA9PT0gZGVjbGFyYXRpb24pIHtcbiAgICAgICAgaW1wb3J0RGF0YS5zdGF0ZSB8PSBJbXBvcnRTdGF0ZS5ERUxFVEVEO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGltcG9ydCB0byB0aGUgZ2l2ZW4gc291cmNlIGZpbGUgYW5kIHJldHVybnMgdGhlIFR5cGVTY3JpcHQgZXhwcmVzc2lvbiB0aGF0XG4gICAqIGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgbmV3bHkgaW1wb3J0ZWQgc3ltYm9sLlxuICAgKlxuICAgKiBXaGVuZXZlciBhbiBpbXBvcnQgaXMgYWRkZWQgdG8gYSBzb3VyY2UgZmlsZSwgaXQncyByZWNvbW1lbmRlZCB0aGF0IHRoZSByZXR1cm5lZFxuICAgKiBleHByZXNzaW9uIGlzIHVzZWQgdG8gcmVmZXJlbmNlIHRoIHN5bWJvbC4gVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSB0aGUgc3ltYm9sXG4gICAqIGNvdWxkIGJlIGFsaWFzZWQgaWYgaXQgd291bGQgY29sbGlkZSB3aXRoIGV4aXN0aW5nIGltcG9ydHMgaW4gc291cmNlIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBzb3VyY2VGaWxlIFNvdXJjZSBmaWxlIHRvIHdoaWNoIHRoZSBpbXBvcnQgc2hvdWxkIGJlIGFkZGVkLlxuICAgKiBAcGFyYW0gc3ltYm9sTmFtZSBOYW1lIG9mIHRoZSBzeW1ib2wgdGhhdCBzaG91bGQgYmUgaW1wb3J0ZWQuIENhbiBiZSBudWxsIGlmXG4gICAqICAgIHRoZSBkZWZhdWx0IGV4cG9ydCBpcyByZXF1ZXN0ZWQuXG4gICAqIEBwYXJhbSBtb2R1bGVOYW1lIE5hbWUgb2YgdGhlIG1vZHVsZSBvZiB3aGljaCB0aGUgc3ltYm9sIHNob3VsZCBiZSBpbXBvcnRlZC5cbiAgICogQHBhcmFtIHR5cGVJbXBvcnQgV2hldGhlciB0aGUgc3ltYm9sIGlzIGEgdHlwZS5cbiAgICogQHBhcmFtIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggY2FuIGJlIGlnbm9yZWQgd2hlblxuICAgKiAgICB0aGUgaW1wb3J0IG1hbmFnZXIgY2hlY2tzIGZvciBpbXBvcnQgY29sbGlzaW9ucy5cbiAgICovXG4gIGFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIHN5bWJvbE5hbWU6IHN0cmluZ3xudWxsLCBtb2R1bGVOYW1lOiBzdHJpbmcsIHR5cGVJbXBvcnQgPSBmYWxzZSxcbiAgICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zOiB0cy5JZGVudGlmaWVyW10gPSBbXSk6IHRzLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IHNvdXJjZURpciA9IGRpcm5hbWUoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgY29uc3QgZmlsZUltcG9ydHMgPSB0aGlzLl9hbmFseXplSW1wb3J0c0lmTmVlZGVkKHNvdXJjZUZpbGUpO1xuXG4gICAgbGV0IGV4aXN0aW5nSW1wb3J0OiBBbmFseXplZEltcG9ydHxudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCBpbXBvcnREYXRhIG9mIGZpbGVJbXBvcnRzKSB7XG4gICAgICBpZiAoIXRoaXMuX2lzTW9kdWxlU3BlY2lmaWVyTWF0Y2hpbmcoc291cmNlRGlyLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUsIG1vZHVsZU5hbWUpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBubyBzeW1ib2wgbmFtZSBoYXMgYmVlbiBzcGVjaWZpZWQsIHRoZSBkZWZhdWx0IGltcG9ydCBpcyByZXF1ZXN0ZWQuIEluIHRoYXRcbiAgICAgIC8vIGNhc2Ugd2Ugc2VhcmNoIGZvciBub24tbmFtZXNwYWNlIGFuZCBub24tc3BlY2lmaWVyIGltcG9ydHMuXG4gICAgICBpZiAoIXN5bWJvbE5hbWUgJiYgIWltcG9ydERhdGEubmFtZXNwYWNlICYmICFpbXBvcnREYXRhLnNwZWNpZmllcnMpIHtcbiAgICAgICAgcmV0dXJuIHRzLmNyZWF0ZUlkZW50aWZpZXIoaW1wb3J0RGF0YS5uYW1lIS50ZXh0KTtcbiAgICAgIH1cblxuICAgICAgLy8gSW4gY2FzZSBhIFwiVHlwZVwiIHN5bWJvbCBpcyBpbXBvcnRlZCwgd2UgY2FuJ3QgdXNlIG5hbWVzcGFjZSBpbXBvcnRzXG4gICAgICAvLyBiZWNhdXNlIHRoZXNlIG9ubHkgZXhwb3J0IHN5bWJvbHMgYXZhaWxhYmxlIGF0IHJ1bnRpbWUgKG5vIHR5cGVzKVxuICAgICAgaWYgKGltcG9ydERhdGEubmFtZXNwYWNlICYmICF0eXBlSW1wb3J0KSB7XG4gICAgICAgIHJldHVybiB0cy5jcmVhdGVQcm9wZXJ0eUFjY2VzcyhcbiAgICAgICAgICAgIHRzLmNyZWF0ZUlkZW50aWZpZXIoaW1wb3J0RGF0YS5uYW1lIS50ZXh0KSxcbiAgICAgICAgICAgIHRzLmNyZWF0ZUlkZW50aWZpZXIoc3ltYm9sTmFtZSB8fCAnZGVmYXVsdCcpKTtcbiAgICAgIH0gZWxzZSBpZiAoaW1wb3J0RGF0YS5zcGVjaWZpZXJzICYmIHN5bWJvbE5hbWUpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdTcGVjaWZpZXIgPSBpbXBvcnREYXRhLnNwZWNpZmllcnMuZmluZChcbiAgICAgICAgICAgIHMgPT4gcy5wcm9wZXJ0eU5hbWUgPyBzLnByb3BlcnR5TmFtZS50ZXh0ID09PSBzeW1ib2xOYW1lIDogcy5uYW1lLnRleHQgPT09IHN5bWJvbE5hbWUpO1xuXG4gICAgICAgIGlmIChleGlzdGluZ1NwZWNpZmllcikge1xuICAgICAgICAgIHJldHVybiB0cy5jcmVhdGVJZGVudGlmaWVyKGV4aXN0aW5nU3BlY2lmaWVyLm5hbWUudGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbiBjYXNlIHRoZSBzeW1ib2wgY291bGQgbm90IGJlIGZvdW5kIGluIGFuIGV4aXN0aW5nIGltcG9ydCwgd2VcbiAgICAgICAgLy8ga2VlcCB0cmFjayBvZiB0aGUgaW1wb3J0IGRlY2xhcmF0aW9uIGFzIGl0IGNhbiBiZSB1cGRhdGVkIHRvIGluY2x1ZGVcbiAgICAgICAgLy8gdGhlIHNwZWNpZmllZCBzeW1ib2wgbmFtZSB3aXRob3V0IGhhdmluZyB0byBjcmVhdGUgYSBuZXcgaW1wb3J0LlxuICAgICAgICBleGlzdGluZ0ltcG9ydCA9IGltcG9ydERhdGE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gZXhpc3RpbmcgaW1wb3J0IHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIG1vZHVsZSwgd2VcbiAgICAvLyBqdXN0IHVwZGF0ZSB0aGUgaW1wb3J0IHNwZWNpZmllcnMgdG8gYWxzbyBpbXBvcnQgdGhlIHJlcXVlc3RlZCBzeW1ib2wuXG4gICAgaWYgKGV4aXN0aW5nSW1wb3J0KSB7XG4gICAgICBjb25zdCBwcm9wZXJ0eUlkZW50aWZpZXIgPSB0cy5jcmVhdGVJZGVudGlmaWVyKHN5bWJvbE5hbWUhKTtcbiAgICAgIGNvbnN0IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIgPVxuICAgICAgICAgIHRoaXMuX2dldFVuaXF1ZUlkZW50aWZpZXIoc291cmNlRmlsZSwgc3ltYm9sTmFtZSEsIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zKTtcbiAgICAgIGNvbnN0IG5lZWRzR2VuZXJhdGVkVW5pcXVlTmFtZSA9IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIudGV4dCAhPT0gc3ltYm9sTmFtZTtcbiAgICAgIGNvbnN0IGltcG9ydE5hbWUgPSBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPyBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyIDogcHJvcGVydHlJZGVudGlmaWVyO1xuXG4gICAgICBleGlzdGluZ0ltcG9ydC5zcGVjaWZpZXJzIS5wdXNoKHtcbiAgICAgICAgbmFtZTogaW1wb3J0TmFtZSxcbiAgICAgICAgcHJvcGVydHlOYW1lOiBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPyBwcm9wZXJ0eUlkZW50aWZpZXIgOiB1bmRlZmluZWQsXG4gICAgICB9KTtcbiAgICAgIGV4aXN0aW5nSW1wb3J0LnN0YXRlIHw9IEltcG9ydFN0YXRlLk1PRElGSUVEO1xuXG4gICAgICBpZiAoaGFzRmxhZyhleGlzdGluZ0ltcG9ydCwgSW1wb3J0U3RhdGUuREVMRVRFRCkpIHtcbiAgICAgICAgLy8gdW5zZXQgdGhlIGRlbGV0ZWQgZmxhZyBpZiB0aGUgaW1wb3J0IGlzIHBlbmRpbmcgZGVsZXRpb24sIGJ1dFxuICAgICAgICAvLyBjYW4gbm93IGJlIHVzZWQgZm9yIHRoZSBuZXcgaW1wb3J0ZWQgc3ltYm9sLlxuICAgICAgICBleGlzdGluZ0ltcG9ydC5zdGF0ZSAmPSB+SW1wb3J0U3RhdGUuREVMRVRFRDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGltcG9ydE5hbWU7XG4gICAgfVxuXG4gICAgbGV0IGlkZW50aWZpZXI6IHRzLklkZW50aWZpZXJ8bnVsbCA9IG51bGw7XG4gICAgbGV0IG5ld0ltcG9ydDogQW5hbHl6ZWRJbXBvcnR8bnVsbCA9IG51bGw7XG5cbiAgICBpZiAoc3ltYm9sTmFtZSkge1xuICAgICAgY29uc3QgcHJvcGVydHlJZGVudGlmaWVyID0gdHMuY3JlYXRlSWRlbnRpZmllcihzeW1ib2xOYW1lKTtcbiAgICAgIGNvbnN0IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIgPVxuICAgICAgICAgIHRoaXMuX2dldFVuaXF1ZUlkZW50aWZpZXIoc291cmNlRmlsZSwgc3ltYm9sTmFtZSwgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMpO1xuICAgICAgY29uc3QgbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID0gZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllci50ZXh0ICE9PSBzeW1ib2xOYW1lO1xuICAgICAgaWRlbnRpZmllciA9IG5lZWRzR2VuZXJhdGVkVW5pcXVlTmFtZSA/IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIgOiBwcm9wZXJ0eUlkZW50aWZpZXI7XG5cbiAgICAgIGNvbnN0IG5ld0ltcG9ydERlY2wgPSB0cy5jcmVhdGVJbXBvcnREZWNsYXJhdGlvbihcbiAgICAgICAgICB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdHMuY3JlYXRlSW1wb3J0Q2xhdXNlKHVuZGVmaW5lZCwgdHMuY3JlYXRlTmFtZWRJbXBvcnRzKFtdKSksXG4gICAgICAgICAgdHMuY3JlYXRlU3RyaW5nTGl0ZXJhbChtb2R1bGVOYW1lKSk7XG5cbiAgICAgIG5ld0ltcG9ydCA9IHtcbiAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgbm9kZTogbmV3SW1wb3J0RGVjbCxcbiAgICAgICAgc3BlY2lmaWVyczogW3tcbiAgICAgICAgICBwcm9wZXJ0eU5hbWU6IG5lZWRzR2VuZXJhdGVkVW5pcXVlTmFtZSA/IHByb3BlcnR5SWRlbnRpZmllciA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBuYW1lOiBpZGVudGlmaWVyXG4gICAgICAgIH1dLFxuICAgICAgICBzdGF0ZTogSW1wb3J0U3RhdGUuQURERUQsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZGVudGlmaWVyID1cbiAgICAgICAgICB0aGlzLl9nZXRVbmlxdWVJZGVudGlmaWVyKHNvdXJjZUZpbGUsICdkZWZhdWx0RXhwb3J0JywgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMpO1xuICAgICAgY29uc3QgbmV3SW1wb3J0RGVjbCA9IHRzLmNyZWF0ZUltcG9ydERlY2xhcmF0aW9uKFxuICAgICAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0cy5jcmVhdGVJbXBvcnRDbGF1c2UoaWRlbnRpZmllciwgdW5kZWZpbmVkKSxcbiAgICAgICAgICB0cy5jcmVhdGVTdHJpbmdMaXRlcmFsKG1vZHVsZU5hbWUpKTtcbiAgICAgIG5ld0ltcG9ydCA9IHtcbiAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgbm9kZTogbmV3SW1wb3J0RGVjbCxcbiAgICAgICAgbmFtZTogaWRlbnRpZmllcixcbiAgICAgICAgc3RhdGU6IEltcG9ydFN0YXRlLkFEREVELFxuICAgICAgfTtcbiAgICB9XG4gICAgZmlsZUltcG9ydHMucHVzaChuZXdJbXBvcnQpO1xuICAgIHJldHVybiBpZGVudGlmaWVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgdGhlIHJlY29yZGVkIGNoYW5nZXMgaW4gdGhlIHVwZGF0ZSByZWNvcmRlcnMgb2YgdGhlIGNvcnJlc3BvbmRpbmcgc291cmNlIGZpbGVzLlxuICAgKiBUaGUgY2hhbmdlcyBhcmUgYXBwbGllZCBzZXBhcmF0ZWx5IGFmdGVyIGFsbCBjaGFuZ2VzIGhhdmUgYmVlbiByZWNvcmRlZCBiZWNhdXNlIG90aGVyd2lzZVxuICAgKiBmaWxlIG9mZnNldHMgd2lsbCBjaGFuZ2UgYW5kIHRoZSBzb3VyY2UgZmlsZXMgd291bGQgbmVlZCB0byBiZSByZS1wYXJzZWQgYWZ0ZXIgZWFjaCBjaGFuZ2UuXG4gICAqL1xuICByZWNvcmRDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2ltcG9ydENhY2hlLmZvckVhY2goKGZpbGVJbXBvcnRzLCBzb3VyY2VGaWxlKSA9PiB7XG4gICAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0uZWRpdCh0aGlzLl9maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSkpO1xuICAgICAgY29uc3QgbGFzdFVubW9kaWZpZWRJbXBvcnQgPVxuICAgICAgICAgIGZpbGVJbXBvcnRzLnJldmVyc2UoKS5maW5kKGkgPT4gaS5zdGF0ZSA9PT0gSW1wb3J0U3RhdGUuVU5NT0RJRklFRCk7XG4gICAgICBjb25zdCBpbXBvcnRTdGFydEluZGV4ID1cbiAgICAgICAgICBsYXN0VW5tb2RpZmllZEltcG9ydCA/IHRoaXMuX2dldEVuZFBvc2l0aW9uT2ZOb2RlKGxhc3RVbm1vZGlmaWVkSW1wb3J0Lm5vZGUpIDogMDtcblxuICAgICAgZmlsZUltcG9ydHMuZm9yRWFjaChpbXBvcnREYXRhID0+IHtcbiAgICAgICAgaWYgKGltcG9ydERhdGEuc3RhdGUgPT09IEltcG9ydFN0YXRlLlVOTU9ESUZJRUQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5ERUxFVEVEKSkge1xuICAgICAgICAgIC8vIEltcG9ydHMgd2hpY2ggZG8gbm90IGV4aXN0IGluIHNvdXJjZSBmaWxlLCBjYW4gYmUganVzdCBza2lwcGVkIGFzXG4gICAgICAgICAgLy8gd2UgZG8gbm90IG5lZWQgYW55IHJlcGxhY2VtZW50IHRvIGRlbGV0ZSB0aGUgaW1wb3J0LlxuICAgICAgICAgIGlmICghaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5BRERFRCkpIHtcbiAgICAgICAgICAgIHJlY29yZGVyLnJlbW92ZShpbXBvcnREYXRhLm5vZGUuZ2V0RnVsbFN0YXJ0KCksIGltcG9ydERhdGEubm9kZS5nZXRGdWxsV2lkdGgoKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbXBvcnREYXRhLnNwZWNpZmllcnMpIHtcbiAgICAgICAgICBjb25zdCBuYW1lZEJpbmRpbmdzID0gaW1wb3J0RGF0YS5ub2RlLmltcG9ydENsYXVzZSEubmFtZWRCaW5kaW5ncyBhcyB0cy5OYW1lZEltcG9ydHM7XG4gICAgICAgICAgY29uc3QgaW1wb3J0U3BlY2lmaWVycyA9XG4gICAgICAgICAgICAgIGltcG9ydERhdGEuc3BlY2lmaWVycy5tYXAocyA9PiB0cy5jcmVhdGVJbXBvcnRTcGVjaWZpZXIocy5wcm9wZXJ0eU5hbWUsIHMubmFtZSkpO1xuICAgICAgICAgIGNvbnN0IHVwZGF0ZWRCaW5kaW5ncyA9IHRzLnVwZGF0ZU5hbWVkSW1wb3J0cyhuYW1lZEJpbmRpbmdzLCBpbXBvcnRTcGVjaWZpZXJzKTtcblxuICAgICAgICAgIC8vIEluIGNhc2UgYW4gaW1wb3J0IGhhcyBiZWVuIGFkZGVkIG5ld2x5LCB3ZSBuZWVkIHRvIHByaW50IHRoZSB3aG9sZSBpbXBvcnRcbiAgICAgICAgICAvLyBkZWNsYXJhdGlvbiBhbmQgaW5zZXJ0IGl0IGF0IHRoZSBpbXBvcnQgc3RhcnQgaW5kZXguIE90aGVyd2lzZSwgd2UganVzdFxuICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgbmFtZWQgYmluZGluZ3MgdG8gbm90IHJlLXByaW50IHRoZSB3aG9sZSBpbXBvcnQgKHdoaWNoIGNvdWxkXG4gICAgICAgICAgLy8gY2F1c2UgdW5uZWNlc3NhcnkgZm9ybWF0dGluZyBjaGFuZ2VzKVxuICAgICAgICAgIGlmIChoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkFEREVEKSkge1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlZEltcG9ydCA9IHRzLnVwZGF0ZUltcG9ydERlY2xhcmF0aW9uKFxuICAgICAgICAgICAgICAgIGltcG9ydERhdGEubm9kZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHMuY3JlYXRlSW1wb3J0Q2xhdXNlKHVuZGVmaW5lZCwgdXBkYXRlZEJpbmRpbmdzKSxcbiAgICAgICAgICAgICAgICB0cy5jcmVhdGVTdHJpbmdMaXRlcmFsKGltcG9ydERhdGEubW9kdWxlTmFtZSkpO1xuICAgICAgICAgICAgY29uc3QgbmV3SW1wb3J0VGV4dCA9XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJpbnRlci5wcmludE5vZGUodHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsIHVwZGF0ZWRJbXBvcnQsIHNvdXJjZUZpbGUpO1xuICAgICAgICAgICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChcbiAgICAgICAgICAgICAgICBpbXBvcnRTdGFydEluZGV4LFxuICAgICAgICAgICAgICAgIGltcG9ydFN0YXJ0SW5kZXggPT09IDAgPyBgJHtuZXdJbXBvcnRUZXh0fVxcbmAgOiBgXFxuJHtuZXdJbXBvcnRUZXh0fWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5NT0RJRklFRCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld05hbWVkQmluZGluZ3NUZXh0ID1cbiAgICAgICAgICAgICAgICB0aGlzLl9wcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgdXBkYXRlZEJpbmRpbmdzLCBzb3VyY2VGaWxlKTtcbiAgICAgICAgICAgIHJlY29yZGVyLnJlbW92ZShuYW1lZEJpbmRpbmdzLmdldFN0YXJ0KCksIG5hbWVkQmluZGluZ3MuZ2V0V2lkdGgoKSk7XG4gICAgICAgICAgICByZWNvcmRlci5pbnNlcnRSaWdodChuYW1lZEJpbmRpbmdzLmdldFN0YXJ0KCksIG5ld05hbWVkQmluZGluZ3NUZXh0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5BRERFRCkpIHtcbiAgICAgICAgICBjb25zdCBuZXdJbXBvcnRUZXh0ID1cbiAgICAgICAgICAgICAgdGhpcy5fcHJpbnRlci5wcmludE5vZGUodHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsIGltcG9ydERhdGEubm9kZSwgc291cmNlRmlsZSk7XG4gICAgICAgICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChcbiAgICAgICAgICAgICAgaW1wb3J0U3RhcnRJbmRleCxcbiAgICAgICAgICAgICAgaW1wb3J0U3RhcnRJbmRleCA9PT0gMCA/IGAke25ld0ltcG9ydFRleHR9XFxuYCA6IGBcXG4ke25ld0ltcG9ydFRleHR9YCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2Ugc2hvdWxkIG5ldmVyIGhpdCB0aGlzLCBidXQgd2UgcmF0aGVyIHdhbnQgdG8gcHJpbnQgYSBjdXN0b20gZXhjZXB0aW9uXG4gICAgICAgIC8vIGluc3RlYWQgb2YganVzdCBza2lwcGluZyBpbXBvcnRzIHNpbGVudGx5LlxuICAgICAgICB0aHJvdyBFcnJvcignVW5leHBlY3RlZCBpbXBvcnQgbW9kaWZpY2F0aW9uLicpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ29ycmVjdHMgdGhlIGxpbmUgYW5kIGNoYXJhY3RlciBwb3NpdGlvbiBvZiBhIGdpdmVuIG5vZGUuIFNpbmNlIG5vZGVzIG9mXG4gICAqIHNvdXJjZSBmaWxlcyBhcmUgaW1tdXRhYmxlIGFuZCB3ZSBzb21ldGltZXMgbWFrZSBjaGFuZ2VzIHRvIHRoZSBjb250YWluaW5nXG4gICAqIHNvdXJjZSBmaWxlLCB0aGUgbm9kZSBwb3NpdGlvbiBtaWdodCBzaGlmdCAoZS5nLiBpZiB3ZSBhZGQgYSBuZXcgaW1wb3J0IGJlZm9yZSkuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSB1c2VkIHRvIHJldHJpZXZlIGEgY29ycmVjdGVkIHBvc2l0aW9uIG9mIHRoZSBnaXZlbiBub2RlLiBUaGlzXG4gICAqIGlzIGhlbHBmdWwgd2hlbiBwcmludGluZyBvdXQgZXJyb3IgbWVzc2FnZXMgd2hpY2ggc2hvdWxkIHJlZmxlY3QgdGhlIG5ldyBzdGF0ZSBvZlxuICAgKiBzb3VyY2UgZmlsZXMuXG4gICAqL1xuICBjb3JyZWN0Tm9kZVBvc2l0aW9uKG5vZGU6IHRzLk5vZGUsIG9mZnNldDogbnVtYmVyLCBwb3NpdGlvbjogdHMuTGluZUFuZENoYXJhY3Rlcikge1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcblxuICAgIGlmICghdGhpcy5faW1wb3J0Q2FjaGUuaGFzKHNvdXJjZUZpbGUpKSB7XG4gICAgICByZXR1cm4gcG9zaXRpb247XG4gICAgfVxuXG4gICAgY29uc3QgbmV3UG9zaXRpb246IHRzLkxpbmVBbmRDaGFyYWN0ZXIgPSB7Li4ucG9zaXRpb259O1xuICAgIGNvbnN0IGZpbGVJbXBvcnRzID0gdGhpcy5faW1wb3J0Q2FjaGUuZ2V0KHNvdXJjZUZpbGUpITtcblxuICAgIGZvciAobGV0IGltcG9ydERhdGEgb2YgZmlsZUltcG9ydHMpIHtcbiAgICAgIGNvbnN0IGZ1bGxFbmQgPSBpbXBvcnREYXRhLm5vZGUuZ2V0RnVsbFN0YXJ0KCkgKyBpbXBvcnREYXRhLm5vZGUuZ2V0RnVsbFdpZHRoKCk7XG4gICAgICAvLyBTdWJ0cmFjdCBvciBhZGQgbGluZXMgYmFzZWQgb24gd2hldGhlciBhbiBpbXBvcnQgaGFzIGJlZW4gZGVsZXRlZCBvciByZW1vdmVkXG4gICAgICAvLyBiZWZvcmUgdGhlIGFjdHVhbCBub2RlIG9mZnNldC5cbiAgICAgIGlmIChvZmZzZXQgPiBmdWxsRW5kICYmIGhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuREVMRVRFRCkpIHtcbiAgICAgICAgbmV3UG9zaXRpb24ubGluZS0tO1xuICAgICAgfSBlbHNlIGlmIChvZmZzZXQgPiBmdWxsRW5kICYmIGhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuQURERUQpKSB7XG4gICAgICAgIG5ld1Bvc2l0aW9uLmxpbmUrKztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld1Bvc2l0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gdW5pcXVlIGlkZW50aWZpZXIgbmFtZSBmb3IgdGhlIHNwZWNpZmllZCBzeW1ib2wgbmFtZS5cbiAgICogQHBhcmFtIHNvdXJjZUZpbGUgU291cmNlIGZpbGUgdG8gY2hlY2sgZm9yIGlkZW50aWZpZXIgY29sbGlzaW9ucy5cbiAgICogQHBhcmFtIHN5bWJvbE5hbWUgTmFtZSBvZiB0aGUgc3ltYm9sIGZvciB3aGljaCB3ZSB3YW50IHRvIGdlbmVyYXRlIGFuIHVuaXF1ZSBuYW1lLlxuICAgKiBAcGFyYW0gaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMgTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCBzaG91bGQgYmUgaWdub3JlZCB3aGVuXG4gICAqICAgIGNoZWNraW5nIGZvciBpZGVudGlmaWVyIGNvbGxpc2lvbnMgaW4gdGhlIGdpdmVuIHNvdXJjZSBmaWxlLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0VW5pcXVlSWRlbnRpZmllcihcbiAgICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIHN5bWJvbE5hbWU6IHN0cmluZyxcbiAgICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zOiB0cy5JZGVudGlmaWVyW10pOiB0cy5JZGVudGlmaWVyIHtcbiAgICBpZiAodGhpcy5faXNVbmlxdWVJZGVudGlmaWVyTmFtZShzb3VyY2VGaWxlLCBzeW1ib2xOYW1lLCBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucykpIHtcbiAgICAgIHRoaXMuX3JlY29yZFVzZWRJZGVudGlmaWVyKHNvdXJjZUZpbGUsIHN5bWJvbE5hbWUpO1xuICAgICAgcmV0dXJuIHRzLmNyZWF0ZUlkZW50aWZpZXIoc3ltYm9sTmFtZSk7XG4gICAgfVxuXG4gICAgbGV0IG5hbWU6IHN0cmluZ3xudWxsID0gbnVsbDtcbiAgICBsZXQgY291bnRlciA9IDE7XG4gICAgZG8ge1xuICAgICAgbmFtZSA9IGAke3N5bWJvbE5hbWV9XyR7Y291bnRlcisrfWA7XG4gICAgfSB3aGlsZSAoIXRoaXMuX2lzVW5pcXVlSWRlbnRpZmllck5hbWUoc291cmNlRmlsZSwgbmFtZSwgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMpKTtcblxuICAgIHRoaXMuX3JlY29yZFVzZWRJZGVudGlmaWVyKHNvdXJjZUZpbGUsIG5hbWUhKTtcbiAgICByZXR1cm4gdHMuY3JlYXRlSWRlbnRpZmllcihuYW1lISk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBpZGVudGlmaWVyIG5hbWUgaXMgdXNlZCB3aXRoaW4gdGhlIGdpdmVuIHNvdXJjZSBmaWxlLlxuICAgKiBAcGFyYW0gc291cmNlRmlsZSBTb3VyY2UgZmlsZSB0byBjaGVjayBmb3IgaWRlbnRpZmllciBjb2xsaXNpb25zLlxuICAgKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSBpZGVudGlmaWVyIHdoaWNoIGlzIGNoZWNrZWQgZm9yIGl0cyB1bmlxdWVuZXNzLlxuICAgKiBAcGFyYW0gaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMgTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCBzaG91bGQgYmUgaWdub3JlZCB3aGVuXG4gICAqICAgIGNoZWNraW5nIGZvciBpZGVudGlmaWVyIGNvbGxpc2lvbnMgaW4gdGhlIGdpdmVuIHNvdXJjZSBmaWxlLlxuICAgKi9cbiAgcHJpdmF0ZSBfaXNVbmlxdWVJZGVudGlmaWVyTmFtZShcbiAgICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIG5hbWU6IHN0cmluZywgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnM6IHRzLklkZW50aWZpZXJbXSkge1xuICAgIGlmICh0aGlzLl91c2VkSWRlbnRpZmllck5hbWVzLmhhcyhzb3VyY2VGaWxlKSAmJlxuICAgICAgICB0aGlzLl91c2VkSWRlbnRpZmllck5hbWVzLmdldChzb3VyY2VGaWxlKSEuaW5kZXhPZihuYW1lKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBXYWxrIHRocm91Z2ggdGhlIHNvdXJjZSBmaWxlIGFuZCBzZWFyY2ggZm9yIGFuIGlkZW50aWZpZXIgbWF0Y2hpbmdcbiAgICAvLyB0aGUgZ2l2ZW4gbmFtZS4gSW4gdGhhdCBjYXNlLCBpdCdzIG5vdCBndWFyYW50ZWVkIHRoYXQgdGhpcyBuYW1lXG4gICAgLy8gaXMgdW5pcXVlIGluIHRoZSBnaXZlbiBkZWNsYXJhdGlvbiBzY29wZSBhbmQgd2UganVzdCByZXR1cm4gZmFsc2UuXG4gICAgY29uc3Qgbm9kZVF1ZXVlOiB0cy5Ob2RlW10gPSBbc291cmNlRmlsZV07XG4gICAgd2hpbGUgKG5vZGVRdWV1ZS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBub2RlUXVldWUuc2hpZnQoKSE7XG4gICAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpICYmIG5vZGUudGV4dCA9PT0gbmFtZSAmJlxuICAgICAgICAgICFpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucy5pbmNsdWRlcyhub2RlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBub2RlUXVldWUucHVzaCguLi5ub2RlLmdldENoaWxkcmVuKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNvcmRzIHRoYXQgdGhlIGdpdmVuIGlkZW50aWZpZXIgaXMgdXNlZCB3aXRoaW4gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS4gVGhpc1xuICAgKiBpcyBuZWNlc3Nhcnkgc2luY2Ugd2UgZG8gbm90IGFwcGx5IGNoYW5nZXMgdG8gc291cmNlIGZpbGVzIHBlciBjaGFuZ2UsIGJ1dCBzdGlsbFxuICAgKiB3YW50IHRvIGF2b2lkIGNvbmZsaWN0cyB3aXRoIG5ld2x5IGltcG9ydGVkIHN5bWJvbHMuXG4gICAqL1xuICBwcml2YXRlIF9yZWNvcmRVc2VkSWRlbnRpZmllcihzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCBpZGVudGlmaWVyTmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdXNlZElkZW50aWZpZXJOYW1lcy5zZXQoXG4gICAgICAgIHNvdXJjZUZpbGUsICh0aGlzLl91c2VkSWRlbnRpZmllck5hbWVzLmdldChzb3VyY2VGaWxlKSB8fCBbXSkuY29uY2F0KGlkZW50aWZpZXJOYW1lKSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB0aGUgZnVsbCBlbmQgb2YgYSBnaXZlbiBub2RlLiBCeSBkZWZhdWx0IHRoZSBlbmQgcG9zaXRpb24gb2YgYSBub2RlIGlzXG4gICAqIGJlZm9yZSBhbGwgdHJhaWxpbmcgY29tbWVudHMuIFRoaXMgY291bGQgbWVhbiB0aGF0IGdlbmVyYXRlZCBpbXBvcnRzIHNoaWZ0IGNvbW1lbnRzLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0RW5kUG9zaXRpb25PZk5vZGUobm9kZTogdHMuTm9kZSkge1xuICAgIGNvbnN0IG5vZGVFbmRQb3MgPSBub2RlLmdldEVuZCgpO1xuICAgIGNvbnN0IGNvbW1lbnRSYW5nZXMgPSB0cy5nZXRUcmFpbGluZ0NvbW1lbnRSYW5nZXMobm9kZS5nZXRTb3VyY2VGaWxlKCkudGV4dCwgbm9kZUVuZFBvcyk7XG4gICAgaWYgKCFjb21tZW50UmFuZ2VzIHx8ICFjb21tZW50UmFuZ2VzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG5vZGVFbmRQb3M7XG4gICAgfVxuICAgIHJldHVybiBjb21tZW50UmFuZ2VzW2NvbW1lbnRSYW5nZXMubGVuZ3RoIC0gMV0hLmVuZDtcbiAgfVxufVxuIl19