/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/material/core'), require('@angular/cdk/a11y'), require('@angular/cdk/platform')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/material/core', '@angular/cdk/a11y', '@angular/cdk/platform'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.button = global.ng.material.button || {}),global.ng.core,global.ng.common,global.ng.material.core));
}(this, (function (exports,_angular_core,_angular_common,_angular_material_core) { 'use strict';

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
 * Default color palette for round buttons (mat-fab and mat-mini-fab)
 */
var DEFAULT_ROUND_BUTTON_COLOR = 'accent';
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MatButtonCssMatStyler = /** @class */ (function () {
    function MatButtonCssMatStyler() {
    }
    return MatButtonCssMatStyler;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MatRaisedButtonCssMatStyler = /** @class */ (function () {
    function MatRaisedButtonCssMatStyler() {
    }
    return MatRaisedButtonCssMatStyler;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MatIconButtonCssMatStyler = /** @class */ (function () {
    function MatIconButtonCssMatStyler() {
    }
    return MatIconButtonCssMatStyler;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MatFab = /** @class */ (function () {
    function MatFab(button, anchor) {
        // Set the default color palette for the mat-fab components.
        (button || anchor).color = DEFAULT_ROUND_BUTTON_COLOR;
    }
    return MatFab;
}());
/**
 * Directive that targets mini-fab buttons and anchors. It's used to apply the `mat-` class
 * to all mini-fab buttons and also is responsible for setting the default color palette.
 * \@docs-private
 */
var MatMiniFab = /** @class */ (function () {
    function MatMiniFab(button, anchor) {
        // Set the default color palette for the mat-mini-fab components.
        (button || anchor).color = DEFAULT_ROUND_BUTTON_COLOR;
    }
    return MatMiniFab;
}());
/**
 * \@docs-private
 */
var MatButtonBase = /** @class */ (function () {
    function MatButtonBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MatButtonBase;
}());
var _MatButtonMixinBase = _angular_material_core.mixinColor(_angular_material_core.mixinDisabled(_angular_material_core.mixinDisableRipple(MatButtonBase)));
/**
 * Material design button.
 */
var MatButton = /** @class */ (function (_super) {
    __extends(MatButton, _super);
    function MatButton(renderer, elementRef, _platform, _focusMonitor) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._platform = _platform;
        _this._focusMonitor = _focusMonitor;
        _this._focusMonitor.monitor(_this._elementRef.nativeElement, true);
        return _this;
    }
    /**
     * @return {?}
     */
    MatButton.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
    };
    /** Focuses the button. */
    /**
     * Focuses the button.
     * @return {?}
     */
    MatButton.prototype.focus = /**
     * Focuses the button.
     * @return {?}
     */
    function () {
        this._getHostElement().focus();
    };
    /**
     * @return {?}
     */
    MatButton.prototype._getHostElement = /**
     * @return {?}
     */
    function () {
        return this._elementRef.nativeElement;
    };
    /**
     * @return {?}
     */
    MatButton.prototype._isRippleDisabled = /**
     * @return {?}
     */
    function () {
        return this.disableRipple || this.disabled;
    };
    /** Gets whether the button has one of the given attributes. */
    /**
     * Gets whether the button has one of the given attributes.
     * @param {...?} attributes
     * @return {?}
     */
    MatButton.prototype._hasHostAttributes = /**
     * Gets whether the button has one of the given attributes.
     * @param {...?} attributes
     * @return {?}
     */
    function () {
        var _this = this;
        var attributes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            attributes[_i] = arguments[_i];
        }
        // If not on the browser, say that there are none of the attributes present.
        // Since these only affect how the ripple displays (and ripples only happen on the client),
        // detecting these attributes isn't necessary when not on the browser.
        if (!this._platform.isBrowser) {
            return false;
        }
        return attributes.some(function (attribute) { return _this._getHostElement().hasAttribute(attribute); });
    };
    return MatButton;
}(_MatButtonMixinBase));
/**
 * Raised Material design button.
 */
var MatAnchor = /** @class */ (function (_super) {
    __extends(MatAnchor, _super);
    function MatAnchor(platform, focusMonitor, elementRef, renderer) {
        return _super.call(this, renderer, elementRef, platform, focusMonitor) || this;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    MatAnchor.prototype._haltDisabledEvents = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // A disabled button shouldn't apply any actions
        if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };
    return MatAnchor;
}(MatButton));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatButtonModule = /** @class */ (function () {
    function MatButtonModule() {
    }
    return MatButtonModule;
}());

exports.MatButtonModule = MatButtonModule;
exports.MatButtonCssMatStyler = MatButtonCssMatStyler;
exports.MatRaisedButtonCssMatStyler = MatRaisedButtonCssMatStyler;
exports.MatIconButtonCssMatStyler = MatIconButtonCssMatStyler;
exports.MatFab = MatFab;
exports.MatMiniFab = MatMiniFab;
exports.MatButtonBase = MatButtonBase;
exports._MatButtonMixinBase = _MatButtonMixinBase;
exports.MatButton = MatButton;
exports.MatAnchor = MatAnchor;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-button.umd.js.map
