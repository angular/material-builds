/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator, __read } from "tslib";
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
    /** Gets whether the snack-bar has been dismissed. */
    MatSnackBarHarness.prototype.isDismissed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host, _a, exit, dimensions;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _b.sent();
                        return [4 /*yield*/, Promise.all([
                                // The snackbar container is marked with the "exit" attribute after it has been dismissed
                                // but before the animation has finished (after which it's removed from the DOM).
                                host.getAttribute('mat-exit'),
                                host.getDimensions(),
                            ])];
                    case 2:
                        _a = __read.apply(void 0, [_b.sent(), 2]), exit = _a[0], dimensions = _a[1];
                        return [2 /*return*/, exit != null || (!!dimensions && dimensions.height === 0 && dimensions.width === 0)];
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
                            throw Error('Method cannot be used for snack-bar with custom content.');
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
                            throw Error('Method cannot be used for standard snack-bar without action.');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc25hY2stYmFyL3Rlc3Rpbmcvc25hY2stYmFyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFLHNFQUFzRTtBQUN0RTtJQUF3QyxzQ0FBZ0I7SUFBeEQ7UUFBQSxxRUF5R0M7UUFuR1MscUJBQWUsR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNsRSw0QkFBc0IsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDeEUsaUNBQTJCLEdBQy9CLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDOztJQWdHdEUsQ0FBQztJQTlGQzs7Ozs7T0FLRztJQUNJLHVCQUFJLEdBQVgsVUFBWSxPQUFvQztRQUFwQyx3QkFBQSxFQUFBLFlBQW9DO1FBQzlDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0csb0NBQU8sR0FBYjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQW1DLEVBQUM7Ozs7S0FDbkY7SUFFRDs7T0FFRztJQUNHLHNDQUFTLEdBQWY7Ozs7NEJBQ0UscUJBQU0sSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUE7O3dCQUFsQyxTQUFrQyxDQUFDO3dCQUMzQixxQkFBTSxJQUFJLENBQUMsMkJBQTJCLEVBQUUsRUFBQTs0QkFBaEQsc0JBQU8sQ0FBQyxTQUF3QyxDQUFDLEtBQUssSUFBSSxFQUFDOzs7O0tBQzVEO0lBRUQ7OztPQUdHO0lBQ0csaURBQW9CLEdBQTFCOzs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQywrQkFBK0IsRUFBRSxFQUFBOzt3QkFBNUMsU0FBNEMsQ0FBQzt3QkFDckMscUJBQU0sSUFBSSxDQUFDLDJCQUEyQixFQUFFLEVBQUE7NEJBQWhELHNCQUFPLENBQUMsU0FBd0MsQ0FBRSxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQzNEO0lBR0Q7OztPQUdHO0lBQ0csOENBQWlCLEdBQXZCOzs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQywrQkFBK0IsRUFBRSxFQUFBOzt3QkFBNUMsU0FBNEMsQ0FBQzt3QkFDdEMscUJBQU0sSUFBSSxDQUFDLDJCQUEyQixFQUFFLEVBQUE7NEJBQS9DLHFCQUFNLENBQUMsU0FBd0MsQ0FBRSxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBekQsU0FBeUQsQ0FBQzs7Ozs7S0FDM0Q7SUFFRDs7T0FFRztJQUNHLHVDQUFVLEdBQWhCOzs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFBOzt3QkFBbEMsU0FBa0MsQ0FBQzt3QkFDM0IscUJBQU0sSUFBSSxDQUFDLHNCQUFzQixFQUFFLEVBQUE7NEJBQTNDLHNCQUFPLENBQUMsU0FBbUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ3JEO0lBRUQscURBQXFEO0lBQy9DLHdDQUFXLEdBQWpCOzs7Ozs0QkFJZSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUF4QixJQUFJLEdBQUcsU0FBaUI7d0JBQ0gscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQztnQ0FDM0MseUZBQXlGO2dDQUN6RixpRkFBaUY7Z0NBQ2pGLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2dDQUM3QixJQUFJLENBQUMsYUFBYSxFQUFFOzZCQUNyQixDQUFDLEVBQUE7O3dCQUxJLEtBQUEsc0JBQXFCLFNBS3pCLEtBQUEsRUFMSyxJQUFJLFFBQUEsRUFBRSxVQUFVLFFBQUE7d0JBT3ZCLHNCQUFPLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUM7Ozs7S0FDNUY7SUFFRDs7O09BR0c7SUFDVyxrREFBcUIsR0FBbkM7Ozs7NEJBQ08scUJBQU0sSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUE7O3dCQUFuQyxJQUFJLENBQUMsQ0FBQSxTQUE4QixDQUFBLEVBQUU7NEJBQ25DLE1BQU0sS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7eUJBQ3pFOzs7OztLQUNGO0lBRUQ7OztPQUdHO0lBQ1csNERBQStCLEdBQTdDOzs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFBOzt3QkFBbEMsU0FBa0MsQ0FBQzt3QkFDOUIscUJBQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFBOzt3QkFBM0IsSUFBSSxDQUFDLENBQUEsU0FBc0IsQ0FBQSxFQUFFOzRCQUMzQixNQUFNLEtBQUssQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO3lCQUM3RTs7Ozs7S0FDRjtJQUVELG1FQUFtRTtJQUNyRCw4Q0FBaUIsR0FBL0I7Ozs7NEJBQ1MscUJBQU0sSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFBOzRCQUFuQyxzQkFBTyxDQUFBLFNBQTRCLE1BQUssSUFBSSxFQUFDOzs7O0tBQzlDO0lBdkdELGdFQUFnRTtJQUNoRSwwRUFBMEU7SUFDMUUscUVBQXFFO0lBQzlELCtCQUFZLEdBQUcsMEJBQTBCLENBQUM7SUFxR25ELHlCQUFDO0NBQUEsQUF6R0QsQ0FBd0MsZ0JBQWdCLEdBeUd2RDtTQXpHWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1NuYWNrQmFySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vc25hY2stYmFyLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXNuYWNrLWJhciBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTbmFja0Jhckhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLy8gRGV2ZWxvcGVycyBjYW4gcHJvdmlkZSBhIGN1c3RvbSBjb21wb25lbnQgb3IgdGVtcGxhdGUgZm9yIHRoZVxuICAvLyBzbmFja2Jhci4gVGhlIGNhbm9uaWNhbCBzbmFjay1iYXIgcGFyZW50IGlzIHRoZSBcIk1hdFNuYWNrQmFyQ29udGFpbmVyXCIuXG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0U25hY2tCYXJgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc25hY2stYmFyLWNvbnRhaW5lcic7XG5cbiAgcHJpdmF0ZSBfc2ltcGxlU25hY2tCYXIgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1zaW1wbGUtc25hY2tiYXInKTtcbiAgcHJpdmF0ZSBfc2ltcGxlU25hY2tCYXJNZXNzYWdlID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXNpbXBsZS1zbmFja2JhciA+IHNwYW4nKTtcbiAgcHJpdmF0ZSBfc2ltcGxlU25hY2tCYXJBY3Rpb25CdXR0b24gPVxuICAgICAgdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtc2ltcGxlLXNuYWNrYmFyLWFjdGlvbiA+IGJ1dHRvbicpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRTbmFja0Jhckhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHNuYWNrIGJhciBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTbmFja0Jhckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFNuYWNrQmFySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTbmFja0Jhckhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHJvbGUgb2YgdGhlIHNuYWNrLWJhci4gVGhlIHJvbGUgb2YgYSBzbmFjay1iYXIgaXMgZGV0ZXJtaW5lZCBiYXNlZFxuICAgKiBvbiB0aGUgQVJJQSBwb2xpdGVuZXNzIHNwZWNpZmllZCBpbiB0aGUgc25hY2stYmFyIGNvbmZpZy5cbiAgICovXG4gIGFzeW5jIGdldFJvbGUoKTogUHJvbWlzZTwnYWxlcnQnfCdzdGF0dXMnfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ3JvbGUnKSBhcyBQcm9taXNlPCdhbGVydCd8J3N0YXR1cyd8bnVsbD47XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgc25hY2stYmFyIGhhcyBhbiBhY3Rpb24uIE1ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc25hY2stYmFyJ3Mgd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGhhc0FjdGlvbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRTaW1wbGVTbmFja0JhcigpO1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fc2ltcGxlU25hY2tCYXJBY3Rpb25CdXR0b24oKSkgIT09IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIHNuYWNrLWJhci4gTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXIncyB3aXRob3V0IGFjdGlvbiBvclxuICAgKiB3aXRoIGN1c3RvbSBjb250ZW50LlxuICAgKi9cbiAgYXN5bmMgZ2V0QWN0aW9uRGVzY3JpcHRpb24oKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRTaW1wbGVTbmFja0JhcldpdGhBY3Rpb24oKTtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3NpbXBsZVNuYWNrQmFyQWN0aW9uQnV0dG9uKCkpIS50ZXh0KCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIHNuYWNrLWJhciBieSBjbGlja2luZyB0aGUgYWN0aW9uIGJ1dHRvbi4gTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXInc1xuICAgKiB3aXRob3V0IGFjdGlvbiBvciB3aXRoIGN1c3RvbSBjb250ZW50LlxuICAgKi9cbiAgYXN5bmMgZGlzbWlzc1dpdGhBY3Rpb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0U2ltcGxlU25hY2tCYXJXaXRoQWN0aW9uKCk7XG4gICAgYXdhaXQgKGF3YWl0IHRoaXMuX3NpbXBsZVNuYWNrQmFyQWN0aW9uQnV0dG9uKCkpIS5jbGljaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1lc3NhZ2Ugb2YgdGhlIHNuYWNrLWJhci4gTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXIncyB3aXRoIGN1c3RvbSBjb250ZW50LlxuICAgKi9cbiAgYXN5bmMgZ2V0TWVzc2FnZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGF3YWl0IHRoaXMuX2Fzc2VydFNpbXBsZVNuYWNrQmFyKCk7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9zaW1wbGVTbmFja0Jhck1lc3NhZ2UoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgc25hY2stYmFyIGhhcyBiZWVuIGRpc21pc3NlZC4gKi9cbiAgYXN5bmMgaXNEaXNtaXNzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgLy8gV2UgY29uc2lkZXIgdGhlIHNuYWNrYmFyIGRpc21pc3NlZCBpZiBpdCdzIG5vdCBpbiB0aGUgRE9NLiBXZSBjYW4gYXNzZXJ0IHRoYXQgdGhlXG4gICAgLy8gZWxlbWVudCBpc24ndCBpbiB0aGUgRE9NIGJ5IHNlZWluZyB0aGF0IGl0cyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSB6ZXJvLlxuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGNvbnN0IFtleGl0LCBkaW1lbnNpb25zXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIC8vIFRoZSBzbmFja2JhciBjb250YWluZXIgaXMgbWFya2VkIHdpdGggdGhlIFwiZXhpdFwiIGF0dHJpYnV0ZSBhZnRlciBpdCBoYXMgYmVlbiBkaXNtaXNzZWRcbiAgICAgIC8vIGJ1dCBiZWZvcmUgdGhlIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQgKGFmdGVyIHdoaWNoIGl0J3MgcmVtb3ZlZCBmcm9tIHRoZSBET00pLlxuICAgICAgaG9zdC5nZXRBdHRyaWJ1dGUoJ21hdC1leGl0JyksXG4gICAgICBob3N0LmdldERpbWVuc2lvbnMoKSxcbiAgICBdKTtcblxuICAgIHJldHVybiBleGl0ICE9IG51bGwgfHwgKCEhZGltZW5zaW9ucyAmJiBkaW1lbnNpb25zLmhlaWdodCA9PT0gMCAmJiBkaW1lbnNpb25zLndpZHRoID09PSAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnRzIHRoYXQgdGhlIGN1cnJlbnQgc25hY2stYmFyIGRvZXMgbm90IHVzZSBjdXN0b20gY29udGVudC4gUHJvbWlzZSByZWplY3RzIGlmXG4gICAqIGN1c3RvbSBjb250ZW50IGlzIHVzZWQuXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIF9hc3NlcnRTaW1wbGVTbmFja0JhcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuX2lzU2ltcGxlU25hY2tCYXIoKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ01ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc25hY2stYmFyIHdpdGggY3VzdG9tIGNvbnRlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgdGhhdCB0aGUgY3VycmVudCBzbmFjay1iYXIgZG9lcyBub3QgdXNlIGN1c3RvbSBjb250ZW50IGFuZCBoYXNcbiAgICogYW4gYWN0aW9uIGRlZmluZWQuIE90aGVyd2lzZSB0aGUgcHJvbWlzZSB3aWxsIHJlamVjdC5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgX2Fzc2VydFNpbXBsZVNuYWNrQmFyV2l0aEFjdGlvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRTaW1wbGVTbmFja0JhcigpO1xuICAgIGlmICghYXdhaXQgdGhpcy5oYXNBY3Rpb24oKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ01ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc3RhbmRhcmQgc25hY2stYmFyIHdpdGhvdXQgYWN0aW9uLicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbmFjay1iYXIgaXMgdXNpbmcgdGhlIGRlZmF1bHQgY29udGVudCB0ZW1wbGF0ZS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfaXNTaW1wbGVTbmFja0JhcigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fc2ltcGxlU25hY2tCYXIoKSAhPT0gbnVsbDtcbiAgfVxufVxuIl19