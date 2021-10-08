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

// Define the palettes for your theme using the Material Design palettes available in palette.scss
// (imported above). For each palette, you can optionally specify a default, lighter, and darker
// hue. Available color palettes: https://material.io/design/color/
$${name}-primary: mat.define-palette(mat.$indigo-palette);
$${name}-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);

// The warn palette is optional (defaults to red).
$${name}-warn: mat.define-palette(mat.$red-palette);

// Create the theme object. A theme consists of configurations for individual
// theming systems such as "color" or "typography".
$${name}-theme: mat.define-light-theme((
  color: (
    primary: $${name}-primary,
    accent: $${name}-accent,
    warn: $${name}-warn,
  )
));

// Include theme styles for core and each component used in your app.
// Alternatively, you can import and @include the theme mixins for each component
// that you are using.
@include mat.all-component-themes($${name}-theme);

`;
}
exports.createCustomTheme = createCustomTheme;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWN1c3RvbS10aGVtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL2NyZWF0ZS1jdXN0b20tdGhlbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsbUVBQW1FO0FBQ25FLFNBQWdCLGlCQUFpQixDQUFDLE9BQWUsS0FBSztJQUN0RCxPQUFPOzs7Ozs7Ozs7Ozs7OztHQWNKLElBQUk7R0FDSixJQUFJOzs7R0FHSixJQUFJOzs7O0dBSUosSUFBSTs7Z0JBRVMsSUFBSTtlQUNMLElBQUk7YUFDTixJQUFJOzs7Ozs7O3FDQU9vQixJQUFJOztDQUV4QyxDQUFDO0FBQ0YsQ0FBQztBQXJDRCw4Q0FxQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqIENyZWF0ZSBjdXN0b20gdGhlbWUgZm9yIHRoZSBnaXZlbiBhcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUN1c3RvbVRoZW1lKG5hbWU6IHN0cmluZyA9ICdhcHAnKSB7XG5yZXR1cm4gYFxuLy8gQ3VzdG9tIFRoZW1pbmcgZm9yIEFuZ3VsYXIgTWF0ZXJpYWxcbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uOiBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvdGhlbWluZ1xuQHVzZSAnQGFuZ3VsYXIvbWF0ZXJpYWwnIGFzIG1hdDtcbi8vIFBsdXMgaW1wb3J0cyBmb3Igb3RoZXIgY29tcG9uZW50cyBpbiB5b3VyIGFwcC5cblxuLy8gSW5jbHVkZSB0aGUgY29tbW9uIHN0eWxlcyBmb3IgQW5ndWxhciBNYXRlcmlhbC4gV2UgaW5jbHVkZSB0aGlzIGhlcmUgc28gdGhhdCB5b3Ugb25seVxuLy8gaGF2ZSB0byBsb2FkIGEgc2luZ2xlIGNzcyBmaWxlIGZvciBBbmd1bGFyIE1hdGVyaWFsIGluIHlvdXIgYXBwLlxuLy8gQmUgc3VyZSB0aGF0IHlvdSBvbmx5IGV2ZXIgaW5jbHVkZSB0aGlzIG1peGluIG9uY2UhXG5AaW5jbHVkZSBtYXQuY29yZSgpO1xuXG4vLyBEZWZpbmUgdGhlIHBhbGV0dGVzIGZvciB5b3VyIHRoZW1lIHVzaW5nIHRoZSBNYXRlcmlhbCBEZXNpZ24gcGFsZXR0ZXMgYXZhaWxhYmxlIGluIHBhbGV0dGUuc2Nzc1xuLy8gKGltcG9ydGVkIGFib3ZlKS4gRm9yIGVhY2ggcGFsZXR0ZSwgeW91IGNhbiBvcHRpb25hbGx5IHNwZWNpZnkgYSBkZWZhdWx0LCBsaWdodGVyLCBhbmQgZGFya2VyXG4vLyBodWUuIEF2YWlsYWJsZSBjb2xvciBwYWxldHRlczogaHR0cHM6Ly9tYXRlcmlhbC5pby9kZXNpZ24vY29sb3IvXG4kJHtuYW1lfS1wcmltYXJ5OiBtYXQuZGVmaW5lLXBhbGV0dGUobWF0LiRpbmRpZ28tcGFsZXR0ZSk7XG4kJHtuYW1lfS1hY2NlbnQ6IG1hdC5kZWZpbmUtcGFsZXR0ZShtYXQuJHBpbmstcGFsZXR0ZSwgQTIwMCwgQTEwMCwgQTQwMCk7XG5cbi8vIFRoZSB3YXJuIHBhbGV0dGUgaXMgb3B0aW9uYWwgKGRlZmF1bHRzIHRvIHJlZCkuXG4kJHtuYW1lfS13YXJuOiBtYXQuZGVmaW5lLXBhbGV0dGUobWF0LiRyZWQtcGFsZXR0ZSk7XG5cbi8vIENyZWF0ZSB0aGUgdGhlbWUgb2JqZWN0LiBBIHRoZW1lIGNvbnNpc3RzIG9mIGNvbmZpZ3VyYXRpb25zIGZvciBpbmRpdmlkdWFsXG4vLyB0aGVtaW5nIHN5c3RlbXMgc3VjaCBhcyBcImNvbG9yXCIgb3IgXCJ0eXBvZ3JhcGh5XCIuXG4kJHtuYW1lfS10aGVtZTogbWF0LmRlZmluZS1saWdodC10aGVtZSgoXG4gIGNvbG9yOiAoXG4gICAgcHJpbWFyeTogJCR7bmFtZX0tcHJpbWFyeSxcbiAgICBhY2NlbnQ6ICQke25hbWV9LWFjY2VudCxcbiAgICB3YXJuOiAkJHtuYW1lfS13YXJuLFxuICApXG4pKTtcblxuLy8gSW5jbHVkZSB0aGVtZSBzdHlsZXMgZm9yIGNvcmUgYW5kIGVhY2ggY29tcG9uZW50IHVzZWQgaW4geW91ciBhcHAuXG4vLyBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIGltcG9ydCBhbmQgQGluY2x1ZGUgdGhlIHRoZW1lIG1peGlucyBmb3IgZWFjaCBjb21wb25lbnRcbi8vIHRoYXQgeW91IGFyZSB1c2luZy5cbkBpbmNsdWRlIG1hdC5hbGwtY29tcG9uZW50LXRoZW1lcygkJHtuYW1lfS10aGVtZSk7XG5cbmA7XG59XG4iXX0=