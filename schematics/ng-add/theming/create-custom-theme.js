/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/material/schematics/ng-add/theming/create-custom-theme", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** Create custom theme for the given application configuration. */
    function createCustomTheme(name = 'app') {
        return `
// Custom Theming for Angular Material
// For more information: https://material.angular.io/guide/theming
@import '~@angular/material/theming';
// Plus imports for other components in your app.

// Include the common styles for Angular Material. We include this here so that you only
// have to load a single css file for Angular Material in your app.
// Be sure that you only ever include this mixin once!
@include mat-core();

// Define the palettes for your theme using the Material Design palettes available in palette.scss
// (imported above). For each palette, you can optionally specify a default, lighter, and darker
// hue. Available color palettes: https://material.io/design/color/
$${name}-primary: mat-palette($mat-indigo);
$${name}-accent: mat-palette($mat-pink, A200, A100, A400);

// The warn palette is optional (defaults to red).
$${name}-warn: mat-palette($mat-red);

// Create the theme object. A theme consists of configurations for individual
// theming systems such as "color" or "typography".
$${name}-theme: mat-light-theme((
  color: (
    primary: $${name}-primary,
    accent: $${name}-accent,
    warn: $${name}-warn,
  )
));

// Include theme styles for core and each component used in your app.
// Alternatively, you can import and @include the theme mixins for each component
// that you are using.
@include angular-material-theme($${name}-theme);

`;
    }
    exports.createCustomTheme = createCustomTheme;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWN1c3RvbS10aGVtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL2NyZWF0ZS1jdXN0b20tdGhlbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCxtRUFBbUU7SUFDbkUsU0FBZ0IsaUJBQWlCLENBQUMsT0FBZSxLQUFLO1FBQ3RELE9BQU87Ozs7Ozs7Ozs7Ozs7O0dBY0osSUFBSTtHQUNKLElBQUk7OztHQUdKLElBQUk7Ozs7R0FJSixJQUFJOztnQkFFUyxJQUFJO2VBQ0wsSUFBSTthQUNOLElBQUk7Ozs7Ozs7bUNBT2tCLElBQUk7O0NBRXRDLENBQUM7SUFDRixDQUFDO0lBckNELDhDQXFDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKiogQ3JlYXRlIGN1c3RvbSB0aGVtZSBmb3IgdGhlIGdpdmVuIGFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24uICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ3VzdG9tVGhlbWUobmFtZTogc3RyaW5nID0gJ2FwcCcpIHtcbnJldHVybiBgXG4vLyBDdXN0b20gVGhlbWluZyBmb3IgQW5ndWxhciBNYXRlcmlhbFxuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb246IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS90aGVtaW5nXG5AaW1wb3J0ICd+QGFuZ3VsYXIvbWF0ZXJpYWwvdGhlbWluZyc7XG4vLyBQbHVzIGltcG9ydHMgZm9yIG90aGVyIGNvbXBvbmVudHMgaW4geW91ciBhcHAuXG5cbi8vIEluY2x1ZGUgdGhlIGNvbW1vbiBzdHlsZXMgZm9yIEFuZ3VsYXIgTWF0ZXJpYWwuIFdlIGluY2x1ZGUgdGhpcyBoZXJlIHNvIHRoYXQgeW91IG9ubHlcbi8vIGhhdmUgdG8gbG9hZCBhIHNpbmdsZSBjc3MgZmlsZSBmb3IgQW5ndWxhciBNYXRlcmlhbCBpbiB5b3VyIGFwcC5cbi8vIEJlIHN1cmUgdGhhdCB5b3Ugb25seSBldmVyIGluY2x1ZGUgdGhpcyBtaXhpbiBvbmNlIVxuQGluY2x1ZGUgbWF0LWNvcmUoKTtcblxuLy8gRGVmaW5lIHRoZSBwYWxldHRlcyBmb3IgeW91ciB0aGVtZSB1c2luZyB0aGUgTWF0ZXJpYWwgRGVzaWduIHBhbGV0dGVzIGF2YWlsYWJsZSBpbiBwYWxldHRlLnNjc3Ncbi8vIChpbXBvcnRlZCBhYm92ZSkuIEZvciBlYWNoIHBhbGV0dGUsIHlvdSBjYW4gb3B0aW9uYWxseSBzcGVjaWZ5IGEgZGVmYXVsdCwgbGlnaHRlciwgYW5kIGRhcmtlclxuLy8gaHVlLiBBdmFpbGFibGUgY29sb3IgcGFsZXR0ZXM6IGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbG9yL1xuJCR7bmFtZX0tcHJpbWFyeTogbWF0LXBhbGV0dGUoJG1hdC1pbmRpZ28pO1xuJCR7bmFtZX0tYWNjZW50OiBtYXQtcGFsZXR0ZSgkbWF0LXBpbmssIEEyMDAsIEExMDAsIEE0MDApO1xuXG4vLyBUaGUgd2FybiBwYWxldHRlIGlzIG9wdGlvbmFsIChkZWZhdWx0cyB0byByZWQpLlxuJCR7bmFtZX0td2FybjogbWF0LXBhbGV0dGUoJG1hdC1yZWQpO1xuXG4vLyBDcmVhdGUgdGhlIHRoZW1lIG9iamVjdC4gQSB0aGVtZSBjb25zaXN0cyBvZiBjb25maWd1cmF0aW9ucyBmb3IgaW5kaXZpZHVhbFxuLy8gdGhlbWluZyBzeXN0ZW1zIHN1Y2ggYXMgXCJjb2xvclwiIG9yIFwidHlwb2dyYXBoeVwiLlxuJCR7bmFtZX0tdGhlbWU6IG1hdC1saWdodC10aGVtZSgoXG4gIGNvbG9yOiAoXG4gICAgcHJpbWFyeTogJCR7bmFtZX0tcHJpbWFyeSxcbiAgICBhY2NlbnQ6ICQke25hbWV9LWFjY2VudCxcbiAgICB3YXJuOiAkJHtuYW1lfS13YXJuLFxuICApXG4pKTtcblxuLy8gSW5jbHVkZSB0aGVtZSBzdHlsZXMgZm9yIGNvcmUgYW5kIGVhY2ggY29tcG9uZW50IHVzZWQgaW4geW91ciBhcHAuXG4vLyBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIGltcG9ydCBhbmQgQGluY2x1ZGUgdGhlIHRoZW1lIG1peGlucyBmb3IgZWFjaCBjb21wb25lbnRcbi8vIHRoYXQgeW91IGFyZSB1c2luZy5cbkBpbmNsdWRlIGFuZ3VsYXItbWF0ZXJpYWwtdGhlbWUoJCR7bmFtZX0tdGhlbWUpO1xuXG5gO1xufVxuIl19