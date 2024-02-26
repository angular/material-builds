/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { take, takeUntil } from 'rxjs/operators';
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, Inject, InjectionToken, Input, NgZone, Optional, ViewChild, ViewContainerRef, ViewEncapsulation, inject, ANIMATION_MODULE_TYPE, } from '@angular/core';
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
/**
 * Time between the user putting the pointer on a tooltip
 * trigger and the long press event being fired.
 */
const LONGPRESS_DELAY = 500;
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
            this._ngZone.onMicrotaskEmpty.pipe(take(1), takeUntil(this._destroyed)).subscribe(() => {
                if (this._tooltipInstance) {
                    this._overlayRef.updatePosition();
                }
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
                    this._touchstartTimeout = setTimeout(() => this.show(undefined, origin), LONGPRESS_DELAY);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatTooltip, deps: [{ token: i1.Overlay }, { token: i0.ElementRef }, { token: i1.ScrollDispatcher }, { token: i0.ViewContainerRef }, { token: i0.NgZone }, { token: i2.Platform }, { token: i3.AriaDescriber }, { token: i3.FocusMonitor }, { token: MAT_TOOLTIP_SCROLL_STRATEGY }, { token: i4.Directionality }, { token: MAT_TOOLTIP_DEFAULT_OPTIONS, optional: true }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MatTooltip, isStandalone: true, selector: "[matTooltip]", inputs: { position: ["matTooltipPosition", "position"], positionAtOrigin: ["matTooltipPositionAtOrigin", "positionAtOrigin"], disabled: ["matTooltipDisabled", "disabled"], showDelay: ["matTooltipShowDelay", "showDelay"], hideDelay: ["matTooltipHideDelay", "hideDelay"], touchGestures: ["matTooltipTouchGestures", "touchGestures"], message: ["matTooltip", "message"], tooltipClass: ["matTooltipClass", "tooltipClass"] }, host: { properties: { "class.mat-mdc-tooltip-disabled": "disabled" }, classAttribute: "mat-mdc-tooltip-trigger" }, exportAs: ["matTooltip"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatTooltip, decorators: [{
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
        this._isVisible = isVisible;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: TooltipComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.2.0", type: TooltipComponent, isStandalone: true, selector: "mat-tooltip-component", host: { attributes: { "aria-hidden": "true" }, listeners: { "mouseleave": "_handleMouseLeave($event)" }, properties: { "style.zoom": "isVisible() ? 1 : null" } }, viewQueries: [{ propertyName: "_tooltip", first: true, predicate: ["tooltip"], descendants: true, static: true }], ngImport: i0, template: "<div\n  #tooltip\n  class=\"mdc-tooltip mdc-tooltip--shown mat-mdc-tooltip\"\n  [ngClass]=\"tooltipClass\"\n  (animationend)=\"_handleAnimationEnd($event)\"\n  [class.mdc-tooltip--multiline]=\"_isMultiline\">\n  <div class=\"mdc-tooltip__surface mdc-tooltip__surface-animation\">{{message}}</div>\n</div>\n", styles: [".mdc-tooltip__surface{word-break:break-all;word-break:var(--mdc-tooltip-word-break, normal);overflow-wrap:anywhere}.mdc-tooltip--showing-transition .mdc-tooltip__surface-animation{transition:opacity 150ms 0ms cubic-bezier(0, 0, 0.2, 1),transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-tooltip--hide-transition .mdc-tooltip__surface-animation{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-tooltip{position:fixed;display:none;z-index:9}.mdc-tooltip-wrapper--rich{position:relative}.mdc-tooltip--shown,.mdc-tooltip--showing,.mdc-tooltip--hide{display:inline-flex}.mdc-tooltip--shown.mdc-tooltip--rich,.mdc-tooltip--showing.mdc-tooltip--rich,.mdc-tooltip--hide.mdc-tooltip--rich{display:inline-block;left:-320px;position:absolute}.mdc-tooltip__surface{line-height:16px;padding:4px 8px;min-width:40px;max-width:200px;min-height:24px;max-height:40vh;box-sizing:border-box;overflow:hidden;text-align:center}.mdc-tooltip__surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-tooltip__surface::before{border-color:CanvasText}}.mdc-tooltip--rich .mdc-tooltip__surface{align-items:flex-start;display:flex;flex-direction:column;min-height:24px;min-width:40px;max-width:320px;position:relative}.mdc-tooltip--multiline .mdc-tooltip__surface{text-align:left}[dir=rtl] .mdc-tooltip--multiline .mdc-tooltip__surface,.mdc-tooltip--multiline .mdc-tooltip__surface[dir=rtl]{text-align:right}.mdc-tooltip__surface .mdc-tooltip__title{margin:0 8px}.mdc-tooltip__surface .mdc-tooltip__content{max-width:calc(200px - 2*8px);margin:8px;text-align:left}[dir=rtl] .mdc-tooltip__surface .mdc-tooltip__content,.mdc-tooltip__surface .mdc-tooltip__content[dir=rtl]{text-align:right}.mdc-tooltip--rich .mdc-tooltip__surface .mdc-tooltip__content{max-width:calc(320px - 2*8px);align-self:stretch}.mdc-tooltip__surface .mdc-tooltip__content-link{text-decoration:none}.mdc-tooltip--rich-actions,.mdc-tooltip__content,.mdc-tooltip__title{z-index:1}.mdc-tooltip__surface-animation{opacity:0;transform:scale(0.8);will-change:transform,opacity}.mdc-tooltip--shown .mdc-tooltip__surface-animation{transform:scale(1);opacity:1}.mdc-tooltip--hide .mdc-tooltip__surface-animation{transform:scale(1)}.mdc-tooltip__caret-surface-top,.mdc-tooltip__caret-surface-bottom{position:absolute;height:24px;width:24px;transform:rotate(35deg) skewY(20deg) scaleX(0.9396926208)}.mdc-tooltip__caret-surface-top .mdc-elevation-overlay,.mdc-tooltip__caret-surface-bottom .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-tooltip__caret-surface-bottom{box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);outline:1px solid rgba(0,0,0,0);z-index:-1}@media screen and (forced-colors: active){.mdc-tooltip__caret-surface-bottom{outline-color:CanvasText}}.mat-mdc-tooltip .mdc-tooltip__surface{background-color:var(--mdc-plain-tooltip-container-color)}.mat-mdc-tooltip .mdc-tooltip__surface{border-radius:var(--mdc-plain-tooltip-container-shape)}.mat-mdc-tooltip .mdc-tooltip__caret-surface-top,.mat-mdc-tooltip .mdc-tooltip__caret-surface-bottom{border-radius:var(--mdc-plain-tooltip-container-shape)}.mat-mdc-tooltip .mdc-tooltip__surface{color:var(--mdc-plain-tooltip-supporting-text-color)}.mat-mdc-tooltip .mdc-tooltip__surface{font-family:var(--mdc-plain-tooltip-supporting-text-font);line-height:var(--mdc-plain-tooltip-supporting-text-line-height);font-size:var(--mdc-plain-tooltip-supporting-text-size);font-weight:var(--mdc-plain-tooltip-supporting-text-weight);letter-spacing:var(--mdc-plain-tooltip-supporting-text-tracking)}.mat-mdc-tooltip{position:relative;transform:scale(0)}.mat-mdc-tooltip::before{content:\"\";top:0;right:0;bottom:0;left:0;z-index:-1;position:absolute}.mat-mdc-tooltip-panel-below .mat-mdc-tooltip::before{top:-8px}.mat-mdc-tooltip-panel-above .mat-mdc-tooltip::before{bottom:-8px}.mat-mdc-tooltip-panel-right .mat-mdc-tooltip::before{left:-8px}.mat-mdc-tooltip-panel-left .mat-mdc-tooltip::before{right:-8px}.mat-mdc-tooltip._mat-animation-noopable{animation:none;transform:scale(1)}.mat-mdc-tooltip-panel.mat-mdc-tooltip-panel-non-interactive{pointer-events:none}@keyframes mat-mdc-tooltip-show{0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}}@keyframes mat-mdc-tooltip-hide{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.8)}}.mat-mdc-tooltip-show{animation:mat-mdc-tooltip-show 150ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-mdc-tooltip-hide{animation:mat-mdc-tooltip-hide 75ms cubic-bezier(0.4, 0, 1, 1) forwards}"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: TooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tooltip-component', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        // Forces the element to have a layout in IE and Edge. This fixes issues where the element
                        // won't be rendered if the animations are disabled or there is no web animations polyfill.
                        '[style.zoom]': 'isVisible() ? 1 : null',
                        '(mouseleave)': '_handleMouseLeave($event)',
                        'aria-hidden': 'true',
                    }, standalone: true, imports: [NgClass], template: "<div\n  #tooltip\n  class=\"mdc-tooltip mdc-tooltip--shown mat-mdc-tooltip\"\n  [ngClass]=\"tooltipClass\"\n  (animationend)=\"_handleAnimationEnd($event)\"\n  [class.mdc-tooltip--multiline]=\"_isMultiline\">\n  <div class=\"mdc-tooltip__surface mdc-tooltip__surface-animation\">{{message}}</div>\n</div>\n", styles: [".mdc-tooltip__surface{word-break:break-all;word-break:var(--mdc-tooltip-word-break, normal);overflow-wrap:anywhere}.mdc-tooltip--showing-transition .mdc-tooltip__surface-animation{transition:opacity 150ms 0ms cubic-bezier(0, 0, 0.2, 1),transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-tooltip--hide-transition .mdc-tooltip__surface-animation{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-tooltip{position:fixed;display:none;z-index:9}.mdc-tooltip-wrapper--rich{position:relative}.mdc-tooltip--shown,.mdc-tooltip--showing,.mdc-tooltip--hide{display:inline-flex}.mdc-tooltip--shown.mdc-tooltip--rich,.mdc-tooltip--showing.mdc-tooltip--rich,.mdc-tooltip--hide.mdc-tooltip--rich{display:inline-block;left:-320px;position:absolute}.mdc-tooltip__surface{line-height:16px;padding:4px 8px;min-width:40px;max-width:200px;min-height:24px;max-height:40vh;box-sizing:border-box;overflow:hidden;text-align:center}.mdc-tooltip__surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-tooltip__surface::before{border-color:CanvasText}}.mdc-tooltip--rich .mdc-tooltip__surface{align-items:flex-start;display:flex;flex-direction:column;min-height:24px;min-width:40px;max-width:320px;position:relative}.mdc-tooltip--multiline .mdc-tooltip__surface{text-align:left}[dir=rtl] .mdc-tooltip--multiline .mdc-tooltip__surface,.mdc-tooltip--multiline .mdc-tooltip__surface[dir=rtl]{text-align:right}.mdc-tooltip__surface .mdc-tooltip__title{margin:0 8px}.mdc-tooltip__surface .mdc-tooltip__content{max-width:calc(200px - 2*8px);margin:8px;text-align:left}[dir=rtl] .mdc-tooltip__surface .mdc-tooltip__content,.mdc-tooltip__surface .mdc-tooltip__content[dir=rtl]{text-align:right}.mdc-tooltip--rich .mdc-tooltip__surface .mdc-tooltip__content{max-width:calc(320px - 2*8px);align-self:stretch}.mdc-tooltip__surface .mdc-tooltip__content-link{text-decoration:none}.mdc-tooltip--rich-actions,.mdc-tooltip__content,.mdc-tooltip__title{z-index:1}.mdc-tooltip__surface-animation{opacity:0;transform:scale(0.8);will-change:transform,opacity}.mdc-tooltip--shown .mdc-tooltip__surface-animation{transform:scale(1);opacity:1}.mdc-tooltip--hide .mdc-tooltip__surface-animation{transform:scale(1)}.mdc-tooltip__caret-surface-top,.mdc-tooltip__caret-surface-bottom{position:absolute;height:24px;width:24px;transform:rotate(35deg) skewY(20deg) scaleX(0.9396926208)}.mdc-tooltip__caret-surface-top .mdc-elevation-overlay,.mdc-tooltip__caret-surface-bottom .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-tooltip__caret-surface-bottom{box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);outline:1px solid rgba(0,0,0,0);z-index:-1}@media screen and (forced-colors: active){.mdc-tooltip__caret-surface-bottom{outline-color:CanvasText}}.mat-mdc-tooltip .mdc-tooltip__surface{background-color:var(--mdc-plain-tooltip-container-color)}.mat-mdc-tooltip .mdc-tooltip__surface{border-radius:var(--mdc-plain-tooltip-container-shape)}.mat-mdc-tooltip .mdc-tooltip__caret-surface-top,.mat-mdc-tooltip .mdc-tooltip__caret-surface-bottom{border-radius:var(--mdc-plain-tooltip-container-shape)}.mat-mdc-tooltip .mdc-tooltip__surface{color:var(--mdc-plain-tooltip-supporting-text-color)}.mat-mdc-tooltip .mdc-tooltip__surface{font-family:var(--mdc-plain-tooltip-supporting-text-font);line-height:var(--mdc-plain-tooltip-supporting-text-line-height);font-size:var(--mdc-plain-tooltip-supporting-text-size);font-weight:var(--mdc-plain-tooltip-supporting-text-weight);letter-spacing:var(--mdc-plain-tooltip-supporting-text-tracking)}.mat-mdc-tooltip{position:relative;transform:scale(0)}.mat-mdc-tooltip::before{content:\"\";top:0;right:0;bottom:0;left:0;z-index:-1;position:absolute}.mat-mdc-tooltip-panel-below .mat-mdc-tooltip::before{top:-8px}.mat-mdc-tooltip-panel-above .mat-mdc-tooltip::before{bottom:-8px}.mat-mdc-tooltip-panel-right .mat-mdc-tooltip::before{left:-8px}.mat-mdc-tooltip-panel-left .mat-mdc-tooltip::before{right:-8px}.mat-mdc-tooltip._mat-animation-noopable{animation:none;transform:scale(1)}.mat-mdc-tooltip-panel.mat-mdc-tooltip-panel-non-interactive{pointer-events:none}@keyframes mat-mdc-tooltip-show{0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}}@keyframes mat-mdc-tooltip-hide{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.8)}}.mat-mdc-tooltip-show{animation:mat-mdc-tooltip-show 150ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-mdc-tooltip-hide{animation:mat-mdc-tooltip-hide 75ms cubic-bezier(0.4, 0, 1, 1) forwards}"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90b29sdGlwL3Rvb2x0aXAudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdG9vbHRpcC90b29sdGlwLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvQyxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG9CQUFvQixHQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixNQUFNLEVBQ04scUJBQXFCLEdBQ3RCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLCtCQUErQixFQUFFLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hGLE9BQU8sRUFBQyxhQUFhLEVBQUUsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDOUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFNTCxPQUFPLEVBR1AsZ0JBQWdCLEdBR2pCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3BELE9BQU8sRUFBYSxPQUFPLEVBQUMsTUFBTSxN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RiwyRkFBMkY7d0JBQzNGLGNBQWMsRUFBRSx3QkFBd0I7d0JBQ3hDLGNBQWMsRUFBRSwyQkFBMkI7d0JBQzNDLGFBQWEsRUFBRSxNQUFNO3FCQUN0QixjQUNXLElBQUksV0FDUCxDQUFDLE9BQU8sQ0FBQzs7MEJBcURmLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCO3lDQXBCM0MsUUFBUTtzQkFMUCxTQUFTO3VCQUFDLFNBQVMsRUFBRTt3QkFDcEIsMERBQTBEO3dCQUMxRCxxREFBcUQ7d0JBQ3JELE1BQU0sRUFBRSxJQUFJO3FCQUNiIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge3Rha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RVNDQVBFLCBoYXNNb2RpZmllcktleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIGluamVjdCxcbiAgQU5JTUFUSU9OX01PRFVMRV9UWVBFLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlQsIE5nQ2xhc3N9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge25vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMsIFBsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtBcmlhRGVzY3JpYmVyLCBGb2N1c01vbml0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIENvbm5lY3RlZFBvc2l0aW9uLFxuICBDb25uZWN0aW9uUG9zaXRpb25QYWlyLFxuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG4gIEhvcml6b250YWxDb25uZWN0aW9uUG9zLFxuICBPcmlnaW5Db25uZWN0aW9uUG9zaXRpb24sXG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25uZWN0aW9uUG9zaXRpb24sXG4gIE92ZXJsYXlSZWYsXG4gIFNjcm9sbERpc3BhdGNoZXIsXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBWZXJ0aWNhbENvbm5lY3Rpb25Qb3MsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q29tcG9uZW50UG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKiBQb3NzaWJsZSBwb3NpdGlvbnMgZm9yIGEgdG9vbHRpcC4gKi9cbmV4cG9ydCB0eXBlIFRvb2x0aXBQb3NpdGlvbiA9ICdsZWZ0JyB8ICdyaWdodCcgfCAnYWJvdmUnIHwgJ2JlbG93JyB8ICdiZWZvcmUnIHwgJ2FmdGVyJztcblxuLyoqXG4gKiBPcHRpb25zIGZvciBob3cgdGhlIHRvb2x0aXAgdHJpZ2dlciBzaG91bGQgaGFuZGxlIHRvdWNoIGdlc3R1cmVzLlxuICogU2VlIGBNYXRUb29sdGlwLnRvdWNoR2VzdHVyZXNgIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgdHlwZSBUb29sdGlwVG91Y2hHZXN0dXJlcyA9ICdhdXRvJyB8ICdvbicgfCAnb2ZmJztcblxuLyoqIFBvc3NpYmxlIHZpc2liaWxpdHkgc3RhdGVzIG9mIGEgdG9vbHRpcC4gKi9cbmV4cG9ydCB0eXBlIFRvb2x0aXBWaXNpYmlsaXR5ID0gJ2luaXRpYWwnIHwgJ3Zpc2libGUnIHwgJ2hpZGRlbic7XG5cbi8qKiBUaW1lIGluIG1zIHRvIHRocm90dGxlIHJlcG9zaXRpb25pbmcgYWZ0ZXIgc2Nyb2xsIGV2ZW50cy4gKi9cbmV4cG9ydCBjb25zdCBTQ1JPTExfVEhST1RUTEVfTVMgPSAyMDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGVycm9yIHRvIGJlIHRocm93biBpZiB0aGUgdXNlciBzdXBwbGllZCBhbiBpbnZhbGlkIHRvb2x0aXAgcG9zaXRpb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRUb29sdGlwSW52YWxpZFBvc2l0aW9uRXJyb3IocG9zaXRpb246IHN0cmluZykge1xuICByZXR1cm4gRXJyb3IoYFRvb2x0aXAgcG9zaXRpb24gXCIke3Bvc2l0aW9ufVwiIGlzIGludmFsaWQuYCk7XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgYSB0b29sdGlwIGlzIHZpc2libGUuICovXG5leHBvcnQgY29uc3QgTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZID0gbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PihcbiAgJ21hdC10b29sdGlwLXNjcm9sbC1zdHJhdGVneScsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogKCkgPT4ge1xuICAgICAgY29uc3Qgb3ZlcmxheSA9IGluamVjdChPdmVybGF5KTtcbiAgICAgIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbih7c2Nyb2xsVGhyb3R0bGU6IFNDUk9MTF9USFJPVFRMRV9NU30pO1xuICAgIH0sXG4gIH0sXG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbih7c2Nyb2xsVGhyb3R0bGU6IFNDUk9MTF9USFJPVFRMRV9NU30pO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlksXG59O1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9UT09MVElQX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE1hdFRvb2x0aXBEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgc2hvd0RlbGF5OiAwLFxuICAgIGhpZGVEZWxheTogMCxcbiAgICB0b3VjaGVuZEhpZGVEZWxheTogMTUwMCxcbiAgfTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXRUb29sdGlwYC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfVE9PTFRJUF9ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0VG9vbHRpcERlZmF1bHRPcHRpb25zPihcbiAgJ21hdC10b29sdGlwLWRlZmF1bHQtb3B0aW9ucycsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogTUFUX1RPT0xUSVBfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlksXG4gIH0sXG4pO1xuXG4vKiogRGVmYXVsdCBgbWF0VG9vbHRpcGAgb3B0aW9ucyB0aGF0IGNhbiBiZSBvdmVycmlkZGVuLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRUb29sdGlwRGVmYXVsdE9wdGlvbnMge1xuICAvKiogRGVmYXVsdCBkZWxheSB3aGVuIHRoZSB0b29sdGlwIGlzIHNob3duLiAqL1xuICBzaG93RGVsYXk6IG51bWJlcjtcblxuICAvKiogRGVmYXVsdCBkZWxheSB3aGVuIHRoZSB0b29sdGlwIGlzIGhpZGRlbi4gKi9cbiAgaGlkZURlbGF5OiBudW1iZXI7XG5cbiAgLyoqIERlZmF1bHQgZGVsYXkgd2hlbiBoaWRpbmcgdGhlIHRvb2x0aXAgb24gYSB0b3VjaCBkZXZpY2UuICovXG4gIHRvdWNoZW5kSGlkZURlbGF5OiBudW1iZXI7XG5cbiAgLyoqIERlZmF1bHQgdG91Y2ggZ2VzdHVyZSBoYW5kbGluZyBmb3IgdG9vbHRpcHMuICovXG4gIHRvdWNoR2VzdHVyZXM/OiBUb29sdGlwVG91Y2hHZXN0dXJlcztcblxuICAvKiogRGVmYXVsdCBwb3NpdGlvbiBmb3IgdG9vbHRpcHMuICovXG4gIHBvc2l0aW9uPzogVG9vbHRpcFBvc2l0aW9uO1xuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHZhbHVlIGZvciB3aGV0aGVyIHRvb2x0aXBzIHNob3VsZCBiZSBwb3NpdGlvbmVkIG5lYXIgdGhlIGNsaWNrIG9yIHRvdWNoIG9yaWdpblxuICAgKiBpbnN0ZWFkIG9mIG91dHNpZGUgdGhlIGVsZW1lbnQgYm91bmRpbmcgYm94LlxuICAgKi9cbiAgcG9zaXRpb25BdE9yaWdpbj86IGJvb2xlYW47XG5cbiAgLyoqIERpc2FibGVzIHRoZSBhYmlsaXR5IGZvciB0aGUgdXNlciB0byBpbnRlcmFjdCB3aXRoIHRoZSB0b29sdGlwIGVsZW1lbnQuICovXG4gIGRpc2FibGVUb29sdGlwSW50ZXJhY3Rpdml0eT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQ1NTIGNsYXNzIHRoYXQgd2lsbCBiZSBhdHRhY2hlZCB0byB0aGUgb3ZlcmxheSBwYW5lbC5cbiAqIEBkZXByZWNhdGVkXG4gKiBAYnJlYWtpbmctY2hhbmdlIDEzLjAuMCByZW1vdmUgdGhpcyB2YXJpYWJsZVxuICovXG5leHBvcnQgY29uc3QgVE9PTFRJUF9QQU5FTF9DTEFTUyA9ICdtYXQtbWRjLXRvb2x0aXAtcGFuZWwnO1xuXG5jb25zdCBQQU5FTF9DTEFTUyA9ICd0b29sdGlwLXBhbmVsJztcblxuLyoqIE9wdGlvbnMgdXNlZCB0byBiaW5kIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXJzLiAqL1xuY29uc3QgcGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe3Bhc3NpdmU6IHRydWV9KTtcblxuLyoqXG4gKiBUaW1lIGJldHdlZW4gdGhlIHVzZXIgcHV0dGluZyB0aGUgcG9pbnRlciBvbiBhIHRvb2x0aXBcbiAqIHRyaWdnZXIgYW5kIHRoZSBsb25nIHByZXNzIGV2ZW50IGJlaW5nIGZpcmVkLlxuICovXG5jb25zdCBMT05HUFJFU1NfREVMQVkgPSA1MDA7XG5cbi8vIFRoZXNlIGNvbnN0YW50cyB3ZXJlIHRha2VuIGZyb20gTURDJ3MgYG51bWJlcnNgIG9iamVjdC4gV2UgY2FuJ3QgaW1wb3J0IHRoZW0gZnJvbSBNREMsXG4vLyBiZWNhdXNlIHRoZXkgaGF2ZSBzb21lIHRvcC1sZXZlbCByZWZlcmVuY2VzIHRvIGB3aW5kb3dgIHdoaWNoIGJyZWFrIGR1cmluZyBTU1IuXG5jb25zdCBNSU5fVklFV1BPUlRfVE9PTFRJUF9USFJFU0hPTEQgPSA4O1xuY29uc3QgVU5CT1VOREVEX0FOQ0hPUl9HQVAgPSA4O1xuY29uc3QgTUlOX0hFSUdIVCA9IDI0O1xuY29uc3QgTUFYX1dJRFRIID0gMjAwO1xuXG4vKipcbiAqIERpcmVjdGl2ZSB0aGF0IGF0dGFjaGVzIGEgbWF0ZXJpYWwgZGVzaWduIHRvb2x0aXAgdG8gdGhlIGhvc3QgZWxlbWVudC4gQW5pbWF0ZXMgdGhlIHNob3dpbmcgYW5kXG4gKiBoaWRpbmcgb2YgYSB0b29sdGlwIHByb3ZpZGVkIHBvc2l0aW9uIChkZWZhdWx0cyB0byBiZWxvdyB0aGUgZWxlbWVudCkuXG4gKlxuICogaHR0cHM6Ly9tYXRlcmlhbC5pby9kZXNpZ24vY29tcG9uZW50cy90b29sdGlwcy5odG1sXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUb29sdGlwXScsXG4gIGV4cG9ydEFzOiAnbWF0VG9vbHRpcCcsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy10b29sdGlwLXRyaWdnZXInLFxuICAgICdbY2xhc3MubWF0LW1kYy10b29sdGlwLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gIH0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRvb2x0aXAgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZiB8IG51bGw7XG4gIF90b29sdGlwSW5zdGFuY2U6IFRvb2x0aXBDb21wb25lbnQgfCBudWxsO1xuXG4gIHByaXZhdGUgX3BvcnRhbDogQ29tcG9uZW50UG9ydGFsPFRvb2x0aXBDb21wb25lbnQ+O1xuICBwcml2YXRlIF9wb3NpdGlvbjogVG9vbHRpcFBvc2l0aW9uID0gJ2JlbG93JztcbiAgcHJpdmF0ZSBfcG9zaXRpb25BdE9yaWdpbjogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIF90b29sdGlwQ2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz4gfCB7W2tleTogc3RyaW5nXTogYW55fTtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuICBwcml2YXRlIF92aWV3SW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfcG9pbnRlckV4aXRFdmVudHNJbml0aWFsaXplZCA9IGZhbHNlO1xuICBwcml2YXRlIHJlYWRvbmx5IF90b29sdGlwQ29tcG9uZW50ID0gVG9vbHRpcENvbXBvbmVudDtcbiAgcHJpdmF0ZSBfdmlld3BvcnRNYXJnaW4gPSA4O1xuICBwcml2YXRlIF9jdXJyZW50UG9zaXRpb246IFRvb2x0aXBQb3NpdGlvbjtcbiAgcHJpdmF0ZSByZWFkb25seSBfY3NzQ2xhc3NQcmVmaXg6IHN0cmluZyA9ICdtYXQtbWRjJztcblxuICAvKiogQWxsb3dzIHRoZSB1c2VyIHRvIGRlZmluZSB0aGUgcG9zaXRpb24gb2YgdGhlIHRvb2x0aXAgcmVsYXRpdmUgdG8gdGhlIHBhcmVudCBlbGVtZW50ICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcFBvc2l0aW9uJylcbiAgZ2V0IHBvc2l0aW9uKCk6IFRvb2x0aXBQb3NpdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xuICB9XG5cbiAgc2V0IHBvc2l0aW9uKHZhbHVlOiBUb29sdGlwUG9zaXRpb24pIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX3Bvc2l0aW9uKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbiA9IHZhbHVlO1xuXG4gICAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbih0aGlzLl9vdmVybGF5UmVmKTtcbiAgICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlPy5zaG93KDApO1xuICAgICAgICB0aGlzLl9vdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG9vbHRpcCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGNsaWNrIG9yIHRvdWNoIG9yaWdpblxuICAgKiBpbnN0ZWFkIG9mIG91dHNpZGUgdGhlIGVsZW1lbnQgYm91bmRpbmcgYm94LlxuICAgKi9cbiAgQElucHV0KCdtYXRUb29sdGlwUG9zaXRpb25BdE9yaWdpbicpXG4gIGdldCBwb3NpdGlvbkF0T3JpZ2luKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbkF0T3JpZ2luO1xuICB9XG5cbiAgc2V0IHBvc2l0aW9uQXRPcmlnaW4odmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3Bvc2l0aW9uQXRPcmlnaW4gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX2RldGFjaCgpO1xuICAgIHRoaXMuX292ZXJsYXlSZWYgPSBudWxsO1xuICB9XG5cbiAgLyoqIERpc2FibGVzIHRoZSBkaXNwbGF5IG9mIHRoZSB0b29sdGlwLiAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBEaXNhYmxlZCcpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cblxuICBzZXQgZGlzYWJsZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIC8vIElmIHRvb2x0aXAgaXMgZGlzYWJsZWQsIGhpZGUgaW1tZWRpYXRlbHkuXG4gICAgaWYgKHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICB0aGlzLmhpZGUoMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldHVwUG9pbnRlckVudGVyRXZlbnRzSWZOZWVkZWQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogVGhlIGRlZmF1bHQgZGVsYXkgaW4gbXMgYmVmb3JlIHNob3dpbmcgdGhlIHRvb2x0aXAgYWZ0ZXIgc2hvdyBpcyBjYWxsZWQgKi9cbiAgQElucHV0KCdtYXRUb29sdGlwU2hvd0RlbGF5JylcbiAgZ2V0IHNob3dEZWxheSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zaG93RGVsYXk7XG4gIH1cblxuICBzZXQgc2hvd0RlbGF5KHZhbHVlOiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX3Nob3dEZWxheSA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Nob3dEZWxheTogbnVtYmVyO1xuXG4gIC8qKiBUaGUgZGVmYXVsdCBkZWxheSBpbiBtcyBiZWZvcmUgaGlkaW5nIHRoZSB0b29sdGlwIGFmdGVyIGhpZGUgaXMgY2FsbGVkICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcEhpZGVEZWxheScpXG4gIGdldCBoaWRlRGVsYXkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZURlbGF5O1xuICB9XG5cbiAgc2V0IGhpZGVEZWxheSh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9oaWRlRGVsYXkgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UuX21vdXNlTGVhdmVIaWRlRGVsYXkgPSB0aGlzLl9oaWRlRGVsYXk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaGlkZURlbGF5OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEhvdyB0b3VjaCBnZXN0dXJlcyBzaG91bGQgYmUgaGFuZGxlZCBieSB0aGUgdG9vbHRpcC4gT24gdG91Y2ggZGV2aWNlcyB0aGUgdG9vbHRpcCBkaXJlY3RpdmVcbiAgICogdXNlcyBhIGxvbmcgcHJlc3MgZ2VzdHVyZSB0byBzaG93IGFuZCBoaWRlLCBob3dldmVyIGl0IGNhbiBjb25mbGljdCB3aXRoIHRoZSBuYXRpdmUgYnJvd3NlclxuICAgKiBnZXN0dXJlcy4gVG8gd29yayBhcm91bmQgdGhlIGNvbmZsaWN0LCBBbmd1bGFyIE1hdGVyaWFsIGRpc2FibGVzIG5hdGl2ZSBnZXN0dXJlcyBvbiB0aGVcbiAgICogdHJpZ2dlciwgYnV0IHRoYXQgbWlnaHQgbm90IGJlIGRlc2lyYWJsZSBvbiBwYXJ0aWN1bGFyIGVsZW1lbnRzIChlLmcuIGlucHV0cyBhbmQgZHJhZ2dhYmxlXG4gICAqIGVsZW1lbnRzKS4gVGhlIGRpZmZlcmVudCB2YWx1ZXMgZm9yIHRoaXMgb3B0aW9uIGNvbmZpZ3VyZSB0aGUgdG91Y2ggZXZlbnQgaGFuZGxpbmcgYXMgZm9sbG93czpcbiAgICogLSBgYXV0b2AgLSBFbmFibGVzIHRvdWNoIGdlc3R1cmVzIGZvciBhbGwgZWxlbWVudHMsIGJ1dCB0cmllcyB0byBhdm9pZCBjb25mbGljdHMgd2l0aCBuYXRpdmVcbiAgICogICBicm93c2VyIGdlc3R1cmVzIG9uIHBhcnRpY3VsYXIgZWxlbWVudHMuIEluIHBhcnRpY3VsYXIsIGl0IGFsbG93cyB0ZXh0IHNlbGVjdGlvbiBvbiBpbnB1dHNcbiAgICogICBhbmQgdGV4dGFyZWFzLCBhbmQgcHJlc2VydmVzIHRoZSBuYXRpdmUgYnJvd3NlciBkcmFnZ2luZyBvbiBlbGVtZW50cyBtYXJrZWQgYXMgYGRyYWdnYWJsZWAuXG4gICAqIC0gYG9uYCAtIEVuYWJsZXMgdG91Y2ggZ2VzdHVyZXMgZm9yIGFsbCBlbGVtZW50cyBhbmQgZGlzYWJsZXMgbmF0aXZlXG4gICAqICAgYnJvd3NlciBnZXN0dXJlcyB3aXRoIG5vIGV4Y2VwdGlvbnMuXG4gICAqIC0gYG9mZmAgLSBEaXNhYmxlcyB0b3VjaCBnZXN0dXJlcy4gTm90ZSB0aGF0IHRoaXMgd2lsbCBwcmV2ZW50IHRoZSB0b29sdGlwIGZyb21cbiAgICogICBzaG93aW5nIG9uIHRvdWNoIGRldmljZXMuXG4gICAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBUb3VjaEdlc3R1cmVzJykgdG91Y2hHZXN0dXJlczogVG9vbHRpcFRvdWNoR2VzdHVyZXMgPSAnYXV0byc7XG5cbiAgLyoqIFRoZSBtZXNzYWdlIHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgdG9vbHRpcCAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXAnKVxuICBnZXQgbWVzc2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZTtcbiAgfVxuXG4gIHNldCBtZXNzYWdlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLnJlbW92ZURlc2NyaXB0aW9uKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5fbWVzc2FnZSwgJ3Rvb2x0aXAnKTtcblxuICAgIC8vIElmIHRoZSBtZXNzYWdlIGlzIG5vdCBhIHN0cmluZyAoZS5nLiBudW1iZXIpLCBjb252ZXJ0IGl0IHRvIGEgc3RyaW5nIGFuZCB0cmltIGl0LlxuICAgIC8vIE11c3QgY29udmVydCB3aXRoIGBTdHJpbmcodmFsdWUpYCwgbm90IGAke3ZhbHVlfWAsIG90aGVyd2lzZSBDbG9zdXJlIENvbXBpbGVyIG9wdGltaXNlc1xuICAgIC8vIGF3YXkgdGhlIHN0cmluZy1jb252ZXJzaW9uOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8yMDY4NFxuICAgIHRoaXMuX21lc3NhZ2UgPSB2YWx1ZSAhPSBudWxsID8gU3RyaW5nKHZhbHVlKS50cmltKCkgOiAnJztcblxuICAgIGlmICghdGhpcy5fbWVzc2FnZSAmJiB0aGlzLl9pc1Rvb2x0aXBWaXNpYmxlKCkpIHtcbiAgICAgIHRoaXMuaGlkZSgwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2V0dXBQb2ludGVyRW50ZXJFdmVudHNJZk5lZWRlZCgpO1xuICAgICAgdGhpcy5fdXBkYXRlVG9vbHRpcE1lc3NhZ2UoKTtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIC8vIFRoZSBgQXJpYURlc2NyaWJlcmAgaGFzIHNvbWUgZnVuY3Rpb25hbGl0eSB0aGF0IGF2b2lkcyBhZGRpbmcgYSBkZXNjcmlwdGlvbiBpZiBpdCdzIHRoZVxuICAgICAgICAvLyBzYW1lIGFzIHRoZSBgYXJpYS1sYWJlbGAgb2YgYW4gZWxlbWVudCwgaG93ZXZlciB3ZSBjYW4ndCBrbm93IHdoZXRoZXIgdGhlIHRvb2x0aXAgdHJpZ2dlclxuICAgICAgICAvLyBoYXMgYSBkYXRhLWJvdW5kIGBhcmlhLWxhYmVsYCBvciB3aGVuIGl0J2xsIGJlIHNldCBmb3IgdGhlIGZpcnN0IHRpbWUuIFdlIGNhbiBhdm9pZCB0aGVcbiAgICAgICAgLy8gaXNzdWUgYnkgZGVmZXJyaW5nIHRoZSBkZXNjcmlwdGlvbiBieSBhIHRpY2sgc28gQW5ndWxhciBoYXMgdGltZSB0byBzZXQgdGhlIGBhcmlhLWxhYmVsYC5cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fYXJpYURlc2NyaWJlci5kZXNjcmliZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMubWVzc2FnZSwgJ3Rvb2x0aXAnKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9tZXNzYWdlID0gJyc7XG5cbiAgLyoqIENsYXNzZXMgdG8gYmUgcGFzc2VkIHRvIHRoZSB0b29sdGlwLiBTdXBwb3J0cyB0aGUgc2FtZSBzeW50YXggYXMgYG5nQ2xhc3NgLiAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBDbGFzcycpXG4gIGdldCB0b29sdGlwQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rvb2x0aXBDbGFzcztcbiAgfVxuXG4gIHNldCB0b29sdGlwQ2xhc3ModmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz4gfCB7W2tleTogc3RyaW5nXTogYW55fSkge1xuICAgIHRoaXMuX3Rvb2x0aXBDbGFzcyA9IHZhbHVlO1xuICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX3NldFRvb2x0aXBDbGFzcyh0aGlzLl90b29sdGlwQ2xhc3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBNYW51YWxseS1ib3VuZCBwYXNzaXZlIGV2ZW50IGxpc3RlbmVycy4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfcGFzc2l2ZUxpc3RlbmVyczogKHJlYWRvbmx5IFtzdHJpbmcsIEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3RdKVtdID1cbiAgICBbXTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IGRvY3VtZW50LiAqL1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqIFRpbWVyIHN0YXJ0ZWQgYXQgdGhlIGxhc3QgYHRvdWNoc3RhcnRgIGV2ZW50LiAqL1xuICBwcml2YXRlIF90b3VjaHN0YXJ0VGltZW91dDogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD47XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9zY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHByaXZhdGUgX2FyaWFEZXNjcmliZXI6IEFyaWFEZXNjcmliZXIsXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgQEluamVjdChNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1kpIHNjcm9sbFN0cmF0ZWd5OiBhbnksXG4gICAgcHJvdGVjdGVkIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfVE9PTFRJUF9ERUZBVUxUX09QVElPTlMpXG4gICAgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM6IE1hdFRvb2x0aXBEZWZhdWx0T3B0aW9ucyxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBfZG9jdW1lbnQ6IGFueSxcbiAgKSB7XG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcbiAgICB0aGlzLl9kb2N1bWVudCA9IF9kb2N1bWVudDtcblxuICAgIGlmIChfZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgIHRoaXMuX3Nob3dEZWxheSA9IF9kZWZhdWx0T3B0aW9ucy5zaG93RGVsYXk7XG4gICAgICB0aGlzLl9oaWRlRGVsYXkgPSBfZGVmYXVsdE9wdGlvbnMuaGlkZURlbGF5O1xuXG4gICAgICBpZiAoX2RlZmF1bHRPcHRpb25zLnBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBfZGVmYXVsdE9wdGlvbnMucG9zaXRpb247XG4gICAgICB9XG5cbiAgICAgIGlmIChfZGVmYXVsdE9wdGlvbnMucG9zaXRpb25BdE9yaWdpbikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uQXRPcmlnaW4gPSBfZGVmYXVsdE9wdGlvbnMucG9zaXRpb25BdE9yaWdpbjtcbiAgICAgIH1cblxuICAgICAgaWYgKF9kZWZhdWx0T3B0aW9ucy50b3VjaEdlc3R1cmVzKSB7XG4gICAgICAgIHRoaXMudG91Y2hHZXN0dXJlcyA9IF9kZWZhdWx0T3B0aW9ucy50b3VjaEdlc3R1cmVzO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9kaXIuY2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbih0aGlzLl9vdmVybGF5UmVmKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX3ZpZXdwb3J0TWFyZ2luID0gTUlOX1ZJRVdQT1JUX1RPT0xUSVBfVEhSRVNIT0xEO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIFRoaXMgbmVlZHMgdG8gaGFwcGVuIGFmdGVyIHZpZXcgaW5pdCBzbyB0aGUgaW5pdGlhbCB2YWx1ZXMgZm9yIGFsbCBpbnB1dHMgaGF2ZSBiZWVuIHNldC5cbiAgICB0aGlzLl92aWV3SW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHRoaXMuX3NldHVwUG9pbnRlckVudGVyRXZlbnRzSWZOZWVkZWQoKTtcblxuICAgIHRoaXMuX2ZvY3VzTW9uaXRvclxuICAgICAgLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZilcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZShvcmlnaW4gPT4ge1xuICAgICAgICAvLyBOb3RlIHRoYXQgdGhlIGZvY3VzIG1vbml0b3IgcnVucyBvdXRzaWRlIHRoZSBBbmd1bGFyIHpvbmUuXG4gICAgICAgIGlmICghb3JpZ2luKSB7XG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLmhpZGUoMCkpO1xuICAgICAgICB9IGVsc2UgaWYgKG9yaWdpbiA9PT0gJ2tleWJvYXJkJykge1xuICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5zaG93KCkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwb3NlIHRoZSB0b29sdGlwIHdoZW4gZGVzdHJveWVkLlxuICAgKi9cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGNsZWFyVGltZW91dCh0aGlzLl90b3VjaHN0YXJ0VGltZW91dCk7XG5cbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIENsZWFuIHVwIHRoZSBldmVudCBsaXN0ZW5lcnMgc2V0IGluIHRoZSBjb25zdHJ1Y3RvclxuICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnMuZm9yRWFjaCgoW2V2ZW50LCBsaXN0ZW5lcl0pID0+IHtcbiAgICAgIG5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIHBhc3NpdmVMaXN0ZW5lck9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnMubGVuZ3RoID0gMDtcblxuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG5cbiAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLnJlbW92ZURlc2NyaXB0aW9uKG5hdGl2ZUVsZW1lbnQsIHRoaXMubWVzc2FnZSwgJ3Rvb2x0aXAnKTtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcobmF0aXZlRWxlbWVudCk7XG4gIH1cblxuICAvKiogU2hvd3MgdGhlIHRvb2x0aXAgYWZ0ZXIgdGhlIGRlbGF5IGluIG1zLCBkZWZhdWx0cyB0byB0b29sdGlwLWRlbGF5LXNob3cgb3IgMG1zIGlmIG5vIGlucHV0ICovXG4gIHNob3coZGVsYXk6IG51bWJlciA9IHRoaXMuc2hvd0RlbGF5LCBvcmlnaW4/OiB7eDogbnVtYmVyOyB5OiBudW1iZXJ9KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgIXRoaXMubWVzc2FnZSB8fCB0aGlzLl9pc1Rvb2x0aXBWaXNpYmxlKCkpIHtcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZT8uX2NhbmNlbFBlbmRpbmdBbmltYXRpb25zKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXkob3JpZ2luKTtcbiAgICB0aGlzLl9kZXRhY2goKTtcbiAgICB0aGlzLl9wb3J0YWwgPVxuICAgICAgdGhpcy5fcG9ydGFsIHx8IG5ldyBDb21wb25lbnRQb3J0YWwodGhpcy5fdG9vbHRpcENvbXBvbmVudCwgdGhpcy5fdmlld0NvbnRhaW5lclJlZik7XG4gICAgY29uc3QgaW5zdGFuY2UgPSAodGhpcy5fdG9vbHRpcEluc3RhbmNlID0gb3ZlcmxheVJlZi5hdHRhY2godGhpcy5fcG9ydGFsKS5pbnN0YW5jZSk7XG4gICAgaW5zdGFuY2UuX3RyaWdnZXJFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGluc3RhbmNlLl9tb3VzZUxlYXZlSGlkZURlbGF5ID0gdGhpcy5faGlkZURlbGF5O1xuICAgIGluc3RhbmNlXG4gICAgICAuYWZ0ZXJIaWRkZW4oKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2RldGFjaCgpKTtcbiAgICB0aGlzLl9zZXRUb29sdGlwQ2xhc3ModGhpcy5fdG9vbHRpcENsYXNzKTtcbiAgICB0aGlzLl91cGRhdGVUb29sdGlwTWVzc2FnZSgpO1xuICAgIGluc3RhbmNlLnNob3coZGVsYXkpO1xuICB9XG5cbiAgLyoqIEhpZGVzIHRoZSB0b29sdGlwIGFmdGVyIHRoZSBkZWxheSBpbiBtcywgZGVmYXVsdHMgdG8gdG9vbHRpcC1kZWxheS1oaWRlIG9yIDBtcyBpZiBubyBpbnB1dCAqL1xuICBoaWRlKGRlbGF5OiBudW1iZXIgPSB0aGlzLmhpZGVEZWxheSk6IHZvaWQge1xuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5fdG9vbHRpcEluc3RhbmNlO1xuXG4gICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICBpZiAoaW5zdGFuY2UuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgaW5zdGFuY2UuaGlkZShkZWxheSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnN0YW5jZS5fY2FuY2VsUGVuZGluZ0FuaW1hdGlvbnMoKTtcbiAgICAgICAgdGhpcy5fZGV0YWNoKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFNob3dzL2hpZGVzIHRoZSB0b29sdGlwICovXG4gIHRvZ2dsZShvcmlnaW4/OiB7eDogbnVtYmVyOyB5OiBudW1iZXJ9KTogdm9pZCB7XG4gICAgdGhpcy5faXNUb29sdGlwVmlzaWJsZSgpID8gdGhpcy5oaWRlKCkgOiB0aGlzLnNob3codW5kZWZpbmVkLCBvcmlnaW4pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdG9vbHRpcCBpcyBjdXJyZW50bHkgdmlzaWJsZSB0byB0aGUgdXNlciAqL1xuICBfaXNUb29sdGlwVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLl90b29sdGlwSW5zdGFuY2UgJiYgdGhpcy5fdG9vbHRpcEluc3RhbmNlLmlzVmlzaWJsZSgpO1xuICB9XG5cbiAgLyoqIENyZWF0ZSB0aGUgb3ZlcmxheSBjb25maWcgYW5kIHBvc2l0aW9uIHN0cmF0ZWd5ICovXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkob3JpZ2luPzoge3g6IG51bWJlcjsgeTogbnVtYmVyfSk6IE92ZXJsYXlSZWYge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICBjb25zdCBleGlzdGluZ1N0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheVJlZi5nZXRDb25maWcoKVxuICAgICAgICAucG9zaXRpb25TdHJhdGVneSBhcyBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3k7XG5cbiAgICAgIGlmICgoIXRoaXMucG9zaXRpb25BdE9yaWdpbiB8fCAhb3JpZ2luKSAmJiBleGlzdGluZ1N0cmF0ZWd5Ll9vcmlnaW4gaW5zdGFuY2VvZiBFbGVtZW50UmVmKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9kZXRhY2goKTtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JvbGxhYmxlQW5jZXN0b3JzID0gdGhpcy5fc2Nyb2xsRGlzcGF0Y2hlci5nZXRBbmNlc3RvclNjcm9sbENvbnRhaW5lcnMoXG4gICAgICB0aGlzLl9lbGVtZW50UmVmLFxuICAgICk7XG5cbiAgICAvLyBDcmVhdGUgY29ubmVjdGVkIHBvc2l0aW9uIHN0cmF0ZWd5IHRoYXQgbGlzdGVucyBmb3Igc2Nyb2xsIGV2ZW50cyB0byByZXBvc2l0aW9uLlxuICAgIGNvbnN0IHN0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheVxuICAgICAgLnBvc2l0aW9uKClcbiAgICAgIC5mbGV4aWJsZUNvbm5lY3RlZFRvKHRoaXMucG9zaXRpb25BdE9yaWdpbiA/IG9yaWdpbiB8fCB0aGlzLl9lbGVtZW50UmVmIDogdGhpcy5fZWxlbWVudFJlZilcbiAgICAgIC53aXRoVHJhbnNmb3JtT3JpZ2luT24oYC4ke3RoaXMuX2Nzc0NsYXNzUHJlZml4fS10b29sdGlwYClcbiAgICAgIC53aXRoRmxleGlibGVEaW1lbnNpb25zKGZhbHNlKVxuICAgICAgLndpdGhWaWV3cG9ydE1hcmdpbih0aGlzLl92aWV3cG9ydE1hcmdpbilcbiAgICAgIC53aXRoU2Nyb2xsYWJsZUNvbnRhaW5lcnMoc2Nyb2xsYWJsZUFuY2VzdG9ycyk7XG5cbiAgICBzdHJhdGVneS5wb3NpdGlvbkNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKGNoYW5nZSA9PiB7XG4gICAgICB0aGlzLl91cGRhdGVDdXJyZW50UG9zaXRpb25DbGFzcyhjaGFuZ2UuY29ubmVjdGlvblBhaXIpO1xuXG4gICAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICAgIGlmIChjaGFuZ2Uuc2Nyb2xsYWJsZVZpZXdQcm9wZXJ0aWVzLmlzT3ZlcmxheUNsaXBwZWQgJiYgdGhpcy5fdG9vbHRpcEluc3RhbmNlLmlzVmlzaWJsZSgpKSB7XG4gICAgICAgICAgLy8gQWZ0ZXIgcG9zaXRpb24gY2hhbmdlcyBvY2N1ciBhbmQgdGhlIG92ZXJsYXkgaXMgY2xpcHBlZCBieVxuICAgICAgICAgIC8vIGEgcGFyZW50IHNjcm9sbGFibGUgdGhlbiBjbG9zZSB0aGUgdG9vbHRpcC5cbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMuaGlkZSgwKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX292ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5LmNyZWF0ZSh7XG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpcixcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IHN0cmF0ZWd5LFxuICAgICAgcGFuZWxDbGFzczogYCR7dGhpcy5fY3NzQ2xhc3NQcmVmaXh9LSR7UEFORUxfQ0xBU1N9YCxcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLl9zY3JvbGxTdHJhdGVneSgpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5fdXBkYXRlUG9zaXRpb24odGhpcy5fb3ZlcmxheVJlZik7XG5cbiAgICB0aGlzLl9vdmVybGF5UmVmXG4gICAgICAuZGV0YWNobWVudHMoKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2RldGFjaCgpKTtcblxuICAgIHRoaXMuX292ZXJsYXlSZWZcbiAgICAgIC5vdXRzaWRlUG9pbnRlckV2ZW50cygpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fdG9vbHRpcEluc3RhbmNlPy5faGFuZGxlQm9keUludGVyYWN0aW9uKCkpO1xuXG4gICAgdGhpcy5fb3ZlcmxheVJlZlxuICAgICAgLmtleWRvd25FdmVudHMoKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2lzVG9vbHRpcFZpc2libGUoKSAmJiBldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLmhpZGUoMCkpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGlmICh0aGlzLl9kZWZhdWx0T3B0aW9ucz8uZGlzYWJsZVRvb2x0aXBJbnRlcmFjdGl2aXR5KSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmFkZFBhbmVsQ2xhc3MoYCR7dGhpcy5fY3NzQ2xhc3NQcmVmaXh9LXRvb2x0aXAtcGFuZWwtbm9uLWludGVyYWN0aXZlYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWY7XG4gIH1cblxuICAvKiogRGV0YWNoZXMgdGhlIGN1cnJlbnRseS1hdHRhY2hlZCB0b29sdGlwLiAqL1xuICBwcml2YXRlIF9kZXRhY2goKSB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYgJiYgdGhpcy5fb3ZlcmxheVJlZi5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRldGFjaCgpO1xuICAgIH1cblxuICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSA9IG51bGw7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2YgdGhlIGN1cnJlbnQgdG9vbHRpcC4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlUG9zaXRpb24ob3ZlcmxheVJlZjogT3ZlcmxheVJlZikge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gb3ZlcmxheVJlZi5nZXRDb25maWcoKS5wb3NpdGlvblN0cmF0ZWd5IGFzIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneTtcbiAgICBjb25zdCBvcmlnaW4gPSB0aGlzLl9nZXRPcmlnaW4oKTtcbiAgICBjb25zdCBvdmVybGF5ID0gdGhpcy5fZ2V0T3ZlcmxheVBvc2l0aW9uKCk7XG5cbiAgICBwb3NpdGlvbi53aXRoUG9zaXRpb25zKFtcbiAgICAgIHRoaXMuX2FkZE9mZnNldCh7Li4ub3JpZ2luLm1haW4sIC4uLm92ZXJsYXkubWFpbn0pLFxuICAgICAgdGhpcy5fYWRkT2Zmc2V0KHsuLi5vcmlnaW4uZmFsbGJhY2ssIC4uLm92ZXJsYXkuZmFsbGJhY2t9KSxcbiAgICBdKTtcbiAgfVxuXG4gIC8qKiBBZGRzIHRoZSBjb25maWd1cmVkIG9mZnNldCB0byBhIHBvc2l0aW9uLiBVc2VkIGFzIGEgaG9vayBmb3IgY2hpbGQgY2xhc3Nlcy4gKi9cbiAgcHJvdGVjdGVkIF9hZGRPZmZzZXQocG9zaXRpb246IENvbm5lY3RlZFBvc2l0aW9uKTogQ29ubmVjdGVkUG9zaXRpb24ge1xuICAgIGNvbnN0IG9mZnNldCA9IFVOQk9VTkRFRF9BTkNIT1JfR0FQO1xuICAgIGNvbnN0IGlzTHRyID0gIXRoaXMuX2RpciB8fCB0aGlzLl9kaXIudmFsdWUgPT0gJ2x0cic7XG5cbiAgICBpZiAocG9zaXRpb24ub3JpZ2luWSA9PT0gJ3RvcCcpIHtcbiAgICAgIHBvc2l0aW9uLm9mZnNldFkgPSAtb2Zmc2V0O1xuICAgIH0gZWxzZSBpZiAocG9zaXRpb24ub3JpZ2luWSA9PT0gJ2JvdHRvbScpIHtcbiAgICAgIHBvc2l0aW9uLm9mZnNldFkgPSBvZmZzZXQ7XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvbi5vcmlnaW5YID09PSAnc3RhcnQnKSB7XG4gICAgICBwb3NpdGlvbi5vZmZzZXRYID0gaXNMdHIgPyAtb2Zmc2V0IDogb2Zmc2V0O1xuICAgIH0gZWxzZSBpZiAocG9zaXRpb24ub3JpZ2luWCA9PT0gJ2VuZCcpIHtcbiAgICAgIHBvc2l0aW9uLm9mZnNldFggPSBpc0x0ciA/IG9mZnNldCA6IC1vZmZzZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvc2l0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9yaWdpbiBwb3NpdGlvbiBhbmQgYSBmYWxsYmFjayBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgdXNlcidzIHBvc2l0aW9uIHByZWZlcmVuY2UuXG4gICAqIFRoZSBmYWxsYmFjayBwb3NpdGlvbiBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgb3JpZ2luIChlLmcuIGAnYmVsb3cnIC0+ICdhYm92ZSdgKS5cbiAgICovXG4gIF9nZXRPcmlnaW4oKToge21haW46IE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbjsgZmFsbGJhY2s6IE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbn0ge1xuICAgIGNvbnN0IGlzTHRyID0gIXRoaXMuX2RpciB8fCB0aGlzLl9kaXIudmFsdWUgPT0gJ2x0cic7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xuICAgIGxldCBvcmlnaW5Qb3NpdGlvbjogT3JpZ2luQ29ubmVjdGlvblBvc2l0aW9uO1xuXG4gICAgaWYgKHBvc2l0aW9uID09ICdhYm92ZScgfHwgcG9zaXRpb24gPT0gJ2JlbG93Jykge1xuICAgICAgb3JpZ2luUG9zaXRpb24gPSB7b3JpZ2luWDogJ2NlbnRlcicsIG9yaWdpblk6IHBvc2l0aW9uID09ICdhYm92ZScgPyAndG9wJyA6ICdib3R0b20nfTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgcG9zaXRpb24gPT0gJ2JlZm9yZScgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAnbGVmdCcgJiYgaXNMdHIpIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ3JpZ2h0JyAmJiAhaXNMdHIpXG4gICAgKSB7XG4gICAgICBvcmlnaW5Qb3NpdGlvbiA9IHtvcmlnaW5YOiAnc3RhcnQnLCBvcmlnaW5ZOiAnY2VudGVyJ307XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBvc2l0aW9uID09ICdhZnRlcicgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAncmlnaHQnICYmIGlzTHRyKSB8fFxuICAgICAgKHBvc2l0aW9uID09ICdsZWZ0JyAmJiAhaXNMdHIpXG4gICAgKSB7XG4gICAgICBvcmlnaW5Qb3NpdGlvbiA9IHtvcmlnaW5YOiAnZW5kJywgb3JpZ2luWTogJ2NlbnRlcid9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICB0aHJvdyBnZXRNYXRUb29sdGlwSW52YWxpZFBvc2l0aW9uRXJyb3IocG9zaXRpb24pO1xuICAgIH1cblxuICAgIGNvbnN0IHt4LCB5fSA9IHRoaXMuX2ludmVydFBvc2l0aW9uKG9yaWdpblBvc2l0aW9uIS5vcmlnaW5YLCBvcmlnaW5Qb3NpdGlvbiEub3JpZ2luWSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbWFpbjogb3JpZ2luUG9zaXRpb24hLFxuICAgICAgZmFsbGJhY2s6IHtvcmlnaW5YOiB4LCBvcmlnaW5ZOiB5fSxcbiAgICB9O1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIG92ZXJsYXkgcG9zaXRpb24gYW5kIGEgZmFsbGJhY2sgcG9zaXRpb24gYmFzZWQgb24gdGhlIHVzZXIncyBwcmVmZXJlbmNlICovXG4gIF9nZXRPdmVybGF5UG9zaXRpb24oKToge21haW46IE92ZXJsYXlDb25uZWN0aW9uUG9zaXRpb247IGZhbGxiYWNrOiBPdmVybGF5Q29ubmVjdGlvblBvc2l0aW9ufSB7XG4gICAgY29uc3QgaXNMdHIgPSAhdGhpcy5fZGlyIHx8IHRoaXMuX2Rpci52YWx1ZSA9PSAnbHRyJztcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb247XG4gICAgbGV0IG92ZXJsYXlQb3NpdGlvbjogT3ZlcmxheUNvbm5lY3Rpb25Qb3NpdGlvbjtcblxuICAgIGlmIChwb3NpdGlvbiA9PSAnYWJvdmUnKSB7XG4gICAgICBvdmVybGF5UG9zaXRpb24gPSB7b3ZlcmxheVg6ICdjZW50ZXInLCBvdmVybGF5WTogJ2JvdHRvbSd9O1xuICAgIH0gZWxzZSBpZiAocG9zaXRpb24gPT0gJ2JlbG93Jykge1xuICAgICAgb3ZlcmxheVBvc2l0aW9uID0ge292ZXJsYXlYOiAnY2VudGVyJywgb3ZlcmxheVk6ICd0b3AnfTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgcG9zaXRpb24gPT0gJ2JlZm9yZScgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAnbGVmdCcgJiYgaXNMdHIpIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ3JpZ2h0JyAmJiAhaXNMdHIpXG4gICAgKSB7XG4gICAgICBvdmVybGF5UG9zaXRpb24gPSB7b3ZlcmxheVg6ICdlbmQnLCBvdmVybGF5WTogJ2NlbnRlcid9O1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBwb3NpdGlvbiA9PSAnYWZ0ZXInIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ3JpZ2h0JyAmJiBpc0x0cikgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAnbGVmdCcgJiYgIWlzTHRyKVxuICAgICkge1xuICAgICAgb3ZlcmxheVBvc2l0aW9uID0ge292ZXJsYXlYOiAnc3RhcnQnLCBvdmVybGF5WTogJ2NlbnRlcid9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICB0aHJvdyBnZXRNYXRUb29sdGlwSW52YWxpZFBvc2l0aW9uRXJyb3IocG9zaXRpb24pO1xuICAgIH1cblxuICAgIGNvbnN0IHt4LCB5fSA9IHRoaXMuX2ludmVydFBvc2l0aW9uKG92ZXJsYXlQb3NpdGlvbiEub3ZlcmxheVgsIG92ZXJsYXlQb3NpdGlvbiEub3ZlcmxheVkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1haW46IG92ZXJsYXlQb3NpdGlvbiEsXG4gICAgICBmYWxsYmFjazoge292ZXJsYXlYOiB4LCBvdmVybGF5WTogeX0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSB0b29sdGlwIG1lc3NhZ2UgYW5kIHJlcG9zaXRpb25zIHRoZSBvdmVybGF5IGFjY29yZGluZyB0byB0aGUgbmV3IG1lc3NhZ2UgbGVuZ3RoICovXG4gIHByaXZhdGUgX3VwZGF0ZVRvb2x0aXBNZXNzYWdlKCkge1xuICAgIC8vIE11c3Qgd2FpdCBmb3IgdGhlIG1lc3NhZ2UgdG8gYmUgcGFpbnRlZCB0byB0aGUgdG9vbHRpcCBzbyB0aGF0IHRoZSBvdmVybGF5IGNhbiBwcm9wZXJseVxuICAgIC8vIGNhbGN1bGF0ZSB0aGUgY29ycmVjdCBwb3NpdGlvbmluZyBiYXNlZCBvbiB0aGUgc2l6ZSBvZiB0aGUgdGV4dC5cbiAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UubWVzc2FnZSA9IHRoaXMubWVzc2FnZTtcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5fbWFya0ZvckNoZWNrKCk7XG5cbiAgICAgIHRoaXMuX25nWm9uZS5vbk1pY3JvdGFza0VtcHR5LnBpcGUodGFrZSgxKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgICAgICB0aGlzLl9vdmVybGF5UmVmIS51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgdG9vbHRpcCBjbGFzcyAqL1xuICBwcml2YXRlIF9zZXRUb29sdGlwQ2xhc3ModG9vbHRpcENsYXNzOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+IHwge1trZXk6IHN0cmluZ106IGFueX0pIHtcbiAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UudG9vbHRpcENsYXNzID0gdG9vbHRpcENsYXNzO1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLl9tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogSW52ZXJ0cyBhbiBvdmVybGF5IHBvc2l0aW9uLiAqL1xuICBwcml2YXRlIF9pbnZlcnRQb3NpdGlvbih4OiBIb3Jpem9udGFsQ29ubmVjdGlvblBvcywgeTogVmVydGljYWxDb25uZWN0aW9uUG9zKSB7XG4gICAgaWYgKHRoaXMucG9zaXRpb24gPT09ICdhYm92ZScgfHwgdGhpcy5wb3NpdGlvbiA9PT0gJ2JlbG93Jykge1xuICAgICAgaWYgKHkgPT09ICd0b3AnKSB7XG4gICAgICAgIHkgPSAnYm90dG9tJztcbiAgICAgIH0gZWxzZSBpZiAoeSA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgeSA9ICd0b3AnO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoeCA9PT0gJ2VuZCcpIHtcbiAgICAgICAgeCA9ICdzdGFydCc7XG4gICAgICB9IGVsc2UgaWYgKHggPT09ICdzdGFydCcpIHtcbiAgICAgICAgeCA9ICdlbmQnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7eCwgeX07XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgY2xhc3Mgb24gdGhlIG92ZXJsYXkgcGFuZWwgYmFzZWQgb24gdGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHRvb2x0aXAuICovXG4gIHByaXZhdGUgX3VwZGF0ZUN1cnJlbnRQb3NpdGlvbkNsYXNzKGNvbm5lY3Rpb25QYWlyOiBDb25uZWN0aW9uUG9zaXRpb25QYWlyKTogdm9pZCB7XG4gICAgY29uc3Qge292ZXJsYXlZLCBvcmlnaW5YLCBvcmlnaW5ZfSA9IGNvbm5lY3Rpb25QYWlyO1xuICAgIGxldCBuZXdQb3NpdGlvbjogVG9vbHRpcFBvc2l0aW9uO1xuXG4gICAgLy8gSWYgdGhlIG92ZXJsYXkgaXMgaW4gdGhlIG1pZGRsZSBhbG9uZyB0aGUgWSBheGlzLFxuICAgIC8vIGl0IG1lYW5zIHRoYXQgaXQncyBlaXRoZXIgYmVmb3JlIG9yIGFmdGVyLlxuICAgIGlmIChvdmVybGF5WSA9PT0gJ2NlbnRlcicpIHtcbiAgICAgIC8vIE5vdGUgdGhhdCBzaW5jZSB0aGlzIGluZm9ybWF0aW9uIGlzIHVzZWQgZm9yIHN0eWxpbmcsIHdlIHdhbnQgdG9cbiAgICAgIC8vIHJlc29sdmUgYHN0YXJ0YCBhbmQgYGVuZGAgdG8gdGhlaXIgcmVhbCB2YWx1ZXMsIG90aGVyd2lzZSBjb25zdW1lcnNcbiAgICAgIC8vIHdvdWxkIGhhdmUgdG8gcmVtZW1iZXIgdG8gZG8gaXQgdGhlbXNlbHZlcyBvbiBlYWNoIGNvbnN1bXB0aW9uLlxuICAgICAgaWYgKHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnKSB7XG4gICAgICAgIG5ld1Bvc2l0aW9uID0gb3JpZ2luWCA9PT0gJ2VuZCcgPyAnbGVmdCcgOiAncmlnaHQnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3UG9zaXRpb24gPSBvcmlnaW5YID09PSAnc3RhcnQnID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmV3UG9zaXRpb24gPSBvdmVybGF5WSA9PT0gJ2JvdHRvbScgJiYgb3JpZ2luWSA9PT0gJ3RvcCcgPyAnYWJvdmUnIDogJ2JlbG93JztcbiAgICB9XG5cbiAgICBpZiAobmV3UG9zaXRpb24gIT09IHRoaXMuX2N1cnJlbnRQb3NpdGlvbikge1xuICAgICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXlSZWY7XG5cbiAgICAgIGlmIChvdmVybGF5UmVmKSB7XG4gICAgICAgIGNvbnN0IGNsYXNzUHJlZml4ID0gYCR7dGhpcy5fY3NzQ2xhc3NQcmVmaXh9LSR7UEFORUxfQ0xBU1N9LWA7XG4gICAgICAgIG92ZXJsYXlSZWYucmVtb3ZlUGFuZWxDbGFzcyhjbGFzc1ByZWZpeCArIHRoaXMuX2N1cnJlbnRQb3NpdGlvbik7XG4gICAgICAgIG92ZXJsYXlSZWYuYWRkUGFuZWxDbGFzcyhjbGFzc1ByZWZpeCArIG5ld1Bvc2l0aW9uKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY3VycmVudFBvc2l0aW9uID0gbmV3UG9zaXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqIEJpbmRzIHRoZSBwb2ludGVyIGV2ZW50cyB0byB0aGUgdG9vbHRpcCB0cmlnZ2VyLiAqL1xuICBwcml2YXRlIF9zZXR1cFBvaW50ZXJFbnRlckV2ZW50c0lmTmVlZGVkKCkge1xuICAgIC8vIE9wdGltaXphdGlvbjogRGVmZXIgaG9va2luZyB1cCBldmVudHMgaWYgdGhlcmUncyBubyBtZXNzYWdlIG9yIHRoZSB0b29sdGlwIGlzIGRpc2FibGVkLlxuICAgIGlmIChcbiAgICAgIHRoaXMuX2Rpc2FibGVkIHx8XG4gICAgICAhdGhpcy5tZXNzYWdlIHx8XG4gICAgICAhdGhpcy5fdmlld0luaXRpYWxpemVkIHx8XG4gICAgICB0aGlzLl9wYXNzaXZlTGlzdGVuZXJzLmxlbmd0aFxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBtb3VzZSBldmVudHMgc2hvdWxkbid0IGJlIGJvdW5kIG9uIG1vYmlsZSBkZXZpY2VzLCBiZWNhdXNlIHRoZXkgY2FuIHByZXZlbnQgdGhlXG4gICAgLy8gZmlyc3QgdGFwIGZyb20gZmlyaW5nIGl0cyBjbGljayBldmVudCBvciBjYW4gY2F1c2UgdGhlIHRvb2x0aXAgdG8gb3BlbiBmb3IgY2xpY2tzLlxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybVN1cHBvcnRzTW91c2VFdmVudHMoKSkge1xuICAgICAgdGhpcy5fcGFzc2l2ZUxpc3RlbmVycy5wdXNoKFtcbiAgICAgICAgJ21vdXNlZW50ZXInLFxuICAgICAgICBldmVudCA9PiB7XG4gICAgICAgICAgdGhpcy5fc2V0dXBQb2ludGVyRXhpdEV2ZW50c0lmTmVlZGVkKCk7XG4gICAgICAgICAgbGV0IHBvaW50ID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGlmICgoZXZlbnQgYXMgTW91c2VFdmVudCkueCAhPT0gdW5kZWZpbmVkICYmIChldmVudCBhcyBNb3VzZUV2ZW50KS55ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBvaW50ID0gZXZlbnQgYXMgTW91c2VFdmVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zaG93KHVuZGVmaW5lZCwgcG9pbnQpO1xuICAgICAgICB9LFxuICAgICAgXSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRvdWNoR2VzdHVyZXMgIT09ICdvZmYnKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlTmF0aXZlR2VzdHVyZXNJZk5lY2Vzc2FyeSgpO1xuXG4gICAgICB0aGlzLl9wYXNzaXZlTGlzdGVuZXJzLnB1c2goW1xuICAgICAgICAndG91Y2hzdGFydCcsXG4gICAgICAgIGV2ZW50ID0+IHtcbiAgICAgICAgICBjb25zdCB0b3VjaCA9IChldmVudCBhcyBUb3VjaEV2ZW50KS50YXJnZXRUb3VjaGVzPy5bMF07XG4gICAgICAgICAgY29uc3Qgb3JpZ2luID0gdG91Y2ggPyB7eDogdG91Y2guY2xpZW50WCwgeTogdG91Y2guY2xpZW50WX0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgLy8gTm90ZSB0aGF0IGl0J3MgaW1wb3J0YW50IHRoYXQgd2UgZG9uJ3QgYHByZXZlbnREZWZhdWx0YCBoZXJlLFxuICAgICAgICAgIC8vIGJlY2F1c2UgaXQgY2FuIHByZXZlbnQgY2xpY2sgZXZlbnRzIGZyb20gZmlyaW5nIG9uIHRoZSBlbGVtZW50LlxuICAgICAgICAgIHRoaXMuX3NldHVwUG9pbnRlckV4aXRFdmVudHNJZk5lZWRlZCgpO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90b3VjaHN0YXJ0VGltZW91dCk7XG4gICAgICAgICAgdGhpcy5fdG91Y2hzdGFydFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2hvdyh1bmRlZmluZWQsIG9yaWdpbiksIExPTkdQUkVTU19ERUxBWSk7XG4gICAgICAgIH0sXG4gICAgICBdKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hZGRMaXN0ZW5lcnModGhpcy5fcGFzc2l2ZUxpc3RlbmVycyk7XG4gIH1cblxuICBwcml2YXRlIF9zZXR1cFBvaW50ZXJFeGl0RXZlbnRzSWZOZWVkZWQoKSB7XG4gICAgaWYgKHRoaXMuX3BvaW50ZXJFeGl0RXZlbnRzSW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fcG9pbnRlckV4aXRFdmVudHNJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBjb25zdCBleGl0TGlzdGVuZXJzOiAocmVhZG9ubHkgW3N0cmluZywgRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdF0pW10gPSBbXTtcbiAgICBpZiAodGhpcy5fcGxhdGZvcm1TdXBwb3J0c01vdXNlRXZlbnRzKCkpIHtcbiAgICAgIGV4aXRMaXN0ZW5lcnMucHVzaChcbiAgICAgICAgW1xuICAgICAgICAgICdtb3VzZWxlYXZlJyxcbiAgICAgICAgICBldmVudCA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdUYXJnZXQgPSAoZXZlbnQgYXMgTW91c2VFdmVudCkucmVsYXRlZFRhcmdldCBhcyBOb2RlIHwgbnVsbDtcbiAgICAgICAgICAgIGlmICghbmV3VGFyZ2V0IHx8ICF0aGlzLl9vdmVybGF5UmVmPy5vdmVybGF5RWxlbWVudC5jb250YWlucyhuZXdUYXJnZXQpKSB7XG4gICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFsnd2hlZWwnLCBldmVudCA9PiB0aGlzLl93aGVlbExpc3RlbmVyKGV2ZW50IGFzIFdoZWVsRXZlbnQpXSxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRvdWNoR2VzdHVyZXMgIT09ICdvZmYnKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlTmF0aXZlR2VzdHVyZXNJZk5lY2Vzc2FyeSgpO1xuICAgICAgY29uc3QgdG91Y2hlbmRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RvdWNoc3RhcnRUaW1lb3V0KTtcbiAgICAgICAgdGhpcy5oaWRlKHRoaXMuX2RlZmF1bHRPcHRpb25zLnRvdWNoZW5kSGlkZURlbGF5KTtcbiAgICAgIH07XG5cbiAgICAgIGV4aXRMaXN0ZW5lcnMucHVzaChbJ3RvdWNoZW5kJywgdG91Y2hlbmRMaXN0ZW5lcl0sIFsndG91Y2hjYW5jZWwnLCB0b3VjaGVuZExpc3RlbmVyXSk7XG4gICAgfVxuXG4gICAgdGhpcy5fYWRkTGlzdGVuZXJzKGV4aXRMaXN0ZW5lcnMpO1xuICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnMucHVzaCguLi5leGl0TGlzdGVuZXJzKTtcbiAgfVxuXG4gIHByaXZhdGUgX2FkZExpc3RlbmVycyhsaXN0ZW5lcnM6IChyZWFkb25seSBbc3RyaW5nLCBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0XSlbXSkge1xuICAgIGxpc3RlbmVycy5mb3JFYWNoKChbZXZlbnQsIGxpc3RlbmVyXSkgPT4ge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBwYXNzaXZlTGlzdGVuZXJPcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3BsYXRmb3JtU3VwcG9ydHNNb3VzZUV2ZW50cygpIHtcbiAgICByZXR1cm4gIXRoaXMuX3BsYXRmb3JtLklPUyAmJiAhdGhpcy5fcGxhdGZvcm0uQU5EUk9JRDtcbiAgfVxuXG4gIC8qKiBMaXN0ZW5lciBmb3IgdGhlIGB3aGVlbGAgZXZlbnQgb24gdGhlIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX3doZWVsTGlzdGVuZXIoZXZlbnQ6IFdoZWVsRXZlbnQpIHtcbiAgICBpZiAodGhpcy5faXNUb29sdGlwVmlzaWJsZSgpKSB7XG4gICAgICBjb25zdCBlbGVtZW50VW5kZXJQb2ludGVyID0gdGhpcy5fZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIC8vIE9uIG5vbi10b3VjaCBkZXZpY2VzIHdlIGRlcGVuZCBvbiB0aGUgYG1vdXNlbGVhdmVgIGV2ZW50IHRvIGNsb3NlIHRoZSB0b29sdGlwLCBidXQgaXRcbiAgICAgIC8vIHdvbid0IGZpcmUgaWYgdGhlIHVzZXIgc2Nyb2xscyBhd2F5IHVzaW5nIHRoZSB3aGVlbCB3aXRob3V0IG1vdmluZyB0aGVpciBjdXJzb3IuIFdlXG4gICAgICAvLyB3b3JrIGFyb3VuZCBpdCBieSBmaW5kaW5nIHRoZSBlbGVtZW50IHVuZGVyIHRoZSB1c2VyJ3MgY3Vyc29yIGFuZCBjbG9zaW5nIHRoZSB0b29sdGlwXG4gICAgICAvLyBpZiBpdCdzIG5vdCB0aGUgdHJpZ2dlci5cbiAgICAgIGlmIChlbGVtZW50VW5kZXJQb2ludGVyICE9PSBlbGVtZW50ICYmICFlbGVtZW50LmNvbnRhaW5zKGVsZW1lbnRVbmRlclBvaW50ZXIpKSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBEaXNhYmxlcyB0aGUgbmF0aXZlIGJyb3dzZXIgZ2VzdHVyZXMsIGJhc2VkIG9uIGhvdyB0aGUgdG9vbHRpcCBoYXMgYmVlbiBjb25maWd1cmVkLiAqL1xuICBwcml2YXRlIF9kaXNhYmxlTmF0aXZlR2VzdHVyZXNJZk5lY2Vzc2FyeSgpIHtcbiAgICBjb25zdCBnZXN0dXJlcyA9IHRoaXMudG91Y2hHZXN0dXJlcztcblxuICAgIGlmIChnZXN0dXJlcyAhPT0gJ29mZicpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBzdHlsZSA9IGVsZW1lbnQuc3R5bGU7XG5cbiAgICAgIC8vIElmIGdlc3R1cmVzIGFyZSBzZXQgdG8gYGF1dG9gLCB3ZSBkb24ndCBkaXNhYmxlIHRleHQgc2VsZWN0aW9uIG9uIGlucHV0cyBhbmRcbiAgICAgIC8vIHRleHRhcmVhcywgYmVjYXVzZSBpdCBwcmV2ZW50cyB0aGUgdXNlciBmcm9tIHR5cGluZyBpbnRvIHRoZW0gb24gaU9TIFNhZmFyaS5cbiAgICAgIGlmIChnZXN0dXJlcyA9PT0gJ29uJyB8fCAoZWxlbWVudC5ub2RlTmFtZSAhPT0gJ0lOUFVUJyAmJiBlbGVtZW50Lm5vZGVOYW1lICE9PSAnVEVYVEFSRUEnKSkge1xuICAgICAgICBzdHlsZS51c2VyU2VsZWN0ID1cbiAgICAgICAgICAoc3R5bGUgYXMgYW55KS5tc1VzZXJTZWxlY3QgPVxuICAgICAgICAgIHN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPVxuICAgICAgICAgIChzdHlsZSBhcyBhbnkpLk1velVzZXJTZWxlY3QgPVxuICAgICAgICAgICAgJ25vbmUnO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB3ZSBoYXZlIGBhdXRvYCBnZXN0dXJlcyBhbmQgdGhlIGVsZW1lbnQgdXNlcyBuYXRpdmUgSFRNTCBkcmFnZ2luZyxcbiAgICAgIC8vIHdlIGRvbid0IHNldCBgLXdlYmtpdC11c2VyLWRyYWdgIGJlY2F1c2UgaXQgcHJldmVudHMgdGhlIG5hdGl2ZSBiZWhhdmlvci5cbiAgICAgIGlmIChnZXN0dXJlcyA9PT0gJ29uJyB8fCAhZWxlbWVudC5kcmFnZ2FibGUpIHtcbiAgICAgICAgKHN0eWxlIGFzIGFueSkud2Via2l0VXNlckRyYWcgPSAnbm9uZSc7XG4gICAgICB9XG5cbiAgICAgIHN0eWxlLnRvdWNoQWN0aW9uID0gJ25vbmUnO1xuICAgICAgKHN0eWxlIGFzIGFueSkud2Via2l0VGFwSGlnaGxpZ2h0Q29sb3IgPSAndHJhbnNwYXJlbnQnO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEludGVybmFsIGNvbXBvbmVudCB0aGF0IHdyYXBzIHRoZSB0b29sdGlwJ3MgY29udGVudC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRvb2x0aXAtY29tcG9uZW50JyxcbiAgdGVtcGxhdGVVcmw6ICd0b29sdGlwLmh0bWwnLFxuICBzdHlsZVVybDogJ3Rvb2x0aXAuY3NzJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAvLyBGb3JjZXMgdGhlIGVsZW1lbnQgdG8gaGF2ZSBhIGxheW91dCBpbiBJRSBhbmQgRWRnZS4gVGhpcyBmaXhlcyBpc3N1ZXMgd2hlcmUgdGhlIGVsZW1lbnRcbiAgICAvLyB3b24ndCBiZSByZW5kZXJlZCBpZiB0aGUgYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQgb3IgdGhlcmUgaXMgbm8gd2ViIGFuaW1hdGlvbnMgcG9seWZpbGwuXG4gICAgJ1tzdHlsZS56b29tXSc6ICdpc1Zpc2libGUoKSA/IDEgOiBudWxsJyxcbiAgICAnKG1vdXNlbGVhdmUpJzogJ19oYW5kbGVNb3VzZUxlYXZlKCRldmVudCknLFxuICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcbiAgfSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW05nQ2xhc3NdLFxufSlcbmV4cG9ydCBjbGFzcyBUb29sdGlwQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyogV2hldGhlciB0aGUgdG9vbHRpcCB0ZXh0IG92ZXJmbG93cyB0byBtdWx0aXBsZSBsaW5lcyAqL1xuICBfaXNNdWx0aWxpbmUgPSBmYWxzZTtcblxuICAvKiogTWVzc2FnZSB0byBkaXNwbGF5IGluIHRoZSB0b29sdGlwICovXG4gIG1lc3NhZ2U6IHN0cmluZztcblxuICAvKiogQ2xhc3NlcyB0byBiZSBhZGRlZCB0byB0aGUgdG9vbHRpcC4gU3VwcG9ydHMgdGhlIHNhbWUgc3ludGF4IGFzIGBuZ0NsYXNzYC4gKi9cbiAgdG9vbHRpcENsYXNzOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+IHwge1trZXk6IHN0cmluZ106IGFueX07XG5cbiAgLyoqIFRoZSB0aW1lb3V0IElEIG9mIGFueSBjdXJyZW50IHRpbWVyIHNldCB0byBzaG93IHRoZSB0b29sdGlwICovXG4gIHByaXZhdGUgX3Nob3dUaW1lb3V0SWQ6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBUaGUgdGltZW91dCBJRCBvZiBhbnkgY3VycmVudCB0aW1lciBzZXQgdG8gaGlkZSB0aGUgdG9vbHRpcCAqL1xuICBwcml2YXRlIF9oaWRlVGltZW91dElkOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IHVuZGVmaW5lZDtcblxuICAvKiogRWxlbWVudCB0aGF0IGNhdXNlZCB0aGUgdG9vbHRpcCB0byBvcGVuLiAqL1xuICBfdHJpZ2dlckVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBBbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5IHRoZSBjbG9zaW5nIHNlcXVlbmNlLiAqL1xuICBfbW91c2VMZWF2ZUhpZGVEZWxheTogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIGFuaW1hdGlvbnMgYXJlIGN1cnJlbnRseSBkaXNhYmxlZC4gKi9cbiAgcHJpdmF0ZSBfYW5pbWF0aW9uc0Rpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGludGVybmFsIHRvb2x0aXAgZWxlbWVudC4gKi9cbiAgQFZpZXdDaGlsZCgndG9vbHRpcCcsIHtcbiAgICAvLyBVc2UgYSBzdGF0aWMgcXVlcnkgaGVyZSBzaW5jZSB3ZSBpbnRlcmFjdCBkaXJlY3RseSB3aXRoXG4gICAgLy8gdGhlIERPTSB3aGljaCBjYW4gaGFwcGVuIGJlZm9yZSBgbmdBZnRlclZpZXdJbml0YC5cbiAgICBzdGF0aWM6IHRydWUsXG4gIH0pXG4gIF90b29sdGlwOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAvKiogV2hldGhlciBpbnRlcmFjdGlvbnMgb24gdGhlIHBhZ2Ugc2hvdWxkIGNsb3NlIHRoZSB0b29sdGlwICovXG4gIHByaXZhdGUgX2Nsb3NlT25JbnRlcmFjdGlvbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0b29sdGlwIGlzIGN1cnJlbnRseSB2aXNpYmxlLiAqL1xuICBwcml2YXRlIF9pc1Zpc2libGUgPSBmYWxzZTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoYXQgdGhlIHRvb2x0aXAgaGFzIGJlZW4gaGlkZGVuIGZyb20gdGhlIHZpZXcgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfb25IaWRlOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3QoKTtcblxuICAvKiogTmFtZSBvZiB0aGUgc2hvdyBhbmltYXRpb24gYW5kIHRoZSBjbGFzcyB0aGF0IHRvZ2dsZXMgaXQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX3Nob3dBbmltYXRpb24gPSAnbWF0LW1kYy10b29sdGlwLXNob3cnO1xuXG4gIC8qKiBOYW1lIG9mIHRoZSBoaWRlIGFuaW1hdGlvbiBhbmQgdGhlIGNsYXNzIHRoYXQgdG9nZ2xlcyBpdC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfaGlkZUFuaW1hdGlvbiA9ICdtYXQtbWRjLXRvb2x0aXAtaGlkZSc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByb3RlY3RlZCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCA9IGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucyc7XG4gIH1cblxuICAvKipcbiAgICogU2hvd3MgdGhlIHRvb2x0aXAgd2l0aCBhbiBhbmltYXRpb24gb3JpZ2luYXRpbmcgZnJvbSB0aGUgcHJvdmlkZWQgb3JpZ2luXG4gICAqIEBwYXJhbSBkZWxheSBBbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIHRoZSBkZWxheSBzaG93aW5nIHRoZSB0b29sdGlwLlxuICAgKi9cbiAgc2hvdyhkZWxheTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gQ2FuY2VsIHRoZSBkZWxheWVkIGhpZGUgaWYgaXQgaXMgc2NoZWR1bGVkXG4gICAgaWYgKHRoaXMuX2hpZGVUaW1lb3V0SWQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2hpZGVUaW1lb3V0SWQpO1xuICAgIH1cblxuICAgIHRoaXMuX3Nob3dUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX3RvZ2dsZVZpc2liaWxpdHkodHJ1ZSk7XG4gICAgICB0aGlzLl9zaG93VGltZW91dElkID0gdW5kZWZpbmVkO1xuICAgIH0sIGRlbGF5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCZWdpbnMgdGhlIGFuaW1hdGlvbiB0byBoaWRlIHRoZSB0b29sdGlwIGFmdGVyIHRoZSBwcm92aWRlZCBkZWxheSBpbiBtcy5cbiAgICogQHBhcmFtIGRlbGF5IEFtb3VudCBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkgc2hvd2luZyB0aGUgdG9vbHRpcC5cbiAgICovXG4gIGhpZGUoZGVsYXk6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIENhbmNlbCB0aGUgZGVsYXllZCBzaG93IGlmIGl0IGlzIHNjaGVkdWxlZFxuICAgIGlmICh0aGlzLl9zaG93VGltZW91dElkICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9zaG93VGltZW91dElkKTtcbiAgICB9XG5cbiAgICB0aGlzLl9oaWRlVGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl90b2dnbGVWaXNpYmlsaXR5KGZhbHNlKTtcbiAgICAgIHRoaXMuX2hpZGVUaW1lb3V0SWQgPSB1bmRlZmluZWQ7XG4gICAgfSwgZGVsYXkpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYW4gb2JzZXJ2YWJsZSB0aGF0IG5vdGlmaWVzIHdoZW4gdGhlIHRvb2x0aXAgaGFzIGJlZW4gaGlkZGVuIGZyb20gdmlldy4gKi9cbiAgYWZ0ZXJIaWRkZW4oKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX29uSGlkZTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSB0b29sdGlwIGlzIGJlaW5nIGRpc3BsYXllZC4gKi9cbiAgaXNWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pc1Zpc2libGU7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9jYW5jZWxQZW5kaW5nQW5pbWF0aW9ucygpO1xuICAgIHRoaXMuX29uSGlkZS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX3RyaWdnZXJFbGVtZW50ID0gbnVsbCE7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJhY3Rpb25zIG9uIHRoZSBIVE1MIGJvZHkgc2hvdWxkIGNsb3NlIHRoZSB0b29sdGlwIGltbWVkaWF0ZWx5IGFzIGRlZmluZWQgaW4gdGhlXG4gICAqIG1hdGVyaWFsIGRlc2lnbiBzcGVjLlxuICAgKiBodHRwczovL21hdGVyaWFsLmlvL2Rlc2lnbi9jb21wb25lbnRzL3Rvb2x0aXBzLmh0bWwjYmVoYXZpb3JcbiAgICovXG4gIF9oYW5kbGVCb2R5SW50ZXJhY3Rpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2Nsb3NlT25JbnRlcmFjdGlvbikge1xuICAgICAgdGhpcy5oaWRlKDApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGF0IHRoZSB0b29sdGlwIG5lZWRzIHRvIGJlIGNoZWNrZWQgaW4gdGhlIG5leHQgY2hhbmdlIGRldGVjdGlvbiBydW4uXG4gICAqIE1haW5seSB1c2VkIGZvciByZW5kZXJpbmcgdGhlIGluaXRpYWwgdGV4dCBiZWZvcmUgcG9zaXRpb25pbmcgYSB0b29sdGlwLCB3aGljaFxuICAgKiBjYW4gYmUgcHJvYmxlbWF0aWMgaW4gY29tcG9uZW50cyB3aXRoIE9uUHVzaCBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgKi9cbiAgX21hcmtGb3JDaGVjaygpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIF9oYW5kbGVNb3VzZUxlYXZlKHtyZWxhdGVkVGFyZ2V0fTogTW91c2VFdmVudCkge1xuICAgIGlmICghcmVsYXRlZFRhcmdldCB8fCAhdGhpcy5fdHJpZ2dlckVsZW1lbnQuY29udGFpbnMocmVsYXRlZFRhcmdldCBhcyBOb2RlKSkge1xuICAgICAgaWYgKHRoaXMuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgdGhpcy5oaWRlKHRoaXMuX21vdXNlTGVhdmVIaWRlRGVsYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZmluYWxpemVBbmltYXRpb24oZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3Igd2hlbiB0aGUgdGltZW91dCBpbiB0aGlzLnNob3coKSBnZXRzIGNvbXBsZXRlZC5cbiAgICogVGhpcyBtZXRob2QgaXMgb25seSBuZWVkZWQgYnkgdGhlIG1kYy10b29sdGlwLCBhbmQgc28gaXQgaXMgb25seSBpbXBsZW1lbnRlZFxuICAgKiBpbiB0aGUgbWRjLXRvb2x0aXAsIG5vdCBoZXJlLlxuICAgKi9cbiAgcHJvdGVjdGVkIF9vblNob3coKTogdm9pZCB7XG4gICAgdGhpcy5faXNNdWx0aWxpbmUgPSB0aGlzLl9pc1Rvb2x0aXBNdWx0aWxpbmUoKTtcbiAgICB0aGlzLl9tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSB0b29sdGlwIHRleHQgaGFzIG92ZXJmbG93biB0byB0aGUgbmV4dCBsaW5lICovXG4gIHByaXZhdGUgX2lzVG9vbHRpcE11bHRpbGluZSgpIHtcbiAgICBjb25zdCByZWN0ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiByZWN0LmhlaWdodCA+IE1JTl9IRUlHSFQgJiYgcmVjdC53aWR0aCA+PSBNQVhfV0lEVEg7XG4gIH1cblxuICAvKiogRXZlbnQgbGlzdGVuZXIgZGlzcGF0Y2hlZCB3aGVuIGFuIGFuaW1hdGlvbiBvbiB0aGUgdG9vbHRpcCBmaW5pc2hlcy4gKi9cbiAgX2hhbmRsZUFuaW1hdGlvbkVuZCh7YW5pbWF0aW9uTmFtZX06IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgaWYgKGFuaW1hdGlvbk5hbWUgPT09IHRoaXMuX3Nob3dBbmltYXRpb24gfHwgYW5pbWF0aW9uTmFtZSA9PT0gdGhpcy5faGlkZUFuaW1hdGlvbikge1xuICAgICAgdGhpcy5fZmluYWxpemVBbmltYXRpb24oYW5pbWF0aW9uTmFtZSA9PT0gdGhpcy5fc2hvd0FuaW1hdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqIENhbmNlbHMgYW55IHBlbmRpbmcgYW5pbWF0aW9uIHNlcXVlbmNlcy4gKi9cbiAgX2NhbmNlbFBlbmRpbmdBbmltYXRpb25zKCkge1xuICAgIGlmICh0aGlzLl9zaG93VGltZW91dElkICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9zaG93VGltZW91dElkKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5faGlkZVRpbWVvdXRJZCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5faGlkZVRpbWVvdXRJZCk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2hvd1RpbWVvdXRJZCA9IHRoaXMuX2hpZGVUaW1lb3V0SWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogSGFuZGxlcyB0aGUgY2xlYW51cCBhZnRlciBhbiBhbmltYXRpb24gaGFzIGZpbmlzaGVkLiAqL1xuICBwcml2YXRlIF9maW5hbGl6ZUFuaW1hdGlvbih0b1Zpc2libGU6IGJvb2xlYW4pIHtcbiAgICBpZiAodG9WaXNpYmxlKSB7XG4gICAgICB0aGlzLl9jbG9zZU9uSW50ZXJhY3Rpb24gPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNWaXNpYmxlKCkpIHtcbiAgICAgIHRoaXMuX29uSGlkZS5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIHZpc2liaWxpdHkgb2YgdGhlIHRvb2x0aXAgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfdG9nZ2xlVmlzaWJpbGl0eShpc1Zpc2libGU6IGJvb2xlYW4pIHtcbiAgICAvLyBXZSBzZXQgdGhlIGNsYXNzZXMgZGlyZWN0bHkgaGVyZSBvdXJzZWx2ZXMgc28gdGhhdCB0b2dnbGluZyB0aGUgdG9vbHRpcCBzdGF0ZVxuICAgIC8vIGlzbid0IGJvdW5kIGJ5IGNoYW5nZSBkZXRlY3Rpb24uIFRoaXMgYWxsb3dzIHVzIHRvIGhpZGUgaXQgZXZlbiBpZiB0aGVcbiAgICAvLyB2aWV3IHJlZiBoYXMgYmVlbiBkZXRhY2hlZCBmcm9tIHRoZSBDRCB0cmVlLlxuICAgIGNvbnN0IHRvb2x0aXAgPSB0aGlzLl90b29sdGlwLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3Qgc2hvd0NsYXNzID0gdGhpcy5fc2hvd0FuaW1hdGlvbjtcbiAgICBjb25zdCBoaWRlQ2xhc3MgPSB0aGlzLl9oaWRlQW5pbWF0aW9uO1xuICAgIHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZShpc1Zpc2libGUgPyBoaWRlQ2xhc3MgOiBzaG93Q2xhc3MpO1xuICAgIHRvb2x0aXAuY2xhc3NMaXN0LmFkZChpc1Zpc2libGUgPyBzaG93Q2xhc3MgOiBoaWRlQ2xhc3MpO1xuICAgIHRoaXMuX2lzVmlzaWJsZSA9IGlzVmlzaWJsZTtcblxuICAgIC8vIEl0J3MgY29tbW9uIGZvciBpbnRlcm5hbCBhcHBzIHRvIGRpc2FibGUgYW5pbWF0aW9ucyB1c2luZyBgKiB7IGFuaW1hdGlvbjogbm9uZSAhaW1wb3J0YW50IH1gXG4gICAgLy8gd2hpY2ggY2FuIGJyZWFrIHRoZSBvcGVuaW5nIHNlcXVlbmNlLiBUcnkgdG8gZGV0ZWN0IHN1Y2ggY2FzZXMgYW5kIHdvcmsgYXJvdW5kIHRoZW0uXG4gICAgaWYgKGlzVmlzaWJsZSAmJiAhdGhpcy5fYW5pbWF0aW9uc0Rpc2FibGVkICYmIHR5cGVvZiBnZXRDb21wdXRlZFN0eWxlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKHRvb2x0aXApO1xuXG4gICAgICAvLyBVc2UgYGdldFByb3BlcnR5VmFsdWVgIHRvIGF2b2lkIGlzc3VlcyB3aXRoIHByb3BlcnR5IHJlbmFtaW5nLlxuICAgICAgaWYgKFxuICAgICAgICBzdHlsZXMuZ2V0UHJvcGVydHlWYWx1ZSgnYW5pbWF0aW9uLWR1cmF0aW9uJykgPT09ICcwcycgfHxcbiAgICAgICAgc3R5bGVzLmdldFByb3BlcnR5VmFsdWUoJ2FuaW1hdGlvbi1uYW1lJykgPT09ICdub25lJ1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzVmlzaWJsZSkge1xuICAgICAgdGhpcy5fb25TaG93KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCkge1xuICAgICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKCdfbWF0LWFuaW1hdGlvbi1ub29wYWJsZScpO1xuICAgICAgdGhpcy5fZmluYWxpemVBbmltYXRpb24oaXNWaXNpYmxlKTtcbiAgICB9XG4gIH1cbn1cbiIsIjxkaXZcbiAgI3Rvb2x0aXBcbiAgY2xhc3M9XCJtZGMtdG9vbHRpcCBtZGMtdG9vbHRpcC0tc2hvd24gbWF0LW1kYy10b29sdGlwXCJcbiAgW25nQ2xhc3NdPVwidG9vbHRpcENsYXNzXCJcbiAgKGFuaW1hdGlvbmVuZCk9XCJfaGFuZGxlQW5pbWF0aW9uRW5kKCRldmVudClcIlxuICBbY2xhc3MubWRjLXRvb2x0aXAtLW11bHRpbGluZV09XCJfaXNNdWx0aWxpbmVcIj5cbiAgPGRpdiBjbGFzcz1cIm1kYy10b29sdGlwX19zdXJmYWNlIG1kYy10b29sdGlwX19zdXJmYWNlLWFuaW1hdGlvblwiPnt7bWVzc2FnZX19PC9kaXY+XG48L2Rpdj5cbiJdfQ==