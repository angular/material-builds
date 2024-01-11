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
            const element = eventTarget.closest(`[${matRippleUninitialized}]`);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatRippleLoader, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatRippleLoader, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatRippleLoader, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLWxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3ByaXZhdGUvcmlwcGxlLWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLHFCQUFxQixFQUNyQixVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFFTixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLHlCQUF5QixFQUFFLFNBQVMsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUMvRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7O0FBRS9DLDZEQUE2RDtBQUM3RCxNQUFNLG9CQUFvQixHQUFHLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO0FBRTdDLHVFQUF1RTtBQUN2RSxNQUFNLHVCQUF1QixHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFL0UsdUZBQXVGO0FBQ3ZGLE1BQU0sc0JBQXNCLEdBQUcsaUNBQWlDLENBQUM7QUFFakUsaUZBQWlGO0FBQ2pGLE1BQU0sa0JBQWtCLEdBQUcsOEJBQThCLENBQUM7QUFFMUQsNkNBQTZDO0FBQzdDLE1BQU0saUJBQWlCLEdBQUcsNEJBQTRCLENBQUM7QUFFdkQsNkNBQTZDO0FBQzdDLE1BQU0saUJBQWlCLEdBQUcsNEJBQTRCLENBQUM7QUFFdkQ7Ozs7Ozs7R0FPRztBQUVILE1BQU0sT0FBTyxlQUFlO0lBUTFCO1FBUFEsY0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUMvQyxtQkFBYyxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ2pFLHlCQUFvQixHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQzNFLGNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0IsWUFBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QixXQUFNLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7UUErRW5ELDJHQUEyRztRQUNuRyxtQkFBYyxHQUFHLENBQUMsS0FBWSxFQUFFLEVBQUU7WUFDeEMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sWUFBWSxXQUFXLENBQUMsRUFBRTtnQkFDMUMsT0FBTzthQUNSO1lBQ0QsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQXFCLENBQUM7WUFFaEQscUZBQXFGO1lBRXJGLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxzQkFBc0IsR0FBRyxDQUFDLENBQUM7WUFDbkUsSUFBSSxPQUFPLEVBQUU7Z0JBQ1gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFzQixDQUFDLENBQUM7YUFDNUM7UUFDSCxDQUFDLENBQUM7UUF6RkEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDbEMsS0FBSyxNQUFNLEtBQUssSUFBSSx1QkFBdUIsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO2FBQ3BGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNULE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFakMsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7WUFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQjtRQUVELEtBQUssTUFBTSxLQUFLLElBQUksdUJBQXVCLEVBQUU7WUFDM0MsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1NBQ3ZGO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsZUFBZSxDQUNiLElBQWlCLEVBQ2pCLE1BSUM7UUFFRCwwRUFBMEU7UUFDMUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUU5QyxpRkFBaUY7UUFDakYsSUFBSSxNQUFNLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO1lBQzlELElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUMvRDtRQUVELCtDQUErQztRQUMvQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUMxQztRQUVELElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUNuQixJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQzFDO0lBQ0gsQ0FBQztJQUVELDhEQUE4RDtJQUM5RCxTQUFTLENBQUMsSUFBaUI7UUFDekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsT0FBTyxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsOEZBQThGO0lBQzlGLFdBQVcsQ0FBQyxJQUFpQixFQUFFLFFBQWlCO1FBQzlDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJDLGdFQUFnRTtRQUNoRSxJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQzNCLE9BQU87U0FDUjtRQUVELGtEQUFrRDtRQUNsRCwyREFBMkQ7UUFDM0QsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQzFDO2FBQU07WUFDTCxJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDekM7SUFDSCxDQUFDO0lBaUJELCtEQUErRDtJQUN2RCxhQUFhLENBQUMsSUFBaUI7UUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsT0FBTztTQUNSO1FBRUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBSSxjQUFjLEVBQUU7WUFDbEIsT0FBTyxjQUFjLENBQUM7U0FDdkI7UUFFRCw2QkFBNkI7UUFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQztRQUM1QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RCxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBRSxDQUFDLENBQUM7UUFDN0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV0Qix3QkFBd0I7UUFDeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQzFCLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUN4QixJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxTQUFTLEVBQ2QsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFDakUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUN0RCxDQUFDO1FBQ0YsTUFBTSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDN0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDdEIsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEMsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFpQixFQUFFLE1BQWlCO1FBQy9DLElBQUksQ0FBQyxlQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELGFBQWEsQ0FBQyxJQUFpQjtRQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQyxJQUFJLE1BQU0sRUFBRTtZQUNWLG1GQUFtRjtZQUNuRixtREFBbUQ7WUFDbkQsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFCO0lBQ0gsQ0FBQzs4R0FuSlUsZUFBZTtrSEFBZixlQUFlLGNBREgsTUFBTTs7MkZBQ2xCLGVBQWU7a0JBRDNCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBTklNQVRJT05fTU9EVUxFX1RZUEUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdGFibGUsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBpbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLCBNYXRSaXBwbGV9IGZyb20gJy4uL3JpcHBsZSc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuXG4vKiogVGhlIG9wdGlvbnMgZm9yIHRoZSBNYXRSaXBwbGVMb2FkZXIncyBldmVudCBsaXN0ZW5lcnMuICovXG5jb25zdCBldmVudExpc3RlbmVyT3B0aW9ucyA9IHtjYXB0dXJlOiB0cnVlfTtcblxuLyoqIFRoZSBldmVudHMgdGhhdCBzaG91bGQgdHJpZ2dlciB0aGUgaW5pdGlhbGl6YXRpb24gb2YgdGhlIHJpcHBsZS4gKi9cbmNvbnN0IHJpcHBsZUludGVyYWN0aW9uRXZlbnRzID0gWydmb2N1cycsICdjbGljaycsICdtb3VzZWVudGVyJywgJ3RvdWNoc3RhcnQnXTtcblxuLyoqIFRoZSBhdHRyaWJ1dGUgYXR0YWNoZWQgdG8gYSBjb21wb25lbnQgd2hvc2UgcmlwcGxlIGhhcyBub3QgeWV0IGJlZW4gaW5pdGlhbGl6ZWQuICovXG5jb25zdCBtYXRSaXBwbGVVbmluaXRpYWxpemVkID0gJ21hdC1yaXBwbGUtbG9hZGVyLXVuaW5pdGlhbGl6ZWQnO1xuXG4vKiogQWRkaXRpb25hbCBjbGFzc2VzIHRoYXQgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSByaXBwbGUgd2hlbiBpdCBpcyByZW5kZXJlZC4gKi9cbmNvbnN0IG1hdFJpcHBsZUNsYXNzTmFtZSA9ICdtYXQtcmlwcGxlLWxvYWRlci1jbGFzcy1uYW1lJztcblxuLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBzaG91bGQgYmUgY2VudGVyZWQuICovXG5jb25zdCBtYXRSaXBwbGVDZW50ZXJlZCA9ICdtYXQtcmlwcGxlLWxvYWRlci1jZW50ZXJlZCc7XG5cbi8qKiBXaGV0aGVyIHRoZSByaXBwbGUgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuY29uc3QgbWF0UmlwcGxlRGlzYWJsZWQgPSAnbWF0LXJpcHBsZS1sb2FkZXItZGlzYWJsZWQnO1xuXG4vKipcbiAqIEhhbmRsZXMgYXR0YWNoaW5nIHJpcHBsZXMgb24gZGVtYW5kLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdXMgdG8gYXZvaWQgZWFnZXJseSBjcmVhdGluZyAmIGF0dGFjaGluZyBNYXRSaXBwbGVzLlxuICogSXQgd29ya3MgYnkgY3JlYXRpbmcgJiBhdHRhY2hpbmcgYSByaXBwbGUgb25seSB3aGVuIGEgY29tcG9uZW50IGlzIGZpcnN0IGludGVyYWN0ZWQgd2l0aC5cbiAqXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1hdFJpcHBsZUxvYWRlciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5ULCB7b3B0aW9uYWw6IHRydWV9KTtcbiAgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZSA9IGluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUsIHtvcHRpb25hbDogdHJ1ZX0pO1xuICBwcml2YXRlIF9nbG9iYWxSaXBwbGVPcHRpb25zID0gaW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsIHtvcHRpb25hbDogdHJ1ZX0pO1xuICBwcml2YXRlIF9wbGF0Zm9ybSA9IGluamVjdChQbGF0Zm9ybSk7XG4gIHByaXZhdGUgX25nWm9uZSA9IGluamVjdChOZ1pvbmUpO1xuICBwcml2YXRlIF9ob3N0cyA9IG5ldyBNYXA8SFRNTEVsZW1lbnQsIE1hdFJpcHBsZT4oKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBldmVudCBvZiByaXBwbGVJbnRlcmFjdGlvbkV2ZW50cykge1xuICAgICAgICB0aGlzLl9kb2N1bWVudD8uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgdGhpcy5fb25JbnRlcmFjdGlvbiwgZXZlbnRMaXN0ZW5lck9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3QgaG9zdHMgPSB0aGlzLl9ob3N0cy5rZXlzKCk7XG5cbiAgICBmb3IgKGNvbnN0IGhvc3Qgb2YgaG9zdHMpIHtcbiAgICAgIHRoaXMuZGVzdHJveVJpcHBsZShob3N0KTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIHJpcHBsZUludGVyYWN0aW9uRXZlbnRzKSB7XG4gICAgICB0aGlzLl9kb2N1bWVudD8ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgdGhpcy5fb25JbnRlcmFjdGlvbiwgZXZlbnRMaXN0ZW5lck9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSByaXBwbGUgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGJ5IHRoZSByaXBwbGUgbG9hZGVyLlxuICAgKlxuICAgKiBTdG9yZXMgdGhlIGdpdmVuIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0aGUgcmlwcGxlIHNob3VsZCBiZSBjb25maWd1cmVkIG9uIHRoZSBob3N0XG4gICAqIGVsZW1lbnQgc28gdGhhdCBpdCBjYW4gbGF0ZXIgYmUgcmV0cml2ZWQgJiB1c2VkIHdoZW4gdGhlIHJpcHBsZSBpcyBhY3R1YWxseSBjcmVhdGVkLlxuICAgKi9cbiAgY29uZmlndXJlUmlwcGxlKFxuICAgIGhvc3Q6IEhUTUxFbGVtZW50LFxuICAgIGNvbmZpZzoge1xuICAgICAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICAgICAgY2VudGVyZWQ/OiBib29sZWFuO1xuICAgICAgZGlzYWJsZWQ/OiBib29sZWFuO1xuICAgIH0sXG4gICk6IHZvaWQge1xuICAgIC8vIEluZGljYXRlcyB0aGF0IHRoZSByaXBwbGUgaGFzIG5vdCB5ZXQgYmVlbiByZW5kZXJlZCBmb3IgdGhpcyBjb21wb25lbnQuXG4gICAgaG9zdC5zZXRBdHRyaWJ1dGUobWF0UmlwcGxlVW5pbml0aWFsaXplZCwgJycpO1xuXG4gICAgLy8gU3RvcmUgdGhlIGFkZGl0aW9uYWwgY2xhc3MgbmFtZShzKSB0aGF0IHNob3VsZCBiZSBhZGRlZCB0byB0aGUgcmlwcGxlIGVsZW1lbnQuXG4gICAgaWYgKGNvbmZpZy5jbGFzc05hbWUgfHwgIWhvc3QuaGFzQXR0cmlidXRlKG1hdFJpcHBsZUNsYXNzTmFtZSkpIHtcbiAgICAgIGhvc3Quc2V0QXR0cmlidXRlKG1hdFJpcHBsZUNsYXNzTmFtZSwgY29uZmlnLmNsYXNzTmFtZSB8fCAnJyk7XG4gICAgfVxuXG4gICAgLy8gU3RvcmUgd2hldGhlciB0aGUgcmlwcGxlIHNob3VsZCBiZSBjZW50ZXJlZC5cbiAgICBpZiAoY29uZmlnLmNlbnRlcmVkKSB7XG4gICAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVDZW50ZXJlZCwgJycpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuZGlzYWJsZWQpIHtcbiAgICAgIGhvc3Quc2V0QXR0cmlidXRlKG1hdFJpcHBsZURpc2FibGVkLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHJpcHBsZSBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGhvc3QgZWxlbWVudC4gKi9cbiAgZ2V0UmlwcGxlKGhvc3Q6IEhUTUxFbGVtZW50KTogTWF0UmlwcGxlIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCByaXBwbGUgPSB0aGlzLl9ob3N0cy5nZXQoaG9zdCk7XG4gICAgcmV0dXJuIHJpcHBsZSB8fCB0aGlzLl9jcmVhdGVSaXBwbGUoaG9zdCk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgZGlzYWJsZWQgc3RhdGUgb24gdGhlIHJpcHBsZSBpbnN0YW5jZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlbiBob3N0IGVsZW1lbnQuICovXG4gIHNldERpc2FibGVkKGhvc3Q6IEhUTUxFbGVtZW50LCBkaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHJpcHBsZSA9IHRoaXMuX2hvc3RzLmdldChob3N0KTtcblxuICAgIC8vIElmIHRoZSByaXBwbGUgaGFzIGFscmVhZHkgYmVlbiBpbnN0YW50aWF0ZWQsIGp1c3QgZGlzYWJsZSBpdC5cbiAgICBpZiAocmlwcGxlKSB7XG4gICAgICByaXBwbGUuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIHNldCBhbiBhdHRyaWJ1dGUgc28gd2Uga25vdyB3aGF0IHRoZVxuICAgIC8vIGRpc2FibGVkIHN0YXRlIHNob3VsZCBiZSB3aGVuIHRoZSByaXBwbGUgaXMgaW5pdGlhbGl6ZWQuXG4gICAgaWYgKGRpc2FibGVkKSB7XG4gICAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVEaXNhYmxlZCwgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBob3N0LnJlbW92ZUF0dHJpYnV0ZShtYXRSaXBwbGVEaXNhYmxlZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgY3JlYXRpbmcgYW5kIGF0dGFjaGluZyBjb21wb25lbnQgaW50ZXJuYWxzIHdoZW4gYSBjb21wb25lbnQgaXQgaXMgaW5pdGlhbGx5IGludGVyYWN0ZWQgd2l0aC4gKi9cbiAgcHJpdmF0ZSBfb25JbnRlcmFjdGlvbiA9IChldmVudDogRXZlbnQpID0+IHtcbiAgICBpZiAoIShldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZXZlbnRUYXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAvLyBUT0RPKHdhZ25lcm1hY2llbCk6IENvbnNpZGVyIGJhdGNoaW5nIHRoZXNlIGV2ZW50cyB0byBpbXByb3ZlIHJ1bnRpbWUgcGVyZm9ybWFuY2UuXG5cbiAgICBjb25zdCBlbGVtZW50ID0gZXZlbnRUYXJnZXQuY2xvc2VzdChgWyR7bWF0UmlwcGxlVW5pbml0aWFsaXplZH1dYCk7XG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVJpcHBsZShlbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICB9XG4gIH07XG5cbiAgLyoqIENyZWF0ZXMgYSBNYXRSaXBwbGUgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIGdpdmVuIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX2NyZWF0ZVJpcHBsZShob3N0OiBIVE1MRWxlbWVudCk6IE1hdFJpcHBsZSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCF0aGlzLl9kb2N1bWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGV4aXN0aW5nUmlwcGxlID0gdGhpcy5faG9zdHMuZ2V0KGhvc3QpO1xuICAgIGlmIChleGlzdGluZ1JpcHBsZSkge1xuICAgICAgcmV0dXJuIGV4aXN0aW5nUmlwcGxlO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSB0aGUgcmlwcGxlIGVsZW1lbnQuXG4gICAgaG9zdC5xdWVyeVNlbGVjdG9yKCcubWF0LXJpcHBsZScpPy5yZW1vdmUoKTtcbiAgICBjb25zdCByaXBwbGVFbCA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICByaXBwbGVFbC5jbGFzc0xpc3QuYWRkKCdtYXQtcmlwcGxlJywgaG9zdC5nZXRBdHRyaWJ1dGUobWF0UmlwcGxlQ2xhc3NOYW1lKSEpO1xuICAgIGhvc3QuYXBwZW5kKHJpcHBsZUVsKTtcblxuICAgIC8vIENyZWF0ZSB0aGUgTWF0UmlwcGxlLlxuICAgIGNvbnN0IHJpcHBsZSA9IG5ldyBNYXRSaXBwbGUoXG4gICAgICBuZXcgRWxlbWVudFJlZihyaXBwbGVFbCksXG4gICAgICB0aGlzLl9uZ1pvbmUsXG4gICAgICB0aGlzLl9wbGF0Zm9ybSxcbiAgICAgIHRoaXMuX2dsb2JhbFJpcHBsZU9wdGlvbnMgPyB0aGlzLl9nbG9iYWxSaXBwbGVPcHRpb25zIDogdW5kZWZpbmVkLFxuICAgICAgdGhpcy5fYW5pbWF0aW9uTW9kZSA/IHRoaXMuX2FuaW1hdGlvbk1vZGUgOiB1bmRlZmluZWQsXG4gICAgKTtcbiAgICByaXBwbGUuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHJpcHBsZS50cmlnZ2VyID0gaG9zdDtcbiAgICByaXBwbGUuY2VudGVyZWQgPSBob3N0Lmhhc0F0dHJpYnV0ZShtYXRSaXBwbGVDZW50ZXJlZCk7XG4gICAgcmlwcGxlLmRpc2FibGVkID0gaG9zdC5oYXNBdHRyaWJ1dGUobWF0UmlwcGxlRGlzYWJsZWQpO1xuICAgIHRoaXMuYXR0YWNoUmlwcGxlKGhvc3QsIHJpcHBsZSk7XG4gICAgcmV0dXJuIHJpcHBsZTtcbiAgfVxuXG4gIGF0dGFjaFJpcHBsZShob3N0OiBIVE1MRWxlbWVudCwgcmlwcGxlOiBNYXRSaXBwbGUpOiB2b2lkIHtcbiAgICBob3N0LnJlbW92ZUF0dHJpYnV0ZShtYXRSaXBwbGVVbmluaXRpYWxpemVkKTtcbiAgICB0aGlzLl9ob3N0cy5zZXQoaG9zdCwgcmlwcGxlKTtcbiAgfVxuXG4gIGRlc3Ryb3lSaXBwbGUoaG9zdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCByaXBwbGUgPSB0aGlzLl9ob3N0cy5nZXQoaG9zdCk7XG5cbiAgICBpZiAocmlwcGxlKSB7XG4gICAgICAvLyBTaW5jZSB0aGlzIGRpcmVjdGl2ZSBpcyBjcmVhdGVkIG1hbnVhbGx5LCBpdCBuZWVkcyB0byBiZSBkZXN0cm95ZWQgbWFudWFsbHkgdG9vLlxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWxpZmVjeWNsZS1pbnZvY2F0aW9uXG4gICAgICByaXBwbGUubmdPbkRlc3Ryb3koKTtcbiAgICAgIHRoaXMuX2hvc3RzLmRlbGV0ZShob3N0KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==