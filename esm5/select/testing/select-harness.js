/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator, __read } from "tslib";
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
import { MatSelectOptionHarness, MatSelectOptionGroupHarness, } from './option-harness';
/** Harness for interacting with a standard mat-select in tests. */
var MatSelectHarness = /** @class */ (function (_super) {
    __extends(MatSelectHarness, _super);
    function MatSelectHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._documentRootLocator = _this.documentRootLocatorFactory();
        _this._backdrop = _this._documentRootLocator.locatorFor('.cdk-overlay-backdrop');
        _this._optionalPanel = _this._documentRootLocator.locatorForOptional('.mat-select-panel');
        _this._trigger = _this.locatorFor('.mat-select-trigger');
        _this._value = _this.locatorFor('.mat-select-value');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSelectHarness` that meets
     * certain criteria.
     * @param options Options for filtering which select instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatSelectHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatSelectHarness, options);
    };
    /** Gets a boolean promise indicating if the select is disabled. */
    MatSelectHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-select-disabled')];
                }
            });
        });
    };
    /** Gets a boolean promise indicating if the select is valid. */
    MatSelectHarness.prototype.isValid = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).hasClass('ng-invalid')];
                    case 2: return [2 /*return*/, !(_a.sent())];
                }
            });
        });
    };
    /** Gets a boolean promise indicating if the select is required. */
    MatSelectHarness.prototype.isRequired = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-select-required')];
                }
            });
        });
    };
    /** Gets a boolean promise indicating if the select is empty (no value is selected). */
    MatSelectHarness.prototype.isEmpty = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-select-empty')];
                }
            });
        });
    };
    /** Gets a boolean promise indicating if the select is in multi-selection mode. */
    MatSelectHarness.prototype.isMultiple = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ariaMultiselectable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        ariaMultiselectable = (_a.sent()).getAttribute('aria-multiselectable');
                        return [4 /*yield*/, ariaMultiselectable];
                    case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                }
            });
        });
    };
    /** Gets a promise for the select's value text. */
    MatSelectHarness.prototype.getValueText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._value()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Focuses the select and returns a void promise that indicates when the action is complete. */
    MatSelectHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the select and returns a void promise that indicates when the action is complete. */
    MatSelectHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /** Gets the options inside the select panel. */
    MatSelectHarness.prototype.getOptions = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._documentRootLocator.locatorForAll(MatSelectOptionHarness.with(filter))()];
            });
        });
    };
    /** Gets the groups of options inside the panel. */
    MatSelectHarness.prototype.getOptionGroups = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._documentRootLocator.locatorForAll(MatSelectOptionGroupHarness.with(filter))()];
            });
        });
    };
    /** Gets whether the select is open. */
    MatSelectHarness.prototype.isOpen = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._optionalPanel()];
                    case 1: return [2 /*return*/, !!(_a.sent())];
                }
            });
        });
    };
    /** Opens the select's panel. */
    MatSelectHarness.prototype.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isOpen()];
                    case 1:
                        if (!!(_a.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._trigger()];
                    case 2: return [2 /*return*/, (_a.sent()).click()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clicks the options that match the passed-in filter. If the select is in multi-selection
     * mode all options will be clicked, otherwise the harness will pick the first matching option.
     */
    MatSelectHarness.prototype.clickOptions = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, isMultiple, options;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.open()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, Promise.all([this.isMultiple(), this.getOptions(filter)])];
                    case 2:
                        _a = __read.apply(void 0, [_b.sent(), 2]), isMultiple = _a[0], options = _a[1];
                        if (options.length === 0) {
                            throw Error('Select does not have options matching the specified filter');
                        }
                        if (!isMultiple) return [3 /*break*/, 4];
                        return [4 /*yield*/, Promise.all(options.map(function (option) { return option.click(); }))];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, options[0].click()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /** Closes the select's panel. */
    MatSelectHarness.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isOpen()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._backdrop()];
                    case 2: 
                    // This is the most consistent way that works both in both single and multi-select modes,
                    // but it assumes that only one overlay is open at a time. We should be able to make it
                    // a bit more precise after #16645 where we can dispatch an ESCAPE press to the host instead.
                    return [2 /*return*/, (_a.sent()).click()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MatSelectHarness.hostSelector = '.mat-select';
    return MatSelectHarness;
}(MatFormFieldControlHarness));
export { MatSelectHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3Rlc3Rpbmcvc2VsZWN0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBRXhGLE9BQU8sRUFDTCxzQkFBc0IsRUFDdEIsMkJBQTJCLEdBRzVCLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsbUVBQW1FO0FBQ25FO0lBQXNDLG9DQUEwQjtJQUFoRTtRQUFBLHFFQWdIQztRQS9HUywwQkFBb0IsR0FBRyxLQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUN6RCxlQUFTLEdBQUcsS0FBSSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzFFLG9CQUFjLEdBQUcsS0FBSSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDbkYsY0FBUSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNsRCxZQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztJQTJHeEQsQ0FBQztJQXZHQzs7Ozs7T0FLRztJQUNJLHFCQUFJLEdBQVgsVUFBWSxPQUFrQztRQUFsQyx3QkFBQSxFQUFBLFlBQWtDO1FBQzVDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsbUVBQW1FO0lBQzdELHFDQUFVLEdBQWhCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLEVBQUM7Ozs7S0FDNUQ7SUFFRCxnRUFBZ0U7SUFDMUQsa0NBQU8sR0FBYjs7Ozs0QkFDa0IscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF4QixxQkFBTSxDQUFDLFNBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUE7NEJBQXpELHNCQUFPLENBQUMsQ0FBQyxTQUFnRCxDQUFDLEVBQUM7Ozs7S0FDNUQ7SUFFRCxtRUFBbUU7SUFDN0QscUNBQVUsR0FBaEI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsRUFBQzs7OztLQUM1RDtJQUVELHVGQUF1RjtJQUNqRixrQ0FBTyxHQUFiOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQUM7Ozs7S0FDekQ7SUFFRCxrRkFBa0Y7SUFDNUUscUNBQVUsR0FBaEI7Ozs7OzRCQUMrQixxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUF4QyxtQkFBbUIsR0FBRyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLENBQUM7d0JBQzVFLHFCQUFNLG1CQUFtQixFQUFBOzRCQUFqQyxzQkFBTyxDQUFDLFNBQXlCLENBQUMsS0FBSyxNQUFNLEVBQUM7Ozs7S0FDL0M7SUFFRCxrREFBa0Q7SUFDNUMsdUNBQVksR0FBbEI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFBOzRCQUEzQixzQkFBTyxDQUFDLFNBQW1CLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQzs7OztLQUNyQztJQUVELGdHQUFnRztJQUMxRixnQ0FBSyxHQUFYOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUM7Ozs7S0FDcEM7SUFFRCw4RkFBOEY7SUFDeEYsK0JBQUksR0FBVjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ25DO0lBRUQsZ0RBQWdEO0lBQzFDLHFDQUFVLEdBQWhCLFVBQWlCLE1BQWlDO1FBQWpDLHVCQUFBLEVBQUEsV0FBaUM7OztnQkFDaEQsc0JBQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFDOzs7S0FDdkY7SUFFRCxtREFBbUQ7SUFDN0MsMENBQWUsR0FBckIsVUFBc0IsTUFBc0M7UUFBdEMsdUJBQUEsRUFBQSxXQUFzQzs7O2dCQUUxRCxzQkFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUM7OztLQUM1RjtJQUVELHVDQUF1QztJQUNqQyxpQ0FBTSxHQUFaOzs7OzRCQUNZLHFCQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBQTs0QkFBckMsc0JBQU8sQ0FBQyxDQUFDLENBQUMsU0FBMkIsQ0FBQyxFQUFDOzs7O0tBQ3hDO0lBRUQsZ0NBQWdDO0lBQzFCLCtCQUFJLEdBQVY7Ozs7NEJBQ08scUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFBOzs2QkFBcEIsQ0FBQyxDQUFBLFNBQW1CLENBQUEsRUFBcEIsd0JBQW9CO3dCQUNkLHFCQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQTs0QkFBN0Isc0JBQU8sQ0FBQyxTQUFxQixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUM7Ozs7O0tBRTFDO0lBRUQ7OztPQUdHO0lBQ0csdUNBQVksR0FBbEIsVUFBbUIsTUFBaUM7UUFBakMsdUJBQUEsRUFBQSxXQUFpQzs7Ozs7NEJBQ2xELHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQWpCLFNBQWlCLENBQUM7d0JBRVkscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBQXZGLEtBQUEsc0JBQXdCLFNBQStELEtBQUEsRUFBdEYsVUFBVSxRQUFBLEVBQUUsT0FBTyxRQUFBO3dCQUUxQixJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFOzRCQUN4QixNQUFNLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO3lCQUMzRTs2QkFFRyxVQUFVLEVBQVYsd0JBQVU7d0JBQ1oscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFkLENBQWMsQ0FBQyxDQUFDLEVBQUE7O3dCQUF4RCxTQUF3RCxDQUFDOzs0QkFFekQscUJBQU0sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBeEIsU0FBd0IsQ0FBQzs7Ozs7O0tBRTVCO0lBRUQsaUNBQWlDO0lBQzNCLGdDQUFLLEdBQVg7Ozs7NEJBQ00scUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFBOzs2QkFBbkIsU0FBbUIsRUFBbkIsd0JBQW1CO3dCQUliLHFCQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQTs7b0JBSDlCLHlGQUF5RjtvQkFDekYsdUZBQXVGO29CQUN2Riw2RkFBNkY7b0JBQzdGLHNCQUFPLENBQUMsU0FBc0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFDOzs7OztLQUUzQztJQXhHTSw2QkFBWSxHQUFHLGFBQWEsQ0FBQztJQXlHdEMsdUJBQUM7Q0FBQSxBQWhIRCxDQUFzQywwQkFBMEIsR0FnSC9EO1NBaEhZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9jb250cm9sJztcbmltcG9ydCB7U2VsZWN0SGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vc2VsZWN0LWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge1xuICBNYXRTZWxlY3RPcHRpb25IYXJuZXNzLFxuICBNYXRTZWxlY3RPcHRpb25Hcm91cEhhcm5lc3MsXG4gIE9wdGlvbkhhcm5lc3NGaWx0ZXJzLFxuICBPcHRpb25Hcm91cEhhcm5lc3NGaWx0ZXJzLFxufSBmcm9tICcuL29wdGlvbi1oYXJuZXNzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtc2VsZWN0IGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdEhhcm5lc3MgZXh0ZW5kcyBNYXRGb3JtRmllbGRDb250cm9sSGFybmVzcyB7XG4gIHByaXZhdGUgX2RvY3VtZW50Um9vdExvY2F0b3IgPSB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCk7XG4gIHByaXZhdGUgX2JhY2tkcm9wID0gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yKCcuY2RrLW92ZXJsYXktYmFja2Ryb3AnKTtcbiAgcHJpdmF0ZSBfb3B0aW9uYWxQYW5lbCA9IHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LXNlbGVjdC1wYW5lbCcpO1xuICBwcml2YXRlIF90cmlnZ2VyID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXNlbGVjdC10cmlnZ2VyJyk7XG4gIHByaXZhdGUgX3ZhbHVlID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXNlbGVjdC12YWx1ZScpO1xuXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1zZWxlY3QnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRTZWxlY3RIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBzZWxlY3QgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogU2VsZWN0SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0U2VsZWN0SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTZWxlY3RIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LXNlbGVjdC1kaXNhYmxlZCcpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgc2VsZWN0IGlzIHZhbGlkLiAqL1xuICBhc3luYyBpc1ZhbGlkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAhKGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ25nLWludmFsaWQnKSk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBzZWxlY3QgaXMgcmVxdWlyZWQuICovXG4gIGFzeW5jIGlzUmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1zZWxlY3QtcmVxdWlyZWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyBlbXB0eSAobm8gdmFsdWUgaXMgc2VsZWN0ZWQpLiAqL1xuICBhc3luYyBpc0VtcHR5KCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtc2VsZWN0LWVtcHR5Jyk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBzZWxlY3QgaXMgaW4gbXVsdGktc2VsZWN0aW9uIG1vZGUuICovXG4gIGFzeW5jIGlzTXVsdGlwbGUoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgYXJpYU11bHRpc2VsZWN0YWJsZSA9IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLW11bHRpc2VsZWN0YWJsZScpO1xuICAgIHJldHVybiAoYXdhaXQgYXJpYU11bHRpc2VsZWN0YWJsZSkgPT09ICd0cnVlJztcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHNlbGVjdCdzIHZhbHVlIHRleHQuICovXG4gIGFzeW5jIGdldFZhbHVlVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fdmFsdWUoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHNlbGVjdCBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZSBhY3Rpb24gaXMgY29tcGxldGUuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIHNlbGVjdCBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZSBhY3Rpb24gaXMgY29tcGxldGUuICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG9wdGlvbnMgaW5zaWRlIHRoZSBzZWxlY3QgcGFuZWwuICovXG4gIGFzeW5jIGdldE9wdGlvbnMoZmlsdGVyOiBPcHRpb25IYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRTZWxlY3RPcHRpb25IYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yQWxsKE1hdFNlbGVjdE9wdGlvbkhhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGdyb3VwcyBvZiBvcHRpb25zIGluc2lkZSB0aGUgcGFuZWwuICovXG4gIGFzeW5jIGdldE9wdGlvbkdyb3VwcyhmaWx0ZXI6IE9wdGlvbkdyb3VwSGFybmVzc0ZpbHRlcnMgPSB7fSk6XG4gICAgICBQcm9taXNlPE1hdFNlbGVjdE9wdGlvbkdyb3VwSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvckFsbChNYXRTZWxlY3RPcHRpb25Hcm91cEhhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgc2VsZWN0IGlzIG9wZW4uICovXG4gIGFzeW5jIGlzT3BlbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gISEoYXdhaXQgdGhpcy5fb3B0aW9uYWxQYW5lbCgpKTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgc2VsZWN0J3MgcGFuZWwuICovXG4gIGFzeW5jIG9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFhd2FpdCB0aGlzLmlzT3BlbigpKSB7XG4gICAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3RyaWdnZXIoKSkuY2xpY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xpY2tzIHRoZSBvcHRpb25zIHRoYXQgbWF0Y2ggdGhlIHBhc3NlZC1pbiBmaWx0ZXIuIElmIHRoZSBzZWxlY3QgaXMgaW4gbXVsdGktc2VsZWN0aW9uXG4gICAqIG1vZGUgYWxsIG9wdGlvbnMgd2lsbCBiZSBjbGlja2VkLCBvdGhlcndpc2UgdGhlIGhhcm5lc3Mgd2lsbCBwaWNrIHRoZSBmaXJzdCBtYXRjaGluZyBvcHRpb24uXG4gICAqL1xuICBhc3luYyBjbGlja09wdGlvbnMoZmlsdGVyOiBPcHRpb25IYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5vcGVuKCk7XG5cbiAgICBjb25zdCBbaXNNdWx0aXBsZSwgb3B0aW9uc10gPSBhd2FpdCBQcm9taXNlLmFsbChbdGhpcy5pc011bHRpcGxlKCksIHRoaXMuZ2V0T3B0aW9ucyhmaWx0ZXIpXSk7XG5cbiAgICBpZiAob3B0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IEVycm9yKCdTZWxlY3QgZG9lcyBub3QgaGF2ZSBvcHRpb25zIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVyJyk7XG4gICAgfVxuXG4gICAgaWYgKGlzTXVsdGlwbGUpIHtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKG9wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24uY2xpY2soKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBvcHRpb25zWzBdLmNsaWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgc2VsZWN0J3MgcGFuZWwuICovXG4gIGFzeW5jIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChhd2FpdCB0aGlzLmlzT3BlbigpKSB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBtb3N0IGNvbnNpc3RlbnQgd2F5IHRoYXQgd29ya3MgYm90aCBpbiBib3RoIHNpbmdsZSBhbmQgbXVsdGktc2VsZWN0IG1vZGVzLFxuICAgICAgLy8gYnV0IGl0IGFzc3VtZXMgdGhhdCBvbmx5IG9uZSBvdmVybGF5IGlzIG9wZW4gYXQgYSB0aW1lLiBXZSBzaG91bGQgYmUgYWJsZSB0byBtYWtlIGl0XG4gICAgICAvLyBhIGJpdCBtb3JlIHByZWNpc2UgYWZ0ZXIgIzE2NjQ1IHdoZXJlIHdlIGNhbiBkaXNwYXRjaCBhbiBFU0NBUEUgcHJlc3MgdG8gdGhlIGhvc3QgaW5zdGVhZC5cbiAgICAgIHJldHVybiAoYXdhaXQgdGhpcy5fYmFja2Ryb3AoKSkuY2xpY2soKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==