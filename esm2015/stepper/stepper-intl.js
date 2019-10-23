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
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Stepper data that is required for internationalization.
 */
export class MatStepperIntl {
    constructor() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /**
         * Label that is rendered below optional steps.
         */
        this.optionalLabel = 'Optional';
    }
}
MatStepperIntl.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ MatStepperIntl.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatStepperIntl_Factory() { return new MatStepperIntl(); }, token: MatStepperIntl, providedIn: "root" });
if (false) {
    /**
     * Stream that emits whenever the labels here are changed. Use this to notify
     * components if the labels have changed after initialization.
     * @type {?}
     */
    MatStepperIntl.prototype.changes;
    /**
     * Label that is rendered below optional steps.
     * @type {?}
     */
    MatStepperIntl.prototype.optionalLabel;
}
/**
 * \@docs-private
 * @param {?} parentIntl
 * @return {?}
 */
export function MAT_STEPPER_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatStepperIntl();
}
/**
 * \@docs-private
 * @type {?}
 */
export const MAT_STEPPER_INTL_PROVIDER = {
    provide: MatStepperIntl,
    deps: [[new Optional(), new SkipSelf(), MatStepperIntl]],
    useFactory: MAT_STEPPER_INTL_PROVIDER_FACTORY
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1pbnRsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1pbnRsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7O0FBSzdCLE1BQU0sT0FBTyxjQUFjO0lBRDNCOzs7OztRQU1XLFlBQU8sR0FBa0IsSUFBSSxPQUFPLEVBQVEsQ0FBQzs7OztRQUd0RCxrQkFBYSxHQUFXLFVBQVUsQ0FBQztLQUNwQzs7O1lBVkEsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7Ozs7Ozs7O0lBTTlCLGlDQUFzRDs7Ozs7SUFHdEQsdUNBQW1DOzs7Ozs7O0FBS3JDLE1BQU0sVUFBVSxpQ0FBaUMsQ0FBQyxVQUEwQjtJQUMxRSxPQUFPLFVBQVUsSUFBSSxJQUFJLGNBQWMsRUFBRSxDQUFDO0FBQzVDLENBQUM7Ozs7O0FBR0QsTUFBTSxPQUFPLHlCQUF5QixHQUFHO0lBQ3ZDLE9BQU8sRUFBRSxjQUFjO0lBQ3ZCLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxJQUFJLFFBQVEsRUFBRSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3hELFVBQVUsRUFBRSxpQ0FBaUM7Q0FDOUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlLCBPcHRpb25hbCwgU2tpcFNlbGZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuXG4vKiogU3RlcHBlciBkYXRhIHRoYXQgaXMgcmVxdWlyZWQgZm9yIGludGVybmF0aW9uYWxpemF0aW9uLiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0U3RlcHBlckludGwge1xuICAvKipcbiAgICogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIGxhYmVscyBoZXJlIGFyZSBjaGFuZ2VkLiBVc2UgdGhpcyB0byBub3RpZnlcbiAgICogY29tcG9uZW50cyBpZiB0aGUgbGFiZWxzIGhhdmUgY2hhbmdlZCBhZnRlciBpbml0aWFsaXphdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGNoYW5nZXM6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBMYWJlbCB0aGF0IGlzIHJlbmRlcmVkIGJlbG93IG9wdGlvbmFsIHN0ZXBzLiAqL1xuICBvcHRpb25hbExhYmVsOiBzdHJpbmcgPSAnT3B0aW9uYWwnO1xufVxuXG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1NURVBQRVJfSU5UTF9QUk9WSURFUl9GQUNUT1JZKHBhcmVudEludGw6IE1hdFN0ZXBwZXJJbnRsKSB7XG4gIHJldHVybiBwYXJlbnRJbnRsIHx8IG5ldyBNYXRTdGVwcGVySW50bCgpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TVEVQUEVSX0lOVExfUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IE1hdFN0ZXBwZXJJbnRsLFxuICBkZXBzOiBbW25ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKSwgTWF0U3RlcHBlckludGxdXSxcbiAgdXNlRmFjdG9yeTogTUFUX1NURVBQRVJfSU5UTF9QUk9WSURFUl9GQUNUT1JZXG59O1xuIl19