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
/** Events that signal that the pointer is down. */
var pointerDownEvents = ['mousedown', 'touchstart'];
/** Events that signal that the pointer is up. */
var pointerUpEvents = ['mouseup', 'mouseleave', 'touchend', 'touchcancel'];
/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple directive's host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 * This will eventually become a custom renderer once Angular support exists.
 * @docs-private
 */
var RippleRenderer = /** @class */ (function () {
    function RippleRenderer(_target, _ngZone, elementOrElementRef, platform) {
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
        var element = coerceElement(elementOrElementRef);
        if (!element || element === this._triggerElement) {
            return;
        }
        // Remove all previously registered event listeners from the trigger element.
        this._removeTriggerEvents();
        this._triggerElement = element;
        this._registerEvents(pointerDownEvents);
    };
    /**
     * Handles all registered events.
     * @docs-private
     */
    RippleRenderer.prototype.handleEvent = function (event) {
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
    };
    /** Function being called whenever the trigger is being pressed using mouse. */
    RippleRenderer.prototype._onMousedown = function (event) {
        // Screen readers will fire fake mouse events for space/enter. Skip launching a
        // ripple in this case for consistency with the non-screen-reader experience.
        var isFakeMousedown = isFakeMousedownFromScreenReader(event);
        var isSyntheticEvent = this._lastTouchStartEvent &&
            Date.now() < this._lastTouchStartEvent + ignoreMouseEventsTimeout;
        if (!this._target.rippleDisabled && !isFakeMousedown && !isSyntheticEvent) {
            this._isPointerDown = true;
            this.fadeInRipple(event.clientX, event.clientY, this._target.rippleConfig);
        }
    };
    /** Function being called whenever the trigger is being pressed using touch. */
    RippleRenderer.prototype._onTouchStart = function (event) {
        if (!this._target.rippleDisabled) {
            // Some browsers fire mouse events after a `touchstart` event. Those synthetic mouse
            // events will launch a second ripple if we don't ignore mouse events for a specific
            // time after a touchstart event.
            this._lastTouchStartEvent = Date.now();
            this._isPointerDown = true;
            // Use `changedTouches` so we skip any touches where the user put
            // their finger down, but used another finger to tap the element again.
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                this.fadeInRipple(touches[i].clientX, touches[i].clientY, this._target.rippleConfig);
            }
        }
    };
    /** Function being called whenever the trigger is being released. */
    RippleRenderer.prototype._onPointerUp = function () {
        if (!this._isPointerDown) {
            return;
        }
        this._isPointerDown = false;
        // Fade-out all ripples that are visible and not persistent.
        this._activeRipples.forEach(function (ripple) {
            // By default, only ripples that are completely visible will fade out on pointer release.
            // If the `terminateOnPointerUp` option is set, ripples that still fade in will also fade out.
            var isVisible = ripple.state === 1 /* VISIBLE */ ||
                ripple.config.terminateOnPointerUp && ripple.state === 0 /* FADING_IN */;
            if (!ripple.config.persistent && isVisible) {
                ripple.fadeOut();
            }
        });
    };
    /** Runs a timeout outside of the Angular zone to avoid triggering the change detection. */
    RippleRenderer.prototype._runTimeoutOutsideZone = function (fn, delay) {
        if (delay === void 0) { delay = 0; }
        this._ngZone.runOutsideAngular(function () { return setTimeout(fn, delay); });
    };
    /** Registers event listeners for a given list of events. */
    RippleRenderer.prototype._registerEvents = function (eventTypes) {
        var _this = this;
        this._ngZone.runOutsideAngular(function () {
            eventTypes.forEach(function (type) {
                _this._triggerElement.addEventListener(type, _this, passiveEventOptions);
            });
        });
    };
    /** Removes previously registered event listeners from the trigger element. */
    RippleRenderer.prototype._removeTriggerEvents = function () {
        var _this = this;
        if (this._triggerElement) {
            pointerDownEvents.forEach(function (type) {
                _this._triggerElement.removeEventListener(type, _this, passiveEventOptions);
            });
            if (this._pointerUpEventsRegistered) {
                pointerUpEvents.forEach(function (type) {
                    _this._triggerElement.removeEventListener(type, _this, passiveEventOptions);
                });
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS1yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBUUEsT0FBTyxFQUFXLCtCQUErQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDaEYsT0FBTyxFQUFDLCtCQUErQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDbEUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3BELE9BQU8sRUFBQyxTQUFTLEVBQWMsTUFBTSxjQUFjLENBQUM7QUFrQ3BEOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxJQUFNLDRCQUE0QixHQUFHO0lBQzFDLGFBQWEsRUFBRSxHQUFHO0lBQ2xCLFlBQVksRUFBRSxHQUFHO0NBQ2xCLENBQUM7QUFFRjs7O0dBR0c7QUFDSCxJQUFNLHdCQUF3QixHQUFHLEdBQUcsQ0FBQztBQUVyQywyRkFBMkY7QUFDM0YsSUFBTSxtQkFBbUIsR0FBRywrQkFBK0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBRTdFLG1EQUFtRDtBQUNuRCxJQUFNLGlCQUFpQixHQUFHLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRXRELGlEQUFpRDtBQUNqRCxJQUFNLGVBQWUsR0FBRyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBRTdFOzs7Ozs7R0FNRztBQUNIO0lBNEJFLHdCQUFvQixPQUFxQixFQUNyQixPQUFlLEVBQ3ZCLG1CQUEwRCxFQUMxRCxRQUFrQjtRQUhWLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFDckIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQXRCbkMsb0RBQW9EO1FBQzVDLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBRS9CLGlEQUFp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QVMsRUFBRSxJQUFnQjtJQUN0RSxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMxRSxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMxRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDbEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtFbGVtZW50UmVmLCBOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQbGF0Zm9ybSwgbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9uc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7aXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtjb2VyY2VFbGVtZW50fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtSaXBwbGVSZWYsIFJpcHBsZVN0YXRlfSBmcm9tICcuL3JpcHBsZS1yZWYnO1xuXG5leHBvcnQgdHlwZSBSaXBwbGVDb25maWcgPSB7XG4gIGNvbG9yPzogc3RyaW5nO1xuICBjZW50ZXJlZD86IGJvb2xlYW47XG4gIHJhZGl1cz86IG51bWJlcjtcbiAgcGVyc2lzdGVudD86IGJvb2xlYW47XG4gIGFuaW1hdGlvbj86IFJpcHBsZUFuaW1hdGlvbkNvbmZpZztcbiAgdGVybWluYXRlT25Qb2ludGVyVXA/OiBib29sZWFuO1xufTtcblxuLyoqXG4gKiBJbnRlcmZhY2UgdGhhdCBkZXNjcmliZXMgdGhlIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBhbmltYXRpb24gb2YgYSByaXBwbGUuXG4gKiBUaGVyZSBhcmUgdHdvIGFuaW1hdGlvbiBwaGFzZXMgd2l0aCBkaWZmZXJlbnQgZHVyYXRpb25zIGZvciB0aGUgcmlwcGxlcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSaXBwbGVBbmltYXRpb25Db25maWcge1xuICAvKiogRHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzIGZvciB0aGUgZW50ZXIgYW5pbWF0aW9uIChleHBhbnNpb24gZnJvbSBwb2ludCBvZiBjb250YWN0KS4gKi9cbiAgZW50ZXJEdXJhdGlvbj86IG51bWJlcjtcbiAgLyoqIER1cmF0aW9uIGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIGV4aXQgYW5pbWF0aW9uIChmYWRlLW91dCkuICovXG4gIGV4aXREdXJhdGlvbj86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgdGhhdCBkZXNjcmliZXMgdGhlIHRhcmdldCBmb3IgbGF1bmNoaW5nIHJpcHBsZXMuXG4gKiBJdCBkZWZpbmVzIHRoZSByaXBwbGUgY29uZmlndXJhdGlvbiBhbmQgZGlzYWJsZWQgc3RhdGUgZm9yIGludGVyYWN0aW9uIHJpcHBsZXMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmlwcGxlVGFyZ2V0IHtcbiAgLyoqIENvbmZpZ3VyYXRpb24gZm9yIHJpcHBsZXMgdGhhdCBhcmUgbGF1bmNoZWQgb24gcG9pbnRlciBkb3duLiAqL1xuICByaXBwbGVDb25maWc6IFJpcHBsZUNvbmZpZztcbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBvbiBwb2ludGVyIGRvd24gc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICByaXBwbGVEaXNhYmxlZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHJpcHBsZSBhbmltYXRpb24gY29uZmlndXJhdGlvbiBmb3IgcmlwcGxlcyB3aXRob3V0IGFuIGV4cGxpY2l0XG4gKiBhbmltYXRpb24gY29uZmlnIHNwZWNpZmllZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcgPSB7XG4gIGVudGVyRHVyYXRpb246IDQ1MCxcbiAgZXhpdER1cmF0aW9uOiA0MDBcbn07XG5cbi8qKlxuICogVGltZW91dCBmb3IgaWdub3JpbmcgbW91c2UgZXZlbnRzLiBNb3VzZSBldmVudHMgd2lsbCBiZSB0ZW1wb3JhcnkgaWdub3JlZCBhZnRlciB0b3VjaFxuICogZXZlbnRzIHRvIGF2b2lkIHN5bnRoZXRpYyBtb3VzZSBldmVudHMuXG4gKi9cbmNvbnN0IGlnbm9yZU1vdXNlRXZlbnRzVGltZW91dCA9IDgwMDtcblxuLyoqIE9wdGlvbnMgdGhhdCBhcHBseSB0byBhbGwgdGhlIGV2ZW50IGxpc3RlbmVycyB0aGF0IGFyZSBib3VuZCBieSB0aGUgcmlwcGxlIHJlbmRlcmVyLiAqL1xuY29uc3QgcGFzc2l2ZUV2ZW50T3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe3Bhc3NpdmU6IHRydWV9KTtcblxuLyoqIEV2ZW50cyB0aGF0IHNpZ25hbCB0aGF0IHRoZSBwb2ludGVyIGlzIGRvd24uICovXG5jb25zdCBwb2ludGVyRG93bkV2ZW50cyA9IFsnbW91c2Vkb3duJywgJ3RvdWNoc3RhcnQnXTtcblxuLyoqIEV2ZW50cyB0aGF0IHNpZ25hbCB0aGF0IHRoZSBwb2ludGVyIGlzIHVwLiAqL1xuY29uc3QgcG9pbnRlclVwRXZlbnRzID0gWydtb3VzZXVwJywgJ21vdXNlbGVhdmUnLCAndG91Y2hlbmQnLCAndG91Y2hjYW5jZWwnXTtcblxuLyoqXG4gKiBIZWxwZXIgc2VydmljZSB0aGF0IHBlcmZvcm1zIERPTSBtYW5pcHVsYXRpb25zLiBOb3QgaW50ZW5kZWQgdG8gYmUgdXNlZCBvdXRzaWRlIHRoaXMgbW9kdWxlLlxuICogVGhlIGNvbnN0cnVjdG9yIHRha2VzIGEgcmVmZXJlbmNlIHRvIHRoZSByaXBwbGUgZGlyZWN0aXZlJ3MgaG9zdCBlbGVtZW50IGFuZCBhIG1hcCBvZiBET01cbiAqIGV2ZW50IGhhbmRsZXJzIHRvIGJlIGluc3RhbGxlZCBvbiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJzIHJpcHBsZSBhbmltYXRpb25zLlxuICogVGhpcyB3aWxsIGV2ZW50dWFsbHkgYmVjb21lIGEgY3VzdG9tIHJlbmRlcmVyIG9uY2UgQW5ndWxhciBzdXBwb3J0IGV4aXN0cy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIFJpcHBsZVJlbmRlcmVyIGltcGxlbWVudHMgRXZlbnRMaXN0ZW5lck9iamVjdCB7XG4gIC8qKiBFbGVtZW50IHdoZXJlIHRoZSByaXBwbGVzIGFyZSBiZWluZyBhZGRlZCB0by4gKi9cbiAgcHJpdmF0ZSBfY29udGFpbmVyRWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIEVsZW1lbnQgd2hpY2ggdHJpZ2dlcnMgdGhlIHJpcHBsZSBlbGVtZW50cyBvbiBtb3VzZSBldmVudHMuICovXG4gIHByaXZhdGUgX3RyaWdnZXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHBvaW50ZXIgaXMgY3VycmVudGx5IGRvd24gb3Igbm90LiAqL1xuICBwcml2YXRlIF9pc1BvaW50ZXJEb3duID0gZmFsc2U7XG5cbiAgLyoqIFNldCBvZiBjdXJyZW50bHkgYWN0aXZlIHJpcHBsZSByZWZlcmVuY2VzLiAqL1xuICBwcml2YXRlIF9hY3RpdmVSaXBwbGVzID0gbmV3IFNldDxSaXBwbGVSZWY+KCk7XG5cbiAgLyoqIExhdGVzdCBub24tcGVyc2lzdGVudCByaXBwbGUgdGhhdCB3YXMgdHJpZ2dlcmVkLiAqL1xuICBwcml2YXRlIF9tb3N0UmVjZW50VHJhbnNpZW50UmlwcGxlOiBSaXBwbGVSZWYgfCBudWxsO1xuXG4gIC8qKiBUaW1lIGluIG1pbGxpc2Vjb25kcyB3aGVuIHRoZSBsYXN0IHRvdWNoc3RhcnQgZXZlbnQgaGFwcGVuZWQuICovXG4gIHByaXZhdGUgX2xhc3RUb3VjaFN0YXJ0RXZlbnQ6IG51bWJlcjtcblxuICAvKiogV2hldGhlciBwb2ludGVyLXVwIGV2ZW50IGxpc3RlbmVycyBoYXZlIGJlZW4gcmVnaXN0ZXJlZC4gKi9cbiAgcHJpdmF0ZSBfcG9pbnRlclVwRXZlbnRzUmVnaXN0ZXJlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBDYWNoZWQgZGltZW5zaW9ucyBvZiB0aGUgcmlwcGxlIGNvbnRhaW5lci4gU2V0IHdoZW4gdGhlIGZpcnN0XG4gICAqIHJpcHBsZSBpcyBzaG93biBhbmQgY2xlYXJlZCBvbmNlIG5vIG1vcmUgcmlwcGxlcyBhcmUgdmlzaWJsZS5cbiAgICovXG4gIHByaXZhdGUgX2NvbnRhaW5lclJlY3Q6IENsaWVudFJlY3QgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3RhcmdldDogUmlwcGxlVGFyZ2V0LFxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgZWxlbWVudE9yRWxlbWVudFJlZjogSFRNTEVsZW1lbnQgfCBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcGxhdGZvcm06IFBsYXRmb3JtKSB7XG5cbiAgICAvLyBPbmx5IGRvIGFueXRoaW5nIGlmIHdlJ3JlIG9uIHRoZSBicm93c2VyLlxuICAgIGlmIChwbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lckVsZW1lbnQgPSBjb2VyY2VFbGVtZW50KGVsZW1lbnRPckVsZW1lbnRSZWYpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGYWRlcyBpbiBhIHJpcHBsZSBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXMuXG4gICAqIEBwYXJhbSB4IENvb3JkaW5hdGUgd2l0aGluIHRoZSBlbGVtZW50LCBhbG9uZyB0aGUgWCBheGlzIGF0IHdoaWNoIHRvIHN0YXJ0IHRoZSByaXBwbGUuXG4gICAqIEBwYXJhbSB5IENvb3JkaW5hdGUgd2l0aGluIHRoZSBlbGVtZW50LCBhbG9uZyB0aGUgWSBheGlzIGF0IHdoaWNoIHRvIHN0YXJ0IHRoZSByaXBwbGUuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgcmlwcGxlIG9wdGlvbnMuXG4gICAqL1xuICBmYWRlSW5SaXBwbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbmZpZzogUmlwcGxlQ29uZmlnID0ge30pOiBSaXBwbGVSZWYge1xuICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSB0aGlzLl9jb250YWluZXJSZWN0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyUmVjdCB8fCB0aGlzLl9jb250YWluZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGFuaW1hdGlvbkNvbmZpZyA9IHsuLi5kZWZhdWx0UmlwcGxlQW5pbWF0aW9uQ29uZmlnLCAuLi5jb25maWcuYW5pbWF0aW9ufTtcblxuICAgIGlmIChjb25maWcuY2VudGVyZWQpIHtcbiAgICAgIHggPSBjb250YWluZXJSZWN0LmxlZnQgKyBjb250YWluZXJSZWN0LndpZHRoIC8gMjtcbiAgICAgIHkgPSBjb250YWluZXJSZWN0LnRvcCArIGNvbnRhaW5lclJlY3QuaGVpZ2h0IC8gMjtcbiAgICB9XG5cbiAgICBjb25zdCByYWRpdXMgPSBjb25maWcucmFkaXVzIHx8IGRpc3RhbmNlVG9GdXJ0aGVzdENvcm5lcih4LCB5LCBjb250YWluZXJSZWN0KTtcbiAgICBjb25zdCBvZmZzZXRYID0geCAtIGNvbnRhaW5lclJlY3QubGVmdDtcbiAgICBjb25zdCBvZmZzZXRZID0geSAtIGNvbnRhaW5lclJlY3QudG9wO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gYW5pbWF0aW9uQ29uZmlnLmVudGVyRHVyYXRpb247XG5cbiAgICBjb25zdCByaXBwbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByaXBwbGUuY2xhc3NMaXN0LmFkZCgnbWF0LXJpcHBsZS1lbGVtZW50Jyk7XG5cbiAgICByaXBwbGUuc3R5bGUubGVmdCA9IGAke29mZnNldFggLSByYWRpdXN9cHhgO1xuICAgIHJpcHBsZS5zdHlsZS50b3AgPSBgJHtvZmZzZXRZIC0gcmFkaXVzfXB4YDtcbiAgICByaXBwbGUuc3R5bGUuaGVpZ2h0ID0gYCR7cmFkaXVzICogMn1weGA7XG4gICAgcmlwcGxlLnN0eWxlLndpZHRoID0gYCR7cmFkaXVzICogMn1weGA7XG5cbiAgICAvLyBJZiBhIGN1c3RvbSBjb2xvciBoYXMgYmVlbiBzcGVjaWZpZWQsIHNldCBpdCBhcyBpbmxpbmUgc3R5bGUuIElmIG5vIGNvbG9yIGlzXG4gICAgLy8gc2V0LCB0aGUgZGVmYXVsdCBjb2xvciB3aWxsIGJlIGFwcGxpZWQgdGhyb3VnaCB0aGUgcmlwcGxlIHRoZW1lIHN0eWxlcy5cbiAgICBpZiAoY29uZmlnLmNvbG9yICE9IG51bGwpIHtcbiAgICAgIHJpcHBsZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb25maWcuY29sb3I7XG4gICAgfVxuXG4gICAgcmlwcGxlLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcblxuICAgIHRoaXMuX2NvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQocmlwcGxlKTtcblxuICAgIC8vIEJ5IGRlZmF1bHQgdGhlIGJyb3dzZXIgZG9lcyBub3QgcmVjYWxjdWxhdGUgdGhlIHN0eWxlcyBvZiBkeW5hbWljYWxseSBjcmVhdGVkXG4gICAgLy8gcmlwcGxlIGVsZW1lbnRzLiBUaGlzIGlzIGNyaXRpY2FsIGJlY2F1c2UgdGhlbiB0aGUgYHNjYWxlYCB3b3VsZCBub3QgYW5pbWF0ZSBwcm9wZXJseS5cbiAgICBlbmZvcmNlU3R5bGVSZWNhbGN1bGF0aW9uKHJpcHBsZSk7XG5cbiAgICByaXBwbGUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDEpJztcblxuICAgIC8vIEV4cG9zZWQgcmVmZXJlbmNlIHRvIHRoZSByaXBwbGUgdGhhdCB3aWxsIGJlIHJldHVybmVkLlxuICAgIGNvbnN0IHJpcHBsZVJlZiA9IG5ldyBSaXBwbGVSZWYodGhpcywgcmlwcGxlLCBjb25maWcpO1xuXG4gICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuRkFESU5HX0lOO1xuXG4gICAgLy8gQWRkIHRoZSByaXBwbGUgcmVmZXJlbmNlIHRvIHRoZSBsaXN0IG9mIGFsbCBhY3RpdmUgcmlwcGxlcy5cbiAgICB0aGlzLl9hY3RpdmVSaXBwbGVzLmFkZChyaXBwbGVSZWYpO1xuXG4gICAgaWYgKCFjb25maWcucGVyc2lzdGVudCkge1xuICAgICAgdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSA9IHJpcHBsZVJlZjtcbiAgICB9XG5cbiAgICAvLyBXYWl0IGZvciB0aGUgcmlwcGxlIGVsZW1lbnQgdG8gYmUgY29tcGxldGVseSBmYWRlZCBpbi5cbiAgICAvLyBPbmNlIGl0J3MgZmFkZWQgaW4sIHRoZSByaXBwbGUgY2FuIGJlIGhpZGRlbiBpbW1lZGlhdGVseSBpZiB0aGUgbW91c2UgaXMgcmVsZWFzZWQuXG4gICAgdGhpcy5fcnVuVGltZW91dE91dHNpZGVab25lKCgpID0+IHtcbiAgICAgIGNvbnN0IGlzTW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSA9IHJpcHBsZVJlZiA9PT0gdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZTtcblxuICAgICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuVklTSUJMRTtcblxuICAgICAgLy8gV2hlbiB0aGUgdGltZXIgcnVucyBvdXQgd2hpbGUgdGhlIHVzZXIgaGFzIGtlcHQgdGhlaXIgcG9pbnRlciBkb3duLCB3ZSB3YW50IHRvXG4gICAgICAvLyBrZWVwIG9ubHkgdGhlIHBlcnNpc3RlbnQgcmlwcGxlcyBhbmQgdGhlIGxhdGVzdCB0cmFuc2llbnQgcmlwcGxlLiBXZSBkbyB0aGlzLFxuICAgICAgLy8gYmVjYXVzZSB3ZSBkb24ndCB3YW50IHN0YWNrZWQgdHJhbnNpZW50IHJpcHBsZXMgdG8gYXBwZWFyIGFmdGVyIHRoZWlyIGVudGVyXG4gICAgICAvLyBhbmltYXRpb24gaGFzIGZpbmlzaGVkLlxuICAgICAgaWYgKCFjb25maWcucGVyc2lzdGVudCAmJiAoIWlzTW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSB8fCAhdGhpcy5faXNQb2ludGVyRG93bikpIHtcbiAgICAgICAgcmlwcGxlUmVmLmZhZGVPdXQoKTtcbiAgICAgIH1cbiAgICB9LCBkdXJhdGlvbik7XG5cbiAgICByZXR1cm4gcmlwcGxlUmVmO1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCBhIHJpcHBsZSByZWZlcmVuY2UuICovXG4gIGZhZGVPdXRSaXBwbGUocmlwcGxlUmVmOiBSaXBwbGVSZWYpIHtcbiAgICBjb25zdCB3YXNBY3RpdmUgPSB0aGlzLl9hY3RpdmVSaXBwbGVzLmRlbGV0ZShyaXBwbGVSZWYpO1xuXG4gICAgaWYgKHJpcHBsZVJlZiA9PT0gdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSkge1xuICAgICAgdGhpcy5fbW9zdFJlY2VudFRyYW5zaWVudFJpcHBsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ2xlYXIgb3V0IHRoZSBjYWNoZWQgYm91bmRpbmcgcmVjdCBpZiB3ZSBoYXZlIG5vIG1vcmUgcmlwcGxlcy5cbiAgICBpZiAoIXRoaXMuX2FjdGl2ZVJpcHBsZXMuc2l6ZSkge1xuICAgICAgdGhpcy5fY29udGFpbmVyUmVjdCA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gRm9yIHJpcHBsZXMgdGhhdCBhcmUgbm90IGFjdGl2ZSBhbnltb3JlLCBkb24ndCByZS1ydW4gdGhlIGZhZGUtb3V0IGFuaW1hdGlvbi5cbiAgICBpZiAoIXdhc0FjdGl2ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJpcHBsZUVsID0gcmlwcGxlUmVmLmVsZW1lbnQ7XG4gICAgY29uc3QgYW5pbWF0aW9uQ29uZmlnID0gey4uLmRlZmF1bHRSaXBwbGVBbmltYXRpb25Db25maWcsIC4uLnJpcHBsZVJlZi5jb25maWcuYW5pbWF0aW9ufTtcblxuICAgIHJpcHBsZUVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke2FuaW1hdGlvbkNvbmZpZy5leGl0RHVyYXRpb259bXNgO1xuICAgIHJpcHBsZUVsLnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuRkFESU5HX09VVDtcblxuICAgIC8vIE9uY2UgdGhlIHJpcHBsZSBmYWRlZCBvdXQsIHRoZSByaXBwbGUgY2FuIGJlIHNhZmVseSByZW1vdmVkIGZyb20gdGhlIERPTS5cbiAgICB0aGlzLl9ydW5UaW1lb3V0T3V0c2lkZVpvbmUoKCkgPT4ge1xuICAgICAgcmlwcGxlUmVmLnN0YXRlID0gUmlwcGxlU3RhdGUuSElEREVOO1xuICAgICAgcmlwcGxlRWwucGFyZW50Tm9kZSEucmVtb3ZlQ2hpbGQocmlwcGxlRWwpO1xuICAgIH0sIGFuaW1hdGlvbkNvbmZpZy5leGl0RHVyYXRpb24pO1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCBhbGwgY3VycmVudGx5IGFjdGl2ZSByaXBwbGVzLiAqL1xuICBmYWRlT3V0QWxsKCkge1xuICAgIHRoaXMuX2FjdGl2ZVJpcHBsZXMuZm9yRWFjaChyaXBwbGUgPT4gcmlwcGxlLmZhZGVPdXQoKSk7XG4gIH1cblxuICAvKiogU2V0cyB1cCB0aGUgdHJpZ2dlciBldmVudCBsaXN0ZW5lcnMgKi9cbiAgc2V0dXBUcmlnZ2VyRXZlbnRzKGVsZW1lbnRPckVsZW1lbnRSZWY6IEhUTUxFbGVtZW50IHwgRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICBjb25zdCBlbGVtZW50ID0gY29lcmNlRWxlbWVudChlbGVtZW50T3JFbGVtZW50UmVmKTtcblxuICAgIGlmICghZWxlbWVudCB8fCBlbGVtZW50ID09PSB0aGlzLl90cmlnZ2VyRWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhbGwgcHJldmlvdXNseSByZWdpc3RlcmVkIGV2ZW50IGxpc3RlbmVycyBmcm9tIHRoZSB0cmlnZ2VyIGVsZW1lbnQuXG4gICAgdGhpcy5fcmVtb3ZlVHJpZ2dlckV2ZW50cygpO1xuXG4gICAgdGhpcy5fdHJpZ2dlckVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMuX3JlZ2lzdGVyRXZlbnRzKHBvaW50ZXJEb3duRXZlbnRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGFsbCByZWdpc3RlcmVkIGV2ZW50cy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgaGFuZGxlRXZlbnQoZXZlbnQ6IEV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZWRvd24nKSB7XG4gICAgICB0aGlzLl9vbk1vdXNlZG93bihldmVudCBhcyBNb3VzZUV2ZW50KTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICd0b3VjaHN0YXJ0Jykge1xuICAgICAgdGhpcy5fb25Ub3VjaFN0YXJ0KGV2ZW50IGFzIFRvdWNoRXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9vblBvaW50ZXJVcCgpO1xuICAgIH1cblxuICAgIC8vIElmIHBvaW50ZXItdXAgZXZlbnRzIGhhdmVuJ3QgYmVlbiByZWdpc3RlcmVkIHlldCwgZG8gc28gbm93LlxuICAgIC8vIFdlIGRvIHRoaXMgb24tZGVtYW5kIGluIG9yZGVyIHRvIHJlZHVjZSB0aGUgdG90YWwgbnVtYmVyIG9mIGV2ZW50IGxpc3RlbmVyc1xuICAgIC8vIHJlZ2lzdGVyZWQgYnkgdGhlIHJpcHBsZXMsIHdoaWNoIHNwZWVkcyB1cCB0aGUgcmVuZGVyaW5nIHRpbWUgZm9yIGxhcmdlIFVJcy5cbiAgICBpZiAoIXRoaXMuX3BvaW50ZXJVcEV2ZW50c1JlZ2lzdGVyZWQpIHtcbiAgICAgIHRoaXMuX3JlZ2lzdGVyRXZlbnRzKHBvaW50ZXJVcEV2ZW50cyk7XG4gICAgICB0aGlzLl9wb2ludGVyVXBFdmVudHNSZWdpc3RlcmVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKiogRnVuY3Rpb24gYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB0cmlnZ2VyIGlzIGJlaW5nIHByZXNzZWQgdXNpbmcgbW91c2UuICovXG4gIHByaXZhdGUgX29uTW91c2Vkb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgLy8gU2NyZWVuIHJlYWRlcnMgd2lsbCBmaXJlIGZha2UgbW91c2UgZXZlbnRzIGZvciBzcGFjZS9lbnRlci4gU2tpcCBsYXVuY2hpbmcgYVxuICAgIC8vIHJpcHBsZSBpbiB0aGlzIGNhc2UgZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlIG5vbi1zY3JlZW4tcmVhZGVyIGV4cGVyaWVuY2UuXG4gICAgY29uc3QgaXNGYWtlTW91c2Vkb3duID0gaXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlcihldmVudCk7XG4gICAgY29uc3QgaXNTeW50aGV0aWNFdmVudCA9IHRoaXMuX2xhc3RUb3VjaFN0YXJ0RXZlbnQgJiZcbiAgICAgICAgRGF0ZS5ub3coKSA8IHRoaXMuX2xhc3RUb3VjaFN0YXJ0RXZlbnQgKyBpZ25vcmVNb3VzZUV2ZW50c1RpbWVvdXQ7XG5cbiAgICBpZiAoIXRoaXMuX3RhcmdldC5yaXBwbGVEaXNhYmxlZCAmJiAhaXNGYWtlTW91c2Vkb3duICYmICFpc1N5bnRoZXRpY0V2ZW50KSB7XG4gICAgICB0aGlzLl9pc1BvaW50ZXJEb3duID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmFkZUluUmlwcGxlKGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFksIHRoaXMuX3RhcmdldC5yaXBwbGVDb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBGdW5jdGlvbiBiZWluZyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHRyaWdnZXIgaXMgYmVpbmcgcHJlc3NlZCB1c2luZyB0b3VjaC4gKi9cbiAgcHJpdmF0ZSBfb25Ub3VjaFN0YXJ0KGV2ZW50OiBUb3VjaEV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLl90YXJnZXQucmlwcGxlRGlzYWJsZWQpIHtcbiAgICAgIC8vIFNvbWUgYnJvd3NlcnMgZmlyZSBtb3VzZSBldmVudHMgYWZ0ZXIgYSBgdG91Y2hzdGFydGAgZXZlbnQuIFRob3NlIHN5bnRoZXRpYyBtb3VzZVxuICAgICAgLy8gZXZlbnRzIHdpbGwgbGF1bmNoIGEgc2Vjb25kIHJpcHBsZSBpZiB3ZSBkb24ndCBpZ25vcmUgbW91c2UgZXZlbnRzIGZvciBhIHNwZWNpZmljXG4gICAgICAvLyB0aW1lIGFmdGVyIGEgdG91Y2hzdGFydCBldmVudC5cbiAgICAgIHRoaXMuX2xhc3RUb3VjaFN0YXJ0RXZlbnQgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5faXNQb2ludGVyRG93biA9IHRydWU7XG5cbiAgICAgIC8vIFVzZSBgY2hhbmdlZFRvdWNoZXNgIHNvIHdlIHNraXAgYW55IHRvdWNoZXMgd2hlcmUgdGhlIHVzZXIgcHV0XG4gICAgICAvLyB0aGVpciBmaW5nZXIgZG93biwgYnV0IHVzZWQgYW5vdGhlciBmaW5nZXIgdG8gdGFwIHRoZSBlbGVtZW50IGFnYWluLlxuICAgICAgY29uc3QgdG91Y2hlcyA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5mYWRlSW5SaXBwbGUodG91Y2hlc1tpXS5jbGllbnRYLCB0b3VjaGVzW2ldLmNsaWVudFksIHRoaXMuX3RhcmdldC5yaXBwbGVDb25maWcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBGdW5jdGlvbiBiZWluZyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHRyaWdnZXIgaXMgYmVpbmcgcmVsZWFzZWQuICovXG4gIHByaXZhdGUgX29uUG9pbnRlclVwKCkge1xuICAgIGlmICghdGhpcy5faXNQb2ludGVyRG93bikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2lzUG9pbnRlckRvd24gPSBmYWxzZTtcblxuICAgIC8vIEZhZGUtb3V0IGFsbCByaXBwbGVzIHRoYXQgYXJlIHZpc2libGUgYW5kIG5vdCBwZXJzaXN0ZW50LlxuICAgIHRoaXMuX2FjdGl2ZVJpcHBsZXMuZm9yRWFjaChyaXBwbGUgPT4ge1xuICAgICAgLy8gQnkgZGVmYXVsdCwgb25seSByaXBwbGVzIHRoYXQgYXJlIGNvbXBsZXRlbHkgdmlzaWJsZSB3aWxsIGZhZGUgb3V0IG9uIHBvaW50ZXIgcmVsZWFzZS5cbiAgICAgIC8vIElmIHRoZSBgdGVybWluYXRlT25Qb2ludGVyVXBgIG9wdGlvbiBpcyBzZXQsIHJpcHBsZXMgdGhhdCBzdGlsbCBmYWRlIGluIHdpbGwgYWxzbyBmYWRlIG91dC5cbiAgICAgIGNvbnN0IGlzVmlzaWJsZSA9IHJpcHBsZS5zdGF0ZSA9PT0gUmlwcGxlU3RhdGUuVklTSUJMRSB8fFxuICAgICAgICByaXBwbGUuY29uZmlnLnRlcm1pbmF0ZU9uUG9pbnRlclVwICYmIHJpcHBsZS5zdGF0ZSA9PT0gUmlwcGxlU3RhdGUuRkFESU5HX0lOO1xuXG4gICAgICBpZiAoIXJpcHBsZS5jb25maWcucGVyc2lzdGVudCAmJiBpc1Zpc2libGUpIHtcbiAgICAgICAgcmlwcGxlLmZhZGVPdXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSdW5zIGEgdGltZW91dCBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIHpvbmUgdG8gYXZvaWQgdHJpZ2dlcmluZyB0aGUgY2hhbmdlIGRldGVjdGlvbi4gKi9cbiAgcHJpdmF0ZSBfcnVuVGltZW91dE91dHNpZGVab25lKGZuOiBGdW5jdGlvbiwgZGVsYXkgPSAwKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHNldFRpbWVvdXQoZm4sIGRlbGF5KSk7XG4gIH1cblxuICAvKiogUmVnaXN0ZXJzIGV2ZW50IGxpc3RlbmVycyBmb3IgYSBnaXZlbiBsaXN0IG9mIGV2ZW50cy4gKi9cbiAgcHJpdmF0ZSBfcmVnaXN0ZXJFdmVudHMoZXZlbnRUeXBlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgZXZlbnRUeXBlcy5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJFbGVtZW50IS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIHRoaXMsIHBhc3NpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogUmVtb3ZlcyBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHRyaWdnZXIgZWxlbWVudC4gKi9cbiAgX3JlbW92ZVRyaWdnZXJFdmVudHMoKSB7XG4gICAgaWYgKHRoaXMuX3RyaWdnZXJFbGVtZW50KSB7XG4gICAgICBwb2ludGVyRG93bkV2ZW50cy5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJFbGVtZW50IS5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIHRoaXMsIHBhc3NpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLl9wb2ludGVyVXBFdmVudHNSZWdpc3RlcmVkKSB7XG4gICAgICAgIHBvaW50ZXJVcEV2ZW50cy5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgICAgICAgdGhpcy5fdHJpZ2dlckVsZW1lbnQhLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgdGhpcywgcGFzc2l2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKiogRW5mb3JjZXMgYSBzdHlsZSByZWNhbGN1bGF0aW9uIG9mIGEgRE9NIGVsZW1lbnQgYnkgY29tcHV0aW5nIGl0cyBzdHlsZXMuICovXG5mdW5jdGlvbiBlbmZvcmNlU3R5bGVSZWNhbGN1bGF0aW9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gIC8vIEVuZm9yY2UgYSBzdHlsZSByZWNhbGN1bGF0aW9uIGJ5IGNhbGxpbmcgYGdldENvbXB1dGVkU3R5bGVgIGFuZCBhY2Nlc3NpbmcgYW55IHByb3BlcnR5LlxuICAvLyBDYWxsaW5nIGBnZXRQcm9wZXJ0eVZhbHVlYCBpcyBpbXBvcnRhbnQgdG8gbGV0IG9wdGltaXplcnMga25vdyB0aGF0IHRoaXMgaXMgbm90IGEgbm9vcC5cbiAgLy8gU2VlOiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvNWQ1MmZiMDgxYjM1NzBjODFlM2FcbiAgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgnb3BhY2l0eScpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGZyb20gdGhlIHBvaW50ICh4LCB5KSB0byB0aGUgZnVydGhlc3QgY29ybmVyIG9mIGEgcmVjdGFuZ2xlLlxuICovXG5mdW5jdGlvbiBkaXN0YW5jZVRvRnVydGhlc3RDb3JuZXIoeDogbnVtYmVyLCB5OiBudW1iZXIsIHJlY3Q6IENsaWVudFJlY3QpIHtcbiAgY29uc3QgZGlzdFggPSBNYXRoLm1heChNYXRoLmFicyh4IC0gcmVjdC5sZWZ0KSwgTWF0aC5hYnMoeCAtIHJlY3QucmlnaHQpKTtcbiAgY29uc3QgZGlzdFkgPSBNYXRoLm1heChNYXRoLmFicyh5IC0gcmVjdC50b3ApLCBNYXRoLmFicyh5IC0gcmVjdC5ib3R0b20pKTtcbiAgcmV0dXJuIE1hdGguc3FydChkaXN0WCAqIGRpc3RYICsgZGlzdFkgKiBkaXN0WSk7XG59XG4iXX0=