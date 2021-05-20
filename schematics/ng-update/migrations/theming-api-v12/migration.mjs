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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvdGhlbWluZy1hcGktdjEyL21pZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCxxQ0FRa0I7QUFlbEI7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FBQyxPQUFlLEVBQ2YsaUJBQXlCLEVBQ3pCLFlBQW9CLEVBQ3BCLHFCQUE2QixFQUM3QixnQkFBd0IsRUFDeEIsdUJBQXFDLEVBQUUsRUFDdkMsZUFBd0I7SUFDekQsTUFBTSxlQUFlLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNuRixNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsQ0FBQztJQUV6RSx3RUFBd0U7SUFDeEUseUVBQXlFO0lBQ3pFLE9BQU8sR0FBRyxzQkFBc0IsQ0FDNUIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLGVBQWUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQzNFLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDbkUsT0FBTyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxpQ0FBd0IsQ0FBQyxDQUFDO0lBRXJFLHNGQUFzRjtJQUN0RiwyRkFBMkY7SUFDM0YsbURBQW1EO0lBQ25ELElBQUksZUFBZSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDbEMsT0FBTyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxtQ0FBMEIsQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxPQUFPLENBQUMs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QUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7UUFDdkUsNkRBQTZEO1FBQzdELHdEQUF3RDtRQUN4RCxNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLFlBQVksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdFLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgbWF0ZXJpYWxNaXhpbnMsXG4gIG1hdGVyaWFsRnVuY3Rpb25zLFxuICBtYXRlcmlhbFZhcmlhYmxlcyxcbiAgY2RrTWl4aW5zLFxuICBjZGtWYXJpYWJsZXMsXG4gIHJlbW92ZWRNYXRlcmlhbFZhcmlhYmxlcyxcbiAgdW5wcmVmaXhlZFJlbW92ZWRWYXJpYWJsZXNcbn0gZnJvbSAnLi9jb25maWcnO1xuXG4vKiogVGhlIHJlc3VsdCBvZiBhIHNlYXJjaCBmb3IgaW1wb3J0cyBhbmQgbmFtZXNwYWNlcyBpbiBhIGZpbGUuICovXG5pbnRlcmZhY2UgRGV0ZWN0SW1wb3J0UmVzdWx0IHtcbiAgaW1wb3J0czogc3RyaW5nW107XG4gIG5hbWVzcGFjZXM6IHN0cmluZ1tdO1xufVxuXG4vKiogQWRkaXRpb24gbWl4aW4gYW5kIGZ1bmN0aW9uIG5hbWVzIHRoYXQgY2FuIGJlIHVwZGF0ZWQgd2hlbiBpbnZva2luZyBtaWdyYXRpb24gZGlyZWN0bHkuICovXG5pbnRlcmZhY2UgRXh0cmFTeW1ib2xzIHtcbiAgbWl4aW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgZnVuY3Rpb25zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgdmFyaWFibGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn1cblxuLyoqXG4gKiBNaWdyYXRlcyB0aGUgY29udGVudCBvZiBhIGZpbGUgdG8gdGhlIG5ldyB0aGVtaW5nIEFQSS4gTm90ZSB0aGF0IHRoaXMgbWlncmF0aW9uIGlzIHVzaW5nIHBsYWluXG4gKiBzdHJpbmcgbWFuaXB1bGF0aW9uLCByYXRoZXIgdGhhbiB0aGUgQVNUIGZyb20gUG9zdENTUyBhbmQgdGhlIHNjaGVtYXRpY3Mgc3RyaW5nIG1hbmlwdWxhdGlvblxuICogQVBJcywgYmVjYXVzZSBpdCBhbGxvd3MgdXMgdG8gcnVuIGl0IGluc2lkZSBnMyBhbmQgdG8gYXZvaWQgaW50cm9kdWNpbmcgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSBjb250ZW50IENvbnRlbnQgb2YgdGhlIGZpbGUuXG4gKiBAcGFyYW0gb2xkTWF0ZXJpYWxQcmVmaXggUHJlZml4IHdpdGggd2hpY2ggdGhlIG9sZCBNYXRlcmlhbCBpbXBvcnRzIHNob3VsZCBzdGFydC5cbiAqICAgSGFzIHRvIGVuZCB3aXRoIGEgc2xhc2guIEUuZy4gaWYgYEBpbXBvcnQgJ35AYW5ndWxhci9tYXRlcmlhbC90aGVtaW5nJ2Agc2hvdWxkIGJlXG4gKiAgIG1hdGNoZWQsIHRoZSBwcmVmaXggd291bGQgYmUgYH5AYW5ndWxhci9tYXRlcmlhbC9gLlxuICogQHBhcmFtIG9sZENka1ByZWZpeCBQcmVmaXggd2l0aCB3aGljaCB0aGUgb2xkIENESyBpbXBvcnRzIHNob3VsZCBzdGFydC5cbiAqICAgSGFzIHRvIGVuZCB3aXRoIGEgc2xhc2guIEUuZy4gaWYgYEBpbXBvcnQgJ35AYW5ndWxhci9jZGsvb3ZlcmxheSdgIHNob3VsZCBiZVxuICogICBtYXRjaGVkLCB0aGUgcHJlZml4IHdvdWxkIGJlIGB+QGFuZ3VsYXIvY2RrL2AuXG4gKiBAcGFyYW0gbmV3TWF0ZXJpYWxJbXBvcnRQYXRoIE5ldyBpbXBvcnQgdG8gdGhlIE1hdGVyaWFsIHRoZW1pbmcgQVBJIChlLmcuIGB+QGFuZ3VsYXIvbWF0ZXJpYWxgKS5cbiAqIEBwYXJhbSBuZXdDZGtJbXBvcnRQYXRoIE5ldyBpbXBvcnQgdG8gdGhlIENESyBTYXNzIEFQSXMgKGUuZy4gYH5AYW5ndWxhci9jZGtgKS5cbiAqIEBwYXJhbSBleGNsdWRlZEltcG9ydHMgUGF0dGVybiB0aGF0IGNhbiBiZSB1c2VkIHRvIGV4Y2x1ZGUgaW1wb3J0cyBmcm9tIGJlaW5nIHByb2Nlc3NlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1pZ3JhdGVGaWxlQ29udGVudChjb250ZW50OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZE1hdGVyaWFsUHJlZml4OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZENka1ByZWZpeDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdNYXRlcmlhbEltcG9ydFBhdGg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q2RrSW1wb3J0UGF0aDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYU1hdGVyaWFsU3ltYm9sczogRXh0cmFTeW1ib2xzID0ge30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVkSW1wb3J0cz86IFJlZ0V4cCk6IHN0cmluZyB7XG4gIGNvbnN0IG1hdGVyaWFsUmVzdWx0cyA9IGRldGVjdEltcG9ydHMoY29udGVudCwgb2xkTWF0ZXJpYWxQcmVmaXgsIGV4Y2x1ZGVkSW1wb3J0cyk7XG4gIGNvbnN0IGNka1Jlc3VsdHMgPSBkZXRlY3RJbXBvcnRzKGNvbnRlbnQsIG9sZENka1ByZWZpeCwgZXhjbHVkZWRJbXBvcnRzKTtcblxuICAvLyBUcnkgdG8gbWlncmF0ZSB0aGUgc3ltYm9scyBldmVuIGlmIHRoZXJlIGFyZSBubyBpbXBvcnRzLiBUaGlzIGlzIHVzZWRcbiAgLy8gdG8gY292ZXIgdGhlIGNhc2Ugd2hlcmUgdGhlIENvbXBvbmVudHMgc3ltYm9scyB3ZXJlIHVzZWQgdHJhbnNpdGl2ZWx5LlxuICBjb250ZW50ID0gbWlncmF0ZU1hdGVyaWFsU3ltYm9scyhcbiAgICAgIGNvbnRlbnQsIG5ld01hdGVyaWFsSW1wb3J0UGF0aCwgbWF0ZXJpYWxSZXN1bHRzLCBleHRyYU1hdGVyaWFsU3ltYm9scyk7XG4gIGNvbnRlbnQgPSBtaWdyYXRlQ2RrU3ltYm9scyhjb250ZW50LCBuZXdDZGtJbXBvcnRQYXRoLCBjZGtSZXN1bHRzKTtcbiAgY29udGVudCA9IHJlcGxhY2VSZW1vdmVkVmFyaWFibGVzKGNvbnRlbnQsIHJlbW92ZWRNYXRlcmlhbFZhcmlhYmxlcyk7XG5cbiAgLy8gV2UgY2FuIGFzc3VtZSB0aGF0IHRoZSBtaWdyYXRpb24gaGFzIHRha2VuIGNhcmUgb2YgYW55IENvbXBvbmVudHMgc3ltYm9scyB0aGF0IHdlcmVcbiAgLy8gaW1wb3J0ZWQgdHJhbnNpdGl2ZWx5IHNvIHdlIGNhbiBhbHdheXMgZHJvcCB0aGUgb2xkIGltcG9ydHMuIFdlIGFsc28gYXNzdW1lIHRoYXQgaW1wb3J0c1xuICAvLyB0byB0aGUgbmV3IGVudHJ5IHBvaW50cyBoYXZlIGJlZW4gYWRkZWQgYWxyZWFkeS5cbiAgaWYgKG1hdGVyaWFsUmVzdWx0cy5pbXBvcnRzLmxlbmd0aCkge1xuICAgIGNvbnRlbnQgPSByZXBsYWNlUmVtb3ZlZFZhcmlhYmxlcyhjb250ZW50LCB1bnByZWZpeGVkUmVtb3ZlZFZhcmlhYmxlcyk7XG4gICAgY29udGVudCA9IHJlbW92ZVN0cmluZ3MoY29udGVudCwgbWF0ZXJpYWxSZXN1bHRzLmltcG9ydHMpO1xuICB9XG5cbiAgaWYgKGNka1Jlc3VsdHMuaW1wb3J0cy5sZW5ndGgpIHtcbiAgICBjb250ZW50ID0gcmVtb3ZlU3RyaW5ncyhjb250ZW50LCBjZGtSZXN1bHRzLmltcG9ydHMpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQ291bnRzIHRoZSBudW1iZXIgb2YgaW1wb3J0cyB3aXRoIGEgc3BlY2lmaWMgcHJlZml4IGFuZCBleHRyYWN0cyB0aGVpciBuYW1lc3BhY2VzLlxuICogQHBhcmFtIGNvbnRlbnQgRmlsZSBjb250ZW50IGluIHdoaWNoIHRvIGxvb2sgZm9yIGltcG9ydHMuXG4gKiBAcGFyYW0gcHJlZml4IFByZWZpeCB0aGF0IHRoZSBpbXBvcnRzIHNob3VsZCBzdGFydCB3aXRoLlxuICogQHBhcmFtIGV4Y2x1ZGVkSW1wb3J0cyBQYXR0ZXJuIHRoYXQgY2FuIGJlIHVzZWQgdG8gZXhjbHVkZSBpbXBvcnRzIGZyb20gYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5mdW5jdGlvbiBkZXRlY3RJbXBvcnRzKGNvbnRlbnQ6IHN0cmluZywgcHJlZml4OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVkSW1wb3J0cz86IFJlZ0V4cCk6IERldGVjdEltcG9ydFJlc3VsdCB7XG4gIGlmIChwcmVmaXhbcHJlZml4Lmxlbmd0aCAtIDFdICE9PSAnLycpIHtcbiAgICAvLyBTb21lIG9mIHRoZSBsb2dpYyBmdXJ0aGVyIGRvd24gbWFrZXMgYXNzdW1wdGlvbnMgYWJvdXQgdGhlIGltcG9ydCBkZXB0aC5cbiAgICB0aHJvdyBFcnJvcihgUHJlZml4IFwiJHtwcmVmaXh9XCIgaGFzIHRvIGVuZCBpbiBhIHNsYXNoLmApO1xuICB9XG5cbiAgLy8gTGlzdCBvZiBgQHVzZWAgbmFtZXNwYWNlcyBmcm9tIHdoaWNoIEFuZ3VsYXIgQ0RLL01hdGVyaWFsIEFQSXMgbWF5IGJlIHJlZmVyZW5jZWQuXG4gIC8vIFNpbmNlIHdlIGtub3cgdGhhdCB0aGUgbGlicmFyeSBkb2Vzbid0IGhhdmUgYW55IG5hbWUgY29sbGlzaW9ucywgd2UgY2FuIHRyZWF0IGFsbCBvZiB0aGVzZVxuICAvLyBuYW1lc3BhY2VzIGFzIGVxdWl2YWxlbnQuXG4gIGNvbnN0IG5hbWVzcGFjZXM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGltcG9ydHM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKGBAKGltcG9ydHx1c2UpICtbJ1wiXSR7ZXNjYXBlUmVnRXhwKHByZWZpeCl9LipbJ1wiXS4qOz9cXG5gLCAnZycpO1xuICBsZXQgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGwgPSBudWxsO1xuXG4gIHdoaWxlIChtYXRjaCA9IHBhdHRlcm4uZXhlYyhjb250ZW50KSkge1xuICAgIGNvbnN0IFtmdWxsSW1wb3J0LCB0eXBlXSA9IG1hdGNoO1xuXG4gICAgaWYgKGV4Y2x1ZGVkSW1wb3J0cz8udGVzdChmdWxsSW1wb3J0KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09ICd1c2UnKSB7XG4gICAgICBjb25zdCBuYW1lc3BhY2UgPSBleHRyYWN0TmFtZXNwYWNlRnJvbVVzZVN0YXRlbWVudChmdWxsSW1wb3J0KTtcblxuICAgICAgaWYgKG5hbWVzcGFjZXMuaW5kZXhPZihuYW1lc3BhY2UpID09PSAtMSkge1xuICAgICAgICBuYW1lc3BhY2VzLnB1c2gobmFtZXNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbXBvcnRzLnB1c2goZnVsbEltcG9ydCk7XG4gIH1cblxuICByZXR1cm4ge2ltcG9ydHMsIG5hbWVzcGFjZXN9O1xufVxuXG4vKiogTWlncmF0ZXMgdGhlIE1hdGVyaWFsIHN5bWJvbHMgaW4gYSBmaWxlLiAqL1xuZnVuY3Rpb24gbWlncmF0ZU1hdGVyaWFsU3ltYm9scyhjb250ZW50OiBzdHJpbmcsIGltcG9ydFBhdGg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0ZWN0ZWRJbXBvcnRzOiBEZXRlY3RJbXBvcnRSZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhTWF0ZXJpYWxTeW1ib2xzOiBFeHRyYVN5bWJvbHMgPSB7fSk6IHN0cmluZyB7XG4gIGNvbnN0IGluaXRpYWxDb250ZW50ID0gY29udGVudDtcbiAgY29uc3QgbmFtZXNwYWNlID0gJ21hdCc7XG5cbiAgLy8gTWlncmF0ZSB0aGUgbWl4aW5zLlxuICBjb25zdCBtaXhpbnNUb1VwZGF0ZSA9IHsuLi5tYXRlcmlhbE1peGlucywgLi4uZXh0cmFNYXRlcmlhbFN5bWJvbHMubWl4aW5zfTtcbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgbWl4aW5zVG9VcGRhdGUsIGRldGVjdGVkSW1wb3J0cy5uYW1lc3BhY2VzLCBtaXhpbktleUZvcm1hdHRlcixcbiAgICBnZXRNaXhpblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSkpO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIGZ1bmN0aW9ucy5cbiAgY29uc3QgZnVuY3Rpb25zVG9VcGRhdGUgPSB7Li4ubWF0ZXJpYWxGdW5jdGlvbnMsIC4uLmV4dHJhTWF0ZXJpYWxTeW1ib2xzLmZ1bmN0aW9uc307XG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIGZ1bmN0aW9uc1RvVXBkYXRlLCBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcyxcbiAgICBmdW5jdGlvbktleUZvcm1hdHRlciwgZ2V0RnVuY3Rpb25WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBNaWdyYXRlIHRoZSB2YXJpYWJsZXMuXG4gIGNvbnN0IHZhcmlhYmxlc1RvVXBkYXRlID0gey4uLm1hdGVyaWFsVmFyaWFibGVzLCAuLi5leHRyYU1hdGVyaWFsU3ltYm9scy52YXJpYWJsZXN9O1xuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhjb250ZW50LCB2YXJpYWJsZXNUb1VwZGF0ZSwgZGV0ZWN0ZWRJbXBvcnRzLm5hbWVzcGFjZXMsXG4gICAgdmFyaWFibGVLZXlGb3JtYXR0ZXIsIGdldFZhcmlhYmxlVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlKSk7XG5cbiAgaWYgKGNvbnRlbnQgIT09IGluaXRpYWxDb250ZW50KSB7XG4gICAgLy8gQWRkIGFuIGltcG9ydCB0byB0aGUgbmV3IEFQSSBvbmx5IGlmIGFueSBvZiB0aGUgQVBJcyB3ZXJlIGJlaW5nIHVzZWQuXG4gICAgY29udGVudCA9IGluc2VydFVzZVN0YXRlbWVudChjb250ZW50LCBpbXBvcnRQYXRoLCBkZXRlY3RlZEltcG9ydHMuaW1wb3J0cywgbmFtZXNwYWNlKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKiogTWlncmF0ZXMgdGhlIENESyBzeW1ib2xzIGluIGEgZmlsZS4gKi9cbmZ1bmN0aW9uIG1pZ3JhdGVDZGtTeW1ib2xzKGNvbnRlbnQ6IHN0cmluZywgaW1wb3J0UGF0aDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0ZWN0ZWRJbXBvcnRzOiBEZXRlY3RJbXBvcnRSZXN1bHQpOiBzdHJpbmcge1xuICBjb25zdCBpbml0aWFsQ29udGVudCA9IGNvbnRlbnQ7XG4gIGNvbnN0IG5hbWVzcGFjZSA9ICdjZGsnO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIG1peGlucy5cbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgY2RrTWl4aW5zLCBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcywgbWl4aW5LZXlGb3JtYXR0ZXIsXG4gICAgZ2V0TWl4aW5WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBNaWdyYXRlIHRoZSB2YXJpYWJsZXMuXG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIGNka1ZhcmlhYmxlcywgZGV0ZWN0ZWRJbXBvcnRzLm5hbWVzcGFjZXMsIHZhcmlhYmxlS2V5Rm9ybWF0dGVyLFxuICAgIGdldFZhcmlhYmxlVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlKSk7XG5cbiAgLy8gUHJldmlvdXNseSB0aGUgQ0RLIHN5bWJvbHMgd2VyZSBleHBvc2VkIHRocm91Z2ggYG1hdGVyaWFsL3RoZW1pbmdgLCBidXQgbm93IHdlIGhhdmUgYVxuICAvLyBkZWRpY2F0ZWQgZW50cnlwb2ludCBmb3IgdGhlIENESy4gT25seSBhZGQgYW4gaW1wb3J0IGZvciBpdCBpZiBhbnkgb2YgdGhlIHN5bWJvbHMgYXJlIHVzZWQuXG4gIGlmIChjb250ZW50ICE9PSBpbml0aWFsQ29udGVudCkge1xuICAgIGNvbnRlbnQgPSBpbnNlcnRVc2VTdGF0ZW1lbnQoY29udGVudCwgaW1wb3J0UGF0aCwgZGV0ZWN0ZWRJbXBvcnRzLmltcG9ydHMsIG5hbWVzcGFjZSk7XG4gIH1cblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBSZW5hbWVzIGFsbCBTYXNzIHN5bWJvbHMgaW4gYSBmaWxlIGJhc2VkIG9uIGEgcHJlLWRlZmluZWQgbWFwcGluZy5cbiAqIEBwYXJhbSBjb250ZW50IENvbnRlbnQgb2YgYSBmaWxlIHRvIGJlIG1pZ3JhdGVkLlxuICogQHBhcmFtIG1hcHBpbmcgTWFwcGluZyBiZXR3ZWVuIHN5bWJvbCBuYW1lcyBhbmQgdGhlaXIgcmVwbGFjZW1lbnRzLlxuICogQHBhcmFtIG5hbWVzcGFjZXMgTmFtZXMgdG8gaXRlcmF0ZSBvdmVyIGFuZCBwYXNzIHRvIGdldEtleVBhdHRlcm4uXG4gKiBAcGFyYW0gZ2V0S2V5UGF0dGVybiBGdW5jdGlvbiB1c2VkIHRvIHR1cm4gZWFjaCBvZiB0aGUga2V5cyBpbnRvIGEgcmVnZXguXG4gKiBAcGFyYW0gZm9ybWF0VmFsdWUgRm9ybWF0cyB0aGUgdmFsdWUgdGhhdCB3aWxsIHJlcGxhY2UgYW55IG1hdGNoZXMgb2YgdGhlIHBhdHRlcm4gcmV0dXJuZWQgYnlcbiAqICBgZ2V0S2V5UGF0dGVybmAuXG4gKi9cbmZ1bmN0aW9uIHJlbmFtZVN5bWJvbHMoY29udGVudDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICBtYXBwaW5nOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2VzOiBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgZ2V0S2V5UGF0dGVybjogKG5hbWVzcGFjZTogc3RyaW5nfG51bGwsIGtleTogc3RyaW5nKSA9PiBSZWdFeHAsXG4gICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdFZhbHVlOiAoa2V5OiBzdHJpbmcpID0+IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFRoZSBudWxsIGF0IHRoZSBlbmQgaXMgc28gdGhhdCB3ZSBtYWtlIG9uZSBsYXN0IHBhc3MgdG8gY292ZXIgbm9uLW5hbWVzcGFjZWQgc3ltYm9scy5cbiAgWy4uLm5hbWVzcGFjZXMuc2xpY2UoKS5zb3J0KHNvcnRMZW5ndGhEZXNjZW5kaW5nKSwgbnVsbF0uZm9yRWFjaChuYW1lc3BhY2UgPT4ge1xuICAgIC8vIE1pZ3JhdGUgdGhlIGxvbmdlc3Qga2V5cyBmaXJzdCBzbyB0aGF0IG91ciByZWdleC1iYXNlZCByZXBsYWNlbWVudHMgZG9uJ3QgYWNjaWRlbnRhbGx5XG4gICAgLy8gY2FwdHVyZSBrZXlzIHRoYXQgY29udGFpbiBvdGhlciBrZXlzLiBFLmcuIGAkbWF0LWJsdWVgIGlzIGNvbnRhaW5lZCB3aXRoaW4gYCRtYXQtYmx1ZS1ncmV5YC5cbiAgICBPYmplY3Qua2V5cyhtYXBwaW5nKS5zb3J0KHNvcnRMZW5ndGhEZXNjZW5kaW5nKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCBwYXR0ZXJuID0gZ2V0S2V5UGF0dGVybihuYW1lc3BhY2UsIGtleSk7XG5cbiAgICAgIC8vIFNhbml0eSBjaGVjayBzaW5jZSBub24tZ2xvYmFsIHJlZ2V4ZXMgd2lsbCBvbmx5IHJlcGxhY2UgdGhlIGZpcnN0IG1hdGNoLlxuICAgICAgaWYgKHBhdHRlcm4uZmxhZ3MuaW5kZXhPZignZycpID09PSAtMSkge1xuICAgICAgICB0aHJvdyBFcnJvcignUmVwbGFjZW1lbnQgcGF0dGVybiBtdXN0IGJlIGdsb2JhbC4nKTtcbiAgICAgIH1cblxuICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZShwYXR0ZXJuLCBmb3JtYXRWYWx1ZShtYXBwaW5nW2tleV0pKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKiBJbnNlcnRzIGFuIGBAdXNlYCBzdGF0ZW1lbnQgaW4gYSBzdHJpbmcuICovXG5mdW5jdGlvbiBpbnNlcnRVc2VTdGF0ZW1lbnQoY29udGVudDogc3RyaW5nLCBpbXBvcnRQYXRoOiBzdHJpbmcsIGltcG9ydHNUb0lnbm9yZTogc3RyaW5nW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBXZSB3YW50IHRvIGZpbmQgdGhlIGZpcnN0IGltcG9ydCB0aGF0IGlzbid0IGluIHRoZSBsaXN0IG9mIGlnbm9yZWQgaW1wb3J0cyBvciBmaW5kIG5vdGhpbmcsXG4gIC8vIGJlY2F1c2UgdGhlIGltcG9ydHMgYmVpbmcgcmVwbGFjZWQgbWlnaHQgYmUgdGhlIG9ubHkgb25lcyBpbiB0aGUgZmlsZSBhbmQgdGhleSBjYW4gYmUgZnVydGhlclxuICAvLyBkb3duLiBBbiBlYXN5IHdheSB0byBkbyB0aGlzIGlzIHRvIHJlcGxhY2UgdGhlIGltcG9ydHMgd2l0aCBhIHJhbmRvbSBjaGFyYWN0ZXIgYW5kIHJ1blxuICAvLyBgaW5kZXhPZmAgb24gdGhlIHJlc3VsdC4gVGhpcyBpc24ndCB0aGUgbW9zdCBlZmZpY2llbnQgd2F5IG9mIGRvaW5nIGl0LCBidXQgaXQncyBtb3JlIGNvbXBhY3RcbiAgLy8gYW5kIGl0IGFsbG93cyB1cyB0byBlYXNpbHkgZGVhbCB3aXRoIHRoaW5ncyBsaWtlIGNvbW1lbnQgbm9kZXMuXG4gIGNvbnN0IGNvbnRlbnRUb1NlYXJjaCA9IGltcG9ydHNUb0lnbm9yZS5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBjdXJyZW50KSA9PlxuICAgIGFjY3VtdWxhdG9yLnJlcGxhY2UoY3VycmVudCwgJ+KXrCcucmVwZWF0KGN1cnJlbnQubGVuZ3RoKSksIGNvbnRlbnQpO1xuXG4gIC8vIFNhc3MgaGFzIGEgbGltaXRhdGlvbiB0aGF0IGFsbCBgQHVzZWAgZGVjbGFyYXRpb25zIGhhdmUgdG8gY29tZSBiZWZvcmUgYEBpbXBvcnRgIHNvIHdlIGhhdmVcbiAgLy8gdG8gZmluZCB0aGUgZmlyc3QgaW1wb3J0IGFuZCBpbnNlcnQgYmVmb3JlIGl0LiBUZWNobmljYWxseSB3ZSBjYW4gZ2V0IGF3YXkgd2l0aCBhbHdheXNcbiAgLy8gaW5zZXJ0aW5nIGF0IDAsIGJ1dCB0aGUgZmlsZSBtYXkgc3RhcnQgd2l0aCBzb21ldGhpbmcgbGlrZSBhIGxpY2Vuc2UgaGVhZGVyLlxuICBjb25zdCBuZXdJbXBvcnRJbmRleCA9IE1hdGgubWF4KDAsIGNvbnRlbnRUb1NlYXJjaC5pbmRleE9mKCdAaW1wb3J0ICcpKTtcblxuICByZXR1cm4gY29udGVudC5zbGljZSgwLCBuZXdJbXBvcnRJbmRleCkgKyBgQHVzZSAnJHtpbXBvcnRQYXRofScgYXMgJHtuYW1lc3BhY2V9O1xcbmAgK1xuICAgICAgICAgY29udGVudC5zbGljZShuZXdJbXBvcnRJbmRleCk7XG59XG5cbi8qKiBGb3JtYXRzIGEgbWlncmF0aW9uIGtleSBhcyBhIFNhc3MgbWl4aW4gaW52b2NhdGlvbi4gKi9cbmZ1bmN0aW9uIG1peGluS2V5Rm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nfG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIC8vIE5vdGUgdGhhdCBhZGRpbmcgYSBgKGAgYXQgdGhlIGVuZCBvZiB0aGUgcGF0dGVybiB3b3VsZCBiZSBtb3JlIGFjY3VyYXRlLCBidXQgbWl4aW5cbiAgLy8gaW52b2NhdGlvbnMgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSB0byBpbmNsdWRlIHRoZSBwYXJlbnRoZXNlcy4gV2UgY291bGQgYWRkIGBbKDtdYCxcbiAgLy8gYnV0IHRoZW4gd2Ugd29uJ3Qga25vdyB3aGljaCBjaGFyYWN0ZXIgdG8gaW5jbHVkZSBpbiB0aGUgcmVwbGFjZW1lbnQgc3RyaW5nLlxuICByZXR1cm4gbmV3IFJlZ0V4cChgQGluY2x1ZGUgKyR7ZXNjYXBlUmVnRXhwKChuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJykgKyBuYW1lKX1gLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyBtaXhpbiByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldE1peGluVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICAvLyBOb3RlIHRoYXQgYWRkaW5nIGEgYChgIGF0IHRoZSBlbmQgb2YgdGhlIHBhdHRlcm4gd291bGQgYmUgbW9yZSBhY2N1cmF0ZSxcbiAgLy8gYnV0IG1peGluIGludm9jYXRpb25zIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgdG8gaW5jbHVkZSB0aGUgcGFyZW50aGVzZXMuXG4gIHJldHVybiBuYW1lID0+IGBAaW5jbHVkZSAke25hbWVzcGFjZX0uJHtuYW1lfWA7XG59XG5cbi8qKiBGb3JtYXRzIGEgbWlncmF0aW9uIGtleSBhcyBhIFNhc3MgZnVuY3Rpb24gaW52b2NhdGlvbi4gKi9cbmZ1bmN0aW9uIGZ1bmN0aW9uS2V5Rm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nfG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIHJldHVybiBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cChgJHtuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJ30ke25hbWV9KGApLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyBmdW5jdGlvbiByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldEZ1bmN0aW9uVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICByZXR1cm4gbmFtZSA9PiBgJHtuYW1lc3BhY2V9LiR7bmFtZX0oYDtcbn1cblxuLyoqIEZvcm1hdHMgYSBtaWdyYXRpb24ga2V5IGFzIGEgU2FzcyB2YXJpYWJsZS4gKi9cbmZ1bmN0aW9uIHZhcmlhYmxlS2V5Rm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nfG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIHJldHVybiBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cChgJHtuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJ30kJHtuYW1lfWApLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyB2YXJpYWJsZSByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldFZhcmlhYmxlVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICByZXR1cm4gbmFtZSA9PiBgJHtuYW1lc3BhY2V9LiQke25hbWV9YDtcbn1cblxuLyoqIEVzY2FwZXMgc3BlY2lhbCByZWdleCBjaGFyYWN0ZXJzIGluIGEgc3RyaW5nLiAqL1xuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8W1xcXVxcL1xcXFxdKS9nLCAnXFxcXCQxJyk7XG59XG5cbi8qKiBVc2VkIHdpdGggYEFycmF5LnByb3RvdHlwZS5zb3J0YCB0byBvcmRlciBzdHJpbmdzIGluIGRlc2NlbmRpbmcgbGVuZ3RoLiAqL1xuZnVuY3Rpb24gc29ydExlbmd0aERlc2NlbmRpbmcoYTogc3RyaW5nLCBiOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XG59XG5cbi8qKiBSZW1vdmVzIGFsbCBzdHJpbmdzIGZyb20gYW5vdGhlciBzdHJpbmcuICovXG5mdW5jdGlvbiByZW1vdmVTdHJpbmdzKGNvbnRlbnQ6IHN0cmluZywgdG9SZW1vdmU6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRvUmVtb3ZlXG4gICAgLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnQpID0+IGFjY3VtdWxhdG9yLnJlcGxhY2UoY3VycmVudCwgJycpLCBjb250ZW50KVxuICAgIC5yZXBsYWNlKC9eXFxzKy8sICcnKTtcbn1cblxuLyoqIFBhcnNlcyBvdXQgdGhlIG5hbWVzcGFjZSBmcm9tIGEgU2FzcyBgQHVzZWAgc3RhdGVtZW50LiAqL1xuZnVuY3Rpb24gZXh0cmFjdE5hbWVzcGFjZUZyb21Vc2VTdGF0ZW1lbnQoZnVsbEltcG9ydDogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgY2xvc2VRdW90ZUluZGV4ID0gTWF0aC5tYXgoZnVsbEltcG9ydC5sYXN0SW5kZXhPZihgXCJgKSwgZnVsbEltcG9ydC5sYXN0SW5kZXhPZihgJ2ApKTtcblxuICBpZiAoY2xvc2VRdW90ZUluZGV4ID4gLTEpIHtcbiAgICBjb25zdCBhc0V4cHJlc3Npb24gPSAnYXMgJztcbiAgICBjb25zdCBhc0luZGV4ID0gZnVsbEltcG9ydC5pbmRleE9mKGFzRXhwcmVzc2lvbiwgY2xvc2VRdW90ZUluZGV4KTtcblxuICAgIC8vIElmIHdlIGZvdW5kIGFuIGAgYXMgYCBleHByZXNzaW9uLCB3ZSBjb25zaWRlciB0aGUgcmVzdCBvZiB0aGUgdGV4dCBhcyB0aGUgbmFtZXNwYWNlLlxuICAgIGlmIChhc0luZGV4ID4gLTEpIHtcbiAgICAgIHJldHVybiBmdWxsSW1wb3J0LnNsaWNlKGFzSW5kZXggKyBhc0V4cHJlc3Npb24ubGVuZ3RoKS5zcGxpdCgnOycpWzBdLnRyaW0oKTtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgdGhlIG5hbWVzcGFjZSBpcyB0aGUgbmFtZSBvZiB0aGUgZmlsZSB0aGF0IGlzIGJlaW5nIGltcG9ydGVkLlxuICAgIGNvbnN0IGxhc3RTbGFzaEluZGV4ID0gZnVsbEltcG9ydC5sYXN0SW5kZXhPZignLycsIGNsb3NlUXVvdGVJbmRleCk7XG5cbiAgICBpZiAobGFzdFNsYXNoSW5kZXggPiAtMSkge1xuICAgICAgY29uc3QgZmlsZU5hbWUgPSBmdWxsSW1wb3J0LnNsaWNlKGxhc3RTbGFzaEluZGV4ICsgMSwgY2xvc2VRdW90ZUluZGV4KVxuICAgICAgICAvLyBTYXNzIGFsbG93cyBmb3IgbGVhZGluZyB1bmRlcnNjb3JlcyB0byBiZSBvbWl0dGVkIGFuZCBpdCB0ZWNobmljYWxseSBzdXBwb3J0cyAuc2Nzcy5cbiAgICAgICAgLnJlcGxhY2UoL15ffChcXC5pbXBvcnQpP1xcLnNjc3MkfFxcLmltcG9ydCQvZywgJycpO1xuXG4gICAgICAvLyBTYXNzIGlnbm9yZXMgYC9pbmRleGAgYW5kIGluZmVycyB0aGUgbmFtZXNwYWNlIGFzIHRoZSBuZXh0IHNlZ21lbnQgaW4gdGhlIHBhdGguXG4gICAgICBpZiAoZmlsZU5hbWUgPT09ICdpbmRleCcpIHtcbiAgICAgICAgY29uc3QgbmV4dFNsYXNoSW5kZXggPSBmdWxsSW1wb3J0Lmxhc3RJbmRleE9mKCcvJywgbGFzdFNsYXNoSW5kZXggLSAxKTtcblxuICAgICAgICBpZiAobmV4dFNsYXNoSW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiBmdWxsSW1wb3J0LnNsaWNlKG5leHRTbGFzaEluZGV4ICsgMSwgbGFzdFNsYXNoSW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmlsZU5hbWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBleHRyYWN0IG5hbWVzcGFjZSBmcm9tIGltcG9ydCBcIiR7ZnVsbEltcG9ydH1cIi5gKTtcbn1cblxuLyoqXG4gKiBSZXBsYWNlcyB2YXJpYWJsZXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZCB3aXRoIHRoZWlyIHZhbHVlcy5cbiAqIEBwYXJhbSBjb250ZW50IENvbnRlbnQgb2YgdGhlIGZpbGUgdG8gYmUgbWlncmF0ZWQuXG4gKiBAcGFyYW0gdmFyaWFibGVzIE1hcHBpbmcgYmV0d2VlbiB2YXJpYWJsZSBuYW1lcyBhbmQgdGhlaXIgdmFsdWVzLlxuICovXG5mdW5jdGlvbiByZXBsYWNlUmVtb3ZlZFZhcmlhYmxlcyhjb250ZW50OiBzdHJpbmcsIHZhcmlhYmxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IHN0cmluZyB7XG4gIE9iamVjdC5rZXlzKHZhcmlhYmxlcykuc29ydChzb3J0TGVuZ3RoRGVzY2VuZGluZykuZm9yRWFjaCh2YXJpYWJsZU5hbWUgPT4ge1xuICAgIC8vIE5vdGUgdGhhdCB0aGUgcGF0dGVybiB1c2VzIGEgbmVnYXRpdmUgbG9va2FoZWFkIHRvIGV4Y2x1ZGVcbiAgICAvLyB2YXJpYWJsZSBhc3NpZ25tZW50cywgYmVjYXVzZSB0aGV5IGNhbid0IGJlIG1pZ3JhdGVkLlxuICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgXFxcXCQke2VzY2FwZVJlZ0V4cCh2YXJpYWJsZU5hbWUpfSg/IVxcXFxzKzp8OilgLCAnZycpO1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UocmVnZXgsIHZhcmlhYmxlc1t2YXJpYWJsZU5hbWVdKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG4iXX0=