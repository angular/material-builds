import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { isFakeMousedownFromScreenReader, isFakeTouchstartFromScreenReader } from '@angular/cdk/a11y';
import { coerceElement } from '@angular/cdk/coercion';
import { RippleRef } from './ripple-ref';
// TODO: import these values from `@material/ripple` eventually.
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
/** Options that apply to all the event listeners that are bound by the ripple renderer. */
const passiveEventOptions = normalizePassiveListenerOptions({ passive: true });
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
export class RippleRenderer {
    constructor(_target, _ngZone, elementOrElementRef, platform) {
        this._target = _target;
        this._ngZone = _ngZone;
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
        if (platform.isBrowser) {
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
            this._registerEvents(pointerUpEvents);
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
    /** Registers event listeners for a given list of events. */
    _registerEvents(eventTypes) {
        this._ngZone.runOutsideAngular(() => {
            eventTypes.forEach(type => {
                this._triggerElement.addEventListener(type, this, passiveEventOptions);
            });
        });
    }
    _getActiveRipples() {
        return Array.from(this._activeRipples.keys());
    }
    /** Removes previously registered event listeners from the trigger element. */
    _removeTriggerEvents() {
        if (this._triggerElement) {
            pointerDownEvents.forEach(type => {
                this._triggerElement.removeEventListener(type, this, passiveEventOptions);
            });
            if (this._pointerUpEventsRegistered) {
                pointerUpEvents.forEach(type => {
                    this._triggerElement.removeEventListener(type, this, passiveEventOptions);
                });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS1yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxPQUFPLEVBQVcsK0JBQStCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNoRixPQUFPLEVBQUMsK0JBQStCLEVBQUUsZ0NBQWdDLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDcEQsT0FBTyxFQUFDLFNBQVMsRUFBNEIsTUFBTSxjQUFjLENBQUM7QUFvQmxFLGdFQUFnRTtBQUNoRTs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSw0QkFBNEIsR0FBRztJQUMxQyxhQUFhLEVBQUUsR0FBRztJQUNsQixZQUFZLEVBQUUsR0FBRztDQUNsQixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsTUFBTSx3QkFBd0IsR0FBRyxHQUFHLENBQUM7QUFFckMsMkZBQTJGO0FBQzNGLE1BQU0sbUJBQW1CLEdBQUcsK0JBQStCLENBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUU3RSxtREFBbUQ7QUFDbkQsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUV0RCxpREFBaUQ7QUFDakQsTUFBTSxlQUFlLEdBQUcsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUU3RTs7Ozs7O0dBTUc7QUFDSCxNQUFNLE9BQU8sY0FBYztJQWlDekIsWUFDVSxPQUFxQixFQUNyQixPQUFlLEVBQ3ZCLG1CQUEwRCxFQUMxRCxRQUFrQjtRQUhWLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFDckIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQTVCekIsb0RBQW9EO1FBQzVDLG1CQUFj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QUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMxRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMxRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDbEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtFbGVtZW50UmVmLCBOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQbGF0Zm9ybSwgbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9uc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7aXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlciwgaXNGYWtlVG91Y2hzdGFydEZyb21TY3JlZW5SZWFkZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Y29lcmNlRWxlbWVudH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UmlwcGxlUmVmLCBSaXBwbGVTdGF0ZSwgUmlwcGxlQ29uZmlnfSBmcm9tICcuL3JpcHBsZS1yZWYnO1xuXG4vKipcbiAqIEludGVyZmFjZSB0aGF0IGRlc2NyaWJlcyB0aGUgdGFyZ2V0IGZvciBsYXVuY2hpbmcgcmlwcGxlcy5cbiAqIEl0IGRlZmluZXMgdGhlIHJpcHBsZSBjb25maWd1cmF0aW9uIGFuZCBkaXNhYmxlZCBzdGF0ZSBmb3IgaW50ZXJhY3Rpb24gcmlwcGxlcy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSaXBwbGVUYXJnZXQge1xuICAvKiogQ29uZmlndXJhdGlvbiBmb3IgcmlwcGxlcyB0aGF0IGFyZSBsYXVuY2hlZCBvbiBwb2ludGVyIGRvd24uICovXG4gIHJpcHBsZUNvbmZpZzogUmlwcGxlQ29uZmlnO1xuICAvKiogV2hldGhlciByaXBwbGVzIG9uIHBvaW50ZXIgZG93biBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIHJpcHBsZURpc2FibGVkOiBib29sZWFuO1xufVxuXG4vKiogSW50ZXJmYWNlcyB0aGUgZGVmaW5lcyByaXBwbGUgZWxlbWVudCB0cmFuc2l0aW9uIGV2ZW50IGxpc3RlbmVycy4gKi9cbmludGVyZmFjZSBSaXBwbGVFdmVudExpc3RlbmVycyB7XG4gIG9uVHJhbnNpdGlvbkVuZDogRXZlbnRMaXN0ZW5lcjtcbiAgb25UcmFuc2l0aW9uQ2FuY2VsOiBFdmVudExpc3RlbmVyO1xufVxuXG4vLyBUT0RPOiBpbXBvcnQgdGhlc2UgdmFsdWVzIGZyb20gYEBtYXRlcmlhbC9yaXBwbGVgIGV2ZW50dWFsbHkuXG4vKipcbiAqIERlZmF1bHQgcmlwcGxlIGFuaW1hdGlvbiBjb25maWd1cmF0aW9uIGZvciByaXBwbGVzIHdpdGhvdXQgYW4gZXhwbGljaXRcbiAqIGFuaW1hdGlvbiBjb25maWcgc3BlY2lmaWVkLlxuICovXG5leHBvcnQgY29uc3QgZGVmYXVsdFJpcHBsZUFuaW1hdGlvbkNvbmZpZyA9IHtcbiAgZW50ZXJEdXJhdGlvbjogMjI1LFxuICBleGl0RHVyYXRpb246IDE1MCxcbn07XG5cbi8qKlxuICogVGltZW91dCBmb3IgaWdub3JpbmcgbW91c2UgZXZlbnRzLiBNb3VzZSBldmVudHMgd2lsbCBiZSB0ZW1wb3JhcnkgaWdub3JlZCBhZnRlciB0b3VjaFxuICogZXZlbnRzIHRvIGF2b2lkIHN5bnRoZXRpYyBtb3VzZSBldmVudHMuXG4gKi9cbmNvbnN0IGlnbm9yZU1vdXNlRXZlbnRzVGltZW91dCA9IDgwMDtcblxuLyoqIE9wdGlvbnMgdGhhdCBhcHBseSB0byBhbGwgdGhlIGV2ZW50IGxpc3RlbmVycyB0aGF0IGFyZSBib3VuZCBieSB0aGUgcmlwcGxlIHJlbmRlcmVyLiAqL1xuY29uc3QgcGFzc2l2ZUV2ZW50T3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe3Bhc3NpdmU6IHRydWV9KTtcblxuLyoqIEV2ZW50cyB0aGF0IHNpZ25hbCB0aGF0IHRoZSBwb2ludGVyIGlzIGRvd24uICovXG5jb25zdCBwb2ludGVyRG93bkV2ZW50cyA9IFsnbW91c2Vkb3duJywgJ3RvdWNoc3RhcnQnXTtcblxuLyoqIEV2ZW50cyB0aGF0IHNpZ25hbCB0aGF0IHRoZSBwb2ludGVyIGlzIHVwLiAqL1xuY29uc3QgcG9pbnRlclVwRXZlbnRzID0gWydtb3VzZXVwJywgJ21vdXNlbGVhdmUnLCAndG91Y2hlbmQnLCAndG91Y2hjYW5jZWwnXTtcblxuLyoqXG4gKiBIZWxwZXIgc2VydmljZSB0aGF0IHBlcmZvcm1zIERPTSBtYW5pcHVsYXRpb25zLiBOb3QgaW50ZW5kZWQgdG8gYmUgdXNlZCBvdXRzaWRlIHRoaXMgbW9kdWxlLlxuICogVGhlIGNvbnN0cnVjdG9yIHRha2VzIGEgcmVmZXJlbmNlIHRvIHRoZSByaXBwbGUgZGlyZWN0aXZlJ3MgaG9zdCBlbGVtZW50IGFuZCBhIG1hcCBvZiBET01cbiAqIGV2ZW50IGhhbmRsZXJzIHRvIGJlIGluc3RhbGxlZCBvbiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJzIHJpcHBsZSBhbmltYXRpb25zLlxuICogVGhpcyB3aWxsIGV2ZW50dWFsbHkgYmVjb21lIGEgY3VzdG9tIHJlbmRlcmVyIG9uY2UgQW5ndWxhciBzdXBwb3J0IGV4aXN0cy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIFJpcHBsZVJlbmRlcmVyIGltcGxlbWVudHMgRXZlbnRMaXN0ZW5lck9iamVjdCB7XG4gIC8qKiBFbGVtZW50IHdoZXJlIHRoZSByaXBwbGVzIGFyZSBiZWluZyBhZGRlZCB0by4gKi9cbiAgcHJpdmF0ZSBfY29udGFpbmVyRWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIEVsZW1lbnQgd2hpY2ggdHJpZ2dlcnMgdGhlIHJpcHBsZSBlbGVtZW50cyBvbiBtb3VzZSBldmVudHMuICovXG4gIHByaXZhdGUgX3RyaWdnZXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHBvaW50ZXIgaXMgY3VycmVudGx5IGRvd24gb3Igbm90LiAqL1xuICBwcml2YXRlIF9pc1BvaW50ZXJEb3duID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIE1hcCBvZiBjdXJyZW50bHkgYWN0aXZlIHJpcHBsZSByZWZlcmVuY2VzLlxuICAgKiBUaGUgcmlwcGxlIHJlZmVyZW5jZSBpcyBtYXBwZWQgdG8gaXRzIGVsZW1lbnQgZXZlbnQgbGlzdGVuZXJzLlxuICAgKiBUaGUgcmVhc29uIHdoeSBgfCBudWxsYCBpcyB1c2VkIGlzIHRoYXQgZXZlbnQgbGlzdGVuZXJzIGFyZSBhZGRlZCBvbmx5XG4gICAqIHdoZW4gdGhlIGNvbmRpdGlvbiBpcyB0cnV0aHkgKHNlZSB0aGUgYF9zdGFydEZhZGVPdXRUcmFuc2l0aW9uYCBtZXRob2QpLlxuICAgKi9cbiAgcHJpdmF0ZSBfYWN0aXZlUmlwcGxlcyA9IG5ldyBNYXA8UmlwcGxlUmVmLCBSaXBwbGVFdmVudExpc3RlbmVycyB8IG51bGw+KCk7XG5cbiAgLyoqIExhdGVzdCBub24tcGVyc2lzdGVudCByaXBwbGUgdGhhdCB3YXMgdHJpZ2dlcmVkLiAqL1xuICBwcml2YXRlIF9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlOiBSaXBwbGVSZWYgfCBudWxsO1xuXG4gIC8qKiBUaW1lIGluIG1pbGxpc2Vjb25kcyB3aGVuIHRoZSBsYXN0IHRvdWNoc3RhcnQgZXZlbnQgaGFwcGVuZWQuICovXG4gIHByaXZhdGUgX2xhc3RUb3VjaFN0YXJ0RXZlbnQ6IG51bWJlcjtcblxuICAvKiogV2hldGhlciBwb2ludGVyLXVwIGV2ZW50IGxpc3RlbmVycyBoYXZlIGJlZW4gcmVnaXN0ZXJlZC4gKi9cbiAgcHJpdmF0ZSBfcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBDYWNoZWQgZGltZW5zaW9ucyBvZiB0aGUgcmlwcGxlIGNvbnRhaW5lci4gU2V0IHdoZW4gdGhlIGZpcnN0XG4gICAqIHJpcHBsZSBpcyBzaG93biBhbmQgY2xlYXJlZCBvbmNlIG5vIG1vcmUgcmlwcGxlcyBhcmUgdmlzaWJsZS5cbiAgICovXG4gIHByaXZhdGUgX2NvbnRhaW5lclJlY3Q6IENsaWVudFJlY3QgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3RhcmdldDogUmlwcGxlVGFyZ2V0LFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIGVsZW1lbnRPckVsZW1lbnRSZWY6IEhUTUxFbGVtZW50IHwgRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICApIHtcbiAgICAvLyBPbmx5IGRvIGFueXRoaW5nIGlmIHdlJ3JlIG9uIHRoZSBicm93c2VyLlxuICAgIGlmIChwbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lckVsZW1lbnQgPSBjb2VyY2VFbGVtZW50KGVsZW1lbnRPckVsZW1lbnRSZWYpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGYWRlcyBpbiBhIHJpcHBsZSBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXMuXG4gICAqIEBwYXJhbSB4IENvb3JkaW5hdGUgd2l0aGluIHRoZSBlbGVtZW50LCBhbG9uZyB0aGUgWCBheGlzIGF0IHdoaWNoIHRvIHN0YXJ0IHRoZSByaXBwbGUuXG4gICAqIEBwYXJhbSB5IENvb3JkaW5hdGUgd2l0aGluIHRoZSBlbGVtZW50LCBhbG9uZyB0aGUgWSBheGlzIGF0IHdoaWNoIHRvIHN0YXJ0IHRoZSByaXBwbGUuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgcmlwcGxlIG9wdGlvbnMuXG4gICAqL1xuICBmYWRlSW5SaXBwbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbmZpZzogUmlwcGxlQ29uZmlnID0ge30pOiBSaXBwbGVSZWYge1xuICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSAodGhpcy5fY29udGFpbmVyUmVjdCA9XG4gICAgICB0aGlzLl9jb250YWluZXJSZWN0IHx8IHRoaXMuX2NvbnRhaW5lckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgIGNvbnN0IGFuaW1hdGlvbkNvbmZpZyA9IHsuLi5kZWZhdWx0UmlwcGxlQW5pbWF0aW9uQ29uZmlnLCAuLi5jb25maWcuYW5pbWF0aW9ufTtcblxuICAgIGlmIChjb25maWcuY2VudGVyZWQpIHtcbiAgICAgIHggPSBjb250YWluZXJSZWN0LmxlZnQgKyBjb250YWluZXJSZWN0LndpZHRoIC8gMjtcbiAgICAgIHkgPSBjb250YWluZXJSZWN0LnRvcCArIGNvbnRhaW5lclJlY3QuaGVpZ2h0IC8gMjtcbiAgICB9XG5cbiAgICBjb25zdCByYWRpdXMgPSBjb25maWcucmFkaXVzIHx8IGRpc3RhbmNlVG9GdXJ0aGVzdENvcm5lcih4LCB5LCBjb250YWluZXJSZWN0KTtcbiAgICBjb25zdCBvZmZzZXRYID0geCAtIGNvbnRhaW5lclJlY3QubGVmdDtcbiAgICBjb25zdCBvZmZzZXRZID0geSAtIGNvbnRhaW5lclJlY3QudG9wO1xuICAgIGNvbnN0IGVudGVyRHVyYXRpb24gPSBhbmltYXRpb25Db25maWcuZW50ZXJEdXJhdGlvbjtcblxuICAgIGNvbnN0IHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJpcHBsZS5jbGFzc0xpc3QuYWRkKCdtYXQtcmlwcGxlLWVsZW1lbnQnKTtcblxuICAgIHJpcHBsZS5zdHlsZS5sZWZ0ID0gYCR7b2Zmc2V0WCAtIHJhZGl1c31weGA7XG4gICAgcmlwcGxlLnN0eWxlLnRvcCA9IGAke29mZnNldFkgLSByYWRpdXN9cHhgO1xuICAgIHJpcHBsZS5zdHlsZS5oZWlnaHQgPSBgJHtyYWRpdXMgKiAyfXB4YDtcbiAgICByaXBwbGUuc3R5bGUud2lkdGggPSBgJHtyYWRpdXMgKiAyfXB4YDtcblxuICAgIC8vIElmIGEgY3VzdG9tIGNvbG9yIGhhcyBiZWVuIHNwZWNpZmllZCwgc2V0IGl0IGFzIGlubGluZSBzdHlsZS4gSWYgbm8gY29sb3IgaXNcbiAgICAvLyBzZXQsIHRoZSBkZWZhdWx0IGNvbG9yIHdpbGwgYmUgYXBwbGllZCB0aHJvdWdoIHRoZSByaXBwbGUgdGhlbWUgc3R5bGVzLlxuICAgIGlmIChjb25maWcuY29sb3IgIT0gbnVsbCkge1xuICAgICAgcmlwcGxlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbmZpZy5jb2xvcjtcbiAgICB9XG5cbiAgICByaXBwbGUuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZW50ZXJEdXJhdGlvbn1tc2A7XG5cbiAgICB0aGlzLl9jb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKHJpcHBsZSk7XG5cbiAgICAvLyBCeSBkZWZhdWx0IHRoZSBicm93c2VyIGRvZXMgbm90IHJlY2FsY3VsYXRlIHRoZSBzdHlsZXMgb2YgZHluYW1pY2FsbHkgY3JlYXRlZFxuICAgIC8vIHJpcHBsZSBlbGVtZW50cy4gVGhpcyBpcyBjcml0aWNhbCB0byBlbnN1cmUgdGhhdCB0aGUgYHNjYWxlYCBhbmltYXRlcyBwcm9wZXJseS5cbiAgICAvLyBXZSBlbmZvcmNlIGEgc3R5bGUgcmVjYWxjdWxhdGlvbiBieSBjYWxsaW5nIGBnZXRDb21wdXRlZFN0eWxlYCBhbmQgKmFjY2Vzc2luZyogYSBwcm9wZXJ0eS5cbiAgICAvLyBTZWU6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC81ZDUyZmIwODFiMzU3MGM4MWUzYVxuICAgIGNvbnN0IGNvbXB1dGVkU3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUocmlwcGxlKTtcbiAgICBjb25zdCB1c2VyVHJhbnNpdGlvblByb3BlcnR5ID0gY29tcHV0ZWRTdHlsZXMudHJhbnNpdGlvblByb3BlcnR5O1xuICAgIGNvbnN0IHVzZXJUcmFuc2l0aW9uRHVyYXRpb24gPSBjb21wdXRlZFN0eWxlcy50cmFuc2l0aW9uRHVyYXRpb247XG5cbiAgICAvLyBOb3RlOiBXZSBkZXRlY3Qgd2hldGhlciBhbmltYXRpb24gaXMgZm9yY2libHkgZGlzYWJsZWQgdGhyb3VnaCBDU1MgKGUuZy4gdGhyb3VnaFxuICAgIC8vIGB0cmFuc2l0aW9uOiBub25lYCBvciBgZGlzcGxheTogbm9uZWApLiBUaGlzIGlzIHRlY2huaWNhbGx5IHVuZXhwZWN0ZWQgc2luY2UgYW5pbWF0aW9ucyBhcmVcbiAgICAvLyBjb250cm9sbGVkIHRocm91Z2ggdGhlIGFuaW1hdGlvbiBjb25maWcsIGJ1dCB0aGlzIGV4aXN0cyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIFRoaXNcbiAgICAvLyBsb2dpYyBkb2VzIG5vdCBuZWVkIHRvIGJlIHN1cGVyIGFjY3VyYXRlIHNpbmNlIGl0IGNvdmVycyBzb21lIGVkZ2UgY2FzZXMgd2hpY2ggY2FuIGJlIGVhc2lseVxuICAgIC8vIGF2b2lkZWQgYnkgdXNlcnMuXG4gICAgY29uc3QgYW5pbWF0aW9uRm9yY2libHlEaXNhYmxlZFRocm91Z2hDc3MgPVxuICAgICAgdXNlclRyYW5zaXRpb25Qcm9wZXJ0eSA9PT0gJ25vbmUnIHx8XG4gICAgICAvLyBOb3RlOiBUaGUgY2Fub25pY2FsIHVuaXQgZm9yIHNlcmlhbGl6ZWQgQ1NTIGA8dGltZT5gIHByb3BlcnRpZXMgaXMgc2Vjb25kcy4gQWRkaXRpb25hbGx5XG4gICAgICAvLyBzb21lIGJyb3dzZXJzIGV4cGFuZCB0aGUgZHVyYXRpb24gZm9yIGV2ZXJ5IHByb3BlcnR5IChpbiBvdXIgY2FzZSBgb3BhY2l0eWAgYW5kIGB0cmFuc2Zvcm1gKS5cbiAgICAgIHVzZXJUcmFuc2l0aW9uRHVyYXRpb24gPT09ICcwcycgfHxcbiAgICAgIHVzZXJUcmFuc2l0aW9uRHVyYXRpb24gPT09ICcwcywgMHMnIHx8XG4gICAgICAvLyBJZiB0aGUgY29udGFpbmVyIGlzIDB4MCwgaXQncyBsaWtlbHkgYGRpc3BsYXk6IG5vbmVgLlxuICAgICAgKGNvbnRhaW5lclJlY3Qud2lkdGggPT09IDAgJiYgY29udGFpbmVyUmVjdC5oZWlnaHQgPT09IDApO1xuXG4gICAgLy8gRXhwb3NlZCByZWZlcmVuY2UgdG8gdGhlIHJpcHBsZSB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuXG4gICAgY29uc3QgcmlwcGxlUmVmID0gbmV3IFJpcHBsZVJlZih0aGlzLCByaXBwbGUsIGNvbmZpZywgYW5pbWF0aW9uRm9yY2libHlEaXNhYmxlZFRocm91Z2hDc3MpO1xuXG4gICAgLy8gU3RhcnQgdGhlIGVudGVyIGFuaW1hdGlvbiBieSBzZXR0aW5nIHRoZSB0cmFuc2Zvcm0vc2NhbGUgdG8gMTAwJS4gVGhlIGFuaW1hdGlvbiB3aWxsXG4gICAgLy8gZXhlY3V0ZSBhcyBwYXJ0IG9mIHRoaXMgc3RhdGVtZW50IGJlY2F1c2Ugd2UgZm9yY2VkIGEgc3R5bGUgcmVjYWxjdWxhdGlvbiBiZWZvcmUuXG4gICAgLy8gTm90ZTogV2UgdXNlIGEgM2QgdHJhbnNmb3JtIGhlcmUgaW4gb3JkZXIgdG8gYXZvaWQgYW4gaXNzdWUgaW4gU2FmYXJpIHdoZXJlXG4gICAgLy8gdGhlIHJpcHBsZXMgYXJlbid0IGNsaXBwZWQgd2hlbiBpbnNpZGUgdGhlIHNoYWRvdyBET00gKHNlZSAjMjQwMjgpLlxuICAgIHJpcHBsZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUzZCgxLCAxLCAxKSc7XG5cbiAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5GQURJTkdfSU47XG5cbiAgICBpZiAoIWNvbmZpZy5wZXJzaXN0ZW50KSB7XG4gICAgICB0aGlzLl9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlID0gcmlwcGxlUmVmO1xuICAgIH1cblxuICAgIGxldCBldmVudExpc3RlbmVyczogUmlwcGxlRXZlbnRMaXN0ZW5lcnMgfCBudWxsID0gbnVsbDtcblxuICAgIC8vIERvIG5vdCByZWdpc3RlciB0aGUgYHRyYW5zaXRpb25gIGV2ZW50IGxpc3RlbmVyIGlmIGZhZGUtaW4gYW5kIGZhZGUtb3V0IGR1cmF0aW9uXG4gICAgLy8gYXJlIHNldCB0byB6ZXJvLiBUaGUgZXZlbnRzIHdvbid0IGZpcmUgYW55d2F5IGFuZCB3ZSBjYW4gc2F2ZSByZXNvdXJjZXMgaGVyZS5cbiAgICBpZiAoIWFuaW1hdGlvbkZvcmNpYmx5RGlzYWJsZWRUaHJvdWdoQ3NzICYmIChlbnRlckR1cmF0aW9uIHx8IGFuaW1hdGlvbkNvbmZpZy5leGl0RHVyYXRpb24pKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBjb25zdCBvblRyYW5zaXRpb25FbmQgPSAoKSA9PiB0aGlzLl9maW5pc2hSaXBwbGVUcmFuc2l0aW9uKHJpcHBsZVJlZik7XG4gICAgICAgIGNvbnN0IG9uVHJhbnNpdGlvbkNhbmNlbCA9ICgpID0+IHRoaXMuX2Rlc3Ryb3lSaXBwbGUocmlwcGxlUmVmKTtcbiAgICAgICAgcmlwcGxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBvblRyYW5zaXRpb25FbmQpO1xuICAgICAgICAvLyBJZiB0aGUgdHJhbnNpdGlvbiBpcyBjYW5jZWxsZWQgKGUuZy4gZHVlIHRvIERPTSByZW1vdmFsKSwgd2UgZGVzdHJveSB0aGUgcmlwcGxlXG4gICAgICAgIC8vIGRpcmVjdGx5IGFzIG90aGVyd2lzZSB3ZSB3b3VsZCBrZWVwIGl0IHBhcnQgb2YgdGhlIHJpcHBsZSBjb250YWluZXIgZm9yZXZlci5cbiAgICAgICAgLy8gaHR0cHM6Ly93d3cudzMub3JnL1RSL2Nzcy10cmFuc2l0aW9ucy0xLyM6fjp0ZXh0PW5vJTIwbG9uZ2VyJTIwaW4lMjB0aGUlMjBkb2N1bWVudC5cbiAgICAgICAgcmlwcGxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25jYW5jZWwnLCBvblRyYW5zaXRpb25DYW5jZWwpO1xuICAgICAgICBldmVudExpc3RlbmVycyA9IHtvblRyYW5zaXRpb25FbmQsIG9uVHJhbnNpdGlvbkNhbmNlbH07XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIHJpcHBsZSByZWZlcmVuY2UgdG8gdGhlIGxpc3Qgb2YgYWxsIGFjdGl2ZSByaXBwbGVzLlxuICAgIHRoaXMuX2FjdGl2ZVJpcHBsZXMuc2V0KHJpcHBsZVJlZiwgZXZlbnRMaXN0ZW5lcnMpO1xuXG4gICAgLy8gSW4gY2FzZSB0aGVyZSBpcyBubyBmYWRlLWluIHRyYW5zaXRpb24gZHVyYXRpb24sIHdlIG5lZWQgdG8gbWFudWFsbHkgY2FsbCB0aGUgdHJhbnNpdGlvblxuICAgIC8vIGVuZCBsaXN0ZW5lciBiZWNhdXNlIGB0cmFuc2l0aW9uZW5kYCBkb2Vzbid0IGZpcmUgaWYgdGhlcmUgaXMgbm8gdHJhbnNpdGlvbi5cbiAgICBpZiAoYW5pbWF0aW9uRm9yY2libHlEaXNhYmxlZFRocm91Z2hDc3MgfHwgIWVudGVyRHVyYXRpb24pIHtcbiAgICAgIHRoaXMuX2ZpbmlzaFJpcHBsZVRyYW5zaXRpb24ocmlwcGxlUmVmKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmlwcGxlUmVmO1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCBhIHJpcHBsZSByZWZlcmVuY2UuICovXG4gIGZhZGVPdXRSaXBwbGUocmlwcGxlUmVmOiBSaXBwbGVSZWYpIHtcbiAgICAvLyBGb3IgcmlwcGxlcyBhbHJlYWR5IGZhZGluZyBvdXQgb3IgaGlkZGVuLCB0aGlzIHNob3VsZCBiZSBhIG5vb3AuXG4gICAgaWYgKHJpcHBsZVJlZi5zdGF0ZSA9PT0gUmlwcGxlU3RhdGUuRkFESU5HX09VVCB8fCByaXBwbGVSZWYuc3RhdGUgPT09IFJpcHBsZVN0YXRlLkhJRERFTikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJpcHBsZUVsID0gcmlwcGxlUmVmLmVsZW1lbnQ7XG4gICAgY29uc3QgYW5pbWF0aW9uQ29uZmlnID0gey4uLmRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcsIC4uLnJpcHBsZVJlZi5jb25maWcuYW5pbWF0aW9ufTtcblxuICAgIC8vIFRoaXMgc3RhcnRzIHRoZSBmYWRlLW91dCB0cmFuc2l0aW9uIGFuZCB3aWxsIGZpcmUgdGhlIHRyYW5zaXRpb24gZW5kIGxpc3RlbmVyIHRoYXRcbiAgICAvLyByZW1vdmVzIHRoZSByaXBwbGUgZWxlbWVudCBmcm9tIHRoZSBET00uXG4gICAgcmlwcGxlRWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7YW5pbWF0aW9uQ29uZmlnLmV4aXREdXJhdGlvbn1tc2A7XG4gICAgcmlwcGxlRWwuc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5GQURJTkdfT1VUO1xuXG4gICAgLy8gSW4gY2FzZSB0aGVyZSBpcyBubyBmYWRlLW91dCB0cmFuc2l0aW9uIGR1cmF0aW9uLCB3ZSBuZWVkIHRvIG1hbnVhbGx5IGNhbGwgdGhlXG4gICAgLy8gdHJhbnNpdGlvbiBlbmQgbGlzdGVuZXIgYmVjYXVzZSBgdHJhbnNpdGlvbmVuZGAgZG9lc24ndCBmaXJlIGlmIHRoZXJlIGlzIG5vIHRyYW5zaXRpb24uXG4gICAgaWYgKHJpcHBsZVJlZi5fYW5pbWF0aW9uRm9yY2libHlEaXNhYmxlZFRocm91Z2hDc3MgfHwgIWFuaW1hdGlvbkNvbmZpZy5leGl0RHVyYXRpb24pIHtcbiAgICAgIHRoaXMuX2ZpbmlzaFJpcHBsZVRyYW5zaXRpb24ocmlwcGxlUmVmKTtcbiAgICB9XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGFsbCBjdXJyZW50bHkgYWN0aXZlIHJpcHBsZXMuICovXG4gIGZhZGVPdXRBbGwoKSB7XG4gICAgdGhpcy5fZ2V0QWN0aXZlUmlwcGxlcygpLmZvckVhY2gocmlwcGxlID0+IHJpcHBsZS5mYWRlT3V0KCkpO1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCBhbGwgY3VycmVudGx5IGFjdGl2ZSBub24tcGVyc2lzdGVudCByaXBwbGVzLiAqL1xuICBmYWRlT3V0QWxsTm9uUGVyc2lzdGVudCgpIHtcbiAgICB0aGlzLl9nZXRBY3RpdmVSaXBwbGVzKCkuZm9yRWFjaChyaXBwbGUgPT4ge1xuICAgICAgaWYgKCFyaXBwbGUuY29uZmlnLnBlcnNpc3RlbnQpIHtcbiAgICAgICAgcmlwcGxlLmZhZGVPdXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSB0cmlnZ2VyIGV2ZW50IGxpc3RlbmVycyAqL1xuICBzZXR1cFRyaWdnZXJFdmVudHMoZWxlbWVudE9yRWxlbWVudFJlZjogSFRNTEVsZW1lbnQgfCBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjb2VyY2VFbGVtZW50KGVsZW1lbnRPckVsZW1lbnRSZWYpO1xuXG4gICAgaWYgKCFlbGVtZW50IHx8IGVsZW1lbnQgPT09IHRoaXMuX3RyaWdnZXJFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGFsbCBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHRyaWdnZXIgZWxlbWVudC5cbiAgICB0aGlzLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG5cbiAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMocG9pbnRlckRvd25FdmVudHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYWxsIHJlZ2lzdGVyZWQgZXZlbnRzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBoYW5kbGVFdmVudChldmVudDogRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicpIHtcbiAgICAgIHRoaXMuX29uTW91c2Vkb3duKGV2ZW50IGFzIE1vdXNlRXZlbnQpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG4gICAgICB0aGlzLl9vblRvdWNoU3RhcnQoZXZlbnQgYXMgVG91Y2hFdmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX29uUG9pbnRlclVwKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgcG9pbnRlci11cCBldmVudHMgaGF2ZW4ndCBiZWVuIHJlZ2lzdGVyZWQgeWV0LCBkbyBzbyBub3cuXG4gICAgLy8gV2UgZG8gdGhpcyBvbi1kZW1hbmQgaW4gb3JkZXIgdG8gcmVkdWNlIHRoZSB0b3RhbCBudW1iZXIgb2YgZXZlbnQgbGlzdGVuZXJzXG4gICAgLy8gcmVnaXN0ZXJlZCBieSB0aGUgcmlwcGxlcywgd2hpY2ggc3BlZWRzIHVwIHRoZSByZW5kZXJpbmcgdGltZSBmb3IgbGFyZ2UgVUlzLlxuICAgIGlmICghdGhpcy5fcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCkge1xuICAgICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMocG9pbnRlclVwRXZlbnRzKTtcbiAgICAgIHRoaXMuX3BvaW50ZXJVcEV2ZW50c1JlZ2lzdGVyZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBNZXRob2QgdGhhdCB3aWxsIGJlIGNhbGxlZCBpZiB0aGUgZmFkZS1pbiBvciBmYWRlLWluIHRyYW5zaXRpb24gY29tcGxldGVkLiAqL1xuICBwcml2YXRlIF9maW5pc2hSaXBwbGVUcmFuc2l0aW9uKHJpcHBsZVJlZjogUmlwcGxlUmVmKSB7XG4gICAgaWYgKHJpcHBsZVJlZi5zdGF0ZSA9PT0gUmlwcGxlU3RhdGUuRkFESU5HX0lOKSB7XG4gICAgICB0aGlzLl9zdGFydEZhZGVPdXRUcmFuc2l0aW9uKHJpcHBsZVJlZik7XG4gICAgfSBlbHNlIGlmIChyaXBwbGVSZWYuc3RhdGUgPT09IFJpcHBsZVN0YXRlLkZBRElOR19PVVQpIHtcbiAgICAgIHRoaXMuX2Rlc3Ryb3lSaXBwbGUocmlwcGxlUmVmKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBmYWRlLW91dCB0cmFuc2l0aW9uIG9mIHRoZSBnaXZlbiByaXBwbGUgaWYgaXQncyBub3QgcGVyc2lzdGVudCBhbmQgdGhlIHBvaW50ZXJcbiAgICogaXMgbm90IGhlbGQgZG93biBhbnltb3JlLlxuICAgKi9cbiAgcHJpdmF0ZSBfc3RhcnRGYWRlT3V0VHJhbnNpdGlvbihyaXBwbGVSZWY6IFJpcHBsZVJlZikge1xuICAgIGNvbnN0IGlzTW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSA9IHJpcHBsZVJlZiA9PT0gdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZTtcbiAgICBjb25zdCB7cGVyc2lzdGVudH0gPSByaXBwbGVSZWYuY29uZmlnO1xuXG4gICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuVklTSUJMRTtcblxuICAgIC8vIFdoZW4gdGhlIHRpbWVyIHJ1bnMgb3V0IHdoaWxlIHRoZSB1c2VyIGhhcyBrZXB0IHRoZWlyIHBvaW50ZXIgZG93biwgd2Ugd2FudCB0b1xuICAgIC8vIGtlZXAgb25seSB0aGUgcGVyc2lzdGVudCByaXBwbGVzIGFuZCB0aGUgbGF0ZXN0IHRyYW5zaWVudCByaXBwbGUuIFdlIGRvIHRoaXMsXG4gICAgLy8gYmVjYXVzZSB3ZSBkb24ndCB3YW50IHN0YWNrZWQgdHJhbnNpZW50IHJpcHBsZXMgdG8gYXBwZWFyIGFmdGVyIHRoZWlyIGVudGVyXG4gICAgLy8gYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC5cbiAgICBpZiAoIXBlcnNpc3RlbnQgJiYgKCFpc01vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgfHwgIXRoaXMuX2lzUG9pbnRlckRvd24pKSB7XG4gICAgICByaXBwbGVSZWYuZmFkZU91dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXN0cm95cyB0aGUgZ2l2ZW4gcmlwcGxlIGJ5IHJlbW92aW5nIGl0IGZyb20gdGhlIERPTSBhbmQgdXBkYXRpbmcgaXRzIHN0YXRlLiAqL1xuICBwcml2YXRlIF9kZXN0cm95UmlwcGxlKHJpcHBsZVJlZjogUmlwcGxlUmVmKSB7XG4gICAgY29uc3QgZXZlbnRMaXN0ZW5lcnMgPSB0aGlzLl9hY3RpdmVSaXBwbGVzLmdldChyaXBwbGVSZWYpID8/IG51bGw7XG4gICAgdGhpcy5fYWN0aXZlUmlwcGxlcy5kZWxldGUocmlwcGxlUmVmKTtcblxuICAgIC8vIENsZWFyIG91dCB0aGUgY2FjaGVkIGJvdW5kaW5nIHJlY3QgaWYgd2UgaGF2ZSBubyBtb3JlIHJpcHBsZXMuXG4gICAgaWYgKCF0aGlzLl9hY3RpdmVSaXBwbGVzLnNpemUpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lclJlY3QgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBjdXJyZW50IHJlZiBpcyB0aGUgbW9zdCByZWNlbnQgdHJhbnNpZW50IHJpcHBsZSwgdW5zZXQgaXRcbiAgICAvLyBhdm9pZCBtZW1vcnkgbGVha3MuXG4gICAgaWYgKHJpcHBsZVJlZiA9PT0gdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSkge1xuICAgICAgdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuSElEREVOO1xuICAgIGlmIChldmVudExpc3RlbmVycyAhPT0gbnVsbCkge1xuICAgICAgcmlwcGxlUmVmLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGV2ZW50TGlzdGVuZXJzLm9uVHJhbnNpdGlvbkVuZCk7XG4gICAgICByaXBwbGVSZWYuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uY2FuY2VsJywgZXZlbnRMaXN0ZW5lcnMub25UcmFuc2l0aW9uQ2FuY2VsKTtcbiAgICB9XG4gICAgcmlwcGxlUmVmLmVsZW1lbnQucmVtb3ZlKCk7XG4gIH1cblxuICAvKiogRnVuY3Rpb24gYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB0cmlnZ2VyIGlzIGJlaW5nIHByZXNzZWQgdXNpbmcgbW91c2UuICovXG4gIHByaXZhdGUgX29uTW91c2Vkb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgLy8gU2NyZWVuIHJlYWRlcnMgd2lsbCBmaXJlIGZha2UgbW91c2UgZXZlbnRzIGZvciBzcGFjZS9lbnRlci4gU2tpcCBsYXVuY2hpbmcgYVxuICAgIC8vIHJpcHBsZSBpbiB0aGlzIGNhc2UgZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlIG5vbi1zY3JlZW4tcmVhZGVyIGV4cGVyaWVuY2UuXG4gICAgY29uc3QgaXNGYWtlTW91c2Vkb3duID0gaXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlcihldmVudCk7XG4gICAgY29uc3QgaXNTeW50aGV0aWNFdmVudCA9XG4gICAgICB0aGlzLl9sYXN0VG91Y2hTdGFydEV2ZW50ICYmXG4gICAgICBEYXRlLm5vdygpIDwgdGhpcy5fbGFzdFRvdWNoU3RhcnRFdmVudCArIGlnbm9yZU1vdXNlRXZlbnRzVGltZW91dDtcblxuICAgIGlmICghdGhpcy5fdGFyZ2V0LnJpcHBsZURpc2FibGVkICYmICFpc0Zha2VNb3VzZWRvd24gJiYgIWlzU3ludGhldGljRXZlbnQpIHtcbiAgICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSB0cnVlO1xuICAgICAgdGhpcy5mYWRlSW5SaXBwbGUoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSwgdGhpcy5fdGFyZ2V0LnJpcHBsZUNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZ1bmN0aW9uIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgdHJpZ2dlciBpcyBiZWluZyBwcmVzc2VkIHVzaW5nIHRvdWNoLiAqL1xuICBwcml2YXRlIF9vblRvdWNoU3RhcnQoZXZlbnQ6IFRvdWNoRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuX3RhcmdldC5yaXBwbGVEaXNhYmxlZCAmJiAhaXNGYWtlVG91Y2hzdGFydEZyb21TY3JlZW5SZWFkZXIoZXZlbnQpKSB7XG4gICAgICAvLyBTb21lIGJyb3dzZXJzIGZpcmUgbW91c2UgZXZlbnRzIGFmdGVyIGEgYHRvdWNoc3RhcnRgIGV2ZW50LiBUaG9zZSBzeW50aGV0aWMgbW91c2VcbiAgICAgIC8vIGV2ZW50cyB3aWxsIGxhdW5jaCBhIHNlY29uZCByaXBwbGUgaWYgd2UgZG9uJ3QgaWdub3JlIG1vdXNlIGV2ZW50cyBmb3IgYSBzcGVjaWZpY1xuICAgICAgLy8gdGltZSBhZnRlciBhIHRvdWNoc3RhcnQgZXZlbnQuXG4gICAgICB0aGlzLl9sYXN0VG91Y2hTdGFydEV2ZW50ID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSB0cnVlO1xuXG4gICAgICAvLyBVc2UgYGNoYW5nZWRUb3VjaGVzYCBzbyB3ZSBza2lwIGFueSB0b3VjaGVzIHdoZXJlIHRoZSB1c2VyIHB1dFxuICAgICAgLy8gdGhlaXIgZmluZ2VyIGRvd24sIGJ1dCB1c2VkIGFub3RoZXIgZmluZ2VyIHRvIHRhcCB0aGUgZWxlbWVudCBhZ2Fpbi5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcztcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZmFkZUluUmlwcGxlKHRvdWNoZXNbaV0uY2xpZW50WCwgdG91Y2hlc1tpXS5jbGllbnRZLCB0aGlzLl90YXJnZXQucmlwcGxlQ29uZmlnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogRnVuY3Rpb24gYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB0cmlnZ2VyIGlzIGJlaW5nIHJlbGVhc2VkLiAqL1xuICBwcml2YXRlIF9vblBvaW50ZXJVcCgpIHtcbiAgICBpZiAoIXRoaXMuX2lzUG9pbnRlckRvd24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1BvaW50ZXJEb3duID0gZmFsc2U7XG5cbiAgICAvLyBGYWRlLW91dCBhbGwgcmlwcGxlcyB0aGF0IGFyZSB2aXNpYmxlIGFuZCBub3QgcGVyc2lzdGVudC5cbiAgICB0aGlzLl9nZXRBY3RpdmVSaXBwbGVzKCkuZm9yRWFjaChyaXBwbGUgPT4ge1xuICAgICAgLy8gQnkgZGVmYXVsdCwgb25seSByaXBwbGVzIHRoYXQgYXJlIGNvbXBsZXRlbHkgdmlzaWJsZSB3aWxsIGZhZGUgb3V0IG9uIHBvaW50ZXIgcmVsZWFzZS5cbiAgICAgIC8vIElmIHRoZSBgdGVybWluYXRlT25Qb2ludGVyVXBgIG9wdGlvbiBpcyBzZXQsIHJpcHBsZXMgdGhhdCBzdGlsbCBmYWRlIGluIHdpbGwgYWxzbyBmYWRlIG91dC5cbiAgICAgIGNvbnN0IGlzVmlzaWJsZSA9XG4gICAgICAgIHJpcHBsZS5zdGF0ZSA9PT0gUmlwcGxlU3RhdGUuVklTSUJMRSB8fFxuICAgICAgICAocmlwcGxlLmNvbmZpZy50ZXJtaW5hdGVPblBvaW50ZXJVcCAmJiByaXBwbGUuc3RhdGUgPT09IFJpcHBsZVN0YXRlLkZBRElOR19JTik7XG5cbiAgICAgIGlmICghcmlwcGxlLmNvbmZpZy5wZXJzaXN0ZW50ICYmIGlzVmlzaWJsZSkge1xuICAgICAgICByaXBwbGUuZmFkZU91dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJlZ2lzdGVycyBldmVudCBsaXN0ZW5lcnMgZm9yIGEgZ2l2ZW4gbGlzdCBvZiBldmVudHMuICovXG4gIHByaXZhdGUgX3JlZ2lzdGVyRXZlbnRzKGV2ZW50VHlwZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGV2ZW50VHlwZXMuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlckVsZW1lbnQhLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgdGhpcywgcGFzc2l2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEFjdGl2ZVJpcHBsZXMoKTogUmlwcGxlUmVmW10ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuX2FjdGl2ZVJpcHBsZXMua2V5cygpKTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdHJpZ2dlciBlbGVtZW50LiAqL1xuICBfcmVtb3ZlVHJpZ2dlckV2ZW50cygpIHtcbiAgICBpZiAodGhpcy5fdHJpZ2dlckVsZW1lbnQpIHtcbiAgICAgIHBvaW50ZXJEb3duRXZlbnRzLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJFbGVtZW50IS5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIHRoaXMsIHBhc3NpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLl9wb2ludGVyVXBFdmVudHNSZWdpc3RlcmVkKSB7XG4gICAgICAgIHBvaW50ZXJVcEV2ZW50cy5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgIHRoaXMuX3RyaWdnZXJFbGVtZW50IS5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIHRoaXMsIHBhc3NpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBwb2ludCAoeCwgeSkgdG8gdGhlIGZ1cnRoZXN0IGNvcm5lciBvZiBhIHJlY3RhbmdsZS5cbiAqL1xuZnVuY3Rpb24gZGlzdGFuY2VUb0Z1cnRoZXN0Q29ybmVyKHg6IG51bWJlciwgeTogbnVtYmVyLCByZWN0OiBDbGllbnRSZWN0KSB7XG4gIGNvbnN0IGRpc3RYID0gTWF0aC5tYXgoTWF0aC5hYnMoeCAtIHJlY3QubGVmdCksIE1hdGguYWJzKHggLSByZWN0LnJpZ2h0KSk7XG4gIGNvbnN0IGRpc3RZID0gTWF0aC5tYXgoTWF0aC5hYnMoeSAtIHJlY3QudG9wKSwgTWF0aC5hYnMoeSAtIHJlY3QuYm90dG9tKSk7XG4gIHJldHVybiBNYXRoLnNxcnQoZGlzdFggKiBkaXN0WCArIGRpc3RZICogZGlzdFkpO1xufVxuIl19