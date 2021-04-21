"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.removedMaterialVariables = exports.cdkMixins = exports.cdkVariables = exports.materialVariables = exports.materialFunctions = exports.materialMixins = void 0;
/** Mapping of Material mixins that should be renamed. */
exports.materialMixins = {
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
    exports.materialMixins[`mat-${name}-theme`] = `${name}-theme`;
    exports.materialMixins[`mat-${name}-color`] = `${name}-color`;
    exports.materialMixins[`mat-${name}-typography`] = `${name}-typography`;
});
/** Mapping of Material functions that should be renamed. */
exports.materialFunctions = {
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
exports.materialVariables = {
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
].forEach(name => exports.materialVariables[`mat-${name}`] = `${name}-palette`);
/** Mapping of CDK variables that should be renamed. */
exports.cdkVariables = {
    'cdk-z-index-overlay-container': 'overlay-container-z-index',
    'cdk-z-index-overlay': 'overlay-z-index',
    'cdk-z-index-overlay-backdrop': 'overlay-backdrop-z-index',
    'cdk-overlay-dark-backdrop-background': 'overlay-backdrop-color',
};
/** Mapping of CDK mixins that should be renamed. */
exports.cdkMixins = {
    'cdk-overlay': 'overlay',
    'cdk-a11y': 'a11y-visually-hidden',
    'cdk-high-contrast': 'high-contrast',
    'cdk-text-field-autofill-color': 'text-field-autofill-color',
    // This one was split up into two mixins which is trickier to
    // migrate so for now we forward to the deprecated variant.
    'cdk-text-field': 'text-field',
};
/**
 * Material variables that have been removed from the public API
 * and which should be replaced with their values.
 */
exports.removedMaterialVariables = {
    // Note: there's also a usage of a variable called `$pi`, but the name is short enough that
    // it matches things like `$mat-pink`. Don't migrate it since it's unlikely to be used.
    'mat-xsmall': `'max-width: 599px'`,
    'mat-small': `'max-width: 959px'`,
    'mat-toggle-padding': '8px',
    'mat-toggle-size': '20px',
    'mat-linear-out-slow-in-timing-function': 'cubic-bezier(0, 0, 0.2, 0.1)',
    'mat-fast-out-slow-in-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'mat-fast-out-linear-in-timing-function': 'cubic-bezier(0.4, 0, 1, 1)',
    'mat-elevation-transition-duration': '280ms',
    'mat-elevation-transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'mat-elevation-color': '#000',
    'mat-elevation-opacity': '1',
    'mat-elevation-prefix': `'mat-elevation-z'`,
    'mat-ripple-color-opacity': '0.1',
    'mat-badge-font-size': '12px',
    'mat-badge-font-weight': '600',
    'mat-badge-default-size': '22px',
    'mat-badge-small-size': '16px',
    'mat-badge-large-size': '28px',
    'mat-button-toggle-standard-height': '48px',
    'mat-button-toggle-standard-minimum-height': '24px',
    'mat-button-toggle-standard-maximum-height': '48px',
    'mat-chip-remove-font-size': '18px',
    'mat-datepicker-selected-today-box-shadow-width': '1px',
    'mat-datepicker-selected-fade-amount': '0.6',
    'mat-datepicker-range-fade-amount': '0.2',
    'mat-datepicker-today-fade-amount': '0.2',
    'mat-calendar-body-font-size': '13px',
    'mat-calendar-weekday-table-font-size': '11px',
    'mat-expansion-panel-header-collapsed-height': '48px',
    'mat-expansion-panel-header-collapsed-minimum-height': '36px',
    'mat-expansion-panel-header-collapsed-maximum-height': '48px',
    'mat-expansion-panel-header-expanded-height': '64px',
    'mat-expansion-panel-header-expanded-minimum-height': '48px',
    'mat-expansion-panel-header-expanded-maximum-height': '64px',
    'mat-expansion-panel-header-transition': '225ms cubic-bezier(0.4, 0, 0.2, 1)',
    'mat-paginator-height': '56px',
    'mat-paginator-minimum-height': '40px',
    'mat-paginator-maximum-height': '56px',
    'mat-stepper-header-height': '72px',
    'mat-stepper-header-minimum-height': '42px',
    'mat-stepper-header-maximum-height': '72px',
    'mat-stepper-label-header-height': '24px',
    'mat-stepper-label-position-bottom-top-gap': '16px',
    'mat-stepper-label-min-width': '50px',
    'mat-vertical-stepper-content-margin': '36px',
    'mat-stepper-side-gap': '24px',
    'mat-stepper-line-width': '1px',
    'mat-stepper-line-gap': '8px',
    'mat-step-sub-label-font-size': '12px',
    'mat-step-header-icon-size': '16px',
    'mat-toolbar-minimum-height': '44px',
    'mat-toolbar-height-desktop': '64px',
    'mat-toolbar-maximum-height-desktop': '64px',
    'mat-toolbar-minimum-height-desktop': '44px',
    'mat-toolbar-height-mobile': '56px',
    'mat-toolbar-maximum-height-mobile': '56px',
    'mat-toolbar-minimum-height-mobile': '44px',
    'mat-tooltip-target-height': '22px',
    'mat-tooltip-font-size': '10px',
    'mat-tooltip-vertical-padding': '6px',
    'mat-tooltip-handset-target-height': '30px',
    'mat-tooltip-handset-font-size': '14px',
    'mat-tooltip-handset-vertical-padding': '8px',
    'mat-tree-node-height': '48px',
    'mat-tree-node-minimum-height': '24px',
    'mat-tree-node-maximum-height': '48px',
    'z-index-fab': '20',
    'z-index-drawer': '100',
    'ease-in-out-curve-function': 'cubic-bezier(0.35, 0, 0.25, 1)',
    'swift-ease-out-duration': '400ms',
    'swift-ease-out-timing-function': 'cubic-bezier(0.25, 0.8, 0.25, 1)',
    'swift-ease-out': 'all 400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
    'swift-ease-in-duration': '300ms',
    'swift-ease-in-timing-function': 'cubic-bezier(0.55, 0, 0.55, 0.2)',
    'swift-ease-in': 'all 300ms cubic-bezier(0.55, 0, 0.55, 0.2)',
    'swift-ease-in-out-duration': '500ms',
    'swift-ease-in-out-timing-function': 'cubic-bezier(0.35, 0, 0.25, 1)',
    'swift-ease-in-out': 'all 500ms cubic-bezier(0.35, 0, 0.25, 1)',
    'swift-linear-duration': '80ms',
    'swift-linear-timing-function': 'linear',
    'swift-linear': 'all 80ms linear'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctZ2VuZXJhdGUvdGhlbWluZy1hcGkvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHlEQUF5RDtBQUM1QyxRQUFBLGNBQWMsR0FBMkI7SUFDcEQsVUFBVSxFQUFFLE1BQU07SUFDbEIsZ0JBQWdCLEVBQUUsWUFBWTtJQUM5QixnQkFBZ0IsRUFBRSxZQUFZO0lBQzlCLHdCQUF3QixFQUFFLHNCQUFzQjtJQUNoRCw2QkFBNkIsRUFBRSw0QkFBNEI7SUFDM0Qsd0JBQXdCLEVBQUUsc0JBQXNCO0lBQ2hELHFCQUFxQixFQUFFLHNCQUFzQjtJQUM3QyxnQ0FBZ0MsRUFBRSxrQkFBa0I7SUFDcEQsZUFBZSxFQUFFLFdBQVc7SUFDNUIsMkJBQTJCLEVBQUUsdUJBQXVCO0lBQ3BELDBCQUEwQixFQUFFLHNCQUFzQjtJQUNsRCxZQUFZLEVBQUUsUUFBUTtJQUN0QixrQkFBa0IsRUFBRSxjQUFjO0lBQ2xDLGtCQUFrQixFQUFFLGNBQWM7SUFDbEMsNkJBQTZCLEVBQUUseUJBQXlCO0lBQ3hELG1DQUFtQyxFQUFFLCtCQUErQjtJQUNwRSxtQ0FBbUMsRUFBRSwrQkFBK0I7SUFDcEUsb0JBQW9CLEVBQUUsZ0JBQWdCO0lBQ3RDLDRGQUE0RjtJQUM1RixnR0FBZ0c7SUFDaEcsMkJBQTJCLEVBQUUsaUJBQWlCO0lBQzlDLDJCQUEyQixFQUFFLGlCQUFpQjtJQUM5QyxnQ0FBZ0MsRUFBRSxzQkFBc0I7Q0FDekQsQ0FBQztBQUVGLDBGQUEwRjtBQUMxRjtJQUNFLFFBQVEsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUTtJQUMxRixlQUFlLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsU0FB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bnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKiBNYXBwaW5nIG9mIE1hdGVyaWFsIG1peGlucyB0aGF0IHNob3VsZCBiZSByZW5hbWVkLiAqL1xuZXhwb3J0IGNvbnN0IG1hdGVyaWFsTWl4aW5zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnbWF0LWNvcmUnOiAnY29yZScsXG4gICdtYXQtY29yZS1jb2xvcic6ICdjb3JlLWNvbG9yJyxcbiAgJ21hdC1jb3JlLXRoZW1lJzogJ2NvcmUtdGhlbWUnLFxuICAnYW5ndWxhci1tYXRlcmlhbC10aGVtZSc6ICdhbGwtY29tcG9uZW50LXRoZW1lcycsXG4gICdhbmd1bGFyLW1hdGVyaWFsLXR5cG9ncmFwaHknOiAnYWxsLWNvbXBvbmVudC10eXBvZ3JhcGhpZXMnLFxuICAnYW5ndWxhci1tYXRlcmlhbC1jb2xvcic6ICdhbGwtY29tcG9uZW50LWNvbG9ycycsXG4gICdtYXQtYmFzZS10eXBvZ3JhcGh5JzogJ3R5cG9ncmFwaHktaGllcmFyY2h5JyxcbiAgJ21hdC10eXBvZ3JhcGh5LWxldmVsLXRvLXN0eWxlcyc6ICd0eXBvZ3JhcGh5LWxldmVsJyxcbiAgJ21hdC1lbGV2YXRpb24nOiAnZWxldmF0aW9uJyxcbiAgJ21hdC1vdmVycmlkYWJsZS1lbGV2YXRpb24nOiAnb3ZlcnJpZGFibGUtZWxldmF0aW9uJyxcbiAgJ21hdC1lbGV2YXRpb24tdHJhbnNpdGlvbic6ICdlbGV2YXRpb24tdHJhbnNpdGlvbicsXG4gICdtYXQtcmlwcGxlJzogJ3JpcHBsZScsXG4gICdtYXQtcmlwcGxlLWNvbG9yJzogJ3JpcHBsZS1jb2xvcicsXG4gICdtYXQtcmlwcGxlLXRoZW1lJzogJ3JpcHBsZS10aGVtZScsXG4gICdtYXQtc3Ryb25nLWZvY3VzLWluZGljYXRvcnMnOiAnc3Ryb25nLWZvY3VzLWluZGljYXRvcnMnLFxuICAnbWF0LXN0cm9uZy1mb2N1cy1pbmRpY2F0b3JzLWNvbG9yJzogJ3N0cm9uZy1mb2N1cy1pbmRpY2F0b3JzLWNvbG9yJyxcbiAgJ21hdC1zdHJvbmctZm9jdXMtaW5kaWNhdG9ycy10aGVtZSc6ICdzdHJvbmctZm9jdXMtaW5kaWNhdG9ycy10aGVtZScsXG4gICdtYXQtZm9udC1zaG9ydGhhbmQnOiAnZm9udC1zaG9ydGhhbmQnLFxuICAvLyBUaGUgZXhwYW5zaW9uIHBhbmVsIGlzIGEgc3BlY2lhbCBjYXNlLCBiZWNhdXNlIHRoZSBwYWNrYWdlIGlzIGNhbGxlZCBgZXhwYW5zaW9uYCwgYnV0IHRoZVxuICAvLyBtaXhpbnMgd2VyZSBwcmVmaXhlZCB3aXRoIGBleHBhbnNpb24tcGFuZWxgLiBUaGlzIHdhcyBjb3JyZWN0ZWQgYnkgdGhlIFNhc3MgbW9kdWxlIG1pZ3JhdGlvbi5cbiAgJ21hdC1leHBhbnNpb24tcGFuZWwtdGhlbWUnOiAnZXhwYW5zaW9uLXRoZW1lJyxcbiAgJ21hdC1leHBhbnNpb24tcGFuZWwtY29sb3InOiAnZXhwYW5zaW9uLWNvbG9yJyxcbiAgJ21hdC1leHBhbnNpb24tcGFuZWwtdHlwb2dyYXBoeSc6ICdleHBhbnNpb24tdHlwb2dyYXBoeScsXG59O1xuXG4vLyBUaGUgY29tcG9uZW50IHRoZW1lcyBhbGwgZm9sbG93IHRoZSBzYW1lIHBhdHRlcm4gc28gd2UgY2FuIHNwYXJlIG91cnNlbHZlcyBzb21lIHR5cGluZy5cbltcbiAgJ29wdGlvbicsICdvcHRncm91cCcsICdwc2V1ZG8tY2hlY2tib3gnLCAnYXV0b2NvbXBsZXRlJywgJ2JhZGdlJywgJ2JvdHRvbS1zaGVldCcsICdidXR0b24nLFxuICAnYnV0dG9uLXRvZ2dsZScsICdjYXJkJywgJ2NoZWNrYm94JywgJ2NoaXBzJywgJ2RpdmlkZXInLCAndGFibGUnLCAnZGF0ZXBpY2tlcicsICdkaWFsb2cnLFxuICAnZ3JpZC1saXN0JywgJ2ljb24nLCAnaW5wdXQnLCAnbGlzdCcsICdtZW51JywgJ3BhZ2luYXRvcicsICdwcm9ncmVzcy1iYXInLCAncHJvZ3Jlc3Mtc3Bpbm5lcicsXG4gICdyYWRpbycsICdzZWxlY3QnLCAnc2lkZW5hdicsICdzbGlkZS10b2dnbGUnLCAnc2xpZGVyJywgJ3N0ZXBwZXInLCAnc29ydCcsICd0YWJzJywgJ3Rvb2xiYXInLFxuICAndG9vbHRpcCcsICdzbmFjay1iYXInLCAnZm9ybS1maWVsZCcsICd0cmVlJ1xuXS5mb3JFYWNoKG5hbWUgPT4ge1xuICBtYXRlcmlhbE1peGluc1tgbWF0LSR7bmFtZX0tdGhlbWVgXSA9IGAke25hbWV9LXRoZW1lYDtcbiAgbWF0ZXJpYWxNaXhpbnNbYG1hdC0ke25hbWV9LWNvbG9yYF0gPSBgJHtuYW1lfS1jb2xvcmA7XG4gIG1hdGVyaWFsTWl4aW5zW2BtYXQtJHtuYW1lfS10eXBvZ3JhcGh5YF0gPSBgJHtuYW1lfS10eXBvZ3JhcGh5YDtcbn0pO1xuXG4vKiogTWFwcGluZyBvZiBNYXRlcmlhbCBmdW5jdGlvbnMgdGhhdCBzaG91bGQgYmUgcmVuYW1lZC4gKi9cbmV4cG9ydCBjb25zdCBtYXRlcmlhbEZ1bmN0aW9uczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgJ21hdC1jb2xvcic6ICdnZXQtY29sb3ItZnJvbS1wYWxldHRlJyxcbiAgJ21hdC1jb250cmFzdCc6ICdnZXQtY29udHJhc3QtY29sb3ItZnJvbS1wYWxldHRlJyxcbiAgJ21hdC1wYWxldHRlJzogJ2RlZmluZS1wYWxldHRlJyxcbiAgJ21hdC1kYXJrLXRoZW1lJzogJ2RlZmluZS1kYXJrLXRoZW1lJyxcbiAgJ21hdC1saWdodC10aGVtZSc6ICdkZWZpbmUtbGlnaHQtdGhlbWUnLFxuICAnbWF0LXR5cG9ncmFwaHktbGV2ZWwnOiAnZGVmaW5lLXR5cG9ncmFwaHktbGV2ZWwnLFxuICAnbWF0LXR5cG9ncmFwaHktY29uZmlnJzogJ2RlZmluZS10eXBvZ3JhcGh5LWNvbmZpZycsXG4gICdtYXQtZm9udC1zaXplJzogJ2ZvbnQtc2l6ZScsXG4gICdtYXQtbGluZS1oZWlnaHQnOiAnbGluZS1oZWlnaHQnLFxuICAnbWF0LWZvbnQtd2VpZ2h0JzogJ2ZvbnQtd2VpZ2h0JyxcbiAgJ21hdC1sZXR0ZXItc3BhY2luZyc6ICdsZXR0ZXItc3BhY2luZycsXG4gICdtYXQtZm9udC1mYW1pbHknOiAnZm9udC1mYW1pbHknLFxufTtcblxuLyoqIE1hcHBpbmcgb2YgTWF0ZXJpYWwgdmFyaWFibGVzIHRoYXQgc2hvdWxkIGJlIHJlbmFtZWQuICovXG5leHBvcnQgY29uc3QgbWF0ZXJpYWxWYXJpYWJsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdtYXQtbGlnaHQtdGhlbWUtYmFja2dyb3VuZCc6ICdsaWdodC10aGVtZS1iYWNrZ3JvdW5kLXBhbGV0dGUnLFxuICAnbWF0LWRhcmstdGhlbWUtYmFja2dyb3VuZCc6ICdkYXJrLXRoZW1lLWJhY2tncm91bmQtcGFsZXR0ZScsXG4gICdtYXQtbGlnaHQtdGhlbWUtZm9yZWdyb3VuZCc6ICdsaWdodC10aGVtZS1mb3JlZ3JvdW5kLXBhbGV0dGUnLFxuICAnbWF0LWRhcmstdGhlbWUtZm9yZWdyb3VuZCc6ICdkYXJrLXRoZW1lLWZvcmVncm91bmQtcGFsZXR0ZScsXG59O1xuXG4vLyBUaGUgcGFsZXR0ZXMgYWxsIGZvbGxvdyB0aGUgc2FtZSBwYXR0ZXJuLlxuW1xuICAncmVkJywgJ3BpbmsnLCAnaW5kaWdvJywgJ3B1cnBsZScsICdkZWVwLXB1cnBsZScsICdibHVlJywgJ2xpZ2h0LWJsdWUnLCAnY3lhbicsICd0ZWFsJywgJ2dyZWVuJyxcbiAgJ2xpZ2h0LWdyZWVuJywgJ2xpbWUnLCAneWVsbG93JywgJ2FtYmVyJywgJ29yYW5nZScsICdkZWVwLW9yYW5nZScsICdicm93bicsICdncmV5JywgJ2dyYXknLFxuICAnYmx1ZS1ncmV5JywgJ2JsdWUtZ3JheSdcbl0uZm9yRWFjaChuYW1lID0+IG1hdGVyaWFsVmFyaWFibGVzW2BtYXQtJHtuYW1lfWBdID0gYCR7bmFtZX0tcGFsZXR0ZWApO1xuXG4vKiogTWFwcGluZyBvZiBDREsgdmFyaWFibGVzIHRoYXQgc2hvdWxkIGJlIHJlbmFtZWQuICovXG5leHBvcnQgY29uc3QgY2RrVmFyaWFibGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnY2RrLXotaW5kZXgtb3ZlcmxheS1jb250YWluZXInOiAnb3ZlcmxheS1jb250YWluZXItei1pbmRleCcsXG4gICdjZGstei1pbmRleC1vdmVybGF5JzogJ292ZXJsYXktei1pbmRleCcsXG4gICdjZGstei1pbmRleC1vdmVybGF5LWJhY2tkcm9wJzogJ292ZXJsYXktYmFja2Ryb3Atei1pbmRleCcsXG4gICdjZGstb3ZlcmxheS1kYXJrLWJhY2tkcm9wLWJhY2tncm91bmQnOiAnb3ZlcmxheS1iYWNrZHJvcC1jb2xvcicsXG59O1xuXG4vKiogTWFwcGluZyBvZiBDREsgbWl4aW5zIHRoYXQgc2hvdWxkIGJlIHJlbmFtZWQuICovXG5leHBvcnQgY29uc3QgY2RrTWl4aW5zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnY2RrLW92ZXJsYXknOiAnb3ZlcmxheScsXG4gICdjZGstYTExeSc6ICdhMTF5LXZpc3VhbGx5LWhpZGRlbicsXG4gICdjZGstaGlnaC1jb250cmFzdCc6ICdoaWdoLWNvbnRyYXN0JyxcbiAgJ2Nkay10ZXh0LWZpZWxkLWF1dG9maWxsLWNvbG9yJzogJ3RleHQtZmllbGQtYXV0b2ZpbGwtY29sb3InLFxuICAvLyBUaGlzIG9uZSB3YXMgc3BsaXQgdXAgaW50byB0d28gbWl4aW5zIHdoaWNoIGlzIHRyaWNraWVyIHRvXG4gIC8vIG1pZ3JhdGUgc28gZm9yIG5vdyB3ZSBmb3J3YXJkIHRvIHRoZSBkZXByZWNhdGVkIHZhcmlhbnQuXG4gICdjZGstdGV4dC1maWVsZCc6ICd0ZXh0LWZpZWxkJyxcbn07XG5cbi8qKlxuICogTWF0ZXJpYWwgdmFyaWFibGVzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgcHVibGljIEFQSVxuICogYW5kIHdoaWNoIHNob3VsZCBiZSByZXBsYWNlZCB3aXRoIHRoZWlyIHZhbHVlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IHJlbW92ZWRNYXRlcmlhbFZhcmlhYmxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gTm90ZTogdGhlcmUncyBhbHNvIGEgdXNhZ2Ugb2YgYSB2YXJpYWJsZSBjYWxsZWQgYCRwaWAsIGJ1dCB0aGUgbmFtZSBpcyBzaG9ydCBlbm91Z2ggdGhhdFxuICAvLyBpdCBtYXRjaGVzIHRoaW5ncyBsaWtlIGAkbWF0LXBpbmtgLiBEb24ndCBtaWdyYXRlIGl0IHNpbmNlIGl0J3MgdW5saWtlbHkgdG8gYmUgdXNlZC5cbiAgJ21hdC14c21hbGwnOiBgJ21heC13aWR0aDogNTk5cHgnYCxcbiAgJ21hdC1zbWFsbCc6IGAnbWF4LXdpZHRoOiA5NTlweCdgLFxuICAnbWF0LXRvZ2dsZS1wYWRkaW5nJzogJzhweCcsXG4gICdtYXQtdG9nZ2xlLXNpemUnOiAnMjBweCcsXG4gICdtYXQtbGluZWFyLW91dC1zbG93LWluLXRpbWluZy1mdW5jdGlvbic6ICdjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAwLjEpJyxcbiAgJ21hdC1mYXN0LW91dC1zbG93LWluLXRpbWluZy1mdW5jdGlvbic6ICdjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpJyxcbiAgJ21hdC1mYXN0LW91dC1saW5lYXItaW4tdGltaW5nLWZ1bmN0aW9uJzogJ2N1YmljLWJlemllcigwLjQsIDAsIDEsIDEpJyxcbiAgJ21hdC1lbGV2YXRpb24tdHJhbnNpdGlvbi1kdXJhdGlvbic6ICcyODBtcycsXG4gICdtYXQtZWxldmF0aW9uLXRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uJzogJ2N1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSknLFxuICAnbWF0LWVsZXZhdGlvbi1jb2xvcic6ICcjMDAwJyxcbiAgJ21hdC1lbGV2YXRpb24tb3BhY2l0eSc6ICcxJyxcbiAgJ21hdC1lbGV2YXRpb24tcHJlZml4JzogYCdtYXQtZWxldmF0aW9uLXonYCxcbiAgJ21hdC1yaXBwbGUtY29sb3Itb3BhY2l0eSc6ICcwLjEnLFxuICAnbWF0LWJhZGdlLWZvbnQtc2l6ZSc6ICcxMnB4JyxcbiAgJ21hdC1iYWRnZS1mb250LXdlaWdodCc6ICc2MDAnLFxuICAnbWF0LWJhZGdlLWRlZmF1bHQtc2l6ZSc6ICcyMnB4JyxcbiAgJ21hdC1iYWRnZS1zbWFsbC1zaXplJzogJzE2cHgnLFxuICAnbWF0LWJhZGdlLWxhcmdlLXNpemUnOiAnMjhweCcsXG4gICdtYXQtYnV0dG9uLXRvZ2dsZS1zdGFuZGFyZC1oZWlnaHQnOiAnNDhweCcsXG4gICdtYXQtYnV0dG9uLXRvZ2dsZS1zdGFuZGFyZC1taW5pbXVtLWhlaWdodCc6ICcyNHB4JyxcbiAgJ21hdC1idXR0b24tdG9nZ2xlLXN0YW5kYXJkLW1heGltdW0taGVpZ2h0JzogJzQ4cHgnLFxuICAnbWF0LWNoaXAtcmVtb3ZlLWZvbnQtc2l6ZSc6ICcxOHB4JyxcbiAgJ21hdC1kYXRlcGlja2VyLXNlbGVjdGVkLXRvZGF5LWJveC1zaGFkb3ctd2lkdGgnOiAnMXB4JyxcbiAgJ21hdC1kYXRlcGlja2VyLXNlbGVjdGVkLWZhZGUtYW1vdW50JzogJzAuNicsXG4gICdtYXQtZGF0ZXBpY2tlci1yYW5nZS1mYWRlLWFtb3VudCc6ICcwLjInLFxuICAnbWF0LWRhdGVwaWNrZXItdG9kYXktZmFkZS1hbW91bnQnOiAnMC4yJyxcbiAgJ21hdC1jYWxlbmRhci1ib2R5LWZvbnQtc2l6ZSc6ICcxM3B4JyxcbiAgJ21hdC1jYWxlbmRhci13ZWVrZGF5LXRhYmxlLWZvbnQtc2l6ZSc6ICcxMXB4JyxcbiAgJ21hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyLWNvbGxhcHNlZC1oZWlnaHQnOiAnNDhweCcsXG4gICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1jb2xsYXBzZWQtbWluaW11bS1oZWlnaHQnOiAnMzZweCcsXG4gICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1jb2xsYXBzZWQtbWF4aW11bS1oZWlnaHQnOiAnNDhweCcsXG4gICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1leHBhbmRlZC1oZWlnaHQnOiAnNjRweCcsXG4gICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1leHBhbmRlZC1taW5pbXVtLWhlaWdodCc6ICc0OHB4JyxcbiAgJ21hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyLWV4cGFuZGVkLW1heGltdW0taGVpZ2h0JzogJzY0cHgnLFxuICAnbWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXItdHJhbnNpdGlvbic6ICcyMjVtcyBjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpJyxcbiAgJ21hdC1wYWdpbmF0b3ItaGVpZ2h0JzogJzU2cHgnLFxuICAnbWF0LXBhZ2luYXRvci1taW5pbXVtLWhlaWdodCc6ICc0MHB4JyxcbiAgJ21hdC1wYWdpbmF0b3ItbWF4aW11bS1oZWlnaHQnOiAnNTZweCcsXG4gICdtYXQtc3RlcHBlci1oZWFkZXItaGVpZ2h0JzogJzcycHgnLFxuICAnbWF0LXN0ZXBwZXItaGVhZGVyLW1pbmltdW0taGVpZ2h0JzogJzQycHgnLFxuICAnbWF0LXN0ZXBwZXItaGVhZGVyLW1heGltdW0taGVpZ2h0JzogJzcycHgnLFxuICAnbWF0LXN0ZXBwZXItbGFiZWwtaGVhZGVyLWhlaWdodCc6ICcyNHB4JyxcbiAgJ21hdC1zdGVwcGVyLWxhYmVsLXBvc2l0aW9uLWJvdHRvbS10b3AtZ2FwJzogJzE2cHgnLFxuICAnbWF0LXN0ZXBwZXItbGFiZWwtbWluLXdpZHRoJzogJzUwcHgnLFxuICAnbWF0LXZlcnRpY2FsLXN0ZXBwZXItY29udGVudC1tYXJnaW4nOiAnMzZweCcsXG4gICdtYXQtc3RlcHBlci1zaWRlLWdhcCc6ICcyNHB4JyxcbiAgJ21hdC1zdGVwcGVyLWxpbmUtd2lkdGgnOiAnMXB4JyxcbiAgJ21hdC1zdGVwcGVyLWxpbmUtZ2FwJzogJzhweCcsXG4gICdtYXQtc3RlcC1zdWItbGFiZWwtZm9udC1zaXplJzogJzEycHgnLFxuICAnbWF0LXN0ZXAtaGVhZGVyLWljb24tc2l6ZSc6ICcxNnB4JyxcbiAgJ21hdC10b29sYmFyLW1pbmltdW0taGVpZ2h0JzogJzQ0cHgnLFxuICAnbWF0LXRvb2xiYXItaGVpZ2h0LWRlc2t0b3AnOiAnNjRweCcsXG4gICdtYXQtdG9vbGJhci1tYXhpbXVtLWhlaWdodC1kZXNrdG9wJzogJzY0cHgnLFxuICAnbWF0LXRvb2xiYXItbWluaW11bS1oZWlnaHQtZGVza3RvcCc6ICc0NHB4JyxcbiAgJ21hdC10b29sYmFyLWhlaWdodC1tb2JpbGUnOiAnNTZweCcsXG4gICdtYXQtdG9vbGJhci1tYXhpbXVtLWhlaWdodC1tb2JpbGUnOiAnNTZweCcsXG4gICdtYXQtdG9vbGJhci1taW5pbXVtLWhlaWdodC1tb2JpbGUnOiAnNDRweCcsXG4gICdtYXQtdG9vbHRpcC10YXJnZXQtaGVpZ2h0JzogJzIycHgnLFxuICAnbWF0LXRvb2x0aXAtZm9udC1zaXplJzogJzEwcHgnLFxuICAnbWF0LXRvb2x0aXAtdmVydGljYWwtcGFkZGluZyc6ICc2cHgnLFxuICAnbWF0LXRvb2x0aXAtaGFuZHNldC10YXJnZXQtaGVpZ2h0JzogJzMwcHgnLFxuICAnbWF0LXRvb2x0aXAtaGFuZHNldC1mb250LXNpemUnOiAnMTRweCcsXG4gICdtYXQtdG9vbHRpcC1oYW5kc2V0LXZlcnRpY2FsLXBhZGRpbmcnOiAnOHB4JyxcbiAgJ21hdC10cmVlLW5vZGUtaGVpZ2h0JzogJzQ4cHgnLFxuICAnbWF0LXRyZWUtbm9kZS1taW5pbXVtLWhlaWdodCc6ICcyNHB4JyxcbiAgJ21hdC10cmVlLW5vZGUtbWF4aW11bS1oZWlnaHQnOiAnNDhweCcsXG4gICd6LWluZGV4LWZhYic6ICcyMCcsXG4gICd6LWluZGV4LWRyYXdlcic6ICcxMDAnLFxuICAnZWFzZS1pbi1vdXQtY3VydmUtZnVuY3Rpb24nOiAnY3ViaWMtYmV6aWVyKDAuMzUsIDAsIDAuMjUsIDEpJyxcbiAgJ3N3aWZ0LWVhc2Utb3V0LWR1cmF0aW9uJzogJzQwMG1zJyxcbiAgJ3N3aWZ0LWVhc2Utb3V0LXRpbWluZy1mdW5jdGlvbic6ICdjdWJpYy1iZXppZXIoMC4yNSwgMC44LCAwLjI1LCAxKScsXG4gICdzd2lmdC1lYXNlLW91dCc6ICdhbGwgNDAwbXMgY3ViaWMtYmV6aWVyKDAuMjUsIDAuOCwgMC4yNSwgMSknLFxuICAnc3dpZnQtZWFzZS1pbi1kdXJhdGlvbic6ICczMDBtcycsXG4gICdzd2lmdC1lYXNlLWluLXRpbWluZy1mdW5jdGlvbic6ICdjdWJpYy1iZXppZXIoMC41NSwgMCwgMC41NSwgMC4yKScsXG4gICdzd2lmdC1lYXNlLWluJzogJ2FsbCAzMDBtcyBjdWJpYy1iZXppZXIoMC41NSwgMCwgMC41NSwgMC4yKScsXG4gICdzd2lmdC1lYXNlLWluLW91dC1kdXJhdGlvbic6ICc1MDBtcycsXG4gICdzd2lmdC1lYXNlLWluLW91dC10aW1pbmctZnVuY3Rpb24nOiAnY3ViaWMtYmV6aWVyKDAuMzUsIDAsIDAuMjUsIDEpJyxcbiAgJ3N3aWZ0LWVhc2UtaW4tb3V0JzogJ2FsbCA1MDBtcyBjdWJpYy1iZXppZXIoMC4zNSwgMCwgMC4yNSwgMSknLFxuICAnc3dpZnQtbGluZWFyLWR1cmF0aW9uJzogJzgwbXMnLFxuICAnc3dpZnQtbGluZWFyLXRpbWluZy1mdW5jdGlvbic6ICdsaW5lYXInLFxuICAnc3dpZnQtbGluZWFyJzogJ2FsbCA4MG1zIGxpbmVhcidcbn07XG4iXX0=