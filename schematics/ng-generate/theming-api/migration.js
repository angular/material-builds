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
    // Drop the CDK imports and detect their namespaces.
    const cdkResults = detectAndDropImports(content, oldCdkPrefix);
    content = cdkResults.content;
    // Drop the Material imports and detect their namespaces.
    const materialResults = detectAndDropImports(content, oldMaterialPrefix);
    content = materialResults.content;
    // If nothing has changed, then the file doesn't import the Material theming API.
    if (materialResults.hasChanged || cdkResults.hasChanged) {
        // Replacing the imports may have resulted in leading whitespace.
        content = content.replace(/^\s+/, '');
        content = migrateCdkSymbols(content, newCdkImportPath, cdkResults.namespaces);
        content = migrateMaterialSymbols(content, newMaterialImportPath, materialResults.namespaces);
    }
    return content;
}
exports.migrateFileContent = migrateFileContent;
/**
 * Finds all of the imports matching a prefix, removes them from
 * the content string and returns some information about them.
 * @param content Content from which to remove the imports.
 * @param prefix Prefix that the imports should start with.
 */
function detectAndDropImports(content, prefix) {
    if (prefix[prefix.length - 1] !== '/') {
        // Some of the logic further down makes assumptions about the import depth.
        throw Error(`Prefix "${prefix}" has to end in a slash.`);
    }
    // List of `@use` namespaces from which Angular CDK/Material APIs may be referenced.
    // Since we know that the library doesn't have any name collisions, we can treat all of these
    // namespaces as equivalent.
    const namespaces = [];
    const pattern = new RegExp(`@(import|use) +['"]${escapeRegExp(prefix)}.*['"].*;?\n`, 'g');
    let hasChanged = false;
    content = content.replace(pattern, (fullImport, type) => {
        if (type === 'use') {
            const namespace = extractNamespaceFromUseStatement(fullImport);
            if (namespaces.indexOf(namespace) === -1) {
                namespaces.push(namespace);
            }
        }
        hasChanged = true;
        return '';
    });
    return { content, hasChanged, namespaces };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctZ2VuZXJhdGUvdGhlbWluZy1hcGkvbWlncmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHlEQUF5RDtBQUN6RCxNQUFNLGNBQWMsR0FBMkI7SUFDN0MsVUFBVSxFQUFFLE1BQU07SUFDbEIsZ0JBQWdCLEVBQUUsWUFBWTtJQUM5QixnQkFBZ0IsRUFBRSxZQUFZO0lBQzlCLHdCQUF3QixFQUFFLHNCQUFzQjtJQUNoRCw2QkFBNkIsRUFBRSw0QkFBNEI7SUFDM0Qsd0JBQXdCLEVBQUUsc0JBQXNCO0lBQ2hELHFCQUFxQixFQUFFLHNCQUFzQjtJQUM3QyxnQ0FBZ0MsRUFBRSxrQkFBa0I7SUFDcEQsZUFBZSxFQUFFLFdBQVc7SUFDNUIsMkJBQTJCLEVBQUUsdUJBQXVCO0lBQ3BELFlBQVksRUFBRSxRQUFRO0lBQ3RCLGtCQUFrQixFQUFFLGNBQWM7SUFDbEMsa0JBQWtCLEVBQUUsY0FBYztJQUNsQyw2QkFBNkIsRUFBRSx5QkFBeUI7SUFDeEQsbUNBQW1DLEVBQUUsK0JBQStCO0lBQ3BFLG1DQUFtQyxFQUFFLCtCQUErQjtJQUNwRSxvQkFBb0IsRUFBRSxnQkFBZ0I7SUFDdEMsNEZBQTRGO0lBQzVGLGdHQUFnRztJQUNoRywyQkFBMkIsRUFBRSxpQkFBaUI7SUFDOUMsMkJBQTJCLEVBQUUsaUJBQWlCO0lBQzlDLGdDQUFnQyxFQUFFLHNCQUFzQjtDQUN6RCxDQUFDO0FBRUYsMEZBQTBGO0FBQzFGO0lBQ0UsUUFBUSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRO0lBQzFGLGVBQWUsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFlB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QUMsQ0FBQyxDQUFDO2dCQUV2RSxJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUMsRUFBRTtvQkFDdkIsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7aUJBQzdEO2FBQ0Y7aUJBQU07Z0JBQ0wsT0FBTyxRQUFRLENBQUM7YUFDakI7U0FDRjtLQUNGO0lBRUQsTUFBTSxLQUFLLENBQUMsNENBQTRDLFVBQVUsSUFBSSxDQUFDLENBQUM7QUFDMUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKiogTWFwcGluZyBvZiBNYXRlcmlhbCBtaXhpbnMgdGhhdCBzaG91bGQgYmUgcmVuYW1lZC4gKi9cbmNvbnN0IG1hdGVyaWFsTWl4aW5zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnbWF0LWNvcmUnOiAnY29yZScsXG4gICdtYXQtY29yZS1jb2xvcic6ICdjb3JlLWNvbG9yJyxcbiAgJ21hdC1jb3JlLXRoZW1lJzogJ2NvcmUtdGhlbWUnLFxuICAnYW5ndWxhci1tYXRlcmlhbC10aGVtZSc6ICdhbGwtY29tcG9uZW50LXRoZW1lcycsXG4gICdhbmd1bGFyLW1hdGVyaWFsLXR5cG9ncmFwaHknOiAnYWxsLWNvbXBvbmVudC10eXBvZ3JhcGhpZXMnLFxuICAnYW5ndWxhci1tYXRlcmlhbC1jb2xvcic6ICdhbGwtY29tcG9uZW50LWNvbG9ycycsXG4gICdtYXQtYmFzZS10eXBvZ3JhcGh5JzogJ3R5cG9ncmFwaHktaGllcmFyY2h5JyxcbiAgJ21hdC10eXBvZ3JhcGh5LWxldmVsLXRvLXN0eWxlcyc6ICd0eXBvZ3JhcGh5LWxldmVsJyxcbiAgJ21hdC1lbGV2YXRpb24nOiAnZWxldmF0aW9uJyxcbiAgJ21hdC1vdmVycmlkYWJsZS1lbGV2YXRpb24nOiAnb3ZlcnJpZGFibGUtZWxldmF0aW9uJyxcbiAgJ21hdC1yaXBwbGUnOiAncmlwcGxlJyxcbiAgJ21hdC1yaXBwbGUtY29sb3InOiAncmlwcGxlLWNvbG9yJyxcbiAgJ21hdC1yaXBwbGUtdGhlbWUnOiAncmlwcGxlLXRoZW1lJyxcbiAgJ21hdC1zdHJvbmctZm9jdXMtaW5kaWNhdG9ycyc6ICdzdHJvbmctZm9jdXMtaW5kaWNhdG9ycycsXG4gICdtYXQtc3Ryb25nLWZvY3VzLWluZGljYXRvcnMtY29sb3InOiAnc3Ryb25nLWZvY3VzLWluZGljYXRvcnMtY29sb3InLFxuICAnbWF0LXN0cm9uZy1mb2N1cy1pbmRpY2F0b3JzLXRoZW1lJzogJ3N0cm9uZy1mb2N1cy1pbmRpY2F0b3JzLXRoZW1lJyxcbiAgJ21hdC1mb250LXNob3J0aGFuZCc6ICdmb250LXNob3J0aGFuZCcsXG4gIC8vIFRoZSBleHBhbnNpb24gcGFuZWwgaXMgYSBzcGVjaWFsIGNhc2UsIGJlY2F1c2UgdGhlIHBhY2thZ2UgaXMgY2FsbGVkIGBleHBhbnNpb25gLCBidXQgdGhlXG4gIC8vIG1peGlucyB3ZXJlIHByZWZpeGVkIHdpdGggYGV4cGFuc2lvbi1wYW5lbGAuIFRoaXMgd2FzIGNvcnJlY3RlZCBieSB0aGUgU2FzcyBtb2R1bGUgbWlncmF0aW9uLlxuICAnbWF0LWV4cGFuc2lvbi1wYW5lbC10aGVtZSc6ICdleHBhbnNpb24tdGhlbWUnLFxuICAnbWF0LWV4cGFuc2lvbi1wYW5lbC1jb2xvcic6ICdleHBhbnNpb24tY29sb3InLFxuICAnbWF0LWV4cGFuc2lvbi1wYW5lbC10eXBvZ3JhcGh5JzogJ2V4cGFuc2lvbi10eXBvZ3JhcGh5Jyxcbn07XG5cbi8vIFRoZSBjb21wb25lbnQgdGhlbWVzIGFsbCBmb2xsb3cgdGhlIHNhbWUgcGF0dGVybiBzbyB3ZSBjYW4gc3BhcmUgb3Vyc2VsdmVzIHNvbWUgdHlwaW5nLlxuW1xuICAnb3B0aW9uJywgJ29wdGdyb3VwJywgJ3BzZXVkby1jaGVja2JveCcsICdhdXRvY29tcGxldGUnLCAnYmFkZ2UnLCAnYm90dG9tLXNoZWV0JywgJ2J1dHRvbicsXG4gICdidXR0b24tdG9nZ2xlJywgJ2NhcmQnLCAnY2hlY2tib3gnLCAnY2hpcHMnLCAnZGl2aWRlcicsICd0YWJsZScsICdkYXRlcGlja2VyJywgJ2RpYWxvZycsXG4gICdncmlkLWxpc3QnLCAnaWNvbicsICdpbnB1dCcsICdsaXN0JywgJ21lbnUnLCAncGFnaW5hdG9yJywgJ3Byb2dyZXNzLWJhcicsICdwcm9ncmVzcy1zcGlubmVyJyxcbiAgJ3JhZGlvJywgJ3NlbGVjdCcsICdzaWRlbmF2JywgJ3NsaWRlLXRvZ2dsZScsICdzbGlkZXInLCAnc3RlcHBlcicsICdzb3J0JywgJ3RhYnMnLCAndG9vbGJhcicsXG4gICd0b29sdGlwJywgJ3NuYWNrLWJhcicsICdmb3JtLWZpZWxkJywgJ3RyZWUnXG5dLmZvckVhY2gobmFtZSA9PiB7XG4gIG1hdGVyaWFsTWl4aW5zW2BtYXQtJHtuYW1lfS10aGVtZWBdID0gYCR7bmFtZX0tdGhlbWVgO1xuICBtYXRlcmlhbE1peGluc1tgbWF0LSR7bmFtZX0tY29sb3JgXSA9IGAke25hbWV9LWNvbG9yYDtcbiAgbWF0ZXJpYWxNaXhpbnNbYG1hdC0ke25hbWV9LXR5cG9ncmFwaHlgXSA9IGAke25hbWV9LXR5cG9ncmFwaHlgO1xufSk7XG5cbi8qKiBNYXBwaW5nIG9mIE1hdGVyaWFsIGZ1bmN0aW9ucyB0aGF0IHNob3VsZCBiZSByZW5hbWVkLiAqL1xuY29uc3QgbWF0ZXJpYWxGdW5jdGlvbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdtYXQtY29sb3InOiAnZ2V0LWNvbG9yLWZyb20tcGFsZXR0ZScsXG4gICdtYXQtY29udHJhc3QnOiAnZ2V0LWNvbnRyYXN0LWNvbG9yLWZyb20tcGFsZXR0ZScsXG4gICdtYXQtcGFsZXR0ZSc6ICdkZWZpbmUtcGFsZXR0ZScsXG4gICdtYXQtZGFyay10aGVtZSc6ICdkZWZpbmUtZGFyay10aGVtZScsXG4gICdtYXQtbGlnaHQtdGhlbWUnOiAnZGVmaW5lLWxpZ2h0LXRoZW1lJyxcbiAgJ21hdC10eXBvZ3JhcGh5LWxldmVsJzogJ2RlZmluZS10eXBvZ3JhcGh5LWxldmVsJyxcbiAgJ21hdC10eXBvZ3JhcGh5LWNvbmZpZyc6ICdkZWZpbmUtdHlwb2dyYXBoeS1jb25maWcnLFxuICAnbWF0LWZvbnQtc2l6ZSc6ICdmb250LXNpemUnLFxuICAnbWF0LWxpbmUtaGVpZ2h0JzogJ2xpbmUtaGVpZ2h0JyxcbiAgJ21hdC1mb250LXdlaWdodCc6ICdmb250LXdlaWdodCcsXG4gICdtYXQtbGV0dGVyLXNwYWNpbmcnOiAnbGV0dGVyLXNwYWNpbmcnLFxuICAnbWF0LWZvbnQtZmFtaWx5JzogJ2ZvbnQtZmFtaWx5Jyxcbn07XG5cbi8qKiBNYXBwaW5nIG9mIE1hdGVyaWFsIHZhcmlhYmxlcyB0aGF0IHNob3VsZCBiZSByZW5hbWVkLiAqL1xuY29uc3QgbWF0ZXJpYWxWYXJpYWJsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdtYXQtbGlnaHQtdGhlbWUtYmFja2dyb3VuZCc6ICdsaWdodC10aGVtZS1iYWNrZ3JvdW5kLXBhbGV0dGUnLFxuICAnbWF0LWRhcmstdGhlbWUtYmFja2dyb3VuZCc6ICdkYXJrLXRoZW1lLWJhY2tncm91bmQtcGFsZXR0ZScsXG4gICdtYXQtbGlnaHQtdGhlbWUtZm9yZWdyb3VuZCc6ICdsaWdodC10aGVtZS1mb3JlZ3JvdW5kLXBhbGV0dGUnLFxuICAnbWF0LWRhcmstdGhlbWUtZm9yZWdyb3VuZCc6ICdkYXJrLXRoZW1lLWZvcmVncm91bmQtcGFsZXR0ZScsXG59O1xuXG4vLyBUaGUgcGFsZXR0ZXMgYWxsIGZvbGxvdyB0aGUgc2FtZSBwYXR0ZXJuLlxuW1xuICAncmVkJywgJ3BpbmsnLCAnaW5kaWdvJywgJ3B1cnBsZScsICdkZWVwLXB1cnBsZScsICdibHVlJywgJ2xpZ2h0LWJsdWUnLCAnY3lhbicsICd0ZWFsJywgJ2dyZWVuJyxcbiAgJ2xpZ2h0LWdyZWVuJywgJ2xpbWUnLCAneWVsbG93JywgJ2FtYmVyJywgJ29yYW5nZScsICdkZWVwLW9yYW5nZScsICdicm93bicsICdncmV5JywgJ2dyYXknLFxuICAnYmx1ZS1ncmV5JywgJ2JsdWUtZ3JheSdcbl0uZm9yRWFjaChuYW1lID0+IG1hdGVyaWFsVmFyaWFibGVzW2BtYXQtJHtuYW1lfWBdID0gYCR7bmFtZX0tcGFsZXR0ZWApO1xuXG4vKiogTWFwcGluZyBvZiBDREsgdmFyaWFibGVzIHRoYXQgc2hvdWxkIGJlIHJlbmFtZWQuICovXG5jb25zdCBjZGtWYXJpYWJsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdjZGstei1pbmRleC1vdmVybGF5LWNvbnRhaW5lcic6ICdvdmVybGF5LWNvbnRhaW5lci16LWluZGV4JyxcbiAgJ2Nkay16LWluZGV4LW92ZXJsYXknOiAnb3ZlcmxheS16LWluZGV4JyxcbiAgJ2Nkay16LWluZGV4LW92ZXJsYXktYmFja2Ryb3AnOiAnb3ZlcmxheS1iYWNrZHJvcC16LWluZGV4JyxcbiAgJ2Nkay1vdmVybGF5LWRhcmstYmFja2Ryb3AtYmFja2dyb3VuZCc6ICdvdmVybGF5LWJhY2tkcm9wLWNvbG9yJyxcbn07XG5cbi8qKiBNYXBwaW5nIG9mIENESyBtaXhpbnMgdGhhdCBzaG91bGQgYmUgcmVuYW1lZC4gKi9cbmNvbnN0IGNka01peGluczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgJ2Nkay1vdmVybGF5JzogJ292ZXJsYXknLFxuICAnY2RrLWExMXknOiAnYTExeS12aXN1YWxseS1oaWRkZW4nLFxuICAnY2RrLWhpZ2gtY29udHJhc3QnOiAnaGlnaC1jb250cmFzdCcsXG4gICdjZGstdGV4dC1maWVsZC1hdXRvZmlsbC1jb2xvcic6ICd0ZXh0LWZpZWxkLWF1dG9maWxsLWNvbG9yJyxcbiAgLy8gVGhpcyBvbmUgd2FzIHNwbGl0IHVwIGludG8gdHdvIG1peGlucyB3aGljaCBpcyB0cmlja2llciB0b1xuICAvLyBtaWdyYXRlIHNvIGZvciBub3cgd2UgZm9yd2FyZCB0byB0aGUgZGVwcmVjYXRlZCB2YXJpYW50LlxuICAnY2RrLXRleHQtZmllbGQnOiAndGV4dC1maWVsZCcsXG59O1xuXG4vKipcbiAqIE1pZ3JhdGVzIHRoZSBjb250ZW50IG9mIGEgZmlsZSB0byB0aGUgbmV3IHRoZW1pbmcgQVBJLiBOb3RlIHRoYXQgdGhpcyBtaWdyYXRpb24gaXMgdXNpbmcgcGxhaW5cbiAqIHN0cmluZyBtYW5pcHVsYXRpb24sIHJhdGhlciB0aGFuIHRoZSBBU1QgZnJvbSBQb3N0Q1NTIGFuZCB0aGUgc2NoZW1hdGljcyBzdHJpbmcgbWFuaXB1bGF0aW9uXG4gKiBBUElzLCBiZWNhdXNlIGl0IGFsbG93cyB1cyB0byBydW4gaXQgaW5zaWRlIGczIGFuZCB0byBhdm9pZCBpbnRyb2R1Y2luZyBuZXcgZGVwZW5kZW5jaWVzLlxuICogQHBhcmFtIGNvbnRlbnQgQ29udGVudCBvZiB0aGUgZmlsZS5cbiAqIEBwYXJhbSBvbGRNYXRlcmlhbFByZWZpeCBQcmVmaXggd2l0aCB3aGljaCB0aGUgb2xkIE1hdGVyaWFsIGltcG9ydHMgc2hvdWxkIHN0YXJ0LlxuICogICBIYXMgdG8gZW5kIHdpdGggYSBzbGFzaC4gRS5nLiBpZiBgQGltcG9ydCAnfkBhbmd1bGFyL21hdGVyaWFsL3RoZW1pbmcnYCBzaG91bGQgYmVcbiAqICAgbWF0Y2hlZCwgdGhlIHByZWZpeCB3b3VsZCBiZSBgfkBhbmd1bGFyL21hdGVyaWFsL2AuXG4gKiBAcGFyYW0gb2xkQ2RrUHJlZml4IFByZWZpeCB3aXRoIHdoaWNoIHRoZSBvbGQgQ0RLIGltcG9ydHMgc2hvdWxkIHN0YXJ0LlxuICogICBIYXMgdG8gZW5kIHdpdGggYSBzbGFzaC4gRS5nLiBpZiBgQGltcG9ydCAnfkBhbmd1bGFyL2Nkay9vdmVybGF5J2Agc2hvdWxkIGJlXG4gKiAgIG1hdGNoZWQsIHRoZSBwcmVmaXggd291bGQgYmUgYH5AYW5ndWxhci9jZGsvYC5cbiAqIEBwYXJhbSBuZXdNYXRlcmlhbEltcG9ydFBhdGggTmV3IGltcG9ydCB0byB0aGUgTWF0ZXJpYWwgdGhlbWluZyBBUEkgKGUuZy4gYH5AYW5ndWxhci9tYXRlcmlhbGApLlxuICogQHBhcmFtIG5ld0Nka0ltcG9ydFBhdGggTmV3IGltcG9ydCB0byB0aGUgQ0RLIFNhc3MgQVBJcyAoZS5nLiBgfkBhbmd1bGFyL2Nka2ApLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWlncmF0ZUZpbGVDb250ZW50KGNvbnRlbnQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkTWF0ZXJpYWxQcmVmaXg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkQ2RrUHJlZml4OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld01hdGVyaWFsSW1wb3J0UGF0aDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDZGtJbXBvcnRQYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBEcm9wIHRoZSBDREsgaW1wb3J0cyBhbmQgZGV0ZWN0IHRoZWlyIG5hbWVzcGFjZXMuXG4gIGNvbnN0IGNka1Jlc3VsdHMgPSBkZXRlY3RBbmREcm9wSW1wb3J0cyhjb250ZW50LCBvbGRDZGtQcmVmaXgpO1xuICBjb250ZW50ID0gY2RrUmVzdWx0cy5jb250ZW50O1xuXG4gIC8vIERyb3AgdGhlIE1hdGVyaWFsIGltcG9ydHMgYW5kIGRldGVjdCB0aGVpciBuYW1lc3BhY2VzLlxuICBjb25zdCBtYXRlcmlhbFJlc3VsdHMgPSBkZXRlY3RBbmREcm9wSW1wb3J0cyhjb250ZW50LCBvbGRNYXRlcmlhbFByZWZpeCk7XG4gIGNvbnRlbnQgPSBtYXRlcmlhbFJlc3VsdHMuY29udGVudDtcblxuICAvLyBJZiBub3RoaW5nIGhhcyBjaGFuZ2VkLCB0aGVuIHRoZSBmaWxlIGRvZXNuJ3QgaW1wb3J0IHRoZSBNYXRlcmlhbCB0aGVtaW5nIEFQSS5cbiAgaWYgKG1hdGVyaWFsUmVzdWx0cy5oYXNDaGFuZ2VkIHx8IGNka1Jlc3VsdHMuaGFzQ2hhbmdlZCkge1xuICAgIC8vIFJlcGxhY2luZyB0aGUgaW1wb3J0cyBtYXkgaGF2ZSByZXN1bHRlZCBpbiBsZWFkaW5nIHdoaXRlc3BhY2UuXG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgvXlxccysvLCAnJyk7XG4gICAgY29udGVudCA9IG1pZ3JhdGVDZGtTeW1ib2xzKGNvbnRlbnQsIG5ld0Nka0ltcG9ydFBhdGgsIGNka1Jlc3VsdHMubmFtZXNwYWNlcyk7XG4gICAgY29udGVudCA9IG1pZ3JhdGVNYXRlcmlhbFN5bWJvbHMoY29udGVudCwgbmV3TWF0ZXJpYWxJbXBvcnRQYXRoLCBtYXRlcmlhbFJlc3VsdHMubmFtZXNwYWNlcyk7XG4gIH1cblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBGaW5kcyBhbGwgb2YgdGhlIGltcG9ydHMgbWF0Y2hpbmcgYSBwcmVmaXgsIHJlbW92ZXMgdGhlbSBmcm9tXG4gKiB0aGUgY29udGVudCBzdHJpbmcgYW5kIHJldHVybnMgc29tZSBpbmZvcm1hdGlvbiBhYm91dCB0aGVtLlxuICogQHBhcmFtIGNvbnRlbnQgQ29udGVudCBmcm9tIHdoaWNoIHRvIHJlbW92ZSB0aGUgaW1wb3J0cy5cbiAqIEBwYXJhbSBwcmVmaXggUHJlZml4IHRoYXQgdGhlIGltcG9ydHMgc2hvdWxkIHN0YXJ0IHdpdGguXG4gKi9cbmZ1bmN0aW9uIGRldGVjdEFuZERyb3BJbXBvcnRzKGNvbnRlbnQ6IHN0cmluZywgcHJlZml4OiBzdHJpbmcpOlxuICB7Y29udGVudDogc3RyaW5nLCBoYXNDaGFuZ2VkOiBib29sZWFuLCBuYW1lc3BhY2VzOiBzdHJpbmdbXX0ge1xuICBpZiAocHJlZml4W3ByZWZpeC5sZW5ndGggLSAxXSAhPT0gJy8nKSB7XG4gICAgLy8gU29tZSBvZiB0aGUgbG9naWMgZnVydGhlciBkb3duIG1ha2VzIGFzc3VtcHRpb25zIGFib3V0IHRoZSBpbXBvcnQgZGVwdGguXG4gICAgdGhyb3cgRXJyb3IoYFByZWZpeCBcIiR7cHJlZml4fVwiIGhhcyB0byBlbmQgaW4gYSBzbGFzaC5gKTtcbiAgfVxuXG4gIC8vIExpc3Qgb2YgYEB1c2VgIG5hbWVzcGFjZXMgZnJvbSB3aGljaCBBbmd1bGFyIENESy9NYXRlcmlhbCBBUElzIG1heSBiZSByZWZlcmVuY2VkLlxuICAvLyBTaW5jZSB3ZSBrbm93IHRoYXQgdGhlIGxpYnJhcnkgZG9lc24ndCBoYXZlIGFueSBuYW1lIGNvbGxpc2lvbnMsIHdlIGNhbiB0cmVhdCBhbGwgb2YgdGhlc2VcbiAgLy8gbmFtZXNwYWNlcyBhcyBlcXVpdmFsZW50LlxuICBjb25zdCBuYW1lc3BhY2VzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBwYXR0ZXJuID0gbmV3IFJlZ0V4cChgQChpbXBvcnR8dXNlKSArWydcIl0ke2VzY2FwZVJlZ0V4cChwcmVmaXgpfS4qWydcIl0uKjs/XFxuYCwgJ2cnKTtcbiAgbGV0IGhhc0NoYW5nZWQgPSBmYWxzZTtcblxuICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKHBhdHRlcm4sIChmdWxsSW1wb3J0LCB0eXBlOiAnaW1wb3J0JyB8ICd1c2UnKSA9PiB7XG4gICAgaWYgKHR5cGUgPT09ICd1c2UnKSB7XG4gICAgICBjb25zdCBuYW1lc3BhY2UgPSBleHRyYWN0TmFtZXNwYWNlRnJvbVVzZVN0YXRlbWVudChmdWxsSW1wb3J0KTtcblxuICAgICAgaWYgKG5hbWVzcGFjZXMuaW5kZXhPZihuYW1lc3BhY2UpID09PSAtMSkge1xuICAgICAgICBuYW1lc3BhY2VzLnB1c2gobmFtZXNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoYXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gJyc7XG4gIH0pO1xuXG4gIHJldHVybiB7Y29udGVudCwgaGFzQ2hhbmdlZCwgbmFtZXNwYWNlc307XG59XG5cbi8qKiBNaWdyYXRlcyB0aGUgTWF0ZXJpYWwgc3ltYmxzIGluIGEgZmlsZS4gKi9cbmZ1bmN0aW9uIG1pZ3JhdGVNYXRlcmlhbFN5bWJvbHMoY29udGVudDogc3RyaW5nLCBpbXBvcnRQYXRoOiBzdHJpbmcsIG5hbWVzcGFjZXM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgY29uc3QgaW5pdGlhbENvbnRlbnQgPSBjb250ZW50O1xuICBjb25zdCBuYW1lc3BhY2UgPSAnbWF0JztcblxuICAvLyBNaWdyYXRlIHRoZSBtaXhpbnMuXG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIG1hdGVyaWFsTWl4aW5zLCBuYW1lc3BhY2VzLCBtaXhpbktleUZvcm1hdHRlcixcbiAgICBnZXRNaXhpblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSkpO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIGZ1bmN0aW9ucy5cbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgbWF0ZXJpYWxGdW5jdGlvbnMsIG5hbWVzcGFjZXMsIGZ1bmN0aW9uS2V5Rm9ybWF0dGVyLFxuICAgIGdldEZ1bmN0aW9uVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlKSk7XG5cbiAgLy8gTWlncmF0ZSB0aGUgdmFyaWFibGVzLlxuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhjb250ZW50LCBtYXRlcmlhbFZhcmlhYmxlcywgbmFtZXNwYWNlcywgdmFyaWFibGVLZXlGb3JtYXR0ZXIsXG4gICAgZ2V0VmFyaWFibGVWYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICBpZiAoY29udGVudCAhPT0gaW5pdGlhbENvbnRlbnQpIHtcbiAgICAvLyBBZGQgYW4gaW1wb3J0IHRvIHRoZSBuZXcgQVBJIG9ubHkgaWYgYW55IG9mIHRoZSBBUElzIHdlcmUgYmVpbmcgdXNlZC5cbiAgICBjb250ZW50ID0gaW5zZXJ0VXNlU3RhdGVtZW50KGNvbnRlbnQsIGltcG9ydFBhdGgsIG5hbWVzcGFjZSk7XG4gIH1cblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqIE1pZ3JhdGVzIHRoZSBDREsgc3ltYm9scyBpbiBhIGZpbGUuICovXG5mdW5jdGlvbiBtaWdyYXRlQ2RrU3ltYm9scyhjb250ZW50OiBzdHJpbmcsIGltcG9ydFBhdGg6IHN0cmluZywgbmFtZXNwYWNlczogc3RyaW5nW10pOiBzdHJpbmcge1xuICBjb25zdCBpbml0aWFsQ29udGVudCA9IGNvbnRlbnQ7XG4gIGNvbnN0IG5hbWVzcGFjZSA9ICdjZGsnO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIG1peGlucy5cbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgY2RrTWl4aW5zLCBuYW1lc3BhY2VzLCBtaXhpbktleUZvcm1hdHRlcixcbiAgICBnZXRNaXhpblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSkpO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIHZhcmlhYmxlcy5cbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgY2RrVmFyaWFibGVzLCBuYW1lc3BhY2VzLCB2YXJpYWJsZUtleUZvcm1hdHRlcixcbiAgICBnZXRWYXJpYWJsZVZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSkpO1xuXG4gIC8vIFByZXZpb3VzbHkgdGhlIENESyBzeW1ib2xzIHdlcmUgZXhwb3NlZCB0aHJvdWdoIGBtYXRlcmlhbC90aGVtaW5nYCwgYnV0IG5vdyB3ZSBoYXZlIGFcbiAgLy8gZGVkaWNhdGVkIGVudHJ5cG9pbnQgZm9yIHRoZSBDREsuIE9ubHkgYWRkIGFuIGltcG9ydCBmb3IgaXQgaWYgYW55IG9mIHRoZSBzeW1ib2xzIGFyZSB1c2VkLlxuICBpZiAoY29udGVudCAhPT0gaW5pdGlhbENvbnRlbnQpIHtcbiAgICBjb250ZW50ID0gaW5zZXJ0VXNlU3RhdGVtZW50KGNvbnRlbnQsIGltcG9ydFBhdGgsIG5hbWVzcGFjZSk7XG4gIH1cblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBSZW5hbWVzIGFsbCBTYXNzIHN5bWJvbHMgaW4gYSBmaWxlIGJhc2VkIG9uIGEgcHJlLWRlZmluZWQgbWFwcGluZy5cbiAqIEBwYXJhbSBjb250ZW50IENvbnRlbnQgb2YgYSBmaWxlIHRvIGJlIG1pZ3JhdGVkLlxuICogQHBhcmFtIG1hcHBpbmcgTWFwcGluZyBiZXR3ZWVuIHN5bWJvbCBuYW1lcyBhbmQgdGhlaXIgcmVwbGFjZW1lbnRzLlxuICogQHBhcmFtIGdldEtleVBhdHRlcm4gRnVuY3Rpb24gdXNlZCB0byB0dXJuIGVhY2ggb2YgdGhlIGtleXMgaW50byBhIHJlZ2V4LlxuICogQHBhcmFtIGZvcm1hdFZhbHVlIEZvcm1hdHMgdGhlIHZhbHVlIHRoYXQgd2lsbCByZXBsYWNlIGFueSBtYXRjaGVzIG9mIHRoZSBwYXR0ZXJuIHJldHVybmVkIGJ5XG4gKiAgYGdldEtleVBhdHRlcm5gLlxuICovXG5mdW5jdGlvbiByZW5hbWVTeW1ib2xzKGNvbnRlbnQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgbWFwcGluZzogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlczogc3RyaW5nW10sXG4gICAgICAgICAgICAgICAgICAgICAgIGdldEtleVBhdHRlcm46IChuYW1lc3BhY2U6IHN0cmluZ3xudWxsLCBrZXk6IHN0cmluZykgPT4gUmVnRXhwLFxuICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXRWYWx1ZTogKGtleTogc3RyaW5nKSA9PiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBUaGUgbnVsbCBhdCB0aGUgZW5kIGlzIHNvIHRoYXQgd2UgbWFrZSBvbmUgbGFzdCBwYXNzIHRvIGNvdmVyIG5vbi1uYW1lc3BhY2VkIHN5bWJvbHMuXG4gIFsuLi5uYW1lc3BhY2VzLnNsaWNlKCkuc29ydChzb3J0TGVuZ3RoRGVzY2VuZGluZyksIG51bGxdLmZvckVhY2gobmFtZXNwYWNlID0+IHtcbiAgICAvLyBNaWdyYXRlIHRoZSBsb25nZXN0IGtleXMgZmlyc3Qgc28gdGhhdCBvdXIgcmVnZXgtYmFzZWQgcmVwbGFjZW1lbnRzIGRvbid0IGFjY2lkZW50YWxseVxuICAgIC8vIGNhcHR1cmUga2V5cyB0aGF0IGNvbnRhaW4gb3RoZXIga2V5cy4gRS5nLiBgJG1hdC1ibHVlYCBpcyBjb250YWluZWQgd2l0aGluIGAkbWF0LWJsdWUtZ3JleWAuXG4gICAgT2JqZWN0LmtleXMobWFwcGluZykuc29ydChzb3J0TGVuZ3RoRGVzY2VuZGluZykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgcGF0dGVybiA9IGdldEtleVBhdHRlcm4obmFtZXNwYWNlLCBrZXkpO1xuXG4gICAgICAvLyBTYW5pdHkgY2hlY2sgc2luY2Ugbm9uLWdsb2JhbCByZWdleGVzIHdpbGwgb25seSByZXBsYWNlIHRoZSBmaXJzdCBtYXRjaC5cbiAgICAgIGlmIChwYXR0ZXJuLmZsYWdzLmluZGV4T2YoJ2cnKSA9PT0gLTEpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1JlcGxhY2VtZW50IHBhdHRlcm4gbXVzdCBiZSBnbG9iYWwuJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UocGF0dGVybiwgZm9ybWF0VmFsdWUobWFwcGluZ1trZXldKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKiogSW5zZXJ0cyBhbiBgQHVzZWAgc3RhdGVtZW50IGluIGEgc3RyaW5nLiAqL1xuZnVuY3Rpb24gaW5zZXJ0VXNlU3RhdGVtZW50KGNvbnRlbnQ6IHN0cmluZywgaW1wb3J0UGF0aDogc3RyaW5nLCBuYW1lc3BhY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFNhc3MgaGFzIGEgbGltaXRhdGlvbiB0aGF0IGFsbCBgQHVzZWAgZGVjbGFyYXRpb25zIGhhdmUgdG8gY29tZSBiZWZvcmUgYEBpbXBvcnRgIHNvIHdlIGhhdmVcbiAgLy8gdG8gZmluZCB0aGUgZmlyc3QgaW1wb3J0IGFuZCBpbnNlcnQgYmVmb3JlIGl0LiBUZWNobmljYWxseSB3ZSBjYW4gZ2V0IGF3YXkgd2l0aCBhbHdheXNcbiAgLy8gaW5zZXJ0aW5nIGF0IDAsIGJ1dCB0aGUgZmlsZSBtYXkgc3RhcnQgd2l0aCBzb21ldGhpbmcgbGlrZSBhIGxpY2Vuc2UgaGVhZGVyLlxuICBjb25zdCBuZXdJbXBvcnRJbmRleCA9IE1hdGgubWF4KDAsIGNvbnRlbnQuaW5kZXhPZignQGltcG9ydCAnKSk7XG4gIHJldHVybiBjb250ZW50LnNsaWNlKDAsIG5ld0ltcG9ydEluZGV4KSArIGBAdXNlICcke2ltcG9ydFBhdGh9JyBhcyAke25hbWVzcGFjZX07XFxuYCArXG4gICAgICAgICBjb250ZW50LnNsaWNlKG5ld0ltcG9ydEluZGV4KTtcbn1cblxuLyoqIEZvcm1hdHMgYSBtaWdyYXRpb24ga2V5IGFzIGEgU2FzcyBtaXhpbiBpbnZvY2F0aW9uLiAqL1xuZnVuY3Rpb24gbWl4aW5LZXlGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmd8bnVsbCwgbmFtZTogc3RyaW5nKTogUmVnRXhwIHtcbiAgLy8gTm90ZSB0aGF0IGFkZGluZyBhIGAoYCBhdCB0aGUgZW5kIG9mIHRoZSBwYXR0ZXJuIHdvdWxkIGJlIG1vcmUgYWNjdXJhdGUsIGJ1dCBtaXhpblxuICAvLyBpbnZvY2F0aW9ucyBkb24ndCBuZWNlc3NhcmlseSBoYXZlIHRvIGluY2x1ZGUgdGhlIHBhcmFudGhlc2VzLiBXZSBjb3VsZCBhZGQgYFsoO11gLFxuICAvLyBidXQgdGhlbiB3ZSB3b24ndCBrbm93IHdoaWNoIGNoYXJhY3RlciB0byBpbmNsdWRlIGluIHRoZSByZXBsYWNlbWVudCBzdHJpbmcuXG4gIHJldHVybiBuZXcgUmVnRXhwKGBAaW5jbHVkZSArJHtlc2NhcGVSZWdFeHAoKG5hbWVzcGFjZSA/IG5hbWVzcGFjZSArICcuJyA6ICcnKSArIG5hbWUpfWAsICdnJyk7XG59XG5cbi8qKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmb3JtYXQgYSBTYXNzIG1peGluIHJlcGxhY2VtZW50LiAqL1xuZnVuY3Rpb24gZ2V0TWl4aW5WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZyk6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZyB7XG4gIC8vIE5vdGUgdGhhdCBhZGRpbmcgYSBgKGAgYXQgdGhlIGVuZCBvZiB0aGUgcGF0dGVybiB3b3VsZCBiZSBtb3JlIGFjY3VyYXRlLFxuICAvLyBidXQgbWl4aW4gaW52b2NhdGlvbnMgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSB0byBpbmNsdWRlIHRoZSBwYXJhbnRoZXNlcy5cbiAgcmV0dXJuIG5hbWUgPT4gYEBpbmNsdWRlICR7bmFtZXNwYWNlfS4ke25hbWV9YDtcbn1cblxuLyoqIEZvcm1hdHMgYSBtaWdyYXRpb24ga2V5IGFzIGEgU2FzcyBmdW5jdGlvbiBpbnZvY2F0aW9uLiAqL1xuZnVuY3Rpb24gZnVuY3Rpb25LZXlGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmd8bnVsbCwgbmFtZTogc3RyaW5nKTogUmVnRXhwIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKGAke25hbWVzcGFjZSA/IG5hbWVzcGFjZSArICcuJyA6ICcnfSR7bmFtZX0oYCksICdnJyk7XG59XG5cbi8qKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmb3JtYXQgYSBTYXNzIGZ1bmN0aW9uIHJlcGxhY2VtZW50LiAqL1xuZnVuY3Rpb24gZ2V0RnVuY3Rpb25WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZyk6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZyB7XG4gIHJldHVybiBuYW1lID0+IGAke25hbWVzcGFjZX0uJHtuYW1lfShgO1xufVxuXG4vKiogRm9ybWF0cyBhIG1pZ3JhdGlvbiBrZXkgYXMgYSBTYXNzIHZhcmlhYmxlLiAqL1xuZnVuY3Rpb24gdmFyaWFibGVLZXlGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmd8bnVsbCwgbmFtZTogc3RyaW5nKTogUmVnRXhwIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKGAke25hbWVzcGFjZSA/IG5hbWVzcGFjZSArICcuJyA6ICcnfSQke25hbWV9YCksICdnJyk7XG59XG5cbi8qKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmb3JtYXQgYSBTYXNzIHZhcmlhYmxlIHJlcGxhY2VtZW50LiAqL1xuZnVuY3Rpb24gZ2V0VmFyaWFibGVWYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZyk6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZyB7XG4gIHJldHVybiBuYW1lID0+IGAke25hbWVzcGFjZX0uJCR7bmFtZX1gO1xufVxuXG4vKiogRXNjYXBlcyBzcGVjaWFsIHJlZ2V4IGNoYXJhY3RlcnMgaW4gYSBzdHJpbmcuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbLiorP149IToke30oKXxbXFxdXFwvXFxcXF0pL2csICdcXFxcJDEnKTtcbn1cblxuLyoqIFVzZWQgd2l0aCBgQXJyYXkucHJvdG90eXBlLnNvcnRgIHRvIG9yZGVyIHN0cmluZ3MgaW4gZGVzY2VuZGluZyBsZW5ndGguICovXG5mdW5jdGlvbiBzb3J0TGVuZ3RoRGVzY2VuZGluZyhhOiBzdHJpbmcsIGI6IHN0cmluZykge1xuICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcbn1cblxuLyoqIFBhcnNlcyBvdXQgdGhlIG5hbWVzcGFjZSBmcm9tIGEgU2FzcyBgQHVzZWAgc3RhdGVtZW50LiAqL1xuZnVuY3Rpb24gZXh0cmFjdE5hbWVzcGFjZUZyb21Vc2VTdGF0ZW1lbnQoZnVsbEltcG9ydDogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgY2xvc2VRdW90ZUluZGV4ID0gTWF0aC5tYXgoZnVsbEltcG9ydC5sYXN0SW5kZXhPZihgXCJgKSwgZnVsbEltcG9ydC5sYXN0SW5kZXhPZihgJ2ApKTtcblxuICBpZiAoY2xvc2VRdW90ZUluZGV4ID4gLTEpIHtcbiAgICBjb25zdCBhc0V4cHJlc3Npb24gPSAnYXMgJztcbiAgICBjb25zdCBhc0luZGV4ID0gZnVsbEltcG9ydC5pbmRleE9mKGFzRXhwcmVzc2lvbiwgY2xvc2VRdW90ZUluZGV4KTtcblxuICAgIC8vIElmIHdlIGZvdW5kIGFuIGAgYXMgYCBleHByZXNzaW9uLCB3ZSBjb25zaWRlciB0aGUgcmVzdCBvZiB0aGUgdGV4dCBhcyB0aGUgbmFtZXNwYWNlLlxuICAgIGlmIChhc0luZGV4ID4gLTEpIHtcbiAgICAgIHJldHVybiBmdWxsSW1wb3J0LnNsaWNlKGFzSW5kZXggKyBhc0V4cHJlc3Npb24ubGVuZ3RoKS5zcGxpdCgnOycpWzBdLnRyaW0oKTtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgdGhlIG5hbWVzcGFjZSBpcyB0aGUgbmFtZSBvZiB0aGUgZmlsZSB0aGF0IGlzIGJlaW5nIGltcG9ydGVkLlxuICAgIGNvbnN0IGxhc3RTbGFzaEluZGV4ID0gZnVsbEltcG9ydC5sYXN0SW5kZXhPZignLycsIGNsb3NlUXVvdGVJbmRleCk7XG5cbiAgICBpZiAobGFzdFNsYXNoSW5kZXggPiAtMSkge1xuICAgICAgY29uc3QgZmlsZU5hbWUgPSBmdWxsSW1wb3J0LnNsaWNlKGxhc3RTbGFzaEluZGV4ICsgMSwgY2xvc2VRdW90ZUluZGV4KVxuICAgICAgICAvLyBTYXNzIGFsbG93cyBmb3IgbGVhZGluZyB1bmRlcnNjb3JlcyB0byBiZSBvbWl0dGVkIGFuZCBpdCB0ZWNobmljYWxseSBzdXBwb3J0cyAuc2Nzcy5cbiAgICAgICAgLnJlcGxhY2UoL15ffChcXC5pbXBvcnQpP1xcLnNjc3MkfFxcLmltcG9ydCQvZywgJycpO1xuXG4gICAgICAvLyBTYXNzIGlnbm9yZXMgYC9pbmRleGAgYW5kIGluZmVycyB0aGUgbmFtZXNwYWNlIGFzIHRoZSBuZXh0IHNlZ21lbnQgaW4gdGhlIHBhdGguXG4gICAgICBpZiAoZmlsZU5hbWUgPT09ICdpbmRleCcpIHtcbiAgICAgICAgY29uc3QgbmV4dFNsYXNoSW5kZXggPSBmdWxsSW1wb3J0Lmxhc3RJbmRleE9mKCcvJywgbGFzdFNsYXNoSW5kZXggLSAxKTtcblxuICAgICAgICBpZiAobmV4dFNsYXNoSW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiBmdWxsSW1wb3J0LnNsaWNlKG5leHRTbGFzaEluZGV4ICsgMSwgbGFzdFNsYXNoSW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmlsZU5hbWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBleHRyYWN0IG5hbWVzcGFjZSBmcm9tIGltcG9ydCBcIiR7ZnVsbEltcG9ydH1cIi5gKTtcbn1cbiJdfQ==