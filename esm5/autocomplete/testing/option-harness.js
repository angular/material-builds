/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/**
 * Harness for interacting with a the `mat-option` for a `mat-autocomplete` in tests.
 * @dynamic
 */
var MatAutocompleteOptionHarness = /** @class */ (function (_super) {
    __extends(MatAutocompleteOptionHarness, _super);
    function MatAutocompleteOptionHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
    /** Gets a promise for the option's label text. */
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
    MatAutocompleteOptionHarness.hostSelector = '.mat-autocomplete-panel .mat-option';
    return MatAutocompleteOptionHarness;
}(ComponentHarness));
export { MatAutocompleteOptionHarness };
/**
 * Harness for interacting with a the `mat-optgroup` for a `mat-autocomplete` in tests.
 * @dynamic
 */
var MatAutocompleteOptionGroupHarness = /** @class */ (function (_super) {
    __extends(MatAutocompleteOptionGroupHarness, _super);
    function MatAutocompleteOptionGroupHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._label = _this.locatorFor('.mat-optgroup-label');
        return _this;
    }
    MatAutocompleteOptionGroupHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatAutocompleteOptionGroupHarness, options)
            .addOption('labelText', options.labelText, function (harness, label) { return HarnessPredicate.stringMatches(harness.getLabelText(), label); });
    };
    /** Gets a promise for the option group's label text. */
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
    MatAutocompleteOptionGroupHarness.hostSelector = '.mat-autocomplete-panel .mat-optgroup';
    return MatAutocompleteOptionGroupHarness;
}(ComponentHarness));
export { MatAutocompleteOptionGroupHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3Rpbmcvb3B0aW9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBcUIsTUFBTSxzQkFBc0IsQ0FBQztBQWE1Rjs7O0dBR0c7QUFDSDtJQUFrRCxnREFBZ0I7SUFBbEU7O0lBa0JBLENBQUM7SUFmUSxpQ0FBSSxHQUFYLFVBQVksT0FBa0M7UUFBbEMsd0JBQUEsRUFBQSxZQUFrQztRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsNEJBQTRCLEVBQUUsT0FBTyxDQUFDO2FBQzdELFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFDM0IsVUFBQyxPQUFPLEVBQUUsSUFBSSxJQUFLLE9BQUEsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBdkQsQ0FBdUQsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFFRCx5QkFBeUI7SUFDbkIsNkNBQU0sR0FBWjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFDOzs7O0tBQ3BDO0lBRUQsa0RBQWtEO0lBQzVDLDhDQUFPLEdBQWI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQzs7OztLQUNuQztJQWhCTSx5Q0FBWSxHQUFHLHFDQUFxQyxDQUFDO0lBaUI5RCxtQ0FBQztDQUFBLEFBbEJELENBQWtELGdCQUFnQixHQWtCakU7U0FsQlksNEJBQTRCO0FBb0J6Qzs7O0dBR0c7QUFDSDtJQUF1RCxxREFBZ0I7SUFBdkU7UUFBQSxxRUFjQztRQWJTLFlBQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0lBYTFELENBQUM7SUFWUSxzQ0FBSSxHQUFYLFVBQVksT0FBdUM7UUFBdkMsd0JBQUEsRUFBQSxZQUF1QztRQUNqRCxPQUFPLElBQUksZ0JBQWdCLENBQUMsaUNBQWlDLEVBQUUsT0FBTyxDQUFDO2FBQ2xFLFNBQVMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFDckMsVUFBQyxPQUFPLEVBQUUsS0FBSyxJQUFLLE9BQUEsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBN0QsQ0FBNkQsQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFFRCx3REFBd0Q7SUFDbEQsd0RBQVksR0FBbEI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFBOzRCQUEzQixzQkFBTyxDQUFDLFNBQW1CLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQzs7OztLQUNyQztJQVhNLDhDQUFZLEdBQUcsdUNBQXVDLENBQUM7SUFZaEUsd0NBQUM7Q0FBQSxBQWRELENBQXVELGdCQUFnQixHQWN0RTtTQWRZLGlDQUFpQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGUsIEJhc2VIYXJuZXNzRmlsdGVyc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuXG4vLyBUT0RPKGNyaXNiZXRvKTogY29tYmluZSB0aGVzZSB3aXRoIHRoZSBvbmVzIGluIGBtYXQtc2VsZWN0YFxuLy8gYW5kIGV4cGFuZCB0byBjb3ZlciBhbGwgc3RhdGVzIG9uY2Ugd2UgaGF2ZSBleHBlcmltZW50YWwvY29yZS5cblxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25IYXJuZXNzRmlsdGVycyBleHRlbmRzIEJhc2VIYXJuZXNzRmlsdGVycyB7XG4gIHRleHQ/OiBzdHJpbmcgfCBSZWdFeHA7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uR3JvdXBIYXJuZXNzRmlsdGVycyBleHRlbmRzIEJhc2VIYXJuZXNzRmlsdGVycyB7XG4gIGxhYmVsVGV4dD86IHN0cmluZyB8IFJlZ0V4cDtcbn1cblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgdGhlIGBtYXQtb3B0aW9uYCBmb3IgYSBgbWF0LWF1dG9jb21wbGV0ZWAgaW4gdGVzdHMuXG4gKiBAZHluYW1pY1xuICovXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlT3B0aW9uSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtYXV0b2NvbXBsZXRlLXBhbmVsIC5tYXQtb3B0aW9uJztcblxuICBzdGF0aWMgd2l0aChvcHRpb25zOiBPcHRpb25IYXJuZXNzRmlsdGVycyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEF1dG9jb21wbGV0ZU9wdGlvbkhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3RleHQnLCBvcHRpb25zLnRleHQsXG4gICAgICAgICAgICAoaGFybmVzcywgdGV4dCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGV4dCgpLCB0ZXh0KSk7XG4gIH1cblxuICAvKiogQ2xpY2tzIHRoZSBvcHRpb24uICovXG4gIGFzeW5jIHNlbGVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgb3B0aW9uJ3MgbGFiZWwgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxufVxuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSB0aGUgYG1hdC1vcHRncm91cGAgZm9yIGEgYG1hdC1hdXRvY29tcGxldGVgIGluIHRlc3RzLlxuICogQGR5bmFtaWNcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZU9wdGlvbkdyb3VwSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBwcml2YXRlIF9sYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1vcHRncm91cC1sYWJlbCcpO1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtYXV0b2NvbXBsZXRlLXBhbmVsIC5tYXQtb3B0Z3JvdXAnO1xuXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IE9wdGlvbkdyb3VwSGFybmVzc0ZpbHRlcnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRBdXRvY29tcGxldGVPcHRpb25Hcm91cEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ2xhYmVsVGV4dCcsIG9wdGlvbnMubGFiZWxUZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIGxhYmVsKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRMYWJlbFRleHQoKSwgbGFiZWwpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIG9wdGlvbiBncm91cCdzIGxhYmVsIHRleHQuICovXG4gIGFzeW5jIGdldExhYmVsVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fbGFiZWwoKSkudGV4dCgpO1xuICB9XG59XG4iXX0=