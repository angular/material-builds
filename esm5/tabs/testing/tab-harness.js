/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/**
 * Harness for interacting with a standard Angular Material tab-label in tests.
 * @dynamic
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90ZXN0aW5nL3RhYi1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQWlCLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFHdkY7OztHQUdHO0FBQ0g7SUFBbUMsaUNBQWdCO0lBQW5EOztJQXFFQSxDQUFDO0lBbEVDOztPQUVHO0lBQ0ksa0JBQUksR0FBWCxVQUFZLE9BQStCO1FBQS9CLHdCQUFBLEVBQUEsWUFBK0I7UUFDekMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUM7YUFDOUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUM3QixVQUFDLE9BQU8sRUFBRSxLQUFLLElBQUssT0FBQSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUF6RCxDQUF5RCxDQUFDLENBQUM7SUFDekYsQ0FBQztJQUVELGlDQUFpQztJQUMzQixnQ0FBUSxHQUFkOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUM7Ozs7S0FDbkM7SUFFRCxzQ0FBc0M7SUFDaEMsb0NBQVksR0FBbEI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQUM7Ozs7S0FDdkQ7SUFFRCx5REFBeUQ7SUFDbkQseUNBQWlCLEdBQXZCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLEVBQUM7Ozs7S0FDNUQ7SUFFRCxtQ0FBbUM7SUFDN0Isa0NBQVUsR0FBaEI7Ozs7OzRCQUNpQixxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUExQixNQUFNLEdBQUcsU0FBaUI7d0JBQ3hCLHFCQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEVBQUE7NEJBQWxELHNCQUFPLENBQUMsU0FBMEMsQ0FBQyxLQUFLLE1BQU0sRUFBQzs7OztLQUNoRTtJQUVELG1DQUFtQztJQUM3QixrQ0FBVSxHQUFoQjs7Ozs7NEJBQ2lCLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQTFCLE1BQU0sR0FBRyxTQUFpQjt3QkFDeEIscUJBQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsRUFBQTs0QkFBbEQsc0JBQU8sQ0FBQyxTQUEwQyxDQUFDLEtBQUssTUFBTSxFQUFDOzs7O0tBQ2hFO0lBRUQ7OztPQUdHO0lBQ0csOEJBQU0sR0FBWjs7Ozs0QkFDUyxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXhCLHFCQUFNLENBQUMsU0FBaUIsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBakMsU0FBaUMsQ0FBQzs7Ozs7S0FDbkM7SUFFRCx3Q0FBd0M7SUFDbEMsc0NBQWMsR0FBcEI7Ozs7OzRCQUNvQixxQkFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUE7O3dCQUF0QyxTQUFTLEdBQUcsU0FBMEI7d0JBQzFCLHFCQUFNLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFJLFNBQVcsQ0FBQyxFQUFFLEVBQUE7O3dCQUFqRixTQUFTLEdBQUcsU0FBcUU7d0JBQ3ZGLHNCQUFPLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBQzs7OztLQUN6QjtJQUVEOzs7T0FHRztJQUNHLGtEQUEwQixHQUFoQzs7Ozs7NEJBQ29CLHFCQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBQTs7d0JBQXRDLFNBQVMsR0FBRyxTQUEwQjt3QkFDNUMsc0JBQU8sSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsZ0JBQWdCLENBQUMsTUFBSSxTQUFXLENBQUMsRUFBQzs7OztLQUM1RTtJQUVELDhEQUE4RDtJQUNoRCxxQ0FBYSxHQUEzQjs7Ozs7NEJBQ2lCLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQTFCLE1BQU0sR0FBRyxTQUFpQjt3QkFFeEIscUJBQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsRUFBQTs7b0JBRGxELHNEQUFzRDtvQkFDdEQsc0JBQU8sQ0FBQyxTQUEwQyxDQUFFLEVBQUM7Ozs7S0FDdEQ7SUFuRU0sMEJBQVksR0FBRyxnQkFBZ0IsQ0FBQztJQW9FekMsb0JBQUM7Q0FBQSxBQXJFRCxDQUFtQyxnQkFBZ0IsR0FxRWxEO1NBckVZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzTG9hZGVyLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1RhYkhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3RhYi1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBBbmd1bGFyIE1hdGVyaWFsIHRhYi1sYWJlbCBpbiB0ZXN0cy5cbiAqIEBkeW5hbWljXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUYWJIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC10YWItbGFiZWwnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHRhYiB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBUYWJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRUYWJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFRhYkhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ2xhYmVsJywgb3B0aW9ucy5sYWJlbCxcbiAgICAgICAgICAgIChoYXJuZXNzLCBsYWJlbCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWwoKSwgbGFiZWwpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsYWJlbCBvZiB0aGUgdGFiLiAqL1xuICBhc3luYyBnZXRMYWJlbCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhcmlhIGxhYmVsIG9mIHRoZSB0YWIuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIFwiYXJpYS1sYWJlbGxlZGJ5XCIgYXR0cmlidXRlLiAqL1xuICBhc3luYyBnZXRBcmlhTGFiZWxsZWRieSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSB0YWIgaXMgc2VsZWN0ZWQuICovXG4gIGFzeW5jIGlzU2VsZWN0ZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgaG9zdEVsID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgcmV0dXJuIChhd2FpdCBob3N0RWwuZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdGFiIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGhvc3RFbCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIHJldHVybiAoYXdhaXQgaG9zdEVsLmdldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcpKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgdGhlIGdpdmVuIHRhYiBieSBjbGlja2luZyBvbiB0aGUgbGFiZWwuIFRhYiBjYW5ub3QgYmVcbiAgICogc2VsZWN0ZWQgaWYgZGlzYWJsZWQuXG4gICAqL1xuICBhc3luYyBzZWxlY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRleHQgY29udGVudCBvZiB0aGUgdGFiLiAqL1xuICBhc3luYyBnZXRUZXh0Q29udGVudCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGNvbnRlbnRJZCA9IGF3YWl0IHRoaXMuX2dldENvbnRlbnRJZCgpO1xuICAgIGNvbnN0IGNvbnRlbnRFbCA9IGF3YWl0IHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKS5sb2NhdG9yRm9yKGAjJHtjb250ZW50SWR9YCkoKTtcbiAgICByZXR1cm4gY29udGVudEVsLnRleHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NMb2FkZXJgIHRoYXQgY2FuIGJlIHVzZWQgdG8gbG9hZCBoYXJuZXNzZXMgZm9yIGNvbXBvbmVudHMgd2l0aGluIHRoZSB0YWInc1xuICAgKiBjb250ZW50IGFyZWEuXG4gICAqL1xuICBhc3luYyBnZXRIYXJuZXNzTG9hZGVyRm9yQ29udGVudCgpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXI+IHtcbiAgICBjb25zdCBjb250ZW50SWQgPSBhd2FpdCB0aGlzLl9nZXRDb250ZW50SWQoKTtcbiAgICByZXR1cm4gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpLmhhcm5lc3NMb2FkZXJGb3IoYCMke2NvbnRlbnRJZH1gKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBlbGVtZW50IGlkIGZvciB0aGUgY29udGVudCBvZiB0aGUgY3VycmVudCB0YWIuICovXG4gIHByaXZhdGUgYXN5bmMgX2dldENvbnRlbnRJZCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGhvc3RFbCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIC8vIFRhYnMgbmV2ZXIgaGF2ZSBhbiBlbXB0eSBcImFyaWEtY29udHJvbHNcIiBhdHRyaWJ1dGUuXG4gICAgcmV0dXJuIChhd2FpdCBob3N0RWwuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJykpITtcbiAgfVxufVxuIl19