import { __extends, __awaiter, __generator, __read } from 'tslib';
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-snack-bar in tests. */
var MatSnackBarHarness = /** @class */ (function (_super) {
    __extends(MatSnackBarHarness, _super);
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
        return new HarnessPredicate(MatSnackBarHarness, options);
    };
    /**
     * Gets the role of the snack-bar. The role of a snack-bar is determined based
     * on the ARIA politeness specified in the snack-bar config.
     */
    MatSnackBarHarness.prototype.getRole = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
    /** Gets whether the snack-bar has been dismissed. */
    MatSnackBarHarness.prototype.isDismissed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host, _a, exit, dimensions;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _b.sent();
                        return [4 /*yield*/, Promise.all([
                                // The snackbar container is marked with the "exit" attribute after it has been dismissed
                                // but before the animation has finished (after which it's removed from the DOM).
                                host.getAttribute('mat-exit'),
                                host.getDimensions(),
                            ])];
                    case 2:
                        _a = __read.apply(void 0, [_b.sent(), 2]), exit = _a[0], dimensions = _a[1];
                        return [2 /*return*/, exit != null || (!!dimensions && dimensions.height === 0 && dimensions.width === 0)];
                }
            });
        });
    };
    /**
     * Asserts that the current snack-bar does not use custom content. Promise rejects if
     * custom content is used.
     */
    MatSnackBarHarness.prototype._assertSimpleSnackBar = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._isSimpleSnackBar()];
                    case 1:
                        if (!(_a.sent())) {
                            throw Error('Method cannot be used for snack-bar with custom content.');
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._assertSimpleSnackBar()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.hasAction()];
                    case 2:
                        if (!(_a.sent())) {
                            throw Error('Method cannot be used for standard snack-bar without action.');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Whether the snack-bar is using the default content template. */
    MatSnackBarHarness.prototype._isSimpleSnackBar = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
}(ComponentHarness));

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

export { MatSnackBarHarness };
//# sourceMappingURL=testing.js.map
