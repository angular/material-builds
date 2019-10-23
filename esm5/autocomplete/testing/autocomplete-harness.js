/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatAutocompleteOptionGroupHarness, MatAutocompleteOptionHarness } from './option-harness';
/** Selector for the autocomplete panel. */
var PANEL_SELECTOR = '.mat-autocomplete-panel';
/**
 * Harness for interacting with a standard mat-autocomplete in tests.
 * @dynamic
 */
var MatAutocompleteHarness = /** @class */ (function (_super) {
    __extends(MatAutocompleteHarness, _super);
    function MatAutocompleteHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._documentRootLocator = _this.documentRootLocatorFactory();
        _this._optionalPanel = _this._documentRootLocator.locatorForOptional(PANEL_SELECTOR);
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for an autocomplete with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `name` finds an autocomplete with a specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatAutocompleteHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatAutocompleteHarness, options)
            .addOption('value', options.value, function (harness, value) { return HarnessPredicate.stringMatches(harness.getValue(), value); });
    };
    /** Gets the value of the autocomplete input. */
    MatAutocompleteHarness.prototype.getValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getProperty('value')];
                }
            });
        });
    };
    /** Gets a boolean promise indicating if the autocomplete input is disabled. */
    MatAutocompleteHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var disabled, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        disabled = (_b.sent()).getAttribute('disabled');
                        _a = coerceBooleanProperty;
                        return [4 /*yield*/, disabled];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    /** Focuses the input and returns a void promise that indicates when the action is complete. */
    MatAutocompleteHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the input and returns a void promise that indicates when the action is complete. */
    MatAutocompleteHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /** Enters text into the autocomplete. */
    MatAutocompleteHarness.prototype.enterText = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).sendKeys(value)];
                }
            });
        });
    };
    /** Gets the options inside the autocomplete panel. */
    MatAutocompleteHarness.prototype.getOptions = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._documentRootLocator.locatorForAll(MatAutocompleteOptionHarness.with(filters))()];
            });
        });
    };
    /** Gets the groups of options inside the panel. */
    MatAutocompleteHarness.prototype.getOptionGroups = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._documentRootLocator.locatorForAll(MatAutocompleteOptionGroupHarness.with(filters))()];
            });
        });
    };
    /** Selects the first option matching the given filters. */
    MatAutocompleteHarness.prototype.selectOption = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.focus()];
                    case 1:
                        _a.sent(); // Focus the input to make sure the autocomplete panel is shown.
                        return [4 /*yield*/, this.getOptions(filters)];
                    case 2:
                        options = _a.sent();
                        if (!options.length) {
                            throw Error("Could not find a mat-option matching " + JSON.stringify(filters));
                        }
                        return [4 /*yield*/, options[0].select()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Gets whether the autocomplete is open. */
    MatAutocompleteHarness.prototype.isOpen = function () {
        return __awaiter(this, void 0, void 0, function () {
            var panel, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._optionalPanel()];
                    case 1:
                        panel = _b.sent();
                        _a = !!panel;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, panel.hasClass('mat-autocomplete-visible')];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    MatAutocompleteHarness.hostSelector = '.mat-autocomplete-trigger';
    return MatAutocompleteHarness;
}(ComponentHarness));
export { MatAutocompleteHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3RpbmcvYXV0b2NvbXBsZXRlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXhFLE9BQU8sRUFDTCxpQ0FBaUMsRUFDakMsNEJBQTRCLEVBRzdCLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsMkNBQTJDO0FBQzNDLElBQU0sY0FBYyxHQUFHLHlCQUF5QixDQUFDO0FBRWpEOzs7R0FHRztBQUNIO0lBQTRDLDBDQUFnQjtJQUE1RDtRQUFBLHFFQXdFQztRQXZFUywwQkFBb0IsR0FBRyxLQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUN6RCxvQkFBYyxHQUFHLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7SUFzRXhGLENBQUM7SUFsRUM7Ozs7OztPQU1HO0lBQ0ksMkJBQUksR0FBWCxVQUFZLE9BQXdDO1FBQXhDLHdCQUFBLEVBQUEsWUFBd0M7UUFDbEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQzthQUN2RCxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQzdCLFVBQUMsT0FBTyxFQUFFLEtBQUssSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQXpELENBQXlELENBQUMsQ0FBQztJQUN6RixDQUFDO0lBRUQsZ0RBQWdEO0lBQzFDLHlDQUFRLEdBQWQ7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUM7Ozs7S0FDakQ7SUFFRCwrRUFBK0U7SUFDekUsMkNBQVUsR0FBaEI7Ozs7OzRCQUNvQixxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUE3QixRQUFRLEdBQUcsQ0FBQyxTQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQzt3QkFDdEQsS0FBQSxxQkFBcUIsQ0FBQTt3QkFBQyxxQkFBTSxRQUFRLEVBQUE7NEJBQTNDLHNCQUFPLGtCQUFzQixTQUFjLEVBQUMsRUFBQzs7OztLQUM5QztJQUVELCtGQUErRjtJQUN6RixzQ0FBSyxHQUFYOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUM7Ozs7S0FDcEM7SUFFRCw2RkFBNkY7SUFDdkYscUNBQUksR0FBVjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ25DO0lBRUQseUNBQXlDO0lBQ25DLDBDQUFTLEdBQWYsVUFBZ0IsS0FBYTs7Ozs0QkFDbkIscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUM7Ozs7S0FDNUM7SUFFRCxzREFBc0Q7SUFDaEQsMkNBQVUsR0FBaEIsVUFBaUIsT0FBa0M7UUFBbEMsd0JBQUEsRUFBQSxZQUFrQzs7O2dCQUNqRCxzQkFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUM7OztLQUM5RjtJQUVELG1EQUFtRDtJQUM3QyxnREFBZSxHQUFyQixVQUFzQixPQUF1QztRQUF2Qyx3QkFBQSxFQUFBLFlBQXVDOzs7Z0JBRTNELHNCQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQzFDLGlDQUFpQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUM7OztLQUN4RDtJQUVELDJEQUEyRDtJQUNyRCw2Q0FBWSxHQUFsQixVQUFtQixPQUE2Qjs7Ozs7NEJBQzlDLHFCQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQWxCLFNBQWtCLENBQUMsQ0FBQyxnRUFBZ0U7d0JBQ3BFLHFCQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUE7O3dCQUF4QyxPQUFPLEdBQUcsU0FBOEI7d0JBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFOzRCQUNuQixNQUFNLEtBQUssQ0FBQywwQ0FBd0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUcsQ0FBQyxDQUFDO3lCQUNoRjt3QkFDRCxxQkFBTSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUE7O3dCQUF6QixTQUF5QixDQUFDOzs7OztLQUMzQjtJQUVELDZDQUE2QztJQUN2Qyx1Q0FBTSxHQUFaOzs7Ozs0QkFDZ0IscUJBQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFBOzt3QkFBbkMsS0FBSyxHQUFHLFNBQTJCO3dCQUNsQyxLQUFBLENBQUMsQ0FBQyxLQUFLLENBQUE7aUNBQVAsd0JBQU87d0JBQUkscUJBQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQywwQkFBMEIsQ0FBQyxFQUFBOzs4QkFBaEQsU0FBZ0Q7OzRCQUFsRSwwQkFBbUU7Ozs7S0FDcEU7SUFuRU0sbUNBQVksR0FBRywyQkFBMkIsQ0FBQztJQW9FcEQsNkJBQUM7Q0FBQSxBQXhFRCxDQUE0QyxnQkFBZ0IsR0F3RTNEO1NBeEVZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtBdXRvY29tcGxldGVIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9hdXRvY29tcGxldGUtaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7XG4gIE1hdEF1dG9jb21wbGV0ZU9wdGlvbkdyb3VwSGFybmVzcyxcbiAgTWF0QXV0b2NvbXBsZXRlT3B0aW9uSGFybmVzcyxcbiAgT3B0aW9uR3JvdXBIYXJuZXNzRmlsdGVycyxcbiAgT3B0aW9uSGFybmVzc0ZpbHRlcnNcbn0gZnJvbSAnLi9vcHRpb24taGFybmVzcyc7XG5cbi8qKiBTZWxlY3RvciBmb3IgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC4gKi9cbmNvbnN0IFBBTkVMX1NFTEVDVE9SID0gJy5tYXQtYXV0b2NvbXBsZXRlLXBhbmVsJztcblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LWF1dG9jb21wbGV0ZSBpbiB0ZXN0cy5cbiAqIEBkeW5hbWljXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHByaXZhdGUgX2RvY3VtZW50Um9vdExvY2F0b3IgPSB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCk7XG4gIHByaXZhdGUgX29wdGlvbmFsUGFuZWwgPSB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JPcHRpb25hbChQQU5FTF9TRUxFQ1RPUik7XG5cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWF1dG9jb21wbGV0ZS10cmlnZ2VyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYW4gYXV0b2NvbXBsZXRlIHdpdGhcbiAgICogc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2g6XG4gICAqICAgLSBgbmFtZWAgZmluZHMgYW4gYXV0b2NvbXBsZXRlIHdpdGggYSBzcGVjaWZpYyBuYW1lLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IEF1dG9jb21wbGV0ZUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEF1dG9jb21wbGV0ZUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0QXV0b2NvbXBsZXRlSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigndmFsdWUnLCBvcHRpb25zLnZhbHVlLFxuICAgICAgICAgICAgKGhhcm5lc3MsIHZhbHVlKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRWYWx1ZSgpLCB2YWx1ZSkpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBhdXRvY29tcGxldGUgaW5wdXQuICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ3ZhbHVlJyk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBhdXRvY29tcGxldGUgaW5wdXQgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBpbnB1dCBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZSBhY3Rpb24gaXMgY29tcGxldGUuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIGlucHV0IGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogRW50ZXJzIHRleHQgaW50byB0aGUgYXV0b2NvbXBsZXRlLiAqL1xuICBhc3luYyBlbnRlclRleHQodmFsdWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnNlbmRLZXlzKHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBvcHRpb25zIGluc2lkZSB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAqL1xuICBhc3luYyBnZXRPcHRpb25zKGZpbHRlcnM6IE9wdGlvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdEF1dG9jb21wbGV0ZU9wdGlvbkhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoTWF0QXV0b2NvbXBsZXRlT3B0aW9uSGFybmVzcy53aXRoKGZpbHRlcnMpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGdyb3VwcyBvZiBvcHRpb25zIGluc2lkZSB0aGUgcGFuZWwuICovXG4gIGFzeW5jIGdldE9wdGlvbkdyb3VwcyhmaWx0ZXJzOiBPcHRpb25Hcm91cEhhcm5lc3NGaWx0ZXJzID0ge30pOlxuICAgICAgUHJvbWlzZTxNYXRBdXRvY29tcGxldGVPcHRpb25Hcm91cEhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoXG4gICAgICAgIE1hdEF1dG9jb21wbGV0ZU9wdGlvbkdyb3VwSGFybmVzcy53aXRoKGZpbHRlcnMpKSgpO1xuICB9XG5cbiAgLyoqIFNlbGVjdHMgdGhlIGZpcnN0IG9wdGlvbiBtYXRjaGluZyB0aGUgZ2l2ZW4gZmlsdGVycy4gKi9cbiAgYXN5bmMgc2VsZWN0T3B0aW9uKGZpbHRlcnM6IE9wdGlvbkhhcm5lc3NGaWx0ZXJzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5mb2N1cygpOyAvLyBGb2N1cyB0aGUgaW5wdXQgdG8gbWFrZSBzdXJlIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgc2hvd24uXG4gICAgY29uc3Qgb3B0aW9ucyA9IGF3YWl0IHRoaXMuZ2V0T3B0aW9ucyhmaWx0ZXJzKTtcbiAgICBpZiAoIW9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGZpbmQgYSBtYXQtb3B0aW9uIG1hdGNoaW5nICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVycyl9YCk7XG4gICAgfVxuICAgIGF3YWl0IG9wdGlvbnNbMF0uc2VsZWN0KCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBhdXRvY29tcGxldGUgaXMgb3Blbi4gKi9cbiAgYXN5bmMgaXNPcGVuKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHBhbmVsID0gYXdhaXQgdGhpcy5fb3B0aW9uYWxQYW5lbCgpO1xuICAgIHJldHVybiAhIXBhbmVsICYmIGF3YWl0IHBhbmVsLmhhc0NsYXNzKCdtYXQtYXV0b2NvbXBsZXRlLXZpc2libGUnKTtcbiAgfVxufVxuIl19