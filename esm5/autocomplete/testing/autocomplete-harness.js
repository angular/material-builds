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
                return [2 /*return*/, this._documentRootLocator.locatorForAll(MatAutocompleteOptionHarness.with(filters))()];
            });
        });
    };
    /** Gets the option groups inside the autocomplete panel. */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3RpbmcvYXV0b2NvbXBsZXRlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXhFLE9BQU8sRUFDTCxpQ0FBaUMsRUFDakMsNEJBQTRCLEVBRzdCLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsMkNBQTJDO0FBQzNDLElBQU0sY0FBYyxHQUFHLHlCQUF5QixDQUFDO0FBRWpELHlFQUF5RTtBQUN6RTtJQUE0QywwQ0FBZ0I7SUFBNUQ7UUFBQSxxRUF3RUM7UUF2RVMsMEJBQW9CLEdBQUcsS0FBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDekQsb0JBQWMsR0FBRyxLQUFJLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUM7O0lBc0V4RixDQUFDO0lBakVDOzs7OztPQUtHO0lBQ0ksMkJBQUksR0FBWCxVQUFZLE9BQXdDO1FBQXhDLHdCQUFBLEVBQUEsWUFBd0M7UUFDbEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQzthQUN2RCxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQzdCLFVBQUMsT0FBTyxFQUFFLEtBQUssSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQXpELENBQXlELENBQUMsQ0FBQztJQUN6RixDQUFDO0lBRUQsZ0RBQWdEO0lBQzFDLHlDQUFRLEdBQWQ7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IEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7QXV0b2NvbXBsZXRlSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vYXV0b2NvbXBsZXRlLWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge1xuICBNYXRBdXRvY29tcGxldGVPcHRpb25Hcm91cEhhcm5lc3MsXG4gIE1hdEF1dG9jb21wbGV0ZU9wdGlvbkhhcm5lc3MsXG4gIE9wdGlvbkdyb3VwSGFybmVzc0ZpbHRlcnMsXG4gIE9wdGlvbkhhcm5lc3NGaWx0ZXJzXG59IGZyb20gJy4vb3B0aW9uLWhhcm5lc3MnO1xuXG4vKiogU2VsZWN0b3IgZm9yIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG5jb25zdCBQQU5FTF9TRUxFQ1RPUiA9ICcubWF0LWF1dG9jb21wbGV0ZS1wYW5lbCc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LWF1dG9jb21wbGV0ZSBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHByaXZhdGUgX2RvY3VtZW50Um9vdExvY2F0b3IgPSB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCk7XG4gIHByaXZhdGUgX29wdGlvbmFsUGFuZWwgPSB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JPcHRpb25hbChQQU5FTF9TRUxFQ1RPUik7XG5cbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRBdXRvY29tcGxldGVgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtYXV0b2NvbXBsZXRlLXRyaWdnZXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRBdXRvY29tcGxldGVIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBhdXRvY29tcGxldGUgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogQXV0b2NvbXBsZXRlSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0QXV0b2NvbXBsZXRlSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRBdXRvY29tcGxldGVIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd2YWx1ZScsIG9wdGlvbnMudmFsdWUsXG4gICAgICAgICAgICAoaGFybmVzcywgdmFsdWUpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFZhbHVlKCksIHZhbHVlKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIGF1dG9jb21wbGV0ZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgndmFsdWUnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgaW5wdXQgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBhdXRvY29tcGxldGUgaW5wdXQuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIGF1dG9jb21wbGV0ZSBpbnB1dC4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogRW50ZXJzIHRleHQgaW50byB0aGUgYXV0b2NvbXBsZXRlLiAqL1xuICBhc3luYyBlbnRlclRleHQodmFsdWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnNlbmRLZXlzKHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBvcHRpb25zIGluc2lkZSB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAqL1xuICBhc3luYyBnZXRPcHRpb25zKGZpbHRlcnM6IE9wdGlvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdEF1dG9jb21wbGV0ZU9wdGlvbkhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoTWF0QXV0b2NvbXBsZXRlT3B0aW9uSGFybmVzcy53aXRoKGZpbHRlcnMpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG9wdGlvbiBncm91cHMgaW5zaWRlIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIGFzeW5jIGdldE9wdGlvbkdyb3VwcyhmaWx0ZXJzOiBPcHRpb25Hcm91cEhhcm5lc3NGaWx0ZXJzID0ge30pOlxuICAgICAgUHJvbWlzZTxNYXRBdXRvY29tcGxldGVPcHRpb25Hcm91cEhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoXG4gICAgICAgIE1hdEF1dG9jb21wbGV0ZU9wdGlvbkdyb3VwSGFybmVzcy53aXRoKGZpbHRlcnMpKSgpO1xuICB9XG5cbiAgLyoqIFNlbGVjdHMgdGhlIGZpcnN0IG9wdGlvbiBtYXRjaGluZyB0aGUgZ2l2ZW4gZmlsdGVycy4gKi9cbiAgYXN5bmMgc2VsZWN0T3B0aW9uKGZpbHRlcnM6IE9wdGlvbkhhcm5lc3NGaWx0ZXJzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5mb2N1cygpOyAvLyBGb2N1cyB0aGUgaW5wdXQgdG8gbWFrZSBzdXJlIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgc2hvd24uXG4gICAgY29uc3Qgb3B0aW9ucyA9IGF3YWl0IHRoaXMuZ2V0T3B0aW9ucyhmaWx0ZXJzKTtcbiAgICBpZiAoIW9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGZpbmQgYSBtYXQtb3B0aW9uIG1hdGNoaW5nICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVycyl9YCk7XG4gICAgfVxuICAgIGF3YWl0IG9wdGlvbnNbMF0uc2VsZWN0KCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIGlzIG9wZW4uICovXG4gIGFzeW5jIGlzT3BlbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBwYW5lbCA9IGF3YWl0IHRoaXMuX29wdGlvbmFsUGFuZWwoKTtcbiAgICByZXR1cm4gISFwYW5lbCAmJiBhd2FpdCBwYW5lbC5oYXNDbGFzcygnbWF0LWF1dG9jb21wbGV0ZS12aXNpYmxlJyk7XG4gIH1cbn1cbiJdfQ==