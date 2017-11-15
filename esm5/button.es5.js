/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '@angular/core';
import '@angular/common';
import { mixinColor, mixinDisableRipple, mixinDisabled } from '@angular/material/core';
import '@angular/cdk/a11y';
import { __extends } from 'tslib';
import * as tslib_1 from 'tslib';
import '@angular/cdk/platform';

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
var _MatButtonMixinBase = mixinColor(mixinDisabled(mixinDisableRipple(MatButtonBase)));
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

export { MatButtonModule, MatButtonCssMatStyler, MatRaisedButtonCssMatStyler, MatIconButtonCssMatStyler, MatFab, MatMiniFab, MatButtonBase, _MatButtonMixinBase, MatButton, MatAnchor };
//# sourceMappingURL=button.es5.js.map
