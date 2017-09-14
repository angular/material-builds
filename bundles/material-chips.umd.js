/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/cdk/coercion'), require('@angular/cdk/a11y'), require('@angular/cdk/bidi'), require('@angular/platform-browser'), require('rxjs/Subject'), require('@angular/cdk/keycodes'), require('@angular/common'), require('@angular/cdk/scrolling'), require('@angular/cdk/platform'), require('@angular/cdk/overlay'), require('@angular/cdk/portal'), require('@angular/cdk/rxjs'), require('rxjs/observable/of'), require('rxjs/Subscription')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/cdk/coercion', '@angular/cdk/a11y', '@angular/cdk/bidi', '@angular/platform-browser', 'rxjs/Subject', '@angular/cdk/keycodes', '@angular/common', '@angular/cdk/scrolling', '@angular/cdk/platform', '@angular/cdk/overlay', '@angular/cdk/portal', '@angular/cdk/rxjs', 'rxjs/observable/of', 'rxjs/Subscription'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.chips = global.ng.material.chips || {}),global.ng.core,global.ng.cdk.coercion,global.ng.cdk.a11y,global.ng.cdk.bidi,global.ng.platformBrowser,global.Rx,global.ng.cdk.keycodes,global.ng.common,global.ng.cdk.scrolling,global.ng.cdk.platform,global.ng.cdk.overlay,global.ng.cdk.portal,global.ng.cdk.rxjs,global.Rx.Observable,global.Rx));
}(this, (function (exports,_angular_core,_angular_cdk_coercion,_angular_cdk_a11y,_angular_cdk_bidi,_angular_platformBrowser,rxjs_Subject,_angular_cdk_keycodes,_angular_common,_angular_cdk_scrolling,_angular_cdk_platform,_angular_cdk_overlay,_angular_cdk_portal,_angular_cdk_rxjs,rxjs_observable_of,rxjs_Subscription) { 'use strict';

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
var MAT_ELEMENTS_SELECTOR = "\n  [mat-button],\n  [mat-fab],\n  [mat-icon-button],\n  [mat-mini-fab],\n  [mat-raised-button],\n  [matCardSubtitle],\n  [matCardTitle],\n  [matCellDef],\n  [matColumnDef],\n  [matDialogActions],\n  [matDialogClose],\n  [matDialogContent],\n  [matDialogTitle],\n  [matHeaderCellDef],\n  [matHeaderRowDef],\n  [matLine],\n  [matRowDef],\n  [matStepLabel],\n  [matStepperNext],\n  [matStepperPrevious],\n  [matTabLabel],\n  [matTabLink],\n  [matTabNav],\n  [matTooltip],\n  [matInput],\n  [matPrefix],\n  [matSuffix],\n  mat-autocomplete,\n  mat-button-toggle,\n  mat-button-toggle,\n  mat-button-toggle-group,\n  mat-card,\n  mat-card-actions,\n  mat-card-content,\n  mat-card-footer,\n  mat-card-header,\n  mat-card-subtitle,\n  mat-card-title,\n  mat-card-title-group,\n  mat-cell,\n  mat-checkbox,\n  mat-chip,\n  mat-dialog-actions,\n  mat-dialog-container,\n  mat-dialog-content,\n  mat-divider,\n  mat-error,\n  mat-grid-list,\n  mat-grid-tile,\n  mat-grid-tile-footer,\n  mat-grid-tile-header,\n  mat-header-cell,\n  mat-header-row,\n  mat-hint,\n  mat-horizontal-stepper,\n  mat-icon,\n  mat-input-container,\n  mat-form-field,\n  mat-list,\n  mat-list-item,\n  mat-menu,\n  mat-nav-list,\n  mat-option,\n  mat-placeholder,\n  mat-progress-bar,\n  mat-pseudo-checkbox,\n  mat-radio-button,\n  mat-radio-group,\n  mat-row,\n  mat-select,\n  mat-sidenav,\n  mat-sidenav-container,\n  mat-slider,\n  mat-spinner,\n  mat-step,\n  mat-tab,\n  mat-table,\n  mat-tab-group,\n  mat-toolbar,\n  mat-vertical-stepper";
/**
 * Selector that matches all elements that may have style collisions with AngularJS Material.
 */
var MD_ELEMENTS_SELECTOR = "\n  [md-button],\n  [md-fab],\n  [md-icon-button],\n  [md-mini-fab],\n  [md-raised-button],\n  [mdCardSubtitle],\n  [mdCardTitle],\n  [mdCellDef],\n  [mdColumnDef],\n  [mdDialogActions],\n  [mdDialogClose],\n  [mdDialogContent],\n  [mdDialogTitle],\n  [mdHeaderCellDef],\n  [mdHeaderRowDef],\n  [mdLine],\n  [mdRowDef],\n  [mdStepLabel],\n  [mdStepperNext],\n  [mdStepperPrevious],\n  [mdTabLabel],\n  [mdTabLink],\n  [mdTabNav],\n  [mdTooltip],\n  [mdInput],\n  [mdPrefix],\n  [mdSuffix],\n  md-autocomplete,\n  md-button-toggle,\n  md-button-toggle,\n  md-button-toggle-group,\n  md-card,\n  md-card-actions,\n  md-card-content,\n  md-card-footer,\n  md-card-header,\n  md-card-subtitle,\n  md-card-title,\n  md-card-title-group,\n  md-cell,\n  md-checkbox,\n  md-chip,\n  md-dialog-actions,\n  md-dialog-container,\n  md-dialog-content,\n  md-divider,\n  md-error,\n  md-grid-list,\n  md-grid-tile,\n  md-grid-tile-footer,\n  md-grid-tile-header,\n  md-header-cell,\n  md-header-row,\n  md-hint,\n  md-horizontal-stepper,\n  md-icon,\n  md-input-container,\n  md-form-field,\n  md-list,\n  md-list-item,\n  md-menu,\n  md-nav-list,\n  md-option,\n  md-placeholder,\n  md-progress-bar,\n  md-pseudo-checkbox,\n  md-radio-button,\n  md-radio-group,\n  md-row,\n  md-select,\n  md-sidenav,\n  md-sidenav-container,\n  md-slider,\n  md-spinner,\n  md-step,\n  md-tab,\n  md-table,\n  md-tab-group,\n  md-toolbar,\n  md-vertical-stepper";
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
                imports: [CompatibilityModule, _angular_cdk_bidi.BidiModule],
                exports: [CompatibilityModule, _angular_cdk_bidi.BidiModule],
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
 * Mixin to augment a directive with a `disabled` property.
 * @template T
 * @param {?} base
 * @return {?}
 */
function mixinDisabled(base) {
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
            _this._disabled = false;
            return _this;
        }
        Object.defineProperty(class_1.prototype, "disabled", {
            /**
             * @return {?}
             */
            get: function () { return this._disabled; },
            /**
             * @param {?} value
             * @return {?}
             */
            set: function (value) { this._disabled = _angular_cdk_coercion.coerceBooleanProperty(value); },
            enumerable: true,
            configurable: true
        });
        return class_1;
    }(base));
}
/**
 * Mixin to augment a directive with a `color` property.
 * @template T
 * @param {?} base
 * @param {?=} defaultColor
 * @return {?}
 */
function mixinColor(base, defaultColor) {
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
            // Set the default color that can be specified from the mixin.
            _this.color = defaultColor;
            return _this;
        }
        Object.defineProperty(class_2.prototype, "color", {
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
        return class_2;
    }(base));
}
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
 * \@docs-private
 * @param {?} parentDispatcher
 * @return {?}
 */
function UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY(parentDispatcher) {
    return parentDispatcher || new UniqueSelectionDispatcher();
}
/**
 * \@docs-private
 */
var UNIQUE_SELECTION_DISPATCHER_PROVIDER = {
    // If there is already a dispatcher available, use that. Otherwise, provide a new one.
    provide: UniqueSelectionDispatcher,
    deps: [[new _angular_core.Optional(), new _angular_core.SkipSelf(), UniqueSelectionDispatcher]],
    useFactory: UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY
};
/**
 * InjectionToken for datepicker that can be used to override default locale code.
 */
var MAT_DATE_LOCALE = new _angular_core.InjectionToken('MAT_DATE_LOCALE');
/**
 * Provider for MAT_DATE_LOCALE injection token.
 */
var MAT_DATE_LOCALE_PROVIDER = { provide: MAT_DATE_LOCALE, useExisting: _angular_core.LOCALE_ID };
/**
 * Adapts type `D` to be usable as a date by cdk-based components that work with dates.
 * @abstract
 */
var DateAdapter = (function () {
    function DateAdapter() {
        this._localeChanges = new rxjs_Subject.Subject();
    }
    Object.defineProperty(DateAdapter.prototype, "localeChanges", {
        /**
         * A stream that emits when the locale changes.
         * @return {?}
         */
        get: function () { return this._localeChanges; },
        enumerable: true,
        configurable: true
    });
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
    DateAdapter.prototype.getMonthNames = function (style) { };
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
    DateAdapter.prototype.getDayOfWeekNames = function (style) { };
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
     * @return {?} The parsed date.
     */
    DateAdapter.prototype.parse = function (value, parseFormat) { };
    /**
     * Formats a date as a string.
     * @abstract
     * @param {?} date The value to format.
     * @param {?} displayFormat The format to use to display the date as a string.
     * @return {?} The formatted date string.
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
     * Checks whether the given object is considered a date instance by this DateAdapter.
     * @abstract
     * @param {?} obj The object to check
     * @return {?} Whether the object is a date instance.
     */
    DateAdapter.prototype.isDateInstance = function (obj) { };
    /**
     * Checks whether the given date is valid.
     * @abstract
     * @param {?} date The date to check.
     * @return {?} Whether the date is valid.
     */
    DateAdapter.prototype.isValid = function (date) { };
    /**
     * Sets the locale used for all dates.
     * @param {?} locale The new locale.
     * @return {?}
     */
    DateAdapter.prototype.setLocale = function (locale) {
        this.locale = locale;
        this._localeChanges.next();
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
     * @param {?} matDateLocale
     */
    function NativeDateAdapter(matDateLocale) {
        var _this = _super.call(this) || this;
        /**
         * Whether to use `timeZone: 'utc'` with `Intl.DateTimeFormat` when formatting dates.
         * Without this `Intl.DateTimeFormat` sometimes chooses the wrong timeZone, which can throw off
         * the result. (e.g. in the en-US locale `new Date(1800, 7, 14).toLocaleDateString()`
         * will produce `'8/13/1800'`.
         */
        _this.useUtcForDisplay = true;
        _super.prototype.setLocale.call(_this, matDateLocale);
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
    NativeDateAdapter.prototype.getMonthNames = function (style) {
        var _this = this;
        if (SUPPORTS_INTL_API) {
            var /** @type {?} */ dtf_1 = new Intl.DateTimeFormat(this.locale, { month: style });
            return range(12, function (i) { return _this._stripDirectionalityCharacters(dtf_1.format(new Date(2017, i, 1))); });
        }
        return DEFAULT_MONTH_NAMES[style];
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
    NativeDateAdapter.prototype.getDayOfWeekNames = function (style) {
        var _this = this;
        if (SUPPORTS_INTL_API) {
            var /** @type {?} */ dtf_3 = new Intl.DateTimeFormat(this.locale, { weekday: style });
            return range(7, function (i) { return _this._stripDirectionalityCharacters(dtf_3.format(new Date(2017, 0, i + 1))); });
        }
        return DEFAULT_DAY_OF_WEEK_NAMES[style];
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
        if (typeof value == 'number') {
            return new Date(value);
        }
        return value ? new Date(Date.parse(value)) : null;
    };
    /**
     * @param {?} date
     * @param {?} displayFormat
     * @return {?}
     */
    NativeDateAdapter.prototype.format = function (date, displayFormat) {
        if (!this.isValid(date)) {
            throw Error('NativeDateAdapter: Cannot format invalid date.');
        }
        if (SUPPORTS_INTL_API) {
            if (this.useUtcForDisplay) {
                date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
                displayFormat = extendObject({}, displayFormat, { timeZone: 'utc' });
            }
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
     * @param {?} obj
     * @return {?}
     */
    NativeDateAdapter.prototype.isDateInstance = function (obj) {
        return obj instanceof Date;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.isValid = function (date) {
        return !isNaN(date.getTime());
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
    { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [MAT_DATE_LOCALE,] },] },
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
                providers: [
                    { provide: DateAdapter, useClass: NativeDateAdapter },
                    MAT_DATE_LOCALE_PROVIDER
                ],
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
 * Injection token that can be used to specify the global error options.
 */
var MD_ERROR_GLOBAL_OPTIONS = new _angular_core.InjectionToken('md-error-global-options');
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
    Object.defineProperty(MdRipple.prototype, "_matRippleTrigger", {
        /**
         * @return {?}
         */
        get: function () { return this.trigger; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.trigger = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRipple.prototype, "_matRippleCentered", {
        /**
         * @return {?}
         */
        get: function () { return this.centered; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.centered = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRipple.prototype, "_matRippleDisabled", {
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
    Object.defineProperty(MdRipple.prototype, "_matRippleRadius", {
        /**
         * @return {?}
         */
        get: function () { return this.radius; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.radius = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRipple.prototype, "_matRippleSpeedFactor", {
        /**
         * @return {?}
         */
        get: function () { return this.speedFactor; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.speedFactor = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRipple.prototype, "_matRippleColor", {
        /**
         * @return {?}
         */
        get: function () { return this.color; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.color = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRipple.prototype, "_matRippleUnbounded", {
        /**
         * @return {?}
         */
        get: function () { return this.unbounded; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.unbounded = v; },
        enumerable: true,
        configurable: true
    });
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
    { type: _angular_cdk_scrolling.ViewportRuler, },
    { type: _angular_cdk_platform.Platform, },
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
    '_matRippleTrigger': [{ type: _angular_core.Input, args: ['matRippleTrigger',] },],
    '_matRippleCentered': [{ type: _angular_core.Input, args: ['matRippleCentered',] },],
    '_matRippleDisabled': [{ type: _angular_core.Input, args: ['matRippleDisabled',] },],
    '_matRippleRadius': [{ type: _angular_core.Input, args: ['matRippleRadius',] },],
    '_matRippleSpeedFactor': [{ type: _angular_core.Input, args: ['matRippleSpeedFactor',] },],
    '_matRippleColor': [{ type: _angular_core.Input, args: ['matRippleColor',] },],
    '_matRippleUnbounded': [{ type: _angular_core.Input, args: ['matRippleUnbounded',] },],
};
var MdRippleModule = (function () {
    function MdRippleModule() {
    }
    return MdRippleModule;
}());
MdRippleModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [MdCommonModule, _angular_cdk_platform.PlatformModule, _angular_cdk_scrolling.ScrollDispatchModule],
                exports: [MdRipple, MdCommonModule],
                declarations: [MdRipple],
                providers: [_angular_cdk_scrolling.VIEWPORT_RULER_PROVIDER],
            },] },
];
/**
 * @nocollapse
 */
MdRippleModule.ctorParameters = function () { return []; };
/**
 * Component that shows a simplified checkbox without including any kind of "real" checkbox.
 * Meant to be used when the checkbox is purely decorative and a large number of them will be
 * included, such as for the options in a multi-select. Uses no SVGs or complex animations.
 * Note that theming is meant to be handled by the parent element, e.g.
 * `mat-primary .mat-pseudo-checkbox`.
 *
 * Note that this component will be completely invisible to screen-reader users. This is *not*
 * interchangeable with <md-checkbox> and should *not* be used if the user would directly interact
 * with the checkbox. The pseudo-checkbox should only be used as an implementation detail of
 * more complex components that appropriately handle selected / checked state.
 * \@docs-private
 */
var MdPseudoCheckbox = (function () {
    function MdPseudoCheckbox() {
        /**
         * Display state of the checkbox.
         */
        this.state = 'unchecked';
        /**
         * Whether the checkbox is disabled.
         */
        this.disabled = false;
    }
    return MdPseudoCheckbox;
}());
MdPseudoCheckbox.decorators = [
    { type: _angular_core.Component, args: [{ encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                selector: 'md-pseudo-checkbox, mat-pseudo-checkbox',
                styles: [".mat-pseudo-checkbox{width:20px;height:20px;border:2px solid;border-radius:2px;cursor:pointer;display:inline-block;vertical-align:middle;box-sizing:border-box;position:relative;flex-shrink:0;transition:border-color 90ms cubic-bezier(0,0,.2,.1),background-color 90ms cubic-bezier(0,0,.2,.1)}.mat-pseudo-checkbox::after{position:absolute;opacity:0;content:'';border-bottom:2px solid currentColor;transition:opacity 90ms cubic-bezier(0,0,.2,.1)}.mat-pseudo-checkbox.mat-pseudo-checkbox-checked,.mat-pseudo-checkbox.mat-pseudo-checkbox-indeterminate{border:none}.mat-pseudo-checkbox-disabled{cursor:default}.mat-pseudo-checkbox-indeterminate::after{top:9px;left:2px;width:16px;opacity:1}.mat-pseudo-checkbox-checked::after{top:5px;left:3px;width:12px;height:5px;border-left:2px solid currentColor;transform:rotate(-45deg);opacity:1}"],
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
MdPseudoCheckbox.ctorParameters = function () { return []; };
MdPseudoCheckbox.propDecorators = {
    'state': [{ type: _angular_core.Input },],
    'disabled': [{ type: _angular_core.Input },],
};
var MdPseudoCheckboxModule = (function () {
    function MdPseudoCheckboxModule() {
    }
    return MdPseudoCheckboxModule;
}());
MdPseudoCheckboxModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                exports: [MdPseudoCheckbox],
                declarations: [MdPseudoCheckbox]
            },] },
];
/**
 * @nocollapse
 */
MdPseudoCheckboxModule.ctorParameters = function () { return []; };
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
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
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
     * @param {?} _changeDetectorRef
     * @param {?} group
     * @param {?} _isCompatibilityMode
     */
    function MdOption(_element, _changeDetectorRef, group, _isCompatibilityMode) {
        this._element = _element;
        this._changeDetectorRef = _changeDetectorRef;
        this.group = group;
        this._isCompatibilityMode = _isCompatibilityMode;
        this._selected = false;
        this._active = false;
        this._multiple = false;
        this._disableRipple = false;
        /**
         * Whether the option is disabled.
         */
        this._disabled = false;
        this._id = "md-option-" + _uniqueIdCounter++;
        /**
         * Event emitted when the option is selected or deselected.
         */
        this.onSelectionChange = new _angular_core.EventEmitter();
    }
    Object.defineProperty(MdOption.prototype, "multiple", {
        /**
         * Whether the wrapping component is in multiple selection mode.
         * @return {?}
         */
        get: function () { return this._multiple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value !== this._multiple) {
                this._multiple = value;
                this._changeDetectorRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
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
        set: function (value) { this._disabled = _angular_cdk_coercion.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "disableRipple", {
        /**
         * Whether ripples for the option are disabled.
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disableRipple = value;
            this._changeDetectorRef.markForCheck();
        },
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
        this._changeDetectorRef.markForCheck();
        this._emitSelectionChangeEvent();
    };
    /**
     * Deselects the option.
     * @return {?}
     */
    MdOption.prototype.deselect = function () {
        this._selected = false;
        this._changeDetectorRef.markForCheck();
        this._emitSelectionChangeEvent();
    };
    /**
     * Sets focus onto this option.
     * @return {?}
     */
    MdOption.prototype.focus = function () {
        var /** @type {?} */ element = this._getHostElement();
        if (typeof element.focus === 'function') {
            element.focus();
        }
    };
    /**
     * This method sets display styles on the option to make it appear
     * active. This is used by the ActiveDescendantKeyManager so key
     * events will display the proper options as active on arrow key events.
     * @return {?}
     */
    MdOption.prototype.setActiveStyles = function () {
        if (!this._active) {
            this._active = true;
            this._changeDetectorRef.markForCheck();
        }
    };
    /**
     * This method removes display styles on the option that made it appear
     * active. This is used by the ActiveDescendantKeyManager so key
     * events will display the proper options as active on arrow key events.
     * @return {?}
     */
    MdOption.prototype.setInactiveStyles = function () {
        if (this._active) {
            this._active = false;
            this._changeDetectorRef.markForCheck();
        }
    };
    /**
     * Gets the label to be used when determining whether the option should be focused.
     * @return {?}
     */
    MdOption.prototype.getLabel = function () {
        return this.viewValue;
    };
    /**
     * Ensures the option is selected when activated from the keyboard.
     * @param {?} event
     * @return {?}
     */
    MdOption.prototype._handleKeydown = function (event) {
        if (event.keyCode === _angular_cdk_keycodes.ENTER || event.keyCode === _angular_cdk_keycodes.SPACE) {
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
            this._changeDetectorRef.markForCheck();
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
     * Gets the host DOM element.
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
    /**
     * Counts the amount of option group labels that precede the specified option.
     * @param {?} optionIndex Index of the option at which to start counting.
     * @param {?} options Flat list of all of the options.
     * @param {?} optionGroups Flat list of all of the option groups.
     * @return {?}
     */
    MdOption.countGroupLabelsBeforeOption = function (optionIndex, options, optionGroups) {
        if (optionGroups.length) {
            var /** @type {?} */ optionsArray = options.toArray();
            var /** @type {?} */ groups = optionGroups.toArray();
            var /** @type {?} */ groupCounter = 0;
            for (var /** @type {?} */ i = 0; i < optionIndex + 1; i++) {
                if (optionsArray[i].group && optionsArray[i].group === groups[groupCounter]) {
                    groupCounter++;
                }
            }
            return groupCounter;
        }
        return 0;
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
                template: "<span [ngSwitch]=\"_isCompatibilityMode\" *ngIf=\"multiple\"><mat-pseudo-checkbox class=\"mat-option-pseudo-checkbox\" *ngSwitchCase=\"true\" [state]=\"selected ? 'checked' : ''\" [disabled]=\"disabled\"></mat-pseudo-checkbox><md-pseudo-checkbox class=\"mat-option-pseudo-checkbox\" *ngSwitchDefault [state]=\"selected ? 'checked' : ''\" [disabled]=\"disabled\"></md-pseudo-checkbox></span><ng-content></ng-content><div class=\"mat-option-ripple\" md-ripple [mdRippleTrigger]=\"_getHostElement()\" [mdRippleDisabled]=\"disabled || disableRipple\"></div>",
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdOption.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.ChangeDetectorRef, },
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
                imports: [MdRippleModule, _angular_common.CommonModule, MdPseudoCheckboxModule],
                exports: [MdOption, MdOptgroup],
                declarations: [MdOption, MdOptgroup]
            },] },
];
/**
 * @nocollapse
 */
MdOptionModule.ctorParameters = function () { return []; };
/**
 * InjectionToken that can be used to specify the global placeholder options.
 */
var MD_PLACEHOLDER_GLOBAL_OPTIONS = new _angular_core.InjectionToken('md-placeholder-global-options');
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
            var /** @type {?} */ cachedInfo = this._elementInfo.get(element); /** @type {?} */
            ((cachedInfo)).checkChildren = checkChildren;
            return ((cachedInfo)).subject.asObservable();
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
    { type: _angular_cdk_platform.Platform, },
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
 * \@docs-private
 * @param {?} parentDispatcher
 * @param {?} ngZone
 * @param {?} platform
 * @return {?}
 */
function FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY(parentDispatcher, ngZone, platform) {
    return parentDispatcher || new FocusOriginMonitor(ngZone, platform);
}
/**
 * \@docs-private
 */
var FOCUS_ORIGIN_MONITOR_PROVIDER = {
    // If there is already a FocusOriginMonitor available, use that. Otherwise, provide a new one.
    provide: FocusOriginMonitor,
    deps: [[new _angular_core.Optional(), new _angular_core.SkipSelf(), FocusOriginMonitor], _angular_core.NgZone, _angular_cdk_platform.Platform],
    useFactory: FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY
};
var StyleModule = (function () {
    function StyleModule() {
    }
    return StyleModule;
}());
StyleModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_cdk_platform.PlatformModule],
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
        _this._selectable = true;
        _this._removable = true;
        /**
         * Whether the chip has focus.
         */
        _this._hasFocus = false;
        /**
         * Emits when the chip is focused.
         */
        _this._onFocus = new rxjs_Subject.Subject();
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
        /**
         * Emitted when a chip is to be removed.
         */
        _this.onRemove = new _angular_core.EventEmitter();
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
            this._selected = _angular_cdk_coercion.coerceBooleanProperty(value);
            (this.selected ? this.select : this.deselect).emit({ chip: this });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChip.prototype, "selectable", {
        /**
         * Whether or not the chips are selectable. When a chip is not selectable,
         * changes to it's selected state are always ignored.
         * @return {?}
         */
        get: function () {
            return this._selectable;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selectable = _angular_cdk_coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChip.prototype, "removable", {
        /**
         * Determines whether or not the chip displays the remove styling and emits (remove) events.
         * @return {?}
         */
        get: function () {
            return this._removable;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._removable = _angular_cdk_coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChip.prototype, "ariaSelected", {
        /**
         * @return {?}
         */
        get: function () {
            return this.selectable ? this.selected.toString() : null;
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
     * @return {?}
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
        this._onFocus.next({ chip: this });
    };
    /**
     * Allows for programmatic removal of the chip. Called by the MdChipList when the DELETE or
     * BACKSPACE keys are pressed.
     *
     * Informs any listeners of the removal request. Does not remove the chip from the DOM.
     * @return {?}
     */
    MdChip.prototype.remove = function () {
        if (this.removable) {
            this.onRemove.emit({ chip: this });
        }
    };
    /**
     * Ensures events fire properly upon click.
     * @param {?} event
     * @return {?}
     */
    MdChip.prototype._handleClick = function (event) {
        // Check disabled
        if (this.disabled) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        this.focus();
    };
    /**
     * Handle custom key presses.
     * @param {?} event
     * @return {?}
     */
    MdChip.prototype._handleKeydown = function (event) {
        if (this.disabled) {
            return;
        }
        switch (event.keyCode) {
            case _angular_cdk_keycodes.DELETE:
            case _angular_cdk_keycodes.BACKSPACE:
                // If we are removable, remove the focused chip
                this.remove();
                // Always prevent so page navigation does not occur
                event.preventDefault();
                break;
            case _angular_cdk_keycodes.SPACE:
                // If we are selectable, toggle the focused chip
                if (this.selectable) {
                    this.toggleSelected();
                }
                // Always prevent space from scrolling the page since the list has focus
                event.preventDefault();
                break;
        }
    };
    return MdChip;
}(_MdChipMixinBase));
MdChip.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: "md-basic-chip, [md-basic-chip], md-chip, [md-chip],\n             mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]",
                inputs: ['color', 'disabled'],
                exportAs: 'mdChip',
                host: {
                    'class': 'mat-chip',
                    'tabindex': '-1',
                    'role': 'option',
                    '[class.mat-chip-selected]': 'selected',
                    '[attr.disabled]': 'disabled || null',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.aria-selected]': 'ariaSelected',
                    '(click)': '_handleClick($event)',
                    '(keydown)': '_handleKeydown($event)',
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
    '_chipRemove': [{ type: _angular_core.ContentChild, args: [_angular_core.forwardRef(function () { return MdChipRemove; }),] },],
    'selected': [{ type: _angular_core.Input },],
    'selectable': [{ type: _angular_core.Input },],
    'removable': [{ type: _angular_core.Input },],
    'select': [{ type: _angular_core.Output },],
    'deselect': [{ type: _angular_core.Output },],
    'destroy': [{ type: _angular_core.Output },],
    'onRemove': [{ type: _angular_core.Output, args: ['remove',] },],
};
/**
 * Applies proper (click) support and adds styling for use with the Material Design "cancel" icon
 * available at https://material.io/icons/#ic_cancel.
 *
 * Example:
 *
 *     <md-chip>
 *       <md-icon mdChipRemove>cancel</md-icon>
 *     </md-chip>
 *
 * You *may* use a custom icon, but you may need to override the `md-chip-remove` positioning styles
 * to properly center the icon within the chip.
 */
var MdChipRemove = (function () {
    /**
     * @param {?} _parentChip
     */
    function MdChipRemove(_parentChip) {
        this._parentChip = _parentChip;
    }
    /**
     * Calls the parent chip's public `remove()` method if applicable.
     * @return {?}
     */
    MdChipRemove.prototype._handleClick = function () {
        if (this._parentChip.removable) {
            this._parentChip.remove();
        }
    };
    return MdChipRemove;
}());
MdChipRemove.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[mdChipRemove], [matChipRemove]',
                host: {
                    'class': 'mat-chip-remove',
                    '(click)': '_handleClick($event)'
                }
            },] },
];
/**
 * @nocollapse
 */
MdChipRemove.ctorParameters = function () { return [
    { type: MdChip, },
]; };
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
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     * @param {?} _dir
     */
    function MdChipList(_renderer, _elementRef, _dir) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._dir = _dir;
        /**
         * When a chip is destroyed, we track the index so we can focus the appropriate next chip.
         */
        this._lastDestroyedIndex = null;
        /**
         * Track which chips we're listening to for focus/destruction.
         */
        this._chipSet = new WeakMap();
        /**
         * Subscription to tabbing out from the chip list.
         */
        this._tabOutSubscription = rxjs_Subscription.Subscription.EMPTY;
        /**
         * Whether or not the chip is selectable.
         */
        this._selectable = true;
        /**
         * Tab index for the chip list.
         */
        this._tabIndex = 0;
        /**
         * User defined tab index.
         * When it is not null, use user defined tab index. Otherwise use _tabIndex
         */
        this._userTabIndex = null;
        /**
         * Orientation of the chip list.
         */
        this.ariaOrientation = 'horizontal';
    }
    /**
     * @return {?}
     */
    MdChipList.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._keyManager = new _angular_cdk_a11y.FocusKeyManager(this.chips).withWrap();
        // Prevents the chip list from capturing focus and redirecting
        // it back to the first chip when the user tabs out.
        this._tabOutSubscription = this._keyManager.tabOut.subscribe(function () {
            _this._tabIndex = -1;
            setTimeout(function () { return _this._tabIndex = _this._userTabIndex || 0; });
        });
        // Go ahead and subscribe all of the initial chips
        this._subscribeChips(this.chips);
        // Make sure we set our tab index at the start
        this._updateTabIndex();
        // When the list changes, re-subscribe
        this.chips.changes.subscribe(function (chips) {
            _this._subscribeChips(chips);
            // If we have 0 chips, attempt to focus an input (if available)
            if (chips.length === 0) {
                _this._focusInput();
            }
            // Check to see if we need to update our tab index
            _this._updateTabIndex();
            // Check to see if we have a destroyed chip and need to refocus
            _this._updateFocusForDestroyedChips();
        });
    };
    /**
     * @return {?}
     */
    MdChipList.prototype.ngOnDestroy = function () {
        this._tabOutSubscription.unsubscribe();
    };
    Object.defineProperty(MdChipList.prototype, "selectable", {
        /**
         * Whether or not this chip is selectable. When a chip is not selectable,
         * it's selected state is always ignored.
         * @return {?}
         */
        get: function () {
            return this._selectable;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selectable = _angular_cdk_coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipList.prototype, "tabIndex", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._userTabIndex = value;
            this._tabIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Associates an HTML input element with this chip list.
     * @param {?} inputElement
     * @return {?}
     */
    MdChipList.prototype.registerInput = function (inputElement) {
        this._inputElement = inputElement;
    };
    /**
     * Focuses the the first non-disabled chip in this chip list, or the associated input when there
     * are no eligible chips.
     * @return {?}
     */
    MdChipList.prototype.focus = function () {
        // TODO: ARIA says this should focus the first `selected` chip if any are selected.
        if (this.chips.length > 0) {
            this._keyManager.setFirstItemActive();
        }
        else {
            this._focusInput();
        }
    };
    /**
     * Attempt to focus an input if we have one.
     * @return {?}
     */
    MdChipList.prototype._focusInput = function () {
        if (this._inputElement) {
            this._inputElement.focus();
        }
    };
    /**
     * Pass events to the keyboard manager. Available here for tests.
     * @param {?} event
     * @return {?}
     */
    MdChipList.prototype._keydown = function (event) {
        var /** @type {?} */ code = event.keyCode;
        var /** @type {?} */ target = (event.target);
        var /** @type {?} */ isInputEmpty = this._isInputEmpty(target);
        var /** @type {?} */ isRtl = this._dir && this._dir.value == 'rtl';
        var /** @type {?} */ isPrevKey = (code === (isRtl ? _angular_cdk_keycodes.RIGHT_ARROW : _angular_cdk_keycodes.LEFT_ARROW));
        var /** @type {?} */ isNextKey = (code === (isRtl ? _angular_cdk_keycodes.LEFT_ARROW : _angular_cdk_keycodes.RIGHT_ARROW));
        var /** @type {?} */ isBackKey = (code === _angular_cdk_keycodes.BACKSPACE || code == _angular_cdk_keycodes.DELETE || code == _angular_cdk_keycodes.UP_ARROW || isPrevKey);
        // If they are on an empty input and hit backspace/delete/left arrow, focus the last chip
        if (isInputEmpty && isBackKey) {
            this._keyManager.setLastItemActive();
            event.preventDefault();
            return;
        }
        // If they are on a chip, check for space/left/right, otherwise pass to our key manager (like
        // up/down keys)
        if (target && target.classList.contains('mat-chip')) {
            if (isPrevKey) {
                this._keyManager.setPreviousItemActive();
                event.preventDefault();
            }
            else if (isNextKey) {
                this._keyManager.setNextItemActive();
                event.preventDefault();
            }
            else {
                this._keyManager.onKeydown(event);
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
     * Check the tab index as you should not be allowed to focus an empty list.
     * @return {?}
     */
    MdChipList.prototype._updateTabIndex = function () {
        // If we have 0 chips, we should not allow keyboard focus
        this._tabIndex = this._userTabIndex || (this.chips.length === 0 ? -1 : 0);
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
        if (this._chipSet.has(chip)) {
            return;
        }
        // Watch for focus events outside of the keyboard navigation
        chip._onFocus.subscribe(function () {
            var /** @type {?} */ chipIndex = _this.chips.toArray().indexOf(chip);
            if (_this._isValidIndex(chipIndex)) {
                _this._keyManager.updateActiveItemIndex(chipIndex);
            }
        });
        // On destroy, remove the item from our list, and setup our destroyed focus check
        chip.destroy.subscribe(function () {
            var /** @type {?} */ chipIndex = _this.chips.toArray().indexOf(chip);
            if (_this._isValidIndex(chipIndex)) {
                if (chip._hasFocus) {
                    // Check whether the chip is the last item
                    if (chipIndex < _this.chips.length - 1) {
                        _this._keyManager.setActiveItem(chipIndex);
                    }
                    else if (chipIndex - 1 >= 0) {
                        _this._keyManager.setActiveItem(chipIndex - 1);
                    }
                }
                if (_this._keyManager.activeItemIndex === chipIndex) {
                    _this._lastDestroyedIndex = chipIndex;
                }
            }
            _this._chipSet.delete(chip);
            chip.destroy.unsubscribe();
        });
        this._chipSet.set(chip, true);
    };
    /**
     * Checks to see if a focus chip was recently destroyed so that we can refocus the next closest
     * one.
     * @return {?}
     */
    MdChipList.prototype._updateFocusForDestroyedChips = function () {
        var /** @type {?} */ chipsArray = this.chips;
        if (this._lastDestroyedIndex != null && chipsArray.length > 0) {
            // Check whether the destroyed chip was the last item
            var /** @type {?} */ newFocusIndex = Math.min(this._lastDestroyedIndex, chipsArray.length - 1);
            this._keyManager.setActiveItem(newFocusIndex);
            var /** @type {?} */ focusChip = this._keyManager.activeItem;
            // Focus the chip
            if (focusChip) {
                focusChip.focus();
            }
        }
        // Reset our destroyed index
        this._lastDestroyedIndex = null;
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
    /**
     * @param {?} element
     * @return {?}
     */
    MdChipList.prototype._isInputEmpty = function (element) {
        if (element && element.nodeName.toLowerCase() === 'input') {
            var /** @type {?} */ input = (element);
            return !input.value;
        }
        return false;
    };
    return MdChipList;
}());
MdChipList.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'md-chip-list, mat-chip-list',
                template: "<div class=\"mat-chip-list-wrapper\"><ng-content></ng-content></div>",
                exportAs: 'mdChipList',
                host: {
                    '[attr.tabindex]': '_tabIndex',
                    'role': 'listbox',
                    '[attr.aria-orientation]': 'ariaOrientation',
                    'class': 'mat-chip-list',
                    '(focus)': 'focus()',
                    '(keydown)': '_keydown($event)'
                },
                queries: {
                    chips: new _angular_core.ContentChildren(MdChip)
                },
                styles: [".mat-chip-list-wrapper{display:flex;flex-direction:row;flex-wrap:wrap;align-items:flex-start}.mat-chip:not(.mat-basic-chip){transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);display:inline-flex;padding:7px 12px;border-radius:24px;align-items:center;cursor:default}.mat-chip:not(.mat-basic-chip)+.mat-chip:not(.mat-basic-chip){margin:0 0 0 8px}[dir=rtl] .mat-chip:not(.mat-basic-chip)+.mat-chip:not(.mat-basic-chip){margin:0 8px 0 0}.mat-form-field-prefix .mat-chip:not(.mat-basic-chip):last-child{margin-right:8px}[dir=rtl] .mat-form-field-prefix .mat-chip:not(.mat-basic-chip):last-child{margin-left:8px}.mat-chip:not(.mat-basic-chip) .mat-chip-remove.mat-icon{width:1em;height:1em}.mat-chip:not(.mat-basic-chip):focus{box-shadow:0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12);outline:0}@media screen and (-ms-high-contrast:active){.mat-chip:not(.mat-basic-chip){outline:solid 1px}}.mat-chip-list-stacked .mat-chip-list-wrapper{display:block}.mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip){display:block;margin:0;margin-bottom:8px}[dir=rtl] .mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip){margin:0;margin-bottom:8px}.mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip):last-child,[dir=rtl] .mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip):last-child{margin-bottom:0}.mat-form-field-prefix .mat-chip-list-wrapper{margin-bottom:8px}.mat-chip-remove{margin-right:-4px;margin-left:6px;cursor:pointer}[dir=rtl] .mat-chip-remove{margin-right:6px;margin-left:-4px}"],
                encapsulation: _angular_core.ViewEncapsulation.None,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
MdChipList.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
    { type: _angular_cdk_bidi.Directionality, decorators: [{ type: _angular_core.Optional },] },
]; };
MdChipList.propDecorators = {
    'ariaOrientation': [{ type: _angular_core.Input, args: ['aria-orientation',] },],
    'selectable': [{ type: _angular_core.Input },],
    'tabIndex': [{ type: _angular_core.Input },],
};
var MdChipInput = (function () {
    /**
     * @param {?} _elementRef
     */
    function MdChipInput(_elementRef) {
        this._elementRef = _elementRef;
        this._addOnBlur = false;
        /**
         * The list of key codes that will trigger a chipEnd event.
         *
         * Defaults to `[ENTER]`.
         */
        // TODO(tinayuangao): Support Set here
        this.separatorKeyCodes = [_angular_cdk_keycodes.ENTER];
        /**
         * Emitted when a chip is to be added.
         */
        this.chipEnd = new _angular_core.EventEmitter();
        this._inputElement = this._elementRef.nativeElement;
    }
    Object.defineProperty(MdChipInput.prototype, "chipList", {
        /**
         * Register input for chip list
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value) {
                this._chipList = value;
                this._chipList.registerInput(this._inputElement);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipInput.prototype, "addOnBlur", {
        /**
         * Whether or not the chipEnd event will be emitted when the input is blurred.
         * @return {?}
         */
        get: function () { return this._addOnBlur; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._addOnBlur = _angular_cdk_coercion.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipInput.prototype, "matChipList", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this.chipList = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipInput.prototype, "matAddOnBlur", {
        /**
         * @return {?}
         */
        get: function () { return this._addOnBlur; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this.addOnBlur = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipInput.prototype, "matSeparatorKeyCodes", {
        /**
         * @return {?}
         */
        get: function () { return this.separatorKeyCodes; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.separatorKeyCodes = v; },
        enumerable: true,
        configurable: true
    });
    /**
     * Utility method to make host definition/tests more clear.
     * @param {?=} event
     * @return {?}
     */
    MdChipInput.prototype._keydown = function (event) {
        this._emitChipEnd(event);
    };
    /**
     * Checks to see if the blur should emit the (chipEnd) event.
     * @return {?}
     */
    MdChipInput.prototype._blur = function () {
        if (this.addOnBlur) {
            this._emitChipEnd();
        }
    };
    /**
     * Checks to see if the (chipEnd) event needs to be emitted.
     * @param {?=} event
     * @return {?}
     */
    MdChipInput.prototype._emitChipEnd = function (event) {
        if (!this._inputElement.value && !!event) {
            this._chipList._keydown(event);
        }
        if (!event || this.separatorKeyCodes.indexOf(event.keyCode) > -1) {
            this.chipEnd.emit({ input: this._inputElement, value: this._inputElement.value });
            if (event) {
                event.preventDefault();
            }
        }
    };
    return MdChipInput;
}());
MdChipInput.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'input[mdChipInputFor], input[matChipInputFor]',
                host: {
                    'class': 'mat-chip-input',
                    '(keydown)': '_keydown($event)',
                    '(blur)': '_blur()'
                }
            },] },
];
/**
 * @nocollapse
 */
MdChipInput.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
]; };
MdChipInput.propDecorators = {
    'chipList': [{ type: _angular_core.Input, args: ['mdChipInputFor',] },],
    'addOnBlur': [{ type: _angular_core.Input, args: ['mdChipInputAddOnBlur',] },],
    'separatorKeyCodes': [{ type: _angular_core.Input, args: ['mdChipInputSeparatorKeyCodes',] },],
    'chipEnd': [{ type: _angular_core.Output, args: ['mdChipInputTokenEnd',] },],
    'matChipList': [{ type: _angular_core.Input, args: ['matChipInputFor',] },],
    'matAddOnBlur': [{ type: _angular_core.Input, args: ['matChipInputAddOnBlur',] },],
    'matSeparatorKeyCodes': [{ type: _angular_core.Input, args: ['matChipInputSeparatorKeyCodes',] },],
};
var MdChipsModule = (function () {
    function MdChipsModule() {
    }
    return MdChipsModule;
}());
MdChipsModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [],
                exports: [MdChipList, MdChip, MdChipInput, MdChipRemove, MdChipRemove, MdBasicChip],
                declarations: [MdChipList, MdChip, MdChipInput, MdChipRemove, MdChipRemove, MdBasicChip]
            },] },
];
/**
 * @nocollapse
 */
MdChipsModule.ctorParameters = function () { return []; };

exports.MdChipsModule = MdChipsModule;
exports.MdChipList = MdChipList;
exports.MdChipBase = MdChipBase;
exports._MdChipMixinBase = _MdChipMixinBase;
exports.MdBasicChip = MdBasicChip;
exports.MdChip = MdChip;
exports.MdChipRemove = MdChipRemove;
exports.MdChipInput = MdChipInput;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-chips.umd.js.map
