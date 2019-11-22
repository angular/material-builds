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
     * Gets a `HarnessPredicate` that can be used to search for a `MatSnackBarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which snack bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
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
     * Whether the snack-bar has an action. Method cannot be used for snack-bar's with custom content.
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
     * Gets the description of the snack-bar. Method cannot be used for snack-bar's without action or
     * with custom content.
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
     * Dismisses the snack-bar by clicking the action button. Method cannot be used for snack-bar's
     * without action or with custom content.
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
     * Gets the message of the snack-bar. Method cannot be used for snack-bar's with custom content.
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
     * Asserts that the current snack-bar does not use custom content. Promise rejects if
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
     * an action defined. Otherwise the promise will reject.
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
    /** Whether the snack-bar is using the default content template. */
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
    /** The selector for the host element of a `MatSnackBar` instance. */
    MatSnackBarHarness.hostSelector = '.mat-snack-bar-container';
    return MatSnackBarHarness;
}(ComponentHarness));
export { MatSnackBarHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc25hY2stYmFyL3Rlc3Rpbmcvc25hY2stYmFyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFLHNFQUFzRTtBQUN0RTtJQUF3QyxzQ0FBZ0I7SUFBeEQ7UUFBQSxxRUF5RkM7UUFuRlMscUJBQWUsR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNsRSw0QkFBc0IsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDeEUsaUNBQTJCLEdBQy9CLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDOztJQWdGdEUsQ0FBQztJQTlFQzs7Ozs7T0FLRztJQUNJLHVCQUFJLEdBQVgsVUFBWSxPQUFvQztRQUFwQyx3QkFBQSxFQUFBLFlBQW9DO1FBQzlDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0csb0NBQU8sR0FBYjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQW1DLEVBQUM7Ozs7S0FDbkY7SUFFRDs7T0FFRztJQUNHLHNDQUFTLEdBQWY7Ozs7NEJBQ0UscUJBQU0sSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUE7O3dCQUFsQyxTQUFrQyxDQUFDO3dCQUMzQixxQkFBTSxJQUFJLENBQUMsMkJBQTJCLEVBQUUsRUFBQTs0QkFBaEQsc0JBQU8sQ0FBQyxTQUF3QyxDQUFDLEtBQUssSUFBSSxFQUFDOzs7O0tBQzVEO0lBRUQ7OztPQUdHO0lBQ0csaURBQW9CLEdBQTFCOzs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQywrQkFBK0IsRUFBRSxFQUFBOzt3QkFBNUMsU0FBNEMsQ0FBQzt3QkFDckMscUJBQU0sSUFBSSxDQUFDLDJCQUEyQixFQUFFLEVBQUE7NEJBQWhELHNCQUFPLENBQUMsU0FBd0MsQ0FBRSxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQzNEO0lBR0Q7OztPQUdHO0lBQ0csOENBQWlCLEdBQXZCOzs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQywrQkFBK0IsRUFBRSxFQUFBOzt3QkFBNUMsU0FBNEMsQ0FBQzt3QkFDdEMscUJBQU0sSUFBSSxDQUFDLDJCQUEyQixFQUFFLEVBQUE7NEJBQS9DLHFCQUFNLENBQUMsU0FBd0MsQ0FBRSxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBekQsU0FBeUQsQ0FBQzs7Ozs7S0FDM0Q7SUFFRDs7T0FFRztJQUNHLHVDQUFVLEdBQWhCOzs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFBOzt3QkFBbEMsU0FBa0MsQ0FBQzt3QkFDM0IscUJBQU0sSUFBSSxDQUFDLHNCQUFzQixFQUFFLEVBQUE7NEJBQTNDLHNCQUFPLENBQUMsU0FBbUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ3JEO0lBRUQ7OztPQUdHO0lBQ1csa0RBQXFCLEdBQW5DOzs7OzRCQUNPLHFCQUFNLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFBOzt3QkFBbkMsSUFBSSxDQUFDLENBQUEsU0FBOEIsQ0FBQSxFQUFFOzRCQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7eUJBQzdFOzs7OztLQUNGO0lBRUQ7OztPQUdHO0lBQ1csNERBQStCLEdBQTdDOzs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFBOzt3QkFBbEMsU0FBa0MsQ0FBQzt3QkFDOUIscUJBQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFBOzt3QkFBM0IsSUFBSSxDQUFDLENBQUEsU0FBc0IsQ0FBQSxFQUFFOzRCQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLDhEQUE4RCxDQUFDLENBQUM7eUJBQ2pGOzs7OztLQUNGO0lBRUQsbUVBQW1FO0lBQ3JELDhDQUFpQixHQUEvQjs7Ozs0QkFDUyxxQkFBTSxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUE7NEJBQW5DLHNCQUFPLENBQUEsU0FBNEIsTUFBSyxJQUFJLEVBQUM7Ozs7S0FDOUM7SUF2RkQsZ0VBQWdFO0lBQ2hFLDBFQUEwRTtJQUMxRSxxRUFBcUU7SUFDOUQsK0JBQVksR0FBRywwQkFBMEIsQ0FBQztJQXFGbkQseUJBQUM7Q0FBQSxBQXpGRCxDQUF3QyxnQkFBZ0IsR0F5RnZEO1NBekZZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7U25hY2tCYXJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9zbmFjay1iYXItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtc25hY2stYmFyIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNuYWNrQmFySGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvLyBEZXZlbG9wZXJzIGNhbiBwcm92aWRlIGEgY3VzdG9tIGNvbXBvbmVudCBvciB0ZW1wbGF0ZSBmb3IgdGhlXG4gIC8vIHNuYWNrYmFyLiBUaGUgY2Fub25pY2FsIHNuYWNrLWJhciBwYXJlbnQgaXMgdGhlIFwiTWF0U25hY2tCYXJDb250YWluZXJcIi5cbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRTbmFja0JhcmAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1zbmFjay1iYXItY29udGFpbmVyJztcblxuICBwcml2YXRlIF9zaW1wbGVTbmFja0JhciA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LXNpbXBsZS1zbmFja2JhcicpO1xuICBwcml2YXRlIF9zaW1wbGVTbmFja0Jhck1lc3NhZ2UgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtc2ltcGxlLXNuYWNrYmFyID4gc3BhbicpO1xuICBwcml2YXRlIF9zaW1wbGVTbmFja0JhckFjdGlvbkJ1dHRvbiA9XG4gICAgICB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1zaW1wbGUtc25hY2tiYXItYWN0aW9uID4gYnV0dG9uJyk7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdFNuYWNrQmFySGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggc25hY2sgYmFyIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFNuYWNrQmFySGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0U25hY2tCYXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFNuYWNrQmFySGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgcm9sZSBvZiB0aGUgc25hY2stYmFyLiBUaGUgcm9sZSBvZiBhIHNuYWNrLWJhciBpcyBkZXRlcm1pbmVkIGJhc2VkXG4gICAqIG9uIHRoZSBBUklBIHBvbGl0ZW5lc3Mgc3BlY2lmaWVkIGluIHRoZSBzbmFjay1iYXIgY29uZmlnLlxuICAgKi9cbiAgYXN5bmMgZ2V0Um9sZSgpOiBQcm9taXNlPCdhbGVydCd8J3N0YXR1cyd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgncm9sZScpIGFzIFByb21pc2U8J2FsZXJ0J3wnc3RhdHVzJ3xudWxsPjtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBzbmFjay1iYXIgaGFzIGFuIGFjdGlvbi4gTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXIncyB3aXRoIGN1c3RvbSBjb250ZW50LlxuICAgKi9cbiAgYXN5bmMgaGFzQWN0aW9uKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGF3YWl0IHRoaXMuX2Fzc2VydFNpbXBsZVNuYWNrQmFyKCk7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9zaW1wbGVTbmFja0JhckFjdGlvbkJ1dHRvbigpKSAhPT0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgc25hY2stYmFyLiBNZXRob2QgY2Fubm90IGJlIHVzZWQgZm9yIHNuYWNrLWJhcidzIHdpdGhvdXQgYWN0aW9uIG9yXG4gICAqIHdpdGggY3VzdG9tIGNvbnRlbnQuXG4gICAqL1xuICBhc3luYyBnZXRBY3Rpb25EZXNjcmlwdGlvbigpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGF3YWl0IHRoaXMuX2Fzc2VydFNpbXBsZVNuYWNrQmFyV2l0aEFjdGlvbigpO1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fc2ltcGxlU25hY2tCYXJBY3Rpb25CdXR0b24oKSkhLnRleHQoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIERpc21pc3NlcyB0aGUgc25hY2stYmFyIGJ5IGNsaWNraW5nIHRoZSBhY3Rpb24gYnV0dG9uLiBNZXRob2QgY2Fubm90IGJlIHVzZWQgZm9yIHNuYWNrLWJhcidzXG4gICAqIHdpdGhvdXQgYWN0aW9uIG9yIHdpdGggY3VzdG9tIGNvbnRlbnQuXG4gICAqL1xuICBhc3luYyBkaXNtaXNzV2l0aEFjdGlvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRTaW1wbGVTbmFja0JhcldpdGhBY3Rpb24oKTtcbiAgICBhd2FpdCAoYXdhaXQgdGhpcy5fc2ltcGxlU25hY2tCYXJBY3Rpb25CdXR0b24oKSkhLmNsaWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbWVzc2FnZSBvZiB0aGUgc25hY2stYmFyLiBNZXRob2QgY2Fubm90IGJlIHVzZWQgZm9yIHNuYWNrLWJhcidzIHdpdGggY3VzdG9tIGNvbnRlbnQuXG4gICAqL1xuICBhc3luYyBnZXRNZXNzYWdlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0U2ltcGxlU25hY2tCYXIoKTtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3NpbXBsZVNuYWNrQmFyTWVzc2FnZSgpKS50ZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0cyB0aGF0IHRoZSBjdXJyZW50IHNuYWNrLWJhciBkb2VzIG5vdCB1c2UgY3VzdG9tIGNvbnRlbnQuIFByb21pc2UgcmVqZWN0cyBpZlxuICAgKiBjdXN0b20gY29udGVudCBpcyB1c2VkLlxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBfYXNzZXJ0U2ltcGxlU25hY2tCYXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFhd2FpdCB0aGlzLl9pc1NpbXBsZVNuYWNrQmFyKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXIgd2l0aCBjdXN0b20gY29udGVudC4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0cyB0aGF0IHRoZSBjdXJyZW50IHNuYWNrLWJhciBkb2VzIG5vdCB1c2UgY3VzdG9tIGNvbnRlbnQgYW5kIGhhc1xuICAgKiBhbiBhY3Rpb24gZGVmaW5lZC4gT3RoZXJ3aXNlIHRoZSBwcm9taXNlIHdpbGwgcmVqZWN0LlxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBfYXNzZXJ0U2ltcGxlU25hY2tCYXJXaXRoQWN0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuX2Fzc2VydFNpbXBsZVNuYWNrQmFyKCk7XG4gICAgaWYgKCFhd2FpdCB0aGlzLmhhc0FjdGlvbigpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc3RhbmRhcmQgc25hY2stYmFyIHdpdGhvdXQgYWN0aW9uLicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbmFjay1iYXIgaXMgdXNpbmcgdGhlIGRlZmF1bHQgY29udGVudCB0ZW1wbGF0ZS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfaXNTaW1wbGVTbmFja0JhcigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fc2ltcGxlU25hY2tCYXIoKSAhPT0gbnVsbDtcbiAgfVxufVxuIl19