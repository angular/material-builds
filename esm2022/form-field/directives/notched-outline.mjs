/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, ViewChild, ViewEncapsulation, } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Internal component that creates an instance of the MDC notched-outline component.
 *
 * The component sets up the HTML structure and styles for the notched-outline. It provides
 * inputs to toggle the notch state and width.
 */
export class MatFormFieldNotchedOutline {
    constructor(_elementRef, _ngZone) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
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
    _setNotchWidth(labelWidth) {
        if (!this.open || !labelWidth) {
            this._notch.nativeElement.style.width = '';
        }
        else {
            const NOTCH_ELEMENT_PADDING = 8;
            const NOTCH_ELEMENT_BORDER = 1;
            this._notch.nativeElement.style.width = `calc(${labelWidth}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + ${NOTCH_ELEMENT_PADDING + NOTCH_ELEMENT_BORDER}px)`;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatFormFieldNotchedOutline, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.0.0", type: MatFormFieldNotchedOutline, isStandalone: true, selector: "div[matFormFieldNotchedOutline]", inputs: { open: ["matFormFieldNotchedOutlineOpen", "open"] }, host: { properties: { "class.mdc-notched-outline--notched": "open" }, classAttribute: "mdc-notched-outline" }, viewQueries: [{ propertyName: "_notch", first: true, predicate: ["notch"], descendants: true }], ngImport: i0, template: "<div class=\"mdc-notched-outline__leading\"></div>\n<div class=\"mdc-notched-outline__notch\" #notch>\n  <ng-content></ng-content>\n</div>\n<div class=\"mdc-notched-outline__trailing\"></div>\n", changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatFormFieldNotchedOutline, decorators: [{
            type: Component,
            args: [{ selector: 'div[matFormFieldNotchedOutline]', host: {
                        'class': 'mdc-notched-outline',
                        // Besides updating the notch state through the MDC component, we toggle this class through
                        // a host binding in order to ensure that the notched-outline renders correctly on the server.
                        '[class.mdc-notched-outline--notched]': 'open',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, standalone: true, template: "<div class=\"mdc-notched-outline__leading\"></div>\n<div class=\"mdc-notched-outline__notch\" #notch>\n  <ng-content></ng-content>\n</div>\n<div class=\"mdc-notched-outline__trailing\"></div>\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }], propDecorators: { open: [{
                type: Input,
                args: ['matFormFieldNotchedOutlineOpen']
            }], _notch: [{
                type: ViewChild,
                args: ['notch']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90Y2hlZC1vdXRsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvZGlyZWN0aXZlcy9ub3RjaGVkLW91dGxpbmUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9kaXJlY3RpdmVzL25vdGNoZWQtb3V0bGluZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7O0FBRXZCOzs7OztHQUtHO0FBY0gsTUFBTSxPQUFPLDBCQUEwQjtJQU1yQyxZQUNVLFdBQW9DLEVBQ3BDLE9BQWU7UUFEZixnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQVB6QiwwQ0FBMEM7UUFDRCxTQUFJLEdBQVksS0FBSyxDQUFDO0lBTzVELENBQUM7SUFFSixlQUFlO1FBQ2IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFjLHFCQUFxQixDQUFDLENBQUM7UUFDL0YsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFFOUUsSUFBSSxPQUFPLHFCQUFxQixLQUFLLFVBQVUsRUFBRTtnQkFDL0MsS0FBSyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO29CQUNsQyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckUsQ0FBQyxDQUFDLENBQUM7YUFDSjtTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7U0FDL0U7SUFDSCxDQUFDO0lBRUQsY0FBYyxDQUFDLFVBQWtCO1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1NBQzVDO2FBQU07WUFDTCxNQUFNLHFCQUFxQixHQUFHLENBQUMsQ0FBQztZQUNoQyxNQUFNLG9CQUFvQixHQUFHLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsVUFBVSwrREFDeEQscUJBQXFCLEdBQUcsb0JBQzFCLEtBQUssQ0FBQztTQUNQO0lBQ0gsQ0FBQzs4R0FyQ1UsMEJBQTBCO2tHQUExQiwwQkFBMEIseVdDdEN2QyxtTUFLQTs7MkZEaUNhLDBCQUEwQjtrQkFidEMsU0FBUzsrQkFDRSxpQ0FBaUMsUUFFckM7d0JBQ0osT0FBTyxFQUFFLHFCQUFxQjt3QkFDOUIsMkZBQTJGO3dCQUMzRiw4RkFBOEY7d0JBQzlGLHNDQUFzQyxFQUFFLE1BQU07cUJBQy9DLG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLGNBQ3pCLElBQUk7b0dBSXlCLElBQUk7c0JBQTVDLEtBQUs7dUJBQUMsZ0NBQWdDO2dCQUVuQixNQUFNO3NCQUF6QixTQUFTO3VCQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogSW50ZXJuYWwgY29tcG9uZW50IHRoYXQgY3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgTURDIG5vdGNoZWQtb3V0bGluZSBjb21wb25lbnQuXG4gKlxuICogVGhlIGNvbXBvbmVudCBzZXRzIHVwIHRoZSBIVE1MIHN0cnVjdHVyZSBhbmQgc3R5bGVzIGZvciB0aGUgbm90Y2hlZC1vdXRsaW5lLiBJdCBwcm92aWRlc1xuICogaW5wdXRzIHRvIHRvZ2dsZSB0aGUgbm90Y2ggc3RhdGUgYW5kIHdpZHRoLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkaXZbbWF0Rm9ybUZpZWxkTm90Y2hlZE91dGxpbmVdJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25vdGNoZWQtb3V0bGluZS5odG1sJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtZGMtbm90Y2hlZC1vdXRsaW5lJyxcbiAgICAvLyBCZXNpZGVzIHVwZGF0aW5nIHRoZSBub3RjaCBzdGF0ZSB0aHJvdWdoIHRoZSBNREMgY29tcG9uZW50LCB3ZSB0b2dnbGUgdGhpcyBjbGFzcyB0aHJvdWdoXG4gICAgLy8gYSBob3N0IGJpbmRpbmcgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgdGhlIG5vdGNoZWQtb3V0bGluZSByZW5kZXJzIGNvcnJlY3RseSBvbiB0aGUgc2VydmVyLlxuICAgICdbY2xhc3MubWRjLW5vdGNoZWQtb3V0bGluZS0tbm90Y2hlZF0nOiAnb3BlbicsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRGb3JtRmllbGROb3RjaGVkT3V0bGluZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICAvKiogV2hldGhlciB0aGUgbm90Y2ggc2hvdWxkIGJlIG9wZW5lZC4gKi9cbiAgQElucHV0KCdtYXRGb3JtRmllbGROb3RjaGVkT3V0bGluZU9wZW4nKSBvcGVuOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQFZpZXdDaGlsZCgnbm90Y2gnKSBfbm90Y2g6IEVsZW1lbnRSZWY7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICkge31cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgY29uc3QgbGFiZWwgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5tZGMtZmxvYXRpbmctbGFiZWwnKTtcbiAgICBpZiAobGFiZWwpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtZGMtbm90Y2hlZC1vdXRsaW5lLS11cGdyYWRlZCcpO1xuXG4gICAgICBpZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsYWJlbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMHMnO1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiAobGFiZWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gJycpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtZGMtbm90Y2hlZC1vdXRsaW5lLS1uby1sYWJlbCcpO1xuICAgIH1cbiAgfVxuXG4gIF9zZXROb3RjaFdpZHRoKGxhYmVsV2lkdGg6IG51bWJlcikge1xuICAgIGlmICghdGhpcy5vcGVuIHx8ICFsYWJlbFdpZHRoKSB7XG4gICAgICB0aGlzLl9ub3RjaC5uYXRpdmVFbGVtZW50LnN0eWxlLndpZHRoID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IE5PVENIX0VMRU1FTlRfUEFERElORyA9IDg7XG4gICAgICBjb25zdCBOT1RDSF9FTEVNRU5UX0JPUkRFUiA9IDE7XG4gICAgICB0aGlzLl9ub3RjaC5uYXRpdmVFbGVtZW50LnN0eWxlLndpZHRoID0gYGNhbGMoJHtsYWJlbFdpZHRofXB4ICogdmFyKC0tbWF0LW1kYy1mb3JtLWZpZWxkLWZsb2F0aW5nLWxhYmVsLXNjYWxlLCAwLjc1KSArICR7XG4gICAgICAgIE5PVENIX0VMRU1FTlRfUEFERElORyArIE5PVENIX0VMRU1FTlRfQk9SREVSXG4gICAgICB9cHgpYDtcbiAgICB9XG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtZGMtbm90Y2hlZC1vdXRsaW5lX19sZWFkaW5nXCI+PC9kaXY+XG48ZGl2IGNsYXNzPVwibWRjLW5vdGNoZWQtb3V0bGluZV9fbm90Y2hcIiAjbm90Y2g+XG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvZGl2PlxuPGRpdiBjbGFzcz1cIm1kYy1ub3RjaGVkLW91dGxpbmVfX3RyYWlsaW5nXCI+PC9kaXY+XG4iXX0=