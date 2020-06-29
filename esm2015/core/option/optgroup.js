/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, InjectionToken, Input, ViewEncapsulation } from '@angular/core';
import { mixinDisabled } from '../common-behaviors/disabled';
// Boilerplate for applying mixins to MatOptgroup.
/** @docs-private */
class MatOptgroupBase {
}
const _MatOptgroupMixinBase = mixinDisabled(MatOptgroupBase);
// Counter for unique group ids.
let _uniqueOptgroupIdCounter = 0;
/**
 * Injection token that can be used to reference instances of `MatOptgroup`. It serves as
 * alternative token to the actual `MatOptgroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const MAT_OPTGROUP = new InjectionToken('MatOptgroup');
/**
 * Component that is used to group instances of `mat-option`.
 */
let MatOptgroup = /** @class */ (() => {
    class MatOptgroup extends _MatOptgroupMixinBase {
        constructor() {
            super(...arguments);
            /** Unique id for the underlying label. */
            this._labelId = `mat-optgroup-label-${_uniqueOptgroupIdCounter++}`;
        }
    }
    MatOptgroup.decorators = [
        { type: Component, args: [{
                    selector: 'mat-optgroup',
                    exportAs: 'matOptgroup',
                    template: "<label class=\"mat-optgroup-label\" [id]=\"_labelId\">{{ label }} <ng-content></ng-content></label>\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: ['disabled'],
                    host: {
                        'class': 'mat-optgroup',
                        'role': 'group',
                        '[class.mat-optgroup-disabled]': 'disabled',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[attr.aria-labelledby]': '_labelId',
                    },
                    providers: [{ provide: MAT_OPTGROUP, useExisting: MatOptgroup }],
                    styles: [".mat-optgroup-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.mat-optgroup-label[disabled]{cursor:default}[dir=rtl] .mat-optgroup-label{text-align:right}.mat-optgroup-label .mat-icon{margin-right:16px;vertical-align:middle}.mat-optgroup-label .mat-icon svg{vertical-align:top}[dir=rtl] .mat-optgroup-label .mat-icon{margin-left:16px;margin-right:0}\n"]
                },] }
    ];
    MatOptgroup.propDecorators = {
        label: [{ type: Input }]
    };
    return MatOptgroup;
})();
export { MatOptgroup };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0Z3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9vcHRpb24vb3B0Z3JvdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsY0FBYyxFQUNkLEtBQUssRUFDTCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUE2QixhQUFhLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUd2RixrREFBa0Q7QUFDbEQsb0JBQW9CO0FBQ3BCLE1BQU0sZUFBZTtDQUFJO0FBQ3pCLE1BQU0scUJBQXFCLEdBQ3ZCLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUVuQyxnQ0FBZ0M7QUFDaEMsSUFBSSx3QkFBd0IsR0FBRyxDQUFDLENBQUM7QUFFakM7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxJQUFJLGNBQWMsQ0FBYyxhQUFhLENBQUMsQ0FBQztBQUUzRTs7R0FFRztBQUNIO0lBQUEsTUFpQmEsV0FBWSxTQUFRLHFCQUFxQjtRQWpCdEQ7O1lBcUJFLDBDQUEwQztZQUMxQyxhQUFRLEdBQVcsc0JBQXNCLHdCQUF3QixFQUFFLEVBQUUsQ0FBQztRQUd4RSxDQUFDOzs7Z0JBekJBLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLGdMQUE0QjtvQkFDNUIsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUM7b0JBRXBCLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsY0FBYzt3QkFDdkIsTUFBTSxFQUFFLE9BQU87d0JBQ2YsK0JBQStCLEVBQUUsVUFBVTt3QkFDM0Msc0JBQXNCLEVBQUUscUJBQXFCO3dCQUM3Qyx3QkFBd0IsRUFBRSxVQUFVO3FCQUNyQztvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBQyxDQUFDOztpQkFDL0Q7Ozt3QkFHRSxLQUFLOztJQU1SLGtCQUFDO0tBQUE7U0FSWSxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuRGlzYWJsZSwgQ2FuRGlzYWJsZUN0b3IsIG1peGluRGlzYWJsZWR9IGZyb20gJy4uL2NvbW1vbi1iZWhhdmlvcnMvZGlzYWJsZWQnO1xuXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0T3B0Z3JvdXAuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0T3B0Z3JvdXBCYXNlIHsgfVxuY29uc3QgX01hdE9wdGdyb3VwTWl4aW5CYXNlOiBDYW5EaXNhYmxlQ3RvciAmIHR5cGVvZiBNYXRPcHRncm91cEJhc2UgPVxuICAgIG1peGluRGlzYWJsZWQoTWF0T3B0Z3JvdXBCYXNlKTtcblxuLy8gQ291bnRlciBmb3IgdW5pcXVlIGdyb3VwIGlkcy5cbmxldCBfdW5pcXVlT3B0Z3JvdXBJZENvdW50ZXIgPSAwO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYE1hdE9wdGdyb3VwYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRPcHRncm91cGAgY2xhc3Mgd2hpY2ggY291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBjb21wb25lbnQgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfT1BUR1JPVVAgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0T3B0Z3JvdXA+KCdNYXRPcHRncm91cCcpO1xuXG4vKipcbiAqIENvbXBvbmVudCB0aGF0IGlzIHVzZWQgdG8gZ3JvdXAgaW5zdGFuY2VzIG9mIGBtYXQtb3B0aW9uYC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LW9wdGdyb3VwJyxcbiAgZXhwb3J0QXM6ICdtYXRPcHRncm91cCcsXG4gIHRlbXBsYXRlVXJsOiAnb3B0Z3JvdXAuaHRtbCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnXSxcbiAgc3R5bGVVcmxzOiBbJ29wdGdyb3VwLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1vcHRncm91cCcsXG4gICAgJ3JvbGUnOiAnZ3JvdXAnLFxuICAgICdbY2xhc3MubWF0LW9wdGdyb3VwLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19sYWJlbElkJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9PUFRHUk9VUCwgdXNlRXhpc3Rpbmc6IE1hdE9wdGdyb3VwfV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdE9wdGdyb3VwIGV4dGVuZHMgX01hdE9wdGdyb3VwTWl4aW5CYXNlIGltcGxlbWVudHMgQ2FuRGlzYWJsZSB7XG4gIC8qKiBMYWJlbCBmb3IgdGhlIG9wdGlvbiBncm91cC4gKi9cbiAgQElucHV0KCkgbGFiZWw6IHN0cmluZztcblxuICAvKiogVW5pcXVlIGlkIGZvciB0aGUgdW5kZXJseWluZyBsYWJlbC4gKi9cbiAgX2xhYmVsSWQ6IHN0cmluZyA9IGBtYXQtb3B0Z3JvdXAtbGFiZWwtJHtfdW5pcXVlT3B0Z3JvdXBJZENvdW50ZXIrK31gO1xuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19