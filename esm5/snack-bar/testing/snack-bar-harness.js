/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/**
 * Harness for interacting with a standard mat-snack-bar in tests.
 * @dynamic
 */
var MatSnackBarHarness = /** @class */ (function (_super) {
    tslib_1.__extends(MatSnackBarHarness, _super);
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc25hY2stYmFyL3Rlc3Rpbmcvc25hY2stYmFyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFOzs7R0FHRztBQUNIO0lBQXdDLDhDQUFnQjtJQUF4RDtRQUFBLHFFQTRGQztRQXZGUyxxQkFBZSxHQUFHLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ2xFLDRCQUFzQixHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUN4RSxpQ0FBMkIsR0FDL0IsS0FBSSxDQUFDLGtCQUFrQixDQUFDLHNDQUFzQyxDQUFDLENBQUM7O0lBb0Z0RSxDQUFDO0lBbEZDOzs7Ozs7O09BT0c7SUFDSSx1QkFBSSxHQUFYLFVBQVksT0FBb0M7UUFBcEMsd0JBQUEsRUFBQSxZQUFvQztRQUM5QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVEOzs7T0FHRztJQUNHLG9DQUFPLEdBQWI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFtQyxFQUFDOzs7O0tBQ25GO0lBRUQ7OztPQUdHO0lBQ0csc0NBQVMsR0FBZjs7Ozs0QkFDRSxxQkFBTSxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBQTs7d0JBQWxDLFNBQWtDLENBQUM7d0JBQzNCLHFCQUFNLElBQUksQ0FBQywyQkFBMkIsRUFBRSxFQUFBOzRCQUFoRCxzQkFBTyxDQUFDLFNBQXdDLENBQUMsS0FBSyxJQUFJLEVBQUM7Ozs7S0FDNUQ7SUFFRDs7O09BR0c7SUFDRyxpREFBb0IsR0FBMUI7Ozs7NEJBQ0UscUJBQU0sSUFBSSxDQUFDLCtCQUErQixFQUFFLEVBQUE7O3dCQUE1QyxTQUE0QyxDQUFDO3dCQUNyQyxxQkFBTSxJQUFJLENBQUMsMkJBQTJCLEVBQUUsRUFBQTs0QkFBaEQsc0JBQU8sQ0FBQyxTQUF3QyxDQUFFLENBQUMsSUFBSSxFQUFFLEVBQUM7Ozs7S0FDM0Q7SUFHRDs7O09BR0c7SUFDRyw4Q0FBaUIsR0FBdkI7Ozs7NEJBQ0UscUJBQU0sSUFBSSxDQUFDLCtCQUErQixFQUFFLEVBQUE7O3dCQUE1QyxTQUE0QyxDQUFDO3dCQUN0QyxxQkFBTSxJQUFJLENBQUMsMkJBQTJCLEVBQUUsRUFBQTs0QkFBL0MscUJBQU0sQ0FBQyxTQUF3QyxDQUFFLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUF6RCxTQUF5RCxDQUFDOzs7OztLQUMzRDtJQUVEOzs7T0FHRztJQUNHLHVDQUFVLEdBQWhCOzs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFBOzt3QkFBbEMsU0FBa0MsQ0FBQzt3QkFDM0IscUJBQU0sSUFBSSxDQUFDLHNCQUFzQixFQUFFLEVBQUE7NEJBQTNDLHNCQUFPLENBQUMsU0FBbUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ3JEO0lBRUQ7OztPQUdHO0lBQ1csa0RBQXFCLEdBQW5DOzs7OzRCQUNPLHFCQUFNLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFBOzt3QkFBbkMsSUFBSSxDQUFDLENBQUEsU0FBOEIsQ0FBQSxFQUFFOzRCQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7eUJBQzdFOzs7OztLQUNGO0lBRUQ7OztPQUdHO0lBQ1csNERBQStCLEdBQTdDOzs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFBOzt3QkFBbEMsU0FBa0MsQ0FBQzt3QkFDOUIscUJBQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFBOzt3QkFBM0IsSUFBSSxDQUFDLENBQUEsU0FBc0IsQ0FBQSxFQUFFOzRCQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLDhEQUE4RCxDQUFDLENBQUM7eUJBQ2pGOzs7OztLQUNGO0lBRUQsd0VBQXdFO0lBQzFELDhDQUFpQixHQUEvQjs7Ozs0QkFDUyxxQkFBTSxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUE7NEJBQW5DLHNCQUFPLENBQUEsU0FBNEIsTUFBSyxJQUFJLEVBQUM7Ozs7S0FDOUM7SUExRkQsZ0VBQWdFO0lBQ2hFLDBFQUEwRTtJQUNuRSwrQkFBWSxHQUFHLDBCQUEwQixDQUFDO0lBeUZuRCx5QkFBQztDQUFBLEFBNUZELENBQXdDLGdCQUFnQixHQTRGdkQ7U0E1Rlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtTbmFja0Jhckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3NuYWNrLWJhci1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtc25hY2stYmFyIGluIHRlc3RzLlxuICogQGR5bmFtaWNcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNuYWNrQmFySGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvLyBEZXZlbG9wZXJzIGNhbiBwcm92aWRlIGEgY3VzdG9tIGNvbXBvbmVudCBvciB0ZW1wbGF0ZSBmb3IgdGhlXG4gIC8vIHNuYWNrYmFyLiBUaGUgY2Fub25pY2FsIHNuYWNrLWJhciBwYXJlbnQgaXMgdGhlIFwiTWF0U25hY2tCYXJDb250YWluZXJcIi5cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXNuYWNrLWJhci1jb250YWluZXInO1xuXG4gIHByaXZhdGUgX3NpbXBsZVNuYWNrQmFyID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtc2ltcGxlLXNuYWNrYmFyJyk7XG4gIHByaXZhdGUgX3NpbXBsZVNuYWNrQmFyTWVzc2FnZSA9IHRoaXMubG9jYXRvckZvcignLm1hdC1zaW1wbGUtc25hY2tiYXIgPiBzcGFuJyk7XG4gIHByaXZhdGUgX3NpbXBsZVNuYWNrQmFyQWN0aW9uQnV0dG9uID1cbiAgICAgIHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LXNpbXBsZS1zbmFja2Jhci1hY3Rpb24gPiBidXR0b24nKTtcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBzbmFjay1iYXIgd2l0aFxuICAgKiBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaC5cbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSBzbmFjay1iYXIgdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3Rvci4gTm90ZSB0aGF0IHRoZVxuICAgKiAgICAgICAgICAgICAgICBzZWxlY3RvciBtdXN0IG1hdGNoIHRoZSBzbmFjay1iYXIgY29udGFpbmVyIGVsZW1lbnQuXG4gICAqIEByZXR1cm4gYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFNuYWNrQmFySGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0U25hY2tCYXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFNuYWNrQmFySGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgcm9sZSBvZiB0aGUgc25hY2stYmFyLiBUaGUgcm9sZSBvZiBhIHNuYWNrLWJhciBpcyBkZXRlcm1pbmVkIGJhc2VkXG4gICAqIG9uIHRoZSBBUklBIHBvbGl0ZW5lc3Mgc3BlY2lmaWVkIGluIHRoZSBzbmFjay1iYXIgY29uZmlnLlxuICAgKi9cbiAgYXN5bmMgZ2V0Um9sZSgpOiBQcm9taXNlPCdhbGVydCd8J3N0YXR1cyd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgncm9sZScpIGFzIFByb21pc2U8J2FsZXJ0J3wnc3RhdHVzJ3xudWxsPjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHdoZXRoZXIgdGhlIHNuYWNrLWJhciBoYXMgYW4gYWN0aW9uLiBNZXRob2QgY2Fubm90IGJlXG4gICAqIHVzZWQgZm9yIHNuYWNrLWJhcidzIHdpdGggY3VzdG9tIGNvbnRlbnQuXG4gICAqL1xuICBhc3luYyBoYXNBY3Rpb24oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0U2ltcGxlU25hY2tCYXIoKTtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3NpbXBsZVNuYWNrQmFyQWN0aW9uQnV0dG9uKCkpICE9PSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBzbmFjay1iYXIuIE1ldGhvZCBjYW5ub3QgYmVcbiAgICogdXNlZCBmb3Igc25hY2stYmFyJ3Mgd2l0aG91dCBhY3Rpb24gb3Igd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGdldEFjdGlvbkRlc2NyaXB0aW9uKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0U2ltcGxlU25hY2tCYXJXaXRoQWN0aW9uKCk7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9zaW1wbGVTbmFja0JhckFjdGlvbkJ1dHRvbigpKSEudGV4dCgpO1xuICB9XG5cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHRoZSBzbmFjay1iYXIgYnkgY2xpY2tpbmcgdGhlIGFjdGlvbiBidXR0b24uIE1ldGhvZCBjYW5ub3RcbiAgICogYmUgdXNlZCBmb3Igc25hY2stYmFyJ3Mgd2l0aG91dCBhY3Rpb24gb3Igd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGRpc21pc3NXaXRoQWN0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuX2Fzc2VydFNpbXBsZVNuYWNrQmFyV2l0aEFjdGlvbigpO1xuICAgIGF3YWl0IChhd2FpdCB0aGlzLl9zaW1wbGVTbmFja0JhckFjdGlvbkJ1dHRvbigpKSEuY2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtZXNzYWdlIG9mIHRoZSBzbmFjay1iYXIuIE1ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3JcbiAgICogc25hY2stYmFyJ3Mgd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGdldE1lc3NhZ2UoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRTaW1wbGVTbmFja0JhcigpO1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fc2ltcGxlU25hY2tCYXJNZXNzYWdlKCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnRzIHRoYXQgdGhlIGN1cnJlbnQgc25hY2stYmFyIGRvZXMgbm90IHVzZSBjdXN0b20gY29udGVudC4gVGhyb3dzIGlmXG4gICAqIGN1c3RvbSBjb250ZW50IGlzIHVzZWQuXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIF9hc3NlcnRTaW1wbGVTbmFja0JhcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuX2lzU2ltcGxlU25hY2tCYXIoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2QgY2Fubm90IGJlIHVzZWQgZm9yIHNuYWNrLWJhciB3aXRoIGN1c3RvbSBjb250ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnRzIHRoYXQgdGhlIGN1cnJlbnQgc25hY2stYmFyIGRvZXMgbm90IHVzZSBjdXN0b20gY29udGVudCBhbmQgaGFzXG4gICAqIGFuIGFjdGlvbiBkZWZpbmVkLiBPdGhlcndpc2UgYW4gZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIF9hc3NlcnRTaW1wbGVTbmFja0JhcldpdGhBY3Rpb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0U2ltcGxlU25hY2tCYXIoKTtcbiAgICBpZiAoIWF3YWl0IHRoaXMuaGFzQWN0aW9uKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzdGFuZGFyZCBzbmFjay1iYXIgd2l0aG91dCBhY3Rpb24uJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgc25hY2stYmFyIGlzIHVzaW5nIHRoZSBkZWZhdWx0IGNvbnRlbnQgdGVtcGxhdGUuICovXG4gIHByaXZhdGUgYXN5bmMgX2lzU2ltcGxlU25hY2tCYXIoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX3NpbXBsZVNuYWNrQmFyKCkgIT09IG51bGw7XG4gIH1cbn1cbiJdfQ==