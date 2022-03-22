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
                result.push({
                    moduleName,
                    node,
                    name: node.importClause.name,
                    state: 0 /* UNMODIFIED */,
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
                state: 4 /* ADDED */,
            };
        }
        else {
            identifier = this._getUniqueIdentifier(sourceFile, 'defaultExport', ignoreIdentifierCollisions);
            const newImportDecl = ts.factory.createImportDeclaration(undefined, undefined, ts.factory.createImportClause(false, identifier, undefined), ts.factory.createStringLiteral(moduleName));
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
            const lastUnmodifiedImport = fileImports
                .reverse()
                .find(i => i.state === 0 /* UNMODIFIED */);
            const importStartIndex = lastUnmodifiedImport
                ? this._getEndPositionOfNode(lastUnmodifiedImport.node)
                : 0;
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
                    const importSpecifiers = importData.specifiers.map(s => ts.factory.createImportSpecifier(false, s.propertyName, s.name));
                    const updatedBindings = ts.factory.updateNamedImports(namedBindings, importSpecifiers);
                    // In case an import has been added newly, we need to print the whole import
                    // declaration and insert it at the import start index. Otherwise, we just
                    // update the named bindings to not re-print the whole import (which could
                    // cause unnecessary formatting changes)
                    if (hasFlag(importData, 4 /* ADDED */)) {
                        const updatedImport = ts.factory.updateImportDeclaration(importData.node, undefined, undefined, ts.factory.createImportClause(false, undefined, updatedBindings), ts.factory.createStringLiteral(importData.moduleName), undefined);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9oYW1tZXItZ2VzdHVyZXMtdjkvaW1wb3J0LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBR0gsK0JBQXNDO0FBQ3RDLGlDQUFpQztBQTRCakMsdUVBQXVFO0FBQ3ZFLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBb0IsRUFBRSxJQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXZGOzs7O0dBSUc7QUFDSCxNQUFhLGFBQWE7SUFPeEIsWUFBb0IsV0FBdUIsRUFBVSxRQUFvQjtRQUFyRCxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVk7UUFOekUsc0VBQXNFO1FBQzlELHlCQUFvQixHQUFHLElBQUksR0FBRyxFQUEyQixDQUFDO1FBRWxFLHNEQUFzRDtRQUM5QyxpQkFBWSxHQUFHLElBQUksR0FBRyxFQUFtQyxDQUFDO0lBRVUsQ0FBQztJQUU3RTs7Ozs7T0FLRztJQUNLLHVCQUF1QixDQUFDLFVBQXlCO1FBQ3ZELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDckMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUUsQ0FBQztTQUMzQztRQUVELE1BQU0sTUFBTSxHQUFxQixFQUFFLENBQUM7UUFDcEMsS0FBSyxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsVUFBVSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFD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LG9CQUFvQixDQUFDLEdBQUcsQ0FDM0IsVUFBVSxFQUNWLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQ3pFLENBQUM7SUFDSixDQUFDO0lBRUQ7OztPQUdHO0lBQ0sscUJBQXFCLENBQUMsSUFBYTtRQUN6QyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDekYsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDM0MsT0FBTyxVQUFVLENBQUM7U0FDbkI7UUFDRCxPQUFPLGFBQWEsQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxDQUFDLEdBQUcsQ0FBQztJQUN0RCxDQUFDO0NBQ0Y7QUEvZEQsc0NBK2RDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RmlsZVN5c3RlbX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtkaXJuYW1lLCByZXNvbHZlfSBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlXG5cbi8qKiBFbnVtIGRlc2NyaWJpbmcgdGhlIHBvc3NpYmxlIHN0YXRlcyBvZiBhbiBhbmFseXplZCBpbXBvcnQuICovXG5jb25zdCBlbnVtIEltcG9ydFN0YXRlIHtcbiAgVU5NT0RJRklFRCA9IDBiMCxcbiAgTU9ESUZJRUQgPSAwYjEwLFxuICBBRERFRCA9IDBiMTAwLFxuICBERUxFVEVEID0gMGIxMDAwLFxufVxuXG4vKiogSW50ZXJmYWNlIGRlc2NyaWJpbmcgYW4gaW1wb3J0IHNwZWNpZmllci4gKi9cbmludGVyZmFjZSBJbXBvcnRTcGVjaWZpZXIge1xuICBuYW1lOiB0cy5JZGVudGlmaWVyO1xuICBwcm9wZXJ0eU5hbWU/OiB0cy5JZGVudGlmaWVyO1xufVxuXG4vKiogSW50ZXJmYWNlIGRlc2NyaWJpbmcgYW4gYW5hbHl6ZWQgaW1wb3J0LiAqL1xuaW50ZXJmYWNlIEFuYWx5emVkSW1wb3J0IHtcbiAgbm9kZTogdHMuSW1wb3J0RGVjbGFyYXRpb247XG4gIG1vZHVsZU5hbWU6IHN0cmluZztcbiAgbmFtZT86IHRzLklkZW50aWZpZXI7XG4gIHNwZWNpZmllcnM/OiBJbXBvcnRTcGVjaWZpZXJbXTtcbiAgbmFtZXNwYWNlPzogYm9vbGVhbjtcbiAgc3RhdGU6IEltcG9ydFN0YXRlO1xufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgYW4gYW5hbHl6ZWQgaW1wb3J0IGhhcyB0aGUgZ2l2ZW4gaW1wb3J0IGZsYWcgc2V0LiAqL1xuY29uc3QgaGFzRmxhZyA9IChkYXRhOiBBbmFseXplZEltcG9ydCwgZmxhZzogSW1wb3J0U3RhdGUpID0+IChkYXRhLnN0YXRlICYgZmxhZykgIT09IDA7XG5cbi8qKlxuICogSW1wb3J0IG1hbmFnZXIgdGhhdCBjYW4gYmUgdXNlZCB0byBhZGQgb3IgcmVtb3ZlIFR5cGVTY3JpcHQgaW1wb3J0cyB3aXRoaW4gc291cmNlXG4gKiBmaWxlcy4gVGhlIG1hbmFnZXIgZW5zdXJlcyB0aGF0IG11bHRpcGxlIHRyYW5zZm9ybWF0aW9ucyBhcmUgYXBwbGllZCBwcm9wZXJseVxuICogd2l0aG91dCBzaGlmdGVkIG9mZnNldHMgYW5kIHRoYXQgZXhpc3RpbmcgaW1wb3J0cyBhcmUgcmUtdXNlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIEltcG9ydE1hbmFnZXIge1xuICAvKiogTWFwIG9mIHNvdXJjZS1maWxlcyBhbmQgdGhlaXIgcHJldmlvdXNseSB1c2VkIGlkZW50aWZpZXIgbmFtZXMuICovXG4gIHByaXZhdGUgX3VzZWRJZGVudGlmaWVyTmFtZXMgPSBuZXcgTWFwPHRzLlNvdXJjZUZpbGUsIHN0cmluZ1tdPigpO1xuXG4gIC8qKiBNYXAgb2Ygc291cmNlIGZpbGVzIGFuZCB0aGVpciBhbmFseXplZCBpbXBvcnRzLiAqL1xuICBwcml2YXRlIF9pbXBvcnRDYWNoZSA9IG5ldyBNYXA8dHMuU291cmNlRmlsZSwgQW5hbHl6ZWRJbXBvcnRbXT4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9maWxlU3lzdGVtOiBGaWxlU3lzdGVtLCBwcml2YXRlIF9wcmludGVyOiB0cy5QcmludGVyKSB7fVxuXG4gIC8qKlxuICAgKiBBbmFseXplcyB0aGUgaW1wb3J0IG9mIHRoZSBzcGVjaWZpZWQgc291cmNlIGZpbGUgaWYgbmVlZGVkLiBJbiBvcmRlciB0byBwZXJmb3JtXG4gICAqIG1vZGlmaWNhdGlvbnMgdG8gaW1wb3J0cyBvZiBhIHNvdXJjZSBmaWxlLCB3ZSBzdG9yZSBhbGwgaW1wb3J0cyBpbiBtZW1vcnkgYW5kXG4gICAqIHVwZGF0ZSB0aGUgc291cmNlIGZpbGUgb25jZSBhbGwgY2hhbmdlcyBoYXZlIGJlZW4gbWFkZS4gVGhpcyBpcyBlc3NlbnRpYWwgdG9cbiAgICogZW5zdXJlIHRoYXQgd2UgY2FuIHJlLXVzZSBuZXdseSBhZGRlZCBpbXBvcnRzIGFuZCBub3QgYnJlYWsgZmlsZSBvZmZzZXRzLlxuICAgKi9cbiAgcHJpdmF0ZSBfYW5hbHl6ZUltcG9ydHNJZk5lZWRlZChzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogQW5hbHl6ZWRJbXBvcnRbXSB7XG4gICAgaWYgKHRoaXMuX2ltcG9ydENhY2hlLmhhcyhzb3VyY2VGaWxlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2ltcG9ydENhY2hlLmdldChzb3VyY2VGaWxlKSE7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0OiBBbmFseXplZEltcG9ydFtdID0gW107XG4gICAgZm9yIChsZXQgbm9kZSBvZiBzb3VyY2VGaWxlLnN0YXRlbWVudHMpIHtcbiAgICAgIGlmICghdHMuaXNJbXBvcnREZWNsYXJhdGlvbihub2RlKSB8fCAhdHMuaXNTdHJpbmdMaXRlcmFsKG5vZGUubW9kdWxlU3BlY2lmaWVyKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbW9kdWxlTmFtZSA9IG5vZGUubW9kdWxlU3BlY2lmaWVyLnRleHQ7XG5cbiAgICAgIC8vIEhhbmRsZXMgc2lkZS1lZmZlY3QgaW1wb3J0cyB3aGljaCBkbyBuZWl0aGVyIGhhdmUgYSBuYW1lIG9yXG4gICAgICAvLyBzcGVjaWZpZXJzLiBlLmcuIGBpbXBvcnQgXCJteS1wYWNrYWdlXCI7YFxuICAgICAgaWYgKCFub2RlLmltcG9ydENsYXVzZSkge1xuICAgICAgICByZXN1bHQucHVzaCh7bW9kdWxlTmFtZSwgbm9kZSwgc3RhdGU6IEltcG9ydFN0YXRlLlVOTU9ESUZJRUR9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZXMgaW1wb3J0cyByZXNvbHZpbmcgdG8gZGVmYXVsdCBleHBvcnRzIG9mIGEgbW9kdWxlLlxuICAgICAgLy8gZS5nLiBgaW1wb3J0IG1vbWVudCBmcm9tIFwibW9tZW50XCI7YFxuICAgICAgaWYgKCFub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgbmFtZTogbm9kZS5pbXBvcnRDbGF1c2UubmFtZSxcbiAgICAgICAgICBzdGF0ZTogSW1wb3J0U3RhdGUuVU5NT0RJRklFRCxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGVzIGltcG9ydHMgd2l0aCBpbmRpdmlkdWFsIHN5bWJvbCBzcGVjaWZpZXJzLlxuICAgICAgLy8gZS5nLiBgaW1wb3J0IHtBLCBCLCBDfSBmcm9tIFwibXktbW9kdWxlXCI7YFxuICAgICAgaWYgKHRzLmlzTmFtZWRJbXBvcnRzKG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgc3BlY2lmaWVyczogbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cy5tYXAoZWwgPT4gKHtcbiAgICAgICAgICAgIG5hbWU6IGVsLm5hbWUsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IGVsLnByb3BlcnR5TmFtZSxcbiAgICAgICAgICB9KSksXG4gICAgICAgICAgc3RhdGU6IEltcG9ydFN0YXRlLlVOTU9ESUZJRUQsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSGFuZGxlcyBuYW1lc3BhY2VkIGltcG9ydHMuIGUuZy4gYGltcG9ydCAqIGFzIGNvcmUgZnJvbSBcIm15LXBrZ1wiO2BcbiAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBuYW1lOiBub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzLm5hbWUsXG4gICAgICAgICAgbmFtZXNwYWNlOiB0cnVlLFxuICAgICAgICAgIHN0YXRlOiBJbXBvcnRTdGF0ZS5VTk1PRElGSUVELFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5faW1wb3J0Q2FjaGUuc2V0KHNvdXJjZUZpbGUsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gc3BlY2lmaWVyLCB3aGljaCBjYW4gYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgcGF0aCxcbiAgICogbWF0Y2hlcyB0aGUgcGFzc2VkIG1vZHVsZSBuYW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBfaXNNb2R1bGVTcGVjaWZpZXJNYXRjaGluZyhcbiAgICBiYXNlUGF0aDogc3RyaW5nLFxuICAgIHNwZWNpZmllcjogc3RyaW5nLFxuICAgIG1vZHVsZU5hbWU6IHN0cmluZyxcbiAgKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHNwZWNpZmllci5zdGFydHNXaXRoKCcuJylcbiAgICAgID8gcmVzb2x2ZShiYXNlUGF0aCwgc3BlY2lmaWVyKSA9PT0gcmVzb2x2ZShiYXNlUGF0aCwgbW9kdWxlTmFtZSlcbiAgICAgIDogc3BlY2lmaWVyID09PSBtb2R1bGVOYW1lO1xuICB9XG5cbiAgLyoqIERlbGV0ZXMgYSBnaXZlbiBuYW1lZCBiaW5kaW5nIGltcG9ydCBmcm9tIHRoZSBzcGVjaWZpZWQgc291cmNlIGZpbGUuICovXG4gIGRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCBzeW1ib2xOYW1lOiBzdHJpbmcsIG1vZHVsZU5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHNvdXJjZURpciA9IGRpcm5hbWUoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgY29uc3QgZmlsZUltcG9ydHMgPSB0aGlzLl9hbmFseXplSW1wb3J0c0lmTmVlZGVkKHNvdXJjZUZpbGUpO1xuXG4gICAgZm9yIChsZXQgaW1wb3J0RGF0YSBvZiBmaWxlSW1wb3J0cykge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5faXNNb2R1bGVTcGVjaWZpZXJNYXRjaGluZyhzb3VyY2VEaXIsIGltcG9ydERhdGEubW9kdWxlTmFtZSwgbW9kdWxlTmFtZSkgfHxcbiAgICAgICAgIWltcG9ydERhdGEuc3BlY2lmaWVyc1xuICAgICAgKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzcGVjaWZpZXJJbmRleCA9IGltcG9ydERhdGEuc3BlY2lmaWVycy5maW5kSW5kZXgoXG4gICAgICAgIGQgPT4gKGQucHJvcGVydHlOYW1lIHx8IGQubmFtZSkudGV4dCA9PT0gc3ltYm9sTmFtZSxcbiAgICAgICk7XG4gICAgICBpZiAoc3BlY2lmaWVySW5kZXggIT09IC0xKSB7XG4gICAgICAgIGltcG9ydERhdGEuc3BlY2lmaWVycy5zcGxpY2Uoc3BlY2lmaWVySW5kZXgsIDEpO1xuICAgICAgICAvLyBpZiB0aGUgaW1wb3J0IGRvZXMgbm8gbG9uZ2VyIGNvbnRhaW4gYW55IHNwZWNpZmllcnMgYWZ0ZXIgdGhlIHJlbW92YWwgb2YgdGhlXG4gICAgICAgIC8vIGdpdmVuIHN5bWJvbCwgd2UgY2FuIGp1c3QgbWFyayB0aGUgd2hvbGUgaW1wb3J0IGZvciBkZWxldGlvbi4gT3RoZXJ3aXNlLCB3ZSBtYXJrXG4gICAgICAgIC8vIGl0IGFzIG1vZGlmaWVkIHNvIHRoYXQgaXQgd2lsbCBiZSByZS1wcmludGVkLlxuICAgICAgICBpZiAoaW1wb3J0RGF0YS5zcGVjaWZpZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGltcG9ydERhdGEuc3RhdGUgfD0gSW1wb3J0U3RhdGUuREVMRVRFRDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbXBvcnREYXRhLnN0YXRlIHw9IEltcG9ydFN0YXRlLk1PRElGSUVEO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIERlbGV0ZXMgdGhlIGltcG9ydCB0aGF0IG1hdGNoZXMgdGhlIGdpdmVuIGltcG9ydCBkZWNsYXJhdGlvbiBpZiBmb3VuZC4gKi9cbiAgZGVsZXRlSW1wb3J0QnlEZWNsYXJhdGlvbihkZWNsYXJhdGlvbjogdHMuSW1wb3J0RGVjbGFyYXRpb24pIHtcbiAgICBjb25zdCBmaWxlSW1wb3J0cyA9IHRoaXMuX2FuYWx5emVJbXBvcnRzSWZOZWVkZWQoZGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpKTtcbiAgICBmb3IgKGxldCBpbXBvcnREYXRhIG9mIGZpbGVJbXBvcnRzKSB7XG4gICAgICBpZiAoaW1wb3J0RGF0YS5ub2RlID09PSBkZWNsYXJhdGlvbikge1xuICAgICAgICBpbXBvcnREYXRhLnN0YXRlIHw9IEltcG9ydFN0YXRlLkRFTEVURUQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gaW1wb3J0IHRvIHRoZSBnaXZlbiBzb3VyY2UgZmlsZSBhbmQgcmV0dXJucyB0aGUgVHlwZVNjcmlwdCBleHByZXNzaW9uIHRoYXRcbiAgICogY2FuIGJlIHVzZWQgdG8gYWNjZXNzIHRoZSBuZXdseSBpbXBvcnRlZCBzeW1ib2wuXG4gICAqXG4gICAqIFdoZW5ldmVyIGFuIGltcG9ydCBpcyBhZGRlZCB0byBhIHNvdXJjZSBmaWxlLCBpdCdzIHJlY29tbWVuZGVkIHRoYXQgdGhlIHJldHVybmVkXG4gICAqIGV4cHJlc3Npb24gaXMgdXNlZCB0byByZWZlcmVuY2UgdGggc3ltYm9sLiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHRoZSBzeW1ib2xcbiAgICogY291bGQgYmUgYWxpYXNlZCBpZiBpdCB3b3VsZCBjb2xsaWRlIHdpdGggZXhpc3RpbmcgaW1wb3J0cyBpbiBzb3VyY2UgZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIHNvdXJjZUZpbGUgU291cmNlIGZpbGUgdG8gd2hpY2ggdGhlIGltcG9ydCBzaG91bGQgYmUgYWRkZWQuXG4gICAqIEBwYXJhbSBzeW1ib2xOYW1lIE5hbWUgb2YgdGhlIHN5bWJvbCB0aGF0IHNob3VsZCBiZSBpbXBvcnRlZC4gQ2FuIGJlIG51bGwgaWZcbiAgICogICAgdGhlIGRlZmF1bHQgZXhwb3J0IGlzIHJlcXVlc3RlZC5cbiAgICogQHBhcmFtIG1vZHVsZU5hbWUgTmFtZSBvZiB0aGUgbW9kdWxlIG9mIHdoaWNoIHRoZSBzeW1ib2wgc2hvdWxkIGJlIGltcG9ydGVkLlxuICAgKiBAcGFyYW0gdHlwZUltcG9ydCBXaGV0aGVyIHRoZSBzeW1ib2wgaXMgYSB0eXBlLlxuICAgKiBAcGFyYW0gaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMgTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCBjYW4gYmUgaWdub3JlZCB3aGVuXG4gICAqICAgIHRoZSBpbXBvcnQgbWFuYWdlciBjaGVja3MgZm9yIGltcG9ydCBjb2xsaXNpb25zLlxuICAgKi9cbiAgYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsXG4gICAgc3ltYm9sTmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBtb2R1bGVOYW1lOiBzdHJpbmcsXG4gICAgdHlwZUltcG9ydCA9IGZhbHNlLFxuICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zOiB0cy5JZGVudGlmaWVyW10gPSBbXSxcbiAgKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgY29uc3Qgc291cmNlRGlyID0gZGlybmFtZShzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICBjb25zdCBmaWxlSW1wb3J0cyA9IHRoaXMuX2FuYWx5emVJbXBvcnRzSWZOZWVkZWQoc291cmNlRmlsZSk7XG5cbiAgICBsZXQgZXhpc3RpbmdJbXBvcnQ6IEFuYWx5emVkSW1wb3J0IHwgbnVsbCA9IG51bGw7XG4gICAgZm9yIChsZXQgaW1wb3J0RGF0YSBvZiBmaWxlSW1wb3J0cykge1xuICAgICAgaWYgKCF0aGlzLl9pc01vZHVsZVNwZWNpZmllck1hdGNoaW5nKHNvdXJjZURpciwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lLCBtb2R1bGVOYW1lKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgbm8gc3ltYm9sIG5hbWUgaGFzIGJlZW4gc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCBpbXBvcnQgaXMgcmVxdWVzdGVkLiBJbiB0aGF0XG4gICAgICAvLyBjYXNlIHdlIHNlYXJjaCBmb3Igbm9uLW5hbWVzcGFjZSBhbmQgbm9uLXNwZWNpZmllciBpbXBvcnRzLlxuICAgICAgaWYgKCFzeW1ib2xOYW1lICYmICFpbXBvcnREYXRhLm5hbWVzcGFjZSAmJiAhaW1wb3J0RGF0YS5zcGVjaWZpZXJzKSB7XG4gICAgICAgIHJldHVybiB0cy5mYWN0b3J5LmNyZWF0ZUlkZW50aWZpZXIoaW1wb3J0RGF0YS5uYW1lIS50ZXh0KTtcbiAgICAgIH1cblxuICAgICAgLy8gSW4gY2FzZSBhIFwiVHlwZVwiIHN5bWJvbCBpcyBpbXBvcnRlZCwgd2UgY2FuJ3QgdXNlIG5hbWVzcGFjZSBpbXBvcnRzXG4gICAgICAvLyBiZWNhdXNlIHRoZXNlIG9ubHkgZXhwb3J0IHN5bWJvbHMgYXZhaWxhYmxlIGF0IHJ1bnRpbWUgKG5vIHR5cGVzKVxuICAgICAgaWYgKGltcG9ydERhdGEubmFtZXNwYWNlICYmICF0eXBlSW1wb3J0KSB7XG4gICAgICAgIHJldHVybiB0cy5mYWN0b3J5LmNyZWF0ZVByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihcbiAgICAgICAgICB0cy5mYWN0b3J5LmNyZWF0ZUlkZW50aWZpZXIoaW1wb3J0RGF0YS5uYW1lIS50ZXh0KSxcbiAgICAgICAgICB0cy5mYWN0b3J5LmNyZWF0ZUlkZW50aWZpZXIoc3ltYm9sTmFtZSB8fCAnZGVmYXVsdCcpLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChpbXBvcnREYXRhLnNwZWNpZmllcnMgJiYgc3ltYm9sTmFtZSkge1xuICAgICAgICBjb25zdCBleGlzdGluZ1NwZWNpZmllciA9IGltcG9ydERhdGEuc3BlY2lmaWVycy5maW5kKHMgPT5cbiAgICAgICAgICBzLnByb3BlcnR5TmFtZSA/IHMucHJvcGVydHlOYW1lLnRleHQgPT09IHN5bWJvbE5hbWUgOiBzLm5hbWUudGV4dCA9PT0gc3ltYm9sTmFtZSxcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoZXhpc3RpbmdTcGVjaWZpZXIpIHtcbiAgICAgICAgICByZXR1cm4gdHMuZmFjdG9yeS5jcmVhdGVJZGVudGlmaWVyKGV4aXN0aW5nU3BlY2lmaWVyLm5hbWUudGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbiBjYXNlIHRoZSBzeW1ib2wgY291bGQgbm90IGJlIGZvdW5kIGluIGFuIGV4aXN0aW5nIGltcG9ydCwgd2VcbiAgICAgICAgLy8ga2VlcCB0cmFjayBvZiB0aGUgaW1wb3J0IGRlY2xhcmF0aW9uIGFzIGl0IGNhbiBiZSB1cGRhdGVkIHRvIGluY2x1ZGVcbiAgICAgICAgLy8gdGhlIHNwZWNpZmllZCBzeW1ib2wgbmFtZSB3aXRob3V0IGhhdmluZyB0byBjcmVhdGUgYSBuZXcgaW1wb3J0LlxuICAgICAgICBleGlzdGluZ0ltcG9ydCA9IGltcG9ydERhdGE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gZXhpc3RpbmcgaW1wb3J0IHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIG1vZHVsZSwgd2VcbiAgICAvLyBqdXN0IHVwZGF0ZSB0aGUgaW1wb3J0IHNwZWNpZmllcnMgdG8gYWxzbyBpbXBvcnQgdGhlIHJlcXVlc3RlZCBzeW1ib2wuXG4gICAgaWYgKGV4aXN0aW5nSW1wb3J0KSB7XG4gICAgICBjb25zdCBwcm9wZXJ0eUlkZW50aWZpZXIgPSB0cy5mYWN0b3J5LmNyZWF0ZUlkZW50aWZpZXIoc3ltYm9sTmFtZSEpO1xuICAgICAgY29uc3QgZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllciA9IHRoaXMuX2dldFVuaXF1ZUlkZW50aWZpZXIoXG4gICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgIHN5bWJvbE5hbWUhLFxuICAgICAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyxcbiAgICAgICk7XG4gICAgICBjb25zdCBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPSBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyLnRleHQgIT09IHN5bWJvbE5hbWU7XG4gICAgICBjb25zdCBpbXBvcnROYW1lID0gbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllciA6IHByb3BlcnR5SWRlbnRpZmllcjtcblxuICAgICAgZXhpc3RpbmdJbXBvcnQuc3BlY2lmaWVycyEucHVzaCh7XG4gICAgICAgIG5hbWU6IGltcG9ydE5hbWUsXG4gICAgICAgIHByb3BlcnR5TmFtZTogbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gcHJvcGVydHlJZGVudGlmaWVyIDogdW5kZWZpbmVkLFxuICAgICAgfSk7XG4gICAgICBleGlzdGluZ0ltcG9ydC5zdGF0ZSB8PSBJbXBvcnRTdGF0ZS5NT0RJRklFRDtcblxuICAgICAgaWYgKGhhc0ZsYWcoZXhpc3RpbmdJbXBvcnQsIEltcG9ydFN0YXRlLkRFTEVURUQpKSB7XG4gICAgICAgIC8vIHVuc2V0IHRoZSBkZWxldGVkIGZsYWcgaWYgdGhlIGltcG9ydCBpcyBwZW5kaW5nIGRlbGV0aW9uLCBidXRcbiAgICAgICAgLy8gY2FuIG5vdyBiZSB1c2VkIGZvciB0aGUgbmV3IGltcG9ydGVkIHN5bWJvbC5cbiAgICAgICAgZXhpc3RpbmdJbXBvcnQuc3RhdGUgJj0gfkltcG9ydFN0YXRlLkRFTEVURUQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbXBvcnROYW1lO1xuICAgIH1cblxuICAgIGxldCBpZGVudGlmaWVyOiB0cy5JZGVudGlmaWVyIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IG5ld0ltcG9ydDogQW5hbHl6ZWRJbXBvcnQgfCBudWxsID0gbnVsbDtcblxuICAgIGlmIChzeW1ib2xOYW1lKSB7XG4gICAgICBjb25zdCBwcm9wZXJ0eUlkZW50aWZpZXIgPSB0cy5mYWN0b3J5LmNyZWF0ZUlkZW50aWZpZXIoc3ltYm9sTmFtZSk7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyID0gdGhpcy5fZ2V0VW5pcXVlSWRlbnRpZmllcihcbiAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgc3ltYm9sTmFtZSxcbiAgICAgICAgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMsXG4gICAgICApO1xuICAgICAgY29uc3QgbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID0gZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllci50ZXh0ICE9PSBzeW1ib2xOYW1lO1xuICAgICAgaWRlbnRpZmllciA9IG5lZWRzR2VuZXJhdGVkVW5pcXVlTmFtZSA/IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIgOiBwcm9wZXJ0eUlkZW50aWZpZXI7XG5cbiAgICAgIGNvbnN0IG5ld0ltcG9ydERlY2wgPSB0cy5mYWN0b3J5LmNyZWF0ZUltcG9ydERlY2xhcmF0aW9uKFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdHMuZmFjdG9yeS5jcmVhdGVJbXBvcnRDbGF1c2UoZmFsc2UsIHVuZGVmaW5lZCwgdHMuZmFjdG9yeS5jcmVhdGVOYW1lZEltcG9ydHMoW10pKSxcbiAgICAgICAgdHMuZmFjdG9yeS5jcmVhdGVTdHJpbmdMaXRlcmFsKG1vZHVsZU5hbWUpLFxuICAgICAgKTtcblxuICAgICAgbmV3SW1wb3J0ID0ge1xuICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICBub2RlOiBuZXdJbXBvcnREZWNsLFxuICAgICAgICBzcGVjaWZpZXJzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPyBwcm9wZXJ0eUlkZW50aWZpZXIgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBuYW1lOiBpZGVudGlmaWVyLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHN0YXRlOiBJbXBvcnRTdGF0ZS5BRERFRCxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkZW50aWZpZXIgPSB0aGlzLl9nZXRVbmlxdWVJZGVudGlmaWVyKFxuICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAnZGVmYXVsdEV4cG9ydCcsXG4gICAgICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5ld0ltcG9ydERlY2wgPSB0cy5mYWN0b3J5LmNyZWF0ZUltcG9ydERlY2xhcmF0aW9uKFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdHMuZmFjdG9yeS5jcmVhdGVJbXBvcnRDbGF1c2UoZmFsc2UsIGlkZW50aWZpZXIsIHVuZGVmaW5lZCksXG4gICAgICAgIHRzLmZhY3RvcnkuY3JlYXRlU3RyaW5nTGl0ZXJhbChtb2R1bGVOYW1lKSxcbiAgICAgICk7XG4gICAgICBuZXdJbXBvcnQgPSB7XG4gICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgIG5vZGU6IG5ld0ltcG9ydERlY2wsXG4gICAgICAgIG5hbWU6IGlkZW50aWZpZXIsXG4gICAgICAgIHN0YXRlOiBJbXBvcnRTdGF0ZS5BRERFRCxcbiAgICAgIH07XG4gICAgfVxuICAgIGZpbGVJbXBvcnRzLnB1c2gobmV3SW1wb3J0KTtcbiAgICByZXR1cm4gaWRlbnRpZmllcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSByZWNvcmRlZCBjaGFuZ2VzIGluIHRoZSB1cGRhdGUgcmVjb3JkZXJzIG9mIHRoZSBjb3JyZXNwb25kaW5nIHNvdXJjZSBmaWxlcy5cbiAgICogVGhlIGNoYW5nZXMgYXJlIGFwcGxpZWQgc2VwYXJhdGVseSBhZnRlciBhbGwgY2hhbmdlcyBoYXZlIGJlZW4gcmVjb3JkZWQgYmVjYXVzZSBvdGhlcndpc2VcbiAgICogZmlsZSBvZmZzZXRzIHdpbGwgY2hhbmdlIGFuZCB0aGUgc291cmNlIGZpbGVzIHdvdWxkIG5lZWQgdG8gYmUgcmUtcGFyc2VkIGFmdGVyIGVhY2ggY2hhbmdlLlxuICAgKi9cbiAgcmVjb3JkQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9pbXBvcnRDYWNoZS5mb3JFYWNoKChmaWxlSW1wb3J0cywgc291cmNlRmlsZSkgPT4ge1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLl9maWxlU3lzdGVtLmVkaXQodGhpcy5fZmlsZVN5c3RlbS5yZXNvbHZlKHNvdXJjZUZpbGUuZmlsZU5hbWUpKTtcbiAgICAgIGNvbnN0IGxhc3RVbm1vZGlmaWVkSW1wb3J0ID0gZmlsZUltcG9ydHNcbiAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAuZmluZChpID0+IGkuc3RhdGUgPT09IEltcG9ydFN0YXRlLlVOTU9ESUZJRUQpO1xuICAgICAgY29uc3QgaW1wb3J0U3RhcnRJbmRleCA9IGxhc3RVbm1vZGlmaWVkSW1wb3J0XG4gICAgICAgID8gdGhpcy5fZ2V0RW5kUG9zaXRpb25PZk5vZGUobGFzdFVubW9kaWZpZWRJbXBvcnQubm9kZSlcbiAgICAgICAgOiAwO1xuXG4gICAgICBmaWxlSW1wb3J0cy5mb3JFYWNoKGltcG9ydERhdGEgPT4ge1xuICAgICAgICBpZiAoaW1wb3J0RGF0YS5zdGF0ZSA9PT0gSW1wb3J0U3RhdGUuVU5NT0RJRklFRCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkRFTEVURUQpKSB7XG4gICAgICAgICAgLy8gSW1wb3J0cyB3aGljaCBkbyBub3QgZXhpc3QgaW4gc291cmNlIGZpbGUsIGNhbiBiZSBqdXN0IHNraXBwZWQgYXNcbiAgICAgICAgICAvLyB3ZSBkbyBub3QgbmVlZCBhbnkgcmVwbGFjZW1lbnQgdG8gZGVsZXRlIHRoZSBpbXBvcnQuXG4gICAgICAgICAgaWYgKCFoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkFEREVEKSkge1xuICAgICAgICAgICAgcmVjb3JkZXIucmVtb3ZlKGltcG9ydERhdGEubm9kZS5nZXRGdWxsU3RhcnQoKSwgaW1wb3J0RGF0YS5ub2RlLmdldEZ1bGxXaWR0aCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltcG9ydERhdGEuc3BlY2lmaWVycykge1xuICAgICAgICAgIGNvbnN0IG5hbWVkQmluZGluZ3MgPSBpbXBvcnREYXRhLm5vZGUuaW1wb3J0Q2xhdXNlIS5uYW1lZEJpbmRpbmdzIGFzIHRzLk5hbWVkSW1wb3J0cztcbiAgICAgICAgICBjb25zdCBpbXBvcnRTcGVjaWZpZXJzID0gaW1wb3J0RGF0YS5zcGVjaWZpZXJzLm1hcChzID0+XG4gICAgICAgICAgICB0cy5mYWN0b3J5LmNyZWF0ZUltcG9ydFNwZWNpZmllcihmYWxzZSwgcy5wcm9wZXJ0eU5hbWUsIHMubmFtZSksXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCB1cGRhdGVkQmluZGluZ3MgPSB0cy5mYWN0b3J5LnVwZGF0ZU5hbWVkSW1wb3J0cyhuYW1lZEJpbmRpbmdzLCBpbXBvcnRTcGVjaWZpZXJzKTtcblxuICAgICAgICAgIC8vIEluIGNhc2UgYW4gaW1wb3J0IGhhcyBiZWVuIGFkZGVkIG5ld2x5LCB3ZSBuZWVkIHRvIHByaW50IHRoZSB3aG9sZSBpbXBvcnRcbiAgICAgICAgICAvLyBkZWNsYXJhdGlvbiBhbmQgaW5zZXJ0IGl0IGF0IHRoZSBpbXBvcnQgc3RhcnQgaW5kZXguIE90aGVyd2lzZSwgd2UganVzdFxuICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgbmFtZWQgYmluZGluZ3MgdG8gbm90IHJlLXByaW50IHRoZSB3aG9sZSBpbXBvcnQgKHdoaWNoIGNvdWxkXG4gICAgICAgICAgLy8gY2F1c2UgdW5uZWNlc3NhcnkgZm9ybWF0dGluZyBjaGFuZ2VzKVxuICAgICAgICAgIGlmIChoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkFEREVEKSkge1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlZEltcG9ydCA9IHRzLmZhY3RvcnkudXBkYXRlSW1wb3J0RGVjbGFyYXRpb24oXG4gICAgICAgICAgICAgIGltcG9ydERhdGEubm9kZSxcbiAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIHRzLmZhY3RvcnkuY3JlYXRlSW1wb3J0Q2xhdXNlKGZhbHNlLCB1bmRlZmluZWQsIHVwZGF0ZWRCaW5kaW5ncyksXG4gICAgICAgICAgICAgIHRzLmZhY3RvcnkuY3JlYXRlU3RyaW5nTGl0ZXJhbChpbXBvcnREYXRhLm1vZHVsZU5hbWUpLFxuICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgbmV3SW1wb3J0VGV4dCA9IHRoaXMuX3ByaW50ZXIucHJpbnROb2RlKFxuICAgICAgICAgICAgICB0cy5FbWl0SGludC5VbnNwZWNpZmllZCxcbiAgICAgICAgICAgICAgdXBkYXRlZEltcG9ydCxcbiAgICAgICAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KFxuICAgICAgICAgICAgICBpbXBvcnRTdGFydEluZGV4LFxuICAgICAgICAgICAgICBpbXBvcnRTdGFydEluZGV4ID09PSAwID8gYCR7bmV3SW1wb3J0VGV4dH1cXG5gIDogYFxcbiR7bmV3SW1wb3J0VGV4dH1gLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuTU9ESUZJRUQpKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdOYW1lZEJpbmRpbmdzVGV4dCA9IHRoaXMuX3ByaW50ZXIucHJpbnROb2RlKFxuICAgICAgICAgICAgICB0cy5FbWl0SGludC5VbnNwZWNpZmllZCxcbiAgICAgICAgICAgICAgdXBkYXRlZEJpbmRpbmdzLFxuICAgICAgICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlY29yZGVyLnJlbW92ZShuYW1lZEJpbmRpbmdzLmdldFN0YXJ0KCksIG5hbWVkQmluZGluZ3MuZ2V0V2lkdGgoKSk7XG4gICAgICAgICAgICByZWNvcmRlci5pbnNlcnRSaWdodChuYW1lZEJpbmRpbmdzLmdldFN0YXJ0KCksIG5ld05hbWVkQmluZGluZ3NUZXh0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5BRERFRCkpIHtcbiAgICAgICAgICBjb25zdCBuZXdJbXBvcnRUZXh0ID0gdGhpcy5fcHJpbnRlci5wcmludE5vZGUoXG4gICAgICAgICAgICB0cy5FbWl0SGludC5VbnNwZWNpZmllZCxcbiAgICAgICAgICAgIGltcG9ydERhdGEubm9kZSxcbiAgICAgICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KFxuICAgICAgICAgICAgaW1wb3J0U3RhcnRJbmRleCxcbiAgICAgICAgICAgIGltcG9ydFN0YXJ0SW5kZXggPT09IDAgPyBgJHtuZXdJbXBvcnRUZXh0fVxcbmAgOiBgXFxuJHtuZXdJbXBvcnRUZXh0fWAsXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3ZSBzaG91bGQgbmV2ZXIgaGl0IHRoaXMsIGJ1dCB3ZSByYXRoZXIgd2FudCB0byBwcmludCBhIGN1c3RvbSBleGNlcHRpb25cbiAgICAgICAgLy8gaW5zdGVhZCBvZiBqdXN0IHNraXBwaW5nIGltcG9ydHMgc2lsZW50bHkuXG4gICAgICAgIHRocm93IEVycm9yKCdVbmV4cGVjdGVkIGltcG9ydCBtb2RpZmljYXRpb24uJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3JyZWN0cyB0aGUgbGluZSBhbmQgY2hhcmFjdGVyIHBvc2l0aW9uIG9mIGEgZ2l2ZW4gbm9kZS4gU2luY2Ugbm9kZXMgb2ZcbiAgICogc291cmNlIGZpbGVzIGFyZSBpbW11dGFibGUgYW5kIHdlIHNvbWV0aW1lcyBtYWtlIGNoYW5nZXMgdG8gdGhlIGNvbnRhaW5pbmdcbiAgICogc291cmNlIGZpbGUsIHRoZSBub2RlIHBvc2l0aW9uIG1pZ2h0IHNoaWZ0IChlLmcuIGlmIHdlIGFkZCBhIG5ldyBpbXBvcnQgYmVmb3JlKS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIHVzZWQgdG8gcmV0cmlldmUgYSBjb3JyZWN0ZWQgcG9zaXRpb24gb2YgdGhlIGdpdmVuIG5vZGUuIFRoaXNcbiAgICogaXMgaGVscGZ1bCB3aGVuIHByaW50aW5nIG91dCBlcnJvciBtZXNzYWdlcyB3aGljaCBzaG91bGQgcmVmbGVjdCB0aGUgbmV3IHN0YXRlIG9mXG4gICAqIHNvdXJjZSBmaWxlcy5cbiAgICovXG4gIGNvcnJlY3ROb2RlUG9zaXRpb24obm9kZTogdHMuTm9kZSwgb2Zmc2V0OiBudW1iZXIsIHBvc2l0aW9uOiB0cy5MaW5lQW5kQ2hhcmFjdGVyKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuXG4gICAgaWYgKCF0aGlzLl9pbXBvcnRDYWNoZS5oYXMoc291cmNlRmlsZSkpIHtcbiAgICAgIHJldHVybiBwb3NpdGlvbjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdQb3NpdGlvbjogdHMuTGluZUFuZENoYXJhY3RlciA9IHsuLi5wb3NpdGlvbn07XG4gICAgY29uc3QgZmlsZUltcG9ydHMgPSB0aGlzLl9pbXBvcnRDYWNoZS5nZXQoc291cmNlRmlsZSkhO1xuXG4gICAgZm9yIChsZXQgaW1wb3J0RGF0YSBvZiBmaWxlSW1wb3J0cykge1xuICAgICAgY29uc3QgZnVsbEVuZCA9IGltcG9ydERhdGEubm9kZS5nZXRGdWxsU3RhcnQoKSArIGltcG9ydERhdGEubm9kZS5nZXRGdWxsV2lkdGgoKTtcbiAgICAgIC8vIFN1YnRyYWN0IG9yIGFkZCBsaW5lcyBiYXNlZCBvbiB3aGV0aGVyIGFuIGltcG9ydCBoYXMgYmVlbiBkZWxldGVkIG9yIHJlbW92ZWRcbiAgICAgIC8vIGJlZm9yZSB0aGUgYWN0dWFsIG5vZGUgb2Zmc2V0LlxuICAgICAgaWYgKG9mZnNldCA+IGZ1bGxFbmQgJiYgaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5ERUxFVEVEKSkge1xuICAgICAgICBuZXdQb3NpdGlvbi5saW5lLS07XG4gICAgICB9IGVsc2UgaWYgKG9mZnNldCA+IGZ1bGxFbmQgJiYgaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5BRERFRCkpIHtcbiAgICAgICAgbmV3UG9zaXRpb24ubGluZSsrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3UG9zaXRpb247XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiB1bmlxdWUgaWRlbnRpZmllciBuYW1lIGZvciB0aGUgc3BlY2lmaWVkIHN5bWJvbCBuYW1lLlxuICAgKiBAcGFyYW0gc291cmNlRmlsZSBTb3VyY2UgZmlsZSB0byBjaGVjayBmb3IgaWRlbnRpZmllciBjb2xsaXNpb25zLlxuICAgKiBAcGFyYW0gc3ltYm9sTmFtZSBOYW1lIG9mIHRoZSBzeW1ib2wgZm9yIHdoaWNoIHdlIHdhbnQgdG8gZ2VuZXJhdGUgYW4gdW5pcXVlIG5hbWUuXG4gICAqIEBwYXJhbSBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHNob3VsZCBiZSBpZ25vcmVkIHdoZW5cbiAgICogICAgY2hlY2tpbmcgZm9yIGlkZW50aWZpZXIgY29sbGlzaW9ucyBpbiB0aGUgZ2l2ZW4gc291cmNlIGZpbGUuXG4gICAqL1xuICBwcml2YXRlIF9nZXRVbmlxdWVJZGVudGlmaWVyKFxuICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsXG4gICAgc3ltYm9sTmFtZTogc3RyaW5nLFxuICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zOiB0cy5JZGVudGlmaWVyW10sXG4gICk6IHRzLklkZW50aWZpZXIge1xuICAgIGlmICh0aGlzLl9pc1VuaXF1ZUlkZW50aWZpZXJOYW1lKHNvdXJjZUZpbGUsIHN5bWJvbE5hbWUsIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zKSkge1xuICAgICAgdGhpcy5fcmVjb3JkVXNlZElkZW50aWZpZXIoc291cmNlRmlsZSwgc3ltYm9sTmFtZSk7XG4gICAgICByZXR1cm4gdHMuZmFjdG9yeS5jcmVhdGVJZGVudGlmaWVyKHN5bWJvbE5hbWUpO1xuICAgIH1cblxuICAgIGxldCBuYW1lOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgY291bnRlciA9IDE7XG4gICAgZG8ge1xuICAgICAgbmFtZSA9IGAke3N5bWJvbE5hbWV9XyR7Y291bnRlcisrfWA7XG4gICAgfSB3aGlsZSAoIXRoaXMuX2lzVW5pcXVlSWRlbnRpZmllck5hbWUoc291cmNlRmlsZSwgbmFtZSwgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMpKTtcblxuICAgIHRoaXMuX3JlY29yZFVzZWRJZGVudGlmaWVyKHNvdXJjZUZpbGUsIG5hbWUhKTtcbiAgICByZXR1cm4gdHMuZmFjdG9yeS5jcmVhdGVJZGVudGlmaWVyKG5hbWUhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgc3BlY2lmaWVkIGlkZW50aWZpZXIgbmFtZSBpcyB1c2VkIHdpdGhpbiB0aGUgZ2l2ZW4gc291cmNlIGZpbGUuXG4gICAqIEBwYXJhbSBzb3VyY2VGaWxlIFNvdXJjZSBmaWxlIHRvIGNoZWNrIGZvciBpZGVudGlmaWVyIGNvbGxpc2lvbnMuXG4gICAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGlkZW50aWZpZXIgd2hpY2ggaXMgY2hlY2tlZCBmb3IgaXRzIHVuaXF1ZW5lc3MuXG4gICAqIEBwYXJhbSBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHNob3VsZCBiZSBpZ25vcmVkIHdoZW5cbiAgICogICAgY2hlY2tpbmcgZm9yIGlkZW50aWZpZXIgY29sbGlzaW9ucyBpbiB0aGUgZ2l2ZW4gc291cmNlIGZpbGUuXG4gICAqL1xuICBwcml2YXRlIF9pc1VuaXF1ZUlkZW50aWZpZXJOYW1lKFxuICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zOiB0cy5JZGVudGlmaWVyW10sXG4gICkge1xuICAgIGlmIChcbiAgICAgIHRoaXMuX3VzZWRJZGVudGlmaWVyTmFtZXMuaGFzKHNvdXJjZUZpbGUpICYmXG4gICAgICB0aGlzLl91c2VkSWRlbnRpZmllck5hbWVzLmdldChzb3VyY2VGaWxlKSEuaW5kZXhPZihuYW1lKSAhPT0gLTFcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBXYWxrIHRocm91Z2ggdGhlIHNvdXJjZSBmaWxlIGFuZCBzZWFyY2ggZm9yIGFuIGlkZW50aWZpZXIgbWF0Y2hpbmdcbiAgICAvLyB0aGUgZ2l2ZW4gbmFtZS4gSW4gdGhhdCBjYXNlLCBpdCdzIG5vdCBndWFyYW50ZWVkIHRoYXQgdGhpcyBuYW1lXG4gICAgLy8gaXMgdW5pcXVlIGluIHRoZSBnaXZlbiBkZWNsYXJhdGlvbiBzY29wZSBhbmQgd2UganVzdCByZXR1cm4gZmFsc2UuXG4gICAgY29uc3Qgbm9kZVF1ZXVlOiB0cy5Ob2RlW10gPSBbc291cmNlRmlsZV07XG4gICAgd2hpbGUgKG5vZGVRdWV1ZS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBub2RlUXVldWUuc2hpZnQoKSE7XG4gICAgICBpZiAoXG4gICAgICAgIHRzLmlzSWRlbnRpZmllcihub2RlKSAmJlxuICAgICAgICBub2RlLnRleHQgPT09IG5hbWUgJiZcbiAgICAgICAgIWlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zLmluY2x1ZGVzKG5vZGUpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgbm9kZVF1ZXVlLnB1c2goLi4ubm9kZS5nZXRDaGlsZHJlbigpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmVjb3JkcyB0aGF0IHRoZSBnaXZlbiBpZGVudGlmaWVyIGlzIHVzZWQgd2l0aGluIHRoZSBzcGVjaWZpZWQgc291cmNlIGZpbGUuIFRoaXNcbiAgICogaXMgbmVjZXNzYXJ5IHNpbmNlIHdlIGRvIG5vdCBhcHBseSBjaGFuZ2VzIHRvIHNvdXJjZSBmaWxlcyBwZXIgY2hhbmdlLCBidXQgc3RpbGxcbiAgICogd2FudCB0byBhdm9pZCBjb25mbGljdHMgd2l0aCBuZXdseSBpbXBvcnRlZCBzeW1ib2xzLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVjb3JkVXNlZElkZW50aWZpZXIoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgaWRlbnRpZmllck5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuX3VzZWRJZGVudGlmaWVyTmFtZXMuc2V0KFxuICAgICAgc291cmNlRmlsZSxcbiAgICAgICh0aGlzLl91c2VkSWRlbnRpZmllck5hbWVzLmdldChzb3VyY2VGaWxlKSB8fCBbXSkuY29uY2F0KGlkZW50aWZpZXJOYW1lKSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgdGhlIGZ1bGwgZW5kIG9mIGEgZ2l2ZW4gbm9kZS4gQnkgZGVmYXVsdCB0aGUgZW5kIHBvc2l0aW9uIG9mIGEgbm9kZSBpc1xuICAgKiBiZWZvcmUgYWxsIHRyYWlsaW5nIGNvbW1lbnRzLiBUaGlzIGNvdWxkIG1lYW4gdGhhdCBnZW5lcmF0ZWQgaW1wb3J0cyBzaGlmdCBjb21tZW50cy5cbiAgICovXG4gIHByaXZhdGUgX2dldEVuZFBvc2l0aW9uT2ZOb2RlKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBjb25zdCBub2RlRW5kUG9zID0gbm9kZS5nZXRFbmQoKTtcbiAgICBjb25zdCBjb21tZW50UmFuZ2VzID0gdHMuZ2V0VHJhaWxpbmdDb21tZW50UmFuZ2VzKG5vZGUuZ2V0U291cmNlRmlsZSgpLnRleHQsIG5vZGVFbmRQb3MpO1xuICAgIGlmICghY29tbWVudFJhbmdlcyB8fCAhY29tbWVudFJhbmdlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBub2RlRW5kUG9zO1xuICAgIH1cbiAgICByZXR1cm4gY29tbWVudFJhbmdlc1tjb21tZW50UmFuZ2VzLmxlbmd0aCAtIDFdIS5lbmQ7XG4gIH1cbn1cbiJdfQ==