/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { takeUntil } from 'rxjs/operators';
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, Inject, InjectionToken, Input, NgZone, Optional, ViewChild, ViewContainerRef, ViewEncapsulation, inject, ANIMATION_MODULE_TYPE, afterNextRender, Injector, } from '@angular/core';
import { DOCUMENT, NgClass } from '@angular/common';
import { normalizePassiveListenerOptions, Platform } from '@angular/cdk/platform';
import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay, ScrollDispatcher, } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/cdk/platform";
import * as i3 from "@angular/cdk/a11y";
import * as i4 from "@angular/cdk/bidi";
/** Time in ms to throttle repositioning after scroll events. */
export const SCROLL_THROTTLE_MS = 20;
/**
 * Creates an error to be thrown if the user supplied an invalid tooltip position.
 * @docs-private
 */
export function getMatTooltipInvalidPositionError(position) {
    return Error(`Tooltip position "${position}" is invalid.`);
}
/** Injection token that determines the scroll handling while a tooltip is visible. */
export const MAT_TOOLTIP_SCROLL_STRATEGY = new InjectionToken('mat-tooltip-scroll-strategy', {
    providedIn: 'root',
    factory: () => {
        const overlay = inject(Overlay);
        return () => overlay.scrollStrategies.reposition({ scrollThrottle: SCROLL_THROTTLE_MS });
    },
});
/** @docs-private */
export function MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition({ scrollThrottle: SCROLL_THROTTLE_MS });
}
/** @docs-private */
export const MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MAT_TOOLTIP_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY,
};
/** @docs-private */
export function MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY() {
    return {
        showDelay: 0,
        hideDelay: 0,
        touchendHideDelay: 1500,
    };
}
/** Injection token to be used to override the default options for `matTooltip`. */
export const MAT_TOOLTIP_DEFAULT_OPTIONS = new InjectionToken('mat-tooltip-default-options', {
    providedIn: 'root',
    factory: MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY,
});
/**
 * CSS class that will be attached to the overlay panel.
 * @deprecated
 * @breaking-change 13.0.0 remove this variable
 */
export const TOOLTIP_PANEL_CLASS = 'mat-mdc-tooltip-panel';
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
export class MatTooltip {
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
        this._disabled = coerceBooleanProperty(value);
        // If tooltip is disabled, hide immediately.
        if (this._disabled) {
            this.hide(0);
        }
        else {
            this._setupPointerEnterEventsIfNeeded();
        }
    }
    /** The default delay in ms before showing the tooltip after show is called */
    get showDelay() {
        return this._showDelay;
    }
    set showDelay(value) {
        this._showDelay = coerceNumberProperty(value);
    }
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
    /** The message to be displayed in the tooltip */
    get message() {
        return this._message;
    }
    set message(value) {
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this._message, 'tooltip');
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
            this._ngZone.runOutsideAngular(() => {
                // The `AriaDescriber` has some functionality that avoids adding a description if it's the
                // same as the `aria-label` of an element, however we can't know whether the tooltip trigger
                // has a data-bound `aria-label` or when it'll be set for the first time. We can avoid the
                // issue by deferring the description by a tick so Angular has time to set the `aria-label`.
                Promise.resolve().then(() => {
                    this._ariaDescriber.describe(this._elementRef.nativeElement, this.message, 'tooltip');
                });
            });
        }
    }
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
    constructor(_overlay, _elementRef, _scrollDispatcher, _viewContainerRef, _ngZone, _platform, _ariaDescriber, _focusMonitor, scrollStrategy, _dir, _defaultOptions, _document) {
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
        this._positionAtOrigin = false;
        this._disabled = false;
        this._viewInitialized = false;
        this._pointerExitEventsInitialized = false;
        this._tooltipComponent = TooltipComponent;
        this._viewportMargin = 8;
        this._cssClassPrefix = 'mat-mdc';
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
        this._passiveListeners = [];
        /** Emits when the component is destroyed. */
        this._destroyed = new Subject();
        this._injector = inject(Injector);
        this._scrollStrategy = scrollStrategy;
        this._document = _document;
        if (_defaultOptions) {
            this._showDelay = _defaultOptions.showDelay;
            this._hideDelay = _defaultOptions.hideDelay;
            if (_defaultOptions.position) {
                this.position = _defaultOptions.position;
            }
            if (_defaultOptions.positionAtOrigin) {
                this.positionAtOrigin = _defaultOptions.positionAtOrigin;
            }
            if (_defaultOptions.touchGestures) {
                this.touchGestures = _defaultOptions.touchGestures;
            }
        }
        _dir.change.pipe(takeUntil(this._destroyed)).subscribe(() => {
            if (this._overlayRef) {
                this._updatePosition(this._overlayRef);
            }
        });
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
        clearTimeout(this._touchstartTimeout);
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
                    clearTimeout(this._touchstartTimeout);
                    const DEFAULT_LONGPRESS_DELAY = 500;
                    this._touchstartTimeout = setTimeout(() => this.show(undefined, origin), this._defaultOptions.touchLongPressShowDelay ?? DEFAULT_LONGPRESS_DELAY);
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
                clearTimeout(this._touchstartTimeout);
                this.hide(this._defaultOptions.touchendHideDelay);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.0-next.3", ngImport: i0, type: MatTooltip, deps: [{ token: i1.Overlay }, { token: i0.ElementRef }, { token: i1.ScrollDispatcher }, { token: i0.ViewContainerRef }, { token: i0.NgZone }, { token: i2.Platform }, { token: i3.AriaDescriber }, { token: i3.FocusMonitor }, { token: MAT_TOOLTIP_SCROLL_STRATEGY }, { token: i4.Directionality }, { token: MAT_TOOLTIP_DEFAULT_OPTIONS, optional: true }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.1.0-next.3", type: MatTooltip, isStandalone: true, selector: "[matTooltip]", inputs: { position: ["matTooltipPosition", "position"], positionAtOrigin: ["matTooltipPositionAtOrigin", "positionAtOrigin"], disabled: ["matTooltipDisabled", "disabled"], showDelay: ["matTooltipShowDelay", "showDelay"], hideDelay: ["matTooltipHideDelay", "hideDelay"], touchGestures: ["matTooltipTouchGestures", "touchGestures"], message: ["matTooltip", "message"], tooltipClass: ["matTooltipClass", "tooltipClass"] }, host: { properties: { "class.mat-mdc-tooltip-disabled": "disabled" }, classAttribute: "mat-mdc-tooltip-trigger" }, exportAs: ["matTooltip"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.0-next.3", ngImport: i0, type: MatTooltip, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTooltip]',
                    exportAs: 'matTooltip',
                    host: {
                        'class': 'mat-mdc-tooltip-trigger',
                        '[class.mat-mdc-tooltip-disabled]': 'disabled',
                    },
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.Overlay }, { type: i0.ElementRef }, { type: i1.ScrollDispatcher }, { type: i0.ViewContainerRef }, { type: i0.NgZone }, { type: i2.Platform }, { type: i3.AriaDescriber }, { type: i3.FocusMonitor }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_TOOLTIP_SCROLL_STRATEGY]
                }] }, { type: i4.Directionality }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_TOOLTIP_DEFAULT_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }], propDecorators: { position: [{
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
export class TooltipComponent {
    constructor(_changeDetectorRef, _elementRef, animationMode) {
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        /* Whether the tooltip text overflows to multiple lines */
        this._isMultiline = false;
        /** Whether interactions on the page should close the tooltip */
        this._closeOnInteraction = false;
        /** Whether the tooltip is currently visible. */
        this._isVisible = false;
        /** Subject for notifying that the tooltip has been hidden from the view */
        this._onHide = new Subject();
        /** Name of the show animation and the class that toggles it. */
        this._showAnimation = 'mat-mdc-tooltip-show';
        /** Name of the hide animation and the class that toggles it. */
        this._hideAnimation = 'mat-mdc-tooltip-hide';
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.0-next.3", ngImport: i0, type: TooltipComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.0-next.3", type: TooltipComponent, isStandalone: true, selector: "mat-tooltip-component", host: { attributes: { "aria-hidden": "true" }, listeners: { "mouseleave": "_handleMouseLeave($event)" }, properties: { "style.zoom": "isVisible() ? 1 : null" } }, viewQueries: [{ propertyName: "_tooltip", first: true, predicate: ["tooltip"], descendants: true, static: true }], ngImport: i0, template: "<div\n  #tooltip\n  class=\"mdc-tooltip mat-mdc-tooltip\"\n  [ngClass]=\"tooltipClass\"\n  (animationend)=\"_handleAnimationEnd($event)\"\n  [class.mdc-tooltip--multiline]=\"_isMultiline\">\n  <div class=\"mat-mdc-tooltip-surface mdc-tooltip__surface\">{{message}}</div>\n</div>\n", styles: [".mat-mdc-tooltip{position:relative;transform:scale(0);display:inline-flex}.mat-mdc-tooltip::before{content:\"\";top:0;right:0;bottom:0;left:0;z-index:-1;position:absolute}.mat-mdc-tooltip-panel-below .mat-mdc-tooltip::before{top:-8px}.mat-mdc-tooltip-panel-above .mat-mdc-tooltip::before{bottom:-8px}.mat-mdc-tooltip-panel-right .mat-mdc-tooltip::before{left:-8px}.mat-mdc-tooltip-panel-left .mat-mdc-tooltip::before{right:-8px}.mat-mdc-tooltip._mat-animation-noopable{animation:none;transform:scale(1)}.mat-mdc-tooltip-surface{word-break:normal;overflow-wrap:anywhere;padding:4px 8px;min-width:40px;max-width:200px;min-height:24px;max-height:40vh;box-sizing:border-box;overflow:hidden;text-align:center;will-change:transform,opacity;background-color:var(--mdc-plain-tooltip-container-color);color:var(--mdc-plain-tooltip-supporting-text-color);border-radius:var(--mdc-plain-tooltip-container-shape);font-family:var(--mdc-plain-tooltip-supporting-text-font);font-size:var(--mdc-plain-tooltip-supporting-text-size);font-weight:var(--mdc-plain-tooltip-supporting-text-weight);line-height:var(--mdc-plain-tooltip-supporting-text-line-height);letter-spacing:var(--mdc-plain-tooltip-supporting-text-tracking)}.mat-mdc-tooltip-surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}.mdc-tooltip--multiline .mat-mdc-tooltip-surface{text-align:left}[dir=rtl] .mdc-tooltip--multiline .mat-mdc-tooltip-surface{text-align:right}.mat-mdc-tooltip-panel.mat-mdc-tooltip-panel-non-interactive{pointer-events:none}@keyframes mat-mdc-tooltip-show{0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}}@keyframes mat-mdc-tooltip-hide{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.8)}}.mat-mdc-tooltip-show{animation:mat-mdc-tooltip-show 150ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-mdc-tooltip-hide{animation:mat-mdc-tooltip-hide 75ms cubic-bezier(0.4, 0, 1, 1) forwards}"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.0-next.3", ngImport: i0, type: TooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tooltip-component', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        // Forces the element to have a layout in IE and Edge. This fixes issues where the element
                        // won't be rendered if the animations are disabled or there is no web animations polyfill.
                        '[style.zoom]': 'isVisible() ? 1 : null',
                        '(mouseleave)': '_handleMouseLeave($event)',
                        'aria-hidden': 'true',
                    }, standalone: true, imports: [NgClass], template: "<div\n  #tooltip\n  class=\"mdc-tooltip mat-mdc-tooltip\"\n  [ngClass]=\"tooltipClass\"\n  (animationend)=\"_handleAnimationEnd($event)\"\n  [class.mdc-tooltip--multiline]=\"_isMultiline\">\n  <div class=\"mat-mdc-tooltip-surface mdc-tooltip__surface\">{{message}}</div>\n</div>\n", styles: [".mat-mdc-tooltip{position:relative;transform:scale(0);display:inline-flex}.mat-mdc-tooltip::before{content:\"\";top:0;right:0;bottom:0;left:0;z-index:-1;position:absolute}.mat-mdc-tooltip-panel-below .mat-mdc-tooltip::before{top:-8px}.mat-mdc-tooltip-panel-above .mat-mdc-tooltip::before{bottom:-8px}.mat-mdc-tooltip-panel-right .mat-mdc-tooltip::before{left:-8px}.mat-mdc-tooltip-panel-left .mat-mdc-tooltip::before{right:-8px}.mat-mdc-tooltip._mat-animation-noopable{animation:none;transform:scale(1)}.mat-mdc-tooltip-surface{word-break:normal;overflow-wrap:anywhere;padding:4px 8px;min-width:40px;max-width:200px;min-height:24px;max-height:40vh;box-sizing:border-box;overflow:hidden;text-align:center;will-change:transform,opacity;background-color:var(--mdc-plain-tooltip-container-color);color:var(--mdc-plain-tooltip-supporting-text-color);border-radius:var(--mdc-plain-tooltip-container-shape);font-family:var(--mdc-plain-tooltip-supporting-text-font);font-size:var(--mdc-plain-tooltip-supporting-text-size);font-weight:var(--mdc-plain-tooltip-supporting-text-weight);line-height:var(--mdc-plain-tooltip-supporting-text-line-height);letter-spacing:var(--mdc-plain-tooltip-supporting-text-tracking)}.mat-mdc-tooltip-surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}.mdc-tooltip--multiline .mat-mdc-tooltip-surface{text-align:left}[dir=rtl] .mdc-tooltip--multiline .mat-mdc-tooltip-surface{text-align:right}.mat-mdc-tooltip-panel.mat-mdc-tooltip-panel-non-interactive{pointer-events:none}@keyframes mat-mdc-tooltip-show{0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}}@keyframes mat-mdc-tooltip-hide{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.8)}}.mat-mdc-tooltip-show{animation:mat-mdc-tooltip-show 150ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-mdc-tooltip-hide{animation:mat-mdc-tooltip-hide 75ms cubic-bezier(0.4, 0, 1, 1) forwards}"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }], propDecorators: { _tooltip: [{
                type: ViewChild,
                args: ['tooltip', {
                        // Use a static query here since we interact directly with
                        // the DOM which can happen before `ngAfterViewInit`.
                        static: true,
                    }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90b29sdGlwL3Rvb2x0aXAudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdG9vbHRpcC90b29sdGlwLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCxxQkFBcUIsRUFDckIsb0JBQW9CLEdBRXJCLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM3RCxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLE1BQU0sRUFDTixxQkFBcUIsRUFDckIsZUFBZSxFQUNmLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBQywrQkFBK0IsRUFBRSxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNoRixPQUFPLEVBQUMsYUFBYSxFQUFFLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzlELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBTUwsT0FBTyxFQUdQLGdCQUFnQixHQUdqQixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRCxPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDOzs7Ozs7QUFjekMsZ0VBQWdFO0FBQ2hFLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztBQUVyQzs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsaUNBQWlDLENBQUMsUUFBZ0I7SUFDaEUsT0FBTyxLQUFLLENBQUMscUJBQXFCLFFBQVEsZUFBZSxDQUFDLENBQUM7QUFDN0QsQ0FBQztBQUVELHNGQUFzRjtBQUN0RixNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRyxJQUFJLGNBQWMsQ0FDM0QsNkJBQTZCLEVBQzdCO0lBQ0UsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNaLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsRUFBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7Q0FDRixDQUNGLENBQUM7QUFFRixvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLG1DQUFtQyxDQUFDLE9BQWdCO0lBQ2xFLE9BQU8sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxFQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBQyxDQUFDLENBQUM7QUFDekYsQ0FBQztBQUVELG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSw0Q0FBNEMsR0FBRztJQUMxRCxPQUFPLEVBQUUsMkJBQTJCO0lBQ3BDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUNmLFVBQVUsRUFBRSxtQ0FBbUM7Q0FDaEQsQ0FBQztBQUVGLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsbUNBQW1DO0lBQ2pELE9BQU87UUFDTCxTQUFTLEVBQUUsQ0FBQztRQUNaLFNBQVMsRUFBRSxDQUFDO1FBQ1osaUJBQWlCLEVBQUUsSUFBSTtLQUN4QixDQUFDO0FBQ0osQ0FBQztBQUVELG1GQUFtRjtBQUNuRixNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRyxJQUFJLGNBQWMsQ0FDM0QsNkJBQTZCLEVBQzdCO0lBQ0UsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLG1DQUFtQztDQUM3QyxDQUNGLENBQUM7QUFnQ0Y7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHLHVCQUF1QixDQUFDO0FBRTNELE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQztBQUVwQyxvREFBb0Q7QUFDcEQsTUFBTSxzQkFBc0IsR0FBRywrQkFBK0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBRWhGLHlGQUF5RjtBQUN6RixrRkFBa0Y7QUFDbEYsTUFBTSw4QkFBOEIsR0FBRyxDQUFDLENBQUM7QUFDekMsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLENBQUM7QUFDL0IsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUV0Qjs7Ozs7R0FLRztBQVVILE1BQU0sT0FBTyxVQUFVO0lBaUJyQiwyRkFBMkY7SUFDM0YsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLFFBQVEsQ0FBQyxLQUFzQjtRQUNqQyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFFdkIsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3BDLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQ0ksZ0JBQWdCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJLGdCQUFnQixDQUFDLEtBQW1CO1FBQ3RDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDZixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDO0lBRUQsMkNBQTJDO0lBQzNDLElBQ0ksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSSxRQUFRLENBQUMsS0FBbUI7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU5Qyw0Q0FBNEM7UUFDNUMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNmLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxDQUFDLGdDQUFnQyxFQUFFLENBQUM7UUFDMUMsQ0FBQztJQUNILENBQUM7SUFFRCw4RUFBOEU7SUFDOUUsSUFDSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLFNBQVMsQ0FBQyxLQUFrQjtRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFJRCw2RUFBNkU7SUFDN0UsSUFDSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLFNBQVMsQ0FBQyxLQUFrQjtRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTlDLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDL0QsQ0FBQztJQUNILENBQUM7SUFvQkQsaURBQWlEO0lBQ2pELElBQ0ksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxPQUFPLENBQUMsS0FBZ0M7UUFDMUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRWhHLG9GQUFvRjtRQUNwRiwwRkFBMEY7UUFDMUYsaUZBQWlGO1FBQ2pGLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQztZQUMvQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsQ0FBQzthQUFNLENBQUM7WUFDTixJQUFJLENBQUMsZ0NBQWdDLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtnQkFDbEMsMEZBQTBGO2dCQUMxRiw0RkFBNEY7Z0JBQzVGLDBGQUEwRjtnQkFDMUYsNEZBQTRGO2dCQUM1RixPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDeEYsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBSUQsa0ZBQWtGO0lBQ2xGLElBQ0ksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBSSxZQUFZLENBQUMsS0FBNkQ7UUFDNUUsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzVDLENBQUM7SUFDSCxDQUFDO0lBaUJELFlBQ1UsUUFBaUIsRUFDakIsV0FBb0MsRUFDcEMsaUJBQW1DLEVBQ25DLGlCQUFtQyxFQUNuQyxPQUFlLEVBQ2YsU0FBbUIsRUFDbkIsY0FBNkIsRUFDN0IsYUFBMkIsRUFDRSxjQUFtQixFQUM5QyxJQUFvQixFQUd0QixlQUF5QyxFQUMvQixTQUFjO1FBYnhCLGFBQVEsR0FBUixRQUFRLENBQVM7UUFDakIsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ3BDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDbkMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNuQyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNuQixtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUM3QixrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUV6QixTQUFJLEdBQUosSUFBSSxDQUFnQjtRQUd0QixvQkFBZSxHQUFmLGVBQWUsQ0FBMEI7UUFwTDNDLGNBQVMsR0FBb0IsT0FBTyxDQUFDO1FBQ3JDLHNCQUFpQixHQUFZLEtBQUssQ0FBQztRQUNuQyxjQUFTLEdBQVksS0FBSyxDQUFDO1FBRzNCLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUN6QixrQ0FBNkIsR0FBRyxLQUFLLENBQUM7UUFDN0Isc0JBQWlCLEdBQUcsZ0JBQWdCLENBQUM7UUFDOUMsb0JBQWUsR0FBRyxDQUFDLENBQUM7UUFFWCxvQkFBZSxHQUFXLFNBQVMsQ0FBQztRQWdGckQ7Ozs7Ozs7Ozs7Ozs7V0FhRztRQUMrQixrQkFBYSxHQUF5QixNQUFNLENBQUM7UUFpQ3ZFLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFldEIsOENBQThDO1FBQzdCLHNCQUFpQixHQUNoQyxFQUFFLENBQUM7UUFRTCw2Q0FBNkM7UUFDNUIsZUFBVSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFMUMsY0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQWtCbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFFM0IsSUFBSSxlQUFlLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUM7WUFDNUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDO1lBRTVDLElBQUksZUFBZSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUM7WUFDM0MsQ0FBQztZQUVELElBQUksZUFBZSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQUM7WUFDM0QsQ0FBQztZQUVELElBQUksZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNsQyxJQUFJLENBQUMsYUFBYSxHQUFHLGVBQWUsQ0FBQyxhQUFhLENBQUM7WUFDckQsQ0FBQztRQUNILENBQUM7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUMxRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGVBQWUsR0FBRyw4QkFBOEIsQ0FBQztJQUN4RCxDQUFDO0lBRUQsZUFBZTtRQUNiLDJGQUEyRjtRQUMzRixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQzdCLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDO1FBRXhDLElBQUksQ0FBQyxhQUFhO2FBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDaEMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2xCLDZEQUE2RDtZQUM3RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7aUJBQU0sSUFBSSxNQUFNLEtBQUssVUFBVSxFQUFFLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7T0FFRztJQUNILFdBQVc7UUFDVCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztRQUVyRCxZQUFZLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFdEMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQy9CLENBQUM7UUFFRCxzREFBc0Q7UUFDdEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUU7WUFDbkQsYUFBYSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUM3RSxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBRWxDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUUzQixJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzlFLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxpR0FBaUc7SUFDakcsSUFBSSxDQUFDLFFBQWdCLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBK0I7UUFDbEUsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDO1lBQy9ELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSx3QkFBd0IsRUFBRSxDQUFDO1lBQ2xELE9BQU87UUFDVCxDQUFDO1FBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDZixJQUFJLENBQUMsT0FBTztZQUNWLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3RGLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BGLFFBQVEsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7UUFDMUQsUUFBUSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDaEQsUUFBUTthQUNMLFdBQVcsRUFBRTthQUNiLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ2hDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdCLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVELGlHQUFpRztJQUNqRyxJQUFJLENBQUMsUUFBZ0IsSUFBSSxDQUFDLFNBQVM7UUFDakMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBRXZDLElBQUksUUFBUSxFQUFFLENBQUM7WUFDYixJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDO2dCQUN6QixRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7aUJBQU0sQ0FBQztnQkFDTixRQUFRLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVELDhCQUE4QjtJQUM5QixNQUFNLENBQUMsTUFBK0I7UUFDcEMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELG1FQUFtRTtJQUNuRSxpQkFBaUI7UUFDZixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3RFLENBQUM7SUFFRCxzREFBc0Q7SUFDOUMsY0FBYyxDQUFDLE1BQStCO1FBQ3BELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3JCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7aUJBQ2xELGdCQUFxRCxDQUFDO1lBRXpELElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLGdCQUFnQixDQUFDLE9BQU8sWUFBWSxVQUFVLEVBQUUsQ0FBQztnQkFDMUYsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzFCLENBQUM7WUFFRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakIsQ0FBQztRQUVELE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLDJCQUEyQixDQUM1RSxJQUFJLENBQUMsV0FBVyxDQUNqQixDQUFDO1FBRUYsbUZBQW1GO1FBQ25GLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRO2FBQzNCLFFBQVEsRUFBRTthQUNWLG1CQUFtQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDMUYscUJBQXFCLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxVQUFVLENBQUM7YUFDekQsc0JBQXNCLENBQUMsS0FBSyxDQUFDO2FBQzdCLGtCQUFrQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7YUFDeEMsd0JBQXdCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUVqRCxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzNFLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFeEQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDMUIsSUFBSSxNQUFNLENBQUMsd0JBQXdCLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7b0JBQzFGLDZEQUE2RDtvQkFDN0QsOENBQThDO29CQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ3RDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNwQixnQkFBZ0IsRUFBRSxRQUFRO1lBQzFCLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLElBQUksV0FBVyxFQUFFO1lBQ3BELGNBQWMsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFO1NBQ3ZDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXZDLElBQUksQ0FBQyxXQUFXO2FBQ2IsV0FBVyxFQUFFO2FBQ2IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDaEMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRW5DLElBQUksQ0FBQyxXQUFXO2FBQ2Isb0JBQW9CLEVBQUU7YUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDaEMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxzQkFBc0IsRUFBRSxDQUFDLENBQUM7UUFFcEUsSUFBSSxDQUFDLFdBQVc7YUFDYixhQUFhLEVBQUU7YUFDZixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNoQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDakIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUNuRixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3ZCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVMLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSwyQkFBMkIsRUFBRSxDQUFDO1lBQ3RELElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsZ0NBQWdDLENBQUMsQ0FBQztRQUMxRixDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFRCwrQ0FBK0M7SUFDdkMsT0FBTztRQUNiLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7WUFDdkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM1QixDQUFDO1FBRUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztJQUMvQixDQUFDO0lBRUQsbURBQW1EO0lBQzNDLGVBQWUsQ0FBQyxVQUFzQjtRQUM1QyxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsZ0JBQXFELENBQUM7UUFDOUYsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2pDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBRTNDLFFBQVEsQ0FBQyxhQUFhLENBQUM7WUFDckIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDLFFBQVEsRUFBQyxDQUFDO1NBQzNELENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxrRkFBa0Y7SUFDeEUsVUFBVSxDQUFDLFFBQTJCO1FBQzlDLE1BQU0sTUFBTSxHQUFHLG9CQUFvQixDQUFDO1FBQ3BDLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUM7UUFFckQsSUFBSSxRQUFRLENBQUMsT0FBTyxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQy9CLFFBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDN0IsQ0FBQzthQUFNLElBQUksUUFBUSxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUN6QyxRQUFRLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUM1QixDQUFDO2FBQU0sSUFBSSxRQUFRLENBQUMsT0FBTyxLQUFLLE9BQU8sRUFBRSxDQUFDO1lBQ3hDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQzlDLENBQUM7YUFBTSxJQUFJLFFBQVEsQ0FBQyxPQUFPLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDdEMsUUFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDOUMsQ0FBQztRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxVQUFVO1FBQ1IsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQztRQUNyRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksY0FBd0MsQ0FBQztRQUU3QyxJQUFJLFFBQVEsSUFBSSxPQUFPLElBQUksUUFBUSxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQy9DLGNBQWMsR0FBRyxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFDLENBQUM7UUFDeEYsQ0FBQzthQUFNLElBQ0wsUUFBUSxJQUFJLFFBQVE7WUFDcEIsQ0FBQyxRQUFRLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQztZQUM3QixDQUFDLFFBQVEsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFDL0IsQ0FBQztZQUNELGNBQWMsR0FBRyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBQyxDQUFDO1FBQ3pELENBQUM7YUFBTSxJQUNMLFFBQVEsSUFBSSxPQUFPO1lBQ25CLENBQUMsUUFBUSxJQUFJLE9BQU8sSUFBSSxLQUFLLENBQUM7WUFDOUIsQ0FBQyxRQUFRLElBQUksTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQzlCLENBQUM7WUFDRCxjQUFjLEdBQUcsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUMsQ0FBQztRQUN2RCxDQUFDO2FBQU0sSUFBSSxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxFQUFFLENBQUM7WUFDekQsTUFBTSxpQ0FBaUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBRUQsTUFBTSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWUsQ0FBQyxPQUFPLEVBQUUsY0FBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXRGLE9BQU87WUFDTCxJQUFJLEVBQUUsY0FBZTtZQUNyQixRQUFRLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUM7U0FDbkMsQ0FBQztJQUNKLENBQUM7SUFFRCwwRkFBMEY7SUFDMUYsbUJBQW1CO1FBQ2pCLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUM7UUFDckQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLGVBQTBDLENBQUM7UUFFL0MsSUFBSSxRQUFRLElBQUksT0FBTyxFQUFFLENBQUM7WUFDeEIsZUFBZSxHQUFHLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUM7UUFDN0QsQ0FBQzthQUFNLElBQUksUUFBUSxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQy9CLGVBQWUsR0FBRyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQzFELENBQUM7YUFBTSxJQUNMLFFBQVEsSUFBSSxRQUFRO1lBQ3BCLENBQUMsUUFBUSxJQUFJLE1BQU0sSUFBSSxLQUFLLENBQUM7WUFDN0IsQ0FBQyxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQy9CLENBQUM7WUFDRCxlQUFlLEdBQUcsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsQ0FBQztRQUMxRCxDQUFDO2FBQU0sSUFDTCxRQUFRLElBQUksT0FBTztZQUNuQixDQUFDLFFBQVEsSUFBSSxPQUFPLElBQUksS0FBSyxDQUFDO1lBQzlCLENBQUMsUUFBUSxJQUFJLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUM5QixDQUFDO1lBQ0QsZUFBZSxHQUFHLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUM7UUFDNUQsQ0FBQzthQUFNLElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ3pELE1BQU0saUNBQWlDLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUVELE1BQU0sRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxlQUFnQixDQUFDLFFBQVEsRUFBRSxlQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTFGLE9BQU87WUFDTCxJQUFJLEVBQUUsZUFBZ0I7WUFDdEIsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFDO1NBQ3JDLENBQUM7SUFDSixDQUFDO0lBRUQsa0dBQWtHO0lBQzFGLHFCQUFxQjtRQUMzQiwwRkFBMEY7UUFDMUYsbUVBQW1FO1FBQ25FLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQzdDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUV0QyxlQUFlLENBQ2IsR0FBRyxFQUFFO2dCQUNILElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7b0JBQzFCLElBQUksQ0FBQyxXQUFZLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3JDLENBQUM7WUFDSCxDQUFDLEVBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTO2FBQ3pCLENBQ0YsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO0lBRUQsZ0NBQWdDO0lBQ3hCLGdCQUFnQixDQUFDLFlBQW9FO1FBQzNGLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7WUFDbEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3hDLENBQUM7SUFDSCxDQUFDO0lBRUQsbUNBQW1DO0lBQzNCLGVBQWUsQ0FBQyxDQUEwQixFQUFFLENBQXdCO1FBQzFFLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUUsQ0FBQztZQUMzRCxJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQztnQkFDaEIsQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUNmLENBQUM7aUJBQU0sSUFBSSxDQUFDLEtBQUssUUFBUSxFQUFFLENBQUM7Z0JBQzFCLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDWixDQUFDO1FBQ0gsQ0FBQzthQUFNLENBQUM7WUFDTixJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQztnQkFDaEIsQ0FBQyxHQUFHLE9BQU8sQ0FBQztZQUNkLENBQUM7aUJBQU0sSUFBSSxDQUFDLEtBQUssT0FBTyxFQUFFLENBQUM7Z0JBQ3pCLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDWixDQUFDO1FBQ0gsQ0FBQztRQUVELE9BQU8sRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVELDJGQUEyRjtJQUNuRiwyQkFBMkIsQ0FBQyxjQUFzQztRQUN4RSxNQUFNLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUMsR0FBRyxjQUFjLENBQUM7UUFDcEQsSUFBSSxXQUE0QixDQUFDO1FBRWpDLG9EQUFvRDtRQUNwRCw2Q0FBNkM7UUFDN0MsSUFBSSxRQUFRLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDMUIsbUVBQW1FO1lBQ25FLHNFQUFzRTtZQUN0RSxrRUFBa0U7WUFDbEUsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBRSxDQUFDO2dCQUMzQyxXQUFXLEdBQUcsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDckQsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLFdBQVcsR0FBRyxPQUFPLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN2RCxDQUFDO1FBQ0gsQ0FBQzthQUFNLENBQUM7WUFDTixXQUFXLEdBQUcsUUFBUSxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUMvRSxDQUFDO1FBRUQsSUFBSSxXQUFXLEtBQUssSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDMUMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUVwQyxJQUFJLFVBQVUsRUFBRSxDQUFDO2dCQUNmLE1BQU0sV0FBVyxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsSUFBSSxXQUFXLEdBQUcsQ0FBQztnQkFDOUQsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDakUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDLENBQUM7WUFDdEQsQ0FBQztZQUVELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxXQUFXLENBQUM7UUFDdEMsQ0FBQztJQUNILENBQUM7SUFFRCx1REFBdUQ7SUFDL0MsZ0NBQWdDO1FBQ3RDLDBGQUEwRjtRQUMxRixJQUNFLElBQUksQ0FBQyxTQUFTO1lBQ2QsQ0FBQyxJQUFJLENBQUMsT0FBTztZQUNiLENBQUMsSUFBSSxDQUFDLGdCQUFnQjtZQUN0QixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUM3QixDQUFDO1lBQ0QsT0FBTztRQUNULENBQUM7UUFFRCxzRkFBc0Y7UUFDdEYscUZBQXFGO1FBQ3JGLElBQUksSUFBSSxDQUFDLDRCQUE0QixFQUFFLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDO2dCQUMxQixZQUFZO2dCQUNaLEtBQUssQ0FBQyxFQUFFO29CQUNOLElBQUksQ0FBQywrQkFBK0IsRUFBRSxDQUFDO29CQUN2QyxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUM7b0JBQ3RCLElBQUssS0FBb0IsQ0FBQyxDQUFDLEtBQUssU0FBUyxJQUFLLEtBQW9CLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRSxDQUFDO3dCQUNuRixLQUFLLEdBQUcsS0FBbUIsQ0FBQztvQkFDOUIsQ0FBQztvQkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDOUIsQ0FBQzthQUNGLENBQUMsQ0FBQztRQUNMLENBQUM7YUFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDeEMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLENBQUM7WUFFekMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztnQkFDMUIsWUFBWTtnQkFDWixLQUFLLENBQUMsRUFBRTtvQkFDTixNQUFNLEtBQUssR0FBSSxLQUFvQixDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2RCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO29CQUN4RSxnRUFBZ0U7b0JBQ2hFLGtFQUFrRTtvQkFDbEUsSUFBSSxDQUFDLCtCQUErQixFQUFFLENBQUM7b0JBQ3ZDLFlBQVksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztvQkFFdEMsTUFBTSx1QkFBdUIsR0FBRyxHQUFHLENBQUM7b0JBQ3BDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLENBQ2xDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxFQUNsQyxJQUFJLENBQUMsZUFBZSxDQUFDLHVCQUF1QixJQUFJLHVCQUF1QixDQUN4RSxDQUFDO2dCQUNKLENBQUM7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRU8sK0JBQStCO1FBQ3JDLElBQUksSUFBSSxDQUFDLDZCQUE2QixFQUFFLENBQUM7WUFDdkMsT0FBTztRQUNULENBQUM7UUFDRCxJQUFJLENBQUMsNkJBQTZCLEdBQUcsSUFBSSxDQUFDO1FBRTFDLE1BQU0sYUFBYSxHQUE4RCxFQUFFLENBQUM7UUFDcEYsSUFBSSxJQUFJLENBQUMsNEJBQTRCLEVBQUUsRUFBRSxDQUFDO1lBQ3hDLGFBQWEsQ0FBQyxJQUFJLENBQ2hCO2dCQUNFLFlBQVk7Z0JBQ1osS0FBSyxDQUFDLEVBQUU7b0JBQ04sTUFBTSxTQUFTLEdBQUksS0FBb0IsQ0FBQyxhQUE0QixDQUFDO29CQUNyRSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7d0JBQ3hFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDZCxDQUFDO2dCQUNILENBQUM7YUFDRixFQUNELENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFtQixDQUFDLENBQUMsQ0FDN0QsQ0FBQztRQUNKLENBQUM7YUFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDeEMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLENBQUM7WUFDekMsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLEVBQUU7Z0JBQzVCLFlBQVksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUFDO1lBRUYsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUN4RixDQUFDO1FBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVPLGFBQWEsQ0FBQyxTQUFvRTtRQUN4RixTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixDQUFDLENBQUM7UUFDM0YsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sNEJBQTRCO1FBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0lBQ3hELENBQUM7SUFFRCxxREFBcUQ7SUFDN0MsY0FBYyxDQUFDLEtBQWlCO1FBQ3RDLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQztZQUM3QixNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUYsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7WUFFL0Msd0ZBQXdGO1lBQ3hGLHNGQUFzRjtZQUN0Rix3RkFBd0Y7WUFDeEYsMkJBQTJCO1lBQzNCLElBQUksbUJBQW1CLEtBQUssT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUM7Z0JBQzlFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVELDBGQUEwRjtJQUNsRixpQ0FBaUM7UUFDdkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUVwQyxJQUFJLFFBQVEsS0FBSyxLQUFLLEVBQUUsQ0FBQztZQUN2QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztZQUMvQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBRTVCLCtFQUErRTtZQUMvRSwrRUFBK0U7WUFDL0UsSUFBSSxRQUFRLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxVQUFVLENBQUMsRUFBRSxDQUFDO2dCQUMzRixLQUFLLENBQUMsVUFBVTtvQkFDYixLQUFhLENBQUMsWUFBWTt3QkFDM0IsS0FBSyxDQUFDLGdCQUFnQjs0QkFDckIsS0FBYSxDQUFDLGFBQWE7Z0NBQzFCLE1BQU0sQ0FBQztZQUNiLENBQUM7WUFFRCx3RUFBd0U7WUFDeEUsNEVBQTRFO1lBQzVFLElBQUksUUFBUSxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDM0MsS0FBYSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUM7WUFDekMsQ0FBQztZQUVELEtBQUssQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1lBQzFCLEtBQWEsQ0FBQyx1QkFBdUIsR0FBRyxhQUFhLENBQUM7UUFDekQsQ0FBQztJQUNILENBQUM7cUhBdHNCVSxVQUFVLDBPQXFMWCwyQkFBMkIsMkNBRzNCLDJCQUEyQiw2QkFFM0IsUUFBUTt5R0ExTFAsVUFBVTs7a0dBQVYsVUFBVTtrQkFUdEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUseUJBQXlCO3dCQUNsQyxrQ0FBa0MsRUFBRSxVQUFVO3FCQUMvQztvQkFDRCxVQUFVLEVBQUUsSUFBSTtpQkFDakI7OzBCQXNMSSxNQUFNOzJCQUFDLDJCQUEyQjs7MEJBRWxDLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMsMkJBQTJCOzswQkFFbEMsTUFBTTsyQkFBQyxRQUFRO3lDQXZLZCxRQUFRO3NCQURYLEtBQUs7dUJBQUMsb0JBQW9CO2dCQXNCdkIsZ0JBQWdCO3NCQURuQixLQUFLO3VCQUFDLDRCQUE0QjtnQkFhL0IsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLG9CQUFvQjtnQkFrQnZCLFNBQVM7c0JBRFosS0FBSzt1QkFBQyxxQkFBcUI7Z0JBYXhCLFNBQVM7c0JBRFosS0FBSzt1QkFBQyxxQkFBcUI7Z0JBNkJNLGFBQWE7c0JBQTlDLEtBQUs7dUJBQUMseUJBQXlCO2dCQUk1QixPQUFPO3NCQURWLEtBQUs7dUJBQUMsWUFBWTtnQkFrQ2YsWUFBWTtzQkFEZixLQUFLO3VCQUFDLGlCQUFpQjs7QUF3akIxQjs7O0dBR0c7QUFpQkgsTUFBTSxPQUFPLGdCQUFnQjtJQWdEM0IsWUFDVSxrQkFBcUMsRUFDbkMsV0FBb0MsRUFDSCxhQUFzQjtRQUZ6RCx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ25DLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQWpEaEQsMERBQTBEO1FBQzFELGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBK0JyQixnRUFBZ0U7UUFDeEQsd0JBQW1CLEdBQUcsS0FBSyxDQUFDO1FBRXBDLGdEQUFnRDtRQUN4QyxlQUFVLEdBQUcsS0FBSyxDQUFDO1FBRTNCLDJFQUEyRTtRQUMxRCxZQUFPLEdBQWtCLElBQUksT0FBTyxFQUFFLENBQUM7UUFFeEQsZ0VBQWdFO1FBQy9DLG1CQUFjLEdBQUcsc0JBQXNCLENBQUM7UUFFekQsZ0VBQWdFO1FBQy9DLG1CQUFjLEdBQUcsc0JBQXNCLENBQUM7UUFPdkQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGFBQWEsS0FBSyxnQkFBZ0IsQ0FBQztJQUNoRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSSxDQUFDLEtBQWE7UUFDaEIsNkNBQTZDO1FBQzdDLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNoQyxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxJQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDcEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO1FBQ2xDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNaLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLENBQUMsS0FBYTtRQUNoQiw2Q0FBNkM7UUFDN0MsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ2hDLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELElBQUksQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNwQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7UUFDbEMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ1osQ0FBQztJQUVELHNGQUFzRjtJQUN0RixXQUFXO1FBQ1QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCw4Q0FBOEM7SUFDOUMsU0FBUztRQUNQLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFLLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxzQkFBc0I7UUFDcEIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsQ0FBQztJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsYUFBYTtRQUNYLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsaUJBQWlCLENBQUMsRUFBQyxhQUFhLEVBQWE7UUFDM0MsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLGFBQXFCLENBQUMsRUFBRSxDQUFDO1lBQzVFLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDdkMsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQyxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ08sT0FBTztRQUNmLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCw4REFBOEQ7SUFDdEQsbUJBQW1CO1FBQ3pCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDcEUsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsMkVBQTJFO0lBQzNFLG1CQUFtQixDQUFDLEVBQUMsYUFBYSxFQUFpQjtRQUNqRCxJQUFJLGFBQWEsS0FBSyxJQUFJLENBQUMsY0FBYyxJQUFJLGFBQWEsS0FBSyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDbkYsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDakUsQ0FBQztJQUNILENBQUM7SUFFRCwrQ0FBK0M7SUFDL0Msd0JBQXdCO1FBQ3RCLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNoQyxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxFQUFFLENBQUM7WUFDaEMsWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBRUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsMkRBQTJEO0lBQ25ELGtCQUFrQixDQUFDLFNBQWtCO1FBQzNDLElBQUksU0FBUyxFQUFFLENBQUM7WUFDZCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1FBQ2xDLENBQUM7YUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QixDQUFDO0lBQ0gsQ0FBQztJQUVELHFEQUFxRDtJQUM3QyxpQkFBaUIsQ0FBQyxTQUFrQjtRQUMxQyxnRkFBZ0Y7UUFDaEYseUVBQXlFO1FBQ3pFLCtDQUErQztRQUMvQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQztRQUM1QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQ3RDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDdEMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVELE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6RCxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDbEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7WUFDNUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pDLENBQUM7UUFFRCwrRkFBK0Y7UUFDL0YsdUZBQXVGO1FBQ3ZGLElBQUksU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixJQUFJLE9BQU8sZ0JBQWdCLEtBQUssVUFBVSxFQUFFLENBQUM7WUFDckYsTUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFekMsaUVBQWlFO1lBQ2pFLElBQ0UsTUFBTSxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLEtBQUssSUFBSTtnQkFDdEQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLEtBQUssTUFBTSxFQUNwRCxDQUFDO2dCQUNELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7WUFDbEMsQ0FBQztRQUNILENBQUM7UUFFRCxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pCLENBQUM7UUFFRCxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7SUFDSCxDQUFDO3FIQXhOVSxnQkFBZ0IsNkVBbURMLHFCQUFxQjt5R0FuRGhDLGdCQUFnQix1V0N0NUI3QiwwUkFRQSxzaEVENDRCWSxPQUFPOztrR0FFTixnQkFBZ0I7a0JBaEI1QixTQUFTOytCQUNFLHVCQUF1QixpQkFHbEIsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxRQUN6Qzt3QkFDSiwwRkFBMEY7d0JBQzFGLDJGQUEyRjt3QkFDM0YsY0FBYyxFQUFFLHdCQUF3Qjt3QkFDeEMsY0FBYyxFQUFFLDJCQUEyQjt3QkFDM0MsYUFBYSxFQUFFLE1BQU07cUJBQ3RCLGNBQ1csSUFBSSxXQUNQLENBQUMsT0FBTyxDQUFDOzswQkFxRGYsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUI7eUNBcEIzQyxRQUFRO3NCQUxQLFNBQVM7dUJBQUMsU0FBUyxFQUFFO3dCQUNwQiwwREFBMEQ7d0JBQzFELHFEQUFxRDt3QkFDckQsTUFBTSxFQUFFLElBQUk7cUJBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1xuICBCb29sZWFuSW5wdXQsXG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIE51bWJlcklucHV0LFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFU0NBUEUsIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgaW5qZWN0LFxuICBBTklNQVRJT05fTU9EVUxFX1RZUEUsXG4gIGFmdGVyTmV4dFJlbmRlcixcbiAgSW5qZWN0b3IsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVCwgTmdDbGFzc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7bm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucywgUGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0FyaWFEZXNjcmliZXIsIEZvY3VzTW9uaXRvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtcbiAgQ29ubmVjdGVkUG9zaXRpb24sXG4gIENvbm5lY3Rpb25Qb3NpdGlvblBhaXIsXG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbiAgSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3MsXG4gIE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbixcbiAgT3ZlcmxheSxcbiAgT3ZlcmxheUNvbm5lY3Rpb25Qb3NpdGlvbixcbiAgT3ZlcmxheVJlZixcbiAgU2Nyb2xsRGlzcGF0Y2hlcixcbiAgU2Nyb2xsU3RyYXRlZ3ksXG4gIFZlcnRpY2FsQ29ubmVjdGlvblBvcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21wb25lbnRQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgYSB0b29sdGlwLiAqL1xuZXhwb3J0IHR5cGUgVG9vbHRpcFBvc2l0aW9uID0gJ2xlZnQnIHwgJ3JpZ2h0JyB8ICdhYm92ZScgfCAnYmVsb3cnIHwgJ2JlZm9yZScgfCAnYWZ0ZXInO1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGhvdyB0aGUgdG9vbHRpcCB0cmlnZ2VyIHNob3VsZCBoYW5kbGUgdG91Y2ggZ2VzdHVyZXMuXG4gKiBTZWUgYE1hdFRvb2x0aXAudG91Y2hHZXN0dXJlc2AgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCB0eXBlIFRvb2x0aXBUb3VjaEdlc3R1cmVzID0gJ2F1dG8nIHwgJ29uJyB8ICdvZmYnO1xuXG4vKiogUG9zc2libGUgdmlzaWJpbGl0eSBzdGF0ZXMgb2YgYSB0b29sdGlwLiAqL1xuZXhwb3J0IHR5cGUgVG9vbHRpcFZpc2liaWxpdHkgPSAnaW5pdGlhbCcgfCAndmlzaWJsZScgfCAnaGlkZGVuJztcblxuLyoqIFRpbWUgaW4gbXMgdG8gdGhyb3R0bGUgcmVwb3NpdGlvbmluZyBhZnRlciBzY3JvbGwgZXZlbnRzLiAqL1xuZXhwb3J0IGNvbnN0IFNDUk9MTF9USFJPVFRMRV9NUyA9IDIwO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gZXJyb3IgdG8gYmUgdGhyb3duIGlmIHRoZSB1c2VyIHN1cHBsaWVkIGFuIGludmFsaWQgdG9vbHRpcCBwb3NpdGlvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdFRvb2x0aXBJbnZhbGlkUG9zaXRpb25FcnJvcihwb3NpdGlvbjogc3RyaW5nKSB7XG4gIHJldHVybiBFcnJvcihgVG9vbHRpcCBwb3NpdGlvbiBcIiR7cG9zaXRpb259XCIgaXMgaW52YWxpZC5gKTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSBhIHRvb2x0aXAgaXMgdmlzaWJsZS4gKi9cbmV4cG9ydCBjb25zdCBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1kgPSBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KFxuICAnbWF0LXRvb2x0aXAtc2Nyb2xsLXN0cmF0ZWd5JyxcbiAge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiAoKSA9PiB7XG4gICAgICBjb25zdCBvdmVybGF5ID0gaW5qZWN0KE92ZXJsYXkpO1xuICAgICAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKHtzY3JvbGxUaHJvdHRsZTogU0NST0xMX1RIUk9UVExFX01TfSk7XG4gICAgfSxcbiAgfSxcbik7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKHtzY3JvbGxUaHJvdHRsZTogU0NST0xMX1RIUk9UVExFX01TfSk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWSxcbn07XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1RPT0xUSVBfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0VG9vbHRpcERlZmF1bHRPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICBzaG93RGVsYXk6IDAsXG4gICAgaGlkZURlbGF5OiAwLFxuICAgIHRvdWNoZW5kSGlkZURlbGF5OiAxNTAwLFxuICB9O1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdFRvb2x0aXBgLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9UT09MVElQX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRUb29sdGlwRGVmYXVsdE9wdGlvbnM+KFxuICAnbWF0LXRvb2x0aXAtZGVmYXVsdC1vcHRpb25zJyxcbiAge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiBNQVRfVE9PTFRJUF9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSxcbiAgfSxcbik7XG5cbi8qKiBEZWZhdWx0IGBtYXRUb29sdGlwYCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFRvb2x0aXBEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBEZWZhdWx0IGRlbGF5IHdoZW4gdGhlIHRvb2x0aXAgaXMgc2hvd24uICovXG4gIHNob3dEZWxheTogbnVtYmVyO1xuXG4gIC8qKiBEZWZhdWx0IGRlbGF5IHdoZW4gdGhlIHRvb2x0aXAgaXMgaGlkZGVuLiAqL1xuICBoaWRlRGVsYXk6IG51bWJlcjtcblxuICAvKiogRGVmYXVsdCBkZWxheSB3aGVuIGhpZGluZyB0aGUgdG9vbHRpcCBvbiBhIHRvdWNoIGRldmljZS4gKi9cbiAgdG91Y2hlbmRIaWRlRGVsYXk6IG51bWJlcjtcblxuICAvKiogVGltZSBiZXR3ZWVuIHRoZSB1c2VyIHB1dHRpbmcgdGhlIHBvaW50ZXIgb24gYSB0b29sdGlwIHRyaWdnZXIgYW5kIHRoZSBsb25nIHByZXNzIGV2ZW50IGJlaW5nIGZpcmVkIG9uIGEgdG91Y2ggZGV2aWNlLiAqL1xuICB0b3VjaExvbmdQcmVzc1Nob3dEZWxheT86IG51bWJlcjtcblxuICAvKiogRGVmYXVsdCB0b3VjaCBnZXN0dXJlIGhhbmRsaW5nIGZvciB0b29sdGlwcy4gKi9cbiAgdG91Y2hHZXN0dXJlcz86IFRvb2x0aXBUb3VjaEdlc3R1cmVzO1xuXG4gIC8qKiBEZWZhdWx0IHBvc2l0aW9uIGZvciB0b29sdGlwcy4gKi9cbiAgcG9zaXRpb24/OiBUb29sdGlwUG9zaXRpb247XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgdmFsdWUgZm9yIHdoZXRoZXIgdG9vbHRpcHMgc2hvdWxkIGJlIHBvc2l0aW9uZWQgbmVhciB0aGUgY2xpY2sgb3IgdG91Y2ggb3JpZ2luXG4gICAqIGluc3RlYWQgb2Ygb3V0c2lkZSB0aGUgZWxlbWVudCBib3VuZGluZyBib3guXG4gICAqL1xuICBwb3NpdGlvbkF0T3JpZ2luPzogYm9vbGVhbjtcblxuICAvKiogRGlzYWJsZXMgdGhlIGFiaWxpdHkgZm9yIHRoZSB1c2VyIHRvIGludGVyYWN0IHdpdGggdGhlIHRvb2x0aXAgZWxlbWVudC4gKi9cbiAgZGlzYWJsZVRvb2x0aXBJbnRlcmFjdGl2aXR5PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDU1MgY2xhc3MgdGhhdCB3aWxsIGJlIGF0dGFjaGVkIHRvIHRoZSBvdmVybGF5IHBhbmVsLlxuICogQGRlcHJlY2F0ZWRcbiAqIEBicmVha2luZy1jaGFuZ2UgMTMuMC4wIHJlbW92ZSB0aGlzIHZhcmlhYmxlXG4gKi9cbmV4cG9ydCBjb25zdCBUT09MVElQX1BBTkVMX0NMQVNTID0gJ21hdC1tZGMtdG9vbHRpcC1wYW5lbCc7XG5cbmNvbnN0IFBBTkVMX0NMQVNTID0gJ3Rvb2x0aXAtcGFuZWwnO1xuXG4vKiogT3B0aW9ucyB1c2VkIHRvIGJpbmQgcGFzc2l2ZSBldmVudCBsaXN0ZW5lcnMuICovXG5jb25zdCBwYXNzaXZlTGlzdGVuZXJPcHRpb25zID0gbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyh7cGFzc2l2ZTogdHJ1ZX0pO1xuXG4vLyBUaGVzZSBjb25zdGFudHMgd2VyZSB0YWtlbiBmcm9tIE1EQydzIGBudW1iZXJzYCBvYmplY3QuIFdlIGNhbid0IGltcG9ydCB0aGVtIGZyb20gTURDLFxuLy8gYmVjYXVzZSB0aGV5IGhhdmUgc29tZSB0b3AtbGV2ZWwgcmVmZXJlbmNlcyB0byBgd2luZG93YCB3aGljaCBicmVhayBkdXJpbmcgU1NSLlxuY29uc3QgTUlOX1ZJRVdQT1JUX1RPT0xUSVBfVEhSRVNIT0xEID0gODtcbmNvbnN0IFVOQk9VTkRFRF9BTkNIT1JfR0FQID0gODtcbmNvbnN0IE1JTl9IRUlHSFQgPSAyNDtcbmNvbnN0IE1BWF9XSURUSCA9IDIwMDtcblxuLyoqXG4gKiBEaXJlY3RpdmUgdGhhdCBhdHRhY2hlcyBhIG1hdGVyaWFsIGRlc2lnbiB0b29sdGlwIHRvIHRoZSBob3N0IGVsZW1lbnQuIEFuaW1hdGVzIHRoZSBzaG93aW5nIGFuZFxuICogaGlkaW5nIG9mIGEgdG9vbHRpcCBwcm92aWRlZCBwb3NpdGlvbiAoZGVmYXVsdHMgdG8gYmVsb3cgdGhlIGVsZW1lbnQpLlxuICpcbiAqIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbXBvbmVudHMvdG9vbHRpcHMuaHRtbFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VG9vbHRpcF0nLFxuICBleHBvcnRBczogJ21hdFRvb2x0aXAnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtdG9vbHRpcC10cmlnZ2VyJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtdG9vbHRpcC1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICB9LFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUb29sdGlwIGltcGxlbWVudHMgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYgfCBudWxsO1xuICBfdG9vbHRpcEluc3RhbmNlOiBUb29sdGlwQ29tcG9uZW50IHwgbnVsbDtcblxuICBwcml2YXRlIF9wb3J0YWw6IENvbXBvbmVudFBvcnRhbDxUb29sdGlwQ29tcG9uZW50PjtcbiAgcHJpdmF0ZSBfcG9zaXRpb246IFRvb2x0aXBQb3NpdGlvbiA9ICdiZWxvdyc7XG4gIHByaXZhdGUgX3Bvc2l0aW9uQXRPcmlnaW46IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfdG9vbHRpcENsYXNzOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+IHwge1trZXk6IHN0cmluZ106IGFueX07XG4gIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5OiAoKSA9PiBTY3JvbGxTdHJhdGVneTtcbiAgcHJpdmF0ZSBfdmlld0luaXRpYWxpemVkID0gZmFsc2U7XG4gIHByaXZhdGUgX3BvaW50ZXJFeGl0RXZlbnRzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSByZWFkb25seSBfdG9vbHRpcENvbXBvbmVudCA9IFRvb2x0aXBDb21wb25lbnQ7XG4gIHByaXZhdGUgX3ZpZXdwb3J0TWFyZ2luID0gODtcbiAgcHJpdmF0ZSBfY3VycmVudFBvc2l0aW9uOiBUb29sdGlwUG9zaXRpb247XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Nzc0NsYXNzUHJlZml4OiBzdHJpbmcgPSAnbWF0LW1kYyc7XG5cbiAgLyoqIEFsbG93cyB0aGUgdXNlciB0byBkZWZpbmUgdGhlIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQgZWxlbWVudCAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBQb3NpdGlvbicpXG4gIGdldCBwb3NpdGlvbigpOiBUb29sdGlwUG9zaXRpb24ge1xuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcbiAgfVxuXG4gIHNldCBwb3NpdGlvbih2YWx1ZTogVG9vbHRpcFBvc2l0aW9uKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9wb3NpdGlvbikge1xuICAgICAgdGhpcy5fcG9zaXRpb24gPSB2YWx1ZTtcblxuICAgICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24odGhpcy5fb3ZlcmxheVJlZik7XG4gICAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZT8uc2hvdygwKTtcbiAgICAgICAgdGhpcy5fb3ZlcmxheVJlZi51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvb2x0aXAgc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBjbGljayBvciB0b3VjaCBvcmlnaW5cbiAgICogaW5zdGVhZCBvZiBvdXRzaWRlIHRoZSBlbGVtZW50IGJvdW5kaW5nIGJveC5cbiAgICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcFBvc2l0aW9uQXRPcmlnaW4nKVxuICBnZXQgcG9zaXRpb25BdE9yaWdpbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb25BdE9yaWdpbjtcbiAgfVxuXG4gIHNldCBwb3NpdGlvbkF0T3JpZ2luKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9wb3NpdGlvbkF0T3JpZ2luID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLl9kZXRhY2goKTtcbiAgICB0aGlzLl9vdmVybGF5UmVmID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBEaXNhYmxlcyB0aGUgZGlzcGxheSBvZiB0aGUgdG9vbHRpcC4gKi9cbiAgQElucHV0KCdtYXRUb29sdGlwRGlzYWJsZWQnKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG5cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICAvLyBJZiB0b29sdGlwIGlzIGRpc2FibGVkLCBoaWRlIGltbWVkaWF0ZWx5LlxuICAgIGlmICh0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgdGhpcy5oaWRlKDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZXR1cFBvaW50ZXJFbnRlckV2ZW50c0lmTmVlZGVkKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSBkZWZhdWx0IGRlbGF5IGluIG1zIGJlZm9yZSBzaG93aW5nIHRoZSB0b29sdGlwIGFmdGVyIHNob3cgaXMgY2FsbGVkICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcFNob3dEZWxheScpXG4gIGdldCBzaG93RGVsYXkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvd0RlbGF5O1xuICB9XG5cbiAgc2V0IHNob3dEZWxheSh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9zaG93RGVsYXkgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIF9zaG93RGVsYXk6IG51bWJlcjtcblxuICAvKiogVGhlIGRlZmF1bHQgZGVsYXkgaW4gbXMgYmVmb3JlIGhpZGluZyB0aGUgdG9vbHRpcCBhZnRlciBoaWRlIGlzIGNhbGxlZCAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBIaWRlRGVsYXknKVxuICBnZXQgaGlkZURlbGF5KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2hpZGVEZWxheTtcbiAgfVxuXG4gIHNldCBoaWRlRGVsYXkodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5faGlkZURlbGF5ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLl9tb3VzZUxlYXZlSGlkZURlbGF5ID0gdGhpcy5faGlkZURlbGF5O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2hpZGVEZWxheTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBIb3cgdG91Y2ggZ2VzdHVyZXMgc2hvdWxkIGJlIGhhbmRsZWQgYnkgdGhlIHRvb2x0aXAuIE9uIHRvdWNoIGRldmljZXMgdGhlIHRvb2x0aXAgZGlyZWN0aXZlXG4gICAqIHVzZXMgYSBsb25nIHByZXNzIGdlc3R1cmUgdG8gc2hvdyBhbmQgaGlkZSwgaG93ZXZlciBpdCBjYW4gY29uZmxpY3Qgd2l0aCB0aGUgbmF0aXZlIGJyb3dzZXJcbiAgICogZ2VzdHVyZXMuIFRvIHdvcmsgYXJvdW5kIHRoZSBjb25mbGljdCwgQW5ndWxhciBNYXRlcmlhbCBkaXNhYmxlcyBuYXRpdmUgZ2VzdHVyZXMgb24gdGhlXG4gICAqIHRyaWdnZXIsIGJ1dCB0aGF0IG1pZ2h0IG5vdCBiZSBkZXNpcmFibGUgb24gcGFydGljdWxhciBlbGVtZW50cyAoZS5nLiBpbnB1dHMgYW5kIGRyYWdnYWJsZVxuICAgKiBlbGVtZW50cykuIFRoZSBkaWZmZXJlbnQgdmFsdWVzIGZvciB0aGlzIG9wdGlvbiBjb25maWd1cmUgdGhlIHRvdWNoIGV2ZW50IGhhbmRsaW5nIGFzIGZvbGxvd3M6XG4gICAqIC0gYGF1dG9gIC0gRW5hYmxlcyB0b3VjaCBnZXN0dXJlcyBmb3IgYWxsIGVsZW1lbnRzLCBidXQgdHJpZXMgdG8gYXZvaWQgY29uZmxpY3RzIHdpdGggbmF0aXZlXG4gICAqICAgYnJvd3NlciBnZXN0dXJlcyBvbiBwYXJ0aWN1bGFyIGVsZW1lbnRzLiBJbiBwYXJ0aWN1bGFyLCBpdCBhbGxvd3MgdGV4dCBzZWxlY3Rpb24gb24gaW5wdXRzXG4gICAqICAgYW5kIHRleHRhcmVhcywgYW5kIHByZXNlcnZlcyB0aGUgbmF0aXZlIGJyb3dzZXIgZHJhZ2dpbmcgb24gZWxlbWVudHMgbWFya2VkIGFzIGBkcmFnZ2FibGVgLlxuICAgKiAtIGBvbmAgLSBFbmFibGVzIHRvdWNoIGdlc3R1cmVzIGZvciBhbGwgZWxlbWVudHMgYW5kIGRpc2FibGVzIG5hdGl2ZVxuICAgKiAgIGJyb3dzZXIgZ2VzdHVyZXMgd2l0aCBubyBleGNlcHRpb25zLlxuICAgKiAtIGBvZmZgIC0gRGlzYWJsZXMgdG91Y2ggZ2VzdHVyZXMuIE5vdGUgdGhhdCB0aGlzIHdpbGwgcHJldmVudCB0aGUgdG9vbHRpcCBmcm9tXG4gICAqICAgc2hvd2luZyBvbiB0b3VjaCBkZXZpY2VzLlxuICAgKi9cbiAgQElucHV0KCdtYXRUb29sdGlwVG91Y2hHZXN0dXJlcycpIHRvdWNoR2VzdHVyZXM6IFRvb2x0aXBUb3VjaEdlc3R1cmVzID0gJ2F1dG8nO1xuXG4gIC8qKiBUaGUgbWVzc2FnZSB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIHRvb2x0aXAgKi9cbiAgQElucHV0KCdtYXRUb29sdGlwJylcbiAgZ2V0IG1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZTtcbiAgfVxuXG4gIHNldCBtZXNzYWdlKHZhbHVlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbih0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuX21lc3NhZ2UsICd0b29sdGlwJyk7XG5cbiAgICAvLyBJZiB0aGUgbWVzc2FnZSBpcyBub3QgYSBzdHJpbmcgKGUuZy4gbnVtYmVyKSwgY29udmVydCBpdCB0byBhIHN0cmluZyBhbmQgdHJpbSBpdC5cbiAgICAvLyBNdXN0IGNvbnZlcnQgd2l0aCBgU3RyaW5nKHZhbHVlKWAsIG5vdCBgJHt2YWx1ZX1gLCBvdGhlcndpc2UgQ2xvc3VyZSBDb21waWxlciBvcHRpbWlzZXNcbiAgICAvLyBhd2F5IHRoZSBzdHJpbmctY29udmVyc2lvbjogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMjA2ODRcbiAgICB0aGlzLl9tZXNzYWdlID0gdmFsdWUgIT0gbnVsbCA/IFN0cmluZyh2YWx1ZSkudHJpbSgpIDogJyc7XG5cbiAgICBpZiAoIXRoaXMuX21lc3NhZ2UgJiYgdGhpcy5faXNUb29sdGlwVmlzaWJsZSgpKSB7XG4gICAgICB0aGlzLmhpZGUoMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldHVwUG9pbnRlckVudGVyRXZlbnRzSWZOZWVkZWQoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVRvb2x0aXBNZXNzYWdlKCk7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAvLyBUaGUgYEFyaWFEZXNjcmliZXJgIGhhcyBzb21lIGZ1bmN0aW9uYWxpdHkgdGhhdCBhdm9pZHMgYWRkaW5nIGEgZGVzY3JpcHRpb24gaWYgaXQncyB0aGVcbiAgICAgICAgLy8gc2FtZSBhcyB0aGUgYGFyaWEtbGFiZWxgIG9mIGFuIGVsZW1lbnQsIGhvd2V2ZXIgd2UgY2FuJ3Qga25vdyB3aGV0aGVyIHRoZSB0b29sdGlwIHRyaWdnZXJcbiAgICAgICAgLy8gaGFzIGEgZGF0YS1ib3VuZCBgYXJpYS1sYWJlbGAgb3Igd2hlbiBpdCdsbCBiZSBzZXQgZm9yIHRoZSBmaXJzdCB0aW1lLiBXZSBjYW4gYXZvaWQgdGhlXG4gICAgICAgIC8vIGlzc3VlIGJ5IGRlZmVycmluZyB0aGUgZGVzY3JpcHRpb24gYnkgYSB0aWNrIHNvIEFuZ3VsYXIgaGFzIHRpbWUgdG8gc2V0IHRoZSBgYXJpYS1sYWJlbGAuXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2FyaWFEZXNjcmliZXIuZGVzY3JpYmUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLm1lc3NhZ2UsICd0b29sdGlwJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfbWVzc2FnZSA9ICcnO1xuXG4gIC8qKiBDbGFzc2VzIHRvIGJlIHBhc3NlZCB0byB0aGUgdG9vbHRpcC4gU3VwcG9ydHMgdGhlIHNhbWUgc3ludGF4IGFzIGBuZ0NsYXNzYC4gKi9cbiAgQElucHV0KCdtYXRUb29sdGlwQ2xhc3MnKVxuICBnZXQgdG9vbHRpcENsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLl90b29sdGlwQ2xhc3M7XG4gIH1cblxuICBzZXQgdG9vbHRpcENsYXNzKHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+IHwge1trZXk6IHN0cmluZ106IGFueX0pIHtcbiAgICB0aGlzLl90b29sdGlwQ2xhc3MgPSB2YWx1ZTtcbiAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICB0aGlzLl9zZXRUb29sdGlwQ2xhc3ModGhpcy5fdG9vbHRpcENsYXNzKTtcbiAgICB9XG4gIH1cblxuICAvKiogTWFudWFsbHktYm91bmQgcGFzc2l2ZSBldmVudCBsaXN0ZW5lcnMuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX3Bhc3NpdmVMaXN0ZW5lcnM6IChyZWFkb25seSBbc3RyaW5nLCBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0XSlbXSA9XG4gICAgW107XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCBkb2N1bWVudC4gKi9cbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKiBUaW1lciBzdGFydGVkIGF0IHRoZSBsYXN0IGB0b3VjaHN0YXJ0YCBldmVudC4gKi9cbiAgcHJpdmF0ZSBfdG91Y2hzdGFydFRpbWVvdXQ6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+O1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIHByaXZhdGUgX2luamVjdG9yID0gaW5qZWN0KEluamVjdG9yKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX3Njcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgcHJpdmF0ZSBfYXJpYURlc2NyaWJlcjogQXJpYURlc2NyaWJlcixcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBASW5qZWN0KE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBwcm90ZWN0ZWQgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KE1BVF9UT09MVElQX0RFRkFVTFRfT1BUSU9OUylcbiAgICBwcml2YXRlIF9kZWZhdWx0T3B0aW9uczogTWF0VG9vbHRpcERlZmF1bHRPcHRpb25zLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudDogYW55LFxuICApIHtcbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneSA9IHNjcm9sbFN0cmF0ZWd5O1xuICAgIHRoaXMuX2RvY3VtZW50ID0gX2RvY3VtZW50O1xuXG4gICAgaWYgKF9kZWZhdWx0T3B0aW9ucykge1xuICAgICAgdGhpcy5fc2hvd0RlbGF5ID0gX2RlZmF1bHRPcHRpb25zLnNob3dEZWxheTtcbiAgICAgIHRoaXMuX2hpZGVEZWxheSA9IF9kZWZhdWx0T3B0aW9ucy5oaWRlRGVsYXk7XG5cbiAgICAgIGlmIChfZGVmYXVsdE9wdGlvbnMucG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IF9kZWZhdWx0T3B0aW9ucy5wb3NpdGlvbjtcbiAgICAgIH1cblxuICAgICAgaWYgKF9kZWZhdWx0T3B0aW9ucy5wb3NpdGlvbkF0T3JpZ2luKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb25BdE9yaWdpbiA9IF9kZWZhdWx0T3B0aW9ucy5wb3NpdGlvbkF0T3JpZ2luO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2RlZmF1bHRPcHRpb25zLnRvdWNoR2VzdHVyZXMpIHtcbiAgICAgICAgdGhpcy50b3VjaEdlc3R1cmVzID0gX2RlZmF1bHRPcHRpb25zLnRvdWNoR2VzdHVyZXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2Rpci5jaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKHRoaXMuX292ZXJsYXlSZWYpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fdmlld3BvcnRNYXJnaW4gPSBNSU5fVklFV1BPUlRfVE9PTFRJUF9USFJFU0hPTEQ7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gVGhpcyBuZWVkcyB0byBoYXBwZW4gYWZ0ZXIgdmlldyBpbml0IHNvIHRoZSBpbml0aWFsIHZhbHVlcyBmb3IgYWxsIGlucHV0cyBoYXZlIGJlZW4gc2V0LlxuICAgIHRoaXMuX3ZpZXdJbml0aWFsaXplZCA9IHRydWU7XG4gICAgdGhpcy5fc2V0dXBQb2ludGVyRW50ZXJFdmVudHNJZk5lZWRlZCgpO1xuXG4gICAgdGhpcy5fZm9jdXNNb25pdG9yXG4gICAgICAubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKG9yaWdpbiA9PiB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCB0aGUgZm9jdXMgbW9uaXRvciBydW5zIG91dHNpZGUgdGhlIEFuZ3VsYXIgem9uZS5cbiAgICAgICAgaWYgKCFvcmlnaW4pIHtcbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMuaGlkZSgwKSk7XG4gICAgICAgIH0gZWxzZSBpZiAob3JpZ2luID09PSAna2V5Ym9hcmQnKSB7XG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLnNob3coKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3Bvc2UgdGhlIHRvb2x0aXAgd2hlbiBkZXN0cm95ZWQuXG4gICAqL1xuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RvdWNoc3RhcnRUaW1lb3V0KTtcblxuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ2xlYW4gdXAgdGhlIGV2ZW50IGxpc3RlbmVycyBzZXQgaW4gdGhlIGNvbnN0cnVjdG9yXG4gICAgdGhpcy5fcGFzc2l2ZUxpc3RlbmVycy5mb3JFYWNoKChbZXZlbnQsIGxpc3RlbmVyXSkgPT4ge1xuICAgICAgbmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgcGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyk7XG4gICAgfSk7XG4gICAgdGhpcy5fcGFzc2l2ZUxpc3RlbmVycy5sZW5ndGggPSAwO1xuXG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcblxuICAgIHRoaXMuX2FyaWFEZXNjcmliZXIucmVtb3ZlRGVzY3JpcHRpb24obmF0aXZlRWxlbWVudCwgdGhpcy5tZXNzYWdlLCAndG9vbHRpcCcpO1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyhuYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBTaG93cyB0aGUgdG9vbHRpcCBhZnRlciB0aGUgZGVsYXkgaW4gbXMsIGRlZmF1bHRzIHRvIHRvb2x0aXAtZGVsYXktc2hvdyBvciAwbXMgaWYgbm8gaW5wdXQgKi9cbiAgc2hvdyhkZWxheTogbnVtYmVyID0gdGhpcy5zaG93RGVsYXksIG9yaWdpbj86IHt4OiBudW1iZXI7IHk6IG51bWJlcn0pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5tZXNzYWdlIHx8IHRoaXMuX2lzVG9vbHRpcFZpc2libGUoKSkge1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlPy5fY2FuY2VsUGVuZGluZ0FuaW1hdGlvbnMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5fY3JlYXRlT3ZlcmxheShvcmlnaW4pO1xuICAgIHRoaXMuX2RldGFjaCgpO1xuICAgIHRoaXMuX3BvcnRhbCA9XG4gICAgICB0aGlzLl9wb3J0YWwgfHwgbmV3IENvbXBvbmVudFBvcnRhbCh0aGlzLl90b29sdGlwQ29tcG9uZW50LCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgICBjb25zdCBpbnN0YW5jZSA9ICh0aGlzLl90b29sdGlwSW5zdGFuY2UgPSBvdmVybGF5UmVmLmF0dGFjaCh0aGlzLl9wb3J0YWwpLmluc3RhbmNlKTtcbiAgICBpbnN0YW5jZS5fdHJpZ2dlckVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgaW5zdGFuY2UuX21vdXNlTGVhdmVIaWRlRGVsYXkgPSB0aGlzLl9oaWRlRGVsYXk7XG4gICAgaW5zdGFuY2VcbiAgICAgIC5hZnRlckhpZGRlbigpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fZGV0YWNoKCkpO1xuICAgIHRoaXMuX3NldFRvb2x0aXBDbGFzcyh0aGlzLl90b29sdGlwQ2xhc3MpO1xuICAgIHRoaXMuX3VwZGF0ZVRvb2x0aXBNZXNzYWdlKCk7XG4gICAgaW5zdGFuY2Uuc2hvdyhkZWxheSk7XG4gIH1cblxuICAvKiogSGlkZXMgdGhlIHRvb2x0aXAgYWZ0ZXIgdGhlIGRlbGF5IGluIG1zLCBkZWZhdWx0cyB0byB0b29sdGlwLWRlbGF5LWhpZGUgb3IgMG1zIGlmIG5vIGlucHV0ICovXG4gIGhpZGUoZGVsYXk6IG51bWJlciA9IHRoaXMuaGlkZURlbGF5KTogdm9pZCB7XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLl90b29sdGlwSW5zdGFuY2U7XG5cbiAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgIGlmIChpbnN0YW5jZS5pc1Zpc2libGUoKSkge1xuICAgICAgICBpbnN0YW5jZS5oaWRlKGRlbGF5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluc3RhbmNlLl9jYW5jZWxQZW5kaW5nQW5pbWF0aW9ucygpO1xuICAgICAgICB0aGlzLl9kZXRhY2goKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogU2hvd3MvaGlkZXMgdGhlIHRvb2x0aXAgKi9cbiAgdG9nZ2xlKG9yaWdpbj86IHt4OiBudW1iZXI7IHk6IG51bWJlcn0pOiB2b2lkIHtcbiAgICB0aGlzLl9pc1Rvb2x0aXBWaXNpYmxlKCkgPyB0aGlzLmhpZGUoKSA6IHRoaXMuc2hvdyh1bmRlZmluZWQsIG9yaWdpbik7XG4gIH1cblxuICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSB0b29sdGlwIGlzIGN1cnJlbnRseSB2aXNpYmxlIHRvIHRoZSB1c2VyICovXG4gIF9pc1Rvb2x0aXBWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuX3Rvb2x0aXBJbnN0YW5jZSAmJiB0aGlzLl90b29sdGlwSW5zdGFuY2UuaXNWaXNpYmxlKCk7XG4gIH1cblxuICAvKiogQ3JlYXRlIHRoZSBvdmVybGF5IGNvbmZpZyBhbmQgcG9zaXRpb24gc3RyYXRlZ3kgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlT3ZlcmxheShvcmlnaW4/OiB7eDogbnVtYmVyOyB5OiBudW1iZXJ9KTogT3ZlcmxheVJlZiB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nU3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5UmVmLmdldENvbmZpZygpXG4gICAgICAgIC5wb3NpdGlvblN0cmF0ZWd5IGFzIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneTtcblxuICAgICAgaWYgKCghdGhpcy5wb3NpdGlvbkF0T3JpZ2luIHx8ICFvcmlnaW4pICYmIGV4aXN0aW5nU3RyYXRlZ3kuX29yaWdpbiBpbnN0YW5jZW9mIEVsZW1lbnRSZWYpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWY7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2RldGFjaCgpO1xuICAgIH1cblxuICAgIGNvbnN0IHNjcm9sbGFibGVBbmNlc3RvcnMgPSB0aGlzLl9zY3JvbGxEaXNwYXRjaGVyLmdldEFuY2VzdG9yU2Nyb2xsQ29udGFpbmVycyhcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYsXG4gICAgKTtcblxuICAgIC8vIENyZWF0ZSBjb25uZWN0ZWQgcG9zaXRpb24gc3RyYXRlZ3kgdGhhdCBsaXN0ZW5zIGZvciBzY3JvbGwgZXZlbnRzIHRvIHJlcG9zaXRpb24uXG4gICAgY29uc3Qgc3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5XG4gICAgICAucG9zaXRpb24oKVxuICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5wb3NpdGlvbkF0T3JpZ2luID8gb3JpZ2luIHx8IHRoaXMuX2VsZW1lbnRSZWYgOiB0aGlzLl9lbGVtZW50UmVmKVxuICAgICAgLndpdGhUcmFuc2Zvcm1PcmlnaW5PbihgLiR7dGhpcy5fY3NzQ2xhc3NQcmVmaXh9LXRvb2x0aXBgKVxuICAgICAgLndpdGhGbGV4aWJsZURpbWVuc2lvbnMoZmFsc2UpXG4gICAgICAud2l0aFZpZXdwb3J0TWFyZ2luKHRoaXMuX3ZpZXdwb3J0TWFyZ2luKVxuICAgICAgLndpdGhTY3JvbGxhYmxlQ29udGFpbmVycyhzY3JvbGxhYmxlQW5jZXN0b3JzKTtcblxuICAgIHN0cmF0ZWd5LnBvc2l0aW9uQ2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoY2hhbmdlID0+IHtcbiAgICAgIHRoaXMuX3VwZGF0ZUN1cnJlbnRQb3NpdGlvbkNsYXNzKGNoYW5nZS5jb25uZWN0aW9uUGFpcik7XG5cbiAgICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgICAgaWYgKGNoYW5nZS5zY3JvbGxhYmxlVmlld1Byb3BlcnRpZXMuaXNPdmVybGF5Q2xpcHBlZCAmJiB0aGlzLl90b29sdGlwSW5zdGFuY2UuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgICAvLyBBZnRlciBwb3NpdGlvbiBjaGFuZ2VzIG9jY3VyIGFuZCB0aGUgb3ZlcmxheSBpcyBjbGlwcGVkIGJ5XG4gICAgICAgICAgLy8gYSBwYXJlbnQgc2Nyb2xsYWJsZSB0aGVuIGNsb3NlIHRoZSB0b29sdGlwLlxuICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5oaWRlKDApKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKHtcbiAgICAgIGRpcmVjdGlvbjogdGhpcy5fZGlyLFxuICAgICAgcG9zaXRpb25TdHJhdGVneTogc3RyYXRlZ3ksXG4gICAgICBwYW5lbENsYXNzOiBgJHt0aGlzLl9jc3NDbGFzc1ByZWZpeH0tJHtQQU5FTF9DTEFTU31gLFxuICAgICAgc2Nyb2xsU3RyYXRlZ3k6IHRoaXMuX3Njcm9sbFN0cmF0ZWd5KCksXG4gICAgfSk7XG5cbiAgICB0aGlzLl91cGRhdGVQb3NpdGlvbih0aGlzLl9vdmVybGF5UmVmKTtcblxuICAgIHRoaXMuX292ZXJsYXlSZWZcbiAgICAgIC5kZXRhY2htZW50cygpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fZGV0YWNoKCkpO1xuXG4gICAgdGhpcy5fb3ZlcmxheVJlZlxuICAgICAgLm91dHNpZGVQb2ludGVyRXZlbnRzKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl90b29sdGlwSW5zdGFuY2U/Ll9oYW5kbGVCb2R5SW50ZXJhY3Rpb24oKSk7XG5cbiAgICB0aGlzLl9vdmVybGF5UmVmXG4gICAgICAua2V5ZG93bkV2ZW50cygpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICBpZiAodGhpcy5faXNUb29sdGlwVmlzaWJsZSgpICYmIGV2ZW50LmtleUNvZGUgPT09IEVTQ0FQRSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMuaGlkZSgwKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX2RlZmF1bHRPcHRpb25zPy5kaXNhYmxlVG9vbHRpcEludGVyYWN0aXZpdHkpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuYWRkUGFuZWxDbGFzcyhgJHt0aGlzLl9jc3NDbGFzc1ByZWZpeH0tdG9vbHRpcC1wYW5lbC1ub24taW50ZXJhY3RpdmVgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVJlZjtcbiAgfVxuXG4gIC8qKiBEZXRhY2hlcyB0aGUgY3VycmVudGx5LWF0dGFjaGVkIHRvb2x0aXAuICovXG4gIHByaXZhdGUgX2RldGFjaCgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZiAmJiB0aGlzLl9vdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNoKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgY3VycmVudCB0b29sdGlwLiAqL1xuICBwcml2YXRlIF91cGRhdGVQb3NpdGlvbihvdmVybGF5UmVmOiBPdmVybGF5UmVmKSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSBvdmVybGF5UmVmLmdldENvbmZpZygpLnBvc2l0aW9uU3RyYXRlZ3kgYXMgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5O1xuICAgIGNvbnN0IG9yaWdpbiA9IHRoaXMuX2dldE9yaWdpbigpO1xuICAgIGNvbnN0IG92ZXJsYXkgPSB0aGlzLl9nZXRPdmVybGF5UG9zaXRpb24oKTtcblxuICAgIHBvc2l0aW9uLndpdGhQb3NpdGlvbnMoW1xuICAgICAgdGhpcy5fYWRkT2Zmc2V0KHsuLi5vcmlnaW4ubWFpbiwgLi4ub3ZlcmxheS5tYWlufSksXG4gICAgICB0aGlzLl9hZGRPZmZzZXQoey4uLm9yaWdpbi5mYWxsYmFjaywgLi4ub3ZlcmxheS5mYWxsYmFja30pLFxuICAgIF0pO1xuICB9XG5cbiAgLyoqIEFkZHMgdGhlIGNvbmZpZ3VyZWQgb2Zmc2V0IHRvIGEgcG9zaXRpb24uIFVzZWQgYXMgYSBob29rIGZvciBjaGlsZCBjbGFzc2VzLiAqL1xuICBwcm90ZWN0ZWQgX2FkZE9mZnNldChwb3NpdGlvbjogQ29ubmVjdGVkUG9zaXRpb24pOiBDb25uZWN0ZWRQb3NpdGlvbiB7XG4gICAgY29uc3Qgb2Zmc2V0ID0gVU5CT1VOREVEX0FOQ0hPUl9HQVA7XG4gICAgY29uc3QgaXNMdHIgPSAhdGhpcy5fZGlyIHx8IHRoaXMuX2Rpci52YWx1ZSA9PSAnbHRyJztcblxuICAgIGlmIChwb3NpdGlvbi5vcmlnaW5ZID09PSAndG9wJykge1xuICAgICAgcG9zaXRpb24ub2Zmc2V0WSA9IC1vZmZzZXQ7XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvbi5vcmlnaW5ZID09PSAnYm90dG9tJykge1xuICAgICAgcG9zaXRpb24ub2Zmc2V0WSA9IG9mZnNldDtcbiAgICB9IGVsc2UgaWYgKHBvc2l0aW9uLm9yaWdpblggPT09ICdzdGFydCcpIHtcbiAgICAgIHBvc2l0aW9uLm9mZnNldFggPSBpc0x0ciA/IC1vZmZzZXQgOiBvZmZzZXQ7XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvbi5vcmlnaW5YID09PSAnZW5kJykge1xuICAgICAgcG9zaXRpb24ub2Zmc2V0WCA9IGlzTHRyID8gb2Zmc2V0IDogLW9mZnNldDtcbiAgICB9XG5cbiAgICByZXR1cm4gcG9zaXRpb247XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgb3JpZ2luIHBvc2l0aW9uIGFuZCBhIGZhbGxiYWNrIHBvc2l0aW9uIGJhc2VkIG9uIHRoZSB1c2VyJ3MgcG9zaXRpb24gcHJlZmVyZW5jZS5cbiAgICogVGhlIGZhbGxiYWNrIHBvc2l0aW9uIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBvcmlnaW4gKGUuZy4gYCdiZWxvdycgLT4gJ2Fib3ZlJ2ApLlxuICAgKi9cbiAgX2dldE9yaWdpbigpOiB7bWFpbjogT3JpZ2luQ29ubmVjdGlvblBvc2l0aW9uOyBmYWxsYmFjazogT3JpZ2luQ29ubmVjdGlvblBvc2l0aW9ufSB7XG4gICAgY29uc3QgaXNMdHIgPSAhdGhpcy5fZGlyIHx8IHRoaXMuX2Rpci52YWx1ZSA9PSAnbHRyJztcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb247XG4gICAgbGV0IG9yaWdpblBvc2l0aW9uOiBPcmlnaW5Db25uZWN0aW9uUG9zaXRpb247XG5cbiAgICBpZiAocG9zaXRpb24gPT0gJ2Fib3ZlJyB8fCBwb3NpdGlvbiA9PSAnYmVsb3cnKSB7XG4gICAgICBvcmlnaW5Qb3NpdGlvbiA9IHtvcmlnaW5YOiAnY2VudGVyJywgb3JpZ2luWTogcG9zaXRpb24gPT0gJ2Fib3ZlJyA/ICd0b3AnIDogJ2JvdHRvbSd9O1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBwb3NpdGlvbiA9PSAnYmVmb3JlJyB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiBpc0x0cikgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmICFpc0x0cilcbiAgICApIHtcbiAgICAgIG9yaWdpblBvc2l0aW9uID0ge29yaWdpblg6ICdzdGFydCcsIG9yaWdpblk6ICdjZW50ZXInfTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgcG9zaXRpb24gPT0gJ2FmdGVyJyB8fFxuICAgICAgKHBvc2l0aW9uID09ICdyaWdodCcgJiYgaXNMdHIpIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ2xlZnQnICYmICFpc0x0cilcbiAgICApIHtcbiAgICAgIG9yaWdpblBvc2l0aW9uID0ge29yaWdpblg6ICdlbmQnLCBvcmlnaW5ZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIHRocm93IGdldE1hdFRvb2x0aXBJbnZhbGlkUG9zaXRpb25FcnJvcihwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgY29uc3Qge3gsIHl9ID0gdGhpcy5faW52ZXJ0UG9zaXRpb24ob3JpZ2luUG9zaXRpb24hLm9yaWdpblgsIG9yaWdpblBvc2l0aW9uIS5vcmlnaW5ZKTtcblxuICAgIHJldHVybiB7XG4gICAgICBtYWluOiBvcmlnaW5Qb3NpdGlvbiEsXG4gICAgICBmYWxsYmFjazoge29yaWdpblg6IHgsIG9yaWdpblk6IHl9LFxuICAgIH07XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgb3ZlcmxheSBwb3NpdGlvbiBhbmQgYSBmYWxsYmFjayBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgdXNlcidzIHByZWZlcmVuY2UgKi9cbiAgX2dldE92ZXJsYXlQb3NpdGlvbigpOiB7bWFpbjogT3ZlcmxheUNvbm5lY3Rpb25Qb3NpdGlvbjsgZmFsbGJhY2s6IE92ZXJsYXlDb25uZWN0aW9uUG9zaXRpb259IHtcbiAgICBjb25zdCBpc0x0ciA9ICF0aGlzLl9kaXIgfHwgdGhpcy5fZGlyLnZhbHVlID09ICdsdHInO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcbiAgICBsZXQgb3ZlcmxheVBvc2l0aW9uOiBPdmVybGF5Q29ubmVjdGlvblBvc2l0aW9uO1xuXG4gICAgaWYgKHBvc2l0aW9uID09ICdhYm92ZScpIHtcbiAgICAgIG92ZXJsYXlQb3NpdGlvbiA9IHtvdmVybGF5WDogJ2NlbnRlcicsIG92ZXJsYXlZOiAnYm90dG9tJ307XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvbiA9PSAnYmVsb3cnKSB7XG4gICAgICBvdmVybGF5UG9zaXRpb24gPSB7b3ZlcmxheVg6ICdjZW50ZXInLCBvdmVybGF5WTogJ3RvcCd9O1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBwb3NpdGlvbiA9PSAnYmVmb3JlJyB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiBpc0x0cikgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmICFpc0x0cilcbiAgICApIHtcbiAgICAgIG92ZXJsYXlQb3NpdGlvbiA9IHtvdmVybGF5WDogJ2VuZCcsIG92ZXJsYXlZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBvc2l0aW9uID09ICdhZnRlcicgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmIGlzTHRyKSB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiAhaXNMdHIpXG4gICAgKSB7XG4gICAgICBvdmVybGF5UG9zaXRpb24gPSB7b3ZlcmxheVg6ICdzdGFydCcsIG92ZXJsYXlZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIHRocm93IGdldE1hdFRvb2x0aXBJbnZhbGlkUG9zaXRpb25FcnJvcihwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgY29uc3Qge3gsIHl9ID0gdGhpcy5faW52ZXJ0UG9zaXRpb24ob3ZlcmxheVBvc2l0aW9uIS5vdmVybGF5WCwgb3ZlcmxheVBvc2l0aW9uIS5vdmVybGF5WSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbWFpbjogb3ZlcmxheVBvc2l0aW9uISxcbiAgICAgIGZhbGxiYWNrOiB7b3ZlcmxheVg6IHgsIG92ZXJsYXlZOiB5fSxcbiAgICB9O1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHRvb2x0aXAgbWVzc2FnZSBhbmQgcmVwb3NpdGlvbnMgdGhlIG92ZXJsYXkgYWNjb3JkaW5nIHRvIHRoZSBuZXcgbWVzc2FnZSBsZW5ndGggKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVG9vbHRpcE1lc3NhZ2UoKSB7XG4gICAgLy8gTXVzdCB3YWl0IGZvciB0aGUgbWVzc2FnZSB0byBiZSBwYWludGVkIHRvIHRoZSB0b29sdGlwIHNvIHRoYXQgdGhlIG92ZXJsYXkgY2FuIHByb3Blcmx5XG4gICAgLy8gY2FsY3VsYXRlIHRoZSBjb3JyZWN0IHBvc2l0aW9uaW5nIGJhc2VkIG9uIHRoZSBzaXplIG9mIHRoZSB0ZXh0LlxuICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5tZXNzYWdlID0gdGhpcy5tZXNzYWdlO1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLl9tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgYWZ0ZXJOZXh0UmVuZGVyKFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpbmplY3RvcjogdGhpcy5faW5qZWN0b3IsXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSB0b29sdGlwIGNsYXNzICovXG4gIHByaXZhdGUgX3NldFRvb2x0aXBDbGFzcyh0b29sdGlwQ2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz4gfCB7W2tleTogc3RyaW5nXTogYW55fSkge1xuICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS50b29sdGlwQ2xhc3MgPSB0b29sdGlwQ2xhc3M7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UuX21hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJbnZlcnRzIGFuIG92ZXJsYXkgcG9zaXRpb24uICovXG4gIHByaXZhdGUgX2ludmVydFBvc2l0aW9uKHg6IEhvcml6b250YWxDb25uZWN0aW9uUG9zLCB5OiBWZXJ0aWNhbENvbm5lY3Rpb25Qb3MpIHtcbiAgICBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ2Fib3ZlJyB8fCB0aGlzLnBvc2l0aW9uID09PSAnYmVsb3cnKSB7XG4gICAgICBpZiAoeSA9PT0gJ3RvcCcpIHtcbiAgICAgICAgeSA9ICdib3R0b20nO1xuICAgICAgfSBlbHNlIGlmICh5ID09PSAnYm90dG9tJykge1xuICAgICAgICB5ID0gJ3RvcCc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh4ID09PSAnZW5kJykge1xuICAgICAgICB4ID0gJ3N0YXJ0JztcbiAgICAgIH0gZWxzZSBpZiAoeCA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICB4ID0gJ2VuZCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHt4LCB5fTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBjbGFzcyBvbiB0aGUgb3ZlcmxheSBwYW5lbCBiYXNlZCBvbiB0aGUgY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgdG9vbHRpcC4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlQ3VycmVudFBvc2l0aW9uQ2xhc3MoY29ubmVjdGlvblBhaXI6IENvbm5lY3Rpb25Qb3NpdGlvblBhaXIpOiB2b2lkIHtcbiAgICBjb25zdCB7b3ZlcmxheVksIG9yaWdpblgsIG9yaWdpbll9ID0gY29ubmVjdGlvblBhaXI7XG4gICAgbGV0IG5ld1Bvc2l0aW9uOiBUb29sdGlwUG9zaXRpb247XG5cbiAgICAvLyBJZiB0aGUgb3ZlcmxheSBpcyBpbiB0aGUgbWlkZGxlIGFsb25nIHRoZSBZIGF4aXMsXG4gICAgLy8gaXQgbWVhbnMgdGhhdCBpdCdzIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIuXG4gICAgaWYgKG92ZXJsYXlZID09PSAnY2VudGVyJykge1xuICAgICAgLy8gTm90ZSB0aGF0IHNpbmNlIHRoaXMgaW5mb3JtYXRpb24gaXMgdXNlZCBmb3Igc3R5bGluZywgd2Ugd2FudCB0b1xuICAgICAgLy8gcmVzb2x2ZSBgc3RhcnRgIGFuZCBgZW5kYCB0byB0aGVpciByZWFsIHZhbHVlcywgb3RoZXJ3aXNlIGNvbnN1bWVyc1xuICAgICAgLy8gd291bGQgaGF2ZSB0byByZW1lbWJlciB0byBkbyBpdCB0aGVtc2VsdmVzIG9uIGVhY2ggY29uc3VtcHRpb24uXG4gICAgICBpZiAodGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCcpIHtcbiAgICAgICAgbmV3UG9zaXRpb24gPSBvcmlnaW5YID09PSAnZW5kJyA/ICdsZWZ0JyA6ICdyaWdodCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdQb3NpdGlvbiA9IG9yaWdpblggPT09ICdzdGFydCcgPyAnbGVmdCcgOiAncmlnaHQnO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdQb3NpdGlvbiA9IG92ZXJsYXlZID09PSAnYm90dG9tJyAmJiBvcmlnaW5ZID09PSAndG9wJyA/ICdhYm92ZScgOiAnYmVsb3cnO1xuICAgIH1cblxuICAgIGlmIChuZXdQb3NpdGlvbiAhPT0gdGhpcy5fY3VycmVudFBvc2l0aW9uKSB7XG4gICAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheVJlZjtcblxuICAgICAgaWYgKG92ZXJsYXlSZWYpIHtcbiAgICAgICAgY29uc3QgY2xhc3NQcmVmaXggPSBgJHt0aGlzLl9jc3NDbGFzc1ByZWZpeH0tJHtQQU5FTF9DTEFTU30tYDtcbiAgICAgICAgb3ZlcmxheVJlZi5yZW1vdmVQYW5lbENsYXNzKGNsYXNzUHJlZml4ICsgdGhpcy5fY3VycmVudFBvc2l0aW9uKTtcbiAgICAgICAgb3ZlcmxheVJlZi5hZGRQYW5lbENsYXNzKGNsYXNzUHJlZml4ICsgbmV3UG9zaXRpb24pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jdXJyZW50UG9zaXRpb24gPSBuZXdQb3NpdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKiogQmluZHMgdGhlIHBvaW50ZXIgZXZlbnRzIHRvIHRoZSB0b29sdGlwIHRyaWdnZXIuICovXG4gIHByaXZhdGUgX3NldHVwUG9pbnRlckVudGVyRXZlbnRzSWZOZWVkZWQoKSB7XG4gICAgLy8gT3B0aW1pemF0aW9uOiBEZWZlciBob29raW5nIHVwIGV2ZW50cyBpZiB0aGVyZSdzIG5vIG1lc3NhZ2Ugb3IgdGhlIHRvb2x0aXAgaXMgZGlzYWJsZWQuXG4gICAgaWYgKFxuICAgICAgdGhpcy5fZGlzYWJsZWQgfHxcbiAgICAgICF0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICF0aGlzLl92aWV3SW5pdGlhbGl6ZWQgfHxcbiAgICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnMubGVuZ3RoXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhlIG1vdXNlIGV2ZW50cyBzaG91bGRuJ3QgYmUgYm91bmQgb24gbW9iaWxlIGRldmljZXMsIGJlY2F1c2UgdGhleSBjYW4gcHJldmVudCB0aGVcbiAgICAvLyBmaXJzdCB0YXAgZnJvbSBmaXJpbmcgaXRzIGNsaWNrIGV2ZW50IG9yIGNhbiBjYXVzZSB0aGUgdG9vbHRpcCB0byBvcGVuIGZvciBjbGlja3MuXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtU3VwcG9ydHNNb3VzZUV2ZW50cygpKSB7XG4gICAgICB0aGlzLl9wYXNzaXZlTGlzdGVuZXJzLnB1c2goW1xuICAgICAgICAnbW91c2VlbnRlcicsXG4gICAgICAgIGV2ZW50ID0+IHtcbiAgICAgICAgICB0aGlzLl9zZXR1cFBvaW50ZXJFeGl0RXZlbnRzSWZOZWVkZWQoKTtcbiAgICAgICAgICBsZXQgcG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgaWYgKChldmVudCBhcyBNb3VzZUV2ZW50KS54ICE9PSB1bmRlZmluZWQgJiYgKGV2ZW50IGFzIE1vdXNlRXZlbnQpLnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcG9pbnQgPSBldmVudCBhcyBNb3VzZUV2ZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNob3codW5kZWZpbmVkLCBwb2ludCk7XG4gICAgICAgIH0sXG4gICAgICBdKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudG91Y2hHZXN0dXJlcyAhPT0gJ29mZicpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVOYXRpdmVHZXN0dXJlc0lmTmVjZXNzYXJ5KCk7XG5cbiAgICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnMucHVzaChbXG4gICAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgICAgZXZlbnQgPT4ge1xuICAgICAgICAgIGNvbnN0IHRvdWNoID0gKGV2ZW50IGFzIFRvdWNoRXZlbnQpLnRhcmdldFRvdWNoZXM/LlswXTtcbiAgICAgICAgICBjb25zdCBvcmlnaW4gPSB0b3VjaCA/IHt4OiB0b3VjaC5jbGllbnRYLCB5OiB0b3VjaC5jbGllbnRZfSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAvLyBOb3RlIHRoYXQgaXQncyBpbXBvcnRhbnQgdGhhdCB3ZSBkb24ndCBgcHJldmVudERlZmF1bHRgIGhlcmUsXG4gICAgICAgICAgLy8gYmVjYXVzZSBpdCBjYW4gcHJldmVudCBjbGljayBldmVudHMgZnJvbSBmaXJpbmcgb24gdGhlIGVsZW1lbnQuXG4gICAgICAgICAgdGhpcy5fc2V0dXBQb2ludGVyRXhpdEV2ZW50c0lmTmVlZGVkKCk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RvdWNoc3RhcnRUaW1lb3V0KTtcblxuICAgICAgICAgIGNvbnN0IERFRkFVTFRfTE9OR1BSRVNTX0RFTEFZID0gNTAwO1xuICAgICAgICAgIHRoaXMuX3RvdWNoc3RhcnRUaW1lb3V0ID0gc2V0VGltZW91dChcbiAgICAgICAgICAgICgpID0+IHRoaXMuc2hvdyh1bmRlZmluZWQsIG9yaWdpbiksXG4gICAgICAgICAgICB0aGlzLl9kZWZhdWx0T3B0aW9ucy50b3VjaExvbmdQcmVzc1Nob3dEZWxheSA/PyBERUZBVUxUX0xPTkdQUkVTU19ERUxBWSxcbiAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgXSk7XG4gICAgfVxuXG4gICAgdGhpcy5fYWRkTGlzdGVuZXJzKHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0dXBQb2ludGVyRXhpdEV2ZW50c0lmTmVlZGVkKCkge1xuICAgIGlmICh0aGlzLl9wb2ludGVyRXhpdEV2ZW50c0luaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3BvaW50ZXJFeGl0RXZlbnRzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgY29uc3QgZXhpdExpc3RlbmVyczogKHJlYWRvbmx5IFtzdHJpbmcsIEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3RdKVtdID0gW107XG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtU3VwcG9ydHNNb3VzZUV2ZW50cygpKSB7XG4gICAgICBleGl0TGlzdGVuZXJzLnB1c2goXG4gICAgICAgIFtcbiAgICAgICAgICAnbW91c2VsZWF2ZScsXG4gICAgICAgICAgZXZlbnQgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3VGFyZ2V0ID0gKGV2ZW50IGFzIE1vdXNlRXZlbnQpLnJlbGF0ZWRUYXJnZXQgYXMgTm9kZSB8IG51bGw7XG4gICAgICAgICAgICBpZiAoIW5ld1RhcmdldCB8fCAhdGhpcy5fb3ZlcmxheVJlZj8ub3ZlcmxheUVsZW1lbnQuY29udGFpbnMobmV3VGFyZ2V0KSkge1xuICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbJ3doZWVsJywgZXZlbnQgPT4gdGhpcy5fd2hlZWxMaXN0ZW5lcihldmVudCBhcyBXaGVlbEV2ZW50KV0sXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy50b3VjaEdlc3R1cmVzICE9PSAnb2ZmJykge1xuICAgICAgdGhpcy5fZGlzYWJsZU5hdGl2ZUdlc3R1cmVzSWZOZWNlc3NhcnkoKTtcbiAgICAgIGNvbnN0IHRvdWNoZW5kTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90b3VjaHN0YXJ0VGltZW91dCk7XG4gICAgICAgIHRoaXMuaGlkZSh0aGlzLl9kZWZhdWx0T3B0aW9ucy50b3VjaGVuZEhpZGVEZWxheSk7XG4gICAgICB9O1xuXG4gICAgICBleGl0TGlzdGVuZXJzLnB1c2goWyd0b3VjaGVuZCcsIHRvdWNoZW5kTGlzdGVuZXJdLCBbJ3RvdWNoY2FuY2VsJywgdG91Y2hlbmRMaXN0ZW5lcl0pO1xuICAgIH1cblxuICAgIHRoaXMuX2FkZExpc3RlbmVycyhleGl0TGlzdGVuZXJzKTtcbiAgICB0aGlzLl9wYXNzaXZlTGlzdGVuZXJzLnB1c2goLi4uZXhpdExpc3RlbmVycyk7XG4gIH1cblxuICBwcml2YXRlIF9hZGRMaXN0ZW5lcnMobGlzdGVuZXJzOiAocmVhZG9ubHkgW3N0cmluZywgRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdF0pW10pIHtcbiAgICBsaXN0ZW5lcnMuZm9yRWFjaCgoW2V2ZW50LCBsaXN0ZW5lcl0pID0+IHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgcGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9wbGF0Zm9ybVN1cHBvcnRzTW91c2VFdmVudHMoKSB7XG4gICAgcmV0dXJuICF0aGlzLl9wbGF0Zm9ybS5JT1MgJiYgIXRoaXMuX3BsYXRmb3JtLkFORFJPSUQ7XG4gIH1cblxuICAvKiogTGlzdGVuZXIgZm9yIHRoZSBgd2hlZWxgIGV2ZW50IG9uIHRoZSBlbGVtZW50LiAqL1xuICBwcml2YXRlIF93aGVlbExpc3RlbmVyKGV2ZW50OiBXaGVlbEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuX2lzVG9vbHRpcFZpc2libGUoKSkge1xuICAgICAgY29uc3QgZWxlbWVudFVuZGVyUG9pbnRlciA9IHRoaXMuX2RvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgICAvLyBPbiBub24tdG91Y2ggZGV2aWNlcyB3ZSBkZXBlbmQgb24gdGhlIGBtb3VzZWxlYXZlYCBldmVudCB0byBjbG9zZSB0aGUgdG9vbHRpcCwgYnV0IGl0XG4gICAgICAvLyB3b24ndCBmaXJlIGlmIHRoZSB1c2VyIHNjcm9sbHMgYXdheSB1c2luZyB0aGUgd2hlZWwgd2l0aG91dCBtb3ZpbmcgdGhlaXIgY3Vyc29yLiBXZVxuICAgICAgLy8gd29yayBhcm91bmQgaXQgYnkgZmluZGluZyB0aGUgZWxlbWVudCB1bmRlciB0aGUgdXNlcidzIGN1cnNvciBhbmQgY2xvc2luZyB0aGUgdG9vbHRpcFxuICAgICAgLy8gaWYgaXQncyBub3QgdGhlIHRyaWdnZXIuXG4gICAgICBpZiAoZWxlbWVudFVuZGVyUG9pbnRlciAhPT0gZWxlbWVudCAmJiAhZWxlbWVudC5jb250YWlucyhlbGVtZW50VW5kZXJQb2ludGVyKSkge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogRGlzYWJsZXMgdGhlIG5hdGl2ZSBicm93c2VyIGdlc3R1cmVzLCBiYXNlZCBvbiBob3cgdGhlIHRvb2x0aXAgaGFzIGJlZW4gY29uZmlndXJlZC4gKi9cbiAgcHJpdmF0ZSBfZGlzYWJsZU5hdGl2ZUdlc3R1cmVzSWZOZWNlc3NhcnkoKSB7XG4gICAgY29uc3QgZ2VzdHVyZXMgPSB0aGlzLnRvdWNoR2VzdHVyZXM7XG5cbiAgICBpZiAoZ2VzdHVyZXMgIT09ICdvZmYnKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgY29uc3Qgc3R5bGUgPSBlbGVtZW50LnN0eWxlO1xuXG4gICAgICAvLyBJZiBnZXN0dXJlcyBhcmUgc2V0IHRvIGBhdXRvYCwgd2UgZG9uJ3QgZGlzYWJsZSB0ZXh0IHNlbGVjdGlvbiBvbiBpbnB1dHMgYW5kXG4gICAgICAvLyB0ZXh0YXJlYXMsIGJlY2F1c2UgaXQgcHJldmVudHMgdGhlIHVzZXIgZnJvbSB0eXBpbmcgaW50byB0aGVtIG9uIGlPUyBTYWZhcmkuXG4gICAgICBpZiAoZ2VzdHVyZXMgPT09ICdvbicgfHwgKGVsZW1lbnQubm9kZU5hbWUgIT09ICdJTlBVVCcgJiYgZWxlbWVudC5ub2RlTmFtZSAhPT0gJ1RFWFRBUkVBJykpIHtcbiAgICAgICAgc3R5bGUudXNlclNlbGVjdCA9XG4gICAgICAgICAgKHN0eWxlIGFzIGFueSkubXNVc2VyU2VsZWN0ID1cbiAgICAgICAgICBzdHlsZS53ZWJraXRVc2VyU2VsZWN0ID1cbiAgICAgICAgICAoc3R5bGUgYXMgYW55KS5Nb3pVc2VyU2VsZWN0ID1cbiAgICAgICAgICAgICdub25lJztcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgaGF2ZSBgYXV0b2AgZ2VzdHVyZXMgYW5kIHRoZSBlbGVtZW50IHVzZXMgbmF0aXZlIEhUTUwgZHJhZ2dpbmcsXG4gICAgICAvLyB3ZSBkb24ndCBzZXQgYC13ZWJraXQtdXNlci1kcmFnYCBiZWNhdXNlIGl0IHByZXZlbnRzIHRoZSBuYXRpdmUgYmVoYXZpb3IuXG4gICAgICBpZiAoZ2VzdHVyZXMgPT09ICdvbicgfHwgIWVsZW1lbnQuZHJhZ2dhYmxlKSB7XG4gICAgICAgIChzdHlsZSBhcyBhbnkpLndlYmtpdFVzZXJEcmFnID0gJ25vbmUnO1xuICAgICAgfVxuXG4gICAgICBzdHlsZS50b3VjaEFjdGlvbiA9ICdub25lJztcbiAgICAgIChzdHlsZSBhcyBhbnkpLndlYmtpdFRhcEhpZ2hsaWdodENvbG9yID0gJ3RyYW5zcGFyZW50JztcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBJbnRlcm5hbCBjb21wb25lbnQgdGhhdCB3cmFwcyB0aGUgdG9vbHRpcCdzIGNvbnRlbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10b29sdGlwLWNvbXBvbmVudCcsXG4gIHRlbXBsYXRlVXJsOiAndG9vbHRpcC5odG1sJyxcbiAgc3R5bGVVcmw6ICd0b29sdGlwLmNzcycsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgLy8gRm9yY2VzIHRoZSBlbGVtZW50IHRvIGhhdmUgYSBsYXlvdXQgaW4gSUUgYW5kIEVkZ2UuIFRoaXMgZml4ZXMgaXNzdWVzIHdoZXJlIHRoZSBlbGVtZW50XG4gICAgLy8gd29uJ3QgYmUgcmVuZGVyZWQgaWYgdGhlIGFuaW1hdGlvbnMgYXJlIGRpc2FibGVkIG9yIHRoZXJlIGlzIG5vIHdlYiBhbmltYXRpb25zIHBvbHlmaWxsLlxuICAgICdbc3R5bGUuem9vbV0nOiAnaXNWaXNpYmxlKCkgPyAxIDogbnVsbCcsXG4gICAgJyhtb3VzZWxlYXZlKSc6ICdfaGFuZGxlTW91c2VMZWF2ZSgkZXZlbnQpJyxcbiAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZScsXG4gIH0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtOZ0NsYXNzXSxcbn0pXG5leHBvcnQgY2xhc3MgVG9vbHRpcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qIFdoZXRoZXIgdGhlIHRvb2x0aXAgdGV4dCBvdmVyZmxvd3MgdG8gbXVsdGlwbGUgbGluZXMgKi9cbiAgX2lzTXVsdGlsaW5lID0gZmFsc2U7XG5cbiAgLyoqIE1lc3NhZ2UgdG8gZGlzcGxheSBpbiB0aGUgdG9vbHRpcCAqL1xuICBtZXNzYWdlOiBzdHJpbmc7XG5cbiAgLyoqIENsYXNzZXMgdG8gYmUgYWRkZWQgdG8gdGhlIHRvb2x0aXAuIFN1cHBvcnRzIHRoZSBzYW1lIHN5bnRheCBhcyBgbmdDbGFzc2AuICovXG4gIHRvb2x0aXBDbGFzczogc3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPiB8IHtba2V5OiBzdHJpbmddOiBhbnl9O1xuXG4gIC8qKiBUaGUgdGltZW91dCBJRCBvZiBhbnkgY3VycmVudCB0aW1lciBzZXQgdG8gc2hvdyB0aGUgdG9vbHRpcCAqL1xuICBwcml2YXRlIF9zaG93VGltZW91dElkOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IHVuZGVmaW5lZDtcblxuICAvKiogVGhlIHRpbWVvdXQgSUQgb2YgYW55IGN1cnJlbnQgdGltZXIgc2V0IHRvIGhpZGUgdGhlIHRvb2x0aXAgKi9cbiAgcHJpdmF0ZSBfaGlkZVRpbWVvdXRJZDogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCB1bmRlZmluZWQ7XG5cbiAgLyoqIEVsZW1lbnQgdGhhdCBjYXVzZWQgdGhlIHRvb2x0aXAgdG8gb3Blbi4gKi9cbiAgX3RyaWdnZXJFbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAvKiogQW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheSB0aGUgY2xvc2luZyBzZXF1ZW5jZS4gKi9cbiAgX21vdXNlTGVhdmVIaWRlRGVsYXk6IG51bWJlcjtcblxuICAvKiogV2hldGhlciBhbmltYXRpb25zIGFyZSBjdXJyZW50bHkgZGlzYWJsZWQuICovXG4gIHByaXZhdGUgX2FuaW1hdGlvbnNEaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBpbnRlcm5hbCB0b29sdGlwIGVsZW1lbnQuICovXG4gIEBWaWV3Q2hpbGQoJ3Rvb2x0aXAnLCB7XG4gICAgLy8gVXNlIGEgc3RhdGljIHF1ZXJ5IGhlcmUgc2luY2Ugd2UgaW50ZXJhY3QgZGlyZWN0bHkgd2l0aFxuICAgIC8vIHRoZSBET00gd2hpY2ggY2FuIGhhcHBlbiBiZWZvcmUgYG5nQWZ0ZXJWaWV3SW5pdGAuXG4gICAgc3RhdGljOiB0cnVlLFxuICB9KVxuICBfdG9vbHRpcDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgLyoqIFdoZXRoZXIgaW50ZXJhY3Rpb25zIG9uIHRoZSBwYWdlIHNob3VsZCBjbG9zZSB0aGUgdG9vbHRpcCAqL1xuICBwcml2YXRlIF9jbG9zZU9uSW50ZXJhY3Rpb24gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgdG9vbHRpcCBpcyBjdXJyZW50bHkgdmlzaWJsZS4gKi9cbiAgcHJpdmF0ZSBfaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGF0IHRoZSB0b29sdGlwIGhhcyBiZWVuIGhpZGRlbiBmcm9tIHRoZSB2aWV3ICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX29uSGlkZTogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgLyoqIE5hbWUgb2YgdGhlIHNob3cgYW5pbWF0aW9uIGFuZCB0aGUgY2xhc3MgdGhhdCB0b2dnbGVzIGl0LiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9zaG93QW5pbWF0aW9uID0gJ21hdC1tZGMtdG9vbHRpcC1zaG93JztcblxuICAvKiogTmFtZSBvZiB0aGUgaGlkZSBhbmltYXRpb24gYW5kIHRoZSBjbGFzcyB0aGF0IHRvZ2dsZXMgaXQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2hpZGVBbmltYXRpb24gPSAnbWF0LW1kYy10b29sdGlwLWhpZGUnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICB0aGlzLl9hbmltYXRpb25zRGlzYWJsZWQgPSBhbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3dzIHRoZSB0b29sdGlwIHdpdGggYW4gYW5pbWF0aW9uIG9yaWdpbmF0aW5nIGZyb20gdGhlIHByb3ZpZGVkIG9yaWdpblxuICAgKiBAcGFyYW0gZGVsYXkgQW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byB0aGUgZGVsYXkgc2hvd2luZyB0aGUgdG9vbHRpcC5cbiAgICovXG4gIHNob3coZGVsYXk6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIENhbmNlbCB0aGUgZGVsYXllZCBoaWRlIGlmIGl0IGlzIHNjaGVkdWxlZFxuICAgIGlmICh0aGlzLl9oaWRlVGltZW91dElkICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9oaWRlVGltZW91dElkKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zaG93VGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl90b2dnbGVWaXNpYmlsaXR5KHRydWUpO1xuICAgICAgdGhpcy5fc2hvd1RpbWVvdXRJZCA9IHVuZGVmaW5lZDtcbiAgICB9LCBkZWxheSk7XG4gIH1cblxuICAvKipcbiAgICogQmVnaW5zIHRoZSBhbmltYXRpb24gdG8gaGlkZSB0aGUgdG9vbHRpcCBhZnRlciB0aGUgcHJvdmlkZWQgZGVsYXkgaW4gbXMuXG4gICAqIEBwYXJhbSBkZWxheSBBbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5IHNob3dpbmcgdGhlIHRvb2x0aXAuXG4gICAqL1xuICBoaWRlKGRlbGF5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBDYW5jZWwgdGhlIGRlbGF5ZWQgc2hvdyBpZiBpdCBpcyBzY2hlZHVsZWRcbiAgICBpZiAodGhpcy5fc2hvd1RpbWVvdXRJZCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fc2hvd1RpbWVvdXRJZCk7XG4gICAgfVxuXG4gICAgdGhpcy5faGlkZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fdG9nZ2xlVmlzaWJpbGl0eShmYWxzZSk7XG4gICAgICB0aGlzLl9oaWRlVGltZW91dElkID0gdW5kZWZpbmVkO1xuICAgIH0sIGRlbGF5KTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIGFuIG9ic2VydmFibGUgdGhhdCBub3RpZmllcyB3aGVuIHRoZSB0b29sdGlwIGhhcyBiZWVuIGhpZGRlbiBmcm9tIHZpZXcuICovXG4gIGFmdGVySGlkZGVuKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9vbkhpZGU7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdG9vbHRpcCBpcyBiZWluZyBkaXNwbGF5ZWQuICovXG4gIGlzVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNWaXNpYmxlO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fY2FuY2VsUGVuZGluZ0FuaW1hdGlvbnMoKTtcbiAgICB0aGlzLl9vbkhpZGUuY29tcGxldGUoKTtcbiAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCA9IG51bGwhO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyYWN0aW9ucyBvbiB0aGUgSFRNTCBib2R5IHNob3VsZCBjbG9zZSB0aGUgdG9vbHRpcCBpbW1lZGlhdGVseSBhcyBkZWZpbmVkIGluIHRoZVxuICAgKiBtYXRlcmlhbCBkZXNpZ24gc3BlYy5cbiAgICogaHR0cHM6Ly9tYXRlcmlhbC5pby9kZXNpZ24vY29tcG9uZW50cy90b29sdGlwcy5odG1sI2JlaGF2aW9yXG4gICAqL1xuICBfaGFuZGxlQm9keUludGVyYWN0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jbG9zZU9uSW50ZXJhY3Rpb24pIHtcbiAgICAgIHRoaXMuaGlkZSgwKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhhdCB0aGUgdG9vbHRpcCBuZWVkcyB0byBiZSBjaGVja2VkIGluIHRoZSBuZXh0IGNoYW5nZSBkZXRlY3Rpb24gcnVuLlxuICAgKiBNYWlubHkgdXNlZCBmb3IgcmVuZGVyaW5nIHRoZSBpbml0aWFsIHRleHQgYmVmb3JlIHBvc2l0aW9uaW5nIGEgdG9vbHRpcCwgd2hpY2hcbiAgICogY2FuIGJlIHByb2JsZW1hdGljIGluIGNvbXBvbmVudHMgd2l0aCBPblB1c2ggY2hhbmdlIGRldGVjdGlvbi5cbiAgICovXG4gIF9tYXJrRm9yQ2hlY2soKTogdm9pZCB7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBfaGFuZGxlTW91c2VMZWF2ZSh7cmVsYXRlZFRhcmdldH06IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAoIXJlbGF0ZWRUYXJnZXQgfHwgIXRoaXMuX3RyaWdnZXJFbGVtZW50LmNvbnRhaW5zKHJlbGF0ZWRUYXJnZXQgYXMgTm9kZSkpIHtcbiAgICAgIGlmICh0aGlzLmlzVmlzaWJsZSgpKSB7XG4gICAgICAgIHRoaXMuaGlkZSh0aGlzLl9tb3VzZUxlYXZlSGlkZURlbGF5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2ZpbmFsaXplQW5pbWF0aW9uKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIHdoZW4gdGhlIHRpbWVvdXQgaW4gdGhpcy5zaG93KCkgZ2V0cyBjb21wbGV0ZWQuXG4gICAqIFRoaXMgbWV0aG9kIGlzIG9ubHkgbmVlZGVkIGJ5IHRoZSBtZGMtdG9vbHRpcCwgYW5kIHNvIGl0IGlzIG9ubHkgaW1wbGVtZW50ZWRcbiAgICogaW4gdGhlIG1kYy10b29sdGlwLCBub3QgaGVyZS5cbiAgICovXG4gIHByb3RlY3RlZCBfb25TaG93KCk6IHZvaWQge1xuICAgIHRoaXMuX2lzTXVsdGlsaW5lID0gdGhpcy5faXNUb29sdGlwTXVsdGlsaW5lKCk7XG4gICAgdGhpcy5fbWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdG9vbHRpcCB0ZXh0IGhhcyBvdmVyZmxvd24gdG8gdGhlIG5leHQgbGluZSAqL1xuICBwcml2YXRlIF9pc1Rvb2x0aXBNdWx0aWxpbmUoKSB7XG4gICAgY29uc3QgcmVjdCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gcmVjdC5oZWlnaHQgPiBNSU5fSEVJR0hUICYmIHJlY3Qud2lkdGggPj0gTUFYX1dJRFRIO1xuICB9XG5cbiAgLyoqIEV2ZW50IGxpc3RlbmVyIGRpc3BhdGNoZWQgd2hlbiBhbiBhbmltYXRpb24gb24gdGhlIHRvb2x0aXAgZmluaXNoZXMuICovXG4gIF9oYW5kbGVBbmltYXRpb25FbmQoe2FuaW1hdGlvbk5hbWV9OiBBbmltYXRpb25FdmVudCkge1xuICAgIGlmIChhbmltYXRpb25OYW1lID09PSB0aGlzLl9zaG93QW5pbWF0aW9uIHx8IGFuaW1hdGlvbk5hbWUgPT09IHRoaXMuX2hpZGVBbmltYXRpb24pIHtcbiAgICAgIHRoaXMuX2ZpbmFsaXplQW5pbWF0aW9uKGFuaW1hdGlvbk5hbWUgPT09IHRoaXMuX3Nob3dBbmltYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDYW5jZWxzIGFueSBwZW5kaW5nIGFuaW1hdGlvbiBzZXF1ZW5jZXMuICovXG4gIF9jYW5jZWxQZW5kaW5nQW5pbWF0aW9ucygpIHtcbiAgICBpZiAodGhpcy5fc2hvd1RpbWVvdXRJZCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fc2hvd1RpbWVvdXRJZCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2hpZGVUaW1lb3V0SWQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2hpZGVUaW1lb3V0SWQpO1xuICAgIH1cblxuICAgIHRoaXMuX3Nob3dUaW1lb3V0SWQgPSB0aGlzLl9oaWRlVGltZW91dElkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgdGhlIGNsZWFudXAgYWZ0ZXIgYW4gYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC4gKi9cbiAgcHJpdmF0ZSBfZmluYWxpemVBbmltYXRpb24odG9WaXNpYmxlOiBib29sZWFuKSB7XG4gICAgaWYgKHRvVmlzaWJsZSkge1xuICAgICAgdGhpcy5fY2xvc2VPbkludGVyYWN0aW9uID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzVmlzaWJsZSgpKSB7XG4gICAgICB0aGlzLl9vbkhpZGUubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSB0b29sdGlwIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX3RvZ2dsZVZpc2liaWxpdHkoaXNWaXNpYmxlOiBib29sZWFuKSB7XG4gICAgLy8gV2Ugc2V0IHRoZSBjbGFzc2VzIGRpcmVjdGx5IGhlcmUgb3Vyc2VsdmVzIHNvIHRoYXQgdG9nZ2xpbmcgdGhlIHRvb2x0aXAgc3RhdGVcbiAgICAvLyBpc24ndCBib3VuZCBieSBjaGFuZ2UgZGV0ZWN0aW9uLiBUaGlzIGFsbG93cyB1cyB0byBoaWRlIGl0IGV2ZW4gaWYgdGhlXG4gICAgLy8gdmlldyByZWYgaGFzIGJlZW4gZGV0YWNoZWQgZnJvbSB0aGUgQ0QgdHJlZS5cbiAgICBjb25zdCB0b29sdGlwID0gdGhpcy5fdG9vbHRpcC5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IHNob3dDbGFzcyA9IHRoaXMuX3Nob3dBbmltYXRpb247XG4gICAgY29uc3QgaGlkZUNsYXNzID0gdGhpcy5faGlkZUFuaW1hdGlvbjtcbiAgICB0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoaXNWaXNpYmxlID8gaGlkZUNsYXNzIDogc2hvd0NsYXNzKTtcbiAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQoaXNWaXNpYmxlID8gc2hvd0NsYXNzIDogaGlkZUNsYXNzKTtcbiAgICBpZiAodGhpcy5faXNWaXNpYmxlICE9PSBpc1Zpc2libGUpIHtcbiAgICAgIHRoaXMuX2lzVmlzaWJsZSA9IGlzVmlzaWJsZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIC8vIEl0J3MgY29tbW9uIGZvciBpbnRlcm5hbCBhcHBzIHRvIGRpc2FibGUgYW5pbWF0aW9ucyB1c2luZyBgKiB7IGFuaW1hdGlvbjogbm9uZSAhaW1wb3J0YW50IH1gXG4gICAgLy8gd2hpY2ggY2FuIGJyZWFrIHRoZSBvcGVuaW5nIHNlcXVlbmNlLiBUcnkgdG8gZGV0ZWN0IHN1Y2ggY2FzZXMgYW5kIHdvcmsgYXJvdW5kIHRoZW0uXG4gICAgaWYgKGlzVmlzaWJsZSAmJiAhdGhpcy5fYW5pbWF0aW9uc0Rpc2FibGVkICYmIHR5cGVvZiBnZXRDb21wdXRlZFN0eWxlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKHRvb2x0aXApO1xuXG4gICAgICAvLyBVc2UgYGdldFByb3BlcnR5VmFsdWVgIHRvIGF2b2lkIGlzc3VlcyB3aXRoIHByb3BlcnR5IHJlbmFtaW5nLlxuICAgICAgaWYgKFxuICAgICAgICBzdHlsZXMuZ2V0UHJvcGVydHlWYWx1ZSgnYW5pbWF0aW9uLWR1cmF0aW9uJykgPT09ICcwcycgfHxcbiAgICAgICAgc3R5bGVzLmdldFByb3BlcnR5VmFsdWUoJ2FuaW1hdGlvbi1uYW1lJykgPT09ICdub25lJ1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzVmlzaWJsZSkge1xuICAgICAgdGhpcy5fb25TaG93KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCkge1xuICAgICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKCdfbWF0LWFuaW1hdGlvbi1ub29wYWJsZScpO1xuICAgICAgdGhpcy5fZmluYWxpemVBbmltYXRpb24oaXNWaXNpYmxlKTtcbiAgICB9XG4gIH1cbn1cbiIsIjxkaXZcbiAgI3Rvb2x0aXBcbiAgY2xhc3M9XCJtZGMtdG9vbHRpcCBtYXQtbWRjLXRvb2x0aXBcIlxuICBbbmdDbGFzc109XCJ0b29sdGlwQ2xhc3NcIlxuICAoYW5pbWF0aW9uZW5kKT1cIl9oYW5kbGVBbmltYXRpb25FbmQoJGV2ZW50KVwiXG4gIFtjbGFzcy5tZGMtdG9vbHRpcC0tbXVsdGlsaW5lXT1cIl9pc011bHRpbGluZVwiPlxuICA8ZGl2IGNsYXNzPVwibWF0LW1kYy10b29sdGlwLXN1cmZhY2UgbWRjLXRvb2x0aXBfX3N1cmZhY2VcIj57e21lc3NhZ2V9fTwvZGl2PlxuPC9kaXY+XG4iXX0=