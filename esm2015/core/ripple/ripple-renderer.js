import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { isFakeMousedownFromScreenReader, isFakeTouchstartFromScreenReader } from '@angular/cdk/a11y';
import { coerceElement } from '@angular/cdk/coercion';
import { RippleRef } from './ripple-ref';
/**
 * Default ripple animation configuration for ripples without an explicit
 * animation config specified.
 */
export const defaultRippleAnimationConfig = {
    enterDuration: 450,
    exitDuration: 400
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
        /** Set of currently active ripple references. */
        this._activeRipples = new Set();
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
        const containerRect = this._containerRect =
            this._containerRect || this._containerElement.getBoundingClientRect();
        const animationConfig = Object.assign(Object.assign({}, defaultRippleAnimationConfig), config.animation);
        if (config.centered) {
            x = containerRect.left + containerRect.width / 2;
            y = containerRect.top + containerRect.height / 2;
        }
        const radius = config.radius || distanceToFurthestCorner(x, y, containerRect);
        const offsetX = x - containerRect.left;
        const offsetY = y - containerRect.top;
        const duration = animationConfig.enterDuration;
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
        const rippleRef = new RippleRef(this, ripple, config);
        rippleRef.state = 0 /* FADING_IN */;
        // Add the ripple reference to the list of all active ripples.
        this._activeRipples.add(rippleRef);
        if (!config.persistent) {
            this._mostRecentTransientRipple = rippleRef;
        }
        // Wait for the ripple element to be completely faded in.
        // Once it's faded in, the ripple can be hidden immediately if the mouse is released.
        this._runTimeoutOutsideZone(() => {
            const isMostRecentTransientRipple = rippleRef === this._mostRecentTransientRipple;
            rippleRef.state = 1 /* VISIBLE */;
            // When the timer runs out while the user has kept their pointer down, we want to
            // keep only the persistent ripples and the latest transient ripple. We do this,
            // because we don't want stacked transient ripples to appear after their enter
            // animation has finished.
            if (!config.persistent && (!isMostRecentTransientRipple || !this._isPointerDown)) {
                rippleRef.fadeOut();
            }
        }, duration);
        return rippleRef;
    }
    /** Fades out a ripple reference. */
    fadeOutRipple(rippleRef) {
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
        const rippleEl = rippleRef.element;
        const animationConfig = Object.assign(Object.assign({}, defaultRippleAnimationConfig), rippleRef.config.animation);
        rippleEl.style.transitionDuration = `${animationConfig.exitDuration}ms`;
        rippleEl.style.opacity = '0';
        rippleRef.state = 2 /* FADING_OUT */;
        // Once the ripple faded out, the ripple can be safely removed from the DOM.
        this._runTimeoutOutsideZone(() => {
            rippleRef.state = 3 /* HIDDEN */;
            rippleEl.parentNode.removeChild(rippleEl);
        }, animationConfig.exitDuration);
    }
    /** Fades out all currently active ripples. */
    fadeOutAll() {
        this._activeRipples.forEach(ripple => ripple.fadeOut());
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
        this._activeRipples.forEach(ripple => {
            // By default, only ripples that are completely visible will fade out on pointer release.
            // If the `terminateOnPointerUp` option is set, ripples that still fade in will also fade out.
            const isVisible = ripple.state === 1 /* VISIBLE */ ||
                ripple.config.terminateOnPointerUp && ripple.state === 0 /* FADING_IN */;
            if (!ripple.config.persistent && isVisible) {
                ripple.fadeOut();
            }
        });
    }
    /** Runs a timeout outside of the Angular zone to avoid triggering the change detection. */
    _runTimeoutOutsideZone(fn, delay = 0) {
        this._ngZone.runOutsideAngular(() => setTimeout(fn, delay));
    }
    /** Registers event listeners for a given list of events. */
    _registerEvents(eventTypes) {
        this._ngZone.runOutsideAngular(() => {
            eventTypes.forEach((type) => {
                this._triggerElement.addEventListener(type, this, passiveEventOptions);
            });
        });
    }
    /** Removes previously registered event listeners from the trigger element. */
    _removeTriggerEvents() {
        if (this._triggerElement) {
            pointerDownEvents.forEach((type) => {
                this._triggerElement.removeEventListener(type, this, passiveEventOptions);
            });
            if (this._pointerUpEventsRegistered) {
                pointerUpEvents.forEach((type) => {
                    this._triggerElement.removeEventListener(type, this, passiveEventOptions);
                });
            }
        }
    }
}
/** Enforces a style recalculation of a DOM element by computing its styles. */
function enforceStyleRecalculation(element) {
    // Enforce a style recalculation by calling `getComputedStyle` and accessing any property.
    // Calling `getPropertyValue` is important to let optimizers know that this is not a noop.
    // See: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
    window.getComputedStyle(element).getPropertyValue('opacity');
}
/**
 * Returns the distance from the point (x, y) to the furthest corner of a rectangle.
 */
function distanceToFurthestCorner(x, y, rect) {
    const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS1yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxPQUFPLEVBQVcsK0JBQStCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNoRixPQUFPLEVBQUMsK0JBQStCLEVBQUUsZ0NBQWdDLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDcEQsT0FBTyxFQUFDLFNBQVMsRUFBNEIsTUFBTSxjQUFjLENBQUM7QUFjbEU7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sNEJBQTRCLEdBQUc7SUFDMUMsYUFBYSxFQUFFLEdBQUc7SUFDbEIsWUFBWSxFQUFFLEdBQUc7Q0FDbEIsQ0FBQztBQUVGOzs7R0FHRztBQUNILE1BQU0sd0JBQXdCLEdBQUcsR0FBRyxDQUFDO0FBRXJDLDJGQUEyRjtBQUMzRixNQUFNLG1CQUFtQixHQUFHLCtCQUErQixDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7QUFFN0UsbURBQW1EO0FBQ25ELE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFdEQsaURBQWlEO0FBQ2pELE1BQU0sZUFBZSxHQUFHLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFFN0U7Ozs7OztHQU1HO0FBQ0gsTUFBTSxPQUFPLGNBQWM7SUE0QnpCLFlBQW9CLE9BQXFCLEVBQ3JCLE9BQWUsRUFDdkIsbUJBQTBELEVBQzFELFFBQWtCO1FBSFYsWUFBTyxHQUFQLE9BQU8sQ0FBYztRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBdEJuQyxvREFBb0Q7UUFDNUMsbUJBQWMsR0FBRyxLQUFLLENB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R0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMxRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMxRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDbEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtFbGVtZW50UmVmLCBOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQbGF0Zm9ybSwgbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9uc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7aXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlciwgaXNGYWtlVG91Y2hzdGFydEZyb21TY3JlZW5SZWFkZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Y29lcmNlRWxlbWVudH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UmlwcGxlUmVmLCBSaXBwbGVTdGF0ZSwgUmlwcGxlQ29uZmlnfSBmcm9tICcuL3JpcHBsZS1yZWYnO1xuXG4vKipcbiAqIEludGVyZmFjZSB0aGF0IGRlc2NyaWJlcyB0aGUgdGFyZ2V0IGZvciBsYXVuY2hpbmcgcmlwcGxlcy5cbiAqIEl0IGRlZmluZXMgdGhlIHJpcHBsZSBjb25maWd1cmF0aW9uIGFuZCBkaXNhYmxlZCBzdGF0ZSBmb3IgaW50ZXJhY3Rpb24gcmlwcGxlcy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSaXBwbGVUYXJnZXQge1xuICAvKiogQ29uZmlndXJhdGlvbiBmb3IgcmlwcGxlcyB0aGF0IGFyZSBsYXVuY2hlZCBvbiBwb2ludGVyIGRvd24uICovXG4gIHJpcHBsZUNvbmZpZzogUmlwcGxlQ29uZmlnO1xuICAvKiogV2hldGhlciByaXBwbGVzIG9uIHBvaW50ZXIgZG93biBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIHJpcHBsZURpc2FibGVkOiBib29sZWFuO1xufVxuXG4vKipcbiAqIERlZmF1bHQgcmlwcGxlIGFuaW1hdGlvbiBjb25maWd1cmF0aW9uIGZvciByaXBwbGVzIHdpdGhvdXQgYW4gZXhwbGljaXRcbiAqIGFuaW1hdGlvbiBjb25maWcgc3BlY2lmaWVkLlxuICovXG5leHBvcnQgY29uc3QgZGVmYXVsdFJpcHBsZUFuaW1hdGlvbkNvbmZpZyA9IHtcbiAgZW50ZXJEdXJhdGlvbjogNDUwLFxuICBleGl0RHVyYXRpb246IDQwMFxufTtcblxuLyoqXG4gKiBUaW1lb3V0IGZvciBpZ25vcmluZyBtb3VzZSBldmVudHMuIE1vdXNlIGV2ZW50cyB3aWxsIGJlIHRlbXBvcmFyeSBpZ25vcmVkIGFmdGVyIHRvdWNoXG4gKiBldmVudHMgdG8gYXZvaWQgc3ludGhldGljIG1vdXNlIGV2ZW50cy5cbiAqL1xuY29uc3QgaWdub3JlTW91c2VFdmVudHNUaW1lb3V0ID0gODAwO1xuXG4vKiogT3B0aW9ucyB0aGF0IGFwcGx5IHRvIGFsbCB0aGUgZXZlbnQgbGlzdGVuZXJzIHRoYXQgYXJlIGJvdW5kIGJ5IHRoZSByaXBwbGUgcmVuZGVyZXIuICovXG5jb25zdCBwYXNzaXZlRXZlbnRPcHRpb25zID0gbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyh7cGFzc2l2ZTogdHJ1ZX0pO1xuXG4vKiogRXZlbnRzIHRoYXQgc2lnbmFsIHRoYXQgdGhlIHBvaW50ZXIgaXMgZG93bi4gKi9cbmNvbnN0IHBvaW50ZXJEb3duRXZlbnRzID0gWydtb3VzZWRvd24nLCAndG91Y2hzdGFydCddO1xuXG4vKiogRXZlbnRzIHRoYXQgc2lnbmFsIHRoYXQgdGhlIHBvaW50ZXIgaXMgdXAuICovXG5jb25zdCBwb2ludGVyVXBFdmVudHMgPSBbJ21vdXNldXAnLCAnbW91c2VsZWF2ZScsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCddO1xuXG4vKipcbiAqIEhlbHBlciBzZXJ2aWNlIHRoYXQgcGVyZm9ybXMgRE9NIG1hbmlwdWxhdGlvbnMuIE5vdCBpbnRlbmRlZCB0byBiZSB1c2VkIG91dHNpZGUgdGhpcyBtb2R1bGUuXG4gKiBUaGUgY29uc3RydWN0b3IgdGFrZXMgYSByZWZlcmVuY2UgdG8gdGhlIHJpcHBsZSBkaXJlY3RpdmUncyBob3N0IGVsZW1lbnQgYW5kIGEgbWFwIG9mIERPTVxuICogZXZlbnQgaGFuZGxlcnMgdG8gYmUgaW5zdGFsbGVkIG9uIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcnMgcmlwcGxlIGFuaW1hdGlvbnMuXG4gKiBUaGlzIHdpbGwgZXZlbnR1YWxseSBiZWNvbWUgYSBjdXN0b20gcmVuZGVyZXIgb25jZSBBbmd1bGFyIHN1cHBvcnQgZXhpc3RzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgUmlwcGxlUmVuZGVyZXIgaW1wbGVtZW50cyBFdmVudExpc3RlbmVyT2JqZWN0IHtcbiAgLyoqIEVsZW1lbnQgd2hlcmUgdGhlIHJpcHBsZXMgYXJlIGJlaW5nIGFkZGVkIHRvLiAqL1xuICBwcml2YXRlIF9jb250YWluZXJFbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAvKiogRWxlbWVudCB3aGljaCB0cmlnZ2VycyB0aGUgcmlwcGxlIGVsZW1lbnRzIG9uIG1vdXNlIGV2ZW50cy4gKi9cbiAgcHJpdmF0ZSBfdHJpZ2dlckVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgcG9pbnRlciBpcyBjdXJyZW50bHkgZG93biBvciBub3QuICovXG4gIHByaXZhdGUgX2lzUG9pbnRlckRvd24gPSBmYWxzZTtcblxuICAvKiogU2V0IG9mIGN1cnJlbnRseSBhY3RpdmUgcmlwcGxlIHJlZmVyZW5jZXMuICovXG4gIHByaXZhdGUgX2FjdGl2ZVJpcHBsZXMgPSBuZXcgU2V0PFJpcHBsZVJlZj4oKTtcblxuICAvKiogTGF0ZXN0IG5vbi1wZXJzaXN0ZW50IHJpcHBsZSB0aGF0IHdhcyB0cmlnZ2VyZWQuICovXG4gIHByaXZhdGUgX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGU6IFJpcHBsZVJlZiB8IG51bGw7XG5cbiAgLyoqIFRpbWUgaW4gbWlsbGlzZWNvbmRzIHdoZW4gdGhlIGxhc3QgdG91Y2hzdGFydCBldmVudCBoYXBwZW5lZC4gKi9cbiAgcHJpdmF0ZSBfbGFzdFRvdWNoU3RhcnRFdmVudDogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHBvaW50ZXItdXAgZXZlbnQgbGlzdGVuZXJzIGhhdmUgYmVlbiByZWdpc3RlcmVkLiAqL1xuICBwcml2YXRlIF9wb2ludGVyVXBFdmVudHNSZWdpc3RlcmVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIENhY2hlZCBkaW1lbnNpb25zIG9mIHRoZSByaXBwbGUgY29udGFpbmVyLiBTZXQgd2hlbiB0aGUgZmlyc3RcbiAgICogcmlwcGxlIGlzIHNob3duIGFuZCBjbGVhcmVkIG9uY2Ugbm8gbW9yZSByaXBwbGVzIGFyZSB2aXNpYmxlLlxuICAgKi9cbiAgcHJpdmF0ZSBfY29udGFpbmVyUmVjdDogQ2xpZW50UmVjdCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdGFyZ2V0OiBSaXBwbGVUYXJnZXQsXG4gICAgICAgICAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBlbGVtZW50T3JFbGVtZW50UmVmOiBIVE1MRWxlbWVudCB8IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwbGF0Zm9ybTogUGxhdGZvcm0pIHtcblxuICAgIC8vIE9ubHkgZG8gYW55dGhpbmcgaWYgd2UncmUgb24gdGhlIGJyb3dzZXIuXG4gICAgaWYgKHBsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29udGFpbmVyRWxlbWVudCA9IGNvZXJjZUVsZW1lbnQoZWxlbWVudE9yRWxlbWVudFJlZik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZhZGVzIGluIGEgcmlwcGxlIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlcy5cbiAgICogQHBhcmFtIHggQ29vcmRpbmF0ZSB3aXRoaW4gdGhlIGVsZW1lbnQsIGFsb25nIHRoZSBYIGF4aXMgYXQgd2hpY2ggdG8gc3RhcnQgdGhlIHJpcHBsZS5cbiAgICogQHBhcmFtIHkgQ29vcmRpbmF0ZSB3aXRoaW4gdGhlIGVsZW1lbnQsIGFsb25nIHRoZSBZIGF4aXMgYXQgd2hpY2ggdG8gc3RhcnQgdGhlIHJpcHBsZS5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSByaXBwbGUgb3B0aW9ucy5cbiAgICovXG4gIGZhZGVJblJpcHBsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uZmlnOiBSaXBwbGVDb25maWcgPSB7fSk6IFJpcHBsZVJlZiB7XG4gICAgY29uc3QgY29udGFpbmVyUmVjdCA9IHRoaXMuX2NvbnRhaW5lclJlY3QgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250YWluZXJSZWN0IHx8IHRoaXMuX2NvbnRhaW5lckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgYW5pbWF0aW9uQ29uZmlnID0gey4uLmRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcsIC4uLmNvbmZpZy5hbmltYXRpb259O1xuXG4gICAgaWYgKGNvbmZpZy5jZW50ZXJlZCkge1xuICAgICAgeCA9IGNvbnRhaW5lclJlY3QubGVmdCArIGNvbnRhaW5lclJlY3Qud2lkdGggLyAyO1xuICAgICAgeSA9IGNvbnRhaW5lclJlY3QudG9wICsgY29udGFpbmVyUmVjdC5oZWlnaHQgLyAyO1xuICAgIH1cblxuICAgIGNvbnN0IHJhZGl1cyA9IGNvbmZpZy5yYWRpdXMgfHwgZGlzdGFuY2VUb0Z1cnRoZXN0Q29ybmVyKHgsIHksIGNvbnRhaW5lclJlY3QpO1xuICAgIGNvbnN0IG9mZnNldFggPSB4IC0gY29udGFpbmVyUmVjdC5sZWZ0O1xuICAgIGNvbnN0IG9mZnNldFkgPSB5IC0gY29udGFpbmVyUmVjdC50b3A7XG4gICAgY29uc3QgZHVyYXRpb24gPSBhbmltYXRpb25Db25maWcuZW50ZXJEdXJhdGlvbjtcblxuICAgIGNvbnN0IHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJpcHBsZS5jbGFzc0xpc3QuYWRkKCdtYXQtcmlwcGxlLWVsZW1lbnQnKTtcblxuICAgIHJpcHBsZS5zdHlsZS5sZWZ0ID0gYCR7b2Zmc2V0WCAtIHJhZGl1c31weGA7XG4gICAgcmlwcGxlLnN0eWxlLnRvcCA9IGAke29mZnNldFkgLSByYWRpdXN9cHhgO1xuICAgIHJpcHBsZS5zdHlsZS5oZWlnaHQgPSBgJHtyYWRpdXMgKiAyfXB4YDtcbiAgICByaXBwbGUuc3R5bGUud2lkdGggPSBgJHtyYWRpdXMgKiAyfXB4YDtcblxuICAgIC8vIElmIGEgY3VzdG9tIGNvbG9yIGhhcyBiZWVuIHNwZWNpZmllZCwgc2V0IGl0IGFzIGlubGluZSBzdHlsZS4gSWYgbm8gY29sb3IgaXNcbiAgICAvLyBzZXQsIHRoZSBkZWZhdWx0IGNvbG9yIHdpbGwgYmUgYXBwbGllZCB0aHJvdWdoIHRoZSByaXBwbGUgdGhlbWUgc3R5bGVzLlxuICAgIGlmIChjb25maWcuY29sb3IgIT0gbnVsbCkge1xuICAgICAgcmlwcGxlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbmZpZy5jb2xvcjtcbiAgICB9XG5cbiAgICByaXBwbGUuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuXG4gICAgdGhpcy5fY29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChyaXBwbGUpO1xuXG4gICAgLy8gQnkgZGVmYXVsdCB0aGUgYnJvd3NlciBkb2VzIG5vdCByZWNhbGN1bGF0ZSB0aGUgc3R5bGVzIG9mIGR5bmFtaWNhbGx5IGNyZWF0ZWRcbiAgICAvLyByaXBwbGUgZWxlbWVudHMuIFRoaXMgaXMgY3JpdGljYWwgYmVjYXVzZSB0aGVuIHRoZSBgc2NhbGVgIHdvdWxkIG5vdCBhbmltYXRlIHByb3Blcmx5LlxuICAgIGVuZm9yY2VTdHlsZVJlY2FsY3VsYXRpb24ocmlwcGxlKTtcblxuICAgIHJpcHBsZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoMSknO1xuXG4gICAgLy8gRXhwb3NlZCByZWZlcmVuY2UgdG8gdGhlIHJpcHBsZSB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuXG4gICAgY29uc3QgcmlwcGxlUmVmID0gbmV3IFJpcHBsZVJlZih0aGlzLCByaXBwbGUsIGNvbmZpZyk7XG5cbiAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5GQURJTkdfSU47XG5cbiAgICAvLyBBZGQgdGhlIHJpcHBsZSByZWZlcmVuY2UgdG8gdGhlIGxpc3Qgb2YgYWxsIGFjdGl2ZSByaXBwbGVzLlxuICAgIHRoaXMuX2FjdGl2ZVJpcHBsZXMuYWRkKHJpcHBsZVJlZik7XG5cbiAgICBpZiAoIWNvbmZpZy5wZXJzaXN0ZW50KSB7XG4gICAgICB0aGlzLl9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlID0gcmlwcGxlUmVmO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIHRoZSByaXBwbGUgZWxlbWVudCB0byBiZSBjb21wbGV0ZWx5IGZhZGVkIGluLlxuICAgIC8vIE9uY2UgaXQncyBmYWRlZCBpbiwgdGhlIHJpcHBsZSBjYW4gYmUgaGlkZGVuIGltbWVkaWF0ZWx5IGlmIHRoZSBtb3VzZSBpcyByZWxlYXNlZC5cbiAgICB0aGlzLl9ydW5UaW1lb3V0T3V0c2lkZVpvbmUoKCkgPT4ge1xuICAgICAgY29uc3QgaXNNb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlID0gcmlwcGxlUmVmID09PSB0aGlzLl9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlO1xuXG4gICAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5WSVNJQkxFO1xuXG4gICAgICAvLyBXaGVuIHRoZSB0aW1lciBydW5zIG91dCB3aGlsZSB0aGUgdXNlciBoYXMga2VwdCB0aGVpciBwb2ludGVyIGRvd24sIHdlIHdhbnQgdG9cbiAgICAgIC8vIGtlZXAgb25seSB0aGUgcGVyc2lzdGVudCByaXBwbGVzIGFuZCB0aGUgbGF0ZXN0IHRyYW5zaWVudCByaXBwbGUuIFdlIGRvIHRoaXMsXG4gICAgICAvLyBiZWNhdXNlIHdlIGRvbid0IHdhbnQgc3RhY2tlZCB0cmFuc2llbnQgcmlwcGxlcyB0byBhcHBlYXIgYWZ0ZXIgdGhlaXIgZW50ZXJcbiAgICAgIC8vIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQuXG4gICAgICBpZiAoIWNvbmZpZy5wZXJzaXN0ZW50ICYmICghaXNNb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlIHx8ICF0aGlzLl9pc1BvaW50ZXJEb3duKSkge1xuICAgICAgICByaXBwbGVSZWYuZmFkZU91dCgpO1xuICAgICAgfVxuICAgIH0sIGR1cmF0aW9uKTtcblxuICAgIHJldHVybiByaXBwbGVSZWY7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGEgcmlwcGxlIHJlZmVyZW5jZS4gKi9cbiAgZmFkZU91dFJpcHBsZShyaXBwbGVSZWY6IFJpcHBsZVJlZikge1xuICAgIGNvbnN0IHdhc0FjdGl2ZSA9IHRoaXMuX2FjdGl2ZVJpcHBsZXMuZGVsZXRlKHJpcHBsZVJlZik7XG5cbiAgICBpZiAocmlwcGxlUmVmID09PSB0aGlzLl9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlKSB7XG4gICAgICB0aGlzLl9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBDbGVhciBvdXQgdGhlIGNhY2hlZCBib3VuZGluZyByZWN0IGlmIHdlIGhhdmUgbm8gbW9yZSByaXBwbGVzLlxuICAgIGlmICghdGhpcy5fYWN0aXZlUmlwcGxlcy5zaXplKSB7XG4gICAgICB0aGlzLl9jb250YWluZXJSZWN0ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBGb3IgcmlwcGxlcyB0aGF0IGFyZSBub3QgYWN0aXZlIGFueW1vcmUsIGRvbid0IHJlLXJ1biB0aGUgZmFkZS1vdXQgYW5pbWF0aW9uLlxuICAgIGlmICghd2FzQWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmlwcGxlRWwgPSByaXBwbGVSZWYuZWxlbWVudDtcbiAgICBjb25zdCBhbmltYXRpb25Db25maWcgPSB7Li4uZGVmYXVsdFJpcHBsZUFuaW1hdGlvbkNvbmZpZywgLi4ucmlwcGxlUmVmLmNvbmZpZy5hbmltYXRpb259O1xuXG4gICAgcmlwcGxlRWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7YW5pbWF0aW9uQ29uZmlnLmV4aXREdXJhdGlvbn1tc2A7XG4gICAgcmlwcGxlRWwuc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5GQURJTkdfT1VUO1xuXG4gICAgLy8gT25jZSB0aGUgcmlwcGxlIGZhZGVkIG91dCwgdGhlIHJpcHBsZSBjYW4gYmUgc2FmZWx5IHJlbW92ZWQgZnJvbSB0aGUgRE9NLlxuICAgIHRoaXMuX3J1blRpbWVvdXRPdXRzaWRlWm9uZSgoKSA9PiB7XG4gICAgICByaXBwbGVSZWYuc3RhdGUgPSBSaXBwbGVTdGF0ZS5ISURERU47XG4gICAgICByaXBwbGVFbC5wYXJlbnROb2RlIS5yZW1vdmVDaGlsZChyaXBwbGVFbCk7XG4gICAgfSwgYW5pbWF0aW9uQ29uZmlnLmV4aXREdXJhdGlvbik7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGFsbCBjdXJyZW50bHkgYWN0aXZlIHJpcHBsZXMuICovXG4gIGZhZGVPdXRBbGwoKSB7XG4gICAgdGhpcy5fYWN0aXZlUmlwcGxlcy5mb3JFYWNoKHJpcHBsZSA9PiByaXBwbGUuZmFkZU91dCgpKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSB0cmlnZ2VyIGV2ZW50IGxpc3RlbmVycyAqL1xuICBzZXR1cFRyaWdnZXJFdmVudHMoZWxlbWVudE9yRWxlbWVudFJlZjogSFRNTEVsZW1lbnQgfCBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjb2VyY2VFbGVtZW50KGVsZW1lbnRPckVsZW1lbnRSZWYpO1xuXG4gICAgaWYgKCFlbGVtZW50IHx8IGVsZW1lbnQgPT09IHRoaXMuX3RyaWdnZXJFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGFsbCBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHRyaWdnZXIgZWxlbWVudC5cbiAgICB0aGlzLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG5cbiAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMocG9pbnRlckRvd25FdmVudHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYWxsIHJlZ2lzdGVyZWQgZXZlbnRzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBoYW5kbGVFdmVudChldmVudDogRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicpIHtcbiAgICAgIHRoaXMuX29uTW91c2Vkb3duKGV2ZW50IGFzIE1vdXNlRXZlbnQpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG4gICAgICB0aGlzLl9vblRvdWNoU3RhcnQoZXZlbnQgYXMgVG91Y2hFdmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX29uUG9pbnRlclVwKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgcG9pbnRlci11cCBldmVudHMgaGF2ZW4ndCBiZWVuIHJlZ2lzdGVyZWQgeWV0LCBkbyBzbyBub3cuXG4gICAgLy8gV2UgZG8gdGhpcyBvbi1kZW1hbmQgaW4gb3JkZXIgdG8gcmVkdWNlIHRoZSB0b3RhbCBudW1iZXIgb2YgZXZlbnQgbGlzdGVuZXJzXG4gICAgLy8gcmVnaXN0ZXJlZCBieSB0aGUgcmlwcGxlcywgd2hpY2ggc3BlZWRzIHVwIHRoZSByZW5kZXJpbmcgdGltZSBmb3IgbGFyZ2UgVUlzLlxuICAgIGlmICghdGhpcy5fcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCkge1xuICAgICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMocG9pbnRlclVwRXZlbnRzKTtcbiAgICAgIHRoaXMuX3BvaW50ZXJVcEV2ZW50c1JlZ2lzdGVyZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBGdW5jdGlvbiBiZWluZyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHRyaWdnZXIgaXMgYmVpbmcgcHJlc3NlZCB1c2luZyBtb3VzZS4gKi9cbiAgcHJpdmF0ZSBfb25Nb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAvLyBTY3JlZW4gcmVhZGVycyB3aWxsIGZpcmUgZmFrZSBtb3VzZSBldmVudHMgZm9yIHNwYWNlL2VudGVyLiBTa2lwIGxhdW5jaGluZyBhXG4gICAgLy8gcmlwcGxlIGluIHRoaXMgY2FzZSBmb3IgY29uc2lzdGVuY3kgd2l0aCB0aGUgbm9uLXNjcmVlbi1yZWFkZXIgZXhwZXJpZW5jZS5cbiAgICBjb25zdCBpc0Zha2VNb3VzZWRvd24gPSBpc0Zha2VNb3VzZWRvd25Gcm9tU2NyZWVuUmVhZGVyKGV2ZW50KTtcbiAgICBjb25zdCBpc1N5bnRoZXRpY0V2ZW50ID0gdGhpcy5fbGFzdFRvdWNoU3RhcnRFdmVudCAmJlxuICAgICAgICBEYXRlLm5vdygpIDwgdGhpcy5fbGFzdFRvdWNoU3RhcnRFdmVudCArIGlnbm9yZU1vdXNlRXZlbnRzVGltZW91dDtcblxuICAgIGlmICghdGhpcy5fdGFyZ2V0LnJpcHBsZURpc2FibGVkICYmICFpc0Zha2VNb3VzZWRvd24gJiYgIWlzU3ludGhldGljRXZlbnQpIHtcbiAgICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSB0cnVlO1xuICAgICAgdGhpcy5mYWRlSW5SaXBwbGUoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSwgdGhpcy5fdGFyZ2V0LnJpcHBsZUNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZ1bmN0aW9uIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgdHJpZ2dlciBpcyBiZWluZyBwcmVzc2VkIHVzaW5nIHRvdWNoLiAqL1xuICBwcml2YXRlIF9vblRvdWNoU3RhcnQoZXZlbnQ6IFRvdWNoRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuX3RhcmdldC5yaXBwbGVEaXNhYmxlZCAmJiAhaXNGYWtlVG91Y2hzdGFydEZyb21TY3JlZW5SZWFkZXIoZXZlbnQpKSB7XG4gICAgICAvLyBTb21lIGJyb3dzZXJzIGZpcmUgbW91c2UgZXZlbnRzIGFmdGVyIGEgYHRvdWNoc3RhcnRgIGV2ZW50LiBUaG9zZSBzeW50aGV0aWMgbW91c2VcbiAgICAgIC8vIGV2ZW50cyB3aWxsIGxhdW5jaCBhIHNlY29uZCByaXBwbGUgaWYgd2UgZG9uJ3QgaWdub3JlIG1vdXNlIGV2ZW50cyBmb3IgYSBzcGVjaWZpY1xuICAgICAgLy8gdGltZSBhZnRlciBhIHRvdWNoc3RhcnQgZXZlbnQuXG4gICAgICB0aGlzLl9sYXN0VG91Y2hTdGFydEV2ZW50ID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSB0cnVlO1xuXG4gICAgICAvLyBVc2UgYGNoYW5nZWRUb3VjaGVzYCBzbyB3ZSBza2lwIGFueSB0b3VjaGVzIHdoZXJlIHRoZSB1c2VyIHB1dFxuICAgICAgLy8gdGhlaXIgZmluZ2VyIGRvd24sIGJ1dCB1c2VkIGFub3RoZXIgZmluZ2VyIHRvIHRhcCB0aGUgZWxlbWVudCBhZ2Fpbi5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcztcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZmFkZUluUmlwcGxlKHRvdWNoZXNbaV0uY2xpZW50WCwgdG91Y2hlc1tpXS5jbGllbnRZLCB0aGlzLl90YXJnZXQucmlwcGxlQ29uZmlnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogRnVuY3Rpb24gYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB0cmlnZ2VyIGlzIGJlaW5nIHJlbGVhc2VkLiAqL1xuICBwcml2YXRlIF9vblBvaW50ZXJVcCgpIHtcbiAgICBpZiAoIXRoaXMuX2lzUG9pbnRlckRvd24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1BvaW50ZXJEb3duID0gZmFsc2U7XG5cbiAgICAvLyBGYWRlLW91dCBhbGwgcmlwcGxlcyB0aGF0IGFyZSB2aXNpYmxlIGFuZCBub3QgcGVyc2lzdGVudC5cbiAgICB0aGlzLl9hY3RpdmVSaXBwbGVzLmZvckVhY2gocmlwcGxlID0+IHtcbiAgICAgIC8vIEJ5IGRlZmF1bHQsIG9ubHkgcmlwcGxlcyB0aGF0IGFyZSBjb21wbGV0ZWx5IHZpc2libGUgd2lsbCBmYWRlIG91dCBvbiBwb2ludGVyIHJlbGVhc2UuXG4gICAgICAvLyBJZiB0aGUgYHRlcm1pbmF0ZU9uUG9pbnRlclVwYCBvcHRpb24gaXMgc2V0LCByaXBwbGVzIHRoYXQgc3RpbGwgZmFkZSBpbiB3aWxsIGFsc28gZmFkZSBvdXQuXG4gICAgICBjb25zdCBpc1Zpc2libGUgPSByaXBwbGUuc3RhdGUgPT09IFJpcHBsZVN0YXRlLlZJU0lCTEUgfHxcbiAgICAgICAgcmlwcGxlLmNvbmZpZy50ZXJtaW5hdGVPblBvaW50ZXJVcCAmJiByaXBwbGUuc3RhdGUgPT09IFJpcHBsZVN0YXRlLkZBRElOR19JTjtcblxuICAgICAgaWYgKCFyaXBwbGUuY29uZmlnLnBlcnNpc3RlbnQgJiYgaXNWaXNpYmxlKSB7XG4gICAgICAgIHJpcHBsZS5mYWRlT3V0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogUnVucyBhIHRpbWVvdXQgb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lIHRvIGF2b2lkIHRyaWdnZXJpbmcgdGhlIGNoYW5nZSBkZXRlY3Rpb24uICovXG4gIHByaXZhdGUgX3J1blRpbWVvdXRPdXRzaWRlWm9uZShmbjogRnVuY3Rpb24sIGRlbGF5ID0gMCkge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiBzZXRUaW1lb3V0KGZuLCBkZWxheSkpO1xuICB9XG5cbiAgLyoqIFJlZ2lzdGVycyBldmVudCBsaXN0ZW5lcnMgZm9yIGEgZ2l2ZW4gbGlzdCBvZiBldmVudHMuICovXG4gIHByaXZhdGUgX3JlZ2lzdGVyRXZlbnRzKGV2ZW50VHlwZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGV2ZW50VHlwZXMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCEuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzLCBwYXNzaXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgcHJldmlvdXNseSByZWdpc3RlcmVkIGV2ZW50IGxpc3RlbmVycyBmcm9tIHRoZSB0cmlnZ2VyIGVsZW1lbnQuICovXG4gIF9yZW1vdmVUcmlnZ2VyRXZlbnRzKCkge1xuICAgIGlmICh0aGlzLl90cmlnZ2VyRWxlbWVudCkge1xuICAgICAgcG9pbnRlckRvd25FdmVudHMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCEucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzLCBwYXNzaXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5fcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCkge1xuICAgICAgICBwb2ludGVyVXBFdmVudHMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICAgIHRoaXMuX3RyaWdnZXJFbGVtZW50IS5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIHRoaXMsIHBhc3NpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqIEVuZm9yY2VzIGEgc3R5bGUgcmVjYWxjdWxhdGlvbiBvZiBhIERPTSBlbGVtZW50IGJ5IGNvbXB1dGluZyBpdHMgc3R5bGVzLiAqL1xuZnVuY3Rpb24gZW5mb3JjZVN0eWxlUmVjYWxjdWxhdGlvbihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAvLyBFbmZvcmNlIGEgc3R5bGUgcmVjYWxjdWxhdGlvbiBieSBjYWxsaW5nIGBnZXRDb21wdXRlZFN0eWxlYCBhbmQgYWNjZXNzaW5nIGFueSBwcm9wZXJ0eS5cbiAgLy8gQ2FsbGluZyBgZ2V0UHJvcGVydHlWYWx1ZWAgaXMgaW1wb3J0YW50IHRvIGxldCBvcHRpbWl6ZXJzIGtub3cgdGhhdCB0aGlzIGlzIG5vdCBhIG5vb3AuXG4gIC8vIFNlZTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzVkNTJmYjA4MWIzNTcwYzgxZTNhXG4gIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ29wYWNpdHknKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBwb2ludCAoeCwgeSkgdG8gdGhlIGZ1cnRoZXN0IGNvcm5lciBvZiBhIHJlY3RhbmdsZS5cbiAqL1xuZnVuY3Rpb24gZGlzdGFuY2VUb0Z1cnRoZXN0Q29ybmVyKHg6IG51bWJlciwgeTogbnVtYmVyLCByZWN0OiBDbGllbnRSZWN0KSB7XG4gIGNvbnN0IGRpc3RYID0gTWF0aC5tYXgoTWF0aC5hYnMoeCAtIHJlY3QubGVmdCksIE1hdGguYWJzKHggLSByZWN0LnJpZ2h0KSk7XG4gIGNvbnN0IGRpc3RZID0gTWF0aC5tYXgoTWF0aC5hYnMoeSAtIHJlY3QudG9wKSwgTWF0aC5hYnMoeSAtIHJlY3QuYm90dG9tKSk7XG4gIHJldHVybiBNYXRoLnNxcnQoZGlzdFggKiBkaXN0WCArIGRpc3RZICogZGlzdFkpO1xufVxuIl19