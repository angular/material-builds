/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/material/core'), require('@angular/cdk/platform')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/material/core', '@angular/cdk/platform'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.toolbar = global.ng.material.toolbar || {}),global.ng.core,global.ng.material.core));
}(this, (function (exports,_angular_core,_angular_material_core) { 'use strict';

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
 * \@docs-private
 */
var MatToolbarBase = /** @class */ (function () {
    function MatToolbarBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MatToolbarBase;
}());
var _MatToolbarMixinBase = _angular_material_core.mixinColor(MatToolbarBase);
var MatToolbarRow = /** @class */ (function () {
    function MatToolbarRow() {
    }
    return MatToolbarRow;
}());
var MatToolbar = /** @class */ (function (_super) {
    __extends(MatToolbar, _super);
    function MatToolbar(renderer, elementRef, _platform) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._platform = _platform;
        return _this;
    }
    /**
     * @return {?}
     */
    MatToolbar.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!_angular_core.isDevMode() || !this._platform.isBrowser) {
            return;
        }
        this._checkToolbarMixedModes();
        this._toolbarRows.changes.subscribe(function () { return _this._checkToolbarMixedModes(); });
    };
    /**
     * Throws an exception when developers are attempting to combine the different toolbar row modes.
     * @return {?}
     */
    MatToolbar.prototype._checkToolbarMixedModes = /**
     * Throws an exception when developers are attempting to combine the different toolbar row modes.
     * @return {?}
     */
    function () {
        if (!this._toolbarRows.length) {
            return;
        }
        // Check if there are any other DOM nodes that can display content but aren't inside of
        // a <mat-toolbar-row> element.
        var /** @type {?} */ isCombinedUsage = [].slice.call(this._elementRef.nativeElement.childNodes)
            .filter(function (node) { return !(node.classList && node.classList.contains('mat-toolbar-row')); })
            .filter(function (node) { return node.nodeType !== Node.COMMENT_NODE; })
            .some(function (node) { return node.textContent.trim(); });
        if (isCombinedUsage) {
            throwToolbarMixedModesError();
        }
    };
    return MatToolbar;
}(_MatToolbarMixinBase));
/**
 * Throws an exception when attempting to combine the different toolbar row modes.
 * \@docs-private
 * @return {?}
 */
function throwToolbarMixedModesError() {
    throw Error('MatToolbar: Attempting to combine different toolbar modes. ' +
        'Either specify multiple `<mat-toolbar-row>` elements explicitly or just place content ' +
        'inside of a `<mat-toolbar>` for a single row.');
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatToolbarModule = /** @class */ (function () {
    function MatToolbarModule() {
    }
    return MatToolbarModule;
}());

exports.MatToolbarModule = MatToolbarModule;
exports.MatToolbarBase = MatToolbarBase;
exports._MatToolbarMixinBase = _MatToolbarMixinBase;
exports.MatToolbarRow = MatToolbarRow;
exports.MatToolbar = MatToolbar;
exports.throwToolbarMixedModesError = throwToolbarMixedModesError;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-toolbar.umd.js.map
