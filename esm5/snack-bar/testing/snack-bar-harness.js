/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-snack-bar in tests. */
var MatSnackBarHarness = /** @class */ (function (_super) {
    __extends(MatSnackBarHarness, _super);
    function MatSnackBarHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._simpleSnackBar = _this.locatorForOptional('.mat-simple-snackbar');
        _this._simpleSnackBarMessage = _this.locatorFor('.mat-simple-snackbar > span');
        _this._simpleSnackBarActionButton = _this.locatorForOptional('.mat-simple-snackbar-action > button');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a snack-bar with
     * specific attributes.
     * @param options Options for narrowing the search.
     *   - `selector` finds a snack-bar that matches the given selector. Note that the
     *                selector must match the snack-bar container element.
     * @return `HarnessPredicate` configured with the given options.
     */
    MatSnackBarHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatSnackBarHarness, options);
    };
    /**
     * Gets the role of the snack-bar. The role of a snack-bar is determined based
     * on the ARIA politeness specified in the snack-bar config.
     */
    MatSnackBarHarness.prototype.getRole = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('role')];
                }
            });
        });
    };
    /**
     * Gets whether the snack-bar has an action. Method cannot be
     * used for snack-bar's with custom content.
     */
    MatSnackBarHarness.prototype.hasAction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._assertSimpleSnackBar()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._simpleSnackBarActionButton()];
                    case 2: return [2 /*return*/, (_a.sent()) !== null];
                }
            });
        });
    };
    /**
     * Gets the description of the snack-bar. Method cannot be
     * used for snack-bar's without action or with custom content.
     */
    MatSnackBarHarness.prototype.getActionDescription = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._assertSimpleSnackBarWithAction()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._simpleSnackBarActionButton()];
                    case 2: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /**
     * Dismisses the snack-bar by clicking the action button. Method cannot
     * be used for snack-bar's without action or with custom content.
     */
    MatSnackBarHarness.prototype.dismissWithAction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._assertSimpleSnackBarWithAction()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._simpleSnackBarActionButton()];
                    case 2: return [4 /*yield*/, (_a.sent()).click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the message of the snack-bar. Method cannot be used for
     * snack-bar's with custom content.
     */
    MatSnackBarHarness.prototype.getMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._assertSimpleSnackBar()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._simpleSnackBarMessage()];
                    case 2: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /**
     * Asserts that the current snack-bar does not use custom content. Throws if
     * custom content is used.
     */
    MatSnackBarHarness.prototype._assertSimpleSnackBar = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._isSimpleSnackBar()];
                    case 1:
                        if (!(_a.sent())) {
                            throw new Error('Method cannot be used for snack-bar with custom content.');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Asserts that the current snack-bar does not use custom content and has
     * an action defined. Otherwise an error will be thrown.
     */
    MatSnackBarHarness.prototype._assertSimpleSnackBarWithAction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._assertSimpleSnackBar()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.hasAction()];
                    case 2:
                        if (!(_a.sent())) {
                            throw new Error('Method cannot be used for standard snack-bar without action.');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Gets whether the snack-bar is using the default content template. */
    MatSnackBarHarness.prototype._isSimpleSnackBar = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._simpleSnackBar()];
                    case 1: return [2 /*return*/, (_a.sent()) !== null];
                }
            });
        });
    };
    // Developers can provide a custom component or template for the
    // snackbar. The canonical snack-bar parent is the "MatSnackBarContainer".
    MatSnackBarHarness.hostSelector = '.mat-snack-bar-container';
    return MatSnackBarHarness;
}(ComponentHarness));
export { MatSnackBarHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc25hY2stYmFyL3Rlc3Rpbmcvc25hY2stYmFyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFLHNFQUFzRTtBQUN0RTtJQUF3QyxzQ0FBZ0I7SUFBeEQ7UUFBQSxxRUE0RkM7UUF2RlMscUJBQWUsR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNsRSw0QkFBc0IsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDeEUsaUNBQTJCLEdBQy9CLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDOztJQW9GdEUsQ0FBQztJQWxGQzs7Ozs7OztPQU9HO0lBQ0ksdUJBQUksR0FBWCxVQUFZLE9BQW9DO1FBQXBDLHdCQUFBLEVBQUEsWUFBb0M7UUFDOUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7O09BR0c7SUFDRyxvQ0FBTyxHQUFiOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBbUMsRUFBQzs7OztLQUNuRjtJQUVEOzs7T0FHRztJQUNHLHNDQUFTLEdBQWY7Ozs7NEJBQ0UscUJBQU0sSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUE7O3dCQUFsQyxTQUFrQyxDQUFDO3dCQUMzQixxQkFBTSxJQUFJLENBQUMsMkJBQTJCLEVBQUUsRUFBQTs0QkFBaEQsc0JBQU8sQ0FBQyxTQUF3QyxDQUFDLEtBQUssSUFBSSxFQUFDOzs7O0tBQzVEO0lBRUQ7OztPQUdHO0lBQ0csaURBQW9CLEdBQTFCOzs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQywrQkFBK0IsRUFBRSxFQUFBOzt3QkFBNUMsU0FBNEMsQ0FBQzt3QkFDckMscUJBQU0sSUFBSSxDQUFDLDJCQUEyQixFQUFFLEVBQUE7NEJBQWhELHNCQUFPLENBQUMsU0FBd0MsQ0FBRSxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQzNEO0lBR0Q7OztPQUdHO0lBQ0csOENBQWlCLEdBQXZCOzs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQywrQkFBK0IsRUFBRSxFQUFBOzt3QkFBNUMsU0FBNEMsQ0FBQzt3QkFDdEMscUJBQU0sSUFBSSxDQUFDLDJCQUEyQixFQUFFLEVBQUE7NEJBQS9DLHFCQUFNLENBQUMsU0FBd0MsQ0FBRSxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBekQsU0FBeUQsQ0FBQzs7Ozs7S0FDM0Q7SUFFRDs7O09BR0c7SUFDRyx1Q0FBVSxHQUFoQjs7Ozs0QkFDRSxxQkFBTSxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBQTs7d0JBQWxDLFNBQWtDLENBQUM7d0JBQzNCLHFCQUFNLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxFQUFBOzRCQUEzQyxzQkFBTyxDQUFDLFNBQW1DLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQzs7OztLQUNyRDtJQUVEOzs7T0FHRztJQUNXLGtEQUFxQixHQUFuQzs7Ozs0QkFDTyxxQkFBTSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBQTs7d0JBQW5DLElBQUksQ0FBQyxDQUFBLFNBQThCLENBQUEsRUFBRTs0QkFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO3lCQUM3RTs7Ozs7S0FDRjtJQUVEOzs7T0FHRztJQUNXLDREQUErQixHQUE3Qzs7Ozs0QkFDRSxxQkFBTSxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBQTs7d0JBQWxDLFNBQWtDLENBQUM7d0JBQzlCLHFCQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQTs7d0JBQTNCLElBQUksQ0FBQyxDQUFBLFNBQXNCLENBQUEsRUFBRTs0QkFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO3lCQUNqRjs7Ozs7S0FDRjtJQUVELHdFQUF3RTtJQUMxRCw4Q0FBaUIsR0FBL0I7Ozs7NEJBQ1MscUJBQU0sSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFBOzRCQUFuQyxzQkFBTyxDQUFBLFNBQTRCLE1BQUssSUFBSSxFQUFDOzs7O0tBQzlDO0lBMUZELGdFQUFnRTtJQUNoRSwwRUFBMEU7SUFDbkUsK0JBQVksR0FBRywwQkFBMEIsQ0FBQztJQXlGbkQseUJBQUM7Q0FBQSxBQTVGRCxDQUF3QyxnQkFBZ0IsR0E0RnZEO1NBNUZZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7U25hY2tCYXJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9zbmFjay1iYXItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtc25hY2stYmFyIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNuYWNrQmFySGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvLyBEZXZlbG9wZXJzIGNhbiBwcm92aWRlIGEgY3VzdG9tIGNvbXBvbmVudCBvciB0ZW1wbGF0ZSBmb3IgdGhlXG4gIC8vIHNuYWNrYmFyLiBUaGUgY2Fub25pY2FsIHNuYWNrLWJhciBwYXJlbnQgaXMgdGhlIFwiTWF0U25hY2tCYXJDb250YWluZXJcIi5cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXNuYWNrLWJhci1jb250YWluZXInO1xuXG4gIHByaXZhdGUgX3NpbXBsZVNuYWNrQmFyID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtc2ltcGxlLXNuYWNrYmFyJyk7XG4gIHByaXZhdGUgX3NpbXBsZVNuYWNrQmFyTWVzc2FnZSA9IHRoaXMubG9jYXRvckZvcignLm1hdC1zaW1wbGUtc25hY2tiYXIgPiBzcGFuJyk7XG4gIHByaXZhdGUgX3NpbXBsZVNuYWNrQmFyQWN0aW9uQnV0dG9uID1cbiAgICAgIHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LXNpbXBsZS1zbmFja2Jhci1hY3Rpb24gPiBidXR0b24nKTtcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBzbmFjay1iYXIgd2l0aFxuICAgKiBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaC5cbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSBzbmFjay1iYXIgdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3Rvci4gTm90ZSB0aGF0IHRoZVxuICAgKiAgICAgICAgICAgICAgICBzZWxlY3RvciBtdXN0IG1hdGNoIHRoZSBzbmFjay1iYXIgY29udGFpbmVyIGVsZW1lbnQuXG4gICAqIEByZXR1cm4gYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFNuYWNrQmFySGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0U25hY2tCYXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFNuYWNrQmFySGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgcm9sZSBvZiB0aGUgc25hY2stYmFyLiBUaGUgcm9sZSBvZiBhIHNuYWNrLWJhciBpcyBkZXRlcm1pbmVkIGJhc2VkXG4gICAqIG9uIHRoZSBBUklBIHBvbGl0ZW5lc3Mgc3BlY2lmaWVkIGluIHRoZSBzbmFjay1iYXIgY29uZmlnLlxuICAgKi9cbiAgYXN5bmMgZ2V0Um9sZSgpOiBQcm9taXNlPCdhbGVydCd8J3N0YXR1cyd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgncm9sZScpIGFzIFByb21pc2U8J2FsZXJ0J3wnc3RhdHVzJ3xudWxsPjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHdoZXRoZXIgdGhlIHNuYWNrLWJhciBoYXMgYW4gYWN0aW9uLiBNZXRob2QgY2Fubm90IGJlXG4gICAqIHVzZWQgZm9yIHNuYWNrLWJhcidzIHdpdGggY3VzdG9tIGNvbnRlbnQuXG4gICAqL1xuICBhc3luYyBoYXNBY3Rpb24oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0U2ltcGxlU25hY2tCYXIoKTtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3NpbXBsZVNuYWNrQmFyQWN0aW9uQnV0dG9uKCkpICE9PSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBzbmFjay1iYXIuIE1ldGhvZCBjYW5ub3QgYmVcbiAgICogdXNlZCBmb3Igc25hY2stYmFyJ3Mgd2l0aG91dCBhY3Rpb24gb3Igd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGdldEFjdGlvbkRlc2NyaXB0aW9uKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0U2ltcGxlU25hY2tCYXJXaXRoQWN0aW9uKCk7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9zaW1wbGVTbmFja0JhckFjdGlvbkJ1dHRvbigpKSEudGV4dCgpO1xuICB9XG5cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHRoZSBzbmFjay1iYXIgYnkgY2xpY2tpbmcgdGhlIGFjdGlvbiBidXR0b24uIE1ldGhvZCBjYW5ub3RcbiAgICogYmUgdXNlZCBmb3Igc25hY2stYmFyJ3Mgd2l0aG91dCBhY3Rpb24gb3Igd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGRpc21pc3NXaXRoQWN0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuX2Fzc2VydFNpbXBsZVNuYWNrQmFyV2l0aEFjdGlvbigpO1xuICAgIGF3YWl0IChhd2FpdCB0aGlzLl9zaW1wbGVTbmFja0JhckFjdGlvbkJ1dHRvbigpKSEuY2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtZXNzYWdlIG9mIHRoZSBzbmFjay1iYXIuIE1ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3JcbiAgICogc25hY2stYmFyJ3Mgd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGdldE1lc3NhZ2UoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRTaW1wbGVTbmFja0JhcigpO1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fc2ltcGxlU25hY2tCYXJNZXNzYWdlKCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnRzIHRoYXQgdGhlIGN1cnJlbnQgc25hY2stYmFyIGRvZXMgbm90IHVzZSBjdXN0b20gY29udGVudC4gVGhyb3dzIGlmXG4gICAqIGN1c3RvbSBjb250ZW50IGlzIHVzZWQuXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIF9hc3NlcnRTaW1wbGVTbmFja0JhcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuX2lzU2ltcGxlU25hY2tCYXIoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2QgY2Fubm90IGJlIHVzZWQgZm9yIHNuYWNrLWJhciB3aXRoIGN1c3RvbSBjb250ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnRzIHRoYXQgdGhlIGN1cnJlbnQgc25hY2stYmFyIGRvZXMgbm90IHVzZSBjdXN0b20gY29udGVudCBhbmQgaGFzXG4gICAqIGFuIGFjdGlvbiBkZWZpbmVkLiBPdGhlcndpc2UgYW4gZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIF9hc3NlcnRTaW1wbGVTbmFja0JhcldpdGhBY3Rpb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0U2ltcGxlU25hY2tCYXIoKTtcbiAgICBpZiAoIWF3YWl0IHRoaXMuaGFzQWN0aW9uKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzdGFuZGFyZCBzbmFjay1iYXIgd2l0aG91dCBhY3Rpb24uJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgc25hY2stYmFyIGlzIHVzaW5nIHRoZSBkZWZhdWx0IGNvbnRlbnQgdGVtcGxhdGUuICovXG4gIHByaXZhdGUgYXN5bmMgX2lzU2ltcGxlU25hY2tCYXIoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX3NpbXBsZVNuYWNrQmFyKCkgIT09IG51bGw7XG4gIH1cbn1cbiJdfQ==