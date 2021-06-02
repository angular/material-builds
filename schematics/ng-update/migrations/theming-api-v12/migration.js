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
    // If the content already has the `@use` import, we don't need to add anything.
    const alreadyImportedPattern = new RegExp(`@use +['"]${importPath}['"]`, 'g');
    if (alreadyImportedPattern.test(content)) {
        return content;
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvdGhlbWluZy1hcGktdjEyL21pZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCxxQ0FRa0I7QUFlbEI7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FBQyxPQUFlLEVBQ2YsaUJBQXlCLEVBQ3pCLFlBQW9CLEVBQ3BCLHFCQUE2QixFQUM3QixnQkFBd0IsRUFDeEIsdUJBQXFDLEVBQUUsRUFDdkMsZUFBd0I7SUFDekQsTUFBTSxlQUFlLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNuRixNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsQ0FBQztJQUV6RSx3RUFBd0U7SUFDeEUseUVBQXlFO0lBQ3pFLE9BQU8sR0FBRyxzQkFBc0IsQ0FDNUIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLGVBQWUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQzNFLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDbkUsT0FBTyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxpQ0FBd0IsQ0FBQyxDQUFDO0lBRXJFLHNGQUFzRjtJQUN0RiwyRkFBMkY7SUFDM0YsbURBQW1EO0lBQ25ELElBQUksZUFBZSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDbEMsT0FBTyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxtQ0FBMEIsQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUMzRDtJQUVELElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDN0IsT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3REO0lBRUQsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQTlCRCxnREE4QkM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQVMsYUFBYSxDQUFDLE9BQWUsRUFBRSxNQUFjLEVBQy9CLGVBQXdCO0lBQzdDLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1FBQ3JDLDJFQUEyRTtRQUMzRSxNQUFNLEtBQUssQ0FBQyxXQUFXLE1BQU0sMEJBQTBCLENBQUMsQ0FBQztLQUMxRDtJQUVELG9GQUFvRjtJQUNwRiw2RkFBNkY7SUFDN0YsNEJBQTRCO0lBQzVCLE1BQU0sVUFBVSxHQUFhLEVBQUUsQ0FBQztJQUNoQyxNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7SUFDN0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsc0JBQXNCLFlBQVksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzFGLElBQUksS0FBSyxHQUEyQixJQUFJLENBQUM7SUFFekMsT0FBTyxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNwQyxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUVqQyxJQUFJLGVBQWUsYUFBZixlQUFlLHVCQUFmLGVBQWUsQ0FBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDckMsU0FBUztTQUNWO1FBRUQsSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFO1lBQ2xCLE1BQU0sU0FBUyxHQUFHLGdDQUFnQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRS9ELElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDeEMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUM1QjtTQUNGO1FBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUMxQjtJQUVELE9BQU8sRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFDLENBQUM7QUFDL0IsQ0FBQztBQUVELCtDQUErQztBQUMvQyxTQUFTLHNCQUFzQixDQUFDLE9BQWUsRUFBRSxVQUFrQixFQUNuQyxlQUFtQyxFQUNuQyx1QkFBcUMsRUFBRTtJQUNyRSxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUM7SUFDL0IsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBRXhCLHNCQUFzQjtJQUN0QixNQUFNLGNBQWMsbUNBQU8sdUJBQWMsR0FBSyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzRSxPQUFPLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsRUFDNUYsc0JBQXNCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUVyQyx5QkFBeUI7SUFDekIsTUFBTSxpQkFBaUIsbUNBQU8sMEJBQWlCLEdBQUssb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEYsT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFDNUUsb0JBQW9CLEVBQUUseUJBQXlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUU5RCx5QkFBeUI7SUFDekIsTUFBTSxpQkFBaUIsbUNBQU8sMEJBQWlCLEdBQUssb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEYsT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFDNUUsb0JBQW9CLEVBQUUseUJBQXlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUU5RCxJQUFJLE9BQU8sS0FBSyxjQUFjLEVBQUU7UUFDOUIsd0VBQXdFO1FBQ3hFLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDdkY7SUFFRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBRUQsMENBQTBDO0FBQzFDLFNBQVMsaUJBQWlCLENBQUMsT0FBZSxFQUFFLFVBQWtCLEVBQ25DLGVBQW1DO0lBQzVELE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQztJQUMvQixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFFeEIsc0JBQXNCO0lBQ3RCLE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLGtCQUFTLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsRUFDdkYsc0JBQXNCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUVyQyx5QkFBeUI7SUFDekIsT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLEVBQUUscUJBQVksRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLG9CQUFvQixFQUM3Rix5QkFBeUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBRXhDLHdGQUF3RjtJQUN4Riw4RkFBOEY7SUFDOUYsSUFBSSxPQUFPLEtBQUssY0FBYyxFQUFFO1FBQzlCLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDdkY7SUFFRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFTLGFBQWEsQ0FBQyxPQUFlLEVBQ2YsT0FBK0IsRUFDL0IsVUFBb0IsRUFDcEIsYUFBOEQsRUFDOUQsV0FBb0M7SUFDekQsd0ZBQXdGO0lBQ3hGLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQzNFLHlGQUF5RjtRQUN6RiwrRkFBK0Y7UUFDL0YsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDNUQsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUU5QywyRUFBMkU7WUFDM0UsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDckMsTUFBTSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQzthQUNwRDtZQUVELE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQUVELCtDQUErQztBQUMvQyxTQUFTLGtCQUFrQixDQUFDLE9BQWUsRUFBRSxVQUFrQixFQUFFLGVBQXlCLEVBQzlELFNBQWlCO0lBQzNDLCtFQUErRTtJQUMvRSxNQUFNLHNCQUFzQixHQUFHLElBQUksTUFBTSxDQUFDLGFBQWEsVUFBVSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDOUUsSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDeEMsT0FBTyxPQUFPLENBQUM7S0FDaEI7SUFFRCw4RkFBOEY7SUFDOUYsZ0dBQWdHO0lBQ2hHLHlGQUF5RjtJQUN6RixnR0FBZ0c7SUFDaEcsa0VBQWtFO0lBQ2xFLE1BQU0sZUFBZSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FDdEUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVyRSw4RkFBOEY7SUFDOUYseUZBQXlGO0lBQ3pGLCtFQUErRTtJQUMvRSxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFFeEUsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsR0FBRyxTQUFTLFVBQVUsUUFBUSxTQUFTLEtBQUs7UUFDNUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRUQsMERBQTBEO0FBQzFELFNBQVMsaUJBQWlCLENBQUMsU0FBc0IsRUFBRSxJQUFZO0lBQzdELHFGQUFxRjtJQUNyRixzRkFBc0Y7SUFDdEYsK0VBQStFO0lBQy9FLE9BQU8sSUFBSSxNQUFNLENBQUMsYUFBYSxZQUFZLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDakcsQ0FBQztBQUVELDhFQUE4RTtBQUM5RSxTQUFTLHNCQUFzQixDQUFDLFNBQWlCO0lBQy9DLDJFQUEyRTtJQUMzRSwyRUFBMkU7SUFDM0UsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksU0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ2pELENBQUM7QUFFRCw2REFBNkQ7QUFDN0QsU0FBUyxvQkFBb0IsQ0FBQyxTQUFzQixFQUFFLElBQVk7SUFDaEUsT0FBTyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3RGLENBQUM7QUFFRCxpRkFBaUY7QUFDakYsU0FBUyx5QkFBeUIsQ0FBQyxTQUFpQjtJQUNsRCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLElBQUksSUFBSSxHQUFHLENBQUM7QUFDekMsQ0FBQztBQUVELGtEQUFrRDtBQUNsRCxTQUFTLG9CQUFvQixDQUFDLFNBQXNCLEVBQUUsSUFBWTtJQUNoRSxPQUFPLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEYsQ0FBQztBQUVELGlGQUFpRjtBQUNqRixTQUFTLHlCQUF5QixDQUFDLFNBQWlCO0lBQ2xELE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsS0FBSyxJQUFJLEVBQUUsQ0FBQztBQUN6QyxDQUFDO0FBRUQsb0RBQW9EO0FBQ3BELFNBQVMsWUFBWSxDQUFDLEdBQVc7SUFDL0IsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFFRCw4RUFBOEU7QUFDOUUsU0FBUyxvQkFBb0IsQ0FBQyxDQUFTLEVBQUUsQ0FBUztJQUNoRCxPQUFPLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUM3QixDQUFDO0FBRUQsK0NBQStDO0FBQy9DLFNBQVMsYUFBYSxDQUFDLE9BQWUsRUFBRSxRQUFrQjtJQUN4RCxPQUFPLFFBQVE7U0FDWixNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUM7U0FDM0UsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRUQsNkRBQTZEO0FBQzdELFNBQVMsZ0NBQWdDLENBQUMsVUFBa0I7SUFDMUQsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUUzRixJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRTtRQUN4QixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDM0IsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFbEUsdUZBQXVGO1FBQ3ZGLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ2hCLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUM3RTtRQUVELDBFQUEwRTtRQUMxRSxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUVwRSxJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUN2QixNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxDQUFDLEVBQUUsZUFBZSxDQUFDO2dCQUNwRSx1RkFBdUY7aUJBQ3RGLE9BQU8sQ0FBQyxrQ0FBa0MsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVuRCxrRkFBa0Y7WUFDbEYsSUFBSSxRQUFRLEtBQUssT0FBTyxFQUFFO2dCQUN4QixNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBRXZFLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUN2QixPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztpQkFDN0Q7YUFDRjtpQkFBTTtnQkFDTCxPQUFPLFFBQVEsQ0FBQzthQUNqQjtTQUNGO0tBQ0Y7SUFFRCxNQUFNLEtBQUssQ0FBQyw0Q0FBNEMsVUFBVSxJQUFJLENBQUMsQ0FBQztBQUMxRSxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsdUJBQXVCLENBQUMsT0FBZSxFQUFFLFNBQWlDO0lBQ2pGLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO1FBQ3ZFLDZEQUE2RDtRQUM3RCx3REFBd0Q7UUFDeEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxZQUFZLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3RSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIG1hdGVyaWFsTWl4aW5zLFxuICBtYXRlcmlhbEZ1bmN0aW9ucyxcbiAgbWF0ZXJpYWxWYXJpYWJsZXMsXG4gIGNka01peGlucyxcbiAgY2RrVmFyaWFibGVzLFxuICByZW1vdmVkTWF0ZXJpYWxWYXJpYWJsZXMsXG4gIHVucHJlZml4ZWRSZW1vdmVkVmFyaWFibGVzXG59IGZyb20gJy4vY29uZmlnJztcblxuLyoqIFRoZSByZXN1bHQgb2YgYSBzZWFyY2ggZm9yIGltcG9ydHMgYW5kIG5hbWVzcGFjZXMgaW4gYSBmaWxlLiAqL1xuaW50ZXJmYWNlIERldGVjdEltcG9ydFJlc3VsdCB7XG4gIGltcG9ydHM6IHN0cmluZ1tdO1xuICBuYW1lc3BhY2VzOiBzdHJpbmdbXTtcbn1cblxuLyoqIEFkZGl0aW9uIG1peGluIGFuZCBmdW5jdGlvbiBuYW1lcyB0aGF0IGNhbiBiZSB1cGRhdGVkIHdoZW4gaW52b2tpbmcgbWlncmF0aW9uIGRpcmVjdGx5LiAqL1xuaW50ZXJmYWNlIEV4dHJhU3ltYm9scyB7XG4gIG1peGlucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIGZ1bmN0aW9ucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIHZhcmlhYmxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG59XG5cbi8qKlxuICogTWlncmF0ZXMgdGhlIGNvbnRlbnQgb2YgYSBmaWxlIHRvIHRoZSBuZXcgdGhlbWluZyBBUEkuIE5vdGUgdGhhdCB0aGlzIG1pZ3JhdGlvbiBpcyB1c2luZyBwbGFpblxuICogc3RyaW5nIG1hbmlwdWxhdGlvbiwgcmF0aGVyIHRoYW4gdGhlIEFTVCBmcm9tIFBvc3RDU1MgYW5kIHRoZSBzY2hlbWF0aWNzIHN0cmluZyBtYW5pcHVsYXRpb25cbiAqIEFQSXMsIGJlY2F1c2UgaXQgYWxsb3dzIHVzIHRvIHJ1biBpdCBpbnNpZGUgZzMgYW5kIHRvIGF2b2lkIGludHJvZHVjaW5nIG5ldyBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0gY29udGVudCBDb250ZW50IG9mIHRoZSBmaWxlLlxuICogQHBhcmFtIG9sZE1hdGVyaWFsUHJlZml4IFByZWZpeCB3aXRoIHdoaWNoIHRoZSBvbGQgTWF0ZXJpYWwgaW1wb3J0cyBzaG91bGQgc3RhcnQuXG4gKiAgIEhhcyB0byBlbmQgd2l0aCBhIHNsYXNoLiBFLmcuIGlmIGBAaW1wb3J0ICd+QGFuZ3VsYXIvbWF0ZXJpYWwvdGhlbWluZydgIHNob3VsZCBiZVxuICogICBtYXRjaGVkLCB0aGUgcHJlZml4IHdvdWxkIGJlIGB+QGFuZ3VsYXIvbWF0ZXJpYWwvYC5cbiAqIEBwYXJhbSBvbGRDZGtQcmVmaXggUHJlZml4IHdpdGggd2hpY2ggdGhlIG9sZCBDREsgaW1wb3J0cyBzaG91bGQgc3RhcnQuXG4gKiAgIEhhcyB0byBlbmQgd2l0aCBhIHNsYXNoLiBFLmcuIGlmIGBAaW1wb3J0ICd+QGFuZ3VsYXIvY2RrL292ZXJsYXknYCBzaG91bGQgYmVcbiAqICAgbWF0Y2hlZCwgdGhlIHByZWZpeCB3b3VsZCBiZSBgfkBhbmd1bGFyL2Nkay9gLlxuICogQHBhcmFtIG5ld01hdGVyaWFsSW1wb3J0UGF0aCBOZXcgaW1wb3J0IHRvIHRoZSBNYXRlcmlhbCB0aGVtaW5nIEFQSSAoZS5nLiBgfkBhbmd1bGFyL21hdGVyaWFsYCkuXG4gKiBAcGFyYW0gbmV3Q2RrSW1wb3J0UGF0aCBOZXcgaW1wb3J0IHRvIHRoZSBDREsgU2FzcyBBUElzIChlLmcuIGB+QGFuZ3VsYXIvY2RrYCkuXG4gKiBAcGFyYW0gZXhjbHVkZWRJbXBvcnRzIFBhdHRlcm4gdGhhdCBjYW4gYmUgdXNlZCB0byBleGNsdWRlIGltcG9ydHMgZnJvbSBiZWluZyBwcm9jZXNzZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaWdyYXRlRmlsZUNvbnRlbnQoY29udGVudDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRNYXRlcmlhbFByZWZpeDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRDZGtQcmVmaXg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3TWF0ZXJpYWxJbXBvcnRQYXRoOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Nka0ltcG9ydFBhdGg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFNYXRlcmlhbFN5bWJvbHM6IEV4dHJhU3ltYm9scyA9IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlZEltcG9ydHM/OiBSZWdFeHApOiBzdHJpbmcge1xuICBjb25zdCBtYXRlcmlhbFJlc3VsdHMgPSBkZXRlY3RJbXBvcnRzKGNvbnRlbnQsIG9sZE1hdGVyaWFsUHJlZml4LCBleGNsdWRlZEltcG9ydHMpO1xuICBjb25zdCBjZGtSZXN1bHRzID0gZGV0ZWN0SW1wb3J0cyhjb250ZW50LCBvbGRDZGtQcmVmaXgsIGV4Y2x1ZGVkSW1wb3J0cyk7XG5cbiAgLy8gVHJ5IHRvIG1pZ3JhdGUgdGhlIHN5bWJvbHMgZXZlbiBpZiB0aGVyZSBhcmUgbm8gaW1wb3J0cy4gVGhpcyBpcyB1c2VkXG4gIC8vIHRvIGNvdmVyIHRoZSBjYXNlIHdoZXJlIHRoZSBDb21wb25lbnRzIHN5bWJvbHMgd2VyZSB1c2VkIHRyYW5zaXRpdmVseS5cbiAgY29udGVudCA9IG1pZ3JhdGVNYXRlcmlhbFN5bWJvbHMoXG4gICAgICBjb250ZW50LCBuZXdNYXRlcmlhbEltcG9ydFBhdGgsIG1hdGVyaWFsUmVzdWx0cywgZXh0cmFNYXRlcmlhbFN5bWJvbHMpO1xuICBjb250ZW50ID0gbWlncmF0ZUNka1N5bWJvbHMoY29udGVudCwgbmV3Q2RrSW1wb3J0UGF0aCwgY2RrUmVzdWx0cyk7XG4gIGNvbnRlbnQgPSByZXBsYWNlUmVtb3ZlZFZhcmlhYmxlcyhjb250ZW50LCByZW1vdmVkTWF0ZXJpYWxWYXJpYWJsZXMpO1xuXG4gIC8vIFdlIGNhbiBhc3N1bWUgdGhhdCB0aGUgbWlncmF0aW9uIGhhcyB0YWtlbiBjYXJlIG9mIGFueSBDb21wb25lbnRzIHN5bWJvbHMgdGhhdCB3ZXJlXG4gIC8vIGltcG9ydGVkIHRyYW5zaXRpdmVseSBzbyB3ZSBjYW4gYWx3YXlzIGRyb3AgdGhlIG9sZCBpbXBvcnRzLiBXZSBhbHNvIGFzc3VtZSB0aGF0IGltcG9ydHNcbiAgLy8gdG8gdGhlIG5ldyBlbnRyeSBwb2ludHMgaGF2ZSBiZWVuIGFkZGVkIGFscmVhZHkuXG4gIGlmIChtYXRlcmlhbFJlc3VsdHMuaW1wb3J0cy5sZW5ndGgpIHtcbiAgICBjb250ZW50ID0gcmVwbGFjZVJlbW92ZWRWYXJpYWJsZXMoY29udGVudCwgdW5wcmVmaXhlZFJlbW92ZWRWYXJpYWJsZXMpO1xuICAgIGNvbnRlbnQgPSByZW1vdmVTdHJpbmdzKGNvbnRlbnQsIG1hdGVyaWFsUmVzdWx0cy5pbXBvcnRzKTtcbiAgfVxuXG4gIGlmIChjZGtSZXN1bHRzLmltcG9ydHMubGVuZ3RoKSB7XG4gICAgY29udGVudCA9IHJlbW92ZVN0cmluZ3MoY29udGVudCwgY2RrUmVzdWx0cy5pbXBvcnRzKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIENvdW50cyB0aGUgbnVtYmVyIG9mIGltcG9ydHMgd2l0aCBhIHNwZWNpZmljIHByZWZpeCBhbmQgZXh0cmFjdHMgdGhlaXIgbmFtZXNwYWNlcy5cbiAqIEBwYXJhbSBjb250ZW50IEZpbGUgY29udGVudCBpbiB3aGljaCB0byBsb29rIGZvciBpbXBvcnRzLlxuICogQHBhcmFtIHByZWZpeCBQcmVmaXggdGhhdCB0aGUgaW1wb3J0cyBzaG91bGQgc3RhcnQgd2l0aC5cbiAqIEBwYXJhbSBleGNsdWRlZEltcG9ydHMgUGF0dGVybiB0aGF0IGNhbiBiZSB1c2VkIHRvIGV4Y2x1ZGUgaW1wb3J0cyBmcm9tIGJlaW5nIHByb2Nlc3NlZC5cbiAqL1xuZnVuY3Rpb24gZGV0ZWN0SW1wb3J0cyhjb250ZW50OiBzdHJpbmcsIHByZWZpeDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlZEltcG9ydHM/OiBSZWdFeHApOiBEZXRlY3RJbXBvcnRSZXN1bHQge1xuICBpZiAocHJlZml4W3ByZWZpeC5sZW5ndGggLSAxXSAhPT0gJy8nKSB7XG4gICAgLy8gU29tZSBvZiB0aGUgbG9naWMgZnVydGhlciBkb3duIG1ha2VzIGFzc3VtcHRpb25zIGFib3V0IHRoZSBpbXBvcnQgZGVwdGguXG4gICAgdGhyb3cgRXJyb3IoYFByZWZpeCBcIiR7cHJlZml4fVwiIGhhcyB0byBlbmQgaW4gYSBzbGFzaC5gKTtcbiAgfVxuXG4gIC8vIExpc3Qgb2YgYEB1c2VgIG5hbWVzcGFjZXMgZnJvbSB3aGljaCBBbmd1bGFyIENESy9NYXRlcmlhbCBBUElzIG1heSBiZSByZWZlcmVuY2VkLlxuICAvLyBTaW5jZSB3ZSBrbm93IHRoYXQgdGhlIGxpYnJhcnkgZG9lc24ndCBoYXZlIGFueSBuYW1lIGNvbGxpc2lvbnMsIHdlIGNhbiB0cmVhdCBhbGwgb2YgdGhlc2VcbiAgLy8gbmFtZXNwYWNlcyBhcyBlcXVpdmFsZW50LlxuICBjb25zdCBuYW1lc3BhY2VzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBpbXBvcnRzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBwYXR0ZXJuID0gbmV3IFJlZ0V4cChgQChpbXBvcnR8dXNlKSArWydcIl0ke2VzY2FwZVJlZ0V4cChwcmVmaXgpfS4qWydcIl0uKjs/XFxuYCwgJ2cnKTtcbiAgbGV0IG1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsID0gbnVsbDtcblxuICB3aGlsZSAobWF0Y2ggPSBwYXR0ZXJuLmV4ZWMoY29udGVudCkpIHtcbiAgICBjb25zdCBbZnVsbEltcG9ydCwgdHlwZV0gPSBtYXRjaDtcblxuICAgIGlmIChleGNsdWRlZEltcG9ydHM/LnRlc3QoZnVsbEltcG9ydCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICh0eXBlID09PSAndXNlJykge1xuICAgICAgY29uc3QgbmFtZXNwYWNlID0gZXh0cmFjdE5hbWVzcGFjZUZyb21Vc2VTdGF0ZW1lbnQoZnVsbEltcG9ydCk7XG5cbiAgICAgIGlmIChuYW1lc3BhY2VzLmluZGV4T2YobmFtZXNwYWNlKSA9PT0gLTEpIHtcbiAgICAgICAgbmFtZXNwYWNlcy5wdXNoKG5hbWVzcGFjZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW1wb3J0cy5wdXNoKGZ1bGxJbXBvcnQpO1xuICB9XG5cbiAgcmV0dXJuIHtpbXBvcnRzLCBuYW1lc3BhY2VzfTtcbn1cblxuLyoqIE1pZ3JhdGVzIHRoZSBNYXRlcmlhbCBzeW1ib2xzIGluIGEgZmlsZS4gKi9cbmZ1bmN0aW9uIG1pZ3JhdGVNYXRlcmlhbFN5bWJvbHMoY29udGVudDogc3RyaW5nLCBpbXBvcnRQYXRoOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGVjdGVkSW1wb3J0czogRGV0ZWN0SW1wb3J0UmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYU1hdGVyaWFsU3ltYm9sczogRXh0cmFTeW1ib2xzID0ge30pOiBzdHJpbmcge1xuICBjb25zdCBpbml0aWFsQ29udGVudCA9IGNvbnRlbnQ7XG4gIGNvbnN0IG5hbWVzcGFjZSA9ICdtYXQnO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIG1peGlucy5cbiAgY29uc3QgbWl4aW5zVG9VcGRhdGUgPSB7Li4ubWF0ZXJpYWxNaXhpbnMsIC4uLmV4dHJhTWF0ZXJpYWxTeW1ib2xzLm1peGluc307XG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIG1peGluc1RvVXBkYXRlLCBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcywgbWl4aW5LZXlGb3JtYXR0ZXIsXG4gICAgZ2V0TWl4aW5WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBNaWdyYXRlIHRoZSBmdW5jdGlvbnMuXG4gIGNvbnN0IGZ1bmN0aW9uc1RvVXBkYXRlID0gey4uLm1hdGVyaWFsRnVuY3Rpb25zLCAuLi5leHRyYU1hdGVyaWFsU3ltYm9scy5mdW5jdGlvbnN9O1xuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhjb250ZW50LCBmdW5jdGlvbnNUb1VwZGF0ZSwgZGV0ZWN0ZWRJbXBvcnRzLm5hbWVzcGFjZXMsXG4gICAgZnVuY3Rpb25LZXlGb3JtYXR0ZXIsIGdldEZ1bmN0aW9uVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlKSk7XG5cbiAgLy8gTWlncmF0ZSB0aGUgdmFyaWFibGVzLlxuICBjb25zdCB2YXJpYWJsZXNUb1VwZGF0ZSA9IHsuLi5tYXRlcmlhbFZhcmlhYmxlcywgLi4uZXh0cmFNYXRlcmlhbFN5bWJvbHMudmFyaWFibGVzfTtcbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgdmFyaWFibGVzVG9VcGRhdGUsIGRldGVjdGVkSW1wb3J0cy5uYW1lc3BhY2VzLFxuICAgIHZhcmlhYmxlS2V5Rm9ybWF0dGVyLCBnZXRWYXJpYWJsZVZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSkpO1xuXG4gIGlmIChjb250ZW50ICE9PSBpbml0aWFsQ29udGVudCkge1xuICAgIC8vIEFkZCBhbiBpbXBvcnQgdG8gdGhlIG5ldyBBUEkgb25seSBpZiBhbnkgb2YgdGhlIEFQSXMgd2VyZSBiZWluZyB1c2VkLlxuICAgIGNvbnRlbnQgPSBpbnNlcnRVc2VTdGF0ZW1lbnQoY29udGVudCwgaW1wb3J0UGF0aCwgZGV0ZWN0ZWRJbXBvcnRzLmltcG9ydHMsIG5hbWVzcGFjZSk7XG4gIH1cblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqIE1pZ3JhdGVzIHRoZSBDREsgc3ltYm9scyBpbiBhIGZpbGUuICovXG5mdW5jdGlvbiBtaWdyYXRlQ2RrU3ltYm9scyhjb250ZW50OiBzdHJpbmcsIGltcG9ydFBhdGg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGVjdGVkSW1wb3J0czogRGV0ZWN0SW1wb3J0UmVzdWx0KTogc3RyaW5nIHtcbiAgY29uc3QgaW5pdGlhbENvbnRlbnQgPSBjb250ZW50O1xuICBjb25zdCBuYW1lc3BhY2UgPSAnY2RrJztcblxuICAvLyBNaWdyYXRlIHRoZSBtaXhpbnMuXG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIGNka01peGlucywgZGV0ZWN0ZWRJbXBvcnRzLm5hbWVzcGFjZXMsIG1peGluS2V5Rm9ybWF0dGVyLFxuICAgIGdldE1peGluVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlKSk7XG5cbiAgLy8gTWlncmF0ZSB0aGUgdmFyaWFibGVzLlxuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhjb250ZW50LCBjZGtWYXJpYWJsZXMsIGRldGVjdGVkSW1wb3J0cy5uYW1lc3BhY2VzLCB2YXJpYWJsZUtleUZvcm1hdHRlcixcbiAgICBnZXRWYXJpYWJsZVZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSkpO1xuXG4gIC8vIFByZXZpb3VzbHkgdGhlIENESyBzeW1ib2xzIHdlcmUgZXhwb3NlZCB0aHJvdWdoIGBtYXRlcmlhbC90aGVtaW5nYCwgYnV0IG5vdyB3ZSBoYXZlIGFcbiAgLy8gZGVkaWNhdGVkIGVudHJ5cG9pbnQgZm9yIHRoZSBDREsuIE9ubHkgYWRkIGFuIGltcG9ydCBmb3IgaXQgaWYgYW55IG9mIHRoZSBzeW1ib2xzIGFyZSB1c2VkLlxuICBpZiAoY29udGVudCAhPT0gaW5pdGlhbENvbnRlbnQpIHtcbiAgICBjb250ZW50ID0gaW5zZXJ0VXNlU3RhdGVtZW50KGNvbnRlbnQsIGltcG9ydFBhdGgsIGRldGVjdGVkSW1wb3J0cy5pbXBvcnRzLCBuYW1lc3BhY2UpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogUmVuYW1lcyBhbGwgU2FzcyBzeW1ib2xzIGluIGEgZmlsZSBiYXNlZCBvbiBhIHByZS1kZWZpbmVkIG1hcHBpbmcuXG4gKiBAcGFyYW0gY29udGVudCBDb250ZW50IG9mIGEgZmlsZSB0byBiZSBtaWdyYXRlZC5cbiAqIEBwYXJhbSBtYXBwaW5nIE1hcHBpbmcgYmV0d2VlbiBzeW1ib2wgbmFtZXMgYW5kIHRoZWlyIHJlcGxhY2VtZW50cy5cbiAqIEBwYXJhbSBuYW1lc3BhY2VzIE5hbWVzIHRvIGl0ZXJhdGUgb3ZlciBhbmQgcGFzcyB0byBnZXRLZXlQYXR0ZXJuLlxuICogQHBhcmFtIGdldEtleVBhdHRlcm4gRnVuY3Rpb24gdXNlZCB0byB0dXJuIGVhY2ggb2YgdGhlIGtleXMgaW50byBhIHJlZ2V4LlxuICogQHBhcmFtIGZvcm1hdFZhbHVlIEZvcm1hdHMgdGhlIHZhbHVlIHRoYXQgd2lsbCByZXBsYWNlIGFueSBtYXRjaGVzIG9mIHRoZSBwYXR0ZXJuIHJldHVybmVkIGJ5XG4gKiAgYGdldEtleVBhdHRlcm5gLlxuICovXG5mdW5jdGlvbiByZW5hbWVTeW1ib2xzKGNvbnRlbnQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgbWFwcGluZzogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlczogc3RyaW5nW10sXG4gICAgICAgICAgICAgICAgICAgICAgIGdldEtleVBhdHRlcm46IChuYW1lc3BhY2U6IHN0cmluZ3xudWxsLCBrZXk6IHN0cmluZykgPT4gUmVnRXhwLFxuICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXRWYWx1ZTogKGtleTogc3RyaW5nKSA9PiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBUaGUgbnVsbCBhdCB0aGUgZW5kIGlzIHNvIHRoYXQgd2UgbWFrZSBvbmUgbGFzdCBwYXNzIHRvIGNvdmVyIG5vbi1uYW1lc3BhY2VkIHN5bWJvbHMuXG4gIFsuLi5uYW1lc3BhY2VzLnNsaWNlKCkuc29ydChzb3J0TGVuZ3RoRGVzY2VuZGluZyksIG51bGxdLmZvckVhY2gobmFtZXNwYWNlID0+IHtcbiAgICAvLyBNaWdyYXRlIHRoZSBsb25nZXN0IGtleXMgZmlyc3Qgc28gdGhhdCBvdXIgcmVnZXgtYmFzZWQgcmVwbGFjZW1lbnRzIGRvbid0IGFjY2lkZW50YWxseVxuICAgIC8vIGNhcHR1cmUga2V5cyB0aGF0IGNvbnRhaW4gb3RoZXIga2V5cy4gRS5nLiBgJG1hdC1ibHVlYCBpcyBjb250YWluZWQgd2l0aGluIGAkbWF0LWJsdWUtZ3JleWAuXG4gICAgT2JqZWN0LmtleXMobWFwcGluZykuc29ydChzb3J0TGVuZ3RoRGVzY2VuZGluZykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgcGF0dGVybiA9IGdldEtleVBhdHRlcm4obmFtZXNwYWNlLCBrZXkpO1xuXG4gICAgICAvLyBTYW5pdHkgY2hlY2sgc2luY2Ugbm9uLWdsb2JhbCByZWdleGVzIHdpbGwgb25seSByZXBsYWNlIHRoZSBmaXJzdCBtYXRjaC5cbiAgICAgIGlmIChwYXR0ZXJuLmZsYWdzLmluZGV4T2YoJ2cnKSA9PT0gLTEpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1JlcGxhY2VtZW50IHBhdHRlcm4gbXVzdCBiZSBnbG9iYWwuJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UocGF0dGVybiwgZm9ybWF0VmFsdWUobWFwcGluZ1trZXldKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKiogSW5zZXJ0cyBhbiBgQHVzZWAgc3RhdGVtZW50IGluIGEgc3RyaW5nLiAqL1xuZnVuY3Rpb24gaW5zZXJ0VXNlU3RhdGVtZW50KGNvbnRlbnQ6IHN0cmluZywgaW1wb3J0UGF0aDogc3RyaW5nLCBpbXBvcnRzVG9JZ25vcmU6IHN0cmluZ1tdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gSWYgdGhlIGNvbnRlbnQgYWxyZWFkeSBoYXMgdGhlIGBAdXNlYCBpbXBvcnQsIHdlIGRvbid0IG5lZWQgdG8gYWRkIGFueXRoaW5nLlxuICBjb25zdCBhbHJlYWR5SW1wb3J0ZWRQYXR0ZXJuID0gbmV3IFJlZ0V4cChgQHVzZSArWydcIl0ke2ltcG9ydFBhdGh9WydcIl1gLCAnZycpO1xuICBpZiAoYWxyZWFkeUltcG9ydGVkUGF0dGVybi50ZXN0KGNvbnRlbnQpKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICAvLyBXZSB3YW50IHRvIGZpbmQgdGhlIGZpcnN0IGltcG9ydCB0aGF0IGlzbid0IGluIHRoZSBsaXN0IG9mIGlnbm9yZWQgaW1wb3J0cyBvciBmaW5kIG5vdGhpbmcsXG4gIC8vIGJlY2F1c2UgdGhlIGltcG9ydHMgYmVpbmcgcmVwbGFjZWQgbWlnaHQgYmUgdGhlIG9ubHkgb25lcyBpbiB0aGUgZmlsZSBhbmQgdGhleSBjYW4gYmUgZnVydGhlclxuICAvLyBkb3duLiBBbiBlYXN5IHdheSB0byBkbyB0aGlzIGlzIHRvIHJlcGxhY2UgdGhlIGltcG9ydHMgd2l0aCBhIHJhbmRvbSBjaGFyYWN0ZXIgYW5kIHJ1blxuICAvLyBgaW5kZXhPZmAgb24gdGhlIHJlc3VsdC4gVGhpcyBpc24ndCB0aGUgbW9zdCBlZmZpY2llbnQgd2F5IG9mIGRvaW5nIGl0LCBidXQgaXQncyBtb3JlIGNvbXBhY3RcbiAgLy8gYW5kIGl0IGFsbG93cyB1cyB0byBlYXNpbHkgZGVhbCB3aXRoIHRoaW5ncyBsaWtlIGNvbW1lbnQgbm9kZXMuXG4gIGNvbnN0IGNvbnRlbnRUb1NlYXJjaCA9IGltcG9ydHNUb0lnbm9yZS5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBjdXJyZW50KSA9PlxuICAgIGFjY3VtdWxhdG9yLnJlcGxhY2UoY3VycmVudCwgJ+KXrCcucmVwZWF0KGN1cnJlbnQubGVuZ3RoKSksIGNvbnRlbnQpO1xuXG4gIC8vIFNhc3MgaGFzIGEgbGltaXRhdGlvbiB0aGF0IGFsbCBgQHVzZWAgZGVjbGFyYXRpb25zIGhhdmUgdG8gY29tZSBiZWZvcmUgYEBpbXBvcnRgIHNvIHdlIGhhdmVcbiAgLy8gdG8gZmluZCB0aGUgZmlyc3QgaW1wb3J0IGFuZCBpbnNlcnQgYmVmb3JlIGl0LiBUZWNobmljYWxseSB3ZSBjYW4gZ2V0IGF3YXkgd2l0aCBhbHdheXNcbiAgLy8gaW5zZXJ0aW5nIGF0IDAsIGJ1dCB0aGUgZmlsZSBtYXkgc3RhcnQgd2l0aCBzb21ldGhpbmcgbGlrZSBhIGxpY2Vuc2UgaGVhZGVyLlxuICBjb25zdCBuZXdJbXBvcnRJbmRleCA9IE1hdGgubWF4KDAsIGNvbnRlbnRUb1NlYXJjaC5pbmRleE9mKCdAaW1wb3J0ICcpKTtcblxuICByZXR1cm4gY29udGVudC5zbGljZSgwLCBuZXdJbXBvcnRJbmRleCkgKyBgQHVzZSAnJHtpbXBvcnRQYXRofScgYXMgJHtuYW1lc3BhY2V9O1xcbmAgK1xuICAgICAgICAgY29udGVudC5zbGljZShuZXdJbXBvcnRJbmRleCk7XG59XG5cbi8qKiBGb3JtYXRzIGEgbWlncmF0aW9uIGtleSBhcyBhIFNhc3MgbWl4aW4gaW52b2NhdGlvbi4gKi9cbmZ1bmN0aW9uIG1peGluS2V5Rm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nfG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIC8vIE5vdGUgdGhhdCBhZGRpbmcgYSBgKGAgYXQgdGhlIGVuZCBvZiB0aGUgcGF0dGVybiB3b3VsZCBiZSBtb3JlIGFjY3VyYXRlLCBidXQgbWl4aW5cbiAgLy8gaW52b2NhdGlvbnMgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSB0byBpbmNsdWRlIHRoZSBwYXJlbnRoZXNlcy4gV2UgY291bGQgYWRkIGBbKDtdYCxcbiAgLy8gYnV0IHRoZW4gd2Ugd29uJ3Qga25vdyB3aGljaCBjaGFyYWN0ZXIgdG8gaW5jbHVkZSBpbiB0aGUgcmVwbGFjZW1lbnQgc3RyaW5nLlxuICByZXR1cm4gbmV3IFJlZ0V4cChgQGluY2x1ZGUgKyR7ZXNjYXBlUmVnRXhwKChuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJykgKyBuYW1lKX1gLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyBtaXhpbiByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldE1peGluVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICAvLyBOb3RlIHRoYXQgYWRkaW5nIGEgYChgIGF0IHRoZSBlbmQgb2YgdGhlIHBhdHRlcm4gd291bGQgYmUgbW9yZSBhY2N1cmF0ZSxcbiAgLy8gYnV0IG1peGluIGludm9jYXRpb25zIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgdG8gaW5jbHVkZSB0aGUgcGFyZW50aGVzZXMuXG4gIHJldHVybiBuYW1lID0+IGBAaW5jbHVkZSAke25hbWVzcGFjZX0uJHtuYW1lfWA7XG59XG5cbi8qKiBGb3JtYXRzIGEgbWlncmF0aW9uIGtleSBhcyBhIFNhc3MgZnVuY3Rpb24gaW52b2NhdGlvbi4gKi9cbmZ1bmN0aW9uIGZ1bmN0aW9uS2V5Rm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nfG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIHJldHVybiBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cChgJHtuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJ30ke25hbWV9KGApLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyBmdW5jdGlvbiByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldEZ1bmN0aW9uVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICByZXR1cm4gbmFtZSA9PiBgJHtuYW1lc3BhY2V9LiR7bmFtZX0oYDtcbn1cblxuLyoqIEZvcm1hdHMgYSBtaWdyYXRpb24ga2V5IGFzIGEgU2FzcyB2YXJpYWJsZS4gKi9cbmZ1bmN0aW9uIHZhcmlhYmxlS2V5Rm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nfG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIHJldHVybiBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cChgJHtuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJ30kJHtuYW1lfWApLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyB2YXJpYWJsZSByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldFZhcmlhYmxlVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICByZXR1cm4gbmFtZSA9PiBgJHtuYW1lc3BhY2V9LiQke25hbWV9YDtcbn1cblxuLyoqIEVzY2FwZXMgc3BlY2lhbCByZWdleCBjaGFyYWN0ZXJzIGluIGEgc3RyaW5nLiAqL1xuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8W1xcXVxcL1xcXFxdKS9nLCAnXFxcXCQxJyk7XG59XG5cbi8qKiBVc2VkIHdpdGggYEFycmF5LnByb3RvdHlwZS5zb3J0YCB0byBvcmRlciBzdHJpbmdzIGluIGRlc2NlbmRpbmcgbGVuZ3RoLiAqL1xuZnVuY3Rpb24gc29ydExlbmd0aERlc2NlbmRpbmcoYTogc3RyaW5nLCBiOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XG59XG5cbi8qKiBSZW1vdmVzIGFsbCBzdHJpbmdzIGZyb20gYW5vdGhlciBzdHJpbmcuICovXG5mdW5jdGlvbiByZW1vdmVTdHJpbmdzKGNvbnRlbnQ6IHN0cmluZywgdG9SZW1vdmU6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRvUmVtb3ZlXG4gICAgLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnQpID0+IGFjY3VtdWxhdG9yLnJlcGxhY2UoY3VycmVudCwgJycpLCBjb250ZW50KVxuICAgIC5yZXBsYWNlKC9eXFxzKy8sICcnKTtcbn1cblxuLyoqIFBhcnNlcyBvdXQgdGhlIG5hbWVzcGFjZSBmcm9tIGEgU2FzcyBgQHVzZWAgc3RhdGVtZW50LiAqL1xuZnVuY3Rpb24gZXh0cmFjdE5hbWVzcGFjZUZyb21Vc2VTdGF0ZW1lbnQoZnVsbEltcG9ydDogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgY2xvc2VRdW90ZUluZGV4ID0gTWF0aC5tYXgoZnVsbEltcG9ydC5sYXN0SW5kZXhPZihgXCJgKSwgZnVsbEltcG9ydC5sYXN0SW5kZXhPZihgJ2ApKTtcblxuICBpZiAoY2xvc2VRdW90ZUluZGV4ID4gLTEpIHtcbiAgICBjb25zdCBhc0V4cHJlc3Npb24gPSAnYXMgJztcbiAgICBjb25zdCBhc0luZGV4ID0gZnVsbEltcG9ydC5pbmRleE9mKGFzRXhwcmVzc2lvbiwgY2xvc2VRdW90ZUluZGV4KTtcblxuICAgIC8vIElmIHdlIGZvdW5kIGFuIGAgYXMgYCBleHByZXNzaW9uLCB3ZSBjb25zaWRlciB0aGUgcmVzdCBvZiB0aGUgdGV4dCBhcyB0aGUgbmFtZXNwYWNlLlxuICAgIGlmIChhc0luZGV4ID4gLTEpIHtcbiAgICAgIHJldHVybiBmdWxsSW1wb3J0LnNsaWNlKGFzSW5kZXggKyBhc0V4cHJlc3Npb24ubGVuZ3RoKS5zcGxpdCgnOycpWzBdLnRyaW0oKTtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgdGhlIG5hbWVzcGFjZSBpcyB0aGUgbmFtZSBvZiB0aGUgZmlsZSB0aGF0IGlzIGJlaW5nIGltcG9ydGVkLlxuICAgIGNvbnN0IGxhc3RTbGFzaEluZGV4ID0gZnVsbEltcG9ydC5sYXN0SW5kZXhPZignLycsIGNsb3NlUXVvdGVJbmRleCk7XG5cbiAgICBpZiAobGFzdFNsYXNoSW5kZXggPiAtMSkge1xuICAgICAgY29uc3QgZmlsZU5hbWUgPSBmdWxsSW1wb3J0LnNsaWNlKGxhc3RTbGFzaEluZGV4ICsgMSwgY2xvc2VRdW90ZUluZGV4KVxuICAgICAgICAvLyBTYXNzIGFsbG93cyBmb3IgbGVhZGluZyB1bmRlcnNjb3JlcyB0byBiZSBvbWl0dGVkIGFuZCBpdCB0ZWNobmljYWxseSBzdXBwb3J0cyAuc2Nzcy5cbiAgICAgICAgLnJlcGxhY2UoL15ffChcXC5pbXBvcnQpP1xcLnNjc3MkfFxcLmltcG9ydCQvZywgJycpO1xuXG4gICAgICAvLyBTYXNzIGlnbm9yZXMgYC9pbmRleGAgYW5kIGluZmVycyB0aGUgbmFtZXNwYWNlIGFzIHRoZSBuZXh0IHNlZ21lbnQgaW4gdGhlIHBhdGguXG4gICAgICBpZiAoZmlsZU5hbWUgPT09ICdpbmRleCcpIHtcbiAgICAgICAgY29uc3QgbmV4dFNsYXNoSW5kZXggPSBmdWxsSW1wb3J0Lmxhc3RJbmRleE9mKCcvJywgbGFzdFNsYXNoSW5kZXggLSAxKTtcblxuICAgICAgICBpZiAobmV4dFNsYXNoSW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiBmdWxsSW1wb3J0LnNsaWNlKG5leHRTbGFzaEluZGV4ICsgMSwgbGFzdFNsYXNoSW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmlsZU5hbWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBleHRyYWN0IG5hbWVzcGFjZSBmcm9tIGltcG9ydCBcIiR7ZnVsbEltcG9ydH1cIi5gKTtcbn1cblxuLyoqXG4gKiBSZXBsYWNlcyB2YXJpYWJsZXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZCB3aXRoIHRoZWlyIHZhbHVlcy5cbiAqIEBwYXJhbSBjb250ZW50IENvbnRlbnQgb2YgdGhlIGZpbGUgdG8gYmUgbWlncmF0ZWQuXG4gKiBAcGFyYW0gdmFyaWFibGVzIE1hcHBpbmcgYmV0d2VlbiB2YXJpYWJsZSBuYW1lcyBhbmQgdGhlaXIgdmFsdWVzLlxuICovXG5mdW5jdGlvbiByZXBsYWNlUmVtb3ZlZFZhcmlhYmxlcyhjb250ZW50OiBzdHJpbmcsIHZhcmlhYmxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IHN0cmluZyB7XG4gIE9iamVjdC5rZXlzKHZhcmlhYmxlcykuc29ydChzb3J0TGVuZ3RoRGVzY2VuZGluZykuZm9yRWFjaCh2YXJpYWJsZU5hbWUgPT4ge1xuICAgIC8vIE5vdGUgdGhhdCB0aGUgcGF0dGVybiB1c2VzIGEgbmVnYXRpdmUgbG9va2FoZWFkIHRvIGV4Y2x1ZGVcbiAgICAvLyB2YXJpYWJsZSBhc3NpZ25tZW50cywgYmVjYXVzZSB0aGV5IGNhbid0IGJlIG1pZ3JhdGVkLlxuICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgXFxcXCQke2VzY2FwZVJlZ0V4cCh2YXJpYWJsZU5hbWUpfSg/IVxcXFxzKzp8OilgLCAnZycpO1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UocmVnZXgsIHZhcmlhYmxlc1t2YXJpYWJsZU5hbWVdKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG4iXX0=