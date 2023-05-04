/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ViewEncapsulation, Input, ChangeDetectionStrategy, Inject, Optional, } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
/**
 * Component that shows a simplified checkbox without including any kind of "real" checkbox.
 * Meant to be used when the checkbox is purely decorative and a large number of them will be
 * included, such as for the options in a multi-select. Uses no SVGs or complex animations.
 * Note that theming is meant to be handled by the parent element, e.g.
 * `mat-primary .mat-pseudo-checkbox`.
 *
 * Note that this component will be completely invisible to screen-reader users. This is *not*
 * interchangeable with `<mat-checkbox>` and should *not* be used if the user would directly
 * interact with the checkbox. The pseudo-checkbox should only be used as an implementation detail
 * of more complex components that appropriately handle selected / checked state.
 * @docs-private
 */
class MatPseudoCheckbox {
    constructor(_animationMode) {
        this._animationMode = _animationMode;
        /** Display state of the checkbox. */
        this.state = 'unchecked';
        /** Whether the checkbox is disabled. */
        this.disabled = false;
        /**
         * Appearance of the pseudo checkbox. Default appearance of 'full' renders a checkmark/mixedmark
         * indicator inside a square box. 'minimal' appearance only renders the checkmark/mixedmark.
         */
        this.appearance = 'full';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatPseudoCheckbox, deps: [{ token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatPseudoCheckbox, selector: "mat-pseudo-checkbox", inputs: { state: "state", disabled: "disabled", appearance: "appearance" }, host: { properties: { "class.mat-pseudo-checkbox-indeterminate": "state === \"indeterminate\"", "class.mat-pseudo-checkbox-checked": "state === \"checked\"", "class.mat-pseudo-checkbox-disabled": "disabled", "class.mat-pseudo-checkbox-minimal": "appearance === \"minimal\"", "class.mat-pseudo-checkbox-full": "appearance === \"full\"", "class._mat-animation-noopable": "_animationMode === \"NoopAnimations\"" }, classAttribute: "mat-pseudo-checkbox" }, ngImport: i0, template: '', isInline: true, styles: [".mat-pseudo-checkbox{border-radius:2px;cursor:pointer;display:inline-block;vertical-align:middle;box-sizing:border-box;position:relative;flex-shrink:0;transition:border-color 90ms cubic-bezier(0, 0, 0.2, 0.1),background-color 90ms cubic-bezier(0, 0, 0.2, 0.1)}.mat-pseudo-checkbox::after{position:absolute;opacity:0;content:\"\";border-bottom:2px solid currentColor;transition:opacity 90ms cubic-bezier(0, 0, 0.2, 0.1)}.mat-pseudo-checkbox._mat-animation-noopable{transition:none !important;animation:none !important}.mat-pseudo-checkbox._mat-animation-noopable::after{transition:none}.mat-pseudo-checkbox-disabled{cursor:default}.mat-pseudo-checkbox-indeterminate::after{left:1px;opacity:1;border-radius:2px}.mat-pseudo-checkbox-checked::after{left:1px;border-left:2px solid currentColor;transform:rotate(-45deg);opacity:1;box-sizing:content-box}.mat-pseudo-checkbox-full{border:2px solid}.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked,.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate{border-color:rgba(0,0,0,0)}.mat-pseudo-checkbox{width:18px;height:18px}.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after{width:14px;height:6px;transform-origin:center;top:-4.2426406871px;left:0;bottom:0;right:0;margin:auto}.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after{top:8px;width:16px}.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after{width:10px;height:4px;transform-origin:center;top:-2.8284271247px;left:0;bottom:0;right:0;margin:auto}.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after{top:6px;width:12px}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatPseudoCheckbox };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatPseudoCheckbox, decorators: [{
            type: Component,
            args: [{ encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, selector: 'mat-pseudo-checkbox', template: '', host: {
                        'class': 'mat-pseudo-checkbox',
                        '[class.mat-pseudo-checkbox-indeterminate]': 'state === "indeterminate"',
                        '[class.mat-pseudo-checkbox-checked]': 'state === "checked"',
                        '[class.mat-pseudo-checkbox-disabled]': 'disabled',
                        '[class.mat-pseudo-checkbox-minimal]': 'appearance === "minimal"',
                        '[class.mat-pseudo-checkbox-full]': 'appearance === "full"',
                        '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                    }, styles: [".mat-pseudo-checkbox{border-radius:2px;cursor:pointer;display:inline-block;vertical-align:middle;box-sizing:border-box;position:relative;flex-shrink:0;transition:border-color 90ms cubic-bezier(0, 0, 0.2, 0.1),background-color 90ms cubic-bezier(0, 0, 0.2, 0.1)}.mat-pseudo-checkbox::after{position:absolute;opacity:0;content:\"\";border-bottom:2px solid currentColor;transition:opacity 90ms cubic-bezier(0, 0, 0.2, 0.1)}.mat-pseudo-checkbox._mat-animation-noopable{transition:none !important;animation:none !important}.mat-pseudo-checkbox._mat-animation-noopable::after{transition:none}.mat-pseudo-checkbox-disabled{cursor:default}.mat-pseudo-checkbox-indeterminate::after{left:1px;opacity:1;border-radius:2px}.mat-pseudo-checkbox-checked::after{left:1px;border-left:2px solid currentColor;transform:rotate(-45deg);opacity:1;box-sizing:content-box}.mat-pseudo-checkbox-full{border:2px solid}.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked,.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate{border-color:rgba(0,0,0,0)}.mat-pseudo-checkbox{width:18px;height:18px}.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after{width:14px;height:6px;transform-origin:center;top:-4.2426406871px;left:0;bottom:0;right:0;margin:auto}.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after{top:8px;width:16px}.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after{width:10px;height:4px;transform-origin:center;top:-2.8284271247px;left:0;bottom:0;right:0;margin:auto}.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after{top:6px;width:12px}"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { state: [{
                type: Input
            }], disabled: [{
                type: Input
            }], appearance: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHNldWRvLWNoZWNrYm94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvc2VsZWN0aW9uL3BzZXVkby1jaGVja2JveC9wc2V1ZG8tY2hlY2tib3gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsS0FBSyxFQUNMLHVCQUF1QixFQUN2QixNQUFNLEVBQ04sUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDOztBQVEzRTs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQWdCYSxpQkFBaUI7SUFhNUIsWUFBOEQsY0FBdUI7UUFBdkIsbUJBQWMsR0FBZCxjQUFjLENBQVM7UUFackYscUNBQXFDO1FBQzVCLFVBQUssR0FBMkIsV0FBVyxDQUFDO1FBRXJELHdDQUF3QztRQUMvQixhQUFRLEdBQVksS0FBSyxDQUFDO1FBRW5DOzs7V0FHRztRQUNNLGVBQVUsR0FBdUIsTUFBTSxDQUFDO0lBRXVDLENBQUM7OEdBYjlFLGlCQUFpQixrQkFhSSxxQkFBcUI7a0dBYjFDLGlCQUFpQiw0a0JBWGxCLEVBQUU7O1NBV0QsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBaEI3QixTQUFTO29DQUNPLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU0sWUFDckMscUJBQXFCLFlBRXJCLEVBQUUsUUFDTjt3QkFDSixPQUFPLEVBQUUscUJBQXFCO3dCQUM5QiwyQ0FBMkMsRUFBRSwyQkFBMkI7d0JBQ3hFLHFDQUFxQyxFQUFFLHFCQUFxQjt3QkFDNUQsc0NBQXNDLEVBQUUsVUFBVTt3QkFDbEQscUNBQXFDLEVBQUUsMEJBQTBCO3dCQUNqRSxrQ0FBa0MsRUFBRSx1QkFBdUI7d0JBQzNELGlDQUFpQyxFQUFFLHFDQUFxQztxQkFDekU7OzBCQWVZLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzRDQVg1QyxLQUFLO3NCQUFiLEtBQUs7Z0JBR0csUUFBUTtzQkFBaEIsS0FBSztnQkFNRyxVQUFVO3NCQUFsQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIElucHV0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgSW5qZWN0LFxuICBPcHRpb25hbCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuLyoqXG4gKiBQb3NzaWJsZSBzdGF0ZXMgZm9yIGEgcHNldWRvIGNoZWNrYm94LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgdHlwZSBNYXRQc2V1ZG9DaGVja2JveFN0YXRlID0gJ3VuY2hlY2tlZCcgfCAnY2hlY2tlZCcgfCAnaW5kZXRlcm1pbmF0ZSc7XG5cbi8qKlxuICogQ29tcG9uZW50IHRoYXQgc2hvd3MgYSBzaW1wbGlmaWVkIGNoZWNrYm94IHdpdGhvdXQgaW5jbHVkaW5nIGFueSBraW5kIG9mIFwicmVhbFwiIGNoZWNrYm94LlxuICogTWVhbnQgdG8gYmUgdXNlZCB3aGVuIHRoZSBjaGVja2JveCBpcyBwdXJlbHkgZGVjb3JhdGl2ZSBhbmQgYSBsYXJnZSBudW1iZXIgb2YgdGhlbSB3aWxsIGJlXG4gKiBpbmNsdWRlZCwgc3VjaCBhcyBmb3IgdGhlIG9wdGlvbnMgaW4gYSBtdWx0aS1zZWxlY3QuIFVzZXMgbm8gU1ZHcyBvciBjb21wbGV4IGFuaW1hdGlvbnMuXG4gKiBOb3RlIHRoYXQgdGhlbWluZyBpcyBtZWFudCB0byBiZSBoYW5kbGVkIGJ5IHRoZSBwYXJlbnQgZWxlbWVudCwgZS5nLlxuICogYG1hdC1wcmltYXJ5IC5tYXQtcHNldWRvLWNoZWNrYm94YC5cbiAqXG4gKiBOb3RlIHRoYXQgdGhpcyBjb21wb25lbnQgd2lsbCBiZSBjb21wbGV0ZWx5IGludmlzaWJsZSB0byBzY3JlZW4tcmVhZGVyIHVzZXJzLiBUaGlzIGlzICpub3QqXG4gKiBpbnRlcmNoYW5nZWFibGUgd2l0aCBgPG1hdC1jaGVja2JveD5gIGFuZCBzaG91bGQgKm5vdCogYmUgdXNlZCBpZiB0aGUgdXNlciB3b3VsZCBkaXJlY3RseVxuICogaW50ZXJhY3Qgd2l0aCB0aGUgY2hlY2tib3guIFRoZSBwc2V1ZG8tY2hlY2tib3ggc2hvdWxkIG9ubHkgYmUgdXNlZCBhcyBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWxcbiAqIG9mIG1vcmUgY29tcGxleCBjb21wb25lbnRzIHRoYXQgYXBwcm9wcmlhdGVseSBoYW5kbGUgc2VsZWN0ZWQgLyBjaGVja2VkIHN0YXRlLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHNlbGVjdG9yOiAnbWF0LXBzZXVkby1jaGVja2JveCcsXG4gIHN0eWxlVXJsczogWydwc2V1ZG8tY2hlY2tib3guY3NzJ10sXG4gIHRlbXBsYXRlOiAnJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtcHNldWRvLWNoZWNrYm94JyxcbiAgICAnW2NsYXNzLm1hdC1wc2V1ZG8tY2hlY2tib3gtaW5kZXRlcm1pbmF0ZV0nOiAnc3RhdGUgPT09IFwiaW5kZXRlcm1pbmF0ZVwiJyxcbiAgICAnW2NsYXNzLm1hdC1wc2V1ZG8tY2hlY2tib3gtY2hlY2tlZF0nOiAnc3RhdGUgPT09IFwiY2hlY2tlZFwiJyxcbiAgICAnW2NsYXNzLm1hdC1wc2V1ZG8tY2hlY2tib3gtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1wc2V1ZG8tY2hlY2tib3gtbWluaW1hbF0nOiAnYXBwZWFyYW5jZSA9PT0gXCJtaW5pbWFsXCInLFxuICAgICdbY2xhc3MubWF0LXBzZXVkby1jaGVja2JveC1mdWxsXSc6ICdhcHBlYXJhbmNlID09PSBcImZ1bGxcIicsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFBzZXVkb0NoZWNrYm94IHtcbiAgLyoqIERpc3BsYXkgc3RhdGUgb2YgdGhlIGNoZWNrYm94LiAqL1xuICBASW5wdXQoKSBzdGF0ZTogTWF0UHNldWRvQ2hlY2tib3hTdGF0ZSA9ICd1bmNoZWNrZWQnO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGVja2JveCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogQXBwZWFyYW5jZSBvZiB0aGUgcHNldWRvIGNoZWNrYm94LiBEZWZhdWx0IGFwcGVhcmFuY2Ugb2YgJ2Z1bGwnIHJlbmRlcnMgYSBjaGVja21hcmsvbWl4ZWRtYXJrXG4gICAqIGluZGljYXRvciBpbnNpZGUgYSBzcXVhcmUgYm94LiAnbWluaW1hbCcgYXBwZWFyYW5jZSBvbmx5IHJlbmRlcnMgdGhlIGNoZWNrbWFyay9taXhlZG1hcmsuXG4gICAqL1xuICBASW5wdXQoKSBhcHBlYXJhbmNlOiAnbWluaW1hbCcgfCAnZnVsbCcgPSAnZnVsbCc7XG5cbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykge31cbn1cbiJdfQ==