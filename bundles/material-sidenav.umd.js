/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/a11y'), require('@angular/cdk/overlay'), require('@angular/common'), require('@angular/core'), require('@angular/material/core'), require('@angular/cdk/scrolling'), require('@angular/animations'), require('@angular/cdk/bidi'), require('@angular/cdk/coercion'), require('@angular/cdk/keycodes'), require('@angular/platform-browser'), require('rxjs/observable/merge'), require('rxjs/operators/filter'), require('rxjs/operators/first'), require('rxjs/operators/startWith'), require('rxjs/operators/takeUntil'), require('rxjs/operators/map'), require('rxjs/Subject'), require('rxjs/Observable')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/cdk/a11y', '@angular/cdk/overlay', '@angular/common', '@angular/core', '@angular/material/core', '@angular/cdk/scrolling', '@angular/animations', '@angular/cdk/bidi', '@angular/cdk/coercion', '@angular/cdk/keycodes', '@angular/platform-browser', 'rxjs/observable/merge', 'rxjs/operators/filter', 'rxjs/operators/first', 'rxjs/operators/startWith', 'rxjs/operators/takeUntil', 'rxjs/operators/map', 'rxjs/Subject', 'rxjs/Observable'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.sidenav = global.ng.material.sidenav || {}),global.ng.cdk.a11y,global.ng.cdk.overlay,global.ng.common,global.ng.core,global.ng.material.core,global.ng.cdk.scrolling,global.ng.animations,global.ng.cdk.bidi,global.ng.cdk.coercion,global.ng.cdk.keycodes,global.ng.platformBrowser,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable));
}(this, (function (exports,_angular_cdk_a11y,_angular_cdk_overlay,_angular_common,_angular_core,_angular_material_core,_angular_cdk_scrolling,_angular_animations,_angular_cdk_bidi,_angular_cdk_coercion,_angular_cdk_keycodes,_angular_platformBrowser,rxjs_observable_merge,rxjs_operators_filter,rxjs_operators_first,rxjs_operators_startWith,rxjs_operators_takeUntil,rxjs_operators_map) { 'use strict';

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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Throws an exception when two MatDrawer are matching the same position.
 * @param {?} position
 * @return {?}
 */
function throwMatDuplicatedDrawerError(position) {
    throw Error("A drawer was already declared for 'position=\"" + position + "\"'");
}
/**
 * Drawer toggle promise result.
 * @deprecated
 */
var MatDrawerToggleResult = /** @class */ (function () {
    function MatDrawerToggleResult(type, animationFinished) {
        this.type = type;
        this.animationFinished = animationFinished;
    }
    return MatDrawerToggleResult;
}());
var MatDrawerContent = /** @class */ (function () {
    function MatDrawerContent(_changeDetectorRef, _container) {
        this._changeDetectorRef = _changeDetectorRef;
        this._container = _container;
    }
    /**
     * @return {?}
     */
    MatDrawerContent.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._container._contentMargins.subscribe(function (margins) {
            _this._margins = margins;
            _this._changeDetectorRef.markForCheck();
        });
    };
    return MatDrawerContent;
}());
/**
 * This component corresponds to a drawer that can be opened on the drawer container.
 */
var MatDrawer = /** @class */ (function () {
    function MatDrawer(_elementRef, _focusTrapFactory, _focusMonitor, _doc) {
        var _this = this;
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._focusMonitor = _focusMonitor;
        this._doc = _doc;
        this.openedChange.subscribe(function (opened) {
            if (opened) {
                if (_this._doc) {
                    _this._elementFocusedBeforeDrawerWasOpened = /** @type {?} */ (_this._doc.activeElement);
                }
                if (_this._isFocusTrapEnabled && _this._focusTrap) {
                    _this._focusTrap.focusInitialElementWhenReady();
                }
            }
            else {
                _this._restoreFocus();
            }
        });
    }
    Object.defineProperty(MatDrawer.prototype, "position", {
        get: /**
         * The side that the drawer is attached to.
         * @return {?}
         */
        function () { return this._position; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            // Make sure we have a valid value.
            value = value === 'end' ? 'end' : 'start';
            if (value != this._position) {
                this._position = value;
                this.onAlignChanged.emit();
                this.onPositionChanged.emit();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "align", {
        get: /**
         * @deprecated
         * @return {?}
         */
        function () { return this.position; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) { this.position = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "mode", {
        get: /**
         * Mode of the drawer; one of 'over', 'push' or 'side'.
         * @return {?}
         */
        function () { return this._mode; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._mode = value;
            this._modeChanged.next();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "disableClose", {
        get: /**
         * Whether the drawer can be closed with the escape key or by clicking on the backdrop.
         * @return {?}
         */
        function () { return this._disableClose; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) { this._disableClose = _angular_cdk_coercion.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "_openedStream", {
        get: /**
         * Event emitted when the drawer has been opened.
         * @return {?}
         */
        function () {
            return this.openedChange.pipe(rxjs_operators_filter.filter(function (o) { return o; }), rxjs_operators_map.map(function () { }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "openedStart", {
        get: /**
         * Event emitted when the drawer has started opening.
         * @return {?}
         */
        function () {
            return this._animationStarted.pipe(rxjs_operators_filter.filter(function (e) { return e.fromState !== e.toState && e.toState.indexOf('open') === 0; }), rxjs_operators_map.map(function () { }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "_closedStream", {
        get: /**
         * Event emitted when the drawer has been closed.
         * @return {?}
         */
        function () {
            return this.openedChange.pipe(rxjs_operators_filter.filter(function (o) { return !o; }), rxjs_operators_map.map(function () { }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "closedStart", {
        get: /**
         * Event emitted when the drawer has started closing.
         * @return {?}
         */
        function () {
            return this._animationStarted.pipe(rxjs_operators_filter.filter(function (e) { return e.fromState !== e.toState && e.toState === 'void'; }), rxjs_operators_map.map(function () { }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "_isFocusTrapEnabled", {
        get: /**
         * @return {?}
         */
        function () {
            // The focus trap is only enabled when the drawer is open in any mode other than side.
            return this.opened && this.mode !== 'side';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * If focus is currently inside the drawer, restores it to where it was before the drawer
     * opened.
     * @return {?}
     */
    MatDrawer.prototype._restoreFocus = /**
     * If focus is currently inside the drawer, restores it to where it was before the drawer
     * opened.
     * @return {?}
     */
    function () {
        var /** @type {?} */ activeEl = this._doc && this._doc.activeElement;
        if (activeEl && this._elementRef.nativeElement.contains(activeEl)) {
            if (this._elementFocusedBeforeDrawerWasOpened instanceof HTMLElement) {
                this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened, this._openedVia);
            }
            else {
                this._elementRef.nativeElement.blur();
            }
        }
        this._elementFocusedBeforeDrawerWasOpened = null;
        this._openedVia = null;
    };
    /**
     * @return {?}
     */
    MatDrawer.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        this._focusTrap.enabled = this._isFocusTrapEnabled;
        this._enableAnimations = true;
    };
    /**
     * @return {?}
     */
    MatDrawer.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    };
    Object.defineProperty(MatDrawer.prototype, "opened", {
        get: /**
         * Whether the drawer is opened. We overload this because we trigger an event when it
         * starts or end.
         * @return {?}
         */
        function () { return this._opened; },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this.toggle(_angular_cdk_coercion.coerceBooleanProperty(v));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Open the drawer.
     * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     */
    /**
     * Open the drawer.
     * @param {?=} openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     * @return {?}
     */
    MatDrawer.prototype.open = /**
     * Open the drawer.
     * @param {?=} openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     * @return {?}
     */
    function (openedVia) {
        return this.toggle(true, openedVia);
    };
    /** Close the drawer. */
    /**
     * Close the drawer.
     * @return {?}
     */
    MatDrawer.prototype.close = /**
     * Close the drawer.
     * @return {?}
     */
    function () {
        return this.toggle(false);
    };
    /**
     * Toggle this drawer.
     * @param isOpen Whether the drawer should be open.
     * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     */
    /**
     * Toggle this drawer.
     * @param {?=} isOpen Whether the drawer should be open.
     * @param {?=} openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     * @return {?}
     */
    MatDrawer.prototype.toggle = /**
     * Toggle this drawer.
     * @param {?=} isOpen Whether the drawer should be open.
     * @param {?=} openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     * @return {?}
     */
    function (isOpen, openedVia) {
        var _this = this;
        if (isOpen === void 0) { isOpen = !this.opened; }
        if (openedVia === void 0) { openedVia = 'program'; }
        this._opened = isOpen;
        if (isOpen) {
            this._animationState = this._enableAnimations ? 'open' : 'open-instant';
            this._openedVia = openedVia;
        }
        else {
            this._animationState = 'void';
            this._restoreFocus();
        }
        if (this._focusTrap) {
            this._focusTrap.enabled = this._isFocusTrapEnabled;
        }
        // TODO(crisbeto): This promise is here for backwards-compatibility.
        // It should be removed next time we do breaking changes in the drawer.
        return new Promise(function (resolve) {
            _this.openedChange.pipe(rxjs_operators_first.first()).subscribe(function (open) {
                resolve(new MatDrawerToggleResult(open ? 'open' : 'close', true));
            });
        });
    };
    /**
     * Handles the keyboard events.
     * @docs-private
     */
    /**
     * Handles the keyboard events.
     * \@docs-private
     * @param {?} event
     * @return {?}
     */
    MatDrawer.prototype.handleKeydown = /**
     * Handles the keyboard events.
     * \@docs-private
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event.keyCode === _angular_cdk_keycodes.ESCAPE && !this.disableClose) {
            this.close();
            event.stopPropagation();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MatDrawer.prototype._onAnimationStart = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this._animationStarted.emit(event);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MatDrawer.prototype._onAnimationEnd = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var fromState = event.fromState, toState = event.toState;
        if (toState.indexOf('open') === 0 && fromState === 'void') {
            this.openedChange.emit(true);
        }
        else if (toState === 'void' && fromState.indexOf('open') === 0) {
            this.openedChange.emit(false);
        }
    };
    Object.defineProperty(MatDrawer.prototype, "_width", {
        get: /**
         * @return {?}
         */
        function () {
            return this._elementRef.nativeElement ? (this._elementRef.nativeElement.offsetWidth || 0) : 0;
        },
        enumerable: true,
        configurable: true
    });
    return MatDrawer;
}());
/**
 * <mat-drawer-container> component.
 *
 * This is the parent component to one or two <mat-drawer>s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
var MatDrawerContainer = /** @class */ (function () {
    function MatDrawerContainer(_dir, _element, _renderer, _ngZone, _changeDetectorRef) {
        var _this = this;
        this._dir = _dir;
        this._element = _element;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._changeDetectorRef = _changeDetectorRef;
        // If a `Dir` directive exists up the tree, listen direction changes and update the left/right
        // properties to point to the proper start/end.
        if (_dir != null) {
            _dir.change.pipe(rxjs_operators_takeUntil.takeUntil(this._destroyed)).subscribe(function () { return _this._validateDrawers(); });
        }
    }
    Object.defineProperty(MatDrawerContainer.prototype, "start", {
        /** The drawer child with the `start` position. */
        get: /**
         * The drawer child with the `start` position.
         * @return {?}
         */
        function () { return this._start; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawerContainer.prototype, "end", {
        /** The drawer child with the `end` position. */
        get: /**
         * The drawer child with the `end` position.
         * @return {?}
         */
        function () { return this._end; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatDrawerContainer.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._drawers.changes.pipe(rxjs_operators_startWith.startWith(null)).subscribe(function () {
            _this._validateDrawers();
            _this._drawers.forEach(function (drawer) {
                _this._watchDrawerToggle(drawer);
                _this._watchDrawerPosition(drawer);
                _this._watchDrawerMode(drawer);
            });
            if (!_this._drawers.length ||
                _this._isDrawerOpen(_this._start) ||
                _this._isDrawerOpen(_this._end)) {
                _this._updateContentMargins();
            }
            _this._changeDetectorRef.markForCheck();
        });
    };
    /**
     * @return {?}
     */
    MatDrawerContainer.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._destroyed.next();
        this._destroyed.complete();
    };
    /** Calls `open` of both start and end drawers */
    /**
     * Calls `open` of both start and end drawers
     * @return {?}
     */
    MatDrawerContainer.prototype.open = /**
     * Calls `open` of both start and end drawers
     * @return {?}
     */
    function () {
        this._drawers.forEach(function (drawer) { return drawer.open(); });
    };
    /** Calls `close` of both start and end drawers */
    /**
     * Calls `close` of both start and end drawers
     * @return {?}
     */
    MatDrawerContainer.prototype.close = /**
     * Calls `close` of both start and end drawers
     * @return {?}
     */
    function () {
        this._drawers.forEach(function (drawer) { return drawer.close(); });
    };
    /**
     * Subscribes to drawer events in order to set a class on the main container element when the
     * drawer is open and the backdrop is visible. This ensures any overflow on the container element
     * is properly hidden.
     * @param {?} drawer
     * @return {?}
     */
    MatDrawerContainer.prototype._watchDrawerToggle = /**
     * Subscribes to drawer events in order to set a class on the main container element when the
     * drawer is open and the backdrop is visible. This ensures any overflow on the container element
     * is properly hidden.
     * @param {?} drawer
     * @return {?}
     */
    function (drawer) {
        var _this = this;
        drawer._animationStarted.pipe(rxjs_operators_takeUntil.takeUntil(this._drawers.changes), rxjs_operators_filter.filter(function (event) { return event.fromState !== event.toState; }))
            .subscribe(function (event) {
            // Set the transition class on the container so that the animations occur. This should not
            // be set initially because animations should only be triggered via a change in state.
            if (event.toState !== 'open-instant') {
                _this._renderer.addClass(_this._element.nativeElement, 'mat-drawer-transition');
            }
            _this._updateContentMargins();
            _this._changeDetectorRef.markForCheck();
        });
        if (drawer.mode !== 'side') {
            drawer.openedChange.pipe(rxjs_operators_takeUntil.takeUntil(this._drawers.changes)).subscribe(function () {
                return _this._setContainerClass(drawer.opened);
            });
        }
    };
    /**
     * Subscribes to drawer onPositionChanged event in order to
     * re-validate drawers when the position changes.
     * @param {?} drawer
     * @return {?}
     */
    MatDrawerContainer.prototype._watchDrawerPosition = /**
     * Subscribes to drawer onPositionChanged event in order to
     * re-validate drawers when the position changes.
     * @param {?} drawer
     * @return {?}
     */
    function (drawer) {
        var _this = this;
        if (!drawer) {
            return;
        }
        // NOTE: We need to wait for the microtask queue to be empty before validating,
        // since both drawers may be swapping positions at the same time.
        drawer.onPositionChanged.pipe(rxjs_operators_takeUntil.takeUntil(this._drawers.changes)).subscribe(function () {
            _this._ngZone.onMicrotaskEmpty.asObservable().pipe(rxjs_operators_first.first()).subscribe(function () {
                _this._validateDrawers();
            });
        });
    };
    /**
     * Subscribes to changes in drawer mode so we can run change detection.
     * @param {?} drawer
     * @return {?}
     */
    MatDrawerContainer.prototype._watchDrawerMode = /**
     * Subscribes to changes in drawer mode so we can run change detection.
     * @param {?} drawer
     * @return {?}
     */
    function (drawer) {
        var _this = this;
        if (drawer) {
            drawer._modeChanged.pipe(rxjs_operators_takeUntil.takeUntil(rxjs_observable_merge.merge(this._drawers.changes, this._destroyed)))
                .subscribe(function () {
                _this._updateContentMargins();
                _this._changeDetectorRef.markForCheck();
            });
        }
    };
    /**
     * Toggles the 'mat-drawer-opened' class on the main 'mat-drawer-container' element.
     * @param {?} isAdd
     * @return {?}
     */
    MatDrawerContainer.prototype._setContainerClass = /**
     * Toggles the 'mat-drawer-opened' class on the main 'mat-drawer-container' element.
     * @param {?} isAdd
     * @return {?}
     */
    function (isAdd) {
        if (isAdd) {
            this._renderer.addClass(this._element.nativeElement, 'mat-drawer-opened');
        }
        else {
            this._renderer.removeClass(this._element.nativeElement, 'mat-drawer-opened');
        }
    };
    /**
     * Validate the state of the drawer children components.
     * @return {?}
     */
    MatDrawerContainer.prototype._validateDrawers = /**
     * Validate the state of the drawer children components.
     * @return {?}
     */
    function () {
        var _this = this;
        this._start = this._end = null;
        // Ensure that we have at most one start and one end drawer.
        this._drawers.forEach(function (drawer) {
            if (drawer.position == 'end') {
                if (_this._end != null) {
                    throwMatDuplicatedDrawerError('end');
                }
                _this._end = drawer;
            }
            else {
                if (_this._start != null) {
                    throwMatDuplicatedDrawerError('start');
                }
                _this._start = drawer;
            }
        });
        this._right = this._left = null;
        // Detect if we're LTR or RTL.
        if (this._dir == null || this._dir.value == 'ltr') {
            this._left = this._start;
            this._right = this._end;
        }
        else {
            this._left = this._end;
            this._right = this._start;
        }
    };
    /**
     * @return {?}
     */
    MatDrawerContainer.prototype._onBackdropClicked = /**
     * @return {?}
     */
    function () {
        this.backdropClick.emit();
        this._closeModalDrawer();
    };
    /**
     * @return {?}
     */
    MatDrawerContainer.prototype._closeModalDrawer = /**
     * @return {?}
     */
    function () {
        // Close all open drawers where closing is not disabled and the mode is not `side`.
        [this._start, this._end]
            .filter(function (drawer) { return drawer && !drawer.disableClose && drawer.mode !== 'side'; })
            .forEach(function (drawer) { return ((drawer)).close(); });
    };
    /**
     * @return {?}
     */
    MatDrawerContainer.prototype._isShowingBackdrop = /**
     * @return {?}
     */
    function () {
        return (this._isDrawerOpen(this._start) && /** @type {?} */ ((this._start)).mode != 'side')
            || (this._isDrawerOpen(this._end) && /** @type {?} */ ((this._end)).mode != 'side');
    };
    /**
     * @param {?} drawer
     * @return {?}
     */
    MatDrawerContainer.prototype._isDrawerOpen = /**
     * @param {?} drawer
     * @return {?}
     */
    function (drawer) {
        return drawer != null && drawer.opened;
    };
    /**
     * Recalculates and updates the inline styles for the content. Note that this should be used
     * sparingly, because it causes a reflow.
     * @return {?}
     */
    MatDrawerContainer.prototype._updateContentMargins = /**
     * Recalculates and updates the inline styles for the content. Note that this should be used
     * sparingly, because it causes a reflow.
     * @return {?}
     */
    function () {
        // 1. For drawers in `over` mode, they don't affect the content.
        // 2. For drawers in `side` mode they should shrink the content. We do this by adding to the
        //    left margin (for left drawer) or right margin (for right the drawer).
        // 3. For drawers in `push` mode the should shift the content without resizing it. We do this by
        //    adding to the left or right margin and simultaneously subtracting the same amount of
        //    margin from the other side.
        var /** @type {?} */ left = 0;
        var /** @type {?} */ right = 0;
        if (this._left && this._left.opened) {
            if (this._left.mode == 'side') {
                left += this._left._width;
            }
            else if (this._left.mode == 'push') {
                var /** @type {?} */ width = this._left._width;
                left += width;
                right -= width;
            }
        }
        if (this._right && this._right.opened) {
            if (this._right.mode == 'side') {
                right += this._right._width;
            }
            else if (this._right.mode == 'push') {
                var /** @type {?} */ width = this._right._width;
                right += width;
                left -= width;
            }
        }
        this._contentMargins.next({ left: left, right: right });
    };
    return MatDrawerContainer;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var MatSidenavContent = /** @class */ (function (_super) {
    __extends(MatSidenavContent, _super);
    function MatSidenavContent(changeDetectorRef, container) {
        return _super.call(this, changeDetectorRef, container) || this;
    }
    return MatSidenavContent;
}(MatDrawerContent));
var MatSidenav = /** @class */ (function (_super) {
    __extends(MatSidenav, _super);
    function MatSidenav() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MatSidenav.prototype, "fixedInViewport", {
        get: /**
         * Whether the sidenav is fixed in the viewport.
         * @return {?}
         */
        function () { return this._fixedInViewport; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) { this._fixedInViewport = _angular_cdk_coercion.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSidenav.prototype, "fixedTopGap", {
        get: /**
         * The gap between the top of the sidenav and the top of the viewport when the sidenav is in fixed
         * mode.
         * @return {?}
         */
        function () { return this._fixedTopGap; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) { this._fixedTopGap = _angular_cdk_coercion.coerceNumberProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSidenav.prototype, "fixedBottomGap", {
        get: /**
         * The gap between the bottom of the sidenav and the bottom of the viewport when the sidenav is in
         * fixed mode.
         * @return {?}
         */
        function () { return this._fixedBottomGap; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) { this._fixedBottomGap = _angular_cdk_coercion.coerceNumberProperty(value); },
        enumerable: true,
        configurable: true
    });
    return MatSidenav;
}(MatDrawer));
var MatSidenavContainer = /** @class */ (function (_super) {
    __extends(MatSidenavContainer, _super);
    function MatSidenavContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MatSidenavContainer;
}(MatDrawerContainer));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatSidenavModule = /** @class */ (function () {
    function MatSidenavModule() {
    }
    return MatSidenavModule;
}());

exports.MatSidenavModule = MatSidenavModule;
exports.throwMatDuplicatedDrawerError = throwMatDuplicatedDrawerError;
exports.MatDrawerToggleResult = MatDrawerToggleResult;
exports.MatDrawerContent = MatDrawerContent;
exports.MatDrawer = MatDrawer;
exports.MatDrawerContainer = MatDrawerContainer;
exports.MatSidenavContent = MatSidenavContent;
exports.MatSidenav = MatSidenav;
exports.MatSidenavContainer = MatSidenavContainer;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-sidenav.umd.js.map
