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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLWxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3ByaXZhdGUvcmlwcGxlLWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLHFCQUFxQixFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQWEsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzNGLE9BQU8sRUFDTCx5QkFBeUIsRUFDekIsY0FBYyxFQUVkLDRCQUE0QixHQUM3QixNQUFNLFdBQVcsQ0FBQztBQUNuQixPQUFPLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDOztBQUVoRSw2REFBNkQ7QUFDN0QsTUFBTSxvQkFBb0IsR0FBRyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQztBQUU3Qzs7OztHQUlHO0FBQ0gsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRW5GLHVGQUF1RjtBQUN2RixNQUFNLHNCQUFzQixHQUFHLGlDQUFpQyxDQUFDO0FBRWpFLGlGQUFpRjtBQUNqRixNQUFNLGtCQUFrQixHQUFHLDhCQUE4QixDQUFDO0FBRTFELDZDQUE2QztBQUM3QyxNQUFNLGlCQUFpQixHQUFHLDRCQUE0QixDQUFDO0FBRXZELDZDQUE2QztBQUM3QyxNQUFNLGlCQUFpQixHQUFHLDRCQUE0QixDQUFDO0FBRXZEOzs7Ozs7O0dBT0c7QUFFSCxNQUFNLE9BQU8sZUFBZTtJQVcxQjtRQVZRLGNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDL0MsbUJBQWMsR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNqRSx5QkFBb0IsR0FBRyxNQUFNLENBQUMseUJBQXlCLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUMzRSxjQUFTLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdCLFlBQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsV0FBTSxHQUFHLElBQUksR0FBRyxFQUdyQixDQUFDO1FBMkVKOzs7V0FHRztRQUNLLG1CQUFjLEdBQUcsQ0FBQyxLQUFZLEVBQUUsRUFBRTtZQUN4QyxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFM0MsSUFBSSxXQUFXLFlBQVksV0FBVyxFQUFFLENBQUM7Z0JBQ3ZDLHFGQUFxRjtnQkFDckYsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FDakMsSUFBSSxzQkFBc0IsS0FBSyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsU0FBUyxJQUFJLEVBQUUsSUFBSSxDQUM5RSxDQUFDO2dCQUVGLElBQUksT0FBTyxFQUFFLENBQUM7b0JBQ1osSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFzQixDQUFDLENBQUM7Z0JBQzdDLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQyxDQUFDO1FBekZBLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO1lBQ2xDLEtBQUssTUFBTSxLQUFLLElBQUksdUJBQXVCLEVBQUUsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3JGLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVqQyxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsQ0FBQztRQUVELEtBQUssTUFBTSxLQUFLLElBQUksdUJBQXVCLEVBQUUsQ0FBQztZQUM1QyxJQUFJLENBQUMsU0FBUyxFQUFFLG1CQUFtQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDeEYsQ0FBQztJQUNILENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGVBQWUsQ0FDYixJQUFpQixFQUNqQixNQUlDO1FBRUQsMEVBQTBFO1FBQzFFLElBQUksQ0FBQyxZQUFZLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixFQUFFLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUV0RixpRkFBaUY7UUFDakYsSUFBSSxNQUFNLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUM7WUFDL0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFFRCwrQ0FBK0M7UUFDL0MsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBRUQsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMzQyxDQUFDO0lBQ0gsQ0FBQztJQUVELDhGQUE4RjtJQUM5RixXQUFXLENBQUMsSUFBaUIsRUFBRSxRQUFpQjtRQUM5QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQyxnRUFBZ0U7UUFDaEUsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNYLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQztZQUV4QyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN4QyxNQUFNLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztnQkFDN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0gsQ0FBQzthQUFNLElBQUksUUFBUSxFQUFFLENBQUM7WUFDcEIsa0RBQWtEO1lBQ2xELDJEQUEyRDtZQUMzRCxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzFDLENBQUM7SUFDSCxDQUFDO0lBcUJELCtEQUErRDtJQUN2RCxhQUFhLENBQUMsSUFBaUI7UUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUM3QyxPQUFPO1FBQ1QsQ0FBQztRQUVELDZCQUE2QjtRQUM3QixJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQzVDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RELFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFFLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGNBQWMsS0FBSyxnQkFBZ0IsQ0FBQztRQUNsRSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUM7UUFDaEQsTUFBTSxhQUFhLEdBQUcsZ0JBQWdCO1lBQ3BDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsYUFBYSxJQUFJLDRCQUE0QixDQUFDLGFBQWEsQ0FBQztRQUMxRixNQUFNLFlBQVksR0FBRyxnQkFBZ0I7WUFDbkMsQ0FBQyxDQUFDLENBQUM7WUFDSCxDQUFDLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxZQUFZLElBQUksNEJBQTRCLENBQUMsWUFBWSxDQUFDO1FBQ3hGLE1BQU0sTUFBTSxHQUFpQjtZQUMzQixjQUFjLEVBQ1osZ0JBQWdCLElBQUksYUFBYSxFQUFFLFFBQVEsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDO1lBQ3JGLFlBQVksRUFBRTtnQkFDWixRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQztnQkFDOUMsb0JBQW9CLEVBQUUsYUFBYSxFQUFFLG9CQUFvQjtnQkFDekQsU0FBUyxFQUFFO29CQUNULGFBQWE7b0JBQ2IsWUFBWTtpQkFDYjthQUNGO1NBQ0YsQ0FBQztRQUVGLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDO1FBRTlDLElBQUksY0FBYyxFQUFFLENBQUM7WUFDbkIsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7WUFDcEIsTUFBTTtZQUNOLFFBQVE7WUFDUixjQUFjO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxhQUFhLENBQUMsSUFBaUI7UUFDN0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckMsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNYLE1BQU0sQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixDQUFDO0lBQ0gsQ0FBQztxSEEvSlUsZUFBZTt5SEFBZixlQUFlLGNBREgsTUFBTTs7a0dBQ2xCLGVBQWU7a0JBRDNCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRSwgSW5qZWN0YWJsZSwgTmdab25lLCBPbkRlc3Ryb3ksIGluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLFxuICBSaXBwbGVSZW5kZXJlcixcbiAgUmlwcGxlVGFyZ2V0LFxuICBkZWZhdWx0UmlwcGxlQW5pbWF0aW9uQ29uZmlnLFxufSBmcm9tICcuLi9yaXBwbGUnO1xuaW1wb3J0IHtQbGF0Zm9ybSwgX2dldEV2ZW50VGFyZ2V0fSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuXG4vKiogVGhlIG9wdGlvbnMgZm9yIHRoZSBNYXRSaXBwbGVMb2FkZXIncyBldmVudCBsaXN0ZW5lcnMuICovXG5jb25zdCBldmVudExpc3RlbmVyT3B0aW9ucyA9IHtjYXB0dXJlOiB0cnVlfTtcblxuLyoqXG4gKiBUaGUgZXZlbnRzIHRoYXQgc2hvdWxkIHRyaWdnZXIgdGhlIGluaXRpYWxpemF0aW9uIG9mIHRoZSByaXBwbGUuXG4gKiBOb3RlIHRoYXQgd2UgdXNlIGBtb3VzZWRvd25gLCByYXRoZXIgdGhhbiBgY2xpY2tgLCBmb3IgbW91c2UgZGV2aWNlcyBiZWNhdXNlXG4gKiB3ZSBjYW4ndCByZWx5IG9uIGBtb3VzZWVudGVyYCBpbiB0aGUgc2hhZG93IERPTSBhbmQgYGNsaWNrYCBoYXBwZW5zIHRvbyBsYXRlLlxuICovXG5jb25zdCByaXBwbGVJbnRlcmFjdGlvbkV2ZW50cyA9IFsnZm9jdXMnLCAnbW91c2Vkb3duJywgJ21vdXNlZW50ZXInLCAndG91Y2hzdGFydCddO1xuXG4vKiogVGhlIGF0dHJpYnV0ZSBhdHRhY2hlZCB0byBhIGNvbXBvbmVudCB3aG9zZSByaXBwbGUgaGFzIG5vdCB5ZXQgYmVlbiBpbml0aWFsaXplZC4gKi9cbmNvbnN0IG1hdFJpcHBsZVVuaW5pdGlhbGl6ZWQgPSAnbWF0LXJpcHBsZS1sb2FkZXItdW5pbml0aWFsaXplZCc7XG5cbi8qKiBBZGRpdGlvbmFsIGNsYXNzZXMgdGhhdCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIHJpcHBsZSB3aGVuIGl0IGlzIHJlbmRlcmVkLiAqL1xuY29uc3QgbWF0UmlwcGxlQ2xhc3NOYW1lID0gJ21hdC1yaXBwbGUtbG9hZGVyLWNsYXNzLW5hbWUnO1xuXG4vKiogV2hldGhlciB0aGUgcmlwcGxlIHNob3VsZCBiZSBjZW50ZXJlZC4gKi9cbmNvbnN0IG1hdFJpcHBsZUNlbnRlcmVkID0gJ21hdC1yaXBwbGUtbG9hZGVyLWNlbnRlcmVkJztcblxuLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBzaG91bGQgYmUgZGlzYWJsZWQuICovXG5jb25zdCBtYXRSaXBwbGVEaXNhYmxlZCA9ICdtYXQtcmlwcGxlLWxvYWRlci1kaXNhYmxlZCc7XG5cbi8qKlxuICogSGFuZGxlcyBhdHRhY2hpbmcgcmlwcGxlcyBvbiBkZW1hbmQuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB1cyB0byBhdm9pZCBlYWdlcmx5IGNyZWF0aW5nICYgYXR0YWNoaW5nIE1hdFJpcHBsZXMuXG4gKiBJdCB3b3JrcyBieSBjcmVhdGluZyAmIGF0dGFjaGluZyBhIHJpcHBsZSBvbmx5IHdoZW4gYSBjb21wb25lbnQgaXMgZmlyc3QgaW50ZXJhY3RlZCB3aXRoLlxuICpcbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0UmlwcGxlTG9hZGVyIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQsIHtvcHRpb25hbDogdHJ1ZX0pO1xuICBwcml2YXRlIF9hbmltYXRpb25Nb2RlID0gaW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSwge29wdGlvbmFsOiB0cnVlfSk7XG4gIHByaXZhdGUgX2dsb2JhbFJpcHBsZU9wdGlvbnMgPSBpbmplY3QoTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUywge29wdGlvbmFsOiB0cnVlfSk7XG4gIHByaXZhdGUgX3BsYXRmb3JtID0gaW5qZWN0KFBsYXRmb3JtKTtcbiAgcHJpdmF0ZSBfbmdab25lID0gaW5qZWN0KE5nWm9uZSk7XG4gIHByaXZhdGUgX2hvc3RzID0gbmV3IE1hcDxcbiAgICBIVE1MRWxlbWVudCxcbiAgICB7cmVuZGVyZXI6IFJpcHBsZVJlbmRlcmVyOyB0YXJnZXQ6IFJpcHBsZVRhcmdldDsgaGFzU2V0VXBFdmVudHM6IGJvb2xlYW59XG4gID4oKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBldmVudCBvZiByaXBwbGVJbnRlcmFjdGlvbkV2ZW50cykge1xuICAgICAgICB0aGlzLl9kb2N1bWVudD8uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgdGhpcy5fb25JbnRlcmFjdGlvbiwgZXZlbnRMaXN0ZW5lck9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgY29uc3QgaG9zdHMgPSB0aGlzLl9ob3N0cy5rZXlzKCk7XG5cbiAgICBmb3IgKGNvbnN0IGhvc3Qgb2YgaG9zdHMpIHtcbiAgICAgIHRoaXMuZGVzdHJveVJpcHBsZShob3N0KTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIHJpcHBsZUludGVyYWN0aW9uRXZlbnRzKSB7XG4gICAgICB0aGlzLl9kb2N1bWVudD8ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgdGhpcy5fb25JbnRlcmFjdGlvbiwgZXZlbnRMaXN0ZW5lck9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSByaXBwbGUgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGJ5IHRoZSByaXBwbGUgbG9hZGVyLlxuICAgKlxuICAgKiBTdG9yZXMgdGhlIGdpdmVuIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0aGUgcmlwcGxlIHNob3VsZCBiZSBjb25maWd1cmVkIG9uIHRoZSBob3N0XG4gICAqIGVsZW1lbnQgc28gdGhhdCBpdCBjYW4gbGF0ZXIgYmUgcmV0cml2ZWQgJiB1c2VkIHdoZW4gdGhlIHJpcHBsZSBpcyBhY3R1YWxseSBjcmVhdGVkLlxuICAgKi9cbiAgY29uZmlndXJlUmlwcGxlKFxuICAgIGhvc3Q6IEhUTUxFbGVtZW50LFxuICAgIGNvbmZpZzoge1xuICAgICAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICAgICAgY2VudGVyZWQ/OiBib29sZWFuO1xuICAgICAgZGlzYWJsZWQ/OiBib29sZWFuO1xuICAgIH0sXG4gICk6IHZvaWQge1xuICAgIC8vIEluZGljYXRlcyB0aGF0IHRoZSByaXBwbGUgaGFzIG5vdCB5ZXQgYmVlbiByZW5kZXJlZCBmb3IgdGhpcyBjb21wb25lbnQuXG4gICAgaG9zdC5zZXRBdHRyaWJ1dGUobWF0UmlwcGxlVW5pbml0aWFsaXplZCwgdGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucz8ubmFtZXNwYWNlID8/ICcnKTtcblxuICAgIC8vIFN0b3JlIHRoZSBhZGRpdGlvbmFsIGNsYXNzIG5hbWUocykgdGhhdCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIHJpcHBsZSBlbGVtZW50LlxuICAgIGlmIChjb25maWcuY2xhc3NOYW1lIHx8ICFob3N0Lmhhc0F0dHJpYnV0ZShtYXRSaXBwbGVDbGFzc05hbWUpKSB7XG4gICAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVDbGFzc05hbWUsIGNvbmZpZy5jbGFzc05hbWUgfHwgJycpO1xuICAgIH1cblxuICAgIC8vIFN0b3JlIHdoZXRoZXIgdGhlIHJpcHBsZSBzaG91bGQgYmUgY2VudGVyZWQuXG4gICAgaWYgKGNvbmZpZy5jZW50ZXJlZCkge1xuICAgICAgaG9zdC5zZXRBdHRyaWJ1dGUobWF0UmlwcGxlQ2VudGVyZWQsICcnKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmRpc2FibGVkKSB7XG4gICAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVEaXNhYmxlZCwgJycpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBvbiB0aGUgcmlwcGxlIGluc3RhbmNlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIGhvc3QgZWxlbWVudC4gKi9cbiAgc2V0RGlzYWJsZWQoaG9zdDogSFRNTEVsZW1lbnQsIGRpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgcmlwcGxlID0gdGhpcy5faG9zdHMuZ2V0KGhvc3QpO1xuXG4gICAgLy8gSWYgdGhlIHJpcHBsZSBoYXMgYWxyZWFkeSBiZWVuIGluc3RhbnRpYXRlZCwganVzdCBkaXNhYmxlIGl0LlxuICAgIGlmIChyaXBwbGUpIHtcbiAgICAgIHJpcHBsZS50YXJnZXQucmlwcGxlRGlzYWJsZWQgPSBkaXNhYmxlZDtcblxuICAgICAgaWYgKCFkaXNhYmxlZCAmJiAhcmlwcGxlLmhhc1NldFVwRXZlbnRzKSB7XG4gICAgICAgIHJpcHBsZS5oYXNTZXRVcEV2ZW50cyA9IHRydWU7XG4gICAgICAgIHJpcHBsZS5yZW5kZXJlci5zZXR1cFRyaWdnZXJFdmVudHMoaG9zdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkaXNhYmxlZCkge1xuICAgICAgLy8gT3RoZXJ3aXNlLCBzZXQgYW4gYXR0cmlidXRlIHNvIHdlIGtub3cgd2hhdCB0aGVcbiAgICAgIC8vIGRpc2FibGVkIHN0YXRlIHNob3VsZCBiZSB3aGVuIHRoZSByaXBwbGUgaXMgaW5pdGlhbGl6ZWQuXG4gICAgICBob3N0LnNldEF0dHJpYnV0ZShtYXRSaXBwbGVEaXNhYmxlZCwgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBob3N0LnJlbW92ZUF0dHJpYnV0ZShtYXRSaXBwbGVEaXNhYmxlZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgY3JlYXRpbmcgYW5kIGF0dGFjaGluZyBjb21wb25lbnQgaW50ZXJuYWxzXG4gICAqIHdoZW4gYSBjb21wb25lbnQgaXMgaW5pdGlhbGx5IGludGVyYWN0ZWQgd2l0aC5cbiAgICovXG4gIHByaXZhdGUgX29uSW50ZXJhY3Rpb24gPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgY29uc3QgZXZlbnRUYXJnZXQgPSBfZ2V0RXZlbnRUYXJnZXQoZXZlbnQpO1xuXG4gICAgaWYgKGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIC8vIFRPRE8od2FnbmVybWFjaWVsKTogQ29uc2lkZXIgYmF0Y2hpbmcgdGhlc2UgZXZlbnRzIHRvIGltcHJvdmUgcnVudGltZSBwZXJmb3JtYW5jZS5cbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBldmVudFRhcmdldC5jbG9zZXN0KFxuICAgICAgICBgWyR7bWF0UmlwcGxlVW5pbml0aWFsaXplZH09XCIke3RoaXMuX2dsb2JhbFJpcHBsZU9wdGlvbnM/Lm5hbWVzcGFjZSA/PyAnJ31cIl1gLFxuICAgICAgKTtcblxuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5fY3JlYXRlUmlwcGxlKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKiogQ3JlYXRlcyBhIE1hdFJpcHBsZSBhbmQgYXBwZW5kcyBpdCB0byB0aGUgZ2l2ZW4gZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfY3JlYXRlUmlwcGxlKGhvc3Q6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9kb2N1bWVudCB8fCB0aGlzLl9ob3N0cy5oYXMoaG9zdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgdGhlIHJpcHBsZSBlbGVtZW50LlxuICAgIGhvc3QucXVlcnlTZWxlY3RvcignLm1hdC1yaXBwbGUnKT8ucmVtb3ZlKCk7XG4gICAgY29uc3QgcmlwcGxlRWwgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcmlwcGxlRWwuY2xhc3NMaXN0LmFkZCgnbWF0LXJpcHBsZScsIGhvc3QuZ2V0QXR0cmlidXRlKG1hdFJpcHBsZUNsYXNzTmFtZSkhKTtcbiAgICBob3N0LmFwcGVuZChyaXBwbGVFbCk7XG5cbiAgICBjb25zdCBpc05vb3BBbmltYXRpb25zID0gdGhpcy5fYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJztcbiAgICBjb25zdCBnbG9iYWxPcHRpb25zID0gdGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucztcbiAgICBjb25zdCBlbnRlckR1cmF0aW9uID0gaXNOb29wQW5pbWF0aW9uc1xuICAgICAgPyAwXG4gICAgICA6IGdsb2JhbE9wdGlvbnM/LmFuaW1hdGlvbj8uZW50ZXJEdXJhdGlvbiA/PyBkZWZhdWx0UmlwcGxlQW5pbWF0aW9uQ29uZmlnLmVudGVyRHVyYXRpb247XG4gICAgY29uc3QgZXhpdER1cmF0aW9uID0gaXNOb29wQW5pbWF0aW9uc1xuICAgICAgPyAwXG4gICAgICA6IGdsb2JhbE9wdGlvbnM/LmFuaW1hdGlvbj8uZXhpdER1cmF0aW9uID8/IGRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcuZXhpdER1cmF0aW9uO1xuICAgIGNvbnN0IHRhcmdldDogUmlwcGxlVGFyZ2V0ID0ge1xuICAgICAgcmlwcGxlRGlzYWJsZWQ6XG4gICAgICAgIGlzTm9vcEFuaW1hdGlvbnMgfHwgZ2xvYmFsT3B0aW9ucz8uZGlzYWJsZWQgfHwgaG9zdC5oYXNBdHRyaWJ1dGUobWF0UmlwcGxlRGlzYWJsZWQpLFxuICAgICAgcmlwcGxlQ29uZmlnOiB7XG4gICAgICAgIGNlbnRlcmVkOiBob3N0Lmhhc0F0dHJpYnV0ZShtYXRSaXBwbGVDZW50ZXJlZCksXG4gICAgICAgIHRlcm1pbmF0ZU9uUG9pbnRlclVwOiBnbG9iYWxPcHRpb25zPy50ZXJtaW5hdGVPblBvaW50ZXJVcCxcbiAgICAgICAgYW5pbWF0aW9uOiB7XG4gICAgICAgICAgZW50ZXJEdXJhdGlvbixcbiAgICAgICAgICBleGl0RHVyYXRpb24sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCByZW5kZXJlciA9IG5ldyBSaXBwbGVSZW5kZXJlcih0YXJnZXQsIHRoaXMuX25nWm9uZSwgcmlwcGxlRWwsIHRoaXMuX3BsYXRmb3JtKTtcbiAgICBjb25zdCBoYXNTZXRVcEV2ZW50cyA9ICF0YXJnZXQucmlwcGxlRGlzYWJsZWQ7XG5cbiAgICBpZiAoaGFzU2V0VXBFdmVudHMpIHtcbiAgICAgIHJlbmRlcmVyLnNldHVwVHJpZ2dlckV2ZW50cyhob3N0KTtcbiAgICB9XG5cbiAgICB0aGlzLl9ob3N0cy5zZXQoaG9zdCwge1xuICAgICAgdGFyZ2V0LFxuICAgICAgcmVuZGVyZXIsXG4gICAgICBoYXNTZXRVcEV2ZW50cyxcbiAgICB9KTtcblxuICAgIGhvc3QucmVtb3ZlQXR0cmlidXRlKG1hdFJpcHBsZVVuaW5pdGlhbGl6ZWQpO1xuICB9XG5cbiAgZGVzdHJveVJpcHBsZShob3N0OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IHJpcHBsZSA9IHRoaXMuX2hvc3RzLmdldChob3N0KTtcblxuICAgIGlmIChyaXBwbGUpIHtcbiAgICAgIHJpcHBsZS5yZW5kZXJlci5fcmVtb3ZlVHJpZ2dlckV2ZW50cygpO1xuICAgICAgdGhpcy5faG9zdHMuZGVsZXRlKGhvc3QpO1xuICAgIH1cbiAgfVxufVxuIl19