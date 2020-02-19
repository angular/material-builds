import { __assign } from "tslib";
import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Overlay, } from '@angular/cdk/overlay';
import { Platform, normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { ComponentPortal } from '@angular/cdk/portal';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, Inject, InjectionToken, Input, NgZone, Optional, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { matTooltipAnimations } from './tooltip-animations';
/** Time in ms to throttle repositioning after scroll events. */
export var SCROLL_THROTTLE_MS = 20;
/** CSS class that will be attached to the overlay panel. */
export var TOOLTIP_PANEL_CLASS = 'mat-tooltip-panel';
/** Options used to bind passive event listeners. */
var passiveListenerOptions = normalizePassiveListenerOptions({ passive: true });
/**
 * Time between the user putting the pointer on a tooltip
 * trigger and the long press event being fired.
 */
var LONGPRESS_DELAY = 500;
/**
 * Creates an error to be thrown if the user supplied an invalid tooltip position.
 * @docs-private
 */
export function getMatTooltipInvalidPositionError(position) {
    return Error("Tooltip position \"" + position + "\" is invalid.");
}
/** Injection token that determines the scroll handling while a tooltip is visible. */
export var MAT_TOOLTIP_SCROLL_STRATEGY = new InjectionToken('mat-tooltip-scroll-strategy');
/** @docs-private */
export function MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.reposition({ scrollThrottle: SCROLL_THROTTLE_MS }); };
}
/** @docs-private */
export var MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MAT_TOOLTIP_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY,
};
/** Injection token to be used to override the default options for `matTooltip`. */
export var MAT_TOOLTIP_DEFAULT_OPTIONS = new InjectionToken('mat-tooltip-default-options', {
    providedIn: 'root',
    factory: MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY
});
/** @docs-private */
export function MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY() {
    return {
        showDelay: 0,
        hideDelay: 0,
        touchendHideDelay: 1500,
    };
}
/**
 * Directive that attaches a material design tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 *
 * https://material.io/design/components/tooltips.html
 */
var MatTooltip = /** @class */ (function () {
    function MatTooltip(_overlay, _elementRef, _scrollDispatcher, _viewContainerRef, _ngZone, _platform, _ariaDescriber, _focusMonitor, scrollStrategy, _dir, _defaultOptions, 
    /**
     * @deprecated _hammerLoader parameter to be removed.
     * @breaking-change 9.0.0
     */
    // Note that we need to give Angular something to inject here so it doesn't throw.
    _hammerLoader) {
        var _this = this;
        this._overlay = _overlay;
        this._elementRef = _elementRef;
        this._scrollDispatcher = _scrollDispatcher;
        this._viewContainerRef = _viewContainerRef;
        this._ngZone = _ngZone;
        this._platform = _platform;
        this._ariaDescriber = _ariaDescriber;
        this._focusMonitor = _focusMonitor;
        this._dir = _dir;
        this._defaultOptions = _defaultOptions;
        this._position = 'below';
        this._disabled = false;
        /** The default delay in ms before showing the tooltip after show is called */
        this.showDelay = this._defaultOptions.showDelay;
        /** The default delay in ms before hiding the tooltip after hide is called */
        this.hideDelay = this._defaultOptions.hideDelay;
        /**
         * How touch gestures should be handled by the tooltip. On touch devices the tooltip directive
         * uses a long press gesture to show and hide, however it can conflict with the native browser
         * gestures. To work around the conflict, Angular Material disables native gestures on the
         * trigger, but that might not be desirable on particular elements (e.g. inputs and draggable
         * elements). The different values for this option configure the touch event handling as follows:
         * - `auto` - Enables touch gestures for all elements, but tries to avoid conflicts with native
         *   browser gestures on particular elements. In particular, it allows text selection on inputs
         *   and textareas, and preserves the native browser dragging on elements marked as `draggable`.
         * - `on` - Enables touch gestures for all elements and disables native
         *   browser gestures with no exceptions.
         * - `off` - Disables touch gestures. Note that this will prevent the tooltip from
         *   showing on touch devices.
         */
        this.touchGestures = 'auto';
        this._message = '';
        /** Manually-bound passive event listeners. */
        this._passiveListeners = new Map();
        /** Emits when the component is destroyed. */
        this._destroyed = new Subject();
        /**
         * Handles the keydown events on the host element.
         * Needs to be an arrow function so that we can use it in addEventListener.
         */
        this._handleKeydown = function (event) {
            if (_this._isTooltipVisible() && event.keyCode === ESCAPE && !hasModifierKey(event)) {
                event.preventDefault();
                event.stopPropagation();
                _this._ngZone.run(function () { return _this.hide(0); });
            }
        };
        this._scrollStrategy = scrollStrategy;
        if (_defaultOptions) {
            if (_defaultOptions.position) {
                this.position = _defaultOptions.position;
            }
            if (_defaultOptions.touchGestures) {
                this.touchGestures = _defaultOptions.touchGestures;
            }
        }
        _focusMonitor.monitor(_elementRef)
            .pipe(takeUntil(this._destroyed))
            .subscribe(function (origin) {
            // Note that the focus monitor runs outside the Angular zone.
            if (!origin) {
                _ngZone.run(function () { return _this.hide(0); });
            }
            else if (origin === 'keyboard') {
                _ngZone.run(function () { return _this.show(); });
            }
        });
        _ngZone.runOutsideAngular(function () {
            _elementRef.nativeElement.addEventListener('keydown', _this._handleKeydown);
        });
    }
    Object.defineProperty(MatTooltip.prototype, "position", {
        /** Allows the user to define the position of the tooltip relative to the parent element */
        get: function () { return this._position; },
        set: function (value) {
            if (value !== this._position) {
                this._position = value;
                if (this._overlayRef) {
                    this._updatePosition();
                    if (this._tooltipInstance) {
                        this._tooltipInstance.show(0);
                    }
                    this._overlayRef.updatePosition();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatTooltip.prototype, "disabled", {
        /** Disables the display of the tooltip. */
        get: function () { return this._disabled; },
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
            // If tooltip is disabled, hide immediately.
            if (this._disabled) {
                this.hide(0);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatTooltip.prototype, "message", {
        /** The message to be displayed in the tooltip */
        get: function () { return this._message; },
        set: function (value) {
            var _this = this;
            this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this._message);
            // If the message is not a string (e.g. number), convert it to a string and trim it.
            this._message = value != null ? ("" + value).trim() : '';
            if (!this._message && this._isTooltipVisible()) {
                this.hide(0);
            }
            else {
                this._updateTooltipMessage();
                this._ngZone.runOutsideAngular(function () {
                    // The `AriaDescriber` has some functionality that avoids adding a description if it's the
                    // same as the `aria-label` of an element, however we can't know whether the tooltip trigger
                    // has a data-bound `aria-label` or when it'll be set for the first time. We can avoid the
                    // issue by deferring the description by a tick so Angular has time to set the `aria-label`.
                    Promise.resolve().then(function () {
                        _this._ariaDescriber.describe(_this._elementRef.nativeElement, _this.message);
                    });
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatTooltip.prototype, "tooltipClass", {
        /** Classes to be passed to the tooltip. Supports the same syntax as `ngClass`. */
        get: function () { return this._tooltipClass; },
        set: function (value) {
            this._tooltipClass = value;
            if (this._tooltipInstance) {
                this._setTooltipClass(this._tooltipClass);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Setup styling-specific things
     */
    MatTooltip.prototype.ngOnInit = function () {
        // This needs to happen in `ngOnInit` so the initial values for all inputs have been set.
        this._setupPointerEvents();
    };
    /**
     * Dispose the tooltip when destroyed.
     */
    MatTooltip.prototype.ngOnDestroy = function () {
        var nativeElement = this._elementRef.nativeElement;
        clearTimeout(this._touchstartTimeout);
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._tooltipInstance = null;
        }
        // Clean up the event listeners set in the constructor
        nativeElement.removeEventListener('keydown', this._handleKeydown);
        this._passiveListeners.forEach(function (listener, event) {
            nativeElement.removeEventListener(event, listener, passiveListenerOptions);
        });
        this._passiveListeners.clear();
        this._destroyed.next();
        this._destroyed.complete();
        this._ariaDescriber.removeDescription(nativeElement, this.message);
        this._focusMonitor.stopMonitoring(nativeElement);
    };
    /** Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input */
    MatTooltip.prototype.show = function (delay) {
        var _this = this;
        if (delay === void 0) { delay = this.showDelay; }
        if (this.disabled || !this.message || (this._isTooltipVisible() &&
            !this._tooltipInstance._showTimeoutId && !this._tooltipInstance._hideTimeoutId)) {
            return;
        }
        var overlayRef = this._createOverlay();
        this._detach();
        this._portal = this._portal || new ComponentPortal(TooltipComponent, this._viewContainerRef);
        this._tooltipInstance = overlayRef.attach(this._portal).instance;
        this._tooltipInstance.afterHidden()
            .pipe(takeUntil(this._destroyed))
            .subscribe(function () { return _this._detach(); });
        this._setTooltipClass(this._tooltipClass);
        this._updateTooltipMessage();
        this._tooltipInstance.show(delay);
    };
    /** Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input */
    MatTooltip.prototype.hide = function (delay) {
        if (delay === void 0) { delay = this.hideDelay; }
        if (this._tooltipInstance) {
            this._tooltipInstance.hide(delay);
        }
    };
    /** Shows/hides the tooltip */
    MatTooltip.prototype.toggle = function () {
        this._isTooltipVisible() ? this.hide() : this.show();
    };
    /** Returns true if the tooltip is currently visible to the user */
    MatTooltip.prototype._isTooltipVisible = function () {
        return !!this._tooltipInstance && this._tooltipInstance.isVisible();
    };
    /** Create the overlay config and position strategy */
    MatTooltip.prototype._createOverlay = function () {
        var _this = this;
        if (this._overlayRef) {
            return this._overlayRef;
        }
        var scrollableAncestors = this._scrollDispatcher.getAncestorScrollContainers(this._elementRef);
        // Create connected position strategy that listens for scroll events to reposition.
        var strategy = this._overlay.position()
            .flexibleConnectedTo(this._elementRef)
            .withTransformOriginOn('.mat-tooltip')
            .withFlexibleDimensions(false)
            .withViewportMargin(8)
            .withScrollableContainers(scrollableAncestors);
        strategy.positionChanges.pipe(takeUntil(this._destroyed)).subscribe(function (change) {
            if (_this._tooltipInstance) {
                if (change.scrollableViewProperties.isOverlayClipped && _this._tooltipInstance.isVisible()) {
                    // After position changes occur and the overlay is clipped by
                    // a parent scrollable then close the tooltip.
                    _this._ngZone.run(function () { return _this.hide(0); });
                }
            }
        });
        this._overlayRef = this._overlay.create({
            direction: this._dir,
            positionStrategy: strategy,
            panelClass: TOOLTIP_PANEL_CLASS,
            scrollStrategy: this._scrollStrategy()
        });
        this._updatePosition();
        this._overlayRef.detachments()
            .pipe(takeUntil(this._destroyed))
            .subscribe(function () { return _this._detach(); });
        return this._overlayRef;
    };
    /** Detaches the currently-attached tooltip. */
    MatTooltip.prototype._detach = function () {
        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
        }
        this._tooltipInstance = null;
    };
    /** Updates the position of the current tooltip. */
    MatTooltip.prototype._updatePosition = function () {
        var position = this._overlayRef.getConfig().positionStrategy;
        var origin = this._getOrigin();
        var overlay = this._getOverlayPosition();
        position.withPositions([
            __assign(__assign({}, origin.main), overlay.main),
            __assign(__assign({}, origin.fallback), overlay.fallback)
        ]);
    };
    /**
     * Returns the origin position and a fallback position based on the user's position preference.
     * The fallback position is the inverse of the origin (e.g. `'below' -> 'above'`).
     */
    MatTooltip.prototype._getOrigin = function () {
        var isLtr = !this._dir || this._dir.value == 'ltr';
        var position = this.position;
        var originPosition;
        if (position == 'above' || position == 'below') {
            originPosition = { originX: 'center', originY: position == 'above' ? 'top' : 'bottom' };
        }
        else if (position == 'before' ||
            (position == 'left' && isLtr) ||
            (position == 'right' && !isLtr)) {
            originPosition = { originX: 'start', originY: 'center' };
        }
        else if (position == 'after' ||
            (position == 'right' && isLtr) ||
            (position == 'left' && !isLtr)) {
            originPosition = { originX: 'end', originY: 'center' };
        }
        else {
            throw getMatTooltipInvalidPositionError(position);
        }
        var _a = this._invertPosition(originPosition.originX, originPosition.originY), x = _a.x, y = _a.y;
        return {
            main: originPosition,
            fallback: { originX: x, originY: y }
        };
    };
    /** Returns the overlay position and a fallback position based on the user's preference */
    MatTooltip.prototype._getOverlayPosition = function () {
        var isLtr = !this._dir || this._dir.value == 'ltr';
        var position = this.position;
        var overlayPosition;
        if (position == 'above') {
            overlayPosition = { overlayX: 'center', overlayY: 'bottom' };
        }
        else if (position == 'below') {
            overlayPosition = { overlayX: 'center', overlayY: 'top' };
        }
        else if (position == 'before' ||
            (position == 'left' && isLtr) ||
            (position == 'right' && !isLtr)) {
            overlayPosition = { overlayX: 'end', overlayY: 'center' };
        }
        else if (position == 'after' ||
            (position == 'right' && isLtr) ||
            (position == 'left' && !isLtr)) {
            overlayPosition = { overlayX: 'start', overlayY: 'center' };
        }
        else {
            throw getMatTooltipInvalidPositionError(position);
        }
        var _a = this._invertPosition(overlayPosition.overlayX, overlayPosition.overlayY), x = _a.x, y = _a.y;
        return {
            main: overlayPosition,
            fallback: { overlayX: x, overlayY: y }
        };
    };
    /** Updates the tooltip message and repositions the overlay according to the new message length */
    MatTooltip.prototype._updateTooltipMessage = function () {
        var _this = this;
        // Must wait for the message to be painted to the tooltip so that the overlay can properly
        // calculate the correct positioning based on the size of the text.
        if (this._tooltipInstance) {
            this._tooltipInstance.message = this.message;
            this._tooltipInstance._markForCheck();
            this._ngZone.onMicrotaskEmpty.asObservable().pipe(take(1), takeUntil(this._destroyed)).subscribe(function () {
                if (_this._tooltipInstance) {
                    _this._overlayRef.updatePosition();
                }
            });
        }
    };
    /** Updates the tooltip class */
    MatTooltip.prototype._setTooltipClass = function (tooltipClass) {
        if (this._tooltipInstance) {
            this._tooltipInstance.tooltipClass = tooltipClass;
            this._tooltipInstance._markForCheck();
        }
    };
    /** Inverts an overlay position. */
    MatTooltip.prototype._invertPosition = function (x, y) {
        if (this.position === 'above' || this.position === 'below') {
            if (y === 'top') {
                y = 'bottom';
            }
            else if (y === 'bottom') {
                y = 'top';
            }
        }
        else {
            if (x === 'end') {
                x = 'start';
            }
            else if (x === 'start') {
                x = 'end';
            }
        }
        return { x: x, y: y };
    };
    /** Binds the pointer events to the tooltip trigger. */
    MatTooltip.prototype._setupPointerEvents = function () {
        var _this = this;
        // The mouse events shouldn't be bound on mobile devices, because they can prevent the
        // first tap from firing its click event or can cause the tooltip to open for clicks.
        if (!this._platform.IOS && !this._platform.ANDROID) {
            this._passiveListeners
                .set('mouseenter', function () { return _this.show(); })
                .set('mouseleave', function () { return _this.hide(); });
        }
        else if (this.touchGestures !== 'off') {
            this._disableNativeGesturesIfNecessary();
            var touchendListener = function () {
                clearTimeout(_this._touchstartTimeout);
                _this.hide(_this._defaultOptions.touchendHideDelay);
            };
            this._passiveListeners
                .set('touchend', touchendListener)
                .set('touchcancel', touchendListener)
                .set('touchstart', function () {
                // Note that it's important that we don't `preventDefault` here,
                // because it can prevent click events from firing on the element.
                clearTimeout(_this._touchstartTimeout);
                _this._touchstartTimeout = setTimeout(function () { return _this.show(); }, LONGPRESS_DELAY);
            });
        }
        this._passiveListeners.forEach(function (listener, event) {
            _this._elementRef.nativeElement.addEventListener(event, listener, passiveListenerOptions);
        });
    };
    /** Disables the native browser gestures, based on how the tooltip has been configured. */
    MatTooltip.prototype._disableNativeGesturesIfNecessary = function () {
        var element = this._elementRef.nativeElement;
        var style = element.style;
        var gestures = this.touchGestures;
        if (gestures !== 'off') {
            // If gestures are set to `auto`, we don't disable text selection on inputs and
            // textareas, because it prevents the user from typing into them on iOS Safari.
            if (gestures === 'on' || (element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA')) {
                style.userSelect = style.msUserSelect = style.webkitUserSelect =
                    style.MozUserSelect = 'none';
            }
            // If we have `auto` gestures and the element uses native HTML dragging,
            // we don't set `-webkit-user-drag` because it prevents the native behavior.
            if (gestures === 'on' || !element.draggable) {
                style.webkitUserDrag = 'none';
            }
            style.touchAction = 'none';
            style.webkitTapHighlightColor = 'transparent';
        }
    };
    MatTooltip.decorators = [
        { type: Directive, args: [{
                    selector: '[matTooltip]',
                    exportAs: 'matTooltip',
                },] }
    ];
    /** @nocollapse */
    MatTooltip.ctorParameters = function () { return [
        { type: Overlay },
        { type: ElementRef },
        { type: ScrollDispatcher },
        { type: ViewContainerRef },
        { type: NgZone },
        { type: Platform },
        { type: AriaDescriber },
        { type: FocusMonitor },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_TOOLTIP_SCROLL_STRATEGY,] }] },
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_TOOLTIP_DEFAULT_OPTIONS,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [ElementRef,] }] }
    ]; };
    MatTooltip.propDecorators = {
        position: [{ type: Input, args: ['matTooltipPosition',] }],
        disabled: [{ type: Input, args: ['matTooltipDisabled',] }],
        showDelay: [{ type: Input, args: ['matTooltipShowDelay',] }],
        hideDelay: [{ type: Input, args: ['matTooltipHideDelay',] }],
        touchGestures: [{ type: Input, args: ['matTooltipTouchGestures',] }],
        message: [{ type: Input, args: ['matTooltip',] }],
        tooltipClass: [{ type: Input, args: ['matTooltipClass',] }]
    };
    return MatTooltip;
}());
export { MatTooltip };
/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 */
var TooltipComponent = /** @class */ (function () {
    function TooltipComponent(_changeDetectorRef, _breakpointObserver) {
        this._changeDetectorRef = _changeDetectorRef;
        this._breakpointObserver = _breakpointObserver;
        /** Property watched by the animation framework to show or hide the tooltip */
        this._visibility = 'initial';
        /** Whether interactions on the page should close the tooltip */
        this._closeOnInteraction = false;
        /** Subject for notifying that the tooltip has been hidden from the view */
        this._onHide = new Subject();
        /** Stream that emits whether the user has a handset-sized display.  */
        this._isHandset = this._breakpointObserver.observe(Breakpoints.Handset);
    }
    /**
     * Shows the tooltip with an animation originating from the provided origin
     * @param delay Amount of milliseconds to the delay showing the tooltip.
     */
    TooltipComponent.prototype.show = function (delay) {
        var _this = this;
        // Cancel the delayed hide if it is scheduled
        if (this._hideTimeoutId) {
            clearTimeout(this._hideTimeoutId);
            this._hideTimeoutId = null;
        }
        // Body interactions should cancel the tooltip if there is a delay in showing.
        this._closeOnInteraction = true;
        this._showTimeoutId = setTimeout(function () {
            _this._visibility = 'visible';
            _this._showTimeoutId = null;
            // Mark for check so if any parent component has set the
            // ChangeDetectionStrategy to OnPush it will be checked anyways
            _this._markForCheck();
        }, delay);
    };
    /**
     * Begins the animation to hide the tooltip after the provided delay in ms.
     * @param delay Amount of milliseconds to delay showing the tooltip.
     */
    TooltipComponent.prototype.hide = function (delay) {
        var _this = this;
        // Cancel the delayed show if it is scheduled
        if (this._showTimeoutId) {
            clearTimeout(this._showTimeoutId);
            this._showTimeoutId = null;
        }
        this._hideTimeoutId = setTimeout(function () {
            _this._visibility = 'hidden';
            _this._hideTimeoutId = null;
            // Mark for check so if any parent component has set the
            // ChangeDetectionStrategy to OnPush it will be checked anyways
            _this._markForCheck();
        }, delay);
    };
    /** Returns an observable that notifies when the tooltip has been hidden from view. */
    TooltipComponent.prototype.afterHidden = function () {
        return this._onHide.asObservable();
    };
    /** Whether the tooltip is being displayed. */
    TooltipComponent.prototype.isVisible = function () {
        return this._visibility === 'visible';
    };
    TooltipComponent.prototype.ngOnDestroy = function () {
        this._onHide.complete();
    };
    TooltipComponent.prototype._animationStart = function () {
        this._closeOnInteraction = false;
    };
    TooltipComponent.prototype._animationDone = function (event) {
        var toState = event.toState;
        if (toState === 'hidden' && !this.isVisible()) {
            this._onHide.next();
        }
        if (toState === 'visible' || toState === 'hidden') {
            this._closeOnInteraction = true;
        }
    };
    /**
     * Interactions on the HTML body should close the tooltip immediately as defined in the
     * material design spec.
     * https://material.io/design/components/tooltips.html#behavior
     */
    TooltipComponent.prototype._handleBodyInteraction = function () {
        if (this._closeOnInteraction) {
            this.hide(0);
        }
    };
    /**
     * Marks that the tooltip needs to be checked in the next change detection run.
     * Mainly used for rendering the initial text before positioning a tooltip, which
     * can be problematic in components with OnPush change detection.
     */
    TooltipComponent.prototype._markForCheck = function () {
        this._changeDetectorRef.markForCheck();
    };
    TooltipComponent.decorators = [
        { type: Component, args: [{
                    selector: 'mat-tooltip-component',
                    template: "<div class=\"mat-tooltip\"\n     [ngClass]=\"tooltipClass\"\n     [class.mat-tooltip-handset]=\"(_isHandset | async)?.matches\"\n     [@state]=\"_visibility\"\n     (@state.start)=\"_animationStart()\"\n     (@state.done)=\"_animationDone($event)\">{{message}}</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    animations: [matTooltipAnimations.tooltipState],
                    host: {
                        // Forces the element to have a layout in IE and Edge. This fixes issues where the element
                        // won't be rendered if the animations are disabled or there is no web animations polyfill.
                        '[style.zoom]': '_visibility === "visible" ? 1 : null',
                        '(body:click)': 'this._handleBodyInteraction()',
                        'aria-hidden': 'true',
                    },
                    styles: [".mat-tooltip-panel{pointer-events:none !important}.mat-tooltip{color:#fff;border-radius:4px;margin:14px;max-width:250px;padding-left:8px;padding-right:8px;overflow:hidden;text-overflow:ellipsis}.cdk-high-contrast-active .mat-tooltip{outline:solid 1px}.mat-tooltip-handset{margin:24px;padding-left:16px;padding-right:16px}\n"]
                }] }
    ];
    /** @nocollapse */
    TooltipComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: BreakpointObserver }
    ]; };
    return TooltipComponent;
}());
export { TooltipComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90b29sdGlwL3Rvb2x0aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQVFBLE9BQU8sRUFBQyxhQUFhLEVBQUUsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDOUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBYyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZGLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFDLGtCQUFrQixFQUFFLFdBQVcsRUFBa0IsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRixPQUFPLEVBSUwsT0FBTyxHQUtSLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLFFBQVEsRUFBRSwrQkFBK0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUNSLGdCQUFnQixFQUNoQixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFhLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6QyxPQUFPLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRS9DLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBZTFELGdFQUFnRTtB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LElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNkO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCx3Q0FBYSxHQUFiO1FBQ0UsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pDLENBQUM7O2dCQXhJRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtvQkFDakMsd1JBQTJCO29CQUUzQixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLFVBQVUsRUFBRSxDQUFDLG9CQUFvQixDQUFDLFlBQVksQ0FBQztvQkFDL0MsSUFBSSxFQUFFO3dCQUNKLDBGQUEwRjt3QkFDMUYsMkZBQTJGO3dCQUMzRixjQUFjLEVBQUUsc0NBQXNDO3dCQUN0RCxjQUFjLEVBQUUsK0JBQStCO3dCQUMvQyxhQUFhLEVBQUUsTUFBTTtxQkFDdEI7O2lCQUNGOzs7O2dCQXpsQkMsaUJBQWlCO2dCQWhCWCxrQkFBa0I7O0lBb3VCMUIsdUJBQUM7Q0FBQSxBQXpJRCxJQXlJQztTQTFIWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtBcmlhRGVzY3JpYmVyLCBGb2N1c01vbml0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHksIE51bWJlcklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFU0NBUEUsIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtCcmVha3BvaW50T2JzZXJ2ZXIsIEJyZWFrcG9pbnRzLCBCcmVha3BvaW50U3RhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9sYXlvdXQnO1xuaW1wb3J0IHtcbiAgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5LFxuICBIb3Jpem9udGFsQ29ubmVjdGlvblBvcyxcbiAgT3JpZ2luQ29ubmVjdGlvblBvc2l0aW9uLFxuICBPdmVybGF5LFxuICBPdmVybGF5Q29ubmVjdGlvblBvc2l0aW9uLFxuICBPdmVybGF5UmVmLFxuICBTY3JvbGxTdHJhdGVneSxcbiAgVmVydGljYWxDb25uZWN0aW9uUG9zLFxufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge1BsYXRmb3JtLCBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtDb21wb25lbnRQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtTY3JvbGxEaXNwYXRjaGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7bWF0VG9vbHRpcEFuaW1hdGlvbnN9IGZyb20gJy4vdG9vbHRpcC1hbmltYXRpb25zJztcblxuXG4vKiogUG9zc2libGUgcG9zaXRpb25zIGZvciBhIHRvb2x0aXAuICovXG5leHBvcnQgdHlwZSBUb29sdGlwUG9zaXRpb24gPSAnbGVmdCcgfCAncmlnaHQnIHwgJ2Fib3ZlJyB8ICdiZWxvdycgfCAnYmVmb3JlJyB8ICdhZnRlcic7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgaG93IHRoZSB0b29sdGlwIHRyaWdnZXIgc2hvdWxkIGhhbmRsZSB0b3VjaCBnZXN0dXJlcy5cbiAqIFNlZSBgTWF0VG9vbHRpcC50b3VjaEdlc3R1cmVzYCBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqL1xuZXhwb3J0IHR5cGUgVG9vbHRpcFRvdWNoR2VzdHVyZXMgPSAnYXV0bycgfCAnb24nIHwgJ29mZic7XG5cbi8qKiBQb3NzaWJsZSB2aXNpYmlsaXR5IHN0YXRlcyBvZiBhIHRvb2x0aXAuICovXG5leHBvcnQgdHlwZSBUb29sdGlwVmlzaWJpbGl0eSA9ICdpbml0aWFsJyB8ICd2aXNpYmxlJyB8ICdoaWRkZW4nO1xuXG4vKiogVGltZSBpbiBtcyB0byB0aHJvdHRsZSByZXBvc2l0aW9uaW5nIGFmdGVyIHNjcm9sbCBldmVudHMuICovXG5leHBvcnQgY29uc3QgU0NST0xMX1RIUk9UVExFX01TID0gMjA7XG5cbi8qKiBDU1MgY2xhc3MgdGhhdCB3aWxsIGJlIGF0dGFjaGVkIHRvIHRoZSBvdmVybGF5IHBhbmVsLiAqL1xuZXhwb3J0IGNvbnN0IFRPT0xUSVBfUEFORUxfQ0xBU1MgPSAnbWF0LXRvb2x0aXAtcGFuZWwnO1xuXG4vKiogT3B0aW9ucyB1c2VkIHRvIGJpbmQgcGFzc2l2ZSBldmVudCBsaXN0ZW5lcnMuICovXG5jb25zdCBwYXNzaXZlTGlzdGVuZXJPcHRpb25zID0gbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyh7cGFzc2l2ZTogdHJ1ZX0pO1xuXG4vKipcbiAqIFRpbWUgYmV0d2VlbiB0aGUgdXNlciBwdXR0aW5nIHRoZSBwb2ludGVyIG9uIGEgdG9vbHRpcFxuICogdHJpZ2dlciBhbmQgdGhlIGxvbmcgcHJlc3MgZXZlbnQgYmVpbmcgZmlyZWQuXG4gKi9cbmNvbnN0IExPTkdQUkVTU19ERUxBWSA9IDUwMDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGVycm9yIHRvIGJlIHRocm93biBpZiB0aGUgdXNlciBzdXBwbGllZCBhbiBpbnZhbGlkIHRvb2x0aXAgcG9zaXRpb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRUb29sdGlwSW52YWxpZFBvc2l0aW9uRXJyb3IocG9zaXRpb246IHN0cmluZykge1xuICByZXR1cm4gRXJyb3IoYFRvb2x0aXAgcG9zaXRpb24gXCIke3Bvc2l0aW9ufVwiIGlzIGludmFsaWQuYCk7XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgYSB0b29sdGlwIGlzIHZpc2libGUuICovXG5leHBvcnQgY29uc3QgTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KCdtYXQtdG9vbHRpcC1zY3JvbGwtc3RyYXRlZ3knKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oe3Njcm9sbFRocm90dGxlOiBTQ1JPTExfVEhST1RUTEVfTVN9KTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZLFxufTtcblxuLyoqIERlZmF1bHQgYG1hdFRvb2x0aXBgIG9wdGlvbnMgdGhhdCBjYW4gYmUgb3ZlcnJpZGRlbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0VG9vbHRpcERlZmF1bHRPcHRpb25zIHtcbiAgc2hvd0RlbGF5OiBudW1iZXI7XG4gIGhpZGVEZWxheTogbnVtYmVyO1xuICB0b3VjaGVuZEhpZGVEZWxheTogbnVtYmVyO1xuICB0b3VjaEdlc3R1cmVzPzogVG9vbHRpcFRvdWNoR2VzdHVyZXM7XG4gIHBvc2l0aW9uPzogVG9vbHRpcFBvc2l0aW9uO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdFRvb2x0aXBgLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9UT09MVElQX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdFRvb2x0aXBEZWZhdWx0T3B0aW9ucz4oJ21hdC10b29sdGlwLWRlZmF1bHQtb3B0aW9ucycsIHtcbiAgICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICAgIGZhY3Rvcnk6IE1BVF9UT09MVElQX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZXG4gICAgfSk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1RPT0xUSVBfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0VG9vbHRpcERlZmF1bHRPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICBzaG93RGVsYXk6IDAsXG4gICAgaGlkZURlbGF5OiAwLFxuICAgIHRvdWNoZW5kSGlkZURlbGF5OiAxNTAwLFxuICB9O1xufVxuXG4vKipcbiAqIERpcmVjdGl2ZSB0aGF0IGF0dGFjaGVzIGEgbWF0ZXJpYWwgZGVzaWduIHRvb2x0aXAgdG8gdGhlIGhvc3QgZWxlbWVudC4gQW5pbWF0ZXMgdGhlIHNob3dpbmcgYW5kXG4gKiBoaWRpbmcgb2YgYSB0b29sdGlwIHByb3ZpZGVkIHBvc2l0aW9uIChkZWZhdWx0cyB0byBiZWxvdyB0aGUgZWxlbWVudCkuXG4gKlxuICogaHR0cHM6Ly9tYXRlcmlhbC5pby9kZXNpZ24vY29tcG9uZW50cy90b29sdGlwcy5odG1sXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUb29sdGlwXScsXG4gIGV4cG9ydEFzOiAnbWF0VG9vbHRpcCcsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRvb2x0aXAgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmIHwgbnVsbDtcbiAgX3Rvb2x0aXBJbnN0YW5jZTogVG9vbHRpcENvbXBvbmVudCB8IG51bGw7XG5cbiAgcHJpdmF0ZSBfcG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VG9vbHRpcENvbXBvbmVudD47XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiBUb29sdGlwUG9zaXRpb24gPSAnYmVsb3cnO1xuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIF90b29sdGlwQ2xhc3M6IHN0cmluZ3xzdHJpbmdbXXxTZXQ8c3RyaW5nPnx7W2tleTogc3RyaW5nXTogYW55fTtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIC8qKiBBbGxvd3MgdGhlIHVzZXIgdG8gZGVmaW5lIHRoZSBwb3NpdGlvbiBvZiB0aGUgdG9vbHRpcCByZWxhdGl2ZSB0byB0aGUgcGFyZW50IGVsZW1lbnQgKi9cbiAgQElucHV0KCdtYXRUb29sdGlwUG9zaXRpb24nKVxuICBnZXQgcG9zaXRpb24oKTogVG9vbHRpcFBvc2l0aW9uIHsgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uOyB9XG4gIHNldCBwb3NpdGlvbih2YWx1ZTogVG9vbHRpcFBvc2l0aW9uKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9wb3NpdGlvbikge1xuICAgICAgdGhpcy5fcG9zaXRpb24gPSB2YWx1ZTtcblxuICAgICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcblxuICAgICAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlIS5zaG93KDApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fb3ZlcmxheVJlZi51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBEaXNhYmxlcyB0aGUgZGlzcGxheSBvZiB0aGUgdG9vbHRpcC4gKi9cbiAgQElucHV0KCdtYXRUb29sdGlwRGlzYWJsZWQnKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlZDsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWUpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICAvLyBJZiB0b29sdGlwIGlzIGRpc2FibGVkLCBoaWRlIGltbWVkaWF0ZWx5LlxuICAgIGlmICh0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgdGhpcy5oaWRlKDApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgZGVmYXVsdCBkZWxheSBpbiBtcyBiZWZvcmUgc2hvd2luZyB0aGUgdG9vbHRpcCBhZnRlciBzaG93IGlzIGNhbGxlZCAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBTaG93RGVsYXknKSBzaG93RGVsYXk6IG51bWJlciA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLnNob3dEZWxheTtcblxuICAvKiogVGhlIGRlZmF1bHQgZGVsYXkgaW4gbXMgYmVmb3JlIGhpZGluZyB0aGUgdG9vbHRpcCBhZnRlciBoaWRlIGlzIGNhbGxlZCAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBIaWRlRGVsYXknKSBoaWRlRGVsYXk6IG51bWJlciA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmhpZGVEZWxheTtcblxuICAvKipcbiAgICogSG93IHRvdWNoIGdlc3R1cmVzIHNob3VsZCBiZSBoYW5kbGVkIGJ5IHRoZSB0b29sdGlwLiBPbiB0b3VjaCBkZXZpY2VzIHRoZSB0b29sdGlwIGRpcmVjdGl2ZVxuICAgKiB1c2VzIGEgbG9uZyBwcmVzcyBnZXN0dXJlIHRvIHNob3cgYW5kIGhpZGUsIGhvd2V2ZXIgaXQgY2FuIGNvbmZsaWN0IHdpdGggdGhlIG5hdGl2ZSBicm93c2VyXG4gICAqIGdlc3R1cmVzLiBUbyB3b3JrIGFyb3VuZCB0aGUgY29uZmxpY3QsIEFuZ3VsYXIgTWF0ZXJpYWwgZGlzYWJsZXMgbmF0aXZlIGdlc3R1cmVzIG9uIHRoZVxuICAgKiB0cmlnZ2VyLCBidXQgdGhhdCBtaWdodCBub3QgYmUgZGVzaXJhYmxlIG9uIHBhcnRpY3VsYXIgZWxlbWVudHMgKGUuZy4gaW5wdXRzIGFuZCBkcmFnZ2FibGVcbiAgICogZWxlbWVudHMpLiBUaGUgZGlmZmVyZW50IHZhbHVlcyBmb3IgdGhpcyBvcHRpb24gY29uZmlndXJlIHRoZSB0b3VjaCBldmVudCBoYW5kbGluZyBhcyBmb2xsb3dzOlxuICAgKiAtIGBhdXRvYCAtIEVuYWJsZXMgdG91Y2ggZ2VzdHVyZXMgZm9yIGFsbCBlbGVtZW50cywgYnV0IHRyaWVzIHRvIGF2b2lkIGNvbmZsaWN0cyB3aXRoIG5hdGl2ZVxuICAgKiAgIGJyb3dzZXIgZ2VzdHVyZXMgb24gcGFydGljdWxhciBlbGVtZW50cy4gSW4gcGFydGljdWxhciwgaXQgYWxsb3dzIHRleHQgc2VsZWN0aW9uIG9uIGlucHV0c1xuICAgKiAgIGFuZCB0ZXh0YXJlYXMsIGFuZCBwcmVzZXJ2ZXMgdGhlIG5hdGl2ZSBicm93c2VyIGRyYWdnaW5nIG9uIGVsZW1lbnRzIG1hcmtlZCBhcyBgZHJhZ2dhYmxlYC5cbiAgICogLSBgb25gIC0gRW5hYmxlcyB0b3VjaCBnZXN0dXJlcyBmb3IgYWxsIGVsZW1lbnRzIGFuZCBkaXNhYmxlcyBuYXRpdmVcbiAgICogICBicm93c2VyIGdlc3R1cmVzIHdpdGggbm8gZXhjZXB0aW9ucy5cbiAgICogLSBgb2ZmYCAtIERpc2FibGVzIHRvdWNoIGdlc3R1cmVzLiBOb3RlIHRoYXQgdGhpcyB3aWxsIHByZXZlbnQgdGhlIHRvb2x0aXAgZnJvbVxuICAgKiAgIHNob3dpbmcgb24gdG91Y2ggZGV2aWNlcy5cbiAgICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcFRvdWNoR2VzdHVyZXMnKSB0b3VjaEdlc3R1cmVzOiBUb29sdGlwVG91Y2hHZXN0dXJlcyA9ICdhdXRvJztcblxuICAvKiogVGhlIG1lc3NhZ2UgdG8gYmUgZGlzcGxheWVkIGluIHRoZSB0b29sdGlwICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcCcpXG4gIGdldCBtZXNzYWdlKCkgeyByZXR1cm4gdGhpcy5fbWVzc2FnZTsgfVxuICBzZXQgbWVzc2FnZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbih0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuX21lc3NhZ2UpO1xuXG4gICAgLy8gSWYgdGhlIG1lc3NhZ2UgaXMgbm90IGEgc3RyaW5nIChlLmcuIG51bWJlciksIGNvbnZlcnQgaXQgdG8gYSBzdHJpbmcgYW5kIHRyaW0gaXQuXG4gICAgdGhpcy5fbWVzc2FnZSA9IHZhbHVlICE9IG51bGwgPyBgJHt2YWx1ZX1gLnRyaW0oKSA6ICcnO1xuXG4gICAgaWYgKCF0aGlzLl9tZXNzYWdlICYmIHRoaXMuX2lzVG9vbHRpcFZpc2libGUoKSkge1xuICAgICAgdGhpcy5oaWRlKDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl91cGRhdGVUb29sdGlwTWVzc2FnZSgpO1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgLy8gVGhlIGBBcmlhRGVzY3JpYmVyYCBoYXMgc29tZSBmdW5jdGlvbmFsaXR5IHRoYXQgYXZvaWRzIGFkZGluZyBhIGRlc2NyaXB0aW9uIGlmIGl0J3MgdGhlXG4gICAgICAgIC8vIHNhbWUgYXMgdGhlIGBhcmlhLWxhYmVsYCBvZiBhbiBlbGVtZW50LCBob3dldmVyIHdlIGNhbid0IGtub3cgd2hldGhlciB0aGUgdG9vbHRpcCB0cmlnZ2VyXG4gICAgICAgIC8vIGhhcyBhIGRhdGEtYm91bmQgYGFyaWEtbGFiZWxgIG9yIHdoZW4gaXQnbGwgYmUgc2V0IGZvciB0aGUgZmlyc3QgdGltZS4gV2UgY2FuIGF2b2lkIHRoZVxuICAgICAgICAvLyBpc3N1ZSBieSBkZWZlcnJpbmcgdGhlIGRlc2NyaXB0aW9uIGJ5IGEgdGljayBzbyBBbmd1bGFyIGhhcyB0aW1lIHRvIHNldCB0aGUgYGFyaWEtbGFiZWxgLlxuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLmRlc2NyaWJlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5tZXNzYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfbWVzc2FnZSA9ICcnO1xuXG4gIC8qKiBDbGFzc2VzIHRvIGJlIHBhc3NlZCB0byB0aGUgdG9vbHRpcC4gU3VwcG9ydHMgdGhlIHNhbWUgc3ludGF4IGFzIGBuZ0NsYXNzYC4gKi9cbiAgQElucHV0KCdtYXRUb29sdGlwQ2xhc3MnKVxuICBnZXQgdG9vbHRpcENsYXNzKCkgeyByZXR1cm4gdGhpcy5fdG9vbHRpcENsYXNzOyB9XG4gIHNldCB0b29sdGlwQ2xhc3ModmFsdWU6IHN0cmluZ3xzdHJpbmdbXXxTZXQ8c3RyaW5nPnx7W2tleTogc3RyaW5nXTogYW55fSkge1xuICAgIHRoaXMuX3Rvb2x0aXBDbGFzcyA9IHZhbHVlO1xuICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX3NldFRvb2x0aXBDbGFzcyh0aGlzLl90b29sdGlwQ2xhc3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBNYW51YWxseS1ib3VuZCBwYXNzaXZlIGV2ZW50IGxpc3RlbmVycy4gKi9cbiAgcHJpdmF0ZSBfcGFzc2l2ZUxpc3RlbmVycyA9IG5ldyBNYXA8c3RyaW5nLCBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0PigpO1xuXG4gIC8qKiBUaW1lciBzdGFydGVkIGF0IHRoZSBsYXN0IGB0b3VjaHN0YXJ0YCBldmVudC4gKi9cbiAgcHJpdmF0ZSBfdG91Y2hzdGFydFRpbWVvdXQ6IG51bWJlcjtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX3Njcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgcHJpdmF0ZSBfYXJpYURlc2NyaWJlcjogQXJpYURlc2NyaWJlcixcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBASW5qZWN0KE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1RPT0xUSVBfREVGQVVMVF9PUFRJT05TKVxuICAgICAgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM6IE1hdFRvb2x0aXBEZWZhdWx0T3B0aW9ucyxcbiAgICAgIC8qKlxuICAgICAgICogQGRlcHJlY2F0ZWQgX2hhbW1lckxvYWRlciBwYXJhbWV0ZXIgdG8gYmUgcmVtb3ZlZC5cbiAgICAgICAqIEBicmVha2luZy1jaGFuZ2UgOS4wLjBcbiAgICAgICAqL1xuICAgICAgLy8gTm90ZSB0aGF0IHdlIG5lZWQgdG8gZ2l2ZSBBbmd1bGFyIHNvbWV0aGluZyB0byBpbmplY3QgaGVyZSBzbyBpdCBkb2Vzbid0IHRocm93LlxuICAgICAgQEluamVjdChFbGVtZW50UmVmKSBfaGFtbWVyTG9hZGVyPzogYW55KSB7XG5cbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneSA9IHNjcm9sbFN0cmF0ZWd5O1xuXG4gICAgaWYgKF9kZWZhdWx0T3B0aW9ucykge1xuICAgICAgaWYgKF9kZWZhdWx0T3B0aW9ucy5wb3NpdGlvbikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gX2RlZmF1bHRPcHRpb25zLnBvc2l0aW9uO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2RlZmF1bHRPcHRpb25zLnRvdWNoR2VzdHVyZXMpIHtcbiAgICAgICAgdGhpcy50b3VjaEdlc3R1cmVzID0gX2RlZmF1bHRPcHRpb25zLnRvdWNoR2VzdHVyZXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2ZvY3VzTW9uaXRvci5tb25pdG9yKF9lbGVtZW50UmVmKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKG9yaWdpbiA9PiB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCB0aGUgZm9jdXMgbW9uaXRvciBydW5zIG91dHNpZGUgdGhlIEFuZ3VsYXIgem9uZS5cbiAgICAgICAgaWYgKCFvcmlnaW4pIHtcbiAgICAgICAgICBfbmdab25lLnJ1bigoKSA9PiB0aGlzLmhpZGUoMCkpO1xuICAgICAgICB9IGVsc2UgaWYgKG9yaWdpbiA9PT0gJ2tleWJvYXJkJykge1xuICAgICAgICAgIF9uZ1pvbmUucnVuKCgpID0+IHRoaXMuc2hvdygpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9oYW5kbGVLZXlkb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR1cCBzdHlsaW5nLXNwZWNpZmljIHRoaW5nc1xuICAgKi9cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gVGhpcyBuZWVkcyB0byBoYXBwZW4gaW4gYG5nT25Jbml0YCBzbyB0aGUgaW5pdGlhbCB2YWx1ZXMgZm9yIGFsbCBpbnB1dHMgaGF2ZSBiZWVuIHNldC5cbiAgICB0aGlzLl9zZXR1cFBvaW50ZXJFdmVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwb3NlIHRoZSB0b29sdGlwIHdoZW4gZGVzdHJveWVkLlxuICAgKi9cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGNsZWFyVGltZW91dCh0aGlzLl90b3VjaHN0YXJ0VGltZW91dCk7XG5cbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIENsZWFuIHVwIHRoZSBldmVudCBsaXN0ZW5lcnMgc2V0IGluIHRoZSBjb25zdHJ1Y3RvclxuICAgIG5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2hhbmRsZUtleWRvd24pO1xuICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIsIGV2ZW50KSA9PiB7XG4gICAgICBuYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBwYXNzaXZlTGlzdGVuZXJPcHRpb25zKTtcbiAgICB9KTtcbiAgICB0aGlzLl9wYXNzaXZlTGlzdGVuZXJzLmNsZWFyKCk7XG5cbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuXG4gICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbihuYXRpdmVFbGVtZW50LCB0aGlzLm1lc3NhZ2UpO1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyhuYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBTaG93cyB0aGUgdG9vbHRpcCBhZnRlciB0aGUgZGVsYXkgaW4gbXMsIGRlZmF1bHRzIHRvIHRvb2x0aXAtZGVsYXktc2hvdyBvciAwbXMgaWYgbm8gaW5wdXQgKi9cbiAgc2hvdyhkZWxheTogbnVtYmVyID0gdGhpcy5zaG93RGVsYXkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5tZXNzYWdlIHx8ICh0aGlzLl9pc1Rvb2x0aXBWaXNpYmxlKCkgJiZcbiAgICAgICF0aGlzLl90b29sdGlwSW5zdGFuY2UhLl9zaG93VGltZW91dElkICYmICF0aGlzLl90b29sdGlwSW5zdGFuY2UhLl9oaWRlVGltZW91dElkKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXkoKTtcblxuICAgIHRoaXMuX2RldGFjaCgpO1xuICAgIHRoaXMuX3BvcnRhbCA9IHRoaXMuX3BvcnRhbCB8fCBuZXcgQ29tcG9uZW50UG9ydGFsKFRvb2x0aXBDb21wb25lbnQsIHRoaXMuX3ZpZXdDb250YWluZXJSZWYpO1xuICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSA9IG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX3BvcnRhbCkuaW5zdGFuY2U7XG4gICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLmFmdGVySGlkZGVuKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9kZXRhY2goKSk7XG4gICAgdGhpcy5fc2V0VG9vbHRpcENsYXNzKHRoaXMuX3Rvb2x0aXBDbGFzcyk7XG4gICAgdGhpcy5fdXBkYXRlVG9vbHRpcE1lc3NhZ2UoKTtcbiAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UhLnNob3coZGVsYXkpO1xuICB9XG5cbiAgLyoqIEhpZGVzIHRoZSB0b29sdGlwIGFmdGVyIHRoZSBkZWxheSBpbiBtcywgZGVmYXVsdHMgdG8gdG9vbHRpcC1kZWxheS1oaWRlIG9yIDBtcyBpZiBubyBpbnB1dCAqL1xuICBoaWRlKGRlbGF5OiBudW1iZXIgPSB0aGlzLmhpZGVEZWxheSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5oaWRlKGRlbGF5KTtcbiAgICB9XG4gIH1cblxuICAvKiogU2hvd3MvaGlkZXMgdGhlIHRvb2x0aXAgKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIHRoaXMuX2lzVG9vbHRpcFZpc2libGUoKSA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KCk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSB0b29sdGlwIGlzIGN1cnJlbnRseSB2aXNpYmxlIHRvIHRoZSB1c2VyICovXG4gIF9pc1Rvb2x0aXBWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuX3Rvb2x0aXBJbnN0YW5jZSAmJiB0aGlzLl90b29sdGlwSW5zdGFuY2UuaXNWaXNpYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUga2V5ZG93biBldmVudHMgb24gdGhlIGhvc3QgZWxlbWVudC5cbiAgICogTmVlZHMgdG8gYmUgYW4gYXJyb3cgZnVuY3Rpb24gc28gdGhhdCB3ZSBjYW4gdXNlIGl0IGluIGFkZEV2ZW50TGlzdGVuZXIuXG4gICAqL1xuICBwcml2YXRlIF9oYW5kbGVLZXlkb3duID0gKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuX2lzVG9vbHRpcFZpc2libGUoKSAmJiBldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLmhpZGUoMCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDcmVhdGUgdGhlIG92ZXJsYXkgY29uZmlnIGFuZCBwb3NpdGlvbiBzdHJhdGVneSAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KCk6IE92ZXJsYXlSZWYge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVJlZjtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JvbGxhYmxlQW5jZXN0b3JzID1cbiAgICAgICAgdGhpcy5fc2Nyb2xsRGlzcGF0Y2hlci5nZXRBbmNlc3RvclNjcm9sbENvbnRhaW5lcnModGhpcy5fZWxlbWVudFJlZik7XG5cbiAgICAvLyBDcmVhdGUgY29ubmVjdGVkIHBvc2l0aW9uIHN0cmF0ZWd5IHRoYXQgbGlzdGVucyBmb3Igc2Nyb2xsIGV2ZW50cyB0byByZXBvc2l0aW9uLlxuICAgIGNvbnN0IHN0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5fZWxlbWVudFJlZilcbiAgICAgICAgICAgICAgICAgICAgICAgICAud2l0aFRyYW5zZm9ybU9yaWdpbk9uKCcubWF0LXRvb2x0aXAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgIC53aXRoRmxleGlibGVEaW1lbnNpb25zKGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgIC53aXRoVmlld3BvcnRNYXJnaW4oOClcbiAgICAgICAgICAgICAgICAgICAgICAgICAud2l0aFNjcm9sbGFibGVDb250YWluZXJzKHNjcm9sbGFibGVBbmNlc3RvcnMpO1xuXG4gICAgc3RyYXRlZ3kucG9zaXRpb25DaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShjaGFuZ2UgPT4ge1xuICAgICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgICBpZiAoY2hhbmdlLnNjcm9sbGFibGVWaWV3UHJvcGVydGllcy5pc092ZXJsYXlDbGlwcGVkICYmIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5pc1Zpc2libGUoKSkge1xuICAgICAgICAgIC8vIEFmdGVyIHBvc2l0aW9uIGNoYW5nZXMgb2NjdXIgYW5kIHRoZSBvdmVybGF5IGlzIGNsaXBwZWQgYnlcbiAgICAgICAgICAvLyBhIHBhcmVudCBzY3JvbGxhYmxlIHRoZW4gY2xvc2UgdGhlIHRvb2x0aXAuXG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLmhpZGUoMCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUoe1xuICAgICAgZGlyZWN0aW9uOiB0aGlzLl9kaXIsXG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiBzdHJhdGVneSxcbiAgICAgIHBhbmVsQ2xhc3M6IFRPT0xUSVBfUEFORUxfQ0xBU1MsXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKVxuICAgIH0pO1xuXG4gICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcblxuICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNobWVudHMoKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2RldGFjaCgpKTtcblxuICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmO1xuICB9XG5cbiAgLyoqIERldGFjaGVzIHRoZSBjdXJyZW50bHktYXR0YWNoZWQgdG9vbHRpcC4gKi9cbiAgcHJpdmF0ZSBfZGV0YWNoKCkge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmICYmIHRoaXMuX292ZXJsYXlSZWYuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2goKTtcbiAgICB9XG5cbiAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IHRvb2x0aXAuICovXG4gIHByaXZhdGUgX3VwZGF0ZVBvc2l0aW9uKCkge1xuICAgIGNvbnN0IHBvc2l0aW9uID1cbiAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEuZ2V0Q29uZmlnKCkucG9zaXRpb25TdHJhdGVneSBhcyBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3k7XG4gICAgY29uc3Qgb3JpZ2luID0gdGhpcy5fZ2V0T3JpZ2luKCk7XG4gICAgY29uc3Qgb3ZlcmxheSA9IHRoaXMuX2dldE92ZXJsYXlQb3NpdGlvbigpO1xuXG4gICAgcG9zaXRpb24ud2l0aFBvc2l0aW9ucyhbXG4gICAgICB7Li4ub3JpZ2luLm1haW4sIC4uLm92ZXJsYXkubWFpbn0sXG4gICAgICB7Li4ub3JpZ2luLmZhbGxiYWNrLCAuLi5vdmVybGF5LmZhbGxiYWNrfVxuICAgIF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9yaWdpbiBwb3NpdGlvbiBhbmQgYSBmYWxsYmFjayBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgdXNlcidzIHBvc2l0aW9uIHByZWZlcmVuY2UuXG4gICAqIFRoZSBmYWxsYmFjayBwb3NpdGlvbiBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgb3JpZ2luIChlLmcuIGAnYmVsb3cnIC0+ICdhYm92ZSdgKS5cbiAgICovXG4gIF9nZXRPcmlnaW4oKToge21haW46IE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbiwgZmFsbGJhY2s6IE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbn0ge1xuICAgIGNvbnN0IGlzTHRyID0gIXRoaXMuX2RpciB8fCB0aGlzLl9kaXIudmFsdWUgPT0gJ2x0cic7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xuICAgIGxldCBvcmlnaW5Qb3NpdGlvbjogT3JpZ2luQ29ubmVjdGlvblBvc2l0aW9uO1xuXG4gICAgaWYgKHBvc2l0aW9uID09ICdhYm92ZScgfHwgcG9zaXRpb24gPT0gJ2JlbG93Jykge1xuICAgICAgb3JpZ2luUG9zaXRpb24gPSB7b3JpZ2luWDogJ2NlbnRlcicsIG9yaWdpblk6IHBvc2l0aW9uID09ICdhYm92ZScgPyAndG9wJyA6ICdib3R0b20nfTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgcG9zaXRpb24gPT0gJ2JlZm9yZScgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAnbGVmdCcgJiYgaXNMdHIpIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ3JpZ2h0JyAmJiAhaXNMdHIpKSB7XG4gICAgICBvcmlnaW5Qb3NpdGlvbiA9IHtvcmlnaW5YOiAnc3RhcnQnLCBvcmlnaW5ZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBvc2l0aW9uID09ICdhZnRlcicgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmIGlzTHRyKSB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiAhaXNMdHIpKSB7XG4gICAgICBvcmlnaW5Qb3NpdGlvbiA9IHtvcmlnaW5YOiAnZW5kJywgb3JpZ2luWTogJ2NlbnRlcid9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBnZXRNYXRUb29sdGlwSW52YWxpZFBvc2l0aW9uRXJyb3IocG9zaXRpb24pO1xuICAgIH1cblxuICAgIGNvbnN0IHt4LCB5fSA9IHRoaXMuX2ludmVydFBvc2l0aW9uKG9yaWdpblBvc2l0aW9uLm9yaWdpblgsIG9yaWdpblBvc2l0aW9uLm9yaWdpblkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1haW46IG9yaWdpblBvc2l0aW9uLFxuICAgICAgZmFsbGJhY2s6IHtvcmlnaW5YOiB4LCBvcmlnaW5ZOiB5fVxuICAgIH07XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgb3ZlcmxheSBwb3NpdGlvbiBhbmQgYSBmYWxsYmFjayBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgdXNlcidzIHByZWZlcmVuY2UgKi9cbiAgX2dldE92ZXJsYXlQb3NpdGlvbigpOiB7bWFpbjogT3ZlcmxheUNvbm5lY3Rpb25Qb3NpdGlvbiwgZmFsbGJhY2s6IE92ZXJsYXlDb25uZWN0aW9uUG9zaXRpb259IHtcbiAgICBjb25zdCBpc0x0ciA9ICF0aGlzLl9kaXIgfHwgdGhpcy5fZGlyLnZhbHVlID09ICdsdHInO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcbiAgICBsZXQgb3ZlcmxheVBvc2l0aW9uOiBPdmVybGF5Q29ubmVjdGlvblBvc2l0aW9uO1xuXG4gICAgaWYgKHBvc2l0aW9uID09ICdhYm92ZScpIHtcbiAgICAgIG92ZXJsYXlQb3NpdGlvbiA9IHtvdmVybGF5WDogJ2NlbnRlcicsIG92ZXJsYXlZOiAnYm90dG9tJ307XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvbiA9PSAnYmVsb3cnKSB7XG4gICAgICBvdmVybGF5UG9zaXRpb24gPSB7b3ZlcmxheVg6ICdjZW50ZXInLCBvdmVybGF5WTogJ3RvcCd9O1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBwb3NpdGlvbiA9PSAnYmVmb3JlJyB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiBpc0x0cikgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmICFpc0x0cikpIHtcbiAgICAgIG92ZXJsYXlQb3NpdGlvbiA9IHtvdmVybGF5WDogJ2VuZCcsIG92ZXJsYXlZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBvc2l0aW9uID09ICdhZnRlcicgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmIGlzTHRyKSB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiAhaXNMdHIpKSB7XG4gICAgICBvdmVybGF5UG9zaXRpb24gPSB7b3ZlcmxheVg6ICdzdGFydCcsIG92ZXJsYXlZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGdldE1hdFRvb2x0aXBJbnZhbGlkUG9zaXRpb25FcnJvcihwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgY29uc3Qge3gsIHl9ID0gdGhpcy5faW52ZXJ0UG9zaXRpb24ob3ZlcmxheVBvc2l0aW9uLm92ZXJsYXlYLCBvdmVybGF5UG9zaXRpb24ub3ZlcmxheVkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1haW46IG92ZXJsYXlQb3NpdGlvbixcbiAgICAgIGZhbGxiYWNrOiB7b3ZlcmxheVg6IHgsIG92ZXJsYXlZOiB5fVxuICAgIH07XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgdG9vbHRpcCBtZXNzYWdlIGFuZCByZXBvc2l0aW9ucyB0aGUgb3ZlcmxheSBhY2NvcmRpbmcgdG8gdGhlIG5ldyBtZXNzYWdlIGxlbmd0aCAqL1xuICBwcml2YXRlIF91cGRhdGVUb29sdGlwTWVzc2FnZSgpIHtcbiAgICAvLyBNdXN0IHdhaXQgZm9yIHRoZSBtZXNzYWdlIHRvIGJlIHBhaW50ZWQgdG8gdGhlIHRvb2x0aXAgc28gdGhhdCB0aGUgb3ZlcmxheSBjYW4gcHJvcGVybHlcbiAgICAvLyBjYWxjdWxhdGUgdGhlIGNvcnJlY3QgcG9zaXRpb25pbmcgYmFzZWQgb24gdGhlIHNpemUgb2YgdGhlIHRleHQuXG4gICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLm1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2U7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UuX21hcmtGb3JDaGVjaygpO1xuXG4gICAgICB0aGlzLl9uZ1pvbmUub25NaWNyb3Rhc2tFbXB0eS5hc09ic2VydmFibGUoKS5waXBlKFxuICAgICAgICB0YWtlKDEpLFxuICAgICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKVxuICAgICAgKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHRvb2x0aXAgY2xhc3MgKi9cbiAgcHJpdmF0ZSBfc2V0VG9vbHRpcENsYXNzKHRvb2x0aXBDbGFzczogc3RyaW5nfHN0cmluZ1tdfFNldDxzdHJpbmc+fHtba2V5OiBzdHJpbmddOiBhbnl9KSB7XG4gICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLnRvb2x0aXBDbGFzcyA9IHRvb2x0aXBDbGFzcztcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5fbWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEludmVydHMgYW4gb3ZlcmxheSBwb3NpdGlvbi4gKi9cbiAgcHJpdmF0ZSBfaW52ZXJ0UG9zaXRpb24oeDogSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3MsIHk6IFZlcnRpY2FsQ29ubmVjdGlvblBvcykge1xuICAgIGlmICh0aGlzLnBvc2l0aW9uID09PSAnYWJvdmUnIHx8IHRoaXMucG9zaXRpb24gPT09ICdiZWxvdycpIHtcbiAgICAgIGlmICh5ID09PSAndG9wJykge1xuICAgICAgICB5ID0gJ2JvdHRvbSc7XG4gICAgICB9IGVsc2UgaWYgKHkgPT09ICdib3R0b20nKSB7XG4gICAgICAgIHkgPSAndG9wJztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHggPT09ICdlbmQnKSB7XG4gICAgICAgIHggPSAnc3RhcnQnO1xuICAgICAgfSBlbHNlIGlmICh4ID09PSAnc3RhcnQnKSB7XG4gICAgICAgIHggPSAnZW5kJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge3gsIHl9O1xuICB9XG5cbiAgLyoqIEJpbmRzIHRoZSBwb2ludGVyIGV2ZW50cyB0byB0aGUgdG9vbHRpcCB0cmlnZ2VyLiAqL1xuICBwcml2YXRlIF9zZXR1cFBvaW50ZXJFdmVudHMoKSB7XG4gICAgLy8gVGhlIG1vdXNlIGV2ZW50cyBzaG91bGRuJ3QgYmUgYm91bmQgb24gbW9iaWxlIGRldmljZXMsIGJlY2F1c2UgdGhleSBjYW4gcHJldmVudCB0aGVcbiAgICAvLyBmaXJzdCB0YXAgZnJvbSBmaXJpbmcgaXRzIGNsaWNrIGV2ZW50IG9yIGNhbiBjYXVzZSB0aGUgdG9vbHRpcCB0byBvcGVuIGZvciBjbGlja3MuXG4gICAgaWYgKCF0aGlzLl9wbGF0Zm9ybS5JT1MgJiYgIXRoaXMuX3BsYXRmb3JtLkFORFJPSUQpIHtcbiAgICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnNcbiAgICAgICAgLnNldCgnbW91c2VlbnRlcicsICgpID0+IHRoaXMuc2hvdygpKVxuICAgICAgICAuc2V0KCdtb3VzZWxlYXZlJywgKCkgPT4gdGhpcy5oaWRlKCkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy50b3VjaEdlc3R1cmVzICE9PSAnb2ZmJykge1xuICAgICAgdGhpcy5fZGlzYWJsZU5hdGl2ZUdlc3R1cmVzSWZOZWNlc3NhcnkoKTtcbiAgICAgIGNvbnN0IHRvdWNoZW5kTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90b3VjaHN0YXJ0VGltZW91dCk7XG4gICAgICAgIHRoaXMuaGlkZSh0aGlzLl9kZWZhdWx0T3B0aW9ucy50b3VjaGVuZEhpZGVEZWxheSk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLl9wYXNzaXZlTGlzdGVuZXJzXG4gICAgICAgIC5zZXQoJ3RvdWNoZW5kJywgdG91Y2hlbmRMaXN0ZW5lcilcbiAgICAgICAgLnNldCgndG91Y2hjYW5jZWwnLCB0b3VjaGVuZExpc3RlbmVyKVxuICAgICAgICAuc2V0KCd0b3VjaHN0YXJ0JywgKCkgPT4ge1xuICAgICAgICAgIC8vIE5vdGUgdGhhdCBpdCdzIGltcG9ydGFudCB0aGF0IHdlIGRvbid0IGBwcmV2ZW50RGVmYXVsdGAgaGVyZSxcbiAgICAgICAgICAvLyBiZWNhdXNlIGl0IGNhbiBwcmV2ZW50IGNsaWNrIGV2ZW50cyBmcm9tIGZpcmluZyBvbiB0aGUgZWxlbWVudC5cbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdG91Y2hzdGFydFRpbWVvdXQpO1xuICAgICAgICAgIHRoaXMuX3RvdWNoc3RhcnRUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNob3coKSwgTE9OR1BSRVNTX0RFTEFZKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fcGFzc2l2ZUxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lciwgZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgcGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogRGlzYWJsZXMgdGhlIG5hdGl2ZSBicm93c2VyIGdlc3R1cmVzLCBiYXNlZCBvbiBob3cgdGhlIHRvb2x0aXAgaGFzIGJlZW4gY29uZmlndXJlZC4gKi9cbiAgcHJpdmF0ZSBfZGlzYWJsZU5hdGl2ZUdlc3R1cmVzSWZOZWNlc3NhcnkoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBzdHlsZSA9IGVsZW1lbnQuc3R5bGU7XG4gICAgY29uc3QgZ2VzdHVyZXMgPSB0aGlzLnRvdWNoR2VzdHVyZXM7XG5cbiAgICBpZiAoZ2VzdHVyZXMgIT09ICdvZmYnKSB7XG4gICAgICAvLyBJZiBnZXN0dXJlcyBhcmUgc2V0IHRvIGBhdXRvYCwgd2UgZG9uJ3QgZGlzYWJsZSB0ZXh0IHNlbGVjdGlvbiBvbiBpbnB1dHMgYW5kXG4gICAgICAvLyB0ZXh0YXJlYXMsIGJlY2F1c2UgaXQgcHJldmVudHMgdGhlIHVzZXIgZnJvbSB0eXBpbmcgaW50byB0aGVtIG9uIGlPUyBTYWZhcmkuXG4gICAgICBpZiAoZ2VzdHVyZXMgPT09ICdvbicgfHwgKGVsZW1lbnQubm9kZU5hbWUgIT09ICdJTlBVVCcgJiYgZWxlbWVudC5ub2RlTmFtZSAhPT0gJ1RFWFRBUkVBJykpIHtcbiAgICAgICAgc3R5bGUudXNlclNlbGVjdCA9IHN0eWxlLm1zVXNlclNlbGVjdCA9IHN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPVxuICAgICAgICAgICAgKHN0eWxlIGFzIGFueSkuTW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgaGF2ZSBgYXV0b2AgZ2VzdHVyZXMgYW5kIHRoZSBlbGVtZW50IHVzZXMgbmF0aXZlIEhUTUwgZHJhZ2dpbmcsXG4gICAgICAvLyB3ZSBkb24ndCBzZXQgYC13ZWJraXQtdXNlci1kcmFnYCBiZWNhdXNlIGl0IHByZXZlbnRzIHRoZSBuYXRpdmUgYmVoYXZpb3IuXG4gICAgICBpZiAoZ2VzdHVyZXMgPT09ICdvbicgfHwgIWVsZW1lbnQuZHJhZ2dhYmxlKSB7XG4gICAgICAgIChzdHlsZSBhcyBhbnkpLndlYmtpdFVzZXJEcmFnID0gJ25vbmUnO1xuICAgICAgfVxuXG4gICAgICBzdHlsZS50b3VjaEFjdGlvbiA9ICdub25lJztcbiAgICAgIHN0eWxlLndlYmtpdFRhcEhpZ2hsaWdodENvbG9yID0gJ3RyYW5zcGFyZW50JztcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hpZGVEZWxheTogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zaG93RGVsYXk6IE51bWJlcklucHV0O1xufVxuXG4vKipcbiAqIEludGVybmFsIGNvbXBvbmVudCB0aGF0IHdyYXBzIHRoZSB0b29sdGlwJ3MgY29udGVudC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRvb2x0aXAtY29tcG9uZW50JyxcbiAgdGVtcGxhdGVVcmw6ICd0b29sdGlwLmh0bWwnLFxuICBzdHlsZVVybHM6IFsndG9vbHRpcC5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGFuaW1hdGlvbnM6IFttYXRUb29sdGlwQW5pbWF0aW9ucy50b29sdGlwU3RhdGVdLFxuICBob3N0OiB7XG4gICAgLy8gRm9yY2VzIHRoZSBlbGVtZW50IHRvIGhhdmUgYSBsYXlvdXQgaW4gSUUgYW5kIEVkZ2UuIFRoaXMgZml4ZXMgaXNzdWVzIHdoZXJlIHRoZSBlbGVtZW50XG4gICAgLy8gd29uJ3QgYmUgcmVuZGVyZWQgaWYgdGhlIGFuaW1hdGlvbnMgYXJlIGRpc2FibGVkIG9yIHRoZXJlIGlzIG5vIHdlYiBhbmltYXRpb25zIHBvbHlmaWxsLlxuICAgICdbc3R5bGUuem9vbV0nOiAnX3Zpc2liaWxpdHkgPT09IFwidmlzaWJsZVwiID8gMSA6IG51bGwnLFxuICAgICcoYm9keTpjbGljayknOiAndGhpcy5faGFuZGxlQm9keUludGVyYWN0aW9uKCknLFxuICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBUb29sdGlwQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqIE1lc3NhZ2UgdG8gZGlzcGxheSBpbiB0aGUgdG9vbHRpcCAqL1xuICBtZXNzYWdlOiBzdHJpbmc7XG5cbiAgLyoqIENsYXNzZXMgdG8gYmUgYWRkZWQgdG8gdGhlIHRvb2x0aXAuIFN1cHBvcnRzIHRoZSBzYW1lIHN5bnRheCBhcyBgbmdDbGFzc2AuICovXG4gIHRvb2x0aXBDbGFzczogc3RyaW5nfHN0cmluZ1tdfFNldDxzdHJpbmc+fHtba2V5OiBzdHJpbmddOiBhbnl9O1xuXG4gIC8qKiBUaGUgdGltZW91dCBJRCBvZiBhbnkgY3VycmVudCB0aW1lciBzZXQgdG8gc2hvdyB0aGUgdG9vbHRpcCAqL1xuICBfc2hvd1RpbWVvdXRJZDogbnVtYmVyIHwgbnVsbDtcblxuICAvKiogVGhlIHRpbWVvdXQgSUQgb2YgYW55IGN1cnJlbnQgdGltZXIgc2V0IHRvIGhpZGUgdGhlIHRvb2x0aXAgKi9cbiAgX2hpZGVUaW1lb3V0SWQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFByb3BlcnR5IHdhdGNoZWQgYnkgdGhlIGFuaW1hdGlvbiBmcmFtZXdvcmsgdG8gc2hvdyBvciBoaWRlIHRoZSB0b29sdGlwICovXG4gIF92aXNpYmlsaXR5OiBUb29sdGlwVmlzaWJpbGl0eSA9ICdpbml0aWFsJztcblxuICAvKiogV2hldGhlciBpbnRlcmFjdGlvbnMgb24gdGhlIHBhZ2Ugc2hvdWxkIGNsb3NlIHRoZSB0b29sdGlwICovXG4gIHByaXZhdGUgX2Nsb3NlT25JbnRlcmFjdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhhdCB0aGUgdG9vbHRpcCBoYXMgYmVlbiBoaWRkZW4gZnJvbSB0aGUgdmlldyAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9vbkhpZGU6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZXRoZXIgdGhlIHVzZXIgaGFzIGEgaGFuZHNldC1zaXplZCBkaXNwbGF5LiAgKi9cbiAgX2lzSGFuZHNldDogT2JzZXJ2YWJsZTxCcmVha3BvaW50U3RhdGU+ID0gdGhpcy5fYnJlYWtwb2ludE9ic2VydmVyLm9ic2VydmUoQnJlYWtwb2ludHMuSGFuZHNldCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2JyZWFrcG9pbnRPYnNlcnZlcjogQnJlYWtwb2ludE9ic2VydmVyKSB7fVxuXG4gIC8qKlxuICAgKiBTaG93cyB0aGUgdG9vbHRpcCB3aXRoIGFuIGFuaW1hdGlvbiBvcmlnaW5hdGluZyBmcm9tIHRoZSBwcm92aWRlZCBvcmlnaW5cbiAgICogQHBhcmFtIGRlbGF5IEFtb3VudCBvZiBtaWxsaXNlY29uZHMgdG8gdGhlIGRlbGF5IHNob3dpbmcgdGhlIHRvb2x0aXAuXG4gICAqL1xuICBzaG93KGRlbGF5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBDYW5jZWwgdGhlIGRlbGF5ZWQgaGlkZSBpZiBpdCBpcyBzY2hlZHVsZWRcbiAgICBpZiAodGhpcy5faGlkZVRpbWVvdXRJZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2hpZGVUaW1lb3V0SWQpO1xuICAgICAgdGhpcy5faGlkZVRpbWVvdXRJZCA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gQm9keSBpbnRlcmFjdGlvbnMgc2hvdWxkIGNhbmNlbCB0aGUgdG9vbHRpcCBpZiB0aGVyZSBpcyBhIGRlbGF5IGluIHNob3dpbmcuXG4gICAgdGhpcy5fY2xvc2VPbkludGVyYWN0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLl9zaG93VGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl92aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgdGhpcy5fc2hvd1RpbWVvdXRJZCA9IG51bGw7XG5cbiAgICAgIC8vIE1hcmsgZm9yIGNoZWNrIHNvIGlmIGFueSBwYXJlbnQgY29tcG9uZW50IGhhcyBzZXQgdGhlXG4gICAgICAvLyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB0byBPblB1c2ggaXQgd2lsbCBiZSBjaGVja2VkIGFueXdheXNcbiAgICAgIHRoaXMuX21hcmtGb3JDaGVjaygpO1xuICAgIH0sIGRlbGF5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCZWdpbnMgdGhlIGFuaW1hdGlvbiB0byBoaWRlIHRoZSB0b29sdGlwIGFmdGVyIHRoZSBwcm92aWRlZCBkZWxheSBpbiBtcy5cbiAgICogQHBhcmFtIGRlbGF5IEFtb3VudCBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkgc2hvd2luZyB0aGUgdG9vbHRpcC5cbiAgICovXG4gIGhpZGUoZGVsYXk6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIENhbmNlbCB0aGUgZGVsYXllZCBzaG93IGlmIGl0IGlzIHNjaGVkdWxlZFxuICAgIGlmICh0aGlzLl9zaG93VGltZW91dElkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fc2hvd1RpbWVvdXRJZCk7XG4gICAgICB0aGlzLl9zaG93VGltZW91dElkID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl9oaWRlVGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl92aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICB0aGlzLl9oaWRlVGltZW91dElkID0gbnVsbDtcblxuICAgICAgLy8gTWFyayBmb3IgY2hlY2sgc28gaWYgYW55IHBhcmVudCBjb21wb25lbnQgaGFzIHNldCB0aGVcbiAgICAgIC8vIENoYW5nZURldGVjdGlvblN0cmF0ZWd5IHRvIE9uUHVzaCBpdCB3aWxsIGJlIGNoZWNrZWQgYW55d2F5c1xuICAgICAgdGhpcy5fbWFya0ZvckNoZWNrKCk7XG4gICAgfSwgZGVsYXkpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYW4gb2JzZXJ2YWJsZSB0aGF0IG5vdGlmaWVzIHdoZW4gdGhlIHRvb2x0aXAgaGFzIGJlZW4gaGlkZGVuIGZyb20gdmlldy4gKi9cbiAgYWZ0ZXJIaWRkZW4oKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX29uSGlkZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSB0b29sdGlwIGlzIGJlaW5nIGRpc3BsYXllZC4gKi9cbiAgaXNWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmlsaXR5ID09PSAndmlzaWJsZSc7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9vbkhpZGUuY29tcGxldGUoKTtcbiAgfVxuXG4gIF9hbmltYXRpb25TdGFydCgpIHtcbiAgICB0aGlzLl9jbG9zZU9uSW50ZXJhY3Rpb24gPSBmYWxzZTtcbiAgfVxuXG4gIF9hbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IHRvU3RhdGUgPSBldmVudC50b1N0YXRlIGFzIFRvb2x0aXBWaXNpYmlsaXR5O1xuXG4gICAgaWYgKHRvU3RhdGUgPT09ICdoaWRkZW4nICYmICF0aGlzLmlzVmlzaWJsZSgpKSB7XG4gICAgICB0aGlzLl9vbkhpZGUubmV4dCgpO1xuICAgIH1cblxuICAgIGlmICh0b1N0YXRlID09PSAndmlzaWJsZScgfHwgdG9TdGF0ZSA9PT0gJ2hpZGRlbicpIHtcbiAgICAgIHRoaXMuX2Nsb3NlT25JbnRlcmFjdGlvbiA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEludGVyYWN0aW9ucyBvbiB0aGUgSFRNTCBib2R5IHNob3VsZCBjbG9zZSB0aGUgdG9vbHRpcCBpbW1lZGlhdGVseSBhcyBkZWZpbmVkIGluIHRoZVxuICAgKiBtYXRlcmlhbCBkZXNpZ24gc3BlYy5cbiAgICogaHR0cHM6Ly9tYXRlcmlhbC5pby9kZXNpZ24vY29tcG9uZW50cy90b29sdGlwcy5odG1sI2JlaGF2aW9yXG4gICAqL1xuICBfaGFuZGxlQm9keUludGVyYWN0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jbG9zZU9uSW50ZXJhY3Rpb24pIHtcbiAgICAgIHRoaXMuaGlkZSgwKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhhdCB0aGUgdG9vbHRpcCBuZWVkcyB0byBiZSBjaGVja2VkIGluIHRoZSBuZXh0IGNoYW5nZSBkZXRlY3Rpb24gcnVuLlxuICAgKiBNYWlubHkgdXNlZCBmb3IgcmVuZGVyaW5nIHRoZSBpbml0aWFsIHRleHQgYmVmb3JlIHBvc2l0aW9uaW5nIGEgdG9vbHRpcCwgd2hpY2hcbiAgICogY2FuIGJlIHByb2JsZW1hdGljIGluIGNvbXBvbmVudHMgd2l0aCBPblB1c2ggY2hhbmdlIGRldGVjdGlvbi5cbiAgICovXG4gIF9tYXJrRm9yQ2hlY2soKTogdm9pZCB7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbn1cbiJdfQ==