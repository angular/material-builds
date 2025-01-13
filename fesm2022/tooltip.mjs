import { takeUntil } from 'rxjs/operators';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import * as i0 from '@angular/core';
import { InjectionToken, inject, ElementRef, ViewContainerRef, NgZone, Injector, afterNextRender, Directive, Input, ChangeDetectorRef, ANIMATION_MODULE_TYPE, Component, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, NgModule } from '@angular/core';
import { DOCUMENT, NgClass } from '@angular/common';
import { normalizePassiveListenerOptions, Platform } from '@angular/cdk/platform';
import { AriaDescriber, FocusMonitor, A11yModule } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay, ScrollDispatcher, OverlayModule } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatCommonModule } from '@angular/material/core';

/** Time in ms to throttle repositioning after scroll events. */
const SCROLL_THROTTLE_MS = 20;
/**
 * Creates an error to be thrown if the user supplied an invalid tooltip position.
 * @docs-private
 */
function getMatTooltipInvalidPositionError(position) {
    return Error(`Tooltip position "${position}" is invalid.`);
}
/** Injection token that determines the scroll handling while a tooltip is visible. */
const MAT_TOOLTIP_SCROLL_STRATEGY = new InjectionToken('mat-tooltip-scroll-strategy', {
    providedIn: 'root',
    factory: () => {
        const overlay = inject(Overlay);
        return () => overlay.scrollStrategies.reposition({ scrollThrottle: SCROLL_THROTTLE_MS });
    },
});
/** @docs-private */
function MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition({ scrollThrottle: SCROLL_THROTTLE_MS });
}
/** @docs-private */
const MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MAT_TOOLTIP_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY,
};
/** @docs-private */
function MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY() {
    return {
        showDelay: 0,
        hideDelay: 0,
        touchendHideDelay: 1500,
    };
}
/** Injection token to be used to override the default options for `matTooltip`. */
const MAT_TOOLTIP_DEFAULT_OPTIONS = new InjectionToken('mat-tooltip-default-options', {
    providedIn: 'root',
    factory: MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY,
});
/**
 * CSS class that will be attached to the overlay panel.
 * @deprecated
 * @breaking-change 13.0.0 remove this variable
 */
const TOOLTIP_PANEL_CLASS = 'mat-mdc-tooltip-panel';
const PANEL_CLASS = 'tooltip-panel';
/** Options used to bind passive event listeners. */
const passiveListenerOptions = normalizePassiveListenerOptions({ passive: true });
// These constants were taken from MDC's `numbers` object. We can't import them from MDC,
// because they have some top-level references to `window` which break during SSR.
const MIN_VIEWPORT_TOOLTIP_THRESHOLD = 8;
const UNBOUNDED_ANCHOR_GAP = 8;
const MIN_HEIGHT = 24;
const MAX_WIDTH = 200;
/**
 * Directive that attaches a material design tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 *
 * https://material.io/design/components/tooltips.html
 */
class MatTooltip {
    _overlay = inject(Overlay);
    _elementRef = inject(ElementRef);
    _scrollDispatcher = inject(ScrollDispatcher);
    _viewContainerRef = inject(ViewContainerRef);
    _ngZone = inject(NgZone);
    _platform = inject(Platform);
    _ariaDescriber = inject(AriaDescriber);
    _focusMonitor = inject(FocusMonitor);
    _dir = inject(Directionality);
    _injector = inject(Injector);
    _defaultOptions = inject(MAT_TOOLTIP_DEFAULT_OPTIONS, {
        optional: true,
    });
    _overlayRef;
    _tooltipInstance;
    _portal;
    _position = 'below';
    _positionAtOrigin = false;
    _disabled = false;
    _tooltipClass;
    _scrollStrategy = inject(MAT_TOOLTIP_SCROLL_STRATEGY);
    _viewInitialized = false;
    _pointerExitEventsInitialized = false;
    _tooltipComponent = TooltipComponent;
    _viewportMargin = 8;
    _currentPosition;
    _cssClassPrefix = 'mat-mdc';
    _ariaDescriptionPending;
    _dirSubscribed = false;
    /** Allows the user to define the position of the tooltip relative to the parent element */
    get position() {
        return this._position;
    }
    set position(value) {
        if (value !== this._position) {
            this._position = value;
            if (this._overlayRef) {
                this._updatePosition(this._overlayRef);
                this._tooltipInstance?.show(0);
                this._overlayRef.updatePosition();
            }
        }
    }
    /**
     * Whether tooltip should be relative to the click or touch origin
     * instead of outside the element bounding box.
     */
    get positionAtOrigin() {
        return this._positionAtOrigin;
    }
    set positionAtOrigin(value) {
        this._positionAtOrigin = coerceBooleanProperty(value);
        this._detach();
        this._overlayRef = null;
    }
    /** Disables the display of the tooltip. */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        const isDisabled = coerceBooleanProperty(value);
        if (this._disabled !== isDisabled) {
            this._disabled = isDisabled;
            // If tooltip is disabled, hide immediately.
            if (isDisabled) {
                this.hide(0);
            }
            else {
                this._setupPointerEnterEventsIfNeeded();
            }
            this._syncAriaDescription(this.message);
        }
    }
    /** The default delay in ms before showing the tooltip after show is called */
    get showDelay() {
        return this._showDelay;
    }
    set showDelay(value) {
        this._showDelay = coerceNumberProperty(value);
    }
    _showDelay;
    /** The default delay in ms before hiding the tooltip after hide is called */
    get hideDelay() {
        return this._hideDelay;
    }
    set hideDelay(value) {
        this._hideDelay = coerceNumberProperty(value);
        if (this._tooltipInstance) {
            this._tooltipInstance._mouseLeaveHideDelay = this._hideDelay;
        }
    }
    _hideDelay;
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
    touchGestures = 'auto';
    /** The message to be displayed in the tooltip */
    get message() {
        return this._message;
    }
    set message(value) {
        const oldMessage = this._message;
        // If the message is not a string (e.g. number), convert it to a string and trim it.
        // Must convert with `String(value)`, not `${value}`, otherwise Closure Compiler optimises
        // away the string-conversion: https://github.com/angular/components/issues/20684
        this._message = value != null ? String(value).trim() : '';
        if (!this._message && this._isTooltipVisible()) {
            this.hide(0);
        }
        else {
            this._setupPointerEnterEventsIfNeeded();
            this._updateTooltipMessage();
        }
        this._syncAriaDescription(oldMessage);
    }
    _message = '';
    /** Classes to be passed to the tooltip. Supports the same syntax as `ngClass`. */
    get tooltipClass() {
        return this._tooltipClass;
    }
    set tooltipClass(value) {
        this._tooltipClass = value;
        if (this._tooltipInstance) {
            this._setTooltipClass(this._tooltipClass);
        }
    }
    /** Manually-bound passive event listeners. */
    _passiveListeners = [];
    /** Reference to the current document. */
    _document = inject(DOCUMENT);
    /** Timer started at the last `touchstart` event. */
    _touchstartTimeout = null;
    /** Emits when the component is destroyed. */
    _destroyed = new Subject();
    /** Whether ngOnDestroyed has been called. */
    _isDestroyed = false;
    constructor() {
        const defaultOptions = this._defaultOptions;
        if (defaultOptions) {
            this._showDelay = defaultOptions.showDelay;
            this._hideDelay = defaultOptions.hideDelay;
            if (defaultOptions.position) {
                this.position = defaultOptions.position;
            }
            if (defaultOptions.positionAtOrigin) {
                this.positionAtOrigin = defaultOptions.positionAtOrigin;
            }
            if (defaultOptions.touchGestures) {
                this.touchGestures = defaultOptions.touchGestures;
            }
            if (defaultOptions.tooltipClass) {
                this.tooltipClass = defaultOptions.tooltipClass;
            }
        }
        this._viewportMargin = MIN_VIEWPORT_TOOLTIP_THRESHOLD;
    }
    ngAfterViewInit() {
        // This needs to happen after view init so the initial values for all inputs have been set.
        this._viewInitialized = true;
        this._setupPointerEnterEventsIfNeeded();
        this._focusMonitor
            .monitor(this._elementRef)
            .pipe(takeUntil(this._destroyed))
            .subscribe(origin => {
            // Note that the focus monitor runs outside the Angular zone.
            if (!origin) {
                this._ngZone.run(() => this.hide(0));
            }
            else if (origin === 'keyboard') {
                this._ngZone.run(() => this.show());
            }
        });
    }
    /**
     * Dispose the tooltip when destroyed.
     */
    ngOnDestroy() {
        const nativeElement = this._elementRef.nativeElement;
        // Optimization: Do not call clearTimeout unless there is an active timer.
        if (this._touchstartTimeout) {
            clearTimeout(this._touchstartTimeout);
        }
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._tooltipInstance = null;
        }
        // Clean up the event listeners set in the constructor
        this._passiveListeners.forEach(([event, listener]) => {
            nativeElement.removeEventListener(event, listener, passiveListenerOptions);
        });
        this._passiveListeners.length = 0;
        this._destroyed.next();
        this._destroyed.complete();
        this._isDestroyed = true;
        this._ariaDescriber.removeDescription(nativeElement, this.message, 'tooltip');
        this._focusMonitor.stopMonitoring(nativeElement);
    }
    /** Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input */
    show(delay = this.showDelay, origin) {
        if (this.disabled || !this.message || this._isTooltipVisible()) {
            this._tooltipInstance?._cancelPendingAnimations();
            return;
        }
        const overlayRef = this._createOverlay(origin);
        this._detach();
        this._portal =
            this._portal || new ComponentPortal(this._tooltipComponent, this._viewContainerRef);
        const instance = (this._tooltipInstance = overlayRef.attach(this._portal).instance);
        instance._triggerElement = this._elementRef.nativeElement;
        instance._mouseLeaveHideDelay = this._hideDelay;
        instance
            .afterHidden()
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => this._detach());
        this._setTooltipClass(this._tooltipClass);
        this._updateTooltipMessage();
        instance.show(delay);
    }
    /** Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input */
    hide(delay = this.hideDelay) {
        const instance = this._tooltipInstance;
        if (instance) {
            if (instance.isVisible()) {
                instance.hide(delay);
            }
            else {
                instance._cancelPendingAnimations();
                this._detach();
            }
        }
    }
    /** Shows/hides the tooltip */
    toggle(origin) {
        this._isTooltipVisible() ? this.hide() : this.show(undefined, origin);
    }
    /** Returns true if the tooltip is currently visible to the user */
    _isTooltipVisible() {
        return !!this._tooltipInstance && this._tooltipInstance.isVisible();
    }
    /** Create the overlay config and position strategy */
    _createOverlay(origin) {
        if (this._overlayRef) {
            const existingStrategy = this._overlayRef.getConfig()
                .positionStrategy;
            if ((!this.positionAtOrigin || !origin) && existingStrategy._origin instanceof ElementRef) {
                return this._overlayRef;
            }
            this._detach();
        }
        const scrollableAncestors = this._scrollDispatcher.getAncestorScrollContainers(this._elementRef);
        // Create connected position strategy that listens for scroll events to reposition.
        const strategy = this._overlay
            .position()
            .flexibleConnectedTo(this.positionAtOrigin ? origin || this._elementRef : this._elementRef)
            .withTransformOriginOn(`.${this._cssClassPrefix}-tooltip`)
            .withFlexibleDimensions(false)
            .withViewportMargin(this._viewportMargin)
            .withScrollableContainers(scrollableAncestors);
        strategy.positionChanges.pipe(takeUntil(this._destroyed)).subscribe(change => {
            this._updateCurrentPositionClass(change.connectionPair);
            if (this._tooltipInstance) {
                if (change.scrollableViewProperties.isOverlayClipped && this._tooltipInstance.isVisible()) {
                    // After position changes occur and the overlay is clipped by
                    // a parent scrollable then close the tooltip.
                    this._ngZone.run(() => this.hide(0));
                }
            }
        });
        this._overlayRef = this._overlay.create({
            direction: this._dir,
            positionStrategy: strategy,
            panelClass: `${this._cssClassPrefix}-${PANEL_CLASS}`,
            scrollStrategy: this._scrollStrategy(),
        });
        this._updatePosition(this._overlayRef);
        this._overlayRef
            .detachments()
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => this._detach());
        this._overlayRef
            .outsidePointerEvents()
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => this._tooltipInstance?._handleBodyInteraction());
        this._overlayRef
            .keydownEvents()
            .pipe(takeUntil(this._destroyed))
            .subscribe(event => {
            if (this._isTooltipVisible() && event.keyCode === ESCAPE && !hasModifierKey(event)) {
                event.preventDefault();
                event.stopPropagation();
                this._ngZone.run(() => this.hide(0));
            }
        });
        if (this._defaultOptions?.disableTooltipInteractivity) {
            this._overlayRef.addPanelClass(`${this._cssClassPrefix}-tooltip-panel-non-interactive`);
        }
        if (!this._dirSubscribed) {
            this._dirSubscribed = true;
            this._dir.change.pipe(takeUntil(this._destroyed)).subscribe(() => {
                if (this._overlayRef) {
                    this._updatePosition(this._overlayRef);
                }
            });
        }
        return this._overlayRef;
    }
    /** Detaches the currently-attached tooltip. */
    _detach() {
        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
        }
        this._tooltipInstance = null;
    }
    /** Updates the position of the current tooltip. */
    _updatePosition(overlayRef) {
        const position = overlayRef.getConfig().positionStrategy;
        const origin = this._getOrigin();
        const overlay = this._getOverlayPosition();
        position.withPositions([
            this._addOffset({ ...origin.main, ...overlay.main }),
            this._addOffset({ ...origin.fallback, ...overlay.fallback }),
        ]);
    }
    /** Adds the configured offset to a position. Used as a hook for child classes. */
    _addOffset(position) {
        const offset = UNBOUNDED_ANCHOR_GAP;
        const isLtr = !this._dir || this._dir.value == 'ltr';
        if (position.originY === 'top') {
            position.offsetY = -offset;
        }
        else if (position.originY === 'bottom') {
            position.offsetY = offset;
        }
        else if (position.originX === 'start') {
            position.offsetX = isLtr ? -offset : offset;
        }
        else if (position.originX === 'end') {
            position.offsetX = isLtr ? offset : -offset;
        }
        return position;
    }
    /**
     * Returns the origin position and a fallback position based on the user's position preference.
     * The fallback position is the inverse of the origin (e.g. `'below' -> 'above'`).
     */
    _getOrigin() {
        const isLtr = !this._dir || this._dir.value == 'ltr';
        const position = this.position;
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
        else if (typeof ngDevMode === 'undefined' || ngDevMode) {
            throw getMatTooltipInvalidPositionError(position);
        }
        const { x, y } = this._invertPosition(originPosition.originX, originPosition.originY);
        return {
            main: originPosition,
            fallback: { originX: x, originY: y },
        };
    }
    /** Returns the overlay position and a fallback position based on the user's preference */
    _getOverlayPosition() {
        const isLtr = !this._dir || this._dir.value == 'ltr';
        const position = this.position;
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
        else if (typeof ngDevMode === 'undefined' || ngDevMode) {
            throw getMatTooltipInvalidPositionError(position);
        }
        const { x, y } = this._invertPosition(overlayPosition.overlayX, overlayPosition.overlayY);
        return {
            main: overlayPosition,
            fallback: { overlayX: x, overlayY: y },
        };
    }
    /** Updates the tooltip message and repositions the overlay according to the new message length */
    _updateTooltipMessage() {
        // Must wait for the message to be painted to the tooltip so that the overlay can properly
        // calculate the correct positioning based on the size of the text.
        if (this._tooltipInstance) {
            this._tooltipInstance.message = this.message;
            this._tooltipInstance._markForCheck();
            afterNextRender(() => {
                if (this._tooltipInstance) {
                    this._overlayRef.updatePosition();
                }
            }, {
                injector: this._injector,
            });
        }
    }
    /** Updates the tooltip class */
    _setTooltipClass(tooltipClass) {
        if (this._tooltipInstance) {
            this._tooltipInstance.tooltipClass = tooltipClass;
            this._tooltipInstance._markForCheck();
        }
    }
    /** Inverts an overlay position. */
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
    /** Updates the class on the overlay panel based on the current position of the tooltip. */
    _updateCurrentPositionClass(connectionPair) {
        const { overlayY, originX, originY } = connectionPair;
        let newPosition;
        // If the overlay is in the middle along the Y axis,
        // it means that it's either before or after.
        if (overlayY === 'center') {
            // Note that since this information is used for styling, we want to
            // resolve `start` and `end` to their real values, otherwise consumers
            // would have to remember to do it themselves on each consumption.
            if (this._dir && this._dir.value === 'rtl') {
                newPosition = originX === 'end' ? 'left' : 'right';
            }
            else {
                newPosition = originX === 'start' ? 'left' : 'right';
            }
        }
        else {
            newPosition = overlayY === 'bottom' && originY === 'top' ? 'above' : 'below';
        }
        if (newPosition !== this._currentPosition) {
            const overlayRef = this._overlayRef;
            if (overlayRef) {
                const classPrefix = `${this._cssClassPrefix}-${PANEL_CLASS}-`;
                overlayRef.removePanelClass(classPrefix + this._currentPosition);
                overlayRef.addPanelClass(classPrefix + newPosition);
            }
            this._currentPosition = newPosition;
        }
    }
    /** Binds the pointer events to the tooltip trigger. */
    _setupPointerEnterEventsIfNeeded() {
        // Optimization: Defer hooking up events if there's no message or the tooltip is disabled.
        if (this._disabled ||
            !this.message ||
            !this._viewInitialized ||
            this._passiveListeners.length) {
            return;
        }
        // The mouse events shouldn't be bound on mobile devices, because they can prevent the
        // first tap from firing its click event or can cause the tooltip to open for clicks.
        if (this._platformSupportsMouseEvents()) {
            this._passiveListeners.push([
                'mouseenter',
                event => {
                    this._setupPointerExitEventsIfNeeded();
                    let point = undefined;
                    if (event.x !== undefined && event.y !== undefined) {
                        point = event;
                    }
                    this.show(undefined, point);
                },
            ]);
        }
        else if (this.touchGestures !== 'off') {
            this._disableNativeGesturesIfNecessary();
            this._passiveListeners.push([
                'touchstart',
                event => {
                    const touch = event.targetTouches?.[0];
                    const origin = touch ? { x: touch.clientX, y: touch.clientY } : undefined;
                    // Note that it's important that we don't `preventDefault` here,
                    // because it can prevent click events from firing on the element.
                    this._setupPointerExitEventsIfNeeded();
                    if (this._touchstartTimeout) {
                        clearTimeout(this._touchstartTimeout);
                    }
                    const DEFAULT_LONGPRESS_DELAY = 500;
                    this._touchstartTimeout = setTimeout(() => {
                        this._touchstartTimeout = null;
                        this.show(undefined, origin);
                    }, this._defaultOptions?.touchLongPressShowDelay ?? DEFAULT_LONGPRESS_DELAY);
                },
            ]);
        }
        this._addListeners(this._passiveListeners);
    }
    _setupPointerExitEventsIfNeeded() {
        if (this._pointerExitEventsInitialized) {
            return;
        }
        this._pointerExitEventsInitialized = true;
        const exitListeners = [];
        if (this._platformSupportsMouseEvents()) {
            exitListeners.push([
                'mouseleave',
                event => {
                    const newTarget = event.relatedTarget;
                    if (!newTarget || !this._overlayRef?.overlayElement.contains(newTarget)) {
                        this.hide();
                    }
                },
            ], ['wheel', event => this._wheelListener(event)]);
        }
        else if (this.touchGestures !== 'off') {
            this._disableNativeGesturesIfNecessary();
            const touchendListener = () => {
                if (this._touchstartTimeout) {
                    clearTimeout(this._touchstartTimeout);
                }
                this.hide(this._defaultOptions?.touchendHideDelay);
            };
            exitListeners.push(['touchend', touchendListener], ['touchcancel', touchendListener]);
        }
        this._addListeners(exitListeners);
        this._passiveListeners.push(...exitListeners);
    }
    _addListeners(listeners) {
        listeners.forEach(([event, listener]) => {
            this._elementRef.nativeElement.addEventListener(event, listener, passiveListenerOptions);
        });
    }
    _platformSupportsMouseEvents() {
        return !this._platform.IOS && !this._platform.ANDROID;
    }
    /** Listener for the `wheel` event on the element. */
    _wheelListener(event) {
        if (this._isTooltipVisible()) {
            const elementUnderPointer = this._document.elementFromPoint(event.clientX, event.clientY);
            const element = this._elementRef.nativeElement;
            // On non-touch devices we depend on the `mouseleave` event to close the tooltip, but it
            // won't fire if the user scrolls away using the wheel without moving their cursor. We
            // work around it by finding the element under the user's cursor and closing the tooltip
            // if it's not the trigger.
            if (elementUnderPointer !== element && !element.contains(elementUnderPointer)) {
                this.hide();
            }
        }
    }
    /** Disables the native browser gestures, based on how the tooltip has been configured. */
    _disableNativeGesturesIfNecessary() {
        const gestures = this.touchGestures;
        if (gestures !== 'off') {
            const element = this._elementRef.nativeElement;
            const style = element.style;
            // If gestures are set to `auto`, we don't disable text selection on inputs and
            // textareas, because it prevents the user from typing into them on iOS Safari.
            if (gestures === 'on' || (element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA')) {
                style.userSelect =
                    style.msUserSelect =
                        style.webkitUserSelect =
                            style.MozUserSelect =
                                'none';
            }
            // If we have `auto` gestures and the element uses native HTML dragging,
            // we don't set `-webkit-user-drag` because it prevents the native behavior.
            if (gestures === 'on' || !element.draggable) {
                style.webkitUserDrag = 'none';
            }
            style.touchAction = 'none';
            style.webkitTapHighlightColor = 'transparent';
        }
    }
    /** Updates the tooltip's ARIA description based on it current state. */
    _syncAriaDescription(oldMessage) {
        if (this._ariaDescriptionPending) {
            return;
        }
        this._ariaDescriptionPending = true;
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, oldMessage, 'tooltip');
        // The `AriaDescriber` has some functionality that avoids adding a description if it's the
        // same as the `aria-label` of an element, however we can't know whether the tooltip trigger
        // has a data-bound `aria-label` or when it'll be set for the first time. We can avoid the
        // issue by deferring the description by a tick so Angular has time to set the `aria-label`.
        if (!this._isDestroyed) {
            afterNextRender({
                write: () => {
                    this._ariaDescriptionPending = false;
                    if (this.message && !this.disabled) {
                        this._ariaDescriber.describe(this._elementRef.nativeElement, this.message, 'tooltip');
                    }
                },
            }, { injector: this._injector });
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.0-rc.0", ngImport: i0, type: MatTooltip, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.1.0-rc.0", type: MatTooltip, isStandalone: true, selector: "[matTooltip]", inputs: { position: ["matTooltipPosition", "position"], positionAtOrigin: ["matTooltipPositionAtOrigin", "positionAtOrigin"], disabled: ["matTooltipDisabled", "disabled"], showDelay: ["matTooltipShowDelay", "showDelay"], hideDelay: ["matTooltipHideDelay", "hideDelay"], touchGestures: ["matTooltipTouchGestures", "touchGestures"], message: ["matTooltip", "message"], tooltipClass: ["matTooltipClass", "tooltipClass"] }, host: { properties: { "class.mat-mdc-tooltip-disabled": "disabled" }, classAttribute: "mat-mdc-tooltip-trigger" }, exportAs: ["matTooltip"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.0-rc.0", ngImport: i0, type: MatTooltip, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTooltip]',
                    exportAs: 'matTooltip',
                    host: {
                        'class': 'mat-mdc-tooltip-trigger',
                        '[class.mat-mdc-tooltip-disabled]': 'disabled',
                    },
                }]
        }], ctorParameters: () => [], propDecorators: { position: [{
                type: Input,
                args: ['matTooltipPosition']
            }], positionAtOrigin: [{
                type: Input,
                args: ['matTooltipPositionAtOrigin']
            }], disabled: [{
                type: Input,
                args: ['matTooltipDisabled']
            }], showDelay: [{
                type: Input,
                args: ['matTooltipShowDelay']
            }], hideDelay: [{
                type: Input,
                args: ['matTooltipHideDelay']
            }], touchGestures: [{
                type: Input,
                args: ['matTooltipTouchGestures']
            }], message: [{
                type: Input,
                args: ['matTooltip']
            }], tooltipClass: [{
                type: Input,
                args: ['matTooltipClass']
            }] } });
/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 */
class TooltipComponent {
    _changeDetectorRef = inject(ChangeDetectorRef);
    _elementRef = inject(ElementRef);
    /* Whether the tooltip text overflows to multiple lines */
    _isMultiline = false;
    /** Message to display in the tooltip */
    message;
    /** Classes to be added to the tooltip. Supports the same syntax as `ngClass`. */
    tooltipClass;
    /** The timeout ID of any current timer set to show the tooltip */
    _showTimeoutId;
    /** The timeout ID of any current timer set to hide the tooltip */
    _hideTimeoutId;
    /** Element that caused the tooltip to open. */
    _triggerElement;
    /** Amount of milliseconds to delay the closing sequence. */
    _mouseLeaveHideDelay;
    /** Whether animations are currently disabled. */
    _animationsDisabled;
    /** Reference to the internal tooltip element. */
    _tooltip;
    /** Whether interactions on the page should close the tooltip */
    _closeOnInteraction = false;
    /** Whether the tooltip is currently visible. */
    _isVisible = false;
    /** Subject for notifying that the tooltip has been hidden from the view */
    _onHide = new Subject();
    /** Name of the show animation and the class that toggles it. */
    _showAnimation = 'mat-mdc-tooltip-show';
    /** Name of the hide animation and the class that toggles it. */
    _hideAnimation = 'mat-mdc-tooltip-hide';
    constructor() {
        const animationMode = inject(ANIMATION_MODULE_TYPE, { optional: true });
        this._animationsDisabled = animationMode === 'NoopAnimations';
    }
    /**
     * Shows the tooltip with an animation originating from the provided origin
     * @param delay Amount of milliseconds to the delay showing the tooltip.
     */
    show(delay) {
        // Cancel the delayed hide if it is scheduled
        if (this._hideTimeoutId != null) {
            clearTimeout(this._hideTimeoutId);
        }
        this._showTimeoutId = setTimeout(() => {
            this._toggleVisibility(true);
            this._showTimeoutId = undefined;
        }, delay);
    }
    /**
     * Begins the animation to hide the tooltip after the provided delay in ms.
     * @param delay Amount of milliseconds to delay showing the tooltip.
     */
    hide(delay) {
        // Cancel the delayed show if it is scheduled
        if (this._showTimeoutId != null) {
            clearTimeout(this._showTimeoutId);
        }
        this._hideTimeoutId = setTimeout(() => {
            this._toggleVisibility(false);
            this._hideTimeoutId = undefined;
        }, delay);
    }
    /** Returns an observable that notifies when the tooltip has been hidden from view. */
    afterHidden() {
        return this._onHide;
    }
    /** Whether the tooltip is being displayed. */
    isVisible() {
        return this._isVisible;
    }
    ngOnDestroy() {
        this._cancelPendingAnimations();
        this._onHide.complete();
        this._triggerElement = null;
    }
    /**
     * Interactions on the HTML body should close the tooltip immediately as defined in the
     * material design spec.
     * https://material.io/design/components/tooltips.html#behavior
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
     */
    _markForCheck() {
        this._changeDetectorRef.markForCheck();
    }
    _handleMouseLeave({ relatedTarget }) {
        if (!relatedTarget || !this._triggerElement.contains(relatedTarget)) {
            if (this.isVisible()) {
                this.hide(this._mouseLeaveHideDelay);
            }
            else {
                this._finalizeAnimation(false);
            }
        }
    }
    /**
     * Callback for when the timeout in this.show() gets completed.
     * This method is only needed by the mdc-tooltip, and so it is only implemented
     * in the mdc-tooltip, not here.
     */
    _onShow() {
        this._isMultiline = this._isTooltipMultiline();
        this._markForCheck();
    }
    /** Whether the tooltip text has overflown to the next line */
    _isTooltipMultiline() {
        const rect = this._elementRef.nativeElement.getBoundingClientRect();
        return rect.height > MIN_HEIGHT && rect.width >= MAX_WIDTH;
    }
    /** Event listener dispatched when an animation on the tooltip finishes. */
    _handleAnimationEnd({ animationName }) {
        if (animationName === this._showAnimation || animationName === this._hideAnimation) {
            this._finalizeAnimation(animationName === this._showAnimation);
        }
    }
    /** Cancels any pending animation sequences. */
    _cancelPendingAnimations() {
        if (this._showTimeoutId != null) {
            clearTimeout(this._showTimeoutId);
        }
        if (this._hideTimeoutId != null) {
            clearTimeout(this._hideTimeoutId);
        }
        this._showTimeoutId = this._hideTimeoutId = undefined;
    }
    /** Handles the cleanup after an animation has finished. */
    _finalizeAnimation(toVisible) {
        if (toVisible) {
            this._closeOnInteraction = true;
        }
        else if (!this.isVisible()) {
            this._onHide.next();
        }
    }
    /** Toggles the visibility of the tooltip element. */
    _toggleVisibility(isVisible) {
        // We set the classes directly here ourselves so that toggling the tooltip state
        // isn't bound by change detection. This allows us to hide it even if the
        // view ref has been detached from the CD tree.
        const tooltip = this._tooltip.nativeElement;
        const showClass = this._showAnimation;
        const hideClass = this._hideAnimation;
        tooltip.classList.remove(isVisible ? hideClass : showClass);
        tooltip.classList.add(isVisible ? showClass : hideClass);
        if (this._isVisible !== isVisible) {
            this._isVisible = isVisible;
            this._changeDetectorRef.markForCheck();
        }
        // It's common for internal apps to disable animations using `* { animation: none !important }`
        // which can break the opening sequence. Try to detect such cases and work around them.
        if (isVisible && !this._animationsDisabled && typeof getComputedStyle === 'function') {
            const styles = getComputedStyle(tooltip);
            // Use `getPropertyValue` to avoid issues with property renaming.
            if (styles.getPropertyValue('animation-duration') === '0s' ||
                styles.getPropertyValue('animation-name') === 'none') {
                this._animationsDisabled = true;
            }
        }
        if (isVisible) {
            this._onShow();
        }
        if (this._animationsDisabled) {
            tooltip.classList.add('_mat-animation-noopable');
            this._finalizeAnimation(isVisible);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.0-rc.0", ngImport: i0, type: TooltipComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.0-rc.0", type: TooltipComponent, isStandalone: true, selector: "mat-tooltip-component", host: { attributes: { "aria-hidden": "true" }, listeners: { "mouseleave": "_handleMouseLeave($event)" } }, viewQueries: [{ propertyName: "_tooltip", first: true, predicate: ["tooltip"], descendants: true, static: true }], ngImport: i0, template: "<div\n  #tooltip\n  class=\"mdc-tooltip mat-mdc-tooltip\"\n  [ngClass]=\"tooltipClass\"\n  (animationend)=\"_handleAnimationEnd($event)\"\n  [class.mdc-tooltip--multiline]=\"_isMultiline\">\n  <div class=\"mat-mdc-tooltip-surface mdc-tooltip__surface\">{{message}}</div>\n</div>\n", styles: [".mat-mdc-tooltip{position:relative;transform:scale(0);display:inline-flex}.mat-mdc-tooltip::before{content:\"\";top:0;right:0;bottom:0;left:0;z-index:-1;position:absolute}.mat-mdc-tooltip-panel-below .mat-mdc-tooltip::before{top:-8px}.mat-mdc-tooltip-panel-above .mat-mdc-tooltip::before{bottom:-8px}.mat-mdc-tooltip-panel-right .mat-mdc-tooltip::before{left:-8px}.mat-mdc-tooltip-panel-left .mat-mdc-tooltip::before{right:-8px}.mat-mdc-tooltip._mat-animation-noopable{animation:none;transform:scale(1)}.mat-mdc-tooltip-surface{word-break:normal;overflow-wrap:anywhere;padding:4px 8px;min-width:40px;max-width:200px;min-height:24px;max-height:40vh;box-sizing:border-box;overflow:hidden;text-align:center;will-change:transform,opacity;background-color:var(--mdc-plain-tooltip-container-color, var(--mat-sys-inverse-surface));color:var(--mdc-plain-tooltip-supporting-text-color, var(--mat-sys-inverse-on-surface));border-radius:var(--mdc-plain-tooltip-container-shape, var(--mat-sys-corner-extra-small));font-family:var(--mdc-plain-tooltip-supporting-text-font, var(--mat-sys-body-small-font));font-size:var(--mdc-plain-tooltip-supporting-text-size, var(--mat-sys-body-small-size));font-weight:var(--mdc-plain-tooltip-supporting-text-weight, var(--mat-sys-body-small-weight));line-height:var(--mdc-plain-tooltip-supporting-text-line-height, var(--mat-sys-body-small-line-height));letter-spacing:var(--mdc-plain-tooltip-supporting-text-tracking, var(--mat-sys-body-small-tracking))}.mat-mdc-tooltip-surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}.mdc-tooltip--multiline .mat-mdc-tooltip-surface{text-align:left}[dir=rtl] .mdc-tooltip--multiline .mat-mdc-tooltip-surface{text-align:right}.mat-mdc-tooltip-panel{line-height:normal}.mat-mdc-tooltip-panel.mat-mdc-tooltip-panel-non-interactive{pointer-events:none}@keyframes mat-mdc-tooltip-show{0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}}@keyframes mat-mdc-tooltip-hide{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.8)}}.mat-mdc-tooltip-show{animation:mat-mdc-tooltip-show 150ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-mdc-tooltip-hide{animation:mat-mdc-tooltip-hide 75ms cubic-bezier(0.4, 0, 1, 1) forwards}"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.0-rc.0", ngImport: i0, type: TooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tooltip-component', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        '(mouseleave)': '_handleMouseLeave($event)',
                        'aria-hidden': 'true',
                    }, imports: [NgClass], template: "<div\n  #tooltip\n  class=\"mdc-tooltip mat-mdc-tooltip\"\n  [ngClass]=\"tooltipClass\"\n  (animationend)=\"_handleAnimationEnd($event)\"\n  [class.mdc-tooltip--multiline]=\"_isMultiline\">\n  <div class=\"mat-mdc-tooltip-surface mdc-tooltip__surface\">{{message}}</div>\n</div>\n", styles: [".mat-mdc-tooltip{position:relative;transform:scale(0);display:inline-flex}.mat-mdc-tooltip::before{content:\"\";top:0;right:0;bottom:0;left:0;z-index:-1;position:absolute}.mat-mdc-tooltip-panel-below .mat-mdc-tooltip::before{top:-8px}.mat-mdc-tooltip-panel-above .mat-mdc-tooltip::before{bottom:-8px}.mat-mdc-tooltip-panel-right .mat-mdc-tooltip::before{left:-8px}.mat-mdc-tooltip-panel-left .mat-mdc-tooltip::before{right:-8px}.mat-mdc-tooltip._mat-animation-noopable{animation:none;transform:scale(1)}.mat-mdc-tooltip-surface{word-break:normal;overflow-wrap:anywhere;padding:4px 8px;min-width:40px;max-width:200px;min-height:24px;max-height:40vh;box-sizing:border-box;overflow:hidden;text-align:center;will-change:transform,opacity;background-color:var(--mdc-plain-tooltip-container-color, var(--mat-sys-inverse-surface));color:var(--mdc-plain-tooltip-supporting-text-color, var(--mat-sys-inverse-on-surface));border-radius:var(--mdc-plain-tooltip-container-shape, var(--mat-sys-corner-extra-small));font-family:var(--mdc-plain-tooltip-supporting-text-font, var(--mat-sys-body-small-font));font-size:var(--mdc-plain-tooltip-supporting-text-size, var(--mat-sys-body-small-size));font-weight:var(--mdc-plain-tooltip-supporting-text-weight, var(--mat-sys-body-small-weight));line-height:var(--mdc-plain-tooltip-supporting-text-line-height, var(--mat-sys-body-small-line-height));letter-spacing:var(--mdc-plain-tooltip-supporting-text-tracking, var(--mat-sys-body-small-tracking))}.mat-mdc-tooltip-surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}.mdc-tooltip--multiline .mat-mdc-tooltip-surface{text-align:left}[dir=rtl] .mdc-tooltip--multiline .mat-mdc-tooltip-surface{text-align:right}.mat-mdc-tooltip-panel{line-height:normal}.mat-mdc-tooltip-panel.mat-mdc-tooltip-panel-non-interactive{pointer-events:none}@keyframes mat-mdc-tooltip-show{0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}}@keyframes mat-mdc-tooltip-hide{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.8)}}.mat-mdc-tooltip-show{animation:mat-mdc-tooltip-show 150ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-mdc-tooltip-hide{animation:mat-mdc-tooltip-hide 75ms cubic-bezier(0.4, 0, 1, 1) forwards}"] }]
        }], ctorParameters: () => [], propDecorators: { _tooltip: [{
                type: ViewChild,
                args: ['tooltip', {
                        // Use a static query here since we interact directly with
                        // the DOM which can happen before `ngAfterViewInit`.
                        static: true,
                    }]
            }] } });

/**
 * Animations used by MatTooltip.
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
const matTooltipAnimations = {
    /** Animation that transitions a tooltip in and out. */
    tooltipState: trigger('state', [
        // TODO(crisbeto): these values are based on MDC's CSS.
        // We should be able to use their styles directly once we land #19432.
        state('initial, void, hidden', style({ opacity: 0, transform: 'scale(0.8)' })),
        state('visible', style({ transform: 'scale(1)' })),
        transition('* => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
        transition('* => hidden', animate('75ms cubic-bezier(0.4, 0, 1, 1)')),
    ]),
};

class MatTooltipModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.0-rc.0", ngImport: i0, type: MatTooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.1.0-rc.0", ngImport: i0, type: MatTooltipModule, imports: [A11yModule, OverlayModule, MatCommonModule, MatTooltip, TooltipComponent], exports: [MatTooltip, TooltipComponent, MatCommonModule, CdkScrollableModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.1.0-rc.0", ngImport: i0, type: MatTooltipModule, providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [A11yModule, OverlayModule, MatCommonModule, MatCommonModule, CdkScrollableModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.0-rc.0", ngImport: i0, type: MatTooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [A11yModule, OverlayModule, MatCommonModule, MatTooltip, TooltipComponent],
                    exports: [MatTooltip, TooltipComponent, MatCommonModule, CdkScrollableModule],
                    providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MAT_TOOLTIP_DEFAULT_OPTIONS, MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY, MAT_TOOLTIP_SCROLL_STRATEGY, MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY, MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, MatTooltip, MatTooltipModule, SCROLL_THROTTLE_MS, TOOLTIP_PANEL_CLASS, TooltipComponent, getMatTooltipInvalidPositionError, matTooltipAnimations };
//# sourceMappingURL=tooltip.mjs.map
