/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/**
 * Harness for interacting with a the `mat-option` for a `mat-autocomplete` in tests.
 * @dynamic
 */
var MatAutocompleteOptionHarness = /** @class */ (function (_super) {
    tslib_1.__extends(MatAutocompleteOptionHarness, _super);
    function MatAutocompleteOptionHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatAutocompleteOptionHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatAutocompleteOptionHarness, options)
            .addOption('text', options.text, function (harness, title) { return tslib_1.__awaiter(_this, void 0, void 0, function () { var _a, _b; return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = HarnessPredicate).stringMatches;
                    return [4 /*yield*/, harness.getText()];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent(), title])];
            }
        }); }); });
    };
    /** Clicks the option. */
    MatAutocompleteOptionHarness.prototype.click = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).click()];
                }
            });
        });
    };
    /** Gets a promise for the option's label text. */
    MatAutocompleteOptionHarness.prototype.getText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
    tslib_1.__extends(MatAutocompleteOptionGroupHarness, _super);
    function MatAutocompleteOptionGroupHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._label = _this.locatorFor('.mat-optgroup-label');
        return _this;
    }
    MatAutocompleteOptionGroupHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatAutocompleteOptionGroupHarness, options)
            .addOption('labelText', options.labelText, function (harness, title) { return tslib_1.__awaiter(_this, void 0, void 0, function () { var _a, _b; return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = HarnessPredicate).stringMatches;
                    return [4 /*yield*/, harness.getLabelText()];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent(), title])];
            }
        }); }); });
    };
    /** Gets a promise for the option group's label text. */
    MatAutocompleteOptionGroupHarness.prototype.getLabelText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3Rpbmcvb3B0aW9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBcUIsTUFBTSxzQkFBc0IsQ0FBQztBQWE1Rjs7O0dBR0c7QUFDSDtJQUFrRCx3REFBZ0I7SUFBbEU7O0lBbUJBLENBQUM7SUFoQlEsaUNBQUksR0FBWCxVQUFZLE9BQWtDO1FBQTlDLGlCQUtDO1FBTFcsd0JBQUEsRUFBQSxZQUFrQztRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsNEJBQTRCLEVBQUUsT0FBTyxDQUFDO2FBQzdELFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFDM0IsVUFBTyxPQUFPLEVBQUUsS0FBSzs7O29CQUNqQixLQUFBLENBQUEsS0FBQSxnQkFBZ0IsQ0FBQSxDQUFDLGFBQWEsQ0FBQTtvQkFBQyxxQkFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUE7d0JBQXRELHNCQUFBLGNBQStCLFNBQXVCLEVBQUUsS0FBSyxFQUFDLEVBQUE7O2lCQUFBLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRUQseUJBQXlCO0lBQ25CLDRDQUFLLEdBQVg7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBQzs7OztLQUNwQztJQUVELGtEQUFrRDtJQUM1Qyw4Q0FBTyxHQUFiOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUM7Ozs7S0FDbkM7SUFqQk0seUNBQVksR0FBRyxxQ0FBcUMsQ0FBQztJQWtCOUQsbUNBQUM7Q0FBQSxBQW5CRCxDQUFrRCxnQkFBZ0IsR0FtQmpFO1NBbkJZLDRCQUE0QjtBQXFCekM7OztHQUdHO0FBQ0g7SUFBdUQsNkRBQWdCO0lBQXZFO1FBQUEscUVBZUM7UUFkUyxZQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOztJQWMxRCxDQUFDO0lBWFEsc0NBQUksR0FBWCxVQUFZLE9BQXVDO1FBQW5ELGlCQUtDO1FBTFcsd0JBQUEsRUFBQSxZQUF1QztRQUNqRCxPQUFPLElBQUksZ0JBQWdCLENBQUMsaUNBQWlDLEVBQUUsT0FBTyxDQUFDO2FBQ2xFLFNBQVMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFDckMsVUFBTyxPQUFPLEVBQUUsS0FBSzs7O29CQUNqQixLQUFBLENBQUEsS0FBQSxnQkFBZ0IsQ0FBQSxDQUFDLGFBQWEsQ0FBQTtvQkFBQyxxQkFBTSxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUE7d0JBQTNELHNCQUFBLGNBQStCLFNBQTRCLEVBQUUsS0FBSyxFQUFDLEVBQUE7O2lCQUFBLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRUQsd0RBQXdEO0lBQ2xELHdEQUFZLEdBQWxCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBQTs0QkFBM0Isc0JBQU8sQ0FBQyxTQUFtQixDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUM7Ozs7S0FDckM7SUFaTSw4Q0FBWSxHQUFHLHVDQUF1QyxDQUFDO0lBYWhFLHdDQUFDO0NBQUEsQUFmRCxDQUF1RCxnQkFBZ0IsR0FldEU7U0FmWSxpQ0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBCYXNlSGFybmVzc0ZpbHRlcnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcblxuLy8gVE9ETyhjcmlzYmV0byk6IGNvbWJpbmUgdGhlc2Ugd2l0aCB0aGUgb25lcyBpbiBgbWF0LXNlbGVjdGBcbi8vIGFuZCBleHBhbmQgdG8gY292ZXIgYWxsIHN0YXRlcyBvbmNlIHdlIGhhdmUgZXhwZXJpbWVudGFsL2NvcmUuXG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uSGFybmVzc0ZpbHRlcnMgZXh0ZW5kcyBCYXNlSGFybmVzc0ZpbHRlcnMge1xuICB0ZXh0Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbkdyb3VwSGFybmVzc0ZpbHRlcnMgZXh0ZW5kcyBCYXNlSGFybmVzc0ZpbHRlcnMge1xuICBsYWJlbFRleHQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHRoZSBgbWF0LW9wdGlvbmAgZm9yIGEgYG1hdC1hdXRvY29tcGxldGVgIGluIHRlc3RzLlxuICogQGR5bmFtaWNcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZU9wdGlvbkhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWF1dG9jb21wbGV0ZS1wYW5lbCAubWF0LW9wdGlvbic7XG5cbiAgc3RhdGljIHdpdGgob3B0aW9uczogT3B0aW9uSGFybmVzc0ZpbHRlcnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRBdXRvY29tcGxldGVPcHRpb25IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgICAgYXN5bmMgKGhhcm5lc3MsIHRpdGxlKSA9PlxuICAgICAgICAgICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhhd2FpdCBoYXJuZXNzLmdldFRleHQoKSwgdGl0bGUpKTtcbiAgfVxuXG4gIC8qKiBDbGlja3MgdGhlIG9wdGlvbi4gKi9cbiAgYXN5bmMgY2xpY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIG9wdGlvbidzIGxhYmVsIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cbn1cblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgdGhlIGBtYXQtb3B0Z3JvdXBgIGZvciBhIGBtYXQtYXV0b2NvbXBsZXRlYCBpbiB0ZXN0cy5cbiAqIEBkeW5hbWljXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVPcHRpb25Hcm91cEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgcHJpdmF0ZSBfbGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtb3B0Z3JvdXAtbGFiZWwnKTtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWF1dG9jb21wbGV0ZS1wYW5lbCAubWF0LW9wdGdyb3VwJztcblxuICBzdGF0aWMgd2l0aChvcHRpb25zOiBPcHRpb25Hcm91cEhhcm5lc3NGaWx0ZXJzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0QXV0b2NvbXBsZXRlT3B0aW9uR3JvdXBIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCdsYWJlbFRleHQnLCBvcHRpb25zLmxhYmVsVGV4dCxcbiAgICAgICAgICAgIGFzeW5jIChoYXJuZXNzLCB0aXRsZSkgPT5cbiAgICAgICAgICAgICAgICBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoYXdhaXQgaGFybmVzcy5nZXRMYWJlbFRleHQoKSwgdGl0bGUpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIG9wdGlvbiBncm91cCdzIGxhYmVsIHRleHQuICovXG4gIGFzeW5jIGdldExhYmVsVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fbGFiZWwoKSkudGV4dCgpO1xuICB9XG59XG5cbiJdfQ==