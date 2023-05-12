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
class MatFormFieldNotchedOutline {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFormFieldNotchedOutline, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatFormFieldNotchedOutline, selector: "div[matFormFieldNotchedOutline]", inputs: { open: ["matFormFieldNotchedOutlineOpen", "open"] }, host: { properties: { "class.mdc-notched-outline--notched": "open" }, classAttribute: "mdc-notched-outline" }, viewQueries: [{ propertyName: "_notch", first: true, predicate: ["notch"], descendants: true }], ngImport: i0, template: "<div class=\"mdc-notched-outline__leading\"></div>\n<div class=\"mdc-notched-outline__notch\" #notch>\n  <ng-content></ng-content>\n</div>\n<div class=\"mdc-notched-outline__trailing\"></div>\n", changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatFormFieldNotchedOutline };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatFormFieldNotchedOutline, decorators: [{
            type: Component,
            args: [{ selector: 'div[matFormFieldNotchedOutline]', host: {
                        'class': 'mdc-notched-outline',
                        // Besides updating the notch state through the MDC component, we toggle this class through
                        // a host binding in order to ensure that the notched-outline renders correctly on the server.
                        '[class.mdc-notched-outline--notched]': 'open',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<div class=\"mdc-notched-outline__leading\"></div>\n<div class=\"mdc-notched-outline__notch\" #notch>\n  <ng-content></ng-content>\n</div>\n<div class=\"mdc-notched-outline__trailing\"></div>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { open: [{
                type: Input,
                args: ['matFormFieldNotchedOutlineOpen']
            }], _notch: [{
                type: ViewChild,
                args: ['notch']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90Y2hlZC1vdXRsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvZGlyZWN0aXZlcy9ub3RjaGVkLW91dGxpbmUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9kaXJlY3RpdmVzL25vdGNoZWQtb3V0bGluZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7O0FBRXZCOzs7OztHQUtHO0FBQ0gsTUFZYSwwQkFBMEI7SUFNckMsWUFBb0IsV0FBb0MsRUFBVSxPQUFlO1FBQTdELGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFMakYsMENBQTBDO1FBQ0QsU0FBSSxHQUFZLEtBQUssQ0FBQztJQUlxQixDQUFDO0lBRXJGLGVBQWU7UUFDYixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQWMscUJBQXFCLENBQUMsQ0FBQztRQUMvRixJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztZQUU5RSxJQUFJLE9BQU8scUJBQXFCLEtBQUssVUFBVSxFQUFFO2dCQUMvQyxLQUFLLENBQUMsS0FBSyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztnQkFDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7b0JBQ2xDLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNyRSxDQUFDLENBQUMsQ0FBQzthQUNKO1NBQ0Y7YUFBTTtZQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztTQUMvRTtJQUNILENBQUM7SUFFRCxjQUFjLENBQUMsVUFBa0I7UUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7U0FDNUM7YUFBTTtZQUNMLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsUUFBUSxVQUFVLCtEQUN4RCxxQkFBcUIsR0FBRyxvQkFDMUIsS0FBSyxDQUFDO1NBQ1A7SUFDSCxDQUFDOzhHQWxDVSwwQkFBMEI7a0dBQTFCLDBCQUEwQixxVkNyQ3ZDLG1NQUtBOztTRGdDYSwwQkFBMEI7MkZBQTFCLDBCQUEwQjtrQkFadEMsU0FBUzsrQkFDRSxpQ0FBaUMsUUFFckM7d0JBQ0osT0FBTyxFQUFFLHFCQUFxQjt3QkFDOUIsMkZBQTJGO3dCQUMzRiw4RkFBOEY7d0JBQzlGLHNDQUFzQyxFQUFFLE1BQU07cUJBQy9DLG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJO3NIQUlJLElBQUk7c0JBQTVDLEtBQUs7dUJBQUMsZ0NBQWdDO2dCQUVuQixNQUFNO3NCQUF6QixTQUFTO3VCQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogSW50ZXJuYWwgY29tcG9uZW50IHRoYXQgY3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgTURDIG5vdGNoZWQtb3V0bGluZSBjb21wb25lbnQuXG4gKlxuICogVGhlIGNvbXBvbmVudCBzZXRzIHVwIHRoZSBIVE1MIHN0cnVjdHVyZSBhbmQgc3R5bGVzIGZvciB0aGUgbm90Y2hlZC1vdXRsaW5lLiBJdCBwcm92aWRlc1xuICogaW5wdXRzIHRvIHRvZ2dsZSB0aGUgbm90Y2ggc3RhdGUgYW5kIHdpZHRoLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkaXZbbWF0Rm9ybUZpZWxkTm90Y2hlZE91dGxpbmVdJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25vdGNoZWQtb3V0bGluZS5odG1sJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtZGMtbm90Y2hlZC1vdXRsaW5lJyxcbiAgICAvLyBCZXNpZGVzIHVwZGF0aW5nIHRoZSBub3RjaCBzdGF0ZSB0aHJvdWdoIHRoZSBNREMgY29tcG9uZW50LCB3ZSB0b2dnbGUgdGhpcyBjbGFzcyB0aHJvdWdoXG4gICAgLy8gYSBob3N0IGJpbmRpbmcgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgdGhlIG5vdGNoZWQtb3V0bGluZSByZW5kZXJzIGNvcnJlY3RseSBvbiB0aGUgc2VydmVyLlxuICAgICdbY2xhc3MubWRjLW5vdGNoZWQtb3V0bGluZS0tbm90Y2hlZF0nOiAnb3BlbicsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRGb3JtRmllbGROb3RjaGVkT3V0bGluZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICAvKiogV2hldGhlciB0aGUgbm90Y2ggc2hvdWxkIGJlIG9wZW5lZC4gKi9cbiAgQElucHV0KCdtYXRGb3JtRmllbGROb3RjaGVkT3V0bGluZU9wZW4nKSBvcGVuOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQFZpZXdDaGlsZCgnbm90Y2gnKSBfbm90Y2g6IEVsZW1lbnRSZWY7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBjb25zdCBsYWJlbCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLm1kYy1mbG9hdGluZy1sYWJlbCcpO1xuICAgIGlmIChsYWJlbCkge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21kYy1ub3RjaGVkLW91dGxpbmUtLXVwZ3JhZGVkJyk7XG5cbiAgICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGxhYmVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwcyc7XG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IChsYWJlbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnJykpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21kYy1ub3RjaGVkLW91dGxpbmUtLW5vLWxhYmVsJyk7XG4gICAgfVxuICB9XG5cbiAgX3NldE5vdGNoV2lkdGgobGFiZWxXaWR0aDogbnVtYmVyKSB7XG4gICAgaWYgKCF0aGlzLm9wZW4gfHwgIWxhYmVsV2lkdGgpIHtcbiAgICAgIHRoaXMuX25vdGNoLm5hdGl2ZUVsZW1lbnQuc3R5bGUud2lkdGggPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgTk9UQ0hfRUxFTUVOVF9QQURESU5HID0gODtcbiAgICAgIGNvbnN0IE5PVENIX0VMRU1FTlRfQk9SREVSID0gMTtcbiAgICAgIHRoaXMuX25vdGNoLm5hdGl2ZUVsZW1lbnQuc3R5bGUud2lkdGggPSBgY2FsYygke2xhYmVsV2lkdGh9cHggKiB2YXIoLS1tYXQtbWRjLWZvcm0tZmllbGQtZmxvYXRpbmctbGFiZWwtc2NhbGUsIDAuNzUpICsgJHtcbiAgICAgICAgTk9UQ0hfRUxFTUVOVF9QQURESU5HICsgTk9UQ0hfRUxFTUVOVF9CT1JERVJcbiAgICAgIH1weClgO1xuICAgIH1cbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm1kYy1ub3RjaGVkLW91dGxpbmVfX2xlYWRpbmdcIj48L2Rpdj5cbjxkaXYgY2xhc3M9XCJtZGMtbm90Y2hlZC1vdXRsaW5lX19ub3RjaFwiICNub3RjaD5cbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuPC9kaXY+XG48ZGl2IGNsYXNzPVwibWRjLW5vdGNoZWQtb3V0bGluZV9fdHJhaWxpbmdcIj48L2Rpdj5cbiJdfQ==