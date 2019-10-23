/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { coerceElement } from '@angular/cdk/coercion';
import { RippleRef, RippleState } from './ripple-ref';
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
                const isVisible = ripple.state === RippleState.VISIBLE ||
                    ripple.config.terminateOnPointerUp && ripple.state === RippleState.FADING_IN;
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
        // If the color is not set, the default CSS color will be used.
        ripple.style.backgroundColor = config.color || null;
        ripple.style.transitionDuration = `${duration}ms`;
        this._containerElement.appendChild(ripple);
        // By default the browser does not recalculate the styles of dynamically created
        // ripple elements. This is critical because then the `scale` would not animate properly.
        enforceStyleRecalculation(ripple);
        ripple.style.transform = 'scale(1)';
        // Exposed reference to the ripple that will be returned.
        /** @type {?} */
        const rippleRef = new RippleRef(this, ripple, config);
        rippleRef.state = RippleState.FADING_IN;
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
            rippleRef.state = RippleState.VISIBLE;
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
        rippleRef.state = RippleState.FADING_OUT;
        // Once the ripple faded out, the ripple can be safely removed from the DOM.
        this._runTimeoutOutsideZone((/**
         * @return {?}
         */
        () => {
            rippleRef.state = RippleState.HIDDEN;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS1yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBUUEsT0FBTyxFQUFXLCtCQUErQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDaEYsT0FBTyxFQUFDLCtCQUErQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDbEUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3BELE9BQU8sRUFBQyxTQUFTLEVBQUUsV0FBVyxFQUFDLE1BQU0sY0FBYyxDQUFDOzs7Ozs7QUFlcEQsMkNBS0M7Ozs7OztJQUhDLDhDQUF1Qjs7Ozs7SUFFdkIsNkNBQXNCOzs7Ozs7OztBQVF4QixrQ0FLQzs7Ozs7O0lBSEMsb0NBQTJCOzs7OztJQUUzQixzQ0FBd0I7Ozs7Ozs7QUFPMUIsTUFBTSxPQUFPLDRCQUE0QixHQUFHO0lBQzFDLGFBQWEsRUFBRSxHQUFHO0lBQ2xCLFlBQVksRUFBRSxHQUFHO0NBQ2xCOzs7Ozs7TUFNSyx3QkFBd0IsR0FBRyxHQUFHOzs7OztNQUc5QixtQkFBbUIsR0FBRywrQkFBK0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQzs7Ozs7Ozs7QUFTNUUsTUFBTSxPQUFPLGNBQWM7Ozs7Ozs7SUE0QnpCLFlBQW9CLE9BQXFCLEVBQ3JCLE9BQWUsRUFDdkIsbUJBQTBELEVBQzFELFFBQWtCO1FBSFYsWUFBTyxHQUFQLE9BQU8sQ0FBYztRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUFROzs7O1FBckIzQixtQkFBYyxHQUFHLEtBQUssQ0FBQzs7OztRQUd2QixtQkFBYyxHQUFHLElBQUksR0FBRyxFQUFlLENBQUM7Ozs7UUFHeEMsbUJBQWMsR0FBRyxJQUFJLEdBQUcsRUFBYSxDQUFDOzs7O1FBcUt0QyxpQkFBWTs7OztRQUFHLENB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Q0Y7Ozs7Ozs7SUFuUEMsMkNBQXVDOzs7Ozs7SUFHdkMseUNBQTRDOzs7Ozs7SUFHNUMsd0NBQStCOzs7Ozs7SUFHL0Isd0NBQWdEOzs7Ozs7SUFHaEQsd0NBQThDOzs7Ozs7SUFHOUMsb0RBQXFEOzs7Ozs7SUFHckQsOENBQXFDOzs7Ozs7O0lBTXJDLHdDQUEwQzs7Ozs7O0lBeUoxQyxzQ0FXQzs7Ozs7O0lBR0QsdUNBZ0JDOzs7Ozs7SUFHRCxzQ0FrQkM7Ozs7O0lBMU1XLGlDQUE2Qjs7Ozs7SUFDN0IsaUNBQXVCOzs7Ozs7O0FBMk5yQyxTQUFTLHlCQUF5QixDQUFDLE9BQW9CO0lBQ3JELDBGQUEwRjtJQUMxRiwwRkFBMEY7SUFDMUYsOERBQThEO0lBQzlELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvRCxDQUFDOzs7Ozs7OztBQUtELFNBQVMsd0JBQXdCLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxJQUFnQjs7VUFDaEUsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7VUFDbkUsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6RSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDbEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtFbGVtZW50UmVmLCBOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQbGF0Zm9ybSwgbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9uc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7aXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtjb2VyY2VFbGVtZW50fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtSaXBwbGVSZWYsIFJpcHBsZVN0YXRlfSBmcm9tICcuL3JpcHBsZS1yZWYnO1xuXG5leHBvcnQgdHlwZSBSaXBwbGVDb25maWcgPSB7XG4gIGNvbG9yPzogc3RyaW5nO1xuICBjZW50ZXJlZD86IGJvb2xlYW47XG4gIHJhZGl1cz86IG51bWJlcjtcbiAgcGVyc2lzdGVudD86IGJvb2xlYW47XG4gIGFuaW1hdGlvbj86IFJpcHBsZUFuaW1hdGlvbkNvbmZpZztcbiAgdGVybWluYXRlT25Qb2ludGVyVXA/OiBib29sZWFuO1xufTtcblxuLyoqXG4gKiBJbnRlcmZhY2UgdGhhdCBkZXNjcmliZXMgdGhlIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBhbmltYXRpb24gb2YgYSByaXBwbGUuXG4gKiBUaGVyZSBhcmUgdHdvIGFuaW1hdGlvbiBwaGFzZXMgd2l0aCBkaWZmZXJlbnQgZHVyYXRpb25zIGZvciB0aGUgcmlwcGxlcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSaXBwbGVBbmltYXRpb25Db25maWcge1xuICAvKiogRHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzIGZvciB0aGUgZW50ZXIgYW5pbWF0aW9uIChleHBhbnNpb24gZnJvbSBwb2ludCBvZiBjb250YWN0KS4gKi9cbiAgZW50ZXJEdXJhdGlvbj86IG51bWJlcjtcbiAgLyoqIER1cmF0aW9uIGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIGV4aXQgYW5pbWF0aW9uIChmYWRlLW91dCkuICovXG4gIGV4aXREdXJhdGlvbj86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgdGhhdCBkZXNjcmliZXMgdGhlIHRhcmdldCBmb3IgbGF1bmNoaW5nIHJpcHBsZXMuXG4gKiBJdCBkZWZpbmVzIHRoZSByaXBwbGUgY29uZmlndXJhdGlvbiBhbmQgZGlzYWJsZWQgc3RhdGUgZm9yIGludGVyYWN0aW9uIHJpcHBsZXMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmlwcGxlVGFyZ2V0IHtcbiAgLyoqIENvbmZpZ3VyYXRpb24gZm9yIHJpcHBsZXMgdGhhdCBhcmUgbGF1bmNoZWQgb24gcG9pbnRlciBkb3duLiAqL1xuICByaXBwbGVDb25maWc6IFJpcHBsZUNvbmZpZztcbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBvbiBwb2ludGVyIGRvd24gc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICByaXBwbGVEaXNhYmxlZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHJpcHBsZSBhbmltYXRpb24gY29uZmlndXJhdGlvbiBmb3IgcmlwcGxlcyB3aXRob3V0IGFuIGV4cGxpY2l0XG4gKiBhbmltYXRpb24gY29uZmlnIHNwZWNpZmllZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcgPSB7XG4gIGVudGVyRHVyYXRpb246IDQ1MCxcbiAgZXhpdER1cmF0aW9uOiA0MDBcbn07XG5cbi8qKlxuICogVGltZW91dCBmb3IgaWdub3JpbmcgbW91c2UgZXZlbnRzLiBNb3VzZSBldmVudHMgd2lsbCBiZSB0ZW1wb3JhcnkgaWdub3JlZCBhZnRlciB0b3VjaFxuICogZXZlbnRzIHRvIGF2b2lkIHN5bnRoZXRpYyBtb3VzZSBldmVudHMuXG4gKi9cbmNvbnN0IGlnbm9yZU1vdXNlRXZlbnRzVGltZW91dCA9IDgwMDtcblxuLyoqIE9wdGlvbnMgdGhhdCBhcHBseSB0byBhbGwgdGhlIGV2ZW50IGxpc3RlbmVycyB0aGF0IGFyZSBib3VuZCBieSB0aGUgcmlwcGxlIHJlbmRlcmVyLiAqL1xuY29uc3QgcGFzc2l2ZUV2ZW50T3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe3Bhc3NpdmU6IHRydWV9KTtcblxuLyoqXG4gKiBIZWxwZXIgc2VydmljZSB0aGF0IHBlcmZvcm1zIERPTSBtYW5pcHVsYXRpb25zLiBOb3QgaW50ZW5kZWQgdG8gYmUgdXNlZCBvdXRzaWRlIHRoaXMgbW9kdWxlLlxuICogVGhlIGNvbnN0cnVjdG9yIHRha2VzIGEgcmVmZXJlbmNlIHRvIHRoZSByaXBwbGUgZGlyZWN0aXZlJ3MgaG9zdCBlbGVtZW50IGFuZCBhIG1hcCBvZiBET01cbiAqIGV2ZW50IGhhbmRsZXJzIHRvIGJlIGluc3RhbGxlZCBvbiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJzIHJpcHBsZSBhbmltYXRpb25zLlxuICogVGhpcyB3aWxsIGV2ZW50dWFsbHkgYmVjb21lIGEgY3VzdG9tIHJlbmRlcmVyIG9uY2UgQW5ndWxhciBzdXBwb3J0IGV4aXN0cy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIFJpcHBsZVJlbmRlcmVyIHtcbiAgLyoqIEVsZW1lbnQgd2hlcmUgdGhlIHJpcHBsZXMgYXJlIGJlaW5nIGFkZGVkIHRvLiAqL1xuICBwcml2YXRlIF9jb250YWluZXJFbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAvKiogRWxlbWVudCB3aGljaCB0cmlnZ2VycyB0aGUgcmlwcGxlIGVsZW1lbnRzIG9uIG1vdXNlIGV2ZW50cy4gKi9cbiAgcHJpdmF0ZSBfdHJpZ2dlckVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgcG9pbnRlciBpcyBjdXJyZW50bHkgZG93biBvciBub3QuICovXG4gIHByaXZhdGUgX2lzUG9pbnRlckRvd24gPSBmYWxzZTtcblxuICAvKiogRXZlbnRzIHRvIGJlIHJlZ2lzdGVyZWQgb24gdGhlIHRyaWdnZXIgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfdHJpZ2dlckV2ZW50cyA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KCk7XG5cbiAgLyoqIFNldCBvZiBjdXJyZW50bHkgYWN0aXZlIHJpcHBsZSByZWZlcmVuY2VzLiAqL1xuICBwcml2YXRlIF9hY3RpdmVSaXBwbGVzID0gbmV3IFNldDxSaXBwbGVSZWY+KCk7XG5cbiAgLyoqIExhdGVzdCBub24tcGVyc2lzdGVudCByaXBwbGUgdGhhdCB3YXMgdHJpZ2dlcmVkLiAqL1xuICBwcml2YXRlIF9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlOiBSaXBwbGVSZWYgfCBudWxsO1xuXG4gIC8qKiBUaW1lIGluIG1pbGxpc2Vjb25kcyB3aGVuIHRoZSBsYXN0IHRvdWNoc3RhcnQgZXZlbnQgaGFwcGVuZWQuICovXG4gIHByaXZhdGUgX2xhc3RUb3VjaFN0YXJ0RXZlbnQ6IG51bWJlcjtcblxuICAvKipcbiAgICogQ2FjaGVkIGRpbWVuc2lvbnMgb2YgdGhlIHJpcHBsZSBjb250YWluZXIuIFNldCB3aGVuIHRoZSBmaXJzdFxuICAgKiByaXBwbGUgaXMgc2hvd24gYW5kIGNsZWFyZWQgb25jZSBubyBtb3JlIHJpcHBsZXMgYXJlIHZpc2libGUuXG4gICAqL1xuICBwcml2YXRlIF9jb250YWluZXJSZWN0OiBDbGllbnRSZWN0IHwgbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF90YXJnZXQ6IFJpcHBsZVRhcmdldCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIGVsZW1lbnRPckVsZW1lbnRSZWY6IEhUTUxFbGVtZW50IHwgRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSkge1xuXG4gICAgLy8gT25seSBkbyBhbnl0aGluZyBpZiB3ZSdyZSBvbiB0aGUgYnJvd3Nlci5cbiAgICBpZiAocGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb250YWluZXJFbGVtZW50ID0gY29lcmNlRWxlbWVudChlbGVtZW50T3JFbGVtZW50UmVmKTtcblxuICAgICAgLy8gU3BlY2lmeSBldmVudHMgd2hpY2ggbmVlZCB0byBiZSByZWdpc3RlcmVkIG9uIHRoZSB0cmlnZ2VyLlxuICAgICAgdGhpcy5fdHJpZ2dlckV2ZW50c1xuICAgICAgICAuc2V0KCdtb3VzZWRvd24nLCB0aGlzLl9vbk1vdXNlZG93bilcbiAgICAgICAgLnNldCgnbW91c2V1cCcsIHRoaXMuX29uUG9pbnRlclVwKVxuICAgICAgICAuc2V0KCdtb3VzZWxlYXZlJywgdGhpcy5fb25Qb2ludGVyVXApXG5cbiAgICAgICAgLnNldCgndG91Y2hzdGFydCcsIHRoaXMuX29uVG91Y2hTdGFydClcbiAgICAgICAgLnNldCgndG91Y2hlbmQnLCB0aGlzLl9vblBvaW50ZXJVcClcbiAgICAgICAgLnNldCgndG91Y2hjYW5jZWwnLCB0aGlzLl9vblBvaW50ZXJVcCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZhZGVzIGluIGEgcmlwcGxlIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlcy5cbiAgICogQHBhcmFtIHggQ29vcmRpbmF0ZSB3aXRoaW4gdGhlIGVsZW1lbnQsIGFsb25nIHRoZSBYIGF4aXMgYXQgd2hpY2ggdG8gc3RhcnQgdGhlIHJpcHBsZS5cbiAgICogQHBhcmFtIHkgQ29vcmRpbmF0ZSB3aXRoaW4gdGhlIGVsZW1lbnQsIGFsb25nIHRoZSBZIGF4aXMgYXQgd2hpY2ggdG8gc3RhcnQgdGhlIHJpcHBsZS5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSByaXBwbGUgb3B0aW9ucy5cbiAgICovXG4gIGZhZGVJblJpcHBsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uZmlnOiBSaXBwbGVDb25maWcgPSB7fSk6IFJpcHBsZVJlZiB7XG4gICAgY29uc3QgY29udGFpbmVyUmVjdCA9IHRoaXMuX2NvbnRhaW5lclJlY3QgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250YWluZXJSZWN0IHx8IHRoaXMuX2NvbnRhaW5lckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgYW5pbWF0aW9uQ29uZmlnID0gey4uLmRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcsIC4uLmNvbmZpZy5hbmltYXRpb259O1xuXG4gICAgaWYgKGNvbmZpZy5jZW50ZXJlZCkge1xuICAgICAgeCA9IGNvbnRhaW5lclJlY3QubGVmdCArIGNvbnRhaW5lclJlY3Qud2lkdGggLyAyO1xuICAgICAgeSA9IGNvbnRhaW5lclJlY3QudG9wICsgY29udGFpbmVyUmVjdC5oZWlnaHQgLyAyO1xuICAgIH1cblxuICAgIGNvbnN0IHJhZGl1cyA9IGNvbmZpZy5yYWRpdXMgfHwgZGlzdGFuY2VUb0Z1cnRoZXN0Q29ybmVyKHgsIHksIGNvbnRhaW5lclJlY3QpO1xuICAgIGNvbnN0IG9mZnNldFggPSB4IC0gY29udGFpbmVyUmVjdC5sZWZ0O1xuICAgIGNvbnN0IG9mZnNldFkgPSB5IC0gY29udGFpbmVyUmVjdC50b3A7XG4gICAgY29uc3QgZHVyYXRpb24gPSBhbmltYXRpb25Db25maWcuZW50ZXJEdXJhdGlvbjtcblxuICAgIGNvbnN0IHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJpcHBsZS5jbGFzc0xpc3QuYWRkKCdtYXQtcmlwcGxlLWVsZW1lbnQnKTtcblxuICAgIHJpcHBsZS5zdHlsZS5sZWZ0ID0gYCR7b2Zmc2V0WCAtIHJhZGl1c31weGA7XG4gICAgcmlwcGxlLnN0eWxlLnRvcCA9IGAke29mZnNldFkgLSByYWRpdXN9cHhgO1xuICAgIHJpcHBsZS5zdHlsZS5oZWlnaHQgPSBgJHtyYWRpdXMgKiAyfXB4YDtcbiAgICByaXBwbGUuc3R5bGUud2lkdGggPSBgJHtyYWRpdXMgKiAyfXB4YDtcblxuICAgIC8vIElmIHRoZSBjb2xvciBpcyBub3Qgc2V0LCB0aGUgZGVmYXVsdCBDU1MgY29sb3Igd2lsbCBiZSB1c2VkLlxuICAgIHJpcHBsZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb25maWcuY29sb3IgfHwgbnVsbDtcbiAgICByaXBwbGUuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuXG4gICAgdGhpcy5fY29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChyaXBwbGUpO1xuXG4gICAgLy8gQnkgZGVmYXVsdCB0aGUgYnJvd3NlciBkb2VzIG5vdCByZWNhbGN1bGF0ZSB0aGUgc3R5bGVzIG9mIGR5bmFtaWNhbGx5IGNyZWF0ZWRcbiAgICAvLyByaXBwbGUgZWxlbWVudHMuIFRoaXMgaXMgY3JpdGljYWwgYmVjYXVzZSB0aGVuIHRoZSBgc2NhbGVgIHdvdWxkIG5vdCBhbmltYXRlIHByb3Blcmx5LlxuICAgIGVuZm9yY2VTdHlsZVJlY2FsY3VsYXRpb24ocmlwcGxlKTtcblxuICAgIHJpcHBsZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoMSknO1xuXG4gICAgLy8gRXhwb3NlZCByZWZlcmVuY2UgdG8gdGhlIHJpcHBsZSB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuXG4gICAgY29uc3QgcmlwcGxlUmVmID0gbmV3IFJpcHBsZVJlZih0aGlzLCByaXBwbGUsIGNvbmZpZyk7XG5cbiAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5GQURJTkdfSU47XG5cbiAgICAvLyBBZGQgdGhlIHJpcHBsZSByZWZlcmVuY2UgdG8gdGhlIGxpc3Qgb2YgYWxsIGFjdGl2ZSByaXBwbGVzLlxuICAgIHRoaXMuX2FjdGl2ZVJpcHBsZXMuYWRkKHJpcHBsZVJlZik7XG5cbiAgICBpZiAoIWNvbmZpZy5wZXJzaXN0ZW50KSB7XG4gICAgICB0aGlzLl9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlID0gcmlwcGxlUmVmO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIHRoZSByaXBwbGUgZWxlbWVudCB0byBiZSBjb21wbGV0ZWx5IGZhZGVkIGluLlxuICAgIC8vIE9uY2UgaXQncyBmYWRlZCBpbiwgdGhlIHJpcHBsZSBjYW4gYmUgaGlkZGVuIGltbWVkaWF0ZWx5IGlmIHRoZSBtb3VzZSBpcyByZWxlYXNlZC5cbiAgICB0aGlzLl9ydW5UaW1lb3V0T3V0c2lkZVpvbmUoKCkgPT4ge1xuICAgICAgY29uc3QgaXNNb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlID0gcmlwcGxlUmVmID09PSB0aGlzLl9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlO1xuXG4gICAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5WSVNJQkxFO1xuXG4gICAgICAvLyBXaGVuIHRoZSB0aW1lciBydW5zIG91dCB3aGlsZSB0aGUgdXNlciBoYXMga2VwdCB0aGVpciBwb2ludGVyIGRvd24sIHdlIHdhbnQgdG9cbiAgICAgIC8vIGtlZXAgb25seSB0aGUgcGVyc2lzdGVudCByaXBwbGVzIGFuZCB0aGUgbGF0ZXN0IHRyYW5zaWVudCByaXBwbGUuIFdlIGRvIHRoaXMsXG4gICAgICAvLyBiZWNhdXNlIHdlIGRvbid0IHdhbnQgc3RhY2tlZCB0cmFuc2llbnQgcmlwcGxlcyB0byBhcHBlYXIgYWZ0ZXIgdGhlaXIgZW50ZXJcbiAgICAgIC8vIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQuXG4gICAgICBpZiAoIWNvbmZpZy5wZXJzaXN0ZW50ICYmICghaXNNb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlIHx8ICF0aGlzLl9pc1BvaW50ZXJEb3duKSkge1xuICAgICAgICByaXBwbGVSZWYuZmFkZU91dCgpO1xuICAgICAgfVxuICAgIH0sIGR1cmF0aW9uKTtcblxuICAgIHJldHVybiByaXBwbGVSZWY7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGEgcmlwcGxlIHJlZmVyZW5jZS4gKi9cbiAgZmFkZU91dFJpcHBsZShyaXBwbGVSZWY6IFJpcHBsZVJlZikge1xuICAgIGNvbnN0IHdhc0FjdGl2ZSA9IHRoaXMuX2FjdGl2ZVJpcHBsZXMuZGVsZXRlKHJpcHBsZVJlZik7XG5cbiAgICBpZiAocmlwcGxlUmVmID09PSB0aGlzLl9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlKSB7XG4gICAgICB0aGlzLl9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBDbGVhciBvdXQgdGhlIGNhY2hlZCBib3VuZGluZyByZWN0IGlmIHdlIGhhdmUgbm8gbW9yZSByaXBwbGVzLlxuICAgIGlmICghdGhpcy5fYWN0aXZlUmlwcGxlcy5zaXplKSB7XG4gICAgICB0aGlzLl9jb250YWluZXJSZWN0ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBGb3IgcmlwcGxlcyB0aGF0IGFyZSBub3QgYWN0aXZlIGFueW1vcmUsIGRvbid0IHJlLXJ1biB0aGUgZmFkZS1vdXQgYW5pbWF0aW9uLlxuICAgIGlmICghd2FzQWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmlwcGxlRWwgPSByaXBwbGVSZWYuZWxlbWVudDtcbiAgICBjb25zdCBhbmltYXRpb25Db25maWcgPSB7Li4uZGVmYXVsdFJpcHBsZUFuaW1hdGlvbkNvbmZpZywgLi4ucmlwcGxlUmVmLmNvbmZpZy5hbmltYXRpb259O1xuXG4gICAgcmlwcGxlRWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7YW5pbWF0aW9uQ29uZmlnLmV4aXREdXJhdGlvbn1tc2A7XG4gICAgcmlwcGxlRWwuc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5GQURJTkdfT1VUO1xuXG4gICAgLy8gT25jZSB0aGUgcmlwcGxlIGZhZGVkIG91dCwgdGhlIHJpcHBsZSBjYW4gYmUgc2FmZWx5IHJlbW92ZWQgZnJvbSB0aGUgRE9NLlxuICAgIHRoaXMuX3J1blRpbWVvdXRPdXRzaWRlWm9uZSgoKSA9PiB7XG4gICAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5ISURERU47XG4gICAgICByaXBwbGVFbC5wYXJlbnROb2RlIS5yZW1vdmVDaGlsZChyaXBwbGVFbCk7XG4gICAgfSwgYW5pbWF0aW9uQ29uZmlnLmV4aXREdXJhdGlvbik7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGFsbCBjdXJyZW50bHkgYWN0aXZlIHJpcHBsZXMuICovXG4gIGZhZGVPdXRBbGwoKSB7XG4gICAgdGhpcy5fYWN0aXZlUmlwcGxlcy5mb3JFYWNoKHJpcHBsZSA9PiByaXBwbGUuZmFkZU91dCgpKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSB0cmlnZ2VyIGV2ZW50IGxpc3RlbmVycyAqL1xuICBzZXR1cFRyaWdnZXJFdmVudHMoZWxlbWVudE9yRWxlbWVudFJlZjogSFRNTEVsZW1lbnQgfCBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjb2VyY2VFbGVtZW50KGVsZW1lbnRPckVsZW1lbnRSZWYpO1xuXG4gICAgaWYgKCFlbGVtZW50IHx8IGVsZW1lbnQgPT09IHRoaXMuX3RyaWdnZXJFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGFsbCBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHRyaWdnZXIgZWxlbWVudC5cbiAgICB0aGlzLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG5cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fdHJpZ2dlckV2ZW50cy5mb3JFYWNoKChmbiwgdHlwZSkgPT4ge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZm4sIHBhc3NpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCA9IGVsZW1lbnQ7XG4gIH1cblxuICAvKiogRnVuY3Rpb24gYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB0cmlnZ2VyIGlzIGJlaW5nIHByZXNzZWQgdXNpbmcgbW91c2UuICovXG4gIHByaXZhdGUgX29uTW91c2Vkb3duID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgLy8gU2NyZWVuIHJlYWRlcnMgd2lsbCBmaXJlIGZha2UgbW91c2UgZXZlbnRzIGZvciBzcGFjZS9lbnRlci4gU2tpcCBsYXVuY2hpbmcgYVxuICAgIC8vIHJpcHBsZSBpbiB0aGlzIGNhc2UgZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlIG5vbi1zY3JlZW4tcmVhZGVyIGV4cGVyaWVuY2UuXG4gICAgY29uc3QgaXNGYWtlTW91c2Vkb3duID0gaXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlcihldmVudCk7XG4gICAgY29uc3QgaXNTeW50aGV0aWNFdmVudCA9IHRoaXMuX2xhc3RUb3VjaFN0YXJ0RXZlbnQgJiZcbiAgICAgICAgRGF0ZS5ub3coKSA8IHRoaXMuX2xhc3RUb3VjaFN0YXJ0RXZlbnQgKyBpZ25vcmVNb3VzZUV2ZW50c1RpbWVvdXQ7XG5cbiAgICBpZiAoIXRoaXMuX3RhcmdldC5yaXBwbGVEaXNhYmxlZCAmJiAhaXNGYWtlTW91c2Vkb3duICYmICFpc1N5bnRoZXRpY0V2ZW50KSB7XG4gICAgICB0aGlzLl9pc1BvaW50ZXJEb3duID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmFkZUluUmlwcGxlKGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFksIHRoaXMuX3RhcmdldC5yaXBwbGVDb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBGdW5jdGlvbiBiZWluZyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHRyaWdnZXIgaXMgYmVpbmcgcHJlc3NlZCB1c2luZyB0b3VjaC4gKi9cbiAgcHJpdmF0ZSBfb25Ub3VjaFN0YXJ0ID0gKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgaWYgKCF0aGlzLl90YXJnZXQucmlwcGxlRGlzYWJsZWQpIHtcbiAgICAgIC8vIFNvbWUgYnJvd3NlcnMgZmlyZSBtb3VzZSBldmVudHMgYWZ0ZXIgYSBgdG91Y2hzdGFydGAgZXZlbnQuIFRob3NlIHN5bnRoZXRpYyBtb3VzZVxuICAgICAgLy8gZXZlbnRzIHdpbGwgbGF1bmNoIGEgc2Vjb25kIHJpcHBsZSBpZiB3ZSBkb24ndCBpZ25vcmUgbW91c2UgZXZlbnRzIGZvciBhIHNwZWNpZmljXG4gICAgICAvLyB0aW1lIGFmdGVyIGEgdG91Y2hzdGFydCBldmVudC5cbiAgICAgIHRoaXMuX2xhc3RUb3VjaFN0YXJ0RXZlbnQgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5faXNQb2ludGVyRG93biA9IHRydWU7XG5cbiAgICAgIC8vIFVzZSBgY2hhbmdlZFRvdWNoZXNgIHNvIHdlIHNraXAgYW55IHRvdWNoZXMgd2hlcmUgdGhlIHVzZXIgcHV0XG4gICAgICAvLyB0aGVpciBmaW5nZXIgZG93biwgYnV0IHVzZWQgYW5vdGhlciBmaW5nZXIgdG8gdGFwIHRoZSBlbGVtZW50IGFnYWluLlxuICAgICAgY29uc3QgdG91Y2hlcyA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5mYWRlSW5SaXBwbGUodG91Y2hlc1tpXS5jbGllbnRYLCB0b3VjaGVzW2ldLmNsaWVudFksIHRoaXMuX3RhcmdldC5yaXBwbGVDb25maWcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBGdW5jdGlvbiBiZWluZyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHRyaWdnZXIgaXMgYmVpbmcgcmVsZWFzZWQuICovXG4gIHByaXZhdGUgX29uUG9pbnRlclVwID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5faXNQb2ludGVyRG93bikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSBmYWxzZTtcblxuICAgIC8vIEZhZGUtb3V0IGFsbCByaXBwbGVzIHRoYXQgYXJlIHZpc2libGUgYW5kIG5vdCBwZXJzaXN0ZW50LlxuICAgIHRoaXMuX2FjdGl2ZVJpcHBsZXMuZm9yRWFjaChyaXBwbGUgPT4ge1xuICAgICAgLy8gQnkgZGVmYXVsdCwgb25seSByaXBwbGVzIHRoYXQgYXJlIGNvbXBsZXRlbHkgdmlzaWJsZSB3aWxsIGZhZGUgb3V0IG9uIHBvaW50ZXIgcmVsZWFzZS5cbiAgICAgIC8vIElmIHRoZSBgdGVybWluYXRlT25Qb2ludGVyVXBgIG9wdGlvbiBpcyBzZXQsIHJpcHBsZXMgdGhhdCBzdGlsbCBmYWRlIGluIHdpbGwgYWxzbyBmYWRlIG91dC5cbiAgICAgIGNvbnN0IGlzVmlzaWJsZSA9IHJpcHBsZS5zdGF0ZSA9PT0gUmlwcGxlU3RhdGUuVklTSUJMRSB8fFxuICAgICAgICByaXBwbGUuY29uZmlnLnRlcm1pbmF0ZU9uUG9pbnRlclVwICYmIHJpcHBsZS5zdGF0ZSA9PT0gUmlwcGxlU3RhdGUuRkFESU5HX0lOO1xuXG4gICAgICBpZiAoIXJpcHBsZS5jb25maWcucGVyc2lzdGVudCAmJiBpc1Zpc2libGUpIHtcbiAgICAgICAgcmlwcGxlLmZhZGVPdXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSdW5zIGEgdGltZW91dCBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIHpvbmUgdG8gYXZvaWQgdHJpZ2dlcmluZyB0aGUgY2hhbmdlIGRldGVjdGlvbi4gKi9cbiAgcHJpdmF0ZSBfcnVuVGltZW91dE91dHNpZGVab25lKGZuOiBGdW5jdGlvbiwgZGVsYXkgPSAwKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHNldFRpbWVvdXQoZm4sIGRlbGF5KSk7XG4gIH1cblxuICAvKiogUmVtb3ZlcyBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHRyaWdnZXIgZWxlbWVudC4gKi9cbiAgX3JlbW92ZVRyaWdnZXJFdmVudHMoKSB7XG4gICAgaWYgKHRoaXMuX3RyaWdnZXJFbGVtZW50KSB7XG4gICAgICB0aGlzLl90cmlnZ2VyRXZlbnRzLmZvckVhY2goKGZuLCB0eXBlKSA9PiB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJFbGVtZW50IS5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGZuLCBwYXNzaXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKiogRW5mb3JjZXMgYSBzdHlsZSByZWNhbGN1bGF0aW9uIG9mIGEgRE9NIGVsZW1lbnQgYnkgY29tcHV0aW5nIGl0cyBzdHlsZXMuICovXG5mdW5jdGlvbiBlbmZvcmNlU3R5bGVSZWNhbGN1bGF0aW9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gIC8vIEVuZm9yY2UgYSBzdHlsZSByZWNhbGN1bGF0aW9uIGJ5IGNhbGxpbmcgYGdldENvbXB1dGVkU3R5bGVgIGFuZCBhY2Nlc3NpbmcgYW55IHByb3BlcnR5LlxuICAvLyBDYWxsaW5nIGBnZXRQcm9wZXJ0eVZhbHVlYCBpcyBpbXBvcnRhbnQgdG8gbGV0IG9wdGltaXplcnMga25vdyB0aGF0IHRoaXMgaXMgbm90IGEgbm9vcC5cbiAgLy8gU2VlOiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvNWQ1MmZiMDgxYjM1NzBjODFlM2FcbiAgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgnb3BhY2l0eScpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGZyb20gdGhlIHBvaW50ICh4LCB5KSB0byB0aGUgZnVydGhlc3QgY29ybmVyIG9mIGEgcmVjdGFuZ2xlLlxuICovXG5mdW5jdGlvbiBkaXN0YW5jZVRvRnVydGhlc3RDb3JuZXIoeDogbnVtYmVyLCB5OiBudW1iZXIsIHJlY3Q6IENsaWVudFJlY3QpIHtcbiAgY29uc3QgZGlzdFggPSBNYXRoLm1heChNYXRoLmFicyh4IC0gcmVjdC5sZWZ0KSwgTWF0aC5hYnMoeCAtIHJlY3QucmlnaHQpKTtcbiAgY29uc3QgZGlzdFkgPSBNYXRoLm1heChNYXRoLmFicyh5IC0gcmVjdC50b3ApLCBNYXRoLmFicyh5IC0gcmVjdC5ib3R0b20pKTtcbiAgcmV0dXJuIE1hdGguc3FydChkaXN0WCAqIGRpc3RYICsgZGlzdFkgKiBkaXN0WSk7XG59XG4iXX0=