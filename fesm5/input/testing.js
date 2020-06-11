import { __extends, __awaiter, __generator } from 'tslib';
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Material inputs in tests. */
var MatInputHarness = /** @class */ (function (_super) {
    __extends(MatInputHarness, _super);
    function MatInputHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatInputHarness` that meets
     * certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatInputHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatInputHarness, options)
            .addOption('value', options.value, function (harness, value) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, harness.getValue()];
                    case 1: return [2 /*return*/, (_a.sent()) === value];
                }
            });
        }); })
            .addOption('placeholder', options.placeholder, function (harness, placeholder) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, harness.getPlaceholder()];
                    case 1: return [2 /*return*/, (_a.sent()) === placeholder];
                }
            });
        }); });
    };
    /** Whether the input is disabled. */
    MatInputHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getProperty('disabled')];
                }
            });
        });
    };
    /** Whether the input is required. */
    MatInputHarness.prototype.isRequired = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getProperty('required')];
                }
            });
        });
    };
    /** Whether the input is readonly. */
    MatInputHarness.prototype.isReadonly = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getProperty('readOnly')];
                }
            });
        });
    };
    /** Gets the value of the input. */
    MatInputHarness.prototype.getValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getProperty('value')];
                    case 2: 
                    // The "value" property of the native input is never undefined.
                    return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /** Gets the name of the input. */
    MatInputHarness.prototype.getName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getProperty('name')];
                    case 2: 
                    // The "name" property of the native input is never undefined.
                    return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /**
     * Gets the type of the input. Returns "textarea" if the input is
     * a textarea.
     */
    MatInputHarness.prototype.getType = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getProperty('type')];
                    case 2: 
                    // The "type" property of the native input is never undefined.
                    return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /** Gets the placeholder of the input. */
    MatInputHarness.prototype.getPlaceholder = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getProperty('placeholder')];
                    case 2: 
                    // The "placeholder" property of the native input is never undefined.
                    return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /** Gets the id of the input. */
    MatInputHarness.prototype.getId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getProperty('id')];
                    case 2: 
                    // The input directive always assigns a unique id to the input in
                    // case no id has been explicitly specified.
                    return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    MatInputHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    MatInputHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    MatInputHarness.prototype.setValue = function (newValue) {
        return __awaiter(this, void 0, void 0, function () {
            var inputEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        inputEl = _a.sent();
                        return [4 /*yield*/, inputEl.clear()];
                    case 2:
                        _a.sent();
                        if (!newValue) return [3 /*break*/, 4];
                        return [4 /*yield*/, inputEl.sendKeys(newValue)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!inputEl.setInputValue) return [3 /*break*/, 6];
                        return [4 /*yield*/, inputEl.setInputValue(newValue)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // TODO: We do not want to handle `select` elements with `matNativeControl` because
    // not all methods of this harness work reasonably for native select elements.
    // For more details. See: https://github.com/angular/components/pull/18221.
    MatInputHarness.hostSelector = '[matInput], input[matNativeControl], textarea[matNativeControl]';
    return MatInputHarness;
}(MatFormFieldControlHarness));

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

export { MatInputHarness };
//# sourceMappingURL=testing.js.map
