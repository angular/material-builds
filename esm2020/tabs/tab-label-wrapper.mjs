import { Directive, ElementRef } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import * as i0 from "@angular/core";
// Boilerplate for applying mixins to MatTabLabelWrapper.
/** @docs-private */
const _MatTabLabelWrapperBase = mixinDisabled(class {
});
/**
 * Used in the `mat-tab-group` view to display tab labels.
 * @docs-private
 */
export class MatTabLabelWrapper extends _MatTabLabelWrapperBase {
    constructor(elementRef) {
        super();
        this.elementRef = elementRef;
    }
    /** Sets focus on the wrapper element */
    focus() {
        this.elementRef.nativeElement.focus();
    }
    getOffsetLeft() {
        return this.elementRef.nativeElement.offsetLeft;
    }
    getOffsetWidth() {
        return this.elementRef.nativeElement.offsetWidth;
    }
}
MatTabLabelWrapper.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTabLabelWrapper, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
MatTabLabelWrapper.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatTabLabelWrapper, selector: "[matTabLabelWrapper]", inputs: { disabled: "disabled" }, host: { properties: { "class.mat-tab-disabled": "disabled", "attr.aria-disabled": "!!disabled" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTabLabelWrapper, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTabLabelWrapper]',
                    inputs: ['disabled'],
                    host: {
                        '[class.mat-tab-disabled]': 'disabled',
                        '[attr.aria-disabled]': '!!disabled',
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWxhYmVsLXdyYXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItbGFiZWwtd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQWEsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7O0FBR2pFLHlEQUF5RDtBQUN6RCxvQkFBb0I7QUFDcEIsTUFBTSx1QkFBdUIsR0FBRyxhQUFhLENBQUM7Q0FBUSxDQUFDLENBQUM7QUFFeEQ7OztHQUdHO0FBU0gsTUFBTSxPQUFPLGtCQUFtQixTQUFRLHVCQUF1QjtJQUM3RCxZQUFtQixVQUFzQjtRQUN2QyxLQUFLLEVBQUUsQ0FBQztRQURTLGVBQVUsR0FBVixVQUFVLENBQVk7SUFFekMsQ0FBQztJQUVELHdDQUF3QztJQUN4QyxLQUFLO1FBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztJQUNsRCxDQUFDO0lBRUQsY0FBYztRQUNaLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO0lBQ25ELENBQUM7O3VIQWhCVSxrQkFBa0I7MkdBQWxCLGtCQUFrQjttR0FBbEIsa0JBQWtCO2tCQVI5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQztvQkFDcEIsSUFBSSxFQUFFO3dCQUNKLDBCQUEwQixFQUFFLFVBQVU7d0JBQ3RDLHNCQUFzQixFQUFFLFlBQVk7cUJBQ3JDO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBtaXhpbkRpc2FibGVkfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFRhYkxhYmVsV3JhcHBlci5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0VGFiTGFiZWxXcmFwcGVyQmFzZSA9IG1peGluRGlzYWJsZWQoY2xhc3Mge30pO1xuXG4vKipcbiAqIFVzZWQgaW4gdGhlIGBtYXQtdGFiLWdyb3VwYCB2aWV3IHRvIGRpc3BsYXkgdGFiIGxhYmVscy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFRhYkxhYmVsV3JhcHBlcl0nLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnXSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MubWF0LXRhYi1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICchIWRpc2FibGVkJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWJMYWJlbFdyYXBwZXIgZXh0ZW5kcyBfTWF0VGFiTGFiZWxXcmFwcGVyQmFzZSBpbXBsZW1lbnRzIENhbkRpc2FibGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiogU2V0cyBmb2N1cyBvbiB0aGUgd3JhcHBlciBlbGVtZW50ICovXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICBnZXRPZmZzZXRMZWZ0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldExlZnQ7XG4gIH1cblxuICBnZXRPZmZzZXRXaWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19