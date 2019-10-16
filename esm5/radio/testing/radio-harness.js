/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/**
 * Harness for interacting with a standard mat-radio-group in tests.
 * @dynamic
 */
var MatRadioGroupHarness = /** @class */ (function (_super) {
    tslib_1.__extends(MatRadioGroupHarness, _super);
    function MatRadioGroupHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a radio-group with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a radio-group whose host element matches the given selector.
     *   - `name` finds a radio-group with specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatRadioGroupHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatRadioGroupHarness, options)
            .addOption('name', options.name, this._checkRadioGroupName);
    };
    /** Gets the name of the radio-group. */
    MatRadioGroupHarness.prototype.getName = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var hostName, radioNames;
            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getProperty('id')];
                }
            });
        });
    };
    /** Gets the checked radio-button in a radio-group. */
    MatRadioGroupHarness.prototype.getCheckedRadioButton = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, radioButton, e_1_1;
            var e_1, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 6, 7, 8]);
                        return [4 /*yield*/, this.getRadioButtons()];
                    case 1:
                        _a = tslib_1.__values.apply(void 0, [_d.sent()]), _b = _a.next();
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var checkedRadio;
            return tslib_1.__generator(this, function (_a) {
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
    /** Gets all radio buttons which are part of the radio-group. */
    MatRadioGroupHarness.prototype.getRadioButtons = function (filter) {
        if (filter === void 0) { filter = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatRadioButtonHarness.with(filter))()];
            });
        });
    };
    /** Checks a radio button in this group. */
    MatRadioGroupHarness.prototype.checkRadioButton = function (filter) {
        if (filter === void 0) { filter = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var radioButtons;
            return tslib_1.__generator(this, function (_a) {
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
    MatRadioGroupHarness.prototype._getGroupNameFromHost = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('name')];
                }
            });
        });
    };
    MatRadioGroupHarness.prototype._getNamesFromRadioButtons = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var groupNames, _a, _b, radio, radioName, e_2_1;
            var e_2, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        groupNames = [];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 7, 8, 9]);
                        return [4 /*yield*/, this.getRadioButtons()];
                    case 2:
                        _a = tslib_1.__values.apply(void 0, [_d.sent()]), _b = _a.next();
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
            for (var radioNames_1 = tslib_1.__values(radioNames), radioNames_1_1 = radioNames_1.next(); !radioNames_1_1.done; radioNames_1_1 = radioNames_1.next()) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var radioNames;
            return tslib_1.__generator(this, function (_a) {
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
    MatRadioGroupHarness.hostSelector = 'mat-radio-group';
    return MatRadioGroupHarness;
}(ComponentHarness));
export { MatRadioGroupHarness };
/**
 * Harness for interacting with a standard mat-radio-button in tests.
 * @dynamic
 */
var MatRadioButtonHarness = /** @class */ (function (_super) {
    tslib_1.__extends(MatRadioButtonHarness, _super);
    function MatRadioButtonHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._textLabel = _this.locatorFor('.mat-radio-label-content');
        _this._clickLabel = _this.locatorFor('.mat-radio-label');
        _this._input = _this.locatorFor('input');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a radio-button with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a radio-button whose host element matches the given selector.
     *   - `label` finds a radio-button with specific label text.
     *   - `name` finds a radio-button with specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatRadioButtonHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatRadioButtonHarness, options)
            .addOption('label', options.label, function (harness, label) { return HarnessPredicate.stringMatches(harness.getLabelText(), label); })
            .addOption('name', options.name, function (harness, name) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.getName()];
                case 1: return [2 /*return*/, (_a.sent()) === name];
            }
        }); }); });
    };
    /** Whether the radio-button is checked. */
    MatRadioButtonHarness.prototype.isChecked = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var checked, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._input()];
                    case 1:
                        checked = (_b.sent()).getProperty('checked');
                        _a = coerceBooleanProperty;
                        return [4 /*yield*/, checked];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    /** Whether the radio-button is disabled. */
    MatRadioButtonHarness.prototype.isDisabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var disabled, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._input()];
                    case 1:
                        disabled = (_b.sent()).getAttribute('disabled');
                        _a = coerceBooleanProperty;
                        return [4 /*yield*/, disabled];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    /** Whether the radio-button is required. */
    MatRadioButtonHarness.prototype.isRequired = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var required, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._input()];
                    case 1:
                        required = (_b.sent()).getAttribute('required');
                        _a = coerceBooleanProperty;
                        return [4 /*yield*/, required];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    /** Gets a promise for the radio-button's name. */
    MatRadioButtonHarness.prototype.getName = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._input()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('name')];
                }
            });
        });
    };
    /** Gets a promise for the radio-button's id. */
    MatRadioButtonHarness.prototype.getId = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getProperty('id')];
                }
            });
        });
    };
    /**
     * Gets the value of the radio-button. The radio-button value will be
     * converted to a string.
     *
     * Note that this means that radio-button's with objects as value will
     * intentionally have the `[object Object]` as return value.
     */
    MatRadioButtonHarness.prototype.getValue = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._input()];
                    case 1: return [2 /*return*/, (_a.sent()).getProperty('value')];
                }
            });
        });
    };
    /** Gets a promise for the radio-button's label text. */
    MatRadioButtonHarness.prototype.getLabelText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._textLabel()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /**
     * Focuses the radio-button and returns a void promise that indicates when the
     * action is complete.
     */
    MatRadioButtonHarness.prototype.focus = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._input()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /**
     * Blurs the radio-button and returns a void promise that indicates when the
     * action is complete.
     */
    MatRadioButtonHarness.prototype.blur = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._input()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /**
     * Puts the radio-button in a checked state by clicking it if it is currently unchecked,
     * or doing nothing if it is already checked. Returns a void promise that indicates when
     * the action is complete.
     */
    MatRadioButtonHarness.prototype.check = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
    MatRadioButtonHarness.hostSelector = 'mat-radio-button';
    return MatRadioButtonHarness;
}(ComponentHarness));
export { MatRadioButtonHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8taGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9yYWRpby90ZXN0aW5nL3JhZGlvLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFOzs7R0FHRztBQUNIO0lBQTBDLGdEQUFnQjtJQUExRDs7SUFvSUEsQ0FBQztJQWpJQzs7Ozs7OztPQU9HO0lBQ0kseUJBQUksR0FBWCxVQUFZLE9BQXNDO1FBQXRDLHdCQUFBLEVBQUEsWUFBc0M7UUFDaEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQzthQUNyRCxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELHdDQUF3QztJQUNsQyxzQ0FBTyxHQUFiOzs7Ozs0QkFDbUIscUJBQU0sSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUE7O3dCQUE3QyxRQUFRLEdBQUcsU0FBa0M7d0JBQ25ELCtFQUErRTt3QkFDL0UsK0VBQStFO3dCQUMvRSxrRUFBa0U7d0JBQ2xFLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTs0QkFDckIsc0JBQU8sUUFBUSxFQUFDO3lCQUNqQjt3QkFJa0IscUJBQU0sSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUE7O3dCQUFuRCxVQUFVLEdBQUcsU0FBc0M7d0JBQ3pELElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFOzRCQUN0QixzQkFBTyxJQUFJLEVBQUM7eUJBQ2I7d0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyw0QkFB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LElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBQTs0QkFBM0Isc0JBQU8sQ0FBQyxTQUFtQixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUM7Ozs7S0FDdEM7SUFFRDs7O09BR0c7SUFDRyxvQ0FBSSxHQUFWOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBQTs0QkFBM0Isc0JBQU8sQ0FBQyxTQUFtQixDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUM7Ozs7S0FDckM7SUFFRDs7OztPQUlHO0lBQ0cscUNBQUssR0FBWDs7Ozs0QkFDUSxxQkFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUE7OzZCQUF4QixDQUFDLENBQUMsU0FBc0IsQ0FBQyxFQUF6Qix3QkFBeUI7d0JBQ25CLHFCQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBQTs0QkFBaEMsc0JBQU8sQ0FBQyxTQUF3QixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUM7Ozs7O0tBRTdDO0lBN0ZNLGtDQUFZLEdBQUcsa0JBQWtCLENBQUM7SUE4RjNDLDRCQUFDO0NBQUEsQUEvRkQsQ0FBMkMsZ0JBQWdCLEdBK0YxRDtTQS9GWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7UmFkaW9CdXR0b25IYXJuZXNzRmlsdGVycywgUmFkaW9Hcm91cEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3JhZGlvLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1yYWRpby1ncm91cCBpbiB0ZXN0cy5cbiAqIEBkeW5hbWljXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRSYWRpb0dyb3VwSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1yYWRpby1ncm91cCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgcmFkaW8tZ3JvdXAgd2l0aFxuICAgKiBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSByYWRpby1ncm91cCB3aG9zZSBob3N0IGVsZW1lbnQgbWF0Y2hlcyB0aGUgZ2l2ZW4gc2VsZWN0b3IuXG4gICAqICAgLSBgbmFtZWAgZmluZHMgYSByYWRpby1ncm91cCB3aXRoIHNwZWNpZmljIG5hbWUuXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUmFkaW9Hcm91cEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFJhZGlvR3JvdXBIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFJhZGlvR3JvdXBIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCduYW1lJywgb3B0aW9ucy5uYW1lLCB0aGlzLl9jaGVja1JhZGlvR3JvdXBOYW1lKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgY29uc3QgaG9zdE5hbWUgPSBhd2FpdCB0aGlzLl9nZXRHcm91cE5hbWVGcm9tSG9zdCgpO1xuICAgIC8vIEl0J3Mgbm90IHBvc3NpYmxlIHRvIGFsd2F5cyBkZXRlcm1pbmUgdGhlIFwibmFtZVwiIG9mIGEgcmFkaW8tZ3JvdXAgYnkgcmVhZGluZ1xuICAgIC8vIHRoZSBhdHRyaWJ1dGUuIFRoaXMgaXMgYmVjYXVzZSB0aGUgcmFkaW8tZ3JvdXAgZG9lcyBub3Qgc2V0IHRoZSBcIm5hbWVcIiBhcyBhblxuICAgIC8vIGVsZW1lbnQgYXR0cmlidXRlIGlmIHRoZSBcIm5hbWVcIiB2YWx1ZSBpcyBzZXQgdGhyb3VnaCBhIGJpbmRpbmcuXG4gICAgaWYgKGhvc3ROYW1lICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaG9zdE5hbWU7XG4gICAgfVxuICAgIC8vIEluIGNhc2Ugd2UgY291bGRuJ3QgZGV0ZXJtaW5lIHRoZSBcIm5hbWVcIiBvZiBhIHJhZGlvLWdyb3VwIGJ5IHJlYWRpbmcgdGhlXG4gICAgLy8gXCJuYW1lXCIgYXR0cmlidXRlLCB3ZSB0cnkgdG8gZGV0ZXJtaW5lIHRoZSBcIm5hbWVcIiBvZiB0aGUgZ3JvdXAgYnkgZ29pbmdcbiAgICAvLyB0aHJvdWdoIGFsbCByYWRpbyBidXR0b25zLlxuICAgIGNvbnN0IHJhZGlvTmFtZXMgPSBhd2FpdCB0aGlzLl9nZXROYW1lc0Zyb21SYWRpb0J1dHRvbnMoKTtcbiAgICBpZiAoIXJhZGlvTmFtZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9jaGVja1JhZGlvTmFtZXNJbkdyb3VwRXF1YWwocmFkaW9OYW1lcykpIHtcbiAgICAgIHRocm93IEVycm9yKCdSYWRpbyBidXR0b25zIGluIHJhZGlvLWdyb3VwIGhhdmUgbWlzbWF0Y2hpbmcgbmFtZXMuJyk7XG4gICAgfVxuICAgIHJldHVybiByYWRpb05hbWVzWzBdITtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpZCBvZiB0aGUgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldElkKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnaWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjaGVja2VkIHJhZGlvLWJ1dHRvbiBpbiBhIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXRDaGVja2VkUmFkaW9CdXR0b24oKTogUHJvbWlzZTxNYXRSYWRpb0J1dHRvbkhhcm5lc3N8bnVsbD4ge1xuICAgIGZvciAobGV0IHJhZGlvQnV0dG9uIG9mIGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKCkpIHtcbiAgICAgIGlmIChhd2FpdCByYWRpb0J1dHRvbi5pc0NoZWNrZWQoKSkge1xuICAgICAgICByZXR1cm4gcmFkaW9CdXR0b247XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGNoZWNrZWQgdmFsdWUgb2YgdGhlIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXRDaGVja2VkVmFsdWUoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIGNvbnN0IGNoZWNrZWRSYWRpbyA9IGF3YWl0IHRoaXMuZ2V0Q2hlY2tlZFJhZGlvQnV0dG9uKCk7XG4gICAgaWYgKCFjaGVja2VkUmFkaW8pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY2hlY2tlZFJhZGlvLmdldFZhbHVlKCk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgcmFkaW8gYnV0dG9ucyB3aGljaCBhcmUgcGFydCBvZiB0aGUgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldFJhZGlvQnV0dG9ucyhmaWx0ZXI6IFJhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0UmFkaW9CdXR0b25IYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdFJhZGlvQnV0dG9uSGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIGEgcmFkaW8gYnV0dG9uIGluIHRoaXMgZ3JvdXAuICovXG4gIGFzeW5jIGNoZWNrUmFkaW9CdXR0b24oZmlsdGVyOiBSYWRpb0J1dHRvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCByYWRpb0J1dHRvbnMgPSBhd2FpdCB0aGlzLmdldFJhZGlvQnV0dG9ucyhmaWx0ZXIpO1xuICAgIGlmICghcmFkaW9CdXR0b25zLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHJhZGlvIGJ1dHRvbiBtYXRjaGluZyAke0pTT04uc3RyaW5naWZ5KGZpbHRlcil9YCk7XG4gICAgfVxuICAgIHJldHVybiByYWRpb0J1dHRvbnNbMF0uY2hlY2soKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX2dldEdyb3VwTmFtZUZyb21Ib3N0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0TmFtZXNGcm9tUmFkaW9CdXR0b25zKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCBncm91cE5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IHJhZGlvIG9mIGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKCkpIHtcbiAgICAgIGNvbnN0IHJhZGlvTmFtZSA9IGF3YWl0IHJhZGlvLmdldE5hbWUoKTtcbiAgICAgIGlmIChyYWRpb05hbWUgIT09IG51bGwpIHtcbiAgICAgICAgZ3JvdXBOYW1lcy5wdXNoKHJhZGlvTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBncm91cE5hbWVzO1xuICB9XG5cbiAgLyoqIENoZWNrcyBpZiB0aGUgc3BlY2lmaWVkIHJhZGlvIG5hbWVzIGFyZSBhbGwgZXF1YWwuICovXG4gIHByaXZhdGUgX2NoZWNrUmFkaW9OYW1lc0luR3JvdXBFcXVhbChyYWRpb05hbWVzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGxldCBncm91cE5hbWU6IHN0cmluZ3xudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCByYWRpb05hbWUgb2YgcmFkaW9OYW1lcykge1xuICAgICAgaWYgKGdyb3VwTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICBncm91cE5hbWUgPSByYWRpb05hbWU7XG4gICAgICB9IGVsc2UgaWYgKGdyb3VwTmFtZSAhPT0gcmFkaW9OYW1lKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgcmFkaW8tZ3JvdXAgaGFybmVzcyBoYXMgdGhlIGdpdmVuIG5hbWUuIFRocm93cyBpZiBhIHJhZGlvLWdyb3VwIHdpdGhcbiAgICogbWF0Y2hpbmcgbmFtZSBjb3VsZCBiZSBmb3VuZCBidXQgaGFzIG1pc21hdGNoaW5nIHJhZGlvLWJ1dHRvbiBuYW1lcy5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGFzeW5jIF9jaGVja1JhZGlvR3JvdXBOYW1lKGhhcm5lc3M6IE1hdFJhZGlvR3JvdXBIYXJuZXNzLCBuYW1lOiBzdHJpbmcpIHtcbiAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIHJhZGlvLWdyb3VwIHdoaWNoIGhhcyB0aGUgXCJuYW1lXCIgYXR0cmlidXRlIHNldFxuICAgIC8vIHRvIHRoZSBleHBlY3RlZCBncm91cCBuYW1lLiBJdCdzIG5vdCBwb3NzaWJsZSB0byBhbHdheXMgZGV0ZXJtaW5lXG4gICAgLy8gdGhlIFwibmFtZVwiIG9mIGEgcmFkaW8tZ3JvdXAgYnkgcmVhZGluZyB0aGUgYXR0cmlidXRlLiBUaGlzIGlzIGJlY2F1c2VcbiAgICAvLyB0aGUgcmFkaW8tZ3JvdXAgZG9lcyBub3Qgc2V0IHRoZSBcIm5hbWVcIiBhcyBhbiBlbGVtZW50IGF0dHJpYnV0ZSBpZiB0aGVcbiAgICAvLyBcIm5hbWVcIiB2YWx1ZSBpcyBzZXQgdGhyb3VnaCBhIGJpbmRpbmcuXG4gICAgaWYgKGF3YWl0IGhhcm5lc3MuX2dldEdyb3VwTmFtZUZyb21Ib3N0KCkgPT09IG5hbWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIGdyb3VwIHdpdGggcmFkaW8tYnV0dG9ucyB0aGF0IGFsbCBoYXZlIHRoZSBzYW1lXG4gICAgLy8gZXhwZWN0ZWQgbmFtZS4gVGhpcyBpbXBsaWVzIHRoYXQgdGhlIGdyb3VwIGhhcyB0aGUgZ2l2ZW4gbmFtZS4gSXQnc1xuICAgIC8vIG5vdCBwb3NzaWJsZSB0byBhbHdheXMgZGV0ZXJtaW5lIHRoZSBuYW1lIG9mIGEgcmFkaW8tZ3JvdXAgdGhyb3VnaFxuICAgIC8vIHRoZSBhdHRyaWJ1dGUgYmVjYXVzZSB0aGVyZSBpc1xuICAgIGNvbnN0IHJhZGlvTmFtZXMgPSBhd2FpdCBoYXJuZXNzLl9nZXROYW1lc0Zyb21SYWRpb0J1dHRvbnMoKTtcbiAgICBpZiAocmFkaW9OYW1lcy5pbmRleE9mKG5hbWUpID09PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWhhcm5lc3MuX2NoZWNrUmFkaW9OYW1lc0luR3JvdXBFcXVhbChyYWRpb05hbWVzKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgYFRoZSBsb2NhdG9yIGZvdW5kIGEgcmFkaW8tZ3JvdXAgd2l0aCBuYW1lIFwiJHtuYW1lfVwiLCBidXQgc29tZSBgICtcbiAgICAgICAgICBgcmFkaW8tYnV0dG9uJ3Mgd2l0aGluIHRoZSBncm91cCBoYXZlIG1pc21hdGNoaW5nIG5hbWVzLCB3aGljaCBpcyBpbnZhbGlkLmApO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtcmFkaW8tYnV0dG9uIGluIHRlc3RzLlxuICogQGR5bmFtaWNcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdFJhZGlvQnV0dG9uSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1yYWRpby1idXR0b24nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHJhZGlvLWJ1dHRvbiB3aXRoXG4gICAqIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoOlxuICAgKiAgIC0gYHNlbGVjdG9yYCBmaW5kcyBhIHJhZGlvLWJ1dHRvbiB3aG9zZSBob3N0IGVsZW1lbnQgbWF0Y2hlcyB0aGUgZ2l2ZW4gc2VsZWN0b3IuXG4gICAqICAgLSBgbGFiZWxgIGZpbmRzIGEgcmFkaW8tYnV0dG9uIHdpdGggc3BlY2lmaWMgbGFiZWwgdGV4dC5cbiAgICogICAtIGBuYW1lYCBmaW5kcyBhIHJhZGlvLWJ1dHRvbiB3aXRoIHNwZWNpZmljIG5hbWUuXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUmFkaW9CdXR0b25IYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRSYWRpb0J1dHRvbkhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0UmFkaW9CdXR0b25IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAgICAgJ2xhYmVsJywgb3B0aW9ucy5sYWJlbCxcbiAgICAgICAgICAgIChoYXJuZXNzLCBsYWJlbCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWxUZXh0KCksIGxhYmVsKSlcbiAgICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgICAgICduYW1lJywgb3B0aW9ucy5uYW1lLCBhc3luYyAoaGFybmVzcywgbmFtZSkgPT4gKGF3YWl0IGhhcm5lc3MuZ2V0TmFtZSgpKSA9PT0gbmFtZSk7XG4gIH1cblxuICBwcml2YXRlIF90ZXh0TGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtcmFkaW8tbGFiZWwtY29udGVudCcpO1xuICBwcml2YXRlIF9jbGlja0xhYmVsID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXJhZGlvLWxhYmVsJyk7XG4gIHByaXZhdGUgX2lucHV0ID0gdGhpcy5sb2NhdG9yRm9yKCdpbnB1dCcpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgY2hlY2tlZC4gKi9cbiAgYXN5bmMgaXNDaGVja2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGNoZWNrZWQgPSAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0UHJvcGVydHkoJ2NoZWNrZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGNoZWNrZWQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvLWJ1dHRvbiBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8tYnV0dG9uIGlzIHJlcXVpcmVkLiAqL1xuICBhc3luYyBpc1JlcXVpcmVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHJlcXVpcmVkID0gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IHJlcXVpcmVkKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHJhZGlvLWJ1dHRvbidzIG5hbWUuICovXG4gIGFzeW5jIGdldE5hbWUoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSByYWRpby1idXR0b24ncyBpZC4gKi9cbiAgYXN5bmMgZ2V0SWQoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5KCdpZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSByYWRpby1idXR0b24uIFRoZSByYWRpby1idXR0b24gdmFsdWUgd2lsbCBiZVxuICAgKiBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGlzIG1lYW5zIHRoYXQgcmFkaW8tYnV0dG9uJ3Mgd2l0aCBvYmplY3RzIGFzIHZhbHVlIHdpbGxcbiAgICogaW50ZW50aW9uYWxseSBoYXZlIHRoZSBgW29iamVjdCBPYmplY3RdYCBhcyByZXR1cm4gdmFsdWUuXG4gICAqL1xuICBhc3luYyBnZXRWYWx1ZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRQcm9wZXJ0eSgndmFsdWUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHJhZGlvLWJ1dHRvbidzIGxhYmVsIHRleHQuICovXG4gIGFzeW5jIGdldExhYmVsVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fdGV4dExhYmVsKCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSByYWRpby1idXR0b24gYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGVcbiAgICogYWN0aW9uIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJsdXJzIHRoZSByYWRpby1idXR0b24gYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGVcbiAgICogYWN0aW9uIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdXRzIHRoZSByYWRpby1idXR0b24gaW4gYSBjaGVja2VkIHN0YXRlIGJ5IGNsaWNraW5nIGl0IGlmIGl0IGlzIGN1cnJlbnRseSB1bmNoZWNrZWQsXG4gICAqIG9yIGRvaW5nIG5vdGhpbmcgaWYgaXQgaXMgYWxyZWFkeSBjaGVja2VkLiBSZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW5cbiAgICogdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS5cbiAgICovXG4gIGFzeW5jIGNoZWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuaXNDaGVja2VkKCkpKSB7XG4gICAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2NsaWNrTGFiZWwoKSkuY2xpY2soKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==