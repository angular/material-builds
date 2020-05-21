import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
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
        if (!this._target.rippleDisabled) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS1yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxPQUFPLEVBQVcsK0JBQStCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNoRixPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNsRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDcEQsT0FBTyxFQUFDLFNBQVMsRUFBYyxNQUFNLGNBQWMsQ0FBQztBQWtDcEQ7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sNEJBQTRCLEdBQUc7SUFDMUMsYUFBYSxFQUFFLEdBQUc7SUFDbEIsWUFBWSxFQUFFLEdBQUc7Q0FDbEIsQ0FBQztBQUVGOzs7R0FHRztBQUNILE1BQU0sd0JBQXdCLEdBQUcsR0FBRyxDQUFDO0FBRXJDLDJGQUEyRjtBQUMzRixNQUFNLG1CQUFtQixHQUFHLCtCQUErQixDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7QUFFN0UsbURBQW1EO0FBQ25ELE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFdEQsaURBQWlEO0FBQ2pELE1BQU0sZUFBZSxHQUFHLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFFN0U7Ozs7OztHQU1HO0FBQ0gsTUFBTSxPQUFPLGNBQWM7SUE0QnpCLFlBQW9CLE9BQXFCLEVBQ3JCLE9BQWUsRUFDdkIsbUJBQTBELEVBQzFELFFBQWtCO1FBSFYsWUFBTyxHQUFQLE9BQU8sQ0FBYztRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBdEJuQyxvREFBb0Q7UUFDNUMsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFFL0IsaURB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LENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDMUUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDMUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQ2xELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudFJlZiwgTmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGxhdGZvcm0sIG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge2lzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Y29lcmNlRWxlbWVudH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UmlwcGxlUmVmLCBSaXBwbGVTdGF0ZX0gZnJvbSAnLi9yaXBwbGUtcmVmJztcblxuZXhwb3J0IHR5cGUgUmlwcGxlQ29uZmlnID0ge1xuICBjb2xvcj86IHN0cmluZztcbiAgY2VudGVyZWQ/OiBib29sZWFuO1xuICByYWRpdXM/OiBudW1iZXI7XG4gIHBlcnNpc3RlbnQ/OiBib29sZWFuO1xuICBhbmltYXRpb24/OiBSaXBwbGVBbmltYXRpb25Db25maWc7XG4gIHRlcm1pbmF0ZU9uUG9pbnRlclVwPzogYm9vbGVhbjtcbn07XG5cbi8qKlxuICogSW50ZXJmYWNlIHRoYXQgZGVzY3JpYmVzIHRoZSBjb25maWd1cmF0aW9uIGZvciB0aGUgYW5pbWF0aW9uIG9mIGEgcmlwcGxlLlxuICogVGhlcmUgYXJlIHR3byBhbmltYXRpb24gcGhhc2VzIHdpdGggZGlmZmVyZW50IGR1cmF0aW9ucyBmb3IgdGhlIHJpcHBsZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmlwcGxlQW5pbWF0aW9uQ29uZmlnIHtcbiAgLyoqIER1cmF0aW9uIGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIGVudGVyIGFuaW1hdGlvbiAoZXhwYW5zaW9uIGZyb20gcG9pbnQgb2YgY29udGFjdCkuICovXG4gIGVudGVyRHVyYXRpb24/OiBudW1iZXI7XG4gIC8qKiBEdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSBleGl0IGFuaW1hdGlvbiAoZmFkZS1vdXQpLiAqL1xuICBleGl0RHVyYXRpb24/OiBudW1iZXI7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIHRoYXQgZGVzY3JpYmVzIHRoZSB0YXJnZXQgZm9yIGxhdW5jaGluZyByaXBwbGVzLlxuICogSXQgZGVmaW5lcyB0aGUgcmlwcGxlIGNvbmZpZ3VyYXRpb24gYW5kIGRpc2FibGVkIHN0YXRlIGZvciBpbnRlcmFjdGlvbiByaXBwbGVzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJpcHBsZVRhcmdldCB7XG4gIC8qKiBDb25maWd1cmF0aW9uIGZvciByaXBwbGVzIHRoYXQgYXJlIGxhdW5jaGVkIG9uIHBvaW50ZXIgZG93bi4gKi9cbiAgcmlwcGxlQ29uZmlnOiBSaXBwbGVDb25maWc7XG4gIC8qKiBXaGV0aGVyIHJpcHBsZXMgb24gcG9pbnRlciBkb3duIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgcmlwcGxlRGlzYWJsZWQ6IGJvb2xlYW47XG59XG5cbi8qKlxuICogRGVmYXVsdCByaXBwbGUgYW5pbWF0aW9uIGNvbmZpZ3VyYXRpb24gZm9yIHJpcHBsZXMgd2l0aG91dCBhbiBleHBsaWNpdFxuICogYW5pbWF0aW9uIGNvbmZpZyBzcGVjaWZpZWQuXG4gKi9cbmV4cG9ydCBjb25zdCBkZWZhdWx0UmlwcGxlQW5pbWF0aW9uQ29uZmlnID0ge1xuICBlbnRlckR1cmF0aW9uOiA0NTAsXG4gIGV4aXREdXJhdGlvbjogNDAwXG59O1xuXG4vKipcbiAqIFRpbWVvdXQgZm9yIGlnbm9yaW5nIG1vdXNlIGV2ZW50cy4gTW91c2UgZXZlbnRzIHdpbGwgYmUgdGVtcG9yYXJ5IGlnbm9yZWQgYWZ0ZXIgdG91Y2hcbiAqIGV2ZW50cyB0byBhdm9pZCBzeW50aGV0aWMgbW91c2UgZXZlbnRzLlxuICovXG5jb25zdCBpZ25vcmVNb3VzZUV2ZW50c1RpbWVvdXQgPSA4MDA7XG5cbi8qKiBPcHRpb25zIHRoYXQgYXBwbHkgdG8gYWxsIHRoZSBldmVudCBsaXN0ZW5lcnMgdGhhdCBhcmUgYm91bmQgYnkgdGhlIHJpcHBsZSByZW5kZXJlci4gKi9cbmNvbnN0IHBhc3NpdmVFdmVudE9wdGlvbnMgPSBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHtwYXNzaXZlOiB0cnVlfSk7XG5cbi8qKiBFdmVudHMgdGhhdCBzaWduYWwgdGhhdCB0aGUgcG9pbnRlciBpcyBkb3duLiAqL1xuY29uc3QgcG9pbnRlckRvd25FdmVudHMgPSBbJ21vdXNlZG93bicsICd0b3VjaHN0YXJ0J107XG5cbi8qKiBFdmVudHMgdGhhdCBzaWduYWwgdGhhdCB0aGUgcG9pbnRlciBpcyB1cC4gKi9cbmNvbnN0IHBvaW50ZXJVcEV2ZW50cyA9IFsnbW91c2V1cCcsICdtb3VzZWxlYXZlJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJ107XG5cbi8qKlxuICogSGVscGVyIHNlcnZpY2UgdGhhdCBwZXJmb3JtcyBET00gbWFuaXB1bGF0aW9ucy4gTm90IGludGVuZGVkIHRvIGJlIHVzZWQgb3V0c2lkZSB0aGlzIG1vZHVsZS5cbiAqIFRoZSBjb25zdHJ1Y3RvciB0YWtlcyBhIHJlZmVyZW5jZSB0byB0aGUgcmlwcGxlIGRpcmVjdGl2ZSdzIGhvc3QgZWxlbWVudCBhbmQgYSBtYXAgb2YgRE9NXG4gKiBldmVudCBoYW5kbGVycyB0byBiZSBpbnN0YWxsZWQgb24gdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VycyByaXBwbGUgYW5pbWF0aW9ucy5cbiAqIFRoaXMgd2lsbCBldmVudHVhbGx5IGJlY29tZSBhIGN1c3RvbSByZW5kZXJlciBvbmNlIEFuZ3VsYXIgc3VwcG9ydCBleGlzdHMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBSaXBwbGVSZW5kZXJlciBpbXBsZW1lbnRzIEV2ZW50TGlzdGVuZXJPYmplY3Qge1xuICAvKiogRWxlbWVudCB3aGVyZSB0aGUgcmlwcGxlcyBhcmUgYmVpbmcgYWRkZWQgdG8uICovXG4gIHByaXZhdGUgX2NvbnRhaW5lckVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBFbGVtZW50IHdoaWNoIHRyaWdnZXJzIHRoZSByaXBwbGUgZWxlbWVudHMgb24gbW91c2UgZXZlbnRzLiAqL1xuICBwcml2YXRlIF90cmlnZ2VyRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBwb2ludGVyIGlzIGN1cnJlbnRseSBkb3duIG9yIG5vdC4gKi9cbiAgcHJpdmF0ZSBfaXNQb2ludGVyRG93biA9IGZhbHNlO1xuXG4gIC8qKiBTZXQgb2YgY3VycmVudGx5IGFjdGl2ZSByaXBwbGUgcmVmZXJlbmNlcy4gKi9cbiAgcHJpdmF0ZSBfYWN0aXZlUmlwcGxlcyA9IG5ldyBTZXQ8UmlwcGxlUmVmPigpO1xuXG4gIC8qKiBMYXRlc3Qgbm9uLXBlcnNpc3RlbnQgcmlwcGxlIHRoYXQgd2FzIHRyaWdnZXJlZC4gKi9cbiAgcHJpdmF0ZSBfbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZTogUmlwcGxlUmVmIHwgbnVsbDtcblxuICAvKiogVGltZSBpbiBtaWxsaXNlY29uZHMgd2hlbiB0aGUgbGFzdCB0b3VjaHN0YXJ0IGV2ZW50IGhhcHBlbmVkLiAqL1xuICBwcml2YXRlIF9sYXN0VG91Y2hTdGFydEV2ZW50OiBudW1iZXI7XG5cbiAgLyoqIFdoZXRoZXIgcG9pbnRlci11cCBldmVudCBsaXN0ZW5lcnMgaGF2ZSBiZWVuIHJlZ2lzdGVyZWQuICovXG4gIHByaXZhdGUgX3BvaW50ZXJVcEV2ZW50c1JlZ2lzdGVyZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogQ2FjaGVkIGRpbWVuc2lvbnMgb2YgdGhlIHJpcHBsZSBjb250YWluZXIuIFNldCB3aGVuIHRoZSBmaXJzdFxuICAgKiByaXBwbGUgaXMgc2hvd24gYW5kIGNsZWFyZWQgb25jZSBubyBtb3JlIHJpcHBsZXMgYXJlIHZpc2libGUuXG4gICAqL1xuICBwcml2YXRlIF9jb250YWluZXJSZWN0OiBDbGllbnRSZWN0IHwgbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF90YXJnZXQ6IFJpcHBsZVRhcmdldCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIGVsZW1lbnRPckVsZW1lbnRSZWY6IEhUTUxFbGVtZW50IHwgRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSkge1xuXG4gICAgLy8gT25seSBkbyBhbnl0aGluZyBpZiB3ZSdyZSBvbiB0aGUgYnJvd3Nlci5cbiAgICBpZiAocGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb250YWluZXJFbGVtZW50ID0gY29lcmNlRWxlbWVudChlbGVtZW50T3JFbGVtZW50UmVmKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmFkZXMgaW4gYSByaXBwbGUgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzLlxuICAgKiBAcGFyYW0geCBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFggYXhpcyBhdCB3aGljaCB0byBzdGFydCB0aGUgcmlwcGxlLlxuICAgKiBAcGFyYW0geSBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFkgYXhpcyBhdCB3aGljaCB0byBzdGFydCB0aGUgcmlwcGxlLlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIHJpcHBsZSBvcHRpb25zLlxuICAgKi9cbiAgZmFkZUluUmlwcGxlKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25maWc6IFJpcHBsZUNvbmZpZyA9IHt9KTogUmlwcGxlUmVmIHtcbiAgICBjb25zdCBjb250YWluZXJSZWN0ID0gdGhpcy5fY29udGFpbmVyUmVjdCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lclJlY3QgfHwgdGhpcy5fY29udGFpbmVyRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBhbmltYXRpb25Db25maWcgPSB7Li4uZGVmYXVsdFJpcHBsZUFuaW1hdGlvbkNvbmZpZywgLi4uY29uZmlnLmFuaW1hdGlvbn07XG5cbiAgICBpZiAoY29uZmlnLmNlbnRlcmVkKSB7XG4gICAgICB4ID0gY29udGFpbmVyUmVjdC5sZWZ0ICsgY29udGFpbmVyUmVjdC53aWR0aCAvIDI7XG4gICAgICB5ID0gY29udGFpbmVyUmVjdC50b3AgKyBjb250YWluZXJSZWN0LmhlaWdodCAvIDI7XG4gICAgfVxuXG4gICAgY29uc3QgcmFkaXVzID0gY29uZmlnLnJhZGl1cyB8fCBkaXN0YW5jZVRvRnVydGhlc3RDb3JuZXIoeCwgeSwgY29udGFpbmVyUmVjdCk7XG4gICAgY29uc3Qgb2Zmc2V0WCA9IHggLSBjb250YWluZXJSZWN0LmxlZnQ7XG4gICAgY29uc3Qgb2Zmc2V0WSA9IHkgLSBjb250YWluZXJSZWN0LnRvcDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IGFuaW1hdGlvbkNvbmZpZy5lbnRlckR1cmF0aW9uO1xuXG4gICAgY29uc3QgcmlwcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcmlwcGxlLmNsYXNzTGlzdC5hZGQoJ21hdC1yaXBwbGUtZWxlbWVudCcpO1xuXG4gICAgcmlwcGxlLnN0eWxlLmxlZnQgPSBgJHtvZmZzZXRYIC0gcmFkaXVzfXB4YDtcbiAgICByaXBwbGUuc3R5bGUudG9wID0gYCR7b2Zmc2V0WSAtIHJhZGl1c31weGA7XG4gICAgcmlwcGxlLnN0eWxlLmhlaWdodCA9IGAke3JhZGl1cyAqIDJ9cHhgO1xuICAgIHJpcHBsZS5zdHlsZS53aWR0aCA9IGAke3JhZGl1cyAqIDJ9cHhgO1xuXG4gICAgLy8gSWYgYSBjdXN0b20gY29sb3IgaGFzIGJlZW4gc3BlY2lmaWVkLCBzZXQgaXQgYXMgaW5saW5lIHN0eWxlLiBJZiBubyBjb2xvciBpc1xuICAgIC8vIHNldCwgdGhlIGRlZmF1bHQgY29sb3Igd2lsbCBiZSBhcHBsaWVkIHRocm91Z2ggdGhlIHJpcHBsZSB0aGVtZSBzdHlsZXMuXG4gICAgaWYgKGNvbmZpZy5jb2xvciAhPSBudWxsKSB7XG4gICAgICByaXBwbGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29uZmlnLmNvbG9yO1xuICAgIH1cblxuICAgIHJpcHBsZS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG5cbiAgICB0aGlzLl9jb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKHJpcHBsZSk7XG5cbiAgICAvLyBCeSBkZWZhdWx0IHRoZSBicm93c2VyIGRvZXMgbm90IHJlY2FsY3VsYXRlIHRoZSBzdHlsZXMgb2YgZHluYW1pY2FsbHkgY3JlYXRlZFxuICAgIC8vIHJpcHBsZSBlbGVtZW50cy4gVGhpcyBpcyBjcml0aWNhbCBiZWNhdXNlIHRoZW4gdGhlIGBzY2FsZWAgd291bGQgbm90IGFuaW1hdGUgcHJvcGVybHkuXG4gICAgZW5mb3JjZVN0eWxlUmVjYWxjdWxhdGlvbihyaXBwbGUpO1xuXG4gICAgcmlwcGxlLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgxKSc7XG5cbiAgICAvLyBFeHBvc2VkIHJlZmVyZW5jZSB0byB0aGUgcmlwcGxlIHRoYXQgd2lsbCBiZSByZXR1cm5lZC5cbiAgICBjb25zdCByaXBwbGVSZWYgPSBuZXcgUmlwcGxlUmVmKHRoaXMsIHJpcHBsZSwgY29uZmlnKTtcblxuICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLkZBRElOR19JTjtcblxuICAgIC8vIEFkZCB0aGUgcmlwcGxlIHJlZmVyZW5jZSB0byB0aGUgbGlzdCBvZiBhbGwgYWN0aXZlIHJpcHBsZXMuXG4gICAgdGhpcy5fYWN0aXZlUmlwcGxlcy5hZGQocmlwcGxlUmVmKTtcblxuICAgIGlmICghY29uZmlnLnBlcnNpc3RlbnQpIHtcbiAgICAgIHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgPSByaXBwbGVSZWY7XG4gICAgfVxuXG4gICAgLy8gV2FpdCBmb3IgdGhlIHJpcHBsZSBlbGVtZW50IHRvIGJlIGNvbXBsZXRlbHkgZmFkZWQgaW4uXG4gICAgLy8gT25jZSBpdCdzIGZhZGVkIGluLCB0aGUgcmlwcGxlIGNhbiBiZSBoaWRkZW4gaW1tZWRpYXRlbHkgaWYgdGhlIG1vdXNlIGlzIHJlbGVhc2VkLlxuICAgIHRoaXMuX3J1blRpbWVvdXRPdXRzaWRlWm9uZSgoKSA9PiB7XG4gICAgICBjb25zdCBpc01vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgPSByaXBwbGVSZWYgPT09IHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGU7XG5cbiAgICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLlZJU0lCTEU7XG5cbiAgICAgIC8vIFdoZW4gdGhlIHRpbWVyIHJ1bnMgb3V0IHdoaWxlIHRoZSB1c2VyIGhhcyBrZXB0IHRoZWlyIHBvaW50ZXIgZG93biwgd2Ugd2FudCB0b1xuICAgICAgLy8ga2VlcCBvbmx5IHRoZSBwZXJzaXN0ZW50IHJpcHBsZXMgYW5kIHRoZSBsYXRlc3QgdHJhbnNpZW50IHJpcHBsZS4gV2UgZG8gdGhpcyxcbiAgICAgIC8vIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCBzdGFja2VkIHRyYW5zaWVudCByaXBwbGVzIHRvIGFwcGVhciBhZnRlciB0aGVpciBlbnRlclxuICAgICAgLy8gYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC5cbiAgICAgIGlmICghY29uZmlnLnBlcnNpc3RlbnQgJiYgKCFpc01vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgfHwgIXRoaXMuX2lzUG9pbnRlckRvd24pKSB7XG4gICAgICAgIHJpcHBsZVJlZi5mYWRlT3V0KCk7XG4gICAgICB9XG4gICAgfSwgZHVyYXRpb24pO1xuXG4gICAgcmV0dXJuIHJpcHBsZVJlZjtcbiAgfVxuXG4gIC8qKiBGYWRlcyBvdXQgYSByaXBwbGUgcmVmZXJlbmNlLiAqL1xuICBmYWRlT3V0UmlwcGxlKHJpcHBsZVJlZjogUmlwcGxlUmVmKSB7XG4gICAgY29uc3Qgd2FzQWN0aXZlID0gdGhpcy5fYWN0aXZlUmlwcGxlcy5kZWxldGUocmlwcGxlUmVmKTtcblxuICAgIGlmIChyaXBwbGVSZWYgPT09IHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUpIHtcbiAgICAgIHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIENsZWFyIG91dCB0aGUgY2FjaGVkIGJvdW5kaW5nIHJlY3QgaWYgd2UgaGF2ZSBubyBtb3JlIHJpcHBsZXMuXG4gICAgaWYgKCF0aGlzLl9hY3RpdmVSaXBwbGVzLnNpemUpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lclJlY3QgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIEZvciByaXBwbGVzIHRoYXQgYXJlIG5vdCBhY3RpdmUgYW55bW9yZSwgZG9uJ3QgcmUtcnVuIHRoZSBmYWRlLW91dCBhbmltYXRpb24uXG4gICAgaWYgKCF3YXNBY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByaXBwbGVFbCA9IHJpcHBsZVJlZi5lbGVtZW50O1xuICAgIGNvbnN0IGFuaW1hdGlvbkNvbmZpZyA9IHsuLi5kZWZhdWx0UmlwcGxlQW5pbWF0aW9uQ29uZmlnLCAuLi5yaXBwbGVSZWYuY29uZmlnLmFuaW1hdGlvbn07XG5cbiAgICByaXBwbGVFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHthbmltYXRpb25Db25maWcuZXhpdER1cmF0aW9ufW1zYDtcbiAgICByaXBwbGVFbC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLkZBRElOR19PVVQ7XG5cbiAgICAvLyBPbmNlIHRoZSByaXBwbGUgZmFkZWQgb3V0LCB0aGUgcmlwcGxlIGNhbiBiZSBzYWZlbHkgcmVtb3ZlZCBmcm9tIHRoZSBET00uXG4gICAgdGhpcy5fcnVuVGltZW91dE91dHNpZGVab25lKCgpID0+IHtcbiAgICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLkhJRERFTjtcbiAgICAgIHJpcHBsZUVsLnBhcmVudE5vZGUhLnJlbW92ZUNoaWxkKHJpcHBsZUVsKTtcbiAgICB9LCBhbmltYXRpb25Db25maWcuZXhpdER1cmF0aW9uKTtcbiAgfVxuXG4gIC8qKiBGYWRlcyBvdXQgYWxsIGN1cnJlbnRseSBhY3RpdmUgcmlwcGxlcy4gKi9cbiAgZmFkZU91dEFsbCgpIHtcbiAgICB0aGlzLl9hY3RpdmVSaXBwbGVzLmZvckVhY2gocmlwcGxlID0+IHJpcHBsZS5mYWRlT3V0KCkpO1xuICB9XG5cbiAgLyoqIFNldHMgdXAgdGhlIHRyaWdnZXIgZXZlbnQgbGlzdGVuZXJzICovXG4gIHNldHVwVHJpZ2dlckV2ZW50cyhlbGVtZW50T3JFbGVtZW50UmVmOiBIVE1MRWxlbWVudCB8IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGNvZXJjZUVsZW1lbnQoZWxlbWVudE9yRWxlbWVudFJlZik7XG5cbiAgICBpZiAoIWVsZW1lbnQgfHwgZWxlbWVudCA9PT0gdGhpcy5fdHJpZ2dlckVsZW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYWxsIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdHJpZ2dlciBlbGVtZW50LlxuICAgIHRoaXMuX3JlbW92ZVRyaWdnZXJFdmVudHMoKTtcblxuICAgIHRoaXMuX3RyaWdnZXJFbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLl9yZWdpc3RlckV2ZW50cyhwb2ludGVyRG93bkV2ZW50cyk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyBhbGwgcmVnaXN0ZXJlZCBldmVudHMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGhhbmRsZUV2ZW50KGV2ZW50OiBFdmVudCkge1xuICAgIGlmIChldmVudC50eXBlID09PSAnbW91c2Vkb3duJykge1xuICAgICAgdGhpcy5fb25Nb3VzZWRvd24oZXZlbnQgYXMgTW91c2VFdmVudCk7XG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSAndG91Y2hzdGFydCcpIHtcbiAgICAgIHRoaXMuX29uVG91Y2hTdGFydChldmVudCBhcyBUb3VjaEV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fb25Qb2ludGVyVXAoKTtcbiAgICB9XG5cbiAgICAvLyBJZiBwb2ludGVyLXVwIGV2ZW50cyBoYXZlbid0IGJlZW4gcmVnaXN0ZXJlZCB5ZXQsIGRvIHNvIG5vdy5cbiAgICAvLyBXZSBkbyB0aGlzIG9uLWRlbWFuZCBpbiBvcmRlciB0byByZWR1Y2UgdGhlIHRvdGFsIG51bWJlciBvZiBldmVudCBsaXN0ZW5lcnNcbiAgICAvLyByZWdpc3RlcmVkIGJ5IHRoZSByaXBwbGVzLCB3aGljaCBzcGVlZHMgdXAgdGhlIHJlbmRlcmluZyB0aW1lIGZvciBsYXJnZSBVSXMuXG4gICAgaWYgKCF0aGlzLl9wb2ludGVyVXBFdmVudHNSZWdpc3RlcmVkKSB7XG4gICAgICB0aGlzLl9yZWdpc3RlckV2ZW50cyhwb2ludGVyVXBFdmVudHMpO1xuICAgICAgdGhpcy5fcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZ1bmN0aW9uIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgdHJpZ2dlciBpcyBiZWluZyBwcmVzc2VkIHVzaW5nIG1vdXNlLiAqL1xuICBwcml2YXRlIF9vbk1vdXNlZG93bihldmVudDogTW91c2VFdmVudCkge1xuICAgIC8vIFNjcmVlbiByZWFkZXJzIHdpbGwgZmlyZSBmYWtlIG1vdXNlIGV2ZW50cyBmb3Igc3BhY2UvZW50ZXIuIFNraXAgbGF1bmNoaW5nIGFcbiAgICAvLyByaXBwbGUgaW4gdGhpcyBjYXNlIGZvciBjb25zaXN0ZW5jeSB3aXRoIHRoZSBub24tc2NyZWVuLXJlYWRlciBleHBlcmllbmNlLlxuICAgIGNvbnN0IGlzRmFrZU1vdXNlZG93biA9IGlzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXIoZXZlbnQpO1xuICAgIGNvbnN0IGlzU3ludGhldGljRXZlbnQgPSB0aGlzLl9sYXN0VG91Y2hTdGFydEV2ZW50ICYmXG4gICAgICAgIERhdGUubm93KCkgPCB0aGlzLl9sYXN0VG91Y2hTdGFydEV2ZW50ICsgaWdub3JlTW91c2VFdmVudHNUaW1lb3V0O1xuXG4gICAgaWYgKCF0aGlzLl90YXJnZXQucmlwcGxlRGlzYWJsZWQgJiYgIWlzRmFrZU1vdXNlZG93biAmJiAhaXNTeW50aGV0aWNFdmVudCkge1xuICAgICAgdGhpcy5faXNQb2ludGVyRG93biA9IHRydWU7XG4gICAgICB0aGlzLmZhZGVJblJpcHBsZShldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZLCB0aGlzLl90YXJnZXQucmlwcGxlQ29uZmlnKTtcbiAgICB9XG4gIH1cblxuICAvKiogRnVuY3Rpb24gYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB0cmlnZ2VyIGlzIGJlaW5nIHByZXNzZWQgdXNpbmcgdG91Y2guICovXG4gIHByaXZhdGUgX29uVG91Y2hTdGFydChldmVudDogVG91Y2hFdmVudCkge1xuICAgIGlmICghdGhpcy5fdGFyZ2V0LnJpcHBsZURpc2FibGVkKSB7XG4gICAgICAvLyBTb21lIGJyb3dzZXJzIGZpcmUgbW91c2UgZXZlbnRzIGFmdGVyIGEgYHRvdWNoc3RhcnRgIGV2ZW50LiBUaG9zZSBzeW50aGV0aWMgbW91c2VcbiAgICAgIC8vIGV2ZW50cyB3aWxsIGxhdW5jaCBhIHNlY29uZCByaXBwbGUgaWYgd2UgZG9uJ3QgaWdub3JlIG1vdXNlIGV2ZW50cyBmb3IgYSBzcGVjaWZpY1xuICAgICAgLy8gdGltZSBhZnRlciBhIHRvdWNoc3RhcnQgZXZlbnQuXG4gICAgICB0aGlzLl9sYXN0VG91Y2hTdGFydEV2ZW50ID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSB0cnVlO1xuXG4gICAgICAvLyBVc2UgYGNoYW5nZWRUb3VjaGVzYCBzbyB3ZSBza2lwIGFueSB0b3VjaGVzIHdoZXJlIHRoZSB1c2VyIHB1dFxuICAgICAgLy8gdGhlaXIgZmluZ2VyIGRvd24sIGJ1dCB1c2VkIGFub3RoZXIgZmluZ2VyIHRvIHRhcCB0aGUgZWxlbWVudCBhZ2Fpbi5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcztcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZmFkZUluUmlwcGxlKHRvdWNoZXNbaV0uY2xpZW50WCwgdG91Y2hlc1tpXS5jbGllbnRZLCB0aGlzLl90YXJnZXQucmlwcGxlQ29uZmlnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogRnVuY3Rpb24gYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB0cmlnZ2VyIGlzIGJlaW5nIHJlbGVhc2VkLiAqL1xuICBwcml2YXRlIF9vblBvaW50ZXJVcCgpIHtcbiAgICBpZiAoIXRoaXMuX2lzUG9pbnRlckRvd24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1BvaW50ZXJEb3duID0gZmFsc2U7XG5cbiAgICAvLyBGYWRlLW91dCBhbGwgcmlwcGxlcyB0aGF0IGFyZSB2aXNpYmxlIGFuZCBub3QgcGVyc2lzdGVudC5cbiAgICB0aGlzLl9hY3RpdmVSaXBwbGVzLmZvckVhY2gocmlwcGxlID0+IHtcbiAgICAgIC8vIEJ5IGRlZmF1bHQsIG9ubHkgcmlwcGxlcyB0aGF0IGFyZSBjb21wbGV0ZWx5IHZpc2libGUgd2lsbCBmYWRlIG91dCBvbiBwb2ludGVyIHJlbGVhc2UuXG4gICAgICAvLyBJZiB0aGUgYHRlcm1pbmF0ZU9uUG9pbnRlclVwYCBvcHRpb24gaXMgc2V0LCByaXBwbGVzIHRoYXQgc3RpbGwgZmFkZSBpbiB3aWxsIGFsc28gZmFkZSBvdXQuXG4gICAgICBjb25zdCBpc1Zpc2libGUgPSByaXBwbGUuc3RhdGUgPT09IFJpcHBsZVN0YXRlLlZJU0lCTEUgfHxcbiAgICAgICAgcmlwcGxlLmNvbmZpZy50ZXJtaW5hdGVPblBvaW50ZXJVcCAmJiByaXBwbGUuc3RhdGUgPT09IFJpcHBsZVN0YXRlLkZBRElOR19JTjtcblxuICAgICAgaWYgKCFyaXBwbGUuY29uZmlnLnBlcnNpc3RlbnQgJiYgaXNWaXNpYmxlKSB7XG4gICAgICAgIHJpcHBsZS5mYWRlT3V0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogUnVucyBhIHRpbWVvdXQgb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lIHRvIGF2b2lkIHRyaWdnZXJpbmcgdGhlIGNoYW5nZSBkZXRlY3Rpb24uICovXG4gIHByaXZhdGUgX3J1blRpbWVvdXRPdXRzaWRlWm9uZShmbjogRnVuY3Rpb24sIGRlbGF5ID0gMCkge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiBzZXRUaW1lb3V0KGZuLCBkZWxheSkpO1xuICB9XG5cbiAgLyoqIFJlZ2lzdGVycyBldmVudCBsaXN0ZW5lcnMgZm9yIGEgZ2l2ZW4gbGlzdCBvZiBldmVudHMuICovXG4gIHByaXZhdGUgX3JlZ2lzdGVyRXZlbnRzKGV2ZW50VHlwZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGV2ZW50VHlwZXMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCEuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzLCBwYXNzaXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgcHJldmlvdXNseSByZWdpc3RlcmVkIGV2ZW50IGxpc3RlbmVycyBmcm9tIHRoZSB0cmlnZ2VyIGVsZW1lbnQuICovXG4gIF9yZW1vdmVUcmlnZ2VyRXZlbnRzKCkge1xuICAgIGlmICh0aGlzLl90cmlnZ2VyRWxlbWVudCkge1xuICAgICAgcG9pbnRlckRvd25FdmVudHMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCEucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzLCBwYXNzaXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5fcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCkge1xuICAgICAgICBwb2ludGVyVXBFdmVudHMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICAgIHRoaXMuX3RyaWdnZXJFbGVtZW50IS5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIHRoaXMsIHBhc3NpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqIEVuZm9yY2VzIGEgc3R5bGUgcmVjYWxjdWxhdGlvbiBvZiBhIERPTSBlbGVtZW50IGJ5IGNvbXB1dGluZyBpdHMgc3R5bGVzLiAqL1xuZnVuY3Rpb24gZW5mb3JjZVN0eWxlUmVjYWxjdWxhdGlvbihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAvLyBFbmZvcmNlIGEgc3R5bGUgcmVjYWxjdWxhdGlvbiBieSBjYWxsaW5nIGBnZXRDb21wdXRlZFN0eWxlYCBhbmQgYWNjZXNzaW5nIGFueSBwcm9wZXJ0eS5cbiAgLy8gQ2FsbGluZyBgZ2V0UHJvcGVydHlWYWx1ZWAgaXMgaW1wb3J0YW50IHRvIGxldCBvcHRpbWl6ZXJzIGtub3cgdGhhdCB0aGlzIGlzIG5vdCBhIG5vb3AuXG4gIC8vIFNlZTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzVkNTJmYjA4MWIzNTcwYzgxZTNhXG4gIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ29wYWNpdHknKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBwb2ludCAoeCwgeSkgdG8gdGhlIGZ1cnRoZXN0IGNvcm5lciBvZiBhIHJlY3RhbmdsZS5cbiAqL1xuZnVuY3Rpb24gZGlzdGFuY2VUb0Z1cnRoZXN0Q29ybmVyKHg6IG51bWJlciwgeTogbnVtYmVyLCByZWN0OiBDbGllbnRSZWN0KSB7XG4gIGNvbnN0IGRpc3RYID0gTWF0aC5tYXgoTWF0aC5hYnMoeCAtIHJlY3QubGVmdCksIE1hdGguYWJzKHggLSByZWN0LnJpZ2h0KSk7XG4gIGNvbnN0IGRpc3RZID0gTWF0aC5tYXgoTWF0aC5hYnMoeSAtIHJlY3QudG9wKSwgTWF0aC5hYnMoeSAtIHJlY3QuYm90dG9tKSk7XG4gIHJldHVybiBNYXRoLnNxcnQoZGlzdFggKiBkaXN0WCArIGRpc3RZICogZGlzdFkpO1xufVxuIl19