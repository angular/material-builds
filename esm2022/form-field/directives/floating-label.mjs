/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, inject, Input, NgZone, InjectionToken, } from '@angular/core';
import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
/** An injion token for the parent form-field. */
export const FLOATING_LABEL_PARENT = new InjectionToken('FloatingLabelParent');
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
export class MatFormFieldFloatingLabel {
    /** Whether the label is floating. */
    get floating() {
        return this._floating;
    }
    set floating(value) {
        this._floating = value;
        if (this.monitorResize) {
            this._handleResize();
        }
    }
    /** Whether to monitor for resize events on the floating label. */
    get monitorResize() {
        return this._monitorResize;
    }
    set monitorResize(value) {
        this._monitorResize = value;
        if (this._monitorResize) {
            this._subscribeToResize();
        }
        else {
            this._resizeSubscription.unsubscribe();
        }
    }
    constructor(_elementRef) {
        this._elementRef = _elementRef;
        this._floating = false;
        this._monitorResize = false;
        /** The shared ResizeObserver. */
        this._resizeObserver = inject(SharedResizeObserver);
        /** The Angular zone. */
        this._ngZone = inject(NgZone);
        /** The parent form-field. */
        this._parent = inject(FLOATING_LABEL_PARENT);
        /** The current resize event subscription. */
        this._resizeSubscription = new Subscription();
    }
    ngOnDestroy() {
        this._resizeSubscription.unsubscribe();
    }
    /** Gets the width of the label. Used for the outline notch. */
    getWidth() {
        return estimateScrollWidth(this._elementRef.nativeElement);
    }
    /** Gets the HTML element for the floating label. */
    get element() {
        return this._elementRef.nativeElement;
    }
    /** Handles resize events from the ResizeObserver. */
    _handleResize() {
        // In the case where the label grows in size, the following sequence of events occurs:
        // 1. The label grows by 1px triggering the ResizeObserver
        // 2. The notch is expanded to accommodate the entire label
        // 3. The label expands to its full width, triggering the ResizeObserver again
        //
        // This is expected, but If we allow this to all happen within the same macro task it causes an
        // error: `ResizeObserver loop limit exceeded`. Therefore we push the notch resize out until
        // the next macro task.
        setTimeout(() => this._parent._handleLabelResized());
    }
    /** Subscribes to resize events. */
    _subscribeToResize() {
        this._resizeSubscription.unsubscribe();
        this._ngZone.runOutsideAngular(() => {
            this._resizeSubscription = this._resizeObserver
                .observe(this._elementRef.nativeElement, { box: 'border-box' })
                .subscribe(() => this._handleResize());
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatFormFieldFloatingLabel, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.0", type: MatFormFieldFloatingLabel, isStandalone: true, selector: "label[matFormFieldFloatingLabel]", inputs: { floating: "floating", monitorResize: "monitorResize" }, host: { properties: { "class.mdc-floating-label--float-above": "floating" }, classAttribute: "mdc-floating-label mat-mdc-floating-label" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatFormFieldFloatingLabel, decorators: [{
            type: Directive,
            args: [{
                    selector: 'label[matFormFieldFloatingLabel]',
                    host: {
                        'class': 'mdc-floating-label mat-mdc-floating-label',
                        '[class.mdc-floating-label--float-above]': 'floating',
                    },
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { floating: [{
                type: Input
            }], monitorResize: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXRpbmctbGFiZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9kaXJlY3RpdmVzL2Zsb2F0aW5nLWxhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLGNBQWMsR0FDZixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNwRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQU9sQyxpREFBaUQ7QUFDakQsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQXNCLHFCQUFxQixDQUFDLENBQUM7QUFFcEc7Ozs7Ozs7Ozs7OztHQVlHO0FBU0gsTUFBTSxPQUFPLHlCQUF5QjtJQUNwQyxxQ0FBcUM7SUFDckMsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFjO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBR0Qsa0VBQWtFO0lBQ2xFLElBQ0ksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsSUFBSSxhQUFhLENBQUMsS0FBYztRQUM5QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7U0FDM0I7YUFBTTtZQUNM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S0FBSyxDQUFDLENBQUM7SUFDNUMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztJQUN0QyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDZixPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgaW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIEluamVjdGlvblRva2VuLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U2hhcmVkUmVzaXplT2JzZXJ2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vYnNlcnZlcnMvcHJpdmF0ZSc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5cbi8qKiBBbiBpbnRlcmZhY2UgdGhhdCB0aGUgcGFyZW50IGZvcm0tZmllbGQgc2hvdWxkIGltcGxlbWVudCB0byByZWNlaXZlIHJlc2l6ZSBldmVudHMuICovXG5leHBvcnQgaW50ZXJmYWNlIEZsb2F0aW5nTGFiZWxQYXJlbnQge1xuICBfaGFuZGxlTGFiZWxSZXNpemVkKCk6IHZvaWQ7XG59XG5cbi8qKiBBbiBpbmppb24gdG9rZW4gZm9yIHRoZSBwYXJlbnQgZm9ybS1maWVsZC4gKi9cbmV4cG9ydCBjb25zdCBGTE9BVElOR19MQUJFTF9QQVJFTlQgPSBuZXcgSW5qZWN0aW9uVG9rZW48RmxvYXRpbmdMYWJlbFBhcmVudD4oJ0Zsb2F0aW5nTGFiZWxQYXJlbnQnKTtcblxuLyoqXG4gKiBJbnRlcm5hbCBkaXJlY3RpdmUgdGhhdCBtYWludGFpbnMgYSBNREMgZmxvYXRpbmcgbGFiZWwuIFRoaXMgZGlyZWN0aXZlIGRvZXMgbm90XG4gKiB1c2UgdGhlIGBNRENGbG9hdGluZ0xhYmVsRm91bmRhdGlvbmAgY2xhc3MsIGFzIGl0IGlzIG5vdCB3b3J0aCB0aGUgc2l6ZSBjb3N0IG9mXG4gKiBpbmNsdWRpbmcgaXQganVzdCB0byBtZWFzdXJlIHRoZSBsYWJlbCB3aWR0aCBhbmQgdG9nZ2xlIHNvbWUgY2xhc3Nlcy5cbiAqXG4gKiBUaGUgdXNlIG9mIGEgZGlyZWN0aXZlIGFsbG93cyB1cyB0byBjb25kaXRpb25hbGx5IHJlbmRlciBhIGZsb2F0aW5nIGxhYmVsIGluIHRoZVxuICogdGVtcGxhdGUgd2l0aG91dCBoYXZpbmcgdG8gbWFudWFsbHkgbWFuYWdlIGluc3RhbnRpYXRpb24gYW5kIGRlc3RydWN0aW9uIG9mIHRoZVxuICogZmxvYXRpbmcgbGFiZWwgY29tcG9uZW50IGJhc2VkIG9uLlxuICpcbiAqIFRoZSBjb21wb25lbnQgaXMgcmVzcG9uc2libGUgZm9yIHNldHRpbmcgdXAgdGhlIGZsb2F0aW5nIGxhYmVsIHN0eWxlcywgbWVhc3VyaW5nIGxhYmVsXG4gKiB3aWR0aCBmb3IgdGhlIG91dGxpbmUgbm90Y2gsIGFuZCBwcm92aWRpbmcgaW5wdXRzIHRoYXQgY2FuIGJlIHVzZWQgdG8gdG9nZ2xlIHRoZVxuICogbGFiZWwncyBmbG9hdGluZyBvciByZXF1aXJlZCBzdGF0ZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbGFiZWxbbWF0Rm9ybUZpZWxkRmxvYXRpbmdMYWJlbF0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy1mbG9hdGluZy1sYWJlbCBtYXQtbWRjLWZsb2F0aW5nLWxhYmVsJyxcbiAgICAnW2NsYXNzLm1kYy1mbG9hdGluZy1sYWJlbC0tZmxvYXQtYWJvdmVdJzogJ2Zsb2F0aW5nJyxcbiAgfSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Rm9ybUZpZWxkRmxvYXRpbmdMYWJlbCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbCBpcyBmbG9hdGluZy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGZsb2F0aW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9mbG9hdGluZztcbiAgfVxuICBzZXQgZmxvYXRpbmcodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9mbG9hdGluZyA9IHZhbHVlO1xuICAgIGlmICh0aGlzLm1vbml0b3JSZXNpemUpIHtcbiAgICAgIHRoaXMuX2hhbmRsZVJlc2l6ZSgpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9mbG9hdGluZyA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRvIG1vbml0b3IgZm9yIHJlc2l6ZSBldmVudHMgb24gdGhlIGZsb2F0aW5nIGxhYmVsLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbW9uaXRvclJlc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbW9uaXRvclJlc2l6ZTtcbiAgfVxuICBzZXQgbW9uaXRvclJlc2l6ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX21vbml0b3JSZXNpemUgPSB2YWx1ZTtcbiAgICBpZiAodGhpcy5fbW9uaXRvclJlc2l6ZSkge1xuICAgICAgdGhpcy5fc3Vic2NyaWJlVG9SZXNpemUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVzaXplU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX21vbml0b3JSZXNpemUgPSBmYWxzZTtcblxuICAvKiogVGhlIHNoYXJlZCBSZXNpemVPYnNlcnZlci4gKi9cbiAgcHJpdmF0ZSBfcmVzaXplT2JzZXJ2ZXIgPSBpbmplY3QoU2hhcmVkUmVzaXplT2JzZXJ2ZXIpO1xuXG4gIC8qKiBUaGUgQW5ndWxhciB6b25lLiAqL1xuICBwcml2YXRlIF9uZ1pvbmUgPSBpbmplY3QoTmdab25lKTtcblxuICAvKiogVGhlIHBhcmVudCBmb3JtLWZpZWxkLiAqL1xuICBwcml2YXRlIF9wYXJlbnQgPSBpbmplY3QoRkxPQVRJTkdfTEFCRUxfUEFSRU5UKTtcblxuICAvKiogVGhlIGN1cnJlbnQgcmVzaXplIGV2ZW50IHN1YnNjcmlwdGlvbi4gKi9cbiAgcHJpdmF0ZSBfcmVzaXplU3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7fVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3Jlc2l6ZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHdpZHRoIG9mIHRoZSBsYWJlbC4gVXNlZCBmb3IgdGhlIG91dGxpbmUgbm90Y2guICovXG4gIGdldFdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIGVzdGltYXRlU2Nyb2xsV2lkdGgodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBIVE1MIGVsZW1lbnQgZm9yIHRoZSBmbG9hdGluZyBsYWJlbC4gKi9cbiAgZ2V0IGVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogSGFuZGxlcyByZXNpemUgZXZlbnRzIGZyb20gdGhlIFJlc2l6ZU9ic2VydmVyLiAqL1xuICBwcml2YXRlIF9oYW5kbGVSZXNpemUoKSB7XG4gICAgLy8gSW4gdGhlIGNhc2Ugd2hlcmUgdGhlIGxhYmVsIGdyb3dzIGluIHNpemUsIHRoZSBmb2xsb3dpbmcgc2VxdWVuY2Ugb2YgZXZlbnRzIG9jY3VyczpcbiAgICAvLyAxLiBUaGUgbGFiZWwgZ3Jvd3MgYnkgMXB4IHRyaWdnZXJpbmcgdGhlIFJlc2l6ZU9ic2VydmVyXG4gICAgLy8gMi4gVGhlIG5vdGNoIGlzIGV4cGFuZGVkIHRvIGFjY29tbW9kYXRlIHRoZSBlbnRpcmUgbGFiZWxcbiAgICAvLyAzLiBUaGUgbGFiZWwgZXhwYW5kcyB0byBpdHMgZnVsbCB3aWR0aCwgdHJpZ2dlcmluZyB0aGUgUmVzaXplT2JzZXJ2ZXIgYWdhaW5cbiAgICAvL1xuICAgIC8vIFRoaXMgaXMgZXhwZWN0ZWQsIGJ1dCBJZiB3ZSBhbGxvdyB0aGlzIHRvIGFsbCBoYXBwZW4gd2l0aGluIHRoZSBzYW1lIG1hY3JvIHRhc2sgaXQgY2F1c2VzIGFuXG4gICAgLy8gZXJyb3I6IGBSZXNpemVPYnNlcnZlciBsb29wIGxpbWl0IGV4Y2VlZGVkYC4gVGhlcmVmb3JlIHdlIHB1c2ggdGhlIG5vdGNoIHJlc2l6ZSBvdXQgdW50aWxcbiAgICAvLyB0aGUgbmV4dCBtYWNybyB0YXNrLlxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fcGFyZW50Ll9oYW5kbGVMYWJlbFJlc2l6ZWQoKSk7XG4gIH1cblxuICAvKiogU3Vic2NyaWJlcyB0byByZXNpemUgZXZlbnRzLiAqL1xuICBwcml2YXRlIF9zdWJzY3JpYmVUb1Jlc2l6ZSgpIHtcbiAgICB0aGlzLl9yZXNpemVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fcmVzaXplU3Vic2NyaXB0aW9uID0gdGhpcy5fcmVzaXplT2JzZXJ2ZXJcbiAgICAgICAgLm9ic2VydmUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB7Ym94OiAnYm9yZGVyLWJveCd9KVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2hhbmRsZVJlc2l6ZSgpKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEVzdGltYXRlcyB0aGUgc2Nyb2xsIHdpZHRoIG9mIGFuIGVsZW1lbnQuXG4gKiB2aWEgaHR0cHM6Ly9naXRodWIuY29tL21hdGVyaWFsLWNvbXBvbmVudHMvbWF0ZXJpYWwtY29tcG9uZW50cy13ZWIvYmxvYi9jMGExMWVmMGQwMDBhMDk4ZmQwYzM3MmJlOGYxMmQ2YTk5MzAyODU1L3BhY2thZ2VzL21kYy1kb20vcG9ueWZpbGwudHNcbiAqL1xuZnVuY3Rpb24gZXN0aW1hdGVTY3JvbGxXaWR0aChlbGVtZW50OiBIVE1MRWxlbWVudCk6IG51bWJlciB7XG4gIC8vIENoZWNrIHRoZSBvZmZzZXRQYXJlbnQuIElmIHRoZSBlbGVtZW50IGluaGVyaXRzIGRpc3BsYXk6IG5vbmUgZnJvbSBhbnlcbiAgLy8gcGFyZW50LCB0aGUgb2Zmc2V0UGFyZW50IHByb3BlcnR5IHdpbGwgYmUgbnVsbCAoc2VlXG4gIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9IVE1MRWxlbWVudC9vZmZzZXRQYXJlbnQpLlxuICAvLyBUaGlzIGNoZWNrIGVuc3VyZXMgd2Ugb25seSBjbG9uZSB0aGUgbm9kZSB3aGVuIG5lY2Vzc2FyeS5cbiAgY29uc3QgaHRtbEVsID0gZWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgaWYgKGh0bWxFbC5vZmZzZXRQYXJlbnQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gaHRtbEVsLnNjcm9sbFdpZHRoO1xuICB9XG5cbiAgY29uc3QgY2xvbmUgPSBodG1sRWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50O1xuICBjbG9uZS5zdHlsZS5zZXRQcm9wZXJ0eSgncG9zaXRpb24nLCAnYWJzb2x1dGUnKTtcbiAgY2xvbmUuc3R5bGUuc2V0UHJvcGVydHkoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoLTk5OTlweCwgLTk5OTlweCknKTtcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgY29uc3Qgc2Nyb2xsV2lkdGggPSBjbG9uZS5zY3JvbGxXaWR0aDtcbiAgY2xvbmUucmVtb3ZlKCk7XG4gIHJldHVybiBzY3JvbGxXaWR0aDtcbn1cbiJdfQ==