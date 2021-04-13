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
/** Mapping of Material mixins that should be renamed. */
const materialMixins = {
    'mat-core': 'core',
    'mat-core-color': 'core-color',
    'mat-core-theme': 'core-theme',
    'angular-material-theme': 'all-component-themes',
    'angular-material-typography': 'all-component-typographies',
    'angular-material-color': 'all-component-colors',
    'mat-base-typography': 'typography-hierarchy',
    'mat-typography-level-to-styles': 'typography-level',
    'mat-elevation': 'elevation',
    'mat-overridable-elevation': 'overridable-elevation',
    'mat-elevation-transition': 'elevation-transition',
    'mat-ripple': 'ripple',
    'mat-ripple-color': 'ripple-color',
    'mat-ripple-theme': 'ripple-theme',
    'mat-strong-focus-indicators': 'strong-focus-indicators',
    'mat-strong-focus-indicators-color': 'strong-focus-indicators-color',
    'mat-strong-focus-indicators-theme': 'strong-focus-indicators-theme',
    'mat-font-shorthand': 'font-shorthand',
    // The expansion panel is a special case, because the package is called `expansion`, but the
    // mixins were prefixed with `expansion-panel`. This was corrected by the Sass module migration.
    'mat-expansion-panel-theme': 'expansion-theme',
    'mat-expansion-panel-color': 'expansion-color',
    'mat-expansion-panel-typography': 'expansion-typography',
};
// The component themes all follow the same pattern so we can spare ourselves some typing.
[
    'option', 'optgroup', 'pseudo-checkbox', 'autocomplete', 'badge', 'bottom-sheet', 'button',
    'button-toggle', 'card', 'checkbox', 'chips', 'divider', 'table', 'datepicker', 'dialog',
    'grid-list', 'icon', 'input', 'list', 'menu', 'paginator', 'progress-bar', 'progress-spinner',
    'radio', 'select', 'sidenav', 'slide-toggle', 'slider', 'stepper', 'sort', 'tabs', 'toolbar',
    'tooltip', 'snack-bar', 'form-field', 'tree'
].forEach(name => {
    materialMixins[`mat-${name}-theme`] = `${name}-theme`;
    materialMixins[`mat-${name}-color`] = `${name}-color`;
    materialMixins[`mat-${name}-typography`] = `${name}-typography`;
});
/** Mapping of Material functions that should be renamed. */
const materialFunctions = {
    'mat-color': 'get-color-from-palette',
    'mat-contrast': 'get-contrast-color-from-palette',
    'mat-palette': 'define-palette',
    'mat-dark-theme': 'define-dark-theme',
    'mat-light-theme': 'define-light-theme',
    'mat-typography-level': 'define-typography-level',
    'mat-typography-config': 'define-typography-config',
    'mat-font-size': 'font-size',
    'mat-line-height': 'line-height',
    'mat-font-weight': 'font-weight',
    'mat-letter-spacing': 'letter-spacing',
    'mat-font-family': 'font-family',
};
/** Mapping of Material variables that should be renamed. */
const materialVariables = {
    'mat-light-theme-background': 'light-theme-background-palette',
    'mat-dark-theme-background': 'dark-theme-background-palette',
    'mat-light-theme-foreground': 'light-theme-foreground-palette',
    'mat-dark-theme-foreground': 'dark-theme-foreground-palette',
};
// The palettes all follow the same pattern.
[
    'red', 'pink', 'indigo', 'purple', 'deep-purple', 'blue', 'light-blue', 'cyan', 'teal', 'green',
    'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'gray',
    'blue-grey', 'blue-gray'
].forEach(name => materialVariables[`mat-${name}`] = `${name}-palette`);
/** Mapping of CDK variables that should be renamed. */
const cdkVariables = {
    'cdk-z-index-overlay-container': 'overlay-container-z-index',
    'cdk-z-index-overlay': 'overlay-z-index',
    'cdk-z-index-overlay-backdrop': 'overlay-backdrop-z-index',
    'cdk-overlay-dark-backdrop-background': 'overlay-backdrop-color',
};
/** Mapping of CDK mixins that should be renamed. */
const cdkMixins = {
    'cdk-overlay': 'overlay',
    'cdk-a11y': 'a11y-visually-hidden',
    'cdk-high-contrast': 'high-contrast',
    'cdk-text-field-autofill-color': 'text-field-autofill-color',
    // This one was split up into two mixins which is trickier to
    // migrate so for now we forward to the deprecated variant.
    'cdk-text-field': 'text-field',
};
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
 */
function migrateFileContent(content, oldMaterialPrefix, oldCdkPrefix, newMaterialImportPath, newCdkImportPath) {
    const materialResults = detectImports(content, oldMaterialPrefix);
    const cdkResults = detectImports(content, oldCdkPrefix);
    // If there are no imports, we don't need to go further.
    if (materialResults.imports.length > 0 || cdkResults.imports.length > 0) {
        const initialContent = content;
        content = migrateMaterialSymbols(content, newMaterialImportPath, materialResults.namespaces);
        content = migrateCdkSymbols(content, newCdkImportPath, cdkResults.namespaces);
        // Only drop the imports if any of the symbols were used within the file.
        if (content !== initialContent) {
            content = removeStrings(content, materialResults.imports);
            content = removeStrings(content, cdkResults.imports);
            content = content.replace(/^\s+/, '');
        }
    }
    return content;
}
exports.migrateFileContent = migrateFileContent;
/**
 * Counts the number of imports with a specific prefix and extracts their namespaces.
 * @param content File content in which to look for imports.
 * @param prefix Prefix that the imports should start with.
 */
function detectImports(content, prefix) {
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
/** Migrates the Material symbls in a file. */
function migrateMaterialSymbols(content, importPath, namespaces) {
    const initialContent = content;
    const namespace = 'mat';
    // Migrate the mixins.
    content = renameSymbols(content, materialMixins, namespaces, mixinKeyFormatter, getMixinValueFormatter(namespace));
    // Migrate the functions.
    content = renameSymbols(content, materialFunctions, namespaces, functionKeyFormatter, getFunctionValueFormatter(namespace));
    // Migrate the variables.
    content = renameSymbols(content, materialVariables, namespaces, variableKeyFormatter, getVariableValueFormatter(namespace));
    if (content !== initialContent) {
        // Add an import to the new API only if any of the APIs were being used.
        content = insertUseStatement(content, importPath, namespace);
    }
    return content;
}
/** Migrates the CDK symbols in a file. */
function migrateCdkSymbols(content, importPath, namespaces) {
    const initialContent = content;
    const namespace = 'cdk';
    // Migrate the mixins.
    content = renameSymbols(content, cdkMixins, namespaces, mixinKeyFormatter, getMixinValueFormatter(namespace));
    // Migrate the variables.
    content = renameSymbols(content, cdkVariables, namespaces, variableKeyFormatter, getVariableValueFormatter(namespace));
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
function insertUseStatement(content, importPath, namespace) {
    // Sass has a limitation that all `@use` declarations have to come before `@import` so we have
    // to find the first import and insert before it. Technically we can get away with always
    // inserting at 0, but the file may start with something like a license header.
    const newImportIndex = Math.max(0, content.indexOf('@import '));
    return content.slice(0, newImportIndex) + `@use '${importPath}' as ${namespace};\n` +
        content.slice(newImportIndex);
}
/** Formats a migration key as a Sass mixin invocation. */
function mixinKeyFormatter(namespace, name) {
    // Note that adding a `(` at the end of the pattern would be more accurate, but mixin
    // invocations don't necessarily have to include the parantheses. We could add `[(;]`,
    // but then we won't know which character to include in the replacement string.
    return new RegExp(`@include +${escapeRegExp((namespace ? namespace + '.' : '') + name)}`, 'g');
}
/** Returns a function that can be used to format a Sass mixin replacement. */
function getMixinValueFormatter(namespace) {
    // Note that adding a `(` at the end of the pattern would be more accurate,
    // but mixin invocations don't necessarily have to include the parantheses.
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
    return toRemove.reduce((accumulator, current) => accumulator.replace(current, ''), content);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctZ2VuZXJhdGUvdGhlbWluZy1hcGkvbWlncmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHlEQUF5RDtBQUN6RCxNQUFNLGNBQWMsR0FBMkI7SUFDN0MsVUFBVSxFQUFFLE1BQU07SUFDbEIsZ0JBQWdCLEVBQUUsWUFBWTtJQUM5QixnQkFBZ0IsRUFBRSxZQUFZO0lBQzlCLHdCQUF3QixFQUFFLHNCQUFzQjtJQUNoRCw2QkFBNkIsRUFBRSw0QkFBNEI7SUFDM0Qsd0JBQXdCLEVBQUUsc0JBQXNCO0lBQ2hELHFCQUFxQixFQUFFLHNCQUFzQjtJQUM3QyxnQ0FBZ0MsRUFBRSxrQkFBa0I7SUFDcEQsZUFBZSxFQUFFLFdBQVc7SUFDNUIsMkJBQTJCLEVBQUUsdUJBQXVCO0lBQ3BELDBCQUEwQixFQUFFLHNCQUFzQjtJQUNsRCxZQUFZLEVBQUUsUUFBUTtJQUN0QixrQkFBa0IsRUFBRSxjQUFjO0lBQ2xDLGtCQUFrQixFQUFFLGNBQWM7SUFDbEMsNkJBQTZCLEVBQUUseUJBQXlCO0lBQ3hELG1DQUFtQyxFQUFFLCtCQUErQjtJQUNwRSxtQ0FBbUMsRUFBRSwrQkFBK0I7SUFDcEUsb0JBQW9CLEVBQUUsZ0JBQWdCO0lBQ3RDLDRGQUE0RjtJQUM1RixnR0FBZ0c7SUFDaEcsMkJBQTJCLEVBQUUsaUJBQWlCO0lBQzlDLDJCQUEyQixFQUFFLGlCQUFpQjtJQUM5QyxnQ0FBZ0MsRUFBRSxzQkFBc0I7Q0FDekQsQ0FBQztBQUVGLDBGQUEwRjtBQUMxRjtJQUNFLFFBQVEsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUTtJQUMxRixlQUFlLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVB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RUFBRSxDQUFDO1NBQzdFO1FBRUQsMEVBQTBFO1FBQzFFLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBRXBFLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLENBQUMsRUFBRSxlQUFlLENBQUM7Z0JBQ3BFLHVGQUF1RjtpQkFDdEYsT0FBTyxDQUFDLGtDQUFrQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRW5ELGtGQUFrRjtZQUNsRixJQUFJLFFBQVEsS0FBSyxPQUFPLEVBQUU7Z0JBQ3hCLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFdkUsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQ3ZCLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2lCQUM3RDthQUNGO2lCQUFNO2dCQUNMLE9BQU8sUUFBUSxDQUFDO2FBQ2pCO1NBQ0Y7S0FDRjtJQUVELE1BQU0sS0FBSyxDQUFDLDRDQUE0QyxVQUFVLElBQUksQ0FBQyxDQUFDO0FBQzFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqIE1hcHBpbmcgb2YgTWF0ZXJpYWwgbWl4aW5zIHRoYXQgc2hvdWxkIGJlIHJlbmFtZWQuICovXG5jb25zdCBtYXRlcmlhbE1peGluczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgJ21hdC1jb3JlJzogJ2NvcmUnLFxuICAnbWF0LWNvcmUtY29sb3InOiAnY29yZS1jb2xvcicsXG4gICdtYXQtY29yZS10aGVtZSc6ICdjb3JlLXRoZW1lJyxcbiAgJ2FuZ3VsYXItbWF0ZXJpYWwtdGhlbWUnOiAnYWxsLWNvbXBvbmVudC10aGVtZXMnLFxuICAnYW5ndWxhci1tYXRlcmlhbC10eXBvZ3JhcGh5JzogJ2FsbC1jb21wb25lbnQtdHlwb2dyYXBoaWVzJyxcbiAgJ2FuZ3VsYXItbWF0ZXJpYWwtY29sb3InOiAnYWxsLWNvbXBvbmVudC1jb2xvcnMnLFxuICAnbWF0LWJhc2UtdHlwb2dyYXBoeSc6ICd0eXBvZ3JhcGh5LWhpZXJhcmNoeScsXG4gICdtYXQtdHlwb2dyYXBoeS1sZXZlbC10by1zdHlsZXMnOiAndHlwb2dyYXBoeS1sZXZlbCcsXG4gICdtYXQtZWxldmF0aW9uJzogJ2VsZXZhdGlvbicsXG4gICdtYXQtb3ZlcnJpZGFibGUtZWxldmF0aW9uJzogJ292ZXJyaWRhYmxlLWVsZXZhdGlvbicsXG4gICdtYXQtZWxldmF0aW9uLXRyYW5zaXRpb24nOiAnZWxldmF0aW9uLXRyYW5zaXRpb24nLFxuICAnbWF0LXJpcHBsZSc6ICdyaXBwbGUnLFxuICAnbWF0LXJpcHBsZS1jb2xvcic6ICdyaXBwbGUtY29sb3InLFxuICAnbWF0LXJpcHBsZS10aGVtZSc6ICdyaXBwbGUtdGhlbWUnLFxuICAnbWF0LXN0cm9uZy1mb2N1cy1pbmRpY2F0b3JzJzogJ3N0cm9uZy1mb2N1cy1pbmRpY2F0b3JzJyxcbiAgJ21hdC1zdHJvbmctZm9jdXMtaW5kaWNhdG9ycy1jb2xvcic6ICdzdHJvbmctZm9jdXMtaW5kaWNhdG9ycy1jb2xvcicsXG4gICdtYXQtc3Ryb25nLWZvY3VzLWluZGljYXRvcnMtdGhlbWUnOiAnc3Ryb25nLWZvY3VzLWluZGljYXRvcnMtdGhlbWUnLFxuICAnbWF0LWZvbnQtc2hvcnRoYW5kJzogJ2ZvbnQtc2hvcnRoYW5kJyxcbiAgLy8gVGhlIGV4cGFuc2lvbiBwYW5lbCBpcyBhIHNwZWNpYWwgY2FzZSwgYmVjYXVzZSB0aGUgcGFja2FnZSBpcyBjYWxsZWQgYGV4cGFuc2lvbmAsIGJ1dCB0aGVcbiAgLy8gbWl4aW5zIHdlcmUgcHJlZml4ZWQgd2l0aCBgZXhwYW5zaW9uLXBhbmVsYC4gVGhpcyB3YXMgY29ycmVjdGVkIGJ5IHRoZSBTYXNzIG1vZHVsZSBtaWdyYXRpb24uXG4gICdtYXQtZXhwYW5zaW9uLXBhbmVsLXRoZW1lJzogJ2V4cGFuc2lvbi10aGVtZScsXG4gICdtYXQtZXhwYW5zaW9uLXBhbmVsLWNvbG9yJzogJ2V4cGFuc2lvbi1jb2xvcicsXG4gICdtYXQtZXhwYW5zaW9uLXBhbmVsLXR5cG9ncmFwaHknOiAnZXhwYW5zaW9uLXR5cG9ncmFwaHknLFxufTtcblxuLy8gVGhlIGNvbXBvbmVudCB0aGVtZXMgYWxsIGZvbGxvdyB0aGUgc2FtZSBwYXR0ZXJuIHNvIHdlIGNhbiBzcGFyZSBvdXJzZWx2ZXMgc29tZSB0eXBpbmcuXG5bXG4gICdvcHRpb24nLCAnb3B0Z3JvdXAnLCAncHNldWRvLWNoZWNrYm94JywgJ2F1dG9jb21wbGV0ZScsICdiYWRnZScsICdib3R0b20tc2hlZXQnLCAnYnV0dG9uJyxcbiAgJ2J1dHRvbi10b2dnbGUnLCAnY2FyZCcsICdjaGVja2JveCcsICdjaGlwcycsICdkaXZpZGVyJywgJ3RhYmxlJywgJ2RhdGVwaWNrZXInLCAnZGlhbG9nJyxcbiAgJ2dyaWQtbGlzdCcsICdpY29uJywgJ2lucHV0JywgJ2xpc3QnLCAnbWVudScsICdwYWdpbmF0b3InLCAncHJvZ3Jlc3MtYmFyJywgJ3Byb2dyZXNzLXNwaW5uZXInLFxuICAncmFkaW8nLCAnc2VsZWN0JywgJ3NpZGVuYXYnLCAnc2xpZGUtdG9nZ2xlJywgJ3NsaWRlcicsICdzdGVwcGVyJywgJ3NvcnQnLCAndGFicycsICd0b29sYmFyJyxcbiAgJ3Rvb2x0aXAnLCAnc25hY2stYmFyJywgJ2Zvcm0tZmllbGQnLCAndHJlZSdcbl0uZm9yRWFjaChuYW1lID0+IHtcbiAgbWF0ZXJpYWxNaXhpbnNbYG1hdC0ke25hbWV9LXRoZW1lYF0gPSBgJHtuYW1lfS10aGVtZWA7XG4gIG1hdGVyaWFsTWl4aW5zW2BtYXQtJHtuYW1lfS1jb2xvcmBdID0gYCR7bmFtZX0tY29sb3JgO1xuICBtYXRlcmlhbE1peGluc1tgbWF0LSR7bmFtZX0tdHlwb2dyYXBoeWBdID0gYCR7bmFtZX0tdHlwb2dyYXBoeWA7XG59KTtcblxuLyoqIE1hcHBpbmcgb2YgTWF0ZXJpYWwgZnVuY3Rpb25zIHRoYXQgc2hvdWxkIGJlIHJlbmFtZWQuICovXG5jb25zdCBtYXRlcmlhbEZ1bmN0aW9uczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgJ21hdC1jb2xvcic6ICdnZXQtY29sb3ItZnJvbS1wYWxldHRlJyxcbiAgJ21hdC1jb250cmFzdCc6ICdnZXQtY29udHJhc3QtY29sb3ItZnJvbS1wYWxldHRlJyxcbiAgJ21hdC1wYWxldHRlJzogJ2RlZmluZS1wYWxldHRlJyxcbiAgJ21hdC1kYXJrLXRoZW1lJzogJ2RlZmluZS1kYXJrLXRoZW1lJyxcbiAgJ21hdC1saWdodC10aGVtZSc6ICdkZWZpbmUtbGlnaHQtdGhlbWUnLFxuICAnbWF0LXR5cG9ncmFwaHktbGV2ZWwnOiAnZGVmaW5lLXR5cG9ncmFwaHktbGV2ZWwnLFxuICAnbWF0LXR5cG9ncmFwaHktY29uZmlnJzogJ2RlZmluZS10eXBvZ3JhcGh5LWNvbmZpZycsXG4gICdtYXQtZm9udC1zaXplJzogJ2ZvbnQtc2l6ZScsXG4gICdtYXQtbGluZS1oZWlnaHQnOiAnbGluZS1oZWlnaHQnLFxuICAnbWF0LWZvbnQtd2VpZ2h0JzogJ2ZvbnQtd2VpZ2h0JyxcbiAgJ21hdC1sZXR0ZXItc3BhY2luZyc6ICdsZXR0ZXItc3BhY2luZycsXG4gICdtYXQtZm9udC1mYW1pbHknOiAnZm9udC1mYW1pbHknLFxufTtcblxuLyoqIE1hcHBpbmcgb2YgTWF0ZXJpYWwgdmFyaWFibGVzIHRoYXQgc2hvdWxkIGJlIHJlbmFtZWQuICovXG5jb25zdCBtYXRlcmlhbFZhcmlhYmxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgJ21hdC1saWdodC10aGVtZS1iYWNrZ3JvdW5kJzogJ2xpZ2h0LXRoZW1lLWJhY2tncm91bmQtcGFsZXR0ZScsXG4gICdtYXQtZGFyay10aGVtZS1iYWNrZ3JvdW5kJzogJ2RhcmstdGhlbWUtYmFja2dyb3VuZC1wYWxldHRlJyxcbiAgJ21hdC1saWdodC10aGVtZS1mb3JlZ3JvdW5kJzogJ2xpZ2h0LXRoZW1lLWZvcmVncm91bmQtcGFsZXR0ZScsXG4gICdtYXQtZGFyay10aGVtZS1mb3JlZ3JvdW5kJzogJ2RhcmstdGhlbWUtZm9yZWdyb3VuZC1wYWxldHRlJyxcbn07XG5cbi8vIFRoZSBwYWxldHRlcyBhbGwgZm9sbG93IHRoZSBzYW1lIHBhdHRlcm4uXG5bXG4gICdyZWQnLCAncGluaycsICdpbmRpZ28nLCAncHVycGxlJywgJ2RlZXAtcHVycGxlJywgJ2JsdWUnLCAnbGlnaHQtYmx1ZScsICdjeWFuJywgJ3RlYWwnLCAnZ3JlZW4nLFxuICAnbGlnaHQtZ3JlZW4nLCAnbGltZScsICd5ZWxsb3cnLCAnYW1iZXInLCAnb3JhbmdlJywgJ2RlZXAtb3JhbmdlJywgJ2Jyb3duJywgJ2dyZXknLCAnZ3JheScsXG4gICdibHVlLWdyZXknLCAnYmx1ZS1ncmF5J1xuXS5mb3JFYWNoKG5hbWUgPT4gbWF0ZXJpYWxWYXJpYWJsZXNbYG1hdC0ke25hbWV9YF0gPSBgJHtuYW1lfS1wYWxldHRlYCk7XG5cbi8qKiBNYXBwaW5nIG9mIENESyB2YXJpYWJsZXMgdGhhdCBzaG91bGQgYmUgcmVuYW1lZC4gKi9cbmNvbnN0IGNka1ZhcmlhYmxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgJ2Nkay16LWluZGV4LW92ZXJsYXktY29udGFpbmVyJzogJ292ZXJsYXktY29udGFpbmVyLXotaW5kZXgnLFxuICAnY2RrLXotaW5kZXgtb3ZlcmxheSc6ICdvdmVybGF5LXotaW5kZXgnLFxuICAnY2RrLXotaW5kZXgtb3ZlcmxheS1iYWNrZHJvcCc6ICdvdmVybGF5LWJhY2tkcm9wLXotaW5kZXgnLFxuICAnY2RrLW92ZXJsYXktZGFyay1iYWNrZHJvcC1iYWNrZ3JvdW5kJzogJ292ZXJsYXktYmFja2Ryb3AtY29sb3InLFxufTtcblxuLyoqIE1hcHBpbmcgb2YgQ0RLIG1peGlucyB0aGF0IHNob3VsZCBiZSByZW5hbWVkLiAqL1xuY29uc3QgY2RrTWl4aW5zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnY2RrLW92ZXJsYXknOiAnb3ZlcmxheScsXG4gICdjZGstYTExeSc6ICdhMTF5LXZpc3VhbGx5LWhpZGRlbicsXG4gICdjZGstaGlnaC1jb250cmFzdCc6ICdoaWdoLWNvbnRyYXN0JyxcbiAgJ2Nkay10ZXh0LWZpZWxkLWF1dG9maWxsLWNvbG9yJzogJ3RleHQtZmllbGQtYXV0b2ZpbGwtY29sb3InLFxuICAvLyBUaGlzIG9uZSB3YXMgc3BsaXQgdXAgaW50byB0d28gbWl4aW5zIHdoaWNoIGlzIHRyaWNraWVyIHRvXG4gIC8vIG1pZ3JhdGUgc28gZm9yIG5vdyB3ZSBmb3J3YXJkIHRvIHRoZSBkZXByZWNhdGVkIHZhcmlhbnQuXG4gICdjZGstdGV4dC1maWVsZCc6ICd0ZXh0LWZpZWxkJyxcbn07XG5cbi8qKlxuICogTWlncmF0ZXMgdGhlIGNvbnRlbnQgb2YgYSBmaWxlIHRvIHRoZSBuZXcgdGhlbWluZyBBUEkuIE5vdGUgdGhhdCB0aGlzIG1pZ3JhdGlvbiBpcyB1c2luZyBwbGFpblxuICogc3RyaW5nIG1hbmlwdWxhdGlvbiwgcmF0aGVyIHRoYW4gdGhlIEFTVCBmcm9tIFBvc3RDU1MgYW5kIHRoZSBzY2hlbWF0aWNzIHN0cmluZyBtYW5pcHVsYXRpb25cbiAqIEFQSXMsIGJlY2F1c2UgaXQgYWxsb3dzIHVzIHRvIHJ1biBpdCBpbnNpZGUgZzMgYW5kIHRvIGF2b2lkIGludHJvZHVjaW5nIG5ldyBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0gY29udGVudCBDb250ZW50IG9mIHRoZSBmaWxlLlxuICogQHBhcmFtIG9sZE1hdGVyaWFsUHJlZml4IFByZWZpeCB3aXRoIHdoaWNoIHRoZSBvbGQgTWF0ZXJpYWwgaW1wb3J0cyBzaG91bGQgc3RhcnQuXG4gKiAgIEhhcyB0byBlbmQgd2l0aCBhIHNsYXNoLiBFLmcuIGlmIGBAaW1wb3J0ICd+QGFuZ3VsYXIvbWF0ZXJpYWwvdGhlbWluZydgIHNob3VsZCBiZVxuICogICBtYXRjaGVkLCB0aGUgcHJlZml4IHdvdWxkIGJlIGB+QGFuZ3VsYXIvbWF0ZXJpYWwvYC5cbiAqIEBwYXJhbSBvbGRDZGtQcmVmaXggUHJlZml4IHdpdGggd2hpY2ggdGhlIG9sZCBDREsgaW1wb3J0cyBzaG91bGQgc3RhcnQuXG4gKiAgIEhhcyB0byBlbmQgd2l0aCBhIHNsYXNoLiBFLmcuIGlmIGBAaW1wb3J0ICd+QGFuZ3VsYXIvY2RrL292ZXJsYXknYCBzaG91bGQgYmVcbiAqICAgbWF0Y2hlZCwgdGhlIHByZWZpeCB3b3VsZCBiZSBgfkBhbmd1bGFyL2Nkay9gLlxuICogQHBhcmFtIG5ld01hdGVyaWFsSW1wb3J0UGF0aCBOZXcgaW1wb3J0IHRvIHRoZSBNYXRlcmlhbCB0aGVtaW5nIEFQSSAoZS5nLiBgfkBhbmd1bGFyL21hdGVyaWFsYCkuXG4gKiBAcGFyYW0gbmV3Q2RrSW1wb3J0UGF0aCBOZXcgaW1wb3J0IHRvIHRoZSBDREsgU2FzcyBBUElzIChlLmcuIGB+QGFuZ3VsYXIvY2RrYCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaWdyYXRlRmlsZUNvbnRlbnQoY29udGVudDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRNYXRlcmlhbFByZWZpeDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRDZGtQcmVmaXg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3TWF0ZXJpYWxJbXBvcnRQYXRoOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Nka0ltcG9ydFBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IG1hdGVyaWFsUmVzdWx0cyA9IGRldGVjdEltcG9ydHMoY29udGVudCwgb2xkTWF0ZXJpYWxQcmVmaXgpO1xuICBjb25zdCBjZGtSZXN1bHRzID0gZGV0ZWN0SW1wb3J0cyhjb250ZW50LCBvbGRDZGtQcmVmaXgpO1xuXG4gIC8vIElmIHRoZXJlIGFyZSBubyBpbXBvcnRzLCB3ZSBkb24ndCBuZWVkIHRvIGdvIGZ1cnRoZXIuXG4gIGlmIChtYXRlcmlhbFJlc3VsdHMuaW1wb3J0cy5sZW5ndGggPiAwIHx8IGNka1Jlc3VsdHMuaW1wb3J0cy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgaW5pdGlhbENvbnRlbnQgPSBjb250ZW50O1xuICAgIGNvbnRlbnQgPSBtaWdyYXRlTWF0ZXJpYWxTeW1ib2xzKGNvbnRlbnQsIG5ld01hdGVyaWFsSW1wb3J0UGF0aCwgbWF0ZXJpYWxSZXN1bHRzLm5hbWVzcGFjZXMpO1xuICAgIGNvbnRlbnQgPSBtaWdyYXRlQ2RrU3ltYm9scyhjb250ZW50LCBuZXdDZGtJbXBvcnRQYXRoLCBjZGtSZXN1bHRzLm5hbWVzcGFjZXMpO1xuXG4gICAgLy8gT25seSBkcm9wIHRoZSBpbXBvcnRzIGlmIGFueSBvZiB0aGUgc3ltYm9scyB3ZXJlIHVzZWQgd2l0aGluIHRoZSBmaWxlLlxuICAgIGlmIChjb250ZW50ICE9PSBpbml0aWFsQ29udGVudCkge1xuICAgICAgY29udGVudCA9IHJlbW92ZVN0cmluZ3MoY29udGVudCwgbWF0ZXJpYWxSZXN1bHRzLmltcG9ydHMpO1xuICAgICAgY29udGVudCA9IHJlbW92ZVN0cmluZ3MoY29udGVudCwgY2RrUmVzdWx0cy5pbXBvcnRzKTtcbiAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoL15cXHMrLywgJycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIENvdW50cyB0aGUgbnVtYmVyIG9mIGltcG9ydHMgd2l0aCBhIHNwZWNpZmljIHByZWZpeCBhbmQgZXh0cmFjdHMgdGhlaXIgbmFtZXNwYWNlcy5cbiAqIEBwYXJhbSBjb250ZW50IEZpbGUgY29udGVudCBpbiB3aGljaCB0byBsb29rIGZvciBpbXBvcnRzLlxuICogQHBhcmFtIHByZWZpeCBQcmVmaXggdGhhdCB0aGUgaW1wb3J0cyBzaG91bGQgc3RhcnQgd2l0aC5cbiAqL1xuZnVuY3Rpb24gZGV0ZWN0SW1wb3J0cyhjb250ZW50OiBzdHJpbmcsIHByZWZpeDogc3RyaW5nKToge2ltcG9ydHM6IHN0cmluZ1tdLCBuYW1lc3BhY2VzOiBzdHJpbmdbXX0ge1xuICBpZiAocHJlZml4W3ByZWZpeC5sZW5ndGggLSAxXSAhPT0gJy8nKSB7XG4gICAgLy8gU29tZSBvZiB0aGUgbG9naWMgZnVydGhlciBkb3duIG1ha2VzIGFzc3VtcHRpb25zIGFib3V0IHRoZSBpbXBvcnQgZGVwdGguXG4gICAgdGhyb3cgRXJyb3IoYFByZWZpeCBcIiR7cHJlZml4fVwiIGhhcyB0byBlbmQgaW4gYSBzbGFzaC5gKTtcbiAgfVxuXG4gIC8vIExpc3Qgb2YgYEB1c2VgIG5hbWVzcGFjZXMgZnJvbSB3aGljaCBBbmd1bGFyIENESy9NYXRlcmlhbCBBUElzIG1heSBiZSByZWZlcmVuY2VkLlxuICAvLyBTaW5jZSB3ZSBrbm93IHRoYXQgdGhlIGxpYnJhcnkgZG9lc24ndCBoYXZlIGFueSBuYW1lIGNvbGxpc2lvbnMsIHdlIGNhbiB0cmVhdCBhbGwgb2YgdGhlc2VcbiAgLy8gbmFtZXNwYWNlcyBhcyBlcXVpdmFsZW50LlxuICBjb25zdCBuYW1lc3BhY2VzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBpbXBvcnRzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBwYXR0ZXJuID0gbmV3IFJlZ0V4cChgQChpbXBvcnR8dXNlKSArWydcIl0ke2VzY2FwZVJlZ0V4cChwcmVmaXgpfS4qWydcIl0uKjs/XFxuYCwgJ2cnKTtcbiAgbGV0IG1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsID0gbnVsbDtcblxuICB3aGlsZSAobWF0Y2ggPSBwYXR0ZXJuLmV4ZWMoY29udGVudCkpIHtcbiAgICBjb25zdCBbZnVsbEltcG9ydCwgdHlwZV0gPSBtYXRjaDtcblxuICAgIGlmICh0eXBlID09PSAndXNlJykge1xuICAgICAgY29uc3QgbmFtZXNwYWNlID0gZXh0cmFjdE5hbWVzcGFjZUZyb21Vc2VTdGF0ZW1lbnQoZnVsbEltcG9ydCk7XG5cbiAgICAgIGlmIChuYW1lc3BhY2VzLmluZGV4T2YobmFtZXNwYWNlKSA9PT0gLTEpIHtcbiAgICAgICAgbmFtZXNwYWNlcy5wdXNoKG5hbWVzcGFjZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW1wb3J0cy5wdXNoKGZ1bGxJbXBvcnQpO1xuICB9XG5cbiAgcmV0dXJuIHtpbXBvcnRzLCBuYW1lc3BhY2VzfTtcbn1cblxuLyoqIE1pZ3JhdGVzIHRoZSBNYXRlcmlhbCBzeW1ibHMgaW4gYSBmaWxlLiAqL1xuZnVuY3Rpb24gbWlncmF0ZU1hdGVyaWFsU3ltYm9scyhjb250ZW50OiBzdHJpbmcsIGltcG9ydFBhdGg6IHN0cmluZywgbmFtZXNwYWNlczogc3RyaW5nW10pOiBzdHJpbmcge1xuICBjb25zdCBpbml0aWFsQ29udGVudCA9IGNvbnRlbnQ7XG4gIGNvbnN0IG5hbWVzcGFjZSA9ICdtYXQnO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIG1peGlucy5cbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgbWF0ZXJpYWxNaXhpbnMsIG5hbWVzcGFjZXMsIG1peGluS2V5Rm9ybWF0dGVyLFxuICAgIGdldE1peGluVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlKSk7XG5cbiAgLy8gTWlncmF0ZSB0aGUgZnVuY3Rpb25zLlxuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhjb250ZW50LCBtYXRlcmlhbEZ1bmN0aW9ucywgbmFtZXNwYWNlcywgZnVuY3Rpb25LZXlGb3JtYXR0ZXIsXG4gICAgZ2V0RnVuY3Rpb25WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBNaWdyYXRlIHRoZSB2YXJpYWJsZXMuXG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIG1hdGVyaWFsVmFyaWFibGVzLCBuYW1lc3BhY2VzLCB2YXJpYWJsZUtleUZvcm1hdHRlcixcbiAgICBnZXRWYXJpYWJsZVZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSkpO1xuXG4gIGlmIChjb250ZW50ICE9PSBpbml0aWFsQ29udGVudCkge1xuICAgIC8vIEFkZCBhbiBpbXBvcnQgdG8gdGhlIG5ldyBBUEkgb25seSBpZiBhbnkgb2YgdGhlIEFQSXMgd2VyZSBiZWluZyB1c2VkLlxuICAgIGNvbnRlbnQgPSBpbnNlcnRVc2VTdGF0ZW1lbnQoY29udGVudCwgaW1wb3J0UGF0aCwgbmFtZXNwYWNlKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKiogTWlncmF0ZXMgdGhlIENESyBzeW1ib2xzIGluIGEgZmlsZS4gKi9cbmZ1bmN0aW9uIG1pZ3JhdGVDZGtTeW1ib2xzKGNvbnRlbnQ6IHN0cmluZywgaW1wb3J0UGF0aDogc3RyaW5nLCBuYW1lc3BhY2VzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIGNvbnN0IGluaXRpYWxDb250ZW50ID0gY29udGVudDtcbiAgY29uc3QgbmFtZXNwYWNlID0gJ2Nkayc7XG5cbiAgLy8gTWlncmF0ZSB0aGUgbWl4aW5zLlxuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhjb250ZW50LCBjZGtNaXhpbnMsIG5hbWVzcGFjZXMsIG1peGluS2V5Rm9ybWF0dGVyLFxuICAgIGdldE1peGluVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlKSk7XG5cbiAgLy8gTWlncmF0ZSB0aGUgdmFyaWFibGVzLlxuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhjb250ZW50LCBjZGtWYXJpYWJsZXMsIG5hbWVzcGFjZXMsIHZhcmlhYmxlS2V5Rm9ybWF0dGVyLFxuICAgIGdldFZhcmlhYmxlVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlKSk7XG5cbiAgLy8gUHJldmlvdXNseSB0aGUgQ0RLIHN5bWJvbHMgd2VyZSBleHBvc2VkIHRocm91Z2ggYG1hdGVyaWFsL3RoZW1pbmdgLCBidXQgbm93IHdlIGhhdmUgYVxuICAvLyBkZWRpY2F0ZWQgZW50cnlwb2ludCBmb3IgdGhlIENESy4gT25seSBhZGQgYW4gaW1wb3J0IGZvciBpdCBpZiBhbnkgb2YgdGhlIHN5bWJvbHMgYXJlIHVzZWQuXG4gIGlmIChjb250ZW50ICE9PSBpbml0aWFsQ29udGVudCkge1xuICAgIGNvbnRlbnQgPSBpbnNlcnRVc2VTdGF0ZW1lbnQoY29udGVudCwgaW1wb3J0UGF0aCwgbmFtZXNwYWNlKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIFJlbmFtZXMgYWxsIFNhc3Mgc3ltYm9scyBpbiBhIGZpbGUgYmFzZWQgb24gYSBwcmUtZGVmaW5lZCBtYXBwaW5nLlxuICogQHBhcmFtIGNvbnRlbnQgQ29udGVudCBvZiBhIGZpbGUgdG8gYmUgbWlncmF0ZWQuXG4gKiBAcGFyYW0gbWFwcGluZyBNYXBwaW5nIGJldHdlZW4gc3ltYm9sIG5hbWVzIGFuZCB0aGVpciByZXBsYWNlbWVudHMuXG4gKiBAcGFyYW0gZ2V0S2V5UGF0dGVybiBGdW5jdGlvbiB1c2VkIHRvIHR1cm4gZWFjaCBvZiB0aGUga2V5cyBpbnRvIGEgcmVnZXguXG4gKiBAcGFyYW0gZm9ybWF0VmFsdWUgRm9ybWF0cyB0aGUgdmFsdWUgdGhhdCB3aWxsIHJlcGxhY2UgYW55IG1hdGNoZXMgb2YgdGhlIHBhdHRlcm4gcmV0dXJuZWQgYnlcbiAqICBgZ2V0S2V5UGF0dGVybmAuXG4gKi9cbmZ1bmN0aW9uIHJlbmFtZVN5bWJvbHMoY29udGVudDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICBtYXBwaW5nOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2VzOiBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgZ2V0S2V5UGF0dGVybjogKG5hbWVzcGFjZTogc3RyaW5nfG51bGwsIGtleTogc3RyaW5nKSA9PiBSZWdFeHAsXG4gICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdFZhbHVlOiAoa2V5OiBzdHJpbmcpID0+IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFRoZSBudWxsIGF0IHRoZSBlbmQgaXMgc28gdGhhdCB3ZSBtYWtlIG9uZSBsYXN0IHBhc3MgdG8gY292ZXIgbm9uLW5hbWVzcGFjZWQgc3ltYm9scy5cbiAgWy4uLm5hbWVzcGFjZXMuc2xpY2UoKS5zb3J0KHNvcnRMZW5ndGhEZXNjZW5kaW5nKSwgbnVsbF0uZm9yRWFjaChuYW1lc3BhY2UgPT4ge1xuICAgIC8vIE1pZ3JhdGUgdGhlIGxvbmdlc3Qga2V5cyBmaXJzdCBzbyB0aGF0IG91ciByZWdleC1iYXNlZCByZXBsYWNlbWVudHMgZG9uJ3QgYWNjaWRlbnRhbGx5XG4gICAgLy8gY2FwdHVyZSBrZXlzIHRoYXQgY29udGFpbiBvdGhlciBrZXlzLiBFLmcuIGAkbWF0LWJsdWVgIGlzIGNvbnRhaW5lZCB3aXRoaW4gYCRtYXQtYmx1ZS1ncmV5YC5cbiAgICBPYmplY3Qua2V5cyhtYXBwaW5nKS5zb3J0KHNvcnRMZW5ndGhEZXNjZW5kaW5nKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCBwYXR0ZXJuID0gZ2V0S2V5UGF0dGVybihuYW1lc3BhY2UsIGtleSk7XG5cbiAgICAgIC8vIFNhbml0eSBjaGVjayBzaW5jZSBub24tZ2xvYmFsIHJlZ2V4ZXMgd2lsbCBvbmx5IHJlcGxhY2UgdGhlIGZpcnN0IG1hdGNoLlxuICAgICAgaWYgKHBhdHRlcm4uZmxhZ3MuaW5kZXhPZignZycpID09PSAtMSkge1xuICAgICAgICB0aHJvdyBFcnJvcignUmVwbGFjZW1lbnQgcGF0dGVybiBtdXN0IGJlIGdsb2JhbC4nKTtcbiAgICAgIH1cblxuICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZShwYXR0ZXJuLCBmb3JtYXRWYWx1ZShtYXBwaW5nW2tleV0pKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKiBJbnNlcnRzIGFuIGBAdXNlYCBzdGF0ZW1lbnQgaW4gYSBzdHJpbmcuICovXG5mdW5jdGlvbiBpbnNlcnRVc2VTdGF0ZW1lbnQoY29udGVudDogc3RyaW5nLCBpbXBvcnRQYXRoOiBzdHJpbmcsIG5hbWVzcGFjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gU2FzcyBoYXMgYSBsaW1pdGF0aW9uIHRoYXQgYWxsIGBAdXNlYCBkZWNsYXJhdGlvbnMgaGF2ZSB0byBjb21lIGJlZm9yZSBgQGltcG9ydGAgc28gd2UgaGF2ZVxuICAvLyB0byBmaW5kIHRoZSBmaXJzdCBpbXBvcnQgYW5kIGluc2VydCBiZWZvcmUgaXQuIFRlY2huaWNhbGx5IHdlIGNhbiBnZXQgYXdheSB3aXRoIGFsd2F5c1xuICAvLyBpbnNlcnRpbmcgYXQgMCwgYnV0IHRoZSBmaWxlIG1heSBzdGFydCB3aXRoIHNvbWV0aGluZyBsaWtlIGEgbGljZW5zZSBoZWFkZXIuXG4gIGNvbnN0IG5ld0ltcG9ydEluZGV4ID0gTWF0aC5tYXgoMCwgY29udGVudC5pbmRleE9mKCdAaW1wb3J0ICcpKTtcbiAgcmV0dXJuIGNvbnRlbnQuc2xpY2UoMCwgbmV3SW1wb3J0SW5kZXgpICsgYEB1c2UgJyR7aW1wb3J0UGF0aH0nIGFzICR7bmFtZXNwYWNlfTtcXG5gICtcbiAgICAgICAgIGNvbnRlbnQuc2xpY2UobmV3SW1wb3J0SW5kZXgpO1xufVxuXG4vKiogRm9ybWF0cyBhIG1pZ3JhdGlvbiBrZXkgYXMgYSBTYXNzIG1peGluIGludm9jYXRpb24uICovXG5mdW5jdGlvbiBtaXhpbktleUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZ3xudWxsLCBuYW1lOiBzdHJpbmcpOiBSZWdFeHAge1xuICAvLyBOb3RlIHRoYXQgYWRkaW5nIGEgYChgIGF0IHRoZSBlbmQgb2YgdGhlIHBhdHRlcm4gd291bGQgYmUgbW9yZSBhY2N1cmF0ZSwgYnV0IG1peGluXG4gIC8vIGludm9jYXRpb25zIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgdG8gaW5jbHVkZSB0aGUgcGFyYW50aGVzZXMuIFdlIGNvdWxkIGFkZCBgWyg7XWAsXG4gIC8vIGJ1dCB0aGVuIHdlIHdvbid0IGtub3cgd2hpY2ggY2hhcmFjdGVyIHRvIGluY2x1ZGUgaW4gdGhlIHJlcGxhY2VtZW50IHN0cmluZy5cbiAgcmV0dXJuIG5ldyBSZWdFeHAoYEBpbmNsdWRlICske2VzY2FwZVJlZ0V4cCgobmFtZXNwYWNlID8gbmFtZXNwYWNlICsgJy4nIDogJycpICsgbmFtZSl9YCwgJ2cnKTtcbn1cblxuLyoqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZvcm1hdCBhIFNhc3MgbWl4aW4gcmVwbGFjZW1lbnQuICovXG5mdW5jdGlvbiBnZXRNaXhpblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nKTogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgLy8gTm90ZSB0aGF0IGFkZGluZyBhIGAoYCBhdCB0aGUgZW5kIG9mIHRoZSBwYXR0ZXJuIHdvdWxkIGJlIG1vcmUgYWNjdXJhdGUsXG4gIC8vIGJ1dCBtaXhpbiBpbnZvY2F0aW9ucyBkb24ndCBuZWNlc3NhcmlseSBoYXZlIHRvIGluY2x1ZGUgdGhlIHBhcmFudGhlc2VzLlxuICByZXR1cm4gbmFtZSA9PiBgQGluY2x1ZGUgJHtuYW1lc3BhY2V9LiR7bmFtZX1gO1xufVxuXG4vKiogRm9ybWF0cyBhIG1pZ3JhdGlvbiBrZXkgYXMgYSBTYXNzIGZ1bmN0aW9uIGludm9jYXRpb24uICovXG5mdW5jdGlvbiBmdW5jdGlvbktleUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZ3xudWxsLCBuYW1lOiBzdHJpbmcpOiBSZWdFeHAge1xuICByZXR1cm4gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAoYCR7bmFtZXNwYWNlID8gbmFtZXNwYWNlICsgJy4nIDogJyd9JHtuYW1lfShgKSwgJ2cnKTtcbn1cblxuLyoqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZvcm1hdCBhIFNhc3MgZnVuY3Rpb24gcmVwbGFjZW1lbnQuICovXG5mdW5jdGlvbiBnZXRGdW5jdGlvblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nKTogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUgPT4gYCR7bmFtZXNwYWNlfS4ke25hbWV9KGA7XG59XG5cbi8qKiBGb3JtYXRzIGEgbWlncmF0aW9uIGtleSBhcyBhIFNhc3MgdmFyaWFibGUuICovXG5mdW5jdGlvbiB2YXJpYWJsZUtleUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZ3xudWxsLCBuYW1lOiBzdHJpbmcpOiBSZWdFeHAge1xuICByZXR1cm4gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAoYCR7bmFtZXNwYWNlID8gbmFtZXNwYWNlICsgJy4nIDogJyd9JCR7bmFtZX1gKSwgJ2cnKTtcbn1cblxuLyoqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZvcm1hdCBhIFNhc3MgdmFyaWFibGUgcmVwbGFjZW1lbnQuICovXG5mdW5jdGlvbiBnZXRWYXJpYWJsZVZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nKTogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUgPT4gYCR7bmFtZXNwYWNlfS4kJHtuYW1lfWA7XG59XG5cbi8qKiBFc2NhcGVzIHNwZWNpYWwgcmVnZXggY2hhcmFjdGVycyBpbiBhIHN0cmluZy4gKi9cbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFsuKis/Xj0hOiR7fSgpfFtcXF1cXC9cXFxcXSkvZywgJ1xcXFwkMScpO1xufVxuXG4vKiogVXNlZCB3aXRoIGBBcnJheS5wcm90b3R5cGUuc29ydGAgdG8gb3JkZXIgc3RyaW5ncyBpbiBkZXNjZW5kaW5nIGxlbmd0aC4gKi9cbmZ1bmN0aW9uIHNvcnRMZW5ndGhEZXNjZW5kaW5nKGE6IHN0cmluZywgYjogc3RyaW5nKSB7XG4gIHJldHVybiBiLmxlbmd0aCAtIGEubGVuZ3RoO1xufVxuXG4vKiogUmVtb3ZlcyBhbGwgc3RyaW5ncyBmcm9tIGFub3RoZXIgc3RyaW5nLiAqL1xuZnVuY3Rpb24gcmVtb3ZlU3RyaW5ncyhjb250ZW50OiBzdHJpbmcsIHRvUmVtb3ZlOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIHJldHVybiB0b1JlbW92ZS5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBjdXJyZW50KSA9PiBhY2N1bXVsYXRvci5yZXBsYWNlKGN1cnJlbnQsICcnKSwgY29udGVudCk7XG59XG5cbi8qKiBQYXJzZXMgb3V0IHRoZSBuYW1lc3BhY2UgZnJvbSBhIFNhc3MgYEB1c2VgIHN0YXRlbWVudC4gKi9cbmZ1bmN0aW9uIGV4dHJhY3ROYW1lc3BhY2VGcm9tVXNlU3RhdGVtZW50KGZ1bGxJbXBvcnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGNsb3NlUXVvdGVJbmRleCA9IE1hdGgubWF4KGZ1bGxJbXBvcnQubGFzdEluZGV4T2YoYFwiYCksIGZ1bGxJbXBvcnQubGFzdEluZGV4T2YoYCdgKSk7XG5cbiAgaWYgKGNsb3NlUXVvdGVJbmRleCA+IC0xKSB7XG4gICAgY29uc3QgYXNFeHByZXNzaW9uID0gJ2FzICc7XG4gICAgY29uc3QgYXNJbmRleCA9IGZ1bGxJbXBvcnQuaW5kZXhPZihhc0V4cHJlc3Npb24sIGNsb3NlUXVvdGVJbmRleCk7XG5cbiAgICAvLyBJZiB3ZSBmb3VuZCBhbiBgIGFzIGAgZXhwcmVzc2lvbiwgd2UgY29uc2lkZXIgdGhlIHJlc3Qgb2YgdGhlIHRleHQgYXMgdGhlIG5hbWVzcGFjZS5cbiAgICBpZiAoYXNJbmRleCA+IC0xKSB7XG4gICAgICByZXR1cm4gZnVsbEltcG9ydC5zbGljZShhc0luZGV4ICsgYXNFeHByZXNzaW9uLmxlbmd0aCkuc3BsaXQoJzsnKVswXS50cmltKCk7XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlIHRoZSBuYW1lc3BhY2UgaXMgdGhlIG5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBiZWluZyBpbXBvcnRlZC5cbiAgICBjb25zdCBsYXN0U2xhc2hJbmRleCA9IGZ1bGxJbXBvcnQubGFzdEluZGV4T2YoJy8nLCBjbG9zZVF1b3RlSW5kZXgpO1xuXG4gICAgaWYgKGxhc3RTbGFzaEluZGV4ID4gLTEpIHtcbiAgICAgIGNvbnN0IGZpbGVOYW1lID0gZnVsbEltcG9ydC5zbGljZShsYXN0U2xhc2hJbmRleCArIDEsIGNsb3NlUXVvdGVJbmRleClcbiAgICAgICAgLy8gU2FzcyBhbGxvd3MgZm9yIGxlYWRpbmcgdW5kZXJzY29yZXMgdG8gYmUgb21pdHRlZCBhbmQgaXQgdGVjaG5pY2FsbHkgc3VwcG9ydHMgLnNjc3MuXG4gICAgICAgIC5yZXBsYWNlKC9eX3woXFwuaW1wb3J0KT9cXC5zY3NzJHxcXC5pbXBvcnQkL2csICcnKTtcblxuICAgICAgLy8gU2FzcyBpZ25vcmVzIGAvaW5kZXhgIGFuZCBpbmZlcnMgdGhlIG5hbWVzcGFjZSBhcyB0aGUgbmV4dCBzZWdtZW50IGluIHRoZSBwYXRoLlxuICAgICAgaWYgKGZpbGVOYW1lID09PSAnaW5kZXgnKSB7XG4gICAgICAgIGNvbnN0IG5leHRTbGFzaEluZGV4ID0gZnVsbEltcG9ydC5sYXN0SW5kZXhPZignLycsIGxhc3RTbGFzaEluZGV4IC0gMSk7XG5cbiAgICAgICAgaWYgKG5leHRTbGFzaEluZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gZnVsbEltcG9ydC5zbGljZShuZXh0U2xhc2hJbmRleCArIDEsIGxhc3RTbGFzaEluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZpbGVOYW1lO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRocm93IEVycm9yKGBDb3VsZCBub3QgZXh0cmFjdCBuYW1lc3BhY2UgZnJvbSBpbXBvcnQgXCIke2Z1bGxJbXBvcnR9XCIuYCk7XG59XG4iXX0=