/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator, __values } from "tslib";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-radio-group in tests. */
var MatRadioGroupHarness = /** @class */ (function (_super) {
    __extends(MatRadioGroupHarness, _super);
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
        return new HarnessPredicate(MatRadioGroupHarness, options)
            .addOption('name', options.name, this._checkRadioGroupName);
    };
    /** Gets the name of the radio-group. */
    MatRadioGroupHarness.prototype.getName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hostName, radioNames;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getProperty('id')];
                }
            });
        });
    };
    /** Gets the checked radio-button in a radio-group. */
    MatRadioGroupHarness.prototype.getCheckedRadioButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, radioButton, e_1_1;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 6, 7, 8]);
                        return [4 /*yield*/, this.getRadioButtons()];
                    case 1:
                        _a = __values.apply(void 0, [_d.sent()]), _b = _a.next();
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
        return __awaiter(this, void 0, void 0, function () {
            var checkedRadio;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var radioButtons;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('name')];
                }
            });
        });
    };
    /** Gets a list of the name attributes of all child radio buttons. */
    MatRadioGroupHarness.prototype._getNamesFromRadioButtons = function () {
        return __awaiter(this, void 0, void 0, function () {
            var groupNames, _a, _b, radio, radioName, e_2_1;
            var e_2, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        groupNames = [];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 7, 8, 9]);
                        return [4 /*yield*/, this.getRadioButtons()];
                    case 2:
                        _a = __values.apply(void 0, [_d.sent()]), _b = _a.next();
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
            for (var radioNames_1 = __values(radioNames), radioNames_1_1 = radioNames_1.next(); !radioNames_1_1.done; radioNames_1_1 = radioNames_1.next()) {
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
        return __awaiter(this, void 0, void 0, function () {
            var radioNames;
            return __generator(this, function (_a) {
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
}(ComponentHarness));
export { MatRadioGroupHarness };
/** Harness for interacting with a standard mat-radio-button in tests. */
var MatRadioButtonHarness = /** @class */ (function (_super) {
    __extends(MatRadioButtonHarness, _super);
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
        return new HarnessPredicate(MatRadioButtonHarness, options)
            .addOption('label', options.label, function (harness, label) { return HarnessPredicate.stringMatches(harness.getLabelText(), label); })
            .addOption('name', options.name, function (harness, name) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.getName()];
                case 1: return [2 /*return*/, (_a.sent()) === name];
            }
        }); }); });
    };
    /** Whether the radio-button is checked. */
    MatRadioButtonHarness.prototype.isChecked = function () {
        return __awaiter(this, void 0, void 0, function () {
            var checked, _a;
            return __generator(this, function (_b) {
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
        return __awaiter(this, void 0, void 0, function () {
            var disabled, _a;
            return __generator(this, function (_b) {
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
        return __awaiter(this, void 0, void 0, function () {
            var required, _a;
            return __generator(this, function (_b) {
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
    /** Gets the radio-button's name. */
    MatRadioButtonHarness.prototype.getName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._input()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('name')];
                }
            });
        });
    };
    /** Gets the radio-button's id. */
    MatRadioButtonHarness.prototype.getId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._input()];
                    case 1: return [2 /*return*/, (_a.sent()).getProperty('value')];
                }
            });
        });
    };
    /** Gets the radio-button's label text. */
    MatRadioButtonHarness.prototype.getLabelText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._textLabel()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Focuses the radio-button. */
    MatRadioButtonHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._input()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the radio-button. */
    MatRadioButtonHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
}(ComponentHarness));
export { MatRadioButtonHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8taGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9yYWRpby90ZXN0aW5nL3JhZGlvLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFLHdFQUF3RTtBQUN4RTtJQUEwQyx3Q0FBZ0I7SUFBMUQ7O0lBNElBLENBQUM7SUF4SUM7Ozs7O09BS0c7SUFDSSx5QkFBSSxHQUFYLFVBQVksT0FBc0M7UUFBdEMsd0JBQUEsRUFBQSxZQUFzQztRQUNoRCxPQUFPLElBQUksZ0JBQWdCLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDO2FBQ3JELFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsd0NBQXdDO0lBQ2xDLHNDQUFPLEdBQWI7Ozs7OzRCQUNtQixxQkFBTSxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBQTs7d0JBQTdDLFFBQVEsR0FBRyxTQUFrQzt3QkFDbkQsK0VBQStFO3dCQUMvRSwrRUFBK0U7d0JBQy9FLGtFQUFrRTt3QkFDbEUsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFOzRCQUNyQixzQkFBTyxRQUFRLEVBQUM7eUJBQ2pCO3dCQUlrQixxQkFBTSxJQUFJLENBQUMseUJBQXlCLEVBQUUsRUFBQTs7d0JBQW5ELFVBQVUsR0FBRyxTQUFzQzt3QkFDekQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7NEJBQ3RCLHNCQUFPLElBQUksRUFBQzt5QkFDYjt3QkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLDRCQUE0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Z0M7SUFDMUIscUNBQUssR0FBWDs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUE7NEJBQTNCLHNCQUFPLENBQUMsU0FBbUIsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFDOzs7O0tBQ3RDO0lBRUQsOEJBQThCO0lBQ3hCLG9DQUFJLEdBQVY7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFBOzRCQUEzQixzQkFBTyxDQUFDLFNBQW1CLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQzs7OztLQUNyQztJQUVEOzs7T0FHRztJQUNHLHFDQUFLLEdBQVg7Ozs7NEJBQ1EscUJBQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFBOzs2QkFBeEIsQ0FBQyxDQUFDLFNBQXNCLENBQUMsRUFBekIsd0JBQXlCO3dCQUNuQixxQkFBTSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUE7NEJBQWhDLHNCQUFPLENBQUMsU0FBd0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFDOzs7OztLQUU3QztJQW5GRCx3RUFBd0U7SUFDakUsa0NBQVksR0FBRyxrQkFBa0IsQ0FBQztJQW1GM0MsNEJBQUM7Q0FBQSxBQXJGRCxDQUEyQyxnQkFBZ0IsR0FxRjFEO1NBckZZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtSYWRpb0J1dHRvbkhhcm5lc3NGaWx0ZXJzLCBSYWRpb0dyb3VwSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vcmFkaW8taGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtcmFkaW8tZ3JvdXAgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9Hcm91cEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRSYWRpb0dyb3VwYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICdtYXQtcmFkaW8tZ3JvdXAnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRSYWRpb0dyb3VwSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggcmFkaW8gZ3JvdXAgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUmFkaW9Hcm91cEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFJhZGlvR3JvdXBIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFJhZGlvR3JvdXBIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCduYW1lJywgb3B0aW9ucy5uYW1lLCB0aGlzLl9jaGVja1JhZGlvR3JvdXBOYW1lKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgY29uc3QgaG9zdE5hbWUgPSBhd2FpdCB0aGlzLl9nZXRHcm91cE5hbWVGcm9tSG9zdCgpO1xuICAgIC8vIEl0J3Mgbm90IHBvc3NpYmxlIHRvIGFsd2F5cyBkZXRlcm1pbmUgdGhlIFwibmFtZVwiIG9mIGEgcmFkaW8tZ3JvdXAgYnkgcmVhZGluZ1xuICAgIC8vIHRoZSBhdHRyaWJ1dGUuIFRoaXMgaXMgYmVjYXVzZSB0aGUgcmFkaW8tZ3JvdXAgZG9lcyBub3Qgc2V0IHRoZSBcIm5hbWVcIiBhcyBhblxuICAgIC8vIGVsZW1lbnQgYXR0cmlidXRlIGlmIHRoZSBcIm5hbWVcIiB2YWx1ZSBpcyBzZXQgdGhyb3VnaCBhIGJpbmRpbmcuXG4gICAgaWYgKGhvc3ROYW1lICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaG9zdE5hbWU7XG4gICAgfVxuICAgIC8vIEluIGNhc2Ugd2UgY291bGRuJ3QgZGV0ZXJtaW5lIHRoZSBcIm5hbWVcIiBvZiBhIHJhZGlvLWdyb3VwIGJ5IHJlYWRpbmcgdGhlXG4gICAgLy8gXCJuYW1lXCIgYXR0cmlidXRlLCB3ZSB0cnkgdG8gZGV0ZXJtaW5lIHRoZSBcIm5hbWVcIiBvZiB0aGUgZ3JvdXAgYnkgZ29pbmdcbiAgICAvLyB0aHJvdWdoIGFsbCByYWRpbyBidXR0b25zLlxuICAgIGNvbnN0IHJhZGlvTmFtZXMgPSBhd2FpdCB0aGlzLl9nZXROYW1lc0Zyb21SYWRpb0J1dHRvbnMoKTtcbiAgICBpZiAoIXJhZGlvTmFtZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9jaGVja1JhZGlvTmFtZXNJbkdyb3VwRXF1YWwocmFkaW9OYW1lcykpIHtcbiAgICAgIHRocm93IEVycm9yKCdSYWRpbyBidXR0b25zIGluIHJhZGlvLWdyb3VwIGhhdmUgbWlzbWF0Y2hpbmcgbmFtZXMuJyk7XG4gICAgfVxuICAgIHJldHVybiByYWRpb05hbWVzWzBdITtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpZCBvZiB0aGUgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldElkKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnaWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjaGVja2VkIHJhZGlvLWJ1dHRvbiBpbiBhIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXRDaGVja2VkUmFkaW9CdXR0b24oKTogUHJvbWlzZTxNYXRSYWRpb0J1dHRvbkhhcm5lc3N8bnVsbD4ge1xuICAgIGZvciAobGV0IHJhZGlvQnV0dG9uIG9mIGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKCkpIHtcbiAgICAgIGlmIChhd2FpdCByYWRpb0J1dHRvbi5pc0NoZWNrZWQoKSkge1xuICAgICAgICByZXR1cm4gcmFkaW9CdXR0b247XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGNoZWNrZWQgdmFsdWUgb2YgdGhlIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXRDaGVja2VkVmFsdWUoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIGNvbnN0IGNoZWNrZWRSYWRpbyA9IGF3YWl0IHRoaXMuZ2V0Q2hlY2tlZFJhZGlvQnV0dG9uKCk7XG4gICAgaWYgKCFjaGVja2VkUmFkaW8pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY2hlY2tlZFJhZGlvLmdldFZhbHVlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIGxpc3Qgb2YgcmFkaW8gYnV0dG9ucyB3aGljaCBhcmUgcGFydCBvZiB0aGUgcmFkaW8tZ3JvdXAuXG4gICAqIEBwYXJhbSBmaWx0ZXIgT3B0aW9uYWxseSBmaWx0ZXJzIHdoaWNoIHJhZGlvIGJ1dHRvbnMgYXJlIGluY2x1ZGVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0UmFkaW9CdXR0b25zKGZpbHRlcjogUmFkaW9CdXR0b25IYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRSYWRpb0J1dHRvbkhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0UmFkaW9CdXR0b25IYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgYSByYWRpbyBidXR0b24gaW4gdGhpcyBncm91cC5cbiAgICogQHBhcmFtIGZpbHRlciBBbiBvcHRpb25hbCBmaWx0ZXIgdG8gYXBwbHkgdG8gdGhlIGNoaWxkIHJhZGlvIGJ1dHRvbnMuIFRoZSBmaXJzdCB0YWIgbWF0Y2hpbmdcbiAgICogICAgIHRoZSBmaWx0ZXIgd2lsbCBiZSBzZWxlY3RlZC5cbiAgICovXG4gIGFzeW5jIGNoZWNrUmFkaW9CdXR0b24oZmlsdGVyOiBSYWRpb0J1dHRvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCByYWRpb0J1dHRvbnMgPSBhd2FpdCB0aGlzLmdldFJhZGlvQnV0dG9ucyhmaWx0ZXIpO1xuICAgIGlmICghcmFkaW9CdXR0b25zLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHJhZGlvIGJ1dHRvbiBtYXRjaGluZyAke0pTT04uc3RyaW5naWZ5KGZpbHRlcil9YCk7XG4gICAgfVxuICAgIHJldHVybiByYWRpb0J1dHRvbnNbMF0uY2hlY2soKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYW1lIGF0dHJpYnV0ZSBvZiB0aGUgaG9zdCBlbGVtZW50LiAqL1xuICBwcml2YXRlIGFzeW5jIF9nZXRHcm91cE5hbWVGcm9tSG9zdCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgbGlzdCBvZiB0aGUgbmFtZSBhdHRyaWJ1dGVzIG9mIGFsbCBjaGlsZCByYWRpbyBidXR0b25zLiAqL1xuICBwcml2YXRlIGFzeW5jIF9nZXROYW1lc0Zyb21SYWRpb0J1dHRvbnMoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIGNvbnN0IGdyb3VwTmFtZXM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgcmFkaW8gb2YgYXdhaXQgdGhpcy5nZXRSYWRpb0J1dHRvbnMoKSkge1xuICAgICAgY29uc3QgcmFkaW9OYW1lID0gYXdhaXQgcmFkaW8uZ2V0TmFtZSgpO1xuICAgICAgaWYgKHJhZGlvTmFtZSAhPT0gbnVsbCkge1xuICAgICAgICBncm91cE5hbWVzLnB1c2gocmFkaW9OYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdyb3VwTmFtZXM7XG4gIH1cblxuICAvKiogQ2hlY2tzIGlmIHRoZSBzcGVjaWZpZWQgcmFkaW8gbmFtZXMgYXJlIGFsbCBlcXVhbC4gKi9cbiAgcHJpdmF0ZSBfY2hlY2tSYWRpb05hbWVzSW5Hcm91cEVxdWFsKHJhZGlvTmFtZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgbGV0IGdyb3VwTmFtZTogc3RyaW5nfG51bGwgPSBudWxsO1xuICAgIGZvciAobGV0IHJhZGlvTmFtZSBvZiByYWRpb05hbWVzKSB7XG4gICAgICBpZiAoZ3JvdXBOYW1lID09PSBudWxsKSB7XG4gICAgICAgIGdyb3VwTmFtZSA9IHJhZGlvTmFtZTtcbiAgICAgIH0gZWxzZSBpZiAoZ3JvdXBOYW1lICE9PSByYWRpb05hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSByYWRpby1ncm91cCBoYXJuZXNzIGhhcyB0aGUgZ2l2ZW4gbmFtZS4gVGhyb3dzIGlmIGEgcmFkaW8tZ3JvdXAgd2l0aFxuICAgKiBtYXRjaGluZyBuYW1lIGNvdWxkIGJlIGZvdW5kIGJ1dCBoYXMgbWlzbWF0Y2hpbmcgcmFkaW8tYnV0dG9uIG5hbWVzLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgX2NoZWNrUmFkaW9Hcm91cE5hbWUoaGFybmVzczogTWF0UmFkaW9Hcm91cEhhcm5lc3MsIG5hbWU6IHN0cmluZykge1xuICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGEgcmFkaW8tZ3JvdXAgd2hpY2ggaGFzIHRoZSBcIm5hbWVcIiBhdHRyaWJ1dGUgc2V0XG4gICAgLy8gdG8gdGhlIGV4cGVjdGVkIGdyb3VwIG5hbWUuIEl0J3Mgbm90IHBvc3NpYmxlIHRvIGFsd2F5cyBkZXRlcm1pbmVcbiAgICAvLyB0aGUgXCJuYW1lXCIgb2YgYSByYWRpby1ncm91cCBieSByZWFkaW5nIHRoZSBhdHRyaWJ1dGUuIFRoaXMgaXMgYmVjYXVzZVxuICAgIC8vIHRoZSByYWRpby1ncm91cCBkb2VzIG5vdCBzZXQgdGhlIFwibmFtZVwiIGFzIGFuIGVsZW1lbnQgYXR0cmlidXRlIGlmIHRoZVxuICAgIC8vIFwibmFtZVwiIHZhbHVlIGlzIHNldCB0aHJvdWdoIGEgYmluZGluZy5cbiAgICBpZiAoYXdhaXQgaGFybmVzcy5fZ2V0R3JvdXBOYW1lRnJvbUhvc3QoKSA9PT0gbmFtZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGEgZ3JvdXAgd2l0aCByYWRpby1idXR0b25zIHRoYXQgYWxsIGhhdmUgdGhlIHNhbWVcbiAgICAvLyBleHBlY3RlZCBuYW1lLiBUaGlzIGltcGxpZXMgdGhhdCB0aGUgZ3JvdXAgaGFzIHRoZSBnaXZlbiBuYW1lLiBJdCdzXG4gICAgLy8gbm90IHBvc3NpYmxlIHRvIGFsd2F5cyBkZXRlcm1pbmUgdGhlIG5hbWUgb2YgYSByYWRpby1ncm91cCB0aHJvdWdoXG4gICAgLy8gdGhlIGF0dHJpYnV0ZSBiZWNhdXNlIHRoZXJlIGlzXG4gICAgY29uc3QgcmFkaW9OYW1lcyA9IGF3YWl0IGhhcm5lc3MuX2dldE5hbWVzRnJvbVJhZGlvQnV0dG9ucygpO1xuICAgIGlmIChyYWRpb05hbWVzLmluZGV4T2YobmFtZSkgPT09IC0xKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghaGFybmVzcy5fY2hlY2tSYWRpb05hbWVzSW5Hcm91cEVxdWFsKHJhZGlvTmFtZXMpKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICBgVGhlIGxvY2F0b3IgZm91bmQgYSByYWRpby1ncm91cCB3aXRoIG5hbWUgXCIke25hbWV9XCIsIGJ1dCBzb21lIGAgK1xuICAgICAgICAgIGByYWRpby1idXR0b24ncyB3aXRoaW4gdGhlIGdyb3VwIGhhdmUgbWlzbWF0Y2hpbmcgbmFtZXMsIHdoaWNoIGlzIGludmFsaWQuYCk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXJhZGlvLWJ1dHRvbiBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRSYWRpb0J1dHRvbkhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRSYWRpb0J1dHRvbmAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnbWF0LXJhZGlvLWJ1dHRvbic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdFJhZGlvQnV0dG9uSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggcmFkaW8gYnV0dG9uIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFJhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0UmFkaW9CdXR0b25IYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFJhZGlvQnV0dG9uSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgICAgICdsYWJlbCcsIG9wdGlvbnMubGFiZWwsXG4gICAgICAgICAgICAoaGFybmVzcywgbGFiZWwpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldExhYmVsVGV4dCgpLCBsYWJlbCkpXG4gICAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICAgICAnbmFtZScsIG9wdGlvbnMubmFtZSwgYXN5bmMgKGhhcm5lc3MsIG5hbWUpID0+IChhd2FpdCBoYXJuZXNzLmdldE5hbWUoKSkgPT09IG5hbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdGV4dExhYmVsID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXJhZGlvLWxhYmVsLWNvbnRlbnQnKTtcbiAgcHJpdmF0ZSBfY2xpY2tMYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1yYWRpby1sYWJlbCcpO1xuICBwcml2YXRlIF9pbnB1dCA9IHRoaXMubG9jYXRvckZvcignaW5wdXQnKTtcblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8tYnV0dG9uIGlzIGNoZWNrZWQuICovXG4gIGFzeW5jIGlzQ2hlY2tlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBjaGVja2VkID0gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldFByb3BlcnR5KCdjaGVja2VkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBjaGVja2VkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvLWJ1dHRvbiBpcyByZXF1aXJlZC4gKi9cbiAgYXN5bmMgaXNSZXF1aXJlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCByZXF1aXJlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCByZXF1aXJlZCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcmFkaW8tYnV0dG9uJ3MgbmFtZS4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSByYWRpby1idXR0b24ncyBpZC4gKi9cbiAgYXN5bmMgZ2V0SWQoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5KCdpZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSByYWRpby1idXR0b24uIFRoZSByYWRpby1idXR0b24gdmFsdWUgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcuXG4gICAqXG4gICAqIE5vdGU6IFRoaXMgbWVhbnMgdGhhdCBmb3IgcmFkaW8tYnV0dG9uJ3Mgd2l0aCBhbiBvYmplY3QgYXMgYSB2YWx1ZSBgW29iamVjdCBPYmplY3RdYCBpc1xuICAgKiBpbnRlbnRpb25hbGx5IHJldHVybmVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0UHJvcGVydHkoJ3ZhbHVlJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcmFkaW8tYnV0dG9uJ3MgbGFiZWwgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0TGFiZWxUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl90ZXh0TGFiZWwoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHJhZGlvLWJ1dHRvbi4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSByYWRpby1idXR0b24uICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUHV0cyB0aGUgcmFkaW8tYnV0dG9uIGluIGEgY2hlY2tlZCBzdGF0ZSBieSBjbGlja2luZyBpdCBpZiBpdCBpcyBjdXJyZW50bHkgdW5jaGVja2VkLFxuICAgKiBvciBkb2luZyBub3RoaW5nIGlmIGl0IGlzIGFscmVhZHkgY2hlY2tlZC5cbiAgICovXG4gIGFzeW5jIGNoZWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuaXNDaGVja2VkKCkpKSB7XG4gICAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2NsaWNrTGFiZWwoKSkuY2xpY2soKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==