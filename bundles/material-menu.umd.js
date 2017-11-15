/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/material/core'), require('@angular/cdk/overlay'), require('@angular/cdk/a11y'), require('@angular/cdk/keycodes'), require('rxjs/operators/startWith'), require('rxjs/operators/switchMap'), require('rxjs/operators/first'), require('rxjs/observable/merge'), require('rxjs/Subscription'), require('@angular/animations'), require('rxjs/Subject'), require('@angular/cdk/coercion'), require('@angular/cdk/bidi'), require('@angular/cdk/portal'), require('rxjs/operators/filter'), require('rxjs/observable/of')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/material/core', '@angular/cdk/overlay', '@angular/cdk/a11y', '@angular/cdk/keycodes', 'rxjs/operators/startWith', 'rxjs/operators/switchMap', 'rxjs/operators/first', 'rxjs/observable/merge', 'rxjs/Subscription', '@angular/animations', 'rxjs/Subject', '@angular/cdk/coercion', '@angular/cdk/bidi', '@angular/cdk/portal', 'rxjs/operators/filter', 'rxjs/observable/of'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.menu = global.ng.material.menu || {}),global.ng.core,global.ng.common,global.ng.material.core,global.ng.cdk.overlay,global.ng.cdk.a11y,global.ng.cdk.keycodes,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable,global.Rx,global.ng.animations,global.Rx,global.ng.cdk.coercion,global.ng.cdk.bidi,global.ng.cdk.portal,global.Rx.Observable,global.Rx.Observable));
}(this, (function (exports,_angular_core,_angular_common,_angular_material_core,_angular_cdk_overlay,_angular_cdk_a11y,_angular_cdk_keycodes,rxjs_operators_startWith,rxjs_operators_switchMap,rxjs_operators_first,rxjs_observable_merge,rxjs_Subscription,_angular_animations,rxjs_Subject,_angular_cdk_coercion,_angular_cdk_bidi,_angular_cdk_portal,rxjs_operators_filter,rxjs_observable_of) { 'use strict';

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
 * This animation controls the menu panel's entry and exit from the page.
 *
 * When the menu panel is added to the DOM, it scales in and fades in its border.
 *
 * When the menu panel is removed from the DOM, it simply fades out after a brief
 * delay to display the ripple.
 */
var transformMenu = _angular_animations.trigger('transformMenu', [
    _angular_animations.state('void', _angular_animations.style({
        opacity: 0,
        // This starts off from 0.01, instead of 0, because there's an issue in the Angular animations
        // as of 4.2, which causes the animation to be skipped if it starts from 0.
        transform: 'scale(0.01, 0.01)'
    })),
    _angular_animations.state('enter-start', _angular_animations.style({
        opacity: 1,
        transform: 'scale(1, 0.5)'
    })),
    _angular_animations.state('enter', _angular_animations.style({
        transform: 'scale(1, 1)'
    })),
    _angular_animations.transition('void => enter-start', _angular_animations.animate('100ms linear')),
    _angular_animations.transition('enter-start => enter', _angular_animations.animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    _angular_animations.transition('* => void', _angular_animations.animate('150ms 50ms linear', _angular_animations.style({ opacity: 0 })))
]);
/**
 * This animation fades in the background color and content of the menu panel
 * after its containing element is scaled in.
 */
var fadeInItems = _angular_animations.trigger('fadeInItems', [
    _angular_animations.state('showing', _angular_animations.style({ opacity: 1 })),
    _angular_animations.transition('void => *', [
        _angular_animations.style({ opacity: 0 }),
        _angular_animations.animate('400ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)')
    ])
]);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Throws an exception for the case when menu trigger doesn't have a valid mat-menu instance
 * \@docs-private
 * @return {?}
 */
function throwMatMenuMissingError() {
    throw Error("mat-menu-trigger: must pass in an mat-menu instance.\n\n    Example:\n      <mat-menu #menu=\"matMenu\"></mat-menu>\n      <button [matMenuTriggerFor]=\"menu\"></button>");
}
/**
 * Throws an exception for the case when menu's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 * \@docs-private
 * @return {?}
 */
function throwMatMenuInvalidPositionX() {
    throw Error("x-position value must be either 'before' or after'.\n      Example: <mat-menu x-position=\"before\" #menu=\"matMenu\"></mat-menu>");
}
/**
 * Throws an exception for the case when menu's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 * \@docs-private
 * @return {?}
 */
function throwMatMenuInvalidPositionY() {
    throw Error("y-position value must be either 'above' or below'.\n      Example: <mat-menu y-position=\"above\" #menu=\"matMenu\"></mat-menu>");
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * \@docs-private
 */
var MatMenuItemBase = /** @class */ (function () {
    function MatMenuItemBase() {
    }
    return MatMenuItemBase;
}());
var _MatMenuItemMixinBase = _angular_material_core.mixinDisabled(MatMenuItemBase);
/**
 * This directive is intended to be used inside an mat-menu tag.
 * It exists mostly to set the role attribute.
 */
var MatMenuItem = /** @class */ (function (_super) {
    __extends(MatMenuItem, _super);
    function MatMenuItem(_elementRef) {
        var _this = _super.call(this) || this;
        _this._elementRef = _elementRef;
        return _this;
    }
    /** Focuses the menu item. */
    /**
     * Focuses the menu item.
     * @return {?}
     */
    MatMenuItem.prototype.focus = /**
     * Focuses the menu item.
     * @return {?}
     */
    function () {
        this._getHostElement().focus();
    };
    /**
     * @return {?}
     */
    MatMenuItem.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._hovered.complete();
    };
    /** Used to set the `tabindex`. */
    /**
     * Used to set the `tabindex`.
     * @return {?}
     */
    MatMenuItem.prototype._getTabIndex = /**
     * Used to set the `tabindex`.
     * @return {?}
     */
    function () {
        return this.disabled ? '-1' : '0';
    };
    /** Returns the host DOM element. */
    /**
     * Returns the host DOM element.
     * @return {?}
     */
    MatMenuItem.prototype._getHostElement = /**
     * Returns the host DOM element.
     * @return {?}
     */
    function () {
        return this._elementRef.nativeElement;
    };
    /** Prevents the default element actions if it is disabled. */
    /**
     * Prevents the default element actions if it is disabled.
     * @param {?} event
     * @return {?}
     */
    MatMenuItem.prototype._checkDisabled = /**
     * Prevents the default element actions if it is disabled.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    };
    /** Emits to the hover stream. */
    /**
     * Emits to the hover stream.
     * @return {?}
     */
    MatMenuItem.prototype._emitHoverEvent = /**
     * Emits to the hover stream.
     * @return {?}
     */
    function () {
        if (!this.disabled) {
            this._hovered.next(this);
        }
    };
    /** Gets the label to be used when determining whether the option should be focused. */
    /**
     * Gets the label to be used when determining whether the option should be focused.
     * @return {?}
     */
    MatMenuItem.prototype.getLabel = /**
     * Gets the label to be used when determining whether the option should be focused.
     * @return {?}
     */
    function () {
        var /** @type {?} */ element = this._elementRef.nativeElement;
        var /** @type {?} */ output = '';
        if (element.childNodes) {
            var /** @type {?} */ length_1 = element.childNodes.length;
            // Go through all the top-level text nodes and extract their text.
            // We skip anything that's not a text node to prevent the text from
            // being thrown off by something like an icon.
            for (var /** @type {?} */ i = 0; i < length_1; i++) {
                if (element.childNodes[i].nodeType === Node.TEXT_NODE) {
                    output += element.childNodes[i].textContent;
                }
            }
        }
        return output.trim();
    };
    return MatMenuItem;
}(_MatMenuItemMixinBase));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Default `mat-menu` options that can be overridden.
 * @record
 */

/**
 * Injection token to be used to override the default options for `mat-menu`.
 */
var MAT_MENU_DEFAULT_OPTIONS = new _angular_core.InjectionToken('mat-menu-default-options');
/**
 * Start elevation for the menu panel.
 * \@docs-private
 */
var MAT_MENU_BASE_ELEVATION = 2;
var MatMenu = /** @class */ (function () {
    function MatMenu(_elementRef, _ngZone, _defaultOptions) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._defaultOptions = _defaultOptions;
    }
    Object.defineProperty(MatMenu.prototype, "xPosition", {
        get: /**
         * Position of the menu in the X axis.
         * @return {?}
         */
        function () { return this._xPosition; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (value !== 'before' && value !== 'after') {
                throwMatMenuInvalidPositionX();
            }
            this._xPosition = value;
            this.setPositionClasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatMenu.prototype, "yPosition", {
        get: /**
         * Position of the menu in the Y axis.
         * @return {?}
         */
        function () { return this._yPosition; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (value !== 'above' && value !== 'below') {
                throwMatMenuInvalidPositionY();
            }
            this._yPosition = value;
            this.setPositionClasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatMenu.prototype, "overlapTrigger", {
        get: /**
         * @return {?}
         */
        function () {
            return this._overlapTrigger;
        },
        set: /**
         * Whether the menu should overlap its trigger.
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._overlapTrigger = _angular_cdk_coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatMenu.prototype, "panelClass", {
        set: /**
         * This method takes classes set on the host mat-menu element and applies them on the
         * menu template that displays in the overlay container.  Otherwise, it's difficult
         * to style the containing menu from outside the component.
         * @param {?} classes list of class names
         * @return {?}
         */
        function (classes) {
            if (classes && classes.length) {
                this._classList = classes.split(' ').reduce(function (obj, className) {
                    obj[className] = true;
                    return obj;
                }, {});
                this._elementRef.nativeElement.className = '';
                this.setPositionClasses();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatMenu.prototype, "classList", {
        get: /**
         * @return {?}
         */
        function () { return this.panelClass; },
        set: /**
         * This method takes classes set on the host mat-menu element and applies them on the
         * menu template that displays in the overlay container.  Otherwise, it's difficult
         * to style the containing menu from outside the component.
         * @deprecated Use `panelClass` instead.
         * @param {?} classes
         * @return {?}
         */
        function (classes) { this.panelClass = classes; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatMenu.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._keyManager = new _angular_cdk_a11y.FocusKeyManager(this.items).withWrap().withTypeAhead();
        this._tabSubscription = this._keyManager.tabOut.subscribe(function () { return _this.close.emit('keydown'); });
    };
    /**
     * @return {?}
     */
    MatMenu.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._tabSubscription.unsubscribe();
        this.closed.emit();
        this.closed.complete();
    };
    /** Stream that emits whenever the hovered menu item changes. */
    /**
     * Stream that emits whenever the hovered menu item changes.
     * @return {?}
     */
    MatMenu.prototype._hovered = /**
     * Stream that emits whenever the hovered menu item changes.
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.items) {
            return this.items.changes.pipe(rxjs_operators_startWith.startWith(this.items), rxjs_operators_switchMap.switchMap(function (items) { return rxjs_observable_merge.merge.apply(void 0, items.map(function (item) { return item._hovered; })); }));
        }
        return this._ngZone.onStable
            .asObservable()
            .pipe(rxjs_operators_first.first(), rxjs_operators_switchMap.switchMap(function () { return _this._hovered(); }));
    };
    /** Handle a keyboard event from the menu, delegating to the appropriate action. */
    /**
     * Handle a keyboard event from the menu, delegating to the appropriate action.
     * @param {?} event
     * @return {?}
     */
    MatMenu.prototype._handleKeydown = /**
     * Handle a keyboard event from the menu, delegating to the appropriate action.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        switch (event.keyCode) {
            case _angular_cdk_keycodes.ESCAPE:
                this.closed.emit('keydown');
                event.stopPropagation();
                break;
            case _angular_cdk_keycodes.LEFT_ARROW:
                if (this.parentMenu && this.direction === 'ltr') {
                    this.closed.emit('keydown');
                }
                break;
            case _angular_cdk_keycodes.RIGHT_ARROW:
                if (this.parentMenu && this.direction === 'rtl') {
                    this.closed.emit('keydown');
                }
                break;
            default:
                this._keyManager.onKeydown(event);
        }
    };
    /**
     * Focus the first item in the menu. This method is used by the menu trigger
     * to focus the first item when the menu is opened by the ENTER key.
     */
    /**
     * Focus the first item in the menu. This method is used by the menu trigger
     * to focus the first item when the menu is opened by the ENTER key.
     * @return {?}
     */
    MatMenu.prototype.focusFirstItem = /**
     * Focus the first item in the menu. This method is used by the menu trigger
     * to focus the first item when the menu is opened by the ENTER key.
     * @return {?}
     */
    function () {
        this._keyManager.setFirstItemActive();
    };
    /**
     * Resets the active item in the menu. This is used when the menu is opened by mouse,
     * allowing the user to start from the first option when pressing the down arrow.
     */
    /**
     * Resets the active item in the menu. This is used when the menu is opened by mouse,
     * allowing the user to start from the first option when pressing the down arrow.
     * @return {?}
     */
    MatMenu.prototype.resetActiveItem = /**
     * Resets the active item in the menu. This is used when the menu is opened by mouse,
     * allowing the user to start from the first option when pressing the down arrow.
     * @return {?}
     */
    function () {
        this._keyManager.setActiveItem(-1);
    };
    /**
     * It's necessary to set position-based classes to ensure the menu panel animation
     * folds out from the correct direction.
     */
    /**
     * It's necessary to set position-based classes to ensure the menu panel animation
     * folds out from the correct direction.
     * @param {?=} posX
     * @param {?=} posY
     * @return {?}
     */
    MatMenu.prototype.setPositionClasses = /**
     * It's necessary to set position-based classes to ensure the menu panel animation
     * folds out from the correct direction.
     * @param {?=} posX
     * @param {?=} posY
     * @return {?}
     */
    function (posX, posY) {
        if (posX === void 0) { posX = this.xPosition; }
        if (posY === void 0) { posY = this.yPosition; }
        this._classList['mat-menu-before'] = posX === 'before';
        this._classList['mat-menu-after'] = posX === 'after';
        this._classList['mat-menu-above'] = posY === 'above';
        this._classList['mat-menu-below'] = posY === 'below';
    };
    /**
     * Sets the menu panel elevation.
     * @param depth Number of parent menus that come before the menu.
     */
    /**
     * Sets the menu panel elevation.
     * @param {?} depth Number of parent menus that come before the menu.
     * @return {?}
     */
    MatMenu.prototype.setElevation = /**
     * Sets the menu panel elevation.
     * @param {?} depth Number of parent menus that come before the menu.
     * @return {?}
     */
    function (depth) {
        // The elevation starts at the base and increases by one for each level.
        var /** @type {?} */ newElevation = "mat-elevation-z" + (MAT_MENU_BASE_ELEVATION + depth);
        var /** @type {?} */ customElevation = Object.keys(this._classList).find(function (c) { return c.startsWith('mat-elevation-z'); });
        if (!customElevation || customElevation === this._previousElevation) {
            if (this._previousElevation) {
                this._classList[this._previousElevation] = false;
            }
            this._classList[newElevation] = true;
            this._previousElevation = newElevation;
        }
    };
    /** Starts the enter animation. */
    /**
     * Starts the enter animation.
     * @return {?}
     */
    MatMenu.prototype._startAnimation = /**
     * Starts the enter animation.
     * @return {?}
     */
    function () {
        this._panelAnimationState = 'enter-start';
    };
    /** Resets the panel animation to its initial state. */
    /**
     * Resets the panel animation to its initial state.
     * @return {?}
     */
    MatMenu.prototype._resetAnimation = /**
     * Resets the panel animation to its initial state.
     * @return {?}
     */
    function () {
        this._panelAnimationState = 'void';
    };
    /** Callback that is invoked when the panel animation completes. */
    /**
     * Callback that is invoked when the panel animation completes.
     * @param {?} event
     * @return {?}
     */
    MatMenu.prototype._onAnimationDone = /**
     * Callback that is invoked when the panel animation completes.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // After the initial expansion is done, trigger the second phase of the enter animation.
        if (event.toState === 'enter-start') {
            this._panelAnimationState = 'enter';
        }
    };
    return MatMenu;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Injection token that determines the scroll handling while the menu is open.
 */
var MAT_MENU_SCROLL_STRATEGY = new _angular_core.InjectionToken('mat-menu-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MAT_MENU_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.reposition(); };
}
/**
 * \@docs-private
 */
var MAT_MENU_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_MENU_SCROLL_STRATEGY,
    deps: [_angular_cdk_overlay.Overlay],
    useFactory: MAT_MENU_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Default top padding of the menu panel.
 */
var MENU_PANEL_TOP_PADDING = 8;
/**
 * This directive is intended to be used in conjunction with an mat-menu tag.  It is
 * responsible for toggling the display of the provided menu instance.
 */
var MatMenuTrigger = /** @class */ (function () {
    function MatMenuTrigger(_overlay, _element, _viewContainerRef, _scrollStrategy, _parentMenu, _menuItemInstance, _dir) {
        this._overlay = _overlay;
        this._element = _element;
        this._viewContainerRef = _viewContainerRef;
        this._scrollStrategy = _scrollStrategy;
        this._parentMenu = _parentMenu;
        this._menuItemInstance = _menuItemInstance;
        this._dir = _dir;
        if (_menuItemInstance) {
            _menuItemInstance._triggersSubmenu = this.triggersSubmenu();
        }
    }
    Object.defineProperty(MatMenuTrigger.prototype, "_deprecatedMatMenuTriggerFor", {
        get: /**
         * @deprecated
         * @return {?}
         */
        function () {
            return this.menu;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this.menu = v;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatMenuTrigger.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._checkMenu();
        this.menu.close.subscribe(function (reason) {
            _this._destroyMenu();
            // If a click closed the menu, we should close the entire chain of nested menus.
            if (reason === 'click' && _this._parentMenu) {
                _this._parentMenu.closed.emit(reason);
            }
        });
        if (this.triggersSubmenu()) {
            // Subscribe to changes in the hovered item in order to toggle the panel.
            this._hoverSubscription = this._parentMenu._hovered()
                .pipe(rxjs_operators_filter.filter(function (active) { return active === _this._menuItemInstance; }))
                .subscribe(function () {
                _this._openedByMouse = true;
                _this.openMenu();
            });
        }
    };
    /**
     * @return {?}
     */
    MatMenuTrigger.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
        this._cleanUpSubscriptions();
    };
    Object.defineProperty(MatMenuTrigger.prototype, "menuOpen", {
        /** Whether the menu is open. */
        get: /**
         * Whether the menu is open.
         * @return {?}
         */
        function () {
            return this._menuOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatMenuTrigger.prototype, "dir", {
        /** The text direction of the containing app. */
        get: /**
         * The text direction of the containing app.
         * @return {?}
         */
        function () {
            return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
        },
        enumerable: true,
        configurable: true
    });
    /** Whether the menu triggers a sub-menu or a top-level one. */
    /**
     * Whether the menu triggers a sub-menu or a top-level one.
     * @return {?}
     */
    MatMenuTrigger.prototype.triggersSubmenu = /**
     * Whether the menu triggers a sub-menu or a top-level one.
     * @return {?}
     */
    function () {
        return !!(this._menuItemInstance && this._parentMenu);
    };
    /** Toggles the menu between the open and closed states. */
    /**
     * Toggles the menu between the open and closed states.
     * @return {?}
     */
    MatMenuTrigger.prototype.toggleMenu = /**
     * Toggles the menu between the open and closed states.
     * @return {?}
     */
    function () {
        return this._menuOpen ? this.closeMenu() : this.openMenu();
    };
    /** Opens the menu. */
    /**
     * Opens the menu.
     * @return {?}
     */
    MatMenuTrigger.prototype.openMenu = /**
     * Opens the menu.
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this._menuOpen) {
            this._createOverlay().attach(this._portal);
            this._closeSubscription = this._menuClosingActions().subscribe(function () {
                _this.menu.close.emit();
            });
            this._initMenu();
            if (this.menu instanceof MatMenu) {
                this.menu._startAnimation();
            }
        }
    };
    /** Closes the menu. */
    /**
     * Closes the menu.
     * @return {?}
     */
    MatMenuTrigger.prototype.closeMenu = /**
     * Closes the menu.
     * @return {?}
     */
    function () {
        this.menu.close.emit();
    };
    /** Focuses the menu trigger. */
    /**
     * Focuses the menu trigger.
     * @return {?}
     */
    MatMenuTrigger.prototype.focus = /**
     * Focuses the menu trigger.
     * @return {?}
     */
    function () {
        this._element.nativeElement.focus();
    };
    /**
     * Closes the menu and does the necessary cleanup.
     * @return {?}
     */
    MatMenuTrigger.prototype._destroyMenu = /**
     * Closes the menu and does the necessary cleanup.
     * @return {?}
     */
    function () {
        if (this._overlayRef && this.menuOpen) {
            this._resetMenu();
            this._overlayRef.detach();
            this._closeSubscription.unsubscribe();
            if (this.menu instanceof MatMenu) {
                this.menu._resetAnimation();
            }
        }
    };
    /**
     * This method sets the menu state to open and focuses the first item if
     * the menu was opened via the keyboard.
     * @return {?}
     */
    MatMenuTrigger.prototype._initMenu = /**
     * This method sets the menu state to open and focuses the first item if
     * the menu was opened via the keyboard.
     * @return {?}
     */
    function () {
        this.menu.parentMenu = this.triggersSubmenu() ? this._parentMenu : undefined;
        this.menu.direction = this.dir;
        this._setMenuElevation();
        this._setIsMenuOpen(true);
        // If the menu was opened by mouse, we focus the root node, which allows for the keyboard
        // interactions to work. Otherwise, if the menu was opened by keyboard, we focus the first item.
        if (this._openedByMouse) {
            var /** @type {?} */ rootNode = /** @type {?} */ (((this._overlayRef)).overlayElement.firstElementChild);
            if (rootNode) {
                this.menu.resetActiveItem();
                rootNode.focus();
            }
        }
        else {
            this.menu.focusFirstItem();
        }
    };
    /**
     * Updates the menu elevation based on the amount of parent menus that it has.
     * @return {?}
     */
    MatMenuTrigger.prototype._setMenuElevation = /**
     * Updates the menu elevation based on the amount of parent menus that it has.
     * @return {?}
     */
    function () {
        if (this.menu.setElevation) {
            var /** @type {?} */ depth = 0;
            var /** @type {?} */ parentMenu = this.menu.parentMenu;
            while (parentMenu) {
                depth++;
                parentMenu = parentMenu.parentMenu;
            }
            this.menu.setElevation(depth);
        }
    };
    /**
     * This method resets the menu when it's closed, most importantly restoring
     * focus to the menu trigger if the menu was opened via the keyboard.
     * @return {?}
     */
    MatMenuTrigger.prototype._resetMenu = /**
     * This method resets the menu when it's closed, most importantly restoring
     * focus to the menu trigger if the menu was opened via the keyboard.
     * @return {?}
     */
    function () {
        this._setIsMenuOpen(false);
        // Focus only needs to be reset to the host element if the menu was opened
        // by the keyboard and manually shifted to the first menu item.
        if (!this._openedByMouse) {
            this.focus();
        }
        this._openedByMouse = false;
    };
    /**
     * @param {?} isOpen
     * @return {?}
     */
    MatMenuTrigger.prototype._setIsMenuOpen = /**
     * @param {?} isOpen
     * @return {?}
     */
    function (isOpen) {
        this._menuOpen = isOpen;
        this._menuOpen ? this.menuOpened.emit() : this.menuClosed.emit();
        if (this.triggersSubmenu()) {
            this._menuItemInstance._highlighted = isOpen;
        }
    };
    /**
     * This method checks that a valid instance of MatMenu has been passed into
     * matMenuTriggerFor. If not, an exception is thrown.
     * @return {?}
     */
    MatMenuTrigger.prototype._checkMenu = /**
     * This method checks that a valid instance of MatMenu has been passed into
     * matMenuTriggerFor. If not, an exception is thrown.
     * @return {?}
     */
    function () {
        if (!this.menu) {
            throwMatMenuMissingError();
        }
    };
    /**
     * This method creates the overlay from the provided menu's template and saves its
     * OverlayRef so that it can be attached to the DOM when openMenu is called.
     * @return {?}
     */
    MatMenuTrigger.prototype._createOverlay = /**
     * This method creates the overlay from the provided menu's template and saves its
     * OverlayRef so that it can be attached to the DOM when openMenu is called.
     * @return {?}
     */
    function () {
        if (!this._overlayRef) {
            this._portal = new _angular_cdk_portal.TemplatePortal(this.menu.templateRef, this._viewContainerRef);
            var /** @type {?} */ config = this._getOverlayConfig();
            this._subscribeToPositions(/** @type {?} */ (config.positionStrategy));
            this._overlayRef = this._overlay.create(config);
        }
        return this._overlayRef;
    };
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @return {?} OverlayConfig
     */
    MatMenuTrigger.prototype._getOverlayConfig = /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @return {?} OverlayConfig
     */
    function () {
        return new _angular_cdk_overlay.OverlayConfig({
            positionStrategy: this._getPosition(),
            hasBackdrop: !this.triggersSubmenu(),
            backdropClass: 'cdk-overlay-transparent-backdrop',
            direction: this.dir,
            scrollStrategy: this._scrollStrategy()
        });
    };
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the menu based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     * @param {?} position
     * @return {?}
     */
    MatMenuTrigger.prototype._subscribeToPositions = /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the menu based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     * @param {?} position
     * @return {?}
     */
    function (position) {
        var _this = this;
        this._positionSubscription = position.onPositionChange.subscribe(function (change) {
            var /** @type {?} */ posX = change.connectionPair.overlayX === 'start' ? 'after' : 'before';
            var /** @type {?} */ posY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';
            _this.menu.setPositionClasses(posX, posY);
        });
    };
    /**
     * This method builds the position strategy for the overlay, so the menu is properly connected
     * to the trigger.
     * @return {?} ConnectedPositionStrategy
     */
    MatMenuTrigger.prototype._getPosition = /**
     * This method builds the position strategy for the overlay, so the menu is properly connected
     * to the trigger.
     * @return {?} ConnectedPositionStrategy
     */
    function () {
        var _a = this.menu.xPosition === 'before' ? ['end', 'start'] : ['start', 'end'], originX = _a[0], originFallbackX = _a[1];
        var _b = this.menu.yPosition === 'above' ? ['bottom', 'top'] : ['top', 'bottom'], overlayY = _b[0], overlayFallbackY = _b[1];
        var _c = [overlayY, overlayFallbackY], originY = _c[0], originFallbackY = _c[1];
        var _d = [originX, originFallbackX], overlayX = _d[0], overlayFallbackX = _d[1];
        var /** @type {?} */ offsetY = 0;
        if (this.triggersSubmenu()) {
            // When the menu is a sub-menu, it should always align itself
            // to the edges of the trigger, instead of overlapping it.
            overlayFallbackX = originX = this.menu.xPosition === 'before' ? 'start' : 'end';
            originFallbackX = overlayX = originX === 'end' ? 'start' : 'end';
            offsetY = overlayY === 'bottom' ? MENU_PANEL_TOP_PADDING : -MENU_PANEL_TOP_PADDING;
        }
        else if (!this.menu.overlapTrigger) {
            originY = overlayY === 'top' ? 'bottom' : 'top';
            originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
        }
        return this._overlay.position()
            .connectedTo(this._element, { originX: originX, originY: originY }, { overlayX: overlayX, overlayY: overlayY })
            .withDirection(this.dir)
            .withOffsetY(offsetY)
            .withFallbackPosition({ originX: originFallbackX, originY: originY }, { overlayX: overlayFallbackX, overlayY: overlayY })
            .withFallbackPosition({ originX: originX, originY: originFallbackY }, { overlayX: overlayX, overlayY: overlayFallbackY }, undefined, -offsetY)
            .withFallbackPosition({ originX: originFallbackX, originY: originFallbackY }, { overlayX: overlayFallbackX, overlayY: overlayFallbackY }, undefined, -offsetY);
    };
    /**
     * Cleans up the active subscriptions.
     * @return {?}
     */
    MatMenuTrigger.prototype._cleanUpSubscriptions = /**
     * Cleans up the active subscriptions.
     * @return {?}
     */
    function () {
        this._closeSubscription.unsubscribe();
        this._positionSubscription.unsubscribe();
        this._hoverSubscription.unsubscribe();
    };
    /**
     * Returns a stream that emits whenever an action that should close the menu occurs.
     * @return {?}
     */
    MatMenuTrigger.prototype._menuClosingActions = /**
     * Returns a stream that emits whenever an action that should close the menu occurs.
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ backdrop = /** @type {?} */ ((this._overlayRef)).backdropClick();
        var /** @type {?} */ parentClose = this._parentMenu ? this._parentMenu.close : rxjs_observable_of.of();
        var /** @type {?} */ hover = this._parentMenu ? this._parentMenu._hovered().pipe(rxjs_operators_filter.filter(function (active) { return active !== _this._menuItemInstance; }), rxjs_operators_filter.filter(function () { return _this._menuOpen; })) : rxjs_observable_of.of();
        return rxjs_observable_merge.merge(backdrop, parentClose, hover);
    };
    /** Handles mouse presses on the trigger. */
    /**
     * Handles mouse presses on the trigger.
     * @param {?} event
     * @return {?}
     */
    MatMenuTrigger.prototype._handleMousedown = /**
     * Handles mouse presses on the trigger.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (!_angular_cdk_a11y.isFakeMousedownFromScreenReader(event)) {
            this._openedByMouse = true;
            // Since clicking on the trigger won't close the menu if it opens a sub-menu,
            // we should prevent focus from moving onto it via click to avoid the
            // highlight from lingering on the menu item.
            if (this.triggersSubmenu()) {
                event.preventDefault();
            }
        }
    };
    /** Handles key presses on the trigger. */
    /**
     * Handles key presses on the trigger.
     * @param {?} event
     * @return {?}
     */
    MatMenuTrigger.prototype._handleKeydown = /**
     * Handles key presses on the trigger.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var /** @type {?} */ keyCode = event.keyCode;
        if (this.triggersSubmenu() && ((keyCode === _angular_cdk_keycodes.RIGHT_ARROW && this.dir === 'ltr') ||
            (keyCode === _angular_cdk_keycodes.LEFT_ARROW && this.dir === 'rtl'))) {
            this.openMenu();
        }
    };
    /** Handles click events on the trigger. */
    /**
     * Handles click events on the trigger.
     * @param {?} event
     * @return {?}
     */
    MatMenuTrigger.prototype._handleClick = /**
     * Handles click events on the trigger.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.triggersSubmenu()) {
            // Stop event propagation to avoid closing the parent menu.
            event.stopPropagation();
            this.openMenu();
        }
        else {
            this.toggleMenu();
        }
    };
    return MatMenuTrigger;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatMenuModule = /** @class */ (function () {
    function MatMenuModule() {
    }
    return MatMenuModule;
}());

exports.MAT_MENU_SCROLL_STRATEGY = MAT_MENU_SCROLL_STRATEGY;
exports.fadeInItems = fadeInItems;
exports.transformMenu = transformMenu;
exports.MatMenuModule = MatMenuModule;
exports.MatMenu = MatMenu;
exports.MAT_MENU_DEFAULT_OPTIONS = MAT_MENU_DEFAULT_OPTIONS;
exports.MatMenuItem = MatMenuItem;
exports.MatMenuTrigger = MatMenuTrigger;
exports.ɵa21 = MatMenuItemBase;
exports.ɵb21 = _MatMenuItemMixinBase;
exports.ɵd21 = MAT_MENU_SCROLL_STRATEGY_PROVIDER;
exports.ɵc21 = MAT_MENU_SCROLL_STRATEGY_PROVIDER_FACTORY;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-menu.umd.js.map
