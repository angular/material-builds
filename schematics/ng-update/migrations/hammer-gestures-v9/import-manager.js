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
/** Parsed version of TypeScript that can be used for comparisons. */
const PARSED_TS_VERSION = parseFloat(ts.versionMajorMinor);
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
                    const importSpecifiers = importData.specifiers.map(s => createImportSpecifier(s.propertyName, s.name));
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
// TODO(crisbeto): backwards-compatibility layer that allows us to support both TS 4.4 and 4.5.
// Should be removed once we don't have to support 4.4 anymore.
function createImportSpecifier(propertyName, name) {
    return PARSED_TS_VERSION > 4.4
        ? ts.factory.createImportSpecifier(false, propertyName, name)
        : ts.createImportSpecifier(propertyName, name);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9oYW1tZXItZ2VzdHVyZXMtdjkvaW1wb3J0LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBR0gsK0JBQXNDO0FBQ3RDLGlDQUFpQztBQTRCakMsdUVBQXVFO0FBQ3ZFLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBb0IsRUFBRSxJQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXZGLHFFQUFxRTtBQUNyRSxNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUUzRDs7OztHQUlHO0FBQ0gsTUFBYSxhQUFhO0lBT3hCLFlBQW9CLFdBQXVCLEVBQVUsUUFBb0I7UUFBckQsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBTnpFLHNFQUFzRTtRQUM5RCx5QkFBb0IsR0FBRyxJQUFJLEdBQUcsRUFBMkIsQ0FBQztRQUVsRSxzREFBc0Q7UUFDOUMsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBbUMsQ0FBQztJQUVVLENBQUM7SUFFN0U7Ozs7O09BS0c7SUFDSyx1QkFBdUIsQ0FBQyxVQUF5QjtRQUN2RCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFFLENBQUM7U0FDM0M7UUFFRCxNQUFNLE1BQU0sR0FBcUIsRUFBRSxDQUFDO1FBQ3BDLEtBQUssSUFBSSxJQUFJLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRTtZQUN0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QyxVQUF5QixFQUFFLGNBQXNCO1FBQzdFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQzNCLFVBQVUsRUFDVixDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUN6RSxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7T0FHRztJQUNLLHFCQUFxQixDQUFDLElBQWE7UUFDekMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3pGLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQzNDLE9BQU8sVUFBVSxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUM7SUFDdEQsQ0FBQztDQUNGO0FBL2RELHNDQStkQztBQUVELCtGQUErRjtBQUMvRiwrREFBK0Q7QUFDL0QsU0FBUyxxQkFBcUIsQ0FDNUIsWUFBdUMsRUFDdkMsSUFBbUI7SUFFbkIsT0FBTyxpQkFBaUIsR0FBRyxHQUFHO1FBQzVCLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDO1FBQzdELENBQUMsQ0FBRSxFQUFFLENBQUMscUJBQTZCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzVELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGaWxlU3lzdGVtfSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge2Rpcm5hbWUsIHJlc29sdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8vIHRzbGludDpkaXNhYmxlOm5vLWJpdHdpc2VcblxuLyoqIEVudW0gZGVzY3JpYmluZyB0aGUgcG9zc2libGUgc3RhdGVzIG9mIGFuIGFuYWx5emVkIGltcG9ydC4gKi9cbmNvbnN0IGVudW0gSW1wb3J0U3RhdGUge1xuICBVTk1PRElGSUVEID0gMGIwLFxuICBNT0RJRklFRCA9IDBiMTAsXG4gIEFEREVEID0gMGIxMDAsXG4gIERFTEVURUQgPSAwYjEwMDAsXG59XG5cbi8qKiBJbnRlcmZhY2UgZGVzY3JpYmluZyBhbiBpbXBvcnQgc3BlY2lmaWVyLiAqL1xuaW50ZXJmYWNlIEltcG9ydFNwZWNpZmllciB7XG4gIG5hbWU6IHRzLklkZW50aWZpZXI7XG4gIHByb3BlcnR5TmFtZT86IHRzLklkZW50aWZpZXI7XG59XG5cbi8qKiBJbnRlcmZhY2UgZGVzY3JpYmluZyBhbiBhbmFseXplZCBpbXBvcnQuICovXG5pbnRlcmZhY2UgQW5hbHl6ZWRJbXBvcnQge1xuICBub2RlOiB0cy5JbXBvcnREZWNsYXJhdGlvbjtcbiAgbW9kdWxlTmFtZTogc3RyaW5nO1xuICBuYW1lPzogdHMuSWRlbnRpZmllcjtcbiAgc3BlY2lmaWVycz86IEltcG9ydFNwZWNpZmllcltdO1xuICBuYW1lc3BhY2U/OiBib29sZWFuO1xuICBzdGF0ZTogSW1wb3J0U3RhdGU7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciBhbiBhbmFseXplZCBpbXBvcnQgaGFzIHRoZSBnaXZlbiBpbXBvcnQgZmxhZyBzZXQuICovXG5jb25zdCBoYXNGbGFnID0gKGRhdGE6IEFuYWx5emVkSW1wb3J0LCBmbGFnOiBJbXBvcnRTdGF0ZSkgPT4gKGRhdGEuc3RhdGUgJiBmbGFnKSAhPT0gMDtcblxuLyoqIFBhcnNlZCB2ZXJzaW9uIG9mIFR5cGVTY3JpcHQgdGhhdCBjYW4gYmUgdXNlZCBmb3IgY29tcGFyaXNvbnMuICovXG5jb25zdCBQQVJTRURfVFNfVkVSU0lPTiA9IHBhcnNlRmxvYXQodHMudmVyc2lvbk1ham9yTWlub3IpO1xuXG4vKipcbiAqIEltcG9ydCBtYW5hZ2VyIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWRkIG9yIHJlbW92ZSBUeXBlU2NyaXB0IGltcG9ydHMgd2l0aGluIHNvdXJjZVxuICogZmlsZXMuIFRoZSBtYW5hZ2VyIGVuc3VyZXMgdGhhdCBtdWx0aXBsZSB0cmFuc2Zvcm1hdGlvbnMgYXJlIGFwcGxpZWQgcHJvcGVybHlcbiAqIHdpdGhvdXQgc2hpZnRlZCBvZmZzZXRzIGFuZCB0aGF0IGV4aXN0aW5nIGltcG9ydHMgYXJlIHJlLXVzZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbXBvcnRNYW5hZ2VyIHtcbiAgLyoqIE1hcCBvZiBzb3VyY2UtZmlsZXMgYW5kIHRoZWlyIHByZXZpb3VzbHkgdXNlZCBpZGVudGlmaWVyIG5hbWVzLiAqL1xuICBwcml2YXRlIF91c2VkSWRlbnRpZmllck5hbWVzID0gbmV3IE1hcDx0cy5Tb3VyY2VGaWxlLCBzdHJpbmdbXT4oKTtcblxuICAvKiogTWFwIG9mIHNvdXJjZSBmaWxlcyBhbmQgdGhlaXIgYW5hbHl6ZWQgaW1wb3J0cy4gKi9cbiAgcHJpdmF0ZSBfaW1wb3J0Q2FjaGUgPSBuZXcgTWFwPHRzLlNvdXJjZUZpbGUsIEFuYWx5emVkSW1wb3J0W10+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZmlsZVN5c3RlbTogRmlsZVN5c3RlbSwgcHJpdmF0ZSBfcHJpbnRlcjogdHMuUHJpbnRlcikge31cblxuICAvKipcbiAgICogQW5hbHl6ZXMgdGhlIGltcG9ydCBvZiB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlIGlmIG5lZWRlZC4gSW4gb3JkZXIgdG8gcGVyZm9ybVxuICAgKiBtb2RpZmljYXRpb25zIHRvIGltcG9ydHMgb2YgYSBzb3VyY2UgZmlsZSwgd2Ugc3RvcmUgYWxsIGltcG9ydHMgaW4gbWVtb3J5IGFuZFxuICAgKiB1cGRhdGUgdGhlIHNvdXJjZSBmaWxlIG9uY2UgYWxsIGNoYW5nZXMgaGF2ZSBiZWVuIG1hZGUuIFRoaXMgaXMgZXNzZW50aWFsIHRvXG4gICAqIGVuc3VyZSB0aGF0IHdlIGNhbiByZS11c2UgbmV3bHkgYWRkZWQgaW1wb3J0cyBhbmQgbm90IGJyZWFrIGZpbGUgb2Zmc2V0cy5cbiAgICovXG4gIHByaXZhdGUgX2FuYWx5emVJbXBvcnRzSWZOZWVkZWQoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IEFuYWx5emVkSW1wb3J0W10ge1xuICAgIGlmICh0aGlzLl9pbXBvcnRDYWNoZS5oYXMoc291cmNlRmlsZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbXBvcnRDYWNoZS5nZXQoc291cmNlRmlsZSkhO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdDogQW5hbHl6ZWRJbXBvcnRbXSA9IFtdO1xuICAgIGZvciAobGV0IG5vZGUgb2Ygc291cmNlRmlsZS5zdGF0ZW1lbnRzKSB7XG4gICAgICBpZiAoIXRzLmlzSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgfHwgIXRzLmlzU3RyaW5nTGl0ZXJhbChub2RlLm1vZHVsZVNwZWNpZmllcikpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1vZHVsZU5hbWUgPSBub2RlLm1vZHVsZVNwZWNpZmllci50ZXh0O1xuXG4gICAgICAvLyBIYW5kbGVzIHNpZGUtZWZmZWN0IGltcG9ydHMgd2hpY2ggZG8gbmVpdGhlciBoYXZlIGEgbmFtZSBvclxuICAgICAgLy8gc3BlY2lmaWVycy4gZS5nLiBgaW1wb3J0IFwibXktcGFja2FnZVwiO2BcbiAgICAgIGlmICghbm9kZS5pbXBvcnRDbGF1c2UpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goe21vZHVsZU5hbWUsIG5vZGUsIHN0YXRlOiBJbXBvcnRTdGF0ZS5VTk1PRElGSUVEfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGVzIGltcG9ydHMgcmVzb2x2aW5nIHRvIGRlZmF1bHQgZXhwb3J0cyBvZiBhIG1vZHVsZS5cbiAgICAgIC8vIGUuZy4gYGltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO2BcbiAgICAgIGlmICghbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykge1xuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG5hbWU6IG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWUsXG4gICAgICAgICAgc3RhdGU6IEltcG9ydFN0YXRlLlVOTU9ESUZJRUQsXG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlcyBpbXBvcnRzIHdpdGggaW5kaXZpZHVhbCBzeW1ib2wgc3BlY2lmaWVycy5cbiAgICAgIC8vIGUuZy4gYGltcG9ydCB7QSwgQiwgQ30gZnJvbSBcIm15LW1vZHVsZVwiO2BcbiAgICAgIGlmICh0cy5pc05hbWVkSW1wb3J0cyhub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSkge1xuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIHNwZWNpZmllcnM6IG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHMubWFwKGVsID0+ICh7XG4gICAgICAgICAgICBuYW1lOiBlbC5uYW1lLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBlbC5wcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgfSkpLFxuICAgICAgICAgIHN0YXRlOiBJbXBvcnRTdGF0ZS5VTk1PRElGSUVELFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEhhbmRsZXMgbmFtZXNwYWNlZCBpbXBvcnRzLiBlLmcuIGBpbXBvcnQgKiBhcyBjb3JlIGZyb20gXCJteS1wa2dcIjtgXG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgbmFtZTogbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5uYW1lLFxuICAgICAgICAgIG5hbWVzcGFjZTogdHJ1ZSxcbiAgICAgICAgICBzdGF0ZTogSW1wb3J0U3RhdGUuVU5NT0RJRklFRCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2ltcG9ydENhY2hlLnNldChzb3VyY2VGaWxlLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIHNwZWNpZmllciwgd2hpY2ggY2FuIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHBhdGgsXG4gICAqIG1hdGNoZXMgdGhlIHBhc3NlZCBtb2R1bGUgbmFtZS5cbiAgICovXG4gIHByaXZhdGUgX2lzTW9kdWxlU3BlY2lmaWVyTWF0Y2hpbmcoXG4gICAgYmFzZVBhdGg6IHN0cmluZyxcbiAgICBzcGVjaWZpZXI6IHN0cmluZyxcbiAgICBtb2R1bGVOYW1lOiBzdHJpbmcsXG4gICk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBzcGVjaWZpZXIuc3RhcnRzV2l0aCgnLicpXG4gICAgICA/IHJlc29sdmUoYmFzZVBhdGgsIHNwZWNpZmllcikgPT09IHJlc29sdmUoYmFzZVBhdGgsIG1vZHVsZU5hbWUpXG4gICAgICA6IHNwZWNpZmllciA9PT0gbW9kdWxlTmFtZTtcbiAgfVxuXG4gIC8qKiBEZWxldGVzIGEgZ2l2ZW4gbmFtZWQgYmluZGluZyBpbXBvcnQgZnJvbSB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlLiAqL1xuICBkZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgc3ltYm9sTmFtZTogc3RyaW5nLCBtb2R1bGVOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBzb3VyY2VEaXIgPSBkaXJuYW1lKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IGZpbGVJbXBvcnRzID0gdGhpcy5fYW5hbHl6ZUltcG9ydHNJZk5lZWRlZChzb3VyY2VGaWxlKTtcblxuICAgIGZvciAobGV0IGltcG9ydERhdGEgb2YgZmlsZUltcG9ydHMpIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuX2lzTW9kdWxlU3BlY2lmaWVyTWF0Y2hpbmcoc291cmNlRGlyLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUsIG1vZHVsZU5hbWUpIHx8XG4gICAgICAgICFpbXBvcnREYXRhLnNwZWNpZmllcnNcbiAgICAgICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3BlY2lmaWVySW5kZXggPSBpbXBvcnREYXRhLnNwZWNpZmllcnMuZmluZEluZGV4KFxuICAgICAgICBkID0+IChkLnByb3BlcnR5TmFtZSB8fCBkLm5hbWUpLnRleHQgPT09IHN5bWJvbE5hbWUsXG4gICAgICApO1xuICAgICAgaWYgKHNwZWNpZmllckluZGV4ICE9PSAtMSkge1xuICAgICAgICBpbXBvcnREYXRhLnNwZWNpZmllcnMuc3BsaWNlKHNwZWNpZmllckluZGV4LCAxKTtcbiAgICAgICAgLy8gaWYgdGhlIGltcG9ydCBkb2VzIG5vIGxvbmdlciBjb250YWluIGFueSBzcGVjaWZpZXJzIGFmdGVyIHRoZSByZW1vdmFsIG9mIHRoZVxuICAgICAgICAvLyBnaXZlbiBzeW1ib2wsIHdlIGNhbiBqdXN0IG1hcmsgdGhlIHdob2xlIGltcG9ydCBmb3IgZGVsZXRpb24uIE90aGVyd2lzZSwgd2UgbWFya1xuICAgICAgICAvLyBpdCBhcyBtb2RpZmllZCBzbyB0aGF0IGl0IHdpbGwgYmUgcmUtcHJpbnRlZC5cbiAgICAgICAgaWYgKGltcG9ydERhdGEuc3BlY2lmaWVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBpbXBvcnREYXRhLnN0YXRlIHw9IEltcG9ydFN0YXRlLkRFTEVURUQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW1wb3J0RGF0YS5zdGF0ZSB8PSBJbXBvcnRTdGF0ZS5NT0RJRklFRDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBEZWxldGVzIHRoZSBpbXBvcnQgdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBpbXBvcnQgZGVjbGFyYXRpb24gaWYgZm91bmQuICovXG4gIGRlbGV0ZUltcG9ydEJ5RGVjbGFyYXRpb24oZGVjbGFyYXRpb246IHRzLkltcG9ydERlY2xhcmF0aW9uKSB7XG4gICAgY29uc3QgZmlsZUltcG9ydHMgPSB0aGlzLl9hbmFseXplSW1wb3J0c0lmTmVlZGVkKGRlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKSk7XG4gICAgZm9yIChsZXQgaW1wb3J0RGF0YSBvZiBmaWxlSW1wb3J0cykge1xuICAgICAgaWYgKGltcG9ydERhdGEubm9kZSA9PT0gZGVjbGFyYXRpb24pIHtcbiAgICAgICAgaW1wb3J0RGF0YS5zdGF0ZSB8PSBJbXBvcnRTdGF0ZS5ERUxFVEVEO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGltcG9ydCB0byB0aGUgZ2l2ZW4gc291cmNlIGZpbGUgYW5kIHJldHVybnMgdGhlIFR5cGVTY3JpcHQgZXhwcmVzc2lvbiB0aGF0XG4gICAqIGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgbmV3bHkgaW1wb3J0ZWQgc3ltYm9sLlxuICAgKlxuICAgKiBXaGVuZXZlciBhbiBpbXBvcnQgaXMgYWRkZWQgdG8gYSBzb3VyY2UgZmlsZSwgaXQncyByZWNvbW1lbmRlZCB0aGF0IHRoZSByZXR1cm5lZFxuICAgKiBleHByZXNzaW9uIGlzIHVzZWQgdG8gcmVmZXJlbmNlIHRoIHN5bWJvbC4gVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSB0aGUgc3ltYm9sXG4gICAqIGNvdWxkIGJlIGFsaWFzZWQgaWYgaXQgd291bGQgY29sbGlkZSB3aXRoIGV4aXN0aW5nIGltcG9ydHMgaW4gc291cmNlIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBzb3VyY2VGaWxlIFNvdXJjZSBmaWxlIHRvIHdoaWNoIHRoZSBpbXBvcnQgc2hvdWxkIGJlIGFkZGVkLlxuICAgKiBAcGFyYW0gc3ltYm9sTmFtZSBOYW1lIG9mIHRoZSBzeW1ib2wgdGhhdCBzaG91bGQgYmUgaW1wb3J0ZWQuIENhbiBiZSBudWxsIGlmXG4gICAqICAgIHRoZSBkZWZhdWx0IGV4cG9ydCBpcyByZXF1ZXN0ZWQuXG4gICAqIEBwYXJhbSBtb2R1bGVOYW1lIE5hbWUgb2YgdGhlIG1vZHVsZSBvZiB3aGljaCB0aGUgc3ltYm9sIHNob3VsZCBiZSBpbXBvcnRlZC5cbiAgICogQHBhcmFtIHR5cGVJbXBvcnQgV2hldGhlciB0aGUgc3ltYm9sIGlzIGEgdHlwZS5cbiAgICogQHBhcmFtIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggY2FuIGJlIGlnbm9yZWQgd2hlblxuICAgKiAgICB0aGUgaW1wb3J0IG1hbmFnZXIgY2hlY2tzIGZvciBpbXBvcnQgY29sbGlzaW9ucy5cbiAgICovXG4gIGFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICAgIHN5bWJvbE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgbW9kdWxlTmFtZTogc3RyaW5nLFxuICAgIHR5cGVJbXBvcnQgPSBmYWxzZSxcbiAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9uczogdHMuSWRlbnRpZmllcltdID0gW10sXG4gICk6IHRzLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IHNvdXJjZURpciA9IGRpcm5hbWUoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgY29uc3QgZmlsZUltcG9ydHMgPSB0aGlzLl9hbmFseXplSW1wb3J0c0lmTmVlZGVkKHNvdXJjZUZpbGUpO1xuXG4gICAgbGV0IGV4aXN0aW5nSW1wb3J0OiBBbmFseXplZEltcG9ydCB8IG51bGwgPSBudWxsO1xuICAgIGZvciAobGV0IGltcG9ydERhdGEgb2YgZmlsZUltcG9ydHMpIHtcbiAgICAgIGlmICghdGhpcy5faXNNb2R1bGVTcGVjaWZpZXJNYXRjaGluZyhzb3VyY2VEaXIsIGltcG9ydERhdGEubW9kdWxlTmFtZSwgbW9kdWxlTmFtZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIG5vIHN5bWJvbCBuYW1lIGhhcyBiZWVuIHNwZWNpZmllZCwgdGhlIGRlZmF1bHQgaW1wb3J0IGlzIHJlcXVlc3RlZC4gSW4gdGhhdFxuICAgICAgLy8gY2FzZSB3ZSBzZWFyY2ggZm9yIG5vbi1uYW1lc3BhY2UgYW5kIG5vbi1zcGVjaWZpZXIgaW1wb3J0cy5cbiAgICAgIGlmICghc3ltYm9sTmFtZSAmJiAhaW1wb3J0RGF0YS5uYW1lc3BhY2UgJiYgIWltcG9ydERhdGEuc3BlY2lmaWVycykge1xuICAgICAgICByZXR1cm4gdHMuZmFjdG9yeS5jcmVhdGVJZGVudGlmaWVyKGltcG9ydERhdGEubmFtZSEudGV4dCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEluIGNhc2UgYSBcIlR5cGVcIiBzeW1ib2wgaXMgaW1wb3J0ZWQsIHdlIGNhbid0IHVzZSBuYW1lc3BhY2UgaW1wb3J0c1xuICAgICAgLy8gYmVjYXVzZSB0aGVzZSBvbmx5IGV4cG9ydCBzeW1ib2xzIGF2YWlsYWJsZSBhdCBydW50aW1lIChubyB0eXBlcylcbiAgICAgIGlmIChpbXBvcnREYXRhLm5hbWVzcGFjZSAmJiAhdHlwZUltcG9ydCkge1xuICAgICAgICByZXR1cm4gdHMuZmFjdG9yeS5jcmVhdGVQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24oXG4gICAgICAgICAgdHMuZmFjdG9yeS5jcmVhdGVJZGVudGlmaWVyKGltcG9ydERhdGEubmFtZSEudGV4dCksXG4gICAgICAgICAgdHMuZmFjdG9yeS5jcmVhdGVJZGVudGlmaWVyKHN5bWJvbE5hbWUgfHwgJ2RlZmF1bHQnKSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoaW1wb3J0RGF0YS5zcGVjaWZpZXJzICYmIHN5bWJvbE5hbWUpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdTcGVjaWZpZXIgPSBpbXBvcnREYXRhLnNwZWNpZmllcnMuZmluZChzID0+XG4gICAgICAgICAgcy5wcm9wZXJ0eU5hbWUgPyBzLnByb3BlcnR5TmFtZS50ZXh0ID09PSBzeW1ib2xOYW1lIDogcy5uYW1lLnRleHQgPT09IHN5bWJvbE5hbWUsXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGV4aXN0aW5nU3BlY2lmaWVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRzLmZhY3RvcnkuY3JlYXRlSWRlbnRpZmllcihleGlzdGluZ1NwZWNpZmllci5uYW1lLnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW4gY2FzZSB0aGUgc3ltYm9sIGNvdWxkIG5vdCBiZSBmb3VuZCBpbiBhbiBleGlzdGluZyBpbXBvcnQsIHdlXG4gICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgdGhlIGltcG9ydCBkZWNsYXJhdGlvbiBhcyBpdCBjYW4gYmUgdXBkYXRlZCB0byBpbmNsdWRlXG4gICAgICAgIC8vIHRoZSBzcGVjaWZpZWQgc3ltYm9sIG5hbWUgd2l0aG91dCBoYXZpbmcgdG8gY3JlYXRlIGEgbmV3IGltcG9ydC5cbiAgICAgICAgZXhpc3RpbmdJbXBvcnQgPSBpbXBvcnREYXRhO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGlzIGFuIGV4aXN0aW5nIGltcG9ydCB0aGF0IG1hdGNoZXMgdGhlIHNwZWNpZmllZCBtb2R1bGUsIHdlXG4gICAgLy8ganVzdCB1cGRhdGUgdGhlIGltcG9ydCBzcGVjaWZpZXJzIHRvIGFsc28gaW1wb3J0IHRoZSByZXF1ZXN0ZWQgc3ltYm9sLlxuICAgIGlmIChleGlzdGluZ0ltcG9ydCkge1xuICAgICAgY29uc3QgcHJvcGVydHlJZGVudGlmaWVyID0gdHMuZmFjdG9yeS5jcmVhdGVJZGVudGlmaWVyKHN5bWJvbE5hbWUhKTtcbiAgICAgIGNvbnN0IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIgPSB0aGlzLl9nZXRVbmlxdWVJZGVudGlmaWVyKFxuICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICBzeW1ib2xOYW1lISxcbiAgICAgICAgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMsXG4gICAgICApO1xuICAgICAgY29uc3QgbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID0gZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllci50ZXh0ICE9PSBzeW1ib2xOYW1lO1xuICAgICAgY29uc3QgaW1wb3J0TmFtZSA9IG5lZWRzR2VuZXJhdGVkVW5pcXVlTmFtZSA/IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIgOiBwcm9wZXJ0eUlkZW50aWZpZXI7XG5cbiAgICAgIGV4aXN0aW5nSW1wb3J0LnNwZWNpZmllcnMhLnB1c2goe1xuICAgICAgICBuYW1lOiBpbXBvcnROYW1lLFxuICAgICAgICBwcm9wZXJ0eU5hbWU6IG5lZWRzR2VuZXJhdGVkVW5pcXVlTmFtZSA/IHByb3BlcnR5SWRlbnRpZmllciA6IHVuZGVmaW5lZCxcbiAgICAgIH0pO1xuICAgICAgZXhpc3RpbmdJbXBvcnQuc3RhdGUgfD0gSW1wb3J0U3RhdGUuTU9ESUZJRUQ7XG5cbiAgICAgIGlmIChoYXNGbGFnKGV4aXN0aW5nSW1wb3J0LCBJbXBvcnRTdGF0ZS5ERUxFVEVEKSkge1xuICAgICAgICAvLyB1bnNldCB0aGUgZGVsZXRlZCBmbGFnIGlmIHRoZSBpbXBvcnQgaXMgcGVuZGluZyBkZWxldGlvbiwgYnV0XG4gICAgICAgIC8vIGNhbiBub3cgYmUgdXNlZCBmb3IgdGhlIG5ldyBpbXBvcnRlZCBzeW1ib2wuXG4gICAgICAgIGV4aXN0aW5nSW1wb3J0LnN0YXRlICY9IH5JbXBvcnRTdGF0ZS5ERUxFVEVEO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW1wb3J0TmFtZTtcbiAgICB9XG5cbiAgICBsZXQgaWRlbnRpZmllcjogdHMuSWRlbnRpZmllciB8IG51bGwgPSBudWxsO1xuICAgIGxldCBuZXdJbXBvcnQ6IEFuYWx5emVkSW1wb3J0IHwgbnVsbCA9IG51bGw7XG5cbiAgICBpZiAoc3ltYm9sTmFtZSkge1xuICAgICAgY29uc3QgcHJvcGVydHlJZGVudGlmaWVyID0gdHMuZmFjdG9yeS5jcmVhdGVJZGVudGlmaWVyKHN5bWJvbE5hbWUpO1xuICAgICAgY29uc3QgZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllciA9IHRoaXMuX2dldFVuaXF1ZUlkZW50aWZpZXIoXG4gICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgIHN5bWJvbE5hbWUsXG4gICAgICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5lZWRzR2VuZXJhdGVkVW5pcXVlTmFtZSA9IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIudGV4dCAhPT0gc3ltYm9sTmFtZTtcbiAgICAgIGlkZW50aWZpZXIgPSBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPyBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyIDogcHJvcGVydHlJZGVudGlmaWVyO1xuXG4gICAgICBjb25zdCBuZXdJbXBvcnREZWNsID0gdHMuZmFjdG9yeS5jcmVhdGVJbXBvcnREZWNsYXJhdGlvbihcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHRzLmZhY3RvcnkuY3JlYXRlSW1wb3J0Q2xhdXNlKGZhbHNlLCB1bmRlZmluZWQsIHRzLmZhY3RvcnkuY3JlYXRlTmFtZWRJbXBvcnRzKFtdKSksXG4gICAgICAgIHRzLmZhY3RvcnkuY3JlYXRlU3RyaW5nTGl0ZXJhbChtb2R1bGVOYW1lKSxcbiAgICAgICk7XG5cbiAgICAgIG5ld0ltcG9ydCA9IHtcbiAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgbm9kZTogbmV3SW1wb3J0RGVjbCxcbiAgICAgICAgc3BlY2lmaWVyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZTogbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gcHJvcGVydHlJZGVudGlmaWVyIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgbmFtZTogaWRlbnRpZmllcixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBzdGF0ZTogSW1wb3J0U3RhdGUuQURERUQsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZGVudGlmaWVyID0gdGhpcy5fZ2V0VW5pcXVlSWRlbnRpZmllcihcbiAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgJ2RlZmF1bHRFeHBvcnQnLFxuICAgICAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyxcbiAgICAgICk7XG4gICAgICBjb25zdCBuZXdJbXBvcnREZWNsID0gdHMuZmFjdG9yeS5jcmVhdGVJbXBvcnREZWNsYXJhdGlvbihcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHRzLmZhY3RvcnkuY3JlYXRlSW1wb3J0Q2xhdXNlKGZhbHNlLCBpZGVudGlmaWVyLCB1bmRlZmluZWQpLFxuICAgICAgICB0cy5mYWN0b3J5LmNyZWF0ZVN0cmluZ0xpdGVyYWwobW9kdWxlTmFtZSksXG4gICAgICApO1xuICAgICAgbmV3SW1wb3J0ID0ge1xuICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICBub2RlOiBuZXdJbXBvcnREZWNsLFxuICAgICAgICBuYW1lOiBpZGVudGlmaWVyLFxuICAgICAgICBzdGF0ZTogSW1wb3J0U3RhdGUuQURERUQsXG4gICAgICB9O1xuICAgIH1cbiAgICBmaWxlSW1wb3J0cy5wdXNoKG5ld0ltcG9ydCk7XG4gICAgcmV0dXJuIGlkZW50aWZpZXI7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyB0aGUgcmVjb3JkZWQgY2hhbmdlcyBpbiB0aGUgdXBkYXRlIHJlY29yZGVycyBvZiB0aGUgY29ycmVzcG9uZGluZyBzb3VyY2UgZmlsZXMuXG4gICAqIFRoZSBjaGFuZ2VzIGFyZSBhcHBsaWVkIHNlcGFyYXRlbHkgYWZ0ZXIgYWxsIGNoYW5nZXMgaGF2ZSBiZWVuIHJlY29yZGVkIGJlY2F1c2Ugb3RoZXJ3aXNlXG4gICAqIGZpbGUgb2Zmc2V0cyB3aWxsIGNoYW5nZSBhbmQgdGhlIHNvdXJjZSBmaWxlcyB3b3VsZCBuZWVkIHRvIGJlIHJlLXBhcnNlZCBhZnRlciBlYWNoIGNoYW5nZS5cbiAgICovXG4gIHJlY29yZENoYW5nZXMoKSB7XG4gICAgdGhpcy5faW1wb3J0Q2FjaGUuZm9yRWFjaCgoZmlsZUltcG9ydHMsIHNvdXJjZUZpbGUpID0+IHtcbiAgICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5lZGl0KHRoaXMuX2ZpbGVTeXN0ZW0ucmVzb2x2ZShzb3VyY2VGaWxlLmZpbGVOYW1lKSk7XG4gICAgICBjb25zdCBsYXN0VW5tb2RpZmllZEltcG9ydCA9IGZpbGVJbXBvcnRzXG4gICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgLmZpbmQoaSA9PiBpLnN0YXRlID09PSBJbXBvcnRTdGF0ZS5VTk1PRElGSUVEKTtcbiAgICAgIGNvbnN0IGltcG9ydFN0YXJ0SW5kZXggPSBsYXN0VW5tb2RpZmllZEltcG9ydFxuICAgICAgICA/IHRoaXMuX2dldEVuZFBvc2l0aW9uT2ZOb2RlKGxhc3RVbm1vZGlmaWVkSW1wb3J0Lm5vZGUpXG4gICAgICAgIDogMDtcblxuICAgICAgZmlsZUltcG9ydHMuZm9yRWFjaChpbXBvcnREYXRhID0+IHtcbiAgICAgICAgaWYgKGltcG9ydERhdGEuc3RhdGUgPT09IEltcG9ydFN0YXRlLlVOTU9ESUZJRUQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5ERUxFVEVEKSkge1xuICAgICAgICAgIC8vIEltcG9ydHMgd2hpY2ggZG8gbm90IGV4aXN0IGluIHNvdXJjZSBmaWxlLCBjYW4gYmUganVzdCBza2lwcGVkIGFzXG4gICAgICAgICAgLy8gd2UgZG8gbm90IG5lZWQgYW55IHJlcGxhY2VtZW50IHRvIGRlbGV0ZSB0aGUgaW1wb3J0LlxuICAgICAgICAgIGlmICghaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5BRERFRCkpIHtcbiAgICAgICAgICAgIHJlY29yZGVyLnJlbW92ZShpbXBvcnREYXRhLm5vZGUuZ2V0RnVsbFN0YXJ0KCksIGltcG9ydERhdGEubm9kZS5nZXRGdWxsV2lkdGgoKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbXBvcnREYXRhLnNwZWNpZmllcnMpIHtcbiAgICAgICAgICBjb25zdCBuYW1lZEJpbmRpbmdzID0gaW1wb3J0RGF0YS5ub2RlLmltcG9ydENsYXVzZSEubmFtZWRCaW5kaW5ncyBhcyB0cy5OYW1lZEltcG9ydHM7XG4gICAgICAgICAgY29uc3QgaW1wb3J0U3BlY2lmaWVycyA9IGltcG9ydERhdGEuc3BlY2lmaWVycy5tYXAocyA9PlxuICAgICAgICAgICAgY3JlYXRlSW1wb3J0U3BlY2lmaWVyKHMucHJvcGVydHlOYW1lLCBzLm5hbWUpLFxuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc3QgdXBkYXRlZEJpbmRpbmdzID0gdHMuZmFjdG9yeS51cGRhdGVOYW1lZEltcG9ydHMobmFtZWRCaW5kaW5ncywgaW1wb3J0U3BlY2lmaWVycyk7XG5cbiAgICAgICAgICAvLyBJbiBjYXNlIGFuIGltcG9ydCBoYXMgYmVlbiBhZGRlZCBuZXdseSwgd2UgbmVlZCB0byBwcmludCB0aGUgd2hvbGUgaW1wb3J0XG4gICAgICAgICAgLy8gZGVjbGFyYXRpb24gYW5kIGluc2VydCBpdCBhdCB0aGUgaW1wb3J0IHN0YXJ0IGluZGV4LiBPdGhlcndpc2UsIHdlIGp1c3RcbiAgICAgICAgICAvLyB1cGRhdGUgdGhlIG5hbWVkIGJpbmRpbmdzIHRvIG5vdCByZS1wcmludCB0aGUgd2hvbGUgaW1wb3J0ICh3aGljaCBjb3VsZFxuICAgICAgICAgIC8vIGNhdXNlIHVubmVjZXNzYXJ5IGZvcm1hdHRpbmcgY2hhbmdlcylcbiAgICAgICAgICBpZiAoaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5BRERFRCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRJbXBvcnQgPSB0cy5mYWN0b3J5LnVwZGF0ZUltcG9ydERlY2xhcmF0aW9uKFxuICAgICAgICAgICAgICBpbXBvcnREYXRhLm5vZGUsXG4gICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICB0cy5mYWN0b3J5LmNyZWF0ZUltcG9ydENsYXVzZShmYWxzZSwgdW5kZWZpbmVkLCB1cGRhdGVkQmluZGluZ3MpLFxuICAgICAgICAgICAgICB0cy5mYWN0b3J5LmNyZWF0ZVN0cmluZ0xpdGVyYWwoaW1wb3J0RGF0YS5tb2R1bGVOYW1lKSxcbiAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld0ltcG9ydFRleHQgPSB0aGlzLl9wcmludGVyLnByaW50Tm9kZShcbiAgICAgICAgICAgICAgdHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsXG4gICAgICAgICAgICAgIHVwZGF0ZWRJbXBvcnQsXG4gICAgICAgICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChcbiAgICAgICAgICAgICAgaW1wb3J0U3RhcnRJbmRleCxcbiAgICAgICAgICAgICAgaW1wb3J0U3RhcnRJbmRleCA9PT0gMCA/IGAke25ld0ltcG9ydFRleHR9XFxuYCA6IGBcXG4ke25ld0ltcG9ydFRleHR9YCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLk1PRElGSUVEKSkge1xuICAgICAgICAgICAgY29uc3QgbmV3TmFtZWRCaW5kaW5nc1RleHQgPSB0aGlzLl9wcmludGVyLnByaW50Tm9kZShcbiAgICAgICAgICAgICAgdHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsXG4gICAgICAgICAgICAgIHVwZGF0ZWRCaW5kaW5ncyxcbiAgICAgICAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZWNvcmRlci5yZW1vdmUobmFtZWRCaW5kaW5ncy5nZXRTdGFydCgpLCBuYW1lZEJpbmRpbmdzLmdldFdpZHRoKCkpO1xuICAgICAgICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQobmFtZWRCaW5kaW5ncy5nZXRTdGFydCgpLCBuZXdOYW1lZEJpbmRpbmdzVGV4dCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuQURERUQpKSB7XG4gICAgICAgICAgY29uc3QgbmV3SW1wb3J0VGV4dCA9IHRoaXMuX3ByaW50ZXIucHJpbnROb2RlKFxuICAgICAgICAgICAgdHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsXG4gICAgICAgICAgICBpbXBvcnREYXRhLm5vZGUsXG4gICAgICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChcbiAgICAgICAgICAgIGltcG9ydFN0YXJ0SW5kZXgsXG4gICAgICAgICAgICBpbXBvcnRTdGFydEluZGV4ID09PSAwID8gYCR7bmV3SW1wb3J0VGV4dH1cXG5gIDogYFxcbiR7bmV3SW1wb3J0VGV4dH1gLFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2Ugc2hvdWxkIG5ldmVyIGhpdCB0aGlzLCBidXQgd2UgcmF0aGVyIHdhbnQgdG8gcHJpbnQgYSBjdXN0b20gZXhjZXB0aW9uXG4gICAgICAgIC8vIGluc3RlYWQgb2YganVzdCBza2lwcGluZyBpbXBvcnRzIHNpbGVudGx5LlxuICAgICAgICB0aHJvdyBFcnJvcignVW5leHBlY3RlZCBpbXBvcnQgbW9kaWZpY2F0aW9uLicpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ29ycmVjdHMgdGhlIGxpbmUgYW5kIGNoYXJhY3RlciBwb3NpdGlvbiBvZiBhIGdpdmVuIG5vZGUuIFNpbmNlIG5vZGVzIG9mXG4gICAqIHNvdXJjZSBmaWxlcyBhcmUgaW1tdXRhYmxlIGFuZCB3ZSBzb21ldGltZXMgbWFrZSBjaGFuZ2VzIHRvIHRoZSBjb250YWluaW5nXG4gICAqIHNvdXJjZSBmaWxlLCB0aGUgbm9kZSBwb3NpdGlvbiBtaWdodCBzaGlmdCAoZS5nLiBpZiB3ZSBhZGQgYSBuZXcgaW1wb3J0IGJlZm9yZSkuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSB1c2VkIHRvIHJldHJpZXZlIGEgY29ycmVjdGVkIHBvc2l0aW9uIG9mIHRoZSBnaXZlbiBub2RlLiBUaGlzXG4gICAqIGlzIGhlbHBmdWwgd2hlbiBwcmludGluZyBvdXQgZXJyb3IgbWVzc2FnZXMgd2hpY2ggc2hvdWxkIHJlZmxlY3QgdGhlIG5ldyBzdGF0ZSBvZlxuICAgKiBzb3VyY2UgZmlsZXMuXG4gICAqL1xuICBjb3JyZWN0Tm9kZVBvc2l0aW9uKG5vZGU6IHRzLk5vZGUsIG9mZnNldDogbnVtYmVyLCBwb3NpdGlvbjogdHMuTGluZUFuZENoYXJhY3Rlcikge1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcblxuICAgIGlmICghdGhpcy5faW1wb3J0Q2FjaGUuaGFzKHNvdXJjZUZpbGUpKSB7XG4gICAgICByZXR1cm4gcG9zaXRpb247XG4gICAgfVxuXG4gICAgY29uc3QgbmV3UG9zaXRpb246IHRzLkxpbmVBbmRDaGFyYWN0ZXIgPSB7Li4ucG9zaXRpb259O1xuICAgIGNvbnN0IGZpbGVJbXBvcnRzID0gdGhpcy5faW1wb3J0Q2FjaGUuZ2V0KHNvdXJjZUZpbGUpITtcblxuICAgIGZvciAobGV0IGltcG9ydERhdGEgb2YgZmlsZUltcG9ydHMpIHtcbiAgICAgIGNvbnN0IGZ1bGxFbmQgPSBpbXBvcnREYXRhLm5vZGUuZ2V0RnVsbFN0YXJ0KCkgKyBpbXBvcnREYXRhLm5vZGUuZ2V0RnVsbFdpZHRoKCk7XG4gICAgICAvLyBTdWJ0cmFjdCBvciBhZGQgbGluZXMgYmFzZWQgb24gd2hldGhlciBhbiBpbXBvcnQgaGFzIGJlZW4gZGVsZXRlZCBvciByZW1vdmVkXG4gICAgICAvLyBiZWZvcmUgdGhlIGFjdHVhbCBub2RlIG9mZnNldC5cbiAgICAgIGlmIChvZmZzZXQgPiBmdWxsRW5kICYmIGhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuREVMRVRFRCkpIHtcbiAgICAgICAgbmV3UG9zaXRpb24ubGluZS0tO1xuICAgICAgfSBlbHNlIGlmIChvZmZzZXQgPiBmdWxsRW5kICYmIGhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuQURERUQpKSB7XG4gICAgICAgIG5ld1Bvc2l0aW9uLmxpbmUrKztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld1Bvc2l0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gdW5pcXVlIGlkZW50aWZpZXIgbmFtZSBmb3IgdGhlIHNwZWNpZmllZCBzeW1ib2wgbmFtZS5cbiAgICogQHBhcmFtIHNvdXJjZUZpbGUgU291cmNlIGZpbGUgdG8gY2hlY2sgZm9yIGlkZW50aWZpZXIgY29sbGlzaW9ucy5cbiAgICogQHBhcmFtIHN5bWJvbE5hbWUgTmFtZSBvZiB0aGUgc3ltYm9sIGZvciB3aGljaCB3ZSB3YW50IHRvIGdlbmVyYXRlIGFuIHVuaXF1ZSBuYW1lLlxuICAgKiBAcGFyYW0gaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMgTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCBzaG91bGQgYmUgaWdub3JlZCB3aGVuXG4gICAqICAgIGNoZWNraW5nIGZvciBpZGVudGlmaWVyIGNvbGxpc2lvbnMgaW4gdGhlIGdpdmVuIHNvdXJjZSBmaWxlLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0VW5pcXVlSWRlbnRpZmllcihcbiAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICAgIHN5bWJvbE5hbWU6IHN0cmluZyxcbiAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9uczogdHMuSWRlbnRpZmllcltdLFxuICApOiB0cy5JZGVudGlmaWVyIHtcbiAgICBpZiAodGhpcy5faXNVbmlxdWVJZGVudGlmaWVyTmFtZShzb3VyY2VGaWxlLCBzeW1ib2xOYW1lLCBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucykpIHtcbiAgICAgIHRoaXMuX3JlY29yZFVzZWRJZGVudGlmaWVyKHNvdXJjZUZpbGUsIHN5bWJvbE5hbWUpO1xuICAgICAgcmV0dXJuIHRzLmZhY3RvcnkuY3JlYXRlSWRlbnRpZmllcihzeW1ib2xOYW1lKTtcbiAgICB9XG5cbiAgICBsZXQgbmFtZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IGNvdW50ZXIgPSAxO1xuICAgIGRvIHtcbiAgICAgIG5hbWUgPSBgJHtzeW1ib2xOYW1lfV8ke2NvdW50ZXIrK31gO1xuICAgIH0gd2hpbGUgKCF0aGlzLl9pc1VuaXF1ZUlkZW50aWZpZXJOYW1lKHNvdXJjZUZpbGUsIG5hbWUsIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zKSk7XG5cbiAgICB0aGlzLl9yZWNvcmRVc2VkSWRlbnRpZmllcihzb3VyY2VGaWxlLCBuYW1lISk7XG4gICAgcmV0dXJuIHRzLmZhY3RvcnkuY3JlYXRlSWRlbnRpZmllcihuYW1lISk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBpZGVudGlmaWVyIG5hbWUgaXMgdXNlZCB3aXRoaW4gdGhlIGdpdmVuIHNvdXJjZSBmaWxlLlxuICAgKiBAcGFyYW0gc291cmNlRmlsZSBTb3VyY2UgZmlsZSB0byBjaGVjayBmb3IgaWRlbnRpZmllciBjb2xsaXNpb25zLlxuICAgKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSBpZGVudGlmaWVyIHdoaWNoIGlzIGNoZWNrZWQgZm9yIGl0cyB1bmlxdWVuZXNzLlxuICAgKiBAcGFyYW0gaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMgTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCBzaG91bGQgYmUgaWdub3JlZCB3aGVuXG4gICAqICAgIGNoZWNraW5nIGZvciBpZGVudGlmaWVyIGNvbGxpc2lvbnMgaW4gdGhlIGdpdmVuIHNvdXJjZSBmaWxlLlxuICAgKi9cbiAgcHJpdmF0ZSBfaXNVbmlxdWVJZGVudGlmaWVyTmFtZShcbiAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9uczogdHMuSWRlbnRpZmllcltdLFxuICApIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLl91c2VkSWRlbnRpZmllck5hbWVzLmhhcyhzb3VyY2VGaWxlKSAmJlxuICAgICAgdGhpcy5fdXNlZElkZW50aWZpZXJOYW1lcy5nZXQoc291cmNlRmlsZSkhLmluZGV4T2YobmFtZSkgIT09IC0xXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gV2FsayB0aHJvdWdoIHRoZSBzb3VyY2UgZmlsZSBhbmQgc2VhcmNoIGZvciBhbiBpZGVudGlmaWVyIG1hdGNoaW5nXG4gICAgLy8gdGhlIGdpdmVuIG5hbWUuIEluIHRoYXQgY2FzZSwgaXQncyBub3QgZ3VhcmFudGVlZCB0aGF0IHRoaXMgbmFtZVxuICAgIC8vIGlzIHVuaXF1ZSBpbiB0aGUgZ2l2ZW4gZGVjbGFyYXRpb24gc2NvcGUgYW5kIHdlIGp1c3QgcmV0dXJuIGZhbHNlLlxuICAgIGNvbnN0IG5vZGVRdWV1ZTogdHMuTm9kZVtdID0gW3NvdXJjZUZpbGVdO1xuICAgIHdoaWxlIChub2RlUXVldWUubGVuZ3RoKSB7XG4gICAgICBjb25zdCBub2RlID0gbm9kZVF1ZXVlLnNoaWZ0KCkhO1xuICAgICAgaWYgKFxuICAgICAgICB0cy5pc0lkZW50aWZpZXIobm9kZSkgJiZcbiAgICAgICAgbm9kZS50ZXh0ID09PSBuYW1lICYmXG4gICAgICAgICFpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucy5pbmNsdWRlcyhub2RlKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIG5vZGVRdWV1ZS5wdXNoKC4uLm5vZGUuZ2V0Q2hpbGRyZW4oKSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY29yZHMgdGhhdCB0aGUgZ2l2ZW4gaWRlbnRpZmllciBpcyB1c2VkIHdpdGhpbiB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlLiBUaGlzXG4gICAqIGlzIG5lY2Vzc2FyeSBzaW5jZSB3ZSBkbyBub3QgYXBwbHkgY2hhbmdlcyB0byBzb3VyY2UgZmlsZXMgcGVyIGNoYW5nZSwgYnV0IHN0aWxsXG4gICAqIHdhbnQgdG8gYXZvaWQgY29uZmxpY3RzIHdpdGggbmV3bHkgaW1wb3J0ZWQgc3ltYm9scy5cbiAgICovXG4gIHByaXZhdGUgX3JlY29yZFVzZWRJZGVudGlmaWVyKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIGlkZW50aWZpZXJOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLl91c2VkSWRlbnRpZmllck5hbWVzLnNldChcbiAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAodGhpcy5fdXNlZElkZW50aWZpZXJOYW1lcy5nZXQoc291cmNlRmlsZSkgfHwgW10pLmNvbmNhdChpZGVudGlmaWVyTmFtZSksXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHRoZSBmdWxsIGVuZCBvZiBhIGdpdmVuIG5vZGUuIEJ5IGRlZmF1bHQgdGhlIGVuZCBwb3NpdGlvbiBvZiBhIG5vZGUgaXNcbiAgICogYmVmb3JlIGFsbCB0cmFpbGluZyBjb21tZW50cy4gVGhpcyBjb3VsZCBtZWFuIHRoYXQgZ2VuZXJhdGVkIGltcG9ydHMgc2hpZnQgY29tbWVudHMuXG4gICAqL1xuICBwcml2YXRlIF9nZXRFbmRQb3NpdGlvbk9mTm9kZShub2RlOiB0cy5Ob2RlKSB7XG4gICAgY29uc3Qgbm9kZUVuZFBvcyA9IG5vZGUuZ2V0RW5kKCk7XG4gICAgY29uc3QgY29tbWVudFJhbmdlcyA9IHRzLmdldFRyYWlsaW5nQ29tbWVudFJhbmdlcyhub2RlLmdldFNvdXJjZUZpbGUoKS50ZXh0LCBub2RlRW5kUG9zKTtcbiAgICBpZiAoIWNvbW1lbnRSYW5nZXMgfHwgIWNvbW1lbnRSYW5nZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbm9kZUVuZFBvcztcbiAgICB9XG4gICAgcmV0dXJuIGNvbW1lbnRSYW5nZXNbY29tbWVudFJhbmdlcy5sZW5ndGggLSAxXSEuZW5kO1xuICB9XG59XG5cbi8vIFRPRE8oY3Jpc2JldG8pOiBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBsYXllciB0aGF0IGFsbG93cyB1cyB0byBzdXBwb3J0IGJvdGggVFMgNC40IGFuZCA0LjUuXG4vLyBTaG91bGQgYmUgcmVtb3ZlZCBvbmNlIHdlIGRvbid0IGhhdmUgdG8gc3VwcG9ydCA0LjQgYW55bW9yZS5cbmZ1bmN0aW9uIGNyZWF0ZUltcG9ydFNwZWNpZmllcihcbiAgcHJvcGVydHlOYW1lOiB0cy5JZGVudGlmaWVyIHwgdW5kZWZpbmVkLFxuICBuYW1lOiB0cy5JZGVudGlmaWVyLFxuKTogdHMuSW1wb3J0U3BlY2lmaWVyIHtcbiAgcmV0dXJuIFBBUlNFRF9UU19WRVJTSU9OID4gNC40XG4gICAgPyB0cy5mYWN0b3J5LmNyZWF0ZUltcG9ydFNwZWNpZmllcihmYWxzZSwgcHJvcGVydHlOYW1lLCBuYW1lKVxuICAgIDogKHRzLmNyZWF0ZUltcG9ydFNwZWNpZmllciBhcyBhbnkpKHByb3BlcnR5TmFtZSwgbmFtZSk7XG59XG4iXX0=