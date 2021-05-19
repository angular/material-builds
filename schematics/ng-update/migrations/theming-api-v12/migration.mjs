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
    content = migrateMaterialSymbols(content, newMaterialImportPath, materialResults, extraMaterialSymbols);
    content = migrateCdkSymbols(content, newCdkImportPath, cdkResults);
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
    const mixinsToUpdate = Object.assign(Object.assign({}, config_1.materialMixins), extraMaterialSymbols.mixins);
    const functionsToUpdate = Object.assign(Object.assign({}, config_1.materialFunctions), extraMaterialSymbols.functions);
    // Migrate the mixins.
    content = renameSymbols(content, mixinsToUpdate, detectedImports.namespaces, mixinKeyFormatter, getMixinValueFormatter(namespace));
    // Migrate the functions.
    content = renameSymbols(content, functionsToUpdate, detectedImports.namespaces, functionKeyFormatter, getFunctionValueFormatter(namespace));
    // Migrate the variables.
    content = renameSymbols(content, config_1.materialVariables, detectedImports.namespaces, variableKeyFormatter, getVariableValueFormatter(namespace));
    if (content !== initialContent) {
        // Add an import to the new API only if any of the APIs were being used.
        content = insertUseStatement(content, importPath, detectedImports.imports, namespace);
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
        content = insertUseStatement(content, importPath, detectedImports.imports, namespace);
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
    [...namespaces.slice().sort(sortLengthDescending), null].forEach(namespace => {
        // Migrate the longest keys first so that our regex-based replacements don't accidentally
        // capture keys that contain other keys. E.g. `$mat-blue` is contained within `$mat-blue-grey`.
        Object.keys(mapping).sort(sortLengthDescending).forEach(key => {
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
function insertUseStatement(content, importPath, importsToIgnore, namespace) {
    // We want to find the first import that isn't in the list of ignored imports or find nothing,
    // because the imports being replaced might be the only ones in the file and they can be further
    // down. An easy way to do this is to replace the imports with a random character and run
    // `indexOf` on the result. This isn't the most efficient way of doing it, but it's more compact
    // and it allows us to easily deal with things like comment nodes.
    const contentToSearch = importsToIgnore.reduce((accumulator, current) => accumulator.replace(current, '◬'.repeat(current.length)), content);
    // Sass has a limitation that all `@use` declarations have to come before `@import` so we have
    // to find the first import and insert before it. Technically we can get away with always
    // inserting at 0, but the file may start with something like a license header.
    const newImportIndex = Math.max(0, contentToSearch.indexOf('@import '));
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
    return new RegExp(escapeRegExp(`${namespace ? namespace + '.' : ''}${name}(`), 'g');
}
/** Returns a function that can be used to format a Sass function replacement. */
function getFunctionValueFormatter(namespace) {
    return name => `${namespace}.${name}(`;
}
/** Formats a migration key as a Sass variable. */
function variableKeyFormatter(namespace, name) {
    return new RegExp(escapeRegExp(`${namespace ? namespace + '.' : ''}$${name}`), 'g');
}
/** Returns a function that can be used to format a Sass variable replacement. */
function getVariableValueFormatter(namespace) {
    return name => `${namespace}.$${name}`;
}
/** Escapes special regex characters in a string. */
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
/** Used with `Array.prototype.sort` to order strings in descending length. */
function sortLengthDescending(a, b) {
    return b.length - a.length;
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
    Object.keys(variables).sort(sortLengthDescending).forEach(variableName => {
        // Note that the pattern uses a negative lookahead to exclude
        // variable assignments, because they can't be migrated.
        const regex = new RegExp(`\\$${escapeRegExp(variableName)}(?!\\s+:|:)`, 'g');
        content = content.replace(regex, variables[variableName]);
    });
    return content;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvdGhlbWluZy1hcGktdjEyL21pZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCxxQ0FRa0I7QUFjbEI7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FBQyxPQUFlLEVBQ2YsaUJBQXlCLEVBQ3pCLFlBQW9CLEVBQ3BCLHFCQUE2QixFQUM3QixnQkFBd0IsRUFDeEIsdUJBQXFDLEVBQUUsRUFDdkMsZUFBd0I7SUFDekQsTUFBTSxlQUFlLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNuRixNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsQ0FBQztJQUV6RSx3RUFBd0U7SUFDeEUseUVBQXlFO0lBQ3pFLE9BQU8sR0FBRyxzQkFBc0IsQ0FDNUIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLGVBQWUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQzNFLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDbkUsT0FBTyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxpQ0FBd0IsQ0FBQyxDQUFDO0lBRXJFLHNGQUFzRjtJQUN0RiwyRkFBMkY7SUFDM0YsbURBQW1EO0lBQ25ELElBQUksZUFBZSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDbEMsT0FBTyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxtQ0FBMEIsQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxPQUFPLENBQUMs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QUU7UUFDdkUsNkRBQTZEO1FBQzdELHdEQUF3RDtRQUN4RCxNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLFlBQVksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdFLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgbWF0ZXJpYWxNaXhpbnMsXG4gIG1hdGVyaWFsRnVuY3Rpb25zLFxuICBtYXRlcmlhbFZhcmlhYmxlcyxcbiAgY2RrTWl4aW5zLFxuICBjZGtWYXJpYWJsZXMsXG4gIHJlbW92ZWRNYXRlcmlhbFZhcmlhYmxlcyxcbiAgdW5wcmVmaXhlZFJlbW92ZWRWYXJpYWJsZXNcbn0gZnJvbSAnLi9jb25maWcnO1xuXG4vKiogVGhlIHJlc3VsdCBvZiBhIHNlYXJjaCBmb3IgaW1wb3J0cyBhbmQgbmFtZXNwYWNlcyBpbiBhIGZpbGUuICovXG5pbnRlcmZhY2UgRGV0ZWN0SW1wb3J0UmVzdWx0IHtcbiAgaW1wb3J0czogc3RyaW5nW107XG4gIG5hbWVzcGFjZXM6IHN0cmluZ1tdO1xufVxuXG4vKiogQWRkaXRpb24gbWl4aW4gYW5kIGZ1bmN0aW9uIG5hbWVzIHRoYXQgY2FuIGJlIHVwZGF0ZWQgd2hlbiBpbnZva2luZyBtaWdyYXRpb24gZGlyZWN0bHkuICovXG5pbnRlcmZhY2UgRXh0cmFTeW1ib2xzIHtcbiAgbWl4aW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgZnVuY3Rpb25zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn1cblxuLyoqXG4gKiBNaWdyYXRlcyB0aGUgY29udGVudCBvZiBhIGZpbGUgdG8gdGhlIG5ldyB0aGVtaW5nIEFQSS4gTm90ZSB0aGF0IHRoaXMgbWlncmF0aW9uIGlzIHVzaW5nIHBsYWluXG4gKiBzdHJpbmcgbWFuaXB1bGF0aW9uLCByYXRoZXIgdGhhbiB0aGUgQVNUIGZyb20gUG9zdENTUyBhbmQgdGhlIHNjaGVtYXRpY3Mgc3RyaW5nIG1hbmlwdWxhdGlvblxuICogQVBJcywgYmVjYXVzZSBpdCBhbGxvd3MgdXMgdG8gcnVuIGl0IGluc2lkZSBnMyBhbmQgdG8gYXZvaWQgaW50cm9kdWNpbmcgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSBjb250ZW50IENvbnRlbnQgb2YgdGhlIGZpbGUuXG4gKiBAcGFyYW0gb2xkTWF0ZXJpYWxQcmVmaXggUHJlZml4IHdpdGggd2hpY2ggdGhlIG9sZCBNYXRlcmlhbCBpbXBvcnRzIHNob3VsZCBzdGFydC5cbiAqICAgSGFzIHRvIGVuZCB3aXRoIGEgc2xhc2guIEUuZy4gaWYgYEBpbXBvcnQgJ35AYW5ndWxhci9tYXRlcmlhbC90aGVtaW5nJ2Agc2hvdWxkIGJlXG4gKiAgIG1hdGNoZWQsIHRoZSBwcmVmaXggd291bGQgYmUgYH5AYW5ndWxhci9tYXRlcmlhbC9gLlxuICogQHBhcmFtIG9sZENka1ByZWZpeCBQcmVmaXggd2l0aCB3aGljaCB0aGUgb2xkIENESyBpbXBvcnRzIHNob3VsZCBzdGFydC5cbiAqICAgSGFzIHRvIGVuZCB3aXRoIGEgc2xhc2guIEUuZy4gaWYgYEBpbXBvcnQgJ35AYW5ndWxhci9jZGsvb3ZlcmxheSdgIHNob3VsZCBiZVxuICogICBtYXRjaGVkLCB0aGUgcHJlZml4IHdvdWxkIGJlIGB+QGFuZ3VsYXIvY2RrL2AuXG4gKiBAcGFyYW0gbmV3TWF0ZXJpYWxJbXBvcnRQYXRoIE5ldyBpbXBvcnQgdG8gdGhlIE1hdGVyaWFsIHRoZW1pbmcgQVBJIChlLmcuIGB+QGFuZ3VsYXIvbWF0ZXJpYWxgKS5cbiAqIEBwYXJhbSBuZXdDZGtJbXBvcnRQYXRoIE5ldyBpbXBvcnQgdG8gdGhlIENESyBTYXNzIEFQSXMgKGUuZy4gYH5AYW5ndWxhci9jZGtgKS5cbiAqIEBwYXJhbSBleGNsdWRlZEltcG9ydHMgUGF0dGVybiB0aGF0IGNhbiBiZSB1c2VkIHRvIGV4Y2x1ZGUgaW1wb3J0cyBmcm9tIGJlaW5nIHByb2Nlc3NlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1pZ3JhdGVGaWxlQ29udGVudChjb250ZW50OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZE1hdGVyaWFsUHJlZml4OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZENka1ByZWZpeDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdNYXRlcmlhbEltcG9ydFBhdGg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q2RrSW1wb3J0UGF0aDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYU1hdGVyaWFsU3ltYm9sczogRXh0cmFTeW1ib2xzID0ge30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVkSW1wb3J0cz86IFJlZ0V4cCk6IHN0cmluZyB7XG4gIGNvbnN0IG1hdGVyaWFsUmVzdWx0cyA9IGRldGVjdEltcG9ydHMoY29udGVudCwgb2xkTWF0ZXJpYWxQcmVmaXgsIGV4Y2x1ZGVkSW1wb3J0cyk7XG4gIGNvbnN0IGNka1Jlc3VsdHMgPSBkZXRlY3RJbXBvcnRzKGNvbnRlbnQsIG9sZENka1ByZWZpeCwgZXhjbHVkZWRJbXBvcnRzKTtcblxuICAvLyBUcnkgdG8gbWlncmF0ZSB0aGUgc3ltYm9scyBldmVuIGlmIHRoZXJlIGFyZSBubyBpbXBvcnRzLiBUaGlzIGlzIHVzZWRcbiAgLy8gdG8gY292ZXIgdGhlIGNhc2Ugd2hlcmUgdGhlIENvbXBvbmVudHMgc3ltYm9scyB3ZXJlIHVzZWQgdHJhbnNpdGl2ZWx5LlxuICBjb250ZW50ID0gbWlncmF0ZU1hdGVyaWFsU3ltYm9scyhcbiAgICAgIGNvbnRlbnQsIG5ld01hdGVyaWFsSW1wb3J0UGF0aCwgbWF0ZXJpYWxSZXN1bHRzLCBleHRyYU1hdGVyaWFsU3ltYm9scyk7XG4gIGNvbnRlbnQgPSBtaWdyYXRlQ2RrU3ltYm9scyhjb250ZW50LCBuZXdDZGtJbXBvcnRQYXRoLCBjZGtSZXN1bHRzKTtcbiAgY29udGVudCA9IHJlcGxhY2VSZW1vdmVkVmFyaWFibGVzKGNvbnRlbnQsIHJlbW92ZWRNYXRlcmlhbFZhcmlhYmxlcyk7XG5cbiAgLy8gV2UgY2FuIGFzc3VtZSB0aGF0IHRoZSBtaWdyYXRpb24gaGFzIHRha2VuIGNhcmUgb2YgYW55IENvbXBvbmVudHMgc3ltYm9scyB0aGF0IHdlcmVcbiAgLy8gaW1wb3J0ZWQgdHJhbnNpdGl2ZWx5IHNvIHdlIGNhbiBhbHdheXMgZHJvcCB0aGUgb2xkIGltcG9ydHMuIFdlIGFsc28gYXNzdW1lIHRoYXQgaW1wb3J0c1xuICAvLyB0byB0aGUgbmV3IGVudHJ5IHBvaW50cyBoYXZlIGJlZW4gYWRkZWQgYWxyZWFkeS5cbiAgaWYgKG1hdGVyaWFsUmVzdWx0cy5pbXBvcnRzLmxlbmd0aCkge1xuICAgIGNvbnRlbnQgPSByZXBsYWNlUmVtb3ZlZFZhcmlhYmxlcyhjb250ZW50LCB1bnByZWZpeGVkUmVtb3ZlZFZhcmlhYmxlcyk7XG4gICAgY29udGVudCA9IHJlbW92ZVN0cmluZ3MoY29udGVudCwgbWF0ZXJpYWxSZXN1bHRzLmltcG9ydHMpO1xuICB9XG5cbiAgaWYgKGNka1Jlc3VsdHMuaW1wb3J0cy5sZW5ndGgpIHtcbiAgICBjb250ZW50ID0gcmVtb3ZlU3RyaW5ncyhjb250ZW50LCBjZGtSZXN1bHRzLmltcG9ydHMpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQ291bnRzIHRoZSBudW1iZXIgb2YgaW1wb3J0cyB3aXRoIGEgc3BlY2lmaWMgcHJlZml4IGFuZCBleHRyYWN0cyB0aGVpciBuYW1lc3BhY2VzLlxuICogQHBhcmFtIGNvbnRlbnQgRmlsZSBjb250ZW50IGluIHdoaWNoIHRvIGxvb2sgZm9yIGltcG9ydHMuXG4gKiBAcGFyYW0gcHJlZml4IFByZWZpeCB0aGF0IHRoZSBpbXBvcnRzIHNob3VsZCBzdGFydCB3aXRoLlxuICogQHBhcmFtIGV4Y2x1ZGVkSW1wb3J0cyBQYXR0ZXJuIHRoYXQgY2FuIGJlIHVzZWQgdG8gZXhjbHVkZSBpbXBvcnRzIGZyb20gYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5mdW5jdGlvbiBkZXRlY3RJbXBvcnRzKGNvbnRlbnQ6IHN0cmluZywgcHJlZml4OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVkSW1wb3J0cz86IFJlZ0V4cCk6IERldGVjdEltcG9ydFJlc3VsdCB7XG4gIGlmIChwcmVmaXhbcHJlZml4Lmxlbmd0aCAtIDFdICE9PSAnLycpIHtcbiAgICAvLyBTb21lIG9mIHRoZSBsb2dpYyBmdXJ0aGVyIGRvd24gbWFrZXMgYXNzdW1wdGlvbnMgYWJvdXQgdGhlIGltcG9ydCBkZXB0aC5cbiAgICB0aHJvdyBFcnJvcihgUHJlZml4IFwiJHtwcmVmaXh9XCIgaGFzIHRvIGVuZCBpbiBhIHNsYXNoLmApO1xuICB9XG5cbiAgLy8gTGlzdCBvZiBgQHVzZWAgbmFtZXNwYWNlcyBmcm9tIHdoaWNoIEFuZ3VsYXIgQ0RLL01hdGVyaWFsIEFQSXMgbWF5IGJlIHJlZmVyZW5jZWQuXG4gIC8vIFNpbmNlIHdlIGtub3cgdGhhdCB0aGUgbGlicmFyeSBkb2Vzbid0IGhhdmUgYW55IG5hbWUgY29sbGlzaW9ucywgd2UgY2FuIHRyZWF0IGFsbCBvZiB0aGVzZVxuICAvLyBuYW1lc3BhY2VzIGFzIGVxdWl2YWxlbnQuXG4gIGNvbnN0IG5hbWVzcGFjZXM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGltcG9ydHM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKGBAKGltcG9ydHx1c2UpICtbJ1wiXSR7ZXNjYXBlUmVnRXhwKHByZWZpeCl9LipbJ1wiXS4qOz9cXG5gLCAnZycpO1xuICBsZXQgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGwgPSBudWxsO1xuXG4gIHdoaWxlIChtYXRjaCA9IHBhdHRlcm4uZXhlYyhjb250ZW50KSkge1xuICAgIGNvbnN0IFtmdWxsSW1wb3J0LCB0eXBlXSA9IG1hdGNoO1xuXG4gICAgaWYgKGV4Y2x1ZGVkSW1wb3J0cz8udGVzdChmdWxsSW1wb3J0KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09ICd1c2UnKSB7XG4gICAgICBjb25zdCBuYW1lc3BhY2UgPSBleHRyYWN0TmFtZXNwYWNlRnJvbVVzZVN0YXRlbWVudChmdWxsSW1wb3J0KTtcblxuICAgICAgaWYgKG5hbWVzcGFjZXMuaW5kZXhPZihuYW1lc3BhY2UpID09PSAtMSkge1xuICAgICAgICBuYW1lc3BhY2VzLnB1c2gobmFtZXNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbXBvcnRzLnB1c2goZnVsbEltcG9ydCk7XG4gIH1cblxuICByZXR1cm4ge2ltcG9ydHMsIG5hbWVzcGFjZXN9O1xufVxuXG4vKiogTWlncmF0ZXMgdGhlIE1hdGVyaWFsIHN5bWJvbHMgaW4gYSBmaWxlLiAqL1xuZnVuY3Rpb24gbWlncmF0ZU1hdGVyaWFsU3ltYm9scyhjb250ZW50OiBzdHJpbmcsIGltcG9ydFBhdGg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0ZWN0ZWRJbXBvcnRzOiBEZXRlY3RJbXBvcnRSZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhTWF0ZXJpYWxTeW1ib2xzOiBFeHRyYVN5bWJvbHMgPSB7fSk6IHN0cmluZyB7XG4gIGNvbnN0IGluaXRpYWxDb250ZW50ID0gY29udGVudDtcbiAgY29uc3QgbmFtZXNwYWNlID0gJ21hdCc7XG4gIGNvbnN0IG1peGluc1RvVXBkYXRlID0gey4uLm1hdGVyaWFsTWl4aW5zLCAuLi5leHRyYU1hdGVyaWFsU3ltYm9scy5taXhpbnN9O1xuICBjb25zdCBmdW5jdGlvbnNUb1VwZGF0ZSA9IHsuLi5tYXRlcmlhbEZ1bmN0aW9ucywgLi4uZXh0cmFNYXRlcmlhbFN5bWJvbHMuZnVuY3Rpb25zfTtcblxuICAvLyBNaWdyYXRlIHRoZSBtaXhpbnMuXG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIG1peGluc1RvVXBkYXRlLCBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcywgbWl4aW5LZXlGb3JtYXR0ZXIsXG4gICAgZ2V0TWl4aW5WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBNaWdyYXRlIHRoZSBmdW5jdGlvbnMuXG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIGZ1bmN0aW9uc1RvVXBkYXRlLCBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcyxcbiAgICBmdW5jdGlvbktleUZvcm1hdHRlciwgZ2V0RnVuY3Rpb25WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBNaWdyYXRlIHRoZSB2YXJpYWJsZXMuXG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIG1hdGVyaWFsVmFyaWFibGVzLCBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcyxcbiAgICB2YXJpYWJsZUtleUZvcm1hdHRlciwgZ2V0VmFyaWFibGVWYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICBpZiAoY29udGVudCAhPT0gaW5pdGlhbENvbnRlbnQpIHtcbiAgICAvLyBBZGQgYW4gaW1wb3J0IHRvIHRoZSBuZXcgQVBJIG9ubHkgaWYgYW55IG9mIHRoZSBBUElzIHdlcmUgYmVpbmcgdXNlZC5cbiAgICBjb250ZW50ID0gaW5zZXJ0VXNlU3RhdGVtZW50KGNvbnRlbnQsIGltcG9ydFBhdGgsIGRldGVjdGVkSW1wb3J0cy5pbXBvcnRzLCBuYW1lc3BhY2UpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKiBNaWdyYXRlcyB0aGUgQ0RLIHN5bWJvbHMgaW4gYSBmaWxlLiAqL1xuZnVuY3Rpb24gbWlncmF0ZUNka1N5bWJvbHMoY29udGVudDogc3RyaW5nLCBpbXBvcnRQYXRoOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRlY3RlZEltcG9ydHM6IERldGVjdEltcG9ydFJlc3VsdCk6IHN0cmluZyB7XG4gIGNvbnN0IGluaXRpYWxDb250ZW50ID0gY29udGVudDtcbiAgY29uc3QgbmFtZXNwYWNlID0gJ2Nkayc7XG5cbiAgLy8gTWlncmF0ZSB0aGUgbWl4aW5zLlxuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhjb250ZW50LCBjZGtNaXhpbnMsIGRldGVjdGVkSW1wb3J0cy5uYW1lc3BhY2VzLCBtaXhpbktleUZvcm1hdHRlcixcbiAgICBnZXRNaXhpblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSkpO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIHZhcmlhYmxlcy5cbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgY2RrVmFyaWFibGVzLCBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcywgdmFyaWFibGVLZXlGb3JtYXR0ZXIsXG4gICAgZ2V0VmFyaWFibGVWYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBQcmV2aW91c2x5IHRoZSBDREsgc3ltYm9scyB3ZXJlIGV4cG9zZWQgdGhyb3VnaCBgbWF0ZXJpYWwvdGhlbWluZ2AsIGJ1dCBub3cgd2UgaGF2ZSBhXG4gIC8vIGRlZGljYXRlZCBlbnRyeXBvaW50IGZvciB0aGUgQ0RLLiBPbmx5IGFkZCBhbiBpbXBvcnQgZm9yIGl0IGlmIGFueSBvZiB0aGUgc3ltYm9scyBhcmUgdXNlZC5cbiAgaWYgKGNvbnRlbnQgIT09IGluaXRpYWxDb250ZW50KSB7XG4gICAgY29udGVudCA9IGluc2VydFVzZVN0YXRlbWVudChjb250ZW50LCBpbXBvcnRQYXRoLCBkZXRlY3RlZEltcG9ydHMuaW1wb3J0cywgbmFtZXNwYWNlKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIFJlbmFtZXMgYWxsIFNhc3Mgc3ltYm9scyBpbiBhIGZpbGUgYmFzZWQgb24gYSBwcmUtZGVmaW5lZCBtYXBwaW5nLlxuICogQHBhcmFtIGNvbnRlbnQgQ29udGVudCBvZiBhIGZpbGUgdG8gYmUgbWlncmF0ZWQuXG4gKiBAcGFyYW0gbWFwcGluZyBNYXBwaW5nIGJldHdlZW4gc3ltYm9sIG5hbWVzIGFuZCB0aGVpciByZXBsYWNlbWVudHMuXG4gKiBAcGFyYW0gbmFtZXNwYWNlcyBOYW1lcyB0byBpdGVyYXRlIG92ZXIgYW5kIHBhc3MgdG8gZ2V0S2V5UGF0dGVybi5cbiAqIEBwYXJhbSBnZXRLZXlQYXR0ZXJuIEZ1bmN0aW9uIHVzZWQgdG8gdHVybiBlYWNoIG9mIHRoZSBrZXlzIGludG8gYSByZWdleC5cbiAqIEBwYXJhbSBmb3JtYXRWYWx1ZSBGb3JtYXRzIHRoZSB2YWx1ZSB0aGF0IHdpbGwgcmVwbGFjZSBhbnkgbWF0Y2hlcyBvZiB0aGUgcGF0dGVybiByZXR1cm5lZCBieVxuICogIGBnZXRLZXlQYXR0ZXJuYC5cbiAqL1xuZnVuY3Rpb24gcmVuYW1lU3ltYm9scyhjb250ZW50OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgIG1hcHBpbmc6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZXM6IHN0cmluZ1tdLFxuICAgICAgICAgICAgICAgICAgICAgICBnZXRLZXlQYXR0ZXJuOiAobmFtZXNwYWNlOiBzdHJpbmd8bnVsbCwga2V5OiBzdHJpbmcpID0+IFJlZ0V4cCxcbiAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0VmFsdWU6IChrZXk6IHN0cmluZykgPT4gc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gVGhlIG51bGwgYXQgdGhlIGVuZCBpcyBzbyB0aGF0IHdlIG1ha2Ugb25lIGxhc3QgcGFzcyB0byBjb3ZlciBub24tbmFtZXNwYWNlZCBzeW1ib2xzLlxuICBbLi4ubmFtZXNwYWNlcy5zbGljZSgpLnNvcnQoc29ydExlbmd0aERlc2NlbmRpbmcpLCBudWxsXS5mb3JFYWNoKG5hbWVzcGFjZSA9PiB7XG4gICAgLy8gTWlncmF0ZSB0aGUgbG9uZ2VzdCBrZXlzIGZpcnN0IHNvIHRoYXQgb3VyIHJlZ2V4LWJhc2VkIHJlcGxhY2VtZW50cyBkb24ndCBhY2NpZGVudGFsbHlcbiAgICAvLyBjYXB0dXJlIGtleXMgdGhhdCBjb250YWluIG90aGVyIGtleXMuIEUuZy4gYCRtYXQtYmx1ZWAgaXMgY29udGFpbmVkIHdpdGhpbiBgJG1hdC1ibHVlLWdyZXlgLlxuICAgIE9iamVjdC5rZXlzKG1hcHBpbmcpLnNvcnQoc29ydExlbmd0aERlc2NlbmRpbmcpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGNvbnN0IHBhdHRlcm4gPSBnZXRLZXlQYXR0ZXJuKG5hbWVzcGFjZSwga2V5KTtcblxuICAgICAgLy8gU2FuaXR5IGNoZWNrIHNpbmNlIG5vbi1nbG9iYWwgcmVnZXhlcyB3aWxsIG9ubHkgcmVwbGFjZSB0aGUgZmlyc3QgbWF0Y2guXG4gICAgICBpZiAocGF0dGVybi5mbGFncy5pbmRleE9mKCdnJykgPT09IC0xKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdSZXBsYWNlbWVudCBwYXR0ZXJuIG11c3QgYmUgZ2xvYmFsLicpO1xuICAgICAgfVxuXG4gICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKHBhdHRlcm4sIGZvcm1hdFZhbHVlKG1hcHBpbmdba2V5XSkpO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqIEluc2VydHMgYW4gYEB1c2VgIHN0YXRlbWVudCBpbiBhIHN0cmluZy4gKi9cbmZ1bmN0aW9uIGluc2VydFVzZVN0YXRlbWVudChjb250ZW50OiBzdHJpbmcsIGltcG9ydFBhdGg6IHN0cmluZywgaW1wb3J0c1RvSWdub3JlOiBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFdlIHdhbnQgdG8gZmluZCB0aGUgZmlyc3QgaW1wb3J0IHRoYXQgaXNuJ3QgaW4gdGhlIGxpc3Qgb2YgaWdub3JlZCBpbXBvcnRzIG9yIGZpbmQgbm90aGluZyxcbiAgLy8gYmVjYXVzZSB0aGUgaW1wb3J0cyBiZWluZyByZXBsYWNlZCBtaWdodCBiZSB0aGUgb25seSBvbmVzIGluIHRoZSBmaWxlIGFuZCB0aGV5IGNhbiBiZSBmdXJ0aGVyXG4gIC8vIGRvd24uIEFuIGVhc3kgd2F5IHRvIGRvIHRoaXMgaXMgdG8gcmVwbGFjZSB0aGUgaW1wb3J0cyB3aXRoIGEgcmFuZG9tIGNoYXJhY3RlciBhbmQgcnVuXG4gIC8vIGBpbmRleE9mYCBvbiB0aGUgcmVzdWx0LiBUaGlzIGlzbid0IHRoZSBtb3N0IGVmZmljaWVudCB3YXkgb2YgZG9pbmcgaXQsIGJ1dCBpdCdzIG1vcmUgY29tcGFjdFxuICAvLyBhbmQgaXQgYWxsb3dzIHVzIHRvIGVhc2lseSBkZWFsIHdpdGggdGhpbmdzIGxpa2UgY29tbWVudCBub2Rlcy5cbiAgY29uc3QgY29udGVudFRvU2VhcmNoID0gaW1wb3J0c1RvSWdub3JlLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnQpID0+XG4gICAgYWNjdW11bGF0b3IucmVwbGFjZShjdXJyZW50LCAn4pesJy5yZXBlYXQoY3VycmVudC5sZW5ndGgpKSwgY29udGVudCk7XG5cbiAgLy8gU2FzcyBoYXMgYSBsaW1pdGF0aW9uIHRoYXQgYWxsIGBAdXNlYCBkZWNsYXJhdGlvbnMgaGF2ZSB0byBjb21lIGJlZm9yZSBgQGltcG9ydGAgc28gd2UgaGF2ZVxuICAvLyB0byBmaW5kIHRoZSBmaXJzdCBpbXBvcnQgYW5kIGluc2VydCBiZWZvcmUgaXQuIFRlY2huaWNhbGx5IHdlIGNhbiBnZXQgYXdheSB3aXRoIGFsd2F5c1xuICAvLyBpbnNlcnRpbmcgYXQgMCwgYnV0IHRoZSBmaWxlIG1heSBzdGFydCB3aXRoIHNvbWV0aGluZyBsaWtlIGEgbGljZW5zZSBoZWFkZXIuXG4gIGNvbnN0IG5ld0ltcG9ydEluZGV4ID0gTWF0aC5tYXgoMCwgY29udGVudFRvU2VhcmNoLmluZGV4T2YoJ0BpbXBvcnQgJykpO1xuXG4gIHJldHVybiBjb250ZW50LnNsaWNlKDAsIG5ld0ltcG9ydEluZGV4KSArIGBAdXNlICcke2ltcG9ydFBhdGh9JyBhcyAke25hbWVzcGFjZX07XFxuYCArXG4gICAgICAgICBjb250ZW50LnNsaWNlKG5ld0ltcG9ydEluZGV4KTtcbn1cblxuLyoqIEZvcm1hdHMgYSBtaWdyYXRpb24ga2V5IGFzIGEgU2FzcyBtaXhpbiBpbnZvY2F0aW9uLiAqL1xuZnVuY3Rpb24gbWl4aW5LZXlGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmd8bnVsbCwgbmFtZTogc3RyaW5nKTogUmVnRXhwIHtcbiAgLy8gTm90ZSB0aGF0IGFkZGluZyBhIGAoYCBhdCB0aGUgZW5kIG9mIHRoZSBwYXR0ZXJuIHdvdWxkIGJlIG1vcmUgYWNjdXJhdGUsIGJ1dCBtaXhpblxuICAvLyBpbnZvY2F0aW9ucyBkb24ndCBuZWNlc3NhcmlseSBoYXZlIHRvIGluY2x1ZGUgdGhlIHBhcmVudGhlc2VzLiBXZSBjb3VsZCBhZGQgYFsoO11gLFxuICAvLyBidXQgdGhlbiB3ZSB3b24ndCBrbm93IHdoaWNoIGNoYXJhY3RlciB0byBpbmNsdWRlIGluIHRoZSByZXBsYWNlbWVudCBzdHJpbmcuXG4gIHJldHVybiBuZXcgUmVnRXhwKGBAaW5jbHVkZSArJHtlc2NhcGVSZWdFeHAoKG5hbWVzcGFjZSA/IG5hbWVzcGFjZSArICcuJyA6ICcnKSArIG5hbWUpfWAsICdnJyk7XG59XG5cbi8qKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmb3JtYXQgYSBTYXNzIG1peGluIHJlcGxhY2VtZW50LiAqL1xuZnVuY3Rpb24gZ2V0TWl4aW5WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZyk6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZyB7XG4gIC8vIE5vdGUgdGhhdCBhZGRpbmcgYSBgKGAgYXQgdGhlIGVuZCBvZiB0aGUgcGF0dGVybiB3b3VsZCBiZSBtb3JlIGFjY3VyYXRlLFxuICAvLyBidXQgbWl4aW4gaW52b2NhdGlvbnMgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSB0byBpbmNsdWRlIHRoZSBwYXJlbnRoZXNlcy5cbiAgcmV0dXJuIG5hbWUgPT4gYEBpbmNsdWRlICR7bmFtZXNwYWNlfS4ke25hbWV9YDtcbn1cblxuLyoqIEZvcm1hdHMgYSBtaWdyYXRpb24ga2V5IGFzIGEgU2FzcyBmdW5jdGlvbiBpbnZvY2F0aW9uLiAqL1xuZnVuY3Rpb24gZnVuY3Rpb25LZXlGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmd8bnVsbCwgbmFtZTogc3RyaW5nKTogUmVnRXhwIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKGAke25hbWVzcGFjZSA/IG5hbWVzcGFjZSArICcuJyA6ICcnfSR7bmFtZX0oYCksICdnJyk7XG59XG5cbi8qKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmb3JtYXQgYSBTYXNzIGZ1bmN0aW9uIHJlcGxhY2VtZW50LiAqL1xuZnVuY3Rpb24gZ2V0RnVuY3Rpb25WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZyk6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZyB7XG4gIHJldHVybiBuYW1lID0+IGAke25hbWVzcGFjZX0uJHtuYW1lfShgO1xufVxuXG4vKiogRm9ybWF0cyBhIG1pZ3JhdGlvbiBrZXkgYXMgYSBTYXNzIHZhcmlhYmxlLiAqL1xuZnVuY3Rpb24gdmFyaWFibGVLZXlGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmd8bnVsbCwgbmFtZTogc3RyaW5nKTogUmVnRXhwIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKGAke25hbWVzcGFjZSA/IG5hbWVzcGFjZSArICcuJyA6ICcnfSQke25hbWV9YCksICdnJyk7XG59XG5cbi8qKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmb3JtYXQgYSBTYXNzIHZhcmlhYmxlIHJlcGxhY2VtZW50LiAqL1xuZnVuY3Rpb24gZ2V0VmFyaWFibGVWYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZyk6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZyB7XG4gIHJldHVybiBuYW1lID0+IGAke25hbWVzcGFjZX0uJCR7bmFtZX1gO1xufVxuXG4vKiogRXNjYXBlcyBzcGVjaWFsIHJlZ2V4IGNoYXJhY3RlcnMgaW4gYSBzdHJpbmcuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbLiorP149IToke30oKXxbXFxdXFwvXFxcXF0pL2csICdcXFxcJDEnKTtcbn1cblxuLyoqIFVzZWQgd2l0aCBgQXJyYXkucHJvdG90eXBlLnNvcnRgIHRvIG9yZGVyIHN0cmluZ3MgaW4gZGVzY2VuZGluZyBsZW5ndGguICovXG5mdW5jdGlvbiBzb3J0TGVuZ3RoRGVzY2VuZGluZyhhOiBzdHJpbmcsIGI6IHN0cmluZykge1xuICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcbn1cblxuLyoqIFJlbW92ZXMgYWxsIHN0cmluZ3MgZnJvbSBhbm90aGVyIHN0cmluZy4gKi9cbmZ1bmN0aW9uIHJlbW92ZVN0cmluZ3MoY29udGVudDogc3RyaW5nLCB0b1JlbW92ZTogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gdG9SZW1vdmVcbiAgICAucmVkdWNlKChhY2N1bXVsYXRvciwgY3VycmVudCkgPT4gYWNjdW11bGF0b3IucmVwbGFjZShjdXJyZW50LCAnJyksIGNvbnRlbnQpXG4gICAgLnJlcGxhY2UoL15cXHMrLywgJycpO1xufVxuXG4vKiogUGFyc2VzIG91dCB0aGUgbmFtZXNwYWNlIGZyb20gYSBTYXNzIGBAdXNlYCBzdGF0ZW1lbnQuICovXG5mdW5jdGlvbiBleHRyYWN0TmFtZXNwYWNlRnJvbVVzZVN0YXRlbWVudChmdWxsSW1wb3J0OiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBjbG9zZVF1b3RlSW5kZXggPSBNYXRoLm1heChmdWxsSW1wb3J0Lmxhc3RJbmRleE9mKGBcImApLCBmdWxsSW1wb3J0Lmxhc3RJbmRleE9mKGAnYCkpO1xuXG4gIGlmIChjbG9zZVF1b3RlSW5kZXggPiAtMSkge1xuICAgIGNvbnN0IGFzRXhwcmVzc2lvbiA9ICdhcyAnO1xuICAgIGNvbnN0IGFzSW5kZXggPSBmdWxsSW1wb3J0LmluZGV4T2YoYXNFeHByZXNzaW9uLCBjbG9zZVF1b3RlSW5kZXgpO1xuXG4gICAgLy8gSWYgd2UgZm91bmQgYW4gYCBhcyBgIGV4cHJlc3Npb24sIHdlIGNvbnNpZGVyIHRoZSByZXN0IG9mIHRoZSB0ZXh0IGFzIHRoZSBuYW1lc3BhY2UuXG4gICAgaWYgKGFzSW5kZXggPiAtMSkge1xuICAgICAgcmV0dXJuIGZ1bGxJbXBvcnQuc2xpY2UoYXNJbmRleCArIGFzRXhwcmVzc2lvbi5sZW5ndGgpLnNwbGl0KCc7JylbMF0udHJpbSgpO1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSB0aGUgbmFtZXNwYWNlIGlzIHRoZSBuYW1lIG9mIHRoZSBmaWxlIHRoYXQgaXMgYmVpbmcgaW1wb3J0ZWQuXG4gICAgY29uc3QgbGFzdFNsYXNoSW5kZXggPSBmdWxsSW1wb3J0Lmxhc3RJbmRleE9mKCcvJywgY2xvc2VRdW90ZUluZGV4KTtcblxuICAgIGlmIChsYXN0U2xhc2hJbmRleCA+IC0xKSB7XG4gICAgICBjb25zdCBmaWxlTmFtZSA9IGZ1bGxJbXBvcnQuc2xpY2UobGFzdFNsYXNoSW5kZXggKyAxLCBjbG9zZVF1b3RlSW5kZXgpXG4gICAgICAgIC8vIFNhc3MgYWxsb3dzIGZvciBsZWFkaW5nIHVuZGVyc2NvcmVzIHRvIGJlIG9taXR0ZWQgYW5kIGl0IHRlY2huaWNhbGx5IHN1cHBvcnRzIC5zY3NzLlxuICAgICAgICAucmVwbGFjZSgvXl98KFxcLmltcG9ydCk/XFwuc2NzcyR8XFwuaW1wb3J0JC9nLCAnJyk7XG5cbiAgICAgIC8vIFNhc3MgaWdub3JlcyBgL2luZGV4YCBhbmQgaW5mZXJzIHRoZSBuYW1lc3BhY2UgYXMgdGhlIG5leHQgc2VnbWVudCBpbiB0aGUgcGF0aC5cbiAgICAgIGlmIChmaWxlTmFtZSA9PT0gJ2luZGV4Jykge1xuICAgICAgICBjb25zdCBuZXh0U2xhc2hJbmRleCA9IGZ1bGxJbXBvcnQubGFzdEluZGV4T2YoJy8nLCBsYXN0U2xhc2hJbmRleCAtIDEpO1xuXG4gICAgICAgIGlmIChuZXh0U2xhc2hJbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bGxJbXBvcnQuc2xpY2UobmV4dFNsYXNoSW5kZXggKyAxLCBsYXN0U2xhc2hJbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmaWxlTmFtZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGV4dHJhY3QgbmFtZXNwYWNlIGZyb20gaW1wb3J0IFwiJHtmdWxsSW1wb3J0fVwiLmApO1xufVxuXG4vKipcbiAqIFJlcGxhY2VzIHZhcmlhYmxlcyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkIHdpdGggdGhlaXIgdmFsdWVzLlxuICogQHBhcmFtIGNvbnRlbnQgQ29udGVudCBvZiB0aGUgZmlsZSB0byBiZSBtaWdyYXRlZC5cbiAqIEBwYXJhbSB2YXJpYWJsZXMgTWFwcGluZyBiZXR3ZWVuIHZhcmlhYmxlIG5hbWVzIGFuZCB0aGVpciB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHJlcGxhY2VSZW1vdmVkVmFyaWFibGVzKGNvbnRlbnQ6IHN0cmluZywgdmFyaWFibGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogc3RyaW5nIHtcbiAgT2JqZWN0LmtleXModmFyaWFibGVzKS5zb3J0KHNvcnRMZW5ndGhEZXNjZW5kaW5nKS5mb3JFYWNoKHZhcmlhYmxlTmFtZSA9PiB7XG4gICAgLy8gTm90ZSB0aGF0IHRoZSBwYXR0ZXJuIHVzZXMgYSBuZWdhdGl2ZSBsb29rYWhlYWQgdG8gZXhjbHVkZVxuICAgIC8vIHZhcmlhYmxlIGFzc2lnbm1lbnRzLCBiZWNhdXNlIHRoZXkgY2FuJ3QgYmUgbWlncmF0ZWQuXG4gICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBcXFxcJCR7ZXNjYXBlUmVnRXhwKHZhcmlhYmxlTmFtZSl9KD8hXFxcXHMrOnw6KWAsICdnJyk7XG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZShyZWdleCwgdmFyaWFibGVzW3ZhcmlhYmxlTmFtZV0pO1xuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cbiJdfQ==