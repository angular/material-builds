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
class MatOptgroupBase {
}
const _MatOptgroupMixinBase = mixinDisabled(MatOptgroupBase);
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
                template: "<label class=\"mat-optgroup-label\" [id]=\"_labelId\">{{ label }} <ng-content></ng-content></label>\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0Z3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9vcHRpb24vb3B0Z3JvdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsY0FBYyxFQUNkLEtBQUssRUFDTCxpQkFBaUIsRUFDakIsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQzVCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBNkIsYUFBYSxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDdkYsT0FBTyxFQUEyQiwyQkFBMkIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXRGLDhEQUE4RDtBQUM5RCwyRkFBMkY7QUFDM0YsZ0dBQWdHO0FBQ2hHLGlHQUFpRztBQUNqRyw2RkFBNkY7QUFDN0YsMEZBQTBGO0FBQzFGLHlDQUF5QztBQUN6Qyw4RkFBOEY7QUFDOUYsbUdBQW1HO0FBQ25HLGlHQUFpRztBQUNqRyxtR0FBbUc7QUFDbkcsbUZBQW1GO0FBQ25GLG9HQUFvRztBQUNwRywyRkFBMkY7QUFDM0Ysd0JBQXdCO0FBQ3hCLGlHQUFpRztBQUNqRyw0Q0FBNEM7QUFDNUMsK0ZBQStGO0FBQy9GLHdEQUF3RDtBQUV4RCxrREFBa0Q7QUFDbEQsb0JBQW9CO0FBQ3BCLE1BQU0sZUFBZTtDQUFJO0FBQ3pCLE1BQU0scUJBQXFCLEdBQ3ZCLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUVuQyxnQ0FBZ0M7QUFDaEMsSUFBSSx3QkFBd0IsR0FBRyxDQUFDLENBQUM7QUFHakMsTUFBTSxPQUFPLGdCQUFpQixTQUFRLHFCQUFxQjtJQVV6RCxZQUE2RCxNQUFpQzs7UUFDNUYsS0FBSyxFQUFFLENBQUM7UUFQViwwQ0FBMEM7UUFDMUMsYUFBUSxHQUFXLHNCQUFzQix3QkFBd0IsRUFBRSxFQUFFLENBQUM7UUFPcEUsSUFBSSxDQUFDLE1BQU0sU0FBRyxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsV0FBVyxtQ0FBSSxLQUFLLENBQUM7SUFDN0MsQ0FBQzs7O1lBZEYsU0FBUzs7OzRDQVdLLE1BQU0sU0FBQywyQkFBMkIsY0FBRyxRQUFROzs7b0JBUnpELEtBQUs7O0FBZ0JSOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxjQUFjLENBQWMsYUFBYSxDQUFDLENBQUM7QUFFM0U7O0dBRUc7QUFrQkgsTUFBTSxPQUFPLFdBQVksU0FBUSxnQkFBZ0I7OztZQWpCaEQsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixRQUFRLEVBQUUsYUFBYTtnQkFDdkIsZ0xBQTRCO2dCQUM1QixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFFcEIsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxjQUFjO29CQUN2QixhQUFhLEVBQUUseUJBQXlCO29CQUN4QyxzQkFBc0IsRUFBRSxxQ0FBcUM7b0JBQzdELHdCQUF3QixFQUFFLDBCQUEwQjtvQkFDcEQsK0JBQStCLEVBQUUsVUFBVTtpQkFDNUM7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUMsQ0FBQzs7YUFDL0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBEaXJlY3RpdmUsIEluamVjdCwgT3B0aW9uYWxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkRpc2FibGUsIENhbkRpc2FibGVDdG9yLCBtaXhpbkRpc2FibGVkfSBmcm9tICcuLi9jb21tb24tYmVoYXZpb3JzL2Rpc2FibGVkJztcbmltcG9ydCB7TWF0T3B0aW9uUGFyZW50Q29tcG9uZW50LCBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlR9IGZyb20gJy4vb3B0aW9uLXBhcmVudCc7XG5cbi8vIE5vdGVzIG9uIHRoZSBhY2Nlc3NpYmlsaXR5IHBhdHRlcm4gdXNlZCBmb3IgYG1hdC1vcHRncm91cGAuXG4vLyBUaGUgb3B0aW9uIGdyb3VwIGhhcyB0d28gZGlmZmVyZW50IFwibW9kZXNcIjogcmVndWxhciBhbmQgaW5lcnQuIFRoZSByZWd1bGFyIG1vZGUgdXNlcyB0aGVcbi8vIHJlY29tbWVuZGVkIGExMXkgcGF0dGVybiB3aGljaCBoYXMgYHJvbGU9XCJncm91cFwiYCBvbiB0aGUgZ3JvdXAgZWxlbWVudCB3aXRoIGBhcmlhLWxhYmVsbGVkYnlgXG4vLyBwb2ludGluZyB0byB0aGUgbGFiZWwuIFRoaXMgd29ya3MgZm9yIGBtYXQtc2VsZWN0YCwgYnV0IGl0IHNlZW1zIHRvIGhpdCBhIGJ1ZyBmb3IgYXV0b2NvbXBsZXRlXG4vLyB1bmRlciBWb2ljZU92ZXIgd2hlcmUgdGhlIGdyb3VwIGRvZXNuJ3QgZ2V0IHJlYWQgb3V0IGF0IGFsbC4gVGhlIGJ1ZyBhcHBlYXJzIHRvIGJlIHRoYXQgaWZcbi8vIHRoZXJlJ3MgX19hbnlfXyBhMTF5LXJlbGF0ZWQgYXR0cmlidXRlIG9uIHRoZSBncm91cCAoZS5nLiBgcm9sZWAgb3IgYGFyaWEtbGFiZWxsZWRieWApLFxuLy8gVm9pY2VPdmVyIG9uIFNhZmFyaSB3b24ndCByZWFkIGl0IG91dC5cbi8vIFdlJ3ZlIGludHJvZHVjZWQgdGhlIGBpbmVydGAgbW9kZSBhcyBhIHdvcmthcm91bmQuIFVuZGVyIHRoaXMgbW9kZSwgYWxsIGExMXkgYXR0cmlidXRlcyBhcmVcbi8vIHJlbW92ZWQgZnJvbSB0aGUgZ3JvdXAsIGFuZCB3ZSBnZXQgdGhlIHNjcmVlbiByZWFkZXIgdG8gcmVhZCBvdXQgdGhlIGdyb3VwIGxhYmVsIGJ5IG1pcnJvcmluZyBpdFxuLy8gaW5zaWRlIGFuIGludmlzaWJsZSBlbGVtZW50IGluIHRoZSBvcHRpb24uIFRoaXMgaXMgc3ViLW9wdGltYWwsIGJlY2F1c2UgdGhlIHNjcmVlbiByZWFkZXIgd2lsbFxuLy8gcmVwZWF0IHRoZSBncm91cCBsYWJlbCBvbiBlYWNoIG5hdmlnYXRpb24sIHdoZXJlYXMgdGhlIGRlZmF1bHQgcGF0dGVybiBvbmx5IHJlYWRzIHRoZSBncm91cCB3aGVuXG4vLyB0aGUgdXNlciBlbnRlcnMgYSBuZXcgZ3JvdXAuIFRoZSBmb2xsb3dpbmcgYWx0ZXJuYXRlIGFwcHJvYWNoZXMgd2VyZSBjb25zaWRlcmVkOlxuLy8gMS4gUmVhZGluZyBvdXQgdGhlIGdyb3VwIGxhYmVsIHVzaW5nIHRoZSBgTGl2ZUFubm91bmNlcmAgc29sdmVzIHRoZSBwcm9ibGVtLCBidXQgd2UgY2FuJ3QgY29udHJvbFxuLy8gICAgd2hlbiB0aGUgdGV4dCB3aWxsIGJlIHJlYWQgb3V0IHNvIHNvbWV0aW1lcyBpdCBjb21lcyBpbiB0b28gbGF0ZSBvciBuZXZlciBpZiB0aGUgdXNlclxuLy8gICAgbmF2aWdhdGVzIHF1aWNrbHkuXG4vLyAyLiBgPG1hdC1vcHRpb24gYXJpYS1kZXNjcmliZWRieT1cImdyb3VwTGFiZWxcImAgLSBUaGlzIHdvcmtzIG9uIFNhZmFyaSwgYnV0IFZvaWNlT3ZlciBpbiBDaHJvbWVcbi8vICAgIHdvbid0IHJlYWQgb3V0IHRoZSBkZXNjcmlwdGlvbiBhdCBhbGwuXG4vLyAzLiBgPG1hdC1vcHRpb24gYXJpYS1sYWJlbGxlZGJ5PVwib3B0aW9uTGFiZWwgZ3JvdXBMYWJlbFwiYCAtIFRoaXMgd29ya3Mgb24gQ2hyb21lLCBidXQgU2FmYXJpXG4vLyAgICAgZG9lc24ndCByZWFkIG91dCB0aGUgdGV4dCBhdCBhbGwuIEZ1cnRoZXJtb3JlLCBvblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdE9wdGdyb3VwLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdE9wdGdyb3VwQmFzZSB7IH1cbmNvbnN0IF9NYXRPcHRncm91cE1peGluQmFzZTogQ2FuRGlzYWJsZUN0b3IgJiB0eXBlb2YgTWF0T3B0Z3JvdXBCYXNlID1cbiAgICBtaXhpbkRpc2FibGVkKE1hdE9wdGdyb3VwQmFzZSk7XG5cbi8vIENvdW50ZXIgZm9yIHVuaXF1ZSBncm91cCBpZHMuXG5sZXQgX3VuaXF1ZU9wdGdyb3VwSWRDb3VudGVyID0gMDtcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgX01hdE9wdGdyb3VwQmFzZSBleHRlbmRzIF9NYXRPcHRncm91cE1peGluQmFzZSBpbXBsZW1lbnRzIENhbkRpc2FibGUge1xuICAvKiogTGFiZWwgZm9yIHRoZSBvcHRpb24gZ3JvdXAuICovXG4gIEBJbnB1dCgpIGxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhlIHVuZGVybHlpbmcgbGFiZWwuICovXG4gIF9sYWJlbElkOiBzdHJpbmcgPSBgbWF0LW9wdGdyb3VwLWxhYmVsLSR7X3VuaXF1ZU9wdGdyb3VwSWRDb3VudGVyKyt9YDtcblxuICAvKiogV2hldGhlciB0aGUgZ3JvdXAgaXMgaW4gaW5lcnQgYTExeSBtb2RlLiAqL1xuICBfaW5lcnQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQpIEBPcHRpb25hbCgpIHBhcmVudD86IE1hdE9wdGlvblBhcmVudENvbXBvbmVudCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faW5lcnQgPSBwYXJlbnQ/LmluZXJ0R3JvdXBzID8/IGZhbHNlO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGluc3RhbmNlcyBvZiBgTWF0T3B0Z3JvdXBgLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdE9wdGdyb3VwYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGNvbXBvbmVudCBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9PUFRHUk9VUCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRPcHRncm91cD4oJ01hdE9wdGdyb3VwJyk7XG5cbi8qKlxuICogQ29tcG9uZW50IHRoYXQgaXMgdXNlZCB0byBncm91cCBpbnN0YW5jZXMgb2YgYG1hdC1vcHRpb25gLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtb3B0Z3JvdXAnLFxuICBleHBvcnRBczogJ21hdE9wdGdyb3VwJyxcbiAgdGVtcGxhdGVVcmw6ICdvcHRncm91cC5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogWydkaXNhYmxlZCddLFxuICBzdHlsZVVybHM6IFsnb3B0Z3JvdXAuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW9wdGdyb3VwJyxcbiAgICAnW2F0dHIucm9sZV0nOiAnX2luZXJ0ID8gbnVsbCA6IFwiZ3JvdXBcIicsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ19pbmVydCA/IG51bGwgOiBkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfaW5lcnQgPyBudWxsIDogX2xhYmVsSWQnLFxuICAgICdbY2xhc3MubWF0LW9wdGdyb3VwLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfT1BUR1JPVVAsIHVzZUV4aXN0aW5nOiBNYXRPcHRncm91cH1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRPcHRncm91cCBleHRlbmRzIF9NYXRPcHRncm91cEJhc2Uge1xufVxuIl19