(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/testing'), require('@angular/cdk/coercion')) :
    typeof define === 'function' && define.amd ? define('@angular/material/button-toggle/testing', ['exports', 'tslib', '@angular/cdk/testing', '@angular/cdk/coercion'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.buttonToggle = global.ng.material.buttonToggle || {}, global.ng.material.buttonToggle.testing = {}), global.tslib, global.ng.cdk.testing, global.ng.cdk.coercion));
}(this, (function (exports, tslib, testing, coercion) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Harness for interacting with a standard mat-button-toggle in tests. */
    var MatButtonToggleHarness = /** @class */ (function (_super) {
        tslib.__extends(MatButtonToggleHarness, _super);
        function MatButtonToggleHarness() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._label = _this.locatorFor('.mat-button-toggle-label-content');
            _this._button = _this.locatorFor('.mat-button-toggle-button');
            return _this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatButtonToggleHarness` that meets
         * certain criteria.
         * @param options Options for filtering which button toggle instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatButtonToggleHarness.with = function (options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatButtonToggleHarness, options)
                .addOption('text', options.text, function (harness, text) { return testing.HarnessPredicate.stringMatches(harness.getText(), text); })
                .addOption('name', options.name, function (harness, name) { return testing.HarnessPredicate.stringMatches(harness.getName(), name); })
                .addOption('checked', options.checked, function (harness, checked) { return tslib.__awaiter(_this, void 0, void 0, function () { return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, harness.isChecked()];
                    case 1: return [2 /*return*/, (_a.sent()) === checked];
                }
            }); }); });
        };
        /** Gets a boolean promise indicating if the button toggle is checked. */
        MatButtonToggleHarness.prototype.isChecked = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var checked, _a;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this._button()];
                        case 1:
                            checked = (_b.sent()).getAttribute('aria-pressed');
                            _a = coercion.coerceBooleanProperty;
                            return [4 /*yield*/, checked];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Gets a boolean promise indicating if the button toggle is disabled. */
        MatButtonToggleHarness.prototype.isDisabled = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var disabled, _a;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this._button()];
                        case 1:
                            disabled = (_b.sent()).getAttribute('disabled');
                            _a = coercion.coerceBooleanProperty;
                            return [4 /*yield*/, disabled];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Gets a promise for the button toggle's name. */
        MatButtonToggleHarness.prototype.getName = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._button()];
                        case 1: return [2 /*return*/, (_a.sent()).getAttribute('name')];
                    }
                });
            });
        };
        /** Gets a promise for the button toggle's aria-label. */
        MatButtonToggleHarness.prototype.getAriaLabel = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._button()];
                        case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-label')];
                    }
                });
            });
        };
        /** Gets a promise for the button toggles's aria-labelledby. */
        MatButtonToggleHarness.prototype.getAriaLabelledby = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._button()];
                        case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-labelledby')];
                    }
                });
            });
        };
        /** Gets a promise for the button toggle's text. */
        MatButtonToggleHarness.prototype.getText = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._label()];
                        case 1: return [2 /*return*/, (_a.sent()).text()];
                    }
                });
            });
        };
        /** Gets the appearance that the button toggle is using. */
        MatButtonToggleHarness.prototype.getAppearance = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var host, className;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1:
                            host = _a.sent();
                            className = 'mat-button-toggle-appearance-standard';
                            return [4 /*yield*/, host.hasClass(className)];
                        case 2: return [2 /*return*/, (_a.sent()) ? 'standard' : 'legacy'];
                    }
                });
            });
        };
        /** Focuses the toggle. */
        MatButtonToggleHarness.prototype.focus = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._button()];
                        case 1: return [2 /*return*/, (_a.sent()).focus()];
                    }
                });
            });
        };
        /** Blurs the toggle. */
        MatButtonToggleHarness.prototype.blur = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._button()];
                        case 1: return [2 /*return*/, (_a.sent()).blur()];
                    }
                });
            });
        };
        /** Toggle the checked state of the buttons toggle. */
        MatButtonToggleHarness.prototype.toggle = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._button()];
                        case 1: return [2 /*return*/, (_a.sent()).click()];
                    }
                });
            });
        };
        /**
         * Puts the button toggle in a checked state by toggling it if it's
         * currently unchecked, or doing nothing if it is already checked.
         */
        MatButtonToggleHarness.prototype.check = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isChecked()];
                        case 1:
                            if (!!(_a.sent())) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.toggle()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Puts the button toggle in an unchecked state by toggling it if it's
         * currently checked, or doing nothing if it's already unchecked.
         */
        MatButtonToggleHarness.prototype.uncheck = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isChecked()];
                        case 1:
                            if (!_a.sent()) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.toggle()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /** The selector for the host element of a `MatButton` instance. */
        MatButtonToggleHarness.hostSelector = 'mat-button-toggle';
        return MatButtonToggleHarness;
    }(testing.ComponentHarness));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Harness for interacting with a standard mat-button-toggle in tests. */
    var MatButtonToggleGroupHarness = /** @class */ (function (_super) {
        tslib.__extends(MatButtonToggleGroupHarness, _super);
        function MatButtonToggleGroupHarness() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatButtonToggleGroupHarness`
         * that meets certain criteria.
         * @param options Options for filtering which button toggle instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatButtonToggleGroupHarness.with = function (options) {
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatButtonToggleGroupHarness, options);
        };
        /**
         * Gets the button toggles that are inside the group.
         * @param filter Optionally filters which toggles are included.
         */
        MatButtonToggleGroupHarness.prototype.getToggles = function (filter) {
            if (filter === void 0) { filter = {}; }
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    return [2 /*return*/, this.locatorForAll(MatButtonToggleHarness.with(filter))()];
                });
            });
        };
        /** Gets whether the button toggle group is disabled. */
        MatButtonToggleGroupHarness.prototype.isDisabled = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [4 /*yield*/, (_a.sent()).getAttribute('aria-disabled')];
                        case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                    }
                });
            });
        };
        /** Gets whether the button toggle group is laid out vertically. */
        MatButtonToggleGroupHarness.prototype.isVertical = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-button-toggle-vertical')];
                    }
                });
            });
        };
        /** Gets the appearance that the group is using. */
        MatButtonToggleGroupHarness.prototype.getAppearance = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var host, className;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1:
                            host = _a.sent();
                            className = 'mat-button-toggle-group-appearance-standard';
                            return [4 /*yield*/, host.hasClass(className)];
                        case 2: return [2 /*return*/, (_a.sent()) ? 'standard' : 'legacy'];
                    }
                });
            });
        };
        /** The selector for the host element of a `MatButton` instance. */
        MatButtonToggleGroupHarness.hostSelector = 'mat-button-toggle-group';
        return MatButtonToggleGroupHarness;
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

    exports.MatButtonToggleGroupHarness = MatButtonToggleGroupHarness;
    exports.MatButtonToggleHarness = MatButtonToggleHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-button-toggle-testing.umd.js.map
