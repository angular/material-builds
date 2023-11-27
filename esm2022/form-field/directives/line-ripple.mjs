/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, NgZone } from '@angular/core';
import * as i0 from "@angular/core";
/** Class added when the line ripple is active. */
const ACTIVATE_CLASS = 'mdc-line-ripple--active';
/** Class added when the line ripple is being deactivated. */
const DEACTIVATING_CLASS = 'mdc-line-ripple--deactivating';
/**
 * Internal directive that creates an instance of the MDC line-ripple component. Using a
 * directive allows us to conditionally render a line-ripple in the template without having
 * to manually create and destroy the `MDCLineRipple` component whenever the condition changes.
 *
 * The directive sets up the styles for the line-ripple and provides an API for activating
 * and deactivating the line-ripple.
 */
export class MatFormFieldLineRipple {
    constructor(_elementRef, ngZone) {
        this._elementRef = _elementRef;
        this._handleTransitionEnd = (event) => {
            const classList = this._elementRef.nativeElement.classList;
            const isDeactivating = classList.contains(DEACTIVATING_CLASS);
            if (event.propertyName === 'opacity' && isDeactivating) {
                classList.remove(ACTIVATE_CLASS, DEACTIVATING_CLASS);
            }
        };
        ngZone.runOutsideAngular(() => {
            _elementRef.nativeElement.addEventListener('transitionend', this._handleTransitionEnd);
        });
    }
    activate() {
        const classList = this._elementRef.nativeElement.classList;
        classList.remove(DEACTIVATING_CLASS);
        classList.add(ACTIVATE_CLASS);
    }
    deactivate() {
        this._elementRef.nativeElement.classList.add(DEACTIVATING_CLASS);
    }
    ngOnDestroy() {
        this._elementRef.nativeElement.removeEventListener('transitionend', this._handleTransitionEnd);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatFormFieldLineRipple, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.0", type: MatFormFieldLineRipple, isStandalone: true, selector: "div[matFormFieldLineRipple]", host: { classAttribute: "mdc-line-ripple" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatFormFieldLineRipple, decorators: [{
            type: Directive,
            args: [{
                    selector: 'div[matFormFieldLineRipple]',
                    host: {
                        'class': 'mdc-line-ripple',
                    },
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1yaXBwbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9kaXJlY3RpdmVzL2xpbmUtcmlwcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBWSxNQUFNLGVBQWUsQ0FBQzs7QUFFdkUsa0RBQWtEO0FBQ2xELE1BQU0sY0FBYyxHQUFHLHlCQUF5QixDQUFDO0FBRWpELDZEQUE2RDtBQUM3RCxNQUFNLGtCQUFrQixHQUFHLCtCQUErQixDQUFDO0FBRTNEOzs7Ozs7O0dBT0c7QUFRSCxNQUFNLE9BQU8sc0JBQXNCO0lBQ2pDLFlBQ1UsV0FBb0MsRUFDNUMsTUFBYztRQUROLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQWtCdEMseUJBQW9CLEdBQUcsQ0FBQyxLQUFzQixFQUFFLEVBQUU7WUFDeEQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO1lBQzNELE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUU5RCxJQUFJLEtBQUssQ0FBQyxZQUFZLEtBQUssU0FBUyxJQUFJLGNBQWMsRUFBRTtnQkFDdEQsU0FBUyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzthQUN0RDtRQUNILENBQUMsQ0FBQztRQXRCQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO1lBQzVCLFdBQVcsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3pGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFFBQVE7UUFDTixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7UUFDM0QsU0FBUyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3JDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDbkUsQ0FBQztJQVdELFdBQVc7UUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDakcsQ0FBQzs4R0EvQlUsc0JBQXNCO2tHQUF0QixzQkFBc0I7OzJGQUF0QixzQkFBc0I7a0JBUGxDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDZCQUE2QjtvQkFDdkMsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxpQkFBaUI7cUJBQzNCO29CQUNELFVBQVUsRUFBRSxJQUFJO2lCQUNqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgTmdab25lLCBPbkRlc3Ryb3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKiogQ2xhc3MgYWRkZWQgd2hlbiB0aGUgbGluZSByaXBwbGUgaXMgYWN0aXZlLiAqL1xuY29uc3QgQUNUSVZBVEVfQ0xBU1MgPSAnbWRjLWxpbmUtcmlwcGxlLS1hY3RpdmUnO1xuXG4vKiogQ2xhc3MgYWRkZWQgd2hlbiB0aGUgbGluZSByaXBwbGUgaXMgYmVpbmcgZGVhY3RpdmF0ZWQuICovXG5jb25zdCBERUFDVElWQVRJTkdfQ0xBU1MgPSAnbWRjLWxpbmUtcmlwcGxlLS1kZWFjdGl2YXRpbmcnO1xuXG4vKipcbiAqIEludGVybmFsIGRpcmVjdGl2ZSB0aGF0IGNyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIE1EQyBsaW5lLXJpcHBsZSBjb21wb25lbnQuIFVzaW5nIGFcbiAqIGRpcmVjdGl2ZSBhbGxvd3MgdXMgdG8gY29uZGl0aW9uYWxseSByZW5kZXIgYSBsaW5lLXJpcHBsZSBpbiB0aGUgdGVtcGxhdGUgd2l0aG91dCBoYXZpbmdcbiAqIHRvIG1hbnVhbGx5IGNyZWF0ZSBhbmQgZGVzdHJveSB0aGUgYE1EQ0xpbmVSaXBwbGVgIGNvbXBvbmVudCB3aGVuZXZlciB0aGUgY29uZGl0aW9uIGNoYW5nZXMuXG4gKlxuICogVGhlIGRpcmVjdGl2ZSBzZXRzIHVwIHRoZSBzdHlsZXMgZm9yIHRoZSBsaW5lLXJpcHBsZSBhbmQgcHJvdmlkZXMgYW4gQVBJIGZvciBhY3RpdmF0aW5nXG4gKiBhbmQgZGVhY3RpdmF0aW5nIHRoZSBsaW5lLXJpcHBsZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnZGl2W21hdEZvcm1GaWVsZExpbmVSaXBwbGVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtZGMtbGluZS1yaXBwbGUnLFxuICB9LFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRGb3JtRmllbGRMaW5lUmlwcGxlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICkge1xuICAgIG5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0aGlzLl9oYW5kbGVUcmFuc2l0aW9uRW5kKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgY2xhc3NMaXN0LnJlbW92ZShERUFDVElWQVRJTkdfQ0xBU1MpO1xuICAgIGNsYXNzTGlzdC5hZGQoQUNUSVZBVEVfQ0xBU1MpO1xuICB9XG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChERUFDVElWQVRJTkdfQ0xBU1MpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaGFuZGxlVHJhbnNpdGlvbkVuZCA9IChldmVudDogVHJhbnNpdGlvbkV2ZW50KSA9PiB7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdDtcbiAgICBjb25zdCBpc0RlYWN0aXZhdGluZyA9IGNsYXNzTGlzdC5jb250YWlucyhERUFDVElWQVRJTkdfQ0xBU1MpO1xuXG4gICAgaWYgKGV2ZW50LnByb3BlcnR5TmFtZSA9PT0gJ29wYWNpdHknICYmIGlzRGVhY3RpdmF0aW5nKSB7XG4gICAgICBjbGFzc0xpc3QucmVtb3ZlKEFDVElWQVRFX0NMQVNTLCBERUFDVElWQVRJTkdfQ0xBU1MpO1xuICAgIH1cbiAgfTtcblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRoaXMuX2hhbmRsZVRyYW5zaXRpb25FbmQpO1xuICB9XG59XG4iXX0=