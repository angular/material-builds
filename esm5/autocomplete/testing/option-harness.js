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
/** Harness for interacting with a the `mat-optgroup` for a `mat-autocomplete` in tests. */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3Rpbmcvb3B0aW9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBcUIsTUFBTSxzQkFBc0IsQ0FBQztBQWE1Rix5RkFBeUY7QUFDekY7SUFBa0QsZ0RBQWdCO0lBQWxFOztJQWtCQSxDQUFDO0lBZlEsaUNBQUksR0FBWCxVQUFZLE9BQWtDO1FBQWxDLHdCQUFBLEVBQUEsWUFBa0M7UUFDNUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLDRCQUE0QixFQUFFLE9BQU8sQ0FBQzthQUM3RCxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQzNCLFVBQUMsT0FBTyxFQUFFLElBQUksSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQXZELENBQXVELENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRUQseUJBQXlCO0lBQ25CLDZDQUFNLEdBQVo7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBQzs7OztLQUNwQztJQUVELGtEQUFrRDtJQUM1Qyw4Q0FBTyxHQUFiOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUM7Ozs7S0FDbkM7SUFoQk0seUNBQVksR0FBRyxxQ0FBcUMsQ0FBQztJQWlCOUQsbUNBQUM7Q0FBQSxBQWxCRCxDQUFrRCxnQkFBZ0IsR0FrQmpFO1NBbEJZLDRCQUE0QjtBQW9CekMsMkZBQTJGO0FBQzNGO0lBQXVELHFEQUFnQjtJQUF2RTtRQUFBLHFFQWNDO1FBYlMsWUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7SUFhMUQsQ0FBQztJQVZRLHNDQUFJLEdBQVgsVUFBWSxPQUF1QztRQUF2Qyx3QkFBQSxFQUFBLFlBQXVDO1FBQ2pELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxpQ0FBaUMsRUFBRSxPQUFPLENBQUM7YUFDbEUsU0FBUyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUNyQyxVQUFDLE9BQU8sRUFBRSxLQUFLLElBQUssT0FBQSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUE3RCxDQUE2RCxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUVELHdEQUF3RDtJQUNsRCx3REFBWSxHQUFsQjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUE7NEJBQTNCLHNCQUFPLENBQUMsU0FBbUIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ3JDO0lBWE0sOENBQVksR0FBRyx1Q0FBdUMsQ0FBQztJQVloRSx3Q0FBQztDQUFBLEFBZEQsQ0FBdUQsZ0JBQWdCLEdBY3RFO1NBZFksaUNBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZSwgQmFzZUhhcm5lc3NGaWx0ZXJzfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5cbi8vIFRPRE8oY3Jpc2JldG8pOiBjb21iaW5lIHRoZXNlIHdpdGggdGhlIG9uZXMgaW4gYG1hdC1zZWxlY3RgXG4vLyBhbmQgZXhwYW5kIHRvIGNvdmVyIGFsbCBzdGF0ZXMgb25jZSB3ZSBoYXZlIGV4cGVyaW1lbnRhbC9jb3JlLlxuXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbkhhcm5lc3NGaWx0ZXJzIGV4dGVuZHMgQmFzZUhhcm5lc3NGaWx0ZXJzIHtcbiAgdGV4dD86IHN0cmluZyB8IFJlZ0V4cDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25Hcm91cEhhcm5lc3NGaWx0ZXJzIGV4dGVuZHMgQmFzZUhhcm5lc3NGaWx0ZXJzIHtcbiAgbGFiZWxUZXh0Pzogc3RyaW5nIHwgUmVnRXhwO1xufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHRoZSBgbWF0LW9wdGlvbmAgZm9yIGEgYG1hdC1hdXRvY29tcGxldGVgIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZU9wdGlvbkhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWF1dG9jb21wbGV0ZS1wYW5lbCAubWF0LW9wdGlvbic7XG5cbiAgc3RhdGljIHdpdGgob3B0aW9uczogT3B0aW9uSGFybmVzc0ZpbHRlcnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRBdXRvY29tcGxldGVPcHRpb25IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCkpO1xuICB9XG5cbiAgLyoqIENsaWNrcyB0aGUgb3B0aW9uLiAqL1xuICBhc3luYyBzZWxlY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIG9wdGlvbidzIGxhYmVsIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSB0aGUgYG1hdC1vcHRncm91cGAgZm9yIGEgYG1hdC1hdXRvY29tcGxldGVgIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZU9wdGlvbkdyb3VwSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBwcml2YXRlIF9sYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1vcHRncm91cC1sYWJlbCcpO1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtYXV0b2NvbXBsZXRlLXBhbmVsIC5tYXQtb3B0Z3JvdXAnO1xuXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IE9wdGlvbkdyb3VwSGFybmVzc0ZpbHRlcnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRBdXRvY29tcGxldGVPcHRpb25Hcm91cEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ2xhYmVsVGV4dCcsIG9wdGlvbnMubGFiZWxUZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIGxhYmVsKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRMYWJlbFRleHQoKSwgbGFiZWwpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIG9wdGlvbiBncm91cCdzIGxhYmVsIHRleHQuICovXG4gIGFzeW5jIGdldExhYmVsVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fbGFiZWwoKSkudGV4dCgpO1xuICB9XG59XG4iXX0=