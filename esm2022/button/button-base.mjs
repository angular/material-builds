/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import { Directive, ElementRef, inject, NgZone, } from '@angular/core';
import { mixinColor, mixinDisabled, mixinDisableRipple, } from '@angular/material/core';
import { MAT_BUTTON_RIPPLE_UNINITIALIZED, MatButtonLazyLoader } from './button-lazy-loader';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/** Inputs common to all buttons. */
export const MAT_BUTTON_INPUTS = ['disabled', 'disableRipple', 'color'];
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
    [MAT_BUTTON_RIPPLE_UNINITIALIZED]: '',
};
/** List of classes to add to buttons instances based on host attribute selector. */
const HOST_SELECTOR_MDC_CLASS_PAIR = [
    {
        selector: 'mat-button',
        mdcClasses: ['mdc-button', 'mat-mdc-button'],
    },
    {
        selector: 'mat-flat-button',
        mdcClasses: ['mdc-button', 'mdc-button--unelevated', 'mat-mdc-unelevated-button'],
    },
    {
        selector: 'mat-raised-button',
        mdcClasses: ['mdc-button', 'mdc-button--raised', 'mat-mdc-raised-button'],
    },
    {
        selector: 'mat-stroked-button',
        mdcClasses: ['mdc-button', 'mdc-button--outlined', 'mat-mdc-outlined-button'],
    },
    {
        selector: 'mat-fab',
        mdcClasses: ['mdc-fab', 'mat-mdc-fab'],
    },
    {
        selector: 'mat-mini-fab',
        mdcClasses: ['mdc-fab', 'mdc-fab--mini', 'mat-mdc-mini-fab'],
    },
    {
        selector: 'mat-icon-button',
        mdcClasses: ['mdc-icon-button', 'mat-mdc-icon-button'],
    },
];
// Boilerplate for applying mixins to MatButton.
/** @docs-private */
export const _MatButtonMixin = mixinColor(mixinDisabled(mixinDisableRipple(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
})));
/** Base class for all buttons.  */
class MatButtonBase extends _MatButtonMixin {
    /**
     * Reference to the MatRipple instance of the button.
     * @deprecated Considered an implementation detail. To be removed.
     * @breaking-change 17.0.0
     */
    get ripple() {
        if (!this._ripple && this._rippleLoader) {
            this._ripple = this._rippleLoader._createMatRipple(this._elementRef.nativeElement);
        }
        return this._ripple;
    }
    set ripple(v) {
        this._ripple = v;
    }
    constructor(elementRef, _platform, _ngZone, _animationMode) {
        super(elementRef);
        this._platform = _platform;
        this._ngZone = _ngZone;
        this._animationMode = _animationMode;
        this._focusMonitor = inject(FocusMonitor);
        /**
         * Handles the lazy creation of the MatButton ripple.
         * Used to improve initial load time of large applications.
         */
        this._rippleLoader = inject(MatButtonLazyLoader);
        /** Whether this button is a FAB. Used to apply the correct class on the ripple. */
        this._isFab = false;
        const classList = elementRef.nativeElement.classList;
        // For each of the variant selectors that is present in the button's host
        // attributes, add the correct corresponding MDC classes.
        for (const pair of HOST_SELECTOR_MDC_CLASS_PAIR) {
            if (this._hasHostAttributes(pair.selector)) {
                pair.mdcClasses.forEach((className) => {
                    classList.add(className);
                });
            }
        }
    }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true);
    }
    ngOnChanges() {
        if (this._ripple) {
            this._ripple.disabled = this.disableRipple || this.disabled;
        }
    }
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
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
    /** Gets whether the button has one of the given attributes. */
    _hasHostAttributes(...attributes) {
        return attributes.some(attribute => this._elementRef.nativeElement.hasAttribute(attribute));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatButtonBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatButtonBase, usesInheritance: true, usesOnChanges: true, ngImport: i0 }); }
}
export { MatButtonBase };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatButtonBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Platform }, { type: i0.NgZone }, { type: undefined }]; } });
/** Shared inputs by buttons using the `<a>` tag */
export const MAT_ANCHOR_INPUTS = ['disabled', 'disableRipple', 'color', 'tabIndex'];
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
    [MAT_BUTTON_RIPPLE_UNINITIALIZED]: '',
};
/**
 * Anchor button base.
 */
class MatAnchorBase extends MatButtonBase {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatAnchorBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatAnchorBase, usesInheritance: true, ngImport: i0 }); }
}
export { MatAnchorBase };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatAnchorBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Platform }, { type: i0.NgZone }, { type: undefined }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYnV0dG9uL2J1dHRvbi1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQWMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLE1BQU0sR0FJUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBS0wsVUFBVSxFQUNWLGFBQWEsRUFDYixrQkFBa0IsR0FDbkIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMsK0JBQStCLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBRTFGLG9DQUFvQztBQUNwQyxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFVBQVUsRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFeEUsZ0RBQWdEO0FBQ2hELE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRztJQUM3QixpQkFBaUIsRUFBRSxrQkFBa0I7SUFDckMsaUNBQWlDLEVBQUUscUNBQXFDO0lBQ3hFLDBGQUEwRjtJQUMxRixzRkFBc0Y7SUFDdEYsaUNBQWlDO0lBQ2pDLHNCQUFzQixFQUFFLFFBQVE7SUFDaEMsc0ZBQXNGO0lBQ3RGLHdDQUF3QztJQUN4Qyw2QkFBNkIsRUFBRSxNQUFNO0lBQ3JDLENBQUMsK0JBQStCLENBQUMsRUFBRSxFQUFFO0NBQ3RDLENBQUM7QUFFRixvRkFBb0Y7QUFDcEYsTUFBTSw0QkFBNEIsR0FBK0M7SUFDL0U7UUFDRSxRQUFRLEVBQUUsWUFBWTtRQUN0QixVQUFVLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUM7S0FDN0M7SUFDRDtRQUNFLFFBQVEs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QUNqQyxzQkFBc0IsRUFBRSxRQUFRO0lBQ2hDLHNGQUFzRjtJQUN0Rix3Q0FBd0M7SUFDeEMsNkJBQTZCLEVBQUUsTUFBTTtJQUNyQyxDQUFDLCtCQUErQixDQUFDLEVBQUUsRUFBRTtDQUN0QyxDQUFDO0FBRUY7O0dBRUc7QUFDSCxNQUNhLGFBQWMsU0FBUSxhQUFhO0lBRzlDLFlBQVksVUFBc0IsRUFBRSxRQUFrQixFQUFFLE1BQWMsRUFBRSxhQUFzQjtRQUM1RixLQUFLLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFjckQsd0JBQW1CLEdBQUcsQ0FBQyxLQUFZLEVBQVEsRUFBRTtZQUMzQyxnREFBZ0Q7WUFDaEQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNqQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3ZCLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO2FBQ2xDO1FBQ0gsQ0FBQyxDQUFDO0lBbkJGLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3JGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVRLFdBQVc7UUFDbEIsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUN4RixDQUFDOzhHQWhCVSxhQUFhO2tHQUFiLGFBQWE7O1NBQWIsYUFBYTsyRkFBYixhQUFhO2tCQUR6QixTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNNb25pdG9yLCBGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgaW5qZWN0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIE1hdFJpcHBsZSxcbiAgbWl4aW5Db2xvcixcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TUFUX0JVVFRPTl9SSVBQTEVfVU5JTklUSUFMSVpFRCwgTWF0QnV0dG9uTGF6eUxvYWRlcn0gZnJvbSAnLi9idXR0b24tbGF6eS1sb2FkZXInO1xuXG4vKiogSW5wdXRzIGNvbW1vbiB0byBhbGwgYnV0dG9ucy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQlVUVE9OX0lOUFVUUyA9IFsnZGlzYWJsZWQnLCAnZGlzYWJsZVJpcHBsZScsICdjb2xvciddO1xuXG4vKiogU2hhcmVkIGhvc3QgY29uZmlndXJhdGlvbiBmb3IgYWxsIGJ1dHRvbnMgKi9cbmV4cG9ydCBjb25zdCBNQVRfQlVUVE9OX0hPU1QgPSB7XG4gICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQgfHwgbnVsbCcsXG4gICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25Nb2RlID09PSBcIk5vb3BBbmltYXRpb25zXCInLFxuICAvLyBNREMgYXV0b21hdGljYWxseSBhcHBsaWVzIHRoZSBwcmltYXJ5IHRoZW1lIGNvbG9yIHRvIHRoZSBidXR0b24sIGJ1dCB3ZSB3YW50IHRvIHN1cHBvcnRcbiAgLy8gYW4gdW50aGVtZWQgdmVyc2lvbi4gSWYgY29sb3IgaXMgdW5kZWZpbmVkLCBhcHBseSBhIENTUyBjbGFzcyB0aGF0IG1ha2VzIGl0IGVhc3kgdG9cbiAgLy8gc2VsZWN0IGFuZCBzdHlsZSB0aGlzIFwidGhlbWVcIi5cbiAgJ1tjbGFzcy5tYXQtdW50aGVtZWRdJzogJyFjb2xvcicsXG4gIC8vIEFkZCBhIGNsYXNzIHRoYXQgYXBwbGllcyB0byBhbGwgYnV0dG9ucy4gVGhpcyBtYWtlcyBpdCBlYXNpZXIgdG8gdGFyZ2V0IGlmIHNvbWVib2R5XG4gIC8vIHdhbnRzIHRvIHRhcmdldCBhbGwgTWF0ZXJpYWwgYnV0dG9ucy5cbiAgJ1tjbGFzcy5tYXQtbWRjLWJ1dHRvbi1iYXNlXSc6ICd0cnVlJyxcbiAgW01BVF9CVVRUT05fUklQUExFX1VOSU5JVElBTElaRURdOiAnJyxcbn07XG5cbi8qKiBMaXN0IG9mIGNsYXNzZXMgdG8gYWRkIHRvIGJ1dHRvbnMgaW5zdGFuY2VzIGJhc2VkIG9uIGhvc3QgYXR0cmlidXRlIHNlbGVjdG9yLiAqL1xuY29uc3QgSE9TVF9TRUxFQ1RPUl9NRENfQ0xBU1NfUEFJUjoge3NlbGVjdG9yOiBzdHJpbmc7IG1kY0NsYXNzZXM6IHN0cmluZ1tdfVtdID0gW1xuICB7XG4gICAgc2VsZWN0b3I6ICdtYXQtYnV0dG9uJyxcbiAgICBtZGNDbGFzc2VzOiBbJ21kYy1idXR0b24nLCAnbWF0LW1kYy1idXR0b24nXSxcbiAgfSxcbiAge1xuICAgIHNlbGVjdG9yOiAnbWF0LWZsYXQtYnV0dG9uJyxcbiAgICBtZGNDbGFzc2VzOiBbJ21kYy1idXR0b24nLCAnbWRjLWJ1dHRvbi0tdW5lbGV2YXRlZCcsICdtYXQtbWRjLXVuZWxldmF0ZWQtYnV0dG9uJ10sXG4gIH0sXG4gIHtcbiAgICBzZWxlY3RvcjogJ21hdC1yYWlzZWQtYnV0dG9uJyxcbiAgICBtZGNDbGFzc2VzOiBbJ21kYy1idXR0b24nLCAnbWRjLWJ1dHRvbi0tcmFpc2VkJywgJ21hdC1tZGMtcmFpc2VkLWJ1dHRvbiddLFxuICB9LFxuICB7XG4gICAgc2VsZWN0b3I6ICdtYXQtc3Ryb2tlZC1idXR0b24nLFxuICAgIG1kY0NsYXNzZXM6IFsnbWRjLWJ1dHRvbicsICdtZGMtYnV0dG9uLS1vdXRsaW5lZCcsICdtYXQtbWRjLW91dGxpbmVkLWJ1dHRvbiddLFxuICB9LFxuICB7XG4gICAgc2VsZWN0b3I6ICdtYXQtZmFiJyxcbiAgICBtZGNDbGFzc2VzOiBbJ21kYy1mYWInLCAnbWF0LW1kYy1mYWInXSxcbiAgfSxcbiAge1xuICAgIHNlbGVjdG9yOiAnbWF0LW1pbmktZmFiJyxcbiAgICBtZGNDbGFzc2VzOiBbJ21kYy1mYWInLCAnbWRjLWZhYi0tbWluaScsICdtYXQtbWRjLW1pbmktZmFiJ10sXG4gIH0sXG4gIHtcbiAgICBzZWxlY3RvcjogJ21hdC1pY29uLWJ1dHRvbicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtaWNvbi1idXR0b24nLCAnbWF0LW1kYy1pY29uLWJ1dHRvbiddLFxuICB9LFxuXTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRCdXR0b24uXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IF9NYXRCdXR0b25NaXhpbiA9IG1peGluQ29sb3IoXG4gIG1peGluRGlzYWJsZWQoXG4gICAgbWl4aW5EaXNhYmxlUmlwcGxlKFxuICAgICAgY2xhc3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG4gICAgICB9LFxuICAgICksXG4gICksXG4pO1xuXG4vKiogQmFzZSBjbGFzcyBmb3IgYWxsIGJ1dHRvbnMuICAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uQmFzZVxuICBleHRlbmRzIF9NYXRCdXR0b25NaXhpblxuICBpbXBsZW1lbnRzIENhbkRpc2FibGUsIENhbkNvbG9yLCBDYW5EaXNhYmxlUmlwcGxlLCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveVxue1xuICBwcml2YXRlIHJlYWRvbmx5IF9mb2N1c01vbml0b3IgPSBpbmplY3QoRm9jdXNNb25pdG9yKTtcblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUgbGF6eSBjcmVhdGlvbiBvZiB0aGUgTWF0QnV0dG9uIHJpcHBsZS5cbiAgICogVXNlZCB0byBpbXByb3ZlIGluaXRpYWwgbG9hZCB0aW1lIG9mIGxhcmdlIGFwcGxpY2F0aW9ucy5cbiAgICovXG4gIF9yaXBwbGVMb2FkZXI6IE1hdEJ1dHRvbkxhenlMb2FkZXIgPSBpbmplY3QoTWF0QnV0dG9uTGF6eUxvYWRlcik7XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBidXR0b24gaXMgYSBGQUIuIFVzZWQgdG8gYXBwbHkgdGhlIGNvcnJlY3QgY2xhc3Mgb24gdGhlIHJpcHBsZS4gKi9cbiAgX2lzRmFiID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgTWF0UmlwcGxlIGluc3RhbmNlIG9mIHRoZSBidXR0b24uXG4gICAqIEBkZXByZWNhdGVkIENvbnNpZGVyZWQgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsLiBUbyBiZSByZW1vdmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgZ2V0IHJpcHBsZSgpOiBNYXRSaXBwbGUge1xuICAgIGlmICghdGhpcy5fcmlwcGxlICYmIHRoaXMuX3JpcHBsZUxvYWRlcikge1xuICAgICAgdGhpcy5fcmlwcGxlID0gdGhpcy5fcmlwcGxlTG9hZGVyLl9jcmVhdGVNYXRSaXBwbGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3JpcHBsZSE7XG4gIH1cbiAgc2V0IHJpcHBsZSh2OiBNYXRSaXBwbGUpIHtcbiAgICB0aGlzLl9yaXBwbGUgPSB2O1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgUmVmZXJlbmNlIHRvIHRoZSBNYXRSaXBwbGUgaW5zdGFuY2Ugb2YgdGhlIGJ1dHRvbi4gKi9cbiAgcHJvdGVjdGVkIF9yaXBwbGU/OiBNYXRSaXBwbGU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBwdWJsaWMgX25nWm9uZTogTmdab25lLFxuICAgIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG5cbiAgICBjb25zdCBjbGFzc0xpc3QgPSAoZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3Q7XG5cbiAgICAvLyBGb3IgZWFjaCBvZiB0aGUgdmFyaWFudCBzZWxlY3RvcnMgdGhhdCBpcyBwcmVzZW50IGluIHRoZSBidXR0b24ncyBob3N0XG4gICAgLy8gYXR0cmlidXRlcywgYWRkIHRoZSBjb3JyZWN0IGNvcnJlc3BvbmRpbmcgTURDIGNsYXNzZXMuXG4gICAgZm9yIChjb25zdCBwYWlyIG9mIEhPU1RfU0VMRUNUT1JfTURDX0NMQVNTX1BBSVIpIHtcbiAgICAgIGlmICh0aGlzLl9oYXNIb3N0QXR0cmlidXRlcyhwYWlyLnNlbGVjdG9yKSkge1xuICAgICAgICBwYWlyLm1kY0NsYXNzZXMuZm9yRWFjaCgoY2xhc3NOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBjbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLCB0cnVlKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGlmICh0aGlzLl9yaXBwbGUpIHtcbiAgICAgIHRoaXMuX3JpcHBsZS5kaXNhYmxlZCA9IHRoaXMuZGlzYWJsZVJpcHBsZSB8fCB0aGlzLmRpc2FibGVkO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBidXR0b24uICovXG4gIGZvY3VzKF9vcmlnaW46IEZvY3VzT3JpZ2luID0gJ3Byb2dyYW0nLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKF9vcmlnaW4pIHtcbiAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIF9vcmlnaW4sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgYnV0dG9uIGhhcyBvbmUgb2YgdGhlIGdpdmVuIGF0dHJpYnV0ZXMuICovXG4gIHByaXZhdGUgX2hhc0hvc3RBdHRyaWJ1dGVzKC4uLmF0dHJpYnV0ZXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIGF0dHJpYnV0ZXMuc29tZShhdHRyaWJ1dGUgPT4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGUpKTtcbiAgfVxufVxuXG4vKiogU2hhcmVkIGlucHV0cyBieSBidXR0b25zIHVzaW5nIHRoZSBgPGE+YCB0YWcgKi9cbmV4cG9ydCBjb25zdCBNQVRfQU5DSE9SX0lOUFVUUyA9IFsnZGlzYWJsZWQnLCAnZGlzYWJsZVJpcHBsZScsICdjb2xvcicsICd0YWJJbmRleCddO1xuXG4vKiogU2hhcmVkIGhvc3QgY29uZmlndXJhdGlvbiBmb3IgYnV0dG9ucyB1c2luZyB0aGUgYDxhPmAgdGFnLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9BTkNIT1JfSE9TVCA9IHtcbiAgJ1thdHRyLmRpc2FibGVkXSc6ICdkaXNhYmxlZCB8fCBudWxsJyxcbiAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG5cbiAgLy8gTm90ZSB0aGF0IHdlIGlnbm9yZSB0aGUgdXNlci1zcGVjaWZpZWQgdGFiaW5kZXggd2hlbiBpdCdzIGRpc2FibGVkIGZvclxuICAvLyBjb25zaXN0ZW5jeSB3aXRoIHRoZSBgbWF0LWJ1dHRvbmAgYXBwbGllZCBvbiBuYXRpdmUgYnV0dG9ucyB3aGVyZSBldmVuXG4gIC8vIHRob3VnaCB0aGV5IGhhdmUgYW4gaW5kZXgsIHRoZXkncmUgbm90IHRhYmJhYmxlLlxuICAnW2F0dHIudGFiaW5kZXhdJzogJ2Rpc2FibGVkID8gLTEgOiB0YWJJbmRleCcsXG4gICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgLy8gTURDIGF1dG9tYXRpY2FsbHkgYXBwbGllcyB0aGUgcHJpbWFyeSB0aGVtZSBjb2xvciB0byB0aGUgYnV0dG9uLCBidXQgd2Ugd2FudCB0byBzdXBwb3J0XG4gIC8vIGFuIHVudGhlbWVkIHZlcnNpb24uIElmIGNvbG9yIGlzIHVuZGVmaW5lZCwgYXBwbHkgYSBDU1MgY2xhc3MgdGhhdCBtYWtlcyBpdCBlYXN5IHRvXG4gIC8vIHNlbGVjdCBhbmQgc3R5bGUgdGhpcyBcInRoZW1lXCIuXG4gICdbY2xhc3MubWF0LXVudGhlbWVkXSc6ICchY29sb3InLFxuICAvLyBBZGQgYSBjbGFzcyB0aGF0IGFwcGxpZXMgdG8gYWxsIGJ1dHRvbnMuIFRoaXMgbWFrZXMgaXQgZWFzaWVyIHRvIHRhcmdldCBpZiBzb21lYm9keVxuICAvLyB3YW50cyB0byB0YXJnZXQgYWxsIE1hdGVyaWFsIGJ1dHRvbnMuXG4gICdbY2xhc3MubWF0LW1kYy1idXR0b24tYmFzZV0nOiAndHJ1ZScsXG4gIFtNQVRfQlVUVE9OX1JJUFBMRV9VTklOSVRJQUxJWkVEXTogJycsXG59O1xuXG4vKipcbiAqIEFuY2hvciBidXR0b24gYmFzZS5cbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgTWF0QW5jaG9yQmFzZSBleHRlbmRzIE1hdEJ1dHRvbkJhc2UgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHRhYkluZGV4OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcGxhdGZvcm06IFBsYXRmb3JtLCBuZ1pvbmU6IE5nWm9uZSwgYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIHBsYXRmb3JtLCBuZ1pvbmUsIGFuaW1hdGlvbk1vZGUpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2hhbHREaXNhYmxlZEV2ZW50cyk7XG4gICAgfSk7XG4gIH1cblxuICBvdmVycmlkZSBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2hhbHREaXNhYmxlZEV2ZW50cyk7XG4gIH1cblxuICBfaGFsdERpc2FibGVkRXZlbnRzID0gKGV2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xuICAgIC8vIEEgZGlzYWJsZWQgYnV0dG9uIHNob3VsZG4ndCBhcHBseSBhbnkgYWN0aW9uc1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9O1xufVxuIl19