/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/material/core')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/material/core'], factory) :
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

var MatToolbarRow = (function () {
    function MatToolbarRow() {
    }
    MatToolbarRow.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: 'mat-toolbar-row',
                    exportAs: 'matToolbarRow',
                    host: { 'class': 'mat-toolbar-row' },
                },] },
    ];
    /**
     * @nocollapse
     */
    MatToolbarRow.ctorParameters = function () { return []; };
    return MatToolbarRow;
}());
/**
 * \@docs-private
 */
var MatToolbarBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MatToolbarBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MatToolbarBase;
}());
var _MatToolbarMixinBase = _angular_material_core.mixinColor(MatToolbarBase);
var MatToolbar = (function (_super) {
    __extends(MatToolbar, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     */
    function MatToolbar(renderer, elementRef) {
        return _super.call(this, renderer, elementRef) || this;
    }
    MatToolbar.decorators = [
        { type: _angular_core.Component, args: [{selector: 'mat-toolbar',
                    exportAs: 'matToolbar',
                    template: "<div class=\"mat-toolbar-layout\"><mat-toolbar-row><ng-content></ng-content></mat-toolbar-row><ng-content select=\"mat-toolbar-row\"></ng-content></div>",
                    styles: [".mat-toolbar{display:flex;box-sizing:border-box;width:100%;padding:0 16px;flex-direction:column}.mat-toolbar .mat-toolbar-row{display:flex;box-sizing:border-box;width:100%;flex-direction:row;align-items:center;white-space:nowrap}.mat-toolbar{min-height:64px}.mat-toolbar-row{height:64px}@media (max-width:600px){.mat-toolbar{min-height:56px}.mat-toolbar-row{height:56px}}"],
                    inputs: ['color'],
                    host: {
                        'class': 'mat-toolbar',
                        'role': 'toolbar'
                    },
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                    encapsulation: _angular_core.ViewEncapsulation.None,
                    preserveWhitespaces: false,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatToolbar.ctorParameters = function () { return [
        { type: _angular_core.Renderer2, },
        { type: _angular_core.ElementRef, },
    ]; };
    return MatToolbar;
}(_MatToolbarMixinBase));

var MatToolbarModule = (function () {
    function MatToolbarModule() {
    }
    MatToolbarModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [_angular_material_core.MatCommonModule],
                    exports: [MatToolbar, MatToolbarRow, _angular_material_core.MatCommonModule],
                    declarations: [MatToolbar, MatToolbarRow],
                },] },
    ];
    /**
     * @nocollapse
     */
    MatToolbarModule.ctorParameters = function () { return []; };
    return MatToolbarModule;
}());

exports.MatToolbarModule = MatToolbarModule;
exports.MatToolbarRow = MatToolbarRow;
exports.MatToolbarBase = MatToolbarBase;
exports._MatToolbarMixinBase = _MatToolbarMixinBase;
exports.MatToolbar = MatToolbar;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-toolbar.umd.js.map
