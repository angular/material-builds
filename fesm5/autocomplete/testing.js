import { __extends, __awaiter, __generator } from 'tslib';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a the `mat-option` for a `mat-autocomplete` in tests. */
var MatAutocompleteOptionHarness = /** @class */ (function (_super) {
    __extends(MatAutocompleteOptionHarness, _super);
    function MatAutocompleteOptionHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatAutocompleteOptionHarness` that
     * meets certain criteria.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatAutocompleteOptionHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatAutocompleteOptionHarness, options)
            .addOption('text', options.text, function (harness, text) { return HarnessPredicate.stringMatches(harness.getText(), text); });
    };
    /** Clicks the option. */
    MatAutocompleteOptionHarness.prototype.select = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).click()];
                }
            });
        });
    };
    /** Gets the option's label text. */
    MatAutocompleteOptionHarness.prototype.getText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** The selector for the host element of an autocomplete `MatOption` instance. */
    MatAutocompleteOptionHarness.hostSelector = '.mat-autocomplete-panel .mat-option';
    return MatAutocompleteOptionHarness;
}(ComponentHarness));
/** Harness for interacting with a the `mat-optgroup` for a `mat-autocomplete` in tests. */
var MatAutocompleteOptionGroupHarness = /** @class */ (function (_super) {
    __extends(MatAutocompleteOptionGroupHarness, _super);
    function MatAutocompleteOptionGroupHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._label = _this.locatorFor('.mat-optgroup-label');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatAutocompleteOptionGroupHarness`
     * that meets certain criteria.
     * @param options Options for filtering which option group instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatAutocompleteOptionGroupHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatAutocompleteOptionGroupHarness, options)
            .addOption('labelText', options.labelText, function (harness, label) { return HarnessPredicate.stringMatches(harness.getLabelText(), label); });
    };
    /** Gets the option group's label text. */
    MatAutocompleteOptionGroupHarness.prototype.getLabelText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._label()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** The selector for the host element of an autocomplete `MatOptionGroup` instance. */
    MatAutocompleteOptionGroupHarness.hostSelector = '.mat-autocomplete-panel .mat-optgroup';
    return MatAutocompleteOptionGroupHarness;
}(ComponentHarness));

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Selector for the autocomplete panel. */
var PANEL_SELECTOR = '.mat-autocomplete-panel';
/** Harness for interacting with a standard mat-autocomplete in tests. */
var MatAutocompleteHarness = /** @class */ (function (_super) {
    __extends(MatAutocompleteHarness, _super);
    function MatAutocompleteHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._documentRootLocator = _this.documentRootLocatorFactory();
        _this._optionalPanel = _this._documentRootLocator.locatorForOptional(PANEL_SELECTOR);
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
            return __generator(this, function (_a) {
                return [2 /*return*/, this._documentRootLocator.locatorForAll(MatAutocompleteOptionHarness.with(filters))()];
            });
        });
    };
    /** Gets the option groups inside the autocomplete panel. */
    MatAutocompleteHarness.prototype.getOptionGroups = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._documentRootLocator.locatorForAll(MatAutocompleteOptionGroupHarness.with(filters))()];
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
                        return [4 /*yield*/, options[0].select()];
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
                    case 0: return [4 /*yield*/, this._optionalPanel()];
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
