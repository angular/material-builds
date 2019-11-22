/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-drawer in tests. */
var MatDrawerHarness = /** @class */ (function (_super) {
    __extends(MatDrawerHarness, _super);
    function MatDrawerHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDrawerHarness` that meets
     * certain criteria.
     * @param options Options for filtering which drawer instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatDrawerHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatDrawerHarness, options)
            .addOption('position', options.position, function (harness, position) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.getPosition()];
                case 1: return [2 /*return*/, (_a.sent()) === position];
            }
        }); }); });
    };
    /** Whether the drawer is open. */
    MatDrawerHarness.prototype.isOpen = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-drawer-opened')];
                }
            });
        });
    };
    /** Gets the position of the drawer inside its container. */
    MatDrawerHarness.prototype.getPosition = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        return [4 /*yield*/, host.hasClass('mat-drawer-end')];
                    case 2: return [2 /*return*/, (_a.sent()) ? 'end' : 'start'];
                }
            });
        });
    };
    /** Gets the mode that the drawer is in. */
    MatDrawerHarness.prototype.getMode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        return [4 /*yield*/, host.hasClass('mat-drawer-push')];
                    case 2:
                        if (_a.sent()) {
                            return [2 /*return*/, 'push'];
                        }
                        return [4 /*yield*/, host.hasClass('mat-drawer-side')];
                    case 3:
                        if (_a.sent()) {
                            return [2 /*return*/, 'side'];
                        }
                        return [2 /*return*/, 'over'];
                }
            });
        });
    };
    /** The selector for the host element of a `MatDrawer` instance. */
    MatDrawerHarness.hostSelector = '.mat-drawer';
    return MatDrawerHarness;
}(ComponentHarness));
export { MatDrawerHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi90ZXN0aW5nL2RyYXdlci1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUd4RSxtRUFBbUU7QUFDbkU7SUFBc0Msb0NBQWdCO0lBQXREOztJQXlDQSxDQUFDO0lBckNDOzs7OztPQUtHO0lBQ0kscUJBQUksR0FBWCxVQUFZLE9BQWtDO1FBQTlDLGlCQUlDO1FBSlcsd0JBQUEsRUFBQSxZQUFrQztRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDO2FBQ2pELFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFDbkMsVUFBTyxPQUFPLEVBQUUsUUFBUTs7d0JBQU0scUJBQU0sT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFBO3dCQUE1QixzQkFBQSxDQUFDLFNBQTJCLENBQUMsS0FBSyxRQUFRLEVBQUE7O2lCQUFBLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRUQsa0NBQWtDO0lBQzVCLGlDQUFNLEdBQVo7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsRUFBQzs7OztLQUMxRDtJQUVELDREQUE0RDtJQUN0RCxzQ0FBVyxHQUFqQjs7Ozs7NEJBQ2UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzt3QkFBeEIsSUFBSSxHQUFHLFNBQWlCO3dCQUN0QixxQkFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEVBQUE7NEJBQTdDLHNCQUFPLENBQUMsU0FBcUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQzs7OztLQUNsRTtJQUVELDJDQUEyQztJQUNyQyxrQ0FBTyxHQUFiOzs7Ozs0QkFDZSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUF4QixJQUFJLEdBQUcsU0FBaUI7d0JBRTFCLHFCQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBQTs7d0JBQTFDLElBQUksU0FBc0MsRUFBRTs0QkFDMUMsc0JBQU8sTUFBTSxFQUFDO3lCQUNmO3dCQUVHLHFCQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBQTs7d0JBQTFDLElBQUksU0FBc0MsRUFBRTs0QkFDMUMsc0JBQU8sTUFBTSxFQUFDO3lCQUNmO3dCQUVELHNCQUFPLE1BQU0sRUFBQzs7OztLQUNmO0lBdkNELG1FQUFtRTtJQUM1RCw2QkFBWSxHQUFHLGFBQWEsQ0FBQztJQXVDdEMsdUJBQUM7Q0FBQSxBQXpDRCxDQUFzQyxnQkFBZ0IsR0F5Q3JEO1NBekNZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7RHJhd2VySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vZHJhd2VyLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LWRyYXdlciBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXREcmF3ZXJIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0RHJhd2VyYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWRyYXdlcic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdERyYXdlckhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGRyYXdlciBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBEcmF3ZXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXREcmF3ZXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdERyYXdlckhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3Bvc2l0aW9uJywgb3B0aW9ucy5wb3NpdGlvbixcbiAgICAgICAgICAgIGFzeW5jIChoYXJuZXNzLCBwb3NpdGlvbikgPT4gKGF3YWl0IGhhcm5lc3MuZ2V0UG9zaXRpb24oKSkgPT09IHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBkcmF3ZXIgaXMgb3Blbi4gKi9cbiAgYXN5bmMgaXNPcGVuKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtZHJhd2VyLW9wZW5lZCcpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBkcmF3ZXIgaW5zaWRlIGl0cyBjb250YWluZXIuICovXG4gIGFzeW5jIGdldFBvc2l0aW9uKCk6IFByb21pc2U8J3N0YXJ0J3wnZW5kJz4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICByZXR1cm4gKGF3YWl0IGhvc3QuaGFzQ2xhc3MoJ21hdC1kcmF3ZXItZW5kJykpID8gJ2VuZCcgOiAnc3RhcnQnO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG1vZGUgdGhhdCB0aGUgZHJhd2VyIGlzIGluLiAqL1xuICBhc3luYyBnZXRNb2RlKCk6IFByb21pc2U8J292ZXInfCdwdXNoJ3wnc2lkZSc+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG5cbiAgICBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWRyYXdlci1wdXNoJykpIHtcbiAgICAgIHJldHVybiAncHVzaCc7XG4gICAgfVxuXG4gICAgaWYgKGF3YWl0IGhvc3QuaGFzQ2xhc3MoJ21hdC1kcmF3ZXItc2lkZScpKSB7XG4gICAgICByZXR1cm4gJ3NpZGUnO1xuICAgIH1cblxuICAgIHJldHVybiAnb3Zlcic7XG4gIH1cbn1cbiJdfQ==