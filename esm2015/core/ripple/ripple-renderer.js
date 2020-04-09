/**
 * @fileoverview added by tsickle
 * Generated from: src/material/core/ripple/ripple-renderer.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { coerceElement } from '@angular/cdk/coercion';
import { RippleRef } from './ripple-ref';
/**
 * Interface that describes the configuration for the animation of a ripple.
 * There are two animation phases with different durations for the ripples.
 * @record
 */
export function RippleAnimationConfig() { }
if (false) {
    /**
     * Duration in milliseconds for the enter animation (expansion from point of contact).
     * @type {?|undefined}
     */
    RippleAnimationConfig.prototype.enterDuration;
    /**
     * Duration in milliseconds for the exit animation (fade-out).
     * @type {?|undefined}
     */
    RippleAnimationConfig.prototype.exitDuration;
}
/**
 * Interface that describes the target for launching ripples.
 * It defines the ripple configuration and disabled state for interaction ripples.
 * \@docs-private
 * @record
 */
export function RippleTarget() { }
if (false) {
    /**
     * Configuration for ripples that are launched on pointer down.
     * @type {?}
     */
    RippleTarget.prototype.rippleConfig;
    /**
     * Whether ripples on pointer down should be disabled.
     * @type {?}
     */
    RippleTarget.prototype.rippleDisabled;
}
/**
 * Default ripple animation configuration for ripples without an explicit
 * animation config specified.
 * @type {?}
 */
export const defaultRippleAnimationConfig = {
    enterDuration: 450,
    exitDuration: 400
};
/**
 * Timeout for ignoring mouse events. Mouse events will be temporary ignored after touch
 * events to avoid synthetic mouse events.
 * @type {?}
 */
const ignoreMouseEventsTimeout = 800;
/**
 * Options that apply to all the event listeners that are bound by the ripple renderer.
 * @type {?}
 */
const passiveEventOptions = normalizePassiveListenerOptions({ passive: true });
/**
 * Events that signal that the pointer is down.
 * @type {?}
 */
const pointerDownEvents = ['mousedown', 'touchstart'];
/**
 * Events that signal that the pointer is up.
 * @type {?}
 */
const pointerUpEvents = ['mouseup', 'mouseleave', 'touchend', 'touchcancel'];
/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple directive's host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 * This will eventually become a custom renderer once Angular support exists.
 * \@docs-private
 */
export class RippleRenderer {
    /**
     * @param {?} _target
     * @param {?} _ngZone
     * @param {?} elementOrElementRef
     * @param {?} platform
     */
    constructor(_target, _ngZone, elementOrElementRef, platform) {
        this._target = _target;
        this._ngZone = _ngZone;
        /**
         * Whether the pointer is currently down or not.
         */
        this._isPointerDown = false;
        /**
         * Set of currently active ripple references.
         */
        this._activeRipples = new Set();
        /**
         * Whether pointer-up event listeners have been registered.
         */
        this._pointerUpEventsRegistered = false;
        // Only do anything if we're on the browser.
        if (platform.isBrowser) {
            this._containerElement = coerceElement(elementOrElementRef);
        }
    }
    /**
     * Fades in a ripple at the given coordinates.
     * @param {?} x Coordinate within the element, along the X axis at which to start the ripple.
     * @param {?} y Coordinate within the element, along the Y axis at which to start the ripple.
     * @param {?=} config Extra ripple options.
     * @return {?}
     */
    fadeInRipple(x, y, config = {}) {
        /** @type {?} */
        const containerRect = this._containerRect =
            this._containerRect || this._containerElement.getBoundingClientRect();
        /** @type {?} */
        const animationConfig = Object.assign(Object.assign({}, defaultRippleAnimationConfig), config.animation);
        if (config.centered) {
            x = containerRect.left + containerRect.width / 2;
            y = containerRect.top + containerRect.height / 2;
        }
        /** @type {?} */
        const radius = config.radius || distanceToFurthestCorner(x, y, containerRect);
        /** @type {?} */
        const offsetX = x - containerRect.left;
        /** @type {?} */
        const offsetY = y - containerRect.top;
        /** @type {?} */
        const duration = animationConfig.enterDuration;
        /** @type {?} */
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
        ripple.style.transitionDuration = `${duration}ms`;
        this._containerElement.appendChild(ripple);
        // By default the browser does not recalculate the styles of dynamically created
        // ripple elements. This is critical because then the `scale` would not animate properly.
        enforceStyleRecalculation(ripple);
        ripple.style.transform = 'scale(1)';
        // Exposed reference to the ripple that will be returned.
        /** @type {?} */
        const rippleRef = new RippleRef(this, ripple, config);
        rippleRef.state = 0 /* FADING_IN */;
        // Add the ripple reference to the list of all active ripples.
        this._activeRipples.add(rippleRef);
        if (!config.persistent) {
            this._mostRecentTransientRipple = rippleRef;
        }
        // Wait for the ripple element to be completely faded in.
        // Once it's faded in, the ripple can be hidden immediately if the mouse is released.
        this._runTimeoutOutsideZone((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const isMostRecentTransientRipple = rippleRef === this._mostRecentTransientRipple;
            rippleRef.state = 1 /* VISIBLE */;
            // When the timer runs out while the user has kept their pointer down, we want to
            // keep only the persistent ripples and the latest transient ripple. We do this,
            // because we don't want stacked transient ripples to appear after their enter
            // animation has finished.
            if (!config.persistent && (!isMostRecentTransientRipple || !this._isPointerDown)) {
                rippleRef.fadeOut();
            }
        }), duration);
        return rippleRef;
    }
    /**
     * Fades out a ripple reference.
     * @param {?} rippleRef
     * @return {?}
     */
    fadeOutRipple(rippleRef) {
        /** @type {?} */
        const wasActive = this._activeRipples.delete(rippleRef);
        if (rippleRef === this._mostRecentTransientRipple) {
            this._mostRecentTransientRipple = null;
        }
        // Clear out the cached bounding rect if we have no more ripples.
        if (!this._activeRipples.size) {
            this._containerRect = null;
        }
        // For ripples that are not active anymore, don't re-run the fade-out animation.
        if (!wasActive) {
            return;
        }
        /** @type {?} */
        const rippleEl = rippleRef.element;
        /** @type {?} */
        const animationConfig = Object.assign(Object.assign({}, defaultRippleAnimationConfig), rippleRef.config.animation);
        rippleEl.style.transitionDuration = `${animationConfig.exitDuration}ms`;
        rippleEl.style.opacity = '0';
        rippleRef.state = 2 /* FADING_OUT */;
        // Once the ripple faded out, the ripple can be safely removed from the DOM.
        this._runTimeoutOutsideZone((/**
         * @return {?}
         */
        () => {
            rippleRef.state = 3 /* HIDDEN */;
            (/** @type {?} */ (rippleEl.parentNode)).removeChild(rippleEl);
        }), animationConfig.exitDuration);
    }
    /**
     * Fades out all currently active ripples.
     * @return {?}
     */
    fadeOutAll() {
        this._activeRipples.forEach((/**
         * @param {?} ripple
         * @return {?}
         */
        ripple => ripple.fadeOut()));
    }
    /**
     * Sets up the trigger event listeners
     * @param {?} elementOrElementRef
     * @return {?}
     */
    setupTriggerEvents(elementOrElementRef) {
        /** @type {?} */
        const element = coerceElement(elementOrElementRef);
        if (!element || element === this._triggerElement) {
            return;
        }
        // Remove all previously registered event listeners from the trigger element.
        this._removeTriggerEvents();
        this._triggerElement = element;
        this._registerEvents(pointerDownEvents);
    }
    /**
     * Handles all registered events.
     * \@docs-private
     * @param {?} event
     * @return {?}
     */
    handleEvent(event) {
        if (event.type === 'mousedown') {
            this._onMousedown((/** @type {?} */ (event)));
        }
        else if (event.type === 'touchstart') {
            this._onTouchStart((/** @type {?} */ (event)));
        }
        else {
            this._onPointerUp();
        }
        // If pointer-up events haven't been registered yet, do so now.
        // We do this on-demand in order to reduce the total number of event listeners
        // registered by the ripples, which speeds up the rendering time for large UIs.
        if (!this._pointerUpEventsRegistered) {
            this._registerEvents(pointerUpEvents);
            this._pointerUpEventsRegistered = true;
        }
    }
    /**
     * Function being called whenever the trigger is being pressed using mouse.
     * @private
     * @param {?} event
     * @return {?}
     */
    _onMousedown(event) {
        // Screen readers will fire fake mouse events for space/enter. Skip launching a
        // ripple in this case for consistency with the non-screen-reader experience.
        /** @type {?} */
        const isFakeMousedown = isFakeMousedownFromScreenReader(event);
        /** @type {?} */
        const isSyntheticEvent = this._lastTouchStartEvent &&
            Date.now() < this._lastTouchStartEvent + ignoreMouseEventsTimeout;
        if (!this._target.rippleDisabled && !isFakeMousedown && !isSyntheticEvent) {
            this._isPointerDown = true;
            this.fadeInRipple(event.clientX, event.clientY, this._target.rippleConfig);
        }
    }
    /**
     * Function being called whenever the trigger is being pressed using touch.
     * @private
     * @param {?} event
     * @return {?}
     */
    _onTouchStart(event) {
        if (!this._target.rippleDisabled) {
            // Some browsers fire mouse events after a `touchstart` event. Those synthetic mouse
            // events will launch a second ripple if we don't ignore mouse events for a specific
            // time after a touchstart event.
            this._lastTouchStartEvent = Date.now();
            this._isPointerDown = true;
            // Use `changedTouches` so we skip any touches where the user put
            // their finger down, but used another finger to tap the element again.
            /** @type {?} */
            const touches = event.changedTouches;
            for (let i = 0; i < touches.length; i++) {
                this.fadeInRipple(touches[i].clientX, touches[i].clientY, this._target.rippleConfig);
            }
        }
    }
    /**
     * Function being called whenever the trigger is being released.
     * @private
     * @return {?}
     */
    _onPointerUp() {
        if (!this._isPointerDown) {
            return;
        }
        this._isPointerDown = false;
        // Fade-out all ripples that are visible and not persistent.
        this._activeRipples.forEach((/**
         * @param {?} ripple
         * @return {?}
         */
        ripple => {
            // By default, only ripples that are completely visible will fade out on pointer release.
            // If the `terminateOnPointerUp` option is set, ripples that still fade in will also fade out.
            /** @type {?} */
            const isVisible = ripple.state === 1 /* VISIBLE */ ||
                ripple.config.terminateOnPointerUp && ripple.state === 0 /* FADING_IN */;
            if (!ripple.config.persistent && isVisible) {
                ripple.fadeOut();
            }
        }));
    }
    /**
     * Runs a timeout outside of the Angular zone to avoid triggering the change detection.
     * @private
     * @param {?} fn
     * @param {?=} delay
     * @return {?}
     */
    _runTimeoutOutsideZone(fn, delay = 0) {
        this._ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => setTimeout(fn, delay)));
    }
    /**
     * Registers event listeners for a given list of events.
     * @private
     * @param {?} eventTypes
     * @return {?}
     */
    _registerEvents(eventTypes) {
        this._ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            eventTypes.forEach((/**
             * @param {?} type
             * @return {?}
             */
            (type) => {
                (/** @type {?} */ (this._triggerElement)).addEventListener(type, this, passiveEventOptions);
            }));
        }));
    }
    /**
     * Removes previously registered event listeners from the trigger element.
     * @return {?}
     */
    _removeTriggerEvents() {
        if (this._triggerElement) {
            pointerDownEvents.forEach((/**
             * @param {?} type
             * @return {?}
             */
            (type) => {
                (/** @type {?} */ (this._triggerElement)).removeEventListener(type, this, passiveEventOptions);
            }));
            if (this._pointerUpEventsRegistered) {
                pointerUpEvents.forEach((/**
                 * @param {?} type
                 * @return {?}
                 */
                (type) => {
                    (/** @type {?} */ (this._triggerElement)).removeEventListener(type, this, passiveEventOptions);
                }));
            }
        }
    }
}
if (false) {
    /**
     * Element where the ripples are being added to.
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._containerElement;
    /**
     * Element which triggers the ripple elements on mouse events.
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._triggerElement;
    /**
     * Whether the pointer is currently down or not.
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._isPointerDown;
    /**
     * Set of currently active ripple references.
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._activeRipples;
    /**
     * Latest non-persistent ripple that was triggered.
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._mostRecentTransientRipple;
    /**
     * Time in milliseconds when the last touchstart event happened.
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._lastTouchStartEvent;
    /**
     * Whether pointer-up event listeners have been registered.
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._pointerUpEventsRegistered;
    /**
     * Cached dimensions of the ripple container. Set when the first
     * ripple is shown and cleared once no more ripples are visible.
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._containerRect;
    /**
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._target;
    /**
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._ngZone;
}
/**
 * Enforces a style recalculation of a DOM element by computing its styles.
 * @param {?} element
 * @return {?}
 */
function enforceStyleRecalculation(element) {
    // Enforce a style recalculation by calling `getComputedStyle` and accessing any property.
    // Calling `getPropertyValue` is important to let optimizers know that this is not a noop.
    // See: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
    window.getComputedStyle(element).getPropertyValue('opacity');
}
/**
 * Returns the distance from the point (x, y) to the furthest corner of a rectangle.
 * @param {?} x
 * @param {?} y
 * @param {?} rect
 * @return {?}
 */
function distanceToFurthestCorner(x, y, rect) {
    /** @type {?} */
    const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    /** @type {?} */
    const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS1yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQVFBLE9BQU8sRUFBVywrQkFBK0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hGLE9BQU8sRUFBQywrQkFBK0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2xFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsU0FBUyxFQUFjLE1BQU0sY0FBYyxDQUFDOzs7Ozs7QUFlcEQsMkNBS0M7Ozs7OztJQUhDLDhDQUF1Qjs7Ozs7SUFFdkIsNkNBQXNCOzs7Ozs7OztBQVF4QixrQ0FLQzs7Ozs7O0lBSEMsb0NBQTJCOzs7OztJQUUzQixzQ0FBd0I7Ozs7Ozs7QUFPMUIsTUFBTSxPQUFPLDRCQUE0QixHQUFHO0lBQzFDLGFBQWEsRUFBRSxHQUFHO0lBQ2xCLFlBQVksRUFBRSxHQUFHO0NBQ2xCOzs7Ozs7TUFNSyx3QkFBd0IsR0FBRyxHQUFHOzs7OztNQUc5QixtQkFBbUIsR0FBRywrQkFBK0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQzs7Ozs7TUFHdEUsaUJBQWlCLEdBQUcsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDOzs7OztNQUcvQyxlQUFlLEdBQUcsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxhQUFhLENBQUM7Ozs7Ozs7O0FBUzVFLE1BQU0sT0FBTyxjQUFjOzs7Ozs7O0lBNEJ6QixZQUFvQixPQUFxQixFQUNyQixPQUFlLEVBQ3ZCLG1CQUEwRCxFQUMxRCxRQUFrQjtRQUhWLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFDckIsWUFBTyxHQUFQLE9BQU8sQ0FBUTs7OztRQXJCM0IsbUJBQWMsR0FBRyxLQUFLLENBQUM7Ozs7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QUNuRSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztBQUNsRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0VsZW1lbnRSZWYsIE5nWm9uZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsYXRmb3JtLCBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtpc0Zha2VNb3VzZWRvd25Gcm9tU2NyZWVuUmVhZGVyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge2NvZXJjZUVsZW1lbnR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1JpcHBsZVJlZiwgUmlwcGxlU3RhdGV9IGZyb20gJy4vcmlwcGxlLXJlZic7XG5cbmV4cG9ydCB0eXBlIFJpcHBsZUNvbmZpZyA9IHtcbiAgY29sb3I/OiBzdHJpbmc7XG4gIGNlbnRlcmVkPzogYm9vbGVhbjtcbiAgcmFkaXVzPzogbnVtYmVyO1xuICBwZXJzaXN0ZW50PzogYm9vbGVhbjtcbiAgYW5pbWF0aW9uPzogUmlwcGxlQW5pbWF0aW9uQ29uZmlnO1xuICB0ZXJtaW5hdGVPblBvaW50ZXJVcD86IGJvb2xlYW47XG59O1xuXG4vKipcbiAqIEludGVyZmFjZSB0aGF0IGRlc2NyaWJlcyB0aGUgY29uZmlndXJhdGlvbiBmb3IgdGhlIGFuaW1hdGlvbiBvZiBhIHJpcHBsZS5cbiAqIFRoZXJlIGFyZSB0d28gYW5pbWF0aW9uIHBoYXNlcyB3aXRoIGRpZmZlcmVudCBkdXJhdGlvbnMgZm9yIHRoZSByaXBwbGVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJpcHBsZUFuaW1hdGlvbkNvbmZpZyB7XG4gIC8qKiBEdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSBlbnRlciBhbmltYXRpb24gKGV4cGFuc2lvbiBmcm9tIHBvaW50IG9mIGNvbnRhY3QpLiAqL1xuICBlbnRlckR1cmF0aW9uPzogbnVtYmVyO1xuICAvKiogRHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzIGZvciB0aGUgZXhpdCBhbmltYXRpb24gKGZhZGUtb3V0KS4gKi9cbiAgZXhpdER1cmF0aW9uPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSB0aGF0IGRlc2NyaWJlcyB0aGUgdGFyZ2V0IGZvciBsYXVuY2hpbmcgcmlwcGxlcy5cbiAqIEl0IGRlZmluZXMgdGhlIHJpcHBsZSBjb25maWd1cmF0aW9uIGFuZCBkaXNhYmxlZCBzdGF0ZSBmb3IgaW50ZXJhY3Rpb24gcmlwcGxlcy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSaXBwbGVUYXJnZXQge1xuICAvKiogQ29uZmlndXJhdGlvbiBmb3IgcmlwcGxlcyB0aGF0IGFyZSBsYXVuY2hlZCBvbiBwb2ludGVyIGRvd24uICovXG4gIHJpcHBsZUNvbmZpZzogUmlwcGxlQ29uZmlnO1xuICAvKiogV2hldGhlciByaXBwbGVzIG9uIHBvaW50ZXIgZG93biBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIHJpcHBsZURpc2FibGVkOiBib29sZWFuO1xufVxuXG4vKipcbiAqIERlZmF1bHQgcmlwcGxlIGFuaW1hdGlvbiBjb25maWd1cmF0aW9uIGZvciByaXBwbGVzIHdpdGhvdXQgYW4gZXhwbGljaXRcbiAqIGFuaW1hdGlvbiBjb25maWcgc3BlY2lmaWVkLlxuICovXG5leHBvcnQgY29uc3QgZGVmYXVsdFJpcHBsZUFuaW1hdGlvbkNvbmZpZyA9IHtcbiAgZW50ZXJEdXJhdGlvbjogNDUwLFxuICBleGl0RHVyYXRpb246IDQwMFxufTtcblxuLyoqXG4gKiBUaW1lb3V0IGZvciBpZ25vcmluZyBtb3VzZSBldmVudHMuIE1vdXNlIGV2ZW50cyB3aWxsIGJlIHRlbXBvcmFyeSBpZ25vcmVkIGFmdGVyIHRvdWNoXG4gKiBldmVudHMgdG8gYXZvaWQgc3ludGhldGljIG1vdXNlIGV2ZW50cy5cbiAqL1xuY29uc3QgaWdub3JlTW91c2VFdmVudHNUaW1lb3V0ID0gODAwO1xuXG4vKiogT3B0aW9ucyB0aGF0IGFwcGx5IHRvIGFsbCB0aGUgZXZlbnQgbGlzdGVuZXJzIHRoYXQgYXJlIGJvdW5kIGJ5IHRoZSByaXBwbGUgcmVuZGVyZXIuICovXG5jb25zdCBwYXNzaXZlRXZlbnRPcHRpb25zID0gbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyh7cGFzc2l2ZTogdHJ1ZX0pO1xuXG4vKiogRXZlbnRzIHRoYXQgc2lnbmFsIHRoYXQgdGhlIHBvaW50ZXIgaXMgZG93bi4gKi9cbmNvbnN0IHBvaW50ZXJEb3duRXZlbnRzID0gWydtb3VzZWRvd24nLCAndG91Y2hzdGFydCddO1xuXG4vKiogRXZlbnRzIHRoYXQgc2lnbmFsIHRoYXQgdGhlIHBvaW50ZXIgaXMgdXAuICovXG5jb25zdCBwb2ludGVyVXBFdmVudHMgPSBbJ21vdXNldXAnLCAnbW91c2VsZWF2ZScsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCddO1xuXG4vKipcbiAqIEhlbHBlciBzZXJ2aWNlIHRoYXQgcGVyZm9ybXMgRE9NIG1hbmlwdWxhdGlvbnMuIE5vdCBpbnRlbmRlZCB0byBiZSB1c2VkIG91dHNpZGUgdGhpcyBtb2R1bGUuXG4gKiBUaGUgY29uc3RydWN0b3IgdGFrZXMgYSByZWZlcmVuY2UgdG8gdGhlIHJpcHBsZSBkaXJlY3RpdmUncyBob3N0IGVsZW1lbnQgYW5kIGEgbWFwIG9mIERPTVxuICogZXZlbnQgaGFuZGxlcnMgdG8gYmUgaW5zdGFsbGVkIG9uIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcnMgcmlwcGxlIGFuaW1hdGlvbnMuXG4gKiBUaGlzIHdpbGwgZXZlbnR1YWxseSBiZWNvbWUgYSBjdXN0b20gcmVuZGVyZXIgb25jZSBBbmd1bGFyIHN1cHBvcnQgZXhpc3RzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgUmlwcGxlUmVuZGVyZXIgaW1wbGVtZW50cyBFdmVudExpc3RlbmVyT2JqZWN0IHtcbiAgLyoqIEVsZW1lbnQgd2hlcmUgdGhlIHJpcHBsZXMgYXJlIGJlaW5nIGFkZGVkIHRvLiAqL1xuICBwcml2YXRlIF9jb250YWluZXJFbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAvKiogRWxlbWVudCB3aGljaCB0cmlnZ2VycyB0aGUgcmlwcGxlIGVsZW1lbnRzIG9uIG1vdXNlIGV2ZW50cy4gKi9cbiAgcHJpdmF0ZSBfdHJpZ2dlckVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgcG9pbnRlciBpcyBjdXJyZW50bHkgZG93biBvciBub3QuICovXG4gIHByaXZhdGUgX2lzUG9pbnRlckRvd24gPSBmYWxzZTtcblxuICAvKiogU2V0IG9mIGN1cnJlbnRseSBhY3RpdmUgcmlwcGxlIHJlZmVyZW5jZXMuICovXG4gIHByaXZhdGUgX2FjdGl2ZVJpcHBsZXMgPSBuZXcgU2V0PFJpcHBsZVJlZj4oKTtcblxuICAvKiogTGF0ZXN0IG5vbi1wZXJzaXN0ZW50IHJpcHBsZSB0aGF0IHdhcyB0cmlnZ2VyZWQuICovXG4gIHByaXZhdGUgX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGU6IFJpcHBsZVJlZiB8IG51bGw7XG5cbiAgLyoqIFRpbWUgaW4gbWlsbGlzZWNvbmRzIHdoZW4gdGhlIGxhc3QgdG91Y2hzdGFydCBldmVudCBoYXBwZW5lZC4gKi9cbiAgcHJpdmF0ZSBfbGFzdFRvdWNoU3RhcnRFdmVudDogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHBvaW50ZXItdXAgZXZlbnQgbGlzdGVuZXJzIGhhdmUgYmVlbiByZWdpc3RlcmVkLiAqL1xuICBwcml2YXRlIF9wb2ludGVyVXBFdmVudHNSZWdpc3RlcmVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIENhY2hlZCBkaW1lbnNpb25zIG9mIHRoZSByaXBwbGUgY29udGFpbmVyLiBTZXQgd2hlbiB0aGUgZmlyc3RcbiAgICogcmlwcGxlIGlzIHNob3duIGFuZCBjbGVhcmVkIG9uY2Ugbm8gbW9yZSByaXBwbGVzIGFyZSB2aXNpYmxlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY29udGFpbmVyUmVjdDogQ2xpZW50UmVjdCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdGFyZ2V0OiBSaXBwbGVUYXJnZXQsXG4gICAgICAgICAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBlbGVtZW50T3JFbGVtZW50UmVmOiBIVE1MRWxlbWVudCB8IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwbGF0Zm9ybTogUGxhdGZvcm0pIHtcblxuICAgIC8vIE9ubHkgZG8gYW55dGhpbmcgaWYgd2UncmUgb24gdGhlIGJyb3dzZXIuXG4gICAgaWYgKHBsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29udGFpbmVyRWxlbWVudCA9IGNvZXJjZUVsZW1lbnQoZWxlbWVudE9yRWxlbWVudFJlZik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZhZGVzIGluIGEgcmlwcGxlIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlcy5cbiAgICogQHBhcmFtIHggQ29vcmRpbmF0ZSB3aXRoaW4gdGhlIGVsZW1lbnQsIGFsb25nIHRoZSBYIGF4aXMgYXQgd2hpY2ggdG8gc3RhcnQgdGhlIHJpcHBsZS5cbiAgICogQHBhcmFtIHkgQ29vcmRpbmF0ZSB3aXRoaW4gdGhlIGVsZW1lbnQsIGFsb25nIHRoZSBZIGF4aXMgYXQgd2hpY2ggdG8gc3RhcnQgdGhlIHJpcHBsZS5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSByaXBwbGUgb3B0aW9ucy5cbiAgICovXG4gIGZhZGVJblJpcHBsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uZmlnOiBSaXBwbGVDb25maWcgPSB7fSk6IFJpcHBsZVJlZiB7XG4gICAgY29uc3QgY29udGFpbmVyUmVjdCA9IHRoaXMuX2NvbnRhaW5lclJlY3QgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250YWluZXJSZWN0IHx8IHRoaXMuX2NvbnRhaW5lckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgYW5pbWF0aW9uQ29uZmlnID0gey4uLmRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcsIC4uLmNvbmZpZy5hbmltYXRpb259O1xuXG4gICAgaWYgKGNvbmZpZy5jZW50ZXJlZCkge1xuICAgICAgeCA9IGNvbnRhaW5lclJlY3QubGVmdCArIGNvbnRhaW5lclJlY3Qud2lkdGggLyAyO1xuICAgICAgeSA9IGNvbnRhaW5lclJlY3QudG9wICsgY29udGFpbmVyUmVjdC5oZWlnaHQgLyAyO1xuICAgIH1cblxuICAgIGNvbnN0IHJhZGl1cyA9IGNvbmZpZy5yYWRpdXMgfHwgZGlzdGFuY2VUb0Z1cnRoZXN0Q29ybmVyKHgsIHksIGNvbnRhaW5lclJlY3QpO1xuICAgIGNvbnN0IG9mZnNldFggPSB4IC0gY29udGFpbmVyUmVjdC5sZWZ0O1xuICAgIGNvbnN0IG9mZnNldFkgPSB5IC0gY29udGFpbmVyUmVjdC50b3A7XG4gICAgY29uc3QgZHVyYXRpb24gPSBhbmltYXRpb25Db25maWcuZW50ZXJEdXJhdGlvbjtcblxuICAgIGNvbnN0IHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJpcHBsZS5jbGFzc0xpc3QuYWRkKCdtYXQtcmlwcGxlLWVsZW1lbnQnKTtcblxuICAgIHJpcHBsZS5zdHlsZS5sZWZ0ID0gYCR7b2Zmc2V0WCAtIHJhZGl1c31weGA7XG4gICAgcmlwcGxlLnN0eWxlLnRvcCA9IGAke29mZnNldFkgLSByYWRpdXN9cHhgO1xuICAgIHJpcHBsZS5zdHlsZS5oZWlnaHQgPSBgJHtyYWRpdXMgKiAyfXB4YDtcbiAgICByaXBwbGUuc3R5bGUud2lkdGggPSBgJHtyYWRpdXMgKiAyfXB4YDtcblxuICAgIC8vIElmIGEgY3VzdG9tIGNvbG9yIGhhcyBiZWVuIHNwZWNpZmllZCwgc2V0IGl0IGFzIGlubGluZSBzdHlsZS4gSWYgbm8gY29sb3IgaXNcbiAgICAvLyBzZXQsIHRoZSBkZWZhdWx0IGNvbG9yIHdpbGwgYmUgYXBwbGllZCB0aHJvdWdoIHRoZSByaXBwbGUgdGhlbWUgc3R5bGVzLlxuICAgIGlmIChjb25maWcuY29sb3IgIT0gbnVsbCkge1xuICAgICAgcmlwcGxlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbmZpZy5jb2xvcjtcbiAgICB9XG5cbiAgICByaXBwbGUuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuXG4gICAgdGhpcy5fY29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChyaXBwbGUpO1xuXG4gICAgLy8gQnkgZGVmYXVsdCB0aGUgYnJvd3NlciBkb2VzIG5vdCByZWNhbGN1bGF0ZSB0aGUgc3R5bGVzIG9mIGR5bmFtaWNhbGx5IGNyZWF0ZWRcbiAgICAvLyByaXBwbGUgZWxlbWVudHMuIFRoaXMgaXMgY3JpdGljYWwgYmVjYXVzZSB0aGVuIHRoZSBgc2NhbGVgIHdvdWxkIG5vdCBhbmltYXRlIHByb3Blcmx5LlxuICAgIGVuZm9yY2VTdHlsZVJlY2FsY3VsYXRpb24ocmlwcGxlKTtcblxuICAgIHJpcHBsZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoMSknO1xuXG4gICAgLy8gRXhwb3NlZCByZWZlcmVuY2UgdG8gdGhlIHJpcHBsZSB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuXG4gICAgY29uc3QgcmlwcGxlUmVmID0gbmV3IFJpcHBsZVJlZih0aGlzLCByaXBwbGUsIGNvbmZpZyk7XG5cbiAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5GQURJTkdfSU47XG5cbiAgICAvLyBBZGQgdGhlIHJpcHBsZSByZWZlcmVuY2UgdG8gdGhlIGxpc3Qgb2YgYWxsIGFjdGl2ZSByaXBwbGVzLlxuICAgIHRoaXMuX2FjdGl2ZVJpcHBsZXMuYWRkKHJpcHBsZVJlZik7XG5cbiAgICBpZiAoIWNvbmZpZy5wZXJzaXN0ZW50KSB7XG4gICAgICB0aGlzLl9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlID0gcmlwcGxlUmVmO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIHRoZSByaXBwbGUgZWxlbWVudCB0byBiZSBjb21wbGV0ZWx5IGZhZGVkIGluLlxuICAgIC8vIE9uY2UgaXQncyBmYWRlZCBpbiwgdGhlIHJpcHBsZSBjYW4gYmUgaGlkZGVuIGltbWVkaWF0ZWx5IGlmIHRoZSBtb3VzZSBpcyByZWxlYXNlZC5cbiAgICB0aGlzLl9ydW5UaW1lb3V0T3V0c2lkZVpvbmUoKCkgPT4ge1xuICAgICAgY29uc3QgaXNNb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlID0gcmlwcGxlUmVmID09PSB0aGlzLl9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlO1xuXG4gICAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5WSVNJQkxFO1xuXG4gICAgICAvLyBXaGVuIHRoZSB0aW1lciBydW5zIG91dCB3aGlsZSB0aGUgdXNlciBoYXMga2VwdCB0aGVpciBwb2ludGVyIGRvd24sIHdlIHdhbnQgdG9cbiAgICAgIC8vIGtlZXAgb25seSB0aGUgcGVyc2lzdGVudCByaXBwbGVzIGFuZCB0aGUgbGF0ZXN0IHRyYW5zaWVudCByaXBwbGUuIFdlIGRvIHRoaXMsXG4gICAgICAvLyBiZWNhdXNlIHdlIGRvbid0IHdhbnQgc3RhY2tlZCB0cmFuc2llbnQgcmlwcGxlcyB0byBhcHBlYXIgYWZ0ZXIgdGhlaXIgZW50ZXJcbiAgICAgIC8vIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQuXG4gICAgICBpZiAoIWNvbmZpZy5wZXJzaXN0ZW50ICYmICghaXNNb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlIHx8ICF0aGlzLl9pc1BvaW50ZXJEb3duKSkge1xuICAgICAgICByaXBwbGVSZWYuZmFkZU91dCgpO1xuICAgICAgfVxuICAgIH0sIGR1cmF0aW9uKTtcblxuICAgIHJldHVybiByaXBwbGVSZWY7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGEgcmlwcGxlIHJlZmVyZW5jZS4gKi9cbiAgZmFkZU91dFJpcHBsZShyaXBwbGVSZWY6IFJpcHBsZVJlZikge1xuICAgIGNvbnN0IHdhc0FjdGl2ZSA9IHRoaXMuX2FjdGl2ZVJpcHBsZXMuZGVsZXRlKHJpcHBsZVJlZik7XG5cbiAgICBpZiAocmlwcGxlUmVmID09PSB0aGlzLl9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlKSB7XG4gICAgICB0aGlzLl9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBDbGVhciBvdXQgdGhlIGNhY2hlZCBib3VuZGluZyByZWN0IGlmIHdlIGhhdmUgbm8gbW9yZSByaXBwbGVzLlxuICAgIGlmICghdGhpcy5fYWN0aXZlUmlwcGxlcy5zaXplKSB7XG4gICAgICB0aGlzLl9jb250YWluZXJSZWN0ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBGb3IgcmlwcGxlcyB0aGF0IGFyZSBub3QgYWN0aXZlIGFueW1vcmUsIGRvbid0IHJlLXJ1biB0aGUgZmFkZS1vdXQgYW5pbWF0aW9uLlxuICAgIGlmICghd2FzQWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmlwcGxlRWwgPSByaXBwbGVSZWYuZWxlbWVudDtcbiAgICBjb25zdCBhbmltYXRpb25Db25maWcgPSB7Li4uZGVmYXVsdFJpcHBsZUFuaW1hdGlvbkNvbmZpZywgLi4ucmlwcGxlUmVmLmNvbmZpZy5hbmltYXRpb259O1xuXG4gICAgcmlwcGxlRWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7YW5pbWF0aW9uQ29uZmlnLmV4aXREdXJhdGlvbn1tc2A7XG4gICAgcmlwcGxlRWwuc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5GQURJTkdfT1VUO1xuXG4gICAgLy8gT25jZSB0aGUgcmlwcGxlIGZhZGVkIG91dCwgdGhlIHJpcHBsZSBjYW4gYmUgc2FmZWx5IHJlbW92ZWQgZnJvbSB0aGUgRE9NLlxuICAgIHRoaXMuX3J1blRpbWVvdXRPdXRzaWRlWm9uZSgoKSA9PiB7XG4gICAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5ISURERU47XG4gICAgICByaXBwbGVFbC5wYXJlbnROb2RlIS5yZW1vdmVDaGlsZChyaXBwbGVFbCk7XG4gICAgfSwgYW5pbWF0aW9uQ29uZmlnLmV4aXREdXJhdGlvbik7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGFsbCBjdXJyZW50bHkgYWN0aXZlIHJpcHBsZXMuICovXG4gIGZhZGVPdXRBbGwoKSB7XG4gICAgdGhpcy5fYWN0aXZlUmlwcGxlcy5mb3JFYWNoKHJpcHBsZSA9PiByaXBwbGUuZmFkZU91dCgpKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSB0cmlnZ2VyIGV2ZW50IGxpc3RlbmVycyAqL1xuICBzZXR1cFRyaWdnZXJFdmVudHMoZWxlbWVudE9yRWxlbWVudFJlZjogSFRNTEVsZW1lbnQgfCBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjb2VyY2VFbGVtZW50KGVsZW1lbnRPckVsZW1lbnRSZWYpO1xuXG4gICAgaWYgKCFlbGVtZW50IHx8IGVsZW1lbnQgPT09IHRoaXMuX3RyaWdnZXJFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGFsbCBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHRyaWdnZXIgZWxlbWVudC5cbiAgICB0aGlzLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG5cbiAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMocG9pbnRlckRvd25FdmVudHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYWxsIHJlZ2lzdGVyZWQgZXZlbnRzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBoYW5kbGVFdmVudChldmVudDogRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicpIHtcbiAgICAgIHRoaXMuX29uTW91c2Vkb3duKGV2ZW50IGFzIE1vdXNlRXZlbnQpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG4gICAgICB0aGlzLl9vblRvdWNoU3RhcnQoZXZlbnQgYXMgVG91Y2hFdmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX29uUG9pbnRlclVwKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgcG9pbnRlci11cCBldmVudHMgaGF2ZW4ndCBiZWVuIHJlZ2lzdGVyZWQgeWV0LCBkbyBzbyBub3cuXG4gICAgLy8gV2UgZG8gdGhpcyBvbi1kZW1hbmQgaW4gb3JkZXIgdG8gcmVkdWNlIHRoZSB0b3RhbCBudW1iZXIgb2YgZXZlbnQgbGlzdGVuZXJzXG4gICAgLy8gcmVnaXN0ZXJlZCBieSB0aGUgcmlwcGxlcywgd2hpY2ggc3BlZWRzIHVwIHRoZSByZW5kZXJpbmcgdGltZSBmb3IgbGFyZ2UgVUlzLlxuICAgIGlmICghdGhpcy5fcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCkge1xuICAgICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMocG9pbnRlclVwRXZlbnRzKTtcbiAgICAgIHRoaXMuX3BvaW50ZXJVcEV2ZW50c1JlZ2lzdGVyZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBGdW5jdGlvbiBiZWluZyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHRyaWdnZXIgaXMgYmVpbmcgcHJlc3NlZCB1c2luZyBtb3VzZS4gKi9cbiAgcHJpdmF0ZSBfb25Nb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAvLyBTY3JlZW4gcmVhZGVycyB3aWxsIGZpcmUgZmFrZSBtb3VzZSBldmVudHMgZm9yIHNwYWNlL2VudGVyLiBTa2lwIGxhdW5jaGluZyBhXG4gICAgLy8gcmlwcGxlIGluIHRoaXMgY2FzZSBmb3IgY29uc2lzdGVuY3kgd2l0aCB0aGUgbm9uLXNjcmVlbi1yZWFkZXIgZXhwZXJpZW5jZS5cbiAgICBjb25zdCBpc0Zha2VNb3VzZWRvd24gPSBpc0Zha2VNb3VzZWRvd25Gcm9tU2NyZWVuUmVhZGVyKGV2ZW50KTtcbiAgICBjb25zdCBpc1N5bnRoZXRpY0V2ZW50ID0gdGhpcy5fbGFzdFRvdWNoU3RhcnRFdmVudCAmJlxuICAgICAgICBEYXRlLm5vdygpIDwgdGhpcy5fbGFzdFRvdWNoU3RhcnRFdmVudCArIGlnbm9yZU1vdXNlRXZlbnRzVGltZW91dDtcblxuICAgIGlmICghdGhpcy5fdGFyZ2V0LnJpcHBsZURpc2FibGVkICYmICFpc0Zha2VNb3VzZWRvd24gJiYgIWlzU3ludGhldGljRXZlbnQpIHtcbiAgICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSB0cnVlO1xuICAgICAgdGhpcy5mYWRlSW5SaXBwbGUoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSwgdGhpcy5fdGFyZ2V0LnJpcHBsZUNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZ1bmN0aW9uIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgdHJpZ2dlciBpcyBiZWluZyBwcmVzc2VkIHVzaW5nIHRvdWNoLiAqL1xuICBwcml2YXRlIF9vblRvdWNoU3RhcnQoZXZlbnQ6IFRvdWNoRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuX3RhcmdldC5yaXBwbGVEaXNhYmxlZCkge1xuICAgICAgLy8gU29tZSBicm93c2VycyBmaXJlIG1vdXNlIGV2ZW50cyBhZnRlciBhIGB0b3VjaHN0YXJ0YCBldmVudC4gVGhvc2Ugc3ludGhldGljIG1vdXNlXG4gICAgICAvLyBldmVudHMgd2lsbCBsYXVuY2ggYSBzZWNvbmQgcmlwcGxlIGlmIHdlIGRvbid0IGlnbm9yZSBtb3VzZSBldmVudHMgZm9yIGEgc3BlY2lmaWNcbiAgICAgIC8vIHRpbWUgYWZ0ZXIgYSB0b3VjaHN0YXJ0IGV2ZW50LlxuICAgICAgdGhpcy5fbGFzdFRvdWNoU3RhcnRFdmVudCA9IERhdGUubm93KCk7XG4gICAgICB0aGlzLl9pc1BvaW50ZXJEb3duID0gdHJ1ZTtcblxuICAgICAgLy8gVXNlIGBjaGFuZ2VkVG91Y2hlc2Agc28gd2Ugc2tpcCBhbnkgdG91Y2hlcyB3aGVyZSB0aGUgdXNlciBwdXRcbiAgICAgIC8vIHRoZWlyIGZpbmdlciBkb3duLCBidXQgdXNlZCBhbm90aGVyIGZpbmdlciB0byB0YXAgdGhlIGVsZW1lbnQgYWdhaW4uXG4gICAgICBjb25zdCB0b3VjaGVzID0gZXZlbnQuY2hhbmdlZFRvdWNoZXM7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmZhZGVJblJpcHBsZSh0b3VjaGVzW2ldLmNsaWVudFgsIHRvdWNoZXNbaV0uY2xpZW50WSwgdGhpcy5fdGFyZ2V0LnJpcHBsZUNvbmZpZyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEZ1bmN0aW9uIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgdHJpZ2dlciBpcyBiZWluZyByZWxlYXNlZC4gKi9cbiAgcHJpdmF0ZSBfb25Qb2ludGVyVXAoKSB7XG4gICAgaWYgKCF0aGlzLl9pc1BvaW50ZXJEb3duKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5faXNQb2ludGVyRG93biA9IGZhbHNlO1xuXG4gICAgLy8gRmFkZS1vdXQgYWxsIHJpcHBsZXMgdGhhdCBhcmUgdmlzaWJsZSBhbmQgbm90IHBlcnNpc3RlbnQuXG4gICAgdGhpcy5fYWN0aXZlUmlwcGxlcy5mb3JFYWNoKHJpcHBsZSA9PiB7XG4gICAgICAvLyBCeSBkZWZhdWx0LCBvbmx5IHJpcHBsZXMgdGhhdCBhcmUgY29tcGxldGVseSB2aXNpYmxlIHdpbGwgZmFkZSBvdXQgb24gcG9pbnRlciByZWxlYXNlLlxuICAgICAgLy8gSWYgdGhlIGB0ZXJtaW5hdGVPblBvaW50ZXJVcGAgb3B0aW9uIGlzIHNldCwgcmlwcGxlcyB0aGF0IHN0aWxsIGZhZGUgaW4gd2lsbCBhbHNvIGZhZGUgb3V0LlxuICAgICAgY29uc3QgaXNWaXNpYmxlID0gcmlwcGxlLnN0YXRlID09PSBSaXBwbGVTdGF0ZS5WSVNJQkxFIHx8XG4gICAgICAgIHJpcHBsZS5jb25maWcudGVybWluYXRlT25Qb2ludGVyVXAgJiYgcmlwcGxlLnN0YXRlID09PSBSaXBwbGVTdGF0ZS5GQURJTkdfSU47XG5cbiAgICAgIGlmICghcmlwcGxlLmNvbmZpZy5wZXJzaXN0ZW50ICYmIGlzVmlzaWJsZSkge1xuICAgICAgICByaXBwbGUuZmFkZU91dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJ1bnMgYSB0aW1lb3V0IG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIgem9uZSB0byBhdm9pZCB0cmlnZ2VyaW5nIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uLiAqL1xuICBwcml2YXRlIF9ydW5UaW1lb3V0T3V0c2lkZVpvbmUoZm46IEZ1bmN0aW9uLCBkZWxheSA9IDApIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gc2V0VGltZW91dChmbiwgZGVsYXkpKTtcbiAgfVxuXG4gIC8qKiBSZWdpc3RlcnMgZXZlbnQgbGlzdGVuZXJzIGZvciBhIGdpdmVuIGxpc3Qgb2YgZXZlbnRzLiAqL1xuICBwcml2YXRlIF9yZWdpc3RlckV2ZW50cyhldmVudFR5cGVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBldmVudFR5cGVzLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlckVsZW1lbnQhLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgdGhpcywgcGFzc2l2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdHJpZ2dlciBlbGVtZW50LiAqL1xuICBfcmVtb3ZlVHJpZ2dlckV2ZW50cygpIHtcbiAgICBpZiAodGhpcy5fdHJpZ2dlckVsZW1lbnQpIHtcbiAgICAgIHBvaW50ZXJEb3duRXZlbnRzLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlckVsZW1lbnQhLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgdGhpcywgcGFzc2l2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMuX3BvaW50ZXJVcEV2ZW50c1JlZ2lzdGVyZWQpIHtcbiAgICAgICAgcG9pbnRlclVwRXZlbnRzLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICAgICAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCEucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzLCBwYXNzaXZlRXZlbnRPcHRpb25zKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKiBFbmZvcmNlcyBhIHN0eWxlIHJlY2FsY3VsYXRpb24gb2YgYSBET00gZWxlbWVudCBieSBjb21wdXRpbmcgaXRzIHN0eWxlcy4gKi9cbmZ1bmN0aW9uIGVuZm9yY2VTdHlsZVJlY2FsY3VsYXRpb24oZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgLy8gRW5mb3JjZSBhIHN0eWxlIHJlY2FsY3VsYXRpb24gYnkgY2FsbGluZyBgZ2V0Q29tcHV0ZWRTdHlsZWAgYW5kIGFjY2Vzc2luZyBhbnkgcHJvcGVydHkuXG4gIC8vIENhbGxpbmcgYGdldFByb3BlcnR5VmFsdWVgIGlzIGltcG9ydGFudCB0byBsZXQgb3B0aW1pemVycyBrbm93IHRoYXQgdGhpcyBpcyBub3QgYSBub29wLlxuICAvLyBTZWU6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC81ZDUyZmIwODFiMzU3MGM4MWUzYVxuICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdvcGFjaXR5Jyk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgcG9pbnQgKHgsIHkpIHRvIHRoZSBmdXJ0aGVzdCBjb3JuZXIgb2YgYSByZWN0YW5nbGUuXG4gKi9cbmZ1bmN0aW9uIGRpc3RhbmNlVG9GdXJ0aGVzdENvcm5lcih4OiBudW1iZXIsIHk6IG51bWJlciwgcmVjdDogQ2xpZW50UmVjdCkge1xuICBjb25zdCBkaXN0WCA9IE1hdGgubWF4KE1hdGguYWJzKHggLSByZWN0LmxlZnQpLCBNYXRoLmFicyh4IC0gcmVjdC5yaWdodCkpO1xuICBjb25zdCBkaXN0WSA9IE1hdGgubWF4KE1hdGguYWJzKHkgLSByZWN0LnRvcCksIE1hdGguYWJzKHkgLSByZWN0LmJvdHRvbSkpO1xuICByZXR1cm4gTWF0aC5zcXJ0KGRpc3RYICogZGlzdFggKyBkaXN0WSAqIGRpc3RZKTtcbn1cbiJdfQ==