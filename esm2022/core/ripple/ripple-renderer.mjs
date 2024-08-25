/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ChangeDetectionStrategy, ViewEncapsulation, } from '@angular/core';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { isFakeMousedownFromScreenReader, isFakeTouchstartFromScreenReader } from '@angular/cdk/a11y';
import { coerceElement } from '@angular/cdk/coercion';
import { _CdkPrivateStyleLoader } from '@angular/cdk/private';
import { RippleRef, RippleState } from './ripple-ref';
import { RippleEventManager } from './ripple-event-manager';
import * as i0 from "@angular/core";
/**
 * Default ripple animation configuration for ripples without an explicit
 * animation config specified.
 */
export const defaultRippleAnimationConfig = {
    enterDuration: 225,
    exitDuration: 150,
};
/**
 * Timeout for ignoring mouse events. Mouse events will be temporary ignored after touch
 * events to avoid synthetic mouse events.
 */
const ignoreMouseEventsTimeout = 800;
/** Options used to bind a passive capturing event. */
const passiveCapturingEventOptions = normalizePassiveListenerOptions({
    passive: true,
    capture: true,
});
/** Events that signal that the pointer is down. */
const pointerDownEvents = ['mousedown', 'touchstart'];
/** Events that signal that the pointer is up. */
const pointerUpEvents = ['mouseup', 'mouseleave', 'touchend', 'touchcancel'];
export class _MatRippleStylesLoader {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: _MatRippleStylesLoader, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0-next.2", type: _MatRippleStylesLoader, isStandalone: true, selector: "ng-component", host: { attributes: { "mat-ripple-style-loader": "" } }, ngImport: i0, template: '', isInline: true, styles: [".mat-ripple{overflow:hidden;position:relative}.mat-ripple:not(:empty){transform:translateZ(0)}.mat-ripple.mat-ripple-unbounded{overflow:visible}.mat-ripple-element{position:absolute;border-radius:50%;pointer-events:none;transition:opacity,transform 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale3d(0, 0, 0);background-color:var(--mat-ripple-color, color-mix(in srgb, var(--mat-app-on-surface) 10%, transparent))}.cdk-high-contrast-active .mat-ripple-element{display:none}.cdk-drag-preview .mat-ripple-element,.cdk-drag-placeholder .mat-ripple-element{display:none}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: _MatRippleStylesLoader, decorators: [{
            type: Component,
            args: [{ template: '', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, standalone: true, host: { 'mat-ripple-style-loader': '' }, styles: [".mat-ripple{overflow:hidden;position:relative}.mat-ripple:not(:empty){transform:translateZ(0)}.mat-ripple.mat-ripple-unbounded{overflow:visible}.mat-ripple-element{position:absolute;border-radius:50%;pointer-events:none;transition:opacity,transform 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale3d(0, 0, 0);background-color:var(--mat-ripple-color, color-mix(in srgb, var(--mat-app-on-surface) 10%, transparent))}.cdk-high-contrast-active .mat-ripple-element{display:none}.cdk-drag-preview .mat-ripple-element,.cdk-drag-placeholder .mat-ripple-element{display:none}"] }]
        }] });
/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple directive's host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 * This will eventually become a custom renderer once Angular support exists.
 * @docs-private
 */
export class RippleRenderer {
    static { this._eventManager = new RippleEventManager(); }
    constructor(_target, _ngZone, elementOrElementRef, _platform, injector) {
        this._target = _target;
        this._ngZone = _ngZone;
        this._platform = _platform;
        /** Whether the pointer is currently down or not. */
        this._isPointerDown = false;
        /**
         * Map of currently active ripple references.
         * The ripple reference is mapped to its element event listeners.
         * The reason why `| null` is used is that event listeners are added only
         * when the condition is truthy (see the `_startFadeOutTransition` method).
         */
        this._activeRipples = new Map();
        /** Whether pointer-up event listeners have been registered. */
        this._pointerUpEventsRegistered = false;
        // Only do anything if we're on the browser.
        if (_platform.isBrowser) {
            this._containerElement = coerceElement(elementOrElementRef);
        }
        if (injector) {
            injector.get(_CdkPrivateStyleLoader).load(_MatRippleStylesLoader);
        }
    }
    /**
     * Fades in a ripple at the given coordinates.
     * @param x Coordinate within the element, along the X axis at which to start the ripple.
     * @param y Coordinate within the element, along the Y axis at which to start the ripple.
     * @param config Extra ripple options.
     */
    fadeInRipple(x, y, config = {}) {
        const containerRect = (this._containerRect =
            this._containerRect || this._containerElement.getBoundingClientRect());
        const animationConfig = { ...defaultRippleAnimationConfig, ...config.animation };
        if (config.centered) {
            x = containerRect.left + containerRect.width / 2;
            y = containerRect.top + containerRect.height / 2;
        }
        const radius = config.radius || distanceToFurthestCorner(x, y, containerRect);
        const offsetX = x - containerRect.left;
        const offsetY = y - containerRect.top;
        const enterDuration = animationConfig.enterDuration;
        const ripple = document.createElement('div');
        ripple.classList.add('mat-ripple-element');
        ripple.style.left = `${offsetX - radius}px`;
        ripple.style.top = `${offsetY - radius}px`;
        ripple.style.height = `${radius * 2}px`;
        ripple.style.width = `${radius * 2}px`;
        // If a custom color has been specified, set it as inline style. If no color is
        // set, the default color will be applied through the ripple theme styles.
        if (config.color != null) {
            ripple.style.backgroundColor = config.color;
        }
        ripple.style.transitionDuration = `${enterDuration}ms`;
        this._containerElement.appendChild(ripple);
        // By default the browser does not recalculate the styles of dynamically created
        // ripple elements. This is critical to ensure that the `scale` animates properly.
        // We enforce a style recalculation by calling `getComputedStyle` and *accessing* a property.
        // See: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
        const computedStyles = window.getComputedStyle(ripple);
        const userTransitionProperty = computedStyles.transitionProperty;
        const userTransitionDuration = computedStyles.transitionDuration;
        // Note: We detect whether animation is forcibly disabled through CSS (e.g. through
        // `transition: none` or `display: none`). This is technically unexpected since animations are
        // controlled through the animation config, but this exists for backwards compatibility. This
        // logic does not need to be super accurate since it covers some edge cases which can be easily
        // avoided by users.
        const animationForciblyDisabledThroughCss = userTransitionProperty === 'none' ||
            // Note: The canonical unit for serialized CSS `<time>` properties is seconds. Additionally
            // some browsers expand the duration for every property (in our case `opacity` and `transform`).
            userTransitionDuration === '0s' ||
            userTransitionDuration === '0s, 0s' ||
            // If the container is 0x0, it's likely `display: none`.
            (containerRect.width === 0 && containerRect.height === 0);
        // Exposed reference to the ripple that will be returned.
        const rippleRef = new RippleRef(this, ripple, config, animationForciblyDisabledThroughCss);
        // Start the enter animation by setting the transform/scale to 100%. The animation will
        // execute as part of this statement because we forced a style recalculation before.
        // Note: We use a 3d transform here in order to avoid an issue in Safari where
        // the ripples aren't clipped when inside the shadow DOM (see #24028).
        ripple.style.transform = 'scale3d(1, 1, 1)';
        rippleRef.state = RippleState.FADING_IN;
        if (!config.persistent) {
            this._mostRecentTransientRipple = rippleRef;
        }
        let eventListeners = null;
        // Do not register the `transition` event listener if fade-in and fade-out duration
        // are set to zero. The events won't fire anyway and we can save resources here.
        if (!animationForciblyDisabledThroughCss && (enterDuration || animationConfig.exitDuration)) {
            this._ngZone.runOutsideAngular(() => {
                const onTransitionEnd = () => {
                    // Clear the fallback timer since the transition fired correctly.
                    if (eventListeners) {
                        eventListeners.fallbackTimer = null;
                    }
                    clearTimeout(fallbackTimer);
                    this._finishRippleTransition(rippleRef);
                };
                const onTransitionCancel = () => this._destroyRipple(rippleRef);
                // In some cases where there's a higher load on the browser, it can choose not to dispatch
                // neither `transitionend` nor `transitioncancel` (see b/227356674). This timer serves as a
                // fallback for such cases so that the ripple doesn't become stuck. We add a 100ms buffer
                // because timers aren't precise. Note that another approach can be to transition the ripple
                // to the `VISIBLE` state immediately above and to `FADING_IN` afterwards inside
                // `transitionstart`. We go with the timer because it's one less event listener and
                // it's less likely to break existing tests.
                const fallbackTimer = setTimeout(onTransitionCancel, enterDuration + 100);
                ripple.addEventListener('transitionend', onTransitionEnd);
                // If the transition is cancelled (e.g. due to DOM removal), we destroy the ripple
                // directly as otherwise we would keep it part of the ripple container forever.
                // https://www.w3.org/TR/css-transitions-1/#:~:text=no%20longer%20in%20the%20document.
                ripple.addEventListener('transitioncancel', onTransitionCancel);
                eventListeners = { onTransitionEnd, onTransitionCancel, fallbackTimer };
            });
        }
        // Add the ripple reference to the list of all active ripples.
        this._activeRipples.set(rippleRef, eventListeners);
        // In case there is no fade-in transition duration, we need to manually call the transition
        // end listener because `transitionend` doesn't fire if there is no transition.
        if (animationForciblyDisabledThroughCss || !enterDuration) {
            this._finishRippleTransition(rippleRef);
        }
        return rippleRef;
    }
    /** Fades out a ripple reference. */
    fadeOutRipple(rippleRef) {
        // For ripples already fading out or hidden, this should be a noop.
        if (rippleRef.state === RippleState.FADING_OUT || rippleRef.state === RippleState.HIDDEN) {
            return;
        }
        const rippleEl = rippleRef.element;
        const animationConfig = { ...defaultRippleAnimationConfig, ...rippleRef.config.animation };
        // This starts the fade-out transition and will fire the transition end listener that
        // removes the ripple element from the DOM.
        rippleEl.style.transitionDuration = `${animationConfig.exitDuration}ms`;
        rippleEl.style.opacity = '0';
        rippleRef.state = RippleState.FADING_OUT;
        // In case there is no fade-out transition duration, we need to manually call the
        // transition end listener because `transitionend` doesn't fire if there is no transition.
        if (rippleRef._animationForciblyDisabledThroughCss || !animationConfig.exitDuration) {
            this._finishRippleTransition(rippleRef);
        }
    }
    /** Fades out all currently active ripples. */
    fadeOutAll() {
        this._getActiveRipples().forEach(ripple => ripple.fadeOut());
    }
    /** Fades out all currently active non-persistent ripples. */
    fadeOutAllNonPersistent() {
        this._getActiveRipples().forEach(ripple => {
            if (!ripple.config.persistent) {
                ripple.fadeOut();
            }
        });
    }
    /** Sets up the trigger event listeners */
    setupTriggerEvents(elementOrElementRef) {
        const element = coerceElement(elementOrElementRef);
        if (!this._platform.isBrowser || !element || element === this._triggerElement) {
            return;
        }
        // Remove all previously registered event listeners from the trigger element.
        this._removeTriggerEvents();
        this._triggerElement = element;
        // Use event delegation for the trigger events since they're
        // set up during creation and are performance-sensitive.
        pointerDownEvents.forEach(type => {
            RippleRenderer._eventManager.addHandler(this._ngZone, type, element, this);
        });
    }
    /**
     * Handles all registered events.
     * @docs-private
     */
    handleEvent(event) {
        if (event.type === 'mousedown') {
            this._onMousedown(event);
        }
        else if (event.type === 'touchstart') {
            this._onTouchStart(event);
        }
        else {
            this._onPointerUp();
        }
        // If pointer-up events haven't been registered yet, do so now.
        // We do this on-demand in order to reduce the total number of event listeners
        // registered by the ripples, which speeds up the rendering time for large UIs.
        if (!this._pointerUpEventsRegistered) {
            // The events for hiding the ripple are bound directly on the trigger, because:
            // 1. Some of them occur frequently (e.g. `mouseleave`) and any advantage we get from
            // delegation will be diminished by having to look through all the data structures often.
            // 2. They aren't as performance-sensitive, because they're bound only after the user
            // has interacted with an element.
            this._ngZone.runOutsideAngular(() => {
                pointerUpEvents.forEach(type => {
                    this._triggerElement.addEventListener(type, this, passiveCapturingEventOptions);
                });
            });
            this._pointerUpEventsRegistered = true;
        }
    }
    /** Method that will be called if the fade-in or fade-in transition completed. */
    _finishRippleTransition(rippleRef) {
        if (rippleRef.state === RippleState.FADING_IN) {
            this._startFadeOutTransition(rippleRef);
        }
        else if (rippleRef.state === RippleState.FADING_OUT) {
            this._destroyRipple(rippleRef);
        }
    }
    /**
     * Starts the fade-out transition of the given ripple if it's not persistent and the pointer
     * is not held down anymore.
     */
    _startFadeOutTransition(rippleRef) {
        const isMostRecentTransientRipple = rippleRef === this._mostRecentTransientRipple;
        const { persistent } = rippleRef.config;
        rippleRef.state = RippleState.VISIBLE;
        // When the timer runs out while the user has kept their pointer down, we want to
        // keep only the persistent ripples and the latest transient ripple. We do this,
        // because we don't want stacked transient ripples to appear after their enter
        // animation has finished.
        if (!persistent && (!isMostRecentTransientRipple || !this._isPointerDown)) {
            rippleRef.fadeOut();
        }
    }
    /** Destroys the given ripple by removing it from the DOM and updating its state. */
    _destroyRipple(rippleRef) {
        const eventListeners = this._activeRipples.get(rippleRef) ?? null;
        this._activeRipples.delete(rippleRef);
        // Clear out the cached bounding rect if we have no more ripples.
        if (!this._activeRipples.size) {
            this._containerRect = null;
        }
        // If the current ref is the most recent transient ripple, unset it
        // avoid memory leaks.
        if (rippleRef === this._mostRecentTransientRipple) {
            this._mostRecentTransientRipple = null;
        }
        rippleRef.state = RippleState.HIDDEN;
        if (eventListeners !== null) {
            rippleRef.element.removeEventListener('transitionend', eventListeners.onTransitionEnd);
            rippleRef.element.removeEventListener('transitioncancel', eventListeners.onTransitionCancel);
            if (eventListeners.fallbackTimer !== null) {
                clearTimeout(eventListeners.fallbackTimer);
            }
        }
        rippleRef.element.remove();
    }
    /** Function being called whenever the trigger is being pressed using mouse. */
    _onMousedown(event) {
        // Screen readers will fire fake mouse events for space/enter. Skip launching a
        // ripple in this case for consistency with the non-screen-reader experience.
        const isFakeMousedown = isFakeMousedownFromScreenReader(event);
        const isSyntheticEvent = this._lastTouchStartEvent &&
            Date.now() < this._lastTouchStartEvent + ignoreMouseEventsTimeout;
        if (!this._target.rippleDisabled && !isFakeMousedown && !isSyntheticEvent) {
            this._isPointerDown = true;
            this.fadeInRipple(event.clientX, event.clientY, this._target.rippleConfig);
        }
    }
    /** Function being called whenever the trigger is being pressed using touch. */
    _onTouchStart(event) {
        if (!this._target.rippleDisabled && !isFakeTouchstartFromScreenReader(event)) {
            // Some browsers fire mouse events after a `touchstart` event. Those synthetic mouse
            // events will launch a second ripple if we don't ignore mouse events for a specific
            // time after a touchstart event.
            this._lastTouchStartEvent = Date.now();
            this._isPointerDown = true;
            // Use `changedTouches` so we skip any touches where the user put
            // their finger down, but used another finger to tap the element again.
            const touches = event.changedTouches;
            // According to the typings the touches should always be defined, but in some cases
            // the browser appears to not assign them in tests which leads to flakes.
            if (touches) {
                for (let i = 0; i < touches.length; i++) {
                    this.fadeInRipple(touches[i].clientX, touches[i].clientY, this._target.rippleConfig);
                }
            }
        }
    }
    /** Function being called whenever the trigger is being released. */
    _onPointerUp() {
        if (!this._isPointerDown) {
            return;
        }
        this._isPointerDown = false;
        // Fade-out all ripples that are visible and not persistent.
        this._getActiveRipples().forEach(ripple => {
            // By default, only ripples that are completely visible will fade out on pointer release.
            // If the `terminateOnPointerUp` option is set, ripples that still fade in will also fade out.
            const isVisible = ripple.state === RippleState.VISIBLE ||
                (ripple.config.terminateOnPointerUp && ripple.state === RippleState.FADING_IN);
            if (!ripple.config.persistent && isVisible) {
                ripple.fadeOut();
            }
        });
    }
    _getActiveRipples() {
        return Array.from(this._activeRipples.keys());
    }
    /** Removes previously registered event listeners from the trigger element. */
    _removeTriggerEvents() {
        const trigger = this._triggerElement;
        if (trigger) {
            pointerDownEvents.forEach(type => RippleRenderer._eventManager.removeHandler(type, trigger, this));
            if (this._pointerUpEventsRegistered) {
                pointerUpEvents.forEach(type => trigger.removeEventListener(type, this, passiveCapturingEventOptions));
                this._pointerUpEventsRegistered = false;
            }
        }
    }
}
/**
 * Returns the distance from the point (x, y) to the furthest corner of a rectangle.
 */
function distanceToFurthestCorner(x, y, rect) {
    const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS1yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBR0wsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsR0FFbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFXLCtCQUErQixFQUFrQixNQUFNLHVCQUF1QixDQUFDO0FBQ2pHLE9BQU8sRUFBQywrQkFBK0IsRUFBRSxnQ0FBZ0MsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BHLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUM1RCxPQUFPLEVBQUMsU0FBUyxFQUFFLFdBQVcsRUFBZSxNQUFNLGNBQWMsQ0FBQztBQUNsRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQzs7QUFxQjFEOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFHO0lBQzFDLGFBQWEsRUFBRSxHQUFHO0lBQ2xCLFlBQVksRUFBRSxHQUFHO0NBQ2xCLENBQUM7QUFFRjs7O0dBR0c7QUFDSCxNQUFNLHdCQUF3QixHQUFHLEdBQUcsQ0FBQztBQUVyQyxzREFBc0Q7QUFDdEQsTUFBTSw0QkFBNEIsR0FBRywrQkFBK0IsQ0FBQztJQUNuRSxPQUFPLEVBQUUsSUFBSTtJQUNiLE9BQU8sRUFBRSxJQUFJO0NBQ2QsQ0FBQyxDQUFDO0FBRUgsbURBQW1EO0FBQ25ELE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFdEQsaURBQWlEO0FBQ2pELE1BQU0sZUFBZSxHQUFHLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFVN0UsTUFBTSxPQUFPLHNCQUFzQjtxSEFBdEIsc0JBQXNCO3lHQUF0QixzQkFBc0IsaUlBUHZCLEVBQUU7O2tHQU9ELHNCQUFzQjtrQkFSbEMsU0FBUzsrQkFDRSxFQUFFLG1CQUNLLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUksY0FDekIsSUFBSSxRQUVWLEVBQUMseUJBQXlCLEVBQUUsRUFBRSxFQUFDOztBQUl2Qzs7Ozs7O0dBTUc7QUFDSCxNQUFNLE9BQU8sY0FBYzthQWlDVixrQkFBYSxHQUFHLElBQUksa0JBQWtCLEVBQUUsQUFBM0IsQ0FBNEI7SUFFeEQsWUFDVSxPQUFxQixFQUNyQixPQUFlLEVBQ3ZCLG1CQUEwRCxFQUNsRCxTQUFtQixFQUMzQixRQUFtQjtRQUpYLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFDckIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUVmLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFoQzdCLG9EQUFvRDtRQUM1QyxtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUUvQjs7Ozs7V0FLRztRQUNLLG1CQUFjLEdBQUcsSUFBSSxHQUFHLEVBQTBDLENBQUM7UUFRM0UsK0RBQStEO1FBQ3ZELCtCQUEwQixHQUFHLEtBQUssQ0FBQztRQWlCekMsNENBQTRDO1FBQzVDLElBQUksU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBRUQsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUNiLFFBQVEsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNwRSxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsWUFBWSxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsU0FBdUIsRUFBRTtRQUMxRCxNQUFNLGFBQWEsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjO1lBQ3hDLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQztRQUN6RSxNQUFNLGVBQWUsR0FBRyxFQUFDLEdBQUcsNEJBQTRCLEVBQUUsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFDLENBQUM7UUFFL0UsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDcEIsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDakQsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksd0JBQXdCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUM5RSxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztRQUN2QyxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQztRQUN0QyxNQUFNLGFBQWEsR0FBRyxlQUFlLENBQUMsYUFBYSxDQUFDO1FBRXBELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUUzQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQztRQUM1QyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQztRQUMzQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQztRQUN4QyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQztRQUV2QywrRUFBK0U7UUFDL0UsMEVBQTBFO1FBQzFFLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN6QixNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQzlDLENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLGtCQUFrQixHQUFHLEdBQUcsYUFBYSxJQUFJLENBQUM7UUFFdkQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUzQyxnRkFBZ0Y7UUFDaEYsa0ZBQWtGO1FBQ2xGLDZGQUE2RjtRQUM3Riw4REFBOEQ7UUFDOUQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sc0JBQXNCLEdBQUcsY0FBYyxDQUFDLGtCQUFrQixDQUFDO1FBQ2pFLE1BQU0sc0JBQXNCLEdBQUcsY0FBYyxDQUFDLGtCQUFrQixDQUFDO1FBRWpFLG1GQUFtRjtRQUNuRiw4RkFBOEY7UUFDOUYsNkZBQTZGO1FBQzdGLCtGQUErRjtRQUMvRixvQkFBb0I7UUFDcEIsTUFBTSxtQ0FBbUMsR0FDdkMsc0JBQXNCLEtBQUssTUFBTTtZQUNqQywyRkFBMkY7WUFDM0YsZ0dBQWdHO1lBQ2hHLHNCQUFzQixLQUFLLElBQUk7WUFDL0Isc0JBQXNCLEtBQUssUUFBUTtZQUNuQyx3REFBd0Q7WUFDeEQsQ0FBQyxhQUFhLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRTVELHlEQUF5RDtRQUN6RCxNQUFNLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO1FBRTNGLHVGQUF1RjtRQUN2RixvRkFBb0Y7UUFDcEYsOEVBQThFO1FBQzlFLHNFQUFzRTtRQUN0RSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQztRQUU1QyxTQUFTLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUM7UUFFeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsMEJBQTBCLEdBQUcsU0FBUyxDQUFDO1FBQzlDLENBQUM7UUFFRCxJQUFJLGNBQWMsR0FBZ0MsSUFBSSxDQUFDO1FBRXZELG1GQUFtRjtRQUNuRixnRkFBZ0Y7UUFDaEYsSUFBSSxDQUFDLG1DQUFtQyxJQUFJLENBQUMsYUFBYSxJQUFJLGVBQWUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO1lBQzVGLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO2dCQUNsQyxNQUFNLGVBQWUsR0FBRyxHQUFHLEVBQUU7b0JBQzNCLGlFQUFpRTtvQkFDakUsSUFBSSxjQUFjLEVBQUUsQ0FBQzt3QkFDbkIsY0FBYyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7b0JBQ3RDLENBQUM7b0JBQ0QsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUM1QixJQUFJLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzFDLENBQUMsQ0FBQztnQkFDRixNQUFNLGtCQUFrQixHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRWhFLDBGQUEwRjtnQkFDMUYsMkZBQTJGO2dCQUMzRix5RkFBeUY7Z0JBQ3pGLDRGQUE0RjtnQkFDNUYsZ0ZBQWdGO2dCQUNoRixtRkFBbUY7Z0JBQ25GLDRDQUE0QztnQkFDNUMsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixFQUFFLGFBQWEsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFFMUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDMUQsa0ZBQWtGO2dCQUNsRiwrRUFBK0U7Z0JBQy9FLHNGQUFzRjtnQkFDdEYsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQ2hFLGNBQWMsR0FBRyxFQUFDLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxhQUFhLEVBQUMsQ0FBQztZQUN4RSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCw4REFBOEQ7UUFDOUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRW5ELDJGQUEyRjtRQUMzRiwrRUFBK0U7UUFDL0UsSUFBSSxtQ0FBbUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzFELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELG9DQUFvQztJQUNwQyxhQUFhLENBQUMsU0FBb0I7UUFDaEMsbUVBQW1FO1FBQ25FLElBQUksU0FBUyxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsVUFBVSxJQUFJLFNBQVMsQ0FBQyxLQUFLLEtBQUssV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3pGLE9BQU87UUFDVCxDQUFDO1FBRUQsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUNuQyxNQUFNLGVBQWUsR0FBRyxFQUFDLEdBQUcsNEJBQTRCLEVBQUUsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBQyxDQUFDO1FBRXpGLHFGQUFxRjtRQUNyRiwyQ0FBMkM7UUFDM0MsUUFBUSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLGVBQWUsQ0FBQyxZQUFZLElBQUksQ0FBQztRQUN4RSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDN0IsU0FBUyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDO1FBRXpDLGlGQUFpRjtRQUNqRiwwRkFBMEY7UUFDMUYsSUFBSSxTQUFTLENBQUMsb0NBQW9DLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEYsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFDLENBQUM7SUFDSCxDQUFDO0lBRUQsOENBQThDO0lBQzlDLFVBQVU7UUFDUixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsNkRBQTZEO0lBQzdELHVCQUF1QjtRQUNyQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNuQixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsMENBQTBDO0lBQzFDLGtCQUFrQixDQUFDLG1CQUEwRDtRQUMzRSxNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUVuRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUM5RSxPQUFPO1FBQ1QsQ0FBQztRQUVELDZFQUE2RTtRQUM3RSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQztRQUUvQiw0REFBNEQ7UUFDNUQsd0RBQXdEO1FBQ3hELGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMvQixjQUFjLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsV0FBVyxDQUFDLEtBQVk7UUFDdEIsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBbUIsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7YUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFtQixDQUFDLENBQUM7UUFDMUMsQ0FBQzthQUFNLENBQUM7WUFDTixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEIsQ0FBQztRQUVELCtEQUErRDtRQUMvRCw4RUFBOEU7UUFDOUUsK0VBQStFO1FBQy9FLElBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztZQUNyQywrRUFBK0U7WUFDL0UscUZBQXFGO1lBQ3JGLHlGQUF5RjtZQUN6RixxRkFBcUY7WUFDckYsa0NBQWtDO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO2dCQUNsQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUM3QixJQUFJLENBQUMsZUFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLDRCQUE0QixDQUFDLENBQUM7Z0JBQ25GLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDO1FBQ3pDLENBQUM7SUFDSCxDQUFDO0lBRUQsaUZBQWlGO0lBQ3pFLHVCQUF1QixDQUFDLFNBQW9CO1FBQ2xELElBQUksU0FBUyxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDOUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFDLENBQUM7YUFBTSxJQUFJLFNBQVMsQ0FBQyxLQUFLLEtBQUssV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3RELElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakMsQ0FBQztJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSyx1QkFBdUIsQ0FBQyxTQUFvQjtRQUNsRCxNQUFNLDJCQUEyQixHQUFHLFNBQVMsS0FBSyxJQUFJLENBQUMsMEJBQTBCLENBQUM7UUFDbEYsTUFBTSxFQUFDLFVBQVUsRUFBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFFdEMsU0FBUyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDO1FBRXRDLGlGQUFpRjtRQUNqRixnRkFBZ0Y7UUFDaEYsOEVBQThFO1FBQzlFLDBCQUEwQjtRQUMxQixJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQywyQkFBMkIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO1lBQzFFLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN0QixDQUFDO0lBQ0gsQ0FBQztJQUVELG9GQUFvRjtJQUM1RSxjQUFjLENBQUMsU0FBb0I7UUFDekMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ2xFLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXRDLGlFQUFpRTtRQUNqRSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUM3QixDQUFDO1FBRUQsbUVBQW1FO1FBQ25FLHNCQUFzQjtRQUN0QixJQUFJLFNBQVMsS0FBSyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztZQUNsRCxJQUFJLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDO1FBQ3pDLENBQUM7UUFFRCxTQUFTLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDckMsSUFBSSxjQUFjLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDNUIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3ZGLFNBQVMsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUUsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDN0YsSUFBSSxjQUFjLENBQUMsYUFBYSxLQUFLLElBQUksRUFBRSxDQUFDO2dCQUMxQyxZQUFZLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzdDLENBQUM7UUFDSCxDQUFDO1FBQ0QsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsK0VBQStFO0lBQ3ZFLFlBQVksQ0FBQyxLQUFpQjtRQUNwQywrRUFBK0U7UUFDL0UsNkVBQTZFO1FBQzdFLE1BQU0sZUFBZSxHQUFHLCtCQUErQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9ELE1BQU0sZ0JBQWdCLEdBQ3BCLElBQUksQ0FBQyxvQkFBb0I7WUFDekIsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsR0FBRyx3QkFBd0IsQ0FBQztRQUVwRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLElBQUksQ0FBQyxlQUFlLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQzFFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBQzNCLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0UsQ0FBQztJQUNILENBQUM7SUFFRCwrRUFBK0U7SUFDdkUsYUFBYSxDQUFDLEtBQWlCO1FBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDN0Usb0ZBQW9GO1lBQ3BGLG9GQUFvRjtZQUNwRixpQ0FBaUM7WUFDakMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN2QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztZQUUzQixpRUFBaUU7WUFDakUsdUVBQXVFO1lBQ3ZFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxjQUF1QyxDQUFDO1lBRTlELG1GQUFtRjtZQUNuRix5RUFBeUU7WUFDekUsSUFBSSxPQUFPLEVBQUUsQ0FBQztnQkFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUN4QyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUN2RixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsb0VBQW9FO0lBQzVELFlBQVk7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN6QixPQUFPO1FBQ1QsQ0FBQztRQUVELElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBRTVCLDREQUE0RDtRQUM1RCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDeEMseUZBQXlGO1lBQ3pGLDhGQUE4RjtZQUM5RixNQUFNLFNBQVMsR0FDYixNQUFNLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQyxPQUFPO2dCQUNwQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQW9CLElBQUksTUFBTSxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFakYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLFNBQVMsRUFBRSxDQUFDO2dCQUMzQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbkIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGlCQUFpQjtRQUN2QixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCw4RUFBOEU7SUFDOUUsb0JBQW9CO1FBQ2xCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFFckMsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNaLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUMvQixjQUFjLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUNoRSxDQUFDO1lBRUYsSUFBSSxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztnQkFDcEMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUM3QixPQUFPLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSw0QkFBNEIsQ0FBQyxDQUN0RSxDQUFDO2dCQUVGLElBQUksQ0FBQywwQkFBMEIsR0FBRyxLQUFLLENBQUM7WUFDMUMsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDOztBQUdIOztHQUVHO0FBQ0gsU0FBUyx3QkFBd0IsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQWE7SUFDbkUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDMUUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDMUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQ2xELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIEVsZW1lbnRSZWYsXG4gIE5nWm9uZSxcbiAgQ29tcG9uZW50LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEluamVjdG9yLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGxhdGZvcm0sIG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMsIF9nZXRFdmVudFRhcmdldH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7aXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlciwgaXNGYWtlVG91Y2hzdGFydEZyb21TY3JlZW5SZWFkZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Y29lcmNlRWxlbWVudH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7X0Nka1ByaXZhdGVTdHlsZUxvYWRlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3ByaXZhdGUnO1xuaW1wb3J0IHtSaXBwbGVSZWYsIFJpcHBsZVN0YXRlLCBSaXBwbGVDb25maWd9IGZyb20gJy4vcmlwcGxlLXJlZic7XG5pbXBvcnQge1JpcHBsZUV2ZW50TWFuYWdlcn0gZnJvbSAnLi9yaXBwbGUtZXZlbnQtbWFuYWdlcic7XG5cbi8qKlxuICogSW50ZXJmYWNlIHRoYXQgZGVzY3JpYmVzIHRoZSB0YXJnZXQgZm9yIGxhdW5jaGluZyByaXBwbGVzLlxuICogSXQgZGVmaW5lcyB0aGUgcmlwcGxlIGNvbmZpZ3VyYXRpb24gYW5kIGRpc2FibGVkIHN0YXRlIGZvciBpbnRlcmFjdGlvbiByaXBwbGVzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJpcHBsZVRhcmdldCB7XG4gIC8qKiBDb25maWd1cmF0aW9uIGZvciByaXBwbGVzIHRoYXQgYXJlIGxhdW5jaGVkIG9uIHBvaW50ZXIgZG93bi4gKi9cbiAgcmlwcGxlQ29uZmlnOiBSaXBwbGVDb25maWc7XG4gIC8qKiBXaGV0aGVyIHJpcHBsZXMgb24gcG9pbnRlciBkb3duIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgcmlwcGxlRGlzYWJsZWQ6IGJvb2xlYW47XG59XG5cbi8qKiBJbnRlcmZhY2VzIHRoZSBkZWZpbmVzIHJpcHBsZSBlbGVtZW50IHRyYW5zaXRpb24gZXZlbnQgbGlzdGVuZXJzLiAqL1xuaW50ZXJmYWNlIFJpcHBsZUV2ZW50TGlzdGVuZXJzIHtcbiAgb25UcmFuc2l0aW9uRW5kOiBFdmVudExpc3RlbmVyO1xuICBvblRyYW5zaXRpb25DYW5jZWw6IEV2ZW50TGlzdGVuZXI7XG4gIGZhbGxiYWNrVGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVsbDtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHJpcHBsZSBhbmltYXRpb24gY29uZmlndXJhdGlvbiBmb3IgcmlwcGxlcyB3aXRob3V0IGFuIGV4cGxpY2l0XG4gKiBhbmltYXRpb24gY29uZmlnIHNwZWNpZmllZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcgPSB7XG4gIGVudGVyRHVyYXRpb246IDIyNSxcbiAgZXhpdER1cmF0aW9uOiAxNTAsXG59O1xuXG4vKipcbiAqIFRpbWVvdXQgZm9yIGlnbm9yaW5nIG1vdXNlIGV2ZW50cy4gTW91c2UgZXZlbnRzIHdpbGwgYmUgdGVtcG9yYXJ5IGlnbm9yZWQgYWZ0ZXIgdG91Y2hcbiAqIGV2ZW50cyB0byBhdm9pZCBzeW50aGV0aWMgbW91c2UgZXZlbnRzLlxuICovXG5jb25zdCBpZ25vcmVNb3VzZUV2ZW50c1RpbWVvdXQgPSA4MDA7XG5cbi8qKiBPcHRpb25zIHVzZWQgdG8gYmluZCBhIHBhc3NpdmUgY2FwdHVyaW5nIGV2ZW50LiAqL1xuY29uc3QgcGFzc2l2ZUNhcHR1cmluZ0V2ZW50T3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe1xuICBwYXNzaXZlOiB0cnVlLFxuICBjYXB0dXJlOiB0cnVlLFxufSk7XG5cbi8qKiBFdmVudHMgdGhhdCBzaWduYWwgdGhhdCB0aGUgcG9pbnRlciBpcyBkb3duLiAqL1xuY29uc3QgcG9pbnRlckRvd25FdmVudHMgPSBbJ21vdXNlZG93bicsICd0b3VjaHN0YXJ0J107XG5cbi8qKiBFdmVudHMgdGhhdCBzaWduYWwgdGhhdCB0aGUgcG9pbnRlciBpcyB1cC4gKi9cbmNvbnN0IHBvaW50ZXJVcEV2ZW50cyA9IFsnbW91c2V1cCcsICdtb3VzZWxlYXZlJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJ107XG5cbkBDb21wb25lbnQoe1xuICB0ZW1wbGF0ZTogJycsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBzdHlsZVVybDogJ3JpcHBsZS1zdHJ1Y3R1cmUuY3NzJyxcbiAgaG9zdDogeydtYXQtcmlwcGxlLXN0eWxlLWxvYWRlcic6ICcnfSxcbn0pXG5leHBvcnQgY2xhc3MgX01hdFJpcHBsZVN0eWxlc0xvYWRlciB7fVxuXG4vKipcbiAqIEhlbHBlciBzZXJ2aWNlIHRoYXQgcGVyZm9ybXMgRE9NIG1hbmlwdWxhdGlvbnMuIE5vdCBpbnRlbmRlZCB0byBiZSB1c2VkIG91dHNpZGUgdGhpcyBtb2R1bGUuXG4gKiBUaGUgY29uc3RydWN0b3IgdGFrZXMgYSByZWZlcmVuY2UgdG8gdGhlIHJpcHBsZSBkaXJlY3RpdmUncyBob3N0IGVsZW1lbnQgYW5kIGEgbWFwIG9mIERPTVxuICogZXZlbnQgaGFuZGxlcnMgdG8gYmUgaW5zdGFsbGVkIG9uIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcnMgcmlwcGxlIGFuaW1hdGlvbnMuXG4gKiBUaGlzIHdpbGwgZXZlbnR1YWxseSBiZWNvbWUgYSBjdXN0b20gcmVuZGVyZXIgb25jZSBBbmd1bGFyIHN1cHBvcnQgZXhpc3RzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgUmlwcGxlUmVuZGVyZXIgaW1wbGVtZW50cyBFdmVudExpc3RlbmVyT2JqZWN0IHtcbiAgLyoqIEVsZW1lbnQgd2hlcmUgdGhlIHJpcHBsZXMgYXJlIGJlaW5nIGFkZGVkIHRvLiAqL1xuICBwcml2YXRlIF9jb250YWluZXJFbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAvKiogRWxlbWVudCB3aGljaCB0cmlnZ2VycyB0aGUgcmlwcGxlIGVsZW1lbnRzIG9uIG1vdXNlIGV2ZW50cy4gKi9cbiAgcHJpdmF0ZSBfdHJpZ2dlckVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgcG9pbnRlciBpcyBjdXJyZW50bHkgZG93biBvciBub3QuICovXG4gIHByaXZhdGUgX2lzUG9pbnRlckRvd24gPSBmYWxzZTtcblxuICAvKipcbiAgICogTWFwIG9mIGN1cnJlbnRseSBhY3RpdmUgcmlwcGxlIHJlZmVyZW5jZXMuXG4gICAqIFRoZSByaXBwbGUgcmVmZXJlbmNlIGlzIG1hcHBlZCB0byBpdHMgZWxlbWVudCBldmVudCBsaXN0ZW5lcnMuXG4gICAqIFRoZSByZWFzb24gd2h5IGB8IG51bGxgIGlzIHVzZWQgaXMgdGhhdCBldmVudCBsaXN0ZW5lcnMgYXJlIGFkZGVkIG9ubHlcbiAgICogd2hlbiB0aGUgY29uZGl0aW9uIGlzIHRydXRoeSAoc2VlIHRoZSBgX3N0YXJ0RmFkZU91dFRyYW5zaXRpb25gIG1ldGhvZCkuXG4gICAqL1xuICBwcml2YXRlIF9hY3RpdmVSaXBwbGVzID0gbmV3IE1hcDxSaXBwbGVSZWYsIFJpcHBsZUV2ZW50TGlzdGVuZXJzIHwgbnVsbD4oKTtcblxuICAvKiogTGF0ZXN0IG5vbi1wZXJzaXN0ZW50IHJpcHBsZSB0aGF0IHdhcyB0cmlnZ2VyZWQuICovXG4gIHByaXZhdGUgX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGU6IFJpcHBsZVJlZiB8IG51bGw7XG5cbiAgLyoqIFRpbWUgaW4gbWlsbGlzZWNvbmRzIHdoZW4gdGhlIGxhc3QgdG91Y2hzdGFydCBldmVudCBoYXBwZW5lZC4gKi9cbiAgcHJpdmF0ZSBfbGFzdFRvdWNoU3RhcnRFdmVudDogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHBvaW50ZXItdXAgZXZlbnQgbGlzdGVuZXJzIGhhdmUgYmVlbiByZWdpc3RlcmVkLiAqL1xuICBwcml2YXRlIF9wb2ludGVyVXBFdmVudHNSZWdpc3RlcmVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIENhY2hlZCBkaW1lbnNpb25zIG9mIHRoZSByaXBwbGUgY29udGFpbmVyLiBTZXQgd2hlbiB0aGUgZmlyc3RcbiAgICogcmlwcGxlIGlzIHNob3duIGFuZCBjbGVhcmVkIG9uY2Ugbm8gbW9yZSByaXBwbGVzIGFyZSB2aXNpYmxlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY29udGFpbmVyUmVjdDogRE9NUmVjdCB8IG51bGw7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX2V2ZW50TWFuYWdlciA9IG5ldyBSaXBwbGVFdmVudE1hbmFnZXIoKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF90YXJnZXQ6IFJpcHBsZVRhcmdldCxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBlbGVtZW50T3JFbGVtZW50UmVmOiBIVE1MRWxlbWVudCB8IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBpbmplY3Rvcj86IEluamVjdG9yLFxuICApIHtcbiAgICAvLyBPbmx5IGRvIGFueXRoaW5nIGlmIHdlJ3JlIG9uIHRoZSBicm93c2VyLlxuICAgIGlmIChfcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb250YWluZXJFbGVtZW50ID0gY29lcmNlRWxlbWVudChlbGVtZW50T3JFbGVtZW50UmVmKTtcbiAgICB9XG5cbiAgICBpZiAoaW5qZWN0b3IpIHtcbiAgICAgIGluamVjdG9yLmdldChfQ2RrUHJpdmF0ZVN0eWxlTG9hZGVyKS5sb2FkKF9NYXRSaXBwbGVTdHlsZXNMb2FkZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGYWRlcyBpbiBhIHJpcHBsZSBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXMuXG4gICAqIEBwYXJhbSB4IENvb3JkaW5hdGUgd2l0aGluIHRoZSBlbGVtZW50LCBhbG9uZyB0aGUgWCBheGlzIGF0IHdoaWNoIHRvIHN0YXJ0IHRoZSByaXBwbGUuXG4gICAqIEBwYXJhbSB5IENvb3JkaW5hdGUgd2l0aGluIHRoZSBlbGVtZW50LCBhbG9uZyB0aGUgWSBheGlzIGF0IHdoaWNoIHRvIHN0YXJ0IHRoZSByaXBwbGUuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgcmlwcGxlIG9wdGlvbnMuXG4gICAqL1xuICBmYWRlSW5SaXBwbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbmZpZzogUmlwcGxlQ29uZmlnID0ge30pOiBSaXBwbGVSZWYge1xuICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSAodGhpcy5fY29udGFpbmVyUmVjdCA9XG4gICAgICB0aGlzLl9jb250YWluZXJSZWN0IHx8IHRoaXMuX2NvbnRhaW5lckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgIGNvbnN0IGFuaW1hdGlvbkNvbmZpZyA9IHsuLi5kZWZhdWx0UmlwcGxlQW5pbWF0aW9uQ29uZmlnLCAuLi5jb25maWcuYW5pbWF0aW9ufTtcblxuICAgIGlmIChjb25maWcuY2VudGVyZWQpIHtcbiAgICAgIHggPSBjb250YWluZXJSZWN0LmxlZnQgKyBjb250YWluZXJSZWN0LndpZHRoIC8gMjtcbiAgICAgIHkgPSBjb250YWluZXJSZWN0LnRvcCArIGNvbnRhaW5lclJlY3QuaGVpZ2h0IC8gMjtcbiAgICB9XG5cbiAgICBjb25zdCByYWRpdXMgPSBjb25maWcucmFkaXVzIHx8IGRpc3RhbmNlVG9GdXJ0aGVzdENvcm5lcih4LCB5LCBjb250YWluZXJSZWN0KTtcbiAgICBjb25zdCBvZmZzZXRYID0geCAtIGNvbnRhaW5lclJlY3QubGVmdDtcbiAgICBjb25zdCBvZmZzZXRZID0geSAtIGNvbnRhaW5lclJlY3QudG9wO1xuICAgIGNvbnN0IGVudGVyRHVyYXRpb24gPSBhbmltYXRpb25Db25maWcuZW50ZXJEdXJhdGlvbjtcblxuICAgIGNvbnN0IHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJpcHBsZS5jbGFzc0xpc3QuYWRkKCdtYXQtcmlwcGxlLWVsZW1lbnQnKTtcblxuICAgIHJpcHBsZS5zdHlsZS5sZWZ0ID0gYCR7b2Zmc2V0WCAtIHJhZGl1c31weGA7XG4gICAgcmlwcGxlLnN0eWxlLnRvcCA9IGAke29mZnNldFkgLSByYWRpdXN9cHhgO1xuICAgIHJpcHBsZS5zdHlsZS5oZWlnaHQgPSBgJHtyYWRpdXMgKiAyfXB4YDtcbiAgICByaXBwbGUuc3R5bGUud2lkdGggPSBgJHtyYWRpdXMgKiAyfXB4YDtcblxuICAgIC8vIElmIGEgY3VzdG9tIGNvbG9yIGhhcyBiZWVuIHNwZWNpZmllZCwgc2V0IGl0IGFzIGlubGluZSBzdHlsZS4gSWYgbm8gY29sb3IgaXNcbiAgICAvLyBzZXQsIHRoZSBkZWZhdWx0IGNvbG9yIHdpbGwgYmUgYXBwbGllZCB0aHJvdWdoIHRoZSByaXBwbGUgdGhlbWUgc3R5bGVzLlxuICAgIGlmIChjb25maWcuY29sb3IgIT0gbnVsbCkge1xuICAgICAgcmlwcGxlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbmZpZy5jb2xvcjtcbiAgICB9XG5cbiAgICByaXBwbGUuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZW50ZXJEdXJhdGlvbn1tc2A7XG5cbiAgICB0aGlzLl9jb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKHJpcHBsZSk7XG5cbiAgICAvLyBCeSBkZWZhdWx0IHRoZSBicm93c2VyIGRvZXMgbm90IHJlY2FsY3VsYXRlIHRoZSBzdHlsZXMgb2YgZHluYW1pY2FsbHkgY3JlYXRlZFxuICAgIC8vIHJpcHBsZSBlbGVtZW50cy4gVGhpcyBpcyBjcml0aWNhbCB0byBlbnN1cmUgdGhhdCB0aGUgYHNjYWxlYCBhbmltYXRlcyBwcm9wZXJseS5cbiAgICAvLyBXZSBlbmZvcmNlIGEgc3R5bGUgcmVjYWxjdWxhdGlvbiBieSBjYWxsaW5nIGBnZXRDb21wdXRlZFN0eWxlYCBhbmQgKmFjY2Vzc2luZyogYSBwcm9wZXJ0eS5cbiAgICAvLyBTZWU6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC81ZDUyZmIwODFiMzU3MGM4MWUzYVxuICAgIGNvbnN0IGNvbXB1dGVkU3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUocmlwcGxlKTtcbiAgICBjb25zdCB1c2VyVHJhbnNpdGlvblByb3BlcnR5ID0gY29tcHV0ZWRTdHlsZXMudHJhbnNpdGlvblByb3BlcnR5O1xuICAgIGNvbnN0IHVzZXJUcmFuc2l0aW9uRHVyYXRpb24gPSBjb21wdXRlZFN0eWxlcy50cmFuc2l0aW9uRHVyYXRpb247XG5cbiAgICAvLyBOb3RlOiBXZSBkZXRlY3Qgd2hldGhlciBhbmltYXRpb24gaXMgZm9yY2libHkgZGlzYWJsZWQgdGhyb3VnaCBDU1MgKGUuZy4gdGhyb3VnaFxuICAgIC8vIGB0cmFuc2l0aW9uOiBub25lYCBvciBgZGlzcGxheTogbm9uZWApLiBUaGlzIGlzIHRlY2huaWNhbGx5IHVuZXhwZWN0ZWQgc2luY2UgYW5pbWF0aW9ucyBhcmVcbiAgICAvLyBjb250cm9sbGVkIHRocm91Z2ggdGhlIGFuaW1hdGlvbiBjb25maWcsIGJ1dCB0aGlzIGV4aXN0cyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIFRoaXNcbiAgICAvLyBsb2dpYyBkb2VzIG5vdCBuZWVkIHRvIGJlIHN1cGVyIGFjY3VyYXRlIHNpbmNlIGl0IGNvdmVycyBzb21lIGVkZ2UgY2FzZXMgd2hpY2ggY2FuIGJlIGVhc2lseVxuICAgIC8vIGF2b2lkZWQgYnkgdXNlcnMuXG4gICAgY29uc3QgYW5pbWF0aW9uRm9yY2libHlEaXNhYmxlZFRocm91Z2hDc3MgPVxuICAgICAgdXNlclRyYW5zaXRpb25Qcm9wZXJ0eSA9PT0gJ25vbmUnIHx8XG4gICAgICAvLyBOb3RlOiBUaGUgY2Fub25pY2FsIHVuaXQgZm9yIHNlcmlhbGl6ZWQgQ1NTIGA8dGltZT5gIHByb3BlcnRpZXMgaXMgc2Vjb25kcy4gQWRkaXRpb25hbGx5XG4gICAgICAvLyBzb21lIGJyb3dzZXJzIGV4cGFuZCB0aGUgZHVyYXRpb24gZm9yIGV2ZXJ5IHByb3BlcnR5IChpbiBvdXIgY2FzZSBgb3BhY2l0eWAgYW5kIGB0cmFuc2Zvcm1gKS5cbiAgICAgIHVzZXJUcmFuc2l0aW9uRHVyYXRpb24gPT09ICcwcycgfHxcbiAgICAgIHVzZXJUcmFuc2l0aW9uRHVyYXRpb24gPT09ICcwcywgMHMnIHx8XG4gICAgICAvLyBJZiB0aGUgY29udGFpbmVyIGlzIDB4MCwgaXQncyBsaWtlbHkgYGRpc3BsYXk6IG5vbmVgLlxuICAgICAgKGNvbnRhaW5lclJlY3Qud2lkdGggPT09IDAgJiYgY29udGFpbmVyUmVjdC5oZWlnaHQgPT09IDApO1xuXG4gICAgLy8gRXhwb3NlZCByZWZlcmVuY2UgdG8gdGhlIHJpcHBsZSB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuXG4gICAgY29uc3QgcmlwcGxlUmVmID0gbmV3IFJpcHBsZVJlZih0aGlzLCByaXBwbGUsIGNvbmZpZywgYW5pbWF0aW9uRm9yY2libHlEaXNhYmxlZFRocm91Z2hDc3MpO1xuXG4gICAgLy8gU3RhcnQgdGhlIGVudGVyIGFuaW1hdGlvbiBieSBzZXR0aW5nIHRoZSB0cmFuc2Zvcm0vc2NhbGUgdG8gMTAwJS4gVGhlIGFuaW1hdGlvbiB3aWxsXG4gICAgLy8gZXhlY3V0ZSBhcyBwYXJ0IG9mIHRoaXMgc3RhdGVtZW50IGJlY2F1c2Ugd2UgZm9yY2VkIGEgc3R5bGUgcmVjYWxjdWxhdGlvbiBiZWZvcmUuXG4gICAgLy8gTm90ZTogV2UgdXNlIGEgM2QgdHJhbnNmb3JtIGhlcmUgaW4gb3JkZXIgdG8gYXZvaWQgYW4gaXNzdWUgaW4gU2FmYXJpIHdoZXJlXG4gICAgLy8gdGhlIHJpcHBsZXMgYXJlbid0IGNsaXBwZWQgd2hlbiBpbnNpZGUgdGhlIHNoYWRvdyBET00gKHNlZSAjMjQwMjgpLlxuICAgIHJpcHBsZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUzZCgxLCAxLCAxKSc7XG5cbiAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5GQURJTkdfSU47XG5cbiAgICBpZiAoIWNvbmZpZy5wZXJzaXN0ZW50KSB7XG4gICAgICB0aGlzLl9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlID0gcmlwcGxlUmVmO1xuICAgIH1cblxuICAgIGxldCBldmVudExpc3RlbmVyczogUmlwcGxlRXZlbnRMaXN0ZW5lcnMgfCBudWxsID0gbnVsbDtcblxuICAgIC8vIERvIG5vdCByZWdpc3RlciB0aGUgYHRyYW5zaXRpb25gIGV2ZW50IGxpc3RlbmVyIGlmIGZhZGUtaW4gYW5kIGZhZGUtb3V0IGR1cmF0aW9uXG4gICAgLy8gYXJlIHNldCB0byB6ZXJvLiBUaGUgZXZlbnRzIHdvbid0IGZpcmUgYW55d2F5IGFuZCB3ZSBjYW4gc2F2ZSByZXNvdXJjZXMgaGVyZS5cbiAgICBpZiAoIWFuaW1hdGlvbkZvcmNpYmx5RGlzYWJsZWRUaHJvdWdoQ3NzICYmIChlbnRlckR1cmF0aW9uIHx8IGFuaW1hdGlvbkNvbmZpZy5leGl0RHVyYXRpb24pKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBjb25zdCBvblRyYW5zaXRpb25FbmQgPSAoKSA9PiB7XG4gICAgICAgICAgLy8gQ2xlYXIgdGhlIGZhbGxiYWNrIHRpbWVyIHNpbmNlIHRoZSB0cmFuc2l0aW9uIGZpcmVkIGNvcnJlY3RseS5cbiAgICAgICAgICBpZiAoZXZlbnRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGV2ZW50TGlzdGVuZXJzLmZhbGxiYWNrVGltZXIgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjbGVhclRpbWVvdXQoZmFsbGJhY2tUaW1lcik7XG4gICAgICAgICAgdGhpcy5fZmluaXNoUmlwcGxlVHJhbnNpdGlvbihyaXBwbGVSZWYpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBvblRyYW5zaXRpb25DYW5jZWwgPSAoKSA9PiB0aGlzLl9kZXN0cm95UmlwcGxlKHJpcHBsZVJlZik7XG5cbiAgICAgICAgLy8gSW4gc29tZSBjYXNlcyB3aGVyZSB0aGVyZSdzIGEgaGlnaGVyIGxvYWQgb24gdGhlIGJyb3dzZXIsIGl0IGNhbiBjaG9vc2Ugbm90IHRvIGRpc3BhdGNoXG4gICAgICAgIC8vIG5laXRoZXIgYHRyYW5zaXRpb25lbmRgIG5vciBgdHJhbnNpdGlvbmNhbmNlbGAgKHNlZSBiLzIyNzM1NjY3NCkuIFRoaXMgdGltZXIgc2VydmVzIGFzIGFcbiAgICAgICAgLy8gZmFsbGJhY2sgZm9yIHN1Y2ggY2FzZXMgc28gdGhhdCB0aGUgcmlwcGxlIGRvZXNuJ3QgYmVjb21lIHN0dWNrLiBXZSBhZGQgYSAxMDBtcyBidWZmZXJcbiAgICAgICAgLy8gYmVjYXVzZSB0aW1lcnMgYXJlbid0IHByZWNpc2UuIE5vdGUgdGhhdCBhbm90aGVyIGFwcHJvYWNoIGNhbiBiZSB0byB0cmFuc2l0aW9uIHRoZSByaXBwbGVcbiAgICAgICAgLy8gdG8gdGhlIGBWSVNJQkxFYCBzdGF0ZSBpbW1lZGlhdGVseSBhYm92ZSBhbmQgdG8gYEZBRElOR19JTmAgYWZ0ZXJ3YXJkcyBpbnNpZGVcbiAgICAgICAgLy8gYHRyYW5zaXRpb25zdGFydGAuIFdlIGdvIHdpdGggdGhlIHRpbWVyIGJlY2F1c2UgaXQncyBvbmUgbGVzcyBldmVudCBsaXN0ZW5lciBhbmRcbiAgICAgICAgLy8gaXQncyBsZXNzIGxpa2VseSB0byBicmVhayBleGlzdGluZyB0ZXN0cy5cbiAgICAgICAgY29uc3QgZmFsbGJhY2tUaW1lciA9IHNldFRpbWVvdXQob25UcmFuc2l0aW9uQ2FuY2VsLCBlbnRlckR1cmF0aW9uICsgMTAwKTtcblxuICAgICAgICByaXBwbGUuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIG9uVHJhbnNpdGlvbkVuZCk7XG4gICAgICAgIC8vIElmIHRoZSB0cmFuc2l0aW9uIGlzIGNhbmNlbGxlZCAoZS5nLiBkdWUgdG8gRE9NIHJlbW92YWwpLCB3ZSBkZXN0cm95IHRoZSByaXBwbGVcbiAgICAgICAgLy8gZGlyZWN0bHkgYXMgb3RoZXJ3aXNlIHdlIHdvdWxkIGtlZXAgaXQgcGFydCBvZiB0aGUgcmlwcGxlIGNvbnRhaW5lciBmb3JldmVyLlxuICAgICAgICAvLyBodHRwczovL3d3dy53My5vcmcvVFIvY3NzLXRyYW5zaXRpb25zLTEvIzp+OnRleHQ9bm8lMjBsb25nZXIlMjBpbiUyMHRoZSUyMGRvY3VtZW50LlxuICAgICAgICByaXBwbGUuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmNhbmNlbCcsIG9uVHJhbnNpdGlvbkNhbmNlbCk7XG4gICAgICAgIGV2ZW50TGlzdGVuZXJzID0ge29uVHJhbnNpdGlvbkVuZCwgb25UcmFuc2l0aW9uQ2FuY2VsLCBmYWxsYmFja1RpbWVyfTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgcmlwcGxlIHJlZmVyZW5jZSB0byB0aGUgbGlzdCBvZiBhbGwgYWN0aXZlIHJpcHBsZXMuXG4gICAgdGhpcy5fYWN0aXZlUmlwcGxlcy5zZXQocmlwcGxlUmVmLCBldmVudExpc3RlbmVycyk7XG5cbiAgICAvLyBJbiBjYXNlIHRoZXJlIGlzIG5vIGZhZGUtaW4gdHJhbnNpdGlvbiBkdXJhdGlvbiwgd2UgbmVlZCB0byBtYW51YWxseSBjYWxsIHRoZSB0cmFuc2l0aW9uXG4gICAgLy8gZW5kIGxpc3RlbmVyIGJlY2F1c2UgYHRyYW5zaXRpb25lbmRgIGRvZXNuJ3QgZmlyZSBpZiB0aGVyZSBpcyBubyB0cmFuc2l0aW9uLlxuICAgIGlmIChhbmltYXRpb25Gb3JjaWJseURpc2FibGVkVGhyb3VnaENzcyB8fCAhZW50ZXJEdXJhdGlvbikge1xuICAgICAgdGhpcy5fZmluaXNoUmlwcGxlVHJhbnNpdGlvbihyaXBwbGVSZWYpO1xuICAgIH1cblxuICAgIHJldHVybiByaXBwbGVSZWY7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGEgcmlwcGxlIHJlZmVyZW5jZS4gKi9cbiAgZmFkZU91dFJpcHBsZShyaXBwbGVSZWY6IFJpcHBsZVJlZikge1xuICAgIC8vIEZvciByaXBwbGVzIGFscmVhZHkgZmFkaW5nIG91dCBvciBoaWRkZW4sIHRoaXMgc2hvdWxkIGJlIGEgbm9vcC5cbiAgICBpZiAocmlwcGxlUmVmLnN0YXRlID09PSBSaXBwbGVTdGF0ZS5GQURJTkdfT1VUIHx8IHJpcHBsZVJlZi5zdGF0ZSA9PT0gUmlwcGxlU3RhdGUuSElEREVOKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmlwcGxlRWwgPSByaXBwbGVSZWYuZWxlbWVudDtcbiAgICBjb25zdCBhbmltYXRpb25Db25maWcgPSB7Li4uZGVmYXVsdFJpcHBsZUFuaW1hdGlvbkNvbmZpZywgLi4ucmlwcGxlUmVmLmNvbmZpZy5hbmltYXRpb259O1xuXG4gICAgLy8gVGhpcyBzdGFydHMgdGhlIGZhZGUtb3V0IHRyYW5zaXRpb24gYW5kIHdpbGwgZmlyZSB0aGUgdHJhbnNpdGlvbiBlbmQgbGlzdGVuZXIgdGhhdFxuICAgIC8vIHJlbW92ZXMgdGhlIHJpcHBsZSBlbGVtZW50IGZyb20gdGhlIERPTS5cbiAgICByaXBwbGVFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHthbmltYXRpb25Db25maWcuZXhpdER1cmF0aW9ufW1zYDtcbiAgICByaXBwbGVFbC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLkZBRElOR19PVVQ7XG5cbiAgICAvLyBJbiBjYXNlIHRoZXJlIGlzIG5vIGZhZGUtb3V0IHRyYW5zaXRpb24gZHVyYXRpb24sIHdlIG5lZWQgdG8gbWFudWFsbHkgY2FsbCB0aGVcbiAgICAvLyB0cmFuc2l0aW9uIGVuZCBsaXN0ZW5lciBiZWNhdXNlIGB0cmFuc2l0aW9uZW5kYCBkb2Vzbid0IGZpcmUgaWYgdGhlcmUgaXMgbm8gdHJhbnNpdGlvbi5cbiAgICBpZiAocmlwcGxlUmVmLl9hbmltYXRpb25Gb3JjaWJseURpc2FibGVkVGhyb3VnaENzcyB8fCAhYW5pbWF0aW9uQ29uZmlnLmV4aXREdXJhdGlvbikge1xuICAgICAgdGhpcy5fZmluaXNoUmlwcGxlVHJhbnNpdGlvbihyaXBwbGVSZWYpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBGYWRlcyBvdXQgYWxsIGN1cnJlbnRseSBhY3RpdmUgcmlwcGxlcy4gKi9cbiAgZmFkZU91dEFsbCgpIHtcbiAgICB0aGlzLl9nZXRBY3RpdmVSaXBwbGVzKCkuZm9yRWFjaChyaXBwbGUgPT4gcmlwcGxlLmZhZGVPdXQoKSk7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGFsbCBjdXJyZW50bHkgYWN0aXZlIG5vbi1wZXJzaXN0ZW50IHJpcHBsZXMuICovXG4gIGZhZGVPdXRBbGxOb25QZXJzaXN0ZW50KCkge1xuICAgIHRoaXMuX2dldEFjdGl2ZVJpcHBsZXMoKS5mb3JFYWNoKHJpcHBsZSA9PiB7XG4gICAgICBpZiAoIXJpcHBsZS5jb25maWcucGVyc2lzdGVudCkge1xuICAgICAgICByaXBwbGUuZmFkZU91dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIFNldHMgdXAgdGhlIHRyaWdnZXIgZXZlbnQgbGlzdGVuZXJzICovXG4gIHNldHVwVHJpZ2dlckV2ZW50cyhlbGVtZW50T3JFbGVtZW50UmVmOiBIVE1MRWxlbWVudCB8IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGNvZXJjZUVsZW1lbnQoZWxlbWVudE9yRWxlbWVudFJlZik7XG5cbiAgICBpZiAoIXRoaXMuX3BsYXRmb3JtLmlzQnJvd3NlciB8fCAhZWxlbWVudCB8fCBlbGVtZW50ID09PSB0aGlzLl90cmlnZ2VyRWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhbGwgcHJldmlvdXNseSByZWdpc3RlcmVkIGV2ZW50IGxpc3RlbmVycyBmcm9tIHRoZSB0cmlnZ2VyIGVsZW1lbnQuXG4gICAgdGhpcy5fcmVtb3ZlVHJpZ2dlckV2ZW50cygpO1xuICAgIHRoaXMuX3RyaWdnZXJFbGVtZW50ID0gZWxlbWVudDtcblxuICAgIC8vIFVzZSBldmVudCBkZWxlZ2F0aW9uIGZvciB0aGUgdHJpZ2dlciBldmVudHMgc2luY2UgdGhleSdyZVxuICAgIC8vIHNldCB1cCBkdXJpbmcgY3JlYXRpb24gYW5kIGFyZSBwZXJmb3JtYW5jZS1zZW5zaXRpdmUuXG4gICAgcG9pbnRlckRvd25FdmVudHMuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgIFJpcHBsZVJlbmRlcmVyLl9ldmVudE1hbmFnZXIuYWRkSGFuZGxlcih0aGlzLl9uZ1pvbmUsIHR5cGUsIGVsZW1lbnQsIHRoaXMpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYWxsIHJlZ2lzdGVyZWQgZXZlbnRzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBoYW5kbGVFdmVudChldmVudDogRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicpIHtcbiAgICAgIHRoaXMuX29uTW91c2Vkb3duKGV2ZW50IGFzIE1vdXNlRXZlbnQpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG4gICAgICB0aGlzLl9vblRvdWNoU3RhcnQoZXZlbnQgYXMgVG91Y2hFdmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX29uUG9pbnRlclVwKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgcG9pbnRlci11cCBldmVudHMgaGF2ZW4ndCBiZWVuIHJlZ2lzdGVyZWQgeWV0LCBkbyBzbyBub3cuXG4gICAgLy8gV2UgZG8gdGhpcyBvbi1kZW1hbmQgaW4gb3JkZXIgdG8gcmVkdWNlIHRoZSB0b3RhbCBudW1iZXIgb2YgZXZlbnQgbGlzdGVuZXJzXG4gICAgLy8gcmVnaXN0ZXJlZCBieSB0aGUgcmlwcGxlcywgd2hpY2ggc3BlZWRzIHVwIHRoZSByZW5kZXJpbmcgdGltZSBmb3IgbGFyZ2UgVUlzLlxuICAgIGlmICghdGhpcy5fcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCkge1xuICAgICAgLy8gVGhlIGV2ZW50cyBmb3IgaGlkaW5nIHRoZSByaXBwbGUgYXJlIGJvdW5kIGRpcmVjdGx5IG9uIHRoZSB0cmlnZ2VyLCBiZWNhdXNlOlxuICAgICAgLy8gMS4gU29tZSBvZiB0aGVtIG9jY3VyIGZyZXF1ZW50bHkgKGUuZy4gYG1vdXNlbGVhdmVgKSBhbmQgYW55IGFkdmFudGFnZSB3ZSBnZXQgZnJvbVxuICAgICAgLy8gZGVsZWdhdGlvbiB3aWxsIGJlIGRpbWluaXNoZWQgYnkgaGF2aW5nIHRvIGxvb2sgdGhyb3VnaCBhbGwgdGhlIGRhdGEgc3RydWN0dXJlcyBvZnRlbi5cbiAgICAgIC8vIDIuIFRoZXkgYXJlbid0IGFzIHBlcmZvcm1hbmNlLXNlbnNpdGl2ZSwgYmVjYXVzZSB0aGV5J3JlIGJvdW5kIG9ubHkgYWZ0ZXIgdGhlIHVzZXJcbiAgICAgIC8vIGhhcyBpbnRlcmFjdGVkIHdpdGggYW4gZWxlbWVudC5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHBvaW50ZXJVcEV2ZW50cy5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgIHRoaXMuX3RyaWdnZXJFbGVtZW50IS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIHRoaXMsIHBhc3NpdmVDYXB0dXJpbmdFdmVudE9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9wb2ludGVyVXBFdmVudHNSZWdpc3RlcmVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKiogTWV0aG9kIHRoYXQgd2lsbCBiZSBjYWxsZWQgaWYgdGhlIGZhZGUtaW4gb3IgZmFkZS1pbiB0cmFuc2l0aW9uIGNvbXBsZXRlZC4gKi9cbiAgcHJpdmF0ZSBfZmluaXNoUmlwcGxlVHJhbnNpdGlvbihyaXBwbGVSZWY6IFJpcHBsZVJlZikge1xuICAgIGlmIChyaXBwbGVSZWYuc3RhdGUgPT09IFJpcHBsZVN0YXRlLkZBRElOR19JTikge1xuICAgICAgdGhpcy5fc3RhcnRGYWRlT3V0VHJhbnNpdGlvbihyaXBwbGVSZWYpO1xuICAgIH0gZWxzZSBpZiAocmlwcGxlUmVmLnN0YXRlID09PSBSaXBwbGVTdGF0ZS5GQURJTkdfT1VUKSB7XG4gICAgICB0aGlzLl9kZXN0cm95UmlwcGxlKHJpcHBsZVJlZik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgZmFkZS1vdXQgdHJhbnNpdGlvbiBvZiB0aGUgZ2l2ZW4gcmlwcGxlIGlmIGl0J3Mgbm90IHBlcnNpc3RlbnQgYW5kIHRoZSBwb2ludGVyXG4gICAqIGlzIG5vdCBoZWxkIGRvd24gYW55bW9yZS5cbiAgICovXG4gIHByaXZhdGUgX3N0YXJ0RmFkZU91dFRyYW5zaXRpb24ocmlwcGxlUmVmOiBSaXBwbGVSZWYpIHtcbiAgICBjb25zdCBpc01vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgPSByaXBwbGVSZWYgPT09IHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGU7XG4gICAgY29uc3Qge3BlcnNpc3RlbnR9ID0gcmlwcGxlUmVmLmNvbmZpZztcblxuICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLlZJU0lCTEU7XG5cbiAgICAvLyBXaGVuIHRoZSB0aW1lciBydW5zIG91dCB3aGlsZSB0aGUgdXNlciBoYXMga2VwdCB0aGVpciBwb2ludGVyIGRvd24sIHdlIHdhbnQgdG9cbiAgICAvLyBrZWVwIG9ubHkgdGhlIHBlcnNpc3RlbnQgcmlwcGxlcyBhbmQgdGhlIGxhdGVzdCB0cmFuc2llbnQgcmlwcGxlLiBXZSBkbyB0aGlzLFxuICAgIC8vIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCBzdGFja2VkIHRyYW5zaWVudCByaXBwbGVzIHRvIGFwcGVhciBhZnRlciB0aGVpciBlbnRlclxuICAgIC8vIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQuXG4gICAgaWYgKCFwZXJzaXN0ZW50ICYmICghaXNNb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlIHx8ICF0aGlzLl9pc1BvaW50ZXJEb3duKSkge1xuICAgICAgcmlwcGxlUmVmLmZhZGVPdXQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogRGVzdHJveXMgdGhlIGdpdmVuIHJpcHBsZSBieSByZW1vdmluZyBpdCBmcm9tIHRoZSBET00gYW5kIHVwZGF0aW5nIGl0cyBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveVJpcHBsZShyaXBwbGVSZWY6IFJpcHBsZVJlZikge1xuICAgIGNvbnN0IGV2ZW50TGlzdGVuZXJzID0gdGhpcy5fYWN0aXZlUmlwcGxlcy5nZXQocmlwcGxlUmVmKSA/PyBudWxsO1xuICAgIHRoaXMuX2FjdGl2ZVJpcHBsZXMuZGVsZXRlKHJpcHBsZVJlZik7XG5cbiAgICAvLyBDbGVhciBvdXQgdGhlIGNhY2hlZCBib3VuZGluZyByZWN0IGlmIHdlIGhhdmUgbm8gbW9yZSByaXBwbGVzLlxuICAgIGlmICghdGhpcy5fYWN0aXZlUmlwcGxlcy5zaXplKSB7XG4gICAgICB0aGlzLl9jb250YWluZXJSZWN0ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgY3VycmVudCByZWYgaXMgdGhlIG1vc3QgcmVjZW50IHRyYW5zaWVudCByaXBwbGUsIHVuc2V0IGl0XG4gICAgLy8gYXZvaWQgbWVtb3J5IGxlYWtzLlxuICAgIGlmIChyaXBwbGVSZWYgPT09IHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUpIHtcbiAgICAgIHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLkhJRERFTjtcbiAgICBpZiAoZXZlbnRMaXN0ZW5lcnMgIT09IG51bGwpIHtcbiAgICAgIHJpcHBsZVJlZi5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBldmVudExpc3RlbmVycy5vblRyYW5zaXRpb25FbmQpO1xuICAgICAgcmlwcGxlUmVmLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmNhbmNlbCcsIGV2ZW50TGlzdGVuZXJzLm9uVHJhbnNpdGlvbkNhbmNlbCk7XG4gICAgICBpZiAoZXZlbnRMaXN0ZW5lcnMuZmFsbGJhY2tUaW1lciAhPT0gbnVsbCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoZXZlbnRMaXN0ZW5lcnMuZmFsbGJhY2tUaW1lcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJpcHBsZVJlZi5lbGVtZW50LnJlbW92ZSgpO1xuICB9XG5cbiAgLyoqIEZ1bmN0aW9uIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgdHJpZ2dlciBpcyBiZWluZyBwcmVzc2VkIHVzaW5nIG1vdXNlLiAqL1xuICBwcml2YXRlIF9vbk1vdXNlZG93bihldmVudDogTW91c2VFdmVudCkge1xuICAgIC8vIFNjcmVlbiByZWFkZXJzIHdpbGwgZmlyZSBmYWtlIG1vdXNlIGV2ZW50cyBmb3Igc3BhY2UvZW50ZXIuIFNraXAgbGF1bmNoaW5nIGFcbiAgICAvLyByaXBwbGUgaW4gdGhpcyBjYXNlIGZvciBjb25zaXN0ZW5jeSB3aXRoIHRoZSBub24tc2NyZWVuLXJlYWRlciBleHBlcmllbmNlLlxuICAgIGNvbnN0IGlzRmFrZU1vdXNlZG93biA9IGlzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXIoZXZlbnQpO1xuICAgIGNvbnN0IGlzU3ludGhldGljRXZlbnQgPVxuICAgICAgdGhpcy5fbGFzdFRvdWNoU3RhcnRFdmVudCAmJlxuICAgICAgRGF0ZS5ub3coKSA8IHRoaXMuX2xhc3RUb3VjaFN0YXJ0RXZlbnQgKyBpZ25vcmVNb3VzZUV2ZW50c1RpbWVvdXQ7XG5cbiAgICBpZiAoIXRoaXMuX3RhcmdldC5yaXBwbGVEaXNhYmxlZCAmJiAhaXNGYWtlTW91c2Vkb3duICYmICFpc1N5bnRoZXRpY0V2ZW50KSB7XG4gICAgICB0aGlzLl9pc1BvaW50ZXJEb3duID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmFkZUluUmlwcGxlKGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFksIHRoaXMuX3RhcmdldC5yaXBwbGVDb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBGdW5jdGlvbiBiZWluZyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHRyaWdnZXIgaXMgYmVpbmcgcHJlc3NlZCB1c2luZyB0b3VjaC4gKi9cbiAgcHJpdmF0ZSBfb25Ub3VjaFN0YXJ0KGV2ZW50OiBUb3VjaEV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLl90YXJnZXQucmlwcGxlRGlzYWJsZWQgJiYgIWlzRmFrZVRvdWNoc3RhcnRGcm9tU2NyZWVuUmVhZGVyKGV2ZW50KSkge1xuICAgICAgLy8gU29tZSBicm93c2VycyBmaXJlIG1vdXNlIGV2ZW50cyBhZnRlciBhIGB0b3VjaHN0YXJ0YCBldmVudC4gVGhvc2Ugc3ludGhldGljIG1vdXNlXG4gICAgICAvLyBldmVudHMgd2lsbCBsYXVuY2ggYSBzZWNvbmQgcmlwcGxlIGlmIHdlIGRvbid0IGlnbm9yZSBtb3VzZSBldmVudHMgZm9yIGEgc3BlY2lmaWNcbiAgICAgIC8vIHRpbWUgYWZ0ZXIgYSB0b3VjaHN0YXJ0IGV2ZW50LlxuICAgICAgdGhpcy5fbGFzdFRvdWNoU3RhcnRFdmVudCA9IERhdGUubm93KCk7XG4gICAgICB0aGlzLl9pc1BvaW50ZXJEb3duID0gdHJ1ZTtcblxuICAgICAgLy8gVXNlIGBjaGFuZ2VkVG91Y2hlc2Agc28gd2Ugc2tpcCBhbnkgdG91Y2hlcyB3aGVyZSB0aGUgdXNlciBwdXRcbiAgICAgIC8vIHRoZWlyIGZpbmdlciBkb3duLCBidXQgdXNlZCBhbm90aGVyIGZpbmdlciB0byB0YXAgdGhlIGVsZW1lbnQgYWdhaW4uXG4gICAgICBjb25zdCB0b3VjaGVzID0gZXZlbnQuY2hhbmdlZFRvdWNoZXMgYXMgVG91Y2hMaXN0IHwgdW5kZWZpbmVkO1xuXG4gICAgICAvLyBBY2NvcmRpbmcgdG8gdGhlIHR5cGluZ3MgdGhlIHRvdWNoZXMgc2hvdWxkIGFsd2F5cyBiZSBkZWZpbmVkLCBidXQgaW4gc29tZSBjYXNlc1xuICAgICAgLy8gdGhlIGJyb3dzZXIgYXBwZWFycyB0byBub3QgYXNzaWduIHRoZW0gaW4gdGVzdHMgd2hpY2ggbGVhZHMgdG8gZmxha2VzLlxuICAgICAgaWYgKHRvdWNoZXMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5mYWRlSW5SaXBwbGUodG91Y2hlc1tpXS5jbGllbnRYLCB0b3VjaGVzW2ldLmNsaWVudFksIHRoaXMuX3RhcmdldC5yaXBwbGVDb25maWcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEZ1bmN0aW9uIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgdHJpZ2dlciBpcyBiZWluZyByZWxlYXNlZC4gKi9cbiAgcHJpdmF0ZSBfb25Qb2ludGVyVXAoKSB7XG4gICAgaWYgKCF0aGlzLl9pc1BvaW50ZXJEb3duKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5faXNQb2ludGVyRG93biA9IGZhbHNlO1xuXG4gICAgLy8gRmFkZS1vdXQgYWxsIHJpcHBsZXMgdGhhdCBhcmUgdmlzaWJsZSBhbmQgbm90IHBlcnNpc3RlbnQuXG4gICAgdGhpcy5fZ2V0QWN0aXZlUmlwcGxlcygpLmZvckVhY2gocmlwcGxlID0+IHtcbiAgICAgIC8vIEJ5IGRlZmF1bHQsIG9ubHkgcmlwcGxlcyB0aGF0IGFyZSBjb21wbGV0ZWx5IHZpc2libGUgd2lsbCBmYWRlIG91dCBvbiBwb2ludGVyIHJlbGVhc2UuXG4gICAgICAvLyBJZiB0aGUgYHRlcm1pbmF0ZU9uUG9pbnRlclVwYCBvcHRpb24gaXMgc2V0LCByaXBwbGVzIHRoYXQgc3RpbGwgZmFkZSBpbiB3aWxsIGFsc28gZmFkZSBvdXQuXG4gICAgICBjb25zdCBpc1Zpc2libGUgPVxuICAgICAgICByaXBwbGUuc3RhdGUgPT09IFJpcHBsZVN0YXRlLlZJU0lCTEUgfHxcbiAgICAgICAgKHJpcHBsZS5jb25maWcudGVybWluYXRlT25Qb2ludGVyVXAgJiYgcmlwcGxlLnN0YXRlID09PSBSaXBwbGVTdGF0ZS5GQURJTkdfSU4pO1xuXG4gICAgICBpZiAoIXJpcHBsZS5jb25maWcucGVyc2lzdGVudCAmJiBpc1Zpc2libGUpIHtcbiAgICAgICAgcmlwcGxlLmZhZGVPdXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEFjdGl2ZVJpcHBsZXMoKTogUmlwcGxlUmVmW10ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuX2FjdGl2ZVJpcHBsZXMua2V5cygpKTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdHJpZ2dlciBlbGVtZW50LiAqL1xuICBfcmVtb3ZlVHJpZ2dlckV2ZW50cygpIHtcbiAgICBjb25zdCB0cmlnZ2VyID0gdGhpcy5fdHJpZ2dlckVsZW1lbnQ7XG5cbiAgICBpZiAodHJpZ2dlcikge1xuICAgICAgcG9pbnRlckRvd25FdmVudHMuZm9yRWFjaCh0eXBlID0+XG4gICAgICAgIFJpcHBsZVJlbmRlcmVyLl9ldmVudE1hbmFnZXIucmVtb3ZlSGFuZGxlcih0eXBlLCB0cmlnZ2VyLCB0aGlzKSxcbiAgICAgICk7XG5cbiAgICAgIGlmICh0aGlzLl9wb2ludGVyVXBFdmVudHNSZWdpc3RlcmVkKSB7XG4gICAgICAgIHBvaW50ZXJVcEV2ZW50cy5mb3JFYWNoKHR5cGUgPT5cbiAgICAgICAgICB0cmlnZ2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgdGhpcywgcGFzc2l2ZUNhcHR1cmluZ0V2ZW50T3B0aW9ucyksXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5fcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGZyb20gdGhlIHBvaW50ICh4LCB5KSB0byB0aGUgZnVydGhlc3QgY29ybmVyIG9mIGEgcmVjdGFuZ2xlLlxuICovXG5mdW5jdGlvbiBkaXN0YW5jZVRvRnVydGhlc3RDb3JuZXIoeDogbnVtYmVyLCB5OiBudW1iZXIsIHJlY3Q6IERPTVJlY3QpIHtcbiAgY29uc3QgZGlzdFggPSBNYXRoLm1heChNYXRoLmFicyh4IC0gcmVjdC5sZWZ0KSwgTWF0aC5hYnMoeCAtIHJlY3QucmlnaHQpKTtcbiAgY29uc3QgZGlzdFkgPSBNYXRoLm1heChNYXRoLmFicyh5IC0gcmVjdC50b3ApLCBNYXRoLmFicyh5IC0gcmVjdC5ib3R0b20pKTtcbiAgcmV0dXJuIE1hdGguc3FydChkaXN0WCAqIGRpc3RYICsgZGlzdFkgKiBkaXN0WSk7XG59XG4iXX0=