/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard Angular Material tab-label in tests. */
var MatTabHarness = /** @class */ (function (_super) {
    __extends(MatTabHarness, _super);
    function MatTabHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a tab with specific attributes.
     */
    MatTabHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatTabHarness, options)
            .addOption('label', options.label, function (harness, label) { return HarnessPredicate.stringMatches(harness.getLabel(), label); });
    };
    /** Gets the label of the tab. */
    MatTabHarness.prototype.getLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Gets the aria label of the tab. */
    MatTabHarness.prototype.getAriaLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-label')];
                }
            });
        });
    };
    /** Gets the value of the "aria-labelledby" attribute. */
    MatTabHarness.prototype.getAriaLabelledby = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-labelledby')];
                }
            });
        });
    };
    /** Whether the tab is selected. */
    MatTabHarness.prototype.isSelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hostEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        hostEl = _a.sent();
                        return [4 /*yield*/, hostEl.getAttribute('aria-selected')];
                    case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                }
            });
        });
    };
    /** Whether the tab is disabled. */
    MatTabHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hostEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        hostEl = _a.sent();
                        return [4 /*yield*/, hostEl.getAttribute('aria-disabled')];
                    case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                }
            });
        });
    };
    /**
     * Selects the given tab by clicking on the label. Tab cannot be
     * selected if disabled.
     */
    MatTabHarness.prototype.select = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Gets the text content of the tab. */
    MatTabHarness.prototype.getTextContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contentId, contentEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getContentId()];
                    case 1:
                        contentId = _a.sent();
                        return [4 /*yield*/, this.documentRootLocatorFactory().locatorFor("#" + contentId)()];
                    case 2:
                        contentEl = _a.sent();
                        return [2 /*return*/, contentEl.text()];
                }
            });
        });
    };
    /**
     * Gets a `HarnessLoader` that can be used to load harnesses for components within the tab's
     * content area.
     */
    MatTabHarness.prototype.getHarnessLoaderForContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contentId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getContentId()];
                    case 1:
                        contentId = _a.sent();
                        return [2 /*return*/, this.documentRootLocatorFactory().harnessLoaderFor("#" + contentId)];
                }
            });
        });
    };
    /** Gets the element id for the content of the current tab. */
    MatTabHarness.prototype._getContentId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hostEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        hostEl = _a.sent();
                        return [4 /*yield*/, hostEl.getAttribute('aria-controls')];
                    case 2: 
                    // Tabs never have an empty "aria-controls" attribute.
                    return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    MatTabHarness.hostSelector = '.mat-tab-label';
    return MatTabHarness;
}(ComponentHarness));
export { MatTabHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90ZXN0aW5nL3RhYi1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQWlCLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFHdkYsbUZBQW1GO0FBQ25GO0lBQW1DLGlDQUFnQjtJQUFuRDs7SUFxRUEsQ0FBQztJQWxFQzs7T0FFRztJQUNJLGtCQUFJLEdBQVgsVUFBWSxPQUErQjtRQUEvQix3QkFBQSxFQUFBLFlBQStCO1FBQ3pDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO2FBQzlDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFDN0IsVUFBQyxPQUFPLEVBQUUsS0FBSyxJQUFLLE9BQUEsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBekQsQ0FBeUQsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFRCxpQ0FBaUM7SUFDM0IsZ0NBQVEsR0FBZDs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ25DO0lBRUQsc0NBQXNDO0lBQ2hDLG9DQUFZLEdBQWxCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxFQUFDOzs7O0tBQ3ZEO0lBRUQseURBQXlEO0lBQ25ELHlDQUFpQixHQUF2Qjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDOzs7O0tBQzVEO0lBRUQsbUNBQW1DO0lBQzdCLGtDQUFVLEdBQWhCOzs7Ozs0QkFDaUIscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzt3QkFBMUIsTUFBTSxHQUFHLFNBQWlCO3dCQUN4QixxQkFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxFQUFBOzRCQUFsRCxzQkFBTyxDQUFDLFNBQTBDLENBQUMsS0FBSyxNQUFNLEVBQUM7Ozs7S0FDaEU7SUFFRCxtQ0FBbUM7SUFDN0Isa0NBQVUsR0FBaEI7Ozs7OzRCQUNpQixxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUExQixNQUFNLEdBQUcsU0FBaUI7d0JBQ3hCLHFCQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEVBQUE7NEJBQWxELHNCQUFPLENBQUMsU0FBMEMsQ0FBQyxLQUFLLE1BQU0sRUFBQzs7OztLQUNoRTtJQUVEOzs7T0FHRztJQUNHLDhCQUFNLEdBQVo7Ozs7NEJBQ1MscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF4QixxQkFBTSxDQUFDLFNBQWlCLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQWpDLFNBQWlDLENBQUM7Ozs7O0tBQ25DO0lBRUQsd0NBQXdDO0lBQ2xDLHNDQUFjLEdBQXBCOzs7Ozs0QkFDb0IscUJBQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFBOzt3QkFBdEMsU0FBUyxHQUFHLFNBQTBCO3dCQUMxQixxQkFBTSxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBSSxTQUFXLENBQUMsRUFBRSxFQUFBOzt3QkFBakYsU0FBUyxHQUFHLFNBQXFFO3dCQUN2RixzQkFBTyxTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUM7Ozs7S0FDekI7SUFFRDs7O09BR0c7SUFDRyxrREFBMEIsR0FBaEM7Ozs7OzRCQUNvQixxQkFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUE7O3dCQUF0QyxTQUFTLEdBQUcsU0FBMEI7d0JBQzVDLHNCQUFPLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE1BQUksU0FBVyxDQUFDLEVBQUM7Ozs7S0FDNUU7SUFFRCw4REFBOEQ7SUFDaEQscUNBQWEsR0FBM0I7Ozs7OzRCQUNpQixxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUExQixNQUFNLEdBQUcsU0FBaUI7d0JBRXhCLHFCQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEVBQUE7O29CQURsRCxzREFBc0Q7b0JBQ3RELHNCQUFPLENBQUMsU0FBMEMsQ0FBRSxFQUFDOzs7O0tBQ3REO0lBbkVNLDBCQUFZLEdBQUcsZ0JBQWdCLENBQUM7SUFvRXpDLG9CQUFDO0NBQUEsQUFyRUQsQ0FBbUMsZ0JBQWdCLEdBcUVsRDtTQXJFWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc0xvYWRlciwgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtUYWJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi90YWItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBBbmd1bGFyIE1hdGVyaWFsIHRhYi1sYWJlbCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUYWJIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC10YWItbGFiZWwnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHRhYiB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBUYWJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRUYWJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFRhYkhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ2xhYmVsJywgb3B0aW9ucy5sYWJlbCxcbiAgICAgICAgICAgIChoYXJuZXNzLCBsYWJlbCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWwoKSwgbGFiZWwpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsYWJlbCBvZiB0aGUgdGFiLiAqL1xuICBhc3luYyBnZXRMYWJlbCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhcmlhIGxhYmVsIG9mIHRoZSB0YWIuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIFwiYXJpYS1sYWJlbGxlZGJ5XCIgYXR0cmlidXRlLiAqL1xuICBhc3luYyBnZXRBcmlhTGFiZWxsZWRieSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSB0YWIgaXMgc2VsZWN0ZWQuICovXG4gIGFzeW5jIGlzU2VsZWN0ZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgaG9zdEVsID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgcmV0dXJuIChhd2FpdCBob3N0RWwuZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdGFiIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGhvc3RFbCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIHJldHVybiAoYXdhaXQgaG9zdEVsLmdldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcpKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgdGhlIGdpdmVuIHRhYiBieSBjbGlja2luZyBvbiB0aGUgbGFiZWwuIFRhYiBjYW5ub3QgYmVcbiAgICogc2VsZWN0ZWQgaWYgZGlzYWJsZWQuXG4gICAqL1xuICBhc3luYyBzZWxlY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRleHQgY29udGVudCBvZiB0aGUgdGFiLiAqL1xuICBhc3luYyBnZXRUZXh0Q29udGVudCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGNvbnRlbnRJZCA9IGF3YWl0IHRoaXMuX2dldENvbnRlbnRJZCgpO1xuICAgIGNvbnN0IGNvbnRlbnRFbCA9IGF3YWl0IHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKS5sb2NhdG9yRm9yKGAjJHtjb250ZW50SWR9YCkoKTtcbiAgICByZXR1cm4gY29udGVudEVsLnRleHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NMb2FkZXJgIHRoYXQgY2FuIGJlIHVzZWQgdG8gbG9hZCBoYXJuZXNzZXMgZm9yIGNvbXBvbmVudHMgd2l0aGluIHRoZSB0YWInc1xuICAgKiBjb250ZW50IGFyZWEuXG4gICAqL1xuICBhc3luYyBnZXRIYXJuZXNzTG9hZGVyRm9yQ29udGVudCgpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXI+IHtcbiAgICBjb25zdCBjb250ZW50SWQgPSBhd2FpdCB0aGlzLl9nZXRDb250ZW50SWQoKTtcbiAgICByZXR1cm4gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpLmhhcm5lc3NMb2FkZXJGb3IoYCMke2NvbnRlbnRJZH1gKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBlbGVtZW50IGlkIGZvciB0aGUgY29udGVudCBvZiB0aGUgY3VycmVudCB0YWIuICovXG4gIHByaXZhdGUgYXN5bmMgX2dldENvbnRlbnRJZCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGhvc3RFbCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIC8vIFRhYnMgbmV2ZXIgaGF2ZSBhbiBlbXB0eSBcImFyaWEtY29udHJvbHNcIiBhdHRyaWJ1dGUuXG4gICAgcmV0dXJuIChhd2FpdCBob3N0RWwuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJykpITtcbiAgfVxufVxuIl19