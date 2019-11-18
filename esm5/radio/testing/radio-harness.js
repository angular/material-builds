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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8taGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9yYWRpby90ZXN0aW5nL3JhZGlvLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFLHdFQUF3RTtBQUN4RTtJQUEwQyx3Q0FBZ0I7SUFBMUQ7O0lBb0lBLENBQUM7SUFqSUM7Ozs7Ozs7T0FPRztJQUNJLHlCQUFJLEdBQVgsVUFBWSxPQUFzQztRQUF0Qyx3QkFBQSxFQUFBLFlBQXNDO1FBQ2hELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUM7YUFDckQsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCx3Q0FBd0M7SUFDbEMsc0NBQU8sR0FBYjs7Ozs7NEJBQ21CLHFCQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFBOzt3QkFBN0MsUUFBUSxHQUFHLFNBQWtDO3dCQUNuRCwrRUFBK0U7d0JBQy9FLCtFQUErRTt3QkFDL0Usa0VBQWtFO3dCQUNsRSxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7NEJBQ3JCLHNCQUFPLFFBQVEsRUFBQzt5QkFDakI7d0JBSWtCLHFCQUFNLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFBOzt3QkFBbkQsVUFBVSxHQUFHLFNBQXNDO3dCQUN6RCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTs0QkFDdEIsc0JBQU8sSUFBSSxFQUFDO3lCQUNiO3dCQUNELElBQUksQ0FBQyxJQUFJLENBQUMsNEJB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TSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUE7NEJBQTNCLHNCQUFPLENBQUMsU0FBbUIsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFDOzs7O0tBQ3RDO0lBRUQ7OztPQUdHO0lBQ0csb0NBQUksR0FBVjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUE7NEJBQTNCLHNCQUFPLENBQUMsU0FBbUIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ3JDO0lBRUQ7Ozs7T0FJRztJQUNHLHFDQUFLLEdBQVg7Ozs7NEJBQ1EscUJBQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFBOzs2QkFBeEIsQ0FBQyxDQUFDLFNBQXNCLENBQUMsRUFBekIsd0JBQXlCO3dCQUNuQixxQkFBTSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUE7NEJBQWhDLHNCQUFPLENBQUMsU0FBd0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFDOzs7OztLQUU3QztJQTdGTSxrQ0FBWSxHQUFHLGtCQUFrQixDQUFDO0lBOEYzQyw0QkFBQztDQUFBLEFBL0ZELENBQTJDLGdCQUFnQixHQStGMUQ7U0EvRlkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1JhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnMsIFJhZGlvR3JvdXBIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9yYWRpby1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1yYWRpby1ncm91cCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRSYWRpb0dyb3VwSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1yYWRpby1ncm91cCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgcmFkaW8tZ3JvdXAgd2l0aFxuICAgKiBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSByYWRpby1ncm91cCB3aG9zZSBob3N0IGVsZW1lbnQgbWF0Y2hlcyB0aGUgZ2l2ZW4gc2VsZWN0b3IuXG4gICAqICAgLSBgbmFtZWAgZmluZHMgYSByYWRpby1ncm91cCB3aXRoIHNwZWNpZmljIG5hbWUuXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUmFkaW9Hcm91cEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFJhZGlvR3JvdXBIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFJhZGlvR3JvdXBIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCduYW1lJywgb3B0aW9ucy5uYW1lLCB0aGlzLl9jaGVja1JhZGlvR3JvdXBOYW1lKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgY29uc3QgaG9zdE5hbWUgPSBhd2FpdCB0aGlzLl9nZXRHcm91cE5hbWVGcm9tSG9zdCgpO1xuICAgIC8vIEl0J3Mgbm90IHBvc3NpYmxlIHRvIGFsd2F5cyBkZXRlcm1pbmUgdGhlIFwibmFtZVwiIG9mIGEgcmFkaW8tZ3JvdXAgYnkgcmVhZGluZ1xuICAgIC8vIHRoZSBhdHRyaWJ1dGUuIFRoaXMgaXMgYmVjYXVzZSB0aGUgcmFkaW8tZ3JvdXAgZG9lcyBub3Qgc2V0IHRoZSBcIm5hbWVcIiBhcyBhblxuICAgIC8vIGVsZW1lbnQgYXR0cmlidXRlIGlmIHRoZSBcIm5hbWVcIiB2YWx1ZSBpcyBzZXQgdGhyb3VnaCBhIGJpbmRpbmcuXG4gICAgaWYgKGhvc3ROYW1lICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaG9zdE5hbWU7XG4gICAgfVxuICAgIC8vIEluIGNhc2Ugd2UgY291bGRuJ3QgZGV0ZXJtaW5lIHRoZSBcIm5hbWVcIiBvZiBhIHJhZGlvLWdyb3VwIGJ5IHJlYWRpbmcgdGhlXG4gICAgLy8gXCJuYW1lXCIgYXR0cmlidXRlLCB3ZSB0cnkgdG8gZGV0ZXJtaW5lIHRoZSBcIm5hbWVcIiBvZiB0aGUgZ3JvdXAgYnkgZ29pbmdcbiAgICAvLyB0aHJvdWdoIGFsbCByYWRpbyBidXR0b25zLlxuICAgIGNvbnN0IHJhZGlvTmFtZXMgPSBhd2FpdCB0aGlzLl9nZXROYW1lc0Zyb21SYWRpb0J1dHRvbnMoKTtcbiAgICBpZiAoIXJhZGlvTmFtZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9jaGVja1JhZGlvTmFtZXNJbkdyb3VwRXF1YWwocmFkaW9OYW1lcykpIHtcbiAgICAgIHRocm93IEVycm9yKCdSYWRpbyBidXR0b25zIGluIHJhZGlvLWdyb3VwIGhhdmUgbWlzbWF0Y2hpbmcgbmFtZXMuJyk7XG4gICAgfVxuICAgIHJldHVybiByYWRpb05hbWVzWzBdITtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpZCBvZiB0aGUgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldElkKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnaWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjaGVja2VkIHJhZGlvLWJ1dHRvbiBpbiBhIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXRDaGVja2VkUmFkaW9CdXR0b24oKTogUHJvbWlzZTxNYXRSYWRpb0J1dHRvbkhhcm5lc3N8bnVsbD4ge1xuICAgIGZvciAobGV0IHJhZGlvQnV0dG9uIG9mIGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKCkpIHtcbiAgICAgIGlmIChhd2FpdCByYWRpb0J1dHRvbi5pc0NoZWNrZWQoKSkge1xuICAgICAgICByZXR1cm4gcmFkaW9CdXR0b247XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGNoZWNrZWQgdmFsdWUgb2YgdGhlIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXRDaGVja2VkVmFsdWUoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIGNvbnN0IGNoZWNrZWRSYWRpbyA9IGF3YWl0IHRoaXMuZ2V0Q2hlY2tlZFJhZGlvQnV0dG9uKCk7XG4gICAgaWYgKCFjaGVja2VkUmFkaW8pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY2hlY2tlZFJhZGlvLmdldFZhbHVlKCk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgcmFkaW8gYnV0dG9ucyB3aGljaCBhcmUgcGFydCBvZiB0aGUgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldFJhZGlvQnV0dG9ucyhmaWx0ZXI6IFJhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0UmFkaW9CdXR0b25IYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdFJhZGlvQnV0dG9uSGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIGEgcmFkaW8gYnV0dG9uIGluIHRoaXMgZ3JvdXAuICovXG4gIGFzeW5jIGNoZWNrUmFkaW9CdXR0b24oZmlsdGVyOiBSYWRpb0J1dHRvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCByYWRpb0J1dHRvbnMgPSBhd2FpdCB0aGlzLmdldFJhZGlvQnV0dG9ucyhmaWx0ZXIpO1xuICAgIGlmICghcmFkaW9CdXR0b25zLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHJhZGlvIGJ1dHRvbiBtYXRjaGluZyAke0pTT04uc3RyaW5naWZ5KGZpbHRlcil9YCk7XG4gICAgfVxuICAgIHJldHVybiByYWRpb0J1dHRvbnNbMF0uY2hlY2soKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX2dldEdyb3VwTmFtZUZyb21Ib3N0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0TmFtZXNGcm9tUmFkaW9CdXR0b25zKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCBncm91cE5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IHJhZGlvIG9mIGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKCkpIHtcbiAgICAgIGNvbnN0IHJhZGlvTmFtZSA9IGF3YWl0IHJhZGlvLmdldE5hbWUoKTtcbiAgICAgIGlmIChyYWRpb05hbWUgIT09IG51bGwpIHtcbiAgICAgICAgZ3JvdXBOYW1lcy5wdXNoKHJhZGlvTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBncm91cE5hbWVzO1xuICB9XG5cbiAgLyoqIENoZWNrcyBpZiB0aGUgc3BlY2lmaWVkIHJhZGlvIG5hbWVzIGFyZSBhbGwgZXF1YWwuICovXG4gIHByaXZhdGUgX2NoZWNrUmFkaW9OYW1lc0luR3JvdXBFcXVhbChyYWRpb05hbWVzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGxldCBncm91cE5hbWU6IHN0cmluZ3xudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCByYWRpb05hbWUgb2YgcmFkaW9OYW1lcykge1xuICAgICAgaWYgKGdyb3VwTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICBncm91cE5hbWUgPSByYWRpb05hbWU7XG4gICAgICB9IGVsc2UgaWYgKGdyb3VwTmFtZSAhPT0gcmFkaW9OYW1lKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgcmFkaW8tZ3JvdXAgaGFybmVzcyBoYXMgdGhlIGdpdmVuIG5hbWUuIFRocm93cyBpZiBhIHJhZGlvLWdyb3VwIHdpdGhcbiAgICogbWF0Y2hpbmcgbmFtZSBjb3VsZCBiZSBmb3VuZCBidXQgaGFzIG1pc21hdGNoaW5nIHJhZGlvLWJ1dHRvbiBuYW1lcy5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGFzeW5jIF9jaGVja1JhZGlvR3JvdXBOYW1lKGhhcm5lc3M6IE1hdFJhZGlvR3JvdXBIYXJuZXNzLCBuYW1lOiBzdHJpbmcpIHtcbiAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIHJhZGlvLWdyb3VwIHdoaWNoIGhhcyB0aGUgXCJuYW1lXCIgYXR0cmlidXRlIHNldFxuICAgIC8vIHRvIHRoZSBleHBlY3RlZCBncm91cCBuYW1lLiBJdCdzIG5vdCBwb3NzaWJsZSB0byBhbHdheXMgZGV0ZXJtaW5lXG4gICAgLy8gdGhlIFwibmFtZVwiIG9mIGEgcmFkaW8tZ3JvdXAgYnkgcmVhZGluZyB0aGUgYXR0cmlidXRlLiBUaGlzIGlzIGJlY2F1c2VcbiAgICAvLyB0aGUgcmFkaW8tZ3JvdXAgZG9lcyBub3Qgc2V0IHRoZSBcIm5hbWVcIiBhcyBhbiBlbGVtZW50IGF0dHJpYnV0ZSBpZiB0aGVcbiAgICAvLyBcIm5hbWVcIiB2YWx1ZSBpcyBzZXQgdGhyb3VnaCBhIGJpbmRpbmcuXG4gICAgaWYgKGF3YWl0IGhhcm5lc3MuX2dldEdyb3VwTmFtZUZyb21Ib3N0KCkgPT09IG5hbWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIGdyb3VwIHdpdGggcmFkaW8tYnV0dG9ucyB0aGF0IGFsbCBoYXZlIHRoZSBzYW1lXG4gICAgLy8gZXhwZWN0ZWQgbmFtZS4gVGhpcyBpbXBsaWVzIHRoYXQgdGhlIGdyb3VwIGhhcyB0aGUgZ2l2ZW4gbmFtZS4gSXQnc1xuICAgIC8vIG5vdCBwb3NzaWJsZSB0byBhbHdheXMgZGV0ZXJtaW5lIHRoZSBuYW1lIG9mIGEgcmFkaW8tZ3JvdXAgdGhyb3VnaFxuICAgIC8vIHRoZSBhdHRyaWJ1dGUgYmVjYXVzZSB0aGVyZSBpc1xuICAgIGNvbnN0IHJhZGlvTmFtZXMgPSBhd2FpdCBoYXJuZXNzLl9nZXROYW1lc0Zyb21SYWRpb0J1dHRvbnMoKTtcbiAgICBpZiAocmFkaW9OYW1lcy5pbmRleE9mKG5hbWUpID09PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWhhcm5lc3MuX2NoZWNrUmFkaW9OYW1lc0luR3JvdXBFcXVhbChyYWRpb05hbWVzKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgYFRoZSBsb2NhdG9yIGZvdW5kIGEgcmFkaW8tZ3JvdXAgd2l0aCBuYW1lIFwiJHtuYW1lfVwiLCBidXQgc29tZSBgICtcbiAgICAgICAgICBgcmFkaW8tYnV0dG9uJ3Mgd2l0aGluIHRoZSBncm91cCBoYXZlIG1pc21hdGNoaW5nIG5hbWVzLCB3aGljaCBpcyBpbnZhbGlkLmApO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1yYWRpby1idXR0b24gaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9CdXR0b25IYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnbWF0LXJhZGlvLWJ1dHRvbic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgcmFkaW8tYnV0dG9uIHdpdGhcbiAgICogc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2g6XG4gICAqICAgLSBgc2VsZWN0b3JgIGZpbmRzIGEgcmFkaW8tYnV0dG9uIHdob3NlIGhvc3QgZWxlbWVudCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3Rvci5cbiAgICogICAtIGBsYWJlbGAgZmluZHMgYSByYWRpby1idXR0b24gd2l0aCBzcGVjaWZpYyBsYWJlbCB0ZXh0LlxuICAgKiAgIC0gYG5hbWVgIGZpbmRzIGEgcmFkaW8tYnV0dG9uIHdpdGggc3BlY2lmaWMgbmFtZS5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBSYWRpb0J1dHRvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFJhZGlvQnV0dG9uSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRSYWRpb0J1dHRvbkhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICAgICAnbGFiZWwnLCBvcHRpb25zLmxhYmVsLFxuICAgICAgICAgICAgKGhhcm5lc3MsIGxhYmVsKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRMYWJlbFRleHQoKSwgbGFiZWwpKVxuICAgICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAgICAgJ25hbWUnLCBvcHRpb25zLm5hbWUsIGFzeW5jIChoYXJuZXNzLCBuYW1lKSA9PiAoYXdhaXQgaGFybmVzcy5nZXROYW1lKCkpID09PSBuYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgX3RleHRMYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1yYWRpby1sYWJlbC1jb250ZW50Jyk7XG4gIHByaXZhdGUgX2NsaWNrTGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtcmFkaW8tbGFiZWwnKTtcbiAgcHJpdmF0ZSBfaW5wdXQgPSB0aGlzLmxvY2F0b3JGb3IoJ2lucHV0Jyk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvLWJ1dHRvbiBpcyBjaGVja2VkLiAqL1xuICBhc3luYyBpc0NoZWNrZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgY2hlY2tlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRQcm9wZXJ0eSgnY2hlY2tlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgY2hlY2tlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8tYnV0dG9uIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgcmVxdWlyZWQuICovXG4gIGFzeW5jIGlzUmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcmVxdWlyZWQgPSAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgcmVxdWlyZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgcmFkaW8tYnV0dG9uJ3MgbmFtZS4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHJhZGlvLWJ1dHRvbidzIGlkLiAqL1xuICBhc3luYyBnZXRJZCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ2lkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIHJhZGlvLWJ1dHRvbi4gVGhlIHJhZGlvLWJ1dHRvbiB2YWx1ZSB3aWxsIGJlXG4gICAqIGNvbnZlcnRlZCB0byBhIHN0cmluZy5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoaXMgbWVhbnMgdGhhdCByYWRpby1idXR0b24ncyB3aXRoIG9iamVjdHMgYXMgdmFsdWUgd2lsbFxuICAgKiBpbnRlbnRpb25hbGx5IGhhdmUgdGhlIGBbb2JqZWN0IE9iamVjdF1gIGFzIHJldHVybiB2YWx1ZS5cbiAgICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldFByb3BlcnR5KCd2YWx1ZScpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgcmFkaW8tYnV0dG9uJ3MgbGFiZWwgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0TGFiZWxUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl90ZXh0TGFiZWwoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIHJhZGlvLWJ1dHRvbiBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZVxuICAgKiBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogQmx1cnMgdGhlIHJhZGlvLWJ1dHRvbiBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZVxuICAgKiBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1dHMgdGhlIHJhZGlvLWJ1dHRvbiBpbiBhIGNoZWNrZWQgc3RhdGUgYnkgY2xpY2tpbmcgaXQgaWYgaXQgaXMgY3VycmVudGx5IHVuY2hlY2tlZCxcbiAgICogb3IgZG9pbmcgbm90aGluZyBpZiBpdCBpcyBhbHJlYWR5IGNoZWNrZWQuIFJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlblxuICAgKiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgYXN5bmMgY2hlY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCEoYXdhaXQgdGhpcy5pc0NoZWNrZWQoKSkpIHtcbiAgICAgIHJldHVybiAoYXdhaXQgdGhpcy5fY2xpY2tMYWJlbCgpKS5jbGljaygpO1xuICAgIH1cbiAgfVxufVxuIl19