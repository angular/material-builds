"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomTheme = createCustomTheme;
/** Create custom theme for the given application configuration. */
function createCustomTheme(name = 'app') {
    return `
// Custom Theming for Angular Material
// For more information: https://material.angular.io/guide/theming
@use '@angular/material' as mat;
// Plus imports for other components in your app.

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWN1c3RvbS10aGVtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL2NyZWF0ZS1jdXN0b20tdGhlbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCw4Q0FpQ0M7QUFsQ0QsbUVBQW1FO0FBQ25FLFNBQWdCLGlCQUFpQixDQUFDLE9BQWUsS0FBSztJQUNwRCxPQUFPOzs7Ozs7O0dBT04sSUFBSTs7Ozs7Ozs7Ozs7Ozs7O3VDQWVnQyxJQUFJOzs7Ozt3Q0FLSCxJQUFJOzs7MERBR2MsSUFBSTtDQUM3RCxDQUFDO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmRldi9saWNlbnNlXG4gKi9cblxuLyoqIENyZWF0ZSBjdXN0b20gdGhlbWUgZm9yIHRoZSBnaXZlbiBhcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUN1c3RvbVRoZW1lKG5hbWU6IHN0cmluZyA9ICdhcHAnKSB7XG4gIHJldHVybiBgXG4vLyBDdXN0b20gVGhlbWluZyBmb3IgQW5ndWxhciBNYXRlcmlhbFxuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb246IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS90aGVtaW5nXG5AdXNlICdAYW5ndWxhci9tYXRlcmlhbCcgYXMgbWF0O1xuLy8gUGx1cyBpbXBvcnRzIGZvciBvdGhlciBjb21wb25lbnRzIGluIHlvdXIgYXBwLlxuXG4vLyBEZWZpbmUgdGhlIHRoZW1lIG9iamVjdC5cbiQke25hbWV9LXRoZW1lOiBtYXQuZGVmaW5lLXRoZW1lKChcbiAgY29sb3I6IChcbiAgICB0aGVtZS10eXBlOiBsaWdodCxcbiAgICBwcmltYXJ5OiBtYXQuJGF6dXJlLXBhbGV0dGUsXG4gICAgdGVydGlhcnk6IG1hdC4kYmx1ZS1wYWxldHRlLFxuICApLFxuICBkZW5zaXR5OiAoXG4gICAgc2NhbGU6IDAsXG4gIClcbikpO1xuXG4vLyBJbmNsdWRlIHRoZW1lIHN0eWxlcyBmb3IgY29yZSBhbmQgZWFjaCBjb21wb25lbnQgdXNlZCBpbiB5b3VyIGFwcC5cbi8vIEFsdGVybmF0aXZlbHksIHlvdSBjYW4gaW1wb3J0IGFuZCBAaW5jbHVkZSB0aGUgdGhlbWUgbWl4aW5zIGZvciBlYWNoIGNvbXBvbmVudFxuLy8gdGhhdCB5b3UgYXJlIHVzaW5nLlxuOnJvb3Qge1xuICBAaW5jbHVkZSBtYXQuYWxsLWNvbXBvbmVudC10aGVtZXMoJCR7bmFtZX0tdGhlbWUpO1xufVxuXG4vLyBDb21tZW50IG91dCB0aGUgbGluZSBiZWxvdyBpZiB5b3Ugd2FudCB0byB1c2UgdGhlIHByZS1kZWZpbmVkIHR5cG9ncmFwaHkgdXRpbGl0eSBjbGFzc2VzLlxuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb246IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS90eXBvZ3JhcGh5I3VzaW5nLXR5cG9ncmFwaHktc3R5bGVzLWluLXlvdXItYXBwbGljYXRpb24uXG4vLyBAaW5jbHVkZSBtYXQudHlwb2dyYXBoeS1oaWVyYXJjaHkoJCR7bmFtZX0tdGhlbWUpO1xuXG4vLyBDb21tZW50IG91dCB0aGUgbGluZSBiZWxvdyBpZiB5b3Ugd2FudCB0byB1c2UgdGhlIGRlcHJlY2F0ZWQgXFxgY29sb3JcXGAgaW5wdXRzLlxuLy8gQGluY2x1ZGUgbWF0LmNvbG9yLXZhcmlhbnRzLWJhY2t3YXJkcy1jb21wYXRpYmlsaXR5KCQke25hbWV9LXRoZW1lKTtcbmA7XG59XG4iXX0=