console.log('Using UMD format');

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/cdk'), require('@angular/platform-browser'), require('@angular/common'), require('rxjs/Subject'), require('rxjs/Subscription'), require('rxjs/observable/fromEvent'), require('rxjs/observable/merge'), require('rxjs/observable/of'), require('@angular/forms'), require('@angular/animations'), require('@angular/http'), require('rxjs/Observable'), require('rxjs/observable/throw'), require('rxjs/observable/forkJoin')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/cdk', '@angular/platform-browser', '@angular/common', 'rxjs/Subject', 'rxjs/Subscription', 'rxjs/observable/fromEvent', 'rxjs/observable/merge', 'rxjs/observable/of', '@angular/forms', '@angular/animations', '@angular/http', 'rxjs/Observable', 'rxjs/observable/throw', 'rxjs/observable/forkJoin'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}),global.ng.core,global.ng.cdk,global.ng.platformBrowser,global.ng.common,global.Rx,global.Rx,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable,global.ng.forms,global.ng.animations,global.ng.http,global.Rx,global.Rx.Observable,global.Rx.Observable));
}(this, (function (exports,_angular_core,_angular_cdk,_angular_platformBrowser,_angular_common,rxjs_Subject,rxjs_Subscription,rxjs_observable_fromEvent,rxjs_observable_merge,rxjs_observable_of,_angular_forms,_angular_animations,_angular_http,rxjs_Observable,rxjs_observable_throw,rxjs_observable_forkJoin) { 'use strict';

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

var MATERIAL_COMPATIBILITY_MODE = new _angular_core.InjectionToken('md-compatibility-mode');
/**
 * Returns an exception to be thrown if the consumer has used
 * an invalid Material prefix on a component.
 * \@docs-private
 * @param {?} prefix
 * @param {?} nodeName
 * @return {?}
 */
function getMdCompatibilityInvalidPrefixError(prefix, nodeName) {
    return Error("The \"" + prefix + "-\" prefix cannot be used in ng-material v1 compatibility mode. " +
        ("It was used on an \"" + nodeName.toLowerCase() + "\" element."));
}
/**
 * Selector that matches all elements that may have style collisions with AngularJS Material.
 */
var MAT_ELEMENTS_SELECTOR = "\n  [mat-button],\n  [mat-fab],\n  [mat-icon-button],\n  [mat-mini-fab],\n  [mat-raised-button],\n  [matCardSubtitle],\n  [matCardTitle],\n  [matDialogActions],\n  [matDialogClose],\n  [matDialogContent],\n  [matDialogTitle],\n  [matLine],\n  [matTabLabel],\n  [matTabLink],\n  [matTabNav],\n  [matTooltip],\n  mat-autocomplete,\n  mat-button-toggle,\n  mat-button-toggle,\n  mat-button-toggle-group,\n  mat-card,\n  mat-card-actions,\n  mat-card-content,\n  mat-card-footer,\n  mat-card-header,\n  mat-card-subtitle,\n  mat-card-title,\n  mat-card-title-group,\n  mat-cell,\n  mat-checkbox,\n  mat-chip,\n  mat-dialog-actions,\n  mat-dialog-container,\n  mat-dialog-content,\n  mat-divider,\n  mat-error,\n  mat-grid-list,\n  mat-grid-tile,\n  mat-grid-tile-footer,\n  mat-grid-tile-header,\n  mat-header-cell,\n  mat-hint,\n  mat-icon,\n  mat-list,\n  mat-list-item,\n  mat-menu,\n  mat-nav-list,\n  mat-option,\n  mat-placeholder,\n  mat-progress-bar,\n  mat-pseudo-checkbox,\n  mat-radio-button,\n  mat-radio-group,\n  mat-row,\n  mat-select,\n  mat-sidenav,\n  mat-sidenav-container,\n  mat-slider,\n  mat-spinner,\n  mat-tab,\n  mat-table,\n  mat-tab-group,\n  mat-toolbar";
/**
 * Selector that matches all elements that may have style collisions with AngularJS Material.
 */
var MD_ELEMENTS_SELECTOR = "\n  [md-button],\n  [md-fab],\n  [md-icon-button],\n  [md-mini-fab],\n  [md-raised-button],\n  [mdCardSubtitle],\n  [mdCardTitle],\n  [mdDialogActions],\n  [mdDialogClose],\n  [mdDialogContent],\n  [mdDialogTitle],\n  [mdLine],\n  [mdTabLabel],\n  [mdTabLink],\n  [mdTabNav],\n  [mdTooltip],\n  md-autocomplete,\n  md-button-toggle,\n  md-button-toggle,\n  md-button-toggle-group,\n  md-card,\n  md-card-actions,\n  md-card-content,\n  md-card-footer,\n  md-card-header,\n  md-card-subtitle,\n  md-card-title,\n  md-card-title-group,\n  md-cell,\n  md-checkbox,\n  md-chip,\n  md-dialog-actions,\n  md-dialog-container,\n  md-dialog-content,\n  md-divider,\n  md-error,\n  md-grid-list,\n  md-grid-tile,\n  md-grid-tile-footer,\n  md-grid-tile-header,\n  md-header-cell,\n  md-hint,\n  md-icon,\n  md-list,\n  md-list-item,\n  md-menu,\n  md-nav-list,\n  md-option,\n  md-placeholder,\n  md-progress-bar,\n  md-pseudo-checkbox,\n  md-radio-button,\n  md-radio-group,\n  md-row,\n  md-select,\n  md-sidenav,\n  md-sidenav-container,\n  md-slider,\n  md-spinner,\n  md-tab,\n  md-table,\n  md-tab-group,\n  md-toolbar";
/**
 * Directive that enforces that the `mat-` prefix cannot be used.
 */
var MatPrefixRejector = (function () {
    /**
     * @param {?} isCompatibilityMode
     * @param {?} elementRef
     */
    function MatPrefixRejector(isCompatibilityMode, elementRef) {
        if (!isCompatibilityMode) {
            throw getMdCompatibilityInvalidPrefixError('mat', elementRef.nativeElement.nodeName);
        }
    }
    return MatPrefixRejector;
}());
MatPrefixRejector.decorators = [
    { type: _angular_core.Directive, args: [{ selector: MAT_ELEMENTS_SELECTOR },] },
];
/**
 * @nocollapse
 */
MatPrefixRejector.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MATERIAL_COMPATIBILITY_MODE,] },] },
    { type: _angular_core.ElementRef, },
]; };
/**
 * Directive that enforces that the `md-` prefix cannot be used.
 */
var MdPrefixRejector = (function () {
    /**
     * @param {?} isCompatibilityMode
     * @param {?} elementRef
     */
    function MdPrefixRejector(isCompatibilityMode, elementRef) {
        if (isCompatibilityMode) {
            throw getMdCompatibilityInvalidPrefixError('md', elementRef.nativeElement.nodeName);
        }
    }
    return MdPrefixRejector;
}());
MdPrefixRejector.decorators = [
    { type: _angular_core.Directive, args: [{ selector: MD_ELEMENTS_SELECTOR },] },
];
/**
 * @nocollapse
 */
MdPrefixRejector.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MATERIAL_COMPATIBILITY_MODE,] },] },
    { type: _angular_core.ElementRef, },
]; };
/**
 * Module that enforces the default compatibility mode settings. When this module is loaded
 * without NoConflictStyleCompatibilityMode also being imported, it will throw an error if
 * there are any uses of the `mat-` prefix.
 */
var CompatibilityModule = (function () {
    function CompatibilityModule() {
    }
    return CompatibilityModule;
}());
CompatibilityModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                declarations: [MatPrefixRejector, MdPrefixRejector],
                exports: [MatPrefixRejector, MdPrefixRejector],
            },] },
];
/**
 * @nocollapse
 */
CompatibilityModule.ctorParameters = function () { return []; };
/**
 * Module that enforces "no-conflict" compatibility mode settings. When this module is loaded,
 * it will throw an error if there are any uses of the `md-` prefix.
 */
var NoConflictStyleCompatibilityMode = (function () {
    function NoConflictStyleCompatibilityMode() {
    }
    return NoConflictStyleCompatibilityMode;
}());
NoConflictStyleCompatibilityMode.decorators = [
    { type: _angular_core.NgModule, args: [{
                providers: [{
                        provide: MATERIAL_COMPATIBILITY_MODE, useValue: true,
                    }],
            },] },
];
/**
 * @nocollapse
 */
NoConflictStyleCompatibilityMode.ctorParameters = function () { return []; };
/**
 * Injection token that configures whether the Material sanity checks are enabled.
 */
var MATERIAL_SANITY_CHECKS = new _angular_core.InjectionToken('md-sanity-checks');
/**
 * Module that captures anything that should be loaded and/or run for *all* Angular Material
 * components. This includes Bidi, compatibility mode, etc.
 *
 * This module should be imported to each top-level component module (e.g., MdTabsModule).
 */
var MdCommonModule = (function () {
    /**
     * @param {?} _document
     * @param {?} _sanityChecksEnabled
     */
    function MdCommonModule(_document, _sanityChecksEnabled) {
        this._document = _document;
        /**
         * Whether we've done the global sanity checks (e.g. a theme is loaded, there is a doctype).
         */
        this._hasDoneGlobalChecks = false;
        if (_sanityChecksEnabled && !this._hasDoneGlobalChecks && _document && _angular_core.isDevMode()) {
            this._checkDoctype();
            this._checkTheme();
            this._hasDoneGlobalChecks = true;
        }
    }
    /**
     * @return {?}
     */
    MdCommonModule.prototype._checkDoctype = function () {
        if (!this._document.doctype) {
            console.warn('Current document does not have a doctype. This may cause ' +
                'some Angular Material components not to behave as expected.');
        }
    };
    /**
     * @return {?}
     */
    MdCommonModule.prototype._checkTheme = function () {
        if (typeof getComputedStyle === 'function') {
            var /** @type {?} */ testElement = this._document.createElement('div');
            testElement.classList.add('mat-theme-loaded-marker');
            this._document.body.appendChild(testElement);
            if (getComputedStyle(testElement).display !== 'none') {
                console.warn('Could not find Angular Material core theme. Most Material ' +
                    'components may not work as expected. For more info refer ' +
                    'to the theming guide: https://material.angular.io/guide/theming');
            }
            this._document.body.removeChild(testElement);
        }
    };
    return MdCommonModule;
}());
MdCommonModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [CompatibilityModule, _angular_cdk.BidiModule],
                exports: [CompatibilityModule, _angular_cdk.BidiModule],
                providers: [{
                        provide: MATERIAL_SANITY_CHECKS, useValue: true,
                    }],
            },] },
];
/**
 * @nocollapse
 */
MdCommonModule.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_platformBrowser.DOCUMENT,] },] },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MATERIAL_SANITY_CHECKS,] },] },
]; };
/**
 * Shared directive to count lines inside a text area, such as a list item.
 * Line elements can be extracted with a \@ContentChildren(MdLine) query, then
 * counted by checking the query list's length.
 */
var MdLine = (function () {
    function MdLine() {
    }
    return MdLine;
}());
MdLine.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-line], [mat-line], [mdLine], [matLine]',
                host: { 'class': 'mat-line' }
            },] },
];
/**
 * @nocollapse
 */
MdLine.ctorParameters = function () { return []; };
/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 * \@docs-private
 */
var MdLineSetter = (function () {
    /**
     * @param {?} _lines
     * @param {?} _renderer
     * @param {?} _element
     */
    function MdLineSetter(_lines, _renderer, _element) {
        var _this = this;
        this._lines = _lines;
        this._renderer = _renderer;
        this._element = _element;
        this._setLineClass(this._lines.length);
        this._lines.changes.subscribe(function () {
            _this._setLineClass(_this._lines.length);
        });
    }
    /**
     * @param {?} count
     * @return {?}
     */
    MdLineSetter.prototype._setLineClass = function (count) {
        this._resetClasses();
        if (count === 2 || count === 3) {
            this._setClass("mat-" + count + "-line", true);
        }
        else if (count > 3) {
            this._setClass("mat-multi-line", true);
        }
    };
    /**
     * @return {?}
     */
    MdLineSetter.prototype._resetClasses = function () {
        this._setClass('mat-2-line', false);
        this._setClass('mat-3-line', false);
        this._setClass('mat-multi-line', false);
    };
    /**
     * @param {?} className
     * @param {?} isAdd
     * @return {?}
     */
    MdLineSetter.prototype._setClass = function (className, isAdd) {
        if (isAdd) {
            this._renderer.addClass(this._element.nativeElement, className);
        }
        else {
            this._renderer.removeClass(this._element.nativeElement, className);
        }
    };
    return MdLineSetter;
}());
var MdLineModule = (function () {
    function MdLineModule() {
    }
    return MdLineModule;
}());
MdLineModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [MdCommonModule],
                exports: [MdLine, MdCommonModule],
                declarations: [MdLine],
            },] },
];
/**
 * @nocollapse
 */
MdLineModule.ctorParameters = function () { return []; };
var RippleState = {};
RippleState.FADING_IN = 0;
RippleState.VISIBLE = 1;
RippleState.FADING_OUT = 2;
RippleState.HIDDEN = 3;
RippleState[RippleState.FADING_IN] = "FADING_IN";
RippleState[RippleState.VISIBLE] = "VISIBLE";
RippleState[RippleState.FADING_OUT] = "FADING_OUT";
RippleState[RippleState.HIDDEN] = "HIDDEN";
/**
 * Reference to a previously launched ripple element.
 */
var RippleRef = (function () {
    /**
     * @param {?} _renderer
     * @param {?} element
     * @param {?} config
     */
    function RippleRef(_renderer, element, config) {
        this._renderer = _renderer;
        this.element = element;
        this.config = config;
        /**
         * Current state of the ripple reference.
         */
        this.state = RippleState.HIDDEN;
    }
    /**
     * Fades out the ripple element.
     * @return {?}
     */
    RippleRef.prototype.fadeOut = function () {
        this._renderer.fadeOutRipple(this);
    };
    return RippleRef;
}());
/**
 * Fade-in duration for the ripples. Can be modified with the speedFactor option.
 */
var RIPPLE_FADE_IN_DURATION = 450;
/**
 * Fade-out duration for the ripples in milliseconds. This can't be modified by the speedFactor.
 */
var RIPPLE_FADE_OUT_DURATION = 400;
/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple directive's host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 * This will eventually become a custom renderer once Angular support exists.
 * \@docs-private
 */
var RippleRenderer = (function () {
    /**
     * @param {?} elementRef
     * @param {?} _ngZone
     * @param {?} _ruler
     * @param {?} platform
     */
    function RippleRenderer(elementRef, _ngZone, _ruler, platform) {
        this._ngZone = _ngZone;
        this._ruler = _ruler;
        /**
         * Whether the mouse is currently down or not.
         */
        this._isMousedown = false;
        /**
         * Events to be registered on the trigger element.
         */
        this._triggerEvents = new Map();
        /**
         * Set of currently active ripple references.
         */
        this._activeRipples = new Set();
        /**
         * Ripple config for all ripples created by events.
         */
        this.rippleConfig = {};
        /**
         * Whether mouse ripples should be created or not.
         */
        this.rippleDisabled = false;
        // Only do anything if we're on the browser.
        if (platform.isBrowser) {
            this._containerElement = elementRef.nativeElement;
            // Specify events which need to be registered on the trigger.
            this._triggerEvents.set('mousedown', this.onMousedown.bind(this));
            this._triggerEvents.set('mouseup', this.onMouseup.bind(this));
            this._triggerEvents.set('mouseleave', this.onMouseLeave.bind(this));
            // By default use the host element as trigger element.
            this.setTriggerElement(this._containerElement);
        }
    }
    /**
     * Fades in a ripple at the given coordinates.
     * @param {?} pageX
     * @param {?} pageY
     * @param {?=} config
     * @return {?}
     */
    RippleRenderer.prototype.fadeInRipple = function (pageX, pageY, config) {
        var _this = this;
        if (config === void 0) { config = {}; }
        var /** @type {?} */ containerRect = this._containerElement.getBoundingClientRect();
        if (config.centered) {
            pageX = containerRect.left + containerRect.width / 2;
            pageY = containerRect.top + containerRect.height / 2;
        }
        else {
            // Subtract scroll values from the coordinates because calculations below
            // are always relative to the viewport rectangle.
            var /** @type {?} */ scrollPosition = this._ruler.getViewportScrollPosition();
            pageX -= scrollPosition.left;
            pageY -= scrollPosition.top;
        }
        var /** @type {?} */ radius = config.radius || distanceToFurthestCorner(pageX, pageY, containerRect);
        var /** @type {?} */ duration = RIPPLE_FADE_IN_DURATION * (1 / (config.speedFactor || 1));
        var /** @type {?} */ offsetX = pageX - containerRect.left;
        var /** @type {?} */ offsetY = pageY - containerRect.top;
        var /** @type {?} */ ripple = document.createElement('div');
        ripple.classList.add('mat-ripple-element');
        ripple.style.left = offsetX - radius + "px";
        ripple.style.top = offsetY - radius + "px";
        ripple.style.height = radius * 2 + "px";
        ripple.style.width = radius * 2 + "px";
        // If the color is not set, the default CSS color will be used.
        ripple.style.backgroundColor = config.color || null;
        ripple.style.transitionDuration = duration + "ms";
        this._containerElement.appendChild(ripple);
        // By default the browser does not recalculate the styles of dynamically created
        // ripple elements. This is critical because then the `scale` would not animate properly.
        enforceStyleRecalculation(ripple);
        ripple.style.transform = 'scale(1)';
        // Exposed reference to the ripple that will be returned.
        var /** @type {?} */ rippleRef = new RippleRef(this, ripple, config);
        rippleRef.state = RippleState.FADING_IN;
        // Add the ripple reference to the list of all active ripples.
        this._activeRipples.add(rippleRef);
        // Wait for the ripple element to be completely faded in.
        // Once it's faded in, the ripple can be hidden immediately if the mouse is released.
        this.runTimeoutOutsideZone(function () {
            rippleRef.state = RippleState.VISIBLE;
            if (!config.persistent && !_this._isMousedown) {
                rippleRef.fadeOut();
            }
        }, duration);
        return rippleRef;
    };
    /**
     * Fades out a ripple reference.
     * @param {?} rippleRef
     * @return {?}
     */
    RippleRenderer.prototype.fadeOutRipple = function (rippleRef) {
        // For ripples that are not active anymore, don't re-un the fade-out animation.
        if (!this._activeRipples.delete(rippleRef)) {
            return;
        }
        var /** @type {?} */ rippleEl = rippleRef.element;
        rippleEl.style.transitionDuration = RIPPLE_FADE_OUT_DURATION + "ms";
        rippleEl.style.opacity = '0';
        rippleRef.state = RippleState.FADING_OUT;
        // Once the ripple faded out, the ripple can be safely removed from the DOM.
        this.runTimeoutOutsideZone(function () {
            rippleRef.state = RippleState.HIDDEN; /** @type {?} */
            ((rippleEl.parentNode)).removeChild(rippleEl);
        }, RIPPLE_FADE_OUT_DURATION);
    };
    /**
     * Fades out all currently active ripples.
     * @return {?}
     */
    RippleRenderer.prototype.fadeOutAll = function () {
        this._activeRipples.forEach(function (ripple) { return ripple.fadeOut(); });
    };
    /**
     * Sets the trigger element and registers the mouse events.
     * @param {?} element
     * @return {?}
     */
    RippleRenderer.prototype.setTriggerElement = function (element) {
        var _this = this;
        // Remove all previously register event listeners from the trigger element.
        if (this._triggerElement) {
            this._triggerEvents.forEach(function (fn, type) {
                ((_this._triggerElement)).removeEventListener(type, fn);
            });
        }
        if (element) {
            // If the element is not null, register all event listeners on the trigger element.
            this._ngZone.runOutsideAngular(function () {
                _this._triggerEvents.forEach(function (fn, type) { return element.addEventListener(type, fn); });
            });
        }
        this._triggerElement = element;
    };
    /**
     * Listener being called on mousedown event.
     * @param {?} event
     * @return {?}
     */
    RippleRenderer.prototype.onMousedown = function (event) {
        if (!this.rippleDisabled) {
            this._isMousedown = true;
            this.fadeInRipple(event.pageX, event.pageY, this.rippleConfig);
        }
    };
    /**
     * Listener being called on mouseup event.
     * @return {?}
     */
    RippleRenderer.prototype.onMouseup = function () {
        this._isMousedown = false;
        // Fade-out all ripples that are completely visible and not persistent.
        this._activeRipples.forEach(function (ripple) {
            if (!ripple.config.persistent && ripple.state === RippleState.VISIBLE) {
                ripple.fadeOut();
            }
        });
    };
    /**
     * Listener being called on mouseleave event.
     * @return {?}
     */
    RippleRenderer.prototype.onMouseLeave = function () {
        if (this._isMousedown) {
            this.onMouseup();
        }
    };
    /**
     * Runs a timeout outside of the Angular zone to avoid triggering the change detection.
     * @param {?} fn
     * @param {?=} delay
     * @return {?}
     */
    RippleRenderer.prototype.runTimeoutOutsideZone = function (fn, delay) {
        if (delay === void 0) { delay = 0; }
        this._ngZone.runOutsideAngular(function () { return setTimeout(fn, delay); });
    };
    return RippleRenderer;
}());
/**
 * @param {?} element
 * @return {?}
 */
function enforceStyleRecalculation(element) {
    // Enforce a style recalculation by calling `getComputedStyle` and accessing any property.
    // Calling `getPropertyValue` is important to let optimizers know that this is not a noop.
    // See: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
    window.getComputedStyle(element).getPropertyValue('opacity');
}
/**
 * Returns the distance from the point (x, y) to the furthest corner of a rectangle.
 * @param {?} x
 * @param {?} y
 * @param {?} rect
 * @return {?}
 */
function distanceToFurthestCorner(x, y, rect) {
    var /** @type {?} */ distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    var /** @type {?} */ distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
}
/**
 * Time in ms to throttle the scrolling events by default.
 */
var DEFAULT_SCROLL_TIME = 20;
/**
 * Service contained all registered Scrollable references and emits an event when any one of the
 * Scrollable references emit a scrolled event.
 */
var ScrollDispatcher = (function () {
    /**
     * @param {?} _ngZone
     * @param {?} _platform
     */
    function ScrollDispatcher(_ngZone, _platform) {
        this._ngZone = _ngZone;
        this._platform = _platform;
        /**
         * Subject for notifying that a registered scrollable reference element has been scrolled.
         */
        this._scrolled = new rxjs_Subject.Subject();
        /**
         * Keeps track of the global `scroll` and `resize` subscriptions.
         */
        this._globalSubscription = null;
        /**
         * Keeps track of the amount of subscriptions to `scrolled`. Used for cleaning up afterwards.
         */
        this._scrolledCount = 0;
        /**
         * Map of all the scrollable references that are registered with the service and their
         * scroll event subscriptions.
         */
        this.scrollableReferences = new Map();
    }
    /**
     * Registers a Scrollable with the service and listens for its scrolled events. When the
     * scrollable is scrolled, the service emits the event in its scrolled observable.
     * @param {?} scrollable Scrollable instance to be registered.
     * @return {?}
     */
    ScrollDispatcher.prototype.register = function (scrollable) {
        var _this = this;
        var /** @type {?} */ scrollSubscription = scrollable.elementScrolled().subscribe(function () { return _this._notify(); });
        this.scrollableReferences.set(scrollable, scrollSubscription);
    };
    /**
     * Deregisters a Scrollable reference and unsubscribes from its scroll event observable.
     * @param {?} scrollable Scrollable instance to be deregistered.
     * @return {?}
     */
    ScrollDispatcher.prototype.deregister = function (scrollable) {
        var /** @type {?} */ scrollableReference = this.scrollableReferences.get(scrollable);
        if (scrollableReference) {
            scrollableReference.unsubscribe();
            this.scrollableReferences.delete(scrollable);
        }
    };
    /**
     * Subscribes to an observable that emits an event whenever any of the registered Scrollable
     * references (or window, document, or body) fire a scrolled event. Can provide a time in ms
     * to override the default "throttle" time.
     * @param {?=} auditTimeInMs
     * @param {?=} callback
     * @return {?}
     */
    ScrollDispatcher.prototype.scrolled = function (auditTimeInMs, callback) {
        var _this = this;
        if (auditTimeInMs === void 0) { auditTimeInMs = DEFAULT_SCROLL_TIME; }
        // Scroll events can only happen on the browser, so do nothing if we're not on the browser.
        if (!this._platform.isBrowser) {
            return rxjs_Subscription.Subscription.EMPTY;
        }
        // In the case of a 0ms delay, use an observable without auditTime
        // since it does add a perceptible delay in processing overhead.
        var /** @type {?} */ observable = auditTimeInMs > 0 ?
            _angular_cdk.auditTime.call(this._scrolled.asObservable(), auditTimeInMs) :
            this._scrolled.asObservable();
        this._scrolledCount++;
        if (!this._globalSubscription) {
            this._globalSubscription = this._ngZone.runOutsideAngular(function () {
                return rxjs_observable_merge.merge(rxjs_observable_fromEvent.fromEvent(window.document, 'scroll'), rxjs_observable_fromEvent.fromEvent(window, 'resize')).subscribe(function () { return _this._notify(); });
            });
        }
        // Note that we need to do the subscribing from here, in order to be able to remove
        // the global event listeners once there are no more subscriptions.
        var /** @type {?} */ subscription = observable.subscribe(callback);
        subscription.add(function () {
            _this._scrolledCount--;
            if (_this._globalSubscription && !_this.scrollableReferences.size && !_this._scrolledCount) {
                _this._globalSubscription.unsubscribe();
                _this._globalSubscription = null;
            }
        });
        return subscription;
    };
    /**
     * Returns all registered Scrollables that contain the provided element.
     * @param {?} elementRef
     * @return {?}
     */
    ScrollDispatcher.prototype.getScrollContainers = function (elementRef) {
        var _this = this;
        var /** @type {?} */ scrollingContainers = [];
        this.scrollableReferences.forEach(function (_subscription, scrollable) {
            if (_this.scrollableContainsElement(scrollable, elementRef)) {
                scrollingContainers.push(scrollable);
            }
        });
        return scrollingContainers;
    };
    /**
     * Returns true if the element is contained within the provided Scrollable.
     * @param {?} scrollable
     * @param {?} elementRef
     * @return {?}
     */
    ScrollDispatcher.prototype.scrollableContainsElement = function (scrollable, elementRef) {
        var /** @type {?} */ element = elementRef.nativeElement;
        var /** @type {?} */ scrollableElement = scrollable.getElementRef().nativeElement;
        // Traverse through the element parents until we reach null, checking if any of the elements
        // are the scrollable's element.
        do {
            if (element == scrollableElement) {
                return true;
            }
        } while (element = element.parentElement);
        return false;
    };
    /**
     * Sends a notification that a scroll event has been fired.
     * @return {?}
     */
    ScrollDispatcher.prototype._notify = function () {
        this._scrolled.next();
    };
    return ScrollDispatcher;
}());
ScrollDispatcher.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
ScrollDispatcher.ctorParameters = function () { return [
    { type: _angular_core.NgZone, },
    { type: _angular_cdk.Platform, },
]; };
/**
 * @param {?} parentDispatcher
 * @param {?} ngZone
 * @param {?} platform
 * @return {?}
 */
function SCROLL_DISPATCHER_PROVIDER_FACTORY(parentDispatcher, ngZone, platform) {
    return parentDispatcher || new ScrollDispatcher(ngZone, platform);
}
var SCROLL_DISPATCHER_PROVIDER = {
    // If there is already a ScrollDispatcher available, use that. Otherwise, provide a new one.
    provide: ScrollDispatcher,
    deps: [[new _angular_core.Optional(), new _angular_core.SkipSelf(), ScrollDispatcher], _angular_core.NgZone, _angular_cdk.Platform],
    useFactory: SCROLL_DISPATCHER_PROVIDER_FACTORY
};
/**
 * Simple utility for getting the bounds of the browser viewport.
 * \@docs-private
 */
var ViewportRuler = (function () {
    /**
     * @param {?} scrollDispatcher
     */
    function ViewportRuler(scrollDispatcher) {
        var _this = this;
        // Subscribe to scroll and resize events and update the document rectangle on changes.
        scrollDispatcher.scrolled(0, function () { return _this._cacheViewportGeometry(); });
    }
    /**
     * Gets a ClientRect for the viewport's bounds.
     * @param {?=} documentRect
     * @return {?}
     */
    ViewportRuler.prototype.getViewportRect = function (documentRect) {
        if (documentRect === void 0) { documentRect = this._documentRect; }
        // Cache the document bounding rect so that we don't recompute it for multiple calls.
        if (!documentRect) {
            this._cacheViewportGeometry();
            documentRect = this._documentRect;
        }
        // Use the document element's bounding rect rather than the window scroll properties
        // (e.g. pageYOffset, scrollY) due to in issue in Chrome and IE where window scroll
        // properties and client coordinates (boundingClientRect, clientX/Y, etc.) are in different
        // conceptual viewports. Under most circumstances these viewports are equivalent, but they
        // can disagree when the page is pinch-zoomed (on devices that support touch).
        // See https://bugs.chromium.org/p/chromium/issues/detail?id=489206#c4
        // We use the documentElement instead of the body because, by default (without a css reset)
        // browsers typically give the document body an 8px margin, which is not included in
        // getBoundingClientRect().
        var /** @type {?} */ scrollPosition = this.getViewportScrollPosition(documentRect);
        var /** @type {?} */ height = window.innerHeight;
        var /** @type {?} */ width = window.innerWidth;
        return {
            top: scrollPosition.top,
            left: scrollPosition.left,
            bottom: scrollPosition.top + height,
            right: scrollPosition.left + width,
            height: height,
            width: width,
        };
    };
    /**
     * Gets the (top, left) scroll position of the viewport.
     * @param {?=} documentRect
     * @return {?}
     */
    ViewportRuler.prototype.getViewportScrollPosition = function (documentRect) {
        if (documentRect === void 0) { documentRect = this._documentRect; }
        // Cache the document bounding rect so that we don't recompute it for multiple calls.
        if (!documentRect) {
            this._cacheViewportGeometry();
            documentRect = this._documentRect;
        }
        // The top-left-corner of the viewport is determined by the scroll position of the document
        // body, normally just (scrollLeft, scrollTop). However, Chrome and Firefox disagree about
        // whether `document.body` or `document.documentElement` is the scrolled element, so reading
        // `scrollTop` and `scrollLeft` is inconsistent. However, using the bounding rect of
        // `document.documentElement` works consistently, where the `top` and `left` values will
        // equal negative the scroll position.
        var /** @type {?} */ top = -((documentRect)).top || document.body.scrollTop || window.scrollY ||
            document.documentElement.scrollTop || 0;
        var /** @type {?} */ left = -((documentRect)).left || document.body.scrollLeft || window.scrollX ||
            document.documentElement.scrollLeft || 0;
        return { top: top, left: left };
    };
    /**
     * Caches the latest client rectangle of the document element.
     * @return {?}
     */
    ViewportRuler.prototype._cacheViewportGeometry = function () {
        this._documentRect = document.documentElement.getBoundingClientRect();
    };
    return ViewportRuler;
}());
ViewportRuler.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
ViewportRuler.ctorParameters = function () { return [
    { type: ScrollDispatcher, },
]; };
/**
 * @param {?} parentRuler
 * @param {?} scrollDispatcher
 * @return {?}
 */
function VIEWPORT_RULER_PROVIDER_FACTORY(parentRuler, scrollDispatcher) {
    return parentRuler || new ViewportRuler(scrollDispatcher);
}
var VIEWPORT_RULER_PROVIDER = {
    // If there is already a ViewportRuler available, use that. Otherwise, provide a new one.
    provide: ViewportRuler,
    deps: [[new _angular_core.Optional(), new _angular_core.SkipSelf(), ViewportRuler], ScrollDispatcher],
    useFactory: VIEWPORT_RULER_PROVIDER_FACTORY
};
/**
 * Injection token that can be used to specify the global ripple options.
 */
var MD_RIPPLE_GLOBAL_OPTIONS = new _angular_core.InjectionToken('md-ripple-global-options');
var MdRipple = (function () {
    /**
     * @param {?} elementRef
     * @param {?} ngZone
     * @param {?} ruler
     * @param {?} platform
     * @param {?} globalOptions
     */
    function MdRipple(elementRef, ngZone, ruler, platform, globalOptions) {
        /**
         * If set, the radius in pixels of foreground ripples when fully expanded. If unset, the radius
         * will be the distance from the center of the ripple to the furthest corner of the host element's
         * bounding rectangle.
         */
        this.radius = 0;
        /**
         * If set, the normal duration of ripple animations is divided by this value. For example,
         * setting it to 0.5 will cause the animations to take twice as long.
         * A changed speedFactor will not modify the fade-out duration of the ripples.
         */
        this.speedFactor = 1;
        this._rippleRenderer = new RippleRenderer(elementRef, ngZone, ruler, platform);
        this._globalOptions = globalOptions ? globalOptions : {};
        this._updateRippleRenderer();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    MdRipple.prototype.ngOnChanges = function (changes) {
        if (changes['trigger'] && this.trigger) {
            this._rippleRenderer.setTriggerElement(this.trigger);
        }
        this._updateRippleRenderer();
    };
    /**
     * @return {?}
     */
    MdRipple.prototype.ngOnDestroy = function () {
        // Set the trigger element to null to cleanup all listeners.
        this._rippleRenderer.setTriggerElement(null);
    };
    /**
     * Launches a manual ripple at the specified position.
     * @param {?} pageX
     * @param {?} pageY
     * @param {?=} config
     * @return {?}
     */
    MdRipple.prototype.launch = function (pageX, pageY, config) {
        if (config === void 0) { config = this.rippleConfig; }
        return this._rippleRenderer.fadeInRipple(pageX, pageY, config);
    };
    /**
     * Fades out all currently showing ripple elements.
     * @return {?}
     */
    MdRipple.prototype.fadeOutAll = function () {
        this._rippleRenderer.fadeOutAll();
    };
    Object.defineProperty(MdRipple.prototype, "rippleConfig", {
        /**
         * Ripple configuration from the directive's input values.
         * @return {?}
         */
        get: function () {
            return {
                centered: this.centered,
                speedFactor: this.speedFactor * (this._globalOptions.baseSpeedFactor || 1),
                radius: this.radius,
                color: this.color
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the ripple renderer with the latest ripple configuration.
     * @return {?}
     */
    MdRipple.prototype._updateRippleRenderer = function () {
        this._rippleRenderer.rippleDisabled = this._globalOptions.disabled || this.disabled;
        this._rippleRenderer.rippleConfig = this.rippleConfig;
    };
    return MdRipple;
}());
MdRipple.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-ripple], [mat-ripple], [mdRipple], [matRipple]',
                exportAs: 'mdRipple',
                host: {
                    'class': 'mat-ripple',
                    '[class.mat-ripple-unbounded]': 'unbounded'
                }
            },] },
];
/**
 * @nocollapse
 */
MdRipple.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.NgZone, },
    { type: ViewportRuler, },
    { type: _angular_cdk.Platform, },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MD_RIPPLE_GLOBAL_OPTIONS,] },] },
]; };
MdRipple.propDecorators = {
    'trigger': [{ type: _angular_core.Input, args: ['mdRippleTrigger',] },],
    'centered': [{ type: _angular_core.Input, args: ['mdRippleCentered',] },],
    'disabled': [{ type: _angular_core.Input, args: ['mdRippleDisabled',] },],
    'radius': [{ type: _angular_core.Input, args: ['mdRippleRadius',] },],
    'speedFactor': [{ type: _angular_core.Input, args: ['mdRippleSpeedFactor',] },],
    'color': [{ type: _angular_core.Input, args: ['mdRippleColor',] },],
    'unbounded': [{ type: _angular_core.Input, args: ['mdRippleUnbounded',] },],
};
/**
 * Sends an event when the directive's element is scrolled. Registers itself with the
 * ScrollDispatcher service to include itself as part of its collection of scrolling events that it
 * can be listened to through the service.
 */
var Scrollable = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _scroll
     * @param {?} _ngZone
     * @param {?} _renderer
     */
    function Scrollable(_elementRef, _scroll, _ngZone, _renderer) {
        this._elementRef = _elementRef;
        this._scroll = _scroll;
        this._ngZone = _ngZone;
        this._renderer = _renderer;
        this._elementScrolled = new rxjs_Subject.Subject();
    }
    /**
     * @return {?}
     */
    Scrollable.prototype.ngOnInit = function () {
        var _this = this;
        this._scrollListener = this._ngZone.runOutsideAngular(function () {
            return _this._renderer.listen(_this.getElementRef().nativeElement, 'scroll', function (event) {
                _this._elementScrolled.next(event);
            });
        });
        this._scroll.register(this);
    };
    /**
     * @return {?}
     */
    Scrollable.prototype.ngOnDestroy = function () {
        this._scroll.deregister(this);
        if (this._scrollListener) {
            this._scrollListener();
            this._scrollListener = null;
        }
    };
    /**
     * Returns observable that emits when a scroll event is fired on the host element.
     * @return {?}
     */
    Scrollable.prototype.elementScrolled = function () {
        return this._elementScrolled.asObservable();
    };
    /**
     * @return {?}
     */
    Scrollable.prototype.getElementRef = function () {
        return this._elementRef;
    };
    return Scrollable;
}());
Scrollable.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[cdk-scrollable], [cdkScrollable]'
            },] },
];
/**
 * @nocollapse
 */
Scrollable.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: ScrollDispatcher, },
    { type: _angular_core.NgZone, },
    { type: _angular_core.Renderer2, },
]; };
/**
 * Returns an error to be thrown when attempting to attach an already-attached scroll strategy.
 * @return {?}
 */
function getMdScrollStrategyAlreadyAttachedError() {
    return Error("Scroll strategy has already been attached.");
}
/**
 * Strategy that will close the overlay as soon as the user starts scrolling.
 */
var CloseScrollStrategy = (function () {
    /**
     * @param {?} _scrollDispatcher
     */
    function CloseScrollStrategy(_scrollDispatcher) {
        this._scrollDispatcher = _scrollDispatcher;
        this._scrollSubscription = null;
    }
    /**
     * @param {?} overlayRef
     * @return {?}
     */
    CloseScrollStrategy.prototype.attach = function (overlayRef) {
        if (this._overlayRef) {
            throw getMdScrollStrategyAlreadyAttachedError();
        }
        this._overlayRef = overlayRef;
    };
    /**
     * @return {?}
     */
    CloseScrollStrategy.prototype.enable = function () {
        var _this = this;
        if (!this._scrollSubscription) {
            this._scrollSubscription = this._scrollDispatcher.scrolled(0, function () {
                if (_this._overlayRef.hasAttached()) {
                    _this._overlayRef.detach();
                }
                _this.disable();
            });
        }
    };
    /**
     * @return {?}
     */
    CloseScrollStrategy.prototype.disable = function () {
        if (this._scrollSubscription) {
            this._scrollSubscription.unsubscribe();
            this._scrollSubscription = null;
        }
    };
    return CloseScrollStrategy;
}());
/**
 * Scroll strategy that doesn't do anything.
 */
var NoopScrollStrategy = (function () {
    function NoopScrollStrategy() {
    }
    /**
     * @return {?}
     */
    NoopScrollStrategy.prototype.enable = function () { };
    /**
     * @return {?}
     */
    NoopScrollStrategy.prototype.disable = function () { };
    /**
     * @return {?}
     */
    NoopScrollStrategy.prototype.attach = function () { };
    return NoopScrollStrategy;
}());
/**
 * Strategy that will prevent the user from scrolling while the overlay is visible.
 */
var BlockScrollStrategy = (function () {
    /**
     * @param {?} _viewportRuler
     */
    function BlockScrollStrategy(_viewportRuler) {
        this._viewportRuler = _viewportRuler;
        this._previousHTMLStyles = { top: '', left: '' };
        this._isEnabled = false;
    }
    /**
     * @return {?}
     */
    BlockScrollStrategy.prototype.attach = function () { };
    /**
     * @return {?}
     */
    BlockScrollStrategy.prototype.enable = function () {
        if (this._canBeEnabled()) {
            var /** @type {?} */ root = document.documentElement;
            this._previousScrollPosition = this._viewportRuler.getViewportScrollPosition();
            // Cache the previous inline styles in case the user had set them.
            this._previousHTMLStyles.left = root.style.left || '';
            this._previousHTMLStyles.top = root.style.top || '';
            // Note: we're using the `html` node, instead of the `body`, because the `body` may
            // have the user agent margin, whereas the `html` is guaranteed not to have one.
            root.style.left = -this._previousScrollPosition.left + "px";
            root.style.top = -this._previousScrollPosition.top + "px";
            root.classList.add('cdk-global-scrollblock');
            this._isEnabled = true;
        }
    };
    /**
     * @return {?}
     */
    BlockScrollStrategy.prototype.disable = function () {
        if (this._isEnabled) {
            this._isEnabled = false;
            document.documentElement.style.left = this._previousHTMLStyles.left;
            document.documentElement.style.top = this._previousHTMLStyles.top;
            document.documentElement.classList.remove('cdk-global-scrollblock');
            window.scroll(this._previousScrollPosition.left, this._previousScrollPosition.top);
        }
    };
    /**
     * @return {?}
     */
    BlockScrollStrategy.prototype._canBeEnabled = function () {
        // Since the scroll strategies can't be singletons, we have to use a global CSS class
        // (`cdk-global-scrollblock`) to make sure that we don't try to disable global
        // scrolling multiple times.
        if (document.documentElement.classList.contains('cdk-global-scrollblock') || this._isEnabled) {
            return false;
        }
        var /** @type {?} */ body = document.body;
        var /** @type {?} */ viewport = this._viewportRuler.getViewportRect();
        return body.scrollHeight > viewport.height || body.scrollWidth > viewport.width;
    };
    return BlockScrollStrategy;
}());
/**
 * Strategy that will update the element position as the user is scrolling.
 */
var RepositionScrollStrategy = (function () {
    /**
     * @param {?} _scrollDispatcher
     * @param {?=} _config
     */
    function RepositionScrollStrategy(_scrollDispatcher, _config) {
        this._scrollDispatcher = _scrollDispatcher;
        this._config = _config;
        this._scrollSubscription = null;
    }
    /**
     * @param {?} overlayRef
     * @return {?}
     */
    RepositionScrollStrategy.prototype.attach = function (overlayRef) {
        if (this._overlayRef) {
            throw getMdScrollStrategyAlreadyAttachedError();
        }
        this._overlayRef = overlayRef;
    };
    /**
     * @return {?}
     */
    RepositionScrollStrategy.prototype.enable = function () {
        var _this = this;
        if (!this._scrollSubscription) {
            var /** @type {?} */ throttle = this._config ? this._config.scrollThrottle : 0;
            this._scrollSubscription = this._scrollDispatcher.scrolled(throttle, function () {
                _this._overlayRef.updatePosition();
            });
        }
    };
    /**
     * @return {?}
     */
    RepositionScrollStrategy.prototype.disable = function () {
        if (this._scrollSubscription) {
            this._scrollSubscription.unsubscribe();
            this._scrollSubscription = null;
        }
    };
    return RepositionScrollStrategy;
}());
/**
 * Options for how an overlay will handle scrolling.
 *
 * Users can provide a custom value for `ScrollStrategyOptions` to replace the default
 * behaviors. This class primarily acts as a factory for ScrollStrategy instances.
 */
var ScrollStrategyOptions = (function () {
    /**
     * @param {?} _scrollDispatcher
     * @param {?} _viewportRuler
     */
    function ScrollStrategyOptions(_scrollDispatcher, _viewportRuler) {
        var _this = this;
        this._scrollDispatcher = _scrollDispatcher;
        this._viewportRuler = _viewportRuler;
        /**
         * Do nothing on scroll.
         */
        this.noop = function () { return new NoopScrollStrategy(); };
        /**
         * Close the overlay as soon as the user scrolls.
         */
        this.close = function () { return new CloseScrollStrategy(_this._scrollDispatcher); };
        /**
         * Block scrolling.
         */
        this.block = function () { return new BlockScrollStrategy(_this._viewportRuler); };
        /**
         * Update the overlay's position on scroll.
         * @param config Configuration to be used inside the scroll strategy.
         * Allows debouncing the reposition calls.
         */
        this.reposition = function (config) { return new RepositionScrollStrategy(_this._scrollDispatcher, config); };
    }
    return ScrollStrategyOptions;
}());
ScrollStrategyOptions.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
ScrollStrategyOptions.ctorParameters = function () { return [
    { type: ScrollDispatcher, },
    { type: ViewportRuler, },
]; };
var ScrollDispatchModule = (function () {
    function ScrollDispatchModule() {
    }
    return ScrollDispatchModule;
}());
ScrollDispatchModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_cdk.PlatformModule],
                exports: [Scrollable],
                declarations: [Scrollable],
                providers: [SCROLL_DISPATCHER_PROVIDER, ScrollStrategyOptions],
            },] },
];
/**
 * @nocollapse
 */
ScrollDispatchModule.ctorParameters = function () { return []; };
var MdRippleModule = (function () {
    function MdRippleModule() {
    }
    return MdRippleModule;
}());
MdRippleModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [MdCommonModule, _angular_cdk.PlatformModule, ScrollDispatchModule],
                exports: [MdRipple, MdCommonModule],
                declarations: [MdRipple],
                providers: [VIEWPORT_RULER_PROVIDER],
            },] },
];
/**
 * @nocollapse
 */
MdRippleModule.ctorParameters = function () { return []; };
/**
 * Mixin to augment a directive with a `color` property.
 * @template T
 * @param {?} base
 * @param {?=} defaultColor
 * @return {?}
 */
function mixinColor(base, defaultColor) {
    return (function (_super) {
        __extends(class_1, _super);
        /**
         * @param {...?} args
         */
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            // Set the default color that can be specified from the mixin.
            _this.color = defaultColor;
            return _this;
        }
        Object.defineProperty(class_1.prototype, "color", {
            /**
             * @return {?}
             */
            get: function () { return this._color; },
            /**
             * @param {?} value
             * @return {?}
             */
            set: function (value) {
                var /** @type {?} */ colorPalette = value || defaultColor;
                if (colorPalette !== this._color) {
                    if (this._color) {
                        this._renderer.removeClass(this._elementRef.nativeElement, "mat-" + this._color);
                    }
                    if (colorPalette) {
                        this._renderer.addClass(this._elementRef.nativeElement, "mat-" + colorPalette);
                    }
                    this._color = colorPalette;
                }
            },
            enumerable: true,
            configurable: true
        });
        return class_1;
    }(base));
}
/**
 * \@docs-private
 */
var MdPseudoCheckboxBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdPseudoCheckboxBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdPseudoCheckboxBase;
}());
var _MdPseudoCheckboxBase = mixinColor(MdPseudoCheckboxBase, 'accent');
/**
 * Component that shows a simplified checkbox without including any kind of "real" checkbox.
 * Meant to be used when the checkbox is purely decorative and a large number of them will be
 * included, such as for the options in a multi-select. Uses no SVGs or complex animations.
 *
 * Note that this component will be completely invisible to screen-reader users. This is *not*
 * interchangeable with <md-checkbox> and should *not* be used if the user would directly interact
 * with the checkbox. The pseudo-checkbox should only be used as an implementation detail of
 * more complex components that appropriately handle selected / checked state.
 * \@docs-private
 */
var MdPseudoCheckbox = (function (_super) {
    __extends(MdPseudoCheckbox, _super);
    /**
     * @param {?} elementRef
     * @param {?} renderer
     */
    function MdPseudoCheckbox(elementRef, renderer) {
        var _this = _super.call(this, renderer, elementRef) || this;
        /**
         * Display state of the checkbox.
         */
        _this.state = 'unchecked';
        /**
         * Whether the checkbox is disabled.
         */
        _this.disabled = false;
        return _this;
    }
    return MdPseudoCheckbox;
}(_MdPseudoCheckboxBase));
MdPseudoCheckbox.decorators = [
    { type: _angular_core.Component, args: [{ encapsulation: _angular_core.ViewEncapsulation.None,
                selector: 'md-pseudo-checkbox, mat-pseudo-checkbox',
                styles: [".mat-pseudo-checkbox{width:20px;height:20px;border:2px solid;border-radius:2px;cursor:pointer;display:inline-block;vertical-align:middle;box-sizing:border-box;position:relative;transition:border-color 90ms cubic-bezier(0,0,.2,.1),background-color 90ms cubic-bezier(0,0,.2,.1)}.mat-pseudo-checkbox::after{position:absolute;opacity:0;content:'';border-bottom:2px solid currentColor;transition:opacity 90ms cubic-bezier(0,0,.2,.1)}.mat-pseudo-checkbox.mat-pseudo-checkbox-checked,.mat-pseudo-checkbox.mat-pseudo-checkbox-indeterminate{border:none}.mat-pseudo-checkbox-disabled{cursor:default}.mat-pseudo-checkbox-indeterminate::after{top:9px;left:2px;width:16px;opacity:1}.mat-pseudo-checkbox-checked::after{top:5px;left:3px;width:12px;height:5px;border-left:2px solid currentColor;transform:rotate(-45deg);opacity:1}"],
                inputs: ['color'],
                template: '',
                host: {
                    'class': 'mat-pseudo-checkbox',
                    '[class.mat-pseudo-checkbox-indeterminate]': 'state === "indeterminate"',
                    '[class.mat-pseudo-checkbox-checked]': 'state === "checked"',
                    '[class.mat-pseudo-checkbox-disabled]': 'disabled',
                },
            },] },
];
/**
 * @nocollapse
 */
MdPseudoCheckbox.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
]; };
MdPseudoCheckbox.propDecorators = {
    'state': [{ type: _angular_core.Input },],
    'disabled': [{ type: _angular_core.Input },],
};
var MdSelectionModule = (function () {
    function MdSelectionModule() {
    }
    return MdSelectionModule;
}());
MdSelectionModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                exports: [MdPseudoCheckbox],
                declarations: [MdPseudoCheckbox]
            },] },
];
/**
 * @nocollapse
 */
MdSelectionModule.ctorParameters = function () { return []; };
/**
 * Mixin to augment a directive with a `disabled` property.
 * @template T
 * @param {?} base
 * @return {?}
 */
function mixinDisabled(base) {
    return (function (_super) {
        __extends(class_2, _super);
        /**
         * @param {...?} args
         */
        function class_2() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            _this._disabled = false;
            return _this;
        }
        Object.defineProperty(class_2.prototype, "disabled", {
            /**
             * @return {?}
             */
            get: function () { return this._disabled; },
            /**
             * @param {?} value
             * @return {?}
             */
            set: function (value) { this._disabled = _angular_cdk.coerceBooleanProperty(value); },
            enumerable: true,
            configurable: true
        });
        return class_2;
    }(base));
}
/**
 * \@docs-private
 */
var MdOptgroupBase = (function () {
    function MdOptgroupBase() {
    }
    return MdOptgroupBase;
}());
var _MdOptgroupMixinBase = mixinDisabled(MdOptgroupBase);
// Counter for unique group ids.
var _uniqueOptgroupIdCounter = 0;
/**
 * Component that is used to group instances of `md-option`.
 */
var MdOptgroup = (function (_super) {
    __extends(MdOptgroup, _super);
    function MdOptgroup() {
        var _this = _super.apply(this, arguments) || this;
        /**
         * Unique id for the underlying label.
         */
        _this._labelId = "mat-optgroup-label-" + _uniqueOptgroupIdCounter++;
        return _this;
    }
    return MdOptgroup;
}(_MdOptgroupMixinBase));
MdOptgroup.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-optgroup, mat-optgroup',
                template: "<label class=\"mat-optgroup-label\" [id]=\"_labelId\">{{ label }}</label><ng-content select=\"md-option, mat-option\"></ng-content>",
                encapsulation: _angular_core.ViewEncapsulation.None,
                inputs: ['disabled'],
                host: {
                    'class': 'mat-optgroup',
                    'role': 'group',
                    '[class.mat-optgroup-disabled]': 'disabled',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.aria-labelledby]': '_labelId',
                }
            },] },
];
/**
 * @nocollapse
 */
MdOptgroup.ctorParameters = function () { return []; };
MdOptgroup.propDecorators = {
    'label': [{ type: _angular_core.Input },],
};
/**
 * Option IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
var _uniqueIdCounter = 0;
/**
 * Event object emitted by MdOption when selected or deselected.
 */
var MdOptionSelectionChange = (function () {
    /**
     * @param {?} source
     * @param {?=} isUserInput
     */
    function MdOptionSelectionChange(source, isUserInput) {
        if (isUserInput === void 0) { isUserInput = false; }
        this.source = source;
        this.isUserInput = isUserInput;
    }
    return MdOptionSelectionChange;
}());
/**
 * Single option inside of a `<md-select>` element.
 */
var MdOption = (function () {
    /**
     * @param {?} _element
     * @param {?} group
     * @param {?} _isCompatibilityMode
     */
    function MdOption(_element, group, _isCompatibilityMode) {
        this._element = _element;
        this.group = group;
        this._isCompatibilityMode = _isCompatibilityMode;
        this._selected = false;
        this._active = false;
        /**
         * Whether the option is disabled.
         */
        this._disabled = false;
        this._id = "md-option-" + _uniqueIdCounter++;
        /**
         * Whether the wrapping component is in multiple selection mode.
         */
        this.multiple = false;
        /**
         * Event emitted when the option is selected or deselected.
         */
        this.onSelectionChange = new _angular_core.EventEmitter();
    }
    Object.defineProperty(MdOption.prototype, "id", {
        /**
         * The unique ID of the option.
         * @return {?}
         */
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "selected", {
        /**
         * Whether or not the option is currently selected.
         * @return {?}
         */
        get: function () { return this._selected; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "disabled", {
        /**
         * Whether the option is disabled.
         * @return {?}
         */
        get: function () { return (this.group && this.group.disabled) || this._disabled; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disabled = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "active", {
        /**
         * Whether or not the option is currently active and ready to be selected.
         * An active option displays styles as if it is focused, but the
         * focus is actually retained somewhere else. This comes in handy
         * for components like autocomplete where focus must remain on the input.
         * @return {?}
         */
        get: function () {
            return this._active;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "viewValue", {
        /**
         * The displayed value of the option. It is necessary to show the selected option in the
         * select's trigger.
         * @return {?}
         */
        get: function () {
            // TODO(kara): Add input property alternative for node envs.
            return (this._getHostElement().textContent || '').trim();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Selects the option.
     * @return {?}
     */
    MdOption.prototype.select = function () {
        this._selected = true;
        this._emitSelectionChangeEvent();
    };
    /**
     * Deselects the option.
     * @return {?}
     */
    MdOption.prototype.deselect = function () {
        this._selected = false;
        this._emitSelectionChangeEvent();
    };
    /**
     * Sets focus onto this option.
     * @return {?}
     */
    MdOption.prototype.focus = function () {
        this._getHostElement().focus();
    };
    /**
     * This method sets display styles on the option to make it appear
     * active. This is used by the ActiveDescendantKeyManager so key
     * events will display the proper options as active on arrow key events.
     * @return {?}
     */
    MdOption.prototype.setActiveStyles = function () {
        this._active = true;
    };
    /**
     * This method removes display styles on the option that made it appear
     * active. This is used by the ActiveDescendantKeyManager so key
     * events will display the proper options as active on arrow key events.
     * @return {?}
     */
    MdOption.prototype.setInactiveStyles = function () {
        this._active = false;
    };
    /**
     * Ensures the option is selected when activated from the keyboard.
     * @param {?} event
     * @return {?}
     */
    MdOption.prototype._handleKeydown = function (event) {
        if (event.keyCode === _angular_cdk.ENTER || event.keyCode === _angular_cdk.SPACE) {
            this._selectViaInteraction();
            // Prevent the page from scrolling down and form submits.
            event.preventDefault();
        }
    };
    /**
     * Selects the option while indicating the selection came from the user. Used to
     * determine if the select's view -> model callback should be invoked.
     * @return {?}
     */
    MdOption.prototype._selectViaInteraction = function () {
        if (!this.disabled) {
            this._selected = this.multiple ? !this._selected : true;
            this._emitSelectionChangeEvent(true);
        }
    };
    /**
     * Returns the correct tabindex for the option depending on disabled state.
     * @return {?}
     */
    MdOption.prototype._getTabIndex = function () {
        return this.disabled ? '-1' : '0';
    };
    /**
     * Fetches the host DOM element.
     * @return {?}
     */
    MdOption.prototype._getHostElement = function () {
        return this._element.nativeElement;
    };
    /**
     * Emits the selection change event.
     * @param {?=} isUserInput
     * @return {?}
     */
    MdOption.prototype._emitSelectionChangeEvent = function (isUserInput) {
        if (isUserInput === void 0) { isUserInput = false; }
        this.onSelectionChange.emit(new MdOptionSelectionChange(this, isUserInput));
    };
    return MdOption;
}());
MdOption.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-option, mat-option',
                host: {
                    'role': 'option',
                    '[attr.tabindex]': '_getTabIndex()',
                    '[class.mat-selected]': 'selected',
                    '[class.mat-option-multiple]': 'multiple',
                    '[class.mat-active]': 'active',
                    '[id]': 'id',
                    '[attr.aria-selected]': 'selected.toString()',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[class.mat-option-disabled]': 'disabled',
                    '(click)': '_selectViaInteraction()',
                    '(keydown)': '_handleKeydown($event)',
                    'class': 'mat-option',
                },
                template: "<span [ngSwitch]=\"_isCompatibilityMode\" *ngIf=\"multiple\"><mat-pseudo-checkbox class=\"mat-option-pseudo-checkbox\" *ngSwitchCase=\"true\" [state]=\"selected ? 'checked' : ''\" color=\"primary\"></mat-pseudo-checkbox><md-pseudo-checkbox class=\"mat-option-pseudo-checkbox\" *ngSwitchDefault [state]=\"selected ? 'checked' : ''\" color=\"primary\"></md-pseudo-checkbox></span><ng-content></ng-content><div class=\"mat-option-ripple\" *ngIf=\"!disabled\" md-ripple [mdRippleTrigger]=\"_getHostElement()\"></div>",
                encapsulation: _angular_core.ViewEncapsulation.None
            },] },
];
/**
 * @nocollapse
 */
MdOption.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: MdOptgroup, decorators: [{ type: _angular_core.Optional },] },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MATERIAL_COMPATIBILITY_MODE,] },] },
]; };
MdOption.propDecorators = {
    'value': [{ type: _angular_core.Input },],
    'disabled': [{ type: _angular_core.Input },],
    'onSelectionChange': [{ type: _angular_core.Output },],
};
var MdOptionModule = (function () {
    function MdOptionModule() {
    }
    return MdOptionModule;
}());
MdOptionModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [MdRippleModule, _angular_common.CommonModule, MdSelectionModule],
                exports: [MdOption, MdOptgroup],
                declarations: [MdOption, MdOptgroup]
            },] },
];
/**
 * @nocollapse
 */
MdOptionModule.ctorParameters = function () { return []; };
/**
 * OverlayState is a bag of values for either the initial configuration or current state of an
 * overlay.
 */
var OverlayState = (function () {
    function OverlayState() {
        /**
         * Custom class to add to the overlay pane.
         */
        this.panelClass = '';
        /**
         * Whether the overlay has a backdrop.
         */
        this.hasBackdrop = false;
        /**
         * Custom class to add to the backdrop
         */
        this.backdropClass = 'cdk-overlay-dark-backdrop';
        /**
         * The direction of the text in the overlay panel.
         */
        this.direction = 'ltr';
        // TODO(jelbourn): configuration still to add
        // - focus trap
        // - disable pointer events
        // - z-index
    }
    return OverlayState;
}());
/**
 * Reference to an overlay that has been created with the Overlay service.
 * Used to manipulate or dispose of said overlay.
 */
var OverlayRef = (function () {
    /**
     * @param {?} _portalHost
     * @param {?} _pane
     * @param {?} _state
     * @param {?} _scrollStrategy
     * @param {?} _ngZone
     */
    function OverlayRef(_portalHost, _pane, _state, _scrollStrategy, _ngZone) {
        this._portalHost = _portalHost;
        this._pane = _pane;
        this._state = _state;
        this._scrollStrategy = _scrollStrategy;
        this._ngZone = _ngZone;
        this._backdropElement = null;
        this._backdropClick = new rxjs_Subject.Subject();
        this._attachments = new rxjs_Subject.Subject();
        this._detachments = new rxjs_Subject.Subject();
        _scrollStrategy.attach(this);
    }
    Object.defineProperty(OverlayRef.prototype, "overlayElement", {
        /**
         * The overlay's HTML element
         * @return {?}
         */
        get: function () {
            return this._pane;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Attaches the overlay to a portal instance and adds the backdrop.
     * @param {?} portal Portal instance to which to attach the overlay.
     * @return {?} The portal attachment result.
     */
    OverlayRef.prototype.attach = function (portal) {
        var /** @type {?} */ attachResult = this._portalHost.attach(portal);
        // Update the pane element with the given state configuration.
        this._updateStackingOrder();
        this.updateSize();
        this.updateDirection();
        this.updatePosition();
        this._scrollStrategy.enable();
        // Enable pointer events for the overlay pane element.
        this._togglePointerEvents(true);
        if (this._state.hasBackdrop) {
            this._attachBackdrop();
        }
        if (this._state.panelClass) {
            this._pane.classList.add(this._state.panelClass);
        }
        // Only emit the `attachments` event once all other setup is done.
        this._attachments.next();
        return attachResult;
    };
    /**
     * Detaches an overlay from a portal.
     * @return {?} Resolves when the overlay has been detached.
     */
    OverlayRef.prototype.detach = function () {
        this.detachBackdrop();
        // When the overlay is detached, the pane element should disable pointer events.
        // This is necessary because otherwise the pane element will cover the page and disable
        // pointer events therefore. Depends on the position strategy and the applied pane boundaries.
        this._togglePointerEvents(false);
        this._scrollStrategy.disable();
        var /** @type {?} */ detachmentResult = this._portalHost.detach();
        // Only emit after everything is detached.
        this._detachments.next();
        return detachmentResult;
    };
    /**
     * Cleans up the overlay from the DOM.
     * @return {?}
     */
    OverlayRef.prototype.dispose = function () {
        if (this._state.positionStrategy) {
            this._state.positionStrategy.dispose();
        }
        if (this._scrollStrategy) {
            this._scrollStrategy.disable();
        }
        this.detachBackdrop();
        this._portalHost.dispose();
        this._attachments.complete();
        this._backdropClick.complete();
        this._detachments.next();
        this._detachments.complete();
    };
    /**
     * Checks whether the overlay has been attached.
     * @return {?}
     */
    OverlayRef.prototype.hasAttached = function () {
        return this._portalHost.hasAttached();
    };
    /**
     * Returns an observable that emits when the backdrop has been clicked.
     * @return {?}
     */
    OverlayRef.prototype.backdropClick = function () {
        return this._backdropClick.asObservable();
    };
    /**
     * Returns an observable that emits when the overlay has been attached.
     * @return {?}
     */
    OverlayRef.prototype.attachments = function () {
        return this._attachments.asObservable();
    };
    /**
     * Returns an observable that emits when the overlay has been detached.
     * @return {?}
     */
    OverlayRef.prototype.detachments = function () {
        return this._detachments.asObservable();
    };
    /**
     * Gets the current state config of the overlay.
     * @return {?}
     */
    OverlayRef.prototype.getState = function () {
        return this._state;
    };
    /**
     * Updates the position of the overlay based on the position strategy.
     * @return {?}
     */
    OverlayRef.prototype.updatePosition = function () {
        if (this._state.positionStrategy) {
            this._state.positionStrategy.apply(this._pane);
        }
    };
    /**
     * Updates the text direction of the overlay panel.
     * @return {?}
     */
    OverlayRef.prototype.updateDirection = function () {
        this._pane.setAttribute('dir', /** @type {?} */ ((this._state.direction)));
    };
    /**
     * Updates the size of the overlay based on the overlay config.
     * @return {?}
     */
    OverlayRef.prototype.updateSize = function () {
        if (this._state.width || this._state.width === 0) {
            this._pane.style.width = formatCssUnit(this._state.width);
        }
        if (this._state.height || this._state.height === 0) {
            this._pane.style.height = formatCssUnit(this._state.height);
        }
        if (this._state.minWidth || this._state.minWidth === 0) {
            this._pane.style.minWidth = formatCssUnit(this._state.minWidth);
        }
        if (this._state.minHeight || this._state.minHeight === 0) {
            this._pane.style.minHeight = formatCssUnit(this._state.minHeight);
        }
    };
    /**
     * Toggles the pointer events for the overlay pane element.
     * @param {?} enablePointer
     * @return {?}
     */
    OverlayRef.prototype._togglePointerEvents = function (enablePointer) {
        this._pane.style.pointerEvents = enablePointer ? 'auto' : 'none';
    };
    /**
     * Attaches a backdrop for this overlay.
     * @return {?}
     */
    OverlayRef.prototype._attachBackdrop = function () {
        var _this = this;
        this._backdropElement = document.createElement('div');
        this._backdropElement.classList.add('cdk-overlay-backdrop');
        if (this._state.backdropClass) {
            this._backdropElement.classList.add(this._state.backdropClass);
        } /** @type {?} */
        ((
        // Insert the backdrop before the pane in the DOM order,
        // in order to handle stacked overlays properly.
        this._pane.parentElement)).insertBefore(this._backdropElement, this._pane);
        // Forward backdrop clicks such that the consumer of the overlay can perform whatever
        // action desired when such a click occurs (usually closing the overlay).
        this._backdropElement.addEventListener('click', function () { return _this._backdropClick.next(null); });
        // Add class to fade-in the backdrop after one frame.
        requestAnimationFrame(function () {
            if (_this._backdropElement) {
                _this._backdropElement.classList.add('cdk-overlay-backdrop-showing');
            }
        });
    };
    /**
     * Updates the stacking order of the element, moving it to the top if necessary.
     * This is required in cases where one overlay was detached, while another one,
     * that should be behind it, was destroyed. The next time both of them are opened,
     * the stacking will be wrong, because the detached element's pane will still be
     * in its original DOM position.
     * @return {?}
     */
    OverlayRef.prototype._updateStackingOrder = function () {
        if (this._pane.nextSibling) {
            ((this._pane.parentNode)).appendChild(this._pane);
        }
    };
    /**
     * Detaches the backdrop (if any) associated with the overlay.
     * @return {?}
     */
    OverlayRef.prototype.detachBackdrop = function () {
        var _this = this;
        var /** @type {?} */ backdropToDetach = this._backdropElement;
        if (backdropToDetach) {
            var /** @type {?} */ finishDetach_1 = function () {
                // It may not be attached to anything in certain cases (e.g. unit tests).
                if (backdropToDetach && backdropToDetach.parentNode) {
                    backdropToDetach.parentNode.removeChild(backdropToDetach);
                }
                // It is possible that a new portal has been attached to this overlay since we started
                // removing the backdrop. If that is the case, only clear the backdrop reference if it
                // is still the same instance that we started to remove.
                if (_this._backdropElement == backdropToDetach) {
                    _this._backdropElement = null;
                }
            };
            backdropToDetach.classList.remove('cdk-overlay-backdrop-showing');
            if (this._state.backdropClass) {
                backdropToDetach.classList.remove(this._state.backdropClass);
            }
            backdropToDetach.addEventListener('transitionend', finishDetach_1);
            // If the backdrop doesn't have a transition, the `transitionend` event won't fire.
            // In this case we make it unclickable and we try to remove it after a delay.
            backdropToDetach.style.pointerEvents = 'none';
            // Run this outside the Angular zone because there's nothing that Angular cares about.
            // If it were to run inside the Angular zone, every test that used Overlay would have to be
            // either async or fakeAsync.
            this._ngZone.runOutsideAngular(function () {
                setTimeout(finishDetach_1, 500);
            });
        }
    };
    return OverlayRef;
}());
/**
 * @param {?} value
 * @return {?}
 */
function formatCssUnit(value) {
    return typeof value === 'string' ? (value) : value + "px";
}
/** Horizontal dimension of a connection point on the perimeter of the origin or overlay element. */
/**
 * The points of the origin element and the overlay element to connect.
 */
var ConnectionPositionPair = (function () {
    /**
     * @param {?} origin
     * @param {?} overlay
     */
    function ConnectionPositionPair(origin, overlay) {
        this.originX = origin.originX;
        this.originY = origin.originY;
        this.overlayX = overlay.overlayX;
        this.overlayY = overlay.overlayY;
    }
    return ConnectionPositionPair;
}());
/**
 * Set of properties regarding the position of the origin and overlay relative to the viewport
 * with respect to the containing Scrollable elements.
 *
 * The overlay and origin are clipped if any part of their bounding client rectangle exceeds the
 * bounds of any one of the strategy's Scrollable's bounding client rectangle.
 *
 * The overlay and origin are outside view if there is no overlap between their bounding client
 * rectangle and any one of the strategy's Scrollable's bounding client rectangle.
 *
 *       -----------                    -----------
 *       | outside |                    | clipped |
 *       |  view   |              --------------------------
 *       |         |              |     |         |        |
 *       ----------               |     -----------        |
 *  --------------------------    |                        |
 *  |                        |    |      Scrollable        |
 *  |                        |    |                        |
 *  |                        |     --------------------------
 *  |      Scrollable        |
 *  |                        |
 *  --------------------------
 */
var ScrollableViewProperties = (function () {
    function ScrollableViewProperties() {
    }
    return ScrollableViewProperties;
}());
/**
 * The change event emitted by the strategy when a fallback position is used.
 */
var ConnectedOverlayPositionChange = (function () {
    /**
     * @param {?} connectionPair
     * @param {?} scrollableViewProperties
     */
    function ConnectedOverlayPositionChange(connectionPair, scrollableViewProperties) {
        this.connectionPair = connectionPair;
        this.scrollableViewProperties = scrollableViewProperties;
    }
    return ConnectedOverlayPositionChange;
}());
/**
 * @nocollapse
 */
ConnectedOverlayPositionChange.ctorParameters = function () { return [
    { type: ConnectionPositionPair, },
    { type: ScrollableViewProperties, decorators: [{ type: _angular_core.Optional },] },
]; };
/**
 * A strategy for positioning overlays. Using this strategy, an overlay is given an
 * implicit position relative some origin element. The relative position is defined in terms of
 * a point on the origin element that is connected to a point on the overlay element. For example,
 * a basic dropdown is connecting the bottom-left corner of the origin to the top-left corner
 * of the overlay.
 */
var ConnectedPositionStrategy = (function () {
    /**
     * @param {?} _connectedTo
     * @param {?} _originPos
     * @param {?} _overlayPos
     * @param {?} _viewportRuler
     */
    function ConnectedPositionStrategy(_connectedTo, _originPos, _overlayPos, _viewportRuler) {
        this._connectedTo = _connectedTo;
        this._originPos = _originPos;
        this._overlayPos = _overlayPos;
        this._viewportRuler = _viewportRuler;
        this._dir = 'ltr';
        /**
         * The offset in pixels for the overlay connection point on the x-axis
         */
        this._offsetX = 0;
        /**
         * The offset in pixels for the overlay connection point on the y-axis
         */
        this._offsetY = 0;
        /**
         * The Scrollable containers used to check scrollable view properties on position change.
         */
        this.scrollables = [];
        /**
         * Ordered list of preferred positions, from most to least desirable.
         */
        this._preferredPositions = [];
        this._onPositionChange = new rxjs_Subject.Subject();
        this._origin = this._connectedTo.nativeElement;
        this.withFallbackPosition(_originPos, _overlayPos);
    }
    Object.defineProperty(ConnectedPositionStrategy.prototype, "_isRtl", {
        /**
         * Whether the we're dealing with an RTL context
         * @return {?}
         */
        get: function () {
            return this._dir === 'rtl';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedPositionStrategy.prototype, "onPositionChange", {
        /**
         * Emits an event when the connection point changes.
         * @return {?}
         */
        get: function () {
            return this._onPositionChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedPositionStrategy.prototype, "positions", {
        /**
         * Ordered list of preferred positions, from most to least desirable.
         * @return {?}
         */
        get: function () {
            return this._preferredPositions;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * To be used to for any cleanup after the element gets destroyed.
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.dispose = function () { };
    /**
     * Updates the position of the overlay element, using whichever preferred position relative
     * to the origin fits on-screen.
     * \@docs-private
     *
     * @param {?} element Element to which to apply the CSS styles.
     * @return {?} Resolves when the styles have been applied.
     */
    ConnectedPositionStrategy.prototype.apply = function (element) {
        // Cache the overlay pane element in case re-calculating position is necessary
        this._pane = element;
        // We need the bounding rects for the origin and the overlay to determine how to position
        // the overlay relative to the origin.
        var /** @type {?} */ originRect = this._origin.getBoundingClientRect();
        var /** @type {?} */ overlayRect = element.getBoundingClientRect();
        // We use the viewport rect to determine whether a position would go off-screen.
        var /** @type {?} */ viewportRect = this._viewportRuler.getViewportRect();
        // Fallback point if none of the fallbacks fit into the viewport.
        var /** @type {?} */ fallbackPoint;
        var /** @type {?} */ fallbackPosition;
        // We want to place the overlay in the first of the preferred positions such that the
        // overlay fits on-screen.
        for (var _i = 0, _a = this._preferredPositions; _i < _a.length; _i++) {
            var pos = _a[_i];
            // Get the (x, y) point of connection on the origin, and then use that to get the
            // (top, left) coordinate for the overlay at `pos`.
            var /** @type {?} */ originPoint = this._getOriginConnectionPoint(originRect, pos);
            var /** @type {?} */ overlayPoint = this._getOverlayPoint(originPoint, overlayRect, viewportRect, pos);
            // If the overlay in the calculated position fits on-screen, put it there and we're done.
            if (overlayPoint.fitsInViewport) {
                this._setElementPosition(element, overlayRect, overlayPoint, pos);
                // Save the last connected position in case the position needs to be re-calculated.
                this._lastConnectedPosition = pos;
                // Notify that the position has been changed along with its change properties.
                var /** @type {?} */ scrollableViewProperties = this.getScrollableViewProperties(element);
                var /** @type {?} */ positionChange = new ConnectedOverlayPositionChange(pos, scrollableViewProperties);
                this._onPositionChange.next(positionChange);
                return;
            }
            else if (!fallbackPoint || fallbackPoint.visibleArea < overlayPoint.visibleArea) {
                fallbackPoint = overlayPoint;
                fallbackPosition = pos;
            }
        }
        // If none of the preferred positions were in the viewport, take the one
        // with the largest visible area.
        this._setElementPosition(element, overlayRect, /** @type {?} */ ((fallbackPoint)), /** @type {?} */ ((fallbackPosition)));
    };
    /**
     * This re-aligns the overlay element with the trigger in its last calculated position,
     * even if a position higher in the "preferred positions" list would now fit. This
     * allows one to re-align the panel without changing the orientation of the panel.
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.recalculateLastPosition = function () {
        var /** @type {?} */ originRect = this._origin.getBoundingClientRect();
        var /** @type {?} */ overlayRect = this._pane.getBoundingClientRect();
        var /** @type {?} */ viewportRect = this._viewportRuler.getViewportRect();
        var /** @type {?} */ lastPosition = this._lastConnectedPosition || this._preferredPositions[0];
        var /** @type {?} */ originPoint = this._getOriginConnectionPoint(originRect, lastPosition);
        var /** @type {?} */ overlayPoint = this._getOverlayPoint(originPoint, overlayRect, viewportRect, lastPosition);
        this._setElementPosition(this._pane, overlayRect, overlayPoint, lastPosition);
    };
    /**
     * Sets the list of Scrollable containers that host the origin element so that
     * on reposition we can evaluate if it or the overlay has been clipped or outside view. Every
     * Scrollable must be an ancestor element of the strategy's origin element.
     * @param {?} scrollables
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.withScrollableContainers = function (scrollables) {
        this.scrollables = scrollables;
    };
    /**
     * Adds a new preferred fallback position.
     * @param {?} originPos
     * @param {?} overlayPos
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.withFallbackPosition = function (originPos, overlayPos) {
        this._preferredPositions.push(new ConnectionPositionPair(originPos, overlayPos));
        return this;
    };
    /**
     * Sets the layout direction so the overlay's position can be adjusted to match.
     * @param {?} dir New layout direction.
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.withDirection = function (dir) {
        this._dir = dir;
        return this;
    };
    /**
     * Sets an offset for the overlay's connection point on the x-axis
     * @param {?} offset New offset in the X axis.
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.withOffsetX = function (offset) {
        this._offsetX = offset;
        return this;
    };
    /**
     * Sets an offset for the overlay's connection point on the y-axis
     * @param {?} offset New offset in the Y axis.
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.withOffsetY = function (offset) {
        this._offsetY = offset;
        return this;
    };
    /**
     * Gets the horizontal (x) "start" dimension based on whether the overlay is in an RTL context.
     * @param {?} rect
     * @return {?}
     */
    ConnectedPositionStrategy.prototype._getStartX = function (rect) {
        return this._isRtl ? rect.right : rect.left;
    };
    /**
     * Gets the horizontal (x) "end" dimension based on whether the overlay is in an RTL context.
     * @param {?} rect
     * @return {?}
     */
    ConnectedPositionStrategy.prototype._getEndX = function (rect) {
        return this._isRtl ? rect.left : rect.right;
    };
    /**
     * Gets the (x, y) coordinate of a connection point on the origin based on a relative position.
     * @param {?} originRect
     * @param {?} pos
     * @return {?}
     */
    ConnectedPositionStrategy.prototype._getOriginConnectionPoint = function (originRect, pos) {
        var /** @type {?} */ originStartX = this._getStartX(originRect);
        var /** @type {?} */ originEndX = this._getEndX(originRect);
        var /** @type {?} */ x;
        if (pos.originX == 'center') {
            x = originStartX + (originRect.width / 2);
        }
        else {
            x = pos.originX == 'start' ? originStartX : originEndX;
        }
        var /** @type {?} */ y;
        if (pos.originY == 'center') {
            y = originRect.top + (originRect.height / 2);
        }
        else {
            y = pos.originY == 'top' ? originRect.top : originRect.bottom;
        }
        return { x: x, y: y };
    };
    /**
     * Gets the (x, y) coordinate of the top-left corner of the overlay given a given position and
     * origin point to which the overlay should be connected, as well as how much of the element
     * would be inside the viewport at that position.
     * @param {?} originPoint
     * @param {?} overlayRect
     * @param {?} viewportRect
     * @param {?} pos
     * @return {?}
     */
    ConnectedPositionStrategy.prototype._getOverlayPoint = function (originPoint, overlayRect, viewportRect, pos) {
        // Calculate the (overlayStartX, overlayStartY), the start of the potential overlay position
        // relative to the origin point.
        var /** @type {?} */ overlayStartX;
        if (pos.overlayX == 'center') {
            overlayStartX = -overlayRect.width / 2;
        }
        else if (pos.overlayX === 'start') {
            overlayStartX = this._isRtl ? -overlayRect.width : 0;
        }
        else {
            overlayStartX = this._isRtl ? 0 : -overlayRect.width;
        }
        var /** @type {?} */ overlayStartY;
        if (pos.overlayY == 'center') {
            overlayStartY = -overlayRect.height / 2;
        }
        else {
            overlayStartY = pos.overlayY == 'top' ? 0 : -overlayRect.height;
        }
        // The (x, y) coordinates of the overlay.
        var /** @type {?} */ x = originPoint.x + overlayStartX + this._offsetX;
        var /** @type {?} */ y = originPoint.y + overlayStartY + this._offsetY;
        // How much the overlay would overflow at this position, on each side.
        var /** @type {?} */ leftOverflow = 0 - x;
        var /** @type {?} */ rightOverflow = (x + overlayRect.width) - viewportRect.width;
        var /** @type {?} */ topOverflow = 0 - y;
        var /** @type {?} */ bottomOverflow = (y + overlayRect.height) - viewportRect.height;
        // Visible parts of the element on each axis.
        var /** @type {?} */ visibleWidth = this._subtractOverflows(overlayRect.width, leftOverflow, rightOverflow);
        var /** @type {?} */ visibleHeight = this._subtractOverflows(overlayRect.height, topOverflow, bottomOverflow);
        // The area of the element that's within the viewport.
        var /** @type {?} */ visibleArea = visibleWidth * visibleHeight;
        var /** @type {?} */ fitsInViewport = (overlayRect.width * overlayRect.height) === visibleArea;
        return { x: x, y: y, fitsInViewport: fitsInViewport, visibleArea: visibleArea };
    };
    /**
     * Gets the view properties of the trigger and overlay, including whether they are clipped
     * or completely outside the view of any of the strategy's scrollables.
     * @param {?} overlay
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.getScrollableViewProperties = function (overlay) {
        var _this = this;
        var /** @type {?} */ originBounds = this._getElementBounds(this._origin);
        var /** @type {?} */ overlayBounds = this._getElementBounds(overlay);
        var /** @type {?} */ scrollContainerBounds = this.scrollables.map(function (scrollable) {
            return _this._getElementBounds(scrollable.getElementRef().nativeElement);
        });
        return {
            isOriginClipped: this.isElementClipped(originBounds, scrollContainerBounds),
            isOriginOutsideView: this.isElementOutsideView(originBounds, scrollContainerBounds),
            isOverlayClipped: this.isElementClipped(overlayBounds, scrollContainerBounds),
            isOverlayOutsideView: this.isElementOutsideView(overlayBounds, scrollContainerBounds),
        };
    };
    /**
     * Whether the element is completely out of the view of any of the containers.
     * @param {?} elementBounds
     * @param {?} containersBounds
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.isElementOutsideView = function (elementBounds, containersBounds) {
        return containersBounds.some(function (containerBounds) {
            var /** @type {?} */ outsideAbove = elementBounds.bottom < containerBounds.top;
            var /** @type {?} */ outsideBelow = elementBounds.top > containerBounds.bottom;
            var /** @type {?} */ outsideLeft = elementBounds.right < containerBounds.left;
            var /** @type {?} */ outsideRight = elementBounds.left > containerBounds.right;
            return outsideAbove || outsideBelow || outsideLeft || outsideRight;
        });
    };
    /**
     * Whether the element is clipped by any of the containers.
     * @param {?} elementBounds
     * @param {?} containersBounds
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.isElementClipped = function (elementBounds, containersBounds) {
        return containersBounds.some(function (containerBounds) {
            var /** @type {?} */ clippedAbove = elementBounds.top < containerBounds.top;
            var /** @type {?} */ clippedBelow = elementBounds.bottom > containerBounds.bottom;
            var /** @type {?} */ clippedLeft = elementBounds.left < containerBounds.left;
            var /** @type {?} */ clippedRight = elementBounds.right > containerBounds.right;
            return clippedAbove || clippedBelow || clippedLeft || clippedRight;
        });
    };
    /**
     * Physically positions the overlay element to the given coordinate.
     * @param {?} element
     * @param {?} overlayRect
     * @param {?} overlayPoint
     * @param {?} pos
     * @return {?}
     */
    ConnectedPositionStrategy.prototype._setElementPosition = function (element, overlayRect, overlayPoint, pos) {
        // We want to set either `top` or `bottom` based on whether the overlay wants to appear above
        // or below the origin and the direction in which the element will expand.
        var /** @type {?} */ verticalStyleProperty = pos.overlayY === 'bottom' ? 'bottom' : 'top';
        // When using `bottom`, we adjust the y position such that it is the distance
        // from the bottom of the viewport rather than the top.
        var /** @type {?} */ y = verticalStyleProperty === 'top' ?
            overlayPoint.y :
            document.documentElement.clientHeight - (overlayPoint.y + overlayRect.height);
        // We want to set either `left` or `right` based on whether the overlay wants to appear "before"
        // or "after" the origin, which determines the direction in which the element will expand.
        // For the horizontal axis, the meaning of "before" and "after" change based on whether the
        // page is in RTL or LTR.
        var /** @type {?} */ horizontalStyleProperty;
        if (this._dir === 'rtl') {
            horizontalStyleProperty = pos.overlayX === 'end' ? 'left' : 'right';
        }
        else {
            horizontalStyleProperty = pos.overlayX === 'end' ? 'right' : 'left';
        }
        // When we're setting `right`, we adjust the x position such that it is the distance
        // from the right edge of the viewport rather than the left edge.
        var /** @type {?} */ x = horizontalStyleProperty === 'left' ?
            overlayPoint.x :
            document.documentElement.clientWidth - (overlayPoint.x + overlayRect.width);
        // Reset any existing styles. This is necessary in case the preferred position has
        // changed since the last `apply`.
        ['top', 'bottom', 'left', 'right'].forEach(function (p) { return element.style[p] = null; });
        element.style[verticalStyleProperty] = y + "px";
        element.style[horizontalStyleProperty] = x + "px";
    };
    /**
     * Returns the bounding positions of the provided element with respect to the viewport.
     * @param {?} element
     * @return {?}
     */
    ConnectedPositionStrategy.prototype._getElementBounds = function (element) {
        var /** @type {?} */ boundingClientRect = element.getBoundingClientRect();
        return {
            top: boundingClientRect.top,
            right: boundingClientRect.left + boundingClientRect.width,
            bottom: boundingClientRect.top + boundingClientRect.height,
            left: boundingClientRect.left
        };
    };
    /**
     * Subtracts the amount that an element is overflowing on an axis from it's length.
     * @param {?} length
     * @param {...?} overflows
     * @return {?}
     */
    ConnectedPositionStrategy.prototype._subtractOverflows = function (length) {
        var overflows = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            overflows[_i - 1] = arguments[_i];
        }
        return overflows.reduce(function (currentValue, currentOverflow) {
            return currentValue - Math.max(currentOverflow, 0);
        }, length);
    };
    return ConnectedPositionStrategy;
}());
/**
 * A strategy for positioning overlays. Using this strategy, an overlay is given an
 * explicit position relative to the browser's viewport. We use flexbox, instead of
 * transforms, in order to avoid issues with subpixel rendering which can cause the
 * element to become blurry.
 */
var GlobalPositionStrategy = (function () {
    function GlobalPositionStrategy() {
        this._cssPosition = 'static';
        this._topOffset = '';
        this._bottomOffset = '';
        this._leftOffset = '';
        this._rightOffset = '';
        this._alignItems = '';
        this._justifyContent = '';
        this._width = '';
        this._height = '';
        this._wrapper = null;
    }
    /**
     * Sets the top position of the overlay. Clears any previously set vertical position.
     * @param {?=} value New top offset.
     * @return {?}
     */
    GlobalPositionStrategy.prototype.top = function (value) {
        if (value === void 0) { value = ''; }
        this._bottomOffset = '';
        this._topOffset = value;
        this._alignItems = 'flex-start';
        return this;
    };
    /**
     * Sets the left position of the overlay. Clears any previously set horizontal position.
     * @param {?=} value New left offset.
     * @return {?}
     */
    GlobalPositionStrategy.prototype.left = function (value) {
        if (value === void 0) { value = ''; }
        this._rightOffset = '';
        this._leftOffset = value;
        this._justifyContent = 'flex-start';
        return this;
    };
    /**
     * Sets the bottom position of the overlay. Clears any previously set vertical position.
     * @param {?=} value New bottom offset.
     * @return {?}
     */
    GlobalPositionStrategy.prototype.bottom = function (value) {
        if (value === void 0) { value = ''; }
        this._topOffset = '';
        this._bottomOffset = value;
        this._alignItems = 'flex-end';
        return this;
    };
    /**
     * Sets the right position of the overlay. Clears any previously set horizontal position.
     * @param {?=} value New right offset.
     * @return {?}
     */
    GlobalPositionStrategy.prototype.right = function (value) {
        if (value === void 0) { value = ''; }
        this._leftOffset = '';
        this._rightOffset = value;
        this._justifyContent = 'flex-end';
        return this;
    };
    /**
     * Sets the overlay width and clears any previously set width.
     * @param {?=} value New width for the overlay
     * @return {?}
     */
    GlobalPositionStrategy.prototype.width = function (value) {
        if (value === void 0) { value = ''; }
        this._width = value;
        // When the width is 100%, we should reset the `left` and the offset,
        // in order to ensure that the element is flush against the viewport edge.
        if (value === '100%') {
            this.left('0px');
        }
        return this;
    };
    /**
     * Sets the overlay height and clears any previously set height.
     * @param {?=} value New height for the overlay
     * @return {?}
     */
    GlobalPositionStrategy.prototype.height = function (value) {
        if (value === void 0) { value = ''; }
        this._height = value;
        // When the height is 100%, we should reset the `top` and the offset,
        // in order to ensure that the element is flush against the viewport edge.
        if (value === '100%') {
            this.top('0px');
        }
        return this;
    };
    /**
     * Centers the overlay horizontally with an optional offset.
     * Clears any previously set horizontal position.
     *
     * @param {?=} offset Overlay offset from the horizontal center.
     * @return {?}
     */
    GlobalPositionStrategy.prototype.centerHorizontally = function (offset) {
        if (offset === void 0) { offset = ''; }
        this.left(offset);
        this._justifyContent = 'center';
        return this;
    };
    /**
     * Centers the overlay vertically with an optional offset.
     * Clears any previously set vertical position.
     *
     * @param {?=} offset Overlay offset from the vertical center.
     * @return {?}
     */
    GlobalPositionStrategy.prototype.centerVertically = function (offset) {
        if (offset === void 0) { offset = ''; }
        this.top(offset);
        this._alignItems = 'center';
        return this;
    };
    /**
     * Apply the position to the element.
     * \@docs-private
     *
     * @param {?} element Element to which to apply the CSS.
     * @return {?} Resolved when the styles have been applied.
     */
    GlobalPositionStrategy.prototype.apply = function (element) {
        if (!this._wrapper && element.parentNode) {
            this._wrapper = document.createElement('div');
            this._wrapper.classList.add('cdk-global-overlay-wrapper');
            element.parentNode.insertBefore(this._wrapper, element);
            this._wrapper.appendChild(element);
        }
        var /** @type {?} */ styles = element.style;
        var /** @type {?} */ parentStyles = ((element.parentNode)).style;
        styles.position = this._cssPosition;
        styles.marginTop = this._topOffset;
        styles.marginLeft = this._leftOffset;
        styles.marginBottom = this._bottomOffset;
        styles.marginRight = this._rightOffset;
        styles.width = this._width;
        styles.height = this._height;
        parentStyles.justifyContent = this._justifyContent;
        parentStyles.alignItems = this._alignItems;
    };
    /**
     * Removes the wrapper element from the DOM.
     * @return {?}
     */
    GlobalPositionStrategy.prototype.dispose = function () {
        if (this._wrapper && this._wrapper.parentNode) {
            this._wrapper.parentNode.removeChild(this._wrapper);
            this._wrapper = null;
        }
    };
    return GlobalPositionStrategy;
}());
/**
 * Builder for overlay position strategy.
 */
var OverlayPositionBuilder = (function () {
    /**
     * @param {?} _viewportRuler
     */
    function OverlayPositionBuilder(_viewportRuler) {
        this._viewportRuler = _viewportRuler;
    }
    /**
     * Creates a global position strategy.
     * @return {?}
     */
    OverlayPositionBuilder.prototype.global = function () {
        return new GlobalPositionStrategy();
    };
    /**
     * Creates a relative position strategy.
     * @param {?} elementRef
     * @param {?} originPos
     * @param {?} overlayPos
     * @return {?}
     */
    OverlayPositionBuilder.prototype.connectedTo = function (elementRef, originPos, overlayPos) {
        return new ConnectedPositionStrategy(elementRef, originPos, overlayPos, this._viewportRuler);
    };
    return OverlayPositionBuilder;
}());
OverlayPositionBuilder.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
OverlayPositionBuilder.ctorParameters = function () { return [
    { type: ViewportRuler, },
]; };
/**
 * The OverlayContainer is the container in which all overlays will load.
 * It should be provided in the root component to ensure it is properly shared.
 */
var OverlayContainer = (function () {
    function OverlayContainer() {
    }
    Object.defineProperty(OverlayContainer.prototype, "themeClass", {
        /**
         * Base theme to be applied to all overlay-based components.
         * @return {?}
         */
        get: function () { return this._themeClass; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (this._containerElement) {
                this._containerElement.classList.remove(this._themeClass);
                if (value) {
                    this._containerElement.classList.add(value);
                }
            }
            this._themeClass = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method returns the overlay container element.  It will lazily
     * create the element the first time  it is called to facilitate using
     * the container in non-browser environments.
     * @return {?} the container element
     */
    OverlayContainer.prototype.getContainerElement = function () {
        if (!this._containerElement) {
            this._createContainer();
        }
        return this._containerElement;
    };
    /**
     * Create the overlay container element, which is simply a div
     * with the 'cdk-overlay-container' class on the document body.
     * @return {?}
     */
    OverlayContainer.prototype._createContainer = function () {
        var /** @type {?} */ container = document.createElement('div');
        container.classList.add('cdk-overlay-container');
        if (this._themeClass) {
            container.classList.add(this._themeClass);
        }
        document.body.appendChild(container);
        this._containerElement = container;
    };
    return OverlayContainer;
}());
OverlayContainer.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
OverlayContainer.ctorParameters = function () { return []; };
/**
 * @param {?} parentContainer
 * @return {?}
 */
function OVERLAY_CONTAINER_PROVIDER_FACTORY(parentContainer) {
    return parentContainer || new OverlayContainer();
}
var OVERLAY_CONTAINER_PROVIDER = {
    // If there is already an OverlayContainer available, use that. Otherwise, provide a new one.
    provide: OverlayContainer,
    deps: [[new _angular_core.Optional(), new _angular_core.SkipSelf(), OverlayContainer]],
    useFactory: OVERLAY_CONTAINER_PROVIDER_FACTORY
};
/**
 * Next overlay unique ID.
 */
var nextUniqueId = 0;
/**
 * The default state for newly created overlays.
 */
var defaultState = new OverlayState();
/**
 * Service to create Overlays. Overlays are dynamically added pieces of floating UI, meant to be
 * used as a low-level building building block for other components. Dialogs, tooltips, menus,
 * selects, etc. can all be built using overlays. The service should primarily be used by authors
 * of re-usable components rather than developers building end-user applications.
 *
 * An overlay *is* a PortalHost, so any kind of Portal can be loaded into one.
 */
var Overlay = (function () {
    /**
     * @param {?} scrollStrategies
     * @param {?} _overlayContainer
     * @param {?} _componentFactoryResolver
     * @param {?} _positionBuilder
     * @param {?} _appRef
     * @param {?} _injector
     * @param {?} _ngZone
     */
    function Overlay(scrollStrategies, _overlayContainer, _componentFactoryResolver, _positionBuilder, _appRef, _injector, _ngZone) {
        this.scrollStrategies = scrollStrategies;
        this._overlayContainer = _overlayContainer;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._positionBuilder = _positionBuilder;
        this._appRef = _appRef;
        this._injector = _injector;
        this._ngZone = _ngZone;
    }
    /**
     * Creates an overlay.
     * @param {?=} state State to apply to the overlay.
     * @return {?} Reference to the created overlay.
     */
    Overlay.prototype.create = function (state$$1) {
        if (state$$1 === void 0) { state$$1 = defaultState; }
        return this._createOverlayRef(this._createPaneElement(), state$$1);
    };
    /**
     * Returns a position builder that can be used, via fluent API,
     * to construct and configure a position strategy.
     * @return {?}
     */
    Overlay.prototype.position = function () {
        return this._positionBuilder;
    };
    /**
     * Creates the DOM element for an overlay and appends it to the overlay container.
     * @return {?} Newly-created pane element
     */
    Overlay.prototype._createPaneElement = function () {
        var /** @type {?} */ pane = document.createElement('div');
        pane.id = "cdk-overlay-" + nextUniqueId++;
        pane.classList.add('cdk-overlay-pane');
        this._overlayContainer.getContainerElement().appendChild(pane);
        return pane;
    };
    /**
     * Create a DomPortalHost into which the overlay content can be loaded.
     * @param {?} pane The DOM element to turn into a portal host.
     * @return {?} A portal host for the given DOM element.
     */
    Overlay.prototype._createPortalHost = function (pane) {
        return new _angular_cdk.DomPortalHost(pane, this._componentFactoryResolver, this._appRef, this._injector);
    };
    /**
     * Creates an OverlayRef for an overlay in the given DOM element.
     * @param {?} pane DOM element for the overlay
     * @param {?} state
     * @return {?}
     */
    Overlay.prototype._createOverlayRef = function (pane, state$$1) {
        var /** @type {?} */ scrollStrategy = state$$1.scrollStrategy || this.scrollStrategies.noop();
        var /** @type {?} */ portalHost = this._createPortalHost(pane);
        return new OverlayRef(portalHost, pane, state$$1, scrollStrategy, this._ngZone);
    };
    return Overlay;
}());
Overlay.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
Overlay.ctorParameters = function () { return [
    { type: ScrollStrategyOptions, },
    { type: OverlayContainer, },
    { type: _angular_core.ComponentFactoryResolver, },
    { type: OverlayPositionBuilder, },
    { type: _angular_core.ApplicationRef, },
    { type: _angular_core.Injector, },
    { type: _angular_core.NgZone, },
]; };
/**
 * Default set of positions for the overlay. Follows the behavior of a dropdown.
 */
var defaultPositionList = [
    new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
    new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
];
/**
 * Directive applied to an element to make it usable as an origin for an Overlay using a
 * ConnectedPositionStrategy.
 */
var OverlayOrigin = (function () {
    /**
     * @param {?} elementRef
     */
    function OverlayOrigin(elementRef) {
        this.elementRef = elementRef;
    }
    return OverlayOrigin;
}());
OverlayOrigin.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]',
                exportAs: 'cdkOverlayOrigin',
            },] },
];
/**
 * @nocollapse
 */
OverlayOrigin.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
]; };
/**
 * Directive to facilitate declarative creation of an Overlay using a ConnectedPositionStrategy.
 */
var ConnectedOverlayDirective = (function () {
    /**
     * @param {?} _overlay
     * @param {?} _renderer
     * @param {?} templateRef
     * @param {?} viewContainerRef
     * @param {?} _dir
     */
    function ConnectedOverlayDirective(_overlay, _renderer, templateRef, viewContainerRef, _dir) {
        this._overlay = _overlay;
        this._renderer = _renderer;
        this._dir = _dir;
        this._hasBackdrop = false;
        this._offsetX = 0;
        this._offsetY = 0;
        /**
         * Strategy to be used when handling scroll events while the overlay is open.
         */
        this.scrollStrategy = this._overlay.scrollStrategies.reposition();
        /**
         * Whether the overlay is open.
         */
        this.open = false;
        /**
         * Event emitted when the backdrop is clicked.
         */
        this.backdropClick = new _angular_core.EventEmitter();
        /**
         * Event emitted when the position has changed.
         */
        this.positionChange = new _angular_core.EventEmitter();
        /**
         * Event emitted when the overlay has been attached.
         */
        this.attach = new _angular_core.EventEmitter();
        /**
         * Event emitted when the overlay has been detached.
         */
        this.detach = new _angular_core.EventEmitter();
        this._templatePortal = new _angular_cdk.TemplatePortal(templateRef, viewContainerRef);
    }
    Object.defineProperty(ConnectedOverlayDirective.prototype, "offsetX", {
        /**
         * The offset in pixels for the overlay connection point on the x-axis
         * @return {?}
         */
        get: function () {
            return this._offsetX;
        },
        /**
         * @param {?} offsetX
         * @return {?}
         */
        set: function (offsetX) {
            this._offsetX = offsetX;
            if (this._position) {
                this._position.withOffsetX(offsetX);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedOverlayDirective.prototype, "offsetY", {
        /**
         * The offset in pixels for the overlay connection point on the y-axis
         * @return {?}
         */
        get: function () {
            return this._offsetY;
        },
        /**
         * @param {?} offsetY
         * @return {?}
         */
        set: function (offsetY) {
            this._offsetY = offsetY;
            if (this._position) {
                this._position.withOffsetY(offsetY);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedOverlayDirective.prototype, "hasBackdrop", {
        /**
         * Whether or not the overlay should attach a backdrop.
         * @return {?}
         */
        get: function () {
            return this._hasBackdrop;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._hasBackdrop = _angular_cdk.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedOverlayDirective.prototype, "overlayRef", {
        /**
         * The associated overlay reference.
         * @return {?}
         */
        get: function () {
            return this._overlayRef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedOverlayDirective.prototype, "dir", {
        /**
         * The element's layout direction.
         * @return {?}
         */
        get: function () {
            return this._dir ? this._dir.value : 'ltr';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ConnectedOverlayDirective.prototype.ngOnDestroy = function () {
        this._destroyOverlay();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    ConnectedOverlayDirective.prototype.ngOnChanges = function (changes) {
        if (changes['open']) {
            this.open ? this._attachOverlay() : this._detachOverlay();
        }
    };
    /**
     * Creates an overlay
     * @return {?}
     */
    ConnectedOverlayDirective.prototype._createOverlay = function () {
        if (!this.positions || !this.positions.length) {
            this.positions = defaultPositionList;
        }
        this._overlayRef = this._overlay.create(this._buildConfig());
    };
    /**
     * Builds the overlay config based on the directive's inputs
     * @return {?}
     */
    ConnectedOverlayDirective.prototype._buildConfig = function () {
        var /** @type {?} */ overlayConfig = new OverlayState();
        if (this.width || this.width === 0) {
            overlayConfig.width = this.width;
        }
        if (this.height || this.height === 0) {
            overlayConfig.height = this.height;
        }
        if (this.minWidth || this.minWidth === 0) {
            overlayConfig.minWidth = this.minWidth;
        }
        if (this.minHeight || this.minHeight === 0) {
            overlayConfig.minHeight = this.minHeight;
        }
        overlayConfig.hasBackdrop = this.hasBackdrop;
        if (this.backdropClass) {
            overlayConfig.backdropClass = this.backdropClass;
        }
        this._position = (this._createPositionStrategy());
        overlayConfig.positionStrategy = this._position;
        overlayConfig.scrollStrategy = this.scrollStrategy;
        return overlayConfig;
    };
    /**
     * Returns the position strategy of the overlay to be set on the overlay config
     * @return {?}
     */
    ConnectedOverlayDirective.prototype._createPositionStrategy = function () {
        var /** @type {?} */ pos = this.positions[0];
        var /** @type {?} */ originPoint = { originX: pos.originX, originY: pos.originY };
        var /** @type {?} */ overlayPoint = { overlayX: pos.overlayX, overlayY: pos.overlayY };
        var /** @type {?} */ strategy = this._overlay.position()
            .connectedTo(this.origin.elementRef, originPoint, overlayPoint)
            .withOffsetX(this.offsetX)
            .withOffsetY(this.offsetY);
        this._handlePositionChanges(strategy);
        return strategy;
    };
    /**
     * @param {?} strategy
     * @return {?}
     */
    ConnectedOverlayDirective.prototype._handlePositionChanges = function (strategy) {
        var _this = this;
        for (var /** @type {?} */ i = 1; i < this.positions.length; i++) {
            strategy.withFallbackPosition({ originX: this.positions[i].originX, originY: this.positions[i].originY }, { overlayX: this.positions[i].overlayX, overlayY: this.positions[i].overlayY });
        }
        this._positionSubscription =
            strategy.onPositionChange.subscribe(function (pos) { return _this.positionChange.emit(pos); });
    };
    /**
     * Attaches the overlay and subscribes to backdrop clicks if backdrop exists
     * @return {?}
     */
    ConnectedOverlayDirective.prototype._attachOverlay = function () {
        var _this = this;
        if (!this._overlayRef) {
            this._createOverlay();
        }
        this._position.withDirection(this.dir);
        this._overlayRef.getState().direction = this.dir;
        this._initEscapeListener();
        if (!this._overlayRef.hasAttached()) {
            this._overlayRef.attach(this._templatePortal);
            this.attach.emit();
        }
        if (this.hasBackdrop) {
            this._backdropSubscription = this._overlayRef.backdropClick().subscribe(function () {
                _this.backdropClick.emit();
            });
        }
    };
    /**
     * Detaches the overlay and unsubscribes to backdrop clicks if backdrop exists
     * @return {?}
     */
    ConnectedOverlayDirective.prototype._detachOverlay = function () {
        if (this._overlayRef) {
            this._overlayRef.detach();
            this.detach.emit();
        }
        if (this._backdropSubscription) {
            this._backdropSubscription.unsubscribe();
            this._backdropSubscription = null;
        }
        if (this._escapeListener) {
            this._escapeListener();
        }
    };
    /**
     * Destroys the overlay created by this directive.
     * @return {?}
     */
    ConnectedOverlayDirective.prototype._destroyOverlay = function () {
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
        if (this._backdropSubscription) {
            this._backdropSubscription.unsubscribe();
        }
        if (this._positionSubscription) {
            this._positionSubscription.unsubscribe();
        }
        if (this._escapeListener) {
            this._escapeListener();
        }
    };
    /**
     * Sets the event listener that closes the overlay when pressing Escape.
     * @return {?}
     */
    ConnectedOverlayDirective.prototype._initEscapeListener = function () {
        var _this = this;
        this._escapeListener = this._renderer.listen('document', 'keydown', function (event) {
            if (event.keyCode === _angular_cdk.ESCAPE) {
                _this._detachOverlay();
            }
        });
    };
    return ConnectedOverlayDirective;
}());
ConnectedOverlayDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]',
                exportAs: 'cdkConnectedOverlay'
            },] },
];
/**
 * @nocollapse
 */
ConnectedOverlayDirective.ctorParameters = function () { return [
    { type: Overlay, },
    { type: _angular_core.Renderer2, },
    { type: _angular_core.TemplateRef, },
    { type: _angular_core.ViewContainerRef, },
    { type: _angular_cdk.Directionality, decorators: [{ type: _angular_core.Optional },] },
]; };
ConnectedOverlayDirective.propDecorators = {
    'origin': [{ type: _angular_core.Input },],
    'positions': [{ type: _angular_core.Input },],
    'offsetX': [{ type: _angular_core.Input },],
    'offsetY': [{ type: _angular_core.Input },],
    'width': [{ type: _angular_core.Input },],
    'height': [{ type: _angular_core.Input },],
    'minWidth': [{ type: _angular_core.Input },],
    'minHeight': [{ type: _angular_core.Input },],
    'backdropClass': [{ type: _angular_core.Input },],
    'scrollStrategy': [{ type: _angular_core.Input },],
    'open': [{ type: _angular_core.Input },],
    'hasBackdrop': [{ type: _angular_core.Input },],
    'backdropClick': [{ type: _angular_core.Output },],
    'positionChange': [{ type: _angular_core.Output },],
    'attach': [{ type: _angular_core.Output },],
    'detach': [{ type: _angular_core.Output },],
};
/**
 * The FullscreenOverlayContainer is the alternative to OverlayContainer
 * that supports correct displaying of overlay elements in Fullscreen mode
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen
 * It should be provided in the root component that way:
 * providers: [
 *   {provide: OverlayContainer, useClass: FullscreenOverlayContainer}
 * ],
 */
var FullscreenOverlayContainer = (function (_super) {
    __extends(FullscreenOverlayContainer, _super);
    function FullscreenOverlayContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    FullscreenOverlayContainer.prototype._createContainer = function () {
        var _this = this;
        _super.prototype._createContainer.call(this);
        this._adjustParentForFullscreenChange();
        this._addFullscreenChangeListener(function () { return _this._adjustParentForFullscreenChange(); });
    };
    /**
     * @return {?}
     */
    FullscreenOverlayContainer.prototype._adjustParentForFullscreenChange = function () {
        if (!this._containerElement) {
            return;
        }
        var /** @type {?} */ fullscreenElement = this.getFullscreenElement();
        var /** @type {?} */ parent = fullscreenElement || document.body;
        parent.appendChild(this._containerElement);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    FullscreenOverlayContainer.prototype._addFullscreenChangeListener = function (fn) {
        if (document.fullscreenEnabled) {
            document.addEventListener('fullscreenchange', fn);
        }
        else if (document.webkitFullscreenEnabled) {
            document.addEventListener('webkitfullscreenchange', fn);
        }
        else if (((document)).mozFullScreenEnabled) {
            document.addEventListener('mozfullscreenchange', fn);
        }
        else if (((document)).msFullscreenEnabled) {
            document.addEventListener('MSFullscreenChange', fn);
        }
    };
    /**
     * When the page is put into fullscreen mode, a specific element is specified.
     * Only that element and its children are visible when in fullscreen mode.
     * @return {?}
     */
    FullscreenOverlayContainer.prototype.getFullscreenElement = function () {
        return document.fullscreenElement ||
            document.webkitFullscreenElement ||
            ((document)).mozFullScreenElement ||
            ((document)).msFullscreenElement ||
            null;
    };
    return FullscreenOverlayContainer;
}(OverlayContainer));
FullscreenOverlayContainer.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
FullscreenOverlayContainer.ctorParameters = function () { return []; };
var OVERLAY_PROVIDERS = [
    Overlay,
    OverlayPositionBuilder,
    VIEWPORT_RULER_PROVIDER,
    OVERLAY_CONTAINER_PROVIDER,
];
var OverlayModule = (function () {
    function OverlayModule() {
    }
    return OverlayModule;
}());
OverlayModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_cdk.PortalModule, ScrollDispatchModule],
                exports: [ConnectedOverlayDirective, OverlayOrigin, ScrollDispatchModule],
                declarations: [ConnectedOverlayDirective, OverlayOrigin],
                providers: [OVERLAY_PROVIDERS],
            },] },
];
/**
 * @nocollapse
 */
OverlayModule.ctorParameters = function () { return []; };
var GestureConfig = (function (_super) {
    __extends(GestureConfig, _super);
    function GestureConfig() {
        var _this = _super.call(this) || this;
        _this._hammer = typeof window !== 'undefined' ? ((window)).Hammer : null;
        /* List of new event names to add to the gesture support list */
        _this.events = _this._hammer ? [
            'longpress',
            'slide',
            'slidestart',
            'slideend',
            'slideright',
            'slideleft'
        ] : [];
        if (!_this._hammer && _angular_core.isDevMode()) {
            console.warn('Could not find HammerJS. Certain Angular Material ' +
                'components may not work correctly.');
        }
        return _this;
    }
    /**
     * Builds Hammer instance manually to add custom recognizers that match the Material Design spec.
     *
     * Our gesture names come from the Material Design gestures spec:
     * https://www.google.com/design/spec/patterns/gestures.html#gestures-touch-mechanics
     *
     * More information on default recognizers can be found in Hammer docs:
     * http://hammerjs.github.io/recognizer-pan/
     * http://hammerjs.github.io/recognizer-press/
     *
     * @param {?} element Element to which to assign the new HammerJS gestures.
     * @return {?} Newly-created HammerJS instance.
     */
    GestureConfig.prototype.buildHammer = function (element) {
        var /** @type {?} */ mc = new this._hammer(element);
        // Default Hammer Recognizers.
        var /** @type {?} */ pan = new this._hammer.Pan();
        var /** @type {?} */ swipe = new this._hammer.Swipe();
        var /** @type {?} */ press = new this._hammer.Press();
        // Notice that a HammerJS recognizer can only depend on one other recognizer once.
        // Otherwise the previous `recognizeWith` will be dropped.
        // TODO: Confirm threshold numbers with Material Design UX Team
        var /** @type {?} */ slide = this._createRecognizer(pan, { event: 'slide', threshold: 0 }, swipe);
        var /** @type {?} */ longpress = this._createRecognizer(press, { event: 'longpress', time: 500 });
        // Overwrite the default `pan` event to use the swipe event.
        pan.recognizeWith(swipe);
        // Add customized gestures to Hammer manager
        mc.add([swipe, press, pan, slide, longpress]);
        return (mc);
    };
    /**
     * Creates a new recognizer, without affecting the default recognizers of HammerJS
     * @param {?} base
     * @param {?} options
     * @param {...?} inheritances
     * @return {?}
     */
    GestureConfig.prototype._createRecognizer = function (base, options) {
        var inheritances = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            inheritances[_i - 2] = arguments[_i];
        }
        var /** @type {?} */ recognizer = new ((base.constructor))(options);
        inheritances.push(base);
        inheritances.forEach(function (item) { return recognizer.recognizeWith(item); });
        return recognizer;
    };
    return GestureConfig;
}(_angular_platformBrowser.HammerGestureConfig));
GestureConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
GestureConfig.ctorParameters = function () { return []; };
/**
 * Class to be used to power selecting one or more options from a list.
 * \@docs-private
 */
var SelectionModel = (function () {
    /**
     * @param {?=} _isMulti
     * @param {?=} initiallySelectedValues
     * @param {?=} _emitChanges
     */
    function SelectionModel(_isMulti, initiallySelectedValues, _emitChanges) {
        if (_isMulti === void 0) { _isMulti = false; }
        if (_emitChanges === void 0) { _emitChanges = true; }
        var _this = this;
        this._isMulti = _isMulti;
        this._emitChanges = _emitChanges;
        /**
         * Currently-selected values.
         */
        this._selection = new Set();
        /**
         * Keeps track of the deselected options that haven't been emitted by the change event.
         */
        this._deselectedToEmit = [];
        /**
         * Keeps track of the selected option that haven't been emitted by the change event.
         */
        this._selectedToEmit = [];
        /**
         * Event emitted when the value has changed.
         */
        this.onChange = this._emitChanges ? new rxjs_Subject.Subject() : null;
        if (initiallySelectedValues) {
            if (_isMulti) {
                initiallySelectedValues.forEach(function (value) { return _this._markSelected(value); });
            }
            else {
                this._markSelected(initiallySelectedValues[0]);
            }
            // Clear the array in order to avoid firing the change event for preselected values.
            this._selectedToEmit.length = 0;
        }
    }
    Object.defineProperty(SelectionModel.prototype, "selected", {
        /**
         * Selected value(s).
         * @return {?}
         */
        get: function () {
            if (!this._selected) {
                this._selected = Array.from(this._selection.values());
            }
            return this._selected;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Selects a value or an array of values.
     * @param {?} value
     * @return {?}
     */
    SelectionModel.prototype.select = function (value) {
        this._markSelected(value);
        this._emitChangeEvent();
    };
    /**
     * Deselects a value or an array of values.
     * @param {?} value
     * @return {?}
     */
    SelectionModel.prototype.deselect = function (value) {
        this._unmarkSelected(value);
        this._emitChangeEvent();
    };
    /**
     * Toggles a value between selected and deselected.
     * @param {?} value
     * @return {?}
     */
    SelectionModel.prototype.toggle = function (value) {
        this.isSelected(value) ? this.deselect(value) : this.select(value);
    };
    /**
     * Clears all of the selected values.
     * @return {?}
     */
    SelectionModel.prototype.clear = function () {
        this._unmarkAll();
        this._emitChangeEvent();
    };
    /**
     * Determines whether a value is selected.
     * @param {?} value
     * @return {?}
     */
    SelectionModel.prototype.isSelected = function (value) {
        return this._selection.has(value);
    };
    /**
     * Determines whether the model does not have a value.
     * @return {?}
     */
    SelectionModel.prototype.isEmpty = function () {
        return this._selection.size === 0;
    };
    /**
     * Determines whether the model has a value.
     * @return {?}
     */
    SelectionModel.prototype.hasValue = function () {
        return !this.isEmpty();
    };
    /**
     * Sorts the selected values based on a predicate function.
     * @param {?=} predicate
     * @return {?}
     */
    SelectionModel.prototype.sort = function (predicate) {
        if (this._isMulti && this._selected) {
            this._selected.sort(predicate);
        }
    };
    /**
     * Emits a change event and clears the records of selected and deselected values.
     * @return {?}
     */
    SelectionModel.prototype._emitChangeEvent = function () {
        if (this._selectedToEmit.length || this._deselectedToEmit.length) {
            var /** @type {?} */ eventData = new SelectionChange(this._selectedToEmit, this._deselectedToEmit);
            if (this.onChange) {
                this.onChange.next(eventData);
            }
            this._deselectedToEmit = [];
            this._selectedToEmit = [];
        }
        this._selected = null;
    };
    /**
     * Selects a value.
     * @param {?} value
     * @return {?}
     */
    SelectionModel.prototype._markSelected = function (value) {
        if (!this.isSelected(value)) {
            if (!this._isMulti) {
                this._unmarkAll();
            }
            this._selection.add(value);
            if (this._emitChanges) {
                this._selectedToEmit.push(value);
            }
        }
    };
    /**
     * Deselects a value.
     * @param {?} value
     * @return {?}
     */
    SelectionModel.prototype._unmarkSelected = function (value) {
        if (this.isSelected(value)) {
            this._selection.delete(value);
            if (this._emitChanges) {
                this._deselectedToEmit.push(value);
            }
        }
    };
    /**
     * Clears out the selected values.
     * @return {?}
     */
    SelectionModel.prototype._unmarkAll = function () {
        var _this = this;
        if (!this.isEmpty()) {
            this._selection.forEach(function (value) { return _this._unmarkSelected(value); });
        }
    };
    return SelectionModel;
}());
/**
 * Describes an event emitted when the value of a MdSelectionModel has changed.
 * \@docs-private
 */
var SelectionChange = (function () {
    /**
     * @param {?=} added
     * @param {?=} removed
     */
    function SelectionChange(added, removed) {
        this.added = added;
        this.removed = removed;
    }
    return SelectionChange;
}());
/**
 * Class to coordinate unique selection based on name.
 * Intended to be consumed as an Angular service.
 * This service is needed because native radio change events are only fired on the item currently
 * being selected, and we still need to uncheck the previous selection.
 *
 * This service does not *store* any IDs and names because they may change at any time, so it is
 * less error-prone if they are simply passed through when the events occur.
 */
var UniqueSelectionDispatcher = (function () {
    function UniqueSelectionDispatcher() {
        this._listeners = [];
    }
    /**
     * Notify other items that selection for the given name has been set.
     * @param {?} id ID of the item.
     * @param {?} name Name of the item.
     * @return {?}
     */
    UniqueSelectionDispatcher.prototype.notify = function (id, name) {
        for (var _i = 0, _a = this._listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(id, name);
        }
    };
    /**
     * Listen for future changes to item selection.
     * @param {?} listener
     * @return {?} Function used to deregister listener
     *
     */
    UniqueSelectionDispatcher.prototype.listen = function (listener) {
        var _this = this;
        this._listeners.push(listener);
        return function () {
            _this._listeners = _this._listeners.filter(function (registered) {
                return listener !== registered;
            });
        };
    };
    return UniqueSelectionDispatcher;
}());
UniqueSelectionDispatcher.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
UniqueSelectionDispatcher.ctorParameters = function () { return []; };
/**
 * @param {?} parentDispatcher
 * @return {?}
 */
function UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY(parentDispatcher) {
    return parentDispatcher || new UniqueSelectionDispatcher();
}
var UNIQUE_SELECTION_DISPATCHER_PROVIDER = {
    // If there is already a dispatcher available, use that. Otherwise, provide a new one.
    provide: UniqueSelectionDispatcher,
    deps: [[new _angular_core.Optional(), new _angular_core.SkipSelf(), UniqueSelectionDispatcher]],
    useFactory: UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY
};
// This is the value used by AngularJS Material. Through trial and error (on iPhone 6S) they found
// that a value of around 650ms seems appropriate.
var TOUCH_BUFFER_MS = 650;
/**
 * Monitors mouse and keyboard events to determine the cause of focus events.
 */
var FocusOriginMonitor = (function () {
    /**
     * @param {?} _ngZone
     * @param {?} _platform
     */
    function FocusOriginMonitor(_ngZone, _platform) {
        var _this = this;
        this._ngZone = _ngZone;
        this._platform = _platform;
        /**
         * The focus origin that the next focus event is a result of.
         */
        this._origin = null;
        /**
         * Whether the window has just been focused.
         */
        this._windowFocused = false;
        /**
         * Weak map of elements being monitored to their info.
         */
        this._elementInfo = new WeakMap();
        this._ngZone.runOutsideAngular(function () { return _this._registerDocumentEvents(); });
    }
    /**
     * Monitors focus on an element and applies appropriate CSS classes.
     * @param {?} element The element to monitor
     * @param {?} renderer The renderer to use to apply CSS classes to the element.
     * @param {?} checkChildren Whether to count the element as focused when its children are focused.
     * @return {?} An observable that emits when the focus state of the element changes.
     *     When the element is blurred, null will be emitted.
     */
    FocusOriginMonitor.prototype.monitor = function (element, renderer, checkChildren) {
        var _this = this;
        // Do nothing if we're not on the browser platform.
        if (!this._platform.isBrowser) {
            return rxjs_observable_of.of(null);
        }
        // Check if we're already monitoring this element.
        if (this._elementInfo.has(element)) {
            var /** @type {?} */ info_1 = this._elementInfo.get(element); /** @type {?} */
            ((info_1)).checkChildren = checkChildren;
            return ((info_1)).subject.asObservable();
        }
        // Create monitored element info.
        var /** @type {?} */ info = {
            unlisten: function () { },
            checkChildren: checkChildren,
            renderer: renderer,
            subject: new rxjs_Subject.Subject()
        };
        this._elementInfo.set(element, info);
        // Start listening. We need to listen in capture phase since focus events don't bubble.
        var /** @type {?} */ focusListener = function (event) { return _this._onFocus(event, element); };
        var /** @type {?} */ blurListener = function (event) { return _this._onBlur(event, element); };
        this._ngZone.runOutsideAngular(function () {
            element.addEventListener('focus', focusListener, true);
            element.addEventListener('blur', blurListener, true);
        });
        // Create an unlisten function for later.
        info.unlisten = function () {
            element.removeEventListener('focus', focusListener, true);
            element.removeEventListener('blur', blurListener, true);
        };
        return info.subject.asObservable();
    };
    /**
     * Stops monitoring an element and removes all focus classes.
     * @param {?} element The element to stop monitoring.
     * @return {?}
     */
    FocusOriginMonitor.prototype.stopMonitoring = function (element) {
        var /** @type {?} */ elementInfo = this._elementInfo.get(element);
        if (elementInfo) {
            elementInfo.unlisten();
            elementInfo.subject.complete();
            this._setClasses(element);
            this._elementInfo.delete(element);
        }
    };
    /**
     * Focuses the element via the specified focus origin.
     * @param {?} element The element to focus.
     * @param {?} origin The focus origin.
     * @return {?}
     */
    FocusOriginMonitor.prototype.focusVia = function (element, origin) {
        this._setOriginForCurrentEventQueue(origin);
        element.focus();
    };
    /**
     * Register necessary event listeners on the document and window.
     * @return {?}
     */
    FocusOriginMonitor.prototype._registerDocumentEvents = function () {
        var _this = this;
        // Do nothing if we're not on the browser platform.
        if (!this._platform.isBrowser) {
            return;
        }
        // Note: we listen to events in the capture phase so we can detect them even if the user stops
        // propagation.
        // On keydown record the origin and clear any touch event that may be in progress.
        document.addEventListener('keydown', function () {
            _this._lastTouchTarget = null;
            _this._setOriginForCurrentEventQueue('keyboard');
        }, true);
        // On mousedown record the origin only if there is not touch target, since a mousedown can
        // happen as a result of a touch event.
        document.addEventListener('mousedown', function () {
            if (!_this._lastTouchTarget) {
                _this._setOriginForCurrentEventQueue('mouse');
            }
        }, true);
        // When the touchstart event fires the focus event is not yet in the event queue. This means
        // we can't rely on the trick used above (setting timeout of 0ms). Instead we wait 650ms to
        // see if a focus happens.
        document.addEventListener('touchstart', function (event) {
            if (_this._touchTimeout != null) {
                clearTimeout(_this._touchTimeout);
            }
            _this._lastTouchTarget = event.target;
            _this._touchTimeout = setTimeout(function () { return _this._lastTouchTarget = null; }, TOUCH_BUFFER_MS);
        }, true);
        // Make a note of when the window regains focus, so we can restore the origin info for the
        // focused element.
        window.addEventListener('focus', function () {
            _this._windowFocused = true;
            setTimeout(function () { return _this._windowFocused = false; }, 0);
        });
    };
    /**
     * Sets the focus classes on the element based on the given focus origin.
     * @param {?} element The element to update the classes on.
     * @param {?=} origin The focus origin.
     * @return {?}
     */
    FocusOriginMonitor.prototype._setClasses = function (element, origin) {
        var /** @type {?} */ elementInfo = this._elementInfo.get(element);
        if (elementInfo) {
            var /** @type {?} */ toggleClass = function (className, shouldSet) {
                shouldSet ? elementInfo.renderer.addClass(element, className) :
                    elementInfo.renderer.removeClass(element, className);
            };
            toggleClass('cdk-focused', !!origin);
            toggleClass('cdk-touch-focused', origin === 'touch');
            toggleClass('cdk-keyboard-focused', origin === 'keyboard');
            toggleClass('cdk-mouse-focused', origin === 'mouse');
            toggleClass('cdk-program-focused', origin === 'program');
        }
    };
    /**
     * Sets the origin and schedules an async function to clear it at the end of the event queue.
     * @param {?} origin The origin to set.
     * @return {?}
     */
    FocusOriginMonitor.prototype._setOriginForCurrentEventQueue = function (origin) {
        var _this = this;
        this._origin = origin;
        setTimeout(function () { return _this._origin = null; }, 0);
    };
    /**
     * Checks whether the given focus event was caused by a touchstart event.
     * @param {?} event The focus event to check.
     * @return {?} Whether the event was caused by a touch.
     */
    FocusOriginMonitor.prototype._wasCausedByTouch = function (event) {
        // Note(mmalerba): This implementation is not quite perfect, there is a small edge case.
        // Consider the following dom structure:
        //
        // <div #parent tabindex="0" cdkFocusClasses>
        //   <div #child (click)="#parent.focus()"></div>
        // </div>
        //
        // If the user touches the #child element and the #parent is programmatically focused as a
        // result, this code will still consider it to have been caused by the touch event and will
        // apply the cdk-touch-focused class rather than the cdk-program-focused class. This is a
        // relatively small edge-case that can be worked around by using
        // focusVia(parentEl, renderer,  'program') to focus the parent element.
        //
        // If we decide that we absolutely must handle this case correctly, we can do so by listening
        // for the first focus event after the touchstart, and then the first blur event after that
        // focus event. When that blur event fires we know that whatever follows is not a result of the
        // touchstart.
        var /** @type {?} */ focusTarget = event.target;
        return this._lastTouchTarget instanceof Node && focusTarget instanceof Node &&
            (focusTarget === this._lastTouchTarget || focusTarget.contains(this._lastTouchTarget));
    };
    /**
     * Handles focus events on a registered element.
     * @param {?} event The focus event.
     * @param {?} element The monitored element.
     * @return {?}
     */
    FocusOriginMonitor.prototype._onFocus = function (event, element) {
        // NOTE(mmalerba): We currently set the classes based on the focus origin of the most recent
        // focus event affecting the monitored element. If we want to use the origin of the first event
        // instead we should check for the cdk-focused class here and return if the element already has
        // it. (This only matters for elements that have includesChildren = true).
        // If we are not counting child-element-focus as focused, make sure that the event target is the
        // monitored element itself.
        var /** @type {?} */ elementInfo = this._elementInfo.get(element);
        if (!elementInfo || (!elementInfo.checkChildren && element !== event.target)) {
            return;
        }
        // If we couldn't detect a cause for the focus event, it's due to one of three reasons:
        // 1) The window has just regained focus, in which case we want to restore the focused state of
        //    the element from before the window blurred.
        // 2) It was caused by a touch event, in which case we mark the origin as 'touch'.
        // 3) The element was programmatically focused, in which case we should mark the origin as
        //    'program'.
        if (!this._origin) {
            if (this._windowFocused && this._lastFocusOrigin) {
                this._origin = this._lastFocusOrigin;
            }
            else if (this._wasCausedByTouch(event)) {
                this._origin = 'touch';
            }
            else {
                this._origin = 'program';
            }
        }
        this._setClasses(element, this._origin);
        elementInfo.subject.next(this._origin);
        this._lastFocusOrigin = this._origin;
        this._origin = null;
    };
    /**
     * Handles blur events on a registered element.
     * @param {?} event The blur event.
     * @param {?} element The monitored element.
     * @return {?}
     */
    FocusOriginMonitor.prototype._onBlur = function (event, element) {
        // If we are counting child-element-focus as focused, make sure that we aren't just blurring in
        // order to focus another child of the monitored element.
        var /** @type {?} */ elementInfo = this._elementInfo.get(element);
        if (!elementInfo || (elementInfo.checkChildren && event.relatedTarget instanceof Node &&
            element.contains(event.relatedTarget))) {
            return;
        }
        this._setClasses(element);
        elementInfo.subject.next(null);
    };
    return FocusOriginMonitor;
}());
FocusOriginMonitor.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
FocusOriginMonitor.ctorParameters = function () { return [
    { type: _angular_core.NgZone, },
    { type: _angular_cdk.Platform, },
]; };
/**
 * Directive that determines how a particular element was focused (via keyboard, mouse, touch, or
 * programmatically) and adds corresponding classes to the element.
 *
 * There are two variants of this directive:
 * 1) cdkMonitorElementFocus: does not consider an element to be focused if one of its children is
 *    focused.
 * 2) cdkMonitorSubtreeFocus: considers an element focused if it or any of its children are focused.
 */
var CdkMonitorFocus = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _focusOriginMonitor
     * @param {?} renderer
     */
    function CdkMonitorFocus(_elementRef, _focusOriginMonitor, renderer) {
        var _this = this;
        this._elementRef = _elementRef;
        this._focusOriginMonitor = _focusOriginMonitor;
        this.cdkFocusChange = new _angular_core.EventEmitter();
        this._monitorSubscription = this._focusOriginMonitor.monitor(this._elementRef.nativeElement, renderer, this._elementRef.nativeElement.hasAttribute('cdkMonitorSubtreeFocus'))
            .subscribe(function (origin) { return _this.cdkFocusChange.emit(origin); });
    }
    /**
     * @return {?}
     */
    CdkMonitorFocus.prototype.ngOnDestroy = function () {
        this._focusOriginMonitor.stopMonitoring(this._elementRef.nativeElement);
        this._monitorSubscription.unsubscribe();
    };
    return CdkMonitorFocus;
}());
CdkMonitorFocus.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]',
            },] },
];
/**
 * @nocollapse
 */
CdkMonitorFocus.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: FocusOriginMonitor, },
    { type: _angular_core.Renderer2, },
]; };
CdkMonitorFocus.propDecorators = {
    'cdkFocusChange': [{ type: _angular_core.Output },],
};
/**
 * @param {?} parentDispatcher
 * @param {?} ngZone
 * @param {?} platform
 * @return {?}
 */
function FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY(parentDispatcher, ngZone, platform) {
    return parentDispatcher || new FocusOriginMonitor(ngZone, platform);
}
var FOCUS_ORIGIN_MONITOR_PROVIDER = {
    // If there is already a FocusOriginMonitor available, use that. Otherwise, provide a new one.
    provide: FocusOriginMonitor,
    deps: [[new _angular_core.Optional(), new _angular_core.SkipSelf(), FocusOriginMonitor], _angular_core.NgZone, _angular_cdk.Platform],
    useFactory: FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY
};
/**
 * Applies a CSS transform to an element, including browser-prefixed properties.
 * @param {?} element
 * @param {?} transformValue
 * @return {?}
 */
function applyCssTransform(element, transformValue) {
    // It's important to trim the result, because the browser will ignore the set operation
    // if the string contains only whitespace.
    var /** @type {?} */ value = transformValue.trim();
    element.style.transform = value;
    element.style.webkitTransform = value;
}
var StyleModule = (function () {
    function StyleModule() {
    }
    return StyleModule;
}());
StyleModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_cdk.PlatformModule],
                declarations: [CdkMonitorFocus],
                exports: [CdkMonitorFocus],
                providers: [FOCUS_ORIGIN_MONITOR_PROVIDER],
            },] },
];
/**
 * @nocollapse
 */
StyleModule.ctorParameters = function () { return []; };
/**
 * \@docs-private
 */
var AnimationCurves = (function () {
    function AnimationCurves() {
    }
    return AnimationCurves;
}());
AnimationCurves.STANDARD_CURVE = 'cubic-bezier(0.4,0.0,0.2,1)';
AnimationCurves.DECELERATION_CURVE = 'cubic-bezier(0.0,0.0,0.2,1)';
AnimationCurves.ACCELERATION_CURVE = 'cubic-bezier(0.4,0.0,1,1)';
AnimationCurves.SHARP_CURVE = 'cubic-bezier(0.4,0.0,0.6,1)';
/**
 * \@docs-private
 */
var AnimationDurations = (function () {
    function AnimationDurations() {
    }
    return AnimationDurations;
}());
AnimationDurations.COMPLEX = '375ms';
AnimationDurations.ENTERING = '225ms';
AnimationDurations.EXITING = '195ms';
/**
 * Adapts type `D` to be usable as a date by cdk-based components that work with dates.
 * @abstract
 */
var DateAdapter = (function () {
    function DateAdapter() {
    }
    /**
     * Gets the year component of the given date.
     * @abstract
     * @param {?} date The date to extract the year from.
     * @return {?} The year component.
     */
    DateAdapter.prototype.getYear = function (date) { };
    /**
     * Gets the month component of the given date.
     * @abstract
     * @param {?} date The date to extract the month from.
     * @return {?} The month component (0-indexed, 0 = January).
     */
    DateAdapter.prototype.getMonth = function (date) { };
    /**
     * Gets the date of the month component of the given date.
     * @abstract
     * @param {?} date The date to extract the date of the month from.
     * @return {?} The month component (1-indexed, 1 = first of month).
     */
    DateAdapter.prototype.getDate = function (date) { };
    /**
     * Gets the day of the week component of the given date.
     * @abstract
     * @param {?} date The date to extract the day of the week from.
     * @return {?} The month component (0-indexed, 0 = Sunday).
     */
    DateAdapter.prototype.getDayOfWeek = function (date) { };
    /**
     * Gets a list of names for the months.
     * @abstract
     * @param {?} style The naming style (e.g. long = 'January', short = 'Jan', narrow = 'J').
     * @return {?} An ordered list of all month names, starting with January.
     */
    DateAdapter.prototype.getMonthNames = function (style$$1) { };
    /**
     * Gets a list of names for the dates of the month.
     * @abstract
     * @return {?} An ordered list of all date of the month names, starting with '1'.
     */
    DateAdapter.prototype.getDateNames = function () { };
    /**
     * Gets a list of names for the days of the week.
     * @abstract
     * @param {?} style The naming style (e.g. long = 'Sunday', short = 'Sun', narrow = 'S').
     * @return {?} An ordered list of all weekday names, starting with Sunday.
     */
    DateAdapter.prototype.getDayOfWeekNames = function (style$$1) { };
    /**
     * Gets the name for the year of the given date.
     * @abstract
     * @param {?} date The date to get the year name for.
     * @return {?} The name of the given year (e.g. '2017').
     */
    DateAdapter.prototype.getYearName = function (date) { };
    /**
     * Gets the first day of the week.
     * @abstract
     * @return {?} The first day of the week (0-indexed, 0 = Sunday).
     */
    DateAdapter.prototype.getFirstDayOfWeek = function () { };
    /**
     * Gets the number of days in the month of the given date.
     * @abstract
     * @param {?} date The date whose month should be checked.
     * @return {?} The number of days in the month of the given date.
     */
    DateAdapter.prototype.getNumDaysInMonth = function (date) { };
    /**
     * Clones the given date.
     * @abstract
     * @param {?} date The date to clone
     * @return {?} A new date equal to the given date.
     */
    DateAdapter.prototype.clone = function (date) { };
    /**
     * Creates a date with the given year, month, and date. Does not allow over/under-flow of the
     * month and date.
     * @abstract
     * @param {?} year The full year of the date. (e.g. 89 means the year 89, not the year 1989).
     * @param {?} month The month of the date (0-indexed, 0 = January). Must be an integer 0 - 11.
     * @param {?} date The date of month of the date. Must be an integer 1 - length of the given month.
     * @return {?} The new date, or null if invalid.
     */
    DateAdapter.prototype.createDate = function (year, month, date) { };
    /**
     * Gets today's date.
     * @abstract
     * @return {?} Today's date.
     */
    DateAdapter.prototype.today = function () { };
    /**
     * Parses a date from a value.
     * @abstract
     * @param {?} value The value to parse.
     * @param {?} parseFormat The expected format of the value being parsed
     *     (type is implementation-dependent).
     * @return {?} The parsed date, or null if date could not be parsed.
     */
    DateAdapter.prototype.parse = function (value, parseFormat) { };
    /**
     * Formats a date as a string.
     * @abstract
     * @param {?} date The value to parse.
     * @param {?} displayFormat The format to use to display the date as a string.
     * @return {?} The parsed date, or null if date could not be parsed.
     */
    DateAdapter.prototype.format = function (date, displayFormat) { };
    /**
     * Adds the given number of years to the date. Years are counted as if flipping 12 pages on the
     * calendar for each year and then finding the closest date in the new month. For example when
     * adding 1 year to Feb 29, 2016, the resulting date will be Feb 28, 2017.
     * @abstract
     * @param {?} date The date to add years to.
     * @param {?} years The number of years to add (may be negative).
     * @return {?} A new date equal to the given one with the specified number of years added.
     */
    DateAdapter.prototype.addCalendarYears = function (date, years) { };
    /**
     * Adds the given number of months to the date. Months are counted as if flipping a page on the
     * calendar for each month and then finding the closest date in the new month. For example when
     * adding 1 month to Jan 31, 2017, the resulting date will be Feb 28, 2017.
     * @abstract
     * @param {?} date The date to add months to.
     * @param {?} months The number of months to add (may be negative).
     * @return {?} A new date equal to the given one with the specified number of months added.
     */
    DateAdapter.prototype.addCalendarMonths = function (date, months) { };
    /**
     * Adds the given number of days to the date. Days are counted as if moving one cell on the
     * calendar for each day.
     * @abstract
     * @param {?} date The date to add days to.
     * @param {?} days The number of days to add (may be negative).
     * @return {?} A new date equal to the given one with the specified number of days added.
     */
    DateAdapter.prototype.addCalendarDays = function (date, days) { };
    /**
     * Gets the RFC 3339 compatible date string (https://tools.ietf.org/html/rfc3339)  for the given
     * date.
     * @abstract
     * @param {?} date The date to get the ISO date string for.
     * @return {?} The ISO date string date string.
     */
    DateAdapter.prototype.getISODateString = function (date) { };
    /**
     * Sets the locale used for all dates.
     * @param {?} locale The new locale.
     * @return {?}
     */
    DateAdapter.prototype.setLocale = function (locale) {
        this.locale = locale;
    };
    /**
     * Compares two dates.
     * @param {?} first The first date to compare.
     * @param {?} second The second date to compare.
     * @return {?} 0 if the dates are equal, a number less than 0 if the first date is earlier,
     *     a number greater than 0 if the first date is later.
     */
    DateAdapter.prototype.compareDate = function (first$$1, second) {
        return this.getYear(first$$1) - this.getYear(second) ||
            this.getMonth(first$$1) - this.getMonth(second) ||
            this.getDate(first$$1) - this.getDate(second);
    };
    /**
     * Checks if two dates are equal.
     * @param {?} first The first date to check.
     * @param {?} second The second date to check.
     *     Null dates are considered equal to other null dates.
     * @return {?}
     */
    DateAdapter.prototype.sameDate = function (first$$1, second) {
        return first$$1 && second ? !this.compareDate(first$$1, second) : first$$1 == second;
    };
    /**
     * Clamp the given date between min and max dates.
     * @param {?} date The date to clamp.
     * @param {?=} min The minimum value to allow. If null or omitted no min is enforced.
     * @param {?=} max The maximum value to allow. If null or omitted no max is enforced.
     * @return {?} `min` if `date` is less than `min`, `max` if date is greater than `max`,
     *     otherwise `date`.
     */
    DateAdapter.prototype.clampDate = function (date, min, max) {
        if (min && this.compareDate(date, min) < 0) {
            return min;
        }
        if (max && this.compareDate(date, max) > 0) {
            return max;
        }
        return date;
    };
    return DateAdapter;
}());
/**
 * Whether the browser supports the Intl API.
 */
var SUPPORTS_INTL_API = typeof Intl != 'undefined';
/**
 * The default month names to use if Intl API is not available.
 */
var DEFAULT_MONTH_NAMES = {
    'long': [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December'
    ],
    'short': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    'narrow': ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
};
/**
 * The default date names to use if Intl API is not available.
 */
var DEFAULT_DATE_NAMES = range(31, function (i) { return String(i + 1); });
/**
 * The default day of the week names to use if Intl API is not available.
 */
var DEFAULT_DAY_OF_WEEK_NAMES = {
    'long': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    'short': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    'narrow': ['S', 'M', 'T', 'W', 'T', 'F', 'S']
};
/**
 * Creates an array and fills it with values.
 * @template T
 * @param {?} length
 * @param {?} valueFunction
 * @return {?}
 */
function range(length, valueFunction) {
    var /** @type {?} */ valuesArray = Array(length);
    for (var /** @type {?} */ i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}
/**
 * Adapts the native JS Date for use with cdk-based components that work with dates.
 */
var NativeDateAdapter = (function (_super) {
    __extends(NativeDateAdapter, _super);
    /**
     * @param {?} localeId
     */
    function NativeDateAdapter(localeId) {
        var _this = _super.call(this) || this;
        _super.prototype.setLocale.call(_this, localeId);
        return _this;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.getYear = function (date) {
        return date.getFullYear();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.getMonth = function (date) {
        return date.getMonth();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.getDate = function (date) {
        return date.getDate();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.getDayOfWeek = function (date) {
        return date.getDay();
    };
    /**
     * @param {?} style
     * @return {?}
     */
    NativeDateAdapter.prototype.getMonthNames = function (style$$1) {
        var _this = this;
        if (SUPPORTS_INTL_API) {
            var /** @type {?} */ dtf_1 = new Intl.DateTimeFormat(this.locale, { month: style$$1 });
            return range(12, function (i) { return _this._stripDirectionalityCharacters(dtf_1.format(new Date(2017, i, 1))); });
        }
        return DEFAULT_MONTH_NAMES[style$$1];
    };
    /**
     * @return {?}
     */
    NativeDateAdapter.prototype.getDateNames = function () {
        var _this = this;
        if (SUPPORTS_INTL_API) {
            var /** @type {?} */ dtf_2 = new Intl.DateTimeFormat(this.locale, { day: 'numeric' });
            return range(31, function (i) { return _this._stripDirectionalityCharacters(dtf_2.format(new Date(2017, 0, i + 1))); });
        }
        return DEFAULT_DATE_NAMES;
    };
    /**
     * @param {?} style
     * @return {?}
     */
    NativeDateAdapter.prototype.getDayOfWeekNames = function (style$$1) {
        var _this = this;
        if (SUPPORTS_INTL_API) {
            var /** @type {?} */ dtf_3 = new Intl.DateTimeFormat(this.locale, { weekday: style$$1 });
            return range(7, function (i) { return _this._stripDirectionalityCharacters(dtf_3.format(new Date(2017, 0, i + 1))); });
        }
        return DEFAULT_DAY_OF_WEEK_NAMES[style$$1];
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.getYearName = function (date) {
        if (SUPPORTS_INTL_API) {
            var /** @type {?} */ dtf = new Intl.DateTimeFormat(this.locale, { year: 'numeric' });
            return this._stripDirectionalityCharacters(dtf.format(date));
        }
        return String(this.getYear(date));
    };
    /**
     * @return {?}
     */
    NativeDateAdapter.prototype.getFirstDayOfWeek = function () {
        // We can't tell using native JS Date what the first day of the week is, we default to Sunday.
        return 0;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.getNumDaysInMonth = function (date) {
        return this.getDate(this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + 1, 0));
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.clone = function (date) {
        return this.createDate(this.getYear(date), this.getMonth(date), this.getDate(date));
    };
    /**
     * @param {?} year
     * @param {?} month
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.createDate = function (year, month, date) {
        // Check for invalid month and date (except upper bound on date which we have to check after
        // creating the Date).
        if (month < 0 || month > 11) {
            throw Error("Invalid month index \"" + month + "\". Month index has to be between 0 and 11.");
        }
        if (date < 1) {
            throw Error("Invalid date \"" + date + "\". Date has to be greater than 0.");
        }
        var /** @type {?} */ result = this._createDateWithOverflow(year, month, date);
        // Check that the date wasn't above the upper bound for the month, causing the month to overflow
        if (result.getMonth() != month) {
            throw Error("Invalid date \"" + date + "\" for month with index \"" + month + "\".");
        }
        return result;
    };
    /**
     * @return {?}
     */
    NativeDateAdapter.prototype.today = function () {
        return new Date();
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NativeDateAdapter.prototype.parse = function (value) {
        // We have no way using the native JS Date to set the parse format or locale, so we ignore these
        // parameters.
        var /** @type {?} */ timestamp = typeof value == 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    };
    /**
     * @param {?} date
     * @param {?} displayFormat
     * @return {?}
     */
    NativeDateAdapter.prototype.format = function (date, displayFormat) {
        if (SUPPORTS_INTL_API) {
            var /** @type {?} */ dtf = new Intl.DateTimeFormat(this.locale, displayFormat);
            return this._stripDirectionalityCharacters(dtf.format(date));
        }
        return this._stripDirectionalityCharacters(date.toDateString());
    };
    /**
     * @param {?} date
     * @param {?} years
     * @return {?}
     */
    NativeDateAdapter.prototype.addCalendarYears = function (date, years) {
        return this.addCalendarMonths(date, years * 12);
    };
    /**
     * @param {?} date
     * @param {?} months
     * @return {?}
     */
    NativeDateAdapter.prototype.addCalendarMonths = function (date, months) {
        var /** @type {?} */ newDate = this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + months, this.getDate(date));
        // It's possible to wind up in the wrong month if the original month has more days than the new
        // month. In this case we want to go to the last day of the desired month.
        // Note: the additional + 12 % 12 ensures we end up with a positive number, since JS % doesn't
        // guarantee this.
        if (this.getMonth(newDate) != ((this.getMonth(date) + months) % 12 + 12) % 12) {
            newDate = this._createDateWithOverflow(this.getYear(newDate), this.getMonth(newDate), 0);
        }
        return newDate;
    };
    /**
     * @param {?} date
     * @param {?} days
     * @return {?}
     */
    NativeDateAdapter.prototype.addCalendarDays = function (date, days) {
        return this._createDateWithOverflow(this.getYear(date), this.getMonth(date), this.getDate(date) + days);
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.getISODateString = function (date) {
        return [
            date.getUTCFullYear(),
            this._2digit(date.getUTCMonth() + 1),
            this._2digit(date.getUTCDate())
        ].join('-');
    };
    /**
     * Creates a date but allows the month and date to overflow.
     * @param {?} year
     * @param {?} month
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype._createDateWithOverflow = function (year, month, date) {
        var /** @type {?} */ result = new Date(year, month, date);
        // We need to correct for the fact that JS native Date treats years in range [0, 99] as
        // abbreviations for 19xx.
        if (year >= 0 && year < 100) {
            result.setFullYear(this.getYear(result) - 1900);
        }
        return result;
    };
    /**
     * Pads a number to make it two digits.
     * @param {?} n The number to pad.
     * @return {?} The padded number.
     */
    NativeDateAdapter.prototype._2digit = function (n) {
        return ('00' + n).slice(-2);
    };
    /**
     * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
     * other browsers do not. We remove them to make output consistent and because they interfere with
     * date parsing.
     * @param {?} str The string to strip direction characters from.
     * @return {?} The stripped string.
     */
    NativeDateAdapter.prototype._stripDirectionalityCharacters = function (str) {
        return str.replace(/[\u200e\u200f]/g, '');
    };
    return NativeDateAdapter;
}(DateAdapter));
NativeDateAdapter.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NativeDateAdapter.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_core.LOCALE_ID,] },] },
]; };
var MD_DATE_FORMATS = new _angular_core.InjectionToken('md-date-formats');
var MD_NATIVE_DATE_FORMATS = {
    parse: {
        dateInput: null,
    },
    display: {
        dateInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
};
var NativeDateModule = (function () {
    function NativeDateModule() {
    }
    return NativeDateModule;
}());
NativeDateModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }],
            },] },
];
/**
 * @nocollapse
 */
NativeDateModule.ctorParameters = function () { return []; };
var MdNativeDateModule = (function () {
    function MdNativeDateModule() {
    }
    return MdNativeDateModule;
}());
MdNativeDateModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [NativeDateModule],
                providers: [{ provide: MD_DATE_FORMATS, useValue: MD_NATIVE_DATE_FORMATS }],
            },] },
];
/**
 * @nocollapse
 */
MdNativeDateModule.ctorParameters = function () { return []; };
/**
 * InjectionToken that can be used to specify the global placeholder options.
 */
var MD_PLACEHOLDER_GLOBAL_OPTIONS = new _angular_core.InjectionToken('md-placeholder-global-options');
/**
 * Injection token that can be used to specify the global error options.
 */
var MD_ERROR_GLOBAL_OPTIONS = new _angular_core.InjectionToken('md-error-global-options');
/**
 * Returns whether control is invalid and is either touched or is a part of a submitted form.
 * @param {?} control
 * @param {?} form
 * @return {?}
 */
function defaultErrorStateMatcher(control, form) {
    var /** @type {?} */ isSubmitted = form && form.submitted;
    return !!(control.invalid && (control.touched || isSubmitted));
}
/**
 * Returns whether control is invalid and is either dirty or is a part of a submitted form.
 * @param {?} control
 * @param {?} form
 * @return {?}
 */
function showOnDirtyErrorStateMatcher(control, form) {
    var /** @type {?} */ isSubmitted = form && form.submitted;
    return !!(control.invalid && (control.dirty || isSubmitted));
}
var MdCoreModule = (function () {
    function MdCoreModule() {
    }
    return MdCoreModule;
}());
MdCoreModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    MdLineModule,
                    _angular_cdk.BidiModule,
                    MdRippleModule,
                    _angular_cdk.ObserveContentModule,
                    _angular_cdk.PortalModule,
                    OverlayModule,
                    _angular_cdk.A11yModule,
                    MdOptionModule,
                    MdSelectionModule,
                ],
                exports: [
                    MdLineModule,
                    _angular_cdk.BidiModule,
                    MdRippleModule,
                    _angular_cdk.ObserveContentModule,
                    _angular_cdk.PortalModule,
                    OverlayModule,
                    _angular_cdk.A11yModule,
                    MdOptionModule,
                    MdSelectionModule,
                ],
            },] },
];
/**
 * @nocollapse
 */
MdCoreModule.ctorParameters = function () { return []; };
/**
 * \@docs-private
 */
var MdButtonToggleGroupBase = (function () {
    function MdButtonToggleGroupBase() {
    }
    return MdButtonToggleGroupBase;
}());
var _MdButtonToggleGroupMixinBase = mixinDisabled(MdButtonToggleGroupBase);
/**
 * Provider Expression that allows md-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * \@docs-private
 */
var MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MdButtonToggleGroup; }),
    multi: true
};
var _uniqueIdCounter$1 = 0;
/**
 * Change event object emitted by MdButtonToggle.
 */
var MdButtonToggleChange = (function () {
    function MdButtonToggleChange() {
    }
    return MdButtonToggleChange;
}());
/**
 * Exclusive selection button toggle group that behaves like a radio-button group.
 */
var MdButtonToggleGroup = (function (_super) {
    __extends(MdButtonToggleGroup, _super);
    function MdButtonToggleGroup() {
        var _this = _super.apply(this, arguments) || this;
        /**
         * The value for the button toggle group. Should match currently selected button toggle.
         */
        _this._value = null;
        /**
         * The HTML name attribute applied to toggles in this group.
         */
        _this._name = "md-button-toggle-group-" + _uniqueIdCounter$1++;
        /**
         * Whether the button toggle group should be vertical.
         */
        _this._vertical = false;
        /**
         * The currently selected button toggle, should match the value.
         */
        _this._selected = null;
        /**
         * Whether the button toggle group is initialized or not.
         */
        _this._isInitialized = false;
        /**
         * The method to be called in order to update ngModel.
         * Now `ngModel` binding is not supported in multiple selection mode.
         */
        _this._controlValueAccessorChangeFn = function () { };
        /**
         * onTouch function registered via registerOnTouch (ControlValueAccessor).
         */
        _this.onTouched = function () { };
        /**
         * Event emitted when the group's value changes.
         */
        _this.change = new _angular_core.EventEmitter();
        return _this;
    }
    /**
     * @return {?}
     */
    MdButtonToggleGroup.prototype.ngAfterViewInit = function () {
        this._isInitialized = true;
    };
    Object.defineProperty(MdButtonToggleGroup.prototype, "name", {
        /**
         * `name` attribute for the underlying `input` element.
         * @return {?}
         */
        get: function () {
            return this._name;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._name = value;
            this._updateButtonToggleNames();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "vertical", {
        /**
         * Whether the toggle group is vertical.
         * @return {?}
         */
        get: function () {
            return this._vertical;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._vertical = _angular_cdk.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "value", {
        /**
         * Value of the toggle group.
         * @return {?}
         */
        get: function () {
            return this._value;
        },
        /**
         * @param {?} newValue
         * @return {?}
         */
        set: function (newValue) {
            if (this._value != newValue) {
                this._value = newValue;
                this._updateSelectedButtonToggleFromValue();
                // Only emit a change event if the view is completely initialized.
                // We don't want to emit a change event for the initial values.
                if (this._isInitialized) {
                    this._emitChangeEvent();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "selected", {
        /**
         * Whether the toggle group is selected.
         * @return {?}
         */
        get: function () {
            return this._selected;
        },
        /**
         * @param {?} selected
         * @return {?}
         */
        set: function (selected) {
            this._selected = selected;
            this.value = selected ? selected.value : null;
            if (selected && !selected.checked) {
                selected.checked = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdButtonToggleGroup.prototype._updateButtonToggleNames = function () {
        var _this = this;
        if (this._buttonToggles) {
            this._buttonToggles.forEach(function (toggle) {
                toggle.name = _this._name;
            });
        }
    };
    /**
     * @return {?}
     */
    MdButtonToggleGroup.prototype._updateSelectedButtonToggleFromValue = function () {
        var _this = this;
        var /** @type {?} */ isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._buttonToggles != null && !isAlreadySelected) {
            var /** @type {?} */ matchingButtonToggle = this._buttonToggles.filter(function (buttonToggle) { return buttonToggle.value == _this._value; })[0];
            if (matchingButtonToggle) {
                this.selected = matchingButtonToggle;
            }
            else if (this.value == null) {
                this.selected = null;
                this._buttonToggles.forEach(function (buttonToggle) {
                    buttonToggle.checked = false;
                });
            }
        }
    };
    /**
     * Dispatch change event with current selection and group value.
     * @return {?}
     */
    MdButtonToggleGroup.prototype._emitChangeEvent = function () {
        var /** @type {?} */ event = new MdButtonToggleChange();
        event.source = this._selected;
        event.value = this._value;
        this._controlValueAccessorChangeFn(event.value);
        this.change.emit(event);
    };
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value Value to be set to the model.
     * @return {?}
     */
    MdButtonToggleGroup.prototype.writeValue = function (value) {
        this.value = value;
    };
    /**
     * Registers a callback that will be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn On change callback function.
     * @return {?}
     */
    MdButtonToggleGroup.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Registers a callback that will be triggered when the control has been touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn On touch callback function.
     * @return {?}
     */
    MdButtonToggleGroup.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Toggles the disabled state of the component. Implemented as part of ControlValueAccessor.
     * @param {?} isDisabled Whether the component should be disabled.
     * @return {?}
     */
    MdButtonToggleGroup.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    return MdButtonToggleGroup;
}(_MdButtonToggleGroupMixinBase));
MdButtonToggleGroup.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-button-toggle-group:not([multiple]), mat-button-toggle-group:not([multiple])',
                providers: [MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR],
                inputs: ['disabled'],
                host: {
                    'role': 'radiogroup',
                    'class': 'mat-button-toggle-group',
                    '[class.mat-button-toggle-vertical]': 'vertical'
                },
                exportAs: 'mdButtonToggleGroup',
            },] },
];
/**
 * @nocollapse
 */
MdButtonToggleGroup.ctorParameters = function () { return []; };
MdButtonToggleGroup.propDecorators = {
    '_buttonToggles': [{ type: _angular_core.ContentChildren, args: [_angular_core.forwardRef(function () { return MdButtonToggle; }),] },],
    'name': [{ type: _angular_core.Input },],
    'vertical': [{ type: _angular_core.Input },],
    'value': [{ type: _angular_core.Input },],
    'selected': [{ type: _angular_core.Input },],
    'change': [{ type: _angular_core.Output },],
};
/**
 * Multiple selection button-toggle group. `ngModel` is not supported in this mode.
 */
var MdButtonToggleGroupMultiple = (function (_super) {
    __extends(MdButtonToggleGroupMultiple, _super);
    function MdButtonToggleGroupMultiple() {
        var _this = _super.apply(this, arguments) || this;
        /**
         * Whether the button toggle group should be vertical.
         */
        _this._vertical = false;
        return _this;
    }
    Object.defineProperty(MdButtonToggleGroupMultiple.prototype, "vertical", {
        /**
         * Whether the toggle group is vertical.
         * @return {?}
         */
        get: function () {
            return this._vertical;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._vertical = _angular_cdk.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    return MdButtonToggleGroupMultiple;
}(_MdButtonToggleGroupMixinBase));
MdButtonToggleGroupMultiple.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-button-toggle-group[multiple], mat-button-toggle-group[multiple]',
                exportAs: 'mdButtonToggleGroup',
                inputs: ['disabled'],
                host: {
                    'class': 'mat-button-toggle-group',
                    '[class.mat-button-toggle-vertical]': 'vertical'
                }
            },] },
];
/**
 * @nocollapse
 */
MdButtonToggleGroupMultiple.ctorParameters = function () { return []; };
MdButtonToggleGroupMultiple.propDecorators = {
    'vertical': [{ type: _angular_core.Input },],
};
/**
 * Single button inside of a toggle group.
 */
var MdButtonToggle = (function () {
    /**
     * @param {?} toggleGroup
     * @param {?} toggleGroupMultiple
     * @param {?} _buttonToggleDispatcher
     * @param {?} _renderer
     * @param {?} _elementRef
     * @param {?} _focusOriginMonitor
     */
    function MdButtonToggle(toggleGroup, toggleGroupMultiple, _buttonToggleDispatcher, _renderer, _elementRef, _focusOriginMonitor) {
        var _this = this;
        this._buttonToggleDispatcher = _buttonToggleDispatcher;
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._focusOriginMonitor = _focusOriginMonitor;
        /**
         * Whether or not this button toggle is checked.
         */
        this._checked = false;
        /**
         * Whether or not this button toggle is disabled.
         */
        this._disabled = false;
        /**
         * Value assigned to this button toggle.
         */
        this._value = null;
        /**
         * Whether or not the button toggle is a single selection.
         */
        this._isSingleSelector = false;
        /**
         * Unregister function for _buttonToggleDispatcher *
         */
        this._removeUniqueSelectionListener = function () { };
        /**
         * Event emitted when the group value changes.
         */
        this.change = new _angular_core.EventEmitter();
        this.buttonToggleGroup = toggleGroup;
        this.buttonToggleGroupMultiple = toggleGroupMultiple;
        if (this.buttonToggleGroup) {
            this._removeUniqueSelectionListener =
                _buttonToggleDispatcher.listen(function (id, name) {
                    if (id != _this.id && name == _this.name) {
                        _this.checked = false;
                    }
                });
            this._type = 'radio';
            this.name = this.buttonToggleGroup.name;
            this._isSingleSelector = true;
        }
        else {
            // Even if there is no group at all, treat the button toggle as a checkbox so it can be
            // toggled on or off.
            this._type = 'checkbox';
            this._isSingleSelector = false;
        }
    }
    Object.defineProperty(MdButtonToggle.prototype, "inputId", {
        /**
         * Unique ID for the underlying `input` element.
         * @return {?}
         */
        get: function () {
            return this.id + "-input";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "checked", {
        /**
         * Whether the button is checked.
         * @return {?}
         */
        get: function () {
            return this._checked;
        },
        /**
         * @param {?} newCheckedState
         * @return {?}
         */
        set: function (newCheckedState) {
            if (this._isSingleSelector) {
                if (newCheckedState) {
                    // Notify all button toggles with the same name (in the same group) to un-check.
                    this._buttonToggleDispatcher.notify(this.id, this.name);
                }
            }
            this._checked = newCheckedState;
            if (newCheckedState && this._isSingleSelector && this.buttonToggleGroup.value != this.value) {
                this.buttonToggleGroup.selected = this;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "value", {
        /**
         * MdButtonToggleGroup reads this to assign its own value.
         * @return {?}
         */
        get: function () {
            return this._value;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (this._value != value) {
                if (this.buttonToggleGroup != null && this.checked) {
                    this.buttonToggleGroup.value = value;
                }
                this._value = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "disabled", {
        /**
         * Whether the button is disabled.
         * @return {?}
         */
        get: function () {
            return this._disabled || (this.buttonToggleGroup != null && this.buttonToggleGroup.disabled) ||
                (this.buttonToggleGroupMultiple != null && this.buttonToggleGroupMultiple.disabled);
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = _angular_cdk.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdButtonToggle.prototype.ngOnInit = function () {
        if (this.id == null) {
            this.id = "md-button-toggle-" + _uniqueIdCounter$1++;
        }
        if (this.buttonToggleGroup && this._value == this.buttonToggleGroup.value) {
            this._checked = true;
        }
        this._focusOriginMonitor.monitor(this._elementRef.nativeElement, this._renderer, true);
    };
    /**
     * Focuses the button.
     * @return {?}
     */
    MdButtonToggle.prototype.focus = function () {
        this._inputElement.nativeElement.focus();
    };
    /**
     * Toggle the state of the current button toggle.
     * @return {?}
     */
    MdButtonToggle.prototype._toggle = function () {
        this.checked = !this.checked;
    };
    /**
     * Checks the button toggle due to an interaction with the underlying native input.
     * @param {?} event
     * @return {?}
     */
    MdButtonToggle.prototype._onInputChange = function (event) {
        event.stopPropagation();
        if (this._isSingleSelector) {
            // Propagate the change one-way via the group, which will in turn mark this
            // button toggle as checked.
            this.checked = true;
            this.buttonToggleGroup.selected = this;
            this.buttonToggleGroup.onTouched();
        }
        else {
            this._toggle();
        }
        // Emit a change event when the native input does.
        this._emitChangeEvent();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdButtonToggle.prototype._onInputClick = function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    /**
     * Dispatch change event with current value.
     * @return {?}
     */
    MdButtonToggle.prototype._emitChangeEvent = function () {
        var /** @type {?} */ event = new MdButtonToggleChange();
        event.source = this;
        event.value = this._value;
        this.change.emit(event);
    };
    /**
     * @return {?}
     */
    MdButtonToggle.prototype.ngOnDestroy = function () {
        this._removeUniqueSelectionListener();
    };
    return MdButtonToggle;
}());
MdButtonToggle.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-button-toggle, mat-button-toggle',
                template: "<label [attr.for]=\"inputId\" class=\"mat-button-toggle-label\"><input #input class=\"mat-button-toggle-input cdk-visually-hidden\" [type]=\"_type\" [id]=\"inputId\" [checked]=\"checked\" [disabled]=\"disabled || null\" [name]=\"name\" (change)=\"_onInputChange($event)\" (click)=\"_onInputClick($event)\"><div class=\"mat-button-toggle-label-content\"><ng-content></ng-content></div></label><div class=\"mat-button-toggle-focus-overlay\"></div>",
                styles: [".mat-button-toggle-group,.mat-button-toggle-standalone{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);position:relative;display:inline-flex;flex-direction:row;border-radius:2px;cursor:pointer;white-space:nowrap}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle-disabled .mat-button-toggle-label-content{cursor:default}.mat-button-toggle{white-space:nowrap;position:relative}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:1}.mat-button-toggle-label-content{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:inline-block;line-height:36px;padding:0 16px;cursor:pointer}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{border-radius:inherit;pointer-events:none;opacity:0;position:absolute;top:0;left:0;right:0;bottom:0}"],
                encapsulation: _angular_core.ViewEncapsulation.None,
                host: {
                    '[class.mat-button-toggle-standalone]': '!buttonToggleGroup && !buttonToggleGroupMultiple',
                    'class': 'mat-button-toggle'
                }
            },] },
];
/**
 * @nocollapse
 */
MdButtonToggle.ctorParameters = function () { return [
    { type: MdButtonToggleGroup, decorators: [{ type: _angular_core.Optional },] },
    { type: MdButtonToggleGroupMultiple, decorators: [{ type: _angular_core.Optional },] },
    { type: UniqueSelectionDispatcher, },
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
    { type: FocusOriginMonitor, },
]; };
MdButtonToggle.propDecorators = {
    '_inputElement': [{ type: _angular_core.ViewChild, args: ['input',] },],
    'id': [{ type: _angular_core.HostBinding }, { type: _angular_core.Input },],
    'name': [{ type: _angular_core.Input },],
    'checked': [{ type: _angular_core.HostBinding, args: ['class.mat-button-toggle-checked',] }, { type: _angular_core.Input },],
    'value': [{ type: _angular_core.Input },],
    'disabled': [{ type: _angular_core.HostBinding, args: ['class.mat-button-toggle-disabled',] }, { type: _angular_core.Input },],
    'change': [{ type: _angular_core.Output },],
};
var MdButtonToggleModule = (function () {
    function MdButtonToggleModule() {
    }
    return MdButtonToggleModule;
}());
MdButtonToggleModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [MdCommonModule, StyleModule],
                exports: [
                    MdButtonToggleGroup,
                    MdButtonToggleGroupMultiple,
                    MdButtonToggle,
                    MdCommonModule,
                ],
                declarations: [MdButtonToggleGroup, MdButtonToggleGroupMultiple, MdButtonToggle],
                providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER]
            },] },
];
/**
 * @nocollapse
 */
MdButtonToggleModule.ctorParameters = function () { return []; };
/**
 * Default color palette for round buttons (md-fab and md-mini-fab)
 */
var DEFAULT_ROUND_BUTTON_COLOR = 'accent';
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdButtonCssMatStyler = (function () {
    function MdButtonCssMatStyler() {
    }
    return MdButtonCssMatStyler;
}());
MdButtonCssMatStyler.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'button[md-button], button[mat-button], a[md-button], a[mat-button]',
                host: { 'class': 'mat-button' }
            },] },
];
/**
 * @nocollapse
 */
MdButtonCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdRaisedButtonCssMatStyler = (function () {
    function MdRaisedButtonCssMatStyler() {
    }
    return MdRaisedButtonCssMatStyler;
}());
MdRaisedButtonCssMatStyler.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'button[md-raised-button], button[mat-raised-button], ' +
                    'a[md-raised-button], a[mat-raised-button]',
                host: { 'class': 'mat-raised-button' }
            },] },
];
/**
 * @nocollapse
 */
MdRaisedButtonCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdIconButtonCssMatStyler = (function () {
    function MdIconButtonCssMatStyler() {
    }
    return MdIconButtonCssMatStyler;
}());
MdIconButtonCssMatStyler.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'button[md-icon-button], button[mat-icon-button], a[md-icon-button], a[mat-icon-button]',
                host: { 'class': 'mat-icon-button' }
            },] },
];
/**
 * @nocollapse
 */
MdIconButtonCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdFab = (function () {
    /**
     * @param {?} button
     * @param {?} anchor
     */
    function MdFab(button, anchor) {
        // Set the default color palette for the md-fab components.
        (button || anchor).color = DEFAULT_ROUND_BUTTON_COLOR;
    }
    return MdFab;
}());
MdFab.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'button[md-fab], button[mat-fab], a[md-fab], a[mat-fab]',
                host: { 'class': 'mat-fab' }
            },] },
];
/**
 * @nocollapse
 */
MdFab.ctorParameters = function () { return [
    { type: MdButton, decorators: [{ type: _angular_core.Self }, { type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_core.forwardRef(function () { return MdButton; }),] },] },
    { type: MdAnchor, decorators: [{ type: _angular_core.Self }, { type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_core.forwardRef(function () { return MdAnchor; }),] },] },
]; };
/**
 * Directive that targets mini-fab buttons and anchors. It's used to apply the `mat-` class
 * to all mini-fab buttons and also is responsible for setting the default color palette.
 * \@docs-private
 */
var MdMiniFab = (function () {
    /**
     * @param {?} button
     * @param {?} anchor
     */
    function MdMiniFab(button, anchor) {
        // Set the default color palette for the md-mini-fab components.
        (button || anchor).color = DEFAULT_ROUND_BUTTON_COLOR;
    }
    return MdMiniFab;
}());
MdMiniFab.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'button[md-mini-fab], button[mat-mini-fab], a[md-mini-fab], a[mat-mini-fab]',
                host: { 'class': 'mat-mini-fab' }
            },] },
];
/**
 * @nocollapse
 */
MdMiniFab.ctorParameters = function () { return [
    { type: MdButton, decorators: [{ type: _angular_core.Self }, { type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_core.forwardRef(function () { return MdButton; }),] },] },
    { type: MdAnchor, decorators: [{ type: _angular_core.Self }, { type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_core.forwardRef(function () { return MdAnchor; }),] },] },
]; };
/**
 * \@docs-private
 */
var MdButtonBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdButtonBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdButtonBase;
}());
var _MdButtonMixinBase = mixinColor(mixinDisabled(MdButtonBase));
/**
 * Material design button.
 */
var MdButton = (function (_super) {
    __extends(MdButton, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _platform
     * @param {?} _focusOriginMonitor
     */
    function MdButton(renderer, elementRef, _platform, _focusOriginMonitor) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._platform = _platform;
        _this._focusOriginMonitor = _focusOriginMonitor;
        /**
         * Whether the button is round.
         */
        _this._isRoundButton = _this._hasAttributeWithPrefix('fab', 'mini-fab');
        /**
         * Whether the button is icon button.
         */
        _this._isIconButton = _this._hasAttributeWithPrefix('icon-button');
        /**
         * Whether the ripple effect on click should be disabled.
         */
        _this._disableRipple = false;
        _this._focusOriginMonitor.monitor(_this._elementRef.nativeElement, _this._renderer, true);
        return _this;
    }
    Object.defineProperty(MdButton.prototype, "disableRipple", {
        /**
         * Whether the ripple effect for this button is disabled.
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._disableRipple = _angular_cdk.coerceBooleanProperty(v); },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdButton.prototype.ngOnDestroy = function () {
        this._focusOriginMonitor.stopMonitoring(this._elementRef.nativeElement);
    };
    /**
     * Focuses the button.
     * @return {?}
     */
    MdButton.prototype.focus = function () {
        this._getHostElement().focus();
    };
    /**
     * @return {?}
     */
    MdButton.prototype._getHostElement = function () {
        return this._elementRef.nativeElement;
    };
    /**
     * @return {?}
     */
    MdButton.prototype._isRippleDisabled = function () {
        return this.disableRipple || this.disabled;
    };
    /**
     * Gets whether the button has one of the given attributes
     * with either an 'md-' or 'mat-' prefix.
     * @param {...?} unprefixedAttributeNames
     * @return {?}
     */
    MdButton.prototype._hasAttributeWithPrefix = function () {
        var _this = this;
        var unprefixedAttributeNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            unprefixedAttributeNames[_i] = arguments[_i];
        }
        // If not on the browser, say that there are none of the attributes present.
        // Since these only affect how the ripple displays (and ripples only happen on the client),
        // detecting these attributes isn't necessary when not on the browser.
        if (!this._platform.isBrowser) {
            return false;
        }
        return unprefixedAttributeNames.some(function (suffix) {
            var /** @type {?} */ el = _this._getHostElement();
            return el.hasAttribute('md-' + suffix) || el.hasAttribute('mat-' + suffix);
        });
    };
    return MdButton;
}(_MdButtonMixinBase));
MdButton.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'button[md-button], button[md-raised-button], button[md-icon-button],' +
                    'button[md-fab], button[md-mini-fab],' +
                    'button[mat-button], button[mat-raised-button], button[mat-icon-button],' +
                    'button[mat-fab], button[mat-mini-fab]',
                host: {
                    '[disabled]': 'disabled || null',
                },
                template: "<span class=\"mat-button-wrapper\"><ng-content></ng-content></span><div md-ripple class=\"mat-button-ripple\" [class.mat-button-ripple-round]=\"_isRoundButton || _isIconButton\" [mdRippleDisabled]=\"_isRippleDisabled()\" [mdRippleCentered]=\"_isIconButton\" [mdRippleTrigger]=\"_getHostElement()\"></div><div class=\"mat-button-focus-overlay\"></div>",
                styles: [".mat-button,.mat-fab,.mat-icon-button,.mat-mini-fab,.mat-raised-button{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:0;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:88px;line-height:36px;padding:0 16px;border-radius:2px}[disabled].mat-button,[disabled].mat-fab,[disabled].mat-icon-button,[disabled].mat-mini-fab,[disabled].mat-raised-button{cursor:default}.cdk-keyboard-focused.mat-button .mat-button-focus-overlay,.cdk-keyboard-focused.mat-fab .mat-button-focus-overlay,.cdk-keyboard-focused.mat-icon-button .mat-button-focus-overlay,.cdk-keyboard-focused.mat-mini-fab .mat-button-focus-overlay,.cdk-keyboard-focused.mat-raised-button .mat-button-focus-overlay{opacity:1}.mat-button::-moz-focus-inner,.mat-fab::-moz-focus-inner,.mat-icon-button::-moz-focus-inner,.mat-mini-fab::-moz-focus-inner,.mat-raised-button::-moz-focus-inner{border:0}.mat-fab,.mat-mini-fab,.mat-raised-button{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);transform:translate3d(0,0,0);transition:background .4s cubic-bezier(.25,.8,.25,1),box-shadow 280ms cubic-bezier(.4,0,.2,1)}.mat-fab:not([disabled]):active,.mat-mini-fab:not([disabled]):active,.mat-raised-button:not([disabled]):active{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}[disabled].mat-fab,[disabled].mat-mini-fab,[disabled].mat-raised-button{box-shadow:none}.mat-button .mat-button-focus-overlay,.mat-icon-button .mat-button-focus-overlay{transition:none;opacity:0}.mat-button:hover .mat-button-focus-overlay{opacity:1}.mat-fab{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);min-width:0;border-radius:50%;width:56px;height:56px;padding:0;flex-shrink:0}.mat-fab:not([disabled]):active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-fab .mat-icon,.mat-fab i{padding:16px 0;line-height:24px}.mat-mini-fab{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);min-width:0;border-radius:50%;width:40px;height:40px;padding:0;flex-shrink:0}.mat-mini-fab:not([disabled]):active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-mini-fab .mat-icon,.mat-mini-fab i{padding:8px 0;line-height:24px}.mat-icon-button{padding:0;min-width:0;width:40px;height:40px;flex-shrink:0;line-height:40px;border-radius:50%}.mat-icon-button .mat-icon,.mat-icon-button i{line-height:24px}.mat-button,.mat-icon-button,.mat-raised-button{color:currentColor}.mat-button .mat-button-wrapper>*,.mat-icon-button .mat-button-wrapper>*,.mat-raised-button .mat-button-wrapper>*{vertical-align:middle}.mat-button-focus-overlay,.mat-button-ripple{position:absolute;top:0;left:0;bottom:0;right:0;pointer-events:none}.mat-button-focus-overlay{background-color:rgba(0,0,0,.12);border-radius:inherit;opacity:0;transition:opacity .2s cubic-bezier(.35,0,.25,1),background-color .2s cubic-bezier(.35,0,.25,1)}@media screen and (-ms-high-contrast:active){.mat-button-focus-overlay{background-color:rgba(255,255,255,.5)}}.mat-button-ripple-round{border-radius:50%;z-index:1}@media screen and (-ms-high-contrast:active){.mat-button,.mat-fab,.mat-icon-button,.mat-mini-fab,.mat-raised-button{outline:solid 1px}}"],
                inputs: ['disabled', 'color'],
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdButton.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
    { type: _angular_cdk.Platform, },
    { type: FocusOriginMonitor, },
]; };
MdButton.propDecorators = {
    'disableRipple': [{ type: _angular_core.Input },],
};
/**
 * Raised Material design button.
 */
var MdAnchor = (function (_super) {
    __extends(MdAnchor, _super);
    /**
     * @param {?} platform
     * @param {?} focusOriginMonitor
     * @param {?} elementRef
     * @param {?} renderer
     */
    function MdAnchor(platform, focusOriginMonitor, elementRef, renderer) {
        return _super.call(this, renderer, elementRef, platform, focusOriginMonitor) || this;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    MdAnchor.prototype._haltDisabledEvents = function (event) {
        // A disabled button shouldn't apply any actions
        if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };
    return MdAnchor;
}(MdButton));
MdAnchor.decorators = [
    { type: _angular_core.Component, args: [{ selector: "a[md-button], a[md-raised-button], a[md-icon-button], a[md-fab], a[md-mini-fab],\n             a[mat-button], a[mat-raised-button], a[mat-icon-button], a[mat-fab], a[mat-mini-fab]",
                host: {
                    '[attr.tabindex]': 'disabled ? -1 : 0',
                    '[attr.disabled]': 'disabled || null',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '(click)': '_haltDisabledEvents($event)',
                },
                inputs: ['disabled', 'color'],
                template: "<span class=\"mat-button-wrapper\"><ng-content></ng-content></span><div md-ripple class=\"mat-button-ripple\" [class.mat-button-ripple-round]=\"_isRoundButton || _isIconButton\" [mdRippleDisabled]=\"_isRippleDisabled()\" [mdRippleCentered]=\"_isIconButton\" [mdRippleTrigger]=\"_getHostElement()\"></div><div class=\"mat-button-focus-overlay\"></div>",
                styles: [".mat-button,.mat-fab,.mat-icon-button,.mat-mini-fab,.mat-raised-button{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:0;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:88px;line-height:36px;padding:0 16px;border-radius:2px}[disabled].mat-button,[disabled].mat-fab,[disabled].mat-icon-button,[disabled].mat-mini-fab,[disabled].mat-raised-button{cursor:default}.cdk-keyboard-focused.mat-button .mat-button-focus-overlay,.cdk-keyboard-focused.mat-fab .mat-button-focus-overlay,.cdk-keyboard-focused.mat-icon-button .mat-button-focus-overlay,.cdk-keyboard-focused.mat-mini-fab .mat-button-focus-overlay,.cdk-keyboard-focused.mat-raised-button .mat-button-focus-overlay{opacity:1}.mat-button::-moz-focus-inner,.mat-fab::-moz-focus-inner,.mat-icon-button::-moz-focus-inner,.mat-mini-fab::-moz-focus-inner,.mat-raised-button::-moz-focus-inner{border:0}.mat-fab,.mat-mini-fab,.mat-raised-button{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);transform:translate3d(0,0,0);transition:background .4s cubic-bezier(.25,.8,.25,1),box-shadow 280ms cubic-bezier(.4,0,.2,1)}.mat-fab:not([disabled]):active,.mat-mini-fab:not([disabled]):active,.mat-raised-button:not([disabled]):active{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}[disabled].mat-fab,[disabled].mat-mini-fab,[disabled].mat-raised-button{box-shadow:none}.mat-button .mat-button-focus-overlay,.mat-icon-button .mat-button-focus-overlay{transition:none;opacity:0}.mat-button:hover .mat-button-focus-overlay{opacity:1}.mat-fab{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);min-width:0;border-radius:50%;width:56px;height:56px;padding:0;flex-shrink:0}.mat-fab:not([disabled]):active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-fab .mat-icon,.mat-fab i{padding:16px 0;line-height:24px}.mat-mini-fab{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);min-width:0;border-radius:50%;width:40px;height:40px;padding:0;flex-shrink:0}.mat-mini-fab:not([disabled]):active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-mini-fab .mat-icon,.mat-mini-fab i{padding:8px 0;line-height:24px}.mat-icon-button{padding:0;min-width:0;width:40px;height:40px;flex-shrink:0;line-height:40px;border-radius:50%}.mat-icon-button .mat-icon,.mat-icon-button i{line-height:24px}.mat-button,.mat-icon-button,.mat-raised-button{color:currentColor}.mat-button .mat-button-wrapper>*,.mat-icon-button .mat-button-wrapper>*,.mat-raised-button .mat-button-wrapper>*{vertical-align:middle}.mat-button-focus-overlay,.mat-button-ripple{position:absolute;top:0;left:0;bottom:0;right:0;pointer-events:none}.mat-button-focus-overlay{background-color:rgba(0,0,0,.12);border-radius:inherit;opacity:0;transition:opacity .2s cubic-bezier(.35,0,.25,1),background-color .2s cubic-bezier(.35,0,.25,1)}@media screen and (-ms-high-contrast:active){.mat-button-focus-overlay{background-color:rgba(255,255,255,.5)}}.mat-button-ripple-round{border-radius:50%;z-index:1}@media screen and (-ms-high-contrast:active){.mat-button,.mat-fab,.mat-icon-button,.mat-mini-fab,.mat-raised-button{outline:solid 1px}}"],
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdAnchor.ctorParameters = function () { return [
    { type: _angular_cdk.Platform, },
    { type: FocusOriginMonitor, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
]; };
var MdButtonModule = (function () {
    function MdButtonModule() {
    }
    return MdButtonModule;
}());
MdButtonModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule,
                    MdRippleModule,
                    MdCommonModule,
                    StyleModule,
                ],
                exports: [
                    MdButton,
                    MdAnchor,
                    MdMiniFab,
                    MdFab,
                    MdCommonModule,
                    MdButtonCssMatStyler,
                    MdRaisedButtonCssMatStyler,
                    MdIconButtonCssMatStyler,
                ],
                declarations: [
                    MdButton,
                    MdAnchor,
                    MdMiniFab,
                    MdFab,
                    MdButtonCssMatStyler,
                    MdRaisedButtonCssMatStyler,
                    MdIconButtonCssMatStyler,
                ],
            },] },
];
/**
 * @nocollapse
 */
MdButtonModule.ctorParameters = function () { return []; };
/**
 * Monotonically increasing integer used to auto-generate unique ids for checkbox components.
 */
var nextId = 0;
/**
 * Provider Expression that allows md-checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * \@docs-private
 */
var MD_CHECKBOX_CONTROL_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MdCheckbox; }),
    multi: true
};
var TransitionCheckState = {};
TransitionCheckState.Init = 0;
TransitionCheckState.Checked = 1;
TransitionCheckState.Unchecked = 2;
TransitionCheckState.Indeterminate = 3;
TransitionCheckState[TransitionCheckState.Init] = "Init";
TransitionCheckState[TransitionCheckState.Checked] = "Checked";
TransitionCheckState[TransitionCheckState.Unchecked] = "Unchecked";
TransitionCheckState[TransitionCheckState.Indeterminate] = "Indeterminate";
/**
 * Change event object emitted by MdCheckbox.
 */
var MdCheckboxChange = (function () {
    function MdCheckboxChange() {
    }
    return MdCheckboxChange;
}());
/**
 * \@docs-private
 */
var MdCheckboxBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdCheckboxBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdCheckboxBase;
}());
var _MdCheckboxMixinBase = mixinColor(mixinDisabled(MdCheckboxBase), 'accent');
/**
 * A material design checkbox component. Supports all of the functionality of an HTML5 checkbox,
 * and exposes a similar API. A MdCheckbox can be either checked, unchecked, indeterminate, or
 * disabled. Note that all additional accessibility attributes are taken care of by the component,
 * so there is no need to provide them yourself. However, if you want to omit a label and still
 * have the checkbox be accessible, you may supply an [aria-label] input.
 * See: https://www.google.com/design/spec/components/selection-controls.html
 */
var MdCheckbox = (function (_super) {
    __extends(MdCheckbox, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _changeDetectorRef
     * @param {?} _focusOriginMonitor
     */
    function MdCheckbox(renderer, elementRef, _changeDetectorRef, _focusOriginMonitor) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._focusOriginMonitor = _focusOriginMonitor;
        /**
         * Attached to the aria-label attribute of the host element. In most cases, arial-labelledby will
         * take precedence so this may be omitted.
         */
        _this.ariaLabel = '';
        /**
         * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
         */
        _this.ariaLabelledby = null;
        /**
         * A unique id for the checkbox. If one is not supplied, it is auto-generated.
         */
        _this.id = "md-checkbox-" + ++nextId;
        /**
         * Whether the label should appear after or before the checkbox. Defaults to 'after'
         */
        _this.labelPosition = 'after';
        /**
         * Tabindex value that is passed to the underlying input element.
         */
        _this.tabIndex = 0;
        /**
         * Name value will be applied to the input element if present
         */
        _this.name = null;
        /**
         * Event emitted when the checkbox's `checked` value changes.
         */
        _this.change = new _angular_core.EventEmitter();
        /**
         * Event emitted when the checkbox's `indeterminate` value changes.
         */
        _this.indeterminateChange = new _angular_core.EventEmitter();
        /**
         * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
         * \@docs-private
         */
        _this.onTouched = function () { };
        _this._currentAnimationClass = '';
        _this._currentCheckState = TransitionCheckState.Init;
        _this._checked = false;
        _this._indeterminate = false;
        _this._controlValueAccessorChangeFn = function () { };
        return _this;
    }
    Object.defineProperty(MdCheckbox.prototype, "disableRipple", {
        /**
         * Whether the ripple effect for this checkbox is disabled.
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disableRipple = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "inputId", {
        /**
         * ID of the native input element inside `<md-checkbox>`
         * @return {?}
         */
        get: function () {
            return "input-" + this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "required", {
        /**
         * Whether the checkbox is required.
         * @return {?}
         */
        get: function () { return this._required; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._required = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "align", {
        /**
         * Whether or not the checkbox should appear before or after the label.
         * @deprecated
         * @return {?}
         */
        get: function () {
            // align refers to the checkbox relative to the label, while labelPosition refers to the
            // label relative to the checkbox. As such, they are inverted.
            return this.labelPosition == 'after' ? 'start' : 'end';
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this.labelPosition = (v == 'start') ? 'after' : 'before';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdCheckbox.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._focusOriginMonitor
            .monitor(this._inputElement.nativeElement, this._renderer, false)
            .subscribe(function (focusOrigin) { return _this._onInputFocusChange(focusOrigin); });
    };
    /**
     * @return {?}
     */
    MdCheckbox.prototype.ngOnDestroy = function () {
        this._focusOriginMonitor.stopMonitoring(this._inputElement.nativeElement);
    };
    Object.defineProperty(MdCheckbox.prototype, "checked", {
        /**
         * Whether the checkbox is checked.
         * @return {?}
         */
        get: function () {
            return this._checked;
        },
        /**
         * @param {?} checked
         * @return {?}
         */
        set: function (checked) {
            if (checked != this.checked) {
                this._checked = checked;
                this._changeDetectorRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "indeterminate", {
        /**
         * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
         * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
         * checkable items. Note that whenever checkbox is manually clicked, indeterminate is immediately
         * set to false.
         * @return {?}
         */
        get: function () {
            return this._indeterminate;
        },
        /**
         * @param {?} indeterminate
         * @return {?}
         */
        set: function (indeterminate) {
            var /** @type {?} */ changed = indeterminate != this._indeterminate;
            this._indeterminate = indeterminate;
            if (changed) {
                if (this._indeterminate) {
                    this._transitionCheckState(TransitionCheckState.Indeterminate);
                }
                else {
                    this._transitionCheckState(this.checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);
                }
                this.indeterminateChange.emit(this._indeterminate);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdCheckbox.prototype._isRippleDisabled = function () {
        return this.disableRipple || this.disabled;
    };
    /**
     * Method being called whenever the label text changes.
     * @return {?}
     */
    MdCheckbox.prototype._onLabelTextChange = function () {
        // This method is getting called whenever the label of the checkbox changes.
        // Since the checkbox uses the OnPush strategy we need to notify it about the change
        // that has been recognized by the cdkObserveContent directive.
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value Value to be set to the model.
     * @return {?}
     */
    MdCheckbox.prototype.writeValue = function (value) {
        this.checked = !!value;
    };
    /**
     * Registers a callback to be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Function to be called on change.
     * @return {?}
     */
    MdCheckbox.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Registers a callback to be triggered when the control has been touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Callback to be triggered when the checkbox is touched.
     * @return {?}
     */
    MdCheckbox.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Sets the checkbox's disabled state. Implemented as a part of ControlValueAccessor.
     * @param {?} isDisabled Whether the checkbox should be disabled.
     * @return {?}
     */
    MdCheckbox.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
        this._changeDetectorRef.markForCheck();
    };
    /**
     * @param {?} newState
     * @return {?}
     */
    MdCheckbox.prototype._transitionCheckState = function (newState) {
        var /** @type {?} */ oldState = this._currentCheckState;
        var /** @type {?} */ renderer = this._renderer;
        var /** @type {?} */ elementRef = this._elementRef;
        if (oldState === newState) {
            return;
        }
        if (this._currentAnimationClass.length > 0) {
            renderer.removeClass(elementRef.nativeElement, this._currentAnimationClass);
        }
        this._currentAnimationClass = this._getAnimationClassForCheckStateTransition(oldState, newState);
        this._currentCheckState = newState;
        if (this._currentAnimationClass.length > 0) {
            renderer.addClass(elementRef.nativeElement, this._currentAnimationClass);
        }
    };
    /**
     * @return {?}
     */
    MdCheckbox.prototype._emitChangeEvent = function () {
        var /** @type {?} */ event = new MdCheckboxChange();
        event.source = this;
        event.checked = this.checked;
        this._controlValueAccessorChangeFn(this.checked);
        this.change.emit(event);
    };
    /**
     * Function is called whenever the focus changes for the input element.
     * @param {?} focusOrigin
     * @return {?}
     */
    MdCheckbox.prototype._onInputFocusChange = function (focusOrigin) {
        if (!this._focusRipple && focusOrigin === 'keyboard') {
            this._focusRipple = this._ripple.launch(0, 0, { persistent: true, centered: true });
        }
        else if (!focusOrigin) {
            this._removeFocusRipple();
            this.onTouched();
        }
    };
    /**
     * Toggles the `checked` state of the checkbox.
     * @return {?}
     */
    MdCheckbox.prototype.toggle = function () {
        this.checked = !this.checked;
    };
    /**
     * Event handler for checkbox input element.
     * Toggles checked state if element is not disabled.
     * Do not toggle on (change) event since IE doesn't fire change event when
     *   indeterminate checkbox is clicked.
     * @param {?} event
     * @return {?}
     */
    MdCheckbox.prototype._onInputClick = function (event) {
        var _this = this;
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `checkbox` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
        this._removeFocusRipple();
        if (!this.disabled) {
            // When user manually click on the checkbox, `indeterminate` is set to false.
            if (this._indeterminate) {
                Promise.resolve().then(function () {
                    _this._indeterminate = false;
                    _this.indeterminateChange.emit(_this._indeterminate);
                });
            }
            this.toggle();
            this._transitionCheckState(this._checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);
            // Emit our custom change event if the native input emitted one.
            // It is important to only emit it, if the native input triggered one, because
            // we don't want to trigger a change event, when the `checked` variable changes for example.
            this._emitChangeEvent();
        }
    };
    /**
     * Focuses the checkbox.
     * @return {?}
     */
    MdCheckbox.prototype.focus = function () {
        this._focusOriginMonitor.focusVia(this._inputElement.nativeElement, 'keyboard');
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdCheckbox.prototype._onInteractionEvent = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
    };
    /**
     * @param {?} oldState
     * @param {?} newState
     * @return {?}
     */
    MdCheckbox.prototype._getAnimationClassForCheckStateTransition = function (oldState, newState) {
        var /** @type {?} */ animSuffix = '';
        switch (oldState) {
            case TransitionCheckState.Init:
                // Handle edge case where user interacts with checkbox that does not have [(ngModel)] or
                // [checked] bound to it.
                if (newState === TransitionCheckState.Checked) {
                    animSuffix = 'unchecked-checked';
                }
                else if (newState == TransitionCheckState.Indeterminate) {
                    animSuffix = 'unchecked-indeterminate';
                }
                else {
                    return '';
                }
                break;
            case TransitionCheckState.Unchecked:
                animSuffix = newState === TransitionCheckState.Checked ?
                    'unchecked-checked' : 'unchecked-indeterminate';
                break;
            case TransitionCheckState.Checked:
                animSuffix = newState === TransitionCheckState.Unchecked ?
                    'checked-unchecked' : 'checked-indeterminate';
                break;
            case TransitionCheckState.Indeterminate:
                animSuffix = newState === TransitionCheckState.Checked ?
                    'indeterminate-checked' : 'indeterminate-unchecked';
                break;
        }
        return "mat-checkbox-anim-" + animSuffix;
    };
    /**
     * Fades out the focus state ripple.
     * @return {?}
     */
    MdCheckbox.prototype._removeFocusRipple = function () {
        if (this._focusRipple) {
            this._focusRipple.fadeOut();
            this._focusRipple = null;
        }
    };
    return MdCheckbox;
}(_MdCheckboxMixinBase));
MdCheckbox.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-checkbox, mat-checkbox',
                template: "<label [attr.for]=\"inputId\" class=\"mat-checkbox-layout\" #label><div class=\"mat-checkbox-inner-container\" [class.mat-checkbox-inner-container-no-side-margin]=\"!checkboxLabel.textContent.trim()\"><input #input class=\"mat-checkbox-input cdk-visually-hidden\" type=\"checkbox\" [id]=\"inputId\" [required]=\"required\" [checked]=\"checked\" [value]=\"value\" [disabled]=\"disabled\" [name]=\"name\" [tabIndex]=\"tabIndex\" [indeterminate]=\"indeterminate\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (change)=\"_onInteractionEvent($event)\" (click)=\"_onInputClick($event)\"><div md-ripple class=\"mat-checkbox-ripple\" [mdRippleTrigger]=\"label\" [mdRippleDisabled]=\"_isRippleDisabled()\" [mdRippleCentered]=\"true\"></div><div class=\"mat-checkbox-frame\"></div><div class=\"mat-checkbox-background\"><svg version=\"1.1\" class=\"mat-checkbox-checkmark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" xml:space=\"preserve\"><path class=\"mat-checkbox-checkmark-path\" fill=\"none\" stroke=\"white\" d=\"M4.1,12.7 9,17.6 20.3,6.3\"/></svg><div class=\"mat-checkbox-mixedmark\"></div></div></div><span class=\"mat-checkbox-label\" #checkboxLabel (cdkObserveContent)=\"_onLabelTextChange()\"><span style=\"display:none\">&nbsp;</span><ng-content></ng-content></span></label>",
                styles: ["@keyframes mat-checkbox-fade-in-background{0%{opacity:0}50%{opacity:1}}@keyframes mat-checkbox-fade-out-background{0%,50%{opacity:1}100%{opacity:0}}@keyframes mat-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:22.91026}50%{animation-timing-function:cubic-bezier(0,0,.2,.1)}100%{stroke-dashoffset:0}}@keyframes mat-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0,0,0,1)}100%{transform:scaleX(1)}}@keyframes mat-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(.4,0,1,1);stroke-dashoffset:0}to{stroke-dashoffset:-22.91026}}@keyframes mat-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0,0,.2,.1);opacity:1;transform:rotate(0)}to{opacity:0;transform:rotate(45deg)}}@keyframes mat-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(.14,0,0,1);opacity:0;transform:rotate(45deg)}to{opacity:1;transform:rotate(360deg)}}@keyframes mat-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:cubic-bezier(0,0,.2,.1);opacity:0;transform:rotate(-45deg)}to{opacity:1;transform:rotate(0)}}@keyframes mat-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(.14,0,0,1);opacity:1;transform:rotate(0)}to{opacity:0;transform:rotate(315deg)}}@keyframes mat-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;opacity:1;transform:scaleX(1)}100%,32.8%{opacity:0;transform:scaleX(0)}}.mat-checkbox-background,.mat-checkbox-checkmark,.mat-checkbox-frame{bottom:0;left:0;position:absolute;right:0;top:0}.mat-checkbox-checkmark,.mat-checkbox-mixedmark{width:calc(100% - 4px)}.mat-checkbox-background,.mat-checkbox-frame{border-radius:2px;box-sizing:border-box;pointer-events:none}.mat-checkbox{transition:background .4s cubic-bezier(.25,.8,.25,1),box-shadow 280ms cubic-bezier(.4,0,.2,1);cursor:pointer}.mat-checkbox-layout{cursor:inherit;align-items:baseline;vertical-align:middle;display:inline-flex}.mat-checkbox-inner-container{display:inline-block;height:20px;line-height:0;margin:auto;margin-right:8px;order:0;position:relative;vertical-align:middle;white-space:nowrap;width:20px;flex-shrink:0}[dir=rtl] .mat-checkbox-inner-container{margin-left:8px;margin-right:auto}.mat-checkbox-inner-container-no-side-margin{margin-left:0;margin-right:0}.mat-checkbox-frame{background-color:transparent;transition:border-color 90ms cubic-bezier(0,0,.2,.1);border-width:2px;border-style:solid}.mat-checkbox-background{align-items:center;display:inline-flex;justify-content:center;transition:background-color 90ms cubic-bezier(0,0,.2,.1),opacity 90ms cubic-bezier(0,0,.2,.1)}.mat-checkbox-checkmark{width:100%}.mat-checkbox-checkmark-path{stroke-dashoffset:22.91026;stroke-dasharray:22.91026;stroke-width:2.66667px}.mat-checkbox-mixedmark{height:2px;opacity:0;transform:scaleX(0) rotate(0)}.mat-checkbox-label-before .mat-checkbox-inner-container{order:1;margin-left:8px;margin-right:auto}[dir=rtl] .mat-checkbox-label-before .mat-checkbox-inner-container{margin-left:auto;margin-right:8px}.mat-checkbox-checked .mat-checkbox-checkmark{opacity:1}.mat-checkbox-checked .mat-checkbox-checkmark-path{stroke-dashoffset:0}.mat-checkbox-checked .mat-checkbox-mixedmark{transform:scaleX(1) rotate(-45deg)}.mat-checkbox-indeterminate .mat-checkbox-checkmark{opacity:0;transform:rotate(45deg)}.mat-checkbox-indeterminate .mat-checkbox-checkmark-path{stroke-dashoffset:0}.mat-checkbox-indeterminate .mat-checkbox-mixedmark{opacity:1;transform:scaleX(1) rotate(0)}.mat-checkbox-unchecked .mat-checkbox-background{background-color:transparent}.mat-checkbox-disabled{cursor:default}.mat-checkbox-anim-unchecked-checked .mat-checkbox-background{animation:180ms linear 0s mat-checkbox-fade-in-background}.mat-checkbox-anim-unchecked-checked .mat-checkbox-checkmark-path{animation:180ms linear 0s mat-checkbox-unchecked-checked-checkmark-path}.mat-checkbox-anim-unchecked-indeterminate .mat-checkbox-background{animation:180ms linear 0s mat-checkbox-fade-in-background}.mat-checkbox-anim-unchecked-indeterminate .mat-checkbox-mixedmark{animation:90ms linear 0s mat-checkbox-unchecked-indeterminate-mixedmark}.mat-checkbox-anim-checked-unchecked .mat-checkbox-background{animation:180ms linear 0s mat-checkbox-fade-out-background}.mat-checkbox-anim-checked-unchecked .mat-checkbox-checkmark-path{animation:90ms linear 0s mat-checkbox-checked-unchecked-checkmark-path}.mat-checkbox-anim-checked-indeterminate .mat-checkbox-checkmark{animation:90ms linear 0s mat-checkbox-checked-indeterminate-checkmark}.mat-checkbox-anim-checked-indeterminate .mat-checkbox-mixedmark{animation:90ms linear 0s mat-checkbox-checked-indeterminate-mixedmark}.mat-checkbox-anim-indeterminate-checked .mat-checkbox-checkmark{animation:.5s linear 0s mat-checkbox-indeterminate-checked-checkmark}.mat-checkbox-anim-indeterminate-checked .mat-checkbox-mixedmark{animation:.5s linear 0s mat-checkbox-indeterminate-checked-mixedmark}.mat-checkbox-anim-indeterminate-unchecked .mat-checkbox-background{animation:180ms linear 0s mat-checkbox-fade-out-background}.mat-checkbox-anim-indeterminate-unchecked .mat-checkbox-mixedmark{animation:.3s linear 0s mat-checkbox-indeterminate-unchecked-mixedmark}.mat-checkbox-input{bottom:0;left:50%}.mat-checkbox-ripple{position:absolute;left:-15px;top:-15px;right:-15px;bottom:-15px;border-radius:50%;z-index:1;pointer-events:none}"],
                host: {
                    'class': 'mat-checkbox',
                    '[class.mat-checkbox-indeterminate]': 'indeterminate',
                    '[class.mat-checkbox-checked]': 'checked',
                    '[class.mat-checkbox-disabled]': 'disabled',
                    '[class.mat-checkbox-label-before]': 'labelPosition == "before"',
                },
                providers: [MD_CHECKBOX_CONTROL_VALUE_ACCESSOR],
                inputs: ['disabled', 'color'],
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
MdCheckbox.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.ChangeDetectorRef, },
    { type: FocusOriginMonitor, },
]; };
MdCheckbox.propDecorators = {
    'ariaLabel': [{ type: _angular_core.Input, args: ['aria-label',] },],
    'ariaLabelledby': [{ type: _angular_core.Input, args: ['aria-labelledby',] },],
    'id': [{ type: _angular_core.Input },],
    'disableRipple': [{ type: _angular_core.Input },],
    'required': [{ type: _angular_core.Input },],
    'align': [{ type: _angular_core.Input },],
    'labelPosition': [{ type: _angular_core.Input },],
    'tabIndex': [{ type: _angular_core.Input },],
    'name': [{ type: _angular_core.Input },],
    'change': [{ type: _angular_core.Output },],
    'indeterminateChange': [{ type: _angular_core.Output },],
    'value': [{ type: _angular_core.Input },],
    '_inputElement': [{ type: _angular_core.ViewChild, args: ['input',] },],
    '_ripple': [{ type: _angular_core.ViewChild, args: [MdRipple,] },],
    'checked': [{ type: _angular_core.Input },],
    'indeterminate': [{ type: _angular_core.Input },],
};
var MdCheckboxModule = (function () {
    function MdCheckboxModule() {
    }
    return MdCheckboxModule;
}());
MdCheckboxModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_common.CommonModule, MdRippleModule, MdCommonModule, _angular_cdk.ObserveContentModule],
                exports: [MdCheckbox, MdCommonModule],
                declarations: [MdCheckbox],
                providers: [FocusOriginMonitor]
            },] },
];
/**
 * @nocollapse
 */
MdCheckboxModule.ctorParameters = function () { return []; };
/**
 * Provider Expression that allows md-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 * \@docs-private
 */
var MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MdRadioGroup; }),
    multi: true
};
var _uniqueIdCounter$2 = 0;
/**
 * Change event object emitted by MdRadio and MdRadioGroup.
 */
var MdRadioChange = (function () {
    function MdRadioChange() {
    }
    return MdRadioChange;
}());
/**
 * \@docs-private
 */
var MdRadioGroupBase = (function () {
    function MdRadioGroupBase() {
    }
    return MdRadioGroupBase;
}());
var _MdRadioGroupMixinBase = mixinDisabled(MdRadioGroupBase);
/**
 * A group of radio buttons. May contain one or more `<md-radio-button>` elements.
 */
var MdRadioGroup = (function (_super) {
    __extends(MdRadioGroup, _super);
    /**
     * @param {?} _changeDetector
     */
    function MdRadioGroup(_changeDetector) {
        var _this = _super.call(this) || this;
        _this._changeDetector = _changeDetector;
        /**
         * Selected value for group. Should equal the value of the selected radio button if there *is*
         * a corresponding radio button with a matching value. If there is *not* such a corresponding
         * radio button, this value persists to be applied in case a new radio button is added with a
         * matching value.
         */
        _this._value = null;
        /**
         * The HTML name attribute applied to radio buttons in this group.
         */
        _this._name = "md-radio-group-" + _uniqueIdCounter$2++;
        /**
         * The currently selected radio button. Should match value.
         */
        _this._selected = null;
        /**
         * Whether the `value` has been set to its initial value.
         */
        _this._isInitialized = false;
        /**
         * Whether the labels should appear after or before the radio-buttons. Defaults to 'after'
         */
        _this._labelPosition = 'after';
        /**
         * Whether the radio group is disabled.
         */
        _this._disabled = false;
        /**
         * The method to be called in order to update ngModel
         */
        _this._controlValueAccessorChangeFn = function () { };
        /**
         * onTouch function registered via registerOnTouch (ControlValueAccessor).
         * \@docs-private
         */
        _this.onTouched = function () { };
        /**
         * Event emitted when the group value changes.
         * Change events are only emitted when the value changes due to user interaction with
         * a radio button (the same behavior as `<input type-"radio">`).
         */
        _this.change = new _angular_core.EventEmitter();
        return _this;
    }
    Object.defineProperty(MdRadioGroup.prototype, "name", {
        /**
         * Name of the radio button group. All radio buttons inside this group will use this name.
         * @return {?}
         */
        get: function () { return this._name; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._name = value;
            this._updateRadioButtonNames();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "align", {
        /**
         * Alignment of the radio-buttons relative to their labels. Can be 'before' or 'after'.
         * @deprecated
         * @return {?}
         */
        get: function () {
            // align refers to the checkbox relative to the label, while labelPosition refers to the
            // label relative to the checkbox. As such, they are inverted.
            return this.labelPosition == 'after' ? 'start' : 'end';
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this.labelPosition = (v == 'start') ? 'after' : 'before';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "labelPosition", {
        /**
         * Whether the labels should appear after or before the radio-buttons. Defaults to 'after'
         * @return {?}
         */
        get: function () {
            return this._labelPosition;
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this._labelPosition = (v == 'before') ? 'before' : 'after';
            this._markRadiosForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "value", {
        /**
         * Value of the radio button.
         * @return {?}
         */
        get: function () { return this._value; },
        /**
         * @param {?} newValue
         * @return {?}
         */
        set: function (newValue) {
            if (this._value != newValue) {
                // Set this before proceeding to ensure no circular loop occurs with selection.
                this._value = newValue;
                this._updateSelectedRadioFromValue();
                this._checkSelectedRadioButton();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdRadioGroup.prototype._checkSelectedRadioButton = function () {
        if (this._selected && !this._selected.checked) {
            this._selected.checked = true;
        }
    };
    Object.defineProperty(MdRadioGroup.prototype, "selected", {
        /**
         * Whether the radio button is selected.
         * @return {?}
         */
        get: function () { return this._selected; },
        /**
         * @param {?} selected
         * @return {?}
         */
        set: function (selected) {
            this._selected = selected;
            this.value = selected ? selected.value : null;
            this._checkSelectedRadioButton();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "disabled", {
        /**
         * Whether the radio group is diabled
         * @return {?}
         */
        get: function () { return this._disabled; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = value;
            this._markRadiosForCheck();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialize properties once content children are available.
     * This allows us to propagate relevant attributes to associated buttons.
     * @return {?}
     */
    MdRadioGroup.prototype.ngAfterContentInit = function () {
        // Mark this component as initialized in AfterContentInit because the initial value can
        // possibly be set by NgModel on MdRadioGroup, and it is possible that the OnInit of the
        // NgModel occurs *after* the OnInit of the MdRadioGroup.
        this._isInitialized = true;
    };
    /**
     * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
     * radio buttons upon their blur.
     * @return {?}
     */
    MdRadioGroup.prototype._touch = function () {
        if (this.onTouched) {
            this.onTouched();
        }
    };
    /**
     * @return {?}
     */
    MdRadioGroup.prototype._updateRadioButtonNames = function () {
        var _this = this;
        if (this._radios) {
            this._radios.forEach(function (radio) {
                radio.name = _this.name;
            });
        }
    };
    /**
     * Updates the `selected` radio button from the internal _value state.
     * @return {?}
     */
    MdRadioGroup.prototype._updateSelectedRadioFromValue = function () {
        var _this = this;
        // If the value already matches the selected radio, do nothing.
        var /** @type {?} */ isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._radios != null && !isAlreadySelected) {
            this._selected = null;
            this._radios.forEach(function (radio) {
                radio.checked = _this.value == radio.value;
                if (radio.checked) {
                    _this._selected = radio;
                }
            });
        }
    };
    /**
     * Dispatch change event with current selection and group value.
     * @return {?}
     */
    MdRadioGroup.prototype._emitChangeEvent = function () {
        if (this._isInitialized) {
            var /** @type {?} */ event = new MdRadioChange();
            event.source = this._selected;
            event.value = this._value;
            this.change.emit(event);
        }
    };
    /**
     * @return {?}
     */
    MdRadioGroup.prototype._markRadiosForCheck = function () {
        if (this._radios) {
            this._radios.forEach(function (radio) { return radio._markForCheck(); });
        }
    };
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value
     * @return {?}
     */
    MdRadioGroup.prototype.writeValue = function (value) {
        this.value = value;
        this._changeDetector.markForCheck();
    };
    /**
     * Registers a callback to be triggered when the model value changes.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Callback to be registered.
     * @return {?}
     */
    MdRadioGroup.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Registers a callback to be triggered when the control is touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Callback to be registered.
     * @return {?}
     */
    MdRadioGroup.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
     * @param {?} isDisabled Whether the control should be disabled.
     * @return {?}
     */
    MdRadioGroup.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
        this._changeDetector.markForCheck();
    };
    return MdRadioGroup;
}(_MdRadioGroupMixinBase));
MdRadioGroup.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-radio-group, mat-radio-group',
                providers: [MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
                host: {
                    'role': 'radiogroup',
                    'class': 'mat-radio-group',
                },
                inputs: ['disabled'],
            },] },
];
/**
 * @nocollapse
 */
MdRadioGroup.ctorParameters = function () { return [
    { type: _angular_core.ChangeDetectorRef, },
]; };
MdRadioGroup.propDecorators = {
    'change': [{ type: _angular_core.Output },],
    '_radios': [{ type: _angular_core.ContentChildren, args: [_angular_core.forwardRef(function () { return MdRadioButton; }),] },],
    'name': [{ type: _angular_core.Input },],
    'align': [{ type: _angular_core.Input },],
    'labelPosition': [{ type: _angular_core.Input },],
    'value': [{ type: _angular_core.Input },],
    'selected': [{ type: _angular_core.Input },],
    'disabled': [{ type: _angular_core.Input },],
};
/**
 * \@docs-private
 */
var MdRadioButtonBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdRadioButtonBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdRadioButtonBase;
}());
// As per Material design specifications the selection control radio should use the accent color
// palette by default. https://material.io/guidelines/components/selection-controls.html
var _MdRadioButtonMixinBase = mixinColor(MdRadioButtonBase, 'accent');
/**
 * A radio-button. May be inside of
 */
var MdRadioButton = (function (_super) {
    __extends(MdRadioButton, _super);
    /**
     * @param {?} radioGroup
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} _changeDetector
     * @param {?} _focusOriginMonitor
     * @param {?} _radioDispatcher
     */
    function MdRadioButton(radioGroup, elementRef, renderer, _changeDetector, _focusOriginMonitor, _radioDispatcher) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._changeDetector = _changeDetector;
        _this._focusOriginMonitor = _focusOriginMonitor;
        _this._radioDispatcher = _radioDispatcher;
        /**
         * The unique ID for the radio button.
         */
        _this.id = "md-radio-" + _uniqueIdCounter$2++;
        /**
         * Event emitted when the checked state of this radio button changes.
         * Change events are only emitted when the value changes due to user interaction with
         * the radio button (the same behavior as `<input type-"radio">`).
         */
        _this.change = new _angular_core.EventEmitter();
        /**
         * Whether this radio is checked.
         */
        _this._checked = false;
        /**
         * Value assigned to this radio.
         */
        _this._value = null;
        /**
         * Unregister function for _radioDispatcher *
         */
        _this._removeUniqueSelectionListener = function () { };
        // Assertions. Ideally these should be stripped out by the compiler.
        // TODO(jelbourn): Assert that there's no name binding AND a parent radio group.
        _this.radioGroup = radioGroup;
        _this._removeUniqueSelectionListener =
            _radioDispatcher.listen(function (id, name) {
                if (id != _this.id && name == _this.name) {
                    _this.checked = false;
                }
            });
        return _this;
    }
    Object.defineProperty(MdRadioButton.prototype, "disableRipple", {
        /**
         * Whether the ripple effect for this radio button is disabled.
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disableRipple = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "checked", {
        /**
         * Whether this radio button is checked.
         * @return {?}
         */
        get: function () {
            return this._checked;
        },
        /**
         * @param {?} newCheckedState
         * @return {?}
         */
        set: function (newCheckedState) {
            if (this._checked != newCheckedState) {
                this._checked = newCheckedState;
                if (newCheckedState && this.radioGroup && this.radioGroup.value != this.value) {
                    this.radioGroup.selected = this;
                }
                else if (!newCheckedState && this.radioGroup && this.radioGroup.value == this.value) {
                    // When unchecking the selected radio button, update the selected radio
                    // property on the group.
                    this.radioGroup.selected = null;
                }
                if (newCheckedState) {
                    // Notify all radio buttons with the same name to un-check.
                    this._radioDispatcher.notify(this.id, this.name);
                }
                this._changeDetector.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "value", {
        /**
         * The value of this radio button.
         * @return {?}
         */
        get: function () {
            return this._value;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (this._value != value) {
                this._value = value;
                if (this.radioGroup != null) {
                    if (!this.checked) {
                        // Update checked when the value changed to match the radio group's value
                        this.checked = this.radioGroup.value == value;
                    }
                    if (this.checked) {
                        this.radioGroup.selected = this;
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "align", {
        /**
         * Whether or not the radio-button should appear before or after the label.
         * @deprecated
         * @return {?}
         */
        get: function () {
            // align refers to the checkbox relative to the label, while labelPosition refers to the
            // label relative to the checkbox. As such, they are inverted.
            return this.labelPosition == 'after' ? 'start' : 'end';
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this.labelPosition = (v == 'start') ? 'after' : 'before';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "labelPosition", {
        /**
         * Whether the label should appear after or before the radio button. Defaults to 'after'
         * @return {?}
         */
        get: function () {
            return this._labelPosition || (this.radioGroup && this.radioGroup.labelPosition) || 'after';
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._labelPosition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "disabled", {
        /**
         * Whether the radio button is disabled.
         * @return {?}
         */
        get: function () {
            return this._disabled || (this.radioGroup != null && this.radioGroup.disabled);
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = _angular_cdk.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "inputId", {
        /**
         * ID of the native input element inside `<md-radio-button>`
         * @return {?}
         */
        get: function () {
            return this.id + "-input";
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Focuses the radio button.
     * @return {?}
     */
    MdRadioButton.prototype.focus = function () {
        this._focusOriginMonitor.focusVia(this._inputElement.nativeElement, 'keyboard');
    };
    /**
     * Marks the radio button as needing checking for change detection.
     * This method is exposed because the parent radio group will directly
     * update bound properties of the radio button.
     * @return {?}
     */
    MdRadioButton.prototype._markForCheck = function () {
        // When group value changes, the button will not be notified. Use `markForCheck` to explicit
        // update radio button's status
        this._changeDetector.markForCheck();
    };
    /**
     * @return {?}
     */
    MdRadioButton.prototype.ngOnInit = function () {
        if (this.radioGroup) {
            // If the radio is inside a radio group, determine if it should be checked
            this.checked = this.radioGroup.value === this._value;
            // Copy name from parent radio group
            this.name = this.radioGroup.name;
        }
    };
    /**
     * @return {?}
     */
    MdRadioButton.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._focusOriginMonitor
            .monitor(this._inputElement.nativeElement, this._renderer, false)
            .subscribe(function (focusOrigin) { return _this._onInputFocusChange(focusOrigin); });
    };
    /**
     * @return {?}
     */
    MdRadioButton.prototype.ngOnDestroy = function () {
        this._focusOriginMonitor.stopMonitoring(this._inputElement.nativeElement);
        this._removeUniqueSelectionListener();
    };
    /**
     * Dispatch change event with current value.
     * @return {?}
     */
    MdRadioButton.prototype._emitChangeEvent = function () {
        var /** @type {?} */ event = new MdRadioChange();
        event.source = this;
        event.value = this._value;
        this.change.emit(event);
    };
    /**
     * @return {?}
     */
    MdRadioButton.prototype._isRippleDisabled = function () {
        return this.disableRipple || this.disabled;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdRadioButton.prototype._onInputClick = function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `radio-button` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    /**
     * Triggered when the radio button received a click or the input recognized any change.
     * Clicking on a label element, will trigger a change event on the associated input.
     * @param {?} event
     * @return {?}
     */
    MdRadioButton.prototype._onInputChange = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
        var /** @type {?} */ groupValueChanged = this.radioGroup && this.value != this.radioGroup.value;
        this.checked = true;
        this._emitChangeEvent();
        if (this.radioGroup) {
            this.radioGroup._controlValueAccessorChangeFn(this.value);
            this.radioGroup._touch();
            if (groupValueChanged) {
                this.radioGroup._emitChangeEvent();
            }
        }
    };
    /**
     * Function is called whenever the focus changes for the input element.
     * @param {?} focusOrigin
     * @return {?}
     */
    MdRadioButton.prototype._onInputFocusChange = function (focusOrigin) {
        if (!this._focusRipple && focusOrigin === 'keyboard') {
            this._focusRipple = this._ripple.launch(0, 0, { persistent: true, centered: true });
        }
        else if (!focusOrigin) {
            if (this.radioGroup) {
                this.radioGroup._touch();
            }
            if (this._focusRipple) {
                this._focusRipple.fadeOut();
                this._focusRipple = null;
            }
        }
    };
    return MdRadioButton;
}(_MdRadioButtonMixinBase));
MdRadioButton.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-radio-button, mat-radio-button',
                template: "<label [attr.for]=\"inputId\" class=\"mat-radio-label\" #label><div class=\"mat-radio-container\"><div class=\"mat-radio-outer-circle\"></div><div class=\"mat-radio-inner-circle\"></div><div md-ripple class=\"mat-radio-ripple\" [mdRippleTrigger]=\"label\" [mdRippleDisabled]=\"_isRippleDisabled()\" [mdRippleCentered]=\"true\"></div></div><input #input class=\"mat-radio-input cdk-visually-hidden\" type=\"radio\" [id]=\"inputId\" [checked]=\"checked\" [disabled]=\"disabled\" [name]=\"name\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (change)=\"_onInputChange($event)\" (click)=\"_onInputClick($event)\"><div class=\"mat-radio-label-content\" [class.mat-radio-label-before]=\"labelPosition == 'before'\"><span style=\"display:none\">&nbsp;</span><ng-content></ng-content></div></label>",
                styles: [".mat-radio-button{display:inline-block}.mat-radio-label{cursor:pointer;display:inline-flex;align-items:center;white-space:nowrap;vertical-align:middle}.mat-radio-container{box-sizing:border-box;display:inline-block;height:20px;position:relative;width:20px}.mat-radio-outer-circle{box-sizing:border-box;height:20px;left:0;position:absolute;top:0;transition:border-color ease 280ms;width:20px;border-width:2px;border-style:solid;border-radius:50%}.mat-radio-inner-circle{border-radius:50%;box-sizing:border-box;height:20px;left:0;position:absolute;top:0;transition:transform ease 280ms,background-color ease 280ms;transform:scale(0);width:20px}.mat-radio-checked .mat-radio-inner-circle{transform:scale(.5)}.mat-radio-label-content{display:inline-block;order:0;line-height:inherit;padding-left:8px;padding-right:0}[dir=rtl] .mat-radio-label-content{padding-right:8px;padding-left:0}.mat-radio-label-content.mat-radio-label-before{order:-1;padding-left:0;padding-right:8px}[dir=rtl] .mat-radio-label-content.mat-radio-label-before{padding-right:0;padding-left:8px}.mat-radio-disabled,.mat-radio-disabled .mat-radio-label{cursor:default}.mat-radio-ripple{position:absolute;left:-15px;top:-15px;right:-15px;bottom:-15px;border-radius:50%;z-index:1;pointer-events:none}"],
                inputs: ['color'],
                encapsulation: _angular_core.ViewEncapsulation.None,
                host: {
                    'class': 'mat-radio-button',
                    '[class.mat-radio-checked]': 'checked',
                    '[class.mat-radio-disabled]': 'disabled',
                    '[attr.id]': 'id',
                },
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdRadioButton.ctorParameters = function () { return [
    { type: MdRadioGroup, decorators: [{ type: _angular_core.Optional },] },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ChangeDetectorRef, },
    { type: FocusOriginMonitor, },
    { type: UniqueSelectionDispatcher, },
]; };
MdRadioButton.propDecorators = {
    'id': [{ type: _angular_core.Input },],
    'name': [{ type: _angular_core.Input },],
    'ariaLabel': [{ type: _angular_core.Input, args: ['aria-label',] },],
    'ariaLabelledby': [{ type: _angular_core.Input, args: ['aria-labelledby',] },],
    'disableRipple': [{ type: _angular_core.Input },],
    'checked': [{ type: _angular_core.Input },],
    'value': [{ type: _angular_core.Input },],
    'align': [{ type: _angular_core.Input },],
    'labelPosition': [{ type: _angular_core.Input },],
    'disabled': [{ type: _angular_core.Input },],
    'change': [{ type: _angular_core.Output },],
    '_ripple': [{ type: _angular_core.ViewChild, args: [MdRipple,] },],
    '_inputElement': [{ type: _angular_core.ViewChild, args: ['input',] },],
};
var MdRadioModule = (function () {
    function MdRadioModule() {
    }
    return MdRadioModule;
}());
MdRadioModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_common.CommonModule, MdRippleModule, MdCommonModule],
                exports: [MdRadioGroup, MdRadioButton, MdCommonModule],
                providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER, VIEWPORT_RULER_PROVIDER, FocusOriginMonitor],
                declarations: [MdRadioGroup, MdRadioButton],
            },] },
];
/**
 * @nocollapse
 */
MdRadioModule.ctorParameters = function () { return []; };
var FocusKeyManager = (function (_super) {
    __extends(FocusKeyManager, _super);
    /**
     * @param {?} items
     */
    function FocusKeyManager(items) {
        return _super.call(this, items) || this;
    }
    /**
     * This method sets the active item to the item at the specified index.
     * It also adds focuses the newly active item.
     * @param {?} index
     * @return {?}
     */
    FocusKeyManager.prototype.setActiveItem = function (index) {
        _super.prototype.setActiveItem.call(this, index);
        if (this.activeItem) {
            this.activeItem.focus();
        }
    };
    return FocusKeyManager;
}(_angular_cdk.ListKeyManager));
/**
 * This animation shrinks the placeholder text to 75% of its normal size and translates
 * it to either the top left corner (ltr) or top right corner (rtl) of the trigger,
 * depending on the text direction of the application.
 */
var transformPlaceholder = _angular_animations.trigger('transformPlaceholder', [
    _angular_animations.state('floating-ltr', _angular_animations.style({
        top: '-22px',
        left: '-2px',
        transform: 'scale(0.75)'
    })),
    _angular_animations.state('floating-rtl', _angular_animations.style({
        top: '-22px',
        left: '2px',
        transform: 'scale(0.75)'
    })),
    _angular_animations.transition('* => *', _angular_animations.animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
]);
/**
 * This animation transforms the select's overlay panel on and off the page.
 *
 * When the panel is attached to the DOM, it expands its width by the amount of padding, scales it
 * up to 100% on the Y axis, fades in its border, and translates slightly up and to the
 * side to ensure the option text correctly overlaps the trigger text.
 *
 * When the panel is removed from the DOM, it simply fades out linearly.
 */
var transformPanel = _angular_animations.trigger('transformPanel', [
    _angular_animations.state('showing', _angular_animations.style({
        opacity: 1,
        minWidth: 'calc(100% + 32px)',
        transform: 'scaleY(1)'
    })),
    _angular_animations.state('showing-multiple', _angular_animations.style({
        opacity: 1,
        minWidth: 'calc(100% + 64px)',
        transform: 'scaleY(1)'
    })),
    _angular_animations.transition('void => *', [
        _angular_animations.style({
            opacity: 0,
            minWidth: '100%',
            transform: 'scaleY(0)'
        }),
        _angular_animations.animate('150ms cubic-bezier(0.25, 0.8, 0.25, 1)')
    ]),
    _angular_animations.transition('* => void', [
        _angular_animations.animate('250ms 100ms linear', _angular_animations.style({ opacity: 0 }))
    ])
]);
/**
 * This animation fades in the background color and text content of the
 * select's options. It is time delayed to occur 100ms after the overlay
 * panel has transformed in.
 */
var fadeInContent = _angular_animations.trigger('fadeInContent', [
    _angular_animations.state('showing', _angular_animations.style({ opacity: 1 })),
    _angular_animations.transition('void => showing', [
        _angular_animations.style({ opacity: 0 }),
        _angular_animations.animate('150ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)')
    ])
]);
/**
 * Returns an exception to be thrown when attempting to change a s
 * elect's `multiple` option after initialization.
 * \@docs-private
 * @return {?}
 */
function getMdSelectDynamicMultipleError() {
    return Error('Cannot change `multiple` mode of select after initialization.');
}
/**
 * Returns an exception to be thrown when attempting to assign a non-array value to a select
 * in `multiple` mode. Note that `undefined` and `null` are still valid values to allow for
 * resetting the value.
 * \@docs-private
 * @return {?}
 */
function getMdSelectNonArrayValueError() {
    return Error('Cannot assign truthy non-array value to select in `multiple` mode.');
}
/**
 * The fixed height of every option element (option, group header etc.).
 */
var SELECT_ITEM_HEIGHT = 48;
/**
 * The max height of the select's overlay panel
 */
var SELECT_PANEL_MAX_HEIGHT = 256;
/**
 * The max number of options visible at once in the select panel.
 */
var SELECT_MAX_OPTIONS_DISPLAYED = Math.floor(SELECT_PANEL_MAX_HEIGHT / SELECT_ITEM_HEIGHT);
/**
 * The fixed height of the select's trigger element.
 */
var SELECT_TRIGGER_HEIGHT = 30;
/**
 * Must adjust for the difference in height between the option and the trigger,
 * so the text will align on the y axis.
 */
var SELECT_OPTION_HEIGHT_ADJUSTMENT = (SELECT_ITEM_HEIGHT - SELECT_TRIGGER_HEIGHT) / 2;
/**
 * The panel's padding on the x-axis
 */
var SELECT_PANEL_PADDING_X = 16;
/**
 * The panel's x axis padding if it is indented (e.g. there is an option group).
 */
var SELECT_PANEL_INDENT_PADDING_X = SELECT_PANEL_PADDING_X * 2;
/**
 * Distance between the panel edge and the option text in
 * multi-selection mode.
 *
 * (SELECT_PADDING * 1.75) + 20 = 48
 * The padding is multiplied by 1.75 because the checkbox's margin is half the padding, and
 * the browser adds ~4px, because we're using inline elements.
 * The checkbox width is 20px.
 */
var SELECT_MULTIPLE_PANEL_PADDING_X = SELECT_PANEL_PADDING_X * 1.75 + 20;
/**
 * The panel's padding on the y-axis. This padding indicates there are more
 * options available if you scroll.
 */
var SELECT_PANEL_PADDING_Y = 16;
/**
 * The select panel will only "fit" inside the viewport if it is positioned at
 * this value or more away from the viewport boundary.
 */
var SELECT_PANEL_VIEWPORT_PADDING = 8;
/**
 * Change event object that is emitted when the select value has changed.
 */
var MdSelectChange = (function () {
    /**
     * @param {?} source
     * @param {?} value
     */
    function MdSelectChange(source, value) {
        this.source = source;
        this.value = value;
    }
    return MdSelectChange;
}());
/**
 * \@docs-private
 */
var MdSelectBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdSelectBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdSelectBase;
}());
var _MdSelectMixinBase = mixinColor(mixinDisabled(MdSelectBase), 'primary');
var MdSelect = (function (_super) {
    __extends(MdSelect, _super);
    /**
     * @param {?} _viewportRuler
     * @param {?} _changeDetectorRef
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _dir
     * @param {?} _control
     * @param {?} tabIndex
     * @param {?} placeholderOptions
     */
    function MdSelect(_viewportRuler, _changeDetectorRef, renderer, elementRef, _dir, _control, tabIndex, placeholderOptions) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._viewportRuler = _viewportRuler;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._dir = _dir;
        _this._control = _control;
        /**
         * Whether or not the overlay panel is open.
         */
        _this._panelOpen = false;
        /**
         * Whether filling out the select is required in the form.
         */
        _this._required = false;
        /**
         * The scroll position of the overlay panel, calculated to center the selected option.
         */
        _this._scrollTop = 0;
        /**
         * Whether the component is in multiple selection mode.
         */
        _this._multiple = false;
        /**
         * The animation state of the placeholder.
         */
        _this._placeholderState = '';
        /**
         * View -> model callback called when value changes
         */
        _this._onChange = function () { };
        /**
         * View -> model callback called when select has been touched
         */
        _this._onTouched = function () { };
        /**
         * The IDs of child options to be passed to the aria-owns attribute.
         */
        _this._optionIds = '';
        /**
         * The value of the select panel's transform-origin property.
         */
        _this._transformOrigin = 'top';
        /**
         * Whether the panel's animation is done.
         */
        _this._panelDoneAnimating = false;
        /**
         * The y-offset of the overlay panel in relation to the trigger's top start corner.
         * This must be adjusted to align the selected option text over the trigger text.
         * when the panel opens. Will change based on the y-position of the selected option.
         */
        _this._offsetY = 0;
        /**
         * This position config ensures that the top "start" corner of the overlay
         * is aligned with with the top "start" of the origin by default (overlapping
         * the trigger completely). If the panel cannot fit below the trigger, it
         * will fall back to a position above the trigger.
         */
        _this._positions = [
            {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'top',
            },
            {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'bottom',
            },
        ];
        /**
         * Aria label of the select. If not specified, the placeholder will be used as label.
         */
        _this.ariaLabel = '';
        /**
         * Input that can be used to specify the `aria-labelledby` attribute.
         */
        _this.ariaLabelledby = '';
        /**
         * Event emitted when the select has been opened.
         */
        _this.onOpen = new _angular_core.EventEmitter();
        /**
         * Event emitted when the select has been closed.
         */
        _this.onClose = new _angular_core.EventEmitter();
        /**
         * Event emitted when the selected value has been changed by the user.
         */
        _this.change = new _angular_core.EventEmitter();
        if (_this._control) {
            _this._control.valueAccessor = _this;
        }
        _this._tabIndex = parseInt(tabIndex) || 0;
        _this._placeholderOptions = placeholderOptions ? placeholderOptions : {};
        _this.floatPlaceholder = _this._placeholderOptions.float || 'auto';
        return _this;
    }
    Object.defineProperty(MdSelect.prototype, "placeholder", {
        /**
         * Placeholder to be shown if no value has been selected.
         * @return {?}
         */
        get: function () { return this._placeholder; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            var _this = this;
            this._placeholder = value;
            // Must wait to record the trigger width to ensure placeholder width is included.
            Promise.resolve(null).then(function () { return _this._setTriggerWidth(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "required", {
        /**
         * Whether the component is required.
         * @return {?}
         */
        get: function () { return this._required; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._required = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "multiple", {
        /**
         * Whether the user should be allowed to select multiple options.
         * @return {?}
         */
        get: function () { return this._multiple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (this._selectionModel) {
                throw getMdSelectDynamicMultipleError();
            }
            this._multiple = _angular_cdk.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "floatPlaceholder", {
        /**
         * Whether to float the placeholder text.
         * @return {?}
         */
        get: function () { return this._floatPlaceholder; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._floatPlaceholder = value || this._placeholderOptions.float || 'auto';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "tabIndex", {
        /**
         * Tab index for the select element.
         * @return {?}
         */
        get: function () { return this.disabled ? -1 : this._tabIndex; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (typeof value !== 'undefined') {
                this._tabIndex = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "optionSelectionChanges", {
        /**
         * Combined stream of all of the child options' change events.
         * @return {?}
         */
        get: function () {
            return rxjs_observable_merge.merge.apply(void 0, this.options.map(function (option) { return option.onSelectionChange; }));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdSelect.prototype.ngOnInit = function () {
        this._selectionModel = new SelectionModel(this.multiple, undefined, false);
    };
    /**
     * @return {?}
     */
    MdSelect.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._initKeyManager();
        this._changeSubscription = _angular_cdk.startWith.call(this.options.changes, null).subscribe(function () {
            _this._resetOptions();
            if (_this._control) {
                // Defer setting the value in order to avoid the "Expression
                // has changed after it was checked" errors from Angular.
                Promise.resolve(null).then(function () { return _this._setSelectionByValue(_this._control.value); });
            }
        });
    };
    /**
     * @return {?}
     */
    MdSelect.prototype.ngOnDestroy = function () {
        this._dropSubscriptions();
        if (this._changeSubscription) {
            this._changeSubscription.unsubscribe();
        }
        if (this._tabSubscription) {
            this._tabSubscription.unsubscribe();
        }
    };
    /**
     * Toggles the overlay panel open or closed.
     * @return {?}
     */
    MdSelect.prototype.toggle = function () {
        this.panelOpen ? this.close() : this.open();
    };
    /**
     * Opens the overlay panel.
     * @return {?}
     */
    MdSelect.prototype.open = function () {
        if (this.disabled || !this.options.length) {
            return;
        }
        if (!this._triggerWidth) {
            this._setTriggerWidth();
        }
        this._calculateOverlayPosition();
        this._placeholderState = this._floatPlaceholderState();
        this._panelOpen = true;
    };
    /**
     * Closes the overlay panel and focuses the host element.
     * @return {?}
     */
    MdSelect.prototype.close = function () {
        if (this._panelOpen) {
            this._panelOpen = false;
            if (this._selectionModel.isEmpty()) {
                this._placeholderState = '';
            }
            this.focus();
        }
    };
    /**
     * Sets the select's value. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param {?} value New value to be written to the model.
     * @return {?}
     */
    MdSelect.prototype.writeValue = function (value) {
        if (this.options) {
            this._setSelectionByValue(value);
        }
    };
    /**
     * Saves a callback function to be invoked when the select's value
     * changes from user input. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param {?} fn Callback to be triggered when the value changes.
     * @return {?}
     */
    MdSelect.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    /**
     * Saves a callback function to be invoked when the select is blurred
     * by the user. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param {?} fn Callback to be triggered when the component has been touched.
     * @return {?}
     */
    MdSelect.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    /**
     * Disables the select. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param {?} isDisabled Sets whether the component is disabled.
     * @return {?}
     */
    MdSelect.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    Object.defineProperty(MdSelect.prototype, "panelOpen", {
        /**
         * Whether or not the overlay panel is open.
         * @return {?}
         */
        get: function () {
            return this._panelOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "selected", {
        /**
         * The currently selected option.
         * @return {?}
         */
        get: function () {
            return this.multiple ? this._selectionModel.selected : this._selectionModel.selected[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "triggerValue", {
        /**
         * The value displayed in the trigger.
         * @return {?}
         */
        get: function () {
            if (this._multiple) {
                var /** @type {?} */ selectedOptions = this._selectionModel.selected.map(function (option) { return option.viewValue; });
                if (this._isRtl()) {
                    selectedOptions.reverse();
                }
                // TODO(crisbeto): delimiter should be configurable for proper localization.
                return selectedOptions.join(', ');
            }
            return this._selectionModel.selected[0].viewValue;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Whether the element is in RTL mode.
     * @return {?}
     */
    MdSelect.prototype._isRtl = function () {
        return this._dir ? this._dir.value === 'rtl' : false;
    };
    /**
     * Sets the width of the trigger element. This is necessary to match
     * the overlay width to the trigger width.
     * @return {?}
     */
    MdSelect.prototype._setTriggerWidth = function () {
        this._triggerWidth = this._getTriggerRect().width;
    };
    /**
     * Handles the keyboard interactions of a closed select.
     * @param {?} event
     * @return {?}
     */
    MdSelect.prototype._handleClosedKeydown = function (event) {
        if (!this.disabled) {
            if (event.keyCode === _angular_cdk.ENTER || event.keyCode === _angular_cdk.SPACE) {
                event.preventDefault(); // prevents the page from scrolling down when pressing space
                this.open();
            }
            else if (event.keyCode === _angular_cdk.UP_ARROW || event.keyCode === _angular_cdk.DOWN_ARROW) {
                this._handleArrowKey(event);
            }
        }
    };
    /**
     * Handles keypresses inside the panel.
     * @param {?} event
     * @return {?}
     */
    MdSelect.prototype._handlePanelKeydown = function (event) {
        if (event.keyCode === _angular_cdk.HOME || event.keyCode === _angular_cdk.END) {
            event.preventDefault();
            event.keyCode === _angular_cdk.HOME ? this._keyManager.setFirstItemActive() :
                this._keyManager.setLastItemActive();
        }
        else {
            this._keyManager.onKeydown(event);
        }
    };
    /**
     * When the panel element is finished transforming in (though not fading in), it
     * emits an event and focuses an option if the panel is open.
     * @return {?}
     */
    MdSelect.prototype._onPanelDone = function () {
        if (this.panelOpen) {
            this._focusCorrectOption();
            this.onOpen.emit();
        }
        else {
            this.onClose.emit();
            this._panelDoneAnimating = false;
            this.overlayDir.offsetX = 0;
        }
    };
    /**
     * When the panel content is done fading in, the _panelDoneAnimating property is
     * set so the proper class can be added to the panel.
     * @return {?}
     */
    MdSelect.prototype._onFadeInDone = function () {
        this._panelDoneAnimating = this.panelOpen;
    };
    /**
     * Calls the touched callback only if the panel is closed. Otherwise, the trigger will
     * "blur" to the panel when it opens, causing a false positive.
     * @return {?}
     */
    MdSelect.prototype._onBlur = function () {
        if (!this.disabled && !this.panelOpen) {
            this._onTouched();
        }
    };
    /**
     * Callback that is invoked when the overlay panel has been attached.
     * @return {?}
     */
    MdSelect.prototype._onAttached = function () {
        this._calculateOverlayOffsetX();
        this._setScrollTop();
    };
    /**
     * Whether the select has a value.
     * @return {?}
     */
    MdSelect.prototype._hasValue = function () {
        return this._selectionModel && this._selectionModel.hasValue();
    };
    /**
     * Sets the scroll position of the scroll container. This must be called after
     * the overlay pane is attached or the scroll container element will not yet be
     * present in the DOM.
     * @return {?}
     */
    MdSelect.prototype._setScrollTop = function () {
        var /** @type {?} */ scrollContainer = this.overlayDir.overlayRef.overlayElement.querySelector('.mat-select-panel'); /** @type {?} */
        ((scrollContainer)).scrollTop = this._scrollTop;
    };
    /**
     * Sets the selected option based on a value. If no option can be
     * found with the designated value, the select trigger is cleared.
     * @param {?} value
     * @param {?=} isUserInput
     * @return {?}
     */
    MdSelect.prototype._setSelectionByValue = function (value, isUserInput) {
        var _this = this;
        if (isUserInput === void 0) { isUserInput = false; }
        var /** @type {?} */ isArray = Array.isArray(value);
        if (this.multiple && value && !isArray) {
            throw getMdSelectNonArrayValueError();
        }
        this._clearSelection();
        if (isArray) {
            value.forEach(function (currentValue) { return _this._selectValue(currentValue, isUserInput); });
            this._sortValues();
        }
        else {
            this._selectValue(value, isUserInput);
        }
        this._setValueWidth();
        if (this._selectionModel.isEmpty()) {
            this._placeholderState = '';
        }
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Finds and selects and option based on its value.
     * @param {?} value
     * @param {?=} isUserInput
     * @return {?} Option that has the corresponding value.
     */
    MdSelect.prototype._selectValue = function (value, isUserInput) {
        if (isUserInput === void 0) { isUserInput = false; }
        var /** @type {?} */ optionsArray = this.options.toArray();
        var /** @type {?} */ correspondingOption = optionsArray.find(function (option) {
            return option.value != null && option.value === value;
        });
        if (correspondingOption) {
            isUserInput ? correspondingOption._selectViaInteraction() : correspondingOption.select();
            this._selectionModel.select(correspondingOption);
            this._keyManager.setActiveItem(optionsArray.indexOf(correspondingOption));
        }
        return correspondingOption;
    };
    /**
     * Clears the select trigger and deselects every option in the list.
     * @param {?=} skip Option that should not be deselected.
     * @return {?}
     */
    MdSelect.prototype._clearSelection = function (skip) {
        this._selectionModel.clear();
        this.options.forEach(function (option) {
            if (option !== skip) {
                option.deselect();
            }
        });
    };
    /**
     * @return {?}
     */
    MdSelect.prototype._getTriggerRect = function () {
        return this.trigger.nativeElement.getBoundingClientRect();
    };
    /**
     * Sets up a key manager to listen to keyboard events on the overlay panel.
     * @return {?}
     */
    MdSelect.prototype._initKeyManager = function () {
        var _this = this;
        this._keyManager = new FocusKeyManager(this.options);
        this._tabSubscription = this._keyManager.tabOut.subscribe(function () { return _this.close(); });
    };
    /**
     * Drops current option subscriptions and IDs and resets from scratch.
     * @return {?}
     */
    MdSelect.prototype._resetOptions = function () {
        this._dropSubscriptions();
        this._listenToOptions();
        this._setOptionIds();
        this._setOptionMultiple();
    };
    /**
     * Listens to user-generated selection events on each option.
     * @return {?}
     */
    MdSelect.prototype._listenToOptions = function () {
        var _this = this;
        this._optionSubscription = _angular_cdk.filter.call(this.optionSelectionChanges, function (event) { return event.isUserInput; }).subscribe(function (event) {
            _this._onSelect(event.source);
            _this._setValueWidth();
            if (!_this.multiple) {
                _this.close();
            }
        });
    };
    /**
     * Invoked when an option is clicked.
     * @param {?} option
     * @return {?}
     */
    MdSelect.prototype._onSelect = function (option) {
        var /** @type {?} */ wasSelected = this._selectionModel.isSelected(option);
        // TODO(crisbeto): handle blank/null options inside multi-select.
        if (this.multiple) {
            this._selectionModel.toggle(option);
            wasSelected ? option.deselect() : option.select();
            this._sortValues();
        }
        else {
            this._clearSelection(option.value == null ? undefined : option);
            if (option.value == null) {
                this._propagateChanges(option.value);
            }
            else {
                this._selectionModel.select(option);
            }
        }
        if (wasSelected !== this._selectionModel.isSelected(option)) {
            this._propagateChanges();
        }
    };
    /**
     * Sorts the model values, ensuring that they keep the same
     * order that they have in the panel.
     * @return {?}
     */
    MdSelect.prototype._sortValues = function () {
        var _this = this;
        if (this._multiple) {
            this._selectionModel.clear();
            this.options.forEach(function (option) {
                if (option.selected) {
                    _this._selectionModel.select(option);
                }
            });
        }
    };
    /**
     * Unsubscribes from all option subscriptions.
     * @return {?}
     */
    MdSelect.prototype._dropSubscriptions = function () {
        if (this._optionSubscription) {
            this._optionSubscription.unsubscribe();
            this._optionSubscription = null;
        }
    };
    /**
     * Emits change event to set the model value.
     * @param {?=} fallbackValue
     * @return {?}
     */
    MdSelect.prototype._propagateChanges = function (fallbackValue) {
        var /** @type {?} */ valueToEmit = null;
        if (Array.isArray(this.selected)) {
            valueToEmit = this.selected.map(function (option) { return option.value; });
        }
        else {
            valueToEmit = this.selected ? this.selected.value : fallbackValue;
        }
        this._onChange(valueToEmit);
        this.change.emit(new MdSelectChange(this, valueToEmit));
    };
    /**
     * Records option IDs to pass to the aria-owns property.
     * @return {?}
     */
    MdSelect.prototype._setOptionIds = function () {
        this._optionIds = this.options.map(function (option) { return option.id; }).join(' ');
    };
    /**
     * Sets the `multiple` property on each option. The promise is necessary
     * in order to avoid Angular errors when modifying the property after init.
     * @return {?}
     */
    MdSelect.prototype._setOptionMultiple = function () {
        var _this = this;
        if (this.multiple) {
            Promise.resolve(null).then(function () {
                _this.options.forEach(function (option) { return option.multiple = _this.multiple; });
            });
        }
    };
    /**
     * Must set the width of the selected option's value programmatically
     * because it is absolutely positioned and otherwise will not clip
     * overflow. The selection arrow is 9px wide, add 4px of padding = 13
     * @return {?}
     */
    MdSelect.prototype._setValueWidth = function () {
        this._selectedValueWidth = this._triggerWidth - 13;
    };
    /**
     * Focuses the selected item. If no option is selected, it will focus
     * the first item instead.
     * @return {?}
     */
    MdSelect.prototype._focusCorrectOption = function () {
        if (this._selectionModel.isEmpty()) {
            this._keyManager.setFirstItemActive();
        }
        else {
            this._keyManager.setActiveItem(/** @type {?} */ ((this._getOptionIndex(this._selectionModel.selected[0]))));
        }
    };
    /**
     * Focuses the select element.
     * @return {?}
     */
    MdSelect.prototype.focus = function () {
        this._elementRef.nativeElement.focus();
    };
    /**
     * Gets the index of the provided option in the option list.
     * @param {?} option
     * @return {?}
     */
    MdSelect.prototype._getOptionIndex = function (option) {
        return this.options.reduce(function (result, current, index) {
            return result === undefined ? (option === current ? index : undefined) : result;
        }, undefined);
    };
    /**
     * Calculates the scroll position and x- and y-offsets of the overlay panel.
     * @return {?}
     */
    MdSelect.prototype._calculateOverlayPosition = function () {
        var /** @type {?} */ items = this._getItemCount();
        var /** @type {?} */ panelHeight = Math.min(items * SELECT_ITEM_HEIGHT, SELECT_PANEL_MAX_HEIGHT);
        var /** @type {?} */ scrollContainerHeight = items * SELECT_ITEM_HEIGHT;
        // The farthest the panel can be scrolled before it hits the bottom
        var /** @type {?} */ maxScroll = scrollContainerHeight - panelHeight;
        if (this._hasValue()) {
            var /** @type {?} */ selectedOptionOffset = ((this._getOptionIndex(this._selectionModel.selected[0])));
            selectedOptionOffset += this._getLabelCountBeforeOption(selectedOptionOffset);
            // We must maintain a scroll buffer so the selected option will be scrolled to the
            // center of the overlay panel rather than the top.
            var /** @type {?} */ scrollBuffer = panelHeight / 2;
            this._scrollTop = this._calculateOverlayScroll(selectedOptionOffset, scrollBuffer, maxScroll);
            this._offsetY = this._calculateOverlayOffsetY(selectedOptionOffset, scrollBuffer, maxScroll);
        }
        else {
            // If no option is selected, the panel centers on the first option. In this case,
            // we must only adjust for the height difference between the option element
            // and the trigger element, then multiply it by -1 to ensure the panel moves
            // in the correct direction up the page.
            this._offsetY = (SELECT_ITEM_HEIGHT - SELECT_TRIGGER_HEIGHT) / 2 * -1 -
                (this._getLabelCountBeforeOption(0) * SELECT_ITEM_HEIGHT);
        }
        this._checkOverlayWithinViewport(maxScroll);
    };
    /**
     * Calculates the scroll position of the select's overlay panel.
     *
     * Attempts to center the selected option in the panel. If the option is
     * too high or too low in the panel to be scrolled to the center, it clamps the
     * scroll position to the min or max scroll positions respectively.
     * @param {?} selectedIndex
     * @param {?} scrollBuffer
     * @param {?} maxScroll
     * @return {?}
     */
    MdSelect.prototype._calculateOverlayScroll = function (selectedIndex, scrollBuffer, maxScroll) {
        var /** @type {?} */ optionOffsetFromScrollTop = SELECT_ITEM_HEIGHT * selectedIndex;
        var /** @type {?} */ halfOptionHeight = SELECT_ITEM_HEIGHT / 2;
        // Starts at the optionOffsetFromScrollTop, which scrolls the option to the top of the
        // scroll container, then subtracts the scroll buffer to scroll the option down to
        // the center of the overlay panel. Half the option height must be re-added to the
        // scrollTop so the option is centered based on its middle, not its top edge.
        var /** @type {?} */ optimalScrollPosition = optionOffsetFromScrollTop - scrollBuffer + halfOptionHeight;
        return clampValue(0, optimalScrollPosition, maxScroll);
    };
    /**
     * Figures out the appropriate animation state for the placeholder.
     * @return {?}
     */
    MdSelect.prototype._getPlaceholderAnimationState = function () {
        if (this.floatPlaceholder === 'never') {
            return '';
        }
        if (this.floatPlaceholder === 'always') {
            return this._floatPlaceholderState();
        }
        return this._placeholderState;
    };
    /**
     * Determines the CSS `opacity` of the placeholder element.
     * @return {?}
     */
    MdSelect.prototype._getPlaceholderOpacity = function () {
        return (this.floatPlaceholder !== 'never' || this._selectionModel.isEmpty()) ?
            '1' : '0';
    };
    Object.defineProperty(MdSelect.prototype, "_ariaLabel", {
        /**
         * Returns the aria-label of the select component.
         * @return {?}
         */
        get: function () {
            // If an ariaLabelledby value has been set, the select should not overwrite the
            // `aria-labelledby` value by setting the ariaLabel to the placeholder.
            return this.ariaLabelledby ? null : this.ariaLabel || this.placeholder;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the x-offset of the overlay panel in relation to the trigger's top start corner.
     * This must be adjusted to align the selected option text over the trigger text when
     * the panel opens. Will change based on LTR or RTL text direction. Note that the offset
     * can't be calculated until the panel has been attached, because we need to know the
     * content width in order to constrain the panel within the viewport.
     * @return {?}
     */
    MdSelect.prototype._calculateOverlayOffsetX = function () {
        var /** @type {?} */ overlayRect = this.overlayDir.overlayRef.overlayElement.getBoundingClientRect();
        var /** @type {?} */ viewportRect = this._viewportRuler.getViewportRect();
        var /** @type {?} */ isRtl = this._isRtl();
        var /** @type {?} */ paddingWidth = this.multiple ? SELECT_MULTIPLE_PANEL_PADDING_X + SELECT_PANEL_PADDING_X :
            SELECT_PANEL_PADDING_X * 2;
        var /** @type {?} */ offsetX;
        // Adjust the offset, depending on the option padding.
        if (this.multiple) {
            offsetX = SELECT_MULTIPLE_PANEL_PADDING_X;
        }
        else {
            var /** @type {?} */ selected = this._selectionModel.selected[0] || this.options.first;
            offsetX = selected && selected.group ? SELECT_PANEL_INDENT_PADDING_X : SELECT_PANEL_PADDING_X;
        }
        // Invert the offset in LTR.
        if (!isRtl) {
            offsetX *= -1;
        }
        // Determine how much the select overflows on each side.
        var /** @type {?} */ leftOverflow = 0 - (overlayRect.left + offsetX - (isRtl ? paddingWidth : 0));
        var /** @type {?} */ rightOverflow = overlayRect.right + offsetX - viewportRect.width
            + (isRtl ? 0 : paddingWidth);
        // If the element overflows on either side, reduce the offset to allow it to fit.
        if (leftOverflow > 0) {
            offsetX += leftOverflow + SELECT_PANEL_VIEWPORT_PADDING;
        }
        else if (rightOverflow > 0) {
            offsetX -= rightOverflow + SELECT_PANEL_VIEWPORT_PADDING;
        }
        // Set the offset directly in order to avoid having to go through change detection and
        // potentially triggering "changed after it was checked" errors.
        this.overlayDir.offsetX = offsetX;
        this.overlayDir.overlayRef.updatePosition();
    };
    /**
     * Calculates the y-offset of the select's overlay panel in relation to the
     * top start corner of the trigger. It has to be adjusted in order for the
     * selected option to be aligned over the trigger when the panel opens.
     * @param {?} selectedIndex
     * @param {?} scrollBuffer
     * @param {?} maxScroll
     * @return {?}
     */
    MdSelect.prototype._calculateOverlayOffsetY = function (selectedIndex, scrollBuffer, maxScroll) {
        var /** @type {?} */ optionOffsetFromPanelTop;
        if (this._scrollTop === 0) {
            optionOffsetFromPanelTop = selectedIndex * SELECT_ITEM_HEIGHT;
        }
        else if (this._scrollTop === maxScroll) {
            var /** @type {?} */ firstDisplayedIndex = this._getItemCount() - SELECT_MAX_OPTIONS_DISPLAYED;
            var /** @type {?} */ selectedDisplayIndex = selectedIndex - firstDisplayedIndex;
            // Because the panel height is longer than the height of the options alone,
            // there is always extra padding at the top or bottom of the panel. When
            // scrolled to the very bottom, this padding is at the top of the panel and
            // must be added to the offset.
            optionOffsetFromPanelTop =
                selectedDisplayIndex * SELECT_ITEM_HEIGHT + SELECT_PANEL_PADDING_Y;
        }
        else {
            // If the option was scrolled to the middle of the panel using a scroll buffer,
            // its offset will be the scroll buffer minus the half height that was added to
            // center it.
            optionOffsetFromPanelTop = scrollBuffer - SELECT_ITEM_HEIGHT / 2;
        }
        // The final offset is the option's offset from the top, adjusted for the height
        // difference, multiplied by -1 to ensure that the overlay moves in the correct
        // direction up the page.
        return optionOffsetFromPanelTop * -1 - SELECT_OPTION_HEIGHT_ADJUSTMENT;
    };
    /**
     * Checks that the attempted overlay position will fit within the viewport.
     * If it will not fit, tries to adjust the scroll position and the associated
     * y-offset so the panel can open fully on-screen. If it still won't fit,
     * sets the offset back to 0 to allow the fallback position to take over.
     * @param {?} maxScroll
     * @return {?}
     */
    MdSelect.prototype._checkOverlayWithinViewport = function (maxScroll) {
        var /** @type {?} */ viewportRect = this._viewportRuler.getViewportRect();
        var /** @type {?} */ triggerRect = this._getTriggerRect();
        var /** @type {?} */ topSpaceAvailable = triggerRect.top - SELECT_PANEL_VIEWPORT_PADDING;
        var /** @type {?} */ bottomSpaceAvailable = viewportRect.height - triggerRect.bottom - SELECT_PANEL_VIEWPORT_PADDING;
        var /** @type {?} */ panelHeightTop = Math.abs(this._offsetY);
        var /** @type {?} */ totalPanelHeight = Math.min(this._getItemCount() * SELECT_ITEM_HEIGHT, SELECT_PANEL_MAX_HEIGHT);
        var /** @type {?} */ panelHeightBottom = totalPanelHeight - panelHeightTop - triggerRect.height;
        if (panelHeightBottom > bottomSpaceAvailable) {
            this._adjustPanelUp(panelHeightBottom, bottomSpaceAvailable);
        }
        else if (panelHeightTop > topSpaceAvailable) {
            this._adjustPanelDown(panelHeightTop, topSpaceAvailable, maxScroll);
        }
        else {
            this._transformOrigin = this._getOriginBasedOnOption();
        }
    };
    /**
     * Adjusts the overlay panel up to fit in the viewport.
     * @param {?} panelHeightBottom
     * @param {?} bottomSpaceAvailable
     * @return {?}
     */
    MdSelect.prototype._adjustPanelUp = function (panelHeightBottom, bottomSpaceAvailable) {
        var /** @type {?} */ distanceBelowViewport = panelHeightBottom - bottomSpaceAvailable;
        // Scrolls the panel up by the distance it was extending past the boundary, then
        // adjusts the offset by that amount to move the panel up into the viewport.
        this._scrollTop -= distanceBelowViewport;
        this._offsetY -= distanceBelowViewport;
        this._transformOrigin = this._getOriginBasedOnOption();
        // If the panel is scrolled to the very top, it won't be able to fit the panel
        // by scrolling, so set the offset to 0 to allow the fallback position to take
        // effect.
        if (this._scrollTop <= 0) {
            this._scrollTop = 0;
            this._offsetY = 0;
            this._transformOrigin = "50% bottom 0px";
        }
    };
    /**
     * Adjusts the overlay panel down to fit in the viewport.
     * @param {?} panelHeightTop
     * @param {?} topSpaceAvailable
     * @param {?} maxScroll
     * @return {?}
     */
    MdSelect.prototype._adjustPanelDown = function (panelHeightTop, topSpaceAvailable, maxScroll) {
        var /** @type {?} */ distanceAboveViewport = panelHeightTop - topSpaceAvailable;
        // Scrolls the panel down by the distance it was extending past the boundary, then
        // adjusts the offset by that amount to move the panel down into the viewport.
        this._scrollTop += distanceAboveViewport;
        this._offsetY += distanceAboveViewport;
        this._transformOrigin = this._getOriginBasedOnOption();
        // If the panel is scrolled to the very bottom, it won't be able to fit the
        // panel by scrolling, so set the offset to 0 to allow the fallback position
        // to take effect.
        if (this._scrollTop >= maxScroll) {
            this._scrollTop = maxScroll;
            this._offsetY = 0;
            this._transformOrigin = "50% top 0px";
            return;
        }
    };
    /**
     * Sets the transform origin point based on the selected option.
     * @return {?}
     */
    MdSelect.prototype._getOriginBasedOnOption = function () {
        var /** @type {?} */ originY = Math.abs(this._offsetY) - SELECT_OPTION_HEIGHT_ADJUSTMENT + SELECT_ITEM_HEIGHT / 2;
        return "50% " + originY + "px 0px";
    };
    /**
     * Figures out the floating placeholder state value.
     * @return {?}
     */
    MdSelect.prototype._floatPlaceholderState = function () {
        return this._isRtl() ? 'floating-rtl' : 'floating-ltr';
    };
    /**
     * Handles the user pressing the arrow keys on a closed select.
     * @param {?} event
     * @return {?}
     */
    MdSelect.prototype._handleArrowKey = function (event) {
        if (this._multiple) {
            event.preventDefault();
            this.open();
        }
        else {
            var /** @type {?} */ prevActiveItem = this._keyManager.activeItem;
            // Cycle though the select options even when the select is closed,
            // matching the behavior of the native select element.
            // TODO(crisbeto): native selects also cycle through the options with left/right arrows,
            // however the key manager only supports up/down at the moment.
            this._keyManager.onKeydown(event);
            var /** @type {?} */ currentActiveItem = (this._keyManager.activeItem);
            if (currentActiveItem !== prevActiveItem) {
                this._clearSelection();
                this._setSelectionByValue(currentActiveItem.value, true);
                this._propagateChanges();
            }
        }
    };
    /**
     * Calculates the amount of items in the select. This includes options and group labels.
     * @return {?}
     */
    MdSelect.prototype._getItemCount = function () {
        return this.options.length + this.optionGroups.length;
    };
    /**
     * Calculates the amount of option group labels that precede the specified option.
     * Useful when positioning the panel, because the labels will offset the index of the
     * currently-selected option.
     * @param {?} optionIndex
     * @return {?}
     */
    MdSelect.prototype._getLabelCountBeforeOption = function (optionIndex) {
        if (this.optionGroups.length) {
            var /** @type {?} */ options = this.options.toArray();
            var /** @type {?} */ groups = this.optionGroups.toArray();
            var /** @type {?} */ groupCounter = 0;
            for (var /** @type {?} */ i = 0; i < optionIndex + 1; i++) {
                if (options[i].group && options[i].group === groups[groupCounter]) {
                    groupCounter++;
                }
            }
            return groupCounter;
        }
        return 0;
    };
    return MdSelect;
}(_MdSelectMixinBase));
MdSelect.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-select, mat-select',
                template: "<div cdk-overlay-origin class=\"mat-select-trigger\" aria-hidden=\"true\" (click)=\"toggle()\" #origin=\"cdkOverlayOrigin\" #trigger><span class=\"mat-select-placeholder\" [class.mat-floating-placeholder]=\"_hasValue()\" [@transformPlaceholder]=\"_getPlaceholderAnimationState()\" [style.opacity]=\"_getPlaceholderOpacity()\" [style.width.px]=\"_selectedValueWidth\">{{ placeholder }} </span><span class=\"mat-select-value\" *ngIf=\"_hasValue()\"><span class=\"mat-select-value-text\">{{ triggerValue }}</span> </span><span class=\"mat-select-arrow\"></span> <span class=\"mat-select-underline\"></span></div><ng-template cdk-connected-overlay hasBackdrop backdropClass=\"cdk-overlay-transparent-backdrop\" [origin]=\"origin\" [open]=\"panelOpen\" [positions]=\"_positions\" [minWidth]=\"_triggerWidth\" [offsetY]=\"_offsetY\" (backdropClick)=\"close()\" (attach)=\"_onAttached()\" (detach)=\"close()\"><div class=\"mat-select-panel {{ 'mat-' + color }}\" [ngClass]=\"panelClass\" [@transformPanel]=\"multiple ? 'showing-multiple' : 'showing'\" (@transformPanel.done)=\"_onPanelDone()\" (keydown)=\"_handlePanelKeydown($event)\" [style.transformOrigin]=\"_transformOrigin\" [class.mat-select-panel-done-animating]=\"_panelDoneAnimating\"><div class=\"mat-select-content\" [@fadeInContent]=\"'showing'\" (@fadeInContent.done)=\"_onFadeInDone()\"><ng-content></ng-content></div></div></ng-template>",
                styles: [".mat-select{display:inline-block;outline:0}.mat-select-trigger{display:flex;align-items:center;height:30px;min-width:112px;cursor:pointer;position:relative;box-sizing:border-box}[aria-disabled=true] .mat-select-trigger{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.mat-select-underline{position:absolute;bottom:0;left:0;right:0;height:1px}[aria-disabled=true] .mat-select-underline{background-image:linear-gradient(to right,rgba(0,0,0,.26) 0,rgba(0,0,0,.26) 33%,transparent 0);background-size:4px 1px;background-repeat:repeat-x;background-color:transparent;background-position:0 bottom}.mat-select-placeholder{position:relative;padding:0 2px;transform-origin:left top;flex-grow:1}.mat-select-placeholder.mat-floating-placeholder{top:-22px;left:-2px;text-align:left;transform:scale(.75)}[dir=rtl] .mat-select-placeholder{transform-origin:right top}[dir=rtl] .mat-select-placeholder.mat-floating-placeholder{left:2px;text-align:right}.mat-select-required .mat-select-placeholder::after{content:'*'}.mat-select-value{position:absolute;max-width:calc(100% - 18px);flex-grow:1;top:0;left:0;bottom:0;display:flex;align-items:center}[dir=rtl] .mat-select-value{left:auto;right:0}.mat-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:30px}.mat-select-arrow{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;margin:0 4px}.mat-select-panel{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;padding-top:0;padding-bottom:0;max-height:256px;min-width:100%}@media screen and (-ms-high-contrast:active){.mat-select-panel{outline:solid 1px}}"],
                inputs: ['color', 'disabled'],
                encapsulation: _angular_core.ViewEncapsulation.None,
                host: {
                    'role': 'listbox',
                    '[attr.tabindex]': 'tabIndex',
                    '[attr.aria-label]': '_ariaLabel',
                    '[attr.aria-labelledby]': 'ariaLabelledby',
                    '[attr.aria-required]': 'required.toString()',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.aria-invalid]': '_control?.invalid || "false"',
                    '[attr.aria-owns]': '_optionIds',
                    '[class.mat-select-disabled]': 'disabled',
                    '[class.mat-select-required]': 'required',
                    'class': 'mat-select',
                    '(keydown)': '_handleClosedKeydown($event)',
                    '(blur)': '_onBlur()',
                },
                animations: [
                    transformPlaceholder,
                    transformPanel,
                    fadeInContent
                ],
                exportAs: 'mdSelect',
            },] },
];
/**
 * @nocollapse
 */
MdSelect.ctorParameters = function () { return [
    { type: ViewportRuler, },
    { type: _angular_core.ChangeDetectorRef, },
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
    { type: _angular_cdk.Directionality, decorators: [{ type: _angular_core.Optional },] },
    { type: _angular_forms.NgControl, decorators: [{ type: _angular_core.Self }, { type: _angular_core.Optional },] },
    { type: undefined, decorators: [{ type: _angular_core.Attribute, args: ['tabindex',] },] },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MD_PLACEHOLDER_GLOBAL_OPTIONS,] },] },
]; };
MdSelect.propDecorators = {
    'trigger': [{ type: _angular_core.ViewChild, args: ['trigger',] },],
    'overlayDir': [{ type: _angular_core.ViewChild, args: [ConnectedOverlayDirective,] },],
    'options': [{ type: _angular_core.ContentChildren, args: [MdOption, { descendants: true },] },],
    'optionGroups': [{ type: _angular_core.ContentChildren, args: [MdOptgroup,] },],
    'panelClass': [{ type: _angular_core.Input },],
    'placeholder': [{ type: _angular_core.Input },],
    'required': [{ type: _angular_core.Input },],
    'multiple': [{ type: _angular_core.Input },],
    'floatPlaceholder': [{ type: _angular_core.Input },],
    'tabIndex': [{ type: _angular_core.Input },],
    'ariaLabel': [{ type: _angular_core.Input, args: ['aria-label',] },],
    'ariaLabelledby': [{ type: _angular_core.Input, args: ['aria-labelledby',] },],
    'onOpen': [{ type: _angular_core.Output },],
    'onClose': [{ type: _angular_core.Output },],
    'change': [{ type: _angular_core.Output },],
};
/**
 * Clamps a value n between min and max values.
 * @param {?} min
 * @param {?} n
 * @param {?} max
 * @return {?}
 */
function clampValue(min, n, max) {
    return Math.min(Math.max(min, n), max);
}
var MdSelectModule = (function () {
    function MdSelectModule() {
    }
    return MdSelectModule;
}());
MdSelectModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule,
                    OverlayModule,
                    MdOptionModule,
                    MdCommonModule,
                ],
                exports: [MdSelect, MdOptionModule, MdCommonModule],
                declarations: [MdSelect],
            },] },
];
/**
 * @nocollapse
 */
MdSelectModule.ctorParameters = function () { return []; };
var MD_SLIDE_TOGGLE_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MdSlideToggle; }),
    multi: true
};
var MdSlideToggleChange = (function () {
    function MdSlideToggleChange() {
    }
    return MdSlideToggleChange;
}());
// Increasing integer for generating unique ids for slide-toggle components.
var nextId$1 = 0;
/**
 * \@docs-private
 */
var MdSlideToggleBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdSlideToggleBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdSlideToggleBase;
}());
var _MdSlideToggleMixinBase = mixinColor(mixinDisabled(MdSlideToggleBase), 'accent');
/**
 * Represents a slidable "switch" toggle that can be moved between on and off.
 */
var MdSlideToggle = (function (_super) {
    __extends(MdSlideToggle, _super);
    /**
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} _platform
     * @param {?} _focusOriginMonitor
     * @param {?} _changeDetectorRef
     */
    function MdSlideToggle(elementRef, renderer, _platform, _focusOriginMonitor, _changeDetectorRef) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._platform = _platform;
        _this._focusOriginMonitor = _focusOriginMonitor;
        _this._changeDetectorRef = _changeDetectorRef;
        _this.onChange = function (_) { };
        _this.onTouched = function () { };
        _this._uniqueId = "md-slide-toggle-" + ++nextId$1;
        _this._checked = false;
        _this._required = false;
        _this._disableRipple = false;
        /**
         * Name value will be applied to the input element if present
         */
        _this.name = null;
        /**
         * A unique id for the slide-toggle input. If none is supplied, it will be auto-generated.
         */
        _this.id = _this._uniqueId;
        /**
         * Used to specify the tabIndex value for the underlying input element.
         */
        _this.tabIndex = 0;
        /**
         * Whether the label should appear after or before the slide-toggle. Defaults to 'after'
         */
        _this.labelPosition = 'after';
        /**
         * Used to set the aria-label attribute on the underlying input element.
         */
        _this.ariaLabel = null;
        /**
         * Used to set the aria-labelledby attribute on the underlying input element.
         */
        _this.ariaLabelledby = null;
        /**
         * An event will be dispatched each time the slide-toggle changes its value.
         */
        _this.change = new _angular_core.EventEmitter();
        return _this;
    }
    Object.defineProperty(MdSlideToggle.prototype, "required", {
        /**
         * Whether the slide-toggle is required.
         * @return {?}
         */
        get: function () { return this._required; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._required = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlideToggle.prototype, "disableRipple", {
        /**
         * Whether the ripple effect for this slide-toggle is disabled.
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disableRipple = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlideToggle.prototype, "inputId", {
        /**
         * Returns the unique id for the visual hidden input.
         * @return {?}
         */
        get: function () { return (this.id || this._uniqueId) + "-input"; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdSlideToggle.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._slideRenderer = new SlideToggleRenderer(this._elementRef, this._platform);
        this._focusOriginMonitor
            .monitor(this._inputElement.nativeElement, this._renderer, false)
            .subscribe(function (focusOrigin) { return _this._onInputFocusChange(focusOrigin); });
    };
    /**
     * @return {?}
     */
    MdSlideToggle.prototype.ngOnDestroy = function () {
        this._focusOriginMonitor.stopMonitoring(this._inputElement.nativeElement);
    };
    /**
     * The onChangeEvent method will be also called on click.
     * This is because everything for the slide-toggle is wrapped inside of a label,
     * which triggers a onChange event on click.
     * @param {?} event
     * @return {?}
     */
    MdSlideToggle.prototype._onChangeEvent = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the component's `change` output.
        event.stopPropagation();
        // Once a drag is currently in progress, we do not want to toggle the slide-toggle on a click.
        if (!this.disabled && !this._slideRenderer.dragging) {
            this.toggle();
            // Emit our custom change event if the native input emitted one.
            // It is important to only emit it, if the native input triggered one, because
            // we don't want to trigger a change event, when the `checked` variable changes for example.
            this._emitChangeEvent();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdSlideToggle.prototype._onInputClick = function (event) {
        this.onTouched();
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} value
     * @return {?}
     */
    MdSlideToggle.prototype.writeValue = function (value) {
        this.checked = value;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn
     * @return {?}
     */
    MdSlideToggle.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn
     * @return {?}
     */
    MdSlideToggle.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Implemented as a part of ControlValueAccessor.
     * @param {?} isDisabled
     * @return {?}
     */
    MdSlideToggle.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Focuses the slide-toggle.
     * @return {?}
     */
    MdSlideToggle.prototype.focus = function () {
        this._focusOriginMonitor.focusVia(this._inputElement.nativeElement, 'keyboard');
    };
    Object.defineProperty(MdSlideToggle.prototype, "checked", {
        /**
         * Whether the slide-toggle is checked.
         * @return {?}
         */
        get: function () { return !!this._checked; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (this.checked !== !!value) {
                this._checked = value;
                this.onChange(this._checked);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Toggles the checked state of the slide-toggle.
     * @return {?}
     */
    MdSlideToggle.prototype.toggle = function () {
        this.checked = !this.checked;
    };
    /**
     * Function is called whenever the focus changes for the input element.
     * @param {?} focusOrigin
     * @return {?}
     */
    MdSlideToggle.prototype._onInputFocusChange = function (focusOrigin) {
        if (!this._focusRipple && focusOrigin === 'keyboard') {
            // For keyboard focus show a persistent ripple as focus indicator.
            this._focusRipple = this._ripple.launch(0, 0, { persistent: true, centered: true });
        }
        else if (!focusOrigin) {
            this.onTouched();
            // Fade out and clear the focus ripple if one is currently present.
            if (this._focusRipple) {
                this._focusRipple.fadeOut();
                this._focusRipple = null;
            }
        }
    };
    /**
     * Emits the change event to the `change` output EventEmitter
     * @return {?}
     */
    MdSlideToggle.prototype._emitChangeEvent = function () {
        var /** @type {?} */ event = new MdSlideToggleChange();
        event.source = this;
        event.checked = this.checked;
        this.change.emit(event);
    };
    /**
     * @return {?}
     */
    MdSlideToggle.prototype._onDragStart = function () {
        if (!this.disabled) {
            this._slideRenderer.startThumbDrag(this.checked);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdSlideToggle.prototype._onDrag = function (event) {
        if (this._slideRenderer.dragging) {
            this._slideRenderer.updateThumbPosition(event.deltaX);
        }
    };
    /**
     * @return {?}
     */
    MdSlideToggle.prototype._onDragEnd = function () {
        var _this = this;
        if (this._slideRenderer.dragging) {
            var /** @type {?} */ _previousChecked = this.checked;
            this.checked = this._slideRenderer.dragPercentage > 50;
            if (_previousChecked !== this.checked) {
                this._emitChangeEvent();
            }
            // The drag should be stopped outside of the current event handler, because otherwise the
            // click event will be fired before and will revert the drag change.
            setTimeout(function () { return _this._slideRenderer.stopThumbDrag(); });
        }
    };
    return MdSlideToggle;
}(_MdSlideToggleMixinBase));
MdSlideToggle.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-slide-toggle, mat-slide-toggle',
                host: {
                    'class': 'mat-slide-toggle',
                    '[class.mat-checked]': 'checked',
                    '[class.mat-disabled]': 'disabled',
                    '[class.mat-slide-toggle-label-before]': 'labelPosition == "before"',
                },
                template: "<label class=\"mat-slide-toggle-label\" #label><div class=\"mat-slide-toggle-bar\"><input #input class=\"mat-slide-toggle-input cdk-visually-hidden\" type=\"checkbox\" [id]=\"inputId\" [required]=\"required\" [tabIndex]=\"tabIndex\" [checked]=\"checked\" [disabled]=\"disabled\" [attr.name]=\"name\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (change)=\"_onChangeEvent($event)\" (click)=\"_onInputClick($event)\"><div class=\"mat-slide-toggle-thumb-container\" (slidestart)=\"_onDragStart()\" (slide)=\"_onDrag($event)\" (slideend)=\"_onDragEnd()\"><div class=\"mat-slide-toggle-thumb\"></div><div class=\"mat-slide-toggle-ripple\" md-ripple [mdRippleTrigger]=\"label\" [mdRippleCentered]=\"true\" [mdRippleDisabled]=\"disableRipple || disabled\"></div></div></div><span class=\"mat-slide-toggle-content\"><ng-content></ng-content></span></label>",
                styles: [".mat-slide-toggle{display:inline-block;height:24px;line-height:24px;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0}.mat-slide-toggle.mat-checked .mat-slide-toggle-thumb-container{transform:translate3d(16px,0,0)}.mat-slide-toggle.mat-disabled .mat-slide-toggle-label,.mat-slide-toggle.mat-disabled .mat-slide-toggle-thumb-container{cursor:default}.mat-slide-toggle-label{display:flex;flex:1;flex-direction:row;align-items:center;cursor:pointer}.mat-slide-toggle-label-before .mat-slide-toggle-label{order:1}.mat-slide-toggle-label-before .mat-slide-toggle-bar{order:2}.mat-slide-toggle-bar,[dir=rtl] .mat-slide-toggle-label-before .mat-slide-toggle-bar{margin-right:8px;margin-left:0}.mat-slide-toggle-label-before .mat-slide-toggle-bar,[dir=rtl] .mat-slide-toggle-bar{margin-left:8px;margin-right:0}.mat-slide-toggle-thumb-container{position:absolute;z-index:1;width:20px;height:20px;top:-3px;left:0;transform:translate3d(0,0,0);transition:all 80ms linear;transition-property:transform;cursor:-webkit-grab;cursor:grab}.mat-slide-toggle-thumb-container.mat-dragging,.mat-slide-toggle-thumb-container:active{cursor:-webkit-grabbing;cursor:grabbing;transition-duration:0s}.mat-slide-toggle-thumb{height:20px;width:20px;border-radius:50%;box-shadow:0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)}@media screen and (-ms-high-contrast:active){.mat-slide-toggle-thumb{background:#fff;border:solid 1px #000}}.mat-slide-toggle-bar{position:relative;width:36px;height:14px;border-radius:8px}@media screen and (-ms-high-contrast:active){.mat-slide-toggle-bar{background:#fff}}.mat-slide-toggle-input{bottom:0;left:10px}.mat-slide-toggle-bar,.mat-slide-toggle-thumb{transition:all 80ms linear;transition-property:background-color;transition-delay:50ms}.mat-slide-toggle-ripple{position:absolute;top:-13px;left:-13px;height:46px;width:46px;border-radius:50%;z-index:1;pointer-events:none}"],
                providers: [MD_SLIDE_TOGGLE_VALUE_ACCESSOR],
                inputs: ['disabled', 'color'],
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
MdSlideToggle.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: _angular_cdk.Platform, },
    { type: FocusOriginMonitor, },
    { type: _angular_core.ChangeDetectorRef, },
]; };
MdSlideToggle.propDecorators = {
    'name': [{ type: _angular_core.Input },],
    'id': [{ type: _angular_core.Input },],
    'tabIndex': [{ type: _angular_core.Input },],
    'labelPosition': [{ type: _angular_core.Input },],
    'ariaLabel': [{ type: _angular_core.Input, args: ['aria-label',] },],
    'ariaLabelledby': [{ type: _angular_core.Input, args: ['aria-labelledby',] },],
    'required': [{ type: _angular_core.Input },],
    'disableRipple': [{ type: _angular_core.Input },],
    'change': [{ type: _angular_core.Output },],
    '_inputElement': [{ type: _angular_core.ViewChild, args: ['input',] },],
    '_ripple': [{ type: _angular_core.ViewChild, args: [MdRipple,] },],
    'checked': [{ type: _angular_core.Input },],
};
/**
 * Renderer for the Slide Toggle component, which separates DOM modification in its own class
 */
var SlideToggleRenderer = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} platform
     */
    function SlideToggleRenderer(_elementRef, platform) {
        this._elementRef = _elementRef;
        /**
         * Whether the thumb is currently being dragged.
         */
        this.dragging = false;
        // We only need to interact with these elements when we're on the browser, so only grab
        // the reference in that case.
        if (platform.isBrowser) {
            this._thumbEl = _elementRef.nativeElement.querySelector('.mat-slide-toggle-thumb-container');
            this._thumbBarEl = _elementRef.nativeElement.querySelector('.mat-slide-toggle-bar');
        }
    }
    /**
     * Initializes the drag of the slide-toggle.
     * @param {?} checked
     * @return {?}
     */
    SlideToggleRenderer.prototype.startThumbDrag = function (checked) {
        if (this.dragging) {
            return;
        }
        this._thumbBarWidth = this._thumbBarEl.clientWidth - this._thumbEl.clientWidth;
        this._thumbEl.classList.add('mat-dragging');
        this._previousChecked = checked;
        this.dragging = true;
    };
    /**
     * Resets the current drag and returns the new checked value.
     * @return {?}
     */
    SlideToggleRenderer.prototype.stopThumbDrag = function () {
        if (!this.dragging) {
            return false;
        }
        this.dragging = false;
        this._thumbEl.classList.remove('mat-dragging');
        // Reset the transform because the component will take care of the thumb position after drag.
        applyCssTransform(this._thumbEl, '');
        return this.dragPercentage > 50;
    };
    /**
     * Updates the thumb containers position from the specified distance.
     * @param {?} distance
     * @return {?}
     */
    SlideToggleRenderer.prototype.updateThumbPosition = function (distance) {
        this.dragPercentage = this._getDragPercentage(distance);
        // Calculate the moved distance based on the thumb bar width.
        var /** @type {?} */ dragX = (this.dragPercentage / 100) * this._thumbBarWidth;
        applyCssTransform(this._thumbEl, "translate3d(" + dragX + "px, 0, 0)");
    };
    /**
     * Retrieves the percentage of thumb from the moved distance. Percentage as fraction of 100.
     * @param {?} distance
     * @return {?}
     */
    SlideToggleRenderer.prototype._getDragPercentage = function (distance) {
        var /** @type {?} */ percentage = (distance / this._thumbBarWidth) * 100;
        // When the toggle was initially checked, then we have to start the drag at the end.
        if (this._previousChecked) {
            percentage += 100;
        }
        return Math.max(0, Math.min(percentage, 100));
    };
    return SlideToggleRenderer;
}());
var MdSlideToggleModule = (function () {
    function MdSlideToggleModule() {
    }
    return MdSlideToggleModule;
}());
MdSlideToggleModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [MdRippleModule, MdCommonModule, _angular_cdk.PlatformModule],
                exports: [MdSlideToggle, MdCommonModule],
                declarations: [MdSlideToggle],
                providers: [
                    FOCUS_ORIGIN_MONITOR_PROVIDER,
                    { provide: _angular_platformBrowser.HAMMER_GESTURE_CONFIG, useClass: GestureConfig }
                ],
            },] },
];
/**
 * @nocollapse
 */
MdSlideToggleModule.ctorParameters = function () { return []; };
/**
 * Visually, a 30px separation between tick marks looks best. This is very subjective but it is
 * the default separation we chose.
 */
var MIN_AUTO_TICK_SEPARATION = 30;
/**
 * The thumb gap size for a disabled slider.
 */
var DISABLED_THUMB_GAP = 7;
/**
 * The thumb gap size for a non-active slider at its minimum value.
 */
var MIN_VALUE_NONACTIVE_THUMB_GAP = 7;
/**
 * The thumb gap size for an active slider at its minimum value.
 */
var MIN_VALUE_ACTIVE_THUMB_GAP = 10;
/**
 * Provider Expression that allows md-slider to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)] and [formControl].
 */
var MD_SLIDER_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MdSlider; }),
    multi: true
};
/**
 * A simple change event emitted by the MdSlider component.
 */
var MdSliderChange = (function () {
    function MdSliderChange() {
    }
    return MdSliderChange;
}());
/**
 * \@docs-private
 */
var MdSliderBase = (function () {
    function MdSliderBase() {
    }
    return MdSliderBase;
}());
var _MdSliderMixinBase = mixinDisabled(MdSliderBase);
/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
var MdSlider = (function (_super) {
    __extends(MdSlider, _super);
    /**
     * @param {?} renderer
     * @param {?} _elementRef
     * @param {?} _focusOriginMonitor
     * @param {?} _changeDetectorRef
     * @param {?} _dir
     */
    function MdSlider(renderer, _elementRef, _focusOriginMonitor, _changeDetectorRef, _dir) {
        var _this = _super.call(this) || this;
        _this._elementRef = _elementRef;
        _this._focusOriginMonitor = _focusOriginMonitor;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._dir = _dir;
        _this._invert = false;
        _this._max = 100;
        _this._min = 0;
        _this._step = 1;
        _this._thumbLabel = false;
        _this._tickInterval = 0;
        _this._value = null;
        _this._vertical = false;
        _this.color = 'accent';
        /**
         * Event emitted when the slider value has changed.
         */
        _this.change = new _angular_core.EventEmitter();
        /**
         * Event emitted when the slider thumb moves.
         */
        _this.input = new _angular_core.EventEmitter();
        /**
         * onTouch function registered via registerOnTouch (ControlValueAccessor).
         */
        _this.onTouched = function () { };
        _this._percent = 0;
        /**
         * Whether or not the thumb is sliding.
         * Used to determine if there should be a transition for the thumb and fill track.
         */
        _this._isSliding = false;
        /**
         * Whether or not the slider is active (clicked or sliding).
         * Used to shrink and grow the thumb as according to the Material Design spec.
         */
        _this._isActive = false;
        /**
         * The size of a tick interval as a percentage of the size of the track.
         */
        _this._tickIntervalPercent = 0;
        /**
         * The dimensions of the slider.
         */
        _this._sliderDimensions = null;
        _this._controlValueAccessorChangeFn = function () { };
        _this._focusOriginMonitor
            .monitor(_this._elementRef.nativeElement, renderer, true)
            .subscribe(function (origin) { return _this._isActive = !!origin && origin !== 'keyboard'; });
        _this._renderer = new SliderRenderer(_this._elementRef);
        return _this;
    }
    Object.defineProperty(MdSlider.prototype, "invert", {
        /**
         * Whether the slider is inverted.
         * @return {?}
         */
        get: function () { return this._invert; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._invert = _angular_cdk.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "max", {
        /**
         * The maximum value that the slider can have.
         * @return {?}
         */
        get: function () { return this._max; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this._max = _angular_cdk.coerceNumberProperty(v, this._max);
            this._percent = this._calculatePercentage(this._value);
            // Since this also modifies the percentage, we need to let the change detection know.
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "min", {
        /**
         * The minimum value that the slider can have.
         * @return {?}
         */
        get: function () { return this._min; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this._min = _angular_cdk.coerceNumberProperty(v, this._min);
            // If the value wasn't explicitly set by the user, set it to the min.
            if (this._value === null) {
                this.value = this._min;
            }
            this._percent = this._calculatePercentage(this._value);
            // Since this also modifies the percentage, we need to let the change detection know.
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "step", {
        /**
         * The values at which the thumb will snap.
         * @return {?}
         */
        get: function () { return this._step; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this._step = _angular_cdk.coerceNumberProperty(v, this._step);
            if (this._step % 1 !== 0) {
                this._roundLabelTo = ((this._step.toString().split('.').pop())).length;
            }
            // Since this could modify the label, we need to notify the change detection.
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "thumbLabel", {
        /**
         * Whether or not to show the thumb label.
         * @return {?}
         */
        get: function () { return this._thumbLabel; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._thumbLabel = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_thumbLabelDeprecated", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this._thumbLabel; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._thumbLabel = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "tickInterval", {
        /**
         * How often to show ticks. Relative to the step so that a tick always appears on a step.
         * Ex: Tick interval of 4 with a step of 3 will draw a tick every 4 steps (every 12 values).
         * @return {?}
         */
        get: function () { return this._tickInterval; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value === 'auto') {
                this._tickInterval = 'auto';
            }
            else if (typeof value === 'number' || typeof value === 'string') {
                this._tickInterval = _angular_cdk.coerceNumberProperty(value, /** @type {?} */ (this._tickInterval));
            }
            else {
                this._tickInterval = 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_tickIntervalDeprecated", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this.tickInterval; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.tickInterval = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "value", {
        /**
         * Value of the slider.
         * @return {?}
         */
        get: function () {
            // If the value needs to be read and it is still uninitialized, initialize it to the min.
            if (this._value === null) {
                this.value = this._min;
            }
            return this._value;
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            if (v !== this._value) {
                this._value = _angular_cdk.coerceNumberProperty(v, this._value || 0);
                this._percent = this._calculatePercentage(this._value);
                // Since this also modifies the percentage, we need to let the change detection know.
                this._changeDetectorRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "vertical", {
        /**
         * Whether the slider is vertical.
         * @return {?}
         */
        get: function () { return this._vertical; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._vertical = _angular_cdk.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "displayValue", {
        /**
         * The value to be used for display purposes.
         * @return {?}
         */
        get: function () {
            // Note that this could be improved further by rounding something like 0.999 to 1 or
            // 0.899 to 0.9, however it is very performance sensitive, because it gets called on
            // every change detection cycle.
            if (this._roundLabelTo && this.value && this.value % 1 !== 0) {
                return this.value.toFixed(this._roundLabelTo);
            }
            return this.value || 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "percent", {
        /**
         * The percentage of the slider that coincides with the value.
         * @return {?}
         */
        get: function () { return this._clamp(this._percent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_invertAxis", {
        /**
         * Whether the axis of the slider is inverted.
         * (i.e. whether moving the thumb in the positive x or y direction decreases the slider's value).
         * @return {?}
         */
        get: function () {
            // Standard non-inverted mode for a vertical slider should be dragging the thumb from bottom to
            // top. However from a y-axis standpoint this is inverted.
            return this.vertical ? !this.invert : this.invert;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_isMinValue", {
        /**
         * Whether the slider is at its minimum value.
         * @return {?}
         */
        get: function () {
            return this.percent === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_thumbGap", {
        /**
         * The amount of space to leave between the slider thumb and the track fill & track background
         * elements.
         * @return {?}
         */
        get: function () {
            if (this.disabled) {
                return DISABLED_THUMB_GAP;
            }
            if (this._isMinValue && !this.thumbLabel) {
                return this._isActive ? MIN_VALUE_ACTIVE_THUMB_GAP : MIN_VALUE_NONACTIVE_THUMB_GAP;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_trackBackgroundStyles", {
        /**
         * CSS styles for the track background element.
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ axis = this.vertical ? 'Y' : 'X';
            var /** @type {?} */ sign = this._invertMouseCoords ? '-' : '';
            return {
                'transform': "translate" + axis + "(" + sign + this._thumbGap + "px) scale" + axis + "(" + (1 - this.percent) + ")"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_trackFillStyles", {
        /**
         * CSS styles for the track fill element.
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ axis = this.vertical ? 'Y' : 'X';
            var /** @type {?} */ sign = this._invertMouseCoords ? '' : '-';
            return {
                'transform': "translate" + axis + "(" + sign + this._thumbGap + "px) scale" + axis + "(" + this.percent + ")"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_ticksContainerStyles", {
        /**
         * CSS styles for the ticks container element.
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ axis = this.vertical ? 'Y' : 'X';
            // For a horizontal slider in RTL languages we push the ticks container off the left edge
            // instead of the right edge to avoid causing a horizontal scrollbar to appear.
            var /** @type {?} */ sign = !this.vertical && this._direction == 'rtl' ? '' : '-';
            var /** @type {?} */ offset = this._tickIntervalPercent / 2 * 100;
            return {
                'transform': "translate" + axis + "(" + sign + offset + "%)"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_ticksStyles", {
        /**
         * CSS styles for the ticks element.
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ tickSize = this._tickIntervalPercent * 100;
            var /** @type {?} */ backgroundSize = this.vertical ? "2px " + tickSize + "%" : tickSize + "% 2px";
            var /** @type {?} */ axis = this.vertical ? 'Y' : 'X';
            // Depending on the direction we pushed the ticks container, push the ticks the opposite
            // direction to re-center them but clip off the end edge. In RTL languages we need to flip the
            // ticks 180 degrees so we're really cutting off the end edge abd not the start.
            var /** @type {?} */ sign = !this.vertical && this._direction == 'rtl' ? '-' : '';
            var /** @type {?} */ rotate = !this.vertical && this._direction == 'rtl' ? ' rotate(180deg)' : '';
            var /** @type {?} */ styles = {
                'backgroundSize': backgroundSize,
                // Without translateZ ticks sometimes jitter as the slider moves on Chrome & Firefox.
                'transform': "translateZ(0) translate" + axis + "(" + sign + tickSize / 2 + "%)" + rotate
            };
            if (this._isMinValue && this._thumbGap) {
                var /** @type {?} */ side = this.vertical ?
                    (this._invertAxis ? 'Bottom' : 'Top') :
                    (this._invertAxis ? 'Right' : 'Left');
                styles["padding" + side] = this._thumbGap + "px";
            }
            return styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_thumbContainerStyles", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ axis = this.vertical ? 'Y' : 'X';
            // For a horizontal slider in RTL languages we push the thumb container off the left edge
            // instead of the right edge to avoid causing a horizontal scrollbar to appear.
            var /** @type {?} */ invertOffset = (this._direction == 'rtl' && !this.vertical) ? !this._invertAxis : this._invertAxis;
            var /** @type {?} */ offset = (invertOffset ? this.percent : 1 - this.percent) * 100;
            return {
                'transform': "translate" + axis + "(-" + offset + "%)"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_invertMouseCoords", {
        /**
         * Whether mouse events should be converted to a slider position by calculating their distance
         * from the right or bottom edge of the slider as opposed to the top or left.
         * @return {?}
         */
        get: function () {
            return (this._direction == 'rtl' && !this.vertical) ? !this._invertAxis : this._invertAxis;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_direction", {
        /**
         * The language direction for this slider element.
         * @return {?}
         */
        get: function () {
            return (this._dir && this._dir.value == 'rtl') ? 'rtl' : 'ltr';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdSlider.prototype.ngOnDestroy = function () {
        this._focusOriginMonitor.stopMonitoring(this._elementRef.nativeElement);
    };
    /**
     * @return {?}
     */
    MdSlider.prototype._onMouseenter = function () {
        if (this.disabled) {
            return;
        }
        // We save the dimensions of the slider here so we can use them to update the spacing of the
        // ticks and determine where on the slider click and slide events happen.
        this._sliderDimensions = this._renderer.getSliderDimensions();
        this._updateTickIntervalPercent();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdSlider.prototype._onClick = function (event) {
        if (this.disabled) {
            return;
        }
        this._isSliding = false;
        this._renderer.addFocus();
        this._updateValueFromPosition({ x: event.clientX, y: event.clientY });
        /* Emits a change and input event if the value changed. */
        this._emitInputEvent();
        this._emitValueIfChanged();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdSlider.prototype._onSlide = function (event) {
        if (this.disabled) {
            return;
        }
        // Prevent the slide from selecting anything else.
        event.preventDefault();
        this._updateValueFromPosition({ x: event.center.x, y: event.center.y });
        // Native range elements always emit `input` events when the value changed while sliding.
        this._emitInputEvent();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdSlider.prototype._onSlideStart = function (event) {
        if (this.disabled) {
            return;
        }
        // Simulate mouseenter in case this is a mobile device.
        this._onMouseenter();
        event.preventDefault();
        this._isSliding = true;
        this._renderer.addFocus();
        this._updateValueFromPosition({ x: event.center.x, y: event.center.y });
    };
    /**
     * @return {?}
     */
    MdSlider.prototype._onSlideEnd = function () {
        this._isSliding = false;
        this._emitValueIfChanged();
    };
    /**
     * @return {?}
     */
    MdSlider.prototype._onFocus = function () {
        // We save the dimensions of the slider here so we can use them to update the spacing of the
        // ticks and determine where on the slider click and slide events happen.
        this._sliderDimensions = this._renderer.getSliderDimensions();
        this._updateTickIntervalPercent();
    };
    /**
     * @return {?}
     */
    MdSlider.prototype._onBlur = function () {
        this.onTouched();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdSlider.prototype._onKeydown = function (event) {
        if (this.disabled) {
            return;
        }
        switch (event.keyCode) {
            case _angular_cdk.PAGE_UP:
                this._increment(10);
                break;
            case _angular_cdk.PAGE_DOWN:
                this._increment(-10);
                break;
            case _angular_cdk.END:
                this.value = this.max;
                break;
            case _angular_cdk.HOME:
                this.value = this.min;
                break;
            case _angular_cdk.LEFT_ARROW:
                // NOTE: For a sighted user it would make more sense that when they press an arrow key on an
                // inverted slider the thumb moves in that direction. However for a blind user, nothing
                // about the slider indicates that it is inverted. They will expect left to be decrement,
                // regardless of how it appears on the screen. For speakers ofRTL languages, they probably
                // expect left to mean increment. Therefore we flip the meaning of the side arrow keys for
                // RTL. For inverted sliders we prefer a good a11y experience to having it "look right" for
                // sighted users, therefore we do not swap the meaning.
                this._increment(this._direction == 'rtl' ? 1 : -1);
                break;
            case _angular_cdk.UP_ARROW:
                this._increment(1);
                break;
            case _angular_cdk.RIGHT_ARROW:
                // See comment on LEFT_ARROW about the conditions under which we flip the meaning.
                this._increment(this._direction == 'rtl' ? -1 : 1);
                break;
            case _angular_cdk.DOWN_ARROW:
                this._increment(-1);
                break;
            default:
                // Return if the key is not one that we explicitly handle to avoid calling preventDefault on
                // it.
                return;
        }
        this._emitInputEvent();
        this._emitValueIfChanged();
        this._isSliding = true;
        event.preventDefault();
    };
    /**
     * @return {?}
     */
    MdSlider.prototype._onKeyup = function () {
        this._isSliding = false;
    };
    /**
     * Increments the slider by the given number of steps (negative number decrements).
     * @param {?} numSteps
     * @return {?}
     */
    MdSlider.prototype._increment = function (numSteps) {
        this.value = this._clamp((this.value || 0) + this.step * numSteps, this.min, this.max);
    };
    /**
     * Calculate the new value from the new physical location. The value will always be snapped.
     * @param {?} pos
     * @return {?}
     */
    MdSlider.prototype._updateValueFromPosition = function (pos) {
        if (!this._sliderDimensions) {
            return;
        }
        var /** @type {?} */ offset = this.vertical ? this._sliderDimensions.top : this._sliderDimensions.left;
        var /** @type {?} */ size = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
        var /** @type {?} */ posComponent = this.vertical ? pos.y : pos.x;
        // The exact value is calculated from the event and used to find the closest snap value.
        var /** @type {?} */ percent = this._clamp((posComponent - offset) / size);
        if (this._invertMouseCoords) {
            percent = 1 - percent;
        }
        var /** @type {?} */ exactValue = this._calculateValue(percent);
        // This calculation finds the closest step by finding the closest whole number divisible by the
        // step relative to the min.
        var /** @type {?} */ closestValue = Math.round((exactValue - this.min) / this.step) * this.step + this.min;
        // The value needs to snap to the min and max.
        this.value = this._clamp(closestValue, this.min, this.max);
    };
    /**
     * Emits a change event if the current value is different from the last emitted value.
     * @return {?}
     */
    MdSlider.prototype._emitValueIfChanged = function () {
        if (this.value != this._lastChangeValue) {
            var /** @type {?} */ event = this._createChangeEvent();
            this._lastChangeValue = this.value;
            this._controlValueAccessorChangeFn(this.value);
            this.change.emit(event);
        }
    };
    /**
     * Emits an input event when the current value is different from the last emitted value.
     * @return {?}
     */
    MdSlider.prototype._emitInputEvent = function () {
        if (this.value != this._lastInputValue) {
            var /** @type {?} */ event = this._createChangeEvent();
            this._lastInputValue = this.value;
            this.input.emit(event);
        }
    };
    /**
     * Updates the amount of space between ticks as a percentage of the width of the slider.
     * @return {?}
     */
    MdSlider.prototype._updateTickIntervalPercent = function () {
        if (!this.tickInterval || !this._sliderDimensions) {
            return;
        }
        if (this.tickInterval == 'auto') {
            var /** @type {?} */ trackSize = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
            var /** @type {?} */ pixelsPerStep = trackSize * this.step / (this.max - this.min);
            var /** @type {?} */ stepsPerTick = Math.ceil(MIN_AUTO_TICK_SEPARATION / pixelsPerStep);
            var /** @type {?} */ pixelsPerTick = stepsPerTick * this.step;
            this._tickIntervalPercent = pixelsPerTick / trackSize;
        }
        else {
            this._tickIntervalPercent = this.tickInterval * this.step / (this.max - this.min);
        }
    };
    /**
     * Creates a slider change object from the specified value.
     * @param {?=} value
     * @return {?}
     */
    MdSlider.prototype._createChangeEvent = function (value) {
        if (value === void 0) { value = this.value; }
        var /** @type {?} */ event = new MdSliderChange();
        event.source = this;
        event.value = value;
        return event;
    };
    /**
     * Calculates the percentage of the slider that a value is.
     * @param {?} value
     * @return {?}
     */
    MdSlider.prototype._calculatePercentage = function (value) {
        return ((value || 0) - this.min) / (this.max - this.min);
    };
    /**
     * Calculates the value a percentage of the slider corresponds to.
     * @param {?} percentage
     * @return {?}
     */
    MdSlider.prototype._calculateValue = function (percentage) {
        return this.min + percentage * (this.max - this.min);
    };
    /**
     * Return a number between two numbers.
     * @param {?} value
     * @param {?=} min
     * @param {?=} max
     * @return {?}
     */
    MdSlider.prototype._clamp = function (value, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        return Math.max(min, Math.min(value, max));
    };
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value
     * @return {?}
     */
    MdSlider.prototype.writeValue = function (value) {
        this.value = value;
    };
    /**
     * Registers a callback to eb triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Callback to be registered.
     * @return {?}
     */
    MdSlider.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Registers a callback to be triggered when the component is touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Callback to be registered.
     * @return {?}
     */
    MdSlider.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Sets whether the component should be disabled.
     * Implemented as part of ControlValueAccessor.
     * @param {?} isDisabled
     * @return {?}
     */
    MdSlider.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    return MdSlider;
}(_MdSliderMixinBase));
MdSlider.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-slider, mat-slider',
                providers: [MD_SLIDER_VALUE_ACCESSOR],
                host: {
                    '(focus)': '_onFocus()',
                    '(blur)': '_onBlur()',
                    '(click)': '_onClick($event)',
                    '(keydown)': '_onKeydown($event)',
                    '(keyup)': '_onKeyup()',
                    '(mouseenter)': '_onMouseenter()',
                    '(slide)': '_onSlide($event)',
                    '(slideend)': '_onSlideEnd()',
                    '(slidestart)': '_onSlideStart($event)',
                    'class': 'mat-slider',
                    'role': 'slider',
                    'tabindex': '0',
                    '[attr.aria-disabled]': 'disabled',
                    '[attr.aria-valuemax]': 'max',
                    '[attr.aria-valuemin]': 'min',
                    '[attr.aria-valuenow]': 'value',
                    '[attr.aria-orientation]': 'vertical ? "vertical" : "horizontal"',
                    '[class.mat-primary]': 'color == "primary"',
                    '[class.mat-accent]': 'color != "primary" && color != "warn"',
                    '[class.mat-warn]': 'color == "warn"',
                    '[class.mat-slider-disabled]': 'disabled',
                    '[class.mat-slider-has-ticks]': 'tickInterval',
                    '[class.mat-slider-horizontal]': '!vertical',
                    '[class.mat-slider-axis-inverted]': '_invertAxis',
                    '[class.mat-slider-sliding]': '_isSliding',
                    '[class.mat-slider-thumb-label-showing]': 'thumbLabel',
                    '[class.mat-slider-vertical]': 'vertical',
                    '[class.mat-slider-min-value]': '_isMinValue',
                    '[class.mat-slider-hide-last-tick]': 'disabled || _isMinValue && _thumbGap && _invertAxis',
                },
                template: "<div class=\"mat-slider-wrapper\"><div class=\"mat-slider-track-wrapper\"><div class=\"mat-slider-track-background\" [ngStyle]=\"_trackBackgroundStyles\"></div><div class=\"mat-slider-track-fill\" [ngStyle]=\"_trackFillStyles\"></div></div><div class=\"mat-slider-ticks-container\" [ngStyle]=\"_ticksContainerStyles\"><div class=\"mat-slider-ticks\" [ngStyle]=\"_ticksStyles\"></div></div><div class=\"mat-slider-thumb-container\" [ngStyle]=\"_thumbContainerStyles\"><div class=\"mat-slider-focus-ring\"></div><div class=\"mat-slider-thumb\"></div><div class=\"mat-slider-thumb-label\"><span class=\"mat-slider-thumb-label-text\">{{displayValue}}</span></div></div></div>",
                styles: [".mat-slider{display:inline-block;position:relative;box-sizing:border-box;padding:8px;outline:0;vertical-align:middle}.mat-slider-wrapper{position:absolute}.mat-slider-track-wrapper{position:absolute;top:0;left:0;overflow:hidden}.mat-slider-track-fill{position:absolute;transform-origin:0 0;transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-track-background{position:absolute;transform-origin:100% 100%;transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-ticks-container{position:absolute;left:0;top:0;overflow:hidden}.mat-slider-ticks{background-repeat:repeat;background-clip:content-box;box-sizing:border-box;opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-thumb-container{position:absolute;z-index:1;transition:transform .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-focus-ring{position:absolute;width:30px;height:30px;border-radius:50%;transform:scale(0);opacity:0;transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1),opacity .4s cubic-bezier(.25,.8,.25,1)}.cdk-keyboard-focused .mat-slider-focus-ring{transform:scale(1);opacity:1}.mat-slider:not(.mat-slider-disabled) .mat-slider-thumb,.mat-slider:not(.mat-slider-disabled) .mat-slider-thumb-label{cursor:-webkit-grab;cursor:grab}.mat-slider-sliding:not(.mat-slider-disabled) .mat-slider-thumb,.mat-slider-sliding:not(.mat-slider-disabled) .mat-slider-thumb-label,.mat-slider:not(.mat-slider-disabled) .mat-slider-thumb-label:active,.mat-slider:not(.mat-slider-disabled) .mat-slider-thumb:active{cursor:-webkit-grabbing;cursor:grabbing}.mat-slider-thumb{position:absolute;right:-10px;bottom:-10px;box-sizing:border-box;width:20px;height:20px;border:3px solid transparent;border-radius:50%;transform:scale(.7);transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1),border-color .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-thumb-label{display:none;align-items:center;justify-content:center;position:absolute;width:28px;height:28px;border-radius:50%;transition:transform .4s cubic-bezier(.25,.8,.25,1),border-radius .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-thumb-label-text{z-index:1;opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-sliding .mat-slider-thumb-container,.mat-slider-sliding .mat-slider-track-background,.mat-slider-sliding .mat-slider-track-fill{transition-duration:0s}.mat-slider-has-ticks .mat-slider-wrapper::after{content:'';position:absolute;border-width:0;border-style:solid;opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after,.mat-slider-has-ticks:hover:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after{opacity:1}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-disabled) .mat-slider-ticks,.mat-slider-has-ticks:hover:not(.mat-slider-disabled) .mat-slider-ticks{opacity:1}.mat-slider-thumb-label-showing .mat-slider-focus-ring{transform:scale(0);opacity:0}.mat-slider-thumb-label-showing .mat-slider-thumb-label{display:flex}.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:100% 100%}.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:0 0}.cdk-focused.mat-slider-thumb-label-showing .mat-slider-thumb{transform:scale(0)}.cdk-focused .mat-slider-thumb-label{border-radius:50% 50% 0}.cdk-focused .mat-slider-thumb-label-text{opacity:1}.cdk-mouse-focused .mat-slider-thumb,.cdk-program-focused .mat-slider-thumb,.cdk-touch-focused .mat-slider-thumb{border-width:2px;transform:scale(1)}.mat-slider-disabled .mat-slider-focus-ring{transform:scale(0);opacity:0}.mat-slider-disabled .mat-slider-thumb{border-width:4px;transform:scale(.5)}.mat-slider-disabled .mat-slider-thumb-label{display:none}.mat-slider-horizontal{height:48px;min-width:128px}.mat-slider-horizontal .mat-slider-wrapper{height:2px;top:23px;left:8px;right:8px}.mat-slider-horizontal .mat-slider-wrapper::after{height:2px;border-left-width:2px;right:0;top:0}.mat-slider-horizontal .mat-slider-track-wrapper{height:2px;width:100%}.mat-slider-horizontal .mat-slider-track-fill{height:2px;width:100%;transform:scaleX(0)}.mat-slider-horizontal .mat-slider-track-background{height:2px;width:100%;transform:scaleX(1)}.mat-slider-horizontal .mat-slider-ticks-container{height:2px;width:100%}.mat-slider-horizontal .mat-slider-ticks{height:2px;width:100%}.mat-slider-horizontal .mat-slider-thumb-container{width:100%;height:0;top:50%}.mat-slider-horizontal .mat-slider-focus-ring{top:-15px;right:-15px}.mat-slider-horizontal .mat-slider-thumb-label{right:-14px;top:-40px;transform:translateY(26px) scale(.01) rotate(45deg)}.mat-slider-horizontal .mat-slider-thumb-label-text{transform:rotate(-45deg)}.mat-slider-horizontal.cdk-focused .mat-slider-thumb-label{transform:rotate(45deg)}.mat-slider-vertical{width:48px;min-height:128px}.mat-slider-vertical .mat-slider-wrapper{width:2px;top:8px;bottom:8px;left:23px}.mat-slider-vertical .mat-slider-wrapper::after{width:2px;border-top-width:2px;bottom:0;left:0}.mat-slider-vertical .mat-slider-track-wrapper{height:100%;width:2px}.mat-slider-vertical .mat-slider-track-fill{height:100%;width:2px;transform:scaleY(0)}.mat-slider-vertical .mat-slider-track-background{height:100%;width:2px;transform:scaleY(1)}.mat-slider-vertical .mat-slider-ticks-container{width:2px;height:100%}.mat-slider-vertical .mat-slider-focus-ring{bottom:-15px;left:-15px}.mat-slider-vertical .mat-slider-ticks{width:2px;height:100%}.mat-slider-vertical .mat-slider-thumb-container{height:100%;width:0;left:50%}.mat-slider-vertical .mat-slider-thumb-label{bottom:-14px;left:-40px;transform:translateX(26px) scale(.01) rotate(-45deg)}.mat-slider-vertical .mat-slider-thumb-label-text{transform:rotate(45deg)}.mat-slider-vertical.cdk-focused .mat-slider-thumb-label{transform:rotate(-45deg)}[dir=rtl] .mat-slider-wrapper::after{left:0;right:auto}[dir=rtl] .mat-slider-horizontal .mat-slider-track-fill{transform-origin:100% 100%}[dir=rtl] .mat-slider-horizontal .mat-slider-track-background{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:100% 100%}"],
                inputs: ['disabled'],
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdSlider.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
    { type: FocusOriginMonitor, },
    { type: _angular_core.ChangeDetectorRef, },
    { type: _angular_cdk.Directionality, decorators: [{ type: _angular_core.Optional },] },
]; };
MdSlider.propDecorators = {
    'invert': [{ type: _angular_core.Input },],
    'max': [{ type: _angular_core.Input },],
    'min': [{ type: _angular_core.Input },],
    'step': [{ type: _angular_core.Input },],
    'thumbLabel': [{ type: _angular_core.Input },],
    '_thumbLabelDeprecated': [{ type: _angular_core.Input, args: ['thumb-label',] },],
    'tickInterval': [{ type: _angular_core.Input },],
    '_tickIntervalDeprecated': [{ type: _angular_core.Input, args: ['tick-interval',] },],
    'value': [{ type: _angular_core.Input },],
    'vertical': [{ type: _angular_core.Input },],
    'color': [{ type: _angular_core.Input },],
    'change': [{ type: _angular_core.Output },],
    'input': [{ type: _angular_core.Output },],
};
/**
 * Renderer class in order to keep all dom manipulation in one place and outside of the main class.
 * \@docs-private
 */
var SliderRenderer = (function () {
    /**
     * @param {?} elementRef
     */
    function SliderRenderer(elementRef) {
        this._sliderElement = elementRef.nativeElement;
    }
    /**
     * Get the bounding client rect of the slider track element.
     * The track is used rather than the native element to ignore the extra space that the thumb can
     * take up.
     * @return {?}
     */
    SliderRenderer.prototype.getSliderDimensions = function () {
        var /** @type {?} */ wrapperElement = this._sliderElement.querySelector('.mat-slider-wrapper');
        return wrapperElement ? wrapperElement.getBoundingClientRect() : null;
    };
    /**
     * Focuses the native element.
     * Currently only used to allow a blur event to fire but will be used with keyboard input later.
     * @return {?}
     */
    SliderRenderer.prototype.addFocus = function () {
        this._sliderElement.focus();
    };
    return SliderRenderer;
}());
var MdSliderModule = (function () {
    function MdSliderModule() {
    }
    return MdSliderModule;
}());
MdSliderModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_common.CommonModule, MdCommonModule, StyleModule, _angular_cdk.BidiModule],
                exports: [MdSlider, MdCommonModule],
                declarations: [MdSlider],
                providers: [{ provide: _angular_platformBrowser.HAMMER_GESTURE_CONFIG, useClass: GestureConfig }]
            },] },
];
/**
 * @nocollapse
 */
MdSliderModule.ctorParameters = function () { return []; };
/**
 * Throws an exception when two MdSidenav are matching the same side.
 * @param {?} align
 * @return {?}
 */
function throwMdDuplicatedSidenavError(align) {
    throw Error("A sidenav was already declared for 'align=\"" + align + "\"'");
}
/**
 * Sidenav toggle promise result.
 */
var MdSidenavToggleResult = (function () {
    /**
     * @param {?} type
     * @param {?} animationFinished
     */
    function MdSidenavToggleResult(type, animationFinished) {
        this.type = type;
        this.animationFinished = animationFinished;
    }
    return MdSidenavToggleResult;
}());
/**
 * <md-sidenav> component.
 *
 * This component corresponds to the drawer of the sidenav.
 *
 * Please refer to README.md for examples on how to use it.
 */
var MdSidenav = (function () {
    /**
     * @param {?} _elementRef The DOM element reference. Used for transition and width calculation.
     *     If not available we do not hook on transitions.
     * @param {?} _focusTrapFactory
     * @param {?} _doc
     */
    function MdSidenav(_elementRef, _focusTrapFactory, _doc) {
        var _this = this;
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._doc = _doc;
        /**
         * Alignment of the sidenav (direction neutral); whether 'start' or 'end'.
         */
        this._align = 'start';
        /**
         * Mode of the sidenav; one of 'over', 'push' or 'side'.
         */
        this.mode = 'over';
        this._disableClose = false;
        /**
         * Whether the sidenav is opened.
         */
        this._opened = false;
        /**
         * Event emitted when the sidenav is being opened. Use this to synchronize animations.
         */
        this.onOpenStart = new _angular_core.EventEmitter();
        /**
         * Event emitted when the sidenav is fully opened.
         */
        this.onOpen = new _angular_core.EventEmitter();
        /**
         * Event emitted when the sidenav is being closed. Use this to synchronize animations.
         */
        this.onCloseStart = new _angular_core.EventEmitter();
        /**
         * Event emitted when the sidenav is fully closed.
         */
        this.onClose = new _angular_core.EventEmitter();
        /**
         * Event emitted when the sidenav alignment changes.
         */
        this.onAlignChanged = new _angular_core.EventEmitter();
        /**
         * The current toggle animation promise. `null` if no animation is in progress.
         */
        this._toggleAnimationPromise = null;
        /**
         * The current toggle animation promise resolution function.
         * `null` if no animation is in progress.
         */
        this._resolveToggleAnimationPromise = null;
        this._elementFocusedBeforeSidenavWasOpened = null;
        this.onOpen.subscribe(function () {
            if (_this._doc) {
                _this._elementFocusedBeforeSidenavWasOpened = _this._doc.activeElement;
            }
            if (_this.isFocusTrapEnabled && _this._focusTrap) {
                _this._focusTrap.focusInitialElementWhenReady();
            }
        });
        this.onClose.subscribe(function () { return _this._restoreFocus(); });
    }
    Object.defineProperty(MdSidenav.prototype, "align", {
        /**
         * Direction which the sidenav is aligned in.
         * @return {?}
         */
        get: function () { return this._align; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            // Make sure we have a valid value.
            value = (value == 'end') ? 'end' : 'start';
            if (value != this._align) {
                this._align = value;
                this.onAlignChanged.emit();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "disableClose", {
        /**
         * Whether the sidenav can be closed with the escape key or not.
         * @return {?}
         */
        get: function () { return this._disableClose; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disableClose = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "isFocusTrapEnabled", {
        /**
         * @return {?}
         */
        get: function () {
            // The focus trap is only enabled when the sidenav is open in any mode other than side.
            return this.opened && this.mode !== 'side';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * If focus is currently inside the sidenav, restores it to where it was before the sidenav
     * opened.
     * @return {?}
     */
    MdSidenav.prototype._restoreFocus = function () {
        var /** @type {?} */ activeEl = this._doc && this._doc.activeElement;
        if (activeEl && this._elementRef.nativeElement.contains(activeEl)) {
            if (this._elementFocusedBeforeSidenavWasOpened instanceof HTMLElement) {
                this._elementFocusedBeforeSidenavWasOpened.focus();
            }
            else {
                this._elementRef.nativeElement.blur();
            }
        }
        this._elementFocusedBeforeSidenavWasOpened = null;
    };
    /**
     * @return {?}
     */
    MdSidenav.prototype.ngAfterContentInit = function () {
        this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        this._focusTrap.enabled = this.isFocusTrapEnabled;
        // This can happen when the sidenav is set to opened in
        // the template and the transition hasn't ended.
        if (this._toggleAnimationPromise && this._resolveToggleAnimationPromise) {
            this._resolveToggleAnimationPromise(true);
            this._toggleAnimationPromise = this._resolveToggleAnimationPromise = null;
        }
    };
    /**
     * @return {?}
     */
    MdSidenav.prototype.ngOnDestroy = function () {
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    };
    Object.defineProperty(MdSidenav.prototype, "opened", {
        /**
         * Whether the sidenav is opened. We overload this because we trigger an event when it
         * starts or end.
         * @return {?}
         */
        get: function () { return this._opened; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this.toggle(_angular_cdk.coerceBooleanProperty(v));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Open this sidenav, and return a Promise that will resolve when it's fully opened (or get
     * rejected if it didn't).
     * @return {?}
     */
    MdSidenav.prototype.open = function () {
        return this.toggle(true);
    };
    /**
     * Close this sidenav, and return a Promise that will resolve when it's fully closed (or get
     * rejected if it didn't).
     * @return {?}
     */
    MdSidenav.prototype.close = function () {
        return this.toggle(false);
    };
    /**
     * Toggle this sidenav. This is equivalent to calling open() when it's already opened, or
     * close() when it's closed.
     * @param {?=} isOpen Whether the sidenav should be open.
     * @return {?} Resolves with the result of whether the sidenav was opened or closed.
     */
    MdSidenav.prototype.toggle = function (isOpen) {
        var _this = this;
        if (isOpen === void 0) { isOpen = !this.opened; }
        // Shortcut it if we're already opened.
        if (isOpen === this.opened) {
            return this._toggleAnimationPromise ||
                Promise.resolve(new MdSidenavToggleResult(isOpen ? 'open' : 'close', true));
        }
        this._opened = isOpen;
        if (this._focusTrap) {
            this._focusTrap.enabled = this.isFocusTrapEnabled;
        }
        if (isOpen) {
            this.onOpenStart.emit();
        }
        else {
            this.onCloseStart.emit();
        }
        if (this._toggleAnimationPromise && this._resolveToggleAnimationPromise) {
            this._resolveToggleAnimationPromise(false);
        }
        this._toggleAnimationPromise = new Promise(function (resolve) {
            _this._resolveToggleAnimationPromise = function (animationFinished) { return resolve(new MdSidenavToggleResult(isOpen ? 'open' : 'close', animationFinished)); };
        });
        return this._toggleAnimationPromise;
    };
    /**
     * Handles the keyboard events.
     * \@docs-private
     * @param {?} event
     * @return {?}
     */
    MdSidenav.prototype.handleKeydown = function (event) {
        if (event.keyCode === _angular_cdk.ESCAPE && !this.disableClose) {
            this.close();
            event.stopPropagation();
        }
    };
    /**
     * When transition has finished, set the internal state for classes and emit the proper event.
     * The event passed is actually of type TransitionEvent, but that type is not available in
     * Android so we use any.
     * @param {?} transitionEvent
     * @return {?}
     */
    MdSidenav.prototype._onTransitionEnd = function (transitionEvent) {
        if (transitionEvent.target == this._elementRef.nativeElement
            && transitionEvent.propertyName.endsWith('transform')) {
            if (this._opened) {
                this.onOpen.emit();
            }
            else {
                this.onClose.emit();
            }
            if (this._toggleAnimationPromise && this._resolveToggleAnimationPromise) {
                this._resolveToggleAnimationPromise(true);
                this._toggleAnimationPromise = this._resolveToggleAnimationPromise = null;
            }
        }
    };
    Object.defineProperty(MdSidenav.prototype, "_isClosing", {
        /**
         * @return {?}
         */
        get: function () {
            return !this._opened && !!this._toggleAnimationPromise;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_isOpening", {
        /**
         * @return {?}
         */
        get: function () {
            return this._opened && !!this._toggleAnimationPromise;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_isClosed", {
        /**
         * @return {?}
         */
        get: function () {
            return !this._opened && !this._toggleAnimationPromise;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_isOpened", {
        /**
         * @return {?}
         */
        get: function () {
            return this._opened && !this._toggleAnimationPromise;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_isEnd", {
        /**
         * @return {?}
         */
        get: function () {
            return this.align == 'end';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_modeSide", {
        /**
         * @return {?}
         */
        get: function () {
            return this.mode == 'side';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_modeOver", {
        /**
         * @return {?}
         */
        get: function () {
            return this.mode == 'over';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_modePush", {
        /**
         * @return {?}
         */
        get: function () {
            return this.mode == 'push';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_width", {
        /**
         * @return {?}
         */
        get: function () {
            if (this._elementRef.nativeElement) {
                return this._elementRef.nativeElement.offsetWidth;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    return MdSidenav;
}());
MdSidenav.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-sidenav, mat-sidenav',
                // TODO(mmalerba): move template to separate file.
                template: "<ng-content></ng-content>",
                host: {
                    'class': 'mat-sidenav',
                    '(transitionend)': '_onTransitionEnd($event)',
                    '(keydown)': 'handleKeydown($event)',
                    // must prevent the browser from aligning text based on value
                    '[attr.align]': 'null',
                    '[class.mat-sidenav-closed]': '_isClosed',
                    '[class.mat-sidenav-closing]': '_isClosing',
                    '[class.mat-sidenav-end]': '_isEnd',
                    '[class.mat-sidenav-opened]': '_isOpened',
                    '[class.mat-sidenav-opening]': '_isOpening',
                    '[class.mat-sidenav-over]': '_modeOver',
                    '[class.mat-sidenav-push]': '_modePush',
                    '[class.mat-sidenav-side]': '_modeSide',
                    'tabIndex': '-1'
                },
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                encapsulation: _angular_core.ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdSidenav.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_cdk.FocusTrapFactory, },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_platformBrowser.DOCUMENT,] },] },
]; };
MdSidenav.propDecorators = {
    'align': [{ type: _angular_core.Input },],
    'mode': [{ type: _angular_core.Input },],
    'disableClose': [{ type: _angular_core.Input },],
    'onOpenStart': [{ type: _angular_core.Output, args: ['open-start',] },],
    'onOpen': [{ type: _angular_core.Output, args: ['open',] },],
    'onCloseStart': [{ type: _angular_core.Output, args: ['close-start',] },],
    'onClose': [{ type: _angular_core.Output, args: ['close',] },],
    'onAlignChanged': [{ type: _angular_core.Output, args: ['align-changed',] },],
    'opened': [{ type: _angular_core.Input },],
};
/**
 * <md-sidenav-container> component.
 *
 * This is the parent component to one or two <md-sidenav>s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
var MdSidenavContainer = (function () {
    /**
     * @param {?} _dir
     * @param {?} _element
     * @param {?} _renderer
     * @param {?} _ngZone
     */
    function MdSidenavContainer(_dir, _element, _renderer, _ngZone) {
        var _this = this;
        this._dir = _dir;
        this._element = _element;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        /**
         * Event emitted when the sidenav backdrop is clicked.
         */
        this.backdropClick = new _angular_core.EventEmitter();
        /**
         * Whether to enable open/close trantions.
         */
        this._enableTransitions = false;
        // If a `Dir` directive exists up the tree, listen direction changes and update the left/right
        // properties to point to the proper start/end.
        if (_dir != null) {
            _dir.change.subscribe(function () { return _this._validateDrawers(); });
        }
    }
    Object.defineProperty(MdSidenavContainer.prototype, "start", {
        /**
         * The sidenav child with the `start` alignment.
         * @return {?}
         */
        get: function () { return this._start; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenavContainer.prototype, "end", {
        /**
         * The sidenav child with the `end` alignment.
         * @return {?}
         */
        get: function () { return this._end; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdSidenavContainer.prototype.ngAfterContentInit = function () {
        var _this = this;
        // On changes, assert on consistency.
        this._sidenavs.changes.subscribe(function () { return _this._validateDrawers(); });
        this._sidenavs.forEach(function (sidenav) {
            _this._watchSidenavToggle(sidenav);
            _this._watchSidenavAlign(sidenav);
        });
        this._validateDrawers();
        // Give the view a chance to render the initial state, then enable transitions.
        _angular_cdk.first.call(this._ngZone.onMicrotaskEmpty).subscribe(function () { return _this._enableTransitions = true; });
    };
    /**
     * Calls `open` of both start and end sidenavs
     * @return {?}
     */
    MdSidenavContainer.prototype.open = function () {
        return Promise.all([this._start, this._end]
            .filter(function (sidenav) { return sidenav; })
            .map(function (sidenav) { return ((sidenav)).open(); }));
    };
    /**
     * Calls `close` of both start and end sidenavs
     * @return {?}
     */
    MdSidenavContainer.prototype.close = function () {
        return Promise.all([this._start, this._end]
            .filter(function (sidenav) { return sidenav; })
            .map(function (sidenav) { return ((sidenav)).close(); }));
    };
    /**
     * Subscribes to sidenav events in order to set a class on the main container element when the
     * sidenav is open and the backdrop is visible. This ensures any overflow on the container element
     * is properly hidden.
     * @param {?} sidenav
     * @return {?}
     */
    MdSidenavContainer.prototype._watchSidenavToggle = function (sidenav) {
        var _this = this;
        if (!sidenav || sidenav.mode === 'side') {
            return;
        }
        sidenav.onOpen.subscribe(function () { return _this._setContainerClass(true); });
        sidenav.onClose.subscribe(function () { return _this._setContainerClass(false); });
    };
    /**
     * Subscribes to sidenav onAlignChanged event in order to re-validate drawers when the align
     * changes.
     * @param {?} sidenav
     * @return {?}
     */
    MdSidenavContainer.prototype._watchSidenavAlign = function (sidenav) {
        var _this = this;
        if (!sidenav) {
            return;
        }
        // NOTE: We need to wait for the microtask queue to be empty before validating,
        // since both drawers may be swapping sides at the same time.
        sidenav.onAlignChanged.subscribe(function () { return _angular_cdk.first.call(_this._ngZone.onMicrotaskEmpty).subscribe(function () { return _this._validateDrawers(); }); });
    };
    /**
     * Toggles the 'mat-sidenav-opened' class on the main 'md-sidenav-container' element.
     * @param {?} isAdd
     * @return {?}
     */
    MdSidenavContainer.prototype._setContainerClass = function (isAdd) {
        if (isAdd) {
            this._renderer.addClass(this._element.nativeElement, 'mat-sidenav-opened');
        }
        else {
            this._renderer.removeClass(this._element.nativeElement, 'mat-sidenav-opened');
        }
    };
    /**
     * Validate the state of the sidenav children components.
     * @return {?}
     */
    MdSidenavContainer.prototype._validateDrawers = function () {
        this._start = this._end = null;
        // Ensure that we have at most one start and one end sidenav.
        // NOTE: We must call toArray on _sidenavs even though it's iterable
        // (see https://github.com/Microsoft/TypeScript/issues/3164).
        for (var _i = 0, _a = this._sidenavs.toArray(); _i < _a.length; _i++) {
            var sidenav = _a[_i];
            if (sidenav.align == 'end') {
                if (this._end != null) {
                    throwMdDuplicatedSidenavError('end');
                }
                this._end = sidenav;
            }
            else {
                if (this._start != null) {
                    throwMdDuplicatedSidenavError('start');
                }
                this._start = sidenav;
            }
        }
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
    MdSidenavContainer.prototype._onBackdropClicked = function () {
        this.backdropClick.emit();
        this._closeModalSidenav();
    };
    /**
     * @return {?}
     */
    MdSidenavContainer.prototype._closeModalSidenav = function () {
        // Close all open sidenav's where closing is not disabled and the mode is not `side`.
        [this._start, this._end]
            .filter(function (sidenav) { return sidenav && !sidenav.disableClose && sidenav.mode !== 'side'; })
            .forEach(function (sidenav) { return ((sidenav)).close(); });
    };
    /**
     * @return {?}
     */
    MdSidenavContainer.prototype._isShowingBackdrop = function () {
        return (this._isSidenavOpen(this._start) && ((this._start)).mode != 'side')
            || (this._isSidenavOpen(this._end) && ((this._end)).mode != 'side');
    };
    /**
     * @param {?} side
     * @return {?}
     */
    MdSidenavContainer.prototype._isSidenavOpen = function (side) {
        return side != null && side.opened;
    };
    /**
     * Return the width of the sidenav, if it's in the proper mode and opened.
     * This may relayout the view, so do not call this often.
     * @param {?} sidenav
     * @param {?} mode
     * @return {?}
     */
    MdSidenavContainer.prototype._getSidenavEffectiveWidth = function (sidenav, mode) {
        return (this._isSidenavOpen(sidenav) && sidenav.mode == mode) ? sidenav._width : 0;
    };
    /**
     * @return {?}
     */
    MdSidenavContainer.prototype._getMarginLeft = function () {
        return this._left ? this._getSidenavEffectiveWidth(this._left, 'side') : 0;
    };
    /**
     * @return {?}
     */
    MdSidenavContainer.prototype._getMarginRight = function () {
        return this._right ? this._getSidenavEffectiveWidth(this._right, 'side') : 0;
    };
    /**
     * @return {?}
     */
    MdSidenavContainer.prototype._getPositionLeft = function () {
        return this._left ? this._getSidenavEffectiveWidth(this._left, 'push') : 0;
    };
    /**
     * @return {?}
     */
    MdSidenavContainer.prototype._getPositionRight = function () {
        return this._right ? this._getSidenavEffectiveWidth(this._right, 'push') : 0;
    };
    /**
     * Returns the horizontal offset for the content area.  There should never be a value for both
     * left and right, so by subtracting the right value from the left value, we should always get
     * the appropriate offset.
     * @return {?}
     */
    MdSidenavContainer.prototype._getPositionOffset = function () {
        return this._getPositionLeft() - this._getPositionRight();
    };
    /**
     * This is using [ngStyle] rather than separate [style...] properties because [style.transform]
     * doesn't seem to work right now.
     * @return {?}
     */
    MdSidenavContainer.prototype._getStyles = function () {
        return {
            marginLeft: this._getMarginLeft() + "px",
            marginRight: this._getMarginRight() + "px",
            transform: "translate3d(" + this._getPositionOffset() + "px, 0, 0)"
        };
    };
    return MdSidenavContainer;
}());
MdSidenavContainer.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-sidenav-container, mat-sidenav-container',
                // Do not use ChangeDetectionStrategy.OnPush. It does not work for this component because
                // technically it is a sibling of MdSidenav (on the content tree) and isn't updated when MdSidenav
                // changes its state.
                template: "<div class=\"mat-sidenav-backdrop\" (click)=\"_onBackdropClicked()\" [class.mat-sidenav-shown]=\"_isShowingBackdrop()\"></div><ng-content select=\"md-sidenav, mat-sidenav\"></ng-content><div class=\"mat-sidenav-content\" [ngStyle]=\"_getStyles()\" cdk-scrollable><ng-content></ng-content></div>",
                styles: [".mat-sidenav-container{position:relative;transform:translate3d(0,0,0);box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-sidenav-container[fullscreen]{position:absolute;top:0;left:0;right:0;bottom:0}.mat-sidenav-container[fullscreen].mat-sidenav-opened{overflow:hidden}.mat-sidenav-backdrop{position:absolute;top:0;left:0;right:0;bottom:0;display:block;z-index:2;visibility:hidden}.mat-sidenav-backdrop.mat-sidenav-shown{visibility:visible}@media screen and (-ms-high-contrast:active){.mat-sidenav-backdrop{opacity:.5}}.mat-sidenav-content{position:relative;transform:translate3d(0,0,0);display:block;height:100%;overflow:auto}.mat-sidenav{position:relative;transform:translate3d(0,0,0);display:block;position:absolute;top:0;bottom:0;z-index:3;min-width:5vw;outline:0;box-sizing:border-box;height:100%;overflow-y:auto;transform:translate3d(-100%,0,0)}.mat-sidenav.mat-sidenav-closed{visibility:hidden}.mat-sidenav.mat-sidenav-opened,.mat-sidenav.mat-sidenav-opening{transform:translate3d(0,0,0)}.mat-sidenav.mat-sidenav-side{z-index:1}.mat-sidenav.mat-sidenav-end{right:0;transform:translate3d(100%,0,0)}.mat-sidenav.mat-sidenav-end.mat-sidenav-closed{visibility:hidden}.mat-sidenav.mat-sidenav-end.mat-sidenav-opened,.mat-sidenav.mat-sidenav-end.mat-sidenav-opening{transform:translate3d(0,0,0)}[dir=rtl] .mat-sidenav{transform:translate3d(100%,0,0)}[dir=rtl] .mat-sidenav.mat-sidenav-closed{visibility:hidden}[dir=rtl] .mat-sidenav.mat-sidenav-opened,[dir=rtl] .mat-sidenav.mat-sidenav-opening{transform:translate3d(0,0,0)}[dir=rtl] .mat-sidenav.mat-sidenav-end{left:0;right:auto;transform:translate3d(-100%,0,0)}[dir=rtl] .mat-sidenav.mat-sidenav-end.mat-sidenav-closed{visibility:hidden}[dir=rtl] .mat-sidenav.mat-sidenav-end.mat-sidenav-opened,[dir=rtl] .mat-sidenav.mat-sidenav-end.mat-sidenav-opening{transform:translate3d(0,0,0)}.mat-sidenav.mat-sidenav-opened:not(.mat-sidenav-side),.mat-sidenav.mat-sidenav-opening:not(.mat-sidenav-side){box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12)} .mat-sidenav-transition .mat-sidenav{transition:transform .4s cubic-bezier(.25,.8,.25,1)}.mat-sidenav-transition .mat-sidenav-content{transition-duration:.4s;transition-timing-function:cubic-bezier(.25,.8,.25,1);transition-property:transform,margin-left,margin-right}.mat-sidenav-transition .mat-sidenav-backdrop.mat-sidenav-shown{transition:background-color .4s cubic-bezier(.25,.8,.25,1)}"],
                host: {
                    'class': 'mat-sidenav-container',
                    '[class.mat-sidenav-transition]': '_enableTransitions',
                },
                encapsulation: _angular_core.ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdSidenavContainer.ctorParameters = function () { return [
    { type: _angular_cdk.Directionality, decorators: [{ type: _angular_core.Optional },] },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: _angular_core.NgZone, },
]; };
MdSidenavContainer.propDecorators = {
    '_sidenavs': [{ type: _angular_core.ContentChildren, args: [MdSidenav,] },],
    'backdropClick': [{ type: _angular_core.Output },],
};
var MdSidenavModule = (function () {
    function MdSidenavModule() {
    }
    return MdSidenavModule;
}());
MdSidenavModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_common.CommonModule, MdCommonModule, _angular_cdk.A11yModule, OverlayModule],
                exports: [MdSidenavContainer, MdSidenav, MdCommonModule],
                declarations: [MdSidenavContainer, MdSidenav],
            },] },
];
/**
 * @nocollapse
 */
MdSidenavModule.ctorParameters = function () { return []; };
var MdListDivider = (function () {
    function MdListDivider() {
    }
    return MdListDivider;
}());
MdListDivider.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-divider, mat-divider',
                host: {
                    'role': 'separator',
                    'aria-orientation': 'horizontal'
                }
            },] },
];
/**
 * @nocollapse
 */
MdListDivider.ctorParameters = function () { return []; };
var MdList = (function () {
    function MdList() {
        this._disableRipple = false;
    }
    Object.defineProperty(MdList.prototype, "disableRipple", {
        /**
         * Whether the ripple effect should be disabled on the list-items or not.
         * This flag only has an effect for `md-nav-list` components.
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disableRipple = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    return MdList;
}());
MdList.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-list, mat-list, md-nav-list, mat-nav-list',
                host: { 'role': 'list' },
                template: '<ng-content></ng-content>',
                styles: [".mat-subheader{display:block;box-sizing:border-box;padding:16px;margin:0}.mat-list,.mat-nav-list{padding-top:8px;display:block}.mat-list .mat-subheader,.mat-nav-list .mat-subheader{height:48px}.mat-list .mat-subheader:first-child,.mat-nav-list .mat-subheader:first-child{margin-top:-8px}.mat-list .mat-list-item,.mat-nav-list .mat-list-item{display:block}.mat-list .mat-list-item .mat-list-item-content,.mat-nav-list .mat-list-item .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:48px;padding:0 16px;position:relative}.mat-list .mat-list-item .mat-list-item-ripple,.mat-nav-list .mat-list-item .mat-list-item-ripple{position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none}.mat-list .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-nav-list .mat-list-item.mat-list-item-avatar .mat-list-item-content{height:56px}.mat-list .mat-list-item.mat-2-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-2-line .mat-list-item-content{height:72px}.mat-list .mat-list-item.mat-3-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-3-line .mat-list-item-content{height:88px}.mat-list .mat-list-item.mat-multi-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list .mat-list-item .mat-list-text,.mat-nav-list .mat-list-item .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list .mat-list-item .mat-list-text>*,.mat-nav-list .mat-list-item .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list .mat-list-item .mat-list-text:empty,.mat-nav-list .mat-list-item .mat-list-text:empty{display:none}.mat-list .mat-list-item .mat-list-text:nth-child(2),.mat-nav-list .mat-list-item .mat-list-text:nth-child(2){padding:0}.mat-list .mat-list-item .mat-list-avatar,.mat-nav-list .mat-list-item .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list .mat-list-item .mat-list-icon,.mat-nav-list .mat-list-item .mat-list-icon{width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list[dense],.mat-nav-list[dense]{padding-top:4px;display:block}.mat-list[dense] .mat-subheader,.mat-nav-list[dense] .mat-subheader{height:40px}.mat-list[dense] .mat-subheader:first-child,.mat-nav-list[dense] .mat-subheader:first-child{margin-top:-4px}.mat-list[dense] .mat-list-item,.mat-nav-list[dense] .mat-list-item{display:block}.mat-list[dense] .mat-list-item .mat-list-item-content,.mat-nav-list[dense] .mat-list-item .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:40px;padding:0 16px;position:relative}.mat-list[dense] .mat-list-item .mat-list-item-ripple,.mat-nav-list[dense] .mat-list-item .mat-list-item-ripple{position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none}.mat-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content{height:48px}.mat-list[dense] .mat-list-item.mat-2-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-2-line .mat-list-item-content{height:60px}.mat-list[dense] .mat-list-item.mat-3-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-3-line .mat-list-item-content{height:76px}.mat-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list[dense] .mat-list-item .mat-list-text,.mat-nav-list[dense] .mat-list-item .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list[dense] .mat-list-item .mat-list-text>*,.mat-nav-list[dense] .mat-list-item .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list[dense] .mat-list-item .mat-list-text:empty,.mat-nav-list[dense] .mat-list-item .mat-list-text:empty{display:none}.mat-list[dense] .mat-list-item .mat-list-text:nth-child(2),.mat-nav-list[dense] .mat-list-item .mat-list-text:nth-child(2){padding:0}.mat-list[dense] .mat-list-item .mat-list-avatar,.mat-nav-list[dense] .mat-list-item .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list[dense] .mat-list-item .mat-list-icon,.mat-nav-list[dense] .mat-list-item .mat-list-icon{width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-divider{display:block;border-top-style:solid;border-top-width:1px;margin:0}.mat-nav-list a{text-decoration:none;color:inherit}.mat-nav-list .mat-list-item-content{cursor:pointer}.mat-nav-list .mat-list-item-content.mat-list-item-focus,.mat-nav-list .mat-list-item-content:hover{outline:0}"],
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdList.ctorParameters = function () { return []; };
MdList.propDecorators = {
    'disableRipple': [{ type: _angular_core.Input },],
};
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdListCssMatStyler = (function () {
    function MdListCssMatStyler() {
    }
    return MdListCssMatStyler;
}());
MdListCssMatStyler.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-list, mat-list',
                host: { 'class': 'mat-list' }
            },] },
];
/**
 * @nocollapse
 */
MdListCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdNavListCssMatStyler = (function () {
    function MdNavListCssMatStyler() {
    }
    return MdNavListCssMatStyler;
}());
MdNavListCssMatStyler.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-nav-list, mat-nav-list',
                host: { 'class': 'mat-nav-list' }
            },] },
];
/**
 * @nocollapse
 */
MdNavListCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdDividerCssMatStyler = (function () {
    function MdDividerCssMatStyler() {
    }
    return MdDividerCssMatStyler;
}());
MdDividerCssMatStyler.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-divider, mat-divider',
                host: { 'class': 'mat-divider' }
            },] },
];
/**
 * @nocollapse
 */
MdDividerCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdListAvatarCssMatStyler = (function () {
    function MdListAvatarCssMatStyler() {
    }
    return MdListAvatarCssMatStyler;
}());
MdListAvatarCssMatStyler.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-list-avatar], [mat-list-avatar], [mdListAvatar], [matListAvatar]',
                host: { 'class': 'mat-list-avatar' }
            },] },
];
/**
 * @nocollapse
 */
MdListAvatarCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdListIconCssMatStyler = (function () {
    function MdListIconCssMatStyler() {
    }
    return MdListIconCssMatStyler;
}());
MdListIconCssMatStyler.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-list-icon], [mat-list-icon], [mdListIcon], [matListIcon]',
                host: { 'class': 'mat-list-icon' }
            },] },
];
/**
 * @nocollapse
 */
MdListIconCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdListSubheaderCssMatStyler = (function () {
    function MdListSubheaderCssMatStyler() {
    }
    return MdListSubheaderCssMatStyler;
}());
MdListSubheaderCssMatStyler.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-subheader], [mat-subheader]',
                host: { 'class': 'mat-subheader' }
            },] },
];
/**
 * @nocollapse
 */
MdListSubheaderCssMatStyler.ctorParameters = function () { return []; };
var MdListItem = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _element
     * @param {?} _list
     * @param {?} navList
     */
    function MdListItem(_renderer, _element, _list, navList) {
        this._renderer = _renderer;
        this._element = _element;
        this._list = _list;
        this._disableRipple = false;
        this._isNavList = false;
        this._isNavList = !!navList;
    }
    Object.defineProperty(MdListItem.prototype, "disableRipple", {
        /**
         * Whether the ripple effect on click should be disabled. This applies only to list items that are
         * part of a nav list. The value of `disableRipple` on the `md-nav-list` overrides this flag.
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disableRipple = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdListItem.prototype, "_hasAvatar", {
        /**
         * @param {?} avatar
         * @return {?}
         */
        set: function (avatar) {
            if (avatar != null) {
                this._renderer.addClass(this._element.nativeElement, 'mat-list-item-avatar');
            }
            else {
                this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-avatar');
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdListItem.prototype.ngAfterContentInit = function () {
        this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
    };
    /**
     * Whether this list item should show a ripple effect when clicked.
     * @return {?}
     */
    MdListItem.prototype.isRippleEnabled = function () {
        return !this.disableRipple && this._isNavList && !this._list.disableRipple;
    };
    /**
     * @return {?}
     */
    MdListItem.prototype._handleFocus = function () {
        this._renderer.addClass(this._element.nativeElement, 'mat-list-item-focus');
    };
    /**
     * @return {?}
     */
    MdListItem.prototype._handleBlur = function () {
        this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-focus');
    };
    /**
     * Retrieves the DOM element of the component host.
     * @return {?}
     */
    MdListItem.prototype._getHostElement = function () {
        return this._element.nativeElement;
    };
    return MdListItem;
}());
MdListItem.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-list-item, mat-list-item, a[md-list-item], a[mat-list-item]',
                host: {
                    'role': 'listitem',
                    'class': 'mat-list-item',
                    '(focus)': '_handleFocus()',
                    '(blur)': '_handleBlur()',
                },
                template: "<div class=\"mat-list-item-content\"><div class=\"mat-list-item-ripple\" md-ripple [mdRippleTrigger]=\"_getHostElement()\" [mdRippleDisabled]=\"!isRippleEnabled()\"></div><ng-content select=\"[md-list-avatar],[md-list-icon], [mat-list-avatar], [mat-list-icon]\"></ng-content><div class=\"mat-list-text\"><ng-content select=\"[md-line], [mat-line]\"></ng-content></div><ng-content></ng-content></div>",
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdListItem.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
    { type: MdList, decorators: [{ type: _angular_core.Optional },] },
    { type: MdNavListCssMatStyler, decorators: [{ type: _angular_core.Optional },] },
]; };
MdListItem.propDecorators = {
    'disableRipple': [{ type: _angular_core.Input },],
    '_lines': [{ type: _angular_core.ContentChildren, args: [MdLine,] },],
    '_hasAvatar': [{ type: _angular_core.ContentChild, args: [MdListAvatarCssMatStyler,] },],
};
var MdListModule = (function () {
    function MdListModule() {
    }
    return MdListModule;
}());
MdListModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [MdLineModule, MdRippleModule, MdCommonModule],
                exports: [
                    MdList,
                    MdListItem,
                    MdListDivider,
                    MdListAvatarCssMatStyler,
                    MdLineModule,
                    MdCommonModule,
                    MdListIconCssMatStyler,
                    MdListCssMatStyler,
                    MdNavListCssMatStyler,
                    MdDividerCssMatStyler,
                    MdListSubheaderCssMatStyler,
                ],
                declarations: [
                    MdList,
                    MdListItem,
                    MdListDivider,
                    MdListAvatarCssMatStyler,
                    MdListIconCssMatStyler,
                    MdListCssMatStyler,
                    MdNavListCssMatStyler,
                    MdDividerCssMatStyler,
                    MdListSubheaderCssMatStyler,
                ],
            },] },
];
/**
 * @nocollapse
 */
MdListModule.ctorParameters = function () { return []; };
/**
 * Converts values into strings. Falsy values become empty strings.
 * \@docs-private
 * @param {?} value
 * @return {?}
 */
function coerceToString(value) {
    return "" + (value || '');
}
/**
 * Converts a value that might be a string into a number.
 * \@docs-private
 * @param {?} value
 * @return {?}
 */
function coerceToNumber(value) {
    return typeof value === 'string' ? parseInt(value, 10) : value;
}
var MdGridTile = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _element
     */
    function MdGridTile(_renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
        this._rowspan = 1;
        this._colspan = 1;
    }
    Object.defineProperty(MdGridTile.prototype, "rowspan", {
        /**
         * Amount of rows that the grid tile takes up.
         * @return {?}
         */
        get: function () { return this._rowspan; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._rowspan = coerceToNumber(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridTile.prototype, "colspan", {
        /**
         * Amount of columns that the grid tile takes up.
         * @return {?}
         */
        get: function () { return this._colspan; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._colspan = coerceToNumber(value); },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the style of the grid-tile element.  Needs to be set manually to avoid
     * "Changed after checked" errors that would occur with HostBinding.
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    MdGridTile.prototype._setStyle = function (property, value) {
        this._renderer.setStyle(this._element.nativeElement, property, value);
    };
    return MdGridTile;
}());
MdGridTile.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-grid-tile, mat-grid-tile',
                host: {
                    'role': 'listitem',
                    'class': 'mat-grid-tile',
                },
                template: "<figure class=\"mat-figure\"><ng-content></ng-content></figure>",
                styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-figure{display:flex;position:absolute;align-items:center;justify-content:center;height:100%;top:0;right:0;bottom:0;left:0;padding:0;margin:0}.mat-grid-tile .mat-grid-tile-footer,.mat-grid-tile .mat-grid-tile-header{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-footer>*,.mat-grid-tile .mat-grid-tile-header>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-grid-tile .mat-grid-tile-footer.mat-2-line,.mat-grid-tile .mat-grid-tile-header.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}"],
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdGridTile.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
]; };
MdGridTile.propDecorators = {
    'rowspan': [{ type: _angular_core.Input },],
    'colspan': [{ type: _angular_core.Input },],
};
var MdGridTileText = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _element
     */
    function MdGridTileText(_renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
    }
    /**
     * @return {?}
     */
    MdGridTileText.prototype.ngAfterContentInit = function () {
        this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
    };
    return MdGridTileText;
}());
MdGridTileText.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-grid-tile-header, mat-grid-tile-header, md-grid-tile-footer, mat-grid-tile-footer',
                template: "<ng-content select=\"[md-grid-avatar], [mat-grid-avatar]\"></ng-content><div class=\"mat-grid-list-text\"><ng-content select=\"[md-line], [mat-line]\"></ng-content></div><ng-content></ng-content>",
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdGridTileText.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
]; };
MdGridTileText.propDecorators = {
    '_lines': [{ type: _angular_core.ContentChildren, args: [MdLine,] },],
};
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdGridAvatarCssMatStyler = (function () {
    function MdGridAvatarCssMatStyler() {
    }
    return MdGridAvatarCssMatStyler;
}());
MdGridAvatarCssMatStyler.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-grid-avatar], [mat-grid-avatar], [mdGridAvatar], [matGridAvatar]',
                host: { 'class': 'mat-grid-avatar' }
            },] },
];
/**
 * @nocollapse
 */
MdGridAvatarCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdGridTileHeaderCssMatStyler = (function () {
    function MdGridTileHeaderCssMatStyler() {
    }
    return MdGridTileHeaderCssMatStyler;
}());
MdGridTileHeaderCssMatStyler.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-grid-tile-header, mat-grid-tile-header',
                host: { 'class': 'mat-grid-tile-header' }
            },] },
];
/**
 * @nocollapse
 */
MdGridTileHeaderCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdGridTileFooterCssMatStyler = (function () {
    function MdGridTileFooterCssMatStyler() {
    }
    return MdGridTileFooterCssMatStyler;
}());
MdGridTileFooterCssMatStyler.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-grid-tile-footer, mat-grid-tile-footer',
                host: { 'class': 'mat-grid-tile-footer' }
            },] },
];
/**
 * @nocollapse
 */
MdGridTileFooterCssMatStyler.ctorParameters = function () { return []; };
/**
 * Class for determining, from a list of tiles, the (row, col) position of each of those tiles
 * in the grid. This is necessary (rather than just rendering the tiles in normal document flow)
 * because the tiles can have a rowspan.
 *
 * The positioning algorithm greedily places each tile as soon as it encounters a gap in the grid
 * large enough to accommodate it so that the tiles still render in the same order in which they
 * are given.
 *
 * The basis of the algorithm is the use of an array to track the already placed tiles. Each
 * element of the array corresponds to a column, and the value indicates how many cells in that
 * column are already occupied; zero indicates an empty cell. Moving "down" to the next row
 * decrements each value in the tracking array (indicating that the column is one cell closer to
 * being free).
 *
 * \@docs-private
 */
var TileCoordinator = (function () {
    /**
     * @param {?} numColumns
     * @param {?} tiles
     */
    function TileCoordinator(numColumns, tiles) {
        var _this = this;
        /**
         * Index at which the search for the next gap will start.
         */
        this.columnIndex = 0;
        /**
         * The current row index.
         */
        this.rowIndex = 0;
        this.tracker = new Array(numColumns);
        this.tracker.fill(0, 0, this.tracker.length);
        this.positions = tiles.map(function (tile) { return _this._trackTile(tile); });
    }
    Object.defineProperty(TileCoordinator.prototype, "rowCount", {
        /**
         * Gets the total number of rows occupied by tiles
         * @return {?}
         */
        get: function () { return this.rowIndex + 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TileCoordinator.prototype, "rowspan", {
        /**
         * Gets the total span of rows occupied by tiles.
         * Ex: A list with 1 row that contains a tile with rowspan 2 will have a total rowspan of 2.
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ lastRowMax = Math.max.apply(Math, this.tracker);
            // if any of the tiles has a rowspan that pushes it beyond the total row count,
            // add the difference to the rowcount
            return lastRowMax > 1 ? this.rowCount + lastRowMax - 1 : this.rowCount;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Calculates the row and col position of a tile.
     * @param {?} tile
     * @return {?}
     */
    TileCoordinator.prototype._trackTile = function (tile) {
        // Find a gap large enough for this tile.
        var /** @type {?} */ gapStartIndex = this._findMatchingGap(tile.colspan);
        // Place tile in the resulting gap.
        this._markTilePosition(gapStartIndex, tile);
        // The next time we look for a gap, the search will start at columnIndex, which should be
        // immediately after the tile that has just been placed.
        this.columnIndex = gapStartIndex + tile.colspan;
        return new TilePosition(this.rowIndex, gapStartIndex);
    };
    /**
     * Finds the next available space large enough to fit the tile.
     * @param {?} tileCols
     * @return {?}
     */
    TileCoordinator.prototype._findMatchingGap = function (tileCols) {
        if (tileCols > this.tracker.length) {
            throw Error("md-grid-list: tile with colspan " + tileCols + " is wider than " +
                ("grid with cols=\"" + this.tracker.length + "\"."));
        }
        // Start index is inclusive, end index is exclusive.
        var /** @type {?} */ gapStartIndex = -1;
        var /** @type {?} */ gapEndIndex = -1;
        // Look for a gap large enough to fit the given tile. Empty spaces are marked with a zero.
        do {
            // If we've reached the end of the row, go to the next row.
            if (this.columnIndex + tileCols > this.tracker.length) {
                this._nextRow();
                continue;
            }
            gapStartIndex = this.tracker.indexOf(0, this.columnIndex);
            // If there are no more empty spaces in this row at all, move on to the next row.
            if (gapStartIndex == -1) {
                this._nextRow();
                continue;
            }
            gapEndIndex = this._findGapEndIndex(gapStartIndex);
            // If a gap large enough isn't found, we want to start looking immediately after the current
            // gap on the next iteration.
            this.columnIndex = gapStartIndex + 1;
            // Continue iterating until we find a gap wide enough for this tile.
        } while (gapEndIndex - gapStartIndex < tileCols);
        return gapStartIndex;
    };
    /**
     * Move "down" to the next row.
     * @return {?}
     */
    TileCoordinator.prototype._nextRow = function () {
        this.columnIndex = 0;
        this.rowIndex++;
        // Decrement all spaces by one to reflect moving down one row.
        for (var /** @type {?} */ i = 0; i < this.tracker.length; i++) {
            this.tracker[i] = Math.max(0, this.tracker[i] - 1);
        }
    };
    /**
     * Finds the end index (exclusive) of a gap given the index from which to start looking.
     * The gap ends when a non-zero value is found.
     * @param {?} gapStartIndex
     * @return {?}
     */
    TileCoordinator.prototype._findGapEndIndex = function (gapStartIndex) {
        for (var /** @type {?} */ i = gapStartIndex + 1; i < this.tracker.length; i++) {
            if (this.tracker[i] != 0) {
                return i;
            }
        }
        // The gap ends with the end of the row.
        return this.tracker.length;
    };
    /**
     * Update the tile tracker to account for the given tile in the given space.
     * @param {?} start
     * @param {?} tile
     * @return {?}
     */
    TileCoordinator.prototype._markTilePosition = function (start, tile) {
        for (var /** @type {?} */ i = 0; i < tile.colspan; i++) {
            this.tracker[start + i] = tile.rowspan;
        }
    };
    return TileCoordinator;
}());
/**
 * Simple data structure for tile position (row, col).
 * \@docs-private
 */
var TilePosition = (function () {
    /**
     * @param {?} row
     * @param {?} col
     */
    function TilePosition(row, col) {
        this.row = row;
        this.col = col;
    }
    return TilePosition;
}());
/**
 * Sets the style properties for an individual tile, given the position calculated by the
 * Tile Coordinator.
 * \@docs-private
 * @abstract
 */
var TileStyler = (function () {
    function TileStyler() {
        this._rows = 0;
        this._rowspan = 0;
    }
    /**
     * Adds grid-list layout info once it is available. Cannot be processed in the constructor
     * because these properties haven't been calculated by that point.
     *
     * @param {?} gutterSize Size of the grid's gutter.
     * @param {?} tracker Instance of the TileCoordinator.
     * @param {?} cols Amount of columns in the grid.
     * @param {?} direction Layout direction of the grid.
     * @return {?}
     */
    TileStyler.prototype.init = function (gutterSize, tracker, cols, direction) {
        this._gutterSize = normalizeUnits(gutterSize);
        this._rows = tracker.rowCount;
        this._rowspan = tracker.rowspan;
        this._cols = cols;
        this._direction = direction;
    };
    /**
     * Computes the amount of space a single 1x1 tile would take up (width or height).
     * Used as a basis for other calculations.
     * @param {?} sizePercent Percent of the total grid-list space that one 1x1 tile would take up.
     * @param {?} gutterFraction Fraction of the gutter size taken up by one 1x1 tile.
     * @return {?} The size of a 1x1 tile as an expression that can be evaluated via CSS calc().
     */
    TileStyler.prototype.getBaseTileSize = function (sizePercent, gutterFraction) {
        // Take the base size percent (as would be if evenly dividing the size between cells),
        // and then subtracting the size of one gutter. However, since there are no gutters on the
        // edges, each tile only uses a fraction (gutterShare = numGutters / numCells) of the gutter
        // size. (Imagine having one gutter per tile, and then breaking up the extra gutter on the
        // edge evenly among the cells).
        return "(" + sizePercent + "% - ( " + this._gutterSize + " * " + gutterFraction + " ))";
    };
    /**
     * Gets The horizontal or vertical position of a tile, e.g., the 'top' or 'left' property value.
     * @param {?} baseSize Base size of a 1x1 tile (as computed in getBaseTileSize).
     * @param {?} offset Number of tiles that have already been rendered in the row/column.
     * @return {?} Position of the tile as a CSS calc() expression.
     */
    TileStyler.prototype.getTilePosition = function (baseSize, offset) {
        // The position comes the size of a 1x1 tile plus gutter for each previous tile in the
        // row/column (offset).
        return calc("(" + baseSize + " + " + this._gutterSize + ") * " + offset);
    };
    /**
     * Gets the actual size of a tile, e.g., width or height, taking rowspan or colspan into account.
     * @param {?} baseSize Base size of a 1x1 tile (as computed in getBaseTileSize).
     * @param {?} span The tile's rowspan or colspan.
     * @return {?} Size of the tile as a CSS calc() expression.
     */
    TileStyler.prototype.getTileSize = function (baseSize, span) {
        return "(" + baseSize + " * " + span + ") + (" + (span - 1) + " * " + this._gutterSize + ")";
    };
    /**
     * Sets the style properties to be applied to a tile for the given row and column index.
     * @param {?} tile Tile to which to apply the styling.
     * @param {?} rowIndex Index of the tile's row.
     * @param {?} colIndex Index of the tile's column.
     * @return {?}
     */
    TileStyler.prototype.setStyle = function (tile, rowIndex, colIndex) {
        // Percent of the available horizontal space that one column takes up.
        var /** @type {?} */ percentWidthPerTile = 100 / this._cols;
        // Fraction of the vertical gutter size that each column takes up.
        // For example, if there are 5 columns, each column uses 4/5 = 0.8 times the gutter width.
        var /** @type {?} */ gutterWidthFractionPerTile = (this._cols - 1) / this._cols;
        this.setColStyles(tile, colIndex, percentWidthPerTile, gutterWidthFractionPerTile);
        this.setRowStyles(tile, rowIndex, percentWidthPerTile, gutterWidthFractionPerTile);
    };
    /**
     * Sets the horizontal placement of the tile in the list.
     * @param {?} tile
     * @param {?} colIndex
     * @param {?} percentWidth
     * @param {?} gutterWidth
     * @return {?}
     */
    TileStyler.prototype.setColStyles = function (tile, colIndex, percentWidth, gutterWidth) {
        // Base horizontal size of a column.
        var /** @type {?} */ baseTileWidth = this.getBaseTileSize(percentWidth, gutterWidth);
        // The width and horizontal position of each tile is always calculated the same way, but the
        // height and vertical position depends on the rowMode.
        var /** @type {?} */ side = this._direction === 'ltr' ? 'left' : 'right';
        tile._setStyle(side, this.getTilePosition(baseTileWidth, colIndex));
        tile._setStyle('width', calc(this.getTileSize(baseTileWidth, tile.colspan)));
    };
    /**
     * Calculates the total size taken up by gutters across one axis of a list.
     * @return {?}
     */
    TileStyler.prototype.getGutterSpan = function () {
        return this._gutterSize + " * (" + this._rowspan + " - 1)";
    };
    /**
     * Calculates the total size taken up by tiles across one axis of a list.
     * @param {?} tileHeight Height of the tile.
     * @return {?}
     */
    TileStyler.prototype.getTileSpan = function (tileHeight) {
        return this._rowspan + " * " + this.getTileSize(tileHeight, 1);
    };
    /**
     * Sets the vertical placement of the tile in the list.
     * This method will be implemented by each type of TileStyler.
     * \@docs-private
     * @abstract
     * @param {?} tile
     * @param {?} rowIndex
     * @param {?} percentWidth
     * @param {?} gutterWidth
     * @return {?}
     */
    TileStyler.prototype.setRowStyles = function (tile, rowIndex, percentWidth, gutterWidth) { };
    /**
     * Calculates the computed height and returns the correct style property to set.
     * This method can be implemented by each type of TileStyler.
     * \@docs-private
     * @return {?}
     */
    TileStyler.prototype.getComputedHeight = function () { return null; };
    return TileStyler;
}());
/**
 * This type of styler is instantiated when the user passes in a fixed row height.
 * Example <md-grid-list cols="3" rowHeight="100px">
 * \@docs-private
 */
var FixedTileStyler = (function (_super) {
    __extends(FixedTileStyler, _super);
    /**
     * @param {?} fixedRowHeight
     */
    function FixedTileStyler(fixedRowHeight) {
        var _this = _super.call(this) || this;
        _this.fixedRowHeight = fixedRowHeight;
        return _this;
    }
    /**
     * @param {?} gutterSize
     * @param {?} tracker
     * @param {?} cols
     * @param {?} direction
     * @return {?}
     */
    FixedTileStyler.prototype.init = function (gutterSize, tracker, cols, direction) {
        _super.prototype.init.call(this, gutterSize, tracker, cols, direction);
        this.fixedRowHeight = normalizeUnits(this.fixedRowHeight);
    };
    /**
     * @param {?} tile
     * @param {?} rowIndex
     * @return {?}
     */
    FixedTileStyler.prototype.setRowStyles = function (tile, rowIndex) {
        tile._setStyle('top', this.getTilePosition(this.fixedRowHeight, rowIndex));
        tile._setStyle('height', calc(this.getTileSize(this.fixedRowHeight, tile.rowspan)));
    };
    /**
     * @return {?}
     */
    FixedTileStyler.prototype.getComputedHeight = function () {
        return [
            'height', calc(this.getTileSpan(this.fixedRowHeight) + " + " + this.getGutterSpan())
        ];
    };
    return FixedTileStyler;
}(TileStyler));
/**
 * This type of styler is instantiated when the user passes in a width:height ratio
 * for the row height.  Example <md-grid-list cols="3" rowHeight="3:1">
 * \@docs-private
 */
var RatioTileStyler = (function (_super) {
    __extends(RatioTileStyler, _super);
    /**
     * @param {?} value
     */
    function RatioTileStyler(value) {
        var _this = _super.call(this) || this;
        _this._parseRatio(value);
        return _this;
    }
    /**
     * @param {?} tile
     * @param {?} rowIndex
     * @param {?} percentWidth
     * @param {?} gutterWidth
     * @return {?}
     */
    RatioTileStyler.prototype.setRowStyles = function (tile, rowIndex, percentWidth, gutterWidth) {
        var /** @type {?} */ percentHeightPerTile = percentWidth / this.rowHeightRatio;
        this.baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterWidth);
        // Use paddingTop and marginTop to maintain the given aspect ratio, as
        // a percentage-based value for these properties is applied versus the *width* of the
        // containing block. See http://www.w3.org/TR/CSS2/box.html#margin-properties
        tile._setStyle('marginTop', this.getTilePosition(this.baseTileHeight, rowIndex));
        tile._setStyle('paddingTop', calc(this.getTileSize(this.baseTileHeight, tile.rowspan)));
    };
    /**
     * @return {?}
     */
    RatioTileStyler.prototype.getComputedHeight = function () {
        return [
            'paddingBottom', calc(this.getTileSpan(this.baseTileHeight) + " + " + this.getGutterSpan())
        ];
    };
    /**
     * @param {?} value
     * @return {?}
     */
    RatioTileStyler.prototype._parseRatio = function (value) {
        var /** @type {?} */ ratioParts = value.split(':');
        if (ratioParts.length !== 2) {
            throw Error("md-grid-list: invalid ratio given for row-height: \"" + value + "\"");
        }
        this.rowHeightRatio = parseFloat(ratioParts[0]) / parseFloat(ratioParts[1]);
    };
    return RatioTileStyler;
}(TileStyler));
/**
 * This type of styler is instantiated when the user selects a "fit" row height mode.
 * In other words, the row height will reflect the total height of the container divided
 * by the number of rows.  Example <md-grid-list cols="3" rowHeight="fit">
 *
 * \@docs-private
 */
var FitTileStyler = (function (_super) {
    __extends(FitTileStyler, _super);
    function FitTileStyler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} tile
     * @param {?} rowIndex
     * @return {?}
     */
    FitTileStyler.prototype.setRowStyles = function (tile, rowIndex) {
        // Percent of the available vertical space that one row takes up.
        var /** @type {?} */ percentHeightPerTile = 100 / this._rowspan;
        // Fraction of the horizontal gutter size that each column takes up.
        var /** @type {?} */ gutterHeightPerTile = (this._rows - 1) / this._rows;
        // Base vertical size of a column.
        var /** @type {?} */ baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterHeightPerTile);
        tile._setStyle('top', this.getTilePosition(baseTileHeight, rowIndex));
        tile._setStyle('height', calc(this.getTileSize(baseTileHeight, tile.rowspan)));
    };
    return FitTileStyler;
}(TileStyler));
/**
 * Wraps a CSS string in a calc function
 * @param {?} exp
 * @return {?}
 */
function calc(exp) { return "calc(" + exp + ")"; }
/**
 * Appends pixels to a CSS string if no units are given.
 * @param {?} value
 * @return {?}
 */
function normalizeUnits(value) {
    return (value.match(/px|em|rem/)) ? value : value + 'px';
}
// TODO(kara): Conditional (responsive) column count / row size.
// TODO(kara): Re-layout on window resize / media change (debounced).
// TODO(kara): gridTileHeader and gridTileFooter.
var MD_FIT_MODE = 'fit';
var MdGridList = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _element
     * @param {?} _dir
     */
    function MdGridList(_renderer, _element, _dir) {
        this._renderer = _renderer;
        this._element = _element;
        this._dir = _dir;
        /**
         * The amount of space between tiles. This will be something like '5px' or '2em'.
         */
        this._gutter = '1px';
    }
    Object.defineProperty(MdGridList.prototype, "cols", {
        /**
         * Amount of columns in the grid list.
         * @return {?}
         */
        get: function () { return this._cols; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._cols = coerceToNumber(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridList.prototype, "gutterSize", {
        /**
         * Size of the grid list's gutter in pixels.
         * @return {?}
         */
        get: function () { return this._gutter; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._gutter = coerceToString(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridList.prototype, "rowHeight", {
        /**
         * Set internal representation of row height from the user-provided value.
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._rowHeight = coerceToString(value);
            this._setTileStyler();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdGridList.prototype.ngOnInit = function () {
        this._checkCols();
        this._checkRowHeight();
    };
    /**
     * The layout calculation is fairly cheap if nothing changes, so there's little cost
     * to run it frequently.
     * @return {?}
     */
    MdGridList.prototype.ngAfterContentChecked = function () {
        this._layoutTiles();
    };
    /**
     * Throw a friendly error if cols property is missing
     * @return {?}
     */
    MdGridList.prototype._checkCols = function () {
        if (!this.cols) {
            throw Error("md-grid-list: must pass in number of columns. " +
                "Example: <md-grid-list cols=\"3\">");
        }
    };
    /**
     * Default to equal width:height if rowHeight property is missing
     * @return {?}
     */
    MdGridList.prototype._checkRowHeight = function () {
        if (!this._rowHeight) {
            this._tileStyler = new RatioTileStyler('1:1');
        }
    };
    /**
     * Creates correct Tile Styler subtype based on rowHeight passed in by user
     * @return {?}
     */
    MdGridList.prototype._setTileStyler = function () {
        if (this._rowHeight === MD_FIT_MODE) {
            this._tileStyler = new FitTileStyler();
        }
        else if (this._rowHeight && this._rowHeight.indexOf(':') > -1) {
            this._tileStyler = new RatioTileStyler(this._rowHeight);
        }
        else {
            this._tileStyler = new FixedTileStyler(this._rowHeight);
        }
    };
    /**
     * Computes and applies the size and position for all children grid tiles.
     * @return {?}
     */
    MdGridList.prototype._layoutTiles = function () {
        var _this = this;
        var /** @type {?} */ tracker = new TileCoordinator(this.cols, this._tiles);
        var /** @type {?} */ direction = this._dir ? this._dir.value : 'ltr';
        this._tileStyler.init(this.gutterSize, tracker, this.cols, direction);
        this._tiles.forEach(function (tile, index) {
            var /** @type {?} */ pos = tracker.positions[index];
            _this._tileStyler.setStyle(tile, pos.row, pos.col);
        });
        this._setListStyle(this._tileStyler.getComputedHeight());
    };
    /**
     * Sets style on the main grid-list element, given the style name and value.
     * @param {?} style
     * @return {?}
     */
    MdGridList.prototype._setListStyle = function (style$$1) {
        if (style$$1) {
            this._renderer.setStyle(this._element.nativeElement, style$$1[0], style$$1[1]);
        }
    };
    return MdGridList;
}());
MdGridList.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-grid-list, mat-grid-list',
                template: "<div><ng-content></ng-content></div>",
                styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-figure{display:flex;position:absolute;align-items:center;justify-content:center;height:100%;top:0;right:0;bottom:0;left:0;padding:0;margin:0}.mat-grid-tile .mat-grid-tile-footer,.mat-grid-tile .mat-grid-tile-header{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-footer>*,.mat-grid-tile .mat-grid-tile-header>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-grid-tile .mat-grid-tile-footer.mat-2-line,.mat-grid-tile .mat-grid-tile-header.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}"],
                host: {
                    'role': 'list',
                    'class': 'mat-grid-list',
                },
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                encapsulation: _angular_core.ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdGridList.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
    { type: _angular_cdk.Directionality, decorators: [{ type: _angular_core.Optional },] },
]; };
MdGridList.propDecorators = {
    '_tiles': [{ type: _angular_core.ContentChildren, args: [MdGridTile,] },],
    'cols': [{ type: _angular_core.Input },],
    'gutterSize': [{ type: _angular_core.Input },],
    'rowHeight': [{ type: _angular_core.Input },],
};
var MdGridListModule = (function () {
    function MdGridListModule() {
    }
    return MdGridListModule;
}());
MdGridListModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [MdLineModule, MdCommonModule],
                exports: [
                    MdGridList,
                    MdGridTile,
                    MdGridTileText,
                    MdLineModule,
                    MdCommonModule,
                    MdGridTileHeaderCssMatStyler,
                    MdGridTileFooterCssMatStyler,
                    MdGridAvatarCssMatStyler
                ],
                declarations: [
                    MdGridList,
                    MdGridTile,
                    MdGridTileText,
                    MdGridTileHeaderCssMatStyler,
                    MdGridTileFooterCssMatStyler,
                    MdGridAvatarCssMatStyler
                ],
            },] },
];
/**
 * @nocollapse
 */
MdGridListModule.ctorParameters = function () { return []; };
/**
 * Content of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
var MdCardContent = (function () {
    function MdCardContent() {
    }
    return MdCardContent;
}());
MdCardContent.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-card-content, mat-card-content',
                host: { 'class': 'mat-card-content' }
            },] },
];
/**
 * @nocollapse
 */
MdCardContent.ctorParameters = function () { return []; };
/**
 * Title of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
var MdCardTitle = (function () {
    function MdCardTitle() {
    }
    return MdCardTitle;
}());
MdCardTitle.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-card-title, mat-card-title, [md-card-title], [mat-card-title],' +
                    '[mdCardTitle], [matCardTitle]',
                host: {
                    'class': 'mat-card-title '
                }
            },] },
];
/**
 * @nocollapse
 */
MdCardTitle.ctorParameters = function () { return []; };
/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
var MdCardSubtitle = (function () {
    function MdCardSubtitle() {
    }
    return MdCardSubtitle;
}());
MdCardSubtitle.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-card-subtitle, mat-card-subtitle, [md-card-subtitle], [mat-card-subtitle],' +
                    '[mdCardSubtitle], [matCardSubtitle]',
                host: {
                    'class': 'mat-card-subtitle '
                }
            },] },
];
/**
 * @nocollapse
 */
MdCardSubtitle.ctorParameters = function () { return []; };
/**
 * Action section of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
var MdCardActions = (function () {
    function MdCardActions() {
    }
    return MdCardActions;
}());
MdCardActions.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-card-actions, mat-card-actions',
                host: { 'class': 'mat-card-actions' }
            },] },
];
/**
 * @nocollapse
 */
MdCardActions.ctorParameters = function () { return []; };
/**
 * Footer of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
var MdCardFooter = (function () {
    function MdCardFooter() {
    }
    return MdCardFooter;
}());
MdCardFooter.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-card-footer, mat-card-footer',
                host: { 'class': 'mat-card-footer' }
            },] },
];
/**
 * @nocollapse
 */
MdCardFooter.ctorParameters = function () { return []; };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
var MdCardImage = (function () {
    function MdCardImage() {
    }
    return MdCardImage;
}());
MdCardImage.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-card-image], [mat-card-image], [mdCardImage], [matCardImage]',
                host: { 'class': 'mat-card-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardImage.ctorParameters = function () { return []; };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
var MdCardSmImage = (function () {
    function MdCardSmImage() {
    }
    return MdCardSmImage;
}());
MdCardSmImage.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-card-sm-image], [mat-card-sm-image], [mdCardImageSmall], [matCardImageSmall]',
                host: { 'class': 'mat-card-sm-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardSmImage.ctorParameters = function () { return []; };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
var MdCardMdImage = (function () {
    function MdCardMdImage() {
    }
    return MdCardMdImage;
}());
MdCardMdImage.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-card-md-image], [mat-card-md-image], [mdCardImageMedium], [matCardImageMedium]',
                host: { 'class': 'mat-card-md-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardMdImage.ctorParameters = function () { return []; };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
var MdCardLgImage = (function () {
    function MdCardLgImage() {
    }
    return MdCardLgImage;
}());
MdCardLgImage.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-card-lg-image], [mat-card-lg-image], [mdCardImageLarge], [matCardImageLarge]',
                host: { 'class': 'mat-card-lg-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardLgImage.ctorParameters = function () { return []; };
/**
 * Large image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
var MdCardXlImage = (function () {
    function MdCardXlImage() {
    }
    return MdCardXlImage;
}());
MdCardXlImage.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-card-xl-image], [mat-card-xl-image], [mdCardImageXLarge], [matCardImageXLarge]',
                host: { 'class': 'mat-card-xl-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardXlImage.ctorParameters = function () { return []; };
/**
 * Avatar image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
var MdCardAvatar = (function () {
    function MdCardAvatar() {
    }
    return MdCardAvatar;
}());
MdCardAvatar.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-card-avatar], [mat-card-avatar], [mdCardAvatar], [matCardAvatar]',
                host: { 'class': 'mat-card-avatar' }
            },] },
];
/**
 * @nocollapse
 */
MdCardAvatar.ctorParameters = function () { return []; };
/**
 * A basic content container component that adds the styles of a Material design card.
 *
 * While this component can be used alone, it also provides a number
 * of preset styles for common card sections, including:
 * - md-card-title
 * - md-card-subtitle
 * - md-card-content
 * - md-card-actions
 * - md-card-footer
 */
var MdCard = (function () {
    function MdCard() {
    }
    return MdCard;
}());
MdCard.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-card, mat-card',
                template: "<ng-content></ng-content>",
                styles: [".mat-card{transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);display:block;position:relative;padding:24px;border-radius:2px}.mat-card:not([class*=mat-elevation-z]){box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}@media screen and (-ms-high-contrast:active){.mat-card{outline:solid 1px}}.mat-card-flat{box-shadow:none}.mat-card-actions,.mat-card-content,.mat-card-subtitle,.mat-card-title{display:block;margin-bottom:16px}.mat-card-actions{margin-left:-16px;margin-right:-16px;padding:8px 0}.mat-card-actions[align=end]{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 48px);margin:0 -24px 16px -24px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-footer{position:absolute;width:100%;min-height:5px;bottom:0;left:0}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button{margin:0 4px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header-text{margin:0 8px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0}.mat-card-lg-image,.mat-card-md-image,.mat-card-sm-image{margin:-8px 0}.mat-card-title-group{display:flex;justify-content:space-between;margin:0 -8px}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}@media (max-width:600px){.mat-card{padding:24px 16px}.mat-card-actions{margin-left:-8px;margin-right:-8px}.mat-card-image{width:calc(100% + 32px);margin:16px -16px}.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}.mat-card-header{margin:-8px 0 0 0}}.mat-card-content>:first-child,.mat-card>:first-child{margin-top:0}.mat-card-content>:last-child,.mat-card>:last-child{margin-bottom:0}.mat-card-image:first-child{margin-top:-24px}.mat-card>.mat-card-actions:last-child{margin-bottom:-16px;padding-bottom:0}.mat-card-actions .mat-button:first-child,.mat-card-actions .mat-raised-button:first-child{margin-left:0;margin-right:0}.mat-card-subtitle:not(:first-child),.mat-card-title:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}"],
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                host: { 'class': 'mat-card' }
            },] },
];
/**
 * @nocollapse
 */
MdCard.ctorParameters = function () { return []; };
/**
 * Component intended to be used within the `<md-card>` component. It adds styles for a
 * preset header section (i.e. a title, subtitle, and avatar layout).
 * \@docs-private
 */
var MdCardHeader = (function () {
    function MdCardHeader() {
    }
    return MdCardHeader;
}());
MdCardHeader.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-card-header, mat-card-header',
                template: "<ng-content select=\"[md-card-avatar], [mat-card-avatar]\"></ng-content><div class=\"mat-card-header-text\"><ng-content select=\"md-card-title, mat-card-title, md-card-subtitle, mat-card-subtitle, [md-card-title], [mat-card-title], [md-card-subtitle], [mat-card-subtitle]\"></ng-content></div><ng-content></ng-content>",
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                host: { 'class': 'mat-card-header' }
            },] },
];
/**
 * @nocollapse
 */
MdCardHeader.ctorParameters = function () { return []; };
/**
 * Component intended to be used within the <md-card> component. It adds styles for a preset
 * layout that groups an image with a title section.
 * \@docs-private
 */
var MdCardTitleGroup = (function () {
    function MdCardTitleGroup() {
    }
    return MdCardTitleGroup;
}());
MdCardTitleGroup.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-card-title-group, mat-card-title-group',
                template: "<div><ng-content select=\"md-card-title, mat-card-title, md-card-subtitle, mat-card-subtitle, [md-card-title], [mat-card-title], [md-card-subtitle], [mat-card-subtitle]\"></ng-content></div><ng-content select=\"img\"></ng-content><ng-content></ng-content>",
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                host: { 'class': 'mat-card-title-group' }
            },] },
];
/**
 * @nocollapse
 */
MdCardTitleGroup.ctorParameters = function () { return []; };
var MdCardModule = (function () {
    function MdCardModule() {
    }
    return MdCardModule;
}());
MdCardModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [MdCommonModule],
                exports: [
                    MdCard,
                    MdCardHeader,
                    MdCardTitleGroup,
                    MdCardContent,
                    MdCardTitle,
                    MdCardSubtitle,
                    MdCardActions,
                    MdCardFooter,
                    MdCardSmImage,
                    MdCardMdImage,
                    MdCardLgImage,
                    MdCardImage,
                    MdCardXlImage,
                    MdCardAvatar,
                    MdCommonModule,
                ],
                declarations: [
                    MdCard, MdCardHeader, MdCardTitleGroup, MdCardContent, MdCardTitle, MdCardSubtitle,
                    MdCardActions, MdCardFooter, MdCardSmImage, MdCardMdImage, MdCardLgImage, MdCardImage,
                    MdCardXlImage, MdCardAvatar,
                ],
            },] },
];
/**
 * @nocollapse
 */
MdCardModule.ctorParameters = function () { return []; };
/**
 * \@docs-private
 */
var MdChipBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdChipBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdChipBase;
}());
var _MdChipMixinBase = mixinColor(mixinDisabled(MdChipBase), 'primary');
/**
 * Dummy directive to add CSS class to basic chips.
 * \@docs-private
 */
var MdBasicChip = (function () {
    function MdBasicChip() {
    }
    return MdBasicChip;
}());
MdBasicChip.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: "md-basic-chip, [md-basic-chip], mat-basic-chip, [mat-basic-chip]",
                host: { 'class': 'mat-basic-chip' }
            },] },
];
/**
 * @nocollapse
 */
MdBasicChip.ctorParameters = function () { return []; };
/**
 * Material design styled Chip component. Used inside the MdChipList component.
 */
var MdChip = (function (_super) {
    __extends(MdChip, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     */
    function MdChip(renderer, elementRef) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._selected = false;
        /**
         * Whether the chip has focus.
         */
        _this._hasFocus = false;
        /**
         * Emitted when the chip is focused.
         */
        _this.onFocus = new _angular_core.EventEmitter();
        /**
         * Emitted when the chip is selected.
         */
        _this.select = new _angular_core.EventEmitter();
        /**
         * Emitted when the chip is deselected.
         */
        _this.deselect = new _angular_core.EventEmitter();
        /**
         * Emitted when the chip is destroyed.
         */
        _this.destroy = new _angular_core.EventEmitter();
        return _this;
    }
    Object.defineProperty(MdChip.prototype, "selected", {
        /**
         * Whether the chip is selected.
         * @return {?}
         */
        get: function () { return this._selected; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selected = _angular_cdk.coerceBooleanProperty(value);
            (this.selected ? this.select : this.deselect).emit({ chip: this });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdChip.prototype.ngOnDestroy = function () {
        this.destroy.emit({ chip: this });
    };
    /**
     * Toggles the current selected state of this chip.
     * @return {?} Whether the chip is selected.
     */
    MdChip.prototype.toggleSelected = function () {
        this.selected = !this.selected;
        return this.selected;
    };
    /**
     * Allows for programmatic focusing of the chip.
     * @return {?}
     */
    MdChip.prototype.focus = function () {
        this._elementRef.nativeElement.focus();
        this.onFocus.emit({ chip: this });
    };
    /**
     * Ensures events fire properly upon click.
     * @param {?} event
     * @return {?}
     */
    MdChip.prototype._handleClick = function (event) {
        // Check disabled
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            this.focus();
        }
    };
    return MdChip;
}(_MdChipMixinBase));
MdChip.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: "md-basic-chip, [md-basic-chip], md-chip, [md-chip],\n             mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]",
                inputs: ['color', 'disabled'],
                host: {
                    'class': 'mat-chip',
                    'tabindex': '-1',
                    'role': 'option',
                    '[class.mat-chip-selected]': 'selected',
                    '[attr.disabled]': 'disabled || null',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '(click)': '_handleClick($event)',
                    '(focus)': '_hasFocus = true',
                    '(blur)': '_hasFocus = false',
                }
            },] },
];
/**
 * @nocollapse
 */
MdChip.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
]; };
MdChip.propDecorators = {
    'selected': [{ type: _angular_core.Input },],
    'select': [{ type: _angular_core.Output },],
    'deselect': [{ type: _angular_core.Output },],
    'destroy': [{ type: _angular_core.Output },],
};
/**
 * A material design chips component (named ChipList for it's similarity to the List component).
 *
 * Example:
 *
 *     <md-chip-list>
 *       <md-chip>Chip 1<md-chip>
 *       <md-chip>Chip 2<md-chip>
 *     </md-chip-list>
 */
var MdChipList = (function () {
    function MdChipList() {
        /**
         * Track which chips we're listening to for focus/destruction.
         */
        this._subscribed = new WeakMap();
        /**
         * Whether or not the chip is selectable.
         */
        this._selectable = true;
        /**
         * Tab index for the chip list.
         */
        this._tabIndex = 0;
    }
    /**
     * @return {?}
     */
    MdChipList.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._keyManager = new FocusKeyManager(this.chips).withWrap();
        // Prevents the chip list from capturing focus and redirecting
        // it back to the first chip when the user tabs out.
        this._tabOutSubscription = this._keyManager.tabOut.subscribe(function () {
            _this._tabIndex = -1;
            setTimeout(function () { return _this._tabIndex = 0; });
        });
        // Go ahead and subscribe all of the initial chips
        this._subscribeChips(this.chips);
        // When the list changes, re-subscribe
        this.chips.changes.subscribe(function (chips) {
            _this._subscribeChips(chips);
        });
    };
    /**
     * @return {?}
     */
    MdChipList.prototype.ngOnDestroy = function () {
        if (this._tabOutSubscription) {
            this._tabOutSubscription.unsubscribe();
        }
    };
    Object.defineProperty(MdChipList.prototype, "selectable", {
        /**
         * Whether or not this chip is selectable. When a chip is not selectable,
         * it's selected state is always ignored.
         * @return {?}
         */
        get: function () { return this._selectable; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selectable = _angular_cdk.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Programmatically focus the chip list. This in turn focuses the first
     * non-disabled chip in this chip list.
     * @return {?}
     */
    MdChipList.prototype.focus = function () {
        // TODO: ARIA says this should focus the first `selected` chip.
        this._keyManager.setFirstItemActive();
    };
    /**
     * Passes relevant key presses to our key manager.
     * @param {?} event
     * @return {?}
     */
    MdChipList.prototype._keydown = function (event) {
        var /** @type {?} */ target = (event.target);
        // If they are on a chip, check for space/left/right, otherwise pass to our key manager
        if (target && target.classList.contains('mat-chip')) {
            switch (event.keyCode) {
                case _angular_cdk.SPACE:
                    // If we are selectable, toggle the focused chip
                    if (this.selectable) {
                        this._toggleSelectOnFocusedChip();
                    }
                    // Always prevent space from scrolling the page since the list has focus
                    event.preventDefault();
                    break;
                case _angular_cdk.LEFT_ARROW:
                    this._keyManager.setPreviousItemActive();
                    event.preventDefault();
                    break;
                case _angular_cdk.RIGHT_ARROW:
                    this._keyManager.setNextItemActive();
                    event.preventDefault();
                    break;
                default:
                    this._keyManager.onKeydown(event);
            }
        }
    };
    /**
     * Toggles the selected state of the currently focused chip.
     * @return {?}
     */
    MdChipList.prototype._toggleSelectOnFocusedChip = function () {
        // Allow disabling of chip selection
        if (!this.selectable) {
            return;
        }
        var /** @type {?} */ focusedIndex = this._keyManager.activeItemIndex;
        if (typeof focusedIndex === 'number' && this._isValidIndex(focusedIndex)) {
            var /** @type {?} */ focusedChip = this.chips.toArray()[focusedIndex];
            if (focusedChip) {
                focusedChip.toggleSelected();
            }
        }
    };
    /**
     * Iterate through the list of chips and add them to our list of
     * subscribed chips.
     *
     * @param {?} chips The list of chips to be subscribed.
     * @return {?}
     */
    MdChipList.prototype._subscribeChips = function (chips) {
        var _this = this;
        chips.forEach(function (chip) { return _this._addChip(chip); });
    };
    /**
     * Add a specific chip to our subscribed list. If the chip has
     * already been subscribed, this ensures it is only subscribed
     * once.
     *
     * @param {?} chip The chip to be subscribed (or checked for existing
     * subscription).
     * @return {?}
     */
    MdChipList.prototype._addChip = function (chip) {
        var _this = this;
        // If we've already been subscribed to a parent, do nothing
        if (this._subscribed.has(chip)) {
            return;
        }
        // Watch for focus events outside of the keyboard navigation
        chip.onFocus.subscribe(function () {
            var /** @type {?} */ chipIndex = _this.chips.toArray().indexOf(chip);
            if (_this._isValidIndex(chipIndex)) {
                _this._keyManager.updateActiveItemIndex(chipIndex);
            }
        });
        // On destroy, remove the item from our list, and check focus
        chip.destroy.subscribe(function () {
            var /** @type {?} */ chipIndex = _this.chips.toArray().indexOf(chip);
            if (_this._isValidIndex(chipIndex) && chip._hasFocus) {
                // Check whether the chip is the last item
                if (chipIndex < _this.chips.length - 1) {
                    _this._keyManager.setActiveItem(chipIndex);
                }
                else if (chipIndex - 1 >= 0) {
                    _this._keyManager.setActiveItem(chipIndex - 1);
                }
            }
            _this._subscribed.delete(chip);
            chip.destroy.unsubscribe();
        });
        this._subscribed.set(chip, true);
    };
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param {?} index The index to be checked.
     * @return {?} True if the index is valid for our list of chips.
     */
    MdChipList.prototype._isValidIndex = function (index) {
        return index >= 0 && index < this.chips.length;
    };
    return MdChipList;
}());
MdChipList.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-chip-list, mat-chip-list',
                template: "<div class=\"mat-chip-list-wrapper\"><ng-content></ng-content></div>",
                host: {
                    // Properties
                    '[attr.tabindex]': '_tabIndex',
                    'role': 'listbox',
                    'class': 'mat-chip-list',
                    // Events
                    '(focus)': 'focus()',
                    '(keydown)': '_keydown($event)'
                },
                queries: {
                    chips: new _angular_core.ContentChildren(MdChip)
                },
                styles: [".mat-chip-list-wrapper{display:flex;flex-direction:row;flex-wrap:wrap;align-items:flex-start}.mat-chip:not(.mat-basic-chip){display:inline-block;padding:8px 12px 8px 12px;border-radius:24px}.mat-chip:not(.mat-basic-chip)+.mat-chip:not(.mat-basic-chip){margin:0 0 0 3px}[dir=rtl] .mat-chip:not(.mat-basic-chip)+.mat-chip:not(.mat-basic-chip){margin:0 3px 0 0}@media screen and (-ms-high-contrast:active){.mat-chip:not(.mat-basic-chip){outline:solid 1px}}.mat-chip-list-stacked .mat-chip-list-wrapper{display:block}.mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip){display:block;margin:0;margin-bottom:8px}[dir=rtl] .mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip){margin:0;margin-bottom:8px}.mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip):last-child,[dir=rtl] .mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip):last-child{margin-bottom:0}"],
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
MdChipList.ctorParameters = function () { return []; };
MdChipList.propDecorators = {
    'selectable': [{ type: _angular_core.Input },],
};
var MdChipsModule = (function () {
    function MdChipsModule() {
    }
    return MdChipsModule;
}());
MdChipsModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [],
                exports: [MdChipList, MdChip, MdBasicChip],
                declarations: [MdChipList, MdChip, MdBasicChip]
            },] },
];
/**
 * @nocollapse
 */
MdChipsModule.ctorParameters = function () { return []; };
/**
 * Returns an exception to be thrown in the case when attempting to
 * load an icon with a name that cannot be found.
 * \@docs-private
 * @param {?} iconName
 * @return {?}
 */
function getMdIconNameNotFoundError(iconName) {
    return Error("Unable to find icon with the name \"" + iconName + "\"");
}
/**
 * Returns an exception to be thrown when the consumer attempts to use
 * `<md-icon>` without including \@angular/http.
 * \@docs-private
 * @return {?}
 */
function getMdIconNoHttpProviderError() {
    return Error('Could not find Http provider for use with Angular Material icons. ' +
        'Please include the HttpModule from @angular/http in your app imports.');
}
/**
 * Returns an exception to be thrown when a URL couldn't be sanitized.
 * \@docs-private
 * @param {?} url URL that was attempted to be sanitized.
 * @return {?}
 */
function getMdIconFailedToSanitizeError(url) {
    return Error("The URL provided to MdIconRegistry was not trusted as a resource URL " +
        ("via Angular's DomSanitizer. Attempted URL was \"" + url + "\"."));
}
/**
 * Configuration for an icon, including the URL and possibly the cached SVG element.
 * \@docs-private
 */
var SvgIconConfig = (function () {
    /**
     * @param {?} url
     */
    function SvgIconConfig(url) {
        this.url = url;
        this.svgElement = null;
    }
    return SvgIconConfig;
}());
/**
 * Service to register and display icons used by the <md-icon> component.
 * - Registers icon URLs by namespace and name.
 * - Registers icon set URLs by namespace.
 * - Registers aliases for CSS classes, for use with icon fonts.
 * - Loads icons from URLs and extracts individual icons from icon sets.
 */
var MdIconRegistry = (function () {
    /**
     * @param {?} _http
     * @param {?} _sanitizer
     */
    function MdIconRegistry(_http, _sanitizer) {
        this._http = _http;
        this._sanitizer = _sanitizer;
        /**
         * URLs and cached SVG elements for individual icons. Keys are of the format "[namespace]:[icon]".
         */
        this._svgIconConfigs = new Map();
        /**
         * SvgIconConfig objects and cached SVG elements for icon sets, keyed by namespace.
         * Multiple icon sets can be registered under the same namespace.
         */
        this._iconSetConfigs = new Map();
        /**
         * Cache for icons loaded by direct URLs.
         */
        this._cachedIconsByUrl = new Map();
        /**
         * In-progress icon fetches. Used to coalesce multiple requests to the same URL.
         */
        this._inProgressUrlFetches = new Map();
        /**
         * Map from font identifiers to their CSS class names. Used for icon fonts.
         */
        this._fontCssClassesByAlias = new Map();
        /**
         * The CSS class to apply when an <md-icon> component has no icon name, url, or font specified.
         * The default 'material-icons' value assumes that the material icon font has been loaded as
         * described at http://google.github.io/material-design-icons/#icon-font-for-the-web
         */
        this._defaultFontSetClass = 'material-icons';
    }
    /**
     * Registers an icon by URL in the default namespace.
     * @param {?} iconName Name under which the icon should be registered.
     * @param {?} url
     * @return {?}
     */
    MdIconRegistry.prototype.addSvgIcon = function (iconName, url) {
        return this.addSvgIconInNamespace('', iconName, url);
    };
    /**
     * Registers an icon by URL in the specified namespace.
     * @param {?} namespace Namespace in which the icon should be registered.
     * @param {?} iconName Name under which the icon should be registered.
     * @param {?} url
     * @return {?}
     */
    MdIconRegistry.prototype.addSvgIconInNamespace = function (namespace, iconName, url) {
        var /** @type {?} */ key = iconKey(namespace, iconName);
        this._svgIconConfigs.set(key, new SvgIconConfig(url));
        return this;
    };
    /**
     * Registers an icon set by URL in the default namespace.
     * @param {?} url
     * @return {?}
     */
    MdIconRegistry.prototype.addSvgIconSet = function (url) {
        return this.addSvgIconSetInNamespace('', url);
    };
    /**
     * Registers an icon set by URL in the specified namespace.
     * @param {?} namespace Namespace in which to register the icon set.
     * @param {?} url
     * @return {?}
     */
    MdIconRegistry.prototype.addSvgIconSetInNamespace = function (namespace, url) {
        var /** @type {?} */ config = new SvgIconConfig(url);
        var /** @type {?} */ configNamespace = this._iconSetConfigs.get(namespace);
        if (configNamespace) {
            configNamespace.push(config);
        }
        else {
            this._iconSetConfigs.set(namespace, [config]);
        }
        return this;
    };
    /**
     * Defines an alias for a CSS class name to be used for icon fonts. Creating an mdIcon
     * component with the alias as the fontSet input will cause the class name to be applied
     * to the <md-icon> element.
     *
     * @param {?} alias Alias for the font.
     * @param {?=} className Class name override to be used instead of the alias.
     * @return {?}
     */
    MdIconRegistry.prototype.registerFontClassAlias = function (alias, className) {
        if (className === void 0) { className = alias; }
        this._fontCssClassesByAlias.set(alias, className);
        return this;
    };
    /**
     * Returns the CSS class name associated with the alias by a previous call to
     * registerFontClassAlias. If no CSS class has been associated, returns the alias unmodified.
     * @param {?} alias
     * @return {?}
     */
    MdIconRegistry.prototype.classNameForFontAlias = function (alias) {
        return this._fontCssClassesByAlias.get(alias) || alias;
    };
    /**
     * Sets the CSS class name to be used for icon fonts when an <md-icon> component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     *
     * @param {?} className
     * @return {?}
     */
    MdIconRegistry.prototype.setDefaultFontSetClass = function (className) {
        this._defaultFontSetClass = className;
        return this;
    };
    /**
     * Returns the CSS class name to be used for icon fonts when an <md-icon> component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     * @return {?}
     */
    MdIconRegistry.prototype.getDefaultFontSetClass = function () {
        return this._defaultFontSetClass;
    };
    /**
     * Returns an Observable that produces the icon (as an <svg> DOM element) from the given URL.
     * The response from the URL may be cached so this will not always cause an HTTP request, but
     * the produced element will always be a new copy of the originally fetched icon. (That is,
     * it will not contain any modifications made to elements previously returned).
     *
     * @param {?} safeUrl URL from which to fetch the SVG icon.
     * @return {?}
     */
    MdIconRegistry.prototype.getSvgIconFromUrl = function (safeUrl) {
        var _this = this;
        var /** @type {?} */ url = this._sanitizer.sanitize(_angular_core.SecurityContext.RESOURCE_URL, safeUrl);
        if (!url) {
            throw getMdIconFailedToSanitizeError(safeUrl);
        }
        var /** @type {?} */ cachedIcon = this._cachedIconsByUrl.get(url);
        if (cachedIcon) {
            return rxjs_observable_of.of(cloneSvg(cachedIcon));
        }
        return _angular_cdk.RxChain.from(this._loadSvgIconFromConfig(new SvgIconConfig(url)))
            .call(_angular_cdk.doOperator, function (svg) { return _this._cachedIconsByUrl.set(/** @type {?} */ ((url)), svg); })
            .call(_angular_cdk.map, function (svg) { return cloneSvg(svg); })
            .result();
    };
    /**
     * Returns an Observable that produces the icon (as an <svg> DOM element) with the given name
     * and namespace. The icon must have been previously registered with addIcon or addIconSet;
     * if not, the Observable will throw an error.
     *
     * @param {?} name Name of the icon to be retrieved.
     * @param {?=} namespace Namespace in which to look for the icon.
     * @return {?}
     */
    MdIconRegistry.prototype.getNamedSvgIcon = function (name, namespace) {
        if (namespace === void 0) { namespace = ''; }
        // Return (copy of) cached icon if possible.
        var /** @type {?} */ key = iconKey(namespace, name);
        var /** @type {?} */ config = this._svgIconConfigs.get(key);
        if (config) {
            return this._getSvgFromConfig(config);
        }
        // See if we have any icon sets registered for the namespace.
        var /** @type {?} */ iconSetConfigs = this._iconSetConfigs.get(namespace);
        if (iconSetConfigs) {
            return this._getSvgFromIconSetConfigs(name, iconSetConfigs);
        }
        return rxjs_observable_throw._throw(getMdIconNameNotFoundError(key));
    };
    /**
     * Returns the cached icon for a SvgIconConfig if available, or fetches it from its URL if not.
     * @param {?} config
     * @return {?}
     */
    MdIconRegistry.prototype._getSvgFromConfig = function (config) {
        if (config.svgElement) {
            // We already have the SVG element for this icon, return a copy.
            return rxjs_observable_of.of(cloneSvg(config.svgElement));
        }
        else {
            // Fetch the icon from the config's URL, cache it, and return a copy.
            return _angular_cdk.RxChain.from(this._loadSvgIconFromConfig(config))
                .call(_angular_cdk.doOperator, function (svg) { return config.svgElement = svg; })
                .call(_angular_cdk.map, function (svg) { return cloneSvg(svg); })
                .result();
        }
    };
    /**
     * Attempts to find an icon with the specified name in any of the SVG icon sets.
     * First searches the available cached icons for a nested element with a matching name, and
     * if found copies the element to a new <svg> element. If not found, fetches all icon sets
     * that have not been cached, and searches again after all fetches are completed.
     * The returned Observable produces the SVG element if possible, and throws
     * an error if no icon with the specified name can be found.
     * @param {?} name
     * @param {?} iconSetConfigs
     * @return {?}
     */
    MdIconRegistry.prototype._getSvgFromIconSetConfigs = function (name, iconSetConfigs) {
        var _this = this;
        // For all the icon set SVG elements we've fetched, see if any contain an icon with the
        // requested name.
        var /** @type {?} */ namedIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);
        if (namedIcon) {
            // We could cache namedIcon in _svgIconConfigs, but since we have to make a copy every
            // time anyway, there's probably not much advantage compared to just always extracting
            // it from the icon set.
            return rxjs_observable_of.of(namedIcon);
        }
        // Not found in any cached icon sets. If there are icon sets with URLs that we haven't
        // fetched, fetch them now and look for iconName in the results.
        var /** @type {?} */ iconSetFetchRequests = iconSetConfigs
            .filter(function (iconSetConfig) { return !iconSetConfig.svgElement; })
            .map(function (iconSetConfig) {
            return _angular_cdk.RxChain.from(_this._loadSvgIconSetFromConfig(iconSetConfig))
                .call(_angular_cdk.catchOperator, function (err) {
                var /** @type {?} */ url = _this._sanitizer.sanitize(_angular_core.SecurityContext.RESOURCE_URL, iconSetConfig.url);
                // Swallow errors fetching individual URLs so the combined Observable won't
                // necessarily fail.
                console.log("Loading icon set URL: " + url + " failed: " + err);
                return rxjs_observable_of.of(null);
            })
                .call(_angular_cdk.doOperator, function (svg) {
                // Cache the SVG element.
                if (svg) {
                    iconSetConfig.svgElement = svg;
                }
            })
                .result();
        });
        // Fetch all the icon set URLs. When the requests complete, every IconSet should have a
        // cached SVG element (unless the request failed), and we can check again for the icon.
        return _angular_cdk.map.call(rxjs_observable_forkJoin.forkJoin.call(rxjs_Observable.Observable, iconSetFetchRequests), function () {
            var /** @type {?} */ foundIcon = _this._extractIconWithNameFromAnySet(name, iconSetConfigs);
            if (!foundIcon) {
                throw getMdIconNameNotFoundError(name);
            }
            return foundIcon;
        });
    };
    /**
     * Searches the cached SVG elements for the given icon sets for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     * @param {?} iconName
     * @param {?} iconSetConfigs
     * @return {?}
     */
    MdIconRegistry.prototype._extractIconWithNameFromAnySet = function (iconName, iconSetConfigs) {
        // Iterate backwards, so icon sets added later have precedence.
        for (var /** @type {?} */ i = iconSetConfigs.length - 1; i >= 0; i--) {
            var /** @type {?} */ config = iconSetConfigs[i];
            if (config.svgElement) {
                var /** @type {?} */ foundIcon = this._extractSvgIconFromSet(config.svgElement, iconName);
                if (foundIcon) {
                    return foundIcon;
                }
            }
        }
        return null;
    };
    /**
     * Loads the content of the icon URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     * @param {?} config
     * @return {?}
     */
    MdIconRegistry.prototype._loadSvgIconFromConfig = function (config) {
        var _this = this;
        return _angular_cdk.map.call(this._fetchUrl(config.url), function (svgText) { return _this._createSvgElementForSingleIcon(svgText); });
    };
    /**
     * Loads the content of the icon set URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     * @param {?} config
     * @return {?}
     */
    MdIconRegistry.prototype._loadSvgIconSetFromConfig = function (config) {
        var _this = this;
        // TODO: Document that icons should only be loaded from trusted sources.
        return _angular_cdk.map.call(this._fetchUrl(config.url), function (svgText) { return _this._svgElementFromString(svgText); });
    };
    /**
     * Creates a DOM element from the given SVG string, and adds default attributes.
     * @param {?} responseText
     * @return {?}
     */
    MdIconRegistry.prototype._createSvgElementForSingleIcon = function (responseText) {
        var /** @type {?} */ svg = this._svgElementFromString(responseText);
        this._setSvgAttributes(svg);
        return svg;
    };
    /**
     * Searches the cached element of the given SvgIconConfig for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     * @param {?} iconSet
     * @param {?} iconName
     * @return {?}
     */
    MdIconRegistry.prototype._extractSvgIconFromSet = function (iconSet, iconName) {
        var /** @type {?} */ iconNode = iconSet.querySelector('#' + iconName);
        if (!iconNode) {
            return null;
        }
        // If the icon node is itself an <svg> node, clone and return it directly. If not, set it as
        // the content of a new <svg> node.
        if (iconNode.tagName.toLowerCase() === 'svg') {
            return this._setSvgAttributes(/** @type {?} */ (iconNode.cloneNode(true)));
        }
        // If the node is a <symbol>, it won't be rendered so we have to convert it into <svg>. Note
        // that the same could be achieved by referring to it via <use href="#id">, however the <use>
        // tag is problematic on Firefox, because it needs to include the current page path.
        if (iconNode.nodeName.toLowerCase() === 'symbol') {
            return this._setSvgAttributes(this._toSvgElement(iconNode));
        }
        // createElement('SVG') doesn't work as expected; the DOM ends up with
        // the correct nodes, but the SVG content doesn't render. Instead we
        // have to create an empty SVG node using innerHTML and append its content.
        // Elements created using DOMParser.parseFromString have the same problem.
        // http://stackoverflow.com/questions/23003278/svg-innerhtml-in-firefox-can-not-display
        var /** @type {?} */ svg = this._svgElementFromString('<svg></svg>');
        // Clone the node so we don't remove it from the parent icon set element.
        svg.appendChild(iconNode.cloneNode(true));
        return this._setSvgAttributes(svg);
    };
    /**
     * Creates a DOM element from the given SVG string.
     * @param {?} str
     * @return {?}
     */
    MdIconRegistry.prototype._svgElementFromString = function (str) {
        // TODO: Is there a better way than innerHTML? Renderer doesn't appear to have a method for
        // creating an element from an HTML string.
        var /** @type {?} */ div = document.createElement('DIV');
        div.innerHTML = str;
        var /** @type {?} */ svg = (div.querySelector('svg'));
        if (!svg) {
            throw Error('<svg> tag not found');
        }
        return svg;
    };
    /**
     * Converts an element into an SVG node by cloning all of its children.
     * @param {?} element
     * @return {?}
     */
    MdIconRegistry.prototype._toSvgElement = function (element) {
        var /** @type {?} */ svg = this._svgElementFromString('<svg></svg>');
        for (var /** @type {?} */ i = 0; i < element.childNodes.length; i++) {
            if (element.childNodes[i].nodeType === Node.ELEMENT_NODE) {
                svg.appendChild(element.childNodes[i].cloneNode(true));
            }
        }
        return svg;
    };
    /**
     * Sets the default attributes for an SVG element to be used as an icon.
     * @param {?} svg
     * @return {?}
     */
    MdIconRegistry.prototype._setSvgAttributes = function (svg) {
        if (!svg.getAttribute('xmlns')) {
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
        svg.setAttribute('fit', '');
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('focusable', 'false'); // Disable IE11 default behavior to make SVGs focusable.
        return svg;
    };
    /**
     * Returns an Observable which produces the string contents of the given URL. Results may be
     * cached, so future calls with the same URL may not cause another HTTP request.
     * @param {?} safeUrl
     * @return {?}
     */
    MdIconRegistry.prototype._fetchUrl = function (safeUrl) {
        var _this = this;
        if (!this._http) {
            throw getMdIconNoHttpProviderError();
        }
        var /** @type {?} */ url = this._sanitizer.sanitize(_angular_core.SecurityContext.RESOURCE_URL, safeUrl);
        if (!url) {
            throw getMdIconFailedToSanitizeError(safeUrl);
        }
        // Store in-progress fetches to avoid sending a duplicate request for a URL when there is
        // already a request in progress for that URL. It's necessary to call share() on the
        // Observable returned by http.get() so that multiple subscribers don't cause multiple XHRs.
        var /** @type {?} */ inProgressFetch = this._inProgressUrlFetches.get(url);
        if (inProgressFetch) {
            return inProgressFetch;
        }
        // TODO(jelbourn): for some reason, the `finally` operator "loses" the generic type on the
        // Observable. Figure out why and fix it.
        var /** @type {?} */ req = _angular_cdk.RxChain.from(this._http.get(url))
            .call(_angular_cdk.map, function (response) { return response.text(); })
            .call(_angular_cdk.finallyOperator, function () { return _this._inProgressUrlFetches.delete(url); })
            .call(_angular_cdk.share)
            .result();
        this._inProgressUrlFetches.set(url, req);
        return req;
    };
    return MdIconRegistry;
}());
MdIconRegistry.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
MdIconRegistry.ctorParameters = function () { return [
    { type: _angular_http.Http, decorators: [{ type: _angular_core.Optional },] },
    { type: _angular_platformBrowser.DomSanitizer, },
]; };
/**
 * @param {?} parentRegistry
 * @param {?} http
 * @param {?} sanitizer
 * @return {?}
 */
function ICON_REGISTRY_PROVIDER_FACTORY(parentRegistry, http, sanitizer) {
    return parentRegistry || new MdIconRegistry(http, sanitizer);
}
var ICON_REGISTRY_PROVIDER = {
    // If there is already an MdIconRegistry available, use that. Otherwise, provide a new one.
    provide: MdIconRegistry,
    deps: [[new _angular_core.Optional(), new _angular_core.SkipSelf(), MdIconRegistry], [new _angular_core.Optional(), _angular_http.Http], _angular_platformBrowser.DomSanitizer],
    useFactory: ICON_REGISTRY_PROVIDER_FACTORY
};
/**
 * Clones an SVGElement while preserving type information.
 * @param {?} svg
 * @return {?}
 */
function cloneSvg(svg) {
    return (svg.cloneNode(true));
}
/**
 * Returns the cache key to use for an icon namespace and name.
 * @param {?} namespace
 * @param {?} name
 * @return {?}
 */
function iconKey(namespace, name) {
    return namespace + ':' + name;
}
/**
 * \@docs-private
 */
var MdIconBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdIconBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdIconBase;
}());
var _MdIconMixinBase = mixinColor(MdIconBase);
/**
 * Component to display an icon. It can be used in the following ways:
 * - Specify the svgSrc input to load an SVG icon from a URL. The SVG content is directly inlined
 *   as a child of the <md-icon> component, so that CSS styles can easily be applied to it.
 *   The URL is loaded via an XMLHttpRequest, so it must be on the same domain as the page or its
 *   server must be configured to allow cross-domain requests.
 *   Example:
 *     <md-icon svgSrc="assets/arrow.svg"></md-icon>
 *
 * - Specify the svgIcon input to load an SVG icon from a URL previously registered with the
 *   addSvgIcon, addSvgIconInNamespace, addSvgIconSet, or addSvgIconSetInNamespace methods of
 *   MdIconRegistry. If the svgIcon value contains a colon it is assumed to be in the format
 *   "[namespace]:[name]", if not the value will be the name of an icon in the default namespace.
 *   Examples:
 *     <md-icon svgIcon="left-arrow"></md-icon>
 *     <md-icon svgIcon="animals:cat"></md-icon>
 *
 * - Use a font ligature as an icon by putting the ligature text in the content of the <md-icon>
 *   component. By default the Material icons font is used as described at
 *   http://google.github.io/material-design-icons/#icon-font-for-the-web. You can specify an
 *   alternate font by setting the fontSet input to either the CSS class to apply to use the
 *   desired font, or to an alias previously registered with MdIconRegistry.registerFontClassAlias.
 *   Examples:
 *     <md-icon>home</md-icon>
 *     <md-icon fontSet="myfont">sun</md-icon>
 *
 * - Specify a font glyph to be included via CSS rules by setting the fontSet input to specify the
 *   font, and the fontIcon input to specify the icon. Typically the fontIcon will specify a
 *   CSS class which causes the glyph to be displayed via a :before selector, as in
 *   https://fortawesome.github.io/Font-Awesome/examples/
 *   Example:
 *     <md-icon fontSet="fa" fontIcon="alarm"></md-icon>
 */
var MdIcon = (function (_super) {
    __extends(MdIcon, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _mdIconRegistry
     * @param {?} ariaHidden
     */
    function MdIcon(renderer, elementRef, _mdIconRegistry, ariaHidden) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._mdIconRegistry = _mdIconRegistry;
        // If the user has not explicitly set aria-hidden, mark the icon as hidden, as this is
        // the right thing to do for the majority of icon use-cases.
        if (!ariaHidden) {
            renderer.setAttribute(elementRef.nativeElement, 'aria-hidden', 'true');
        }
        return _this;
    }
    /**
     * Splits an svgIcon binding value into its icon set and icon name components.
     * Returns a 2-element array of [(icon set), (icon name)].
     * The separator for the two fields is ':'. If there is no separator, an empty
     * string is returned for the icon set and the entire value is returned for
     * the icon name. If the argument is falsy, returns an array of two empty strings.
     * Throws an error if the name contains two or more ':' separators.
     * Examples:
     *   'social:cake' -> ['social', 'cake']
     *   'penguin' -> ['', 'penguin']
     *   null -> ['', '']
     *   'a:b:c' -> (throws Error)
     * @param {?} iconName
     * @return {?}
     */
    MdIcon.prototype._splitIconName = function (iconName) {
        if (!iconName) {
            return ['', ''];
        }
        var /** @type {?} */ parts = iconName.split(':');
        switch (parts.length) {
            case 1:
                // Use default namespace.
                return ['', parts[0]];
            case 2:
                return (parts);
            default:
                throw Error("Invalid icon name: \"" + iconName + "\"");
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    MdIcon.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var /** @type {?} */ changedInputs = Object.keys(changes);
        // Only update the inline SVG icon if the inputs changed, to avoid unnecessary DOM operations.
        if (changedInputs.indexOf('svgIcon') != -1 || changedInputs.indexOf('svgSrc') != -1) {
            if (this.svgIcon) {
                var _a = this._splitIconName(this.svgIcon), namespace = _a[0], iconName = _a[1];
                _angular_cdk.first.call(this._mdIconRegistry.getNamedSvgIcon(iconName, namespace)).subscribe(function (svg) { return _this._setSvgElement(svg); }, function (err) { return console.log("Error retrieving icon: " + err.message); });
            }
        }
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
    };
    /**
     * @return {?}
     */
    MdIcon.prototype.ngOnInit = function () {
        // Update font classes because ngOnChanges won't be called if none of the inputs are present,
        // e.g. <md-icon>arrow</md-icon>. In this case we need to add a CSS class for the default font.
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
    };
    /**
     * @return {?}
     */
    MdIcon.prototype._usingFontIcon = function () {
        return !this.svgIcon;
    };
    /**
     * @param {?} svg
     * @return {?}
     */
    MdIcon.prototype._setSvgElement = function (svg) {
        var /** @type {?} */ layoutElement = this._elementRef.nativeElement;
        // Remove existing child nodes and add the new SVG element.
        // We would use renderer.detachView(Array.from(layoutElement.childNodes)) here,
        // but it fails in IE11: https://github.com/angular/angular/issues/6327
        layoutElement.innerHTML = '';
        this._renderer.appendChild(layoutElement, svg);
    };
    /**
     * @return {?}
     */
    MdIcon.prototype._updateFontIconClasses = function () {
        if (!this._usingFontIcon()) {
            return;
        }
        var /** @type {?} */ elem = this._elementRef.nativeElement;
        var /** @type {?} */ fontSetClass = this.fontSet ?
            this._mdIconRegistry.classNameForFontAlias(this.fontSet) :
            this._mdIconRegistry.getDefaultFontSetClass();
        if (fontSetClass != this._previousFontSetClass) {
            if (this._previousFontSetClass) {
                this._renderer.removeClass(elem, this._previousFontSetClass);
            }
            if (fontSetClass) {
                this._renderer.addClass(elem, fontSetClass);
            }
            this._previousFontSetClass = fontSetClass;
        }
        if (this.fontIcon != this._previousFontIconClass) {
            if (this._previousFontIconClass) {
                this._renderer.removeClass(elem, this._previousFontIconClass);
            }
            if (this.fontIcon) {
                this._renderer.addClass(elem, this.fontIcon);
            }
            this._previousFontIconClass = this.fontIcon;
        }
    };
    return MdIcon;
}(_MdIconMixinBase));
MdIcon.decorators = [
    { type: _angular_core.Component, args: [{ template: '<ng-content></ng-content>',
                selector: 'md-icon, mat-icon',
                styles: [".mat-icon{background-repeat:no-repeat;display:inline-block;fill:currentColor;height:24px;width:24px}"],
                inputs: ['color'],
                host: {
                    'role': 'img',
                    'class': 'mat-icon',
                },
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdIcon.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
    { type: MdIconRegistry, },
    { type: undefined, decorators: [{ type: _angular_core.Attribute, args: ['aria-hidden',] },] },
]; };
MdIcon.propDecorators = {
    'svgIcon': [{ type: _angular_core.Input },],
    'fontSet': [{ type: _angular_core.Input },],
    'fontIcon': [{ type: _angular_core.Input },],
};
var MdIconModule = (function () {
    function MdIconModule() {
    }
    return MdIconModule;
}());
MdIconModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [MdCommonModule],
                exports: [MdIcon, MdCommonModule],
                declarations: [MdIcon],
                providers: [ICON_REGISTRY_PROVIDER],
            },] },
];
/**
 * @nocollapse
 */
MdIconModule.ctorParameters = function () { return []; };
/**
 * A single degree in radians.
 */
var DEGREE_IN_RADIANS = Math.PI / 180;
/**
 * Duration of the indeterminate animation.
 */
var DURATION_INDETERMINATE = 667;
/**
 * Duration of the indeterminate animation.
 */
var DURATION_DETERMINATE = 225;
/**
 * Start animation value of the indeterminate animation
 */
var startIndeterminate = 3;
/**
 * End animation value of the indeterminate animation
 */
var endIndeterminate = 80;
/**
 * Maximum angle for the arc. The angle can't be exactly 360, because the arc becomes hidden.
 */
var MAX_ANGLE = 359.99 / 100;
/**
 * Whether the user's browser supports requestAnimationFrame.
 */
var HAS_RAF = typeof requestAnimationFrame !== 'undefined';
/**
 * Default stroke width as a percentage of the viewBox.
 */
var PROGRESS_SPINNER_STROKE_WIDTH = 10;
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdProgressSpinnerCssMatStyler = (function () {
    function MdProgressSpinnerCssMatStyler() {
    }
    return MdProgressSpinnerCssMatStyler;
}());
MdProgressSpinnerCssMatStyler.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-progress-spinner, mat-progress-spinner',
                host: { 'class': 'mat-progress-spinner' }
            },] },
];
/**
 * @nocollapse
 */
MdProgressSpinnerCssMatStyler.ctorParameters = function () { return []; };
/**
 * \@docs-private
 */
var MdProgressSpinnerBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdProgressSpinnerBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdProgressSpinnerBase;
}());
var _MdProgressSpinnerMixinBase = mixinColor(MdProgressSpinnerBase, 'primary');
/**
 * <md-progress-spinner> component.
 */
var MdProgressSpinner = (function (_super) {
    __extends(MdProgressSpinner, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _ngZone
     */
    function MdProgressSpinner(renderer, elementRef, _ngZone) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._ngZone = _ngZone;
        /**
         * The id of the last requested animation.
         */
        _this._lastAnimationId = 0;
        _this._mode = 'determinate';
        /**
         * Stroke width of the progress spinner. By default uses 10px as stroke width.
         */
        _this.strokeWidth = PROGRESS_SPINNER_STROKE_WIDTH;
        return _this;
    }
    Object.defineProperty(MdProgressSpinner.prototype, "_ariaValueMin", {
        /**
         * Values for aria max and min are only defined as numbers when in a determinate mode.  We do this
         * because voiceover does not report the progress indicator as indeterminate if the aria min
         * and/or max value are number values.
         * @return {?}
         */
        get: function () {
            return this.mode == 'determinate' ? 0 : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressSpinner.prototype, "_ariaValueMax", {
        /**
         * @return {?}
         */
        get: function () {
            return this.mode == 'determinate' ? 100 : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressSpinner.prototype, "interdeterminateInterval", {
        /**
         * \@docs-private
         * @return {?}
         */
        get: function () {
            return this._interdeterminateInterval;
        },
        /**
         * \@docs-private
         * @param {?} interval
         * @return {?}
         */
        set: function (interval) {
            if (this._interdeterminateInterval) {
                clearInterval(this._interdeterminateInterval);
            }
            this._interdeterminateInterval = interval;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clean up any animations that were running.
     * @return {?}
     */
    MdProgressSpinner.prototype.ngOnDestroy = function () {
        this._cleanupIndeterminateAnimation();
    };
    Object.defineProperty(MdProgressSpinner.prototype, "value", {
        /**
         * Value of the progress circle. It is bound to the host as the attribute aria-valuenow.
         * @return {?}
         */
        get: function () {
            if (this.mode == 'determinate') {
                return this._value;
            }
            return 0;
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            if (v != null && this.mode == 'determinate') {
                var /** @type {?} */ newValue = clamp(v);
                this._animateCircle(this.value || 0, newValue);
                this._value = newValue;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressSpinner.prototype, "mode", {
        /**
         * Mode of the progress circle
         *
         * Input must be one of the values from ProgressMode, defaults to 'determinate'.
         * mode is bound to the host as the attribute host.
         * @return {?}
         */
        get: function () {
            return this._mode;
        },
        /**
         * @param {?} mode
         * @return {?}
         */
        set: function (mode) {
            if (mode !== this._mode) {
                if (mode === 'indeterminate') {
                    this._startIndeterminateAnimation();
                }
                else {
                    this._cleanupIndeterminateAnimation();
                    this._animateCircle(0, this._value);
                }
                this._mode = mode;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Animates the circle from one percentage value to another.
     *
     * @param {?} animateFrom The percentage of the circle filled starting the animation.
     * @param {?} animateTo The percentage of the circle filled ending the animation.
     * @param {?=} ease The easing function to manage the pace of change in the animation.
     * @param {?=} duration The length of time to show the animation, in milliseconds.
     * @param {?=} rotation The starting angle of the circle fill, with 0° represented at the top center
     *    of the circle.
     * @return {?}
     */
    MdProgressSpinner.prototype._animateCircle = function (animateFrom, animateTo, ease, duration, rotation) {
        var _this = this;
        if (ease === void 0) { ease = linearEase; }
        if (duration === void 0) { duration = DURATION_DETERMINATE; }
        if (rotation === void 0) { rotation = 0; }
        var /** @type {?} */ id = ++this._lastAnimationId;
        var /** @type {?} */ startTime = Date.now();
        var /** @type {?} */ changeInValue = animateTo - animateFrom;
        // No need to animate it if the values are the same
        if (animateTo === animateFrom) {
            this._renderArc(animateTo, rotation);
        }
        else {
            var /** @type {?} */ animation_1 = function () {
                // If there is no requestAnimationFrame, skip ahead to the end of the animation.
                var /** @type {?} */ elapsedTime = HAS_RAF ?
                    Math.max(0, Math.min(Date.now() - startTime, duration)) :
                    duration;
                _this._renderArc(ease(elapsedTime, animateFrom, changeInValue, duration), rotation);
                // Prevent overlapping animations by checking if a new animation has been called for and
                // if the animation has lasted longer than the animation duration.
                if (id === _this._lastAnimationId && elapsedTime < duration) {
                    requestAnimationFrame(animation_1);
                }
            };
            // Run the animation outside of Angular's zone, in order to avoid
            // hitting ZoneJS and change detection on each frame.
            this._ngZone.runOutsideAngular(animation_1);
        }
    };
    /**
     * Starts the indeterminate animation interval, if it is not already running.
     * @return {?}
     */
    MdProgressSpinner.prototype._startIndeterminateAnimation = function () {
        var _this = this;
        var /** @type {?} */ rotationStartPoint = 0;
        var /** @type {?} */ start = startIndeterminate;
        var /** @type {?} */ end = endIndeterminate;
        var /** @type {?} */ duration = DURATION_INDETERMINATE;
        var /** @type {?} */ animate$$1 = function () {
            _this._animateCircle(start, end, materialEase, duration, rotationStartPoint);
            // Prevent rotation from reaching Number.MAX_SAFE_INTEGER.
            rotationStartPoint = (rotationStartPoint + end) % 100;
            var /** @type {?} */ temp = start;
            start = -end;
            end = -temp;
        };
        if (!this.interdeterminateInterval) {
            this._ngZone.runOutsideAngular(function () {
                _this.interdeterminateInterval = setInterval(animate$$1, duration + 50, 0, false);
                animate$$1();
            });
        }
    };
    /**
     * Removes interval, ending the animation.
     * @return {?}
     */
    MdProgressSpinner.prototype._cleanupIndeterminateAnimation = function () {
        this.interdeterminateInterval = null;
    };
    /**
     * Renders the arc onto the SVG element. Proxies `getArc` while setting the proper
     * DOM attribute on the `<path>`.
     * @param {?} currentValue
     * @param {?=} rotation
     * @return {?}
     */
    MdProgressSpinner.prototype._renderArc = function (currentValue, rotation) {
        if (rotation === void 0) { rotation = 0; }
        if (this._path) {
            var /** @type {?} */ svgArc = getSvgArc(currentValue, rotation, this.strokeWidth);
            this._renderer.setAttribute(this._path.nativeElement, 'd', svgArc);
        }
    };
    return MdProgressSpinner;
}(_MdProgressSpinnerMixinBase));
MdProgressSpinner.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-progress-spinner, mat-progress-spinner',
                host: {
                    'role': 'progressbar',
                    '[attr.aria-valuemin]': '_ariaValueMin',
                    '[attr.aria-valuemax]': '_ariaValueMax'
                },
                inputs: ['color'],
                template: "<svg viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\"><path #path [style.strokeWidth]=\"strokeWidth\"></path></svg>",
                styles: [":host{display:block;height:100px;width:100px;overflow:hidden}:host svg{height:100%;width:100%;transform-origin:center}:host path{fill:transparent;transition:stroke .3s cubic-bezier(.35,0,.25,1)}:host[mode=indeterminate] svg{animation-duration:5.25s,2.887s;animation-name:mat-progress-spinner-sporadic-rotate,mat-progress-spinner-linear-rotate;animation-timing-function:cubic-bezier(.35,0,.25,1),linear;animation-iteration-count:infinite;transition:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-sporadic-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}"],
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdProgressSpinner.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.NgZone, },
]; };
MdProgressSpinner.propDecorators = {
    '_path': [{ type: _angular_core.ViewChild, args: ['path',] },],
    'strokeWidth': [{ type: _angular_core.Input },],
    'value': [{ type: _angular_core.Input }, { type: _angular_core.HostBinding, args: ['attr.aria-valuenow',] },],
    'mode': [{ type: _angular_core.HostBinding, args: ['attr.mode',] }, { type: _angular_core.Input },],
};
/**
 * <md-spinner> component.
 *
 * This is a component definition to be used as a convenience reference to create an
 * indeterminate <md-progress-spinner> instance.
 */
var MdSpinner = (function (_super) {
    __extends(MdSpinner, _super);
    /**
     * @param {?} elementRef
     * @param {?} ngZone
     * @param {?} renderer
     */
    function MdSpinner(elementRef, ngZone, renderer) {
        var _this = _super.call(this, renderer, elementRef, ngZone) || this;
        _this.mode = 'indeterminate';
        return _this;
    }
    return MdSpinner;
}(MdProgressSpinner));
MdSpinner.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-spinner, mat-spinner',
                host: {
                    'role': 'progressbar',
                    'mode': 'indeterminate',
                    'class': 'mat-spinner',
                },
                inputs: ['color'],
                template: "<svg viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\"><path #path [style.strokeWidth]=\"strokeWidth\"></path></svg>",
                styles: [":host{display:block;height:100px;width:100px;overflow:hidden}:host svg{height:100%;width:100%;transform-origin:center}:host path{fill:transparent;transition:stroke .3s cubic-bezier(.35,0,.25,1)}:host[mode=indeterminate] svg{animation-duration:5.25s,2.887s;animation-name:mat-progress-spinner-sporadic-rotate,mat-progress-spinner-linear-rotate;animation-timing-function:cubic-bezier(.35,0,.25,1),linear;animation-iteration-count:infinite;transition:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-sporadic-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}"],
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdSpinner.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.NgZone, },
    { type: _angular_core.Renderer2, },
]; };
/**
 * Clamps a value to be between 0 and 100.
 * @param {?} v
 * @return {?}
 */
function clamp(v) {
    return Math.max(0, Math.min(100, v));
}
/**
 * Converts Polar coordinates to Cartesian.
 * @param {?} radius
 * @param {?} pathRadius
 * @param {?} angleInDegrees
 * @return {?}
 */
function polarToCartesian(radius, pathRadius, angleInDegrees) {
    var /** @type {?} */ angleInRadians = (angleInDegrees - 90) * DEGREE_IN_RADIANS;
    return (radius + (pathRadius * Math.cos(angleInRadians))) +
        ',' + (radius + (pathRadius * Math.sin(angleInRadians)));
}
/**
 * Easing function for linear animation.
 * @param {?} currentTime
 * @param {?} startValue
 * @param {?} changeInValue
 * @param {?} duration
 * @return {?}
 */
function linearEase(currentTime, startValue, changeInValue, duration) {
    return changeInValue * currentTime / duration + startValue;
}
/**
 * Easing function to match material design indeterminate animation.
 * @param {?} currentTime
 * @param {?} startValue
 * @param {?} changeInValue
 * @param {?} duration
 * @return {?}
 */
function materialEase(currentTime, startValue, changeInValue, duration) {
    var /** @type {?} */ time = currentTime / duration;
    var /** @type {?} */ timeCubed = Math.pow(time, 3);
    var /** @type {?} */ timeQuad = Math.pow(time, 4);
    var /** @type {?} */ timeQuint = Math.pow(time, 5);
    return startValue + changeInValue * ((6 * timeQuint) + (-15 * timeQuad) + (10 * timeCubed));
}
/**
 * Determines the path value to define the arc.  Converting percentage values to to polar
 * coordinates on the circle, and then to cartesian coordinates in the viewport.
 *
 * @param {?} currentValue The current percentage value of the progress circle, the percentage of the
 *    circle to fill.
 * @param {?} rotation The starting point of the circle with 0 being the 0 degree point.
 * @param {?} strokeWidth Stroke width of the progress spinner arc.
 * @return {?} A string for an SVG path representing a circle filled from the starting point to the
 *    percentage value provided.
 */
function getSvgArc(currentValue, rotation, strokeWidth) {
    var /** @type {?} */ startPoint = rotation || 0;
    var /** @type {?} */ radius = 50;
    var /** @type {?} */ pathRadius = radius - strokeWidth;
    var /** @type {?} */ startAngle = startPoint * MAX_ANGLE;
    var /** @type {?} */ endAngle = currentValue * MAX_ANGLE;
    var /** @type {?} */ start = polarToCartesian(radius, pathRadius, startAngle);
    var /** @type {?} */ end = polarToCartesian(radius, pathRadius, endAngle + startAngle);
    var /** @type {?} */ arcSweep = endAngle < 0 ? 0 : 1;
    var /** @type {?} */ largeArcFlag;
    if (endAngle < 0) {
        largeArcFlag = endAngle >= -180 ? 0 : 1;
    }
    else {
        largeArcFlag = endAngle <= 180 ? 0 : 1;
    }
    return "M" + start + "A" + pathRadius + "," + pathRadius + " 0 " + largeArcFlag + "," + arcSweep + " " + end;
}
var MdProgressSpinnerModule = (function () {
    function MdProgressSpinnerModule() {
    }
    return MdProgressSpinnerModule;
}());
MdProgressSpinnerModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [MdCommonModule],
                exports: [
                    MdProgressSpinner,
                    MdSpinner,
                    MdCommonModule,
                    MdProgressSpinnerCssMatStyler
                ],
                declarations: [
                    MdProgressSpinner,
                    MdSpinner,
                    MdProgressSpinnerCssMatStyler
                ],
            },] },
];
/**
 * @nocollapse
 */
MdProgressSpinnerModule.ctorParameters = function () { return []; };
/**
 * <md-progress-bar> component.
 */
var MdProgressBar = (function () {
    function MdProgressBar() {
        /**
         * Color of the progress bar.
         */
        this.color = 'primary';
        this._value = 0;
        this._bufferValue = 0;
        /**
         * Mode of the progress bar.
         *
         * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
         * 'determinate'.
         * Mirrored to mode attribute.
         */
        this.mode = 'determinate';
    }
    Object.defineProperty(MdProgressBar.prototype, "value", {
        /**
         * Value of the progressbar. Defaults to zero. Mirrored to aria-valuenow.
         * @return {?}
         */
        get: function () { return this._value; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._value = clamp$1(v || 0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressBar.prototype, "bufferValue", {
        /**
         * Buffer value of the progress bar. Defaults to zero.
         * @return {?}
         */
        get: function () { return this._bufferValue; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._bufferValue = clamp$1(v || 0); },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the current transform value for the progress bar's primary indicator.
     * @return {?}
     */
    MdProgressBar.prototype._primaryTransform = function () {
        var /** @type {?} */ scale = this.value / 100;
        return { transform: "scaleX(" + scale + ")" };
    };
    /**
     * Gets the current transform value for the progress bar's buffer indicator.  Only used if the
     * progress mode is set to buffer, otherwise returns an undefined, causing no transformation.
     * @return {?}
     */
    MdProgressBar.prototype._bufferTransform = function () {
        if (this.mode == 'buffer') {
            var /** @type {?} */ scale = this.bufferValue / 100;
            return { transform: "scaleX(" + scale + ")" };
        }
    };
    return MdProgressBar;
}());
MdProgressBar.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-progress-bar, mat-progress-bar',
                host: {
                    'role': 'progressbar',
                    'aria-valuemin': '0',
                    'aria-valuemax': '100',
                    '[class.mat-primary]': 'color == "primary"',
                    '[class.mat-accent]': 'color == "accent"',
                    '[class.mat-warn]': 'color == "warn"',
                    'class': 'mat-progress-bar',
                },
                template: "<div class=\"mat-progress-bar-background mat-progress-bar-element\"></div><div class=\"mat-progress-bar-buffer mat-progress-bar-element\" [ngStyle]=\"_bufferTransform()\"></div><div class=\"mat-progress-bar-primary mat-progress-bar-fill mat-progress-bar-element\" [ngStyle]=\"_primaryTransform()\"></div><div class=\"mat-progress-bar-secondary mat-progress-bar-fill mat-progress-bar-element\"></div>",
                styles: [":host{display:block;height:5px;overflow:hidden;position:relative;transform:translateZ(0);transition:opacity 250ms linear;width:100%}:host .mat-progress-bar-element,:host .mat-progress-bar-fill::after{height:100%;position:absolute;width:100%}:host .mat-progress-bar-background{background-repeat:repeat-x;background-size:10px 4px;display:none}:host .mat-progress-bar-buffer{transform-origin:top left;transition:transform 250ms ease,stroke .3s cubic-bezier(.35,0,.25,1)}:host .mat-progress-bar-secondary{display:none}:host .mat-progress-bar-fill{animation:none;transform-origin:top left;transition:transform 250ms ease,stroke .3s cubic-bezier(.35,0,.25,1)}:host .mat-progress-bar-fill::after{animation:none;content:'';display:inline-block;left:0}:host[mode=query]{transform:rotateZ(180deg)}:host[mode=indeterminate] .mat-progress-bar-fill,:host[mode=query] .mat-progress-bar-fill{transition:none}:host[mode=indeterminate] .mat-progress-bar-primary,:host[mode=query] .mat-progress-bar-primary{animation:mat-progress-bar-primary-indeterminate-translate 2s infinite linear;left:-145.166611%}:host[mode=indeterminate] .mat-progress-bar-primary.mat-progress-bar-fill::after,:host[mode=query] .mat-progress-bar-primary.mat-progress-bar-fill::after{animation:mat-progress-bar-primary-indeterminate-scale 2s infinite linear}:host[mode=indeterminate] .mat-progress-bar-secondary,:host[mode=query] .mat-progress-bar-secondary{animation:mat-progress-bar-secondary-indeterminate-translate 2s infinite linear;left:-54.888891%;display:block}:host[mode=indeterminate] .mat-progress-bar-secondary.mat-progress-bar-fill::after,:host[mode=query] .mat-progress-bar-secondary.mat-progress-bar-fill::after{animation:mat-progress-bar-secondary-indeterminate-scale 2s infinite linear}:host[mode=buffer] .mat-progress-bar-background{animation:mat-progress-bar-background-scroll 250ms infinite linear;display:block}:host-context([dir=rtl]){transform:rotateY(180deg)}@keyframes mat-progress-bar-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(.5,0,.70173,.49582);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);transform:translateX(83.67142%)}100%{transform:translateX(200.61106%)}}@keyframes mat-progress-bar-primary-indeterminate-scale{0%{transform:scaleX(.08)}36.65%{animation-timing-function:cubic-bezier(.33473,.12482,.78584,1);transform:scaleX(.08)}69.15%{animation-timing-function:cubic-bezier(.06,.11,.6,1);transform:scaleX(.66148)}100%{transform:scaleX(.08)}}@keyframes mat-progress-bar-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(.15,0,.51506,.40969);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(.31033,.28406,.8,.73371);transform:translateX(37.65191%)}48.35%{animation-timing-function:cubic-bezier(.4,.62704,.6,.90203);transform:translateX(84.38617%)}100%{transform:translateX(160.27778%)}}@keyframes mat-progress-bar-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(.15,0,.51506,.40969);transform:scaleX(.08)}19.15%{animation-timing-function:cubic-bezier(.31033,.28406,.8,.73371);transform:scaleX(.4571)}44.15%{animation-timing-function:cubic-bezier(.4,.62704,.6,.90203);transform:scaleX(.72796)}100%{transform:scaleX(.08)}}@keyframes mat-progress-bar-background-scroll{to{transform:translateX(-10px)}}"],
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdProgressBar.ctorParameters = function () { return []; };
MdProgressBar.propDecorators = {
    'color': [{ type: _angular_core.Input },],
    'value': [{ type: _angular_core.Input }, { type: _angular_core.HostBinding, args: ['attr.aria-valuenow',] },],
    'bufferValue': [{ type: _angular_core.Input },],
    'mode': [{ type: _angular_core.Input }, { type: _angular_core.HostBinding, args: ['attr.mode',] },],
};
/**
 * Clamps a value to be between two numbers, by default 0 and 100.
 * @param {?} v
 * @param {?=} min
 * @param {?=} max
 * @return {?}
 */
function clamp$1(v, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 100; }
    return Math.max(min, Math.min(max, v));
}
var MdProgressBarModule = (function () {
    function MdProgressBarModule() {
    }
    return MdProgressBarModule;
}());
MdProgressBarModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_common.CommonModule, MdCommonModule],
                exports: [MdProgressBar, MdCommonModule],
                declarations: [MdProgressBar],
            },] },
];
/**
 * @nocollapse
 */
MdProgressBarModule.ctorParameters = function () { return []; };
/**
 * \@docs-private
 * @return {?}
 */
function getMdInputContainerPlaceholderConflictError() {
    return Error('Placeholder attribute and child element were both specified.');
}
/**
 * \@docs-private
 * @param {?} type
 * @return {?}
 */
function getMdInputContainerUnsupportedTypeError(type) {
    return Error("Input type \"" + type + "\" isn't supported by md-input-container.");
}
/**
 * \@docs-private
 * @param {?} align
 * @return {?}
 */
function getMdInputContainerDuplicatedHintError(align) {
    return Error("A hint was already declared for 'align=\"" + align + "\"'.");
}
/**
 * \@docs-private
 * @return {?}
 */
function getMdInputContainerMissingMdInputError() {
    return Error('md-input-container must contain an mdInput directive. ' +
        'Did you forget to add mdInput to the native input or textarea element?');
}
// Invalid input type. Using one of these will throw an MdInputContainerUnsupportedTypeError.
var MD_INPUT_INVALID_TYPES = [
    'button',
    'checkbox',
    'color',
    'file',
    'hidden',
    'image',
    'radio',
    'range',
    'reset',
    'submit'
];
var nextUniqueId$1 = 0;
/**
 * The placeholder directive. The content can declare this to implement more
 * complex placeholders.
 */
var MdPlaceholder = (function () {
    function MdPlaceholder() {
    }
    return MdPlaceholder;
}());
MdPlaceholder.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-placeholder, mat-placeholder'
            },] },
];
/**
 * @nocollapse
 */
MdPlaceholder.ctorParameters = function () { return []; };
/**
 * Hint text to be shown underneath the input.
 */
var MdHint = (function () {
    function MdHint() {
        /**
         * Whether to align the hint label at the start or end of the line.
         */
        this.align = 'start';
        /**
         * Unique ID for the hint. Used for the aria-describedby on the input.
         */
        this.id = "md-input-hint-" + nextUniqueId$1++;
    }
    return MdHint;
}());
MdHint.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-hint, mat-hint',
                host: {
                    'class': 'mat-hint',
                    '[class.mat-right]': 'align == "end"',
                    '[attr.id]': 'id',
                }
            },] },
];
/**
 * @nocollapse
 */
MdHint.ctorParameters = function () { return []; };
MdHint.propDecorators = {
    'align': [{ type: _angular_core.Input },],
    'id': [{ type: _angular_core.Input },],
};
/**
 * Single error message to be shown underneath the input.
 */
var MdErrorDirective = (function () {
    function MdErrorDirective() {
    }
    return MdErrorDirective;
}());
MdErrorDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-error, mat-error',
                host: {
                    'class': 'mat-input-error'
                }
            },] },
];
/**
 * @nocollapse
 */
MdErrorDirective.ctorParameters = function () { return []; };
/**
 * Prefix to be placed the the front of the input.
 */
var MdPrefix = (function () {
    function MdPrefix() {
    }
    return MdPrefix;
}());
MdPrefix.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[mdPrefix], [matPrefix], [md-prefix]'
            },] },
];
/**
 * @nocollapse
 */
MdPrefix.ctorParameters = function () { return []; };
/**
 * Suffix to be placed at the end of the input.
 */
var MdSuffix = (function () {
    function MdSuffix() {
    }
    return MdSuffix;
}());
MdSuffix.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[mdSuffix], [matSuffix], [md-suffix]'
            },] },
];
/**
 * @nocollapse
 */
MdSuffix.ctorParameters = function () { return []; };
/**
 * Marker for the input element that `MdInputContainer` is wrapping.
 */
var MdInputDirective = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} _platform
     * @param {?} _ngControl
     * @param {?} _parentForm
     * @param {?} _parentFormGroup
     * @param {?} errorOptions
     */
    function MdInputDirective(_elementRef, _renderer, _platform, _ngControl, _parentForm, _parentFormGroup, errorOptions) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._platform = _platform;
        this._ngControl = _ngControl;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        /**
         * Variables used as cache for getters and setters.
         */
        this._type = 'text';
        this._placeholder = '';
        this._disabled = false;
        this._required = false;
        /**
         * Whether the element is focused or not.
         */
        this.focused = false;
        /**
         * Emits an event when the placeholder changes so that the `md-input-container` can re-validate.
         */
        this._placeholderChange = new _angular_core.EventEmitter();
        this._neverEmptyInputTypes = [
            'date',
            'datetime',
            'datetime-local',
            'month',
            'time',
            'week'
        ].filter(function (t) { return _angular_cdk.getSupportedInputTypes().has(t); });
        // Force setter to be called in case id was not specified.
        this.id = this.id;
        this._errorOptions = errorOptions ? errorOptions : {};
        this.errorStateMatcher = this._errorOptions.errorStateMatcher || defaultErrorStateMatcher;
    }
    Object.defineProperty(MdInputDirective.prototype, "disabled", {
        /**
         * Whether the element is disabled.
         * @return {?}
         */
        get: function () {
            return this._ngControl ? this._ngControl.disabled : this._disabled;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = _angular_cdk.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "id", {
        /**
         * Unique id of the element.
         * @return {?}
         */
        get: function () { return this._id; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._id = value || this._uid; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "placeholder", {
        /**
         * Placeholder attribute of the element.
         * @return {?}
         */
        get: function () { return this._placeholder; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (this._placeholder !== value) {
                this._placeholder = value;
                this._placeholderChange.emit(this._placeholder);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "required", {
        /**
         * Whether the element is required.
         * @return {?}
         */
        get: function () { return this._required; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._required = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "type", {
        /**
         * Input type of the element.
         * @return {?}
         */
        get: function () { return this._type; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._type = value || 'text';
            this._validateType();
            // When using Angular inputs, developers are no longer able to set the properties on the native
            // input element. To ensure that bindings for `type` work, we need to sync the setter
            // with the native property. Textarea elements don't support the type property or attribute.
            if (!this._isTextarea() && _angular_cdk.getSupportedInputTypes().has(this._type)) {
                this._renderer.setProperty(this._elementRef.nativeElement, 'type', this._type);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "value", {
        /**
         * The input element's value.
         * @return {?}
         */
        get: function () { return this._elementRef.nativeElement.value; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._elementRef.nativeElement.value = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "empty", {
        /**
         * Whether the input is empty.
         * @return {?}
         */
        get: function () {
            return !this._isNeverEmpty() &&
                (this.value == null || this.value === '') &&
                // Check if the input contains bad input. If so, we know that it only appears empty because
                // the value failed to parse. From the user's perspective it is not empty.
                // TODO(mmalerba): Add e2e test for bad input case.
                !this._isBadInput();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "_uid", {
        /**
         * @return {?}
         */
        get: function () { return this._cachedUid = this._cachedUid || "md-input-" + nextUniqueId$1++; },
        enumerable: true,
        configurable: true
    });
    /**
     * Focuses the input element.
     * @return {?}
     */
    MdInputDirective.prototype.focus = function () { this._elementRef.nativeElement.focus(); };
    /**
     * @return {?}
     */
    MdInputDirective.prototype._onFocus = function () { this.focused = true; };
    /**
     * @return {?}
     */
    MdInputDirective.prototype._onBlur = function () { this.focused = false; };
    /**
     * @return {?}
     */
    MdInputDirective.prototype._onInput = function () {
        // This is a noop function and is used to let Angular know whenever the value changes.
        // Angular will run a new change detection each time the `input` event has been dispatched.
        // It's necessary that Angular recognizes the value change, because when floatingLabel
        // is set to false and Angular forms aren't used, the placeholder won't recognize the
        // value changes and will not disappear.
        // Listening to the input event wouldn't be necessary when the input is using the
        // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
    };
    /**
     * Whether the input is in an error state.
     * @return {?}
     */
    MdInputDirective.prototype._isErrorState = function () {
        var /** @type {?} */ control = this._ngControl;
        var /** @type {?} */ form = this._parentFormGroup || this._parentForm;
        return control && this.errorStateMatcher(/** @type {?} */ (control.control), form);
    };
    /**
     * Make sure the input is a supported type.
     * @return {?}
     */
    MdInputDirective.prototype._validateType = function () {
        if (MD_INPUT_INVALID_TYPES.indexOf(this._type) !== -1) {
            throw getMdInputContainerUnsupportedTypeError(this._type);
        }
    };
    /**
     * @return {?}
     */
    MdInputDirective.prototype._isNeverEmpty = function () { return this._neverEmptyInputTypes.indexOf(this._type) !== -1; };
    /**
     * @return {?}
     */
    MdInputDirective.prototype._isBadInput = function () {
        // The `validity` property won't be present on platform-server.
        var /** @type {?} */ validity = ((this._elementRef.nativeElement)).validity;
        return validity && validity.badInput;
    };
    /**
     * Determines if the component host is a textarea. If not recognizable it returns false.
     * @return {?}
     */
    MdInputDirective.prototype._isTextarea = function () {
        var /** @type {?} */ nativeElement = this._elementRef.nativeElement;
        // In Universal, we don't have access to `nodeName`, but the same can be achieved with `name`.
        // Note that this shouldn't be necessary once Angular switches to an API that resembles the
        // DOM closer.
        var /** @type {?} */ nodeName = this._platform.isBrowser ? nativeElement.nodeName : nativeElement.name;
        return nodeName ? nodeName.toLowerCase() === 'textarea' : false;
    };
    return MdInputDirective;
}());
MdInputDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: "input[mdInput], textarea[mdInput], input[matInput], textarea[matInput]",
                host: {
                    'class': 'mat-input-element',
                    // Native input properties that are overwritten by Angular inputs need to be synced with
                    // the native input element. Otherwise property bindings for those don't work.
                    '[id]': 'id',
                    '[placeholder]': 'placeholder',
                    '[disabled]': 'disabled',
                    '[required]': 'required',
                    '[attr.aria-describedby]': 'ariaDescribedby || null',
                    '[attr.aria-invalid]': '_isErrorState()',
                    '(blur)': '_onBlur()',
                    '(focus)': '_onFocus()',
                    '(input)': '_onInput()',
                }
            },] },
];
/**
 * @nocollapse
 */
MdInputDirective.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: _angular_cdk.Platform, },
    { type: _angular_forms.NgControl, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self },] },
    { type: _angular_forms.NgForm, decorators: [{ type: _angular_core.Optional },] },
    { type: _angular_forms.FormGroupDirective, decorators: [{ type: _angular_core.Optional },] },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MD_ERROR_GLOBAL_OPTIONS,] },] },
]; };
MdInputDirective.propDecorators = {
    'disabled': [{ type: _angular_core.Input },],
    'id': [{ type: _angular_core.Input },],
    'placeholder': [{ type: _angular_core.Input },],
    'required': [{ type: _angular_core.Input },],
    'type': [{ type: _angular_core.Input },],
    'errorStateMatcher': [{ type: _angular_core.Input },],
    '_placeholderChange': [{ type: _angular_core.Output },],
};
/**
 * Container for text inputs that applies Material Design styling and behavior.
 */
var MdInputContainer = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _changeDetectorRef
     * @param {?} placeholderOptions
     */
    function MdInputContainer(_elementRef, _changeDetectorRef, placeholderOptions) {
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Color of the input divider, based on the theme.
         */
        this.color = 'primary';
        /**
         * State of the md-hint and md-error animations.
         */
        this._subscriptAnimationState = '';
        this._hintLabel = '';
        // Unique id for the hint label.
        this._hintLabelId = "md-input-hint-" + nextUniqueId$1++;
        this._placeholderOptions = placeholderOptions ? placeholderOptions : {};
        this.floatPlaceholder = this._placeholderOptions.float || 'auto';
    }
    Object.defineProperty(MdInputContainer.prototype, "dividerColor", {
        /**
         * @deprecated Use color instead.
         * @return {?}
         */
        get: function () { return this.color; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this.color = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputContainer.prototype, "hideRequiredMarker", {
        /**
         * Whether the required marker should be hidden.
         * @return {?}
         */
        get: function () { return this._hideRequiredMarker; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._hideRequiredMarker = _angular_cdk.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputContainer.prototype, "_shouldAlwaysFloat", {
        /**
         * Whether the floating label should always float or not.
         * @return {?}
         */
        get: function () { return this._floatPlaceholder === 'always'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputContainer.prototype, "_canPlaceholderFloat", {
        /**
         * Whether the placeholder can float or not.
         * @return {?}
         */
        get: function () { return this._floatPlaceholder !== 'never'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputContainer.prototype, "hintLabel", {
        /**
         * Text for the input hint.
         * @return {?}
         */
        get: function () { return this._hintLabel; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._hintLabel = value;
            this._processHints();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputContainer.prototype, "floatPlaceholder", {
        /**
         * Whether the placeholder should always float, never float or float as the user types.
         * @return {?}
         */
        get: function () { return this._floatPlaceholder; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._floatPlaceholder = value || this._placeholderOptions.float || 'auto';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdInputContainer.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._validateInputChild();
        this._processHints();
        this._validatePlaceholders();
        // Re-validate when things change.
        this._hintChildren.changes.subscribe(function () { return _this._processHints(); });
        this._mdInputChild._placeholderChange.subscribe(function () { return _this._validatePlaceholders(); });
    };
    /**
     * @return {?}
     */
    MdInputContainer.prototype.ngAfterContentChecked = function () {
        this._validateInputChild();
    };
    /**
     * @return {?}
     */
    MdInputContainer.prototype.ngAfterViewInit = function () {
        // Avoid animations on load.
        this._subscriptAnimationState = 'enter';
        this._changeDetectorRef.detectChanges();
    };
    /**
     * Determines whether a class from the NgControl should be forwarded to the host element.
     * @param {?} prop
     * @return {?}
     */
    MdInputContainer.prototype._shouldForward = function (prop) {
        var /** @type {?} */ control = this._mdInputChild ? this._mdInputChild._ngControl : null;
        return control && ((control))[prop];
    };
    /**
     * Whether the input has a placeholder.
     * @return {?}
     */
    MdInputContainer.prototype._hasPlaceholder = function () { return !!(this._mdInputChild.placeholder || this._placeholderChild); };
    /**
     * Focuses the underlying input.
     * @return {?}
     */
    MdInputContainer.prototype._focusInput = function () { this._mdInputChild.focus(); };
    /**
     * Determines whether to display hints or errors.
     * @return {?}
     */
    MdInputContainer.prototype._getDisplayedMessages = function () {
        var /** @type {?} */ input = this._mdInputChild;
        return (this._errorChildren.length > 0 && input._isErrorState()) ? 'error' : 'hint';
    };
    /**
     * Ensure that there is only one placeholder (either `input` attribute or child element with the
     * `md-placeholder` attribute.
     * @return {?}
     */
    MdInputContainer.prototype._validatePlaceholders = function () {
        if (this._mdInputChild.placeholder && this._placeholderChild) {
            throw getMdInputContainerPlaceholderConflictError();
        }
    };
    /**
     * Does any extra processing that is required when handling the hints.
     * @return {?}
     */
    MdInputContainer.prototype._processHints = function () {
        this._validateHints();
        this._syncAriaDescribedby();
    };
    /**
     * Ensure that there is a maximum of one of each `<md-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     * @return {?}
     */
    MdInputContainer.prototype._validateHints = function () {
        var _this = this;
        if (this._hintChildren) {
            var /** @type {?} */ startHint_1;
            var /** @type {?} */ endHint_1;
            this._hintChildren.forEach(function (hint) {
                if (hint.align == 'start') {
                    if (startHint_1 || _this.hintLabel) {
                        throw getMdInputContainerDuplicatedHintError('start');
                    }
                    startHint_1 = hint;
                }
                else if (hint.align == 'end') {
                    if (endHint_1) {
                        throw getMdInputContainerDuplicatedHintError('end');
                    }
                    endHint_1 = hint;
                }
            });
        }
    };
    /**
     * Sets the child input's `aria-describedby` to a space-separated list of the ids
     * of the currently-specified hints, as well as a generated id for the hint label.
     * @return {?}
     */
    MdInputContainer.prototype._syncAriaDescribedby = function () {
        if (this._mdInputChild) {
            var /** @type {?} */ ids = [];
            var /** @type {?} */ startHint = this._hintChildren ?
                this._hintChildren.find(function (hint) { return hint.align === 'start'; }) : null;
            var /** @type {?} */ endHint = this._hintChildren ?
                this._hintChildren.find(function (hint) { return hint.align === 'end'; }) : null;
            if (startHint) {
                ids.push(startHint.id);
            }
            else if (this._hintLabel) {
                ids.push(this._hintLabelId);
            }
            if (endHint) {
                ids.push(endHint.id);
            }
            this._mdInputChild.ariaDescribedby = ids.join(' ');
        }
    };
    /**
     * Throws an error if the container's input child was removed.
     * @return {?}
     */
    MdInputContainer.prototype._validateInputChild = function () {
        if (!this._mdInputChild) {
            throw getMdInputContainerMissingMdInputError();
        }
    };
    return MdInputContainer;
}());
MdInputContainer.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-input-container, mat-input-container',
                template: "<div class=\"mat-input-wrapper\"><div class=\"mat-input-flex\"><div class=\"mat-input-prefix\" *ngIf=\"_prefixChildren.length\"><ng-content select=\"[mdPrefix], [matPrefix]\"></ng-content></div><div class=\"mat-input-infix\"><ng-content selector=\"input, textarea\"></ng-content><span class=\"mat-input-placeholder-wrapper\"><label class=\"mat-input-placeholder\" [attr.for]=\"_mdInputChild.id\" [class.mat-empty]=\"_mdInputChild.empty && !_shouldAlwaysFloat\" [class.mat-float]=\"_canPlaceholderFloat\" [class.mat-accent]=\"color == 'accent'\" [class.mat-warn]=\"color == 'warn'\" *ngIf=\"_hasPlaceholder()\"><ng-content select=\"md-placeholder, mat-placeholder\"></ng-content>{{_mdInputChild.placeholder}} <span class=\"mat-placeholder-required\" *ngIf=\"!hideRequiredMarker && _mdInputChild.required\">*</span></label></span></div><div class=\"mat-input-suffix\" *ngIf=\"_suffixChildren.length\"><ng-content select=\"[mdSuffix], [matSuffix]\"></ng-content></div></div><div class=\"mat-input-underline\" #underline [class.mat-disabled]=\"_mdInputChild.disabled\"><span class=\"mat-input-ripple\" [class.mat-accent]=\"color == 'accent'\" [class.mat-warn]=\"color == 'warn'\"></span></div><div class=\"mat-input-subscript-wrapper\" [ngSwitch]=\"_getDisplayedMessages()\"><div *ngSwitchCase=\"'error'\" [@transitionMessages]=\"_subscriptAnimationState\"><ng-content select=\"md-error, mat-error\"></ng-content></div><div class=\"mat-input-hint-wrapper\" *ngSwitchCase=\"'hint'\" [@transitionMessages]=\"_subscriptAnimationState\"><div *ngIf=\"hintLabel\" [id]=\"_hintLabelId\" class=\"mat-hint\">{{hintLabel}}</div><ng-content select=\"md-hint:not([align='end']), mat-hint:not([align='end'])\"></ng-content><div class=\"mat-input-hint-spacer\"></div><ng-content select=\"md-hint[align='end'], mat-hint[align='end']\"></ng-content></div></div></div>",
                styles: [".mat-input-container{display:inline-block;position:relative;text-align:left}[dir=rtl] .mat-input-container{text-align:right}.mat-input-wrapper{position:relative}.mat-input-flex{display:inline-flex;align-items:baseline;width:100%}.mat-input-prefix,.mat-input-suffix{white-space:nowrap;flex:none}.mat-input-prefix .mat-datepicker-toggle,.mat-input-prefix .mat-icon,.mat-input-suffix .mat-datepicker-toggle,.mat-input-suffix .mat-icon{width:1em;height:1em;vertical-align:text-bottom}.mat-input-prefix .mat-icon-button,.mat-input-suffix .mat-icon-button{font:inherit;vertical-align:baseline}.mat-input-prefix .mat-icon-button .mat-icon,.mat-input-suffix .mat-icon-button .mat-icon{font-size:inherit;width:1em;height:1em;vertical-align:baseline}.mat-input-infix{display:block;position:relative;flex:auto}.mat-input-element{font:inherit;background:0 0;color:currentColor;border:none;outline:0;padding:0;width:100%;max-width:100%;resize:vertical;vertical-align:bottom}.mat-input-element:-moz-ui-invalid{box-shadow:none}.mat-input-element:-webkit-autofill+.mat-input-placeholder-wrapper .mat-input-placeholder{display:none}.mat-input-element:-webkit-autofill+.mat-input-placeholder-wrapper .mat-float{display:block;transition:none}.mat-input-element::placeholder{color:transparent!important}.mat-input-element::-moz-placeholder{color:transparent!important}.mat-input-element::-webkit-input-placeholder{color:transparent!important}.mat-input-element:-ms-input-placeholder{color:transparent!important}.mat-input-placeholder-wrapper{position:absolute;left:0;box-sizing:content-box;width:100%;height:100%;overflow:hidden;pointer-events:none}textarea.mat-input-element{overflow:auto}.mat-input-placeholder{position:absolute;left:0;font:inherit;pointer-events:none;width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;transform:perspective(100px);-ms-transform:none;transform-origin:0 0;transition:transform .4s cubic-bezier(.25,.8,.25,1),color .4s cubic-bezier(.25,.8,.25,1),width .4s cubic-bezier(.25,.8,.25,1);display:none}.mat-focused .mat-input-placeholder.mat-float,.mat-input-placeholder.mat-empty,.mat-input-placeholder.mat-float:not(.mat-empty){display:block}[dir=rtl] .mat-input-placeholder{transform-origin:100% 0;left:auto;right:0}.mat-input-placeholder:not(.mat-empty){transition:none}.mat-input-underline{position:absolute;height:1px;width:100%}.mat-input-underline.mat-disabled{background-image:linear-gradient(to right,rgba(0,0,0,.26) 0,rgba(0,0,0,.26) 33%,transparent 0);background-size:4px 1px;background-repeat:repeat-x;background-position:0;background-color:transparent}.mat-input-underline .mat-input-ripple{position:absolute;height:2px;top:0;left:0;width:100%;transform-origin:50%;transform:scaleX(.5);visibility:hidden;transition:background-color .3s cubic-bezier(.55,0,.55,.2)}.mat-focused .mat-input-underline .mat-input-ripple,.mat-input-invalid .mat-input-underline .mat-input-ripple{visibility:visible;transform:scaleX(1);transition:transform 150ms linear,background-color .3s cubic-bezier(.55,0,.55,.2)}.mat-input-subscript-wrapper{position:absolute;width:100%;overflow:hidden}.mat-input-placeholder-wrapper .mat-datepicker-toggle,.mat-input-placeholder-wrapper .mat-icon,.mat-input-subscript-wrapper .mat-datepicker-toggle,.mat-input-subscript-wrapper .mat-icon{width:1em;height:1em;font-size:inherit;vertical-align:baseline}.mat-input-hint-wrapper{display:flex}.mat-input-hint-spacer{flex:1 0 1em}.mat-input-error{display:block}"],
                animations: [
                    _angular_animations.trigger('transitionMessages', [
                        _angular_animations.state('enter', _angular_animations.style({ opacity: 1, transform: 'translateY(0%)' })),
                        _angular_animations.transition('void => enter', [
                            _angular_animations.style({ opacity: 0, transform: 'translateY(-100%)' }),
                            _angular_animations.animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')
                        ])
                    ])
                ],
                host: {
                    // Remove align attribute to prevent it from interfering with layout.
                    '[attr.align]': 'null',
                    'class': 'mat-input-container',
                    '[class.mat-input-invalid]': '_mdInputChild._isErrorState()',
                    '[class.mat-focused]': '_mdInputChild.focused',
                    '[class.ng-untouched]': '_shouldForward("untouched")',
                    '[class.ng-touched]': '_shouldForward("touched")',
                    '[class.ng-pristine]': '_shouldForward("pristine")',
                    '[class.ng-dirty]': '_shouldForward("dirty")',
                    '[class.ng-valid]': '_shouldForward("valid")',
                    '[class.ng-invalid]': '_shouldForward("invalid")',
                    '[class.ng-pending]': '_shouldForward("pending")',
                    '(click)': '_focusInput()',
                },
                encapsulation: _angular_core.ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdInputContainer.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.ChangeDetectorRef, },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MD_PLACEHOLDER_GLOBAL_OPTIONS,] },] },
]; };
MdInputContainer.propDecorators = {
    'color': [{ type: _angular_core.Input },],
    'dividerColor': [{ type: _angular_core.Input },],
    'hideRequiredMarker': [{ type: _angular_core.Input },],
    'hintLabel': [{ type: _angular_core.Input },],
    'floatPlaceholder': [{ type: _angular_core.Input },],
    'underlineRef': [{ type: _angular_core.ViewChild, args: ['underline',] },],
    '_mdInputChild': [{ type: _angular_core.ContentChild, args: [MdInputDirective,] },],
    '_placeholderChild': [{ type: _angular_core.ContentChild, args: [MdPlaceholder,] },],
    '_errorChildren': [{ type: _angular_core.ContentChildren, args: [MdErrorDirective,] },],
    '_hintChildren': [{ type: _angular_core.ContentChildren, args: [MdHint,] },],
    '_prefixChildren': [{ type: _angular_core.ContentChildren, args: [MdPrefix,] },],
    '_suffixChildren': [{ type: _angular_core.ContentChildren, args: [MdSuffix,] },],
};
/**
 * Directive to automatically resize a textarea to fit its content.
 */
var MdTextareaAutosize = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} formControl
     */
    function MdTextareaAutosize(_elementRef, formControl) {
        var _this = this;
        this._elementRef = _elementRef;
        if (formControl && formControl.valueChanges) {
            formControl.valueChanges.subscribe(function () { return _this.resizeToFitContent(); });
        }
    }
    Object.defineProperty(MdTextareaAutosize.prototype, "minRows", {
        /**
         * @return {?}
         */
        get: function () { return this._minRows; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._minRows = value;
            this._setMinHeight();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTextareaAutosize.prototype, "maxRows", {
        /**
         * @return {?}
         */
        get: function () { return this._maxRows; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._maxRows = value;
            this._setMaxHeight();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTextareaAutosize.prototype, "_matAutosizeMinRows", {
        /**
         * @return {?}
         */
        get: function () { return this.minRows; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.minRows = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTextareaAutosize.prototype, "_matAutosizeMaxRows", {
        /**
         * @return {?}
         */
        get: function () { return this.maxRows; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.maxRows = v; },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the minimum height of the textarea as determined by minRows.
     * @return {?}
     */
    MdTextareaAutosize.prototype._setMinHeight = function () {
        var /** @type {?} */ minHeight = this.minRows && this._cachedLineHeight ?
            this.minRows * this._cachedLineHeight + "px" : null;
        if (minHeight) {
            this._setTextareaStyle('minHeight', minHeight);
        }
    };
    /**
     * Sets the maximum height of the textarea as determined by maxRows.
     * @return {?}
     */
    MdTextareaAutosize.prototype._setMaxHeight = function () {
        var /** @type {?} */ maxHeight = this.maxRows && this._cachedLineHeight ?
            this.maxRows * this._cachedLineHeight + "px" : null;
        if (maxHeight) {
            this._setTextareaStyle('maxHeight', maxHeight);
        }
    };
    /**
     * @return {?}
     */
    MdTextareaAutosize.prototype.ngAfterViewInit = function () {
        this._cacheTextareaLineHeight();
        this.resizeToFitContent();
    };
    /**
     * Sets a style property on the textarea element.
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    MdTextareaAutosize.prototype._setTextareaStyle = function (property, value) {
        var /** @type {?} */ textarea = (this._elementRef.nativeElement);
        textarea.style[property] = value;
    };
    /**
     * Cache the height of a single-row textarea.
     *
     * We need to know how large a single "row" of a textarea is in order to apply minRows and
     * maxRows. For the initial version, we will assume that the height of a single line in the
     * textarea does not ever change.
     * @return {?}
     */
    MdTextareaAutosize.prototype._cacheTextareaLineHeight = function () {
        var /** @type {?} */ textarea = (this._elementRef.nativeElement);
        // Use a clone element because we have to override some styles.
        var /** @type {?} */ textareaClone = (textarea.cloneNode(false));
        textareaClone.rows = 1;
        // Use `position: absolute` so that this doesn't cause a browser layout and use
        // `visibility: hidden` so that nothing is rendered. Clear any other styles that
        // would affect the height.
        textareaClone.style.position = 'absolute';
        textareaClone.style.visibility = 'hidden';
        textareaClone.style.border = 'none';
        textareaClone.style.padding = '0';
        textareaClone.style.height = '';
        textareaClone.style.minHeight = '';
        textareaClone.style.maxHeight = ''; /** @type {?} */
        ((textarea.parentNode)).appendChild(textareaClone);
        this._cachedLineHeight = textareaClone.clientHeight; /** @type {?} */
        ((textarea.parentNode)).removeChild(textareaClone);
        // Min and max heights have to be re-calculated if the cached line height changes
        this._setMinHeight();
        this._setMaxHeight();
    };
    /**
     * Resize the textarea to fit its content.
     * @return {?}
     */
    MdTextareaAutosize.prototype.resizeToFitContent = function () {
        var /** @type {?} */ textarea = (this._elementRef.nativeElement);
        if (textarea.value === this._previousValue) {
            return;
        }
        // Reset the textarea height to auto in order to shrink back to its default size.
        textarea.style.height = 'auto';
        // Use the scrollHeight to know how large the textarea *would* be if fit its entire value.
        textarea.style.height = textarea.scrollHeight + "px";
        this._previousValue = textarea.value;
    };
    return MdTextareaAutosize;
}());
MdTextareaAutosize.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'textarea[md-autosize], textarea[mdTextareaAutosize],' +
                    'textarea[mat-autosize], textarea[matTextareaAutosize]',
                exportAs: 'mdTextareaAutosize',
                host: {
                    '(input)': 'resizeToFitContent()',
                    // Textarea elements that have the directive applied should have a single row by default.
                    // Browsers normally show two rows by default and therefore this limits the minRows binding.
                    'rows': '1',
                },
            },] },
];
/**
 * @nocollapse
 */
MdTextareaAutosize.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_forms.NgControl, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self },] },
]; };
MdTextareaAutosize.propDecorators = {
    'minRows': [{ type: _angular_core.Input, args: ['mdAutosizeMinRows',] },],
    'maxRows': [{ type: _angular_core.Input, args: ['mdAutosizeMaxRows',] },],
    '_matAutosizeMinRows': [{ type: _angular_core.Input, args: ['matAutosizeMaxRows',] },],
    '_matAutosizeMaxRows': [{ type: _angular_core.Input, args: ['matAutosizeMaxRows',] },],
};
var MdInputModule = (function () {
    function MdInputModule() {
    }
    return MdInputModule;
}());
MdInputModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                declarations: [
                    MdErrorDirective,
                    MdHint,
                    MdInputContainer,
                    MdInputDirective,
                    MdPlaceholder,
                    MdPrefix,
                    MdSuffix,
                    MdTextareaAutosize,
                ],
                imports: [
                    _angular_common.CommonModule,
                    _angular_cdk.PlatformModule,
                ],
                exports: [
                    MdErrorDirective,
                    MdHint,
                    MdInputContainer,
                    MdInputDirective,
                    MdPlaceholder,
                    MdPrefix,
                    MdSuffix,
                    MdTextareaAutosize,
                ],
            },] },
];
/**
 * @nocollapse
 */
MdInputModule.ctorParameters = function () { return []; };
/**
 * Configuration used when opening a snack-bar.
 */
var MdSnackBarConfig = (function () {
    function MdSnackBarConfig() {
        /**
         * The politeness level for the MdAriaLiveAnnouncer announcement.
         */
        this.politeness = 'assertive';
        /**
         * Message to be announced by the MdAriaLiveAnnouncer
         */
        this.announcementMessage = '';
        /**
         * The length of time in milliseconds to wait before automatically dismissing the snack bar.
         */
        this.duration = 0;
        /**
         * Text layout direction for the snack bar.
         */
        this.direction = 'ltr';
    }
    return MdSnackBarConfig;
}());
/**
 * Reference to a snack bar dispatched from the snack bar service.
 */
var MdSnackBarRef = (function () {
    /**
     * @param {?} instance
     * @param {?} containerInstance
     * @param {?} _overlayRef
     */
    function MdSnackBarRef(instance, containerInstance, _overlayRef) {
        var _this = this;
        this._overlayRef = _overlayRef;
        /**
         * Subject for notifying the user that the snack bar has closed.
         */
        this._afterClosed = new rxjs_Subject.Subject();
        /**
         * Subject for notifying the user that the snack bar action was called.
         */
        this._onAction = new rxjs_Subject.Subject();
        // Sets the readonly instance of the snack bar content component.
        this._instance = instance;
        this.containerInstance = containerInstance;
        // Dismiss snackbar on action.
        this.onAction().subscribe(function () { return _this.dismiss(); });
        containerInstance._onExit().subscribe(function () { return _this._finishDismiss(); });
    }
    Object.defineProperty(MdSnackBarRef.prototype, "instance", {
        /**
         * The instance of the component making up the content of the snack bar.
         * @return {?}
         */
        get: function () {
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Dismisses the snack bar.
     * @return {?}
     */
    MdSnackBarRef.prototype.dismiss = function () {
        if (!this._afterClosed.closed) {
            this.containerInstance.exit();
        }
        clearTimeout(this._durationTimeoutId);
    };
    /**
     * Dismisses the snack bar after some duration
     * @param {?} duration
     * @return {?}
     */
    MdSnackBarRef.prototype._dismissAfter = function (duration) {
        var _this = this;
        this._durationTimeoutId = setTimeout(function () { return _this.dismiss(); }, duration);
    };
    /**
     * Marks the snackbar action clicked.
     * @return {?}
     */
    MdSnackBarRef.prototype._action = function () {
        if (!this._onAction.closed) {
            this._onAction.next();
            this._onAction.complete();
        }
    };
    /**
     * Marks the snackbar as opened
     * @return {?}
     */
    MdSnackBarRef.prototype._open = function () {
        if (!this._afterOpened.closed) {
            this._afterOpened.next();
            this._afterOpened.complete();
        }
    };
    /**
     * Cleans up the DOM after closing.
     * @return {?}
     */
    MdSnackBarRef.prototype._finishDismiss = function () {
        this._overlayRef.dispose();
        this._afterClosed.next();
        this._afterClosed.complete();
    };
    /**
     * Gets an observable that is notified when the snack bar is finished closing.
     * @return {?}
     */
    MdSnackBarRef.prototype.afterDismissed = function () {
        return this._afterClosed.asObservable();
    };
    /**
     * Gets an observable that is notified when the snack bar has opened and appeared.
     * @return {?}
     */
    MdSnackBarRef.prototype.afterOpened = function () {
        return this.containerInstance._onEnter();
    };
    /**
     * Gets an observable that is notified when the snack bar action is called.
     * @return {?}
     */
    MdSnackBarRef.prototype.onAction = function () {
        return this._onAction.asObservable();
    };
    return MdSnackBarRef;
}());
// TODO(jelbourn): we can't use constants from animation.ts here because you can't use
// a text interpolation in anything that is analyzed statically with ngc (for AoT compile).
var SHOW_ANIMATION = '225ms cubic-bezier(0.4,0.0,1,1)';
var HIDE_ANIMATION = '195ms cubic-bezier(0.0,0.0,0.2,1)';
/**
 * Internal component that wraps user-provided snack bar content.
 * \@docs-private
 */
var MdSnackBarContainer = (function (_super) {
    __extends(MdSnackBarContainer, _super);
    /**
     * @param {?} _ngZone
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdSnackBarContainer(_ngZone, _renderer, _elementRef) {
        var _this = _super.call(this) || this;
        _this._ngZone = _ngZone;
        _this._renderer = _renderer;
        _this._elementRef = _elementRef;
        /**
         * Subject for notifying that the snack bar has exited from view.
         */
        _this.onExit = new rxjs_Subject.Subject();
        /**
         * Subject for notifying that the snack bar has finished entering the view.
         */
        _this.onEnter = new rxjs_Subject.Subject();
        /**
         * The state of the snack bar animations.
         */
        _this.animationState = 'initial';
        return _this;
    }
    /**
     * Attach a component portal as content to this snack bar container.
     * @template T
     * @param {?} portal
     * @return {?}
     */
    MdSnackBarContainer.prototype.attachComponentPortal = function (portal) {
        if (this._portalHost.hasAttached()) {
            throw Error('Attempting to attach snack bar content after content is already attached');
        }
        if (this.snackBarConfig.extraClasses) {
            // Not the most efficient way of adding classes, but the renderer doesn't allow us
            // to pass in an array or a space-separated list.
            for (var _i = 0, _a = this.snackBarConfig.extraClasses; _i < _a.length; _i++) {
                var cssClass = _a[_i];
                this._renderer.addClass(this._elementRef.nativeElement, cssClass);
            }
        }
        return this._portalHost.attachComponentPortal(portal);
    };
    /**
     * Attach a template portal as content to this snack bar container.
     * @return {?}
     */
    MdSnackBarContainer.prototype.attachTemplatePortal = function () {
        throw Error('Not yet implemented');
    };
    /**
     * Handle end of animations, updating the state of the snackbar.
     * @param {?} event
     * @return {?}
     */
    MdSnackBarContainer.prototype.onAnimationEnd = function (event) {
        if (event.toState === 'void' || event.toState === 'complete') {
            this._completeExit();
        }
        if (event.toState === 'visible') {
            // Note: we shouldn't use `this` inside the zone callback,
            // because it can cause a memory leak.
            var /** @type {?} */ onEnter_1 = this.onEnter;
            this._ngZone.run(function () {
                onEnter_1.next();
                onEnter_1.complete();
            });
        }
    };
    /**
     * Begin animation of snack bar entrance into view.
     * @return {?}
     */
    MdSnackBarContainer.prototype.enter = function () {
        this.animationState = 'visible';
    };
    /**
     * Returns an observable resolving when the enter animation completes.
     * @return {?}
     */
    MdSnackBarContainer.prototype._onEnter = function () {
        this.animationState = 'visible';
        return this.onEnter.asObservable();
    };
    /**
     * Begin animation of the snack bar exiting from view.
     * @return {?}
     */
    MdSnackBarContainer.prototype.exit = function () {
        this.animationState = 'complete';
        return this._onExit();
    };
    /**
     * Returns an observable that completes after the closing animation is done.
     * @return {?}
     */
    MdSnackBarContainer.prototype._onExit = function () {
        return this.onExit.asObservable();
    };
    /**
     * Makes sure the exit callbacks have been invoked when the element is destroyed.
     * @return {?}
     */
    MdSnackBarContainer.prototype.ngOnDestroy = function () {
        this._completeExit();
    };
    /**
     * Waits for the zone to settle before removing the element. Helps prevent
     * errors where we end up removing an element which is in the middle of an animation.
     * @return {?}
     */
    MdSnackBarContainer.prototype._completeExit = function () {
        // Note: we shouldn't use `this` inside the zone callback,
        // because it can cause a memory leak.
        var /** @type {?} */ onExit = this.onExit;
        _angular_cdk.first.call(this._ngZone.onMicrotaskEmpty).subscribe(function () {
            onExit.next();
            onExit.complete();
        });
    };
    return MdSnackBarContainer;
}(_angular_cdk.BasePortalHost));
MdSnackBarContainer.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'snack-bar-container',
                template: "<ng-template cdkPortalHost></ng-template>",
                styles: [":host{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);background:#323232;border-radius:2px;box-sizing:content-box;display:block;max-width:568px;min-width:288px;padding:14px 24px;transform:translateY(100%)}@media screen and (-ms-high-contrast:active){:host{border:solid 1px}}"],
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                host: {
                    'role': 'alert',
                    '[@state]': 'animationState',
                    '(@state.done)': 'onAnimationEnd($event)'
                },
                animations: [
                    _angular_animations.trigger('state', [
                        _angular_animations.state('void', _angular_animations.style({ transform: 'translateY(100%)' })),
                        _angular_animations.state('initial', _angular_animations.style({ transform: 'translateY(100%)' })),
                        _angular_animations.state('visible', _angular_animations.style({ transform: 'translateY(0%)' })),
                        _angular_animations.state('complete', _angular_animations.style({ transform: 'translateY(100%)' })),
                        _angular_animations.transition('visible => complete', _angular_animations.animate(HIDE_ANIMATION)),
                        _angular_animations.transition('initial => visible, void => visible', _angular_animations.animate(SHOW_ANIMATION)),
                    ])
                ],
            },] },
];
/**
 * @nocollapse
 */
MdSnackBarContainer.ctorParameters = function () { return [
    { type: _angular_core.NgZone, },
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
]; };
MdSnackBarContainer.propDecorators = {
    '_portalHost': [{ type: _angular_core.ViewChild, args: [_angular_cdk.PortalHostDirective,] },],
};
/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
var SimpleSnackBar = (function () {
    function SimpleSnackBar() {
    }
    /**
     * Dismisses the snack bar.
     * @return {?}
     */
    SimpleSnackBar.prototype.dismiss = function () {
        this.snackBarRef._action();
    };
    Object.defineProperty(SimpleSnackBar.prototype, "hasAction", {
        /**
         * If the action button should be shown.
         * @return {?}
         */
        get: function () {
            return !!this.action;
        },
        enumerable: true,
        configurable: true
    });
    return SimpleSnackBar;
}());
SimpleSnackBar.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'simple-snack-bar',
                template: "{{message}} <button class=\"mat-simple-snackbar-action\" *ngIf=\"hasAction\" (click)=\"dismiss()\">{{action}}</button>",
                styles: [".mat-simple-snackbar{display:flex;justify-content:space-between;color:#fff;line-height:20px}.mat-simple-snackbar-action{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:0;border:none;-webkit-tap-highlight-color:transparent;background:0 0;color:inherit;flex-shrink:0;margin-left:48px}[dir=rtl] .mat-simple-snackbar-action{margin-right:48px;margin-left:0}"],
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'mat-simple-snackbar',
                }
            },] },
];
/**
 * @nocollapse
 */
SimpleSnackBar.ctorParameters = function () { return []; };
/**
 * Extends an object with the *enumerable* and *own* properties of one or more source objects,
 * similar to Object.assign.
 *
 * @param {?} dest The object which will have properties copied to it.
 * @param {...?} sources The source objects from which properties will be copied.
 * @return {?}
 */
function extendObject(dest) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (dest == null) {
        throw TypeError('Cannot convert undefined or null to object');
    }
    for (var _a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
        var source = sources_1[_a];
        if (source != null) {
            for (var /** @type {?} */ key in source) {
                if (source.hasOwnProperty(key)) {
                    dest[key] = source[key];
                }
            }
        }
    }
    return dest;
}
/**
 * Service to dispatch Material Design snack bar messages.
 */
var MdSnackBar = (function () {
    /**
     * @param {?} _overlay
     * @param {?} _live
     * @param {?} _parentSnackBar
     */
    function MdSnackBar(_overlay, _live, _parentSnackBar) {
        this._overlay = _overlay;
        this._live = _live;
        this._parentSnackBar = _parentSnackBar;
        /**
         * Reference to the current snack bar in the view *at this level* (in the Angular injector tree).
         * If there is a parent snack-bar service, all operations should delegate to that parent
         * via `_openedSnackBarRef`.
         */
        this._snackBarRefAtThisLevel = null;
    }
    Object.defineProperty(MdSnackBar.prototype, "_openedSnackBarRef", {
        /**
         * Reference to the currently opened snackbar at *any* level.
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ parent = this._parentSnackBar;
            return parent ? parent._openedSnackBarRef : this._snackBarRefAtThisLevel;
        },
        /**
         * @param {?} value
         * @return {?}
         */
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
     * @template T
     * @param {?} component Component to be instantiated.
     * @param {?=} config Extra configuration for the snack bar.
     * @return {?}
     */
    MdSnackBar.prototype.openFromComponent = function (component, config) {
        var _this = this;
        config = _applyConfigDefaults(config);
        var /** @type {?} */ overlayRef = this._createOverlay(config);
        var /** @type {?} */ snackBarContainer = this._attachSnackBarContainer(overlayRef, config);
        var /** @type {?} */ snackBarRef = this._attachSnackbarContent(component, snackBarContainer, overlayRef);
        // When the snackbar is dismissed, clear the reference to it.
        snackBarRef.afterDismissed().subscribe(function () {
            // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
            if (_this._openedSnackBarRef == snackBarRef) {
                _this._openedSnackBarRef = null;
            }
        });
        // If a snack bar is already in view, dismiss it and enter the new snack bar after exit
        // animation is complete.
        if (this._openedSnackBarRef) {
            this._openedSnackBarRef.afterDismissed().subscribe(function () {
                snackBarRef.containerInstance.enter();
            });
            this._openedSnackBarRef.dismiss();
            // If no snack bar is in view, enter the new snack bar.
        }
        else {
            snackBarRef.containerInstance.enter();
        }
        // If a dismiss timeout is provided, set up dismiss based on after the snackbar is opened.
        if (config.duration && config.duration > 0) {
            snackBarRef.afterOpened().subscribe(function () {
                snackBarRef._dismissAfter(/** @type {?} */ ((((config)).duration)));
            });
        }
        if (config.announcementMessage) {
            this._live.announce(config.announcementMessage, config.politeness);
        }
        this._openedSnackBarRef = snackBarRef;
        return this._openedSnackBarRef;
    };
    /**
     * Opens a snackbar with a message and an optional action.
     * @param {?} message The message to show in the snackbar.
     * @param {?=} action The label for the snackbar action.
     * @param {?=} config Additional configuration options for the snackbar.
     * @return {?}
     */
    MdSnackBar.prototype.open = function (message, action, config) {
        if (action === void 0) { action = ''; }
        var /** @type {?} */ _config = _applyConfigDefaults(config);
        _config.announcementMessage = message;
        var /** @type {?} */ simpleSnackBarRef = this.openFromComponent(SimpleSnackBar, _config);
        simpleSnackBarRef.instance.snackBarRef = simpleSnackBarRef;
        simpleSnackBarRef.instance.message = message;
        simpleSnackBarRef.instance.action = action;
        return simpleSnackBarRef;
    };
    /**
     * Dismisses the currently-visible snack bar.
     * @return {?}
     */
    MdSnackBar.prototype.dismiss = function () {
        if (this._openedSnackBarRef) {
            this._openedSnackBarRef.dismiss();
        }
    };
    /**
     * Attaches the snack bar container component to the overlay.
     * @param {?} overlayRef
     * @param {?} config
     * @return {?}
     */
    MdSnackBar.prototype._attachSnackBarContainer = function (overlayRef, config) {
        var /** @type {?} */ containerPortal = new _angular_cdk.ComponentPortal(MdSnackBarContainer, config.viewContainerRef);
        var /** @type {?} */ containerRef = overlayRef.attach(containerPortal);
        containerRef.instance.snackBarConfig = config;
        return containerRef.instance;
    };
    /**
     * Places a new component as the content of the snack bar container.
     * @template T
     * @param {?} component
     * @param {?} container
     * @param {?} overlayRef
     * @return {?}
     */
    MdSnackBar.prototype._attachSnackbarContent = function (component, container, overlayRef) {
        var /** @type {?} */ portal = new _angular_cdk.ComponentPortal(component);
        var /** @type {?} */ contentRef = container.attachComponentPortal(portal);
        return new MdSnackBarRef(contentRef.instance, container, overlayRef);
    };
    /**
     * Creates a new overlay and places it in the correct location.
     * @param {?} config The user-specified snack bar config.
     * @return {?}
     */
    MdSnackBar.prototype._createOverlay = function (config) {
        var /** @type {?} */ state$$1 = new OverlayState();
        state$$1.direction = config.direction;
        state$$1.positionStrategy = this._overlay.position().global().centerHorizontally().bottom('0');
        return this._overlay.create(state$$1);
    };
    return MdSnackBar;
}());
MdSnackBar.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
MdSnackBar.ctorParameters = function () { return [
    { type: Overlay, },
    { type: _angular_cdk.LiveAnnouncer, },
    { type: MdSnackBar, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.SkipSelf },] },
]; };
/**
 * Applies default options to the snackbar config.
 * @param {?=} config The configuration to which the defaults will be applied.
 * @return {?} The new configuration object with defaults applied.
 */
function _applyConfigDefaults(config) {
    return extendObject(new MdSnackBarConfig(), config);
}
var MdSnackBarModule = (function () {
    function MdSnackBarModule() {
    }
    return MdSnackBarModule;
}());
MdSnackBarModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    OverlayModule,
                    _angular_cdk.PortalModule,
                    _angular_common.CommonModule,
                    MdCommonModule,
                ],
                exports: [MdSnackBarContainer, MdCommonModule],
                declarations: [MdSnackBarContainer, SimpleSnackBar],
                entryComponents: [MdSnackBarContainer, SimpleSnackBar],
                providers: [MdSnackBar, _angular_cdk.LIVE_ANNOUNCER_PROVIDER]
            },] },
];
/**
 * @nocollapse
 */
MdSnackBarModule.ctorParameters = function () { return []; };
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MdTabLabelBaseClass = _angular_cdk.TemplatePortalDirective;
/**
 * Used to flag tab labels for use with the portal directive
 */
var MdTabLabel = (function (_super) {
    __extends(MdTabLabel, _super);
    /**
     * @param {?} templateRef
     * @param {?} viewContainerRef
     */
    function MdTabLabel(templateRef, viewContainerRef) {
        return _super.call(this, templateRef, viewContainerRef) || this;
    }
    return MdTabLabel;
}(_MdTabLabelBaseClass));
MdTabLabel.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-tab-label], [mat-tab-label], [mdTabLabel], [matTabLabel]',
            },] },
];
/**
 * @nocollapse
 */
MdTabLabel.ctorParameters = function () { return [
    { type: _angular_core.TemplateRef, },
    { type: _angular_core.ViewContainerRef, },
]; };
/**
 * \@docs-private
 */
var MdTabBase = (function () {
    function MdTabBase() {
    }
    return MdTabBase;
}());
var _MdTabMixinBase = mixinDisabled(MdTabBase);
var MdTab = (function (_super) {
    __extends(MdTab, _super);
    /**
     * @param {?} _viewContainerRef
     */
    function MdTab(_viewContainerRef) {
        var _this = _super.call(this) || this;
        _this._viewContainerRef = _viewContainerRef;
        /**
         * The plain text label for the tab, used when there is no template label.
         */
        _this.textLabel = '';
        /**
         * The portal that will be the hosted content of the tab
         */
        _this._contentPortal = null;
        /**
         * The relatively indexed position where 0 represents the center, negative is left, and positive
         * represents the right.
         */
        _this.position = null;
        /**
         * The initial relatively index origin of the tab if it was created and selected after there
         * was already a selected tab. Provides context of what position the tab should originate from.
         */
        _this.origin = null;
        return _this;
    }
    Object.defineProperty(MdTab.prototype, "content", {
        /**
         * @return {?}
         */
        get: function () { return this._contentPortal; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdTab.prototype.ngOnInit = function () {
        this._contentPortal = new _angular_cdk.TemplatePortal(this._content, this._viewContainerRef);
    };
    return MdTab;
}(_MdTabMixinBase));
MdTab.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-tab, mat-tab',
                template: "<ng-template><ng-content></ng-content></ng-template>",
                inputs: ['disabled']
            },] },
];
/**
 * @nocollapse
 */
MdTab.ctorParameters = function () { return [
    { type: _angular_core.ViewContainerRef, },
]; };
MdTab.propDecorators = {
    'templateLabel': [{ type: _angular_core.ContentChild, args: [MdTabLabel,] },],
    '_content': [{ type: _angular_core.ViewChild, args: [_angular_core.TemplateRef,] },],
    'textLabel': [{ type: _angular_core.Input, args: ['label',] },],
};
/**
 * Used to generate unique ID's for each tab component
 */
var nextId$2 = 0;
/**
 * A simple change event emitted on focus or selection changes.
 */
var MdTabChangeEvent = (function () {
    function MdTabChangeEvent() {
    }
    return MdTabChangeEvent;
}());
/**
 * Material design tab-group component.  Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://www.google.com/design/spec/components/tabs.html
 */
var MdTabGroup = (function () {
    /**
     * @param {?} _renderer
     */
    function MdTabGroup(_renderer) {
        this._renderer = _renderer;
        /**
         * Whether this component has been initialized.
         */
        this._isInitialized = false;
        /**
         * The tab index that should be selected after the content has been checked.
         */
        this._indexToSelect = 0;
        /**
         * Snapshot of the height of the tab body wrapper before another tab is activated.
         */
        this._tabBodyWrapperHeight = 0;
        this._dynamicHeight = false;
        this._disableRipple = false;
        this._selectedIndex = null;
        /**
         * Position of the tab header.
         */
        this.headerPosition = 'above';
        /**
         * Event emitted when focus has changed within a tab group.
         */
        this.focusChange = new _angular_core.EventEmitter();
        /**
         * Event emitted when the tab selection has changed.
         */
        this.selectChange = new _angular_core.EventEmitter(true);
        this._groupId = nextId$2++;
    }
    Object.defineProperty(MdTabGroup.prototype, "dynamicHeight", {
        /**
         * Whether the tab group should grow to the size of the active tab.
         * @return {?}
         */
        get: function () { return this._dynamicHeight; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._dynamicHeight = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "_dynamicHeightDeprecated", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this._dynamicHeight; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._dynamicHeight = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "disableRipple", {
        /**
         * Whether ripples for the tab-group should be disabled or not.
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disableRipple = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "selectedIndex", {
        /**
         * @return {?}
         */
        get: function () { return this._selectedIndex; },
        /**
         * The index of the active tab.
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._indexToSelect = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "selectedIndexChange", {
        /**
         * Output to enable support for two-way binding on `[(selectedIndex)]`
         * @return {?}
         */
        get: function () {
            return _angular_cdk.map.call(this.selectChange, function (event) { return event.index; });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * After the content is checked, this component knows what tabs have been defined
     * and what the selected index should be. This is where we can know exactly what position
     * each tab should be in according to the new selected index, and additionally we know how
     * a new selected tab should transition in (from the left or right).
     * @return {?}
     */
    MdTabGroup.prototype.ngAfterContentChecked = function () {
        var _this = this;
        // Clamp the next selected index to the bounds of 0 and the tabs length. Note the `|| 0`, which
        // ensures that values like NaN can't get through and which would otherwise throw the
        // component into an infinite loop (since Math.max(NaN, 0) === NaN).
        var /** @type {?} */ indexToSelect = this._indexToSelect =
            Math.min(this._tabs.length - 1, Math.max(this._indexToSelect || 0, 0));
        // If there is a change in selected index, emit a change event. Should not trigger if
        // the selected index has not yet been initialized.
        if (this._selectedIndex != indexToSelect && this._selectedIndex != null) {
            this.selectChange.emit(this._createChangeEvent(indexToSelect));
        }
        // Setup the position for each tab and optionally setup an origin on the next selected tab.
        this._tabs.forEach(function (tab, index) {
            tab.position = index - indexToSelect;
            // If there is already a selected tab, then set up an origin for the next selected tab
            // if it doesn't have one already.
            if (_this._selectedIndex != null && tab.position == 0 && !tab.origin) {
                tab.origin = indexToSelect - _this._selectedIndex;
            }
        });
        this._selectedIndex = indexToSelect;
    };
    /**
     * Waits one frame for the view to update, then updates the ink bar
     * Note: This must be run outside of the zone or it will create an infinite change detection loop.
     * @return {?}
     */
    MdTabGroup.prototype.ngAfterViewChecked = function () {
        this._isInitialized = true;
    };
    /**
     * @param {?} index
     * @return {?}
     */
    MdTabGroup.prototype._focusChanged = function (index) {
        this.focusChange.emit(this._createChangeEvent(index));
    };
    /**
     * @param {?} index
     * @return {?}
     */
    MdTabGroup.prototype._createChangeEvent = function (index) {
        var /** @type {?} */ event = new MdTabChangeEvent;
        event.index = index;
        if (this._tabs && this._tabs.length) {
            event.tab = this._tabs.toArray()[index];
        }
        return event;
    };
    /**
     * Returns a unique id for each tab label element
     * @param {?} i
     * @return {?}
     */
    MdTabGroup.prototype._getTabLabelId = function (i) {
        return "md-tab-label-" + this._groupId + "-" + i;
    };
    /**
     * Returns a unique id for each tab content element
     * @param {?} i
     * @return {?}
     */
    MdTabGroup.prototype._getTabContentId = function (i) {
        return "md-tab-content-" + this._groupId + "-" + i;
    };
    /**
     * Sets the height of the body wrapper to the height of the activating tab if dynamic
     * height property is true.
     * @param {?} tabHeight
     * @return {?}
     */
    MdTabGroup.prototype._setTabBodyWrapperHeight = function (tabHeight) {
        if (!this._dynamicHeight || !this._tabBodyWrapperHeight) {
            return;
        }
        this._renderer.setStyle(this._tabBodyWrapper.nativeElement, 'height', this._tabBodyWrapperHeight + 'px');
        // This conditional forces the browser to paint the height so that
        // the animation to the new height can have an origin.
        if (this._tabBodyWrapper.nativeElement.offsetHeight) {
            this._renderer.setStyle(this._tabBodyWrapper.nativeElement, 'height', tabHeight + 'px');
        }
    };
    /**
     * Removes the height of the tab body wrapper.
     * @return {?}
     */
    MdTabGroup.prototype._removeTabBodyWrapperHeight = function () {
        this._tabBodyWrapperHeight = this._tabBodyWrapper.nativeElement.clientHeight;
        this._renderer.setStyle(this._tabBodyWrapper.nativeElement, 'height', '');
    };
    return MdTabGroup;
}());
MdTabGroup.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-tab-group, mat-tab-group',
                template: "<md-tab-header #tabHeader [selectedIndex]=\"selectedIndex\" [disableRipple]=\"disableRipple\" (indexFocused)=\"_focusChanged($event)\" (selectFocusedIndex)=\"selectedIndex = $event\"><div class=\"mat-tab-label\" role=\"tab\" md-tab-label-wrapper md-ripple *ngFor=\"let tab of _tabs; let i = index\" [id]=\"_getTabLabelId(i)\" [tabIndex]=\"selectedIndex == i ? 0 : -1\" [attr.aria-controls]=\"_getTabContentId(i)\" [attr.aria-selected]=\"selectedIndex == i\" [class.mat-tab-label-active]=\"selectedIndex == i\" [disabled]=\"tab.disabled\" [mdRippleDisabled]=\"disableRipple\" (click)=\"tabHeader.focusIndex = selectedIndex = i\"><ng-template [ngIf]=\"tab.templateLabel\"><ng-template [cdkPortalHost]=\"tab.templateLabel\"></ng-template></ng-template><ng-template [ngIf]=\"!tab.templateLabel\">{{tab.textLabel}}</ng-template></div></md-tab-header><div class=\"mat-tab-body-wrapper\" #tabBodyWrapper><md-tab-body role=\"tabpanel\" *ngFor=\"let tab of _tabs; let i = index\" [id]=\"_getTabContentId(i)\" [attr.aria-labelledby]=\"_getTabLabelId(i)\" [class.mat-tab-body-active]=\"selectedIndex == i\" [content]=\"tab.content\" [position]=\"tab.position\" [origin]=\"tab.origin\" (onCentered)=\"_removeTabBodyWrapperHeight()\" (onCentering)=\"_setTabBodyWrapperHeight($event)\"></md-tab-body></div>",
                styles: [":host{display:flex;flex-direction:column}:host.mat-tab-group-inverted-header{flex-direction:column-reverse}.mat-tab-label{line-height:48px;height:48px;padding:0 12px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;position:relative}.mat-tab-label:focus{outline:0;opacity:1}.mat-tab-label.mat-tab-disabled{cursor:default;pointer-events:none}@media (max-width:600px){.mat-tab-label{min-width:72px}}:host[mat-stretch-tabs] .mat-tab-label,:host[md-stretch-tabs] .mat-tab-label{flex-basis:0;flex-grow:1}.mat-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height .5s cubic-bezier(.35,0,.25,1)}.mat-tab-body{position:absolute;top:0;left:0;right:0;bottom:0;display:block;overflow:hidden}.mat-tab-body.mat-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}:host.mat-tab-group-dynamic-height .mat-tab-body.mat-tab-body-active{overflow-y:hidden}"],
                host: {
                    'class': 'mat-tab-group',
                    '[class.mat-tab-group-dynamic-height]': 'dynamicHeight',
                    '[class.mat-tab-group-inverted-header]': 'headerPosition === "below"',
                }
            },] },
];
/**
 * @nocollapse
 */
MdTabGroup.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
]; };
MdTabGroup.propDecorators = {
    '_tabs': [{ type: _angular_core.ContentChildren, args: [MdTab,] },],
    '_tabBodyWrapper': [{ type: _angular_core.ViewChild, args: ['tabBodyWrapper',] },],
    'dynamicHeight': [{ type: _angular_core.Input },],
    '_dynamicHeightDeprecated': [{ type: _angular_core.Input, args: ['md-dynamic-height',] },],
    'disableRipple': [{ type: _angular_core.Input },],
    'selectedIndex': [{ type: _angular_core.Input },],
    'headerPosition': [{ type: _angular_core.Input },],
    'selectedIndexChange': [{ type: _angular_core.Output },],
    'focusChange': [{ type: _angular_core.Output },],
    'selectChange': [{ type: _angular_core.Output },],
};
/**
 * \@docs-private
 */
var MdTabLabelWrapperBase = (function () {
    function MdTabLabelWrapperBase() {
    }
    return MdTabLabelWrapperBase;
}());
var _MdTabLabelWrapperMixinBase = mixinDisabled(MdTabLabelWrapperBase);
/**
 * Used in the `md-tab-group` view to display tab labels.
 * \@docs-private
 */
var MdTabLabelWrapper = (function (_super) {
    __extends(MdTabLabelWrapper, _super);
    /**
     * @param {?} elementRef
     */
    function MdTabLabelWrapper(elementRef) {
        var _this = _super.call(this) || this;
        _this.elementRef = elementRef;
        return _this;
    }
    /**
     * Sets focus on the wrapper element
     * @return {?}
     */
    MdTabLabelWrapper.prototype.focus = function () {
        this.elementRef.nativeElement.focus();
    };
    /**
     * @return {?}
     */
    MdTabLabelWrapper.prototype.getOffsetLeft = function () {
        return this.elementRef.nativeElement.offsetLeft;
    };
    /**
     * @return {?}
     */
    MdTabLabelWrapper.prototype.getOffsetWidth = function () {
        return this.elementRef.nativeElement.offsetWidth;
    };
    return MdTabLabelWrapper;
}(_MdTabLabelWrapperMixinBase));
MdTabLabelWrapper.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-tab-label-wrapper], [mat-tab-label-wrapper]',
                inputs: ['disabled'],
                host: {
                    '[class.mat-tab-disabled]': 'disabled'
                }
            },] },
];
/**
 * @nocollapse
 */
MdTabLabelWrapper.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
]; };
/**
 * The ink-bar is used to display and animate the line underneath the current active tab label.
 * \@docs-private
 */
var MdInkBar = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     * @param {?} _ngZone
     */
    function MdInkBar(_renderer, _elementRef, _ngZone) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
    }
    /**
     * Calculates the styles from the provided element in order to align the ink-bar to that element.
     * Shows the ink bar if previously set as hidden.
     * @param {?} element
     * @return {?}
     */
    MdInkBar.prototype.alignToElement = function (element) {
        var _this = this;
        this.show();
        if (typeof requestAnimationFrame !== 'undefined') {
            this._ngZone.runOutsideAngular(function () {
                requestAnimationFrame(function () { return _this._setStyles(element); });
            });
        }
        else {
            this._setStyles(element);
        }
    };
    /**
     * Shows the ink bar.
     * @return {?}
     */
    MdInkBar.prototype.show = function () {
        this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'visible');
    };
    /**
     * Hides the ink bar.
     * @return {?}
     */
    MdInkBar.prototype.hide = function () {
        this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'hidden');
    };
    /**
     * Sets the proper styles to the ink bar element.
     * @param {?} element
     * @return {?}
     */
    MdInkBar.prototype._setStyles = function (element) {
        var /** @type {?} */ left = element ? (element.offsetLeft || 0) + 'px' : '0';
        var /** @type {?} */ width = element ? (element.offsetWidth || 0) + 'px' : '0';
        this._renderer.setStyle(this._elementRef.nativeElement, 'left', left);
        this._renderer.setStyle(this._elementRef.nativeElement, 'width', width);
    };
    return MdInkBar;
}());
MdInkBar.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-ink-bar, mat-ink-bar',
                host: {
                    'class': 'mat-ink-bar',
                },
            },] },
];
/**
 * @nocollapse
 */
MdInkBar.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.NgZone, },
]; };
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
var MdTabNav = (function () {
    /**
     * @param {?} _dir
     * @param {?} _ngZone
     */
    function MdTabNav(_dir, _ngZone) {
        this._dir = _dir;
        this._ngZone = _ngZone;
        /**
         * Subject that emits when the component has been destroyed.
         */
        this._onDestroy = new rxjs_Subject.Subject();
    }
    /**
     * Notifies the component that the active link has been changed.
     * @param {?} element
     * @return {?}
     */
    MdTabNav.prototype.updateActiveLink = function (element) {
        this._activeLinkChanged = this._activeLinkElement != element;
        this._activeLinkElement = element;
    };
    /**
     * @return {?}
     */
    MdTabNav.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._resizeSubscription = this._ngZone.runOutsideAngular(function () {
            var /** @type {?} */ dirChange = _this._dir ? _this._dir.change : rxjs_observable_of.of(null);
            var /** @type {?} */ resize = typeof window !== 'undefined' ?
                _angular_cdk.auditTime.call(rxjs_observable_fromEvent.fromEvent(window, 'resize'), 10) :
                rxjs_observable_of.of(null);
            return _angular_cdk.takeUntil.call(rxjs_observable_merge.merge(dirChange, resize), _this._onDestroy)
                .subscribe(function () { return _this._alignInkBar(); });
        });
    };
    /**
     * Checks if the active link has been changed and, if so, will update the ink bar.
     * @return {?}
     */
    MdTabNav.prototype.ngAfterContentChecked = function () {
        if (this._activeLinkChanged) {
            this._alignInkBar();
            this._activeLinkChanged = false;
        }
    };
    /**
     * @return {?}
     */
    MdTabNav.prototype.ngOnDestroy = function () {
        this._onDestroy.next();
        this._resizeSubscription.unsubscribe();
    };
    /**
     * Aligns the ink bar to the active link.
     * @return {?}
     */
    MdTabNav.prototype._alignInkBar = function () {
        if (this._activeLinkElement) {
            this._inkBar.alignToElement(this._activeLinkElement.nativeElement);
        }
    };
    return MdTabNav;
}());
MdTabNav.decorators = [
    { type: _angular_core.Component, args: [{ selector: '[md-tab-nav-bar], [mat-tab-nav-bar]',
                template: "<div class=\"mat-tab-links\" (cdkObserveContent)=\"_alignInkBar()\"><ng-content></ng-content><md-ink-bar></md-ink-bar></div>",
                styles: [".mat-tab-nav-bar{overflow:hidden;position:relative;flex-shrink:0}.mat-tab-links{position:relative}.mat-tab-link{line-height:48px;height:48px;padding:0 12px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-block;vertical-align:top;text-decoration:none;position:relative;overflow:hidden}.mat-tab-link:focus{outline:0;opacity:1}.mat-tab-link.mat-tab-disabled{cursor:default;pointer-events:none}@media (max-width:600px){.mat-tab-link{min-width:72px}}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:.5s cubic-bezier(.35,0,.25,1)}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}"],
                host: { 'class': 'mat-tab-nav-bar' },
                encapsulation: _angular_core.ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdTabNav.ctorParameters = function () { return [
    { type: _angular_cdk.Directionality, decorators: [{ type: _angular_core.Optional },] },
    { type: _angular_core.NgZone, },
]; };
MdTabNav.propDecorators = {
    '_inkBar': [{ type: _angular_core.ViewChild, args: [MdInkBar,] },],
};
var MdTabLinkBase = (function () {
    function MdTabLinkBase() {
    }
    return MdTabLinkBase;
}());
var _MdTabLinkMixinBase = mixinDisabled(MdTabLinkBase);
/**
 * Link inside of a `md-tab-nav-bar`.
 */
var MdTabLink = (function (_super) {
    __extends(MdTabLink, _super);
    /**
     * @param {?} _mdTabNavBar
     * @param {?} _elementRef
     * @param {?} ngZone
     * @param {?} ruler
     * @param {?} platform
     * @param {?} globalOptions
     */
    function MdTabLink(_mdTabNavBar, _elementRef, ngZone, ruler, platform, globalOptions) {
        var _this = _super.call(this) || this;
        _this._mdTabNavBar = _mdTabNavBar;
        _this._elementRef = _elementRef;
        /**
         * Whether the tab link is active or not.
         */
        _this._isActive = false;
        // Manually create a ripple instance that uses the tab link element as trigger element.
        // Notice that the lifecycle hooks for the ripple config won't be called anymore.
        _this._tabLinkRipple = new MdRipple(_elementRef, ngZone, ruler, platform, globalOptions);
        return _this;
    }
    Object.defineProperty(MdTabLink.prototype, "active", {
        /**
         * Whether the link is active.
         * @return {?}
         */
        get: function () { return this._isActive; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._isActive = value;
            if (value) {
                this._mdTabNavBar.updateActiveLink(this._elementRef);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabLink.prototype, "tabIndex", {
        /**
         * \@docs-private
         * @return {?}
         */
        get: function () {
            return this.disabled ? -1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdTabLink.prototype.ngOnDestroy = function () {
        // Manually call the ngOnDestroy lifecycle hook of the ripple instance because it won't be
        // called automatically since its instance is not created by Angular.
        this._tabLinkRipple.ngOnDestroy();
    };
    return MdTabLink;
}(_MdTabLinkMixinBase));
MdTabLink.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-tab-link], [mat-tab-link], [mdTabLink], [matTabLink]',
                inputs: ['disabled'],
                host: {
                    'class': 'mat-tab-link',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[class.mat-tab-disabled]': 'disabled'
                }
            },] },
];
/**
 * @nocollapse
 */
MdTabLink.ctorParameters = function () { return [
    { type: MdTabNav, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.NgZone, },
    { type: ViewportRuler, },
    { type: _angular_cdk.Platform, },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MD_RIPPLE_GLOBAL_OPTIONS,] },] },
]; };
MdTabLink.propDecorators = {
    'active': [{ type: _angular_core.Input },],
    'tabIndex': [{ type: _angular_core.HostBinding, args: ['tabIndex',] },],
};
/**
 * Wrapper for the contents of a tab.
 * \@docs-private
 */
var MdTabBody = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _dir
     */
    function MdTabBody(_elementRef, _dir) {
        this._elementRef = _elementRef;
        this._dir = _dir;
        /**
         * Event emitted when the tab begins to animate towards the center as the active tab.
         */
        this.onCentering = new _angular_core.EventEmitter();
        /**
         * Event emitted when the tab completes its animation towards the center.
         */
        this.onCentered = new _angular_core.EventEmitter(true);
    }
    Object.defineProperty(MdTabBody.prototype, "position", {
        /**
         * @param {?} position
         * @return {?}
         */
        set: function (position) {
            if (position < 0) {
                this._position = this._getLayoutDirection() == 'ltr' ? 'left' : 'right';
            }
            else if (position > 0) {
                this._position = this._getLayoutDirection() == 'ltr' ? 'right' : 'left';
            }
            else {
                this._position = 'center';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabBody.prototype, "origin", {
        /**
         * The origin position from which this tab should appear when it is centered into view.
         * @param {?} origin
         * @return {?}
         */
        set: function (origin) {
            if (origin == null) {
                return;
            }
            var /** @type {?} */ dir = this._getLayoutDirection();
            if ((dir == 'ltr' && origin <= 0) || (dir == 'rtl' && origin > 0)) {
                this._origin = 'left';
            }
            else {
                this._origin = 'right';
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * After initialized, check if the content is centered and has an origin. If so, set the
     * special position states that transition the tab from the left or right before centering.
     * @return {?}
     */
    MdTabBody.prototype.ngOnInit = function () {
        if (this._position == 'center' && this._origin) {
            this._position = this._origin == 'left' ? 'left-origin-center' : 'right-origin-center';
        }
    };
    /**
     * After the view has been set, check if the tab content is set to the center and attach the
     * content if it is not already attached.
     * @return {?}
     */
    MdTabBody.prototype.ngAfterViewChecked = function () {
        if (this._isCenterPosition(this._position) && !this._portalHost.hasAttached()) {
            this._portalHost.attach(this._content);
        }
    };
    /**
     * @param {?} e
     * @return {?}
     */
    MdTabBody.prototype._onTranslateTabStarted = function (e) {
        if (this._isCenterPosition(e.toState)) {
            this.onCentering.emit(this._elementRef.nativeElement.clientHeight);
        }
    };
    /**
     * @param {?} e
     * @return {?}
     */
    MdTabBody.prototype._onTranslateTabComplete = function (e) {
        // If the end state is that the tab is not centered, then detach the content.
        if (!this._isCenterPosition(e.toState) && !this._isCenterPosition(this._position)) {
            this._portalHost.detach();
        }
        // If the transition to the center is complete, emit an event.
        if (this._isCenterPosition(e.toState) && this._isCenterPosition(this._position)) {
            this.onCentered.emit();
        }
    };
    /**
     * The text direction of the containing app.
     * @return {?}
     */
    MdTabBody.prototype._getLayoutDirection = function () {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    };
    /**
     * Whether the provided position state is considered center, regardless of origin.
     * @param {?} position
     * @return {?}
     */
    MdTabBody.prototype._isCenterPosition = function (position) {
        return position == 'center' ||
            position == 'left-origin-center' ||
            position == 'right-origin-center';
    };
    return MdTabBody;
}());
MdTabBody.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-tab-body, mat-tab-body',
                template: "<div class=\"mat-tab-body-content\" #content [@translateTab]=\"_position\" (@translateTab.start)=\"_onTranslateTabStarted($event)\" (@translateTab.done)=\"_onTranslateTabComplete($event)\"><ng-template cdkPortalHost></ng-template></div>",
                styles: [".mat-tab-body-content{height:100%;overflow:auto}.mat-tab-group-dynamic-height .mat-tab-body-content{overflow:hidden}"],
                encapsulation: _angular_core.ViewEncapsulation.None,
                host: {
                    'class': 'mat-tab-body',
                },
                animations: [
                    _angular_animations.trigger('translateTab', [
                        _angular_animations.state('void', _angular_animations.style({ transform: 'translate3d(0%, 0, 0)' })),
                        _angular_animations.state('left', _angular_animations.style({ transform: 'translate3d(-100%, 0, 0)' })),
                        _angular_animations.state('left-origin-center', _angular_animations.style({ transform: 'translate3d(0%, 0, 0)' })),
                        _angular_animations.state('right-origin-center', _angular_animations.style({ transform: 'translate3d(0%, 0, 0)' })),
                        _angular_animations.state('center', _angular_animations.style({ transform: 'translate3d(0%, 0, 0)' })),
                        _angular_animations.state('right', _angular_animations.style({ transform: 'translate3d(100%, 0, 0)' })),
                        _angular_animations.transition('* => left, * => right, left => center, right => center', _angular_animations.animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')),
                        _angular_animations.transition('void => left-origin-center', [
                            _angular_animations.style({ transform: 'translate3d(-100%, 0, 0)' }),
                            _angular_animations.animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')
                        ]),
                        _angular_animations.transition('void => right-origin-center', [
                            _angular_animations.style({ transform: 'translate3d(100%, 0, 0)' }),
                            _angular_animations.animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')
                        ])
                    ])
                ]
            },] },
];
/**
 * @nocollapse
 */
MdTabBody.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_cdk.Directionality, decorators: [{ type: _angular_core.Optional },] },
]; };
MdTabBody.propDecorators = {
    '_portalHost': [{ type: _angular_core.ViewChild, args: [_angular_cdk.PortalHostDirective,] },],
    'onCentering': [{ type: _angular_core.Output },],
    'onCentered': [{ type: _angular_core.Output },],
    '_content': [{ type: _angular_core.Input, args: ['content',] },],
    'position': [{ type: _angular_core.Input, args: ['position',] },],
    'origin': [{ type: _angular_core.Input, args: ['origin',] },],
};
/**
 * The distance in pixels that will be overshot when scrolling a tab label into view. This helps
 * provide a small affordance to the label next to it.
 */
var EXAGGERATED_OVERSCROLL = 60;
/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 * \@docs-private
 */
var MdTabHeader = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _ngZone
     * @param {?} _renderer
     * @param {?} _dir
     */
    function MdTabHeader(_elementRef, _ngZone, _renderer, _dir) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._renderer = _renderer;
        this._dir = _dir;
        /**
         * The tab index that is focused.
         */
        this._focusIndex = 0;
        /**
         * The distance in pixels that the tab labels should be translated to the left.
         */
        this._scrollDistance = 0;
        /**
         * Whether the header should scroll to the selected index after the view has been checked.
         */
        this._selectedIndexChanged = false;
        /**
         * Combines listeners that will re-align the ink bar whenever they're invoked.
         */
        this._realignInkBar = null;
        /**
         * Whether the controls for pagination should be displayed
         */
        this._showPaginationControls = false;
        /**
         * Whether the tab list can be scrolled more towards the end of the tab label list.
         */
        this._disableScrollAfter = true;
        /**
         * Whether the tab list can be scrolled more towards the beginning of the tab label list.
         */
        this._disableScrollBefore = true;
        this._selectedIndex = 0;
        this._disableRipple = false;
        /**
         * Event emitted when the option is selected.
         */
        this.selectFocusedIndex = new _angular_core.EventEmitter();
        /**
         * Event emitted when a label is focused.
         */
        this.indexFocused = new _angular_core.EventEmitter();
    }
    Object.defineProperty(MdTabHeader.prototype, "selectedIndex", {
        /**
         * The index of the active tab.
         * @return {?}
         */
        get: function () { return this._selectedIndex; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selectedIndexChanged = this._selectedIndex != value;
            this._selectedIndex = value;
            this._focusIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabHeader.prototype, "disableRipple", {
        /**
         * Whether ripples for the tab-header labels should be disabled or not.
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disableRipple = _angular_cdk.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdTabHeader.prototype.ngAfterContentChecked = function () {
        // If the number of tab labels have changed, check if scrolling should be enabled
        if (this._tabLabelCount != this._labelWrappers.length) {
            this._updatePagination();
            this._tabLabelCount = this._labelWrappers.length;
        }
        // If the selected index has changed, scroll to the label and check if the scrolling controls
        // should be disabled.
        if (this._selectedIndexChanged) {
            this._scrollToLabel(this._selectedIndex);
            this._checkScrollingControls();
            this._alignInkBarToSelectedTab();
            this._selectedIndexChanged = false;
        }
        // If the scroll distance has been changed (tab selected, focused, scroll controls activated),
        // then translate the header to reflect this.
        if (this._scrollDistanceChanged) {
            this._updateTabScrollPosition();
            this._scrollDistanceChanged = false;
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdTabHeader.prototype._handleKeydown = function (event) {
        switch (event.keyCode) {
            case _angular_cdk.RIGHT_ARROW:
                this._focusNextTab();
                break;
            case _angular_cdk.LEFT_ARROW:
                this._focusPreviousTab();
                break;
            case _angular_cdk.ENTER:
                this.selectFocusedIndex.emit(this.focusIndex);
                break;
        }
    };
    /**
     * Aligns the ink bar to the selected tab on load.
     * @return {?}
     */
    MdTabHeader.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._realignInkBar = this._ngZone.runOutsideAngular(function () {
            var /** @type {?} */ dirChange = _this._dir ? _this._dir.change : rxjs_observable_of.of(null);
            var /** @type {?} */ resize = typeof window !== 'undefined' ?
                _angular_cdk.auditTime.call(rxjs_observable_fromEvent.fromEvent(window, 'resize'), 10) :
                rxjs_observable_of.of(null);
            return _angular_cdk.startWith.call(rxjs_observable_merge.merge(dirChange, resize), null).subscribe(function () {
                _this._updatePagination();
                _this._alignInkBarToSelectedTab();
            });
        });
    };
    /**
     * @return {?}
     */
    MdTabHeader.prototype.ngOnDestroy = function () {
        if (this._realignInkBar) {
            this._realignInkBar.unsubscribe();
            this._realignInkBar = null;
        }
    };
    /**
     * Callback for when the MutationObserver detects that the content has changed.
     * @return {?}
     */
    MdTabHeader.prototype._onContentChanges = function () {
        this._updatePagination();
        this._alignInkBarToSelectedTab();
    };
    /**
     * Updating the view whether pagination should be enabled or not
     * @return {?}
     */
    MdTabHeader.prototype._updatePagination = function () {
        this._checkPaginationEnabled();
        this._checkScrollingControls();
        this._updateTabScrollPosition();
    };
    Object.defineProperty(MdTabHeader.prototype, "focusIndex", {
        /**
         * Tracks which element has focus; used for keyboard navigation
         * @return {?}
         */
        get: function () { return this._focusIndex; },
        /**
         * When the focus index is set, we must manually send focus to the correct label
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (!this._isValidIndex(value) || this._focusIndex == value) {
                return;
            }
            this._focusIndex = value;
            this.indexFocused.emit(value);
            this._setTabFocus(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Determines if an index is valid.  If the tabs are not ready yet, we assume that the user is
     * providing a valid index and return true.
     * @param {?} index
     * @return {?}
     */
    MdTabHeader.prototype._isValidIndex = function (index) {
        if (!this._labelWrappers) {
            return true;
        }
        var /** @type {?} */ tab = this._labelWrappers ? this._labelWrappers.toArray()[index] : null;
        return !!tab && !tab.disabled;
    };
    /**
     * Sets focus on the HTML element for the label wrapper and scrolls it into the view if
     * scrolling is enabled.
     * @param {?} tabIndex
     * @return {?}
     */
    MdTabHeader.prototype._setTabFocus = function (tabIndex) {
        if (this._showPaginationControls) {
            this._scrollToLabel(tabIndex);
        }
        if (this._labelWrappers && this._labelWrappers.length) {
            this._labelWrappers.toArray()[tabIndex].focus();
            // Do not let the browser manage scrolling to focus the element, this will be handled
            // by using translation. In LTR, the scroll left should be 0. In RTL, the scroll width
            // should be the full width minus the offset width.
            var /** @type {?} */ containerEl = this._tabListContainer.nativeElement;
            var /** @type {?} */ dir = this._getLayoutDirection();
            if (dir == 'ltr') {
                containerEl.scrollLeft = 0;
            }
            else {
                containerEl.scrollLeft = containerEl.scrollWidth - containerEl.offsetWidth;
            }
        }
    };
    /**
     * Moves the focus towards the beginning or the end of the list depending on the offset provided.
     * Valid offsets are 1 and -1.
     * @param {?} offset
     * @return {?}
     */
    MdTabHeader.prototype._moveFocus = function (offset) {
        if (this._labelWrappers) {
            var /** @type {?} */ tabs = this._labelWrappers.toArray();
            for (var /** @type {?} */ i = this.focusIndex + offset; i < tabs.length && i >= 0; i += offset) {
                if (this._isValidIndex(i)) {
                    this.focusIndex = i;
                    return;
                }
            }
        }
    };
    /**
     * Increment the focus index by 1 until a valid tab is found.
     * @return {?}
     */
    MdTabHeader.prototype._focusNextTab = function () {
        this._moveFocus(this._getLayoutDirection() == 'ltr' ? 1 : -1);
    };
    /**
     * Decrement the focus index by 1 until a valid tab is found.
     * @return {?}
     */
    MdTabHeader.prototype._focusPreviousTab = function () {
        this._moveFocus(this._getLayoutDirection() == 'ltr' ? -1 : 1);
    };
    /**
     * The layout direction of the containing app.
     * @return {?}
     */
    MdTabHeader.prototype._getLayoutDirection = function () {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    };
    /**
     * Performs the CSS transformation on the tab list that will cause the list to scroll.
     * @return {?}
     */
    MdTabHeader.prototype._updateTabScrollPosition = function () {
        var /** @type {?} */ scrollDistance = this.scrollDistance;
        var /** @type {?} */ translateX = this._getLayoutDirection() === 'ltr' ? -scrollDistance : scrollDistance;
        this._renderer.setStyle(this._tabList.nativeElement, 'transform', "translate3d(" + translateX + "px, 0, 0)");
    };
    Object.defineProperty(MdTabHeader.prototype, "scrollDistance", {
        /**
         * @return {?}
         */
        get: function () { return this._scrollDistance; },
        /**
         * Sets the distance in pixels that the tab header should be transformed in the X-axis.
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this._scrollDistance = Math.max(0, Math.min(this._getMaxScrollDistance(), v));
            // Mark that the scroll distance has changed so that after the view is checked, the CSS
            // transformation can move the header.
            this._scrollDistanceChanged = true;
            this._checkScrollingControls();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Moves the tab list in the 'before' or 'after' direction (towards the beginning of the list or
     * the end of the list, respectively). The distance to scroll is computed to be a third of the
     * length of the tab list view window.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     * @param {?} scrollDir
     * @return {?}
     */
    MdTabHeader.prototype._scrollHeader = function (scrollDir) {
        var /** @type {?} */ viewLength = this._tabListContainer.nativeElement.offsetWidth;
        // Move the scroll distance one-third the length of the tab list's viewport.
        this.scrollDistance += (scrollDir == 'before' ? -1 : 1) * viewLength / 3;
    };
    /**
     * Moves the tab list such that the desired tab label (marked by index) is moved into view.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     * @param {?} labelIndex
     * @return {?}
     */
    MdTabHeader.prototype._scrollToLabel = function (labelIndex) {
        var /** @type {?} */ selectedLabel = this._labelWrappers
            ? this._labelWrappers.toArray()[labelIndex]
            : null;
        if (!selectedLabel) {
            return;
        }
        // The view length is the visible width of the tab labels.
        var /** @type {?} */ viewLength = this._tabListContainer.nativeElement.offsetWidth;
        var /** @type {?} */ labelBeforePos, /** @type {?} */ labelAfterPos;
        if (this._getLayoutDirection() == 'ltr') {
            labelBeforePos = selectedLabel.getOffsetLeft();
            labelAfterPos = labelBeforePos + selectedLabel.getOffsetWidth();
        }
        else {
            labelAfterPos = this._tabList.nativeElement.offsetWidth - selectedLabel.getOffsetLeft();
            labelBeforePos = labelAfterPos - selectedLabel.getOffsetWidth();
        }
        var /** @type {?} */ beforeVisiblePos = this.scrollDistance;
        var /** @type {?} */ afterVisiblePos = this.scrollDistance + viewLength;
        if (labelBeforePos < beforeVisiblePos) {
            // Scroll header to move label to the before direction
            this.scrollDistance -= beforeVisiblePos - labelBeforePos + EXAGGERATED_OVERSCROLL;
        }
        else if (labelAfterPos > afterVisiblePos) {
            // Scroll header to move label to the after direction
            this.scrollDistance += labelAfterPos - afterVisiblePos + EXAGGERATED_OVERSCROLL;
        }
    };
    /**
     * Evaluate whether the pagination controls should be displayed. If the scroll width of the
     * tab list is wider than the size of the header container, then the pagination controls should
     * be shown.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     * @return {?}
     */
    MdTabHeader.prototype._checkPaginationEnabled = function () {
        this._showPaginationControls =
            this._tabList.nativeElement.scrollWidth > this._elementRef.nativeElement.offsetWidth;
        if (!this._showPaginationControls) {
            this.scrollDistance = 0;
        }
    };
    /**
     * Evaluate whether the before and after controls should be enabled or disabled.
     * If the header is at the beginning of the list (scroll distance is equal to 0) then disable the
     * before button. If the header is at the end of the list (scroll distance is equal to the
     * maximum distance we can scroll), then disable the after button.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     * @return {?}
     */
    MdTabHeader.prototype._checkScrollingControls = function () {
        // Check if the pagination arrows should be activated.
        this._disableScrollBefore = this.scrollDistance == 0;
        this._disableScrollAfter = this.scrollDistance == this._getMaxScrollDistance();
    };
    /**
     * Determines what is the maximum length in pixels that can be set for the scroll distance. This
     * is equal to the difference in width between the tab list container and tab header container.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     * @return {?}
     */
    MdTabHeader.prototype._getMaxScrollDistance = function () {
        var /** @type {?} */ lengthOfTabList = this._tabList.nativeElement.scrollWidth;
        var /** @type {?} */ viewLength = this._tabListContainer.nativeElement.offsetWidth;
        return (lengthOfTabList - viewLength) || 0;
    };
    /**
     * Tells the ink-bar to align itself to the current label wrapper
     * @return {?}
     */
    MdTabHeader.prototype._alignInkBarToSelectedTab = function () {
        var /** @type {?} */ selectedLabelWrapper = this._labelWrappers && this._labelWrappers.length
            ? this._labelWrappers.toArray()[this.selectedIndex].elementRef.nativeElement
            : null;
        this._inkBar.alignToElement(selectedLabelWrapper);
    };
    return MdTabHeader;
}());
MdTabHeader.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-tab-header, mat-tab-header',
                template: "<div class=\"mat-tab-header-pagination mat-tab-header-pagination-before mat-elevation-z4\" aria-hidden=\"true\" md-ripple [mdRippleDisabled]=\"_disableScrollBefore || disableRipple\" [class.mat-tab-header-pagination-disabled]=\"_disableScrollBefore\" (click)=\"_scrollHeader('before')\"><div class=\"mat-tab-header-pagination-chevron\"></div></div><div class=\"mat-tab-label-container\" #tabListContainer (keydown)=\"_handleKeydown($event)\"><div class=\"mat-tab-list\" #tabList role=\"tablist\" (cdkObserveContent)=\"_onContentChanges()\"><div class=\"mat-tab-labels\"><ng-content></ng-content></div><md-ink-bar></md-ink-bar></div></div><div class=\"mat-tab-header-pagination mat-tab-header-pagination-after mat-elevation-z4\" aria-hidden=\"true\" md-ripple [mdRippleDisabled]=\"_disableScrollAfter || disableRipple\" [class.mat-tab-header-pagination-disabled]=\"_disableScrollAfter\" (click)=\"_scrollHeader('after')\"><div class=\"mat-tab-header-pagination-chevron\"></div></div>",
                styles: [".mat-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-tab-label{line-height:48px;height:48px;padding:0 12px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;position:relative}.mat-tab-label:focus{outline:0;opacity:1}.mat-tab-label.mat-tab-disabled{cursor:default;pointer-events:none}@media (max-width:600px){.mat-tab-label{min-width:72px}}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:.5s cubic-bezier(.35,0,.25,1)}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}.mat-tab-header-pagination{position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2}.mat-tab-header-pagination-controls-enabled .mat-tab-header-pagination{display:flex}.mat-tab-header-pagination-before,.mat-tab-header-rtl .mat-tab-header-pagination-after{padding-left:4px}.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-tab-header-pagination-after,.mat-tab-header-rtl .mat-tab-header-pagination-before{padding-right:4px}.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-before .mat-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;content:'';height:8px;width:8px}.mat-tab-header-pagination-disabled{box-shadow:none;cursor:default}.mat-tab-header-pagination-disabled .mat-tab-header-pagination-chevron{border-color:#ccc}.mat-tab-label-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.mat-tab-list{flex-grow:1;position:relative;transition:transform .5s cubic-bezier(.35,0,.25,1)}.mat-tab-labels{display:flex}"],
                encapsulation: _angular_core.ViewEncapsulation.None,
                host: {
                    'class': 'mat-tab-header',
                    '[class.mat-tab-header-pagination-controls-enabled]': '_showPaginationControls',
                    '[class.mat-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
                }
            },] },
];
/**
 * @nocollapse
 */
MdTabHeader.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.NgZone, },
    { type: _angular_core.Renderer2, },
    { type: _angular_cdk.Directionality, decorators: [{ type: _angular_core.Optional },] },
]; };
MdTabHeader.propDecorators = {
    '_labelWrappers': [{ type: _angular_core.ContentChildren, args: [MdTabLabelWrapper,] },],
    '_inkBar': [{ type: _angular_core.ViewChild, args: [MdInkBar,] },],
    '_tabListContainer': [{ type: _angular_core.ViewChild, args: ['tabListContainer',] },],
    '_tabList': [{ type: _angular_core.ViewChild, args: ['tabList',] },],
    'selectedIndex': [{ type: _angular_core.Input },],
    'disableRipple': [{ type: _angular_core.Input },],
    'selectFocusedIndex': [{ type: _angular_core.Output },],
    'indexFocused': [{ type: _angular_core.Output },],
};
var MdTabsModule = (function () {
    function MdTabsModule() {
    }
    return MdTabsModule;
}());
MdTabsModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule,
                    _angular_cdk.PortalModule,
                    MdRippleModule,
                    _angular_cdk.ObserveContentModule,
                    ScrollDispatchModule,
                ],
                // Don't export all components because some are only to be used internally.
                exports: [
                    MdTabGroup,
                    MdTabLabel,
                    MdTab,
                    MdTabNav,
                    MdTabLink,
                ],
                declarations: [
                    MdTabGroup,
                    MdTabLabel,
                    MdTab,
                    MdInkBar,
                    MdTabLabelWrapper,
                    MdTabNav,
                    MdTabLink,
                    MdTabBody,
                    MdTabHeader
                ],
                providers: [VIEWPORT_RULER_PROVIDER],
            },] },
];
/**
 * @nocollapse
 */
MdTabsModule.ctorParameters = function () { return []; };
var MdToolbarRow = (function () {
    function MdToolbarRow() {
    }
    return MdToolbarRow;
}());
MdToolbarRow.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-toolbar-row, mat-toolbar-row',
                host: { 'class': 'mat-toolbar-row' },
            },] },
];
/**
 * @nocollapse
 */
MdToolbarRow.ctorParameters = function () { return []; };
/**
 * \@docs-private
 */
var MdToolbarBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdToolbarBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdToolbarBase;
}());
var _MdToolbarMixinBase = mixinColor(MdToolbarBase);
var MdToolbar = (function (_super) {
    __extends(MdToolbar, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     */
    function MdToolbar(renderer, elementRef) {
        return _super.call(this, renderer, elementRef) || this;
    }
    return MdToolbar;
}(_MdToolbarMixinBase));
MdToolbar.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-toolbar, mat-toolbar',
                template: "<div class=\"mat-toolbar-layout\"><md-toolbar-row><ng-content></ng-content></md-toolbar-row><ng-content select=\"md-toolbar-row, mat-toolbar-row\"></ng-content></div>",
                styles: [".mat-toolbar{display:flex;box-sizing:border-box;width:100%;padding:0 16px;flex-direction:column}.mat-toolbar .mat-toolbar-row{display:flex;box-sizing:border-box;width:100%;flex-direction:row;align-items:center;white-space:nowrap}.mat-toolbar{min-height:64px}.mat-toolbar-row{height:64px}@media (max-width:600px){.mat-toolbar{min-height:56px}.mat-toolbar-row{height:56px}}"],
                inputs: ['color'],
                host: {
                    'class': 'mat-toolbar',
                    'role': 'toolbar'
                },
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                encapsulation: _angular_core.ViewEncapsulation.None
            },] },
];
/**
 * @nocollapse
 */
MdToolbar.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
]; };
var MdToolbarModule = (function () {
    function MdToolbarModule() {
    }
    return MdToolbarModule;
}());
MdToolbarModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [MdCommonModule],
                exports: [MdToolbar, MdToolbarRow, MdCommonModule],
                declarations: [MdToolbar, MdToolbarRow],
            },] },
];
/**
 * @nocollapse
 */
MdToolbarModule.ctorParameters = function () { return []; };
/**
 * Time in ms to delay before changing the tooltip visibility to hidden
 */
var TOUCHEND_HIDE_DELAY = 1500;
/**
 * Time in ms to throttle repositioning after scroll events.
 */
var SCROLL_THROTTLE_MS = 20;
/**
 * Creates an error to be thrown if the user supplied an invalid tooltip position.
 * @param {?} position
 * @return {?}
 */
function getMdTooltipInvalidPositionError(position) {
    return Error("Tooltip position \"" + position + "\" is invalid.");
}
/**
 * Directive that attaches a material design tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 *
 * https://material.google.com/components/tooltips.html
 */
var MdTooltip = (function () {
    /**
     * @param {?} _overlay
     * @param {?} _elementRef
     * @param {?} _scrollDispatcher
     * @param {?} _viewContainerRef
     * @param {?} _ngZone
     * @param {?} _renderer
     * @param {?} _platform
     * @param {?} _dir
     */
    function MdTooltip(_overlay, _elementRef, _scrollDispatcher, _viewContainerRef, _ngZone, _renderer, _platform, _dir) {
        var _this = this;
        this._overlay = _overlay;
        this._elementRef = _elementRef;
        this._scrollDispatcher = _scrollDispatcher;
        this._viewContainerRef = _viewContainerRef;
        this._ngZone = _ngZone;
        this._renderer = _renderer;
        this._platform = _platform;
        this._dir = _dir;
        this._position = 'below';
        this._disabled = false;
        /**
         * The default delay in ms before showing the tooltip after show is called
         */
        this.showDelay = 0;
        /**
         * The default delay in ms before hiding the tooltip after hide is called
         */
        this.hideDelay = 0;
        // The mouse events shouldn't be bound on iOS devices, because
        // they can prevent the first tap from firing its click event.
        if (!_platform.IOS) {
            this._enterListener =
                _renderer.listen(_elementRef.nativeElement, 'mouseenter', function () { return _this.show(); });
            this._leaveListener =
                _renderer.listen(_elementRef.nativeElement, 'mouseleave', function () { return _this.hide(); });
        }
    }
    Object.defineProperty(MdTooltip.prototype, "position", {
        /**
         * Allows the user to define the position of the tooltip relative to the parent element
         * @return {?}
         */
        get: function () { return this._position; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value !== this._position) {
                this._position = value;
                // TODO(andrewjs): When the overlay's position can be dynamically changed, do not destroy
                // the tooltip.
                if (this._tooltipInstance) {
                    this._disposeTooltip();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "disabled", {
        /**
         * Disables the display of the tooltip.
         * @return {?}
         */
        get: function () { return this._disabled; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = _angular_cdk.coerceBooleanProperty(value);
            // If tooltip is disabled, hide immediately.
            if (this._disabled) {
                this.hide(0);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_positionDeprecated", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this._position; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._position = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "message", {
        /**
         * The message to be displayed in the tooltip
         * @return {?}
         */
        get: function () { return this._message; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._message = value;
            this._setTooltipMessage(this._message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "tooltipClass", {
        /**
         * Classes to be passed to the tooltip. Supports the same syntax as `ngClass`.
         * @return {?}
         */
        get: function () { return this._tooltipClass; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._tooltipClass = value;
            if (this._tooltipInstance) {
                this._setTooltipClass(this._tooltipClass);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_deprecatedMessage", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this.message; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.message = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_matMessage", {
        /**
         * @return {?}
         */
        get: function () { return this.message; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.message = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_matPosition", {
        /**
         * @return {?}
         */
        get: function () { return this.position; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.position = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_matDisabled", {
        /**
         * @return {?}
         */
        get: function () { return this.disabled; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.disabled = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_matHideDelay", {
        /**
         * @return {?}
         */
        get: function () { return this.hideDelay; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.hideDelay = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_matShowDelay", {
        /**
         * @return {?}
         */
        get: function () { return this.showDelay; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.showDelay = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_matClass", {
        /**
         * @return {?}
         */
        get: function () { return this.tooltipClass; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.tooltipClass = v; },
        enumerable: true,
        configurable: true
    });
    /**
     * Dispose the tooltip when destroyed.
     * @return {?}
     */
    MdTooltip.prototype.ngOnDestroy = function () {
        if (this._tooltipInstance) {
            this._disposeTooltip();
        }
        // Clean up the event listeners set in the constructor
        if (!this._platform.IOS) {
            this._enterListener();
            this._leaveListener();
        }
    };
    /**
     * Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input
     * @param {?=} delay
     * @return {?}
     */
    MdTooltip.prototype.show = function (delay) {
        if (delay === void 0) { delay = this.showDelay; }
        if (this.disabled || !this._message || !this._message.trim()) {
            return;
        }
        if (!this._tooltipInstance) {
            this._createTooltip();
        }
        this._setTooltipClass(this._tooltipClass);
        this._setTooltipMessage(this._message); /** @type {?} */
        ((this._tooltipInstance)).show(this._position, delay);
    };
    /**
     * Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input
     * @param {?=} delay
     * @return {?}
     */
    MdTooltip.prototype.hide = function (delay) {
        if (delay === void 0) { delay = this.hideDelay; }
        if (this._tooltipInstance) {
            this._tooltipInstance.hide(delay);
        }
    };
    /**
     * Shows/hides the tooltip
     * @return {?}
     */
    MdTooltip.prototype.toggle = function () {
        this._isTooltipVisible() ? this.hide() : this.show();
    };
    /**
     * Returns true if the tooltip is currently visible to the user
     * @return {?}
     */
    MdTooltip.prototype._isTooltipVisible = function () {
        return !!this._tooltipInstance && this._tooltipInstance.isVisible();
    };
    /**
     * Create the tooltip to display
     * @return {?}
     */
    MdTooltip.prototype._createTooltip = function () {
        var _this = this;
        var /** @type {?} */ overlayRef = this._createOverlay();
        var /** @type {?} */ portal = new _angular_cdk.ComponentPortal(TooltipComponent, this._viewContainerRef);
        this._tooltipInstance = overlayRef.attach(portal).instance; /** @type {?} */
        ((
        // Dispose the overlay when finished the shown tooltip.
        this._tooltipInstance)).afterHidden().subscribe(function () {
            // Check first if the tooltip has already been removed through this components destroy.
            if (_this._tooltipInstance) {
                _this._disposeTooltip();
            }
        });
    };
    /**
     * Create the overlay config and position strategy
     * @return {?}
     */
    MdTooltip.prototype._createOverlay = function () {
        var _this = this;
        var /** @type {?} */ origin = this._getOrigin();
        var /** @type {?} */ position = this._getOverlayPosition();
        // Create connected position strategy that listens for scroll events to reposition.
        // After position changes occur and the overlay is clipped by a parent scrollable then
        // close the tooltip.
        var /** @type {?} */ strategy = this._overlay.position().connectedTo(this._elementRef, origin, position);
        strategy.withScrollableContainers(this._scrollDispatcher.getScrollContainers(this._elementRef));
        strategy.onPositionChange.subscribe(function (change) {
            if (change.scrollableViewProperties.isOverlayClipped &&
                _this._tooltipInstance && _this._tooltipInstance.isVisible()) {
                _this.hide(0);
            }
        });
        var /** @type {?} */ config = new OverlayState();
        config.direction = this._dir ? this._dir.value : 'ltr';
        config.positionStrategy = strategy;
        config.scrollStrategy = this._overlay.scrollStrategies.reposition({
            scrollThrottle: SCROLL_THROTTLE_MS
        });
        this._overlayRef = this._overlay.create(config);
        return this._overlayRef;
    };
    /**
     * Disposes the current tooltip and the overlay it is attached to
     * @return {?}
     */
    MdTooltip.prototype._disposeTooltip = function () {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
        this._tooltipInstance = null;
    };
    /**
     * Returns the origin position based on the user's position preference
     * @return {?}
     */
    MdTooltip.prototype._getOrigin = function () {
        if (this.position == 'above' || this.position == 'below') {
            return { originX: 'center', originY: this.position == 'above' ? 'top' : 'bottom' };
        }
        var /** @type {?} */ isDirectionLtr = !this._dir || this._dir.value == 'ltr';
        if (this.position == 'left' ||
            this.position == 'before' && isDirectionLtr ||
            this.position == 'after' && !isDirectionLtr) {
            return { originX: 'start', originY: 'center' };
        }
        if (this.position == 'right' ||
            this.position == 'after' && isDirectionLtr ||
            this.position == 'before' && !isDirectionLtr) {
            return { originX: 'end', originY: 'center' };
        }
        throw getMdTooltipInvalidPositionError(this.position);
    };
    /**
     * Returns the overlay position based on the user's preference
     * @return {?}
     */
    MdTooltip.prototype._getOverlayPosition = function () {
        if (this.position == 'above') {
            return { overlayX: 'center', overlayY: 'bottom' };
        }
        if (this.position == 'below') {
            return { overlayX: 'center', overlayY: 'top' };
        }
        var /** @type {?} */ isLtr = !this._dir || this._dir.value == 'ltr';
        if (this.position == 'left' ||
            this.position == 'before' && isLtr ||
            this.position == 'after' && !isLtr) {
            return { overlayX: 'end', overlayY: 'center' };
        }
        if (this.position == 'right' ||
            this.position == 'after' && isLtr ||
            this.position == 'before' && !isLtr) {
            return { overlayX: 'start', overlayY: 'center' };
        }
        throw getMdTooltipInvalidPositionError(this.position);
    };
    /**
     * Updates the tooltip message and repositions the overlay according to the new message length
     * @param {?} message
     * @return {?}
     */
    MdTooltip.prototype._setTooltipMessage = function (message) {
        var _this = this;
        // Must wait for the message to be painted to the tooltip so that the overlay can properly
        // calculate the correct positioning based on the size of the text.
        if (this._tooltipInstance) {
            this._tooltipInstance.message = message;
            this._tooltipInstance._markForCheck();
            _angular_cdk.first.call(this._ngZone.onMicrotaskEmpty).subscribe(function () {
                if (_this._tooltipInstance) {
                    ((_this._overlayRef)).updatePosition();
                }
            });
        }
    };
    /**
     * Updates the tooltip class
     * @param {?} tooltipClass
     * @return {?}
     */
    MdTooltip.prototype._setTooltipClass = function (tooltipClass) {
        if (this._tooltipInstance) {
            this._tooltipInstance.tooltipClass = tooltipClass;
            this._tooltipInstance._markForCheck();
        }
    };
    return MdTooltip;
}());
MdTooltip.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-tooltip], [mdTooltip], [mat-tooltip], [matTooltip]',
                host: {
                    '(longpress)': 'show()',
                    '(touchend)': 'hide(' + TOUCHEND_HIDE_DELAY + ')',
                },
                exportAs: 'mdTooltip',
            },] },
];
/**
 * @nocollapse
 */
MdTooltip.ctorParameters = function () { return [
    { type: Overlay, },
    { type: _angular_core.ElementRef, },
    { type: ScrollDispatcher, },
    { type: _angular_core.ViewContainerRef, },
    { type: _angular_core.NgZone, },
    { type: _angular_core.Renderer2, },
    { type: _angular_cdk.Platform, },
    { type: _angular_cdk.Directionality, decorators: [{ type: _angular_core.Optional },] },
]; };
MdTooltip.propDecorators = {
    'position': [{ type: _angular_core.Input, args: ['mdTooltipPosition',] },],
    'disabled': [{ type: _angular_core.Input, args: ['mdTooltipDisabled',] },],
    '_positionDeprecated': [{ type: _angular_core.Input, args: ['tooltip-position',] },],
    'showDelay': [{ type: _angular_core.Input, args: ['mdTooltipShowDelay',] },],
    'hideDelay': [{ type: _angular_core.Input, args: ['mdTooltipHideDelay',] },],
    'message': [{ type: _angular_core.Input, args: ['mdTooltip',] },],
    'tooltipClass': [{ type: _angular_core.Input, args: ['mdTooltipClass',] },],
    '_deprecatedMessage': [{ type: _angular_core.Input, args: ['md-tooltip',] },],
    '_matMessage': [{ type: _angular_core.Input, args: ['matTooltip',] },],
    '_matPosition': [{ type: _angular_core.Input, args: ['matTooltipPosition',] },],
    '_matDisabled': [{ type: _angular_core.Input, args: ['matTooltipDisabled',] },],
    '_matHideDelay': [{ type: _angular_core.Input, args: ['matTooltipHideDelay',] },],
    '_matShowDelay': [{ type: _angular_core.Input, args: ['matTooltipShowDelay',] },],
    '_matClass': [{ type: _angular_core.Input, args: ['matTooltipClass',] },],
};
/**
 * Internal component that wraps the tooltip's content.
 * \@docs-private
 */
var TooltipComponent = (function () {
    /**
     * @param {?} _dir
     * @param {?} _changeDetectorRef
     */
    function TooltipComponent(_dir, _changeDetectorRef) {
        this._dir = _dir;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Property watched by the animation framework to show or hide the tooltip
         */
        this._visibility = 'initial';
        /**
         * Whether interactions on the page should close the tooltip
         */
        this._closeOnInteraction = false;
        /**
         * The transform origin used in the animation for showing and hiding the tooltip
         */
        this._transformOrigin = 'bottom';
        /**
         * Subject for notifying that the tooltip has been hidden from the view
         */
        this._onHide = new rxjs_Subject.Subject();
    }
    /**
     * Shows the tooltip with an animation originating from the provided origin
     * @param {?} position Position of the tooltip.
     * @param {?} delay Amount of milliseconds to the delay showing the tooltip.
     * @return {?}
     */
    TooltipComponent.prototype.show = function (position, delay) {
        var _this = this;
        // Cancel the delayed hide if it is scheduled
        if (this._hideTimeoutId) {
            clearTimeout(this._hideTimeoutId);
        }
        // Body interactions should cancel the tooltip if there is a delay in showing.
        this._closeOnInteraction = true;
        this._setTransformOrigin(position);
        this._showTimeoutId = setTimeout(function () {
            _this._visibility = 'visible';
            // If this was set to true immediately, then a body click that triggers show() would
            // trigger interaction and close the tooltip right after it was displayed.
            _this._closeOnInteraction = false;
            // Mark for check so if any parent component has set the
            // ChangeDetectionStrategy to OnPush it will be checked anyways
            _this._markForCheck();
            setTimeout(function () { return _this._closeOnInteraction = true; }, 0);
        }, delay);
    };
    /**
     * Begins the animation to hide the tooltip after the provided delay in ms.
     * @param {?} delay Amount of milliseconds to delay showing the tooltip.
     * @return {?}
     */
    TooltipComponent.prototype.hide = function (delay) {
        var _this = this;
        // Cancel the delayed show if it is scheduled
        if (this._showTimeoutId) {
            clearTimeout(this._showTimeoutId);
        }
        this._hideTimeoutId = setTimeout(function () {
            _this._visibility = 'hidden';
            _this._closeOnInteraction = false;
            // Mark for check so if any parent component has set the
            // ChangeDetectionStrategy to OnPush it will be checked anyways
            _this._markForCheck();
        }, delay);
    };
    /**
     * Returns an observable that notifies when the tooltip has been hidden from view
     * @return {?}
     */
    TooltipComponent.prototype.afterHidden = function () {
        return this._onHide.asObservable();
    };
    /**
     * Whether the tooltip is being displayed
     * @return {?}
     */
    TooltipComponent.prototype.isVisible = function () {
        return this._visibility === 'visible';
    };
    /**
     * Sets the tooltip transform origin according to the tooltip position
     * @param {?} value
     * @return {?}
     */
    TooltipComponent.prototype._setTransformOrigin = function (value) {
        var /** @type {?} */ isLtr = !this._dir || this._dir.value == 'ltr';
        switch (value) {
            case 'before':
                this._transformOrigin = isLtr ? 'right' : 'left';
                break;
            case 'after':
                this._transformOrigin = isLtr ? 'left' : 'right';
                break;
            case 'left':
                this._transformOrigin = 'right';
                break;
            case 'right':
                this._transformOrigin = 'left';
                break;
            case 'above':
                this._transformOrigin = 'bottom';
                break;
            case 'below':
                this._transformOrigin = 'top';
                break;
            default: throw getMdTooltipInvalidPositionError(value);
        }
    };
    /**
     * @param {?} e
     * @return {?}
     */
    TooltipComponent.prototype._afterVisibilityAnimation = function (e) {
        if (e.toState === 'hidden' && !this.isVisible()) {
            this._onHide.next();
        }
    };
    /**
     * Interactions on the HTML body should close the tooltip immediately as defined in the
     * material design spec.
     * https://material.google.com/components/tooltips.html#tooltips-interaction
     * @return {?}
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
     * @return {?}
     */
    TooltipComponent.prototype._markForCheck = function () {
        this._changeDetectorRef.markForCheck();
    };
    return TooltipComponent;
}());
TooltipComponent.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-tooltip-component, mat-tooltip-component',
                template: "<div class=\"mat-tooltip\" [ngClass]=\"tooltipClass\" [style.transform-origin]=\"_transformOrigin\" [@state]=\"_visibility\" (@state.done)=\"_afterVisibilityAnimation($event)\">{{message}}</div>",
                styles: [":host{pointer-events:none}.mat-tooltip{color:#fff;border-radius:2px;margin:14px;max-width:250px;padding-left:8px;padding-right:8px}@media screen and (-ms-high-contrast:active){.mat-tooltip{outline:solid 1px}}"],
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                animations: [
                    _angular_animations.trigger('state', [
                        _angular_animations.state('void', _angular_animations.style({ transform: 'scale(0)' })),
                        _angular_animations.state('initial', _angular_animations.style({ transform: 'scale(0)' })),
                        _angular_animations.state('visible', _angular_animations.style({ transform: 'scale(1)' })),
                        _angular_animations.state('hidden', _angular_animations.style({ transform: 'scale(0)' })),
                        _angular_animations.transition('* => visible', _angular_animations.animate('150ms cubic-bezier(0.0, 0.0, 0.2, 1)')),
                        _angular_animations.transition('* => hidden', _angular_animations.animate('150ms cubic-bezier(0.4, 0.0, 1, 1)')),
                    ])
                ],
                host: {
                    // Forces the element to have a layout in IE and Edge. This fixes issues where the element
                    // won't be rendered if the animations are disabled or there is no web animations polyfill.
                    '[style.zoom]': '_visibility === "visible" ? 1 : null',
                    '(body:click)': 'this._handleBodyInteraction()'
                }
            },] },
];
/**
 * @nocollapse
 */
TooltipComponent.ctorParameters = function () { return [
    { type: _angular_cdk.Directionality, decorators: [{ type: _angular_core.Optional },] },
    { type: _angular_core.ChangeDetectorRef, },
]; };
var MdTooltipModule = (function () {
    function MdTooltipModule() {
    }
    return MdTooltipModule;
}());
MdTooltipModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule,
                    OverlayModule,
                    MdCommonModule,
                    _angular_cdk.PlatformModule
                ],
                exports: [MdTooltip, TooltipComponent, MdCommonModule],
                declarations: [MdTooltip, TooltipComponent],
                entryComponents: [TooltipComponent],
            },] },
];
/**
 * @nocollapse
 */
MdTooltipModule.ctorParameters = function () { return []; };
/**
 * Throws an exception for the case when menu trigger doesn't have a valid md-menu instance
 * \@docs-private
 * @return {?}
 */
function throwMdMenuMissingError() {
    throw Error("md-menu-trigger: must pass in an md-menu instance.\n\n    Example:\n      <md-menu #menu=\"mdMenu\"></md-menu>\n      <button [mdMenuTriggerFor]=\"menu\"></button>");
}
/**
 * Throws an exception for the case when menu's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 * \@docs-private
 * @return {?}
 */
function throwMdMenuInvalidPositionX() {
    throw Error("x-position value must be either 'before' or after'.\n      Example: <md-menu x-position=\"before\" #menu=\"mdMenu\"></md-menu>");
}
/**
 * Throws an exception for the case when menu's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 * \@docs-private
 * @return {?}
 */
function throwMdMenuInvalidPositionY() {
    throw Error("y-position value must be either 'above' or below'.\n      Example: <md-menu y-position=\"above\" #menu=\"mdMenu\"></md-menu>");
}
/**
 * \@docs-private
 */
var MdMenuItemBase = (function () {
    function MdMenuItemBase() {
    }
    return MdMenuItemBase;
}());
var _MdMenuItemMixinBase = mixinDisabled(MdMenuItemBase);
/**
 * This directive is intended to be used inside an md-menu tag.
 * It exists mostly to set the role attribute.
 */
var MdMenuItem = (function (_super) {
    __extends(MdMenuItem, _super);
    /**
     * @param {?} _elementRef
     */
    function MdMenuItem(_elementRef) {
        var _this = _super.call(this) || this;
        _this._elementRef = _elementRef;
        return _this;
    }
    /**
     * Focuses the menu item.
     * @return {?}
     */
    MdMenuItem.prototype.focus = function () {
        this._getHostElement().focus();
    };
    /**
     * Used to set the `tabindex`.
     * @return {?}
     */
    MdMenuItem.prototype._getTabIndex = function () {
        return this.disabled ? '-1' : '0';
    };
    /**
     * Returns the host DOM element.
     * @return {?}
     */
    MdMenuItem.prototype._getHostElement = function () {
        return this._elementRef.nativeElement;
    };
    /**
     * Prevents the default element actions if it is disabled.
     * @param {?} event
     * @return {?}
     */
    MdMenuItem.prototype._checkDisabled = function (event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    };
    return MdMenuItem;
}(_MdMenuItemMixinBase));
MdMenuItem.decorators = [
    { type: _angular_core.Component, args: [{ selector: '[md-menu-item], [mat-menu-item]',
                inputs: ['disabled'],
                host: {
                    'role': 'menuitem',
                    'class': 'mat-menu-item',
                    '[attr.tabindex]': '_getTabIndex()',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.disabled]': 'disabled || null',
                    '(click)': '_checkDisabled($event)',
                },
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                template: "<ng-content></ng-content><div class=\"mat-menu-ripple\" *ngIf=\"!disabled\" md-ripple [mdRippleTrigger]=\"_getHostElement()\"></div>",
                exportAs: 'mdMenuItem',
            },] },
];
/**
 * @nocollapse
 */
MdMenuItem.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
]; };
/**
 * Below are all the animations for the md-menu component.
 * Animation duration and timing values are based on AngularJS Material.
 */
/**
 * This animation controls the menu panel's entry and exit from the page.
 *
 * When the menu panel is added to the DOM, it scales in and fades in its border.
 *
 * When the menu panel is removed from the DOM, it simply fades out after a brief
 * delay to display the ripple.
 */
// TODO(kara): switch to :enter and :leave once Mobile Safari is sorted out.
var transformMenu = _angular_animations.trigger('transformMenu', [
    _angular_animations.state('showing', _angular_animations.style({
        opacity: 1,
        transform: "scale(1)"
    })),
    _angular_animations.transition('void => *', [
        _angular_animations.style({
            opacity: 0,
            transform: "scale(0)"
        }),
        _angular_animations.animate("200ms cubic-bezier(0.25, 0.8, 0.25, 1)")
    ]),
    _angular_animations.transition('* => void', [
        _angular_animations.animate('50ms 100ms linear', _angular_animations.style({ opacity: 0 }))
    ])
]);
/**
 * This animation fades in the background color and content of the menu panel
 * after its containing element is scaled in.
 */
var fadeInItems = _angular_animations.trigger('fadeInItems', [
    _angular_animations.state('showing', _angular_animations.style({ opacity: 1 })),
    _angular_animations.transition('void => *', [
        _angular_animations.style({ opacity: 0 }),
        _angular_animations.animate("200ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)")
    ])
]);
var MdMenu = (function () {
    /**
     * @param {?} _elementRef
     */
    function MdMenu(_elementRef) {
        this._elementRef = _elementRef;
        this._xPosition = 'after';
        this._yPosition = 'below';
        /**
         * Config object to be passed into the menu's ngClass
         */
        this._classList = {};
        /**
         * Whether the menu should overlap its trigger.
         */
        this.overlapTrigger = true;
        /**
         * Event emitted when the menu is closed.
         */
        this.close = new _angular_core.EventEmitter();
    }
    Object.defineProperty(MdMenu.prototype, "xPosition", {
        /**
         * Position of the menu in the X axis.
         * @return {?}
         */
        get: function () { return this._xPosition; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value !== 'before' && value !== 'after') {
                throwMdMenuInvalidPositionX();
            }
            this._xPosition = value;
            this.setPositionClasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMenu.prototype, "yPosition", {
        /**
         * Position of the menu in the Y axis.
         * @return {?}
         */
        get: function () { return this._yPosition; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value !== 'above' && value !== 'below') {
                throwMdMenuInvalidPositionY();
            }
            this._yPosition = value;
            this.setPositionClasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMenu.prototype, "classList", {
        /**
         * This method takes classes set on the host md-menu element and applies them on the
         * menu template that displays in the overlay container.  Otherwise, it's difficult
         * to style the containing menu from outside the component.
         * @param {?} classes list of class names
         * @return {?}
         */
        set: function (classes) {
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
    /**
     * @return {?}
     */
    MdMenu.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._keyManager = new FocusKeyManager(this.items).withWrap();
        this._tabSubscription = this._keyManager.tabOut.subscribe(function () { return _this._emitCloseEvent(); });
    };
    /**
     * @return {?}
     */
    MdMenu.prototype.ngOnDestroy = function () {
        if (this._tabSubscription) {
            this._tabSubscription.unsubscribe();
        }
        this._emitCloseEvent();
        this.close.complete();
    };
    /**
     * Handle a keyboard event from the menu, delegating to the appropriate action.
     * @param {?} event
     * @return {?}
     */
    MdMenu.prototype._handleKeydown = function (event) {
        switch (event.keyCode) {
            case _angular_cdk.ESCAPE:
                this._emitCloseEvent();
                return;
            default:
                this._keyManager.onKeydown(event);
        }
    };
    /**
     * Focus the first item in the menu. This method is used by the menu trigger
     * to focus the first item when the menu is opened by the ENTER key.
     * @return {?}
     */
    MdMenu.prototype.focusFirstItem = function () {
        this._keyManager.setFirstItemActive();
    };
    /**
     * This emits a close event to which the trigger is subscribed. When emitted, the
     * trigger will close the menu.
     * @return {?}
     */
    MdMenu.prototype._emitCloseEvent = function () {
        this.close.emit();
    };
    /**
     * It's necessary to set position-based classes to ensure the menu panel animation
     * folds out from the correct direction.
     * @param {?=} posX
     * @param {?=} posY
     * @return {?}
     */
    MdMenu.prototype.setPositionClasses = function (posX, posY) {
        if (posX === void 0) { posX = this.xPosition; }
        if (posY === void 0) { posY = this.yPosition; }
        this._classList['mat-menu-before'] = posX === 'before';
        this._classList['mat-menu-after'] = posX === 'after';
        this._classList['mat-menu-above'] = posY === 'above';
        this._classList['mat-menu-below'] = posY === 'below';
    };
    return MdMenu;
}());
MdMenu.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-menu, mat-menu',
                template: "<ng-template><div class=\"mat-menu-panel\" [ngClass]=\"_classList\" (keydown)=\"_handleKeydown($event)\" (click)=\"_emitCloseEvent()\" [@transformMenu]=\"'showing'\" role=\"menu\"><div class=\"mat-menu-content\" [@fadeInItems]=\"'showing'\"><ng-content></ng-content></div></div></ng-template>",
                styles: [".mat-menu-panel{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;max-height:calc(100vh - 48px)}.mat-menu-panel.mat-menu-after.mat-menu-below{transform-origin:left top}.mat-menu-panel.mat-menu-after.mat-menu-above{transform-origin:left bottom}.mat-menu-panel.mat-menu-before.mat-menu-below{transform-origin:right top}.mat-menu-panel.mat-menu-before.mat-menu-above{transform-origin:right bottom}[dir=rtl] .mat-menu-panel.mat-menu-after.mat-menu-below{transform-origin:right top}[dir=rtl] .mat-menu-panel.mat-menu-after.mat-menu-above{transform-origin:right bottom}[dir=rtl] .mat-menu-panel.mat-menu-before.mat-menu-below{transform-origin:left top}[dir=rtl] .mat-menu-panel.mat-menu-before.mat-menu-above{transform-origin:left bottom}@media screen and (-ms-high-contrast:active){.mat-menu-panel{outline:solid 1px}}.mat-menu-content{padding-top:8px;padding-bottom:8px}.mat-menu-item{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:0;border:none;-webkit-tap-highlight-color:transparent;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;position:relative}.mat-menu-item[disabled]{cursor:default}[dir=rtl] .mat-menu-item{text-align:right}.mat-menu-item .mat-icon{margin-right:16px}[dir=rtl] .mat-menu-item .mat-icon{margin-left:16px;margin-right:0}button.mat-menu-item{width:100%}.mat-menu-ripple{position:absolute;top:0;left:0;bottom:0;right:0}"],
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                encapsulation: _angular_core.ViewEncapsulation.None,
                animations: [
                    transformMenu,
                    fadeInItems
                ],
                exportAs: 'mdMenu'
            },] },
];
/**
 * @nocollapse
 */
MdMenu.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
]; };
MdMenu.propDecorators = {
    'xPosition': [{ type: _angular_core.Input },],
    'yPosition': [{ type: _angular_core.Input },],
    'templateRef': [{ type: _angular_core.ViewChild, args: [_angular_core.TemplateRef,] },],
    'items': [{ type: _angular_core.ContentChildren, args: [MdMenuItem,] },],
    'overlapTrigger': [{ type: _angular_core.Input },],
    'classList': [{ type: _angular_core.Input, args: ['class',] },],
    'close': [{ type: _angular_core.Output },],
};
/**
 * This directive is intended to be used in conjunction with an md-menu tag.  It is
 * responsible for toggling the display of the provided menu instance.
 */
var MdMenuTrigger = (function () {
    /**
     * @param {?} _overlay
     * @param {?} _element
     * @param {?} _viewContainerRef
     * @param {?} _dir
     */
    function MdMenuTrigger(_overlay, _element, _viewContainerRef, _dir) {
        this._overlay = _overlay;
        this._element = _element;
        this._viewContainerRef = _viewContainerRef;
        this._dir = _dir;
        this._overlayRef = null;
        this._menuOpen = false;
        this._openedByMouse = false;
        /**
         * Event emitted when the associated menu is opened.
         */
        this.onMenuOpen = new _angular_core.EventEmitter();
        /**
         * Event emitted when the associated menu is closed.
         */
        this.onMenuClose = new _angular_core.EventEmitter();
    }
    Object.defineProperty(MdMenuTrigger.prototype, "_deprecatedMdMenuTriggerFor", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this.menu; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.menu = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMenuTrigger.prototype, "_deprecatedMatMenuTriggerFor", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this.menu; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.menu = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMenuTrigger.prototype, "_matMenuTriggerFor", {
        /**
         * @return {?}
         */
        get: function () { return this.menu; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.menu = v; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdMenuTrigger.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._checkMenu();
        this.menu.close.subscribe(function () { return _this.closeMenu(); });
    };
    /**
     * @return {?}
     */
    MdMenuTrigger.prototype.ngOnDestroy = function () { this.destroyMenu(); };
    Object.defineProperty(MdMenuTrigger.prototype, "menuOpen", {
        /**
         * Whether the menu is open.
         * @return {?}
         */
        get: function () { return this._menuOpen; },
        enumerable: true,
        configurable: true
    });
    /**
     * Toggles the menu between the open and closed states.
     * @return {?}
     */
    MdMenuTrigger.prototype.toggleMenu = function () {
        return this._menuOpen ? this.closeMenu() : this.openMenu();
    };
    /**
     * Opens the menu.
     * @return {?}
     */
    MdMenuTrigger.prototype.openMenu = function () {
        if (!this._menuOpen) {
            this._createOverlay().attach(this._portal);
            this._subscribeToBackdrop();
            this._initMenu();
        }
    };
    /**
     * Closes the menu.
     * @return {?}
     */
    MdMenuTrigger.prototype.closeMenu = function () {
        if (this._overlayRef) {
            this._overlayRef.detach();
            this._backdropSubscription.unsubscribe();
            this._resetMenu();
        }
    };
    /**
     * Removes the menu from the DOM.
     * @return {?}
     */
    MdMenuTrigger.prototype.destroyMenu = function () {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
            this._cleanUpSubscriptions();
        }
    };
    /**
     * Focuses the menu trigger.
     * @return {?}
     */
    MdMenuTrigger.prototype.focus = function () {
        this._element.nativeElement.focus();
    };
    Object.defineProperty(MdMenuTrigger.prototype, "dir", {
        /**
         * The text direction of the containing app.
         * @return {?}
         */
        get: function () {
            return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method ensures that the menu closes when the overlay backdrop is clicked.
     * We do not use first() here because doing so would not catch clicks from within
     * the menu, and it would fail to unsubscribe properly. Instead, we unsubscribe
     * explicitly when the menu is closed or destroyed.
     * @return {?}
     */
    MdMenuTrigger.prototype._subscribeToBackdrop = function () {
        var _this = this;
        if (this._overlayRef) {
            this._backdropSubscription = this._overlayRef.backdropClick().subscribe(function () {
                _this.menu._emitCloseEvent();
            });
        }
    };
    /**
     * This method sets the menu state to open and focuses the first item if
     * the menu was opened via the keyboard.
     * @return {?}
     */
    MdMenuTrigger.prototype._initMenu = function () {
        this._setIsMenuOpen(true);
        // Should only set focus if opened via the keyboard, so keyboard users can
        // can easily navigate menu items. According to spec, mouse users should not
        // see the focus style.
        if (!this._openedByMouse) {
            this.menu.focusFirstItem();
        }
    };
    /**
     * This method resets the menu when it's closed, most importantly restoring
     * focus to the menu trigger if the menu was opened via the keyboard.
     * @return {?}
     */
    MdMenuTrigger.prototype._resetMenu = function () {
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
    MdMenuTrigger.prototype._setIsMenuOpen = function (isOpen) {
        this._menuOpen = isOpen;
        this._menuOpen ? this.onMenuOpen.emit() : this.onMenuClose.emit();
    };
    /**
     *  This method checks that a valid instance of MdMenu has been passed into
     *  mdMenuTriggerFor. If not, an exception is thrown.
     * @return {?}
     */
    MdMenuTrigger.prototype._checkMenu = function () {
        if (!this.menu) {
            throwMdMenuMissingError();
        }
    };
    /**
     *  This method creates the overlay from the provided menu's template and saves its
     *  OverlayRef so that it can be attached to the DOM when openMenu is called.
     * @return {?}
     */
    MdMenuTrigger.prototype._createOverlay = function () {
        if (!this._overlayRef) {
            this._portal = new _angular_cdk.TemplatePortal(this.menu.templateRef, this._viewContainerRef);
            var /** @type {?} */ config = this._getOverlayConfig();
            this._subscribeToPositions(/** @type {?} */ (config.positionStrategy));
            this._overlayRef = this._overlay.create(config);
        }
        return this._overlayRef;
    };
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @return {?} OverlayState
     */
    MdMenuTrigger.prototype._getOverlayConfig = function () {
        var /** @type {?} */ overlayState = new OverlayState();
        overlayState.positionStrategy = this._getPosition()
            .withDirection(this.dir);
        overlayState.hasBackdrop = true;
        overlayState.backdropClass = 'cdk-overlay-transparent-backdrop';
        overlayState.direction = this.dir;
        overlayState.scrollStrategy = this._overlay.scrollStrategies.reposition();
        return overlayState;
    };
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the menu based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     * @param {?} position
     * @return {?}
     */
    MdMenuTrigger.prototype._subscribeToPositions = function (position) {
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
    MdMenuTrigger.prototype._getPosition = function () {
        var _a = this.menu.xPosition === 'before' ? ['end', 'start'] : ['start', 'end'], posX = _a[0], fallbackX = _a[1];
        var _b = this.menu.yPosition === 'above' ? ['bottom', 'top'] : ['top', 'bottom'], overlayY = _b[0], fallbackOverlayY = _b[1];
        var /** @type {?} */ originY = overlayY;
        var /** @type {?} */ fallbackOriginY = fallbackOverlayY;
        if (!this.menu.overlapTrigger) {
            originY = overlayY === 'top' ? 'bottom' : 'top';
            fallbackOriginY = fallbackOverlayY === 'top' ? 'bottom' : 'top';
        }
        return this._overlay.position()
            .connectedTo(this._element, { originX: posX, originY: originY }, { overlayX: posX, overlayY: overlayY })
            .withFallbackPosition({ originX: fallbackX, originY: originY }, { overlayX: fallbackX, overlayY: overlayY })
            .withFallbackPosition({ originX: posX, originY: fallbackOriginY }, { overlayX: posX, overlayY: fallbackOverlayY })
            .withFallbackPosition({ originX: fallbackX, originY: fallbackOriginY }, { overlayX: fallbackX, overlayY: fallbackOverlayY });
    };
    /**
     * @return {?}
     */
    MdMenuTrigger.prototype._cleanUpSubscriptions = function () {
        if (this._backdropSubscription) {
            this._backdropSubscription.unsubscribe();
        }
        if (this._positionSubscription) {
            this._positionSubscription.unsubscribe();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdMenuTrigger.prototype._handleMousedown = function (event) {
        if (!_angular_cdk.isFakeMousedownFromScreenReader(event)) {
            this._openedByMouse = true;
        }
    };
    return MdMenuTrigger;
}());
MdMenuTrigger.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: "[md-menu-trigger-for], [mat-menu-trigger-for],\n             [mdMenuTriggerFor], [matMenuTriggerFor]",
                host: {
                    'aria-haspopup': 'true',
                    '(mousedown)': '_handleMousedown($event)',
                    '(click)': 'toggleMenu()',
                },
                exportAs: 'mdMenuTrigger'
            },] },
];
/**
 * @nocollapse
 */
MdMenuTrigger.ctorParameters = function () { return [
    { type: Overlay, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.ViewContainerRef, },
    { type: _angular_cdk.Directionality, decorators: [{ type: _angular_core.Optional },] },
]; };
MdMenuTrigger.propDecorators = {
    '_deprecatedMdMenuTriggerFor': [{ type: _angular_core.Input, args: ['md-menu-trigger-for',] },],
    '_deprecatedMatMenuTriggerFor': [{ type: _angular_core.Input, args: ['mat-menu-trigger-for',] },],
    '_matMenuTriggerFor': [{ type: _angular_core.Input, args: ['matMenuTriggerFor',] },],
    'menu': [{ type: _angular_core.Input, args: ['mdMenuTriggerFor',] },],
    'onMenuOpen': [{ type: _angular_core.Output },],
    'onMenuClose': [{ type: _angular_core.Output },],
};
var MdMenuModule = (function () {
    function MdMenuModule() {
    }
    return MdMenuModule;
}());
MdMenuModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    OverlayModule,
                    _angular_common.CommonModule,
                    MdRippleModule,
                    MdCommonModule,
                ],
                exports: [MdMenu, MdMenuItem, MdMenuTrigger, MdCommonModule],
                declarations: [MdMenu, MdMenuItem, MdMenuTrigger],
            },] },
];
/**
 * @nocollapse
 */
MdMenuModule.ctorParameters = function () { return []; };
/**
 * Custom injector type specifically for instantiating components with a dialog.
 */
var DialogInjector = (function () {
    /**
     * @param {?} _parentInjector
     * @param {?} _customTokens
     */
    function DialogInjector(_parentInjector, _customTokens) {
        this._parentInjector = _parentInjector;
        this._customTokens = _customTokens;
    }
    /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    DialogInjector.prototype.get = function (token, notFoundValue) {
        var /** @type {?} */ value = this._customTokens.get(token);
        if (typeof value !== 'undefined') {
            return value;
        }
        return this._parentInjector.get(token, notFoundValue);
    };
    return DialogInjector;
}());
/**
 * Configuration for opening a modal dialog with the MdDialog service.
 */
var MdDialogConfig = (function () {
    function MdDialogConfig() {
        /**
         * The ARIA role of the dialog element.
         */
        this.role = 'dialog';
        /**
         * Custom class for the overlay pane.
         */
        this.panelClass = '';
        /**
         * Whether the dialog has a backdrop.
         */
        this.hasBackdrop = true;
        /**
         * Custom class for the backdrop,
         */
        this.backdropClass = '';
        /**
         * Whether the user can use escape or clicking outside to close a modal.
         */
        this.disableClose = false;
        /**
         * Width of the dialog.
         */
        this.width = '';
        /**
         * Height of the dialog.
         */
        this.height = '';
        /**
         * Data being injected into the child component.
         */
        this.data = null;
        /**
         * Layout direction for the dialog's content.
         */
        this.direction = 'ltr';
        /**
         * ID of the element that describes the dialog.
         */
        this.ariaDescribedBy = null;
        // TODO(jelbourn): add configuration for lifecycle hooks, ARIA labelling.
    }
    return MdDialogConfig;
}());
/**
 * Reference to a dialog opened via the MdDialog service.
 */
var MdDialogRef = (function () {
    /**
     * @param {?} _overlayRef
     * @param {?} _containerInstance
     */
    function MdDialogRef(_overlayRef, _containerInstance) {
        var _this = this;
        this._overlayRef = _overlayRef;
        this._containerInstance = _containerInstance;
        /**
         * Whether the user is allowed to close the dialog.
         */
        this.disableClose = this._containerInstance._config.disableClose;
        /**
         * Subject for notifying the user that the dialog has finished closing.
         */
        this._afterClosed = new rxjs_Subject.Subject();
        _angular_cdk.filter.call(_containerInstance._onAnimationStateChange, function (event) { return event.toState === 'exit'; })
            .subscribe(function () { return _this._overlayRef.dispose(); }, undefined, function () {
            _this._afterClosed.next(_this._result);
            _this._afterClosed.complete();
            _this.componentInstance = null;
        });
    }
    /**
     * Close the dialog.
     * @param {?=} dialogResult Optional result to return to the dialog opener.
     * @return {?}
     */
    MdDialogRef.prototype.close = function (dialogResult) {
        this._result = dialogResult;
        this._containerInstance._state = 'exit';
        this._overlayRef.detachBackdrop(); // Transition the backdrop in parallel with the dialog.
    };
    /**
     * Gets an observable that is notified when the dialog is finished closing.
     * @return {?}
     */
    MdDialogRef.prototype.afterClosed = function () {
        return this._afterClosed.asObservable();
    };
    /**
     * Updates the dialog's position.
     * @param {?=} position New dialog position.
     * @return {?}
     */
    MdDialogRef.prototype.updatePosition = function (position) {
        var /** @type {?} */ strategy = this._getPositionStrategy();
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
     * @param {?=} width New width of the dialog.
     * @param {?=} height New height of the dialog.
     * @return {?}
     */
    MdDialogRef.prototype.updateSize = function (width, height) {
        if (width === void 0) { width = 'auto'; }
        if (height === void 0) { height = 'auto'; }
        this._getPositionStrategy().width(width).height(height);
        this._overlayRef.updatePosition();
        return this;
    };
    /**
     * Fetches the position strategy object from the overlay ref.
     * @return {?}
     */
    MdDialogRef.prototype._getPositionStrategy = function () {
        return (this._overlayRef.getState().positionStrategy);
    };
    return MdDialogRef;
}());
/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalHost without an origin.
 * \@docs-private
 * @return {?}
 */
function throwMdDialogContentAlreadyAttachedError() {
    throw Error('Attempting to attach dialog content after content is already attached');
}
/**
 * Internal component that wraps user-provided dialog content.
 * Animation is based on https://material.io/guidelines/motion/choreography.html.
 * \@docs-private
 */
var MdDialogContainer = (function (_super) {
    __extends(MdDialogContainer, _super);
    /**
     * @param {?} _ngZone
     * @param {?} _elementRef
     * @param {?} _focusTrapFactory
     * @param {?} _document
     */
    function MdDialogContainer(_ngZone, _elementRef, _focusTrapFactory, _document) {
        var _this = _super.call(this) || this;
        _this._ngZone = _ngZone;
        _this._elementRef = _elementRef;
        _this._focusTrapFactory = _focusTrapFactory;
        /**
         * Element that was focused before the dialog was opened. Save this to restore upon close.
         */
        _this._elementFocusedBeforeDialogWasOpened = null;
        /**
         * State of the dialog animation.
         */
        _this._state = 'enter';
        /**
         * Emits the current animation state whenever it changes.
         */
        _this._onAnimationStateChange = new _angular_core.EventEmitter();
        /**
         * ID of the element that should be considered as the dialog's label.
         */
        _this._ariaLabelledBy = null;
        _this._document = _document;
        return _this;
    }
    /**
     * Attach a ComponentPortal as content to this dialog container.
     * @template T
     * @param {?} portal Portal to be attached as the dialog content.
     * @return {?}
     */
    MdDialogContainer.prototype.attachComponentPortal = function (portal) {
        if (this._portalHost.hasAttached()) {
            throwMdDialogContentAlreadyAttachedError();
        }
        this._savePreviouslyFocusedElement();
        return this._portalHost.attachComponentPortal(portal);
    };
    /**
     * Attach a TemplatePortal as content to this dialog container.
     * @param {?} portal Portal to be attached as the dialog content.
     * @return {?}
     */
    MdDialogContainer.prototype.attachTemplatePortal = function (portal) {
        if (this._portalHost.hasAttached()) {
            throwMdDialogContentAlreadyAttachedError();
        }
        this._savePreviouslyFocusedElement();
        return this._portalHost.attachTemplatePortal(portal);
    };
    /**
     * Moves the focus inside the focus trap.
     * @return {?}
     */
    MdDialogContainer.prototype._trapFocus = function () {
        if (!this._focusTrap) {
            this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        }
        // If were to attempt to focus immediately, then the content of the dialog would not yet be
        // ready in instances where change detection has to run first. To deal with this, we simply
        // wait for the microtask queue to be empty.
        this._focusTrap.focusInitialElementWhenReady();
    };
    /**
     * Restores focus to the element that was focused before the dialog opened.
     * @return {?}
     */
    MdDialogContainer.prototype._restoreFocus = function () {
        var /** @type {?} */ toFocus = this._elementFocusedBeforeDialogWasOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (toFocus && 'focus' in toFocus) {
            toFocus.focus();
        }
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    };
    /**
     * Saves a reference to the element that was focused before the dialog was opened.
     * @return {?}
     */
    MdDialogContainer.prototype._savePreviouslyFocusedElement = function () {
        if (this._document) {
            this._elementFocusedBeforeDialogWasOpened = (this._document.activeElement);
        }
    };
    /**
     * Callback, invoked whenever an animation on the host completes.
     * @param {?} event
     * @return {?}
     */
    MdDialogContainer.prototype._onAnimationDone = function (event) {
        this._onAnimationStateChange.emit(event);
        if (event.toState === 'enter') {
            this._trapFocus();
        }
        else if (event.toState === 'exit') {
            this._restoreFocus();
            this._onAnimationStateChange.complete();
        }
    };
    return MdDialogContainer;
}(_angular_cdk.BasePortalHost));
MdDialogContainer.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-dialog-container, mat-dialog-container',
                template: "<ng-template cdkPortalHost></ng-template>",
                styles: [".mat-dialog-container{box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);display:block;padding:24px;border-radius:2px;box-sizing:border-box;overflow:auto;max-width:80vw;width:100%;height:100%}@media screen and (-ms-high-contrast:active){.mat-dialog-container{outline:solid 1px}}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:12px 0;display:flex;flex-wrap:wrap}.mat-dialog-actions:last-child{margin-bottom:-24px}.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions[align=center]{justify-content:center}"],
                encapsulation: _angular_core.ViewEncapsulation.None,
                animations: [
                    _angular_animations.trigger('slideDialog', [
                        // Note: The `enter` animation doesn't transition to something like `translate3d(0, 0, 0)
                        // scale(1)`, because for some reason specifying the transform explicitly, causes IE both
                        // to blur the dialog content and decimate the animation performance. Leaving it as `none`
                        // solves both issues.
                        _angular_animations.state('enter', _angular_animations.style({ transform: 'none', opacity: 1 })),
                        _angular_animations.state('void', _angular_animations.style({ transform: 'translate3d(0, 25%, 0) scale(0.9)', opacity: 0 })),
                        _angular_animations.state('exit', _angular_animations.style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })),
                        _angular_animations.transition('* => *', _angular_animations.animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
                    ])
                ],
                host: {
                    'class': 'mat-dialog-container',
                    '[attr.role]': '_config?.role',
                    '[attr.aria-labelledby]': '_ariaLabelledBy',
                    '[attr.aria-describedby]': '_config?.ariaDescribedBy || null',
                    '[@slideDialog]': '_state',
                    '(@slideDialog.done)': '_onAnimationDone($event)',
                },
            },] },
];
/**
 * @nocollapse
 */
MdDialogContainer.ctorParameters = function () { return [
    { type: _angular_core.NgZone, },
    { type: _angular_core.ElementRef, },
    { type: _angular_cdk.FocusTrapFactory, },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_platformBrowser.DOCUMENT,] },] },
]; };
MdDialogContainer.propDecorators = {
    '_portalHost': [{ type: _angular_core.ViewChild, args: [_angular_cdk.PortalHostDirective,] },],
};
var MD_DIALOG_DATA = new _angular_core.InjectionToken('MdDialogData');
/**
 * Service to open Material Design modal dialogs.
 */
var MdDialog = (function () {
    /**
     * @param {?} _overlay
     * @param {?} _injector
     * @param {?} _location
     * @param {?} _parentDialog
     */
    function MdDialog(_overlay, _injector, _location, _parentDialog) {
        var _this = this;
        this._overlay = _overlay;
        this._injector = _injector;
        this._location = _location;
        this._parentDialog = _parentDialog;
        this._openDialogsAtThisLevel = [];
        this._afterAllClosedAtThisLevel = new rxjs_Subject.Subject();
        this._afterOpenAtThisLevel = new rxjs_Subject.Subject();
        this._boundKeydown = this._handleKeydown.bind(this);
        /**
         * Gets an observable that is notified when a dialog has been opened.
         */
        this.afterOpen = this._afterOpen.asObservable();
        /**
         * Gets an observable that is notified when all open dialog have finished closing.
         */
        this.afterAllClosed = this._afterAllClosed.asObservable();
        // Close all of the dialogs when the user goes forwards/backwards in history or when the
        // location hash changes. Note that this usually doesn't include clicking on links (unless
        // the user is using the `HashLocationStrategy`).
        if (!_parentDialog && _location) {
            _location.subscribe(function () { return _this.closeAll(); });
        }
    }
    Object.defineProperty(MdDialog.prototype, "_openDialogs", {
        /**
         * Keeps track of the currently-open dialogs.
         * @return {?}
         */
        get: function () {
            return this._parentDialog ? this._parentDialog._openDialogs : this._openDialogsAtThisLevel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDialog.prototype, "_afterOpen", {
        /**
         * Subject for notifying the user that a dialog has opened.
         * @return {?}
         */
        get: function () {
            return this._parentDialog ? this._parentDialog._afterOpen : this._afterOpenAtThisLevel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDialog.prototype, "_afterAllClosed", {
        /**
         * Subject for notifying the user that all open dialogs have finished closing.
         * @return {?}
         */
        get: function () {
            return this._parentDialog ?
                this._parentDialog._afterAllClosed : this._afterAllClosedAtThisLevel;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Opens a modal dialog containing the given component.
     * @template T
     * @param {?} componentOrTemplateRef Type of the component to load into the dialog,
     *     or a TemplateRef to instantiate as the dialog content.
     * @param {?=} config Extra configuration options.
     * @return {?} Reference to the newly-opened dialog.
     */
    MdDialog.prototype.open = function (componentOrTemplateRef, config) {
        var _this = this;
        config = _applyConfigDefaults$1(config);
        var /** @type {?} */ overlayRef = this._createOverlay(config);
        var /** @type {?} */ dialogContainer = this._attachDialogContainer(overlayRef, config);
        var /** @type {?} */ dialogRef = this._attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config);
        if (!this._openDialogs.length) {
            document.addEventListener('keydown', this._boundKeydown);
        }
        this._openDialogs.push(dialogRef);
        dialogRef.afterClosed().subscribe(function () { return _this._removeOpenDialog(dialogRef); });
        this._afterOpen.next(dialogRef);
        return dialogRef;
    };
    /**
     * Closes all of the currently-open dialogs.
     * @return {?}
     */
    MdDialog.prototype.closeAll = function () {
        var /** @type {?} */ i = this._openDialogs.length;
        while (i--) {
            // The `_openDialogs` property isn't updated after close until the rxjs subscription
            // runs on the next microtask, in addition to modifying the array as we're going
            // through it. We loop through all of them and call close without assuming that
            // they'll be removed from the list instantaneously.
            this._openDialogs[i].close();
        }
    };
    /**
     * Creates the overlay into which the dialog will be loaded.
     * @param {?} config The dialog configuration.
     * @return {?} A promise resolving to the OverlayRef for the created overlay.
     */
    MdDialog.prototype._createOverlay = function (config) {
        var /** @type {?} */ overlayState = this._getOverlayState(config);
        return this._overlay.create(overlayState);
    };
    /**
     * Creates an overlay state from a dialog config.
     * @param {?} dialogConfig The dialog configuration.
     * @return {?} The overlay configuration.
     */
    MdDialog.prototype._getOverlayState = function (dialogConfig) {
        var /** @type {?} */ overlayState = new OverlayState();
        overlayState.panelClass = dialogConfig.panelClass;
        overlayState.hasBackdrop = dialogConfig.hasBackdrop;
        overlayState.scrollStrategy = this._overlay.scrollStrategies.block();
        overlayState.direction = dialogConfig.direction;
        if (dialogConfig.backdropClass) {
            overlayState.backdropClass = dialogConfig.backdropClass;
        }
        overlayState.positionStrategy = this._overlay.position().global();
        return overlayState;
    };
    /**
     * Attaches an MdDialogContainer to a dialog's already-created overlay.
     * @param {?} overlay Reference to the dialog's underlying overlay.
     * @param {?} config The dialog configuration.
     * @return {?} A promise resolving to a ComponentRef for the attached container.
     */
    MdDialog.prototype._attachDialogContainer = function (overlay, config) {
        var /** @type {?} */ containerPortal = new _angular_cdk.ComponentPortal(MdDialogContainer, config.viewContainerRef);
        var /** @type {?} */ containerRef = overlay.attach(containerPortal);
        containerRef.instance._config = config;
        return containerRef.instance;
    };
    /**
     * Attaches the user-provided component to the already-created MdDialogContainer.
     * @template T
     * @param {?} componentOrTemplateRef The type of component being loaded into the dialog,
     *     or a TemplateRef to instantiate as the content.
     * @param {?} dialogContainer Reference to the wrapping MdDialogContainer.
     * @param {?} overlayRef Reference to the overlay in which the dialog resides.
     * @param {?} config The dialog configuration.
     * @return {?} A promise resolving to the MdDialogRef that should be returned to the user.
     */
    MdDialog.prototype._attachDialogContent = function (componentOrTemplateRef, dialogContainer, overlayRef, config) {
        // Create a reference to the dialog we're creating in order to give the user a handle
        // to modify and close it.
        var /** @type {?} */ dialogRef = new MdDialogRef(overlayRef, dialogContainer);
        // When the dialog backdrop is clicked, we want to close it.
        if (config.hasBackdrop) {
            overlayRef.backdropClick().subscribe(function () {
                if (!dialogRef.disableClose) {
                    dialogRef.close();
                }
            });
        }
        if (componentOrTemplateRef instanceof _angular_core.TemplateRef) {
            dialogContainer.attachTemplatePortal(new _angular_cdk.TemplatePortal(componentOrTemplateRef, /** @type {?} */ ((null))));
        }
        else {
            var /** @type {?} */ injector = this._createInjector(config, dialogRef, dialogContainer);
            var /** @type {?} */ contentRef = dialogContainer.attachComponentPortal(new _angular_cdk.ComponentPortal(componentOrTemplateRef, undefined, injector));
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
     * @template T
     * @param {?} config Config object that is used to construct the dialog.
     * @param {?} dialogRef Reference to the dialog.
     * @param {?} dialogContainer
     * @return {?} The custom injector that can be used inside the dialog.
     */
    MdDialog.prototype._createInjector = function (config, dialogRef, dialogContainer) {
        var /** @type {?} */ userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        var /** @type {?} */ injectionTokens = new WeakMap();
        injectionTokens.set(MdDialogRef, dialogRef);
        injectionTokens.set(MdDialogContainer, dialogContainer);
        injectionTokens.set(MD_DIALOG_DATA, config.data);
        return new DialogInjector(userInjector || this._injector, injectionTokens);
    };
    /**
     * Removes a dialog from the array of open dialogs.
     * @param {?} dialogRef Dialog to be removed.
     * @return {?}
     */
    MdDialog.prototype._removeOpenDialog = function (dialogRef) {
        var /** @type {?} */ index = this._openDialogs.indexOf(dialogRef);
        if (index > -1) {
            this._openDialogs.splice(index, 1);
            // no open dialogs are left, call next on afterAllClosed Subject
            if (!this._openDialogs.length) {
                this._afterAllClosed.next();
                document.removeEventListener('keydown', this._boundKeydown);
            }
        }
    };
    /**
     * Handles global key presses while there are open dialogs. Closes the
     * top dialog when the user presses escape.
     * @param {?} event
     * @return {?}
     */
    MdDialog.prototype._handleKeydown = function (event) {
        var /** @type {?} */ topDialog = this._openDialogs[this._openDialogs.length - 1];
        var /** @type {?} */ canClose = topDialog ? !topDialog.disableClose : false;
        if (event.keyCode === _angular_cdk.ESCAPE && canClose) {
            topDialog.close();
        }
    };
    return MdDialog;
}());
MdDialog.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
MdDialog.ctorParameters = function () { return [
    { type: Overlay, },
    { type: _angular_core.Injector, },
    { type: _angular_common.Location, decorators: [{ type: _angular_core.Optional },] },
    { type: MdDialog, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.SkipSelf },] },
]; };
/**
 * Applies default options to the dialog config.
 * @param {?=} config Config to be modified.
 * @return {?} The new configuration object.
 */
function _applyConfigDefaults$1(config) {
    return extendObject(new MdDialogConfig(), config);
}
/**
 * Counter used to generate unique IDs for dialog elements.
 */
var dialogElementUid = 0;
/**
 * Button that will close the current dialog.
 */
var MdDialogClose = (function () {
    /**
     * @param {?} dialogRef
     */
    function MdDialogClose(dialogRef) {
        this.dialogRef = dialogRef;
        /**
         * Screenreader label for the button.
         */
        this.ariaLabel = 'Close dialog';
    }
    Object.defineProperty(MdDialogClose.prototype, "_matDialogClose", {
        /**
         * Dialog close input for compatibility mode.
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this.dialogResult = value; },
        enumerable: true,
        configurable: true
    });
    return MdDialogClose;
}());
MdDialogClose.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'button[md-dialog-close], button[mat-dialog-close],' +
                    'button[mdDialogClose], button[matDialogClose]',
                host: {
                    '(click)': 'dialogRef.close(dialogResult)',
                    '[attr.aria-label]': 'ariaLabel',
                    'type': 'button',
                }
            },] },
];
/**
 * @nocollapse
 */
MdDialogClose.ctorParameters = function () { return [
    { type: MdDialogRef, },
]; };
MdDialogClose.propDecorators = {
    'ariaLabel': [{ type: _angular_core.Input, args: ['aria-label',] },],
    'dialogResult': [{ type: _angular_core.Input, args: ['md-dialog-close',] },],
    '_matDialogClose': [{ type: _angular_core.Input, args: ['mat-dialog-close',] },],
};
/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
var MdDialogTitle = (function () {
    /**
     * @param {?} _container
     */
    function MdDialogTitle(_container) {
        this._container = _container;
        this.id = "md-dialog-title-" + dialogElementUid++;
    }
    /**
     * @return {?}
     */
    MdDialogTitle.prototype.ngOnInit = function () {
        var _this = this;
        if (this._container && !this._container._ariaLabelledBy) {
            Promise.resolve().then(function () { return _this._container._ariaLabelledBy = _this.id; });
        }
    };
    return MdDialogTitle;
}());
MdDialogTitle.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-dialog-title], [mat-dialog-title], [mdDialogTitle], [matDialogTitle]',
                host: {
                    'class': 'mat-dialog-title',
                    '[id]': 'id',
                },
            },] },
];
/**
 * @nocollapse
 */
MdDialogTitle.ctorParameters = function () { return [
    { type: MdDialogContainer, decorators: [{ type: _angular_core.Optional },] },
]; };
MdDialogTitle.propDecorators = {
    'id': [{ type: _angular_core.Input },],
};
/**
 * Scrollable content container of a dialog.
 */
var MdDialogContent = (function () {
    function MdDialogContent() {
    }
    return MdDialogContent;
}());
MdDialogContent.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-dialog-content], md-dialog-content, [mat-dialog-content], mat-dialog-content,' +
                    '[mdDialogContent], [matDialogContent]',
                host: { 'class': 'mat-dialog-content' }
            },] },
];
/**
 * @nocollapse
 */
MdDialogContent.ctorParameters = function () { return []; };
/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
var MdDialogActions = (function () {
    function MdDialogActions() {
    }
    return MdDialogActions;
}());
MdDialogActions.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[md-dialog-actions], md-dialog-actions, [mat-dialog-actions], mat-dialog-actions,' +
                    '[mdDialogActions], [matDialogActions]',
                host: { 'class': 'mat-dialog-actions' }
            },] },
];
/**
 * @nocollapse
 */
MdDialogActions.ctorParameters = function () { return []; };
var MdDialogModule = (function () {
    function MdDialogModule() {
    }
    return MdDialogModule;
}());
MdDialogModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule,
                    OverlayModule,
                    _angular_cdk.PortalModule,
                    _angular_cdk.A11yModule,
                    MdCommonModule,
                ],
                exports: [
                    MdDialogContainer,
                    MdDialogClose,
                    MdDialogTitle,
                    MdDialogContent,
                    MdDialogActions,
                    MdCommonModule,
                ],
                declarations: [
                    MdDialogContainer,
                    MdDialogClose,
                    MdDialogTitle,
                    MdDialogActions,
                    MdDialogContent,
                ],
                providers: [
                    MdDialog,
                ],
                entryComponents: [MdDialogContainer],
            },] },
];
/**
 * @nocollapse
 */
MdDialogModule.ctorParameters = function () { return []; };
var ActiveDescendantKeyManager = (function (_super) {
    __extends(ActiveDescendantKeyManager, _super);
    function ActiveDescendantKeyManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * This method sets the active item to the item at the specified index.
     * It also adds active styles to the newly active item and removes active
     * styles from the previously active item.
     * @param {?} index
     * @return {?}
     */
    ActiveDescendantKeyManager.prototype.setActiveItem = function (index) {
        var _this = this;
        Promise.resolve().then(function () {
            if (_this.activeItem) {
                _this.activeItem.setInactiveStyles();
            }
            _super.prototype.setActiveItem.call(_this, index);
            if (_this.activeItem) {
                _this.activeItem.setActiveStyles();
            }
        });
    };
    return ActiveDescendantKeyManager;
}(_angular_cdk.ListKeyManager));
/**
 * Autocomplete IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
var _uniqueAutocompleteIdCounter = 0;
var MdAutocomplete = (function () {
    /**
     * @param {?} _changeDetectorRef
     */
    function MdAutocomplete(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Whether the autocomplete panel displays above or below its trigger.
         */
        this.positionY = 'below';
        /**
         * Whether the autocomplete panel should be visible, depending on option length.
         */
        this.showPanel = false;
        /**
         * Function that maps an option's control value to its display value in the trigger.
         */
        this.displayWith = null;
        /**
         * Unique ID to be used by autocomplete trigger's "aria-owns" property.
         */
        this.id = "md-autocomplete-" + _uniqueAutocompleteIdCounter++;
    }
    /**
     * @return {?}
     */
    MdAutocomplete.prototype.ngAfterContentInit = function () {
        this._keyManager = new ActiveDescendantKeyManager(this.options).withWrap();
    };
    /**
     * Sets the panel scrollTop. This allows us to manually scroll to display options
     * above or below the fold, as they are not actually being focused when active.
     * @param {?} scrollTop
     * @return {?}
     */
    MdAutocomplete.prototype._setScrollTop = function (scrollTop) {
        if (this.panel) {
            this.panel.nativeElement.scrollTop = scrollTop;
        }
    };
    /**
     * Returns the panel's scrollTop.
     * @return {?}
     */
    MdAutocomplete.prototype._getScrollTop = function () {
        return this.panel ? this.panel.nativeElement.scrollTop : 0;
    };
    /**
     * Panel should hide itself when the option list is empty.
     * @return {?}
     */
    MdAutocomplete.prototype._setVisibility = function () {
        var _this = this;
        Promise.resolve().then(function () {
            _this.showPanel = !!_this.options.length;
            _this._changeDetectorRef.markForCheck();
        });
    };
    /**
     * Sets a class on the panel based on its position (used to set y-offset).
     * @return {?}
     */
    MdAutocomplete.prototype._getClassList = function () {
        return {
            'mat-autocomplete-panel-below': this.positionY === 'below',
            'mat-autocomplete-panel-above': this.positionY === 'above',
            'mat-autocomplete-visible': this.showPanel,
            'mat-autocomplete-hidden': !this.showPanel
        };
    };
    return MdAutocomplete;
}());
MdAutocomplete.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-autocomplete, mat-autocomplete',
                template: "<ng-template><div class=\"mat-autocomplete-panel\" role=\"listbox\" [id]=\"id\" [ngClass]=\"_getClassList()\" #panel><ng-content></ng-content></div></ng-template>",
                styles: [".mat-autocomplete-panel{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-width:none;max-height:256px;position:relative}.mat-autocomplete-panel.mat-autocomplete-panel-below{top:6px}.mat-autocomplete-panel.mat-autocomplete-panel-above{top:-24px}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}"],
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                exportAs: 'mdAutocomplete',
                host: {
                    'class': 'mat-autocomplete'
                }
            },] },
];
/**
 * @nocollapse
 */
MdAutocomplete.ctorParameters = function () { return [
    { type: _angular_core.ChangeDetectorRef, },
]; };
MdAutocomplete.propDecorators = {
    'template': [{ type: _angular_core.ViewChild, args: [_angular_core.TemplateRef,] },],
    'panel': [{ type: _angular_core.ViewChild, args: ['panel',] },],
    'options': [{ type: _angular_core.ContentChildren, args: [MdOption,] },],
    'displayWith': [{ type: _angular_core.Input },],
};
/**
 * The height of each autocomplete option.
 */
var AUTOCOMPLETE_OPTION_HEIGHT = 48;
/**
 * The total height of the autocomplete panel.
 */
var AUTOCOMPLETE_PANEL_HEIGHT = 256;
/**
 * Provider that allows the autocomplete to register as a ControlValueAccessor.
 * \@docs-private
 */
var MD_AUTOCOMPLETE_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MdAutocompleteTrigger; }),
    multi: true
};
/**
 * Creates an error to be thrown when attempting to use an autocomplete trigger without a panel.
 * @return {?}
 */
function getMdAutocompleteMissingPanelError() {
    return Error('Attempting to open an undefined instance of `md-autocomplete`. ' +
        'Make sure that the id passed to the `mdAutocomplete` is correct and that ' +
        'you\'re attempting to open it after the ngAfterContentInit hook.');
}
var MdAutocompleteTrigger = (function () {
    /**
     * @param {?} _element
     * @param {?} _overlay
     * @param {?} _viewContainerRef
     * @param {?} _zone
     * @param {?} _changeDetectorRef
     * @param {?} _dir
     * @param {?} _inputContainer
     * @param {?} _document
     */
    function MdAutocompleteTrigger(_element, _overlay, _viewContainerRef, _zone, _changeDetectorRef, _dir, _inputContainer, _document) {
        this._element = _element;
        this._overlay = _overlay;
        this._viewContainerRef = _viewContainerRef;
        this._zone = _zone;
        this._changeDetectorRef = _changeDetectorRef;
        this._dir = _dir;
        this._inputContainer = _inputContainer;
        this._document = _document;
        this._panelOpen = false;
        /**
         * Whether or not the placeholder state is being overridden.
         */
        this._manuallyFloatingPlaceholder = false;
        /**
         * View -> model callback called when value changes
         */
        this._onChange = function () { };
        /**
         * View -> model callback called when autocomplete has been touched
         */
        this._onTouched = function () { };
    }
    Object.defineProperty(MdAutocompleteTrigger.prototype, "_matAutocomplete", {
        /**
         * Property with mat- prefix for no-conflict mode.
         * @return {?}
         */
        get: function () {
            return this.autocomplete;
        },
        /**
         * @param {?} autocomplete
         * @return {?}
         */
        set: function (autocomplete) {
            this.autocomplete = autocomplete;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdAutocompleteTrigger.prototype.ngOnDestroy = function () {
        if (this._panelPositionSubscription) {
            this._panelPositionSubscription.unsubscribe();
        }
        this._destroyPanel();
    };
    Object.defineProperty(MdAutocompleteTrigger.prototype, "panelOpen", {
        /**
         * @return {?}
         */
        get: function () {
            return this._panelOpen && this.autocomplete.showPanel;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Opens the autocomplete suggestion panel.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype.openPanel = function () {
        if (!this.autocomplete) {
            throw getMdAutocompleteMissingPanelError();
        }
        if (!this._overlayRef) {
            this._createOverlay();
        }
        else {
            /** Update the panel width, in case the host width has changed */
            this._overlayRef.getState().width = this._getHostWidth();
            this._overlayRef.updateSize();
        }
        if (this._overlayRef && !this._overlayRef.hasAttached()) {
            this._overlayRef.attach(this._portal);
            this._closingActionsSubscription = this._subscribeToClosingActions();
        }
        this.autocomplete._setVisibility();
        this._floatPlaceholder();
        this._panelOpen = true;
    };
    /**
     * Closes the autocomplete suggestion panel.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype.closePanel = function () {
        if (!this.panelOpen) {
            return;
        }
        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
            this._closingActionsSubscription.unsubscribe();
        }
        this._panelOpen = false;
        this._resetPlaceholder();
        // We need to trigger change detection manually, because
        // `fromEvent` doesn't seem to do it at the proper time.
        // This ensures that the placeholder is reset when the
        // user clicks outside.
        this._changeDetectorRef.detectChanges();
    };
    Object.defineProperty(MdAutocompleteTrigger.prototype, "panelClosingActions", {
        /**
         * A stream of actions that should close the autocomplete panel, including
         * when an option is selected, on blur, and when TAB is pressed.
         * @return {?}
         */
        get: function () {
            return rxjs_observable_merge.merge(this.optionSelections, this.autocomplete._keyManager.tabOut, this._outsideClickStream);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdAutocompleteTrigger.prototype, "optionSelections", {
        /**
         * Stream of autocomplete option selections.
         * @return {?}
         */
        get: function () {
            return rxjs_observable_merge.merge.apply(void 0, this.autocomplete.options.map(function (option) { return option.onSelectionChange; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdAutocompleteTrigger.prototype, "activeOption", {
        /**
         * The currently active option, coerced to MdOption type.
         * @return {?}
         */
        get: function () {
            if (this.autocomplete && this.autocomplete._keyManager) {
                return (this.autocomplete._keyManager.activeItem);
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdAutocompleteTrigger.prototype, "_outsideClickStream", {
        /**
         * Stream of clicks outside of the autocomplete panel.
         * @return {?}
         */
        get: function () {
            var _this = this;
            if (!this._document) {
                return rxjs_observable_of.of(null);
            }
            return _angular_cdk.RxChain.from(rxjs_observable_merge.merge(rxjs_observable_fromEvent.fromEvent(this._document, 'click'), rxjs_observable_fromEvent.fromEvent(this._document, 'touchend'))).call(_angular_cdk.filter, function (event) {
                var /** @type {?} */ clickTarget = (event.target);
                var /** @type {?} */ inputContainer = _this._inputContainer ?
                    _this._inputContainer._elementRef.nativeElement : null;
                return _this._panelOpen &&
                    clickTarget !== _this._element.nativeElement &&
                    (!inputContainer || !inputContainer.contains(clickTarget)) &&
                    (!!_this._overlayRef && !_this._overlayRef.overlayElement.contains(clickTarget));
            }).result();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the autocomplete's value. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param {?} value New value to be written to the model.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype.writeValue = function (value) {
        var _this = this;
        Promise.resolve(null).then(function () { return _this._setTriggerValue(value); });
    };
    /**
     * Saves a callback function to be invoked when the autocomplete's value
     * changes from user input. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param {?} fn Callback to be triggered when the value changes.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    /**
     * Saves a callback function to be invoked when the autocomplete is blurred
     * by the user. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param {?} fn Callback to be triggered when the component has been touched.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._handleKeydown = function (event) {
        var _this = this;
        if (event.keyCode === _angular_cdk.ESCAPE && this.panelOpen) {
            this.closePanel();
        }
        else if (this.activeOption && event.keyCode === _angular_cdk.ENTER) {
            this.activeOption._selectViaInteraction();
            event.preventDefault();
        }
        else {
            var /** @type {?} */ prevActiveItem_1 = this.autocomplete._keyManager.activeItem;
            var /** @type {?} */ isArrowKey_1 = event.keyCode === _angular_cdk.UP_ARROW || event.keyCode === _angular_cdk.DOWN_ARROW;
            this.autocomplete._keyManager.onKeydown(event);
            if (isArrowKey_1) {
                this.openPanel();
            }
            Promise.resolve().then(function () {
                if (isArrowKey_1 || _this.autocomplete._keyManager.activeItem !== prevActiveItem_1) {
                    _this._scrollToOption();
                }
            });
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._handleInput = function (event) {
        // We need to ensure that the input is focused, because IE will fire the `input`
        // event on focus/blur/load if the input has a placeholder. See:
        // https://connect.microsoft.com/IE/feedback/details/885747/
        if (document.activeElement === event.target) {
            this._onChange(((event.target)).value);
            this.openPanel();
        }
    };
    /**
     * In "auto" mode, the placeholder will animate down as soon as focus is lost.
     * This causes the value to jump when selecting an option with the mouse.
     * This method manually floats the placeholder until the panel can be closed.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._floatPlaceholder = function () {
        if (this._inputContainer && this._inputContainer.floatPlaceholder === 'auto') {
            this._inputContainer.floatPlaceholder = 'always';
            this._manuallyFloatingPlaceholder = true;
        }
    };
    /**
     * If the placeholder has been manually elevated, return it to its normal state.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._resetPlaceholder = function () {
        if (this._manuallyFloatingPlaceholder) {
            this._inputContainer.floatPlaceholder = 'auto';
            this._manuallyFloatingPlaceholder = false;
        }
    };
    /**
     * Given that we are not actually focusing active options, we must manually adjust scroll
     * to reveal options below the fold. First, we find the offset of the option from the top
     * of the panel. If that offset is below the fold, the new scrollTop will be the offset -
     * the panel height + the option height, so the active option will be just visible at the
     * bottom of the panel. If that offset is above the top of the visible panel, the new scrollTop
     * will become the offset. If that offset is visible within the panel already, the scrollTop is
     * not adjusted.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._scrollToOption = function () {
        var /** @type {?} */ optionOffset = this.autocomplete._keyManager.activeItemIndex ?
            this.autocomplete._keyManager.activeItemIndex * AUTOCOMPLETE_OPTION_HEIGHT : 0;
        var /** @type {?} */ panelTop = this.autocomplete._getScrollTop();
        if (optionOffset < panelTop) {
            // Scroll up to reveal selected option scrolled above the panel top
            this.autocomplete._setScrollTop(optionOffset);
        }
        else if (optionOffset + AUTOCOMPLETE_OPTION_HEIGHT > panelTop + AUTOCOMPLETE_PANEL_HEIGHT) {
            // Scroll down to reveal selected option scrolled below the panel bottom
            var /** @type {?} */ newScrollTop = Math.max(0, optionOffset - AUTOCOMPLETE_PANEL_HEIGHT + AUTOCOMPLETE_OPTION_HEIGHT);
            this.autocomplete._setScrollTop(newScrollTop);
        }
    };
    /**
     * This method listens to a stream of panel closing actions and resets the
     * stream every time the option list changes.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._subscribeToClosingActions = function () {
        var _this = this;
        // When the zone is stable initially, and when the option list changes...
        return _angular_cdk.RxChain.from(rxjs_observable_merge.merge(_angular_cdk.first.call(this._zone.onStable), this.autocomplete.options.changes))
            .call(_angular_cdk.switchMap, function () {
            _this._resetPanel();
            return _this.panelClosingActions;
        })
            .call(_angular_cdk.first)
            .subscribe(function (event) { return _this._setValueAndClose(event); });
    };
    /**
     * Destroys the autocomplete suggestion panel.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._destroyPanel = function () {
        if (this._overlayRef) {
            this.closePanel();
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._setTriggerValue = function (value) {
        var /** @type {?} */ toDisplay = this.autocomplete.displayWith ? this.autocomplete.displayWith(value) : value;
        // Simply falling back to an empty string if the display value is falsy does not work properly.
        // The display value can also be the number zero and shouldn't fall back to an empty string.
        this._element.nativeElement.value = toDisplay != null ? toDisplay : '';
    };
    /**
     * This method closes the panel, and if a value is specified, also sets the associated
     * control to that value. It will also mark the control as dirty if this interaction
     * stemmed from the user.
     * @param {?} event
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._setValueAndClose = function (event) {
        if (event && event.source) {
            this._clearPreviousSelectedOption(event.source);
            this._setTriggerValue(event.source.value);
            this._onChange(event.source.value);
            this._element.nativeElement.focus();
        }
        this.closePanel();
    };
    /**
     * Clear any previous selected option and emit a selection change event for this option
     * @param {?} skip
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._clearPreviousSelectedOption = function (skip) {
        this.autocomplete.options.forEach(function (option) {
            if (option != skip && option.selected) {
                option.deselect();
            }
        });
    };
    /**
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._createOverlay = function () {
        this._portal = new _angular_cdk.TemplatePortal(this.autocomplete.template, this._viewContainerRef);
        this._overlayRef = this._overlay.create(this._getOverlayConfig());
    };
    /**
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._getOverlayConfig = function () {
        var /** @type {?} */ overlayState = new OverlayState();
        overlayState.positionStrategy = this._getOverlayPosition();
        overlayState.width = this._getHostWidth();
        overlayState.direction = this._dir ? this._dir.value : 'ltr';
        overlayState.scrollStrategy = this._overlay.scrollStrategies.reposition();
        return overlayState;
    };
    /**
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._getOverlayPosition = function () {
        this._positionStrategy = this._overlay.position().connectedTo(this._element, { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' });
        this._subscribeToPositionChanges(this._positionStrategy);
        return this._positionStrategy;
    };
    /**
     * This method subscribes to position changes in the autocomplete panel, so the panel's
     * y-offset can be adjusted to match the new position.
     * @param {?} strategy
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._subscribeToPositionChanges = function (strategy) {
        var _this = this;
        this._panelPositionSubscription = strategy.onPositionChange.subscribe(function (change) {
            _this.autocomplete.positionY = change.connectionPair.originY === 'top' ? 'above' : 'below';
        });
    };
    /**
     * Returns the width of the input element, so the panel width can match it.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._getHostWidth = function () {
        return this._element.nativeElement.getBoundingClientRect().width;
    };
    /**
     * Reset active item to -1 so arrow events will activate the correct options.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._resetActiveItem = function () {
        this.autocomplete._keyManager.setActiveItem(-1);
    };
    /**
     * Resets the active item and re-calculates alignment of the panel in case its size
     * has changed due to fewer or greater number of options.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._resetPanel = function () {
        this._resetActiveItem();
        this._positionStrategy.recalculateLastPosition();
        this.autocomplete._setVisibility();
    };
    return MdAutocompleteTrigger;
}());
MdAutocompleteTrigger.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'input[mdAutocomplete], input[matAutocomplete],' +
                    'textarea[mdAutocomplete], textarea[matAutocomplete]',
                host: {
                    'role': 'combobox',
                    'autocomplete': 'off',
                    'aria-autocomplete': 'list',
                    'aria-multiline': 'false',
                    '[attr.aria-activedescendant]': 'activeOption?.id',
                    '[attr.aria-expanded]': 'panelOpen.toString()',
                    '[attr.aria-owns]': 'autocomplete?.id',
                    // Note: we use `focusin`, as opposed to `focus`, in order to open the panel
                    // a little earlier. This avoids issues where IE delays the focusing of the input.
                    '(focusin)': 'openPanel()',
                    '(input)': '_handleInput($event)',
                    '(blur)': '_onTouched()',
                    '(keydown)': '_handleKeydown($event)',
                },
                providers: [MD_AUTOCOMPLETE_VALUE_ACCESSOR]
            },] },
];
/**
 * @nocollapse
 */
MdAutocompleteTrigger.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: Overlay, },
    { type: _angular_core.ViewContainerRef, },
    { type: _angular_core.NgZone, },
    { type: _angular_core.ChangeDetectorRef, },
    { type: _angular_cdk.Directionality, decorators: [{ type: _angular_core.Optional },] },
    { type: MdInputContainer, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Host },] },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_platformBrowser.DOCUMENT,] },] },
]; };
MdAutocompleteTrigger.propDecorators = {
    'autocomplete': [{ type: _angular_core.Input, args: ['mdAutocomplete',] },],
    '_matAutocomplete': [{ type: _angular_core.Input, args: ['matAutocomplete',] },],
};
var MdAutocompleteModule = (function () {
    function MdAutocompleteModule() {
    }
    return MdAutocompleteModule;
}());
MdAutocompleteModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [MdOptionModule, OverlayModule, MdCommonModule, _angular_common.CommonModule],
                exports: [MdAutocomplete, MdOptionModule, MdAutocompleteTrigger, MdCommonModule],
                declarations: [MdAutocomplete, MdAutocompleteTrigger],
            },] },
];
/**
 * @nocollapse
 */
MdAutocompleteModule.ctorParameters = function () { return []; };
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * \@docs-private
 */
var MdCalendarCell = (function () {
    /**
     * @param {?} value
     * @param {?} displayValue
     * @param {?} ariaLabel
     * @param {?} enabled
     */
    function MdCalendarCell(value, displayValue, ariaLabel, enabled) {
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
    }
    return MdCalendarCell;
}());
/**
 * An internal component used to display calendar data in a table.
 * \@docs-private
 */
var MdCalendarBody = (function () {
    function MdCalendarBody() {
        /**
         * The number of columns in the table.
         */
        this.numCols = 7;
        /**
         * Whether to allow selection of disabled cells.
         */
        this.allowDisabledSelection = false;
        /**
         * The cell number of the active cell in the table.
         */
        this.activeCell = 0;
        /**
         * Emits when a new value is selected.
         */
        this.selectedValueChange = new _angular_core.EventEmitter();
    }
    /**
     * @param {?} cell
     * @return {?}
     */
    MdCalendarBody.prototype._cellClicked = function (cell) {
        if (!this.allowDisabledSelection && !cell.enabled) {
            return;
        }
        this.selectedValueChange.emit(cell.value);
    };
    Object.defineProperty(MdCalendarBody.prototype, "_firstRowOffset", {
        /**
         * The number of blank cells to put at the beginning for the first row.
         * @return {?}
         */
        get: function () {
            return this.rows && this.rows.length && this.rows[0].length ?
                this.numCols - this.rows[0].length : 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} rowIndex
     * @param {?} colIndex
     * @return {?}
     */
    MdCalendarBody.prototype._isActiveCell = function (rowIndex, colIndex) {
        var /** @type {?} */ cellNumber = rowIndex * this.numCols + colIndex;
        // Account for the fact that the first row may not have as many cells.
        if (rowIndex) {
            cellNumber -= this._firstRowOffset;
        }
        return cellNumber == this.activeCell;
    };
    return MdCalendarBody;
}());
MdCalendarBody.decorators = [
    { type: _angular_core.Component, args: [{ selector: '[md-calendar-body]',
                template: "<tr *ngIf=\"_firstRowOffset < labelMinRequiredCells\" aria-hidden=\"true\"><td class=\"mat-calendar-body-label\" [attr.colspan]=\"numCols\">{{label}}</td></tr><tr *ngFor=\"let row of rows; let rowIndex = index\" role=\"row\"><td *ngIf=\"rowIndex === 0 && _firstRowOffset\" aria-hidden=\"true\" class=\"mat-calendar-body-label\" [attr.colspan]=\"_firstRowOffset\">{{_firstRowOffset >= labelMinRequiredCells ? label : ''}}</td><td *ngFor=\"let item of row; let colIndex = index\" role=\"gridcell\" class=\"mat-calendar-body-cell\" [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\" [class.mat-calendar-body-disabled]=\"!item.enabled\" [class.mat-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\" [attr.aria-label]=\"item.ariaLabel\" [attr.aria-disabled]=\"!item.enabled || null\" (click)=\"_cellClicked(item)\"><div class=\"mat-calendar-body-cell-content\" [class.mat-calendar-body-selected]=\"selectedValue === item.value\" [class.mat-calendar-body-today]=\"todayValue === item.value\">{{item.displayValue}}</div></td></tr>",
                styles: [".mat-calendar-body{min-width:224px}.mat-calendar-body-label{padding:7.14286% 0 7.14286% 7.14286%;height:0;line-height:0;transform:translateX(-6px);text-align:left}.mat-calendar-body-cell{position:relative;width:14.28571%;height:0;line-height:0;padding:7.14286% 0;text-align:center;outline:0;cursor:pointer}.mat-calendar-body-disabled{cursor:default}.mat-calendar-body-cell-content{position:absolute;top:5%;left:5%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;border-width:1px;border-style:solid;border-radius:50%}[dir=rtl] .mat-calendar-body-label{padding:0 7.14286% 0 0;transform:translateX(6px);text-align:right}"],
                host: {
                    'class': 'mat-calendar-body',
                },
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdCalendarBody.ctorParameters = function () { return []; };
MdCalendarBody.propDecorators = {
    'label': [{ type: _angular_core.Input },],
    'rows': [{ type: _angular_core.Input },],
    'todayValue': [{ type: _angular_core.Input },],
    'selectedValue': [{ type: _angular_core.Input },],
    'labelMinRequiredCells': [{ type: _angular_core.Input },],
    'numCols': [{ type: _angular_core.Input },],
    'allowDisabledSelection': [{ type: _angular_core.Input },],
    'activeCell': [{ type: _angular_core.Input },],
    'selectedValueChange': [{ type: _angular_core.Output },],
};
/**
 * \@docs-private
 * @param {?} provider
 * @return {?}
 */
function createMissingDateImplError(provider) {
    return Error("MdDatepicker: No provider found for " + provider + ". You must import one of the following " +
        "modules at your application root: MdNativeDateModule, or provide a custom implementation.");
}
var DAYS_PER_WEEK = 7;
/**
 * An internal component used to display a single month in the datepicker.
 * \@docs-private
 */
var MdMonthView = (function () {
    /**
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     */
    function MdMonthView(_dateAdapter, _dateFormats) {
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        /**
         * Emits when a new date is selected.
         */
        this.selectedChange = new _angular_core.EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
        var firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
        var narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow');
        var longWeekdays = this._dateAdapter.getDayOfWeekNames('long');
        // Rotate the labels for days of the week based on the configured first day of the week.
        var weekdays = longWeekdays.map(function (long, i) {
            return { long: long, narrow: narrowWeekdays[i] };
        });
        this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
        this._activeDate = this._dateAdapter.today();
    }
    Object.defineProperty(MdMonthView.prototype, "activeDate", {
        /**
         * The date to display in this month view (everything other than the month and year is ignored).
         * @return {?}
         */
        get: function () { return this._activeDate; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            var /** @type {?} */ oldActiveDate = this._activeDate;
            this._activeDate = value || this._dateAdapter.today();
            if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
                this._init();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMonthView.prototype, "selected", {
        /**
         * The currently selected date.
         * @return {?}
         */
        get: function () { return this._selected; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selected = value;
            this._selectedDate = this._getDateInCurrentMonth(this.selected);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdMonthView.prototype.ngAfterContentInit = function () {
        this._init();
    };
    /**
     * Handles when a new date is selected.
     * @param {?} date
     * @return {?}
     */
    MdMonthView.prototype._dateSelected = function (date) {
        if (this._selectedDate == date) {
            return;
        }
        this.selectedChange.emit(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), date));
    };
    /**
     * Initializes this month view.
     * @return {?}
     */
    MdMonthView.prototype._init = function () {
        this._selectedDate = this._getDateInCurrentMonth(this.selected);
        this._todayDate = this._getDateInCurrentMonth(this._dateAdapter.today());
        this._monthLabel =
            this._dateAdapter.getMonthNames('short')[this._dateAdapter.getMonth(this.activeDate)]
                .toLocaleUpperCase();
        var /** @type {?} */ firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), 1);
        this._firstWeekOffset =
            (DAYS_PER_WEEK + this._dateAdapter.getDayOfWeek(firstOfMonth) -
                this._dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK;
        this._createWeekCells();
    };
    /**
     * Creates MdCalendarCells for the dates in this month.
     * @return {?}
     */
    MdMonthView.prototype._createWeekCells = function () {
        var /** @type {?} */ daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
        var /** @type {?} */ dateNames = this._dateAdapter.getDateNames();
        this._weeks = [[]];
        for (var /** @type {?} */ i = 0, /** @type {?} */ cell = this._firstWeekOffset; i < daysInMonth; i++, cell++) {
            if (cell == DAYS_PER_WEEK) {
                this._weeks.push([]);
                cell = 0;
            }
            var /** @type {?} */ date = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), i + 1);
            var /** @type {?} */ enabled = !this.dateFilter ||
                this.dateFilter(date);
            var /** @type {?} */ ariaLabel = this._dateAdapter.format(date, this._dateFormats.display.dateA11yLabel);
            this._weeks[this._weeks.length - 1]
                .push(new MdCalendarCell(i + 1, dateNames[i], ariaLabel, enabled));
        }
    };
    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     * @param {?} date
     * @return {?}
     */
    MdMonthView.prototype._getDateInCurrentMonth = function (date) {
        return this._hasSameMonthAndYear(date, this.activeDate) ?
            this._dateAdapter.getDate(date) : null;
    };
    /**
     * Checks whether the 2 dates are non-null and fall within the same month of the same year.
     * @param {?} d1
     * @param {?} d2
     * @return {?}
     */
    MdMonthView.prototype._hasSameMonthAndYear = function (d1, d2) {
        return !!(d1 && d2 && this._dateAdapter.getMonth(d1) == this._dateAdapter.getMonth(d2) &&
            this._dateAdapter.getYear(d1) == this._dateAdapter.getYear(d2));
    };
    return MdMonthView;
}());
MdMonthView.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-month-view',
                template: "<table class=\"mat-calendar-table\"><thead class=\"mat-calendar-table-header\"><tr><th *ngFor=\"let day of _weekdays\" [attr.aria-label]=\"day.long\">{{day.narrow}}</th></tr><tr><th class=\"mat-calendar-table-header-divider\" colspan=\"7\" aria-hidden=\"true\"></th></tr></thead><tbody md-calendar-body role=\"grid\" [label]=\"_monthLabel\" [rows]=\"_weeks\" [todayValue]=\"_todayDate\" [selectedValue]=\"_selectedDate\" [labelMinRequiredCells]=\"3\" [activeCell]=\"_dateAdapter.getDate(activeDate) - 1\" (selectedValueChange)=\"_dateSelected($event)\"></tbody></table>",
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdMonthView.ctorParameters = function () { return [
    { type: DateAdapter, decorators: [{ type: _angular_core.Optional },] },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MD_DATE_FORMATS,] },] },
]; };
MdMonthView.propDecorators = {
    'activeDate': [{ type: _angular_core.Input },],
    'selected': [{ type: _angular_core.Input },],
    'dateFilter': [{ type: _angular_core.Input },],
    'selectedChange': [{ type: _angular_core.Output },],
};
/**
 * An internal component used to display a single year in the datepicker.
 * \@docs-private
 */
var MdYearView = (function () {
    /**
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     */
    function MdYearView(_dateAdapter, _dateFormats) {
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        /**
         * Emits when a new month is selected.
         */
        this.selectedChange = new _angular_core.EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
        this._activeDate = this._dateAdapter.today();
    }
    Object.defineProperty(MdYearView.prototype, "activeDate", {
        /**
         * The date to display in this year view (everything other than the year is ignored).
         * @return {?}
         */
        get: function () { return this._activeDate; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            var /** @type {?} */ oldActiveDate = this._activeDate;
            this._activeDate = value || this._dateAdapter.today();
            if (this._dateAdapter.getYear(oldActiveDate) != this._dateAdapter.getYear(this._activeDate)) {
                this._init();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdYearView.prototype, "selected", {
        /**
         * The currently selected date.
         * @return {?}
         */
        get: function () { return this._selected; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selected = value;
            this._selectedMonth = this._getMonthInCurrentYear(this.selected);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdYearView.prototype.ngAfterContentInit = function () {
        this._init();
    };
    /**
     * Handles when a new month is selected.
     * @param {?} month
     * @return {?}
     */
    MdYearView.prototype._monthSelected = function (month) {
        this.selectedChange.emit(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, this._dateAdapter.getDate(this.activeDate)));
    };
    /**
     * Initializes this month view.
     * @return {?}
     */
    MdYearView.prototype._init = function () {
        var _this = this;
        this._selectedMonth = this._getMonthInCurrentYear(this.selected);
        this._todayMonth = this._getMonthInCurrentYear(this._dateAdapter.today());
        this._yearLabel = this._dateAdapter.getYearName(this.activeDate);
        var /** @type {?} */ monthNames = this._dateAdapter.getMonthNames('short');
        // First row of months only contains 5 elements so we can fit the year label on the same row.
        this._months = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10, 11]].map(function (row) { return row.map(function (month) { return _this._createCellForMonth(month, monthNames[month]); }); });
    };
    /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     * @param {?} date
     * @return {?}
     */
    MdYearView.prototype._getMonthInCurrentYear = function (date) {
        return date && this._dateAdapter.getYear(date) == this._dateAdapter.getYear(this.activeDate) ?
            this._dateAdapter.getMonth(date) : null;
    };
    /**
     * Creates an MdCalendarCell for the given month.
     * @param {?} month
     * @param {?} monthName
     * @return {?}
     */
    MdYearView.prototype._createCellForMonth = function (month, monthName) {
        var /** @type {?} */ ariaLabel = this._dateAdapter.format(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1), this._dateFormats.display.monthYearA11yLabel);
        return new MdCalendarCell(month, monthName.toLocaleUpperCase(), ariaLabel, this._isMonthEnabled(month));
    };
    /**
     * Whether the given month is enabled.
     * @param {?} month
     * @return {?}
     */
    MdYearView.prototype._isMonthEnabled = function (month) {
        if (!this.dateFilter) {
            return true;
        }
        var /** @type {?} */ firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1);
        // If any date in the month is enabled count the month as enabled.
        for (var /** @type {?} */ date = firstOfMonth; this._dateAdapter.getMonth(date) == month; date = this._dateAdapter.addCalendarDays(date, 1)) {
            if (this.dateFilter(date)) {
                return true;
            }
        }
        return false;
    };
    return MdYearView;
}());
MdYearView.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-year-view',
                template: "<table class=\"mat-calendar-table\"><thead class=\"mat-calendar-table-header\"><tr><th class=\"mat-calendar-table-header-divider\" colspan=\"7\"></th></tr></thead><tbody md-calendar-body role=\"grid\" allowDisabledSelection=\"true\" [label]=\"_yearLabel\" [rows]=\"_months\" [todayValue]=\"_todayMonth\" [selectedValue]=\"_selectedMonth\" [labelMinRequiredCells]=\"2\" [activeCell]=\"_dateAdapter.getMonth(activeDate)\" (selectedValueChange)=\"_monthSelected($event)\"></tbody></table>",
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdYearView.ctorParameters = function () { return [
    { type: DateAdapter, decorators: [{ type: _angular_core.Optional },] },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MD_DATE_FORMATS,] },] },
]; };
MdYearView.propDecorators = {
    'activeDate': [{ type: _angular_core.Input },],
    'selected': [{ type: _angular_core.Input },],
    'dateFilter': [{ type: _angular_core.Input },],
    'selectedChange': [{ type: _angular_core.Output },],
};
/**
 * Datepicker data that requires internationalization.
 */
var MdDatepickerIntl = (function () {
    function MdDatepickerIntl() {
        /**
         * A label for the calendar popup (used by screen readers).
         */
        this.calendarLabel = 'Calendar';
        /**
         * A label for the button used to open the calendar popup (used by screen readers).
         */
        this.openCalendarLabel = 'Open calendar';
        /**
         * A label for the previous month button (used by screen readers).
         */
        this.prevMonthLabel = 'Previous month';
        /**
         * A label for the next month button (used by screen readers).
         */
        this.nextMonthLabel = 'Next month';
        /**
         * A label for the previous year button (used by screen readers).
         */
        this.prevYearLabel = 'Previous year';
        /**
         * A label for the next year button (used by screen readers).
         */
        this.nextYearLabel = 'Next year';
        /**
         * A label for the 'switch to month view' button (used by screen readers).
         */
        this.switchToMonthViewLabel = 'Change to month view';
        /**
         * A label for the 'switch to year view' button (used by screen readers).
         */
        this.switchToYearViewLabel = 'Change to year view';
    }
    return MdDatepickerIntl;
}());
MdDatepickerIntl.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
MdDatepickerIntl.ctorParameters = function () { return []; };
/**
 * A calendar that is used as part of the datepicker.
 * \@docs-private
 */
var MdCalendar = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _intl
     * @param {?} _ngZone
     * @param {?} _isCompatibilityMode
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     */
    function MdCalendar(_elementRef, _intl, _ngZone, _isCompatibilityMode, _dateAdapter, _dateFormats) {
        var _this = this;
        this._elementRef = _elementRef;
        this._intl = _intl;
        this._ngZone = _ngZone;
        this._isCompatibilityMode = _isCompatibilityMode;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        /**
         * Whether the calendar should be started in month or year view.
         */
        this.startView = 'month';
        /**
         * Emits when the currently selected date changes.
         */
        this.selectedChange = new _angular_core.EventEmitter();
        /**
         * Date filter for the month and year views.
         */
        this._dateFilterForViews = function (date) {
            return !!date &&
                (!_this.dateFilter || _this.dateFilter(date)) &&
                (!_this.minDate || _this._dateAdapter.compareDate(date, _this.minDate) >= 0) &&
                (!_this.maxDate || _this._dateAdapter.compareDate(date, _this.maxDate) <= 0);
        };
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
    }
    Object.defineProperty(MdCalendar.prototype, "_activeDate", {
        /**
         * The current active date. This determines which time period is shown and which date is
         * highlighted when using keyboard navigation.
         * @return {?}
         */
        get: function () { return this._clampedActiveDate; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_periodButtonText", {
        /**
         * The label for the current calendar view.
         * @return {?}
         */
        get: function () {
            return this._monthView ?
                this._dateAdapter.format(this._activeDate, this._dateFormats.display.monthYearLabel)
                    .toLocaleUpperCase() :
                this._dateAdapter.getYearName(this._activeDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_periodButtonLabel", {
        /**
         * @return {?}
         */
        get: function () {
            return this._monthView ? this._intl.switchToYearViewLabel : this._intl.switchToMonthViewLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_prevButtonLabel", {
        /**
         * The label for the the previous button.
         * @return {?}
         */
        get: function () {
            return this._monthView ? this._intl.prevMonthLabel : this._intl.prevYearLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_nextButtonLabel", {
        /**
         * The label for the the next button.
         * @return {?}
         */
        get: function () {
            return this._monthView ? this._intl.nextMonthLabel : this._intl.nextYearLabel;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdCalendar.prototype.ngAfterContentInit = function () {
        this._activeDate = this.startAt || this._dateAdapter.today();
        this._focusActiveCell();
        this._monthView = this.startView != 'year';
    };
    /**
     * Handles date selection in the month view.
     * @param {?} date
     * @return {?}
     */
    MdCalendar.prototype._dateSelected = function (date) {
        if (!this._dateAdapter.sameDate(date, this.selected)) {
            this.selectedChange.emit(date);
        }
    };
    /**
     * Handles month selection in the year view.
     * @param {?} month
     * @return {?}
     */
    MdCalendar.prototype._monthSelected = function (month) {
        this._activeDate = month;
        this._monthView = true;
    };
    /**
     * Handles user clicks on the period label.
     * @return {?}
     */
    MdCalendar.prototype._currentPeriodClicked = function () {
        this._monthView = !this._monthView;
    };
    /**
     * Handles user clicks on the previous button.
     * @return {?}
     */
    MdCalendar.prototype._previousClicked = function () {
        this._activeDate = this._monthView ?
            this._dateAdapter.addCalendarMonths(this._activeDate, -1) :
            this._dateAdapter.addCalendarYears(this._activeDate, -1);
    };
    /**
     * Handles user clicks on the next button.
     * @return {?}
     */
    MdCalendar.prototype._nextClicked = function () {
        this._activeDate = this._monthView ?
            this._dateAdapter.addCalendarMonths(this._activeDate, 1) :
            this._dateAdapter.addCalendarYears(this._activeDate, 1);
    };
    /**
     * Whether the previous period button is enabled.
     * @return {?}
     */
    MdCalendar.prototype._previousEnabled = function () {
        if (!this.minDate) {
            return true;
        }
        return !this.minDate || !this._isSameView(this._activeDate, this.minDate);
    };
    /**
     * Whether the next period button is enabled.
     * @return {?}
     */
    MdCalendar.prototype._nextEnabled = function () {
        return !this.maxDate || !this._isSameView(this._activeDate, this.maxDate);
    };
    /**
     * Handles keydown events on the calendar body.
     * @param {?} event
     * @return {?}
     */
    MdCalendar.prototype._handleCalendarBodyKeydown = function (event) {
        // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
        // disabled ones from being selected. This may not be ideal, we should look into whether
        // navigation should skip over disabled dates, and if so, how to implement that efficiently.
        if (this._monthView) {
            this._handleCalendarBodyKeydownInMonthView(event);
        }
        else {
            this._handleCalendarBodyKeydownInYearView(event);
        }
    };
    /**
     * Focuses the active cell after the microtask queue is empty.
     * @return {?}
     */
    MdCalendar.prototype._focusActiveCell = function () {
        var _this = this;
        this._ngZone.runOutsideAngular(function () { return _angular_cdk.first.call(_this._ngZone.onStable).subscribe(function () {
            _this._elementRef.nativeElement.querySelector('.mat-calendar-body-active').focus();
        }); });
    };
    /**
     * Whether the two dates represent the same view in the current view mode (month or year).
     * @param {?} date1
     * @param {?} date2
     * @return {?}
     */
    MdCalendar.prototype._isSameView = function (date1, date2) {
        return this._monthView ?
            this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
                this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2) :
            this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2);
    };
    /**
     * Handles keydown events on the calendar body when calendar is in month view.
     * @param {?} event
     * @return {?}
     */
    MdCalendar.prototype._handleCalendarBodyKeydownInMonthView = function (event) {
        switch (event.keyCode) {
            case _angular_cdk.LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -1);
                break;
            case _angular_cdk.RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1);
                break;
            case _angular_cdk.UP_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -7);
                break;
            case _angular_cdk.DOWN_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 7);
                break;
            case _angular_cdk.HOME:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1 - this._dateAdapter.getDate(this._activeDate));
                break;
            case _angular_cdk.END:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, (this._dateAdapter.getNumDaysInMonth(this._activeDate) -
                    this._dateAdapter.getDate(this._activeDate)));
                break;
            case _angular_cdk.PAGE_UP:
                this._activeDate = event.altKey ?
                    this._dateAdapter.addCalendarYears(this._activeDate, -1) :
                    this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case _angular_cdk.PAGE_DOWN:
                this._activeDate = event.altKey ?
                    this._dateAdapter.addCalendarYears(this._activeDate, 1) :
                    this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case _angular_cdk.ENTER:
                if (this._dateFilterForViews(this._activeDate)) {
                    this._dateSelected(this._activeDate);
                    // Prevent unexpected default actions such as form submission.
                    event.preventDefault();
                }
                return;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        this._focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    };
    /**
     * Handles keydown events on the calendar body when calendar is in year view.
     * @param {?} event
     * @return {?}
     */
    MdCalendar.prototype._handleCalendarBodyKeydownInYearView = function (event) {
        switch (event.keyCode) {
            case _angular_cdk.LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case _angular_cdk.RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case _angular_cdk.UP_ARROW:
                this._activeDate = this._prevMonthInSameCol(this._activeDate);
                break;
            case _angular_cdk.DOWN_ARROW:
                this._activeDate = this._nextMonthInSameCol(this._activeDate);
                break;
            case _angular_cdk.HOME:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -this._dateAdapter.getMonth(this._activeDate));
                break;
            case _angular_cdk.END:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 11 - this._dateAdapter.getMonth(this._activeDate));
                break;
            case _angular_cdk.PAGE_UP:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -10 : -1);
                break;
            case _angular_cdk.PAGE_DOWN:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? 10 : 1);
                break;
            case _angular_cdk.ENTER:
                this._monthSelected(this._activeDate);
                break;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        this._focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    };
    /**
     * Determine the date for the month that comes before the given month in the same column in the
     * calendar table.
     * @param {?} date
     * @return {?}
     */
    MdCalendar.prototype._prevMonthInSameCol = function (date) {
        // Determine how many months to jump forward given that there are 2 empty slots at the beginning
        // of each year.
        var /** @type {?} */ increment = this._dateAdapter.getMonth(date) <= 4 ? -5 :
            (this._dateAdapter.getMonth(date) >= 7 ? -7 : -12);
        return this._dateAdapter.addCalendarMonths(date, increment);
    };
    /**
     * Determine the date for the month that comes after the given month in the same column in the
     * calendar table.
     * @param {?} date
     * @return {?}
     */
    MdCalendar.prototype._nextMonthInSameCol = function (date) {
        // Determine how many months to jump forward given that there are 2 empty slots at the beginning
        // of each year.
        var /** @type {?} */ increment = this._dateAdapter.getMonth(date) <= 4 ? 7 :
            (this._dateAdapter.getMonth(date) >= 7 ? 5 : 12);
        return this._dateAdapter.addCalendarMonths(date, increment);
    };
    return MdCalendar;
}());
MdCalendar.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-calendar',
                template: "<div class=\"mat-calendar-header\"><div class=\"mat-calendar-controls\"><button *ngIf=\"!_isCompatibilityMode\" md-button class=\"mat-calendar-period-button\" (click)=\"_currentPeriodClicked()\" [attr.aria-label]=\"_periodButtonLabel\">{{_periodButtonText}}<div class=\"mat-calendar-arrow\" [class.mat-calendar-invert]=\"!_monthView\"></div></button> <button *ngIf=\"_isCompatibilityMode\" mat-button class=\"mat-calendar-period-button\" (click)=\"_currentPeriodClicked()\" [attr.aria-label]=\"_periodButtonLabel\">{{_periodButtonText}}<div class=\"mat-calendar-arrow\" [class.mat-calendar-invert]=\"!_monthView\"></div></button><div class=\"mat-calendar-spacer\"></div><button *ngIf=\"!_isCompatibilityMode\" md-icon-button class=\"mat-calendar-previous-button\" [disabled]=\"!_previousEnabled()\" (click)=\"_previousClicked()\" [attr.aria-label]=\"_prevButtonLabel\"></button> <button *ngIf=\"_isCompatibilityMode\" mat-icon-button class=\"mat-calendar-previous-button\" [disabled]=\"!_previousEnabled()\" (click)=\"_previousClicked()\" [attr.aria-label]=\"_prevButtonLabel\"></button> <button *ngIf=\"!_isCompatibilityMode\" md-icon-button class=\"mat-calendar-next-button\" [disabled]=\"!_nextEnabled()\" (click)=\"_nextClicked()\" [attr.aria-label]=\"_nextButtonLabel\"></button> <button *ngIf=\"_isCompatibilityMode\" mat-icon-button class=\"mat-calendar-next-button\" [disabled]=\"!_nextEnabled()\" (click)=\"_nextClicked()\" [attr.aria-label]=\"_nextButtonLabel\"></button></div></div><div class=\"mat-calendar-content\" (keydown)=\"_handleCalendarBodyKeydown($event)\" [ngSwitch]=\"_monthView\" cdkMonitorSubtreeFocus><md-month-view *ngSwitchCase=\"true\" [activeDate]=\"_activeDate\" [selected]=\"selected\" [dateFilter]=\"_dateFilterForViews\" (selectedChange)=\"_dateSelected($event)\"></md-month-view><md-year-view *ngSwitchDefault [activeDate]=\"_activeDate\" [selected]=\"selected\" [dateFilter]=\"_dateFilterForViews\" (selectedChange)=\"_monthSelected($event)\"></md-year-view></div>",
                styles: [".mat-calendar{display:block}.mat-calendar-header{padding:8px 8px 0 8px}.mat-calendar-content{padding:0 8px 8px 8px;outline:0}.mat-calendar-controls{display:flex;padding:5% calc(100% / 14 - 22px) 5% calc(100% / 14 - 22px)}.mat-calendar-spacer{flex:1 1 auto}.mat-calendar-period-button{min-width:0}.mat-calendar-arrow{display:inline-block;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top-width:5px;border-top-style:solid;margin:0 0 0 5px;vertical-align:middle}.mat-calendar-arrow.mat-calendar-invert{transform:rotate(180deg)}[dir=rtl] .mat-calendar-arrow{margin:0 5px 0 0}.mat-calendar-next-button,.mat-calendar-previous-button{position:relative}.mat-calendar-next-button::after,.mat-calendar-previous-button::after{content:'';position:absolute;top:0;left:0;bottom:0;right:0;margin:15.5px;border:0 solid currentColor;border-top-width:2px}[dir=rtl] .mat-calendar-next-button,[dir=rtl] .mat-calendar-previous-button{transform:rotate(180deg)}.mat-calendar-previous-button::after{border-left-width:2px;transform:translateX(2px) rotate(-45deg)}.mat-calendar-next-button::after{border-right-width:2px;transform:translateX(-2px) rotate(45deg)}.mat-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mat-calendar-table-header th{text-align:center;padding:0 0 8px 0}.mat-calendar-table-header-divider{position:relative;height:1px}.mat-calendar-table-header-divider::after{content:'';position:absolute;top:0;left:-8px;right:-8px;height:1px}"],
                host: {
                    'class': 'mat-calendar',
                },
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdCalendar.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: MdDatepickerIntl, },
    { type: _angular_core.NgZone, },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MATERIAL_COMPATIBILITY_MODE,] },] },
    { type: DateAdapter, decorators: [{ type: _angular_core.Optional },] },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MD_DATE_FORMATS,] },] },
]; };
MdCalendar.propDecorators = {
    'startAt': [{ type: _angular_core.Input },],
    'startView': [{ type: _angular_core.Input },],
    'selected': [{ type: _angular_core.Input },],
    'minDate': [{ type: _angular_core.Input },],
    'maxDate': [{ type: _angular_core.Input },],
    'dateFilter': [{ type: _angular_core.Input },],
    'selectedChange': [{ type: _angular_core.Output },],
};
/**
 * Used to generate a unique ID for each datepicker instance.
 */
var datepickerUid = 0;
/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MdCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * \@docs-private
 */
var MdDatepickerContent = (function () {
    function MdDatepickerContent() {
    }
    /**
     * @return {?}
     */
    MdDatepickerContent.prototype.ngAfterContentInit = function () {
        this._calendar._focusActiveCell();
    };
    /**
     * Handles keydown event on datepicker content.
     * @param {?} event The event.
     * @return {?}
     */
    MdDatepickerContent.prototype._handleKeydown = function (event) {
        if (event.keyCode === _angular_cdk.ESCAPE) {
            this.datepicker.close();
            event.preventDefault();
        }
    };
    return MdDatepickerContent;
}());
MdDatepickerContent.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-datepicker-content',
                template: "<md-calendar cdkTrapFocus [id]=\"datepicker.id\" [startAt]=\"datepicker.startAt\" [startView]=\"datepicker.startView\" [minDate]=\"datepicker._minDate\" [maxDate]=\"datepicker._maxDate\" [dateFilter]=\"datepicker._dateFilter\" [selected]=\"datepicker._selected\" (selectedChange)=\"datepicker._selectAndClose($event)\"></md-calendar>",
                styles: [".mat-datepicker-content{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);display:block}.mat-calendar{width:296px}.mat-datepicker-content-touch{box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);display:block;max-height:80vh;overflow:auto;margin:-24px}.mat-datepicker-content-touch .mat-calendar{width:64vmin;height:80vmin;min-width:250px;min-height:312px;max-width:750px;max-height:788px}"],
                host: {
                    'class': 'mat-datepicker-content',
                    '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
                    '(keydown)': '_handleKeydown($event)',
                },
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdDatepickerContent.ctorParameters = function () { return []; };
MdDatepickerContent.propDecorators = {
    '_calendar': [{ type: _angular_core.ViewChild, args: [MdCalendar,] },],
};
/**
 * Component responsible for managing the datepicker popup/dialog.
 */
var MdDatepicker = (function () {
    /**
     * @param {?} _dialog
     * @param {?} _overlay
     * @param {?} _ngZone
     * @param {?} _viewContainerRef
     * @param {?} _dateAdapter
     * @param {?} _dir
     * @param {?} _document
     */
    function MdDatepicker(_dialog, _overlay, _ngZone, _viewContainerRef, _dateAdapter, _dir, _document) {
        this._dialog = _dialog;
        this._overlay = _overlay;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._document = _document;
        /**
         * The view that the calendar should start in.
         */
        this.startView = 'month';
        /**
         * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
         * than a popup and elements have more padding to allow for bigger touch targets.
         */
        this.touchUi = false;
        /**
         * Emits new selected date when selected date changes.
         */
        this.selectedChanged = new _angular_core.EventEmitter();
        /**
         * Whether the calendar is open.
         */
        this.opened = false;
        /**
         * The id for the datepicker calendar.
         */
        this.id = "md-datepicker-" + datepickerUid++;
        /**
         * The currently selected date.
         */
        this._selected = null;
        /**
         * The element that was focused before the datepicker was opened.
         */
        this._focusedElementBeforeOpen = null;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
    }
    Object.defineProperty(MdDatepicker.prototype, "startAt", {
        /**
         * The date to open the calendar to initially.
         * @return {?}
         */
        get: function () {
            // If an explicit startAt is set we start there, otherwise we start at whatever the currently
            // selected value is.
            return this._startAt || (this._datepickerInput ? this._datepickerInput.value : null);
        },
        /**
         * @param {?} date
         * @return {?}
         */
        set: function (date) { this._startAt = date; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepicker.prototype, "disabled", {
        /**
         * Whether the datepicker pop-up should be disabled.
         * @return {?}
         */
        get: function () {
            return this._disabled === undefined ? this._datepickerInput.disabled : this._disabled;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = _angular_cdk.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepicker.prototype, "_minDate", {
        /**
         * The minimum selectable date.
         * @return {?}
         */
        get: function () {
            return this._datepickerInput && this._datepickerInput.min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepicker.prototype, "_maxDate", {
        /**
         * The maximum selectable date.
         * @return {?}
         */
        get: function () {
            return this._datepickerInput && this._datepickerInput.max;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepicker.prototype, "_dateFilter", {
        /**
         * @return {?}
         */
        get: function () {
            return this._datepickerInput && this._datepickerInput._dateFilter;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdDatepicker.prototype.ngOnDestroy = function () {
        this.close();
        if (this._popupRef) {
            this._popupRef.dispose();
        }
        if (this._inputSubscription) {
            this._inputSubscription.unsubscribe();
        }
    };
    /**
     * Selects the given date and closes the currently open popup or dialog.
     * @param {?} date
     * @return {?}
     */
    MdDatepicker.prototype._selectAndClose = function (date) {
        var /** @type {?} */ oldValue = this._selected;
        this._selected = date;
        if (!this._dateAdapter.sameDate(oldValue, this._selected)) {
            this.selectedChanged.emit(date);
        }
        this.close();
    };
    /**
     * Register an input with this datepicker.
     * @param {?} input The datepicker input to register with this datepicker.
     * @return {?}
     */
    MdDatepicker.prototype._registerInput = function (input) {
        var _this = this;
        if (this._datepickerInput) {
            throw Error('An MdDatepicker can only be associated with a single input.');
        }
        this._datepickerInput = input;
        this._inputSubscription =
            this._datepickerInput._valueChange.subscribe(function (value) { return _this._selected = value; });
    };
    /**
     * Open the calendar.
     * @return {?}
     */
    MdDatepicker.prototype.open = function () {
        if (this.opened || this.disabled) {
            return;
        }
        if (!this._datepickerInput) {
            throw Error('Attempted to open an MdDatepicker with no associated input.');
        }
        if (this._document) {
            this._focusedElementBeforeOpen = this._document.activeElement;
        }
        this.touchUi ? this._openAsDialog() : this._openAsPopup();
        this.opened = true;
    };
    /**
     * Close the calendar.
     * @return {?}
     */
    MdDatepicker.prototype.close = function () {
        if (!this.opened) {
            return;
        }
        if (this._popupRef && this._popupRef.hasAttached()) {
            this._popupRef.detach();
        }
        if (this._dialogRef) {
            this._dialogRef.close();
            this._dialogRef = null;
        }
        if (this._calendarPortal && this._calendarPortal.isAttached) {
            this._calendarPortal.detach();
        }
        if (this._focusedElementBeforeOpen && 'focus' in this._focusedElementBeforeOpen) {
            this._focusedElementBeforeOpen.focus();
            this._focusedElementBeforeOpen = null;
        }
        this.opened = false;
    };
    /**
     * Open the calendar as a dialog.
     * @return {?}
     */
    MdDatepicker.prototype._openAsDialog = function () {
        var _this = this;
        this._dialogRef = this._dialog.open(MdDatepickerContent, {
            viewContainerRef: this._viewContainerRef,
            direction: this._dir ? this._dir.value : 'ltr'
        });
        this._dialogRef.afterClosed().subscribe(function () { return _this.close(); });
        this._dialogRef.componentInstance.datepicker = this;
    };
    /**
     * Open the calendar as a popup.
     * @return {?}
     */
    MdDatepicker.prototype._openAsPopup = function () {
        var _this = this;
        if (!this._calendarPortal) {
            this._calendarPortal = new _angular_cdk.ComponentPortal(MdDatepickerContent, this._viewContainerRef);
        }
        if (!this._popupRef) {
            this._createPopup();
        }
        if (!this._popupRef.hasAttached()) {
            var /** @type {?} */ componentRef = this._popupRef.attach(this._calendarPortal);
            componentRef.instance.datepicker = this;
            // Update the position once the calendar has rendered.
            _angular_cdk.first.call(this._ngZone.onStable).subscribe(function () { return _this._popupRef.updatePosition(); });
        }
        this._popupRef.backdropClick().subscribe(function () { return _this.close(); });
    };
    /**
     * Create the popup.
     * @return {?}
     */
    MdDatepicker.prototype._createPopup = function () {
        var /** @type {?} */ overlayState = new OverlayState();
        overlayState.positionStrategy = this._createPopupPositionStrategy();
        overlayState.hasBackdrop = true;
        overlayState.backdropClass = 'md-overlay-transparent-backdrop';
        overlayState.direction = this._dir ? this._dir.value : 'ltr';
        overlayState.scrollStrategy = this._overlay.scrollStrategies.reposition();
        this._popupRef = this._overlay.create(overlayState);
    };
    /**
     * Create the popup PositionStrategy.
     * @return {?}
     */
    MdDatepicker.prototype._createPopupPositionStrategy = function () {
        return this._overlay.position()
            .connectedTo(this._datepickerInput.getPopupConnectionElementRef(), { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' })
            .withFallbackPosition({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' })
            .withFallbackPosition({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' });
    };
    return MdDatepicker;
}());
MdDatepicker.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-datepicker, mat-datepicker',
                template: '',
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdDatepicker.ctorParameters = function () { return [
    { type: MdDialog, },
    { type: Overlay, },
    { type: _angular_core.NgZone, },
    { type: _angular_core.ViewContainerRef, },
    { type: DateAdapter, decorators: [{ type: _angular_core.Optional },] },
    { type: _angular_cdk.Directionality, decorators: [{ type: _angular_core.Optional },] },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_platformBrowser.DOCUMENT,] },] },
]; };
MdDatepicker.propDecorators = {
    'startAt': [{ type: _angular_core.Input },],
    'startView': [{ type: _angular_core.Input },],
    'touchUi': [{ type: _angular_core.Input },],
    'disabled': [{ type: _angular_core.Input },],
    'selectedChanged': [{ type: _angular_core.Output },],
};
var MD_DATEPICKER_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MdDatepickerInput; }),
    multi: true
};
var MD_DATEPICKER_VALIDATORS = {
    provide: _angular_forms.NG_VALIDATORS,
    useExisting: _angular_core.forwardRef(function () { return MdDatepickerInput; }),
    multi: true
};
/**
 * Directive used to connect an input to a MdDatepicker.
 */
var MdDatepickerInput = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     * @param {?} _mdInputContainer
     */
    function MdDatepickerInput(_elementRef, _renderer, _dateAdapter, _dateFormats, _mdInputContainer) {
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._mdInputContainer = _mdInputContainer;
        /**
         * Emits when the value changes (either due to user input or programmatic change).
         */
        this._valueChange = new _angular_core.EventEmitter();
        this._onTouched = function () { };
        this._cvaOnChange = function () { };
        this._validatorOnChange = function () { };
        /**
         * The form control validator for the min date.
         */
        this._minValidator = function (control) {
            return (!_this.min || !control.value ||
                _this._dateAdapter.compareDate(_this.min, control.value) <= 0) ?
                null : { 'mdDatepickerMin': { 'min': _this.min, 'actual': control.value } };
        };
        /**
         * The form control validator for the max date.
         */
        this._maxValidator = function (control) {
            return (!_this.max || !control.value ||
                _this._dateAdapter.compareDate(_this.max, control.value) >= 0) ?
                null : { 'mdDatepickerMax': { 'max': _this.max, 'actual': control.value } };
        };
        /**
         * The form control validator for the date filter.
         */
        this._filterValidator = function (control) {
            return !_this._dateFilter || !control.value || _this._dateFilter(control.value) ?
                null : { 'mdDatepickerFilter': true };
        };
        /**
         * The combined form control validator for this input.
         */
        this._validator = _angular_forms.Validators.compose([this._minValidator, this._maxValidator, this._filterValidator]);
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
    }
    Object.defineProperty(MdDatepickerInput.prototype, "mdDatepicker", {
        /**
         * The datepicker that this input is associated with.
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value) {
                this._datepicker = value;
                this._datepicker._registerInput(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerInput.prototype, "matDatepicker", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this.mdDatepicker = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerInput.prototype, "mdDatepickerFilter", {
        /**
         * @param {?} filter
         * @return {?}
         */
        set: function (filter$$1) {
            this._dateFilter = filter$$1;
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerInput.prototype, "matDatepickerFilter", {
        /**
         * @param {?} filter
         * @return {?}
         */
        set: function (filter$$1) {
            this.mdDatepickerFilter = filter$$1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerInput.prototype, "value", {
        /**
         * The value of the input.
         * @return {?}
         */
        get: function () {
            return this._dateAdapter.parse(this._elementRef.nativeElement.value, this._dateFormats.parse.dateInput);
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            var /** @type {?} */ date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
            var /** @type {?} */ oldDate = this.value;
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', date ? this._dateAdapter.format(date, this._dateFormats.display.dateInput) : '');
            if (!this._dateAdapter.sameDate(oldDate, date)) {
                this._valueChange.emit(date);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerInput.prototype, "min", {
        /**
         * The minimum valid date.
         * @return {?}
         */
        get: function () { return this._min; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._min = value;
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerInput.prototype, "max", {
        /**
         * The maximum valid date.
         * @return {?}
         */
        get: function () { return this._max; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._max = value;
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerInput.prototype, "disabled", {
        /**
         * Whether the datepicker-input is disabled.
         * @return {?}
         */
        get: function () { return this._disabled; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = _angular_cdk.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdDatepickerInput.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (this._datepicker) {
            this._datepickerSubscription =
                this._datepicker.selectedChanged.subscribe(function (selected) {
                    _this.value = selected;
                    _this._cvaOnChange(selected);
                });
        }
    };
    /**
     * @return {?}
     */
    MdDatepickerInput.prototype.ngOnDestroy = function () {
        if (this._datepickerSubscription) {
            this._datepickerSubscription.unsubscribe();
        }
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    MdDatepickerInput.prototype.registerOnValidatorChange = function (fn) {
        this._validatorOnChange = fn;
    };
    /**
     * @param {?} c
     * @return {?}
     */
    MdDatepickerInput.prototype.validate = function (c) {
        return this._validator ? this._validator(c) : null;
    };
    /**
     * Gets the element that the datepicker popup should be connected to.
     * @return {?} The element to connect the popup to.
     */
    MdDatepickerInput.prototype.getPopupConnectionElementRef = function () {
        return this._mdInputContainer ? this._mdInputContainer.underlineRef : this._elementRef;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    MdDatepickerInput.prototype.writeValue = function (value) {
        this.value = value;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    MdDatepickerInput.prototype.registerOnChange = function (fn) {
        this._cvaOnChange = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    MdDatepickerInput.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    /**
     * @param {?} disabled
     * @return {?}
     */
    MdDatepickerInput.prototype.setDisabledState = function (disabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', disabled);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdDatepickerInput.prototype._onKeydown = function (event) {
        if (event.altKey && event.keyCode === _angular_cdk.DOWN_ARROW) {
            this._datepicker.open();
            event.preventDefault();
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    MdDatepickerInput.prototype._onInput = function (value) {
        var /** @type {?} */ date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
        this._cvaOnChange(date);
        this._valueChange.emit(date);
    };
    return MdDatepickerInput;
}());
MdDatepickerInput.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'input[mdDatepicker], input[matDatepicker]',
                providers: [MD_DATEPICKER_VALUE_ACCESSOR, MD_DATEPICKER_VALIDATORS],
                host: {
                    '[attr.aria-expanded]': '_datepicker?.opened || "false"',
                    '[attr.aria-haspopup]': 'true',
                    '[attr.aria-owns]': '_datepicker?.id',
                    '[attr.min]': 'min ? _dateAdapter.getISODateString(min) : null',
                    '[attr.max]': 'max ? _dateAdapter.getISODateString(max) : null',
                    '[disabled]': 'disabled',
                    '(input)': '_onInput($event.target.value)',
                    '(blur)': '_onTouched()',
                    '(keydown)': '_onKeydown($event)',
                }
            },] },
];
/**
 * @nocollapse
 */
MdDatepickerInput.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: DateAdapter, decorators: [{ type: _angular_core.Optional },] },
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MD_DATE_FORMATS,] },] },
    { type: MdInputContainer, decorators: [{ type: _angular_core.Optional },] },
]; };
MdDatepickerInput.propDecorators = {
    'mdDatepicker': [{ type: _angular_core.Input },],
    'matDatepicker': [{ type: _angular_core.Input },],
    'mdDatepickerFilter': [{ type: _angular_core.Input },],
    'matDatepickerFilter': [{ type: _angular_core.Input },],
    'value': [{ type: _angular_core.Input },],
    'min': [{ type: _angular_core.Input },],
    'max': [{ type: _angular_core.Input },],
    'disabled': [{ type: _angular_core.Input },],
};
var MdDatepickerToggle = (function () {
    /**
     * @param {?} _intl
     */
    function MdDatepickerToggle(_intl) {
        this._intl = _intl;
    }
    Object.defineProperty(MdDatepickerToggle.prototype, "_datepicker", {
        /**
         * @return {?}
         */
        get: function () { return this.datepicker; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.datepicker = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerToggle.prototype, "disabled", {
        /**
         * Whether the toggle button is disabled.
         * @return {?}
         */
        get: function () {
            return this._disabled === undefined ? this.datepicker.disabled : this._disabled;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = _angular_cdk.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} event
     * @return {?}
     */
    MdDatepickerToggle.prototype._open = function (event) {
        if (this.datepicker && !this.disabled) {
            this.datepicker.open();
            event.stopPropagation();
        }
    };
    return MdDatepickerToggle;
}());
MdDatepickerToggle.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'button[mdDatepickerToggle], button[matDatepickerToggle]',
                template: '',
                styles: [".mat-datepicker-toggle{display:inline-block;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE5IDNoLTFWMWgtMnYySDhWMUg2djJINWMtMS4xMSAwLTEuOTkuOS0xLjk5IDJMMyAxOWMwIDEuMS44OSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMlY1YzAtMS4xLS45LTItMi0yem0wIDE2SDVWOGgxNHYxMXpNNyAxMGg1djVIN3oiLz48L3N2Zz4=) no-repeat;background-size:contain;height:24px;width:24px;border:none;outline:0;vertical-align:middle}.mat-datepicker-toggle:not([disabled]){cursor:pointer}"],
                host: {
                    'type': 'button',
                    'class': 'mat-datepicker-toggle',
                    '[attr.aria-label]': '_intl.openCalendarLabel',
                    '[disabled]': 'disabled',
                    '(click)': '_open($event)',
                },
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdDatepickerToggle.ctorParameters = function () { return [
    { type: MdDatepickerIntl, },
]; };
MdDatepickerToggle.propDecorators = {
    'datepicker': [{ type: _angular_core.Input, args: ['mdDatepickerToggle',] },],
    '_datepicker': [{ type: _angular_core.Input, args: ['matDatepickerToggle',] },],
    'disabled': [{ type: _angular_core.Input },],
};
var MdDatepickerModule = (function () {
    function MdDatepickerModule() {
    }
    return MdDatepickerModule;
}());
MdDatepickerModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule,
                    MdButtonModule,
                    MdDialogModule,
                    OverlayModule,
                    StyleModule,
                    _angular_cdk.A11yModule,
                ],
                exports: [
                    MdDatepicker,
                    MdDatepickerContent,
                    MdDatepickerInput,
                    MdDatepickerToggle,
                ],
                declarations: [
                    MdCalendar,
                    MdCalendarBody,
                    MdDatepicker,
                    MdDatepickerContent,
                    MdDatepickerInput,
                    MdDatepickerToggle,
                    MdMonthView,
                    MdYearView,
                ],
                providers: [
                    MdDatepickerIntl,
                ],
                entryComponents: [
                    MdDatepickerContent,
                ]
            },] },
];
/**
 * @nocollapse
 */
MdDatepickerModule.ctorParameters = function () { return []; };
/**
 * Unique ID counter
 */
var nextId$3 = 0;
/**
 * Directive whose purpose is to manage the expanded state of CdkAccordionItem children.
 */
var CdkAccordion = (function () {
    function CdkAccordion() {
        /**
         * A readonly id value to use for unique selection coordination.
         */
        this.id = "cdk-accordion-" + nextId$3++;
        this._multi = false;
        this._hideToggle = false;
        /**
         * The display mode used for all expansion panels in the accordion. Currently two display
         * modes exist:
         *   default - a gutter-like spacing is placed around any expanded panel, placing the expanded
         *     panel at a different elevation from the reset of the accordion.
         *  flat - no spacing is placed around expanded panels, showing all panels at the same
         *     elevation.
         */
        this.displayMode = 'default';
    }
    Object.defineProperty(CdkAccordion.prototype, "multi", {
        /**
         * Whether the accordion should allow multiple expanded accordion items simulateously.
         * @return {?}
         */
        get: function () { return this._multi; },
        /**
         * @param {?} multi
         * @return {?}
         */
        set: function (multi) { this._multi = _angular_cdk.coerceBooleanProperty(multi); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkAccordion.prototype, "hideToggle", {
        /**
         * Whether the expansion indicator should be hidden.
         * @return {?}
         */
        get: function () { return this._hideToggle; },
        /**
         * @param {?} show
         * @return {?}
         */
        set: function (show) { this._hideToggle = _angular_cdk.coerceBooleanProperty(show); },
        enumerable: true,
        configurable: true
    });
    return CdkAccordion;
}());
CdkAccordion.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[cdk-accordion]',
            },] },
];
/**
 * @nocollapse
 */
CdkAccordion.ctorParameters = function () { return []; };
CdkAccordion.propDecorators = {
    'multi': [{ type: _angular_core.Input },],
    'hideToggle': [{ type: _angular_core.Input },],
    'displayMode': [{ type: _angular_core.Input },],
};
/**
 * Directive for a Material Design Accordion.
 */
var MdAccordion = (function (_super) {
    __extends(MdAccordion, _super);
    function MdAccordion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdAccordion;
}(CdkAccordion));
MdAccordion.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'mat-accordion, md-accordion',
                host: {
                    class: 'mat-accordion'
                }
            },] },
];
/**
 * @nocollapse
 */
MdAccordion.ctorParameters = function () { return []; };
/**
 * Used to generate unique ID for each expansion panel.
 */
var nextId$4 = 0;
/**
 * An abstract class to be extended and decorated as a component.  Sets up all
 * events and attributes needed to be managed by a CdkAccordion parent.
 */
var AccordionItem = (function () {
    /**
     * @param {?} accordion
     * @param {?} _changeDetectorRef
     * @param {?} _expansionDispatcher
     */
    function AccordionItem(accordion, _changeDetectorRef, _expansionDispatcher) {
        var _this = this;
        this.accordion = accordion;
        this._changeDetectorRef = _changeDetectorRef;
        this._expansionDispatcher = _expansionDispatcher;
        /**
         * Event emitted every time the MdAccordianChild is closed.
         */
        this.closed = new _angular_core.EventEmitter();
        /**
         * Event emitted every time the MdAccordianChild is opened.
         */
        this.opened = new _angular_core.EventEmitter();
        /**
         * Event emitted when the MdAccordianChild is destroyed.
         */
        this.destroyed = new _angular_core.EventEmitter();
        /**
         * The unique MdAccordianChild id.
         */
        this.id = "cdk-accordion-child-" + nextId$4++;
        /**
         * Unregister function for _expansionDispatcher *
         */
        this._removeUniqueSelectionListener = function () { };
        this._removeUniqueSelectionListener =
            _expansionDispatcher.listen(function (id, accordionId) {
                if (_this.accordion && !_this.accordion.multi &&
                    _this.accordion.id === accordionId && _this.id !== id) {
                    _this.expanded = false;
                }
            });
    }
    Object.defineProperty(AccordionItem.prototype, "expanded", {
        /**
         * Whether the MdAccordianChild is expanded.
         * @return {?}
         */
        get: function () { return this._expanded; },
        /**
         * @param {?} expanded
         * @return {?}
         */
        set: function (expanded) {
            // Only emit events and update the internal value if the value changes.
            if (this._expanded !== expanded) {
                this._expanded = expanded;
                if (expanded) {
                    this.opened.emit();
                    /**
                     * In the unique selection dispatcher, the id parameter is the id of the CdkAccordonItem,
                     * the name value is the id of the accordion.
                     */
                    var accordionId = this.accordion ? this.accordion.id : this.id;
                    this._expansionDispatcher.notify(this.id, accordionId);
                }
                else {
                    this.closed.emit();
                }
                // Ensures that the animation will run when the value is set outside of an `@Input`.
                // This includes cases like the open, close and toggle methods.
                this._changeDetectorRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Emits an event for the accordion item being destroyed.
     * @return {?}
     */
    AccordionItem.prototype.ngOnDestroy = function () {
        this.destroyed.emit();
        this._removeUniqueSelectionListener();
    };
    /**
     * Toggles the expanded state of the accordion item.
     * @return {?}
     */
    AccordionItem.prototype.toggle = function () {
        this.expanded = !this.expanded;
    };
    /**
     * Sets the expanded state of the accordion item to false.
     * @return {?}
     */
    AccordionItem.prototype.close = function () {
        this.expanded = false;
    };
    /**
     * Sets the expanded state of the accordion item to true.
     * @return {?}
     */
    AccordionItem.prototype.open = function () {
        this.expanded = true;
    };
    return AccordionItem;
}());
AccordionItem.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
AccordionItem.ctorParameters = function () { return [
    { type: CdkAccordion, decorators: [{ type: _angular_core.Optional },] },
    { type: _angular_core.ChangeDetectorRef, },
    { type: UniqueSelectionDispatcher, },
]; };
AccordionItem.propDecorators = {
    'closed': [{ type: _angular_core.Output },],
    'opened': [{ type: _angular_core.Output },],
    'destroyed': [{ type: _angular_core.Output },],
    'expanded': [{ type: _angular_core.Input },],
};
/**
 * Time and timing curve for expansion panel animations.
 */
var EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';
/**
 * <md-expansion-panel> component.
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the CdkAccordion directive attached.
 *
 * Please refer to README.md for examples on how to use it.
 */
var MdExpansionPanel = (function (_super) {
    __extends(MdExpansionPanel, _super);
    /**
     * @param {?} accordion
     * @param {?} _changeDetectorRef
     * @param {?} _uniqueSelectionDispatcher
     */
    function MdExpansionPanel(accordion, _changeDetectorRef, _uniqueSelectionDispatcher) {
        var _this = _super.call(this, accordion, _changeDetectorRef, _uniqueSelectionDispatcher) || this;
        /**
         * Whether the toggle indicator should be hidden.
         */
        _this.hideToggle = false;
        _this.accordion = accordion;
        return _this;
    }
    /**
     * Whether the expansion indicator should be hidden.
     * @return {?}
     */
    MdExpansionPanel.prototype._getHideToggle = function () {
        if (this.accordion) {
            return this.accordion.hideToggle;
        }
        return this.hideToggle;
    };
    /**
     * Gets the panel's display mode.
     * @return {?}
     */
    MdExpansionPanel.prototype._getDisplayMode = function () {
        if (!this.expanded) {
            return this._getExpandedState();
        }
        if (this.accordion) {
            return this.accordion.displayMode;
        }
        return this._getExpandedState();
    };
    /**
     * Gets the expanded state string.
     * @return {?}
     */
    MdExpansionPanel.prototype._getExpandedState = function () {
        return this.expanded ? 'expanded' : 'collapsed';
    };
    return MdExpansionPanel;
}(AccordionItem));
MdExpansionPanel.decorators = [
    { type: _angular_core.Component, args: [{ styles: [".mat-expansion-panel{transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);box-sizing:content-box;display:block}.mat-expansion-panel:not([class*=mat-elevation-z]){box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.mat-expansion-panel-content{overflow:hidden}.mat-expansion-panel-body{padding:0 24px 16px}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px}.mat-action-row button.mat-button{margin-left:8px}"],
                selector: 'md-expansion-panel, mat-expansion-panel',
                template: "<ng-content select=\"mat-expansion-panel-header, md-expansion-panel-header\"></ng-content><div [class.mat-expanded]=\"expanded\" class=\"mat-expansion-panel-content\" [@bodyExpansion]=\"_getExpandedState()\" [id]=\"id\"><div class=\"mat-expansion-panel-body\"><ng-content></ng-content></div><ng-content select=\"mat-action-row, md-action-row\"></ng-content></div>",
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'mat-expansion-panel',
                    '[class.mat-expanded]': 'expanded',
                    '[@displayMode]': '_getDisplayMode()',
                },
                providers: [
                    { provide: AccordionItem, useExisting: _angular_core.forwardRef(function () { return MdExpansionPanel; }) }
                ],
                animations: [
                    _angular_animations.trigger('bodyExpansion', [
                        _angular_animations.state('collapsed', _angular_animations.style({ height: '0px', visibility: 'hidden' })),
                        _angular_animations.state('expanded', _angular_animations.style({ height: '*', visibility: 'visible' })),
                        _angular_animations.transition('expanded <=> collapsed', _angular_animations.animate(EXPANSION_PANEL_ANIMATION_TIMING)),
                    ]),
                    _angular_animations.trigger('displayMode', [
                        _angular_animations.state('collapsed', _angular_animations.style({ margin: '0' })),
                        _angular_animations.state('default', _angular_animations.style({ margin: '16px 0' })),
                        _angular_animations.state('flat', _angular_animations.style({ margin: '0' })),
                        _angular_animations.transition('flat <=> collapsed, default <=> collapsed, flat <=> default', _angular_animations.animate(EXPANSION_PANEL_ANIMATION_TIMING)),
                    ]),
                ],
            },] },
];
/**
 * @nocollapse
 */
MdExpansionPanel.ctorParameters = function () { return [
    { type: MdAccordion, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Host },] },
    { type: _angular_core.ChangeDetectorRef, },
    { type: UniqueSelectionDispatcher, },
]; };
MdExpansionPanel.propDecorators = {
    'hideToggle': [{ type: _angular_core.Input },],
};
var MdExpansionPanelActionRow = (function () {
    function MdExpansionPanelActionRow() {
    }
    return MdExpansionPanelActionRow;
}());
MdExpansionPanelActionRow.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'mat-action-row, md-action-row',
                host: {
                    class: 'mat-action-row'
                }
            },] },
];
/**
 * @nocollapse
 */
MdExpansionPanelActionRow.ctorParameters = function () { return []; };
/**
 * <md-expansion-panel-header> component.
 *
 * This component corresponds to the header element of an <md-expansion-panel>.
 *
 * Please refer to README.md for examples on how to use it.
 */
var MdExpansionPanelHeader = (function () {
    /**
     * @param {?} panel
     */
    function MdExpansionPanelHeader(panel) {
        this.panel = panel;
    }
    /**
     * Toggles the expanded state of the panel.
     * @return {?}
     */
    MdExpansionPanelHeader.prototype._toggle = function () {
        this.panel.toggle();
    };
    /**
     * Gets whether the panel is expanded.
     * @return {?}
     */
    MdExpansionPanelHeader.prototype._isExpanded = function () {
        return this.panel.expanded;
    };
    /**
     * Gets the expanded state string of the panel.
     * @return {?}
     */
    MdExpansionPanelHeader.prototype._getExpandedState = function () {
        return this.panel._getExpandedState();
    };
    /**
     * Gets the panel id.
     * @return {?}
     */
    MdExpansionPanelHeader.prototype._getPanelId = function () {
        return this.panel.id;
    };
    /**
     * Gets whether the expand indicator is hidden.
     * @return {?}
     */
    MdExpansionPanelHeader.prototype._getHideToggle = function () {
        return this.panel.hideToggle;
    };
    /**
     * Handle keyup event calling to toggle() if appropriate.
     * @param {?} event
     * @return {?}
     */
    MdExpansionPanelHeader.prototype._keyup = function (event) {
        switch (event.keyCode) {
            // Toggle for space and enter keys.
            case _angular_cdk.SPACE:
            case _angular_cdk.ENTER:
                event.preventDefault();
                this._toggle();
                break;
            default:
                return;
        }
    };
    return MdExpansionPanelHeader;
}());
MdExpansionPanelHeader.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-expansion-panel-header, mat-expansion-panel-header',
                styles: [".mat-expansion-panel-header{cursor:pointer;display:flex;flex-direction:row;height:48px;line-height:48px;padding:0 24px}.mat-expansion-panel-header.mat-expanded{height:64px;line-height:64px}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:0}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-expansion-panel-header-title{display:flex;flex-grow:1;font-size:15px;margin-right:16px}.mat-expansion-panel-header-description{display:flex;flex-grow:2;font-size:15px;margin-right:16px}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:'';display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle}"],
                template: "<span class=\"mat-content\"><ng-content select=\"md-panel-title, mat-panel-title\"></ng-content><ng-content select=\"md-panel-description, mat-panel-description\"></ng-content><ng-content></ng-content></span><span [@indicatorRotate]=\"_getExpandedState()\" *ngIf=\"!_getHideToggle()\" class=\"mat-expansion-indicator\"></span>",
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'mat-expansion-panel-header',
                    'role': 'button',
                    'tabindex': '0',
                    '[attr.aria-controls]': '_getPanelId()',
                    '[attr.aria-expanded]': '_isExpanded()',
                    '[class.mat-expanded]': '_isExpanded()',
                    '(click)': '_toggle()',
                    '(keyup)': '_keyup($event)',
                    '[@expansionHeight]': '_getExpandedState()',
                },
                animations: [
                    _angular_animations.trigger('indicatorRotate', [
                        _angular_animations.state('collapsed', _angular_animations.style({ transform: 'rotate(0deg)' })),
                        _angular_animations.state('expanded', _angular_animations.style({ transform: 'rotate(180deg)' })),
                        _angular_animations.transition('expanded <=> collapsed', _angular_animations.animate(EXPANSION_PANEL_ANIMATION_TIMING)),
                    ]),
                    _angular_animations.trigger('expansionHeight', [
                        _angular_animations.state('collapsed', _angular_animations.style({ height: '48px', 'line-height': '48px' })),
                        _angular_animations.state('expanded', _angular_animations.style({ height: '64px', 'line-height': '68px' })),
                        _angular_animations.transition('expanded <=> collapsed', _angular_animations.animate(EXPANSION_PANEL_ANIMATION_TIMING)),
                    ]),
                ],
            },] },
];
/**
 * @nocollapse
 */
MdExpansionPanelHeader.ctorParameters = function () { return [
    { type: MdExpansionPanel, decorators: [{ type: _angular_core.Host },] },
]; };
/**
 * <md-panel-description> directive.
 *
 * This direction is to be used inside of the MdExpansionPanelHeader component.
 */
var MdExpansionPanelDescription = (function () {
    function MdExpansionPanelDescription() {
    }
    return MdExpansionPanelDescription;
}());
MdExpansionPanelDescription.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-panel-description, mat-panel-description',
                host: {
                    class: 'mat-expansion-panel-header-description'
                }
            },] },
];
/**
 * @nocollapse
 */
MdExpansionPanelDescription.ctorParameters = function () { return []; };
/**
 * <md-panel-title> directive.
 *
 * This direction is to be used inside of the MdExpansionPanelHeader component.
 */
var MdExpansionPanelTitle = (function () {
    function MdExpansionPanelTitle() {
    }
    return MdExpansionPanelTitle;
}());
MdExpansionPanelTitle.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-panel-title, mat-panel-title',
                host: {
                    class: 'mat-expansion-panel-header-title'
                }
            },] },
];
/**
 * @nocollapse
 */
MdExpansionPanelTitle.ctorParameters = function () { return []; };
var MdExpansionModule = (function () {
    function MdExpansionModule() {
    }
    return MdExpansionModule;
}());
MdExpansionModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [CompatibilityModule, _angular_common.CommonModule],
                exports: [
                    CdkAccordion,
                    MdAccordion,
                    MdExpansionPanel,
                    MdExpansionPanelActionRow,
                    MdExpansionPanelHeader,
                    MdExpansionPanelTitle,
                    MdExpansionPanelDescription
                ],
                declarations: [
                    CdkAccordion,
                    MdAccordion,
                    MdExpansionPanel,
                    MdExpansionPanelActionRow,
                    MdExpansionPanelHeader,
                    MdExpansionPanelTitle,
                    MdExpansionPanelDescription
                ],
                providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER]
            },] },
];
/**
 * @nocollapse
 */
MdExpansionModule.ctorParameters = function () { return []; };
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MdTable = _angular_cdk.CdkTable;
/**
 * Wrapper for the CdkTable with Material design styles.
 */
var MdTable = (function (_super) {
    __extends(MdTable, _super);
    function MdTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdTable;
}(_MdTable));
MdTable.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-table, mat-table',
                template: _angular_cdk.CDK_TABLE_TEMPLATE,
                styles: [".mat-table{display:block}.mat-header-row,.mat-row{display:flex;border-bottom-width:1px;border-bottom-style:solid;align-items:center;height:48px;padding:0 24px}.mat-cell,.mat-header-cell{flex:1}"],
                host: {
                    'class': 'mat-table',
                },
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdTable.ctorParameters = function () { return []; };
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MdHeaderCellBase = _angular_cdk.CdkHeaderCell;
var _MdCell = _angular_cdk.CdkCell;
/**
 * Header cell template container that adds the right classes and role.
 */
var MdHeaderCell = (function (_super) {
    __extends(MdHeaderCell, _super);
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     * @param {?} renderer
     */
    function MdHeaderCell(columnDef, elementRef, renderer) {
        var _this = _super.call(this, columnDef, elementRef, renderer) || this;
        renderer.addClass(elementRef.nativeElement, "mat-column-" + columnDef.name);
        return _this;
    }
    return MdHeaderCell;
}(_MdHeaderCellBase));
MdHeaderCell.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-header-cell, mat-header-cell',
                host: {
                    'class': 'mat-header-cell',
                    'role': 'columnheader',
                },
            },] },
];
/**
 * @nocollapse
 */
MdHeaderCell.ctorParameters = function () { return [
    { type: _angular_cdk.CdkColumnDef, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
]; };
/**
 * Cell template container that adds the right classes and role.
 */
var MdCell = (function (_super) {
    __extends(MdCell, _super);
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     * @param {?} renderer
     */
    function MdCell(columnDef, elementRef, renderer) {
        var _this = _super.call(this, columnDef, elementRef, renderer) || this;
        renderer.addClass(elementRef.nativeElement, "mat-column-" + columnDef.name);
        return _this;
    }
    return MdCell;
}(_MdCell));
MdCell.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'md-cell, mat-cell',
                host: {
                    'class': 'mat-cell',
                    'role': 'gridcell',
                },
            },] },
];
/**
 * @nocollapse
 */
MdCell.ctorParameters = function () { return [
    { type: _angular_cdk.CdkColumnDef, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
]; };
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MdHeaderRow = _angular_cdk.CdkHeaderRow;
var _MdRow = _angular_cdk.CdkRow;
/**
 * Header template container that contains the cell outlet. Adds the right class and role.
 */
var MdHeaderRow = (function (_super) {
    __extends(MdHeaderRow, _super);
    function MdHeaderRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdHeaderRow;
}(_MdHeaderRow));
MdHeaderRow.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'md-header-row, mat-header-row',
                template: _angular_cdk.CDK_ROW_TEMPLATE,
                host: {
                    'class': 'mat-header-row',
                    'role': 'row',
                },
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdHeaderRow.ctorParameters = function () { return []; };
/**
 * Data row template container that contains the cell outlet. Adds the right class and role.
 */
var MdRow = (function (_super) {
    __extends(MdRow, _super);
    function MdRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdRow;
}(_MdRow));
MdRow.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'md-row, mat-row',
                template: _angular_cdk.CDK_ROW_TEMPLATE,
                host: {
                    'class': 'mat-row',
                    'role': 'row',
                },
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdRow.ctorParameters = function () { return []; };
var MdTableModule = (function () {
    function MdTableModule() {
    }
    return MdTableModule;
}());
MdTableModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_cdk.CdkTableModule, _angular_common.CommonModule, MdCommonModule],
                exports: [MdTable, MdHeaderCell, MdCell, MdHeaderRow, MdRow],
                declarations: [MdTable, MdHeaderCell, MdCell, MdHeaderRow, MdRow],
            },] },
];
/**
 * @nocollapse
 */
MdTableModule.ctorParameters = function () { return []; };
/**
 * \@docs-private
 * @param {?} id
 * @return {?}
 */
function getMdSortDuplicateMdSortableIdError(id) {
    return Error("Cannot have two MdSortables with the same id (" + id + ").");
}
/**
 * \@docs-private
 * @return {?}
 */
function getMdSortHeaderNotContainedWithinMdSortError() {
    return Error("MdSortHeader must be placed within a parent element with the MdSort directive.");
}
/**
 * \@docs-private
 * @return {?}
 */
function getMdSortHeaderMissingIdError() {
    return Error("MdSortHeader must be provided with a unique id.");
}
/**
 * Container for MdSortables to manage the sort state and provide default sort parameters.
 */
var MdSort = (function () {
    function MdSort() {
        /**
         * Collection of all registered sortables that this directive manages.
         */
        this.sortables = new Map();
        /**
         * The direction to set when an MdSortable is initially sorted.
         * May be overriden by the MdSortable's sort start.
         */
        this.start = 'asc';
        /**
         * The sort direction of the currently active MdSortable.
         */
        this.direction = '';
        /**
         * Event emitted when the user changes either the active sort or sort direction.
         */
        this.mdSortChange = new _angular_core.EventEmitter();
    }
    Object.defineProperty(MdSort.prototype, "disableClear", {
        /**
         * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
         * May be overriden by the MdSortable's disable clear input.
         * @return {?}
         */
        get: function () { return this._disableClear; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._disableClear = _angular_cdk.coerceBooleanProperty(v); },
        enumerable: true,
        configurable: true
    });
    /**
     * Register function to be used by the contained MdSortables. Adds the MdSortable to the
     * collection of MdSortables.
     * @param {?} sortable
     * @return {?}
     */
    MdSort.prototype.register = function (sortable) {
        if (!sortable.id) {
            throw getMdSortHeaderMissingIdError();
        }
        if (this.sortables.has(sortable.id)) {
            throw getMdSortDuplicateMdSortableIdError(sortable.id);
        }
        this.sortables.set(sortable.id, sortable);
    };
    /**
     * Unregister function to be used by the contained MdSortables. Removes the MdSortable from the
     * collection of contained MdSortables.
     * @param {?} sortable
     * @return {?}
     */
    MdSort.prototype.deregister = function (sortable) {
        this.sortables.delete(sortable.id);
    };
    /**
     * Sets the active sort id and determines the new sort direction.
     * @param {?} sortable
     * @return {?}
     */
    MdSort.prototype.sort = function (sortable) {
        if (this.active != sortable.id) {
            this.active = sortable.id;
            this.direction = sortable.start ? sortable.start : this.start;
        }
        else {
            this.direction = this.getNextSortDirection(sortable);
        }
        this.mdSortChange.next({ active: this.active, direction: this.direction });
    };
    /**
     * Returns the next sort direction of the active sortable, checking for potential overrides.
     * @param {?} sortable
     * @return {?}
     */
    MdSort.prototype.getNextSortDirection = function (sortable) {
        if (!sortable) {
            return '';
        }
        // Get the sort direction cycle with the potential sortable overrides.
        var /** @type {?} */ disableClear = sortable.disableClear != null ? sortable.disableClear : this.disableClear;
        var /** @type {?} */ sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);
        // Get and return the next direction in the cycle
        var /** @type {?} */ nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
        if (nextDirectionIndex >= sortDirectionCycle.length) {
            nextDirectionIndex = 0;
        }
        return sortDirectionCycle[nextDirectionIndex];
    };
    return MdSort;
}());
MdSort.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[mdSort], [matSort]',
            },] },
];
/**
 * @nocollapse
 */
MdSort.ctorParameters = function () { return []; };
MdSort.propDecorators = {
    'active': [{ type: _angular_core.Input, args: ['mdSortActive',] },],
    'start': [{ type: _angular_core.Input, args: ['mdSortStart',] },],
    'direction': [{ type: _angular_core.Input, args: ['mdSortDirection',] },],
    'disableClear': [{ type: _angular_core.Input, args: ['mdSortDisableClear',] },],
    'mdSortChange': [{ type: _angular_core.Output },],
};
/**
 * Returns the sort direction cycle to use given the provided parameters of order and clear.
 * @param {?} start
 * @param {?} disableClear
 * @return {?}
 */
function getSortDirectionCycle(start, disableClear) {
    var /** @type {?} */ sortOrder = ['asc', 'desc'];
    if (start == 'desc') {
        sortOrder.reverse();
    }
    if (!disableClear) {
        sortOrder.push('');
    }
    return sortOrder;
}
/**
 * To modify the labels and text displayed, create a new instance of MdSortHeaderIntl and
 * include it in a custom provider.
 */
var MdSortHeaderIntl = (function () {
    function MdSortHeaderIntl() {
        this.sortButtonLabel = function (id) {
            return "Change sorting for " + id;
        };
        /**
         * A label to describe the current sort (visible only to screenreaders).
         */
        this.sortDescriptionLabel = function (id, direction) {
            return "Sorted by " + id + " " + (direction == 'asc' ? 'ascending' : 'descending');
        };
    }
    return MdSortHeaderIntl;
}());
MdSortHeaderIntl.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
MdSortHeaderIntl.ctorParameters = function () { return []; };
/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MdSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
var MdSortHeader = (function () {
    /**
     * @param {?} _intl
     * @param {?} _changeDetectorRef
     * @param {?} _sort
     * @param {?} _cdkColumnDef
     */
    function MdSortHeader(_intl, _changeDetectorRef, _sort, _cdkColumnDef) {
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._sort = _sort;
        this._cdkColumnDef = _cdkColumnDef;
        /**
         * Sets the position of the arrow that displays when sorted.
         */
        this.arrowPosition = 'after';
        if (!_sort) {
            throw getMdSortHeaderNotContainedWithinMdSortError();
        }
        this.sortSubscription = _sort.mdSortChange.subscribe(function () { return _changeDetectorRef.markForCheck(); });
    }
    Object.defineProperty(MdSortHeader.prototype, "disableClear", {
        /**
         * Overrides the disable clear value of the containing MdSort for this MdSortable.
         * @return {?}
         */
        get: function () { return this._disableClear; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._disableClear = _angular_cdk.coerceBooleanProperty(v); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSortHeader.prototype, "_id", {
        /**
         * @return {?}
         */
        get: function () { return this.id; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.id = v; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdSortHeader.prototype.ngOnInit = function () {
        if (!this.id && this._cdkColumnDef) {
            this.id = this._cdkColumnDef.name;
        }
        this._sort.register(this);
    };
    /**
     * @return {?}
     */
    MdSortHeader.prototype.ngOnDestroy = function () {
        this._sort.deregister(this);
        this.sortSubscription.unsubscribe();
    };
    /**
     * Whether this MdSortHeader is currently sorted in either ascending or descending order.
     * @return {?}
     */
    MdSortHeader.prototype._isSorted = function () {
        return this._sort.active == this.id && this._sort.direction;
    };
    return MdSortHeader;
}());
MdSortHeader.decorators = [
    { type: _angular_core.Component, args: [{ selector: '[md-sort-header], [mat-sort-header]',
                template: "<div class=\"mat-sort-header-container\" [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\"><button class=\"mat-sort-header-button\" type=\"button\" [attr.aria-label]=\"_intl.sortButtonLabel(id)\"><ng-content></ng-content></button><div *ngIf=\"_isSorted()\" class=\"mat-sort-header-arrow\" [class.mat-sort-header-asc]=\"_sort.direction == 'asc'\" [class.mat-sort-header-desc]=\"_sort.direction == 'desc'\"><div class=\"mat-sort-header-stem\"></div><div class=\"mat-sort-header-pointer-left\"></div><div class=\"mat-sort-header-pointer-right\"></div></div></div><span class=\"cdk-visually-hidden\" *ngIf=\"_isSorted()\">{{_intl.sortDescriptionLabel(id, _sort.direction)}}</span>",
                styles: [".mat-sort-header-container{display:flex;cursor:pointer}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-button{border:none;background:0 0;display:flex;align-items:center;padding:0;cursor:pointer;outline:0;font:inherit;color:currentColor}.mat-sort-header-arrow{display:none;height:10px;width:10px;position:relative;margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-asc{display:block;transform:rotate(45deg)}.mat-sort-header-desc{display:block;transform:rotate(225deg);top:2px}.mat-sort-header-stem{background:currentColor;transform:rotate(135deg);height:10px;width:2px;margin:auto}.mat-sort-header-pointer-left{background:currentColor;width:2px;height:8px;position:absolute;bottom:0;right:0}.mat-sort-header-pointer-right{background:currentColor;width:8px;height:2px;position:absolute;bottom:0;right:0}"],
                host: {
                    '(click)': '_sort.sort(this)',
                    '[class.mat-sort-header-sorted]': '_isSorted()',
                },
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdSortHeader.ctorParameters = function () { return [
    { type: MdSortHeaderIntl, },
    { type: _angular_core.ChangeDetectorRef, },
    { type: MdSort, decorators: [{ type: _angular_core.Optional },] },
    { type: _angular_cdk.CdkColumnDef, decorators: [{ type: _angular_core.Optional },] },
]; };
MdSortHeader.propDecorators = {
    'id': [{ type: _angular_core.Input, args: ['md-sort-header',] },],
    'arrowPosition': [{ type: _angular_core.Input },],
    'start': [{ type: _angular_core.Input, args: ['start',] },],
    'disableClear': [{ type: _angular_core.Input },],
    '_id': [{ type: _angular_core.Input, args: ['mat-sort-header',] },],
};
var MdSortModule = (function () {
    function MdSortModule() {
    }
    return MdSortModule;
}());
MdSortModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_common.CommonModule],
                exports: [MdSort, MdSortHeader],
                declarations: [MdSort, MdSortHeader],
                providers: [MdSortHeaderIntl]
            },] },
];
/**
 * @nocollapse
 */
MdSortModule.ctorParameters = function () { return []; };
/**
 * To modify the labels and text displayed, create a new instance of MdPaginatorIntl and
 * include it in a custom provider
 */
var MdPaginatorIntl = (function () {
    function MdPaginatorIntl() {
        /**
         * A label for the page size selector.
         */
        this.itemsPerPageLabel = 'Items per page:';
        /**
         * A label for the button that increments the current page.
         */
        this.nextPageLabel = 'Next page';
        /**
         * A label for the button that decrements the current page.
         */
        this.previousPageLabel = 'Previous page';
        /**
         * A label for the range of items within the current page and the length of the whole list.
         */
        this.getRangeLabel = function (page, pageSize, length) {
            if (length == 0 || pageSize == 0) {
                return "0 of " + length;
            }
            length = Math.max(length, 0);
            var startIndex = page * pageSize;
            // If the start index exceeds the list length, do not try and fix the end index to the end.
            var endIndex = startIndex < length ?
                Math.min(startIndex + pageSize, length) :
                startIndex + pageSize;
            return startIndex + 1 + " - " + endIndex + " of " + length;
        };
    }
    return MdPaginatorIntl;
}());
MdPaginatorIntl.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
MdPaginatorIntl.ctorParameters = function () { return []; };
/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
var PageEvent = (function () {
    function PageEvent() {
    }
    return PageEvent;
}());
/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
var MdPaginator = (function () {
    /**
     * @param {?} _intl
     */
    function MdPaginator(_intl) {
        this._intl = _intl;
        /**
         * The zero-based page index of the displayed list of items. Defaulted to 0.
         */
        this.pageIndex = 0;
        /**
         * The length of the total number of items that are being paginated. Defaulted to 0.
         */
        this.length = 0;
        this._pageSize = 50;
        this._pageSizeOptions = [];
        /**
         * Event emitted when the paginator changes the page size or page index.
         */
        this.page = new _angular_core.EventEmitter();
    }
    Object.defineProperty(MdPaginator.prototype, "pageSize", {
        /**
         * Number of items to display on a page. By default set to 50.
         * @return {?}
         */
        get: function () { return this._pageSize; },
        /**
         * @param {?} pageSize
         * @return {?}
         */
        set: function (pageSize) {
            this._pageSize = pageSize;
            this._updateDisplayedPageSizeOptions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdPaginator.prototype, "pageSizeOptions", {
        /**
         * The set of provided page size options to display to the user.
         * @return {?}
         */
        get: function () { return this._pageSizeOptions; },
        /**
         * @param {?} pageSizeOptions
         * @return {?}
         */
        set: function (pageSizeOptions) {
            this._pageSizeOptions = pageSizeOptions;
            this._updateDisplayedPageSizeOptions();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdPaginator.prototype.ngOnInit = function () {
        this._initialized = true;
        this._updateDisplayedPageSizeOptions();
    };
    /**
     * Advances to the next page if it exists.
     * @return {?}
     */
    MdPaginator.prototype.nextPage = function () {
        if (!this.hasNextPage()) {
            return;
        }
        this.pageIndex++;
        this._emitPageEvent();
    };
    /**
     * Move back to the previous page if it exists.
     * @return {?}
     */
    MdPaginator.prototype.previousPage = function () {
        if (!this.hasPreviousPage()) {
            return;
        }
        this.pageIndex--;
        this._emitPageEvent();
    };
    /**
     * Whether there is a previous page.
     * @return {?}
     */
    MdPaginator.prototype.hasPreviousPage = function () {
        return this.pageIndex >= 1 && this.pageSize != 0;
    };
    /**
     * Whether there is a next page.
     * @return {?}
     */
    MdPaginator.prototype.hasNextPage = function () {
        var /** @type {?} */ numberOfPages = Math.ceil(this.length / this.pageSize) - 1;
        return this.pageIndex < numberOfPages && this.pageSize != 0;
    };
    /**
     * Changes the page size so that the first item displayed on the page will still be
     * displayed using the new page size.
     *
     * For example, if the page size is 10 and on the second page (items indexed 10-19) then
     * switching so that the page size is 5 will set the third page as the current page so
     * that the 10th item will still be displayed.
     * @param {?} pageSize
     * @return {?}
     */
    MdPaginator.prototype._changePageSize = function (pageSize) {
        // Current page needs to be updated to reflect the new page size. Navigate to the page
        // containing the previous page's first item.
        var /** @type {?} */ startIndex = this.pageIndex * this.pageSize;
        this.pageIndex = Math.floor(startIndex / pageSize) || 0;
        this.pageSize = pageSize;
        this._emitPageEvent();
    };
    /**
     * Updates the list of page size options to display to the user. Includes making sure that
     * the page size is an option and that the list is sorted.
     * @return {?}
     */
    MdPaginator.prototype._updateDisplayedPageSizeOptions = function () {
        if (!this._initialized) {
            return;
        }
        this._displayedPageSizeOptions = this.pageSizeOptions.slice();
        if (this._displayedPageSizeOptions.indexOf(this.pageSize) == -1) {
            this._displayedPageSizeOptions.push(this.pageSize);
        }
        // Sort the numbers using a number-specific sort function.
        this._displayedPageSizeOptions.sort(function (a, b) { return a - b; });
    };
    /**
     * Emits an event notifying that a change of the paginator's properties has been triggered.
     * @return {?}
     */
    MdPaginator.prototype._emitPageEvent = function () {
        this.page.next({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length
        });
    };
    return MdPaginator;
}());
MdPaginator.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-paginator, mat-paginator',
                template: "<div class=\"mat-paginator-page-size\"><div class=\"mat-paginator-page-size-label\">{{_intl.itemsPerPageLabel}}</div><md-select *ngIf=\"_displayedPageSizeOptions.length > 1\" class=\"mat-paginator-page-size-select\" [ngModel]=\"pageSize\" [aria-label]=\"_intl.itemsPerPageLabel\" (change)=\"_changePageSize($event.value)\"><md-option *ngFor=\"let pageSizeOption of _displayedPageSizeOptions\" [value]=\"pageSizeOption\">{{pageSizeOption}}</md-option></md-select><div *ngIf=\"_displayedPageSizeOptions.length <= 1\">{{pageSize}}</div></div><div class=\"mat-paginator-range-label\">{{_intl.getRangeLabel(pageIndex, pageSize, length)}}</div><button md-icon-button class=\"mat-paginator-navigation-previous\" (click)=\"previousPage()\" [attr.aria-label]=\"_intl.previousPageLabel\" [mdTooltip]=\"_intl.previousPageLabel\" [mdTooltipPosition]=\"'above'\" [disabled]=\"!hasPreviousPage()\"><div class=\"mat-paginator-increment\"></div></button> <button md-icon-button class=\"mat-paginator-navigation-next\" (click)=\"nextPage()\" [attr.aria-label]=\"_intl.nextPageLabel\" [mdTooltip]=\"_intl.nextPageLabel\" [mdTooltipPosition]=\"'above'\" [disabled]=\"!hasNextPage()\"><div class=\"mat-paginator-decrement\"></div></button>",
                styles: [".mat-paginator{display:flex;align-items:center;justify-content:flex-end;min-height:56px;padding:0 8px}.mat-paginator-page-size{display:flex;align-items:center}.mat-paginator-page-size-label{margin:0 4px}.mat-paginator-page-size-select{margin:0 4px}.mat-paginator-page-size-select .mat-select-trigger{min-width:56px}.mat-paginator-range-label{margin:0 32px}.mat-paginator-increment-button+.mat-paginator-increment-button{margin:0 0 0 8px}[dir=rtl] .mat-paginator-increment-button+.mat-paginator-increment-button{margin:0 8px 0 0}.mat-paginator-decrement,.mat-paginator-increment{width:8px;height:8px}.mat-paginator-decrement,[dir=rtl] .mat-paginator-increment{transform:rotate(45deg)}.mat-paginator-increment,[dir=rtl] .mat-paginator-decrement{transform:rotate(225deg)}.mat-paginator-decrement{margin-left:12px}[dir=rtl] .mat-paginator-decrement{margin-right:12px}.mat-paginator-increment{margin-left:16px}[dir=rtl] .mat-paginator-increment{margin-right:16px}"],
                host: {
                    'class': 'mat-paginator',
                },
                providers: [
                    { provide: MATERIAL_COMPATIBILITY_MODE, useValue: false }
                ],
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                encapsulation: _angular_core.ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdPaginator.ctorParameters = function () { return [
    { type: MdPaginatorIntl, },
]; };
MdPaginator.propDecorators = {
    'pageIndex': [{ type: _angular_core.Input },],
    'length': [{ type: _angular_core.Input },],
    'pageSize': [{ type: _angular_core.Input },],
    'pageSizeOptions': [{ type: _angular_core.Input },],
    'page': [{ type: _angular_core.Output },],
};
var MdPaginatorModule = (function () {
    function MdPaginatorModule() {
    }
    return MdPaginatorModule;
}());
MdPaginatorModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule,
                    _angular_forms.FormsModule,
                    MdButtonModule,
                    MdSelectModule,
                    MdTooltipModule,
                ],
                exports: [MdPaginator],
                declarations: [MdPaginator],
                providers: [MdPaginatorIntl],
            },] },
];
/**
 * @nocollapse
 */
MdPaginatorModule.ctorParameters = function () { return []; };
var MATERIAL_MODULES = [
    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdChipsModule,
    MdCheckboxModule,
    MdDatepickerModule,
    MdTableModule,
    MdDialogModule,
    MdExpansionModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdSnackBarModule,
    MdSortModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    OverlayModule,
    _angular_cdk.PortalModule,
    _angular_cdk.BidiModule,
    StyleModule,
    _angular_cdk.A11yModule,
    _angular_cdk.PlatformModule,
    MdCommonModule,
    _angular_cdk.ObserveContentModule
];
/**
 * @deprecated
 */
var MaterialModule = (function () {
    function MaterialModule() {
    }
    return MaterialModule;
}());
MaterialModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: MATERIAL_MODULES,
                exports: MATERIAL_MODULES,
            },] },
];
/**
 * @nocollapse
 */
MaterialModule.ctorParameters = function () { return []; };

exports.coerceBooleanProperty = _angular_cdk.coerceBooleanProperty;
exports.coerceNumberProperty = _angular_cdk.coerceNumberProperty;
exports.ObserveContentModule = _angular_cdk.ObserveContentModule;
exports.ObserveContent = _angular_cdk.ObserveContent;
exports.Dir = _angular_cdk.Dir;
exports.Directionality = _angular_cdk.Directionality;
exports.BidiModule = _angular_cdk.BidiModule;
exports.Portal = _angular_cdk.Portal;
exports.BasePortalHost = _angular_cdk.BasePortalHost;
exports.ComponentPortal = _angular_cdk.ComponentPortal;
exports.TemplatePortal = _angular_cdk.TemplatePortal;
exports.PortalHostDirective = _angular_cdk.PortalHostDirective;
exports.TemplatePortalDirective = _angular_cdk.TemplatePortalDirective;
exports.PortalModule = _angular_cdk.PortalModule;
exports.DomPortalHost = _angular_cdk.DomPortalHost;
exports.GestureConfig = GestureConfig;
exports.LiveAnnouncer = _angular_cdk.LiveAnnouncer;
exports.LIVE_ANNOUNCER_ELEMENT_TOKEN = _angular_cdk.LIVE_ANNOUNCER_ELEMENT_TOKEN;
exports.LIVE_ANNOUNCER_PROVIDER = _angular_cdk.LIVE_ANNOUNCER_PROVIDER;
exports.InteractivityChecker = _angular_cdk.InteractivityChecker;
exports.isFakeMousedownFromScreenReader = _angular_cdk.isFakeMousedownFromScreenReader;
exports.A11yModule = _angular_cdk.A11yModule;
exports.UniqueSelectionDispatcher = UniqueSelectionDispatcher;
exports.UNIQUE_SELECTION_DISPATCHER_PROVIDER = UNIQUE_SELECTION_DISPATCHER_PROVIDER;
exports.MdLineModule = MdLineModule;
exports.MdLine = MdLine;
exports.MdLineSetter = MdLineSetter;
exports.CompatibilityModule = CompatibilityModule;
exports.NoConflictStyleCompatibilityMode = NoConflictStyleCompatibilityMode;
exports.MdCommonModule = MdCommonModule;
exports.MATERIAL_SANITY_CHECKS = MATERIAL_SANITY_CHECKS;
exports.MD_PLACEHOLDER_GLOBAL_OPTIONS = MD_PLACEHOLDER_GLOBAL_OPTIONS;
exports.MD_ERROR_GLOBAL_OPTIONS = MD_ERROR_GLOBAL_OPTIONS;
exports.defaultErrorStateMatcher = defaultErrorStateMatcher;
exports.showOnDirtyErrorStateMatcher = showOnDirtyErrorStateMatcher;
exports.MdCoreModule = MdCoreModule;
exports.MdOptionModule = MdOptionModule;
exports.MdOptionSelectionChange = MdOptionSelectionChange;
exports.MdOption = MdOption;
exports.MdOptgroupBase = MdOptgroupBase;
exports._MdOptgroupMixinBase = _MdOptgroupMixinBase;
exports.MdOptgroup = MdOptgroup;
exports.PlatformModule = _angular_cdk.PlatformModule;
exports.Platform = _angular_cdk.Platform;
exports.getSupportedInputTypes = _angular_cdk.getSupportedInputTypes;
exports.OVERLAY_PROVIDERS = OVERLAY_PROVIDERS;
exports.OverlayModule = OverlayModule;
exports.Overlay = Overlay;
exports.OverlayContainer = OverlayContainer;
exports.FullscreenOverlayContainer = FullscreenOverlayContainer;
exports.OverlayRef = OverlayRef;
exports.OverlayState = OverlayState;
exports.ConnectedOverlayDirective = ConnectedOverlayDirective;
exports.OverlayOrigin = OverlayOrigin;
exports.ViewportRuler = ViewportRuler;
exports.GlobalPositionStrategy = GlobalPositionStrategy;
exports.ConnectedPositionStrategy = ConnectedPositionStrategy;
exports.ConnectionPositionPair = ConnectionPositionPair;
exports.ScrollableViewProperties = ScrollableViewProperties;
exports.ConnectedOverlayPositionChange = ConnectedOverlayPositionChange;
exports.Scrollable = Scrollable;
exports.ScrollDispatcher = ScrollDispatcher;
exports.ScrollStrategyOptions = ScrollStrategyOptions;
exports.RepositionScrollStrategy = RepositionScrollStrategy;
exports.CloseScrollStrategy = CloseScrollStrategy;
exports.NoopScrollStrategy = NoopScrollStrategy;
exports.BlockScrollStrategy = BlockScrollStrategy;
exports.ScrollDispatchModule = ScrollDispatchModule;
exports.MdRipple = MdRipple;
exports.MD_RIPPLE_GLOBAL_OPTIONS = MD_RIPPLE_GLOBAL_OPTIONS;
exports.RippleRef = RippleRef;
exports.RippleState = RippleState;
exports.RIPPLE_FADE_IN_DURATION = RIPPLE_FADE_IN_DURATION;
exports.RIPPLE_FADE_OUT_DURATION = RIPPLE_FADE_OUT_DURATION;
exports.MdRippleModule = MdRippleModule;
exports.SelectionModel = SelectionModel;
exports.SelectionChange = SelectionChange;
exports.FocusTrap = _angular_cdk.FocusTrap;
exports.FocusTrapFactory = _angular_cdk.FocusTrapFactory;
exports.FocusTrapDeprecatedDirective = _angular_cdk.FocusTrapDeprecatedDirective;
exports.FocusTrapDirective = _angular_cdk.FocusTrapDirective;
exports.StyleModule = StyleModule;
exports.TOUCH_BUFFER_MS = TOUCH_BUFFER_MS;
exports.FocusOriginMonitor = FocusOriginMonitor;
exports.CdkMonitorFocus = CdkMonitorFocus;
exports.FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY = FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY;
exports.FOCUS_ORIGIN_MONITOR_PROVIDER = FOCUS_ORIGIN_MONITOR_PROVIDER;
exports.applyCssTransform = applyCssTransform;
exports.UP_ARROW = _angular_cdk.UP_ARROW;
exports.DOWN_ARROW = _angular_cdk.DOWN_ARROW;
exports.RIGHT_ARROW = _angular_cdk.RIGHT_ARROW;
exports.LEFT_ARROW = _angular_cdk.LEFT_ARROW;
exports.PAGE_UP = _angular_cdk.PAGE_UP;
exports.PAGE_DOWN = _angular_cdk.PAGE_DOWN;
exports.HOME = _angular_cdk.HOME;
exports.END = _angular_cdk.END;
exports.ENTER = _angular_cdk.ENTER;
exports.SPACE = _angular_cdk.SPACE;
exports.TAB = _angular_cdk.TAB;
exports.ESCAPE = _angular_cdk.ESCAPE;
exports.BACKSPACE = _angular_cdk.BACKSPACE;
exports.DELETE = _angular_cdk.DELETE;
exports.MATERIAL_COMPATIBILITY_MODE = MATERIAL_COMPATIBILITY_MODE;
exports.getMdCompatibilityInvalidPrefixError = getMdCompatibilityInvalidPrefixError;
exports.MAT_ELEMENTS_SELECTOR = MAT_ELEMENTS_SELECTOR;
exports.MD_ELEMENTS_SELECTOR = MD_ELEMENTS_SELECTOR;
exports.MatPrefixRejector = MatPrefixRejector;
exports.MdPrefixRejector = MdPrefixRejector;
exports.AnimationCurves = AnimationCurves;
exports.AnimationDurations = AnimationDurations;
exports.MdSelectionModule = MdSelectionModule;
exports.MdPseudoCheckboxBase = MdPseudoCheckboxBase;
exports._MdPseudoCheckboxBase = _MdPseudoCheckboxBase;
exports.MdPseudoCheckbox = MdPseudoCheckbox;
exports.NativeDateModule = NativeDateModule;
exports.MdNativeDateModule = MdNativeDateModule;
exports.DateAdapter = DateAdapter;
exports.MD_DATE_FORMATS = MD_DATE_FORMATS;
exports.NativeDateAdapter = NativeDateAdapter;
exports.MD_NATIVE_DATE_FORMATS = MD_NATIVE_DATE_FORMATS;
exports.MaterialModule = MaterialModule;
exports.MdAutocompleteModule = MdAutocompleteModule;
exports.MdAutocomplete = MdAutocomplete;
exports.AUTOCOMPLETE_OPTION_HEIGHT = AUTOCOMPLETE_OPTION_HEIGHT;
exports.AUTOCOMPLETE_PANEL_HEIGHT = AUTOCOMPLETE_PANEL_HEIGHT;
exports.MD_AUTOCOMPLETE_VALUE_ACCESSOR = MD_AUTOCOMPLETE_VALUE_ACCESSOR;
exports.getMdAutocompleteMissingPanelError = getMdAutocompleteMissingPanelError;
exports.MdAutocompleteTrigger = MdAutocompleteTrigger;
exports.MdButtonModule = MdButtonModule;
exports.MdButtonCssMatStyler = MdButtonCssMatStyler;
exports.MdRaisedButtonCssMatStyler = MdRaisedButtonCssMatStyler;
exports.MdIconButtonCssMatStyler = MdIconButtonCssMatStyler;
exports.MdFab = MdFab;
exports.MdMiniFab = MdMiniFab;
exports.MdButtonBase = MdButtonBase;
exports._MdButtonMixinBase = _MdButtonMixinBase;
exports.MdButton = MdButton;
exports.MdAnchor = MdAnchor;
exports.MdButtonToggleModule = MdButtonToggleModule;
exports.MdButtonToggleGroupBase = MdButtonToggleGroupBase;
exports._MdButtonToggleGroupMixinBase = _MdButtonToggleGroupMixinBase;
exports.MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR;
exports.MdButtonToggleChange = MdButtonToggleChange;
exports.MdButtonToggleGroup = MdButtonToggleGroup;
exports.MdButtonToggleGroupMultiple = MdButtonToggleGroupMultiple;
exports.MdButtonToggle = MdButtonToggle;
exports.MdCardModule = MdCardModule;
exports.MdCardContent = MdCardContent;
exports.MdCardTitle = MdCardTitle;
exports.MdCardSubtitle = MdCardSubtitle;
exports.MdCardActions = MdCardActions;
exports.MdCardFooter = MdCardFooter;
exports.MdCardImage = MdCardImage;
exports.MdCardSmImage = MdCardSmImage;
exports.MdCardMdImage = MdCardMdImage;
exports.MdCardLgImage = MdCardLgImage;
exports.MdCardXlImage = MdCardXlImage;
exports.MdCardAvatar = MdCardAvatar;
exports.MdCard = MdCard;
exports.MdCardHeader = MdCardHeader;
exports.MdCardTitleGroup = MdCardTitleGroup;
exports.MdChipsModule = MdChipsModule;
exports.MdChipList = MdChipList;
exports.MdChipBase = MdChipBase;
exports._MdChipMixinBase = _MdChipMixinBase;
exports.MdBasicChip = MdBasicChip;
exports.MdChip = MdChip;
exports.MdCheckboxModule = MdCheckboxModule;
exports.MD_CHECKBOX_CONTROL_VALUE_ACCESSOR = MD_CHECKBOX_CONTROL_VALUE_ACCESSOR;
exports.TransitionCheckState = TransitionCheckState;
exports.MdCheckboxChange = MdCheckboxChange;
exports.MdCheckboxBase = MdCheckboxBase;
exports._MdCheckboxMixinBase = _MdCheckboxMixinBase;
exports.MdCheckbox = MdCheckbox;
exports.MdDatepickerModule = MdDatepickerModule;
exports.MdCalendar = MdCalendar;
exports.MdCalendarCell = MdCalendarCell;
exports.MdCalendarBody = MdCalendarBody;
exports.MdDatepickerContent = MdDatepickerContent;
exports.MdDatepicker = MdDatepicker;
exports.MD_DATEPICKER_VALUE_ACCESSOR = MD_DATEPICKER_VALUE_ACCESSOR;
exports.MD_DATEPICKER_VALIDATORS = MD_DATEPICKER_VALIDATORS;
exports.MdDatepickerInput = MdDatepickerInput;
exports.MdDatepickerIntl = MdDatepickerIntl;
exports.MdDatepickerToggle = MdDatepickerToggle;
exports.MdMonthView = MdMonthView;
exports.MdYearView = MdYearView;
exports.MdDialogModule = MdDialogModule;
exports.MD_DIALOG_DATA = MD_DIALOG_DATA;
exports.MdDialog = MdDialog;
exports.throwMdDialogContentAlreadyAttachedError = throwMdDialogContentAlreadyAttachedError;
exports.MdDialogContainer = MdDialogContainer;
exports.MdDialogClose = MdDialogClose;
exports.MdDialogTitle = MdDialogTitle;
exports.MdDialogContent = MdDialogContent;
exports.MdDialogActions = MdDialogActions;
exports.MdDialogConfig = MdDialogConfig;
exports.MdDialogRef = MdDialogRef;
exports.MdExpansionModule = MdExpansionModule;
exports.CdkAccordion = CdkAccordion;
exports.MdAccordion = MdAccordion;
exports.AccordionItem = AccordionItem;
exports.MdExpansionPanel = MdExpansionPanel;
exports.MdExpansionPanelActionRow = MdExpansionPanelActionRow;
exports.MdExpansionPanelHeader = MdExpansionPanelHeader;
exports.MdExpansionPanelDescription = MdExpansionPanelDescription;
exports.MdExpansionPanelTitle = MdExpansionPanelTitle;
exports.MdGridListModule = MdGridListModule;
exports.MdGridTile = MdGridTile;
exports.MdGridList = MdGridList;
exports.MdIconModule = MdIconModule;
exports.MdIconBase = MdIconBase;
exports._MdIconMixinBase = _MdIconMixinBase;
exports.MdIcon = MdIcon;
exports.getMdIconNameNotFoundError = getMdIconNameNotFoundError;
exports.getMdIconNoHttpProviderError = getMdIconNoHttpProviderError;
exports.getMdIconFailedToSanitizeError = getMdIconFailedToSanitizeError;
exports.MdIconRegistry = MdIconRegistry;
exports.ICON_REGISTRY_PROVIDER_FACTORY = ICON_REGISTRY_PROVIDER_FACTORY;
exports.ICON_REGISTRY_PROVIDER = ICON_REGISTRY_PROVIDER;
exports.MdInputModule = MdInputModule;
exports.MdTextareaAutosize = MdTextareaAutosize;
exports.MdPlaceholder = MdPlaceholder;
exports.MdHint = MdHint;
exports.MdErrorDirective = MdErrorDirective;
exports.MdPrefix = MdPrefix;
exports.MdSuffix = MdSuffix;
exports.MdInputDirective = MdInputDirective;
exports.MdInputContainer = MdInputContainer;
exports.getMdInputContainerPlaceholderConflictError = getMdInputContainerPlaceholderConflictError;
exports.getMdInputContainerUnsupportedTypeError = getMdInputContainerUnsupportedTypeError;
exports.getMdInputContainerDuplicatedHintError = getMdInputContainerDuplicatedHintError;
exports.getMdInputContainerMissingMdInputError = getMdInputContainerMissingMdInputError;
exports.MdListModule = MdListModule;
exports.MdListDivider = MdListDivider;
exports.MdList = MdList;
exports.MdListCssMatStyler = MdListCssMatStyler;
exports.MdNavListCssMatStyler = MdNavListCssMatStyler;
exports.MdDividerCssMatStyler = MdDividerCssMatStyler;
exports.MdListAvatarCssMatStyler = MdListAvatarCssMatStyler;
exports.MdListIconCssMatStyler = MdListIconCssMatStyler;
exports.MdListSubheaderCssMatStyler = MdListSubheaderCssMatStyler;
exports.MdListItem = MdListItem;
exports.MdMenuModule = MdMenuModule;
exports.fadeInItems = fadeInItems;
exports.transformMenu = transformMenu;
exports.MdMenu = MdMenu;
exports.MdMenuItem = MdMenuItem;
exports.MdMenuTrigger = MdMenuTrigger;
exports.MdPaginatorModule = MdPaginatorModule;
exports.PageEvent = PageEvent;
exports.MdPaginator = MdPaginator;
exports.MdProgressBarModule = MdProgressBarModule;
exports.MdProgressBar = MdProgressBar;
exports.MdProgressSpinnerModule = MdProgressSpinnerModule;
exports.PROGRESS_SPINNER_STROKE_WIDTH = PROGRESS_SPINNER_STROKE_WIDTH;
exports.MdProgressSpinnerCssMatStyler = MdProgressSpinnerCssMatStyler;
exports.MdProgressSpinnerBase = MdProgressSpinnerBase;
exports._MdProgressSpinnerMixinBase = _MdProgressSpinnerMixinBase;
exports.MdProgressSpinner = MdProgressSpinner;
exports.MdSpinner = MdSpinner;
exports.MdRadioModule = MdRadioModule;
exports.MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR;
exports.MdRadioChange = MdRadioChange;
exports.MdRadioGroupBase = MdRadioGroupBase;
exports._MdRadioGroupMixinBase = _MdRadioGroupMixinBase;
exports.MdRadioGroup = MdRadioGroup;
exports.MdRadioButtonBase = MdRadioButtonBase;
exports._MdRadioButtonMixinBase = _MdRadioButtonMixinBase;
exports.MdRadioButton = MdRadioButton;
exports.MdSelectModule = MdSelectModule;
exports.fadeInContent = fadeInContent;
exports.transformPanel = transformPanel;
exports.transformPlaceholder = transformPlaceholder;
exports.SELECT_ITEM_HEIGHT = SELECT_ITEM_HEIGHT;
exports.SELECT_PANEL_MAX_HEIGHT = SELECT_PANEL_MAX_HEIGHT;
exports.SELECT_MAX_OPTIONS_DISPLAYED = SELECT_MAX_OPTIONS_DISPLAYED;
exports.SELECT_TRIGGER_HEIGHT = SELECT_TRIGGER_HEIGHT;
exports.SELECT_OPTION_HEIGHT_ADJUSTMENT = SELECT_OPTION_HEIGHT_ADJUSTMENT;
exports.SELECT_PANEL_PADDING_X = SELECT_PANEL_PADDING_X;
exports.SELECT_PANEL_INDENT_PADDING_X = SELECT_PANEL_INDENT_PADDING_X;
exports.SELECT_MULTIPLE_PANEL_PADDING_X = SELECT_MULTIPLE_PANEL_PADDING_X;
exports.SELECT_PANEL_PADDING_Y = SELECT_PANEL_PADDING_Y;
exports.SELECT_PANEL_VIEWPORT_PADDING = SELECT_PANEL_VIEWPORT_PADDING;
exports.MdSelectChange = MdSelectChange;
exports.MdSelectBase = MdSelectBase;
exports._MdSelectMixinBase = _MdSelectMixinBase;
exports.MdSelect = MdSelect;
exports.MdSidenavModule = MdSidenavModule;
exports.throwMdDuplicatedSidenavError = throwMdDuplicatedSidenavError;
exports.MdSidenavToggleResult = MdSidenavToggleResult;
exports.MdSidenav = MdSidenav;
exports.MdSidenavContainer = MdSidenavContainer;
exports.MdSliderModule = MdSliderModule;
exports.MD_SLIDER_VALUE_ACCESSOR = MD_SLIDER_VALUE_ACCESSOR;
exports.MdSliderChange = MdSliderChange;
exports.MdSliderBase = MdSliderBase;
exports._MdSliderMixinBase = _MdSliderMixinBase;
exports.MdSlider = MdSlider;
exports.SliderRenderer = SliderRenderer;
exports.MdSlideToggleModule = MdSlideToggleModule;
exports.MD_SLIDE_TOGGLE_VALUE_ACCESSOR = MD_SLIDE_TOGGLE_VALUE_ACCESSOR;
exports.MdSlideToggleChange = MdSlideToggleChange;
exports.MdSlideToggleBase = MdSlideToggleBase;
exports._MdSlideToggleMixinBase = _MdSlideToggleMixinBase;
exports.MdSlideToggle = MdSlideToggle;
exports.MdSnackBarModule = MdSnackBarModule;
exports.MdSnackBar = MdSnackBar;
exports.SHOW_ANIMATION = SHOW_ANIMATION;
exports.HIDE_ANIMATION = HIDE_ANIMATION;
exports.MdSnackBarContainer = MdSnackBarContainer;
exports.MdSnackBarConfig = MdSnackBarConfig;
exports.MdSnackBarRef = MdSnackBarRef;
exports.SimpleSnackBar = SimpleSnackBar;
exports.MdSortModule = MdSortModule;
exports.MdSortHeader = MdSortHeader;
exports.MdSortHeaderIntl = MdSortHeaderIntl;
exports.MdSort = MdSort;
exports.MdTableModule = MdTableModule;
exports._MdHeaderCellBase = _MdHeaderCellBase;
exports._MdCell = _MdCell;
exports.MdHeaderCell = MdHeaderCell;
exports.MdCell = MdCell;
exports._MdTable = _MdTable;
exports.MdTable = MdTable;
exports._MdHeaderRow = _MdHeaderRow;
exports._MdRow = _MdRow;
exports.MdHeaderRow = MdHeaderRow;
exports.MdRow = MdRow;
exports.MdTabsModule = MdTabsModule;
exports.MdInkBar = MdInkBar;
exports.MdTabBody = MdTabBody;
exports.MdTabHeader = MdTabHeader;
exports.MdTabLabelWrapper = MdTabLabelWrapper;
exports.MdTab = MdTab;
exports.MdTabLabel = MdTabLabel;
exports.MdTabNav = MdTabNav;
exports.MdTabLink = MdTabLink;
exports.MdTabChangeEvent = MdTabChangeEvent;
exports.MdTabGroup = MdTabGroup;
exports.MdTabLinkBase = MdTabLinkBase;
exports._MdTabLinkMixinBase = _MdTabLinkMixinBase;
exports.MdToolbarModule = MdToolbarModule;
exports.MdToolbarRow = MdToolbarRow;
exports.MdToolbarBase = MdToolbarBase;
exports._MdToolbarMixinBase = _MdToolbarMixinBase;
exports.MdToolbar = MdToolbar;
exports.MdTooltipModule = MdTooltipModule;
exports.TOUCHEND_HIDE_DELAY = TOUCHEND_HIDE_DELAY;
exports.SCROLL_THROTTLE_MS = SCROLL_THROTTLE_MS;
exports.getMdTooltipInvalidPositionError = getMdTooltipInvalidPositionError;
exports.MdTooltip = MdTooltip;
exports.TooltipComponent = TooltipComponent;
exports.ɵu = mixinColor;
exports.ɵv = mixinDisabled;
exports.ɵh = UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY;
exports.ɵb = OVERLAY_CONTAINER_PROVIDER;
exports.ɵa = OVERLAY_CONTAINER_PROVIDER_FACTORY;
exports.ɵt = OverlayPositionBuilder;
exports.ɵd = VIEWPORT_RULER_PROVIDER;
exports.ɵc = VIEWPORT_RULER_PROVIDER_FACTORY;
exports.ɵf = SCROLL_DISPATCHER_PROVIDER;
exports.ɵe = SCROLL_DISPATCHER_PROVIDER_FACTORY;
exports.ɵg = RippleRenderer;
exports.ɵi = EXPANSION_PANEL_ANIMATION_TIMING;
exports.ɵk = MdGridAvatarCssMatStyler;
exports.ɵm = MdGridTileFooterCssMatStyler;
exports.ɵl = MdGridTileHeaderCssMatStyler;
exports.ɵj = MdGridTileText;
exports.ɵn = MdMenuItemBase;
exports.ɵo = _MdMenuItemMixinBase;
exports.ɵx = MdPaginatorIntl;
exports.ɵr = MdTabBase;
exports.ɵs = _MdTabMixinBase;
exports.ɵp = MdTabLabelWrapperBase;
exports.ɵq = _MdTabLabelWrapperMixinBase;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material.umd.js.map
