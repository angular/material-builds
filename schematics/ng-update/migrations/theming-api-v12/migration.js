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
/**
 * Migrates the content of a file to the new theming API. Note that this migration is using plain
 * string manipulation, rather than the AST from PostCSS and the schematics string manipulation
 * APIs, because it allows us to run it inside g3 and to avoid introducing new dependencies.
 * @param content Content of the file.
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
function migrateFileContent(content, oldMaterialPrefix, oldCdkPrefix, newMaterialImportPath, newCdkImportPath, extraMaterialSymbols = {}, excludedImports) {
    const materialResults = detectImports(content, oldMaterialPrefix, excludedImports);
    const cdkResults = detectImports(content, oldCdkPrefix, excludedImports);
    // Try to migrate the symbols even if there are no imports. This is used
    // to cover the case where the Components symbols were used transitively.
    content = migrateCdkSymbols(content, newCdkImportPath, cdkResults);
    content = migrateMaterialSymbols(content, newMaterialImportPath, materialResults, extraMaterialSymbols);
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
    return content;
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
function migrateMaterialSymbols(content, importPath, detectedImports, extraMaterialSymbols = {}) {
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
        content = insertUseStatement(content, importPath, namespace);
    }
    return content;
}
/** Migrates the CDK symbols in a file. */
function migrateCdkSymbols(content, importPath, detectedImports) {
    const initialContent = content;
    const namespace = 'cdk';
    // Migrate the mixins.
    content = renameSymbols(content, config_1.cdkMixins, detectedImports.namespaces, mixinKeyFormatter, getMixinValueFormatter(namespace));
    // Migrate the variables.
    content = renameSymbols(content, config_1.cdkVariables, detectedImports.namespaces, variableKeyFormatter, getVariableValueFormatter(namespace));
    // Previously the CDK symbols were exposed through `material/theming`, but now we have a
    // dedicated entrypoint for the CDK. Only add an import for it if any of the symbols are used.
    if (content !== initialContent) {
        content = insertUseStatement(content, importPath, namespace);
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
function insertUseStatement(content, importPath, namespace) {
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
    if (content.trim().startsWith('/*')) {
        const commentEndIndex = content.indexOf('*/', content.indexOf('/*'));
        newImportIndex = content.indexOf('\n', commentEndIndex) + 1;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvdGhlbWluZy1hcGktdjEyL21pZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCxxQ0FRa0I7QUFlbEI7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FBQyxPQUFlLEVBQ2YsaUJBQXlCLEVBQ3pCLFlBQW9CLEVBQ3BCLHFCQUE2QixFQUM3QixnQkFBd0IsRUFDeEIsdUJBQXFDLEVBQUUsRUFDdkMsZUFBd0I7SUFDekQsTUFBTSxlQUFlLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNuRixNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsQ0FBQztJQUV6RSx3RUFBd0U7SUFDeEUseUVBQXlFO0lBQ3pFLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDbkUsT0FBTyxHQUFHLHNCQUFzQixDQUM1QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsZUFBZSxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDM0UsT0FBTyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxpQ0FBd0IsQ0FBQyxDQUFDO0lBRXJFLHNGQUFzRjtJQUN0RiwyRkFBMkY7SUFDM0YsbURBQW1EO0lBQ25ELElBQUksZUFBZSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDbEMsT0FBTyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxtQ0FBMEIsQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxPQUFPLENBQUMs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RDtRQUN4RCxNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLFlBQVksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdFLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgbWF0ZXJpYWxNaXhpbnMsXG4gIG1hdGVyaWFsRnVuY3Rpb25zLFxuICBtYXRlcmlhbFZhcmlhYmxlcyxcbiAgY2RrTWl4aW5zLFxuICBjZGtWYXJpYWJsZXMsXG4gIHJlbW92ZWRNYXRlcmlhbFZhcmlhYmxlcyxcbiAgdW5wcmVmaXhlZFJlbW92ZWRWYXJpYWJsZXNcbn0gZnJvbSAnLi9jb25maWcnO1xuXG4vKiogVGhlIHJlc3VsdCBvZiBhIHNlYXJjaCBmb3IgaW1wb3J0cyBhbmQgbmFtZXNwYWNlcyBpbiBhIGZpbGUuICovXG5pbnRlcmZhY2UgRGV0ZWN0SW1wb3J0UmVzdWx0IHtcbiAgaW1wb3J0czogc3RyaW5nW107XG4gIG5hbWVzcGFjZXM6IHN0cmluZ1tdO1xufVxuXG4vKiogQWRkaXRpb24gbWl4aW4gYW5kIGZ1bmN0aW9uIG5hbWVzIHRoYXQgY2FuIGJlIHVwZGF0ZWQgd2hlbiBpbnZva2luZyBtaWdyYXRpb24gZGlyZWN0bHkuICovXG5pbnRlcmZhY2UgRXh0cmFTeW1ib2xzIHtcbiAgbWl4aW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgZnVuY3Rpb25zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgdmFyaWFibGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn1cblxuLyoqXG4gKiBNaWdyYXRlcyB0aGUgY29udGVudCBvZiBhIGZpbGUgdG8gdGhlIG5ldyB0aGVtaW5nIEFQSS4gTm90ZSB0aGF0IHRoaXMgbWlncmF0aW9uIGlzIHVzaW5nIHBsYWluXG4gKiBzdHJpbmcgbWFuaXB1bGF0aW9uLCByYXRoZXIgdGhhbiB0aGUgQVNUIGZyb20gUG9zdENTUyBhbmQgdGhlIHNjaGVtYXRpY3Mgc3RyaW5nIG1hbmlwdWxhdGlvblxuICogQVBJcywgYmVjYXVzZSBpdCBhbGxvd3MgdXMgdG8gcnVuIGl0IGluc2lkZSBnMyBhbmQgdG8gYXZvaWQgaW50cm9kdWNpbmcgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSBjb250ZW50IENvbnRlbnQgb2YgdGhlIGZpbGUuXG4gKiBAcGFyYW0gb2xkTWF0ZXJpYWxQcmVmaXggUHJlZml4IHdpdGggd2hpY2ggdGhlIG9sZCBNYXRlcmlhbCBpbXBvcnRzIHNob3VsZCBzdGFydC5cbiAqICAgSGFzIHRvIGVuZCB3aXRoIGEgc2xhc2guIEUuZy4gaWYgYEBpbXBvcnQgJ35AYW5ndWxhci9tYXRlcmlhbC90aGVtaW5nJ2Agc2hvdWxkIGJlXG4gKiAgIG1hdGNoZWQsIHRoZSBwcmVmaXggd291bGQgYmUgYH5AYW5ndWxhci9tYXRlcmlhbC9gLlxuICogQHBhcmFtIG9sZENka1ByZWZpeCBQcmVmaXggd2l0aCB3aGljaCB0aGUgb2xkIENESyBpbXBvcnRzIHNob3VsZCBzdGFydC5cbiAqICAgSGFzIHRvIGVuZCB3aXRoIGEgc2xhc2guIEUuZy4gaWYgYEBpbXBvcnQgJ35AYW5ndWxhci9jZGsvb3ZlcmxheSdgIHNob3VsZCBiZVxuICogICBtYXRjaGVkLCB0aGUgcHJlZml4IHdvdWxkIGJlIGB+QGFuZ3VsYXIvY2RrL2AuXG4gKiBAcGFyYW0gbmV3TWF0ZXJpYWxJbXBvcnRQYXRoIE5ldyBpbXBvcnQgdG8gdGhlIE1hdGVyaWFsIHRoZW1pbmcgQVBJIChlLmcuIGB+QGFuZ3VsYXIvbWF0ZXJpYWxgKS5cbiAqIEBwYXJhbSBuZXdDZGtJbXBvcnRQYXRoIE5ldyBpbXBvcnQgdG8gdGhlIENESyBTYXNzIEFQSXMgKGUuZy4gYH5AYW5ndWxhci9jZGtgKS5cbiAqIEBwYXJhbSBleGNsdWRlZEltcG9ydHMgUGF0dGVybiB0aGF0IGNhbiBiZSB1c2VkIHRvIGV4Y2x1ZGUgaW1wb3J0cyBmcm9tIGJlaW5nIHByb2Nlc3NlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1pZ3JhdGVGaWxlQ29udGVudChjb250ZW50OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZE1hdGVyaWFsUHJlZml4OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZENka1ByZWZpeDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdNYXRlcmlhbEltcG9ydFBhdGg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q2RrSW1wb3J0UGF0aDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYU1hdGVyaWFsU3ltYm9sczogRXh0cmFTeW1ib2xzID0ge30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVkSW1wb3J0cz86IFJlZ0V4cCk6IHN0cmluZyB7XG4gIGNvbnN0IG1hdGVyaWFsUmVzdWx0cyA9IGRldGVjdEltcG9ydHMoY29udGVudCwgb2xkTWF0ZXJpYWxQcmVmaXgsIGV4Y2x1ZGVkSW1wb3J0cyk7XG4gIGNvbnN0IGNka1Jlc3VsdHMgPSBkZXRlY3RJbXBvcnRzKGNvbnRlbnQsIG9sZENka1ByZWZpeCwgZXhjbHVkZWRJbXBvcnRzKTtcblxuICAvLyBUcnkgdG8gbWlncmF0ZSB0aGUgc3ltYm9scyBldmVuIGlmIHRoZXJlIGFyZSBubyBpbXBvcnRzLiBUaGlzIGlzIHVzZWRcbiAgLy8gdG8gY292ZXIgdGhlIGNhc2Ugd2hlcmUgdGhlIENvbXBvbmVudHMgc3ltYm9scyB3ZXJlIHVzZWQgdHJhbnNpdGl2ZWx5LlxuICBjb250ZW50ID0gbWlncmF0ZUNka1N5bWJvbHMoY29udGVudCwgbmV3Q2RrSW1wb3J0UGF0aCwgY2RrUmVzdWx0cyk7XG4gIGNvbnRlbnQgPSBtaWdyYXRlTWF0ZXJpYWxTeW1ib2xzKFxuICAgICAgY29udGVudCwgbmV3TWF0ZXJpYWxJbXBvcnRQYXRoLCBtYXRlcmlhbFJlc3VsdHMsIGV4dHJhTWF0ZXJpYWxTeW1ib2xzKTtcbiAgY29udGVudCA9IHJlcGxhY2VSZW1vdmVkVmFyaWFibGVzKGNvbnRlbnQsIHJlbW92ZWRNYXRlcmlhbFZhcmlhYmxlcyk7XG5cbiAgLy8gV2UgY2FuIGFzc3VtZSB0aGF0IHRoZSBtaWdyYXRpb24gaGFzIHRha2VuIGNhcmUgb2YgYW55IENvbXBvbmVudHMgc3ltYm9scyB0aGF0IHdlcmVcbiAgLy8gaW1wb3J0ZWQgdHJhbnNpdGl2ZWx5IHNvIHdlIGNhbiBhbHdheXMgZHJvcCB0aGUgb2xkIGltcG9ydHMuIFdlIGFsc28gYXNzdW1lIHRoYXQgaW1wb3J0c1xuICAvLyB0byB0aGUgbmV3IGVudHJ5IHBvaW50cyBoYXZlIGJlZW4gYWRkZWQgYWxyZWFkeS5cbiAgaWYgKG1hdGVyaWFsUmVzdWx0cy5pbXBvcnRzLmxlbmd0aCkge1xuICAgIGNvbnRlbnQgPSByZXBsYWNlUmVtb3ZlZFZhcmlhYmxlcyhjb250ZW50LCB1bnByZWZpeGVkUmVtb3ZlZFZhcmlhYmxlcyk7XG4gICAgY29udGVudCA9IHJlbW92ZVN0cmluZ3MoY29udGVudCwgbWF0ZXJpYWxSZXN1bHRzLmltcG9ydHMpO1xuICB9XG5cbiAgaWYgKGNka1Jlc3VsdHMuaW1wb3J0cy5sZW5ndGgpIHtcbiAgICBjb250ZW50ID0gcmVtb3ZlU3RyaW5ncyhjb250ZW50LCBjZGtSZXN1bHRzLmltcG9ydHMpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQ291bnRzIHRoZSBudW1iZXIgb2YgaW1wb3J0cyB3aXRoIGEgc3BlY2lmaWMgcHJlZml4IGFuZCBleHRyYWN0cyB0aGVpciBuYW1lc3BhY2VzLlxuICogQHBhcmFtIGNvbnRlbnQgRmlsZSBjb250ZW50IGluIHdoaWNoIHRvIGxvb2sgZm9yIGltcG9ydHMuXG4gKiBAcGFyYW0gcHJlZml4IFByZWZpeCB0aGF0IHRoZSBpbXBvcnRzIHNob3VsZCBzdGFydCB3aXRoLlxuICogQHBhcmFtIGV4Y2x1ZGVkSW1wb3J0cyBQYXR0ZXJuIHRoYXQgY2FuIGJlIHVzZWQgdG8gZXhjbHVkZSBpbXBvcnRzIGZyb20gYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5mdW5jdGlvbiBkZXRlY3RJbXBvcnRzKGNvbnRlbnQ6IHN0cmluZywgcHJlZml4OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVkSW1wb3J0cz86IFJlZ0V4cCk6IERldGVjdEltcG9ydFJlc3VsdCB7XG4gIGlmIChwcmVmaXhbcHJlZml4Lmxlbmd0aCAtIDFdICE9PSAnLycpIHtcbiAgICAvLyBTb21lIG9mIHRoZSBsb2dpYyBmdXJ0aGVyIGRvd24gbWFrZXMgYXNzdW1wdGlvbnMgYWJvdXQgdGhlIGltcG9ydCBkZXB0aC5cbiAgICB0aHJvdyBFcnJvcihgUHJlZml4IFwiJHtwcmVmaXh9XCIgaGFzIHRvIGVuZCBpbiBhIHNsYXNoLmApO1xuICB9XG5cbiAgLy8gTGlzdCBvZiBgQHVzZWAgbmFtZXNwYWNlcyBmcm9tIHdoaWNoIEFuZ3VsYXIgQ0RLL01hdGVyaWFsIEFQSXMgbWF5IGJlIHJlZmVyZW5jZWQuXG4gIC8vIFNpbmNlIHdlIGtub3cgdGhhdCB0aGUgbGlicmFyeSBkb2Vzbid0IGhhdmUgYW55IG5hbWUgY29sbGlzaW9ucywgd2UgY2FuIHRyZWF0IGFsbCBvZiB0aGVzZVxuICAvLyBuYW1lc3BhY2VzIGFzIGVxdWl2YWxlbnQuXG4gIGNvbnN0IG5hbWVzcGFjZXM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGltcG9ydHM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKGBAKGltcG9ydHx1c2UpICtbJ1wiXSR7ZXNjYXBlUmVnRXhwKHByZWZpeCl9LipbJ1wiXS4qOz9cXG5gLCAnZycpO1xuICBsZXQgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGwgPSBudWxsO1xuXG4gIHdoaWxlIChtYXRjaCA9IHBhdHRlcm4uZXhlYyhjb250ZW50KSkge1xuICAgIGNvbnN0IFtmdWxsSW1wb3J0LCB0eXBlXSA9IG1hdGNoO1xuXG4gICAgaWYgKGV4Y2x1ZGVkSW1wb3J0cz8udGVzdChmdWxsSW1wb3J0KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09ICd1c2UnKSB7XG4gICAgICBjb25zdCBuYW1lc3BhY2UgPSBleHRyYWN0TmFtZXNwYWNlRnJvbVVzZVN0YXRlbWVudChmdWxsSW1wb3J0KTtcblxuICAgICAgaWYgKG5hbWVzcGFjZXMuaW5kZXhPZihuYW1lc3BhY2UpID09PSAtMSkge1xuICAgICAgICBuYW1lc3BhY2VzLnB1c2gobmFtZXNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbXBvcnRzLnB1c2goZnVsbEltcG9ydCk7XG4gIH1cblxuICByZXR1cm4ge2ltcG9ydHMsIG5hbWVzcGFjZXN9O1xufVxuXG4vKiogTWlncmF0ZXMgdGhlIE1hdGVyaWFsIHN5bWJvbHMgaW4gYSBmaWxlLiAqL1xuZnVuY3Rpb24gbWlncmF0ZU1hdGVyaWFsU3ltYm9scyhjb250ZW50OiBzdHJpbmcsIGltcG9ydFBhdGg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0ZWN0ZWRJbXBvcnRzOiBEZXRlY3RJbXBvcnRSZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhTWF0ZXJpYWxTeW1ib2xzOiBFeHRyYVN5bWJvbHMgPSB7fSk6IHN0cmluZyB7XG4gIGNvbnN0IGluaXRpYWxDb250ZW50ID0gY29udGVudDtcbiAgY29uc3QgbmFtZXNwYWNlID0gJ21hdCc7XG5cbiAgLy8gTWlncmF0ZSB0aGUgbWl4aW5zLlxuICBjb25zdCBtaXhpbnNUb1VwZGF0ZSA9IHsuLi5tYXRlcmlhbE1peGlucywgLi4uZXh0cmFNYXRlcmlhbFN5bWJvbHMubWl4aW5zfTtcbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgbWl4aW5zVG9VcGRhdGUsIGRldGVjdGVkSW1wb3J0cy5uYW1lc3BhY2VzLCBtaXhpbktleUZvcm1hdHRlcixcbiAgICBnZXRNaXhpblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSkpO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIGZ1bmN0aW9ucy5cbiAgY29uc3QgZnVuY3Rpb25zVG9VcGRhdGUgPSB7Li4ubWF0ZXJpYWxGdW5jdGlvbnMsIC4uLmV4dHJhTWF0ZXJpYWxTeW1ib2xzLmZ1bmN0aW9uc307XG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIGZ1bmN0aW9uc1RvVXBkYXRlLCBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcyxcbiAgICBmdW5jdGlvbktleUZvcm1hdHRlciwgZ2V0RnVuY3Rpb25WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBNaWdyYXRlIHRoZSB2YXJpYWJsZXMuXG4gIGNvbnN0IHZhcmlhYmxlc1RvVXBkYXRlID0gey4uLm1hdGVyaWFsVmFyaWFibGVzLCAuLi5leHRyYU1hdGVyaWFsU3ltYm9scy52YXJpYWJsZXN9O1xuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhjb250ZW50LCB2YXJpYWJsZXNUb1VwZGF0ZSwgZGV0ZWN0ZWRJbXBvcnRzLm5hbWVzcGFjZXMsXG4gICAgdmFyaWFibGVLZXlGb3JtYXR0ZXIsIGdldFZhcmlhYmxlVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlKSk7XG5cbiAgaWYgKGNvbnRlbnQgIT09IGluaXRpYWxDb250ZW50KSB7XG4gICAgLy8gQWRkIGFuIGltcG9ydCB0byB0aGUgbmV3IEFQSSBvbmx5IGlmIGFueSBvZiB0aGUgQVBJcyB3ZXJlIGJlaW5nIHVzZWQuXG4gICAgY29udGVudCA9IGluc2VydFVzZVN0YXRlbWVudChjb250ZW50LCBpbXBvcnRQYXRoLCBuYW1lc3BhY2UpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKiBNaWdyYXRlcyB0aGUgQ0RLIHN5bWJvbHMgaW4gYSBmaWxlLiAqL1xuZnVuY3Rpb24gbWlncmF0ZUNka1N5bWJvbHMoY29udGVudDogc3RyaW5nLCBpbXBvcnRQYXRoOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRlY3RlZEltcG9ydHM6IERldGVjdEltcG9ydFJlc3VsdCk6IHN0cmluZyB7XG4gIGNvbnN0IGluaXRpYWxDb250ZW50ID0gY29udGVudDtcbiAgY29uc3QgbmFtZXNwYWNlID0gJ2Nkayc7XG5cbiAgLy8gTWlncmF0ZSB0aGUgbWl4aW5zLlxuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhjb250ZW50LCBjZGtNaXhpbnMsIGRldGVjdGVkSW1wb3J0cy5uYW1lc3BhY2VzLCBtaXhpbktleUZvcm1hdHRlcixcbiAgICBnZXRNaXhpblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSkpO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIHZhcmlhYmxlcy5cbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgY2RrVmFyaWFibGVzLCBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcywgdmFyaWFibGVLZXlGb3JtYXR0ZXIsXG4gICAgZ2V0VmFyaWFibGVWYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBQcmV2aW91c2x5IHRoZSBDREsgc3ltYm9scyB3ZXJlIGV4cG9zZWQgdGhyb3VnaCBgbWF0ZXJpYWwvdGhlbWluZ2AsIGJ1dCBub3cgd2UgaGF2ZSBhXG4gIC8vIGRlZGljYXRlZCBlbnRyeXBvaW50IGZvciB0aGUgQ0RLLiBPbmx5IGFkZCBhbiBpbXBvcnQgZm9yIGl0IGlmIGFueSBvZiB0aGUgc3ltYm9scyBhcmUgdXNlZC5cbiAgaWYgKGNvbnRlbnQgIT09IGluaXRpYWxDb250ZW50KSB7XG4gICAgY29udGVudCA9IGluc2VydFVzZVN0YXRlbWVudChjb250ZW50LCBpbXBvcnRQYXRoLCBuYW1lc3BhY2UpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogUmVuYW1lcyBhbGwgU2FzcyBzeW1ib2xzIGluIGEgZmlsZSBiYXNlZCBvbiBhIHByZS1kZWZpbmVkIG1hcHBpbmcuXG4gKiBAcGFyYW0gY29udGVudCBDb250ZW50IG9mIGEgZmlsZSB0byBiZSBtaWdyYXRlZC5cbiAqIEBwYXJhbSBtYXBwaW5nIE1hcHBpbmcgYmV0d2VlbiBzeW1ib2wgbmFtZXMgYW5kIHRoZWlyIHJlcGxhY2VtZW50cy5cbiAqIEBwYXJhbSBuYW1lc3BhY2VzIE5hbWVzIHRvIGl0ZXJhdGUgb3ZlciBhbmQgcGFzcyB0byBnZXRLZXlQYXR0ZXJuLlxuICogQHBhcmFtIGdldEtleVBhdHRlcm4gRnVuY3Rpb24gdXNlZCB0byB0dXJuIGVhY2ggb2YgdGhlIGtleXMgaW50byBhIHJlZ2V4LlxuICogQHBhcmFtIGZvcm1hdFZhbHVlIEZvcm1hdHMgdGhlIHZhbHVlIHRoYXQgd2lsbCByZXBsYWNlIGFueSBtYXRjaGVzIG9mIHRoZSBwYXR0ZXJuIHJldHVybmVkIGJ5XG4gKiAgYGdldEtleVBhdHRlcm5gLlxuICovXG5mdW5jdGlvbiByZW5hbWVTeW1ib2xzKGNvbnRlbnQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgbWFwcGluZzogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlczogc3RyaW5nW10sXG4gICAgICAgICAgICAgICAgICAgICAgIGdldEtleVBhdHRlcm46IChuYW1lc3BhY2U6IHN0cmluZ3xudWxsLCBrZXk6IHN0cmluZykgPT4gUmVnRXhwLFxuICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXRWYWx1ZTogKGtleTogc3RyaW5nKSA9PiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBUaGUgbnVsbCBhdCB0aGUgZW5kIGlzIHNvIHRoYXQgd2UgbWFrZSBvbmUgbGFzdCBwYXNzIHRvIGNvdmVyIG5vbi1uYW1lc3BhY2VkIHN5bWJvbHMuXG4gIFsuLi5uYW1lc3BhY2VzLnNsaWNlKCksIG51bGxdLmZvckVhY2gobmFtZXNwYWNlID0+IHtcbiAgICBPYmplY3Qua2V5cyhtYXBwaW5nKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCBwYXR0ZXJuID0gZ2V0S2V5UGF0dGVybihuYW1lc3BhY2UsIGtleSk7XG5cbiAgICAgIC8vIFNhbml0eSBjaGVjayBzaW5jZSBub24tZ2xvYmFsIHJlZ2V4ZXMgd2lsbCBvbmx5IHJlcGxhY2UgdGhlIGZpcnN0IG1hdGNoLlxuICAgICAgaWYgKHBhdHRlcm4uZmxhZ3MuaW5kZXhPZignZycpID09PSAtMSkge1xuICAgICAgICB0aHJvdyBFcnJvcignUmVwbGFjZW1lbnQgcGF0dGVybiBtdXN0IGJlIGdsb2JhbC4nKTtcbiAgICAgIH1cblxuICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZShwYXR0ZXJuLCBmb3JtYXRWYWx1ZShtYXBwaW5nW2tleV0pKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKiBJbnNlcnRzIGFuIGBAdXNlYCBzdGF0ZW1lbnQgaW4gYSBzdHJpbmcuICovXG5mdW5jdGlvbiBpbnNlcnRVc2VTdGF0ZW1lbnQoY29udGVudDogc3RyaW5nLCBpbXBvcnRQYXRoOiBzdHJpbmcsIG5hbWVzcGFjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gSWYgdGhlIGNvbnRlbnQgYWxyZWFkeSBoYXMgdGhlIGBAdXNlYCBpbXBvcnQsIHdlIGRvbid0IG5lZWQgdG8gYWRkIGFueXRoaW5nLlxuICBpZiAobmV3IFJlZ0V4cChgQHVzZSArWydcIl0ke2ltcG9ydFBhdGh9WydcIl1gLCAnZycpLnRlc3QoY29udGVudCkpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIC8vIFNhc3Mgd2lsbCB0aHJvdyBhbiBlcnJvciBpZiBhbiBgQHVzZWAgc3RhdGVtZW50IGNvbWVzIGFmdGVyIGFub3RoZXIgc3RhdGVtZW50LiBUaGUgc2FmZXN0IHdheVxuICAvLyB0byBlbnN1cmUgdGhhdCB3ZSBjb25mb3JtIHRvIHRoYXQgcmVxdWlyZW1lbnQgaXMgYnkgYWx3YXlzIGluc2VydGluZyBvdXIgaW1wb3J0cyBhdCB0aGUgdG9wXG4gIC8vIG9mIHRoZSBmaWxlLiBEZXRlY3Rpbmcgd2hlcmUgdGhlIHVzZXIncyBjb250ZW50IHN0YXJ0cyBpcyB0cmlja3ksIGJlY2F1c2UgdGhlcmUgYXJlIG1hbnlcbiAgLy8gZGlmZmVyZW50IGtpbmRzIG9mIHN5bnRheCB3ZSdkIGhhdmUgdG8gYWNjb3VudCBmb3IuIE9uZSBhcHByb2FjaCBpcyB0byBmaW5kIHRoZSBmaXJzdCBgQGltcG9ydGBcbiAgLy8gYW5kIGluc2VydCBiZWZvcmUgaXQsIGJ1dCB0aGUgcHJvYmxlbSBpcyB0aGF0IFNhc3MgYWxsb3dzIGBAaW1wb3J0YCB0byBiZSBwbGFjZWQgYW55d2hlcmUuXG4gIGxldCBuZXdJbXBvcnRJbmRleCA9IDA7XG5cbiAgLy8gT25lIHNwZWNpYWwgY2FzZSBpcyBpZiB0aGUgZmlsZSBzdGFydHMgd2l0aCBhIGxpY2Vuc2UgaGVhZGVyIHdoaWNoIHdlIHdhbnQgdG8gcHJlc2VydmUgb24gdG9wLlxuICBpZiAoY29udGVudC50cmltKCkuc3RhcnRzV2l0aCgnLyonKSkge1xuICAgIGNvbnN0IGNvbW1lbnRFbmRJbmRleCA9IGNvbnRlbnQuaW5kZXhPZignKi8nLCBjb250ZW50LmluZGV4T2YoJy8qJykpO1xuICAgIG5ld0ltcG9ydEluZGV4ID0gY29udGVudC5pbmRleE9mKCdcXG4nLCBjb21tZW50RW5kSW5kZXgpICsgMTtcbiAgfVxuXG4gIHJldHVybiBjb250ZW50LnNsaWNlKDAsIG5ld0ltcG9ydEluZGV4KSArIGBAdXNlICcke2ltcG9ydFBhdGh9JyBhcyAke25hbWVzcGFjZX07XFxuYCArXG4gICAgICAgICBjb250ZW50LnNsaWNlKG5ld0ltcG9ydEluZGV4KTtcbn1cblxuLyoqIEZvcm1hdHMgYSBtaWdyYXRpb24ga2V5IGFzIGEgU2FzcyBtaXhpbiBpbnZvY2F0aW9uLiAqL1xuZnVuY3Rpb24gbWl4aW5LZXlGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmd8bnVsbCwgbmFtZTogc3RyaW5nKTogUmVnRXhwIHtcbiAgLy8gTm90ZSB0aGF0IGFkZGluZyBhIGAoYCBhdCB0aGUgZW5kIG9mIHRoZSBwYXR0ZXJuIHdvdWxkIGJlIG1vcmUgYWNjdXJhdGUsIGJ1dCBtaXhpblxuICAvLyBpbnZvY2F0aW9ucyBkb24ndCBuZWNlc3NhcmlseSBoYXZlIHRvIGluY2x1ZGUgdGhlIHBhcmVudGhlc2VzLiBXZSBjb3VsZCBhZGQgYFsoO11gLFxuICAvLyBidXQgdGhlbiB3ZSB3b24ndCBrbm93IHdoaWNoIGNoYXJhY3RlciB0byBpbmNsdWRlIGluIHRoZSByZXBsYWNlbWVudCBzdHJpbmcuXG4gIHJldHVybiBuZXcgUmVnRXhwKGBAaW5jbHVkZSArJHtlc2NhcGVSZWdFeHAoKG5hbWVzcGFjZSA/IG5hbWVzcGFjZSArICcuJyA6ICcnKSArIG5hbWUpfWAsICdnJyk7XG59XG5cbi8qKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmb3JtYXQgYSBTYXNzIG1peGluIHJlcGxhY2VtZW50LiAqL1xuZnVuY3Rpb24gZ2V0TWl4aW5WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZyk6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZyB7XG4gIC8vIE5vdGUgdGhhdCBhZGRpbmcgYSBgKGAgYXQgdGhlIGVuZCBvZiB0aGUgcGF0dGVybiB3b3VsZCBiZSBtb3JlIGFjY3VyYXRlLFxuICAvLyBidXQgbWl4aW4gaW52b2NhdGlvbnMgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSB0byBpbmNsdWRlIHRoZSBwYXJlbnRoZXNlcy5cbiAgcmV0dXJuIG5hbWUgPT4gYEBpbmNsdWRlICR7bmFtZXNwYWNlfS4ke25hbWV9YDtcbn1cblxuLyoqIEZvcm1hdHMgYSBtaWdyYXRpb24ga2V5IGFzIGEgU2FzcyBmdW5jdGlvbiBpbnZvY2F0aW9uLiAqL1xuZnVuY3Rpb24gZnVuY3Rpb25LZXlGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmd8bnVsbCwgbmFtZTogc3RyaW5nKTogUmVnRXhwIHtcbiAgY29uc3QgZnVuY3Rpb25OYW1lID0gZXNjYXBlUmVnRXhwKGAke25hbWVzcGFjZSA/IG5hbWVzcGFjZSArICcuJyA6ICcnfSR7bmFtZX0oYCk7XG4gIHJldHVybiBuZXcgUmVnRXhwKGAoPzwhWy1fYS16QS1aMC05XSkke2Z1bmN0aW9uTmFtZX1gLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyBmdW5jdGlvbiByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldEZ1bmN0aW9uVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICByZXR1cm4gbmFtZSA9PiBgJHtuYW1lc3BhY2V9LiR7bmFtZX0oYDtcbn1cblxuLyoqIEZvcm1hdHMgYSBtaWdyYXRpb24ga2V5IGFzIGEgU2FzcyB2YXJpYWJsZS4gKi9cbmZ1bmN0aW9uIHZhcmlhYmxlS2V5Rm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nfG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIGNvbnN0IHZhcmlhYmxlTmFtZSA9IGVzY2FwZVJlZ0V4cChgJHtuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJ30kJHtuYW1lfWApO1xuICByZXR1cm4gbmV3IFJlZ0V4cChgJHt2YXJpYWJsZU5hbWV9KD8hWy1fYS16QS1aMC05XSlgLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyB2YXJpYWJsZSByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldFZhcmlhYmxlVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICByZXR1cm4gbmFtZSA9PiBgJHtuYW1lc3BhY2V9LiQke25hbWV9YDtcbn1cblxuLyoqIEVzY2FwZXMgc3BlY2lhbCByZWdleCBjaGFyYWN0ZXJzIGluIGEgc3RyaW5nLiAqL1xuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8W1xcXVxcL1xcXFxdKS9nLCAnXFxcXCQxJyk7XG59XG5cbi8qKiBSZW1vdmVzIGFsbCBzdHJpbmdzIGZyb20gYW5vdGhlciBzdHJpbmcuICovXG5mdW5jdGlvbiByZW1vdmVTdHJpbmdzKGNvbnRlbnQ6IHN0cmluZywgdG9SZW1vdmU6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRvUmVtb3ZlXG4gICAgLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnQpID0+IGFjY3VtdWxhdG9yLnJlcGxhY2UoY3VycmVudCwgJycpLCBjb250ZW50KVxuICAgIC5yZXBsYWNlKC9eXFxzKy8sICcnKTtcbn1cblxuLyoqIFBhcnNlcyBvdXQgdGhlIG5hbWVzcGFjZSBmcm9tIGEgU2FzcyBgQHVzZWAgc3RhdGVtZW50LiAqL1xuZnVuY3Rpb24gZXh0cmFjdE5hbWVzcGFjZUZyb21Vc2VTdGF0ZW1lbnQoZnVsbEltcG9ydDogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgY2xvc2VRdW90ZUluZGV4ID0gTWF0aC5tYXgoZnVsbEltcG9ydC5sYXN0SW5kZXhPZihgXCJgKSwgZnVsbEltcG9ydC5sYXN0SW5kZXhPZihgJ2ApKTtcblxuICBpZiAoY2xvc2VRdW90ZUluZGV4ID4gLTEpIHtcbiAgICBjb25zdCBhc0V4cHJlc3Npb24gPSAnYXMgJztcbiAgICBjb25zdCBhc0luZGV4ID0gZnVsbEltcG9ydC5pbmRleE9mKGFzRXhwcmVzc2lvbiwgY2xvc2VRdW90ZUluZGV4KTtcblxuICAgIC8vIElmIHdlIGZvdW5kIGFuIGAgYXMgYCBleHByZXNzaW9uLCB3ZSBjb25zaWRlciB0aGUgcmVzdCBvZiB0aGUgdGV4dCBhcyB0aGUgbmFtZXNwYWNlLlxuICAgIGlmIChhc0luZGV4ID4gLTEpIHtcbiAgICAgIHJldHVybiBmdWxsSW1wb3J0LnNsaWNlKGFzSW5kZXggKyBhc0V4cHJlc3Npb24ubGVuZ3RoKS5zcGxpdCgnOycpWzBdLnRyaW0oKTtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgdGhlIG5hbWVzcGFjZSBpcyB0aGUgbmFtZSBvZiB0aGUgZmlsZSB0aGF0IGlzIGJlaW5nIGltcG9ydGVkLlxuICAgIGNvbnN0IGxhc3RTbGFzaEluZGV4ID0gZnVsbEltcG9ydC5sYXN0SW5kZXhPZignLycsIGNsb3NlUXVvdGVJbmRleCk7XG5cbiAgICBpZiAobGFzdFNsYXNoSW5kZXggPiAtMSkge1xuICAgICAgY29uc3QgZmlsZU5hbWUgPSBmdWxsSW1wb3J0LnNsaWNlKGxhc3RTbGFzaEluZGV4ICsgMSwgY2xvc2VRdW90ZUluZGV4KVxuICAgICAgICAvLyBTYXNzIGFsbG93cyBmb3IgbGVhZGluZyB1bmRlcnNjb3JlcyB0byBiZSBvbWl0dGVkIGFuZCBpdCB0ZWNobmljYWxseSBzdXBwb3J0cyAuc2Nzcy5cbiAgICAgICAgLnJlcGxhY2UoL15ffChcXC5pbXBvcnQpP1xcLnNjc3MkfFxcLmltcG9ydCQvZywgJycpO1xuXG4gICAgICAvLyBTYXNzIGlnbm9yZXMgYC9pbmRleGAgYW5kIGluZmVycyB0aGUgbmFtZXNwYWNlIGFzIHRoZSBuZXh0IHNlZ21lbnQgaW4gdGhlIHBhdGguXG4gICAgICBpZiAoZmlsZU5hbWUgPT09ICdpbmRleCcpIHtcbiAgICAgICAgY29uc3QgbmV4dFNsYXNoSW5kZXggPSBmdWxsSW1wb3J0Lmxhc3RJbmRleE9mKCcvJywgbGFzdFNsYXNoSW5kZXggLSAxKTtcblxuICAgICAgICBpZiAobmV4dFNsYXNoSW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiBmdWxsSW1wb3J0LnNsaWNlKG5leHRTbGFzaEluZGV4ICsgMSwgbGFzdFNsYXNoSW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmlsZU5hbWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBleHRyYWN0IG5hbWVzcGFjZSBmcm9tIGltcG9ydCBcIiR7ZnVsbEltcG9ydH1cIi5gKTtcbn1cblxuLyoqXG4gKiBSZXBsYWNlcyB2YXJpYWJsZXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZCB3aXRoIHRoZWlyIHZhbHVlcy5cbiAqIEBwYXJhbSBjb250ZW50IENvbnRlbnQgb2YgdGhlIGZpbGUgdG8gYmUgbWlncmF0ZWQuXG4gKiBAcGFyYW0gdmFyaWFibGVzIE1hcHBpbmcgYmV0d2VlbiB2YXJpYWJsZSBuYW1lcyBhbmQgdGhlaXIgdmFsdWVzLlxuICovXG5mdW5jdGlvbiByZXBsYWNlUmVtb3ZlZFZhcmlhYmxlcyhjb250ZW50OiBzdHJpbmcsIHZhcmlhYmxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IHN0cmluZyB7XG4gIE9iamVjdC5rZXlzKHZhcmlhYmxlcykuZm9yRWFjaCh2YXJpYWJsZU5hbWUgPT4ge1xuICAgIC8vIE5vdGUgdGhhdCB0aGUgcGF0dGVybiB1c2VzIGEgbmVnYXRpdmUgbG9va2FoZWFkIHRvIGV4Y2x1ZGVcbiAgICAvLyB2YXJpYWJsZSBhc3NpZ25tZW50cywgYmVjYXVzZSB0aGV5IGNhbid0IGJlIG1pZ3JhdGVkLlxuICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgXFxcXCQke2VzY2FwZVJlZ0V4cCh2YXJpYWJsZU5hbWUpfSg/IVxcXFxzKzp8OilgLCAnZycpO1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UocmVnZXgsIHZhcmlhYmxlc1t2YXJpYWJsZU5hbWVdKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG4iXX0=