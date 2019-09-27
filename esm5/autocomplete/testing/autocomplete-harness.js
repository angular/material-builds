/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
/** Selector for the autocomplete panel. */
var PANEL_SELECTOR = '.mat-autocomplete-panel';
/**
 * Harness for interacting with a standard mat-autocomplete in tests.
 * @dynamic
 */
var MatAutocompleteHarness = /** @class */ (function (_super) {
    tslib_1.__extends(MatAutocompleteHarness, _super);
    function MatAutocompleteHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._documentRootLocator = _this.documentRootLocatorFactory();
        _this._panel = _this._documentRootLocator.locatorFor(PANEL_SELECTOR);
        _this._optionalPanel = _this._documentRootLocator.locatorForOptional(PANEL_SELECTOR);
        _this._options = _this._documentRootLocator.locatorForAll(PANEL_SELECTOR + " .mat-option");
        _this._groups = _this._documentRootLocator.locatorForAll(PANEL_SELECTOR + " .mat-optgroup");
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for an autocomplete with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `name` finds an autocomplete with a specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatAutocompleteHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatAutocompleteHarness, options);
    };
    MatAutocompleteHarness.prototype.getAttribute = function (attributeName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute(attributeName)];
                }
            });
        });
    };
    /** Gets a boolean promise indicating if the autocomplete input is disabled. */
    MatAutocompleteHarness.prototype.isDisabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var disabled, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        disabled = (_b.sent()).getAttribute('disabled');
                        _a = coerceBooleanProperty;
                        return [4 /*yield*/, disabled];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    /** Gets a promise for the autocomplete's text. */
    MatAutocompleteHarness.prototype.getText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getProperty('value')];
                }
            });
        });
    };
    /** Focuses the input and returns a void promise that indicates when the action is complete. */
    MatAutocompleteHarness.prototype.focus = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the input and returns a void promise that indicates when the action is complete. */
    MatAutocompleteHarness.prototype.blur = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /** Enters text into the autocomplete. */
    MatAutocompleteHarness.prototype.enterText = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).sendKeys(value)];
                }
            });
        });
    };
    /** Gets the autocomplete panel. */
    MatAutocompleteHarness.prototype.getPanel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._panel()];
            });
        });
    };
    /** Gets the options inside the autocomplete panel. */
    MatAutocompleteHarness.prototype.getOptions = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._options()];
            });
        });
    };
    /** Gets the groups of options inside the panel. */
    MatAutocompleteHarness.prototype.getOptionGroups = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._groups()];
            });
        });
    };
    /** Gets whether the autocomplete panel is visible. */
    MatAutocompleteHarness.prototype.isPanelVisible = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._panel()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-autocomplete-visible')];
                }
            });
        });
    };
    /** Gets whether the autocomplete is open. */
    MatAutocompleteHarness.prototype.isOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._optionalPanel()];
                    case 1: return [2 /*return*/, !!(_a.sent())];
                }
            });
        });
    };
    MatAutocompleteHarness.hostSelector = '.mat-autocomplete-trigger';
    return MatAutocompleteHarness;
}(ComponentHarness));
export { MatAutocompleteHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3RpbmcvYXV0b2NvbXBsZXRlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBYyxNQUFNLHNCQUFzQixDQUFDO0FBQ3JGLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRzVELDJDQUEyQztBQUMzQyxJQUFNLGNBQWMsR0FBRyx5QkFBeUIsQ0FBQztBQUVqRDs7O0dBR0c7QUFDSDtJQUE0QyxrREFBZ0I7SUFBNUQ7UUFBQSxxRUEwRUM7UUF6RVMsMEJBQW9CLEdBQUcsS0FBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDekQsWUFBTSxHQUFHLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDOUQsb0JBQWMsR0FBRyxLQUFJLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDOUUsY0FBUSxHQUFHLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUksY0FBYyxpQkFBYyxDQUFDLENBQUM7UUFDcEYsYUFBTyxHQUFHLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUksY0FBYyxtQkFBZ0IsQ0FBQyxDQUFDOztJQXFFL0YsQ0FBQztJQWpFQzs7Ozs7O09BTUc7SUFDSSwyQkFBSSxHQUFYLFVBQVksT0FBd0M7UUFBeEMsd0JBQUEsRUFBQSxZQUF3QztRQUNsRCxPQUFPLElBQUksZ0JBQWdCLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVLLDZDQUFZLEdBQWxCLFVBQW1CLGFBQXFCOzs7OzRCQUM5QixxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsRUFBQzs7OztLQUN4RDtJQUVELCtFQUErRTtJQUN6RSwyQ0FBVSxHQUFoQjs7Ozs7NEJBQ29CLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQTdCLFFBQVEsR0FBRyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO3dCQUN0RCxLQUFBLHFCQUFxQixDQUFBO3dCQUFDLHFCQUFNLFFBQVEsRUFBQTs0QkFBM0Msc0JBQU8sa0JBQXNCLFNBQWMsRUFBQyxFQUFDOzs7O0tBQzlDO0lBRUQsa0RBQWtEO0lBQzVDLHdDQUFPLEdBQWI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUM7Ozs7S0FDakQ7SUFFRCwrRkFBK0Y7SUFDekYsc0NBQUssR0FBWDs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFDOzs7O0tBQ3BDO0lBRUQsNkZBQTZGO0lBQ3ZGLHFDQUFJLEdBQVY7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQzs7OztLQUNuQztJQUVELHlDQUF5QztJQUNuQywwQ0FBUyxHQUFmLFVBQWdCLEtBQWE7Ozs7NEJBQ25CLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFDOzs7O0tBQzVDO0lBRUQsbUNBQW1DO0lBQzdCLHlDQUFRLEdBQWQ7OztnQkFDRSxzQkFBTyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUM7OztLQUN0QjtJQUVELHNEQUFzRDtJQUNoRCwyQ0FBVSxHQUFoQjs7O2dCQUNFLHNCQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQzs7O0tBQ3hCO0lBRUQsbURBQW1EO0lBQzdDLGdEQUFlLEdBQXJCOzs7Z0JBQ0Usc0JBQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFDOzs7S0FDdkI7SUFFRCxzREFBc0Q7SUFDaEQsK0NBQWMsR0FBcEI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFBOzRCQUEzQixzQkFBTyxDQUFDLFNBQW1CLENBQUMsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUMsRUFBQzs7OztLQUNuRTtJQUVELDZDQUE2QztJQUN2Qyx1Q0FBTSxHQUFaOzs7OzRCQUNZLHFCQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBQTs0QkFBckMsc0JBQU8sQ0FBQyxDQUFDLENBQUMsU0FBMkIsQ0FBQyxFQUFDOzs7O0tBQ3hDO0lBbEVNLG1DQUFZLEdBQUcsMkJBQTJCLENBQUM7SUFtRXBELDZCQUFDO0NBQUEsQUExRUQsQ0FBNEMsZ0JBQWdCLEdBMEUzRDtTQTFFWSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBUZXN0RWxlbWVudH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0F1dG9jb21wbGV0ZUhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2F1dG9jb21wbGV0ZS1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogU2VsZWN0b3IgZm9yIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG5jb25zdCBQQU5FTF9TRUxFQ1RPUiA9ICcubWF0LWF1dG9jb21wbGV0ZS1wYW5lbCc7XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1hdXRvY29tcGxldGUgaW4gdGVzdHMuXG4gKiBAZHluYW1pY1xuICovXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBwcml2YXRlIF9kb2N1bWVudFJvb3RMb2NhdG9yID0gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpO1xuICBwcml2YXRlIF9wYW5lbCA9IHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvcihQQU5FTF9TRUxFQ1RPUik7XG4gIHByaXZhdGUgX29wdGlvbmFsUGFuZWwgPSB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JPcHRpb25hbChQQU5FTF9TRUxFQ1RPUik7XG4gIHByaXZhdGUgX29wdGlvbnMgPSB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoYCR7UEFORUxfU0VMRUNUT1J9IC5tYXQtb3B0aW9uYCk7XG4gIHByaXZhdGUgX2dyb3VwcyA9IHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvckFsbChgJHtQQU5FTF9TRUxFQ1RPUn0gLm1hdC1vcHRncm91cGApO1xuXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1hdXRvY29tcGxldGUtdHJpZ2dlcic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGFuIGF1dG9jb21wbGV0ZSB3aXRoXG4gICAqIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoOlxuICAgKiAgIC0gYG5hbWVgIGZpbmRzIGFuIGF1dG9jb21wbGV0ZSB3aXRoIGEgc3BlY2lmaWMgbmFtZS5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBBdXRvY29tcGxldGVIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRBdXRvY29tcGxldGVIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEF1dG9jb21wbGV0ZUhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBhdXRvY29tcGxldGUgaW5wdXQgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIGF1dG9jb21wbGV0ZSdzIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgndmFsdWUnKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBpbnB1dCBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZSBhY3Rpb24gaXMgY29tcGxldGUuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIGlucHV0IGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogRW50ZXJzIHRleHQgaW50byB0aGUgYXV0b2NvbXBsZXRlLiAqL1xuICBhc3luYyBlbnRlclRleHQodmFsdWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnNlbmRLZXlzKHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIGFzeW5jIGdldFBhbmVsKCk6IFByb21pc2U8VGVzdEVsZW1lbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fcGFuZWwoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBvcHRpb25zIGluc2lkZSB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAqL1xuICBhc3luYyBnZXRPcHRpb25zKCk6IFByb21pc2U8VGVzdEVsZW1lbnRbXT4ge1xuICAgIHJldHVybiB0aGlzLl9vcHRpb25zKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZ3JvdXBzIG9mIG9wdGlvbnMgaW5zaWRlIHRoZSBwYW5lbC4gKi9cbiAgYXN5bmMgZ2V0T3B0aW9uR3JvdXBzKCk6IFByb21pc2U8VGVzdEVsZW1lbnRbXT4ge1xuICAgIHJldHVybiB0aGlzLl9ncm91cHMoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyB2aXNpYmxlLiAqL1xuICBhc3luYyBpc1BhbmVsVmlzaWJsZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3BhbmVsKCkpLmhhc0NsYXNzKCdtYXQtYXV0b2NvbXBsZXRlLXZpc2libGUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGF1dG9jb21wbGV0ZSBpcyBvcGVuLiAqL1xuICBhc3luYyBpc09wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEhKGF3YWl0IHRoaXMuX29wdGlvbmFsUGFuZWwoKSk7XG4gIH1cbn1cbiJdfQ==