/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
export class MatDivider {
    constructor() {
        this._vertical = false;
        this._inset = false;
    }
    /**
     * Whether the divider is vertically aligned.
     * @return {?}
     */
    get vertical() { return this._vertical; }
    /**
     * @param {?} value
     * @return {?}
     */
    set vertical(value) { this._vertical = coerceBooleanProperty(value); }
    /**
     * Whether the divider is an inset divider.
     * @return {?}
     */
    get inset() { return this._inset; }
    /**
     * @param {?} value
     * @return {?}
     */
    set inset(value) { this._inset = coerceBooleanProperty(value); }
}
MatDivider.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-divider',
                host: {
                    'role': 'separator',
                    '[attr.aria-orientation]': 'vertical ? "vertical" : "horizontal"',
                    '[class.mat-divider-vertical]': 'vertical',
                    '[class.mat-divider-horizontal]': '!vertical',
                    '[class.mat-divider-inset]': 'inset',
                    'class': 'mat-divider'
                },
                template: '',
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-divider{display:block;margin:0;border-top-width:1px;border-top-style:solid}.mat-divider.mat-divider-vertical{border-top:0;border-right-width:1px;border-right-style:solid}.mat-divider.mat-divider-inset{margin-left:80px}[dir=rtl] .mat-divider.mat-divider-inset{margin-left:auto;margin-right:80px}\n"]
            }] }
];
MatDivider.propDecorators = {
    vertical: [{ type: Input }],
    inset: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MatDivider.ngAcceptInputType_vertical;
    /** @type {?} */
    MatDivider.ngAcceptInputType_inset;
    /**
     * @type {?}
     * @private
     */
    MatDivider.prototype._vertical;
    /**
     * @type {?}
     * @private
     */
    MatDivider.prototype._inset;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGl2aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaXZpZGVyL2RpdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMzRixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQWtCNUQsTUFBTSxPQUFPLFVBQVU7SUFoQnZCO1FBcUJVLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFNM0IsV0FBTSxHQUFZLEtBQUssQ0FBQztJQUlsQyxDQUFDOzs7OztJQWJDLElBQ0ksUUFBUSxLQUFjLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ2xELElBQUksUUFBUSxDQUFDLEtBQWMsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFJL0UsSUFDSSxLQUFLLEtBQWMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFDNUMsSUFBSSxLQUFLLENBQUMsS0FBYyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7WUExQjFFLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7Z0JBQ25CLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixJQUFJLEVBQUU7b0JBQ0osTUFBTSxFQUFFLFdBQVc7b0JBQ25CLHlCQUF5QixFQUFFLHNDQUFzQztvQkFDakUsOEJBQThCLEVBQUUsVUFBVTtvQkFDMUMsZ0NBQWdDLEVBQUUsV0FBVztvQkFDN0MsMkJBQTJCLEVBQUUsT0FBTztvQkFDcEMsT0FBTyxFQUFFLGFBQWE7aUJBQ3ZCO2dCQUNELFFBQVEsRUFBRSxFQUFFO2dCQUVaLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7YUFDaEQ7Ozt1QkFHRSxLQUFLO29CQU1MLEtBQUs7Ozs7SUFLTixzQ0FBb0Q7O0lBQ3BELG1DQUFpRDs7Ozs7SUFUakQsK0JBQW1DOzs7OztJQU1uQyw0QkFBZ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbnB1dCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC1kaXZpZGVyJyxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ3NlcGFyYXRvcicsXG4gICAgJ1thdHRyLmFyaWEtb3JpZW50YXRpb25dJzogJ3ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCInLFxuICAgICdbY2xhc3MubWF0LWRpdmlkZXItdmVydGljYWxdJzogJ3ZlcnRpY2FsJyxcbiAgICAnW2NsYXNzLm1hdC1kaXZpZGVyLWhvcml6b250YWxdJzogJyF2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtZGl2aWRlci1pbnNldF0nOiAnaW5zZXQnLFxuICAgICdjbGFzcyc6ICdtYXQtZGl2aWRlcidcbiAgfSxcbiAgdGVtcGxhdGU6ICcnLFxuICBzdHlsZVVybHM6IFsnZGl2aWRlci5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdERpdmlkZXIge1xuICAvKiogV2hldGhlciB0aGUgZGl2aWRlciBpcyB2ZXJ0aWNhbGx5IGFsaWduZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2ZXJ0aWNhbCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3ZlcnRpY2FsOyB9XG4gIHNldCB2ZXJ0aWNhbCh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl92ZXJ0aWNhbCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfdmVydGljYWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgZGl2aWRlciBpcyBhbiBpbnNldCBkaXZpZGVyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaW5zZXQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9pbnNldDsgfVxuICBzZXQgaW5zZXQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5faW5zZXQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2luc2V0OiBib29sZWFuID0gZmFsc2U7XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZlcnRpY2FsOiBib29sZWFuIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaW5zZXQ6IGJvb2xlYW4gfCBzdHJpbmc7XG59XG4iXX0=