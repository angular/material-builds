import * as tslib_1 from "tslib";
import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Overlay, } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ComponentPortal } from '@angular/cdk/portal';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, Inject, InjectionToken, Input, NgZone, Optional, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { matTooltipAnimations } from './tooltip-animations';
/** Time in ms to throttle repositioning after scroll events. */
export var SCROLL_THROTTLE_MS = 20;
/** CSS class that will be attached to the overlay panel. */
export var TOOLTIP_PANEL_CLASS = 'mat-tooltip-panel';
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
    function MatTooltip(_overlay, _elementRef, _scrollDispatcher, _viewContainerRef, _ngZone, platform, _ariaDescriber, _focusMonitor, scrollStrategy, _dir, _defaultOptions, hammerLoader) {
        var _this = this;
        this._overlay = _overlay;
        this._elementRef = _elementRef;
        this._scrollDispatcher = _scrollDispatcher;
        this._viewContainerRef = _viewContainerRef;
        this._ngZone = _ngZone;
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
        this._message = '';
        this._manualListeners = new Map();
        /** Emits when the component is destroyed. */
        this._destroyed = new Subject();
        this._scrollStrategy = scrollStrategy;
        var element = _elementRef.nativeElement;
        var hasGestures = typeof window === 'undefined' || window.Hammer || hammerLoader;
        // The mouse events shouldn't be bound on mobile devices, because they can prevent the
        // first tap from firing its click event or can cause the tooltip to open for clicks.
        if (!platform.IOS && !platform.ANDROID) {
            this._manualListeners
                .set('mouseenter', function () { return _this.show(); })
                .set('mouseleave', function () { return _this.hide(); });
        }
        else if (!hasGestures) {
            // If Hammerjs isn't loaded, fall back to showing on `touchstart`, otherwise
            // there's no way for the user to trigger the tooltip on a touch device.
            this._manualListeners.set('touchstart', function () { return _this.show(); });
        }
        this._manualListeners.forEach(function (listener, event) { return element.addEventListener(event, listener); });
        _focusMonitor.monitor(_elementRef).pipe(takeUntil(this._destroyed)).subscribe(function (origin) {
            // Note that the focus monitor runs outside the Angular zone.
            if (!origin) {
                _ngZone.run(function () { return _this.hide(0); });
            }
            else if (origin === 'keyboard') {
                _ngZone.run(function () { return _this.show(); });
            }
        });
        if (_defaultOptions && _defaultOptions.position) {
            this.position = _defaultOptions.position;
        }
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
        var element = this._elementRef.nativeElement;
        var elementStyle = element.style;
        if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
            // When we bind a gesture event on an element (in this case `longpress`), HammerJS
            // will add some inline styles by default, including `user-select: none`. This is
            // problematic on iOS and in Safari, because it will prevent users from typing in inputs.
            // Since `user-select: none` is not needed for the `longpress` event and can cause unexpected
            // behavior for text fields, we always clear the `user-select` to avoid such issues.
            elementStyle.webkitUserSelect = elementStyle.userSelect = elementStyle.msUserSelect = '';
        }
        // Hammer applies `-webkit-user-drag: none` on all elements by default,
        // which breaks the native drag&drop. If the consumer explicitly made
        // the element draggable, clear the `-webkit-user-drag`.
        if (element.draggable && elementStyle.webkitUserDrag === 'none') {
            elementStyle.webkitUserDrag = '';
        }
    };
    /**
     * Dispose the tooltip when destroyed.
     */
    MatTooltip.prototype.ngOnDestroy = function () {
        var _this = this;
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._tooltipInstance = null;
        }
        // Clean up the event listeners set in the constructor
        this._manualListeners.forEach(function (listener, event) {
            _this._elementRef.nativeElement.removeEventListener(event, listener);
        });
        this._manualListeners.clear();
        this._destroyed.next();
        this._destroyed.complete();
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.message);
        this._focusMonitor.stopMonitoring(this._elementRef);
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
    /** Handles the keydown events on the host element. */
    MatTooltip.prototype._handleKeydown = function (e) {
        if (this._isTooltipVisible() && e.keyCode === ESCAPE && !hasModifierKey(e)) {
            e.preventDefault();
            e.stopPropagation();
            this.hide(0);
        }
    };
    /** Handles the touchend events on the host element. */
    MatTooltip.prototype._handleTouchend = function () {
        this.hide(this._defaultOptions.touchendHideDelay);
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
            tslib_1.__assign({}, origin.main, overlay.main),
            tslib_1.__assign({}, origin.fallback, overlay.fallback)
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
    MatTooltip.decorators = [
        { type: Directive, args: [{
                    selector: '[matTooltip]',
                    exportAs: 'matTooltip',
                    host: {
                        '(longpress)': 'show()',
                        '(keydown)': '_handleKeydown($event)',
                        '(touchend)': '_handleTouchend()',
                    },
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
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [HAMMER_LOADER,] }] }
    ]; };
    MatTooltip.propDecorators = {
        position: [{ type: Input, args: ['matTooltipPosition',] }],
        disabled: [{ type: Input, args: ['matTooltipDisabled',] }],
        showDelay: [{ type: Input, args: ['matTooltipShowDelay',] }],
        hideDelay: [{ type: Input, args: ['matTooltipHideDelay',] }],
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
                    moduleId: module.id,
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
                    styles: [".mat-tooltip-panel{pointer-events:none !important}.mat-tooltip{color:#fff;border-radius:4px;margin:14px;max-width:250px;padding-left:8px;padding-right:8px;overflow:hidden;text-overflow:ellipsis}@media(-ms-high-contrast: active){.mat-tooltip{outline:solid 1px}}.mat-tooltip-handset{margin:24px;padding-left:16px;padding-right:16px}/*# sourceMappingURL=tooltip.css.map */\n"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90b29sdGlwL3Rvb2x0aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQVFBLE9BQU8sRUFBQyxhQUFhLEVBQUUsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDOUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFDLGtCQUFrQixFQUFFLFdBQVcsRUFBa0IsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRixPQUFPLEVBSUwsT0FBTyxHQUtSLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUNSLGdCQUFnQixFQUNoQixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGFBQWEsRUFBZSxNQUFNLDJCQUEyQixDQUFDO0FBQ3RFLE9BQU8sRUFBYSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUvQyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMs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LFNBQUM7b0JBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO29CQUNuQixRQUFRLEVBQUUsdUJBQXVCO29CQUNqQyx3UkFBMkI7b0JBRTNCLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsVUFBVSxFQUFFLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDO29CQUMvQyxJQUFJLEVBQUU7d0JBQ0osMEZBQTBGO3dCQUMxRiwyRkFBMkY7d0JBQzNGLGNBQWMsRUFBRSxzQ0FBc0M7d0JBQ3RELGNBQWMsRUFBRSwrQkFBK0I7d0JBQy9DLGFBQWEsRUFBRSxNQUFNO3FCQUN0Qjs7aUJBQ0Y7Ozs7Z0JBM2dCQyxpQkFBaUI7Z0JBaEJYLGtCQUFrQjs7SUFzcEIxQix1QkFBQztDQUFBLEFBMUlELElBMElDO1NBMUhZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge0FyaWFEZXNjcmliZXIsIEZvY3VzTW9uaXRvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0VTQ0FQRSwgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge0JyZWFrcG9pbnRPYnNlcnZlciwgQnJlYWtwb2ludHMsIEJyZWFrcG9pbnRTdGF0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2xheW91dCc7XG5pbXBvcnQge1xuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG4gIEhvcml6b250YWxDb25uZWN0aW9uUG9zLFxuICBPcmlnaW5Db25uZWN0aW9uUG9zaXRpb24sXG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25uZWN0aW9uUG9zaXRpb24sXG4gIE92ZXJsYXlSZWYsXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBWZXJ0aWNhbENvbm5lY3Rpb25Qb3MsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0NvbXBvbmVudFBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1Njcm9sbERpc3BhdGNoZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0hBTU1FUl9MT0FERVIsIEhhbW1lckxvYWRlcn0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHttYXRUb29sdGlwQW5pbWF0aW9uc30gZnJvbSAnLi90b29sdGlwLWFuaW1hdGlvbnMnO1xuXG5cbmV4cG9ydCB0eXBlIFRvb2x0aXBQb3NpdGlvbiA9ICdsZWZ0JyB8ICdyaWdodCcgfCAnYWJvdmUnIHwgJ2JlbG93JyB8ICdiZWZvcmUnIHwgJ2FmdGVyJztcblxuLyoqIFRpbWUgaW4gbXMgdG8gdGhyb3R0bGUgcmVwb3NpdGlvbmluZyBhZnRlciBzY3JvbGwgZXZlbnRzLiAqL1xuZXhwb3J0IGNvbnN0IFNDUk9MTF9USFJPVFRMRV9NUyA9IDIwO1xuXG4vKiogQ1NTIGNsYXNzIHRoYXQgd2lsbCBiZSBhdHRhY2hlZCB0byB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbmV4cG9ydCBjb25zdCBUT09MVElQX1BBTkVMX0NMQVNTID0gJ21hdC10b29sdGlwLXBhbmVsJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGVycm9yIHRvIGJlIHRocm93biBpZiB0aGUgdXNlciBzdXBwbGllZCBhbiBpbnZhbGlkIHRvb2x0aXAgcG9zaXRpb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRUb29sdGlwSW52YWxpZFBvc2l0aW9uRXJyb3IocG9zaXRpb246IHN0cmluZykge1xuICByZXR1cm4gRXJyb3IoYFRvb2x0aXAgcG9zaXRpb24gXCIke3Bvc2l0aW9ufVwiIGlzIGludmFsaWQuYCk7XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgYSB0b29sdGlwIGlzIHZpc2libGUuICovXG5leHBvcnQgY29uc3QgTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KCdtYXQtdG9vbHRpcC1zY3JvbGwtc3RyYXRlZ3knKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oe3Njcm9sbFRocm90dGxlOiBTQ1JPTExfVEhST1RUTEVfTVN9KTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZLFxufTtcblxuLyoqIERlZmF1bHQgYG1hdFRvb2x0aXBgIG9wdGlvbnMgdGhhdCBjYW4gYmUgb3ZlcnJpZGRlbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0VG9vbHRpcERlZmF1bHRPcHRpb25zIHtcbiAgc2hvd0RlbGF5OiBudW1iZXI7XG4gIGhpZGVEZWxheTogbnVtYmVyO1xuICB0b3VjaGVuZEhpZGVEZWxheTogbnVtYmVyO1xuICBwb3NpdGlvbj86IFRvb2x0aXBQb3NpdGlvbjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXRUb29sdGlwYC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfVE9PTFRJUF9ERUZBVUxUX09QVElPTlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRUb29sdGlwRGVmYXVsdE9wdGlvbnM+KCdtYXQtdG9vbHRpcC1kZWZhdWx0LW9wdGlvbnMnLCB7XG4gICAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgICBmYWN0b3J5OiBNQVRfVE9PTFRJUF9ERUZBVUxUX09QVElPTlNfRkFDVE9SWVxuICAgIH0pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9UT09MVElQX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE1hdFRvb2x0aXBEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgc2hvd0RlbGF5OiAwLFxuICAgIGhpZGVEZWxheTogMCxcbiAgICB0b3VjaGVuZEhpZGVEZWxheTogMTUwMCxcbiAgfTtcbn1cblxuLyoqXG4gKiBEaXJlY3RpdmUgdGhhdCBhdHRhY2hlcyBhIG1hdGVyaWFsIGRlc2lnbiB0b29sdGlwIHRvIHRoZSBob3N0IGVsZW1lbnQuIEFuaW1hdGVzIHRoZSBzaG93aW5nIGFuZFxuICogaGlkaW5nIG9mIGEgdG9vbHRpcCBwcm92aWRlZCBwb3NpdGlvbiAoZGVmYXVsdHMgdG8gYmVsb3cgdGhlIGVsZW1lbnQpLlxuICpcbiAqIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbXBvbmVudHMvdG9vbHRpcHMuaHRtbFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VG9vbHRpcF0nLFxuICBleHBvcnRBczogJ21hdFRvb2x0aXAnLFxuICBob3N0OiB7XG4gICAgJyhsb25ncHJlc3MpJzogJ3Nob3coKScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKHRvdWNoZW5kKSc6ICdfaGFuZGxlVG91Y2hlbmQoKScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRvb2x0aXAgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmIHwgbnVsbDtcbiAgX3Rvb2x0aXBJbnN0YW5jZTogVG9vbHRpcENvbXBvbmVudCB8IG51bGw7XG5cbiAgcHJpdmF0ZSBfcG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VG9vbHRpcENvbXBvbmVudD47XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiBUb29sdGlwUG9zaXRpb24gPSAnYmVsb3cnO1xuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIF90b29sdGlwQ2xhc3M6IHN0cmluZ3xzdHJpbmdbXXxTZXQ8c3RyaW5nPnx7W2tleTogc3RyaW5nXTogYW55fTtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIC8qKiBBbGxvd3MgdGhlIHVzZXIgdG8gZGVmaW5lIHRoZSBwb3NpdGlvbiBvZiB0aGUgdG9vbHRpcCByZWxhdGl2ZSB0byB0aGUgcGFyZW50IGVsZW1lbnQgKi9cbiAgQElucHV0KCdtYXRUb29sdGlwUG9zaXRpb24nKVxuICBnZXQgcG9zaXRpb24oKTogVG9vbHRpcFBvc2l0aW9uIHsgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uOyB9XG4gIHNldCBwb3NpdGlvbih2YWx1ZTogVG9vbHRpcFBvc2l0aW9uKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9wb3NpdGlvbikge1xuICAgICAgdGhpcy5fcG9zaXRpb24gPSB2YWx1ZTtcblxuICAgICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcblxuICAgICAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlIS5zaG93KDApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fb3ZlcmxheVJlZi51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBEaXNhYmxlcyB0aGUgZGlzcGxheSBvZiB0aGUgdG9vbHRpcC4gKi9cbiAgQElucHV0KCdtYXRUb29sdGlwRGlzYWJsZWQnKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlZDsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWUpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICAvLyBJZiB0b29sdGlwIGlzIGRpc2FibGVkLCBoaWRlIGltbWVkaWF0ZWx5LlxuICAgIGlmICh0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgdGhpcy5oaWRlKDApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgZGVmYXVsdCBkZWxheSBpbiBtcyBiZWZvcmUgc2hvd2luZyB0aGUgdG9vbHRpcCBhZnRlciBzaG93IGlzIGNhbGxlZCAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBTaG93RGVsYXknKSBzaG93RGVsYXkgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5zaG93RGVsYXk7XG5cbiAgLyoqIFRoZSBkZWZhdWx0IGRlbGF5IGluIG1zIGJlZm9yZSBoaWRpbmcgdGhlIHRvb2x0aXAgYWZ0ZXIgaGlkZSBpcyBjYWxsZWQgKi9cbiAgQElucHV0KCdtYXRUb29sdGlwSGlkZURlbGF5JykgaGlkZURlbGF5ID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuaGlkZURlbGF5O1xuXG4gIHByaXZhdGUgX21lc3NhZ2UgPSAnJztcblxuICAvKiogVGhlIG1lc3NhZ2UgdG8gYmUgZGlzcGxheWVkIGluIHRoZSB0b29sdGlwICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcCcpXG4gIGdldCBtZXNzYWdlKCkgeyByZXR1cm4gdGhpcy5fbWVzc2FnZTsgfVxuICBzZXQgbWVzc2FnZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbih0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuX21lc3NhZ2UpO1xuXG4gICAgLy8gSWYgdGhlIG1lc3NhZ2UgaXMgbm90IGEgc3RyaW5nIChlLmcuIG51bWJlciksIGNvbnZlcnQgaXQgdG8gYSBzdHJpbmcgYW5kIHRyaW0gaXQuXG4gICAgdGhpcy5fbWVzc2FnZSA9IHZhbHVlICE9IG51bGwgPyBgJHt2YWx1ZX1gLnRyaW0oKSA6ICcnO1xuXG4gICAgaWYgKCF0aGlzLl9tZXNzYWdlICYmIHRoaXMuX2lzVG9vbHRpcFZpc2libGUoKSkge1xuICAgICAgdGhpcy5oaWRlKDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl91cGRhdGVUb29sdGlwTWVzc2FnZSgpO1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgLy8gVGhlIGBBcmlhRGVzY3JpYmVyYCBoYXMgc29tZSBmdW5jdGlvbmFsaXR5IHRoYXQgYXZvaWRzIGFkZGluZyBhIGRlc2NyaXB0aW9uIGlmIGl0J3MgdGhlXG4gICAgICAgIC8vIHNhbWUgYXMgdGhlIGBhcmlhLWxhYmVsYCBvZiBhbiBlbGVtZW50LCBob3dldmVyIHdlIGNhbid0IGtub3cgd2hldGhlciB0aGUgdG9vbHRpcCB0cmlnZ2VyXG4gICAgICAgIC8vIGhhcyBhIGRhdGEtYm91bmQgYGFyaWEtbGFiZWxgIG9yIHdoZW4gaXQnbGwgYmUgc2V0IGZvciB0aGUgZmlyc3QgdGltZS4gV2UgY2FuIGF2b2lkIHRoZVxuICAgICAgICAvLyBpc3N1ZSBieSBkZWZlcnJpbmcgdGhlIGRlc2NyaXB0aW9uIGJ5IGEgdGljayBzbyBBbmd1bGFyIGhhcyB0aW1lIHRvIHNldCB0aGUgYGFyaWEtbGFiZWxgLlxuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLmRlc2NyaWJlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5tZXNzYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xhc3NlcyB0byBiZSBwYXNzZWQgdG8gdGhlIHRvb2x0aXAuIFN1cHBvcnRzIHRoZSBzYW1lIHN5bnRheCBhcyBgbmdDbGFzc2AuICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcENsYXNzJylcbiAgZ2V0IHRvb2x0aXBDbGFzcygpIHsgcmV0dXJuIHRoaXMuX3Rvb2x0aXBDbGFzczsgfVxuICBzZXQgdG9vbHRpcENsYXNzKHZhbHVlOiBzdHJpbmd8c3RyaW5nW118.2.0-f30d26f29PHN0cmluZz58e1trZXk6IHN0cmluZ106IGFueX0pIHtcbiAgICB0aGlzLl90b29sdGlwQ2xhc3MgPSB2YWx1ZTtcbiAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICB0aGlzLl9zZXRUb29sdGlwQ2xhc3ModGhpcy5fdG9vbHRpcENsYXNzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9tYW51YWxMaXN0ZW5lcnMgPSBuZXcgTWFwPHN0cmluZywgRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX3Njcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgcHJpdmF0ZSBfYXJpYURlc2NyaWJlcjogQXJpYURlc2NyaWJlcixcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBASW5qZWN0KE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1RPT0xUSVBfREVGQVVMVF9PUFRJT05TKVxuICAgICAgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM6IE1hdFRvb2x0aXBEZWZhdWx0T3B0aW9ucyxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEhBTU1FUl9MT0FERVIpIGhhbW1lckxvYWRlcj86IEhhbW1lckxvYWRlcikge1xuXG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcbiAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgaGFzR2VzdHVyZXMgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCAod2luZG93IGFzIGFueSkuSGFtbWVyIHx8IGhhbW1lckxvYWRlcjtcblxuICAgIC8vIFRoZSBtb3VzZSBldmVudHMgc2hvdWxkbid0IGJlIGJvdW5kIG9uIG1vYmlsZSBkZXZpY2VzLCBiZWNhdXNlIHRoZXkgY2FuIHByZXZlbnQgdGhlXG4gICAgLy8gZmlyc3QgdGFwIGZyb20gZmlyaW5nIGl0cyBjbGljayBldmVudCBvciBjYW4gY2F1c2UgdGhlIHRvb2x0aXAgdG8gb3BlbiBmb3IgY2xpY2tzLlxuICAgIGlmICghcGxhdGZvcm0uSU9TICYmICFwbGF0Zm9ybS5BTkRST0lEKSB7XG4gICAgICB0aGlzLl9tYW51YWxMaXN0ZW5lcnNcbiAgICAgICAgLnNldCgnbW91c2VlbnRlcicsICgpID0+IHRoaXMuc2hvdygpKVxuICAgICAgICAuc2V0KCdtb3VzZWxlYXZlJywgKCkgPT4gdGhpcy5oaWRlKCkpO1xuICAgIH0gZWxzZSBpZiAoIWhhc0dlc3R1cmVzKSB7XG4gICAgICAvLyBJZiBIYW1tZXJqcyBpc24ndCBsb2FkZWQsIGZhbGwgYmFjayB0byBzaG93aW5nIG9uIGB0b3VjaHN0YXJ0YCwgb3RoZXJ3aXNlXG4gICAgICAvLyB0aGVyZSdzIG5vIHdheSBmb3IgdGhlIHVzZXIgdG8gdHJpZ2dlciB0aGUgdG9vbHRpcCBvbiBhIHRvdWNoIGRldmljZS5cbiAgICAgIHRoaXMuX21hbnVhbExpc3RlbmVycy5zZXQoJ3RvdWNoc3RhcnQnLCAoKSA9PiB0aGlzLnNob3coKSk7XG4gICAgfVxuXG4gICAgdGhpcy5fbWFudWFsTGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyLCBldmVudCkgPT4gZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcikpO1xuXG4gICAgX2ZvY3VzTW9uaXRvci5tb25pdG9yKF9lbGVtZW50UmVmKS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUob3JpZ2luID0+IHtcbiAgICAgIC8vIE5vdGUgdGhhdCB0aGUgZm9jdXMgbW9uaXRvciBydW5zIG91dHNpZGUgdGhlIEFuZ3VsYXIgem9uZS5cbiAgICAgIGlmICghb3JpZ2luKSB7XG4gICAgICAgIF9uZ1pvbmUucnVuKCgpID0+IHRoaXMuaGlkZSgwKSk7XG4gICAgICB9IGVsc2UgaWYgKG9yaWdpbiA9PT0gJ2tleWJvYXJkJykge1xuICAgICAgICBfbmdab25lLnJ1bigoKSA9PiB0aGlzLnNob3coKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoX2RlZmF1bHRPcHRpb25zICYmIF9kZWZhdWx0T3B0aW9ucy5wb3NpdGlvbikge1xuICAgICAgdGhpcy5wb3NpdGlvbiA9IF9kZWZhdWx0T3B0aW9ucy5wb3NpdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0dXAgc3R5bGluZy1zcGVjaWZpYyB0aGluZ3NcbiAgICovXG4gIG5nT25Jbml0KCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgZWxlbWVudFN0eWxlID0gZWxlbWVudC5zdHlsZSBhcyBDU1NTdHlsZURlY2xhcmF0aW9uICYge3dlYmtpdFVzZXJEcmFnOiBzdHJpbmd9O1xuXG4gICAgaWYgKGVsZW1lbnQubm9kZU5hbWUgPT09ICdJTlBVVCcgfHwgZWxlbWVudC5ub2RlTmFtZSA9PT0gJ1RFWFRBUkVBJykge1xuICAgICAgLy8gV2hlbiB3ZSBiaW5kIGEgZ2VzdHVyZSBldmVudCBvbiBhbiBlbGVtZW50IChpbiB0aGlzIGNhc2UgYGxvbmdwcmVzc2ApLCBIYW1tZXJKU1xuICAgICAgLy8gd2lsbCBhZGQgc29tZSBpbmxpbmUgc3R5bGVzIGJ5IGRlZmF1bHQsIGluY2x1ZGluZyBgdXNlci1zZWxlY3Q6IG5vbmVgLiBUaGlzIGlzXG4gICAgICAvLyBwcm9ibGVtYXRpYyBvbiBpT1MgYW5kIGluIFNhZmFyaSwgYmVjYXVzZSBpdCB3aWxsIHByZXZlbnQgdXNlcnMgZnJvbSB0eXBpbmcgaW4gaW5wdXRzLlxuICAgICAgLy8gU2luY2UgYHVzZXItc2VsZWN0OiBub25lYCBpcyBub3QgbmVlZGVkIGZvciB0aGUgYGxvbmdwcmVzc2AgZXZlbnQgYW5kIGNhbiBjYXVzZSB1bmV4cGVjdGVkXG4gICAgICAvLyBiZWhhdmlvciBmb3IgdGV4dCBmaWVsZHMsIHdlIGFsd2F5cyBjbGVhciB0aGUgYHVzZXItc2VsZWN0YCB0byBhdm9pZCBzdWNoIGlzc3Vlcy5cbiAgICAgIGVsZW1lbnRTdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gZWxlbWVudFN0eWxlLnVzZXJTZWxlY3QgPSBlbGVtZW50U3R5bGUubXNVc2VyU2VsZWN0ID0gJyc7XG4gICAgfVxuXG4gICAgLy8gSGFtbWVyIGFwcGxpZXMgYC13ZWJraXQtdXNlci1kcmFnOiBub25lYCBvbiBhbGwgZWxlbWVudHMgYnkgZGVmYXVsdCxcbiAgICAvLyB3aGljaCBicmVha3MgdGhlIG5hdGl2ZSBkcmFnJmRyb3AuIElmIHRoZSBjb25zdW1lciBleHBsaWNpdGx5IG1hZGVcbiAgICAvLyB0aGUgZWxlbWVudCBkcmFnZ2FibGUsIGNsZWFyIHRoZSBgLXdlYmtpdC11c2VyLWRyYWdgLlxuICAgIGlmIChlbGVtZW50LmRyYWdnYWJsZSAmJiBlbGVtZW50U3R5bGUud2Via2l0VXNlckRyYWcgPT09ICdub25lJykge1xuICAgICAgZWxlbWVudFN0eWxlLndlYmtpdFVzZXJEcmFnID0gJyc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERpc3Bvc2UgdGhlIHRvb2x0aXAgd2hlbiBkZXN0cm95ZWQuXG4gICAqL1xuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIENsZWFuIHVwIHRoZSBldmVudCBsaXN0ZW5lcnMgc2V0IGluIHRoZSBjb25zdHJ1Y3RvclxuICAgIHRoaXMuX21hbnVhbExpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lciwgZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgfSk7XG4gICAgdGhpcy5fbWFudWFsTGlzdGVuZXJzLmNsZWFyKCk7XG5cbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuXG4gICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbih0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMubWVzc2FnZSk7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICB9XG5cbiAgLyoqIFNob3dzIHRoZSB0b29sdGlwIGFmdGVyIHRoZSBkZWxheSBpbiBtcywgZGVmYXVsdHMgdG8gdG9vbHRpcC1kZWxheS1zaG93IG9yIDBtcyBpZiBubyBpbnB1dCAqL1xuICBzaG93KGRlbGF5OiBudW1iZXIgPSB0aGlzLnNob3dEZWxheSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkIHx8ICF0aGlzLm1lc3NhZ2UgfHwgKHRoaXMuX2lzVG9vbHRpcFZpc2libGUoKSAmJlxuICAgICAgIXRoaXMuX3Rvb2x0aXBJbnN0YW5jZSEuX3Nob3dUaW1lb3V0SWQgJiYgIXRoaXMuX3Rvb2x0aXBJbnN0YW5jZSEuX2hpZGVUaW1lb3V0SWQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5fY3JlYXRlT3ZlcmxheSgpO1xuXG4gICAgdGhpcy5fZGV0YWNoKCk7XG4gICAgdGhpcy5fcG9ydGFsID0gdGhpcy5fcG9ydGFsIHx8IG5ldyBDb21wb25lbnRQb3J0YWwoVG9vbHRpcENvbXBvbmVudCwgdGhpcy5fdmlld0NvbnRhaW5lclJlZik7XG4gICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlID0gb3ZlcmxheVJlZi5hdHRhY2godGhpcy5fcG9ydGFsKS5pbnN0YW5jZTtcbiAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UuYWZ0ZXJIaWRkZW4oKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2RldGFjaCgpKTtcbiAgICB0aGlzLl9zZXRUb29sdGlwQ2xhc3ModGhpcy5fdG9vbHRpcENsYXNzKTtcbiAgICB0aGlzLl91cGRhdGVUb29sdGlwTWVzc2FnZSgpO1xuICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSEuc2hvdyhkZWxheSk7XG4gIH1cblxuICAvKiogSGlkZXMgdGhlIHRvb2x0aXAgYWZ0ZXIgdGhlIGRlbGF5IGluIG1zLCBkZWZhdWx0cyB0byB0b29sdGlwLWRlbGF5LWhpZGUgb3IgMG1zIGlmIG5vIGlucHV0ICovXG4gIGhpZGUoZGVsYXk6IG51bWJlciA9IHRoaXMuaGlkZURlbGF5KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLmhpZGUoZGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTaG93cy9oaWRlcyB0aGUgdG9vbHRpcCAqL1xuICB0b2dnbGUoKTogdm9pZCB7XG4gICAgdGhpcy5faXNUb29sdGlwVmlzaWJsZSgpID8gdGhpcy5oaWRlKCkgOiB0aGlzLnNob3coKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIHRvb2x0aXAgaXMgY3VycmVudGx5IHZpc2libGUgdG8gdGhlIHVzZXIgKi9cbiAgX2lzVG9vbHRpcFZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5fdG9vbHRpcEluc3RhbmNlICYmIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5pc1Zpc2libGUoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHRoZSBrZXlkb3duIGV2ZW50cyBvbiB0aGUgaG9zdCBlbGVtZW50LiAqL1xuICBfaGFuZGxlS2V5ZG93bihlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuX2lzVG9vbHRpcFZpc2libGUoKSAmJiBlLmtleUNvZGUgPT09IEVTQ0FQRSAmJiAhaGFzTW9kaWZpZXJLZXkoZSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB0aGlzLmhpZGUoMCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgdGhlIHRvdWNoZW5kIGV2ZW50cyBvbiB0aGUgaG9zdCBlbGVtZW50LiAqL1xuICBfaGFuZGxlVG91Y2hlbmQoKSB7XG4gICAgdGhpcy5oaWRlKHRoaXMuX2RlZmF1bHRPcHRpb25zLnRvdWNoZW5kSGlkZURlbGF5KTtcbiAgfVxuXG4gIC8qKiBDcmVhdGUgdGhlIG92ZXJsYXkgY29uZmlnIGFuZCBwb3NpdGlvbiBzdHJhdGVneSAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KCk6IE92ZXJsYXlSZWYge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVJlZjtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JvbGxhYmxlQW5jZXN0b3JzID1cbiAgICAgICAgdGhpcy5fc2Nyb2xsRGlzcGF0Y2hlci5nZXRBbmNlc3RvclNjcm9sbENvbnRhaW5lcnModGhpcy5fZWxlbWVudFJlZik7XG5cbiAgICAvLyBDcmVhdGUgY29ubmVjdGVkIHBvc2l0aW9uIHN0cmF0ZWd5IHRoYXQgbGlzdGVucyBmb3Igc2Nyb2xsIGV2ZW50cyB0byByZXBvc2l0aW9uLlxuICAgIGNvbnN0IHN0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5fZWxlbWVudFJlZilcbiAgICAgICAgICAgICAgICAgICAgICAgICAud2l0aFRyYW5zZm9ybU9yaWdpbk9uKCcubWF0LXRvb2x0aXAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgIC53aXRoRmxleGlibGVEaW1lbnNpb25zKGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgIC53aXRoVmlld3BvcnRNYXJnaW4oOClcbiAgICAgICAgICAgICAgICAgICAgICAgICAud2l0aFNjcm9sbGFibGVDb250YWluZXJzKHNjcm9sbGFibGVBbmNlc3RvcnMpO1xuXG4gICAgc3RyYXRlZ3kucG9zaXRpb25DaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShjaGFuZ2UgPT4ge1xuICAgICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgICBpZiAoY2hhbmdlLnNjcm9sbGFibGVWaWV3UHJvcGVydGllcy5pc092ZXJsYXlDbGlwcGVkICYmIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5pc1Zpc2libGUoKSkge1xuICAgICAgICAgIC8vIEFmdGVyIHBvc2l0aW9uIGNoYW5nZXMgb2NjdXIgYW5kIHRoZSBvdmVybGF5IGlzIGNsaXBwZWQgYnlcbiAgICAgICAgICAvLyBhIHBhcmVudCBzY3JvbGxhYmxlIHRoZW4gY2xvc2UgdGhlIHRvb2x0aXAuXG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLmhpZGUoMCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUoe1xuICAgICAgZGlyZWN0aW9uOiB0aGlzLl9kaXIsXG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiBzdHJhdGVneSxcbiAgICAgIHBhbmVsQ2xhc3M6IFRPT0xUSVBfUEFORUxfQ0xBU1MsXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKVxuICAgIH0pO1xuXG4gICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcblxuICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNobWVudHMoKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2RldGFjaCgpKTtcblxuICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmO1xuICB9XG5cbiAgLyoqIERldGFjaGVzIHRoZSBjdXJyZW50bHktYXR0YWNoZWQgdG9vbHRpcC4gKi9cbiAgcHJpdmF0ZSBfZGV0YWNoKCkge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmICYmIHRoaXMuX292ZXJsYXlSZWYuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2goKTtcbiAgICB9XG5cbiAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IHRvb2x0aXAuICovXG4gIHByaXZhdGUgX3VwZGF0ZVBvc2l0aW9uKCkge1xuICAgIGNvbnN0IHBvc2l0aW9uID1cbiAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEuZ2V0Q29uZmlnKCkucG9zaXRpb25TdHJhdGVneSBhcyBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3k7XG4gICAgY29uc3Qgb3JpZ2luID0gdGhpcy5fZ2V0T3JpZ2luKCk7XG4gICAgY29uc3Qgb3ZlcmxheSA9IHRoaXMuX2dldE92ZXJsYXlQb3NpdGlvbigpO1xuXG4gICAgcG9zaXRpb24ud2l0aFBvc2l0aW9ucyhbXG4gICAgICB7Li4ub3JpZ2luLm1haW4sIC4uLm92ZXJsYXkubWFpbn0sXG4gICAgICB7Li4ub3JpZ2luLmZhbGxiYWNrLCAuLi5vdmVybGF5LmZhbGxiYWNrfVxuICAgIF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9yaWdpbiBwb3NpdGlvbiBhbmQgYSBmYWxsYmFjayBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgdXNlcidzIHBvc2l0aW9uIHByZWZlcmVuY2UuXG4gICAqIFRoZSBmYWxsYmFjayBwb3NpdGlvbiBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgb3JpZ2luIChlLmcuIGAnYmVsb3cnIC0+ICdhYm92ZSdgKS5cbiAgICovXG4gIF9nZXRPcmlnaW4oKToge21haW46IE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbiwgZmFsbGJhY2s6IE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbn0ge1xuICAgIGNvbnN0IGlzTHRyID0gIXRoaXMuX2RpciB8fCB0aGlzLl9kaXIudmFsdWUgPT0gJ2x0cic7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xuICAgIGxldCBvcmlnaW5Qb3NpdGlvbjogT3JpZ2luQ29ubmVjdGlvblBvc2l0aW9uO1xuXG4gICAgaWYgKHBvc2l0aW9uID09ICdhYm92ZScgfHwgcG9zaXRpb24gPT0gJ2JlbG93Jykge1xuICAgICAgb3JpZ2luUG9zaXRpb24gPSB7b3JpZ2luWDogJ2NlbnRlcicsIG9yaWdpblk6IHBvc2l0aW9uID09ICdhYm92ZScgPyAndG9wJyA6ICdib3R0b20nfTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgcG9zaXRpb24gPT0gJ2JlZm9yZScgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAnbGVmdCcgJiYgaXNMdHIpIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ3JpZ2h0JyAmJiAhaXNMdHIpKSB7XG4gICAgICBvcmlnaW5Qb3NpdGlvbiA9IHtvcmlnaW5YOiAnc3RhcnQnLCBvcmlnaW5ZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBvc2l0aW9uID09ICdhZnRlcicgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmIGlzTHRyKSB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiAhaXNMdHIpKSB7XG4gICAgICBvcmlnaW5Qb3NpdGlvbiA9IHtvcmlnaW5YOiAnZW5kJywgb3JpZ2luWTogJ2NlbnRlcid9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBnZXRNYXRUb29sdGlwSW52YWxpZFBvc2l0aW9uRXJyb3IocG9zaXRpb24pO1xuICAgIH1cblxuICAgIGNvbnN0IHt4LCB5fSA9IHRoaXMuX2ludmVydFBvc2l0aW9uKG9yaWdpblBvc2l0aW9uLm9yaWdpblgsIG9yaWdpblBvc2l0aW9uLm9yaWdpblkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1haW46IG9yaWdpblBvc2l0aW9uLFxuICAgICAgZmFsbGJhY2s6IHtvcmlnaW5YOiB4LCBvcmlnaW5ZOiB5fVxuICAgIH07XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgb3ZlcmxheSBwb3NpdGlvbiBhbmQgYSBmYWxsYmFjayBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgdXNlcidzIHByZWZlcmVuY2UgKi9cbiAgX2dldE92ZXJsYXlQb3NpdGlvbigpOiB7bWFpbjogT3ZlcmxheUNvbm5lY3Rpb25Qb3NpdGlvbiwgZmFsbGJhY2s6IE92ZXJsYXlDb25uZWN0aW9uUG9zaXRpb259IHtcbiAgICBjb25zdCBpc0x0ciA9ICF0aGlzLl9kaXIgfHwgdGhpcy5fZGlyLnZhbHVlID09ICdsdHInO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcbiAgICBsZXQgb3ZlcmxheVBvc2l0aW9uOiBPdmVybGF5Q29ubmVjdGlvblBvc2l0aW9uO1xuXG4gICAgaWYgKHBvc2l0aW9uID09ICdhYm92ZScpIHtcbiAgICAgIG92ZXJsYXlQb3NpdGlvbiA9IHtvdmVybGF5WDogJ2NlbnRlcicsIG92ZXJsYXlZOiAnYm90dG9tJ307XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvbiA9PSAnYmVsb3cnKSB7XG4gICAgICBvdmVybGF5UG9zaXRpb24gPSB7b3ZlcmxheVg6ICdjZW50ZXInLCBvdmVybGF5WTogJ3RvcCd9O1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBwb3NpdGlvbiA9PSAnYmVmb3JlJyB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiBpc0x0cikgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmICFpc0x0cikpIHtcbiAgICAgIG92ZXJsYXlQb3NpdGlvbiA9IHtvdmVybGF5WDogJ2VuZCcsIG92ZXJsYXlZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBvc2l0aW9uID09ICdhZnRlcicgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmIGlzTHRyKSB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiAhaXNMdHIpKSB7XG4gICAgICBvdmVybGF5UG9zaXRpb24gPSB7b3ZlcmxheVg6ICdzdGFydCcsIG92ZXJsYXlZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGdldE1hdFRvb2x0aXBJbnZhbGlkUG9zaXRpb25FcnJvcihwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgY29uc3Qge3gsIHl9ID0gdGhpcy5faW52ZXJ0UG9zaXRpb24ob3ZlcmxheVBvc2l0aW9uLm92ZXJsYXlYLCBvdmVybGF5UG9zaXRpb24ub3ZlcmxheVkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1haW46IG92ZXJsYXlQb3NpdGlvbixcbiAgICAgIGZhbGxiYWNrOiB7b3ZlcmxheVg6IHgsIG92ZXJsYXlZOiB5fVxuICAgIH07XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgdG9vbHRpcCBtZXNzYWdlIGFuZCByZXBvc2l0aW9ucyB0aGUgb3ZlcmxheSBhY2NvcmRpbmcgdG8gdGhlIG5ldyBtZXNzYWdlIGxlbmd0aCAqL1xuICBwcml2YXRlIF91cGRhdGVUb29sdGlwTWVzc2FnZSgpIHtcbiAgICAvLyBNdXN0IHdhaXQgZm9yIHRoZSBtZXNzYWdlIHRvIGJlIHBhaW50ZWQgdG8gdGhlIHRvb2x0aXAgc28gdGhhdCB0aGUgb3ZlcmxheSBjYW4gcHJvcGVybHlcbiAgICAvLyBjYWxjdWxhdGUgdGhlIGNvcnJlY3QgcG9zaXRpb25pbmcgYmFzZWQgb24gdGhlIHNpemUgb2YgdGhlIHRleHQuXG4gICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLm1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2U7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UuX21hcmtGb3JDaGVjaygpO1xuXG4gICAgICB0aGlzLl9uZ1pvbmUub25NaWNyb3Rhc2tFbXB0eS5hc09ic2VydmFibGUoKS5waXBlKFxuICAgICAgICB0YWtlKDEpLFxuICAgICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKVxuICAgICAgKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHRvb2x0aXAgY2xhc3MgKi9cbiAgcHJpdmF0ZSBfc2V0VG9vbHRpcENsYXNzKHRvb2x0aXBDbGFzczogc3RyaW5nfHN0cmluZ1tdfFNldDxzdHJpbmc+fHtba2V5OiBzdHJpbmddOiBhbnl9KSB7XG4gICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLnRvb2x0aXBDbGFzcyA9IHRvb2x0aXBDbGFzcztcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5fbWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEludmVydHMgYW4gb3ZlcmxheSBwb3NpdGlvbi4gKi9cbiAgcHJpdmF0ZSBfaW52ZXJ0UG9zaXRpb24oeDogSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3MsIHk6IFZlcnRpY2FsQ29ubmVjdGlvblBvcykge1xuICAgIGlmICh0aGlzLnBvc2l0aW9uID09PSAnYWJvdmUnIHx8IHRoaXMucG9zaXRpb24gPT09ICdiZWxvdycpIHtcbiAgICAgIGlmICh5ID09PSAndG9wJykge1xuICAgICAgICB5ID0gJ2JvdHRvbSc7XG4gICAgICB9IGVsc2UgaWYgKHkgPT09ICdib3R0b20nKSB7XG4gICAgICAgIHkgPSAndG9wJztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHggPT09ICdlbmQnKSB7XG4gICAgICAgIHggPSAnc3RhcnQnO1xuICAgICAgfSBlbHNlIGlmICh4ID09PSAnc3RhcnQnKSB7XG4gICAgICAgIHggPSAnZW5kJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge3gsIHl9O1xuICB9XG59XG5cbmV4cG9ydCB0eXBlIFRvb2x0aXBWaXNpYmlsaXR5ID0gJ2luaXRpYWwnIHwgJ3Zpc2libGUnIHwgJ2hpZGRlbic7XG5cbi8qKlxuICogSW50ZXJuYWwgY29tcG9uZW50IHRoYXQgd3JhcHMgdGhlIHRvb2x0aXAncyBjb250ZW50LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdtYXQtdG9vbHRpcC1jb21wb25lbnQnLFxuICB0ZW1wbGF0ZVVybDogJ3Rvb2x0aXAuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0b29sdGlwLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgYW5pbWF0aW9uczogW21hdFRvb2x0aXBBbmltYXRpb25zLnRvb2x0aXBTdGF0ZV0sXG4gIGhvc3Q6IHtcbiAgICAvLyBGb3JjZXMgdGhlIGVsZW1lbnQgdG8gaGF2ZSBhIGxheW91dCBpbiBJRSBhbmQgRWRnZS4gVGhpcyBmaXhlcyBpc3N1ZXMgd2hlcmUgdGhlIGVsZW1lbnRcbiAgICAvLyB3b24ndCBiZSByZW5kZXJlZCBpZiB0aGUgYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQgb3IgdGhlcmUgaXMgbm8gd2ViIGFuaW1hdGlvbnMgcG9seWZpbGwuXG4gICAgJ1tzdHlsZS56b29tXSc6ICdfdmlzaWJpbGl0eSA9PT0gXCJ2aXNpYmxlXCIgPyAxIDogbnVsbCcsXG4gICAgJyhib2R5OmNsaWNrKSc6ICd0aGlzLl9oYW5kbGVCb2R5SW50ZXJhY3Rpb24oKScsXG4gICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIFRvb2x0aXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKiogTWVzc2FnZSB0byBkaXNwbGF5IGluIHRoZSB0b29sdGlwICovXG4gIG1lc3NhZ2U6IHN0cmluZztcblxuICAvKiogQ2xhc3NlcyB0byBiZSBhZGRlZCB0byB0aGUgdG9vbHRpcC4gU3VwcG9ydHMgdGhlIHNhbWUgc3ludGF4IGFzIGBuZ0NsYXNzYC4gKi9cbiAgdG9vbHRpcENsYXNzOiBzdHJpbmd8c3RyaW5nW118.2.0-f30d26f29PHN0cmluZz58e1trZXk6IHN0cmluZ106IGFueX07XG5cbiAgLyoqIFRoZSB0aW1lb3V0IElEIG9mIGFueSBjdXJyZW50IHRpbWVyIHNldCB0byBzaG93IHRoZSB0b29sdGlwICovXG4gIF9zaG93VGltZW91dElkOiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBUaGUgdGltZW91dCBJRCBvZiBhbnkgY3VycmVudCB0aW1lciBzZXQgdG8gaGlkZSB0aGUgdG9vbHRpcCAqL1xuICBfaGlkZVRpbWVvdXRJZDogbnVtYmVyIHwgbnVsbDtcblxuICAvKiogUHJvcGVydHkgd2F0Y2hlZCBieSB0aGUgYW5pbWF0aW9uIGZyYW1ld29yayB0byBzaG93IG9yIGhpZGUgdGhlIHRvb2x0aXAgKi9cbiAgX3Zpc2liaWxpdHk6IFRvb2x0aXBWaXNpYmlsaXR5ID0gJ2luaXRpYWwnO1xuXG4gIC8qKiBXaGV0aGVyIGludGVyYWN0aW9ucyBvbiB0aGUgcGFnZSBzaG91bGQgY2xvc2UgdGhlIHRvb2x0aXAgKi9cbiAgcHJpdmF0ZSBfY2xvc2VPbkludGVyYWN0aW9uOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGF0IHRoZSB0b29sdGlwIGhhcyBiZWVuIGhpZGRlbiBmcm9tIHRoZSB2aWV3ICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX29uSGlkZTogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTtcblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hldGhlciB0aGUgdXNlciBoYXMgYSBoYW5kc2V0LXNpemVkIGRpc3BsYXkuICAqL1xuICBfaXNIYW5kc2V0OiBPYnNlcnZhYmxlPEJyZWFrcG9pbnRTdGF0ZT4gPSB0aGlzLl9icmVha3BvaW50T2JzZXJ2ZXIub2JzZXJ2ZShCcmVha3BvaW50cy5IYW5kc2V0KTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfYnJlYWtwb2ludE9ic2VydmVyOiBCcmVha3BvaW50T2JzZXJ2ZXIpIHt9XG5cbiAgLyoqXG4gICAqIFNob3dzIHRoZSB0b29sdGlwIHdpdGggYW4gYW5pbWF0aW9uIG9yaWdpbmF0aW5nIGZyb20gdGhlIHByb3ZpZGVkIG9yaWdpblxuICAgKiBAcGFyYW0gZGVsYXkgQW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byB0aGUgZGVsYXkgc2hvd2luZyB0aGUgdG9vbHRpcC5cbiAgICovXG4gIHNob3coZGVsYXk6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIENhbmNlbCB0aGUgZGVsYXllZCBoaWRlIGlmIGl0IGlzIHNjaGVkdWxlZFxuICAgIGlmICh0aGlzLl9oaWRlVGltZW91dElkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5faGlkZVRpbWVvdXRJZCk7XG4gICAgICB0aGlzLl9oaWRlVGltZW91dElkID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBCb2R5IGludGVyYWN0aW9ucyBzaG91bGQgY2FuY2VsIHRoZSB0b29sdGlwIGlmIHRoZXJlIGlzIGEgZGVsYXkgaW4gc2hvd2luZy5cbiAgICB0aGlzLl9jbG9zZU9uSW50ZXJhY3Rpb24gPSB0cnVlO1xuICAgIHRoaXMuX3Nob3dUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX3Zpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICB0aGlzLl9zaG93VGltZW91dElkID0gbnVsbDtcblxuICAgICAgLy8gTWFyayBmb3IgY2hlY2sgc28gaWYgYW55IHBhcmVudCBjb21wb25lbnQgaGFzIHNldCB0aGVcbiAgICAgIC8vIENoYW5nZURldGVjdGlvblN0cmF0ZWd5IHRvIE9uUHVzaCBpdCB3aWxsIGJlIGNoZWNrZWQgYW55d2F5c1xuICAgICAgdGhpcy5fbWFya0ZvckNoZWNrKCk7XG4gICAgfSwgZGVsYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJlZ2lucyB0aGUgYW5pbWF0aW9uIHRvIGhpZGUgdGhlIHRvb2x0aXAgYWZ0ZXIgdGhlIHByb3ZpZGVkIGRlbGF5IGluIG1zLlxuICAgKiBAcGFyYW0gZGVsYXkgQW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheSBzaG93aW5nIHRoZSB0b29sdGlwLlxuICAgKi9cbiAgaGlkZShkZWxheTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gQ2FuY2VsIHRoZSBkZWxheWVkIHNob3cgaWYgaXQgaXMgc2NoZWR1bGVkXG4gICAgaWYgKHRoaXMuX3Nob3dUaW1lb3V0SWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9zaG93VGltZW91dElkKTtcbiAgICAgIHRoaXMuX3Nob3dUaW1lb3V0SWQgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX2hpZGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX3Zpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgIHRoaXMuX2hpZGVUaW1lb3V0SWQgPSBudWxsO1xuXG4gICAgICAvLyBNYXJrIGZvciBjaGVjayBzbyBpZiBhbnkgcGFyZW50IGNvbXBvbmVudCBoYXMgc2V0IHRoZVxuICAgICAgLy8gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgdG8gT25QdXNoIGl0IHdpbGwgYmUgY2hlY2tlZCBhbnl3YXlzXG4gICAgICB0aGlzLl9tYXJrRm9yQ2hlY2soKTtcbiAgICB9LCBkZWxheSk7XG4gIH1cblxuICAvKiogUmV0dXJucyBhbiBvYnNlcnZhYmxlIHRoYXQgbm90aWZpZXMgd2hlbiB0aGUgdG9vbHRpcCBoYXMgYmVlbiBoaWRkZW4gZnJvbSB2aWV3LiAqL1xuICBhZnRlckhpZGRlbigpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fb25IaWRlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRvb2x0aXAgaXMgYmVpbmcgZGlzcGxheWVkLiAqL1xuICBpc1Zpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Zpc2liaWxpdHkgPT09ICd2aXNpYmxlJztcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX29uSGlkZS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgX2FuaW1hdGlvblN0YXJ0KCkge1xuICAgIHRoaXMuX2Nsb3NlT25JbnRlcmFjdGlvbiA9IGZhbHNlO1xuICB9XG5cbiAgX2FuaW1hdGlvbkRvbmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgdG9TdGF0ZSA9IGV2ZW50LnRvU3RhdGUgYXMgVG9vbHRpcFZpc2liaWxpdHk7XG5cbiAgICBpZiAodG9TdGF0ZSA9PT0gJ2hpZGRlbicgJiYgIXRoaXMuaXNWaXNpYmxlKCkpIHtcbiAgICAgIHRoaXMuX29uSGlkZS5uZXh0KCk7XG4gICAgfVxuXG4gICAgaWYgKHRvU3RhdGUgPT09ICd2aXNpYmxlJyB8fCB0b1N0YXRlID09PSAnaGlkZGVuJykge1xuICAgICAgdGhpcy5fY2xvc2VPbkludGVyYWN0aW9uID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJhY3Rpb25zIG9uIHRoZSBIVE1MIGJvZHkgc2hvdWxkIGNsb3NlIHRoZSB0b29sdGlwIGltbWVkaWF0ZWx5IGFzIGRlZmluZWQgaW4gdGhlXG4gICAqIG1hdGVyaWFsIGRlc2lnbiBzcGVjLlxuICAgKiBodHRwczovL21hdGVyaWFsLmlvL2Rlc2lnbi9jb21wb25lbnRzL3Rvb2x0aXBzLmh0bWwjYmVoYXZpb3JcbiAgICovXG4gIF9oYW5kbGVCb2R5SW50ZXJhY3Rpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2Nsb3NlT25JbnRlcmFjdGlvbikge1xuICAgICAgdGhpcy5oaWRlKDApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGF0IHRoZSB0b29sdGlwIG5lZWRzIHRvIGJlIGNoZWNrZWQgaW4gdGhlIG5leHQgY2hhbmdlIGRldGVjdGlvbiBydW4uXG4gICAqIE1haW5seSB1c2VkIGZvciByZW5kZXJpbmcgdGhlIGluaXRpYWwgdGV4dCBiZWZvcmUgcG9zaXRpb25pbmcgYSB0b29sdGlwLCB3aGljaFxuICAgKiBjYW4gYmUgcHJvYmxlbWF0aWMgaW4gY29tcG9uZW50cyB3aXRoIE9uUHVzaCBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgKi9cbiAgX21hcmtGb3JDaGVjaygpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxufVxuIl19