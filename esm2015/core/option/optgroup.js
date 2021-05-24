/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, InjectionToken, Input, ViewEncapsulation, Directive, Inject, Optional } from '@angular/core';
import { mixinDisabled } from '../common-behaviors/disabled';
import { MAT_OPTION_PARENT_COMPONENT } from './option-parent';
// Notes on the accessibility pattern used for `mat-optgroup`.
// The option group has two different "modes": regular and inert. The regular mode uses the
// recommended a11y pattern which has `role="group"` on the group element with `aria-labelledby`
// pointing to the label. This works for `mat-select`, but it seems to hit a bug for autocomplete
// under VoiceOver where the group doesn't get read out at all. The bug appears to be that if
// there's __any__ a11y-related attribute on the group (e.g. `role` or `aria-labelledby`),
// VoiceOver on Safari won't read it out.
// We've introduced the `inert` mode as a workaround. Under this mode, all a11y attributes are
// removed from the group, and we get the screen reader to read out the group label by mirroring it
// inside an invisible element in the option. This is sub-optimal, because the screen reader will
// repeat the group label on each navigation, whereas the default pattern only reads the group when
// the user enters a new group. The following alternate approaches were considered:
// 1. Reading out the group label using the `LiveAnnouncer` solves the problem, but we can't control
//    when the text will be read out so sometimes it comes in too late or never if the user
//    navigates quickly.
// 2. `<mat-option aria-describedby="groupLabel"` - This works on Safari, but VoiceOver in Chrome
//    won't read out the description at all.
// 3. `<mat-option aria-labelledby="optionLabel groupLabel"` - This works on Chrome, but Safari
//     doesn't read out the text at all. Furthermore, on
// Boilerplate for applying mixins to MatOptgroup.
/** @docs-private */
const _MatOptgroupMixinBase = mixinDisabled(class {
});
// Counter for unique group ids.
let _uniqueOptgroupIdCounter = 0;
export class _MatOptgroupBase extends _MatOptgroupMixinBase {
    constructor(parent) {
        var _a;
        super();
        /** Unique id for the underlying label. */
        this._labelId = `mat-optgroup-label-${_uniqueOptgroupIdCounter++}`;
        this._inert = (_a = parent === null || parent === void 0 ? void 0 : parent.inertGroups) !== null && _a !== void 0 ? _a : false;
    }
}
_MatOptgroupBase.decorators = [
    { type: Directive }
];
_MatOptgroupBase.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [MAT_OPTION_PARENT_COMPONENT,] }, { type: Optional }] }
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
                template: "<span class=\"mat-optgroup-label\" aria-hidden=\"true\" [id]=\"_labelId\">{{ label }} <ng-content></ng-content></span>\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: ['disabled'],
                host: {
                    'class': 'mat-optgroup',
                    '[attr.role]': '_inert ? null : "group"',
                    '[attr.aria-disabled]': '_inert ? null : disabled.toString()',
                    '[attr.aria-labelledby]': '_inert ? null : _labelId',
                    '[class.mat-optgroup-disabled]': 'disabled',
                },
                providers: [{ provide: MAT_OPTGROUP, useExisting: MatOptgroup }],
                styles: [".mat-optgroup-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.mat-optgroup-label[disabled]{cursor:default}[dir=rtl] .mat-optgroup-label{text-align:right}.mat-optgroup-label .mat-icon{margin-right:16px;vertical-align:middle}.mat-optgroup-label .mat-icon svg{vertical-align:top}[dir=rtl] .mat-optgroup-label .mat-icon{margin-left:16px;margin-right:0}\n"]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0Z3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9vcHRpb24vb3B0Z3JvdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsY0FBYyxFQUNkLEtBQUssRUFDTCxpQkFBaUIsRUFDakIsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQzVCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBYSxhQUFhLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUN2RSxPQUFPLEVBQTJCLDJCQUEyQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFdEYsOERBQThEO0FBQzlELDJGQUEyRjtBQUMzRixnR0FBZ0c7QUFDaEcsaUdBQWlHO0FBQ2pHLDZGQUE2RjtBQUM3RiwwRkFBMEY7QUFDMUYseUNBQXlDO0FBQ3pDLDhGQUE4RjtBQUM5RixtR0FBbUc7QUFDbkcsaUdBQWlHO0FBQ2pHLG1HQUFtRztBQUNuRyxtRkFBbUY7QUFDbkYsb0dBQW9HO0FBQ3BHLDJGQUEyRjtBQUMzRix3QkFBd0I7QUFDeEIsaUdBQWlHO0FBQ2pHLDRDQUE0QztBQUM1QywrRkFBK0Y7QUFDL0Ysd0RBQXdEO0FBRXhELGtEQUFrRDtBQUNsRCxvQkFBb0I7QUFDcEIsTUFBTSxxQkFBcUIsR0FBRyxhQUFhLENBQUM7Q0FBUSxDQUFDLENBQUM7QUFFdEQsZ0NBQWdDO0FBQ2hDLElBQUksd0JBQXdCLEdBQUcsQ0FBQyxDQUFDO0FBR2pDLE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxxQkFBcUI7SUFVekQsWUFBNkQsTUFBaUM7O1FBQzVGLEtBQUssRUFBRSxDQUFDO1FBUFYsMENBQTBDO1FBQzFDLGFBQVEsR0FBVyxzQkFBc0Isd0JBQXdCLEVBQUUsRUFBRSxDQUFDO1FBT3BFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsV0FBVyxtQ0FBSSxLQUFLLENBQUM7SUFDN0MsQ0FBQzs7O1lBZEYsU0FBUzs7OzRDQVdLLE1BQU0sU0FBQywyQkFBMkIsY0FBRyxRQUFROzs7b0JBUnpELEtBQUs7O0FBZ0JSOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxjQUFjLENBQWMsYUFBYSxDQUFDLENBQUM7QUFFM0U7O0dBRUc7QUFrQkgsTUFBTSxPQUFPLFdBQVksU0FBUSxnQkFBZ0I7OztZQWpCaEQsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixRQUFRLEVBQUUsYUFBYTtnQkFDdkIsbU1BQTRCO2dCQUM1QixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFFcEIsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxjQUFjO29CQUN2QixhQUFhLEVBQUUseUJBQXlCO29CQUN4QyxzQkFBc0IsRUFBRSxxQ0FBcUM7b0JBQzdELHdCQUF3QixFQUFFLDBCQUEwQjtvQkFDcEQsK0JBQStCLEVBQUUsVUFBVTtpQkFDNUM7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUMsQ0FBQzs7YUFDL0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBEaXJlY3RpdmUsIEluamVjdCwgT3B0aW9uYWxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkRpc2FibGUsIG1peGluRGlzYWJsZWR9IGZyb20gJy4uL2NvbW1vbi1iZWhhdmlvcnMvZGlzYWJsZWQnO1xuaW1wb3J0IHtNYXRPcHRpb25QYXJlbnRDb21wb25lbnQsIE1BVF9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVH0gZnJvbSAnLi9vcHRpb24tcGFyZW50JztcblxuLy8gTm90ZXMgb24gdGhlIGFjY2Vzc2liaWxpdHkgcGF0dGVybiB1c2VkIGZvciBgbWF0LW9wdGdyb3VwYC5cbi8vIFRoZSBvcHRpb24gZ3JvdXAgaGFzIHR3byBkaWZmZXJlbnQgXCJtb2Rlc1wiOiByZWd1bGFyIGFuZCBpbmVydC4gVGhlIHJlZ3VsYXIgbW9kZSB1c2VzIHRoZVxuLy8gcmVjb21tZW5kZWQgYTExeSBwYXR0ZXJuIHdoaWNoIGhhcyBgcm9sZT1cImdyb3VwXCJgIG9uIHRoZSBncm91cCBlbGVtZW50IHdpdGggYGFyaWEtbGFiZWxsZWRieWBcbi8vIHBvaW50aW5nIHRvIHRoZSBsYWJlbC4gVGhpcyB3b3JrcyBmb3IgYG1hdC1zZWxlY3RgLCBidXQgaXQgc2VlbXMgdG8gaGl0IGEgYnVnIGZvciBhdXRvY29tcGxldGVcbi8vIHVuZGVyIFZvaWNlT3ZlciB3aGVyZSB0aGUgZ3JvdXAgZG9lc24ndCBnZXQgcmVhZCBvdXQgYXQgYWxsLiBUaGUgYnVnIGFwcGVhcnMgdG8gYmUgdGhhdCBpZlxuLy8gdGhlcmUncyBfX2FueV9fIGExMXktcmVsYXRlZCBhdHRyaWJ1dGUgb24gdGhlIGdyb3VwIChlLmcuIGByb2xlYCBvciBgYXJpYS1sYWJlbGxlZGJ5YCksXG4vLyBWb2ljZU92ZXIgb24gU2FmYXJpIHdvbid0IHJlYWQgaXQgb3V0LlxuLy8gV2UndmUgaW50cm9kdWNlZCB0aGUgYGluZXJ0YCBtb2RlIGFzIGEgd29ya2Fyb3VuZC4gVW5kZXIgdGhpcyBtb2RlLCBhbGwgYTExeSBhdHRyaWJ1dGVzIGFyZVxuLy8gcmVtb3ZlZCBmcm9tIHRoZSBncm91cCwgYW5kIHdlIGdldCB0aGUgc2NyZWVuIHJlYWRlciB0byByZWFkIG91dCB0aGUgZ3JvdXAgbGFiZWwgYnkgbWlycm9yaW5nIGl0XG4vLyBpbnNpZGUgYW4gaW52aXNpYmxlIGVsZW1lbnQgaW4gdGhlIG9wdGlvbi4gVGhpcyBpcyBzdWItb3B0aW1hbCwgYmVjYXVzZSB0aGUgc2NyZWVuIHJlYWRlciB3aWxsXG4vLyByZXBlYXQgdGhlIGdyb3VwIGxhYmVsIG9uIGVhY2ggbmF2aWdhdGlvbiwgd2hlcmVhcyB0aGUgZGVmYXVsdCBwYXR0ZXJuIG9ubHkgcmVhZHMgdGhlIGdyb3VwIHdoZW5cbi8vIHRoZSB1c2VyIGVudGVycyBhIG5ldyBncm91cC4gVGhlIGZvbGxvd2luZyBhbHRlcm5hdGUgYXBwcm9hY2hlcyB3ZXJlIGNvbnNpZGVyZWQ6XG4vLyAxLiBSZWFkaW5nIG91dCB0aGUgZ3JvdXAgbGFiZWwgdXNpbmcgdGhlIGBMaXZlQW5ub3VuY2VyYCBzb2x2ZXMgdGhlIHByb2JsZW0sIGJ1dCB3ZSBjYW4ndCBjb250cm9sXG4vLyAgICB3aGVuIHRoZSB0ZXh0IHdpbGwgYmUgcmVhZCBvdXQgc28gc29tZXRpbWVzIGl0IGNvbWVzIGluIHRvbyBsYXRlIG9yIG5ldmVyIGlmIHRoZSB1c2VyXG4vLyAgICBuYXZpZ2F0ZXMgcXVpY2tseS5cbi8vIDIuIGA8bWF0LW9wdGlvbiBhcmlhLWRlc2NyaWJlZGJ5PVwiZ3JvdXBMYWJlbFwiYCAtIFRoaXMgd29ya3Mgb24gU2FmYXJpLCBidXQgVm9pY2VPdmVyIGluIENocm9tZVxuLy8gICAgd29uJ3QgcmVhZCBvdXQgdGhlIGRlc2NyaXB0aW9uIGF0IGFsbC5cbi8vIDMuIGA8bWF0LW9wdGlvbiBhcmlhLWxhYmVsbGVkYnk9XCJvcHRpb25MYWJlbCBncm91cExhYmVsXCJgIC0gVGhpcyB3b3JrcyBvbiBDaHJvbWUsIGJ1dCBTYWZhcmlcbi8vICAgICBkb2Vzbid0IHJlYWQgb3V0IHRoZSB0ZXh0IGF0IGFsbC4gRnVydGhlcm1vcmUsIG9uXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0T3B0Z3JvdXAuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdE9wdGdyb3VwTWl4aW5CYXNlID0gbWl4aW5EaXNhYmxlZChjbGFzcyB7fSk7XG5cbi8vIENvdW50ZXIgZm9yIHVuaXF1ZSBncm91cCBpZHMuXG5sZXQgX3VuaXF1ZU9wdGdyb3VwSWRDb3VudGVyID0gMDtcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgX01hdE9wdGdyb3VwQmFzZSBleHRlbmRzIF9NYXRPcHRncm91cE1peGluQmFzZSBpbXBsZW1lbnRzIENhbkRpc2FibGUge1xuICAvKiogTGFiZWwgZm9yIHRoZSBvcHRpb24gZ3JvdXAuICovXG4gIEBJbnB1dCgpIGxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhlIHVuZGVybHlpbmcgbGFiZWwuICovXG4gIF9sYWJlbElkOiBzdHJpbmcgPSBgbWF0LW9wdGdyb3VwLWxhYmVsLSR7X3VuaXF1ZU9wdGdyb3VwSWRDb3VudGVyKyt9YDtcblxuICAvKiogV2hldGhlciB0aGUgZ3JvdXAgaXMgaW4gaW5lcnQgYTExeSBtb2RlLiAqL1xuICBfaW5lcnQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQpIEBPcHRpb25hbCgpIHBhcmVudD86IE1hdE9wdGlvblBhcmVudENvbXBvbmVudCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faW5lcnQgPSBwYXJlbnQ/LmluZXJ0R3JvdXBzID8/IGZhbHNlO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGluc3RhbmNlcyBvZiBgTWF0T3B0Z3JvdXBgLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdE9wdGdyb3VwYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGNvbXBvbmVudCBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9PUFRHUk9VUCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRPcHRncm91cD4oJ01hdE9wdGdyb3VwJyk7XG5cbi8qKlxuICogQ29tcG9uZW50IHRoYXQgaXMgdXNlZCB0byBncm91cCBpbnN0YW5jZXMgb2YgYG1hdC1vcHRpb25gLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtb3B0Z3JvdXAnLFxuICBleHBvcnRBczogJ21hdE9wdGdyb3VwJyxcbiAgdGVtcGxhdGVVcmw6ICdvcHRncm91cC5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogWydkaXNhYmxlZCddLFxuICBzdHlsZVVybHM6IFsnb3B0Z3JvdXAuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW9wdGdyb3VwJyxcbiAgICAnW2F0dHIucm9sZV0nOiAnX2luZXJ0ID8gbnVsbCA6IFwiZ3JvdXBcIicsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ19pbmVydCA/IG51bGwgOiBkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfaW5lcnQgPyBudWxsIDogX2xhYmVsSWQnLFxuICAgICdbY2xhc3MubWF0LW9wdGdyb3VwLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfT1BUR1JPVVAsIHVzZUV4aXN0aW5nOiBNYXRPcHRncm91cH1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRPcHRncm91cCBleHRlbmRzIF9NYXRPcHRncm91cEJhc2Uge1xufVxuIl19