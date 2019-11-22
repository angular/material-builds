/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a the `mat-option` for a `mat-autocomplete` in tests. */
var MatAutocompleteOptionHarness = /** @class */ (function (_super) {
    __extends(MatAutocompleteOptionHarness, _super);
    function MatAutocompleteOptionHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatAutocompleteOptionHarness` that
     * meets certain criteria.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatAutocompleteOptionHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatAutocompleteOptionHarness, options)
            .addOption('text', options.text, function (harness, text) { return HarnessPredicate.stringMatches(harness.getText(), text); });
    };
    /** Clicks the option. */
    MatAutocompleteOptionHarness.prototype.select = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).click()];
                }
            });
        });
    };
    /** Gets the option's label text. */
    MatAutocompleteOptionHarness.prototype.getText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** The selector for the host element of an autocomplete `MatOption` instance. */
    MatAutocompleteOptionHarness.hostSelector = '.mat-autocomplete-panel .mat-option';
    return MatAutocompleteOptionHarness;
}(ComponentHarness));
export { MatAutocompleteOptionHarness };
/** Harness for interacting with a the `mat-optgroup` for a `mat-autocomplete` in tests. */
var MatAutocompleteOptionGroupHarness = /** @class */ (function (_super) {
    __extends(MatAutocompleteOptionGroupHarness, _super);
    function MatAutocompleteOptionGroupHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._label = _this.locatorFor('.mat-optgroup-label');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatAutocompleteOptionGroupHarness`
     * that meets certain criteria.
     * @param options Options for filtering which option group instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatAutocompleteOptionGroupHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatAutocompleteOptionGroupHarness, options)
            .addOption('labelText', options.labelText, function (harness, label) { return HarnessPredicate.stringMatches(harness.getLabelText(), label); });
    };
    /** Gets the option group's label text. */
    MatAutocompleteOptionGroupHarness.prototype.getLabelText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._label()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** The selector for the host element of an autocomplete `MatOptionGroup` instance. */
    MatAutocompleteOptionGroupHarness.hostSelector = '.mat-autocomplete-panel .mat-optgroup';
    return MatAutocompleteOptionGroupHarness;
}(ComponentHarness));
export { MatAutocompleteOptionGroupHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3Rpbmcvb3B0aW9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBcUIsTUFBTSxzQkFBc0IsQ0FBQztBQXNCNUYseUZBQXlGO0FBQ3pGO0lBQWtELGdEQUFnQjtJQUFsRTs7SUF5QkEsQ0FBQztJQXJCQzs7Ozs7T0FLRztJQUNJLGlDQUFJLEdBQVgsVUFBWSxPQUFrQztRQUFsQyx3QkFBQSxFQUFBLFlBQWtDO1FBQzVDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyw0QkFBNEIsRUFBRSxPQUFPLENBQUM7YUFDN0QsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUMzQixVQUFDLE9BQU8sRUFBRSxJQUFJLElBQUssT0FBQSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxFQUF2RCxDQUF1RCxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUVELHlCQUF5QjtJQUNuQiw2Q0FBTSxHQUFaOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUM7Ozs7S0FDcEM7SUFFRCxvQ0FBb0M7SUFDOUIsOENBQU8sR0FBYjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ25DO0lBdkJELGlGQUFpRjtJQUMxRSx5Q0FBWSxHQUFHLHFDQUFxQyxDQUFDO0lBdUI5RCxtQ0FBQztDQUFBLEFBekJELENBQWtELGdCQUFnQixHQXlCakU7U0F6QlksNEJBQTRCO0FBMkJ6QywyRkFBMkY7QUFDM0Y7SUFBdUQscURBQWdCO0lBQXZFO1FBQUEscUVBc0JDO1FBckJTLFlBQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0lBcUIxRCxDQUFDO0lBaEJDOzs7OztPQUtHO0lBQ0ksc0NBQUksR0FBWCxVQUFZLE9BQXVDO1FBQXZDLHdCQUFBLEVBQUEsWUFBdUM7UUFDakQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGlDQUFpQyxFQUFFLE9BQU8sQ0FBQzthQUNsRSxTQUFTLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQ3JDLFVBQUMsT0FBTyxFQUFFLEtBQUssSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQTdELENBQTZELENBQUMsQ0FBQztJQUM3RixDQUFDO0lBRUQsMENBQTBDO0lBQ3BDLHdEQUFZLEdBQWxCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBQTs0QkFBM0Isc0JBQU8sQ0FBQyxTQUFtQixDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUM7Ozs7S0FDckM7SUFsQkQsc0ZBQXNGO0lBQy9FLDhDQUFZLEdBQUcsdUNBQXVDLENBQUM7SUFrQmhFLHdDQUFDO0NBQUEsQUF0QkQsQ0FBdUQsZ0JBQWdCLEdBc0J0RTtTQXRCWSxpQ0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBCYXNlSGFybmVzc0ZpbHRlcnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcblxuLy8gVE9ETyhjcmlzYmV0byk6IGNvbWJpbmUgdGhlc2Ugd2l0aCB0aGUgb25lcyBpbiBgbWF0LXNlbGVjdGBcbi8vIGFuZCBleHBhbmQgdG8gY292ZXIgYWxsIHN0YXRlcyBvbmNlIHdlIGhhdmUgZXhwZXJpbWVudGFsL2NvcmUuXG5cbi8qKlxuICogQSBzZXQgb2YgY3JpdGVyaWEgdGhhdCBjYW4gYmUgdXNlZCB0byBmaWx0ZXIgYSBsaXN0IG9mIGBNYXRBdXRvY29tcGxldGVPcHRpb25IYXJuZXNzYCBpbnN0YW5jZXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPcHRpb25IYXJuZXNzRmlsdGVycyBleHRlbmRzIEJhc2VIYXJuZXNzRmlsdGVycyB7XG4gIC8qKiBPbmx5IGZpbmQgaW5zdGFuY2VzIHdob3NlIHRleHQgbWF0Y2hlcyB0aGUgZ2l2ZW4gdmFsdWUuICovXG4gIHRleHQ/OiBzdHJpbmcgfCBSZWdFeHA7XG59XG5cbi8qKlxuICogQSBzZXQgb2YgY3JpdGVyaWEgdGhhdCBjYW4gYmUgdXNlZCB0byBmaWx0ZXIgYSBsaXN0IG9mIGBNYXRBdXRvY29tcGxldGVPcHRpb25Hcm91cEhhcm5lc3NgXG4gKiBpbnN0YW5jZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uR3JvdXBIYXJuZXNzRmlsdGVycyBleHRlbmRzIEJhc2VIYXJuZXNzRmlsdGVycyB7XG4gIC8qKiBPbmx5IGZpbmQgaW5zdGFuY2VzIHdob3NlIGxhYmVsIHRleHQgbWF0Y2hlcyB0aGUgZ2l2ZW4gdmFsdWUuICovXG4gIGxhYmVsVGV4dD86IHN0cmluZyB8IFJlZ0V4cDtcbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSB0aGUgYG1hdC1vcHRpb25gIGZvciBhIGBtYXQtYXV0b2NvbXBsZXRlYCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVPcHRpb25IYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYW4gYXV0b2NvbXBsZXRlIGBNYXRPcHRpb25gIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtYXV0b2NvbXBsZXRlLXBhbmVsIC5tYXQtb3B0aW9uJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0QXV0b2NvbXBsZXRlT3B0aW9uSGFybmVzc2AgdGhhdFxuICAgKiBtZWV0cyBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggb3B0aW9uIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IE9wdGlvbkhhcm5lc3NGaWx0ZXJzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0QXV0b2NvbXBsZXRlT3B0aW9uSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCxcbiAgICAgICAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUZXh0KCksIHRleHQpKTtcbiAgfVxuXG4gIC8qKiBDbGlja3MgdGhlIG9wdGlvbi4gKi9cbiAgYXN5bmMgc2VsZWN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgb3B0aW9uJ3MgbGFiZWwgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHRoZSBgbWF0LW9wdGdyb3VwYCBmb3IgYSBgbWF0LWF1dG9jb21wbGV0ZWAgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlT3B0aW9uR3JvdXBIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHByaXZhdGUgX2xhYmVsID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LW9wdGdyb3VwLWxhYmVsJyk7XG5cbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhbiBhdXRvY29tcGxldGUgYE1hdE9wdGlvbkdyb3VwYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWF1dG9jb21wbGV0ZS1wYW5lbCAubWF0LW9wdGdyb3VwJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0QXV0b2NvbXBsZXRlT3B0aW9uR3JvdXBIYXJuZXNzYFxuICAgKiB0aGF0IG1lZXRzIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBvcHRpb24gZ3JvdXAgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogT3B0aW9uR3JvdXBIYXJuZXNzRmlsdGVycyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEF1dG9jb21wbGV0ZU9wdGlvbkdyb3VwSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbignbGFiZWxUZXh0Jywgb3B0aW9ucy5sYWJlbFRleHQsXG4gICAgICAgICAgICAoaGFybmVzcywgbGFiZWwpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldExhYmVsVGV4dCgpLCBsYWJlbCkpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG9wdGlvbiBncm91cCdzIGxhYmVsIHRleHQuICovXG4gIGFzeW5jIGdldExhYmVsVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fbGFiZWwoKSkudGV4dCgpO1xuICB9XG59XG4iXX0=