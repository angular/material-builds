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
import { Injectable, SkipSelf, Optional } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * To modify the labels and text displayed, create a new instance of MatSortHeaderIntl and
 * include it in a custom provider.
 */
export class MatSortHeaderIntl {
    constructor() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /**
         * ARIA label for the sorting button.
         */
        this.sortButtonLabel = (/**
         * @param {?} id
         * @return {?}
         */
        (id) => {
            return `Change sorting for ${id}`;
        });
    }
}
MatSortHeaderIntl.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ MatSortHeaderIntl.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatSortHeaderIntl_Factory() { return new MatSortHeaderIntl(); }, token: MatSortHeaderIntl, providedIn: "root" });
if (false) {
    /**
     * Stream that emits whenever the labels here are changed. Use this to notify
     * components if the labels have changed after initialization.
     * @type {?}
     */
    MatSortHeaderIntl.prototype.changes;
    /**
     * ARIA label for the sorting button.
     * @type {?}
     */
    MatSortHeaderIntl.prototype.sortButtonLabel;
}
/**
 * \@docs-private
 * @param {?} parentIntl
 * @return {?}
 */
export function MAT_SORT_HEADER_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatSortHeaderIntl();
}
/**
 * \@docs-private
 * @type {?}
 */
export const MAT_SORT_HEADER_INTL_PROVIDER = {
    // If there is already an MatSortHeaderIntl available, use that. Otherwise, provide a new one.
    provide: MatSortHeaderIntl,
    deps: [[new Optional(), new SkipSelf(), MatSortHeaderIntl]],
    useFactory: MAT_SORT_HEADER_INTL_PROVIDER_FACTORY
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oZWFkZXItaW50bC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3NvcnQtaGVhZGVyLWludGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7Ozs7O0FBTzdCLE1BQU0sT0FBTyxpQkFBaUI7SUFEOUI7Ozs7O1FBTVcsWUFBTyxHQUFrQixJQUFJLE9BQU8sRUFBUSxDQUFDOzs7O1FBR3RELG9CQUFlOzs7O1FBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRTtZQUMvQixPQUFPLHNCQUFzQixFQUFFLEVBQUUsQ0FBQztRQUNwQyxDQUFDLEVBQUE7S0FDRjs7O1lBWkEsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7Ozs7Ozs7O0lBTTlCLG9DQUFzRDs7Ozs7SUFHdEQsNENBRUM7Ozs7Ozs7QUFHSCxNQUFNLFVBQVUscUNBQXFDLENBQUMsVUFBNkI7SUFDakYsT0FBTyxVQUFVLElBQUksSUFBSSxpQkFBaUIsRUFBRSxDQUFDO0FBQy9DLENBQUM7Ozs7O0FBR0QsTUFBTSxPQUFPLDZCQUE2QixHQUFHOztJQUUzQyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxJQUFJLFFBQVEsRUFBRSxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDM0QsVUFBVSxFQUFFLHFDQUFxQztDQUNsRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGUsIFNraXBTZWxmLCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqIFRvIG1vZGlmeSB0aGUgbGFiZWxzIGFuZCB0ZXh0IGRpc3BsYXllZCwgY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIE1hdFNvcnRIZWFkZXJJbnRsIGFuZFxuICogaW5jbHVkZSBpdCBpbiBhIGN1c3RvbSBwcm92aWRlci5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0U29ydEhlYWRlckludGwge1xuICAvKipcbiAgICogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIGxhYmVscyBoZXJlIGFyZSBjaGFuZ2VkLiBVc2UgdGhpcyB0byBub3RpZnlcbiAgICogY29tcG9uZW50cyBpZiB0aGUgbGFiZWxzIGhhdmUgY2hhbmdlZCBhZnRlciBpbml0aWFsaXphdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGNoYW5nZXM6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBBUklBIGxhYmVsIGZvciB0aGUgc29ydGluZyBidXR0b24uICovXG4gIHNvcnRCdXR0b25MYWJlbCA9IChpZDogc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIGBDaGFuZ2Ugc29ydGluZyBmb3IgJHtpZH1gO1xuICB9XG59XG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9TT1JUX0hFQURFUl9JTlRMX1BST1ZJREVSX0ZBQ1RPUlkocGFyZW50SW50bDogTWF0U29ydEhlYWRlckludGwpIHtcbiAgcmV0dXJuIHBhcmVudEludGwgfHwgbmV3IE1hdFNvcnRIZWFkZXJJbnRsKCk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX1NPUlRfSEVBREVSX0lOVExfUFJPVklERVIgPSB7XG4gIC8vIElmIHRoZXJlIGlzIGFscmVhZHkgYW4gTWF0U29ydEhlYWRlckludGwgYXZhaWxhYmxlLCB1c2UgdGhhdC4gT3RoZXJ3aXNlLCBwcm92aWRlIGEgbmV3IG9uZS5cbiAgcHJvdmlkZTogTWF0U29ydEhlYWRlckludGwsXG4gIGRlcHM6IFtbbmV3IE9wdGlvbmFsKCksIG5ldyBTa2lwU2VsZigpLCBNYXRTb3J0SGVhZGVySW50bF1dLFxuICB1c2VGYWN0b3J5OiBNQVRfU09SVF9IRUFERVJfSU5UTF9QUk9WSURFUl9GQUNUT1JZXG59O1xuXG4iXX0=