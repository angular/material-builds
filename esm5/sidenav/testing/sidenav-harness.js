/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatDrawerHarness } from './drawer-harness';
/** Harness for interacting with a standard mat-sidenav in tests. */
var MatSidenavHarness = /** @class */ (function (_super) {
    __extends(MatSidenavHarness, _super);
    function MatSidenavHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSidenavHarness` that meets
     * certain criteria.
     * @param options Options for filtering which sidenav instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatSidenavHarness.with = function (options) {
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
    /** Whether the sidenav is fixed in the viewport. */
    MatSidenavHarness.prototype.isFixedInViewport = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-sidenav-fixed')];
                }
            });
        });
    };
    /** The selector for the host element of a `MatSidenav` instance. */
    MatSidenavHarness.hostSelector = '.mat-sidenav';
    return MatSidenavHarness;
}(MatDrawerHarness));
export { MatSidenavHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZW5hdi1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvdGVzdGluZy9zaWRlbmF2LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBR2xELG9FQUFvRTtBQUNwRTtJQUF1QyxxQ0FBZ0I7SUFBdkQ7O0lBb0JBLENBQUM7SUFoQkM7Ozs7O09BS0c7SUFDSSxzQkFBSSxHQUFYLFVBQVksT0FBa0M7UUFBOUMsaUJBSUM7UUFKVyx3QkFBQSxFQUFBLFlBQWtDO1FBQzVDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUM7YUFDakQsU0FBUyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUNuQyxVQUFPLE9BQU8sRUFBRSxRQUFROzt3QkFBTSxxQkFBTSxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUE7d0JBQTVCLHNCQUFBLENBQUMsU0FBMkIsQ0FBQyxLQUFLLFFBQVEsRUFBQTs7aUJBQUEsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFFRCxvREFBb0Q7SUFDOUMsNkNBQWlCLEdBQXZCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLEVBQUM7Ozs7S0FDMUQ7SUFsQkQsb0VBQW9FO0lBQzdELDhCQUFZLEdBQUcsY0FBYyxDQUFDO0lBa0J2Qyx3QkFBQztDQUFBLEFBcEJELENBQXVDLGdCQUFnQixHQW9CdEQ7U0FwQlksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXREcmF3ZXJIYXJuZXNzfSBmcm9tICcuL2RyYXdlci1oYXJuZXNzJztcbmltcG9ydCB7RHJhd2VySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vZHJhd2VyLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXNpZGVuYXYgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0U2lkZW5hdkhhcm5lc3MgZXh0ZW5kcyBNYXREcmF3ZXJIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRTaWRlbmF2YCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXNpZGVuYXYnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRTaWRlbmF2SGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggc2lkZW5hdiBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBEcmF3ZXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXREcmF3ZXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdERyYXdlckhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3Bvc2l0aW9uJywgb3B0aW9ucy5wb3NpdGlvbixcbiAgICAgICAgICAgIGFzeW5jIChoYXJuZXNzLCBwb3NpdGlvbikgPT4gKGF3YWl0IGhhcm5lc3MuZ2V0UG9zaXRpb24oKSkgPT09IHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzaWRlbmF2IGlzIGZpeGVkIGluIHRoZSB2aWV3cG9ydC4gKi9cbiAgYXN5bmMgaXNGaXhlZEluVmlld3BvcnQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1zaWRlbmF2LWZpeGVkJyk7XG4gIH1cbn1cbiJdfQ==