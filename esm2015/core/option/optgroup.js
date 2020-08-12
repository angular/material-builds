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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0Z3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9vcHRpb24vb3B0Z3JvdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsY0FBYyxFQUNkLEtBQUssRUFDTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBNkIsYUFBYSxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFHdkYsa0RBQWtEO0FBQ2xELG9CQUFvQjtBQUNwQixNQUFNLGVBQWU7Q0FBSTtBQUN6QixNQUFNLHFCQUFxQixHQUN2QixhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFbkMsZ0NBQWdDO0FBQ2hDLElBQUksd0JBQXdCLEdBQUcsQ0FBQyxDQUFDO0FBR2pDLE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxxQkFBcUI7SUFEM0Q7O1FBS0UsMENBQTBDO1FBQzFDLGFBQVEsR0FBVyxzQkFBc0Isd0JBQXdCLEVBQUUsRUFBRSxDQUFDO0lBR3hFLENBQUM7OztZQVRBLFNBQVM7OztvQkFHUCxLQUFLOztBQVFSOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxjQUFjLENBQWMsYUFBYSxDQUFDLENBQUM7QUFFM0U7O0dBRUc7QUFrQkgsTUFBTSxPQUFPLFdBQVksU0FBUSxnQkFBZ0I7OztZQWpCaEQsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixRQUFRLEVBQUUsYUFBYTtnQkFDdkIsZ0xBQTRCO2dCQUM1QixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFFcEIsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxjQUFjO29CQUN2QixNQUFNLEVBQUUsT0FBTztvQkFDZiwrQkFBK0IsRUFBRSxVQUFVO29CQUMzQyxzQkFBc0IsRUFBRSxxQkFBcUI7b0JBQzdDLHdCQUF3QixFQUFFLFVBQVU7aUJBQ3JDO2dCQUNELFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFDLENBQUM7O2FBQy9EIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgRGlyZWN0aXZlXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBDYW5EaXNhYmxlQ3RvciwgbWl4aW5EaXNhYmxlZH0gZnJvbSAnLi4vY29tbW9uLWJlaGF2aW9ycy9kaXNhYmxlZCc7XG5cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRPcHRncm91cC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRPcHRncm91cEJhc2UgeyB9XG5jb25zdCBfTWF0T3B0Z3JvdXBNaXhpbkJhc2U6IENhbkRpc2FibGVDdG9yICYgdHlwZW9mIE1hdE9wdGdyb3VwQmFzZSA9XG4gICAgbWl4aW5EaXNhYmxlZChNYXRPcHRncm91cEJhc2UpO1xuXG4vLyBDb3VudGVyIGZvciB1bmlxdWUgZ3JvdXAgaWRzLlxubGV0IF91bmlxdWVPcHRncm91cElkQ291bnRlciA9IDA7XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIF9NYXRPcHRncm91cEJhc2UgZXh0ZW5kcyBfTWF0T3B0Z3JvdXBNaXhpbkJhc2UgaW1wbGVtZW50cyBDYW5EaXNhYmxlIHtcbiAgLyoqIExhYmVsIGZvciB0aGUgb3B0aW9uIGdyb3VwLiAqL1xuICBASW5wdXQoKSBsYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoZSB1bmRlcmx5aW5nIGxhYmVsLiAqL1xuICBfbGFiZWxJZDogc3RyaW5nID0gYG1hdC1vcHRncm91cC1sYWJlbC0ke191bmlxdWVPcHRncm91cElkQ291bnRlcisrfWA7XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGluc3RhbmNlcyBvZiBgTWF0T3B0Z3JvdXBgLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdE9wdGdyb3VwYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGNvbXBvbmVudCBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9PUFRHUk9VUCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRPcHRncm91cD4oJ01hdE9wdGdyb3VwJyk7XG5cbi8qKlxuICogQ29tcG9uZW50IHRoYXQgaXMgdXNlZCB0byBncm91cCBpbnN0YW5jZXMgb2YgYG1hdC1vcHRpb25gLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtb3B0Z3JvdXAnLFxuICBleHBvcnRBczogJ21hdE9wdGdyb3VwJyxcbiAgdGVtcGxhdGVVcmw6ICdvcHRncm91cC5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogWydkaXNhYmxlZCddLFxuICBzdHlsZVVybHM6IFsnb3B0Z3JvdXAuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW9wdGdyb3VwJyxcbiAgICAncm9sZSc6ICdncm91cCcsXG4gICAgJ1tjbGFzcy5tYXQtb3B0Z3JvdXAtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX2xhYmVsSWQnLFxuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX09QVEdST1VQLCB1c2VFeGlzdGluZzogTWF0T3B0Z3JvdXB9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0T3B0Z3JvdXAgZXh0ZW5kcyBfTWF0T3B0Z3JvdXBCYXNlIHtcbn1cbiJdfQ==