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

html {
  @include mat.theme((
    color: (
      theme-type: light,
      primary: mat.$azure-palette,
      tertiary: mat.$blue-palette,
    ),
    typography: Roboto,
    density: 0,
  ));
}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWN1c3RvbS10aGVtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL2NyZWF0ZS1jdXN0b20tdGhlbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCw4Q0FpQkM7QUFsQkQsbUVBQW1FO0FBQ25FLFNBQWdCLGlCQUFpQixDQUFDLE9BQWUsS0FBSztJQUNwRCxPQUFPOzs7Ozs7Ozs7Ozs7Ozs7RUFlUCxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmRldi9saWNlbnNlXG4gKi9cblxuLyoqIENyZWF0ZSBjdXN0b20gdGhlbWUgZm9yIHRoZSBnaXZlbiBhcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUN1c3RvbVRoZW1lKG5hbWU6IHN0cmluZyA9ICdhcHAnKSB7XG4gIHJldHVybiBgXG4vLyBDdXN0b20gVGhlbWluZyBmb3IgQW5ndWxhciBNYXRlcmlhbFxuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb246IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS90aGVtaW5nXG5AdXNlICdAYW5ndWxhci9tYXRlcmlhbCcgYXMgbWF0O1xuXG5odG1sIHtcbiAgQGluY2x1ZGUgbWF0LnRoZW1lKChcbiAgICBjb2xvcjogKFxuICAgICAgdGhlbWUtdHlwZTogbGlnaHQsXG4gICAgICBwcmltYXJ5OiBtYXQuJGF6dXJlLXBhbGV0dGUsXG4gICAgICB0ZXJ0aWFyeTogbWF0LiRibHVlLXBhbGV0dGUsXG4gICAgKSxcbiAgICB0eXBvZ3JhcGh5OiBSb2JvdG8sXG4gICAgZGVuc2l0eTogMCxcbiAgKSk7XG59YDtcbn1cbiJdfQ==