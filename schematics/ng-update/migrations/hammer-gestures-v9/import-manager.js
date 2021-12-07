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
                    const updatedBindings = ts.updateNamedImports(namedBindings, importSpecifiers);
                    // In case an import has been added newly, we need to print the whole import
                    // declaration and insert it at the import start index. Otherwise, we just
                    // update the named bindings to not re-print the whole import (which could
                    // cause unnecessary formatting changes)
                    if (hasFlag(importData, 4 /* ADDED */)) {
                        // TODO(crisbeto): needs to be cast to any until g3 is updated to TS 4.5.
                        const updatedImport = ts.updateImportDeclaration(importData.node, undefined, undefined, ts.createImportClause(undefined, updatedBindings), ts.createStringLiteral(importData.moduleName), undefined);
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
        ? ts.createImportSpecifier(false, propertyName, name)
        : ts.createImportSpecifier(propertyName, name);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9oYW1tZXItZ2VzdHVyZXMtdjkvaW1wb3J0LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBR0gsK0JBQXNDO0FBQ3RDLGlDQUFpQztBQTRCakMsdUVBQXVFO0FBQ3ZFLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBb0IsRUFBRSxJQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXZGLHFFQUFxRTtBQUNyRSxNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUUzRDs7OztHQUlHO0FBQ0gsTUFBYSxhQUFhO0lBT3hCLFlBQW9CLFdBQXVCLEVBQVUsUUFBb0I7UUFBckQsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBTnpFLHNFQUFzRTtRQUM5RCx5QkFBb0IsR0FBRyxJQUFJLEdBQUcsRUFBMkIsQ0FBQztRQUVsRSxzREFBc0Q7UUFDOUMsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBbUMsQ0FBQztJQUVVLENBQUM7SUFFN0U7Ozs7O09BS0c7SUFDSyx1QkFBdUIsQ0FBQyxVQUF5QjtRQUN2RCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFFLENBQUM7U0FDM0M7UUFFRCxNQUFNLE1BQU0sR0FBcUIsRUFBRSxDQUFDO1FBQ3BDLEtBQUssSUFBSSxJQUFJLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRTtZQUN0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TUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3pGLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQzNDLE9BQU8sVUFBVSxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUM7SUFDdEQsQ0FBQztDQUNGO0FBaGVELHNDQWdlQztBQUVELCtGQUErRjtBQUMvRiwrREFBK0Q7QUFDL0QsU0FBUyxxQkFBcUIsQ0FDNUIsWUFBdUMsRUFDdkMsSUFBbUI7SUFFbkIsT0FBTyxpQkFBaUIsR0FBRyxHQUFHO1FBQzVCLENBQUMsQ0FBRSxFQUFFLENBQUMscUJBQTZCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUM7UUFDOUQsQ0FBQyxDQUFFLEVBQUUsQ0FBQyxxQkFBNkIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDNUQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZpbGVTeXN0ZW19IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7ZGlybmFtZSwgcmVzb2x2ZX0gZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLy8gdHNsaW50OmRpc2FibGU6bm8tYml0d2lzZVxuXG4vKiogRW51bSBkZXNjcmliaW5nIHRoZSBwb3NzaWJsZSBzdGF0ZXMgb2YgYW4gYW5hbHl6ZWQgaW1wb3J0LiAqL1xuY29uc3QgZW51bSBJbXBvcnRTdGF0ZSB7XG4gIFVOTU9ESUZJRUQgPSAwYjAsXG4gIE1PRElGSUVEID0gMGIxMCxcbiAgQURERUQgPSAwYjEwMCxcbiAgREVMRVRFRCA9IDBiMTAwMCxcbn1cblxuLyoqIEludGVyZmFjZSBkZXNjcmliaW5nIGFuIGltcG9ydCBzcGVjaWZpZXIuICovXG5pbnRlcmZhY2UgSW1wb3J0U3BlY2lmaWVyIHtcbiAgbmFtZTogdHMuSWRlbnRpZmllcjtcbiAgcHJvcGVydHlOYW1lPzogdHMuSWRlbnRpZmllcjtcbn1cblxuLyoqIEludGVyZmFjZSBkZXNjcmliaW5nIGFuIGFuYWx5emVkIGltcG9ydC4gKi9cbmludGVyZmFjZSBBbmFseXplZEltcG9ydCB7XG4gIG5vZGU6IHRzLkltcG9ydERlY2xhcmF0aW9uO1xuICBtb2R1bGVOYW1lOiBzdHJpbmc7XG4gIG5hbWU/OiB0cy5JZGVudGlmaWVyO1xuICBzcGVjaWZpZXJzPzogSW1wb3J0U3BlY2lmaWVyW107XG4gIG5hbWVzcGFjZT86IGJvb2xlYW47XG4gIHN0YXRlOiBJbXBvcnRTdGF0ZTtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIGFuIGFuYWx5emVkIGltcG9ydCBoYXMgdGhlIGdpdmVuIGltcG9ydCBmbGFnIHNldC4gKi9cbmNvbnN0IGhhc0ZsYWcgPSAoZGF0YTogQW5hbHl6ZWRJbXBvcnQsIGZsYWc6IEltcG9ydFN0YXRlKSA9PiAoZGF0YS5zdGF0ZSAmIGZsYWcpICE9PSAwO1xuXG4vKiogUGFyc2VkIHZlcnNpb24gb2YgVHlwZVNjcmlwdCB0aGF0IGNhbiBiZSB1c2VkIGZvciBjb21wYXJpc29ucy4gKi9cbmNvbnN0IFBBUlNFRF9UU19WRVJTSU9OID0gcGFyc2VGbG9hdCh0cy52ZXJzaW9uTWFqb3JNaW5vcik7XG5cbi8qKlxuICogSW1wb3J0IG1hbmFnZXIgdGhhdCBjYW4gYmUgdXNlZCB0byBhZGQgb3IgcmVtb3ZlIFR5cGVTY3JpcHQgaW1wb3J0cyB3aXRoaW4gc291cmNlXG4gKiBmaWxlcy4gVGhlIG1hbmFnZXIgZW5zdXJlcyB0aGF0IG11bHRpcGxlIHRyYW5zZm9ybWF0aW9ucyBhcmUgYXBwbGllZCBwcm9wZXJseVxuICogd2l0aG91dCBzaGlmdGVkIG9mZnNldHMgYW5kIHRoYXQgZXhpc3RpbmcgaW1wb3J0cyBhcmUgcmUtdXNlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIEltcG9ydE1hbmFnZXIge1xuICAvKiogTWFwIG9mIHNvdXJjZS1maWxlcyBhbmQgdGhlaXIgcHJldmlvdXNseSB1c2VkIGlkZW50aWZpZXIgbmFtZXMuICovXG4gIHByaXZhdGUgX3VzZWRJZGVudGlmaWVyTmFtZXMgPSBuZXcgTWFwPHRzLlNvdXJjZUZpbGUsIHN0cmluZ1tdPigpO1xuXG4gIC8qKiBNYXAgb2Ygc291cmNlIGZpbGVzIGFuZCB0aGVpciBhbmFseXplZCBpbXBvcnRzLiAqL1xuICBwcml2YXRlIF9pbXBvcnRDYWNoZSA9IG5ldyBNYXA8dHMuU291cmNlRmlsZSwgQW5hbHl6ZWRJbXBvcnRbXT4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9maWxlU3lzdGVtOiBGaWxlU3lzdGVtLCBwcml2YXRlIF9wcmludGVyOiB0cy5QcmludGVyKSB7fVxuXG4gIC8qKlxuICAgKiBBbmFseXplcyB0aGUgaW1wb3J0IG9mIHRoZSBzcGVjaWZpZWQgc291cmNlIGZpbGUgaWYgbmVlZGVkLiBJbiBvcmRlciB0byBwZXJmb3JtXG4gICAqIG1vZGlmaWNhdGlvbnMgdG8gaW1wb3J0cyBvZiBhIHNvdXJjZSBmaWxlLCB3ZSBzdG9yZSBhbGwgaW1wb3J0cyBpbiBtZW1vcnkgYW5kXG4gICAqIHVwZGF0ZSB0aGUgc291cmNlIGZpbGUgb25jZSBhbGwgY2hhbmdlcyBoYXZlIGJlZW4gbWFkZS4gVGhpcyBpcyBlc3NlbnRpYWwgdG9cbiAgICogZW5zdXJlIHRoYXQgd2UgY2FuIHJlLXVzZSBuZXdseSBhZGRlZCBpbXBvcnRzIGFuZCBub3QgYnJlYWsgZmlsZSBvZmZzZXRzLlxuICAgKi9cbiAgcHJpdmF0ZSBfYW5hbHl6ZUltcG9ydHNJZk5lZWRlZChzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogQW5hbHl6ZWRJbXBvcnRbXSB7XG4gICAgaWYgKHRoaXMuX2ltcG9ydENhY2hlLmhhcyhzb3VyY2VGaWxlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2ltcG9ydENhY2hlLmdldChzb3VyY2VGaWxlKSE7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0OiBBbmFseXplZEltcG9ydFtdID0gW107XG4gICAgZm9yIChsZXQgbm9kZSBvZiBzb3VyY2VGaWxlLnN0YXRlbWVudHMpIHtcbiAgICAgIGlmICghdHMuaXNJbXBvcnREZWNsYXJhdGlvbihub2RlKSB8fCAhdHMuaXNTdHJpbmdMaXRlcmFsKG5vZGUubW9kdWxlU3BlY2lmaWVyKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbW9kdWxlTmFtZSA9IG5vZGUubW9kdWxlU3BlY2lmaWVyLnRleHQ7XG5cbiAgICAgIC8vIEhhbmRsZXMgc2lkZS1lZmZlY3QgaW1wb3J0cyB3aGljaCBkbyBuZWl0aGVyIGhhdmUgYSBuYW1lIG9yXG4gICAgICAvLyBzcGVjaWZpZXJzLiBlLmcuIGBpbXBvcnQgXCJteS1wYWNrYWdlXCI7YFxuICAgICAgaWYgKCFub2RlLmltcG9ydENsYXVzZSkge1xuICAgICAgICByZXN1bHQucHVzaCh7bW9kdWxlTmFtZSwgbm9kZSwgc3RhdGU6IEltcG9ydFN0YXRlLlVOTU9ESUZJRUR9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZXMgaW1wb3J0cyByZXNvbHZpbmcgdG8gZGVmYXVsdCBleHBvcnRzIG9mIGEgbW9kdWxlLlxuICAgICAgLy8gZS5nLiBgaW1wb3J0IG1vbWVudCBmcm9tIFwibW9tZW50XCI7YFxuICAgICAgaWYgKCFub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgbmFtZTogbm9kZS5pbXBvcnRDbGF1c2UubmFtZSxcbiAgICAgICAgICBzdGF0ZTogSW1wb3J0U3RhdGUuVU5NT0RJRklFRCxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGVzIGltcG9ydHMgd2l0aCBpbmRpdmlkdWFsIHN5bWJvbCBzcGVjaWZpZXJzLlxuICAgICAgLy8gZS5nLiBgaW1wb3J0IHtBLCBCLCBDfSBmcm9tIFwibXktbW9kdWxlXCI7YFxuICAgICAgaWYgKHRzLmlzTmFtZWRJbXBvcnRzKG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgc3BlY2lmaWVyczogbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cy5tYXAoZWwgPT4gKHtcbiAgICAgICAgICAgIG5hbWU6IGVsLm5hbWUsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IGVsLnByb3BlcnR5TmFtZSxcbiAgICAgICAgICB9KSksXG4gICAgICAgICAgc3RhdGU6IEltcG9ydFN0YXRlLlVOTU9ESUZJRUQsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSGFuZGxlcyBuYW1lc3BhY2VkIGltcG9ydHMuIGUuZy4gYGltcG9ydCAqIGFzIGNvcmUgZnJvbSBcIm15LXBrZ1wiO2BcbiAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBuYW1lOiBub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzLm5hbWUsXG4gICAgICAgICAgbmFtZXNwYWNlOiB0cnVlLFxuICAgICAgICAgIHN0YXRlOiBJbXBvcnRTdGF0ZS5VTk1PRElGSUVELFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5faW1wb3J0Q2FjaGUuc2V0KHNvdXJjZUZpbGUsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gc3BlY2lmaWVyLCB3aGljaCBjYW4gYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgcGF0aCxcbiAgICogbWF0Y2hlcyB0aGUgcGFzc2VkIG1vZHVsZSBuYW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBfaXNNb2R1bGVTcGVjaWZpZXJNYXRjaGluZyhcbiAgICBiYXNlUGF0aDogc3RyaW5nLFxuICAgIHNwZWNpZmllcjogc3RyaW5nLFxuICAgIG1vZHVsZU5hbWU6IHN0cmluZyxcbiAgKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHNwZWNpZmllci5zdGFydHNXaXRoKCcuJylcbiAgICAgID8gcmVzb2x2ZShiYXNlUGF0aCwgc3BlY2lmaWVyKSA9PT0gcmVzb2x2ZShiYXNlUGF0aCwgbW9kdWxlTmFtZSlcbiAgICAgIDogc3BlY2lmaWVyID09PSBtb2R1bGVOYW1lO1xuICB9XG5cbiAgLyoqIERlbGV0ZXMgYSBnaXZlbiBuYW1lZCBiaW5kaW5nIGltcG9ydCBmcm9tIHRoZSBzcGVjaWZpZWQgc291cmNlIGZpbGUuICovXG4gIGRlbGV0ZU5hbWVkQmluZGluZ0ltcG9ydChzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCBzeW1ib2xOYW1lOiBzdHJpbmcsIG1vZHVsZU5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHNvdXJjZURpciA9IGRpcm5hbWUoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgY29uc3QgZmlsZUltcG9ydHMgPSB0aGlzLl9hbmFseXplSW1wb3J0c0lmTmVlZGVkKHNvdXJjZUZpbGUpO1xuXG4gICAgZm9yIChsZXQgaW1wb3J0RGF0YSBvZiBmaWxlSW1wb3J0cykge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5faXNNb2R1bGVTcGVjaWZpZXJNYXRjaGluZyhzb3VyY2VEaXIsIGltcG9ydERhdGEubW9kdWxlTmFtZSwgbW9kdWxlTmFtZSkgfHxcbiAgICAgICAgIWltcG9ydERhdGEuc3BlY2lmaWVyc1xuICAgICAgKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzcGVjaWZpZXJJbmRleCA9IGltcG9ydERhdGEuc3BlY2lmaWVycy5maW5kSW5kZXgoXG4gICAgICAgIGQgPT4gKGQucHJvcGVydHlOYW1lIHx8IGQubmFtZSkudGV4dCA9PT0gc3ltYm9sTmFtZSxcbiAgICAgICk7XG4gICAgICBpZiAoc3BlY2lmaWVySW5kZXggIT09IC0xKSB7XG4gICAgICAgIGltcG9ydERhdGEuc3BlY2lmaWVycy5zcGxpY2Uoc3BlY2lmaWVySW5kZXgsIDEpO1xuICAgICAgICAvLyBpZiB0aGUgaW1wb3J0IGRvZXMgbm8gbG9uZ2VyIGNvbnRhaW4gYW55IHNwZWNpZmllcnMgYWZ0ZXIgdGhlIHJlbW92YWwgb2YgdGhlXG4gICAgICAgIC8vIGdpdmVuIHN5bWJvbCwgd2UgY2FuIGp1c3QgbWFyayB0aGUgd2hvbGUgaW1wb3J0IGZvciBkZWxldGlvbi4gT3RoZXJ3aXNlLCB3ZSBtYXJrXG4gICAgICAgIC8vIGl0IGFzIG1vZGlmaWVkIHNvIHRoYXQgaXQgd2lsbCBiZSByZS1wcmludGVkLlxuICAgICAgICBpZiAoaW1wb3J0RGF0YS5zcGVjaWZpZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGltcG9ydERhdGEuc3RhdGUgfD0gSW1wb3J0U3RhdGUuREVMRVRFRDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbXBvcnREYXRhLnN0YXRlIHw9IEltcG9ydFN0YXRlLk1PRElGSUVEO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIERlbGV0ZXMgdGhlIGltcG9ydCB0aGF0IG1hdGNoZXMgdGhlIGdpdmVuIGltcG9ydCBkZWNsYXJhdGlvbiBpZiBmb3VuZC4gKi9cbiAgZGVsZXRlSW1wb3J0QnlEZWNsYXJhdGlvbihkZWNsYXJhdGlvbjogdHMuSW1wb3J0RGVjbGFyYXRpb24pIHtcbiAgICBjb25zdCBmaWxlSW1wb3J0cyA9IHRoaXMuX2FuYWx5emVJbXBvcnRzSWZOZWVkZWQoZGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpKTtcbiAgICBmb3IgKGxldCBpbXBvcnREYXRhIG9mIGZpbGVJbXBvcnRzKSB7XG4gICAgICBpZiAoaW1wb3J0RGF0YS5ub2RlID09PSBkZWNsYXJhdGlvbikge1xuICAgICAgICBpbXBvcnREYXRhLnN0YXRlIHw9IEltcG9ydFN0YXRlLkRFTEVURUQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gaW1wb3J0IHRvIHRoZSBnaXZlbiBzb3VyY2UgZmlsZSBhbmQgcmV0dXJucyB0aGUgVHlwZVNjcmlwdCBleHByZXNzaW9uIHRoYXRcbiAgICogY2FuIGJlIHVzZWQgdG8gYWNjZXNzIHRoZSBuZXdseSBpbXBvcnRlZCBzeW1ib2wuXG4gICAqXG4gICAqIFdoZW5ldmVyIGFuIGltcG9ydCBpcyBhZGRlZCB0byBhIHNvdXJjZSBmaWxlLCBpdCdzIHJlY29tbWVuZGVkIHRoYXQgdGhlIHJldHVybmVkXG4gICAqIGV4cHJlc3Npb24gaXMgdXNlZCB0byByZWZlcmVuY2UgdGggc3ltYm9sLiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHRoZSBzeW1ib2xcbiAgICogY291bGQgYmUgYWxpYXNlZCBpZiBpdCB3b3VsZCBjb2xsaWRlIHdpdGggZXhpc3RpbmcgaW1wb3J0cyBpbiBzb3VyY2UgZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIHNvdXJjZUZpbGUgU291cmNlIGZpbGUgdG8gd2hpY2ggdGhlIGltcG9ydCBzaG91bGQgYmUgYWRkZWQuXG4gICAqIEBwYXJhbSBzeW1ib2xOYW1lIE5hbWUgb2YgdGhlIHN5bWJvbCB0aGF0IHNob3VsZCBiZSBpbXBvcnRlZC4gQ2FuIGJlIG51bGwgaWZcbiAgICogICAgdGhlIGRlZmF1bHQgZXhwb3J0IGlzIHJlcXVlc3RlZC5cbiAgICogQHBhcmFtIG1vZHVsZU5hbWUgTmFtZSBvZiB0aGUgbW9kdWxlIG9mIHdoaWNoIHRoZSBzeW1ib2wgc2hvdWxkIGJlIGltcG9ydGVkLlxuICAgKiBAcGFyYW0gdHlwZUltcG9ydCBXaGV0aGVyIHRoZSBzeW1ib2wgaXMgYSB0eXBlLlxuICAgKiBAcGFyYW0gaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMgTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCBjYW4gYmUgaWdub3JlZCB3aGVuXG4gICAqICAgIHRoZSBpbXBvcnQgbWFuYWdlciBjaGVja3MgZm9yIGltcG9ydCBjb2xsaXNpb25zLlxuICAgKi9cbiAgYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsXG4gICAgc3ltYm9sTmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBtb2R1bGVOYW1lOiBzdHJpbmcsXG4gICAgdHlwZUltcG9ydCA9IGZhbHNlLFxuICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zOiB0cy5JZGVudGlmaWVyW10gPSBbXSxcbiAgKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgY29uc3Qgc291cmNlRGlyID0gZGlybmFtZShzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICBjb25zdCBmaWxlSW1wb3J0cyA9IHRoaXMuX2FuYWx5emVJbXBvcnRzSWZOZWVkZWQoc291cmNlRmlsZSk7XG5cbiAgICBsZXQgZXhpc3RpbmdJbXBvcnQ6IEFuYWx5emVkSW1wb3J0IHwgbnVsbCA9IG51bGw7XG4gICAgZm9yIChsZXQgaW1wb3J0RGF0YSBvZiBmaWxlSW1wb3J0cykge1xuICAgICAgaWYgKCF0aGlzLl9pc01vZHVsZVNwZWNpZmllck1hdGNoaW5nKHNvdXJjZURpciwgaW1wb3J0RGF0YS5tb2R1bGVOYW1lLCBtb2R1bGVOYW1lKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgbm8gc3ltYm9sIG5hbWUgaGFzIGJlZW4gc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCBpbXBvcnQgaXMgcmVxdWVzdGVkLiBJbiB0aGF0XG4gICAgICAvLyBjYXNlIHdlIHNlYXJjaCBmb3Igbm9uLW5hbWVzcGFjZSBhbmQgbm9uLXNwZWNpZmllciBpbXBvcnRzLlxuICAgICAgaWYgKCFzeW1ib2xOYW1lICYmICFpbXBvcnREYXRhLm5hbWVzcGFjZSAmJiAhaW1wb3J0RGF0YS5zcGVjaWZpZXJzKSB7XG4gICAgICAgIHJldHVybiB0cy5jcmVhdGVJZGVudGlmaWVyKGltcG9ydERhdGEubmFtZSEudGV4dCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEluIGNhc2UgYSBcIlR5cGVcIiBzeW1ib2wgaXMgaW1wb3J0ZWQsIHdlIGNhbid0IHVzZSBuYW1lc3BhY2UgaW1wb3J0c1xuICAgICAgLy8gYmVjYXVzZSB0aGVzZSBvbmx5IGV4cG9ydCBzeW1ib2xzIGF2YWlsYWJsZSBhdCBydW50aW1lIChubyB0eXBlcylcbiAgICAgIGlmIChpbXBvcnREYXRhLm5hbWVzcGFjZSAmJiAhdHlwZUltcG9ydCkge1xuICAgICAgICByZXR1cm4gdHMuY3JlYXRlUHJvcGVydHlBY2Nlc3MoXG4gICAgICAgICAgdHMuY3JlYXRlSWRlbnRpZmllcihpbXBvcnREYXRhLm5hbWUhLnRleHQpLFxuICAgICAgICAgIHRzLmNyZWF0ZUlkZW50aWZpZXIoc3ltYm9sTmFtZSB8fCAnZGVmYXVsdCcpLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChpbXBvcnREYXRhLnNwZWNpZmllcnMgJiYgc3ltYm9sTmFtZSkge1xuICAgICAgICBjb25zdCBleGlzdGluZ1NwZWNpZmllciA9IGltcG9ydERhdGEuc3BlY2lmaWVycy5maW5kKHMgPT5cbiAgICAgICAgICBzLnByb3BlcnR5TmFtZSA/IHMucHJvcGVydHlOYW1lLnRleHQgPT09IHN5bWJvbE5hbWUgOiBzLm5hbWUudGV4dCA9PT0gc3ltYm9sTmFtZSxcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoZXhpc3RpbmdTcGVjaWZpZXIpIHtcbiAgICAgICAgICByZXR1cm4gdHMuY3JlYXRlSWRlbnRpZmllcihleGlzdGluZ1NwZWNpZmllci5uYW1lLnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW4gY2FzZSB0aGUgc3ltYm9sIGNvdWxkIG5vdCBiZSBmb3VuZCBpbiBhbiBleGlzdGluZyBpbXBvcnQsIHdlXG4gICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgdGhlIGltcG9ydCBkZWNsYXJhdGlvbiBhcyBpdCBjYW4gYmUgdXBkYXRlZCB0byBpbmNsdWRlXG4gICAgICAgIC8vIHRoZSBzcGVjaWZpZWQgc3ltYm9sIG5hbWUgd2l0aG91dCBoYXZpbmcgdG8gY3JlYXRlIGEgbmV3IGltcG9ydC5cbiAgICAgICAgZXhpc3RpbmdJbXBvcnQgPSBpbXBvcnREYXRhO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGlzIGFuIGV4aXN0aW5nIGltcG9ydCB0aGF0IG1hdGNoZXMgdGhlIHNwZWNpZmllZCBtb2R1bGUsIHdlXG4gICAgLy8ganVzdCB1cGRhdGUgdGhlIGltcG9ydCBzcGVjaWZpZXJzIHRvIGFsc28gaW1wb3J0IHRoZSByZXF1ZXN0ZWQgc3ltYm9sLlxuICAgIGlmIChleGlzdGluZ0ltcG9ydCkge1xuICAgICAgY29uc3QgcHJvcGVydHlJZGVudGlmaWVyID0gdHMuY3JlYXRlSWRlbnRpZmllcihzeW1ib2xOYW1lISk7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyID0gdGhpcy5fZ2V0VW5pcXVlSWRlbnRpZmllcihcbiAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgc3ltYm9sTmFtZSEsXG4gICAgICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5lZWRzR2VuZXJhdGVkVW5pcXVlTmFtZSA9IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIudGV4dCAhPT0gc3ltYm9sTmFtZTtcbiAgICAgIGNvbnN0IGltcG9ydE5hbWUgPSBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPyBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyIDogcHJvcGVydHlJZGVudGlmaWVyO1xuXG4gICAgICBleGlzdGluZ0ltcG9ydC5zcGVjaWZpZXJzIS5wdXNoKHtcbiAgICAgICAgbmFtZTogaW1wb3J0TmFtZSxcbiAgICAgICAgcHJvcGVydHlOYW1lOiBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPyBwcm9wZXJ0eUlkZW50aWZpZXIgOiB1bmRlZmluZWQsXG4gICAgICB9KTtcbiAgICAgIGV4aXN0aW5nSW1wb3J0LnN0YXRlIHw9IEltcG9ydFN0YXRlLk1PRElGSUVEO1xuXG4gICAgICBpZiAoaGFzRmxhZyhleGlzdGluZ0ltcG9ydCwgSW1wb3J0U3RhdGUuREVMRVRFRCkpIHtcbiAgICAgICAgLy8gdW5zZXQgdGhlIGRlbGV0ZWQgZmxhZyBpZiB0aGUgaW1wb3J0IGlzIHBlbmRpbmcgZGVsZXRpb24sIGJ1dFxuICAgICAgICAvLyBjYW4gbm93IGJlIHVzZWQgZm9yIHRoZSBuZXcgaW1wb3J0ZWQgc3ltYm9sLlxuICAgICAgICBleGlzdGluZ0ltcG9ydC5zdGF0ZSAmPSB+SW1wb3J0U3RhdGUuREVMRVRFRDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGltcG9ydE5hbWU7XG4gICAgfVxuXG4gICAgbGV0IGlkZW50aWZpZXI6IHRzLklkZW50aWZpZXIgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgbmV3SW1wb3J0OiBBbmFseXplZEltcG9ydCB8IG51bGwgPSBudWxsO1xuXG4gICAgaWYgKHN5bWJvbE5hbWUpIHtcbiAgICAgIGNvbnN0IHByb3BlcnR5SWRlbnRpZmllciA9IHRzLmNyZWF0ZUlkZW50aWZpZXIoc3ltYm9sTmFtZSk7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyID0gdGhpcy5fZ2V0VW5pcXVlSWRlbnRpZmllcihcbiAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgc3ltYm9sTmFtZSxcbiAgICAgICAgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMsXG4gICAgICApO1xuICAgICAgY29uc3QgbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID0gZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllci50ZXh0ICE9PSBzeW1ib2xOYW1lO1xuICAgICAgaWRlbnRpZmllciA9IG5lZWRzR2VuZXJhdGVkVW5pcXVlTmFtZSA/IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIgOiBwcm9wZXJ0eUlkZW50aWZpZXI7XG5cbiAgICAgIGNvbnN0IG5ld0ltcG9ydERlY2wgPSB0cy5jcmVhdGVJbXBvcnREZWNsYXJhdGlvbihcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHRzLmNyZWF0ZUltcG9ydENsYXVzZSh1bmRlZmluZWQsIHRzLmNyZWF0ZU5hbWVkSW1wb3J0cyhbXSkpLFxuICAgICAgICB0cy5jcmVhdGVTdHJpbmdMaXRlcmFsKG1vZHVsZU5hbWUpLFxuICAgICAgKTtcblxuICAgICAgbmV3SW1wb3J0ID0ge1xuICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICBub2RlOiBuZXdJbXBvcnREZWNsLFxuICAgICAgICBzcGVjaWZpZXJzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPyBwcm9wZXJ0eUlkZW50aWZpZXIgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBuYW1lOiBpZGVudGlmaWVyLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHN0YXRlOiBJbXBvcnRTdGF0ZS5BRERFRCxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkZW50aWZpZXIgPSB0aGlzLl9nZXRVbmlxdWVJZGVudGlmaWVyKFxuICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAnZGVmYXVsdEV4cG9ydCcsXG4gICAgICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5ld0ltcG9ydERlY2wgPSB0cy5jcmVhdGVJbXBvcnREZWNsYXJhdGlvbihcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHRzLmNyZWF0ZUltcG9ydENsYXVzZShpZGVudGlmaWVyLCB1bmRlZmluZWQpLFxuICAgICAgICB0cy5jcmVhdGVTdHJpbmdMaXRlcmFsKG1vZHVsZU5hbWUpLFxuICAgICAgKTtcbiAgICAgIG5ld0ltcG9ydCA9IHtcbiAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgbm9kZTogbmV3SW1wb3J0RGVjbCxcbiAgICAgICAgbmFtZTogaWRlbnRpZmllcixcbiAgICAgICAgc3RhdGU6IEltcG9ydFN0YXRlLkFEREVELFxuICAgICAgfTtcbiAgICB9XG4gICAgZmlsZUltcG9ydHMucHVzaChuZXdJbXBvcnQpO1xuICAgIHJldHVybiBpZGVudGlmaWVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgdGhlIHJlY29yZGVkIGNoYW5nZXMgaW4gdGhlIHVwZGF0ZSByZWNvcmRlcnMgb2YgdGhlIGNvcnJlc3BvbmRpbmcgc291cmNlIGZpbGVzLlxuICAgKiBUaGUgY2hhbmdlcyBhcmUgYXBwbGllZCBzZXBhcmF0ZWx5IGFmdGVyIGFsbCBjaGFuZ2VzIGhhdmUgYmVlbiByZWNvcmRlZCBiZWNhdXNlIG90aGVyd2lzZVxuICAgKiBmaWxlIG9mZnNldHMgd2lsbCBjaGFuZ2UgYW5kIHRoZSBzb3VyY2UgZmlsZXMgd291bGQgbmVlZCB0byBiZSByZS1wYXJzZWQgYWZ0ZXIgZWFjaCBjaGFuZ2UuXG4gICAqL1xuICByZWNvcmRDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2ltcG9ydENhY2hlLmZvckVhY2goKGZpbGVJbXBvcnRzLCBzb3VyY2VGaWxlKSA9PiB7XG4gICAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0uZWRpdCh0aGlzLl9maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSkpO1xuICAgICAgY29uc3QgbGFzdFVubW9kaWZpZWRJbXBvcnQgPSBmaWxlSW1wb3J0c1xuICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgIC5maW5kKGkgPT4gaS5zdGF0ZSA9PT0gSW1wb3J0U3RhdGUuVU5NT0RJRklFRCk7XG4gICAgICBjb25zdCBpbXBvcnRTdGFydEluZGV4ID0gbGFzdFVubW9kaWZpZWRJbXBvcnRcbiAgICAgICAgPyB0aGlzLl9nZXRFbmRQb3NpdGlvbk9mTm9kZShsYXN0VW5tb2RpZmllZEltcG9ydC5ub2RlKVxuICAgICAgICA6IDA7XG5cbiAgICAgIGZpbGVJbXBvcnRzLmZvckVhY2goaW1wb3J0RGF0YSA9PiB7XG4gICAgICAgIGlmIChpbXBvcnREYXRhLnN0YXRlID09PSBJbXBvcnRTdGF0ZS5VTk1PRElGSUVEKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuREVMRVRFRCkpIHtcbiAgICAgICAgICAvLyBJbXBvcnRzIHdoaWNoIGRvIG5vdCBleGlzdCBpbiBzb3VyY2UgZmlsZSwgY2FuIGJlIGp1c3Qgc2tpcHBlZCBhc1xuICAgICAgICAgIC8vIHdlIGRvIG5vdCBuZWVkIGFueSByZXBsYWNlbWVudCB0byBkZWxldGUgdGhlIGltcG9ydC5cbiAgICAgICAgICBpZiAoIWhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuQURERUQpKSB7XG4gICAgICAgICAgICByZWNvcmRlci5yZW1vdmUoaW1wb3J0RGF0YS5ub2RlLmdldEZ1bGxTdGFydCgpLCBpbXBvcnREYXRhLm5vZGUuZ2V0RnVsbFdpZHRoKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW1wb3J0RGF0YS5zcGVjaWZpZXJzKSB7XG4gICAgICAgICAgY29uc3QgbmFtZWRCaW5kaW5ncyA9IGltcG9ydERhdGEubm9kZS5pbXBvcnRDbGF1c2UhLm5hbWVkQmluZGluZ3MgYXMgdHMuTmFtZWRJbXBvcnRzO1xuICAgICAgICAgIGNvbnN0IGltcG9ydFNwZWNpZmllcnMgPSBpbXBvcnREYXRhLnNwZWNpZmllcnMubWFwKHMgPT5cbiAgICAgICAgICAgIGNyZWF0ZUltcG9ydFNwZWNpZmllcihzLnByb3BlcnR5TmFtZSwgcy5uYW1lKSxcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbnN0IHVwZGF0ZWRCaW5kaW5ncyA9IHRzLnVwZGF0ZU5hbWVkSW1wb3J0cyhuYW1lZEJpbmRpbmdzLCBpbXBvcnRTcGVjaWZpZXJzKTtcblxuICAgICAgICAgIC8vIEluIGNhc2UgYW4gaW1wb3J0IGhhcyBiZWVuIGFkZGVkIG5ld2x5LCB3ZSBuZWVkIHRvIHByaW50IHRoZSB3aG9sZSBpbXBvcnRcbiAgICAgICAgICAvLyBkZWNsYXJhdGlvbiBhbmQgaW5zZXJ0IGl0IGF0IHRoZSBpbXBvcnQgc3RhcnQgaW5kZXguIE90aGVyd2lzZSwgd2UganVzdFxuICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgbmFtZWQgYmluZGluZ3MgdG8gbm90IHJlLXByaW50IHRoZSB3aG9sZSBpbXBvcnQgKHdoaWNoIGNvdWxkXG4gICAgICAgICAgLy8gY2F1c2UgdW5uZWNlc3NhcnkgZm9ybWF0dGluZyBjaGFuZ2VzKVxuICAgICAgICAgIGlmIChoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkFEREVEKSkge1xuICAgICAgICAgICAgLy8gVE9ETyhjcmlzYmV0byk6IG5lZWRzIHRvIGJlIGNhc3QgdG8gYW55IHVudGlsIGczIGlzIHVwZGF0ZWQgdG8gVFMgNC41LlxuICAgICAgICAgICAgY29uc3QgdXBkYXRlZEltcG9ydCA9ICh0cy51cGRhdGVJbXBvcnREZWNsYXJhdGlvbiBhcyBhbnkpKFxuICAgICAgICAgICAgICBpbXBvcnREYXRhLm5vZGUsXG4gICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICB0cy5jcmVhdGVJbXBvcnRDbGF1c2UodW5kZWZpbmVkLCB1cGRhdGVkQmluZGluZ3MpLFxuICAgICAgICAgICAgICB0cy5jcmVhdGVTdHJpbmdMaXRlcmFsKGltcG9ydERhdGEubW9kdWxlTmFtZSksXG4gICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBuZXdJbXBvcnRUZXh0ID0gdGhpcy5fcHJpbnRlci5wcmludE5vZGUoXG4gICAgICAgICAgICAgIHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLFxuICAgICAgICAgICAgICB1cGRhdGVkSW1wb3J0LFxuICAgICAgICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlY29yZGVyLmluc2VydExlZnQoXG4gICAgICAgICAgICAgIGltcG9ydFN0YXJ0SW5kZXgsXG4gICAgICAgICAgICAgIGltcG9ydFN0YXJ0SW5kZXggPT09IDAgPyBgJHtuZXdJbXBvcnRUZXh0fVxcbmAgOiBgXFxuJHtuZXdJbXBvcnRUZXh0fWAsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5NT0RJRklFRCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld05hbWVkQmluZGluZ3NUZXh0ID0gdGhpcy5fcHJpbnRlci5wcmludE5vZGUoXG4gICAgICAgICAgICAgIHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLFxuICAgICAgICAgICAgICB1cGRhdGVkQmluZGluZ3MsXG4gICAgICAgICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmVjb3JkZXIucmVtb3ZlKG5hbWVkQmluZGluZ3MuZ2V0U3RhcnQoKSwgbmFtZWRCaW5kaW5ncy5nZXRXaWR0aCgpKTtcbiAgICAgICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5hbWVkQmluZGluZ3MuZ2V0U3RhcnQoKSwgbmV3TmFtZWRCaW5kaW5nc1RleHQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkFEREVEKSkge1xuICAgICAgICAgIGNvbnN0IG5ld0ltcG9ydFRleHQgPSB0aGlzLl9wcmludGVyLnByaW50Tm9kZShcbiAgICAgICAgICAgIHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLFxuICAgICAgICAgICAgaW1wb3J0RGF0YS5ub2RlLFxuICAgICAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgICApO1xuICAgICAgICAgIHJlY29yZGVyLmluc2VydExlZnQoXG4gICAgICAgICAgICBpbXBvcnRTdGFydEluZGV4LFxuICAgICAgICAgICAgaW1wb3J0U3RhcnRJbmRleCA9PT0gMCA/IGAke25ld0ltcG9ydFRleHR9XFxuYCA6IGBcXG4ke25ld0ltcG9ydFRleHR9YCxcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlIHNob3VsZCBuZXZlciBoaXQgdGhpcywgYnV0IHdlIHJhdGhlciB3YW50IHRvIHByaW50IGEgY3VzdG9tIGV4Y2VwdGlvblxuICAgICAgICAvLyBpbnN0ZWFkIG9mIGp1c3Qgc2tpcHBpbmcgaW1wb3J0cyBzaWxlbnRseS5cbiAgICAgICAgdGhyb3cgRXJyb3IoJ1VuZXhwZWN0ZWQgaW1wb3J0IG1vZGlmaWNhdGlvbi4nKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcnJlY3RzIHRoZSBsaW5lIGFuZCBjaGFyYWN0ZXIgcG9zaXRpb24gb2YgYSBnaXZlbiBub2RlLiBTaW5jZSBub2RlcyBvZlxuICAgKiBzb3VyY2UgZmlsZXMgYXJlIGltbXV0YWJsZSBhbmQgd2Ugc29tZXRpbWVzIG1ha2UgY2hhbmdlcyB0byB0aGUgY29udGFpbmluZ1xuICAgKiBzb3VyY2UgZmlsZSwgdGhlIG5vZGUgcG9zaXRpb24gbWlnaHQgc2hpZnQgKGUuZy4gaWYgd2UgYWRkIGEgbmV3IGltcG9ydCBiZWZvcmUpLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCB0byByZXRyaWV2ZSBhIGNvcnJlY3RlZCBwb3NpdGlvbiBvZiB0aGUgZ2l2ZW4gbm9kZS4gVGhpc1xuICAgKiBpcyBoZWxwZnVsIHdoZW4gcHJpbnRpbmcgb3V0IGVycm9yIG1lc3NhZ2VzIHdoaWNoIHNob3VsZCByZWZsZWN0IHRoZSBuZXcgc3RhdGUgb2ZcbiAgICogc291cmNlIGZpbGVzLlxuICAgKi9cbiAgY29ycmVjdE5vZGVQb3NpdGlvbihub2RlOiB0cy5Ob2RlLCBvZmZzZXQ6IG51bWJlciwgcG9zaXRpb246IHRzLkxpbmVBbmRDaGFyYWN0ZXIpIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG5cbiAgICBpZiAoIXRoaXMuX2ltcG9ydENhY2hlLmhhcyhzb3VyY2VGaWxlKSkge1xuICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld1Bvc2l0aW9uOiB0cy5MaW5lQW5kQ2hhcmFjdGVyID0gey4uLnBvc2l0aW9ufTtcbiAgICBjb25zdCBmaWxlSW1wb3J0cyA9IHRoaXMuX2ltcG9ydENhY2hlLmdldChzb3VyY2VGaWxlKSE7XG5cbiAgICBmb3IgKGxldCBpbXBvcnREYXRhIG9mIGZpbGVJbXBvcnRzKSB7XG4gICAgICBjb25zdCBmdWxsRW5kID0gaW1wb3J0RGF0YS5ub2RlLmdldEZ1bGxTdGFydCgpICsgaW1wb3J0RGF0YS5ub2RlLmdldEZ1bGxXaWR0aCgpO1xuICAgICAgLy8gU3VidHJhY3Qgb3IgYWRkIGxpbmVzIGJhc2VkIG9uIHdoZXRoZXIgYW4gaW1wb3J0IGhhcyBiZWVuIGRlbGV0ZWQgb3IgcmVtb3ZlZFxuICAgICAgLy8gYmVmb3JlIHRoZSBhY3R1YWwgbm9kZSBvZmZzZXQuXG4gICAgICBpZiAob2Zmc2V0ID4gZnVsbEVuZCAmJiBoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkRFTEVURUQpKSB7XG4gICAgICAgIG5ld1Bvc2l0aW9uLmxpbmUtLTtcbiAgICAgIH0gZWxzZSBpZiAob2Zmc2V0ID4gZnVsbEVuZCAmJiBoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkFEREVEKSkge1xuICAgICAgICBuZXdQb3NpdGlvbi5saW5lKys7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdQb3NpdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIHVuaXF1ZSBpZGVudGlmaWVyIG5hbWUgZm9yIHRoZSBzcGVjaWZpZWQgc3ltYm9sIG5hbWUuXG4gICAqIEBwYXJhbSBzb3VyY2VGaWxlIFNvdXJjZSBmaWxlIHRvIGNoZWNrIGZvciBpZGVudGlmaWVyIGNvbGxpc2lvbnMuXG4gICAqIEBwYXJhbSBzeW1ib2xOYW1lIE5hbWUgb2YgdGhlIHN5bWJvbCBmb3Igd2hpY2ggd2Ugd2FudCB0byBnZW5lcmF0ZSBhbiB1bmlxdWUgbmFtZS5cbiAgICogQHBhcmFtIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggc2hvdWxkIGJlIGlnbm9yZWQgd2hlblxuICAgKiAgICBjaGVja2luZyBmb3IgaWRlbnRpZmllciBjb2xsaXNpb25zIGluIHRoZSBnaXZlbiBzb3VyY2UgZmlsZS5cbiAgICovXG4gIHByaXZhdGUgX2dldFVuaXF1ZUlkZW50aWZpZXIoXG4gICAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSxcbiAgICBzeW1ib2xOYW1lOiBzdHJpbmcsXG4gICAgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnM6IHRzLklkZW50aWZpZXJbXSxcbiAgKTogdHMuSWRlbnRpZmllciB7XG4gICAgaWYgKHRoaXMuX2lzVW5pcXVlSWRlbnRpZmllck5hbWUoc291cmNlRmlsZSwgc3ltYm9sTmFtZSwgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMpKSB7XG4gICAgICB0aGlzLl9yZWNvcmRVc2VkSWRlbnRpZmllcihzb3VyY2VGaWxlLCBzeW1ib2xOYW1lKTtcbiAgICAgIHJldHVybiB0cy5jcmVhdGVJZGVudGlmaWVyKHN5bWJvbE5hbWUpO1xuICAgIH1cblxuICAgIGxldCBuYW1lOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgY291bnRlciA9IDE7XG4gICAgZG8ge1xuICAgICAgbmFtZSA9IGAke3N5bWJvbE5hbWV9XyR7Y291bnRlcisrfWA7XG4gICAgfSB3aGlsZSAoIXRoaXMuX2lzVW5pcXVlSWRlbnRpZmllck5hbWUoc291cmNlRmlsZSwgbmFtZSwgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMpKTtcblxuICAgIHRoaXMuX3JlY29yZFVzZWRJZGVudGlmaWVyKHNvdXJjZUZpbGUsIG5hbWUhKTtcbiAgICByZXR1cm4gdHMuY3JlYXRlSWRlbnRpZmllcihuYW1lISk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBpZGVudGlmaWVyIG5hbWUgaXMgdXNlZCB3aXRoaW4gdGhlIGdpdmVuIHNvdXJjZSBmaWxlLlxuICAgKiBAcGFyYW0gc291cmNlRmlsZSBTb3VyY2UgZmlsZSB0byBjaGVjayBmb3IgaWRlbnRpZmllciBjb2xsaXNpb25zLlxuICAgKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSBpZGVudGlmaWVyIHdoaWNoIGlzIGNoZWNrZWQgZm9yIGl0cyB1bmlxdWVuZXNzLlxuICAgKiBAcGFyYW0gaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMgTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCBzaG91bGQgYmUgaWdub3JlZCB3aGVuXG4gICAqICAgIGNoZWNraW5nIGZvciBpZGVudGlmaWVyIGNvbGxpc2lvbnMgaW4gdGhlIGdpdmVuIHNvdXJjZSBmaWxlLlxuICAgKi9cbiAgcHJpdmF0ZSBfaXNVbmlxdWVJZGVudGlmaWVyTmFtZShcbiAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9uczogdHMuSWRlbnRpZmllcltdLFxuICApIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLl91c2VkSWRlbnRpZmllck5hbWVzLmhhcyhzb3VyY2VGaWxlKSAmJlxuICAgICAgdGhpcy5fdXNlZElkZW50aWZpZXJOYW1lcy5nZXQoc291cmNlRmlsZSkhLmluZGV4T2YobmFtZSkgIT09IC0xXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gV2FsayB0aHJvdWdoIHRoZSBzb3VyY2UgZmlsZSBhbmQgc2VhcmNoIGZvciBhbiBpZGVudGlmaWVyIG1hdGNoaW5nXG4gICAgLy8gdGhlIGdpdmVuIG5hbWUuIEluIHRoYXQgY2FzZSwgaXQncyBub3QgZ3VhcmFudGVlZCB0aGF0IHRoaXMgbmFtZVxuICAgIC8vIGlzIHVuaXF1ZSBpbiB0aGUgZ2l2ZW4gZGVjbGFyYXRpb24gc2NvcGUgYW5kIHdlIGp1c3QgcmV0dXJuIGZhbHNlLlxuICAgIGNvbnN0IG5vZGVRdWV1ZTogdHMuTm9kZVtdID0gW3NvdXJjZUZpbGVdO1xuICAgIHdoaWxlIChub2RlUXVldWUubGVuZ3RoKSB7XG4gICAgICBjb25zdCBub2RlID0gbm9kZVF1ZXVlLnNoaWZ0KCkhO1xuICAgICAgaWYgKFxuICAgICAgICB0cy5pc0lkZW50aWZpZXIobm9kZSkgJiZcbiAgICAgICAgbm9kZS50ZXh0ID09PSBuYW1lICYmXG4gICAgICAgICFpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucy5pbmNsdWRlcyhub2RlKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIG5vZGVRdWV1ZS5wdXNoKC4uLm5vZGUuZ2V0Q2hpbGRyZW4oKSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY29yZHMgdGhhdCB0aGUgZ2l2ZW4gaWRlbnRpZmllciBpcyB1c2VkIHdpdGhpbiB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlLiBUaGlzXG4gICAqIGlzIG5lY2Vzc2FyeSBzaW5jZSB3ZSBkbyBub3QgYXBwbHkgY2hhbmdlcyB0byBzb3VyY2UgZmlsZXMgcGVyIGNoYW5nZSwgYnV0IHN0aWxsXG4gICAqIHdhbnQgdG8gYXZvaWQgY29uZmxpY3RzIHdpdGggbmV3bHkgaW1wb3J0ZWQgc3ltYm9scy5cbiAgICovXG4gIHByaXZhdGUgX3JlY29yZFVzZWRJZGVudGlmaWVyKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIGlkZW50aWZpZXJOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLl91c2VkSWRlbnRpZmllck5hbWVzLnNldChcbiAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAodGhpcy5fdXNlZElkZW50aWZpZXJOYW1lcy5nZXQoc291cmNlRmlsZSkgfHwgW10pLmNvbmNhdChpZGVudGlmaWVyTmFtZSksXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHRoZSBmdWxsIGVuZCBvZiBhIGdpdmVuIG5vZGUuIEJ5IGRlZmF1bHQgdGhlIGVuZCBwb3NpdGlvbiBvZiBhIG5vZGUgaXNcbiAgICogYmVmb3JlIGFsbCB0cmFpbGluZyBjb21tZW50cy4gVGhpcyBjb3VsZCBtZWFuIHRoYXQgZ2VuZXJhdGVkIGltcG9ydHMgc2hpZnQgY29tbWVudHMuXG4gICAqL1xuICBwcml2YXRlIF9nZXRFbmRQb3NpdGlvbk9mTm9kZShub2RlOiB0cy5Ob2RlKSB7XG4gICAgY29uc3Qgbm9kZUVuZFBvcyA9IG5vZGUuZ2V0RW5kKCk7XG4gICAgY29uc3QgY29tbWVudFJhbmdlcyA9IHRzLmdldFRyYWlsaW5nQ29tbWVudFJhbmdlcyhub2RlLmdldFNvdXJjZUZpbGUoKS50ZXh0LCBub2RlRW5kUG9zKTtcbiAgICBpZiAoIWNvbW1lbnRSYW5nZXMgfHwgIWNvbW1lbnRSYW5nZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbm9kZUVuZFBvcztcbiAgICB9XG4gICAgcmV0dXJuIGNvbW1lbnRSYW5nZXNbY29tbWVudFJhbmdlcy5sZW5ndGggLSAxXSEuZW5kO1xuICB9XG59XG5cbi8vIFRPRE8oY3Jpc2JldG8pOiBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBsYXllciB0aGF0IGFsbG93cyB1cyB0byBzdXBwb3J0IGJvdGggVFMgNC40IGFuZCA0LjUuXG4vLyBTaG91bGQgYmUgcmVtb3ZlZCBvbmNlIHdlIGRvbid0IGhhdmUgdG8gc3VwcG9ydCA0LjQgYW55bW9yZS5cbmZ1bmN0aW9uIGNyZWF0ZUltcG9ydFNwZWNpZmllcihcbiAgcHJvcGVydHlOYW1lOiB0cy5JZGVudGlmaWVyIHwgdW5kZWZpbmVkLFxuICBuYW1lOiB0cy5JZGVudGlmaWVyLFxuKTogdHMuSW1wb3J0U3BlY2lmaWVyIHtcbiAgcmV0dXJuIFBBUlNFRF9UU19WRVJTSU9OID4gNC40XG4gICAgPyAodHMuY3JlYXRlSW1wb3J0U3BlY2lmaWVyIGFzIGFueSkoZmFsc2UsIHByb3BlcnR5TmFtZSwgbmFtZSlcbiAgICA6ICh0cy5jcmVhdGVJbXBvcnRTcGVjaWZpZXIgYXMgYW55KShwcm9wZXJ0eU5hbWUsIG5hbWUpO1xufVxuIl19