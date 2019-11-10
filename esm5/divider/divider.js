/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
var MatDivider = /** @class */ (function () {
    function MatDivider() {
        this._vertical = false;
        this._inset = false;
    }
    Object.defineProperty(MatDivider.prototype, "vertical", {
        /** Whether the divider is vertically aligned. */
        get: function () { return this._vertical; },
        set: function (value) { this._vertical = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDivider.prototype, "inset", {
        /** Whether the divider is an inset divider. */
        get: function () { return this._inset; },
        set: function (value) { this._inset = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    MatDivider.decorators = [
        { type: Component, args: [{
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
    return MatDivider;
}());
export { MatDivider };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGl2aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaXZpZGVyL2RpdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDM0YsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFNUQ7SUFBQTtRQW9CVSxjQUFTLEdBQVksS0FBSyxDQUFDO1FBTTNCLFdBQU0sR0FBWSxLQUFLLENBQUM7SUFJbEMsQ0FBQztJQWJDLHNCQUNJLGdDQUFRO1FBRlosaURBQWlEO2FBQ2pELGNBQzBCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7YUFDbEQsVUFBYSxLQUFjLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUQ3QjtJQUtsRCxzQkFDSSw2QkFBSztRQUZULCtDQUErQzthQUMvQyxjQUN1QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBQzVDLFVBQVUsS0FBYyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FEN0I7O2dCQXhCN0MsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO29CQUN2QixJQUFJLEVBQUU7d0JBQ0osTUFBTSxFQUFFLFdBQVc7d0JBQ25CLHlCQUF5QixFQUFFLHNDQUFzQzt3QkFDakUsOEJBQThCLEVBQUUsVUFBVTt3QkFDMUMsZ0NBQWdDLEVBQUUsV0FBVzt3QkFDN0MsMkJBQTJCLEVBQUUsT0FBTzt3QkFDcEMsT0FBTyxFQUFFLGFBQWE7cUJBQ3ZCO29CQUNELFFBQVEsRUFBRSxFQUFFO29CQUVaLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7aUJBQ2hEOzs7MkJBR0UsS0FBSzt3QkFNTCxLQUFLOztJQU9SLGlCQUFDO0NBQUEsQUE5QkQsSUE4QkM7U0FmWSxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGl2aWRlcicsXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdzZXBhcmF0b3InLFxuICAgICdbYXR0ci5hcmlhLW9yaWVudGF0aW9uXSc6ICd2ZXJ0aWNhbCA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1kaXZpZGVyLXZlcnRpY2FsXSc6ICd2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtZGl2aWRlci1ob3Jpem9udGFsXSc6ICchdmVydGljYWwnLFxuICAgICdbY2xhc3MubWF0LWRpdmlkZXItaW5zZXRdJzogJ2luc2V0JyxcbiAgICAnY2xhc3MnOiAnbWF0LWRpdmlkZXInXG4gIH0sXG4gIHRlbXBsYXRlOiAnJyxcbiAgc3R5bGVVcmxzOiBbJ2RpdmlkZXIuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREaXZpZGVyIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGRpdmlkZXIgaXMgdmVydGljYWxseSBhbGlnbmVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmVydGljYWwoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl92ZXJ0aWNhbDsgfVxuICBzZXQgdmVydGljYWwodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fdmVydGljYWwgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX3ZlcnRpY2FsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRpdmlkZXIgaXMgYW4gaW5zZXQgZGl2aWRlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGluc2V0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faW5zZXQ7IH1cbiAgc2V0IGluc2V0KHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2luc2V0ID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9pbnNldDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV92ZXJ0aWNhbDogYm9vbGVhbiB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9pbnNldDogYm9vbGVhbiB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG59XG4iXX0=