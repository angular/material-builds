/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export { MatLegacyMenu } from './menu';
export { MatLegacyMenuItem } from './menu-item';
export { MatLegacyMenuTrigger } from './menu-trigger';
export { MatLegacyMenuModule } from './menu-module';
export { MatLegacyMenuContent } from './menu-content';
export { 
/**
 * @deprecated Use `fadeInItems` from `@angular/material/menu` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
fadeInItems as fadeInLegacyItems, 
/**
 * @deprecated Use `MAT_MENU_DEFAULT_OPTIONS` from `@angular/material/menu` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
MAT_MENU_DEFAULT_OPTIONS as MAT_LEGACY_MENU_DEFAULT_OPTIONS, 
/**
 * @deprecated Use `MAT_MENU_PANEL` from `@angular/material/menu` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
MAT_MENU_PANEL as MAT_LEGACY_MENU_PANEL, 
/**
 * @deprecated Use `MAT_MENU_SCROLL_STRATEGY` from `@angular/material/menu` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
MAT_MENU_SCROLL_STRATEGY as MAT_LEGACY_MENU_SCROLL_STRATEGY, 
/**
 * @deprecated Use `matMenuAnimations` from `@angular/material/menu` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
matMenuAnimations as matLegacyMenuAnimations, 
/**
 * @deprecated Use `transformMenu` from `@angular/material/menu` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
transformMenu as transformLegacyMenu, 
/**
 * @deprecated Use `MAT_MENU_CONTENT` from `@angular/material/menu` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
MAT_MENU_CONTENT as MAT_LEGACY_MENU_CONTENT, } from '@angular/material/menu';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktbWVudS9wdWJsaWMtYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDckMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzlDLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNsRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPO0FBQ0w7OztHQUdHO0FBQ0gsV0FBVyxJQUFJLGlCQUFpQjtBQUVoQzs7O0dBR0c7QUFDSCx3QkFBd0IsSUFBSSwrQkFBK0I7QUFFM0Q7OztHQUdHO0FBQ0gsY0FBYyxJQUFJLHFCQUFxQjtBQUV2Qzs7O0dBR0c7QUFDSCx3QkFBd0IsSUFBSSwrQkFBK0I7QUFFM0Q7OztHQUdHO0FBQ0gsaUJBQWlCLElBQUksdUJBQXVCO0FBMEI1Qzs7O0dBR0c7QUFDSCxhQUFhLElBQUksbUJBQW1CO0FBRXBDOzs7R0FHRztBQUNILGdCQUFnQixJQUFJLHVCQUF1QixHQUM1QyxNQUFNLHdCQUF3QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCB7TWF0TGVnYWN5TWVudX0gZnJvbSAnLi9tZW51JztcbmV4cG9ydCB7TWF0TGVnYWN5TWVudUl0ZW19IGZyb20gJy4vbWVudS1pdGVtJztcbmV4cG9ydCB7TWF0TGVnYWN5TWVudVRyaWdnZXJ9IGZyb20gJy4vbWVudS10cmlnZ2VyJztcbmV4cG9ydCB7TWF0TGVnYWN5TWVudU1vZHVsZX0gZnJvbSAnLi9tZW51LW1vZHVsZSc7XG5leHBvcnQge01hdExlZ2FjeU1lbnVDb250ZW50fSBmcm9tICcuL21lbnUtY29udGVudCc7XG5cbmV4cG9ydCB7XG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGZhZGVJbkl0ZW1zYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9tZW51YCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAgICovXG4gIGZhZGVJbkl0ZW1zIGFzIGZhZGVJbkxlZ2FjeUl0ZW1zLFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OU2AgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gICAqL1xuICBNQVRfTUVOVV9ERUZBVUxUX09QVElPTlMgYXMgTUFUX0xFR0FDWV9NRU5VX0RFRkFVTFRfT1BUSU9OUyxcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBNQVRfTUVOVV9QQU5FTGAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gICAqL1xuICBNQVRfTUVOVV9QQU5FTCBhcyBNQVRfTEVHQUNZX01FTlVfUEFORUwsXG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgTUFUX01FTlVfU0NST0xMX1NUUkFURUdZYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9tZW51YCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAgICovXG4gIE1BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWSBhcyBNQVRfTEVHQUNZX01FTlVfU0NST0xMX1NUUkFURUdZLFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYG1hdE1lbnVBbmltYXRpb25zYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9tZW51YCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAgICovXG4gIG1hdE1lbnVBbmltYXRpb25zIGFzIG1hdExlZ2FjeU1lbnVBbmltYXRpb25zLFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYE1hdE1lbnVEZWZhdWx0T3B0aW9uc2AgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gICAqL1xuICBNYXRNZW51RGVmYXVsdE9wdGlvbnMgYXMgTWF0TGVnYWN5TWVudURlZmF1bHRPcHRpb25zLFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYE1hdE1lbnVQYW5lbGAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gICAqL1xuICBNYXRNZW51UGFuZWwgYXMgTWF0TGVnYWN5TWVudVBhbmVsLFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYE1lbnVQb3NpdGlvblhgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL21lbnVgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgTWVudVBvc2l0aW9uWCBhcyBMZWdhY3lNZW51UG9zaXRpb25YLFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYE1lbnVQb3NpdGlvbllgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL21lbnVgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgTWVudVBvc2l0aW9uWSBhcyBMZWdhY3lNZW51UG9zaXRpb25ZLFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHRyYW5zZm9ybU1lbnVgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL21lbnVgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgdHJhbnNmb3JtTWVudSBhcyB0cmFuc2Zvcm1MZWdhY3lNZW51LFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYE1BVF9NRU5VX0NPTlRFTlRgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL21lbnVgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgTUFUX01FTlVfQ09OVEVOVCBhcyBNQVRfTEVHQUNZX01FTlVfQ09OVEVOVCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudSc7XG4iXX0=