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
    exitDuration: 150
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
    /** Fades out all currently active non-persistent ripples. */
    fadeOutAllNonPersistent() {
        this._activeRipples.forEach(ripple => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS1yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxPQUFPLEVBQVcsK0JBQStCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNoRixPQUFPLEVBQUMsK0JBQStCLEVBQUUsZ0NBQWdDLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDcEQsT0FBTyxFQUFDLFNBQVMsRUFBNEIsTUFBTSxjQUFjLENBQUM7QUFlbEUsZ0VBQWdFO0FBQ2hFOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFHO0lBQzFDLGFBQWEsRUFBRSxHQUFHO0lBQ2xCLFlBQVksRUFBRSxHQUFHO0NBQ2xCLENBQUM7QUFFRjs7O0dBR0c7QUFDSCxNQUFNLHdCQUF3QixHQUFHLEdBQUcsQ0FBQztBQUVyQywyRkFBMkY7QUFDM0YsTUFBTSxtQkFBbUIsR0FBRywrQkFBK0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBRTdFLG1EQUFtRDtBQUNuRCxNQUFNLGlCQUFpQixHQUFHLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRXRELGlEQUFpRDtBQUNqRCxNQUFNLGVBQWUsR0FBRyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBRTdFOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBNEJ6QixZQUFvQixPQUFxQixFQUNyQixPQUFlLEVBQ3ZCLG1CQUEwRCxFQUMxRCxRQUFrQjtRQUhWLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFDckIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQXRCbkMsb0RBQW9EO1FBQzVDLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBRS9CLGlEQUFpRDtRQUN6QyxtQkFBYyxHQUFHLElBQUksR0FBRyxFQUFhLENBQUM7UUFROUMsK0RBQStEO1FBQ3ZELCtCQUEwQixHQUFHLEtBQUssQ0FBQztRQWF6Qyw0Q0FBNEM7UUFDNUMsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUM3RDtJQUNILENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFlBQVksQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLFNBQXVCLEVBQUU7UUFDMUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWM7WUFDbkIsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUM1RixNQUFNLGVBQWUsbUNBQU8sNEJBQTRCLEdBQUssTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRS9FLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUNuQixDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNqRCxDQUFDLEdBQUcsYUFBYSxDQUFDLEdBQUcsR0FBRyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztTQUNsRDtRQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksd0JBQXdCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUM5RSxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztRQUN2QyxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQztRQUN0QyxNQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsYUFBYSxDQUFDO1FBRS9DLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUUzQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQztRQUM1QyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQztRQUMzQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQztRQUN4QyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQztRQUV2QywrRUFBK0U7UUFDL0UsMEVBQTBFO1FBQzFFLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7WUFDeEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUM3QztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEdBQUcsR0FBRyxRQUFRLElBQUksQ0FBQztRQUVsRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTNDLGdGQUFnRjtRQUNoRix5RkFBeUY7UUFDekYseUJBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFbEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO1FBRXBDLHlEQUF5RDtRQUN6RCxNQUFNLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXRELFNBQVMsQ0FBQyxLQUFLLG9CQUF3QixDQUFDO1FBRXhDLDhEQUE4RDtRQUM5RCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVuQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUN0QixJQUFJLENBQUMsMEJBQTBCLEdBQUcsU0FBUyxDQUFDO1NBQzdDO1FBRUQseURBQXlEO1FBQ3pELHFGQUFxRjtRQUNyRixJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxFQUFFO1lBQy9CLE1BQU0sMkJBQTJCLEdBQUcsU0FBUyxLQUFLLElBQUksQ0FBQywwQkFBMEIsQ0FBQztZQUVsRixTQUFTLENBQUMsS0FBSyxrQkFBc0IsQ0FBQztZQUV0QyxpRkFBaUY7WUFDakYsZ0ZBQWdGO1lBQ2hGLDhFQUE4RTtZQUM5RSwwQkFBMEI7WUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLDJCQUEyQixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFO2dCQUNoRixTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDckI7UUFDSCxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFYixPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsb0NBQW9DO0lBQ3BDLGFBQWEsQ0FBQyxTQUFvQjtRQUNoQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV4RCxJQUFJLFNBQVMsS0FBSyxJQUFJLENBQUMsMEJBQTBCLEVBQUU7WUFDakQsSUFBSSxDQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQztTQUN4QztRQUVELGlFQUFpRTtRQUNqRSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUU7WUFDN0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDNUI7UUFFRCxnRkFBZ0Y7UUFDaEYsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLE9BQU87U0FDUjtRQUVELE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDbkMsTUFBTSxlQUFlLG1DQUFPLDRCQUE0QixHQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFekYsUUFBUSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLGVBQWUsQ0FBQyxZQUFZLElBQUksQ0FBQztRQUN4RSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDN0IsU0FBUyxDQUFDLEtBQUsscUJBQXlCLENBQUM7UUFFekMsNEVBQTRFO1FBQzVFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUU7WUFDL0IsU0FBUyxDQUFDLEtBQUssaUJBQXFCLENBQUM7WUFDckMsUUFBUSxDQUFDLFVBQVcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsOENBQThDO0lBQzlDLFVBQVU7UUFDUixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCw2REFBNkQ7SUFDN0QsdUJBQXVCO1FBQ3JCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtnQkFDN0IsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ2xCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsMENBQTBDO0lBQzFDLGtCQUFrQixDQUFDLG1CQUEwRDtRQUMzRSxNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUVuRCxJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ2hELE9BQU87U0FDUjtRQUVELDZFQUE2RTtRQUM3RSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUU1QixJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQztRQUMvQixJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVEOzs7T0FHRztJQUNILFdBQVcsQ0FBQyxLQUFZO1FBQ3RCLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFtQixDQUFDLENBQUM7U0FDeEM7YUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBbUIsQ0FBQyxDQUFDO1NBQ3pDO2FBQU07WUFDTCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDckI7UUFFRCwrREFBK0Q7UUFDL0QsOEVBQThFO1FBQzlFLCtFQUErRTtRQUMvRSxJQUFJLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFO1lBQ3BDLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQztTQUN4QztJQUNILENBQUM7SUFFRCwrRUFBK0U7SUFDdkUsWUFBWSxDQUFDLEtBQWlCO1FBQ3BDLCtFQUErRTtRQUMvRSw2RUFBNkU7UUFDN0UsTUFBTSxlQUFlLEdBQUcsK0JBQStCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0QsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CO1lBQzlDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsd0JBQXdCLENBQUM7UUFFdEUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxJQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDekUsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7WUFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUM1RTtJQUNILENBQUM7SUFFRCwrRUFBK0U7SUFDdkUsYUFBYSxDQUFDLEtBQWlCO1FBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzVFLG9GQUFvRjtZQUNwRixvRkFBb0Y7WUFDcEYsaUNBQWlDO1lBQ2pDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7WUFFM0IsaUVBQWlFO1lBQ2pFLHVFQUF1RTtZQUN2RSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO1lBRXJDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3RGO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsb0VBQW9FO0lBQzVELFlBQVk7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDeEIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7UUFFNUIsNERBQTREO1FBQzVELElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ25DLHlGQUF5RjtZQUN6Riw4RkFBOEY7WUFDOUYsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEtBQUssb0JBQXdCO2dCQUNwRCxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixJQUFJLE1BQU0sQ0FBQyxLQUFLLHNCQUEwQixDQUFDO1lBRS9FLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxTQUFTLEVBQUU7Z0JBQzFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNsQjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDJGQUEyRjtJQUNuRixzQkFBc0IsQ0FBQyxFQUFZLEVBQUUsS0FBSyxHQUFHLENBQUM7UUFDcEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELDREQUE0RDtJQUNwRCxlQUFlLENBQUMsVUFBb0I7UUFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDbEMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUMxQixJQUFJLENBQUMsZUFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFDMUUsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCw4RUFBOEU7SUFDOUUsb0JBQW9CO1FBQ2xCLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN4QixpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDakMsSUFBSSxDQUFDLGVBQWdCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQzdFLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxJQUFJLENBQUMsMEJBQTBCLEVBQUU7Z0JBQ25DLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtvQkFDL0IsSUFBSSxDQUFDLGVBQWdCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO2dCQUM3RSxDQUFDLENBQUMsQ0FBQzthQUNKO1NBQ0Y7SUFDSCxDQUFDO0NBQ0Y7QUFFRCwrRUFBK0U7QUFDL0UsU0FBUyx5QkFBeUIsQ0FBQyxPQUFvQjtJQUNyRCwwRkFBMEY7SUFDMUYsMEZBQTBGO0lBQzFGLDhEQUE4RDtJQUM5RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyx3QkFBd0IsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQWdCO0lBQ3RFLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzFFLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztBQUNsRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0VsZW1lbnRSZWYsIE5nWm9uZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsYXRmb3JtLCBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtpc0Zha2VNb3VzZWRvd25Gcm9tU2NyZWVuUmVhZGVyLCBpc0Zha2VUb3VjaHN0YXJ0RnJvbVNjcmVlblJlYWRlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtjb2VyY2VFbGVtZW50fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtSaXBwbGVSZWYsIFJpcHBsZVN0YXRlLCBSaXBwbGVDb25maWd9IGZyb20gJy4vcmlwcGxlLXJlZic7XG5cbi8qKlxuICogSW50ZXJmYWNlIHRoYXQgZGVzY3JpYmVzIHRoZSB0YXJnZXQgZm9yIGxhdW5jaGluZyByaXBwbGVzLlxuICogSXQgZGVmaW5lcyB0aGUgcmlwcGxlIGNvbmZpZ3VyYXRpb24gYW5kIGRpc2FibGVkIHN0YXRlIGZvciBpbnRlcmFjdGlvbiByaXBwbGVzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJpcHBsZVRhcmdldCB7XG4gIC8qKiBDb25maWd1cmF0aW9uIGZvciByaXBwbGVzIHRoYXQgYXJlIGxhdW5jaGVkIG9uIHBvaW50ZXIgZG93bi4gKi9cbiAgcmlwcGxlQ29uZmlnOiBSaXBwbGVDb25maWc7XG4gIC8qKiBXaGV0aGVyIHJpcHBsZXMgb24gcG9pbnRlciBkb3duIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgcmlwcGxlRGlzYWJsZWQ6IGJvb2xlYW47XG59XG5cblxuLy8gVE9ETzogaW1wb3J0IHRoZXNlIHZhbHVlcyBmcm9tIGBAbWF0ZXJpYWwvcmlwcGxlYCBldmVudHVhbGx5LlxuLyoqXG4gKiBEZWZhdWx0IHJpcHBsZSBhbmltYXRpb24gY29uZmlndXJhdGlvbiBmb3IgcmlwcGxlcyB3aXRob3V0IGFuIGV4cGxpY2l0XG4gKiBhbmltYXRpb24gY29uZmlnIHNwZWNpZmllZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcgPSB7XG4gIGVudGVyRHVyYXRpb246IDIyNSxcbiAgZXhpdER1cmF0aW9uOiAxNTBcbn07XG5cbi8qKlxuICogVGltZW91dCBmb3IgaWdub3JpbmcgbW91c2UgZXZlbnRzLiBNb3VzZSBldmVudHMgd2lsbCBiZSB0ZW1wb3JhcnkgaWdub3JlZCBhZnRlciB0b3VjaFxuICogZXZlbnRzIHRvIGF2b2lkIHN5bnRoZXRpYyBtb3VzZSBldmVudHMuXG4gKi9cbmNvbnN0IGlnbm9yZU1vdXNlRXZlbnRzVGltZW91dCA9IDgwMDtcblxuLyoqIE9wdGlvbnMgdGhhdCBhcHBseSB0byBhbGwgdGhlIGV2ZW50IGxpc3RlbmVycyB0aGF0IGFyZSBib3VuZCBieSB0aGUgcmlwcGxlIHJlbmRlcmVyLiAqL1xuY29uc3QgcGFzc2l2ZUV2ZW50T3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe3Bhc3NpdmU6IHRydWV9KTtcblxuLyoqIEV2ZW50cyB0aGF0IHNpZ25hbCB0aGF0IHRoZSBwb2ludGVyIGlzIGRvd24uICovXG5jb25zdCBwb2ludGVyRG93bkV2ZW50cyA9IFsnbW91c2Vkb3duJywgJ3RvdWNoc3RhcnQnXTtcblxuLyoqIEV2ZW50cyB0aGF0IHNpZ25hbCB0aGF0IHRoZSBwb2ludGVyIGlzIHVwLiAqL1xuY29uc3QgcG9pbnRlclVwRXZlbnRzID0gWydtb3VzZXVwJywgJ21vdXNlbGVhdmUnLCAndG91Y2hlbmQnLCAndG91Y2hjYW5jZWwnXTtcblxuLyoqXG4gKiBIZWxwZXIgc2VydmljZSB0aGF0IHBlcmZvcm1zIERPTSBtYW5pcHVsYXRpb25zLiBOb3QgaW50ZW5kZWQgdG8gYmUgdXNlZCBvdXRzaWRlIHRoaXMgbW9kdWxlLlxuICogVGhlIGNvbnN0cnVjdG9yIHRha2VzIGEgcmVmZXJlbmNlIHRvIHRoZSByaXBwbGUgZGlyZWN0aXZlJ3MgaG9zdCBlbGVtZW50IGFuZCBhIG1hcCBvZiBET01cbiAqIGV2ZW50IGhhbmRsZXJzIHRvIGJlIGluc3RhbGxlZCBvbiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJzIHJpcHBsZSBhbmltYXRpb25zLlxuICogVGhpcyB3aWxsIGV2ZW50dWFsbHkgYmVjb21lIGEgY3VzdG9tIHJlbmRlcmVyIG9uY2UgQW5ndWxhciBzdXBwb3J0IGV4aXN0cy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIFJpcHBsZVJlbmRlcmVyIGltcGxlbWVudHMgRXZlbnRMaXN0ZW5lck9iamVjdCB7XG4gIC8qKiBFbGVtZW50IHdoZXJlIHRoZSByaXBwbGVzIGFyZSBiZWluZyBhZGRlZCB0by4gKi9cbiAgcHJpdmF0ZSBfY29udGFpbmVyRWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIEVsZW1lbnQgd2hpY2ggdHJpZ2dlcnMgdGhlIHJpcHBsZSBlbGVtZW50cyBvbiBtb3VzZSBldmVudHMuICovXG4gIHByaXZhdGUgX3RyaWdnZXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHBvaW50ZXIgaXMgY3VycmVudGx5IGRvd24gb3Igbm90LiAqL1xuICBwcml2YXRlIF9pc1BvaW50ZXJEb3duID0gZmFsc2U7XG5cbiAgLyoqIFNldCBvZiBjdXJyZW50bHkgYWN0aXZlIHJpcHBsZSByZWZlcmVuY2VzLiAqL1xuICBwcml2YXRlIF9hY3RpdmVSaXBwbGVzID0gbmV3IFNldDxSaXBwbGVSZWY+KCk7XG5cbiAgLyoqIExhdGVzdCBub24tcGVyc2lzdGVudCByaXBwbGUgdGhhdCB3YXMgdHJpZ2dlcmVkLiAqL1xuICBwcml2YXRlIF9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlOiBSaXBwbGVSZWYgfCBudWxsO1xuXG4gIC8qKiBUaW1lIGluIG1pbGxpc2Vjb25kcyB3aGVuIHRoZSBsYXN0IHRvdWNoc3RhcnQgZXZlbnQgaGFwcGVuZWQuICovXG4gIHByaXZhdGUgX2xhc3RUb3VjaFN0YXJ0RXZlbnQ6IG51bWJlcjtcblxuICAvKiogV2hldGhlciBwb2ludGVyLXVwIGV2ZW50IGxpc3RlbmVycyBoYXZlIGJlZW4gcmVnaXN0ZXJlZC4gKi9cbiAgcHJpdmF0ZSBfcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBDYWNoZWQgZGltZW5zaW9ucyBvZiB0aGUgcmlwcGxlIGNvbnRhaW5lci4gU2V0IHdoZW4gdGhlIGZpcnN0XG4gICAqIHJpcHBsZSBpcyBzaG93biBhbmQgY2xlYXJlZCBvbmNlIG5vIG1vcmUgcmlwcGxlcyBhcmUgdmlzaWJsZS5cbiAgICovXG4gIHByaXZhdGUgX2NvbnRhaW5lclJlY3Q6IENsaWVudFJlY3QgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3RhcmdldDogUmlwcGxlVGFyZ2V0LFxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgZWxlbWVudE9yRWxlbWVudFJlZjogSFRNTEVsZW1lbnQgfCBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcGxhdGZvcm06IFBsYXRmb3JtKSB7XG5cbiAgICAvLyBPbmx5IGRvIGFueXRoaW5nIGlmIHdlJ3JlIG9uIHRoZSBicm93c2VyLlxuICAgIGlmIChwbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lckVsZW1lbnQgPSBjb2VyY2VFbGVtZW50KGVsZW1lbnRPckVsZW1lbnRSZWYpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGYWRlcyBpbiBhIHJpcHBsZSBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXMuXG4gICAqIEBwYXJhbSB4IENvb3JkaW5hdGUgd2l0aGluIHRoZSBlbGVtZW50LCBhbG9uZyB0aGUgWCBheGlzIGF0IHdoaWNoIHRvIHN0YXJ0IHRoZSByaXBwbGUuXG4gICAqIEBwYXJhbSB5IENvb3JkaW5hdGUgd2l0aGluIHRoZSBlbGVtZW50LCBhbG9uZyB0aGUgWSBheGlzIGF0IHdoaWNoIHRvIHN0YXJ0IHRoZSByaXBwbGUuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgcmlwcGxlIG9wdGlvbnMuXG4gICAqL1xuICBmYWRlSW5SaXBwbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbmZpZzogUmlwcGxlQ29uZmlnID0ge30pOiBSaXBwbGVSZWYge1xuICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSB0aGlzLl9jb250YWluZXJSZWN0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyUmVjdCB8fCB0aGlzLl9jb250YWluZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGFuaW1hdGlvbkNvbmZpZyA9IHsuLi5kZWZhdWx0UmlwcGxlQW5pbWF0aW9uQ29uZmlnLCAuLi5jb25maWcuYW5pbWF0aW9ufTtcblxuICAgIGlmIChjb25maWcuY2VudGVyZWQpIHtcbiAgICAgIHggPSBjb250YWluZXJSZWN0LmxlZnQgKyBjb250YWluZXJSZWN0LndpZHRoIC8gMjtcbiAgICAgIHkgPSBjb250YWluZXJSZWN0LnRvcCArIGNvbnRhaW5lclJlY3QuaGVpZ2h0IC8gMjtcbiAgICB9XG5cbiAgICBjb25zdCByYWRpdXMgPSBjb25maWcucmFkaXVzIHx8IGRpc3RhbmNlVG9GdXJ0aGVzdENvcm5lcih4LCB5LCBjb250YWluZXJSZWN0KTtcbiAgICBjb25zdCBvZmZzZXRYID0geCAtIGNvbnRhaW5lclJlY3QubGVmdDtcbiAgICBjb25zdCBvZmZzZXRZID0geSAtIGNvbnRhaW5lclJlY3QudG9wO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gYW5pbWF0aW9uQ29uZmlnLmVudGVyRHVyYXRpb247XG5cbiAgICBjb25zdCByaXBwbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByaXBwbGUuY2xhc3NMaXN0LmFkZCgnbWF0LXJpcHBsZS1lbGVtZW50Jyk7XG5cbiAgICByaXBwbGUuc3R5bGUubGVmdCA9IGAke29mZnNldFggLSByYWRpdXN9cHhgO1xuICAgIHJpcHBsZS5zdHlsZS50b3AgPSBgJHtvZmZzZXRZIC0gcmFkaXVzfXB4YDtcbiAgICByaXBwbGUuc3R5bGUuaGVpZ2h0ID0gYCR7cmFkaXVzICogMn1weGA7XG4gICAgcmlwcGxlLnN0eWxlLndpZHRoID0gYCR7cmFkaXVzICogMn1weGA7XG5cbiAgICAvLyBJZiBhIGN1c3RvbSBjb2xvciBoYXMgYmVlbiBzcGVjaWZpZWQsIHNldCBpdCBhcyBpbmxpbmUgc3R5bGUuIElmIG5vIGNvbG9yIGlzXG4gICAgLy8gc2V0LCB0aGUgZGVmYXVsdCBjb2xvciB3aWxsIGJlIGFwcGxpZWQgdGhyb3VnaCB0aGUgcmlwcGxlIHRoZW1lIHN0eWxlcy5cbiAgICBpZiAoY29uZmlnLmNvbG9yICE9IG51bGwpIHtcbiAgICAgIHJpcHBsZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb25maWcuY29sb3I7XG4gICAgfVxuXG4gICAgcmlwcGxlLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcblxuICAgIHRoaXMuX2NvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQocmlwcGxlKTtcblxuICAgIC8vIEJ5IGRlZmF1bHQgdGhlIGJyb3dzZXIgZG9lcyBub3QgcmVjYWxjdWxhdGUgdGhlIHN0eWxlcyBvZiBkeW5hbWljYWxseSBjcmVhdGVkXG4gICAgLy8gcmlwcGxlIGVsZW1lbnRzLiBUaGlzIGlzIGNyaXRpY2FsIGJlY2F1c2UgdGhlbiB0aGUgYHNjYWxlYCB3b3VsZCBub3QgYW5pbWF0ZSBwcm9wZXJseS5cbiAgICBlbmZvcmNlU3R5bGVSZWNhbGN1bGF0aW9uKHJpcHBsZSk7XG5cbiAgICByaXBwbGUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDEpJztcblxuICAgIC8vIEV4cG9zZWQgcmVmZXJlbmNlIHRvIHRoZSByaXBwbGUgdGhhdCB3aWxsIGJlIHJldHVybmVkLlxuICAgIGNvbnN0IHJpcHBsZVJlZiA9IG5ldyBSaXBwbGVSZWYodGhpcywgcmlwcGxlLCBjb25maWcpO1xuXG4gICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuRkFESU5HX0lOO1xuXG4gICAgLy8gQWRkIHRoZSByaXBwbGUgcmVmZXJlbmNlIHRvIHRoZSBsaXN0IG9mIGFsbCBhY3RpdmUgcmlwcGxlcy5cbiAgICB0aGlzLl9hY3RpdmVSaXBwbGVzLmFkZChyaXBwbGVSZWYpO1xuXG4gICAgaWYgKCFjb25maWcucGVyc2lzdGVudCkge1xuICAgICAgdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSA9IHJpcHBsZVJlZjtcbiAgICB9XG5cbiAgICAvLyBXYWl0IGZvciB0aGUgcmlwcGxlIGVsZW1lbnQgdG8gYmUgY29tcGxldGVseSBmYWRlZCBpbi5cbiAgICAvLyBPbmNlIGl0J3MgZmFkZWQgaW4sIHRoZSByaXBwbGUgY2FuIGJlIGhpZGRlbiBpbW1lZGlhdGVseSBpZiB0aGUgbW91c2UgaXMgcmVsZWFzZWQuXG4gICAgdGhpcy5fcnVuVGltZW91dE91dHNpZGVab25lKCgpID0+IHtcbiAgICAgIGNvbnN0IGlzTW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSA9IHJpcHBsZVJlZiA9PT0gdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZTtcblxuICAgICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuVklTSUJMRTtcblxuICAgICAgLy8gV2hlbiB0aGUgdGltZXIgcnVucyBvdXQgd2hpbGUgdGhlIHVzZXIgaGFzIGtlcHQgdGhlaXIgcG9pbnRlciBkb3duLCB3ZSB3YW50IHRvXG4gICAgICAvLyBrZWVwIG9ubHkgdGhlIHBlcnNpc3RlbnQgcmlwcGxlcyBhbmQgdGhlIGxhdGVzdCB0cmFuc2llbnQgcmlwcGxlLiBXZSBkbyB0aGlzLFxuICAgICAgLy8gYmVjYXVzZSB3ZSBkb24ndCB3YW50IHN0YWNrZWQgdHJhbnNpZW50IHJpcHBsZXMgdG8gYXBwZWFyIGFmdGVyIHRoZWlyIGVudGVyXG4gICAgICAvLyBhbmltYXRpb24gaGFzIGZpbmlzaGVkLlxuICAgICAgaWYgKCFjb25maWcucGVyc2lzdGVudCAmJiAoIWlzTW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSB8fCAhdGhpcy5faXNQb2ludGVyRG93bikpIHtcbiAgICAgICAgcmlwcGxlUmVmLmZhZGVPdXQoKTtcbiAgICAgIH1cbiAgICB9LCBkdXJhdGlvbik7XG5cbiAgICByZXR1cm4gcmlwcGxlUmVmO1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCBhIHJpcHBsZSByZWZlcmVuY2UuICovXG4gIGZhZGVPdXRSaXBwbGUocmlwcGxlUmVmOiBSaXBwbGVSZWYpIHtcbiAgICBjb25zdCB3YXNBY3RpdmUgPSB0aGlzLl9hY3RpdmVSaXBwbGVzLmRlbGV0ZShyaXBwbGVSZWYpO1xuXG4gICAgaWYgKHJpcHBsZVJlZiA9PT0gdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSkge1xuICAgICAgdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ2xlYXIgb3V0IHRoZSBjYWNoZWQgYm91bmRpbmcgcmVjdCBpZiB3ZSBoYXZlIG5vIG1vcmUgcmlwcGxlcy5cbiAgICBpZiAoIXRoaXMuX2FjdGl2ZVJpcHBsZXMuc2l6ZSkge1xuICAgICAgdGhpcy5fY29udGFpbmVyUmVjdCA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gRm9yIHJpcHBsZXMgdGhhdCBhcmUgbm90IGFjdGl2ZSBhbnltb3JlLCBkb24ndCByZS1ydW4gdGhlIGZhZGUtb3V0IGFuaW1hdGlvbi5cbiAgICBpZiAoIXdhc0FjdGl2ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJpcHBsZUVsID0gcmlwcGxlUmVmLmVsZW1lbnQ7XG4gICAgY29uc3QgYW5pbWF0aW9uQ29uZmlnID0gey4uLmRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcsIC4uLnJpcHBsZVJlZi5jb25maWcuYW5pbWF0aW9ufTtcblxuICAgIHJpcHBsZUVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2FuaW1hdGlvbkNvbmZpZy5leGl0RHVyYXRpb259bXNgO1xuICAgIHJpcHBsZUVsLnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuRkFESU5HX09VVDtcblxuICAgIC8vIE9uY2UgdGhlIHJpcHBsZSBmYWRlZCBvdXQsIHRoZSByaXBwbGUgY2FuIGJlIHNhZmVseSByZW1vdmVkIGZyb20gdGhlIERPTS5cbiAgICB0aGlzLl9ydW5UaW1lb3V0T3V0c2lkZVpvbmUoKCkgPT4ge1xuICAgICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuSElEREVOO1xuICAgICAgcmlwcGxlRWwucGFyZW50Tm9kZSEucmVtb3ZlQ2hpbGQocmlwcGxlRWwpO1xuICAgIH0sIGFuaW1hdGlvbkNvbmZpZy5leGl0RHVyYXRpb24pO1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCBhbGwgY3VycmVudGx5IGFjdGl2ZSByaXBwbGVzLiAqL1xuICBmYWRlT3V0QWxsKCkge1xuICAgIHRoaXMuX2FjdGl2ZVJpcHBsZXMuZm9yRWFjaChyaXBwbGUgPT4gcmlwcGxlLmZhZGVPdXQoKSk7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGFsbCBjdXJyZW50bHkgYWN0aXZlIG5vbi1wZXJzaXN0ZW50IHJpcHBsZXMuICovXG4gIGZhZGVPdXRBbGxOb25QZXJzaXN0ZW50KCkge1xuICAgIHRoaXMuX2FjdGl2ZVJpcHBsZXMuZm9yRWFjaChyaXBwbGUgPT4ge1xuICAgICAgaWYgKCFyaXBwbGUuY29uZmlnLnBlcnNpc3RlbnQpIHtcbiAgICAgICAgcmlwcGxlLmZhZGVPdXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSB0cmlnZ2VyIGV2ZW50IGxpc3RlbmVycyAqL1xuICBzZXR1cFRyaWdnZXJFdmVudHMoZWxlbWVudE9yRWxlbWVudFJlZjogSFRNTEVsZW1lbnQgfCBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjb2VyY2VFbGVtZW50KGVsZW1lbnRPckVsZW1lbnRSZWYpO1xuXG4gICAgaWYgKCFlbGVtZW50IHx8IGVsZW1lbnQgPT09IHRoaXMuX3RyaWdnZXJFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGFsbCBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHRyaWdnZXIgZWxlbWVudC5cbiAgICB0aGlzLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG5cbiAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMocG9pbnRlckRvd25FdmVudHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYWxsIHJlZ2lzdGVyZWQgZXZlbnRzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBoYW5kbGVFdmVudChldmVudDogRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicpIHtcbiAgICAgIHRoaXMuX29uTW91c2Vkb3duKGV2ZW50IGFzIE1vdXNlRXZlbnQpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG4gICAgICB0aGlzLl9vblRvdWNoU3RhcnQoZXZlbnQgYXMgVG91Y2hFdmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX29uUG9pbnRlclVwKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgcG9pbnRlci11cCBldmVudHMgaGF2ZW4ndCBiZWVuIHJlZ2lzdGVyZWQgeWV0LCBkbyBzbyBub3cuXG4gICAgLy8gV2UgZG8gdGhpcyBvbi1kZW1hbmQgaW4gb3JkZXIgdG8gcmVkdWNlIHRoZSB0b3RhbCBudW1iZXIgb2YgZXZlbnQgbGlzdGVuZXJzXG4gICAgLy8gcmVnaXN0ZXJlZCBieSB0aGUgcmlwcGxlcywgd2hpY2ggc3BlZWRzIHVwIHRoZSByZW5kZXJpbmcgdGltZSBmb3IgbGFyZ2UgVUlzLlxuICAgIGlmICghdGhpcy5fcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCkge1xuICAgICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMocG9pbnRlclVwRXZlbnRzKTtcbiAgICAgIHRoaXMuX3BvaW50ZXJVcEV2ZW50c1JlZ2lzdGVyZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBGdW5jdGlvbiBiZWluZyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHRyaWdnZXIgaXMgYmVpbmcgcHJlc3NlZCB1c2luZyBtb3VzZS4gKi9cbiAgcHJpdmF0ZSBfb25Nb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAvLyBTY3JlZW4gcmVhZGVycyB3aWxsIGZpcmUgZmFrZSBtb3VzZSBldmVudHMgZm9yIHNwYWNlL2VudGVyLiBTa2lwIGxhdW5jaGluZyBhXG4gICAgLy8gcmlwcGxlIGluIHRoaXMgY2FzZSBmb3IgY29uc2lzdGVuY3kgd2l0aCB0aGUgbm9uLXNjcmVlbi1yZWFkZXIgZXhwZXJpZW5jZS5cbiAgICBjb25zdCBpc0Zha2VNb3VzZWRvd24gPSBpc0Zha2VNb3VzZWRvd25Gcm9tU2NyZWVuUmVhZGVyKGV2ZW50KTtcbiAgICBjb25zdCBpc1N5bnRoZXRpY0V2ZW50ID0gdGhpcy5fbGFzdFRvdWNoU3RhcnRFdmVudCAmJlxuICAgICAgICBEYXRlLm5vdygpIDwgdGhpcy5fbGFzdFRvdWNoU3RhcnRFdmVudCArIGlnbm9yZU1vdXNlRXZlbnRzVGltZW91dDtcblxuICAgIGlmICghdGhpcy5fdGFyZ2V0LnJpcHBsZURpc2FibGVkICYmICFpc0Zha2VNb3VzZWRvd24gJiYgIWlzU3ludGhldGljRXZlbnQpIHtcbiAgICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSB0cnVlO1xuICAgICAgdGhpcy5mYWRlSW5SaXBwbGUoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSwgdGhpcy5fdGFyZ2V0LnJpcHBsZUNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZ1bmN0aW9uIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgdHJpZ2dlciBpcyBiZWluZyBwcmVzc2VkIHVzaW5nIHRvdWNoLiAqL1xuICBwcml2YXRlIF9vblRvdWNoU3RhcnQoZXZlbnQ6IFRvdWNoRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuX3RhcmdldC5yaXBwbGVEaXNhYmxlZCAmJiAhaXNGYWtlVG91Y2hzdGFydEZyb21TY3JlZW5SZWFkZXIoZXZlbnQpKSB7XG4gICAgICAvLyBTb21lIGJyb3dzZXJzIGZpcmUgbW91c2UgZXZlbnRzIGFmdGVyIGEgYHRvdWNoc3RhcnRgIGV2ZW50LiBUaG9zZSBzeW50aGV0aWMgbW91c2VcbiAgICAgIC8vIGV2ZW50cyB3aWxsIGxhdW5jaCBhIHNlY29uZCByaXBwbGUgaWYgd2UgZG9uJ3QgaWdub3JlIG1vdXNlIGV2ZW50cyBmb3IgYSBzcGVjaWZpY1xuICAgICAgLy8gdGltZSBhZnRlciBhIHRvdWNoc3RhcnQgZXZlbnQuXG4gICAgICB0aGlzLl9sYXN0VG91Y2hTdGFydEV2ZW50ID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSB0cnVlO1xuXG4gICAgICAvLyBVc2UgYGNoYW5nZWRUb3VjaGVzYCBzbyB3ZSBza2lwIGFueSB0b3VjaGVzIHdoZXJlIHRoZSB1c2VyIHB1dFxuICAgICAgLy8gdGhlaXIgZmluZ2VyIGRvd24sIGJ1dCB1c2VkIGFub3RoZXIgZmluZ2VyIHRvIHRhcCB0aGUgZWxlbWVudCBhZ2Fpbi5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcztcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZmFkZUluUmlwcGxlKHRvdWNoZXNbaV0uY2xpZW50WCwgdG91Y2hlc1tpXS5jbGllbnRZLCB0aGlzLl90YXJnZXQucmlwcGxlQ29uZmlnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogRnVuY3Rpb24gYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB0cmlnZ2VyIGlzIGJlaW5nIHJlbGVhc2VkLiAqL1xuICBwcml2YXRlIF9vblBvaW50ZXJVcCgpIHtcbiAgICBpZiAoIXRoaXMuX2lzUG9pbnRlckRvd24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1BvaW50ZXJEb3duID0gZmFsc2U7XG5cbiAgICAvLyBGYWRlLW91dCBhbGwgcmlwcGxlcyB0aGF0IGFyZSB2aXNpYmxlIGFuZCBub3QgcGVyc2lzdGVudC5cbiAgICB0aGlzLl9hY3RpdmVSaXBwbGVzLmZvckVhY2gocmlwcGxlID0+IHtcbiAgICAgIC8vIEJ5IGRlZmF1bHQsIG9ubHkgcmlwcGxlcyB0aGF0IGFyZSBjb21wbGV0ZWx5IHZpc2libGUgd2lsbCBmYWRlIG91dCBvbiBwb2ludGVyIHJlbGVhc2UuXG4gICAgICAvLyBJZiB0aGUgYHRlcm1pbmF0ZU9uUG9pbnRlclVwYCBvcHRpb24gaXMgc2V0LCByaXBwbGVzIHRoYXQgc3RpbGwgZmFkZSBpbiB3aWxsIGFsc28gZmFkZSBvdXQuXG4gICAgICBjb25zdCBpc1Zpc2libGUgPSByaXBwbGUuc3RhdGUgPT09IFJpcHBsZVN0YXRlLlZJU0lCTEUgfHxcbiAgICAgICAgcmlwcGxlLmNvbmZpZy50ZXJtaW5hdGVPblBvaW50ZXJVcCAmJiByaXBwbGUuc3RhdGUgPT09IFJpcHBsZVN0YXRlLkZBRElOR19JTjtcblxuICAgICAgaWYgKCFyaXBwbGUuY29uZmlnLnBlcnNpc3RlbnQgJiYgaXNWaXNpYmxlKSB7XG4gICAgICAgIHJpcHBsZS5mYWRlT3V0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogUnVucyBhIHRpbWVvdXQgb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lIHRvIGF2b2lkIHRyaWdnZXJpbmcgdGhlIGNoYW5nZSBkZXRlY3Rpb24uICovXG4gIHByaXZhdGUgX3J1blRpbWVvdXRPdXRzaWRlWm9uZShmbjogRnVuY3Rpb24sIGRlbGF5ID0gMCkge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiBzZXRUaW1lb3V0KGZuLCBkZWxheSkpO1xuICB9XG5cbiAgLyoqIFJlZ2lzdGVycyBldmVudCBsaXN0ZW5lcnMgZm9yIGEgZ2l2ZW4gbGlzdCBvZiBldmVudHMuICovXG4gIHByaXZhdGUgX3JlZ2lzdGVyRXZlbnRzKGV2ZW50VHlwZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGV2ZW50VHlwZXMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCEuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzLCBwYXNzaXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgcHJldmlvdXNseSByZWdpc3RlcmVkIGV2ZW50IGxpc3RlbmVycyBmcm9tIHRoZSB0cmlnZ2VyIGVsZW1lbnQuICovXG4gIF9yZW1vdmVUcmlnZ2VyRXZlbnRzKCkge1xuICAgIGlmICh0aGlzLl90cmlnZ2VyRWxlbWVudCkge1xuICAgICAgcG9pbnRlckRvd25FdmVudHMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCEucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzLCBwYXNzaXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5fcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCkge1xuICAgICAgICBwb2ludGVyVXBFdmVudHMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICAgIHRoaXMuX3RyaWdnZXJFbGVtZW50IS5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIHRoaXMsIHBhc3NpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqIEVuZm9yY2VzIGEgc3R5bGUgcmVjYWxjdWxhdGlvbiBvZiBhIERPTSBlbGVtZW50IGJ5IGNvbXB1dGluZyBpdHMgc3R5bGVzLiAqL1xuZnVuY3Rpb24gZW5mb3JjZVN0eWxlUmVjYWxjdWxhdGlvbihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAvLyBFbmZvcmNlIGEgc3R5bGUgcmVjYWxjdWxhdGlvbiBieSBjYWxsaW5nIGBnZXRDb21wdXRlZFN0eWxlYCBhbmQgYWNjZXNzaW5nIGFueSBwcm9wZXJ0eS5cbiAgLy8gQ2FsbGluZyBgZ2V0UHJvcGVydHlWYWx1ZWAgaXMgaW1wb3J0YW50IHRvIGxldCBvcHRpbWl6ZXJzIGtub3cgdGhhdCB0aGlzIGlzIG5vdCBhIG5vb3AuXG4gIC8vIFNlZTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzVkNTJmYjA4MWIzNTcwYzgxZTNhXG4gIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ29wYWNpdHknKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBwb2ludCAoeCwgeSkgdG8gdGhlIGZ1cnRoZXN0IGNvcm5lciBvZiBhIHJlY3RhbmdsZS5cbiAqL1xuZnVuY3Rpb24gZGlzdGFuY2VUb0Z1cnRoZXN0Q29ybmVyKHg6IG51bWJlciwgeTogbnVtYmVyLCByZWN0OiBDbGllbnRSZWN0KSB7XG4gIGNvbnN0IGRpc3RYID0gTWF0aC5tYXgoTWF0aC5hYnMoeCAtIHJlY3QubGVmdCksIE1hdGguYWJzKHggLSByZWN0LnJpZ2h0KSk7XG4gIGNvbnN0IGRpc3RZID0gTWF0aC5tYXgoTWF0aC5hYnMoeSAtIHJlY3QudG9wKSwgTWF0aC5hYnMoeSAtIHJlY3QuYm90dG9tKSk7XG4gIHJldHVybiBNYXRoLnNxcnQoZGlzdFggKiBkaXN0WCArIGRpc3RZICogZGlzdFkpO1xufVxuIl19