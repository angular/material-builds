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
/**
 * Harness for interacting with a standard mat-sidenav in tests.
 * @dynamic
 */
var MatSidenavHarness = /** @class */ (function (_super) {
    __extends(MatSidenavHarness, _super);
    function MatSidenavHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a sidenav with
     * specific attributes.
     * @param options Options for narrowing the search.
     * @return `HarnessPredicate` configured with the given options.
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
    /** Gets whether the sidenav is fixed in the viewport. */
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
    MatSidenavHarness.hostSelector = '.mat-sidenav';
    return MatSidenavHarness;
}(MatDrawerHarness));
export { MatSidenavHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZW5hdi1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvdGVzdGluZy9zaWRlbmF2LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBR2xEOzs7R0FHRztBQUNIO0lBQXVDLHFDQUFnQjtJQUF2RDs7SUFtQkEsQ0FBQztJQWhCQzs7Ozs7T0FLRztJQUNJLHNCQUFJLEdBQVgsVUFBWSxPQUFrQztRQUE5QyxpQkFJQztRQUpXLHdCQUFBLEVBQUEsWUFBa0M7UUFDNUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQzthQUNqRCxTQUFTLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQ25DLFVBQU8sT0FBTyxFQUFFLFFBQVE7O3dCQUFNLHFCQUFNLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBQTt3QkFBNUIsc0JBQUEsQ0FBQyxTQUEyQixDQUFDLEtBQUssUUFBUSxFQUFBOztpQkFBQSxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVELHlEQUF5RDtJQUNuRCw2Q0FBaUIsR0FBdkI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsRUFBQzs7OztLQUMxRDtJQWpCTSw4QkFBWSxHQUFHLGNBQWMsQ0FBQztJQWtCdkMsd0JBQUM7Q0FBQSxBQW5CRCxDQUF1QyxnQkFBZ0IsR0FtQnREO1NBbkJZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0RHJhd2VySGFybmVzc30gZnJvbSAnLi9kcmF3ZXItaGFybmVzcyc7XG5pbXBvcnQge0RyYXdlckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2RyYXdlci1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtc2lkZW5hdiBpbiB0ZXN0cy5cbiAqIEBkeW5hbWljXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTaWRlbmF2SGFybmVzcyBleHRlbmRzIE1hdERyYXdlckhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc2lkZW5hdic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgc2lkZW5hdiB3aXRoXG4gICAqIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoLlxuICAgKiBAcmV0dXJuIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBEcmF3ZXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXREcmF3ZXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdERyYXdlckhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3Bvc2l0aW9uJywgb3B0aW9ucy5wb3NpdGlvbixcbiAgICAgICAgICAgIGFzeW5jIChoYXJuZXNzLCBwb3NpdGlvbikgPT4gKGF3YWl0IGhhcm5lc3MuZ2V0UG9zaXRpb24oKSkgPT09IHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHNpZGVuYXYgaXMgZml4ZWQgaW4gdGhlIHZpZXdwb3J0LiAqL1xuICBhc3luYyBpc0ZpeGVkSW5WaWV3cG9ydCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LXNpZGVuYXYtZml4ZWQnKTtcbiAgfVxufVxuIl19