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
// @include mat.typography-hierarchy($theme);

// Comment out the line below if you want to use the deprecated \`color\` inputs.
// @include mat.color-variants-backwards-compatibility($theme);
`;
}
exports.createCustomTheme = createCustomTheme;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWN1c3RvbS10aGVtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL2NyZWF0ZS1jdXN0b20tdGhlbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsbUVBQW1FO0FBQ25FLFNBQWdCLGlCQUFpQixDQUFDLE9BQWUsS0FBSztJQUNwRCxPQUFPOzs7Ozs7Ozs7Ozs7R0FZTixJQUFJOzs7Ozs7Ozs7Ozs7Ozs7dUNBZWdDLElBQUk7Ozs7Ozs7OztDQVMxQyxDQUFDO0FBQ0YsQ0FBQztBQXRDRCw4Q0FzQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqIENyZWF0ZSBjdXN0b20gdGhlbWUgZm9yIHRoZSBnaXZlbiBhcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUN1c3RvbVRoZW1lKG5hbWU6IHN0cmluZyA9ICdhcHAnKSB7XG4gIHJldHVybiBgXG4vLyBDdXN0b20gVGhlbWluZyBmb3IgQW5ndWxhciBNYXRlcmlhbFxuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb246IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS90aGVtaW5nXG5AdXNlICdAYW5ndWxhci9tYXRlcmlhbCcgYXMgbWF0O1xuLy8gUGx1cyBpbXBvcnRzIGZvciBvdGhlciBjb21wb25lbnRzIGluIHlvdXIgYXBwLlxuXG4vLyBJbmNsdWRlIHRoZSBjb21tb24gc3R5bGVzIGZvciBBbmd1bGFyIE1hdGVyaWFsLiBXZSBpbmNsdWRlIHRoaXMgaGVyZSBzbyB0aGF0IHlvdSBvbmx5XG4vLyBoYXZlIHRvIGxvYWQgYSBzaW5nbGUgY3NzIGZpbGUgZm9yIEFuZ3VsYXIgTWF0ZXJpYWwgaW4geW91ciBhcHAuXG4vLyBCZSBzdXJlIHRoYXQgeW91IG9ubHkgZXZlciBpbmNsdWRlIHRoaXMgbWl4aW4gb25jZSFcbkBpbmNsdWRlIG1hdC5jb3JlKCk7XG5cbi8vIERlZmluZSB0aGUgdGhlbWUgb2JqZWN0LlxuJCR7bmFtZX0tdGhlbWU6IG1hdC5kZWZpbmUtdGhlbWUoKFxuICBjb2xvcjogKFxuICAgIHRoZW1lLXR5cGU6IGxpZ2h0LFxuICAgIHByaW1hcnk6IG1hdC4kYXp1cmUtcGFsZXR0ZSxcbiAgICB0ZXJ0aWFyeTogbWF0LiRibHVlLXBhbGV0dGUsXG4gICksXG4gIGRlbnNpdHk6IChcbiAgICBzY2FsZTogMCxcbiAgKVxuKSk7XG5cbi8vIEluY2x1ZGUgdGhlbWUgc3R5bGVzIGZvciBjb3JlIGFuZCBlYWNoIGNvbXBvbmVudCB1c2VkIGluIHlvdXIgYXBwLlxuLy8gQWx0ZXJuYXRpdmVseSwgeW91IGNhbiBpbXBvcnQgYW5kIEBpbmNsdWRlIHRoZSB0aGVtZSBtaXhpbnMgZm9yIGVhY2ggY29tcG9uZW50XG4vLyB0aGF0IHlvdSBhcmUgdXNpbmcuXG46cm9vdCB7XG4gIEBpbmNsdWRlIG1hdC5hbGwtY29tcG9uZW50LXRoZW1lcygkJHtuYW1lfS10aGVtZSk7XG59XG5cbi8vIENvbW1lbnQgb3V0IHRoZSBsaW5lIGJlbG93IGlmIHlvdSB3YW50IHRvIHVzZSB0aGUgcHJlLWRlZmluZWQgdHlwb2dyYXBoeSB1dGlsaXR5IGNsYXNzZXMuXG4vLyBGb3IgbW9yZSBpbmZvcm1hdGlvbjogaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL3R5cG9ncmFwaHkjdXNpbmctdHlwb2dyYXBoeS1zdHlsZXMtaW4teW91ci1hcHBsaWNhdGlvbi5cbi8vIEBpbmNsdWRlIG1hdC50eXBvZ3JhcGh5LWhpZXJhcmNoeSgkdGhlbWUpO1xuXG4vLyBDb21tZW50IG91dCB0aGUgbGluZSBiZWxvdyBpZiB5b3Ugd2FudCB0byB1c2UgdGhlIGRlcHJlY2F0ZWQgXFxgY29sb3JcXGAgaW5wdXRzLlxuLy8gQGluY2x1ZGUgbWF0LmNvbG9yLXZhcmlhbnRzLWJhY2t3YXJkcy1jb21wYXRpYmlsaXR5KCR0aGVtZSk7XG5gO1xufVxuIl19