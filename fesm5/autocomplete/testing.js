import { __extends, __awaiter, __generator, __assign } from 'tslib';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';
import { MatOptionHarness, MatOptgroupHarness } from '@angular/material/core/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-autocomplete in tests. */
var MatAutocompleteHarness = /** @class */ (function (_super) {
    __extends(MatAutocompleteHarness, _super);
    function MatAutocompleteHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._documentRootLocator = _this.documentRootLocatorFactory();
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatAutocompleteHarness` that meets
     * certain criteria.
     * @param options Options for filtering which autocomplete instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatAutocompleteHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatAutocompleteHarness, options)
            .addOption('value', options.value, function (harness, value) { return HarnessPredicate.stringMatches(harness.getValue(), value); });
    };
    /** Gets the value of the autocomplete input. */
    MatAutocompleteHarness.prototype.getValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getProperty('value')];
                }
            });
        });
    };
    /** Whether the autocomplete input is disabled. */
    MatAutocompleteHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var disabled, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        disabled = (_b.sent()).getAttribute('disabled');
                        _a = coerceBooleanProperty;
                        return [4 /*yield*/, disabled];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    /** Focuses the autocomplete input. */
    MatAutocompleteHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the autocomplete input. */
    MatAutocompleteHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /** Enters text into the autocomplete. */
    MatAutocompleteHarness.prototype.enterText = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).sendKeys(value)];
                }
            });
        });
    };
    /** Gets the options inside the autocomplete panel. */
    MatAutocompleteHarness.prototype.getOptions = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _b = (_a = this._documentRootLocator).locatorForAll;
                        _d = (_c = MatOptionHarness).with;
                        _e = [__assign({}, filters)];
                        _f = {};
                        return [4 /*yield*/, this._getPanelSelector()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_d.apply(_c, [__assign.apply(void 0, _e.concat([(_f.ancestor = _g.sent(), _f)]))])])()];
                }
            });
        });
    };
    /** Gets the option groups inside the autocomplete panel. */
    MatAutocompleteHarness.prototype.getOptionGroups = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _b = (_a = this._documentRootLocator).locatorForAll;
                        _d = (_c = MatOptgroupHarness).with;
                        _e = [__assign({}, filters)];
                        _f = {};
                        return [4 /*yield*/, this._getPanelSelector()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_d.apply(_c, [__assign.apply(void 0, _e.concat([(_f.ancestor = _g.sent(), _f)]))])])()];
                }
            });
        });
    };
    /** Selects the first option matching the given filters. */
    MatAutocompleteHarness.prototype.selectOption = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.focus()];
                    case 1:
                        _a.sent(); // Focus the input to make sure the autocomplete panel is shown.
                        return [4 /*yield*/, this.getOptions(filters)];
                    case 2:
                        options = _a.sent();
                        if (!options.length) {
                            throw Error("Could not find a mat-option matching " + JSON.stringify(filters));
                        }
                        return [4 /*yield*/, options[0].click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Whether the autocomplete is open. */
    MatAutocompleteHarness.prototype.isOpen = function () {
        return __awaiter(this, void 0, void 0, function () {
            var panel, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._getPanel()];
                    case 1:
                        panel = _b.sent();
                        _a = !!panel;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, panel.hasClass('mat-autocomplete-visible')];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    /** Gets the panel associated with this autocomplete trigger. */
    MatAutocompleteHarness.prototype._getPanel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = this._documentRootLocator).locatorForOptional;
                        return [4 /*yield*/, this._getPanelSelector()];
                    case 1: 
                    // Technically this is static, but it needs to be in a
                    // function, because the autocomplete's panel ID can changed.
                    return [2 /*return*/, _b.apply(_a, [_c.sent()])()];
                }
            });
        });
    };
    /** Gets the selector that can be used to find the autocomplete trigger's panel. */
    MatAutocompleteHarness.prototype._getPanelSelector = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = "#";
                        return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_b.sent()).getAttribute('aria-owns')];
                    case 2: return [2 /*return*/, _a + (_b.sent())];
                }
            });
        });
    };
    /** The selector for the host element of a `MatAutocomplete` instance. */
    MatAutocompleteHarness.hostSelector = '.mat-autocomplete-trigger';
    return MatAutocompleteHarness;
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

export { MatAutocompleteHarness };
//# sourceMappingURL=testing.js.map
