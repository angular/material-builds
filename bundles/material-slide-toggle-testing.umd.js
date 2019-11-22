(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/testing'), require('@angular/cdk/coercion')) :
    typeof define === 'function' && define.amd ? define('@angular/material/slide-toggle/testing', ['exports', 'tslib', '@angular/cdk/testing', '@angular/cdk/coercion'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.slideToggle = global.ng.material.slideToggle || {}, global.ng.material.slideToggle.testing = {}), global.tslib, global.ng.cdk.testing, global.ng.cdk.coercion));
}(this, (function (exports, tslib, testing, coercion) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Harness for interacting with a standard mat-slide-toggle in tests. */
    var MatSlideToggleHarness = /** @class */ (function (_super) {
        tslib.__extends(MatSlideToggleHarness, _super);
        function MatSlideToggleHarness() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._label = _this.locatorFor('label');
            _this._input = _this.locatorFor('input');
            _this._inputContainer = _this.locatorFor('.mat-slide-toggle-bar');
            return _this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatSlideToggleHarness` that meets
         * certain criteria.
         * @param options Options for filtering which slide toggle instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatSlideToggleHarness.with = function (options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatSlideToggleHarness, options)
                .addOption('label', options.label, function (harness, label) { return testing.HarnessPredicate.stringMatches(harness.getLabelText(), label); })
                // We want to provide a filter option for "name" because the name of the slide-toggle is
                // only set on the underlying input. This means that it's not possible for developers
                // to retrieve the harness of a specific checkbox with name through a CSS selector.
                .addOption('name', options.name, function (harness, name) { return tslib.__awaiter(_this, void 0, void 0, function () { return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, harness.getName()];
                    case 1: return [2 /*return*/, (_a.sent()) === name];
                }
            }); }); });
        };
        /** Whether the slide-toggle is checked. */
        MatSlideToggleHarness.prototype.isChecked = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var checked, _a;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1:
                            checked = (_b.sent()).getProperty('checked');
                            _a = coercion.coerceBooleanProperty;
                            return [4 /*yield*/, checked];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Whether the slide-toggle is disabled. */
        MatSlideToggleHarness.prototype.isDisabled = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var disabled, _a;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1:
                            disabled = (_b.sent()).getAttribute('disabled');
                            _a = coercion.coerceBooleanProperty;
                            return [4 /*yield*/, disabled];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Whether the slide-toggle is required. */
        MatSlideToggleHarness.prototype.isRequired = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var required, _a;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1:
                            required = (_b.sent()).getAttribute('required');
                            _a = coercion.coerceBooleanProperty;
                            return [4 /*yield*/, required];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Whether the slide-toggle is valid. */
        MatSlideToggleHarness.prototype.isValid = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var invalid;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1:
                            invalid = (_a.sent()).hasClass('ng-invalid');
                            return [4 /*yield*/, invalid];
                        case 2: return [2 /*return*/, !(_a.sent())];
                    }
                });
            });
        };
        /** Gets the slide-toggle's name. */
        MatSlideToggleHarness.prototype.getName = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1: return [2 /*return*/, (_a.sent()).getAttribute('name')];
                    }
                });
            });
        };
        /** Gets the slide-toggle's aria-label. */
        MatSlideToggleHarness.prototype.getAriaLabel = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-label')];
                    }
                });
            });
        };
        /** Gets the slide-toggle's aria-labelledby. */
        MatSlideToggleHarness.prototype.getAriaLabelledby = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-labelledby')];
                    }
                });
            });
        };
        /** Gets the slide-toggle's label text. */
        MatSlideToggleHarness.prototype.getLabelText = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._label()];
                        case 1: return [2 /*return*/, (_a.sent()).text()];
                    }
                });
            });
        };
        /** Focuses the slide-toggle. */
        MatSlideToggleHarness.prototype.focus = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1: return [2 /*return*/, (_a.sent()).focus()];
                    }
                });
            });
        };
        /** Blurs the slide-toggle. */
        MatSlideToggleHarness.prototype.blur = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1: return [2 /*return*/, (_a.sent()).blur()];
                    }
                });
            });
        };
        /** Toggle the checked state of the slide-toggle. */
        MatSlideToggleHarness.prototype.toggle = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._inputContainer()];
                        case 1: return [2 /*return*/, (_a.sent()).click()];
                    }
                });
            });
        };
        /**
         * Puts the slide-toggle in a checked state by toggling it if it is currently unchecked, or doing
         * nothing if it is already checked.
         */
        MatSlideToggleHarness.prototype.check = function () {
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
         * Puts the slide-toggle in an unchecked state by toggling it if it is currently checked, or doing
         * nothing if it is already unchecked.
         */
        MatSlideToggleHarness.prototype.uncheck = function () {
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
        /** The selector for the host element of a `MatSlideToggle` instance. */
        MatSlideToggleHarness.hostSelector = 'mat-slide-toggle';
        return MatSlideToggleHarness;
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

    exports.MatSlideToggleHarness = MatSlideToggleHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-slide-toggle-testing.umd.js.map
