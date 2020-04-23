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
/** Harness for interacting with a standard mat-autocomplete in tests. */
var MatAutocompleteHarness = /** @class */ (function (_super) {
    __extends(MatAutocompleteHarness, _super);
    function MatAutocompleteHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._documentRootLocator = _this.documentRootLocatorFactory();
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
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _b = (_a = this._documentRootLocator).locatorForAll;
                        _d = (_c = MatOptionHarness).with;
                        _e = [__assign({}, filters)];
                        _f = {};
                        return [4 /*yield*/, this._getPanelSelector()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_d.apply(_c, [__assign.apply(void 0, _e.concat([(_f.ancestor = _g.sent(), _f)]))])])()];
                }
            });
        });
    };
    /** Gets the option groups inside the autocomplete panel. */
    MatAutocompleteHarness.prototype.getOptionGroups = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _b = (_a = this._documentRootLocator).locatorForAll;
                        _d = (_c = MatOptgroupHarness).with;
                        _e = [__assign({}, filters)];
                        _f = {};
                        return [4 /*yield*/, this._getPanelSelector()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_d.apply(_c, [__assign.apply(void 0, _e.concat([(_f.ancestor = _g.sent(), _f)]))])])()];
                }
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
                    case 0: return [4 /*yield*/, this._getPanel()];
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
    /** Gets the panel associated with this autocomplete trigger. */
    MatAutocompleteHarness.prototype._getPanel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = this._documentRootLocator).locatorForOptional;
                        return [4 /*yield*/, this._getPanelSelector()];
                    case 1: 
                    // Technically this is static, but it needs to be in a
                    // function, because the autocomplete's panel ID can changed.
                    return [2 /*return*/, _b.apply(_a, [_c.sent()])()];
                }
            });
        });
    };
    /** Gets the selector that can be used to find the autocomplete trigger's panel. */
    MatAutocompleteHarness.prototype._getPanelSelector = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = "#";
                        return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_b.sent()).getAttribute('aria-owns')];
                    case 2: return [2 /*return*/, _a + (_b.sent())];
                }
            });
        });
    };
    /** The selector for the host element of a `MatAutocomplete` instance. */
    MatAutocompleteHarness.hostSelector = '.mat-autocomplete-trigger';
    return MatAutocompleteHarness;
}(ComponentHarness));
export { MatAutocompleteHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3RpbmcvYXV0b2NvbXBsZXRlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFDTCxrQkFBa0IsRUFDbEIsZ0JBQWdCLEVBR2pCLE1BQU0sZ0NBQWdDLENBQUM7QUFHeEMseUVBQXlFO0FBQ3pFO0lBQTRDLDBDQUFnQjtJQUE1RDtRQUFBLHFFQXlGQztRQXhGUywwQkFBb0IsR0FBRyxLQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQzs7SUF3Rm5FLENBQUM7SUFuRkM7Ozs7O09BS0c7SUFDSSwyQkFBSSxHQUFYLFVBQVksT0FBd0M7UUFBeEMsd0JBQUEsRUFBQSxZQUF3QztRQUNsRCxPQUFPLElBQUksZ0JBQWdCLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDO2FBQ3ZELFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFDN0IsVUFBQyxPQUFPLEVBQUUsS0FBSyxJQUFLLE9BQUEsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBekQsQ0FBeUQsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFRCxnREFBZ0Q7SUFDMUMseUNBQVEsR0FBZDs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBQzs7OztLQUNqRDtJQUVE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Z0Q7OzRCQUFsRSwwQkFBbUU7Ozs7S0FDcEU7SUFFRCxnRUFBZ0U7SUFDbEQsMENBQVMsR0FBdkI7Ozs7Ozt3QkFHUyxLQUFBLENBQUEsS0FBQSxJQUFJLENBQUMsb0JBQW9CLENBQUEsQ0FBQyxrQkFBa0IsQ0FBQTt3QkFBQyxxQkFBTSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBQTs7b0JBRmxGLHNEQUFzRDtvQkFDdEQsNkRBQTZEO29CQUM3RCxzQkFBTyxjQUE2QyxTQUE4QixFQUFDLEVBQUUsRUFBQzs7OztLQUN2RjtJQUVELG1GQUFtRjtJQUNyRSxrREFBaUIsR0FBL0I7Ozs7Ozs7d0JBQ3FCLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBeEIscUJBQU0sQ0FBQyxTQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxFQUFBOzRCQUEvRCxzQkFBTyxLQUFJLENBQUMsU0FBbUQsQ0FBRyxFQUFDOzs7O0tBQ3BFO0lBckZELHlFQUF5RTtJQUNsRSxtQ0FBWSxHQUFHLDJCQUEyQixDQUFDO0lBcUZwRCw2QkFBQztDQUFBLEFBekZELENBQTRDLGdCQUFnQixHQXlGM0Q7U0F6Rlksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1xuICBNYXRPcHRncm91cEhhcm5lc3MsXG4gIE1hdE9wdGlvbkhhcm5lc3MsXG4gIE9wdGdyb3VwSGFybmVzc0ZpbHRlcnMsXG4gIE9wdGlvbkhhcm5lc3NGaWx0ZXJzXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUvdGVzdGluZyc7XG5pbXBvcnQge0F1dG9jb21wbGV0ZUhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2F1dG9jb21wbGV0ZS1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1hdXRvY29tcGxldGUgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBwcml2YXRlIF9kb2N1bWVudFJvb3RMb2NhdG9yID0gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpO1xuXG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0QXV0b2NvbXBsZXRlYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWF1dG9jb21wbGV0ZS10cmlnZ2VyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0QXV0b2NvbXBsZXRlSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggYXV0b2NvbXBsZXRlIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IEF1dG9jb21wbGV0ZUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEF1dG9jb21wbGV0ZUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0QXV0b2NvbXBsZXRlSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigndmFsdWUnLCBvcHRpb25zLnZhbHVlLFxuICAgICAgICAgICAgKGhhcm5lc3MsIHZhbHVlKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRWYWx1ZSgpLCB2YWx1ZSkpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBhdXRvY29tcGxldGUgaW5wdXQuICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ3ZhbHVlJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIGlucHV0IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgYXV0b2NvbXBsZXRlIGlucHV0LiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBhdXRvY29tcGxldGUgaW5wdXQuICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIEVudGVycyB0ZXh0IGludG8gdGhlIGF1dG9jb21wbGV0ZS4gKi9cbiAgYXN5bmMgZW50ZXJUZXh0KHZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5zZW5kS2V5cyh2YWx1ZSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgb3B0aW9ucyBpbnNpZGUgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC4gKi9cbiAgYXN5bmMgZ2V0T3B0aW9ucyhmaWx0ZXJzOiBPbWl0PE9wdGlvbkhhcm5lc3NGaWx0ZXJzLCAnYW5jZXN0b3InPiA9IHt9KTpcbiAgICBQcm9taXNlPE1hdE9wdGlvbkhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoTWF0T3B0aW9uSGFybmVzcy53aXRoKHtcbiAgICAgIC4uLmZpbHRlcnMsXG4gICAgICBhbmNlc3RvcjogYXdhaXQgdGhpcy5fZ2V0UGFuZWxTZWxlY3RvcigpXG4gICAgfSkpKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgb3B0aW9uIGdyb3VwcyBpbnNpZGUgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC4gKi9cbiAgYXN5bmMgZ2V0T3B0aW9uR3JvdXBzKGZpbHRlcnM6IE9taXQ8T3B0Z3JvdXBIYXJuZXNzRmlsdGVycywgJ2FuY2VzdG9yJz4gPSB7fSk6XG4gICAgUHJvbWlzZTxNYXRPcHRncm91cEhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoTWF0T3B0Z3JvdXBIYXJuZXNzLndpdGgoe1xuICAgICAgLi4uZmlsdGVycyxcbiAgICAgIGFuY2VzdG9yOiBhd2FpdCB0aGlzLl9nZXRQYW5lbFNlbGVjdG9yKClcbiAgICB9KSkoKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBmaXJzdCBvcHRpb24gbWF0Y2hpbmcgdGhlIGdpdmVuIGZpbHRlcnMuICovXG4gIGFzeW5jIHNlbGVjdE9wdGlvbihmaWx0ZXJzOiBPcHRpb25IYXJuZXNzRmlsdGVycyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuZm9jdXMoKTsgLy8gRm9jdXMgdGhlIGlucHV0IHRvIG1ha2Ugc3VyZSB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIHNob3duLlxuICAgIGNvbnN0IG9wdGlvbnMgPSBhd2FpdCB0aGlzLmdldE9wdGlvbnMoZmlsdGVycyk7XG4gICAgaWYgKCFvcHRpb25zLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGEgbWF0LW9wdGlvbiBtYXRjaGluZyAke0pTT04uc3RyaW5naWZ5KGZpbHRlcnMpfWApO1xuICAgIH1cbiAgICBhd2FpdCBvcHRpb25zWzBdLmNsaWNrKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIGlzIG9wZW4uICovXG4gIGFzeW5jIGlzT3BlbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBwYW5lbCA9IGF3YWl0IHRoaXMuX2dldFBhbmVsKCk7XG4gICAgcmV0dXJuICEhcGFuZWwgJiYgYXdhaXQgcGFuZWwuaGFzQ2xhc3MoJ21hdC1hdXRvY29tcGxldGUtdmlzaWJsZScpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBhbmVsIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGF1dG9jb21wbGV0ZSB0cmlnZ2VyLiAqL1xuICBwcml2YXRlIGFzeW5jIF9nZXRQYW5lbCgpIHtcbiAgICAvLyBUZWNobmljYWxseSB0aGlzIGlzIHN0YXRpYywgYnV0IGl0IG5lZWRzIHRvIGJlIGluIGFcbiAgICAvLyBmdW5jdGlvbiwgYmVjYXVzZSB0aGUgYXV0b2NvbXBsZXRlJ3MgcGFuZWwgSUQgY2FuIGNoYW5nZWQuXG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvck9wdGlvbmFsKGF3YWl0IHRoaXMuX2dldFBhbmVsU2VsZWN0b3IoKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzZWxlY3RvciB0aGF0IGNhbiBiZSB1c2VkIHRvIGZpbmQgdGhlIGF1dG9jb21wbGV0ZSB0cmlnZ2VyJ3MgcGFuZWwuICovXG4gIHByaXZhdGUgYXN5bmMgX2dldFBhbmVsU2VsZWN0b3IoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gYCMkeyhhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1vd25zJykpfWA7XG4gIH1cbn1cbiJdfQ==