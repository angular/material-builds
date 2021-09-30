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
export class MatStepperIntl {
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
}
MatStepperIntl.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatStepperIntl_Factory() { return new MatStepperIntl(); }, token: MatStepperIntl, providedIn: "root" });
MatStepperIntl.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1pbnRsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1pbnRsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQUc3Qiw4REFBOEQ7QUFFOUQsTUFBTSxPQUFPLGNBQWM7SUFEM0I7UUFFRTs7O1dBR0c7UUFDTSxZQUFPLEdBQWtCLElBQUksT0FBTyxFQUFRLENBQUM7UUFFdEQsbURBQW1EO1FBQ25ELGtCQUFhLEdBQVcsVUFBVSxDQUFDO1FBRW5DLDBFQUEwRTtRQUMxRSxtQkFBYyxHQUFXLFdBQVcsQ0FBQztRQUVyQyx5RUFBeUU7UUFDekUsa0JBQWEsR0FBVyxVQUFVLENBQUM7S0FDcEM7Ozs7WUFoQkEsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7QUFtQmhDLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsaUNBQWlDLENBQUMsVUFBMEI7SUFDMUUsT0FBTyxVQUFVLElBQUksSUFBSSxjQUFjLEVBQUUsQ0FBQztBQUM1QyxDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFHO0lBQ3ZDLE9BQU8sRUFBRSxjQUFjO0lBQ3ZCLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxJQUFJLFFBQVEsRUFBRSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3hELFVBQVUsRUFBRSxpQ0FBaUM7Q0FDOUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGUsIE9wdGlvbmFsLCBTa2lwU2VsZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG5cbi8qKiBTdGVwcGVyIGRhdGEgdGhhdCBpcyByZXF1aXJlZCBmb3IgaW50ZXJuYXRpb25hbGl6YXRpb24uICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwcGVySW50bCB7XG4gIC8qKlxuICAgKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgbGFiZWxzIGhlcmUgYXJlIGNoYW5nZWQuIFVzZSB0aGlzIHRvIG5vdGlmeVxuICAgKiBjb21wb25lbnRzIGlmIHRoZSBsYWJlbHMgaGF2ZSBjaGFuZ2VkIGFmdGVyIGluaXRpYWxpemF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgY2hhbmdlczogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIExhYmVsIHRoYXQgaXMgcmVuZGVyZWQgYmVsb3cgb3B0aW9uYWwgc3RlcHMuICovXG4gIG9wdGlvbmFsTGFiZWw6IHN0cmluZyA9ICdPcHRpb25hbCc7XG5cbiAgLyoqIExhYmVsIHRoYXQgaXMgdXNlZCB0byBpbmRpY2F0ZSBzdGVwIGFzIGNvbXBsZXRlZCB0byBzY3JlZW4gcmVhZGVycy4gKi9cbiAgY29tcGxldGVkTGFiZWw6IHN0cmluZyA9ICdDb21wbGV0ZWQnO1xuXG4gIC8qKiBMYWJlbCB0aGF0IGlzIHVzZWQgdG8gaW5kaWNhdGUgc3RlcCBhcyBlZGl0YWJsZSB0byBzY3JlZW4gcmVhZGVycy4gKi9cbiAgZWRpdGFibGVMYWJlbDogc3RyaW5nID0gJ0VkaXRhYmxlJztcbn1cblxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9TVEVQUEVSX0lOVExfUFJPVklERVJfRkFDVE9SWShwYXJlbnRJbnRsOiBNYXRTdGVwcGVySW50bCkge1xuICByZXR1cm4gcGFyZW50SW50bCB8fCBuZXcgTWF0U3RlcHBlckludGwoKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfU1RFUFBFUl9JTlRMX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNYXRTdGVwcGVySW50bCxcbiAgZGVwczogW1tuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE1hdFN0ZXBwZXJJbnRsXV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9TVEVQUEVSX0lOVExfUFJPVklERVJfRkFDVE9SWVxufTtcbiJdfQ==