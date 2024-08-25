/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { ANIMATION_MODULE_TYPE, Injectable, NgZone, inject } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleRenderer, defaultRippleAnimationConfig, } from '../ripple';
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
            ripple.target.rippleDisabled = disabled;
            if (!disabled && !ripple.hasSetUpEvents) {
                ripple.hasSetUpEvents = true;
                ripple.renderer.setupTriggerEvents(host);
            }
        }
        else if (disabled) {
            // Otherwise, set an attribute so we know what the
            // disabled state should be when the ripple is initialized.
            host.setAttribute(matRippleDisabled, '');
        }
        else {
            host.removeAttribute(matRippleDisabled);
        }
    }
    /** Creates a MatRipple and appends it to the given element. */
    _createRipple(host) {
        if (!this._document || this._hosts.has(host)) {
            return;
        }
        // Create the ripple element.
        host.querySelector('.mat-ripple')?.remove();
        const rippleEl = this._document.createElement('span');
        rippleEl.classList.add('mat-ripple', host.getAttribute(matRippleClassName));
        host.append(rippleEl);
        const isNoopAnimations = this._animationMode === 'NoopAnimations';
        const globalOptions = this._globalRippleOptions;
        const enterDuration = isNoopAnimations
            ? 0
            : globalOptions?.animation?.enterDuration ?? defaultRippleAnimationConfig.enterDuration;
        const exitDuration = isNoopAnimations
            ? 0
            : globalOptions?.animation?.exitDuration ?? defaultRippleAnimationConfig.exitDuration;
        const target = {
            rippleDisabled: isNoopAnimations || globalOptions?.disabled || host.hasAttribute(matRippleDisabled),
            rippleConfig: {
                centered: host.hasAttribute(matRippleCentered),
                terminateOnPointerUp: globalOptions?.terminateOnPointerUp,
                animation: {
                    enterDuration,
                    exitDuration,
                },
            },
        };
        const renderer = new RippleRenderer(target, this._ngZone, rippleEl, this._platform);
        const hasSetUpEvents = !target.rippleDisabled;
        if (hasSetUpEvents) {
            renderer.setupTriggerEvents(host);
        }
        this._hosts.set(host, {
            target,
            renderer,
            hasSetUpEvents,
        });
        host.removeAttribute(matRippleUninitialized);
    }
    destroyRipple(host) {
        const ripple = this._hosts.get(host);
        if (ripple) {
            ripple.renderer._removeTriggerEvents();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLWxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3ByaXZhdGUvcmlwcGxlLWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLHFCQUFxQixFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQWEsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzNGLE9BQU8sRUFDTCx5QkFBeUIsRUFDekIsY0FBYyxFQUVkLDRCQUE0QixHQUM3QixNQUFNLFdBQVcsQ0FBQztBQUNuQixPQUFPLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDOztBQUdoRSw2REFBNkQ7QUFDN0QsTUFBTSxvQkFBb0IsR0FBRyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQztBQUU3Qzs7OztHQUlHO0FBQ0gsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRW5GLHVGQUF1RjtBQUN2RixNQUFNLHNCQUFzQixHQUFHLGlDQUFpQyxDQUFDO0FBRWpFLGlGQUFpRjtBQUNqRixNQUFNLGtCQUFrQixHQUFHLDhCQUE4QixDQUFDO0FBRTFELDZDQUE2QztBQUM3QyxNQUFNLGlCQUFpQixHQUFHLDRCQUE0QixDQUFDO0FBRXZELDZDQUE2QztBQUM3QyxNQUFNLGlCQUFpQixHQUFHLDRCQUE0QixDQUFDO0FBRXZEOzs7Ozs7O0dBT0c7QUFFSCxNQUFNLE9BQU8sZUFBZTtJQVcxQjtRQVZRLGNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDL0MsbUJBQWMsR0FBRyxNQUFNLENBQUMscUJBQXFCLEVB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N0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckMsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNYLE1BQU0sQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixDQUFDO0lBQ0gsQ0FBQztxSEEvSlUsZUFBZTt5SEFBZixlQUFlLGNBREgsTUFBTTs7a0dBQ2xCLGVBQWU7a0JBRDNCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRSwgSW5qZWN0YWJsZSwgTmdab25lLCBPbkRlc3Ryb3ksIGluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLFxuICBSaXBwbGVSZW5kZXJlcixcbiAgUmlwcGxlVGFyZ2V0LFxuICBkZWZhdWx0UmlwcGxlQW5pbWF0aW9uQ29uZmlnLFxufSBmcm9tICcuLi9yaXBwbGUnO1xuaW1wb3J0IHtQbGF0Zm9ybSwgX2dldEV2ZW50VGFyZ2V0fSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtfQ2RrUHJpdmF0ZVN0eWxlTG9hZGVyfSBmcm9tICdAYW5ndWxhci9jZGsvcHJpdmF0ZSc7XG5cbi8qKiBUaGUgb3B0aW9ucyBmb3IgdGhlIE1hdFJpcHBsZUxvYWRlcidzIGV2ZW50IGxpc3RlbmVycy4gKi9cbmNvbnN0IGV2ZW50TGlzdGVuZXJPcHRpb25zID0ge2NhcHR1cmU6IHRydWV9O1xuXG4vKipcbiAqIFRoZSBldmVudHMgdGhhdCBzaG91bGQgdHJpZ2dlciB0aGUgaW5pdGlhbGl6YXRpb24gb2YgdGhlIHJpcHBsZS5cbiAqIE5vdGUgdGhhdCB3ZSB1c2UgYG1vdXNlZG93bmAsIHJhdGhlciB0aGFuIGBjbGlja2AsIGZvciBtb3VzZSBkZXZpY2VzIGJlY2F1c2VcbiAqIHdlIGNhbid0IHJlbHkgb24gYG1vdXNlZW50ZXJgIGluIHRoZSBzaGFkb3cgRE9NIGFuZCBgY2xpY2tgIGhhcHBlbnMgdG9vIGxhdGUuXG4gKi9cbmNvbnN0IHJpcHBsZUludGVyYWN0aW9uRXZlbnRzID0gWydmb2N1cycsICdtb3VzZWRvd24nLCAnbW91c2VlbnRlcicsICd0b3VjaHN0YXJ0J107XG5cbi8qKiBUaGUgYXR0cmlidXRlIGF0dGFjaGVkIHRvIGEgY29tcG9uZW50IHdob3NlIHJpcHBsZSBoYXMgbm90IHlldCBiZWVuIGluaXRpYWxpemVkLiAqL1xuY29uc3QgbWF0UmlwcGxlVW5pbml0aWFsaXplZCA9ICdtYXQtcmlwcGxlLWxvYWRlci11bmluaXRpYWxpemVkJztcblxuLyoqIEFkZGl0aW9uYWwgY2xhc3NlcyB0aGF0IHNob3VsZCBiZSBhZGRlZCB0byB0aGUgcmlwcGxlIHdoZW4gaXQgaXMgcmVuZGVyZWQuICovXG5jb25zdCBtYXRSaXBwbGVDbGFzc05hbWUgPSAnbWF0LXJpcHBsZS1sb2FkZXItY2xhc3MtbmFtZSc7XG5cbi8qKiBXaGV0aGVyIHRoZSByaXBwbGUgc2hvdWxkIGJlIGNlbnRlcmVkLiAqL1xuY29uc3QgbWF0UmlwcGxlQ2VudGVyZWQgPSAnbWF0LXJpcHBsZS1sb2FkZXItY2VudGVyZWQnO1xuXG4vKiogV2hldGhlciB0aGUgcmlwcGxlIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbmNvbnN0IG1hdFJpcHBsZURpc2FibGVkID0gJ21hdC1yaXBwbGUtbG9hZGVyLWRpc2FibGVkJztcblxuLyoqXG4gKiBIYW5kbGVzIGF0dGFjaGluZyByaXBwbGVzIG9uIGRlbWFuZC5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3dzIHVzIHRvIGF2b2lkIGVhZ2VybHkgY3JlYXRpbmcgJiBhdHRhY2hpbmcgTWF0UmlwcGxlcy5cbiAqIEl0IHdvcmtzIGJ5IGNyZWF0aW5nICYgYXR0YWNoaW5nIGEgcmlwcGxlIG9ubHkgd2hlbiBhIGNvbXBvbmVudCBpcyBmaXJzdCBpbnRlcmFjdGVkIHdpdGguXG4gKlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNYXRSaXBwbGVMb2FkZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9kb2N1bWVudCA9IGluamVjdChET0NVTUVOVCwge29wdGlvbmFsOiB0cnVlfSk7XG4gIHByaXZhdGUgX2FuaW1hdGlvbk1vZGUgPSBpbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFLCB7b3B0aW9uYWw6IHRydWV9KTtcbiAgcHJpdmF0ZSBfZ2xvYmFsUmlwcGxlT3B0aW9ucyA9IGluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLCB7b3B0aW9uYWw6IHRydWV9KTtcbiAgcHJpdmF0ZSBfcGxhdGZvcm0gPSBpbmplY3QoUGxhdGZvcm0pO1xuICBwcml2YXRlIF9uZ1pvbmUgPSBpbmplY3QoTmdab25lKTtcbiAgcHJpdmF0ZSBfaG9zdHMgPSBuZXcgTWFwPFxuICAgIEhUTUxFbGVtZW50LFxuICAgIHtyZW5kZXJlcjogUmlwcGxlUmVuZGVyZXI7IHRhcmdldDogUmlwcGxlVGFyZ2V0OyBoYXNTZXRVcEV2ZW50czogYm9vbGVhbn1cbiAgPigpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIHJpcHBsZUludGVyYWN0aW9uRXZlbnRzKSB7XG4gICAgICAgIHRoaXMuX2RvY3VtZW50Py5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCB0aGlzLl9vbkludGVyYWN0aW9uLCBldmVudExpc3RlbmVyT3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBjb25zdCBob3N0cyA9IHRoaXMuX2hvc3RzLmtleXMoKTtcblxuICAgIGZvciAoY29uc3QgaG9zdCBvZiBob3N0cykge1xuICAgICAgdGhpcy5kZXN0cm95UmlwcGxlKGhvc3QpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgZXZlbnQgb2YgcmlwcGxlSW50ZXJhY3Rpb25FdmVudHMpIHtcbiAgICAgIHRoaXMuX2RvY3VtZW50Py5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCB0aGlzLl9vbkludGVyYWN0aW9uLCBldmVudExpc3RlbmVyT3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgdGhlIHJpcHBsZSB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgYnkgdGhlIHJpcHBsZSBsb2FkZXIuXG4gICAqXG4gICAqIFN0b3JlcyB0aGUgZ2l2ZW4gaW5mb3JtYXRpb24gYWJvdXQgaG93IHRoZSByaXBwbGUgc2hvdWxkIGJlIGNvbmZpZ3VyZWQgb24gdGhlIGhvc3RcbiAgICogZWxlbWVudCBzbyB0aGF0IGl0IGNhbiBsYXRlciBiZSByZXRyaXZlZCAmIHVzZWQgd2hlbiB0aGUgcmlwcGxlIGlzIGFjdHVhbGx5IGNyZWF0ZWQuXG4gICAqL1xuICBjb25maWd1cmVSaXBwbGUoXG4gICAgaG9zdDogSFRNTEVsZW1lbnQsXG4gICAgY29uZmlnOiB7XG4gICAgICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gICAgICBjZW50ZXJlZD86IGJvb2xlYW47XG4gICAgICBkaXNhYmxlZD86IGJvb2xlYW47XG4gICAgfSxcbiAgKTogdm9pZCB7XG4gICAgLy8gSW5kaWNhdGVzIHRoYXQgdGhlIHJpcHBsZSBoYXMgbm90IHlldCBiZWVuIHJlbmRlcmVkIGZvciB0aGlzIGNvbXBvbmVudC5cbiAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVVbmluaXRpYWxpemVkLCB0aGlzLl9nbG9iYWxSaXBwbGVPcHRpb25zPy5uYW1lc3BhY2UgPz8gJycpO1xuXG4gICAgLy8gU3RvcmUgdGhlIGFkZGl0aW9uYWwgY2xhc3MgbmFtZShzKSB0aGF0IHNob3VsZCBiZSBhZGRlZCB0byB0aGUgcmlwcGxlIGVsZW1lbnQuXG4gICAgaWYgKGNvbmZpZy5jbGFzc05hbWUgfHwgIWhvc3QuaGFzQXR0cmlidXRlKG1hdFJpcHBsZUNsYXNzTmFtZSkpIHtcbiAgICAgIGhvc3Quc2V0QXR0cmlidXRlKG1hdFJpcHBsZUNsYXNzTmFtZSwgY29uZmlnLmNsYXNzTmFtZSB8fCAnJyk7XG4gICAgfVxuXG4gICAgLy8gU3RvcmUgd2hldGhlciB0aGUgcmlwcGxlIHNob3VsZCBiZSBjZW50ZXJlZC5cbiAgICBpZiAoY29uZmlnLmNlbnRlcmVkKSB7XG4gICAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVDZW50ZXJlZCwgJycpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuZGlzYWJsZWQpIHtcbiAgICAgIGhvc3Quc2V0QXR0cmlidXRlKG1hdFJpcHBsZURpc2FibGVkLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNldHMgdGhlIGRpc2FibGVkIHN0YXRlIG9uIHRoZSByaXBwbGUgaW5zdGFuY2UgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW4gaG9zdCBlbGVtZW50LiAqL1xuICBzZXREaXNhYmxlZChob3N0OiBIVE1MRWxlbWVudCwgZGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCByaXBwbGUgPSB0aGlzLl9ob3N0cy5nZXQoaG9zdCk7XG5cbiAgICAvLyBJZiB0aGUgcmlwcGxlIGhhcyBhbHJlYWR5IGJlZW4gaW5zdGFudGlhdGVkLCBqdXN0IGRpc2FibGUgaXQuXG4gICAgaWYgKHJpcHBsZSkge1xuICAgICAgcmlwcGxlLnRhcmdldC5yaXBwbGVEaXNhYmxlZCA9IGRpc2FibGVkO1xuXG4gICAgICBpZiAoIWRpc2FibGVkICYmICFyaXBwbGUuaGFzU2V0VXBFdmVudHMpIHtcbiAgICAgICAgcmlwcGxlLmhhc1NldFVwRXZlbnRzID0gdHJ1ZTtcbiAgICAgICAgcmlwcGxlLnJlbmRlcmVyLnNldHVwVHJpZ2dlckV2ZW50cyhob3N0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRpc2FibGVkKSB7XG4gICAgICAvLyBPdGhlcndpc2UsIHNldCBhbiBhdHRyaWJ1dGUgc28gd2Uga25vdyB3aGF0IHRoZVxuICAgICAgLy8gZGlzYWJsZWQgc3RhdGUgc2hvdWxkIGJlIHdoZW4gdGhlIHJpcHBsZSBpcyBpbml0aWFsaXplZC5cbiAgICAgIGhvc3Quc2V0QXR0cmlidXRlKG1hdFJpcHBsZURpc2FibGVkLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhvc3QucmVtb3ZlQXR0cmlidXRlKG1hdFJpcHBsZURpc2FibGVkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyBjcmVhdGluZyBhbmQgYXR0YWNoaW5nIGNvbXBvbmVudCBpbnRlcm5hbHNcbiAgICogd2hlbiBhIGNvbXBvbmVudCBpcyBpbml0aWFsbHkgaW50ZXJhY3RlZCB3aXRoLlxuICAgKi9cbiAgcHJpdmF0ZSBfb25JbnRlcmFjdGlvbiA9IChldmVudDogRXZlbnQpID0+IHtcbiAgICBjb25zdCBldmVudFRhcmdldCA9IF9nZXRFdmVudFRhcmdldChldmVudCk7XG5cbiAgICBpZiAoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgLy8gVE9ETyh3YWduZXJtYWNpZWwpOiBDb25zaWRlciBiYXRjaGluZyB0aGVzZSBldmVudHMgdG8gaW1wcm92ZSBydW50aW1lIHBlcmZvcm1hbmNlLlxuICAgICAgY29uc3QgZWxlbWVudCA9IGV2ZW50VGFyZ2V0LmNsb3Nlc3QoXG4gICAgICAgIGBbJHttYXRSaXBwbGVVbmluaXRpYWxpemVkfT1cIiR7dGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucz8ubmFtZXNwYWNlID8/ICcnfVwiXWAsXG4gICAgICApO1xuXG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICB0aGlzLl9jcmVhdGVSaXBwbGUoZWxlbWVudCBhcyBIVE1MRWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKiBDcmVhdGVzIGEgTWF0UmlwcGxlIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBnaXZlbiBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9jcmVhdGVSaXBwbGUoaG9zdDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2RvY3VtZW50IHx8IHRoaXMuX2hvc3RzLmhhcyhob3N0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSB0aGUgcmlwcGxlIGVsZW1lbnQuXG4gICAgaG9zdC5xdWVyeVNlbGVjdG9yKCcubWF0LXJpcHBsZScpPy5yZW1vdmUoKTtcbiAgICBjb25zdCByaXBwbGVFbCA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICByaXBwbGVFbC5jbGFzc0xpc3QuYWRkKCdtYXQtcmlwcGxlJywgaG9zdC5nZXRBdHRyaWJ1dGUobWF0UmlwcGxlQ2xhc3NOYW1lKSEpO1xuICAgIGhvc3QuYXBwZW5kKHJpcHBsZUVsKTtcblxuICAgIGNvbnN0IGlzTm9vcEFuaW1hdGlvbnMgPSB0aGlzLl9hbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnO1xuICAgIGNvbnN0IGdsb2JhbE9wdGlvbnMgPSB0aGlzLl9nbG9iYWxSaXBwbGVPcHRpb25zO1xuICAgIGNvbnN0IGVudGVyRHVyYXRpb24gPSBpc05vb3BBbmltYXRpb25zXG4gICAgICA/IDBcbiAgICAgIDogZ2xvYmFsT3B0aW9ucz8uYW5pbWF0aW9uPy5lbnRlckR1cmF0aW9uID8/IGRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcuZW50ZXJEdXJhdGlvbjtcbiAgICBjb25zdCBleGl0RHVyYXRpb24gPSBpc05vb3BBbmltYXRpb25zXG4gICAgICA/IDBcbiAgICAgIDogZ2xvYmFsT3B0aW9ucz8uYW5pbWF0aW9uPy5leGl0RHVyYXRpb24gPz8gZGVmYXVsdFJpcHBsZUFuaW1hdGlvbkNvbmZpZy5leGl0RHVyYXRpb247XG4gICAgY29uc3QgdGFyZ2V0OiBSaXBwbGVUYXJnZXQgPSB7XG4gICAgICByaXBwbGVEaXNhYmxlZDpcbiAgICAgICAgaXNOb29wQW5pbWF0aW9ucyB8fCBnbG9iYWxPcHRpb25zPy5kaXNhYmxlZCB8fCBob3N0Lmhhc0F0dHJpYnV0ZShtYXRSaXBwbGVEaXNhYmxlZCksXG4gICAgICByaXBwbGVDb25maWc6IHtcbiAgICAgICAgY2VudGVyZWQ6IGhvc3QuaGFzQXR0cmlidXRlKG1hdFJpcHBsZUNlbnRlcmVkKSxcbiAgICAgICAgdGVybWluYXRlT25Qb2ludGVyVXA6IGdsb2JhbE9wdGlvbnM/LnRlcm1pbmF0ZU9uUG9pbnRlclVwLFxuICAgICAgICBhbmltYXRpb246IHtcbiAgICAgICAgICBlbnRlckR1cmF0aW9uLFxuICAgICAgICAgIGV4aXREdXJhdGlvbixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFJpcHBsZVJlbmRlcmVyKHRhcmdldCwgdGhpcy5fbmdab25lLCByaXBwbGVFbCwgdGhpcy5fcGxhdGZvcm0pO1xuICAgIGNvbnN0IGhhc1NldFVwRXZlbnRzID0gIXRhcmdldC5yaXBwbGVEaXNhYmxlZDtcblxuICAgIGlmIChoYXNTZXRVcEV2ZW50cykge1xuICAgICAgcmVuZGVyZXIuc2V0dXBUcmlnZ2VyRXZlbnRzKGhvc3QpO1xuICAgIH1cblxuICAgIHRoaXMuX2hvc3RzLnNldChob3N0LCB7XG4gICAgICB0YXJnZXQsXG4gICAgICByZW5kZXJlcixcbiAgICAgIGhhc1NldFVwRXZlbnRzLFxuICAgIH0pO1xuXG4gICAgaG9zdC5yZW1vdmVBdHRyaWJ1dGUobWF0UmlwcGxlVW5pbml0aWFsaXplZCk7XG4gIH1cblxuICBkZXN0cm95UmlwcGxlKGhvc3Q6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3QgcmlwcGxlID0gdGhpcy5faG9zdHMuZ2V0KGhvc3QpO1xuXG4gICAgaWYgKHJpcHBsZSkge1xuICAgICAgcmlwcGxlLnJlbmRlcmVyLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG4gICAgICB0aGlzLl9ob3N0cy5kZWxldGUoaG9zdCk7XG4gICAgfVxuICB9XG59XG4iXX0=