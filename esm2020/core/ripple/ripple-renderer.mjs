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
        // We use a 3d transform here in order to avoid an issue in Safari where
        // the ripples aren't clipped when inside the shadow DOM (see #24028).
        ripple.style.transform = 'scale3d(1, 1, 1)';
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
        const animationConfig = { ...defaultRippleAnimationConfig, ...rippleRef.config.animation };
        rippleEl.style.transitionDuration = `${animationConfig.exitDuration}ms`;
        rippleEl.style.opacity = '0';
        rippleRef.state = 2 /* FADING_OUT */;
        // Once the ripple faded out, the ripple can be safely removed from the DOM.
        this._runTimeoutOutsideZone(() => {
            rippleRef.state = 3 /* HIDDEN */;
            rippleEl.remove();
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
                (ripple.config.terminateOnPointerUp && ripple.state === 0 /* FADING_IN */);
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
            eventTypes.forEach(type => {
                this._triggerElement.addEventListener(type, this, passiveEventOptions);
            });
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS1yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxPQUFPLEVBQVcsK0JBQStCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNoRixPQUFPLEVBQUMsK0JBQStCLEVBQUUsZ0NBQWdDLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDcEQsT0FBTyxFQUFDLFNBQVMsRUFBNEIsTUFBTSxjQUFjLENBQUM7QUFjbEUsZ0VBQWdFO0FBQ2hFOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFHO0lBQzFDLGFBQWEsRUFBRSxHQUFHO0lBQ2xCLFlBQVksRUFBRSxHQUFHO0NBQ2xCLENBQUM7QUFFRjs7O0dBR0c7QUFDSCxNQUFNLHdCQUF3QixHQUFHLEdBQUcsQ0FBQztBQUVyQywyRkFBMkY7QUFDM0YsTUFBTSxtQkFBbUIsR0FBRywrQkFBK0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBRTdFLG1EQUFtRDtBQUNuRCxNQUFNLGlCQUFpQixHQUFHLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRXRELGlEQUFpRDtBQUNqRCxNQUFNLGVBQWUsR0FBRyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBRTdFOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBNEJ6QixZQUNVLE9BQXFCLEVBQ3JCLE9BQWUsRUFDdkIsbUJBQTBELEVBQzFELFFBQWtCO1FBSFYsWUFBTyxHQUFQLE9BQU8sQ0FBYztRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBdkJ6QixvREFBb0Q7UUFDNUMsbUJBQWMs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QUErRTtBQUMvRSxTQUFTLHlCQUF5QixDQUFDLE9BQW9CO0lBQ3JELDBGQUEwRjtJQUMxRiwwRkFBMEY7SUFDMUYsOERBQThEO0lBQzlELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLHdCQUF3QixDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsSUFBZ0I7SUFDdEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDMUUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDMUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQ2xELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudFJlZiwgTmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGxhdGZvcm0sIG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge2lzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXIsIGlzRmFrZVRvdWNoc3RhcnRGcm9tU2NyZWVuUmVhZGVyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge2NvZXJjZUVsZW1lbnR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1JpcHBsZVJlZiwgUmlwcGxlU3RhdGUsIFJpcHBsZUNvbmZpZ30gZnJvbSAnLi9yaXBwbGUtcmVmJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgdGhhdCBkZXNjcmliZXMgdGhlIHRhcmdldCBmb3IgbGF1bmNoaW5nIHJpcHBsZXMuXG4gKiBJdCBkZWZpbmVzIHRoZSByaXBwbGUgY29uZmlndXJhdGlvbiBhbmQgZGlzYWJsZWQgc3RhdGUgZm9yIGludGVyYWN0aW9uIHJpcHBsZXMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmlwcGxlVGFyZ2V0IHtcbiAgLyoqIENvbmZpZ3VyYXRpb24gZm9yIHJpcHBsZXMgdGhhdCBhcmUgbGF1bmNoZWQgb24gcG9pbnRlciBkb3duLiAqL1xuICByaXBwbGVDb25maWc6IFJpcHBsZUNvbmZpZztcbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBvbiBwb2ludGVyIGRvd24gc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICByaXBwbGVEaXNhYmxlZDogYm9vbGVhbjtcbn1cblxuLy8gVE9ETzogaW1wb3J0IHRoZXNlIHZhbHVlcyBmcm9tIGBAbWF0ZXJpYWwvcmlwcGxlYCBldmVudHVhbGx5LlxuLyoqXG4gKiBEZWZhdWx0IHJpcHBsZSBhbmltYXRpb24gY29uZmlndXJhdGlvbiBmb3IgcmlwcGxlcyB3aXRob3V0IGFuIGV4cGxpY2l0XG4gKiBhbmltYXRpb24gY29uZmlnIHNwZWNpZmllZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcgPSB7XG4gIGVudGVyRHVyYXRpb246IDIyNSxcbiAgZXhpdER1cmF0aW9uOiAxNTAsXG59O1xuXG4vKipcbiAqIFRpbWVvdXQgZm9yIGlnbm9yaW5nIG1vdXNlIGV2ZW50cy4gTW91c2UgZXZlbnRzIHdpbGwgYmUgdGVtcG9yYXJ5IGlnbm9yZWQgYWZ0ZXIgdG91Y2hcbiAqIGV2ZW50cyB0byBhdm9pZCBzeW50aGV0aWMgbW91c2UgZXZlbnRzLlxuICovXG5jb25zdCBpZ25vcmVNb3VzZUV2ZW50c1RpbWVvdXQgPSA4MDA7XG5cbi8qKiBPcHRpb25zIHRoYXQgYXBwbHkgdG8gYWxsIHRoZSBldmVudCBsaXN0ZW5lcnMgdGhhdCBhcmUgYm91bmQgYnkgdGhlIHJpcHBsZSByZW5kZXJlci4gKi9cbmNvbnN0IHBhc3NpdmVFdmVudE9wdGlvbnMgPSBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHtwYXNzaXZlOiB0cnVlfSk7XG5cbi8qKiBFdmVudHMgdGhhdCBzaWduYWwgdGhhdCB0aGUgcG9pbnRlciBpcyBkb3duLiAqL1xuY29uc3QgcG9pbnRlckRvd25FdmVudHMgPSBbJ21vdXNlZG93bicsICd0b3VjaHN0YXJ0J107XG5cbi8qKiBFdmVudHMgdGhhdCBzaWduYWwgdGhhdCB0aGUgcG9pbnRlciBpcyB1cC4gKi9cbmNvbnN0IHBvaW50ZXJVcEV2ZW50cyA9IFsnbW91c2V1cCcsICdtb3VzZWxlYXZlJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJ107XG5cbi8qKlxuICogSGVscGVyIHNlcnZpY2UgdGhhdCBwZXJmb3JtcyBET00gbWFuaXB1bGF0aW9ucy4gTm90IGludGVuZGVkIHRvIGJlIHVzZWQgb3V0c2lkZSB0aGlzIG1vZHVsZS5cbiAqIFRoZSBjb25zdHJ1Y3RvciB0YWtlcyBhIHJlZmVyZW5jZSB0byB0aGUgcmlwcGxlIGRpcmVjdGl2ZSdzIGhvc3QgZWxlbWVudCBhbmQgYSBtYXAgb2YgRE9NXG4gKiBldmVudCBoYW5kbGVycyB0byBiZSBpbnN0YWxsZWQgb24gdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VycyByaXBwbGUgYW5pbWF0aW9ucy5cbiAqIFRoaXMgd2lsbCBldmVudHVhbGx5IGJlY29tZSBhIGN1c3RvbSByZW5kZXJlciBvbmNlIEFuZ3VsYXIgc3VwcG9ydCBleGlzdHMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBSaXBwbGVSZW5kZXJlciBpbXBsZW1lbnRzIEV2ZW50TGlzdGVuZXJPYmplY3Qge1xuICAvKiogRWxlbWVudCB3aGVyZSB0aGUgcmlwcGxlcyBhcmUgYmVpbmcgYWRkZWQgdG8uICovXG4gIHByaXZhdGUgX2NvbnRhaW5lckVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBFbGVtZW50IHdoaWNoIHRyaWdnZXJzIHRoZSByaXBwbGUgZWxlbWVudHMgb24gbW91c2UgZXZlbnRzLiAqL1xuICBwcml2YXRlIF90cmlnZ2VyRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBwb2ludGVyIGlzIGN1cnJlbnRseSBkb3duIG9yIG5vdC4gKi9cbiAgcHJpdmF0ZSBfaXNQb2ludGVyRG93biA9IGZhbHNlO1xuXG4gIC8qKiBTZXQgb2YgY3VycmVudGx5IGFjdGl2ZSByaXBwbGUgcmVmZXJlbmNlcy4gKi9cbiAgcHJpdmF0ZSBfYWN0aXZlUmlwcGxlcyA9IG5ldyBTZXQ8UmlwcGxlUmVmPigpO1xuXG4gIC8qKiBMYXRlc3Qgbm9uLXBlcnNpc3RlbnQgcmlwcGxlIHRoYXQgd2FzIHRyaWdnZXJlZC4gKi9cbiAgcHJpdmF0ZSBfbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZTogUmlwcGxlUmVmIHwgbnVsbDtcblxuICAvKiogVGltZSBpbiBtaWxsaXNlY29uZHMgd2hlbiB0aGUgbGFzdCB0b3VjaHN0YXJ0IGV2ZW50IGhhcHBlbmVkLiAqL1xuICBwcml2YXRlIF9sYXN0VG91Y2hTdGFydEV2ZW50OiBudW1iZXI7XG5cbiAgLyoqIFdoZXRoZXIgcG9pbnRlci11cCBldmVudCBsaXN0ZW5lcnMgaGF2ZSBiZWVuIHJlZ2lzdGVyZWQuICovXG4gIHByaXZhdGUgX3BvaW50ZXJVcEV2ZW50c1JlZ2lzdGVyZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogQ2FjaGVkIGRpbWVuc2lvbnMgb2YgdGhlIHJpcHBsZSBjb250YWluZXIuIFNldCB3aGVuIHRoZSBmaXJzdFxuICAgKiByaXBwbGUgaXMgc2hvd24gYW5kIGNsZWFyZWQgb25jZSBubyBtb3JlIHJpcHBsZXMgYXJlIHZpc2libGUuXG4gICAqL1xuICBwcml2YXRlIF9jb250YWluZXJSZWN0OiBDbGllbnRSZWN0IHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF90YXJnZXQ6IFJpcHBsZVRhcmdldCxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBlbGVtZW50T3JFbGVtZW50UmVmOiBIVE1MRWxlbWVudCB8IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgKSB7XG4gICAgLy8gT25seSBkbyBhbnl0aGluZyBpZiB3ZSdyZSBvbiB0aGUgYnJvd3Nlci5cbiAgICBpZiAocGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb250YWluZXJFbGVtZW50ID0gY29lcmNlRWxlbWVudChlbGVtZW50T3JFbGVtZW50UmVmKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmFkZXMgaW4gYSByaXBwbGUgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzLlxuICAgKiBAcGFyYW0geCBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFggYXhpcyBhdCB3aGljaCB0byBzdGFydCB0aGUgcmlwcGxlLlxuICAgKiBAcGFyYW0geSBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFkgYXhpcyBhdCB3aGljaCB0byBzdGFydCB0aGUgcmlwcGxlLlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIHJpcHBsZSBvcHRpb25zLlxuICAgKi9cbiAgZmFkZUluUmlwcGxlKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25maWc6IFJpcHBsZUNvbmZpZyA9IHt9KTogUmlwcGxlUmVmIHtcbiAgICBjb25zdCBjb250YWluZXJSZWN0ID0gKHRoaXMuX2NvbnRhaW5lclJlY3QgPVxuICAgICAgdGhpcy5fY29udGFpbmVyUmVjdCB8fCB0aGlzLl9jb250YWluZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICBjb25zdCBhbmltYXRpb25Db25maWcgPSB7Li4uZGVmYXVsdFJpcHBsZUFuaW1hdGlvbkNvbmZpZywgLi4uY29uZmlnLmFuaW1hdGlvbn07XG5cbiAgICBpZiAoY29uZmlnLmNlbnRlcmVkKSB7XG4gICAgICB4ID0gY29udGFpbmVyUmVjdC5sZWZ0ICsgY29udGFpbmVyUmVjdC53aWR0aCAvIDI7XG4gICAgICB5ID0gY29udGFpbmVyUmVjdC50b3AgKyBjb250YWluZXJSZWN0LmhlaWdodCAvIDI7XG4gICAgfVxuXG4gICAgY29uc3QgcmFkaXVzID0gY29uZmlnLnJhZGl1cyB8fCBkaXN0YW5jZVRvRnVydGhlc3RDb3JuZXIoeCwgeSwgY29udGFpbmVyUmVjdCk7XG4gICAgY29uc3Qgb2Zmc2V0WCA9IHggLSBjb250YWluZXJSZWN0LmxlZnQ7XG4gICAgY29uc3Qgb2Zmc2V0WSA9IHkgLSBjb250YWluZXJSZWN0LnRvcDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IGFuaW1hdGlvbkNvbmZpZy5lbnRlckR1cmF0aW9uO1xuXG4gICAgY29uc3QgcmlwcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcmlwcGxlLmNsYXNzTGlzdC5hZGQoJ21hdC1yaXBwbGUtZWxlbWVudCcpO1xuXG4gICAgcmlwcGxlLnN0eWxlLmxlZnQgPSBgJHtvZmZzZXRYIC0gcmFkaXVzfXB4YDtcbiAgICByaXBwbGUuc3R5bGUudG9wID0gYCR7b2Zmc2V0WSAtIHJhZGl1c31weGA7XG4gICAgcmlwcGxlLnN0eWxlLmhlaWdodCA9IGAke3JhZGl1cyAqIDJ9cHhgO1xuICAgIHJpcHBsZS5zdHlsZS53aWR0aCA9IGAke3JhZGl1cyAqIDJ9cHhgO1xuXG4gICAgLy8gSWYgYSBjdXN0b20gY29sb3IgaGFzIGJlZW4gc3BlY2lmaWVkLCBzZXQgaXQgYXMgaW5saW5lIHN0eWxlLiBJZiBubyBjb2xvciBpc1xuICAgIC8vIHNldCwgdGhlIGRlZmF1bHQgY29sb3Igd2lsbCBiZSBhcHBsaWVkIHRocm91Z2ggdGhlIHJpcHBsZSB0aGVtZSBzdHlsZXMuXG4gICAgaWYgKGNvbmZpZy5jb2xvciAhPSBudWxsKSB7XG4gICAgICByaXBwbGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29uZmlnLmNvbG9yO1xuICAgIH1cblxuICAgIHJpcHBsZS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG5cbiAgICB0aGlzLl9jb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKHJpcHBsZSk7XG5cbiAgICAvLyBCeSBkZWZhdWx0IHRoZSBicm93c2VyIGRvZXMgbm90IHJlY2FsY3VsYXRlIHRoZSBzdHlsZXMgb2YgZHluYW1pY2FsbHkgY3JlYXRlZFxuICAgIC8vIHJpcHBsZSBlbGVtZW50cy4gVGhpcyBpcyBjcml0aWNhbCBiZWNhdXNlIHRoZW4gdGhlIGBzY2FsZWAgd291bGQgbm90IGFuaW1hdGUgcHJvcGVybHkuXG4gICAgZW5mb3JjZVN0eWxlUmVjYWxjdWxhdGlvbihyaXBwbGUpO1xuXG4gICAgLy8gV2UgdXNlIGEgM2QgdHJhbnNmb3JtIGhlcmUgaW4gb3JkZXIgdG8gYXZvaWQgYW4gaXNzdWUgaW4gU2FmYXJpIHdoZXJlXG4gICAgLy8gdGhlIHJpcHBsZXMgYXJlbid0IGNsaXBwZWQgd2hlbiBpbnNpZGUgdGhlIHNoYWRvdyBET00gKHNlZSAjMjQwMjgpLlxuICAgIHJpcHBsZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUzZCgxLCAxLCAxKSc7XG5cbiAgICAvLyBFeHBvc2VkIHJlZmVyZW5jZSB0byB0aGUgcmlwcGxlIHRoYXQgd2lsbCBiZSByZXR1cm5lZC5cbiAgICBjb25zdCByaXBwbGVSZWYgPSBuZXcgUmlwcGxlUmVmKHRoaXMsIHJpcHBsZSwgY29uZmlnKTtcblxuICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLkZBRElOR19JTjtcblxuICAgIC8vIEFkZCB0aGUgcmlwcGxlIHJlZmVyZW5jZSB0byB0aGUgbGlzdCBvZiBhbGwgYWN0aXZlIHJpcHBsZXMuXG4gICAgdGhpcy5fYWN0aXZlUmlwcGxlcy5hZGQocmlwcGxlUmVmKTtcblxuICAgIGlmICghY29uZmlnLnBlcnNpc3RlbnQpIHtcbiAgICAgIHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgPSByaXBwbGVSZWY7XG4gICAgfVxuXG4gICAgLy8gV2FpdCBmb3IgdGhlIHJpcHBsZSBlbGVtZW50IHRvIGJlIGNvbXBsZXRlbHkgZmFkZWQgaW4uXG4gICAgLy8gT25jZSBpdCdzIGZhZGVkIGluLCB0aGUgcmlwcGxlIGNhbiBiZSBoaWRkZW4gaW1tZWRpYXRlbHkgaWYgdGhlIG1vdXNlIGlzIHJlbGVhc2VkLlxuICAgIHRoaXMuX3J1blRpbWVvdXRPdXRzaWRlWm9uZSgoKSA9PiB7XG4gICAgICBjb25zdCBpc01vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgPSByaXBwbGVSZWYgPT09IHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGU7XG5cbiAgICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLlZJU0lCTEU7XG5cbiAgICAgIC8vIFdoZW4gdGhlIHRpbWVyIHJ1bnMgb3V0IHdoaWxlIHRoZSB1c2VyIGhhcyBrZXB0IHRoZWlyIHBvaW50ZXIgZG93biwgd2Ugd2FudCB0b1xuICAgICAgLy8ga2VlcCBvbmx5IHRoZSBwZXJzaXN0ZW50IHJpcHBsZXMgYW5kIHRoZSBsYXRlc3QgdHJhbnNpZW50IHJpcHBsZS4gV2UgZG8gdGhpcyxcbiAgICAgIC8vIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCBzdGFja2VkIHRyYW5zaWVudCByaXBwbGVzIHRvIGFwcGVhciBhZnRlciB0aGVpciBlbnRlclxuICAgICAgLy8gYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC5cbiAgICAgIGlmICghY29uZmlnLnBlcnNpc3RlbnQgJiYgKCFpc01vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgfHwgIXRoaXMuX2lzUG9pbnRlckRvd24pKSB7XG4gICAgICAgIHJpcHBsZVJlZi5mYWRlT3V0KCk7XG4gICAgICB9XG4gICAgfSwgZHVyYXRpb24pO1xuXG4gICAgcmV0dXJuIHJpcHBsZVJlZjtcbiAgfVxuXG4gIC8qKiBGYWRlcyBvdXQgYSByaXBwbGUgcmVmZXJlbmNlLiAqL1xuICBmYWRlT3V0UmlwcGxlKHJpcHBsZVJlZjogUmlwcGxlUmVmKSB7XG4gICAgY29uc3Qgd2FzQWN0aXZlID0gdGhpcy5fYWN0aXZlUmlwcGxlcy5kZWxldGUocmlwcGxlUmVmKTtcblxuICAgIGlmIChyaXBwbGVSZWYgPT09IHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUpIHtcbiAgICAgIHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIENsZWFyIG91dCB0aGUgY2FjaGVkIGJvdW5kaW5nIHJlY3QgaWYgd2UgaGF2ZSBubyBtb3JlIHJpcHBsZXMuXG4gICAgaWYgKCF0aGlzLl9hY3RpdmVSaXBwbGVzLnNpemUpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lclJlY3QgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIEZvciByaXBwbGVzIHRoYXQgYXJlIG5vdCBhY3RpdmUgYW55bW9yZSwgZG9uJ3QgcmUtcnVuIHRoZSBmYWRlLW91dCBhbmltYXRpb24uXG4gICAgaWYgKCF3YXNBY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByaXBwbGVFbCA9IHJpcHBsZVJlZi5lbGVtZW50O1xuICAgIGNvbnN0IGFuaW1hdGlvbkNvbmZpZyA9IHsuLi5kZWZhdWx0UmlwcGxlQW5pbWF0aW9uQ29uZmlnLCAuLi5yaXBwbGVSZWYuY29uZmlnLmFuaW1hdGlvbn07XG5cbiAgICByaXBwbGVFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHthbmltYXRpb25Db25maWcuZXhpdER1cmF0aW9ufW1zYDtcbiAgICByaXBwbGVFbC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLkZBRElOR19PVVQ7XG5cbiAgICAvLyBPbmNlIHRoZSByaXBwbGUgZmFkZWQgb3V0LCB0aGUgcmlwcGxlIGNhbiBiZSBzYWZlbHkgcmVtb3ZlZCBmcm9tIHRoZSBET00uXG4gICAgdGhpcy5fcnVuVGltZW91dE91dHNpZGVab25lKCgpID0+IHtcbiAgICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLkhJRERFTjtcbiAgICAgIHJpcHBsZUVsLnJlbW92ZSgpO1xuICAgIH0sIGFuaW1hdGlvbkNvbmZpZy5leGl0RHVyYXRpb24pO1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCBhbGwgY3VycmVudGx5IGFjdGl2ZSByaXBwbGVzLiAqL1xuICBmYWRlT3V0QWxsKCkge1xuICAgIHRoaXMuX2FjdGl2ZVJpcHBsZXMuZm9yRWFjaChyaXBwbGUgPT4gcmlwcGxlLmZhZGVPdXQoKSk7XG4gIH1cblxuICAvKiogRmFkZXMgb3V0IGFsbCBjdXJyZW50bHkgYWN0aXZlIG5vbi1wZXJzaXN0ZW50IHJpcHBsZXMuICovXG4gIGZhZGVPdXRBbGxOb25QZXJzaXN0ZW50KCkge1xuICAgIHRoaXMuX2FjdGl2ZVJpcHBsZXMuZm9yRWFjaChyaXBwbGUgPT4ge1xuICAgICAgaWYgKCFyaXBwbGUuY29uZmlnLnBlcnNpc3RlbnQpIHtcbiAgICAgICAgcmlwcGxlLmZhZGVPdXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSB0cmlnZ2VyIGV2ZW50IGxpc3RlbmVycyAqL1xuICBzZXR1cFRyaWdnZXJFdmVudHMoZWxlbWVudE9yRWxlbWVudFJlZjogSFRNTEVsZW1lbnQgfCBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjb2VyY2VFbGVtZW50KGVsZW1lbnRPckVsZW1lbnRSZWYpO1xuXG4gICAgaWYgKCFlbGVtZW50IHx8IGVsZW1lbnQgPT09IHRoaXMuX3RyaWdnZXJFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGFsbCBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHRyaWdnZXIgZWxlbWVudC5cbiAgICB0aGlzLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG5cbiAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMocG9pbnRlckRvd25FdmVudHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYWxsIHJlZ2lzdGVyZWQgZXZlbnRzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBoYW5kbGVFdmVudChldmVudDogRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicpIHtcbiAgICAgIHRoaXMuX29uTW91c2Vkb3duKGV2ZW50IGFzIE1vdXNlRXZlbnQpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG4gICAgICB0aGlzLl9vblRvdWNoU3RhcnQoZXZlbnQgYXMgVG91Y2hFdmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX29uUG9pbnRlclVwKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgcG9pbnRlci11cCBldmVudHMgaGF2ZW4ndCBiZWVuIHJlZ2lzdGVyZWQgeWV0LCBkbyBzbyBub3cuXG4gICAgLy8gV2UgZG8gdGhpcyBvbi1kZW1hbmQgaW4gb3JkZXIgdG8gcmVkdWNlIHRoZSB0b3RhbCBudW1iZXIgb2YgZXZlbnQgbGlzdGVuZXJzXG4gICAgLy8gcmVnaXN0ZXJlZCBieSB0aGUgcmlwcGxlcywgd2hpY2ggc3BlZWRzIHVwIHRoZSByZW5kZXJpbmcgdGltZSBmb3IgbGFyZ2UgVUlzLlxuICAgIGlmICghdGhpcy5fcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCkge1xuICAgICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMocG9pbnRlclVwRXZlbnRzKTtcbiAgICAgIHRoaXMuX3BvaW50ZXJVcEV2ZW50c1JlZ2lzdGVyZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBGdW5jdGlvbiBiZWluZyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHRyaWdnZXIgaXMgYmVpbmcgcHJlc3NlZCB1c2luZyBtb3VzZS4gKi9cbiAgcHJpdmF0ZSBfb25Nb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAvLyBTY3JlZW4gcmVhZGVycyB3aWxsIGZpcmUgZmFrZSBtb3VzZSBldmVudHMgZm9yIHNwYWNlL2VudGVyLiBTa2lwIGxhdW5jaGluZyBhXG4gICAgLy8gcmlwcGxlIGluIHRoaXMgY2FzZSBmb3IgY29uc2lzdGVuY3kgd2l0aCB0aGUgbm9uLXNjcmVlbi1yZWFkZXIgZXhwZXJpZW5jZS5cbiAgICBjb25zdCBpc0Zha2VNb3VzZWRvd24gPSBpc0Zha2VNb3VzZWRvd25Gcm9tU2NyZWVuUmVhZGVyKGV2ZW50KTtcbiAgICBjb25zdCBpc1N5bnRoZXRpY0V2ZW50ID1cbiAgICAgIHRoaXMuX2xhc3RUb3VjaFN0YXJ0RXZlbnQgJiZcbiAgICAgIERhdGUubm93KCkgPCB0aGlzLl9sYXN0VG91Y2hTdGFydEV2ZW50ICsgaWdub3JlTW91c2VFdmVudHNUaW1lb3V0O1xuXG4gICAgaWYgKCF0aGlzLl90YXJnZXQucmlwcGxlRGlzYWJsZWQgJiYgIWlzRmFrZU1vdXNlZG93biAmJiAhaXNTeW50aGV0aWNFdmVudCkge1xuICAgICAgdGhpcy5faXNQb2ludGVyRG93biA9IHRydWU7XG4gICAgICB0aGlzLmZhZGVJblJpcHBsZShldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZLCB0aGlzLl90YXJnZXQucmlwcGxlQ29uZmlnKTtcbiAgICB9XG4gIH1cblxuICAvKiogRnVuY3Rpb24gYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB0cmlnZ2VyIGlzIGJlaW5nIHByZXNzZWQgdXNpbmcgdG91Y2guICovXG4gIHByaXZhdGUgX29uVG91Y2hTdGFydChldmVudDogVG91Y2hFdmVudCkge1xuICAgIGlmICghdGhpcy5fdGFyZ2V0LnJpcHBsZURpc2FibGVkICYmICFpc0Zha2VUb3VjaHN0YXJ0RnJvbVNjcmVlblJlYWRlcihldmVudCkpIHtcbiAgICAgIC8vIFNvbWUgYnJvd3NlcnMgZmlyZSBtb3VzZSBldmVudHMgYWZ0ZXIgYSBgdG91Y2hzdGFydGAgZXZlbnQuIFRob3NlIHN5bnRoZXRpYyBtb3VzZVxuICAgICAgLy8gZXZlbnRzIHdpbGwgbGF1bmNoIGEgc2Vjb25kIHJpcHBsZSBpZiB3ZSBkb24ndCBpZ25vcmUgbW91c2UgZXZlbnRzIGZvciBhIHNwZWNpZmljXG4gICAgICAvLyB0aW1lIGFmdGVyIGEgdG91Y2hzdGFydCBldmVudC5cbiAgICAgIHRoaXMuX2xhc3RUb3VjaFN0YXJ0RXZlbnQgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5faXNQb2ludGVyRG93biA9IHRydWU7XG5cbiAgICAgIC8vIFVzZSBgY2hhbmdlZFRvdWNoZXNgIHNvIHdlIHNraXAgYW55IHRvdWNoZXMgd2hlcmUgdGhlIHVzZXIgcHV0XG4gICAgICAvLyB0aGVpciBmaW5nZXIgZG93biwgYnV0IHVzZWQgYW5vdGhlciBmaW5nZXIgdG8gdGFwIHRoZSBlbGVtZW50IGFnYWluLlxuICAgICAgY29uc3QgdG91Y2hlcyA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5mYWRlSW5SaXBwbGUodG91Y2hlc1tpXS5jbGllbnRYLCB0b3VjaGVzW2ldLmNsaWVudFksIHRoaXMuX3RhcmdldC5yaXBwbGVDb25maWcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBGdW5jdGlvbiBiZWluZyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHRyaWdnZXIgaXMgYmVpbmcgcmVsZWFzZWQuICovXG4gIHByaXZhdGUgX29uUG9pbnRlclVwKCkge1xuICAgIGlmICghdGhpcy5faXNQb2ludGVyRG93bikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSBmYWxzZTtcblxuICAgIC8vIEZhZGUtb3V0IGFsbCByaXBwbGVzIHRoYXQgYXJlIHZpc2libGUgYW5kIG5vdCBwZXJzaXN0ZW50LlxuICAgIHRoaXMuX2FjdGl2ZVJpcHBsZXMuZm9yRWFjaChyaXBwbGUgPT4ge1xuICAgICAgLy8gQnkgZGVmYXVsdCwgb25seSByaXBwbGVzIHRoYXQgYXJlIGNvbXBsZXRlbHkgdmlzaWJsZSB3aWxsIGZhZGUgb3V0IG9uIHBvaW50ZXIgcmVsZWFzZS5cbiAgICAgIC8vIElmIHRoZSBgdGVybWluYXRlT25Qb2ludGVyVXBgIG9wdGlvbiBpcyBzZXQsIHJpcHBsZXMgdGhhdCBzdGlsbCBmYWRlIGluIHdpbGwgYWxzbyBmYWRlIG91dC5cbiAgICAgIGNvbnN0IGlzVmlzaWJsZSA9XG4gICAgICAgIHJpcHBsZS5zdGF0ZSA9PT0gUmlwcGxlU3RhdGUuVklTSUJMRSB8fFxuICAgICAgICAocmlwcGxlLmNvbmZpZy50ZXJtaW5hdGVPblBvaW50ZXJVcCAmJiByaXBwbGUuc3RhdGUgPT09IFJpcHBsZVN0YXRlLkZBRElOR19JTik7XG5cbiAgICAgIGlmICghcmlwcGxlLmNvbmZpZy5wZXJzaXN0ZW50ICYmIGlzVmlzaWJsZSkge1xuICAgICAgICByaXBwbGUuZmFkZU91dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJ1bnMgYSB0aW1lb3V0IG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIgem9uZSB0byBhdm9pZCB0cmlnZ2VyaW5nIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uLiAqL1xuICBwcml2YXRlIF9ydW5UaW1lb3V0T3V0c2lkZVpvbmUoZm46IEZ1bmN0aW9uLCBkZWxheSA9IDApIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gc2V0VGltZW91dChmbiwgZGVsYXkpKTtcbiAgfVxuXG4gIC8qKiBSZWdpc3RlcnMgZXZlbnQgbGlzdGVuZXJzIGZvciBhIGdpdmVuIGxpc3Qgb2YgZXZlbnRzLiAqL1xuICBwcml2YXRlIF9yZWdpc3RlckV2ZW50cyhldmVudFR5cGVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBldmVudFR5cGVzLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJFbGVtZW50IS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIHRoaXMsIHBhc3NpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogUmVtb3ZlcyBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHRyaWdnZXIgZWxlbWVudC4gKi9cbiAgX3JlbW92ZVRyaWdnZXJFdmVudHMoKSB7XG4gICAgaWYgKHRoaXMuX3RyaWdnZXJFbGVtZW50KSB7XG4gICAgICBwb2ludGVyRG93bkV2ZW50cy5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCEucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzLCBwYXNzaXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5fcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCkge1xuICAgICAgICBwb2ludGVyVXBFdmVudHMuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCEucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzLCBwYXNzaXZlRXZlbnRPcHRpb25zKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKiBFbmZvcmNlcyBhIHN0eWxlIHJlY2FsY3VsYXRpb24gb2YgYSBET00gZWxlbWVudCBieSBjb21wdXRpbmcgaXRzIHN0eWxlcy4gKi9cbmZ1bmN0aW9uIGVuZm9yY2VTdHlsZVJlY2FsY3VsYXRpb24oZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgLy8gRW5mb3JjZSBhIHN0eWxlIHJlY2FsY3VsYXRpb24gYnkgY2FsbGluZyBgZ2V0Q29tcHV0ZWRTdHlsZWAgYW5kIGFjY2Vzc2luZyBhbnkgcHJvcGVydHkuXG4gIC8vIENhbGxpbmcgYGdldFByb3BlcnR5VmFsdWVgIGlzIGltcG9ydGFudCB0byBsZXQgb3B0aW1pemVycyBrbm93IHRoYXQgdGhpcyBpcyBub3QgYSBub29wLlxuICAvLyBTZWU6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC81ZDUyZmIwODFiMzU3MGM4MWUzYVxuICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdvcGFjaXR5Jyk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgcG9pbnQgKHgsIHkpIHRvIHRoZSBmdXJ0aGVzdCBjb3JuZXIgb2YgYSByZWN0YW5nbGUuXG4gKi9cbmZ1bmN0aW9uIGRpc3RhbmNlVG9GdXJ0aGVzdENvcm5lcih4OiBudW1iZXIsIHk6IG51bWJlciwgcmVjdDogQ2xpZW50UmVjdCkge1xuICBjb25zdCBkaXN0WCA9IE1hdGgubWF4KE1hdGguYWJzKHggLSByZWN0LmxlZnQpLCBNYXRoLmFicyh4IC0gcmVjdC5yaWdodCkpO1xuICBjb25zdCBkaXN0WSA9IE1hdGgubWF4KE1hdGguYWJzKHkgLSByZWN0LnRvcCksIE1hdGguYWJzKHkgLSByZWN0LmJvdHRvbSkpO1xuICByZXR1cm4gTWF0aC5zcXJ0KGRpc3RYICogZGlzdFggKyBkaXN0WSAqIGRpc3RZKTtcbn1cbiJdfQ==