/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { ANIMATION_MODULE_TYPE, ElementRef, Injectable, NgZone, inject, } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, MatRipple } from '../ripple';
import { Platform } from '@angular/cdk/platform';
import * as i0 from "@angular/core";
/** The options for the MatRippleLoader's event listeners. */
const eventListenerOptions = { capture: true };
/** The events that should trigger the initialization of the ripple. */
const rippleInteractionEvents = ['focus', 'click', 'mouseenter', 'touchstart'];
/** The attribute attached to a component whose ripple has not yet been initialized. */
const matRippleUninitialized = 'mat-ripple-loader-uninitialized';
/** Additional classes that should be added to the ripple when it is rendered. */
const matRippleClassName = 'mat-ripple-loader-class-name';
/** Whether the ripple should be centered. */
const matRippleCentered = 'mat-ripple-loader-centered';
/** Whether the ripple should be disabled. */
const matRippleDisabled = 'mat-ripple-loader-disabled';
/**
 * Handles attaching ripples on demand.
 *
 * This service allows us to avoid eagerly creating & attaching MatRipples.
 * It works by creating & attaching a ripple only when a component is first interacted with.
 */
export class MatRippleLoader {
    constructor() {
        this._document = inject(DOCUMENT, { optional: true });
        this._animationMode = inject(ANIMATION_MODULE_TYPE, { optional: true });
        this._globalRippleOptions = inject(MAT_RIPPLE_GLOBAL_OPTIONS, { optional: true });
        this._platform = inject(Platform);
        this._ngZone = inject(NgZone);
        /** Handles creating and attaching component internals when a component it is initially interacted with. */
        this._onInteraction = (event) => {
            if (!(event.target instanceof HTMLElement)) {
                return;
            }
            const eventTarget = event.target;
            // TODO(wagnermaciel): Consider batching these events to improve runtime performance.
            const element = eventTarget.closest(`[${matRippleUninitialized}]`);
            if (element) {
                this.createRipple(element);
            }
        };
        this._ngZone.runOutsideAngular(() => {
            for (const event of rippleInteractionEvents) {
                this._document?.addEventListener(event, this._onInteraction, eventListenerOptions);
            }
        });
    }
    ngOnDestroy() {
        for (const event of rippleInteractionEvents) {
            this._document?.removeEventListener(event, this._onInteraction, eventListenerOptions);
        }
    }
    /**
     * Configures the ripple that will be rendered by the ripple loader.
     *
     * Stores the given information about how the ripple should be configured on the host
     * element so that it can later be retrived & used when the ripple is actually created.
     */
    configureRipple(host, config) {
        // Indicates that the ripple has not yet been rendered for this component.
        host.setAttribute(matRippleUninitialized, '');
        // Store the additional class name(s) that should be added to the ripple element.
        if (config.className || !host.hasAttribute(matRippleClassName)) {
            host.setAttribute(matRippleClassName, config.className || '');
        }
        // Store whether the ripple should be centered.
        if (config.centered) {
            host.setAttribute(matRippleCentered, '');
        }
        if (config.disabled) {
            host.setAttribute(matRippleDisabled, '');
        }
    }
    /** Returns the ripple instance for the given host element. */
    getRipple(host) {
        if (host.matRipple) {
            return host.matRipple;
        }
        return this.createRipple(host);
    }
    /** Sets the disabled state on the ripple instance corresponding to the given host element. */
    setDisabled(host, disabled) {
        const ripple = host.matRipple;
        // If the ripple has already been instantiated, just disable it.
        if (ripple) {
            ripple.disabled = disabled;
            return;
        }
        // Otherwise, set an attribute so we know what the
        // disabled state should be when the ripple is initialized.
        if (disabled) {
            host.setAttribute(matRippleDisabled, '');
        }
        else {
            host.removeAttribute(matRippleDisabled);
        }
    }
    /** Creates a MatRipple and appends it to the given element. */
    createRipple(host) {
        if (!this._document) {
            return;
        }
        // Create the ripple element.
        host.querySelector('.mat-ripple')?.remove();
        const rippleEl = this._document.createElement('span');
        rippleEl.classList.add('mat-ripple', host.getAttribute(matRippleClassName));
        host.append(rippleEl);
        // Create the MatRipple.
        const ripple = new MatRipple(new ElementRef(rippleEl), this._ngZone, this._platform, this._globalRippleOptions ? this._globalRippleOptions : undefined, this._animationMode ? this._animationMode : undefined);
        ripple._isInitialized = true;
        ripple.trigger = host;
        ripple.centered = host.hasAttribute(matRippleCentered);
        ripple.disabled = host.hasAttribute(matRippleDisabled);
        this.attachRipple(host, ripple);
        return ripple;
    }
    attachRipple(host, ripple) {
        host.removeAttribute(matRippleUninitialized);
        host.matRipple = ripple;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatRippleLoader, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatRippleLoader, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatRippleLoader, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLWxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3ByaXZhdGUvcmlwcGxlLWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLHFCQUFxQixFQUNyQixVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFFTixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLHlCQUF5QixFQUFFLFNBQVMsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUMvRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7O0FBRS9DLDZEQUE2RDtBQUM3RCxNQUFNLG9CQUFvQixHQUFHLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO0FBRTdDLHVFQUF1RTtBQUN2RSxNQUFNLHVCQUF1QixHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFL0UsdUZBQXVGO0FBQ3ZGLE1BQU0sc0JBQXNCLEdBQUcsaUNBQWlDLENBQUM7QUFFakUsaUZBQWlGO0FBQ2pGLE1BQU0sa0JBQWtCLEdBQUcsOEJBQThCLENBQUM7QUFFMUQsNkNBQTZDO0FBQzdDLE1BQU0saUJBQWlCLEdBQUcsNEJBQTRCLENBQUM7QUFFdkQsNkNBQTZDO0FBQzdDLE1BQU0saUJBQWlCLEdBQUcsNEJBQTRCLENBQUM7QUFFdkQ7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sZUFBZTtJQU8xQjtRQU5RLGNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDL0MsbUJBQWMsR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUsRUFBQyxRQUFRLEVB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Q0FBQyxDQUFDO1FBQ2hDLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxZQUFZLENBQUMsSUFBYSxFQUFFLE1BQWlCO1FBQzNDLElBQUksQ0FBQyxlQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUM1QyxJQUFZLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztJQUNuQyxDQUFDOzhHQTlIVSxlQUFlO2tIQUFmLGVBQWUsY0FESCxNQUFNOzsyRkFDbEIsZUFBZTtrQkFEM0IsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFOSU1BVElPTl9NT0RVTEVfVFlQRSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0YWJsZSxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsIE1hdFJpcHBsZX0gZnJvbSAnLi4vcmlwcGxlJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5cbi8qKiBUaGUgb3B0aW9ucyBmb3IgdGhlIE1hdFJpcHBsZUxvYWRlcidzIGV2ZW50IGxpc3RlbmVycy4gKi9cbmNvbnN0IGV2ZW50TGlzdGVuZXJPcHRpb25zID0ge2NhcHR1cmU6IHRydWV9O1xuXG4vKiogVGhlIGV2ZW50cyB0aGF0IHNob3VsZCB0cmlnZ2VyIHRoZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgcmlwcGxlLiAqL1xuY29uc3QgcmlwcGxlSW50ZXJhY3Rpb25FdmVudHMgPSBbJ2ZvY3VzJywgJ2NsaWNrJywgJ21vdXNlZW50ZXInLCAndG91Y2hzdGFydCddO1xuXG4vKiogVGhlIGF0dHJpYnV0ZSBhdHRhY2hlZCB0byBhIGNvbXBvbmVudCB3aG9zZSByaXBwbGUgaGFzIG5vdCB5ZXQgYmVlbiBpbml0aWFsaXplZC4gKi9cbmNvbnN0IG1hdFJpcHBsZVVuaW5pdGlhbGl6ZWQgPSAnbWF0LXJpcHBsZS1sb2FkZXItdW5pbml0aWFsaXplZCc7XG5cbi8qKiBBZGRpdGlvbmFsIGNsYXNzZXMgdGhhdCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIHJpcHBsZSB3aGVuIGl0IGlzIHJlbmRlcmVkLiAqL1xuY29uc3QgbWF0UmlwcGxlQ2xhc3NOYW1lID0gJ21hdC1yaXBwbGUtbG9hZGVyLWNsYXNzLW5hbWUnO1xuXG4vKiogV2hldGhlciB0aGUgcmlwcGxlIHNob3VsZCBiZSBjZW50ZXJlZC4gKi9cbmNvbnN0IG1hdFJpcHBsZUNlbnRlcmVkID0gJ21hdC1yaXBwbGUtbG9hZGVyLWNlbnRlcmVkJztcblxuLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBzaG91bGQgYmUgZGlzYWJsZWQuICovXG5jb25zdCBtYXRSaXBwbGVEaXNhYmxlZCA9ICdtYXQtcmlwcGxlLWxvYWRlci1kaXNhYmxlZCc7XG5cbi8qKlxuICogSGFuZGxlcyBhdHRhY2hpbmcgcmlwcGxlcyBvbiBkZW1hbmQuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB1cyB0byBhdm9pZCBlYWdlcmx5IGNyZWF0aW5nICYgYXR0YWNoaW5nIE1hdFJpcHBsZXMuXG4gKiBJdCB3b3JrcyBieSBjcmVhdGluZyAmIGF0dGFjaGluZyBhIHJpcHBsZSBvbmx5IHdoZW4gYSBjb21wb25lbnQgaXMgZmlyc3QgaW50ZXJhY3RlZCB3aXRoLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNYXRSaXBwbGVMb2FkZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9kb2N1bWVudCA9IGluamVjdChET0NVTUVOVCwge29wdGlvbmFsOiB0cnVlfSk7XG4gIHByaXZhdGUgX2FuaW1hdGlvbk1vZGUgPSBpbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFLCB7b3B0aW9uYWw6IHRydWV9KTtcbiAgcHJpdmF0ZSBfZ2xvYmFsUmlwcGxlT3B0aW9ucyA9IGluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLCB7b3B0aW9uYWw6IHRydWV9KTtcbiAgcHJpdmF0ZSBfcGxhdGZvcm0gPSBpbmplY3QoUGxhdGZvcm0pO1xuICBwcml2YXRlIF9uZ1pvbmUgPSBpbmplY3QoTmdab25lKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBldmVudCBvZiByaXBwbGVJbnRlcmFjdGlvbkV2ZW50cykge1xuICAgICAgICB0aGlzLl9kb2N1bWVudD8uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgdGhpcy5fb25JbnRlcmFjdGlvbiwgZXZlbnRMaXN0ZW5lck9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgZm9yIChjb25zdCBldmVudCBvZiByaXBwbGVJbnRlcmFjdGlvbkV2ZW50cykge1xuICAgICAgdGhpcy5fZG9jdW1lbnQ/LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIHRoaXMuX29uSW50ZXJhY3Rpb24sIGV2ZW50TGlzdGVuZXJPcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlcyB0aGUgcmlwcGxlIHRoYXQgd2lsbCBiZSByZW5kZXJlZCBieSB0aGUgcmlwcGxlIGxvYWRlci5cbiAgICpcbiAgICogU3RvcmVzIHRoZSBnaXZlbiBpbmZvcm1hdGlvbiBhYm91dCBob3cgdGhlIHJpcHBsZSBzaG91bGQgYmUgY29uZmlndXJlZCBvbiB0aGUgaG9zdFxuICAgKiBlbGVtZW50IHNvIHRoYXQgaXQgY2FuIGxhdGVyIGJlIHJldHJpdmVkICYgdXNlZCB3aGVuIHRoZSByaXBwbGUgaXMgYWN0dWFsbHkgY3JlYXRlZC5cbiAgICovXG4gIGNvbmZpZ3VyZVJpcHBsZShcbiAgICBob3N0OiBIVE1MRWxlbWVudCxcbiAgICBjb25maWc6IHtcbiAgICAgIGNsYXNzTmFtZT86IHN0cmluZztcbiAgICAgIGNlbnRlcmVkPzogYm9vbGVhbjtcbiAgICAgIGRpc2FibGVkPzogYm9vbGVhbjtcbiAgICB9LFxuICApOiB2b2lkIHtcbiAgICAvLyBJbmRpY2F0ZXMgdGhhdCB0aGUgcmlwcGxlIGhhcyBub3QgeWV0IGJlZW4gcmVuZGVyZWQgZm9yIHRoaXMgY29tcG9uZW50LlxuICAgIGhvc3Quc2V0QXR0cmlidXRlKG1hdFJpcHBsZVVuaW5pdGlhbGl6ZWQsICcnKTtcblxuICAgIC8vIFN0b3JlIHRoZSBhZGRpdGlvbmFsIGNsYXNzIG5hbWUocykgdGhhdCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIHJpcHBsZSBlbGVtZW50LlxuICAgIGlmIChjb25maWcuY2xhc3NOYW1lIHx8ICFob3N0Lmhhc0F0dHJpYnV0ZShtYXRSaXBwbGVDbGFzc05hbWUpKSB7XG4gICAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVDbGFzc05hbWUsIGNvbmZpZy5jbGFzc05hbWUgfHwgJycpO1xuICAgIH1cblxuICAgIC8vIFN0b3JlIHdoZXRoZXIgdGhlIHJpcHBsZSBzaG91bGQgYmUgY2VudGVyZWQuXG4gICAgaWYgKGNvbmZpZy5jZW50ZXJlZCkge1xuICAgICAgaG9zdC5zZXRBdHRyaWJ1dGUobWF0UmlwcGxlQ2VudGVyZWQsICcnKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmRpc2FibGVkKSB7XG4gICAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVEaXNhYmxlZCwgJycpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSByaXBwbGUgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBob3N0IGVsZW1lbnQuICovXG4gIGdldFJpcHBsZShob3N0OiBIVE1MRWxlbWVudCk6IE1hdFJpcHBsZSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKChob3N0IGFzIGFueSkubWF0UmlwcGxlKSB7XG4gICAgICByZXR1cm4gKGhvc3QgYXMgYW55KS5tYXRSaXBwbGU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNyZWF0ZVJpcHBsZShob3N0KTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBvbiB0aGUgcmlwcGxlIGluc3RhbmNlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIGhvc3QgZWxlbWVudC4gKi9cbiAgc2V0RGlzYWJsZWQoaG9zdDogSFRNTEVsZW1lbnQsIGRpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgcmlwcGxlID0gKGhvc3QgYXMgYW55KS5tYXRSaXBwbGUgYXMgTWF0UmlwcGxlIHwgdW5kZWZpbmVkO1xuXG4gICAgLy8gSWYgdGhlIHJpcHBsZSBoYXMgYWxyZWFkeSBiZWVuIGluc3RhbnRpYXRlZCwganVzdCBkaXNhYmxlIGl0LlxuICAgIGlmIChyaXBwbGUpIHtcbiAgICAgIHJpcHBsZS5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSwgc2V0IGFuIGF0dHJpYnV0ZSBzbyB3ZSBrbm93IHdoYXQgdGhlXG4gICAgLy8gZGlzYWJsZWQgc3RhdGUgc2hvdWxkIGJlIHdoZW4gdGhlIHJpcHBsZSBpcyBpbml0aWFsaXplZC5cbiAgICBpZiAoZGlzYWJsZWQpIHtcbiAgICAgIGhvc3Quc2V0QXR0cmlidXRlKG1hdFJpcHBsZURpc2FibGVkLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhvc3QucmVtb3ZlQXR0cmlidXRlKG1hdFJpcHBsZURpc2FibGVkKTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBjcmVhdGluZyBhbmQgYXR0YWNoaW5nIGNvbXBvbmVudCBpbnRlcm5hbHMgd2hlbiBhIGNvbXBvbmVudCBpdCBpcyBpbml0aWFsbHkgaW50ZXJhY3RlZCB3aXRoLiAqL1xuICBwcml2YXRlIF9vbkludGVyYWN0aW9uID0gKGV2ZW50OiBFdmVudCkgPT4ge1xuICAgIGlmICghKGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBldmVudFRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuICAgIC8vIFRPRE8od2FnbmVybWFjaWVsKTogQ29uc2lkZXIgYmF0Y2hpbmcgdGhlc2UgZXZlbnRzIHRvIGltcHJvdmUgcnVudGltZSBwZXJmb3JtYW5jZS5cblxuICAgIGNvbnN0IGVsZW1lbnQgPSBldmVudFRhcmdldC5jbG9zZXN0KGBbJHttYXRSaXBwbGVVbmluaXRpYWxpemVkfV1gKTtcbiAgICBpZiAoZWxlbWVudCkge1xuICAgICAgdGhpcy5jcmVhdGVSaXBwbGUoZWxlbWVudCBhcyBIVE1MRWxlbWVudCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKiBDcmVhdGVzIGEgTWF0UmlwcGxlIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBnaXZlbiBlbGVtZW50LiAqL1xuICBjcmVhdGVSaXBwbGUoaG9zdDogSFRNTEVsZW1lbnQpOiBNYXRSaXBwbGUgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5fZG9jdW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgdGhlIHJpcHBsZSBlbGVtZW50LlxuICAgIGhvc3QucXVlcnlTZWxlY3RvcignLm1hdC1yaXBwbGUnKT8ucmVtb3ZlKCk7XG4gICAgY29uc3QgcmlwcGxlRWwgPSB0aGlzLl9kb2N1bWVudCEuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHJpcHBsZUVsLmNsYXNzTGlzdC5hZGQoJ21hdC1yaXBwbGUnLCBob3N0LmdldEF0dHJpYnV0ZShtYXRSaXBwbGVDbGFzc05hbWUpISk7XG4gICAgaG9zdC5hcHBlbmQocmlwcGxlRWwpO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBNYXRSaXBwbGUuXG4gICAgY29uc3QgcmlwcGxlID0gbmV3IE1hdFJpcHBsZShcbiAgICAgIG5ldyBFbGVtZW50UmVmKHJpcHBsZUVsKSxcbiAgICAgIHRoaXMuX25nWm9uZSxcbiAgICAgIHRoaXMuX3BsYXRmb3JtLFxuICAgICAgdGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucyA/IHRoaXMuX2dsb2JhbFJpcHBsZU9wdGlvbnMgOiB1bmRlZmluZWQsXG4gICAgICB0aGlzLl9hbmltYXRpb25Nb2RlID8gdGhpcy5fYW5pbWF0aW9uTW9kZSA6IHVuZGVmaW5lZCxcbiAgICApO1xuICAgIHJpcHBsZS5faXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgcmlwcGxlLnRyaWdnZXIgPSBob3N0O1xuICAgIHJpcHBsZS5jZW50ZXJlZCA9IGhvc3QuaGFzQXR0cmlidXRlKG1hdFJpcHBsZUNlbnRlcmVkKTtcbiAgICByaXBwbGUuZGlzYWJsZWQgPSBob3N0Lmhhc0F0dHJpYnV0ZShtYXRSaXBwbGVEaXNhYmxlZCk7XG4gICAgdGhpcy5hdHRhY2hSaXBwbGUoaG9zdCwgcmlwcGxlKTtcbiAgICByZXR1cm4gcmlwcGxlO1xuICB9XG5cbiAgYXR0YWNoUmlwcGxlKGhvc3Q6IEVsZW1lbnQsIHJpcHBsZTogTWF0UmlwcGxlKTogdm9pZCB7XG4gICAgaG9zdC5yZW1vdmVBdHRyaWJ1dGUobWF0UmlwcGxlVW5pbml0aWFsaXplZCk7XG4gICAgKGhvc3QgYXMgYW55KS5tYXRSaXBwbGUgPSByaXBwbGU7XG4gIH1cbn1cbiJdfQ==