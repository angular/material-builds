/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, ViewEncapsulation, } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Internal component that creates an instance of the MDC notched-outline component.
 *
 * The component sets up the HTML structure and styles for the notched-outline. It provides
 * inputs to toggle the notch state and width.
 */
class MatFormFieldNotchedOutline {
    constructor(_elementRef, _ngZone) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        /** Width of the label (original scale) */
        this.labelWidth = 0;
        /** Whether the notch should be opened. */
        this.open = false;
    }
    ngAfterViewInit() {
        const label = this._elementRef.nativeElement.querySelector('.mdc-floating-label');
        if (label) {
            this._elementRef.nativeElement.classList.add('mdc-notched-outline--upgraded');
            if (typeof requestAnimationFrame === 'function') {
                label.style.transitionDuration = '0s';
                this._ngZone.runOutsideAngular(() => {
                    requestAnimationFrame(() => (label.style.transitionDuration = ''));
                });
            }
        }
        else {
            this._elementRef.nativeElement.classList.add('mdc-notched-outline--no-label');
        }
    }
    _getNotchWidth() {
        if (this.open) {
            const NOTCH_ELEMENT_PADDING = 8;
            const NOTCH_ELEMENT_BORDER = 1;
            return this.labelWidth > 0
                ? `calc(${this.labelWidth}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + ${NOTCH_ELEMENT_PADDING + NOTCH_ELEMENT_BORDER}px)`
                : '0px';
        }
        return null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFormFieldNotchedOutline, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatFormFieldNotchedOutline, selector: "div[matFormFieldNotchedOutline]", inputs: { labelWidth: ["matFormFieldNotchedOutlineLabelWidth", "labelWidth"], open: ["matFormFieldNotchedOutlineOpen", "open"] }, host: { properties: { "class.mdc-notched-outline--notched": "open" }, classAttribute: "mdc-notched-outline" }, ngImport: i0, template: "<div class=\"mdc-notched-outline__leading\"></div>\n<div class=\"mdc-notched-outline__notch\" [style.width]=\"_getNotchWidth()\">\n  <ng-content></ng-content>\n</div>\n<div class=\"mdc-notched-outline__trailing\"></div>\n", changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatFormFieldNotchedOutline };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFormFieldNotchedOutline, decorators: [{
            type: Component,
            args: [{ selector: 'div[matFormFieldNotchedOutline]', host: {
                        'class': 'mdc-notched-outline',
                        // Besides updating the notch state through the MDC component, we toggle this class through
                        // a host binding in order to ensure that the notched-outline renders correctly on the server.
                        '[class.mdc-notched-outline--notched]': 'open',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<div class=\"mdc-notched-outline__leading\"></div>\n<div class=\"mdc-notched-outline__notch\" [style.width]=\"_getNotchWidth()\">\n  <ng-content></ng-content>\n</div>\n<div class=\"mdc-notched-outline__trailing\"></div>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { labelWidth: [{
                type: Input,
                args: ['matFormFieldNotchedOutlineLabelWidth']
            }], open: [{
                type: Input,
                args: ['matFormFieldNotchedOutlineOpen']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90Y2hlZC1vdXRsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvZGlyZWN0aXZlcy9ub3RjaGVkLW91dGxpbmUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9kaXJlY3RpdmVzL25vdGNoZWQtb3V0bGluZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQzs7QUFFdkI7Ozs7O0dBS0c7QUFDSCxNQVlhLDBCQUEwQjtJQU9yQyxZQUFvQixXQUFvQyxFQUFVLE9BQWU7UUFBN0QsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQU5qRiwwQ0FBMEM7UUFDSyxlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBRXRFLDBDQUEwQztRQUNELFNBQUksR0FBWSxLQUFLLENBQUM7SUFFcUIsQ0FBQztJQUVyRixlQUFlO1FBQ2IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFjLHFCQUFxQixDQUFDLENBQUM7UUFDL0YsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFFOUUsSUFBSSxPQUFPLHFCQUFxQixLQUFLLFVBQVUsRUFBRTtnQkFDL0MsS0FBSyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO29CQUNsQyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckUsQ0FBQyxDQUFDLENBQUM7YUFDSjtTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7U0FDL0U7SUFDSCxDQUFDO0lBRUQsY0FBYztRQUNaLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLE9BQU8sSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDO2dCQUN4QixDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsVUFBVSwrREFDckIscUJBQXFCLEdBQUcsb0JBQzFCLEtBQUs7Z0JBQ1AsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUNYO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOzhHQXJDVSwwQkFBMEI7a0dBQTFCLDBCQUEwQix3VENwQ3ZDLCtOQUtBOztTRCtCYSwwQkFBMEI7MkZBQTFCLDBCQUEwQjtrQkFadEMsU0FBUzsrQkFDRSxpQ0FBaUMsUUFFckM7d0JBQ0osT0FBTyxFQUFFLHFCQUFxQjt3QkFDOUIsMkZBQTJGO3dCQUMzRiw4RkFBOEY7d0JBQzlGLHNDQUFzQyxFQUFFLE1BQU07cUJBQy9DLG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJO3NIQUlVLFVBQVU7c0JBQXhELEtBQUs7dUJBQUMsc0NBQXNDO2dCQUdKLElBQUk7c0JBQTVDLEtBQUs7dUJBQUMsZ0NBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBJbnRlcm5hbCBjb21wb25lbnQgdGhhdCBjcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBNREMgbm90Y2hlZC1vdXRsaW5lIGNvbXBvbmVudC5cbiAqXG4gKiBUaGUgY29tcG9uZW50IHNldHMgdXAgdGhlIEhUTUwgc3RydWN0dXJlIGFuZCBzdHlsZXMgZm9yIHRoZSBub3RjaGVkLW91dGxpbmUuIEl0IHByb3ZpZGVzXG4gKiBpbnB1dHMgdG8gdG9nZ2xlIHRoZSBub3RjaCBzdGF0ZSBhbmQgd2lkdGguXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RpdlttYXRGb3JtRmllbGROb3RjaGVkT3V0bGluZV0nLFxuICB0ZW1wbGF0ZVVybDogJy4vbm90Y2hlZC1vdXRsaW5lLmh0bWwnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy1ub3RjaGVkLW91dGxpbmUnLFxuICAgIC8vIEJlc2lkZXMgdXBkYXRpbmcgdGhlIG5vdGNoIHN0YXRlIHRocm91Z2ggdGhlIE1EQyBjb21wb25lbnQsIHdlIHRvZ2dsZSB0aGlzIGNsYXNzIHRocm91Z2hcbiAgICAvLyBhIGhvc3QgYmluZGluZyBpbiBvcmRlciB0byBlbnN1cmUgdGhhdCB0aGUgbm90Y2hlZC1vdXRsaW5lIHJlbmRlcnMgY29ycmVjdGx5IG9uIHRoZSBzZXJ2ZXIuXG4gICAgJ1tjbGFzcy5tZGMtbm90Y2hlZC1vdXRsaW5lLS1ub3RjaGVkXSc6ICdvcGVuJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEZvcm1GaWVsZE5vdGNoZWRPdXRsaW5lIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIC8qKiBXaWR0aCBvZiB0aGUgbGFiZWwgKG9yaWdpbmFsIHNjYWxlKSAqL1xuICBASW5wdXQoJ21hdEZvcm1GaWVsZE5vdGNoZWRPdXRsaW5lTGFiZWxXaWR0aCcpIGxhYmVsV2lkdGg6IG51bWJlciA9IDA7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG5vdGNoIHNob3VsZCBiZSBvcGVuZWQuICovXG4gIEBJbnB1dCgnbWF0Rm9ybUZpZWxkTm90Y2hlZE91dGxpbmVPcGVuJykgb3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgY29uc3QgbGFiZWwgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5tZGMtZmxvYXRpbmctbGFiZWwnKTtcbiAgICBpZiAobGFiZWwpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtZGMtbm90Y2hlZC1vdXRsaW5lLS11cGdyYWRlZCcpO1xuXG4gICAgICBpZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsYWJlbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMHMnO1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiAobGFiZWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gJycpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtZGMtbm90Y2hlZC1vdXRsaW5lLS1uby1sYWJlbCcpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXROb3RjaFdpZHRoKCkge1xuICAgIGlmICh0aGlzLm9wZW4pIHtcbiAgICAgIGNvbnN0IE5PVENIX0VMRU1FTlRfUEFERElORyA9IDg7XG4gICAgICBjb25zdCBOT1RDSF9FTEVNRU5UX0JPUkRFUiA9IDE7XG4gICAgICByZXR1cm4gdGhpcy5sYWJlbFdpZHRoID4gMFxuICAgICAgICA/IGBjYWxjKCR7dGhpcy5sYWJlbFdpZHRofXB4ICogdmFyKC0tbWF0LW1kYy1mb3JtLWZpZWxkLWZsb2F0aW5nLWxhYmVsLXNjYWxlLCAwLjc1KSArICR7XG4gICAgICAgICAgICBOT1RDSF9FTEVNRU5UX1BBRERJTkcgKyBOT1RDSF9FTEVNRU5UX0JPUkRFUlxuICAgICAgICAgIH1weClgXG4gICAgICAgIDogJzBweCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtZGMtbm90Y2hlZC1vdXRsaW5lX19sZWFkaW5nXCI+PC9kaXY+XG48ZGl2IGNsYXNzPVwibWRjLW5vdGNoZWQtb3V0bGluZV9fbm90Y2hcIiBbc3R5bGUud2lkdGhdPVwiX2dldE5vdGNoV2lkdGgoKVwiPlxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48L2Rpdj5cbjxkaXYgY2xhc3M9XCJtZGMtbm90Y2hlZC1vdXRsaW5lX190cmFpbGluZ1wiPjwvZGl2PlxuIl19