import { __decorate } from "tslib";
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
/** Stepper data that is required for internationalization. */
let MatStepperIntl = /** @class */ (() => {
    let MatStepperIntl = class MatStepperIntl {
        constructor() {
            /**
             * Stream that emits whenever the labels here are changed. Use this to notify
             * components if the labels have changed after initialization.
             */
            this.changes = new Subject();
            /** Label that is rendered below optional steps. */
            this.optionalLabel = 'Optional';
        }
    };
    MatStepperIntl.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatStepperIntl_Factory() { return new MatStepperIntl(); }, token: MatStepperIntl, providedIn: "root" });
    MatStepperIntl = __decorate([
        Injectable({ providedIn: 'root' })
    ], MatStepperIntl);
    return MatStepperIntl;
})();
export { MatStepperIntl };
/** @docs-private */
export function MAT_STEPPER_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatStepperIntl();
}
/** @docs-private */
export const MAT_STEPPER_INTL_PROVIDER = {
    provide: MatStepperIntl,
    deps: [[new Optional(), new SkipSelf(), MatStepperIntl]],
    useFactory: MAT_STEPPER_INTL_PROVIDER_FACTORY
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1pbnRsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1pbnRsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFHN0IsOERBQThEO0FBRTlEO0lBQUEsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBYztRQUEzQjtZQUNFOzs7ZUFHRztZQUNNLFlBQU8sR0FBa0IsSUFBSSxPQUFPLEVBQVEsQ0FBQztZQUV0RCxtREFBbUQ7WUFDbkQsa0JBQWEsR0FBVyxVQUFVLENBQUM7U0FDcEM7S0FBQSxDQUFBOztJQVRZLGNBQWM7UUFEMUIsVUFBVSxDQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyxDQUFDO09BQ3BCLGNBQWMsQ0FTMUI7eUJBdkJEO0tBdUJDO1NBVFksY0FBYztBQVkzQixvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLGlDQUFpQyxDQUFDLFVBQTBCO0lBQzFFLE9BQU8sVUFBVSxJQUFJLElBQUksY0FBYyxFQUFFLENBQUM7QUFDNUMsQ0FBQztBQUVELG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSx5QkFBeUIsR0FBRztJQUN2QyxPQUFPLEVBQUUsY0FBYztJQUN2QixJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFLEVBQUUsSUFBSSxRQUFRLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUN4RCxVQUFVLEVBQUUsaUNBQWlDO0NBQzlDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlLCBPcHRpb25hbCwgU2tpcFNlbGZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuXG4vKiogU3RlcHBlciBkYXRhIHRoYXQgaXMgcmVxdWlyZWQgZm9yIGludGVybmF0aW9uYWxpemF0aW9uLiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0U3RlcHBlckludGwge1xuICAvKipcbiAgICogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIGxhYmVscyBoZXJlIGFyZSBjaGFuZ2VkLiBVc2UgdGhpcyB0byBub3RpZnlcbiAgICogY29tcG9uZW50cyBpZiB0aGUgbGFiZWxzIGhhdmUgY2hhbmdlZCBhZnRlciBpbml0aWFsaXphdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGNoYW5nZXM6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBMYWJlbCB0aGF0IGlzIHJlbmRlcmVkIGJlbG93IG9wdGlvbmFsIHN0ZXBzLiAqL1xuICBvcHRpb25hbExhYmVsOiBzdHJpbmcgPSAnT3B0aW9uYWwnO1xufVxuXG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1NURVBQRVJfSU5UTF9QUk9WSURFUl9GQUNUT1JZKHBhcmVudEludGw6IE1hdFN0ZXBwZXJJbnRsKSB7XG4gIHJldHVybiBwYXJlbnRJbnRsIHx8IG5ldyBNYXRTdGVwcGVySW50bCgpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TVEVQUEVSX0lOVExfUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IE1hdFN0ZXBwZXJJbnRsLFxuICBkZXBzOiBbW25ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKSwgTWF0U3RlcHBlckludGxdXSxcbiAgdXNlRmFjdG9yeTogTUFUX1NURVBQRVJfSU5UTF9QUk9WSURFUl9GQUNUT1JZXG59O1xuIl19