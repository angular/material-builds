import { __assign } from "tslib";
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { coerceElement } from '@angular/cdk/coercion';
import { RippleRef } from './ripple-ref';
/**
 * Default ripple animation configuration for ripples without an explicit
 * animation config specified.
 */
export var defaultRippleAnimationConfig = {
    enterDuration: 450,
    exitDuration: 400
};
/**
 * Timeout for ignoring mouse events. Mouse events will be temporary ignored after touch
 * events to avoid synthetic mouse events.
 */
var ignoreMouseEventsTimeout = 800;
/** Options that apply to all the event listeners that are bound by the ripple renderer. */
var passiveEventOptions = normalizePassiveListenerOptions({ passive: true });
/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple directive's host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 * This will eventually become a custom renderer once Angular support exists.
 * @docs-private
 */
var RippleRenderer = /** @class */ (function () {
    function RippleRenderer(_target, _ngZone, elementOrElementRef, platform) {
        var _this = this;
        this._target = _target;
        this._ngZone = _ngZone;
        /** Whether the pointer is currently down or not. */
        this._isPointerDown = false;
        /** Events to be registered on the trigger element. */
        this._triggerEvents = new Map();
        /** Set of currently active ripple references. */
        this._activeRipples = new Set();
        /** Function being called whenever the trigger is being pressed using mouse. */
        this._onMousedown = function (event) {
            // Screen readers will fire fake mouse events for space/enter. Skip launching a
            // ripple in this case for consistency with the non-screen-reader experience.
            var isFakeMousedown = isFakeMousedownFromScreenReader(event);
            var isSyntheticEvent = _this._lastTouchStartEvent &&
                Date.now() < _this._lastTouchStartEvent + ignoreMouseEventsTimeout;
            if (!_this._target.rippleDisabled && !isFakeMousedown && !isSyntheticEvent) {
                _this._isPointerDown = true;
                _this.fadeInRipple(event.clientX, event.clientY, _this._target.rippleConfig);
            }
        };
        /** Function being called whenever the trigger is being pressed using touch. */
        this._onTouchStart = function (event) {
            if (!_this._target.rippleDisabled) {
                // Some browsers fire mouse events after a `touchstart` event. Those synthetic mouse
                // events will launch a second ripple if we don't ignore mouse events for a specific
                // time after a touchstart event.
                _this._lastTouchStartEvent = Date.now();
                _this._isPointerDown = true;
                // Use `changedTouches` so we skip any touches where the user put
                // their finger down, but used another finger to tap the element again.
                var touches = event.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    _this.fadeInRipple(touches[i].clientX, touches[i].clientY, _this._target.rippleConfig);
                }
            }
        };
        /** Function being called whenever the trigger is being released. */
        this._onPointerUp = function () {
            if (!_this._isPointerDown) {
                return;
            }
            _this._isPointerDown = false;
            // Fade-out all ripples that are visible and not persistent.
            _this._activeRipples.forEach(function (ripple) {
                // By default, only ripples that are completely visible will fade out on pointer release.
                // If the `terminateOnPointerUp` option is set, ripples that still fade in will also fade out.
                var isVisible = ripple.state === 1 /* VISIBLE */ ||
                    ripple.config.terminateOnPointerUp && ripple.state === 0 /* FADING_IN */;
                if (!ripple.config.persistent && isVisible) {
                    ripple.fadeOut();
                }
            });
        };
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
     * @param x Coordinate within the element, along the X axis at which to start the ripple.
     * @param y Coordinate within the element, along the Y axis at which to start the ripple.
     * @param config Extra ripple options.
     */
    RippleRenderer.prototype.fadeInRipple = function (x, y, config) {
        var _this = this;
        if (config === void 0) { config = {}; }
        var containerRect = this._containerRect =
            this._containerRect || this._containerElement.getBoundingClientRect();
        var animationConfig = __assign(__assign({}, defaultRippleAnimationConfig), config.animation);
        if (config.centered) {
            x = containerRect.left + containerRect.width / 2;
            y = containerRect.top + containerRect.height / 2;
        }
        var radius = config.radius || distanceToFurthestCorner(x, y, containerRect);
        var offsetX = x - containerRect.left;
        var offsetY = y - containerRect.top;
        var duration = animationConfig.enterDuration;
        var ripple = document.createElement('div');
        ripple.classList.add('mat-ripple-element');
        ripple.style.left = offsetX - radius + "px";
        ripple.style.top = offsetY - radius + "px";
        ripple.style.height = radius * 2 + "px";
        ripple.style.width = radius * 2 + "px";
        // If a custom color has been specified, set it as inline style. If no color is
        // set, the default color will be applied through the ripple theme styles.
        if (config.color != null) {
            ripple.style.backgroundColor = config.color;
        }
        ripple.style.transitionDuration = duration + "ms";
        this._containerElement.appendChild(ripple);
        // By default the browser does not recalculate the styles of dynamically created
        // ripple elements. This is critical because then the `scale` would not animate properly.
        enforceStyleRecalculation(ripple);
        ripple.style.transform = 'scale(1)';
        // Exposed reference to the ripple that will be returned.
        var rippleRef = new RippleRef(this, ripple, config);
        rippleRef.state = 0 /* FADING_IN */;
        // Add the ripple reference to the list of all active ripples.
        this._activeRipples.add(rippleRef);
        if (!config.persistent) {
            this._mostRecentTransientRipple = rippleRef;
        }
        // Wait for the ripple element to be completely faded in.
        // Once it's faded in, the ripple can be hidden immediately if the mouse is released.
        this._runTimeoutOutsideZone(function () {
            var isMostRecentTransientRipple = rippleRef === _this._mostRecentTransientRipple;
            rippleRef.state = 1 /* VISIBLE */;
            // When the timer runs out while the user has kept their pointer down, we want to
            // keep only the persistent ripples and the latest transient ripple. We do this,
            // because we don't want stacked transient ripples to appear after their enter
            // animation has finished.
            if (!config.persistent && (!isMostRecentTransientRipple || !_this._isPointerDown)) {
                rippleRef.fadeOut();
            }
        }, duration);
        return rippleRef;
    };
    /** Fades out a ripple reference. */
    RippleRenderer.prototype.fadeOutRipple = function (rippleRef) {
        var wasActive = this._activeRipples.delete(rippleRef);
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
        var rippleEl = rippleRef.element;
        var animationConfig = __assign(__assign({}, defaultRippleAnimationConfig), rippleRef.config.animation);
        rippleEl.style.transitionDuration = animationConfig.exitDuration + "ms";
        rippleEl.style.opacity = '0';
        rippleRef.state = 2 /* FADING_OUT */;
        // Once the ripple faded out, the ripple can be safely removed from the DOM.
        this._runTimeoutOutsideZone(function () {
            rippleRef.state = 3 /* HIDDEN */;
            rippleEl.parentNode.removeChild(rippleEl);
        }, animationConfig.exitDuration);
    };
    /** Fades out all currently active ripples. */
    RippleRenderer.prototype.fadeOutAll = function () {
        this._activeRipples.forEach(function (ripple) { return ripple.fadeOut(); });
    };
    /** Sets up the trigger event listeners */
    RippleRenderer.prototype.setupTriggerEvents = function (elementOrElementRef) {
        var _this = this;
        var element = coerceElement(elementOrElementRef);
        if (!element || element === this._triggerElement) {
            return;
        }
        // Remove all previously registered event listeners from the trigger element.
        this._removeTriggerEvents();
        this._ngZone.runOutsideAngular(function () {
            _this._triggerEvents.forEach(function (fn, type) {
                element.addEventListener(type, fn, passiveEventOptions);
            });
        });
        this._triggerElement = element;
    };
    /** Runs a timeout outside of the Angular zone to avoid triggering the change detection. */
    RippleRenderer.prototype._runTimeoutOutsideZone = function (fn, delay) {
        if (delay === void 0) { delay = 0; }
        this._ngZone.runOutsideAngular(function () { return setTimeout(fn, delay); });
    };
    /** Removes previously registered event listeners from the trigger element. */
    RippleRenderer.prototype._removeTriggerEvents = function () {
        var _this = this;
        if (this._triggerElement) {
            this._triggerEvents.forEach(function (fn, type) {
                _this._triggerElement.removeEventListener(type, fn, passiveEventOptions);
            });
        }
    };
    return RippleRenderer;
}());
export { RippleRenderer };
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
    var distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    var distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS1yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBUUEsT0FBTyxFQUFXLCtCQUErQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDaEYsT0FBTyxFQUFDLCtCQUErQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDbEUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3BELE9BQU8sRUFBQyxTQUFTLEVBQWMsTUFBTSxjQUFjLENBQUM7QUFrQ3BEOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxJQUFNLDRCQUE0QixHQUFHO0lBQzFDLGFBQWEsRUFBRSxHQUFHO0lBQ2xCLFlBQVksRUFBRSxHQUFHO0NBQ2xCLENBQUM7QUFFRjs7O0dBR0c7QUFDSCxJQUFNLHdCQUF3QixHQUFHLEdBQUcsQ0FBQztBQUVyQywyRkFBMkY7QUFDM0YsSUFBTSxtQkFBbUIsR0FBRywrQkFBK0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBRTdFOzs7Ozs7R0FNRztBQUNIO0lBNEJFLHdCQUFvQixPQUFxQixFQUNyQixPQUFlLEVBQ3ZCLG1CQUEwRCxFQUMxRCxRQUFrQjtRQUg5QixpQkFtQkM7UUFuQm1CLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFDckIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQXRCbkMsb0RBQW9EO1FBQzVDLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBRS9CLHNEQUFzRDtRQUM5QyxtQkFBYyxHQUFHLElBQUksR0FBRyxFQUFlLENBQUM7UUFFaEQsaURBQWlEO1FBQ3pDLG1CQUFjLEdBQUcsSUFBSSxHQUFHLEVBQWEsQ0FBQztRQXdLOUMsK0VBQStFO1FBQ3ZFLGlCQUFZLEdBQUcsVUFBQyxLQUFpQjtZQUN2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KiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0VsZW1lbnRSZWYsIE5nWm9uZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsYXRmb3JtLCBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtpc0Zha2VNb3VzZWRvd25Gcm9tU2NyZWVuUmVhZGVyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge2NvZXJjZUVsZW1lbnR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1JpcHBsZVJlZiwgUmlwcGxlU3RhdGV9IGZyb20gJy4vcmlwcGxlLXJlZic7XG5cbmV4cG9ydCB0eXBlIFJpcHBsZUNvbmZpZyA9IHtcbiAgY29sb3I/OiBzdHJpbmc7XG4gIGNlbnRlcmVkPzogYm9vbGVhbjtcbiAgcmFkaXVzPzogbnVtYmVyO1xuICBwZXJzaXN0ZW50PzogYm9vbGVhbjtcbiAgYW5pbWF0aW9uPzogUmlwcGxlQW5pbWF0aW9uQ29uZmlnO1xuICB0ZXJtaW5hdGVPblBvaW50ZXJVcD86IGJvb2xlYW47XG59O1xuXG4vKipcbiAqIEludGVyZmFjZSB0aGF0IGRlc2NyaWJlcyB0aGUgY29uZmlndXJhdGlvbiBmb3IgdGhlIGFuaW1hdGlvbiBvZiBhIHJpcHBsZS5cbiAqIFRoZXJlIGFyZSB0d28gYW5pbWF0aW9uIHBoYXNlcyB3aXRoIGRpZmZlcmVudCBkdXJhdGlvbnMgZm9yIHRoZSByaXBwbGVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJpcHBsZUFuaW1hdGlvbkNvbmZpZyB7XG4gIC8qKiBEdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSBlbnRlciBhbmltYXRpb24gKGV4cGFuc2lvbiBmcm9tIHBvaW50IG9mIGNvbnRhY3QpLiAqL1xuICBlbnRlckR1cmF0aW9uPzogbnVtYmVyO1xuICAvKiogRHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzIGZvciB0aGUgZXhpdCBhbmltYXRpb24gKGZhZGUtb3V0KS4gKi9cbiAgZXhpdER1cmF0aW9uPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSB0aGF0IGRlc2NyaWJlcyB0aGUgdGFyZ2V0IGZvciBsYXVuY2hpbmcgcmlwcGxlcy5cbiAqIEl0IGRlZmluZXMgdGhlIHJpcHBsZSBjb25maWd1cmF0aW9uIGFuZCBkaXNhYmxlZCBzdGF0ZSBmb3IgaW50ZXJhY3Rpb24gcmlwcGxlcy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSaXBwbGVUYXJnZXQge1xuICAvKiogQ29uZmlndXJhdGlvbiBmb3IgcmlwcGxlcyB0aGF0IGFyZSBsYXVuY2hlZCBvbiBwb2ludGVyIGRvd24uICovXG4gIHJpcHBsZUNvbmZpZzogUmlwcGxlQ29uZmlnO1xuICAvKiogV2hldGhlciByaXBwbGVzIG9uIHBvaW50ZXIgZG93biBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIHJpcHBsZURpc2FibGVkOiBib29sZWFuO1xufVxuXG4vKipcbiAqIERlZmF1bHQgcmlwcGxlIGFuaW1hdGlvbiBjb25maWd1cmF0aW9uIGZvciByaXBwbGVzIHdpdGhvdXQgYW4gZXhwbGljaXRcbiAqIGFuaW1hdGlvbiBjb25maWcgc3BlY2lmaWVkLlxuICovXG5leHBvcnQgY29uc3QgZGVmYXVsdFJpcHBsZUFuaW1hdGlvbkNvbmZpZyA9IHtcbiAgZW50ZXJEdXJhdGlvbjogNDUwLFxuICBleGl0RHVyYXRpb246IDQwMFxufTtcblxuLyoqXG4gKiBUaW1lb3V0IGZvciBpZ25vcmluZyBtb3VzZSBldmVudHMuIE1vdXNlIGV2ZW50cyB3aWxsIGJlIHRlbXBvcmFyeSBpZ25vcmVkIGFmdGVyIHRvdWNoXG4gKiBldmVudHMgdG8gYXZvaWQgc3ludGhldGljIG1vdXNlIGV2ZW50cy5cbiAqL1xuY29uc3QgaWdub3JlTW91c2VFdmVudHNUaW1lb3V0ID0gODAwO1xuXG4vKiogT3B0aW9ucyB0aGF0IGFwcGx5IHRvIGFsbCB0aGUgZXZlbnQgbGlzdGVuZXJzIHRoYXQgYXJlIGJvdW5kIGJ5IHRoZSByaXBwbGUgcmVuZGVyZXIuICovXG5jb25zdCBwYXNzaXZlRXZlbnRPcHRpb25zID0gbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyh7cGFzc2l2ZTogdHJ1ZX0pO1xuXG4vKipcbiAqIEhlbHBlciBzZXJ2aWNlIHRoYXQgcGVyZm9ybXMgRE9NIG1hbmlwdWxhdGlvbnMuIE5vdCBpbnRlbmRlZCB0byBiZSB1c2VkIG91dHNpZGUgdGhpcyBtb2R1bGUuXG4gKiBUaGUgY29uc3RydWN0b3IgdGFrZXMgYSByZWZlcmVuY2UgdG8gdGhlIHJpcHBsZSBkaXJlY3RpdmUncyBob3N0IGVsZW1lbnQgYW5kIGEgbWFwIG9mIERPTVxuICogZXZlbnQgaGFuZGxlcnMgdG8gYmUgaW5zdGFsbGVkIG9uIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcnMgcmlwcGxlIGFuaW1hdGlvbnMuXG4gKiBUaGlzIHdpbGwgZXZlbnR1YWxseSBiZWNvbWUgYSBjdXN0b20gcmVuZGVyZXIgb25jZSBBbmd1bGFyIHN1cHBvcnQgZXhpc3RzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgUmlwcGxlUmVuZGVyZXIge1xuICAvKiogRWxlbWVudCB3aGVyZSB0aGUgcmlwcGxlcyBhcmUgYmVpbmcgYWRkZWQgdG8uICovXG4gIHByaXZhdGUgX2NvbnRhaW5lckVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBFbGVtZW50IHdoaWNoIHRyaWdnZXJzIHRoZSByaXBwbGUgZWxlbWVudHMgb24gbW91c2UgZXZlbnRzLiAqL1xuICBwcml2YXRlIF90cmlnZ2VyRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBwb2ludGVyIGlzIGN1cnJlbnRseSBkb3duIG9yIG5vdC4gKi9cbiAgcHJpdmF0ZSBfaXNQb2ludGVyRG93biA9IGZhbHNlO1xuXG4gIC8qKiBFdmVudHMgdG8gYmUgcmVnaXN0ZXJlZCBvbiB0aGUgdHJpZ2dlciBlbGVtZW50LiAqL1xuICBwcml2YXRlIF90cmlnZ2VyRXZlbnRzID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcblxuICAvKiogU2V0IG9mIGN1cnJlbnRseSBhY3RpdmUgcmlwcGxlIHJlZmVyZW5jZXMuICovXG4gIHByaXZhdGUgX2FjdGl2ZVJpcHBsZXMgPSBuZXcgU2V0PFJpcHBsZVJlZj4oKTtcblxuICAvKiogTGF0ZXN0IG5vbi1wZXJzaXN0ZW50IHJpcHBsZSB0aGF0IHdhcyB0cmlnZ2VyZWQuICovXG4gIHByaXZhdGUgX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGU6IFJpcHBsZVJlZiB8IG51bGw7XG5cbiAgLyoqIFRpbWUgaW4gbWlsbGlzZWNvbmRzIHdoZW4gdGhlIGxhc3QgdG91Y2hzdGFydCBldmVudCBoYXBwZW5lZC4gKi9cbiAgcHJpdmF0ZSBfbGFzdFRvdWNoU3RhcnRFdmVudDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBDYWNoZWQgZGltZW5zaW9ucyBvZiB0aGUgcmlwcGxlIGNvbnRhaW5lci4gU2V0IHdoZW4gdGhlIGZpcnN0XG4gICAqIHJpcHBsZSBpcyBzaG93biBhbmQgY2xlYXJlZCBvbmNlIG5vIG1vcmUgcmlwcGxlcyBhcmUgdmlzaWJsZS5cbiAgICovXG4gIHByaXZhdGUgX2NvbnRhaW5lclJlY3Q6IENsaWVudFJlY3QgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3RhcmdldDogUmlwcGxlVGFyZ2V0LFxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgZWxlbWVudE9yRWxlbWVudFJlZjogSFRNTEVsZW1lbnQgfCBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcGxhdGZvcm06IFBsYXRmb3JtKSB7XG5cbiAgICAvLyBPbmx5IGRvIGFueXRoaW5nIGlmIHdlJ3JlIG9uIHRoZSBicm93c2VyLlxuICAgIGlmIChwbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lckVsZW1lbnQgPSBjb2VyY2VFbGVtZW50KGVsZW1lbnRPckVsZW1lbnRSZWYpO1xuXG4gICAgICAvLyBTcGVjaWZ5IGV2ZW50cyB3aGljaCBuZWVkIHRvIGJlIHJlZ2lzdGVyZWQgb24gdGhlIHRyaWdnZXIuXG4gICAgICB0aGlzLl90cmlnZ2VyRXZlbnRzXG4gICAgICAgIC5zZXQoJ21vdXNlZG93bicsIHRoaXMuX29uTW91c2Vkb3duKVxuICAgICAgICAuc2V0KCdtb3VzZXVwJywgdGhpcy5fb25Qb2ludGVyVXApXG4gICAgICAgIC5zZXQoJ21vdXNlbGVhdmUnLCB0aGlzLl9vblBvaW50ZXJVcClcblxuICAgICAgICAuc2V0KCd0b3VjaHN0YXJ0JywgdGhpcy5fb25Ub3VjaFN0YXJ0KVxuICAgICAgICAuc2V0KCd0b3VjaGVuZCcsIHRoaXMuX29uUG9pbnRlclVwKVxuICAgICAgICAuc2V0KCd0b3VjaGNhbmNlbCcsIHRoaXMuX29uUG9pbnRlclVwKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmFkZXMgaW4gYSByaXBwbGUgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzLlxuICAgKiBAcGFyYW0geCBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFggYXhpcyBhdCB3aGljaCB0byBzdGFydCB0aGUgcmlwcGxlLlxuICAgKiBAcGFyYW0geSBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFkgYXhpcyBhdCB3aGljaCB0byBzdGFydCB0aGUgcmlwcGxlLlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIHJpcHBsZSBvcHRpb25zLlxuICAgKi9cbiAgZmFkZUluUmlwcGxlKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25maWc6IFJpcHBsZUNvbmZpZyA9IHt9KTogUmlwcGxlUmVmIHtcbiAgICBjb25zdCBjb250YWluZXJSZWN0ID0gdGhpcy5fY29udGFpbmVyUmVjdCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lclJlY3QgfHwgdGhpcy5fY29udGFpbmVyRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBhbmltYXRpb25Db25maWcgPSB7Li4uZGVmYXVsdFJpcHBsZUFuaW1hdGlvbkNvbmZpZywgLi4uY29uZmlnLmFuaW1hdGlvbn07XG5cbiAgICBpZiAoY29uZmlnLmNlbnRlcmVkKSB7XG4gICAgICB4ID0gY29udGFpbmVyUmVjdC5sZWZ0ICsgY29udGFpbmVyUmVjdC53aWR0aCAvIDI7XG4gICAgICB5ID0gY29udGFpbmVyUmVjdC50b3AgKyBjb250YWluZXJSZWN0LmhlaWdodCAvIDI7XG4gICAgfVxuXG4gICAgY29uc3QgcmFkaXVzID0gY29uZmlnLnJhZGl1cyB8fCBkaXN0YW5jZVRvRnVydGhlc3RDb3JuZXIoeCwgeSwgY29udGFpbmVyUmVjdCk7XG4gICAgY29uc3Qgb2Zmc2V0WCA9IHggLSBjb250YWluZXJSZWN0LmxlZnQ7XG4gICAgY29uc3Qgb2Zmc2V0WSA9IHkgLSBjb250YWluZXJSZWN0LnRvcDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IGFuaW1hdGlvbkNvbmZpZy5lbnRlckR1cmF0aW9uO1xuXG4gICAgY29uc3QgcmlwcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcmlwcGxlLmNsYXNzTGlzdC5hZGQoJ21hdC1yaXBwbGUtZWxlbWVudCcpO1xuXG4gICAgcmlwcGxlLnN0eWxlLmxlZnQgPSBgJHtvZmZzZXRYIC0gcmFkaXVzfXB4YDtcbiAgICByaXBwbGUuc3R5bGUudG9wID0gYCR7b2Zmc2V0WSAtIHJhZGl1c31weGA7XG4gICAgcmlwcGxlLnN0eWxlLmhlaWdodCA9IGAke3JhZGl1cyAqIDJ9cHhgO1xuICAgIHJpcHBsZS5zdHlsZS53aWR0aCA9IGAke3JhZGl1cyAqIDJ9cHhgO1xuXG4gICAgLy8gSWYgYSBjdXN0b20gY29sb3IgaGFzIGJlZW4gc3BlY2lmaWVkLCBzZXQgaXQgYXMgaW5saW5lIHN0eWxlLiBJZiBubyBjb2xvciBpc1xuICAgIC8vIHNldCwgdGhlIGRlZmF1bHQgY29sb3Igd2lsbCBiZSBhcHBsaWVkIHRocm91Z2ggdGhlIHJpcHBsZSB0aGVtZSBzdHlsZXMuXG4gICAgaWYgKGNvbmZpZy5jb2xvciAhPSBudWxsKSB7XG4gICAgICByaXBwbGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29uZmlnLmNvbG9yO1xuICAgIH1cblxuICAgIHJpcHBsZS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG5cbiAgICB0aGlzLl9jb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKHJpcHBsZSk7XG5cbiAgICAvLyBCeSBkZWZhdWx0IHRoZSBicm93c2VyIGRvZXMgbm90IHJlY2FsY3VsYXRlIHRoZSBzdHlsZXMgb2YgZHluYW1pY2FsbHkgY3JlYXRlZFxuICAgIC8vIHJpcHBsZSBlbGVtZW50cy4gVGhpcyBpcyBjcml0aWNhbCBiZWNhdXNlIHRoZW4gdGhlIGBzY2FsZWAgd291bGQgbm90IGFuaW1hdGUgcHJvcGVybHkuXG4gICAgZW5mb3JjZVN0eWxlUmVjYWxjdWxhdGlvbihyaXBwbGUpO1xuXG4gICAgcmlwcGxlLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgxKSc7XG5cbiAgICAvLyBFeHBvc2VkIHJlZmVyZW5jZSB0byB0aGUgcmlwcGxlIHRoYXQgd2lsbCBiZSByZXR1cm5lZC5cbiAgICBjb25zdCByaXBwbGVSZWYgPSBuZXcgUmlwcGxlUmVmKHRoaXMsIHJpcHBsZSwgY29uZmlnKTtcblxuICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLkZBRElOR19JTjtcblxuICAgIC8vIEFkZCB0aGUgcmlwcGxlIHJlZmVyZW5jZSB0byB0aGUgbGlzdCBvZiBhbGwgYWN0aXZlIHJpcHBsZXMuXG4gICAgdGhpcy5fYWN0aXZlUmlwcGxlcy5hZGQocmlwcGxlUmVmKTtcblxuICAgIGlmICghY29uZmlnLnBlcnNpc3RlbnQpIHtcbiAgICAgIHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgPSByaXBwbGVSZWY7XG4gICAgfVxuXG4gICAgLy8gV2FpdCBmb3IgdGhlIHJpcHBsZSBlbGVtZW50IHRvIGJlIGNvbXBsZXRlbHkgZmFkZWQgaW4uXG4gICAgLy8gT25jZSBpdCdzIGZhZGVkIGluLCB0aGUgcmlwcGxlIGNhbiBiZSBoaWRkZW4gaW1tZWRpYXRlbHkgaWYgdGhlIG1vdXNlIGlzIHJlbGVhc2VkLlxuICAgIHRoaXMuX3J1blRpbWVvdXRPdXRzaWRlWm9uZSgoKSA9PiB7XG4gICAgICBjb25zdCBpc01vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgPSByaXBwbGVSZWYgPT09IHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGU7XG5cbiAgICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLlZJU0lCTEU7XG5cbiAgICAgIC8vIFdoZW4gdGhlIHRpbWVyIHJ1bnMgb3V0IHdoaWxlIHRoZSB1c2VyIGhhcyBrZXB0IHRoZWlyIHBvaW50ZXIgZG93biwgd2Ugd2FudCB0b1xuICAgICAgLy8ga2VlcCBvbmx5IHRoZSBwZXJzaXN0ZW50IHJpcHBsZXMgYW5kIHRoZSBsYXRlc3QgdHJhbnNpZW50IHJpcHBsZS4gV2UgZG8gdGhpcyxcbiAgICAgIC8vIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCBzdGFja2VkIHRyYW5zaWVudCByaXBwbGVzIHRvIGFwcGVhciBhZnRlciB0aGVpciBlbnRlclxuICAgICAgLy8gYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC5cbiAgICAgIGlmICghY29uZmlnLnBlcnNpc3RlbnQgJiYgKCFpc01vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgfHwgIXRoaXMuX2lzUG9pbnRlckRvd24pKSB7XG4gICAgICAgIHJpcHBsZVJlZi5mYWRlT3V0KCk7XG4gICAgICB9XG4gICAgfSwgZHVyYXRpb24pO1xuXG4gICAgcmV0dXJuIHJpcHBsZVJlZjtcbiAgfVxuXG4gIC8qKiBGYWRlcyBvdXQgYSByaXBwbGUgcmVmZXJlbmNlLiAqL1xuICBmYWRlT3V0UmlwcGxlKHJpcHBsZVJlZjogUmlwcGxlUmVmKSB7XG4gICAgY29uc3Qgd2FzQWN0aXZlID0gdGhpcy5fYWN0aXZlUmlwcGxlcy5kZWxldGUocmlwcGxlUmVmKTtcblxuICAgIGlmIChyaXBwbGVSZWYgPT09IHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUpIHtcbiAgICAgIHRoaXMuX21vc3RSZWNlbnRUcmFuc2llbnRSaXBwbGUgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIENsZWFyIG91dCB0aGUgY2FjaGVkIGJvdW5kaW5nIHJlY3QgaWYgd2UgaGF2ZSBubyBtb3JlIHJpcHBsZXMuXG4gICAgaWYgKCF0aGlzLl9hY3RpdmVSaXBwbGVzLnNpemUpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lclJlY3QgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIEZvciByaXBwbGVzIHRoYXQgYXJlIG5vdCBhY3RpdmUgYW55bW9yZSwgZG9uJ3QgcmUtcnVuIHRoZSBmYWRlLW91dCBhbmltYXRpb24uXG4gICAgaWYgKCF3YXNBY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByaXBwbGVFbCA9IHJpcHBsZVJlZi5lbGVtZW50O1xuICAgIGNvbnN0IGFuaW1hdGlvbkNvbmZpZyA9IHsuLi5kZWZhdWx0UmlwcGxlQW5pbWF0aW9uQ29uZmlnLCAuLi5yaXBwbGVSZWYuY29uZmlnLmFuaW1hdGlvbn07XG5cbiAgICByaXBwbGVFbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHthbmltYXRpb25Db25maWcuZXhpdER1cmF0aW9ufW1zYDtcbiAgICByaXBwbGVFbC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLkZBRElOR19PVVQ7XG5cbiAgICAvLyBPbmNlIHRoZSByaXBwbGUgZmFkZWQgb3V0LCB0aGUgcmlwcGxlIGNhbiBiZSBzYWZlbHkgcmVtb3ZlZCBmcm9tIHRoZSBET00uXG4gICAgdGhpcy5fcnVuVGltZW91dE91dHNpZGVab25lKCgpID0+IHtcbiAgICAgIHJpcHBsZVJlZi5zdGF0ZSA9IFJpcHBsZVN0YXRlLkhJRERFTjtcbiAgICAgIHJpcHBsZUVsLnBhcmVudE5vZGUhLnJlbW92ZUNoaWxkKHJpcHBsZUVsKTtcbiAgICB9LCBhbmltYXRpb25Db25maWcuZXhpdER1cmF0aW9uKTtcbiAgfVxuXG4gIC8qKiBGYWRlcyBvdXQgYWxsIGN1cnJlbnRseSBhY3RpdmUgcmlwcGxlcy4gKi9cbiAgZmFkZU91dEFsbCgpIHtcbiAgICB0aGlzLl9hY3RpdmVSaXBwbGVzLmZvckVhY2gocmlwcGxlID0+IHJpcHBsZS5mYWRlT3V0KCkpO1xuICB9XG5cbiAgLyoqIFNldHMgdXAgdGhlIHRyaWdnZXIgZXZlbnQgbGlzdGVuZXJzICovXG4gIHNldHVwVHJpZ2dlckV2ZW50cyhlbGVtZW50T3JFbGVtZW50UmVmOiBIVE1MRWxlbWVudCB8IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGNvZXJjZUVsZW1lbnQoZWxlbWVudE9yRWxlbWVudFJlZik7XG5cbiAgICBpZiAoIWVsZW1lbnQgfHwgZWxlbWVudCA9PT0gdGhpcy5fdHJpZ2dlckVsZW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYWxsIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdHJpZ2dlciBlbGVtZW50LlxuICAgIHRoaXMuX3JlbW92ZVRyaWdnZXJFdmVudHMoKTtcblxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl90cmlnZ2VyRXZlbnRzLmZvckVhY2goKGZuLCB0eXBlKSA9PiB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmbiwgcGFzc2l2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3RyaWdnZXJFbGVtZW50ID0gZWxlbWVudDtcbiAgfVxuXG4gIC8qKiBGdW5jdGlvbiBiZWluZyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHRyaWdnZXIgaXMgYmVpbmcgcHJlc3NlZCB1c2luZyBtb3VzZS4gKi9cbiAgcHJpdmF0ZSBfb25Nb3VzZWRvd24gPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAvLyBTY3JlZW4gcmVhZGVycyB3aWxsIGZpcmUgZmFrZSBtb3VzZSBldmVudHMgZm9yIHNwYWNlL2VudGVyLiBTa2lwIGxhdW5jaGluZyBhXG4gICAgLy8gcmlwcGxlIGluIHRoaXMgY2FzZSBmb3IgY29uc2lzdGVuY3kgd2l0aCB0aGUgbm9uLXNjcmVlbi1yZWFkZXIgZXhwZXJpZW5jZS5cbiAgICBjb25zdCBpc0Zha2VNb3VzZWRvd24gPSBpc0Zha2VNb3VzZWRvd25Gcm9tU2NyZWVuUmVhZGVyKGV2ZW50KTtcbiAgICBjb25zdCBpc1N5bnRoZXRpY0V2ZW50ID0gdGhpcy5fbGFzdFRvdWNoU3RhcnRFdmVudCAmJlxuICAgICAgICBEYXRlLm5vdygpIDwgdGhpcy5fbGFzdFRvdWNoU3RhcnRFdmVudCArIGlnbm9yZU1vdXNlRXZlbnRzVGltZW91dDtcblxuICAgIGlmICghdGhpcy5fdGFyZ2V0LnJpcHBsZURpc2FibGVkICYmICFpc0Zha2VNb3VzZWRvd24gJiYgIWlzU3ludGhldGljRXZlbnQpIHtcbiAgICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSB0cnVlO1xuICAgICAgdGhpcy5mYWRlSW5SaXBwbGUoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSwgdGhpcy5fdGFyZ2V0LnJpcHBsZUNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZ1bmN0aW9uIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgdHJpZ2dlciBpcyBiZWluZyBwcmVzc2VkIHVzaW5nIHRvdWNoLiAqL1xuICBwcml2YXRlIF9vblRvdWNoU3RhcnQgPSAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICBpZiAoIXRoaXMuX3RhcmdldC5yaXBwbGVEaXNhYmxlZCkge1xuICAgICAgLy8gU29tZSBicm93c2VycyBmaXJlIG1vdXNlIGV2ZW50cyBhZnRlciBhIGB0b3VjaHN0YXJ0YCBldmVudC4gVGhvc2Ugc3ludGhldGljIG1vdXNlXG4gICAgICAvLyBldmVudHMgd2lsbCBsYXVuY2ggYSBzZWNvbmQgcmlwcGxlIGlmIHdlIGRvbid0IGlnbm9yZSBtb3VzZSBldmVudHMgZm9yIGEgc3BlY2lmaWNcbiAgICAgIC8vIHRpbWUgYWZ0ZXIgYSB0b3VjaHN0YXJ0IGV2ZW50LlxuICAgICAgdGhpcy5fbGFzdFRvdWNoU3RhcnRFdmVudCA9IERhdGUubm93KCk7XG4gICAgICB0aGlzLl9pc1BvaW50ZXJEb3duID0gdHJ1ZTtcblxuICAgICAgLy8gVXNlIGBjaGFuZ2VkVG91Y2hlc2Agc28gd2Ugc2tpcCBhbnkgdG91Y2hlcyB3aGVyZSB0aGUgdXNlciBwdXRcbiAgICAgIC8vIHRoZWlyIGZpbmdlciBkb3duLCBidXQgdXNlZCBhbm90aGVyIGZpbmdlciB0byB0YXAgdGhlIGVsZW1lbnQgYWdhaW4uXG4gICAgICBjb25zdCB0b3VjaGVzID0gZXZlbnQuY2hhbmdlZFRvdWNoZXM7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmZhZGVJblJpcHBsZSh0b3VjaGVzW2ldLmNsaWVudFgsIHRvdWNoZXNbaV0uY2xpZW50WSwgdGhpcy5fdGFyZ2V0LnJpcHBsZUNvbmZpZyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEZ1bmN0aW9uIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgdHJpZ2dlciBpcyBiZWluZyByZWxlYXNlZC4gKi9cbiAgcHJpdmF0ZSBfb25Qb2ludGVyVXAgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLl9pc1BvaW50ZXJEb3duKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5faXNQb2ludGVyRG93biA9IGZhbHNlO1xuXG4gICAgLy8gRmFkZS1vdXQgYWxsIHJpcHBsZXMgdGhhdCBhcmUgdmlzaWJsZSBhbmQgbm90IHBlcnNpc3RlbnQuXG4gICAgdGhpcy5fYWN0aXZlUmlwcGxlcy5mb3JFYWNoKHJpcHBsZSA9PiB7XG4gICAgICAvLyBCeSBkZWZhdWx0LCBvbmx5IHJpcHBsZXMgdGhhdCBhcmUgY29tcGxldGVseSB2aXNpYmxlIHdpbGwgZmFkZSBvdXQgb24gcG9pbnRlciByZWxlYXNlLlxuICAgICAgLy8gSWYgdGhlIGB0ZXJtaW5hdGVPblBvaW50ZXJVcGAgb3B0aW9uIGlzIHNldCwgcmlwcGxlcyB0aGF0IHN0aWxsIGZhZGUgaW4gd2lsbCBhbHNvIGZhZGUgb3V0LlxuICAgICAgY29uc3QgaXNWaXNpYmxlID0gcmlwcGxlLnN0YXRlID09PSBSaXBwbGVTdGF0ZS5WSVNJQkxFIHx8XG4gICAgICAgIHJpcHBsZS5jb25maWcudGVybWluYXRlT25Qb2ludGVyVXAgJiYgcmlwcGxlLnN0YXRlID09PSBSaXBwbGVTdGF0ZS5GQURJTkdfSU47XG5cbiAgICAgIGlmICghcmlwcGxlLmNvbmZpZy5wZXJzaXN0ZW50ICYmIGlzVmlzaWJsZSkge1xuICAgICAgICByaXBwbGUuZmFkZU91dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJ1bnMgYSB0aW1lb3V0IG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIgem9uZSB0byBhdm9pZCB0cmlnZ2VyaW5nIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uLiAqL1xuICBwcml2YXRlIF9ydW5UaW1lb3V0T3V0c2lkZVpvbmUoZm46IEZ1bmN0aW9uLCBkZWxheSA9IDApIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gc2V0VGltZW91dChmbiwgZGVsYXkpKTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdHJpZ2dlciBlbGVtZW50LiAqL1xuICBfcmVtb3ZlVHJpZ2dlckV2ZW50cygpIHtcbiAgICBpZiAodGhpcy5fdHJpZ2dlckVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX3RyaWdnZXJFdmVudHMuZm9yRWFjaCgoZm4sIHR5cGUpID0+IHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlckVsZW1lbnQhLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgZm4sIHBhc3NpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKiBFbmZvcmNlcyBhIHN0eWxlIHJlY2FsY3VsYXRpb24gb2YgYSBET00gZWxlbWVudCBieSBjb21wdXRpbmcgaXRzIHN0eWxlcy4gKi9cbmZ1bmN0aW9uIGVuZm9yY2VTdHlsZVJlY2FsY3VsYXRpb24oZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgLy8gRW5mb3JjZSBhIHN0eWxlIHJlY2FsY3VsYXRpb24gYnkgY2FsbGluZyBgZ2V0Q29tcHV0ZWRTdHlsZWAgYW5kIGFjY2Vzc2luZyBhbnkgcHJvcGVydHkuXG4gIC8vIENhbGxpbmcgYGdldFByb3BlcnR5VmFsdWVgIGlzIGltcG9ydGFudCB0byBsZXQgb3B0aW1pemVycyBrbm93IHRoYXQgdGhpcyBpcyBub3QgYSBub29wLlxuICAvLyBTZWU6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC81ZDUyZmIwODFiMzU3MGM4MWUzYVxuICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdvcGFjaXR5Jyk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgcG9pbnQgKHgsIHkpIHRvIHRoZSBmdXJ0aGVzdCBjb3JuZXIgb2YgYSByZWN0YW5nbGUuXG4gKi9cbmZ1bmN0aW9uIGRpc3RhbmNlVG9GdXJ0aGVzdENvcm5lcih4OiBudW1iZXIsIHk6IG51bWJlciwgcmVjdDogQ2xpZW50UmVjdCkge1xuICBjb25zdCBkaXN0WCA9IE1hdGgubWF4KE1hdGguYWJzKHggLSByZWN0LmxlZnQpLCBNYXRoLmFicyh4IC0gcmVjdC5yaWdodCkpO1xuICBjb25zdCBkaXN0WSA9IE1hdGgubWF4KE1hdGguYWJzKHkgLSByZWN0LnRvcCksIE1hdGguYWJzKHkgLSByZWN0LmJvdHRvbSkpO1xuICByZXR1cm4gTWF0aC5zcXJ0KGRpc3RYICogZGlzdFggKyBkaXN0WSAqIGRpc3RZKTtcbn1cbiJdfQ==