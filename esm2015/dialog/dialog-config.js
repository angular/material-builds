/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Possible overrides for a dialog's position.
 * @record
 */
export function DialogPosition() { }
if (false) {
    /**
     * Override for the dialog's top position.
     * @type {?|undefined}
     */
    DialogPosition.prototype.top;
    /**
     * Override for the dialog's bottom position.
     * @type {?|undefined}
     */
    DialogPosition.prototype.bottom;
    /**
     * Override for the dialog's left position.
     * @type {?|undefined}
     */
    DialogPosition.prototype.left;
    /**
     * Override for the dialog's right position.
     * @type {?|undefined}
     */
    DialogPosition.prototype.right;
}
/**
 * Configuration for opening a modal dialog with the MatDialog service.
 * @template D
 */
export class MatDialogConfig {
    constructor() {
        /**
         * The ARIA role of the dialog element.
         */
        this.role = 'dialog';
        /**
         * Custom class for the overlay pane.
         */
        this.panelClass = '';
        /**
         * Whether the dialog has a backdrop.
         */
        this.hasBackdrop = true;
        /**
         * Custom class for the backdrop,
         */
        this.backdropClass = '';
        /**
         * Whether the user can use escape or clicking on the backdrop to close the modal.
         */
        this.disableClose = false;
        /**
         * Width of the dialog.
         */
        this.width = '';
        /**
         * Height of the dialog.
         */
        this.height = '';
        /**
         * Max-width of the dialog. If a number is provided, pixel units are assumed. Defaults to 80vw
         */
        this.maxWidth = '80vw';
        /**
         * Data being injected into the child component.
         */
        this.data = null;
        /**
         * ID of the element that describes the dialog.
         */
        this.ariaDescribedBy = null;
        /**
         * ID of the element that labels the dialog.
         */
        this.ariaLabelledBy = null;
        /**
         * Aria label to assign to the dialog element
         */
        this.ariaLabel = null;
        /**
         * Whether the dialog should focus the first focusable element on open.
         */
        this.autoFocus = true;
        /**
         * Whether the dialog should restore focus to the
         * previously-focused element, after it's closed.
         */
        this.restoreFocus = true;
        /**
         * Whether the dialog should close when the user goes backwards/forwards in history.
         * Note that this usually doesn't include clicking on links (unless the user is using
         * the `HashLocationStrategy`).
         */
        this.closeOnNavigation = true;
        // TODO(jelbourn): add configuration for lifecycle hooks, ARIA labelling.
    }
}
if (false) {
    /**
     * Where the attached component should live in Angular's *logical* component tree.
     * This affects what is available for injection and the change detection order for the
     * component instantiated inside of the dialog. This does not affect where the dialog
     * content will be rendered.
     * @type {?}
     */
    MatDialogConfig.prototype.viewContainerRef;
    /**
     * ID for the dialog. If omitted, a unique one will be generated.
     * @type {?}
     */
    MatDialogConfig.prototype.id;
    /**
     * The ARIA role of the dialog element.
     * @type {?}
     */
    MatDialogConfig.prototype.role;
    /**
     * Custom class for the overlay pane.
     * @type {?}
     */
    MatDialogConfig.prototype.panelClass;
    /**
     * Whether the dialog has a backdrop.
     * @type {?}
     */
    MatDialogConfig.prototype.hasBackdrop;
    /**
     * Custom class for the backdrop,
     * @type {?}
     */
    MatDialogConfig.prototype.backdropClass;
    /**
     * Whether the user can use escape or clicking on the backdrop to close the modal.
     * @type {?}
     */
    MatDialogConfig.prototype.disableClose;
    /**
     * Width of the dialog.
     * @type {?}
     */
    MatDialogConfig.prototype.width;
    /**
     * Height of the dialog.
     * @type {?}
     */
    MatDialogConfig.prototype.height;
    /**
     * Min-width of the dialog. If a number is provided, pixel units are assumed.
     * @type {?}
     */
    MatDialogConfig.prototype.minWidth;
    /**
     * Min-height of the dialog. If a number is provided, pixel units are assumed.
     * @type {?}
     */
    MatDialogConfig.prototype.minHeight;
    /**
     * Max-width of the dialog. If a number is provided, pixel units are assumed. Defaults to 80vw
     * @type {?}
     */
    MatDialogConfig.prototype.maxWidth;
    /**
     * Max-height of the dialog. If a number is provided, pixel units are assumed.
     * @type {?}
     */
    MatDialogConfig.prototype.maxHeight;
    /**
     * Position overrides.
     * @type {?}
     */
    MatDialogConfig.prototype.position;
    /**
     * Data being injected into the child component.
     * @type {?}
     */
    MatDialogConfig.prototype.data;
    /**
     * Layout direction for the dialog's content.
     * @type {?}
     */
    MatDialogConfig.prototype.direction;
    /**
     * ID of the element that describes the dialog.
     * @type {?}
     */
    MatDialogConfig.prototype.ariaDescribedBy;
    /**
     * ID of the element that labels the dialog.
     * @type {?}
     */
    MatDialogConfig.prototype.ariaLabelledBy;
    /**
     * Aria label to assign to the dialog element
     * @type {?}
     */
    MatDialogConfig.prototype.ariaLabel;
    /**
     * Whether the dialog should focus the first focusable element on open.
     * @type {?}
     */
    MatDialogConfig.prototype.autoFocus;
    /**
     * Whether the dialog should restore focus to the
     * previously-focused element, after it's closed.
     * @type {?}
     */
    MatDialogConfig.prototype.restoreFocus;
    /**
     * Scroll strategy to be used for the dialog.
     * @type {?}
     */
    MatDialogConfig.prototype.scrollStrategy;
    /**
     * Whether the dialog should close when the user goes backwards/forwards in history.
     * Note that this usually doesn't include clicking on links (unless the user is using
     * the `HashLocationStrategy`).
     * @type {?}
     */
    MatDialogConfig.prototype.closeOnNavigation;
    /**
     * Alternate `ComponentFactoryResolver` to use when resolving the associated component.
     * @type {?}
     */
    MatDialogConfig.prototype.componentFactoryResolver;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsb0NBWUM7Ozs7OztJQVZDLDZCQUFhOzs7OztJQUdiLGdDQUFnQjs7Ozs7SUFHaEIsOEJBQWM7Ozs7O0lBR2QsK0JBQWU7Ozs7OztBQU1qQixNQUFNLE9BQU8sZUFBZTtJQUE1Qjs7OztRQWNFLFNBQUksR0FBZ0IsUUFBUSxDQUFDOzs7O1FBRzdCLGVBQVUsR0FBdUIsRUFBRSxDQUFDOzs7O1FBR3BDLGdCQUFXLEdBQWEsSUFBSSxDQUFDOzs7O1FBRzdCLGtCQUFhLEdBQVksRUFBRSxDQUFDOzs7O1FBRzVCLGlCQUFZLEdBQWEsS0FBSyxDQUFDOzs7O1FBRy9CLFVBQUssR0FBWSxFQUFFLENBQUM7Ozs7UUFHcEIsV0FBTSxHQUFZLEVBQUUsQ0FBQzs7OztRQVNyQixhQUFRLEdBQXFCLE1BQU0sQ0FBQzs7OztRQVNwQyxTQUFJLEdBQWMsSUFBSSxDQUFDOzs7O1FBTXZCLG9CQUFlLEdBQW1CLElBQUksQ0FBQzs7OztRQUd2QyxtQkFBYyxHQUFtQixJQUFJLENBQUM7Ozs7UUFHdEMsY0FBUyxHQUFtQixJQUFJLENBQUM7Ozs7UUFHakMsY0FBUyxHQUFhLElBQUksQ0FBQzs7Ozs7UUFNM0IsaUJBQVksR0FBYSxJQUFJLENBQUM7Ozs7OztRQVU5QixzQkFBaUIsR0FBYSxJQUFJLENBQUM7UUFLbkMseUVBQXlFO0lBQzNFLENBQUM7Q0FBQTs7Ozs7Ozs7O0lBL0VDLDJDQUFvQzs7Ozs7SUFHcEMsNkJBQVk7Ozs7O0lBR1osK0JBQTZCOzs7OztJQUc3QixxQ0FBb0M7Ozs7O0lBR3BDLHNDQUE2Qjs7Ozs7SUFHN0Isd0NBQTRCOzs7OztJQUc1Qix1Q0FBK0I7Ozs7O0lBRy9CLGdDQUFvQjs7Ozs7SUFHcEIsaUNBQXFCOzs7OztJQUdyQixtQ0FBMkI7Ozs7O0lBRzNCLG9DQUE0Qjs7Ozs7SUFHNUIsbUNBQW9DOzs7OztJQUdwQyxvQ0FBNEI7Ozs7O0lBRzVCLG1DQUEwQjs7Ozs7SUFHMUIsK0JBQXVCOzs7OztJQUd2QixvQ0FBc0I7Ozs7O0lBR3RCLDBDQUF1Qzs7Ozs7SUFHdkMseUNBQXNDOzs7OztJQUd0QyxvQ0FBaUM7Ozs7O0lBR2pDLG9DQUEyQjs7Ozs7O0lBTTNCLHVDQUE4Qjs7Ozs7SUFHOUIseUNBQWdDOzs7Ozs7O0lBT2hDLDRDQUFtQzs7Ozs7SUFHbkMsbURBQW9EIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Vmlld0NvbnRhaW5lclJlZiwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RGlyZWN0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1Njcm9sbFN0cmF0ZWd5fSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5cbi8qKiBWYWxpZCBBUklBIHJvbGVzIGZvciBhIGRpYWxvZyBlbGVtZW50LiAqL1xuZXhwb3J0IHR5cGUgRGlhbG9nUm9sZSA9ICdkaWFsb2cnIHwgJ2FsZXJ0ZGlhbG9nJztcblxuLyoqIFBvc3NpYmxlIG92ZXJyaWRlcyBmb3IgYSBkaWFsb2cncyBwb3NpdGlvbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGlhbG9nUG9zaXRpb24ge1xuICAvKiogT3ZlcnJpZGUgZm9yIHRoZSBkaWFsb2cncyB0b3AgcG9zaXRpb24uICovXG4gIHRvcD86IHN0cmluZztcblxuICAvKiogT3ZlcnJpZGUgZm9yIHRoZSBkaWFsb2cncyBib3R0b20gcG9zaXRpb24uICovXG4gIGJvdHRvbT86IHN0cmluZztcblxuICAvKiogT3ZlcnJpZGUgZm9yIHRoZSBkaWFsb2cncyBsZWZ0IHBvc2l0aW9uLiAqL1xuICBsZWZ0Pzogc3RyaW5nO1xuXG4gIC8qKiBPdmVycmlkZSBmb3IgdGhlIGRpYWxvZydzIHJpZ2h0IHBvc2l0aW9uLiAqL1xuICByaWdodD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGZvciBvcGVuaW5nIGEgbW9kYWwgZGlhbG9nIHdpdGggdGhlIE1hdERpYWxvZyBzZXJ2aWNlLlxuICovXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nQ29uZmlnPEQgPSBhbnk+IHtcblxuICAvKipcbiAgICogV2hlcmUgdGhlIGF0dGFjaGVkIGNvbXBvbmVudCBzaG91bGQgbGl2ZSBpbiBBbmd1bGFyJ3MgKmxvZ2ljYWwqIGNvbXBvbmVudCB0cmVlLlxuICAgKiBUaGlzIGFmZmVjdHMgd2hhdCBpcyBhdmFpbGFibGUgZm9yIGluamVjdGlvbiBhbmQgdGhlIGNoYW5nZSBkZXRlY3Rpb24gb3JkZXIgZm9yIHRoZVxuICAgKiBjb21wb25lbnQgaW5zdGFudGlhdGVkIGluc2lkZSBvZiB0aGUgZGlhbG9nLiBUaGlzIGRvZXMgbm90IGFmZmVjdCB3aGVyZSB0aGUgZGlhbG9nXG4gICAqIGNvbnRlbnQgd2lsbCBiZSByZW5kZXJlZC5cbiAgICovXG4gIHZpZXdDb250YWluZXJSZWY/OiBWaWV3Q29udGFpbmVyUmVmO1xuXG4gIC8qKiBJRCBmb3IgdGhlIGRpYWxvZy4gSWYgb21pdHRlZCwgYSB1bmlxdWUgb25lIHdpbGwgYmUgZ2VuZXJhdGVkLiAqL1xuICBpZD86IHN0cmluZztcblxuICAvKiogVGhlIEFSSUEgcm9sZSBvZiB0aGUgZGlhbG9nIGVsZW1lbnQuICovXG4gIHJvbGU/OiBEaWFsb2dSb2xlID0gJ2RpYWxvZyc7XG5cbiAgLyoqIEN1c3RvbSBjbGFzcyBmb3IgdGhlIG92ZXJsYXkgcGFuZS4gKi9cbiAgcGFuZWxDbGFzcz86IHN0cmluZyB8IHN0cmluZ1tdID0gJyc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRpYWxvZyBoYXMgYSBiYWNrZHJvcC4gKi9cbiAgaGFzQmFja2Ryb3A/OiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogQ3VzdG9tIGNsYXNzIGZvciB0aGUgYmFja2Ryb3AsICovXG4gIGJhY2tkcm9wQ2xhc3M/OiBzdHJpbmcgPSAnJztcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBjYW4gdXNlIGVzY2FwZSBvciBjbGlja2luZyBvbiB0aGUgYmFja2Ryb3AgdG8gY2xvc2UgdGhlIG1vZGFsLiAqL1xuICBkaXNhYmxlQ2xvc2U/OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdpZHRoIG9mIHRoZSBkaWFsb2cuICovXG4gIHdpZHRoPzogc3RyaW5nID0gJyc7XG5cbiAgLyoqIEhlaWdodCBvZiB0aGUgZGlhbG9nLiAqL1xuICBoZWlnaHQ/OiBzdHJpbmcgPSAnJztcblxuICAvKiogTWluLXdpZHRoIG9mIHRoZSBkaWFsb2cuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBwaXhlbCB1bml0cyBhcmUgYXNzdW1lZC4gKi9cbiAgbWluV2lkdGg/OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgLyoqIE1pbi1oZWlnaHQgb2YgdGhlIGRpYWxvZy4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIHBpeGVsIHVuaXRzIGFyZSBhc3N1bWVkLiAqL1xuICBtaW5IZWlnaHQ/OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgLyoqIE1heC13aWR0aCBvZiB0aGUgZGlhbG9nLiBJZiBhIG51bWJlciBpcyBwcm92aWRlZCwgcGl4ZWwgdW5pdHMgYXJlIGFzc3VtZWQuIERlZmF1bHRzIHRvIDgwdncgKi9cbiAgbWF4V2lkdGg/OiBudW1iZXIgfCBzdHJpbmcgPSAnODB2dyc7XG5cbiAgLyoqIE1heC1oZWlnaHQgb2YgdGhlIGRpYWxvZy4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIHBpeGVsIHVuaXRzIGFyZSBhc3N1bWVkLiAqL1xuICBtYXhIZWlnaHQ/OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgLyoqIFBvc2l0aW9uIG92ZXJyaWRlcy4gKi9cbiAgcG9zaXRpb24/OiBEaWFsb2dQb3NpdGlvbjtcblxuICAvKiogRGF0YSBiZWluZyBpbmplY3RlZCBpbnRvIHRoZSBjaGlsZCBjb21wb25lbnQuICovXG4gIGRhdGE/OiBEIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIExheW91dCBkaXJlY3Rpb24gZm9yIHRoZSBkaWFsb2cncyBjb250ZW50LiAqL1xuICBkaXJlY3Rpb24/OiBEaXJlY3Rpb247XG5cbiAgLyoqIElEIG9mIHRoZSBlbGVtZW50IHRoYXQgZGVzY3JpYmVzIHRoZSBkaWFsb2cuICovXG4gIGFyaWFEZXNjcmliZWRCeT86IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBJRCBvZiB0aGUgZWxlbWVudCB0aGF0IGxhYmVscyB0aGUgZGlhbG9nLiAqL1xuICBhcmlhTGFiZWxsZWRCeT86IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBBcmlhIGxhYmVsIHRvIGFzc2lnbiB0byB0aGUgZGlhbG9nIGVsZW1lbnQgKi9cbiAgYXJpYUxhYmVsPzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRpYWxvZyBzaG91bGQgZm9jdXMgdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50IG9uIG9wZW4uICovXG4gIGF1dG9Gb2N1cz86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkaWFsb2cgc2hvdWxkIHJlc3RvcmUgZm9jdXMgdG8gdGhlXG4gICAqIHByZXZpb3VzbHktZm9jdXNlZCBlbGVtZW50LCBhZnRlciBpdCdzIGNsb3NlZC5cbiAgICovXG4gIHJlc3RvcmVGb2N1cz86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBTY3JvbGwgc3RyYXRlZ3kgdG8gYmUgdXNlZCBmb3IgdGhlIGRpYWxvZy4gKi9cbiAgc2Nyb2xsU3RyYXRlZ3k/OiBTY3JvbGxTdHJhdGVneTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZGlhbG9nIHNob3VsZCBjbG9zZSB3aGVuIHRoZSB1c2VyIGdvZXMgYmFja3dhcmRzL2ZvcndhcmRzIGluIGhpc3RvcnkuXG4gICAqIE5vdGUgdGhhdCB0aGlzIHVzdWFsbHkgZG9lc24ndCBpbmNsdWRlIGNsaWNraW5nIG9uIGxpbmtzICh1bmxlc3MgdGhlIHVzZXIgaXMgdXNpbmdcbiAgICogdGhlIGBIYXNoTG9jYXRpb25TdHJhdGVneWApLlxuICAgKi9cbiAgY2xvc2VPbk5hdmlnYXRpb24/OiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogQWx0ZXJuYXRlIGBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJgIHRvIHVzZSB3aGVuIHJlc29sdmluZyB0aGUgYXNzb2NpYXRlZCBjb21wb25lbnQuICovXG4gIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcj86IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjtcblxuICAvLyBUT0RPKGplbGJvdXJuKTogYWRkIGNvbmZpZ3VyYXRpb24gZm9yIGxpZmVjeWNsZSBob29rcywgQVJJQSBsYWJlbGxpbmcuXG59XG4iXX0=