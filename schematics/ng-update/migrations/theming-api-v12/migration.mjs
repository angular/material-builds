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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvdGhlbWluZy1hcGktdjEyL21pZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCxxQ0FRa0I7QUFlbEIsMkRBQTJEO0FBQzNELE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUUzRSx1RUFBdUU7QUFDdkUsTUFBTSx1QkFBdUIsR0FBRyxzQ0FBc0MsQ0FBQztBQUV2RSxpREFBaUQ7QUFDakQsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLENBQUM7QUFFckM7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FBQyxXQUFtQixFQUNuQixpQkFBeUIsRUFDekIsWUFBb0IsRUFDcEIscUJBQTZCLEVBQzdCLGdCQUF3QixFQUN4Qix1QkFBcUMsRUFBRSxFQUN2QyxlQUF3QjtJQUN6RCxJQUFJLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMxRCxNQUFNLGVBQWUsR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ25GLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBRXpFLHdFQUF3RTtJQUN4RSx5RUFBeUU7SUFDekUsT0FBTyxHQUFHLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDakYsT0FBTyxHQUFHLHNCQUFzQixDQUM1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LFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzVFO0tBQ0Y7SUFFRCxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDO0FBRUQsd0VBQXdFO0FBQ3hFLFNBQVMsZUFBZSxDQUFDLE9BQWUsRUFBRSxZQUFvQztJQUM1RSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVGLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgbWF0ZXJpYWxNaXhpbnMsXG4gIG1hdGVyaWFsRnVuY3Rpb25zLFxuICBtYXRlcmlhbFZhcmlhYmxlcyxcbiAgY2RrTWl4aW5zLFxuICBjZGtWYXJpYWJsZXMsXG4gIHJlbW92ZWRNYXRlcmlhbFZhcmlhYmxlcyxcbiAgdW5wcmVmaXhlZFJlbW92ZWRWYXJpYWJsZXNcbn0gZnJvbSAnLi9jb25maWcnO1xuXG4vKiogVGhlIHJlc3VsdCBvZiBhIHNlYXJjaCBmb3IgaW1wb3J0cyBhbmQgbmFtZXNwYWNlcyBpbiBhIGZpbGUuICovXG5pbnRlcmZhY2UgRGV0ZWN0SW1wb3J0UmVzdWx0IHtcbiAgaW1wb3J0czogc3RyaW5nW107XG4gIG5hbWVzcGFjZXM6IHN0cmluZ1tdO1xufVxuXG4vKiogQWRkaXRpb24gbWl4aW4gYW5kIGZ1bmN0aW9uIG5hbWVzIHRoYXQgY2FuIGJlIHVwZGF0ZWQgd2hlbiBpbnZva2luZyBtaWdyYXRpb24gZGlyZWN0bHkuICovXG5pbnRlcmZhY2UgRXh0cmFTeW1ib2xzIHtcbiAgbWl4aW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgZnVuY3Rpb25zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgdmFyaWFibGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn1cblxuLyoqIFBvc3NpYmxlIHBhaXJzIG9mIGNvbW1lbnQgY2hhcmFjdGVycyBpbiBhIFNhc3MgZmlsZS4gKi9cbmNvbnN0IGNvbW1lbnRQYWlycyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KFtbJy8qJywgJyovJ10sIFsnLy8nLCAnXFxuJ11dKTtcblxuLyoqIFByZWZpeCBmb3IgdGhlIHBsYWNlaG9sZGVyIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGVzY2FwZSBjb21tZW50cy4gKi9cbmNvbnN0IGNvbW1lbnRQbGFjZWhvbGRlclN0YXJ0ID0gJ19fPDxuZ1RoZW1pbmdNaWdyYXRpb25Fc2NhcGVkQ29tbWVudCc7XG5cbi8qKiBTdWZmaXggZm9yIHRoZSBjb21tZW50IGVzY2FwZSBwbGFjZWhvbGRlci4gKi9cbmNvbnN0IGNvbW1lbnRQbGFjZWhvbGRlckVuZCA9ICc+Pl9fJztcblxuLyoqXG4gKiBNaWdyYXRlcyB0aGUgY29udGVudCBvZiBhIGZpbGUgdG8gdGhlIG5ldyB0aGVtaW5nIEFQSS4gTm90ZSB0aGF0IHRoaXMgbWlncmF0aW9uIGlzIHVzaW5nIHBsYWluXG4gKiBzdHJpbmcgbWFuaXB1bGF0aW9uLCByYXRoZXIgdGhhbiB0aGUgQVNUIGZyb20gUG9zdENTUyBhbmQgdGhlIHNjaGVtYXRpY3Mgc3RyaW5nIG1hbmlwdWxhdGlvblxuICogQVBJcywgYmVjYXVzZSBpdCBhbGxvd3MgdXMgdG8gcnVuIGl0IGluc2lkZSBnMyBhbmQgdG8gYXZvaWQgaW50cm9kdWNpbmcgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSBmaWxlQ29udGVudCBDb250ZW50IG9mIHRoZSBmaWxlLlxuICogQHBhcmFtIG9sZE1hdGVyaWFsUHJlZml4IFByZWZpeCB3aXRoIHdoaWNoIHRoZSBvbGQgTWF0ZXJpYWwgaW1wb3J0cyBzaG91bGQgc3RhcnQuXG4gKiAgIEhhcyB0byBlbmQgd2l0aCBhIHNsYXNoLiBFLmcuIGlmIGBAaW1wb3J0ICdAYW5ndWxhci9tYXRlcmlhbC90aGVtaW5nJ2Agc2hvdWxkIGJlXG4gKiAgIG1hdGNoZWQsIHRoZSBwcmVmaXggd291bGQgYmUgYEBhbmd1bGFyL21hdGVyaWFsL2AuXG4gKiBAcGFyYW0gb2xkQ2RrUHJlZml4IFByZWZpeCB3aXRoIHdoaWNoIHRoZSBvbGQgQ0RLIGltcG9ydHMgc2hvdWxkIHN0YXJ0LlxuICogICBIYXMgdG8gZW5kIHdpdGggYSBzbGFzaC4gRS5nLiBpZiBgQGltcG9ydCAnQGFuZ3VsYXIvY2RrL292ZXJsYXknYCBzaG91bGQgYmVcbiAqICAgbWF0Y2hlZCwgdGhlIHByZWZpeCB3b3VsZCBiZSBgQGFuZ3VsYXIvY2RrL2AuXG4gKiBAcGFyYW0gbmV3TWF0ZXJpYWxJbXBvcnRQYXRoIE5ldyBpbXBvcnQgdG8gdGhlIE1hdGVyaWFsIHRoZW1pbmcgQVBJIChlLmcuIGBAYW5ndWxhci9tYXRlcmlhbGApLlxuICogQHBhcmFtIG5ld0Nka0ltcG9ydFBhdGggTmV3IGltcG9ydCB0byB0aGUgQ0RLIFNhc3MgQVBJcyAoZS5nLiBgQGFuZ3VsYXIvY2RrYCkuXG4gKiBAcGFyYW0gZXhjbHVkZWRJbXBvcnRzIFBhdHRlcm4gdGhhdCBjYW4gYmUgdXNlZCB0byBleGNsdWRlIGltcG9ydHMgZnJvbSBiZWluZyBwcm9jZXNzZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaWdyYXRlRmlsZUNvbnRlbnQoZmlsZUNvbnRlbnQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkTWF0ZXJpYWxQcmVmaXg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkQ2RrUHJlZml4OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld01hdGVyaWFsSW1wb3J0UGF0aDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDZGtJbXBvcnRQYXRoOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhTWF0ZXJpYWxTeW1ib2xzOiBFeHRyYVN5bWJvbHMgPSB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZWRJbXBvcnRzPzogUmVnRXhwKTogc3RyaW5nIHtcbiAgbGV0IHtjb250ZW50LCBwbGFjZWhvbGRlcnN9ID0gZXNjYXBlQ29tbWVudHMoZmlsZUNvbnRlbnQpO1xuICBjb25zdCBtYXRlcmlhbFJlc3VsdHMgPSBkZXRlY3RJbXBvcnRzKGNvbnRlbnQsIG9sZE1hdGVyaWFsUHJlZml4LCBleGNsdWRlZEltcG9ydHMpO1xuICBjb25zdCBjZGtSZXN1bHRzID0gZGV0ZWN0SW1wb3J0cyhjb250ZW50LCBvbGRDZGtQcmVmaXgsIGV4Y2x1ZGVkSW1wb3J0cyk7XG5cbiAgLy8gVHJ5IHRvIG1pZ3JhdGUgdGhlIHN5bWJvbHMgZXZlbiBpZiB0aGVyZSBhcmUgbm8gaW1wb3J0cy4gVGhpcyBpcyB1c2VkXG4gIC8vIHRvIGNvdmVyIHRoZSBjYXNlIHdoZXJlIHRoZSBDb21wb25lbnRzIHN5bWJvbHMgd2VyZSB1c2VkIHRyYW5zaXRpdmVseS5cbiAgY29udGVudCA9IG1pZ3JhdGVDZGtTeW1ib2xzKGNvbnRlbnQsIG5ld0Nka0ltcG9ydFBhdGgsIHBsYWNlaG9sZGVycywgY2RrUmVzdWx0cyk7XG4gIGNvbnRlbnQgPSBtaWdyYXRlTWF0ZXJpYWxTeW1ib2xzKFxuICAgICAgY29udGVudCwgbmV3TWF0ZXJpYWxJbXBvcnRQYXRoLCBtYXRlcmlhbFJlc3VsdHMsIHBsYWNlaG9sZGVycywgZXh0cmFNYXRlcmlhbFN5bWJvbHMpO1xuICBjb250ZW50ID0gcmVwbGFjZVJlbW92ZWRWYXJpYWJsZXMoY29udGVudCwgcmVtb3ZlZE1hdGVyaWFsVmFyaWFibGVzKTtcblxuICAvLyBXZSBjYW4gYXNzdW1lIHRoYXQgdGhlIG1pZ3JhdGlvbiBoYXMgdGFrZW4gY2FyZSBvZiBhbnkgQ29tcG9uZW50cyBzeW1ib2xzIHRoYXQgd2VyZVxuICAvLyBpbXBvcnRlZCB0cmFuc2l0aXZlbHkgc28gd2UgY2FuIGFsd2F5cyBkcm9wIHRoZSBvbGQgaW1wb3J0cy4gV2UgYWxzbyBhc3N1bWUgdGhhdCBpbXBvcnRzXG4gIC8vIHRvIHRoZSBuZXcgZW50cnkgcG9pbnRzIGhhdmUgYmVlbiBhZGRlZCBhbHJlYWR5LlxuICBpZiAobWF0ZXJpYWxSZXN1bHRzLmltcG9ydHMubGVuZ3RoKSB7XG4gICAgY29udGVudCA9IHJlcGxhY2VSZW1vdmVkVmFyaWFibGVzKGNvbnRlbnQsIHVucHJlZml4ZWRSZW1vdmVkVmFyaWFibGVzKTtcbiAgICBjb250ZW50ID0gcmVtb3ZlU3RyaW5ncyhjb250ZW50LCBtYXRlcmlhbFJlc3VsdHMuaW1wb3J0cyk7XG4gIH1cblxuICBpZiAoY2RrUmVzdWx0cy5pbXBvcnRzLmxlbmd0aCkge1xuICAgIGNvbnRlbnQgPSByZW1vdmVTdHJpbmdzKGNvbnRlbnQsIGNka1Jlc3VsdHMuaW1wb3J0cyk7XG4gIH1cblxuICByZXR1cm4gcmVzdG9yZUNvbW1lbnRzKGNvbnRlbnQsIHBsYWNlaG9sZGVycyk7XG59XG5cbi8qKlxuICogQ291bnRzIHRoZSBudW1iZXIgb2YgaW1wb3J0cyB3aXRoIGEgc3BlY2lmaWMgcHJlZml4IGFuZCBleHRyYWN0cyB0aGVpciBuYW1lc3BhY2VzLlxuICogQHBhcmFtIGNvbnRlbnQgRmlsZSBjb250ZW50IGluIHdoaWNoIHRvIGxvb2sgZm9yIGltcG9ydHMuXG4gKiBAcGFyYW0gcHJlZml4IFByZWZpeCB0aGF0IHRoZSBpbXBvcnRzIHNob3VsZCBzdGFydCB3aXRoLlxuICogQHBhcmFtIGV4Y2x1ZGVkSW1wb3J0cyBQYXR0ZXJuIHRoYXQgY2FuIGJlIHVzZWQgdG8gZXhjbHVkZSBpbXBvcnRzIGZyb20gYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5mdW5jdGlvbiBkZXRlY3RJbXBvcnRzKGNvbnRlbnQ6IHN0cmluZywgcHJlZml4OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVkSW1wb3J0cz86IFJlZ0V4cCk6IERldGVjdEltcG9ydFJlc3VsdCB7XG4gIGlmIChwcmVmaXhbcHJlZml4Lmxlbmd0aCAtIDFdICE9PSAnLycpIHtcbiAgICAvLyBTb21lIG9mIHRoZSBsb2dpYyBmdXJ0aGVyIGRvd24gbWFrZXMgYXNzdW1wdGlvbnMgYWJvdXQgdGhlIGltcG9ydCBkZXB0aC5cbiAgICB0aHJvdyBFcnJvcihgUHJlZml4IFwiJHtwcmVmaXh9XCIgaGFzIHRvIGVuZCBpbiBhIHNsYXNoLmApO1xuICB9XG5cbiAgLy8gTGlzdCBvZiBgQHVzZWAgbmFtZXNwYWNlcyBmcm9tIHdoaWNoIEFuZ3VsYXIgQ0RLL01hdGVyaWFsIEFQSXMgbWF5IGJlIHJlZmVyZW5jZWQuXG4gIC8vIFNpbmNlIHdlIGtub3cgdGhhdCB0aGUgbGlicmFyeSBkb2Vzbid0IGhhdmUgYW55IG5hbWUgY29sbGlzaW9ucywgd2UgY2FuIHRyZWF0IGFsbCBvZiB0aGVzZVxuICAvLyBuYW1lc3BhY2VzIGFzIGVxdWl2YWxlbnQuXG4gIGNvbnN0IG5hbWVzcGFjZXM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGltcG9ydHM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKGBAKGltcG9ydHx1c2UpICtbJ1wiXX4/JHtlc2NhcGVSZWdFeHAocHJlZml4KX0uKlsnXCJdLio7P1xcbmAsICdnJyk7XG4gIGxldCBtYXRjaDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbCA9IG51bGw7XG5cbiAgd2hpbGUgKG1hdGNoID0gcGF0dGVybi5leGVjKGNvbnRlbnQpKSB7XG4gICAgY29uc3QgW2Z1bGxJbXBvcnQsIHR5cGVdID0gbWF0Y2g7XG5cbiAgICBpZiAoZXhjbHVkZWRJbXBvcnRzPy50ZXN0KGZ1bGxJbXBvcnQpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZSA9PT0gJ3VzZScpIHtcbiAgICAgIGNvbnN0IG5hbWVzcGFjZSA9IGV4dHJhY3ROYW1lc3BhY2VGcm9tVXNlU3RhdGVtZW50KGZ1bGxJbXBvcnQpO1xuXG4gICAgICBpZiAobmFtZXNwYWNlcy5pbmRleE9mKG5hbWVzcGFjZSkgPT09IC0xKSB7XG4gICAgICAgIG5hbWVzcGFjZXMucHVzaChuYW1lc3BhY2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGltcG9ydHMucHVzaChmdWxsSW1wb3J0KTtcbiAgfVxuXG4gIHJldHVybiB7aW1wb3J0cywgbmFtZXNwYWNlc307XG59XG5cbi8qKiBNaWdyYXRlcyB0aGUgTWF0ZXJpYWwgc3ltYm9scyBpbiBhIGZpbGUuICovXG5mdW5jdGlvbiBtaWdyYXRlTWF0ZXJpYWxTeW1ib2xzKGNvbnRlbnQ6IHN0cmluZywgaW1wb3J0UGF0aDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRlY3RlZEltcG9ydHM6IERldGVjdEltcG9ydFJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudFBsYWNlaG9sZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFNYXRlcmlhbFN5bWJvbHM6IEV4dHJhU3ltYm9scyA9IHt9KTogc3RyaW5nIHtcbiAgY29uc3QgaW5pdGlhbENvbnRlbnQgPSBjb250ZW50O1xuICBjb25zdCBuYW1lc3BhY2UgPSAnbWF0JztcblxuICAvLyBNaWdyYXRlIHRoZSBtaXhpbnMuXG4gIGNvbnN0IG1peGluc1RvVXBkYXRlID0gey4uLm1hdGVyaWFsTWl4aW5zLCAuLi5leHRyYU1hdGVyaWFsU3ltYm9scy5taXhpbnN9O1xuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhjb250ZW50LCBtaXhpbnNUb1VwZGF0ZSwgZGV0ZWN0ZWRJbXBvcnRzLm5hbWVzcGFjZXMsIG1peGluS2V5Rm9ybWF0dGVyLFxuICAgIGdldE1peGluVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlKSk7XG5cbiAgLy8gTWlncmF0ZSB0aGUgZnVuY3Rpb25zLlxuICBjb25zdCBmdW5jdGlvbnNUb1VwZGF0ZSA9IHsuLi5tYXRlcmlhbEZ1bmN0aW9ucywgLi4uZXh0cmFNYXRlcmlhbFN5bWJvbHMuZnVuY3Rpb25zfTtcbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgZnVuY3Rpb25zVG9VcGRhdGUsIGRldGVjdGVkSW1wb3J0cy5uYW1lc3BhY2VzLFxuICAgIGZ1bmN0aW9uS2V5Rm9ybWF0dGVyLCBnZXRGdW5jdGlvblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSkpO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIHZhcmlhYmxlcy5cbiAgY29uc3QgdmFyaWFibGVzVG9VcGRhdGUgPSB7Li4ubWF0ZXJpYWxWYXJpYWJsZXMsIC4uLmV4dHJhTWF0ZXJpYWxTeW1ib2xzLnZhcmlhYmxlc307XG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIHZhcmlhYmxlc1RvVXBkYXRlLCBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcyxcbiAgICB2YXJpYWJsZUtleUZvcm1hdHRlciwgZ2V0VmFyaWFibGVWYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICBpZiAoY29udGVudCAhPT0gaW5pdGlhbENvbnRlbnQpIHtcbiAgICAvLyBBZGQgYW4gaW1wb3J0IHRvIHRoZSBuZXcgQVBJIG9ubHkgaWYgYW55IG9mIHRoZSBBUElzIHdlcmUgYmVpbmcgdXNlZC5cbiAgICBjb250ZW50ID0gaW5zZXJ0VXNlU3RhdGVtZW50KGNvbnRlbnQsIGltcG9ydFBhdGgsIG5hbWVzcGFjZSwgY29tbWVudFBsYWNlaG9sZGVycyk7XG4gIH1cblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqIE1pZ3JhdGVzIHRoZSBDREsgc3ltYm9scyBpbiBhIGZpbGUuICovXG5mdW5jdGlvbiBtaWdyYXRlQ2RrU3ltYm9scyhjb250ZW50OiBzdHJpbmcsIGltcG9ydFBhdGg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRQbGFjZWhvbGRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRlY3RlZEltcG9ydHM6IERldGVjdEltcG9ydFJlc3VsdCk6IHN0cmluZyB7XG4gIGNvbnN0IGluaXRpYWxDb250ZW50ID0gY29udGVudDtcbiAgY29uc3QgbmFtZXNwYWNlID0gJ2Nkayc7XG5cbiAgLy8gTWlncmF0ZSB0aGUgbWl4aW5zLlxuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhjb250ZW50LCBjZGtNaXhpbnMsIGRldGVjdGVkSW1wb3J0cy5uYW1lc3BhY2VzLCBtaXhpbktleUZvcm1hdHRlcixcbiAgICBnZXRNaXhpblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSkpO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIHZhcmlhYmxlcy5cbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgY2RrVmFyaWFibGVzLCBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcywgdmFyaWFibGVLZXlGb3JtYXR0ZXIsXG4gICAgZ2V0VmFyaWFibGVWYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBQcmV2aW91c2x5IHRoZSBDREsgc3ltYm9scyB3ZXJlIGV4cG9zZWQgdGhyb3VnaCBgbWF0ZXJpYWwvdGhlbWluZ2AsIGJ1dCBub3cgd2UgaGF2ZSBhXG4gIC8vIGRlZGljYXRlZCBlbnRyeXBvaW50IGZvciB0aGUgQ0RLLiBPbmx5IGFkZCBhbiBpbXBvcnQgZm9yIGl0IGlmIGFueSBvZiB0aGUgc3ltYm9scyBhcmUgdXNlZC5cbiAgaWYgKGNvbnRlbnQgIT09IGluaXRpYWxDb250ZW50KSB7XG4gICAgY29udGVudCA9IGluc2VydFVzZVN0YXRlbWVudChjb250ZW50LCBpbXBvcnRQYXRoLCBuYW1lc3BhY2UsIGNvbW1lbnRQbGFjZWhvbGRlcnMpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogUmVuYW1lcyBhbGwgU2FzcyBzeW1ib2xzIGluIGEgZmlsZSBiYXNlZCBvbiBhIHByZS1kZWZpbmVkIG1hcHBpbmcuXG4gKiBAcGFyYW0gY29udGVudCBDb250ZW50IG9mIGEgZmlsZSB0byBiZSBtaWdyYXRlZC5cbiAqIEBwYXJhbSBtYXBwaW5nIE1hcHBpbmcgYmV0d2VlbiBzeW1ib2wgbmFtZXMgYW5kIHRoZWlyIHJlcGxhY2VtZW50cy5cbiAqIEBwYXJhbSBuYW1lc3BhY2VzIE5hbWVzIHRvIGl0ZXJhdGUgb3ZlciBhbmQgcGFzcyB0byBnZXRLZXlQYXR0ZXJuLlxuICogQHBhcmFtIGdldEtleVBhdHRlcm4gRnVuY3Rpb24gdXNlZCB0byB0dXJuIGVhY2ggb2YgdGhlIGtleXMgaW50byBhIHJlZ2V4LlxuICogQHBhcmFtIGZvcm1hdFZhbHVlIEZvcm1hdHMgdGhlIHZhbHVlIHRoYXQgd2lsbCByZXBsYWNlIGFueSBtYXRjaGVzIG9mIHRoZSBwYXR0ZXJuIHJldHVybmVkIGJ5XG4gKiAgYGdldEtleVBhdHRlcm5gLlxuICovXG5mdW5jdGlvbiByZW5hbWVTeW1ib2xzKGNvbnRlbnQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgbWFwcGluZzogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlczogc3RyaW5nW10sXG4gICAgICAgICAgICAgICAgICAgICAgIGdldEtleVBhdHRlcm46IChuYW1lc3BhY2U6IHN0cmluZ3xudWxsLCBrZXk6IHN0cmluZykgPT4gUmVnRXhwLFxuICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXRWYWx1ZTogKGtleTogc3RyaW5nKSA9PiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBUaGUgbnVsbCBhdCB0aGUgZW5kIGlzIHNvIHRoYXQgd2UgbWFrZSBvbmUgbGFzdCBwYXNzIHRvIGNvdmVyIG5vbi1uYW1lc3BhY2VkIHN5bWJvbHMuXG4gIFsuLi5uYW1lc3BhY2VzLnNsaWNlKCksIG51bGxdLmZvckVhY2gobmFtZXNwYWNlID0+IHtcbiAgICBPYmplY3Qua2V5cyhtYXBwaW5nKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCBwYXR0ZXJuID0gZ2V0S2V5UGF0dGVybihuYW1lc3BhY2UsIGtleSk7XG5cbiAgICAgIC8vIFNhbml0eSBjaGVjayBzaW5jZSBub24tZ2xvYmFsIHJlZ2V4ZXMgd2lsbCBvbmx5IHJlcGxhY2UgdGhlIGZpcnN0IG1hdGNoLlxuICAgICAgaWYgKHBhdHRlcm4uZmxhZ3MuaW5kZXhPZignZycpID09PSAtMSkge1xuICAgICAgICB0aHJvdyBFcnJvcignUmVwbGFjZW1lbnQgcGF0dGVybiBtdXN0IGJlIGdsb2JhbC4nKTtcbiAgICAgIH1cblxuICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZShwYXR0ZXJuLCBmb3JtYXRWYWx1ZShtYXBwaW5nW2tleV0pKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKiBJbnNlcnRzIGFuIGBAdXNlYCBzdGF0ZW1lbnQgaW4gYSBzdHJpbmcuICovXG5mdW5jdGlvbiBpbnNlcnRVc2VTdGF0ZW1lbnQoY29udGVudDogc3RyaW5nLCBpbXBvcnRQYXRoOiBzdHJpbmcsIG5hbWVzcGFjZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRQbGFjZWhvbGRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBzdHJpbmcge1xuICAvLyBJZiB0aGUgY29udGVudCBhbHJlYWR5IGhhcyB0aGUgYEB1c2VgIGltcG9ydCwgd2UgZG9uJ3QgbmVlZCB0byBhZGQgYW55dGhpbmcuXG4gIGlmIChuZXcgUmVnRXhwKGBAdXNlICtbJ1wiXSR7aW1wb3J0UGF0aH1bJ1wiXWAsICdnJykudGVzdChjb250ZW50KSkge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgLy8gU2FzcyB3aWxsIHRocm93IGFuIGVycm9yIGlmIGFuIGBAdXNlYCBzdGF0ZW1lbnQgY29tZXMgYWZ0ZXIgYW5vdGhlciBzdGF0ZW1lbnQuIFRoZSBzYWZlc3Qgd2F5XG4gIC8vIHRvIGVuc3VyZSB0aGF0IHdlIGNvbmZvcm0gdG8gdGhhdCByZXF1aXJlbWVudCBpcyBieSBhbHdheXMgaW5zZXJ0aW5nIG91ciBpbXBvcnRzIGF0IHRoZSB0b3BcbiAgLy8gb2YgdGhlIGZpbGUuIERldGVjdGluZyB3aGVyZSB0aGUgdXNlcidzIGNvbnRlbnQgc3RhcnRzIGlzIHRyaWNreSwgYmVjYXVzZSB0aGVyZSBhcmUgbWFueVxuICAvLyBkaWZmZXJlbnQga2luZHMgb2Ygc3ludGF4IHdlJ2QgaGF2ZSB0byBhY2NvdW50IGZvci4gT25lIGFwcHJvYWNoIGlzIHRvIGZpbmQgdGhlIGZpcnN0IGBAaW1wb3J0YFxuICAvLyBhbmQgaW5zZXJ0IGJlZm9yZSBpdCwgYnV0IHRoZSBwcm9ibGVtIGlzIHRoYXQgU2FzcyBhbGxvd3MgYEBpbXBvcnRgIHRvIGJlIHBsYWNlZCBhbnl3aGVyZS5cbiAgbGV0IG5ld0ltcG9ydEluZGV4ID0gMDtcblxuICAvLyBPbmUgc3BlY2lhbCBjYXNlIGlzIGlmIHRoZSBmaWxlIHN0YXJ0cyB3aXRoIGEgbGljZW5zZSBoZWFkZXIgd2hpY2ggd2Ugd2FudCB0byBwcmVzZXJ2ZSBvbiB0b3AuXG4gIGlmIChjb250ZW50LnRyaW0oKS5zdGFydHNXaXRoKGNvbW1lbnRQbGFjZWhvbGRlclN0YXJ0KSkge1xuICAgIGNvbnN0IGNvbW1lbnRTdGFydEluZGV4ID0gY29udGVudC5pbmRleE9mKGNvbW1lbnRQbGFjZWhvbGRlclN0YXJ0KTtcbiAgICBuZXdJbXBvcnRJbmRleCA9IGNvbnRlbnQuaW5kZXhPZihjb21tZW50UGxhY2Vob2xkZXJFbmQsIGNvbW1lbnRTdGFydEluZGV4ICsgMSkgK1xuICAgICAgICBjb21tZW50UGxhY2Vob2xkZXJFbmQubGVuZ3RoO1xuICAgIC8vIElmIHRoZSBsZWFkaW5nIGNvbW1lbnQgZG9lc24ndCBlbmQgd2l0aCBhIG5ld2xpbmUsXG4gICAgLy8gd2UgbmVlZCB0byBpbnNlcnQgdGhlIGltcG9ydCBhdCB0aGUgbmV4dCBsaW5lLlxuICAgIGlmICghY29tbWVudFBsYWNlaG9sZGVyc1tjb250ZW50LnNsaWNlKGNvbW1lbnRTdGFydEluZGV4LCBuZXdJbXBvcnRJbmRleCldLmVuZHNXaXRoKCdcXG4nKSkge1xuICAgICAgbmV3SW1wb3J0SW5kZXggPSBNYXRoLm1heChuZXdJbXBvcnRJbmRleCwgY29udGVudC5pbmRleE9mKCdcXG4nLCBuZXdJbXBvcnRJbmRleCkgKyAxKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29udGVudC5zbGljZSgwLCBuZXdJbXBvcnRJbmRleCkgKyBgQHVzZSAnJHtpbXBvcnRQYXRofScgYXMgJHtuYW1lc3BhY2V9O1xcbmAgK1xuICAgICAgICAgY29udGVudC5zbGljZShuZXdJbXBvcnRJbmRleCk7XG59XG5cbi8qKiBGb3JtYXRzIGEgbWlncmF0aW9uIGtleSBhcyBhIFNhc3MgbWl4aW4gaW52b2NhdGlvbi4gKi9cbmZ1bmN0aW9uIG1peGluS2V5Rm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nfG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIC8vIE5vdGUgdGhhdCBhZGRpbmcgYSBgKGAgYXQgdGhlIGVuZCBvZiB0aGUgcGF0dGVybiB3b3VsZCBiZSBtb3JlIGFjY3VyYXRlLCBidXQgbWl4aW5cbiAgLy8gaW52b2NhdGlvbnMgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSB0byBpbmNsdWRlIHRoZSBwYXJlbnRoZXNlcy4gV2UgY291bGQgYWRkIGBbKDtdYCxcbiAgLy8gYnV0IHRoZW4gd2Ugd29uJ3Qga25vdyB3aGljaCBjaGFyYWN0ZXIgdG8gaW5jbHVkZSBpbiB0aGUgcmVwbGFjZW1lbnQgc3RyaW5nLlxuICByZXR1cm4gbmV3IFJlZ0V4cChgQGluY2x1ZGUgKyR7ZXNjYXBlUmVnRXhwKChuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJykgKyBuYW1lKX1gLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyBtaXhpbiByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldE1peGluVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICAvLyBOb3RlIHRoYXQgYWRkaW5nIGEgYChgIGF0IHRoZSBlbmQgb2YgdGhlIHBhdHRlcm4gd291bGQgYmUgbW9yZSBhY2N1cmF0ZSxcbiAgLy8gYnV0IG1peGluIGludm9jYXRpb25zIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgdG8gaW5jbHVkZSB0aGUgcGFyZW50aGVzZXMuXG4gIHJldHVybiBuYW1lID0+IGBAaW5jbHVkZSAke25hbWVzcGFjZX0uJHtuYW1lfWA7XG59XG5cbi8qKiBGb3JtYXRzIGEgbWlncmF0aW9uIGtleSBhcyBhIFNhc3MgZnVuY3Rpb24gaW52b2NhdGlvbi4gKi9cbmZ1bmN0aW9uIGZ1bmN0aW9uS2V5Rm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nfG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGVzY2FwZVJlZ0V4cChgJHtuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJ30ke25hbWV9KGApO1xuICByZXR1cm4gbmV3IFJlZ0V4cChgKD88IVstX2EtekEtWjAtOV0pJHtmdW5jdGlvbk5hbWV9YCwgJ2cnKTtcbn1cblxuLyoqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZvcm1hdCBhIFNhc3MgZnVuY3Rpb24gcmVwbGFjZW1lbnQuICovXG5mdW5jdGlvbiBnZXRGdW5jdGlvblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nKTogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUgPT4gYCR7bmFtZXNwYWNlfS4ke25hbWV9KGA7XG59XG5cbi8qKiBGb3JtYXRzIGEgbWlncmF0aW9uIGtleSBhcyBhIFNhc3MgdmFyaWFibGUuICovXG5mdW5jdGlvbiB2YXJpYWJsZUtleUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZ3xudWxsLCBuYW1lOiBzdHJpbmcpOiBSZWdFeHAge1xuICBjb25zdCB2YXJpYWJsZU5hbWUgPSBlc2NhcGVSZWdFeHAoYCR7bmFtZXNwYWNlID8gbmFtZXNwYWNlICsgJy4nIDogJyd9JCR7bmFtZX1gKTtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoYCR7dmFyaWFibGVOYW1lfSg/IVstX2EtekEtWjAtOV0pYCwgJ2cnKTtcbn1cblxuLyoqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZvcm1hdCBhIFNhc3MgdmFyaWFibGUgcmVwbGFjZW1lbnQuICovXG5mdW5jdGlvbiBnZXRWYXJpYWJsZVZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nKTogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUgPT4gYCR7bmFtZXNwYWNlfS4kJHtuYW1lfWA7XG59XG5cbi8qKiBFc2NhcGVzIHNwZWNpYWwgcmVnZXggY2hhcmFjdGVycyBpbiBhIHN0cmluZy4gKi9cbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFsuKis/Xj0hOiR7fSgpfFtcXF1cXC9cXFxcXSkvZywgJ1xcXFwkMScpO1xufVxuXG4vKiogUmVtb3ZlcyBhbGwgc3RyaW5ncyBmcm9tIGFub3RoZXIgc3RyaW5nLiAqL1xuZnVuY3Rpb24gcmVtb3ZlU3RyaW5ncyhjb250ZW50OiBzdHJpbmcsIHRvUmVtb3ZlOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIHJldHVybiB0b1JlbW92ZVxuICAgIC5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBjdXJyZW50KSA9PiBhY2N1bXVsYXRvci5yZXBsYWNlKGN1cnJlbnQsICcnKSwgY29udGVudClcbiAgICAucmVwbGFjZSgvXlxccysvLCAnJyk7XG59XG5cbi8qKiBQYXJzZXMgb3V0IHRoZSBuYW1lc3BhY2UgZnJvbSBhIFNhc3MgYEB1c2VgIHN0YXRlbWVudC4gKi9cbmZ1bmN0aW9uIGV4dHJhY3ROYW1lc3BhY2VGcm9tVXNlU3RhdGVtZW50KGZ1bGxJbXBvcnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGNsb3NlUXVvdGVJbmRleCA9IE1hdGgubWF4KGZ1bGxJbXBvcnQubGFzdEluZGV4T2YoYFwiYCksIGZ1bGxJbXBvcnQubGFzdEluZGV4T2YoYCdgKSk7XG5cbiAgaWYgKGNsb3NlUXVvdGVJbmRleCA+IC0xKSB7XG4gICAgY29uc3QgYXNFeHByZXNzaW9uID0gJ2FzICc7XG4gICAgY29uc3QgYXNJbmRleCA9IGZ1bGxJbXBvcnQuaW5kZXhPZihhc0V4cHJlc3Npb24sIGNsb3NlUXVvdGVJbmRleCk7XG5cbiAgICAvLyBJZiB3ZSBmb3VuZCBhbiBgIGFzIGAgZXhwcmVzc2lvbiwgd2UgY29uc2lkZXIgdGhlIHJlc3Qgb2YgdGhlIHRleHQgYXMgdGhlIG5hbWVzcGFjZS5cbiAgICBpZiAoYXNJbmRleCA+IC0xKSB7XG4gICAgICByZXR1cm4gZnVsbEltcG9ydC5zbGljZShhc0luZGV4ICsgYXNFeHByZXNzaW9uLmxlbmd0aCkuc3BsaXQoJzsnKVswXS50cmltKCk7XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlIHRoZSBuYW1lc3BhY2UgaXMgdGhlIG5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBiZWluZyBpbXBvcnRlZC5cbiAgICBjb25zdCBsYXN0U2xhc2hJbmRleCA9IGZ1bGxJbXBvcnQubGFzdEluZGV4T2YoJy8nLCBjbG9zZVF1b3RlSW5kZXgpO1xuXG4gICAgaWYgKGxhc3RTbGFzaEluZGV4ID4gLTEpIHtcbiAgICAgIGNvbnN0IGZpbGVOYW1lID0gZnVsbEltcG9ydC5zbGljZShsYXN0U2xhc2hJbmRleCArIDEsIGNsb3NlUXVvdGVJbmRleClcbiAgICAgICAgLy8gU2FzcyBhbGxvd3MgZm9yIGxlYWRpbmcgdW5kZXJzY29yZXMgdG8gYmUgb21pdHRlZCBhbmQgaXQgdGVjaG5pY2FsbHkgc3VwcG9ydHMgLnNjc3MuXG4gICAgICAgIC5yZXBsYWNlKC9eX3woXFwuaW1wb3J0KT9cXC5zY3NzJHxcXC5pbXBvcnQkL2csICcnKTtcblxuICAgICAgLy8gU2FzcyBpZ25vcmVzIGAvaW5kZXhgIGFuZCBpbmZlcnMgdGhlIG5hbWVzcGFjZSBhcyB0aGUgbmV4dCBzZWdtZW50IGluIHRoZSBwYXRoLlxuICAgICAgaWYgKGZpbGVOYW1lID09PSAnaW5kZXgnKSB7XG4gICAgICAgIGNvbnN0IG5leHRTbGFzaEluZGV4ID0gZnVsbEltcG9ydC5sYXN0SW5kZXhPZignLycsIGxhc3RTbGFzaEluZGV4IC0gMSk7XG5cbiAgICAgICAgaWYgKG5leHRTbGFzaEluZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gZnVsbEltcG9ydC5zbGljZShuZXh0U2xhc2hJbmRleCArIDEsIGxhc3RTbGFzaEluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZpbGVOYW1lO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRocm93IEVycm9yKGBDb3VsZCBub3QgZXh0cmFjdCBuYW1lc3BhY2UgZnJvbSBpbXBvcnQgXCIke2Z1bGxJbXBvcnR9XCIuYCk7XG59XG5cbi8qKlxuICogUmVwbGFjZXMgdmFyaWFibGVzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQgd2l0aCB0aGVpciB2YWx1ZXMuXG4gKiBAcGFyYW0gY29udGVudCBDb250ZW50IG9mIHRoZSBmaWxlIHRvIGJlIG1pZ3JhdGVkLlxuICogQHBhcmFtIHZhcmlhYmxlcyBNYXBwaW5nIGJldHdlZW4gdmFyaWFibGUgbmFtZXMgYW5kIHRoZWlyIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gcmVwbGFjZVJlbW92ZWRWYXJpYWJsZXMoY29udGVudDogc3RyaW5nLCB2YXJpYWJsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBzdHJpbmcge1xuICBPYmplY3Qua2V5cyh2YXJpYWJsZXMpLmZvckVhY2godmFyaWFibGVOYW1lID0+IHtcbiAgICAvLyBOb3RlIHRoYXQgdGhlIHBhdHRlcm4gdXNlcyBhIG5lZ2F0aXZlIGxvb2thaGVhZCB0byBleGNsdWRlXG4gICAgLy8gdmFyaWFibGUgYXNzaWdubWVudHMsIGJlY2F1c2UgdGhleSBjYW4ndCBiZSBtaWdyYXRlZC5cbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFxcXFwkJHtlc2NhcGVSZWdFeHAodmFyaWFibGVOYW1lKX0oPyFcXFxccys6fDopYCwgJ2cnKTtcbiAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKHJlZ2V4LCB2YXJpYWJsZXNbdmFyaWFibGVOYW1lXSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG5cbi8qKlxuICogUmVwbGFjZXMgYWxsIG9mIHRoZSBjb21tZW50cyBpbiBhIFNhc3MgZmlsZSB3aXRoIHBsYWNlaG9sZGVycyBhbmRcbiAqIHJldHVybnMgdGhlIGxpc3Qgb2YgcGxhY2Vob2xkZXJzIHNvIHRoZXkgY2FuIGJlIHJlc3RvcmVkIGxhdGVyLlxuICovXG5mdW5jdGlvbiBlc2NhcGVDb21tZW50cyhjb250ZW50OiBzdHJpbmcpOiB7Y29udGVudDogc3RyaW5nLCBwbGFjZWhvbGRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz59IHtcbiAgY29uc3QgcGxhY2Vob2xkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGxldCBjb21tZW50Q291bnRlciA9IDA7XG4gIGxldCBbb3BlbkluZGV4LCBjbG9zZUluZGV4XSA9IGZpbmRDb21tZW50KGNvbnRlbnQpO1xuXG4gIHdoaWxlIChvcGVuSW5kZXggPiAtMSAmJiBjbG9zZUluZGV4ID4gLTEpIHtcbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IGNvbW1lbnRQbGFjZWhvbGRlclN0YXJ0ICsgKGNvbW1lbnRDb3VudGVyKyspICsgY29tbWVudFBsYWNlaG9sZGVyRW5kO1xuICAgIHBsYWNlaG9sZGVyc1twbGFjZWhvbGRlcl0gPSBjb250ZW50LnNsaWNlKG9wZW5JbmRleCwgY2xvc2VJbmRleCk7XG4gICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMCwgb3BlbkluZGV4KSArIHBsYWNlaG9sZGVyICsgY29udGVudC5zbGljZShjbG9zZUluZGV4KTtcbiAgICBbb3BlbkluZGV4LCBjbG9zZUluZGV4XSA9IGZpbmRDb21tZW50KGNvbnRlbnQpO1xuICB9XG5cbiAgcmV0dXJuIHtjb250ZW50LCBwbGFjZWhvbGRlcnN9O1xufVxuXG4vKiogRmluZHMgdGhlIHN0YXJ0IGFuZCBlbmQgaW5kZXggb2YgYSBjb21tZW50IGluIGEgZmlsZS4gKi9cbmZ1bmN0aW9uIGZpbmRDb21tZW50KGNvbnRlbnQ6IHN0cmluZyk6IFtvcGVuSW5kZXg6IG51bWJlciwgY2xvc2VJbmRleDogbnVtYmVyXSB7XG4gIC8vIEFkZCBhbiBleHRyYSBuZXcgbGluZSBhdCB0aGUgZW5kIHNvIHRoYXQgd2UgY2FuIGNvcnJlY3RseSBjYXB0dXJlIHNpbmdsZS1saW5lIGNvbW1lbnRzXG4gIC8vIGF0IHRoZSBlbmQgb2YgdGhlIGZpbGUuIEl0IGRvZXNuJ3QgcmVhbGx5IG1hdHRlciB0aGF0IHRoZSBlbmQgaW5kZXggd2lsbCBiZSBvdXQgb2YgYm91bmRzLFxuICAvLyBiZWNhdXNlIGBTdHJpbmcucHJvdG90eXBlLnNsaWNlYCB3aWxsIGNsYW1wIGl0IHRvIHRoZSBzdHJpbmcgbGVuZ3RoLlxuICBjb250ZW50ICs9ICdcXG4nO1xuXG4gIGZvciAoY29uc3QgW29wZW4sIGNsb3NlXSBvZiBjb21tZW50UGFpcnMuZW50cmllcygpKSB7XG4gICAgY29uc3Qgb3BlbkluZGV4ID0gY29udGVudC5pbmRleE9mKG9wZW4pO1xuXG4gICAgaWYgKG9wZW5JbmRleCA+IC0xKSB7XG4gICAgICBjb25zdCBjbG9zZUluZGV4ID0gY29udGVudC5pbmRleE9mKGNsb3NlLCBvcGVuSW5kZXggKyAxKTtcbiAgICAgIHJldHVybiBjbG9zZUluZGV4ID4gLTEgPyBbb3BlbkluZGV4LCBjbG9zZUluZGV4ICsgY2xvc2UubGVuZ3RoXSA6IFstMSwgLTFdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBbLTEsIC0xXTtcbn1cblxuLyoqIFJlc3RvcmVzIHRoZSBjb21tZW50cyB0aGF0IGhhdmUgYmVlbiBlc2NhcGVkIGJ5IGBlc2NhcGVDb21tZW50c2AuICovXG5mdW5jdGlvbiByZXN0b3JlQ29tbWVudHMoY29udGVudDogc3RyaW5nLCBwbGFjZWhvbGRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBzdHJpbmcge1xuICBPYmplY3Qua2V5cyhwbGFjZWhvbGRlcnMpLmZvckVhY2goa2V5ID0+IGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2Uoa2V5LCBwbGFjZWhvbGRlcnNba2V5XSkpO1xuICByZXR1cm4gY29udGVudDtcbn1cbiJdfQ==