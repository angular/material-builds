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
     * The view container to place the overlay for the snack bar into.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQW1CLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFLL0QsTUFBTSxPQUFPLGtCQUFrQixHQUFHLElBQUksY0FBYyxDQUFNLGlCQUFpQixDQUFDOzs7OztBQVc1RSxNQUFNLE9BQU8saUJBQWlCO0lBQTlCOzs7O1FBRUUsZUFBVSxHQUF3QixXQUFXLENBQUM7Ozs7O1FBTTlDLHdCQUFtQixHQUFZLEVBQUUsQ0FBQzs7OztRQU1sQyxhQUFRLEdBQVksQ0FBQyxDQUFDOzs7O1FBU3RCLFNBQUksR0FBYyxJQUFJLENBQUM7Ozs7UUFHdkIsdUJBQWtCLEdBQW1DLFFBQVEsQ0FBQzs7OztRQUc5RCxxQkFBZ0IsR0FBaUMsUUFBUSxDQUFDO0lBQzVELENBQUM7Q0FBQTs7Ozs7O0lBNUJDLHVDQUE4Qzs7Ozs7O0lBTTlDLGdEQUFrQzs7Ozs7SUFHbEMsNkNBQW9DOzs7OztJQUdwQyxxQ0FBc0I7Ozs7O0lBR3RCLHVDQUErQjs7Ozs7SUFHL0Isc0NBQXNCOzs7OztJQUd0QixpQ0FBdUI7Ozs7O0lBR3ZCLCtDQUE4RDs7Ozs7SUFHOUQsNkNBQTBEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Vmlld0NvbnRhaW5lclJlZiwgSW5qZWN0aW9uVG9rZW59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBcmlhTGl2ZVBvbGl0ZW5lc3N9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBhY2Nlc3MgdGhlIGRhdGEgdGhhdCB3YXMgcGFzc2VkIGluIHRvIGEgc25hY2sgYmFyLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TTkFDS19CQVJfREFUQSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxhbnk+KCdNYXRTbmFja0JhckRhdGEnKTtcblxuLyoqIFBvc3NpYmxlIHZhbHVlcyBmb3IgaG9yaXpvbnRhbFBvc2l0aW9uIG9uIE1hdFNuYWNrQmFyQ29uZmlnLiAqL1xuZXhwb3J0IHR5cGUgTWF0U25hY2tCYXJIb3Jpem9udGFsUG9zaXRpb24gPSAnc3RhcnQnIHwgJ2NlbnRlcicgfCAnZW5kJyB8ICdsZWZ0JyB8ICdyaWdodCc7XG5cbi8qKiBQb3NzaWJsZSB2YWx1ZXMgZm9yIHZlcnRpY2FsUG9zaXRpb24gb24gTWF0U25hY2tCYXJDb25maWcuICovXG5leHBvcnQgdHlwZSBNYXRTbmFja0JhclZlcnRpY2FsUG9zaXRpb24gPSAndG9wJyB8ICdib3R0b20nO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gdXNlZCB3aGVuIG9wZW5pbmcgYSBzbmFjay1iYXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTbmFja0JhckNvbmZpZzxEID0gYW55PiB7XG4gIC8qKiBUaGUgcG9saXRlbmVzcyBsZXZlbCBmb3IgdGhlIE1hdEFyaWFMaXZlQW5ub3VuY2VyIGFubm91bmNlbWVudC4gKi9cbiAgcG9saXRlbmVzcz86IEFyaWFMaXZlUG9saXRlbmVzcyA9ICdhc3NlcnRpdmUnO1xuXG4gIC8qKlxuICAgKiBNZXNzYWdlIHRvIGJlIGFubm91bmNlZCBieSB0aGUgTGl2ZUFubm91bmNlci4gV2hlbiBvcGVuaW5nIGEgc25hY2tiYXIgd2l0aG91dCBhIGN1c3RvbVxuICAgKiBjb21wb25lbnQgb3IgdGVtcGxhdGUsIHRoZSBhbm5vdW5jZW1lbnQgbWVzc2FnZSB3aWxsIGRlZmF1bHQgdG8gdGhlIHNwZWNpZmllZCBtZXNzYWdlLlxuICAgKi9cbiAgYW5ub3VuY2VtZW50TWVzc2FnZT86IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBUaGUgdmlldyBjb250YWluZXIgdG8gcGxhY2UgdGhlIG92ZXJsYXkgZm9yIHRoZSBzbmFjayBiYXIgaW50by4gKi9cbiAgdmlld0NvbnRhaW5lclJlZj86IFZpZXdDb250YWluZXJSZWY7XG5cbiAgLyoqIFRoZSBsZW5ndGggb2YgdGltZSBpbiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgYXV0b21hdGljYWxseSBkaXNtaXNzaW5nIHRoZSBzbmFjayBiYXIuICovXG4gIGR1cmF0aW9uPzogbnVtYmVyID0gMDtcblxuICAvKiogRXh0cmEgQ1NTIGNsYXNzZXMgdG8gYmUgYWRkZWQgdG8gdGhlIHNuYWNrIGJhciBjb250YWluZXIuICovXG4gIHBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKiogVGV4dCBsYXlvdXQgZGlyZWN0aW9uIGZvciB0aGUgc25hY2sgYmFyLiAqL1xuICBkaXJlY3Rpb24/OiBEaXJlY3Rpb247XG5cbiAgLyoqIERhdGEgYmVpbmcgaW5qZWN0ZWQgaW50byB0aGUgY2hpbGQgY29tcG9uZW50LiAqL1xuICBkYXRhPzogRCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBUaGUgaG9yaXpvbnRhbCBwb3NpdGlvbiB0byBwbGFjZSB0aGUgc25hY2sgYmFyLiAqL1xuICBob3Jpem9udGFsUG9zaXRpb24/OiBNYXRTbmFja0Jhckhvcml6b250YWxQb3NpdGlvbiA9ICdjZW50ZXInO1xuXG4gIC8qKiBUaGUgdmVydGljYWwgcG9zaXRpb24gdG8gcGxhY2UgdGhlIHNuYWNrIGJhci4gKi9cbiAgdmVydGljYWxQb3NpdGlvbj86IE1hdFNuYWNrQmFyVmVydGljYWxQb3NpdGlvbiA9ICdib3R0b20nO1xufVxuIl19