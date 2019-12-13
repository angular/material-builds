/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __assign, __awaiter, __extends, __generator, __read } from "tslib";
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
import { MatOptionHarness, MatOptgroupHarness, } from '@angular/material/core/testing';
var PANEL_SELECTOR = '.mat-select-panel';
/** Harness for interacting with a standard mat-select in tests. */
var MatSelectHarness = /** @class */ (function (_super) {
    __extends(MatSelectHarness, _super);
    function MatSelectHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._documentRootLocator = _this.documentRootLocatorFactory();
        _this._backdrop = _this._documentRootLocator.locatorFor('.cdk-overlay-backdrop');
        _this._optionalPanel = _this._documentRootLocator.locatorForOptional(PANEL_SELECTOR);
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
                return [2 /*return*/, this._documentRootLocator.locatorForAll(MatOptionHarness.with(__assign(__assign({}, filter), { ancestor: PANEL_SELECTOR })))()];
            });
        });
    };
    /** Gets the groups of options inside the panel. */
    MatSelectHarness.prototype.getOptionGroups = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._documentRootLocator.locatorForAll(MatOptgroupHarness.with(__assign(__assign({}, filter), { ancestor: PANEL_SELECTOR })))()];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3Rlc3Rpbmcvc2VsZWN0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBQ3hGLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsa0JBQWtCLEdBR25CLE1BQU0sZ0NBQWdDLENBQUM7QUFHeEMsSUFBTSxjQUFjLEdBQUcsbUJBQW1CLENBQUM7QUFFM0MsbUVBQW1FO0FBQ25FO0lBQXNDLG9DQUEwQjtJQUFoRTtRQUFBLHFFQXVIQztRQXRIUywwQkFBb0IsR0FBRyxLQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUN6RCxlQUFTLEdBQUcsS0FBSSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzFFLG9CQUFjLEdBQUcsS0FBSSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlFLGNBQVEsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDbEQsWUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7SUFrSHhELENBQUM7SUE5R0M7Ozs7O09BS0c7SUFDSSxxQkFBSSxHQUFYLFVBQVksT0FBa0M7UUFBbEMsd0JBQUEsRUFBQSxZQUFrQztRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELG1FQUFtRTtJQUM3RCxxQ0FBVSxHQUFoQjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENB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QUUzQztJQS9HTSw2QkFBWSxHQUFHLGFBQWEsQ0FBQztJQWdIdEMsdUJBQUM7Q0FBQSxBQXZIRCxDQUFzQywwQkFBMEIsR0F1SC9EO1NBdkhZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9jb250cm9sJztcbmltcG9ydCB7XG4gIE1hdE9wdGlvbkhhcm5lc3MsXG4gIE1hdE9wdGdyb3VwSGFybmVzcyxcbiAgT3B0aW9uSGFybmVzc0ZpbHRlcnMsXG4gIE9wdGdyb3VwSGFybmVzc0ZpbHRlcnMsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUvdGVzdGluZyc7XG5pbXBvcnQge1NlbGVjdEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3NlbGVjdC1oYXJuZXNzLWZpbHRlcnMnO1xuXG5jb25zdCBQQU5FTF9TRUxFQ1RPUiA9ICcubWF0LXNlbGVjdC1wYW5lbCc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXNlbGVjdCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RIYXJuZXNzIGV4dGVuZHMgTWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3Mge1xuICBwcml2YXRlIF9kb2N1bWVudFJvb3RMb2NhdG9yID0gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpO1xuICBwcml2YXRlIF9iYWNrZHJvcCA9IHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvcignLmNkay1vdmVybGF5LWJhY2tkcm9wJyk7XG4gIHByaXZhdGUgX29wdGlvbmFsUGFuZWwgPSB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JPcHRpb25hbChQQU5FTF9TRUxFQ1RPUik7XG4gIHByaXZhdGUgX3RyaWdnZXIgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtc2VsZWN0LXRyaWdnZXInKTtcbiAgcHJpdmF0ZSBfdmFsdWUgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtc2VsZWN0LXZhbHVlJyk7XG5cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXNlbGVjdCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdFNlbGVjdEhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHNlbGVjdCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTZWxlY3RIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRTZWxlY3RIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFNlbGVjdEhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgc2VsZWN0IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtc2VsZWN0LWRpc2FibGVkJyk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBzZWxlY3QgaXMgdmFsaWQuICovXG4gIGFzeW5jIGlzVmFsaWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbmctaW52YWxpZCcpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyByZXF1aXJlZC4gKi9cbiAgYXN5bmMgaXNSZXF1aXJlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LXNlbGVjdC1yZXF1aXJlZCcpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgc2VsZWN0IGlzIGVtcHR5IChubyB2YWx1ZSBpcyBzZWxlY3RlZCkuICovXG4gIGFzeW5jIGlzRW1wdHkoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1zZWxlY3QtZW1wdHknKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyBpbiBtdWx0aS1zZWxlY3Rpb24gbW9kZS4gKi9cbiAgYXN5bmMgaXNNdWx0aXBsZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBhcmlhTXVsdGlzZWxlY3RhYmxlID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJyk7XG4gICAgcmV0dXJuIChhd2FpdCBhcmlhTXVsdGlzZWxlY3RhYmxlKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgc2VsZWN0J3MgdmFsdWUgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VmFsdWVUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl92YWx1ZSgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgc2VsZWN0IGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgc2VsZWN0IGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgb3B0aW9ucyBpbnNpZGUgdGhlIHNlbGVjdCBwYW5lbC4gKi9cbiAgYXN5bmMgZ2V0T3B0aW9ucyhmaWx0ZXI6IE9taXQ8T3B0aW9uSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+ID0ge30pOlxuICAgIFByb21pc2U8TWF0T3B0aW9uSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvckFsbChNYXRPcHRpb25IYXJuZXNzLndpdGgoe1xuICAgICAgLi4uZmlsdGVyLFxuICAgICAgYW5jZXN0b3I6IFBBTkVMX1NFTEVDVE9SXG4gICAgfSkpKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZ3JvdXBzIG9mIG9wdGlvbnMgaW5zaWRlIHRoZSBwYW5lbC4gKi9cbiAgYXN5bmMgZ2V0T3B0aW9uR3JvdXBzKGZpbHRlcjogT21pdDxPcHRncm91cEhhcm5lc3NGaWx0ZXJzLCAnYW5jZXN0b3InPiA9IHt9KTpcbiAgICBQcm9taXNlPE1hdE9wdGdyb3VwSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvckFsbChNYXRPcHRncm91cEhhcm5lc3Mud2l0aCh7XG4gICAgICAuLi5maWx0ZXIsXG4gICAgICBhbmNlc3RvcjogUEFORUxfU0VMRUNUT1JcbiAgICB9KSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHNlbGVjdCBpcyBvcGVuLiAqL1xuICBhc3luYyBpc09wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEhKGF3YWl0IHRoaXMuX29wdGlvbmFsUGFuZWwoKSk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIHNlbGVjdCdzIHBhbmVsLiAqL1xuICBhc3luYyBvcGVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghYXdhaXQgdGhpcy5pc09wZW4oKSkge1xuICAgICAgcmV0dXJuIChhd2FpdCB0aGlzLl90cmlnZ2VyKCkpLmNsaWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsaWNrcyB0aGUgb3B0aW9ucyB0aGF0IG1hdGNoIHRoZSBwYXNzZWQtaW4gZmlsdGVyLiBJZiB0aGUgc2VsZWN0IGlzIGluIG11bHRpLXNlbGVjdGlvblxuICAgKiBtb2RlIGFsbCBvcHRpb25zIHdpbGwgYmUgY2xpY2tlZCwgb3RoZXJ3aXNlIHRoZSBoYXJuZXNzIHdpbGwgcGljayB0aGUgZmlyc3QgbWF0Y2hpbmcgb3B0aW9uLlxuICAgKi9cbiAgYXN5bmMgY2xpY2tPcHRpb25zKGZpbHRlcjogT3B0aW9uSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMub3BlbigpO1xuXG4gICAgY29uc3QgW2lzTXVsdGlwbGUsIG9wdGlvbnNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW3RoaXMuaXNNdWx0aXBsZSgpLCB0aGlzLmdldE9wdGlvbnMoZmlsdGVyKV0pO1xuXG4gICAgaWYgKG9wdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBFcnJvcignU2VsZWN0IGRvZXMgbm90IGhhdmUgb3B0aW9ucyBtYXRjaGluZyB0aGUgc3BlY2lmaWVkIGZpbHRlcicpO1xuICAgIH1cblxuICAgIGlmIChpc011bHRpcGxlKSB7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChvcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLmNsaWNrKCkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgb3B0aW9uc1swXS5jbGljaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIHNlbGVjdCdzIHBhbmVsLiAqL1xuICBhc3luYyBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoYXdhaXQgdGhpcy5pc09wZW4oKSkge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgbW9zdCBjb25zaXN0ZW50IHdheSB0aGF0IHdvcmtzIGJvdGggaW4gYm90aCBzaW5nbGUgYW5kIG11bHRpLXNlbGVjdCBtb2RlcyxcbiAgICAgIC8vIGJ1dCBpdCBhc3N1bWVzIHRoYXQgb25seSBvbmUgb3ZlcmxheSBpcyBvcGVuIGF0IGEgdGltZS4gV2Ugc2hvdWxkIGJlIGFibGUgdG8gbWFrZSBpdFxuICAgICAgLy8gYSBiaXQgbW9yZSBwcmVjaXNlIGFmdGVyICMxNjY0NSB3aGVyZSB3ZSBjYW4gZGlzcGF0Y2ggYW4gRVNDQVBFIHByZXNzIHRvIHRoZSBob3N0IGluc3RlYWQuXG4gICAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2JhY2tkcm9wKCkpLmNsaWNrKCk7XG4gICAgfVxuICB9XG59XG4iXX0=