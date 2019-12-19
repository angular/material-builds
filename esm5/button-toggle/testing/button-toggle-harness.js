/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
/** Harness for interacting with a standard mat-button-toggle in tests. */
var MatButtonToggleHarness = /** @class */ (function (_super) {
    __extends(MatButtonToggleHarness, _super);
    function MatButtonToggleHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._label = _this.locatorFor('.mat-button-toggle-label-content');
        _this._button = _this.locatorFor('.mat-button-toggle-button');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatButtonToggleHarness` that meets
     * certain criteria.
     * @param options Options for filtering which button toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatButtonToggleHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatButtonToggleHarness, options)
            .addOption('text', options.text, function (harness, text) { return HarnessPredicate.stringMatches(harness.getText(), text); })
            .addOption('name', options.name, function (harness, name) { return HarnessPredicate.stringMatches(harness.getName(), name); })
            .addOption('checked', options.checked, function (harness, checked) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.isChecked()];
                case 1: return [2 /*return*/, (_a.sent()) === checked];
            }
        }); }); });
    };
    /** Gets a boolean promise indicating if the button toggle is checked. */
    MatButtonToggleHarness.prototype.isChecked = function () {
        return __awaiter(this, void 0, void 0, function () {
            var checked, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._button()];
                    case 1:
                        checked = (_b.sent()).getAttribute('aria-pressed');
                        _a = coerceBooleanProperty;
                        return [4 /*yield*/, checked];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    /** Gets a boolean promise indicating if the button toggle is disabled. */
    MatButtonToggleHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var disabled, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._button()];
                    case 1:
                        disabled = (_b.sent()).getAttribute('disabled');
                        _a = coerceBooleanProperty;
                        return [4 /*yield*/, disabled];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    /** Gets a promise for the button toggle's name. */
    MatButtonToggleHarness.prototype.getName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._button()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('name')];
                }
            });
        });
    };
    /** Gets a promise for the button toggle's aria-label. */
    MatButtonToggleHarness.prototype.getAriaLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._button()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-label')];
                }
            });
        });
    };
    /** Gets a promise for the button toggles's aria-labelledby. */
    MatButtonToggleHarness.prototype.getAriaLabelledby = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._button()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-labelledby')];
                }
            });
        });
    };
    /** Gets a promise for the button toggle's text. */
    MatButtonToggleHarness.prototype.getText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._label()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Gets the appearance that the button toggle is using. */
    MatButtonToggleHarness.prototype.getAppearance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host, className;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        className = 'mat-button-toggle-appearance-standard';
                        return [4 /*yield*/, host.hasClass(className)];
                    case 2: return [2 /*return*/, (_a.sent()) ? 'standard' : 'legacy'];
                }
            });
        });
    };
    /** Focuses the toggle. */
    MatButtonToggleHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._button()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the toggle. */
    MatButtonToggleHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._button()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /** Toggle the checked state of the buttons toggle. */
    MatButtonToggleHarness.prototype.toggle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._button()];
                    case 1: return [2 /*return*/, (_a.sent()).click()];
                }
            });
        });
    };
    /**
     * Puts the button toggle in a checked state by toggling it if it's
     * currently unchecked, or doing nothing if it is already checked.
     */
    MatButtonToggleHarness.prototype.check = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isChecked()];
                    case 1:
                        if (!!(_a.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.toggle()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Puts the button toggle in an unchecked state by toggling it if it's
     * currently checked, or doing nothing if it's already unchecked.
     */
    MatButtonToggleHarness.prototype.uncheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isChecked()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.toggle()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /** The selector for the host element of a `MatButton` instance. */
    MatButtonToggleHarness.hostSelector = 'mat-button-toggle';
    return MatButtonToggleHarness;
}(ComponentHarness));
export { MatButtonToggleHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLXRvZ2dsZS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2J1dHRvbi10b2dnbGUvdGVzdGluZy9idXR0b24tdG9nZ2xlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBSzVELDBFQUEwRTtBQUMxRTtJQUE0QywwQ0FBZ0I7SUFBNUQ7UUFBQSxxRUFnR0M7UUE1RlMsWUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsa0NBQWtDLENBQUMsQ0FBQztRQUM3RCxhQUFPLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOztJQTJGakUsQ0FBQztJQXpGQzs7Ozs7T0FLRztJQUNJLDJCQUFJLEdBQVgsVUFBWSxPQUF3QztRQUFwRCxpQkFRQztRQVJXLHdCQUFBLEVBQUEsWUFBd0M7UUFDbEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQzthQUN2RCxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQzNCLFVBQUMsT0FBTyxFQUFFLElBQUksSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQXZELENBQXVELENBQUM7YUFDOUUsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUMzQixVQUFDLE9BQU8sRUFBRSxJQUFJLElBQUssT0FBQSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxFQUF2RCxDQUF1RCxDQUFDO2FBQzlFLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFDakMsVUFBTyxPQUFPLEVBQUUsT0FBTzs7d0JBQU0scUJBQU0sT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFBO3dCQUExQixzQkFBQSxDQUFDLFNBQXlCLENBQUMsS0FBSyxPQUFPLEVBQUE7O2lCQUFBLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRUQseUVBQXlFO0lBQ25FLDBDQUFTLEdBQWY7Ozs7OzRCQUNtQixxQkFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUE7O3dCQUEvQixPQUFPLEdBQUcsQ0FBQyxTQUFvQixDQUFDLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQzt3QkFDNUQsS0FBQSxxQkFBcUIsQ0FBQTt3QkFBQyxxQkFBTSxPQUFPLEVBQUE7NEJBQTFDLHNCQUFPLGtCQUFzQixTQUFhLEVBQUMsRUFBQzs7OztLQUM3QztJQUVELDBFQUEwRTtJQUNwRSwyQ0FBVSxHQUFoQjs7Ozs7NEJBQ29CLHFCQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQTs7d0JBQWhDLFFBQVEsR0FBRyxDQUFDLFNBQW9CLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO3dCQUN6RCxLQUFBLHFCQUFxQixDQUFBO3dCQUFDLHFCQUFNLFFBQVEsRUFBQTs0QkFBM0Msc0JBQU8sa0JBQXNCLFNBQWMsRUFBQyxFQUFDOzs7O0tBQzlDO0lBRUQsbURBQW1EO0lBQzdDLHdDQUFPLEdBQWI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFBOzRCQUE1QixzQkFBTyxDQUFDLFNBQW9CLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUM7Ozs7S0FDcEQ7SUFFRCx5REFBeUQ7SUFDbkQsNkNBQVksR0FBbEI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFBOzRCQUE1QixzQkFBTyxDQUFDLFNBQW9CLENBQUMsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQUM7Ozs7S0FDMUQ7SUFFRCwrREFBK0Q7SUFDekQsa0RBQWlCLEdBQXZCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQTs0QkFBNUIsc0JBQU8sQ0FBQyxTQUFvQixDQUFDLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLEVBQUM7Ozs7S0FDL0Q7SUFFRCxtREFBbUQ7SUFDN0Msd0NBQU8sR0FBYjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUE7NEJBQTNCLHNCQUFPLENBQUMsU0FBbUIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ3JDO0lBRUQsMkRBQTJEO0lBQ3JELDhDQUFhLEdBQW5COzs7Ozs0QkFDZSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUF4QixJQUFJLEdBQUcsU0FBaUI7d0JBQ3hCLFNBQVMsR0FBRyx1Q0FBdUMsQ0FBQzt3QkFDbkQscUJBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBQTs0QkFBckMsc0JBQU8sQ0FBQSxTQUE4QixFQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBQzs7OztLQUMvRDtJQUVELDBCQUEwQjtJQUNwQixzQ0FBSyxHQUFYOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQTs0QkFBNUIsc0JBQU8sQ0FBQyxTQUFvQixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUM7Ozs7S0FDdkM7SUFFRCx3QkFBd0I7SUFDbEIscUNBQUksR0FBVjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUE7NEJBQTVCLHNCQUFPLENBQUMsU0FBb0IsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ3RDO0lBRUQsc0RBQXNEO0lBQ2hELHVDQUFNLEdBQVo7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFBOzRCQUE1QixzQkFBTyxDQUFDLFNBQW9CLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBQzs7OztLQUN2QztJQUVEOzs7T0FHRztJQUNHLHNDQUFLLEdBQVg7Ozs7NEJBQ1EscUJBQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFBOzs2QkFBeEIsQ0FBQyxDQUFDLFNBQXNCLENBQUMsRUFBekIsd0JBQXlCO3dCQUMzQixxQkFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUE7O3dCQUFuQixTQUFtQixDQUFDOzs7Ozs7S0FFdkI7SUFFRDs7O09BR0c7SUFDRyx3Q0FBTyxHQUFiOzs7OzRCQUNNLHFCQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQTs7NkJBQXRCLFNBQXNCLEVBQXRCLHdCQUFzQjt3QkFDeEIscUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFBOzt3QkFBbkIsU0FBbUIsQ0FBQzs7Ozs7O0tBRXZCO0lBOUZELG1FQUFtRTtJQUM1RCxtQ0FBWSxHQUFHLG1CQUFtQixDQUFDO0lBOEY1Qyw2QkFBQztDQUFBLEFBaEdELENBQTRDLGdCQUFnQixHQWdHM0Q7U0FoR1ksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge01hdEJ1dHRvblRvZ2dsZUFwcGVhcmFuY2V9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbi10b2dnbGUnO1xuaW1wb3J0IHtCdXR0b25Ub2dnbGVIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9idXR0b24tdG9nZ2xlLWhhcm5lc3MtZmlsdGVycyc7XG5cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtYnV0dG9uLXRvZ2dsZSBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRCdXR0b25Ub2dnbGVIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0QnV0dG9uYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICdtYXQtYnV0dG9uLXRvZ2dsZSc7XG5cbiAgcHJpdmF0ZSBfbGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtYnV0dG9uLXRvZ2dsZS1sYWJlbC1jb250ZW50Jyk7XG4gIHByaXZhdGUgX2J1dHRvbiA9IHRoaXMubG9jYXRvckZvcignLm1hdC1idXR0b24tdG9nZ2xlLWJ1dHRvbicpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRCdXR0b25Ub2dnbGVIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBidXR0b24gdG9nZ2xlIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IEJ1dHRvblRvZ2dsZUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEJ1dHRvblRvZ2dsZUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0QnV0dG9uVG9nZ2xlSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCxcbiAgICAgICAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUZXh0KCksIHRleHQpKVxuICAgICAgICAuYWRkT3B0aW9uKCduYW1lJywgb3B0aW9ucy5uYW1lLFxuICAgICAgICAgICAgKGhhcm5lc3MsIG5hbWUpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldE5hbWUoKSwgbmFtZSkpXG4gICAgICAgIC5hZGRPcHRpb24oJ2NoZWNrZWQnLCBvcHRpb25zLmNoZWNrZWQsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgY2hlY2tlZCkgPT4gKGF3YWl0IGhhcm5lc3MuaXNDaGVja2VkKCkpID09PSBjaGVja2VkKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIGJ1dHRvbiB0b2dnbGUgaXMgY2hlY2tlZC4gKi9cbiAgYXN5bmMgaXNDaGVja2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGNoZWNrZWQgPSAoYXdhaXQgdGhpcy5fYnV0dG9uKCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBjaGVja2VkKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIGJ1dHRvbiB0b2dnbGUgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5fYnV0dG9uKCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIGJ1dHRvbiB0b2dnbGUncyBuYW1lLiAqL1xuICBhc3luYyBnZXROYW1lKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fYnV0dG9uKCkpLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgYnV0dG9uIHRvZ2dsZSdzIGFyaWEtbGFiZWwuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2J1dHRvbigpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIGJ1dHRvbiB0b2dnbGVzJ3MgYXJpYS1sYWJlbGxlZGJ5LiAqL1xuICBhc3luYyBnZXRBcmlhTGFiZWxsZWRieSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2J1dHRvbigpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgYnV0dG9uIHRvZ2dsZSdzIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2xhYmVsKCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhcHBlYXJhbmNlIHRoYXQgdGhlIGJ1dHRvbiB0b2dnbGUgaXMgdXNpbmcuICovXG4gIGFzeW5jIGdldEFwcGVhcmFuY2UoKTogUHJvbWlzZTxNYXRCdXR0b25Ub2dnbGVBcHBlYXJhbmNlPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9ICdtYXQtYnV0dG9uLXRvZ2dsZS1hcHBlYXJhbmNlLXN0YW5kYXJkJztcbiAgICByZXR1cm4gYXdhaXQgaG9zdC5oYXNDbGFzcyhjbGFzc05hbWUpID8gJ3N0YW5kYXJkJyA6ICdsZWdhY3knO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHRvZ2dsZS4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9idXR0b24oKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgdG9nZ2xlLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fYnV0dG9uKCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBUb2dnbGUgdGhlIGNoZWNrZWQgc3RhdGUgb2YgdGhlIGJ1dHRvbnMgdG9nZ2xlLiAqL1xuICBhc3luYyB0b2dnbGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9idXR0b24oKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdXRzIHRoZSBidXR0b24gdG9nZ2xlIGluIGEgY2hlY2tlZCBzdGF0ZSBieSB0b2dnbGluZyBpdCBpZiBpdCdzXG4gICAqIGN1cnJlbnRseSB1bmNoZWNrZWQsIG9yIGRvaW5nIG5vdGhpbmcgaWYgaXQgaXMgYWxyZWFkeSBjaGVja2VkLlxuICAgKi9cbiAgYXN5bmMgY2hlY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCEoYXdhaXQgdGhpcy5pc0NoZWNrZWQoKSkpIHtcbiAgICAgIGF3YWl0IHRoaXMudG9nZ2xlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1dHMgdGhlIGJ1dHRvbiB0b2dnbGUgaW4gYW4gdW5jaGVja2VkIHN0YXRlIGJ5IHRvZ2dsaW5nIGl0IGlmIGl0J3NcbiAgICogY3VycmVudGx5IGNoZWNrZWQsIG9yIGRvaW5nIG5vdGhpbmcgaWYgaXQncyBhbHJlYWR5IHVuY2hlY2tlZC5cbiAgICovXG4gIGFzeW5jIHVuY2hlY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaXNDaGVja2VkKCkpIHtcbiAgICAgIGF3YWl0IHRoaXMudG9nZ2xlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=