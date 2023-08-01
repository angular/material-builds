/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { ANIMATION_MODULE_TYPE, ElementRef, Injectable, NgZone, inject, } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { MAT_RIPPLE_GLOBAL_OPTIONS, MatRipple } from '@angular/material/core';
import * as i0 from "@angular/core";
/** The options for the MatButtonRippleLoader's event listeners. */
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
export class MatButtonLazyLoader {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatButtonLazyLoader, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatButtonLazyLoader, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatButtonLazyLoader, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWxhenktbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2J1dHRvbi9idXR0b24tbGF6eS1sb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxxQkFBcUIsRUFDckIsVUFBVSxFQUNWLFVBQVUsRUFDVixNQUFNLEVBRU4sTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMseUJBQXlCLEVBQUUsU0FBUyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7O0FBRTVFLG1FQUFtRTtBQUNuRSxNQUFNLG9CQUFvQixHQUFHLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO0FBRTdDLHVFQUF1RTtBQUN2RSxNQUFNLHVCQUF1QixHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFL0UsdUZBQXVGO0FBQ3ZGLE1BQU0sc0JBQXNCLEdBQUcsaUNBQWlDLENBQUM7QUFFakUsaUZBQWlGO0FBQ2pGLE1BQU0sa0JBQWtCLEdBQUcsOEJBQThCLENBQUM7QUFFMUQsNkNBQTZDO0FBQzdDLE1BQU0saUJBQWlCLEdBQUcsNEJBQTRCLENBQUM7QUFFdkQsNkNBQTZDO0FBQzdDLE1BQU0saUJBQWlCLEdBQUcsNEJBQTRCLENBQUM7QUFFdkQ7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sbUJBQW1CO0lBTzlCO1FBTlEsY0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUMvQyxtQkFBYyxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxFQUFDLFFB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TUFBTSxDQUFDLENBQUM7UUFDaEMsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFhLEVBQUUsTUFBaUI7UUFDM0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQzVDLElBQVksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0lBQ25DLENBQUM7OEdBOUhVLG1CQUFtQjtrSEFBbkIsbUJBQW1CLGNBRFAsTUFBTTs7MkZBQ2xCLG1CQUFtQjtrQkFEL0IsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFOSU1BVElPTl9NT0RVTEVfVFlQRSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0YWJsZSxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLCBNYXRSaXBwbGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuXG4vKiogVGhlIG9wdGlvbnMgZm9yIHRoZSBNYXRCdXR0b25SaXBwbGVMb2FkZXIncyBldmVudCBsaXN0ZW5lcnMuICovXG5jb25zdCBldmVudExpc3RlbmVyT3B0aW9ucyA9IHtjYXB0dXJlOiB0cnVlfTtcblxuLyoqIFRoZSBldmVudHMgdGhhdCBzaG91bGQgdHJpZ2dlciB0aGUgaW5pdGlhbGl6YXRpb24gb2YgdGhlIHJpcHBsZS4gKi9cbmNvbnN0IHJpcHBsZUludGVyYWN0aW9uRXZlbnRzID0gWydmb2N1cycsICdjbGljaycsICdtb3VzZWVudGVyJywgJ3RvdWNoc3RhcnQnXTtcblxuLyoqIFRoZSBhdHRyaWJ1dGUgYXR0YWNoZWQgdG8gYSBjb21wb25lbnQgd2hvc2UgcmlwcGxlIGhhcyBub3QgeWV0IGJlZW4gaW5pdGlhbGl6ZWQuICovXG5jb25zdCBtYXRSaXBwbGVVbmluaXRpYWxpemVkID0gJ21hdC1yaXBwbGUtbG9hZGVyLXVuaW5pdGlhbGl6ZWQnO1xuXG4vKiogQWRkaXRpb25hbCBjbGFzc2VzIHRoYXQgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSByaXBwbGUgd2hlbiBpdCBpcyByZW5kZXJlZC4gKi9cbmNvbnN0IG1hdFJpcHBsZUNsYXNzTmFtZSA9ICdtYXQtcmlwcGxlLWxvYWRlci1jbGFzcy1uYW1lJztcblxuLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBzaG91bGQgYmUgY2VudGVyZWQuICovXG5jb25zdCBtYXRSaXBwbGVDZW50ZXJlZCA9ICdtYXQtcmlwcGxlLWxvYWRlci1jZW50ZXJlZCc7XG5cbi8qKiBXaGV0aGVyIHRoZSByaXBwbGUgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuY29uc3QgbWF0UmlwcGxlRGlzYWJsZWQgPSAnbWF0LXJpcHBsZS1sb2FkZXItZGlzYWJsZWQnO1xuXG4vKipcbiAqIEhhbmRsZXMgYXR0YWNoaW5nIHJpcHBsZXMgb24gZGVtYW5kLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdXMgdG8gYXZvaWQgZWFnZXJseSBjcmVhdGluZyAmIGF0dGFjaGluZyBNYXRSaXBwbGVzLlxuICogSXQgd29ya3MgYnkgY3JlYXRpbmcgJiBhdHRhY2hpbmcgYSByaXBwbGUgb25seSB3aGVuIGEgY29tcG9uZW50IGlzIGZpcnN0IGludGVyYWN0ZWQgd2l0aC5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uTGF6eUxvYWRlciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5ULCB7b3B0aW9uYWw6IHRydWV9KTtcbiAgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZSA9IGluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUsIHtvcHRpb25hbDogdHJ1ZX0pO1xuICBwcml2YXRlIF9nbG9iYWxSaXBwbGVPcHRpb25zID0gaW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsIHtvcHRpb25hbDogdHJ1ZX0pO1xuICBwcml2YXRlIF9wbGF0Zm9ybSA9IGluamVjdChQbGF0Zm9ybSk7XG4gIHByaXZhdGUgX25nWm9uZSA9IGluamVjdChOZ1pvbmUpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIHJpcHBsZUludGVyYWN0aW9uRXZlbnRzKSB7XG4gICAgICAgIHRoaXMuX2RvY3VtZW50Py5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCB0aGlzLl9vbkludGVyYWN0aW9uLCBldmVudExpc3RlbmVyT3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIHJpcHBsZUludGVyYWN0aW9uRXZlbnRzKSB7XG4gICAgICB0aGlzLl9kb2N1bWVudD8ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgdGhpcy5fb25JbnRlcmFjdGlvbiwgZXZlbnRMaXN0ZW5lck9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSByaXBwbGUgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGJ5IHRoZSByaXBwbGUgbG9hZGVyLlxuICAgKlxuICAgKiBTdG9yZXMgdGhlIGdpdmVuIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0aGUgcmlwcGxlIHNob3VsZCBiZSBjb25maWd1cmVkIG9uIHRoZSBob3N0XG4gICAqIGVsZW1lbnQgc28gdGhhdCBpdCBjYW4gbGF0ZXIgYmUgcmV0cml2ZWQgJiB1c2VkIHdoZW4gdGhlIHJpcHBsZSBpcyBhY3R1YWxseSBjcmVhdGVkLlxuICAgKi9cbiAgY29uZmlndXJlUmlwcGxlKFxuICAgIGhvc3Q6IEhUTUxFbGVtZW50LFxuICAgIGNvbmZpZzoge1xuICAgICAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICAgICAgY2VudGVyZWQ/OiBib29sZWFuO1xuICAgICAgZGlzYWJsZWQ/OiBib29sZWFuO1xuICAgIH0sXG4gICk6IHZvaWQge1xuICAgIC8vIEluZGljYXRlcyB0aGF0IHRoZSByaXBwbGUgaGFzIG5vdCB5ZXQgYmVlbiByZW5kZXJlZCBmb3IgdGhpcyBjb21wb25lbnQuXG4gICAgaG9zdC5zZXRBdHRyaWJ1dGUobWF0UmlwcGxlVW5pbml0aWFsaXplZCwgJycpO1xuXG4gICAgLy8gU3RvcmUgdGhlIGFkZGl0aW9uYWwgY2xhc3MgbmFtZShzKSB0aGF0IHNob3VsZCBiZSBhZGRlZCB0byB0aGUgcmlwcGxlIGVsZW1lbnQuXG4gICAgaWYgKGNvbmZpZy5jbGFzc05hbWUgfHwgIWhvc3QuaGFzQXR0cmlidXRlKG1hdFJpcHBsZUNsYXNzTmFtZSkpIHtcbiAgICAgIGhvc3Quc2V0QXR0cmlidXRlKG1hdFJpcHBsZUNsYXNzTmFtZSwgY29uZmlnLmNsYXNzTmFtZSB8fCAnJyk7XG4gICAgfVxuXG4gICAgLy8gU3RvcmUgd2hldGhlciB0aGUgcmlwcGxlIHNob3VsZCBiZSBjZW50ZXJlZC5cbiAgICBpZiAoY29uZmlnLmNlbnRlcmVkKSB7XG4gICAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVDZW50ZXJlZCwgJycpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuZGlzYWJsZWQpIHtcbiAgICAgIGhvc3Quc2V0QXR0cmlidXRlKG1hdFJpcHBsZURpc2FibGVkLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHJpcHBsZSBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGhvc3QgZWxlbWVudC4gKi9cbiAgZ2V0UmlwcGxlKGhvc3Q6IEhUTUxFbGVtZW50KTogTWF0UmlwcGxlIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoKGhvc3QgYXMgYW55KS5tYXRSaXBwbGUpIHtcbiAgICAgIHJldHVybiAoaG9zdCBhcyBhbnkpLm1hdFJpcHBsZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlUmlwcGxlKGhvc3QpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGRpc2FibGVkIHN0YXRlIG9uIHRoZSByaXBwbGUgaW5zdGFuY2UgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW4gaG9zdCBlbGVtZW50LiAqL1xuICBzZXREaXNhYmxlZChob3N0OiBIVE1MRWxlbWVudCwgZGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCByaXBwbGUgPSAoaG9zdCBhcyBhbnkpLm1hdFJpcHBsZSBhcyBNYXRSaXBwbGUgfCB1bmRlZmluZWQ7XG5cbiAgICAvLyBJZiB0aGUgcmlwcGxlIGhhcyBhbHJlYWR5IGJlZW4gaW5zdGFudGlhdGVkLCBqdXN0IGRpc2FibGUgaXQuXG4gICAgaWYgKHJpcHBsZSkge1xuICAgICAgcmlwcGxlLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlLCBzZXQgYW4gYXR0cmlidXRlIHNvIHdlIGtub3cgd2hhdCB0aGVcbiAgICAvLyBkaXNhYmxlZCBzdGF0ZSBzaG91bGQgYmUgd2hlbiB0aGUgcmlwcGxlIGlzIGluaXRpYWxpemVkLlxuICAgIGlmIChkaXNhYmxlZCkge1xuICAgICAgaG9zdC5zZXRBdHRyaWJ1dGUobWF0UmlwcGxlRGlzYWJsZWQsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaG9zdC5yZW1vdmVBdHRyaWJ1dGUobWF0UmlwcGxlRGlzYWJsZWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGNyZWF0aW5nIGFuZCBhdHRhY2hpbmcgY29tcG9uZW50IGludGVybmFscyB3aGVuIGEgY29tcG9uZW50IGl0IGlzIGluaXRpYWxseSBpbnRlcmFjdGVkIHdpdGguICovXG4gIHByaXZhdGUgX29uSW50ZXJhY3Rpb24gPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgaWYgKCEoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGV2ZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgLy8gVE9ETyh3YWduZXJtYWNpZWwpOiBDb25zaWRlciBiYXRjaGluZyB0aGVzZSBldmVudHMgdG8gaW1wcm92ZSBydW50aW1lIHBlcmZvcm1hbmNlLlxuXG4gICAgY29uc3QgZWxlbWVudCA9IGV2ZW50VGFyZ2V0LmNsb3Nlc3QoYFske21hdFJpcHBsZVVuaW5pdGlhbGl6ZWR9XWApO1xuICAgIGlmIChlbGVtZW50KSB7XG4gICAgICB0aGlzLmNyZWF0ZVJpcHBsZShlbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICB9XG4gIH07XG5cbiAgLyoqIENyZWF0ZXMgYSBNYXRSaXBwbGUgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIGdpdmVuIGVsZW1lbnQuICovXG4gIGNyZWF0ZVJpcHBsZShob3N0OiBIVE1MRWxlbWVudCk6IE1hdFJpcHBsZSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCF0aGlzLl9kb2N1bWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSB0aGUgcmlwcGxlIGVsZW1lbnQuXG4gICAgaG9zdC5xdWVyeVNlbGVjdG9yKCcubWF0LXJpcHBsZScpPy5yZW1vdmUoKTtcbiAgICBjb25zdCByaXBwbGVFbCA9IHRoaXMuX2RvY3VtZW50IS5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcmlwcGxlRWwuY2xhc3NMaXN0LmFkZCgnbWF0LXJpcHBsZScsIGhvc3QuZ2V0QXR0cmlidXRlKG1hdFJpcHBsZUNsYXNzTmFtZSkhKTtcbiAgICBob3N0LmFwcGVuZChyaXBwbGVFbCk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIE1hdFJpcHBsZS5cbiAgICBjb25zdCByaXBwbGUgPSBuZXcgTWF0UmlwcGxlKFxuICAgICAgbmV3IEVsZW1lbnRSZWYocmlwcGxlRWwpLFxuICAgICAgdGhpcy5fbmdab25lLFxuICAgICAgdGhpcy5fcGxhdGZvcm0sXG4gICAgICB0aGlzLl9nbG9iYWxSaXBwbGVPcHRpb25zID8gdGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucyA6IHVuZGVmaW5lZCxcbiAgICAgIHRoaXMuX2FuaW1hdGlvbk1vZGUgPyB0aGlzLl9hbmltYXRpb25Nb2RlIDogdW5kZWZpbmVkLFxuICAgICk7XG4gICAgcmlwcGxlLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICByaXBwbGUudHJpZ2dlciA9IGhvc3Q7XG4gICAgcmlwcGxlLmNlbnRlcmVkID0gaG9zdC5oYXNBdHRyaWJ1dGUobWF0UmlwcGxlQ2VudGVyZWQpO1xuICAgIHJpcHBsZS5kaXNhYmxlZCA9IGhvc3QuaGFzQXR0cmlidXRlKG1hdFJpcHBsZURpc2FibGVkKTtcbiAgICB0aGlzLmF0dGFjaFJpcHBsZShob3N0LCByaXBwbGUpO1xuICAgIHJldHVybiByaXBwbGU7XG4gIH1cblxuICBhdHRhY2hSaXBwbGUoaG9zdDogRWxlbWVudCwgcmlwcGxlOiBNYXRSaXBwbGUpOiB2b2lkIHtcbiAgICBob3N0LnJlbW92ZUF0dHJpYnV0ZShtYXRSaXBwbGVVbmluaXRpYWxpemVkKTtcbiAgICAoaG9zdCBhcyBhbnkpLm1hdFJpcHBsZSA9IHJpcHBsZTtcbiAgfVxufVxuIl19