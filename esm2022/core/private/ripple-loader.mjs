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
        /** Handles creating and attaching component internals when a component it is initially interacted with. */
        this._onInteraction = (event) => {
            if (!(event.target instanceof HTMLElement)) {
                return;
            }
            const eventTarget = event.target;
            // TODO(wagnermaciel): Consider batching these events to improve runtime performance.
            const element = eventTarget.closest(`[${matRippleUninitialized}="${this._globalRippleOptions?.namespace ?? ''}"]`);
            if (element) {
                this._createRipple(element);
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
    /** Returns the ripple instance for the given host element. */
    getRipple(host) {
        const ripple = this._hosts.get(host);
        return ripple || this._createRipple(host);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.1", ngImport: i0, type: MatRippleLoader, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.1", ngImport: i0, type: MatRippleLoader, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.1", ngImport: i0, type: MatRippleLoader, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLWxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3ByaXZhdGUvcmlwcGxlLWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLHFCQUFxQixFQUNyQixVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFFTixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLHlCQUF5QixFQUFFLFNBQVMsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUMvRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7O0FBRS9DLDZEQUE2RDtBQUM3RCxNQUFNLG9CQUFvQixHQUFHLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO0FBRTdDLHVFQUF1RTtBQUN2RSxNQUFNLHVCQUF1QixHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFL0UsdUZBQXVGO0FBQ3ZGLE1BQU0sc0JBQXNCLEdBQUcsaUNBQWlDLENBQUM7QUFFakUsaUZBQWlGO0FBQ2pGLE1BQU0sa0JBQWtCLEdBQUcsOEJBQThCLENBQUM7QUFFMUQsNkNBQTZDO0FBQzdDLE1BQU0saUJBQWlCLEdBQUcsNEJBQTRCLENBQUM7QUFFdkQsNkNBQTZDO0FBQzdDLE1BQU0saUJBQWlCLEdBQUcsNEJBQTRCLENBQUM7QUFFdkQ7Ozs7Ozs7R0FPRztBQUVILE1BQU0sT0FBTyxlQUFlO0lBUTFCO1FBUFEsY0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUMvQyxtQkFBYyxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxFQUFDLFFBQVEs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QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLENBQUM7SUFDSCxDQUFDO3FIQXJKVSxlQUFlO3lIQUFmLGVBQWUsY0FESCxNQUFNOztrR0FDbEIsZUFBZTtrQkFEM0IsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFOSU1BVElPTl9NT0RVTEVfVFlQRSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0YWJsZSxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsIE1hdFJpcHBsZX0gZnJvbSAnLi4vcmlwcGxlJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5cbi8qKiBUaGUgb3B0aW9ucyBmb3IgdGhlIE1hdFJpcHBsZUxvYWRlcidzIGV2ZW50IGxpc3RlbmVycy4gKi9cbmNvbnN0IGV2ZW50TGlzdGVuZXJPcHRpb25zID0ge2NhcHR1cmU6IHRydWV9O1xuXG4vKiogVGhlIGV2ZW50cyB0aGF0IHNob3VsZCB0cmlnZ2VyIHRoZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgcmlwcGxlLiAqL1xuY29uc3QgcmlwcGxlSW50ZXJhY3Rpb25FdmVudHMgPSBbJ2ZvY3VzJywgJ2NsaWNrJywgJ21vdXNlZW50ZXInLCAndG91Y2hzdGFydCddO1xuXG4vKiogVGhlIGF0dHJpYnV0ZSBhdHRhY2hlZCB0byBhIGNvbXBvbmVudCB3aG9zZSByaXBwbGUgaGFzIG5vdCB5ZXQgYmVlbiBpbml0aWFsaXplZC4gKi9cbmNvbnN0IG1hdFJpcHBsZVVuaW5pdGlhbGl6ZWQgPSAnbWF0LXJpcHBsZS1sb2FkZXItdW5pbml0aWFsaXplZCc7XG5cbi8qKiBBZGRpdGlvbmFsIGNsYXNzZXMgdGhhdCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIHJpcHBsZSB3aGVuIGl0IGlzIHJlbmRlcmVkLiAqL1xuY29uc3QgbWF0UmlwcGxlQ2xhc3NOYW1lID0gJ21hdC1yaXBwbGUtbG9hZGVyLWNsYXNzLW5hbWUnO1xuXG4vKiogV2hldGhlciB0aGUgcmlwcGxlIHNob3VsZCBiZSBjZW50ZXJlZC4gKi9cbmNvbnN0IG1hdFJpcHBsZUNlbnRlcmVkID0gJ21hdC1yaXBwbGUtbG9hZGVyLWNlbnRlcmVkJztcblxuLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBzaG91bGQgYmUgZGlzYWJsZWQuICovXG5jb25zdCBtYXRSaXBwbGVEaXNhYmxlZCA9ICdtYXQtcmlwcGxlLWxvYWRlci1kaXNhYmxlZCc7XG5cbi8qKlxuICogSGFuZGxlcyBhdHRhY2hpbmcgcmlwcGxlcyBvbiBkZW1hbmQuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB1cyB0byBhdm9pZCBlYWdlcmx5IGNyZWF0aW5nICYgYXR0YWNoaW5nIE1hdFJpcHBsZXMuXG4gKiBJdCB3b3JrcyBieSBjcmVhdGluZyAmIGF0dGFjaGluZyBhIHJpcHBsZSBvbmx5IHdoZW4gYSBjb21wb25lbnQgaXMgZmlyc3QgaW50ZXJhY3RlZCB3aXRoLlxuICpcbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0UmlwcGxlTG9hZGVyIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQsIHtvcHRpb25hbDogdHJ1ZX0pO1xuICBwcml2YXRlIF9hbmltYXRpb25Nb2RlID0gaW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSwge29wdGlvbmFsOiB0cnVlfSk7XG4gIHByaXZhdGUgX2dsb2JhbFJpcHBsZU9wdGlvbnMgPSBpbmplY3QoTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUywge29wdGlvbmFsOiB0cnVlfSk7XG4gIHByaXZhdGUgX3BsYXRmb3JtID0gaW5qZWN0KFBsYXRmb3JtKTtcbiAgcHJpdmF0ZSBfbmdab25lID0gaW5qZWN0KE5nWm9uZSk7XG4gIHByaXZhdGUgX2hvc3RzID0gbmV3IE1hcDxIVE1MRWxlbWVudCwgTWF0UmlwcGxlPigpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIHJpcHBsZUludGVyYWN0aW9uRXZlbnRzKSB7XG4gICAgICAgIHRoaXMuX2RvY3VtZW50Py5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCB0aGlzLl9vbkludGVyYWN0aW9uLCBldmVudExpc3RlbmVyT3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBob3N0cyA9IHRoaXMuX2hvc3RzLmtleXMoKTtcblxuICAgIGZvciAoY29uc3QgaG9zdCBvZiBob3N0cykge1xuICAgICAgdGhpcy5kZXN0cm95UmlwcGxlKGhvc3QpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgZXZlbnQgb2YgcmlwcGxlSW50ZXJhY3Rpb25FdmVudHMpIHtcbiAgICAgIHRoaXMuX2RvY3VtZW50Py5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCB0aGlzLl9vbkludGVyYWN0aW9uLCBldmVudExpc3RlbmVyT3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgdGhlIHJpcHBsZSB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgYnkgdGhlIHJpcHBsZSBsb2FkZXIuXG4gICAqXG4gICAqIFN0b3JlcyB0aGUgZ2l2ZW4gaW5mb3JtYXRpb24gYWJvdXQgaG93IHRoZSByaXBwbGUgc2hvdWxkIGJlIGNvbmZpZ3VyZWQgb24gdGhlIGhvc3RcbiAgICogZWxlbWVudCBzbyB0aGF0IGl0IGNhbiBsYXRlciBiZSByZXRyaXZlZCAmIHVzZWQgd2hlbiB0aGUgcmlwcGxlIGlzIGFjdHVhbGx5IGNyZWF0ZWQuXG4gICAqL1xuICBjb25maWd1cmVSaXBwbGUoXG4gICAgaG9zdDogSFRNTEVsZW1lbnQsXG4gICAgY29uZmlnOiB7XG4gICAgICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gICAgICBjZW50ZXJlZD86IGJvb2xlYW47XG4gICAgICBkaXNhYmxlZD86IGJvb2xlYW47XG4gICAgfSxcbiAgKTogdm9pZCB7XG4gICAgLy8gSW5kaWNhdGVzIHRoYXQgdGhlIHJpcHBsZSBoYXMgbm90IHlldCBiZWVuIHJlbmRlcmVkIGZvciB0aGlzIGNvbXBvbmVudC5cbiAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVVbmluaXRpYWxpemVkLCB0aGlzLl9nbG9iYWxSaXBwbGVPcHRpb25zPy5uYW1lc3BhY2UgPz8gJycpO1xuXG4gICAgLy8gU3RvcmUgdGhlIGFkZGl0aW9uYWwgY2xhc3MgbmFtZShzKSB0aGF0IHNob3VsZCBiZSBhZGRlZCB0byB0aGUgcmlwcGxlIGVsZW1lbnQuXG4gICAgaWYgKGNvbmZpZy5jbGFzc05hbWUgfHwgIWhvc3QuaGFzQXR0cmlidXRlKG1hdFJpcHBsZUNsYXNzTmFtZSkpIHtcbiAgICAgIGhvc3Quc2V0QXR0cmlidXRlKG1hdFJpcHBsZUNsYXNzTmFtZSwgY29uZmlnLmNsYXNzTmFtZSB8fCAnJyk7XG4gICAgfVxuXG4gICAgLy8gU3RvcmUgd2hldGhlciB0aGUgcmlwcGxlIHNob3VsZCBiZSBjZW50ZXJlZC5cbiAgICBpZiAoY29uZmlnLmNlbnRlcmVkKSB7XG4gICAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVDZW50ZXJlZCwgJycpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuZGlzYWJsZWQpIHtcbiAgICAgIGhvc3Quc2V0QXR0cmlidXRlKG1hdFJpcHBsZURpc2FibGVkLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHJpcHBsZSBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGhvc3QgZWxlbWVudC4gKi9cbiAgZ2V0UmlwcGxlKGhvc3Q6IEhUTUxFbGVtZW50KTogTWF0UmlwcGxlIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCByaXBwbGUgPSB0aGlzLl9ob3N0cy5nZXQoaG9zdCk7XG4gICAgcmV0dXJuIHJpcHBsZSB8fCB0aGlzLl9jcmVhdGVSaXBwbGUoaG9zdCk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgZGlzYWJsZWQgc3RhdGUgb24gdGhlIHJpcHBsZSBpbnN0YW5jZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlbiBob3N0IGVsZW1lbnQuICovXG4gIHNldERpc2FibGVkKGhvc3Q6IEhUTUxFbGVtZW50LCBkaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHJpcHBsZSA9IHRoaXMuX2hvc3RzLmdldChob3N0KTtcblxuICAgIC8vIElmIHRoZSByaXBwbGUgaGFzIGFscmVhZHkgYmVlbiBpbnN0YW50aWF0ZWQsIGp1c3QgZGlzYWJsZSBpdC5cbiAgICBpZiAocmlwcGxlKSB7XG4gICAgICByaXBwbGUuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIHNldCBhbiBhdHRyaWJ1dGUgc28gd2Uga25vdyB3aGF0IHRoZVxuICAgIC8vIGRpc2FibGVkIHN0YXRlIHNob3VsZCBiZSB3aGVuIHRoZSByaXBwbGUgaXMgaW5pdGlhbGl6ZWQuXG4gICAgaWYgKGRpc2FibGVkKSB7XG4gICAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVEaXNhYmxlZCwgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBob3N0LnJlbW92ZUF0dHJpYnV0ZShtYXRSaXBwbGVEaXNhYmxlZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgY3JlYXRpbmcgYW5kIGF0dGFjaGluZyBjb21wb25lbnQgaW50ZXJuYWxzIHdoZW4gYSBjb21wb25lbnQgaXQgaXMgaW5pdGlhbGx5IGludGVyYWN0ZWQgd2l0aC4gKi9cbiAgcHJpdmF0ZSBfb25JbnRlcmFjdGlvbiA9IChldmVudDogRXZlbnQpID0+IHtcbiAgICBpZiAoIShldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZXZlbnRUYXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAvLyBUT0RPKHdhZ25lcm1hY2llbCk6IENvbnNpZGVyIGJhdGNoaW5nIHRoZXNlIGV2ZW50cyB0byBpbXByb3ZlIHJ1bnRpbWUgcGVyZm9ybWFuY2UuXG5cbiAgICBjb25zdCBlbGVtZW50ID0gZXZlbnRUYXJnZXQuY2xvc2VzdChcbiAgICAgIGBbJHttYXRSaXBwbGVVbmluaXRpYWxpemVkfT1cIiR7dGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucz8ubmFtZXNwYWNlID8/ICcnfVwiXWAsXG4gICAgKTtcbiAgICBpZiAoZWxlbWVudCkge1xuICAgICAgdGhpcy5fY3JlYXRlUmlwcGxlKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpO1xuICAgIH1cbiAgfTtcblxuICAvKiogQ3JlYXRlcyBhIE1hdFJpcHBsZSBhbmQgYXBwZW5kcyBpdCB0byB0aGUgZ2l2ZW4gZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfY3JlYXRlUmlwcGxlKGhvc3Q6IEhUTUxFbGVtZW50KTogTWF0UmlwcGxlIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXRoaXMuX2RvY3VtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZXhpc3RpbmdSaXBwbGUgPSB0aGlzLl9ob3N0cy5nZXQoaG9zdCk7XG4gICAgaWYgKGV4aXN0aW5nUmlwcGxlKSB7XG4gICAgICByZXR1cm4gZXhpc3RpbmdSaXBwbGU7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIHRoZSByaXBwbGUgZWxlbWVudC5cbiAgICBob3N0LnF1ZXJ5U2VsZWN0b3IoJy5tYXQtcmlwcGxlJyk/LnJlbW92ZSgpO1xuICAgIGNvbnN0IHJpcHBsZUVsID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHJpcHBsZUVsLmNsYXNzTGlzdC5hZGQoJ21hdC1yaXBwbGUnLCBob3N0LmdldEF0dHJpYnV0ZShtYXRSaXBwbGVDbGFzc05hbWUpISk7XG4gICAgaG9zdC5hcHBlbmQocmlwcGxlRWwpO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBNYXRSaXBwbGUuXG4gICAgY29uc3QgcmlwcGxlID0gbmV3IE1hdFJpcHBsZShcbiAgICAgIG5ldyBFbGVtZW50UmVmKHJpcHBsZUVsKSxcbiAgICAgIHRoaXMuX25nWm9uZSxcbiAgICAgIHRoaXMuX3BsYXRmb3JtLFxuICAgICAgdGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucyA/IHRoaXMuX2dsb2JhbFJpcHBsZU9wdGlvbnMgOiB1bmRlZmluZWQsXG4gICAgICB0aGlzLl9hbmltYXRpb25Nb2RlID8gdGhpcy5fYW5pbWF0aW9uTW9kZSA6IHVuZGVmaW5lZCxcbiAgICApO1xuICAgIHJpcHBsZS5faXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgcmlwcGxlLnRyaWdnZXIgPSBob3N0O1xuICAgIHJpcHBsZS5jZW50ZXJlZCA9IGhvc3QuaGFzQXR0cmlidXRlKG1hdFJpcHBsZUNlbnRlcmVkKTtcbiAgICByaXBwbGUuZGlzYWJsZWQgPSBob3N0Lmhhc0F0dHJpYnV0ZShtYXRSaXBwbGVEaXNhYmxlZCk7XG4gICAgdGhpcy5hdHRhY2hSaXBwbGUoaG9zdCwgcmlwcGxlKTtcbiAgICByZXR1cm4gcmlwcGxlO1xuICB9XG5cbiAgYXR0YWNoUmlwcGxlKGhvc3Q6IEhUTUxFbGVtZW50LCByaXBwbGU6IE1hdFJpcHBsZSk6IHZvaWQge1xuICAgIGhvc3QucmVtb3ZlQXR0cmlidXRlKG1hdFJpcHBsZVVuaW5pdGlhbGl6ZWQpO1xuICAgIHRoaXMuX2hvc3RzLnNldChob3N0LCByaXBwbGUpO1xuICB9XG5cbiAgZGVzdHJveVJpcHBsZShob3N0OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHJpcHBsZSA9IHRoaXMuX2hvc3RzLmdldChob3N0KTtcblxuICAgIGlmIChyaXBwbGUpIHtcbiAgICAgIC8vIFNpbmNlIHRoaXMgZGlyZWN0aXZlIGlzIGNyZWF0ZWQgbWFudWFsbHksIGl0IG5lZWRzIHRvIGJlIGRlc3Ryb3llZCBtYW51YWxseSB0b28uXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tbGlmZWN5Y2xlLWludm9jYXRpb25cbiAgICAgIHJpcHBsZS5uZ09uRGVzdHJveSgpO1xuICAgICAgdGhpcy5faG9zdHMuZGVsZXRlKGhvc3QpO1xuICAgIH1cbiAgfVxufVxuIl19