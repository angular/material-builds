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
                result.push({ moduleName, node, state: 0 /* ImportState.UNMODIFIED */ });
                continue;
            }
            // Handles imports resolving to default exports of a module.
            // e.g. `import moment from "moment";`
            if (!node.importClause.namedBindings) {
                result.push({
                    moduleName,
                    node,
                    name: node.importClause.name,
                    state: 0 /* ImportState.UNMODIFIED */,
                });
                continue;
            }
            // Handles imports with individual symbol specifiers.
            // e.g. `import {A, B, C} from "my-module";`
            if (ts.isNamedImports(node.importClause.namedBindings)) {
                result.push({
                    moduleName,
                    node,
                    specifiers: node.importClause.namedBindings.elements.map(el => ({
                        name: el.name,
                        propertyName: el.propertyName,
                    })),
                    state: 0 /* ImportState.UNMODIFIED */,
                });
            }
            else {
                // Handles namespaced imports. e.g. `import * as core from "my-pkg";`
                result.push({
                    moduleName,
                    node,
                    name: node.importClause.namedBindings.name,
                    namespace: true,
                    state: 0 /* ImportState.UNMODIFIED */,
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
        return specifier.startsWith('.')
            ? (0, path_1.resolve)(basePath, specifier) === (0, path_1.resolve)(basePath, moduleName)
            : specifier === moduleName;
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
                    importData.state |= 8 /* ImportState.DELETED */;
                }
                else {
                    importData.state |= 2 /* ImportState.MODIFIED */;
                }
            }
        }
    }
    /** Deletes the import that matches the given import declaration if found. */
    deleteImportByDeclaration(declaration) {
        const fileImports = this._analyzeImportsIfNeeded(declaration.getSourceFile());
        for (let importData of fileImports) {
            if (importData.node === declaration) {
                importData.state |= 8 /* ImportState.DELETED */;
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
                return ts.factory.createIdentifier(importData.name.text);
            }
            // In case a "Type" symbol is imported, we can't use namespace imports
            // because these only export symbols available at runtime (no types)
            if (importData.namespace && !typeImport) {
                return ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(importData.name.text), ts.factory.createIdentifier(symbolName || 'default'));
            }
            else if (importData.specifiers && symbolName) {
                const existingSpecifier = importData.specifiers.find(s => s.propertyName ? s.propertyName.text === symbolName : s.name.text === symbolName);
                if (existingSpecifier) {
                    return ts.factory.createIdentifier(existingSpecifier.name.text);
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
            const propertyIdentifier = ts.factory.createIdentifier(symbolName);
            const generatedUniqueIdentifier = this._getUniqueIdentifier(sourceFile, symbolName, ignoreIdentifierCollisions);
            const needsGeneratedUniqueName = generatedUniqueIdentifier.text !== symbolName;
            const importName = needsGeneratedUniqueName ? generatedUniqueIdentifier : propertyIdentifier;
            existingImport.specifiers.push({
                name: importName,
                propertyName: needsGeneratedUniqueName ? propertyIdentifier : undefined,
            });
            existingImport.state |= 2 /* ImportState.MODIFIED */;
            if (hasFlag(existingImport, 8 /* ImportState.DELETED */)) {
                // unset the deleted flag if the import is pending deletion, but
                // can now be used for the new imported symbol.
                existingImport.state &= ~8 /* ImportState.DELETED */;
            }
            return importName;
        }
        let identifier = null;
        let newImport = null;
        if (symbolName) {
            const propertyIdentifier = ts.factory.createIdentifier(symbolName);
            const generatedUniqueIdentifier = this._getUniqueIdentifier(sourceFile, symbolName, ignoreIdentifierCollisions);
            const needsGeneratedUniqueName = generatedUniqueIdentifier.text !== symbolName;
            identifier = needsGeneratedUniqueName ? generatedUniqueIdentifier : propertyIdentifier;
            const newImportDecl = ts.factory.createImportDeclaration(undefined, undefined, ts.factory.createImportClause(false, undefined, ts.factory.createNamedImports([])), ts.factory.createStringLiteral(moduleName));
            newImport = {
                moduleName,
                node: newImportDecl,
                specifiers: [
                    {
                        propertyName: needsGeneratedUniqueName ? propertyIdentifier : undefined,
                        name: identifier,
                    },
                ],
                state: 4 /* ImportState.ADDED */,
            };
        }
        else {
            identifier = this._getUniqueIdentifier(sourceFile, 'defaultExport', ignoreIdentifierCollisions);
            const newImportDecl = ts.factory.createImportDeclaration(undefined, undefined, ts.factory.createImportClause(false, identifier, undefined), ts.factory.createStringLiteral(moduleName));
            newImport = {
                moduleName,
                node: newImportDecl,
                name: identifier,
                state: 4 /* ImportState.ADDED */,
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
            const lastUnmodifiedImport = fileImports
                .reverse()
                .find(i => i.state === 0 /* ImportState.UNMODIFIED */);
            const importStartIndex = lastUnmodifiedImport
                ? this._getEndPositionOfNode(lastUnmodifiedImport.node)
                : 0;
            fileImports.forEach(importData => {
                if (importData.state === 0 /* ImportState.UNMODIFIED */) {
                    return;
                }
                if (hasFlag(importData, 8 /* ImportState.DELETED */)) {
                    // Imports which do not exist in source file, can be just skipped as
                    // we do not need any replacement to delete the import.
                    if (!hasFlag(importData, 4 /* ImportState.ADDED */)) {
                        recorder.remove(importData.node.getFullStart(), importData.node.getFullWidth());
                    }
                    return;
                }
                if (importData.specifiers) {
                    const namedBindings = importData.node.importClause.namedBindings;
                    const importSpecifiers = importData.specifiers.map(s => ts.factory.createImportSpecifier(false, s.propertyName, s.name));
                    const updatedBindings = ts.factory.updateNamedImports(namedBindings, importSpecifiers);
                    // In case an import has been added newly, we need to print the whole import
                    // declaration and insert it at the import start index. Otherwise, we just
                    // update the named bindings to not re-print the whole import (which could
                    // cause unnecessary formatting changes)
                    if (hasFlag(importData, 4 /* ImportState.ADDED */)) {
                        const updatedImport = ts.factory.updateImportDeclaration(importData.node, undefined, undefined, ts.factory.createImportClause(false, undefined, updatedBindings), ts.factory.createStringLiteral(importData.moduleName), undefined);
                        const newImportText = this._printer.printNode(ts.EmitHint.Unspecified, updatedImport, sourceFile);
                        recorder.insertLeft(importStartIndex, importStartIndex === 0 ? `${newImportText}\n` : `\n${newImportText}`);
                        return;
                    }
                    else if (hasFlag(importData, 2 /* ImportState.MODIFIED */)) {
                        const newNamedBindingsText = this._printer.printNode(ts.EmitHint.Unspecified, updatedBindings, sourceFile);
                        recorder.remove(namedBindings.getStart(), namedBindings.getWidth());
                        recorder.insertRight(namedBindings.getStart(), newNamedBindingsText);
                        return;
                    }
                }
                else if (hasFlag(importData, 4 /* ImportState.ADDED */)) {
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
            if (offset > fullEnd && hasFlag(importData, 8 /* ImportState.DELETED */)) {
                newPosition.line--;
            }
            else if (offset > fullEnd && hasFlag(importData, 4 /* ImportState.ADDED */)) {
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
            return ts.factory.createIdentifier(symbolName);
        }
        let name = null;
        let counter = 1;
        do {
            name = `${symbolName}_${counter++}`;
        } while (!this._isUniqueIdentifierName(sourceFile, name, ignoreIdentifierCollisions));
        this._recordUsedIdentifier(sourceFile, name);
        return ts.factory.createIdentifier(name);
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
            if (ts.isIdentifier(node) &&
                node.text === name &&
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9oYW1tZXItZ2VzdHVyZXMtdjkvaW1wb3J0LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBR0gsK0JBQXNDO0FBQ3RDLGlDQUFpQztBQTRCakMsdUVBQXVFO0FBQ3ZFLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBb0IsRUFBRSxJQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXZGOzs7O0dBSUc7QUFDSCxNQUFhLGFBQWE7SUFPeEIsWUFBb0IsV0FBdUIsRUFBVSxRQUFvQjtRQUFyRCxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVk7UUFOekUsc0VBQXNFO1FBQzlELHlCQUFvQixHQUFHLElBQUksR0FBRyxFQUEyQixDQUFDO1FBRWxFLHNEQUFzRDtRQUM5QyxpQkFBWSxHQUFHLElBQUksR0FBRyxFQUFtQyxDQUFDO0lBRVUsQ0FBQztJQUU3RTs7Ozs7T0FLRztJQUNLLHVCQUF1QixDQUFDLFVBQXlCO1FBQ3ZELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDckMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUUsQ0FBQztTQUMzQztRQUVELE1BQU0sTUFBTSxHQUFxQixFQUFFLENBQUM7UUFDcEMsS0FBSyxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsVUFBVSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFD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QUMsb0JBQW9CLENBQUMsR0FBRyxDQUMzQixVQUFVLEVBQ1YsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FDekUsQ0FBQztJQUNKLENBQUM7SUFFRDs7O09BR0c7SUFDSyxxQkFBcUIsQ0FBQyxJQUFhO1FBQ3pDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQyxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN6RixJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUMzQyxPQUFPLFVBQVUsQ0FBQztTQUNuQjtRQUNELE9BQU8sYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFDO0lBQ3RELENBQUM7Q0FDRjtBQS9kRCxzQ0ErZEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGaWxlU3lzdGVtfSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge2Rpcm5hbWUsIHJlc29sdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8vIHRzbGludDpkaXNhYmxlOm5vLWJpdHdpc2VcblxuLyoqIEVudW0gZGVzY3JpYmluZyB0aGUgcG9zc2libGUgc3RhdGVzIG9mIGFuIGFuYWx5emVkIGltcG9ydC4gKi9cbmNvbnN0IGVudW0gSW1wb3J0U3RhdGUge1xuICBVTk1PRElGSUVEID0gMGIwLFxuICBNT0RJRklFRCA9IDBiMTAsXG4gIEFEREVEID0gMGIxMDAsXG4gIERFTEVURUQgPSAwYjEwMDAsXG59XG5cbi8qKiBJbnRlcmZhY2UgZGVzY3JpYmluZyBhbiBpbXBvcnQgc3BlY2lmaWVyLiAqL1xuaW50ZXJmYWNlIEltcG9ydFNwZWNpZmllciB7XG4gIG5hbWU6IHRzLklkZW50aWZpZXI7XG4gIHByb3BlcnR5TmFtZT86IHRzLklkZW50aWZpZXI7XG59XG5cbi8qKiBJbnRlcmZhY2UgZGVzY3JpYmluZyBhbiBhbmFseXplZCBpbXBvcnQuICovXG5pbnRlcmZhY2UgQW5hbHl6ZWRJbXBvcnQge1xuICBub2RlOiB0cy5JbXBvcnREZWNsYXJhdGlvbjtcbiAgbW9kdWxlTmFtZTogc3RyaW5nO1xuICBuYW1lPzogdHMuSWRlbnRpZmllcjtcbiAgc3BlY2lmaWVycz86IEltcG9ydFNwZWNpZmllcltdO1xuICBuYW1lc3BhY2U/OiBib29sZWFuO1xuICBzdGF0ZTogSW1wb3J0U3RhdGU7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciBhbiBhbmFseXplZCBpbXBvcnQgaGFzIHRoZSBnaXZlbiBpbXBvcnQgZmxhZyBzZXQuICovXG5jb25zdCBoYXNGbGFnID0gKGRhdGE6IEFuYWx5emVkSW1wb3J0LCBmbGFnOiBJbXBvcnRTdGF0ZSkgPT4gKGRhdGEuc3RhdGUgJiBmbGFnKSAhPT0gMDtcblxuLyoqXG4gKiBJbXBvcnQgbWFuYWdlciB0aGF0IGNhbiBiZSB1c2VkIHRvIGFkZCBvciByZW1vdmUgVHlwZVNjcmlwdCBpbXBvcnRzIHdpdGhpbiBzb3VyY2VcbiAqIGZpbGVzLiBUaGUgbWFuYWdlciBlbnN1cmVzIHRoYXQgbXVsdGlwbGUgdHJhbnNmb3JtYXRpb25zIGFyZSBhcHBsaWVkIHByb3Blcmx5XG4gKiB3aXRob3V0IHNoaWZ0ZWQgb2Zmc2V0cyBhbmQgdGhhdCBleGlzdGluZyBpbXBvcnRzIGFyZSByZS11c2VkLlxuICovXG5leHBvcnQgY2xhc3MgSW1wb3J0TWFuYWdlciB7XG4gIC8qKiBNYXAgb2Ygc291cmNlLWZpbGVzIGFuZCB0aGVpciBwcmV2aW91c2x5IHVzZWQgaWRlbnRpZmllciBuYW1lcy4gKi9cbiAgcHJpdmF0ZSBfdXNlZElkZW50aWZpZXJOYW1lcyA9IG5ldyBNYXA8dHMuU291cmNlRmlsZSwgc3RyaW5nW10+KCk7XG5cbiAgLyoqIE1hcCBvZiBzb3VyY2UgZmlsZXMgYW5kIHRoZWlyIGFuYWx5emVkIGltcG9ydHMuICovXG4gIHByaXZhdGUgX2ltcG9ydENhY2hlID0gbmV3IE1hcDx0cy5Tb3VyY2VGaWxlLCBBbmFseXplZEltcG9ydFtdPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2ZpbGVTeXN0ZW06IEZpbGVTeXN0ZW0sIHByaXZhdGUgX3ByaW50ZXI6IHRzLlByaW50ZXIpIHt9XG5cbiAgLyoqXG4gICAqIEFuYWx5emVzIHRoZSBpbXBvcnQgb2YgdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZSBpZiBuZWVkZWQuIEluIG9yZGVyIHRvIHBlcmZvcm1cbiAgICogbW9kaWZpY2F0aW9ucyB0byBpbXBvcnRzIG9mIGEgc291cmNlIGZpbGUsIHdlIHN0b3JlIGFsbCBpbXBvcnRzIGluIG1lbW9yeSBhbmRcbiAgICogdXBkYXRlIHRoZSBzb3VyY2UgZmlsZSBvbmNlIGFsbCBjaGFuZ2VzIGhhdmUgYmVlbiBtYWRlLiBUaGlzIGlzIGVzc2VudGlhbCB0b1xuICAgKiBlbnN1cmUgdGhhdCB3ZSBjYW4gcmUtdXNlIG5ld2x5IGFkZGVkIGltcG9ydHMgYW5kIG5vdCBicmVhayBmaWxlIG9mZnNldHMuXG4gICAqL1xuICBwcml2YXRlIF9hbmFseXplSW1wb3J0c0lmTmVlZGVkKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBBbmFseXplZEltcG9ydFtdIHtcbiAgICBpZiAodGhpcy5faW1wb3J0Q2FjaGUuaGFzKHNvdXJjZUZpbGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5faW1wb3J0Q2FjaGUuZ2V0KHNvdXJjZUZpbGUpITtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQ6IEFuYWx5emVkSW1wb3J0W10gPSBbXTtcbiAgICBmb3IgKGxldCBub2RlIG9mIHNvdXJjZUZpbGUuc3RhdGVtZW50cykge1xuICAgICAgaWYgKCF0cy5pc0ltcG9ydERlY2xhcmF0aW9uKG5vZGUpIHx8ICF0cy5pc1N0cmluZ0xpdGVyYWwobm9kZS5tb2R1bGVTcGVjaWZpZXIpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtb2R1bGVOYW1lID0gbm9kZS5tb2R1bGVTcGVjaWZpZXIudGV4dDtcblxuICAgICAgLy8gSGFuZGxlcyBzaWRlLWVmZmVjdCBpbXBvcnRzIHdoaWNoIGRvIG5laXRoZXIgaGF2ZSBhIG5hbWUgb3JcbiAgICAgIC8vIHNwZWNpZmllcnMuIGUuZy4gYGltcG9ydCBcIm15LXBhY2thZ2VcIjtgXG4gICAgICBpZiAoIW5vZGUuaW1wb3J0Q2xhdXNlKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHttb2R1bGVOYW1lLCBub2RlLCBzdGF0ZTogSW1wb3J0U3RhdGUuVU5NT0RJRklFRH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlcyBpbXBvcnRzIHJlc29sdmluZyB0byBkZWZhdWx0IGV4cG9ydHMgb2YgYSBtb2R1bGUuXG4gICAgICAvLyBlLmcuIGBpbXBvcnQgbW9tZW50IGZyb20gXCJtb21lbnRcIjtgXG4gICAgICBpZiAoIW5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBuYW1lOiBub2RlLmltcG9ydENsYXVzZS5uYW1lLFxuICAgICAgICAgIHN0YXRlOiBJbXBvcnRTdGF0ZS5VTk1PRElGSUVELFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZXMgaW1wb3J0cyB3aXRoIGluZGl2aWR1YWwgc3ltYm9sIHNwZWNpZmllcnMuXG4gICAgICAvLyBlLmcuIGBpbXBvcnQge0EsIEIsIEN9IGZyb20gXCJteS1tb2R1bGVcIjtgXG4gICAgICBpZiAodHMuaXNOYW1lZEltcG9ydHMobm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBzcGVjaWZpZXJzOiBub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzLmVsZW1lbnRzLm1hcChlbCA9PiAoe1xuICAgICAgICAgICAgbmFtZTogZWwubmFtZSxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZTogZWwucHJvcGVydHlOYW1lLFxuICAgICAgICAgIH0pKSxcbiAgICAgICAgICBzdGF0ZTogSW1wb3J0U3RhdGUuVU5NT0RJRklFRCxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBIYW5kbGVzIG5hbWVzcGFjZWQgaW1wb3J0cy4gZS5nLiBgaW1wb3J0ICogYXMgY29yZSBmcm9tIFwibXktcGtnXCI7YFxuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG5hbWU6IG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MubmFtZSxcbiAgICAgICAgICBuYW1lc3BhY2U6IHRydWUsXG4gICAgICAgICAgc3RhdGU6IEltcG9ydFN0YXRlLlVOTU9ESUZJRUQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9pbXBvcnRDYWNoZS5zZXQoc291cmNlRmlsZSwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBzcGVjaWZpZXIsIHdoaWNoIGNhbiBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSBwYXRoLFxuICAgKiBtYXRjaGVzIHRoZSBwYXNzZWQgbW9kdWxlIG5hbWUuXG4gICAqL1xuICBwcml2YXRlIF9pc01vZHVsZVNwZWNpZmllck1hdGNoaW5nKFxuICAgIGJhc2VQYXRoOiBzdHJpbmcsXG4gICAgc3BlY2lmaWVyOiBzdHJpbmcsXG4gICAgbW9kdWxlTmFtZTogc3RyaW5nLFxuICApOiBib29sZWFuIHtcbiAgICByZXR1cm4gc3BlY2lmaWVyLnN0YXJ0c1dpdGgoJy4nKVxuICAgICAgPyByZXNvbHZlKGJhc2VQYXRoLCBzcGVjaWZpZXIpID09PSByZXNvbHZlKGJhc2VQYXRoLCBtb2R1bGVOYW1lKVxuICAgICAgOiBzcGVjaWZpZXIgPT09IG1vZHVsZU5hbWU7XG4gIH1cblxuICAvKiogRGVsZXRlcyBhIGdpdmVuIG5hbWVkIGJpbmRpbmcgaW1wb3J0IGZyb20gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS4gKi9cbiAgZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIHN5bWJvbE5hbWU6IHN0cmluZywgbW9kdWxlTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgc291cmNlRGlyID0gZGlybmFtZShzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICBjb25zdCBmaWxlSW1wb3J0cyA9IHRoaXMuX2FuYWx5emVJbXBvcnRzSWZOZWVkZWQoc291cmNlRmlsZSk7XG5cbiAgICBmb3IgKGxldCBpbXBvcnREYXRhIG9mIGZpbGVJbXBvcnRzKSB7XG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLl9pc01vZHVsZVNwZWNpZmllck1hdGNoaW5nKHNvdXJjZURpciwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lLCBtb2R1bGVOYW1lKSB8fFxuICAgICAgICAhaW1wb3J0RGF0YS5zcGVjaWZpZXJzXG4gICAgICApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNwZWNpZmllckluZGV4ID0gaW1wb3J0RGF0YS5zcGVjaWZpZXJzLmZpbmRJbmRleChcbiAgICAgICAgZCA9PiAoZC5wcm9wZXJ0eU5hbWUgfHwgZC5uYW1lKS50ZXh0ID09PSBzeW1ib2xOYW1lLFxuICAgICAgKTtcbiAgICAgIGlmIChzcGVjaWZpZXJJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgaW1wb3J0RGF0YS5zcGVjaWZpZXJzLnNwbGljZShzcGVjaWZpZXJJbmRleCwgMSk7XG4gICAgICAgIC8vIGlmIHRoZSBpbXBvcnQgZG9lcyBubyBsb25nZXIgY29udGFpbiBhbnkgc3BlY2lmaWVycyBhZnRlciB0aGUgcmVtb3ZhbCBvZiB0aGVcbiAgICAgICAgLy8gZ2l2ZW4gc3ltYm9sLCB3ZSBjYW4ganVzdCBtYXJrIHRoZSB3aG9sZSBpbXBvcnQgZm9yIGRlbGV0aW9uLiBPdGhlcndpc2UsIHdlIG1hcmtcbiAgICAgICAgLy8gaXQgYXMgbW9kaWZpZWQgc28gdGhhdCBpdCB3aWxsIGJlIHJlLXByaW50ZWQuXG4gICAgICAgIGlmIChpbXBvcnREYXRhLnNwZWNpZmllcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgaW1wb3J0RGF0YS5zdGF0ZSB8PSBJbXBvcnRTdGF0ZS5ERUxFVEVEO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGltcG9ydERhdGEuc3RhdGUgfD0gSW1wb3J0U3RhdGUuTU9ESUZJRUQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogRGVsZXRlcyB0aGUgaW1wb3J0IHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW4gaW1wb3J0IGRlY2xhcmF0aW9uIGlmIGZvdW5kLiAqL1xuICBkZWxldGVJbXBvcnRCeURlY2xhcmF0aW9uKGRlY2xhcmF0aW9uOiB0cy5JbXBvcnREZWNsYXJhdGlvbikge1xuICAgIGNvbnN0IGZpbGVJbXBvcnRzID0gdGhpcy5fYW5hbHl6ZUltcG9ydHNJZk5lZWRlZChkZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCkpO1xuICAgIGZvciAobGV0IGltcG9ydERhdGEgb2YgZmlsZUltcG9ydHMpIHtcbiAgICAgIGlmIChpbXBvcnREYXRhLm5vZGUgPT09IGRlY2xhcmF0aW9uKSB7XG4gICAgICAgIGltcG9ydERhdGEuc3RhdGUgfD0gSW1wb3J0U3RhdGUuREVMRVRFRDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBpbXBvcnQgdG8gdGhlIGdpdmVuIHNvdXJjZSBmaWxlIGFuZCByZXR1cm5zIHRoZSBUeXBlU2NyaXB0IGV4cHJlc3Npb24gdGhhdFxuICAgKiBjYW4gYmUgdXNlZCB0byBhY2Nlc3MgdGhlIG5ld2x5IGltcG9ydGVkIHN5bWJvbC5cbiAgICpcbiAgICogV2hlbmV2ZXIgYW4gaW1wb3J0IGlzIGFkZGVkIHRvIGEgc291cmNlIGZpbGUsIGl0J3MgcmVjb21tZW5kZWQgdGhhdCB0aGUgcmV0dXJuZWRcbiAgICogZXhwcmVzc2lvbiBpcyB1c2VkIHRvIHJlZmVyZW5jZSB0aCBzeW1ib2wuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2UgdGhlIHN5bWJvbFxuICAgKiBjb3VsZCBiZSBhbGlhc2VkIGlmIGl0IHdvdWxkIGNvbGxpZGUgd2l0aCBleGlzdGluZyBpbXBvcnRzIGluIHNvdXJjZSBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0gc291cmNlRmlsZSBTb3VyY2UgZmlsZSB0byB3aGljaCB0aGUgaW1wb3J0IHNob3VsZCBiZSBhZGRlZC5cbiAgICogQHBhcmFtIHN5bWJvbE5hbWUgTmFtZSBvZiB0aGUgc3ltYm9sIHRoYXQgc2hvdWxkIGJlIGltcG9ydGVkLiBDYW4gYmUgbnVsbCBpZlxuICAgKiAgICB0aGUgZGVmYXVsdCBleHBvcnQgaXMgcmVxdWVzdGVkLlxuICAgKiBAcGFyYW0gbW9kdWxlTmFtZSBOYW1lIG9mIHRoZSBtb2R1bGUgb2Ygd2hpY2ggdGhlIHN5bWJvbCBzaG91bGQgYmUgaW1wb3J0ZWQuXG4gICAqIEBwYXJhbSB0eXBlSW1wb3J0IFdoZXRoZXIgdGhlIHN5bWJvbCBpcyBhIHR5cGUuXG4gICAqIEBwYXJhbSBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIGNhbiBiZSBpZ25vcmVkIHdoZW5cbiAgICogICAgdGhlIGltcG9ydCBtYW5hZ2VyIGNoZWNrcyBmb3IgaW1wb3J0IGNvbGxpc2lvbnMuXG4gICAqL1xuICBhZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSxcbiAgICBzeW1ib2xOYW1lOiBzdHJpbmcgfCBudWxsLFxuICAgIG1vZHVsZU5hbWU6IHN0cmluZyxcbiAgICB0eXBlSW1wb3J0ID0gZmFsc2UsXG4gICAgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnM6IHRzLklkZW50aWZpZXJbXSA9IFtdLFxuICApOiB0cy5FeHByZXNzaW9uIHtcbiAgICBjb25zdCBzb3VyY2VEaXIgPSBkaXJuYW1lKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IGZpbGVJbXBvcnRzID0gdGhpcy5fYW5hbHl6ZUltcG9ydHNJZk5lZWRlZChzb3VyY2VGaWxlKTtcblxuICAgIGxldCBleGlzdGluZ0ltcG9ydDogQW5hbHl6ZWRJbXBvcnQgfCBudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCBpbXBvcnREYXRhIG9mIGZpbGVJbXBvcnRzKSB7XG4gICAgICBpZiAoIXRoaXMuX2lzTW9kdWxlU3BlY2lmaWVyTWF0Y2hpbmcoc291cmNlRGlyLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUsIG1vZHVsZU5hbWUpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBubyBzeW1ib2wgbmFtZSBoYXMgYmVlbiBzcGVjaWZpZWQsIHRoZSBkZWZhdWx0IGltcG9ydCBpcyByZXF1ZXN0ZWQuIEluIHRoYXRcbiAgICAgIC8vIGNhc2Ugd2Ugc2VhcmNoIGZvciBub24tbmFtZXNwYWNlIGFuZCBub24tc3BlY2lmaWVyIGltcG9ydHMuXG4gICAgICBpZiAoIXN5bWJvbE5hbWUgJiYgIWltcG9ydERhdGEubmFtZXNwYWNlICYmICFpbXBvcnREYXRhLnNwZWNpZmllcnMpIHtcbiAgICAgICAgcmV0dXJuIHRzLmZhY3RvcnkuY3JlYXRlSWRlbnRpZmllcihpbXBvcnREYXRhLm5hbWUhLnRleHQpO1xuICAgICAgfVxuXG4gICAgICAvLyBJbiBjYXNlIGEgXCJUeXBlXCIgc3ltYm9sIGlzIGltcG9ydGVkLCB3ZSBjYW4ndCB1c2UgbmFtZXNwYWNlIGltcG9ydHNcbiAgICAgIC8vIGJlY2F1c2UgdGhlc2Ugb25seSBleHBvcnQgc3ltYm9scyBhdmFpbGFibGUgYXQgcnVudGltZSAobm8gdHlwZXMpXG4gICAgICBpZiAoaW1wb3J0RGF0YS5uYW1lc3BhY2UgJiYgIXR5cGVJbXBvcnQpIHtcbiAgICAgICAgcmV0dXJuIHRzLmZhY3RvcnkuY3JlYXRlUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKFxuICAgICAgICAgIHRzLmZhY3RvcnkuY3JlYXRlSWRlbnRpZmllcihpbXBvcnREYXRhLm5hbWUhLnRleHQpLFxuICAgICAgICAgIHRzLmZhY3RvcnkuY3JlYXRlSWRlbnRpZmllcihzeW1ib2xOYW1lIHx8ICdkZWZhdWx0JyksXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKGltcG9ydERhdGEuc3BlY2lmaWVycyAmJiBzeW1ib2xOYW1lKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nU3BlY2lmaWVyID0gaW1wb3J0RGF0YS5zcGVjaWZpZXJzLmZpbmQocyA9PlxuICAgICAgICAgIHMucHJvcGVydHlOYW1lID8gcy5wcm9wZXJ0eU5hbWUudGV4dCA9PT0gc3ltYm9sTmFtZSA6IHMubmFtZS50ZXh0ID09PSBzeW1ib2xOYW1lLFxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChleGlzdGluZ1NwZWNpZmllcikge1xuICAgICAgICAgIHJldHVybiB0cy5mYWN0b3J5LmNyZWF0ZUlkZW50aWZpZXIoZXhpc3RpbmdTcGVjaWZpZXIubmFtZS50ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEluIGNhc2UgdGhlIHN5bWJvbCBjb3VsZCBub3QgYmUgZm91bmQgaW4gYW4gZXhpc3RpbmcgaW1wb3J0LCB3ZVxuICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSBpbXBvcnQgZGVjbGFyYXRpb24gYXMgaXQgY2FuIGJlIHVwZGF0ZWQgdG8gaW5jbHVkZVxuICAgICAgICAvLyB0aGUgc3BlY2lmaWVkIHN5bWJvbCBuYW1lIHdpdGhvdXQgaGF2aW5nIHRvIGNyZWF0ZSBhIG5ldyBpbXBvcnQuXG4gICAgICAgIGV4aXN0aW5nSW1wb3J0ID0gaW1wb3J0RGF0YTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBleGlzdGluZyBpbXBvcnQgdGhhdCBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgbW9kdWxlLCB3ZVxuICAgIC8vIGp1c3QgdXBkYXRlIHRoZSBpbXBvcnQgc3BlY2lmaWVycyB0byBhbHNvIGltcG9ydCB0aGUgcmVxdWVzdGVkIHN5bWJvbC5cbiAgICBpZiAoZXhpc3RpbmdJbXBvcnQpIHtcbiAgICAgIGNvbnN0IHByb3BlcnR5SWRlbnRpZmllciA9IHRzLmZhY3RvcnkuY3JlYXRlSWRlbnRpZmllcihzeW1ib2xOYW1lISk7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyID0gdGhpcy5fZ2V0VW5pcXVlSWRlbnRpZmllcihcbiAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgc3ltYm9sTmFtZSEsXG4gICAgICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5lZWRzR2VuZXJhdGVkVW5pcXVlTmFtZSA9IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIudGV4dCAhPT0gc3ltYm9sTmFtZTtcbiAgICAgIGNvbnN0IGltcG9ydE5hbWUgPSBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPyBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyIDogcHJvcGVydHlJZGVudGlmaWVyO1xuXG4gICAgICBleGlzdGluZ0ltcG9ydC5zcGVjaWZpZXJzIS5wdXNoKHtcbiAgICAgICAgbmFtZTogaW1wb3J0TmFtZSxcbiAgICAgICAgcHJvcGVydHlOYW1lOiBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPyBwcm9wZXJ0eUlkZW50aWZpZXIgOiB1bmRlZmluZWQsXG4gICAgICB9KTtcbiAgICAgIGV4aXN0aW5nSW1wb3J0LnN0YXRlIHw9IEltcG9ydFN0YXRlLk1PRElGSUVEO1xuXG4gICAgICBpZiAoaGFzRmxhZyhleGlzdGluZ0ltcG9ydCwgSW1wb3J0U3RhdGUuREVMRVRFRCkpIHtcbiAgICAgICAgLy8gdW5zZXQgdGhlIGRlbGV0ZWQgZmxhZyBpZiB0aGUgaW1wb3J0IGlzIHBlbmRpbmcgZGVsZXRpb24sIGJ1dFxuICAgICAgICAvLyBjYW4gbm93IGJlIHVzZWQgZm9yIHRoZSBuZXcgaW1wb3J0ZWQgc3ltYm9sLlxuICAgICAgICBleGlzdGluZ0ltcG9ydC5zdGF0ZSAmPSB+SW1wb3J0U3RhdGUuREVMRVRFRDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGltcG9ydE5hbWU7XG4gICAgfVxuXG4gICAgbGV0IGlkZW50aWZpZXI6IHRzLklkZW50aWZpZXIgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgbmV3SW1wb3J0OiBBbmFseXplZEltcG9ydCB8IG51bGwgPSBudWxsO1xuXG4gICAgaWYgKHN5bWJvbE5hbWUpIHtcbiAgICAgIGNvbnN0IHByb3BlcnR5SWRlbnRpZmllciA9IHRzLmZhY3RvcnkuY3JlYXRlSWRlbnRpZmllcihzeW1ib2xOYW1lKTtcbiAgICAgIGNvbnN0IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIgPSB0aGlzLl9nZXRVbmlxdWVJZGVudGlmaWVyKFxuICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICBzeW1ib2xOYW1lLFxuICAgICAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyxcbiAgICAgICk7XG4gICAgICBjb25zdCBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPSBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyLnRleHQgIT09IHN5bWJvbE5hbWU7XG4gICAgICBpZGVudGlmaWVyID0gbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllciA6IHByb3BlcnR5SWRlbnRpZmllcjtcblxuICAgICAgY29uc3QgbmV3SW1wb3J0RGVjbCA9IHRzLmZhY3RvcnkuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb24oXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB0cy5mYWN0b3J5LmNyZWF0ZUltcG9ydENsYXVzZShmYWxzZSwgdW5kZWZpbmVkLCB0cy5mYWN0b3J5LmNyZWF0ZU5hbWVkSW1wb3J0cyhbXSkpLFxuICAgICAgICB0cy5mYWN0b3J5LmNyZWF0ZVN0cmluZ0xpdGVyYWwobW9kdWxlTmFtZSksXG4gICAgICApO1xuXG4gICAgICBuZXdJbXBvcnQgPSB7XG4gICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgIG5vZGU6IG5ld0ltcG9ydERlY2wsXG4gICAgICAgIHNwZWNpZmllcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IG5lZWRzR2VuZXJhdGVkVW5pcXVlTmFtZSA/IHByb3BlcnR5SWRlbnRpZmllciA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG5hbWU6IGlkZW50aWZpZXIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgc3RhdGU6IEltcG9ydFN0YXRlLkFEREVELFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWRlbnRpZmllciA9IHRoaXMuX2dldFVuaXF1ZUlkZW50aWZpZXIoXG4gICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgICdkZWZhdWx0RXhwb3J0JyxcbiAgICAgICAgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMsXG4gICAgICApO1xuICAgICAgY29uc3QgbmV3SW1wb3J0RGVjbCA9IHRzLmZhY3RvcnkuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb24oXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB0cy5mYWN0b3J5LmNyZWF0ZUltcG9ydENsYXVzZShmYWxzZSwgaWRlbnRpZmllciwgdW5kZWZpbmVkKSxcbiAgICAgICAgdHMuZmFjdG9yeS5jcmVhdGVTdHJpbmdMaXRlcmFsKG1vZHVsZU5hbWUpLFxuICAgICAgKTtcbiAgICAgIG5ld0ltcG9ydCA9IHtcbiAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgbm9kZTogbmV3SW1wb3J0RGVjbCxcbiAgICAgICAgbmFtZTogaWRlbnRpZmllcixcbiAgICAgICAgc3RhdGU6IEltcG9ydFN0YXRlLkFEREVELFxuICAgICAgfTtcbiAgICB9XG4gICAgZmlsZUltcG9ydHMucHVzaChuZXdJbXBvcnQpO1xuICAgIHJldHVybiBpZGVudGlmaWVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgdGhlIHJlY29yZGVkIGNoYW5nZXMgaW4gdGhlIHVwZGF0ZSByZWNvcmRlcnMgb2YgdGhlIGNvcnJlc3BvbmRpbmcgc291cmNlIGZpbGVzLlxuICAgKiBUaGUgY2hhbmdlcyBhcmUgYXBwbGllZCBzZXBhcmF0ZWx5IGFmdGVyIGFsbCBjaGFuZ2VzIGhhdmUgYmVlbiByZWNvcmRlZCBiZWNhdXNlIG90aGVyd2lzZVxuICAgKiBmaWxlIG9mZnNldHMgd2lsbCBjaGFuZ2UgYW5kIHRoZSBzb3VyY2UgZmlsZXMgd291bGQgbmVlZCB0byBiZSByZS1wYXJzZWQgYWZ0ZXIgZWFjaCBjaGFuZ2UuXG4gICAqL1xuICByZWNvcmRDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2ltcG9ydENhY2hlLmZvckVhY2goKGZpbGVJbXBvcnRzLCBzb3VyY2VGaWxlKSA9PiB7XG4gICAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0uZWRpdCh0aGlzLl9maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSkpO1xuICAgICAgY29uc3QgbGFzdFVubW9kaWZpZWRJbXBvcnQgPSBmaWxlSW1wb3J0c1xuICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgIC5maW5kKGkgPT4gaS5zdGF0ZSA9PT0gSW1wb3J0U3RhdGUuVU5NT0RJRklFRCk7XG4gICAgICBjb25zdCBpbXBvcnRTdGFydEluZGV4ID0gbGFzdFVubW9kaWZpZWRJbXBvcnRcbiAgICAgICAgPyB0aGlzLl9nZXRFbmRQb3NpdGlvbk9mTm9kZShsYXN0VW5tb2RpZmllZEltcG9ydC5ub2RlKVxuICAgICAgICA6IDA7XG5cbiAgICAgIGZpbGVJbXBvcnRzLmZvckVhY2goaW1wb3J0RGF0YSA9PiB7XG4gICAgICAgIGlmIChpbXBvcnREYXRhLnN0YXRlID09PSBJbXBvcnRTdGF0ZS5VTk1PRElGSUVEKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuREVMRVRFRCkpIHtcbiAgICAgICAgICAvLyBJbXBvcnRzIHdoaWNoIGRvIG5vdCBleGlzdCBpbiBzb3VyY2UgZmlsZSwgY2FuIGJlIGp1c3Qgc2tpcHBlZCBhc1xuICAgICAgICAgIC8vIHdlIGRvIG5vdCBuZWVkIGFueSByZXBsYWNlbWVudCB0byBkZWxldGUgdGhlIGltcG9ydC5cbiAgICAgICAgICBpZiAoIWhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuQURERUQpKSB7XG4gICAgICAgICAgICByZWNvcmRlci5yZW1vdmUoaW1wb3J0RGF0YS5ub2RlLmdldEZ1bGxTdGFydCgpLCBpbXBvcnREYXRhLm5vZGUuZ2V0RnVsbFdpZHRoKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW1wb3J0RGF0YS5zcGVjaWZpZXJzKSB7XG4gICAgICAgICAgY29uc3QgbmFtZWRCaW5kaW5ncyA9IGltcG9ydERhdGEubm9kZS5pbXBvcnRDbGF1c2UhLm5hbWVkQmluZGluZ3MgYXMgdHMuTmFtZWRJbXBvcnRzO1xuICAgICAgICAgIGNvbnN0IGltcG9ydFNwZWNpZmllcnMgPSBpbXBvcnREYXRhLnNwZWNpZmllcnMubWFwKHMgPT5cbiAgICAgICAgICAgIHRzLmZhY3RvcnkuY3JlYXRlSW1wb3J0U3BlY2lmaWVyKGZhbHNlLCBzLnByb3BlcnR5TmFtZSwgcy5uYW1lKSxcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbnN0IHVwZGF0ZWRCaW5kaW5ncyA9IHRzLmZhY3RvcnkudXBkYXRlTmFtZWRJbXBvcnRzKG5hbWVkQmluZGluZ3MsIGltcG9ydFNwZWNpZmllcnMpO1xuXG4gICAgICAgICAgLy8gSW4gY2FzZSBhbiBpbXBvcnQgaGFzIGJlZW4gYWRkZWQgbmV3bHksIHdlIG5lZWQgdG8gcHJpbnQgdGhlIHdob2xlIGltcG9ydFxuICAgICAgICAgIC8vIGRlY2xhcmF0aW9uIGFuZCBpbnNlcnQgaXQgYXQgdGhlIGltcG9ydCBzdGFydCBpbmRleC4gT3RoZXJ3aXNlLCB3ZSBqdXN0XG4gICAgICAgICAgLy8gdXBkYXRlIHRoZSBuYW1lZCBiaW5kaW5ncyB0byBub3QgcmUtcHJpbnQgdGhlIHdob2xlIGltcG9ydCAod2hpY2ggY291bGRcbiAgICAgICAgICAvLyBjYXVzZSB1bm5lY2Vzc2FyeSBmb3JtYXR0aW5nIGNoYW5nZXMpXG4gICAgICAgICAgaWYgKGhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuQURERUQpKSB7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVkSW1wb3J0ID0gdHMuZmFjdG9yeS51cGRhdGVJbXBvcnREZWNsYXJhdGlvbihcbiAgICAgICAgICAgICAgaW1wb3J0RGF0YS5ub2RlLFxuICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgdHMuZmFjdG9yeS5jcmVhdGVJbXBvcnRDbGF1c2UoZmFsc2UsIHVuZGVmaW5lZCwgdXBkYXRlZEJpbmRpbmdzKSxcbiAgICAgICAgICAgICAgdHMuZmFjdG9yeS5jcmVhdGVTdHJpbmdMaXRlcmFsKGltcG9ydERhdGEubW9kdWxlTmFtZSksXG4gICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBuZXdJbXBvcnRUZXh0ID0gdGhpcy5fcHJpbnRlci5wcmludE5vZGUoXG4gICAgICAgICAgICAgIHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLFxuICAgICAgICAgICAgICB1cGRhdGVkSW1wb3J0LFxuICAgICAgICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlY29yZGVyLmluc2VydExlZnQoXG4gICAgICAgICAgICAgIGltcG9ydFN0YXJ0SW5kZXgsXG4gICAgICAgICAgICAgIGltcG9ydFN0YXJ0SW5kZXggPT09IDAgPyBgJHtuZXdJbXBvcnRUZXh0fVxcbmAgOiBgXFxuJHtuZXdJbXBvcnRUZXh0fWAsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5NT0RJRklFRCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld05hbWVkQmluZGluZ3NUZXh0ID0gdGhpcy5fcHJpbnRlci5wcmludE5vZGUoXG4gICAgICAgICAgICAgIHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLFxuICAgICAgICAgICAgICB1cGRhdGVkQmluZGluZ3MsXG4gICAgICAgICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmVjb3JkZXIucmVtb3ZlKG5hbWVkQmluZGluZ3MuZ2V0U3RhcnQoKSwgbmFtZWRCaW5kaW5ncy5nZXRXaWR0aCgpKTtcbiAgICAgICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5hbWVkQmluZGluZ3MuZ2V0U3RhcnQoKSwgbmV3TmFtZWRCaW5kaW5nc1RleHQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkFEREVEKSkge1xuICAgICAgICAgIGNvbnN0IG5ld0ltcG9ydFRleHQgPSB0aGlzLl9wcmludGVyLnByaW50Tm9kZShcbiAgICAgICAgICAgIHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLFxuICAgICAgICAgICAgaW1wb3J0RGF0YS5ub2RlLFxuICAgICAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgICApO1xuICAgICAgICAgIHJlY29yZGVyLmluc2VydExlZnQoXG4gICAgICAgICAgICBpbXBvcnRTdGFydEluZGV4LFxuICAgICAgICAgICAgaW1wb3J0U3RhcnRJbmRleCA9PT0gMCA/IGAke25ld0ltcG9ydFRleHR9XFxuYCA6IGBcXG4ke25ld0ltcG9ydFRleHR9YCxcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlIHNob3VsZCBuZXZlciBoaXQgdGhpcywgYnV0IHdlIHJhdGhlciB3YW50IHRvIHByaW50IGEgY3VzdG9tIGV4Y2VwdGlvblxuICAgICAgICAvLyBpbnN0ZWFkIG9mIGp1c3Qgc2tpcHBpbmcgaW1wb3J0cyBzaWxlbnRseS5cbiAgICAgICAgdGhyb3cgRXJyb3IoJ1VuZXhwZWN0ZWQgaW1wb3J0IG1vZGlmaWNhdGlvbi4nKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcnJlY3RzIHRoZSBsaW5lIGFuZCBjaGFyYWN0ZXIgcG9zaXRpb24gb2YgYSBnaXZlbiBub2RlLiBTaW5jZSBub2RlcyBvZlxuICAgKiBzb3VyY2UgZmlsZXMgYXJlIGltbXV0YWJsZSBhbmQgd2Ugc29tZXRpbWVzIG1ha2UgY2hhbmdlcyB0byB0aGUgY29udGFpbmluZ1xuICAgKiBzb3VyY2UgZmlsZSwgdGhlIG5vZGUgcG9zaXRpb24gbWlnaHQgc2hpZnQgKGUuZy4gaWYgd2UgYWRkIGEgbmV3IGltcG9ydCBiZWZvcmUpLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCB0byByZXRyaWV2ZSBhIGNvcnJlY3RlZCBwb3NpdGlvbiBvZiB0aGUgZ2l2ZW4gbm9kZS4gVGhpc1xuICAgKiBpcyBoZWxwZnVsIHdoZW4gcHJpbnRpbmcgb3V0IGVycm9yIG1lc3NhZ2VzIHdoaWNoIHNob3VsZCByZWZsZWN0IHRoZSBuZXcgc3RhdGUgb2ZcbiAgICogc291cmNlIGZpbGVzLlxuICAgKi9cbiAgY29ycmVjdE5vZGVQb3NpdGlvbihub2RlOiB0cy5Ob2RlLCBvZmZzZXQ6IG51bWJlciwgcG9zaXRpb246IHRzLkxpbmVBbmRDaGFyYWN0ZXIpIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG5cbiAgICBpZiAoIXRoaXMuX2ltcG9ydENhY2hlLmhhcyhzb3VyY2VGaWxlKSkge1xuICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld1Bvc2l0aW9uOiB0cy5MaW5lQW5kQ2hhcmFjdGVyID0gey4uLnBvc2l0aW9ufTtcbiAgICBjb25zdCBmaWxlSW1wb3J0cyA9IHRoaXMuX2ltcG9ydENhY2hlLmdldChzb3VyY2VGaWxlKSE7XG5cbiAgICBmb3IgKGxldCBpbXBvcnREYXRhIG9mIGZpbGVJbXBvcnRzKSB7XG4gICAgICBjb25zdCBmdWxsRW5kID0gaW1wb3J0RGF0YS5ub2RlLmdldEZ1bGxTdGFydCgpICsgaW1wb3J0RGF0YS5ub2RlLmdldEZ1bGxXaWR0aCgpO1xuICAgICAgLy8gU3VidHJhY3Qgb3IgYWRkIGxpbmVzIGJhc2VkIG9uIHdoZXRoZXIgYW4gaW1wb3J0IGhhcyBiZWVuIGRlbGV0ZWQgb3IgcmVtb3ZlZFxuICAgICAgLy8gYmVmb3JlIHRoZSBhY3R1YWwgbm9kZSBvZmZzZXQuXG4gICAgICBpZiAob2Zmc2V0ID4gZnVsbEVuZCAmJiBoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkRFTEVURUQpKSB7XG4gICAgICAgIG5ld1Bvc2l0aW9uLmxpbmUtLTtcbiAgICAgIH0gZWxzZSBpZiAob2Zmc2V0ID4gZnVsbEVuZCAmJiBoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkFEREVEKSkge1xuICAgICAgICBuZXdQb3NpdGlvbi5saW5lKys7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdQb3NpdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIHVuaXF1ZSBpZGVudGlmaWVyIG5hbWUgZm9yIHRoZSBzcGVjaWZpZWQgc3ltYm9sIG5hbWUuXG4gICAqIEBwYXJhbSBzb3VyY2VGaWxlIFNvdXJjZSBmaWxlIHRvIGNoZWNrIGZvciBpZGVudGlmaWVyIGNvbGxpc2lvbnMuXG4gICAqIEBwYXJhbSBzeW1ib2xOYW1lIE5hbWUgb2YgdGhlIHN5bWJvbCBmb3Igd2hpY2ggd2Ugd2FudCB0byBnZW5lcmF0ZSBhbiB1bmlxdWUgbmFtZS5cbiAgICogQHBhcmFtIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggc2hvdWxkIGJlIGlnbm9yZWQgd2hlblxuICAgKiAgICBjaGVja2luZyBmb3IgaWRlbnRpZmllciBjb2xsaXNpb25zIGluIHRoZSBnaXZlbiBzb3VyY2UgZmlsZS5cbiAgICovXG4gIHByaXZhdGUgX2dldFVuaXF1ZUlkZW50aWZpZXIoXG4gICAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSxcbiAgICBzeW1ib2xOYW1lOiBzdHJpbmcsXG4gICAgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnM6IHRzLklkZW50aWZpZXJbXSxcbiAgKTogdHMuSWRlbnRpZmllciB7XG4gICAgaWYgKHRoaXMuX2lzVW5pcXVlSWRlbnRpZmllck5hbWUoc291cmNlRmlsZSwgc3ltYm9sTmFtZSwgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMpKSB7XG4gICAgICB0aGlzLl9yZWNvcmRVc2VkSWRlbnRpZmllcihzb3VyY2VGaWxlLCBzeW1ib2xOYW1lKTtcbiAgICAgIHJldHVybiB0cy5mYWN0b3J5LmNyZWF0ZUlkZW50aWZpZXIoc3ltYm9sTmFtZSk7XG4gICAgfVxuXG4gICAgbGV0IG5hbWU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGxldCBjb3VudGVyID0gMTtcbiAgICBkbyB7XG4gICAgICBuYW1lID0gYCR7c3ltYm9sTmFtZX1fJHtjb3VudGVyKyt9YDtcbiAgICB9IHdoaWxlICghdGhpcy5faXNVbmlxdWVJZGVudGlmaWVyTmFtZShzb3VyY2VGaWxlLCBuYW1lLCBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucykpO1xuXG4gICAgdGhpcy5fcmVjb3JkVXNlZElkZW50aWZpZXIoc291cmNlRmlsZSwgbmFtZSEpO1xuICAgIHJldHVybiB0cy5mYWN0b3J5LmNyZWF0ZUlkZW50aWZpZXIobmFtZSEpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgaWRlbnRpZmllciBuYW1lIGlzIHVzZWQgd2l0aGluIHRoZSBnaXZlbiBzb3VyY2UgZmlsZS5cbiAgICogQHBhcmFtIHNvdXJjZUZpbGUgU291cmNlIGZpbGUgdG8gY2hlY2sgZm9yIGlkZW50aWZpZXIgY29sbGlzaW9ucy5cbiAgICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgaWRlbnRpZmllciB3aGljaCBpcyBjaGVja2VkIGZvciBpdHMgdW5pcXVlbmVzcy5cbiAgICogQHBhcmFtIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggc2hvdWxkIGJlIGlnbm9yZWQgd2hlblxuICAgKiAgICBjaGVja2luZyBmb3IgaWRlbnRpZmllciBjb2xsaXNpb25zIGluIHRoZSBnaXZlbiBzb3VyY2UgZmlsZS5cbiAgICovXG4gIHByaXZhdGUgX2lzVW5pcXVlSWRlbnRpZmllck5hbWUoXG4gICAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnM6IHRzLklkZW50aWZpZXJbXSxcbiAgKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5fdXNlZElkZW50aWZpZXJOYW1lcy5oYXMoc291cmNlRmlsZSkgJiZcbiAgICAgIHRoaXMuX3VzZWRJZGVudGlmaWVyTmFtZXMuZ2V0KHNvdXJjZUZpbGUpIS5pbmRleE9mKG5hbWUpICE9PSAtMVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFdhbGsgdGhyb3VnaCB0aGUgc291cmNlIGZpbGUgYW5kIHNlYXJjaCBmb3IgYW4gaWRlbnRpZmllciBtYXRjaGluZ1xuICAgIC8vIHRoZSBnaXZlbiBuYW1lLiBJbiB0aGF0IGNhc2UsIGl0J3Mgbm90IGd1YXJhbnRlZWQgdGhhdCB0aGlzIG5hbWVcbiAgICAvLyBpcyB1bmlxdWUgaW4gdGhlIGdpdmVuIGRlY2xhcmF0aW9uIHNjb3BlIGFuZCB3ZSBqdXN0IHJldHVybiBmYWxzZS5cbiAgICBjb25zdCBub2RlUXVldWU6IHRzLk5vZGVbXSA9IFtzb3VyY2VGaWxlXTtcbiAgICB3aGlsZSAobm9kZVF1ZXVlLmxlbmd0aCkge1xuICAgICAgY29uc3Qgbm9kZSA9IG5vZGVRdWV1ZS5zaGlmdCgpITtcbiAgICAgIGlmIChcbiAgICAgICAgdHMuaXNJZGVudGlmaWVyKG5vZGUpICYmXG4gICAgICAgIG5vZGUudGV4dCA9PT0gbmFtZSAmJlxuICAgICAgICAhaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMuaW5jbHVkZXMobm9kZSlcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBub2RlUXVldWUucHVzaCguLi5ub2RlLmdldENoaWxkcmVuKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNvcmRzIHRoYXQgdGhlIGdpdmVuIGlkZW50aWZpZXIgaXMgdXNlZCB3aXRoaW4gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS4gVGhpc1xuICAgKiBpcyBuZWNlc3Nhcnkgc2luY2Ugd2UgZG8gbm90IGFwcGx5IGNoYW5nZXMgdG8gc291cmNlIGZpbGVzIHBlciBjaGFuZ2UsIGJ1dCBzdGlsbFxuICAgKiB3YW50IHRvIGF2b2lkIGNvbmZsaWN0cyB3aXRoIG5ld2x5IGltcG9ydGVkIHN5bWJvbHMuXG4gICAqL1xuICBwcml2YXRlIF9yZWNvcmRVc2VkSWRlbnRpZmllcihzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCBpZGVudGlmaWVyTmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdXNlZElkZW50aWZpZXJOYW1lcy5zZXQoXG4gICAgICBzb3VyY2VGaWxlLFxuICAgICAgKHRoaXMuX3VzZWRJZGVudGlmaWVyTmFtZXMuZ2V0KHNvdXJjZUZpbGUpIHx8IFtdKS5jb25jYXQoaWRlbnRpZmllck5hbWUpLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB0aGUgZnVsbCBlbmQgb2YgYSBnaXZlbiBub2RlLiBCeSBkZWZhdWx0IHRoZSBlbmQgcG9zaXRpb24gb2YgYSBub2RlIGlzXG4gICAqIGJlZm9yZSBhbGwgdHJhaWxpbmcgY29tbWVudHMuIFRoaXMgY291bGQgbWVhbiB0aGF0IGdlbmVyYXRlZCBpbXBvcnRzIHNoaWZ0IGNvbW1lbnRzLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0RW5kUG9zaXRpb25PZk5vZGUobm9kZTogdHMuTm9kZSkge1xuICAgIGNvbnN0IG5vZGVFbmRQb3MgPSBub2RlLmdldEVuZCgpO1xuICAgIGNvbnN0IGNvbW1lbnRSYW5nZXMgPSB0cy5nZXRUcmFpbGluZ0NvbW1lbnRSYW5nZXMobm9kZS5nZXRTb3VyY2VGaWxlKCkudGV4dCwgbm9kZUVuZFBvcyk7XG4gICAgaWYgKCFjb21tZW50UmFuZ2VzIHx8ICFjb21tZW50UmFuZ2VzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG5vZGVFbmRQb3M7XG4gICAgfVxuICAgIHJldHVybiBjb21tZW50UmFuZ2VzW2NvbW1lbnRSYW5nZXMubGVuZ3RoIC0gMV0hLmVuZDtcbiAgfVxufVxuIl19