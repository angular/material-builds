(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/coercion'), require('@angular/cdk/testing')) :
    typeof define === 'function' && define.amd ? define('@angular/material/radio/testing', ['exports', 'tslib', '@angular/cdk/coercion', '@angular/cdk/testing'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.radio = global.ng.material.radio || {}, global.ng.material.radio.testing = {}), global.tslib, global.ng.cdk.coercion, global.ng.cdk.testing));
}(this, (function (exports, tslib, coercion, testing) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Harness for interacting with a standard mat-radio-group in tests. */
    var MatRadioGroupHarness = /** @class */ (function (_super) {
        tslib.__extends(MatRadioGroupHarness, _super);
        function MatRadioGroupHarness() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatRadioGroupHarness` that meets
         * certain criteria.
         * @param options Options for filtering which radio group instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatRadioGroupHarness.with = function (options) {
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatRadioGroupHarness, options)
                .addOption('name', options.name, this._checkRadioGroupName);
        };
        /** Gets the name of the radio-group. */
        MatRadioGroupHarness.prototype.getName = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var hostName, radioNames;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._getGroupNameFromHost()];
                        case 1:
                            hostName = _a.sent();
                            // It's not possible to always determine the "name" of a radio-group by reading
                            // the attribute. This is because the radio-group does not set the "name" as an
                            // element attribute if the "name" value is set through a binding.
                            if (hostName !== null) {
                                return [2 /*return*/, hostName];
                            }
                            return [4 /*yield*/, this._getNamesFromRadioButtons()];
                        case 2:
                            radioNames = _a.sent();
                            if (!radioNames.length) {
                                return [2 /*return*/, null];
                            }
                            if (!this._checkRadioNamesInGroupEqual(radioNames)) {
                                throw Error('Radio buttons in radio-group have mismatching names.');
                            }
                            return [2 /*return*/, radioNames[0]];
                    }
                });
            });
        };
        /** Gets the id of the radio-group. */
        MatRadioGroupHarness.prototype.getId = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).getProperty('id')];
                    }
                });
            });
        };
        /** Gets the checked radio-button in a radio-group. */
        MatRadioGroupHarness.prototype.getCheckedRadioButton = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var _a, _b, radioButton, e_1_1;
                var e_1, _c;
                return tslib.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 6, 7, 8]);
                            return [4 /*yield*/, this.getRadioButtons()];
                        case 1:
                            _a = tslib.__values.apply(void 0, [_d.sent()]), _b = _a.next();
                            _d.label = 2;
                        case 2:
                            if (!!_b.done) return [3 /*break*/, 5];
                            radioButton = _b.value;
                            return [4 /*yield*/, radioButton.isChecked()];
                        case 3:
                            if (_d.sent()) {
                                return [2 /*return*/, radioButton];
                            }
                            _d.label = 4;
                        case 4:
                            _b = _a.next();
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_1_1 = _d.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/, null];
                    }
                });
            });
        };
        /** Gets the checked value of the radio-group. */
        MatRadioGroupHarness.prototype.getCheckedValue = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var checkedRadio;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getCheckedRadioButton()];
                        case 1:
                            checkedRadio = _a.sent();
                            if (!checkedRadio) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, checkedRadio.getValue()];
                    }
                });
            });
        };
        /**
         * Gets a list of radio buttons which are part of the radio-group.
         * @param filter Optionally filters which radio buttons are included.
         */
        MatRadioGroupHarness.prototype.getRadioButtons = function (filter) {
            if (filter === void 0) { filter = {}; }
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    return [2 /*return*/, this.locatorForAll(MatRadioButtonHarness.with(filter))()];
                });
            });
        };
        /**
         * Checks a radio button in this group.
         * @param filter An optional filter to apply to the child radio buttons. The first tab matching
         *     the filter will be selected.
         */
        MatRadioGroupHarness.prototype.checkRadioButton = function (filter) {
            if (filter === void 0) { filter = {}; }
            return tslib.__awaiter(this, void 0, void 0, function () {
                var radioButtons;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getRadioButtons(filter)];
                        case 1:
                            radioButtons = _a.sent();
                            if (!radioButtons.length) {
                                throw Error("Could not find radio button matching " + JSON.stringify(filter));
                            }
                            return [2 /*return*/, radioButtons[0].check()];
                    }
                });
            });
        };
        /** Gets the name attribute of the host element. */
        MatRadioGroupHarness.prototype._getGroupNameFromHost = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).getAttribute('name')];
                    }
                });
            });
        };
        /** Gets a list of the name attributes of all child radio buttons. */
        MatRadioGroupHarness.prototype._getNamesFromRadioButtons = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var groupNames, _a, _b, radio, radioName, e_2_1;
                var e_2, _c;
                return tslib.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            groupNames = [];
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 7, 8, 9]);
                            return [4 /*yield*/, this.getRadioButtons()];
                        case 2:
                            _a = tslib.__values.apply(void 0, [_d.sent()]), _b = _a.next();
                            _d.label = 3;
                        case 3:
                            if (!!_b.done) return [3 /*break*/, 6];
                            radio = _b.value;
                            return [4 /*yield*/, radio.getName()];
                        case 4:
                            radioName = _d.sent();
                            if (radioName !== null) {
                                groupNames.push(radioName);
                            }
                            _d.label = 5;
                        case 5:
                            _b = _a.next();
                            return [3 /*break*/, 3];
                        case 6: return [3 /*break*/, 9];
                        case 7:
                            e_2_1 = _d.sent();
                            e_2 = { error: e_2_1 };
                            return [3 /*break*/, 9];
                        case 8:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_2) throw e_2.error; }
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/, groupNames];
                    }
                });
            });
        };
        /** Checks if the specified radio names are all equal. */
        MatRadioGroupHarness.prototype._checkRadioNamesInGroupEqual = function (radioNames) {
            var e_3, _a;
            var groupName = null;
            try {
                for (var radioNames_1 = tslib.__values(radioNames), radioNames_1_1 = radioNames_1.next(); !radioNames_1_1.done; radioNames_1_1 = radioNames_1.next()) {
                    var radioName = radioNames_1_1.value;
                    if (groupName === null) {
                        groupName = radioName;
                    }
                    else if (groupName !== radioName) {
                        return false;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (radioNames_1_1 && !radioNames_1_1.done && (_a = radioNames_1.return)) _a.call(radioNames_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return true;
        };
        /**
         * Checks if a radio-group harness has the given name. Throws if a radio-group with
         * matching name could be found but has mismatching radio-button names.
         */
        MatRadioGroupHarness._checkRadioGroupName = function (harness, name) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var radioNames;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, harness._getGroupNameFromHost()];
                        case 1:
                            // Check if there is a radio-group which has the "name" attribute set
                            // to the expected group name. It's not possible to always determine
                            // the "name" of a radio-group by reading the attribute. This is because
                            // the radio-group does not set the "name" as an element attribute if the
                            // "name" value is set through a binding.
                            if ((_a.sent()) === name) {
                                return [2 /*return*/, true];
                            }
                            return [4 /*yield*/, harness._getNamesFromRadioButtons()];
                        case 2:
                            radioNames = _a.sent();
                            if (radioNames.indexOf(name) === -1) {
                                return [2 /*return*/, false];
                            }
                            if (!harness._checkRadioNamesInGroupEqual(radioNames)) {
                                throw Error("The locator found a radio-group with name \"" + name + "\", but some " +
                                    "radio-button's within the group have mismatching names, which is invalid.");
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        /** The selector for the host element of a `MatRadioGroup` instance. */
        MatRadioGroupHarness.hostSelector = 'mat-radio-group';
        return MatRadioGroupHarness;
    }(testing.ComponentHarness));
    /** Harness for interacting with a standard mat-radio-button in tests. */
    var MatRadioButtonHarness = /** @class */ (function (_super) {
        tslib.__extends(MatRadioButtonHarness, _super);
        function MatRadioButtonHarness() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._textLabel = _this.locatorFor('.mat-radio-label-content');
            _this._clickLabel = _this.locatorFor('.mat-radio-label');
            _this._input = _this.locatorFor('input');
            return _this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatRadioButtonHarness` that meets
         * certain criteria.
         * @param options Options for filtering which radio button instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatRadioButtonHarness.with = function (options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatRadioButtonHarness, options)
                .addOption('label', options.label, function (harness, label) { return testing.HarnessPredicate.stringMatches(harness.getLabelText(), label); })
                .addOption('name', options.name, function (harness, name) { return tslib.__awaiter(_this, void 0, void 0, function () { return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, harness.getName()];
                    case 1: return [2 /*return*/, (_a.sent()) === name];
                }
            }); }); });
        };
        /** Whether the radio-button is checked. */
        MatRadioButtonHarness.prototype.isChecked = function () {
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
        /** Whether the radio-button is disabled. */
        MatRadioButtonHarness.prototype.isDisabled = function () {
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
        /** Whether the radio-button is required. */
        MatRadioButtonHarness.prototype.isRequired = function () {
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
        /** Gets the radio-button's name. */
        MatRadioButtonHarness.prototype.getName = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1: return [2 /*return*/, (_a.sent()).getAttribute('name')];
                    }
                });
            });
        };
        /** Gets the radio-button's id. */
        MatRadioButtonHarness.prototype.getId = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).getProperty('id')];
                    }
                });
            });
        };
        /**
         * Gets the value of the radio-button. The radio-button value will be converted to a string.
         *
         * Note: This means that for radio-button's with an object as a value `[object Object]` is
         * intentionally returned.
         */
        MatRadioButtonHarness.prototype.getValue = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1: return [2 /*return*/, (_a.sent()).getProperty('value')];
                    }
                });
            });
        };
        /** Gets the radio-button's label text. */
        MatRadioButtonHarness.prototype.getLabelText = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._textLabel()];
                        case 1: return [2 /*return*/, (_a.sent()).text()];
                    }
                });
            });
        };
        /** Focuses the radio-button. */
        MatRadioButtonHarness.prototype.focus = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1: return [2 /*return*/, (_a.sent()).focus()];
                    }
                });
            });
        };
        /** Blurs the radio-button. */
        MatRadioButtonHarness.prototype.blur = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1: return [2 /*return*/, (_a.sent()).blur()];
                    }
                });
            });
        };
        /**
         * Puts the radio-button in a checked state by clicking it if it is currently unchecked,
         * or doing nothing if it is already checked.
         */
        MatRadioButtonHarness.prototype.check = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isChecked()];
                        case 1:
                            if (!!(_a.sent())) return [3 /*break*/, 3];
                            return [4 /*yield*/, this._clickLabel()];
                        case 2: return [2 /*return*/, (_a.sent()).click()];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /** The selector for the host element of a `MatRadioButton` instance. */
        MatRadioButtonHarness.hostSelector = 'mat-radio-button';
        return MatRadioButtonHarness;
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

    exports.MatRadioButtonHarness = MatRadioButtonHarness;
    exports.MatRadioGroupHarness = MatRadioGroupHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-radio-testing.umd.js.map
