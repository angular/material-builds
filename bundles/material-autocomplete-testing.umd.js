(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/coercion'), require('@angular/cdk/testing')) :
    typeof define === 'function' && define.amd ? define('@angular/material/autocomplete/testing', ['exports', 'tslib', '@angular/cdk/coercion', '@angular/cdk/testing'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.autocomplete = global.ng.material.autocomplete || {}, global.ng.material.autocomplete.testing = {}), global.tslib, global.ng.cdk.coercion, global.ng.cdk.testing));
}(this, function (exports, tslib, coercion, testing) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Harness for interacting with a the `mat-option` for a `mat-autocomplete` in tests.
     * @dynamic
     */
    var MatAutocompleteOptionHarness = /** @class */ (function (_super) {
        tslib.__extends(MatAutocompleteOptionHarness, _super);
        function MatAutocompleteOptionHarness() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MatAutocompleteOptionHarness.with = function (options) {
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatAutocompleteOptionHarness, options)
                .addOption('text', options.text, function (harness, text) { return testing.HarnessPredicate.stringMatches(harness.getText(), text); });
        };
        /** Clicks the option. */
        MatAutocompleteOptionHarness.prototype.select = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).click()];
                    }
                });
            });
        };
        /** Gets a promise for the option's label text. */
        MatAutocompleteOptionHarness.prototype.getText = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).text()];
                    }
                });
            });
        };
        MatAutocompleteOptionHarness.hostSelector = '.mat-autocomplete-panel .mat-option';
        return MatAutocompleteOptionHarness;
    }(testing.ComponentHarness));
    /**
     * Harness for interacting with a the `mat-optgroup` for a `mat-autocomplete` in tests.
     * @dynamic
     */
    var MatAutocompleteOptionGroupHarness = /** @class */ (function (_super) {
        tslib.__extends(MatAutocompleteOptionGroupHarness, _super);
        function MatAutocompleteOptionGroupHarness() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._label = _this.locatorFor('.mat-optgroup-label');
            return _this;
        }
        MatAutocompleteOptionGroupHarness.with = function (options) {
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatAutocompleteOptionGroupHarness, options)
                .addOption('labelText', options.labelText, function (harness, label) { return testing.HarnessPredicate.stringMatches(harness.getLabelText(), label); });
        };
        /** Gets a promise for the option group's label text. */
        MatAutocompleteOptionGroupHarness.prototype.getLabelText = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._label()];
                        case 1: return [2 /*return*/, (_a.sent()).text()];
                    }
                });
            });
        };
        MatAutocompleteOptionGroupHarness.hostSelector = '.mat-autocomplete-panel .mat-optgroup';
        return MatAutocompleteOptionGroupHarness;
    }(testing.ComponentHarness));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Selector for the autocomplete panel. */
    var PANEL_SELECTOR = '.mat-autocomplete-panel';
    /**
     * Harness for interacting with a standard mat-autocomplete in tests.
     * @dynamic
     */
    var MatAutocompleteHarness = /** @class */ (function (_super) {
        tslib.__extends(MatAutocompleteHarness, _super);
        function MatAutocompleteHarness() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._documentRootLocator = _this.documentRootLocatorFactory();
            _this._optionalPanel = _this._documentRootLocator.locatorForOptional(PANEL_SELECTOR);
            return _this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for an autocomplete with
         * specific attributes.
         * @param options Options for narrowing the search:
         *   - `name` finds an autocomplete with a specific name.
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
        /** Gets a boolean promise indicating if the autocomplete input is disabled. */
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
        /** Focuses the input and returns a void promise that indicates when the action is complete. */
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
        /** Blurs the input and returns a void promise that indicates when the action is complete. */
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
                    return [2 /*return*/, this._documentRootLocator.locatorForAll(MatAutocompleteOptionHarness.with(filters))()];
                });
            });
        };
        /** Gets the groups of options inside the panel. */
        MatAutocompleteHarness.prototype.getOptionGroups = function (filters) {
            if (filters === void 0) { filters = {}; }
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    return [2 /*return*/, this._documentRootLocator.locatorForAll(MatAutocompleteOptionGroupHarness.with(filters))()];
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
                            return [4 /*yield*/, options[0].select()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Gets whether the autocomplete is open. */
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

}));
//# sourceMappingURL=material-autocomplete-testing.umd.js.map
