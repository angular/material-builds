/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
/**
 * Harness for interacting with a standard MatBottomSheet in tests.
 * @dynamic
 */
var MatBottomSheetHarness = /** @class */ (function (_super) {
    __extends(MatBottomSheetHarness, _super);
    function MatBottomSheetHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a bottom sheet with
     * specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatBottomSheetHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatBottomSheetHarness, options);
    };
    /** Gets the value of the bottom sheet's "aria-label" attribute. */
    MatBottomSheetHarness.prototype.getAriaLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-label')];
                }
            });
        });
    };
    /**
     * Dismisses the bottom sheet by pressing escape. Note that this method cannot
     * be used if "disableClose" has been set to true via the config.
     */
    MatBottomSheetHarness.prototype.dismiss = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).sendKeys(TestKey.ESCAPE)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Developers can provide a custom component or template for the
    // bottom sheet. The canonical parent is the ".mat-bottom-sheet-container".
    MatBottomSheetHarness.hostSelector = '.mat-bottom-sheet-container';
    return MatBottomSheetHarness;
}(ComponentHarness));
export { MatBottomSheetHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYm90dG9tLXNoZWV0L3Rlc3RpbmcvYm90dG9tLXNoZWV0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUdqRjs7O0dBR0c7QUFDSDtJQUEyQyx5Q0FBZ0I7SUFBM0Q7O0lBMkJBLENBQUM7SUF0QkM7Ozs7O09BS0c7SUFDSSwwQkFBSSxHQUFYLFVBQVksT0FBdUM7UUFBdkMsd0JBQUEsRUFBQSxZQUF1QztRQUNqRCxPQUFPLElBQUksZ0JBQWdCLENBQUMscUJBQXFCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELG1FQUFtRTtJQUM3RCw0Q0FBWSxHQUFsQjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsRUFBQzs7OztLQUN2RDtJQUVEOzs7T0FHRztJQUNHLHVDQUFPLEdBQWI7Ozs7NEJBQ1MscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF4QixxQkFBTSxDQUFDLFNBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFBOzt3QkFBbEQsU0FBa0QsQ0FBQzs7Ozs7S0FDcEQ7SUF6QkQsZ0VBQWdFO0lBQ2hFLDJFQUEyRTtJQUNwRSxrQ0FBWSxHQUFHLDZCQUE2QixDQUFDO0lBd0J0RCw0QkFBQztDQUFBLEFBM0JELENBQTJDLGdCQUFnQixHQTJCMUQ7U0EzQlkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZSwgVGVzdEtleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtCb3R0b21TaGVldEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2JvdHRvbS1zaGVldC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBNYXRCb3R0b21TaGVldCBpbiB0ZXN0cy5cbiAqIEBkeW5hbWljXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRCb3R0b21TaGVldEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLy8gRGV2ZWxvcGVycyBjYW4gcHJvdmlkZSBhIGN1c3RvbSBjb21wb25lbnQgb3IgdGVtcGxhdGUgZm9yIHRoZVxuICAvLyBib3R0b20gc2hlZXQuIFRoZSBjYW5vbmljYWwgcGFyZW50IGlzIHRoZSBcIi5tYXQtYm90dG9tLXNoZWV0LWNvbnRhaW5lclwiLlxuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtYm90dG9tLXNoZWV0LWNvbnRhaW5lcic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYm90dG9tIHNoZWV0IHdpdGhcbiAgICogc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogQm90dG9tU2hlZXRIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRCb3R0b21TaGVldEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0Qm90dG9tU2hlZXRIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYm90dG9tIHNoZWV0J3MgXCJhcmlhLWxhYmVsXCIgYXR0cmlidXRlLiAqL1xuICBhc3luYyBnZXRBcmlhTGFiZWwoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc21pc3NlcyB0aGUgYm90dG9tIHNoZWV0IGJ5IHByZXNzaW5nIGVzY2FwZS4gTm90ZSB0aGF0IHRoaXMgbWV0aG9kIGNhbm5vdFxuICAgKiBiZSB1c2VkIGlmIFwiZGlzYWJsZUNsb3NlXCIgaGFzIGJlZW4gc2V0IHRvIHRydWUgdmlhIHRoZSBjb25maWcuXG4gICAqL1xuICBhc3luYyBkaXNtaXNzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuc2VuZEtleXMoVGVzdEtleS5FU0NBUEUpO1xuICB9XG59XG4iXX0=