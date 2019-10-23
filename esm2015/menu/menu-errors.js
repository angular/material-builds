/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Throws an exception for the case when menu trigger doesn't have a valid mat-menu instance
 * \@docs-private
 * @return {?}
 */
export function throwMatMenuMissingError() {
    throw Error(`matMenuTriggerFor: must pass in an mat-menu instance.

    Example:
      <mat-menu #menu="matMenu"></mat-menu>
      <button [matMenuTriggerFor]="menu"></button>`);
}
/**
 * Throws an exception for the case when menu's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 * \@docs-private
 * @return {?}
 */
export function throwMatMenuInvalidPositionX() {
    throw Error(`xPosition value must be either 'before' or after'.
      Example: <mat-menu xPosition="before" #menu="matMenu"></mat-menu>`);
}
/**
 * Throws an exception for the case when menu's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 * \@docs-private
 * @return {?}
 */
export function throwMatMenuInvalidPositionY() {
    throw Error(`yPosition value must be either 'above' or below'.
      Example: <mat-menu yPosition="above" #menu="matMenu"></mat-menu>`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1lcnJvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbWVudS9tZW51LWVycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBWUEsTUFBTSxVQUFVLHdCQUF3QjtJQUN0QyxNQUFNLEtBQUssQ0FBQzs7OzttREFJcUMsQ0FBQyxDQUFDO0FBQ3JELENBQUM7Ozs7Ozs7QUFPRCxNQUFNLFVBQVUsNEJBQTRCO0lBQzFDLE1BQU0sS0FBSyxDQUFDO3dFQUMwRCxDQUFDLENBQUM7QUFDMUUsQ0FBQzs7Ozs7OztBQU9ELE1BQU0sVUFBVSw0QkFBNEI7SUFDMUMsTUFBTSxLQUFLLENBQUM7dUVBQ3lELENBQUMsQ0FBQztBQUN6RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogVGhyb3dzIGFuIGV4Y2VwdGlvbiBmb3IgdGhlIGNhc2Ugd2hlbiBtZW51IHRyaWdnZXIgZG9lc24ndCBoYXZlIGEgdmFsaWQgbWF0LW1lbnUgaW5zdGFuY2VcbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93TWF0TWVudU1pc3NpbmdFcnJvcigpIHtcbiAgdGhyb3cgRXJyb3IoYG1hdE1lbnVUcmlnZ2VyRm9yOiBtdXN0IHBhc3MgaW4gYW4gbWF0LW1lbnUgaW5zdGFuY2UuXG5cbiAgICBFeGFtcGxlOlxuICAgICAgPG1hdC1tZW51ICNtZW51PVwibWF0TWVudVwiPjwvbWF0LW1lbnU+XG4gICAgICA8YnV0dG9uIFttYXRNZW51VHJpZ2dlckZvcl09XCJtZW51XCI+PC9idXR0b24+YCk7XG59XG5cbi8qKlxuICogVGhyb3dzIGFuIGV4Y2VwdGlvbiBmb3IgdGhlIGNhc2Ugd2hlbiBtZW51J3MgeC1wb3NpdGlvbiB2YWx1ZSBpc24ndCB2YWxpZC5cbiAqIEluIG90aGVyIHdvcmRzLCBpdCBkb2Vzbid0IG1hdGNoICdiZWZvcmUnIG9yICdhZnRlcicuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd01hdE1lbnVJbnZhbGlkUG9zaXRpb25YKCkge1xuICB0aHJvdyBFcnJvcihgeFBvc2l0aW9uIHZhbHVlIG11c3QgYmUgZWl0aGVyICdiZWZvcmUnIG9yIGFmdGVyJy5cbiAgICAgIEV4YW1wbGU6IDxtYXQtbWVudSB4UG9zaXRpb249XCJiZWZvcmVcIiAjbWVudT1cIm1hdE1lbnVcIj48L21hdC1tZW51PmApO1xufVxuXG4vKipcbiAqIFRocm93cyBhbiBleGNlcHRpb24gZm9yIHRoZSBjYXNlIHdoZW4gbWVudSdzIHktcG9zaXRpb24gdmFsdWUgaXNuJ3QgdmFsaWQuXG4gKiBJbiBvdGhlciB3b3JkcywgaXQgZG9lc24ndCBtYXRjaCAnYWJvdmUnIG9yICdiZWxvdycuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd01hdE1lbnVJbnZhbGlkUG9zaXRpb25ZKCkge1xuICB0aHJvdyBFcnJvcihgeVBvc2l0aW9uIHZhbHVlIG11c3QgYmUgZWl0aGVyICdhYm92ZScgb3IgYmVsb3cnLlxuICAgICAgRXhhbXBsZTogPG1hdC1tZW51IHlQb3NpdGlvbj1cImFib3ZlXCIgI21lbnU9XCJtYXRNZW51XCI+PC9tYXQtbWVudT5gKTtcbn1cbiJdfQ==