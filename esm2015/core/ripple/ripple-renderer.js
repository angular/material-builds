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
         * Events to be registered on the trigger element.
         */
        this._triggerEvents = new Map();
        /**
         * Set of currently active ripple references.
         */
        this._activeRipples = new Set();
        /**
         * Function being called whenever the trigger is being pressed using mouse.
         */
        this._onMousedown = (/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
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
        });
        /**
         * Function being called whenever the trigger is being pressed using touch.
         */
        this._onTouchStart = (/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
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
        });
        /**
         * Function being called whenever the trigger is being released.
         */
        this._onPointerUp = (/**
         * @return {?}
         */
        () => {
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
        });
        // Only do anything if we're on the browser.
        if (platform.isBrowser) {
            this._containerElement = coerceElement(elementOrElementRef);
            // Specify events which need to be registered on the trigger.
            this._triggerEvents
                .set('mousedown', this._onMousedown)
                .set('mouseup', this._onPointerUp)
                .set('mouseleave', this._onPointerUp)
                .set('touchstart', this._onTouchStart)
                .set('touchend', this._onPointerUp)
                .set('touchcancel', this._onPointerUp);
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
        this._ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            this._triggerEvents.forEach((/**
             * @param {?} fn
             * @param {?} type
             * @return {?}
             */
            (fn, type) => {
                element.addEventListener(type, fn, passiveEventOptions);
            }));
        }));
        this._triggerElement = element;
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
     * Removes previously registered event listeners from the trigger element.
     * @return {?}
     */
    _removeTriggerEvents() {
        if (this._triggerElement) {
            this._triggerEvents.forEach((/**
             * @param {?} fn
             * @param {?} type
             * @return {?}
             */
            (fn, type) => {
                (/** @type {?} */ (this._triggerElement)).removeEventListener(type, fn, passiveEventOptions);
            }));
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
     * Events to be registered on the trigger element.
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._triggerEvents;
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
     * Cached dimensions of the ripple container. Set when the first
     * ripple is shown and cleared once no more ripples are visible.
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._containerRect;
    /**
     * Function being called whenever the trigger is being pressed using mouse.
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._onMousedown;
    /**
     * Function being called whenever the trigger is being pressed using touch.
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._onTouchStart;
    /**
     * Function being called whenever the trigger is being released.
     * @type {?}
     * @private
     */
    RippleRenderer.prototype._onPointerUp;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS1yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQVFBLE9BQU8sRUFBVywrQkFBK0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hGLE9BQU8sRUFBQywrQkFBK0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2xFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsU0FBUyxFQUFjLE1BQU0sY0FBYyxDQUFDOzs7Ozs7QUFlcEQsMkNBS0M7Ozs7OztJQUhDLDhDQUF1Qjs7Ozs7SUFFdkIsNkNBQXNCOzs7Ozs7OztBQVF4QixrQ0FLQzs7Ozs7O0lBSEMsb0NBQTJCOzs7OztJQUUzQixzQ0FBd0I7Ozs7Ozs7QUFPMUIsTUFBTSxPQUFPLDRCQUE0QixHQUFHO0lBQzFDLGFBQWEsRUFBRSxHQUFHO0lBQ2xCLFlBQVksRUFBRSxHQUFHO0NBQ2xCOzs7Ozs7TUFNSyx3QkFBd0IsR0FBRyxHQUFHOzs7OztNQUc5QixtQkFBbUIsR0FBRywrQkFBK0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQzs7Ozs7Ozs7QUFTNUUsTUFBTSxPQUFPLGNBQWM7Ozs7Ozs7SUE0QnpCLFlBQW9CLE9BQXFCLEVBQ3JCLE9BQWUsRUFDdkIsbUJBQTBELEVBQzFELFFBQWtCO1FBSFYsWUFBTyxHQUFQLE9BQU8sQ0FBYztRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUFROzs7O1FBckIzQixtQkFBYyxHQUFHLEtBQUssQ0FBQzs7OztRQUd2QixtQkFBYyxHQUFHLElBQUksR0FBRyxFQUFlLENBQUM7Ozs7UUFHeEMsbUJBQWMsR0FBRyxJQUFJLEdBQUcsRUFBYSxDQUFDOzs7O1FBeUt0QyxpQkFBWTs7OztRQUFHLENBQUMsS0FBaUIs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Qzs7Ozs7O0lBRzVDLHdDQUErQjs7Ozs7O0lBRy9CLHdDQUFnRDs7Ozs7O0lBR2hELHdDQUE4Qzs7Ozs7O0lBRzlDLG9EQUFxRDs7Ozs7O0lBR3JELDhDQUFxQzs7Ozs7OztJQU1yQyx3Q0FBMEM7Ozs7OztJQTZKMUMsc0NBV0M7Ozs7OztJQUdELHVDQWdCQzs7Ozs7O0lBR0Qsc0NBa0JDOzs7OztJQTlNVyxpQ0FBNkI7Ozs7O0lBQzdCLGlDQUF1Qjs7Ozs7OztBQStOckMsU0FBUyx5QkFBeUIsQ0FBQyxPQUFvQjtJQUNyRCwwRkFBMEY7SUFDMUYsMEZBQTBGO0lBQzFGLDhEQUE4RDtJQUM5RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0QsQ0FBQzs7Ozs7Ozs7QUFLRCxTQUFTLHdCQUF3QixDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsSUFBZ0I7O1VBQ2hFLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O1VBQ25FLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQ2xELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudFJlZiwgTmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGxhdGZvcm0sIG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge2lzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Y29lcmNlRWxlbWVudH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UmlwcGxlUmVmLCBSaXBwbGVTdGF0ZX0gZnJvbSAnLi9yaXBwbGUtcmVmJztcblxuZXhwb3J0IHR5cGUgUmlwcGxlQ29uZmlnID0ge1xuICBjb2xvcj86IHN0cmluZztcbiAgY2VudGVyZWQ/OiBib29sZWFuO1xuICByYWRpdXM/OiBudW1iZXI7XG4gIHBlcnNpc3RlbnQ/OiBib29sZWFuO1xuICBhbmltYXRpb24/OiBSaXBwbGVBbmltYXRpb25Db25maWc7XG4gIHRlcm1pbmF0ZU9uUG9pbnRlclVwPzogYm9vbGVhbjtcbn07XG5cbi8qKlxuICogSW50ZXJmYWNlIHRoYXQgZGVzY3JpYmVzIHRoZSBjb25maWd1cmF0aW9uIGZvciB0aGUgYW5pbWF0aW9uIG9mIGEgcmlwcGxlLlxuICogVGhlcmUgYXJlIHR3byBhbmltYXRpb24gcGhhc2VzIHdpdGggZGlmZmVyZW50IGR1cmF0aW9ucyBmb3IgdGhlIHJpcHBsZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmlwcGxlQW5pbWF0aW9uQ29uZmlnIHtcbiAgLyoqIER1cmF0aW9uIGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIGVudGVyIGFuaW1hdGlvbiAoZXhwYW5zaW9uIGZyb20gcG9pbnQgb2YgY29udGFjdCkuICovXG4gIGVudGVyRHVyYXRpb24/OiBudW1iZXI7XG4gIC8qKiBEdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSBleGl0IGFuaW1hdGlvbiAoZmFkZS1vdXQpLiAqL1xuICBleGl0RHVyYXRpb24/OiBudW1iZXI7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIHRoYXQgZGVzY3JpYmVzIHRoZSB0YXJnZXQgZm9yIGxhdW5jaGluZyByaXBwbGVzLlxuICogSXQgZGVmaW5lcyB0aGUgcmlwcGxlIGNvbmZpZ3VyYXRpb24gYW5kIGRpc2FibGVkIHN0YXRlIGZvciBpbnRlcmFjdGlvbiByaXBwbGVzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJpcHBsZVRhcmdldCB7XG4gIC8qKiBDb25maWd1cmF0aW9uIGZvciByaXBwbGVzIHRoYXQgYXJlIGxhdW5jaGVkIG9uIHBvaW50ZXIgZG93bi4gKi9cbiAgcmlwcGxlQ29uZmlnOiBSaXBwbGVDb25maWc7XG4gIC8qKiBXaGV0aGVyIHJpcHBsZXMgb24gcG9pbnRlciBkb3duIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgcmlwcGxlRGlzYWJsZWQ6IGJvb2xlYW47XG59XG5cbi8qKlxuICogRGVmYXVsdCByaXBwbGUgYW5pbWF0aW9uIGNvbmZpZ3VyYXRpb24gZm9yIHJpcHBsZXMgd2l0aG91dCBhbiBleHBsaWNpdFxuICogYW5pbWF0aW9uIGNvbmZpZyBzcGVjaWZpZWQuXG4gKi9cbmV4cG9ydCBjb25zdCBkZWZhdWx0UmlwcGxlQW5pbWF0aW9uQ29uZmlnID0ge1xuICBlbnRlckR1cmF0aW9uOiA0NTAsXG4gIGV4aXREdXJhdGlvbjogNDAwXG59O1xuXG4vKipcbiAqIFRpbWVvdXQgZm9yIGlnbm9yaW5nIG1vdXNlIGV2ZW50cy4gTW91c2UgZXZlbnRzIHdpbGwgYmUgdGVtcG9yYXJ5IGlnbm9yZWQgYWZ0ZXIgdG91Y2hcbiAqIGV2ZW50cyB0byBhdm9pZCBzeW50aGV0aWMgbW91c2UgZXZlbnRzLlxuICovXG5jb25zdCBpZ25vcmVNb3VzZUV2ZW50c1RpbWVvdXQgPSA4MDA7XG5cbi8qKiBPcHRpb25zIHRoYXQgYXBwbHkgdG8gYWxsIHRoZSBldmVudCBsaXN0ZW5lcnMgdGhhdCBhcmUgYm91bmQgYnkgdGhlIHJpcHBsZSByZW5kZXJlci4gKi9cbmNvbnN0IHBhc3NpdmVFdmVudE9wdGlvbnMgPSBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHtwYXNzaXZlOiB0cnVlfSk7XG5cbi8qKlxuICogSGVscGVyIHNlcnZpY2UgdGhhdCBwZXJmb3JtcyBET00gbWFuaXB1bGF0aW9ucy4gTm90IGludGVuZGVkIHRvIGJlIHVzZWQgb3V0c2lkZSB0aGlzIG1vZHVsZS5cbiAqIFRoZSBjb25zdHJ1Y3RvciB0YWtlcyBhIHJlZmVyZW5jZSB0byB0aGUgcmlwcGxlIGRpcmVjdGl2ZSdzIGhvc3QgZWxlbWVudCBhbmQgYSBtYXAgb2YgRE9NXG4gKiBldmVudCBoYW5kbGVycyB0byBiZSBpbnN0YWxsZWQgb24gdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VycyByaXBwbGUgYW5pbWF0aW9ucy5cbiAqIFRoaXMgd2lsbCBldmVudHVhbGx5IGJlY29tZSBhIGN1c3RvbSByZW5kZXJlciBvbmNlIEFuZ3VsYXIgc3VwcG9ydCBleGlzdHMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBSaXBwbGVSZW5kZXJlciB7XG4gIC8qKiBFbGVtZW50IHdoZXJlIHRoZSByaXBwbGVzIGFyZSBiZWluZyBhZGRlZCB0by4gKi9cbiAgcHJpdmF0ZSBfY29udGFpbmVyRWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIEVsZW1lbnQgd2hpY2ggdHJpZ2dlcnMgdGhlIHJpcHBsZSBlbGVtZW50cyBvbiBtb3VzZSBldmVudHMuICovXG4gIHByaXZhdGUgX3RyaWdnZXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHBvaW50ZXIgaXMgY3VycmVudGx5IGRvd24gb3Igbm90LiAqL1xuICBwcml2YXRlIF9pc1BvaW50ZXJEb3duID0gZmFsc2U7XG5cbiAgLyoqIEV2ZW50cyB0byBiZSByZWdpc3RlcmVkIG9uIHRoZSB0cmlnZ2VyIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX3RyaWdnZXJFdmVudHMgPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuXG4gIC8qKiBTZXQgb2YgY3VycmVudGx5IGFjdGl2ZSByaXBwbGUgcmVmZXJlbmNlcy4gKi9cbiAgcHJpdmF0ZSBfYWN0aXZlUmlwcGxlcyA9IG5ldyBTZXQ8UmlwcGxlUmVmPigpO1xuXG4gIC8qKiBMYXRlc3Qgbm9uLXBlcnNpc3RlbnQgcmlwcGxlIHRoYXQgd2FzIHRyaWdnZXJlZC4gKi9cbiAgcHJpdmF0ZSBfbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZTogUmlwcGxlUmVmIHwgbnVsbDtcblxuICAvKiogVGltZSBpbiBtaWxsaXNlY29uZHMgd2hlbiB0aGUgbGFzdCB0b3VjaHN0YXJ0IGV2ZW50IGhhcHBlbmVkLiAqL1xuICBwcml2YXRlIF9sYXN0VG91Y2hTdGFydEV2ZW50OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIENhY2hlZCBkaW1lbnNpb25zIG9mIHRoZSByaXBwbGUgY29udGFpbmVyLiBTZXQgd2hlbiB0aGUgZmlyc3RcbiAgICogcmlwcGxlIGlzIHNob3duIGFuZCBjbGVhcmVkIG9uY2Ugbm8gbW9yZSByaXBwbGVzIGFyZSB2aXNpYmxlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY29udGFpbmVyUmVjdDogQ2xpZW50UmVjdCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdGFyZ2V0OiBSaXBwbGVUYXJnZXQsXG4gICAgICAgICAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBlbGVtZW50T3JFbGVtZW50UmVmOiBIVE1MRWxlbWVudCB8IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwbGF0Zm9ybTogUGxhdGZvcm0pIHtcblxuICAgIC8vIE9ubHkgZG8gYW55dGhpbmcgaWYgd2UncmUgb24gdGhlIGJyb3dzZXIuXG4gICAgaWYgKHBsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29udGFpbmVyRWxlbWVudCA9IGNvZXJjZUVsZW1lbnQoZWxlbWVudE9yRWxlbWVudFJlZik7XG5cbiAgICAgIC8vIFNwZWNpZnkgZXZlbnRzIHdoaWNoIG5lZWQgdG8gYmUgcmVnaXN0ZXJlZCBvbiB0aGUgdHJpZ2dlci5cbiAgICAgIHRoaXMuX3RyaWdnZXJFdmVudHNcbiAgICAgICAgLnNldCgnbW91c2Vkb3duJywgdGhpcy5fb25Nb3VzZWRvd24pXG4gICAgICAgIC5zZXQoJ21vdXNldXAnLCB0aGlzLl9vblBvaW50ZXJVcClcbiAgICAgICAgLnNldCgnbW91c2VsZWF2ZScsIHRoaXMuX29uUG9pbnRlclVwKVxuXG4gICAgICAgIC5zZXQoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vblRvdWNoU3RhcnQpXG4gICAgICAgIC5zZXQoJ3RvdWNoZW5kJywgdGhpcy5fb25Qb2ludGVyVXApXG4gICAgICAgIC5zZXQoJ3RvdWNoY2FuY2VsJywgdGhpcy5fb25Qb2ludGVyVXApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGYWRlcyBpbiBhIHJpcHBsZSBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXMuXG4gICAqIEBwYXJhbSB4IENvb3JkaW5hdGUgd2l0aGluIHRoZSBlbGVtZW50LCBhbG9uZyB0aGUgWCBheGlzIGF0IHdoaWNoIHRvIHN0YXJ0IHRoZSByaXBwbGUuXG4gICAqIEBwYXJhbSB5IENvb3JkaW5hdGUgd2l0aGluIHRoZSBlbGVtZW50LCBhbG9uZyB0aGUgWSBheGlzIGF0IHdoaWNoIHRvIHN0YXJ0IHRoZSByaXBwbGUuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgcmlwcGxlIG9wdGlvbnMuXG4gICAqL1xuICBmYWRlSW5SaXBwbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbmZpZzogUmlwcGxlQ29uZmlnID0ge30pOiBSaXBwbGVSZWYge1xuICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSB0aGlzLl9jb250YWluZXJSZWN0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyUmVjdCB8fCB0aGlzLl9jb250YWluZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGFuaW1hdGlvbkNvbmZpZyA9IHsuLi5kZWZhdWx0UmlwcGxlQW5pbWF0aW9uQ29uZmlnLCAuLi5jb25maWcuYW5pbWF0aW9ufTtcblxuICAgIGlmIChjb25maWcuY2VudGVyZWQpIHtcbiAgICAgIHggPSBjb250YWluZXJSZWN0LmxlZnQgKyBjb250YWluZXJSZWN0LndpZHRoIC8gMjtcbiAgICAgIHkgPSBjb250YWluZXJSZWN0LnRvcCArIGNvbnRhaW5lclJlY3QuaGVpZ2h0IC8gMjtcbiAgICB9XG5cbiAgICBjb25zdCByYWRpdXMgPSBjb25maWcucmFkaXVzIHx8IGRpc3RhbmNlVG9GdXJ0aGVzdENvcm5lcih4LCB5LCBjb250YWluZXJSZWN0KTtcbiAgICBjb25zdCBvZmZzZXRYID0geCAtIGNvbnRhaW5lclJlY3QubGVmdDtcbiAgICBjb25zdCBvZmZzZXRZID0geSAtIGNvbnRhaW5lclJlY3QudG9wO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gYW5pbWF0aW9uQ29uZmlnLmVudGVyRHVyYXRpb247XG5cbiAgICBjb25zdCByaXBwbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByaXBwbGUuY2xhc3NMaXN0LmFkZCgnbWF0LXJpcHBsZS1lbGVtZW50Jyk7XG5cbiAgICByaXBwbGUuc3R5bGUubGVmdCA9IGAke29mZnNldFggLSByYWRpdXN9cHhgO1xuICAgIHJpcHBsZS5zdHlsZS50b3AgPSBgJHtvZmZzZXRZIC0gcmFkaXVzfXB4YDtcbiAgICByaXBwbGUuc3R5bGUuaGVpZ2h0ID0gYCR7cmFkaXVzICogMn1weGA7XG4gICAgcmlwcGxlLnN0eWxlLndpZHRoID0gYCR7cmFkaXVzICogMn1weGA7XG5cbiAgICAvLyBJZiBhIGN1c3RvbSBjb2xvciBoYXMgYmVlbiBzcGVjaWZpZWQsIHNldCBpdCBhcyBpbmxpbmUgc3R5bGUuIElmIG5vIGNvbG9yIGlzXG4gICAgLy8gc2V0LCB0aGUgZGVmYXVsdCBjb2xvciB3aWxsIGJlIGFwcGxpZWQgdGhyb3VnaCB0aGUgcmlwcGxlIHRoZW1lIHN0eWxlcy5cbiAgICBpZiAoY29uZmlnLmNvbG9yICE9IG51bGwpIHtcbiAgICAgIHJpcHBsZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb25maWcuY29sb3I7XG4gICAgfVxuXG4gICAgcmlwcGxlLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcblxuICAgIHRoaXMuX2NvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQocmlwcGxlKTtcblxuICAgIC8vIEJ5IGRlZmF1bHQgdGhlIGJyb3dzZXIgZG9lcyBub3QgcmVjYWxjdWxhdGUgdGhlIHN0eWxlcyBvZiBkeW5hbWljYWxseSBjcmVhdGVkXG4gICAgLy8gcmlwcGxlIGVsZW1lbnRzLiBUaGlzIGlzIGNyaXRpY2FsIGJlY2F1c2UgdGhlbiB0aGUgYHNjYWxlYCB3b3VsZCBub3QgYW5pbWF0ZSBwcm9wZXJseS5cbiAgICBlbmZvcmNlU3R5bGVSZWNhbGN1bGF0aW9uKHJpcHBsZSk7XG5cbiAgICByaXBwbGUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDEpJztcblxuICAgIC8vIEV4cG9zZWQgcmVmZXJlbmNlIHRvIHRoZSByaXBwbGUgdGhhdCB3aWxsIGJlIHJldHVybmVkLlxuICAgIGNvbnN0IHJpcHBsZVJlZiA9IG5ldyBSaXBwbGVSZWYodGhpcywgcmlwcGxlLCBjb25maWcpO1xuXG4gICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuRkFESU5HX0lOO1xuXG4gICAgLy8gQWRkIHRoZSByaXBwbGUgcmVmZXJlbmNlIHRvIHRoZSBsaXN0IG9mIGFsbCBhY3RpdmUgcmlwcGxlcy5cbiAgICB0aGlzLl9hY3RpdmVSaXBwbGVzLmFkZChyaXBwbGVSZWYpO1xuXG4gICAgaWYgKCFjb25maWcucGVyc2lzdGVudCkge1xuICAgICAgdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSA9IHJpcHBsZVJlZjtcbiAgICB9XG5cbiAgICAvLyBXYWl0IGZvciB0aGUgcmlwcGxlIGVsZW1lbnQgdG8gYmUgY29tcGxldGVseSBmYWRlZCBpbi5cbiAgICAvLyBPbmNlIGl0J3MgZmFkZWQgaW4sIHRoZSByaXBwbGUgY2FuIGJlIGhpZGRlbiBpbW1lZGlhdGVseSBpZiB0aGUgbW91c2UgaXMgcmVsZWFzZWQuXG4gICAgdGhpcy5fcnVuVGltZW91dE91dHNpZGVab25lKCgpID0+IHtcbiAgICAgIGNvbnN0IGlzTW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSA9IHJpcHBsZVJlZiA9PT0gdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZTtcblxuICAgICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuVklTSUJMRTtcblxuICAgICAgLy8gV2hlbiB0aGUgdGltZXIgcnVucyBvdXQgd2hpbGUgdGhlIHVzZXIgaGFzIGtlcHQgdGhlaXIgcG9pbnRlciBkb3duLCB3ZSB3YW50IHRvXG4gICAgICAvLyBrZWVwIG9ubHkgdGhlIHBlcnNpc3RlbnQgcmlwcGxlcyBhbmQgdGhlIGxhdGVzdCB0cmFuc2llbnQgcmlwcGxlLiBXZSBkbyB0aGlzLFxuICAgICAgLy8gYmVjYXVzZSB3ZSBkb24ndCB3YW50IHN0YWNrZWQgdHJhbnNpZW50IHJpcHBsZXMgdG8gYXBwZWFyIGFmdGVyIHRoZWlyIGVudGVyXG4gICAgICAvLyBhbmltYXRpb24gaGFzIGZpbmlzaGVkLlxuICAgICAgaWYgKCFjb25maWcucGVyc2lzdGVudCAmJiAoIWlzTW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSB8fCAhdGhpcy5faXNQb2ludGVyRG93bikpIHtcbiAgICAgICAgcmlwcGxlUmVmLmZhZGVPdXQoKTtcbiAgICAgIH1cbiAgICB9LCBkdXJhdGlvbik7XG5cbiAgICByZXR1cm4gcmlwcGxlUmVmO1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCBhIHJpcHBsZSByZWZlcmVuY2UuICovXG4gIGZhZGVPdXRSaXBwbGUocmlwcGxlUmVmOiBSaXBwbGVSZWYpIHtcbiAgICBjb25zdCB3YXNBY3RpdmUgPSB0aGlzLl9hY3RpdmVSaXBwbGVzLmRlbGV0ZShyaXBwbGVSZWYpO1xuXG4gICAgaWYgKHJpcHBsZVJlZiA9PT0gdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSkge1xuICAgICAgdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ2xlYXIgb3V0IHRoZSBjYWNoZWQgYm91bmRpbmcgcmVjdCBpZiB3ZSBoYXZlIG5vIG1vcmUgcmlwcGxlcy5cbiAgICBpZiAoIXRoaXMuX2FjdGl2ZVJpcHBsZXMuc2l6ZSkge1xuICAgICAgdGhpcy5fY29udGFpbmVyUmVjdCA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gRm9yIHJpcHBsZXMgdGhhdCBhcmUgbm90IGFjdGl2ZSBhbnltb3JlLCBkb24ndCByZS1ydW4gdGhlIGZhZGUtb3V0IGFuaW1hdGlvbi5cbiAgICBpZiAoIXdhc0FjdGl2ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJpcHBsZUVsID0gcmlwcGxlUmVmLmVsZW1lbnQ7XG4gICAgY29uc3QgYW5pbWF0aW9uQ29uZmlnID0gey4uLmRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcsIC4uLnJpcHBsZVJlZi5jb25maWcuYW5pbWF0aW9ufTtcblxuICAgIHJpcHBsZUVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2FuaW1hdGlvbkNvbmZpZy5leGl0RHVyYXRpb259bXNgO1xuICAgIHJpcHBsZUVsLnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuRkFESU5HX09VVDtcblxuICAgIC8vIE9uY2UgdGhlIHJpcHBsZSBmYWRlZCBvdXQsIHRoZSByaXBwbGUgY2FuIGJlIHNhZmVseSByZW1vdmVkIGZyb20gdGhlIERPTS5cbiAgICB0aGlzLl9ydW5UaW1lb3V0T3V0c2lkZVpvbmUoKCkgPT4ge1xuICAgICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuSElEREVOO1xuICAgICAgcmlwcGxlRWwucGFyZW50Tm9kZSEucmVtb3ZlQ2hpbGQocmlwcGxlRWwpO1xuICAgIH0sIGFuaW1hdGlvbkNvbmZpZy5leGl0RHVyYXRpb24pO1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCBhbGwgY3VycmVudGx5IGFjdGl2ZSByaXBwbGVzLiAqL1xuICBmYWRlT3V0QWxsKCkge1xuICAgIHRoaXMuX2FjdGl2ZVJpcHBsZXMuZm9yRWFjaChyaXBwbGUgPT4gcmlwcGxlLmZhZGVPdXQoKSk7XG4gIH1cblxuICAvKiogU2V0cyB1cCB0aGUgdHJpZ2dlciBldmVudCBsaXN0ZW5lcnMgKi9cbiAgc2V0dXBUcmlnZ2VyRXZlbnRzKGVsZW1lbnRPckVsZW1lbnRSZWY6IEhUTUxFbGVtZW50IHwgRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICBjb25zdCBlbGVtZW50ID0gY29lcmNlRWxlbWVudChlbGVtZW50T3JFbGVtZW50UmVmKTtcblxuICAgIGlmICghZWxlbWVudCB8fCBlbGVtZW50ID09PSB0aGlzLl90cmlnZ2VyRWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhbGwgcHJldmlvdXNseSByZWdpc3RlcmVkIGV2ZW50IGxpc3RlbmVycyBmcm9tIHRoZSB0cmlnZ2VyIGVsZW1lbnQuXG4gICAgdGhpcy5fcmVtb3ZlVHJpZ2dlckV2ZW50cygpO1xuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX3RyaWdnZXJFdmVudHMuZm9yRWFjaCgoZm4sIHR5cGUpID0+IHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZuLCBwYXNzaXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fdHJpZ2dlckVsZW1lbnQgPSBlbGVtZW50O1xuICB9XG5cbiAgLyoqIEZ1bmN0aW9uIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgdHJpZ2dlciBpcyBiZWluZyBwcmVzc2VkIHVzaW5nIG1vdXNlLiAqL1xuICBwcml2YXRlIF9vbk1vdXNlZG93biA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgIC8vIFNjcmVlbiByZWFkZXJzIHdpbGwgZmlyZSBmYWtlIG1vdXNlIGV2ZW50cyBmb3Igc3BhY2UvZW50ZXIuIFNraXAgbGF1bmNoaW5nIGFcbiAgICAvLyByaXBwbGUgaW4gdGhpcyBjYXNlIGZvciBjb25zaXN0ZW5jeSB3aXRoIHRoZSBub24tc2NyZWVuLXJlYWRlciBleHBlcmllbmNlLlxuICAgIGNvbnN0IGlzRmFrZU1vdXNlZG93biA9IGlzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXIoZXZlbnQpO1xuICAgIGNvbnN0IGlzU3ludGhldGljRXZlbnQgPSB0aGlzLl9sYXN0VG91Y2hTdGFydEV2ZW50ICYmXG4gICAgICAgIERhdGUubm93KCkgPCB0aGlzLl9sYXN0VG91Y2hTdGFydEV2ZW50ICsgaWdub3JlTW91c2VFdmVudHNUaW1lb3V0O1xuXG4gICAgaWYgKCF0aGlzLl90YXJnZXQucmlwcGxlRGlzYWJsZWQgJiYgIWlzRmFrZU1vdXNlZG93biAmJiAhaXNTeW50aGV0aWNFdmVudCkge1xuICAgICAgdGhpcy5faXNQb2ludGVyRG93biA9IHRydWU7XG4gICAgICB0aGlzLmZhZGVJblJpcHBsZShldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZLCB0aGlzLl90YXJnZXQucmlwcGxlQ29uZmlnKTtcbiAgICB9XG4gIH1cblxuICAvKiogRnVuY3Rpb24gYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB0cmlnZ2VyIGlzIGJlaW5nIHByZXNzZWQgdXNpbmcgdG91Y2guICovXG4gIHByaXZhdGUgX29uVG91Y2hTdGFydCA9IChldmVudDogVG91Y2hFdmVudCkgPT4ge1xuICAgIGlmICghdGhpcy5fdGFyZ2V0LnJpcHBsZURpc2FibGVkKSB7XG4gICAgICAvLyBTb21lIGJyb3dzZXJzIGZpcmUgbW91c2UgZXZlbnRzIGFmdGVyIGEgYHRvdWNoc3RhcnRgIGV2ZW50LiBUaG9zZSBzeW50aGV0aWMgbW91c2VcbiAgICAgIC8vIGV2ZW50cyB3aWxsIGxhdW5jaCBhIHNlY29uZCByaXBwbGUgaWYgd2UgZG9uJ3QgaWdub3JlIG1vdXNlIGV2ZW50cyBmb3IgYSBzcGVjaWZpY1xuICAgICAgLy8gdGltZSBhZnRlciBhIHRvdWNoc3RhcnQgZXZlbnQuXG4gICAgICB0aGlzLl9sYXN0VG91Y2hTdGFydEV2ZW50ID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSB0cnVlO1xuXG4gICAgICAvLyBVc2UgYGNoYW5nZWRUb3VjaGVzYCBzbyB3ZSBza2lwIGFueSB0b3VjaGVzIHdoZXJlIHRoZSB1c2VyIHB1dFxuICAgICAgLy8gdGhlaXIgZmluZ2VyIGRvd24sIGJ1dCB1c2VkIGFub3RoZXIgZmluZ2VyIHRvIHRhcCB0aGUgZWxlbWVudCBhZ2Fpbi5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcztcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZmFkZUluUmlwcGxlKHRvdWNoZXNbaV0uY2xpZW50WCwgdG91Y2hlc1tpXS5jbGllbnRZLCB0aGlzLl90YXJnZXQucmlwcGxlQ29uZmlnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogRnVuY3Rpb24gYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB0cmlnZ2VyIGlzIGJlaW5nIHJlbGVhc2VkLiAqL1xuICBwcml2YXRlIF9vblBvaW50ZXJVcCA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMuX2lzUG9pbnRlckRvd24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1BvaW50ZXJEb3duID0gZmFsc2U7XG5cbiAgICAvLyBGYWRlLW91dCBhbGwgcmlwcGxlcyB0aGF0IGFyZSB2aXNpYmxlIGFuZCBub3QgcGVyc2lzdGVudC5cbiAgICB0aGlzLl9hY3RpdmVSaXBwbGVzLmZvckVhY2gocmlwcGxlID0+IHtcbiAgICAgIC8vIEJ5IGRlZmF1bHQsIG9ubHkgcmlwcGxlcyB0aGF0IGFyZSBjb21wbGV0ZWx5IHZpc2libGUgd2lsbCBmYWRlIG91dCBvbiBwb2ludGVyIHJlbGVhc2UuXG4gICAgICAvLyBJZiB0aGUgYHRlcm1pbmF0ZU9uUG9pbnRlclVwYCBvcHRpb24gaXMgc2V0LCByaXBwbGVzIHRoYXQgc3RpbGwgZmFkZSBpbiB3aWxsIGFsc28gZmFkZSBvdXQuXG4gICAgICBjb25zdCBpc1Zpc2libGUgPSByaXBwbGUuc3RhdGUgPT09IFJpcHBsZVN0YXRlLlZJU0lCTEUgfHxcbiAgICAgICAgcmlwcGxlLmNvbmZpZy50ZXJtaW5hdGVPblBvaW50ZXJVcCAmJiByaXBwbGUuc3RhdGUgPT09IFJpcHBsZVN0YXRlLkZBRElOR19JTjtcblxuICAgICAgaWYgKCFyaXBwbGUuY29uZmlnLnBlcnNpc3RlbnQgJiYgaXNWaXNpYmxlKSB7XG4gICAgICAgIHJpcHBsZS5mYWRlT3V0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogUnVucyBhIHRpbWVvdXQgb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lIHRvIGF2b2lkIHRyaWdnZXJpbmcgdGhlIGNoYW5nZSBkZXRlY3Rpb24uICovXG4gIHByaXZhdGUgX3J1blRpbWVvdXRPdXRzaWRlWm9uZShmbjogRnVuY3Rpb24sIGRlbGF5ID0gMCkge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiBzZXRUaW1lb3V0KGZuLCBkZWxheSkpO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgcHJldmlvdXNseSByZWdpc3RlcmVkIGV2ZW50IGxpc3RlbmVycyBmcm9tIHRoZSB0cmlnZ2VyIGVsZW1lbnQuICovXG4gIF9yZW1vdmVUcmlnZ2VyRXZlbnRzKCkge1xuICAgIGlmICh0aGlzLl90cmlnZ2VyRWxlbWVudCkge1xuICAgICAgdGhpcy5fdHJpZ2dlckV2ZW50cy5mb3JFYWNoKChmbiwgdHlwZSkgPT4ge1xuICAgICAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCEucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBmbiwgcGFzc2l2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEVuZm9yY2VzIGEgc3R5bGUgcmVjYWxjdWxhdGlvbiBvZiBhIERPTSBlbGVtZW50IGJ5IGNvbXB1dGluZyBpdHMgc3R5bGVzLiAqL1xuZnVuY3Rpb24gZW5mb3JjZVN0eWxlUmVjYWxjdWxhdGlvbihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAvLyBFbmZvcmNlIGEgc3R5bGUgcmVjYWxjdWxhdGlvbiBieSBjYWxsaW5nIGBnZXRDb21wdXRlZFN0eWxlYCBhbmQgYWNjZXNzaW5nIGFueSBwcm9wZXJ0eS5cbiAgLy8gQ2FsbGluZyBgZ2V0UHJvcGVydHlWYWx1ZWAgaXMgaW1wb3J0YW50IHRvIGxldCBvcHRpbWl6ZXJzIGtub3cgdGhhdCB0aGlzIGlzIG5vdCBhIG5vb3AuXG4gIC8vIFNlZTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzVkNTJmYjA4MWIzNTcwYzgxZTNhXG4gIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ29wYWNpdHknKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBwb2ludCAoeCwgeSkgdG8gdGhlIGZ1cnRoZXN0IGNvcm5lciBvZiBhIHJlY3RhbmdsZS5cbiAqL1xuZnVuY3Rpb24gZGlzdGFuY2VUb0Z1cnRoZXN0Q29ybmVyKHg6IG51bWJlciwgeTogbnVtYmVyLCByZWN0OiBDbGllbnRSZWN0KSB7XG4gIGNvbnN0IGRpc3RYID0gTWF0aC5tYXgoTWF0aC5hYnMoeCAtIHJlY3QubGVmdCksIE1hdGguYWJzKHggLSByZWN0LnJpZ2h0KSk7XG4gIGNvbnN0IGRpc3RZID0gTWF0aC5tYXgoTWF0aC5hYnMoeSAtIHJlY3QudG9wKSwgTWF0aC5hYnMoeSAtIHJlY3QuYm90dG9tKSk7XG4gIHJldHVybiBNYXRoLnNxcnQoZGlzdFggKiBkaXN0WCArIGRpc3RZICogZGlzdFkpO1xufVxuIl19