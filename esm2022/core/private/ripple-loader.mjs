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
import { Platform, _getEventTarget } from '@angular/cdk/platform';
import * as i0 from "@angular/core";
/** The options for the MatRippleLoader's event listeners. */
const eventListenerOptions = { capture: true };
/**
 * The events that should trigger the initialization of the ripple.
 * Note that we use `mousedown`, rather than `click`, for mouse devices because
 * we can't rely on `mouseenter` in the shadow DOM and `click` happens too late.
 */
const rippleInteractionEvents = ['focus', 'mousedown', 'mouseenter', 'touchstart'];
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
 *
 * @docs-private
 */
export class MatRippleLoader {
    constructor() {
        this._document = inject(DOCUMENT, { optional: true });
        this._animationMode = inject(ANIMATION_MODULE_TYPE, { optional: true });
        this._globalRippleOptions = inject(MAT_RIPPLE_GLOBAL_OPTIONS, { optional: true });
        this._platform = inject(Platform);
        this._ngZone = inject(NgZone);
        this._hosts = new Map();
        /**
         * Handles creating and attaching component internals
         * when a component is initially interacted with.
         */
        this._onInteraction = (event) => {
            const eventTarget = _getEventTarget(event);
            if (eventTarget instanceof HTMLElement) {
                // TODO(wagnermaciel): Consider batching these events to improve runtime performance.
                const element = eventTarget.closest(`[${matRippleUninitialized}="${this._globalRippleOptions?.namespace ?? ''}"]`);
                if (element) {
                    this._createRipple(element);
                }
            }
        };
        this._ngZone.runOutsideAngular(() => {
            for (const event of rippleInteractionEvents) {
                this._document?.addEventListener(event, this._onInteraction, eventListenerOptions);
            }
        });
    }
    ngOnDestroy() {
        const hosts = this._hosts.keys();
        for (const host of hosts) {
            this.destroyRipple(host);
        }
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
        host.setAttribute(matRippleUninitialized, this._globalRippleOptions?.namespace ?? '');
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
    /** Sets the disabled state on the ripple instance corresponding to the given host element. */
    setDisabled(host, disabled) {
        const ripple = this._hosts.get(host);
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
    _createRipple(host) {
        if (!this._document) {
            return;
        }
        const existingRipple = this._hosts.get(host);
        if (existingRipple) {
            return existingRipple;
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
        this._hosts.set(host, ripple);
    }
    destroyRipple(host) {
        const ripple = this._hosts.get(host);
        if (ripple) {
            // Since this directive is created manually, it needs to be destroyed manually too.
            // tslint:disable-next-line:no-lifecycle-invocation
            ripple.ngOnDestroy();
            this._hosts.delete(host);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatRippleLoader, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatRippleLoader, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatRippleLoader, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLWxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3ByaXZhdGUvcmlwcGxlLWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLHFCQUFxQixFQUNyQixVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFFTixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLHlCQUF5QixFQUFFLFNBQVMsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUMvRCxPQUFPLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDOztBQUVoRSw2REFBNkQ7QUFDN0QsTUFBTSxvQkFBb0IsR0FBRyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQztBQUU3Qzs7OztHQUlHO0FBQ0gsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRW5GLHVGQUF1RjtBQUN2RixNQUFNLHNCQUFzQixHQUFHLGlDQUFpQyxDQUFDO0FBRWpFLGlGQUFpRjtBQUNqRixNQUFNLGtCQUFrQixHQUFHLDhCQUE4QixDQUFDO0FBRTFELDZDQUE2QztBQUM3QyxNQUFNLGlCQUFpQixHQUFHLDRCQUE0QixDQUFDO0FBRXZELDZDQUE2QztBQUM3QyxNQUFNLGlCQUFpQixHQUFHLDRCQUE0QixDQUFDO0FBRXZEOzs7Ozs7O0dBT0c7QUFFSCxNQUFNLE9BQU8sZUFBZTtJQVExQjtRQVBRLGNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDL0MsbUJBQWMsR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUs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KiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFOSU1BVElPTl9NT0RVTEVfVFlQRSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0YWJsZSxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsIE1hdFJpcHBsZX0gZnJvbSAnLi4vcmlwcGxlJztcbmltcG9ydCB7UGxhdGZvcm0sIF9nZXRFdmVudFRhcmdldH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcblxuLyoqIFRoZSBvcHRpb25zIGZvciB0aGUgTWF0UmlwcGxlTG9hZGVyJ3MgZXZlbnQgbGlzdGVuZXJzLiAqL1xuY29uc3QgZXZlbnRMaXN0ZW5lck9wdGlvbnMgPSB7Y2FwdHVyZTogdHJ1ZX07XG5cbi8qKlxuICogVGhlIGV2ZW50cyB0aGF0IHNob3VsZCB0cmlnZ2VyIHRoZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgcmlwcGxlLlxuICogTm90ZSB0aGF0IHdlIHVzZSBgbW91c2Vkb3duYCwgcmF0aGVyIHRoYW4gYGNsaWNrYCwgZm9yIG1vdXNlIGRldmljZXMgYmVjYXVzZVxuICogd2UgY2FuJ3QgcmVseSBvbiBgbW91c2VlbnRlcmAgaW4gdGhlIHNoYWRvdyBET00gYW5kIGBjbGlja2AgaGFwcGVucyB0b28gbGF0ZS5cbiAqL1xuY29uc3QgcmlwcGxlSW50ZXJhY3Rpb25FdmVudHMgPSBbJ2ZvY3VzJywgJ21vdXNlZG93bicsICdtb3VzZWVudGVyJywgJ3RvdWNoc3RhcnQnXTtcblxuLyoqIFRoZSBhdHRyaWJ1dGUgYXR0YWNoZWQgdG8gYSBjb21wb25lbnQgd2hvc2UgcmlwcGxlIGhhcyBub3QgeWV0IGJlZW4gaW5pdGlhbGl6ZWQuICovXG5jb25zdCBtYXRSaXBwbGVVbmluaXRpYWxpemVkID0gJ21hdC1yaXBwbGUtbG9hZGVyLXVuaW5pdGlhbGl6ZWQnO1xuXG4vKiogQWRkaXRpb25hbCBjbGFzc2VzIHRoYXQgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSByaXBwbGUgd2hlbiBpdCBpcyByZW5kZXJlZC4gKi9cbmNvbnN0IG1hdFJpcHBsZUNsYXNzTmFtZSA9ICdtYXQtcmlwcGxlLWxvYWRlci1jbGFzcy1uYW1lJztcblxuLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBzaG91bGQgYmUgY2VudGVyZWQuICovXG5jb25zdCBtYXRSaXBwbGVDZW50ZXJlZCA9ICdtYXQtcmlwcGxlLWxvYWRlci1jZW50ZXJlZCc7XG5cbi8qKiBXaGV0aGVyIHRoZSByaXBwbGUgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuY29uc3QgbWF0UmlwcGxlRGlzYWJsZWQgPSAnbWF0LXJpcHBsZS1sb2FkZXItZGlzYWJsZWQnO1xuXG4vKipcbiAqIEhhbmRsZXMgYXR0YWNoaW5nIHJpcHBsZXMgb24gZGVtYW5kLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdXMgdG8gYXZvaWQgZWFnZXJseSBjcmVhdGluZyAmIGF0dGFjaGluZyBNYXRSaXBwbGVzLlxuICogSXQgd29ya3MgYnkgY3JlYXRpbmcgJiBhdHRhY2hpbmcgYSByaXBwbGUgb25seSB3aGVuIGEgY29tcG9uZW50IGlzIGZpcnN0IGludGVyYWN0ZWQgd2l0aC5cbiAqXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1hdFJpcHBsZUxvYWRlciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5ULCB7b3B0aW9uYWw6IHRydWV9KTtcbiAgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZSA9IGluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUsIHtvcHRpb25hbDogdHJ1ZX0pO1xuICBwcml2YXRlIF9nbG9iYWxSaXBwbGVPcHRpb25zID0gaW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsIHtvcHRpb25hbDogdHJ1ZX0pO1xuICBwcml2YXRlIF9wbGF0Zm9ybSA9IGluamVjdChQbGF0Zm9ybSk7XG4gIHByaXZhdGUgX25nWm9uZSA9IGluamVjdChOZ1pvbmUpO1xuICBwcml2YXRlIF9ob3N0cyA9IG5ldyBNYXA8SFRNTEVsZW1lbnQsIE1hdFJpcHBsZT4oKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBldmVudCBvZiByaXBwbGVJbnRlcmFjdGlvbkV2ZW50cykge1xuICAgICAgICB0aGlzLl9kb2N1bWVudD8uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgdGhpcy5fb25JbnRlcmFjdGlvbiwgZXZlbnRMaXN0ZW5lck9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3QgaG9zdHMgPSB0aGlzLl9ob3N0cy5rZXlzKCk7XG5cbiAgICBmb3IgKGNvbnN0IGhvc3Qgb2YgaG9zdHMpIHtcbiAgICAgIHRoaXMuZGVzdHJveVJpcHBsZShob3N0KTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIHJpcHBsZUludGVyYWN0aW9uRXZlbnRzKSB7XG4gICAgICB0aGlzLl9kb2N1bWVudD8ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgdGhpcy5fb25JbnRlcmFjdGlvbiwgZXZlbnRMaXN0ZW5lck9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSByaXBwbGUgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGJ5IHRoZSByaXBwbGUgbG9hZGVyLlxuICAgKlxuICAgKiBTdG9yZXMgdGhlIGdpdmVuIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0aGUgcmlwcGxlIHNob3VsZCBiZSBjb25maWd1cmVkIG9uIHRoZSBob3N0XG4gICAqIGVsZW1lbnQgc28gdGhhdCBpdCBjYW4gbGF0ZXIgYmUgcmV0cml2ZWQgJiB1c2VkIHdoZW4gdGhlIHJpcHBsZSBpcyBhY3R1YWxseSBjcmVhdGVkLlxuICAgKi9cbiAgY29uZmlndXJlUmlwcGxlKFxuICAgIGhvc3Q6IEhUTUxFbGVtZW50LFxuICAgIGNvbmZpZzoge1xuICAgICAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICAgICAgY2VudGVyZWQ/OiBib29sZWFuO1xuICAgICAgZGlzYWJsZWQ/OiBib29sZWFuO1xuICAgIH0sXG4gICk6IHZvaWQge1xuICAgIC8vIEluZGljYXRlcyB0aGF0IHRoZSByaXBwbGUgaGFzIG5vdCB5ZXQgYmVlbiByZW5kZXJlZCBmb3IgdGhpcyBjb21wb25lbnQuXG4gICAgaG9zdC5zZXRBdHRyaWJ1dGUobWF0UmlwcGxlVW5pbml0aWFsaXplZCwgdGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucz8ubmFtZXNwYWNlID8/ICcnKTtcblxuICAgIC8vIFN0b3JlIHRoZSBhZGRpdGlvbmFsIGNsYXNzIG5hbWUocykgdGhhdCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIHJpcHBsZSBlbGVtZW50LlxuICAgIGlmIChjb25maWcuY2xhc3NOYW1lIHx8ICFob3N0Lmhhc0F0dHJpYnV0ZShtYXRSaXBwbGVDbGFzc05hbWUpKSB7XG4gICAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVDbGFzc05hbWUsIGNvbmZpZy5jbGFzc05hbWUgfHwgJycpO1xuICAgIH1cblxuICAgIC8vIFN0b3JlIHdoZXRoZXIgdGhlIHJpcHBsZSBzaG91bGQgYmUgY2VudGVyZWQuXG4gICAgaWYgKGNvbmZpZy5jZW50ZXJlZCkge1xuICAgICAgaG9zdC5zZXRBdHRyaWJ1dGUobWF0UmlwcGxlQ2VudGVyZWQsICcnKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmRpc2FibGVkKSB7XG4gICAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVEaXNhYmxlZCwgJycpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBvbiB0aGUgcmlwcGxlIGluc3RhbmNlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIGhvc3QgZWxlbWVudC4gKi9cbiAgc2V0RGlzYWJsZWQoaG9zdDogSFRNTEVsZW1lbnQsIGRpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgcmlwcGxlID0gdGhpcy5faG9zdHMuZ2V0KGhvc3QpO1xuXG4gICAgLy8gSWYgdGhlIHJpcHBsZSBoYXMgYWxyZWFkeSBiZWVuIGluc3RhbnRpYXRlZCwganVzdCBkaXNhYmxlIGl0LlxuICAgIGlmIChyaXBwbGUpIHtcbiAgICAgIHJpcHBsZS5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSwgc2V0IGFuIGF0dHJpYnV0ZSBzbyB3ZSBrbm93IHdoYXQgdGhlXG4gICAgLy8gZGlzYWJsZWQgc3RhdGUgc2hvdWxkIGJlIHdoZW4gdGhlIHJpcHBsZSBpcyBpbml0aWFsaXplZC5cbiAgICBpZiAoZGlzYWJsZWQpIHtcbiAgICAgIGhvc3Quc2V0QXR0cmlidXRlKG1hdFJpcHBsZURpc2FibGVkLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhvc3QucmVtb3ZlQXR0cmlidXRlKG1hdFJpcHBsZURpc2FibGVkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyBjcmVhdGluZyBhbmQgYXR0YWNoaW5nIGNvbXBvbmVudCBpbnRlcm5hbHNcbiAgICogd2hlbiBhIGNvbXBvbmVudCBpcyBpbml0aWFsbHkgaW50ZXJhY3RlZCB3aXRoLlxuICAgKi9cbiAgcHJpdmF0ZSBfb25JbnRlcmFjdGlvbiA9IChldmVudDogRXZlbnQpID0+IHtcbiAgICBjb25zdCBldmVudFRhcmdldCA9IF9nZXRFdmVudFRhcmdldChldmVudCk7XG5cbiAgICBpZiAoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgLy8gVE9ETyh3YWduZXJtYWNpZWwpOiBDb25zaWRlciBiYXRjaGluZyB0aGVzZSBldmVudHMgdG8gaW1wcm92ZSBydW50aW1lIHBlcmZvcm1hbmNlLlxuICAgICAgY29uc3QgZWxlbWVudCA9IGV2ZW50VGFyZ2V0LmNsb3Nlc3QoXG4gICAgICAgIGBbJHttYXRSaXBwbGVVbmluaXRpYWxpemVkfT1cIiR7dGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucz8ubmFtZXNwYWNlID8/ICcnfVwiXWAsXG4gICAgICApO1xuXG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICB0aGlzLl9jcmVhdGVSaXBwbGUoZWxlbWVudCBhcyBIVE1MRWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKiBDcmVhdGVzIGEgTWF0UmlwcGxlIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBnaXZlbiBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9jcmVhdGVSaXBwbGUoaG9zdDogSFRNTEVsZW1lbnQpOiBNYXRSaXBwbGUgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5fZG9jdW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBleGlzdGluZ1JpcHBsZSA9IHRoaXMuX2hvc3RzLmdldChob3N0KTtcbiAgICBpZiAoZXhpc3RpbmdSaXBwbGUpIHtcbiAgICAgIHJldHVybiBleGlzdGluZ1JpcHBsZTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgdGhlIHJpcHBsZSBlbGVtZW50LlxuICAgIGhvc3QucXVlcnlTZWxlY3RvcignLm1hdC1yaXBwbGUnKT8ucmVtb3ZlKCk7XG4gICAgY29uc3QgcmlwcGxlRWwgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcmlwcGxlRWwuY2xhc3NMaXN0LmFkZCgnbWF0LXJpcHBsZScsIGhvc3QuZ2V0QXR0cmlidXRlKG1hdFJpcHBsZUNsYXNzTmFtZSkhKTtcbiAgICBob3N0LmFwcGVuZChyaXBwbGVFbCk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIE1hdFJpcHBsZS5cbiAgICBjb25zdCByaXBwbGUgPSBuZXcgTWF0UmlwcGxlKFxuICAgICAgbmV3IEVsZW1lbnRSZWYocmlwcGxlRWwpLFxuICAgICAgdGhpcy5fbmdab25lLFxuICAgICAgdGhpcy5fcGxhdGZvcm0sXG4gICAgICB0aGlzLl9nbG9iYWxSaXBwbGVPcHRpb25zID8gdGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucyA6IHVuZGVmaW5lZCxcbiAgICAgIHRoaXMuX2FuaW1hdGlvbk1vZGUgPyB0aGlzLl9hbmltYXRpb25Nb2RlIDogdW5kZWZpbmVkLFxuICAgICk7XG4gICAgcmlwcGxlLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICByaXBwbGUudHJpZ2dlciA9IGhvc3Q7XG4gICAgcmlwcGxlLmNlbnRlcmVkID0gaG9zdC5oYXNBdHRyaWJ1dGUobWF0UmlwcGxlQ2VudGVyZWQpO1xuICAgIHJpcHBsZS5kaXNhYmxlZCA9IGhvc3QuaGFzQXR0cmlidXRlKG1hdFJpcHBsZURpc2FibGVkKTtcbiAgICB0aGlzLmF0dGFjaFJpcHBsZShob3N0LCByaXBwbGUpO1xuICAgIHJldHVybiByaXBwbGU7XG4gIH1cblxuICBhdHRhY2hSaXBwbGUoaG9zdDogSFRNTEVsZW1lbnQsIHJpcHBsZTogTWF0UmlwcGxlKTogdm9pZCB7XG4gICAgaG9zdC5yZW1vdmVBdHRyaWJ1dGUobWF0UmlwcGxlVW5pbml0aWFsaXplZCk7XG4gICAgdGhpcy5faG9zdHMuc2V0KGhvc3QsIHJpcHBsZSk7XG4gIH1cblxuICBkZXN0cm95UmlwcGxlKGhvc3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcmlwcGxlID0gdGhpcy5faG9zdHMuZ2V0KGhvc3QpO1xuXG4gICAgaWYgKHJpcHBsZSkge1xuICAgICAgLy8gU2luY2UgdGhpcyBkaXJlY3RpdmUgaXMgY3JlYXRlZCBtYW51YWxseSwgaXQgbmVlZHMgdG8gYmUgZGVzdHJveWVkIG1hbnVhbGx5IHRvby5cbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1saWZlY3ljbGUtaW52b2NhdGlvblxuICAgICAgcmlwcGxlLm5nT25EZXN0cm95KCk7XG4gICAgICB0aGlzLl9ob3N0cy5kZWxldGUoaG9zdCk7XG4gICAgfVxuICB9XG59XG4iXX0=