/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Input } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Internal directive that maintains a MDC floating label. This directive does not
 * use the `MDCFloatingLabelFoundation` class, as it is not worth the size cost of
 * including it just to measure the label width and toggle some classes.
 *
 * The use of a directive allows us to conditionally render a floating label in the
 * template without having to manually manage instantiation and destruction of the
 * floating label component based on.
 *
 * The component is responsible for setting up the floating label styles, measuring label
 * width for the outline notch, and providing inputs that can be used to toggle the
 * label's floating or required state.
 */
class MatFormFieldFloatingLabel {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
        /** Whether the label is floating. */
        this.floating = false;
    }
    /** Gets the width of the label. Used for the outline notch. */
    getWidth() {
        return estimateScrollWidth(this._elementRef.nativeElement);
    }
    /** Gets the HTML element for the floating label. */
    get element() {
        return this._elementRef.nativeElement;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFormFieldFloatingLabel, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatFormFieldFloatingLabel, selector: "label[matFormFieldFloatingLabel]", inputs: { floating: "floating" }, host: { properties: { "class.mdc-floating-label--float-above": "floating" }, classAttribute: "mdc-floating-label mat-mdc-floating-label" }, ngImport: i0 }); }
}
export { MatFormFieldFloatingLabel };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFormFieldFloatingLabel, decorators: [{
            type: Directive,
            args: [{
                    selector: 'label[matFormFieldFloatingLabel]',
                    host: {
                        'class': 'mdc-floating-label mat-mdc-floating-label',
                        '[class.mdc-floating-label--float-above]': 'floating',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { floating: [{
                type: Input
            }] } });
/**
 * Estimates the scroll width of an element.
 * via https://github.com/material-components/material-components-web/blob/c0a11ef0d000a098fd0c372be8f12d6a99302855/packages/mdc-dom/ponyfill.ts
 */
function estimateScrollWidth(element) {
    // Check the offsetParent. If the element inherits display: none from any
    // parent, the offsetParent property will be null (see
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
    // This check ensures we only clone the node when necessary.
    const htmlEl = element;
    if (htmlEl.offsetParent !== null) {
        return htmlEl.scrollWidth;
    }
    const clone = htmlEl.cloneNode(true);
    clone.style.setProperty('position', 'absolute');
    clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
    document.documentElement.appendChild(clone);
    const scrollWidth = clone.scrollWidth;
    clone.remove();
    return scrollWidth;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXRpbmctbGFiZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9kaXJlY3RpdmVzL2Zsb2F0aW5nLWxhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFFM0Q7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsTUFPYSx5QkFBeUI7SUFJcEMsWUFBb0IsV0FBb0M7UUFBcEMsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBSHhELHFDQUFxQztRQUM1QixhQUFRLEdBQVksS0FBSyxDQUFDO0lBRXdCLENBQUM7SUFFNUQsK0RBQStEO0lBQy9ELFFBQVE7UUFDTixPQUFPLG1CQUFtQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELG9EQUFvRDtJQUNwRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDO0lBQ3hDLENBQUM7OEdBZFUseUJBQXlCO2tHQUF6Qix5QkFBeUI7O1NBQXpCLHlCQUF5QjsyRkFBekIseUJBQXlCO2tCQVByQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxrQ0FBa0M7b0JBQzVDLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsMkNBQTJDO3dCQUNwRCx5Q0FBeUMsRUFBRSxVQUFVO3FCQUN0RDtpQkFDRjtpR0FHVSxRQUFRO3NCQUFoQixLQUFLOztBQWVSOzs7R0FHRztBQUNILFNBQVMsbUJBQW1CLENBQUMsT0FBb0I7SUFDL0MseUVBQXlFO0lBQ3pFLHNEQUFzRDtJQUN0RCw4RUFBOEU7SUFDOUUsNERBQTREO0lBQzVELE1BQU0sTUFBTSxHQUFHLE9BQXNCLENBQUM7SUFDdEMsSUFBSSxNQUFNLENBQUMsWUFBWSxLQUFLLElBQUksRUFBRTtRQUNoQyxPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUM7S0FDM0I7SUFFRCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBZ0IsQ0FBQztJQUNwRCxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLDZCQUE2QixDQUFDLENBQUM7SUFDcEUsUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztJQUN0QyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDZixPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogSW50ZXJuYWwgZGlyZWN0aXZlIHRoYXQgbWFpbnRhaW5zIGEgTURDIGZsb2F0aW5nIGxhYmVsLiBUaGlzIGRpcmVjdGl2ZSBkb2VzIG5vdFxuICogdXNlIHRoZSBgTURDRmxvYXRpbmdMYWJlbEZvdW5kYXRpb25gIGNsYXNzLCBhcyBpdCBpcyBub3Qgd29ydGggdGhlIHNpemUgY29zdCBvZlxuICogaW5jbHVkaW5nIGl0IGp1c3QgdG8gbWVhc3VyZSB0aGUgbGFiZWwgd2lkdGggYW5kIHRvZ2dsZSBzb21lIGNsYXNzZXMuXG4gKlxuICogVGhlIHVzZSBvZiBhIGRpcmVjdGl2ZSBhbGxvd3MgdXMgdG8gY29uZGl0aW9uYWxseSByZW5kZXIgYSBmbG9hdGluZyBsYWJlbCBpbiB0aGVcbiAqIHRlbXBsYXRlIHdpdGhvdXQgaGF2aW5nIHRvIG1hbnVhbGx5IG1hbmFnZSBpbnN0YW50aWF0aW9uIGFuZCBkZXN0cnVjdGlvbiBvZiB0aGVcbiAqIGZsb2F0aW5nIGxhYmVsIGNvbXBvbmVudCBiYXNlZCBvbi5cbiAqXG4gKiBUaGUgY29tcG9uZW50IGlzIHJlc3BvbnNpYmxlIGZvciBzZXR0aW5nIHVwIHRoZSBmbG9hdGluZyBsYWJlbCBzdHlsZXMsIG1lYXN1cmluZyBsYWJlbFxuICogd2lkdGggZm9yIHRoZSBvdXRsaW5lIG5vdGNoLCBhbmQgcHJvdmlkaW5nIGlucHV0cyB0aGF0IGNhbiBiZSB1c2VkIHRvIHRvZ2dsZSB0aGVcbiAqIGxhYmVsJ3MgZmxvYXRpbmcgb3IgcmVxdWlyZWQgc3RhdGUuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2xhYmVsW21hdEZvcm1GaWVsZEZsb2F0aW5nTGFiZWxdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtZGMtZmxvYXRpbmctbGFiZWwgbWF0LW1kYy1mbG9hdGluZy1sYWJlbCcsXG4gICAgJ1tjbGFzcy5tZGMtZmxvYXRpbmctbGFiZWwtLWZsb2F0LWFib3ZlXSc6ICdmbG9hdGluZycsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEZvcm1GaWVsZEZsb2F0aW5nTGFiZWwge1xuICAvKiogV2hldGhlciB0aGUgbGFiZWwgaXMgZmxvYXRpbmcuICovXG4gIEBJbnB1dCgpIGZsb2F0aW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHt9XG5cbiAgLyoqIEdldHMgdGhlIHdpZHRoIG9mIHRoZSBsYWJlbC4gVXNlZCBmb3IgdGhlIG91dGxpbmUgbm90Y2guICovXG4gIGdldFdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIGVzdGltYXRlU2Nyb2xsV2lkdGgodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBIVE1MIGVsZW1lbnQgZm9yIHRoZSBmbG9hdGluZyBsYWJlbC4gKi9cbiAgZ2V0IGVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cblxuLyoqXG4gKiBFc3RpbWF0ZXMgdGhlIHNjcm9sbCB3aWR0aCBvZiBhbiBlbGVtZW50LlxuICogdmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRlcmlhbC1jb21wb25lbnRzL21hdGVyaWFsLWNvbXBvbmVudHMtd2ViL2Jsb2IvYzBhMTFlZjBkMDAwYTA5OGZkMGMzNzJiZThmMTJkNmE5OTMwMjg1NS9wYWNrYWdlcy9tZGMtZG9tL3BvbnlmaWxsLnRzXG4gKi9cbmZ1bmN0aW9uIGVzdGltYXRlU2Nyb2xsV2lkdGgoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBudW1iZXIge1xuICAvLyBDaGVjayB0aGUgb2Zmc2V0UGFyZW50LiBJZiB0aGUgZWxlbWVudCBpbmhlcml0cyBkaXNwbGF5OiBub25lIGZyb20gYW55XG4gIC8vIHBhcmVudCwgdGhlIG9mZnNldFBhcmVudCBwcm9wZXJ0eSB3aWxsIGJlIG51bGwgKHNlZVxuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEVsZW1lbnQvb2Zmc2V0UGFyZW50KS5cbiAgLy8gVGhpcyBjaGVjayBlbnN1cmVzIHdlIG9ubHkgY2xvbmUgdGhlIG5vZGUgd2hlbiBuZWNlc3NhcnkuXG4gIGNvbnN0IGh0bWxFbCA9IGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gIGlmIChodG1sRWwub2Zmc2V0UGFyZW50ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGh0bWxFbC5zY3JvbGxXaWR0aDtcbiAgfVxuXG4gIGNvbnN0IGNsb25lID0gaHRtbEVsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcbiAgY2xvbmUuc3R5bGUuc2V0UHJvcGVydHkoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG4gIGNsb25lLnN0eWxlLnNldFByb3BlcnR5KCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKC05OTk5cHgsIC05OTk5cHgpJyk7XG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gIGNvbnN0IHNjcm9sbFdpZHRoID0gY2xvbmUuc2Nyb2xsV2lkdGg7XG4gIGNsb25lLnJlbW92ZSgpO1xuICByZXR1cm4gc2Nyb2xsV2lkdGg7XG59XG4iXX0=