/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, InjectionToken, Input, ViewEncapsulation, Directive } from '@angular/core';
import { mixinDisabled } from '../common-behaviors/disabled';
// Boilerplate for applying mixins to MatOptgroup.
/** @docs-private */
class MatOptgroupBase {
}
const _MatOptgroupMixinBase = mixinDisabled(MatOptgroupBase);
// Counter for unique group ids.
let _uniqueOptgroupIdCounter = 0;
// tslint:disable-next-line:class-name
export class _MatOptgroupBase extends _MatOptgroupMixinBase {
    constructor() {
        super(...arguments);
        /** Unique id for the underlying label. */
        this._labelId = `mat-optgroup-label-${_uniqueOptgroupIdCounter++}`;
    }
}
_MatOptgroupBase.decorators = [
    { type: Directive }
];
_MatOptgroupBase.propDecorators = {
    label: [{ type: Input }]
};
/**
 * Injection token that can be used to reference instances of `MatOptgroup`. It serves as
 * alternative token to the actual `MatOptgroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const MAT_OPTGROUP = new InjectionToken('MatOptgroup');
/**
 * Component that is used to group instances of `mat-option`.
 */
export class MatOptgroup extends _MatOptgroupBase {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0Z3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9vcHRpb24vb3B0Z3JvdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsY0FBYyxFQUNkLEtBQUssRUFDTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBNkIsYUFBYSxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFHdkYsa0RBQWtEO0FBQ2xELG9CQUFvQjtBQUNwQixNQUFNLGVBQWU7Q0FBSTtBQUN6QixNQUFNLHFCQUFxQixHQUN2QixhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFbkMsZ0NBQWdDO0FBQ2hDLElBQUksd0JBQXdCLEdBQUcsQ0FBQyxDQUFDO0FBR2pDLHNDQUFzQztBQUN0QyxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEscUJBQXFCO0lBRjNEOztRQU1FLDBDQUEwQztRQUMxQyxhQUFRLEdBQVcsc0JBQXNCLHdCQUF3QixFQUFFLEVBQUUsQ0FBQztJQUd4RSxDQUFDOzs7WUFWQSxTQUFTOzs7b0JBSVAsS0FBSzs7QUFRUjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLElBQUksY0FBYyxDQUFjLGFBQWEsQ0FBQyxDQUFDO0FBRTNFOztHQUVHO0FBa0JILE1BQU0sT0FBTyxXQUFZLFNBQVEsZ0JBQWdCOzs7WUFqQmhELFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLGdMQUE0QjtnQkFDNUIsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBRXBCLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsY0FBYztvQkFDdkIsTUFBTSxFQUFFLE9BQU87b0JBQ2YsK0JBQStCLEVBQUUsVUFBVTtvQkFDM0Msc0JBQXNCLEVBQUUscUJBQXFCO29CQUM3Qyx3QkFBd0IsRUFBRSxVQUFVO2lCQUNyQztnQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBQyxDQUFDOzthQUMvRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIERpcmVjdGl2ZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuRGlzYWJsZSwgQ2FuRGlzYWJsZUN0b3IsIG1peGluRGlzYWJsZWR9IGZyb20gJy4uL2NvbW1vbi1iZWhhdmlvcnMvZGlzYWJsZWQnO1xuXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0T3B0Z3JvdXAuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0T3B0Z3JvdXBCYXNlIHsgfVxuY29uc3QgX01hdE9wdGdyb3VwTWl4aW5CYXNlOiBDYW5EaXNhYmxlQ3RvciAmIHR5cGVvZiBNYXRPcHRncm91cEJhc2UgPVxuICAgIG1peGluRGlzYWJsZWQoTWF0T3B0Z3JvdXBCYXNlKTtcblxuLy8gQ291bnRlciBmb3IgdW5pcXVlIGdyb3VwIGlkcy5cbmxldCBfdW5pcXVlT3B0Z3JvdXBJZENvdW50ZXIgPSAwO1xuXG5ARGlyZWN0aXZlKClcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgY2xhc3MgX01hdE9wdGdyb3VwQmFzZSBleHRlbmRzIF9NYXRPcHRncm91cE1peGluQmFzZSBpbXBsZW1lbnRzIENhbkRpc2FibGUge1xuICAvKiogTGFiZWwgZm9yIHRoZSBvcHRpb24gZ3JvdXAuICovXG4gIEBJbnB1dCgpIGxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhlIHVuZGVybHlpbmcgbGFiZWwuICovXG4gIF9sYWJlbElkOiBzdHJpbmcgPSBgbWF0LW9wdGdyb3VwLWxhYmVsLSR7X3VuaXF1ZU9wdGdyb3VwSWRDb3VudGVyKyt9YDtcblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRPcHRncm91cGAuIEl0IHNlcnZlcyBhc1xuICogYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0T3B0Z3JvdXBgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgY29tcG9uZW50IG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX09QVEdST1VQID0gbmV3IEluamVjdGlvblRva2VuPE1hdE9wdGdyb3VwPignTWF0T3B0Z3JvdXAnKTtcblxuLyoqXG4gKiBDb21wb25lbnQgdGhhdCBpcyB1c2VkIHRvIGdyb3VwIGluc3RhbmNlcyBvZiBgbWF0LW9wdGlvbmAuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1vcHRncm91cCcsXG4gIGV4cG9ydEFzOiAnbWF0T3B0Z3JvdXAnLFxuICB0ZW1wbGF0ZVVybDogJ29wdGdyb3VwLmh0bWwnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIHN0eWxlVXJsczogWydvcHRncm91cC5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtb3B0Z3JvdXAnLFxuICAgICdyb2xlJzogJ2dyb3VwJyxcbiAgICAnW2NsYXNzLm1hdC1vcHRncm91cC1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfbGFiZWxJZCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfT1BUR1JPVVAsIHVzZUV4aXN0aW5nOiBNYXRPcHRncm91cH1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRPcHRncm91cCBleHRlbmRzIF9NYXRPcHRncm91cEJhc2Uge1xufVxuIl19