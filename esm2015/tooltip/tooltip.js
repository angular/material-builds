/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/**
 * Time in ms to throttle repositioning after scroll events.
 * @type {?}
 */
export const SCROLL_THROTTLE_MS = 20;
/**
 * CSS class that will be attached to the overlay panel.
 * @type {?}
 */
export const TOOLTIP_PANEL_CLASS = 'mat-tooltip-panel';
/**
 * Options used to bind passive event listeners.
 * @type {?}
 */
const passiveListenerOptions = normalizePassiveListenerOptions({ passive: true });
/**
 * Time between the user putting the pointer on a tooltip
 * trigger and the long press event being fired.
 * @type {?}
 */
const LONGPRESS_DELAY = 500;
/**
 * Creates an error to be thrown if the user supplied an invalid tooltip position.
 * \@docs-private
 * @param {?} position
 * @return {?}
 */
export function getMatTooltipInvalidPositionError(position) {
    return Error(`Tooltip position "${position}" is invalid.`);
}
/**
 * Injection token that determines the scroll handling while a tooltip is visible.
 * @type {?}
 */
export const MAT_TOOLTIP_SCROLL_STRATEGY = new InjectionToken('mat-tooltip-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
export function MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY(overlay) {
    return (/**
     * @return {?}
     */
    () => overlay.scrollStrategies.reposition({ scrollThrottle: SCROLL_THROTTLE_MS }));
}
/**
 * \@docs-private
 * @type {?}
 */
export const MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MAT_TOOLTIP_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY,
};
/**
 * Default `matTooltip` options that can be overridden.
 * @record
 */
export function MatTooltipDefaultOptions() { }
if (false) {
    /** @type {?} */
    MatTooltipDefaultOptions.prototype.showDelay;
    /** @type {?} */
    MatTooltipDefaultOptions.prototype.hideDelay;
    /** @type {?} */
    MatTooltipDefaultOptions.prototype.touchendHideDelay;
    /** @type {?|undefined} */
    MatTooltipDefaultOptions.prototype.touchGestures;
    /** @type {?|undefined} */
    MatTooltipDefaultOptions.prototype.position;
}
/**
 * Injection token to be used to override the default options for `matTooltip`.
 * @type {?}
 */
export const MAT_TOOLTIP_DEFAULT_OPTIONS = new InjectionToken('mat-tooltip-default-options', {
    providedIn: 'root',
    factory: MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY
});
/**
 * \@docs-private
 * @return {?}
 */
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
export class MatTooltip {
    /**
     * @param {?} _overlay
     * @param {?} _elementRef
     * @param {?} _scrollDispatcher
     * @param {?} _viewContainerRef
     * @param {?} _ngZone
     * @param {?} _platform
     * @param {?} _ariaDescriber
     * @param {?} _focusMonitor
     * @param {?} scrollStrategy
     * @param {?} _dir
     * @param {?} _defaultOptions
     * @param {?=} _hammerLoader
     */
    constructor(_overlay, _elementRef, _scrollDispatcher, _viewContainerRef, _ngZone, _platform, _ariaDescriber, _focusMonitor, scrollStrategy, _dir, _defaultOptions, 
    /**
     * @deprecated _hammerLoader parameter to be removed.
     * @breaking-change 9.0.0
     */
    // Note that we need to give Angular something to inject here so it doesn't throw.
    _hammerLoader) {
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
        /**
         * The default delay in ms before showing the tooltip after show is called
         */
        this.showDelay = this._defaultOptions.showDelay;
        /**
         * The default delay in ms before hiding the tooltip after hide is called
         */
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
        /**
         * Manually-bound passive event listeners.
         */
        this._passiveListeners = new Map();
        /**
         * Emits when the component is destroyed.
         */
        this._destroyed = new Subject();
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
            .subscribe((/**
         * @param {?} origin
         * @return {?}
         */
        origin => {
            // Note that the focus monitor runs outside the Angular zone.
            if (!origin) {
                _ngZone.run((/**
                 * @return {?}
                 */
                () => this.hide(0)));
            }
            else if (origin === 'keyboard') {
                _ngZone.run((/**
                 * @return {?}
                 */
                () => this.show()));
            }
        }));
    }
    /**
     * Allows the user to define the position of the tooltip relative to the parent element
     * @return {?}
     */
    get position() { return this._position; }
    /**
     * @param {?} value
     * @return {?}
     */
    set position(value) {
        if (value !== this._position) {
            this._position = value;
            if (this._overlayRef) {
                this._updatePosition();
                if (this._tooltipInstance) {
                    (/** @type {?} */ (this._tooltipInstance)).show(0);
                }
                this._overlayRef.updatePosition();
            }
        }
    }
    /**
     * Disables the display of the tooltip.
     * @return {?}
     */
    get disabled() { return this._disabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        // If tooltip is disabled, hide immediately.
        if (this._disabled) {
            this.hide(0);
        }
    }
    /**
     * The message to be displayed in the tooltip
     * @return {?}
     */
    get message() { return this._message; }
    /**
     * @param {?} value
     * @return {?}
     */
    set message(value) {
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this._message);
        // If the message is not a string (e.g. number), convert it to a string and trim it.
        this._message = value != null ? `${value}`.trim() : '';
        if (!this._message && this._isTooltipVisible()) {
            this.hide(0);
        }
        else {
            this._updateTooltipMessage();
            this._ngZone.runOutsideAngular((/**
             * @return {?}
             */
            () => {
                // The `AriaDescriber` has some functionality that avoids adding a description if it's the
                // same as the `aria-label` of an element, however we can't know whether the tooltip trigger
                // has a data-bound `aria-label` or when it'll be set for the first time. We can avoid the
                // issue by deferring the description by a tick so Angular has time to set the `aria-label`.
                Promise.resolve().then((/**
                 * @return {?}
                 */
                () => {
                    this._ariaDescriber.describe(this._elementRef.nativeElement, this.message);
                }));
            }));
        }
    }
    /**
     * Classes to be passed to the tooltip. Supports the same syntax as `ngClass`.
     * @return {?}
     */
    get tooltipClass() { return this._tooltipClass; }
    /**
     * @param {?} value
     * @return {?}
     */
    set tooltipClass(value) {
        this._tooltipClass = value;
        if (this._tooltipInstance) {
            this._setTooltipClass(this._tooltipClass);
        }
    }
    /**
     * Setup styling-specific things
     * @return {?}
     */
    ngOnInit() {
        // This needs to happen in `ngOnInit` so the initial values for all inputs have been set.
        this._setupPointerEvents();
    }
    /**
     * Dispose the tooltip when destroyed.
     * @return {?}
     */
    ngOnDestroy() {
        clearTimeout(this._touchstartTimeout);
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._tooltipInstance = null;
        }
        // Clean up the event listeners set in the constructor
        this._passiveListeners.forEach((/**
         * @param {?} listener
         * @param {?} event
         * @return {?}
         */
        (listener, event) => {
            this._elementRef.nativeElement.removeEventListener(event, listener, passiveListenerOptions);
        }));
        this._passiveListeners.clear();
        this._destroyed.next();
        this._destroyed.complete();
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.message);
        this._focusMonitor.stopMonitoring(this._elementRef);
    }
    /**
     * Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input
     * @param {?=} delay
     * @return {?}
     */
    show(delay = this.showDelay) {
        if (this.disabled || !this.message || (this._isTooltipVisible() &&
            !(/** @type {?} */ (this._tooltipInstance))._showTimeoutId && !(/** @type {?} */ (this._tooltipInstance))._hideTimeoutId)) {
            return;
        }
        /** @type {?} */
        const overlayRef = this._createOverlay();
        this._detach();
        this._portal = this._portal || new ComponentPortal(TooltipComponent, this._viewContainerRef);
        this._tooltipInstance = overlayRef.attach(this._portal).instance;
        this._tooltipInstance.afterHidden()
            .pipe(takeUntil(this._destroyed))
            .subscribe((/**
         * @return {?}
         */
        () => this._detach()));
        this._setTooltipClass(this._tooltipClass);
        this._updateTooltipMessage();
        (/** @type {?} */ (this._tooltipInstance)).show(delay);
    }
    /**
     * Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input
     * @param {?=} delay
     * @return {?}
     */
    hide(delay = this.hideDelay) {
        if (this._tooltipInstance) {
            this._tooltipInstance.hide(delay);
        }
    }
    /**
     * Shows/hides the tooltip
     * @return {?}
     */
    toggle() {
        this._isTooltipVisible() ? this.hide() : this.show();
    }
    /**
     * Returns true if the tooltip is currently visible to the user
     * @return {?}
     */
    _isTooltipVisible() {
        return !!this._tooltipInstance && this._tooltipInstance.isVisible();
    }
    /**
     * Handles the keydown events on the host element.
     * @param {?} e
     * @return {?}
     */
    _handleKeydown(e) {
        if (this._isTooltipVisible() && e.keyCode === ESCAPE && !hasModifierKey(e)) {
            e.preventDefault();
            e.stopPropagation();
            this.hide(0);
        }
    }
    /**
     * Create the overlay config and position strategy
     * @private
     * @return {?}
     */
    _createOverlay() {
        if (this._overlayRef) {
            return this._overlayRef;
        }
        /** @type {?} */
        const scrollableAncestors = this._scrollDispatcher.getAncestorScrollContainers(this._elementRef);
        // Create connected position strategy that listens for scroll events to reposition.
        /** @type {?} */
        const strategy = this._overlay.position()
            .flexibleConnectedTo(this._elementRef)
            .withTransformOriginOn('.mat-tooltip')
            .withFlexibleDimensions(false)
            .withViewportMargin(8)
            .withScrollableContainers(scrollableAncestors);
        strategy.positionChanges.pipe(takeUntil(this._destroyed)).subscribe((/**
         * @param {?} change
         * @return {?}
         */
        change => {
            if (this._tooltipInstance) {
                if (change.scrollableViewProperties.isOverlayClipped && this._tooltipInstance.isVisible()) {
                    // After position changes occur and the overlay is clipped by
                    // a parent scrollable then close the tooltip.
                    this._ngZone.run((/**
                     * @return {?}
                     */
                    () => this.hide(0)));
                }
            }
        }));
        this._overlayRef = this._overlay.create({
            direction: this._dir,
            positionStrategy: strategy,
            panelClass: TOOLTIP_PANEL_CLASS,
            scrollStrategy: this._scrollStrategy()
        });
        this._updatePosition();
        this._overlayRef.detachments()
            .pipe(takeUntil(this._destroyed))
            .subscribe((/**
         * @return {?}
         */
        () => this._detach()));
        return this._overlayRef;
    }
    /**
     * Detaches the currently-attached tooltip.
     * @private
     * @return {?}
     */
    _detach() {
        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
        }
        this._tooltipInstance = null;
    }
    /**
     * Updates the position of the current tooltip.
     * @private
     * @return {?}
     */
    _updatePosition() {
        /** @type {?} */
        const position = (/** @type {?} */ ((/** @type {?} */ (this._overlayRef)).getConfig().positionStrategy));
        /** @type {?} */
        const origin = this._getOrigin();
        /** @type {?} */
        const overlay = this._getOverlayPosition();
        position.withPositions([
            Object.assign({}, origin.main, overlay.main),
            Object.assign({}, origin.fallback, overlay.fallback)
        ]);
    }
    /**
     * Returns the origin position and a fallback position based on the user's position preference.
     * The fallback position is the inverse of the origin (e.g. `'below' -> 'above'`).
     * @return {?}
     */
    _getOrigin() {
        /** @type {?} */
        const isLtr = !this._dir || this._dir.value == 'ltr';
        /** @type {?} */
        const position = this.position;
        /** @type {?} */
        let originPosition;
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
        const { x, y } = this._invertPosition(originPosition.originX, originPosition.originY);
        return {
            main: originPosition,
            fallback: { originX: x, originY: y }
        };
    }
    /**
     * Returns the overlay position and a fallback position based on the user's preference
     * @return {?}
     */
    _getOverlayPosition() {
        /** @type {?} */
        const isLtr = !this._dir || this._dir.value == 'ltr';
        /** @type {?} */
        const position = this.position;
        /** @type {?} */
        let overlayPosition;
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
        const { x, y } = this._invertPosition(overlayPosition.overlayX, overlayPosition.overlayY);
        return {
            main: overlayPosition,
            fallback: { overlayX: x, overlayY: y }
        };
    }
    /**
     * Updates the tooltip message and repositions the overlay according to the new message length
     * @private
     * @return {?}
     */
    _updateTooltipMessage() {
        // Must wait for the message to be painted to the tooltip so that the overlay can properly
        // calculate the correct positioning based on the size of the text.
        if (this._tooltipInstance) {
            this._tooltipInstance.message = this.message;
            this._tooltipInstance._markForCheck();
            this._ngZone.onMicrotaskEmpty.asObservable().pipe(take(1), takeUntil(this._destroyed)).subscribe((/**
             * @return {?}
             */
            () => {
                if (this._tooltipInstance) {
                    (/** @type {?} */ (this._overlayRef)).updatePosition();
                }
            }));
        }
    }
    /**
     * Updates the tooltip class
     * @private
     * @param {?} tooltipClass
     * @return {?}
     */
    _setTooltipClass(tooltipClass) {
        if (this._tooltipInstance) {
            this._tooltipInstance.tooltipClass = tooltipClass;
            this._tooltipInstance._markForCheck();
        }
    }
    /**
     * Inverts an overlay position.
     * @private
     * @param {?} x
     * @param {?} y
     * @return {?}
     */
    _invertPosition(x, y) {
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
        return { x, y };
    }
    /**
     * Binds the pointer events to the tooltip trigger.
     * @private
     * @return {?}
     */
    _setupPointerEvents() {
        // The mouse events shouldn't be bound on mobile devices, because they can prevent the
        // first tap from firing its click event or can cause the tooltip to open for clicks.
        if (!this._platform.IOS && !this._platform.ANDROID) {
            this._passiveListeners
                .set('mouseenter', (/**
             * @return {?}
             */
            () => this.show()))
                .set('mouseleave', (/**
             * @return {?}
             */
            () => this.hide()));
        }
        else if (this.touchGestures !== 'off') {
            this._disableNativeGesturesIfNecessary();
            /** @type {?} */
            const touchendListener = (/**
             * @return {?}
             */
            () => {
                clearTimeout(this._touchstartTimeout);
                this.hide(this._defaultOptions.touchendHideDelay);
            });
            this._passiveListeners
                .set('touchend', touchendListener)
                .set('touchcancel', touchendListener)
                .set('touchstart', (/**
             * @return {?}
             */
            () => {
                // Note that it's important that we don't `preventDefault` here,
                // because it can prevent click events from firing on the element.
                clearTimeout(this._touchstartTimeout);
                this._touchstartTimeout = setTimeout((/**
                 * @return {?}
                 */
                () => this.show()), LONGPRESS_DELAY);
            }));
        }
        this._passiveListeners.forEach((/**
         * @param {?} listener
         * @param {?} event
         * @return {?}
         */
        (listener, event) => {
            this._elementRef.nativeElement.addEventListener(event, listener, passiveListenerOptions);
        }));
    }
    /**
     * Disables the native browser gestures, based on how the tooltip has been configured.
     * @private
     * @return {?}
     */
    _disableNativeGesturesIfNecessary() {
        /** @type {?} */
        const element = this._elementRef.nativeElement;
        /** @type {?} */
        const style = element.style;
        /** @type {?} */
        const gestures = this.touchGestures;
        if (gestures !== 'off') {
            // If gestures are set to `auto`, we don't disable text selection on inputs and
            // textareas, because it prevents the user from typing into them on iOS Safari.
            if (gestures === 'on' || (element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA')) {
                style.userSelect = style.msUserSelect = style.webkitUserSelect =
                    ((/** @type {?} */ (style))).MozUserSelect = 'none';
            }
            // If we have `auto` gestures and the element uses native HTML dragging,
            // we don't set `-webkit-user-drag` because it prevents the native behavior.
            if (gestures === 'on' || !element.draggable) {
                ((/** @type {?} */ (style))).webkitUserDrag = 'none';
            }
            style.touchAction = 'none';
            style.webkitTapHighlightColor = 'transparent';
        }
    }
}
MatTooltip.decorators = [
    { type: Directive, args: [{
                selector: '[matTooltip]',
                exportAs: 'matTooltip',
                host: {
                    '(keydown)': '_handleKeydown($event)',
                },
            },] }
];
/** @nocollapse */
MatTooltip.ctorParameters = () => [
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
];
MatTooltip.propDecorators = {
    position: [{ type: Input, args: ['matTooltipPosition',] }],
    disabled: [{ type: Input, args: ['matTooltipDisabled',] }],
    showDelay: [{ type: Input, args: ['matTooltipShowDelay',] }],
    hideDelay: [{ type: Input, args: ['matTooltipHideDelay',] }],
    touchGestures: [{ type: Input, args: ['matTooltipTouchGestures',] }],
    message: [{ type: Input, args: ['matTooltip',] }],
    tooltipClass: [{ type: Input, args: ['matTooltipClass',] }]
};
if (false) {
    /** @type {?} */
    MatTooltip.prototype._overlayRef;
    /** @type {?} */
    MatTooltip.prototype._tooltipInstance;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._portal;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._position;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._disabled;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._tooltipClass;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._scrollStrategy;
    /**
     * The default delay in ms before showing the tooltip after show is called
     * @type {?}
     */
    MatTooltip.prototype.showDelay;
    /**
     * The default delay in ms before hiding the tooltip after hide is called
     * @type {?}
     */
    MatTooltip.prototype.hideDelay;
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
     * @type {?}
     */
    MatTooltip.prototype.touchGestures;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._message;
    /**
     * Manually-bound passive event listeners.
     * @type {?}
     * @private
     */
    MatTooltip.prototype._passiveListeners;
    /**
     * Timer started at the last `touchstart` event.
     * @type {?}
     * @private
     */
    MatTooltip.prototype._touchstartTimeout;
    /**
     * Emits when the component is destroyed.
     * @type {?}
     * @private
     */
    MatTooltip.prototype._destroyed;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._overlay;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._scrollDispatcher;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._viewContainerRef;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._ngZone;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._platform;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._ariaDescriber;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._focusMonitor;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._dir;
    /**
     * @type {?}
     * @private
     */
    MatTooltip.prototype._defaultOptions;
}
/**
 * Internal component that wraps the tooltip's content.
 * \@docs-private
 */
export class TooltipComponent {
    /**
     * @param {?} _changeDetectorRef
     * @param {?} _breakpointObserver
     */
    constructor(_changeDetectorRef, _breakpointObserver) {
        this._changeDetectorRef = _changeDetectorRef;
        this._breakpointObserver = _breakpointObserver;
        /**
         * Property watched by the animation framework to show or hide the tooltip
         */
        this._visibility = 'initial';
        /**
         * Whether interactions on the page should close the tooltip
         */
        this._closeOnInteraction = false;
        /**
         * Subject for notifying that the tooltip has been hidden from the view
         */
        this._onHide = new Subject();
        /**
         * Stream that emits whether the user has a handset-sized display.
         */
        this._isHandset = this._breakpointObserver.observe(Breakpoints.Handset);
    }
    /**
     * Shows the tooltip with an animation originating from the provided origin
     * @param {?} delay Amount of milliseconds to the delay showing the tooltip.
     * @return {?}
     */
    show(delay) {
        // Cancel the delayed hide if it is scheduled
        if (this._hideTimeoutId) {
            clearTimeout(this._hideTimeoutId);
            this._hideTimeoutId = null;
        }
        // Body interactions should cancel the tooltip if there is a delay in showing.
        this._closeOnInteraction = true;
        this._showTimeoutId = setTimeout((/**
         * @return {?}
         */
        () => {
            this._visibility = 'visible';
            this._showTimeoutId = null;
            // Mark for check so if any parent component has set the
            // ChangeDetectionStrategy to OnPush it will be checked anyways
            this._markForCheck();
        }), delay);
    }
    /**
     * Begins the animation to hide the tooltip after the provided delay in ms.
     * @param {?} delay Amount of milliseconds to delay showing the tooltip.
     * @return {?}
     */
    hide(delay) {
        // Cancel the delayed show if it is scheduled
        if (this._showTimeoutId) {
            clearTimeout(this._showTimeoutId);
            this._showTimeoutId = null;
        }
        this._hideTimeoutId = setTimeout((/**
         * @return {?}
         */
        () => {
            this._visibility = 'hidden';
            this._hideTimeoutId = null;
            // Mark for check so if any parent component has set the
            // ChangeDetectionStrategy to OnPush it will be checked anyways
            this._markForCheck();
        }), delay);
    }
    /**
     * Returns an observable that notifies when the tooltip has been hidden from view.
     * @return {?}
     */
    afterHidden() {
        return this._onHide.asObservable();
    }
    /**
     * Whether the tooltip is being displayed.
     * @return {?}
     */
    isVisible() {
        return this._visibility === 'visible';
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._onHide.complete();
    }
    /**
     * @return {?}
     */
    _animationStart() {
        this._closeOnInteraction = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _animationDone(event) {
        /** @type {?} */
        const toState = (/** @type {?} */ (event.toState));
        if (toState === 'hidden' && !this.isVisible()) {
            this._onHide.next();
        }
        if (toState === 'visible' || toState === 'hidden') {
            this._closeOnInteraction = true;
        }
    }
    /**
     * Interactions on the HTML body should close the tooltip immediately as defined in the
     * material design spec.
     * https://material.io/design/components/tooltips.html#behavior
     * @return {?}
     */
    _handleBodyInteraction() {
        if (this._closeOnInteraction) {
            this.hide(0);
        }
    }
    /**
     * Marks that the tooltip needs to be checked in the next change detection run.
     * Mainly used for rendering the initial text before positioning a tooltip, which
     * can be problematic in components with OnPush change detection.
     * @return {?}
     */
    _markForCheck() {
        this._changeDetectorRef.markForCheck();
    }
}
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
TooltipComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: BreakpointObserver }
];
if (false) {
    /**
     * Message to display in the tooltip
     * @type {?}
     */
    TooltipComponent.prototype.message;
    /**
     * Classes to be added to the tooltip. Supports the same syntax as `ngClass`.
     * @type {?}
     */
    TooltipComponent.prototype.tooltipClass;
    /**
     * The timeout ID of any current timer set to show the tooltip
     * @type {?}
     */
    TooltipComponent.prototype._showTimeoutId;
    /**
     * The timeout ID of any current timer set to hide the tooltip
     * @type {?}
     */
    TooltipComponent.prototype._hideTimeoutId;
    /**
     * Property watched by the animation framework to show or hide the tooltip
     * @type {?}
     */
    TooltipComponent.prototype._visibility;
    /**
     * Whether interactions on the page should close the tooltip
     * @type {?}
     * @private
     */
    TooltipComponent.prototype._closeOnInteraction;
    /**
     * Subject for notifying that the tooltip has been hidden from the view
     * @type {?}
     * @private
     */
    TooltipComponent.prototype._onHide;
    /**
     * Stream that emits whether the user has a handset-sized display.
     * @type {?}
     */
    TooltipComponent.prototype._isHandset;
    /**
     * @type {?}
     * @private
     */
    TooltipComponent.prototype._changeDetectorRef;
    /**
     * @type {?}
     * @private
     */
    TooltipComponent.prototype._breakpointObserver;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90b29sdGlwL3Rvb2x0aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQVFBLE9BQU8sRUFBQyxhQUFhLEVBQUUsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDOUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFDLGtCQUFrQixFQUFFLFdBQVcsRUFBa0IsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRixPQUFPLEVBSUwsT0FBTyxHQUtSLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLFFBQVEsRUFBRSwrQkFBK0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUNSLGdCQUFnQixFQUNoQixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFhLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6QyxPQUFPLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRS9DLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7OztBQWdCMUQsTUFBTSxPQUFPLGtC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RUFBRTs7O29CQUdKLGNBQWMsRUFBRSxzQ0FBc0M7b0JBQ3RELGNBQWMsRUFBRSwrQkFBK0I7b0JBQy9DLGFBQWEsRUFBRSxNQUFNO2lCQUN0Qjs7YUFDRjs7OztZQS9rQkMsaUJBQWlCO1lBaEJYLGtCQUFrQjs7Ozs7OztJQWttQnhCLG1DQUFnQjs7Ozs7SUFHaEIsd0NBQStEOzs7OztJQUcvRCwwQ0FBOEI7Ozs7O0lBRzlCLDBDQUE4Qjs7Ozs7SUFHOUIsdUNBQTJDOzs7Ozs7SUFHM0MsK0NBQTZDOzs7Ozs7SUFHN0MsbUNBQXVEOzs7OztJQUd2RCxzQ0FBZ0c7Ozs7O0lBRzlGLDhDQUE2Qzs7Ozs7SUFDN0MsK0NBQStDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7QXJpYURlc2NyaWJlciwgRm9jdXNNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RVNDQVBFLCBoYXNNb2RpZmllcktleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7QnJlYWtwb2ludE9ic2VydmVyLCBCcmVha3BvaW50cywgQnJlYWtwb2ludFN0YXRlfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7XG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbiAgSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3MsXG4gIE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbixcbiAgT3ZlcmxheSxcbiAgT3ZlcmxheUNvbm5lY3Rpb25Qb3NpdGlvbixcbiAgT3ZlcmxheVJlZixcbiAgU2Nyb2xsU3RyYXRlZ3ksXG4gIFZlcnRpY2FsQ29ubmVjdGlvblBvcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtQbGF0Zm9ybSwgbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9uc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7Q29tcG9uZW50UG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7U2Nyb2xsRGlzcGF0Y2hlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge21hdFRvb2x0aXBBbmltYXRpb25zfSBmcm9tICcuL3Rvb2x0aXAtYW5pbWF0aW9ucyc7XG5cblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgYSB0b29sdGlwLiAqL1xuZXhwb3J0IHR5cGUgVG9vbHRpcFBvc2l0aW9uID0gJ2xlZnQnIHwgJ3JpZ2h0JyB8ICdhYm92ZScgfCAnYmVsb3cnIHwgJ2JlZm9yZScgfCAnYWZ0ZXInO1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGhvdyB0aGUgdG9vbHRpcCB0cmlnZ2VyIHNob3VsZCBoYW5kbGUgdG91Y2ggZ2VzdHVyZXMuXG4gKiBTZWUgYE1hdFRvb2x0aXAudG91Y2hHZXN0dXJlc2AgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCB0eXBlIFRvb2x0aXBUb3VjaEdlc3R1cmVzID0gJ2F1dG8nIHwgJ29uJyB8ICdvZmYnO1xuXG4vKiogUG9zc2libGUgdmlzaWJpbGl0eSBzdGF0ZXMgb2YgYSB0b29sdGlwLiAqL1xuZXhwb3J0IHR5cGUgVG9vbHRpcFZpc2liaWxpdHkgPSAnaW5pdGlhbCcgfCAndmlzaWJsZScgfCAnaGlkZGVuJztcblxuLyoqIFRpbWUgaW4gbXMgdG8gdGhyb3R0bGUgcmVwb3NpdGlvbmluZyBhZnRlciBzY3JvbGwgZXZlbnRzLiAqL1xuZXhwb3J0IGNvbnN0IFNDUk9MTF9USFJPVFRMRV9NUyA9IDIwO1xuXG4vKiogQ1NTIGNsYXNzIHRoYXQgd2lsbCBiZSBhdHRhY2hlZCB0byB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbmV4cG9ydCBjb25zdCBUT09MVElQX1BBTkVMX0NMQVNTID0gJ21hdC10b29sdGlwLXBhbmVsJztcblxuLyoqIE9wdGlvbnMgdXNlZCB0byBiaW5kIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXJzLiAqL1xuY29uc3QgcGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe3Bhc3NpdmU6IHRydWV9KTtcblxuLyoqXG4gKiBUaW1lIGJldHdlZW4gdGhlIHVzZXIgcHV0dGluZyB0aGUgcG9pbnRlciBvbiBhIHRvb2x0aXBcbiAqIHRyaWdnZXIgYW5kIHRoZSBsb25nIHByZXNzIGV2ZW50IGJlaW5nIGZpcmVkLlxuICovXG5jb25zdCBMT05HUFJFU1NfREVMQVkgPSA1MDA7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBlcnJvciB0byBiZSB0aHJvd24gaWYgdGhlIHVzZXIgc3VwcGxpZWQgYW4gaW52YWxpZCB0b29sdGlwIHBvc2l0aW9uLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0VG9vbHRpcEludmFsaWRQb3NpdGlvbkVycm9yKHBvc2l0aW9uOiBzdHJpbmcpIHtcbiAgcmV0dXJuIEVycm9yKGBUb29sdGlwIHBvc2l0aW9uIFwiJHtwb3NpdGlvbn1cIiBpcyBpbnZhbGlkLmApO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIGEgdG9vbHRpcCBpcyB2aXNpYmxlLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWSA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PignbWF0LXRvb2x0aXAtc2Nyb2xsLXN0cmF0ZWd5Jyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKHtzY3JvbGxUaHJvdHRsZTogU0NST0xMX1RIUk9UVExFX01TfSk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWSxcbn07XG5cbi8qKiBEZWZhdWx0IGBtYXRUb29sdGlwYCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFRvb2x0aXBEZWZhdWx0T3B0aW9ucyB7XG4gIHNob3dEZWxheTogbnVtYmVyO1xuICBoaWRlRGVsYXk6IG51bWJlcjtcbiAgdG91Y2hlbmRIaWRlRGVsYXk6IG51bWJlcjtcbiAgdG91Y2hHZXN0dXJlcz86IFRvb2x0aXBUb3VjaEdlc3R1cmVzO1xuICBwb3NpdGlvbj86IFRvb2x0aXBQb3NpdGlvbjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXRUb29sdGlwYC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfVE9PTFRJUF9ERUZBVUxUX09QVElPTlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRUb29sdGlwRGVmYXVsdE9wdGlvbnM+KCdtYXQtdG9vbHRpcC1kZWZhdWx0LW9wdGlvbnMnLCB7XG4gICAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgICBmYWN0b3J5OiBNQVRfVE9PTFRJUF9ERUZBVUxUX09QVElPTlNfRkFDVE9SWVxuICAgIH0pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9UT09MVElQX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE1hdFRvb2x0aXBEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgc2hvd0RlbGF5OiAwLFxuICAgIGhpZGVEZWxheTogMCxcbiAgICB0b3VjaGVuZEhpZGVEZWxheTogMTUwMCxcbiAgfTtcbn1cblxuLyoqXG4gKiBEaXJlY3RpdmUgdGhhdCBhdHRhY2hlcyBhIG1hdGVyaWFsIGRlc2lnbiB0b29sdGlwIHRvIHRoZSBob3N0IGVsZW1lbnQuIEFuaW1hdGVzIHRoZSBzaG93aW5nIGFuZFxuICogaGlkaW5nIG9mIGEgdG9vbHRpcCBwcm92aWRlZCBwb3NpdGlvbiAoZGVmYXVsdHMgdG8gYmVsb3cgdGhlIGVsZW1lbnQpLlxuICpcbiAqIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbXBvbmVudHMvdG9vbHRpcHMuaHRtbFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VG9vbHRpcF0nLFxuICBleHBvcnRBczogJ21hdFRvb2x0aXAnLFxuICBob3N0OiB7XG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VG9vbHRpcCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25Jbml0IHtcbiAgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYgfCBudWxsO1xuICBfdG9vbHRpcEluc3RhbmNlOiBUb29sdGlwQ29tcG9uZW50IHwgbnVsbDtcblxuICBwcml2YXRlIF9wb3J0YWw6IENvbXBvbmVudFBvcnRhbDxUb29sdGlwQ29tcG9uZW50PjtcbiAgcHJpdmF0ZSBfcG9zaXRpb246IFRvb2x0aXBQb3NpdGlvbiA9ICdiZWxvdyc7XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgX3Rvb2x0aXBDbGFzczogc3RyaW5nfHN0cmluZ1tdfFNldDxzdHJpbmc+fHtba2V5OiBzdHJpbmddOiBhbnl9O1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG5cbiAgLyoqIEFsbG93cyB0aGUgdXNlciB0byBkZWZpbmUgdGhlIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQgZWxlbWVudCAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBQb3NpdGlvbicpXG4gIGdldCBwb3NpdGlvbigpOiBUb29sdGlwUG9zaXRpb24geyByZXR1cm4gdGhpcy5fcG9zaXRpb247IH1cbiAgc2V0IHBvc2l0aW9uKHZhbHVlOiBUb29sdGlwUG9zaXRpb24pIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX3Bvc2l0aW9uKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbiA9IHZhbHVlO1xuXG4gICAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuXG4gICAgICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UhLnNob3coMCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9vdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIERpc2FibGVzIHRoZSBkaXNwbGF5IG9mIHRoZSB0b29sdGlwLiAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBEaXNhYmxlZCcpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVkOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZSkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIC8vIElmIHRvb2x0aXAgaXMgZGlzYWJsZWQsIGhpZGUgaW1tZWRpYXRlbHkuXG4gICAgaWYgKHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICB0aGlzLmhpZGUoMCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSBkZWZhdWx0IGRlbGF5IGluIG1zIGJlZm9yZSBzaG93aW5nIHRoZSB0b29sdGlwIGFmdGVyIHNob3cgaXMgY2FsbGVkICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcFNob3dEZWxheScpIHNob3dEZWxheSA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLnNob3dEZWxheTtcblxuICAvKiogVGhlIGRlZmF1bHQgZGVsYXkgaW4gbXMgYmVmb3JlIGhpZGluZyB0aGUgdG9vbHRpcCBhZnRlciBoaWRlIGlzIGNhbGxlZCAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBIaWRlRGVsYXknKSBoaWRlRGVsYXkgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5oaWRlRGVsYXk7XG5cbiAgLyoqXG4gICAqIEhvdyB0b3VjaCBnZXN0dXJlcyBzaG91bGQgYmUgaGFuZGxlZCBieSB0aGUgdG9vbHRpcC4gT24gdG91Y2ggZGV2aWNlcyB0aGUgdG9vbHRpcCBkaXJlY3RpdmVcbiAgICogdXNlcyBhIGxvbmcgcHJlc3MgZ2VzdHVyZSB0byBzaG93IGFuZCBoaWRlLCBob3dldmVyIGl0IGNhbiBjb25mbGljdCB3aXRoIHRoZSBuYXRpdmUgYnJvd3NlclxuICAgKiBnZXN0dXJlcy4gVG8gd29yayBhcm91bmQgdGhlIGNvbmZsaWN0LCBBbmd1bGFyIE1hdGVyaWFsIGRpc2FibGVzIG5hdGl2ZSBnZXN0dXJlcyBvbiB0aGVcbiAgICogdHJpZ2dlciwgYnV0IHRoYXQgbWlnaHQgbm90IGJlIGRlc2lyYWJsZSBvbiBwYXJ0aWN1bGFyIGVsZW1lbnRzIChlLmcuIGlucHV0cyBhbmQgZHJhZ2dhYmxlXG4gICAqIGVsZW1lbnRzKS4gVGhlIGRpZmZlcmVudCB2YWx1ZXMgZm9yIHRoaXMgb3B0aW9uIGNvbmZpZ3VyZSB0aGUgdG91Y2ggZXZlbnQgaGFuZGxpbmcgYXMgZm9sbG93czpcbiAgICogLSBgYXV0b2AgLSBFbmFibGVzIHRvdWNoIGdlc3R1cmVzIGZvciBhbGwgZWxlbWVudHMsIGJ1dCB0cmllcyB0byBhdm9pZCBjb25mbGljdHMgd2l0aCBuYXRpdmVcbiAgICogICBicm93c2VyIGdlc3R1cmVzIG9uIHBhcnRpY3VsYXIgZWxlbWVudHMuIEluIHBhcnRpY3VsYXIsIGl0IGFsbG93cyB0ZXh0IHNlbGVjdGlvbiBvbiBpbnB1dHNcbiAgICogICBhbmQgdGV4dGFyZWFzLCBhbmQgcHJlc2VydmVzIHRoZSBuYXRpdmUgYnJvd3NlciBkcmFnZ2luZyBvbiBlbGVtZW50cyBtYXJrZWQgYXMgYGRyYWdnYWJsZWAuXG4gICAqIC0gYG9uYCAtIEVuYWJsZXMgdG91Y2ggZ2VzdHVyZXMgZm9yIGFsbCBlbGVtZW50cyBhbmQgZGlzYWJsZXMgbmF0aXZlXG4gICAqICAgYnJvd3NlciBnZXN0dXJlcyB3aXRoIG5vIGV4Y2VwdGlvbnMuXG4gICAqIC0gYG9mZmAgLSBEaXNhYmxlcyB0b3VjaCBnZXN0dXJlcy4gTm90ZSB0aGF0IHRoaXMgd2lsbCBwcmV2ZW50IHRoZSB0b29sdGlwIGZyb21cbiAgICogICBzaG93aW5nIG9uIHRvdWNoIGRldmljZXMuXG4gICAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBUb3VjaEdlc3R1cmVzJykgdG91Y2hHZXN0dXJlczogVG9vbHRpcFRvdWNoR2VzdHVyZXMgPSAnYXV0byc7XG5cbiAgLyoqIFRoZSBtZXNzYWdlIHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgdG9vbHRpcCAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXAnKVxuICBnZXQgbWVzc2FnZSgpIHsgcmV0dXJuIHRoaXMuX21lc3NhZ2U7IH1cbiAgc2V0IG1lc3NhZ2UodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2FyaWFEZXNjcmliZXIucmVtb3ZlRGVzY3JpcHRpb24odGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLl9tZXNzYWdlKTtcblxuICAgIC8vIElmIHRoZSBtZXNzYWdlIGlzIG5vdCBhIHN0cmluZyAoZS5nLiBudW1iZXIpLCBjb252ZXJ0IGl0IHRvIGEgc3RyaW5nIGFuZCB0cmltIGl0LlxuICAgIHRoaXMuX21lc3NhZ2UgPSB2YWx1ZSAhPSBudWxsID8gYCR7dmFsdWV9YC50cmltKCkgOiAnJztcblxuICAgIGlmICghdGhpcy5fbWVzc2FnZSAmJiB0aGlzLl9pc1Rvb2x0aXBWaXNpYmxlKCkpIHtcbiAgICAgIHRoaXMuaGlkZSgwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdXBkYXRlVG9vbHRpcE1lc3NhZ2UoKTtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIC8vIFRoZSBgQXJpYURlc2NyaWJlcmAgaGFzIHNvbWUgZnVuY3Rpb25hbGl0eSB0aGF0IGF2b2lkcyBhZGRpbmcgYSBkZXNjcmlwdGlvbiBpZiBpdCdzIHRoZVxuICAgICAgICAvLyBzYW1lIGFzIHRoZSBgYXJpYS1sYWJlbGAgb2YgYW4gZWxlbWVudCwgaG93ZXZlciB3ZSBjYW4ndCBrbm93IHdoZXRoZXIgdGhlIHRvb2x0aXAgdHJpZ2dlclxuICAgICAgICAvLyBoYXMgYSBkYXRhLWJvdW5kIGBhcmlhLWxhYmVsYCBvciB3aGVuIGl0J2xsIGJlIHNldCBmb3IgdGhlIGZpcnN0IHRpbWUuIFdlIGNhbiBhdm9pZCB0aGVcbiAgICAgICAgLy8gaXNzdWUgYnkgZGVmZXJyaW5nIHRoZSBkZXNjcmlwdGlvbiBieSBhIHRpY2sgc28gQW5ndWxhciBoYXMgdGltZSB0byBzZXQgdGhlIGBhcmlhLWxhYmVsYC5cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fYXJpYURlc2NyaWJlci5kZXNjcmliZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMubWVzc2FnZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX21lc3NhZ2UgPSAnJztcblxuICAvKiogQ2xhc3NlcyB0byBiZSBwYXNzZWQgdG8gdGhlIHRvb2x0aXAuIFN1cHBvcnRzIHRoZSBzYW1lIHN5bnRheCBhcyBgbmdDbGFzc2AuICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcENsYXNzJylcbiAgZ2V0IHRvb2x0aXBDbGFzcygpIHsgcmV0dXJuIHRoaXMuX3Rvb2x0aXBDbGFzczsgfVxuICBzZXQgdG9vbHRpcENsYXNzKHZhbHVlOiBzdHJpbmd8c3RyaW5nW118.2.0-sha-3b0f60469PHN0cmluZz58e1trZXk6IHN0cmluZ106IGFueX0pIHtcbiAgICB0aGlzLl90b29sdGlwQ2xhc3MgPSB2YWx1ZTtcbiAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICB0aGlzLl9zZXRUb29sdGlwQ2xhc3ModGhpcy5fdG9vbHRpcENsYXNzKTtcbiAgICB9XG4gIH1cblxuICAvKiogTWFudWFsbHktYm91bmQgcGFzc2l2ZSBldmVudCBsaXN0ZW5lcnMuICovXG4gIHByaXZhdGUgX3Bhc3NpdmVMaXN0ZW5lcnMgPSBuZXcgTWFwPHN0cmluZywgRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdD4oKTtcblxuICAvKiogVGltZXIgc3RhcnRlZCBhdCB0aGUgbGFzdCBgdG91Y2hzdGFydGAgZXZlbnQuICovXG4gIHByaXZhdGUgX3RvdWNoc3RhcnRUaW1lb3V0OiBudW1iZXI7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9zY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHByaXZhdGUgX2FyaWFEZXNjcmliZXI6IEFyaWFEZXNjcmliZXIsXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgQEluamVjdChNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1kpIHNjcm9sbFN0cmF0ZWd5OiBhbnksXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9UT09MVElQX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zOiBNYXRUb29sdGlwRGVmYXVsdE9wdGlvbnMsXG4gICAgICAvKipcbiAgICAgICAqIEBkZXByZWNhdGVkIF9oYW1tZXJMb2FkZXIgcGFyYW1ldGVyIHRvIGJlIHJlbW92ZWQuXG4gICAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDkuMC4wXG4gICAgICAgKi9cbiAgICAgIC8vIE5vdGUgdGhhdCB3ZSBuZWVkIHRvIGdpdmUgQW5ndWxhciBzb21ldGhpbmcgdG8gaW5qZWN0IGhlcmUgc28gaXQgZG9lc24ndCB0aHJvdy5cbiAgICAgIEBJbmplY3QoRWxlbWVudFJlZikgX2hhbW1lckxvYWRlcj86IGFueSkge1xuXG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcblxuICAgIGlmIChfZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgIGlmIChfZGVmYXVsdE9wdGlvbnMucG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IF9kZWZhdWx0T3B0aW9ucy5wb3NpdGlvbjtcbiAgICAgIH1cblxuICAgICAgaWYgKF9kZWZhdWx0T3B0aW9ucy50b3VjaEdlc3R1cmVzKSB7XG4gICAgICAgIHRoaXMudG91Y2hHZXN0dXJlcyA9IF9kZWZhdWx0T3B0aW9ucy50b3VjaEdlc3R1cmVzO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9mb2N1c01vbml0b3IubW9uaXRvcihfZWxlbWVudFJlZilcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZShvcmlnaW4gPT4ge1xuICAgICAgICAvLyBOb3RlIHRoYXQgdGhlIGZvY3VzIG1vbml0b3IgcnVucyBvdXRzaWRlIHRoZSBBbmd1bGFyIHpvbmUuXG4gICAgICAgIGlmICghb3JpZ2luKSB7XG4gICAgICAgICAgX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5oaWRlKDApKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcmlnaW4gPT09ICdrZXlib2FyZCcpIHtcbiAgICAgICAgICBfbmdab25lLnJ1bigoKSA9PiB0aGlzLnNob3coKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR1cCBzdHlsaW5nLXNwZWNpZmljIHRoaW5nc1xuICAgKi9cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gVGhpcyBuZWVkcyB0byBoYXBwZW4gaW4gYG5nT25Jbml0YCBzbyB0aGUgaW5pdGlhbCB2YWx1ZXMgZm9yIGFsbCBpbnB1dHMgaGF2ZSBiZWVuIHNldC5cbiAgICB0aGlzLl9zZXR1cFBvaW50ZXJFdmVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwb3NlIHRoZSB0b29sdGlwIHdoZW4gZGVzdHJveWVkLlxuICAgKi9cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RvdWNoc3RhcnRUaW1lb3V0KTtcblxuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ2xlYW4gdXAgdGhlIGV2ZW50IGxpc3RlbmVycyBzZXQgaW4gdGhlIGNvbnN0cnVjdG9yXG4gICAgdGhpcy5fcGFzc2l2ZUxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lciwgZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgcGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyk7XG4gICAgfSk7XG4gICAgdGhpcy5fcGFzc2l2ZUxpc3RlbmVycy5jbGVhcigpO1xuXG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcblxuICAgIHRoaXMuX2FyaWFEZXNjcmliZXIucmVtb3ZlRGVzY3JpcHRpb24odGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLm1lc3NhZ2UpO1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgfVxuXG4gIC8qKiBTaG93cyB0aGUgdG9vbHRpcCBhZnRlciB0aGUgZGVsYXkgaW4gbXMsIGRlZmF1bHRzIHRvIHRvb2x0aXAtZGVsYXktc2hvdyBvciAwbXMgaWYgbm8gaW5wdXQgKi9cbiAgc2hvdyhkZWxheTogbnVtYmVyID0gdGhpcy5zaG93RGVsYXkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5tZXNzYWdlIHx8ICh0aGlzLl9pc1Rvb2x0aXBWaXNpYmxlKCkgJiZcbiAgICAgICF0aGlzLl90b29sdGlwSW5zdGFuY2UhLl9zaG93VGltZW91dElkICYmICF0aGlzLl90b29sdGlwSW5zdGFuY2UhLl9oaWRlVGltZW91dElkKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXkoKTtcblxuICAgIHRoaXMuX2RldGFjaCgpO1xuICAgIHRoaXMuX3BvcnRhbCA9IHRoaXMuX3BvcnRhbCB8fCBuZXcgQ29tcG9uZW50UG9ydGFsKFRvb2x0aXBDb21wb25lbnQsIHRoaXMuX3ZpZXdDb250YWluZXJSZWYpO1xuICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSA9IG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX3BvcnRhbCkuaW5zdGFuY2U7XG4gICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLmFmdGVySGlkZGVuKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9kZXRhY2goKSk7XG4gICAgdGhpcy5fc2V0VG9vbHRpcENsYXNzKHRoaXMuX3Rvb2x0aXBDbGFzcyk7XG4gICAgdGhpcy5fdXBkYXRlVG9vbHRpcE1lc3NhZ2UoKTtcbiAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UhLnNob3coZGVsYXkpO1xuICB9XG5cbiAgLyoqIEhpZGVzIHRoZSB0b29sdGlwIGFmdGVyIHRoZSBkZWxheSBpbiBtcywgZGVmYXVsdHMgdG8gdG9vbHRpcC1kZWxheS1oaWRlIG9yIDBtcyBpZiBubyBpbnB1dCAqL1xuICBoaWRlKGRlbGF5OiBudW1iZXIgPSB0aGlzLmhpZGVEZWxheSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5oaWRlKGRlbGF5KTtcbiAgICB9XG4gIH1cblxuICAvKiogU2hvd3MvaGlkZXMgdGhlIHRvb2x0aXAgKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIHRoaXMuX2lzVG9vbHRpcFZpc2libGUoKSA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KCk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSB0b29sdGlwIGlzIGN1cnJlbnRseSB2aXNpYmxlIHRvIHRoZSB1c2VyICovXG4gIF9pc1Rvb2x0aXBWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuX3Rvb2x0aXBJbnN0YW5jZSAmJiB0aGlzLl90b29sdGlwSW5zdGFuY2UuaXNWaXNpYmxlKCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyB0aGUga2V5ZG93biBldmVudHMgb24gdGhlIGhvc3QgZWxlbWVudC4gKi9cbiAgX2hhbmRsZUtleWRvd24oZTogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICh0aGlzLl9pc1Rvb2x0aXBWaXNpYmxlKCkgJiYgZS5rZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyS2V5KGUpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdGhpcy5oaWRlKDApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDcmVhdGUgdGhlIG92ZXJsYXkgY29uZmlnIGFuZCBwb3NpdGlvbiBzdHJhdGVneSAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KCk6IE92ZXJsYXlSZWYge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVJlZjtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JvbGxhYmxlQW5jZXN0b3JzID1cbiAgICAgICAgdGhpcy5fc2Nyb2xsRGlzcGF0Y2hlci5nZXRBbmNlc3RvclNjcm9sbENvbnRhaW5lcnModGhpcy5fZWxlbWVudFJlZik7XG5cbiAgICAvLyBDcmVhdGUgY29ubmVjdGVkIHBvc2l0aW9uIHN0cmF0ZWd5IHRoYXQgbGlzdGVucyBmb3Igc2Nyb2xsIGV2ZW50cyB0byByZXBvc2l0aW9uLlxuICAgIGNvbnN0IHN0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5fZWxlbWVudFJlZilcbiAgICAgICAgICAgICAgICAgICAgICAgICAud2l0aFRyYW5zZm9ybU9yaWdpbk9uKCcubWF0LXRvb2x0aXAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgIC53aXRoRmxleGlibGVEaW1lbnNpb25zKGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgIC53aXRoVmlld3BvcnRNYXJnaW4oOClcbiAgICAgICAgICAgICAgICAgICAgICAgICAud2l0aFNjcm9sbGFibGVDb250YWluZXJzKHNjcm9sbGFibGVBbmNlc3RvcnMpO1xuXG4gICAgc3RyYXRlZ3kucG9zaXRpb25DaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShjaGFuZ2UgPT4ge1xuICAgICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgICBpZiAoY2hhbmdlLnNjcm9sbGFibGVWaWV3UHJvcGVydGllcy5pc092ZXJsYXlDbGlwcGVkICYmIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5pc1Zpc2libGUoKSkge1xuICAgICAgICAgIC8vIEFmdGVyIHBvc2l0aW9uIGNoYW5nZXMgb2NjdXIgYW5kIHRoZSBvdmVybGF5IGlzIGNsaXBwZWQgYnlcbiAgICAgICAgICAvLyBhIHBhcmVudCBzY3JvbGxhYmxlIHRoZW4gY2xvc2UgdGhlIHRvb2x0aXAuXG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLmhpZGUoMCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUoe1xuICAgICAgZGlyZWN0aW9uOiB0aGlzLl9kaXIsXG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiBzdHJhdGVneSxcbiAgICAgIHBhbmVsQ2xhc3M6IFRPT0xUSVBfUEFORUxfQ0xBU1MsXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKVxuICAgIH0pO1xuXG4gICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcblxuICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNobWVudHMoKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2RldGFjaCgpKTtcblxuICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmO1xuICB9XG5cbiAgLyoqIERldGFjaGVzIHRoZSBjdXJyZW50bHktYXR0YWNoZWQgdG9vbHRpcC4gKi9cbiAgcHJpdmF0ZSBfZGV0YWNoKCkge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmICYmIHRoaXMuX292ZXJsYXlSZWYuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2goKTtcbiAgICB9XG5cbiAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IHRvb2x0aXAuICovXG4gIHByaXZhdGUgX3VwZGF0ZVBvc2l0aW9uKCkge1xuICAgIGNvbnN0IHBvc2l0aW9uID1cbiAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEuZ2V0Q29uZmlnKCkucG9zaXRpb25TdHJhdGVneSBhcyBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3k7XG4gICAgY29uc3Qgb3JpZ2luID0gdGhpcy5fZ2V0T3JpZ2luKCk7XG4gICAgY29uc3Qgb3ZlcmxheSA9IHRoaXMuX2dldE92ZXJsYXlQb3NpdGlvbigpO1xuXG4gICAgcG9zaXRpb24ud2l0aFBvc2l0aW9ucyhbXG4gICAgICB7Li4ub3JpZ2luLm1haW4sIC4uLm92ZXJsYXkubWFpbn0sXG4gICAgICB7Li4ub3JpZ2luLmZhbGxiYWNrLCAuLi5vdmVybGF5LmZhbGxiYWNrfVxuICAgIF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9yaWdpbiBwb3NpdGlvbiBhbmQgYSBmYWxsYmFjayBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgdXNlcidzIHBvc2l0aW9uIHByZWZlcmVuY2UuXG4gICAqIFRoZSBmYWxsYmFjayBwb3NpdGlvbiBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgb3JpZ2luIChlLmcuIGAnYmVsb3cnIC0+ICdhYm92ZSdgKS5cbiAgICovXG4gIF9nZXRPcmlnaW4oKToge21haW46IE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbiwgZmFsbGJhY2s6IE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbn0ge1xuICAgIGNvbnN0IGlzTHRyID0gIXRoaXMuX2RpciB8fCB0aGlzLl9kaXIudmFsdWUgPT0gJ2x0cic7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xuICAgIGxldCBvcmlnaW5Qb3NpdGlvbjogT3JpZ2luQ29ubmVjdGlvblBvc2l0aW9uO1xuXG4gICAgaWYgKHBvc2l0aW9uID09ICdhYm92ZScgfHwgcG9zaXRpb24gPT0gJ2JlbG93Jykge1xuICAgICAgb3JpZ2luUG9zaXRpb24gPSB7b3JpZ2luWDogJ2NlbnRlcicsIG9yaWdpblk6IHBvc2l0aW9uID09ICdhYm92ZScgPyAndG9wJyA6ICdib3R0b20nfTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgcG9zaXRpb24gPT0gJ2JlZm9yZScgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAnbGVmdCcgJiYgaXNMdHIpIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ3JpZ2h0JyAmJiAhaXNMdHIpKSB7XG4gICAgICBvcmlnaW5Qb3NpdGlvbiA9IHtvcmlnaW5YOiAnc3RhcnQnLCBvcmlnaW5ZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBvc2l0aW9uID09ICdhZnRlcicgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmIGlzTHRyKSB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiAhaXNMdHIpKSB7XG4gICAgICBvcmlnaW5Qb3NpdGlvbiA9IHtvcmlnaW5YOiAnZW5kJywgb3JpZ2luWTogJ2NlbnRlcid9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBnZXRNYXRUb29sdGlwSW52YWxpZFBvc2l0aW9uRXJyb3IocG9zaXRpb24pO1xuICAgIH1cblxuICAgIGNvbnN0IHt4LCB5fSA9IHRoaXMuX2ludmVydFBvc2l0aW9uKG9yaWdpblBvc2l0aW9uLm9yaWdpblgsIG9yaWdpblBvc2l0aW9uLm9yaWdpblkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1haW46IG9yaWdpblBvc2l0aW9uLFxuICAgICAgZmFsbGJhY2s6IHtvcmlnaW5YOiB4LCBvcmlnaW5ZOiB5fVxuICAgIH07XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgb3ZlcmxheSBwb3NpdGlvbiBhbmQgYSBmYWxsYmFjayBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgdXNlcidzIHByZWZlcmVuY2UgKi9cbiAgX2dldE92ZXJsYXlQb3NpdGlvbigpOiB7bWFpbjogT3ZlcmxheUNvbm5lY3Rpb25Qb3NpdGlvbiwgZmFsbGJhY2s6IE92ZXJsYXlDb25uZWN0aW9uUG9zaXRpb259IHtcbiAgICBjb25zdCBpc0x0ciA9ICF0aGlzLl9kaXIgfHwgdGhpcy5fZGlyLnZhbHVlID09ICdsdHInO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcbiAgICBsZXQgb3ZlcmxheVBvc2l0aW9uOiBPdmVybGF5Q29ubmVjdGlvblBvc2l0aW9uO1xuXG4gICAgaWYgKHBvc2l0aW9uID09ICdhYm92ZScpIHtcbiAgICAgIG92ZXJsYXlQb3NpdGlvbiA9IHtvdmVybGF5WDogJ2NlbnRlcicsIG92ZXJsYXlZOiAnYm90dG9tJ307XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvbiA9PSAnYmVsb3cnKSB7XG4gICAgICBvdmVybGF5UG9zaXRpb24gPSB7b3ZlcmxheVg6ICdjZW50ZXInLCBvdmVybGF5WTogJ3RvcCd9O1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBwb3NpdGlvbiA9PSAnYmVmb3JlJyB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiBpc0x0cikgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmICFpc0x0cikpIHtcbiAgICAgIG92ZXJsYXlQb3NpdGlvbiA9IHtvdmVybGF5WDogJ2VuZCcsIG92ZXJsYXlZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBvc2l0aW9uID09ICdhZnRlcicgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmIGlzTHRyKSB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiAhaXNMdHIpKSB7XG4gICAgICBvdmVybGF5UG9zaXRpb24gPSB7b3ZlcmxheVg6ICdzdGFydCcsIG92ZXJsYXlZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGdldE1hdFRvb2x0aXBJbnZhbGlkUG9zaXRpb25FcnJvcihwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgY29uc3Qge3gsIHl9ID0gdGhpcy5faW52ZXJ0UG9zaXRpb24ob3ZlcmxheVBvc2l0aW9uLm92ZXJsYXlYLCBvdmVybGF5UG9zaXRpb24ub3ZlcmxheVkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1haW46IG92ZXJsYXlQb3NpdGlvbixcbiAgICAgIGZhbGxiYWNrOiB7b3ZlcmxheVg6IHgsIG92ZXJsYXlZOiB5fVxuICAgIH07XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgdG9vbHRpcCBtZXNzYWdlIGFuZCByZXBvc2l0aW9ucyB0aGUgb3ZlcmxheSBhY2NvcmRpbmcgdG8gdGhlIG5ldyBtZXNzYWdlIGxlbmd0aCAqL1xuICBwcml2YXRlIF91cGRhdGVUb29sdGlwTWVzc2FnZSgpIHtcbiAgICAvLyBNdXN0IHdhaXQgZm9yIHRoZSBtZXNzYWdlIHRvIGJlIHBhaW50ZWQgdG8gdGhlIHRvb2x0aXAgc28gdGhhdCB0aGUgb3ZlcmxheSBjYW4gcHJvcGVybHlcbiAgICAvLyBjYWxjdWxhdGUgdGhlIGNvcnJlY3QgcG9zaXRpb25pbmcgYmFzZWQgb24gdGhlIHNpemUgb2YgdGhlIHRleHQuXG4gICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLm1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2U7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UuX21hcmtGb3JDaGVjaygpO1xuXG4gICAgICB0aGlzLl9uZ1pvbmUub25NaWNyb3Rhc2tFbXB0eS5hc09ic2VydmFibGUoKS5waXBlKFxuICAgICAgICB0YWtlKDEpLFxuICAgICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKVxuICAgICAgKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHRvb2x0aXAgY2xhc3MgKi9cbiAgcHJpdmF0ZSBfc2V0VG9vbHRpcENsYXNzKHRvb2x0aXBDbGFzczogc3RyaW5nfHN0cmluZ1tdfFNldDxzdHJpbmc+fHtba2V5OiBzdHJpbmddOiBhbnl9KSB7XG4gICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLnRvb2x0aXBDbGFzcyA9IHRvb2x0aXBDbGFzcztcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5fbWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEludmVydHMgYW4gb3ZlcmxheSBwb3NpdGlvbi4gKi9cbiAgcHJpdmF0ZSBfaW52ZXJ0UG9zaXRpb24oeDogSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3MsIHk6IFZlcnRpY2FsQ29ubmVjdGlvblBvcykge1xuICAgIGlmICh0aGlzLnBvc2l0aW9uID09PSAnYWJvdmUnIHx8IHRoaXMucG9zaXRpb24gPT09ICdiZWxvdycpIHtcbiAgICAgIGlmICh5ID09PSAndG9wJykge1xuICAgICAgICB5ID0gJ2JvdHRvbSc7XG4gICAgICB9IGVsc2UgaWYgKHkgPT09ICdib3R0b20nKSB7XG4gICAgICAgIHkgPSAndG9wJztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHggPT09ICdlbmQnKSB7XG4gICAgICAgIHggPSAnc3RhcnQnO1xuICAgICAgfSBlbHNlIGlmICh4ID09PSAnc3RhcnQnKSB7XG4gICAgICAgIHggPSAnZW5kJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge3gsIHl9O1xuICB9XG5cbiAgLyoqIEJpbmRzIHRoZSBwb2ludGVyIGV2ZW50cyB0byB0aGUgdG9vbHRpcCB0cmlnZ2VyLiAqL1xuICBwcml2YXRlIF9zZXR1cFBvaW50ZXJFdmVudHMoKSB7XG4gICAgLy8gVGhlIG1vdXNlIGV2ZW50cyBzaG91bGRuJ3QgYmUgYm91bmQgb24gbW9iaWxlIGRldmljZXMsIGJlY2F1c2UgdGhleSBjYW4gcHJldmVudCB0aGVcbiAgICAvLyBmaXJzdCB0YXAgZnJvbSBmaXJpbmcgaXRzIGNsaWNrIGV2ZW50IG9yIGNhbiBjYXVzZSB0aGUgdG9vbHRpcCB0byBvcGVuIGZvciBjbGlja3MuXG4gICAgaWYgKCF0aGlzLl9wbGF0Zm9ybS5JT1MgJiYgIXRoaXMuX3BsYXRmb3JtLkFORFJPSUQpIHtcbiAgICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnNcbiAgICAgICAgLnNldCgnbW91c2VlbnRlcicsICgpID0+IHRoaXMuc2hvdygpKVxuICAgICAgICAuc2V0KCdtb3VzZWxlYXZlJywgKCkgPT4gdGhpcy5oaWRlKCkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy50b3VjaEdlc3R1cmVzICE9PSAnb2ZmJykge1xuICAgICAgdGhpcy5fZGlzYWJsZU5hdGl2ZUdlc3R1cmVzSWZOZWNlc3NhcnkoKTtcbiAgICAgIGNvbnN0IHRvdWNoZW5kTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90b3VjaHN0YXJ0VGltZW91dCk7XG4gICAgICAgIHRoaXMuaGlkZSh0aGlzLl9kZWZhdWx0T3B0aW9ucy50b3VjaGVuZEhpZGVEZWxheSk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLl9wYXNzaXZlTGlzdGVuZXJzXG4gICAgICAgIC5zZXQoJ3RvdWNoZW5kJywgdG91Y2hlbmRMaXN0ZW5lcilcbiAgICAgICAgLnNldCgndG91Y2hjYW5jZWwnLCB0b3VjaGVuZExpc3RlbmVyKVxuICAgICAgICAuc2V0KCd0b3VjaHN0YXJ0JywgKCkgPT4ge1xuICAgICAgICAgIC8vIE5vdGUgdGhhdCBpdCdzIGltcG9ydGFudCB0aGF0IHdlIGRvbid0IGBwcmV2ZW50RGVmYXVsdGAgaGVyZSxcbiAgICAgICAgICAvLyBiZWNhdXNlIGl0IGNhbiBwcmV2ZW50IGNsaWNrIGV2ZW50cyBmcm9tIGZpcmluZyBvbiB0aGUgZWxlbWVudC5cbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdG91Y2hzdGFydFRpbWVvdXQpO1xuICAgICAgICAgIHRoaXMuX3RvdWNoc3RhcnRUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNob3coKSwgTE9OR1BSRVNTX0RFTEFZKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fcGFzc2l2ZUxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lciwgZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgcGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogRGlzYWJsZXMgdGhlIG5hdGl2ZSBicm93c2VyIGdlc3R1cmVzLCBiYXNlZCBvbiBob3cgdGhlIHRvb2x0aXAgaGFzIGJlZW4gY29uZmlndXJlZC4gKi9cbiAgcHJpdmF0ZSBfZGlzYWJsZU5hdGl2ZUdlc3R1cmVzSWZOZWNlc3NhcnkoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBzdHlsZSA9IGVsZW1lbnQuc3R5bGU7XG4gICAgY29uc3QgZ2VzdHVyZXMgPSB0aGlzLnRvdWNoR2VzdHVyZXM7XG5cbiAgICBpZiAoZ2VzdHVyZXMgIT09ICdvZmYnKSB7XG4gICAgICAvLyBJZiBnZXN0dXJlcyBhcmUgc2V0IHRvIGBhdXRvYCwgd2UgZG9uJ3QgZGlzYWJsZSB0ZXh0IHNlbGVjdGlvbiBvbiBpbnB1dHMgYW5kXG4gICAgICAvLyB0ZXh0YXJlYXMsIGJlY2F1c2UgaXQgcHJldmVudHMgdGhlIHVzZXIgZnJvbSB0eXBpbmcgaW50byB0aGVtIG9uIGlPUyBTYWZhcmkuXG4gICAgICBpZiAoZ2VzdHVyZXMgPT09ICdvbicgfHwgKGVsZW1lbnQubm9kZU5hbWUgIT09ICdJTlBVVCcgJiYgZWxlbWVudC5ub2RlTmFtZSAhPT0gJ1RFWFRBUkVBJykpIHtcbiAgICAgICAgc3R5bGUudXNlclNlbGVjdCA9IHN0eWxlLm1zVXNlclNlbGVjdCA9IHN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPVxuICAgICAgICAgICAgKHN0eWxlIGFzIGFueSkuTW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgaGF2ZSBgYXV0b2AgZ2VzdHVyZXMgYW5kIHRoZSBlbGVtZW50IHVzZXMgbmF0aXZlIEhUTUwgZHJhZ2dpbmcsXG4gICAgICAvLyB3ZSBkb24ndCBzZXQgYC13ZWJraXQtdXNlci1kcmFnYCBiZWNhdXNlIGl0IHByZXZlbnRzIHRoZSBuYXRpdmUgYmVoYXZpb3IuXG4gICAgICBpZiAoZ2VzdHVyZXMgPT09ICdvbicgfHwgIWVsZW1lbnQuZHJhZ2dhYmxlKSB7XG4gICAgICAgIChzdHlsZSBhcyBhbnkpLndlYmtpdFVzZXJEcmFnID0gJ25vbmUnO1xuICAgICAgfVxuXG4gICAgICBzdHlsZS50b3VjaEFjdGlvbiA9ICdub25lJztcbiAgICAgIHN0eWxlLndlYmtpdFRhcEhpZ2hsaWdodENvbG9yID0gJ3RyYW5zcGFyZW50JztcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBJbnRlcm5hbCBjb21wb25lbnQgdGhhdCB3cmFwcyB0aGUgdG9vbHRpcCdzIGNvbnRlbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC10b29sdGlwLWNvbXBvbmVudCcsXG4gIHRlbXBsYXRlVXJsOiAndG9vbHRpcC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3Rvb2x0aXAuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBhbmltYXRpb25zOiBbbWF0VG9vbHRpcEFuaW1hdGlvbnMudG9vbHRpcFN0YXRlXSxcbiAgaG9zdDoge1xuICAgIC8vIEZvcmNlcyB0aGUgZWxlbWVudCB0byBoYXZlIGEgbGF5b3V0IGluIElFIGFuZCBFZGdlLiBUaGlzIGZpeGVzIGlzc3VlcyB3aGVyZSB0aGUgZWxlbWVudFxuICAgIC8vIHdvbid0IGJlIHJlbmRlcmVkIGlmIHRoZSBhbmltYXRpb25zIGFyZSBkaXNhYmxlZCBvciB0aGVyZSBpcyBubyB3ZWIgYW5pbWF0aW9ucyBwb2x5ZmlsbC5cbiAgICAnW3N0eWxlLnpvb21dJzogJ192aXNpYmlsaXR5ID09PSBcInZpc2libGVcIiA/IDEgOiBudWxsJyxcbiAgICAnKGJvZHk6Y2xpY2spJzogJ3RoaXMuX2hhbmRsZUJvZHlJbnRlcmFjdGlvbigpJyxcbiAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgVG9vbHRpcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKiBNZXNzYWdlIHRvIGRpc3BsYXkgaW4gdGhlIHRvb2x0aXAgKi9cbiAgbWVzc2FnZTogc3RyaW5nO1xuXG4gIC8qKiBDbGFzc2VzIHRvIGJlIGFkZGVkIHRvIHRoZSB0b29sdGlwLiBTdXBwb3J0cyB0aGUgc2FtZSBzeW50YXggYXMgYG5nQ2xhc3NgLiAqL1xuICB0b29sdGlwQ2xhc3M6IHN0cmluZ3xzdHJpbmdbXXxTZXQ8c3RyaW5nPnx7W2tleTogc3RyaW5nXTogYW55fTtcblxuICAvKiogVGhlIHRpbWVvdXQgSUQgb2YgYW55IGN1cnJlbnQgdGltZXIgc2V0IHRvIHNob3cgdGhlIHRvb2x0aXAgKi9cbiAgX3Nob3dUaW1lb3V0SWQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFRoZSB0aW1lb3V0IElEIG9mIGFueSBjdXJyZW50IHRpbWVyIHNldCB0byBoaWRlIHRoZSB0b29sdGlwICovXG4gIF9oaWRlVGltZW91dElkOiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBQcm9wZXJ0eSB3YXRjaGVkIGJ5IHRoZSBhbmltYXRpb24gZnJhbWV3b3JrIHRvIHNob3cgb3IgaGlkZSB0aGUgdG9vbHRpcCAqL1xuICBfdmlzaWJpbGl0eTogVG9vbHRpcFZpc2liaWxpdHkgPSAnaW5pdGlhbCc7XG5cbiAgLyoqIFdoZXRoZXIgaW50ZXJhY3Rpb25zIG9uIHRoZSBwYWdlIHNob3VsZCBjbG9zZSB0aGUgdG9vbHRpcCAqL1xuICBwcml2YXRlIF9jbG9zZU9uSW50ZXJhY3Rpb246IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoYXQgdGhlIHRvb2x0aXAgaGFzIGJlZW4gaGlkZGVuIGZyb20gdGhlIHZpZXcgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfb25IaWRlOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGV0aGVyIHRoZSB1c2VyIGhhcyBhIGhhbmRzZXQtc2l6ZWQgZGlzcGxheS4gICovXG4gIF9pc0hhbmRzZXQ6IE9ic2VydmFibGU8QnJlYWtwb2ludFN0YXRlPiA9IHRoaXMuX2JyZWFrcG9pbnRPYnNlcnZlci5vYnNlcnZlKEJyZWFrcG9pbnRzLkhhbmRzZXQpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9icmVha3BvaW50T2JzZXJ2ZXI6IEJyZWFrcG9pbnRPYnNlcnZlcikge31cblxuICAvKipcbiAgICogU2hvd3MgdGhlIHRvb2x0aXAgd2l0aCBhbiBhbmltYXRpb24gb3JpZ2luYXRpbmcgZnJvbSB0aGUgcHJvdmlkZWQgb3JpZ2luXG4gICAqIEBwYXJhbSBkZWxheSBBbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIHRoZSBkZWxheSBzaG93aW5nIHRoZSB0b29sdGlwLlxuICAgKi9cbiAgc2hvdyhkZWxheTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gQ2FuY2VsIHRoZSBkZWxheWVkIGhpZGUgaWYgaXQgaXMgc2NoZWR1bGVkXG4gICAgaWYgKHRoaXMuX2hpZGVUaW1lb3V0SWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9oaWRlVGltZW91dElkKTtcbiAgICAgIHRoaXMuX2hpZGVUaW1lb3V0SWQgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIEJvZHkgaW50ZXJhY3Rpb25zIHNob3VsZCBjYW5jZWwgdGhlIHRvb2x0aXAgaWYgdGhlcmUgaXMgYSBkZWxheSBpbiBzaG93aW5nLlxuICAgIHRoaXMuX2Nsb3NlT25JbnRlcmFjdGlvbiA9IHRydWU7XG4gICAgdGhpcy5fc2hvd1RpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fdmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgIHRoaXMuX3Nob3dUaW1lb3V0SWQgPSBudWxsO1xuXG4gICAgICAvLyBNYXJrIGZvciBjaGVjayBzbyBpZiBhbnkgcGFyZW50IGNvbXBvbmVudCBoYXMgc2V0IHRoZVxuICAgICAgLy8gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgdG8gT25QdXNoIGl0IHdpbGwgYmUgY2hlY2tlZCBhbnl3YXlzXG4gICAgICB0aGlzLl9tYXJrRm9yQ2hlY2soKTtcbiAgICB9LCBkZWxheSk7XG4gIH1cblxuICAvKipcbiAgICogQmVnaW5zIHRoZSBhbmltYXRpb24gdG8gaGlkZSB0aGUgdG9vbHRpcCBhZnRlciB0aGUgcHJvdmlkZWQgZGVsYXkgaW4gbXMuXG4gICAqIEBwYXJhbSBkZWxheSBBbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5IHNob3dpbmcgdGhlIHRvb2x0aXAuXG4gICAqL1xuICBoaWRlKGRlbGF5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBDYW5jZWwgdGhlIGRlbGF5ZWQgc2hvdyBpZiBpdCBpcyBzY2hlZHVsZWRcbiAgICBpZiAodGhpcy5fc2hvd1RpbWVvdXRJZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3Nob3dUaW1lb3V0SWQpO1xuICAgICAgdGhpcy5fc2hvd1RpbWVvdXRJZCA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5faGlkZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fdmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgdGhpcy5faGlkZVRpbWVvdXRJZCA9IG51bGw7XG5cbiAgICAgIC8vIE1hcmsgZm9yIGNoZWNrIHNvIGlmIGFueSBwYXJlbnQgY29tcG9uZW50IGhhcyBzZXQgdGhlXG4gICAgICAvLyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB0byBPblB1c2ggaXQgd2lsbCBiZSBjaGVja2VkIGFueXdheXNcbiAgICAgIHRoaXMuX21hcmtGb3JDaGVjaygpO1xuICAgIH0sIGRlbGF5KTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIGFuIG9ic2VydmFibGUgdGhhdCBub3RpZmllcyB3aGVuIHRoZSB0b29sdGlwIGhhcyBiZWVuIGhpZGRlbiBmcm9tIHZpZXcuICovXG4gIGFmdGVySGlkZGVuKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9vbkhpZGUuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdG9vbHRpcCBpcyBiZWluZyBkaXNwbGF5ZWQuICovXG4gIGlzVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJpbGl0eSA9PT0gJ3Zpc2libGUnO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fb25IaWRlLmNvbXBsZXRlKCk7XG4gIH1cblxuICBfYW5pbWF0aW9uU3RhcnQoKSB7XG4gICAgdGhpcy5fY2xvc2VPbkludGVyYWN0aW9uID0gZmFsc2U7XG4gIH1cblxuICBfYW5pbWF0aW9uRG9uZShldmVudDogQW5pbWF0aW9uRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCB0b1N0YXRlID0gZXZlbnQudG9TdGF0ZSBhcyBUb29sdGlwVmlzaWJpbGl0eTtcblxuICAgIGlmICh0b1N0YXRlID09PSAnaGlkZGVuJyAmJiAhdGhpcy5pc1Zpc2libGUoKSkge1xuICAgICAgdGhpcy5fb25IaWRlLm5leHQoKTtcbiAgICB9XG5cbiAgICBpZiAodG9TdGF0ZSA9PT0gJ3Zpc2libGUnIHx8IHRvU3RhdGUgPT09ICdoaWRkZW4nKSB7XG4gICAgICB0aGlzLl9jbG9zZU9uSW50ZXJhY3Rpb24gPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmFjdGlvbnMgb24gdGhlIEhUTUwgYm9keSBzaG91bGQgY2xvc2UgdGhlIHRvb2x0aXAgaW1tZWRpYXRlbHkgYXMgZGVmaW5lZCBpbiB0aGVcbiAgICogbWF0ZXJpYWwgZGVzaWduIHNwZWMuXG4gICAqIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbXBvbmVudHMvdG9vbHRpcHMuaHRtbCNiZWhhdmlvclxuICAgKi9cbiAgX2hhbmRsZUJvZHlJbnRlcmFjdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fY2xvc2VPbkludGVyYWN0aW9uKSB7XG4gICAgICB0aGlzLmhpZGUoMCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoYXQgdGhlIHRvb2x0aXAgbmVlZHMgdG8gYmUgY2hlY2tlZCBpbiB0aGUgbmV4dCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bi5cbiAgICogTWFpbmx5IHVzZWQgZm9yIHJlbmRlcmluZyB0aGUgaW5pdGlhbCB0ZXh0IGJlZm9yZSBwb3NpdGlvbmluZyBhIHRvb2x0aXAsIHdoaWNoXG4gICAqIGNhbiBiZSBwcm9ibGVtYXRpYyBpbiBjb21wb25lbnRzIHdpdGggT25QdXNoIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAqL1xuICBfbWFya0ZvckNoZWNrKCk6IHZvaWQge1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG59XG4iXX0=