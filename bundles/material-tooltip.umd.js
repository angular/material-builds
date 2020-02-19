(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/overlay'), require('@angular/cdk/a11y'), require('@angular/common'), require('@angular/core'), require('@angular/material/core'), require('tslib'), require('@angular/cdk/bidi'), require('@angular/cdk/coercion'), require('@angular/cdk/keycodes'), require('@angular/cdk/layout'), require('@angular/cdk/platform'), require('@angular/cdk/portal'), require('@angular/cdk/scrolling'), require('rxjs'), require('rxjs/operators'), require('@angular/animations')) :
    typeof define === 'function' && define.amd ? define('@angular/material/tooltip', ['exports', '@angular/cdk/overlay', '@angular/cdk/a11y', '@angular/common', '@angular/core', '@angular/material/core', 'tslib', '@angular/cdk/bidi', '@angular/cdk/coercion', '@angular/cdk/keycodes', '@angular/cdk/layout', '@angular/cdk/platform', '@angular/cdk/portal', '@angular/cdk/scrolling', 'rxjs', 'rxjs/operators', '@angular/animations'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.tooltip = {}), global.ng.cdk.overlay, global.ng.cdk.a11y, global.ng.common, global.ng.core, global.ng.material.core, global.tslib, global.ng.cdk.bidi, global.ng.cdk.coercion, global.ng.cdk.keycodes, global.ng.cdk.layout, global.ng.cdk.platform, global.ng.cdk.portal, global.ng.cdk.scrolling, global.rxjs, global.rxjs.operators, global.ng.animations));
}(this, (function (exports, overlay, a11y, common, core, core$1, tslib, bidi, coercion, keycodes, layout, platform, portal, scrolling, rxjs, operators, animations) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Animations used by MatTooltip.
     * @docs-private
     */
    var matTooltipAnimations = {
        /** Animation that transitions a tooltip in and out. */
        tooltipState: animations.trigger('state', [
            animations.state('initial, void, hidden', animations.style({ opacity: 0, transform: 'scale(0)' })),
            animations.state('visible', animations.style({ transform: 'scale(1)' })),
            animations.transition('* => visible', animations.animate('200ms cubic-bezier(0, 0, 0.2, 1)', animations.keyframes([
                animations.style({ opacity: 0, transform: 'scale(0)', offset: 0 }),
                animations.style({ opacity: 0.5, transform: 'scale(0.99)', offset: 0.5 }),
                animations.style({ opacity: 1, transform: 'scale(1)', offset: 1 })
            ]))),
            animations.transition('* => hidden', animations.animate('100ms cubic-bezier(0, 0, 0.2, 1)', animations.style({ opacity: 0 }))),
        ])
    };

    /** Time in ms to throttle repositioning after scroll events. */
    var SCROLL_THROTTLE_MS = 20;
    /** CSS class that will be attached to the overlay panel. */
    var TOOLTIP_PANEL_CLASS = 'mat-tooltip-panel';
    /** Options used to bind passive event listeners. */
    var passiveListenerOptions = platform.normalizePassiveListenerOptions({ passive: true });
    /**
     * Time between the user putting the pointer on a tooltip
     * trigger and the long press event being fired.
     */
    var LONGPRESS_DELAY = 500;
    /**
     * Creates an error to be thrown if the user supplied an invalid tooltip position.
     * @docs-private
     */
    function getMatTooltipInvalidPositionError(position) {
        return Error("Tooltip position \"" + position + "\" is invalid.");
    }
    /** Injection token that determines the scroll handling while a tooltip is visible. */
    var MAT_TOOLTIP_SCROLL_STRATEGY = new core.InjectionToken('mat-tooltip-scroll-strategy');
    /** @docs-private */
    function MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY(overlay) {
        return function () { return overlay.scrollStrategies.reposition({ scrollThrottle: SCROLL_THROTTLE_MS }); };
    }
    /** @docs-private */
    var MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER = {
        provide: MAT_TOOLTIP_SCROLL_STRATEGY,
        deps: [overlay.Overlay],
        useFactory: MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY,
    };
    /** Injection token to be used to override the default options for `matTooltip`. */
    var MAT_TOOLTIP_DEFAULT_OPTIONS = new core.InjectionToken('mat-tooltip-default-options', {
        providedIn: 'root',
        factory: MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY
    });
    /** @docs-private */
    function MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY() {
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
            this._destroyed = new rxjs.Subject();
            /**
             * Handles the keydown events on the host element.
             * Needs to be an arrow function so that we can use it in addEventListener.
             */
            this._handleKeydown = function (event) {
                if (_this._isTooltipVisible() && event.keyCode === keycodes.ESCAPE && !keycodes.hasModifierKey(event)) {
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
                .pipe(operators.takeUntil(this._destroyed))
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
                this._disabled = coercion.coerceBooleanProperty(value);
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
            this._portal = this._portal || new portal.ComponentPortal(TooltipComponent, this._viewContainerRef);
            this._tooltipInstance = overlayRef.attach(this._portal).instance;
            this._tooltipInstance.afterHidden()
                .pipe(operators.takeUntil(this._destroyed))
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
            strategy.positionChanges.pipe(operators.takeUntil(this._destroyed)).subscribe(function (change) {
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
                .pipe(operators.takeUntil(this._destroyed))
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
                tslib.__assign(tslib.__assign({}, origin.main), overlay.main),
                tslib.__assign(tslib.__assign({}, origin.fallback), overlay.fallback)
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
                this._ngZone.onMicrotaskEmpty.asObservable().pipe(operators.take(1), operators.takeUntil(this._destroyed)).subscribe(function () {
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
            { type: core.Directive, args: [{
                        selector: '[matTooltip]',
                        exportAs: 'matTooltip',
                    },] }
        ];
        /** @nocollapse */
        MatTooltip.ctorParameters = function () { return [
            { type: overlay.Overlay },
            { type: core.ElementRef },
            { type: scrolling.ScrollDispatcher },
            { type: core.ViewContainerRef },
            { type: core.NgZone },
            { type: platform.Platform },
            { type: a11y.AriaDescriber },
            { type: a11y.FocusMonitor },
            { type: undefined, decorators: [{ type: core.Inject, args: [MAT_TOOLTIP_SCROLL_STRATEGY,] }] },
            { type: bidi.Directionality, decorators: [{ type: core.Optional }] },
            { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [MAT_TOOLTIP_DEFAULT_OPTIONS,] }] },
            { type: undefined, decorators: [{ type: core.Inject, args: [core.ElementRef,] }] }
        ]; };
        MatTooltip.propDecorators = {
            position: [{ type: core.Input, args: ['matTooltipPosition',] }],
            disabled: [{ type: core.Input, args: ['matTooltipDisabled',] }],
            showDelay: [{ type: core.Input, args: ['matTooltipShowDelay',] }],
            hideDelay: [{ type: core.Input, args: ['matTooltipHideDelay',] }],
            touchGestures: [{ type: core.Input, args: ['matTooltipTouchGestures',] }],
            message: [{ type: core.Input, args: ['matTooltip',] }],
            tooltipClass: [{ type: core.Input, args: ['matTooltipClass',] }]
        };
        return MatTooltip;
    }());
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
            this._onHide = new rxjs.Subject();
            /** Stream that emits whether the user has a handset-sized display.  */
            this._isHandset = this._breakpointObserver.observe(layout.Breakpoints.Handset);
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
            { type: core.Component, args: [{
                        selector: 'mat-tooltip-component',
                        template: "<div class=\"mat-tooltip\"\n     [ngClass]=\"tooltipClass\"\n     [class.mat-tooltip-handset]=\"(_isHandset | async)?.matches\"\n     [@state]=\"_visibility\"\n     (@state.start)=\"_animationStart()\"\n     (@state.done)=\"_animationDone($event)\">{{message}}</div>\n",
                        encapsulation: core.ViewEncapsulation.None,
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
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
            { type: core.ChangeDetectorRef },
            { type: layout.BreakpointObserver }
        ]; };
        return TooltipComponent;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MatTooltipModule = /** @class */ (function () {
        function MatTooltipModule() {
        }
        MatTooltipModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            a11y.A11yModule,
                            common.CommonModule,
                            overlay.OverlayModule,
                            core$1.MatCommonModule,
                        ],
                        exports: [MatTooltip, TooltipComponent, core$1.MatCommonModule],
                        declarations: [MatTooltip, TooltipComponent],
                        entryComponents: [TooltipComponent],
                        providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER]
                    },] }
        ];
        return MatTooltipModule;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MAT_TOOLTIP_DEFAULT_OPTIONS = MAT_TOOLTIP_DEFAULT_OPTIONS;
    exports.MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY = MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY;
    exports.MAT_TOOLTIP_SCROLL_STRATEGY = MAT_TOOLTIP_SCROLL_STRATEGY;
    exports.MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY = MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY;
    exports.MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER = MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER;
    exports.MatTooltip = MatTooltip;
    exports.MatTooltipModule = MatTooltipModule;
    exports.SCROLL_THROTTLE_MS = SCROLL_THROTTLE_MS;
    exports.TOOLTIP_PANEL_CLASS = TOOLTIP_PANEL_CLASS;
    exports.TooltipComponent = TooltipComponent;
    exports.getMatTooltipInvalidPositionError = getMatTooltipInvalidPositionError;
    exports.matTooltipAnimations = matTooltipAnimations;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-tooltip.umd.js.map
