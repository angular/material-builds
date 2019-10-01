/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
/**
 * Harness for interacting with a standard mat-radio-group in tests.
 * @dynamic
 */
var MatRadioGroupHarness = /** @class */ (function (_super) {
    tslib_1.__extends(MatRadioGroupHarness, _super);
    function MatRadioGroupHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._radioButtons = _this.locatorForAll(MatRadioButtonHarness);
        return _this;
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
    /** Gets the selected radio-button in a radio-group. */
    MatRadioGroupHarness.prototype.getSelectedRadioButton = function () {
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
    /** Gets the selected value of the radio-group. */
    MatRadioGroupHarness.prototype.getSelectedValue = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var selectedRadio;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSelectedRadioButton()];
                    case 1:
                        selectedRadio = _a.sent();
                        if (!selectedRadio) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, selectedRadio.getValue()];
                }
            });
        });
    };
    /** Gets all radio buttons which are part of the radio-group. */
    MatRadioGroupHarness.prototype.getRadioButtons = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._radioButtons()];
                    case 1: return [2 /*return*/, (_a.sent())];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8taGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9yYWRpby90ZXN0aW5nL3JhZGlvLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRzVEOzs7R0FHRztBQUNIO0lBQTBDLGdEQUFnQjtJQUExRDtRQUFBLHFFQTZIQztRQTdHUyxtQkFBYSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7SUE2R3BFLENBQUM7SUExSEM7Ozs7Ozs7T0FPRztJQUNJLHlCQUFJLEdBQVgsVUFBWSxPQUFzQztRQUF0Qyx3QkFBQSxFQUFBLFlBQXNDO1FBQ2hELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUM7YUFDckQsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFJRCx3Q0FBd0M7SUFDbEMsc0NBQU8sR0FBYjs7Ozs7NEJBQ21CLHFCQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFBOzt3QkFBN0MsUUFBUSxHQUFHLFNBQWtDO3dCQUNuRCwrRUFBK0U7d0JBQy9FLCtFQUErRTt3QkFDL0Usa0VBQWtFO3dCQUNsRSxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7NEJBQ3JCLHNCQUFPLFFBQVEsRUFBQzt5QkFDakI7d0JBSWtCLHFCQUFNLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFBOzt3QkFBbkQsVUFBVSxHQUFHLFNBQXNDO3dCQUN6RCxJQUFJLENBQUMsVUFBVSxDQUFDLE1B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QyxDQUFDLFNBQXNCLENBQUMsRUFBekIsd0JBQXlCO3dCQUNuQixxQkFBTSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUE7NEJBQWhDLHNCQUFPLENBQUMsU0FBd0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFDOzs7OztLQUU3QztJQTdGTSxrQ0FBWSxHQUFHLGtCQUFrQixDQUFDO0lBOEYzQyw0QkFBQztDQUFBLEFBL0ZELENBQTJDLGdCQUFnQixHQStGMUQ7U0EvRlkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1JhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnMsIFJhZGlvR3JvdXBIYXJuZXNzRmlsdGVyc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcmFkaW8vdGVzdGluZy9yYWRpby1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtcmFkaW8tZ3JvdXAgaW4gdGVzdHMuXG4gKiBAZHluYW1pY1xuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9Hcm91cEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICdtYXQtcmFkaW8tZ3JvdXAnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHJhZGlvLWdyb3VwIHdpdGhcbiAgICogc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2g6XG4gICAqICAgLSBgc2VsZWN0b3JgIGZpbmRzIGEgcmFkaW8tZ3JvdXAgd2hvc2UgaG9zdCBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKiAgIC0gYG5hbWVgIGZpbmRzIGEgcmFkaW8tZ3JvdXAgd2l0aCBzcGVjaWZpYyBuYW1lLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFJhZGlvR3JvdXBIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRSYWRpb0dyb3VwSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRSYWRpb0dyb3VwSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbignbmFtZScsIG9wdGlvbnMubmFtZSwgdGhpcy5fY2hlY2tSYWRpb0dyb3VwTmFtZSk7XG4gIH1cblxuICBwcml2YXRlIF9yYWRpb0J1dHRvbnMgPSB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0UmFkaW9CdXR0b25IYXJuZXNzKTtcblxuICAvKiogR2V0cyB0aGUgbmFtZSBvZiB0aGUgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldE5hbWUoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIGNvbnN0IGhvc3ROYW1lID0gYXdhaXQgdGhpcy5fZ2V0R3JvdXBOYW1lRnJvbUhvc3QoKTtcbiAgICAvLyBJdCdzIG5vdCBwb3NzaWJsZSB0byBhbHdheXMgZGV0ZXJtaW5lIHRoZSBcIm5hbWVcIiBvZiBhIHJhZGlvLWdyb3VwIGJ5IHJlYWRpbmdcbiAgICAvLyB0aGUgYXR0cmlidXRlLiBUaGlzIGlzIGJlY2F1c2UgdGhlIHJhZGlvLWdyb3VwIGRvZXMgbm90IHNldCB0aGUgXCJuYW1lXCIgYXMgYW5cbiAgICAvLyBlbGVtZW50IGF0dHJpYnV0ZSBpZiB0aGUgXCJuYW1lXCIgdmFsdWUgaXMgc2V0IHRocm91Z2ggYSBiaW5kaW5nLlxuICAgIGlmIChob3N0TmFtZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGhvc3ROYW1lO1xuICAgIH1cbiAgICAvLyBJbiBjYXNlIHdlIGNvdWxkbid0IGRldGVybWluZSB0aGUgXCJuYW1lXCIgb2YgYSByYWRpby1ncm91cCBieSByZWFkaW5nIHRoZVxuICAgIC8vIFwibmFtZVwiIGF0dHJpYnV0ZSwgd2UgdHJ5IHRvIGRldGVybWluZSB0aGUgXCJuYW1lXCIgb2YgdGhlIGdyb3VwIGJ5IGdvaW5nXG4gICAgLy8gdGhyb3VnaCBhbGwgcmFkaW8gYnV0dG9ucy5cbiAgICBjb25zdCByYWRpb05hbWVzID0gYXdhaXQgdGhpcy5fZ2V0TmFtZXNGcm9tUmFkaW9CdXR0b25zKCk7XG4gICAgaWYgKCFyYWRpb05hbWVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICghdGhpcy5fY2hlY2tSYWRpb05hbWVzSW5Hcm91cEVxdWFsKHJhZGlvTmFtZXMpKSB7XG4gICAgICB0aHJvdyBFcnJvcignUmFkaW8gYnV0dG9ucyBpbiByYWRpby1ncm91cCBoYXZlIG1pc21hdGNoaW5nIG5hbWVzLicpO1xuICAgIH1cbiAgICByZXR1cm4gcmFkaW9OYW1lc1swXSE7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaWQgb2YgdGhlIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXRJZCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ2lkJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2VsZWN0ZWQgcmFkaW8tYnV0dG9uIGluIGEgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldFNlbGVjdGVkUmFkaW9CdXR0b24oKTogUHJvbWlzZTxNYXRSYWRpb0J1dHRvbkhhcm5lc3N8bnVsbD4ge1xuICAgIGZvciAobGV0IHJhZGlvQnV0dG9uIG9mIGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKCkpIHtcbiAgICAgIGlmIChhd2FpdCByYWRpb0J1dHRvbi5pc0NoZWNrZWQoKSkge1xuICAgICAgICByZXR1cm4gcmFkaW9CdXR0b247XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHNlbGVjdGVkIHZhbHVlIG9mIHRoZSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0U2VsZWN0ZWRWYWx1ZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgY29uc3Qgc2VsZWN0ZWRSYWRpbyA9IGF3YWl0IHRoaXMuZ2V0U2VsZWN0ZWRSYWRpb0J1dHRvbigpO1xuICAgIGlmICghc2VsZWN0ZWRSYWRpbykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RlZFJhZGlvLmdldFZhbHVlKCk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgcmFkaW8gYnV0dG9ucyB3aGljaCBhcmUgcGFydCBvZiB0aGUgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldFJhZGlvQnV0dG9ucygpOiBQcm9taXNlPE1hdFJhZGlvQnV0dG9uSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9yYWRpb0J1dHRvbnMoKSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9nZXRHcm91cE5hbWVGcm9tSG9zdCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX2dldE5hbWVzRnJvbVJhZGlvQnV0dG9ucygpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgY29uc3QgZ3JvdXBOYW1lczogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGxldCByYWRpbyBvZiBhd2FpdCB0aGlzLmdldFJhZGlvQnV0dG9ucygpKSB7XG4gICAgICBjb25zdCByYWRpb05hbWUgPSBhd2FpdCByYWRpby5nZXROYW1lKCk7XG4gICAgICBpZiAocmFkaW9OYW1lICE9PSBudWxsKSB7XG4gICAgICAgIGdyb3VwTmFtZXMucHVzaChyYWRpb05hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ3JvdXBOYW1lcztcbiAgfVxuXG4gIC8qKiBDaGVja3MgaWYgdGhlIHNwZWNpZmllZCByYWRpbyBuYW1lcyBhcmUgYWxsIGVxdWFsLiAqL1xuICBwcml2YXRlIF9jaGVja1JhZGlvTmFtZXNJbkdyb3VwRXF1YWwocmFkaW9OYW1lczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBsZXQgZ3JvdXBOYW1lOiBzdHJpbmd8bnVsbCA9IG51bGw7XG4gICAgZm9yIChsZXQgcmFkaW9OYW1lIG9mIHJhZGlvTmFtZXMpIHtcbiAgICAgIGlmIChncm91cE5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgZ3JvdXBOYW1lID0gcmFkaW9OYW1lO1xuICAgICAgfSBlbHNlIGlmIChncm91cE5hbWUgIT09IHJhZGlvTmFtZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIHJhZGlvLWdyb3VwIGhhcm5lc3MgaGFzIHRoZSBnaXZlbiBuYW1lLiBUaHJvd3MgaWYgYSByYWRpby1ncm91cCB3aXRoXG4gICAqIG1hdGNoaW5nIG5hbWUgY291bGQgYmUgZm91bmQgYnV0IGhhcyBtaXNtYXRjaGluZyByYWRpby1idXR0b24gbmFtZXMuXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBhc3luYyBfY2hlY2tSYWRpb0dyb3VwTmFtZShoYXJuZXNzOiBNYXRSYWRpb0dyb3VwSGFybmVzcywgbmFtZTogc3RyaW5nKSB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYSByYWRpby1ncm91cCB3aGljaCBoYXMgdGhlIFwibmFtZVwiIGF0dHJpYnV0ZSBzZXRcbiAgICAvLyB0byB0aGUgZXhwZWN0ZWQgZ3JvdXAgbmFtZS4gSXQncyBub3QgcG9zc2libGUgdG8gYWx3YXlzIGRldGVybWluZVxuICAgIC8vIHRoZSBcIm5hbWVcIiBvZiBhIHJhZGlvLWdyb3VwIGJ5IHJlYWRpbmcgdGhlIGF0dHJpYnV0ZS4gVGhpcyBpcyBiZWNhdXNlXG4gICAgLy8gdGhlIHJhZGlvLWdyb3VwIGRvZXMgbm90IHNldCB0aGUgXCJuYW1lXCIgYXMgYW4gZWxlbWVudCBhdHRyaWJ1dGUgaWYgdGhlXG4gICAgLy8gXCJuYW1lXCIgdmFsdWUgaXMgc2V0IHRocm91Z2ggYSBiaW5kaW5nLlxuICAgIGlmIChhd2FpdCBoYXJuZXNzLl9nZXRHcm91cE5hbWVGcm9tSG9zdCgpID09PSBuYW1lKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYSBncm91cCB3aXRoIHJhZGlvLWJ1dHRvbnMgdGhhdCBhbGwgaGF2ZSB0aGUgc2FtZVxuICAgIC8vIGV4cGVjdGVkIG5hbWUuIFRoaXMgaW1wbGllcyB0aGF0IHRoZSBncm91cCBoYXMgdGhlIGdpdmVuIG5hbWUuIEl0J3NcbiAgICAvLyBub3QgcG9zc2libGUgdG8gYWx3YXlzIGRldGVybWluZSB0aGUgbmFtZSBvZiBhIHJhZGlvLWdyb3VwIHRocm91Z2hcbiAgICAvLyB0aGUgYXR0cmlidXRlIGJlY2F1c2UgdGhlcmUgaXNcbiAgICBjb25zdCByYWRpb05hbWVzID0gYXdhaXQgaGFybmVzcy5fZ2V0TmFtZXNGcm9tUmFkaW9CdXR0b25zKCk7XG4gICAgaWYgKHJhZGlvTmFtZXMuaW5kZXhPZihuYW1lKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFoYXJuZXNzLl9jaGVja1JhZGlvTmFtZXNJbkdyb3VwRXF1YWwocmFkaW9OYW1lcykpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgIGBUaGUgbG9jYXRvciBmb3VuZCBhIHJhZGlvLWdyb3VwIHdpdGggbmFtZSBcIiR7bmFtZX1cIiwgYnV0IHNvbWUgYCArXG4gICAgICAgICAgYHJhZGlvLWJ1dHRvbidzIHdpdGhpbiB0aGUgZ3JvdXAgaGF2ZSBtaXNtYXRjaGluZyBuYW1lcywgd2hpY2ggaXMgaW52YWxpZC5gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXJhZGlvLWJ1dHRvbiBpbiB0ZXN0cy5cbiAqIEBkeW5hbWljXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRSYWRpb0J1dHRvbkhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICdtYXQtcmFkaW8tYnV0dG9uJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSByYWRpby1idXR0b24gd2l0aFxuICAgKiBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSByYWRpby1idXR0b24gd2hvc2UgaG9zdCBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKiAgIC0gYGxhYmVsYCBmaW5kcyBhIHJhZGlvLWJ1dHRvbiB3aXRoIHNwZWNpZmljIGxhYmVsIHRleHQuXG4gICAqICAgLSBgbmFtZWAgZmluZHMgYSByYWRpby1idXR0b24gd2l0aCBzcGVjaWZpYyBuYW1lLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFJhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0UmFkaW9CdXR0b25IYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFJhZGlvQnV0dG9uSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgICAgICdsYWJlbCcsIG9wdGlvbnMubGFiZWwsXG4gICAgICAgICAgICAoaGFybmVzcywgbGFiZWwpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldExhYmVsVGV4dCgpLCBsYWJlbCkpXG4gICAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICAgICAnbmFtZScsIG9wdGlvbnMubmFtZSwgYXN5bmMgKGhhcm5lc3MsIG5hbWUpID0+IChhd2FpdCBoYXJuZXNzLmdldE5hbWUoKSkgPT09IG5hbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdGV4dExhYmVsID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXJhZGlvLWxhYmVsLWNvbnRlbnQnKTtcbiAgcHJpdmF0ZSBfY2xpY2tMYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1yYWRpby1sYWJlbCcpO1xuICBwcml2YXRlIF9pbnB1dCA9IHRoaXMubG9jYXRvckZvcignaW5wdXQnKTtcblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8tYnV0dG9uIGlzIGNoZWNrZWQuICovXG4gIGFzeW5jIGlzQ2hlY2tlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBjaGVja2VkID0gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldFByb3BlcnR5KCdjaGVja2VkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBjaGVja2VkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvLWJ1dHRvbiBpcyByZXF1aXJlZC4gKi9cbiAgYXN5bmMgaXNSZXF1aXJlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCByZXF1aXJlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCByZXF1aXJlZCk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSByYWRpby1idXR0b24ncyBuYW1lLiAqL1xuICBhc3luYyBnZXROYW1lKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgcmFkaW8tYnV0dG9uJ3MgaWQuICovXG4gIGFzeW5jIGdldElkKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnaWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgcmFkaW8tYnV0dG9uLiBUaGUgcmFkaW8tYnV0dG9uIHZhbHVlIHdpbGwgYmVcbiAgICogY29udmVydGVkIHRvIGEgc3RyaW5nLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhpcyBtZWFucyB0aGF0IHJhZGlvLWJ1dHRvbidzIHdpdGggb2JqZWN0cyBhcyB2YWx1ZSB3aWxsXG4gICAqIGludGVudGlvbmFsbHkgaGF2ZSB0aGUgYFtvYmplY3QgT2JqZWN0XWAgYXMgcmV0dXJuIHZhbHVlLlxuICAgKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0UHJvcGVydHkoJ3ZhbHVlJyk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSByYWRpby1idXR0b24ncyBsYWJlbCB0ZXh0LiAqL1xuICBhc3luYyBnZXRMYWJlbFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3RleHRMYWJlbCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgcmFkaW8tYnV0dG9uIGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlXG4gICAqIGFjdGlvbiBpcyBjb21wbGV0ZS5cbiAgICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCbHVycyB0aGUgcmFkaW8tYnV0dG9uIGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlXG4gICAqIGFjdGlvbiBpcyBjb21wbGV0ZS5cbiAgICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUHV0cyB0aGUgcmFkaW8tYnV0dG9uIGluIGEgY2hlY2tlZCBzdGF0ZSBieSBjbGlja2luZyBpdCBpZiBpdCBpcyBjdXJyZW50bHkgdW5jaGVja2VkLFxuICAgKiBvciBkb2luZyBub3RoaW5nIGlmIGl0IGlzIGFscmVhZHkgY2hlY2tlZC4gUmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuXG4gICAqIHRoZSBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBjaGVjaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIShhd2FpdCB0aGlzLmlzQ2hlY2tlZCgpKSkge1xuICAgICAgcmV0dXJuIChhd2FpdCB0aGlzLl9jbGlja0xhYmVsKCkpLmNsaWNrKCk7XG4gICAgfVxuICB9XG59XG4iXX0=