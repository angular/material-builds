"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomTheme = void 0;
/** Create custom theme for the given application configuration. */
function createCustomTheme(name = 'app') {
    return `
// Custom Theming for Angular Material
// For more information: https://material.angular.io/guide/theming
@use '@angular/material' as mat;
// Plus imports for other components in your app.

// Include the common styles for Angular Material. We include this here so that you only
// have to load a single css file for Angular Material in your app.
// Be sure that you only ever include this mixin once!
@include mat.core();

// Define the theme object.
$${name}-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$azure-palette,
    tertiary: mat.$blue-palette,
  ),
  density: (
    scale: 0,
  )
));

// Include theme styles for core and each component used in your app.
// Alternatively, you can import and @include the theme mixins for each component
// that you are using.
:root {
  @include mat.all-component-themes($${name}-theme);
}

// Comment out the line below if you want to use the pre-defined typography utility classes.
// For more information: https://material.angular.io/guide/typography#using-typography-styles-in-your-application.
// @include mat.typography-hierarchy($${name}-theme);

// Comment out the line below if you want to use the deprecated \`color\` inputs.
// @include mat.color-variants-backwards-compatibility($${name}-theme);
`;
}
exports.createCustomTheme = createCustomTheme;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWN1c3RvbS10aGVtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL2NyZWF0ZS1jdXN0b20tdGhlbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsbUVBQW1FO0FBQ25FLFNBQWdCLGlCQUFpQixDQUFDLE9BQWUsS0FBSztJQUNwRCxPQUFPOzs7Ozs7Ozs7Ozs7R0FZTixJQUFJOzs7Ozs7Ozs7Ozs7Ozs7dUNBZWdDLElBQUk7Ozs7O3dDQUtILElBQUk7OzswREFHYyxJQUFJO0NBQzdELENBQUM7QUFDRixDQUFDO0FBdENELDhDQXNDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKiogQ3JlYXRlIGN1c3RvbSB0aGVtZSBmb3IgdGhlIGdpdmVuIGFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24uICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ3VzdG9tVGhlbWUobmFtZTogc3RyaW5nID0gJ2FwcCcpIHtcbiAgcmV0dXJuIGBcbi8vIEN1c3RvbSBUaGVtaW5nIGZvciBBbmd1bGFyIE1hdGVyaWFsXG4vLyBGb3IgbW9yZSBpbmZvcm1hdGlvbjogaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL3RoZW1pbmdcbkB1c2UgJ0Bhbmd1bGFyL21hdGVyaWFsJyBhcyBtYXQ7XG4vLyBQbHVzIGltcG9ydHMgZm9yIG90aGVyIGNvbXBvbmVudHMgaW4geW91ciBhcHAuXG5cbi8vIEluY2x1ZGUgdGhlIGNvbW1vbiBzdHlsZXMgZm9yIEFuZ3VsYXIgTWF0ZXJpYWwuIFdlIGluY2x1ZGUgdGhpcyBoZXJlIHNvIHRoYXQgeW91IG9ubHlcbi8vIGhhdmUgdG8gbG9hZCBhIHNpbmdsZSBjc3MgZmlsZSBmb3IgQW5ndWxhciBNYXRlcmlhbCBpbiB5b3VyIGFwcC5cbi8vIEJlIHN1cmUgdGhhdCB5b3Ugb25seSBldmVyIGluY2x1ZGUgdGhpcyBtaXhpbiBvbmNlIVxuQGluY2x1ZGUgbWF0LmNvcmUoKTtcblxuLy8gRGVmaW5lIHRoZSB0aGVtZSBvYmplY3QuXG4kJHtuYW1lfS10aGVtZTogbWF0LmRlZmluZS10aGVtZSgoXG4gIGNvbG9yOiAoXG4gICAgdGhlbWUtdHlwZTogbGlnaHQsXG4gICAgcHJpbWFyeTogbWF0LiRhenVyZS1wYWxldHRlLFxuICAgIHRlcnRpYXJ5OiBtYXQuJGJsdWUtcGFsZXR0ZSxcbiAgKSxcbiAgZGVuc2l0eTogKFxuICAgIHNjYWxlOiAwLFxuICApXG4pKTtcblxuLy8gSW5jbHVkZSB0aGVtZSBzdHlsZXMgZm9yIGNvcmUgYW5kIGVhY2ggY29tcG9uZW50IHVzZWQgaW4geW91ciBhcHAuXG4vLyBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIGltcG9ydCBhbmQgQGluY2x1ZGUgdGhlIHRoZW1lIG1peGlucyBmb3IgZWFjaCBjb21wb25lbnRcbi8vIHRoYXQgeW91IGFyZSB1c2luZy5cbjpyb290IHtcbiAgQGluY2x1ZGUgbWF0LmFsbC1jb21wb25lbnQtdGhlbWVzKCQke25hbWV9LXRoZW1lKTtcbn1cblxuLy8gQ29tbWVudCBvdXQgdGhlIGxpbmUgYmVsb3cgaWYgeW91IHdhbnQgdG8gdXNlIHRoZSBwcmUtZGVmaW5lZCB0eXBvZ3JhcGh5IHV0aWxpdHkgY2xhc3Nlcy5cbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uOiBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvdHlwb2dyYXBoeSN1c2luZy10eXBvZ3JhcGh5LXN0eWxlcy1pbi15b3VyLWFwcGxpY2F0aW9uLlxuLy8gQGluY2x1ZGUgbWF0LnR5cG9ncmFwaHktaGllcmFyY2h5KCQke25hbWV9LXRoZW1lKTtcblxuLy8gQ29tbWVudCBvdXQgdGhlIGxpbmUgYmVsb3cgaWYgeW91IHdhbnQgdG8gdXNlIHRoZSBkZXByZWNhdGVkIFxcYGNvbG9yXFxgIGlucHV0cy5cbi8vIEBpbmNsdWRlIG1hdC5jb2xvci12YXJpYW50cy1iYWNrd2FyZHMtY29tcGF0aWJpbGl0eSgkJHtuYW1lfS10aGVtZSk7XG5gO1xufVxuIl19