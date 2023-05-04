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
class MatStepperIntl {
    constructor() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /** Label that is rendered below optional steps. */
        this.optionalLabel = 'Optional';
        /** Label that is used to indicate step as completed to screen readers. */
        this.completedLabel = 'Completed';
        /** Label that is used to indicate step as editable to screen readers. */
        this.editableLabel = 'Editable';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatStepperIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatStepperIntl, providedIn: 'root' }); }
}
export { MatStepperIntl };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatStepperIntl, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/** @docs-private */
export function MAT_STEPPER_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatStepperIntl();
}
/** @docs-private */
export const MAT_STEPPER_INTL_PROVIDER = {
    provide: MatStepperIntl,
    deps: [[new Optional(), new SkipSelf(), MatStepperIntl]],
    useFactory: MAT_STEPPER_INTL_PROVIDER_FACTORY,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1pbnRsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1pbnRsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQUU3Qiw4REFBOEQ7QUFDOUQsTUFDYSxjQUFjO0lBRDNCO1FBRUU7OztXQUdHO1FBQ00sWUFBTyxHQUFrQixJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRXRELG1EQUFtRDtRQUNuRCxrQkFBYSxHQUFXLFVBQVUsQ0FBQztRQUVuQywwRUFBMEU7UUFDMUUsbUJBQWMsR0FBVyxXQUFXLENBQUM7UUFFckMseUVBQXlFO1FBQ3pFLGtCQUFhLEdBQVcsVUFBVSxDQUFDO0tBQ3BDOzhHQWZZLGNBQWM7a0hBQWQsY0FBYyxjQURGLE1BQU07O1NBQ2xCLGNBQWM7MkZBQWQsY0FBYztrQkFEMUIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7O0FBa0JoQyxvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLGlDQUFpQyxDQUFDLFVBQTBCO0lBQzFFLE9BQU8sVUFBVSxJQUFJLElBQUksY0FBYyxFQUFFLENBQUM7QUFDNUMsQ0FBQztBQUVELG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSx5QkFBeUIsR0FBRztJQUN2QyxPQUFPLEVBQUUsY0FBYztJQUN2QixJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFLEVBQUUsSUFBSSxRQUFRLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUN4RCxVQUFVLEVBQUUsaUNBQWlDO0NBQzlDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlLCBPcHRpb25hbCwgU2tpcFNlbGZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuLyoqIFN0ZXBwZXIgZGF0YSB0aGF0IGlzIHJlcXVpcmVkIGZvciBpbnRlcm5hdGlvbmFsaXphdGlvbi4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1hdFN0ZXBwZXJJbnRsIHtcbiAgLyoqXG4gICAqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSBsYWJlbHMgaGVyZSBhcmUgY2hhbmdlZC4gVXNlIHRoaXMgdG8gbm90aWZ5XG4gICAqIGNvbXBvbmVudHMgaWYgdGhlIGxhYmVscyBoYXZlIGNoYW5nZWQgYWZ0ZXIgaW5pdGlhbGl6YXRpb24uXG4gICAqL1xuICByZWFkb25seSBjaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogTGFiZWwgdGhhdCBpcyByZW5kZXJlZCBiZWxvdyBvcHRpb25hbCBzdGVwcy4gKi9cbiAgb3B0aW9uYWxMYWJlbDogc3RyaW5nID0gJ09wdGlvbmFsJztcblxuICAvKiogTGFiZWwgdGhhdCBpcyB1c2VkIHRvIGluZGljYXRlIHN0ZXAgYXMgY29tcGxldGVkIHRvIHNjcmVlbiByZWFkZXJzLiAqL1xuICBjb21wbGV0ZWRMYWJlbDogc3RyaW5nID0gJ0NvbXBsZXRlZCc7XG5cbiAgLyoqIExhYmVsIHRoYXQgaXMgdXNlZCB0byBpbmRpY2F0ZSBzdGVwIGFzIGVkaXRhYmxlIHRvIHNjcmVlbiByZWFkZXJzLiAqL1xuICBlZGl0YWJsZUxhYmVsOiBzdHJpbmcgPSAnRWRpdGFibGUnO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9TVEVQUEVSX0lOVExfUFJPVklERVJfRkFDVE9SWShwYXJlbnRJbnRsOiBNYXRTdGVwcGVySW50bCkge1xuICByZXR1cm4gcGFyZW50SW50bCB8fCBuZXcgTWF0U3RlcHBlckludGwoKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfU1RFUFBFUl9JTlRMX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNYXRTdGVwcGVySW50bCxcbiAgZGVwczogW1tuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE1hdFN0ZXBwZXJJbnRsXV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9TVEVQUEVSX0lOVExfUFJPVklERVJfRkFDVE9SWSxcbn07XG4iXX0=