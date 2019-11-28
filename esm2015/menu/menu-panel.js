/**
 * @fileoverview added by tsickle
 * Generated from: src/material/menu/menu-panel.ts
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
 * Injection token used to provide the parent menu to menu-specific components.
 * \@docs-private
 * @type {?}
 */
export const MAT_MENU_PANEL = new InjectionToken('MAT_MENU_PANEL');
/**
 * Interface for a custom menu panel that can be used with `matMenuTriggerFor`.
 * \@docs-private
 * @record
 * @template T
 */
export function MatMenuPanel() { }
if (false) {
    /** @type {?} */
    MatMenuPanel.prototype.xPosition;
    /** @type {?} */
    MatMenuPanel.prototype.yPosition;
    /** @type {?} */
    MatMenuPanel.prototype.overlapTrigger;
    /** @type {?} */
    MatMenuPanel.prototype.templateRef;
    /** @type {?} */
    MatMenuPanel.prototype.close;
    /** @type {?|undefined} */
    MatMenuPanel.prototype.parentMenu;
    /** @type {?|undefined} */
    MatMenuPanel.prototype.direction;
    /** @type {?} */
    MatMenuPanel.prototype.focusFirstItem;
    /** @type {?} */
    MatMenuPanel.prototype.resetActiveItem;
    /** @type {?|undefined} */
    MatMenuPanel.prototype.setPositionClasses;
    /** @type {?|undefined} */
    MatMenuPanel.prototype.lazyContent;
    /** @type {?|undefined} */
    MatMenuPanel.prototype.backdropClass;
    /** @type {?|undefined} */
    MatMenuPanel.prototype.hasBackdrop;
    /** @type {?|undefined} */
    MatMenuPanel.prototype.panelId;
    /**
     * @deprecated To be removed.
     * \@breaking-change 8.0.0
     * @type {?|undefined}
     */
    MatMenuPanel.prototype.addItem;
    /**
     * @deprecated To be removed.
     * \@breaking-change 8.0.0
     * @type {?|undefined}
     */
    MatMenuPanel.prototype.removeItem;
    /**
     * @param {?} depth
     * @return {?}
     */
    MatMenuPanel.prototype.setElevation = function (depth) { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1wYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9tZW51L21lbnUtcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUE0QixjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7Ozs7OztBQVV4RSxNQUFNLE9BQU8sY0FBYyxHQUFHLElBQUksY0FBYyxDQUFlLGdCQUFnQixDQUFDOzs7Ozs7O0FBTWhGLGtDQTRCQzs7O0lBM0JDLGlDQUF5Qjs7SUFDekIsaUNBQXlCOztJQUN6QixzQ0FBd0I7O0lBQ3hCLG1DQUE4Qjs7SUFDOUIsNkJBQXdEOztJQUN4RCxrQ0FBc0M7O0lBQ3RDLGlDQUFzQjs7SUFDdEIsc0NBQStDOztJQUMvQyx1Q0FBNEI7O0lBQzVCLDBDQUFrRTs7SUFFbEUsbUNBQTZCOztJQUM3QixxQ0FBdUI7O0lBQ3ZCLG1DQUFzQjs7SUFDdEIsK0JBQTBCOzs7Ozs7SUFNMUIsK0JBQTRCOzs7Ozs7SUFNNUIsa0NBQStCOzs7OztJQWhCL0IsMkRBQW1DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RXZlbnRFbWl0dGVyLCBUZW1wbGF0ZVJlZiwgSW5qZWN0aW9uVG9rZW59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNZW51UG9zaXRpb25YLCBNZW51UG9zaXRpb25ZfSBmcm9tICcuL21lbnUtcG9zaXRpb25zJztcbmltcG9ydCB7RGlyZWN0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0ZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge01hdE1lbnVDb250ZW50fSBmcm9tICcuL21lbnUtY29udGVudCc7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHVzZWQgdG8gcHJvdmlkZSB0aGUgcGFyZW50IG1lbnUgdG8gbWVudS1zcGVjaWZpYyBjb21wb25lbnRzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX01FTlVfUEFORUwgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0TWVudVBhbmVsPignTUFUX01FTlVfUEFORUwnKTtcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGEgY3VzdG9tIG1lbnUgcGFuZWwgdGhhdCBjYW4gYmUgdXNlZCB3aXRoIGBtYXRNZW51VHJpZ2dlckZvcmAuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0TWVudVBhbmVsPFQgPSBhbnk+IHtcbiAgeFBvc2l0aW9uOiBNZW51UG9zaXRpb25YO1xuICB5UG9zaXRpb246IE1lbnVQb3NpdGlvblk7XG4gIG92ZXJsYXBUcmlnZ2VyOiBib29sZWFuO1xuICB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcbiAgY2xvc2U6IEV2ZW50RW1pdHRlcjx2b2lkIHwgJ2NsaWNrJyB8ICdrZXlkb3duJyB8ICd0YWInPjtcbiAgcGFyZW50TWVudT86IE1hdE1lbnVQYW5lbCB8IHVuZGVmaW5lZDtcbiAgZGlyZWN0aW9uPzogRGlyZWN0aW9uO1xuICBmb2N1c0ZpcnN0SXRlbTogKG9yaWdpbj86IEZvY3VzT3JpZ2luKSA9PiB2b2lkO1xuICByZXNldEFjdGl2ZUl0ZW06ICgpID0+IHZvaWQ7XG4gIHNldFBvc2l0aW9uQ2xhc3Nlcz86ICh4OiBNZW51UG9zaXRpb25YLCB5OiBNZW51UG9zaXRpb25ZKSA9PiB2b2lkO1xuICBzZXRFbGV2YXRpb24/KGRlcHRoOiBudW1iZXIpOiB2b2lkO1xuICBsYXp5Q29udGVudD86IE1hdE1lbnVDb250ZW50O1xuICBiYWNrZHJvcENsYXNzPzogc3RyaW5nO1xuICBoYXNCYWNrZHJvcD86IGJvb2xlYW47XG4gIHJlYWRvbmx5IHBhbmVsSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFRvIGJlIHJlbW92ZWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIGFkZEl0ZW0/OiAoaXRlbTogVCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVG8gYmUgcmVtb3ZlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgcmVtb3ZlSXRlbT86IChpdGVtOiBUKSA9PiB2b2lkO1xufVxuIl19