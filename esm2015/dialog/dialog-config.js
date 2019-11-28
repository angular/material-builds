/**
 * @fileoverview added by tsickle
 * Generated from: src/material/dialog/dialog-config.ts
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
         * Custom class for the backdrop.
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
         * Max-width of the dialog. If a number is provided, assumes pixel units. Defaults to 80vw.
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
         * Aria label to assign to the dialog element.
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
     * Custom class for the backdrop.
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
     * Min-width of the dialog. If a number is provided, assumes pixel units.
     * @type {?}
     */
    MatDialogConfig.prototype.minWidth;
    /**
     * Min-height of the dialog. If a number is provided, assumes pixel units.
     * @type {?}
     */
    MatDialogConfig.prototype.minHeight;
    /**
     * Max-width of the dialog. If a number is provided, assumes pixel units. Defaults to 80vw.
     * @type {?}
     */
    MatDialogConfig.prototype.maxWidth;
    /**
     * Max-height of the dialog. If a number is provided, assumes pixel units.
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
     * Aria label to assign to the dialog element.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLG9DQVlDOzs7Ozs7SUFWQyw2QkFBYTs7Ozs7SUFHYixnQ0FBZ0I7Ozs7O0lBR2hCLDhCQUFjOzs7OztJQUdkLCtCQUFlOzs7Ozs7QUFNakIsTUFBTSxPQUFPLGVBQWU7SUFBNUI7Ozs7UUFjRSxTQUFJLEdBQWdCLFFBQVEsQ0FBQzs7OztRQUc3QixlQUFVLEdBQXVCLEVBQUUsQ0FBQzs7OztRQUdwQyxnQkFBVyxHQUFhLElBQUksQ0FBQzs7OztRQUc3QixrQkFBYSxHQUFZLEVBQUUsQ0FBQzs7OztRQUc1QixpQkFBWSxHQUFhLEtBQUssQ0FBQzs7OztRQUcvQixVQUFLLEdBQVksRUFBRSxDQUFDOzs7O1FBR3BCLFdBQU0sR0FBWSxFQUFFLENBQUM7Ozs7UUFTckIsYUFBUSxHQUFxQixNQUFNLENBQUM7Ozs7UUFTcEMsU0FBSSxHQUFjLElBQUksQ0FBQzs7OztRQU12QixvQkFBZSxHQUFtQixJQUFJLENBQUM7Ozs7UUFHdkMsbUJBQWMsR0FBbUIsSUFBSSxDQUFDOzs7O1FBR3RDLGNBQVMsR0FBbUIsSUFBSSxDQUFDOzs7O1FBR2pDLGNBQVMsR0FBYSxJQUFJLENBQUM7Ozs7O1FBTTNCLGlCQUFZLEdBQWEsSUFBSSxDQUFDOzs7Ozs7UUFVOUIsc0JBQWlCLEdBQWEsSUFBSSxDQUFDO1FBS25DLHlFQUF5RTtJQUMzRSxDQUFDO0NBQUE7Ozs7Ozs7OztJQS9FQywyQ0FBb0M7Ozs7O0lBR3BDLDZCQUFZOzs7OztJQUdaLCtCQUE2Qjs7Ozs7SUFHN0IscUNBQW9DOzs7OztJQUdwQyxzQ0FBNkI7Ozs7O0lBRzdCLHdDQUE0Qjs7Ozs7SUFHNUIsdUNBQStCOzs7OztJQUcvQixnQ0FBb0I7Ozs7O0lBR3BCLGlDQUFxQjs7Ozs7SUFHckIsbUNBQTJCOzs7OztJQUczQixvQ0FBNEI7Ozs7O0lBRzVCLG1DQUFvQzs7Ozs7SUFHcEMsb0NBQTRCOzs7OztJQUc1QixtQ0FBMEI7Ozs7O0lBRzFCLCtCQUF1Qjs7Ozs7SUFHdkIsb0NBQXNCOzs7OztJQUd0QiwwQ0FBdUM7Ozs7O0lBR3ZDLHlDQUFzQzs7Ozs7SUFHdEMsb0NBQWlDOzs7OztJQUdqQyxvQ0FBMkI7Ozs7OztJQU0zQix1Q0FBOEI7Ozs7O0lBRzlCLHlDQUFnQzs7Ozs7OztJQU9oQyw0Q0FBbUM7Ozs7O0lBR25DLG1EQUFvRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1ZpZXdDb250YWluZXJSZWYsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtTY3JvbGxTdHJhdGVneX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuXG4vKiogVmFsaWQgQVJJQSByb2xlcyBmb3IgYSBkaWFsb2cgZWxlbWVudC4gKi9cbmV4cG9ydCB0eXBlIERpYWxvZ1JvbGUgPSAnZGlhbG9nJyB8ICdhbGVydGRpYWxvZyc7XG5cbi8qKiBQb3NzaWJsZSBvdmVycmlkZXMgZm9yIGEgZGlhbG9nJ3MgcG9zaXRpb24uICovXG5leHBvcnQgaW50ZXJmYWNlIERpYWxvZ1Bvc2l0aW9uIHtcbiAgLyoqIE92ZXJyaWRlIGZvciB0aGUgZGlhbG9nJ3MgdG9wIHBvc2l0aW9uLiAqL1xuICB0b3A/OiBzdHJpbmc7XG5cbiAgLyoqIE92ZXJyaWRlIGZvciB0aGUgZGlhbG9nJ3MgYm90dG9tIHBvc2l0aW9uLiAqL1xuICBib3R0b20/OiBzdHJpbmc7XG5cbiAgLyoqIE92ZXJyaWRlIGZvciB0aGUgZGlhbG9nJ3MgbGVmdCBwb3NpdGlvbi4gKi9cbiAgbGVmdD86IHN0cmluZztcblxuICAvKiogT3ZlcnJpZGUgZm9yIHRoZSBkaWFsb2cncyByaWdodCBwb3NpdGlvbi4gKi9cbiAgcmlnaHQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3Igb3BlbmluZyBhIG1vZGFsIGRpYWxvZyB3aXRoIHRoZSBNYXREaWFsb2cgc2VydmljZS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ0NvbmZpZzxEID0gYW55PiB7XG5cbiAgLyoqXG4gICAqIFdoZXJlIHRoZSBhdHRhY2hlZCBjb21wb25lbnQgc2hvdWxkIGxpdmUgaW4gQW5ndWxhcidzICpsb2dpY2FsKiBjb21wb25lbnQgdHJlZS5cbiAgICogVGhpcyBhZmZlY3RzIHdoYXQgaXMgYXZhaWxhYmxlIGZvciBpbmplY3Rpb24gYW5kIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIG9yZGVyIGZvciB0aGVcbiAgICogY29tcG9uZW50IGluc3RhbnRpYXRlZCBpbnNpZGUgb2YgdGhlIGRpYWxvZy4gVGhpcyBkb2VzIG5vdCBhZmZlY3Qgd2hlcmUgdGhlIGRpYWxvZ1xuICAgKiBjb250ZW50IHdpbGwgYmUgcmVuZGVyZWQuXG4gICAqL1xuICB2aWV3Q29udGFpbmVyUmVmPzogVmlld0NvbnRhaW5lclJlZjtcblxuICAvKiogSUQgZm9yIHRoZSBkaWFsb2cuIElmIG9taXR0ZWQsIGEgdW5pcXVlIG9uZSB3aWxsIGJlIGdlbmVyYXRlZC4gKi9cbiAgaWQ/OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBBUklBIHJvbGUgb2YgdGhlIGRpYWxvZyBlbGVtZW50LiAqL1xuICByb2xlPzogRGlhbG9nUm9sZSA9ICdkaWFsb2cnO1xuXG4gIC8qKiBDdXN0b20gY2xhc3MgZm9yIHRoZSBvdmVybGF5IHBhbmUuICovXG4gIHBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXSA9ICcnO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkaWFsb2cgaGFzIGEgYmFja2Ryb3AuICovXG4gIGhhc0JhY2tkcm9wPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIEN1c3RvbSBjbGFzcyBmb3IgdGhlIGJhY2tkcm9wLiAqL1xuICBiYWNrZHJvcENsYXNzPzogc3RyaW5nID0gJyc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgY2FuIHVzZSBlc2NhcGUgb3IgY2xpY2tpbmcgb24gdGhlIGJhY2tkcm9wIHRvIGNsb3NlIHRoZSBtb2RhbC4gKi9cbiAgZGlzYWJsZUNsb3NlPzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaWR0aCBvZiB0aGUgZGlhbG9nLiAqL1xuICB3aWR0aD86IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBIZWlnaHQgb2YgdGhlIGRpYWxvZy4gKi9cbiAgaGVpZ2h0Pzogc3RyaW5nID0gJyc7XG5cbiAgLyoqIE1pbi13aWR0aCBvZiB0aGUgZGlhbG9nLiBJZiBhIG51bWJlciBpcyBwcm92aWRlZCwgYXNzdW1lcyBwaXhlbCB1bml0cy4gKi9cbiAgbWluV2lkdGg/OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgLyoqIE1pbi1oZWlnaHQgb2YgdGhlIGRpYWxvZy4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIGFzc3VtZXMgcGl4ZWwgdW5pdHMuICovXG4gIG1pbkhlaWdodD86IG51bWJlciB8IHN0cmluZztcblxuICAvKiogTWF4LXdpZHRoIG9mIHRoZSBkaWFsb2cuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBhc3N1bWVzIHBpeGVsIHVuaXRzLiBEZWZhdWx0cyB0byA4MHZ3LiAqL1xuICBtYXhXaWR0aD86IG51bWJlciB8IHN0cmluZyA9ICc4MHZ3JztcblxuICAvKiogTWF4LWhlaWdodCBvZiB0aGUgZGlhbG9nLiBJZiBhIG51bWJlciBpcyBwcm92aWRlZCwgYXNzdW1lcyBwaXhlbCB1bml0cy4gKi9cbiAgbWF4SGVpZ2h0PzogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIC8qKiBQb3NpdGlvbiBvdmVycmlkZXMuICovXG4gIHBvc2l0aW9uPzogRGlhbG9nUG9zaXRpb247XG5cbiAgLyoqIERhdGEgYmVpbmcgaW5qZWN0ZWQgaW50byB0aGUgY2hpbGQgY29tcG9uZW50LiAqL1xuICBkYXRhPzogRCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBMYXlvdXQgZGlyZWN0aW9uIGZvciB0aGUgZGlhbG9nJ3MgY29udGVudC4gKi9cbiAgZGlyZWN0aW9uPzogRGlyZWN0aW9uO1xuXG4gIC8qKiBJRCBvZiB0aGUgZWxlbWVudCB0aGF0IGRlc2NyaWJlcyB0aGUgZGlhbG9nLiAqL1xuICBhcmlhRGVzY3JpYmVkQnk/OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogSUQgb2YgdGhlIGVsZW1lbnQgdGhhdCBsYWJlbHMgdGhlIGRpYWxvZy4gKi9cbiAgYXJpYUxhYmVsbGVkQnk/OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogQXJpYSBsYWJlbCB0byBhc3NpZ24gdG8gdGhlIGRpYWxvZyBlbGVtZW50LiAqL1xuICBhcmlhTGFiZWw/OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgZGlhbG9nIHNob3VsZCBmb2N1cyB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQgb24gb3Blbi4gKi9cbiAgYXV0b0ZvY3VzPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRpYWxvZyBzaG91bGQgcmVzdG9yZSBmb2N1cyB0byB0aGVcbiAgICogcHJldmlvdXNseS1mb2N1c2VkIGVsZW1lbnQsIGFmdGVyIGl0J3MgY2xvc2VkLlxuICAgKi9cbiAgcmVzdG9yZUZvY3VzPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIFNjcm9sbCBzdHJhdGVneSB0byBiZSB1c2VkIGZvciB0aGUgZGlhbG9nLiAqL1xuICBzY3JvbGxTdHJhdGVneT86IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkaWFsb2cgc2hvdWxkIGNsb3NlIHdoZW4gdGhlIHVzZXIgZ29lcyBiYWNrd2FyZHMvZm9yd2FyZHMgaW4gaGlzdG9yeS5cbiAgICogTm90ZSB0aGF0IHRoaXMgdXN1YWxseSBkb2Vzbid0IGluY2x1ZGUgY2xpY2tpbmcgb24gbGlua3MgKHVubGVzcyB0aGUgdXNlciBpcyB1c2luZ1xuICAgKiB0aGUgYEhhc2hMb2NhdGlvblN0cmF0ZWd5YCkuXG4gICAqL1xuICBjbG9zZU9uTmF2aWdhdGlvbj86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBBbHRlcm5hdGUgYENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcmAgdG8gdXNlIHdoZW4gcmVzb2x2aW5nIHRoZSBhc3NvY2lhdGVkIGNvbXBvbmVudC4gKi9cbiAgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyPzogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyO1xuXG4gIC8vIFRPRE8oamVsYm91cm4pOiBhZGQgY29uZmlndXJhdGlvbiBmb3IgbGlmZWN5Y2xlIGhvb2tzLCBBUklBIGxhYmVsbGluZy5cbn1cbiJdfQ==