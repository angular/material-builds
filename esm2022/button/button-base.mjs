/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { Directive, ElementRef, inject, NgZone, } from '@angular/core';
import { mixinColor, mixinDisabled, mixinDisableRipple, MatRippleLoader, } from '@angular/material/core';
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
export class MatButtonBase extends _MatButtonMixin {
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
    // We override `disableRipple` and `disabled` so we can hook into
    // their setters and update the ripple disabled state accordingly.
    /** Whether the ripple effect is disabled or not. */
    get disableRipple() {
        return this._disableRipple;
    }
    set disableRipple(value) {
        this._disableRipple = coerceBooleanProperty(value);
        this._updateRippleDisabled();
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        this._updateRippleDisabled();
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
        this._rippleLoader = inject(MatRippleLoader);
        /** Whether this button is a FAB. Used to apply the correct class on the ripple. */
        this._isFab = false;
        this._disableRipple = false;
        this._disabled = false;
        this._rippleLoader?.configureRipple(this._elementRef.nativeElement, {
            className: 'mat-mdc-button-ripple',
        });
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
    _updateRippleDisabled() {
        this._rippleLoader?.setDisabled(this._elementRef.nativeElement, this.disableRipple || this.disabled);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatButtonBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.1", type: MatButtonBase, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatButtonBase, decorators: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatAnchorBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.1", type: MatAnchorBase, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatAnchorBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Platform }, { type: i0.NgZone }, { type: undefined }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYnV0dG9uL2J1dHRvbi1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQWMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLE1BQU0sR0FHUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBS0wsVUFBVSxFQUNWLGFBQWEsRUFDYixrQkFBa0IsRUFDbEIsZUFBZSxHQUNoQixNQUFNLHdCQUF3QixDQUFDOzs7QUFFaEMsb0NBQW9DO0FBQ3BDLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLENBQUMsVUFBVSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUV4RSxnREFBZ0Q7QUFDaEQsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHO0lBQzdCLGlCQUFpQixFQUFFLGtCQUFrQjtJQUNyQyxpQ0FBaUMsRUFBRSxxQ0FBcUM7SUFDeEUsMEZBQTBGO0lBQzFGLHNGQUFzRjtJQUN0RixpQ0FBaUM7SUFDakMsc0JBQXNCLEVBQUUsUUFBUTtJQUNoQyxzRkFBc0Y7SUFDdEYsd0NBQXdDO0lBQ3hDLDZCQUE2QixFQUFFLE1BQU07Q0FDdEMsQ0FBQztBQUVGLG9GQUFvRjtBQUNwRixNQUFNLDRCQUE0QixHQUErQztJQUMvRTtRQUNFLFFBQVEsRUFBRSxZQUFZO1FBQ3RCLFVBQVUsRUFBRSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQztLQUM3QztJQUNEO1FBQ0UsUUFBUSxFQUFFLGlCQUFpQjtRQUMzQixVQUFVLEVBQUUsQ0FBQyxZ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LGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUNsQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDckYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRVEsV0FBVztRQUNsQixLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7OEdBaEJVLGFBQWE7a0dBQWIsYUFBYTs7MkZBQWIsYUFBYTtrQkFEekIsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgaW5qZWN0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkNvbG9yLFxuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBNYXRSaXBwbGUsXG4gIG1peGluQ29sb3IsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgTWF0UmlwcGxlTG9hZGVyLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcblxuLyoqIElucHV0cyBjb21tb24gdG8gYWxsIGJ1dHRvbnMuICovXG5leHBvcnQgY29uc3QgTUFUX0JVVFRPTl9JTlBVVFMgPSBbJ2Rpc2FibGVkJywgJ2Rpc2FibGVSaXBwbGUnLCAnY29sb3InXTtcblxuLyoqIFNoYXJlZCBob3N0IGNvbmZpZ3VyYXRpb24gZm9yIGFsbCBidXR0b25zICovXG5leHBvcnQgY29uc3QgTUFUX0JVVFRPTl9IT1NUID0ge1xuICAnW2F0dHIuZGlzYWJsZWRdJzogJ2Rpc2FibGVkIHx8IG51bGwnLFxuICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uTW9kZSA9PT0gXCJOb29wQW5pbWF0aW9uc1wiJyxcbiAgLy8gTURDIGF1dG9tYXRpY2FsbHkgYXBwbGllcyB0aGUgcHJpbWFyeSB0aGVtZSBjb2xvciB0byB0aGUgYnV0dG9uLCBidXQgd2Ugd2FudCB0byBzdXBwb3J0XG4gIC8vIGFuIHVudGhlbWVkIHZlcnNpb24uIElmIGNvbG9yIGlzIHVuZGVmaW5lZCwgYXBwbHkgYSBDU1MgY2xhc3MgdGhhdCBtYWtlcyBpdCBlYXN5IHRvXG4gIC8vIHNlbGVjdCBhbmQgc3R5bGUgdGhpcyBcInRoZW1lXCIuXG4gICdbY2xhc3MubWF0LXVudGhlbWVkXSc6ICchY29sb3InLFxuICAvLyBBZGQgYSBjbGFzcyB0aGF0IGFwcGxpZXMgdG8gYWxsIGJ1dHRvbnMuIFRoaXMgbWFrZXMgaXQgZWFzaWVyIHRvIHRhcmdldCBpZiBzb21lYm9keVxuICAvLyB3YW50cyB0byB0YXJnZXQgYWxsIE1hdGVyaWFsIGJ1dHRvbnMuXG4gICdbY2xhc3MubWF0LW1kYy1idXR0b24tYmFzZV0nOiAndHJ1ZScsXG59O1xuXG4vKiogTGlzdCBvZiBjbGFzc2VzIHRvIGFkZCB0byBidXR0b25zIGluc3RhbmNlcyBiYXNlZCBvbiBob3N0IGF0dHJpYnV0ZSBzZWxlY3Rvci4gKi9cbmNvbnN0IEhPU1RfU0VMRUNUT1JfTURDX0NMQVNTX1BBSVI6IHtzZWxlY3Rvcjogc3RyaW5nOyBtZGNDbGFzc2VzOiBzdHJpbmdbXX1bXSA9IFtcbiAge1xuICAgIHNlbGVjdG9yOiAnbWF0LWJ1dHRvbicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtYnV0dG9uJywgJ21hdC1tZGMtYnV0dG9uJ10sXG4gIH0sXG4gIHtcbiAgICBzZWxlY3RvcjogJ21hdC1mbGF0LWJ1dHRvbicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtYnV0dG9uJywgJ21kYy1idXR0b24tLXVuZWxldmF0ZWQnLCAnbWF0LW1kYy11bmVsZXZhdGVkLWJ1dHRvbiddLFxuICB9LFxuICB7XG4gICAgc2VsZWN0b3I6ICdtYXQtcmFpc2VkLWJ1dHRvbicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtYnV0dG9uJywgJ21kYy1idXR0b24tLXJhaXNlZCcsICdtYXQtbWRjLXJhaXNlZC1idXR0b24nXSxcbiAgfSxcbiAge1xuICAgIHNlbGVjdG9yOiAnbWF0LXN0cm9rZWQtYnV0dG9uJyxcbiAgICBtZGNDbGFzc2VzOiBbJ21kYy1idXR0b24nLCAnbWRjLWJ1dHRvbi0tb3V0bGluZWQnLCAnbWF0LW1kYy1vdXRsaW5lZC1idXR0b24nXSxcbiAgfSxcbiAge1xuICAgIHNlbGVjdG9yOiAnbWF0LWZhYicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtZmFiJywgJ21hdC1tZGMtZmFiJ10sXG4gIH0sXG4gIHtcbiAgICBzZWxlY3RvcjogJ21hdC1taW5pLWZhYicsXG4gICAgbWRjQ2xhc3NlczogWydtZGMtZmFiJywgJ21kYy1mYWItLW1pbmknLCAnbWF0LW1kYy1taW5pLWZhYiddLFxuICB9LFxuICB7XG4gICAgc2VsZWN0b3I6ICdtYXQtaWNvbi1idXR0b24nLFxuICAgIG1kY0NsYXNzZXM6IFsnbWRjLWljb24tYnV0dG9uJywgJ21hdC1tZGMtaWNvbi1idXR0b24nXSxcbiAgfSxcbl07XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0QnV0dG9uLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBfTWF0QnV0dG9uTWl4aW4gPSBtaXhpbkNvbG9yKFxuICBtaXhpbkRpc2FibGVkKFxuICAgIG1peGluRGlzYWJsZVJpcHBsZShcbiAgICAgIGNsYXNzIHtcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxuICAgICAgfSxcbiAgICApLFxuICApLFxuKTtcblxuLyoqIEJhc2UgY2xhc3MgZm9yIGFsbCBidXR0b25zLiAgKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIE1hdEJ1dHRvbkJhc2VcbiAgZXh0ZW5kcyBfTWF0QnV0dG9uTWl4aW5cbiAgaW1wbGVtZW50cyBDYW5EaXNhYmxlLCBDYW5Db2xvciwgQ2FuRGlzYWJsZVJpcHBsZSwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95XG57XG4gIHByaXZhdGUgcmVhZG9ubHkgX2ZvY3VzTW9uaXRvciA9IGluamVjdChGb2N1c01vbml0b3IpO1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHRoZSBsYXp5IGNyZWF0aW9uIG9mIHRoZSBNYXRCdXR0b24gcmlwcGxlLlxuICAgKiBVc2VkIHRvIGltcHJvdmUgaW5pdGlhbCBsb2FkIHRpbWUgb2YgbGFyZ2UgYXBwbGljYXRpb25zLlxuICAgKi9cbiAgX3JpcHBsZUxvYWRlcjogTWF0UmlwcGxlTG9hZGVyID0gaW5qZWN0KE1hdFJpcHBsZUxvYWRlcik7XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBidXR0b24gaXMgYSBGQUIuIFVzZWQgdG8gYXBwbHkgdGhlIGNvcnJlY3QgY2xhc3Mgb24gdGhlIHJpcHBsZS4gKi9cbiAgX2lzRmFiID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgTWF0UmlwcGxlIGluc3RhbmNlIG9mIHRoZSBidXR0b24uXG4gICAqIEBkZXByZWNhdGVkIENvbnNpZGVyZWQgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsLiBUbyBiZSByZW1vdmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgZ2V0IHJpcHBsZSgpOiBNYXRSaXBwbGUge1xuICAgIHJldHVybiB0aGlzLl9yaXBwbGVMb2FkZXI/LmdldFJpcHBsZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpITtcbiAgfVxuICBzZXQgcmlwcGxlKHY6IE1hdFJpcHBsZSkge1xuICAgIHRoaXMuX3JpcHBsZUxvYWRlcj8uYXR0YWNoUmlwcGxlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdik7XG4gIH1cblxuICAvLyBXZSBvdmVycmlkZSBgZGlzYWJsZVJpcHBsZWAgYW5kIGBkaXNhYmxlZGAgc28gd2UgY2FuIGhvb2sgaW50b1xuICAvLyB0aGVpciBzZXR0ZXJzIGFuZCB1cGRhdGUgdGhlIHJpcHBsZSBkaXNhYmxlZCBzdGF0ZSBhY2NvcmRpbmdseS5cblxuICAvKiogV2hldGhlciB0aGUgcmlwcGxlIGVmZmVjdCBpcyBkaXNhYmxlZCBvciBub3QuICovXG4gIG92ZXJyaWRlIGdldCBkaXNhYmxlUmlwcGxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlUmlwcGxlO1xuICB9XG4gIG92ZXJyaWRlIHNldCBkaXNhYmxlUmlwcGxlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl9kaXNhYmxlUmlwcGxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLl91cGRhdGVSaXBwbGVEaXNhYmxlZCgpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBvdmVycmlkZSBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIG92ZXJyaWRlIHNldCBkaXNhYmxlZCh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX3VwZGF0ZVJpcHBsZURpc2FibGVkKCk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHB1YmxpYyBfbmdab25lOiBOZ1pvbmUsXG4gICAgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcblxuICAgIHRoaXMuX3JpcHBsZUxvYWRlcj8uY29uZmlndXJlUmlwcGxlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwge1xuICAgICAgY2xhc3NOYW1lOiAnbWF0LW1kYy1idXR0b24tcmlwcGxlJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNsYXNzTGlzdCA9IChlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTGlzdDtcblxuICAgIC8vIEZvciBlYWNoIG9mIHRoZSB2YXJpYW50IHNlbGVjdG9ycyB0aGF0IGlzIHByZXNlbnQgaW4gdGhlIGJ1dHRvbidzIGhvc3RcbiAgICAvLyBhdHRyaWJ1dGVzLCBhZGQgdGhlIGNvcnJlY3QgY29ycmVzcG9uZGluZyBNREMgY2xhc3Nlcy5cbiAgICBmb3IgKGNvbnN0IHBhaXIgb2YgSE9TVF9TRUxFQ1RPUl9NRENfQ0xBU1NfUEFJUikge1xuICAgICAgaWYgKHRoaXMuX2hhc0hvc3RBdHRyaWJ1dGVzKHBhaXIuc2VsZWN0b3IpKSB7XG4gICAgICAgIHBhaXIubWRjQ2xhc3Nlcy5mb3JFYWNoKChjbGFzc05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGJ1dHRvbi4gKi9cbiAgZm9jdXMoX29yaWdpbjogRm9jdXNPcmlnaW4gPSAncHJvZ3JhbScsIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICBpZiAoX29yaWdpbikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgX29yaWdpbiwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBidXR0b24gaGFzIG9uZSBvZiB0aGUgZ2l2ZW4gYXR0cmlidXRlcy4gKi9cbiAgcHJpdmF0ZSBfaGFzSG9zdEF0dHJpYnV0ZXMoLi4uYXR0cmlidXRlczogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gYXR0cmlidXRlcy5zb21lKGF0dHJpYnV0ZSA9PiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuaGFzQXR0cmlidXRlKGF0dHJpYnV0ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlUmlwcGxlRGlzYWJsZWQoKTogdm9pZCB7XG4gICAgdGhpcy5fcmlwcGxlTG9hZGVyPy5zZXREaXNhYmxlZChcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgIHRoaXMuZGlzYWJsZVJpcHBsZSB8fCB0aGlzLmRpc2FibGVkLFxuICAgICk7XG4gIH1cbn1cblxuLyoqIFNoYXJlZCBpbnB1dHMgYnkgYnV0dG9ucyB1c2luZyB0aGUgYDxhPmAgdGFnICovXG5leHBvcnQgY29uc3QgTUFUX0FOQ0hPUl9JTlBVVFMgPSBbJ2Rpc2FibGVkJywgJ2Rpc2FibGVSaXBwbGUnLCAnY29sb3InLCAndGFiSW5kZXgnXTtcblxuLyoqIFNoYXJlZCBob3N0IGNvbmZpZ3VyYXRpb24gZm9yIGJ1dHRvbnMgdXNpbmcgdGhlIGA8YT5gIHRhZy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQU5DSE9SX0hPU1QgPSB7XG4gICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQgfHwgbnVsbCcsXG4gICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25Nb2RlID09PSBcIk5vb3BBbmltYXRpb25zXCInLFxuXG4gIC8vIE5vdGUgdGhhdCB3ZSBpZ25vcmUgdGhlIHVzZXItc3BlY2lmaWVkIHRhYmluZGV4IHdoZW4gaXQncyBkaXNhYmxlZCBmb3JcbiAgLy8gY29uc2lzdGVuY3kgd2l0aCB0aGUgYG1hdC1idXR0b25gIGFwcGxpZWQgb24gbmF0aXZlIGJ1dHRvbnMgd2hlcmUgZXZlblxuICAvLyB0aG91Z2ggdGhleSBoYXZlIGFuIGluZGV4LCB0aGV5J3JlIG5vdCB0YWJiYWJsZS5cbiAgJ1thdHRyLnRhYmluZGV4XSc6ICdkaXNhYmxlZCA/IC0xIDogdGFiSW5kZXgnLFxuICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gIC8vIE1EQyBhdXRvbWF0aWNhbGx5IGFwcGxpZXMgdGhlIHByaW1hcnkgdGhlbWUgY29sb3IgdG8gdGhlIGJ1dHRvbiwgYnV0IHdlIHdhbnQgdG8gc3VwcG9ydFxuICAvLyBhbiB1bnRoZW1lZCB2ZXJzaW9uLiBJZiBjb2xvciBpcyB1bmRlZmluZWQsIGFwcGx5IGEgQ1NTIGNsYXNzIHRoYXQgbWFrZXMgaXQgZWFzeSB0b1xuICAvLyBzZWxlY3QgYW5kIHN0eWxlIHRoaXMgXCJ0aGVtZVwiLlxuICAnW2NsYXNzLm1hdC11bnRoZW1lZF0nOiAnIWNvbG9yJyxcbiAgLy8gQWRkIGEgY2xhc3MgdGhhdCBhcHBsaWVzIHRvIGFsbCBidXR0b25zLiBUaGlzIG1ha2VzIGl0IGVhc2llciB0byB0YXJnZXQgaWYgc29tZWJvZHlcbiAgLy8gd2FudHMgdG8gdGFyZ2V0IGFsbCBNYXRlcmlhbCBidXR0b25zLlxuICAnW2NsYXNzLm1hdC1tZGMtYnV0dG9uLWJhc2VdJzogJ3RydWUnLFxufTtcblxuLyoqXG4gKiBBbmNob3IgYnV0dG9uIGJhc2UuXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIE1hdEFuY2hvckJhc2UgZXh0ZW5kcyBNYXRCdXR0b25CYXNlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICB0YWJJbmRleDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHBsYXRmb3JtOiBQbGF0Zm9ybSwgbmdab25lOiBOZ1pvbmUsIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBwbGF0Zm9ybSwgbmdab25lLCBhbmltYXRpb25Nb2RlKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9oYWx0RGlzYWJsZWRFdmVudHMpO1xuICAgIH0pO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9oYWx0RGlzYWJsZWRFdmVudHMpO1xuICB9XG5cbiAgX2hhbHREaXNhYmxlZEV2ZW50cyA9IChldmVudDogRXZlbnQpOiB2b2lkID0+IHtcbiAgICAvLyBBIGRpc2FibGVkIGJ1dHRvbiBzaG91bGRuJ3QgYXBwbHkgYW55IGFjdGlvbnNcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==