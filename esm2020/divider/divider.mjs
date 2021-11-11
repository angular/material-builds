/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
export class MatDivider {
    constructor() {
        this._vertical = false;
        this._inset = false;
    }
    /** Whether the divider is vertically aligned. */
    get vertical() {
        return this._vertical;
    }
    set vertical(value) {
        this._vertical = coerceBooleanProperty(value);
    }
    /** Whether the divider is an inset divider. */
    get inset() {
        return this._inset;
    }
    set inset(value) {
        this._inset = coerceBooleanProperty(value);
    }
}
MatDivider.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatDivider, deps: [], target: i0.ɵɵFactoryTarget.Component });
MatDivider.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.1", type: MatDivider, selector: "mat-divider", inputs: { vertical: "vertical", inset: "inset" }, host: { attributes: { "role": "separator" }, properties: { "attr.aria-orientation": "vertical ? \"vertical\" : \"horizontal\"", "class.mat-divider-vertical": "vertical", "class.mat-divider-horizontal": "!vertical", "class.mat-divider-inset": "inset" }, classAttribute: "mat-divider" }, ngImport: i0, template: '', isInline: true, styles: [".mat-divider{display:block;margin:0;border-top-width:1px;border-top-style:solid}.mat-divider.mat-divider-vertical{border-top:0;border-right-width:1px;border-right-style:solid}.mat-divider.mat-divider-inset{margin-left:80px}[dir=rtl] .mat-divider.mat-divider-inset{margin-left:auto;margin-right:80px}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatDivider, decorators: [{
            type: Component,
            args: [{ selector: 'mat-divider', host: {
                        'role': 'separator',
                        '[attr.aria-orientation]': 'vertical ? "vertical" : "horizontal"',
                        '[class.mat-divider-vertical]': 'vertical',
                        '[class.mat-divider-horizontal]': '!vertical',
                        '[class.mat-divider-inset]': 'inset',
                        'class': 'mat-divider',
                    }, template: '', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, styles: [".mat-divider{display:block;margin:0;border-top-width:1px;border-top-style:solid}.mat-divider.mat-divider-vertical{border-top:0;border-right-width:1px;border-right-style:solid}.mat-divider.mat-divider-inset{margin-left:80px}[dir=rtl] .mat-divider.mat-divider-inset{margin-left:auto;margin-right:80px}\n"] }]
        }], propDecorators: { vertical: [{
                type: Input
            }], inset: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGl2aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaXZpZGVyL2RpdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDM0YsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7O0FBaUIxRSxNQUFNLE9BQU8sVUFBVTtJQWZ2QjtRQXdCVSxjQUFTLEdBQVksS0FBSyxDQUFDO1FBVTNCLFdBQU0sR0FBWSxLQUFLLENBQUM7S0FJakM7SUF0QkMsaURBQWlEO0lBQ2pELElBQ0ksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBQ0QsSUFBSSxRQUFRLENBQUMsS0FBYztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFHRCwrQ0FBK0M7SUFDL0MsSUFDSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxJQUFJLEtBQUssQ0FBQyxLQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0MsQ0FBQzs7dUdBbEJVLFVBQVU7MkZBQVYsVUFBVSxtWUFMWCxFQUFFOzJGQUtELFVBQVU7a0JBZnRCLFNBQVM7K0JBQ0UsYUFBYSxRQUNqQjt3QkFDSixNQUFNLEVBQUUsV0FBVzt3QkFDbkIseUJBQXlCLEVBQUUsc0NBQXNDO3dCQUNqRSw4QkFBOEIsRUFBRSxVQUFVO3dCQUMxQyxnQ0FBZ0MsRUFBRSxXQUFXO3dCQUM3QywyQkFBMkIsRUFBRSxPQUFPO3dCQUNwQyxPQUFPLEVBQUUsYUFBYTtxQkFDdkIsWUFDUyxFQUFFLGlCQUVHLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU07OEJBSzNDLFFBQVE7c0JBRFgsS0FBSztnQkFXRixLQUFLO3NCQURSLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbnB1dCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRpdmlkZXInLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnc2VwYXJhdG9yJyxcbiAgICAnW2F0dHIuYXJpYS1vcmllbnRhdGlvbl0nOiAndmVydGljYWwgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIicsXG4gICAgJ1tjbGFzcy5tYXQtZGl2aWRlci12ZXJ0aWNhbF0nOiAndmVydGljYWwnLFxuICAgICdbY2xhc3MubWF0LWRpdmlkZXItaG9yaXpvbnRhbF0nOiAnIXZlcnRpY2FsJyxcbiAgICAnW2NsYXNzLm1hdC1kaXZpZGVyLWluc2V0XSc6ICdpbnNldCcsXG4gICAgJ2NsYXNzJzogJ21hdC1kaXZpZGVyJyxcbiAgfSxcbiAgdGVtcGxhdGU6ICcnLFxuICBzdHlsZVVybHM6IFsnZGl2aWRlci5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdERpdmlkZXIge1xuICAvKiogV2hldGhlciB0aGUgZGl2aWRlciBpcyB2ZXJ0aWNhbGx5IGFsaWduZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2ZXJ0aWNhbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdmVydGljYWw7XG4gIH1cbiAgc2V0IHZlcnRpY2FsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fdmVydGljYWwgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3ZlcnRpY2FsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRpdmlkZXIgaXMgYW4gaW5zZXQgZGl2aWRlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGluc2V0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pbnNldDtcbiAgfVxuICBzZXQgaW5zZXQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pbnNldCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaW5zZXQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmVydGljYWw6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2luc2V0OiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=