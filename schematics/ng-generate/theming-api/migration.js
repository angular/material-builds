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
    'cdk-z-index-overlay-container': 'z-index-overlay-container',
    'cdk-z-index-overlay': 'z-index-overlay',
    'cdk-z-index-overlay-backdrop': 'z-index-overlay-backdrop',
    'cdk-overlay-dark-backdrop-background': 'overlay-dark-backdrop-background',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctZ2VuZXJhdGUvdGhlbWluZy1hcGkvbWlncmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHlEQUF5RDtBQUN6RCxNQUFNLGNBQWMsR0FBMkI7SUFDN0MsVUFBVSxFQUFFLE1BQU07SUFDbEIsZ0JBQWdCLEVBQUUsWUFBWTtJQUM5QixnQkFBZ0IsRUFBRSxZQUFZO0lBQzlCLHdCQUF3QixFQUFFLHNCQUFzQjtJQUNoRCw2QkFBNkIsRUFBRSw0QkFBNEI7SUFDM0Qsd0JBQXdCLEVBQUUsc0JBQXNCO0lBQ2hELHFCQUFxQixFQUFFLHNCQUFzQjtJQUM3QyxnQ0FBZ0MsRUFBRSxrQkFBa0I7SUFDcEQsZUFBZSxFQUFFLFdBQVc7SUFDNUIsMkJBQTJCLEVBQUUsdUJBQXVCO0lBQ3BELFlBQVksRUFBRSxRQUFRO0lBQ3RCLGtCQUFrQixFQUFFLGNBQWM7SUFDbEMsa0JBQWtCLEVBQUUsY0FBYztJQUNsQyw2QkFBNkIsRUFBRSx5QkFBeUI7SUFDeEQsbUNBQW1DLEVBQUUsK0JBQStCO0lBQ3BFLG1DQUFtQyxFQUFFLCtCQUErQjtJQUNwRSxvQkFBb0IsRUFBRSxnQkFBZ0I7SUFDdEMsNEZBQTRGO0lBQzVGLGdHQUFnRztJQUNoRywyQkFBMkIsRUFBRSxpQkFBaUI7SUFDOUMsMkJBQTJCLEVBQUUsaUJBQWlCO0lBQzlDLGdDQUFnQyxFQUFFLHNCQUFzQjtDQUN6RCxDQUFDO0FBRUYsMEZBQTBGO0FBQzFGO0lBQ0UsUUFBUSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRO0lBQzFGLGVBQWUsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFlB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QUMsQ0FBQyxDQUFDO2dCQUV2RSxJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUMsRUFBRTtvQkFDdkIsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7aUJBQzdEO2FBQ0Y7aUJBQU07Z0JBQ0wsT0FBTyxRQUFRLENBQUM7YUFDakI7U0FDRjtLQUNGO0lBRUQsTUFBTSxLQUFLLENBQUMsNENBQTRDLFVBQVUsSUFBSSxDQUFDLENBQUM7QUFDMUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKiogTWFwcGluZyBvZiBNYXRlcmlhbCBtaXhpbnMgdGhhdCBzaG91bGQgYmUgcmVuYW1lZC4gKi9cbmNvbnN0IG1hdGVyaWFsTWl4aW5zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnbWF0LWNvcmUnOiAnY29yZScsXG4gICdtYXQtY29yZS1jb2xvcic6ICdjb3JlLWNvbG9yJyxcbiAgJ21hdC1jb3JlLXRoZW1lJzogJ2NvcmUtdGhlbWUnLFxuICAnYW5ndWxhci1tYXRlcmlhbC10aGVtZSc6ICdhbGwtY29tcG9uZW50LXRoZW1lcycsXG4gICdhbmd1bGFyLW1hdGVyaWFsLXR5cG9ncmFwaHknOiAnYWxsLWNvbXBvbmVudC10eXBvZ3JhcGhpZXMnLFxuICAnYW5ndWxhci1tYXRlcmlhbC1jb2xvcic6ICdhbGwtY29tcG9uZW50LWNvbG9ycycsXG4gICdtYXQtYmFzZS10eXBvZ3JhcGh5JzogJ3R5cG9ncmFwaHktaGllcmFyY2h5JyxcbiAgJ21hdC10eXBvZ3JhcGh5LWxldmVsLXRvLXN0eWxlcyc6ICd0eXBvZ3JhcGh5LWxldmVsJyxcbiAgJ21hdC1lbGV2YXRpb24nOiAnZWxldmF0aW9uJyxcbiAgJ21hdC1vdmVycmlkYWJsZS1lbGV2YXRpb24nOiAnb3ZlcnJpZGFibGUtZWxldmF0aW9uJyxcbiAgJ21hdC1yaXBwbGUnOiAncmlwcGxlJyxcbiAgJ21hdC1yaXBwbGUtY29sb3InOiAncmlwcGxlLWNvbG9yJyxcbiAgJ21hdC1yaXBwbGUtdGhlbWUnOiAncmlwcGxlLXRoZW1lJyxcbiAgJ21hdC1zdHJvbmctZm9jdXMtaW5kaWNhdG9ycyc6ICdzdHJvbmctZm9jdXMtaW5kaWNhdG9ycycsXG4gICdtYXQtc3Ryb25nLWZvY3VzLWluZGljYXRvcnMtY29sb3InOiAnc3Ryb25nLWZvY3VzLWluZGljYXRvcnMtY29sb3InLFxuICAnbWF0LXN0cm9uZy1mb2N1cy1pbmRpY2F0b3JzLXRoZW1lJzogJ3N0cm9uZy1mb2N1cy1pbmRpY2F0b3JzLXRoZW1lJyxcbiAgJ21hdC1mb250LXNob3J0aGFuZCc6ICdmb250LXNob3J0aGFuZCcsXG4gIC8vIFRoZSBleHBhbnNpb24gcGFuZWwgaXMgYSBzcGVjaWFsIGNhc2UsIGJlY2F1c2UgdGhlIHBhY2thZ2UgaXMgY2FsbGVkIGBleHBhbnNpb25gLCBidXQgdGhlXG4gIC8vIG1peGlucyB3ZXJlIHByZWZpeGVkIHdpdGggYGV4cGFuc2lvbi1wYW5lbGAuIFRoaXMgd2FzIGNvcnJlY3RlZCBieSB0aGUgU2FzcyBtb2R1bGUgbWlncmF0aW9uLlxuICAnbWF0LWV4cGFuc2lvbi1wYW5lbC10aGVtZSc6ICdleHBhbnNpb24tdGhlbWUnLFxuICAnbWF0LWV4cGFuc2lvbi1wYW5lbC1jb2xvcic6ICdleHBhbnNpb24tY29sb3InLFxuICAnbWF0LWV4cGFuc2lvbi1wYW5lbC10eXBvZ3JhcGh5JzogJ2V4cGFuc2lvbi10eXBvZ3JhcGh5Jyxcbn07XG5cbi8vIFRoZSBjb21wb25lbnQgdGhlbWVzIGFsbCBmb2xsb3cgdGhlIHNhbWUgcGF0dGVybiBzbyB3ZSBjYW4gc3BhcmUgb3Vyc2VsdmVzIHNvbWUgdHlwaW5nLlxuW1xuICAnb3B0aW9uJywgJ29wdGdyb3VwJywgJ3BzZXVkby1jaGVja2JveCcsICdhdXRvY29tcGxldGUnLCAnYmFkZ2UnLCAnYm90dG9tLXNoZWV0JywgJ2J1dHRvbicsXG4gICdidXR0b24tdG9nZ2xlJywgJ2NhcmQnLCAnY2hlY2tib3gnLCAnY2hpcHMnLCAnZGl2aWRlcicsICd0YWJsZScsICdkYXRlcGlja2VyJywgJ2RpYWxvZycsXG4gICdncmlkLWxpc3QnLCAnaWNvbicsICdpbnB1dCcsICdsaXN0JywgJ21lbnUnLCAncGFnaW5hdG9yJywgJ3Byb2dyZXNzLWJhcicsICdwcm9ncmVzcy1zcGlubmVyJyxcbiAgJ3JhZGlvJywgJ3NlbGVjdCcsICdzaWRlbmF2JywgJ3NsaWRlLXRvZ2dsZScsICdzbGlkZXInLCAnc3RlcHBlcicsICdzb3J0JywgJ3RhYnMnLCAndG9vbGJhcicsXG4gICd0b29sdGlwJywgJ3NuYWNrLWJhcicsICdmb3JtLWZpZWxkJywgJ3RyZWUnXG5dLmZvckVhY2gobmFtZSA9PiB7XG4gIG1hdGVyaWFsTWl4aW5zW2BtYXQtJHtuYW1lfS10aGVtZWBdID0gYCR7bmFtZX0tdGhlbWVgO1xuICBtYXRlcmlhbE1peGluc1tgbWF0LSR7bmFtZX0tY29sb3JgXSA9IGAke25hbWV9LWNvbG9yYDtcbiAgbWF0ZXJpYWxNaXhpbnNbYG1hdC0ke25hbWV9LXR5cG9ncmFwaHlgXSA9IGAke25hbWV9LXR5cG9ncmFwaHlgO1xufSk7XG5cbi8qKiBNYXBwaW5nIG9mIE1hdGVyaWFsIGZ1bmN0aW9ucyB0aGF0IHNob3VsZCBiZSByZW5hbWVkLiAqL1xuY29uc3QgbWF0ZXJpYWxGdW5jdGlvbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdtYXQtY29sb3InOiAnZ2V0LWNvbG9yLWZyb20tcGFsZXR0ZScsXG4gICdtYXQtY29udHJhc3QnOiAnZ2V0LWNvbnRyYXN0LWNvbG9yLWZyb20tcGFsZXR0ZScsXG4gICdtYXQtcGFsZXR0ZSc6ICdkZWZpbmUtcGFsZXR0ZScsXG4gICdtYXQtZGFyay10aGVtZSc6ICdkZWZpbmUtZGFyay10aGVtZScsXG4gICdtYXQtbGlnaHQtdGhlbWUnOiAnZGVmaW5lLWxpZ2h0LXRoZW1lJyxcbiAgJ21hdC10eXBvZ3JhcGh5LWxldmVsJzogJ2RlZmluZS10eXBvZ3JhcGh5LWxldmVsJyxcbiAgJ21hdC10eXBvZ3JhcGh5LWNvbmZpZyc6ICdkZWZpbmUtdHlwb2dyYXBoeS1jb25maWcnLFxuICAnbWF0LWZvbnQtc2l6ZSc6ICdmb250LXNpemUnLFxuICAnbWF0LWxpbmUtaGVpZ2h0JzogJ2xpbmUtaGVpZ2h0JyxcbiAgJ21hdC1mb250LXdlaWdodCc6ICdmb250LXdlaWdodCcsXG4gICdtYXQtbGV0dGVyLXNwYWNpbmcnOiAnbGV0dGVyLXNwYWNpbmcnLFxuICAnbWF0LWZvbnQtZmFtaWx5JzogJ2ZvbnQtZmFtaWx5Jyxcbn07XG5cbi8qKiBNYXBwaW5nIG9mIE1hdGVyaWFsIHZhcmlhYmxlcyB0aGF0IHNob3VsZCBiZSByZW5hbWVkLiAqL1xuY29uc3QgbWF0ZXJpYWxWYXJpYWJsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdtYXQtbGlnaHQtdGhlbWUtYmFja2dyb3VuZCc6ICdsaWdodC10aGVtZS1iYWNrZ3JvdW5kLXBhbGV0dGUnLFxuICAnbWF0LWRhcmstdGhlbWUtYmFja2dyb3VuZCc6ICdkYXJrLXRoZW1lLWJhY2tncm91bmQtcGFsZXR0ZScsXG4gICdtYXQtbGlnaHQtdGhlbWUtZm9yZWdyb3VuZCc6ICdsaWdodC10aGVtZS1mb3JlZ3JvdW5kLXBhbGV0dGUnLFxuICAnbWF0LWRhcmstdGhlbWUtZm9yZWdyb3VuZCc6ICdkYXJrLXRoZW1lLWZvcmVncm91bmQtcGFsZXR0ZScsXG59O1xuXG4vLyBUaGUgcGFsZXR0ZXMgYWxsIGZvbGxvdyB0aGUgc2FtZSBwYXR0ZXJuLlxuW1xuICAncmVkJywgJ3BpbmsnLCAnaW5kaWdvJywgJ3B1cnBsZScsICdkZWVwLXB1cnBsZScsICdibHVlJywgJ2xpZ2h0LWJsdWUnLCAnY3lhbicsICd0ZWFsJywgJ2dyZWVuJyxcbiAgJ2xpZ2h0LWdyZWVuJywgJ2xpbWUnLCAneWVsbG93JywgJ2FtYmVyJywgJ29yYW5nZScsICdkZWVwLW9yYW5nZScsICdicm93bicsICdncmV5JywgJ2dyYXknLFxuICAnYmx1ZS1ncmV5JywgJ2JsdWUtZ3JheSdcbl0uZm9yRWFjaChuYW1lID0+IG1hdGVyaWFsVmFyaWFibGVzW2BtYXQtJHtuYW1lfWBdID0gYCR7bmFtZX0tcGFsZXR0ZWApO1xuXG4vKiogTWFwcGluZyBvZiBDREsgdmFyaWFibGVzIHRoYXQgc2hvdWxkIGJlIHJlbmFtZWQuICovXG5jb25zdCBjZGtWYXJpYWJsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdjZGstei1pbmRleC1vdmVybGF5LWNvbnRhaW5lcic6ICd6LWluZGV4LW92ZXJsYXktY29udGFpbmVyJyxcbiAgJ2Nkay16LWluZGV4LW92ZXJsYXknOiAnei1pbmRleC1vdmVybGF5JyxcbiAgJ2Nkay16LWluZGV4LW92ZXJsYXktYmFja2Ryb3AnOiAnei1pbmRleC1vdmVybGF5LWJhY2tkcm9wJyxcbiAgJ2Nkay1vdmVybGF5LWRhcmstYmFja2Ryb3AtYmFja2dyb3VuZCc6ICdvdmVybGF5LWRhcmstYmFja2Ryb3AtYmFja2dyb3VuZCcsXG59O1xuXG4vKiogTWFwcGluZyBvZiBDREsgbWl4aW5zIHRoYXQgc2hvdWxkIGJlIHJlbmFtZWQuICovXG5jb25zdCBjZGtNaXhpbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdjZGstb3ZlcmxheSc6ICdvdmVybGF5JyxcbiAgJ2Nkay1hMTF5JzogJ2ExMXktdmlzdWFsbHktaGlkZGVuJyxcbiAgJ2Nkay1oaWdoLWNvbnRyYXN0JzogJ2hpZ2gtY29udHJhc3QnLFxuICAnY2RrLXRleHQtZmllbGQtYXV0b2ZpbGwtY29sb3InOiAndGV4dC1maWVsZC1hdXRvZmlsbC1jb2xvcicsXG4gIC8vIFRoaXMgb25lIHdhcyBzcGxpdCB1cCBpbnRvIHR3byBtaXhpbnMgd2hpY2ggaXMgdHJpY2tpZXIgdG9cbiAgLy8gbWlncmF0ZSBzbyBmb3Igbm93IHdlIGZvcndhcmQgdG8gdGhlIGRlcHJlY2F0ZWQgdmFyaWFudC5cbiAgJ2Nkay10ZXh0LWZpZWxkJzogJ3RleHQtZmllbGQnLFxufTtcblxuLyoqXG4gKiBNaWdyYXRlcyB0aGUgY29udGVudCBvZiBhIGZpbGUgdG8gdGhlIG5ldyB0aGVtaW5nIEFQSS4gTm90ZSB0aGF0IHRoaXMgbWlncmF0aW9uIGlzIHVzaW5nIHBsYWluXG4gKiBzdHJpbmcgbWFuaXB1bGF0aW9uLCByYXRoZXIgdGhhbiB0aGUgQVNUIGZyb20gUG9zdENTUyBhbmQgdGhlIHNjaGVtYXRpY3Mgc3RyaW5nIG1hbmlwdWxhdGlvblxuICogQVBJcywgYmVjYXVzZSBpdCBhbGxvd3MgdXMgdG8gcnVuIGl0IGluc2lkZSBnMyBhbmQgdG8gYXZvaWQgaW50cm9kdWNpbmcgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSBjb250ZW50IENvbnRlbnQgb2YgdGhlIGZpbGUuXG4gKiBAcGFyYW0gb2xkTWF0ZXJpYWxQcmVmaXggUHJlZml4IHdpdGggd2hpY2ggdGhlIG9sZCBNYXRlcmlhbCBpbXBvcnRzIHNob3VsZCBzdGFydC5cbiAqICAgSGFzIHRvIGVuZCB3aXRoIGEgc2xhc2guIEUuZy4gaWYgYEBpbXBvcnQgJ35AYW5ndWxhci9tYXRlcmlhbC90aGVtaW5nJ2Agc2hvdWxkIGJlXG4gKiAgIG1hdGNoZWQsIHRoZSBwcmVmaXggd291bGQgYmUgYH5AYW5ndWxhci9tYXRlcmlhbC9gLlxuICogQHBhcmFtIG9sZENka1ByZWZpeCBQcmVmaXggd2l0aCB3aGljaCB0aGUgb2xkIENESyBpbXBvcnRzIHNob3VsZCBzdGFydC5cbiAqICAgSGFzIHRvIGVuZCB3aXRoIGEgc2xhc2guIEUuZy4gaWYgYEBpbXBvcnQgJ35AYW5ndWxhci9jZGsvb3ZlcmxheSdgIHNob3VsZCBiZVxuICogICBtYXRjaGVkLCB0aGUgcHJlZml4IHdvdWxkIGJlIGB+QGFuZ3VsYXIvY2RrL2AuXG4gKiBAcGFyYW0gbmV3TWF0ZXJpYWxJbXBvcnRQYXRoIE5ldyBpbXBvcnQgdG8gdGhlIE1hdGVyaWFsIHRoZW1pbmcgQVBJIChlLmcuIGB+QGFuZ3VsYXIvbWF0ZXJpYWxgKS5cbiAqIEBwYXJhbSBuZXdDZGtJbXBvcnRQYXRoIE5ldyBpbXBvcnQgdG8gdGhlIENESyBTYXNzIEFQSXMgKGUuZy4gYH5AYW5ndWxhci9jZGtgKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1pZ3JhdGVGaWxlQ29udGVudChjb250ZW50OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZE1hdGVyaWFsUHJlZml4OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZENka1ByZWZpeDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdNYXRlcmlhbEltcG9ydFBhdGg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q2RrSW1wb3J0UGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gRHJvcCB0aGUgQ0RLIGltcG9ydHMgYW5kIGRldGVjdCB0aGVpciBuYW1lc3BhY2VzLlxuICBjb25zdCBjZGtSZXN1bHRzID0gZGV0ZWN0QW5kRHJvcEltcG9ydHMoY29udGVudCwgb2xkQ2RrUHJlZml4KTtcbiAgY29udGVudCA9IGNka1Jlc3VsdHMuY29udGVudDtcblxuICAvLyBEcm9wIHRoZSBNYXRlcmlhbCBpbXBvcnRzIGFuZCBkZXRlY3QgdGhlaXIgbmFtZXNwYWNlcy5cbiAgY29uc3QgbWF0ZXJpYWxSZXN1bHRzID0gZGV0ZWN0QW5kRHJvcEltcG9ydHMoY29udGVudCwgb2xkTWF0ZXJpYWxQcmVmaXgpO1xuICBjb250ZW50ID0gbWF0ZXJpYWxSZXN1bHRzLmNvbnRlbnQ7XG5cbiAgLy8gSWYgbm90aGluZyBoYXMgY2hhbmdlZCwgdGhlbiB0aGUgZmlsZSBkb2Vzbid0IGltcG9ydCB0aGUgTWF0ZXJpYWwgdGhlbWluZyBBUEkuXG4gIGlmIChtYXRlcmlhbFJlc3VsdHMuaGFzQ2hhbmdlZCB8fCBjZGtSZXN1bHRzLmhhc0NoYW5nZWQpIHtcbiAgICAvLyBSZXBsYWNpbmcgdGhlIGltcG9ydHMgbWF5IGhhdmUgcmVzdWx0ZWQgaW4gbGVhZGluZyB3aGl0ZXNwYWNlLlxuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoL15cXHMrLywgJycpO1xuICAgIGNvbnRlbnQgPSBtaWdyYXRlQ2RrU3ltYm9scyhjb250ZW50LCBuZXdDZGtJbXBvcnRQYXRoLCBjZGtSZXN1bHRzLm5hbWVzcGFjZXMpO1xuICAgIGNvbnRlbnQgPSBtaWdyYXRlTWF0ZXJpYWxTeW1ib2xzKGNvbnRlbnQsIG5ld01hdGVyaWFsSW1wb3J0UGF0aCwgbWF0ZXJpYWxSZXN1bHRzLm5hbWVzcGFjZXMpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogRmluZHMgYWxsIG9mIHRoZSBpbXBvcnRzIG1hdGNoaW5nIGEgcHJlZml4LCByZW1vdmVzIHRoZW0gZnJvbVxuICogdGhlIGNvbnRlbnQgc3RyaW5nIGFuZCByZXR1cm5zIHNvbWUgaW5mb3JtYXRpb24gYWJvdXQgdGhlbS5cbiAqIEBwYXJhbSBjb250ZW50IENvbnRlbnQgZnJvbSB3aGljaCB0byByZW1vdmUgdGhlIGltcG9ydHMuXG4gKiBAcGFyYW0gcHJlZml4IFByZWZpeCB0aGF0IHRoZSBpbXBvcnRzIHNob3VsZCBzdGFydCB3aXRoLlxuICovXG5mdW5jdGlvbiBkZXRlY3RBbmREcm9wSW1wb3J0cyhjb250ZW50OiBzdHJpbmcsIHByZWZpeDogc3RyaW5nKTpcbiAge2NvbnRlbnQ6IHN0cmluZywgaGFzQ2hhbmdlZDogYm9vbGVhbiwgbmFtZXNwYWNlczogc3RyaW5nW119IHtcbiAgaWYgKHByZWZpeFtwcmVmaXgubGVuZ3RoIC0gMV0gIT09ICcvJykge1xuICAgIC8vIFNvbWUgb2YgdGhlIGxvZ2ljIGZ1cnRoZXIgZG93biBtYWtlcyBhc3N1bXB0aW9ucyBhYm91dCB0aGUgaW1wb3J0IGRlcHRoLlxuICAgIHRocm93IEVycm9yKGBQcmVmaXggXCIke3ByZWZpeH1cIiBoYXMgdG8gZW5kIGluIGEgc2xhc2guYCk7XG4gIH1cblxuICAvLyBMaXN0IG9mIGBAdXNlYCBuYW1lc3BhY2VzIGZyb20gd2hpY2ggQW5ndWxhciBDREsvTWF0ZXJpYWwgQVBJcyBtYXkgYmUgcmVmZXJlbmNlZC5cbiAgLy8gU2luY2Ugd2Uga25vdyB0aGF0IHRoZSBsaWJyYXJ5IGRvZXNuJ3QgaGF2ZSBhbnkgbmFtZSBjb2xsaXNpb25zLCB3ZSBjYW4gdHJlYXQgYWxsIG9mIHRoZXNlXG4gIC8vIG5hbWVzcGFjZXMgYXMgZXF1aXZhbGVudC5cbiAgY29uc3QgbmFtZXNwYWNlczogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgcGF0dGVybiA9IG5ldyBSZWdFeHAoYEAoaW1wb3J0fHVzZSkgK1snXCJdJHtlc2NhcGVSZWdFeHAocHJlZml4KX0uKlsnXCJdLio7P1xcbmAsICdnJyk7XG4gIGxldCBoYXNDaGFuZ2VkID0gZmFsc2U7XG5cbiAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZShwYXR0ZXJuLCAoZnVsbEltcG9ydCwgdHlwZTogJ2ltcG9ydCcgfCAndXNlJykgPT4ge1xuICAgIGlmICh0eXBlID09PSAndXNlJykge1xuICAgICAgY29uc3QgbmFtZXNwYWNlID0gZXh0cmFjdE5hbWVzcGFjZUZyb21Vc2VTdGF0ZW1lbnQoZnVsbEltcG9ydCk7XG5cbiAgICAgIGlmIChuYW1lc3BhY2VzLmluZGV4T2YobmFtZXNwYWNlKSA9PT0gLTEpIHtcbiAgICAgICAgbmFtZXNwYWNlcy5wdXNoKG5hbWVzcGFjZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaGFzQ2hhbmdlZCA9IHRydWU7XG4gICAgcmV0dXJuICcnO1xuICB9KTtcblxuICByZXR1cm4ge2NvbnRlbnQsIGhhc0NoYW5nZWQsIG5hbWVzcGFjZXN9O1xufVxuXG4vKiogTWlncmF0ZXMgdGhlIE1hdGVyaWFsIHN5bWJscyBpbiBhIGZpbGUuICovXG5mdW5jdGlvbiBtaWdyYXRlTWF0ZXJpYWxTeW1ib2xzKGNvbnRlbnQ6IHN0cmluZywgaW1wb3J0UGF0aDogc3RyaW5nLCBuYW1lc3BhY2VzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIGNvbnN0IGluaXRpYWxDb250ZW50ID0gY29udGVudDtcbiAgY29uc3QgbmFtZXNwYWNlID0gJ21hdCc7XG5cbiAgLy8gTWlncmF0ZSB0aGUgbWl4aW5zLlxuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhjb250ZW50LCBtYXRlcmlhbE1peGlucywgbmFtZXNwYWNlcywgbWl4aW5LZXlGb3JtYXR0ZXIsXG4gICAgZ2V0TWl4aW5WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBNaWdyYXRlIHRoZSBmdW5jdGlvbnMuXG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIG1hdGVyaWFsRnVuY3Rpb25zLCBuYW1lc3BhY2VzLCBmdW5jdGlvbktleUZvcm1hdHRlcixcbiAgICBnZXRGdW5jdGlvblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSkpO1xuXG4gIC8vIE1pZ3JhdGUgdGhlIHZhcmlhYmxlcy5cbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoY29udGVudCwgbWF0ZXJpYWxWYXJpYWJsZXMsIG5hbWVzcGFjZXMsIHZhcmlhYmxlS2V5Rm9ybWF0dGVyLFxuICAgIGdldFZhcmlhYmxlVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlKSk7XG5cbiAgaWYgKGNvbnRlbnQgIT09IGluaXRpYWxDb250ZW50KSB7XG4gICAgLy8gQWRkIGFuIGltcG9ydCB0byB0aGUgbmV3IEFQSSBvbmx5IGlmIGFueSBvZiB0aGUgQVBJcyB3ZXJlIGJlaW5nIHVzZWQuXG4gICAgY29udGVudCA9IGluc2VydFVzZVN0YXRlbWVudChjb250ZW50LCBpbXBvcnRQYXRoLCBuYW1lc3BhY2UpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKiBNaWdyYXRlcyB0aGUgQ0RLIHN5bWJvbHMgaW4gYSBmaWxlLiAqL1xuZnVuY3Rpb24gbWlncmF0ZUNka1N5bWJvbHMoY29udGVudDogc3RyaW5nLCBpbXBvcnRQYXRoOiBzdHJpbmcsIG5hbWVzcGFjZXM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgY29uc3QgaW5pdGlhbENvbnRlbnQgPSBjb250ZW50O1xuICBjb25zdCBuYW1lc3BhY2UgPSAnY2RrJztcblxuICAvLyBNaWdyYXRlIHRoZSBtaXhpbnMuXG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIGNka01peGlucywgbmFtZXNwYWNlcywgbWl4aW5LZXlGb3JtYXR0ZXIsXG4gICAgZ2V0TWl4aW5WYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBNaWdyYXRlIHRoZSB2YXJpYWJsZXMuXG4gIGNvbnRlbnQgPSByZW5hbWVTeW1ib2xzKGNvbnRlbnQsIGNka1ZhcmlhYmxlcywgbmFtZXNwYWNlcywgdmFyaWFibGVLZXlGb3JtYXR0ZXIsXG4gICAgZ2V0VmFyaWFibGVWYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2UpKTtcblxuICAvLyBQcmV2aW91c2x5IHRoZSBDREsgc3ltYm9scyB3ZXJlIGV4cG9zZWQgdGhyb3VnaCBgbWF0ZXJpYWwvdGhlbWluZ2AsIGJ1dCBub3cgd2UgaGF2ZSBhXG4gIC8vIGRlZGljYXRlZCBlbnRyeXBvaW50IGZvciB0aGUgQ0RLLiBPbmx5IGFkZCBhbiBpbXBvcnQgZm9yIGl0IGlmIGFueSBvZiB0aGUgc3ltYm9scyBhcmUgdXNlZC5cbiAgaWYgKGNvbnRlbnQgIT09IGluaXRpYWxDb250ZW50KSB7XG4gICAgY29udGVudCA9IGluc2VydFVzZVN0YXRlbWVudChjb250ZW50LCBpbXBvcnRQYXRoLCBuYW1lc3BhY2UpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogUmVuYW1lcyBhbGwgU2FzcyBzeW1ib2xzIGluIGEgZmlsZSBiYXNlZCBvbiBhIHByZS1kZWZpbmVkIG1hcHBpbmcuXG4gKiBAcGFyYW0gY29udGVudCBDb250ZW50IG9mIGEgZmlsZSB0byBiZSBtaWdyYXRlZC5cbiAqIEBwYXJhbSBtYXBwaW5nIE1hcHBpbmcgYmV0d2VlbiBzeW1ib2wgbmFtZXMgYW5kIHRoZWlyIHJlcGxhY2VtZW50cy5cbiAqIEBwYXJhbSBnZXRLZXlQYXR0ZXJuIEZ1bmN0aW9uIHVzZWQgdG8gdHVybiBlYWNoIG9mIHRoZSBrZXlzIGludG8gYSByZWdleC5cbiAqIEBwYXJhbSBmb3JtYXRWYWx1ZSBGb3JtYXRzIHRoZSB2YWx1ZSB0aGF0IHdpbGwgcmVwbGFjZSBhbnkgbWF0Y2hlcyBvZiB0aGUgcGF0dGVybiByZXR1cm5lZCBieVxuICogIGBnZXRLZXlQYXR0ZXJuYC5cbiAqL1xuZnVuY3Rpb24gcmVuYW1lU3ltYm9scyhjb250ZW50OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgIG1hcHBpbmc6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZXM6IHN0cmluZ1tdLFxuICAgICAgICAgICAgICAgICAgICAgICBnZXRLZXlQYXR0ZXJuOiAobmFtZXNwYWNlOiBzdHJpbmd8bnVsbCwga2V5OiBzdHJpbmcpID0+IFJlZ0V4cCxcbiAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0VmFsdWU6IChrZXk6IHN0cmluZykgPT4gc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gVGhlIG51bGwgYXQgdGhlIGVuZCBpcyBzbyB0aGF0IHdlIG1ha2Ugb25lIGxhc3QgcGFzcyB0byBjb3ZlciBub24tbmFtZXNwYWNlZCBzeW1ib2xzLlxuICBbLi4ubmFtZXNwYWNlcy5zbGljZSgpLnNvcnQoc29ydExlbmd0aERlc2NlbmRpbmcpLCBudWxsXS5mb3JFYWNoKG5hbWVzcGFjZSA9PiB7XG4gICAgLy8gTWlncmF0ZSB0aGUgbG9uZ2VzdCBrZXlzIGZpcnN0IHNvIHRoYXQgb3VyIHJlZ2V4LWJhc2VkIHJlcGxhY2VtZW50cyBkb24ndCBhY2NpZGVudGFsbHlcbiAgICAvLyBjYXB0dXJlIGtleXMgdGhhdCBjb250YWluIG90aGVyIGtleXMuIEUuZy4gYCRtYXQtYmx1ZWAgaXMgY29udGFpbmVkIHdpdGhpbiBgJG1hdC1ibHVlLWdyZXlgLlxuICAgIE9iamVjdC5rZXlzKG1hcHBpbmcpLnNvcnQoc29ydExlbmd0aERlc2NlbmRpbmcpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGNvbnN0IHBhdHRlcm4gPSBnZXRLZXlQYXR0ZXJuKG5hbWVzcGFjZSwga2V5KTtcblxuICAgICAgLy8gU2FuaXR5IGNoZWNrIHNpbmNlIG5vbi1nbG9iYWwgcmVnZXhlcyB3aWxsIG9ubHkgcmVwbGFjZSB0aGUgZmlyc3QgbWF0Y2guXG4gICAgICBpZiAocGF0dGVybi5mbGFncy5pbmRleE9mKCdnJykgPT09IC0xKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdSZXBsYWNlbWVudCBwYXR0ZXJuIG11c3QgYmUgZ2xvYmFsLicpO1xuICAgICAgfVxuXG4gICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKHBhdHRlcm4sIGZvcm1hdFZhbHVlKG1hcHBpbmdba2V5XSkpO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqIEluc2VydHMgYW4gYEB1c2VgIHN0YXRlbWVudCBpbiBhIHN0cmluZy4gKi9cbmZ1bmN0aW9uIGluc2VydFVzZVN0YXRlbWVudChjb250ZW50OiBzdHJpbmcsIGltcG9ydFBhdGg6IHN0cmluZywgbmFtZXNwYWNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBTYXNzIGhhcyBhIGxpbWl0YXRpb24gdGhhdCBhbGwgYEB1c2VgIGRlY2xhcmF0aW9ucyBoYXZlIHRvIGNvbWUgYmVmb3JlIGBAaW1wb3J0YCBzbyB3ZSBoYXZlXG4gIC8vIHRvIGZpbmQgdGhlIGZpcnN0IGltcG9ydCBhbmQgaW5zZXJ0IGJlZm9yZSBpdC4gVGVjaG5pY2FsbHkgd2UgY2FuIGdldCBhd2F5IHdpdGggYWx3YXlzXG4gIC8vIGluc2VydGluZyBhdCAwLCBidXQgdGhlIGZpbGUgbWF5IHN0YXJ0IHdpdGggc29tZXRoaW5nIGxpa2UgYSBsaWNlbnNlIGhlYWRlci5cbiAgY29uc3QgbmV3SW1wb3J0SW5kZXggPSBNYXRoLm1heCgwLCBjb250ZW50LmluZGV4T2YoJ0BpbXBvcnQgJykpO1xuICByZXR1cm4gY29udGVudC5zbGljZSgwLCBuZXdJbXBvcnRJbmRleCkgKyBgQHVzZSAnJHtpbXBvcnRQYXRofScgYXMgJHtuYW1lc3BhY2V9O1xcbmAgK1xuICAgICAgICAgY29udGVudC5zbGljZShuZXdJbXBvcnRJbmRleCk7XG59XG5cbi8qKiBGb3JtYXRzIGEgbWlncmF0aW9uIGtleSBhcyBhIFNhc3MgbWl4aW4gaW52b2NhdGlvbi4gKi9cbmZ1bmN0aW9uIG1peGluS2V5Rm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nfG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIC8vIE5vdGUgdGhhdCBhZGRpbmcgYSBgKGAgYXQgdGhlIGVuZCBvZiB0aGUgcGF0dGVybiB3b3VsZCBiZSBtb3JlIGFjY3VyYXRlLCBidXQgbWl4aW5cbiAgLy8gaW52b2NhdGlvbnMgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSB0byBpbmNsdWRlIHRoZSBwYXJhbnRoZXNlcy4gV2UgY291bGQgYWRkIGBbKDtdYCxcbiAgLy8gYnV0IHRoZW4gd2Ugd29uJ3Qga25vdyB3aGljaCBjaGFyYWN0ZXIgdG8gaW5jbHVkZSBpbiB0aGUgcmVwbGFjZW1lbnQgc3RyaW5nLlxuICByZXR1cm4gbmV3IFJlZ0V4cChgQGluY2x1ZGUgKyR7ZXNjYXBlUmVnRXhwKChuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJykgKyBuYW1lKX1gLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyBtaXhpbiByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldE1peGluVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICAvLyBOb3RlIHRoYXQgYWRkaW5nIGEgYChgIGF0IHRoZSBlbmQgb2YgdGhlIHBhdHRlcm4gd291bGQgYmUgbW9yZSBhY2N1cmF0ZSxcbiAgLy8gYnV0IG1peGluIGludm9jYXRpb25zIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgdG8gaW5jbHVkZSB0aGUgcGFyYW50aGVzZXMuXG4gIHJldHVybiBuYW1lID0+IGBAaW5jbHVkZSAke25hbWVzcGFjZX0uJHtuYW1lfWA7XG59XG5cbi8qKiBGb3JtYXRzIGEgbWlncmF0aW9uIGtleSBhcyBhIFNhc3MgZnVuY3Rpb24gaW52b2NhdGlvbi4gKi9cbmZ1bmN0aW9uIGZ1bmN0aW9uS2V5Rm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nfG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIHJldHVybiBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cChgJHtuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJ30ke25hbWV9KGApLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyBmdW5jdGlvbiByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldEZ1bmN0aW9uVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICByZXR1cm4gbmFtZSA9PiBgJHtuYW1lc3BhY2V9LiR7bmFtZX0oYDtcbn1cblxuLyoqIEZvcm1hdHMgYSBtaWdyYXRpb24ga2V5IGFzIGEgU2FzcyB2YXJpYWJsZS4gKi9cbmZ1bmN0aW9uIHZhcmlhYmxlS2V5Rm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nfG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIHJldHVybiBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cChgJHtuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJ30kJHtuYW1lfWApLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyB2YXJpYWJsZSByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldFZhcmlhYmxlVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICByZXR1cm4gbmFtZSA9PiBgJHtuYW1lc3BhY2V9LiQke25hbWV9YDtcbn1cblxuLyoqIEVzY2FwZXMgc3BlY2lhbCByZWdleCBjaGFyYWN0ZXJzIGluIGEgc3RyaW5nLiAqL1xuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8W1xcXVxcL1xcXFxdKS9nLCAnXFxcXCQxJyk7XG59XG5cbi8qKiBVc2VkIHdpdGggYEFycmF5LnByb3RvdHlwZS5zb3J0YCB0byBvcmRlciBzdHJpbmdzIGluIGRlc2NlbmRpbmcgbGVuZ3RoLiAqL1xuZnVuY3Rpb24gc29ydExlbmd0aERlc2NlbmRpbmcoYTogc3RyaW5nLCBiOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XG59XG5cbi8qKiBQYXJzZXMgb3V0IHRoZSBuYW1lc3BhY2UgZnJvbSBhIFNhc3MgYEB1c2VgIHN0YXRlbWVudC4gKi9cbmZ1bmN0aW9uIGV4dHJhY3ROYW1lc3BhY2VGcm9tVXNlU3RhdGVtZW50KGZ1bGxJbXBvcnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGNsb3NlUXVvdGVJbmRleCA9IE1hdGgubWF4KGZ1bGxJbXBvcnQubGFzdEluZGV4T2YoYFwiYCksIGZ1bGxJbXBvcnQubGFzdEluZGV4T2YoYCdgKSk7XG5cbiAgaWYgKGNsb3NlUXVvdGVJbmRleCA+IC0xKSB7XG4gICAgY29uc3QgYXNFeHByZXNzaW9uID0gJ2FzICc7XG4gICAgY29uc3QgYXNJbmRleCA9IGZ1bGxJbXBvcnQuaW5kZXhPZihhc0V4cHJlc3Npb24sIGNsb3NlUXVvdGVJbmRleCk7XG5cbiAgICAvLyBJZiB3ZSBmb3VuZCBhbiBgIGFzIGAgZXhwcmVzc2lvbiwgd2UgY29uc2lkZXIgdGhlIHJlc3Qgb2YgdGhlIHRleHQgYXMgdGhlIG5hbWVzcGFjZS5cbiAgICBpZiAoYXNJbmRleCA+IC0xKSB7XG4gICAgICByZXR1cm4gZnVsbEltcG9ydC5zbGljZShhc0luZGV4ICsgYXNFeHByZXNzaW9uLmxlbmd0aCkuc3BsaXQoJzsnKVswXS50cmltKCk7XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlIHRoZSBuYW1lc3BhY2UgaXMgdGhlIG5hbWUgb2YgdGhlIGZpbGUgdGhhdCBpcyBiZWluZyBpbXBvcnRlZC5cbiAgICBjb25zdCBsYXN0U2xhc2hJbmRleCA9IGZ1bGxJbXBvcnQubGFzdEluZGV4T2YoJy8nLCBjbG9zZVF1b3RlSW5kZXgpO1xuXG4gICAgaWYgKGxhc3RTbGFzaEluZGV4ID4gLTEpIHtcbiAgICAgIGNvbnN0IGZpbGVOYW1lID0gZnVsbEltcG9ydC5zbGljZShsYXN0U2xhc2hJbmRleCArIDEsIGNsb3NlUXVvdGVJbmRleClcbiAgICAgICAgLy8gU2FzcyBhbGxvd3MgZm9yIGxlYWRpbmcgdW5kZXJzY29yZXMgdG8gYmUgb21pdHRlZCBhbmQgaXQgdGVjaG5pY2FsbHkgc3VwcG9ydHMgLnNjc3MuXG4gICAgICAgIC5yZXBsYWNlKC9eX3woXFwuaW1wb3J0KT9cXC5zY3NzJHxcXC5pbXBvcnQkL2csICcnKTtcblxuICAgICAgLy8gU2FzcyBpZ25vcmVzIGAvaW5kZXhgIGFuZCBpbmZlcnMgdGhlIG5hbWVzcGFjZSBhcyB0aGUgbmV4dCBzZWdtZW50IGluIHRoZSBwYXRoLlxuICAgICAgaWYgKGZpbGVOYW1lID09PSAnaW5kZXgnKSB7XG4gICAgICAgIGNvbnN0IG5leHRTbGFzaEluZGV4ID0gZnVsbEltcG9ydC5sYXN0SW5kZXhPZignLycsIGxhc3RTbGFzaEluZGV4IC0gMSk7XG5cbiAgICAgICAgaWYgKG5leHRTbGFzaEluZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gZnVsbEltcG9ydC5zbGljZShuZXh0U2xhc2hJbmRleCArIDEsIGxhc3RTbGFzaEluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZpbGVOYW1lO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRocm93IEVycm9yKGBDb3VsZCBub3QgZXh0cmFjdCBuYW1lc3BhY2UgZnJvbSBpbXBvcnQgXCIke2Z1bGxJbXBvcnR9XCIuYCk7XG59XG4iXX0=