/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatListHarnessBase } from './list-harness-base';
import { getListItemPredicate, MatListItemHarnessBase } from './list-item-harness-base';
/** Harness for interacting with a standard mat-list in tests. */
var MatListHarness = /** @class */ (function (_super) {
    __extends(MatListHarness, _super);
    function MatListHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._itemHarness = MatListItemHarness;
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListHarness` that meets certain
     * criteria.
     * @param options Options for filtering which list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatListHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatListHarness, options);
    };
    /** The selector for the host element of a `MatList` instance. */
    MatListHarness.hostSelector = 'mat-list';
    return MatListHarness;
}(MatListHarnessBase));
export { MatListHarness };
/** Harness for interacting with a list item. */
var MatListItemHarness = /** @class */ (function (_super) {
    __extends(MatListItemHarness, _super);
    function MatListItemHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListItemHarness` that meets
     * certain criteria.
     * @param options Options for filtering which list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatListItemHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return getListItemPredicate(MatListItemHarness, options);
    };
    /** The selector for the host element of a `MatListItem` instance. */
    MatListItemHarness.hostSelector = ['mat-list-item', 'a[mat-list-item]', 'button[mat-list-item]']
        .map(function (selector) { return MatListHarness.hostSelector + " " + selector; })
        .join(',');
    return MatListItemHarness;
}(MatListItemHarnessBase));
export { MatListItemHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xpc3QvdGVzdGluZy9saXN0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRXZELE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxzQkFBc0IsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBRXRGLGlFQUFpRTtBQUNqRTtJQUNJLGtDQUF5RjtJQUQ3RjtRQUFBLHFFQWdCQztRQURDLGtCQUFZLEdBQUcsa0JBQWtCLENBQUM7O0lBQ3BDLENBQUM7SUFYQzs7Ozs7T0FLRztJQUNJLG1CQUFJLEdBQVgsVUFBWSxPQUFnQztRQUFoQyx3QkFBQSxFQUFBLFlBQWdDO1FBQzFDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQVhELGlFQUFpRTtJQUMxRCwyQkFBWSxHQUFHLFVBQVUsQ0FBQztJQWFuQyxxQkFBQztDQUFBLEFBaEJELENBQ0ksa0JBQWtCLEdBZXJCO1NBaEJZLGNBQWM7QUFrQjNCLGdEQUFnRDtBQUNoRDtJQUF3QyxzQ0FBc0I7SUFBOUQ7O0lBZUEsQ0FBQztJQVRDOzs7OztPQUtHO0lBQ0ksdUJBQUksR0FBWCxVQUFZLE9BQW9DO1FBQXBDLHdCQUFBLEVBQUEsWUFBb0M7UUFDOUMsT0FBTyxvQkFBb0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBYkQscUVBQXFFO0lBQzlELCtCQUFZLEdBQUcsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsdUJBQXVCLENBQUM7U0FDL0UsR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUcsY0FBYyxDQUFDLFlBQVksU0FBSSxRQUFVLEVBQTVDLENBQTRDLENBQUM7U0FDN0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBV2pCLHlCQUFDO0NBQUEsQUFmRCxDQUF3QyxzQkFBc0IsR0FlN0Q7U0FmWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdExpc3RIYXJuZXNzQmFzZX0gZnJvbSAnLi9saXN0LWhhcm5lc3MtYmFzZSc7XG5pbXBvcnQge0xpc3RIYXJuZXNzRmlsdGVycywgTGlzdEl0ZW1IYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9saXN0LWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge2dldExpc3RJdGVtUHJlZGljYXRlLCBNYXRMaXN0SXRlbUhhcm5lc3NCYXNlfSBmcm9tICcuL2xpc3QtaXRlbS1oYXJuZXNzLWJhc2UnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1saXN0IGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdExpc3RIYXJuZXNzIGV4dGVuZHNcbiAgICBNYXRMaXN0SGFybmVzc0Jhc2U8dHlwZW9mIE1hdExpc3RJdGVtSGFybmVzcywgTWF0TGlzdEl0ZW1IYXJuZXNzLCBMaXN0SXRlbUhhcm5lc3NGaWx0ZXJzPiB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0TGlzdGAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnbWF0LWxpc3QnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRMaXN0SGFybmVzc2AgdGhhdCBtZWV0cyBjZXJ0YWluXG4gICAqIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggbGlzdCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBMaXN0SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TGlzdEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TGlzdEhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgX2l0ZW1IYXJuZXNzID0gTWF0TGlzdEl0ZW1IYXJuZXNzO1xufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIGxpc3QgaXRlbS4gKi9cbmV4cG9ydCBjbGFzcyBNYXRMaXN0SXRlbUhhcm5lc3MgZXh0ZW5kcyBNYXRMaXN0SXRlbUhhcm5lc3NCYXNlIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRMaXN0SXRlbWAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSBbJ21hdC1saXN0LWl0ZW0nLCAnYVttYXQtbGlzdC1pdGVtXScsICdidXR0b25bbWF0LWxpc3QtaXRlbV0nXVxuICAgICAgLm1hcChzZWxlY3RvciA9PiBgJHtNYXRMaXN0SGFybmVzcy5ob3N0U2VsZWN0b3J9ICR7c2VsZWN0b3J9YClcbiAgICAgIC5qb2luKCcsJyk7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdExpc3RJdGVtSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggbGlzdCBpdGVtIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IExpc3RJdGVtSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TGlzdEl0ZW1IYXJuZXNzPiB7XG4gICAgcmV0dXJuIGdldExpc3RJdGVtUHJlZGljYXRlKE1hdExpc3RJdGVtSGFybmVzcywgb3B0aW9ucyk7XG4gIH1cbn1cbiJdfQ==