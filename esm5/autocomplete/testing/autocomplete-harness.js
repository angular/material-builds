/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __assign, __awaiter, __extends, __generator } from "tslib";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatOptgroupHarness, MatOptionHarness } from '@angular/material/core/testing';
/** Selector for the autocomplete panel. */
var PANEL_SELECTOR = '.mat-autocomplete-panel';
/** Harness for interacting with a standard mat-autocomplete in tests. */
var MatAutocompleteHarness = /** @class */ (function (_super) {
    __extends(MatAutocompleteHarness, _super);
    function MatAutocompleteHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._documentRootLocator = _this.documentRootLocatorFactory();
        _this._optionalPanel = _this._documentRootLocator.locatorForOptional(PANEL_SELECTOR);
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatAutocompleteHarness` that meets
     * certain criteria.
     * @param options Options for filtering which autocomplete instances are considered a match.
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
    /** Whether the autocomplete input is disabled. */
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
    /** Focuses the autocomplete input. */
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
    /** Blurs the autocomplete input. */
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
                return [2 /*return*/, this._documentRootLocator.locatorForAll(MatOptionHarness.with(__assign(__assign({}, filters), { ancestor: PANEL_SELECTOR })))()];
            });
        });
    };
    /** Gets the option groups inside the autocomplete panel. */
    MatAutocompleteHarness.prototype.getOptionGroups = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._documentRootLocator.locatorForAll(MatOptgroupHarness.with(__assign(__assign({}, filters), { ancestor: PANEL_SELECTOR })))()];
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
                        return [4 /*yield*/, options[0].click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Whether the autocomplete is open. */
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
    /** The selector for the host element of a `MatAutocomplete` instance. */
    MatAutocompleteHarness.hostSelector = '.mat-autocomplete-trigger';
    return MatAutocompleteHarness;
}(ComponentHarness));
export { MatAutocompleteHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3RpbmcvYXV0b2NvbXBsZXRlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFDTCxrQkFBa0IsRUFDbEIsZ0JBQWdCLEVBR2pCLE1BQU0sZ0NBQWdDLENBQUM7QUFHeEMsMkNBQTJDO0FBQzNDLElBQU0sY0FBYyxHQUFHLHlCQUF5QixDQUFDO0FBRWpELHlFQUF5RTtBQUN6RTtJQUE0QywwQ0FBZ0I7SUFBNUQ7UUFBQSxxRUE4RUM7UUE3RVMsMEJBQW9CLEdBQUcsS0FBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDekQsb0JBQWMsR0FBRyxLQUFJLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUM7O0lBNEV4RixDQUFDO0lBdkVDOzs7OztPQUtHO0lBQ0ksMkJBQUksR0FBWCxVQUFZLE9BQXdDO1FBQXhDLHdCQUFBLEVBQUEsWUFBd0M7UUFDbEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQzthQUN2RCxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQzdCLFVBQUMsT0FBTyxFQUFFLEtBQUssSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQXpELENBQXlELENBQUMsQ0FBQztJQUN6RixDQUFDO0lBRUQsZ0RBQWdEO0lBQzFDLHlDQUFRLEdBQWQ7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M0Q7U0E5RVksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1xuICBNYXRPcHRncm91cEhhcm5lc3MsXG4gIE1hdE9wdGlvbkhhcm5lc3MsXG4gIE9wdGdyb3VwSGFybmVzc0ZpbHRlcnMsXG4gIE9wdGlvbkhhcm5lc3NGaWx0ZXJzXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUvdGVzdGluZyc7XG5pbXBvcnQge0F1dG9jb21wbGV0ZUhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2F1dG9jb21wbGV0ZS1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogU2VsZWN0b3IgZm9yIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG5jb25zdCBQQU5FTF9TRUxFQ1RPUiA9ICcubWF0LWF1dG9jb21wbGV0ZS1wYW5lbCc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LWF1dG9jb21wbGV0ZSBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHByaXZhdGUgX2RvY3VtZW50Um9vdExvY2F0b3IgPSB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCk7XG4gIHByaXZhdGUgX29wdGlvbmFsUGFuZWwgPSB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JPcHRpb25hbChQQU5FTF9TRUxFQ1RPUik7XG5cbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRBdXRvY29tcGxldGVgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtYXV0b2NvbXBsZXRlLXRyaWdnZXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRBdXRvY29tcGxldGVIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBhdXRvY29tcGxldGUgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogQXV0b2NvbXBsZXRlSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0QXV0b2NvbXBsZXRlSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRBdXRvY29tcGxldGVIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd2YWx1ZScsIG9wdGlvbnMudmFsdWUsXG4gICAgICAgICAgICAoaGFybmVzcywgdmFsdWUpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFZhbHVlKCksIHZhbHVlKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIGF1dG9jb21wbGV0ZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgndmFsdWUnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgaW5wdXQgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBhdXRvY29tcGxldGUgaW5wdXQuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIGF1dG9jb21wbGV0ZSBpbnB1dC4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogRW50ZXJzIHRleHQgaW50byB0aGUgYXV0b2NvbXBsZXRlLiAqL1xuICBhc3luYyBlbnRlclRleHQodmFsdWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnNlbmRLZXlzKHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBvcHRpb25zIGluc2lkZSB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAqL1xuICBhc3luYyBnZXRPcHRpb25zKGZpbHRlcnM6IE9taXQ8T3B0aW9uSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+ID0ge30pOlxuICAgIFByb21pc2U8TWF0T3B0aW9uSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvckFsbChNYXRPcHRpb25IYXJuZXNzLndpdGgoe1xuICAgICAgLi4uZmlsdGVycyxcbiAgICAgIGFuY2VzdG9yOiBQQU5FTF9TRUxFQ1RPUlxuICAgIH0pKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG9wdGlvbiBncm91cHMgaW5zaWRlIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIGFzeW5jIGdldE9wdGlvbkdyb3VwcyhmaWx0ZXJzOiBPbWl0PE9wdGdyb3VwSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+ID0ge30pOlxuICAgIFByb21pc2U8TWF0T3B0Z3JvdXBIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yQWxsKE1hdE9wdGdyb3VwSGFybmVzcy53aXRoKHtcbiAgICAgIC4uLmZpbHRlcnMsXG4gICAgICBhbmNlc3RvcjogUEFORUxfU0VMRUNUT1JcbiAgICB9KSkoKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBmaXJzdCBvcHRpb24gbWF0Y2hpbmcgdGhlIGdpdmVuIGZpbHRlcnMuICovXG4gIGFzeW5jIHNlbGVjdE9wdGlvbihmaWx0ZXJzOiBPcHRpb25IYXJuZXNzRmlsdGVycyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuZm9jdXMoKTsgLy8gRm9jdXMgdGhlIGlucHV0IHRvIG1ha2Ugc3VyZSB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIHNob3duLlxuICAgIGNvbnN0IG9wdGlvbnMgPSBhd2FpdCB0aGlzLmdldE9wdGlvbnMoZmlsdGVycyk7XG4gICAgaWYgKCFvcHRpb25zLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGEgbWF0LW9wdGlvbiBtYXRjaGluZyAke0pTT04uc3RyaW5naWZ5KGZpbHRlcnMpfWApO1xuICAgIH1cbiAgICBhd2FpdCBvcHRpb25zWzBdLmNsaWNrKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIGlzIG9wZW4uICovXG4gIGFzeW5jIGlzT3BlbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBwYW5lbCA9IGF3YWl0IHRoaXMuX29wdGlvbmFsUGFuZWwoKTtcbiAgICByZXR1cm4gISFwYW5lbCAmJiBhd2FpdCBwYW5lbC5oYXNDbGFzcygnbWF0LWF1dG9jb21wbGV0ZS12aXNpYmxlJyk7XG4gIH1cbn1cbiJdfQ==