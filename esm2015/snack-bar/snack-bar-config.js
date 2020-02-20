/**
 * @fileoverview added by tsickle
 * Generated from: src/material/snack-bar/snack-bar-config.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
/**
 * Injection token that can be used to access the data that was passed in to a snack bar.
 * @type {?}
 */
export const MAT_SNACK_BAR_DATA = new InjectionToken('MatSnackBarData');
/**
 * Configuration used when opening a snack-bar.
 * @template D
 */
export class MatSnackBarConfig {
    constructor() {
        /**
         * The politeness level for the MatAriaLiveAnnouncer announcement.
         */
        this.politeness = 'assertive';
        /**
         * Message to be announced by the LiveAnnouncer. When opening a snackbar without a custom
         * component or template, the announcement message will default to the specified message.
         */
        this.announcementMessage = '';
        /**
         * The length of time in milliseconds to wait before automatically dismissing the snack bar.
         */
        this.duration = 0;
        /**
         * Data being injected into the child component.
         */
        this.data = null;
        /**
         * The horizontal position to place the snack bar.
         */
        this.horizontalPosition = 'center';
        /**
         * The vertical position to place the snack bar.
         */
        this.verticalPosition = 'bottom';
    }
}
if (false) {
    /**
     * The politeness level for the MatAriaLiveAnnouncer announcement.
     * @type {?}
     */
    MatSnackBarConfig.prototype.politeness;
    /**
     * Message to be announced by the LiveAnnouncer. When opening a snackbar without a custom
     * component or template, the announcement message will default to the specified message.
     * @type {?}
     */
    MatSnackBarConfig.prototype.announcementMessage;
    /**
     * The view container that serves as the parent for the snackbar for the purposes of dependency
     * injection. Note: this does not affect where the snackbar is inserted in the DOM.
     * @type {?}
     */
    MatSnackBarConfig.prototype.viewContainerRef;
    /**
     * The length of time in milliseconds to wait before automatically dismissing the snack bar.
     * @type {?}
     */
    MatSnackBarConfig.prototype.duration;
    /**
     * Extra CSS classes to be added to the snack bar container.
     * @type {?}
     */
    MatSnackBarConfig.prototype.panelClass;
    /**
     * Text layout direction for the snack bar.
     * @type {?}
     */
    MatSnackBarConfig.prototype.direction;
    /**
     * Data being injected into the child component.
     * @type {?}
     */
    MatSnackBarConfig.prototype.data;
    /**
     * The horizontal position to place the snack bar.
     * @type {?}
     */
    MatSnackBarConfig.prototype.horizontalPosition;
    /**
     * The vertical position to place the snack bar.
     * @type {?}
     */
    MatSnackBarConfig.prototype.verticalPosition;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQW1CLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFLL0QsTUFBTSxPQUFPLGtCQUFrQixHQUFHLElBQUksY0FBYyxDQUFNLGlCQUFpQixDQUFDOzs7OztBQVc1RSxNQUFNLE9BQU8saUJBQWlCO0lBQTlCOzs7O1FBRUUsZUFBVSxHQUF3QixXQUFXLENBQUM7Ozs7O1FBTTlDLHdCQUFtQixHQUFZLEVBQUUsQ0FBQzs7OztRQVNsQyxhQUFRLEdBQVksQ0FBQyxDQUFDOzs7O1FBU3RCLFNBQUksR0FBYyxJQUFJLENBQUM7Ozs7UUFHdkIsdUJBQWtCLEdBQW1DLFFBQVEsQ0FBQzs7OztRQUc5RCxxQkFBZ0IsR0FBaUMsUUFBUSxDQUFDO0lBQzVELENBQUM7Q0FBQTs7Ozs7O0lBL0JDLHVDQUE4Qzs7Ozs7O0lBTTlDLGdEQUFrQzs7Ozs7O0lBTWxDLDZDQUFvQzs7Ozs7SUFHcEMscUNBQXNCOzs7OztJQUd0Qix1Q0FBK0I7Ozs7O0lBRy9CLHNDQUFzQjs7Ozs7SUFHdEIsaUNBQXVCOzs7OztJQUd2QiwrQ0FBOEQ7Ozs7O0lBRzlELDZDQUEwRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1ZpZXdDb250YWluZXJSZWYsIEluamVjdGlvblRva2VufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QXJpYUxpdmVQb2xpdGVuZXNzfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWNjZXNzIHRoZSBkYXRhIHRoYXQgd2FzIHBhc3NlZCBpbiB0byBhIHNuYWNrIGJhci4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU05BQ0tfQkFSX0RBVEEgPSBuZXcgSW5qZWN0aW9uVG9rZW48YW55PignTWF0U25hY2tCYXJEYXRhJyk7XG5cbi8qKiBQb3NzaWJsZSB2YWx1ZXMgZm9yIGhvcml6b250YWxQb3NpdGlvbiBvbiBNYXRTbmFja0JhckNvbmZpZy4gKi9cbmV4cG9ydCB0eXBlIE1hdFNuYWNrQmFySG9yaXpvbnRhbFBvc2l0aW9uID0gJ3N0YXJ0JyB8ICdjZW50ZXInIHwgJ2VuZCcgfCAnbGVmdCcgfCAncmlnaHQnO1xuXG4vKiogUG9zc2libGUgdmFsdWVzIGZvciB2ZXJ0aWNhbFBvc2l0aW9uIG9uIE1hdFNuYWNrQmFyQ29uZmlnLiAqL1xuZXhwb3J0IHR5cGUgTWF0U25hY2tCYXJWZXJ0aWNhbFBvc2l0aW9uID0gJ3RvcCcgfCAnYm90dG9tJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHVzZWQgd2hlbiBvcGVuaW5nIGEgc25hY2stYmFyLlxuICovXG5leHBvcnQgY2xhc3MgTWF0U25hY2tCYXJDb25maWc8RCA9IGFueT4ge1xuICAvKiogVGhlIHBvbGl0ZW5lc3MgbGV2ZWwgZm9yIHRoZSBNYXRBcmlhTGl2ZUFubm91bmNlciBhbm5vdW5jZW1lbnQuICovXG4gIHBvbGl0ZW5lc3M/OiBBcmlhTGl2ZVBvbGl0ZW5lc3MgPSAnYXNzZXJ0aXZlJztcblxuICAvKipcbiAgICogTWVzc2FnZSB0byBiZSBhbm5vdW5jZWQgYnkgdGhlIExpdmVBbm5vdW5jZXIuIFdoZW4gb3BlbmluZyBhIHNuYWNrYmFyIHdpdGhvdXQgYSBjdXN0b21cbiAgICogY29tcG9uZW50IG9yIHRlbXBsYXRlLCB0aGUgYW5ub3VuY2VtZW50IG1lc3NhZ2Ugd2lsbCBkZWZhdWx0IHRvIHRoZSBzcGVjaWZpZWQgbWVzc2FnZS5cbiAgICovXG4gIGFubm91bmNlbWVudE1lc3NhZ2U/OiBzdHJpbmcgPSAnJztcblxuICAvKipcbiAgICogVGhlIHZpZXcgY29udGFpbmVyIHRoYXQgc2VydmVzIGFzIHRoZSBwYXJlbnQgZm9yIHRoZSBzbmFja2JhciBmb3IgdGhlIHB1cnBvc2VzIG9mIGRlcGVuZGVuY3lcbiAgICogaW5qZWN0aW9uLiBOb3RlOiB0aGlzIGRvZXMgbm90IGFmZmVjdCB3aGVyZSB0aGUgc25hY2tiYXIgaXMgaW5zZXJ0ZWQgaW4gdGhlIERPTS5cbiAgICovXG4gIHZpZXdDb250YWluZXJSZWY/OiBWaWV3Q29udGFpbmVyUmVmO1xuXG4gIC8qKiBUaGUgbGVuZ3RoIG9mIHRpbWUgaW4gbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIGF1dG9tYXRpY2FsbHkgZGlzbWlzc2luZyB0aGUgc25hY2sgYmFyLiAqL1xuICBkdXJhdGlvbj86IG51bWJlciA9IDA7XG5cbiAgLyoqIEV4dHJhIENTUyBjbGFzc2VzIHRvIGJlIGFkZGVkIHRvIHRoZSBzbmFjayBiYXIgY29udGFpbmVyLiAqL1xuICBwYW5lbENsYXNzPzogc3RyaW5nIHwgc3RyaW5nW107XG5cbiAgLyoqIFRleHQgbGF5b3V0IGRpcmVjdGlvbiBmb3IgdGhlIHNuYWNrIGJhci4gKi9cbiAgZGlyZWN0aW9uPzogRGlyZWN0aW9uO1xuXG4gIC8qKiBEYXRhIGJlaW5nIGluamVjdGVkIGludG8gdGhlIGNoaWxkIGNvbXBvbmVudC4gKi9cbiAgZGF0YT86IEQgfCBudWxsID0gbnVsbDtcblxuICAvKiogVGhlIGhvcml6b250YWwgcG9zaXRpb24gdG8gcGxhY2UgdGhlIHNuYWNrIGJhci4gKi9cbiAgaG9yaXpvbnRhbFBvc2l0aW9uPzogTWF0U25hY2tCYXJIb3Jpem9udGFsUG9zaXRpb24gPSAnY2VudGVyJztcblxuICAvKiogVGhlIHZlcnRpY2FsIHBvc2l0aW9uIHRvIHBsYWNlIHRoZSBzbmFjayBiYXIuICovXG4gIHZlcnRpY2FsUG9zaXRpb24/OiBNYXRTbmFja0JhclZlcnRpY2FsUG9zaXRpb24gPSAnYm90dG9tJztcbn1cbiJdfQ==