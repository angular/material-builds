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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatFormFieldNotchedOutline, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.0.4", type: MatFormFieldNotchedOutline, selector: "div[matFormFieldNotchedOutline]", inputs: { open: ["matFormFieldNotchedOutlineOpen", "open"] }, host: { properties: { "class.mdc-notched-outline--notched": "open" }, classAttribute: "mdc-notched-outline" }, viewQueries: [{ propertyName: "_notch", first: true, predicate: ["notch"], descendants: true }], ngImport: i0, template: "<div class=\"mdc-notched-outline__leading\"></div>\n<div class=\"mdc-notched-outline__notch\" #notch>\n  <ng-content></ng-content>\n</div>\n<div class=\"mdc-notched-outline__trailing\"></div>\n", changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatFormFieldNotchedOutline, decorators: [{
            type: Component,
            args: [{ selector: 'div[matFormFieldNotchedOutline]', host: {
                        'class': 'mdc-notched-outline',
                        // Besides updating the notch state through the MDC component, we toggle this class through
                        // a host binding in order to ensure that the notched-outline renders correctly on the server.
                        '[class.mdc-notched-outline--notched]': 'open',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<div class=\"mdc-notched-outline__leading\"></div>\n<div class=\"mdc-notched-outline__notch\" #notch>\n  <ng-content></ng-content>\n</div>\n<div class=\"mdc-notched-outline__trailing\"></div>\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }], propDecorators: { open: [{
                type: Input,
                args: ['matFormFieldNotchedOutlineOpen']
            }], _notch: [{
                type: ViewChild,
                args: ['notch']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90Y2hlZC1vdXRsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvZGlyZWN0aXZlcy9ub3RjaGVkLW91dGxpbmUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9kaXJlY3RpdmVzL25vdGNoZWQtb3V0bGluZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7O0FBRXZCOzs7OztHQUtHO0FBYUgsTUFBTSxPQUFPLDBCQUEwQjtJQU1yQyxZQUFvQixXQUFvQyxFQUFVLE9BQWU7UUFBN0QsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUxqRiwwQ0FBMEM7UUFDRCxTQUFJLEdBQVksS0FBSyxDQUFDO0lBSXFCLENBQUM7SUFFckYsZUFBZTtRQUNiLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBYyxxQkFBcUIsQ0FBQyxDQUFDO1FBQy9GLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1lBRTlFLElBQUksT0FBTyxxQkFBcUIsS0FBSyxVQUFVLEVBQUU7Z0JBQy9DLEtBQUssQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO2dCQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtvQkFDbEMscUJBQXFCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGtCQUFrQixHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JFLENBQUMsQ0FBQyxDQUFDO2FBQ0o7U0FDRjthQUFNO1lBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1NBQy9FO0lBQ0gsQ0FBQztJQUVELGNBQWMsQ0FBQyxVQUFrQjtRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUM1QzthQUFNO1lBQ0wsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLENBQUM7WUFDaEMsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxRQUFRLFVBQVUsK0RBQ3hELHFCQUFxQixHQUFHLG9CQUMxQixLQUFLLENBQUM7U0FDUDtJQUNILENBQUM7OEdBbENVLDBCQUEwQjtrR0FBMUIsMEJBQTBCLHFWQ3JDdkMsbU1BS0E7OzJGRGdDYSwwQkFBMEI7a0JBWnRDLFNBQVM7K0JBQ0UsaUNBQWlDLFFBRXJDO3dCQUNKLE9BQU8sRUFBRSxxQkFBcUI7d0JBQzlCLDJGQUEyRjt3QkFDM0YsOEZBQThGO3dCQUM5RixzQ0FBc0MsRUFBRSxNQUFNO3FCQUMvQyxtQkFDZ0IsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSTtvR0FJSSxJQUFJO3NCQUE1QyxLQUFLO3VCQUFDLGdDQUFnQztnQkFFbkIsTUFBTTtzQkFBekIsU0FBUzt1QkFBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEludGVybmFsIGNvbXBvbmVudCB0aGF0IGNyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIE1EQyBub3RjaGVkLW91dGxpbmUgY29tcG9uZW50LlxuICpcbiAqIFRoZSBjb21wb25lbnQgc2V0cyB1cCB0aGUgSFRNTCBzdHJ1Y3R1cmUgYW5kIHN0eWxlcyBmb3IgdGhlIG5vdGNoZWQtb3V0bGluZS4gSXQgcHJvdmlkZXNcbiAqIGlucHV0cyB0byB0b2dnbGUgdGhlIG5vdGNoIHN0YXRlIGFuZCB3aWR0aC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZGl2W21hdEZvcm1GaWVsZE5vdGNoZWRPdXRsaW5lXScsXG4gIHRlbXBsYXRlVXJsOiAnLi9ub3RjaGVkLW91dGxpbmUuaHRtbCcsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWRjLW5vdGNoZWQtb3V0bGluZScsXG4gICAgLy8gQmVzaWRlcyB1cGRhdGluZyB0aGUgbm90Y2ggc3RhdGUgdGhyb3VnaCB0aGUgTURDIGNvbXBvbmVudCwgd2UgdG9nZ2xlIHRoaXMgY2xhc3MgdGhyb3VnaFxuICAgIC8vIGEgaG9zdCBiaW5kaW5nIGluIG9yZGVyIHRvIGVuc3VyZSB0aGF0IHRoZSBub3RjaGVkLW91dGxpbmUgcmVuZGVycyBjb3JyZWN0bHkgb24gdGhlIHNlcnZlci5cbiAgICAnW2NsYXNzLm1kYy1ub3RjaGVkLW91dGxpbmUtLW5vdGNoZWRdJzogJ29wZW4nLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Rm9ybUZpZWxkTm90Y2hlZE91dGxpbmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgLyoqIFdoZXRoZXIgdGhlIG5vdGNoIHNob3VsZCBiZSBvcGVuZWQuICovXG4gIEBJbnB1dCgnbWF0Rm9ybUZpZWxkTm90Y2hlZE91dGxpbmVPcGVuJykgb3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBWaWV3Q2hpbGQoJ25vdGNoJykgX25vdGNoOiBFbGVtZW50UmVmO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgY29uc3QgbGFiZWwgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5tZGMtZmxvYXRpbmctbGFiZWwnKTtcbiAgICBpZiAobGFiZWwpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtZGMtbm90Y2hlZC1vdXRsaW5lLS11cGdyYWRlZCcpO1xuXG4gICAgICBpZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsYWJlbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMHMnO1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiAobGFiZWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gJycpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtZGMtbm90Y2hlZC1vdXRsaW5lLS1uby1sYWJlbCcpO1xuICAgIH1cbiAgfVxuXG4gIF9zZXROb3RjaFdpZHRoKGxhYmVsV2lkdGg6IG51bWJlcikge1xuICAgIGlmICghdGhpcy5vcGVuIHx8ICFsYWJlbFdpZHRoKSB7XG4gICAgICB0aGlzLl9ub3RjaC5uYXRpdmVFbGVtZW50LnN0eWxlLndpZHRoID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IE5PVENIX0VMRU1FTlRfUEFERElORyA9IDg7XG4gICAgICBjb25zdCBOT1RDSF9FTEVNRU5UX0JPUkRFUiA9IDE7XG4gICAgICB0aGlzLl9ub3RjaC5uYXRpdmVFbGVtZW50LnN0eWxlLndpZHRoID0gYGNhbGMoJHtsYWJlbFdpZHRofXB4ICogdmFyKC0tbWF0LW1kYy1mb3JtLWZpZWxkLWZsb2F0aW5nLWxhYmVsLXNjYWxlLCAwLjc1KSArICR7XG4gICAgICAgIE5PVENIX0VMRU1FTlRfUEFERElORyArIE5PVENIX0VMRU1FTlRfQk9SREVSXG4gICAgICB9cHgpYDtcbiAgICB9XG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtZGMtbm90Y2hlZC1vdXRsaW5lX19sZWFkaW5nXCI+PC9kaXY+XG48ZGl2IGNsYXNzPVwibWRjLW5vdGNoZWQtb3V0bGluZV9fbm90Y2hcIiAjbm90Y2g+XG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvZGl2PlxuPGRpdiBjbGFzcz1cIm1kYy1ub3RjaGVkLW91dGxpbmVfX3RyYWlsaW5nXCI+PC9kaXY+XG4iXX0=