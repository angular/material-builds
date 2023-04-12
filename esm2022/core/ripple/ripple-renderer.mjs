import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { isFakeMousedownFromScreenReader, isFakeTouchstartFromScreenReader } from '@angular/cdk/a11y';
import { coerceElement } from '@angular/cdk/coercion';
import { RippleRef } from './ripple-ref';
import { RippleEventManager } from './ripple-event-manager';
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
/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple directive's host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 * This will eventually become a custom renderer once Angular support exists.
 * @docs-private
 */
class RippleRenderer {
    static { this._eventManager = new RippleEventManager(); }
    constructor(_target, _ngZone, elementOrElementRef, _platform) {
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
        rippleRef.state = 0 /* RippleState.FADING_IN */;
        if (!config.persistent) {
            this._mostRecentTransientRipple = rippleRef;
        }
        let eventListeners = null;
        // Do not register the `transition` event listener if fade-in and fade-out duration
        // are set to zero. The events won't fire anyway and we can save resources here.
        if (!animationForciblyDisabledThroughCss && (enterDuration || animationConfig.exitDuration)) {
            this._ngZone.runOutsideAngular(() => {
                const onTransitionEnd = () => this._finishRippleTransition(rippleRef);
                const onTransitionCancel = () => this._destroyRipple(rippleRef);
                ripple.addEventListener('transitionend', onTransitionEnd);
                // If the transition is cancelled (e.g. due to DOM removal), we destroy the ripple
                // directly as otherwise we would keep it part of the ripple container forever.
                // https://www.w3.org/TR/css-transitions-1/#:~:text=no%20longer%20in%20the%20document.
                ripple.addEventListener('transitioncancel', onTransitionCancel);
                eventListeners = { onTransitionEnd, onTransitionCancel };
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
        if (rippleRef.state === 2 /* RippleState.FADING_OUT */ || rippleRef.state === 3 /* RippleState.HIDDEN */) {
            return;
        }
        const rippleEl = rippleRef.element;
        const animationConfig = { ...defaultRippleAnimationConfig, ...rippleRef.config.animation };
        // This starts the fade-out transition and will fire the transition end listener that
        // removes the ripple element from the DOM.
        rippleEl.style.transitionDuration = `${animationConfig.exitDuration}ms`;
        rippleEl.style.opacity = '0';
        rippleRef.state = 2 /* RippleState.FADING_OUT */;
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
        if (rippleRef.state === 0 /* RippleState.FADING_IN */) {
            this._startFadeOutTransition(rippleRef);
        }
        else if (rippleRef.state === 2 /* RippleState.FADING_OUT */) {
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
        rippleRef.state = 1 /* RippleState.VISIBLE */;
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
        rippleRef.state = 3 /* RippleState.HIDDEN */;
        if (eventListeners !== null) {
            rippleRef.element.removeEventListener('transitionend', eventListeners.onTransitionEnd);
            rippleRef.element.removeEventListener('transitioncancel', eventListeners.onTransitionCancel);
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
            for (let i = 0; i < touches.length; i++) {
                this.fadeInRipple(touches[i].clientX, touches[i].clientY, this._target.rippleConfig);
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
            const isVisible = ripple.state === 1 /* RippleState.VISIBLE */ ||
                (ripple.config.terminateOnPointerUp && ripple.state === 0 /* RippleState.FADING_IN */);
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
            }
        }
    }
}
export { RippleRenderer };
/**
 * Returns the distance from the point (x, y) to the furthest corner of a rectangle.
 */
function distanceToFurthestCorner(x, y, rect) {
    const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS1yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxPQUFPLEVBQVcsK0JBQStCLEVBQWtCLE1BQU0sdUJBQXVCLENBQUM7QUFDakcsT0FBTyxFQUFDLCtCQUErQixFQUFFLGdDQUFnQyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDcEcsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3BELE9BQU8sRUFBQyxTQUFTLEVBQTRCLE1BQU0sY0FBYyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBb0IxRDs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSw0QkFBNEIsR0FBRztJQUMxQyxhQUFhLEVBQUUsR0FBRztJQUNsQixZQUFZLEVBQUUsR0FBRztDQUNsQixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsTUFBTSx3QkFBd0IsR0FBRyxHQUFHLENBQUM7QUFFckMsc0RBQXNEO0FBQ3RELE1BQU0sNEJBQTRCLEdBQUcsK0JBQStCLENBQUM7SUFDbkUsT0FBTyxFQUFFLElBQUk7SUFDYixPQUFPLEVBQUUsSUFBSTtDQUNkLENBQUMsQ0FBQztBQUVILG1EQUFtRDtBQUNuRCxNQUFNLGlCQUFpQixHQUFHLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRXRELGlEQUFpRDtBQUNqRCxNQUFNLGVBQWUsR0FBRyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBRTdFOzs7Ozs7R0FNRztBQUNILE1BQWEsY0FBYzthQWlDVixrQkFBYSxHQUFHLElBQUksa0JBQWtCLEVBQUUsQUFBM0IsQ0FBNEI7SUFFeEQsWUFDVSxPQUFxQixFQUNyQixPQUFlLEVBQ3ZCLG1C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RixJQUFJLElBQUksQ0FBQywwQkFBMEIsRUFBRTtnQkFDbkMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUM3QixPQUFPLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSw0QkFBNEIsQ0FBQyxDQUN0RSxDQUFDO2FBQ0g7U0FDRjtJQUNILENBQUM7O1NBL1dVLGNBQWM7QUFrWDNCOztHQUVHO0FBQ0gsU0FBUyx3QkFBd0IsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQWdCO0lBQ3RFLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzFFLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztBQUNsRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0VsZW1lbnRSZWYsIE5nWm9uZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsYXRmb3JtLCBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zLCBfZ2V0RXZlbnRUYXJnZXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge2lzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXIsIGlzRmFrZVRvdWNoc3RhcnRGcm9tU2NyZWVuUmVhZGVyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge2NvZXJjZUVsZW1lbnR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1JpcHBsZVJlZiwgUmlwcGxlU3RhdGUsIFJpcHBsZUNvbmZpZ30gZnJvbSAnLi9yaXBwbGUtcmVmJztcbmltcG9ydCB7UmlwcGxlRXZlbnRNYW5hZ2VyfSBmcm9tICcuL3JpcHBsZS1ldmVudC1tYW5hZ2VyJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgdGhhdCBkZXNjcmliZXMgdGhlIHRhcmdldCBmb3IgbGF1bmNoaW5nIHJpcHBsZXMuXG4gKiBJdCBkZWZpbmVzIHRoZSByaXBwbGUgY29uZmlndXJhdGlvbiBhbmQgZGlzYWJsZWQgc3RhdGUgZm9yIGludGVyYWN0aW9uIHJpcHBsZXMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmlwcGxlVGFyZ2V0IHtcbiAgLyoqIENvbmZpZ3VyYXRpb24gZm9yIHJpcHBsZXMgdGhhdCBhcmUgbGF1bmNoZWQgb24gcG9pbnRlciBkb3duLiAqL1xuICByaXBwbGVDb25maWc6IFJpcHBsZUNvbmZpZztcbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBvbiBwb2ludGVyIGRvd24gc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICByaXBwbGVEaXNhYmxlZDogYm9vbGVhbjtcbn1cblxuLyoqIEludGVyZmFjZXMgdGhlIGRlZmluZXMgcmlwcGxlIGVsZW1lbnQgdHJhbnNpdGlvbiBldmVudCBsaXN0ZW5lcnMuICovXG5pbnRlcmZhY2UgUmlwcGxlRXZlbnRMaXN0ZW5lcnMge1xuICBvblRyYW5zaXRpb25FbmQ6IEV2ZW50TGlzdGVuZXI7XG4gIG9uVHJhbnNpdGlvbkNhbmNlbDogRXZlbnRMaXN0ZW5lcjtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHJpcHBsZSBhbmltYXRpb24gY29uZmlndXJhdGlvbiBmb3IgcmlwcGxlcyB3aXRob3V0IGFuIGV4cGxpY2l0XG4gKiBhbmltYXRpb24gY29uZmlnIHNwZWNpZmllZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcgPSB7XG4gIGVudGVyRHVyYXRpb246IDIyNSxcbiAgZXhpdER1cmF0aW9uOiAxNTAsXG59O1xuXG4vKipcbiAqIFRpbWVvdXQgZm9yIGlnbm9yaW5nIG1vdXNlIGV2ZW50cy4gTW91c2UgZXZlbnRzIHdpbGwgYmUgdGVtcG9yYXJ5IGlnbm9yZWQgYWZ0ZXIgdG91Y2hcbiAqIGV2ZW50cyB0byBhdm9pZCBzeW50aGV0aWMgbW91c2UgZXZlbnRzLlxuICovXG5jb25zdCBpZ25vcmVNb3VzZUV2ZW50c1RpbWVvdXQgPSA4MDA7XG5cbi8qKiBPcHRpb25zIHVzZWQgdG8gYmluZCBhIHBhc3NpdmUgY2FwdHVyaW5nIGV2ZW50LiAqL1xuY29uc3QgcGFzc2l2ZUNhcHR1cmluZ0V2ZW50T3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe1xuICBwYXNzaXZlOiB0cnVlLFxuICBjYXB0dXJlOiB0cnVlLFxufSk7XG5cbi8qKiBFdmVudHMgdGhhdCBzaWduYWwgdGhhdCB0aGUgcG9pbnRlciBpcyBkb3duLiAqL1xuY29uc3QgcG9pbnRlckRvd25FdmVudHMgPSBbJ21vdXNlZG93bicsICd0b3VjaHN0YXJ0J107XG5cbi8qKiBFdmVudHMgdGhhdCBzaWduYWwgdGhhdCB0aGUgcG9pbnRlciBpcyB1cC4gKi9cbmNvbnN0IHBvaW50ZXJVcEV2ZW50cyA9IFsnbW91c2V1cCcsICdtb3VzZWxlYXZlJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJ107XG5cbi8qKlxuICogSGVscGVyIHNlcnZpY2UgdGhhdCBwZXJmb3JtcyBET00gbWFuaXB1bGF0aW9ucy4gTm90IGludGVuZGVkIHRvIGJlIHVzZWQgb3V0c2lkZSB0aGlzIG1vZHVsZS5cbiAqIFRoZSBjb25zdHJ1Y3RvciB0YWtlcyBhIHJlZmVyZW5jZSB0byB0aGUgcmlwcGxlIGRpcmVjdGl2ZSdzIGhvc3QgZWxlbWVudCBhbmQgYSBtYXAgb2YgRE9NXG4gKiBldmVudCBoYW5kbGVycyB0byBiZSBpbnN0YWxsZWQgb24gdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VycyByaXBwbGUgYW5pbWF0aW9ucy5cbiAqIFRoaXMgd2lsbCBldmVudHVhbGx5IGJlY29tZSBhIGN1c3RvbSByZW5kZXJlciBvbmNlIEFuZ3VsYXIgc3VwcG9ydCBleGlzdHMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBSaXBwbGVSZW5kZXJlciBpbXBsZW1lbnRzIEV2ZW50TGlzdGVuZXJPYmplY3Qge1xuICAvKiogRWxlbWVudCB3aGVyZSB0aGUgcmlwcGxlcyBhcmUgYmVpbmcgYWRkZWQgdG8uICovXG4gIHByaXZhdGUgX2NvbnRhaW5lckVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBFbGVtZW50IHdoaWNoIHRyaWdnZXJzIHRoZSByaXBwbGUgZWxlbWVudHMgb24gbW91c2UgZXZlbnRzLiAqL1xuICBwcml2YXRlIF90cmlnZ2VyRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBwb2ludGVyIGlzIGN1cnJlbnRseSBkb3duIG9yIG5vdC4gKi9cbiAgcHJpdmF0ZSBfaXNQb2ludGVyRG93biA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBNYXAgb2YgY3VycmVudGx5IGFjdGl2ZSByaXBwbGUgcmVmZXJlbmNlcy5cbiAgICogVGhlIHJpcHBsZSByZWZlcmVuY2UgaXMgbWFwcGVkIHRvIGl0cyBlbGVtZW50IGV2ZW50IGxpc3RlbmVycy5cbiAgICogVGhlIHJlYXNvbiB3aHkgYHwgbnVsbGAgaXMgdXNlZCBpcyB0aGF0IGV2ZW50IGxpc3RlbmVycyBhcmUgYWRkZWQgb25seVxuICAgKiB3aGVuIHRoZSBjb25kaXRpb24gaXMgdHJ1dGh5IChzZWUgdGhlIGBfc3RhcnRGYWRlT3V0VHJhbnNpdGlvbmAgbWV0aG9kKS5cbiAgICovXG4gIHByaXZhdGUgX2FjdGl2ZVJpcHBsZXMgPSBuZXcgTWFwPFJpcHBsZVJlZiwgUmlwcGxlRXZlbnRMaXN0ZW5lcnMgfCBudWxsPigpO1xuXG4gIC8qKiBMYXRlc3Qgbm9uLXBlcnNpc3RlbnQgcmlwcGxlIHRoYXQgd2FzIHRyaWdnZXJlZC4gKi9cbiAgcHJpdmF0ZSBfbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZTogUmlwcGxlUmVmIHwgbnVsbDtcblxuICAvKiogVGltZSBpbiBtaWxsaXNlY29uZHMgd2hlbiB0aGUgbGFzdCB0b3VjaHN0YXJ0IGV2ZW50IGhhcHBlbmVkLiAqL1xuICBwcml2YXRlIF9sYXN0VG91Y2hTdGFydEV2ZW50OiBudW1iZXI7XG5cbiAgLyoqIFdoZXRoZXIgcG9pbnRlci11cCBldmVudCBsaXN0ZW5lcnMgaGF2ZSBiZWVuIHJlZ2lzdGVyZWQuICovXG4gIHByaXZhdGUgX3BvaW50ZXJVcEV2ZW50c1JlZ2lzdGVyZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogQ2FjaGVkIGRpbWVuc2lvbnMgb2YgdGhlIHJpcHBsZSBjb250YWluZXIuIFNldCB3aGVuIHRoZSBmaXJzdFxuICAgKiByaXBwbGUgaXMgc2hvd24gYW5kIGNsZWFyZWQgb25jZSBubyBtb3JlIHJpcHBsZXMgYXJlIHZpc2libGUuXG4gICAqL1xuICBwcml2YXRlIF9jb250YWluZXJSZWN0OiBDbGllbnRSZWN0IHwgbnVsbDtcblxuICBwcml2YXRlIHN0YXRpYyBfZXZlbnRNYW5hZ2VyID0gbmV3IFJpcHBsZUV2ZW50TWFuYWdlcigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3RhcmdldDogUmlwcGxlVGFyZ2V0LFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIGVsZW1lbnRPckVsZW1lbnRSZWY6IEhUTUxFbGVtZW50IHwgRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICApIHtcbiAgICAvLyBPbmx5IGRvIGFueXRoaW5nIGlmIHdlJ3JlIG9uIHRoZSBicm93c2VyLlxuICAgIGlmIChfcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb250YWluZXJFbGVtZW50ID0gY29lcmNlRWxlbWVudChlbGVtZW50T3JFbGVtZW50UmVmKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmFkZXMgaW4gYSByaXBwbGUgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzLlxuICAgKiBAcGFyYW0geCBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFggYXhpcyBhdCB3aGljaCB0byBzdGFydCB0aGUgcmlwcGxlLlxuICAgKiBAcGFyYW0geSBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFkgYXhpcyBhdCB3aGljaCB0byBzdGFydCB0aGUgcmlwcGxlLlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIHJpcHBsZSBvcHRpb25zLlxuICAgKi9cbiAgZmFkZUluUmlwcGxlKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25maWc6IFJpcHBsZUNvbmZpZyA9IHt9KTogUmlwcGxlUmVmIHtcbiAgICBjb25zdCBjb250YWluZXJSZWN0ID0gKHRoaXMuX2NvbnRhaW5lclJlY3QgPVxuICAgICAgdGhpcy5fY29udGFpbmVyUmVjdCB8fCB0aGlzLl9jb250YWluZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICBjb25zdCBhbmltYXRpb25Db25maWcgPSB7Li4uZGVmYXVsdFJpcHBsZUFuaW1hdGlvbkNvbmZpZywgLi4uY29uZmlnLmFuaW1hdGlvbn07XG5cbiAgICBpZiAoY29uZmlnLmNlbnRlcmVkKSB7XG4gICAgICB4ID0gY29udGFpbmVyUmVjdC5sZWZ0ICsgY29udGFpbmVyUmVjdC53aWR0aCAvIDI7XG4gICAgICB5ID0gY29udGFpbmVyUmVjdC50b3AgKyBjb250YWluZXJSZWN0LmhlaWdodCAvIDI7XG4gICAgfVxuXG4gICAgY29uc3QgcmFkaXVzID0gY29uZmlnLnJhZGl1cyB8fCBkaXN0YW5jZVRvRnVydGhlc3RDb3JuZXIoeCwgeSwgY29udGFpbmVyUmVjdCk7XG4gICAgY29uc3Qgb2Zmc2V0WCA9IHggLSBjb250YWluZXJSZWN0LmxlZnQ7XG4gICAgY29uc3Qgb2Zmc2V0WSA9IHkgLSBjb250YWluZXJSZWN0LnRvcDtcbiAgICBjb25zdCBlbnRlckR1cmF0aW9uID0gYW5pbWF0aW9uQ29uZmlnLmVudGVyRHVyYXRpb247XG5cbiAgICBjb25zdCByaXBwbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByaXBwbGUuY2xhc3NMaXN0LmFkZCgnbWF0LXJpcHBsZS1lbGVtZW50Jyk7XG5cbiAgICByaXBwbGUuc3R5bGUubGVmdCA9IGAke29mZnNldFggLSByYWRpdXN9cHhgO1xuICAgIHJpcHBsZS5zdHlsZS50b3AgPSBgJHtvZmZzZXRZIC0gcmFkaXVzfXB4YDtcbiAgICByaXBwbGUuc3R5bGUuaGVpZ2h0ID0gYCR7cmFkaXVzICogMn1weGA7XG4gICAgcmlwcGxlLnN0eWxlLndpZHRoID0gYCR7cmFkaXVzICogMn1weGA7XG5cbiAgICAvLyBJZiBhIGN1c3RvbSBjb2xvciBoYXMgYmVlbiBzcGVjaWZpZWQsIHNldCBpdCBhcyBpbmxpbmUgc3R5bGUuIElmIG5vIGNvbG9yIGlzXG4gICAgLy8gc2V0LCB0aGUgZGVmYXVsdCBjb2xvciB3aWxsIGJlIGFwcGxpZWQgdGhyb3VnaCB0aGUgcmlwcGxlIHRoZW1lIHN0eWxlcy5cbiAgICBpZiAoY29uZmlnLmNvbG9yICE9IG51bGwpIHtcbiAgICAgIHJpcHBsZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb25maWcuY29sb3I7XG4gICAgfVxuXG4gICAgcmlwcGxlLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2VudGVyRHVyYXRpb259bXNgO1xuXG4gICAgdGhpcy5fY29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChyaXBwbGUpO1xuXG4gICAgLy8gQnkgZGVmYXVsdCB0aGUgYnJvd3NlciBkb2VzIG5vdCByZWNhbGN1bGF0ZSB0aGUgc3R5bGVzIG9mIGR5bmFtaWNhbGx5IGNyZWF0ZWRcbiAgICAvLyByaXBwbGUgZWxlbWVudHMuIFRoaXMgaXMgY3JpdGljYWwgdG8gZW5zdXJlIHRoYXQgdGhlIGBzY2FsZWAgYW5pbWF0ZXMgcHJvcGVybHkuXG4gICAgLy8gV2UgZW5mb3JjZSBhIHN0eWxlIHJlY2FsY3VsYXRpb24gYnkgY2FsbGluZyBgZ2V0Q29tcHV0ZWRTdHlsZWAgYW5kICphY2Nlc3NpbmcqIGEgcHJvcGVydHkuXG4gICAgLy8gU2VlOiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvNWQ1MmZiMDgxYjM1NzBjODFlM2FcbiAgICBjb25zdCBjb21wdXRlZFN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHJpcHBsZSk7XG4gICAgY29uc3QgdXNlclRyYW5zaXRpb25Qcm9wZXJ0eSA9IGNvbXB1dGVkU3R5bGVzLnRyYW5zaXRpb25Qcm9wZXJ0eTtcbiAgICBjb25zdCB1c2VyVHJhbnNpdGlvbkR1cmF0aW9uID0gY29tcHV0ZWRTdHlsZXMudHJhbnNpdGlvbkR1cmF0aW9uO1xuXG4gICAgLy8gTm90ZTogV2UgZGV0ZWN0IHdoZXRoZXIgYW5pbWF0aW9uIGlzIGZvcmNpYmx5IGRpc2FibGVkIHRocm91Z2ggQ1NTIChlLmcuIHRocm91Z2hcbiAgICAvLyBgdHJhbnNpdGlvbjogbm9uZWAgb3IgYGRpc3BsYXk6IG5vbmVgKS4gVGhpcyBpcyB0ZWNobmljYWxseSB1bmV4cGVjdGVkIHNpbmNlIGFuaW1hdGlvbnMgYXJlXG4gICAgLy8gY29udHJvbGxlZCB0aHJvdWdoIHRoZSBhbmltYXRpb24gY29uZmlnLCBidXQgdGhpcyBleGlzdHMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LiBUaGlzXG4gICAgLy8gbG9naWMgZG9lcyBub3QgbmVlZCB0byBiZSBzdXBlciBhY2N1cmF0ZSBzaW5jZSBpdCBjb3ZlcnMgc29tZSBlZGdlIGNhc2VzIHdoaWNoIGNhbiBiZSBlYXNpbHlcbiAgICAvLyBhdm9pZGVkIGJ5IHVzZXJzLlxuICAgIGNvbnN0IGFuaW1hdGlvbkZvcmNpYmx5RGlzYWJsZWRUaHJvdWdoQ3NzID1cbiAgICAgIHVzZXJUcmFuc2l0aW9uUHJvcGVydHkgPT09ICdub25lJyB8fFxuICAgICAgLy8gTm90ZTogVGhlIGNhbm9uaWNhbCB1bml0IGZvciBzZXJpYWxpemVkIENTUyBgPHRpbWU+YCBwcm9wZXJ0aWVzIGlzIHNlY29uZHMuIEFkZGl0aW9uYWxseVxuICAgICAgLy8gc29tZSBicm93c2VycyBleHBhbmQgdGhlIGR1cmF0aW9uIGZvciBldmVyeSBwcm9wZXJ0eSAoaW4gb3VyIGNhc2UgYG9wYWNpdHlgIGFuZCBgdHJhbnNmb3JtYCkuXG4gICAgICB1c2VyVHJhbnNpdGlvbkR1cmF0aW9uID09PSAnMHMnIHx8XG4gICAgICB1c2VyVHJhbnNpdGlvbkR1cmF0aW9uID09PSAnMHMsIDBzJyB8fFxuICAgICAgLy8gSWYgdGhlIGNvbnRhaW5lciBpcyAweDAsIGl0J3MgbGlrZWx5IGBkaXNwbGF5OiBub25lYC5cbiAgICAgIChjb250YWluZXJSZWN0LndpZHRoID09PSAwICYmIGNvbnRhaW5lclJlY3QuaGVpZ2h0ID09PSAwKTtcblxuICAgIC8vIEV4cG9zZWQgcmVmZXJlbmNlIHRvIHRoZSByaXBwbGUgdGhhdCB3aWxsIGJlIHJldHVybmVkLlxuICAgIGNvbnN0IHJpcHBsZVJlZiA9IG5ldyBSaXBwbGVSZWYodGhpcywgcmlwcGxlLCBjb25maWcsIGFuaW1hdGlvbkZvcmNpYmx5RGlzYWJsZWRUaHJvdWdoQ3NzKTtcblxuICAgIC8vIFN0YXJ0IHRoZSBlbnRlciBhbmltYXRpb24gYnkgc2V0dGluZyB0aGUgdHJhbnNmb3JtL3NjYWxlIHRvIDEwMCUuIFRoZSBhbmltYXRpb24gd2lsbFxuICAgIC8vIGV4ZWN1dGUgYXMgcGFydCBvZiB0aGlzIHN0YXRlbWVudCBiZWNhdXNlIHdlIGZvcmNlZCBhIHN0eWxlIHJlY2FsY3VsYXRpb24gYmVmb3JlLlxuICAgIC8vIE5vdGU6IFdlIHVzZSBhIDNkIHRyYW5zZm9ybSBoZXJlIGluIG9yZGVyIHRvIGF2b2lkIGFuIGlzc3VlIGluIFNhZmFyaSB3aGVyZVxuICAgIC8vIHRoZSByaXBwbGVzIGFyZW4ndCBjbGlwcGVkIHdoZW4gaW5zaWRlIHRoZSBzaGFkb3cgRE9NIChzZWUgIzI0MDI4KS5cbiAgICByaXBwbGUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlM2QoMSwgMSwgMSknO1xuXG4gICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuRkFESU5HX0lOO1xuXG4gICAgaWYgKCFjb25maWcucGVyc2lzdGVudCkge1xuICAgICAgdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSA9IHJpcHBsZVJlZjtcbiAgICB9XG5cbiAgICBsZXQgZXZlbnRMaXN0ZW5lcnM6IFJpcHBsZUV2ZW50TGlzdGVuZXJzIHwgbnVsbCA9IG51bGw7XG5cbiAgICAvLyBEbyBub3QgcmVnaXN0ZXIgdGhlIGB0cmFuc2l0aW9uYCBldmVudCBsaXN0ZW5lciBpZiBmYWRlLWluIGFuZCBmYWRlLW91dCBkdXJhdGlvblxuICAgIC8vIGFyZSBzZXQgdG8gemVyby4gVGhlIGV2ZW50cyB3b24ndCBmaXJlIGFueXdheSBhbmQgd2UgY2FuIHNhdmUgcmVzb3VyY2VzIGhlcmUuXG4gICAgaWYgKCFhbmltYXRpb25Gb3JjaWJseURpc2FibGVkVGhyb3VnaENzcyAmJiAoZW50ZXJEdXJhdGlvbiB8fCBhbmltYXRpb25Db25maWcuZXhpdER1cmF0aW9uKSkge1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgY29uc3Qgb25UcmFuc2l0aW9uRW5kID0gKCkgPT4gdGhpcy5fZmluaXNoUmlwcGxlVHJhbnNpdGlvbihyaXBwbGVSZWYpO1xuICAgICAgICBjb25zdCBvblRyYW5zaXRpb25DYW5jZWwgPSAoKSA9PiB0aGlzLl9kZXN0cm95UmlwcGxlKHJpcHBsZVJlZik7XG4gICAgICAgIHJpcHBsZS5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgb25UcmFuc2l0aW9uRW5kKTtcbiAgICAgICAgLy8gSWYgdGhlIHRyYW5zaXRpb24gaXMgY2FuY2VsbGVkIChlLmcuIGR1ZSB0byBET00gcmVtb3ZhbCksIHdlIGRlc3Ryb3kgdGhlIHJpcHBsZVxuICAgICAgICAvLyBkaXJlY3RseSBhcyBvdGhlcndpc2Ugd2Ugd291bGQga2VlcCBpdCBwYXJ0IG9mIHRoZSByaXBwbGUgY29udGFpbmVyIGZvcmV2ZXIuXG4gICAgICAgIC8vIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9jc3MtdHJhbnNpdGlvbnMtMS8jOn46dGV4dD1ubyUyMGxvbmdlciUyMGluJTIwdGhlJTIwZG9jdW1lbnQuXG4gICAgICAgIHJpcHBsZS5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uY2FuY2VsJywgb25UcmFuc2l0aW9uQ2FuY2VsKTtcbiAgICAgICAgZXZlbnRMaXN0ZW5lcnMgPSB7b25UcmFuc2l0aW9uRW5kLCBvblRyYW5zaXRpb25DYW5jZWx9O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSByaXBwbGUgcmVmZXJlbmNlIHRvIHRoZSBsaXN0IG9mIGFsbCBhY3RpdmUgcmlwcGxlcy5cbiAgICB0aGlzLl9hY3RpdmVSaXBwbGVzLnNldChyaXBwbGVSZWYsIGV2ZW50TGlzdGVuZXJzKTtcblxuICAgIC8vIEluIGNhc2UgdGhlcmUgaXMgbm8gZmFkZS1pbiB0cmFuc2l0aW9uIGR1cmF0aW9uLCB3ZSBuZWVkIHRvIG1hbnVhbGx5IGNhbGwgdGhlIHRyYW5zaXRpb25cbiAgICAvLyBlbmQgbGlzdGVuZXIgYmVjYXVzZSBgdHJhbnNpdGlvbmVuZGAgZG9lc24ndCBmaXJlIGlmIHRoZXJlIGlzIG5vIHRyYW5zaXRpb24uXG4gICAgaWYgKGFuaW1hdGlvbkZvcmNpYmx5RGlzYWJsZWRUaHJvdWdoQ3NzIHx8ICFlbnRlckR1cmF0aW9uKSB7XG4gICAgICB0aGlzLl9maW5pc2hSaXBwbGVUcmFuc2l0aW9uKHJpcHBsZVJlZik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJpcHBsZVJlZjtcbiAgfVxuXG4gIC8qKiBGYWRlcyBvdXQgYSByaXBwbGUgcmVmZXJlbmNlLiAqL1xuICBmYWRlT3V0UmlwcGxlKHJpcHBsZVJlZjogUmlwcGxlUmVmKSB7XG4gICAgLy8gRm9yIHJpcHBsZXMgYWxyZWFkeSBmYWRpbmcgb3V0IG9yIGhpZGRlbiwgdGhpcyBzaG91bGQgYmUgYSBub29wLlxuICAgIGlmIChyaXBwbGVSZWYuc3RhdGUgPT09IFJpcHBsZVN0YXRlLkZBRElOR19PVVQgfHwgcmlwcGxlUmVmLnN0YXRlID09PSBSaXBwbGVTdGF0ZS5ISURERU4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByaXBwbGVFbCA9IHJpcHBsZVJlZi5lbGVtZW50O1xuICAgIGNvbnN0IGFuaW1hdGlvbkNvbmZpZyA9IHsuLi5kZWZhdWx0UmlwcGxlQW5pbWF0aW9uQ29uZmlnLCAuLi5yaXBwbGVSZWYuY29uZmlnLmFuaW1hdGlvbn07XG5cbiAgICAvLyBUaGlzIHN0YXJ0cyB0aGUgZmFkZS1vdXQgdHJhbnNpdGlvbiBhbmQgd2lsbCBmaXJlIHRoZSB0cmFuc2l0aW9uIGVuZCBsaXN0ZW5lciB0aGF0XG4gICAgLy8gcmVtb3ZlcyB0aGUgcmlwcGxlIGVsZW1lbnQgZnJvbSB0aGUgRE9NLlxuICAgIHJpcHBsZUVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2FuaW1hdGlvbkNvbmZpZy5leGl0RHVyYXRpb259bXNgO1xuICAgIHJpcHBsZUVsLnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuRkFESU5HX09VVDtcblxuICAgIC8vIEluIGNhc2UgdGhlcmUgaXMgbm8gZmFkZS1vdXQgdHJhbnNpdGlvbiBkdXJhdGlvbiwgd2UgbmVlZCB0byBtYW51YWxseSBjYWxsIHRoZVxuICAgIC8vIHRyYW5zaXRpb24gZW5kIGxpc3RlbmVyIGJlY2F1c2UgYHRyYW5zaXRpb25lbmRgIGRvZXNuJ3QgZmlyZSBpZiB0aGVyZSBpcyBubyB0cmFuc2l0aW9uLlxuICAgIGlmIChyaXBwbGVSZWYuX2FuaW1hdGlvbkZvcmNpYmx5RGlzYWJsZWRUaHJvdWdoQ3NzIHx8ICFhbmltYXRpb25Db25maWcuZXhpdER1cmF0aW9uKSB7XG4gICAgICB0aGlzLl9maW5pc2hSaXBwbGVUcmFuc2l0aW9uKHJpcHBsZVJlZik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZhZGVzIG91dCBhbGwgY3VycmVudGx5IGFjdGl2ZSByaXBwbGVzLiAqL1xuICBmYWRlT3V0QWxsKCkge1xuICAgIHRoaXMuX2dldEFjdGl2ZVJpcHBsZXMoKS5mb3JFYWNoKHJpcHBsZSA9PiByaXBwbGUuZmFkZU91dCgpKTtcbiAgfVxuXG4gIC8qKiBGYWRlcyBvdXQgYWxsIGN1cnJlbnRseSBhY3RpdmUgbm9uLXBlcnNpc3RlbnQgcmlwcGxlcy4gKi9cbiAgZmFkZU91dEFsbE5vblBlcnNpc3RlbnQoKSB7XG4gICAgdGhpcy5fZ2V0QWN0aXZlUmlwcGxlcygpLmZvckVhY2gocmlwcGxlID0+IHtcbiAgICAgIGlmICghcmlwcGxlLmNvbmZpZy5wZXJzaXN0ZW50KSB7XG4gICAgICAgIHJpcHBsZS5mYWRlT3V0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogU2V0cyB1cCB0aGUgdHJpZ2dlciBldmVudCBsaXN0ZW5lcnMgKi9cbiAgc2V0dXBUcmlnZ2VyRXZlbnRzKGVsZW1lbnRPckVsZW1lbnRSZWY6IEhUTUxFbGVtZW50IHwgRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICBjb25zdCBlbGVtZW50ID0gY29lcmNlRWxlbWVudChlbGVtZW50T3JFbGVtZW50UmVmKTtcblxuICAgIGlmICghdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyIHx8ICFlbGVtZW50IHx8IGVsZW1lbnQgPT09IHRoaXMuX3RyaWdnZXJFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGFsbCBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHRyaWdnZXIgZWxlbWVudC5cbiAgICB0aGlzLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG4gICAgdGhpcy5fdHJpZ2dlckVsZW1lbnQgPSBlbGVtZW50O1xuXG4gICAgLy8gVXNlIGV2ZW50IGRlbGVnYXRpb24gZm9yIHRoZSB0cmlnZ2VyIGV2ZW50cyBzaW5jZSB0aGV5J3JlXG4gICAgLy8gc2V0IHVwIGR1cmluZyBjcmVhdGlvbiBhbmQgYXJlIHBlcmZvcm1hbmNlLXNlbnNpdGl2ZS5cbiAgICBwb2ludGVyRG93bkV2ZW50cy5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgUmlwcGxlUmVuZGVyZXIuX2V2ZW50TWFuYWdlci5hZGRIYW5kbGVyKHRoaXMuX25nWm9uZSwgdHlwZSwgZWxlbWVudCwgdGhpcyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyBhbGwgcmVnaXN0ZXJlZCBldmVudHMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGhhbmRsZUV2ZW50KGV2ZW50OiBFdmVudCkge1xuICAgIGlmIChldmVudC50eXBlID09PSAnbW91c2Vkb3duJykge1xuICAgICAgdGhpcy5fb25Nb3VzZWRvd24oZXZlbnQgYXMgTW91c2VFdmVudCk7XG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSAndG91Y2hzdGFydCcpIHtcbiAgICAgIHRoaXMuX29uVG91Y2hTdGFydChldmVudCBhcyBUb3VjaEV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fb25Qb2ludGVyVXAoKTtcbiAgICB9XG5cbiAgICAvLyBJZiBwb2ludGVyLXVwIGV2ZW50cyBoYXZlbid0IGJlZW4gcmVnaXN0ZXJlZCB5ZXQsIGRvIHNvIG5vdy5cbiAgICAvLyBXZSBkbyB0aGlzIG9uLWRlbWFuZCBpbiBvcmRlciB0byByZWR1Y2UgdGhlIHRvdGFsIG51bWJlciBvZiBldmVudCBsaXN0ZW5lcnNcbiAgICAvLyByZWdpc3RlcmVkIGJ5IHRoZSByaXBwbGVzLCB3aGljaCBzcGVlZHMgdXAgdGhlIHJlbmRlcmluZyB0aW1lIGZvciBsYXJnZSBVSXMuXG4gICAgaWYgKCF0aGlzLl9wb2ludGVyVXBFdmVudHNSZWdpc3RlcmVkKSB7XG4gICAgICAvLyBUaGUgZXZlbnRzIGZvciBoaWRpbmcgdGhlIHJpcHBsZSBhcmUgYm91bmQgZGlyZWN0bHkgb24gdGhlIHRyaWdnZXIsIGJlY2F1c2U6XG4gICAgICAvLyAxLiBTb21lIG9mIHRoZW0gb2NjdXIgZnJlcXVlbnRseSAoZS5nLiBgbW91c2VsZWF2ZWApIGFuZCBhbnkgYWR2YW50YWdlIHdlIGdldCBmcm9tXG4gICAgICAvLyBkZWxlZ2F0aW9uIHdpbGwgYmUgZGltaW5pc2hlZCBieSBoYXZpbmcgdG8gbG9vayB0aHJvdWdoIGFsbCB0aGUgZGF0YSBzdHJ1Y3R1cmVzIG9mdGVuLlxuICAgICAgLy8gMi4gVGhleSBhcmVuJ3QgYXMgcGVyZm9ybWFuY2Utc2Vuc2l0aXZlLCBiZWNhdXNlIHRoZXkncmUgYm91bmQgb25seSBhZnRlciB0aGUgdXNlclxuICAgICAgLy8gaGFzIGludGVyYWN0ZWQgd2l0aCBhbiBlbGVtZW50LlxuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgcG9pbnRlclVwRXZlbnRzLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgdGhpcy5fdHJpZ2dlckVsZW1lbnQhLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgdGhpcywgcGFzc2l2ZUNhcHR1cmluZ0V2ZW50T3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3BvaW50ZXJVcEV2ZW50c1JlZ2lzdGVyZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBNZXRob2QgdGhhdCB3aWxsIGJlIGNhbGxlZCBpZiB0aGUgZmFkZS1pbiBvciBmYWRlLWluIHRyYW5zaXRpb24gY29tcGxldGVkLiAqL1xuICBwcml2YXRlIF9maW5pc2hSaXBwbGVUcmFuc2l0aW9uKHJpcHBsZVJlZjogUmlwcGxlUmVmKSB7XG4gICAgaWYgKHJpcHBsZVJlZi5zdGF0ZSA9PT0gUmlwcGxlU3RhdGUuRkFESU5HX0lOKSB7XG4gICAgICB0aGlzLl9zdGFydEZhZGVPdXRUcmFuc2l0aW9uKHJpcHBsZVJlZik7XG4gICAgfSBlbHNlIGlmIChyaXBwbGVSZWYuc3RhdGUgPT09IFJpcHBsZVN0YXRlLkZBRElOR19PVVQpIHtcbiAgICAgIHRoaXMuX2Rlc3Ryb3lSaXBwbGUocmlwcGxlUmVmKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBmYWRlLW91dCB0cmFuc2l0aW9uIG9mIHRoZSBnaXZlbiByaXBwbGUgaWYgaXQncyBub3QgcGVyc2lzdGVudCBhbmQgdGhlIHBvaW50ZXJcbiAgICogaXMgbm90IGhlbGQgZG93biBhbnltb3JlLlxuICAgKi9cbiAgcHJpdmF0ZSBfc3RhcnRGYWRlT3V0VHJhbnNpdGlvbihyaXBwbGVSZWY6IFJpcHBsZVJlZikge1xuICAgIGNvbnN0IGlzTW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSA9IHJpcHBsZVJlZiA9PT0gdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZTtcbiAgICBjb25zdCB7cGVyc2lzdGVudH0gPSByaXBwbGVSZWYuY29uZmlnO1xuXG4gICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuVklTSUJMRTtcblxuICAgIC8vIFdoZW4gdGhlIHRpbWVyIHJ1bnMgb3V0IHdoaWxlIHRoZSB1c2VyIGhhcyBrZXB0IHRoZWlyIHBvaW50ZXIgZG93biwgd2Ugd2FudCB0b1xuICAgIC8vIGtlZXAgb25seSB0aGUgcGVyc2lzdGVudCByaXBwbGVzIGFuZCB0aGUgbGF0ZXN0IHRyYW5zaWVudCByaXBwbGUuIFdlIGRvIHRoaXMsXG4gICAgLy8gYmVjYXVzZSB3ZSBkb24ndCB3YW50IHN0YWNrZWQgdHJhbnNpZW50IHJpcHBsZXMgdG8gYXBwZWFyIGFmdGVyIHRoZWlyIGVudGVyXG4gICAgLy8gYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC5cbiAgICBpZiAoIXBlcnNpc3RlbnQgJiYgKCFpc01vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgfHwgIXRoaXMuX2lzUG9pbnRlckRvd24pKSB7XG4gICAgICByaXBwbGVSZWYuZmFkZU91dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXN0cm95cyB0aGUgZ2l2ZW4gcmlwcGxlIGJ5IHJlbW92aW5nIGl0IGZyb20gdGhlIERPTSBhbmQgdXBkYXRpbmcgaXRzIHN0YXRlLiAqL1xuICBwcml2YXRlIF9kZXN0cm95UmlwcGxlKHJpcHBsZVJlZjogUmlwcGxlUmVmKSB7XG4gICAgY29uc3QgZXZlbnRMaXN0ZW5lcnMgPSB0aGlzLl9hY3RpdmVSaXBwbGVzLmdldChyaXBwbGVSZWYpID8/IG51bGw7XG4gICAgdGhpcy5fYWN0aXZlUmlwcGxlcy5kZWxldGUocmlwcGxlUmVmKTtcblxuICAgIC8vIENsZWFyIG91dCB0aGUgY2FjaGVkIGJvdW5kaW5nIHJlY3QgaWYgd2UgaGF2ZSBubyBtb3JlIHJpcHBsZXMuXG4gICAgaWYgKCF0aGlzLl9hY3RpdmVSaXBwbGVzLnNpemUpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lclJlY3QgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBjdXJyZW50IHJlZiBpcyB0aGUgbW9zdCByZWNlbnQgdHJhbnNpZW50IHJpcHBsZSwgdW5zZXQgaXRcbiAgICAvLyBhdm9pZCBtZW1vcnkgbGVha3MuXG4gICAgaWYgKHJpcHBsZVJlZiA9PT0gdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSkge1xuICAgICAgdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuSElEREVOO1xuICAgIGlmIChldmVudExpc3RlbmVycyAhPT0gbnVsbCkge1xuICAgICAgcmlwcGxlUmVmLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGV2ZW50TGlzdGVuZXJzLm9uVHJhbnNpdGlvbkVuZCk7XG4gICAgICByaXBwbGVSZWYuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uY2FuY2VsJywgZXZlbnRMaXN0ZW5lcnMub25UcmFuc2l0aW9uQ2FuY2VsKTtcbiAgICB9XG4gICAgcmlwcGxlUmVmLmVsZW1lbnQucmVtb3ZlKCk7XG4gIH1cblxuICAvKiogRnVuY3Rpb24gYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB0cmlnZ2VyIGlzIGJlaW5nIHByZXNzZWQgdXNpbmcgbW91c2UuICovXG4gIHByaXZhdGUgX29uTW91c2Vkb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgLy8gU2NyZWVuIHJlYWRlcnMgd2lsbCBmaXJlIGZha2UgbW91c2UgZXZlbnRzIGZvciBzcGFjZS9lbnRlci4gU2tpcCBsYXVuY2hpbmcgYVxuICAgIC8vIHJpcHBsZSBpbiB0aGlzIGNhc2UgZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlIG5vbi1zY3JlZW4tcmVhZGVyIGV4cGVyaWVuY2UuXG4gICAgY29uc3QgaXNGYWtlTW91c2Vkb3duID0gaXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlcihldmVudCk7XG4gICAgY29uc3QgaXNTeW50aGV0aWNFdmVudCA9XG4gICAgICB0aGlzLl9sYXN0VG91Y2hTdGFydEV2ZW50ICYmXG4gICAgICBEYXRlLm5vdygpIDwgdGhpcy5fbGFzdFRvdWNoU3RhcnRFdmVudCArIGlnbm9yZU1vdXNlRXZlbnRzVGltZW91dDtcblxuICAgIGlmICghdGhpcy5fdGFyZ2V0LnJpcHBsZURpc2FibGVkICYmICFpc0Zha2VNb3VzZWRvd24gJiYgIWlzU3ludGhldGljRXZlbnQpIHtcbiAgICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSB0cnVlO1xuICAgICAgdGhpcy5mYWRlSW5SaXBwbGUoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSwgdGhpcy5fdGFyZ2V0LnJpcHBsZUNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZ1bmN0aW9uIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgdHJpZ2dlciBpcyBiZWluZyBwcmVzc2VkIHVzaW5nIHRvdWNoLiAqL1xuICBwcml2YXRlIF9vblRvdWNoU3RhcnQoZXZlbnQ6IFRvdWNoRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuX3RhcmdldC5yaXBwbGVEaXNhYmxlZCAmJiAhaXNGYWtlVG91Y2hzdGFydEZyb21TY3JlZW5SZWFkZXIoZXZlbnQpKSB7XG4gICAgICAvLyBTb21lIGJyb3dzZXJzIGZpcmUgbW91c2UgZXZlbnRzIGFmdGVyIGEgYHRvdWNoc3RhcnRgIGV2ZW50LiBUaG9zZSBzeW50aGV0aWMgbW91c2VcbiAgICAgIC8vIGV2ZW50cyB3aWxsIGxhdW5jaCBhIHNlY29uZCByaXBwbGUgaWYgd2UgZG9uJ3QgaWdub3JlIG1vdXNlIGV2ZW50cyBmb3IgYSBzcGVjaWZpY1xuICAgICAgLy8gdGltZSBhZnRlciBhIHRvdWNoc3RhcnQgZXZlbnQuXG4gICAgICB0aGlzLl9sYXN0VG91Y2hTdGFydEV2ZW50ID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSB0cnVlO1xuXG4gICAgICAvLyBVc2UgYGNoYW5nZWRUb3VjaGVzYCBzbyB3ZSBza2lwIGFueSB0b3VjaGVzIHdoZXJlIHRoZSB1c2VyIHB1dFxuICAgICAgLy8gdGhlaXIgZmluZ2VyIGRvd24sIGJ1dCB1c2VkIGFub3RoZXIgZmluZ2VyIHRvIHRhcCB0aGUgZWxlbWVudCBhZ2Fpbi5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcztcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZmFkZUluUmlwcGxlKHRvdWNoZXNbaV0uY2xpZW50WCwgdG91Y2hlc1tpXS5jbGllbnRZLCB0aGlzLl90YXJnZXQucmlwcGxlQ29uZmlnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogRnVuY3Rpb24gYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB0cmlnZ2VyIGlzIGJlaW5nIHJlbGVhc2VkLiAqL1xuICBwcml2YXRlIF9vblBvaW50ZXJVcCgpIHtcbiAgICBpZiAoIXRoaXMuX2lzUG9pbnRlckRvd24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1BvaW50ZXJEb3duID0gZmFsc2U7XG5cbiAgICAvLyBGYWRlLW91dCBhbGwgcmlwcGxlcyB0aGF0IGFyZSB2aXNpYmxlIGFuZCBub3QgcGVyc2lzdGVudC5cbiAgICB0aGlzLl9nZXRBY3RpdmVSaXBwbGVzKCkuZm9yRWFjaChyaXBwbGUgPT4ge1xuICAgICAgLy8gQnkgZGVmYXVsdCwgb25seSByaXBwbGVzIHRoYXQgYXJlIGNvbXBsZXRlbHkgdmlzaWJsZSB3aWxsIGZhZGUgb3V0IG9uIHBvaW50ZXIgcmVsZWFzZS5cbiAgICAgIC8vIElmIHRoZSBgdGVybWluYXRlT25Qb2ludGVyVXBgIG9wdGlvbiBpcyBzZXQsIHJpcHBsZXMgdGhhdCBzdGlsbCBmYWRlIGluIHdpbGwgYWxzbyBmYWRlIG91dC5cbiAgICAgIGNvbnN0IGlzVmlzaWJsZSA9XG4gICAgICAgIHJpcHBsZS5zdGF0ZSA9PT0gUmlwcGxlU3RhdGUuVklTSUJMRSB8fFxuICAgICAgICAocmlwcGxlLmNvbmZpZy50ZXJtaW5hdGVPblBvaW50ZXJVcCAmJiByaXBwbGUuc3RhdGUgPT09IFJpcHBsZVN0YXRlLkZBRElOR19JTik7XG5cbiAgICAgIGlmICghcmlwcGxlLmNvbmZpZy5wZXJzaXN0ZW50ICYmIGlzVmlzaWJsZSkge1xuICAgICAgICByaXBwbGUuZmFkZU91dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0QWN0aXZlUmlwcGxlcygpOiBSaXBwbGVSZWZbXSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fYWN0aXZlUmlwcGxlcy5rZXlzKCkpO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgcHJldmlvdXNseSByZWdpc3RlcmVkIGV2ZW50IGxpc3RlbmVycyBmcm9tIHRoZSB0cmlnZ2VyIGVsZW1lbnQuICovXG4gIF9yZW1vdmVUcmlnZ2VyRXZlbnRzKCkge1xuICAgIGNvbnN0IHRyaWdnZXIgPSB0aGlzLl90cmlnZ2VyRWxlbWVudDtcblxuICAgIGlmICh0cmlnZ2VyKSB7XG4gICAgICBwb2ludGVyRG93bkV2ZW50cy5mb3JFYWNoKHR5cGUgPT5cbiAgICAgICAgUmlwcGxlUmVuZGVyZXIuX2V2ZW50TWFuYWdlci5yZW1vdmVIYW5kbGVyKHR5cGUsIHRyaWdnZXIsIHRoaXMpLFxuICAgICAgKTtcblxuICAgICAgaWYgKHRoaXMuX3BvaW50ZXJVcEV2ZW50c1JlZ2lzdGVyZWQpIHtcbiAgICAgICAgcG9pbnRlclVwRXZlbnRzLmZvckVhY2godHlwZSA9PlxuICAgICAgICAgIHRyaWdnZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzLCBwYXNzaXZlQ2FwdHVyaW5nRXZlbnRPcHRpb25zKSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBwb2ludCAoeCwgeSkgdG8gdGhlIGZ1cnRoZXN0IGNvcm5lciBvZiBhIHJlY3RhbmdsZS5cbiAqL1xuZnVuY3Rpb24gZGlzdGFuY2VUb0Z1cnRoZXN0Q29ybmVyKHg6IG51bWJlciwgeTogbnVtYmVyLCByZWN0OiBDbGllbnRSZWN0KSB7XG4gIGNvbnN0IGRpc3RYID0gTWF0aC5tYXgoTWF0aC5hYnMoeCAtIHJlY3QubGVmdCksIE1hdGguYWJzKHggLSByZWN0LnJpZ2h0KSk7XG4gIGNvbnN0IGRpc3RZID0gTWF0aC5tYXgoTWF0aC5hYnMoeSAtIHJlY3QudG9wKSwgTWF0aC5hYnMoeSAtIHJlY3QuYm90dG9tKSk7XG4gIHJldHVybiBNYXRoLnNxcnQoZGlzdFggKiBkaXN0WCArIGRpc3RZICogZGlzdFkpO1xufVxuIl19