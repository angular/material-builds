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
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.0", type: MatFormFieldFloatingLabel, selector: "label[matFormFieldFloatingLabel]", inputs: { floating: "floating", monitorResize: "monitorResize" }, host: { properties: { "class.mdc-floating-label--float-above": "floating" }, classAttribute: "mdc-floating-label mat-mdc-floating-label" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatFormFieldFloatingLabel, decorators: [{
            type: Directive,
            args: [{
                    selector: 'label[matFormFieldFloatingLabel]',
                    host: {
                        'class': 'mdc-floating-label mat-mdc-floating-label',
                        '[class.mdc-floating-label--float-above]': 'floating',
                    },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXRpbmctbGFiZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9kaXJlY3RpdmVzL2Zsb2F0aW5nLWxhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLGNBQWMsR0FDZixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNwRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQU9sQyxpREFBaUQ7QUFDakQsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQXNCLHFCQUFxQixDQUFDLENBQUM7QUFFcEc7Ozs7Ozs7Ozs7OztHQVlHO0FBUUgsTUFBTSxPQUFPLHlCQUF5QjtJQUNwQyxxQ0FBcUM7SUFDckMsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFjO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBR0Qsa0VBQWtFO0lBQ2xFLElBQ0ksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsSUFBSSxhQUFhLENBQUMsS0FBYztRQUM5QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7U0FDM0I7YUFBTTtZQUNM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QUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO0lBQ3RDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNmLE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBpbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgSW5qZWN0aW9uVG9rZW4sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTaGFyZWRSZXNpemVPYnNlcnZlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL29ic2VydmVycy9wcml2YXRlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcblxuLyoqIEFuIGludGVyZmFjZSB0aGF0IHRoZSBwYXJlbnQgZm9ybS1maWVsZCBzaG91bGQgaW1wbGVtZW50IHRvIHJlY2VpdmUgcmVzaXplIGV2ZW50cy4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmxvYXRpbmdMYWJlbFBhcmVudCB7XG4gIF9oYW5kbGVMYWJlbFJlc2l6ZWQoKTogdm9pZDtcbn1cblxuLyoqIEFuIGluamlvbiB0b2tlbiBmb3IgdGhlIHBhcmVudCBmb3JtLWZpZWxkLiAqL1xuZXhwb3J0IGNvbnN0IEZMT0FUSU5HX0xBQkVMX1BBUkVOVCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxGbG9hdGluZ0xhYmVsUGFyZW50PignRmxvYXRpbmdMYWJlbFBhcmVudCcpO1xuXG4vKipcbiAqIEludGVybmFsIGRpcmVjdGl2ZSB0aGF0IG1haW50YWlucyBhIE1EQyBmbG9hdGluZyBsYWJlbC4gVGhpcyBkaXJlY3RpdmUgZG9lcyBub3RcbiAqIHVzZSB0aGUgYE1EQ0Zsb2F0aW5nTGFiZWxGb3VuZGF0aW9uYCBjbGFzcywgYXMgaXQgaXMgbm90IHdvcnRoIHRoZSBzaXplIGNvc3Qgb2ZcbiAqIGluY2x1ZGluZyBpdCBqdXN0IHRvIG1lYXN1cmUgdGhlIGxhYmVsIHdpZHRoIGFuZCB0b2dnbGUgc29tZSBjbGFzc2VzLlxuICpcbiAqIFRoZSB1c2Ugb2YgYSBkaXJlY3RpdmUgYWxsb3dzIHVzIHRvIGNvbmRpdGlvbmFsbHkgcmVuZGVyIGEgZmxvYXRpbmcgbGFiZWwgaW4gdGhlXG4gKiB0ZW1wbGF0ZSB3aXRob3V0IGhhdmluZyB0byBtYW51YWxseSBtYW5hZ2UgaW5zdGFudGlhdGlvbiBhbmQgZGVzdHJ1Y3Rpb24gb2YgdGhlXG4gKiBmbG9hdGluZyBsYWJlbCBjb21wb25lbnQgYmFzZWQgb24uXG4gKlxuICogVGhlIGNvbXBvbmVudCBpcyByZXNwb25zaWJsZSBmb3Igc2V0dGluZyB1cCB0aGUgZmxvYXRpbmcgbGFiZWwgc3R5bGVzLCBtZWFzdXJpbmcgbGFiZWxcbiAqIHdpZHRoIGZvciB0aGUgb3V0bGluZSBub3RjaCwgYW5kIHByb3ZpZGluZyBpbnB1dHMgdGhhdCBjYW4gYmUgdXNlZCB0byB0b2dnbGUgdGhlXG4gKiBsYWJlbCdzIGZsb2F0aW5nIG9yIHJlcXVpcmVkIHN0YXRlLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdsYWJlbFttYXRGb3JtRmllbGRGbG9hdGluZ0xhYmVsXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWRjLWZsb2F0aW5nLWxhYmVsIG1hdC1tZGMtZmxvYXRpbmctbGFiZWwnLFxuICAgICdbY2xhc3MubWRjLWZsb2F0aW5nLWxhYmVsLS1mbG9hdC1hYm92ZV0nOiAnZmxvYXRpbmcnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRGb3JtRmllbGRGbG9hdGluZ0xhYmVsIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIGlzIGZsb2F0aW5nLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZmxvYXRpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Zsb2F0aW5nO1xuICB9XG4gIHNldCBmbG9hdGluZyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Zsb2F0aW5nID0gdmFsdWU7XG4gICAgaWYgKHRoaXMubW9uaXRvclJlc2l6ZSkge1xuICAgICAgdGhpcy5faGFuZGxlUmVzaXplKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Zsb2F0aW5nID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdG8gbW9uaXRvciBmb3IgcmVzaXplIGV2ZW50cyBvbiB0aGUgZmxvYXRpbmcgbGFiZWwuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtb25pdG9yUmVzaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9tb25pdG9yUmVzaXplO1xuICB9XG4gIHNldCBtb25pdG9yUmVzaXplKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fbW9uaXRvclJlc2l6ZSA9IHZhbHVlO1xuICAgIGlmICh0aGlzLl9tb25pdG9yUmVzaXplKSB7XG4gICAgICB0aGlzLl9zdWJzY3JpYmVUb1Jlc2l6ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZXNpemVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfbW9uaXRvclJlc2l6ZSA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgc2hhcmVkIFJlc2l6ZU9ic2VydmVyLiAqL1xuICBwcml2YXRlIF9yZXNpemVPYnNlcnZlciA9IGluamVjdChTaGFyZWRSZXNpemVPYnNlcnZlcik7XG5cbiAgLyoqIFRoZSBBbmd1bGFyIHpvbmUuICovXG4gIHByaXZhdGUgX25nWm9uZSA9IGluamVjdChOZ1pvbmUpO1xuXG4gIC8qKiBUaGUgcGFyZW50IGZvcm0tZmllbGQuICovXG4gIHByaXZhdGUgX3BhcmVudCA9IGluamVjdChGTE9BVElOR19MQUJFTF9QQVJFTlQpO1xuXG4gIC8qKiBUaGUgY3VycmVudCByZXNpemUgZXZlbnQgc3Vic2NyaXB0aW9uLiAqL1xuICBwcml2YXRlIF9yZXNpemVTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHt9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fcmVzaXplU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgd2lkdGggb2YgdGhlIGxhYmVsLiBVc2VkIGZvciB0aGUgb3V0bGluZSBub3RjaC4gKi9cbiAgZ2V0V2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gZXN0aW1hdGVTY3JvbGxXaWR0aCh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIEhUTUwgZWxlbWVudCBmb3IgdGhlIGZsb2F0aW5nIGxhYmVsLiAqL1xuICBnZXQgZWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHJlc2l6ZSBldmVudHMgZnJvbSB0aGUgUmVzaXplT2JzZXJ2ZXIuICovXG4gIHByaXZhdGUgX2hhbmRsZVJlc2l6ZSgpIHtcbiAgICAvLyBJbiB0aGUgY2FzZSB3aGVyZSB0aGUgbGFiZWwgZ3Jvd3MgaW4gc2l6ZSwgdGhlIGZvbGxvd2luZyBzZXF1ZW5jZSBvZiBldmVudHMgb2NjdXJzOlxuICAgIC8vIDEuIFRoZSBsYWJlbCBncm93cyBieSAxcHggdHJpZ2dlcmluZyB0aGUgUmVzaXplT2JzZXJ2ZXJcbiAgICAvLyAyLiBUaGUgbm90Y2ggaXMgZXhwYW5kZWQgdG8gYWNjb21tb2RhdGUgdGhlIGVudGlyZSBsYWJlbFxuICAgIC8vIDMuIFRoZSBsYWJlbCBleHBhbmRzIHRvIGl0cyBmdWxsIHdpZHRoLCB0cmlnZ2VyaW5nIHRoZSBSZXNpemVPYnNlcnZlciBhZ2FpblxuICAgIC8vXG4gICAgLy8gVGhpcyBpcyBleHBlY3RlZCwgYnV0IElmIHdlIGFsbG93IHRoaXMgdG8gYWxsIGhhcHBlbiB3aXRoaW4gdGhlIHNhbWUgbWFjcm8gdGFzayBpdCBjYXVzZXMgYW5cbiAgICAvLyBlcnJvcjogYFJlc2l6ZU9ic2VydmVyIGxvb3AgbGltaXQgZXhjZWVkZWRgLiBUaGVyZWZvcmUgd2UgcHVzaCB0aGUgbm90Y2ggcmVzaXplIG91dCB1bnRpbFxuICAgIC8vIHRoZSBuZXh0IG1hY3JvIHRhc2suXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLl9wYXJlbnQuX2hhbmRsZUxhYmVsUmVzaXplZCgpKTtcbiAgfVxuXG4gIC8qKiBTdWJzY3JpYmVzIHRvIHJlc2l6ZSBldmVudHMuICovXG4gIHByaXZhdGUgX3N1YnNjcmliZVRvUmVzaXplKCkge1xuICAgIHRoaXMuX3Jlc2l6ZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9yZXNpemVTdWJzY3JpcHRpb24gPSB0aGlzLl9yZXNpemVPYnNlcnZlclxuICAgICAgICAub2JzZXJ2ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHtib3g6ICdib3JkZXItYm94J30pXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5faGFuZGxlUmVzaXplKCkpO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogRXN0aW1hdGVzIHRoZSBzY3JvbGwgd2lkdGggb2YgYW4gZWxlbWVudC5cbiAqIHZpYSBodHRwczovL2dpdGh1Yi5jb20vbWF0ZXJpYWwtY29tcG9uZW50cy9tYXRlcmlhbC1jb21wb25lbnRzLXdlYi9ibG9iL2MwYTExZWYwZDAwMGEwOThmZDBjMzcyYmU4ZjEyZDZhOTkzMDI4NTUvcGFja2FnZXMvbWRjLWRvbS9wb255ZmlsbC50c1xuICovXG5mdW5jdGlvbiBlc3RpbWF0ZVNjcm9sbFdpZHRoKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcbiAgLy8gQ2hlY2sgdGhlIG9mZnNldFBhcmVudC4gSWYgdGhlIGVsZW1lbnQgaW5oZXJpdHMgZGlzcGxheTogbm9uZSBmcm9tIGFueVxuICAvLyBwYXJlbnQsIHRoZSBvZmZzZXRQYXJlbnQgcHJvcGVydHkgd2lsbCBiZSBudWxsIChzZWVcbiAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0hUTUxFbGVtZW50L29mZnNldFBhcmVudCkuXG4gIC8vIFRoaXMgY2hlY2sgZW5zdXJlcyB3ZSBvbmx5IGNsb25lIHRoZSBub2RlIHdoZW4gbmVjZXNzYXJ5LlxuICBjb25zdCBodG1sRWwgPSBlbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICBpZiAoaHRtbEVsLm9mZnNldFBhcmVudCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBodG1sRWwuc2Nyb2xsV2lkdGg7XG4gIH1cblxuICBjb25zdCBjbG9uZSA9IGh0bWxFbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnQ7XG4gIGNsb25lLnN0eWxlLnNldFByb3BlcnR5KCdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xuICBjbG9uZS5zdHlsZS5zZXRQcm9wZXJ0eSgndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgtOTk5OXB4LCAtOTk5OXB4KScpO1xuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICBjb25zdCBzY3JvbGxXaWR0aCA9IGNsb25lLnNjcm9sbFdpZHRoO1xuICBjbG9uZS5yZW1vdmUoKTtcbiAgcmV0dXJuIHNjcm9sbFdpZHRoO1xufVxuIl19