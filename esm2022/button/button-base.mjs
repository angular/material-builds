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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatButtonBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.1.0-next.2", type: MatButtonBase, inputs: { color: "color", disableRipple: ["disableRipple", "disableRipple", booleanAttribute], disabled: ["disabled", "disabled", booleanAttribute] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatButtonBase, decorators: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatAnchorBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.1.0-next.2", type: MatAnchorBase, inputs: { tabIndex: ["tabIndex", "tabIndex", (value) => {
                    return value == null ? undefined : numberAttribute(value);
                }] }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatAnchorBase, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.Platform }, { type: i0.NgZone }, { type: undefined }], propDecorators: { tabIndex: [{
                type: Input,
                args: [{
                        transform: (value) => {
                            return value == null ? undefined : numberAttribute(value);
                        },
                    }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYnV0dG9uL2J1dHRvbi1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQWMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUVMLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLGVBQWUsR0FHaEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFZLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDOzs7QUFFbEUsZ0RBQWdEO0FBQ2hELE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRztJQUM3QixpQkFBaUIsRUFBRSxrQkFBa0I7SUFDckMsaUNBQWlDLEVBQUUscUNBQXFDO0lBQ3hFLDBGQUEwRjtJQUMxRixzRkFBc0Y7SUFDdEYsaUNBQWlDO0lBQ2pDLHNCQUFzQixFQUFFLFFBQVE7SUFDaEMsc0ZBQXNGO0lBQ3RGLHdDQUF3QztJQUN4Qyw2QkFBNkIsRUFBRSxNQUFNO0lBQ3JDLFNBQVMsRUFBRSw2QkFBNkI7Q0FDekMsQ0FBQztBQUVGLG9GQUFvRjtBQUNwRixNQUFNLDRCQUE0QixHQUFnRDtJQUNoRjtRQUNFLFNBQVMsRUFBRSxZQUFZO1FBQ3ZCLFVBQVUsRUFBRSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQztLQUM3QztJQUNEO1FBQ0UsU0FBUyxFQUFFLGlCQUFpQjtRQUM1QixVQUFVLEVBQUUsQ0FBQyxZQUFZLEVBQUUsd0JBQXdCLEVBQUUsMkJBQTJCLENBQUM7S0FDbEY7SUFDRDtRQUNFLFNBQVMsRUFBRSxtQkFBbUI7UUFDOUIsVUFBVSxFQUFFLENBQUMsWUFBWSxFQUFFLG9CQUFvQixFQUFF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QkFDNUIsT0FBTyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDNUQsQ0FBQzs7a0dBSlEsYUFBYTtrQkFEekIsU0FBUztnSkFPUixRQUFRO3NCQUxQLEtBQUs7dUJBQUM7d0JBQ0wsU0FBUyxFQUFFLENBQUMsS0FBYyxFQUFFLEVBQUU7NEJBQzVCLE9BQU8sS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzVELENBQUM7cUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c01vbml0b3IsIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBpbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIG51bWJlckF0dHJpYnV0ZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRSaXBwbGUsIE1hdFJpcHBsZUxvYWRlcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cbi8qKiBTaGFyZWQgaG9zdCBjb25maWd1cmF0aW9uIGZvciBhbGwgYnV0dG9ucyAqL1xuZXhwb3J0IGNvbnN0IE1BVF9CVVRUT05fSE9TVCA9IHtcbiAgJ1thdHRyLmRpc2FibGVkXSc6ICdkaXNhYmxlZCB8fCBudWxsJyxcbiAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gIC8vIE1EQyBhdXRvbWF0aWNhbGx5IGFwcGxpZXMgdGhlIHByaW1hcnkgdGhlbWUgY29sb3IgdG8gdGhlIGJ1dHRvbiwgYnV0IHdlIHdhbnQgdG8gc3VwcG9ydFxuICAvLyBhbiB1bnRoZW1lZCB2ZXJzaW9uLiBJZiBjb2xvciBpcyB1bmRlZmluZWQsIGFwcGx5IGEgQ1NTIGNsYXNzIHRoYXQgbWFrZXMgaXQgZWFzeSB0b1xuICAvLyBzZWxlY3QgYW5kIHN0eWxlIHRoaXMgXCJ0aGVtZVwiLlxuICAnW2NsYXNzLm1hdC11bnRoZW1lZF0nOiAnIWNvbG9yJyxcbiAgLy8gQWRkIGEgY2xhc3MgdGhhdCBhcHBsaWVzIHRvIGFsbCBidXR0b25zLiBUaGlzIG1ha2VzIGl0IGVhc2llciB0byB0YXJnZXQgaWYgc29tZWJvZHlcbiAgLy8gd2FudHMgdG8gdGFyZ2V0IGFsbCBNYXRlcmlhbCBidXR0b25zLlxuICAnW2NsYXNzLm1hdC1tZGMtYnV0dG9uLWJhc2VdJzogJ3RydWUnLFxuICAnW2NsYXNzXSc6ICdjb2xvciA/IFwibWF0LVwiICsgY29sb3IgOiBcIlwiJyxcbn07XG5cbi8qKiBMaXN0IG9mIGNsYXNzZXMgdG8gYWRkIHRvIGJ1dHRvbnMgaW5zdGFuY2VzIGJhc2VkIG9uIGhvc3QgYXR0cmlidXRlIHNlbGVjdG9yLiAqL1xuY29uc3QgSE9TVF9TRUxFQ1RPUl9NRENfQ0xBU1NfUEFJUjoge2F0dHJpYnV0ZTogc3RyaW5nOyBtZGNDbGFzc2VzOiBzdHJpbmdbXX1bXSA9IFtcbiAge1xuICAgIGF0dHJpYnV0ZTogJ21hdC1idXR0b24nLFxuICAgIG1kY0NsYXNzZXM6IFsnbWRjLWJ1dHRvbicsICdtYXQtbWRjLWJ1dHRvbiddLFxuICB9LFxuICB7XG4gICAgYXR0cmlidXRlOiAnbWF0LWZsYXQtYnV0dG9uJyxcbiAgICBtZGNDbGFzc2VzOiBbJ21kYy1idXR0b24nLCAnbWRjLWJ1dHRvbi0tdW5lbGV2YXRlZCcsICdtYXQtbWRjLXVuZWxldmF0ZWQtYnV0dG9uJ10sXG4gIH0sXG4gIHtcbiAgICBhdHRyaWJ1dGU6ICdtYXQtcmFpc2VkLWJ1dHRvbicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtYnV0dG9uJywgJ21kYy1idXR0b24tLXJhaXNlZCcsICdtYXQtbWRjLXJhaXNlZC1idXR0b24nXSxcbiAgfSxcbiAge1xuICAgIGF0dHJpYnV0ZTogJ21hdC1zdHJva2VkLWJ1dHRvbicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtYnV0dG9uJywgJ21kYy1idXR0b24tLW91dGxpbmVkJywgJ21hdC1tZGMtb3V0bGluZWQtYnV0dG9uJ10sXG4gIH0sXG4gIHtcbiAgICBhdHRyaWJ1dGU6ICdtYXQtZmFiJyxcbiAgICBtZGNDbGFzc2VzOiBbJ21kYy1mYWInLCAnbWF0LW1kYy1mYWInXSxcbiAgfSxcbiAge1xuICAgIGF0dHJpYnV0ZTogJ21hdC1taW5pLWZhYicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtZmFiJywgJ21kYy1mYWItLW1pbmknLCAnbWF0LW1kYy1taW5pLWZhYiddLFxuICB9LFxuICB7XG4gICAgYXR0cmlidXRlOiAnbWF0LWljb24tYnV0dG9uJyxcbiAgICBtZGNDbGFzc2VzOiBbJ21kYy1pY29uLWJ1dHRvbicsICdtYXQtbWRjLWljb24tYnV0dG9uJ10sXG4gIH0sXG5dO1xuXG4vKiogQmFzZSBjbGFzcyBmb3IgYWxsIGJ1dHRvbnMuICAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uQmFzZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2ZvY3VzTW9uaXRvciA9IGluamVjdChGb2N1c01vbml0b3IpO1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHRoZSBsYXp5IGNyZWF0aW9uIG9mIHRoZSBNYXRCdXR0b24gcmlwcGxlLlxuICAgKiBVc2VkIHRvIGltcHJvdmUgaW5pdGlhbCBsb2FkIHRpbWUgb2YgbGFyZ2UgYXBwbGljYXRpb25zLlxuICAgKi9cbiAgX3JpcHBsZUxvYWRlcjogTWF0UmlwcGxlTG9hZGVyID0gaW5qZWN0KE1hdFJpcHBsZUxvYWRlcik7XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBidXR0b24gaXMgYSBGQUIuIFVzZWQgdG8gYXBwbHkgdGhlIGNvcnJlY3QgY2xhc3Mgb24gdGhlIHJpcHBsZS4gKi9cbiAgX2lzRmFiID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgTWF0UmlwcGxlIGluc3RhbmNlIG9mIHRoZSBidXR0b24uXG4gICAqIEBkZXByZWNhdGVkIENvbnNpZGVyZWQgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsLiBUbyBiZSByZW1vdmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgZ2V0IHJpcHBsZSgpOiBNYXRSaXBwbGUge1xuICAgIHJldHVybiB0aGlzLl9yaXBwbGVMb2FkZXI/LmdldFJpcHBsZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpITtcbiAgfVxuICBzZXQgcmlwcGxlKHY6IE1hdFJpcHBsZSkge1xuICAgIHRoaXMuX3JpcHBsZUxvYWRlcj8uYXR0YWNoUmlwcGxlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdik7XG4gIH1cblxuICAvKiogVGhlbWUgY29sb3IgcGFsZXR0ZSBvZiB0aGUgYnV0dG9uICovXG4gIEBJbnB1dCgpIGNvbG9yPzogc3RyaW5nIHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgcmlwcGxlIGVmZmVjdCBpcyBkaXNhYmxlZCBvciBub3QuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZ2V0IGRpc2FibGVSaXBwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVSaXBwbGU7XG4gIH1cbiAgc2V0IGRpc2FibGVSaXBwbGUodmFsdWU6IGFueSkge1xuICAgIHRoaXMuX2Rpc2FibGVSaXBwbGUgPSB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVSaXBwbGVEaXNhYmxlZCgpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZVJpcHBsZURpc2FibGVkKCk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgcHVibGljIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHRoaXMuX3JpcHBsZUxvYWRlcj8uY29uZmlndXJlUmlwcGxlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwge1xuICAgICAgY2xhc3NOYW1lOiAnbWF0LW1kYy1idXR0b24tcmlwcGxlJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTGlzdDtcblxuICAgIC8vIEZvciBlYWNoIG9mIHRoZSB2YXJpYW50IHNlbGVjdG9ycyB0aGF0IGlzIHByZXNlbnQgaW4gdGhlIGJ1dHRvbidzIGhvc3RcbiAgICAvLyBhdHRyaWJ1dGVzLCBhZGQgdGhlIGNvcnJlY3QgY29ycmVzcG9uZGluZyBNREMgY2xhc3Nlcy5cbiAgICBmb3IgKGNvbnN0IHthdHRyaWJ1dGUsIG1kY0NsYXNzZXN9IG9mIEhPU1RfU0VMRUNUT1JfTURDX0NMQVNTX1BBSVIpIHtcbiAgICAgIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGUpKSB7XG4gICAgICAgIGNsYXNzTGlzdC5hZGQoLi4ubWRjQ2xhc3Nlcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICAgIHRoaXMuX3JpcHBsZUxvYWRlcj8uZGVzdHJveVJpcHBsZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGJ1dHRvbi4gKi9cbiAgZm9jdXMoX29yaWdpbjogRm9jdXNPcmlnaW4gPSAncHJvZ3JhbScsIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICBpZiAoX29yaWdpbikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgX29yaWdpbiwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVSaXBwbGVEaXNhYmxlZCgpOiB2b2lkIHtcbiAgICB0aGlzLl9yaXBwbGVMb2FkZXI/LnNldERpc2FibGVkKFxuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgdGhpcy5kaXNhYmxlUmlwcGxlIHx8IHRoaXMuZGlzYWJsZWQsXG4gICAgKTtcbiAgfVxufVxuXG4vKiogU2hhcmVkIGhvc3QgY29uZmlndXJhdGlvbiBmb3IgYnV0dG9ucyB1c2luZyB0aGUgYDxhPmAgdGFnLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9BTkNIT1JfSE9TVCA9IHtcbiAgJ1thdHRyLmRpc2FibGVkXSc6ICdkaXNhYmxlZCB8fCBudWxsJyxcbiAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG5cbiAgLy8gTm90ZSB0aGF0IHdlIGlnbm9yZSB0aGUgdXNlci1zcGVjaWZpZWQgdGFiaW5kZXggd2hlbiBpdCdzIGRpc2FibGVkIGZvclxuICAvLyBjb25zaXN0ZW5jeSB3aXRoIHRoZSBgbWF0LWJ1dHRvbmAgYXBwbGllZCBvbiBuYXRpdmUgYnV0dG9ucyB3aGVyZSBldmVuXG4gIC8vIHRob3VnaCB0aGV5IGhhdmUgYW4gaW5kZXgsIHRoZXkncmUgbm90IHRhYmJhYmxlLlxuICAnW2F0dHIudGFiaW5kZXhdJzogJ2Rpc2FibGVkID8gLTEgOiB0YWJJbmRleCcsXG4gICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgLy8gTURDIGF1dG9tYXRpY2FsbHkgYXBwbGllcyB0aGUgcHJpbWFyeSB0aGVtZSBjb2xvciB0byB0aGUgYnV0dG9uLCBidXQgd2Ugd2FudCB0byBzdXBwb3J0XG4gIC8vIGFuIHVudGhlbWVkIHZlcnNpb24uIElmIGNvbG9yIGlzIHVuZGVmaW5lZCwgYXBwbHkgYSBDU1MgY2xhc3MgdGhhdCBtYWtlcyBpdCBlYXN5IHRvXG4gIC8vIHNlbGVjdCBhbmQgc3R5bGUgdGhpcyBcInRoZW1lXCIuXG4gICdbY2xhc3MubWF0LXVudGhlbWVkXSc6ICchY29sb3InLFxuICAvLyBBZGQgYSBjbGFzcyB0aGF0IGFwcGxpZXMgdG8gYWxsIGJ1dHRvbnMuIFRoaXMgbWFrZXMgaXQgZWFzaWVyIHRvIHRhcmdldCBpZiBzb21lYm9keVxuICAvLyB3YW50cyB0byB0YXJnZXQgYWxsIE1hdGVyaWFsIGJ1dHRvbnMuXG4gICdbY2xhc3MubWF0LW1kYy1idXR0b24tYmFzZV0nOiAndHJ1ZScsXG4gICdbY2xhc3NdJzogJ2NvbG9yID8gXCJtYXQtXCIgKyBjb2xvciA6IFwiXCInLFxufTtcblxuLyoqXG4gKiBBbmNob3IgYnV0dG9uIGJhc2UuXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIE1hdEFuY2hvckJhc2UgZXh0ZW5kcyBNYXRCdXR0b25CYXNlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoe1xuICAgIHRyYW5zZm9ybTogKHZhbHVlOiB1bmtub3duKSA9PiB7XG4gICAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG51bWJlckF0dHJpYnV0ZSh2YWx1ZSk7XG4gICAgfSxcbiAgfSlcbiAgdGFiSW5kZXg6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwbGF0Zm9ybTogUGxhdGZvcm0sIG5nWm9uZTogTmdab25lLCBhbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgcGxhdGZvcm0sIG5nWm9uZSwgYW5pbWF0aW9uTW9kZSk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5faGFsdERpc2FibGVkRXZlbnRzKTtcbiAgICB9KTtcbiAgfVxuXG4gIG92ZXJyaWRlIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5faGFsdERpc2FibGVkRXZlbnRzKTtcbiAgfVxuXG4gIF9oYWx0RGlzYWJsZWRFdmVudHMgPSAoZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XG4gICAgLy8gQSBkaXNhYmxlZCBidXR0b24gc2hvdWxkbid0IGFwcGx5IGFueSBhY3Rpb25zXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH07XG59XG4iXX0=