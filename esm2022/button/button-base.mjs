/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import { booleanAttribute, Directive, ElementRef, inject, Input, NgZone, numberAttribute, } from '@angular/core';
import { MatRippleLoader } from '@angular/material/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/** Shared host configuration for all buttons */
export const MAT_BUTTON_HOST = {
    '[attr.disabled]': 'disabled || null',
    '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
    // MDC automatically applies the primary theme color to the button, but we want to support
    // an unthemed version. If color is undefined, apply a CSS class that makes it easy to
    // select and style this "theme".
    '[class.mat-unthemed]': '!color',
    // Add a class that applies to all buttons. This makes it easier to target if somebody
    // wants to target all Material buttons.
    '[class.mat-mdc-button-base]': 'true',
    '[class]': 'color ? "mat-" + color : ""',
};
/** List of classes to add to buttons instances based on host attribute selector. */
const HOST_SELECTOR_MDC_CLASS_PAIR = [
    {
        attribute: 'mat-button',
        mdcClasses: ['mdc-button', 'mat-mdc-button'],
    },
    {
        attribute: 'mat-flat-button',
        mdcClasses: ['mdc-button', 'mdc-button--unelevated', 'mat-mdc-unelevated-button'],
    },
    {
        attribute: 'mat-raised-button',
        mdcClasses: ['mdc-button', 'mdc-button--raised', 'mat-mdc-raised-button'],
    },
    {
        attribute: 'mat-stroked-button',
        mdcClasses: ['mdc-button', 'mdc-button--outlined', 'mat-mdc-outlined-button'],
    },
    {
        attribute: 'mat-fab',
        mdcClasses: ['mdc-fab', 'mat-mdc-fab'],
    },
    {
        attribute: 'mat-mini-fab',
        mdcClasses: ['mdc-fab', 'mdc-fab--mini', 'mat-mdc-mini-fab'],
    },
    {
        attribute: 'mat-icon-button',
        mdcClasses: ['mdc-icon-button', 'mat-mdc-icon-button'],
    },
];
/** Base class for all buttons.  */
export class MatButtonBase {
    /**
     * Reference to the MatRipple instance of the button.
     * @deprecated Considered an implementation detail. To be removed.
     * @breaking-change 17.0.0
     */
    get ripple() {
        return this._rippleLoader?.getRipple(this._elementRef.nativeElement);
    }
    set ripple(v) {
        this._rippleLoader?.attachRipple(this._elementRef.nativeElement, v);
    }
    /** Whether the ripple effect is disabled or not. */
    get disableRipple() {
        return this._disableRipple;
    }
    set disableRipple(value) {
        this._disableRipple = value;
        this._updateRippleDisabled();
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = value;
        this._updateRippleDisabled();
    }
    constructor(_elementRef, _platform, _ngZone, _animationMode) {
        this._elementRef = _elementRef;
        this._platform = _platform;
        this._ngZone = _ngZone;
        this._animationMode = _animationMode;
        this._focusMonitor = inject(FocusMonitor);
        /**
         * Handles the lazy creation of the MatButton ripple.
         * Used to improve initial load time of large applications.
         */
        this._rippleLoader = inject(MatRippleLoader);
        /** Whether this button is a FAB. Used to apply the correct class on the ripple. */
        this._isFab = false;
        this._disableRipple = false;
        this._disabled = false;
        this._rippleLoader?.configureRipple(this._elementRef.nativeElement, {
            className: 'mat-mdc-button-ripple',
        });
        const element = this._elementRef.nativeElement;
        const classList = element.classList;
        // For each of the variant selectors that is present in the button's host
        // attributes, add the correct corresponding MDC classes.
        for (const { attribute, mdcClasses } of HOST_SELECTOR_MDC_CLASS_PAIR) {
            if (element.hasAttribute(attribute)) {
                classList.add(...mdcClasses);
            }
        }
    }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true);
    }
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
        this._rippleLoader?.destroyRipple(this._elementRef.nativeElement);
    }
    /** Focuses the button. */
    focus(_origin = 'program', options) {
        if (_origin) {
            this._focusMonitor.focusVia(this._elementRef.nativeElement, _origin, options);
        }
        else {
            this._elementRef.nativeElement.focus(options);
        }
    }
    _updateRippleDisabled() {
        this._rippleLoader?.setDisabled(this._elementRef.nativeElement, this.disableRipple || this.disabled);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatButtonBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.0.4", type: MatButtonBase, inputs: { color: "color", disableRipple: ["disableRipple", "disableRipple", booleanAttribute], disabled: ["disabled", "disabled", booleanAttribute] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatButtonBase, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.Platform }, { type: i0.NgZone }, { type: undefined }], propDecorators: { color: [{
                type: Input
            }], disableRipple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });
/** Shared host configuration for buttons using the `<a>` tag. */
export const MAT_ANCHOR_HOST = {
    '[attr.disabled]': 'disabled || null',
    '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
    // Note that we ignore the user-specified tabindex when it's disabled for
    // consistency with the `mat-button` applied on native buttons where even
    // though they have an index, they're not tabbable.
    '[attr.tabindex]': 'disabled ? -1 : tabIndex',
    '[attr.aria-disabled]': 'disabled.toString()',
    // MDC automatically applies the primary theme color to the button, but we want to support
    // an unthemed version. If color is undefined, apply a CSS class that makes it easy to
    // select and style this "theme".
    '[class.mat-unthemed]': '!color',
    // Add a class that applies to all buttons. This makes it easier to target if somebody
    // wants to target all Material buttons.
    '[class.mat-mdc-button-base]': 'true',
    '[class]': 'color ? "mat-" + color : ""',
};
/**
 * Anchor button base.
 */
export class MatAnchorBase extends MatButtonBase {
    constructor(elementRef, platform, ngZone, animationMode) {
        super(elementRef, platform, ngZone, animationMode);
        this._haltDisabledEvents = (event) => {
            // A disabled button shouldn't apply any actions
            if (this.disabled) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        };
    }
    ngOnInit() {
        this._ngZone.runOutsideAngular(() => {
            this._elementRef.nativeElement.addEventListener('click', this._haltDisabledEvents);
        });
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this._elementRef.nativeElement.removeEventListener('click', this._haltDisabledEvents);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatAnchorBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.0.4", type: MatAnchorBase, inputs: { tabIndex: ["tabIndex", "tabIndex", (value) => {
                    return value == null ? undefined : numberAttribute(value);
                }] }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatAnchorBase, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.Platform }, { type: i0.NgZone }, { type: undefined }], propDecorators: { tabIndex: [{
                type: Input,
                args: [{
                        transform: (value) => {
                            return value == null ? undefined : numberAttribute(value);
                        },
                    }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYnV0dG9uL2J1dHRvbi1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQWMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUVMLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLGVBQWUsR0FHaEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFZLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDOzs7QUFFbEUsZ0RBQWdEO0FBQ2hELE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRztJQUM3QixpQkFBaUIsRUFBRSxrQkFBa0I7SUFDckMsaUNBQWlDLEVBQUUscUNBQXFDO0lBQ3hFLDBGQUEwRjtJQUMxRixzRkFBc0Y7SUFDdEYsaUNBQWlDO0lBQ2pDLHNCQUFzQixFQUFFLFFBQVE7SUFDaEMsc0ZBQXNGO0lBQ3RGLHdDQUF3QztJQUN4Qyw2QkFBNkIsRUFBRSxNQUFNO0lBQ3JDLFNBQVMsRUFBRSw2QkFBNkI7Q0FDekMsQ0FBQztBQUVGLG9GQUFvRjtBQUNwRixNQUFNLDRCQUE0QixHQUFnRDtJQUNoRjtRQUNFLFNBQVMsRUFBRSxZQUFZO1FBQ3ZCLFVBQVUsRUFBRSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQztLQUM3QztJQUNEO1FBQ0UsU0FBUyxFQUFFLGlCQUFpQjtRQUM1QixVQUFVLEVBQUUsQ0FBQyxZQUFZLEVBQUUsd0JBQXdCLEVBQUUsMkJBQTJCLENBQUM7S0FDbEY7SUFDRDtRQUNFLFNBQVMsRUFBRSxtQkFBbUI7UUFDOUIsVUFBVSxFQUFFLENBQUMsWUFBWSxFQUFFLG9CQUFvQixFQUFF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LENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVELENBQUM7OzJGQUpRLGFBQWE7a0JBRHpCLFNBQVM7Z0pBT1IsUUFBUTtzQkFMUCxLQUFLO3VCQUFDO3dCQUNMLFNBQVMsRUFBRSxDQUFDLEtBQWMsRUFBRSxFQUFFOzRCQUM1QixPQUFPLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUM1RCxDQUFDO3FCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNNb25pdG9yLCBGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgaW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBudW1iZXJBdHRyaWJ1dGUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0UmlwcGxlLCBNYXRSaXBwbGVMb2FkZXJ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuXG4vKiogU2hhcmVkIGhvc3QgY29uZmlndXJhdGlvbiBmb3IgYWxsIGJ1dHRvbnMgKi9cbmV4cG9ydCBjb25zdCBNQVRfQlVUVE9OX0hPU1QgPSB7XG4gICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQgfHwgbnVsbCcsXG4gICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25Nb2RlID09PSBcIk5vb3BBbmltYXRpb25zXCInLFxuICAvLyBNREMgYXV0b21hdGljYWxseSBhcHBsaWVzIHRoZSBwcmltYXJ5IHRoZW1lIGNvbG9yIHRvIHRoZSBidXR0b24sIGJ1dCB3ZSB3YW50IHRvIHN1cHBvcnRcbiAgLy8gYW4gdW50aGVtZWQgdmVyc2lvbi4gSWYgY29sb3IgaXMgdW5kZWZpbmVkLCBhcHBseSBhIENTUyBjbGFzcyB0aGF0IG1ha2VzIGl0IGVhc3kgdG9cbiAgLy8gc2VsZWN0IGFuZCBzdHlsZSB0aGlzIFwidGhlbWVcIi5cbiAgJ1tjbGFzcy5tYXQtdW50aGVtZWRdJzogJyFjb2xvcicsXG4gIC8vIEFkZCBhIGNsYXNzIHRoYXQgYXBwbGllcyB0byBhbGwgYnV0dG9ucy4gVGhpcyBtYWtlcyBpdCBlYXNpZXIgdG8gdGFyZ2V0IGlmIHNvbWVib2R5XG4gIC8vIHdhbnRzIHRvIHRhcmdldCBhbGwgTWF0ZXJpYWwgYnV0dG9ucy5cbiAgJ1tjbGFzcy5tYXQtbWRjLWJ1dHRvbi1iYXNlXSc6ICd0cnVlJyxcbiAgJ1tjbGFzc10nOiAnY29sb3IgPyBcIm1hdC1cIiArIGNvbG9yIDogXCJcIicsXG59O1xuXG4vKiogTGlzdCBvZiBjbGFzc2VzIHRvIGFkZCB0byBidXR0b25zIGluc3RhbmNlcyBiYXNlZCBvbiBob3N0IGF0dHJpYnV0ZSBzZWxlY3Rvci4gKi9cbmNvbnN0IEhPU1RfU0VMRUNUT1JfTURDX0NMQVNTX1BBSVI6IHthdHRyaWJ1dGU6IHN0cmluZzsgbWRjQ2xhc3Nlczogc3RyaW5nW119W10gPSBbXG4gIHtcbiAgICBhdHRyaWJ1dGU6ICdtYXQtYnV0dG9uJyxcbiAgICBtZGNDbGFzc2VzOiBbJ21kYy1idXR0b24nLCAnbWF0LW1kYy1idXR0b24nXSxcbiAgfSxcbiAge1xuICAgIGF0dHJpYnV0ZTogJ21hdC1mbGF0LWJ1dHRvbicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtYnV0dG9uJywgJ21kYy1idXR0b24tLXVuZWxldmF0ZWQnLCAnbWF0LW1kYy11bmVsZXZhdGVkLWJ1dHRvbiddLFxuICB9LFxuICB7XG4gICAgYXR0cmlidXRlOiAnbWF0LXJhaXNlZC1idXR0b24nLFxuICAgIG1kY0NsYXNzZXM6IFsnbWRjLWJ1dHRvbicsICdtZGMtYnV0dG9uLS1yYWlzZWQnLCAnbWF0LW1kYy1yYWlzZWQtYnV0dG9uJ10sXG4gIH0sXG4gIHtcbiAgICBhdHRyaWJ1dGU6ICdtYXQtc3Ryb2tlZC1idXR0b24nLFxuICAgIG1kY0NsYXNzZXM6IFsnbWRjLWJ1dHRvbicsICdtZGMtYnV0dG9uLS1vdXRsaW5lZCcsICdtYXQtbWRjLW91dGxpbmVkLWJ1dHRvbiddLFxuICB9LFxuICB7XG4gICAgYXR0cmlidXRlOiAnbWF0LWZhYicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtZmFiJywgJ21hdC1tZGMtZmFiJ10sXG4gIH0sXG4gIHtcbiAgICBhdHRyaWJ1dGU6ICdtYXQtbWluaS1mYWInLFxuICAgIG1kY0NsYXNzZXM6IFsnbWRjLWZhYicsICdtZGMtZmFiLS1taW5pJywgJ21hdC1tZGMtbWluaS1mYWInXSxcbiAgfSxcbiAge1xuICAgIGF0dHJpYnV0ZTogJ21hdC1pY29uLWJ1dHRvbicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtaWNvbi1idXR0b24nLCAnbWF0LW1kYy1pY29uLWJ1dHRvbiddLFxuICB9LFxuXTtcblxuLyoqIEJhc2UgY2xhc3MgZm9yIGFsbCBidXR0b25zLiAgKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIE1hdEJ1dHRvbkJhc2UgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIHJlYWRvbmx5IF9mb2N1c01vbml0b3IgPSBpbmplY3QoRm9jdXNNb25pdG9yKTtcblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUgbGF6eSBjcmVhdGlvbiBvZiB0aGUgTWF0QnV0dG9uIHJpcHBsZS5cbiAgICogVXNlZCB0byBpbXByb3ZlIGluaXRpYWwgbG9hZCB0aW1lIG9mIGxhcmdlIGFwcGxpY2F0aW9ucy5cbiAgICovXG4gIF9yaXBwbGVMb2FkZXI6IE1hdFJpcHBsZUxvYWRlciA9IGluamVjdChNYXRSaXBwbGVMb2FkZXIpO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgYnV0dG9uIGlzIGEgRkFCLiBVc2VkIHRvIGFwcGx5IHRoZSBjb3JyZWN0IGNsYXNzIG9uIHRoZSByaXBwbGUuICovXG4gIF9pc0ZhYiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIE1hdFJpcHBsZSBpbnN0YW5jZSBvZiB0aGUgYnV0dG9uLlxuICAgKiBAZGVwcmVjYXRlZCBDb25zaWRlcmVkIGFuIGltcGxlbWVudGF0aW9uIGRldGFpbC4gVG8gYmUgcmVtb3ZlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAgICovXG4gIGdldCByaXBwbGUoKTogTWF0UmlwcGxlIHtcbiAgICByZXR1cm4gdGhpcy5fcmlwcGxlTG9hZGVyPy5nZXRSaXBwbGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSE7XG4gIH1cbiAgc2V0IHJpcHBsZSh2OiBNYXRSaXBwbGUpIHtcbiAgICB0aGlzLl9yaXBwbGVMb2FkZXI/LmF0dGFjaFJpcHBsZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHYpO1xuICB9XG5cbiAgLyoqIFRoZW1lIGNvbG9yIHBhbGV0dGUgb2YgdGhlIGJ1dHRvbiAqL1xuICBASW5wdXQoKSBjb2xvcj86IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBlZmZlY3QgaXMgZGlzYWJsZWQgb3Igbm90LiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGdldCBkaXNhYmxlUmlwcGxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlUmlwcGxlO1xuICB9XG4gIHNldCBkaXNhYmxlUmlwcGxlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl9kaXNhYmxlUmlwcGxlID0gdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlUmlwcGxlRGlzYWJsZWQoKTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlUmlwcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVSaXBwbGVEaXNhYmxlZCgpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHB1YmxpYyBfbmdab25lOiBOZ1pvbmUsXG4gICAgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICB0aGlzLl9yaXBwbGVMb2FkZXI/LmNvbmZpZ3VyZVJpcHBsZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHtcbiAgICAgIGNsYXNzTmFtZTogJ21hdC1tZGMtYnV0dG9uLXJpcHBsZScsXG4gICAgfSk7XG5cbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3Q7XG5cbiAgICAvLyBGb3IgZWFjaCBvZiB0aGUgdmFyaWFudCBzZWxlY3RvcnMgdGhhdCBpcyBwcmVzZW50IGluIHRoZSBidXR0b24ncyBob3N0XG4gICAgLy8gYXR0cmlidXRlcywgYWRkIHRoZSBjb3JyZWN0IGNvcnJlc3BvbmRpbmcgTURDIGNsYXNzZXMuXG4gICAgZm9yIChjb25zdCB7YXR0cmlidXRlLCBtZGNDbGFzc2VzfSBvZiBIT1NUX1NFTEVDVE9SX01EQ19DTEFTU19QQUlSKSB7XG4gICAgICBpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlKSkge1xuICAgICAgICBjbGFzc0xpc3QuYWRkKC4uLm1kY0NsYXNzZXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLCB0cnVlKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgICB0aGlzLl9yaXBwbGVMb2FkZXI/LmRlc3Ryb3lSaXBwbGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBidXR0b24uICovXG4gIGZvY3VzKF9vcmlnaW46IEZvY3VzT3JpZ2luID0gJ3Byb2dyYW0nLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKF9vcmlnaW4pIHtcbiAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIF9vcmlnaW4sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlUmlwcGxlRGlzYWJsZWQoKTogdm9pZCB7XG4gICAgdGhpcy5fcmlwcGxlTG9hZGVyPy5zZXREaXNhYmxlZChcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgIHRoaXMuZGlzYWJsZVJpcHBsZSB8fCB0aGlzLmRpc2FibGVkLFxuICAgICk7XG4gIH1cbn1cblxuLyoqIFNoYXJlZCBob3N0IGNvbmZpZ3VyYXRpb24gZm9yIGJ1dHRvbnMgdXNpbmcgdGhlIGA8YT5gIHRhZy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQU5DSE9SX0hPU1QgPSB7XG4gICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQgfHwgbnVsbCcsXG4gICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25Nb2RlID09PSBcIk5vb3BBbmltYXRpb25zXCInLFxuXG4gIC8vIE5vdGUgdGhhdCB3ZSBpZ25vcmUgdGhlIHVzZXItc3BlY2lmaWVkIHRhYmluZGV4IHdoZW4gaXQncyBkaXNhYmxlZCBmb3JcbiAgLy8gY29uc2lzdGVuY3kgd2l0aCB0aGUgYG1hdC1idXR0b25gIGFwcGxpZWQgb24gbmF0aXZlIGJ1dHRvbnMgd2hlcmUgZXZlblxuICAvLyB0aG91Z2ggdGhleSBoYXZlIGFuIGluZGV4LCB0aGV5J3JlIG5vdCB0YWJiYWJsZS5cbiAgJ1thdHRyLnRhYmluZGV4XSc6ICdkaXNhYmxlZCA/IC0xIDogdGFiSW5kZXgnLFxuICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gIC8vIE1EQyBhdXRvbWF0aWNhbGx5IGFwcGxpZXMgdGhlIHByaW1hcnkgdGhlbWUgY29sb3IgdG8gdGhlIGJ1dHRvbiwgYnV0IHdlIHdhbnQgdG8gc3VwcG9ydFxuICAvLyBhbiB1bnRoZW1lZCB2ZXJzaW9uLiBJZiBjb2xvciBpcyB1bmRlZmluZWQsIGFwcGx5IGEgQ1NTIGNsYXNzIHRoYXQgbWFrZXMgaXQgZWFzeSB0b1xuICAvLyBzZWxlY3QgYW5kIHN0eWxlIHRoaXMgXCJ0aGVtZVwiLlxuICAnW2NsYXNzLm1hdC11bnRoZW1lZF0nOiAnIWNvbG9yJyxcbiAgLy8gQWRkIGEgY2xhc3MgdGhhdCBhcHBsaWVzIHRvIGFsbCBidXR0b25zLiBUaGlzIG1ha2VzIGl0IGVhc2llciB0byB0YXJnZXQgaWYgc29tZWJvZHlcbiAgLy8gd2FudHMgdG8gdGFyZ2V0IGFsbCBNYXRlcmlhbCBidXR0b25zLlxuICAnW2NsYXNzLm1hdC1tZGMtYnV0dG9uLWJhc2VdJzogJ3RydWUnLFxuICAnW2NsYXNzXSc6ICdjb2xvciA/IFwibWF0LVwiICsgY29sb3IgOiBcIlwiJyxcbn07XG5cbi8qKlxuICogQW5jaG9yIGJ1dHRvbiBiYXNlLlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBNYXRBbmNob3JCYXNlIGV4dGVuZHMgTWF0QnV0dG9uQmFzZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KHtcbiAgICB0cmFuc2Zvcm06ICh2YWx1ZTogdW5rbm93bikgPT4ge1xuICAgICAgcmV0dXJuIHZhbHVlID09IG51bGwgPyB1bmRlZmluZWQgOiBudW1iZXJBdHRyaWJ1dGUodmFsdWUpO1xuICAgIH0sXG4gIH0pXG4gIHRhYkluZGV4OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcGxhdGZvcm06IFBsYXRmb3JtLCBuZ1pvbmU6IE5nWm9uZSwgYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIHBsYXRmb3JtLCBuZ1pvbmUsIGFuaW1hdGlvbk1vZGUpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2hhbHREaXNhYmxlZEV2ZW50cyk7XG4gICAgfSk7XG4gIH1cblxuICBvdmVycmlkZSBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2hhbHREaXNhYmxlZEV2ZW50cyk7XG4gIH1cblxuICBfaGFsdERpc2FibGVkRXZlbnRzID0gKGV2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xuICAgIC8vIEEgZGlzYWJsZWQgYnV0dG9uIHNob3VsZG4ndCBhcHBseSBhbnkgYWN0aW9uc1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9O1xufVxuIl19