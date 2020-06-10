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
export const SCROLL_THROTTLE_MS = 20;
/** CSS class that will be attached to the overlay panel. */
export const TOOLTIP_PANEL_CLASS = 'mat-tooltip-panel';
/** Options used to bind passive event listeners. */
const passiveListenerOptions = normalizePassiveListenerOptions({ passive: true });
/**
 * Time between the user putting the pointer on a tooltip
 * trigger and the long press event being fired.
 */
const LONGPRESS_DELAY = 500;
/**
 * Creates an error to be thrown if the user supplied an invalid tooltip position.
 * @docs-private
 */
export function getMatTooltipInvalidPositionError(position) {
    return Error(`Tooltip position "${position}" is invalid.`);
}
/** Injection token that determines the scroll handling while a tooltip is visible. */
export const MAT_TOOLTIP_SCROLL_STRATEGY = new InjectionToken('mat-tooltip-scroll-strategy');
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
/** Injection token to be used to override the default options for `matTooltip`. */
export const MAT_TOOLTIP_DEFAULT_OPTIONS = new InjectionToken('mat-tooltip-default-options', {
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
let MatTooltip = /** @class */ (() => {
    class MatTooltip {
        constructor(_overlay, _elementRef, _scrollDispatcher, _viewContainerRef, _ngZone, _platform, _ariaDescriber, _focusMonitor, scrollStrategy, _dir, _defaultOptions) {
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
            this._handleKeydown = (event) => {
                if (this._isTooltipVisible() && event.keyCode === ESCAPE && !hasModifierKey(event)) {
                    event.preventDefault();
                    event.stopPropagation();
                    this._ngZone.run(() => this.hide(0));
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
            _ngZone.runOutsideAngular(() => {
                _elementRef.nativeElement.addEventListener('keydown', this._handleKeydown);
            });
        }
        /** Allows the user to define the position of the tooltip relative to the parent element */
        get position() { return this._position; }
        set position(value) {
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
        }
        /** Disables the display of the tooltip. */
        get disabled() { return this._disabled; }
        set disabled(value) {
            this._disabled = coerceBooleanProperty(value);
            // If tooltip is disabled, hide immediately.
            if (this._disabled) {
                this.hide(0);
            }
        }
        /** The message to be displayed in the tooltip */
        get message() { return this._message; }
        set message(value) {
            this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this._message);
            // If the message is not a string (e.g. number), convert it to a string and trim it.
            this._message = value != null ? `${value}`.trim() : '';
            if (!this._message && this._isTooltipVisible()) {
                this.hide(0);
            }
            else {
                this._updateTooltipMessage();
                this._ngZone.runOutsideAngular(() => {
                    // The `AriaDescriber` has some functionality that avoids adding a description if it's the
                    // same as the `aria-label` of an element, however we can't know whether the tooltip trigger
                    // has a data-bound `aria-label` or when it'll be set for the first time. We can avoid the
                    // issue by deferring the description by a tick so Angular has time to set the `aria-label`.
                    Promise.resolve().then(() => {
                        this._ariaDescriber.describe(this._elementRef.nativeElement, this.message);
                    });
                });
            }
        }
        /** Classes to be passed to the tooltip. Supports the same syntax as `ngClass`. */
        get tooltipClass() { return this._tooltipClass; }
        set tooltipClass(value) {
            this._tooltipClass = value;
            if (this._tooltipInstance) {
                this._setTooltipClass(this._tooltipClass);
            }
        }
        ngAfterViewInit() {
            // This needs to happen after view init so the initial values for all inputs have been set.
            this._setupPointerEvents();
            this._focusMonitor.monitor(this._elementRef)
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
            nativeElement.removeEventListener('keydown', this._handleKeydown);
            this._passiveListeners.forEach((listener, event) => {
                nativeElement.removeEventListener(event, listener, passiveListenerOptions);
            });
            this._passiveListeners.clear();
            this._destroyed.next();
            this._destroyed.complete();
            this._ariaDescriber.removeDescription(nativeElement, this.message);
            this._focusMonitor.stopMonitoring(nativeElement);
        }
        /** Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input */
        show(delay = this.showDelay) {
            if (this.disabled || !this.message || (this._isTooltipVisible() &&
                !this._tooltipInstance._showTimeoutId && !this._tooltipInstance._hideTimeoutId)) {
                return;
            }
            const overlayRef = this._createOverlay();
            this._detach();
            this._portal = this._portal || new ComponentPortal(TooltipComponent, this._viewContainerRef);
            this._tooltipInstance = overlayRef.attach(this._portal).instance;
            this._tooltipInstance.afterHidden()
                .pipe(takeUntil(this._destroyed))
                .subscribe(() => this._detach());
            this._setTooltipClass(this._tooltipClass);
            this._updateTooltipMessage();
            this._tooltipInstance.show(delay);
        }
        /** Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input */
        hide(delay = this.hideDelay) {
            if (this._tooltipInstance) {
                this._tooltipInstance.hide(delay);
            }
        }
        /** Shows/hides the tooltip */
        toggle() {
            this._isTooltipVisible() ? this.hide() : this.show();
        }
        /** Returns true if the tooltip is currently visible to the user */
        _isTooltipVisible() {
            return !!this._tooltipInstance && this._tooltipInstance.isVisible();
        }
        /** Create the overlay config and position strategy */
        _createOverlay() {
            if (this._overlayRef) {
                return this._overlayRef;
            }
            const scrollableAncestors = this._scrollDispatcher.getAncestorScrollContainers(this._elementRef);
            // Create connected position strategy that listens for scroll events to reposition.
            const strategy = this._overlay.position()
                .flexibleConnectedTo(this._elementRef)
                .withTransformOriginOn('.mat-tooltip')
                .withFlexibleDimensions(false)
                .withViewportMargin(8)
                .withScrollableContainers(scrollableAncestors);
            strategy.positionChanges.pipe(takeUntil(this._destroyed)).subscribe(change => {
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
                panelClass: TOOLTIP_PANEL_CLASS,
                scrollStrategy: this._scrollStrategy()
            });
            this._updatePosition();
            this._overlayRef.detachments()
                .pipe(takeUntil(this._destroyed))
                .subscribe(() => this._detach());
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
        _updatePosition() {
            const position = this._overlayRef.getConfig().positionStrategy;
            const origin = this._getOrigin();
            const overlay = this._getOverlayPosition();
            position.withPositions([
                Object.assign(Object.assign({}, origin.main), overlay.main),
                Object.assign(Object.assign({}, origin.fallback), overlay.fallback)
            ]);
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
            else {
                throw getMatTooltipInvalidPositionError(position);
            }
            const { x, y } = this._invertPosition(originPosition.originX, originPosition.originY);
            return {
                main: originPosition,
                fallback: { originX: x, originY: y }
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
            else {
                throw getMatTooltipInvalidPositionError(position);
            }
            const { x, y } = this._invertPosition(overlayPosition.overlayX, overlayPosition.overlayY);
            return {
                main: overlayPosition,
                fallback: { overlayX: x, overlayY: y }
            };
        }
        /** Updates the tooltip message and repositions the overlay according to the new message length */
        _updateTooltipMessage() {
            // Must wait for the message to be painted to the tooltip so that the overlay can properly
            // calculate the correct positioning based on the size of the text.
            if (this._tooltipInstance) {
                this._tooltipInstance.message = this.message;
                this._tooltipInstance._markForCheck();
                this._ngZone.onMicrotaskEmpty.asObservable().pipe(take(1), takeUntil(this._destroyed)).subscribe(() => {
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
        /** Binds the pointer events to the tooltip trigger. */
        _setupPointerEvents() {
            // The mouse events shouldn't be bound on mobile devices, because they can prevent the
            // first tap from firing its click event or can cause the tooltip to open for clicks.
            if (!this._platform.IOS && !this._platform.ANDROID) {
                this._passiveListeners
                    .set('mouseenter', () => this.show())
                    .set('mouseleave', () => this.hide());
            }
            else if (this.touchGestures !== 'off') {
                this._disableNativeGesturesIfNecessary();
                const touchendListener = () => {
                    clearTimeout(this._touchstartTimeout);
                    this.hide(this._defaultOptions.touchendHideDelay);
                };
                this._passiveListeners
                    .set('touchend', touchendListener)
                    .set('touchcancel', touchendListener)
                    .set('touchstart', () => {
                    // Note that it's important that we don't `preventDefault` here,
                    // because it can prevent click events from firing on the element.
                    clearTimeout(this._touchstartTimeout);
                    this._touchstartTimeout = setTimeout(() => this.show(), LONGPRESS_DELAY);
                });
            }
            this._passiveListeners.forEach((listener, event) => {
                this._elementRef.nativeElement.addEventListener(event, listener, passiveListenerOptions);
            });
        }
        /** Disables the native browser gestures, based on how the tooltip has been configured. */
        _disableNativeGesturesIfNecessary() {
            const element = this._elementRef.nativeElement;
            const style = element.style;
            const gestures = this.touchGestures;
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
        }
    }
    MatTooltip.decorators = [
        { type: Directive, args: [{
                    selector: '[matTooltip]',
                    exportAs: 'matTooltip',
                    host: {
                        'class': 'mat-tooltip-trigger'
                    }
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
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_TOOLTIP_DEFAULT_OPTIONS,] }] }
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
    return MatTooltip;
})();
export { MatTooltip };
/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 */
let TooltipComponent = /** @class */ (() => {
    class TooltipComponent {
        constructor(_changeDetectorRef, _breakpointObserver) {
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
        show(delay) {
            // Cancel the delayed hide if it is scheduled
            if (this._hideTimeoutId) {
                clearTimeout(this._hideTimeoutId);
                this._hideTimeoutId = null;
            }
            // Body interactions should cancel the tooltip if there is a delay in showing.
            this._closeOnInteraction = true;
            this._showTimeoutId = setTimeout(() => {
                this._visibility = 'visible';
                this._showTimeoutId = null;
                // Mark for check so if any parent component has set the
                // ChangeDetectionStrategy to OnPush it will be checked anyways
                this._markForCheck();
            }, delay);
        }
        /**
         * Begins the animation to hide the tooltip after the provided delay in ms.
         * @param delay Amount of milliseconds to delay showing the tooltip.
         */
        hide(delay) {
            // Cancel the delayed show if it is scheduled
            if (this._showTimeoutId) {
                clearTimeout(this._showTimeoutId);
                this._showTimeoutId = null;
            }
            this._hideTimeoutId = setTimeout(() => {
                this._visibility = 'hidden';
                this._hideTimeoutId = null;
                // Mark for check so if any parent component has set the
                // ChangeDetectionStrategy to OnPush it will be checked anyways
                this._markForCheck();
            }, delay);
        }
        /** Returns an observable that notifies when the tooltip has been hidden from view. */
        afterHidden() {
            return this._onHide.asObservable();
        }
        /** Whether the tooltip is being displayed. */
        isVisible() {
            return this._visibility === 'visible';
        }
        ngOnDestroy() {
            this._onHide.complete();
        }
        _animationStart() {
            this._closeOnInteraction = false;
        }
        _animationDone(event) {
            const toState = event.toState;
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
    }
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
    TooltipComponent.ctorParameters = () => [
        { type: ChangeDetectorRef },
        { type: BreakpointObserver }
    ];
    return TooltipComponent;
})();
export { TooltipComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90b29sdGlwL3Rvb2x0aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxFQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFlLHFCQUFxQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDdkYsT0FBTyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM3RCxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsV0FBVyxFQUFrQixNQUFNLHFCQUFxQixDQUFDO0FBQ3JGLE9BQU8sRUFJTCxPQUFPLEdBS1IsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsUUFBUSxFQUFFLCtCQUErQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDaEYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hELE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsZ0JBQWdCLEVBQ2hCLGlCQUFpQixHQUVsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFL0MsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFlMUQsZ0VBQWdFO0FBQ2hFLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztBQUVyQyw0REFBNEQ7QUFDNUQsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7QUFFdkQsb0RBQW9EO0FBQ3BELE1BQU0sc0JBQXNCLEdBQUcsK0JBQStCLENBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUVoRjs7O0dBR0c7QUFDSCxNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUM7QUFFNUI7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLGlDQUFpQyxDQUFDLFFBQWdCO0lBQ2hFLE9BQU8sS0FBSyxDQUFDLHFCQUFxQixRQUFRLGVBQWUsQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFFRCxzRkFBc0Y7QUFDdEYsTUFBTSxDQUFDLE1BQU0sMkJBQTJCLEdBQ3BDLElBQUksY0FBYyxDQUF1Qiw2QkFBNkIsQ0FBQyxDQUFDO0FBRTVFLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsbUNBQW1DLENBQUMsT0FBZ0I7SUFDbEUsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFDLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLDRDQUE0QyxHQUFHO0lBQzFELE9BQU8sRUFBRSwyQkFBMkI7SUFDcEMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ2YsVUFBVSxFQUFFLG1DQUFtQztDQUNoRCxDQUFDO0FBV0YsbUZBQW1GO0FBQ25GLE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUNwQyxJQUFJLGNBQWMsQ0FBMkIsNkJBQTZCLEVBQUU7SUFDMUUsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLG1DQUFtQztDQUM3QyxDQUFDLENBQUM7QUFFUCxvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLG1DQUFtQztJQUNqRCxPQUFPO1FBQ0wsU0FBUyxFQUFFLENBQUM7UUFDWixTQUFTLEVBQUUsQ0FBQztRQUNaLGlCQUFpQixFQUFFLElBQUk7S0FDeEIsQ0FBQztBQUNKLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNIO0lBQUEsTUFPYSxVQUFVO1FBNEdyQixZQUNVLFFBQWlCLEVBQ2pCLFdBQW9DLEVBQ3BDLGlCQUFtQyxFQUNuQyxpQkFBbUMsRUFDbkMsT0FBZSxFQUNmLFNBQW1CLEVBQ25CLGNBQTZCLEVBQzdCLGFBQTJCLEVBQ0UsY0FBbUIsRUFDcEMsSUFBb0IsRUFFOUIsZUFBeUM7WUFYM0MsYUFBUSxHQUFSLFFBQVEsQ0FBUztZQUNqQixnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7WUFDcEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtZQUNuQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1lBQ25DLFlBQU8sR0FBUCxPQUFPLENBQVE7WUFDZixjQUFTLEdBQVQsU0FBUyxDQUFVO1lBQ25CLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1lBQzdCLGtCQUFhLEdBQWIsYUFBYSxDQUFjO1lBRWYsU0FBSSxHQUFKLElBQUksQ0FBZ0I7WUFFOUIsb0JBQWUsR0FBZixlQUFlLENBQTBCO1lBbkg3QyxjQUFTLEdBQW9CLE9BQU8sQ0FBQztZQUNyQyxjQUFTLEdBQVksS0FBSyxDQUFDO1lBbUNuQyw4RUFBOEU7WUFDaEQsY0FBUyxHQUFXLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDO1lBRWpGLDZFQUE2RTtZQUMvQyxjQUFTLEdBQVcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUM7WUFFakY7Ozs7Ozs7Ozs7Ozs7ZUFhRztZQUMrQixrQkFBYSxHQUF5QixNQUFNLENBQUM7WUEwQnZFLGFBQVEsR0FBRyxFQUFFLENBQUM7WUFZdEIsOENBQThDO1lBQ3RDLHNCQUFpQixHQUFHLElBQUksR0FBRyxFQUE4QyxDQUFDO1lBS2xGLDZDQUE2QztZQUM1QixlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztZQWdIbEQ7OztlQUdHO1lBQ0ssbUJBQWMsR0FBRyxDQUFDLEtBQW9CLEVBQUUsRUFBRTtnQkFDaEQsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDbEYsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdEM7WUFDSCxDQUFDLENBQUE7WUExR0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7WUFFdEMsSUFBSSxlQUFlLEVBQUU7Z0JBQ25CLElBQUksZUFBZSxDQUFDLFFBQVEsRUFBRTtvQkFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUMsUUFBUSxDQUFDO2lCQUMxQztnQkFFRCxJQUFJLGVBQWUsQ0FBQyxhQUFhLEVBQUU7b0JBQ2pDLElBQUksQ0FBQyxhQUFhLEdBQUcsZUFBZSxDQUFDLGFBQWEsQ0FBQztpQkFDcEQ7YUFDRjtZQUVELE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7Z0JBQzdCLFdBQVcsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM3RSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUEvSEQsMkZBQTJGO1FBQzNGLElBQ0ksUUFBUSxLQUFzQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzFELElBQUksUUFBUSxDQUFDLEtBQXNCO1lBQ2pDLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2dCQUV2QixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFFdkIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7d0JBQ3pCLElBQUksQ0FBQyxnQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2hDO29CQUVELElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUM7aUJBQ25DO2FBQ0Y7UUFDSCxDQUFDO1FBRUQsMkNBQTJDO1FBQzNDLElBQ0ksUUFBUSxLQUFjLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxRQUFRLENBQUMsS0FBSztZQUNoQixJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTlDLDRDQUE0QztZQUM1QyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDZDtRQUNILENBQUM7UUF3QkQsaURBQWlEO1FBQ2pELElBQ0ksT0FBTyxLQUFLLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDdkMsSUFBSSxPQUFPLENBQUMsS0FBYTtZQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVyRixvRkFBb0Y7WUFDcEYsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFFdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUU7Z0JBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDZDtpQkFBTTtnQkFDTCxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7b0JBQ2xDLDBGQUEwRjtvQkFDMUYsNEZBQTRGO29CQUM1RiwwRkFBMEY7b0JBQzFGLDRGQUE0RjtvQkFDNUYsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7d0JBQzFCLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDN0UsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7YUFDSjtRQUNILENBQUM7UUFHRCxrRkFBa0Y7UUFDbEYsSUFDSSxZQUFZLEtBQUssT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUNqRCxJQUFJLFlBQVksQ0FBQyxLQUF1RDtZQUN0RSxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztZQUMzQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUMzQztRQUNILENBQUM7UUEwQ0QsZUFBZTtZQUNiLDJGQUEyRjtZQUMzRixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUUzQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2lCQUN6QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDaEMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNsQiw2REFBNkQ7Z0JBQzdELElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN0QztxQkFBTSxJQUFJLE1BQU0sS0FBSyxVQUFVLEVBQUU7b0JBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2lCQUNyQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVEOztXQUVHO1FBQ0gsV0FBVztZQUNULE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDO1lBRXJELFlBQVksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUV0QyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7YUFDOUI7WUFFRCxzREFBc0Q7WUFDdEQsYUFBYSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDakQsYUFBYSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztZQUM3RSxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUUvQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7WUFFM0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFFRCxpR0FBaUc7UUFDakcsSUFBSSxDQUFDLFFBQWdCLElBQUksQ0FBQyxTQUFTO1lBQ2pDLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7Z0JBQzdELENBQUMsSUFBSSxDQUFDLGdCQUFpQixDQUFDLGNBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBaUIsQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDakYsT0FBTzthQUNWO1lBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNmLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUM3RixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQ2pFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUU7aUJBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUNoQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsZ0JBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRCxpR0FBaUc7UUFDakcsSUFBSSxDQUFDLFFBQWdCLElBQUksQ0FBQyxTQUFTO1lBQ2pDLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUN6QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ25DO1FBQ0gsQ0FBQztRQUVELDhCQUE4QjtRQUM5QixNQUFNO1lBQ0osSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZELENBQUM7UUFFRCxtRUFBbUU7UUFDbkUsaUJBQWlCO1lBQ2YsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN0RSxDQUFDO1FBY0Qsc0RBQXNEO1FBQzlDLGNBQWM7WUFDcEIsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNwQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDekI7WUFFRCxNQUFNLG1CQUFtQixHQUNyQixJQUFJLENBQUMsaUJBQWlCLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRXpFLG1GQUFtRjtZQUNuRixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtpQkFDbkIsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztpQkFDckMscUJBQXFCLENBQUMsY0FBYyxDQUFDO2lCQUNyQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUM7aUJBQzdCLGtCQUFrQixDQUFDLENBQUMsQ0FBQztpQkFDckIsd0JBQXdCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUVwRSxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUMzRSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDekIsSUFBSSxNQUFNLENBQUMsd0JBQXdCLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxFQUFFO3dCQUN6Riw2REFBNkQ7d0JBQzdELDhDQUE4Qzt3QkFDOUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN0QztpQkFDRjtZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDdEMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNwQixnQkFBZ0IsRUFBRSxRQUFRO2dCQUMxQixVQUFVLEVBQUUsbUJBQW1CO2dCQUMvQixjQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTthQUN2QyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFFdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUU7aUJBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUNoQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFFbkMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQzFCLENBQUM7UUFFRCwrQ0FBK0M7UUFDdkMsT0FBTztZQUNiLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFFO2dCQUN0RCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQzNCO1lBRUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUMvQixDQUFDO1FBRUQsbURBQW1EO1FBQzNDLGVBQWU7WUFDckIsTUFBTSxRQUFRLEdBQ1YsSUFBSSxDQUFDLFdBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxnQkFBcUQsQ0FBQztZQUN4RixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDakMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFFM0MsUUFBUSxDQUFDLGFBQWEsQ0FBQztnREFDakIsTUFBTSxDQUFDLElBQUksR0FBSyxPQUFPLENBQUMsSUFBSTtnREFDNUIsTUFBTSxDQUFDLFFBQVEsR0FBSyxPQUFPLENBQUMsUUFBUTthQUN6QyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQ7OztXQUdHO1FBQ0gsVUFBVTtZQUNSLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUM7WUFDckQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUMvQixJQUFJLGNBQXdDLENBQUM7WUFFN0MsSUFBSSxRQUFRLElBQUksT0FBTyxJQUFJLFFBQVEsSUFBSSxPQUFPLEVBQUU7Z0JBQzlDLGNBQWMsR0FBRyxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFDLENBQUM7YUFDdkY7aUJBQU0sSUFDTCxRQUFRLElBQUksUUFBUTtnQkFDcEIsQ0FBQyxRQUFRLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQztnQkFDN0IsQ0FBQyxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2pDLGNBQWMsR0FBRyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBQyxDQUFDO2FBQ3hEO2lCQUFNLElBQ0wsUUFBUSxJQUFJLE9BQU87Z0JBQ25CLENBQUMsUUFBUSxJQUFJLE9BQU8sSUFBSSxLQUFLLENBQUM7Z0JBQzlCLENBQUMsUUFBUSxJQUFJLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNoQyxjQUFjLEdBQUcsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUMsQ0FBQzthQUN0RDtpQkFBTTtnQkFDTCxNQUFNLGlDQUFpQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ25EO1lBRUQsTUFBTSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXBGLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLGNBQWM7Z0JBQ3BCLFFBQVEsRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQzthQUNuQyxDQUFDO1FBQ0osQ0FBQztRQUVELDBGQUEwRjtRQUMxRixtQkFBbUI7WUFDakIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQztZQUNyRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQy9CLElBQUksZUFBMEMsQ0FBQztZQUUvQyxJQUFJLFFBQVEsSUFBSSxPQUFPLEVBQUU7Z0JBQ3ZCLGVBQWUsR0FBRyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDO2FBQzVEO2lCQUFNLElBQUksUUFBUSxJQUFJLE9BQU8sRUFBRTtnQkFDOUIsZUFBZSxHQUFHLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUM7YUFDekQ7aUJBQU0sSUFDTCxRQUFRLElBQUksUUFBUTtnQkFDcEIsQ0FBQyxRQUFRLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQztnQkFDN0IsQ0FBQyxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2pDLGVBQWUsR0FBRyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDO2FBQ3pEO2lCQUFNLElBQ0wsUUFBUSxJQUFJLE9BQU87Z0JBQ25CLENBQUMsUUFBUSxJQUFJLE9BQU8sSUFBSSxLQUFLLENBQUM7Z0JBQzlCLENBQUMsUUFBUSxJQUFJLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNoQyxlQUFlLEdBQUcsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsQ0FBQzthQUMzRDtpQkFBTTtnQkFDTCxNQUFNLGlDQUFpQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ25EO1lBRUQsTUFBTSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXhGLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLGVBQWU7Z0JBQ3JCLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBQzthQUNyQyxDQUFDO1FBQ0osQ0FBQztRQUVELGtHQUFrRztRQUMxRixxQkFBcUI7WUFDM0IsMEZBQTBGO1lBQzFGLG1FQUFtRTtZQUNuRSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUM3QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBRXRDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUMvQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQ1AsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FDM0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO29CQUNmLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO3dCQUN6QixJQUFJLENBQUMsV0FBWSxDQUFDLGNBQWMsRUFBRSxDQUFDO3FCQUNwQztnQkFDSCxDQUFDLENBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQztRQUVELGdDQUFnQztRQUN4QixnQkFBZ0IsQ0FBQyxZQUE4RDtZQUNyRixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUN2QztRQUNILENBQUM7UUFFRCxtQ0FBbUM7UUFDM0IsZUFBZSxDQUFDLENBQTBCLEVBQUUsQ0FBd0I7WUFDMUUsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRTtnQkFDMUQsSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFO29CQUNmLENBQUMsR0FBRyxRQUFRLENBQUM7aUJBQ2Q7cUJBQU0sSUFBSSxDQUFDLEtBQUssUUFBUSxFQUFFO29CQUN6QixDQUFDLEdBQUcsS0FBSyxDQUFDO2lCQUNYO2FBQ0Y7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFO29CQUNmLENBQUMsR0FBRyxPQUFPLENBQUM7aUJBQ2I7cUJBQU0sSUFBSSxDQUFDLEtBQUssT0FBTyxFQUFFO29CQUN4QixDQUFDLEdBQUcsS0FBSyxDQUFDO2lCQUNYO2FBQ0Y7WUFFRCxPQUFPLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO1FBQ2hCLENBQUM7UUFFRCx1REFBdUQ7UUFDL0MsbUJBQW1CO1lBQ3pCLHNGQUFzRjtZQUN0RixxRkFBcUY7WUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2xELElBQUksQ0FBQyxpQkFBaUI7cUJBQ25CLEdBQUcsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO3FCQUNwQyxHQUFHLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQ3pDO2lCQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxLQUFLLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxpQ0FBaUMsRUFBRSxDQUFDO2dCQUN6QyxNQUFNLGdCQUFnQixHQUFHLEdBQUcsRUFBRTtvQkFDNUIsWUFBWSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDcEQsQ0FBQyxDQUFDO2dCQUVGLElBQUksQ0FBQyxpQkFBaUI7cUJBQ25CLEdBQUcsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUM7cUJBQ2pDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLENBQUM7cUJBQ3BDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO29CQUN0QixnRUFBZ0U7b0JBQ2hFLGtFQUFrRTtvQkFDbEUsWUFBWSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUN0QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDM0UsQ0FBQyxDQUFDLENBQUM7YUFDTjtZQUVELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztZQUMzRixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCwwRkFBMEY7UUFDbEYsaUNBQWlDO1lBQ3ZDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDO1lBQy9DLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFDNUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUVwQyxJQUFJLFFBQVEsS0FBSyxLQUFLLEVBQUU7Z0JBQ3RCLCtFQUErRTtnQkFDL0UsK0VBQStFO2dCQUMvRSxJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFVBQVUsQ0FBQyxFQUFFO29CQUMxRixLQUFLLENBQUMsVUFBVSxHQUFJLEtBQWEsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLGdCQUFnQjt3QkFDbEUsS0FBYSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7aUJBQzNDO2dCQUVELHdFQUF3RTtnQkFDeEUsNEVBQTRFO2dCQUM1RSxJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFO29CQUMxQyxLQUFhLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQztpQkFDeEM7Z0JBRUQsS0FBSyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7Z0JBQzNCLEtBQUssQ0FBQyx1QkFBdUIsR0FBRyxhQUFhLENBQUM7YUFDL0M7UUFDSCxDQUFDOzs7Z0JBbmRGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUscUJBQXFCO3FCQUMvQjtpQkFDRjs7OztnQkF2SEMsT0FBTztnQkFjUCxVQUFVO2dCQU5KLGdCQUFnQjtnQkFhdEIsZ0JBQWdCO2dCQUhoQixNQUFNO2dCQVpBLFFBQVE7Z0JBZlIsYUFBYTtnQkFBRSxZQUFZO2dEQXNQOUIsTUFBTSxTQUFDLDJCQUEyQjtnQkFyUC9CLGNBQWMsdUJBc1BqQixRQUFRO2dEQUNSLFFBQVEsWUFBSSxNQUFNLFNBQUMsMkJBQTJCOzs7MkJBNUdoRCxLQUFLLFNBQUMsb0JBQW9COzJCQW1CMUIsS0FBSyxTQUFDLG9CQUFvQjs0QkFZMUIsS0FBSyxTQUFDLHFCQUFxQjs0QkFHM0IsS0FBSyxTQUFDLHFCQUFxQjtnQ0FnQjNCLEtBQUssU0FBQyx5QkFBeUI7MEJBRy9CLEtBQUssU0FBQyxZQUFZOytCQTBCbEIsS0FBSyxTQUFDLGlCQUFpQjs7SUF1WDFCLGlCQUFDO0tBQUE7U0FqZFksVUFBVTtBQW1kdkI7OztHQUdHO0FBQ0g7SUFBQSxNQWVhLGdCQUFnQjtRQXlCM0IsWUFDVSxrQkFBcUMsRUFDckMsbUJBQXVDO1lBRHZDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7WUFDckMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFvQjtZQWRqRCw4RUFBOEU7WUFDOUUsZ0JBQVcsR0FBc0IsU0FBUyxDQUFDO1lBRTNDLGdFQUFnRTtZQUN4RCx3QkFBbUIsR0FBWSxLQUFLLENBQUM7WUFFN0MsMkVBQTJFO1lBQzFELFlBQU8sR0FBaUIsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUV2RCx1RUFBdUU7WUFDdkUsZUFBVSxHQUFnQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUk1QyxDQUFDO1FBRXJEOzs7V0FHRztRQUNILElBQUksQ0FBQyxLQUFhO1lBQ2hCLDZDQUE2QztZQUM3QyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3ZCLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2FBQzVCO1lBRUQsOEVBQThFO1lBQzlFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7WUFDaEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7Z0JBRTNCLHdEQUF3RDtnQkFDeEQsK0RBQStEO2dCQUMvRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ1osQ0FBQztRQUVEOzs7V0FHRztRQUNILElBQUksQ0FBQyxLQUFhO1lBQ2hCLDZDQUE2QztZQUM3QyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3ZCLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2FBQzVCO1lBRUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7Z0JBRTNCLHdEQUF3RDtnQkFDeEQsK0RBQStEO2dCQUMvRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ1osQ0FBQztRQUVELHNGQUFzRjtRQUN0RixXQUFXO1lBQ1QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3JDLENBQUM7UUFFRCw4Q0FBOEM7UUFDOUMsU0FBUztZQUNQLE9BQU8sSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTLENBQUM7UUFDeEMsQ0FBQztRQUVELFdBQVc7WUFDVCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFCLENBQUM7UUFFRCxlQUFlO1lBQ2IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztRQUNuQyxDQUFDO1FBRUQsY0FBYyxDQUFDLEtBQXFCO1lBQ2xDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUE0QixDQUFDO1lBRW5ELElBQUksT0FBTyxLQUFLLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtnQkFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNyQjtZQUVELElBQUksT0FBTyxLQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUssUUFBUSxFQUFFO2dCQUNqRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO2FBQ2pDO1FBQ0gsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxzQkFBc0I7WUFDcEIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDZDtRQUNILENBQUM7UUFFRDs7OztXQUlHO1FBQ0gsYUFBYTtZQUNYLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxDQUFDOzs7Z0JBeElGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsdUJBQXVCO29CQUNqQyx3UkFBMkI7b0JBRTNCLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsVUFBVSxFQUFFLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDO29CQUMvQyxJQUFJLEVBQUU7d0JBQ0osMEZBQTBGO3dCQUMxRiwyRkFBMkY7d0JBQzNGLGNBQWMsRUFBRSxzQ0FBc0M7d0JBQ3RELGNBQWMsRUFBRSwrQkFBK0I7d0JBQy9DLGFBQWEsRUFBRSxNQUFNO3FCQUN0Qjs7aUJBQ0Y7Ozs7Z0JBbGxCQyxpQkFBaUI7Z0JBaEJYLGtCQUFrQjs7SUE2dEIxQix1QkFBQztLQUFBO1NBMUhZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge0FyaWFEZXNjcmliZXIsIEZvY3VzTW9uaXRvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgTnVtYmVySW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0VTQ0FQRSwgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge0JyZWFrcG9pbnRPYnNlcnZlciwgQnJlYWtwb2ludHMsIEJyZWFrcG9pbnRTdGF0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2xheW91dCc7XG5pbXBvcnQge1xuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG4gIEhvcml6b250YWxDb25uZWN0aW9uUG9zLFxuICBPcmlnaW5Db25uZWN0aW9uUG9zaXRpb24sXG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25uZWN0aW9uUG9zaXRpb24sXG4gIE92ZXJsYXlSZWYsXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBWZXJ0aWNhbENvbm5lY3Rpb25Qb3MsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7UGxhdGZvcm0sIG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0NvbXBvbmVudFBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1Njcm9sbERpc3BhdGNoZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEFmdGVyVmlld0luaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7bWF0VG9vbHRpcEFuaW1hdGlvbnN9IGZyb20gJy4vdG9vbHRpcC1hbmltYXRpb25zJztcblxuXG4vKiogUG9zc2libGUgcG9zaXRpb25zIGZvciBhIHRvb2x0aXAuICovXG5leHBvcnQgdHlwZSBUb29sdGlwUG9zaXRpb24gPSAnbGVmdCcgfCAncmlnaHQnIHwgJ2Fib3ZlJyB8ICdiZWxvdycgfCAnYmVmb3JlJyB8ICdhZnRlcic7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgaG93IHRoZSB0b29sdGlwIHRyaWdnZXIgc2hvdWxkIGhhbmRsZSB0b3VjaCBnZXN0dXJlcy5cbiAqIFNlZSBgTWF0VG9vbHRpcC50b3VjaEdlc3R1cmVzYCBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqL1xuZXhwb3J0IHR5cGUgVG9vbHRpcFRvdWNoR2VzdHVyZXMgPSAnYXV0bycgfCAnb24nIHwgJ29mZic7XG5cbi8qKiBQb3NzaWJsZSB2aXNpYmlsaXR5IHN0YXRlcyBvZiBhIHRvb2x0aXAuICovXG5leHBvcnQgdHlwZSBUb29sdGlwVmlzaWJpbGl0eSA9ICdpbml0aWFsJyB8ICd2aXNpYmxlJyB8ICdoaWRkZW4nO1xuXG4vKiogVGltZSBpbiBtcyB0byB0aHJvdHRsZSByZXBvc2l0aW9uaW5nIGFmdGVyIHNjcm9sbCBldmVudHMuICovXG5leHBvcnQgY29uc3QgU0NST0xMX1RIUk9UVExFX01TID0gMjA7XG5cbi8qKiBDU1MgY2xhc3MgdGhhdCB3aWxsIGJlIGF0dGFjaGVkIHRvIHRoZSBvdmVybGF5IHBhbmVsLiAqL1xuZXhwb3J0IGNvbnN0IFRPT0xUSVBfUEFORUxfQ0xBU1MgPSAnbWF0LXRvb2x0aXAtcGFuZWwnO1xuXG4vKiogT3B0aW9ucyB1c2VkIHRvIGJpbmQgcGFzc2l2ZSBldmVudCBsaXN0ZW5lcnMuICovXG5jb25zdCBwYXNzaXZlTGlzdGVuZXJPcHRpb25zID0gbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyh7cGFzc2l2ZTogdHJ1ZX0pO1xuXG4vKipcbiAqIFRpbWUgYmV0d2VlbiB0aGUgdXNlciBwdXR0aW5nIHRoZSBwb2ludGVyIG9uIGEgdG9vbHRpcFxuICogdHJpZ2dlciBhbmQgdGhlIGxvbmcgcHJlc3MgZXZlbnQgYmVpbmcgZmlyZWQuXG4gKi9cbmNvbnN0IExPTkdQUkVTU19ERUxBWSA9IDUwMDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGVycm9yIHRvIGJlIHRocm93biBpZiB0aGUgdXNlciBzdXBwbGllZCBhbiBpbnZhbGlkIHRvb2x0aXAgcG9zaXRpb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRUb29sdGlwSW52YWxpZFBvc2l0aW9uRXJyb3IocG9zaXRpb246IHN0cmluZykge1xuICByZXR1cm4gRXJyb3IoYFRvb2x0aXAgcG9zaXRpb24gXCIke3Bvc2l0aW9ufVwiIGlzIGludmFsaWQuYCk7XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgYSB0b29sdGlwIGlzIHZpc2libGUuICovXG5leHBvcnQgY29uc3QgTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KCdtYXQtdG9vbHRpcC1zY3JvbGwtc3RyYXRlZ3knKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oe3Njcm9sbFRocm90dGxlOiBTQ1JPTExfVEhST1RUTEVfTVN9KTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZLFxufTtcblxuLyoqIERlZmF1bHQgYG1hdFRvb2x0aXBgIG9wdGlvbnMgdGhhdCBjYW4gYmUgb3ZlcnJpZGRlbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0VG9vbHRpcERlZmF1bHRPcHRpb25zIHtcbiAgc2hvd0RlbGF5OiBudW1iZXI7XG4gIGhpZGVEZWxheTogbnVtYmVyO1xuICB0b3VjaGVuZEhpZGVEZWxheTogbnVtYmVyO1xuICB0b3VjaEdlc3R1cmVzPzogVG9vbHRpcFRvdWNoR2VzdHVyZXM7XG4gIHBvc2l0aW9uPzogVG9vbHRpcFBvc2l0aW9uO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdFRvb2x0aXBgLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9UT09MVElQX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdFRvb2x0aXBEZWZhdWx0T3B0aW9ucz4oJ21hdC10b29sdGlwLWRlZmF1bHQtb3B0aW9ucycsIHtcbiAgICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICAgIGZhY3Rvcnk6IE1BVF9UT09MVElQX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZXG4gICAgfSk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1RPT0xUSVBfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0VG9vbHRpcERlZmF1bHRPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICBzaG93RGVsYXk6IDAsXG4gICAgaGlkZURlbGF5OiAwLFxuICAgIHRvdWNoZW5kSGlkZURlbGF5OiAxNTAwLFxuICB9O1xufVxuXG4vKipcbiAqIERpcmVjdGl2ZSB0aGF0IGF0dGFjaGVzIGEgbWF0ZXJpYWwgZGVzaWduIHRvb2x0aXAgdG8gdGhlIGhvc3QgZWxlbWVudC4gQW5pbWF0ZXMgdGhlIHNob3dpbmcgYW5kXG4gKiBoaWRpbmcgb2YgYSB0b29sdGlwIHByb3ZpZGVkIHBvc2l0aW9uIChkZWZhdWx0cyB0byBiZWxvdyB0aGUgZWxlbWVudCkuXG4gKlxuICogaHR0cHM6Ly9tYXRlcmlhbC5pby9kZXNpZ24vY29tcG9uZW50cy90b29sdGlwcy5odG1sXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUb29sdGlwXScsXG4gIGV4cG9ydEFzOiAnbWF0VG9vbHRpcCcsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRvb2x0aXAtdHJpZ2dlcidcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRUb29sdGlwIGltcGxlbWVudHMgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYgfCBudWxsO1xuICBfdG9vbHRpcEluc3RhbmNlOiBUb29sdGlwQ29tcG9uZW50IHwgbnVsbDtcblxuICBwcml2YXRlIF9wb3J0YWw6IENvbXBvbmVudFBvcnRhbDxUb29sdGlwQ29tcG9uZW50PjtcbiAgcHJpdmF0ZSBfcG9zaXRpb246IFRvb2x0aXBQb3NpdGlvbiA9ICdiZWxvdyc7XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgX3Rvb2x0aXBDbGFzczogc3RyaW5nfHN0cmluZ1tdfFNldDxzdHJpbmc+fHtba2V5OiBzdHJpbmddOiBhbnl9O1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG5cbiAgLyoqIEFsbG93cyB0aGUgdXNlciB0byBkZWZpbmUgdGhlIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQgZWxlbWVudCAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBQb3NpdGlvbicpXG4gIGdldCBwb3NpdGlvbigpOiBUb29sdGlwUG9zaXRpb24geyByZXR1cm4gdGhpcy5fcG9zaXRpb247IH1cbiAgc2V0IHBvc2l0aW9uKHZhbHVlOiBUb29sdGlwUG9zaXRpb24pIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX3Bvc2l0aW9uKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbiA9IHZhbHVlO1xuXG4gICAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuXG4gICAgICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UhLnNob3coMCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9vdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIERpc2FibGVzIHRoZSBkaXNwbGF5IG9mIHRoZSB0b29sdGlwLiAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBEaXNhYmxlZCcpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVkOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZSkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIC8vIElmIHRvb2x0aXAgaXMgZGlzYWJsZWQsIGhpZGUgaW1tZWRpYXRlbHkuXG4gICAgaWYgKHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICB0aGlzLmhpZGUoMCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSBkZWZhdWx0IGRlbGF5IGluIG1zIGJlZm9yZSBzaG93aW5nIHRoZSB0b29sdGlwIGFmdGVyIHNob3cgaXMgY2FsbGVkICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcFNob3dEZWxheScpIHNob3dEZWxheTogbnVtYmVyID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuc2hvd0RlbGF5O1xuXG4gIC8qKiBUaGUgZGVmYXVsdCBkZWxheSBpbiBtcyBiZWZvcmUgaGlkaW5nIHRoZSB0b29sdGlwIGFmdGVyIGhpZGUgaXMgY2FsbGVkICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcEhpZGVEZWxheScpIGhpZGVEZWxheTogbnVtYmVyID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuaGlkZURlbGF5O1xuXG4gIC8qKlxuICAgKiBIb3cgdG91Y2ggZ2VzdHVyZXMgc2hvdWxkIGJlIGhhbmRsZWQgYnkgdGhlIHRvb2x0aXAuIE9uIHRvdWNoIGRldmljZXMgdGhlIHRvb2x0aXAgZGlyZWN0aXZlXG4gICAqIHVzZXMgYSBsb25nIHByZXNzIGdlc3R1cmUgdG8gc2hvdyBhbmQgaGlkZSwgaG93ZXZlciBpdCBjYW4gY29uZmxpY3Qgd2l0aCB0aGUgbmF0aXZlIGJyb3dzZXJcbiAgICogZ2VzdHVyZXMuIFRvIHdvcmsgYXJvdW5kIHRoZSBjb25mbGljdCwgQW5ndWxhciBNYXRlcmlhbCBkaXNhYmxlcyBuYXRpdmUgZ2VzdHVyZXMgb24gdGhlXG4gICAqIHRyaWdnZXIsIGJ1dCB0aGF0IG1pZ2h0IG5vdCBiZSBkZXNpcmFibGUgb24gcGFydGljdWxhciBlbGVtZW50cyAoZS5nLiBpbnB1dHMgYW5kIGRyYWdnYWJsZVxuICAgKiBlbGVtZW50cykuIFRoZSBkaWZmZXJlbnQgdmFsdWVzIGZvciB0aGlzIG9wdGlvbiBjb25maWd1cmUgdGhlIHRvdWNoIGV2ZW50IGhhbmRsaW5nIGFzIGZvbGxvd3M6XG4gICAqIC0gYGF1dG9gIC0gRW5hYmxlcyB0b3VjaCBnZXN0dXJlcyBmb3IgYWxsIGVsZW1lbnRzLCBidXQgdHJpZXMgdG8gYXZvaWQgY29uZmxpY3RzIHdpdGggbmF0aXZlXG4gICAqICAgYnJvd3NlciBnZXN0dXJlcyBvbiBwYXJ0aWN1bGFyIGVsZW1lbnRzLiBJbiBwYXJ0aWN1bGFyLCBpdCBhbGxvd3MgdGV4dCBzZWxlY3Rpb24gb24gaW5wdXRzXG4gICAqICAgYW5kIHRleHRhcmVhcywgYW5kIHByZXNlcnZlcyB0aGUgbmF0aXZlIGJyb3dzZXIgZHJhZ2dpbmcgb24gZWxlbWVudHMgbWFya2VkIGFzIGBkcmFnZ2FibGVgLlxuICAgKiAtIGBvbmAgLSBFbmFibGVzIHRvdWNoIGdlc3R1cmVzIGZvciBhbGwgZWxlbWVudHMgYW5kIGRpc2FibGVzIG5hdGl2ZVxuICAgKiAgIGJyb3dzZXIgZ2VzdHVyZXMgd2l0aCBubyBleGNlcHRpb25zLlxuICAgKiAtIGBvZmZgIC0gRGlzYWJsZXMgdG91Y2ggZ2VzdHVyZXMuIE5vdGUgdGhhdCB0aGlzIHdpbGwgcHJldmVudCB0aGUgdG9vbHRpcCBmcm9tXG4gICAqICAgc2hvd2luZyBvbiB0b3VjaCBkZXZpY2VzLlxuICAgKi9cbiAgQElucHV0KCdtYXRUb29sdGlwVG91Y2hHZXN0dXJlcycpIHRvdWNoR2VzdHVyZXM6IFRvb2x0aXBUb3VjaEdlc3R1cmVzID0gJ2F1dG8nO1xuXG4gIC8qKiBUaGUgbWVzc2FnZSB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIHRvb2x0aXAgKi9cbiAgQElucHV0KCdtYXRUb29sdGlwJylcbiAgZ2V0IG1lc3NhZ2UoKSB7IHJldHVybiB0aGlzLl9tZXNzYWdlOyB9XG4gIHNldCBtZXNzYWdlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLnJlbW92ZURlc2NyaXB0aW9uKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5fbWVzc2FnZSk7XG5cbiAgICAvLyBJZiB0aGUgbWVzc2FnZSBpcyBub3QgYSBzdHJpbmcgKGUuZy4gbnVtYmVyKSwgY29udmVydCBpdCB0byBhIHN0cmluZyBhbmQgdHJpbSBpdC5cbiAgICB0aGlzLl9tZXNzYWdlID0gdmFsdWUgIT0gbnVsbCA/IGAke3ZhbHVlfWAudHJpbSgpIDogJyc7XG5cbiAgICBpZiAoIXRoaXMuX21lc3NhZ2UgJiYgdGhpcy5faXNUb29sdGlwVmlzaWJsZSgpKSB7XG4gICAgICB0aGlzLmhpZGUoMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVRvb2x0aXBNZXNzYWdlKCk7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAvLyBUaGUgYEFyaWFEZXNjcmliZXJgIGhhcyBzb21lIGZ1bmN0aW9uYWxpdHkgdGhhdCBhdm9pZHMgYWRkaW5nIGEgZGVzY3JpcHRpb24gaWYgaXQncyB0aGVcbiAgICAgICAgLy8gc2FtZSBhcyB0aGUgYGFyaWEtbGFiZWxgIG9mIGFuIGVsZW1lbnQsIGhvd2V2ZXIgd2UgY2FuJ3Qga25vdyB3aGV0aGVyIHRoZSB0b29sdGlwIHRyaWdnZXJcbiAgICAgICAgLy8gaGFzIGEgZGF0YS1ib3VuZCBgYXJpYS1sYWJlbGAgb3Igd2hlbiBpdCdsbCBiZSBzZXQgZm9yIHRoZSBmaXJzdCB0aW1lLiBXZSBjYW4gYXZvaWQgdGhlXG4gICAgICAgIC8vIGlzc3VlIGJ5IGRlZmVycmluZyB0aGUgZGVzY3JpcHRpb24gYnkgYSB0aWNrIHNvIEFuZ3VsYXIgaGFzIHRpbWUgdG8gc2V0IHRoZSBgYXJpYS1sYWJlbGAuXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2FyaWFEZXNjcmliZXIuZGVzY3JpYmUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLm1lc3NhZ2UpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9tZXNzYWdlID0gJyc7XG5cbiAgLyoqIENsYXNzZXMgdG8gYmUgcGFzc2VkIHRvIHRoZSB0b29sdGlwLiBTdXBwb3J0cyB0aGUgc2FtZSBzeW50YXggYXMgYG5nQ2xhc3NgLiAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBDbGFzcycpXG4gIGdldCB0b29sdGlwQ2xhc3MoKSB7IHJldHVybiB0aGlzLl90b29sdGlwQ2xhc3M7IH1cbiAgc2V0IHRvb2x0aXBDbGFzcyh2YWx1ZTogc3RyaW5nfHN0cmluZ1tdfFNldDxzdHJpbmc+fHtba2V5OiBzdHJpbmddOiBhbnl9KSB7XG4gICAgdGhpcy5fdG9vbHRpcENsYXNzID0gdmFsdWU7XG4gICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fc2V0VG9vbHRpcENsYXNzKHRoaXMuX3Rvb2x0aXBDbGFzcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIE1hbnVhbGx5LWJvdW5kIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXJzLiAqL1xuICBwcml2YXRlIF9wYXNzaXZlTGlzdGVuZXJzID0gbmV3IE1hcDxzdHJpbmcsIEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3Q+KCk7XG5cbiAgLyoqIFRpbWVyIHN0YXJ0ZWQgYXQgdGhlIGxhc3QgYHRvdWNoc3RhcnRgIGV2ZW50LiAqL1xuICBwcml2YXRlIF90b3VjaHN0YXJ0VGltZW91dDogbnVtYmVyO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBwcml2YXRlIF9hcmlhRGVzY3JpYmVyOiBBcmlhRGVzY3JpYmVyLFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIEBJbmplY3QoTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfVE9PTFRJUF9ERUZBVUxUX09QVElPTlMpXG4gICAgICBwcml2YXRlIF9kZWZhdWx0T3B0aW9uczogTWF0VG9vbHRpcERlZmF1bHRPcHRpb25zKSB7XG5cbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneSA9IHNjcm9sbFN0cmF0ZWd5O1xuXG4gICAgaWYgKF9kZWZhdWx0T3B0aW9ucykge1xuICAgICAgaWYgKF9kZWZhdWx0T3B0aW9ucy5wb3NpdGlvbikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gX2RlZmF1bHRPcHRpb25zLnBvc2l0aW9uO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2RlZmF1bHRPcHRpb25zLnRvdWNoR2VzdHVyZXMpIHtcbiAgICAgICAgdGhpcy50b3VjaEdlc3R1cmVzID0gX2RlZmF1bHRPcHRpb25zLnRvdWNoR2VzdHVyZXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9oYW5kbGVLZXlkb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBUaGlzIG5lZWRzIHRvIGhhcHBlbiBhZnRlciB2aWV3IGluaXQgc28gdGhlIGluaXRpYWwgdmFsdWVzIGZvciBhbGwgaW5wdXRzIGhhdmUgYmVlbiBzZXQuXG4gICAgdGhpcy5fc2V0dXBQb2ludGVyRXZlbnRzKCk7XG5cbiAgICB0aGlzLl9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKG9yaWdpbiA9PiB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCB0aGUgZm9jdXMgbW9uaXRvciBydW5zIG91dHNpZGUgdGhlIEFuZ3VsYXIgem9uZS5cbiAgICAgICAgaWYgKCFvcmlnaW4pIHtcbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMuaGlkZSgwKSk7XG4gICAgICAgIH0gZWxzZSBpZiAob3JpZ2luID09PSAna2V5Ym9hcmQnKSB7XG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLnNob3coKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwb3NlIHRoZSB0b29sdGlwIHdoZW4gZGVzdHJveWVkLlxuICAgKi9cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGNsZWFyVGltZW91dCh0aGlzLl90b3VjaHN0YXJ0VGltZW91dCk7XG5cbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIENsZWFuIHVwIHRoZSBldmVudCBsaXN0ZW5lcnMgc2V0IGluIHRoZSBjb25zdHJ1Y3RvclxuICAgIG5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2hhbmRsZUtleWRvd24pO1xuICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIsIGV2ZW50KSA9PiB7XG4gICAgICBuYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBwYXNzaXZlTGlzdGVuZXJPcHRpb25zKTtcbiAgICB9KTtcbiAgICB0aGlzLl9wYXNzaXZlTGlzdGVuZXJzLmNsZWFyKCk7XG5cbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuXG4gICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbihuYXRpdmVFbGVtZW50LCB0aGlzLm1lc3NhZ2UpO1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyhuYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBTaG93cyB0aGUgdG9vbHRpcCBhZnRlciB0aGUgZGVsYXkgaW4gbXMsIGRlZmF1bHRzIHRvIHRvb2x0aXAtZGVsYXktc2hvdyBvciAwbXMgaWYgbm8gaW5wdXQgKi9cbiAgc2hvdyhkZWxheTogbnVtYmVyID0gdGhpcy5zaG93RGVsYXkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5tZXNzYWdlIHx8ICh0aGlzLl9pc1Rvb2x0aXBWaXNpYmxlKCkgJiZcbiAgICAgICF0aGlzLl90b29sdGlwSW5zdGFuY2UhLl9zaG93VGltZW91dElkICYmICF0aGlzLl90b29sdGlwSW5zdGFuY2UhLl9oaWRlVGltZW91dElkKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXkoKTtcbiAgICB0aGlzLl9kZXRhY2goKTtcbiAgICB0aGlzLl9wb3J0YWwgPSB0aGlzLl9wb3J0YWwgfHwgbmV3IENvbXBvbmVudFBvcnRhbChUb29sdGlwQ29tcG9uZW50LCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UgPSBvdmVybGF5UmVmLmF0dGFjaCh0aGlzLl9wb3J0YWwpLmluc3RhbmNlO1xuICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5hZnRlckhpZGRlbigpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fZGV0YWNoKCkpO1xuICAgIHRoaXMuX3NldFRvb2x0aXBDbGFzcyh0aGlzLl90b29sdGlwQ2xhc3MpO1xuICAgIHRoaXMuX3VwZGF0ZVRvb2x0aXBNZXNzYWdlKCk7XG4gICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlIS5zaG93KGRlbGF5KTtcbiAgfVxuXG4gIC8qKiBIaWRlcyB0aGUgdG9vbHRpcCBhZnRlciB0aGUgZGVsYXkgaW4gbXMsIGRlZmF1bHRzIHRvIHRvb2x0aXAtZGVsYXktaGlkZSBvciAwbXMgaWYgbm8gaW5wdXQgKi9cbiAgaGlkZShkZWxheTogbnVtYmVyID0gdGhpcy5oaWRlRGVsYXkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UuaGlkZShkZWxheSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNob3dzL2hpZGVzIHRoZSB0b29sdGlwICovXG4gIHRvZ2dsZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9pc1Rvb2x0aXBWaXNpYmxlKCkgPyB0aGlzLmhpZGUoKSA6IHRoaXMuc2hvdygpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdG9vbHRpcCBpcyBjdXJyZW50bHkgdmlzaWJsZSB0byB0aGUgdXNlciAqL1xuICBfaXNUb29sdGlwVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLl90b29sdGlwSW5zdGFuY2UgJiYgdGhpcy5fdG9vbHRpcEluc3RhbmNlLmlzVmlzaWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlIGtleWRvd24gZXZlbnRzIG9uIHRoZSBob3N0IGVsZW1lbnQuXG4gICAqIE5lZWRzIHRvIGJlIGFuIGFycm93IGZ1bmN0aW9uIHNvIHRoYXQgd2UgY2FuIHVzZSBpdCBpbiBhZGRFdmVudExpc3RlbmVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGFuZGxlS2V5ZG93biA9IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmICh0aGlzLl9pc1Rvb2x0aXBWaXNpYmxlKCkgJiYgZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFICYmICFoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5oaWRlKDApKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ3JlYXRlIHRoZSBvdmVybGF5IGNvbmZpZyBhbmQgcG9zaXRpb24gc3RyYXRlZ3kgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlT3ZlcmxheSgpOiBPdmVybGF5UmVmIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWY7XG4gICAgfVxuXG4gICAgY29uc3Qgc2Nyb2xsYWJsZUFuY2VzdG9ycyA9XG4gICAgICAgIHRoaXMuX3Njcm9sbERpc3BhdGNoZXIuZ2V0QW5jZXN0b3JTY3JvbGxDb250YWluZXJzKHRoaXMuX2VsZW1lbnRSZWYpO1xuXG4gICAgLy8gQ3JlYXRlIGNvbm5lY3RlZCBwb3NpdGlvbiBzdHJhdGVneSB0aGF0IGxpc3RlbnMgZm9yIHNjcm9sbCBldmVudHMgdG8gcmVwb3NpdGlvbi5cbiAgICBjb25zdCBzdHJhdGVneSA9IHRoaXMuX292ZXJsYXkucG9zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgIC5mbGV4aWJsZUNvbm5lY3RlZFRvKHRoaXMuX2VsZW1lbnRSZWYpXG4gICAgICAgICAgICAgICAgICAgICAgICAgLndpdGhUcmFuc2Zvcm1PcmlnaW5PbignLm1hdC10b29sdGlwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAud2l0aEZsZXhpYmxlRGltZW5zaW9ucyhmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAud2l0aFZpZXdwb3J0TWFyZ2luKDgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgLndpdGhTY3JvbGxhYmxlQ29udGFpbmVycyhzY3JvbGxhYmxlQW5jZXN0b3JzKTtcblxuICAgIHN0cmF0ZWd5LnBvc2l0aW9uQ2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoY2hhbmdlID0+IHtcbiAgICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgICAgaWYgKGNoYW5nZS5zY3JvbGxhYmxlVmlld1Byb3BlcnRpZXMuaXNPdmVybGF5Q2xpcHBlZCAmJiB0aGlzLl90b29sdGlwSW5zdGFuY2UuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgICAvLyBBZnRlciBwb3NpdGlvbiBjaGFuZ2VzIG9jY3VyIGFuZCB0aGUgb3ZlcmxheSBpcyBjbGlwcGVkIGJ5XG4gICAgICAgICAgLy8gYSBwYXJlbnQgc2Nyb2xsYWJsZSB0aGVuIGNsb3NlIHRoZSB0b29sdGlwLlxuICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5oaWRlKDApKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKHtcbiAgICAgIGRpcmVjdGlvbjogdGhpcy5fZGlyLFxuICAgICAgcG9zaXRpb25TdHJhdGVneTogc3RyYXRlZ3ksXG4gICAgICBwYW5lbENsYXNzOiBUT09MVElQX1BBTkVMX0NMQVNTLFxuICAgICAgc2Nyb2xsU3RyYXRlZ3k6IHRoaXMuX3Njcm9sbFN0cmF0ZWd5KClcbiAgICB9KTtcblxuICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XG5cbiAgICB0aGlzLl9vdmVybGF5UmVmLmRldGFjaG1lbnRzKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9kZXRhY2goKSk7XG5cbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVJlZjtcbiAgfVxuXG4gIC8qKiBEZXRhY2hlcyB0aGUgY3VycmVudGx5LWF0dGFjaGVkIHRvb2x0aXAuICovXG4gIHByaXZhdGUgX2RldGFjaCgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZiAmJiB0aGlzLl9vdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNoKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgY3VycmVudCB0b29sdGlwLiAqL1xuICBwcml2YXRlIF91cGRhdGVQb3NpdGlvbigpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9XG4gICAgICAgIHRoaXMuX292ZXJsYXlSZWYhLmdldENvbmZpZygpLnBvc2l0aW9uU3RyYXRlZ3kgYXMgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5O1xuICAgIGNvbnN0IG9yaWdpbiA9IHRoaXMuX2dldE9yaWdpbigpO1xuICAgIGNvbnN0IG92ZXJsYXkgPSB0aGlzLl9nZXRPdmVybGF5UG9zaXRpb24oKTtcblxuICAgIHBvc2l0aW9uLndpdGhQb3NpdGlvbnMoW1xuICAgICAgey4uLm9yaWdpbi5tYWluLCAuLi5vdmVybGF5Lm1haW59LFxuICAgICAgey4uLm9yaWdpbi5mYWxsYmFjaywgLi4ub3ZlcmxheS5mYWxsYmFja31cbiAgICBdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBvcmlnaW4gcG9zaXRpb24gYW5kIGEgZmFsbGJhY2sgcG9zaXRpb24gYmFzZWQgb24gdGhlIHVzZXIncyBwb3NpdGlvbiBwcmVmZXJlbmNlLlxuICAgKiBUaGUgZmFsbGJhY2sgcG9zaXRpb24gaXMgdGhlIGludmVyc2Ugb2YgdGhlIG9yaWdpbiAoZS5nLiBgJ2JlbG93JyAtPiAnYWJvdmUnYCkuXG4gICAqL1xuICBfZ2V0T3JpZ2luKCk6IHttYWluOiBPcmlnaW5Db25uZWN0aW9uUG9zaXRpb24sIGZhbGxiYWNrOiBPcmlnaW5Db25uZWN0aW9uUG9zaXRpb259IHtcbiAgICBjb25zdCBpc0x0ciA9ICF0aGlzLl9kaXIgfHwgdGhpcy5fZGlyLnZhbHVlID09ICdsdHInO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcbiAgICBsZXQgb3JpZ2luUG9zaXRpb246IE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbjtcblxuICAgIGlmIChwb3NpdGlvbiA9PSAnYWJvdmUnIHx8IHBvc2l0aW9uID09ICdiZWxvdycpIHtcbiAgICAgIG9yaWdpblBvc2l0aW9uID0ge29yaWdpblg6ICdjZW50ZXInLCBvcmlnaW5ZOiBwb3NpdGlvbiA9PSAnYWJvdmUnID8gJ3RvcCcgOiAnYm90dG9tJ307XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBvc2l0aW9uID09ICdiZWZvcmUnIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ2xlZnQnICYmIGlzTHRyKSB8fFxuICAgICAgKHBvc2l0aW9uID09ICdyaWdodCcgJiYgIWlzTHRyKSkge1xuICAgICAgb3JpZ2luUG9zaXRpb24gPSB7b3JpZ2luWDogJ3N0YXJ0Jywgb3JpZ2luWTogJ2NlbnRlcid9O1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBwb3NpdGlvbiA9PSAnYWZ0ZXInIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ3JpZ2h0JyAmJiBpc0x0cikgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAnbGVmdCcgJiYgIWlzTHRyKSkge1xuICAgICAgb3JpZ2luUG9zaXRpb24gPSB7b3JpZ2luWDogJ2VuZCcsIG9yaWdpblk6ICdjZW50ZXInfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZ2V0TWF0VG9vbHRpcEludmFsaWRQb3NpdGlvbkVycm9yKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCB7eCwgeX0gPSB0aGlzLl9pbnZlcnRQb3NpdGlvbihvcmlnaW5Qb3NpdGlvbi5vcmlnaW5YLCBvcmlnaW5Qb3NpdGlvbi5vcmlnaW5ZKTtcblxuICAgIHJldHVybiB7XG4gICAgICBtYWluOiBvcmlnaW5Qb3NpdGlvbixcbiAgICAgIGZhbGxiYWNrOiB7b3JpZ2luWDogeCwgb3JpZ2luWTogeX1cbiAgICB9O1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIG92ZXJsYXkgcG9zaXRpb24gYW5kIGEgZmFsbGJhY2sgcG9zaXRpb24gYmFzZWQgb24gdGhlIHVzZXIncyBwcmVmZXJlbmNlICovXG4gIF9nZXRPdmVybGF5UG9zaXRpb24oKToge21haW46IE92ZXJsYXlDb25uZWN0aW9uUG9zaXRpb24sIGZhbGxiYWNrOiBPdmVybGF5Q29ubmVjdGlvblBvc2l0aW9ufSB7XG4gICAgY29uc3QgaXNMdHIgPSAhdGhpcy5fZGlyIHx8IHRoaXMuX2Rpci52YWx1ZSA9PSAnbHRyJztcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb247XG4gICAgbGV0IG92ZXJsYXlQb3NpdGlvbjogT3ZlcmxheUNvbm5lY3Rpb25Qb3NpdGlvbjtcblxuICAgIGlmIChwb3NpdGlvbiA9PSAnYWJvdmUnKSB7XG4gICAgICBvdmVybGF5UG9zaXRpb24gPSB7b3ZlcmxheVg6ICdjZW50ZXInLCBvdmVybGF5WTogJ2JvdHRvbSd9O1xuICAgIH0gZWxzZSBpZiAocG9zaXRpb24gPT0gJ2JlbG93Jykge1xuICAgICAgb3ZlcmxheVBvc2l0aW9uID0ge292ZXJsYXlYOiAnY2VudGVyJywgb3ZlcmxheVk6ICd0b3AnfTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgcG9zaXRpb24gPT0gJ2JlZm9yZScgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAnbGVmdCcgJiYgaXNMdHIpIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ3JpZ2h0JyAmJiAhaXNMdHIpKSB7XG4gICAgICBvdmVybGF5UG9zaXRpb24gPSB7b3ZlcmxheVg6ICdlbmQnLCBvdmVybGF5WTogJ2NlbnRlcid9O1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBwb3NpdGlvbiA9PSAnYWZ0ZXInIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ3JpZ2h0JyAmJiBpc0x0cikgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAnbGVmdCcgJiYgIWlzTHRyKSkge1xuICAgICAgb3ZlcmxheVBvc2l0aW9uID0ge292ZXJsYXlYOiAnc3RhcnQnLCBvdmVybGF5WTogJ2NlbnRlcid9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBnZXRNYXRUb29sdGlwSW52YWxpZFBvc2l0aW9uRXJyb3IocG9zaXRpb24pO1xuICAgIH1cblxuICAgIGNvbnN0IHt4LCB5fSA9IHRoaXMuX2ludmVydFBvc2l0aW9uKG92ZXJsYXlQb3NpdGlvbi5vdmVybGF5WCwgb3ZlcmxheVBvc2l0aW9uLm92ZXJsYXlZKTtcblxuICAgIHJldHVybiB7XG4gICAgICBtYWluOiBvdmVybGF5UG9zaXRpb24sXG4gICAgICBmYWxsYmFjazoge292ZXJsYXlYOiB4LCBvdmVybGF5WTogeX1cbiAgICB9O1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHRvb2x0aXAgbWVzc2FnZSBhbmQgcmVwb3NpdGlvbnMgdGhlIG92ZXJsYXkgYWNjb3JkaW5nIHRvIHRoZSBuZXcgbWVzc2FnZSBsZW5ndGggKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVG9vbHRpcE1lc3NhZ2UoKSB7XG4gICAgLy8gTXVzdCB3YWl0IGZvciB0aGUgbWVzc2FnZSB0byBiZSBwYWludGVkIHRvIHRoZSB0b29sdGlwIHNvIHRoYXQgdGhlIG92ZXJsYXkgY2FuIHByb3Blcmx5XG4gICAgLy8gY2FsY3VsYXRlIHRoZSBjb3JyZWN0IHBvc2l0aW9uaW5nIGJhc2VkIG9uIHRoZSBzaXplIG9mIHRoZSB0ZXh0LlxuICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5tZXNzYWdlID0gdGhpcy5tZXNzYWdlO1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLl9tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgdGhpcy5fbmdab25lLm9uTWljcm90YXNrRW1wdHkuYXNPYnNlcnZhYmxlKCkucGlwZShcbiAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZClcbiAgICAgICkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgICAgIHRoaXMuX292ZXJsYXlSZWYhLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSB0b29sdGlwIGNsYXNzICovXG4gIHByaXZhdGUgX3NldFRvb2x0aXBDbGFzcyh0b29sdGlwQ2xhc3M6IHN0cmluZ3xzdHJpbmdbXXxTZXQ8c3RyaW5nPnx7W2tleTogc3RyaW5nXTogYW55fSkge1xuICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS50b29sdGlwQ2xhc3MgPSB0b29sdGlwQ2xhc3M7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UuX21hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJbnZlcnRzIGFuIG92ZXJsYXkgcG9zaXRpb24uICovXG4gIHByaXZhdGUgX2ludmVydFBvc2l0aW9uKHg6IEhvcml6b250YWxDb25uZWN0aW9uUG9zLCB5OiBWZXJ0aWNhbENvbm5lY3Rpb25Qb3MpIHtcbiAgICBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ2Fib3ZlJyB8fCB0aGlzLnBvc2l0aW9uID09PSAnYmVsb3cnKSB7XG4gICAgICBpZiAoeSA9PT0gJ3RvcCcpIHtcbiAgICAgICAgeSA9ICdib3R0b20nO1xuICAgICAgfSBlbHNlIGlmICh5ID09PSAnYm90dG9tJykge1xuICAgICAgICB5ID0gJ3RvcCc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh4ID09PSAnZW5kJykge1xuICAgICAgICB4ID0gJ3N0YXJ0JztcbiAgICAgIH0gZWxzZSBpZiAoeCA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICB4ID0gJ2VuZCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHt4LCB5fTtcbiAgfVxuXG4gIC8qKiBCaW5kcyB0aGUgcG9pbnRlciBldmVudHMgdG8gdGhlIHRvb2x0aXAgdHJpZ2dlci4gKi9cbiAgcHJpdmF0ZSBfc2V0dXBQb2ludGVyRXZlbnRzKCkge1xuICAgIC8vIFRoZSBtb3VzZSBldmVudHMgc2hvdWxkbid0IGJlIGJvdW5kIG9uIG1vYmlsZSBkZXZpY2VzLCBiZWNhdXNlIHRoZXkgY2FuIHByZXZlbnQgdGhlXG4gICAgLy8gZmlyc3QgdGFwIGZyb20gZmlyaW5nIGl0cyBjbGljayBldmVudCBvciBjYW4gY2F1c2UgdGhlIHRvb2x0aXAgdG8gb3BlbiBmb3IgY2xpY2tzLlxuICAgIGlmICghdGhpcy5fcGxhdGZvcm0uSU9TICYmICF0aGlzLl9wbGF0Zm9ybS5BTkRST0lEKSB7XG4gICAgICB0aGlzLl9wYXNzaXZlTGlzdGVuZXJzXG4gICAgICAgIC5zZXQoJ21vdXNlZW50ZXInLCAoKSA9PiB0aGlzLnNob3coKSlcbiAgICAgICAgLnNldCgnbW91c2VsZWF2ZScsICgpID0+IHRoaXMuaGlkZSgpKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudG91Y2hHZXN0dXJlcyAhPT0gJ29mZicpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVOYXRpdmVHZXN0dXJlc0lmTmVjZXNzYXJ5KCk7XG4gICAgICBjb25zdCB0b3VjaGVuZExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdG91Y2hzdGFydFRpbWVvdXQpO1xuICAgICAgICB0aGlzLmhpZGUodGhpcy5fZGVmYXVsdE9wdGlvbnMudG91Y2hlbmRIaWRlRGVsYXkpO1xuICAgICAgfTtcblxuICAgICAgdGhpcy5fcGFzc2l2ZUxpc3RlbmVyc1xuICAgICAgICAuc2V0KCd0b3VjaGVuZCcsIHRvdWNoZW5kTGlzdGVuZXIpXG4gICAgICAgIC5zZXQoJ3RvdWNoY2FuY2VsJywgdG91Y2hlbmRMaXN0ZW5lcilcbiAgICAgICAgLnNldCgndG91Y2hzdGFydCcsICgpID0+IHtcbiAgICAgICAgICAvLyBOb3RlIHRoYXQgaXQncyBpbXBvcnRhbnQgdGhhdCB3ZSBkb24ndCBgcHJldmVudERlZmF1bHRgIGhlcmUsXG4gICAgICAgICAgLy8gYmVjYXVzZSBpdCBjYW4gcHJldmVudCBjbGljayBldmVudHMgZnJvbSBmaXJpbmcgb24gdGhlIGVsZW1lbnQuXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RvdWNoc3RhcnRUaW1lb3V0KTtcbiAgICAgICAgICB0aGlzLl90b3VjaHN0YXJ0VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zaG93KCksIExPTkdQUkVTU19ERUxBWSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIsIGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIHBhc3NpdmVMaXN0ZW5lck9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIERpc2FibGVzIHRoZSBuYXRpdmUgYnJvd3NlciBnZXN0dXJlcywgYmFzZWQgb24gaG93IHRoZSB0b29sdGlwIGhhcyBiZWVuIGNvbmZpZ3VyZWQuICovXG4gIHByaXZhdGUgX2Rpc2FibGVOYXRpdmVHZXN0dXJlc0lmTmVjZXNzYXJ5KCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3Qgc3R5bGUgPSBlbGVtZW50LnN0eWxlO1xuICAgIGNvbnN0IGdlc3R1cmVzID0gdGhpcy50b3VjaEdlc3R1cmVzO1xuXG4gICAgaWYgKGdlc3R1cmVzICE9PSAnb2ZmJykge1xuICAgICAgLy8gSWYgZ2VzdHVyZXMgYXJlIHNldCB0byBgYXV0b2AsIHdlIGRvbid0IGRpc2FibGUgdGV4dCBzZWxlY3Rpb24gb24gaW5wdXRzIGFuZFxuICAgICAgLy8gdGV4dGFyZWFzLCBiZWNhdXNlIGl0IHByZXZlbnRzIHRoZSB1c2VyIGZyb20gdHlwaW5nIGludG8gdGhlbSBvbiBpT1MgU2FmYXJpLlxuICAgICAgaWYgKGdlc3R1cmVzID09PSAnb24nIHx8IChlbGVtZW50Lm5vZGVOYW1lICE9PSAnSU5QVVQnICYmIGVsZW1lbnQubm9kZU5hbWUgIT09ICdURVhUQVJFQScpKSB7XG4gICAgICAgIHN0eWxlLnVzZXJTZWxlY3QgPSAoc3R5bGUgYXMgYW55KS5tc1VzZXJTZWxlY3QgPSBzdHlsZS53ZWJraXRVc2VyU2VsZWN0ID1cbiAgICAgICAgICAgIChzdHlsZSBhcyBhbnkpLk1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHdlIGhhdmUgYGF1dG9gIGdlc3R1cmVzIGFuZCB0aGUgZWxlbWVudCB1c2VzIG5hdGl2ZSBIVE1MIGRyYWdnaW5nLFxuICAgICAgLy8gd2UgZG9uJ3Qgc2V0IGAtd2Via2l0LXVzZXItZHJhZ2AgYmVjYXVzZSBpdCBwcmV2ZW50cyB0aGUgbmF0aXZlIGJlaGF2aW9yLlxuICAgICAgaWYgKGdlc3R1cmVzID09PSAnb24nIHx8ICFlbGVtZW50LmRyYWdnYWJsZSkge1xuICAgICAgICAoc3R5bGUgYXMgYW55KS53ZWJraXRVc2VyRHJhZyA9ICdub25lJztcbiAgICAgIH1cblxuICAgICAgc3R5bGUudG91Y2hBY3Rpb24gPSAnbm9uZSc7XG4gICAgICBzdHlsZS53ZWJraXRUYXBIaWdobGlnaHRDb2xvciA9ICd0cmFuc3BhcmVudCc7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oaWRlRGVsYXk6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2hvd0RlbGF5OiBOdW1iZXJJbnB1dDtcbn1cblxuLyoqXG4gKiBJbnRlcm5hbCBjb21wb25lbnQgdGhhdCB3cmFwcyB0aGUgdG9vbHRpcCdzIGNvbnRlbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10b29sdGlwLWNvbXBvbmVudCcsXG4gIHRlbXBsYXRlVXJsOiAndG9vbHRpcC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3Rvb2x0aXAuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBhbmltYXRpb25zOiBbbWF0VG9vbHRpcEFuaW1hdGlvbnMudG9vbHRpcFN0YXRlXSxcbiAgaG9zdDoge1xuICAgIC8vIEZvcmNlcyB0aGUgZWxlbWVudCB0byBoYXZlIGEgbGF5b3V0IGluIElFIGFuZCBFZGdlLiBUaGlzIGZpeGVzIGlzc3VlcyB3aGVyZSB0aGUgZWxlbWVudFxuICAgIC8vIHdvbid0IGJlIHJlbmRlcmVkIGlmIHRoZSBhbmltYXRpb25zIGFyZSBkaXNhYmxlZCBvciB0aGVyZSBpcyBubyB3ZWIgYW5pbWF0aW9ucyBwb2x5ZmlsbC5cbiAgICAnW3N0eWxlLnpvb21dJzogJ192aXNpYmlsaXR5ID09PSBcInZpc2libGVcIiA/IDEgOiBudWxsJyxcbiAgICAnKGJvZHk6Y2xpY2spJzogJ3RoaXMuX2hhbmRsZUJvZHlJbnRlcmFjdGlvbigpJyxcbiAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgVG9vbHRpcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKiBNZXNzYWdlIHRvIGRpc3BsYXkgaW4gdGhlIHRvb2x0aXAgKi9cbiAgbWVzc2FnZTogc3RyaW5nO1xuXG4gIC8qKiBDbGFzc2VzIHRvIGJlIGFkZGVkIHRvIHRoZSB0b29sdGlwLiBTdXBwb3J0cyB0aGUgc2FtZSBzeW50YXggYXMgYG5nQ2xhc3NgLiAqL1xuICB0b29sdGlwQ2xhc3M6IHN0cmluZ3xzdHJpbmdbXXxTZXQ8c3RyaW5nPnx7W2tleTogc3RyaW5nXTogYW55fTtcblxuICAvKiogVGhlIHRpbWVvdXQgSUQgb2YgYW55IGN1cnJlbnQgdGltZXIgc2V0IHRvIHNob3cgdGhlIHRvb2x0aXAgKi9cbiAgX3Nob3dUaW1lb3V0SWQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFRoZSB0aW1lb3V0IElEIG9mIGFueSBjdXJyZW50IHRpbWVyIHNldCB0byBoaWRlIHRoZSB0b29sdGlwICovXG4gIF9oaWRlVGltZW91dElkOiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBQcm9wZXJ0eSB3YXRjaGVkIGJ5IHRoZSBhbmltYXRpb24gZnJhbWV3b3JrIHRvIHNob3cgb3IgaGlkZSB0aGUgdG9vbHRpcCAqL1xuICBfdmlzaWJpbGl0eTogVG9vbHRpcFZpc2liaWxpdHkgPSAnaW5pdGlhbCc7XG5cbiAgLyoqIFdoZXRoZXIgaW50ZXJhY3Rpb25zIG9uIHRoZSBwYWdlIHNob3VsZCBjbG9zZSB0aGUgdG9vbHRpcCAqL1xuICBwcml2YXRlIF9jbG9zZU9uSW50ZXJhY3Rpb246IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoYXQgdGhlIHRvb2x0aXAgaGFzIGJlZW4gaGlkZGVuIGZyb20gdGhlIHZpZXcgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfb25IaWRlOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGV0aGVyIHRoZSB1c2VyIGhhcyBhIGhhbmRzZXQtc2l6ZWQgZGlzcGxheS4gICovXG4gIF9pc0hhbmRzZXQ6IE9ic2VydmFibGU8QnJlYWtwb2ludFN0YXRlPiA9IHRoaXMuX2JyZWFrcG9pbnRPYnNlcnZlci5vYnNlcnZlKEJyZWFrcG9pbnRzLkhhbmRzZXQpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9icmVha3BvaW50T2JzZXJ2ZXI6IEJyZWFrcG9pbnRPYnNlcnZlcikge31cblxuICAvKipcbiAgICogU2hvd3MgdGhlIHRvb2x0aXAgd2l0aCBhbiBhbmltYXRpb24gb3JpZ2luYXRpbmcgZnJvbSB0aGUgcHJvdmlkZWQgb3JpZ2luXG4gICAqIEBwYXJhbSBkZWxheSBBbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIHRoZSBkZWxheSBzaG93aW5nIHRoZSB0b29sdGlwLlxuICAgKi9cbiAgc2hvdyhkZWxheTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gQ2FuY2VsIHRoZSBkZWxheWVkIGhpZGUgaWYgaXQgaXMgc2NoZWR1bGVkXG4gICAgaWYgKHRoaXMuX2hpZGVUaW1lb3V0SWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9oaWRlVGltZW91dElkKTtcbiAgICAgIHRoaXMuX2hpZGVUaW1lb3V0SWQgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIEJvZHkgaW50ZXJhY3Rpb25zIHNob3VsZCBjYW5jZWwgdGhlIHRvb2x0aXAgaWYgdGhlcmUgaXMgYSBkZWxheSBpbiBzaG93aW5nLlxuICAgIHRoaXMuX2Nsb3NlT25JbnRlcmFjdGlvbiA9IHRydWU7XG4gICAgdGhpcy5fc2hvd1RpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fdmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgIHRoaXMuX3Nob3dUaW1lb3V0SWQgPSBudWxsO1xuXG4gICAgICAvLyBNYXJrIGZvciBjaGVjayBzbyBpZiBhbnkgcGFyZW50IGNvbXBvbmVudCBoYXMgc2V0IHRoZVxuICAgICAgLy8gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgdG8gT25QdXNoIGl0IHdpbGwgYmUgY2hlY2tlZCBhbnl3YXlzXG4gICAgICB0aGlzLl9tYXJrRm9yQ2hlY2soKTtcbiAgICB9LCBkZWxheSk7XG4gIH1cblxuICAvKipcbiAgICogQmVnaW5zIHRoZSBhbmltYXRpb24gdG8gaGlkZSB0aGUgdG9vbHRpcCBhZnRlciB0aGUgcHJvdmlkZWQgZGVsYXkgaW4gbXMuXG4gICAqIEBwYXJhbSBkZWxheSBBbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5IHNob3dpbmcgdGhlIHRvb2x0aXAuXG4gICAqL1xuICBoaWRlKGRlbGF5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBDYW5jZWwgdGhlIGRlbGF5ZWQgc2hvdyBpZiBpdCBpcyBzY2hlZHVsZWRcbiAgICBpZiAodGhpcy5fc2hvd1RpbWVvdXRJZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3Nob3dUaW1lb3V0SWQpO1xuICAgICAgdGhpcy5fc2hvd1RpbWVvdXRJZCA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5faGlkZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fdmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgdGhpcy5faGlkZVRpbWVvdXRJZCA9IG51bGw7XG5cbiAgICAgIC8vIE1hcmsgZm9yIGNoZWNrIHNvIGlmIGFueSBwYXJlbnQgY29tcG9uZW50IGhhcyBzZXQgdGhlXG4gICAgICAvLyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB0byBPblB1c2ggaXQgd2lsbCBiZSBjaGVja2VkIGFueXdheXNcbiAgICAgIHRoaXMuX21hcmtGb3JDaGVjaygpO1xuICAgIH0sIGRlbGF5KTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIGFuIG9ic2VydmFibGUgdGhhdCBub3RpZmllcyB3aGVuIHRoZSB0b29sdGlwIGhhcyBiZWVuIGhpZGRlbiBmcm9tIHZpZXcuICovXG4gIGFmdGVySGlkZGVuKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9vbkhpZGUuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdG9vbHRpcCBpcyBiZWluZyBkaXNwbGF5ZWQuICovXG4gIGlzVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJpbGl0eSA9PT0gJ3Zpc2libGUnO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fb25IaWRlLmNvbXBsZXRlKCk7XG4gIH1cblxuICBfYW5pbWF0aW9uU3RhcnQoKSB7XG4gICAgdGhpcy5fY2xvc2VPbkludGVyYWN0aW9uID0gZmFsc2U7XG4gIH1cblxuICBfYW5pbWF0aW9uRG9uZShldmVudDogQW5pbWF0aW9uRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCB0b1N0YXRlID0gZXZlbnQudG9TdGF0ZSBhcyBUb29sdGlwVmlzaWJpbGl0eTtcblxuICAgIGlmICh0b1N0YXRlID09PSAnaGlkZGVuJyAmJiAhdGhpcy5pc1Zpc2libGUoKSkge1xuICAgICAgdGhpcy5fb25IaWRlLm5leHQoKTtcbiAgICB9XG5cbiAgICBpZiAodG9TdGF0ZSA9PT0gJ3Zpc2libGUnIHx8IHRvU3RhdGUgPT09ICdoaWRkZW4nKSB7XG4gICAgICB0aGlzLl9jbG9zZU9uSW50ZXJhY3Rpb24gPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmFjdGlvbnMgb24gdGhlIEhUTUwgYm9keSBzaG91bGQgY2xvc2UgdGhlIHRvb2x0aXAgaW1tZWRpYXRlbHkgYXMgZGVmaW5lZCBpbiB0aGVcbiAgICogbWF0ZXJpYWwgZGVzaWduIHNwZWMuXG4gICAqIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbXBvbmVudHMvdG9vbHRpcHMuaHRtbCNiZWhhdmlvclxuICAgKi9cbiAgX2hhbmRsZUJvZHlJbnRlcmFjdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fY2xvc2VPbkludGVyYWN0aW9uKSB7XG4gICAgICB0aGlzLmhpZGUoMCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoYXQgdGhlIHRvb2x0aXAgbmVlZHMgdG8gYmUgY2hlY2tlZCBpbiB0aGUgbmV4dCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bi5cbiAgICogTWFpbmx5IHVzZWQgZm9yIHJlbmRlcmluZyB0aGUgaW5pdGlhbCB0ZXh0IGJlZm9yZSBwb3NpdGlvbmluZyBhIHRvb2x0aXAsIHdoaWNoXG4gICAqIGNhbiBiZSBwcm9ibGVtYXRpYyBpbiBjb21wb25lbnRzIHdpdGggT25QdXNoIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAqL1xuICBfbWFya0ZvckNoZWNrKCk6IHZvaWQge1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG59XG4iXX0=