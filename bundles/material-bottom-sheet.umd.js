/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/material/core'), require('@angular/cdk/a11y'), require('@angular/cdk/overlay'), require('@angular/cdk/portal'), require('@angular/cdk/layout'), require('@angular/animations'), require('@angular/cdk/keycodes'), require('rxjs/Subject'), require('rxjs/observable/merge'), require('rxjs/operators/filter'), require('rxjs/operators/take'), require('rxjs/observable/of'), require('@angular/cdk/bidi')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/material/core', '@angular/cdk/a11y', '@angular/cdk/overlay', '@angular/cdk/portal', '@angular/cdk/layout', '@angular/animations', '@angular/cdk/keycodes', 'rxjs/Subject', 'rxjs/observable/merge', 'rxjs/operators/filter', 'rxjs/operators/take', 'rxjs/observable/of', '@angular/cdk/bidi'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.bottomSheet = global.ng.material.bottomSheet || {}),global.ng.core,global.ng.common,global.ng.material.core,global.ng.cdk.a11y,global.ng.cdk.overlay,global.ng.cdk.portal,global.ng.cdk.layout,global.ng.animations,global.ng.cdk.keycodes,global.Rx,global.Rx.Observable,global.Rx.operators,global.Rx.operators,global.Rx.Observable,global.ng.cdk.bidi));
}(this, (function (exports,_angular_core,_angular_common,_angular_material_core,_angular_cdk_a11y,_angular_cdk_overlay,_angular_cdk_portal,_angular_cdk_layout,_angular_animations,_angular_cdk_keycodes,rxjs_Subject,rxjs_observable_merge,rxjs_operators_filter,rxjs_operators_take,rxjs_observable_of,_angular_cdk_bidi) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Animations used by the Material bottom sheet.
 */
var matBottomSheetAnimations = {
    /** Animation that shows and hides a bottom sheet. */
    bottomSheetState: _angular_animations.trigger('state', [
        _angular_animations.state('void, hidden', _angular_animations.style({ transform: 'translateY(100%)' })),
        _angular_animations.state('visible', _angular_animations.style({ transform: 'translateY(0%)' })),
        _angular_animations.transition('visible => void, visible => hidden', _angular_animations.animate(_angular_material_core.AnimationDurations.COMPLEX + " " + _angular_material_core.AnimationCurves.ACCELERATION_CURVE)),
        _angular_animations.transition('void => visible', _angular_animations.animate(_angular_material_core.AnimationDurations.EXITING + " " + _angular_material_core.AnimationCurves.DECELERATION_CURVE)),
    ])
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Internal component that wraps user-provided bottom sheet content.
 * \@docs-private
 */
var MatBottomSheetContainer = /** @class */ (function (_super) {
    __extends(MatBottomSheetContainer, _super);
    function MatBottomSheetContainer(_elementRef, _changeDetectorRef, _focusTrapFactory, breakpointObserver, document) {
        var _this = _super.call(this) || this;
        _this._elementRef = _elementRef;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._focusTrapFactory = _focusTrapFactory;
        /**
         * The state of the bottom sheet animations.
         */
        _this._animationState = 'void';
        /**
         * Emits whenever the state of the animation changes.
         */
        _this._animationStateChanged = new _angular_core.EventEmitter();
        /**
         * Element that was focused before the bottom sheet was opened.
         */
        _this._elementFocusedBeforeOpened = null;
        _this._document = document;
        _this._breakpointSubscription = breakpointObserver
            .observe([_angular_cdk_layout.Breakpoints.Medium, _angular_cdk_layout.Breakpoints.Large, _angular_cdk_layout.Breakpoints.XLarge])
            .subscribe(function () {
            _this._toggleClass('mat-bottom-sheet-container-medium', breakpointObserver.isMatched(_angular_cdk_layout.Breakpoints.Medium));
            _this._toggleClass('mat-bottom-sheet-container-large', breakpointObserver.isMatched(_angular_cdk_layout.Breakpoints.Large));
            _this._toggleClass('mat-bottom-sheet-container-xlarge', breakpointObserver.isMatched(_angular_cdk_layout.Breakpoints.XLarge));
        });
        return _this;
    }
    /** Attach a component portal as content to this bottom sheet container. */
    /**
     * Attach a component portal as content to this bottom sheet container.
     * @template T
     * @param {?} portal
     * @return {?}
     */
    MatBottomSheetContainer.prototype.attachComponentPortal = /**
     * Attach a component portal as content to this bottom sheet container.
     * @template T
     * @param {?} portal
     * @return {?}
     */
    function (portal) {
        this._validatePortalAttached();
        this._setPanelClass();
        this._savePreviouslyFocusedElement();
        return this._portalOutlet.attachComponentPortal(portal);
    };
    /** Attach a template portal as content to this bottom sheet container. */
    /**
     * Attach a template portal as content to this bottom sheet container.
     * @template C
     * @param {?} portal
     * @return {?}
     */
    MatBottomSheetContainer.prototype.attachTemplatePortal = /**
     * Attach a template portal as content to this bottom sheet container.
     * @template C
     * @param {?} portal
     * @return {?}
     */
    function (portal) {
        this._validatePortalAttached();
        this._setPanelClass();
        this._savePreviouslyFocusedElement();
        return this._portalOutlet.attachTemplatePortal(portal);
    };
    /** Begin animation of bottom sheet entrance into view. */
    /**
     * Begin animation of bottom sheet entrance into view.
     * @return {?}
     */
    MatBottomSheetContainer.prototype.enter = /**
     * Begin animation of bottom sheet entrance into view.
     * @return {?}
     */
    function () {
        this._animationState = 'visible';
        this._changeDetectorRef.detectChanges();
    };
    /** Begin animation of the bottom sheet exiting from view. */
    /**
     * Begin animation of the bottom sheet exiting from view.
     * @return {?}
     */
    MatBottomSheetContainer.prototype.exit = /**
     * Begin animation of the bottom sheet exiting from view.
     * @return {?}
     */
    function () {
        this._animationState = 'hidden';
        this._changeDetectorRef.markForCheck();
    };
    /**
     * @return {?}
     */
    MatBottomSheetContainer.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._breakpointSubscription.unsubscribe();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MatBottomSheetContainer.prototype._onAnimationDone = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event.toState === 'visible') {
            this._trapFocus();
        }
        else if (event.toState === 'hidden') {
            this._restoreFocus();
        }
        this._animationStateChanged.emit(event);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MatBottomSheetContainer.prototype._onAnimationStart = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this._animationStateChanged.emit(event);
    };
    /**
     * @param {?} cssClass
     * @param {?} add
     * @return {?}
     */
    MatBottomSheetContainer.prototype._toggleClass = /**
     * @param {?} cssClass
     * @param {?} add
     * @return {?}
     */
    function (cssClass, add) {
        var /** @type {?} */ classList = this._elementRef.nativeElement.classList;
        add ? classList.add(cssClass) : classList.remove(cssClass);
    };
    /**
     * @return {?}
     */
    MatBottomSheetContainer.prototype._validatePortalAttached = /**
     * @return {?}
     */
    function () {
        if (this._portalOutlet.hasAttached()) {
            throw Error('Attempting to attach bottom sheet content after content is already attached');
        }
    };
    /**
     * @return {?}
     */
    MatBottomSheetContainer.prototype._setPanelClass = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ element = this._elementRef.nativeElement;
        var /** @type {?} */ panelClass = this.bottomSheetConfig.panelClass;
        if (Array.isArray(panelClass)) {
            // Note that we can't use a spread here, because IE doesn't support multiple arguments.
            panelClass.forEach(function (cssClass) { return element.classList.add(cssClass); });
        }
        else if (panelClass) {
            element.classList.add(panelClass);
        }
    };
    /**
     * Moves the focus inside the focus trap.
     * @return {?}
     */
    MatBottomSheetContainer.prototype._trapFocus = /**
     * Moves the focus inside the focus trap.
     * @return {?}
     */
    function () {
        if (!this._focusTrap) {
            this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        }
        this._focusTrap.focusInitialElementWhenReady();
    };
    /**
     * Restores focus to the element that was focused before the bottom sheet opened.
     * @return {?}
     */
    MatBottomSheetContainer.prototype._restoreFocus = /**
     * Restores focus to the element that was focused before the bottom sheet opened.
     * @return {?}
     */
    function () {
        var /** @type {?} */ toFocus = this._elementFocusedBeforeOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (toFocus && typeof toFocus.focus === 'function') {
            toFocus.focus();
        }
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    };
    /**
     * Saves a reference to the element that was focused before the bottom sheet was opened.
     * @return {?}
     */
    MatBottomSheetContainer.prototype._savePreviouslyFocusedElement = /**
     * Saves a reference to the element that was focused before the bottom sheet was opened.
     * @return {?}
     */
    function () {
        var _this = this;
        this._elementFocusedBeforeOpened = /** @type {?} */ (this._document.activeElement);
        Promise.resolve().then(function () { return _this._elementRef.nativeElement.focus(); });
    };
    MatBottomSheetContainer.decorators = [
        { type: _angular_core.Component, args: [{selector: 'mat-bottom-sheet-container',
                    template: "<ng-template cdkPortalOutlet></ng-template>",
                    styles: [".mat-bottom-sheet-container{box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12);padding:8px 16px;min-width:100vw;box-sizing:border-box;display:block;outline:0}.mat-bottom-sheet-container-medium{min-width:384px}.mat-bottom-sheet-container-large{min-width:512px}.mat-bottom-sheet-container-xlarge{min-width:576px}"],
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                    encapsulation: _angular_core.ViewEncapsulation.None,
                    preserveWhitespaces: false,
                    animations: [matBottomSheetAnimations.bottomSheetState],
                    host: {
                        'class': 'mat-bottom-sheet-container',
                        'tabindex': '-1',
                        'role': 'dialog',
                        '[attr.aria-label]': 'bottomSheetConfig?.ariaLabel',
                        '[@state]': '_animationState',
                        '(@state.start)': '_onAnimationStart($event)',
                        '(@state.done)': '_onAnimationDone($event)'
                    },
                },] },
    ];
    /** @nocollapse */
    MatBottomSheetContainer.ctorParameters = function () { return [
        { type: _angular_core.ElementRef, },
        { type: _angular_core.ChangeDetectorRef, },
        { type: _angular_cdk_a11y.FocusTrapFactory, },
        { type: _angular_cdk_layout.BreakpointObserver, },
        { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_common.DOCUMENT,] },] },
    ]; };
    MatBottomSheetContainer.propDecorators = {
        "_portalOutlet": [{ type: _angular_core.ViewChild, args: [_angular_cdk_portal.CdkPortalOutlet,] },],
    };
    return MatBottomSheetContainer;
}(_angular_cdk_portal.BasePortalOutlet));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Injection token that can be used to access the data that was passed in to a bottom sheet.
 */
var MAT_BOTTOM_SHEET_DATA = new _angular_core.InjectionToken('MatBottomSheetData');
/**
 * Configuration used when opening a bottom sheet.
 */
var MatBottomSheetConfig = /** @class */ (function () {
    function MatBottomSheetConfig() {
        /**
         * Data being injected into the child component.
         */
        this.data = null;
        /**
         * Whether the bottom sheet has a backdrop.
         */
        this.hasBackdrop = true;
        /**
         * Whether the user can use escape or clicking outside to close the bottom sheet.
         */
        this.disableClose = false;
        /**
         * Aria label to assign to the bottom sheet element.
         */
        this.ariaLabel = null;
    }
    return MatBottomSheetConfig;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Reference to a bottom sheet dispatched from the bottom sheet service.
 */
var MatBottomSheetRef = /** @class */ (function () {
    function MatBottomSheetRef(containerInstance, _overlayRef) {
        var _this = this;
        this._overlayRef = _overlayRef;
        /**
         * Subject for notifying the user that the bottom sheet has been dismissed.
         */
        this._afterDismissed = new rxjs_Subject.Subject();
        /**
         * Subject for notifying the user that the bottom sheet has opened and appeared.
         */
        this._afterOpened = new rxjs_Subject.Subject();
        this.containerInstance = containerInstance;
        // Emit when opening animation completes
        containerInstance._animationStateChanged.pipe(rxjs_operators_filter.filter(function (event) { return event.phaseName === 'done' && event.toState === 'visible'; }), rxjs_operators_take.take(1))
            .subscribe(function () {
            _this._afterOpened.next();
            _this._afterOpened.complete();
        });
        // Dispose overlay when closing animation is complete
        containerInstance._animationStateChanged.pipe(rxjs_operators_filter.filter(function (event) { return event.phaseName === 'done' && event.toState === 'hidden'; }), rxjs_operators_take.take(1))
            .subscribe(function () {
            _this._overlayRef.dispose();
            _this._afterDismissed.next(_this._result);
            _this._afterDismissed.complete();
        });
        if (!containerInstance.bottomSheetConfig.disableClose) {
            rxjs_observable_merge.merge(_overlayRef.backdropClick(), _overlayRef._keydownEvents.pipe(rxjs_operators_filter.filter(function (event) { return event.keyCode === _angular_cdk_keycodes.ESCAPE; }))).subscribe(function () { return _this.dismiss(); });
        }
    }
    /**
     * Dismisses the bottom sheet.
     * @param result Data to be passed back to the bottom sheet opener.
     */
    /**
     * Dismisses the bottom sheet.
     * @param {?=} result Data to be passed back to the bottom sheet opener.
     * @return {?}
     */
    MatBottomSheetRef.prototype.dismiss = /**
     * Dismisses the bottom sheet.
     * @param {?=} result Data to be passed back to the bottom sheet opener.
     * @return {?}
     */
    function (result) {
        var _this = this;
        if (!this._afterDismissed.closed) {
            // Transition the backdrop in parallel to the bottom sheet.
            this.containerInstance._animationStateChanged.pipe(rxjs_operators_filter.filter(function (event) { return event.phaseName === 'start'; }), rxjs_operators_take.take(1)).subscribe(function () { return _this._overlayRef.detachBackdrop(); });
            this._result = result;
            this.containerInstance.exit();
        }
    };
    /** Gets an observable that is notified when the bottom sheet is finished closing. */
    /**
     * Gets an observable that is notified when the bottom sheet is finished closing.
     * @return {?}
     */
    MatBottomSheetRef.prototype.afterDismissed = /**
     * Gets an observable that is notified when the bottom sheet is finished closing.
     * @return {?}
     */
    function () {
        return this._afterDismissed.asObservable();
    };
    /** Gets an observable that is notified when the bottom sheet has opened and appeared. */
    /**
     * Gets an observable that is notified when the bottom sheet has opened and appeared.
     * @return {?}
     */
    MatBottomSheetRef.prototype.afterOpened = /**
     * Gets an observable that is notified when the bottom sheet has opened and appeared.
     * @return {?}
     */
    function () {
        return this._afterOpened.asObservable();
    };
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     * @return {?}
     */
    MatBottomSheetRef.prototype.backdropClick = /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     * @return {?}
     */
    function () {
        return this._overlayRef.backdropClick();
    };
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     * @return {?}
     */
    MatBottomSheetRef.prototype.keydownEvents = /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     * @return {?}
     */
    function () {
        return this._overlayRef.keydownEvents();
    };
    return MatBottomSheetRef;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Service to trigger Material Design bottom sheets.
 */
var MatBottomSheet = /** @class */ (function () {
    function MatBottomSheet(_overlay, _injector, _parentBottomSheet) {
        this._overlay = _overlay;
        this._injector = _injector;
        this._parentBottomSheet = _parentBottomSheet;
        this._bottomSheetRefAtThisLevel = null;
    }
    Object.defineProperty(MatBottomSheet.prototype, "_openedBottomSheetRef", {
        /** Reference to the currently opened bottom sheet. */
        get: /**
         * Reference to the currently opened bottom sheet.
         * @return {?}
         */
        function () {
            var /** @type {?} */ parent = this._parentBottomSheet;
            return parent ? parent._openedBottomSheetRef : this._bottomSheetRefAtThisLevel;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (this._parentBottomSheet) {
                this._parentBottomSheet._openedBottomSheetRef = value;
            }
            else {
                this._bottomSheetRefAtThisLevel = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @template T, D, R
     * @param {?} componentOrTemplateRef
     * @param {?=} config
     * @return {?}
     */
    MatBottomSheet.prototype.open = /**
     * @template T, D, R
     * @param {?} componentOrTemplateRef
     * @param {?=} config
     * @return {?}
     */
    function (componentOrTemplateRef, config) {
        var _this = this;
        var /** @type {?} */ _config = _applyConfigDefaults(config);
        var /** @type {?} */ overlayRef = this._createOverlay(_config);
        var /** @type {?} */ container = this._attachContainer(overlayRef, _config);
        var /** @type {?} */ ref = new MatBottomSheetRef(container, overlayRef);
        if (componentOrTemplateRef instanceof _angular_core.TemplateRef) {
            container.attachTemplatePortal(new _angular_cdk_portal.TemplatePortal(componentOrTemplateRef, /** @type {?} */ ((null)), /** @type {?} */ ({
                $implicit: _config.data,
                bottomSheetRef: ref
            })));
        }
        else {
            var /** @type {?} */ portal = new _angular_cdk_portal.ComponentPortal(componentOrTemplateRef, undefined, this._createInjector(_config, ref));
            var /** @type {?} */ contentRef = container.attachComponentPortal(portal);
            ref.instance = contentRef.instance;
        }
        // When the bottom sheet is dismissed, clear the reference to it.
        ref.afterDismissed().subscribe(function () {
            // Clear the bottom sheet ref if it hasn't already been replaced by a newer one.
            if (_this._openedBottomSheetRef == ref) {
                _this._openedBottomSheetRef = null;
            }
        });
        if (this._openedBottomSheetRef) {
            // If a bottom sheet is already in view, dismiss it and enter the
            // new bottom sheet after exit animation is complete.
            this._openedBottomSheetRef.afterDismissed().subscribe(function () { return ref.containerInstance.enter(); });
            this._openedBottomSheetRef.dismiss();
        }
        else {
            // If no bottom sheet is in view, enter the new bottom sheet.
            ref.containerInstance.enter();
        }
        this._openedBottomSheetRef = ref;
        return ref;
    };
    /**
     * Dismisses the currently-visible bottom sheet.
     */
    /**
     * Dismisses the currently-visible bottom sheet.
     * @return {?}
     */
    MatBottomSheet.prototype.dismiss = /**
     * Dismisses the currently-visible bottom sheet.
     * @return {?}
     */
    function () {
        if (this._openedBottomSheetRef) {
            this._openedBottomSheetRef.dismiss();
        }
    };
    /**
     * Attaches the bottom sheet container component to the overlay.
     * @param {?} overlayRef
     * @param {?} config
     * @return {?}
     */
    MatBottomSheet.prototype._attachContainer = /**
     * Attaches the bottom sheet container component to the overlay.
     * @param {?} overlayRef
     * @param {?} config
     * @return {?}
     */
    function (overlayRef, config) {
        var /** @type {?} */ containerPortal = new _angular_cdk_portal.ComponentPortal(MatBottomSheetContainer, config.viewContainerRef);
        var /** @type {?} */ containerRef = overlayRef.attach(containerPortal);
        containerRef.instance.bottomSheetConfig = config;
        return containerRef.instance;
    };
    /**
     * Creates a new overlay and places it in the correct location.
     * @param {?} config The user-specified bottom sheet config.
     * @return {?}
     */
    MatBottomSheet.prototype._createOverlay = /**
     * Creates a new overlay and places it in the correct location.
     * @param {?} config The user-specified bottom sheet config.
     * @return {?}
     */
    function (config) {
        var /** @type {?} */ overlayConfig = new _angular_cdk_overlay.OverlayConfig({
            direction: config.direction,
            hasBackdrop: config.hasBackdrop,
            maxWidth: '100%',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .global()
                .centerHorizontally()
                .bottom('0')
        });
        if (config.backdropClass) {
            overlayConfig.backdropClass = config.backdropClass;
        }
        return this._overlay.create(overlayConfig);
    };
    /**
     * Creates an injector to be used inside of a bottom sheet component.
     * @template T
     * @param {?} config Config that was used to create the bottom sheet.
     * @param {?} bottomSheetRef Reference to the bottom sheet.
     * @return {?}
     */
    MatBottomSheet.prototype._createInjector = /**
     * Creates an injector to be used inside of a bottom sheet component.
     * @template T
     * @param {?} config Config that was used to create the bottom sheet.
     * @param {?} bottomSheetRef Reference to the bottom sheet.
     * @return {?}
     */
    function (config, bottomSheetRef) {
        var /** @type {?} */ userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        var /** @type {?} */ injectionTokens = new WeakMap();
        injectionTokens.set(MatBottomSheetRef, bottomSheetRef);
        injectionTokens.set(MAT_BOTTOM_SHEET_DATA, config.data);
        if (!userInjector || !userInjector.get(_angular_cdk_bidi.Directionality, null)) {
            injectionTokens.set(_angular_cdk_bidi.Directionality, {
                value: config.direction,
                change: rxjs_observable_of.of()
            });
        }
        return new _angular_cdk_portal.PortalInjector(userInjector || this._injector, injectionTokens);
    };
    MatBottomSheet.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    MatBottomSheet.ctorParameters = function () { return [
        { type: _angular_cdk_overlay.Overlay, },
        { type: _angular_core.Injector, },
        { type: MatBottomSheet, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.SkipSelf },] },
    ]; };
    return MatBottomSheet;
}());
/**
 * Applies default options to the bottom sheet config.
 * @param {?=} config The configuration to which the defaults will be applied.
 * @return {?} The new configuration object with defaults applied.
 */
function _applyConfigDefaults(config) {
    return __assign({}, new MatBottomSheetConfig(), config);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatBottomSheetModule = /** @class */ (function () {
    function MatBottomSheetModule() {
    }
    MatBottomSheetModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [
                        _angular_cdk_a11y.A11yModule,
                        _angular_common.CommonModule,
                        _angular_cdk_overlay.OverlayModule,
                        _angular_material_core.MatCommonModule,
                        _angular_cdk_portal.PortalModule,
                        _angular_cdk_layout.LayoutModule,
                    ],
                    exports: [MatBottomSheetContainer, _angular_material_core.MatCommonModule],
                    declarations: [MatBottomSheetContainer],
                    entryComponents: [MatBottomSheetContainer],
                    providers: [MatBottomSheet],
                },] },
    ];
    /** @nocollapse */
    MatBottomSheetModule.ctorParameters = function () { return []; };
    return MatBottomSheetModule;
}());

exports.MatBottomSheetModule = MatBottomSheetModule;
exports.MatBottomSheet = MatBottomSheet;
exports.MAT_BOTTOM_SHEET_DATA = MAT_BOTTOM_SHEET_DATA;
exports.MatBottomSheetConfig = MatBottomSheetConfig;
exports.MatBottomSheetContainer = MatBottomSheetContainer;
exports.matBottomSheetAnimations = matBottomSheetAnimations;
exports.MatBottomSheetRef = MatBottomSheetRef;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-bottom-sheet.umd.js.map
