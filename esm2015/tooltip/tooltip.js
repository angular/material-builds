/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
        /**
         * Handles the keydown events on the host element.
         * Needs to be an arrow function so that we can use it in addEventListener.
         */
        this._handleKeydown = (/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            if (this._isTooltipVisible() && event.keyCode === ESCAPE && !hasModifierKey(event)) {
                event.preventDefault();
                event.stopPropagation();
                this._ngZone.run((/**
                 * @return {?}
                 */
                () => this.hide(0)));
            }
        });
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
        _ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            _elementRef.nativeElement.addEventListener('keydown', this._handleKeydown);
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
        /** @type {?} */
        const nativeElement = this._elementRef.nativeElement;
        clearTimeout(this._touchstartTimeout);
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._tooltipInstance = null;
        }
        // Clean up the event listeners set in the constructor
        nativeElement.removeEventListener('keydown', this._handleKeydown);
        this._passiveListeners.forEach((/**
         * @param {?} listener
         * @param {?} event
         * @return {?}
         */
        (listener, event) => {
            nativeElement.removeEventListener(event, listener, passiveListenerOptions);
        }));
        this._passiveListeners.clear();
        this._destroyed.next();
        this._destroyed.complete();
        this._ariaDescriber.removeDescription(nativeElement, this.message);
        this._focusMonitor.stopMonitoring(nativeElement);
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
            Object.assign(Object.assign({}, origin.main), overlay.main),
            Object.assign(Object.assign({}, origin.fallback), overlay.fallback)
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
     * Handles the keydown events on the host element.
     * Needs to be an arrow function so that we can use it in addEventListener.
     * @type {?}
     * @private
     */
    MatTooltip.prototype._handleKeydown;
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
                styles: [".mat-tooltip-panel{pointer-events:none !important}.mat-tooltip{color:#fff;border-radius:4px;margin:14px;max-width:250px;padding-left:8px;padding-right:8px;overflow:hidden;text-overflow:ellipsis}@media(-ms-high-contrast: active){.mat-tooltip{outline:solid 1px}}.mat-tooltip-handset{margin:24px;padding-left:16px;padding-right:16px}\n"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90b29sdGlwL3Rvb2x0aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQVFBLE9BQU8sRUFBQyxhQUFhLEVBQUUsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDOUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFDLGtCQUFrQixFQUFFLFdBQVcsRUFBa0IsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRixPQUFPLEVBSUwsT0FBTyxHQUtSLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLFFBQVEsRUFBRSwrQkFBK0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUNSLGdCQUFnQixFQUNoQixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFhLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6QyxPQUFPLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRS9DLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7OztBQWdCMUQsTUFBTSxPQUFPLGtC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Q0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN6QyxDQUFDOzs7WUF6SUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDbkIsUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsd1JBQTJCO2dCQUUzQixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFVBQVUsRUFBRSxDQUFDLG9CQUFvQixDQUFDLFlBQVksQ0FBQztnQkFDL0MsSUFBSSxFQUFFOzs7b0JBR0osY0FBYyxFQUFFLHNDQUFzQztvQkFDdEQsY0FBYyxFQUFFLCtCQUErQjtvQkFDL0MsYUFBYSxFQUFFLE1BQU07aUJBQ3RCOzthQUNGOzs7O1lBdGxCQyxpQkFBaUI7WUFoQlgsa0JBQWtCOzs7Ozs7O0lBeW1CeEIsbUNBQWdCOzs7OztJQUdoQix3Q0FBK0Q7Ozs7O0lBRy9ELDBDQUE4Qjs7Ozs7SUFHOUIsMENBQThCOzs7OztJQUc5Qix1Q0FBMkM7Ozs7OztJQUczQywrQ0FBNkM7Ozs7OztJQUc3QyxtQ0FBdUQ7Ozs7O0lBR3ZELHNDQUFnRzs7Ozs7SUFHOUYsOENBQTZDOzs7OztJQUM3QywrQ0FBK0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtBcmlhRGVzY3JpYmVyLCBGb2N1c01vbml0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFU0NBUEUsIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtCcmVha3BvaW50T2JzZXJ2ZXIsIEJyZWFrcG9pbnRzLCBCcmVha3BvaW50U3RhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9sYXlvdXQnO1xuaW1wb3J0IHtcbiAgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5LFxuICBIb3Jpem9udGFsQ29ubmVjdGlvblBvcyxcbiAgT3JpZ2luQ29ubmVjdGlvblBvc2l0aW9uLFxuICBPdmVybGF5LFxuICBPdmVybGF5Q29ubmVjdGlvblBvc2l0aW9uLFxuICBPdmVybGF5UmVmLFxuICBTY3JvbGxTdHJhdGVneSxcbiAgVmVydGljYWxDb25uZWN0aW9uUG9zLFxufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge1BsYXRmb3JtLCBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtDb21wb25lbnRQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtTY3JvbGxEaXNwYXRjaGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7bWF0VG9vbHRpcEFuaW1hdGlvbnN9IGZyb20gJy4vdG9vbHRpcC1hbmltYXRpb25zJztcblxuXG4vKiogUG9zc2libGUgcG9zaXRpb25zIGZvciBhIHRvb2x0aXAuICovXG5leHBvcnQgdHlwZSBUb29sdGlwUG9zaXRpb24gPSAnbGVmdCcgfCAncmlnaHQnIHwgJ2Fib3ZlJyB8ICdiZWxvdycgfCAnYmVmb3JlJyB8ICdhZnRlcic7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgaG93IHRoZSB0b29sdGlwIHRyaWdnZXIgc2hvdWxkIGhhbmRsZSB0b3VjaCBnZXN0dXJlcy5cbiAqIFNlZSBgTWF0VG9vbHRpcC50b3VjaEdlc3R1cmVzYCBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqL1xuZXhwb3J0IHR5cGUgVG9vbHRpcFRvdWNoR2VzdHVyZXMgPSAnYXV0bycgfCAnb24nIHwgJ29mZic7XG5cbi8qKiBQb3NzaWJsZSB2aXNpYmlsaXR5IHN0YXRlcyBvZiBhIHRvb2x0aXAuICovXG5leHBvcnQgdHlwZSBUb29sdGlwVmlzaWJpbGl0eSA9ICdpbml0aWFsJyB8ICd2aXNpYmxlJyB8ICdoaWRkZW4nO1xuXG4vKiogVGltZSBpbiBtcyB0byB0aHJvdHRsZSByZXBvc2l0aW9uaW5nIGFmdGVyIHNjcm9sbCBldmVudHMuICovXG5leHBvcnQgY29uc3QgU0NST0xMX1RIUk9UVExFX01TID0gMjA7XG5cbi8qKiBDU1MgY2xhc3MgdGhhdCB3aWxsIGJlIGF0dGFjaGVkIHRvIHRoZSBvdmVybGF5IHBhbmVsLiAqL1xuZXhwb3J0IGNvbnN0IFRPT0xUSVBfUEFORUxfQ0xBU1MgPSAnbWF0LXRvb2x0aXAtcGFuZWwnO1xuXG4vKiogT3B0aW9ucyB1c2VkIHRvIGJpbmQgcGFzc2l2ZSBldmVudCBsaXN0ZW5lcnMuICovXG5jb25zdCBwYXNzaXZlTGlzdGVuZXJPcHRpb25zID0gbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyh7cGFzc2l2ZTogdHJ1ZX0pO1xuXG4vKipcbiAqIFRpbWUgYmV0d2VlbiB0aGUgdXNlciBwdXR0aW5nIHRoZSBwb2ludGVyIG9uIGEgdG9vbHRpcFxuICogdHJpZ2dlciBhbmQgdGhlIGxvbmcgcHJlc3MgZXZlbnQgYmVpbmcgZmlyZWQuXG4gKi9cbmNvbnN0IExPTkdQUkVTU19ERUxBWSA9IDUwMDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGVycm9yIHRvIGJlIHRocm93biBpZiB0aGUgdXNlciBzdXBwbGllZCBhbiBpbnZhbGlkIHRvb2x0aXAgcG9zaXRpb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRUb29sdGlwSW52YWxpZFBvc2l0aW9uRXJyb3IocG9zaXRpb246IHN0cmluZykge1xuICByZXR1cm4gRXJyb3IoYFRvb2x0aXAgcG9zaXRpb24gXCIke3Bvc2l0aW9ufVwiIGlzIGludmFsaWQuYCk7XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgYSB0b29sdGlwIGlzIHZpc2libGUuICovXG5leHBvcnQgY29uc3QgTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KCdtYXQtdG9vbHRpcC1zY3JvbGwtc3RyYXRlZ3knKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oe3Njcm9sbFRocm90dGxlOiBTQ1JPTExfVEhST1RUTEVfTVN9KTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZLFxufTtcblxuLyoqIERlZmF1bHQgYG1hdFRvb2x0aXBgIG9wdGlvbnMgdGhhdCBjYW4gYmUgb3ZlcnJpZGRlbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0VG9vbHRpcERlZmF1bHRPcHRpb25zIHtcbiAgc2hvd0RlbGF5OiBudW1iZXI7XG4gIGhpZGVEZWxheTogbnVtYmVyO1xuICB0b3VjaGVuZEhpZGVEZWxheTogbnVtYmVyO1xuICB0b3VjaEdlc3R1cmVzPzogVG9vbHRpcFRvdWNoR2VzdHVyZXM7XG4gIHBvc2l0aW9uPzogVG9vbHRpcFBvc2l0aW9uO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdFRvb2x0aXBgLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9UT09MVElQX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdFRvb2x0aXBEZWZhdWx0T3B0aW9ucz4oJ21hdC10b29sdGlwLWRlZmF1bHQtb3B0aW9ucycsIHtcbiAgICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICAgIGZhY3Rvcnk6IE1BVF9UT09MVElQX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZXG4gICAgfSk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1RPT0xUSVBfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0VG9vbHRpcERlZmF1bHRPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICBzaG93RGVsYXk6IDAsXG4gICAgaGlkZURlbGF5OiAwLFxuICAgIHRvdWNoZW5kSGlkZURlbGF5OiAxNTAwLFxuICB9O1xufVxuXG4vKipcbiAqIERpcmVjdGl2ZSB0aGF0IGF0dGFjaGVzIGEgbWF0ZXJpYWwgZGVzaWduIHRvb2x0aXAgdG8gdGhlIGhvc3QgZWxlbWVudC4gQW5pbWF0ZXMgdGhlIHNob3dpbmcgYW5kXG4gKiBoaWRpbmcgb2YgYSB0b29sdGlwIHByb3ZpZGVkIHBvc2l0aW9uIChkZWZhdWx0cyB0byBiZWxvdyB0aGUgZWxlbWVudCkuXG4gKlxuICogaHR0cHM6Ly9tYXRlcmlhbC5pby9kZXNpZ24vY29tcG9uZW50cy90b29sdGlwcy5odG1sXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUb29sdGlwXScsXG4gIGV4cG9ydEFzOiAnbWF0VG9vbHRpcCcsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRvb2x0aXAgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmIHwgbnVsbDtcbiAgX3Rvb2x0aXBJbnN0YW5jZTogVG9vbHRpcENvbXBvbmVudCB8IG51bGw7XG5cbiAgcHJpdmF0ZSBfcG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VG9vbHRpcENvbXBvbmVudD47XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiBUb29sdGlwUG9zaXRpb24gPSAnYmVsb3cnO1xuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIF90b29sdGlwQ2xhc3M6IHN0cmluZ3xzdHJpbmdbXXxTZXQ8c3RyaW5nPnx7W2tleTogc3RyaW5nXTogYW55fTtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIC8qKiBBbGxvd3MgdGhlIHVzZXIgdG8gZGVmaW5lIHRoZSBwb3NpdGlvbiBvZiB0aGUgdG9vbHRpcCByZWxhdGl2ZSB0byB0aGUgcGFyZW50IGVsZW1lbnQgKi9cbiAgQElucHV0KCdtYXRUb29sdGlwUG9zaXRpb24nKVxuICBnZXQgcG9zaXRpb24oKTogVG9vbHRpcFBvc2l0aW9uIHsgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uOyB9XG4gIHNldCBwb3NpdGlvbih2YWx1ZTogVG9vbHRpcFBvc2l0aW9uKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9wb3NpdGlvbikge1xuICAgICAgdGhpcy5fcG9zaXRpb24gPSB2YWx1ZTtcblxuICAgICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcblxuICAgICAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlIS5zaG93KDApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fb3ZlcmxheVJlZi51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBEaXNhYmxlcyB0aGUgZGlzcGxheSBvZiB0aGUgdG9vbHRpcC4gKi9cbiAgQElucHV0KCdtYXRUb29sdGlwRGlzYWJsZWQnKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlZDsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWUpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICAvLyBJZiB0b29sdGlwIGlzIGRpc2FibGVkLCBoaWRlIGltbWVkaWF0ZWx5LlxuICAgIGlmICh0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgdGhpcy5oaWRlKDApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgZGVmYXVsdCBkZWxheSBpbiBtcyBiZWZvcmUgc2hvd2luZyB0aGUgdG9vbHRpcCBhZnRlciBzaG93IGlzIGNhbGxlZCAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBTaG93RGVsYXknKSBzaG93RGVsYXk6IG51bWJlciA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLnNob3dEZWxheTtcblxuICAvKiogVGhlIGRlZmF1bHQgZGVsYXkgaW4gbXMgYmVmb3JlIGhpZGluZyB0aGUgdG9vbHRpcCBhZnRlciBoaWRlIGlzIGNhbGxlZCAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBIaWRlRGVsYXknKSBoaWRlRGVsYXk6IG51bWJlciA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmhpZGVEZWxheTtcblxuICAvKipcbiAgICogSG93IHRvdWNoIGdlc3R1cmVzIHNob3VsZCBiZSBoYW5kbGVkIGJ5IHRoZSB0b29sdGlwLiBPbiB0b3VjaCBkZXZpY2VzIHRoZSB0b29sdGlwIGRpcmVjdGl2ZVxuICAgKiB1c2VzIGEgbG9uZyBwcmVzcyBnZXN0dXJlIHRvIHNob3cgYW5kIGhpZGUsIGhvd2V2ZXIgaXQgY2FuIGNvbmZsaWN0IHdpdGggdGhlIG5hdGl2ZSBicm93c2VyXG4gICAqIGdlc3R1cmVzLiBUbyB3b3JrIGFyb3VuZCB0aGUgY29uZmxpY3QsIEFuZ3VsYXIgTWF0ZXJpYWwgZGlzYWJsZXMgbmF0aXZlIGdlc3R1cmVzIG9uIHRoZVxuICAgKiB0cmlnZ2VyLCBidXQgdGhhdCBtaWdodCBub3QgYmUgZGVzaXJhYmxlIG9uIHBhcnRpY3VsYXIgZWxlbWVudHMgKGUuZy4gaW5wdXRzIGFuZCBkcmFnZ2FibGVcbiAgICogZWxlbWVudHMpLiBUaGUgZGlmZmVyZW50IHZhbHVlcyBmb3IgdGhpcyBvcHRpb24gY29uZmlndXJlIHRoZSB0b3VjaCBldmVudCBoYW5kbGluZyBhcyBmb2xsb3dzOlxuICAgKiAtIGBhdXRvYCAtIEVuYWJsZXMgdG91Y2ggZ2VzdHVyZXMgZm9yIGFsbCBlbGVtZW50cywgYnV0IHRyaWVzIHRvIGF2b2lkIGNvbmZsaWN0cyB3aXRoIG5hdGl2ZVxuICAgKiAgIGJyb3dzZXIgZ2VzdHVyZXMgb24gcGFydGljdWxhciBlbGVtZW50cy4gSW4gcGFydGljdWxhciwgaXQgYWxsb3dzIHRleHQgc2VsZWN0aW9uIG9uIGlucHV0c1xuICAgKiAgIGFuZCB0ZXh0YXJlYXMsIGFuZCBwcmVzZXJ2ZXMgdGhlIG5hdGl2ZSBicm93c2VyIGRyYWdnaW5nIG9uIGVsZW1lbnRzIG1hcmtlZCBhcyBgZHJhZ2dhYmxlYC5cbiAgICogLSBgb25gIC0gRW5hYmxlcyB0b3VjaCBnZXN0dXJlcyBmb3IgYWxsIGVsZW1lbnRzIGFuZCBkaXNhYmxlcyBuYXRpdmVcbiAgICogICBicm93c2VyIGdlc3R1cmVzIHdpdGggbm8gZXhjZXB0aW9ucy5cbiAgICogLSBgb2ZmYCAtIERpc2FibGVzIHRvdWNoIGdlc3R1cmVzLiBOb3RlIHRoYXQgdGhpcyB3aWxsIHByZXZlbnQgdGhlIHRvb2x0aXAgZnJvbVxuICAgKiAgIHNob3dpbmcgb24gdG91Y2ggZGV2aWNlcy5cbiAgICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcFRvdWNoR2VzdHVyZXMnKSB0b3VjaEdlc3R1cmVzOiBUb29sdGlwVG91Y2hHZXN0dXJlcyA9ICdhdXRvJztcblxuICAvKiogVGhlIG1lc3NhZ2UgdG8gYmUgZGlzcGxheWVkIGluIHRoZSB0b29sdGlwICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcCcpXG4gIGdldCBtZXNzYWdlKCkgeyByZXR1cm4gdGhpcy5fbWVzc2FnZTsgfVxuICBzZXQgbWVzc2FnZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbih0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuX21lc3NhZ2UpO1xuXG4gICAgLy8gSWYgdGhlIG1lc3NhZ2UgaXMgbm90IGEgc3RyaW5nIChlLmcuIG51bWJlciksIGNvbnZlcnQgaXQgdG8gYSBzdHJpbmcgYW5kIHRyaW0gaXQuXG4gICAgdGhpcy5fbWVzc2FnZSA9IHZhbHVlICE9IG51bGwgPyBgJHt2YWx1ZX1gLnRyaW0oKSA6ICcnO1xuXG4gICAgaWYgKCF0aGlzLl9tZXNzYWdlICYmIHRoaXMuX2lzVG9vbHRpcFZpc2libGUoKSkge1xuICAgICAgdGhpcy5oaWRlKDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl91cGRhdGVUb29sdGlwTWVzc2FnZSgpO1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgLy8gVGhlIGBBcmlhRGVzY3JpYmVyYCBoYXMgc29tZSBmdW5jdGlvbmFsaXR5IHRoYXQgYXZvaWRzIGFkZGluZyBhIGRlc2NyaXB0aW9uIGlmIGl0J3MgdGhlXG4gICAgICAgIC8vIHNhbWUgYXMgdGhlIGBhcmlhLWxhYmVsYCBvZiBhbiBlbGVtZW50LCBob3dldmVyIHdlIGNhbid0IGtub3cgd2hldGhlciB0aGUgdG9vbHRpcCB0cmlnZ2VyXG4gICAgICAgIC8vIGhhcyBhIGRhdGEtYm91bmQgYGFyaWEtbGFiZWxgIG9yIHdoZW4gaXQnbGwgYmUgc2V0IGZvciB0aGUgZmlyc3QgdGltZS4gV2UgY2FuIGF2b2lkIHRoZVxuICAgICAgICAvLyBpc3N1ZSBieSBkZWZlcnJpbmcgdGhlIGRlc2NyaXB0aW9uIGJ5IGEgdGljayBzbyBBbmd1bGFyIGhhcyB0aW1lIHRvIHNldCB0aGUgYGFyaWEtbGFiZWxgLlxuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLmRlc2NyaWJlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5tZXNzYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfbWVzc2FnZSA9ICcnO1xuXG4gIC8qKiBDbGFzc2VzIHRvIGJlIHBhc3NlZCB0byB0aGUgdG9vbHRpcC4gU3VwcG9ydHMgdGhlIHNhbWUgc3ludGF4IGFzIGBuZ0NsYXNzYC4gKi9cbiAgQElucHV0KCdtYXRUb29sdGlwQ2xhc3MnKVxuICBnZXQgdG9vbHRpcENsYXNzKCkgeyByZXR1cm4gdGhpcy5fdG9vbHRpcENsYXNzOyB9XG4gIHNldCB0b29sdGlwQ2xhc3ModmFsdWU6IHN0cmluZ3xzdHJpbmdbXXxTZXQ8c3RyaW5nPnx7W2tleTogc3RyaW5nXTogYW55fSkge1xuICAgIHRoaXMuX3Rvb2x0aXBDbGFzcyA9IHZhbHVlO1xuICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX3NldFRvb2x0aXBDbGFzcyh0aGlzLl90b29sdGlwQ2xhc3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBNYW51YWxseS1ib3VuZCBwYXNzaXZlIGV2ZW50IGxpc3RlbmVycy4gKi9cbiAgcHJpdmF0ZSBfcGFzc2l2ZUxpc3RlbmVycyA9IG5ldyBNYXA8c3RyaW5nLCBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0PigpO1xuXG4gIC8qKiBUaW1lciBzdGFydGVkIGF0IHRoZSBsYXN0IGB0b3VjaHN0YXJ0YCBldmVudC4gKi9cbiAgcHJpdmF0ZSBfdG91Y2hzdGFydFRpbWVvdXQ6IG51bWJlcjtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX3Njcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgcHJpdmF0ZSBfYXJpYURlc2NyaWJlcjogQXJpYURlc2NyaWJlcixcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBASW5qZWN0KE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1RPT0xUSVBfREVGQVVMVF9PUFRJT05TKVxuICAgICAgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM6IE1hdFRvb2x0aXBEZWZhdWx0T3B0aW9ucyxcbiAgICAgIC8qKlxuICAgICAgICogQGRlcHJlY2F0ZWQgX2hhbW1lckxvYWRlciBwYXJhbWV0ZXIgdG8gYmUgcmVtb3ZlZC5cbiAgICAgICAqIEBicmVha2luZy1jaGFuZ2UgOS4wLjBcbiAgICAgICAqL1xuICAgICAgLy8gTm90ZSB0aGF0IHdlIG5lZWQgdG8gZ2l2ZSBBbmd1bGFyIHNvbWV0aGluZyB0byBpbmplY3QgaGVyZSBzbyBpdCBkb2Vzbid0IHRocm93LlxuICAgICAgQEluamVjdChFbGVtZW50UmVmKSBfaGFtbWVyTG9hZGVyPzogYW55KSB7XG5cbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneSA9IHNjcm9sbFN0cmF0ZWd5O1xuXG4gICAgaWYgKF9kZWZhdWx0T3B0aW9ucykge1xuICAgICAgaWYgKF9kZWZhdWx0T3B0aW9ucy5wb3NpdGlvbikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gX2RlZmF1bHRPcHRpb25zLnBvc2l0aW9uO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2RlZmF1bHRPcHRpb25zLnRvdWNoR2VzdHVyZXMpIHtcbiAgICAgICAgdGhpcy50b3VjaEdlc3R1cmVzID0gX2RlZmF1bHRPcHRpb25zLnRvdWNoR2VzdHVyZXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2ZvY3VzTW9uaXRvci5tb25pdG9yKF9lbGVtZW50UmVmKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKG9yaWdpbiA9PiB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCB0aGUgZm9jdXMgbW9uaXRvciBydW5zIG91dHNpZGUgdGhlIEFuZ3VsYXIgem9uZS5cbiAgICAgICAgaWYgKCFvcmlnaW4pIHtcbiAgICAgICAgICBfbmdab25lLnJ1bigoKSA9PiB0aGlzLmhpZGUoMCkpO1xuICAgICAgICB9IGVsc2UgaWYgKG9yaWdpbiA9PT0gJ2tleWJvYXJkJykge1xuICAgICAgICAgIF9uZ1pvbmUucnVuKCgpID0+IHRoaXMuc2hvdygpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9oYW5kbGVLZXlkb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR1cCBzdHlsaW5nLXNwZWNpZmljIHRoaW5nc1xuICAgKi9cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gVGhpcyBuZWVkcyB0byBoYXBwZW4gaW4gYG5nT25Jbml0YCBzbyB0aGUgaW5pdGlhbCB2YWx1ZXMgZm9yIGFsbCBpbnB1dHMgaGF2ZSBiZWVuIHNldC5cbiAgICB0aGlzLl9zZXR1cFBvaW50ZXJFdmVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwb3NlIHRoZSB0b29sdGlwIHdoZW4gZGVzdHJveWVkLlxuICAgKi9cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGNsZWFyVGltZW91dCh0aGlzLl90b3VjaHN0YXJ0VGltZW91dCk7XG5cbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIENsZWFuIHVwIHRoZSBldmVudCBsaXN0ZW5lcnMgc2V0IGluIHRoZSBjb25zdHJ1Y3RvclxuICAgIG5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2hhbmRsZUtleWRvd24pO1xuICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIsIGV2ZW50KSA9PiB7XG4gICAgICBuYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBwYXNzaXZlTGlzdGVuZXJPcHRpb25zKTtcbiAgICB9KTtcbiAgICB0aGlzLl9wYXNzaXZlTGlzdGVuZXJzLmNsZWFyKCk7XG5cbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuXG4gICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbihuYXRpdmVFbGVtZW50LCB0aGlzLm1lc3NhZ2UpO1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyhuYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBTaG93cyB0aGUgdG9vbHRpcCBhZnRlciB0aGUgZGVsYXkgaW4gbXMsIGRlZmF1bHRzIHRvIHRvb2x0aXAtZGVsYXktc2hvdyBvciAwbXMgaWYgbm8gaW5wdXQgKi9cbiAgc2hvdyhkZWxheTogbnVtYmVyID0gdGhpcy5zaG93RGVsYXkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5tZXNzYWdlIHx8ICh0aGlzLl9pc1Rvb2x0aXBWaXNpYmxlKCkgJiZcbiAgICAgICF0aGlzLl90b29sdGlwSW5zdGFuY2UhLl9zaG93VGltZW91dElkICYmICF0aGlzLl90b29sdGlwSW5zdGFuY2UhLl9oaWRlVGltZW91dElkKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXkoKTtcblxuICAgIHRoaXMuX2RldGFjaCgpO1xuICAgIHRoaXMuX3BvcnRhbCA9IHRoaXMuX3BvcnRhbCB8fCBuZXcgQ29tcG9uZW50UG9ydGFsKFRvb2x0aXBDb21wb25lbnQsIHRoaXMuX3ZpZXdDb250YWluZXJSZWYpO1xuICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSA9IG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX3BvcnRhbCkuaW5zdGFuY2U7XG4gICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLmFmdGVySGlkZGVuKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9kZXRhY2goKSk7XG4gICAgdGhpcy5fc2V0VG9vbHRpcENsYXNzKHRoaXMuX3Rvb2x0aXBDbGFzcyk7XG4gICAgdGhpcy5fdXBkYXRlVG9vbHRpcE1lc3NhZ2UoKTtcbiAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UhLnNob3coZGVsYXkpO1xuICB9XG5cbiAgLyoqIEhpZGVzIHRoZSB0b29sdGlwIGFmdGVyIHRoZSBkZWxheSBpbiBtcywgZGVmYXVsdHMgdG8gdG9vbHRpcC1kZWxheS1oaWRlIG9yIDBtcyBpZiBubyBpbnB1dCAqL1xuICBoaWRlKGRlbGF5OiBudW1iZXIgPSB0aGlzLmhpZGVEZWxheSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5oaWRlKGRlbGF5KTtcbiAgICB9XG4gIH1cblxuICAvKiogU2hvd3MvaGlkZXMgdGhlIHRvb2x0aXAgKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIHRoaXMuX2lzVG9vbHRpcFZpc2libGUoKSA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KCk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSB0b29sdGlwIGlzIGN1cnJlbnRseSB2aXNpYmxlIHRvIHRoZSB1c2VyICovXG4gIF9pc1Rvb2x0aXBWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuX3Rvb2x0aXBJbnN0YW5jZSAmJiB0aGlzLl90b29sdGlwSW5zdGFuY2UuaXNWaXNpYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUga2V5ZG93biBldmVudHMgb24gdGhlIGhvc3QgZWxlbWVudC5cbiAgICogTmVlZHMgdG8gYmUgYW4gYXJyb3cgZnVuY3Rpb24gc28gdGhhdCB3ZSBjYW4gdXNlIGl0IGluIGFkZEV2ZW50TGlzdGVuZXIuXG4gICAqL1xuICBwcml2YXRlIF9oYW5kbGVLZXlkb3duID0gKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuX2lzVG9vbHRpcFZpc2libGUoKSAmJiBldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLmhpZGUoMCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDcmVhdGUgdGhlIG92ZXJsYXkgY29uZmlnIGFuZCBwb3NpdGlvbiBzdHJhdGVneSAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KCk6IE92ZXJsYXlSZWYge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVJlZjtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JvbGxhYmxlQW5jZXN0b3JzID1cbiAgICAgICAgdGhpcy5fc2Nyb2xsRGlzcGF0Y2hlci5nZXRBbmNlc3RvclNjcm9sbENvbnRhaW5lcnModGhpcy5fZWxlbWVudFJlZik7XG5cbiAgICAvLyBDcmVhdGUgY29ubmVjdGVkIHBvc2l0aW9uIHN0cmF0ZWd5IHRoYXQgbGlzdGVucyBmb3Igc2Nyb2xsIGV2ZW50cyB0byByZXBvc2l0aW9uLlxuICAgIGNvbnN0IHN0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5fZWxlbWVudFJlZilcbiAgICAgICAgICAgICAgICAgICAgICAgICAud2l0aFRyYW5zZm9ybU9yaWdpbk9uKCcubWF0LXRvb2x0aXAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgIC53aXRoRmxleGlibGVEaW1lbnNpb25zKGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgIC53aXRoVmlld3BvcnRNYXJnaW4oOClcbiAgICAgICAgICAgICAgICAgICAgICAgICAud2l0aFNjcm9sbGFibGVDb250YWluZXJzKHNjcm9sbGFibGVBbmNlc3RvcnMpO1xuXG4gICAgc3RyYXRlZ3kucG9zaXRpb25DaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShjaGFuZ2UgPT4ge1xuICAgICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgICBpZiAoY2hhbmdlLnNjcm9sbGFibGVWaWV3UHJvcGVydGllcy5pc092ZXJsYXlDbGlwcGVkICYmIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5pc1Zpc2libGUoKSkge1xuICAgICAgICAgIC8vIEFmdGVyIHBvc2l0aW9uIGNoYW5nZXMgb2NjdXIgYW5kIHRoZSBvdmVybGF5IGlzIGNsaXBwZWQgYnlcbiAgICAgICAgICAvLyBhIHBhcmVudCBzY3JvbGxhYmxlIHRoZW4gY2xvc2UgdGhlIHRvb2x0aXAuXG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLmhpZGUoMCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUoe1xuICAgICAgZGlyZWN0aW9uOiB0aGlzLl9kaXIsXG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiBzdHJhdGVneSxcbiAgICAgIHBhbmVsQ2xhc3M6IFRPT0xUSVBfUEFORUxfQ0xBU1MsXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKVxuICAgIH0pO1xuXG4gICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcblxuICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNobWVudHMoKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2RldGFjaCgpKTtcblxuICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmO1xuICB9XG5cbiAgLyoqIERldGFjaGVzIHRoZSBjdXJyZW50bHktYXR0YWNoZWQgdG9vbHRpcC4gKi9cbiAgcHJpdmF0ZSBfZGV0YWNoKCkge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmICYmIHRoaXMuX292ZXJsYXlSZWYuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2goKTtcbiAgICB9XG5cbiAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IHRvb2x0aXAuICovXG4gIHByaXZhdGUgX3VwZGF0ZVBvc2l0aW9uKCkge1xuICAgIGNvbnN0IHBvc2l0aW9uID1cbiAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEuZ2V0Q29uZmlnKCkucG9zaXRpb25TdHJhdGVneSBhcyBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3k7XG4gICAgY29uc3Qgb3JpZ2luID0gdGhpcy5fZ2V0T3JpZ2luKCk7XG4gICAgY29uc3Qgb3ZlcmxheSA9IHRoaXMuX2dldE92ZXJsYXlQb3NpdGlvbigpO1xuXG4gICAgcG9zaXRpb24ud2l0aFBvc2l0aW9ucyhbXG4gICAgICB7Li4ub3JpZ2luLm1haW4sIC4uLm92ZXJsYXkubWFpbn0sXG4gICAgICB7Li4ub3JpZ2luLmZhbGxiYWNrLCAuLi5vdmVybGF5LmZhbGxiYWNrfVxuICAgIF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9yaWdpbiBwb3NpdGlvbiBhbmQgYSBmYWxsYmFjayBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgdXNlcidzIHBvc2l0aW9uIHByZWZlcmVuY2UuXG4gICAqIFRoZSBmYWxsYmFjayBwb3NpdGlvbiBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgb3JpZ2luIChlLmcuIGAnYmVsb3cnIC0+ICdhYm92ZSdgKS5cbiAgICovXG4gIF9nZXRPcmlnaW4oKToge21haW46IE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbiwgZmFsbGJhY2s6IE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbn0ge1xuICAgIGNvbnN0IGlzTHRyID0gIXRoaXMuX2RpciB8fCB0aGlzLl9kaXIudmFsdWUgPT0gJ2x0cic7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xuICAgIGxldCBvcmlnaW5Qb3NpdGlvbjogT3JpZ2luQ29ubmVjdGlvblBvc2l0aW9uO1xuXG4gICAgaWYgKHBvc2l0aW9uID09ICdhYm92ZScgfHwgcG9zaXRpb24gPT0gJ2JlbG93Jykge1xuICAgICAgb3JpZ2luUG9zaXRpb24gPSB7b3JpZ2luWDogJ2NlbnRlcicsIG9yaWdpblk6IHBvc2l0aW9uID09ICdhYm92ZScgPyAndG9wJyA6ICdib3R0b20nfTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgcG9zaXRpb24gPT0gJ2JlZm9yZScgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAnbGVmdCcgJiYgaXNMdHIpIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ3JpZ2h0JyAmJiAhaXNMdHIpKSB7XG4gICAgICBvcmlnaW5Qb3NpdGlvbiA9IHtvcmlnaW5YOiAnc3RhcnQnLCBvcmlnaW5ZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBvc2l0aW9uID09ICdhZnRlcicgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmIGlzTHRyKSB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiAhaXNMdHIpKSB7XG4gICAgICBvcmlnaW5Qb3NpdGlvbiA9IHtvcmlnaW5YOiAnZW5kJywgb3JpZ2luWTogJ2NlbnRlcid9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBnZXRNYXRUb29sdGlwSW52YWxpZFBvc2l0aW9uRXJyb3IocG9zaXRpb24pO1xuICAgIH1cblxuICAgIGNvbnN0IHt4LCB5fSA9IHRoaXMuX2ludmVydFBvc2l0aW9uKG9yaWdpblBvc2l0aW9uLm9yaWdpblgsIG9yaWdpblBvc2l0aW9uLm9yaWdpblkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1haW46IG9yaWdpblBvc2l0aW9uLFxuICAgICAgZmFsbGJhY2s6IHtvcmlnaW5YOiB4LCBvcmlnaW5ZOiB5fVxuICAgIH07XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgb3ZlcmxheSBwb3NpdGlvbiBhbmQgYSBmYWxsYmFjayBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgdXNlcidzIHByZWZlcmVuY2UgKi9cbiAgX2dldE92ZXJsYXlQb3NpdGlvbigpOiB7bWFpbjogT3ZlcmxheUNvbm5lY3Rpb25Qb3NpdGlvbiwgZmFsbGJhY2s6IE92ZXJsYXlDb25uZWN0aW9uUG9zaXRpb259IHtcbiAgICBjb25zdCBpc0x0ciA9ICF0aGlzLl9kaXIgfHwgdGhpcy5fZGlyLnZhbHVlID09ICdsdHInO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcbiAgICBsZXQgb3ZlcmxheVBvc2l0aW9uOiBPdmVybGF5Q29ubmVjdGlvblBvc2l0aW9uO1xuXG4gICAgaWYgKHBvc2l0aW9uID09ICdhYm92ZScpIHtcbiAgICAgIG92ZXJsYXlQb3NpdGlvbiA9IHtvdmVybGF5WDogJ2NlbnRlcicsIG92ZXJsYXlZOiAnYm90dG9tJ307XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvbiA9PSAnYmVsb3cnKSB7XG4gICAgICBvdmVybGF5UG9zaXRpb24gPSB7b3ZlcmxheVg6ICdjZW50ZXInLCBvdmVybGF5WTogJ3RvcCd9O1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBwb3NpdGlvbiA9PSAnYmVmb3JlJyB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiBpc0x0cikgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmICFpc0x0cikpIHtcbiAgICAgIG92ZXJsYXlQb3NpdGlvbiA9IHtvdmVybGF5WDogJ2VuZCcsIG92ZXJsYXlZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBvc2l0aW9uID09ICdhZnRlcicgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmIGlzTHRyKSB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiAhaXNMdHIpKSB7XG4gICAgICBvdmVybGF5UG9zaXRpb24gPSB7b3ZlcmxheVg6ICdzdGFydCcsIG92ZXJsYXlZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGdldE1hdFRvb2x0aXBJbnZhbGlkUG9zaXRpb25FcnJvcihwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgY29uc3Qge3gsIHl9ID0gdGhpcy5faW52ZXJ0UG9zaXRpb24ob3ZlcmxheVBvc2l0aW9uLm92ZXJsYXlYLCBvdmVybGF5UG9zaXRpb24ub3ZlcmxheVkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1haW46IG92ZXJsYXlQb3NpdGlvbixcbiAgICAgIGZhbGxiYWNrOiB7b3ZlcmxheVg6IHgsIG92ZXJsYXlZOiB5fVxuICAgIH07XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgdG9vbHRpcCBtZXNzYWdlIGFuZCByZXBvc2l0aW9ucyB0aGUgb3ZlcmxheSBhY2NvcmRpbmcgdG8gdGhlIG5ldyBtZXNzYWdlIGxlbmd0aCAqL1xuICBwcml2YXRlIF91cGRhdGVUb29sdGlwTWVzc2FnZSgpIHtcbiAgICAvLyBNdXN0IHdhaXQgZm9yIHRoZSBtZXNzYWdlIHRvIGJlIHBhaW50ZWQgdG8gdGhlIHRvb2x0aXAgc28gdGhhdCB0aGUgb3ZlcmxheSBjYW4gcHJvcGVybHlcbiAgICAvLyBjYWxjdWxhdGUgdGhlIGNvcnJlY3QgcG9zaXRpb25pbmcgYmFzZWQgb24gdGhlIHNpemUgb2YgdGhlIHRleHQuXG4gICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLm1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2U7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UuX21hcmtGb3JDaGVjaygpO1xuXG4gICAgICB0aGlzLl9uZ1pvbmUub25NaWNyb3Rhc2tFbXB0eS5hc09ic2VydmFibGUoKS5waXBlKFxuICAgICAgICB0YWtlKDEpLFxuICAgICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKVxuICAgICAgKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHRvb2x0aXAgY2xhc3MgKi9cbiAgcHJpdmF0ZSBfc2V0VG9vbHRpcENsYXNzKHRvb2x0aXBDbGFzczogc3RyaW5nfHN0cmluZ1tdfFNldDxzdHJpbmc+fHtba2V5OiBzdHJpbmddOiBhbnl9KSB7XG4gICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLnRvb2x0aXBDbGFzcyA9IHRvb2x0aXBDbGFzcztcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5fbWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEludmVydHMgYW4gb3ZlcmxheSBwb3NpdGlvbi4gKi9cbiAgcHJpdmF0ZSBfaW52ZXJ0UG9zaXRpb24oeDogSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3MsIHk6IFZlcnRpY2FsQ29ubmVjdGlvblBvcykge1xuICAgIGlmICh0aGlzLnBvc2l0aW9uID09PSAnYWJvdmUnIHx8IHRoaXMucG9zaXRpb24gPT09ICdiZWxvdycpIHtcbiAgICAgIGlmICh5ID09PSAndG9wJykge1xuICAgICAgICB5ID0gJ2JvdHRvbSc7XG4gICAgICB9IGVsc2UgaWYgKHkgPT09ICdib3R0b20nKSB7XG4gICAgICAgIHkgPSAndG9wJztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHggPT09ICdlbmQnKSB7XG4gICAgICAgIHggPSAnc3RhcnQnO1xuICAgICAgfSBlbHNlIGlmICh4ID09PSAnc3RhcnQnKSB7XG4gICAgICAgIHggPSAnZW5kJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge3gsIHl9O1xuICB9XG5cbiAgLyoqIEJpbmRzIHRoZSBwb2ludGVyIGV2ZW50cyB0byB0aGUgdG9vbHRpcCB0cmlnZ2VyLiAqL1xuICBwcml2YXRlIF9zZXR1cFBvaW50ZXJFdmVudHMoKSB7XG4gICAgLy8gVGhlIG1vdXNlIGV2ZW50cyBzaG91bGRuJ3QgYmUgYm91bmQgb24gbW9iaWxlIGRldmljZXMsIGJlY2F1c2UgdGhleSBjYW4gcHJldmVudCB0aGVcbiAgICAvLyBmaXJzdCB0YXAgZnJvbSBmaXJpbmcgaXRzIGNsaWNrIGV2ZW50IG9yIGNhbiBjYXVzZSB0aGUgdG9vbHRpcCB0byBvcGVuIGZvciBjbGlja3MuXG4gICAgaWYgKCF0aGlzLl9wbGF0Zm9ybS5JT1MgJiYgIXRoaXMuX3BsYXRmb3JtLkFORFJPSUQpIHtcbiAgICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnNcbiAgICAgICAgLnNldCgnbW91c2VlbnRlcicsICgpID0+IHRoaXMuc2hvdygpKVxuICAgICAgICAuc2V0KCdtb3VzZWxlYXZlJywgKCkgPT4gdGhpcy5oaWRlKCkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy50b3VjaEdlc3R1cmVzICE9PSAnb2ZmJykge1xuICAgICAgdGhpcy5fZGlzYWJsZU5hdGl2ZUdlc3R1cmVzSWZOZWNlc3NhcnkoKTtcbiAgICAgIGNvbnN0IHRvdWNoZW5kTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90b3VjaHN0YXJ0VGltZW91dCk7XG4gICAgICAgIHRoaXMuaGlkZSh0aGlzLl9kZWZhdWx0T3B0aW9ucy50b3VjaGVuZEhpZGVEZWxheSk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLl9wYXNzaXZlTGlzdGVuZXJzXG4gICAgICAgIC5zZXQoJ3RvdWNoZW5kJywgdG91Y2hlbmRMaXN0ZW5lcilcbiAgICAgICAgLnNldCgndG91Y2hjYW5jZWwnLCB0b3VjaGVuZExpc3RlbmVyKVxuICAgICAgICAuc2V0KCd0b3VjaHN0YXJ0JywgKCkgPT4ge1xuICAgICAgICAgIC8vIE5vdGUgdGhhdCBpdCdzIGltcG9ydGFudCB0aGF0IHdlIGRvbid0IGBwcmV2ZW50RGVmYXVsdGAgaGVyZSxcbiAgICAgICAgICAvLyBiZWNhdXNlIGl0IGNhbiBwcmV2ZW50IGNsaWNrIGV2ZW50cyBmcm9tIGZpcmluZyBvbiB0aGUgZWxlbWVudC5cbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdG91Y2hzdGFydFRpbWVvdXQpO1xuICAgICAgICAgIHRoaXMuX3RvdWNoc3RhcnRUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNob3coKSwgTE9OR1BSRVNTX0RFTEFZKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fcGFzc2l2ZUxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lciwgZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgcGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogRGlzYWJsZXMgdGhlIG5hdGl2ZSBicm93c2VyIGdlc3R1cmVzLCBiYXNlZCBvbiBob3cgdGhlIHRvb2x0aXAgaGFzIGJlZW4gY29uZmlndXJlZC4gKi9cbiAgcHJpdmF0ZSBfZGlzYWJsZU5hdGl2ZUdlc3R1cmVzSWZOZWNlc3NhcnkoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBzdHlsZSA9IGVsZW1lbnQuc3R5bGU7XG4gICAgY29uc3QgZ2VzdHVyZXMgPSB0aGlzLnRvdWNoR2VzdHVyZXM7XG5cbiAgICBpZiAoZ2VzdHVyZXMgIT09ICdvZmYnKSB7XG4gICAgICAvLyBJZiBnZXN0dXJlcyBhcmUgc2V0IHRvIGBhdXRvYCwgd2UgZG9uJ3QgZGlzYWJsZSB0ZXh0IHNlbGVjdGlvbiBvbiBpbnB1dHMgYW5kXG4gICAgICAvLyB0ZXh0YXJlYXMsIGJlY2F1c2UgaXQgcHJldmVudHMgdGhlIHVzZXIgZnJvbSB0eXBpbmcgaW50byB0aGVtIG9uIGlPUyBTYWZhcmkuXG4gICAgICBpZiAoZ2VzdHVyZXMgPT09ICdvbicgfHwgKGVsZW1lbnQubm9kZU5hbWUgIT09ICdJTlBVVCcgJiYgZWxlbWVudC5ub2RlTmFtZSAhPT0gJ1RFWFRBUkVBJykpIHtcbiAgICAgICAgc3R5bGUudXNlclNlbGVjdCA9IHN0eWxlLm1zVXNlclNlbGVjdCA9IHN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPVxuICAgICAgICAgICAgKHN0eWxlIGFzIGFueSkuTW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgaGF2ZSBgYXV0b2AgZ2VzdHVyZXMgYW5kIHRoZSBlbGVtZW50IHVzZXMgbmF0aXZlIEhUTUwgZHJhZ2dpbmcsXG4gICAgICAvLyB3ZSBkb24ndCBzZXQgYC13ZWJraXQtdXNlci1kcmFnYCBiZWNhdXNlIGl0IHByZXZlbnRzIHRoZSBuYXRpdmUgYmVoYXZpb3IuXG4gICAgICBpZiAoZ2VzdHVyZXMgPT09ICdvbicgfHwgIWVsZW1lbnQuZHJhZ2dhYmxlKSB7XG4gICAgICAgIChzdHlsZSBhcyBhbnkpLndlYmtpdFVzZXJEcmFnID0gJ25vbmUnO1xuICAgICAgfVxuXG4gICAgICBzdHlsZS50b3VjaEFjdGlvbiA9ICdub25lJztcbiAgICAgIHN0eWxlLndlYmtpdFRhcEhpZ2hsaWdodENvbG9yID0gJ3RyYW5zcGFyZW50JztcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBJbnRlcm5hbCBjb21wb25lbnQgdGhhdCB3cmFwcyB0aGUgdG9vbHRpcCdzIGNvbnRlbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC10b29sdGlwLWNvbXBvbmVudCcsXG4gIHRlbXBsYXRlVXJsOiAndG9vbHRpcC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3Rvb2x0aXAuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBhbmltYXRpb25zOiBbbWF0VG9vbHRpcEFuaW1hdGlvbnMudG9vbHRpcFN0YXRlXSxcbiAgaG9zdDoge1xuICAgIC8vIEZvcmNlcyB0aGUgZWxlbWVudCB0byBoYXZlIGEgbGF5b3V0IGluIElFIGFuZCBFZGdlLiBUaGlzIGZpeGVzIGlzc3VlcyB3aGVyZSB0aGUgZWxlbWVudFxuICAgIC8vIHdvbid0IGJlIHJlbmRlcmVkIGlmIHRoZSBhbmltYXRpb25zIGFyZSBkaXNhYmxlZCBvciB0aGVyZSBpcyBubyB3ZWIgYW5pbWF0aW9ucyBwb2x5ZmlsbC5cbiAgICAnW3N0eWxlLnpvb21dJzogJ192aXNpYmlsaXR5ID09PSBcInZpc2libGVcIiA/IDEgOiBudWxsJyxcbiAgICAnKGJvZHk6Y2xpY2spJzogJ3RoaXMuX2hhbmRsZUJvZHlJbnRlcmFjdGlvbigpJyxcbiAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgVG9vbHRpcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKiBNZXNzYWdlIHRvIGRpc3BsYXkgaW4gdGhlIHRvb2x0aXAgKi9cbiAgbWVzc2FnZTogc3RyaW5nO1xuXG4gIC8qKiBDbGFzc2VzIHRvIGJlIGFkZGVkIHRvIHRoZSB0b29sdGlwLiBTdXBwb3J0cyB0aGUgc2FtZSBzeW50YXggYXMgYG5nQ2xhc3NgLiAqL1xuICB0b29sdGlwQ2xhc3M6IHN0cmluZ3xzdHJpbmdbXXxTZXQ8c3RyaW5nPnx7W2tleTogc3RyaW5nXTogYW55fTtcblxuICAvKiogVGhlIHRpbWVvdXQgSUQgb2YgYW55IGN1cnJlbnQgdGltZXIgc2V0IHRvIHNob3cgdGhlIHRvb2x0aXAgKi9cbiAgX3Nob3dUaW1lb3V0SWQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFRoZSB0aW1lb3V0IElEIG9mIGFueSBjdXJyZW50IHRpbWVyIHNldCB0byBoaWRlIHRoZSB0b29sdGlwICovXG4gIF9oaWRlVGltZW91dElkOiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBQcm9wZXJ0eSB3YXRjaGVkIGJ5IHRoZSBhbmltYXRpb24gZnJhbWV3b3JrIHRvIHNob3cgb3IgaGlkZSB0aGUgdG9vbHRpcCAqL1xuICBfdmlzaWJpbGl0eTogVG9vbHRpcFZpc2liaWxpdHkgPSAnaW5pdGlhbCc7XG5cbiAgLyoqIFdoZXRoZXIgaW50ZXJhY3Rpb25zIG9uIHRoZSBwYWdlIHNob3VsZCBjbG9zZSB0aGUgdG9vbHRpcCAqL1xuICBwcml2YXRlIF9jbG9zZU9uSW50ZXJhY3Rpb246IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoYXQgdGhlIHRvb2x0aXAgaGFzIGJlZW4gaGlkZGVuIGZyb20gdGhlIHZpZXcgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfb25IaWRlOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGV0aGVyIHRoZSB1c2VyIGhhcyBhIGhhbmRzZXQtc2l6ZWQgZGlzcGxheS4gICovXG4gIF9pc0hhbmRzZXQ6IE9ic2VydmFibGU8QnJlYWtwb2ludFN0YXRlPiA9IHRoaXMuX2JyZWFrcG9pbnRPYnNlcnZlci5vYnNlcnZlKEJyZWFrcG9pbnRzLkhhbmRzZXQpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9icmVha3BvaW50T2JzZXJ2ZXI6IEJyZWFrcG9pbnRPYnNlcnZlcikge31cblxuICAvKipcbiAgICogU2hvd3MgdGhlIHRvb2x0aXAgd2l0aCBhbiBhbmltYXRpb24gb3JpZ2luYXRpbmcgZnJvbSB0aGUgcHJvdmlkZWQgb3JpZ2luXG4gICAqIEBwYXJhbSBkZWxheSBBbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIHRoZSBkZWxheSBzaG93aW5nIHRoZSB0b29sdGlwLlxuICAgKi9cbiAgc2hvdyhkZWxheTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gQ2FuY2VsIHRoZSBkZWxheWVkIGhpZGUgaWYgaXQgaXMgc2NoZWR1bGVkXG4gICAgaWYgKHRoaXMuX2hpZGVUaW1lb3V0SWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9oaWRlVGltZW91dElkKTtcbiAgICAgIHRoaXMuX2hpZGVUaW1lb3V0SWQgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIEJvZHkgaW50ZXJhY3Rpb25zIHNob3VsZCBjYW5jZWwgdGhlIHRvb2x0aXAgaWYgdGhlcmUgaXMgYSBkZWxheSBpbiBzaG93aW5nLlxuICAgIHRoaXMuX2Nsb3NlT25JbnRlcmFjdGlvbiA9IHRydWU7XG4gICAgdGhpcy5fc2hvd1RpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fdmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgIHRoaXMuX3Nob3dUaW1lb3V0SWQgPSBudWxsO1xuXG4gICAgICAvLyBNYXJrIGZvciBjaGVjayBzbyBpZiBhbnkgcGFyZW50IGNvbXBvbmVudCBoYXMgc2V0IHRoZVxuICAgICAgLy8gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgdG8gT25QdXNoIGl0IHdpbGwgYmUgY2hlY2tlZCBhbnl3YXlzXG4gICAgICB0aGlzLl9tYXJrRm9yQ2hlY2soKTtcbiAgICB9LCBkZWxheSk7XG4gIH1cblxuICAvKipcbiAgICogQmVnaW5zIHRoZSBhbmltYXRpb24gdG8gaGlkZSB0aGUgdG9vbHRpcCBhZnRlciB0aGUgcHJvdmlkZWQgZGVsYXkgaW4gbXMuXG4gICAqIEBwYXJhbSBkZWxheSBBbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5IHNob3dpbmcgdGhlIHRvb2x0aXAuXG4gICAqL1xuICBoaWRlKGRlbGF5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBDYW5jZWwgdGhlIGRlbGF5ZWQgc2hvdyBpZiBpdCBpcyBzY2hlZHVsZWRcbiAgICBpZiAodGhpcy5fc2hvd1RpbWVvdXRJZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3Nob3dUaW1lb3V0SWQpO1xuICAgICAgdGhpcy5fc2hvd1RpbWVvdXRJZCA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5faGlkZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fdmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgdGhpcy5faGlkZVRpbWVvdXRJZCA9IG51bGw7XG5cbiAgICAgIC8vIE1hcmsgZm9yIGNoZWNrIHNvIGlmIGFueSBwYXJlbnQgY29tcG9uZW50IGhhcyBzZXQgdGhlXG4gICAgICAvLyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB0byBPblB1c2ggaXQgd2lsbCBiZSBjaGVja2VkIGFueXdheXNcbiAgICAgIHRoaXMuX21hcmtGb3JDaGVjaygpO1xuICAgIH0sIGRlbGF5KTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIGFuIG9ic2VydmFibGUgdGhhdCBub3RpZmllcyB3aGVuIHRoZSB0b29sdGlwIGhhcyBiZWVuIGhpZGRlbiBmcm9tIHZpZXcuICovXG4gIGFmdGVySGlkZGVuKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9vbkhpZGUuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdG9vbHRpcCBpcyBiZWluZyBkaXNwbGF5ZWQuICovXG4gIGlzVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJpbGl0eSA9PT0gJ3Zpc2libGUnO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fb25IaWRlLmNvbXBsZXRlKCk7XG4gIH1cblxuICBfYW5pbWF0aW9uU3RhcnQoKSB7XG4gICAgdGhpcy5fY2xvc2VPbkludGVyYWN0aW9uID0gZmFsc2U7XG4gIH1cblxuICBfYW5pbWF0aW9uRG9uZShldmVudDogQW5pbWF0aW9uRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCB0b1N0YXRlID0gZXZlbnQudG9TdGF0ZSBhcyBUb29sdGlwVmlzaWJpbGl0eTtcblxuICAgIGlmICh0b1N0YXRlID09PSAnaGlkZGVuJyAmJiAhdGhpcy5pc1Zpc2libGUoKSkge1xuICAgICAgdGhpcy5fb25IaWRlLm5leHQoKTtcbiAgICB9XG5cbiAgICBpZiAodG9TdGF0ZSA9PT0gJ3Zpc2libGUnIHx8IHRvU3RhdGUgPT09ICdoaWRkZW4nKSB7XG4gICAgICB0aGlzLl9jbG9zZU9uSW50ZXJhY3Rpb24gPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmFjdGlvbnMgb24gdGhlIEhUTUwgYm9keSBzaG91bGQgY2xvc2UgdGhlIHRvb2x0aXAgaW1tZWRpYXRlbHkgYXMgZGVmaW5lZCBpbiB0aGVcbiAgICogbWF0ZXJpYWwgZGVzaWduIHNwZWMuXG4gICAqIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbXBvbmVudHMvdG9vbHRpcHMuaHRtbCNiZWhhdmlvclxuICAgKi9cbiAgX2hhbmRsZUJvZHlJbnRlcmFjdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fY2xvc2VPbkludGVyYWN0aW9uKSB7XG4gICAgICB0aGlzLmhpZGUoMCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoYXQgdGhlIHRvb2x0aXAgbmVlZHMgdG8gYmUgY2hlY2tlZCBpbiB0aGUgbmV4dCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bi5cbiAgICogTWFpbmx5IHVzZWQgZm9yIHJlbmRlcmluZyB0aGUgaW5pdGlhbCB0ZXh0IGJlZm9yZSBwb3NpdGlvbmluZyBhIHRvb2x0aXAsIHdoaWNoXG4gICAqIGNhbiBiZSBwcm9ibGVtYXRpYyBpbiBjb21wb25lbnRzIHdpdGggT25QdXNoIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAqL1xuICBfbWFya0ZvckNoZWNrKCk6IHZvaWQge1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG59XG4iXX0=