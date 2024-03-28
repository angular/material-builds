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
@use '@angular/material-experimental' as matx;
// Plus imports for other components in your app.

// Include the common styles for Angular Material. We include this here so that you only
// have to load a single css file for Angular Material in your app.
// Be sure that you only ever include this mixin once!
@include mat.core();

// Define the theme object.
$${name}-theme: matx.define-theme((
  color: (
    theme-type: light,
    primary: matx.$m3-azure-palette,
    tertiary: matx.$m3-blue-palette,
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
// @include mat.typography-hierarchy($theme);

// Comment out the line below if you want to use the deprecated \`color\` inputs.
// @include matx.color-variants-back-compat($theme);
`;
}
exports.createCustomTheme = createCustomTheme;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWN1c3RvbS10aGVtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL2NyZWF0ZS1jdXN0b20tdGhlbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsbUVBQW1FO0FBQ25FLFNBQWdCLGlCQUFpQixDQUFDLE9BQWUsS0FBSztJQUNwRCxPQUFPOzs7Ozs7Ozs7Ozs7O0dBYU4sSUFBSTs7Ozs7Ozs7Ozs7Ozs7O3VDQWVnQyxJQUFJOzs7Ozs7Ozs7Q0FTMUMsQ0FBQztBQUNGLENBQUM7QUF2Q0QsOENBdUNDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKiBDcmVhdGUgY3VzdG9tIHRoZW1lIGZvciB0aGUgZ2l2ZW4gYXBwbGljYXRpb24gY29uZmlndXJhdGlvbi4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDdXN0b21UaGVtZShuYW1lOiBzdHJpbmcgPSAnYXBwJykge1xuICByZXR1cm4gYFxuLy8gQ3VzdG9tIFRoZW1pbmcgZm9yIEFuZ3VsYXIgTWF0ZXJpYWxcbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uOiBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvdGhlbWluZ1xuQHVzZSAnQGFuZ3VsYXIvbWF0ZXJpYWwnIGFzIG1hdDtcbkB1c2UgJ0Bhbmd1bGFyL21hdGVyaWFsLWV4cGVyaW1lbnRhbCcgYXMgbWF0eDtcbi8vIFBsdXMgaW1wb3J0cyBmb3Igb3RoZXIgY29tcG9uZW50cyBpbiB5b3VyIGFwcC5cblxuLy8gSW5jbHVkZSB0aGUgY29tbW9uIHN0eWxlcyBmb3IgQW5ndWxhciBNYXRlcmlhbC4gV2UgaW5jbHVkZSB0aGlzIGhlcmUgc28gdGhhdCB5b3Ugb25seVxuLy8gaGF2ZSB0byBsb2FkIGEgc2luZ2xlIGNzcyBmaWxlIGZvciBBbmd1bGFyIE1hdGVyaWFsIGluIHlvdXIgYXBwLlxuLy8gQmUgc3VyZSB0aGF0IHlvdSBvbmx5IGV2ZXIgaW5jbHVkZSB0aGlzIG1peGluIG9uY2UhXG5AaW5jbHVkZSBtYXQuY29yZSgpO1xuXG4vLyBEZWZpbmUgdGhlIHRoZW1lIG9iamVjdC5cbiQke25hbWV9LXRoZW1lOiBtYXR4LmRlZmluZS10aGVtZSgoXG4gIGNvbG9yOiAoXG4gICAgdGhlbWUtdHlwZTogbGlnaHQsXG4gICAgcHJpbWFyeTogbWF0eC4kbTMtYXp1cmUtcGFsZXR0ZSxcbiAgICB0ZXJ0aWFyeTogbWF0eC4kbTMtYmx1ZS1wYWxldHRlLFxuICApLFxuICBkZW5zaXR5OiAoXG4gICAgc2NhbGU6IDAsXG4gIClcbikpO1xuXG4vLyBJbmNsdWRlIHRoZW1lIHN0eWxlcyBmb3IgY29yZSBhbmQgZWFjaCBjb21wb25lbnQgdXNlZCBpbiB5b3VyIGFwcC5cbi8vIEFsdGVybmF0aXZlbHksIHlvdSBjYW4gaW1wb3J0IGFuZCBAaW5jbHVkZSB0aGUgdGhlbWUgbWl4aW5zIGZvciBlYWNoIGNvbXBvbmVudFxuLy8gdGhhdCB5b3UgYXJlIHVzaW5nLlxuOnJvb3Qge1xuICBAaW5jbHVkZSBtYXQuYWxsLWNvbXBvbmVudC10aGVtZXMoJCR7bmFtZX0tdGhlbWUpO1xufVxuXG4vLyBDb21tZW50IG91dCB0aGUgbGluZSBiZWxvdyBpZiB5b3Ugd2FudCB0byB1c2UgdGhlIHByZS1kZWZpbmVkIHR5cG9ncmFwaHkgdXRpbGl0eSBjbGFzc2VzLlxuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb246IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS90eXBvZ3JhcGh5I3VzaW5nLXR5cG9ncmFwaHktc3R5bGVzLWluLXlvdXItYXBwbGljYXRpb24uXG4vLyBAaW5jbHVkZSBtYXQudHlwb2dyYXBoeS1oaWVyYXJjaHkoJHRoZW1lKTtcblxuLy8gQ29tbWVudCBvdXQgdGhlIGxpbmUgYmVsb3cgaWYgeW91IHdhbnQgdG8gdXNlIHRoZSBkZXByZWNhdGVkIFxcYGNvbG9yXFxgIGlucHV0cy5cbi8vIEBpbmNsdWRlIG1hdHguY29sb3ItdmFyaWFudHMtYmFjay1jb21wYXQoJHRoZW1lKTtcbmA7XG59XG4iXX0=