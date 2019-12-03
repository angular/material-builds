(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/overlay'), require('@angular/cdk/portal'), require('@angular/common'), require('@angular/core'), require('@angular/material/core'), require('tslib'), require('@angular/cdk/bidi'), require('rxjs'), require('rxjs/operators'), require('@angular/animations'), require('@angular/cdk/a11y'), require('@angular/cdk/keycodes')) :
    typeof define === 'function' && define.amd ? define('@angular/material/dialog', ['exports', '@angular/cdk/overlay', '@angular/cdk/portal', '@angular/common', '@angular/core', '@angular/material/core', 'tslib', '@angular/cdk/bidi', 'rxjs', 'rxjs/operators', '@angular/animations', '@angular/cdk/a11y', '@angular/cdk/keycodes'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.dialog = {}), global.ng.cdk.overlay, global.ng.cdk.portal, global.ng.common, global.ng.core, global.ng.material.core, global.tslib, global.ng.cdk.bidi, global.rxjs, global.rxjs.operators, global.ng.animations, global.ng.cdk.a11y, global.ng.cdk.keycodes));
}(this, (function (exports, overlay, portal, common, core, core$1, tslib, bidi, rxjs, operators, animations, a11y, keycodes) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Configuration for opening a modal dialog with the MatDialog service.
     */
    var MatDialogConfig = /** @class */ (function () {
        function MatDialogConfig() {
            /** The ARIA role of the dialog element. */
            this.role = 'dialog';
            /** Custom class for the overlay pane. */
            this.panelClass = '';
            /** Whether the dialog has a backdrop. */
            this.hasBackdrop = true;
            /** Custom class for the backdrop. */
            this.backdropClass = '';
            /** Whether the user can use escape or clicking on the backdrop to close the modal. */
            this.disableClose = false;
            /** Width of the dialog. */
            this.width = '';
            /** Height of the dialog. */
            this.height = '';
            /** Max-width of the dialog. If a number is provided, assumes pixel units. Defaults to 80vw. */
            this.maxWidth = '80vw';
            /** Data being injected into the child component. */
            this.data = null;
            /** ID of the element that describes the dialog. */
            this.ariaDescribedBy = null;
            /** ID of the element that labels the dialog. */
            this.ariaLabelledBy = null;
            /** Aria label to assign to the dialog element. */
            this.ariaLabel = null;
            /** Whether the dialog should focus the first focusable element on open. */
            this.autoFocus = true;
            /**
             * Whether the dialog should restore focus to the
             * previously-focused element, after it's closed.
             */
            this.restoreFocus = true;
            /**
             * Whether the dialog should close when the user goes backwards/forwards in history.
             * Note that this usually doesn't include clicking on links (unless the user is using
             * the `HashLocationStrategy`).
             */
            this.closeOnNavigation = true;
            // TODO(jelbourn): add configuration for lifecycle hooks, ARIA labelling.
        }
        return MatDialogConfig;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Animations used by MatDialog.
     * @docs-private
     */
    var matDialogAnimations = {
        /** Animation that is applied on the dialog container by defalt. */
        dialogContainer: animations.trigger('dialogContainer', [
            // Note: The `enter` animation transitions to `transform: none`, because for some reason
            // specifying the transform explicitly, causes IE both to blur the dialog content and
            // decimate the animation performance. Leaving it as `none` solves both issues.
            animations.state('void, exit', animations.style({ opacity: 0, transform: 'scale(0.7)' })),
            animations.state('enter', animations.style({ transform: 'none' })),
            animations.transition('* => enter', animations.animate('150ms cubic-bezier(0, 0, 0.2, 1)', animations.style({ transform: 'none', opacity: 1 }))),
            animations.transition('* => void, * => exit', animations.animate('75ms cubic-bezier(0.4, 0.0, 0.2, 1)', animations.style({ opacity: 0 }))),
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
     * Throws an exception for the case when a ComponentPortal is
     * attached to a DomPortalOutlet without an origin.
     * @docs-private
     */
    function throwMatDialogContentAlreadyAttachedError() {
        throw Error('Attempting to attach dialog content after content is already attached');
    }
    /**
     * Internal component that wraps user-provided dialog content.
     * Animation is based on https://material.io/guidelines/motion/choreography.html.
     * @docs-private
     */
    var MatDialogContainer = /** @class */ (function (_super) {
        tslib.__extends(MatDialogContainer, _super);
        function MatDialogContainer(_elementRef, _focusTrapFactory, _changeDetectorRef, _document, 
        /** The dialog configuration. */
        _config) {
            var _this = _super.call(this) || this;
            _this._elementRef = _elementRef;
            _this._focusTrapFactory = _focusTrapFactory;
            _this._changeDetectorRef = _changeDetectorRef;
            _this._config = _config;
            /** Element that was focused before the dialog was opened. Save this to restore upon close. */
            _this._elementFocusedBeforeDialogWasOpened = null;
            /** State of the dialog animation. */
            _this._state = 'enter';
            /** Emits when an animation state changes. */
            _this._animationStateChanged = new core.EventEmitter();
            /**
             * Attaches a DOM portal to the dialog container.
             * @param portal Portal to be attached.
             * @deprecated To be turned into a method.
             * @breaking-change 10.0.0
             */
            _this.attachDomPortal = function (portal) {
                if (_this._portalOutlet.hasAttached()) {
                    throwMatDialogContentAlreadyAttachedError();
                }
                _this._savePreviouslyFocusedElement();
                return _this._portalOutlet.attachDomPortal(portal);
            };
            _this._ariaLabelledBy = _config.ariaLabelledBy || null;
            _this._document = _document;
            return _this;
        }
        /**
         * Attach a ComponentPortal as content to this dialog container.
         * @param portal Portal to be attached as the dialog content.
         */
        MatDialogContainer.prototype.attachComponentPortal = function (portal) {
            if (this._portalOutlet.hasAttached()) {
                throwMatDialogContentAlreadyAttachedError();
            }
            this._savePreviouslyFocusedElement();
            return this._portalOutlet.attachComponentPortal(portal);
        };
        /**
         * Attach a TemplatePortal as content to this dialog container.
         * @param portal Portal to be attached as the dialog content.
         */
        MatDialogContainer.prototype.attachTemplatePortal = function (portal) {
            if (this._portalOutlet.hasAttached()) {
                throwMatDialogContentAlreadyAttachedError();
            }
            this._savePreviouslyFocusedElement();
            return this._portalOutlet.attachTemplatePortal(portal);
        };
        /** Moves the focus inside the focus trap. */
        MatDialogContainer.prototype._trapFocus = function () {
            var element = this._elementRef.nativeElement;
            if (!this._focusTrap) {
                this._focusTrap = this._focusTrapFactory.create(element);
            }
            // If we were to attempt to focus immediately, then the content of the dialog would not yet be
            // ready in instances where change detection has to run first. To deal with this, we simply
            // wait for the microtask queue to be empty.
            if (this._config.autoFocus) {
                this._focusTrap.focusInitialElementWhenReady();
            }
            else {
                var activeElement = this._document.activeElement;
                // Otherwise ensure that focus is on the dialog container. It's possible that a different
                // component tried to move focus while the open animation was running. See:
                // https://github.com/angular/components/issues/16215. Note that we only want to do this
                // if the focus isn't inside the dialog already, because it's possible that the consumer
                // turned off `autoFocus` in order to move focus themselves.
                if (activeElement !== element && !element.contains(activeElement)) {
                    element.focus();
                }
            }
        };
        /** Restores focus to the element that was focused before the dialog opened. */
        MatDialogContainer.prototype._restoreFocus = function () {
            var toFocus = this._elementFocusedBeforeDialogWasOpened;
            // We need the extra check, because IE can set the `activeElement` to null in some cases.
            if (this._config.restoreFocus && toFocus && typeof toFocus.focus === 'function') {
                var activeElement = this._document.activeElement;
                var element = this._elementRef.nativeElement;
                // Make sure that focus is still inside the dialog or is on the body (usually because a
                // non-focusable element like the backdrop was clicked) before moving it. It's possible that
                // the consumer moved it themselves before the animation was done, in which case we shouldn't
                // do anything.
                if (!activeElement || activeElement === this._document.body || activeElement === element ||
                    element.contains(activeElement)) {
                    toFocus.focus();
                }
            }
            if (this._focusTrap) {
                this._focusTrap.destroy();
            }
        };
        /** Saves a reference to the element that was focused before the dialog was opened. */
        MatDialogContainer.prototype._savePreviouslyFocusedElement = function () {
            var _this = this;
            if (this._document) {
                this._elementFocusedBeforeDialogWasOpened = this._document.activeElement;
                // Note that there is no focus method when rendering on the server.
                if (this._elementRef.nativeElement.focus) {
                    // Move focus onto the dialog immediately in order to prevent the user from accidentally
                    // opening multiple dialogs at the same time. Needs to be async, because the element
                    // may not be focusable immediately.
                    Promise.resolve().then(function () { return _this._elementRef.nativeElement.focus(); });
                }
            }
        };
        /** Callback, invoked whenever an animation on the host completes. */
        MatDialogContainer.prototype._onAnimationDone = function (event) {
            if (event.toState === 'enter') {
                this._trapFocus();
            }
            else if (event.toState === 'exit') {
                this._restoreFocus();
            }
            this._animationStateChanged.emit(event);
        };
        /** Callback, invoked when an animation on the host starts. */
        MatDialogContainer.prototype._onAnimationStart = function (event) {
            this._animationStateChanged.emit(event);
        };
        /** Starts the dialog exit animation. */
        MatDialogContainer.prototype._startExitAnimation = function () {
            this._state = 'exit';
            // Mark the container for check so it can react if the
            // view container is using OnPush change detection.
            this._changeDetectorRef.markForCheck();
        };
        MatDialogContainer.decorators = [
            { type: core.Component, args: [{
                        selector: 'mat-dialog-container',
                        template: "<ng-template cdkPortalOutlet></ng-template>\n",
                        encapsulation: core.ViewEncapsulation.None,
                        // Using OnPush for dialogs caused some G3 sync issues. Disabled until we can track them down.
                        // tslint:disable-next-line:validate-decorators
                        changeDetection: core.ChangeDetectionStrategy.Default,
                        animations: [matDialogAnimations.dialogContainer],
                        host: {
                            'class': 'mat-dialog-container',
                            'tabindex': '-1',
                            'aria-modal': 'true',
                            '[attr.id]': '_id',
                            '[attr.role]': '_config.role',
                            '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledBy',
                            '[attr.aria-label]': '_config.ariaLabel',
                            '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
                            '[@dialogContainer]': '_state',
                            '(@dialogContainer.start)': '_onAnimationStart($event)',
                            '(@dialogContainer.done)': '_onAnimationDone($event)',
                        },
                        styles: [".mat-dialog-container{display:block;padding:24px;border-radius:4px;box-sizing:border-box;overflow:auto;outline:0;width:100%;height:100%;min-height:inherit;max-height:inherit}.cdk-high-contrast-active .mat-dialog-container{outline:solid 1px}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:8px 0;display:flex;flex-wrap:wrap;min-height:52px;align-items:center;margin-bottom:-24px}.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions .mat-button-base+.mat-button-base{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button-base+.mat-button-base{margin-left:0;margin-right:8px}\n"]
                    }] }
        ];
        /** @nocollapse */
        MatDialogContainer.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: a11y.FocusTrapFactory },
            { type: core.ChangeDetectorRef },
            { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [common.DOCUMENT,] }] },
            { type: MatDialogConfig }
        ]; };
        MatDialogContainer.propDecorators = {
            _portalOutlet: [{ type: core.ViewChild, args: [portal.CdkPortalOutlet, { static: true },] }]
        };
        return MatDialogContainer;
    }(portal.BasePortalOutlet));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    // TODO(jelbourn): resizing
    // Counter for unique dialog ids.
    var uniqueId = 0;
    /**
     * Reference to a dialog opened via the MatDialog service.
     */
    var MatDialogRef = /** @class */ (function () {
        function MatDialogRef(_overlayRef, _containerInstance, id) {
            var _this = this;
            if (id === void 0) { id = "mat-dialog-" + uniqueId++; }
            this._overlayRef = _overlayRef;
            this._containerInstance = _containerInstance;
            this.id = id;
            /** Whether the user is allowed to close the dialog. */
            this.disableClose = this._containerInstance._config.disableClose;
            /** Subject for notifying the user that the dialog has finished opening. */
            this._afterOpened = new rxjs.Subject();
            /** Subject for notifying the user that the dialog has finished closing. */
            this._afterClosed = new rxjs.Subject();
            /** Subject for notifying the user that the dialog has started closing. */
            this._beforeClosed = new rxjs.Subject();
            /** Current state of the dialog. */
            this._state = 0 /* OPEN */;
            // Pass the id along to the container.
            _containerInstance._id = id;
            // Emit when opening animation completes
            _containerInstance._animationStateChanged.pipe(operators.filter(function (event) { return event.phaseName === 'done' && event.toState === 'enter'; }), operators.take(1))
                .subscribe(function () {
                _this._afterOpened.next();
                _this._afterOpened.complete();
            });
            // Dispose overlay when closing animation is complete
            _containerInstance._animationStateChanged.pipe(operators.filter(function (event) { return event.phaseName === 'done' && event.toState === 'exit'; }), operators.take(1)).subscribe(function () {
                clearTimeout(_this._closeFallbackTimeout);
                _this._overlayRef.dispose();
            });
            _overlayRef.detachments().subscribe(function () {
                _this._beforeClosed.next(_this._result);
                _this._beforeClosed.complete();
                _this._afterClosed.next(_this._result);
                _this._afterClosed.complete();
                _this.componentInstance = null;
                _this._overlayRef.dispose();
            });
            _overlayRef.keydownEvents()
                .pipe(operators.filter(function (event) {
                return event.keyCode === keycodes.ESCAPE && !_this.disableClose && !keycodes.hasModifierKey(event);
            }))
                .subscribe(function (event) {
                event.preventDefault();
                _this.close();
            });
        }
        /**
         * Close the dialog.
         * @param dialogResult Optional result to return to the dialog opener.
         */
        MatDialogRef.prototype.close = function (dialogResult) {
            var _this = this;
            this._result = dialogResult;
            // Transition the backdrop in parallel to the dialog.
            this._containerInstance._animationStateChanged.pipe(operators.filter(function (event) { return event.phaseName === 'start'; }), operators.take(1))
                .subscribe(function (event) {
                _this._beforeClosed.next(dialogResult);
                _this._beforeClosed.complete();
                _this._state = 2 /* CLOSED */;
                _this._overlayRef.detachBackdrop();
                // The logic that disposes of the overlay depends on the exit animation completing, however
                // it isn't guaranteed if the parent view is destroyed while it's running. Add a fallback
                // timeout which will clean everything up if the animation hasn't fired within the specified
                // amount of time plus 100ms. We don't need to run this outside the NgZone, because for the
                // vast majority of cases the timeout will have been cleared before it has the chance to fire.
                _this._closeFallbackTimeout = setTimeout(function () {
                    _this._overlayRef.dispose();
                }, event.totalTime + 100);
            });
            this._containerInstance._startExitAnimation();
            this._state = 1 /* CLOSING */;
        };
        /**
         * Gets an observable that is notified when the dialog is finished opening.
         */
        MatDialogRef.prototype.afterOpened = function () {
            return this._afterOpened.asObservable();
        };
        /**
         * Gets an observable that is notified when the dialog is finished closing.
         */
        MatDialogRef.prototype.afterClosed = function () {
            return this._afterClosed.asObservable();
        };
        /**
         * Gets an observable that is notified when the dialog has started closing.
         */
        MatDialogRef.prototype.beforeClosed = function () {
            return this._beforeClosed.asObservable();
        };
        /**
         * Gets an observable that emits when the overlay's backdrop has been clicked.
         */
        MatDialogRef.prototype.backdropClick = function () {
            return this._overlayRef.backdropClick();
        };
        /**
         * Gets an observable that emits when keydown events are targeted on the overlay.
         */
        MatDialogRef.prototype.keydownEvents = function () {
            return this._overlayRef.keydownEvents();
        };
        /**
         * Updates the dialog's position.
         * @param position New dialog position.
         */
        MatDialogRef.prototype.updatePosition = function (position) {
            var strategy = this._getPositionStrategy();
            if (position && (position.left || position.right)) {
                position.left ? strategy.left(position.left) : strategy.right(position.right);
            }
            else {
                strategy.centerHorizontally();
            }
            if (position && (position.top || position.bottom)) {
                position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
            }
            else {
                strategy.centerVertically();
            }
            this._overlayRef.updatePosition();
            return this;
        };
        /**
         * Updates the dialog's width and height.
         * @param width New width of the dialog.
         * @param height New height of the dialog.
         */
        MatDialogRef.prototype.updateSize = function (width, height) {
            if (width === void 0) { width = ''; }
            if (height === void 0) { height = ''; }
            this._getPositionStrategy().width(width).height(height);
            this._overlayRef.updatePosition();
            return this;
        };
        /** Add a CSS class or an array of classes to the overlay pane. */
        MatDialogRef.prototype.addPanelClass = function (classes) {
            this._overlayRef.addPanelClass(classes);
            return this;
        };
        /** Remove a CSS class or an array of classes from the overlay pane. */
        MatDialogRef.prototype.removePanelClass = function (classes) {
            this._overlayRef.removePanelClass(classes);
            return this;
        };
        /** Gets the current state of the dialog's lifecycle. */
        MatDialogRef.prototype.getState = function () {
            return this._state;
        };
        /** Fetches the position strategy object from the overlay ref. */
        MatDialogRef.prototype._getPositionStrategy = function () {
            return this._overlayRef.getConfig().positionStrategy;
        };
        return MatDialogRef;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Injection token that can be used to access the data that was passed in to a dialog. */
    var MAT_DIALOG_DATA = new core.InjectionToken('MatDialogData');
    /** Injection token that can be used to specify default dialog options. */
    var MAT_DIALOG_DEFAULT_OPTIONS = new core.InjectionToken('mat-dialog-default-options');
    /** Injection token that determines the scroll handling while the dialog is open. */
    var MAT_DIALOG_SCROLL_STRATEGY = new core.InjectionToken('mat-dialog-scroll-strategy');
    /** @docs-private */
    function MAT_DIALOG_SCROLL_STRATEGY_FACTORY(overlay) {
        return function () { return overlay.scrollStrategies.block(); };
    }
    /** @docs-private */
    function MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
        return function () { return overlay.scrollStrategies.block(); };
    }
    /** @docs-private */
    var MAT_DIALOG_SCROLL_STRATEGY_PROVIDER = {
        provide: MAT_DIALOG_SCROLL_STRATEGY,
        deps: [overlay.Overlay],
        useFactory: MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY,
    };
    /**
     * Service to open Material Design modal dialogs.
     */
    var MatDialog = /** @class */ (function () {
        function MatDialog(_overlay, _injector, 
        /**
         * @deprecated `_location` parameter to be removed.
         * @breaking-change 10.0.0
         */
        _location, _defaultOptions, scrollStrategy, _parentDialog, _overlayContainer) {
            var _this = this;
            this._overlay = _overlay;
            this._injector = _injector;
            this._defaultOptions = _defaultOptions;
            this._parentDialog = _parentDialog;
            this._overlayContainer = _overlayContainer;
            this._openDialogsAtThisLevel = [];
            this._afterAllClosedAtThisLevel = new rxjs.Subject();
            this._afterOpenedAtThisLevel = new rxjs.Subject();
            this._ariaHiddenElements = new Map();
            // TODO (jelbourn): tighten the typing right-hand side of this expression.
            /**
             * Stream that emits when all open dialog have finished closing.
             * Will emit on subscribe if there are no open dialogs to begin with.
             */
            this.afterAllClosed = rxjs.defer(function () { return _this.openDialogs.length ?
                _this._afterAllClosed :
                _this._afterAllClosed.pipe(operators.startWith(undefined)); });
            this._scrollStrategy = scrollStrategy;
        }
        Object.defineProperty(MatDialog.prototype, "openDialogs", {
            /** Keeps track of the currently-open dialogs. */
            get: function () {
                return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatDialog.prototype, "afterOpened", {
            /** Stream that emits when a dialog has been opened. */
            get: function () {
                return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatDialog.prototype, "_afterAllClosed", {
            get: function () {
                var parent = this._parentDialog;
                return parent ? parent._afterAllClosed : this._afterAllClosedAtThisLevel;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Opens a modal dialog containing the given component.
         * @param componentOrTemplateRef Type of the component to load into the dialog,
         *     or a TemplateRef to instantiate as the dialog content.
         * @param config Extra configuration options.
         * @returns Reference to the newly-opened dialog.
         */
        MatDialog.prototype.open = function (componentOrTemplateRef, config) {
            var _this = this;
            config = _applyConfigDefaults(config, this._defaultOptions || new MatDialogConfig());
            if (config.id && this.getDialogById(config.id)) {
                throw Error("Dialog with id \"" + config.id + "\" exists already. The dialog id must be unique.");
            }
            var overlayRef = this._createOverlay(config);
            var dialogContainer = this._attachDialogContainer(overlayRef, config);
            var dialogRef = this._attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config);
            // If this is the first dialog that we're opening, hide all the non-overlay content.
            if (!this.openDialogs.length) {
                this._hideNonDialogContentFromAssistiveTechnology();
            }
            this.openDialogs.push(dialogRef);
            dialogRef.afterClosed().subscribe(function () { return _this._removeOpenDialog(dialogRef); });
            this.afterOpened.next(dialogRef);
            return dialogRef;
        };
        /**
         * Closes all of the currently-open dialogs.
         */
        MatDialog.prototype.closeAll = function () {
            this._closeDialogs(this.openDialogs);
        };
        /**
         * Finds an open dialog by its id.
         * @param id ID to use when looking up the dialog.
         */
        MatDialog.prototype.getDialogById = function (id) {
            return this.openDialogs.find(function (dialog) { return dialog.id === id; });
        };
        MatDialog.prototype.ngOnDestroy = function () {
            // Only close the dialogs at this level on destroy
            // since the parent service may still be active.
            this._closeDialogs(this._openDialogsAtThisLevel);
            this._afterAllClosedAtThisLevel.complete();
            this._afterOpenedAtThisLevel.complete();
        };
        /**
         * Creates the overlay into which the dialog will be loaded.
         * @param config The dialog configuration.
         * @returns A promise resolving to the OverlayRef for the created overlay.
         */
        MatDialog.prototype._createOverlay = function (config) {
            var overlayConfig = this._getOverlayConfig(config);
            return this._overlay.create(overlayConfig);
        };
        /**
         * Creates an overlay config from a dialog config.
         * @param dialogConfig The dialog configuration.
         * @returns The overlay configuration.
         */
        MatDialog.prototype._getOverlayConfig = function (dialogConfig) {
            var state = new overlay.OverlayConfig({
                positionStrategy: this._overlay.position().global(),
                scrollStrategy: dialogConfig.scrollStrategy || this._scrollStrategy(),
                panelClass: dialogConfig.panelClass,
                hasBackdrop: dialogConfig.hasBackdrop,
                direction: dialogConfig.direction,
                minWidth: dialogConfig.minWidth,
                minHeight: dialogConfig.minHeight,
                maxWidth: dialogConfig.maxWidth,
                maxHeight: dialogConfig.maxHeight,
                disposeOnNavigation: dialogConfig.closeOnNavigation
            });
            if (dialogConfig.backdropClass) {
                state.backdropClass = dialogConfig.backdropClass;
            }
            return state;
        };
        /**
         * Attaches an MatDialogContainer to a dialog's already-created overlay.
         * @param overlay Reference to the dialog's underlying overlay.
         * @param config The dialog configuration.
         * @returns A promise resolving to a ComponentRef for the attached container.
         */
        MatDialog.prototype._attachDialogContainer = function (overlay, config) {
            var userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
            var injector = new portal.PortalInjector(userInjector || this._injector, new WeakMap([
                [MatDialogConfig, config]
            ]));
            var containerPortal = new portal.ComponentPortal(MatDialogContainer, config.viewContainerRef, injector, config.componentFactoryResolver);
            var containerRef = overlay.attach(containerPortal);
            return containerRef.instance;
        };
        /**
         * Attaches the user-provided component to the already-created MatDialogContainer.
         * @param componentOrTemplateRef The type of component being loaded into the dialog,
         *     or a TemplateRef to instantiate as the content.
         * @param dialogContainer Reference to the wrapping MatDialogContainer.
         * @param overlayRef Reference to the overlay in which the dialog resides.
         * @param config The dialog configuration.
         * @returns A promise resolving to the MatDialogRef that should be returned to the user.
         */
        MatDialog.prototype._attachDialogContent = function (componentOrTemplateRef, dialogContainer, overlayRef, config) {
            // Create a reference to the dialog we're creating in order to give the user a handle
            // to modify and close it.
            var dialogRef = new MatDialogRef(overlayRef, dialogContainer, config.id);
            // When the dialog backdrop is clicked, we want to close it.
            if (config.hasBackdrop) {
                overlayRef.backdropClick().subscribe(function () {
                    if (!dialogRef.disableClose) {
                        dialogRef.close();
                    }
                });
            }
            if (componentOrTemplateRef instanceof core.TemplateRef) {
                dialogContainer.attachTemplatePortal(new portal.TemplatePortal(componentOrTemplateRef, null, { $implicit: config.data, dialogRef: dialogRef }));
            }
            else {
                var injector = this._createInjector(config, dialogRef, dialogContainer);
                var contentRef = dialogContainer.attachComponentPortal(new portal.ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector));
                dialogRef.componentInstance = contentRef.instance;
            }
            dialogRef
                .updateSize(config.width, config.height)
                .updatePosition(config.position);
            return dialogRef;
        };
        /**
         * Creates a custom injector to be used inside the dialog. This allows a component loaded inside
         * of a dialog to close itself and, optionally, to return a value.
         * @param config Config object that is used to construct the dialog.
         * @param dialogRef Reference to the dialog.
         * @param container Dialog container element that wraps all of the contents.
         * @returns The custom injector that can be used inside the dialog.
         */
        MatDialog.prototype._createInjector = function (config, dialogRef, dialogContainer) {
            var userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
            // The MatDialogContainer is injected in the portal as the MatDialogContainer and the dialog's
            // content are created out of the same ViewContainerRef and as such, are siblings for injector
            // purposes. To allow the hierarchy that is expected, the MatDialogContainer is explicitly
            // added to the injection tokens.
            var injectionTokens = new WeakMap([
                [MatDialogContainer, dialogContainer],
                [MAT_DIALOG_DATA, config.data],
                [MatDialogRef, dialogRef]
            ]);
            if (config.direction &&
                (!userInjector || !userInjector.get(bidi.Directionality, null))) {
                injectionTokens.set(bidi.Directionality, {
                    value: config.direction,
                    change: rxjs.of()
                });
            }
            return new portal.PortalInjector(userInjector || this._injector, injectionTokens);
        };
        /**
         * Removes a dialog from the array of open dialogs.
         * @param dialogRef Dialog to be removed.
         */
        MatDialog.prototype._removeOpenDialog = function (dialogRef) {
            var index = this.openDialogs.indexOf(dialogRef);
            if (index > -1) {
                this.openDialogs.splice(index, 1);
                // If all the dialogs were closed, remove/restore the `aria-hidden`
                // to a the siblings and emit to the `afterAllClosed` stream.
                if (!this.openDialogs.length) {
                    this._ariaHiddenElements.forEach(function (previousValue, element) {
                        if (previousValue) {
                            element.setAttribute('aria-hidden', previousValue);
                        }
                        else {
                            element.removeAttribute('aria-hidden');
                        }
                    });
                    this._ariaHiddenElements.clear();
                    this._afterAllClosed.next();
                }
            }
        };
        /**
         * Hides all of the content that isn't an overlay from assistive technology.
         */
        MatDialog.prototype._hideNonDialogContentFromAssistiveTechnology = function () {
            var overlayContainer = this._overlayContainer.getContainerElement();
            // Ensure that the overlay container is attached to the DOM.
            if (overlayContainer.parentElement) {
                var siblings = overlayContainer.parentElement.children;
                for (var i = siblings.length - 1; i > -1; i--) {
                    var sibling = siblings[i];
                    if (sibling !== overlayContainer &&
                        sibling.nodeName !== 'SCRIPT' &&
                        sibling.nodeName !== 'STYLE' &&
                        !sibling.hasAttribute('aria-live')) {
                        this._ariaHiddenElements.set(sibling, sibling.getAttribute('aria-hidden'));
                        sibling.setAttribute('aria-hidden', 'true');
                    }
                }
            }
        };
        /** Closes all of the dialogs in an array. */
        MatDialog.prototype._closeDialogs = function (dialogs) {
            var i = dialogs.length;
            while (i--) {
                // The `_openDialogs` property isn't updated after close until the rxjs subscription
                // runs on the next microtask, in addition to modifying the array as we're going
                // through it. We loop through all of them and call close without assuming that
                // they'll be removed from the list instantaneously.
                dialogs[i].close();
            }
        };
        MatDialog.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        MatDialog.ctorParameters = function () { return [
            { type: overlay.Overlay },
            { type: core.Injector },
            { type: common.Location, decorators: [{ type: core.Optional }] },
            { type: MatDialogConfig, decorators: [{ type: core.Optional }, { type: core.Inject, args: [MAT_DIALOG_DEFAULT_OPTIONS,] }] },
            { type: undefined, decorators: [{ type: core.Inject, args: [MAT_DIALOG_SCROLL_STRATEGY,] }] },
            { type: MatDialog, decorators: [{ type: core.Optional }, { type: core.SkipSelf }] },
            { type: overlay.OverlayContainer }
        ]; };
        return MatDialog;
    }());
    /**
     * Applies default options to the dialog config.
     * @param config Config to be modified.
     * @param defaultOptions Default options provided.
     * @returns The new configuration object.
     */
    function _applyConfigDefaults(config, defaultOptions) {
        return tslib.__assign(tslib.__assign({}, defaultOptions), config);
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Counter used to generate unique IDs for dialog elements. */
    var dialogElementUid = 0;
    /**
     * Button that will close the current dialog.
     */
    var MatDialogClose = /** @class */ (function () {
        function MatDialogClose(dialogRef, _elementRef, _dialog) {
            this.dialogRef = dialogRef;
            this._elementRef = _elementRef;
            this._dialog = _dialog;
            /** Default to "button" to prevents accidental form submits. */
            this.type = 'button';
        }
        MatDialogClose.prototype.ngOnInit = function () {
            if (!this.dialogRef) {
                // When this directive is included in a dialog via TemplateRef (rather than being
                // in a Component), the DialogRef isn't available via injection because embedded
                // views cannot be given a custom injector. Instead, we look up the DialogRef by
                // ID. This must occur in `onInit`, as the ID binding for the dialog container won't
                // be resolved at constructor time.
                this.dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
            }
        };
        MatDialogClose.prototype.ngOnChanges = function (changes) {
            var proxiedChange = changes['_matDialogClose'] || changes['_matDialogCloseResult'];
            if (proxiedChange) {
                this.dialogResult = proxiedChange.currentValue;
            }
        };
        MatDialogClose.decorators = [
            { type: core.Directive, args: [{
                        selector: '[mat-dialog-close], [matDialogClose]',
                        exportAs: 'matDialogClose',
                        host: {
                            '(click)': 'dialogRef.close(dialogResult)',
                            '[attr.aria-label]': 'ariaLabel || null',
                            '[attr.type]': 'type',
                        }
                    },] }
        ];
        /** @nocollapse */
        MatDialogClose.ctorParameters = function () { return [
            { type: MatDialogRef, decorators: [{ type: core.Optional }] },
            { type: core.ElementRef },
            { type: MatDialog }
        ]; };
        MatDialogClose.propDecorators = {
            ariaLabel: [{ type: core.Input, args: ['aria-label',] }],
            type: [{ type: core.Input }],
            dialogResult: [{ type: core.Input, args: ['mat-dialog-close',] }],
            _matDialogClose: [{ type: core.Input, args: ['matDialogClose',] }]
        };
        return MatDialogClose;
    }());
    /**
     * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
     */
    var MatDialogTitle = /** @class */ (function () {
        function MatDialogTitle(_dialogRef, _elementRef, _dialog) {
            this._dialogRef = _dialogRef;
            this._elementRef = _elementRef;
            this._dialog = _dialog;
            this.id = "mat-dialog-title-" + dialogElementUid++;
        }
        MatDialogTitle.prototype.ngOnInit = function () {
            var _this = this;
            if (!this._dialogRef) {
                this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
            }
            if (this._dialogRef) {
                Promise.resolve().then(function () {
                    var container = _this._dialogRef._containerInstance;
                    if (container && !container._ariaLabelledBy) {
                        container._ariaLabelledBy = _this.id;
                    }
                });
            }
        };
        MatDialogTitle.decorators = [
            { type: core.Directive, args: [{
                        selector: '[mat-dialog-title], [matDialogTitle]',
                        exportAs: 'matDialogTitle',
                        host: {
                            'class': 'mat-dialog-title',
                            '[id]': 'id',
                        },
                    },] }
        ];
        /** @nocollapse */
        MatDialogTitle.ctorParameters = function () { return [
            { type: MatDialogRef, decorators: [{ type: core.Optional }] },
            { type: core.ElementRef },
            { type: MatDialog }
        ]; };
        MatDialogTitle.propDecorators = {
            id: [{ type: core.Input }]
        };
        return MatDialogTitle;
    }());
    /**
     * Scrollable content container of a dialog.
     */
    var MatDialogContent = /** @class */ (function () {
        function MatDialogContent() {
        }
        MatDialogContent.decorators = [
            { type: core.Directive, args: [{
                        selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]",
                        host: { 'class': 'mat-dialog-content' }
                    },] }
        ];
        return MatDialogContent;
    }());
    /**
     * Container for the bottom action buttons in a dialog.
     * Stays fixed to the bottom when scrolling.
     */
    var MatDialogActions = /** @class */ (function () {
        function MatDialogActions() {
        }
        MatDialogActions.decorators = [
            { type: core.Directive, args: [{
                        selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]",
                        host: { 'class': 'mat-dialog-actions' }
                    },] }
        ];
        return MatDialogActions;
    }());
    /**
     * Finds the closest MatDialogRef to an element by looking at the DOM.
     * @param element Element relative to which to look for a dialog.
     * @param openDialogs References to the currently-open dialogs.
     */
    function getClosestDialog(element, openDialogs) {
        var parent = element.nativeElement.parentElement;
        while (parent && !parent.classList.contains('mat-dialog-container')) {
            parent = parent.parentElement;
        }
        return parent ? openDialogs.find(function (dialog) { return dialog.id === parent.id; }) : null;
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MatDialogModule = /** @class */ (function () {
        function MatDialogModule() {
        }
        MatDialogModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule,
                            overlay.OverlayModule,
                            portal.PortalModule,
                            core$1.MatCommonModule,
                        ],
                        exports: [
                            MatDialogContainer,
                            MatDialogClose,
                            MatDialogTitle,
                            MatDialogContent,
                            MatDialogActions,
                            core$1.MatCommonModule,
                        ],
                        declarations: [
                            MatDialogContainer,
                            MatDialogClose,
                            MatDialogTitle,
                            MatDialogActions,
                            MatDialogContent,
                        ],
                        providers: [
                            MatDialog,
                            MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
                        ],
                        entryComponents: [MatDialogContainer],
                    },] }
        ];
        return MatDialogModule;
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

    exports.MAT_DIALOG_DATA = MAT_DIALOG_DATA;
    exports.MAT_DIALOG_DEFAULT_OPTIONS = MAT_DIALOG_DEFAULT_OPTIONS;
    exports.MAT_DIALOG_SCROLL_STRATEGY = MAT_DIALOG_SCROLL_STRATEGY;
    exports.MAT_DIALOG_SCROLL_STRATEGY_FACTORY = MAT_DIALOG_SCROLL_STRATEGY_FACTORY;
    exports.MAT_DIALOG_SCROLL_STRATEGY_PROVIDER = MAT_DIALOG_SCROLL_STRATEGY_PROVIDER;
    exports.MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY = MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY;
    exports.MatDialog = MatDialog;
    exports.MatDialogActions = MatDialogActions;
    exports.MatDialogClose = MatDialogClose;
    exports.MatDialogConfig = MatDialogConfig;
    exports.MatDialogContainer = MatDialogContainer;
    exports.MatDialogContent = MatDialogContent;
    exports.MatDialogModule = MatDialogModule;
    exports.MatDialogRef = MatDialogRef;
    exports.MatDialogTitle = MatDialogTitle;
    exports.matDialogAnimations = matDialogAnimations;
    exports.throwMatDialogContentAlreadyAttachedError = throwMatDialogContentAlreadyAttachedError;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-dialog.umd.js.map
