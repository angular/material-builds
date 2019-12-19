/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatButtonToggleHarness } from './button-toggle-harness';
/** Harness for interacting with a standard mat-button-toggle in tests. */
var MatButtonToggleGroupHarness = /** @class */ (function (_super) {
    __extends(MatButtonToggleGroupHarness, _super);
    function MatButtonToggleGroupHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatButtonToggleGroupHarness`
     * that meets certain criteria.
     * @param options Options for filtering which button toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatButtonToggleGroupHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatButtonToggleGroupHarness, options);
    };
    /**
     * Gets the button toggles that are inside the group.
     * @param filter Optionally filters which toggles are included.
     */
    MatButtonToggleGroupHarness.prototype.getToggles = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatButtonToggleHarness.with(filter))()];
            });
        });
    };
    /** Gets whether the button toggle group is disabled. */
    MatButtonToggleGroupHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getAttribute('aria-disabled')];
                    case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                }
            });
        });
    };
    /** Gets whether the button toggle group is laid out vertically. */
    MatButtonToggleGroupHarness.prototype.isVertical = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-button-toggle-vertical')];
                }
            });
        });
    };
    /** Gets the appearance that the group is using. */
    MatButtonToggleGroupHarness.prototype.getAppearance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host, className;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        className = 'mat-button-toggle-group-appearance-standard';
                        return [4 /*yield*/, host.hasClass(className)];
                    case 2: return [2 /*return*/, (_a.sent()) ? 'standard' : 'legacy'];
                }
            });
        });
    };
    /** The selector for the host element of a `MatButton` instance. */
    MatButtonToggleGroupHarness.hostSelector = 'mat-button-toggle-group';
    return MatButtonToggleGroupHarness;
}(ComponentHarness));
export { MatButtonToggleGroupHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLXRvZ2dsZS1ncm91cC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2J1dHRvbi10b2dnbGUvdGVzdGluZy9idXR0b24tdG9nZ2xlLWdyb3VwLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBSXhFLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBRy9ELDBFQUEwRTtBQUMxRTtJQUFpRCwrQ0FBZ0I7SUFBakU7O0lBdUNBLENBQUM7SUFuQ0M7Ozs7O09BS0c7SUFDSSxnQ0FBSSxHQUFYLFVBQVksT0FBNkM7UUFBN0Msd0JBQUEsRUFBQSxZQUE2QztRQUV2RCxPQUFPLElBQUksZ0JBQWdCLENBQUMsMkJBQTJCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVEOzs7T0FHRztJQUNHLGdEQUFVLEdBQWhCLFVBQWlCLE1BQXVDO1FBQXZDLHVCQUFBLEVBQUEsV0FBdUM7OztnQkFDdEQsc0JBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFDOzs7S0FDbEU7SUFFRCx3REFBd0Q7SUFDbEQsZ0RBQVUsR0FBaEI7Ozs7NEJBQ2dCLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBeEIscUJBQU0sQ0FBQyxTQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxFQUFBOzRCQUE5RCxzQkFBTyxDQUFBLFNBQXVELE1BQUssTUFBTSxFQUFDOzs7O0tBQzNFO0lBRUQsbUVBQW1FO0lBQzdELGdEQUFVLEdBQWhCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLDRCQUE0QixDQUFDLEVBQUM7Ozs7S0FDbkU7SUFFRCxtREFBbUQ7SUFDN0MsbURBQWEsR0FBbkI7Ozs7OzRCQUNlLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQXhCLElBQUksR0FBRyxTQUFpQjt3QkFDeEIsU0FBUyxHQUFHLDZDQUE2QyxDQUFDO3dCQUN6RCxxQkFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFBOzRCQUFyQyxzQkFBTyxDQUFBLFNBQThCLEVBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFDOzs7O0tBQy9EO0lBckNELG1FQUFtRTtJQUM1RCx3Q0FBWSxHQUFHLHlCQUF5QixDQUFDO0lBcUNsRCxrQ0FBQztDQUFBLEFBdkNELENBQWlELGdCQUFnQixHQXVDaEU7U0F2Q1ksMkJBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXRCdXR0b25Ub2dnbGVBcHBlYXJhbmNlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24tdG9nZ2xlJztcbmltcG9ydCB7QnV0dG9uVG9nZ2xlR3JvdXBIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9idXR0b24tdG9nZ2xlLWdyb3VwLWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge0J1dHRvblRvZ2dsZUhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2J1dHRvbi10b2dnbGUtaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7TWF0QnV0dG9uVG9nZ2xlSGFybmVzc30gZnJvbSAnLi9idXR0b24tdG9nZ2xlLWhhcm5lc3MnO1xuXG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LWJ1dHRvbi10b2dnbGUgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uVG9nZ2xlR3JvdXBIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0QnV0dG9uYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICdtYXQtYnV0dG9uLXRvZ2dsZS1ncm91cCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdEJ1dHRvblRvZ2dsZUdyb3VwSGFybmVzc2BcbiAgICogdGhhdCBtZWV0cyBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggYnV0dG9uIHRvZ2dsZSBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBCdXR0b25Ub2dnbGVHcm91cEhhcm5lc3NGaWx0ZXJzID0ge30pOlxuICAgIEhhcm5lc3NQcmVkaWNhdGU8TWF0QnV0dG9uVG9nZ2xlR3JvdXBIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEJ1dHRvblRvZ2dsZUdyb3VwSGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgYnV0dG9uIHRvZ2dsZXMgdGhhdCBhcmUgaW5zaWRlIHRoZSBncm91cC5cbiAgICogQHBhcmFtIGZpbHRlciBPcHRpb25hbGx5IGZpbHRlcnMgd2hpY2ggdG9nZ2xlcyBhcmUgaW5jbHVkZWQuXG4gICAqL1xuICBhc3luYyBnZXRUb2dnbGVzKGZpbHRlcjogQnV0dG9uVG9nZ2xlSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0QnV0dG9uVG9nZ2xlSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbChNYXRCdXR0b25Ub2dnbGVIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGJ1dHRvbiB0b2dnbGUgZ3JvdXAgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJykgPT09ICd0cnVlJztcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGJ1dHRvbiB0b2dnbGUgZ3JvdXAgaXMgbGFpZCBvdXQgdmVydGljYWxseS4gKi9cbiAgYXN5bmMgaXNWZXJ0aWNhbCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWJ1dHRvbi10b2dnbGUtdmVydGljYWwnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhcHBlYXJhbmNlIHRoYXQgdGhlIGdyb3VwIGlzIHVzaW5nLiAqL1xuICBhc3luYyBnZXRBcHBlYXJhbmNlKCk6IFByb21pc2U8TWF0QnV0dG9uVG9nZ2xlQXBwZWFyYW5jZT4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBjb25zdCBjbGFzc05hbWUgPSAnbWF0LWJ1dHRvbi10b2dnbGUtZ3JvdXAtYXBwZWFyYW5jZS1zdGFuZGFyZCc7XG4gICAgcmV0dXJuIGF3YWl0IGhvc3QuaGFzQ2xhc3MoY2xhc3NOYW1lKSA/ICdzdGFuZGFyZCcgOiAnbGVnYWN5JztcbiAgfVxufVxuIl19