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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZW5hdi1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvdGVzdGluZy9zaWRlbmF2LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBR2xELG9FQUFvRTtBQUNwRTtJQUF1QyxxQ0FBZ0I7SUFBdkQ7O0lBbUJBLENBQUM7SUFoQkM7Ozs7O09BS0c7SUFDSSxzQkFBSSxHQUFYLFVBQVksT0FBa0M7UUFBOUMsaUJBSUM7UUFKVyx3QkFBQSxFQUFBLFlBQWtDO1FBQzVDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUM7YUFDakQsU0FBUyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUNuQyxVQUFPLE9BQU8sRUFBRSxRQUFROzt3QkFBTSxxQkFBTSxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUE7d0JBQTVCLHNCQUFBLENBQUMsU0FBMkIsQ0FBQyxLQUFLLFFBQVEsRUFBQTs7aUJBQUEsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFFRCx5REFBeUQ7SUFDbkQsNkNBQWlCLEdBQXZCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLEVBQUM7Ozs7S0FDMUQ7SUFqQk0sOEJBQVksR0FBRyxjQUFjLENBQUM7SUFrQnZDLHdCQUFDO0NBQUEsQUFuQkQsQ0FBdUMsZ0JBQWdCLEdBbUJ0RDtTQW5CWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdERyYXdlckhhcm5lc3N9IGZyb20gJy4vZHJhd2VyLWhhcm5lc3MnO1xuaW1wb3J0IHtEcmF3ZXJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9kcmF3ZXItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtc2lkZW5hdiBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTaWRlbmF2SGFybmVzcyBleHRlbmRzIE1hdERyYXdlckhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc2lkZW5hdic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgc2lkZW5hdiB3aXRoXG4gICAqIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoLlxuICAgKiBAcmV0dXJuIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBEcmF3ZXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXREcmF3ZXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdERyYXdlckhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3Bvc2l0aW9uJywgb3B0aW9ucy5wb3NpdGlvbixcbiAgICAgICAgICAgIGFzeW5jIChoYXJuZXNzLCBwb3NpdGlvbikgPT4gKGF3YWl0IGhhcm5lc3MuZ2V0UG9zaXRpb24oKSkgPT09IHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHNpZGVuYXYgaXMgZml4ZWQgaW4gdGhlIHZpZXdwb3J0LiAqL1xuICBhc3luYyBpc0ZpeGVkSW5WaWV3cG9ydCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LXNpZGVuYXYtZml4ZWQnKTtcbiAgfVxufVxuIl19