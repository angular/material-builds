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
        define("@angular/material/schematics/ng-update/migrations/hammer-gestures-v9/import-manager", ["require", "exports", "path", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                path_1.resolve(basePath, specifier) === path_1.resolve(basePath, moduleName) :
                specifier === moduleName;
        }
        /** Deletes a given named binding import from the specified source file. */
        deleteNamedBindingImport(sourceFile, symbolName, moduleName) {
            const sourceDir = path_1.dirname(sourceFile.fileName);
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
            const sourceDir = path_1.dirname(sourceFile.fileName);
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
                const recorder = this._fileSystem.edit(sourceFile.fileName);
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
            const newPosition = Object.assign({}, position);
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9oYW1tZXItZ2VzdHVyZXMtdjkvaW1wb3J0LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFHSCwrQkFBc0M7SUFDdEMsaUNBQWlDO0lBNEJqQyx1RUFBdUU7SUFDdkUsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFvQixFQUFFLElBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFdkY7Ozs7T0FJRztJQUNILE1BQWEsYUFBYTtRQU94QixZQUNZLFdBQXVCLEVBQ3ZCLFFBQW9CO1lBRHBCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1lBQ3ZCLGFBQVEsR0FBUixRQUFRLENBQVk7WUFSaEMsc0VBQXNFO1lBQzlELHlCQUFvQixHQUFHLElBQUksR0FBRyxFQUEyQixDQUFDO1lBRWxFLHNEQUFzRDtZQUM5QyxpQkFBWSxHQUFHLElBQUksR0FBRyxFQUFtQyxDQUFDO1FBSS9CLENBQUM7UUFFcEM7Ozs7O1dBS0c7UUFDSyx1QkFBdUIsQ0FBQyxVQUF5QjtZQUN2RCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUNyQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBRSxDQUFDO2FBQzNDO1lBRUQsTUFBTSxNQUFNLEdBQXFCLEVBQUUsQ0FBQztZQUNwQyxLQUFLLElBQUksSUFBSSxJQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENB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QUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN6RixJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtnQkFDM0MsT0FBTyxVQUFVLENBQUM7YUFDbkI7WUFDRCxPQUFPLGFBQWEsQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxDQUFDLEdBQUcsQ0FBQztRQUN0RCxDQUFDO0tBQ0Y7SUFoYUQsc0NBZ2FDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RmlsZVN5c3RlbX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtkaXJuYW1lLCByZXNvbHZlfSBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlXG5cbi8qKiBFbnVtIGRlc2NyaWJpbmcgdGhlIHBvc3NpYmxlIHN0YXRlcyBvZiBhbiBhbmFseXplZCBpbXBvcnQuICovXG5jb25zdCBlbnVtIEltcG9ydFN0YXRlIHtcbiAgVU5NT0RJRklFRCA9IDBiMCxcbiAgTU9ESUZJRUQgPSAwYjEwLFxuICBBRERFRCA9IDBiMTAwLFxuICBERUxFVEVEID0gMGIxMDAwLFxufVxuXG4vKiogSW50ZXJmYWNlIGRlc2NyaWJpbmcgYW4gaW1wb3J0IHNwZWNpZmllci4gKi9cbmludGVyZmFjZSBJbXBvcnRTcGVjaWZpZXIge1xuICBuYW1lOiB0cy5JZGVudGlmaWVyO1xuICBwcm9wZXJ0eU5hbWU/OiB0cy5JZGVudGlmaWVyO1xufVxuXG4vKiogSW50ZXJmYWNlIGRlc2NyaWJpbmcgYW4gYW5hbHl6ZWQgaW1wb3J0LiAqL1xuaW50ZXJmYWNlIEFuYWx5emVkSW1wb3J0IHtcbiAgbm9kZTogdHMuSW1wb3J0RGVjbGFyYXRpb247XG4gIG1vZHVsZU5hbWU6IHN0cmluZztcbiAgbmFtZT86IHRzLklkZW50aWZpZXI7XG4gIHNwZWNpZmllcnM/OiBJbXBvcnRTcGVjaWZpZXJbXTtcbiAgbmFtZXNwYWNlPzogYm9vbGVhbjtcbiAgc3RhdGU6IEltcG9ydFN0YXRlO1xufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgYW4gYW5hbHl6ZWQgaW1wb3J0IGhhcyB0aGUgZ2l2ZW4gaW1wb3J0IGZsYWcgc2V0LiAqL1xuY29uc3QgaGFzRmxhZyA9IChkYXRhOiBBbmFseXplZEltcG9ydCwgZmxhZzogSW1wb3J0U3RhdGUpID0+IChkYXRhLnN0YXRlICYgZmxhZykgIT09IDA7XG5cbi8qKlxuICogSW1wb3J0IG1hbmFnZXIgdGhhdCBjYW4gYmUgdXNlZCB0byBhZGQgb3IgcmVtb3ZlIFR5cGVTY3JpcHQgaW1wb3J0cyB3aXRoaW4gc291cmNlXG4gKiBmaWxlcy4gVGhlIG1hbmFnZXIgZW5zdXJlcyB0aGF0IG11bHRpcGxlIHRyYW5zZm9ybWF0aW9ucyBhcmUgYXBwbGllZCBwcm9wZXJseVxuICogd2l0aG91dCBzaGlmdGVkIG9mZnNldHMgYW5kIHRoYXQgZXhpc3RpbmcgaW1wb3J0cyBhcmUgcmUtdXNlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIEltcG9ydE1hbmFnZXIge1xuICAvKiogTWFwIG9mIHNvdXJjZS1maWxlcyBhbmQgdGhlaXIgcHJldmlvdXNseSB1c2VkIGlkZW50aWZpZXIgbmFtZXMuICovXG4gIHByaXZhdGUgX3VzZWRJZGVudGlmaWVyTmFtZXMgPSBuZXcgTWFwPHRzLlNvdXJjZUZpbGUsIHN0cmluZ1tdPigpO1xuXG4gIC8qKiBNYXAgb2Ygc291cmNlIGZpbGVzIGFuZCB0aGVpciBhbmFseXplZCBpbXBvcnRzLiAqL1xuICBwcml2YXRlIF9pbXBvcnRDYWNoZSA9IG5ldyBNYXA8dHMuU291cmNlRmlsZSwgQW5hbHl6ZWRJbXBvcnRbXT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2ZpbGVTeXN0ZW06IEZpbGVTeXN0ZW0sXG4gICAgICBwcml2YXRlIF9wcmludGVyOiB0cy5QcmludGVyKSB7fVxuXG4gIC8qKlxuICAgKiBBbmFseXplcyB0aGUgaW1wb3J0IG9mIHRoZSBzcGVjaWZpZWQgc291cmNlIGZpbGUgaWYgbmVlZGVkLiBJbiBvcmRlciB0byBwZXJmb3JtXG4gICAqIG1vZGlmaWNhdGlvbnMgdG8gaW1wb3J0cyBvZiBhIHNvdXJjZSBmaWxlLCB3ZSBzdG9yZSBhbGwgaW1wb3J0cyBpbiBtZW1vcnkgYW5kXG4gICAqIHVwZGF0ZSB0aGUgc291cmNlIGZpbGUgb25jZSBhbGwgY2hhbmdlcyBoYXZlIGJlZW4gbWFkZS4gVGhpcyBpcyBlc3NlbnRpYWwgdG9cbiAgICogZW5zdXJlIHRoYXQgd2UgY2FuIHJlLXVzZSBuZXdseSBhZGRlZCBpbXBvcnRzIGFuZCBub3QgYnJlYWsgZmlsZSBvZmZzZXRzLlxuICAgKi9cbiAgcHJpdmF0ZSBfYW5hbHl6ZUltcG9ydHNJZk5lZWRlZChzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogQW5hbHl6ZWRJbXBvcnRbXSB7XG4gICAgaWYgKHRoaXMuX2ltcG9ydENhY2hlLmhhcyhzb3VyY2VGaWxlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2ltcG9ydENhY2hlLmdldChzb3VyY2VGaWxlKSE7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0OiBBbmFseXplZEltcG9ydFtdID0gW107XG4gICAgZm9yIChsZXQgbm9kZSBvZiBzb3VyY2VGaWxlLnN0YXRlbWVudHMpIHtcbiAgICAgIGlmICghdHMuaXNJbXBvcnREZWNsYXJhdGlvbihub2RlKSB8fCAhdHMuaXNTdHJpbmdMaXRlcmFsKG5vZGUubW9kdWxlU3BlY2lmaWVyKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbW9kdWxlTmFtZSA9IG5vZGUubW9kdWxlU3BlY2lmaWVyLnRleHQ7XG5cbiAgICAgIC8vIEhhbmRsZXMgc2lkZS1lZmZlY3QgaW1wb3J0cyB3aGljaCBkbyBuZWl0aGVyIGhhdmUgYSBuYW1lIG9yXG4gICAgICAvLyBzcGVjaWZpZXJzLiBlLmcuIGBpbXBvcnQgXCJteS1wYWNrYWdlXCI7YFxuICAgICAgaWYgKCFub2RlLmltcG9ydENsYXVzZSkge1xuICAgICAgICByZXN1bHQucHVzaCh7bW9kdWxlTmFtZSwgbm9kZSwgc3RhdGU6IEltcG9ydFN0YXRlLlVOTU9ESUZJRUR9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZXMgaW1wb3J0cyByZXNvbHZpbmcgdG8gZGVmYXVsdCBleHBvcnRzIG9mIGEgbW9kdWxlLlxuICAgICAgLy8gZS5nLiBgaW1wb3J0IG1vbWVudCBmcm9tIFwibW9tZW50XCI7YFxuICAgICAgaWYgKCFub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKFxuICAgICAgICAgICAge21vZHVsZU5hbWUsIG5vZGUsIG5hbWU6IG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWUsIHN0YXRlOiBJbXBvcnRTdGF0ZS5VTk1PRElGSUVEfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGVzIGltcG9ydHMgd2l0aCBpbmRpdmlkdWFsIHN5bWJvbCBzcGVjaWZpZXJzLlxuICAgICAgLy8gZS5nLiBgaW1wb3J0IHtBLCBCLCBDfSBmcm9tIFwibXktbW9kdWxlXCI7YFxuICAgICAgaWYgKHRzLmlzTmFtZWRJbXBvcnRzKG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgc3BlY2lmaWVyczogbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cy5tYXAoXG4gICAgICAgICAgICAgIGVsID0+ICh7bmFtZTogZWwubmFtZSwgcHJvcGVydHlOYW1lOiBlbC5wcm9wZXJ0eU5hbWV9KSksXG4gICAgICAgICAgc3RhdGU6IEltcG9ydFN0YXRlLlVOTU9ESUZJRUQsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSGFuZGxlcyBuYW1lc3BhY2VkIGltcG9ydHMuIGUuZy4gYGltcG9ydCAqIGFzIGNvcmUgZnJvbSBcIm15LXBrZ1wiO2BcbiAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBuYW1lOiBub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzLm5hbWUsXG4gICAgICAgICAgbmFtZXNwYWNlOiB0cnVlLFxuICAgICAgICAgIHN0YXRlOiBJbXBvcnRTdGF0ZS5VTk1PRElGSUVELFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5faW1wb3J0Q2FjaGUuc2V0KHNvdXJjZUZpbGUsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gc3BlY2lmaWVyLCB3aGljaCBjYW4gYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgcGF0aCxcbiAgICogbWF0Y2hlcyB0aGUgcGFzc2VkIG1vZHVsZSBuYW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBfaXNNb2R1bGVTcGVjaWZpZXJNYXRjaGluZyhiYXNlUGF0aDogc3RyaW5nLCBzcGVjaWZpZXI6IHN0cmluZywgbW9kdWxlTmFtZTogc3RyaW5nKTpcbiAgICAgIGJvb2xlYW4ge1xuICAgIHJldHVybiBzcGVjaWZpZXIuc3RhcnRzV2l0aCgnLicpID9cbiAgICAgICAgcmVzb2x2ZShiYXNlUGF0aCwgc3BlY2lmaWVyKSA9PT0gcmVzb2x2ZShiYXNlUGF0aCwgbW9kdWxlTmFtZSkgOlxuICAgICAgICBzcGVjaWZpZXIgPT09IG1vZHVsZU5hbWU7XG4gIH1cblxuICAvKiogRGVsZXRlcyBhIGdpdmVuIG5hbWVkIGJpbmRpbmcgaW1wb3J0IGZyb20gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS4gKi9cbiAgZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIHN5bWJvbE5hbWU6IHN0cmluZywgbW9kdWxlTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgc291cmNlRGlyID0gZGlybmFtZShzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICBjb25zdCBmaWxlSW1wb3J0cyA9IHRoaXMuX2FuYWx5emVJbXBvcnRzSWZOZWVkZWQoc291cmNlRmlsZSk7XG5cbiAgICBmb3IgKGxldCBpbXBvcnREYXRhIG9mIGZpbGVJbXBvcnRzKSB7XG4gICAgICBpZiAoIXRoaXMuX2lzTW9kdWxlU3BlY2lmaWVyTWF0Y2hpbmcoc291cmNlRGlyLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUsIG1vZHVsZU5hbWUpIHx8XG4gICAgICAgICAgIWltcG9ydERhdGEuc3BlY2lmaWVycykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3BlY2lmaWVySW5kZXggPVxuICAgICAgICAgIGltcG9ydERhdGEuc3BlY2lmaWVycy5maW5kSW5kZXgoZCA9PiAoZC5wcm9wZXJ0eU5hbWUgfHwgZC5uYW1lKS50ZXh0ID09PSBzeW1ib2xOYW1lKTtcbiAgICAgIGlmIChzcGVjaWZpZXJJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgaW1wb3J0RGF0YS5zcGVjaWZpZXJzLnNwbGljZShzcGVjaWZpZXJJbmRleCwgMSk7XG4gICAgICAgIC8vIGlmIHRoZSBpbXBvcnQgZG9lcyBubyBsb25nZXIgY29udGFpbiBhbnkgc3BlY2lmaWVycyBhZnRlciB0aGUgcmVtb3ZhbCBvZiB0aGVcbiAgICAgICAgLy8gZ2l2ZW4gc3ltYm9sLCB3ZSBjYW4ganVzdCBtYXJrIHRoZSB3aG9sZSBpbXBvcnQgZm9yIGRlbGV0aW9uLiBPdGhlcndpc2UsIHdlIG1hcmtcbiAgICAgICAgLy8gaXQgYXMgbW9kaWZpZWQgc28gdGhhdCBpdCB3aWxsIGJlIHJlLXByaW50ZWQuXG4gICAgICAgIGlmIChpbXBvcnREYXRhLnNwZWNpZmllcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgaW1wb3J0RGF0YS5zdGF0ZSB8PSBJbXBvcnRTdGF0ZS5ERUxFVEVEO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGltcG9ydERhdGEuc3RhdGUgfD0gSW1wb3J0U3RhdGUuTU9ESUZJRUQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogRGVsZXRlcyB0aGUgaW1wb3J0IHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW4gaW1wb3J0IGRlY2xhcmF0aW9uIGlmIGZvdW5kLiAqL1xuICBkZWxldGVJbXBvcnRCeURlY2xhcmF0aW9uKGRlY2xhcmF0aW9uOiB0cy5JbXBvcnREZWNsYXJhdGlvbikge1xuICAgIGNvbnN0IGZpbGVJbXBvcnRzID0gdGhpcy5fYW5hbHl6ZUltcG9ydHNJZk5lZWRlZChkZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCkpO1xuICAgIGZvciAobGV0IGltcG9ydERhdGEgb2YgZmlsZUltcG9ydHMpIHtcbiAgICAgIGlmIChpbXBvcnREYXRhLm5vZGUgPT09IGRlY2xhcmF0aW9uKSB7XG4gICAgICAgIGltcG9ydERhdGEuc3RhdGUgfD0gSW1wb3J0U3RhdGUuREVMRVRFRDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBpbXBvcnQgdG8gdGhlIGdpdmVuIHNvdXJjZSBmaWxlIGFuZCByZXR1cm5zIHRoZSBUeXBlU2NyaXB0IGV4cHJlc3Npb24gdGhhdFxuICAgKiBjYW4gYmUgdXNlZCB0byBhY2Nlc3MgdGhlIG5ld2x5IGltcG9ydGVkIHN5bWJvbC5cbiAgICpcbiAgICogV2hlbmV2ZXIgYW4gaW1wb3J0IGlzIGFkZGVkIHRvIGEgc291cmNlIGZpbGUsIGl0J3MgcmVjb21tZW5kZWQgdGhhdCB0aGUgcmV0dXJuZWRcbiAgICogZXhwcmVzc2lvbiBpcyB1c2VkIHRvIHJlZmVyZW5jZSB0aCBzeW1ib2wuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2UgdGhlIHN5bWJvbFxuICAgKiBjb3VsZCBiZSBhbGlhc2VkIGlmIGl0IHdvdWxkIGNvbGxpZGUgd2l0aCBleGlzdGluZyBpbXBvcnRzIGluIHNvdXJjZSBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0gc291cmNlRmlsZSBTb3VyY2UgZmlsZSB0byB3aGljaCB0aGUgaW1wb3J0IHNob3VsZCBiZSBhZGRlZC5cbiAgICogQHBhcmFtIHN5bWJvbE5hbWUgTmFtZSBvZiB0aGUgc3ltYm9sIHRoYXQgc2hvdWxkIGJlIGltcG9ydGVkLiBDYW4gYmUgbnVsbCBpZlxuICAgKiAgICB0aGUgZGVmYXVsdCBleHBvcnQgaXMgcmVxdWVzdGVkLlxuICAgKiBAcGFyYW0gbW9kdWxlTmFtZSBOYW1lIG9mIHRoZSBtb2R1bGUgb2Ygd2hpY2ggdGhlIHN5bWJvbCBzaG91bGQgYmUgaW1wb3J0ZWQuXG4gICAqIEBwYXJhbSB0eXBlSW1wb3J0IFdoZXRoZXIgdGhlIHN5bWJvbCBpcyBhIHR5cGUuXG4gICAqIEBwYXJhbSBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIGNhbiBiZSBpZ25vcmVkIHdoZW5cbiAgICogICAgdGhlIGltcG9ydCBtYW5hZ2VyIGNoZWNrcyBmb3IgaW1wb3J0IGNvbGxpc2lvbnMuXG4gICAqL1xuICBhZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCBzeW1ib2xOYW1lOiBzdHJpbmd8bnVsbCwgbW9kdWxlTmFtZTogc3RyaW5nLCB0eXBlSW1wb3J0ID0gZmFsc2UsXG4gICAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9uczogdHMuSWRlbnRpZmllcltdID0gW10pOiB0cy5FeHByZXNzaW9uIHtcbiAgICBjb25zdCBzb3VyY2VEaXIgPSBkaXJuYW1lKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IGZpbGVJbXBvcnRzID0gdGhpcy5fYW5hbHl6ZUltcG9ydHNJZk5lZWRlZChzb3VyY2VGaWxlKTtcblxuICAgIGxldCBleGlzdGluZ0ltcG9ydDogQW5hbHl6ZWRJbXBvcnR8bnVsbCA9IG51bGw7XG4gICAgZm9yIChsZXQgaW1wb3J0RGF0YSBvZiBmaWxlSW1wb3J0cykge1xuICAgICAgaWYgKCF0aGlzLl9pc01vZHVsZVNwZWNpZmllck1hdGNoaW5nKHNvdXJjZURpciwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lLCBtb2R1bGVOYW1lKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgbm8gc3ltYm9sIG5hbWUgaGFzIGJlZW4gc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCBpbXBvcnQgaXMgcmVxdWVzdGVkLiBJbiB0aGF0XG4gICAgICAvLyBjYXNlIHdlIHNlYXJjaCBmb3Igbm9uLW5hbWVzcGFjZSBhbmQgbm9uLXNwZWNpZmllciBpbXBvcnRzLlxuICAgICAgaWYgKCFzeW1ib2xOYW1lICYmICFpbXBvcnREYXRhLm5hbWVzcGFjZSAmJiAhaW1wb3J0RGF0YS5zcGVjaWZpZXJzKSB7XG4gICAgICAgIHJldHVybiB0cy5jcmVhdGVJZGVudGlmaWVyKGltcG9ydERhdGEubmFtZSEudGV4dCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEluIGNhc2UgYSBcIlR5cGVcIiBzeW1ib2wgaXMgaW1wb3J0ZWQsIHdlIGNhbid0IHVzZSBuYW1lc3BhY2UgaW1wb3J0c1xuICAgICAgLy8gYmVjYXVzZSB0aGVzZSBvbmx5IGV4cG9ydCBzeW1ib2xzIGF2YWlsYWJsZSBhdCBydW50aW1lIChubyB0eXBlcylcbiAgICAgIGlmIChpbXBvcnREYXRhLm5hbWVzcGFjZSAmJiAhdHlwZUltcG9ydCkge1xuICAgICAgICByZXR1cm4gdHMuY3JlYXRlUHJvcGVydHlBY2Nlc3MoXG4gICAgICAgICAgICB0cy5jcmVhdGVJZGVudGlmaWVyKGltcG9ydERhdGEubmFtZSEudGV4dCksXG4gICAgICAgICAgICB0cy5jcmVhdGVJZGVudGlmaWVyKHN5bWJvbE5hbWUgfHwgJ2RlZmF1bHQnKSk7XG4gICAgICB9IGVsc2UgaWYgKGltcG9ydERhdGEuc3BlY2lmaWVycyAmJiBzeW1ib2xOYW1lKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nU3BlY2lmaWVyID0gaW1wb3J0RGF0YS5zcGVjaWZpZXJzLmZpbmQoXG4gICAgICAgICAgICBzID0+IHMucHJvcGVydHlOYW1lID8gcy5wcm9wZXJ0eU5hbWUudGV4dCA9PT0gc3ltYm9sTmFtZSA6IHMubmFtZS50ZXh0ID09PSBzeW1ib2xOYW1lKTtcblxuICAgICAgICBpZiAoZXhpc3RpbmdTcGVjaWZpZXIpIHtcbiAgICAgICAgICByZXR1cm4gdHMuY3JlYXRlSWRlbnRpZmllcihleGlzdGluZ1NwZWNpZmllci5uYW1lLnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW4gY2FzZSB0aGUgc3ltYm9sIGNvdWxkIG5vdCBiZSBmb3VuZCBpbiBhbiBleGlzdGluZyBpbXBvcnQsIHdlXG4gICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgdGhlIGltcG9ydCBkZWNsYXJhdGlvbiBhcyBpdCBjYW4gYmUgdXBkYXRlZCB0byBpbmNsdWRlXG4gICAgICAgIC8vIHRoZSBzcGVjaWZpZWQgc3ltYm9sIG5hbWUgd2l0aG91dCBoYXZpbmcgdG8gY3JlYXRlIGEgbmV3IGltcG9ydC5cbiAgICAgICAgZXhpc3RpbmdJbXBvcnQgPSBpbXBvcnREYXRhO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGlzIGFuIGV4aXN0aW5nIGltcG9ydCB0aGF0IG1hdGNoZXMgdGhlIHNwZWNpZmllZCBtb2R1bGUsIHdlXG4gICAgLy8ganVzdCB1cGRhdGUgdGhlIGltcG9ydCBzcGVjaWZpZXJzIHRvIGFsc28gaW1wb3J0IHRoZSByZXF1ZXN0ZWQgc3ltYm9sLlxuICAgIGlmIChleGlzdGluZ0ltcG9ydCkge1xuICAgICAgY29uc3QgcHJvcGVydHlJZGVudGlmaWVyID0gdHMuY3JlYXRlSWRlbnRpZmllcihzeW1ib2xOYW1lISk7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyID1cbiAgICAgICAgICB0aGlzLl9nZXRVbmlxdWVJZGVudGlmaWVyKHNvdXJjZUZpbGUsIHN5bWJvbE5hbWUhLCBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyk7XG4gICAgICBjb25zdCBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPSBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyLnRleHQgIT09IHN5bWJvbE5hbWU7XG4gICAgICBjb25zdCBpbXBvcnROYW1lID0gbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllciA6IHByb3BlcnR5SWRlbnRpZmllcjtcblxuICAgICAgZXhpc3RpbmdJbXBvcnQuc3BlY2lmaWVycyEucHVzaCh7XG4gICAgICAgIG5hbWU6IGltcG9ydE5hbWUsXG4gICAgICAgIHByb3BlcnR5TmFtZTogbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gcHJvcGVydHlJZGVudGlmaWVyIDogdW5kZWZpbmVkLFxuICAgICAgfSk7XG4gICAgICBleGlzdGluZ0ltcG9ydC5zdGF0ZSB8PSBJbXBvcnRTdGF0ZS5NT0RJRklFRDtcblxuICAgICAgaWYgKGhhc0ZsYWcoZXhpc3RpbmdJbXBvcnQsIEltcG9ydFN0YXRlLkRFTEVURUQpKSB7XG4gICAgICAgIC8vIHVuc2V0IHRoZSBkZWxldGVkIGZsYWcgaWYgdGhlIGltcG9ydCBpcyBwZW5kaW5nIGRlbGV0aW9uLCBidXRcbiAgICAgICAgLy8gY2FuIG5vdyBiZSB1c2VkIGZvciB0aGUgbmV3IGltcG9ydGVkIHN5bWJvbC5cbiAgICAgICAgZXhpc3RpbmdJbXBvcnQuc3RhdGUgJj0gfkltcG9ydFN0YXRlLkRFTEVURUQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbXBvcnROYW1lO1xuICAgIH1cblxuICAgIGxldCBpZGVudGlmaWVyOiB0cy5JZGVudGlmaWVyfG51bGwgPSBudWxsO1xuICAgIGxldCBuZXdJbXBvcnQ6IEFuYWx5emVkSW1wb3J0fG51bGwgPSBudWxsO1xuXG4gICAgaWYgKHN5bWJvbE5hbWUpIHtcbiAgICAgIGNvbnN0IHByb3BlcnR5SWRlbnRpZmllciA9IHRzLmNyZWF0ZUlkZW50aWZpZXIoc3ltYm9sTmFtZSk7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyID1cbiAgICAgICAgICB0aGlzLl9nZXRVbmlxdWVJZGVudGlmaWVyKHNvdXJjZUZpbGUsIHN5bWJvbE5hbWUsIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zKTtcbiAgICAgIGNvbnN0IG5lZWRzR2VuZXJhdGVkVW5pcXVlTmFtZSA9IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIudGV4dCAhPT0gc3ltYm9sTmFtZTtcbiAgICAgIGlkZW50aWZpZXIgPSBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPyBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyIDogcHJvcGVydHlJZGVudGlmaWVyO1xuXG4gICAgICBjb25zdCBuZXdJbXBvcnREZWNsID0gdHMuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb24oXG4gICAgICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRzLmNyZWF0ZUltcG9ydENsYXVzZSh1bmRlZmluZWQsIHRzLmNyZWF0ZU5hbWVkSW1wb3J0cyhbXSkpLFxuICAgICAgICAgIHRzLmNyZWF0ZVN0cmluZ0xpdGVyYWwobW9kdWxlTmFtZSkpO1xuXG4gICAgICBuZXdJbXBvcnQgPSB7XG4gICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgIG5vZGU6IG5ld0ltcG9ydERlY2wsXG4gICAgICAgIHNwZWNpZmllcnM6IFt7XG4gICAgICAgICAgcHJvcGVydHlOYW1lOiBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPyBwcm9wZXJ0eUlkZW50aWZpZXIgOiB1bmRlZmluZWQsXG4gICAgICAgICAgbmFtZTogaWRlbnRpZmllclxuICAgICAgICB9XSxcbiAgICAgICAgc3RhdGU6IEltcG9ydFN0YXRlLkFEREVELFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWRlbnRpZmllciA9XG4gICAgICAgICAgdGhpcy5fZ2V0VW5pcXVlSWRlbnRpZmllcihzb3VyY2VGaWxlLCAnZGVmYXVsdEV4cG9ydCcsIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zKTtcbiAgICAgIGNvbnN0IG5ld0ltcG9ydERlY2wgPSB0cy5jcmVhdGVJbXBvcnREZWNsYXJhdGlvbihcbiAgICAgICAgICB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdHMuY3JlYXRlSW1wb3J0Q2xhdXNlKGlkZW50aWZpZXIsIHVuZGVmaW5lZCksXG4gICAgICAgICAgdHMuY3JlYXRlU3RyaW5nTGl0ZXJhbChtb2R1bGVOYW1lKSk7XG4gICAgICBuZXdJbXBvcnQgPSB7XG4gICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgIG5vZGU6IG5ld0ltcG9ydERlY2wsXG4gICAgICAgIG5hbWU6IGlkZW50aWZpZXIsXG4gICAgICAgIHN0YXRlOiBJbXBvcnRTdGF0ZS5BRERFRCxcbiAgICAgIH07XG4gICAgfVxuICAgIGZpbGVJbXBvcnRzLnB1c2gobmV3SW1wb3J0KTtcbiAgICByZXR1cm4gaWRlbnRpZmllcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSByZWNvcmRlZCBjaGFuZ2VzIGluIHRoZSB1cGRhdGUgcmVjb3JkZXJzIG9mIHRoZSBjb3JyZXNwb25kaW5nIHNvdXJjZSBmaWxlcy5cbiAgICogVGhlIGNoYW5nZXMgYXJlIGFwcGxpZWQgc2VwYXJhdGVseSBhZnRlciBhbGwgY2hhbmdlcyBoYXZlIGJlZW4gcmVjb3JkZWQgYmVjYXVzZSBvdGhlcndpc2VcbiAgICogZmlsZSBvZmZzZXRzIHdpbGwgY2hhbmdlIGFuZCB0aGUgc291cmNlIGZpbGVzIHdvdWxkIG5lZWQgdG8gYmUgcmUtcGFyc2VkIGFmdGVyIGVhY2ggY2hhbmdlLlxuICAgKi9cbiAgcmVjb3JkQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9pbXBvcnRDYWNoZS5mb3JFYWNoKChmaWxlSW1wb3J0cywgc291cmNlRmlsZSkgPT4ge1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLl9maWxlU3lzdGVtLmVkaXQoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgICBjb25zdCBsYXN0VW5tb2RpZmllZEltcG9ydCA9XG4gICAgICAgICAgZmlsZUltcG9ydHMucmV2ZXJzZSgpLmZpbmQoaSA9PiBpLnN0YXRlID09PSBJbXBvcnRTdGF0ZS5VTk1PRElGSUVEKTtcbiAgICAgIGNvbnN0IGltcG9ydFN0YXJ0SW5kZXggPVxuICAgICAgICAgIGxhc3RVbm1vZGlmaWVkSW1wb3J0ID8gdGhpcy5fZ2V0RW5kUG9zaXRpb25PZk5vZGUobGFzdFVubW9kaWZpZWRJbXBvcnQubm9kZSkgOiAwO1xuXG4gICAgICBmaWxlSW1wb3J0cy5mb3JFYWNoKGltcG9ydERhdGEgPT4ge1xuICAgICAgICBpZiAoaW1wb3J0RGF0YS5zdGF0ZSA9PT0gSW1wb3J0U3RhdGUuVU5NT0RJRklFRCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkRFTEVURUQpKSB7XG4gICAgICAgICAgLy8gSW1wb3J0cyB3aGljaCBkbyBub3QgZXhpc3QgaW4gc291cmNlIGZpbGUsIGNhbiBiZSBqdXN0IHNraXBwZWQgYXNcbiAgICAgICAgICAvLyB3ZSBkbyBub3QgbmVlZCBhbnkgcmVwbGFjZW1lbnQgdG8gZGVsZXRlIHRoZSBpbXBvcnQuXG4gICAgICAgICAgaWYgKCFoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkFEREVEKSkge1xuICAgICAgICAgICAgcmVjb3JkZXIucmVtb3ZlKGltcG9ydERhdGEubm9kZS5nZXRGdWxsU3RhcnQoKSwgaW1wb3J0RGF0YS5ub2RlLmdldEZ1bGxXaWR0aCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltcG9ydERhdGEuc3BlY2lmaWVycykge1xuICAgICAgICAgIGNvbnN0IG5hbWVkQmluZGluZ3MgPSBpbXBvcnREYXRhLm5vZGUuaW1wb3J0Q2xhdXNlIS5uYW1lZEJpbmRpbmdzIGFzIHRzLk5hbWVkSW1wb3J0cztcbiAgICAgICAgICBjb25zdCBpbXBvcnRTcGVjaWZpZXJzID1cbiAgICAgICAgICAgICAgaW1wb3J0RGF0YS5zcGVjaWZpZXJzLm1hcChzID0+IHRzLmNyZWF0ZUltcG9ydFNwZWNpZmllcihzLnByb3BlcnR5TmFtZSwgcy5uYW1lKSk7XG4gICAgICAgICAgY29uc3QgdXBkYXRlZEJpbmRpbmdzID0gdHMudXBkYXRlTmFtZWRJbXBvcnRzKG5hbWVkQmluZGluZ3MsIGltcG9ydFNwZWNpZmllcnMpO1xuXG4gICAgICAgICAgLy8gSW4gY2FzZSBhbiBpbXBvcnQgaGFzIGJlZW4gYWRkZWQgbmV3bHksIHdlIG5lZWQgdG8gcHJpbnQgdGhlIHdob2xlIGltcG9ydFxuICAgICAgICAgIC8vIGRlY2xhcmF0aW9uIGFuZCBpbnNlcnQgaXQgYXQgdGhlIGltcG9ydCBzdGFydCBpbmRleC4gT3RoZXJ3aXNlLCB3ZSBqdXN0XG4gICAgICAgICAgLy8gdXBkYXRlIHRoZSBuYW1lZCBiaW5kaW5ncyB0byBub3QgcmUtcHJpbnQgdGhlIHdob2xlIGltcG9ydCAod2hpY2ggY291bGRcbiAgICAgICAgICAvLyBjYXVzZSB1bm5lY2Vzc2FyeSBmb3JtYXR0aW5nIGNoYW5nZXMpXG4gICAgICAgICAgaWYgKGhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuQURERUQpKSB7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVkSW1wb3J0ID0gdHMudXBkYXRlSW1wb3J0RGVjbGFyYXRpb24oXG4gICAgICAgICAgICAgICAgaW1wb3J0RGF0YS5ub2RlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cy5jcmVhdGVJbXBvcnRDbGF1c2UodW5kZWZpbmVkLCB1cGRhdGVkQmluZGluZ3MpLFxuICAgICAgICAgICAgICAgIHRzLmNyZWF0ZVN0cmluZ0xpdGVyYWwoaW1wb3J0RGF0YS5tb2R1bGVOYW1lKSk7XG4gICAgICAgICAgICBjb25zdCBuZXdJbXBvcnRUZXh0ID1cbiAgICAgICAgICAgICAgICB0aGlzLl9wcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgdXBkYXRlZEltcG9ydCwgc291cmNlRmlsZSk7XG4gICAgICAgICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KFxuICAgICAgICAgICAgICAgIGltcG9ydFN0YXJ0SW5kZXgsXG4gICAgICAgICAgICAgICAgaW1wb3J0U3RhcnRJbmRleCA9PT0gMCA/IGAke25ld0ltcG9ydFRleHR9XFxuYCA6IGBcXG4ke25ld0ltcG9ydFRleHR9YCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLk1PRElGSUVEKSkge1xuICAgICAgICAgICAgY29uc3QgbmV3TmFtZWRCaW5kaW5nc1RleHQgPVxuICAgICAgICAgICAgICAgIHRoaXMuX3ByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCB1cGRhdGVkQmluZGluZ3MsIHNvdXJjZUZpbGUpO1xuICAgICAgICAgICAgcmVjb3JkZXIucmVtb3ZlKG5hbWVkQmluZGluZ3MuZ2V0U3RhcnQoKSwgbmFtZWRCaW5kaW5ncy5nZXRXaWR0aCgpKTtcbiAgICAgICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5hbWVkQmluZGluZ3MuZ2V0U3RhcnQoKSwgbmV3TmFtZWRCaW5kaW5nc1RleHQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkFEREVEKSkge1xuICAgICAgICAgIGNvbnN0IG5ld0ltcG9ydFRleHQgPVxuICAgICAgICAgICAgICB0aGlzLl9wcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgaW1wb3J0RGF0YS5ub2RlLCBzb3VyY2VGaWxlKTtcbiAgICAgICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KFxuICAgICAgICAgICAgICBpbXBvcnRTdGFydEluZGV4LFxuICAgICAgICAgICAgICBpbXBvcnRTdGFydEluZGV4ID09PSAwID8gYCR7bmV3SW1wb3J0VGV4dH1cXG5gIDogYFxcbiR7bmV3SW1wb3J0VGV4dH1gKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3ZSBzaG91bGQgbmV2ZXIgaGl0IHRoaXMsIGJ1dCB3ZSByYXRoZXIgd2FudCB0byBwcmludCBhIGN1c3RvbSBleGNlcHRpb25cbiAgICAgICAgLy8gaW5zdGVhZCBvZiBqdXN0IHNraXBwaW5nIGltcG9ydHMgc2lsZW50bHkuXG4gICAgICAgIHRocm93IEVycm9yKCdVbmV4cGVjdGVkIGltcG9ydCBtb2RpZmljYXRpb24uJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3JyZWN0cyB0aGUgbGluZSBhbmQgY2hhcmFjdGVyIHBvc2l0aW9uIG9mIGEgZ2l2ZW4gbm9kZS4gU2luY2Ugbm9kZXMgb2ZcbiAgICogc291cmNlIGZpbGVzIGFyZSBpbW11dGFibGUgYW5kIHdlIHNvbWV0aW1lcyBtYWtlIGNoYW5nZXMgdG8gdGhlIGNvbnRhaW5pbmdcbiAgICogc291cmNlIGZpbGUsIHRoZSBub2RlIHBvc2l0aW9uIG1pZ2h0IHNoaWZ0IChlLmcuIGlmIHdlIGFkZCBhIG5ldyBpbXBvcnQgYmVmb3JlKS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIHVzZWQgdG8gcmV0cmlldmUgYSBjb3JyZWN0ZWQgcG9zaXRpb24gb2YgdGhlIGdpdmVuIG5vZGUuIFRoaXNcbiAgICogaXMgaGVscGZ1bCB3aGVuIHByaW50aW5nIG91dCBlcnJvciBtZXNzYWdlcyB3aGljaCBzaG91bGQgcmVmbGVjdCB0aGUgbmV3IHN0YXRlIG9mXG4gICAqIHNvdXJjZSBmaWxlcy5cbiAgICovXG4gIGNvcnJlY3ROb2RlUG9zaXRpb24obm9kZTogdHMuTm9kZSwgb2Zmc2V0OiBudW1iZXIsIHBvc2l0aW9uOiB0cy5MaW5lQW5kQ2hhcmFjdGVyKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuXG4gICAgaWYgKCF0aGlzLl9pbXBvcnRDYWNoZS5oYXMoc291cmNlRmlsZSkpIHtcbiAgICAgIHJldHVybiBwb3NpdGlvbjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdQb3NpdGlvbjogdHMuTGluZUFuZENoYXJhY3RlciA9IHsuLi5wb3NpdGlvbn07XG4gICAgY29uc3QgZmlsZUltcG9ydHMgPSB0aGlzLl9pbXBvcnRDYWNoZS5nZXQoc291cmNlRmlsZSkhO1xuXG4gICAgZm9yIChsZXQgaW1wb3J0RGF0YSBvZiBmaWxlSW1wb3J0cykge1xuICAgICAgY29uc3QgZnVsbEVuZCA9IGltcG9ydERhdGEubm9kZS5nZXRGdWxsU3RhcnQoKSArIGltcG9ydERhdGEubm9kZS5nZXRGdWxsV2lkdGgoKTtcbiAgICAgIC8vIFN1YnRyYWN0IG9yIGFkZCBsaW5lcyBiYXNlZCBvbiB3aGV0aGVyIGFuIGltcG9ydCBoYXMgYmVlbiBkZWxldGVkIG9yIHJlbW92ZWRcbiAgICAgIC8vIGJlZm9yZSB0aGUgYWN0dWFsIG5vZGUgb2Zmc2V0LlxuICAgICAgaWYgKG9mZnNldCA+IGZ1bGxFbmQgJiYgaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5ERUxFVEVEKSkge1xuICAgICAgICBuZXdQb3NpdGlvbi5saW5lLS07XG4gICAgICB9IGVsc2UgaWYgKG9mZnNldCA+IGZ1bGxFbmQgJiYgaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5BRERFRCkpIHtcbiAgICAgICAgbmV3UG9zaXRpb24ubGluZSsrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3UG9zaXRpb247XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiB1bmlxdWUgaWRlbnRpZmllciBuYW1lIGZvciB0aGUgc3BlY2lmaWVkIHN5bWJvbCBuYW1lLlxuICAgKiBAcGFyYW0gc291cmNlRmlsZSBTb3VyY2UgZmlsZSB0byBjaGVjayBmb3IgaWRlbnRpZmllciBjb2xsaXNpb25zLlxuICAgKiBAcGFyYW0gc3ltYm9sTmFtZSBOYW1lIG9mIHRoZSBzeW1ib2wgZm9yIHdoaWNoIHdlIHdhbnQgdG8gZ2VuZXJhdGUgYW4gdW5pcXVlIG5hbWUuXG4gICAqIEBwYXJhbSBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHNob3VsZCBiZSBpZ25vcmVkIHdoZW5cbiAgICogICAgY2hlY2tpbmcgZm9yIGlkZW50aWZpZXIgY29sbGlzaW9ucyBpbiB0aGUgZ2l2ZW4gc291cmNlIGZpbGUuXG4gICAqL1xuICBwcml2YXRlIF9nZXRVbmlxdWVJZGVudGlmaWVyKFxuICAgICAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgc3ltYm9sTmFtZTogc3RyaW5nLFxuICAgICAgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnM6IHRzLklkZW50aWZpZXJbXSk6IHRzLklkZW50aWZpZXIge1xuICAgIGlmICh0aGlzLl9pc1VuaXF1ZUlkZW50aWZpZXJOYW1lKHNvdXJjZUZpbGUsIHN5bWJvbE5hbWUsIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zKSkge1xuICAgICAgdGhpcy5fcmVjb3JkVXNlZElkZW50aWZpZXIoc291cmNlRmlsZSwgc3ltYm9sTmFtZSk7XG4gICAgICByZXR1cm4gdHMuY3JlYXRlSWRlbnRpZmllcihzeW1ib2xOYW1lKTtcbiAgICB9XG5cbiAgICBsZXQgbmFtZTogc3RyaW5nfG51bGwgPSBudWxsO1xuICAgIGxldCBjb3VudGVyID0gMTtcbiAgICBkbyB7XG4gICAgICBuYW1lID0gYCR7c3ltYm9sTmFtZX1fJHtjb3VudGVyKyt9YDtcbiAgICB9IHdoaWxlICghdGhpcy5faXNVbmlxdWVJZGVudGlmaWVyTmFtZShzb3VyY2VGaWxlLCBuYW1lLCBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucykpO1xuXG4gICAgdGhpcy5fcmVjb3JkVXNlZElkZW50aWZpZXIoc291cmNlRmlsZSwgbmFtZSEpO1xuICAgIHJldHVybiB0cy5jcmVhdGVJZGVudGlmaWVyKG5hbWUhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgc3BlY2lmaWVkIGlkZW50aWZpZXIgbmFtZSBpcyB1c2VkIHdpdGhpbiB0aGUgZ2l2ZW4gc291cmNlIGZpbGUuXG4gICAqIEBwYXJhbSBzb3VyY2VGaWxlIFNvdXJjZSBmaWxlIHRvIGNoZWNrIGZvciBpZGVudGlmaWVyIGNvbGxpc2lvbnMuXG4gICAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGlkZW50aWZpZXIgd2hpY2ggaXMgY2hlY2tlZCBmb3IgaXRzIHVuaXF1ZW5lc3MuXG4gICAqIEBwYXJhbSBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHNob3VsZCBiZSBpZ25vcmVkIHdoZW5cbiAgICogICAgY2hlY2tpbmcgZm9yIGlkZW50aWZpZXIgY29sbGlzaW9ucyBpbiB0aGUgZ2l2ZW4gc291cmNlIGZpbGUuXG4gICAqL1xuICBwcml2YXRlIF9pc1VuaXF1ZUlkZW50aWZpZXJOYW1lKFxuICAgICAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgbmFtZTogc3RyaW5nLCBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9uczogdHMuSWRlbnRpZmllcltdKSB7XG4gICAgaWYgKHRoaXMuX3VzZWRJZGVudGlmaWVyTmFtZXMuaGFzKHNvdXJjZUZpbGUpICYmXG4gICAgICAgIHRoaXMuX3VzZWRJZGVudGlmaWVyTmFtZXMuZ2V0KHNvdXJjZUZpbGUpIS5pbmRleE9mKG5hbWUpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFdhbGsgdGhyb3VnaCB0aGUgc291cmNlIGZpbGUgYW5kIHNlYXJjaCBmb3IgYW4gaWRlbnRpZmllciBtYXRjaGluZ1xuICAgIC8vIHRoZSBnaXZlbiBuYW1lLiBJbiB0aGF0IGNhc2UsIGl0J3Mgbm90IGd1YXJhbnRlZWQgdGhhdCB0aGlzIG5hbWVcbiAgICAvLyBpcyB1bmlxdWUgaW4gdGhlIGdpdmVuIGRlY2xhcmF0aW9uIHNjb3BlIGFuZCB3ZSBqdXN0IHJldHVybiBmYWxzZS5cbiAgICBjb25zdCBub2RlUXVldWU6IHRzLk5vZGVbXSA9IFtzb3VyY2VGaWxlXTtcbiAgICB3aGlsZSAobm9kZVF1ZXVlLmxlbmd0aCkge1xuICAgICAgY29uc3Qgbm9kZSA9IG5vZGVRdWV1ZS5zaGlmdCgpITtcbiAgICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkgJiYgbm9kZS50ZXh0ID09PSBuYW1lICYmXG4gICAgICAgICAgIWlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zLmluY2x1ZGVzKG5vZGUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIG5vZGVRdWV1ZS5wdXNoKC4uLm5vZGUuZ2V0Q2hpbGRyZW4oKSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY29yZHMgdGhhdCB0aGUgZ2l2ZW4gaWRlbnRpZmllciBpcyB1c2VkIHdpdGhpbiB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlLiBUaGlzXG4gICAqIGlzIG5lY2Vzc2FyeSBzaW5jZSB3ZSBkbyBub3QgYXBwbHkgY2hhbmdlcyB0byBzb3VyY2UgZmlsZXMgcGVyIGNoYW5nZSwgYnV0IHN0aWxsXG4gICAqIHdhbnQgdG8gYXZvaWQgY29uZmxpY3RzIHdpdGggbmV3bHkgaW1wb3J0ZWQgc3ltYm9scy5cbiAgICovXG4gIHByaXZhdGUgX3JlY29yZFVzZWRJZGVudGlmaWVyKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIGlkZW50aWZpZXJOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLl91c2VkSWRlbnRpZmllck5hbWVzLnNldChcbiAgICAgICAgc291cmNlRmlsZSwgKHRoaXMuX3VzZWRJZGVudGlmaWVyTmFtZXMuZ2V0KHNvdXJjZUZpbGUpIHx8IFtdKS5jb25jYXQoaWRlbnRpZmllck5hbWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHRoZSBmdWxsIGVuZCBvZiBhIGdpdmVuIG5vZGUuIEJ5IGRlZmF1bHQgdGhlIGVuZCBwb3NpdGlvbiBvZiBhIG5vZGUgaXNcbiAgICogYmVmb3JlIGFsbCB0cmFpbGluZyBjb21tZW50cy4gVGhpcyBjb3VsZCBtZWFuIHRoYXQgZ2VuZXJhdGVkIGltcG9ydHMgc2hpZnQgY29tbWVudHMuXG4gICAqL1xuICBwcml2YXRlIF9nZXRFbmRQb3NpdGlvbk9mTm9kZShub2RlOiB0cy5Ob2RlKSB7XG4gICAgY29uc3Qgbm9kZUVuZFBvcyA9IG5vZGUuZ2V0RW5kKCk7XG4gICAgY29uc3QgY29tbWVudFJhbmdlcyA9IHRzLmdldFRyYWlsaW5nQ29tbWVudFJhbmdlcyhub2RlLmdldFNvdXJjZUZpbGUoKS50ZXh0LCBub2RlRW5kUG9zKTtcbiAgICBpZiAoIWNvbW1lbnRSYW5nZXMgfHwgIWNvbW1lbnRSYW5nZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbm9kZUVuZFBvcztcbiAgICB9XG4gICAgcmV0dXJuIGNvbW1lbnRSYW5nZXNbY29tbWVudFJhbmdlcy5sZW5ndGggLSAxXSEuZW5kO1xuICB9XG59XG4iXX0=