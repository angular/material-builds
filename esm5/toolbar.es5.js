/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isDevMode } from '@angular/core';
import { mixinColor } from '@angular/material/core';
import '@angular/cdk/platform';
import { __extends } from 'tslib';
import * as tslib_1 from 'tslib';

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
var _MatToolbarMixinBase = mixinColor(MatToolbarBase);
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
        if (!isDevMode() || !this._platform.isBrowser) {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatToolbarModule, MatToolbarBase, _MatToolbarMixinBase, MatToolbarRow, MatToolbar, throwToolbarMixedModesError };
//# sourceMappingURL=toolbar.es5.js.map
