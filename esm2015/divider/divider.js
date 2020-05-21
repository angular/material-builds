/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
let MatDivider = /** @class */ (() => {
    let MatDivider = class MatDivider {
        constructor() {
            this._vertical = false;
            this._inset = false;
        }
        /** Whether the divider is vertically aligned. */
        get vertical() { return this._vertical; }
        set vertical(value) { this._vertical = coerceBooleanProperty(value); }
        /** Whether the divider is an inset divider. */
        get inset() { return this._inset; }
        set inset(value) { this._inset = coerceBooleanProperty(value); }
    };
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatDivider.prototype, "vertical", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatDivider.prototype, "inset", null);
    MatDivider = __decorate([
        Component({
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
        })
    ], MatDivider);
    return MatDivider;
})();
export { MatDivider };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGl2aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaXZpZGVyL2RpdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzNGLE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBaUIxRTtJQUFBLElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVU7UUFBdkI7WUFLVSxjQUFTLEdBQVksS0FBSyxDQUFDO1lBTTNCLFdBQU0sR0FBWSxLQUFLLENBQUM7UUFJbEMsQ0FBQztRQWRDLGlEQUFpRDtRQUVqRCxJQUFJLFFBQVEsS0FBYyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2xELElBQUksUUFBUSxDQUFDLEtBQWMsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUcvRSwrQ0FBK0M7UUFFL0MsSUFBSSxLQUFLLEtBQWMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1QyxJQUFJLEtBQUssQ0FBQyxLQUFjLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FLMUUsQ0FBQTtJQVpDO1FBREMsS0FBSyxFQUFFOzs7OENBQzBDO0lBTWxEO1FBREMsS0FBSyxFQUFFOzs7MkNBQ29DO0lBVGpDLFVBQVU7UUFmdEIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGFBQWE7WUFDdkIsSUFBSSxFQUFFO2dCQUNKLE1BQU0sRUFBRSxXQUFXO2dCQUNuQix5QkFBeUIsRUFBRSxzQ0FBc0M7Z0JBQ2pFLDhCQUE4QixFQUFFLFVBQVU7Z0JBQzFDLGdDQUFnQyxFQUFFLFdBQVc7Z0JBQzdDLDJCQUEyQixFQUFFLE9BQU87Z0JBQ3BDLE9BQU8sRUFBRSxhQUFhO2FBQ3ZCO1lBQ0QsUUFBUSxFQUFFLEVBQUU7WUFFWixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtZQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7U0FDaEQsQ0FBQztPQUNXLFVBQVUsQ0FldEI7SUFBRCxpQkFBQztLQUFBO1NBZlksVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIElucHV0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGl2aWRlcicsXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdzZXBhcmF0b3InLFxuICAgICdbYXR0ci5hcmlhLW9yaWVudGF0aW9uXSc6ICd2ZXJ0aWNhbCA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1kaXZpZGVyLXZlcnRpY2FsXSc6ICd2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtZGl2aWRlci1ob3Jpem9udGFsXSc6ICchdmVydGljYWwnLFxuICAgICdbY2xhc3MubWF0LWRpdmlkZXItaW5zZXRdJzogJ2luc2V0JyxcbiAgICAnY2xhc3MnOiAnbWF0LWRpdmlkZXInXG4gIH0sXG4gIHRlbXBsYXRlOiAnJyxcbiAgc3R5bGVVcmxzOiBbJ2RpdmlkZXIuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREaXZpZGVyIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGRpdmlkZXIgaXMgdmVydGljYWxseSBhbGlnbmVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmVydGljYWwoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl92ZXJ0aWNhbDsgfVxuICBzZXQgdmVydGljYWwodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fdmVydGljYWwgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX3ZlcnRpY2FsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRpdmlkZXIgaXMgYW4gaW5zZXQgZGl2aWRlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGluc2V0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faW5zZXQ7IH1cbiAgc2V0IGluc2V0KHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2luc2V0ID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9pbnNldDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV92ZXJ0aWNhbDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaW5zZXQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==