(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/material/form-field/testing/control'), require('tslib'), require('@angular/cdk/testing'), require('@angular/material/input/testing'), require('@angular/material/select/testing')) :
    typeof define === 'function' && define.amd ? define('@angular/material/form-field/testing', ['exports', '@angular/material/form-field/testing/control', 'tslib', '@angular/cdk/testing', '@angular/material/input/testing', '@angular/material/select/testing'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.formField = global.ng.material.formField || {}, global.ng.material.formField.testing = {}), global.ng.material.formField.testing.control, global.tslib, global.ng.cdk.testing, global.ng.material.input.testing, global.ng.material.select.testing));
}(this, (function (exports, control, tslib, testing, testing$1, testing$2) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Harness for interacting with a standard Material form-field's in tests. */
    var MatFormFieldHarness = /** @class */ (function (_super) {
        tslib.__extends(MatFormFieldHarness, _super);
        function MatFormFieldHarness() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._prefixContainer = _this.locatorForOptional('.mat-form-field-prefix');
            _this._suffixContainer = _this.locatorForOptional('.mat-form-field-suffix');
            _this._label = _this.locatorForOptional('.mat-form-field-label');
            _this._errors = _this.locatorForAll('.mat-error');
            _this._hints = _this.locatorForAll('mat-hint, .mat-hint');
            _this._inputControl = _this.locatorForOptional(testing$1.MatInputHarness);
            _this._selectControl = _this.locatorForOptional(testing$2.MatSelectHarness);
            return _this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatFormFieldHarness` that meets
         * certain criteria.
         * @param options Options for filtering which form field instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatFormFieldHarness.with = function (options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatFormFieldHarness, options)
                .addOption('floatingLabelText', options.floatingLabelText, function (harness, text) { return tslib.__awaiter(_this, void 0, void 0, function () { var _a, _b; return tslib.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = testing.HarnessPredicate).stringMatches;
                        return [4 /*yield*/, harness.getLabel()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent(), text])];
                }
            }); }); })
                .addOption('hasErrors', options.hasErrors, function (harness, hasErrors) { return tslib.__awaiter(_this, void 0, void 0, function () { return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, harness.hasErrors()];
                    case 1: return [2 /*return*/, (_a.sent()) === hasErrors];
                }
            }); }); });
        };
        /** Gets the appearance of the form-field. */
        MatFormFieldHarness.prototype.getAppearance = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var hostClasses, appearanceMatch;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [4 /*yield*/, (_a.sent()).getAttribute('class')];
                        case 2:
                            hostClasses = _a.sent();
                            if (hostClasses !== null) {
                                appearanceMatch = hostClasses.match(/mat-form-field-appearance-(legacy|standard|fill|outline)(?:$| )/);
                                if (appearanceMatch) {
                                    return [2 /*return*/, appearanceMatch[1]];
                                }
                            }
                            throw Error('Could not determine appearance of form-field.');
                    }
                });
            });
        };
        // Implementation of the "getControl" method overload signatures.
        MatFormFieldHarness.prototype.getControl = function (type) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var hostEl, _a, isInput, isSelect;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (type) {
                                return [2 /*return*/, this.locatorForOptional(type)()];
                            }
                            return [4 /*yield*/, this.host()];
                        case 1:
                            hostEl = _b.sent();
                            return [4 /*yield*/, Promise.all([
                                    hostEl.hasClass('mat-form-field-type-mat-input'),
                                    hostEl.hasClass('mat-form-field-type-mat-select'),
                                ])];
                        case 2:
                            _a = tslib.__read.apply(void 0, [_b.sent(), 2]), isInput = _a[0], isSelect = _a[1];
                            if (isInput) {
                                return [2 /*return*/, this._inputControl()];
                            }
                            else if (isSelect) {
                                return [2 /*return*/, this._selectControl()];
                            }
                            return [2 /*return*/, null];
                    }
                });
            });
        };
        /** Whether the form-field has a label. */
        MatFormFieldHarness.prototype.hasLabel = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-form-field-has-label')];
                    }
                });
            });
        };
        /** Gets the label of the form-field. */
        MatFormFieldHarness.prototype.getLabel = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var labelEl;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._label()];
                        case 1:
                            labelEl = _a.sent();
                            return [2 /*return*/, labelEl ? labelEl.text() : null];
                    }
                });
            });
        };
        /** Whether the form-field has a floating label. */
        MatFormFieldHarness.prototype.hasFloatingLabel = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-form-field-can-float')];
                    }
                });
            });
        };
        /** Whether the form-field has errors. */
        MatFormFieldHarness.prototype.hasErrors = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getTextErrors()];
                        case 1: return [2 /*return*/, (_a.sent()).length > 0];
                    }
                });
            });
        };
        /** Whether the label is currently floating. */
        MatFormFieldHarness.prototype.isLabelFloating = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-form-field-should-float')];
                    }
                });
            });
        };
        /** Whether the form-field is disabled. */
        MatFormFieldHarness.prototype.isDisabled = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-form-field-disabled')];
                    }
                });
            });
        };
        /** Whether the form-field is currently autofilled. */
        MatFormFieldHarness.prototype.isAutofilled = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-form-field-autofilled')];
                    }
                });
            });
        };
        /** Gets the theme color of the form-field. */
        MatFormFieldHarness.prototype.getThemeColor = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var hostEl, _a, isAccent, isWarn;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1:
                            hostEl = _b.sent();
                            return [4 /*yield*/, Promise.all([hostEl.hasClass('mat-accent'), hostEl.hasClass('mat-warn')])];
                        case 2:
                            _a = tslib.__read.apply(void 0, [_b.sent(), 2]), isAccent = _a[0], isWarn = _a[1];
                            if (isAccent) {
                                return [2 /*return*/, 'accent'];
                            }
                            else if (isWarn) {
                                return [2 /*return*/, 'warn'];
                            }
                            return [2 /*return*/, 'primary'];
                    }
                });
            });
        };
        /** Gets error messages which are currently displayed in the form-field. */
        MatFormFieldHarness.prototype.getTextErrors = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var _a, _b;
                return tslib.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = Promise).all;
                            return [4 /*yield*/, this._errors()];
                        case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()).map(function (e) { return e.text(); })])];
                    }
                });
            });
        };
        /** Gets hint messages which are currently displayed in the form-field. */
        MatFormFieldHarness.prototype.getTextHints = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var _a, _b;
                return tslib.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = Promise).all;
                            return [4 /*yield*/, this._hints()];
                        case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()).map(function (e) { return e.text(); })])];
                    }
                });
            });
        };
        /**
         * Gets a reference to the container element which contains all projected
         * prefixes of the form-field.
         */
        MatFormFieldHarness.prototype.getHarnessLoaderForPrefix = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    return [2 /*return*/, this._prefixContainer()];
                });
            });
        };
        /**
         * Gets a reference to the container element which contains all projected
         * suffixes of the form-field.
         */
        MatFormFieldHarness.prototype.getHarnessLoaderForSuffix = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    return [2 /*return*/, this._suffixContainer()];
                });
            });
        };
        /**
         * Whether the form control has been touched. Returns "null"
         * if no form control is set up.
         */
        MatFormFieldHarness.prototype.isControlTouched = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._hasFormControl()];
                        case 1:
                            if (!(_a.sent())) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.host()];
                        case 2: return [2 /*return*/, (_a.sent()).hasClass('ng-touched')];
                    }
                });
            });
        };
        /**
         * Whether the form control is dirty. Returns "null"
         * if no form control is set up.
         */
        MatFormFieldHarness.prototype.isControlDirty = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._hasFormControl()];
                        case 1:
                            if (!(_a.sent())) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.host()];
                        case 2: return [2 /*return*/, (_a.sent()).hasClass('ng-dirty')];
                    }
                });
            });
        };
        /**
         * Whether the form control is valid. Returns "null"
         * if no form control is set up.
         */
        MatFormFieldHarness.prototype.isControlValid = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._hasFormControl()];
                        case 1:
                            if (!(_a.sent())) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.host()];
                        case 2: return [2 /*return*/, (_a.sent()).hasClass('ng-valid')];
                    }
                });
            });
        };
        /**
         * Whether the form control is pending validation. Returns "null"
         * if no form control is set up.
         */
        MatFormFieldHarness.prototype.isControlPending = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._hasFormControl()];
                        case 1:
                            if (!(_a.sent())) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.host()];
                        case 2: return [2 /*return*/, (_a.sent()).hasClass('ng-pending')];
                    }
                });
            });
        };
        /** Checks whether the form-field control has set up a form control. */
        MatFormFieldHarness.prototype._hasFormControl = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var hostEl, _a, isTouched, isUntouched;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1:
                            hostEl = _b.sent();
                            return [4 /*yield*/, Promise.all([hostEl.hasClass('ng-touched'), hostEl.hasClass('ng-untouched')])];
                        case 2:
                            _a = tslib.__read.apply(void 0, [_b.sent(), 2]), isTouched = _a[0], isUntouched = _a[1];
                            return [2 /*return*/, isTouched || isUntouched];
                    }
                });
            });
        };
        MatFormFieldHarness.hostSelector = '.mat-form-field';
        return MatFormFieldHarness;
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

    Object.keys(control).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return control[k];
            }
        });
    });
    exports.MatFormFieldHarness = MatFormFieldHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-form-field-testing.umd.js.map
