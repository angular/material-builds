/**
 * @fileoverview added by tsickle
 * Generated from: src/material/bottom-sheet/bottom-sheet-config.ts
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
 * Injection token that can be used to access the data that was passed in to a bottom sheet.
 * @type {?}
 */
export const MAT_BOTTOM_SHEET_DATA = new InjectionToken('MatBottomSheetData');
/**
 * Configuration used when opening a bottom sheet.
 * @template D
 */
export class MatBottomSheetConfig {
    constructor() {
        /**
         * Data being injected into the child component.
         */
        this.data = null;
        /**
         * Whether the bottom sheet has a backdrop.
         */
        this.hasBackdrop = true;
        /**
         * Whether the user can use escape or clicking outside to close the bottom sheet.
         */
        this.disableClose = false;
        /**
         * Aria label to assign to the bottom sheet element.
         */
        this.ariaLabel = null;
        /**
         * Whether the bottom sheet should close when the user goes backwards/forwards in history.
         * Note that this usually doesn't include clicking on links (unless the user is using
         * the `HashLocationStrategy`).
         */
        this.closeOnNavigation = true;
        // Note that this is disabled by default, because while the a11y recommendations are to focus
        // the first focusable element, doing so prevents screen readers from reading out the
        // rest of the bottom sheet content.
        /**
         * Whether the bottom sheet should focus the first focusable element on open.
         */
        this.autoFocus = false;
        /**
         * Whether the bottom sheet should restore focus to the
         * previously-focused element, after it's closed.
         */
        this.restoreFocus = true;
    }
}
if (false) {
    /**
     * The view container to place the overlay for the bottom sheet into.
     * @type {?}
     */
    MatBottomSheetConfig.prototype.viewContainerRef;
    /**
     * Extra CSS classes to be added to the bottom sheet container.
     * @type {?}
     */
    MatBottomSheetConfig.prototype.panelClass;
    /**
     * Text layout direction for the bottom sheet.
     * @type {?}
     */
    MatBottomSheetConfig.prototype.direction;
    /**
     * Data being injected into the child component.
     * @type {?}
     */
    MatBottomSheetConfig.prototype.data;
    /**
     * Whether the bottom sheet has a backdrop.
     * @type {?}
     */
    MatBottomSheetConfig.prototype.hasBackdrop;
    /**
     * Custom class for the backdrop.
     * @type {?}
     */
    MatBottomSheetConfig.prototype.backdropClass;
    /**
     * Whether the user can use escape or clicking outside to close the bottom sheet.
     * @type {?}
     */
    MatBottomSheetConfig.prototype.disableClose;
    /**
     * Aria label to assign to the bottom sheet element.
     * @type {?}
     */
    MatBottomSheetConfig.prototype.ariaLabel;
    /**
     * Whether the bottom sheet should close when the user goes backwards/forwards in history.
     * Note that this usually doesn't include clicking on links (unless the user is using
     * the `HashLocationStrategy`).
     * @type {?}
     */
    MatBottomSheetConfig.prototype.closeOnNavigation;
    /**
     * Whether the bottom sheet should focus the first focusable element on open.
     * @type {?}
     */
    MatBottomSheetConfig.prototype.autoFocus;
    /**
     * Whether the bottom sheet should restore focus to the
     * previously-focused element, after it's closed.
     * @type {?}
     */
    MatBottomSheetConfig.prototype.restoreFocus;
    /**
     * Scroll strategy to be used for the bottom sheet.
     * @type {?}
     */
    MatBottomSheetConfig.prototype.scrollStrategy;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFVQSxPQUFPLEVBQUMsY0FBYyxFQUFtQixNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFHL0QsTUFBTSxPQUFPLHFCQUFxQixHQUFHLElBQUksY0FBYyxDQUFNLG9CQUFvQixDQUFDOzs7OztBQUtsRixNQUFNLE9BQU8sb0JBQW9CO0lBQWpDOzs7O1FBV0UsU0FBSSxHQUFjLElBQUksQ0FBQzs7OztRQUd2QixnQkFBVyxHQUFhLElBQUksQ0FBQzs7OztRQU03QixpQkFBWSxHQUFhLEtBQUssQ0FBQzs7OztRQUcvQixjQUFTLEdBQW1CLElBQUksQ0FBQzs7Ozs7O1FBT2pDLHNCQUFpQixHQUFhLElBQUksQ0FBQzs7Ozs7OztRQU1uQyxjQUFTLEdBQWEsS0FBSyxDQUFDOzs7OztRQU01QixpQkFBWSxHQUFhLElBQUksQ0FBQztJQUloQyxDQUFDO0NBQUE7Ozs7OztJQTVDQyxnREFBb0M7Ozs7O0lBR3BDLDBDQUErQjs7Ozs7SUFHL0IseUNBQXNCOzs7OztJQUd0QixvQ0FBdUI7Ozs7O0lBR3ZCLDJDQUE2Qjs7Ozs7SUFHN0IsNkNBQXVCOzs7OztJQUd2Qiw0Q0FBK0I7Ozs7O0lBRy9CLHlDQUFpQzs7Ozs7OztJQU9qQyxpREFBbUM7Ozs7O0lBTW5DLHlDQUE0Qjs7Ozs7O0lBTTVCLDRDQUE4Qjs7Ozs7SUFHOUIsOENBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1Njcm9sbFN0cmF0ZWd5fSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0luamVjdGlvblRva2VuLCBWaWV3Q29udGFpbmVyUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgZGF0YSB0aGF0IHdhcyBwYXNzZWQgaW4gdG8gYSBib3R0b20gc2hlZXQuICovXG5leHBvcnQgY29uc3QgTUFUX0JPVFRPTV9TSEVFVF9EQVRBID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ01hdEJvdHRvbVNoZWV0RGF0YScpO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gdXNlZCB3aGVuIG9wZW5pbmcgYSBib3R0b20gc2hlZXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRCb3R0b21TaGVldENvbmZpZzxEID0gYW55PiB7XG4gIC8qKiBUaGUgdmlldyBjb250YWluZXIgdG8gcGxhY2UgdGhlIG92ZXJsYXkgZm9yIHRoZSBib3R0b20gc2hlZXQgaW50by4gKi9cbiAgdmlld0NvbnRhaW5lclJlZj86IFZpZXdDb250YWluZXJSZWY7XG5cbiAgLyoqIEV4dHJhIENTUyBjbGFzc2VzIHRvIGJlIGFkZGVkIHRvIHRoZSBib3R0b20gc2hlZXQgY29udGFpbmVyLiAqL1xuICBwYW5lbENsYXNzPzogc3RyaW5nIHwgc3RyaW5nW107XG5cbiAgLyoqIFRleHQgbGF5b3V0IGRpcmVjdGlvbiBmb3IgdGhlIGJvdHRvbSBzaGVldC4gKi9cbiAgZGlyZWN0aW9uPzogRGlyZWN0aW9uO1xuXG4gIC8qKiBEYXRhIGJlaW5nIGluamVjdGVkIGludG8gdGhlIGNoaWxkIGNvbXBvbmVudC4gKi9cbiAgZGF0YT86IEQgfCBudWxsID0gbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgYm90dG9tIHNoZWV0IGhhcyBhIGJhY2tkcm9wLiAqL1xuICBoYXNCYWNrZHJvcD86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBDdXN0b20gY2xhc3MgZm9yIHRoZSBiYWNrZHJvcC4gKi9cbiAgYmFja2Ryb3BDbGFzcz86IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBjYW4gdXNlIGVzY2FwZSBvciBjbGlja2luZyBvdXRzaWRlIHRvIGNsb3NlIHRoZSBib3R0b20gc2hlZXQuICovXG4gIGRpc2FibGVDbG9zZT86IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQXJpYSBsYWJlbCB0byBhc3NpZ24gdG8gdGhlIGJvdHRvbSBzaGVldCBlbGVtZW50LiAqL1xuICBhcmlhTGFiZWw/OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYm90dG9tIHNoZWV0IHNob3VsZCBjbG9zZSB3aGVuIHRoZSB1c2VyIGdvZXMgYmFja3dhcmRzL2ZvcndhcmRzIGluIGhpc3RvcnkuXG4gICAqIE5vdGUgdGhhdCB0aGlzIHVzdWFsbHkgZG9lc24ndCBpbmNsdWRlIGNsaWNraW5nIG9uIGxpbmtzICh1bmxlc3MgdGhlIHVzZXIgaXMgdXNpbmdcbiAgICogdGhlIGBIYXNoTG9jYXRpb25TdHJhdGVneWApLlxuICAgKi9cbiAgY2xvc2VPbk5hdmlnYXRpb24/OiBib29sZWFuID0gdHJ1ZTtcblxuICAvLyBOb3RlIHRoYXQgdGhpcyBpcyBkaXNhYmxlZCBieSBkZWZhdWx0LCBiZWNhdXNlIHdoaWxlIHRoZSBhMTF5IHJlY29tbWVuZGF0aW9ucyBhcmUgdG8gZm9jdXNcbiAgLy8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LCBkb2luZyBzbyBwcmV2ZW50cyBzY3JlZW4gcmVhZGVycyBmcm9tIHJlYWRpbmcgb3V0IHRoZVxuICAvLyByZXN0IG9mIHRoZSBib3R0b20gc2hlZXQgY29udGVudC5cbiAgLyoqIFdoZXRoZXIgdGhlIGJvdHRvbSBzaGVldCBzaG91bGQgZm9jdXMgdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50IG9uIG9wZW4uICovXG4gIGF1dG9Gb2N1cz86IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYm90dG9tIHNoZWV0IHNob3VsZCByZXN0b3JlIGZvY3VzIHRvIHRoZVxuICAgKiBwcmV2aW91c2x5LWZvY3VzZWQgZWxlbWVudCwgYWZ0ZXIgaXQncyBjbG9zZWQuXG4gICAqL1xuICByZXN0b3JlRm9jdXM/OiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogU2Nyb2xsIHN0cmF0ZWd5IHRvIGJlIHVzZWQgZm9yIHRoZSBib3R0b20gc2hlZXQuICovXG4gIHNjcm9sbFN0cmF0ZWd5PzogU2Nyb2xsU3RyYXRlZ3k7XG59XG4iXX0=