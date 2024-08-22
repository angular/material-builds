/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import { booleanAttribute, Directive, ElementRef, inject, InjectionToken, Input, NgZone, numberAttribute, } from '@angular/core';
import { MatRippleLoader } from '@angular/material/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/** Injection token that can be used to provide the default options the button component. */
export const MAT_BUTTON_CONFIG = new InjectionToken('MAT_BUTTON_CONFIG');
/** Shared host configuration for all buttons */
export const MAT_BUTTON_HOST = {
    '[attr.disabled]': '_getDisabledAttribute()',
    '[attr.aria-disabled]': '_getAriaDisabled()',
    '[class.mat-mdc-button-disabled]': 'disabled',
    '[class.mat-mdc-button-disabled-interactive]': 'disabledInteractive',
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
        mdcClasses: ['mdc-fab', 'mat-mdc-fab-base', 'mat-mdc-fab'],
    },
    {
        attribute: 'mat-mini-fab',
        mdcClasses: ['mdc-fab', 'mat-mdc-fab-base', 'mdc-fab--mini', 'mat-mdc-mini-fab'],
    },
    {
        attribute: 'mat-icon-button',
        mdcClasses: ['mdc-icon-button', 'mat-mdc-icon-button'],
    },
];
/** Base class for all buttons.  */
export class MatButtonBase {
    /** Whether the ripple effect is disabled or not. */
    get disableRipple() {
        return this._disableRipple;
    }
    set disableRipple(value) {
        this._disableRipple = value;
        this._updateRippleDisabled();
    }
    /** Whether the button is disabled. */
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
        const config = inject(MAT_BUTTON_CONFIG, { optional: true });
        const element = _elementRef.nativeElement;
        const classList = element.classList;
        this.disabledInteractive = config?.disabledInteractive ?? false;
        this.color = config?.color ?? null;
        this._rippleLoader?.configureRipple(element, { className: 'mat-mdc-button-ripple' });
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
    focus(origin = 'program', options) {
        if (origin) {
            this._focusMonitor.focusVia(this._elementRef.nativeElement, origin, options);
        }
        else {
            this._elementRef.nativeElement.focus(options);
        }
    }
    _getAriaDisabled() {
        if (this.ariaDisabled != null) {
            return this.ariaDisabled;
        }
        return this.disabled && this.disabledInteractive ? true : null;
    }
    _getDisabledAttribute() {
        return this.disabledInteractive || !this.disabled ? null : true;
    }
    _updateRippleDisabled() {
        this._rippleLoader?.setDisabled(this._elementRef.nativeElement, this.disableRipple || this.disabled);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatButtonBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "18.2.0-next.2", type: MatButtonBase, inputs: { color: "color", disableRipple: ["disableRipple", "disableRipple", booleanAttribute], disabled: ["disabled", "disabled", booleanAttribute], ariaDisabled: ["aria-disabled", "ariaDisabled", booleanAttribute], disabledInteractive: ["disabledInteractive", "disabledInteractive", booleanAttribute] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatButtonBase, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.Platform }, { type: i0.NgZone }, { type: undefined }], propDecorators: { color: [{
                type: Input
            }], disableRipple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], ariaDisabled: [{
                type: Input,
                args: [{ transform: booleanAttribute, alias: 'aria-disabled' }]
            }], disabledInteractive: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });
/** Shared host configuration for buttons using the `<a>` tag. */
export const MAT_ANCHOR_HOST = {
    '[attr.disabled]': '_getDisabledAttribute()',
    '[class.mat-mdc-button-disabled]': 'disabled',
    '[class.mat-mdc-button-disabled-interactive]': 'disabledInteractive',
    '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
    // Note that we ignore the user-specified tabindex when it's disabled for
    // consistency with the `mat-button` applied on native buttons where even
    // though they have an index, they're not tabbable.
    '[attr.tabindex]': 'disabled && !disabledInteractive ? -1 : tabIndex',
    '[attr.aria-disabled]': '_getDisabledAttribute()',
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
    _getAriaDisabled() {
        return this.ariaDisabled == null ? this.disabled : this.ariaDisabled;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatAnchorBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "18.2.0-next.2", type: MatAnchorBase, inputs: { tabIndex: ["tabIndex", "tabIndex", (value) => {
                    return value == null ? undefined : numberAttribute(value);
                }] }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatAnchorBase, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.Platform }, { type: i0.NgZone }, { type: undefined }], propDecorators: { tabIndex: [{
                type: Input,
                args: [{
                        transform: (value) => {
                            return value == null ? undefined : numberAttribute(value);
                        },
                    }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYnV0dG9uL2J1dHRvbi1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQWMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUVMLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFDTixlQUFlLEdBR2hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxlQUFlLEVBQWUsTUFBTSx3QkFBd0IsQ0FBQzs7O0FBV3JFLDRGQUE0RjtBQUM1RixNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGNBQWMsQ0FBa0IsbUJBQW1CLENBQUMsQ0FBQztBQUUxRixnREFBZ0Q7QUFDaEQsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHO0lBQzdCLGlCQUFpQixFQUFFLHlCQUF5QjtJQUM1QyxzQkFBc0IsRUFBRSxvQkFBb0I7SUFDNUMsaUNBQWlDLEVBQUUsVUFBVTtJQUM3Qyw2Q0FBNkMsRUFBRSxxQkFBcUI7SUFDcEUsaUNBQWlDLEVBQUUscUNBQXFDO0lBQ3hFLDBGQUEwRjtJQUMxRixzRkFBc0Y7SUFDdEYsaUNBQWlDO0lBQ2pDLHNCQUFzQixFQUFFLFFBQVE7SUFDaEMsc0ZBQXNGO0lBQ3RGLHdDQUF3QztJQUN4Qyw2QkFBNkIsRUFBRSxNQUFNO0lBQ3JDLFNBQVMsRUFBRSw2QkFBNkI7Q0FDekMsQ0FBQztBQUVGLG9GQUFvRjtBQUNwRixNQUFNLDRCQUE0QixHQUFnRDtJQUNoRjtRQUNFLFNBQVMsRUFBRSxZQUFZO1FBQ3ZCLFVBQVUsRUFBRSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQztL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YUFBYTtrQkFEekIsU0FBUztnSkFPUixRQUFRO3NCQUxQLEtBQUs7dUJBQUM7d0JBQ0wsU0FBUyxFQUFFLENBQUMsS0FBYyxFQUFFLEVBQUU7NEJBQzVCLE9BQU8sS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzVELENBQUM7cUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c01vbml0b3IsIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBpbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBudW1iZXJBdHRyaWJ1dGUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0UmlwcGxlTG9hZGVyLCBUaGVtZVBhbGV0dGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuXG4vKiogT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBidXR0b24gY29tcG9uZW50LiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRCdXR0b25Db25maWcge1xuICAvKiogV2hldGhlciBkaXNhYmxlZCBidXR0b25zIHNob3VsZCBiZSBpbnRlcmFjdGl2ZS4gKi9cbiAgZGlzYWJsZWRJbnRlcmFjdGl2ZT86IGJvb2xlYW47XG5cbiAgLyoqIERlZmF1bHQgcGFsZXR0ZSBjb2xvciB0byBhcHBseSB0byBidXR0b25zLiAqL1xuICBjb2xvcj86IFRoZW1lUGFsZXR0ZTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyB0aGUgYnV0dG9uIGNvbXBvbmVudC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQlVUVE9OX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRCdXR0b25Db25maWc+KCdNQVRfQlVUVE9OX0NPTkZJRycpO1xuXG4vKiogU2hhcmVkIGhvc3QgY29uZmlndXJhdGlvbiBmb3IgYWxsIGJ1dHRvbnMgKi9cbmV4cG9ydCBjb25zdCBNQVRfQlVUVE9OX0hPU1QgPSB7XG4gICdbYXR0ci5kaXNhYmxlZF0nOiAnX2dldERpc2FibGVkQXR0cmlidXRlKCknLFxuICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnX2dldEFyaWFEaXNhYmxlZCgpJyxcbiAgJ1tjbGFzcy5tYXQtbWRjLWJ1dHRvbi1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAnW2NsYXNzLm1hdC1tZGMtYnV0dG9uLWRpc2FibGVkLWludGVyYWN0aXZlXSc6ICdkaXNhYmxlZEludGVyYWN0aXZlJyxcbiAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gIC8vIE1EQyBhdXRvbWF0aWNhbGx5IGFwcGxpZXMgdGhlIHByaW1hcnkgdGhlbWUgY29sb3IgdG8gdGhlIGJ1dHRvbiwgYnV0IHdlIHdhbnQgdG8gc3VwcG9ydFxuICAvLyBhbiB1bnRoZW1lZCB2ZXJzaW9uLiBJZiBjb2xvciBpcyB1bmRlZmluZWQsIGFwcGx5IGEgQ1NTIGNsYXNzIHRoYXQgbWFrZXMgaXQgZWFzeSB0b1xuICAvLyBzZWxlY3QgYW5kIHN0eWxlIHRoaXMgXCJ0aGVtZVwiLlxuICAnW2NsYXNzLm1hdC11bnRoZW1lZF0nOiAnIWNvbG9yJyxcbiAgLy8gQWRkIGEgY2xhc3MgdGhhdCBhcHBsaWVzIHRvIGFsbCBidXR0b25zLiBUaGlzIG1ha2VzIGl0IGVhc2llciB0byB0YXJnZXQgaWYgc29tZWJvZHlcbiAgLy8gd2FudHMgdG8gdGFyZ2V0IGFsbCBNYXRlcmlhbCBidXR0b25zLlxuICAnW2NsYXNzLm1hdC1tZGMtYnV0dG9uLWJhc2VdJzogJ3RydWUnLFxuICAnW2NsYXNzXSc6ICdjb2xvciA/IFwibWF0LVwiICsgY29sb3IgOiBcIlwiJyxcbn07XG5cbi8qKiBMaXN0IG9mIGNsYXNzZXMgdG8gYWRkIHRvIGJ1dHRvbnMgaW5zdGFuY2VzIGJhc2VkIG9uIGhvc3QgYXR0cmlidXRlIHNlbGVjdG9yLiAqL1xuY29uc3QgSE9TVF9TRUxFQ1RPUl9NRENfQ0xBU1NfUEFJUjoge2F0dHJpYnV0ZTogc3RyaW5nOyBtZGNDbGFzc2VzOiBzdHJpbmdbXX1bXSA9IFtcbiAge1xuICAgIGF0dHJpYnV0ZTogJ21hdC1idXR0b24nLFxuICAgIG1kY0NsYXNzZXM6IFsnbWRjLWJ1dHRvbicsICdtYXQtbWRjLWJ1dHRvbiddLFxuICB9LFxuICB7XG4gICAgYXR0cmlidXRlOiAnbWF0LWZsYXQtYnV0dG9uJyxcbiAgICBtZGNDbGFzc2VzOiBbJ21kYy1idXR0b24nLCAnbWRjLWJ1dHRvbi0tdW5lbGV2YXRlZCcsICdtYXQtbWRjLXVuZWxldmF0ZWQtYnV0dG9uJ10sXG4gIH0sXG4gIHtcbiAgICBhdHRyaWJ1dGU6ICdtYXQtcmFpc2VkLWJ1dHRvbicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtYnV0dG9uJywgJ21kYy1idXR0b24tLXJhaXNlZCcsICdtYXQtbWRjLXJhaXNlZC1idXR0b24nXSxcbiAgfSxcbiAge1xuICAgIGF0dHJpYnV0ZTogJ21hdC1zdHJva2VkLWJ1dHRvbicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtYnV0dG9uJywgJ21kYy1idXR0b24tLW91dGxpbmVkJywgJ21hdC1tZGMtb3V0bGluZWQtYnV0dG9uJ10sXG4gIH0sXG4gIHtcbiAgICBhdHRyaWJ1dGU6ICdtYXQtZmFiJyxcbiAgICBtZGNDbGFzc2VzOiBbJ21kYy1mYWInLCAnbWF0LW1kYy1mYWItYmFzZScsICdtYXQtbWRjLWZhYiddLFxuICB9LFxuICB7XG4gICAgYXR0cmlidXRlOiAnbWF0LW1pbmktZmFiJyxcbiAgICBtZGNDbGFzc2VzOiBbJ21kYy1mYWInLCAnbWF0LW1kYy1mYWItYmFzZScsICdtZGMtZmFiLS1taW5pJywgJ21hdC1tZGMtbWluaS1mYWInXSxcbiAgfSxcbiAge1xuICAgIGF0dHJpYnV0ZTogJ21hdC1pY29uLWJ1dHRvbicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtaWNvbi1idXR0b24nLCAnbWF0LW1kYy1pY29uLWJ1dHRvbiddLFxuICB9LFxuXTtcblxuLyoqIEJhc2UgY2xhc3MgZm9yIGFsbCBidXR0b25zLiAgKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIE1hdEJ1dHRvbkJhc2UgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIHJlYWRvbmx5IF9mb2N1c01vbml0b3IgPSBpbmplY3QoRm9jdXNNb25pdG9yKTtcblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUgbGF6eSBjcmVhdGlvbiBvZiB0aGUgTWF0QnV0dG9uIHJpcHBsZS5cbiAgICogVXNlZCB0byBpbXByb3ZlIGluaXRpYWwgbG9hZCB0aW1lIG9mIGxhcmdlIGFwcGxpY2F0aW9ucy5cbiAgICovXG4gIHByb3RlY3RlZCBfcmlwcGxlTG9hZGVyOiBNYXRSaXBwbGVMb2FkZXIgPSBpbmplY3QoTWF0UmlwcGxlTG9hZGVyKTtcblxuICAvKiogV2hldGhlciB0aGlzIGJ1dHRvbiBpcyBhIEZBQi4gVXNlZCB0byBhcHBseSB0aGUgY29ycmVjdCBjbGFzcyBvbiB0aGUgcmlwcGxlLiAqL1xuICBwcm90ZWN0ZWQgX2lzRmFiID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZW1lIGNvbG9yIG9mIHRoZSBidXR0b24uIFRoaXMgQVBJIGlzIHN1cHBvcnRlZCBpbiBNMiB0aGVtZXMgb25seSwgaXQgaGFzXG4gICAqIG5vIGVmZmVjdCBpbiBNMyB0aGVtZXMuXG4gICAqXG4gICAqIEZvciBpbmZvcm1hdGlvbiBvbiBhcHBseWluZyBjb2xvciB2YXJpYW50cyBpbiBNMywgc2VlXG4gICAqIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS90aGVtaW5nI3VzaW5nLWNvbXBvbmVudC1jb2xvci12YXJpYW50cy5cbiAgICovXG4gIEBJbnB1dCgpIGNvbG9yPzogc3RyaW5nIHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgcmlwcGxlIGVmZmVjdCBpcyBkaXNhYmxlZCBvciBub3QuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZ2V0IGRpc2FibGVSaXBwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVSaXBwbGU7XG4gIH1cbiAgc2V0IGRpc2FibGVSaXBwbGUodmFsdWU6IGFueSkge1xuICAgIHRoaXMuX2Rpc2FibGVSaXBwbGUgPSB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVSaXBwbGVEaXNhYmxlZCgpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgYnV0dG9uIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZVJpcHBsZURpc2FibGVkKCk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogYGFyaWEtZGlzYWJsZWRgIHZhbHVlIG9mIHRoZSBidXR0b24uICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlLCBhbGlhczogJ2FyaWEtZGlzYWJsZWQnfSlcbiAgYXJpYURpc2FibGVkOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBOYXRpdmVseSBkaXNhYmxlZCBidXR0b25zIHByZXZlbnQgZm9jdXMgYW5kIGFueSBwb2ludGVyIGV2ZW50cyBmcm9tIHJlYWNoaW5nIHRoZSBidXR0b24uXG4gICAqIEluIHNvbWUgc2NlbmFyaW9zIHRoaXMgbWlnaHQgbm90IGJlIGRlc2lyYWJsZSwgYmVjYXVzZSBpdCBjYW4gcHJldmVudCB1c2VycyBmcm9tIGZpbmRpbmcgb3V0XG4gICAqIHdoeSB0aGUgYnV0dG9uIGlzIGRpc2FibGVkIChlLmcuIHZpYSB0b29sdGlwKS5cbiAgICpcbiAgICogRW5hYmxpbmcgdGhpcyBpbnB1dCB3aWxsIGNoYW5nZSB0aGUgYnV0dG9uIHNvIHRoYXQgaXQgaXMgc3R5bGVkIHRvIGJlIGRpc2FibGVkIGFuZCB3aWxsIGJlXG4gICAqIG1hcmtlZCBhcyBgYXJpYS1kaXNhYmxlZGAsIGJ1dCBpdCB3aWxsIGFsbG93IHRoZSBidXR0b24gdG8gcmVjZWl2ZSBldmVudHMgYW5kIGZvY3VzLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgYnkgZW5hYmxpbmcgdGhpcywgeW91IG5lZWQgdG8gc2V0IHRoZSBgdGFiaW5kZXhgIHlvdXJzZWxmIGlmIHRoZSBidXR0b24gaXNuJ3RcbiAgICogbWVhbnQgdG8gYmUgdGFiYmFibGUgYW5kIHlvdSBoYXZlIHRvIHByZXZlbnQgdGhlIGJ1dHRvbiBhY3Rpb24gKGUuZy4gZm9ybSBzdWJtaXNzaW9ucykuXG4gICAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGRpc2FibGVkSW50ZXJhY3RpdmU6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHB1YmxpYyBfbmdab25lOiBOZ1pvbmUsXG4gICAgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICBjb25zdCBjb25maWcgPSBpbmplY3QoTUFUX0JVVFRPTl9DT05GSUcsIHtvcHRpb25hbDogdHJ1ZX0pO1xuICAgIGNvbnN0IGVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3Q7XG5cbiAgICB0aGlzLmRpc2FibGVkSW50ZXJhY3RpdmUgPSBjb25maWc/LmRpc2FibGVkSW50ZXJhY3RpdmUgPz8gZmFsc2U7XG4gICAgdGhpcy5jb2xvciA9IGNvbmZpZz8uY29sb3IgPz8gbnVsbDtcbiAgICB0aGlzLl9yaXBwbGVMb2FkZXI/LmNvbmZpZ3VyZVJpcHBsZShlbGVtZW50LCB7Y2xhc3NOYW1lOiAnbWF0LW1kYy1idXR0b24tcmlwcGxlJ30pO1xuXG4gICAgLy8gRm9yIGVhY2ggb2YgdGhlIHZhcmlhbnQgc2VsZWN0b3JzIHRoYXQgaXMgcHJlc2VudCBpbiB0aGUgYnV0dG9uJ3MgaG9zdFxuICAgIC8vIGF0dHJpYnV0ZXMsIGFkZCB0aGUgY29ycmVjdCBjb3JyZXNwb25kaW5nIE1EQyBjbGFzc2VzLlxuICAgIGZvciAoY29uc3Qge2F0dHJpYnV0ZSwgbWRjQ2xhc3Nlc30gb2YgSE9TVF9TRUxFQ1RPUl9NRENfQ0xBU1NfUEFJUikge1xuICAgICAgaWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgY2xhc3NMaXN0LmFkZCguLi5tZGNDbGFzc2VzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgdHJ1ZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgdGhpcy5fcmlwcGxlTG9hZGVyPy5kZXN0cm95UmlwcGxlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgYnV0dG9uLiAqL1xuICBmb2N1cyhvcmlnaW46IEZvY3VzT3JpZ2luID0gJ3Byb2dyYW0nLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKG9yaWdpbikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgb3JpZ2luLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZ2V0QXJpYURpc2FibGVkKCkge1xuICAgIGlmICh0aGlzLmFyaWFEaXNhYmxlZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcmlhRGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgJiYgdGhpcy5kaXNhYmxlZEludGVyYWN0aXZlID8gdHJ1ZSA6IG51bGw7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2dldERpc2FibGVkQXR0cmlidXRlKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkSW50ZXJhY3RpdmUgfHwgIXRoaXMuZGlzYWJsZWQgPyBudWxsIDogdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVJpcHBsZURpc2FibGVkKCk6IHZvaWQge1xuICAgIHRoaXMuX3JpcHBsZUxvYWRlcj8uc2V0RGlzYWJsZWQoXG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsXG4gICAgICB0aGlzLmRpc2FibGVSaXBwbGUgfHwgdGhpcy5kaXNhYmxlZCxcbiAgICApO1xuICB9XG59XG5cbi8qKiBTaGFyZWQgaG9zdCBjb25maWd1cmF0aW9uIGZvciBidXR0b25zIHVzaW5nIHRoZSBgPGE+YCB0YWcuICovXG5leHBvcnQgY29uc3QgTUFUX0FOQ0hPUl9IT1NUID0ge1xuICAnW2F0dHIuZGlzYWJsZWRdJzogJ19nZXREaXNhYmxlZEF0dHJpYnV0ZSgpJyxcbiAgJ1tjbGFzcy5tYXQtbWRjLWJ1dHRvbi1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAnW2NsYXNzLm1hdC1tZGMtYnV0dG9uLWRpc2FibGVkLWludGVyYWN0aXZlXSc6ICdkaXNhYmxlZEludGVyYWN0aXZlJyxcbiAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG5cbiAgLy8gTm90ZSB0aGF0IHdlIGlnbm9yZSB0aGUgdXNlci1zcGVjaWZpZWQgdGFiaW5kZXggd2hlbiBpdCdzIGRpc2FibGVkIGZvclxuICAvLyBjb25zaXN0ZW5jeSB3aXRoIHRoZSBgbWF0LWJ1dHRvbmAgYXBwbGllZCBvbiBuYXRpdmUgYnV0dG9ucyB3aGVyZSBldmVuXG4gIC8vIHRob3VnaCB0aGV5IGhhdmUgYW4gaW5kZXgsIHRoZXkncmUgbm90IHRhYmJhYmxlLlxuICAnW2F0dHIudGFiaW5kZXhdJzogJ2Rpc2FibGVkICYmICFkaXNhYmxlZEludGVyYWN0aXZlID8gLTEgOiB0YWJJbmRleCcsXG4gICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdfZ2V0RGlzYWJsZWRBdHRyaWJ1dGUoKScsXG4gIC8vIE1EQyBhdXRvbWF0aWNhbGx5IGFwcGxpZXMgdGhlIHByaW1hcnkgdGhlbWUgY29sb3IgdG8gdGhlIGJ1dHRvbiwgYnV0IHdlIHdhbnQgdG8gc3VwcG9ydFxuICAvLyBhbiB1bnRoZW1lZCB2ZXJzaW9uLiBJZiBjb2xvciBpcyB1bmRlZmluZWQsIGFwcGx5IGEgQ1NTIGNsYXNzIHRoYXQgbWFrZXMgaXQgZWFzeSB0b1xuICAvLyBzZWxlY3QgYW5kIHN0eWxlIHRoaXMgXCJ0aGVtZVwiLlxuICAnW2NsYXNzLm1hdC11bnRoZW1lZF0nOiAnIWNvbG9yJyxcbiAgLy8gQWRkIGEgY2xhc3MgdGhhdCBhcHBsaWVzIHRvIGFsbCBidXR0b25zLiBUaGlzIG1ha2VzIGl0IGVhc2llciB0byB0YXJnZXQgaWYgc29tZWJvZHlcbiAgLy8gd2FudHMgdG8gdGFyZ2V0IGFsbCBNYXRlcmlhbCBidXR0b25zLlxuICAnW2NsYXNzLm1hdC1tZGMtYnV0dG9uLWJhc2VdJzogJ3RydWUnLFxuICAnW2NsYXNzXSc6ICdjb2xvciA/IFwibWF0LVwiICsgY29sb3IgOiBcIlwiJyxcbn07XG5cbi8qKlxuICogQW5jaG9yIGJ1dHRvbiBiYXNlLlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBNYXRBbmNob3JCYXNlIGV4dGVuZHMgTWF0QnV0dG9uQmFzZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KHtcbiAgICB0cmFuc2Zvcm06ICh2YWx1ZTogdW5rbm93bikgPT4ge1xuICAgICAgcmV0dXJuIHZhbHVlID09IG51bGwgPyB1bmRlZmluZWQgOiBudW1iZXJBdHRyaWJ1dGUodmFsdWUpO1xuICAgIH0sXG4gIH0pXG4gIHRhYkluZGV4OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcGxhdGZvcm06IFBsYXRmb3JtLCBuZ1pvbmU6IE5nWm9uZSwgYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIHBsYXRmb3JtLCBuZ1pvbmUsIGFuaW1hdGlvbk1vZGUpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2hhbHREaXNhYmxlZEV2ZW50cyk7XG4gICAgfSk7XG4gIH1cblxuICBvdmVycmlkZSBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2hhbHREaXNhYmxlZEV2ZW50cyk7XG4gIH1cblxuICBfaGFsdERpc2FibGVkRXZlbnRzID0gKGV2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xuICAgIC8vIEEgZGlzYWJsZWQgYnV0dG9uIHNob3VsZG4ndCBhcHBseSBhbnkgYWN0aW9uc1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9O1xuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfZ2V0QXJpYURpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmFyaWFEaXNhYmxlZCA9PSBudWxsID8gdGhpcy5kaXNhYmxlZCA6IHRoaXMuYXJpYURpc2FibGVkO1xuICB9XG59XG4iXX0=