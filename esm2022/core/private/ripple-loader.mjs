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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0", ngImport: i0, type: MatRippleLoader, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.1.0", ngImport: i0, type: MatRippleLoader, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0", ngImport: i0, type: MatRippleLoader, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLWxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3ByaXZhdGUvcmlwcGxlLWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLHFCQUFxQixFQUNyQixVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFFTixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLHlCQUF5QixFQUFFLFNBQVMsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUMvRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7O0FBRS9DLDZEQUE2RDtBQUM3RCxNQUFNLG9CQUFvQixHQUFHLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO0FBRTdDLHVFQUF1RTtBQUN2RSxNQUFNLHVCQUF1QixHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFL0UsdUZBQXVGO0FBQ3ZGLE1BQU0sc0JBQXNCLEdBQUcsaUNBQWlDLENBQUM7QUFFakUsaUZBQWlGO0FBQ2pGLE1BQU0sa0JBQWtCLEdBQUcsOEJBQThCLENBQUM7QUFFMUQsNkNBQTZDO0FBQzdDLE1BQU0saUJBQWlCLEdBQUcsNEJBQTRCLENBQUM7QUFFdkQsNkNBQTZDO0FBQzdDLE1BQU0saUJBQWlCLEdBQUcsNEJBQTRCLENBQUM7QUFFdkQ7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sZUFBZTtJQU8xQjtRQU5RLGNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDL0MsbUJBQWMsR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUsRUFBQyxRQUFRLEVB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ZUFBZSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDNUMsSUFBWSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7SUFDbkMsQ0FBQzs4R0F6SFUsZUFBZTtrSEFBZixlQUFlLGNBREgsTUFBTTs7MkZBQ2xCLGVBQWU7a0JBRDNCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBTklNQVRJT05fTU9EVUxFX1RZUEUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdGFibGUsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBpbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLCBNYXRSaXBwbGV9IGZyb20gJy4uL3JpcHBsZSc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuXG4vKiogVGhlIG9wdGlvbnMgZm9yIHRoZSBNYXRSaXBwbGVMb2FkZXIncyBldmVudCBsaXN0ZW5lcnMuICovXG5jb25zdCBldmVudExpc3RlbmVyT3B0aW9ucyA9IHtjYXB0dXJlOiB0cnVlfTtcblxuLyoqIFRoZSBldmVudHMgdGhhdCBzaG91bGQgdHJpZ2dlciB0aGUgaW5pdGlhbGl6YXRpb24gb2YgdGhlIHJpcHBsZS4gKi9cbmNvbnN0IHJpcHBsZUludGVyYWN0aW9uRXZlbnRzID0gWydmb2N1cycsICdjbGljaycsICdtb3VzZWVudGVyJywgJ3RvdWNoc3RhcnQnXTtcblxuLyoqIFRoZSBhdHRyaWJ1dGUgYXR0YWNoZWQgdG8gYSBjb21wb25lbnQgd2hvc2UgcmlwcGxlIGhhcyBub3QgeWV0IGJlZW4gaW5pdGlhbGl6ZWQuICovXG5jb25zdCBtYXRSaXBwbGVVbmluaXRpYWxpemVkID0gJ21hdC1yaXBwbGUtbG9hZGVyLXVuaW5pdGlhbGl6ZWQnO1xuXG4vKiogQWRkaXRpb25hbCBjbGFzc2VzIHRoYXQgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSByaXBwbGUgd2hlbiBpdCBpcyByZW5kZXJlZC4gKi9cbmNvbnN0IG1hdFJpcHBsZUNsYXNzTmFtZSA9ICdtYXQtcmlwcGxlLWxvYWRlci1jbGFzcy1uYW1lJztcblxuLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBzaG91bGQgYmUgY2VudGVyZWQuICovXG5jb25zdCBtYXRSaXBwbGVDZW50ZXJlZCA9ICdtYXQtcmlwcGxlLWxvYWRlci1jZW50ZXJlZCc7XG5cbi8qKiBXaGV0aGVyIHRoZSByaXBwbGUgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuY29uc3QgbWF0UmlwcGxlRGlzYWJsZWQgPSAnbWF0LXJpcHBsZS1sb2FkZXItZGlzYWJsZWQnO1xuXG4vKipcbiAqIEhhbmRsZXMgYXR0YWNoaW5nIHJpcHBsZXMgb24gZGVtYW5kLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdXMgdG8gYXZvaWQgZWFnZXJseSBjcmVhdGluZyAmIGF0dGFjaGluZyBNYXRSaXBwbGVzLlxuICogSXQgd29ya3MgYnkgY3JlYXRpbmcgJiBhdHRhY2hpbmcgYSByaXBwbGUgb25seSB3aGVuIGEgY29tcG9uZW50IGlzIGZpcnN0IGludGVyYWN0ZWQgd2l0aC5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0UmlwcGxlTG9hZGVyIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQsIHtvcHRpb25hbDogdHJ1ZX0pO1xuICBwcml2YXRlIF9hbmltYXRpb25Nb2RlID0gaW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSwge29wdGlvbmFsOiB0cnVlfSk7XG4gIHByaXZhdGUgX2dsb2JhbFJpcHBsZU9wdGlvbnMgPSBpbmplY3QoTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUywge29wdGlvbmFsOiB0cnVlfSk7XG4gIHByaXZhdGUgX3BsYXRmb3JtID0gaW5qZWN0KFBsYXRmb3JtKTtcbiAgcHJpdmF0ZSBfbmdab25lID0gaW5qZWN0KE5nWm9uZSk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgcmlwcGxlSW50ZXJhY3Rpb25FdmVudHMpIHtcbiAgICAgICAgdGhpcy5fZG9jdW1lbnQ/LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIHRoaXMuX29uSW50ZXJhY3Rpb24sIGV2ZW50TGlzdGVuZXJPcHRpb25zKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGZvciAoY29uc3QgZXZlbnQgb2YgcmlwcGxlSW50ZXJhY3Rpb25FdmVudHMpIHtcbiAgICAgIHRoaXMuX2RvY3VtZW50Py5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCB0aGlzLl9vbkludGVyYWN0aW9uLCBldmVudExpc3RlbmVyT3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgdGhlIHJpcHBsZSB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgYnkgdGhlIHJpcHBsZSBsb2FkZXIuXG4gICAqXG4gICAqIFN0b3JlcyB0aGUgZ2l2ZW4gaW5mb3JtYXRpb24gYWJvdXQgaG93IHRoZSByaXBwbGUgc2hvdWxkIGJlIGNvbmZpZ3VyZWQgb24gdGhlIGhvc3RcbiAgICogZWxlbWVudCBzbyB0aGF0IGl0IGNhbiBsYXRlciBiZSByZXRyaXZlZCAmIHVzZWQgd2hlbiB0aGUgcmlwcGxlIGlzIGFjdHVhbGx5IGNyZWF0ZWQuXG4gICAqL1xuICBjb25maWd1cmVSaXBwbGUoXG4gICAgaG9zdDogSFRNTEVsZW1lbnQsXG4gICAgY29uZmlnOiB7XG4gICAgICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gICAgICBjZW50ZXJlZD86IGJvb2xlYW47XG4gICAgfSxcbiAgKTogdm9pZCB7XG4gICAgLy8gSW5kaWNhdGVzIHRoYXQgdGhlIHJpcHBsZSBoYXMgbm90IHlldCBiZWVuIHJlbmRlcmVkIGZvciB0aGlzIGNvbXBvbmVudC5cbiAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVVbmluaXRpYWxpemVkLCAnJyk7XG5cbiAgICAvLyBTdG9yZSB0aGUgYWRkaXRpb25hbCBjbGFzcyBuYW1lKHMpIHRoYXQgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSByaXBwbGUgZWxlbWVudC5cbiAgICBpZiAoY29uZmlnLmNsYXNzTmFtZSB8fCAhaG9zdC5oYXNBdHRyaWJ1dGUobWF0UmlwcGxlQ2xhc3NOYW1lKSkge1xuICAgICAgaG9zdC5zZXRBdHRyaWJ1dGUobWF0UmlwcGxlQ2xhc3NOYW1lLCBjb25maWcuY2xhc3NOYW1lIHx8ICcnKTtcbiAgICB9XG5cbiAgICAvLyBTdG9yZSB3aGV0aGVyIHRoZSByaXBwbGUgc2hvdWxkIGJlIGNlbnRlcmVkLlxuICAgIGlmIChjb25maWcuY2VudGVyZWQpIHtcbiAgICAgIGhvc3Quc2V0QXR0cmlidXRlKG1hdFJpcHBsZUNlbnRlcmVkLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHJpcHBsZSBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGhvc3QgZWxlbWVudC4gKi9cbiAgZ2V0UmlwcGxlKGhvc3Q6IEhUTUxFbGVtZW50KTogTWF0UmlwcGxlIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoKGhvc3QgYXMgYW55KS5tYXRSaXBwbGUpIHtcbiAgICAgIHJldHVybiAoaG9zdCBhcyBhbnkpLm1hdFJpcHBsZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlUmlwcGxlKGhvc3QpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGRpc2FibGVkIHN0YXRlIG9uIHRoZSByaXBwbGUgaW5zdGFuY2UgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW4gaG9zdCBlbGVtZW50LiAqL1xuICBzZXREaXNhYmxlZChob3N0OiBIVE1MRWxlbWVudCwgZGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCByaXBwbGUgPSAoaG9zdCBhcyBhbnkpLm1hdFJpcHBsZSBhcyBNYXRSaXBwbGUgfCB1bmRlZmluZWQ7XG5cbiAgICAvLyBJZiB0aGUgcmlwcGxlIGhhcyBhbHJlYWR5IGJlZW4gaW5zdGFudGlhdGVkLCBqdXN0IGRpc2FibGUgaXQuXG4gICAgaWYgKHJpcHBsZSkge1xuICAgICAgcmlwcGxlLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlLCBzZXQgYW4gYXR0cmlidXRlIHNvIHdlIGtub3cgd2hhdCB0aGVcbiAgICAvLyBkaXNhYmxlZCBzdGF0ZSBzaG91bGQgYmUgd2hlbiB0aGUgcmlwcGxlIGlzIGluaXRpYWxpemVkLlxuICAgIGlmIChkaXNhYmxlZCkge1xuICAgICAgaG9zdC5zZXRBdHRyaWJ1dGUobWF0UmlwcGxlRGlzYWJsZWQsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaG9zdC5yZW1vdmVBdHRyaWJ1dGUobWF0UmlwcGxlRGlzYWJsZWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGNyZWF0aW5nIGFuZCBhdHRhY2hpbmcgY29tcG9uZW50IGludGVybmFscyB3aGVuIGEgY29tcG9uZW50IGl0IGlzIGluaXRpYWxseSBpbnRlcmFjdGVkIHdpdGguICovXG4gIHByaXZhdGUgX29uSW50ZXJhY3Rpb24gPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgaWYgKCEoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGV2ZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgLy8gVE9ETyh3YWduZXJtYWNpZWwpOiBDb25zaWRlciBiYXRjaGluZyB0aGVzZSBldmVudHMgdG8gaW1wcm92ZSBydW50aW1lIHBlcmZvcm1hbmNlLlxuXG4gICAgY29uc3QgZWxlbWVudCA9IGV2ZW50VGFyZ2V0LmNsb3Nlc3QoYFske21hdFJpcHBsZVVuaW5pdGlhbGl6ZWR9XWApO1xuICAgIGlmIChlbGVtZW50KSB7XG4gICAgICB0aGlzLmNyZWF0ZVJpcHBsZShlbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICB9XG4gIH07XG5cbiAgLyoqIENyZWF0ZXMgYSBNYXRSaXBwbGUgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIGdpdmVuIGVsZW1lbnQuICovXG4gIGNyZWF0ZVJpcHBsZShob3N0OiBIVE1MRWxlbWVudCk6IE1hdFJpcHBsZSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCF0aGlzLl9kb2N1bWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSB0aGUgcmlwcGxlIGVsZW1lbnQuXG4gICAgaG9zdC5xdWVyeVNlbGVjdG9yKCcubWF0LXJpcHBsZScpPy5yZW1vdmUoKTtcbiAgICBjb25zdCByaXBwbGVFbCA9IHRoaXMuX2RvY3VtZW50IS5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcmlwcGxlRWwuY2xhc3NMaXN0LmFkZCgnbWF0LXJpcHBsZScsIGhvc3QuZ2V0QXR0cmlidXRlKG1hdFJpcHBsZUNsYXNzTmFtZSkhKTtcbiAgICBob3N0LmFwcGVuZChyaXBwbGVFbCk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIE1hdFJpcHBsZS5cbiAgICBjb25zdCByaXBwbGUgPSBuZXcgTWF0UmlwcGxlKFxuICAgICAgbmV3IEVsZW1lbnRSZWYocmlwcGxlRWwpLFxuICAgICAgdGhpcy5fbmdab25lLFxuICAgICAgdGhpcy5fcGxhdGZvcm0sXG4gICAgICB0aGlzLl9nbG9iYWxSaXBwbGVPcHRpb25zID8gdGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucyA6IHVuZGVmaW5lZCxcbiAgICAgIHRoaXMuX2FuaW1hdGlvbk1vZGUgPyB0aGlzLl9hbmltYXRpb25Nb2RlIDogdW5kZWZpbmVkLFxuICAgICk7XG4gICAgcmlwcGxlLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICByaXBwbGUudHJpZ2dlciA9IGhvc3Q7XG4gICAgcmlwcGxlLmNlbnRlcmVkID0gaG9zdC5oYXNBdHRyaWJ1dGUobWF0UmlwcGxlQ2VudGVyZWQpO1xuICAgIHJpcHBsZS5kaXNhYmxlZCA9IGhvc3QuaGFzQXR0cmlidXRlKG1hdFJpcHBsZURpc2FibGVkKTtcbiAgICB0aGlzLmF0dGFjaFJpcHBsZShob3N0LCByaXBwbGUpO1xuICAgIHJldHVybiByaXBwbGU7XG4gIH1cblxuICBhdHRhY2hSaXBwbGUoaG9zdDogRWxlbWVudCwgcmlwcGxlOiBNYXRSaXBwbGUpOiB2b2lkIHtcbiAgICBob3N0LnJlbW92ZUF0dHJpYnV0ZShtYXRSaXBwbGVVbmluaXRpYWxpemVkKTtcbiAgICAoaG9zdCBhcyBhbnkpLm1hdFJpcHBsZSA9IHJpcHBsZTtcbiAgfVxufVxuIl19