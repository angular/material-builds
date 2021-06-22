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
const commentPairs = new Map([['/*', '*/'], ['//', '\n']]);
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
 *   Has to end with a slash. E.g. if `@import '~@angular/material/theming'` should be
 *   matched, the prefix would be `~@angular/material/`.
 * @param oldCdkPrefix Prefix with which the old CDK imports should start.
 *   Has to end with a slash. E.g. if `@import '~@angular/cdk/overlay'` should be
 *   matched, the prefix would be `~@angular/cdk/`.
 * @param newMaterialImportPath New import to the Material theming API (e.g. `~@angular/material`).
 * @param newCdkImportPath New import to the CDK Sass APIs (e.g. `~@angular/cdk`).
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
    const pattern = new RegExp(`@(import|use) +['"]${escapeRegExp(prefix)}.*['"].*;?\n`, 'g');
    let match = null;
    while (match = pattern.exec(content)) {
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
        newImportIndex = content.indexOf(commentPlaceholderEnd, commentStartIndex + 1) +
            commentPlaceholderEnd.length;
        // If the leading comment doesn't end with a newline,
        // we need to insert the import at the next line.
        if (!commentPlaceholders[content.slice(commentStartIndex, newImportIndex)].endsWith('\n')) {
            newImportIndex = Math.max(newImportIndex, content.indexOf('\n', newImportIndex) + 1);
        }
    }
    return content.slice(0, newImportIndex) + `@use '${importPath}' as ${namespace};\n` +
        content.slice(newImportIndex);
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
            return fullImport.slice(asIndex + asExpression.length).split(';')[0].trim();
        }
        // Otherwise the namespace is the name of the file that is being imported.
        const lastSlashIndex = fullImport.lastIndexOf('/', closeQuoteIndex);
        if (lastSlashIndex > -1) {
            const fileName = fullImport.slice(lastSlashIndex + 1, closeQuoteIndex)
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
        const placeholder = commentPlaceholderStart + (commentCounter++) + commentPlaceholderEnd;
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
    Object.keys(placeholders).forEach(key => content = content.replace(key, placeholders[key]));
    return content;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvdGhlbWluZy1hcGktdjEyL21pZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCxxQ0FRa0I7QUFlbEIsMkRBQTJEO0FBQzNELE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUUzRSx1RUFBdUU7QUFDdkUsTUFBTSx1QkFBdUIsR0FBRyxzQ0FBc0MsQ0FBQztBQUV2RSxpREFBaUQ7QUFDakQsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLENBQUM7QUFFckM7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FBQyxXQUFtQixFQUNuQixpQkFBeUIsRUFDekIsWUFBb0IsRUFDcEIscUJBQTZCLEVBQzdCLGdCQUF3QixFQUN4Qix1QkFBcUMsRUFBRSxFQUN2QyxlQUF3QjtJQUN6RCxJQUFJLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMxRCxNQUFNLGVBQWUsR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ25GLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBRXpFLHdFQUF3RTtJQUN4RSx5RUFBeUU7SUFDekUsT0FBTyxHQUFHLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDakYsT0FBTyxHQUFHLHNCQUFzQixDQUM1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LFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzVFO0tBQ0Y7SUFFRCxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDO0FBRUQsd0VBQXdFO0FBQ3hFLFNBQVMsZUFBZSxDQUFDLE9BQWUsRUFBRSxZQUFvQztJQUM1RSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVGLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgbWF0ZXJpYWxNaXhpbnMsXG4gIG1hdGVyaWFsRnVuY3Rpb25zLFxuICBtYXRlcmlhbFZhcmlhYmxlcyxcbiAgY2RrTWl4aW5zLFxuICBjZGtWYXJpYWJsZXMsXG4gIHJlbW92ZWRNYXRlcmlhbFZhcmlhYmxlcyxcbiAgdW5wcmVmaXhlZFJlbW92ZWRWYXJpYWJsZXNcbn0gZnJvbSAnLi9jb25maWcnO1xuXG4vKiogVGhlIHJlc3VsdCBvZiBhIHNlYXJjaCBmb3IgaW1wb3J0cyBhbmQgbmFtZXNwYWNlcyBpbiBhIGZpbGUuICovXG5pbnRlcmZhY2UgRGV0ZWN0SW1wb3J0UmVzdWx0IHtcbiAgaW1wb3J0czogc3RyaW5nW107XG4gIG5hbWVzcGFjZXM6IHN0cmluZ1tdO1xufVxuXG4vKiogQWRkaXRpb24gbWl4aW4gYW5kIGZ1bmN0aW9uIG5hbWVzIHRoYXQgY2FuIGJlIHVwZGF0ZWQgd2hlbiBpbnZva2luZyBtaWdyYXRpb24gZGlyZWN0bHkuICovXG5pbnRlcmZhY2UgRXh0cmFTeW1ib2xzIHtcbiAgbWl4aW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgZnVuY3Rpb25zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgdmFyaWFibGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn1cblxuLyoqIFBvc3NpYmxlIHBhaXJzIG9mIGNvbW1lbnQgY2hhcmFjdGVycyBpbiBhIFNhc3MgZmlsZS4gKi9cbmNvbnN0IGNvbW1lbnRQYWlycyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KFtbJy8qJywgJyovJ10sIFsnLy8nLCAnXFxuJ11dKTtcblxuLyoqIFByZWZpeCBmb3IgdGhlIHBsYWNlaG9sZGVyIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGVzY2FwZSBjb21tZW50cy4gKi9cbmNvbnN0IGNvbW1lbnRQbGFjZWhvbGRlclN0YXJ0ID0gJ19fPDxuZ1RoZW1pbmdNaWdyYXRpb25Fc2NhcGVkQ29tbWVudCc7XG5cbi8qKiBTdWZmaXggZm9yIHRoZSBjb21tZW50IGVzY2FwZSBwbGFjZWhvbGRlci4gKi9cbmNvbnN0IGNvbW1lbnRQbGFjZWhvbGRlckVuZCA9ICc+Pl9fJztcblxuLyoqXG4gKiBNaWdyYXRlcyB0aGUgY29udGVudCBvZiBhIGZpbGUgdG8gdGhlIG5ldyB0aGVtaW5nIEFQSS4gTm90ZSB0aGF0IHRoaXMgbWlncmF0aW9uIGlzIHVzaW5nIHBsYWluXG4gKiBzdHJpbmcgbWFuaXB1bGF0aW9uLCByYXRoZXIgdGhhbiB0aGUgQVNUIGZyb20gUG9zdENTUyBhbmQgdGhlIHNjaGVtYXRpY3Mgc3RyaW5nIG1hbmlwdWxhdGlvblxuICogQVBJcywgYmVjYXVzZSBpdCBhbGxvd3MgdXMgdG8gcnVuIGl0IGluc2lkZSBnMyBhbmQgdG8gYXZvaWQgaW50cm9kdWNpbmcgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSBmaWxlQ29udGVudCBDb250ZW50IG9mIHRoZSBmaWxlLlxuICogQHBhcmFtIG9sZE1hdGVyaWFsUHJlZml4IFByZWZpeCB3aXRoIHdoaWNoIHRoZSBvbGQgTWF0ZXJpYWwgaW1wb3J0cyBzaG91bGQgc3RhcnQuXG4gKiAgIEhhcyB0byBlbmQgd2l0aCBhIHNsYXNoLiBFLmcuIGlmIGBAaW1wb3J0ICd+QGFuZ3VsYXIvbWF0ZXJpYWwvdGhlbWluZydgIHNob3VsZCBiZVxuICogICBtYXRjaGVkLCB0aGUgcHJlZml4IHdvdWxkIGJlIGB+QGFuZ3VsYXIvbWF0ZXJpYWwvYC5cbiAqIEBwYXJhbSBvbGRDZGtQcmVmaXggUHJlZml4IHdpdGggd2hpY2ggdGhlIG9sZCBDREsgaW1wb3J0cyBzaG91bGQgc3RhcnQuXG4gKiAgIEhhcyB0byBlbmQgd2l0aCBhIHNsYXNoLiBFLmcuIGlmIGBAaW1wb3J0ICd+QGFuZ3VsYXIvY2RrL292ZXJsYXknYCBzaG91bGQgYmVcbiAqICAgbWF0Y2hlZCwgdGhlIHByZWZpeCB3b3VsZCBiZSBgfkBhbmd1bGFyL2Nkay9gLlxuICogQHBhcmFtIG5ld01hdGVyaWFsSW1wb3J0UGF0aCBOZXcgaW1wb3J0IHRvIHRoZSBNYXRlcmlhbCB0aGVtaW5nIEFQSSAoZS5nLiBgfkBhbmd1bGFyL21hdGVyaWFsYCkuXG4gKiBAcGFyYW0gbmV3Q2RrSW1wb3J0UGF0aCBOZXcgaW1wb3J0IHRvIHRoZSBDREsgU2FzcyBBUElzIChlLmcuIGB+QGFuZ3VsYXIvY2RrYCkuXG4gKiBAcGFyYW0gZXhjbHVkZWRJbXBvcnRzIFBhdHRlcm4gdGhhdCBjYW4gYmUgdXNlZCB0byBleGNsdWRlIGltcG9ydHMgZnJvbSBiZWluZyBwcm9jZXNzZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaWdyYXRlRmlsZUNvbnRlbnQoZmlsZUNvbnRlbnQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkTWF0ZXJpYWxQcmVmaXg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkQ2RrUHJlZml4OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld01hdGVyaWFsSW1wb3J0UGF0aDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDZGtJbXBvcnRQYXRoOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhTWF0ZXJpYWxTeW1ib2xzOiBFeHRyYVN5bWJvbHMgPSB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZWRJbXBvcnRzPzogUmVnRXhwKTogc3RyaW5nIHtcbiAgbGV0IHtjb250ZW50LCBwbGFjZWhvbGRlcnN9ID0gZXNjYXBlQ29tbWVudHMoZmlsZUNvbnRlbnQpO1xuICBjb25zdCBtYXRlcmlhbFJlc3VsdHMgPSBkZXRlY3RJbXBvcnRzKGNvbnRlbnQsIG9sZE1hdGVyaWFsUHJlZml4LCBleGNsdWRlZEltcG9ydHMpO1xuICBjb25zdCBjZGtSZXN1bHRzID0gZGV0ZWN0SW1wb3J0cyhjb250ZW50LCBvbGRDZGtQcmVmaXgsIGV4Y2x1ZGVkSW1wb3J0cyk7XG5cbiAgLy8gVHJ5IHRvIG1pZ3JhdGUgdGhlIHN5bWJvbHMgZXZlbiBpZiB0aGVyZSBhcmUgbm8gaW1wb3J0cy4gVGhpcyBpcyB1c2VkXG4gIC8vIHRvIGNvdmVyIHRoZSBjYXNlIHdoZXJlIHRoZSBDb21wb25lbnRzIHN5bWJvbHMgd2VyZSB1c2VkIHRyYW5zaXRpdmVseS5cbiAgY29udGVudCA9IG1pZ3JhdGVDZGtTeW1ib2xzKGNvbnRlbnQsIG5ld0Nka0ltcG9ydFBhdGgsIHBsYWNlaG9sZGVycywgY2RrUmVzdWx0cyk7XG4gIGNvbnRlbnQgPSBtaWdyYXRlTWF0ZXJpYWxTeW1ib2xzKFxuICAgICAgY29udGVudCwgbmV3TWF0ZXJpYWxJbXBvcnRQYXRoLCBtYXRlcmlhbFJlc3VsdHMsIHBsYWNlaG9sZGVycywgZXh0cmFNYXRlcmlhbFN5bWJvbHMpO1xuICBjb250ZW50ID0gcmVwbGFjZVJlbW92ZWRWYXJpYWJsZXMoY29udGVudCwgcmVtb3ZlZE1hdGVyaWFsVmFyaWFibGVzKTtcblxuICAvLyBXZSBjYW4gYXNzdW1lIHRoYXQgdGhlIG1pZ3JhdGlvbiBoYXMgdGFrZW4gY2FyZSBvZiBhbnkgQ29tcG9uZW50cyBzeW1ib2xzIHRoYXQgd2VyZVxuICAvLyBpbXBvcnRlZCB0cmFuc2l0aXZlbHkgc28gd2UgY2FuIGFsd2F5cyBkcm9wIHRoZSBvbGQgaW1wb3J0cy4gV2UgYWxzbyBhc3N1bWUgdGhhdCBpbXBvcnRzXG4gIC8vIHRvIHRoZSBuZXcgZW50cnkgcG9pbnRzIGhhdmUgYmVlbiBhZGRlZCBhbHJlYWR5LlxuICBpZiAobWF0ZXJpYWxSZXN1bHRzLmltcG9ydHMubGVuZ3RoKSB7XG4gICAgY29udGVudCA9IHJlcGxhY2VSZW1vdmVkVmFyaWFibGVzKGNvbnRlbnQsIHVucHJlZml4ZWRSZW1vdmVkVmFyaWFibGVzKTtcbiAgICBjb250ZW50ID0gcmVtb3ZlU3RyaW5ncyhjb250ZW50LCBtYXRlcmlhbFJlc3VsdHMuaW1wb3J0cyk7XG4gIH1cblxuICBpZiAoY2RrUmVzdWx0cy5pbXBvcnRzLmxlbmd0aCkge1xuICAgIGNvbnRlbnQgPSByZW1vdmVTdHJpbmdzKGNvbnRlbnQsIGNka1Jlc3VsdHMuaW1wb3J0cyk7XG4gIH1cblxuICByZXR1cm4gcmVzdG9yZUNvbW1lbnRzKGNvbnRlbnQsIHBsYWNlaG9sZGVycyk7XG59XG5cbi8qKlxuICogQ291bnRzIHRoZSBudW1iZXIgb2YgaW1wb3J0cyB3aXRoIGEgc3BlY2lmaWMgcHJlZml4IGFuZCBleHRyYWN0cyB0aGVpciBuYW1lc3BhY2VzLlxuICogQHBhcmFtIGNvbnRlbnQgRmlsZSBjb250ZW50IGluIHdoaWNoIHRvIGxvb2sgZm9yIGltcG9ydHMuXG4gKiBAcGFyYW0gcHJlZml4IFByZWZpeCB0aGF0IHRoZSBpbXBvcnRzIHNob3VsZCBzdGFydCB3aXRoLlxuICogQHBhcmFtIGV4Y2x1ZGVkSW1wb3J0cyBQYXR0ZXJuIHRoYXQgY2FuIGJlIHVzZWQgdG8gZXhjbHVkZSBpbXBvcnRzIGZyb20gYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5mdW5jdGlvbiBkZXRlY3RJbXBvcnRzKGNvbnRlbnQ6IHN0cmluZywgcHJlZml4OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVkSW1wb3J0cz86IFJlZ0V4cCk6IERldGVjdEltcG9ydFJlc3VsdCB7XG4gIGlmIChwcmVmaXhbcHJlZml4Lmxlbmd0aCAtIDFdICE9PSAnLycpIHtcbiAgICAvLyBTb21lIG9mIHRoZSBsb2dpYyBmdXJ0aGVyIGRvd24gbWFrZXMgYXNzdW1wdGlvbnMgYWJvdXQgdGhlIGltcG9ydCBkZXB0aC5cbiAgICB0aHJvdyBFcnJvcihgUHJlZml4IFwiJHtwcmVmaXh9XCIgaGFzIHRvIGVuZCBpbiBhIHNsYXNoLmApO1xuICB9XG5cbiAgLy8gTGlzdCBvZiBgQHVzZWAgbmFtZXNwYWNlcyBmcm9tIHdoaWNoIEFuZ3VsYXIgQ0RLL01hdGVyaWFsIEFQSXMgbWF5IGJlIHJlZmVyZW5jZWQuXG4gIC8vIFNpbmNlIHdlIGtub3cgdGhhdCB0aGUgbGlicmFyeSBkb2Vzbid0IGhhdmUgYW55IG5hbWUgY29sbGlzaW9ucywgd2UgY2FuIHRyZWF0IGFsbCBvZiB0aGVzZVxuICAvLyBuYW1lc3BhY2VzIGFzIGVxdWl2YWxlbnQuXG4gIGNvbnN0IG5hbWVzcGFjZXM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGltcG9ydHM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKGBAKGltcG9ydHx1c2UpICtbJ1wiXSR7ZXNjYXBlUmVnRXhwKHByZWZpeCl9LipbJ1wiXS4qOz9cXG5gLCAnZycpO1xuICBsZXQgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGwgPSBudWxsO1xuXG4gIHdoaWxlIChtYXRjaCA9IHBhdHRlcm4uZXhlYyhjb250ZW50KSkge1xuICAgIGNvbnN0IFtmdWxsSW1wb3J0LCB0eXBlXSA9IG1hdGNoO1xuXG4gICAgaWYgKGV4Y2x1ZGVkSW1wb3J0cz8udGVzdChmdWxsSW1wb3J0KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09ICd1c2UnKSB7XG4gICAgICBjb25zdCBuYW1lc3BhY2UgPSBleHRyYWN0TmFtZXNwYWNlRnJvbVVzZVN0YXRlbWVudChmdWxsSW1wb3J0KTtcblxuICAgICAgaWYgKG5hbWVzcGFjZXMuaW5kZXhPZihuYW1lc3BhY2UpID09PSAtMSkge1xuICAgICAgICBuYW1lc3BhY2VzLnB1c2gobmFtZXNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbXBvcnRzLnB1c2goZnVsbEltcG9ydCk7XG4gIH1cblxuICByZXR1cm4ge2ltcG9ydHMsIG5hbWVzcGFjZXN9O1xufVxuXG4vKiogTWlncmF0ZXMgdGhlIE1hdGVyaWFsIHN5bWJvbHMgaW4gYSBmaWxlLiAqL1xuZnVuY3Rpb24gbWlncmF0ZU1hdGVyaWFsU3ltYm9scyhjb250ZW50OiBzdHJpbmcsIGltcG9ydFBhdGg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0ZWN0ZWRJbXBvcnRzOiBEZXRlY3RJbXBvcnRSZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRQbGFjZWhvbGRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhTWF0ZXJpYWxTeW1ib2xzOiBFeHRyYVN5bWJvbHMgPSB7fSk6IHN0cmluZyB7XG4gIGNvbnN0IGluaXRpYWxDb250ZW50ID0gY29udGVudDtcbiAgY29uc3QgbmFtZXNwYWNlID0gJ21hdCc7XG5cbiAgLy8gTWlncmF0ZSB0aGUgbWl4aW5zLlxuICBjb25zdCBtaXhpbnNUb1VwZGF0ZSA9IHsuLi5tYXRlcmlhbE1peGlucywgLi4uZXh0cmFNYXRlcmlhbFN5bWJvbHMubWl4aW5zfTtcbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgbWl4aW5zVG9VcGRhdGUsIGRldGVjdGVkSW1wb3J0cy5uYW1lc3BhY2VzLCBtaXhpbktleUZvcm1hdHRlcixcbiAgICBnZXRNaXhpblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSkpO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIGZ1bmN0aW9ucy5cbiAgY29uc3QgZnVuY3Rpb25zVG9VcGRhdGUgPSB7Li4ubWF0ZXJpYWxGdW5jdGlvbnMsIC4uLmV4dHJhTWF0ZXJpYWxTeW1ib2xzLmZ1bmN0aW9uc307XG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIGZ1bmN0aW9uc1RvVXBkYXRlLCBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcyxcbiAgICBmdW5jdGlvbktleUZvcm1hdHRlciwgZ2V0RnVuY3Rpb25WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBNaWdyYXRlIHRoZSB2YXJpYWJsZXMuXG4gIGNvbnN0IHZhcmlhYmxlc1RvVXBkYXRlID0gey4uLm1hdGVyaWFsVmFyaWFibGVzLCAuLi5leHRyYU1hdGVyaWFsU3ltYm9scy52YXJpYWJsZXN9O1xuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhjb250ZW50LCB2YXJpYWJsZXNUb1VwZGF0ZSwgZGV0ZWN0ZWRJbXBvcnRzLm5hbWVzcGFjZXMsXG4gICAgdmFyaWFibGVLZXlGb3JtYXR0ZXIsIGdldFZhcmlhYmxlVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlKSk7XG5cbiAgaWYgKGNvbnRlbnQgIT09IGluaXRpYWxDb250ZW50KSB7XG4gICAgLy8gQWRkIGFuIGltcG9ydCB0byB0aGUgbmV3IEFQSSBvbmx5IGlmIGFueSBvZiB0aGUgQVBJcyB3ZXJlIGJlaW5nIHVzZWQuXG4gICAgY29udGVudCA9IGluc2VydFVzZVN0YXRlbWVudChjb250ZW50LCBpbXBvcnRQYXRoLCBuYW1lc3BhY2UsIGNvbW1lbnRQbGFjZWhvbGRlcnMpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKiBNaWdyYXRlcyB0aGUgQ0RLIHN5bWJvbHMgaW4gYSBmaWxlLiAqL1xuZnVuY3Rpb24gbWlncmF0ZUNka1N5bWJvbHMoY29udGVudDogc3RyaW5nLCBpbXBvcnRQYXRoOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50UGxhY2Vob2xkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0ZWN0ZWRJbXBvcnRzOiBEZXRlY3RJbXBvcnRSZXN1bHQpOiBzdHJpbmcge1xuICBjb25zdCBpbml0aWFsQ29udGVudCA9IGNvbnRlbnQ7XG4gIGNvbnN0IG5hbWVzcGFjZSA9ICdjZGsnO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIG1peGlucy5cbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgY2RrTWl4aW5zLCBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcywgbWl4aW5LZXlGb3JtYXR0ZXIsXG4gICAgZ2V0TWl4aW5WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBNaWdyYXRlIHRoZSB2YXJpYWJsZXMuXG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIGNka1ZhcmlhYmxlcywgZGV0ZWN0ZWRJbXBvcnRzLm5hbWVzcGFjZXMsIHZhcmlhYmxlS2V5Rm9ybWF0dGVyLFxuICAgIGdldFZhcmlhYmxlVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlKSk7XG5cbiAgLy8gUHJldmlvdXNseSB0aGUgQ0RLIHN5bWJvbHMgd2VyZSBleHBvc2VkIHRocm91Z2ggYG1hdGVyaWFsL3RoZW1pbmdgLCBidXQgbm93IHdlIGhhdmUgYVxuICAvLyBkZWRpY2F0ZWQgZW50cnlwb2ludCBmb3IgdGhlIENESy4gT25seSBhZGQgYW4gaW1wb3J0IGZvciBpdCBpZiBhbnkgb2YgdGhlIHN5bWJvbHMgYXJlIHVzZWQuXG4gIGlmIChjb250ZW50ICE9PSBpbml0aWFsQ29udGVudCkge1xuICAgIGNvbnRlbnQgPSBpbnNlcnRVc2VTdGF0ZW1lbnQoY29udGVudCwgaW1wb3J0UGF0aCwgbmFtZXNwYWNlLCBjb21tZW50UGxhY2Vob2xkZXJzKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIFJlbmFtZXMgYWxsIFNhc3Mgc3ltYm9scyBpbiBhIGZpbGUgYmFzZWQgb24gYSBwcmUtZGVmaW5lZCBtYXBwaW5nLlxuICogQHBhcmFtIGNvbnRlbnQgQ29udGVudCBvZiBhIGZpbGUgdG8gYmUgbWlncmF0ZWQuXG4gKiBAcGFyYW0gbWFwcGluZyBNYXBwaW5nIGJldHdlZW4gc3ltYm9sIG5hbWVzIGFuZCB0aGVpciByZXBsYWNlbWVudHMuXG4gKiBAcGFyYW0gbmFtZXNwYWNlcyBOYW1lcyB0byBpdGVyYXRlIG92ZXIgYW5kIHBhc3MgdG8gZ2V0S2V5UGF0dGVybi5cbiAqIEBwYXJhbSBnZXRLZXlQYXR0ZXJuIEZ1bmN0aW9uIHVzZWQgdG8gdHVybiBlYWNoIG9mIHRoZSBrZXlzIGludG8gYSByZWdleC5cbiAqIEBwYXJhbSBmb3JtYXRWYWx1ZSBGb3JtYXRzIHRoZSB2YWx1ZSB0aGF0IHdpbGwgcmVwbGFjZSBhbnkgbWF0Y2hlcyBvZiB0aGUgcGF0dGVybiByZXR1cm5lZCBieVxuICogIGBnZXRLZXlQYXR0ZXJuYC5cbiAqL1xuZnVuY3Rpb24gcmVuYW1lU3ltYm9scyhjb250ZW50OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgIG1hcHBpbmc6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZXM6IHN0cmluZ1tdLFxuICAgICAgICAgICAgICAgICAgICAgICBnZXRLZXlQYXR0ZXJuOiAobmFtZXNwYWNlOiBzdHJpbmd8bnVsbCwga2V5OiBzdHJpbmcpID0+IFJlZ0V4cCxcbiAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0VmFsdWU6IChrZXk6IHN0cmluZykgPT4gc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gVGhlIG51bGwgYXQgdGhlIGVuZCBpcyBzbyB0aGF0IHdlIG1ha2Ugb25lIGxhc3QgcGFzcyB0byBjb3ZlciBub24tbmFtZXNwYWNlZCBzeW1ib2xzLlxuICBbLi4ubmFtZXNwYWNlcy5zbGljZSgpLCBudWxsXS5mb3JFYWNoKG5hbWVzcGFjZSA9PiB7XG4gICAgT2JqZWN0LmtleXMobWFwcGluZykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgcGF0dGVybiA9IGdldEtleVBhdHRlcm4obmFtZXNwYWNlLCBrZXkpO1xuXG4gICAgICAvLyBTYW5pdHkgY2hlY2sgc2luY2Ugbm9uLWdsb2JhbCByZWdleGVzIHdpbGwgb25seSByZXBsYWNlIHRoZSBmaXJzdCBtYXRjaC5cbiAgICAgIGlmIChwYXR0ZXJuLmZsYWdzLmluZGV4T2YoJ2cnKSA9PT0gLTEpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1JlcGxhY2VtZW50IHBhdHRlcm4gbXVzdCBiZSBnbG9iYWwuJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UocGF0dGVybiwgZm9ybWF0VmFsdWUobWFwcGluZ1trZXldKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKiogSW5zZXJ0cyBhbiBgQHVzZWAgc3RhdGVtZW50IGluIGEgc3RyaW5nLiAqL1xuZnVuY3Rpb24gaW5zZXJ0VXNlU3RhdGVtZW50KGNvbnRlbnQ6IHN0cmluZywgaW1wb3J0UGF0aDogc3RyaW5nLCBuYW1lc3BhY2U6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50UGxhY2Vob2xkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogc3RyaW5nIHtcbiAgLy8gSWYgdGhlIGNvbnRlbnQgYWxyZWFkeSBoYXMgdGhlIGBAdXNlYCBpbXBvcnQsIHdlIGRvbid0IG5lZWQgdG8gYWRkIGFueXRoaW5nLlxuICBpZiAobmV3IFJlZ0V4cChgQHVzZSArWydcIl0ke2ltcG9ydFBhdGh9WydcIl1gLCAnZycpLnRlc3QoY29udGVudCkpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIC8vIFNhc3Mgd2lsbCB0aHJvdyBhbiBlcnJvciBpZiBhbiBgQHVzZWAgc3RhdGVtZW50IGNvbWVzIGFmdGVyIGFub3RoZXIgc3RhdGVtZW50LiBUaGUgc2FmZXN0IHdheVxuICAvLyB0byBlbnN1cmUgdGhhdCB3ZSBjb25mb3JtIHRvIHRoYXQgcmVxdWlyZW1lbnQgaXMgYnkgYWx3YXlzIGluc2VydGluZyBvdXIgaW1wb3J0cyBhdCB0aGUgdG9wXG4gIC8vIG9mIHRoZSBmaWxlLiBEZXRlY3Rpbmcgd2hlcmUgdGhlIHVzZXIncyBjb250ZW50IHN0YXJ0cyBpcyB0cmlja3ksIGJlY2F1c2UgdGhlcmUgYXJlIG1hbnlcbiAgLy8gZGlmZmVyZW50IGtpbmRzIG9mIHN5bnRheCB3ZSdkIGhhdmUgdG8gYWNjb3VudCBmb3IuIE9uZSBhcHByb2FjaCBpcyB0byBmaW5kIHRoZSBmaXJzdCBgQGltcG9ydGBcbiAgLy8gYW5kIGluc2VydCBiZWZvcmUgaXQsIGJ1dCB0aGUgcHJvYmxlbSBpcyB0aGF0IFNhc3MgYWxsb3dzIGBAaW1wb3J0YCB0byBiZSBwbGFjZWQgYW55d2hlcmUuXG4gIGxldCBuZXdJbXBvcnRJbmRleCA9IDA7XG5cbiAgLy8gT25lIHNwZWNpYWwgY2FzZSBpcyBpZiB0aGUgZmlsZSBzdGFydHMgd2l0aCBhIGxpY2Vuc2UgaGVhZGVyIHdoaWNoIHdlIHdhbnQgdG8gcHJlc2VydmUgb24gdG9wLlxuICBpZiAoY29udGVudC50cmltKCkuc3RhcnRzV2l0aChjb21tZW50UGxhY2Vob2xkZXJTdGFydCkpIHtcbiAgICBjb25zdCBjb21tZW50U3RhcnRJbmRleCA9IGNvbnRlbnQuaW5kZXhPZihjb21tZW50UGxhY2Vob2xkZXJTdGFydCk7XG4gICAgbmV3SW1wb3J0SW5kZXggPSBjb250ZW50LmluZGV4T2YoY29tbWVudFBsYWNlaG9sZGVyRW5kLCBjb21tZW50U3RhcnRJbmRleCArIDEpICtcbiAgICAgICAgY29tbWVudFBsYWNlaG9sZGVyRW5kLmxlbmd0aDtcbiAgICAvLyBJZiB0aGUgbGVhZGluZyBjb21tZW50IGRvZXNuJ3QgZW5kIHdpdGggYSBuZXdsaW5lLFxuICAgIC8vIHdlIG5lZWQgdG8gaW5zZXJ0IHRoZSBpbXBvcnQgYXQgdGhlIG5leHQgbGluZS5cbiAgICBpZiAoIWNvbW1lbnRQbGFjZWhvbGRlcnNbY29udGVudC5zbGljZShjb21tZW50U3RhcnRJbmRleCwgbmV3SW1wb3J0SW5kZXgpXS5lbmRzV2l0aCgnXFxuJykpIHtcbiAgICAgIG5ld0ltcG9ydEluZGV4ID0gTWF0aC5tYXgobmV3SW1wb3J0SW5kZXgsIGNvbnRlbnQuaW5kZXhPZignXFxuJywgbmV3SW1wb3J0SW5kZXgpICsgMSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQuc2xpY2UoMCwgbmV3SW1wb3J0SW5kZXgpICsgYEB1c2UgJyR7aW1wb3J0UGF0aH0nIGFzICR7bmFtZXNwYWNlfTtcXG5gICtcbiAgICAgICAgIGNvbnRlbnQuc2xpY2UobmV3SW1wb3J0SW5kZXgpO1xufVxuXG4vKiogRm9ybWF0cyBhIG1pZ3JhdGlvbiBrZXkgYXMgYSBTYXNzIG1peGluIGludm9jYXRpb24uICovXG5mdW5jdGlvbiBtaXhpbktleUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZ3xudWxsLCBuYW1lOiBzdHJpbmcpOiBSZWdFeHAge1xuICAvLyBOb3RlIHRoYXQgYWRkaW5nIGEgYChgIGF0IHRoZSBlbmQgb2YgdGhlIHBhdHRlcm4gd291bGQgYmUgbW9yZSBhY2N1cmF0ZSwgYnV0IG1peGluXG4gIC8vIGludm9jYXRpb25zIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgdG8gaW5jbHVkZSB0aGUgcGFyZW50aGVzZXMuIFdlIGNvdWxkIGFkZCBgWyg7XWAsXG4gIC8vIGJ1dCB0aGVuIHdlIHdvbid0IGtub3cgd2hpY2ggY2hhcmFjdGVyIHRvIGluY2x1ZGUgaW4gdGhlIHJlcGxhY2VtZW50IHN0cmluZy5cbiAgcmV0dXJuIG5ldyBSZWdFeHAoYEBpbmNsdWRlICske2VzY2FwZVJlZ0V4cCgobmFtZXNwYWNlID8gbmFtZXNwYWNlICsgJy4nIDogJycpICsgbmFtZSl9YCwgJ2cnKTtcbn1cblxuLyoqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZvcm1hdCBhIFNhc3MgbWl4aW4gcmVwbGFjZW1lbnQuICovXG5mdW5jdGlvbiBnZXRNaXhpblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nKTogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgLy8gTm90ZSB0aGF0IGFkZGluZyBhIGAoYCBhdCB0aGUgZW5kIG9mIHRoZSBwYXR0ZXJuIHdvdWxkIGJlIG1vcmUgYWNjdXJhdGUsXG4gIC8vIGJ1dCBtaXhpbiBpbnZvY2F0aW9ucyBkb24ndCBuZWNlc3NhcmlseSBoYXZlIHRvIGluY2x1ZGUgdGhlIHBhcmVudGhlc2VzLlxuICByZXR1cm4gbmFtZSA9PiBgQGluY2x1ZGUgJHtuYW1lc3BhY2V9LiR7bmFtZX1gO1xufVxuXG4vKiogRm9ybWF0cyBhIG1pZ3JhdGlvbiBrZXkgYXMgYSBTYXNzIGZ1bmN0aW9uIGludm9jYXRpb24uICovXG5mdW5jdGlvbiBmdW5jdGlvbktleUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZ3xudWxsLCBuYW1lOiBzdHJpbmcpOiBSZWdFeHAge1xuICBjb25zdCBmdW5jdGlvbk5hbWUgPSBlc2NhcGVSZWdFeHAoYCR7bmFtZXNwYWNlID8gbmFtZXNwYWNlICsgJy4nIDogJyd9JHtuYW1lfShgKTtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoYCg/PCFbLV9hLXpBLVowLTldKSR7ZnVuY3Rpb25OYW1lfWAsICdnJyk7XG59XG5cbi8qKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmb3JtYXQgYSBTYXNzIGZ1bmN0aW9uIHJlcGxhY2VtZW50LiAqL1xuZnVuY3Rpb24gZ2V0RnVuY3Rpb25WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZyk6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZyB7XG4gIHJldHVybiBuYW1lID0+IGAke25hbWVzcGFjZX0uJHtuYW1lfShgO1xufVxuXG4vKiogRm9ybWF0cyBhIG1pZ3JhdGlvbiBrZXkgYXMgYSBTYXNzIHZhcmlhYmxlLiAqL1xuZnVuY3Rpb24gdmFyaWFibGVLZXlGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmd8bnVsbCwgbmFtZTogc3RyaW5nKTogUmVnRXhwIHtcbiAgY29uc3QgdmFyaWFibGVOYW1lID0gZXNjYXBlUmVnRXhwKGAke25hbWVzcGFjZSA/IG5hbWVzcGFjZSArICcuJyA6ICcnfSQke25hbWV9YCk7XG4gIHJldHVybiBuZXcgUmVnRXhwKGAke3ZhcmlhYmxlTmFtZX0oPyFbLV9hLXpBLVowLTldKWAsICdnJyk7XG59XG5cbi8qKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmb3JtYXQgYSBTYXNzIHZhcmlhYmxlIHJlcGxhY2VtZW50LiAqL1xuZnVuY3Rpb24gZ2V0VmFyaWFibGVWYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZyk6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZyB7XG4gIHJldHVybiBuYW1lID0+IGAke25hbWVzcGFjZX0uJCR7bmFtZX1gO1xufVxuXG4vKiogRXNjYXBlcyBzcGVjaWFsIHJlZ2V4IGNoYXJhY3RlcnMgaW4gYSBzdHJpbmcuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbLiorP149IToke30oKXxbXFxdXFwvXFxcXF0pL2csICdcXFxcJDEnKTtcbn1cblxuLyoqIFJlbW92ZXMgYWxsIHN0cmluZ3MgZnJvbSBhbm90aGVyIHN0cmluZy4gKi9cbmZ1bmN0aW9uIHJlbW92ZVN0cmluZ3MoY29udGVudDogc3RyaW5nLCB0b1JlbW92ZTogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gdG9SZW1vdmVcbiAgICAucmVkdWNlKChhY2N1bXVsYXRvciwgY3VycmVudCkgPT4gYWNjdW11bGF0b3IucmVwbGFjZShjdXJyZW50LCAnJyksIGNvbnRlbnQpXG4gICAgLnJlcGxhY2UoL15cXHMrLywgJycpO1xufVxuXG4vKiogUGFyc2VzIG91dCB0aGUgbmFtZXNwYWNlIGZyb20gYSBTYXNzIGBAdXNlYCBzdGF0ZW1lbnQuICovXG5mdW5jdGlvbiBleHRyYWN0TmFtZXNwYWNlRnJvbVVzZVN0YXRlbWVudChmdWxsSW1wb3J0OiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBjbG9zZVF1b3RlSW5kZXggPSBNYXRoLm1heChmdWxsSW1wb3J0Lmxhc3RJbmRleE9mKGBcImApLCBmdWxsSW1wb3J0Lmxhc3RJbmRleE9mKGAnYCkpO1xuXG4gIGlmIChjbG9zZVF1b3RlSW5kZXggPiAtMSkge1xuICAgIGNvbnN0IGFzRXhwcmVzc2lvbiA9ICdhcyAnO1xuICAgIGNvbnN0IGFzSW5kZXggPSBmdWxsSW1wb3J0LmluZGV4T2YoYXNFeHByZXNzaW9uLCBjbG9zZVF1b3RlSW5kZXgpO1xuXG4gICAgLy8gSWYgd2UgZm91bmQgYW4gYCBhcyBgIGV4cHJlc3Npb24sIHdlIGNvbnNpZGVyIHRoZSByZXN0IG9mIHRoZSB0ZXh0IGFzIHRoZSBuYW1lc3BhY2UuXG4gICAgaWYgKGFzSW5kZXggPiAtMSkge1xuICAgICAgcmV0dXJuIGZ1bGxJbXBvcnQuc2xpY2UoYXNJbmRleCArIGFzRXhwcmVzc2lvbi5sZW5ndGgpLnNwbGl0KCc7JylbMF0udHJpbSgpO1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSB0aGUgbmFtZXNwYWNlIGlzIHRoZSBuYW1lIG9mIHRoZSBmaWxlIHRoYXQgaXMgYmVpbmcgaW1wb3J0ZWQuXG4gICAgY29uc3QgbGFzdFNsYXNoSW5kZXggPSBmdWxsSW1wb3J0Lmxhc3RJbmRleE9mKCcvJywgY2xvc2VRdW90ZUluZGV4KTtcblxuICAgIGlmIChsYXN0U2xhc2hJbmRleCA+IC0xKSB7XG4gICAgICBjb25zdCBmaWxlTmFtZSA9IGZ1bGxJbXBvcnQuc2xpY2UobGFzdFNsYXNoSW5kZXggKyAxLCBjbG9zZVF1b3RlSW5kZXgpXG4gICAgICAgIC8vIFNhc3MgYWxsb3dzIGZvciBsZWFkaW5nIHVuZGVyc2NvcmVzIHRvIGJlIG9taXR0ZWQgYW5kIGl0IHRlY2huaWNhbGx5IHN1cHBvcnRzIC5zY3NzLlxuICAgICAgICAucmVwbGFjZSgvXl98KFxcLmltcG9ydCk/XFwuc2NzcyR8XFwuaW1wb3J0JC9nLCAnJyk7XG5cbiAgICAgIC8vIFNhc3MgaWdub3JlcyBgL2luZGV4YCBhbmQgaW5mZXJzIHRoZSBuYW1lc3BhY2UgYXMgdGhlIG5leHQgc2VnbWVudCBpbiB0aGUgcGF0aC5cbiAgICAgIGlmIChmaWxlTmFtZSA9PT0gJ2luZGV4Jykge1xuICAgICAgICBjb25zdCBuZXh0U2xhc2hJbmRleCA9IGZ1bGxJbXBvcnQubGFzdEluZGV4T2YoJy8nLCBsYXN0U2xhc2hJbmRleCAtIDEpO1xuXG4gICAgICAgIGlmIChuZXh0U2xhc2hJbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bGxJbXBvcnQuc2xpY2UobmV4dFNsYXNoSW5kZXggKyAxLCBsYXN0U2xhc2hJbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmaWxlTmFtZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGV4dHJhY3QgbmFtZXNwYWNlIGZyb20gaW1wb3J0IFwiJHtmdWxsSW1wb3J0fVwiLmApO1xufVxuXG4vKipcbiAqIFJlcGxhY2VzIHZhcmlhYmxlcyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkIHdpdGggdGhlaXIgdmFsdWVzLlxuICogQHBhcmFtIGNvbnRlbnQgQ29udGVudCBvZiB0aGUgZmlsZSB0byBiZSBtaWdyYXRlZC5cbiAqIEBwYXJhbSB2YXJpYWJsZXMgTWFwcGluZyBiZXR3ZWVuIHZhcmlhYmxlIG5hbWVzIGFuZCB0aGVpciB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHJlcGxhY2VSZW1vdmVkVmFyaWFibGVzKGNvbnRlbnQ6IHN0cmluZywgdmFyaWFibGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogc3RyaW5nIHtcbiAgT2JqZWN0LmtleXModmFyaWFibGVzKS5mb3JFYWNoKHZhcmlhYmxlTmFtZSA9PiB7XG4gICAgLy8gTm90ZSB0aGF0IHRoZSBwYXR0ZXJuIHVzZXMgYSBuZWdhdGl2ZSBsb29rYWhlYWQgdG8gZXhjbHVkZVxuICAgIC8vIHZhcmlhYmxlIGFzc2lnbm1lbnRzLCBiZWNhdXNlIHRoZXkgY2FuJ3QgYmUgbWlncmF0ZWQuXG4gICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBcXFxcJCR7ZXNjYXBlUmVnRXhwKHZhcmlhYmxlTmFtZSl9KD8hXFxcXHMrOnw6KWAsICdnJyk7XG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZShyZWdleCwgdmFyaWFibGVzW3ZhcmlhYmxlTmFtZV0pO1xuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuXG4vKipcbiAqIFJlcGxhY2VzIGFsbCBvZiB0aGUgY29tbWVudHMgaW4gYSBTYXNzIGZpbGUgd2l0aCBwbGFjZWhvbGRlcnMgYW5kXG4gKiByZXR1cm5zIHRoZSBsaXN0IG9mIHBsYWNlaG9sZGVycyBzbyB0aGV5IGNhbiBiZSByZXN0b3JlZCBsYXRlci5cbiAqL1xuZnVuY3Rpb24gZXNjYXBlQ29tbWVudHMoY29udGVudDogc3RyaW5nKToge2NvbnRlbnQ6IHN0cmluZywgcGxhY2Vob2xkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fSB7XG4gIGNvbnN0IHBsYWNlaG9sZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBsZXQgY29tbWVudENvdW50ZXIgPSAwO1xuICBsZXQgW29wZW5JbmRleCwgY2xvc2VJbmRleF0gPSBmaW5kQ29tbWVudChjb250ZW50KTtcblxuICB3aGlsZSAob3BlbkluZGV4ID4gLTEgJiYgY2xvc2VJbmRleCA+IC0xKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSBjb21tZW50UGxhY2Vob2xkZXJTdGFydCArIChjb21tZW50Q291bnRlcisrKSArIGNvbW1lbnRQbGFjZWhvbGRlckVuZDtcbiAgICBwbGFjZWhvbGRlcnNbcGxhY2Vob2xkZXJdID0gY29udGVudC5zbGljZShvcGVuSW5kZXgsIGNsb3NlSW5kZXgpO1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnNsaWNlKDAsIG9wZW5JbmRleCkgKyBwbGFjZWhvbGRlciArIGNvbnRlbnQuc2xpY2UoY2xvc2VJbmRleCk7XG4gICAgW29wZW5JbmRleCwgY2xvc2VJbmRleF0gPSBmaW5kQ29tbWVudChjb250ZW50KTtcbiAgfVxuXG4gIHJldHVybiB7Y29udGVudCwgcGxhY2Vob2xkZXJzfTtcbn1cblxuLyoqIEZpbmRzIHRoZSBzdGFydCBhbmQgZW5kIGluZGV4IG9mIGEgY29tbWVudCBpbiBhIGZpbGUuICovXG5mdW5jdGlvbiBmaW5kQ29tbWVudChjb250ZW50OiBzdHJpbmcpOiBbb3BlbkluZGV4OiBudW1iZXIsIGNsb3NlSW5kZXg6IG51bWJlcl0ge1xuICAvLyBBZGQgYW4gZXh0cmEgbmV3IGxpbmUgYXQgdGhlIGVuZCBzbyB0aGF0IHdlIGNhbiBjb3JyZWN0bHkgY2FwdHVyZSBzaW5nbGUtbGluZSBjb21tZW50c1xuICAvLyBhdCB0aGUgZW5kIG9mIHRoZSBmaWxlLiBJdCBkb2Vzbid0IHJlYWxseSBtYXR0ZXIgdGhhdCB0aGUgZW5kIGluZGV4IHdpbGwgYmUgb3V0IG9mIGJvdW5kcyxcbiAgLy8gYmVjYXVzZSBgU3RyaW5nLnByb3RvdHlwZS5zbGljZWAgd2lsbCBjbGFtcCBpdCB0byB0aGUgc3RyaW5nIGxlbmd0aC5cbiAgY29udGVudCArPSAnXFxuJztcblxuICBmb3IgKGNvbnN0IFtvcGVuLCBjbG9zZV0gb2YgY29tbWVudFBhaXJzLmVudHJpZXMoKSkge1xuICAgIGNvbnN0IG9wZW5JbmRleCA9IGNvbnRlbnQuaW5kZXhPZihvcGVuKTtcblxuICAgIGlmIChvcGVuSW5kZXggPiAtMSkge1xuICAgICAgY29uc3QgY2xvc2VJbmRleCA9IGNvbnRlbnQuaW5kZXhPZihjbG9zZSwgb3BlbkluZGV4ICsgMSk7XG4gICAgICByZXR1cm4gY2xvc2VJbmRleCA+IC0xID8gW29wZW5JbmRleCwgY2xvc2VJbmRleCArIGNsb3NlLmxlbmd0aF0gOiBbLTEsIC0xXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gWy0xLCAtMV07XG59XG5cbi8qKiBSZXN0b3JlcyB0aGUgY29tbWVudHMgdGhhdCBoYXZlIGJlZW4gZXNjYXBlZCBieSBgZXNjYXBlQ29tbWVudHNgLiAqL1xuZnVuY3Rpb24gcmVzdG9yZUNvbW1lbnRzKGNvbnRlbnQ6IHN0cmluZywgcGxhY2Vob2xkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogc3RyaW5nIHtcbiAgT2JqZWN0LmtleXMocGxhY2Vob2xkZXJzKS5mb3JFYWNoKGtleSA9PiBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKGtleSwgcGxhY2Vob2xkZXJzW2tleV0pKTtcbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG4iXX0=