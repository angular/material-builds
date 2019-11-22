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
     * Gets a `HarnessPredicate` that can be used to search for a `MatTabHarness` that meets
     * certain criteria.
     * @param options Options for filtering which tab instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
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
    /** Gets the aria-label of the tab. */
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
    /** Selects the given tab by clicking on the label. Tab cannot be selected if disabled. */
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
    /** The selector for the host element of a `MatTab` instance. */
    MatTabHarness.hostSelector = '.mat-tab-label';
    return MatTabHarness;
}(ComponentHarness));
export { MatTabHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90ZXN0aW5nL3RhYi1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQWlCLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFHdkYsbUZBQW1GO0FBQ25GO0lBQW1DLGlDQUFnQjtJQUFuRDs7SUFzRUEsQ0FBQztJQWxFQzs7Ozs7T0FLRztJQUNJLGtCQUFJLEdBQVgsVUFBWSxPQUErQjtRQUEvQix3QkFBQSxFQUFBLFlBQStCO1FBQ3pDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO2FBQzlDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFDN0IsVUFBQyxPQUFPLEVBQUUsS0FBSyxJQUFLLE9BQUEsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBekQsQ0FBeUQsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFRCxpQ0FBaUM7SUFDM0IsZ0NBQVEsR0FBZDs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ25DO0lBRUQsc0NBQXNDO0lBQ2hDLG9DQUFZLEdBQWxCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxFQUFDOzs7O0tBQ3ZEO0lBRUQseURBQXlEO0lBQ25ELHlDQUFpQixHQUF2Qjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDOzs7O0tBQzVEO0lBRUQsbUNBQW1DO0lBQzdCLGtDQUFVLEdBQWhCOzs7Ozs0QkFDaUIscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzt3QkFBMUIsTUFBTSxHQUFHLFNBQWlCO3dCQUN4QixxQkFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxFQUFBOzRCQUFsRCxzQkFBTyxDQUFDLFNBQTBDLENBQUMsS0FBSyxNQUFNLEVBQUM7Ozs7S0FDaEU7SUFFRCxtQ0FBbUM7SUFDN0Isa0NBQVUsR0FBaEI7Ozs7OzRCQUNpQixxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUExQixNQUFNLEdBQUcsU0FBaUI7d0JBQ3hCLHFCQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEVBQUE7NEJBQWxELHNCQUFPLENBQUMsU0FBMEMsQ0FBQyxLQUFLLE1BQU0sRUFBQzs7OztLQUNoRTtJQUVELDBGQUEwRjtJQUNwRiw4QkFBTSxHQUFaOzs7OzRCQUNTLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBeEIscUJBQU0sQ0FBQyxTQUFpQixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUFqQyxTQUFpQyxDQUFDOzs7OztLQUNuQztJQUVELHdDQUF3QztJQUNsQyxzQ0FBYyxHQUFwQjs7Ozs7NEJBQ29CLHFCQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBQTs7d0JBQXRDLFNBQVMsR0FBRyxTQUEwQjt3QkFDMUIscUJBQU0sSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsVUFBVSxDQUFDLE1BQUksU0FBVyxDQUFDLEVBQUUsRUFBQTs7d0JBQWpGLFNBQVMsR0FBRyxTQUFxRTt3QkFDdkYsc0JBQU8sU0FBUyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ3pCO0lBRUQ7OztPQUdHO0lBQ0csa0RBQTBCLEdBQWhDOzs7Ozs0QkFDb0IscUJBQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFBOzt3QkFBdEMsU0FBUyxHQUFHLFNBQTBCO3dCQUM1QyxzQkFBTyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFJLFNBQVcsQ0FBQyxFQUFDOzs7O0tBQzVFO0lBRUQsOERBQThEO0lBQ2hELHFDQUFhLEdBQTNCOzs7Ozs0QkFDaUIscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzt3QkFBMUIsTUFBTSxHQUFHLFNBQWlCO3dCQUV4QixxQkFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxFQUFBOztvQkFEbEQsc0RBQXNEO29CQUN0RCxzQkFBTyxDQUFDLFNBQTBDLENBQUUsRUFBQzs7OztLQUN0RDtJQXBFRCxnRUFBZ0U7SUFDekQsMEJBQVksR0FBRyxnQkFBZ0IsQ0FBQztJQW9FekMsb0JBQUM7Q0FBQSxBQXRFRCxDQUFtQyxnQkFBZ0IsR0FzRWxEO1NBdEVZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzTG9hZGVyLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1RhYkhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3RhYi1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIEFuZ3VsYXIgTWF0ZXJpYWwgdGFiLWxhYmVsIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRhYkhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRUYWJgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtdGFiLWxhYmVsJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0VGFiSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggdGFiIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFRhYkhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFRhYkhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0VGFiSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbignbGFiZWwnLCBvcHRpb25zLmxhYmVsLFxuICAgICAgICAgICAgKGhhcm5lc3MsIGxhYmVsKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRMYWJlbCgpLCBsYWJlbCkpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGxhYmVsIG9mIHRoZSB0YWIuICovXG4gIGFzeW5jIGdldExhYmVsKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGFyaWEtbGFiZWwgb2YgdGhlIHRhYi4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgXCJhcmlhLWxhYmVsbGVkYnlcIiBhdHRyaWJ1dGUuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbGxlZGJ5KCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRhYiBpcyBzZWxlY3RlZC4gKi9cbiAgYXN5bmMgaXNTZWxlY3RlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBob3N0RWwgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICByZXR1cm4gKGF3YWl0IGhvc3RFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSkgPT09ICd0cnVlJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSB0YWIgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgaG9zdEVsID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgcmV0dXJuIChhd2FpdCBob3N0RWwuZ2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJykpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKiogU2VsZWN0cyB0aGUgZ2l2ZW4gdGFiIGJ5IGNsaWNraW5nIG9uIHRoZSBsYWJlbC4gVGFiIGNhbm5vdCBiZSBzZWxlY3RlZCBpZiBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgc2VsZWN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IGNvbnRlbnQgb2YgdGhlIHRhYi4gKi9cbiAgYXN5bmMgZ2V0VGV4dENvbnRlbnQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBjb250ZW50SWQgPSBhd2FpdCB0aGlzLl9nZXRDb250ZW50SWQoKTtcbiAgICBjb25zdCBjb250ZW50RWwgPSBhd2FpdCB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCkubG9jYXRvckZvcihgIyR7Y29udGVudElkfWApKCk7XG4gICAgcmV0dXJuIGNvbnRlbnRFbC50ZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzTG9hZGVyYCB0aGF0IGNhbiBiZSB1c2VkIHRvIGxvYWQgaGFybmVzc2VzIGZvciBjb21wb25lbnRzIHdpdGhpbiB0aGUgdGFiJ3NcbiAgICogY29udGVudCBhcmVhLlxuICAgKi9cbiAgYXN5bmMgZ2V0SGFybmVzc0xvYWRlckZvckNvbnRlbnQoKTogUHJvbWlzZTxIYXJuZXNzTG9hZGVyPiB7XG4gICAgY29uc3QgY29udGVudElkID0gYXdhaXQgdGhpcy5fZ2V0Q29udGVudElkKCk7XG4gICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKS5oYXJuZXNzTG9hZGVyRm9yKGAjJHtjb250ZW50SWR9YCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZWxlbWVudCBpZCBmb3IgdGhlIGNvbnRlbnQgb2YgdGhlIGN1cnJlbnQgdGFiLiAqL1xuICBwcml2YXRlIGFzeW5jIF9nZXRDb250ZW50SWQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBob3N0RWwgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICAvLyBUYWJzIG5ldmVyIGhhdmUgYW4gZW1wdHkgXCJhcmlhLWNvbnRyb2xzXCIgYXR0cmlidXRlLlxuICAgIHJldHVybiAoYXdhaXQgaG9zdEVsLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKSE7XG4gIH1cbn1cbiJdfQ==