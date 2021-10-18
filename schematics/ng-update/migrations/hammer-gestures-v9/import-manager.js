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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9oYW1tZXItZ2VzdHVyZXMtdjkvaW1wb3J0LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBR0gsK0JBQXNDO0FBQ3RDLGlDQUFpQztBQTRCakMsdUVBQXVFO0FBQ3ZFLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBb0IsRUFBRSxJQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXZGOzs7O0dBSUc7QUFDSCxNQUFhLGFBQWE7SUFPeEIsWUFBb0IsV0FBdUIsRUFBVSxRQUFvQjtRQUFyRCxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVk7UUFOekUsc0VBQXNFO1FBQzlELHlCQUFvQixHQUFHLElBQUksR0FBRyxFQUEyQixDQUFDO1FBRWxFLHNEQUFzRDtRQUM5QyxpQkFBWSxHQUFHLElBQUksR0FBRyxFQUFtQyxDQUFDO0lBRVUsQ0FBQztJQUU3RTs7Ozs7T0FLRztJQUNLLHVCQUF1QixDQUFDLFVBQXlCO1FBQ3ZELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDckMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUUsQ0FBQztTQUMzQztRQUVELE1BQU0sTUFBTSxHQUFxQixFQUFFLENBQUM7UUFDcEMsS0FBSyxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsVUFBVSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFD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LENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3pGLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQzNDLE9BQU8sVUFBVSxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUM7SUFDdEQsQ0FBQztDQUNGO0FBOWRELHNDQThkQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZpbGVTeXN0ZW19IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7ZGlybmFtZSwgcmVzb2x2ZX0gZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLy8gdHNsaW50OmRpc2FibGU6bm8tYml0d2lzZVxuXG4vKiogRW51bSBkZXNjcmliaW5nIHRoZSBwb3NzaWJsZSBzdGF0ZXMgb2YgYW4gYW5hbHl6ZWQgaW1wb3J0LiAqL1xuY29uc3QgZW51bSBJbXBvcnRTdGF0ZSB7XG4gIFVOTU9ESUZJRUQgPSAwYjAsXG4gIE1PRElGSUVEID0gMGIxMCxcbiAgQURERUQgPSAwYjEwMCxcbiAgREVMRVRFRCA9IDBiMTAwMCxcbn1cblxuLyoqIEludGVyZmFjZSBkZXNjcmliaW5nIGFuIGltcG9ydCBzcGVjaWZpZXIuICovXG5pbnRlcmZhY2UgSW1wb3J0U3BlY2lmaWVyIHtcbiAgbmFtZTogdHMuSWRlbnRpZmllcjtcbiAgcHJvcGVydHlOYW1lPzogdHMuSWRlbnRpZmllcjtcbn1cblxuLyoqIEludGVyZmFjZSBkZXNjcmliaW5nIGFuIGFuYWx5emVkIGltcG9ydC4gKi9cbmludGVyZmFjZSBBbmFseXplZEltcG9ydCB7XG4gIG5vZGU6IHRzLkltcG9ydERlY2xhcmF0aW9uO1xuICBtb2R1bGVOYW1lOiBzdHJpbmc7XG4gIG5hbWU/OiB0cy5JZGVudGlmaWVyO1xuICBzcGVjaWZpZXJzPzogSW1wb3J0U3BlY2lmaWVyW107XG4gIG5hbWVzcGFjZT86IGJvb2xlYW47XG4gIHN0YXRlOiBJbXBvcnRTdGF0ZTtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIGFuIGFuYWx5emVkIGltcG9ydCBoYXMgdGhlIGdpdmVuIGltcG9ydCBmbGFnIHNldC4gKi9cbmNvbnN0IGhhc0ZsYWcgPSAoZGF0YTogQW5hbHl6ZWRJbXBvcnQsIGZsYWc6IEltcG9ydFN0YXRlKSA9PiAoZGF0YS5zdGF0ZSAmIGZsYWcpICE9PSAwO1xuXG4vKipcbiAqIEltcG9ydCBtYW5hZ2VyIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWRkIG9yIHJlbW92ZSBUeXBlU2NyaXB0IGltcG9ydHMgd2l0aGluIHNvdXJjZVxuICogZmlsZXMuIFRoZSBtYW5hZ2VyIGVuc3VyZXMgdGhhdCBtdWx0aXBsZSB0cmFuc2Zvcm1hdGlvbnMgYXJlIGFwcGxpZWQgcHJvcGVybHlcbiAqIHdpdGhvdXQgc2hpZnRlZCBvZmZzZXRzIGFuZCB0aGF0IGV4aXN0aW5nIGltcG9ydHMgYXJlIHJlLXVzZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbXBvcnRNYW5hZ2VyIHtcbiAgLyoqIE1hcCBvZiBzb3VyY2UtZmlsZXMgYW5kIHRoZWlyIHByZXZpb3VzbHkgdXNlZCBpZGVudGlmaWVyIG5hbWVzLiAqL1xuICBwcml2YXRlIF91c2VkSWRlbnRpZmllck5hbWVzID0gbmV3IE1hcDx0cy5Tb3VyY2VGaWxlLCBzdHJpbmdbXT4oKTtcblxuICAvKiogTWFwIG9mIHNvdXJjZSBmaWxlcyBhbmQgdGhlaXIgYW5hbHl6ZWQgaW1wb3J0cy4gKi9cbiAgcHJpdmF0ZSBfaW1wb3J0Q2FjaGUgPSBuZXcgTWFwPHRzLlNvdXJjZUZpbGUsIEFuYWx5emVkSW1wb3J0W10+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZmlsZVN5c3RlbTogRmlsZVN5c3RlbSwgcHJpdmF0ZSBfcHJpbnRlcjogdHMuUHJpbnRlcikge31cblxuICAvKipcbiAgICogQW5hbHl6ZXMgdGhlIGltcG9ydCBvZiB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlIGlmIG5lZWRlZC4gSW4gb3JkZXIgdG8gcGVyZm9ybVxuICAgKiBtb2RpZmljYXRpb25zIHRvIGltcG9ydHMgb2YgYSBzb3VyY2UgZmlsZSwgd2Ugc3RvcmUgYWxsIGltcG9ydHMgaW4gbWVtb3J5IGFuZFxuICAgKiB1cGRhdGUgdGhlIHNvdXJjZSBmaWxlIG9uY2UgYWxsIGNoYW5nZXMgaGF2ZSBiZWVuIG1hZGUuIFRoaXMgaXMgZXNzZW50aWFsIHRvXG4gICAqIGVuc3VyZSB0aGF0IHdlIGNhbiByZS11c2UgbmV3bHkgYWRkZWQgaW1wb3J0cyBhbmQgbm90IGJyZWFrIGZpbGUgb2Zmc2V0cy5cbiAgICovXG4gIHByaXZhdGUgX2FuYWx5emVJbXBvcnRzSWZOZWVkZWQoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IEFuYWx5emVkSW1wb3J0W10ge1xuICAgIGlmICh0aGlzLl9pbXBvcnRDYWNoZS5oYXMoc291cmNlRmlsZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbXBvcnRDYWNoZS5nZXQoc291cmNlRmlsZSkhO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdDogQW5hbHl6ZWRJbXBvcnRbXSA9IFtdO1xuICAgIGZvciAobGV0IG5vZGUgb2Ygc291cmNlRmlsZS5zdGF0ZW1lbnRzKSB7XG4gICAgICBpZiAoIXRzLmlzSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgfHwgIXRzLmlzU3RyaW5nTGl0ZXJhbChub2RlLm1vZHVsZVNwZWNpZmllcikpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1vZHVsZU5hbWUgPSBub2RlLm1vZHVsZVNwZWNpZmllci50ZXh0O1xuXG4gICAgICAvLyBIYW5kbGVzIHNpZGUtZWZmZWN0IGltcG9ydHMgd2hpY2ggZG8gbmVpdGhlciBoYXZlIGEgbmFtZSBvclxuICAgICAgLy8gc3BlY2lmaWVycy4gZS5nLiBgaW1wb3J0IFwibXktcGFja2FnZVwiO2BcbiAgICAgIGlmICghbm9kZS5pbXBvcnRDbGF1c2UpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goe21vZHVsZU5hbWUsIG5vZGUsIHN0YXRlOiBJbXBvcnRTdGF0ZS5VTk1PRElGSUVEfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGVzIGltcG9ydHMgcmVzb2x2aW5nIHRvIGRlZmF1bHQgZXhwb3J0cyBvZiBhIG1vZHVsZS5cbiAgICAgIC8vIGUuZy4gYGltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO2BcbiAgICAgIGlmICghbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykge1xuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG5hbWU6IG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWUsXG4gICAgICAgICAgc3RhdGU6IEltcG9ydFN0YXRlLlVOTU9ESUZJRUQsXG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlcyBpbXBvcnRzIHdpdGggaW5kaXZpZHVhbCBzeW1ib2wgc3BlY2lmaWVycy5cbiAgICAgIC8vIGUuZy4gYGltcG9ydCB7QSwgQiwgQ30gZnJvbSBcIm15LW1vZHVsZVwiO2BcbiAgICAgIGlmICh0cy5pc05hbWVkSW1wb3J0cyhub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSkge1xuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIHNwZWNpZmllcnM6IG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHMubWFwKGVsID0+ICh7XG4gICAgICAgICAgICBuYW1lOiBlbC5uYW1lLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBlbC5wcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgfSkpLFxuICAgICAgICAgIHN0YXRlOiBJbXBvcnRTdGF0ZS5VTk1PRElGSUVELFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEhhbmRsZXMgbmFtZXNwYWNlZCBpbXBvcnRzLiBlLmcuIGBpbXBvcnQgKiBhcyBjb3JlIGZyb20gXCJteS1wa2dcIjtgXG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgbmFtZTogbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5uYW1lLFxuICAgICAgICAgIG5hbWVzcGFjZTogdHJ1ZSxcbiAgICAgICAgICBzdGF0ZTogSW1wb3J0U3RhdGUuVU5NT0RJRklFRCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2ltcG9ydENhY2hlLnNldChzb3VyY2VGaWxlLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIHNwZWNpZmllciwgd2hpY2ggY2FuIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHBhdGgsXG4gICAqIG1hdGNoZXMgdGhlIHBhc3NlZCBtb2R1bGUgbmFtZS5cbiAgICovXG4gIHByaXZhdGUgX2lzTW9kdWxlU3BlY2lmaWVyTWF0Y2hpbmcoXG4gICAgYmFzZVBhdGg6IHN0cmluZyxcbiAgICBzcGVjaWZpZXI6IHN0cmluZyxcbiAgICBtb2R1bGVOYW1lOiBzdHJpbmcsXG4gICk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBzcGVjaWZpZXIuc3RhcnRzV2l0aCgnLicpXG4gICAgICA/IHJlc29sdmUoYmFzZVBhdGgsIHNwZWNpZmllcikgPT09IHJlc29sdmUoYmFzZVBhdGgsIG1vZHVsZU5hbWUpXG4gICAgICA6IHNwZWNpZmllciA9PT0gbW9kdWxlTmFtZTtcbiAgfVxuXG4gIC8qKiBEZWxldGVzIGEgZ2l2ZW4gbmFtZWQgYmluZGluZyBpbXBvcnQgZnJvbSB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlLiAqL1xuICBkZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgc3ltYm9sTmFtZTogc3RyaW5nLCBtb2R1bGVOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBzb3VyY2VEaXIgPSBkaXJuYW1lKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IGZpbGVJbXBvcnRzID0gdGhpcy5fYW5hbHl6ZUltcG9ydHNJZk5lZWRlZChzb3VyY2VGaWxlKTtcblxuICAgIGZvciAobGV0IGltcG9ydERhdGEgb2YgZmlsZUltcG9ydHMpIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuX2lzTW9kdWxlU3BlY2lmaWVyTWF0Y2hpbmcoc291cmNlRGlyLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUsIG1vZHVsZU5hbWUpIHx8XG4gICAgICAgICFpbXBvcnREYXRhLnNwZWNpZmllcnNcbiAgICAgICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3BlY2lmaWVySW5kZXggPSBpbXBvcnREYXRhLnNwZWNpZmllcnMuZmluZEluZGV4KFxuICAgICAgICBkID0+IChkLnByb3BlcnR5TmFtZSB8fCBkLm5hbWUpLnRleHQgPT09IHN5bWJvbE5hbWUsXG4gICAgICApO1xuICAgICAgaWYgKHNwZWNpZmllckluZGV4ICE9PSAtMSkge1xuICAgICAgICBpbXBvcnREYXRhLnNwZWNpZmllcnMuc3BsaWNlKHNwZWNpZmllckluZGV4LCAxKTtcbiAgICAgICAgLy8gaWYgdGhlIGltcG9ydCBkb2VzIG5vIGxvbmdlciBjb250YWluIGFueSBzcGVjaWZpZXJzIGFmdGVyIHRoZSByZW1vdmFsIG9mIHRoZVxuICAgICAgICAvLyBnaXZlbiBzeW1ib2wsIHdlIGNhbiBqdXN0IG1hcmsgdGhlIHdob2xlIGltcG9ydCBmb3IgZGVsZXRpb24uIE90aGVyd2lzZSwgd2UgbWFya1xuICAgICAgICAvLyBpdCBhcyBtb2RpZmllZCBzbyB0aGF0IGl0IHdpbGwgYmUgcmUtcHJpbnRlZC5cbiAgICAgICAgaWYgKGltcG9ydERhdGEuc3BlY2lmaWVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBpbXBvcnREYXRhLnN0YXRlIHw9IEltcG9ydFN0YXRlLkRFTEVURUQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW1wb3J0RGF0YS5zdGF0ZSB8PSBJbXBvcnRTdGF0ZS5NT0RJRklFRDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBEZWxldGVzIHRoZSBpbXBvcnQgdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBpbXBvcnQgZGVjbGFyYXRpb24gaWYgZm91bmQuICovXG4gIGRlbGV0ZUltcG9ydEJ5RGVjbGFyYXRpb24oZGVjbGFyYXRpb246IHRzLkltcG9ydERlY2xhcmF0aW9uKSB7XG4gICAgY29uc3QgZmlsZUltcG9ydHMgPSB0aGlzLl9hbmFseXplSW1wb3J0c0lmTmVlZGVkKGRlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKSk7XG4gICAgZm9yIChsZXQgaW1wb3J0RGF0YSBvZiBmaWxlSW1wb3J0cykge1xuICAgICAgaWYgKGltcG9ydERhdGEubm9kZSA9PT0gZGVjbGFyYXRpb24pIHtcbiAgICAgICAgaW1wb3J0RGF0YS5zdGF0ZSB8PSBJbXBvcnRTdGF0ZS5ERUxFVEVEO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGltcG9ydCB0byB0aGUgZ2l2ZW4gc291cmNlIGZpbGUgYW5kIHJldHVybnMgdGhlIFR5cGVTY3JpcHQgZXhwcmVzc2lvbiB0aGF0XG4gICAqIGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgbmV3bHkgaW1wb3J0ZWQgc3ltYm9sLlxuICAgKlxuICAgKiBXaGVuZXZlciBhbiBpbXBvcnQgaXMgYWRkZWQgdG8gYSBzb3VyY2UgZmlsZSwgaXQncyByZWNvbW1lbmRlZCB0aGF0IHRoZSByZXR1cm5lZFxuICAgKiBleHByZXNzaW9uIGlzIHVzZWQgdG8gcmVmZXJlbmNlIHRoIHN5bWJvbC4gVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSB0aGUgc3ltYm9sXG4gICAqIGNvdWxkIGJlIGFsaWFzZWQgaWYgaXQgd291bGQgY29sbGlkZSB3aXRoIGV4aXN0aW5nIGltcG9ydHMgaW4gc291cmNlIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBzb3VyY2VGaWxlIFNvdXJjZSBmaWxlIHRvIHdoaWNoIHRoZSBpbXBvcnQgc2hvdWxkIGJlIGFkZGVkLlxuICAgKiBAcGFyYW0gc3ltYm9sTmFtZSBOYW1lIG9mIHRoZSBzeW1ib2wgdGhhdCBzaG91bGQgYmUgaW1wb3J0ZWQuIENhbiBiZSBudWxsIGlmXG4gICAqICAgIHRoZSBkZWZhdWx0IGV4cG9ydCBpcyByZXF1ZXN0ZWQuXG4gICAqIEBwYXJhbSBtb2R1bGVOYW1lIE5hbWUgb2YgdGhlIG1vZHVsZSBvZiB3aGljaCB0aGUgc3ltYm9sIHNob3VsZCBiZSBpbXBvcnRlZC5cbiAgICogQHBhcmFtIHR5cGVJbXBvcnQgV2hldGhlciB0aGUgc3ltYm9sIGlzIGEgdHlwZS5cbiAgICogQHBhcmFtIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggY2FuIGJlIGlnbm9yZWQgd2hlblxuICAgKiAgICB0aGUgaW1wb3J0IG1hbmFnZXIgY2hlY2tzIGZvciBpbXBvcnQgY29sbGlzaW9ucy5cbiAgICovXG4gIGFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICAgIHN5bWJvbE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgbW9kdWxlTmFtZTogc3RyaW5nLFxuICAgIHR5cGVJbXBvcnQgPSBmYWxzZSxcbiAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9uczogdHMuSWRlbnRpZmllcltdID0gW10sXG4gICk6IHRzLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IHNvdXJjZURpciA9IGRpcm5hbWUoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgY29uc3QgZmlsZUltcG9ydHMgPSB0aGlzLl9hbmFseXplSW1wb3J0c0lmTmVlZGVkKHNvdXJjZUZpbGUpO1xuXG4gICAgbGV0IGV4aXN0aW5nSW1wb3J0OiBBbmFseXplZEltcG9ydCB8IG51bGwgPSBudWxsO1xuICAgIGZvciAobGV0IGltcG9ydERhdGEgb2YgZmlsZUltcG9ydHMpIHtcbiAgICAgIGlmICghdGhpcy5faXNNb2R1bGVTcGVjaWZpZXJNYXRjaGluZyhzb3VyY2VEaXIsIGltcG9ydERhdGEubW9kdWxlTmFtZSwgbW9kdWxlTmFtZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIG5vIHN5bWJvbCBuYW1lIGhhcyBiZWVuIHNwZWNpZmllZCwgdGhlIGRlZmF1bHQgaW1wb3J0IGlzIHJlcXVlc3RlZC4gSW4gdGhhdFxuICAgICAgLy8gY2FzZSB3ZSBzZWFyY2ggZm9yIG5vbi1uYW1lc3BhY2UgYW5kIG5vbi1zcGVjaWZpZXIgaW1wb3J0cy5cbiAgICAgIGlmICghc3ltYm9sTmFtZSAmJiAhaW1wb3J0RGF0YS5uYW1lc3BhY2UgJiYgIWltcG9ydERhdGEuc3BlY2lmaWVycykge1xuICAgICAgICByZXR1cm4gdHMuY3JlYXRlSWRlbnRpZmllcihpbXBvcnREYXRhLm5hbWUhLnRleHQpO1xuICAgICAgfVxuXG4gICAgICAvLyBJbiBjYXNlIGEgXCJUeXBlXCIgc3ltYm9sIGlzIGltcG9ydGVkLCB3ZSBjYW4ndCB1c2UgbmFtZXNwYWNlIGltcG9ydHNcbiAgICAgIC8vIGJlY2F1c2UgdGhlc2Ugb25seSBleHBvcnQgc3ltYm9scyBhdmFpbGFibGUgYXQgcnVudGltZSAobm8gdHlwZXMpXG4gICAgICBpZiAoaW1wb3J0RGF0YS5uYW1lc3BhY2UgJiYgIXR5cGVJbXBvcnQpIHtcbiAgICAgICAgcmV0dXJuIHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKFxuICAgICAgICAgIHRzLmNyZWF0ZUlkZW50aWZpZXIoaW1wb3J0RGF0YS5uYW1lIS50ZXh0KSxcbiAgICAgICAgICB0cy5jcmVhdGVJZGVudGlmaWVyKHN5bWJvbE5hbWUgfHwgJ2RlZmF1bHQnKSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoaW1wb3J0RGF0YS5zcGVjaWZpZXJzICYmIHN5bWJvbE5hbWUpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdTcGVjaWZpZXIgPSBpbXBvcnREYXRhLnNwZWNpZmllcnMuZmluZChzID0+XG4gICAgICAgICAgcy5wcm9wZXJ0eU5hbWUgPyBzLnByb3BlcnR5TmFtZS50ZXh0ID09PSBzeW1ib2xOYW1lIDogcy5uYW1lLnRleHQgPT09IHN5bWJvbE5hbWUsXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGV4aXN0aW5nU3BlY2lmaWVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRzLmNyZWF0ZUlkZW50aWZpZXIoZXhpc3RpbmdTcGVjaWZpZXIubmFtZS50ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEluIGNhc2UgdGhlIHN5bWJvbCBjb3VsZCBub3QgYmUgZm91bmQgaW4gYW4gZXhpc3RpbmcgaW1wb3J0LCB3ZVxuICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSBpbXBvcnQgZGVjbGFyYXRpb24gYXMgaXQgY2FuIGJlIHVwZGF0ZWQgdG8gaW5jbHVkZVxuICAgICAgICAvLyB0aGUgc3BlY2lmaWVkIHN5bWJvbCBuYW1lIHdpdGhvdXQgaGF2aW5nIHRvIGNyZWF0ZSBhIG5ldyBpbXBvcnQuXG4gICAgICAgIGV4aXN0aW5nSW1wb3J0ID0gaW1wb3J0RGF0YTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBleGlzdGluZyBpbXBvcnQgdGhhdCBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgbW9kdWxlLCB3ZVxuICAgIC8vIGp1c3QgdXBkYXRlIHRoZSBpbXBvcnQgc3BlY2lmaWVycyB0byBhbHNvIGltcG9ydCB0aGUgcmVxdWVzdGVkIHN5bWJvbC5cbiAgICBpZiAoZXhpc3RpbmdJbXBvcnQpIHtcbiAgICAgIGNvbnN0IHByb3BlcnR5SWRlbnRpZmllciA9IHRzLmNyZWF0ZUlkZW50aWZpZXIoc3ltYm9sTmFtZSEpO1xuICAgICAgY29uc3QgZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllciA9IHRoaXMuX2dldFVuaXF1ZUlkZW50aWZpZXIoXG4gICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgIHN5bWJvbE5hbWUhLFxuICAgICAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyxcbiAgICAgICk7XG4gICAgICBjb25zdCBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPSBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyLnRleHQgIT09IHN5bWJvbE5hbWU7XG4gICAgICBjb25zdCBpbXBvcnROYW1lID0gbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllciA6IHByb3BlcnR5SWRlbnRpZmllcjtcblxuICAgICAgZXhpc3RpbmdJbXBvcnQuc3BlY2lmaWVycyEucHVzaCh7XG4gICAgICAgIG5hbWU6IGltcG9ydE5hbWUsXG4gICAgICAgIHByb3BlcnR5TmFtZTogbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gcHJvcGVydHlJZGVudGlmaWVyIDogdW5kZWZpbmVkLFxuICAgICAgfSk7XG4gICAgICBleGlzdGluZ0ltcG9ydC5zdGF0ZSB8PSBJbXBvcnRTdGF0ZS5NT0RJRklFRDtcblxuICAgICAgaWYgKGhhc0ZsYWcoZXhpc3RpbmdJbXBvcnQsIEltcG9ydFN0YXRlLkRFTEVURUQpKSB7XG4gICAgICAgIC8vIHVuc2V0IHRoZSBkZWxldGVkIGZsYWcgaWYgdGhlIGltcG9ydCBpcyBwZW5kaW5nIGRlbGV0aW9uLCBidXRcbiAgICAgICAgLy8gY2FuIG5vdyBiZSB1c2VkIGZvciB0aGUgbmV3IGltcG9ydGVkIHN5bWJvbC5cbiAgICAgICAgZXhpc3RpbmdJbXBvcnQuc3RhdGUgJj0gfkltcG9ydFN0YXRlLkRFTEVURUQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbXBvcnROYW1lO1xuICAgIH1cblxuICAgIGxldCBpZGVudGlmaWVyOiB0cy5JZGVudGlmaWVyIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IG5ld0ltcG9ydDogQW5hbHl6ZWRJbXBvcnQgfCBudWxsID0gbnVsbDtcblxuICAgIGlmIChzeW1ib2xOYW1lKSB7XG4gICAgICBjb25zdCBwcm9wZXJ0eUlkZW50aWZpZXIgPSB0cy5jcmVhdGVJZGVudGlmaWVyKHN5bWJvbE5hbWUpO1xuICAgICAgY29uc3QgZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllciA9IHRoaXMuX2dldFVuaXF1ZUlkZW50aWZpZXIoXG4gICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgIHN5bWJvbE5hbWUsXG4gICAgICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5lZWRzR2VuZXJhdGVkVW5pcXVlTmFtZSA9IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIudGV4dCAhPT0gc3ltYm9sTmFtZTtcbiAgICAgIGlkZW50aWZpZXIgPSBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPyBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyIDogcHJvcGVydHlJZGVudGlmaWVyO1xuXG4gICAgICBjb25zdCBuZXdJbXBvcnREZWNsID0gdHMuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb24oXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB0cy5jcmVhdGVJbXBvcnRDbGF1c2UodW5kZWZpbmVkLCB0cy5jcmVhdGVOYW1lZEltcG9ydHMoW10pKSxcbiAgICAgICAgdHMuY3JlYXRlU3RyaW5nTGl0ZXJhbChtb2R1bGVOYW1lKSxcbiAgICAgICk7XG5cbiAgICAgIG5ld0ltcG9ydCA9IHtcbiAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgbm9kZTogbmV3SW1wb3J0RGVjbCxcbiAgICAgICAgc3BlY2lmaWVyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZTogbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gcHJvcGVydHlJZGVudGlmaWVyIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgbmFtZTogaWRlbnRpZmllcixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBzdGF0ZTogSW1wb3J0U3RhdGUuQURERUQsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZGVudGlmaWVyID0gdGhpcy5fZ2V0VW5pcXVlSWRlbnRpZmllcihcbiAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgJ2RlZmF1bHRFeHBvcnQnLFxuICAgICAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyxcbiAgICAgICk7XG4gICAgICBjb25zdCBuZXdJbXBvcnREZWNsID0gdHMuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb24oXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB0cy5jcmVhdGVJbXBvcnRDbGF1c2UoaWRlbnRpZmllciwgdW5kZWZpbmVkKSxcbiAgICAgICAgdHMuY3JlYXRlU3RyaW5nTGl0ZXJhbChtb2R1bGVOYW1lKSxcbiAgICAgICk7XG4gICAgICBuZXdJbXBvcnQgPSB7XG4gICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgIG5vZGU6IG5ld0ltcG9ydERlY2wsXG4gICAgICAgIG5hbWU6IGlkZW50aWZpZXIsXG4gICAgICAgIHN0YXRlOiBJbXBvcnRTdGF0ZS5BRERFRCxcbiAgICAgIH07XG4gICAgfVxuICAgIGZpbGVJbXBvcnRzLnB1c2gobmV3SW1wb3J0KTtcbiAgICByZXR1cm4gaWRlbnRpZmllcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSByZWNvcmRlZCBjaGFuZ2VzIGluIHRoZSB1cGRhdGUgcmVjb3JkZXJzIG9mIHRoZSBjb3JyZXNwb25kaW5nIHNvdXJjZSBmaWxlcy5cbiAgICogVGhlIGNoYW5nZXMgYXJlIGFwcGxpZWQgc2VwYXJhdGVseSBhZnRlciBhbGwgY2hhbmdlcyBoYXZlIGJlZW4gcmVjb3JkZWQgYmVjYXVzZSBvdGhlcndpc2VcbiAgICogZmlsZSBvZmZzZXRzIHdpbGwgY2hhbmdlIGFuZCB0aGUgc291cmNlIGZpbGVzIHdvdWxkIG5lZWQgdG8gYmUgcmUtcGFyc2VkIGFmdGVyIGVhY2ggY2hhbmdlLlxuICAgKi9cbiAgcmVjb3JkQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9pbXBvcnRDYWNoZS5mb3JFYWNoKChmaWxlSW1wb3J0cywgc291cmNlRmlsZSkgPT4ge1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLl9maWxlU3lzdGVtLmVkaXQodGhpcy5fZmlsZVN5c3RlbS5yZXNvbHZlKHNvdXJjZUZpbGUuZmlsZU5hbWUpKTtcbiAgICAgIGNvbnN0IGxhc3RVbm1vZGlmaWVkSW1wb3J0ID0gZmlsZUltcG9ydHNcbiAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAuZmluZChpID0+IGkuc3RhdGUgPT09IEltcG9ydFN0YXRlLlVOTU9ESUZJRUQpO1xuICAgICAgY29uc3QgaW1wb3J0U3RhcnRJbmRleCA9IGxhc3RVbm1vZGlmaWVkSW1wb3J0XG4gICAgICAgID8gdGhpcy5fZ2V0RW5kUG9zaXRpb25PZk5vZGUobGFzdFVubW9kaWZpZWRJbXBvcnQubm9kZSlcbiAgICAgICAgOiAwO1xuXG4gICAgICBmaWxlSW1wb3J0cy5mb3JFYWNoKGltcG9ydERhdGEgPT4ge1xuICAgICAgICBpZiAoaW1wb3J0RGF0YS5zdGF0ZSA9PT0gSW1wb3J0U3RhdGUuVU5NT0RJRklFRCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkRFTEVURUQpKSB7XG4gICAgICAgICAgLy8gSW1wb3J0cyB3aGljaCBkbyBub3QgZXhpc3QgaW4gc291cmNlIGZpbGUsIGNhbiBiZSBqdXN0IHNraXBwZWQgYXNcbiAgICAgICAgICAvLyB3ZSBkbyBub3QgbmVlZCBhbnkgcmVwbGFjZW1lbnQgdG8gZGVsZXRlIHRoZSBpbXBvcnQuXG4gICAgICAgICAgaWYgKCFoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkFEREVEKSkge1xuICAgICAgICAgICAgcmVjb3JkZXIucmVtb3ZlKGltcG9ydERhdGEubm9kZS5nZXRGdWxsU3RhcnQoKSwgaW1wb3J0RGF0YS5ub2RlLmdldEZ1bGxXaWR0aCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltcG9ydERhdGEuc3BlY2lmaWVycykge1xuICAgICAgICAgIGNvbnN0IG5hbWVkQmluZGluZ3MgPSBpbXBvcnREYXRhLm5vZGUuaW1wb3J0Q2xhdXNlIS5uYW1lZEJpbmRpbmdzIGFzIHRzLk5hbWVkSW1wb3J0cztcbiAgICAgICAgICBjb25zdCBpbXBvcnRTcGVjaWZpZXJzID0gaW1wb3J0RGF0YS5zcGVjaWZpZXJzLm1hcChzID0+XG4gICAgICAgICAgICB0cy5jcmVhdGVJbXBvcnRTcGVjaWZpZXIocy5wcm9wZXJ0eU5hbWUsIHMubmFtZSksXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCB1cGRhdGVkQmluZGluZ3MgPSB0cy51cGRhdGVOYW1lZEltcG9ydHMobmFtZWRCaW5kaW5ncywgaW1wb3J0U3BlY2lmaWVycyk7XG5cbiAgICAgICAgICAvLyBJbiBjYXNlIGFuIGltcG9ydCBoYXMgYmVlbiBhZGRlZCBuZXdseSwgd2UgbmVlZCB0byBwcmludCB0aGUgd2hvbGUgaW1wb3J0XG4gICAgICAgICAgLy8gZGVjbGFyYXRpb24gYW5kIGluc2VydCBpdCBhdCB0aGUgaW1wb3J0IHN0YXJ0IGluZGV4LiBPdGhlcndpc2UsIHdlIGp1c3RcbiAgICAgICAgICAvLyB1cGRhdGUgdGhlIG5hbWVkIGJpbmRpbmdzIHRvIG5vdCByZS1wcmludCB0aGUgd2hvbGUgaW1wb3J0ICh3aGljaCBjb3VsZFxuICAgICAgICAgIC8vIGNhdXNlIHVubmVjZXNzYXJ5IGZvcm1hdHRpbmcgY2hhbmdlcylcbiAgICAgICAgICBpZiAoaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5BRERFRCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRJbXBvcnQgPSB0cy51cGRhdGVJbXBvcnREZWNsYXJhdGlvbihcbiAgICAgICAgICAgICAgaW1wb3J0RGF0YS5ub2RlLFxuICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgdHMuY3JlYXRlSW1wb3J0Q2xhdXNlKHVuZGVmaW5lZCwgdXBkYXRlZEJpbmRpbmdzKSxcbiAgICAgICAgICAgICAgdHMuY3JlYXRlU3RyaW5nTGl0ZXJhbChpbXBvcnREYXRhLm1vZHVsZU5hbWUpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld0ltcG9ydFRleHQgPSB0aGlzLl9wcmludGVyLnByaW50Tm9kZShcbiAgICAgICAgICAgICAgdHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsXG4gICAgICAgICAgICAgIHVwZGF0ZWRJbXBvcnQsXG4gICAgICAgICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChcbiAgICAgICAgICAgICAgaW1wb3J0U3RhcnRJbmRleCxcbiAgICAgICAgICAgICAgaW1wb3J0U3RhcnRJbmRleCA9PT0gMCA/IGAke25ld0ltcG9ydFRleHR9XFxuYCA6IGBcXG4ke25ld0ltcG9ydFRleHR9YCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLk1PRElGSUVEKSkge1xuICAgICAgICAgICAgY29uc3QgbmV3TmFtZWRCaW5kaW5nc1RleHQgPSB0aGlzLl9wcmludGVyLnByaW50Tm9kZShcbiAgICAgICAgICAgICAgdHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsXG4gICAgICAgICAgICAgIHVwZGF0ZWRCaW5kaW5ncyxcbiAgICAgICAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZWNvcmRlci5yZW1vdmUobmFtZWRCaW5kaW5ncy5nZXRTdGFydCgpLCBuYW1lZEJpbmRpbmdzLmdldFdpZHRoKCkpO1xuICAgICAgICAgICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQobmFtZWRCaW5kaW5ncy5nZXRTdGFydCgpLCBuZXdOYW1lZEJpbmRpbmdzVGV4dCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuQURERUQpKSB7XG4gICAgICAgICAgY29uc3QgbmV3SW1wb3J0VGV4dCA9IHRoaXMuX3ByaW50ZXIucHJpbnROb2RlKFxuICAgICAgICAgICAgdHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsXG4gICAgICAgICAgICBpbXBvcnREYXRhLm5vZGUsXG4gICAgICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChcbiAgICAgICAgICAgIGltcG9ydFN0YXJ0SW5kZXgsXG4gICAgICAgICAgICBpbXBvcnRTdGFydEluZGV4ID09PSAwID8gYCR7bmV3SW1wb3J0VGV4dH1cXG5gIDogYFxcbiR7bmV3SW1wb3J0VGV4dH1gLFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2Ugc2hvdWxkIG5ldmVyIGhpdCB0aGlzLCBidXQgd2UgcmF0aGVyIHdhbnQgdG8gcHJpbnQgYSBjdXN0b20gZXhjZXB0aW9uXG4gICAgICAgIC8vIGluc3RlYWQgb2YganVzdCBza2lwcGluZyBpbXBvcnRzIHNpbGVudGx5LlxuICAgICAgICB0aHJvdyBFcnJvcignVW5leHBlY3RlZCBpbXBvcnQgbW9kaWZpY2F0aW9uLicpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ29ycmVjdHMgdGhlIGxpbmUgYW5kIGNoYXJhY3RlciBwb3NpdGlvbiBvZiBhIGdpdmVuIG5vZGUuIFNpbmNlIG5vZGVzIG9mXG4gICAqIHNvdXJjZSBmaWxlcyBhcmUgaW1tdXRhYmxlIGFuZCB3ZSBzb21ldGltZXMgbWFrZSBjaGFuZ2VzIHRvIHRoZSBjb250YWluaW5nXG4gICAqIHNvdXJjZSBmaWxlLCB0aGUgbm9kZSBwb3NpdGlvbiBtaWdodCBzaGlmdCAoZS5nLiBpZiB3ZSBhZGQgYSBuZXcgaW1wb3J0IGJlZm9yZSkuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSB1c2VkIHRvIHJldHJpZXZlIGEgY29ycmVjdGVkIHBvc2l0aW9uIG9mIHRoZSBnaXZlbiBub2RlLiBUaGlzXG4gICAqIGlzIGhlbHBmdWwgd2hlbiBwcmludGluZyBvdXQgZXJyb3IgbWVzc2FnZXMgd2hpY2ggc2hvdWxkIHJlZmxlY3QgdGhlIG5ldyBzdGF0ZSBvZlxuICAgKiBzb3VyY2UgZmlsZXMuXG4gICAqL1xuICBjb3JyZWN0Tm9kZVBvc2l0aW9uKG5vZGU6IHRzLk5vZGUsIG9mZnNldDogbnVtYmVyLCBwb3NpdGlvbjogdHMuTGluZUFuZENoYXJhY3Rlcikge1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcblxuICAgIGlmICghdGhpcy5faW1wb3J0Q2FjaGUuaGFzKHNvdXJjZUZpbGUpKSB7XG4gICAgICByZXR1cm4gcG9zaXRpb247XG4gICAgfVxuXG4gICAgY29uc3QgbmV3UG9zaXRpb246IHRzLkxpbmVBbmRDaGFyYWN0ZXIgPSB7Li4ucG9zaXRpb259O1xuICAgIGNvbnN0IGZpbGVJbXBvcnRzID0gdGhpcy5faW1wb3J0Q2FjaGUuZ2V0KHNvdXJjZUZpbGUpITtcblxuICAgIGZvciAobGV0IGltcG9ydERhdGEgb2YgZmlsZUltcG9ydHMpIHtcbiAgICAgIGNvbnN0IGZ1bGxFbmQgPSBpbXBvcnREYXRhLm5vZGUuZ2V0RnVsbFN0YXJ0KCkgKyBpbXBvcnREYXRhLm5vZGUuZ2V0RnVsbFdpZHRoKCk7XG4gICAgICAvLyBTdWJ0cmFjdCBvciBhZGQgbGluZXMgYmFzZWQgb24gd2hldGhlciBhbiBpbXBvcnQgaGFzIGJlZW4gZGVsZXRlZCBvciByZW1vdmVkXG4gICAgICAvLyBiZWZvcmUgdGhlIGFjdHVhbCBub2RlIG9mZnNldC5cbiAgICAgIGlmIChvZmZzZXQgPiBmdWxsRW5kICYmIGhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuREVMRVRFRCkpIHtcbiAgICAgICAgbmV3UG9zaXRpb24ubGluZS0tO1xuICAgICAgfSBlbHNlIGlmIChvZmZzZXQgPiBmdWxsRW5kICYmIGhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuQURERUQpKSB7XG4gICAgICAgIG5ld1Bvc2l0aW9uLmxpbmUrKztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld1Bvc2l0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gdW5pcXVlIGlkZW50aWZpZXIgbmFtZSBmb3IgdGhlIHNwZWNpZmllZCBzeW1ib2wgbmFtZS5cbiAgICogQHBhcmFtIHNvdXJjZUZpbGUgU291cmNlIGZpbGUgdG8gY2hlY2sgZm9yIGlkZW50aWZpZXIgY29sbGlzaW9ucy5cbiAgICogQHBhcmFtIHN5bWJvbE5hbWUgTmFtZSBvZiB0aGUgc3ltYm9sIGZvciB3aGljaCB3ZSB3YW50IHRvIGdlbmVyYXRlIGFuIHVuaXF1ZSBuYW1lLlxuICAgKiBAcGFyYW0gaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMgTGlzdCBvZiBpZGVudGlmaWVycyB3aGljaCBzaG91bGQgYmUgaWdub3JlZCB3aGVuXG4gICAqICAgIGNoZWNraW5nIGZvciBpZGVudGlmaWVyIGNvbGxpc2lvbnMgaW4gdGhlIGdpdmVuIHNvdXJjZSBmaWxlLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0VW5pcXVlSWRlbnRpZmllcihcbiAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICAgIHN5bWJvbE5hbWU6IHN0cmluZyxcbiAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9uczogdHMuSWRlbnRpZmllcltdLFxuICApOiB0cy5JZGVudGlmaWVyIHtcbiAgICBpZiAodGhpcy5faXNVbmlxdWVJZGVudGlmaWVyTmFtZShzb3VyY2VGaWxlLCBzeW1ib2xOYW1lLCBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucykpIHtcbiAgICAgIHRoaXMuX3JlY29yZFVzZWRJZGVudGlmaWVyKHNvdXJjZUZpbGUsIHN5bWJvbE5hbWUpO1xuICAgICAgcmV0dXJuIHRzLmNyZWF0ZUlkZW50aWZpZXIoc3ltYm9sTmFtZSk7XG4gICAgfVxuXG4gICAgbGV0IG5hbWU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGxldCBjb3VudGVyID0gMTtcbiAgICBkbyB7XG4gICAgICBuYW1lID0gYCR7c3ltYm9sTmFtZX1fJHtjb3VudGVyKyt9YDtcbiAgICB9IHdoaWxlICghdGhpcy5faXNVbmlxdWVJZGVudGlmaWVyTmFtZShzb3VyY2VGaWxlLCBuYW1lLCBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucykpO1xuXG4gICAgdGhpcy5fcmVjb3JkVXNlZElkZW50aWZpZXIoc291cmNlRmlsZSwgbmFtZSEpO1xuICAgIHJldHVybiB0cy5jcmVhdGVJZGVudGlmaWVyKG5hbWUhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgc3BlY2lmaWVkIGlkZW50aWZpZXIgbmFtZSBpcyB1c2VkIHdpdGhpbiB0aGUgZ2l2ZW4gc291cmNlIGZpbGUuXG4gICAqIEBwYXJhbSBzb3VyY2VGaWxlIFNvdXJjZSBmaWxlIHRvIGNoZWNrIGZvciBpZGVudGlmaWVyIGNvbGxpc2lvbnMuXG4gICAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGlkZW50aWZpZXIgd2hpY2ggaXMgY2hlY2tlZCBmb3IgaXRzIHVuaXF1ZW5lc3MuXG4gICAqIEBwYXJhbSBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHNob3VsZCBiZSBpZ25vcmVkIHdoZW5cbiAgICogICAgY2hlY2tpbmcgZm9yIGlkZW50aWZpZXIgY29sbGlzaW9ucyBpbiB0aGUgZ2l2ZW4gc291cmNlIGZpbGUuXG4gICAqL1xuICBwcml2YXRlIF9pc1VuaXF1ZUlkZW50aWZpZXJOYW1lKFxuICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zOiB0cy5JZGVudGlmaWVyW10sXG4gICkge1xuICAgIGlmIChcbiAgICAgIHRoaXMuX3VzZWRJZGVudGlmaWVyTmFtZXMuaGFzKHNvdXJjZUZpbGUpICYmXG4gICAgICB0aGlzLl91c2VkSWRlbnRpZmllck5hbWVzLmdldChzb3VyY2VGaWxlKSEuaW5kZXhPZihuYW1lKSAhPT0gLTFcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBXYWxrIHRocm91Z2ggdGhlIHNvdXJjZSBmaWxlIGFuZCBzZWFyY2ggZm9yIGFuIGlkZW50aWZpZXIgbWF0Y2hpbmdcbiAgICAvLyB0aGUgZ2l2ZW4gbmFtZS4gSW4gdGhhdCBjYXNlLCBpdCdzIG5vdCBndWFyYW50ZWVkIHRoYXQgdGhpcyBuYW1lXG4gICAgLy8gaXMgdW5pcXVlIGluIHRoZSBnaXZlbiBkZWNsYXJhdGlvbiBzY29wZSBhbmQgd2UganVzdCByZXR1cm4gZmFsc2UuXG4gICAgY29uc3Qgbm9kZVF1ZXVlOiB0cy5Ob2RlW10gPSBbc291cmNlRmlsZV07XG4gICAgd2hpbGUgKG5vZGVRdWV1ZS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBub2RlUXVldWUuc2hpZnQoKSE7XG4gICAgICBpZiAoXG4gICAgICAgIHRzLmlzSWRlbnRpZmllcihub2RlKSAmJlxuICAgICAgICBub2RlLnRleHQgPT09IG5hbWUgJiZcbiAgICAgICAgIWlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zLmluY2x1ZGVzKG5vZGUpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgbm9kZVF1ZXVlLnB1c2goLi4ubm9kZS5nZXRDaGlsZHJlbigpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmVjb3JkcyB0aGF0IHRoZSBnaXZlbiBpZGVudGlmaWVyIGlzIHVzZWQgd2l0aGluIHRoZSBzcGVjaWZpZWQgc291cmNlIGZpbGUuIFRoaXNcbiAgICogaXMgbmVjZXNzYXJ5IHNpbmNlIHdlIGRvIG5vdCBhcHBseSBjaGFuZ2VzIHRvIHNvdXJjZSBmaWxlcyBwZXIgY2hhbmdlLCBidXQgc3RpbGxcbiAgICogd2FudCB0byBhdm9pZCBjb25mbGljdHMgd2l0aCBuZXdseSBpbXBvcnRlZCBzeW1ib2xzLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVjb3JkVXNlZElkZW50aWZpZXIoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgaWRlbnRpZmllck5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuX3VzZWRJZGVudGlmaWVyTmFtZXMuc2V0KFxuICAgICAgc291cmNlRmlsZSxcbiAgICAgICh0aGlzLl91c2VkSWRlbnRpZmllck5hbWVzLmdldChzb3VyY2VGaWxlKSB8fCBbXSkuY29uY2F0KGlkZW50aWZpZXJOYW1lKSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgdGhlIGZ1bGwgZW5kIG9mIGEgZ2l2ZW4gbm9kZS4gQnkgZGVmYXVsdCB0aGUgZW5kIHBvc2l0aW9uIG9mIGEgbm9kZSBpc1xuICAgKiBiZWZvcmUgYWxsIHRyYWlsaW5nIGNvbW1lbnRzLiBUaGlzIGNvdWxkIG1lYW4gdGhhdCBnZW5lcmF0ZWQgaW1wb3J0cyBzaGlmdCBjb21tZW50cy5cbiAgICovXG4gIHByaXZhdGUgX2dldEVuZFBvc2l0aW9uT2ZOb2RlKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBjb25zdCBub2RlRW5kUG9zID0gbm9kZS5nZXRFbmQoKTtcbiAgICBjb25zdCBjb21tZW50UmFuZ2VzID0gdHMuZ2V0VHJhaWxpbmdDb21tZW50UmFuZ2VzKG5vZGUuZ2V0U291cmNlRmlsZSgpLnRleHQsIG5vZGVFbmRQb3MpO1xuICAgIGlmICghY29tbWVudFJhbmdlcyB8fCAhY29tbWVudFJhbmdlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBub2RlRW5kUG9zO1xuICAgIH1cbiAgICByZXR1cm4gY29tbWVudFJhbmdlc1tjb21tZW50UmFuZ2VzLmxlbmd0aCAtIDFdIS5lbmQ7XG4gIH1cbn1cbiJdfQ==