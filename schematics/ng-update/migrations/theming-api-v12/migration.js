"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateFileContent = void 0;
const config_1 = require("./config");
/** Possible pairs of comment characters in a Sass file. */
const commentPairs = new Map([
    ['/*', '*/'],
    ['//', '\n'],
]);
/** Prefix for the placeholder that will be used to escape comments. */
const commentPlaceholderStart = '__<<ngThemingMigrationEscapedComment';
/** Suffix for the comment escape placeholder. */
const commentPlaceholderEnd = '>>__';
/**
 * Migrates the content of a file to the new theming API. Note that this migration is using plain
 * string manipulation, rather than the AST from PostCSS and the schematics string manipulation
 * APIs, because it allows us to run it inside g3 and to avoid introducing new dependencies.
 * @param fileContent Content of the file.
 * @param oldMaterialPrefix Prefix with which the old Material imports should start.
 *   Has to end with a slash. E.g. if `@import '@angular/material/theming'` should be
 *   matched, the prefix would be `@angular/material/`.
 * @param oldCdkPrefix Prefix with which the old CDK imports should start.
 *   Has to end with a slash. E.g. if `@import '@angular/cdk/overlay'` should be
 *   matched, the prefix would be `@angular/cdk/`.
 * @param newMaterialImportPath New import to the Material theming API (e.g. `@angular/material`).
 * @param newCdkImportPath New import to the CDK Sass APIs (e.g. `@angular/cdk`).
 * @param excludedImports Pattern that can be used to exclude imports from being processed.
 */
function migrateFileContent(fileContent, oldMaterialPrefix, oldCdkPrefix, newMaterialImportPath, newCdkImportPath, extraMaterialSymbols = {}, excludedImports) {
    let { content, placeholders } = escapeComments(fileContent);
    const materialResults = detectImports(content, oldMaterialPrefix, excludedImports);
    const cdkResults = detectImports(content, oldCdkPrefix, excludedImports);
    // Try to migrate the symbols even if there are no imports. This is used
    // to cover the case where the Components symbols were used transitively.
    content = migrateCdkSymbols(content, newCdkImportPath, placeholders, cdkResults);
    content = migrateMaterialSymbols(content, newMaterialImportPath, materialResults, placeholders, extraMaterialSymbols);
    content = replaceRemovedVariables(content, config_1.removedMaterialVariables);
    // We can assume that the migration has taken care of any Components symbols that were
    // imported transitively so we can always drop the old imports. We also assume that imports
    // to the new entry points have been added already.
    if (materialResults.imports.length) {
        content = replaceRemovedVariables(content, config_1.unprefixedRemovedVariables);
        content = removeStrings(content, materialResults.imports);
    }
    if (cdkResults.imports.length) {
        content = removeStrings(content, cdkResults.imports);
    }
    return restoreComments(content, placeholders);
}
exports.migrateFileContent = migrateFileContent;
/**
 * Counts the number of imports with a specific prefix and extracts their namespaces.
 * @param content File content in which to look for imports.
 * @param prefix Prefix that the imports should start with.
 * @param excludedImports Pattern that can be used to exclude imports from being processed.
 */
function detectImports(content, prefix, excludedImports) {
    if (prefix[prefix.length - 1] !== '/') {
        // Some of the logic further down makes assumptions about the import depth.
        throw Error(`Prefix "${prefix}" has to end in a slash.`);
    }
    // List of `@use` namespaces from which Angular CDK/Material APIs may be referenced.
    // Since we know that the library doesn't have any name collisions, we can treat all of these
    // namespaces as equivalent.
    const namespaces = [];
    const imports = [];
    const pattern = new RegExp(`@(import|use) +['"]~?${escapeRegExp(prefix)}.*['"].*;?\n`, 'g');
    let match = null;
    while ((match = pattern.exec(content))) {
        const [fullImport, type] = match;
        if (excludedImports === null || excludedImports === void 0 ? void 0 : excludedImports.test(fullImport)) {
            continue;
        }
        if (type === 'use') {
            const namespace = extractNamespaceFromUseStatement(fullImport);
            if (namespaces.indexOf(namespace) === -1) {
                namespaces.push(namespace);
            }
        }
        imports.push(fullImport);
    }
    return { imports, namespaces };
}
/** Migrates the Material symbols in a file. */
function migrateMaterialSymbols(content, importPath, detectedImports, commentPlaceholders, extraMaterialSymbols = {}) {
    const initialContent = content;
    const namespace = 'mat';
    // Migrate the mixins.
    const mixinsToUpdate = Object.assign(Object.assign({}, config_1.materialMixins), extraMaterialSymbols.mixins);
    content = renameSymbols(content, mixinsToUpdate, detectedImports.namespaces, mixinKeyFormatter, getMixinValueFormatter(namespace));
    // Migrate the functions.
    const functionsToUpdate = Object.assign(Object.assign({}, config_1.materialFunctions), extraMaterialSymbols.functions);
    content = renameSymbols(content, functionsToUpdate, detectedImports.namespaces, functionKeyFormatter, getFunctionValueFormatter(namespace));
    // Migrate the variables.
    const variablesToUpdate = Object.assign(Object.assign({}, config_1.materialVariables), extraMaterialSymbols.variables);
    content = renameSymbols(content, variablesToUpdate, detectedImports.namespaces, variableKeyFormatter, getVariableValueFormatter(namespace));
    if (content !== initialContent) {
        // Add an import to the new API only if any of the APIs were being used.
        content = insertUseStatement(content, importPath, namespace, commentPlaceholders);
    }
    return content;
}
/** Migrates the CDK symbols in a file. */
function migrateCdkSymbols(content, importPath, commentPlaceholders, detectedImports) {
    const initialContent = content;
    const namespace = 'cdk';
    // Migrate the mixins.
    content = renameSymbols(content, config_1.cdkMixins, detectedImports.namespaces, mixinKeyFormatter, getMixinValueFormatter(namespace));
    // Migrate the variables.
    content = renameSymbols(content, config_1.cdkVariables, detectedImports.namespaces, variableKeyFormatter, getVariableValueFormatter(namespace));
    // Previously the CDK symbols were exposed through `material/theming`, but now we have a
    // dedicated entrypoint for the CDK. Only add an import for it if any of the symbols are used.
    if (content !== initialContent) {
        content = insertUseStatement(content, importPath, namespace, commentPlaceholders);
    }
    return content;
}
/**
 * Renames all Sass symbols in a file based on a pre-defined mapping.
 * @param content Content of a file to be migrated.
 * @param mapping Mapping between symbol names and their replacements.
 * @param namespaces Names to iterate over and pass to getKeyPattern.
 * @param getKeyPattern Function used to turn each of the keys into a regex.
 * @param formatValue Formats the value that will replace any matches of the pattern returned by
 *  `getKeyPattern`.
 */
function renameSymbols(content, mapping, namespaces, getKeyPattern, formatValue) {
    // The null at the end is so that we make one last pass to cover non-namespaced symbols.
    [...namespaces.slice(), null].forEach(namespace => {
        Object.keys(mapping).forEach(key => {
            const pattern = getKeyPattern(namespace, key);
            // Sanity check since non-global regexes will only replace the first match.
            if (pattern.flags.indexOf('g') === -1) {
                throw Error('Replacement pattern must be global.');
            }
            content = content.replace(pattern, formatValue(mapping[key]));
        });
    });
    return content;
}
/** Inserts an `@use` statement in a string. */
function insertUseStatement(content, importPath, namespace, commentPlaceholders) {
    // If the content already has the `@use` import, we don't need to add anything.
    if (new RegExp(`@use +['"]${importPath}['"]`, 'g').test(content)) {
        return content;
    }
    // Sass will throw an error if an `@use` statement comes after another statement. The safest way
    // to ensure that we conform to that requirement is by always inserting our imports at the top
    // of the file. Detecting where the user's content starts is tricky, because there are many
    // different kinds of syntax we'd have to account for. One approach is to find the first `@import`
    // and insert before it, but the problem is that Sass allows `@import` to be placed anywhere.
    let newImportIndex = 0;
    // One special case is if the file starts with a license header which we want to preserve on top.
    if (content.trim().startsWith(commentPlaceholderStart)) {
        const commentStartIndex = content.indexOf(commentPlaceholderStart);
        newImportIndex =
            content.indexOf(commentPlaceholderEnd, commentStartIndex + 1) + commentPlaceholderEnd.length;
        // If the leading comment doesn't end with a newline,
        // we need to insert the import at the next line.
        if (!commentPlaceholders[content.slice(commentStartIndex, newImportIndex)].endsWith('\n')) {
            newImportIndex = Math.max(newImportIndex, content.indexOf('\n', newImportIndex) + 1);
        }
    }
    return (content.slice(0, newImportIndex) +
        `@use '${importPath}' as ${namespace};\n` +
        content.slice(newImportIndex));
}
/** Formats a migration key as a Sass mixin invocation. */
function mixinKeyFormatter(namespace, name) {
    // Note that adding a `(` at the end of the pattern would be more accurate, but mixin
    // invocations don't necessarily have to include the parentheses. We could add `[(;]`,
    // but then we won't know which character to include in the replacement string.
    return new RegExp(`@include +${escapeRegExp((namespace ? namespace + '.' : '') + name)}`, 'g');
}
/** Returns a function that can be used to format a Sass mixin replacement. */
function getMixinValueFormatter(namespace) {
    // Note that adding a `(` at the end of the pattern would be more accurate,
    // but mixin invocations don't necessarily have to include the parentheses.
    return name => `@include ${namespace}.${name}`;
}
/** Formats a migration key as a Sass function invocation. */
function functionKeyFormatter(namespace, name) {
    const functionName = escapeRegExp(`${namespace ? namespace + '.' : ''}${name}(`);
    return new RegExp(`(?<![-_a-zA-Z0-9])${functionName}`, 'g');
}
/** Returns a function that can be used to format a Sass function replacement. */
function getFunctionValueFormatter(namespace) {
    return name => `${namespace}.${name}(`;
}
/** Formats a migration key as a Sass variable. */
function variableKeyFormatter(namespace, name) {
    const variableName = escapeRegExp(`${namespace ? namespace + '.' : ''}$${name}`);
    return new RegExp(`${variableName}(?![-_a-zA-Z0-9])`, 'g');
}
/** Returns a function that can be used to format a Sass variable replacement. */
function getVariableValueFormatter(namespace) {
    return name => `${namespace}.$${name}`;
}
/** Escapes special regex characters in a string. */
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
/** Removes all strings from another string. */
function removeStrings(content, toRemove) {
    return toRemove
        .reduce((accumulator, current) => accumulator.replace(current, ''), content)
        .replace(/^\s+/, '');
}
/** Parses out the namespace from a Sass `@use` statement. */
function extractNamespaceFromUseStatement(fullImport) {
    const closeQuoteIndex = Math.max(fullImport.lastIndexOf(`"`), fullImport.lastIndexOf(`'`));
    if (closeQuoteIndex > -1) {
        const asExpression = 'as ';
        const asIndex = fullImport.indexOf(asExpression, closeQuoteIndex);
        // If we found an ` as ` expression, we consider the rest of the text as the namespace.
        if (asIndex > -1) {
            return fullImport
                .slice(asIndex + asExpression.length)
                .split(';')[0]
                .trim();
        }
        // Otherwise the namespace is the name of the file that is being imported.
        const lastSlashIndex = fullImport.lastIndexOf('/', closeQuoteIndex);
        if (lastSlashIndex > -1) {
            const fileName = fullImport
                .slice(lastSlashIndex + 1, closeQuoteIndex)
                // Sass allows for leading underscores to be omitted and it technically supports .scss.
                .replace(/^_|(\.import)?\.scss$|\.import$/g, '');
            // Sass ignores `/index` and infers the namespace as the next segment in the path.
            if (fileName === 'index') {
                const nextSlashIndex = fullImport.lastIndexOf('/', lastSlashIndex - 1);
                if (nextSlashIndex > -1) {
                    return fullImport.slice(nextSlashIndex + 1, lastSlashIndex);
                }
            }
            else {
                return fileName;
            }
        }
    }
    throw Error(`Could not extract namespace from import "${fullImport}".`);
}
/**
 * Replaces variables that have been removed with their values.
 * @param content Content of the file to be migrated.
 * @param variables Mapping between variable names and their values.
 */
function replaceRemovedVariables(content, variables) {
    Object.keys(variables).forEach(variableName => {
        // Note that the pattern uses a negative lookahead to exclude
        // variable assignments, because they can't be migrated.
        const regex = new RegExp(`\\$${escapeRegExp(variableName)}(?!\\s+:|:)`, 'g');
        content = content.replace(regex, variables[variableName]);
    });
    return content;
}
/**
 * Replaces all of the comments in a Sass file with placeholders and
 * returns the list of placeholders so they can be restored later.
 */
function escapeComments(content) {
    const placeholders = {};
    let commentCounter = 0;
    let [openIndex, closeIndex] = findComment(content);
    while (openIndex > -1 && closeIndex > -1) {
        const placeholder = commentPlaceholderStart + commentCounter++ + commentPlaceholderEnd;
        placeholders[placeholder] = content.slice(openIndex, closeIndex);
        content = content.slice(0, openIndex) + placeholder + content.slice(closeIndex);
        [openIndex, closeIndex] = findComment(content);
    }
    return { content, placeholders };
}
/** Finds the start and end index of a comment in a file. */
function findComment(content) {
    // Add an extra new line at the end so that we can correctly capture single-line comments
    // at the end of the file. It doesn't really matter that the end index will be out of bounds,
    // because `String.prototype.slice` will clamp it to the string length.
    content += '\n';
    for (const [open, close] of commentPairs.entries()) {
        const openIndex = content.indexOf(open);
        if (openIndex > -1) {
            const closeIndex = content.indexOf(close, openIndex + 1);
            return closeIndex > -1 ? [openIndex, closeIndex + close.length] : [-1, -1];
        }
    }
    return [-1, -1];
}
/** Restores the comments that have been escaped by `escapeComments`. */
function restoreComments(content, placeholders) {
    Object.keys(placeholders).forEach(key => (content = content.replace(key, placeholders[key])));
    return content;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvdGhlbWluZy1hcGktdjEyL21pZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCxxQ0FRa0I7QUFlbEIsMkRBQTJEO0FBQzNELE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFpQjtJQUMzQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7SUFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Q0FDYixDQUFDLENBQUM7QUFFSCx1RUFBdUU7QUFDdkUsTUFBTSx1QkFBdUIsR0FBRyxzQ0FBc0MsQ0FBQztBQUV2RSxpREFBaUQ7QUFDakQsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLENBQUM7QUFFckM7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FDaEMsV0FBbUIsRUFDbkIsaUJBQXlCLEVBQ3pCLFlBQW9CLEVBQ3BCLHFCQUE2QixFQUM3QixnQkFBd0IsRUFDeEIsdUJBQXFDLEVBQUUsRUFDdkMsZUFBd0I7SUFFeEIsSUFBSSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUQsTUFBTSxlQUFlLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNuRixNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsQ0FBQztJQUV6RSx3RUFBd0U7SUFDeEUseUVBQXlFO0lBQ3pFLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2pGLE9BQU8sR0FBRyxzQkFBc0IsQ0FD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QUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDekQsT0FBTyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1RTtLQUNGO0lBRUQsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsQ0FBQztBQUVELHdFQUF3RTtBQUN4RSxTQUFTLGVBQWUsQ0FBQyxPQUFlLEVBQUUsWUFBb0M7SUFDNUUsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUYsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBtYXRlcmlhbE1peGlucyxcbiAgbWF0ZXJpYWxGdW5jdGlvbnMsXG4gIG1hdGVyaWFsVmFyaWFibGVzLFxuICBjZGtNaXhpbnMsXG4gIGNka1ZhcmlhYmxlcyxcbiAgcmVtb3ZlZE1hdGVyaWFsVmFyaWFibGVzLFxuICB1bnByZWZpeGVkUmVtb3ZlZFZhcmlhYmxlcyxcbn0gZnJvbSAnLi9jb25maWcnO1xuXG4vKiogVGhlIHJlc3VsdCBvZiBhIHNlYXJjaCBmb3IgaW1wb3J0cyBhbmQgbmFtZXNwYWNlcyBpbiBhIGZpbGUuICovXG5pbnRlcmZhY2UgRGV0ZWN0SW1wb3J0UmVzdWx0IHtcbiAgaW1wb3J0czogc3RyaW5nW107XG4gIG5hbWVzcGFjZXM6IHN0cmluZ1tdO1xufVxuXG4vKiogQWRkaXRpb24gbWl4aW4gYW5kIGZ1bmN0aW9uIG5hbWVzIHRoYXQgY2FuIGJlIHVwZGF0ZWQgd2hlbiBpbnZva2luZyBtaWdyYXRpb24gZGlyZWN0bHkuICovXG5pbnRlcmZhY2UgRXh0cmFTeW1ib2xzIHtcbiAgbWl4aW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgZnVuY3Rpb25zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgdmFyaWFibGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn1cblxuLyoqIFBvc3NpYmxlIHBhaXJzIG9mIGNvbW1lbnQgY2hhcmFjdGVycyBpbiBhIFNhc3MgZmlsZS4gKi9cbmNvbnN0IGNvbW1lbnRQYWlycyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KFtcbiAgWycvKicsICcqLyddLFxuICBbJy8vJywgJ1xcbiddLFxuXSk7XG5cbi8qKiBQcmVmaXggZm9yIHRoZSBwbGFjZWhvbGRlciB0aGF0IHdpbGwgYmUgdXNlZCB0byBlc2NhcGUgY29tbWVudHMuICovXG5jb25zdCBjb21tZW50UGxhY2Vob2xkZXJTdGFydCA9ICdfXzw8bmdUaGVtaW5nTWlncmF0aW9uRXNjYXBlZENvbW1lbnQnO1xuXG4vKiogU3VmZml4IGZvciB0aGUgY29tbWVudCBlc2NhcGUgcGxhY2Vob2xkZXIuICovXG5jb25zdCBjb21tZW50UGxhY2Vob2xkZXJFbmQgPSAnPj5fXyc7XG5cbi8qKlxuICogTWlncmF0ZXMgdGhlIGNvbnRlbnQgb2YgYSBmaWxlIHRvIHRoZSBuZXcgdGhlbWluZyBBUEkuIE5vdGUgdGhhdCB0aGlzIG1pZ3JhdGlvbiBpcyB1c2luZyBwbGFpblxuICogc3RyaW5nIG1hbmlwdWxhdGlvbiwgcmF0aGVyIHRoYW4gdGhlIEFTVCBmcm9tIFBvc3RDU1MgYW5kIHRoZSBzY2hlbWF0aWNzIHN0cmluZyBtYW5pcHVsYXRpb25cbiAqIEFQSXMsIGJlY2F1c2UgaXQgYWxsb3dzIHVzIHRvIHJ1biBpdCBpbnNpZGUgZzMgYW5kIHRvIGF2b2lkIGludHJvZHVjaW5nIG5ldyBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0gZmlsZUNvbnRlbnQgQ29udGVudCBvZiB0aGUgZmlsZS5cbiAqIEBwYXJhbSBvbGRNYXRlcmlhbFByZWZpeCBQcmVmaXggd2l0aCB3aGljaCB0aGUgb2xkIE1hdGVyaWFsIGltcG9ydHMgc2hvdWxkIHN0YXJ0LlxuICogICBIYXMgdG8gZW5kIHdpdGggYSBzbGFzaC4gRS5nLiBpZiBgQGltcG9ydCAnQGFuZ3VsYXIvbWF0ZXJpYWwvdGhlbWluZydgIHNob3VsZCBiZVxuICogICBtYXRjaGVkLCB0aGUgcHJlZml4IHdvdWxkIGJlIGBAYW5ndWxhci9tYXRlcmlhbC9gLlxuICogQHBhcmFtIG9sZENka1ByZWZpeCBQcmVmaXggd2l0aCB3aGljaCB0aGUgb2xkIENESyBpbXBvcnRzIHNob3VsZCBzdGFydC5cbiAqICAgSGFzIHRvIGVuZCB3aXRoIGEgc2xhc2guIEUuZy4gaWYgYEBpbXBvcnQgJ0Bhbmd1bGFyL2Nkay9vdmVybGF5J2Agc2hvdWxkIGJlXG4gKiAgIG1hdGNoZWQsIHRoZSBwcmVmaXggd291bGQgYmUgYEBhbmd1bGFyL2Nkay9gLlxuICogQHBhcmFtIG5ld01hdGVyaWFsSW1wb3J0UGF0aCBOZXcgaW1wb3J0IHRvIHRoZSBNYXRlcmlhbCB0aGVtaW5nIEFQSSAoZS5nLiBgQGFuZ3VsYXIvbWF0ZXJpYWxgKS5cbiAqIEBwYXJhbSBuZXdDZGtJbXBvcnRQYXRoIE5ldyBpbXBvcnQgdG8gdGhlIENESyBTYXNzIEFQSXMgKGUuZy4gYEBhbmd1bGFyL2Nka2ApLlxuICogQHBhcmFtIGV4Y2x1ZGVkSW1wb3J0cyBQYXR0ZXJuIHRoYXQgY2FuIGJlIHVzZWQgdG8gZXhjbHVkZSBpbXBvcnRzIGZyb20gYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWlncmF0ZUZpbGVDb250ZW50KFxuICBmaWxlQ29udGVudDogc3RyaW5nLFxuICBvbGRNYXRlcmlhbFByZWZpeDogc3RyaW5nLFxuICBvbGRDZGtQcmVmaXg6IHN0cmluZyxcbiAgbmV3TWF0ZXJpYWxJbXBvcnRQYXRoOiBzdHJpbmcsXG4gIG5ld0Nka0ltcG9ydFBhdGg6IHN0cmluZyxcbiAgZXh0cmFNYXRlcmlhbFN5bWJvbHM6IEV4dHJhU3ltYm9scyA9IHt9LFxuICBleGNsdWRlZEltcG9ydHM/OiBSZWdFeHAsXG4pOiBzdHJpbmcge1xuICBsZXQge2NvbnRlbnQsIHBsYWNlaG9sZGVyc30gPSBlc2NhcGVDb21tZW50cyhmaWxlQ29udGVudCk7XG4gIGNvbnN0IG1hdGVyaWFsUmVzdWx0cyA9IGRldGVjdEltcG9ydHMoY29udGVudCwgb2xkTWF0ZXJpYWxQcmVmaXgsIGV4Y2x1ZGVkSW1wb3J0cyk7XG4gIGNvbnN0IGNka1Jlc3VsdHMgPSBkZXRlY3RJbXBvcnRzKGNvbnRlbnQsIG9sZENka1ByZWZpeCwgZXhjbHVkZWRJbXBvcnRzKTtcblxuICAvLyBUcnkgdG8gbWlncmF0ZSB0aGUgc3ltYm9scyBldmVuIGlmIHRoZXJlIGFyZSBubyBpbXBvcnRzLiBUaGlzIGlzIHVzZWRcbiAgLy8gdG8gY292ZXIgdGhlIGNhc2Ugd2hlcmUgdGhlIENvbXBvbmVudHMgc3ltYm9scyB3ZXJlIHVzZWQgdHJhbnNpdGl2ZWx5LlxuICBjb250ZW50ID0gbWlncmF0ZUNka1N5bWJvbHMoY29udGVudCwgbmV3Q2RrSW1wb3J0UGF0aCwgcGxhY2Vob2xkZXJzLCBjZGtSZXN1bHRzKTtcbiAgY29udGVudCA9IG1pZ3JhdGVNYXRlcmlhbFN5bWJvbHMoXG4gICAgY29udGVudCxcbiAgICBuZXdNYXRlcmlhbEltcG9ydFBhdGgsXG4gICAgbWF0ZXJpYWxSZXN1bHRzLFxuICAgIHBsYWNlaG9sZGVycyxcbiAgICBleHRyYU1hdGVyaWFsU3ltYm9scyxcbiAgKTtcbiAgY29udGVudCA9IHJlcGxhY2VSZW1vdmVkVmFyaWFibGVzKGNvbnRlbnQsIHJlbW92ZWRNYXRlcmlhbFZhcmlhYmxlcyk7XG5cbiAgLy8gV2UgY2FuIGFzc3VtZSB0aGF0IHRoZSBtaWdyYXRpb24gaGFzIHRha2VuIGNhcmUgb2YgYW55IENvbXBvbmVudHMgc3ltYm9scyB0aGF0IHdlcmVcbiAgLy8gaW1wb3J0ZWQgdHJhbnNpdGl2ZWx5IHNvIHdlIGNhbiBhbHdheXMgZHJvcCB0aGUgb2xkIGltcG9ydHMuIFdlIGFsc28gYXNzdW1lIHRoYXQgaW1wb3J0c1xuICAvLyB0byB0aGUgbmV3IGVudHJ5IHBvaW50cyBoYXZlIGJlZW4gYWRkZWQgYWxyZWFkeS5cbiAgaWYgKG1hdGVyaWFsUmVzdWx0cy5pbXBvcnRzLmxlbmd0aCkge1xuICAgIGNvbnRlbnQgPSByZXBsYWNlUmVtb3ZlZFZhcmlhYmxlcyhjb250ZW50LCB1bnByZWZpeGVkUmVtb3ZlZFZhcmlhYmxlcyk7XG4gICAgY29udGVudCA9IHJlbW92ZVN0cmluZ3MoY29udGVudCwgbWF0ZXJpYWxSZXN1bHRzLmltcG9ydHMpO1xuICB9XG5cbiAgaWYgKGNka1Jlc3VsdHMuaW1wb3J0cy5sZW5ndGgpIHtcbiAgICBjb250ZW50ID0gcmVtb3ZlU3RyaW5ncyhjb250ZW50LCBjZGtSZXN1bHRzLmltcG9ydHMpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3RvcmVDb21tZW50cyhjb250ZW50LCBwbGFjZWhvbGRlcnMpO1xufVxuXG4vKipcbiAqIENvdW50cyB0aGUgbnVtYmVyIG9mIGltcG9ydHMgd2l0aCBhIHNwZWNpZmljIHByZWZpeCBhbmQgZXh0cmFjdHMgdGhlaXIgbmFtZXNwYWNlcy5cbiAqIEBwYXJhbSBjb250ZW50IEZpbGUgY29udGVudCBpbiB3aGljaCB0byBsb29rIGZvciBpbXBvcnRzLlxuICogQHBhcmFtIHByZWZpeCBQcmVmaXggdGhhdCB0aGUgaW1wb3J0cyBzaG91bGQgc3RhcnQgd2l0aC5cbiAqIEBwYXJhbSBleGNsdWRlZEltcG9ydHMgUGF0dGVybiB0aGF0IGNhbiBiZSB1c2VkIHRvIGV4Y2x1ZGUgaW1wb3J0cyBmcm9tIGJlaW5nIHByb2Nlc3NlZC5cbiAqL1xuZnVuY3Rpb24gZGV0ZWN0SW1wb3J0cyhcbiAgY29udGVudDogc3RyaW5nLFxuICBwcmVmaXg6IHN0cmluZyxcbiAgZXhjbHVkZWRJbXBvcnRzPzogUmVnRXhwLFxuKTogRGV0ZWN0SW1wb3J0UmVzdWx0IHtcbiAgaWYgKHByZWZpeFtwcmVmaXgubGVuZ3RoIC0gMV0gIT09ICcvJykge1xuICAgIC8vIFNvbWUgb2YgdGhlIGxvZ2ljIGZ1cnRoZXIgZG93biBtYWtlcyBhc3N1bXB0aW9ucyBhYm91dCB0aGUgaW1wb3J0IGRlcHRoLlxuICAgIHRocm93IEVycm9yKGBQcmVmaXggXCIke3ByZWZpeH1cIiBoYXMgdG8gZW5kIGluIGEgc2xhc2guYCk7XG4gIH1cblxuICAvLyBMaXN0IG9mIGBAdXNlYCBuYW1lc3BhY2VzIGZyb20gd2hpY2ggQW5ndWxhciBDREsvTWF0ZXJpYWwgQVBJcyBtYXkgYmUgcmVmZXJlbmNlZC5cbiAgLy8gU2luY2Ugd2Uga25vdyB0aGF0IHRoZSBsaWJyYXJ5IGRvZXNuJ3QgaGF2ZSBhbnkgbmFtZSBjb2xsaXNpb25zLCB3ZSBjYW4gdHJlYXQgYWxsIG9mIHRoZXNlXG4gIC8vIG5hbWVzcGFjZXMgYXMgZXF1aXZhbGVudC5cbiAgY29uc3QgbmFtZXNwYWNlczogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgaW1wb3J0czogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgcGF0dGVybiA9IG5ldyBSZWdFeHAoYEAoaW1wb3J0fHVzZSkgK1snXCJdfj8ke2VzY2FwZVJlZ0V4cChwcmVmaXgpfS4qWydcIl0uKjs/XFxuYCwgJ2cnKTtcbiAgbGV0IG1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsID0gbnVsbDtcblxuICB3aGlsZSAoKG1hdGNoID0gcGF0dGVybi5leGVjKGNvbnRlbnQpKSkge1xuICAgIGNvbnN0IFtmdWxsSW1wb3J0LCB0eXBlXSA9IG1hdGNoO1xuXG4gICAgaWYgKGV4Y2x1ZGVkSW1wb3J0cz8udGVzdChmdWxsSW1wb3J0KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09ICd1c2UnKSB7XG4gICAgICBjb25zdCBuYW1lc3BhY2UgPSBleHRyYWN0TmFtZXNwYWNlRnJvbVVzZVN0YXRlbWVudChmdWxsSW1wb3J0KTtcblxuICAgICAgaWYgKG5hbWVzcGFjZXMuaW5kZXhPZihuYW1lc3BhY2UpID09PSAtMSkge1xuICAgICAgICBuYW1lc3BhY2VzLnB1c2gobmFtZXNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbXBvcnRzLnB1c2goZnVsbEltcG9ydCk7XG4gIH1cblxuICByZXR1cm4ge2ltcG9ydHMsIG5hbWVzcGFjZXN9O1xufVxuXG4vKiogTWlncmF0ZXMgdGhlIE1hdGVyaWFsIHN5bWJvbHMgaW4gYSBmaWxlLiAqL1xuZnVuY3Rpb24gbWlncmF0ZU1hdGVyaWFsU3ltYm9scyhcbiAgY29udGVudDogc3RyaW5nLFxuICBpbXBvcnRQYXRoOiBzdHJpbmcsXG4gIGRldGVjdGVkSW1wb3J0czogRGV0ZWN0SW1wb3J0UmVzdWx0LFxuICBjb21tZW50UGxhY2Vob2xkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICBleHRyYU1hdGVyaWFsU3ltYm9sczogRXh0cmFTeW1ib2xzID0ge30sXG4pOiBzdHJpbmcge1xuICBjb25zdCBpbml0aWFsQ29udGVudCA9IGNvbnRlbnQ7XG4gIGNvbnN0IG5hbWVzcGFjZSA9ICdtYXQnO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIG1peGlucy5cbiAgY29uc3QgbWl4aW5zVG9VcGRhdGUgPSB7Li4ubWF0ZXJpYWxNaXhpbnMsIC4uLmV4dHJhTWF0ZXJpYWxTeW1ib2xzLm1peGluc307XG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKFxuICAgIGNvbnRlbnQsXG4gICAgbWl4aW5zVG9VcGRhdGUsXG4gICAgZGV0ZWN0ZWRJbXBvcnRzLm5hbWVzcGFjZXMsXG4gICAgbWl4aW5LZXlGb3JtYXR0ZXIsXG4gICAgZ2V0TWl4aW5WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpLFxuICApO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIGZ1bmN0aW9ucy5cbiAgY29uc3QgZnVuY3Rpb25zVG9VcGRhdGUgPSB7Li4ubWF0ZXJpYWxGdW5jdGlvbnMsIC4uLmV4dHJhTWF0ZXJpYWxTeW1ib2xzLmZ1bmN0aW9uc307XG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKFxuICAgIGNvbnRlbnQsXG4gICAgZnVuY3Rpb25zVG9VcGRhdGUsXG4gICAgZGV0ZWN0ZWRJbXBvcnRzLm5hbWVzcGFjZXMsXG4gICAgZnVuY3Rpb25LZXlGb3JtYXR0ZXIsXG4gICAgZ2V0RnVuY3Rpb25WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpLFxuICApO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIHZhcmlhYmxlcy5cbiAgY29uc3QgdmFyaWFibGVzVG9VcGRhdGUgPSB7Li4ubWF0ZXJpYWxWYXJpYWJsZXMsIC4uLmV4dHJhTWF0ZXJpYWxTeW1ib2xzLnZhcmlhYmxlc307XG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKFxuICAgIGNvbnRlbnQsXG4gICAgdmFyaWFibGVzVG9VcGRhdGUsXG4gICAgZGV0ZWN0ZWRJbXBvcnRzLm5hbWVzcGFjZXMsXG4gICAgdmFyaWFibGVLZXlGb3JtYXR0ZXIsXG4gICAgZ2V0VmFyaWFibGVWYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpLFxuICApO1xuXG4gIGlmIChjb250ZW50ICE9PSBpbml0aWFsQ29udGVudCkge1xuICAgIC8vIEFkZCBhbiBpbXBvcnQgdG8gdGhlIG5ldyBBUEkgb25seSBpZiBhbnkgb2YgdGhlIEFQSXMgd2VyZSBiZWluZyB1c2VkLlxuICAgIGNvbnRlbnQgPSBpbnNlcnRVc2VTdGF0ZW1lbnQoY29udGVudCwgaW1wb3J0UGF0aCwgbmFtZXNwYWNlLCBjb21tZW50UGxhY2Vob2xkZXJzKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKiogTWlncmF0ZXMgdGhlIENESyBzeW1ib2xzIGluIGEgZmlsZS4gKi9cbmZ1bmN0aW9uIG1pZ3JhdGVDZGtTeW1ib2xzKFxuICBjb250ZW50OiBzdHJpbmcsXG4gIGltcG9ydFBhdGg6IHN0cmluZyxcbiAgY29tbWVudFBsYWNlaG9sZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgZGV0ZWN0ZWRJbXBvcnRzOiBEZXRlY3RJbXBvcnRSZXN1bHQsXG4pOiBzdHJpbmcge1xuICBjb25zdCBpbml0aWFsQ29udGVudCA9IGNvbnRlbnQ7XG4gIGNvbnN0IG5hbWVzcGFjZSA9ICdjZGsnO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIG1peGlucy5cbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoXG4gICAgY29udGVudCxcbiAgICBjZGtNaXhpbnMsXG4gICAgZGV0ZWN0ZWRJbXBvcnRzLm5hbWVzcGFjZXMsXG4gICAgbWl4aW5LZXlGb3JtYXR0ZXIsXG4gICAgZ2V0TWl4aW5WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpLFxuICApO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIHZhcmlhYmxlcy5cbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoXG4gICAgY29udGVudCxcbiAgICBjZGtWYXJpYWJsZXMsXG4gICAgZGV0ZWN0ZWRJbXBvcnRzLm5hbWVzcGFjZXMsXG4gICAgdmFyaWFibGVLZXlGb3JtYXR0ZXIsXG4gICAgZ2V0VmFyaWFibGVWYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpLFxuICApO1xuXG4gIC8vIFByZXZpb3VzbHkgdGhlIENESyBzeW1ib2xzIHdlcmUgZXhwb3NlZCB0aHJvdWdoIGBtYXRlcmlhbC90aGVtaW5nYCwgYnV0IG5vdyB3ZSBoYXZlIGFcbiAgLy8gZGVkaWNhdGVkIGVudHJ5cG9pbnQgZm9yIHRoZSBDREsuIE9ubHkgYWRkIGFuIGltcG9ydCBmb3IgaXQgaWYgYW55IG9mIHRoZSBzeW1ib2xzIGFyZSB1c2VkLlxuICBpZiAoY29udGVudCAhPT0gaW5pdGlhbENvbnRlbnQpIHtcbiAgICBjb250ZW50ID0gaW5zZXJ0VXNlU3RhdGVtZW50KGNvbnRlbnQsIGltcG9ydFBhdGgsIG5hbWVzcGFjZSwgY29tbWVudFBsYWNlaG9sZGVycyk7XG4gIH1cblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBSZW5hbWVzIGFsbCBTYXNzIHN5bWJvbHMgaW4gYSBmaWxlIGJhc2VkIG9uIGEgcHJlLWRlZmluZWQgbWFwcGluZy5cbiAqIEBwYXJhbSBjb250ZW50IENvbnRlbnQgb2YgYSBmaWxlIHRvIGJlIG1pZ3JhdGVkLlxuICogQHBhcmFtIG1hcHBpbmcgTWFwcGluZyBiZXR3ZWVuIHN5bWJvbCBuYW1lcyBhbmQgdGhlaXIgcmVwbGFjZW1lbnRzLlxuICogQHBhcmFtIG5hbWVzcGFjZXMgTmFtZXMgdG8gaXRlcmF0ZSBvdmVyIGFuZCBwYXNzIHRvIGdldEtleVBhdHRlcm4uXG4gKiBAcGFyYW0gZ2V0S2V5UGF0dGVybiBGdW5jdGlvbiB1c2VkIHRvIHR1cm4gZWFjaCBvZiB0aGUga2V5cyBpbnRvIGEgcmVnZXguXG4gKiBAcGFyYW0gZm9ybWF0VmFsdWUgRm9ybWF0cyB0aGUgdmFsdWUgdGhhdCB3aWxsIHJlcGxhY2UgYW55IG1hdGNoZXMgb2YgdGhlIHBhdHRlcm4gcmV0dXJuZWQgYnlcbiAqICBgZ2V0S2V5UGF0dGVybmAuXG4gKi9cbmZ1bmN0aW9uIHJlbmFtZVN5bWJvbHMoXG4gIGNvbnRlbnQ6IHN0cmluZyxcbiAgbWFwcGluZzogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgbmFtZXNwYWNlczogc3RyaW5nW10sXG4gIGdldEtleVBhdHRlcm46IChuYW1lc3BhY2U6IHN0cmluZyB8IG51bGwsIGtleTogc3RyaW5nKSA9PiBSZWdFeHAsXG4gIGZvcm1hdFZhbHVlOiAoa2V5OiBzdHJpbmcpID0+IHN0cmluZyxcbik6IHN0cmluZyB7XG4gIC8vIFRoZSBudWxsIGF0IHRoZSBlbmQgaXMgc28gdGhhdCB3ZSBtYWtlIG9uZSBsYXN0IHBhc3MgdG8gY292ZXIgbm9uLW5hbWVzcGFjZWQgc3ltYm9scy5cbiAgWy4uLm5hbWVzcGFjZXMuc2xpY2UoKSwgbnVsbF0uZm9yRWFjaChuYW1lc3BhY2UgPT4ge1xuICAgIE9iamVjdC5rZXlzKG1hcHBpbmcpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGNvbnN0IHBhdHRlcm4gPSBnZXRLZXlQYXR0ZXJuKG5hbWVzcGFjZSwga2V5KTtcblxuICAgICAgLy8gU2FuaXR5IGNoZWNrIHNpbmNlIG5vbi1nbG9iYWwgcmVnZXhlcyB3aWxsIG9ubHkgcmVwbGFjZSB0aGUgZmlyc3QgbWF0Y2guXG4gICAgICBpZiAocGF0dGVybi5mbGFncy5pbmRleE9mKCdnJykgPT09IC0xKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdSZXBsYWNlbWVudCBwYXR0ZXJuIG11c3QgYmUgZ2xvYmFsLicpO1xuICAgICAgfVxuXG4gICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKHBhdHRlcm4sIGZvcm1hdFZhbHVlKG1hcHBpbmdba2V5XSkpO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqIEluc2VydHMgYW4gYEB1c2VgIHN0YXRlbWVudCBpbiBhIHN0cmluZy4gKi9cbmZ1bmN0aW9uIGluc2VydFVzZVN0YXRlbWVudChcbiAgY29udGVudDogc3RyaW5nLFxuICBpbXBvcnRQYXRoOiBzdHJpbmcsXG4gIG5hbWVzcGFjZTogc3RyaW5nLFxuICBjb21tZW50UGxhY2Vob2xkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuKTogc3RyaW5nIHtcbiAgLy8gSWYgdGhlIGNvbnRlbnQgYWxyZWFkeSBoYXMgdGhlIGBAdXNlYCBpbXBvcnQsIHdlIGRvbid0IG5lZWQgdG8gYWRkIGFueXRoaW5nLlxuICBpZiAobmV3IFJlZ0V4cChgQHVzZSArWydcIl0ke2ltcG9ydFBhdGh9WydcIl1gLCAnZycpLnRlc3QoY29udGVudCkpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIC8vIFNhc3Mgd2lsbCB0aHJvdyBhbiBlcnJvciBpZiBhbiBgQHVzZWAgc3RhdGVtZW50IGNvbWVzIGFmdGVyIGFub3RoZXIgc3RhdGVtZW50LiBUaGUgc2FmZXN0IHdheVxuICAvLyB0byBlbnN1cmUgdGhhdCB3ZSBjb25mb3JtIHRvIHRoYXQgcmVxdWlyZW1lbnQgaXMgYnkgYWx3YXlzIGluc2VydGluZyBvdXIgaW1wb3J0cyBhdCB0aGUgdG9wXG4gIC8vIG9mIHRoZSBmaWxlLiBEZXRlY3Rpbmcgd2hlcmUgdGhlIHVzZXIncyBjb250ZW50IHN0YXJ0cyBpcyB0cmlja3ksIGJlY2F1c2UgdGhlcmUgYXJlIG1hbnlcbiAgLy8gZGlmZmVyZW50IGtpbmRzIG9mIHN5bnRheCB3ZSdkIGhhdmUgdG8gYWNjb3VudCBmb3IuIE9uZSBhcHByb2FjaCBpcyB0byBmaW5kIHRoZSBmaXJzdCBgQGltcG9ydGBcbiAgLy8gYW5kIGluc2VydCBiZWZvcmUgaXQsIGJ1dCB0aGUgcHJvYmxlbSBpcyB0aGF0IFNhc3MgYWxsb3dzIGBAaW1wb3J0YCB0byBiZSBwbGFjZWQgYW55d2hlcmUuXG4gIGxldCBuZXdJbXBvcnRJbmRleCA9IDA7XG5cbiAgLy8gT25lIHNwZWNpYWwgY2FzZSBpcyBpZiB0aGUgZmlsZSBzdGFydHMgd2l0aCBhIGxpY2Vuc2UgaGVhZGVyIHdoaWNoIHdlIHdhbnQgdG8gcHJlc2VydmUgb24gdG9wLlxuICBpZiAoY29udGVudC50cmltKCkuc3RhcnRzV2l0aChjb21tZW50UGxhY2Vob2xkZXJTdGFydCkpIHtcbiAgICBjb25zdCBjb21tZW50U3RhcnRJbmRleCA9IGNvbnRlbnQuaW5kZXhPZihjb21tZW50UGxhY2Vob2xkZXJTdGFydCk7XG4gICAgbmV3SW1wb3J0SW5kZXggPVxuICAgICAgY29udGVudC5pbmRleE9mKGNvbW1lbnRQbGFjZWhvbGRlckVuZCwgY29tbWVudFN0YXJ0SW5kZXggKyAxKSArIGNvbW1lbnRQbGFjZWhvbGRlckVuZC5sZW5ndGg7XG4gICAgLy8gSWYgdGhlIGxlYWRpbmcgY29tbWVudCBkb2Vzbid0IGVuZCB3aXRoIGEgbmV3bGluZSxcbiAgICAvLyB3ZSBuZWVkIHRvIGluc2VydCB0aGUgaW1wb3J0IGF0IHRoZSBuZXh0IGxpbmUuXG4gICAgaWYgKCFjb21tZW50UGxhY2Vob2xkZXJzW2NvbnRlbnQuc2xpY2UoY29tbWVudFN0YXJ0SW5kZXgsIG5ld0ltcG9ydEluZGV4KV0uZW5kc1dpdGgoJ1xcbicpKSB7XG4gICAgICBuZXdJbXBvcnRJbmRleCA9IE1hdGgubWF4KG5ld0ltcG9ydEluZGV4LCBjb250ZW50LmluZGV4T2YoJ1xcbicsIG5ld0ltcG9ydEluZGV4KSArIDEpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgY29udGVudC5zbGljZSgwLCBuZXdJbXBvcnRJbmRleCkgK1xuICAgIGBAdXNlICcke2ltcG9ydFBhdGh9JyBhcyAke25hbWVzcGFjZX07XFxuYCArXG4gICAgY29udGVudC5zbGljZShuZXdJbXBvcnRJbmRleClcbiAgKTtcbn1cblxuLyoqIEZvcm1hdHMgYSBtaWdyYXRpb24ga2V5IGFzIGEgU2FzcyBtaXhpbiBpbnZvY2F0aW9uLiAqL1xuZnVuY3Rpb24gbWl4aW5LZXlGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcgfCBudWxsLCBuYW1lOiBzdHJpbmcpOiBSZWdFeHAge1xuICAvLyBOb3RlIHRoYXQgYWRkaW5nIGEgYChgIGF0IHRoZSBlbmQgb2YgdGhlIHBhdHRlcm4gd291bGQgYmUgbW9yZSBhY2N1cmF0ZSwgYnV0IG1peGluXG4gIC8vIGludm9jYXRpb25zIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgdG8gaW5jbHVkZSB0aGUgcGFyZW50aGVzZXMuIFdlIGNvdWxkIGFkZCBgWyg7XWAsXG4gIC8vIGJ1dCB0aGVuIHdlIHdvbid0IGtub3cgd2hpY2ggY2hhcmFjdGVyIHRvIGluY2x1ZGUgaW4gdGhlIHJlcGxhY2VtZW50IHN0cmluZy5cbiAgcmV0dXJuIG5ldyBSZWdFeHAoYEBpbmNsdWRlICske2VzY2FwZVJlZ0V4cCgobmFtZXNwYWNlID8gbmFtZXNwYWNlICsgJy4nIDogJycpICsgbmFtZSl9YCwgJ2cnKTtcbn1cblxuLyoqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZvcm1hdCBhIFNhc3MgbWl4aW4gcmVwbGFjZW1lbnQuICovXG5mdW5jdGlvbiBnZXRNaXhpblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nKTogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgLy8gTm90ZSB0aGF0IGFkZGluZyBhIGAoYCBhdCB0aGUgZW5kIG9mIHRoZSBwYXR0ZXJuIHdvdWxkIGJlIG1vcmUgYWNjdXJhdGUsXG4gIC8vIGJ1dCBtaXhpbiBpbnZvY2F0aW9ucyBkb24ndCBuZWNlc3NhcmlseSBoYXZlIHRvIGluY2x1ZGUgdGhlIHBhcmVudGhlc2VzLlxuICByZXR1cm4gbmFtZSA9PiBgQGluY2x1ZGUgJHtuYW1lc3BhY2V9LiR7bmFtZX1gO1xufVxuXG4vKiogRm9ybWF0cyBhIG1pZ3JhdGlvbiBrZXkgYXMgYSBTYXNzIGZ1bmN0aW9uIGludm9jYXRpb24uICovXG5mdW5jdGlvbiBmdW5jdGlvbktleUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZyB8IG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGVzY2FwZVJlZ0V4cChgJHtuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJ30ke25hbWV9KGApO1xuICByZXR1cm4gbmV3IFJlZ0V4cChgKD88IVstX2EtekEtWjAtOV0pJHtmdW5jdGlvbk5hbWV9YCwgJ2cnKTtcbn1cblxuLyoqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZvcm1hdCBhIFNhc3MgZnVuY3Rpb24gcmVwbGFjZW1lbnQuICovXG5mdW5jdGlvbiBnZXRGdW5jdGlvblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nKTogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUgPT4gYCR7bmFtZXNwYWNlfS4ke25hbWV9KGA7XG59XG5cbi8qKiBGb3JtYXRzIGEgbWlncmF0aW9uIGtleSBhcyBhIFNhc3MgdmFyaWFibGUuICovXG5mdW5jdGlvbiB2YXJpYWJsZUtleUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZyB8IG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIGNvbnN0IHZhcmlhYmxlTmFtZSA9IGVzY2FwZVJlZ0V4cChgJHtuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJ30kJHtuYW1lfWApO1xuICByZXR1cm4gbmV3IFJlZ0V4cChgJHt2YXJpYWJsZU5hbWV9KD8hWy1fYS16QS1aMC05XSlgLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyB2YXJpYWJsZSByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldFZhcmlhYmxlVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICByZXR1cm4gbmFtZSA9PiBgJHtuYW1lc3BhY2V9LiQke25hbWV9YDtcbn1cblxuLyoqIEVzY2FwZXMgc3BlY2lhbCByZWdleCBjaGFyYWN0ZXJzIGluIGEgc3RyaW5nLiAqL1xuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8W1xcXVxcL1xcXFxdKS9nLCAnXFxcXCQxJyk7XG59XG5cbi8qKiBSZW1vdmVzIGFsbCBzdHJpbmdzIGZyb20gYW5vdGhlciBzdHJpbmcuICovXG5mdW5jdGlvbiByZW1vdmVTdHJpbmdzKGNvbnRlbnQ6IHN0cmluZywgdG9SZW1vdmU6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRvUmVtb3ZlXG4gICAgLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnQpID0+IGFjY3VtdWxhdG9yLnJlcGxhY2UoY3VycmVudCwgJycpLCBjb250ZW50KVxuICAgIC5yZXBsYWNlKC9eXFxzKy8sICcnKTtcbn1cblxuLyoqIFBhcnNlcyBvdXQgdGhlIG5hbWVzcGFjZSBmcm9tIGEgU2FzcyBgQHVzZWAgc3RhdGVtZW50LiAqL1xuZnVuY3Rpb24gZXh0cmFjdE5hbWVzcGFjZUZyb21Vc2VTdGF0ZW1lbnQoZnVsbEltcG9ydDogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgY2xvc2VRdW90ZUluZGV4ID0gTWF0aC5tYXgoZnVsbEltcG9ydC5sYXN0SW5kZXhPZihgXCJgKSwgZnVsbEltcG9ydC5sYXN0SW5kZXhPZihgJ2ApKTtcblxuICBpZiAoY2xvc2VRdW90ZUluZGV4ID4gLTEpIHtcbiAgICBjb25zdCBhc0V4cHJlc3Npb24gPSAnYXMgJztcbiAgICBjb25zdCBhc0luZGV4ID0gZnVsbEltcG9ydC5pbmRleE9mKGFzRXhwcmVzc2lvbiwgY2xvc2VRdW90ZUluZGV4KTtcblxuICAgIC8vIElmIHdlIGZvdW5kIGFuIGAgYXMgYCBleHByZXNzaW9uLCB3ZSBjb25zaWRlciB0aGUgcmVzdCBvZiB0aGUgdGV4dCBhcyB0aGUgbmFtZXNwYWNlLlxuICAgIGlmIChhc0luZGV4ID4gLTEpIHtcbiAgICAgIHJldHVybiBmdWxsSW1wb3J0XG4gICAgICAgIC5zbGljZShhc0luZGV4ICsgYXNFeHByZXNzaW9uLmxlbmd0aClcbiAgICAgICAgLnNwbGl0KCc7JylbMF1cbiAgICAgICAgLnRyaW0oKTtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgdGhlIG5hbWVzcGFjZSBpcyB0aGUgbmFtZSBvZiB0aGUgZmlsZSB0aGF0IGlzIGJlaW5nIGltcG9ydGVkLlxuICAgIGNvbnN0IGxhc3RTbGFzaEluZGV4ID0gZnVsbEltcG9ydC5sYXN0SW5kZXhPZignLycsIGNsb3NlUXVvdGVJbmRleCk7XG5cbiAgICBpZiAobGFzdFNsYXNoSW5kZXggPiAtMSkge1xuICAgICAgY29uc3QgZmlsZU5hbWUgPSBmdWxsSW1wb3J0XG4gICAgICAgIC5zbGljZShsYXN0U2xhc2hJbmRleCArIDEsIGNsb3NlUXVvdGVJbmRleClcbiAgICAgICAgLy8gU2FzcyBhbGxvd3MgZm9yIGxlYWRpbmcgdW5kZXJzY29yZXMgdG8gYmUgb21pdHRlZCBhbmQgaXQgdGVjaG5pY2FsbHkgc3VwcG9ydHMgLnNjc3MuXG4gICAgICAgIC5yZXBsYWNlKC9eX3woXFwuaW1wb3J0KT9cXC5zY3NzJHxcXC5pbXBvcnQkL2csICcnKTtcblxuICAgICAgLy8gU2FzcyBpZ25vcmVzIGAvaW5kZXhgIGFuZCBpbmZlcnMgdGhlIG5hbWVzcGFjZSBhcyB0aGUgbmV4dCBzZWdtZW50IGluIHRoZSBwYXRoLlxuICAgICAgaWYgKGZpbGVOYW1lID09PSAnaW5kZXgnKSB7XG4gICAgICAgIGNvbnN0IG5leHRTbGFzaEluZGV4ID0gZnVsbEltcG9ydC5sYXN0SW5kZXhPZignLycsIGxhc3RTbGFzaEluZGV4IC0gMSk7XG5cbiAgICAgICAgaWYgKG5leHRTbGFzaEluZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gZnVsbEltcG9ydC5zbGljZShuZXh0U2xhc2hJbmRleCArIDEsIGxhc3RTbGFzaEluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZpbGVOYW1lO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRocm93IEVycm9yKGBDb3VsZCBub3QgZXh0cmFjdCBuYW1lc3BhY2UgZnJvbSBpbXBvcnQgXCIke2Z1bGxJbXBvcnR9XCIuYCk7XG59XG5cbi8qKlxuICogUmVwbGFjZXMgdmFyaWFibGVzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQgd2l0aCB0aGVpciB2YWx1ZXMuXG4gKiBAcGFyYW0gY29udGVudCBDb250ZW50IG9mIHRoZSBmaWxlIHRvIGJlIG1pZ3JhdGVkLlxuICogQHBhcmFtIHZhcmlhYmxlcyBNYXBwaW5nIGJldHdlZW4gdmFyaWFibGUgbmFtZXMgYW5kIHRoZWlyIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gcmVwbGFjZVJlbW92ZWRWYXJpYWJsZXMoY29udGVudDogc3RyaW5nLCB2YXJpYWJsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBzdHJpbmcge1xuICBPYmplY3Qua2V5cyh2YXJpYWJsZXMpLmZvckVhY2godmFyaWFibGVOYW1lID0+IHtcbiAgICAvLyBOb3RlIHRoYXQgdGhlIHBhdHRlcm4gdXNlcyBhIG5lZ2F0aXZlIGxvb2thaGVhZCB0byBleGNsdWRlXG4gICAgLy8gdmFyaWFibGUgYXNzaWdubWVudHMsIGJlY2F1c2UgdGhleSBjYW4ndCBiZSBtaWdyYXRlZC5cbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFxcXFwkJHtlc2NhcGVSZWdFeHAodmFyaWFibGVOYW1lKX0oPyFcXFxccys6fDopYCwgJ2cnKTtcbiAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKHJlZ2V4LCB2YXJpYWJsZXNbdmFyaWFibGVOYW1lXSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIFJlcGxhY2VzIGFsbCBvZiB0aGUgY29tbWVudHMgaW4gYSBTYXNzIGZpbGUgd2l0aCBwbGFjZWhvbGRlcnMgYW5kXG4gKiByZXR1cm5zIHRoZSBsaXN0IG9mIHBsYWNlaG9sZGVycyBzbyB0aGV5IGNhbiBiZSByZXN0b3JlZCBsYXRlci5cbiAqL1xuZnVuY3Rpb24gZXNjYXBlQ29tbWVudHMoY29udGVudDogc3RyaW5nKToge2NvbnRlbnQ6IHN0cmluZzsgcGxhY2Vob2xkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fSB7XG4gIGNvbnN0IHBsYWNlaG9sZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBsZXQgY29tbWVudENvdW50ZXIgPSAwO1xuICBsZXQgW29wZW5JbmRleCwgY2xvc2VJbmRleF0gPSBmaW5kQ29tbWVudChjb250ZW50KTtcblxuICB3aGlsZSAob3BlbkluZGV4ID4gLTEgJiYgY2xvc2VJbmRleCA+IC0xKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSBjb21tZW50UGxhY2Vob2xkZXJTdGFydCArIGNvbW1lbnRDb3VudGVyKysgKyBjb21tZW50UGxhY2Vob2xkZXJFbmQ7XG4gICAgcGxhY2Vob2xkZXJzW3BsYWNlaG9sZGVyXSA9IGNvbnRlbnQuc2xpY2Uob3BlbkluZGV4LCBjbG9zZUluZGV4KTtcbiAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgwLCBvcGVuSW5kZXgpICsgcGxhY2Vob2xkZXIgKyBjb250ZW50LnNsaWNlKGNsb3NlSW5kZXgpO1xuICAgIFtvcGVuSW5kZXgsIGNsb3NlSW5kZXhdID0gZmluZENvbW1lbnQoY29udGVudCk7XG4gIH1cblxuICByZXR1cm4ge2NvbnRlbnQsIHBsYWNlaG9sZGVyc307XG59XG5cbi8qKiBGaW5kcyB0aGUgc3RhcnQgYW5kIGVuZCBpbmRleCBvZiBhIGNvbW1lbnQgaW4gYSBmaWxlLiAqL1xuZnVuY3Rpb24gZmluZENvbW1lbnQoY29udGVudDogc3RyaW5nKTogW29wZW5JbmRleDogbnVtYmVyLCBjbG9zZUluZGV4OiBudW1iZXJdIHtcbiAgLy8gQWRkIGFuIGV4dHJhIG5ldyBsaW5lIGF0IHRoZSBlbmQgc28gdGhhdCB3ZSBjYW4gY29ycmVjdGx5IGNhcHR1cmUgc2luZ2xlLWxpbmUgY29tbWVudHNcbiAgLy8gYXQgdGhlIGVuZCBvZiB0aGUgZmlsZS4gSXQgZG9lc24ndCByZWFsbHkgbWF0dGVyIHRoYXQgdGhlIGVuZCBpbmRleCB3aWxsIGJlIG91dCBvZiBib3VuZHMsXG4gIC8vIGJlY2F1c2UgYFN0cmluZy5wcm90b3R5cGUuc2xpY2VgIHdpbGwgY2xhbXAgaXQgdG8gdGhlIHN0cmluZyBsZW5ndGguXG4gIGNvbnRlbnQgKz0gJ1xcbic7XG5cbiAgZm9yIChjb25zdCBbb3BlbiwgY2xvc2VdIG9mIGNvbW1lbnRQYWlycy5lbnRyaWVzKCkpIHtcbiAgICBjb25zdCBvcGVuSW5kZXggPSBjb250ZW50LmluZGV4T2Yob3Blbik7XG5cbiAgICBpZiAob3BlbkluZGV4ID4gLTEpIHtcbiAgICAgIGNvbnN0IGNsb3NlSW5kZXggPSBjb250ZW50LmluZGV4T2YoY2xvc2UsIG9wZW5JbmRleCArIDEpO1xuICAgICAgcmV0dXJuIGNsb3NlSW5kZXggPiAtMSA/IFtvcGVuSW5kZXgsIGNsb3NlSW5kZXggKyBjbG9zZS5sZW5ndGhdIDogWy0xLCAtMV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFstMSwgLTFdO1xufVxuXG4vKiogUmVzdG9yZXMgdGhlIGNvbW1lbnRzIHRoYXQgaGF2ZSBiZWVuIGVzY2FwZWQgYnkgYGVzY2FwZUNvbW1lbnRzYC4gKi9cbmZ1bmN0aW9uIHJlc3RvcmVDb21tZW50cyhjb250ZW50OiBzdHJpbmcsIHBsYWNlaG9sZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IHN0cmluZyB7XG4gIE9iamVjdC5rZXlzKHBsYWNlaG9sZGVycykuZm9yRWFjaChrZXkgPT4gKGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2Uoa2V5LCBwbGFjZWhvbGRlcnNba2V5XSkpKTtcbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG4iXX0=