(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/overlay'), require('@angular/cdk/portal'), require('@angular/common'), require('@angular/core'), require('@angular/material/core'), require('@angular/material/button'), require('rxjs'), require('tslib'), require('rxjs/operators'), require('@angular/animations'), require('@angular/cdk/a11y'), require('@angular/cdk/layout')) :
    typeof define === 'function' && define.amd ? define('@angular/material/snack-bar', ['exports', '@angular/cdk/overlay', '@angular/cdk/portal', '@angular/common', '@angular/core', '@angular/material/core', '@angular/material/button', 'rxjs', 'tslib', 'rxjs/operators', '@angular/animations', '@angular/cdk/a11y', '@angular/cdk/layout'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.snackBar = {}), global.ng.cdk.overlay, global.ng.cdk.portal, global.ng.common, global.ng.core, global.ng.material.core, global.ng.material.button, global.rxjs, global.tslib, global.rxjs.operators, global.ng.animations, global.ng.cdk.a11y, global.ng.cdk.layout));
}(this, (function (exports, i1, portal, common, i0, core, button, rxjs, tslib, operators, animations, i2, i3) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Maximum amount of milliseconds that can be passed into setTimeout. */
    var MAX_TIMEOUT = Math.pow(2, 31) - 1;
    /**
     * Reference to a snack bar dispatched from the snack bar service.
     */
    var MatSnackBarRef = /** @class */ (function () {
        function MatSnackBarRef(containerInstance, _overlayRef) {
            var _this = this;
            this._overlayRef = _overlayRef;
            /** Subject for notifying the user that the snack bar has been dismissed. */
            this._afterDismissed = new rxjs.Subject();
            /** Subject for notifying the user that the snack bar has opened and appeared. */
            this._afterOpened = new rxjs.Subject();
            /** Subject for notifying the user that the snack bar action was called. */
            this._onAction = new rxjs.Subject();
            /** Whether the snack bar was dismissed using the action button. */
            this._dismissedByAction = false;
            this.containerInstance = containerInstance;
            // Dismiss snackbar on action.
            this.onAction().subscribe(function () { return _this.dismiss(); });
            containerInstance._onExit.subscribe(function () { return _this._finishDismiss(); });
        }
        /** Dismisses the snack bar. */
        MatSnackBarRef.prototype.dismiss = function () {
            if (!this._afterDismissed.closed) {
                this.containerInstance.exit();
            }
            clearTimeout(this._durationTimeoutId);
        };
        /** Marks the snackbar action clicked. */
        MatSnackBarRef.prototype.dismissWithAction = function () {
            if (!this._onAction.closed) {
                this._dismissedByAction = true;
                this._onAction.next();
                this._onAction.complete();
            }
        };
        /**
         * Marks the snackbar action clicked.
         * @deprecated Use `dismissWithAction` instead.
         * @breaking-change 8.0.0
         */
        MatSnackBarRef.prototype.closeWithAction = function () {
            this.dismissWithAction();
        };
        /** Dismisses the snack bar after some duration */
        MatSnackBarRef.prototype._dismissAfter = function (duration) {
            var _this = this;
            // Note that we need to cap the duration to the maximum value for setTimeout, because
            // it'll revert to 1 if somebody passes in something greater (e.g. `Infinity`). See #17234.
            this._durationTimeoutId = setTimeout(function () { return _this.dismiss(); }, Math.min(duration, MAX_TIMEOUT));
        };
        /** Marks the snackbar as opened */
        MatSnackBarRef.prototype._open = function () {
            if (!this._afterOpened.closed) {
                this._afterOpened.next();
                this._afterOpened.complete();
            }
        };
        /** Cleans up the DOM after closing. */
        MatSnackBarRef.prototype._finishDismiss = function () {
            this._overlayRef.dispose();
            if (!this._onAction.closed) {
                this._onAction.complete();
            }
            this._afterDismissed.next({ dismissedByAction: this._dismissedByAction });
            this._afterDismissed.complete();
            this._dismissedByAction = false;
        };
        /** Gets an observable that is notified when the snack bar is finished closing. */
        MatSnackBarRef.prototype.afterDismissed = function () {
            return this._afterDismissed.asObservable();
        };
        /** Gets an observable that is notified when the snack bar has opened and appeared. */
        MatSnackBarRef.prototype.afterOpened = function () {
            return this.containerInstance._onEnter;
        };
        /** Gets an observable that is notified when the snack bar action is called. */
        MatSnackBarRef.prototype.onAction = function () {
            return this._onAction.asObservable();
        };
        return MatSnackBarRef;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Injection token that can be used to access the data that was passed in to a snack bar. */
    var MAT_SNACK_BAR_DATA = new i0.InjectionToken('MatSnackBarData');
    /**
     * Configuration used when opening a snack-bar.
     */
    var MatSnackBarConfig = /** @class */ (function () {
        function MatSnackBarConfig() {
            /** The politeness level for the MatAriaLiveAnnouncer announcement. */
            this.politeness = 'assertive';
            /**
             * Message to be announced by the LiveAnnouncer. When opening a snackbar without a custom
             * component or template, the announcement message will default to the specified message.
             */
            this.announcementMessage = '';
            /** The length of time in milliseconds to wait before automatically dismissing the snack bar. */
            this.duration = 0;
            /** Data being injected into the child component. */
            this.data = null;
            /** The horizontal position to place the snack bar. */
            this.horizontalPosition = 'center';
            /** The vertical position to place the snack bar. */
            this.verticalPosition = 'bottom';
        }
        return MatSnackBarConfig;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * A component used to open as the default snack bar, matching material spec.
     * This should only be used internally by the snack bar service.
     */
    var SimpleSnackBar = /** @class */ (function () {
        function SimpleSnackBar(snackBarRef, data) {
            this.snackBarRef = snackBarRef;
            this.data = data;
        }
        /** Performs the action on the snack bar. */
        SimpleSnackBar.prototype.action = function () {
            this.snackBarRef.dismissWithAction();
        };
        Object.defineProperty(SimpleSnackBar.prototype, "hasAction", {
            /** If the action button should be shown. */
            get: function () {
                return !!this.data.action;
            },
            enumerable: true,
            configurable: true
        });
        SimpleSnackBar.decorators = [
            { type: i0.Component, args: [{
                        selector: 'simple-snack-bar',
                        template: "<span>{{data.message}}</span>\n<div class=\"mat-simple-snackbar-action\"  *ngIf=\"hasAction\">\n  <button mat-button (click)=\"action()\">{{data.action}}</button>\n</div>\n",
                        encapsulation: i0.ViewEncapsulation.None,
                        changeDetection: i0.ChangeDetectionStrategy.OnPush,
                        host: {
                            'class': 'mat-simple-snackbar',
                        },
                        styles: [".mat-simple-snackbar{display:flex;justify-content:space-between;align-items:center;line-height:20px;opacity:1}.mat-simple-snackbar-action{flex-shrink:0;margin:-8px -8px -8px 8px}.mat-simple-snackbar-action button{max-height:36px;min-width:0}[dir=rtl] .mat-simple-snackbar-action{margin-left:-8px;margin-right:8px}\n"]
                    }] }
        ];
        /** @nocollapse */
        SimpleSnackBar.ctorParameters = function () { return [
            { type: MatSnackBarRef },
            { type: undefined, decorators: [{ type: i0.Inject, args: [MAT_SNACK_BAR_DATA,] }] }
        ]; };
        return SimpleSnackBar;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Animations used by the Material snack bar.
     * @docs-private
     */
    var matSnackBarAnimations = {
        /** Animation that shows and hides a snack bar. */
        snackBarState: animations.trigger('state', [
            animations.state('void, hidden', animations.style({
                transform: 'scale(0.8)',
                opacity: 0,
            })),
            animations.state('visible', animations.style({
                transform: 'scale(1)',
                opacity: 1,
            })),
            animations.transition('* => visible', animations.animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
            animations.transition('* => void, * => hidden', animations.animate('75ms cubic-bezier(0.4, 0.0, 1, 1)', animations.style({
                opacity: 0
            }))),
        ])
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Internal component that wraps user-provided snack bar content.
     * @docs-private
     */
    var MatSnackBarContainer = /** @class */ (function (_super) {
        tslib.__extends(MatSnackBarContainer, _super);
        function MatSnackBarContainer(_ngZone, _elementRef, _changeDetectorRef, 
        /** The snack bar configuration. */
        snackBarConfig) {
            var _this = _super.call(this) || this;
            _this._ngZone = _ngZone;
            _this._elementRef = _elementRef;
            _this._changeDetectorRef = _changeDetectorRef;
            _this.snackBarConfig = snackBarConfig;
            /** Whether the component has been destroyed. */
            _this._destroyed = false;
            /** Subject for notifying that the snack bar has exited from view. */
            _this._onExit = new rxjs.Subject();
            /** Subject for notifying that the snack bar has finished entering the view. */
            _this._onEnter = new rxjs.Subject();
            /** The state of the snack bar animations. */
            _this._animationState = 'void';
            /**
             * Attaches a DOM portal to the snack bar container.
             * @deprecated To be turned into a method.
             * @breaking-change 10.0.0
             */
            _this.attachDomPortal = function (portal) {
                _this._assertNotAttached();
                _this._applySnackBarClasses();
                return _this._portalOutlet.attachDomPortal(portal);
            };
            // Based on the ARIA spec, `alert` and `status` roles have an
            // implicit `assertive` and `polite` politeness respectively.
            if (snackBarConfig.politeness === 'assertive' && !snackBarConfig.announcementMessage) {
                _this._role = 'alert';
            }
            else if (snackBarConfig.politeness === 'off') {
                _this._role = null;
            }
            else {
                _this._role = 'status';
            }
            return _this;
        }
        /** Attach a component portal as content to this snack bar container. */
        MatSnackBarContainer.prototype.attachComponentPortal = function (portal) {
            this._assertNotAttached();
            this._applySnackBarClasses();
            return this._portalOutlet.attachComponentPortal(portal);
        };
        /** Attach a template portal as content to this snack bar container. */
        MatSnackBarContainer.prototype.attachTemplatePortal = function (portal) {
            this._assertNotAttached();
            this._applySnackBarClasses();
            return this._portalOutlet.attachTemplatePortal(portal);
        };
        /** Handle end of animations, updating the state of the snackbar. */
        MatSnackBarContainer.prototype.onAnimationEnd = function (event) {
            var fromState = event.fromState, toState = event.toState;
            if ((toState === 'void' && fromState !== 'void') || toState === 'hidden') {
                this._completeExit();
            }
            if (toState === 'visible') {
                // Note: we shouldn't use `this` inside the zone callback,
                // because it can cause a memory leak.
                var onEnter_1 = this._onEnter;
                this._ngZone.run(function () {
                    onEnter_1.next();
                    onEnter_1.complete();
                });
            }
        };
        /** Begin animation of snack bar entrance into view. */
        MatSnackBarContainer.prototype.enter = function () {
            if (!this._destroyed) {
                this._animationState = 'visible';
                this._changeDetectorRef.detectChanges();
            }
        };
        /** Begin animation of the snack bar exiting from view. */
        MatSnackBarContainer.prototype.exit = function () {
            // Note: this one transitions to `hidden`, rather than `void`, in order to handle the case
            // where multiple snack bars are opened in quick succession (e.g. two consecutive calls to
            // `MatSnackBar.open`).
            this._animationState = 'hidden';
            return this._onExit;
        };
        /** Makes sure the exit callbacks have been invoked when the element is destroyed. */
        MatSnackBarContainer.prototype.ngOnDestroy = function () {
            this._destroyed = true;
            this._completeExit();
        };
        /**
         * Waits for the zone to settle before removing the element. Helps prevent
         * errors where we end up removing an element which is in the middle of an animation.
         */
        MatSnackBarContainer.prototype._completeExit = function () {
            var _this = this;
            this._ngZone.onMicrotaskEmpty.asObservable().pipe(operators.take(1)).subscribe(function () {
                _this._onExit.next();
                _this._onExit.complete();
            });
        };
        /** Applies the various positioning and user-configured CSS classes to the snack bar. */
        MatSnackBarContainer.prototype._applySnackBarClasses = function () {
            var element = this._elementRef.nativeElement;
            var panelClasses = this.snackBarConfig.panelClass;
            if (panelClasses) {
                if (Array.isArray(panelClasses)) {
                    // Note that we can't use a spread here, because IE doesn't support multiple arguments.
                    panelClasses.forEach(function (cssClass) { return element.classList.add(cssClass); });
                }
                else {
                    element.classList.add(panelClasses);
                }
            }
            if (this.snackBarConfig.horizontalPosition === 'center') {
                element.classList.add('mat-snack-bar-center');
            }
            if (this.snackBarConfig.verticalPosition === 'top') {
                element.classList.add('mat-snack-bar-top');
            }
        };
        /** Asserts that no content is already attached to the container. */
        MatSnackBarContainer.prototype._assertNotAttached = function () {
            if (this._portalOutlet.hasAttached()) {
                throw Error('Attempting to attach snack bar content after content is already attached');
            }
        };
        MatSnackBarContainer.decorators = [
            { type: i0.Component, args: [{
                        selector: 'snack-bar-container',
                        template: "<ng-template cdkPortalOutlet></ng-template>\n",
                        // In Ivy embedded views will be change detected from their declaration place, rather than
                        // where they were stamped out. This means that we can't have the snack bar container be OnPush,
                        // because it might cause snack bars that were opened from a template not to be out of date.
                        // tslint:disable-next-line:validate-decorators
                        changeDetection: i0.ChangeDetectionStrategy.Default,
                        encapsulation: i0.ViewEncapsulation.None,
                        animations: [matSnackBarAnimations.snackBarState],
                        host: {
                            '[attr.role]': '_role',
                            'class': 'mat-snack-bar-container',
                            '[@state]': '_animationState',
                            '(@state.done)': 'onAnimationEnd($event)'
                        },
                        styles: [".mat-snack-bar-container{border-radius:4px;box-sizing:border-box;display:block;margin:24px;max-width:33vw;min-width:344px;padding:14px 16px;min-height:48px;transform-origin:center}.cdk-high-contrast-active .mat-snack-bar-container{border:solid 1px}.mat-snack-bar-handset{width:100%}.mat-snack-bar-handset .mat-snack-bar-container{margin:8px;max-width:100%;min-width:0;width:100%}\n"]
                    }] }
        ];
        /** @nocollapse */
        MatSnackBarContainer.ctorParameters = function () { return [
            { type: i0.NgZone },
            { type: i0.ElementRef },
            { type: i0.ChangeDetectorRef },
            { type: MatSnackBarConfig }
        ]; };
        MatSnackBarContainer.propDecorators = {
            _portalOutlet: [{ type: i0.ViewChild, args: [portal.CdkPortalOutlet, { static: true },] }]
        };
        return MatSnackBarContainer;
    }(portal.BasePortalOutlet));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MatSnackBarModule = /** @class */ (function () {
        function MatSnackBarModule() {
        }
        MatSnackBarModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [
                            i1.OverlayModule,
                            portal.PortalModule,
                            common.CommonModule,
                            button.MatButtonModule,
                            core.MatCommonModule,
                        ],
                        exports: [MatSnackBarContainer, core.MatCommonModule],
                        declarations: [MatSnackBarContainer, SimpleSnackBar],
                        entryComponents: [MatSnackBarContainer, SimpleSnackBar],
                    },] }
        ];
        return MatSnackBarModule;
    }());

    /** Injection token that can be used to specify default snack bar. */
    var MAT_SNACK_BAR_DEFAULT_OPTIONS = new i0.InjectionToken('mat-snack-bar-default-options', {
        providedIn: 'root',
        factory: MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY,
    });
    /** @docs-private */
    function MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY() {
        return new MatSnackBarConfig();
    }
    /**
     * Service to dispatch Material Design snack bar messages.
     */
    var MatSnackBar = /** @class */ (function () {
        function MatSnackBar(_overlay, _live, _injector, _breakpointObserver, _parentSnackBar, _defaultConfig) {
            this._overlay = _overlay;
            this._live = _live;
            this._injector = _injector;
            this._breakpointObserver = _breakpointObserver;
            this._parentSnackBar = _parentSnackBar;
            this._defaultConfig = _defaultConfig;
            /**
             * Reference to the current snack bar in the view *at this level* (in the Angular injector tree).
             * If there is a parent snack-bar service, all operations should delegate to that parent
             * via `_openedSnackBarRef`.
             */
            this._snackBarRefAtThisLevel = null;
        }
        Object.defineProperty(MatSnackBar.prototype, "_openedSnackBarRef", {
            /** Reference to the currently opened snackbar at *any* level. */
            get: function () {
                var parent = this._parentSnackBar;
                return parent ? parent._openedSnackBarRef : this._snackBarRefAtThisLevel;
            },
            set: function (value) {
                if (this._parentSnackBar) {
                    this._parentSnackBar._openedSnackBarRef = value;
                }
                else {
                    this._snackBarRefAtThisLevel = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Creates and dispatches a snack bar with a custom component for the content, removing any
         * currently opened snack bars.
         *
         * @param component Component to be instantiated.
         * @param config Extra configuration for the snack bar.
         */
        MatSnackBar.prototype.openFromComponent = function (component, config) {
            return this._attach(component, config);
        };
        /**
         * Creates and dispatches a snack bar with a custom template for the content, removing any
         * currently opened snack bars.
         *
         * @param template Template to be instantiated.
         * @param config Extra configuration for the snack bar.
         */
        MatSnackBar.prototype.openFromTemplate = function (template, config) {
            return this._attach(template, config);
        };
        /**
         * Opens a snackbar with a message and an optional action.
         * @param message The message to show in the snackbar.
         * @param action The label for the snackbar action.
         * @param config Additional configuration options for the snackbar.
         */
        MatSnackBar.prototype.open = function (message, action, config) {
            if (action === void 0) { action = ''; }
            var _config = tslib.__assign(tslib.__assign({}, this._defaultConfig), config);
            // Since the user doesn't have access to the component, we can
            // override the data to pass in our own message and action.
            _config.data = { message: message, action: action };
            if (!_config.announcementMessage) {
                _config.announcementMessage = message;
            }
            return this.openFromComponent(SimpleSnackBar, _config);
        };
        /**
         * Dismisses the currently-visible snack bar.
         */
        MatSnackBar.prototype.dismiss = function () {
            if (this._openedSnackBarRef) {
                this._openedSnackBarRef.dismiss();
            }
        };
        MatSnackBar.prototype.ngOnDestroy = function () {
            // Only dismiss the snack bar at the current level on destroy.
            if (this._snackBarRefAtThisLevel) {
                this._snackBarRefAtThisLevel.dismiss();
            }
        };
        /**
         * Attaches the snack bar container component to the overlay.
         */
        MatSnackBar.prototype._attachSnackBarContainer = function (overlayRef, config) {
            var userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
            var injector = new portal.PortalInjector(userInjector || this._injector, new WeakMap([
                [MatSnackBarConfig, config]
            ]));
            var containerPortal = new portal.ComponentPortal(MatSnackBarContainer, config.viewContainerRef, injector);
            var containerRef = overlayRef.attach(containerPortal);
            containerRef.instance.snackBarConfig = config;
            return containerRef.instance;
        };
        /**
         * Places a new component or a template as the content of the snack bar container.
         */
        MatSnackBar.prototype._attach = function (content, userConfig) {
            var config = tslib.__assign(tslib.__assign(tslib.__assign({}, new MatSnackBarConfig()), this._defaultConfig), userConfig);
            var overlayRef = this._createOverlay(config);
            var container = this._attachSnackBarContainer(overlayRef, config);
            var snackBarRef = new MatSnackBarRef(container, overlayRef);
            if (content instanceof i0.TemplateRef) {
                var portal$1 = new portal.TemplatePortal(content, null, {
                    $implicit: config.data,
                    snackBarRef: snackBarRef
                });
                snackBarRef.instance = container.attachTemplatePortal(portal$1);
            }
            else {
                var injector = this._createInjector(config, snackBarRef);
                var portal$1 = new portal.ComponentPortal(content, undefined, injector);
                var contentRef = container.attachComponentPortal(portal$1);
                // We can't pass this via the injector, because the injector is created earlier.
                snackBarRef.instance = contentRef.instance;
            }
            // Subscribe to the breakpoint observer and attach the mat-snack-bar-handset class as
            // appropriate. This class is applied to the overlay element because the overlay must expand to
            // fill the width of the screen for full width snackbars.
            this._breakpointObserver.observe(i3.Breakpoints.HandsetPortrait).pipe(operators.takeUntil(overlayRef.detachments())).subscribe(function (state) {
                var classList = overlayRef.overlayElement.classList;
                var className = 'mat-snack-bar-handset';
                state.matches ? classList.add(className) : classList.remove(className);
            });
            this._animateSnackBar(snackBarRef, config);
            this._openedSnackBarRef = snackBarRef;
            return this._openedSnackBarRef;
        };
        /** Animates the old snack bar out and the new one in. */
        MatSnackBar.prototype._animateSnackBar = function (snackBarRef, config) {
            var _this = this;
            // When the snackbar is dismissed, clear the reference to it.
            snackBarRef.afterDismissed().subscribe(function () {
                // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
                if (_this._openedSnackBarRef == snackBarRef) {
                    _this._openedSnackBarRef = null;
                }
                if (config.announcementMessage) {
                    _this._live.clear();
                }
            });
            if (this._openedSnackBarRef) {
                // If a snack bar is already in view, dismiss it and enter the
                // new snack bar after exit animation is complete.
                this._openedSnackBarRef.afterDismissed().subscribe(function () {
                    snackBarRef.containerInstance.enter();
                });
                this._openedSnackBarRef.dismiss();
            }
            else {
                // If no snack bar is in view, enter the new snack bar.
                snackBarRef.containerInstance.enter();
            }
            // If a dismiss timeout is provided, set up dismiss based on after the snackbar is opened.
            if (config.duration && config.duration > 0) {
                snackBarRef.afterOpened().subscribe(function () { return snackBarRef._dismissAfter(config.duration); });
            }
            if (config.announcementMessage) {
                this._live.announce(config.announcementMessage, config.politeness);
            }
        };
        /**
         * Creates a new overlay and places it in the correct location.
         * @param config The user-specified snack bar config.
         */
        MatSnackBar.prototype._createOverlay = function (config) {
            var overlayConfig = new i1.OverlayConfig();
            overlayConfig.direction = config.direction;
            var positionStrategy = this._overlay.position().global();
            // Set horizontal position.
            var isRtl = config.direction === 'rtl';
            var isLeft = (config.horizontalPosition === 'left' ||
                (config.horizontalPosition === 'start' && !isRtl) ||
                (config.horizontalPosition === 'end' && isRtl));
            var isRight = !isLeft && config.horizontalPosition !== 'center';
            if (isLeft) {
                positionStrategy.left('0');
            }
            else if (isRight) {
                positionStrategy.right('0');
            }
            else {
                positionStrategy.centerHorizontally();
            }
            // Set horizontal position.
            if (config.verticalPosition === 'top') {
                positionStrategy.top('0');
            }
            else {
                positionStrategy.bottom('0');
            }
            overlayConfig.positionStrategy = positionStrategy;
            return this._overlay.create(overlayConfig);
        };
        /**
         * Creates an injector to be used inside of a snack bar component.
         * @param config Config that was used to create the snack bar.
         * @param snackBarRef Reference to the snack bar.
         */
        MatSnackBar.prototype._createInjector = function (config, snackBarRef) {
            var userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
            return new portal.PortalInjector(userInjector || this._injector, new WeakMap([
                [MatSnackBarRef, snackBarRef],
                [MAT_SNACK_BAR_DATA, config.data]
            ]));
        };
        MatSnackBar.decorators = [
            { type: i0.Injectable, args: [{ providedIn: MatSnackBarModule },] }
        ];
        /** @nocollapse */
        MatSnackBar.ctorParameters = function () { return [
            { type: i1.Overlay },
            { type: i2.LiveAnnouncer },
            { type: i0.Injector },
            { type: i3.BreakpointObserver },
            { type: MatSnackBar, decorators: [{ type: i0.Optional }, { type: i0.SkipSelf }] },
            { type: MatSnackBarConfig, decorators: [{ type: i0.Inject, args: [MAT_SNACK_BAR_DEFAULT_OPTIONS,] }] }
        ]; };
        MatSnackBar.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatSnackBar_Factory() { return new MatSnackBar(i0.ɵɵinject(i1.Overlay), i0.ɵɵinject(i2.LiveAnnouncer), i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(i3.BreakpointObserver), i0.ɵɵinject(MatSnackBar, 12), i0.ɵɵinject(MAT_SNACK_BAR_DEFAULT_OPTIONS)); }, token: MatSnackBar, providedIn: MatSnackBarModule });
        return MatSnackBar;
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

    exports.MAT_SNACK_BAR_DATA = MAT_SNACK_BAR_DATA;
    exports.MAT_SNACK_BAR_DEFAULT_OPTIONS = MAT_SNACK_BAR_DEFAULT_OPTIONS;
    exports.MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY = MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY;
    exports.MatSnackBar = MatSnackBar;
    exports.MatSnackBarConfig = MatSnackBarConfig;
    exports.MatSnackBarContainer = MatSnackBarContainer;
    exports.MatSnackBarModule = MatSnackBarModule;
    exports.MatSnackBarRef = MatSnackBarRef;
    exports.SimpleSnackBar = SimpleSnackBar;
    exports.matSnackBarAnimations = matSnackBarAnimations;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-snack-bar.umd.js.map
