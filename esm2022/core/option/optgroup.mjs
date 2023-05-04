/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, Inject, Optional, InjectionToken, Directive, } from '@angular/core';
import { mixinDisabled } from '../common-behaviors/disabled';
import { MAT_OPTION_PARENT_COMPONENT } from './option-parent';
import * as i0 from "@angular/core";
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
class _MatOptgroupBase extends _MatOptgroupMixinBase {
    constructor(parent) {
        super();
        /** Unique id for the underlying label. */
        this._labelId = `mat-optgroup-label-${_uniqueOptgroupIdCounter++}`;
        this._inert = parent?.inertGroups ?? false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: _MatOptgroupBase, deps: [{ token: MAT_OPTION_PARENT_COMPONENT, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: _MatOptgroupBase, inputs: { label: "label" }, usesInheritance: true, ngImport: i0 }); }
}
export { _MatOptgroupBase };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: _MatOptgroupBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_OPTION_PARENT_COMPONENT]
                }, {
                    type: Optional
                }] }]; }, propDecorators: { label: [{
                type: Input
            }] } });
/**
 * Injection token that can be used to reference instances of `MatOptgroup`. It serves as
 * alternative token to the actual `MatOptgroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const MAT_OPTGROUP = new InjectionToken('MatOptgroup');
/**
 * Component that is used to group instances of `mat-option`.
 */
class MatOptgroup extends _MatOptgroupBase {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatOptgroup, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatOptgroup, selector: "mat-optgroup", inputs: { disabled: "disabled" }, host: { properties: { "attr.role": "_inert ? null : \"group\"", "attr.aria-disabled": "_inert ? null : disabled.toString()", "attr.aria-labelledby": "_inert ? null : _labelId" }, classAttribute: "mat-mdc-optgroup" }, providers: [{ provide: MAT_OPTGROUP, useExisting: MatOptgroup }], exportAs: ["matOptgroup"], usesInheritance: true, ngImport: i0, template: "<span\n  class=\"mat-mdc-optgroup-label\"\n  aria-hidden=\"true\"\n  [class.mdc-list-item--disabled]=\"disabled\"\n  [id]=\"_labelId\">\n  <span class=\"mdc-list-item__primary-text\">{{ label }} <ng-content></ng-content></span>\n</span>\n\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n", styles: [".mat-mdc-optgroup-label{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:16px;padding-right:16px;min-height:48px}.mat-mdc-optgroup-label:focus{outline:none}[dir=rtl] .mat-mdc-optgroup-label,.mat-mdc-optgroup-label[dir=rtl]{padding-left:16px;padding-right:16px}.mat-mdc-optgroup-label.mdc-list-item--disabled{opacity:.38}.mat-mdc-optgroup-label .mdc-list-item__primary-text{white-space:normal}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatOptgroup };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatOptgroup, decorators: [{
            type: Component,
            args: [{ selector: 'mat-optgroup', exportAs: 'matOptgroup', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['disabled'], host: {
                        'class': 'mat-mdc-optgroup',
                        '[attr.role]': '_inert ? null : "group"',
                        '[attr.aria-disabled]': '_inert ? null : disabled.toString()',
                        '[attr.aria-labelledby]': '_inert ? null : _labelId',
                    }, providers: [{ provide: MAT_OPTGROUP, useExisting: MatOptgroup }], template: "<span\n  class=\"mat-mdc-optgroup-label\"\n  aria-hidden=\"true\"\n  [class.mdc-list-item--disabled]=\"disabled\"\n  [id]=\"_labelId\">\n  <span class=\"mdc-list-item__primary-text\">{{ label }} <ng-content></ng-content></span>\n</span>\n\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n", styles: [".mat-mdc-optgroup-label{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:16px;padding-right:16px;min-height:48px}.mat-mdc-optgroup-label:focus{outline:none}[dir=rtl] .mat-mdc-optgroup-label,.mat-mdc-optgroup-label[dir=rtl]{padding-left:16px;padding-right:16px}.mat-mdc-optgroup-label.mdc-list-item--disabled{opacity:.38}.mat-mdc-optgroup-label .mdc-list-item__primary-text{white-space:normal}"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0Z3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9vcHRpb24vb3B0Z3JvdXAudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9vcHRpb24vb3B0Z3JvdXAuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUNULGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsS0FBSyxFQUNMLE1BQU0sRUFDTixRQUFRLEVBQ1IsY0FBYyxFQUNkLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQWEsYUFBYSxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUEyQiwyQkFBMkIsRUFBQyxNQUFNLGlCQUFpQixDQUFDOztBQUV0Riw4REFBOEQ7QUFDOUQsMkZBQTJGO0FBQzNGLGdHQUFnRztBQUNoRyxpR0FBaUc7QUFDakcsNkZBQTZGO0FBQzdGLDBGQUEwRjtBQUMxRix5Q0FBeUM7QUFDekMsOEZBQThGO0FBQzlGLG1HQUFtRztBQUNuRyxpR0FBaUc7QUFDakcsbUdBQW1HO0FBQ25HLG1GQUFtRjtBQUNuRixvR0FBb0c7QUFDcEcsMkZBQTJGO0FBQzNGLHdCQUF3QjtBQUN4QixpR0FBaUc7QUFDakcsNENBQTRDO0FBQzVDLCtGQUErRjtBQUMvRix3REFBd0Q7QUFFeEQsa0RBQWtEO0FBQ2xELG9CQUFvQjtBQUNwQixNQUFNLHFCQUFxQixHQUFHLGFBQWEsQ0FBQztDQUFRLENBQUMsQ0FBQztBQUV0RCxnQ0FBZ0M7QUFDaEMsSUFBSSx3QkFBd0IsR0FBRyxDQUFDLENBQUM7QUFFakMsTUFDYSxnQkFBaUIsU0FBUSxxQkFBcUI7SUFVekQsWUFBNkQsTUFBaUM7UUFDNUYsS0FBSyxFQUFFLENBQUM7UUFQViwwQ0FBMEM7UUFDMUMsYUFBUSxHQUFXLHNCQUFzQix3QkFBd0IsRUFBRSxFQUFFLENBQUM7UUFPcEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsV0FBVyxJQUFJLEtBQUssQ0FBQztJQUM3QyxDQUFDOzhHQWJVLGdCQUFnQixrQkFVUCwyQkFBMkI7a0dBVnBDLGdCQUFnQjs7U0FBaEIsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBRDVCLFNBQVM7OzBCQVdLLE1BQU07MkJBQUMsMkJBQTJCOzswQkFBRyxRQUFROzRDQVJqRCxLQUFLO3NCQUFiLEtBQUs7O0FBY1I7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxJQUFJLGNBQWMsQ0FBYyxhQUFhLENBQUMsQ0FBQztBQUUzRTs7R0FFRztBQUNILE1BZ0JhLFdBQVksU0FBUSxnQkFBZ0I7OEdBQXBDLFdBQVc7a0dBQVgsV0FBVyxrU0FGWCxDQUFDLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFDLENBQUMsNEVDekZoRSxpVEFTQTs7U0RrRmEsV0FBVzsyRkFBWCxXQUFXO2tCQWhCdkIsU0FBUzsrQkFDRSxjQUFjLFlBQ2QsYUFBYSxpQkFFUixpQkFBaUIsQ0FBQyxJQUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNLFVBQ3ZDLENBQUMsVUFBVSxDQUFDLFFBRWQ7d0JBQ0osT0FBTyxFQUFFLGtCQUFrQjt3QkFDM0IsYUFBYSxFQUFFLHlCQUF5Qjt3QkFDeEMsc0JBQXNCLEVBQUUscUNBQXFDO3dCQUM3RCx3QkFBd0IsRUFBRSwwQkFBMEI7cUJBQ3JELGFBQ1UsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxhQUFhLEVBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgSW5wdXQsXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG4gIEluamVjdGlvblRva2VuLFxuICBEaXJlY3RpdmUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBtaXhpbkRpc2FibGVkfSBmcm9tICcuLi9jb21tb24tYmVoYXZpb3JzL2Rpc2FibGVkJztcbmltcG9ydCB7TWF0T3B0aW9uUGFyZW50Q29tcG9uZW50LCBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlR9IGZyb20gJy4vb3B0aW9uLXBhcmVudCc7XG5cbi8vIE5vdGVzIG9uIHRoZSBhY2Nlc3NpYmlsaXR5IHBhdHRlcm4gdXNlZCBmb3IgYG1hdC1vcHRncm91cGAuXG4vLyBUaGUgb3B0aW9uIGdyb3VwIGhhcyB0d28gZGlmZmVyZW50IFwibW9kZXNcIjogcmVndWxhciBhbmQgaW5lcnQuIFRoZSByZWd1bGFyIG1vZGUgdXNlcyB0aGVcbi8vIHJlY29tbWVuZGVkIGExMXkgcGF0dGVybiB3aGljaCBoYXMgYHJvbGU9XCJncm91cFwiYCBvbiB0aGUgZ3JvdXAgZWxlbWVudCB3aXRoIGBhcmlhLWxhYmVsbGVkYnlgXG4vLyBwb2ludGluZyB0byB0aGUgbGFiZWwuIFRoaXMgd29ya3MgZm9yIGBtYXQtc2VsZWN0YCwgYnV0IGl0IHNlZW1zIHRvIGhpdCBhIGJ1ZyBmb3IgYXV0b2NvbXBsZXRlXG4vLyB1bmRlciBWb2ljZU92ZXIgd2hlcmUgdGhlIGdyb3VwIGRvZXNuJ3QgZ2V0IHJlYWQgb3V0IGF0IGFsbC4gVGhlIGJ1ZyBhcHBlYXJzIHRvIGJlIHRoYXQgaWZcbi8vIHRoZXJlJ3MgX19hbnlfXyBhMTF5LXJlbGF0ZWQgYXR0cmlidXRlIG9uIHRoZSBncm91cCAoZS5nLiBgcm9sZWAgb3IgYGFyaWEtbGFiZWxsZWRieWApLFxuLy8gVm9pY2VPdmVyIG9uIFNhZmFyaSB3b24ndCByZWFkIGl0IG91dC5cbi8vIFdlJ3ZlIGludHJvZHVjZWQgdGhlIGBpbmVydGAgbW9kZSBhcyBhIHdvcmthcm91bmQuIFVuZGVyIHRoaXMgbW9kZSwgYWxsIGExMXkgYXR0cmlidXRlcyBhcmVcbi8vIHJlbW92ZWQgZnJvbSB0aGUgZ3JvdXAsIGFuZCB3ZSBnZXQgdGhlIHNjcmVlbiByZWFkZXIgdG8gcmVhZCBvdXQgdGhlIGdyb3VwIGxhYmVsIGJ5IG1pcnJvcmluZyBpdFxuLy8gaW5zaWRlIGFuIGludmlzaWJsZSBlbGVtZW50IGluIHRoZSBvcHRpb24uIFRoaXMgaXMgc3ViLW9wdGltYWwsIGJlY2F1c2UgdGhlIHNjcmVlbiByZWFkZXIgd2lsbFxuLy8gcmVwZWF0IHRoZSBncm91cCBsYWJlbCBvbiBlYWNoIG5hdmlnYXRpb24sIHdoZXJlYXMgdGhlIGRlZmF1bHQgcGF0dGVybiBvbmx5IHJlYWRzIHRoZSBncm91cCB3aGVuXG4vLyB0aGUgdXNlciBlbnRlcnMgYSBuZXcgZ3JvdXAuIFRoZSBmb2xsb3dpbmcgYWx0ZXJuYXRlIGFwcHJvYWNoZXMgd2VyZSBjb25zaWRlcmVkOlxuLy8gMS4gUmVhZGluZyBvdXQgdGhlIGdyb3VwIGxhYmVsIHVzaW5nIHRoZSBgTGl2ZUFubm91bmNlcmAgc29sdmVzIHRoZSBwcm9ibGVtLCBidXQgd2UgY2FuJ3QgY29udHJvbFxuLy8gICAgd2hlbiB0aGUgdGV4dCB3aWxsIGJlIHJlYWQgb3V0IHNvIHNvbWV0aW1lcyBpdCBjb21lcyBpbiB0b28gbGF0ZSBvciBuZXZlciBpZiB0aGUgdXNlclxuLy8gICAgbmF2aWdhdGVzIHF1aWNrbHkuXG4vLyAyLiBgPG1hdC1vcHRpb24gYXJpYS1kZXNjcmliZWRieT1cImdyb3VwTGFiZWxcImAgLSBUaGlzIHdvcmtzIG9uIFNhZmFyaSwgYnV0IFZvaWNlT3ZlciBpbiBDaHJvbWVcbi8vICAgIHdvbid0IHJlYWQgb3V0IHRoZSBkZXNjcmlwdGlvbiBhdCBhbGwuXG4vLyAzLiBgPG1hdC1vcHRpb24gYXJpYS1sYWJlbGxlZGJ5PVwib3B0aW9uTGFiZWwgZ3JvdXBMYWJlbFwiYCAtIFRoaXMgd29ya3Mgb24gQ2hyb21lLCBidXQgU2FmYXJpXG4vLyAgICAgZG9lc24ndCByZWFkIG91dCB0aGUgdGV4dCBhdCBhbGwuIEZ1cnRoZXJtb3JlLCBvblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdE9wdGdyb3VwLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRPcHRncm91cE1peGluQmFzZSA9IG1peGluRGlzYWJsZWQoY2xhc3Mge30pO1xuXG4vLyBDb3VudGVyIGZvciB1bmlxdWUgZ3JvdXAgaWRzLlxubGV0IF91bmlxdWVPcHRncm91cElkQ291bnRlciA9IDA7XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIF9NYXRPcHRncm91cEJhc2UgZXh0ZW5kcyBfTWF0T3B0Z3JvdXBNaXhpbkJhc2UgaW1wbGVtZW50cyBDYW5EaXNhYmxlIHtcbiAgLyoqIExhYmVsIGZvciB0aGUgb3B0aW9uIGdyb3VwLiAqL1xuICBASW5wdXQoKSBsYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoZSB1bmRlcmx5aW5nIGxhYmVsLiAqL1xuICBfbGFiZWxJZDogc3RyaW5nID0gYG1hdC1vcHRncm91cC1sYWJlbC0ke191bmlxdWVPcHRncm91cElkQ291bnRlcisrfWA7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGdyb3VwIGlzIGluIGluZXJ0IGExMXkgbW9kZS4gKi9cbiAgX2luZXJ0OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5UKSBAT3B0aW9uYWwoKSBwYXJlbnQ/OiBNYXRPcHRpb25QYXJlbnRDb21wb25lbnQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2luZXJ0ID0gcGFyZW50Py5pbmVydEdyb3VwcyA/PyBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYE1hdE9wdGdyb3VwYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRPcHRncm91cGAgY2xhc3Mgd2hpY2ggY291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBjb21wb25lbnQgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfT1BUR1JPVVAgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0T3B0Z3JvdXA+KCdNYXRPcHRncm91cCcpO1xuXG4vKipcbiAqIENvbXBvbmVudCB0aGF0IGlzIHVzZWQgdG8gZ3JvdXAgaW5zdGFuY2VzIG9mIGBtYXQtb3B0aW9uYC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LW9wdGdyb3VwJyxcbiAgZXhwb3J0QXM6ICdtYXRPcHRncm91cCcsXG4gIHRlbXBsYXRlVXJsOiAnb3B0Z3JvdXAuaHRtbCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnXSxcbiAgc3R5bGVVcmxzOiBbJ29wdGdyb3VwLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtb3B0Z3JvdXAnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdfaW5lcnQgPyBudWxsIDogXCJncm91cFwiJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnX2luZXJ0ID8gbnVsbCA6IGRpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19pbmVydCA/IG51bGwgOiBfbGFiZWxJZCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfT1BUR1JPVVAsIHVzZUV4aXN0aW5nOiBNYXRPcHRncm91cH1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRPcHRncm91cCBleHRlbmRzIF9NYXRPcHRncm91cEJhc2Uge31cbiIsIjxzcGFuXG4gIGNsYXNzPVwibWF0LW1kYy1vcHRncm91cC1sYWJlbFwiXG4gIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gIFtjbGFzcy5tZGMtbGlzdC1pdGVtLS1kaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gIFtpZF09XCJfbGFiZWxJZFwiPlxuICA8c3BhbiBjbGFzcz1cIm1kYy1saXN0LWl0ZW1fX3ByaW1hcnktdGV4dFwiPnt7IGxhYmVsIH19IDxuZy1jb250ZW50PjwvbmctY29udGVudD48L3NwYW4+XG48L3NwYW4+XG5cbjxuZy1jb250ZW50IHNlbGVjdD1cIm1hdC1vcHRpb24sIG5nLWNvbnRhaW5lclwiPjwvbmctY29udGVudD5cbiJdfQ==