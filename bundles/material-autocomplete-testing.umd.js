(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/coercion'), require('@angular/cdk/testing'), require('@angular/material/core/testing')) :
    typeof define === 'function' && define.amd ? define('@angular/material/autocomplete/testing', ['exports', 'tslib', '@angular/cdk/coercion', '@angular/cdk/testing', '@angular/material/core/testing'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.autocomplete = global.ng.material.autocomplete || {}, global.ng.material.autocomplete.testing = {}), global.tslib, global.ng.cdk.coercion, global.ng.cdk.testing, global.ng.material.core.testing));
}(this, (function (exports, tslib, coercion, testing, testing$1) { 'use strict';

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
        tslib.__extends(MatAutocompleteHarness, _super);
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
            return new testing.HarnessPredicate(MatAutocompleteHarness, options)
                .addOption('value', options.value, function (harness, value) { return testing.HarnessPredicate.stringMatches(harness.getValue(), value); });
        };
        /** Gets the value of the autocomplete input. */
        MatAutocompleteHarness.prototype.getValue = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).getProperty('value')];
                    }
                });
            });
        };
        /** Whether the autocomplete input is disabled. */
        MatAutocompleteHarness.prototype.isDisabled = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var disabled, _a;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1:
                            disabled = (_b.sent()).getAttribute('disabled');
                            _a = coercion.coerceBooleanProperty;
                            return [4 /*yield*/, disabled];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Focuses the autocomplete input. */
        MatAutocompleteHarness.prototype.focus = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).focus()];
                    }
                });
            });
        };
        /** Blurs the autocomplete input. */
        MatAutocompleteHarness.prototype.blur = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).blur()];
                    }
                });
            });
        };
        /** Enters text into the autocomplete. */
        MatAutocompleteHarness.prototype.enterText = function (value) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
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
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    return [2 /*return*/, this._documentRootLocator.locatorForAll(testing$1.MatOptionHarness.with(tslib.__assign(tslib.__assign({}, filters), { ancestor: PANEL_SELECTOR })))()];
                });
            });
        };
        /** Gets the option groups inside the autocomplete panel. */
        MatAutocompleteHarness.prototype.getOptionGroups = function (filters) {
            if (filters === void 0) { filters = {}; }
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    return [2 /*return*/, this._documentRootLocator.locatorForAll(testing$1.MatOptgroupHarness.with(tslib.__assign(tslib.__assign({}, filters), { ancestor: PANEL_SELECTOR })))()];
                });
            });
        };
        /** Selects the first option matching the given filters. */
        MatAutocompleteHarness.prototype.selectOption = function (filters) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var options;
                return tslib.__generator(this, function (_a) {
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
            return tslib.__awaiter(this, void 0, void 0, function () {
                var panel, _a;
                return tslib.__generator(this, function (_b) {
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

    exports.MatAutocompleteHarness = MatAutocompleteHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-autocomplete-testing.umd.js.map
