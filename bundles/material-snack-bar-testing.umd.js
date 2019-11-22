(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/testing')) :
    typeof define === 'function' && define.amd ? define('@angular/material/snack-bar/testing', ['exports', 'tslib', '@angular/cdk/testing'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.snackBar = global.ng.material.snackBar || {}, global.ng.material.snackBar.testing = {}), global.tslib, global.ng.cdk.testing));
}(this, (function (exports, tslib, testing) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Harness for interacting with a standard mat-snack-bar in tests. */
    var MatSnackBarHarness = /** @class */ (function (_super) {
        tslib.__extends(MatSnackBarHarness, _super);
        function MatSnackBarHarness() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._simpleSnackBar = _this.locatorForOptional('.mat-simple-snackbar');
            _this._simpleSnackBarMessage = _this.locatorFor('.mat-simple-snackbar > span');
            _this._simpleSnackBarActionButton = _this.locatorForOptional('.mat-simple-snackbar-action > button');
            return _this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatSnackBarHarness` that meets
         * certain criteria.
         * @param options Options for filtering which snack bar instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatSnackBarHarness.with = function (options) {
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatSnackBarHarness, options);
        };
        /**
         * Gets the role of the snack-bar. The role of a snack-bar is determined based
         * on the ARIA politeness specified in the snack-bar config.
         */
        MatSnackBarHarness.prototype.getRole = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).getAttribute('role')];
                    }
                });
            });
        };
        /**
         * Whether the snack-bar has an action. Method cannot be used for snack-bar's with custom content.
         */
        MatSnackBarHarness.prototype.hasAction = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._assertSimpleSnackBar()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this._simpleSnackBarActionButton()];
                        case 2: return [2 /*return*/, (_a.sent()) !== null];
                    }
                });
            });
        };
        /**
         * Gets the description of the snack-bar. Method cannot be used for snack-bar's without action or
         * with custom content.
         */
        MatSnackBarHarness.prototype.getActionDescription = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._assertSimpleSnackBarWithAction()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this._simpleSnackBarActionButton()];
                        case 2: return [2 /*return*/, (_a.sent()).text()];
                    }
                });
            });
        };
        /**
         * Dismisses the snack-bar by clicking the action button. Method cannot be used for snack-bar's
         * without action or with custom content.
         */
        MatSnackBarHarness.prototype.dismissWithAction = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._assertSimpleSnackBarWithAction()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this._simpleSnackBarActionButton()];
                        case 2: return [4 /*yield*/, (_a.sent()).click()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Gets the message of the snack-bar. Method cannot be used for snack-bar's with custom content.
         */
        MatSnackBarHarness.prototype.getMessage = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._assertSimpleSnackBar()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this._simpleSnackBarMessage()];
                        case 2: return [2 /*return*/, (_a.sent()).text()];
                    }
                });
            });
        };
        /**
         * Asserts that the current snack-bar does not use custom content. Promise rejects if
         * custom content is used.
         */
        MatSnackBarHarness.prototype._assertSimpleSnackBar = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._isSimpleSnackBar()];
                        case 1:
                            if (!(_a.sent())) {
                                throw new Error('Method cannot be used for snack-bar with custom content.');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Asserts that the current snack-bar does not use custom content and has
         * an action defined. Otherwise the promise will reject.
         */
        MatSnackBarHarness.prototype._assertSimpleSnackBarWithAction = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._assertSimpleSnackBar()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.hasAction()];
                        case 2:
                            if (!(_a.sent())) {
                                throw new Error('Method cannot be used for standard snack-bar without action.');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Whether the snack-bar is using the default content template. */
        MatSnackBarHarness.prototype._isSimpleSnackBar = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._simpleSnackBar()];
                        case 1: return [2 /*return*/, (_a.sent()) !== null];
                    }
                });
            });
        };
        // Developers can provide a custom component or template for the
        // snackbar. The canonical snack-bar parent is the "MatSnackBarContainer".
        /** The selector for the host element of a `MatSnackBar` instance. */
        MatSnackBarHarness.hostSelector = '.mat-snack-bar-container';
        return MatSnackBarHarness;
    }(testing.ComponentHarness));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    exports.MatSnackBarHarness = MatSnackBarHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-snack-bar-testing.umd.js.map
