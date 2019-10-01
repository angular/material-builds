(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/testing'), require('@angular/cdk/coercion')) :
    typeof define === 'function' && define.amd ? define('@angular/material/autocomplete/testing', ['exports', 'tslib', '@angular/cdk/testing', '@angular/cdk/coercion'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.autocomplete = global.ng.material.autocomplete || {}, global.ng.material.autocomplete.testing = {}), global.tslib, global.ng.cdk.testing, global.ng.cdk.coercion));
}(this, function (exports, tslib_1, testing, coercion) { 'use strict';

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
        tslib_1.__extends(MatAutocompleteOptionHarness, _super);
        function MatAutocompleteOptionHarness() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MatAutocompleteOptionHarness.with = function (options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatAutocompleteOptionHarness, options)
                .addOption('text', options.text, function (harness, title) { return tslib_1.__awaiter(_this, void 0, void 0, function () { var _a, _b; return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = testing.HarnessPredicate).stringMatches;
                        return [4 /*yield*/, harness.getText()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent(), title])];
                }
            }); }); });
        };
        /** Clicks the option. */
        MatAutocompleteOptionHarness.prototype.click = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).click()];
                    }
                });
            });
        };
        /** Gets a promise for the option's label text. */
        MatAutocompleteOptionHarness.prototype.getText = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
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
        tslib_1.__extends(MatAutocompleteOptionGroupHarness, _super);
        function MatAutocompleteOptionGroupHarness() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._label = _this.locatorFor('.mat-optgroup-label');
            return _this;
        }
        MatAutocompleteOptionGroupHarness.with = function (options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatAutocompleteOptionGroupHarness, options)
                .addOption('labelText', options.labelText, function (harness, title) { return tslib_1.__awaiter(_this, void 0, void 0, function () { var _a, _b; return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = testing.HarnessPredicate).stringMatches;
                        return [4 /*yield*/, harness.getLabelText()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent(), title])];
                }
            }); }); });
        };
        /** Gets a promise for the option group's label text. */
        MatAutocompleteOptionGroupHarness.prototype.getLabelText = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
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
        tslib_1.__extends(MatAutocompleteHarness, _super);
        function MatAutocompleteHarness() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._documentRootLocator = _this.documentRootLocatorFactory();
            _this._panel = _this._documentRootLocator.locatorFor(PANEL_SELECTOR);
            _this._optionalPanel = _this._documentRootLocator.locatorForOptional(PANEL_SELECTOR);
            _this._options = _this._documentRootLocator.locatorForAll(MatAutocompleteOptionHarness);
            _this._groups = _this._documentRootLocator.locatorForAll(MatAutocompleteOptionGroupHarness);
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
            return new testing.HarnessPredicate(MatAutocompleteHarness, options);
        };
        MatAutocompleteHarness.prototype.getAttribute = function (attributeName) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).getAttribute(attributeName)];
                    }
                });
            });
        };
        /** Gets a boolean promise indicating if the autocomplete input is disabled. */
        MatAutocompleteHarness.prototype.isDisabled = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var disabled, _a;
                return tslib_1.__generator(this, function (_b) {
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
        /** Gets a promise for the autocomplete's text. */
        MatAutocompleteHarness.prototype.getText = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).getProperty('value')];
                    }
                });
            });
        };
        /** Focuses the input and returns a void promise that indicates when the action is complete. */
        MatAutocompleteHarness.prototype.focus = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).focus()];
                    }
                });
            });
        };
        /** Blurs the input and returns a void promise that indicates when the action is complete. */
        MatAutocompleteHarness.prototype.blur = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).blur()];
                    }
                });
            });
        };
        /** Enters text into the autocomplete. */
        MatAutocompleteHarness.prototype.enterText = function (value) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).sendKeys(value)];
                    }
                });
            });
        };
        /** Gets the autocomplete panel. */
        MatAutocompleteHarness.prototype.getPanel = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, this._panel()];
                });
            });
        };
        /** Gets the options inside the autocomplete panel. */
        MatAutocompleteHarness.prototype.getOptions = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, this._options()];
                });
            });
        };
        /** Gets the groups of options inside the panel. */
        MatAutocompleteHarness.prototype.getOptionGroups = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, this._groups()];
                });
            });
        };
        /** Gets whether the autocomplete panel is visible. */
        MatAutocompleteHarness.prototype.isPanelVisible = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._panel()];
                        case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-autocomplete-visible')];
                    }
                });
            });
        };
        /** Gets whether the autocomplete is open. */
        MatAutocompleteHarness.prototype.isOpen = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._optionalPanel()];
                        case 1: return [2 /*return*/, !!(_a.sent())];
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
