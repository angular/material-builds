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
/**
 * Harness for interacting with a standard mat-radio-group in tests.
 * @dynamic
 */
var MatRadioGroupHarness = /** @class */ (function (_super) {
    __extends(MatRadioGroupHarness, _super);
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
    /** Gets all radio buttons which are part of the radio-group. */
    MatRadioGroupHarness.prototype.getRadioButtons = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatRadioButtonHarness.with(filter))()];
            });
        });
    };
    /** Checks a radio button in this group. */
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
    MatRadioGroupHarness.hostSelector = 'mat-radio-group';
    return MatRadioGroupHarness;
}(ComponentHarness));
export { MatRadioGroupHarness };
/**
 * Harness for interacting with a standard mat-radio-button in tests.
 * @dynamic
 */
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
    /** Gets a promise for the radio-button's name. */
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
    /** Gets a promise for the radio-button's id. */
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
     * Gets the value of the radio-button. The radio-button value will be
     * converted to a string.
     *
     * Note that this means that radio-button's with objects as value will
     * intentionally have the `[object Object]` as return value.
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
    /** Gets a promise for the radio-button's label text. */
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
    /**
     * Focuses the radio-button and returns a void promise that indicates when the
     * action is complete.
     */
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
    /**
     * Blurs the radio-button and returns a void promise that indicates when the
     * action is complete.
     */
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
     * or doing nothing if it is already checked. Returns a void promise that indicates when
     * the action is complete.
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
    MatRadioButtonHarness.hostSelector = 'mat-radio-button';
    return MatRadioButtonHarness;
}(ComponentHarness));
export { MatRadioButtonHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8taGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9yYWRpby90ZXN0aW5nL3JhZGlvLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFOzs7R0FHRztBQUNIO0lBQTBDLHdDQUFnQjtJQUExRDs7SUFvSUEsQ0FBQztJQWpJQzs7Ozs7OztPQU9HO0lBQ0kseUJBQUksR0FBWCxVQUFZLE9BQXNDO1FBQXRDLHdCQUFBLEVBQUEsWUFBc0M7UUFDaEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQzthQUNyRCxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELHdDQUF3QztJQUNsQyxzQ0FBTyxHQUFiOzs7Ozs0QkFDbUIscUJBQU0sSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUE7O3dCQUE3QyxRQUFRLEdBQUcsU0FBa0M7d0JBQ25ELCtFQUErRTt3QkFDL0UsK0VBQStFO3dCQUMvRSxrRUFBa0U7d0JBQ2xFLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTs0QkFDckIsc0JBQU8sUUFBUSxFQUFDO3lCQUNqQjt3QkFJa0IscUJBQU0sSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUE7O3dCQUFuRCxVQUFVLEdBQUcsU0FBc0M7d0JBQ3pELElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFOzRCQUN0QixzQkFBTyxJQUFJLEVBQUM7eUJBQ2I7d0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyw0QkFB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SUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFBOzRCQUEzQixzQkFBTyxDQUFDLFNBQW1CLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBQzs7OztLQUN0QztJQUVEOzs7T0FHRztJQUNHLG9DQUFJLEdBQVY7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFBOzRCQUEzQixzQkFBTyxDQUFDLFNBQW1CLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQzs7OztLQUNyQztJQUVEOzs7O09BSUc7SUFDRyxxQ0FBSyxHQUFYOzs7OzRCQUNRLHFCQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQTs7NkJBQXhCLENBQUMsQ0FBQyxTQUFzQixDQUFDLEVBQXpCLHdCQUF5Qjt3QkFDbkIscUJBQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFBOzRCQUFoQyxzQkFBTyxDQUFDLFNBQXdCLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBQzs7Ozs7S0FFN0M7SUE3Rk0sa0NBQVksR0FBRyxrQkFBa0IsQ0FBQztJQThGM0MsNEJBQUM7Q0FBQSxBQS9GRCxDQUEyQyxnQkFBZ0IsR0ErRjFEO1NBL0ZZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtSYWRpb0J1dHRvbkhhcm5lc3NGaWx0ZXJzLCBSYWRpb0dyb3VwSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vcmFkaW8taGFybmVzcy1maWx0ZXJzJztcblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXJhZGlvLWdyb3VwIGluIHRlc3RzLlxuICogQGR5bmFtaWNcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdFJhZGlvR3JvdXBIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnbWF0LXJhZGlvLWdyb3VwJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSByYWRpby1ncm91cCB3aXRoXG4gICAqIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoOlxuICAgKiAgIC0gYHNlbGVjdG9yYCBmaW5kcyBhIHJhZGlvLWdyb3VwIHdob3NlIGhvc3QgZWxlbWVudCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3Rvci5cbiAgICogICAtIGBuYW1lYCBmaW5kcyBhIHJhZGlvLWdyb3VwIHdpdGggc3BlY2lmaWMgbmFtZS5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBSYWRpb0dyb3VwSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0UmFkaW9Hcm91cEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0UmFkaW9Hcm91cEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ25hbWUnLCBvcHRpb25zLm5hbWUsIHRoaXMuX2NoZWNrUmFkaW9Hcm91cE5hbWUpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG5hbWUgb2YgdGhlIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXROYW1lKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICBjb25zdCBob3N0TmFtZSA9IGF3YWl0IHRoaXMuX2dldEdyb3VwTmFtZUZyb21Ib3N0KCk7XG4gICAgLy8gSXQncyBub3QgcG9zc2libGUgdG8gYWx3YXlzIGRldGVybWluZSB0aGUgXCJuYW1lXCIgb2YgYSByYWRpby1ncm91cCBieSByZWFkaW5nXG4gICAgLy8gdGhlIGF0dHJpYnV0ZS4gVGhpcyBpcyBiZWNhdXNlIHRoZSByYWRpby1ncm91cCBkb2VzIG5vdCBzZXQgdGhlIFwibmFtZVwiIGFzIGFuXG4gICAgLy8gZWxlbWVudCBhdHRyaWJ1dGUgaWYgdGhlIFwibmFtZVwiIHZhbHVlIGlzIHNldCB0aHJvdWdoIGEgYmluZGluZy5cbiAgICBpZiAoaG9zdE5hbWUgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBob3N0TmFtZTtcbiAgICB9XG4gICAgLy8gSW4gY2FzZSB3ZSBjb3VsZG4ndCBkZXRlcm1pbmUgdGhlIFwibmFtZVwiIG9mIGEgcmFkaW8tZ3JvdXAgYnkgcmVhZGluZyB0aGVcbiAgICAvLyBcIm5hbWVcIiBhdHRyaWJ1dGUsIHdlIHRyeSB0byBkZXRlcm1pbmUgdGhlIFwibmFtZVwiIG9mIHRoZSBncm91cCBieSBnb2luZ1xuICAgIC8vIHRocm91Z2ggYWxsIHJhZGlvIGJ1dHRvbnMuXG4gICAgY29uc3QgcmFkaW9OYW1lcyA9IGF3YWl0IHRoaXMuX2dldE5hbWVzRnJvbVJhZGlvQnV0dG9ucygpO1xuICAgIGlmICghcmFkaW9OYW1lcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2NoZWNrUmFkaW9OYW1lc0luR3JvdXBFcXVhbChyYWRpb05hbWVzKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1JhZGlvIGJ1dHRvbnMgaW4gcmFkaW8tZ3JvdXAgaGF2ZSBtaXNtYXRjaGluZyBuYW1lcy4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHJhZGlvTmFtZXNbMF0hO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlkIG9mIHRoZSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0SWQoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5KCdpZCcpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGNoZWNrZWQgcmFkaW8tYnV0dG9uIGluIGEgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldENoZWNrZWRSYWRpb0J1dHRvbigpOiBQcm9taXNlPE1hdFJhZGlvQnV0dG9uSGFybmVzc3xudWxsPiB7XG4gICAgZm9yIChsZXQgcmFkaW9CdXR0b24gb2YgYXdhaXQgdGhpcy5nZXRSYWRpb0J1dHRvbnMoKSkge1xuICAgICAgaWYgKGF3YWl0IHJhZGlvQnV0dG9uLmlzQ2hlY2tlZCgpKSB7XG4gICAgICAgIHJldHVybiByYWRpb0J1dHRvbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY2hlY2tlZCB2YWx1ZSBvZiB0aGUgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldENoZWNrZWRWYWx1ZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgY29uc3QgY2hlY2tlZFJhZGlvID0gYXdhaXQgdGhpcy5nZXRDaGVja2VkUmFkaW9CdXR0b24oKTtcbiAgICBpZiAoIWNoZWNrZWRSYWRpbykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjaGVja2VkUmFkaW8uZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFsbCByYWRpbyBidXR0b25zIHdoaWNoIGFyZSBwYXJ0IG9mIHRoZSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0UmFkaW9CdXR0b25zKGZpbHRlcjogUmFkaW9CdXR0b25IYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRSYWRpb0J1dHRvbkhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0UmFkaW9CdXR0b25IYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBDaGVja3MgYSByYWRpbyBidXR0b24gaW4gdGhpcyBncm91cC4gKi9cbiAgYXN5bmMgY2hlY2tSYWRpb0J1dHRvbihmaWx0ZXI6IFJhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHJhZGlvQnV0dG9ucyA9IGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKGZpbHRlcik7XG4gICAgaWYgKCFyYWRpb0J1dHRvbnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGZpbmQgcmFkaW8gYnV0dG9uIG1hdGNoaW5nICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVyKX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHJhZGlvQnV0dG9uc1swXS5jaGVjaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0R3JvdXBOYW1lRnJvbUhvc3QoKSB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9nZXROYW1lc0Zyb21SYWRpb0J1dHRvbnMoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIGNvbnN0IGdyb3VwTmFtZXM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgcmFkaW8gb2YgYXdhaXQgdGhpcy5nZXRSYWRpb0J1dHRvbnMoKSkge1xuICAgICAgY29uc3QgcmFkaW9OYW1lID0gYXdhaXQgcmFkaW8uZ2V0TmFtZSgpO1xuICAgICAgaWYgKHJhZGlvTmFtZSAhPT0gbnVsbCkge1xuICAgICAgICBncm91cE5hbWVzLnB1c2gocmFkaW9OYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdyb3VwTmFtZXM7XG4gIH1cblxuICAvKiogQ2hlY2tzIGlmIHRoZSBzcGVjaWZpZWQgcmFkaW8gbmFtZXMgYXJlIGFsbCBlcXVhbC4gKi9cbiAgcHJpdmF0ZSBfY2hlY2tSYWRpb05hbWVzSW5Hcm91cEVxdWFsKHJhZGlvTmFtZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgbGV0IGdyb3VwTmFtZTogc3RyaW5nfG51bGwgPSBudWxsO1xuICAgIGZvciAobGV0IHJhZGlvTmFtZSBvZiByYWRpb05hbWVzKSB7XG4gICAgICBpZiAoZ3JvdXBOYW1lID09PSBudWxsKSB7XG4gICAgICAgIGdyb3VwTmFtZSA9IHJhZGlvTmFtZTtcbiAgICAgIH0gZWxzZSBpZiAoZ3JvdXBOYW1lICE9PSByYWRpb05hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSByYWRpby1ncm91cCBoYXJuZXNzIGhhcyB0aGUgZ2l2ZW4gbmFtZS4gVGhyb3dzIGlmIGEgcmFkaW8tZ3JvdXAgd2l0aFxuICAgKiBtYXRjaGluZyBuYW1lIGNvdWxkIGJlIGZvdW5kIGJ1dCBoYXMgbWlzbWF0Y2hpbmcgcmFkaW8tYnV0dG9uIG5hbWVzLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgX2NoZWNrUmFkaW9Hcm91cE5hbWUoaGFybmVzczogTWF0UmFkaW9Hcm91cEhhcm5lc3MsIG5hbWU6IHN0cmluZykge1xuICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGEgcmFkaW8tZ3JvdXAgd2hpY2ggaGFzIHRoZSBcIm5hbWVcIiBhdHRyaWJ1dGUgc2V0XG4gICAgLy8gdG8gdGhlIGV4cGVjdGVkIGdyb3VwIG5hbWUuIEl0J3Mgbm90IHBvc3NpYmxlIHRvIGFsd2F5cyBkZXRlcm1pbmVcbiAgICAvLyB0aGUgXCJuYW1lXCIgb2YgYSByYWRpby1ncm91cCBieSByZWFkaW5nIHRoZSBhdHRyaWJ1dGUuIFRoaXMgaXMgYmVjYXVzZVxuICAgIC8vIHRoZSByYWRpby1ncm91cCBkb2VzIG5vdCBzZXQgdGhlIFwibmFtZVwiIGFzIGFuIGVsZW1lbnQgYXR0cmlidXRlIGlmIHRoZVxuICAgIC8vIFwibmFtZVwiIHZhbHVlIGlzIHNldCB0aHJvdWdoIGEgYmluZGluZy5cbiAgICBpZiAoYXdhaXQgaGFybmVzcy5fZ2V0R3JvdXBOYW1lRnJvbUhvc3QoKSA9PT0gbmFtZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGEgZ3JvdXAgd2l0aCByYWRpby1idXR0b25zIHRoYXQgYWxsIGhhdmUgdGhlIHNhbWVcbiAgICAvLyBleHBlY3RlZCBuYW1lLiBUaGlzIGltcGxpZXMgdGhhdCB0aGUgZ3JvdXAgaGFzIHRoZSBnaXZlbiBuYW1lLiBJdCdzXG4gICAgLy8gbm90IHBvc3NpYmxlIHRvIGFsd2F5cyBkZXRlcm1pbmUgdGhlIG5hbWUgb2YgYSByYWRpby1ncm91cCB0aHJvdWdoXG4gICAgLy8gdGhlIGF0dHJpYnV0ZSBiZWNhdXNlIHRoZXJlIGlzXG4gICAgY29uc3QgcmFkaW9OYW1lcyA9IGF3YWl0IGhhcm5lc3MuX2dldE5hbWVzRnJvbVJhZGlvQnV0dG9ucygpO1xuICAgIGlmIChyYWRpb05hbWVzLmluZGV4T2YobmFtZSkgPT09IC0xKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghaGFybmVzcy5fY2hlY2tSYWRpb05hbWVzSW5Hcm91cEVxdWFsKHJhZGlvTmFtZXMpKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICBgVGhlIGxvY2F0b3IgZm91bmQgYSByYWRpby1ncm91cCB3aXRoIG5hbWUgXCIke25hbWV9XCIsIGJ1dCBzb21lIGAgK1xuICAgICAgICAgIGByYWRpby1idXR0b24ncyB3aXRoaW4gdGhlIGdyb3VwIGhhdmUgbWlzbWF0Y2hpbmcgbmFtZXMsIHdoaWNoIGlzIGludmFsaWQuYCk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1yYWRpby1idXR0b24gaW4gdGVzdHMuXG4gKiBAZHluYW1pY1xuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9CdXR0b25IYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnbWF0LXJhZGlvLWJ1dHRvbic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgcmFkaW8tYnV0dG9uIHdpdGhcbiAgICogc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2g6XG4gICAqICAgLSBgc2VsZWN0b3JgIGZpbmRzIGEgcmFkaW8tYnV0dG9uIHdob3NlIGhvc3QgZWxlbWVudCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3Rvci5cbiAgICogICAtIGBsYWJlbGAgZmluZHMgYSByYWRpby1idXR0b24gd2l0aCBzcGVjaWZpYyBsYWJlbCB0ZXh0LlxuICAgKiAgIC0gYG5hbWVgIGZpbmRzIGEgcmFkaW8tYnV0dG9uIHdpdGggc3BlY2lmaWMgbmFtZS5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBSYWRpb0J1dHRvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFJhZGlvQnV0dG9uSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRSYWRpb0J1dHRvbkhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICAgICAnbGFiZWwnLCBvcHRpb25zLmxhYmVsLFxuICAgICAgICAgICAgKGhhcm5lc3MsIGxhYmVsKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRMYWJlbFRleHQoKSwgbGFiZWwpKVxuICAgICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAgICAgJ25hbWUnLCBvcHRpb25zLm5hbWUsIGFzeW5jIChoYXJuZXNzLCBuYW1lKSA9PiAoYXdhaXQgaGFybmVzcy5nZXROYW1lKCkpID09PSBuYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgX3RleHRMYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1yYWRpby1sYWJlbC1jb250ZW50Jyk7XG4gIHByaXZhdGUgX2NsaWNrTGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtcmFkaW8tbGFiZWwnKTtcbiAgcHJpdmF0ZSBfaW5wdXQgPSB0aGlzLmxvY2F0b3JGb3IoJ2lucHV0Jyk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvLWJ1dHRvbiBpcyBjaGVja2VkLiAqL1xuICBhc3luYyBpc0NoZWNrZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgY2hlY2tlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRQcm9wZXJ0eSgnY2hlY2tlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgY2hlY2tlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8tYnV0dG9uIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgcmVxdWlyZWQuICovXG4gIGFzeW5jIGlzUmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcmVxdWlyZWQgPSAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgcmVxdWlyZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgcmFkaW8tYnV0dG9uJ3MgbmFtZS4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHJhZGlvLWJ1dHRvbidzIGlkLiAqL1xuICBhc3luYyBnZXRJZCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ2lkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIHJhZGlvLWJ1dHRvbi4gVGhlIHJhZGlvLWJ1dHRvbiB2YWx1ZSB3aWxsIGJlXG4gICAqIGNvbnZlcnRlZCB0byBhIHN0cmluZy5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoaXMgbWVhbnMgdGhhdCByYWRpby1idXR0b24ncyB3aXRoIG9iamVjdHMgYXMgdmFsdWUgd2lsbFxuICAgKiBpbnRlbnRpb25hbGx5IGhhdmUgdGhlIGBbb2JqZWN0IE9iamVjdF1gIGFzIHJldHVybiB2YWx1ZS5cbiAgICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldFByb3BlcnR5KCd2YWx1ZScpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgcmFkaW8tYnV0dG9uJ3MgbGFiZWwgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0TGFiZWxUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl90ZXh0TGFiZWwoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIHJhZGlvLWJ1dHRvbiBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZVxuICAgKiBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogQmx1cnMgdGhlIHJhZGlvLWJ1dHRvbiBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZVxuICAgKiBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1dHMgdGhlIHJhZGlvLWJ1dHRvbiBpbiBhIGNoZWNrZWQgc3RhdGUgYnkgY2xpY2tpbmcgaXQgaWYgaXQgaXMgY3VycmVudGx5IHVuY2hlY2tlZCxcbiAgICogb3IgZG9pbmcgbm90aGluZyBpZiBpdCBpcyBhbHJlYWR5IGNoZWNrZWQuIFJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlblxuICAgKiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgYXN5bmMgY2hlY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCEoYXdhaXQgdGhpcy5pc0NoZWNrZWQoKSkpIHtcbiAgICAgIHJldHVybiAoYXdhaXQgdGhpcy5fY2xpY2tMYWJlbCgpKS5jbGljaygpO1xuICAgIH1cbiAgfVxufVxuIl19