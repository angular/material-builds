/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
/** Harness for interacting with a standard MatDialog in tests. */
var MatDialogHarness = /** @class */ (function (_super) {
    __extends(MatDialogHarness, _super);
    function MatDialogHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a dialog with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `id` finds a dialog with specific id.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatDialogHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatDialogHarness, options);
    };
    /** Gets the id of the dialog. */
    MatDialogHarness.prototype.getId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getAttribute('id')];
                    case 2:
                        id = _a.sent();
                        // In case no id has been specified, the "id" property always returns
                        // an empty string. To make this method more explicit, we return null.
                        return [2 /*return*/, id !== '' ? id : null];
                }
            });
        });
    };
    /** Gets the role of the dialog. */
    MatDialogHarness.prototype.getRole = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('role')];
                }
            });
        });
    };
    /** Gets the value of the dialog's "aria-label" attribute. */
    MatDialogHarness.prototype.getAriaLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-label')];
                }
            });
        });
    };
    /** Gets the value of the dialog's "aria-labelledby" attribute. */
    MatDialogHarness.prototype.getAriaLabelledby = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-labelledby')];
                }
            });
        });
    };
    /** Gets the value of the dialog's "aria-describedby" attribute. */
    MatDialogHarness.prototype.getAriaDescribedby = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-describedby')];
                }
            });
        });
    };
    /**
     * Closes the dialog by pressing escape. Note that this method cannot
     * be used if "disableClose" has been set to true for the dialog.
     */
    MatDialogHarness.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).sendKeys(TestKey.ESCAPE)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Developers can provide a custom component or template for the
    // dialog. The canonical dialog parent is the "MatDialogContainer".
    MatDialogHarness.hostSelector = '.mat-dialog-container';
    return MatDialogHarness;
}(ComponentHarness));
export { MatDialogHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGlhbG9nL3Rlc3RpbmcvZGlhbG9nLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUlqRixrRUFBa0U7QUFDbEU7SUFBc0Msb0NBQWdCO0lBQXREOztJQW1EQSxDQUFDO0lBOUNDOzs7Ozs7T0FNRztJQUNJLHFCQUFJLEdBQVgsVUFBWSxPQUFrQztRQUFsQyx3QkFBQSxFQUFBLFlBQWtDO1FBQzVDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsaUNBQWlDO0lBQzNCLGdDQUFLLEdBQVg7Ozs7OzRCQUNvQixxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXhCLHFCQUFNLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBQTs7d0JBQWpELEVBQUUsR0FBRyxTQUE0Qzt3QkFDdkQscUVBQXFFO3dCQUNyRSxzRUFBc0U7d0JBQ3RFLHNCQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDOzs7O0tBQzlCO0lBRUQsbUNBQW1DO0lBQzdCLGtDQUFPLEdBQWI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUE2QixFQUFDOzs7O0tBQzdFO0lBRUQsNkRBQTZEO0lBQ3ZELHVDQUFZLEdBQWxCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxFQUFDOzs7O0tBQ3ZEO0lBRUQsa0VBQWtFO0lBQzVELDRDQUFpQixHQUF2Qjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDOzs7O0tBQzVEO0lBRUQsbUVBQW1FO0lBQzdELDZDQUFrQixHQUF4Qjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFDOzs7O0tBQzdEO0lBRUQ7OztPQUdHO0lBQ0csZ0NBQUssR0FBWDs7Ozs0QkFDUyxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXhCLHFCQUFNLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUE7O3dCQUFsRCxTQUFrRCxDQUFDOzs7OztLQUNwRDtJQWpERCxnRUFBZ0U7SUFDaEUsbUVBQW1FO0lBQzVELDZCQUFZLEdBQUcsdUJBQXVCLENBQUM7SUFnRGhELHVCQUFDO0NBQUEsQUFuREQsQ0FBc0MsZ0JBQWdCLEdBbURyRDtTQW5EWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBUZXN0S2V5fSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0RpYWxvZ1JvbGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XG5pbXBvcnQge0RpYWxvZ0hhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2RpYWxvZy1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdERpYWxvZyBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8vIERldmVsb3BlcnMgY2FuIHByb3ZpZGUgYSBjdXN0b20gY29tcG9uZW50IG9yIHRlbXBsYXRlIGZvciB0aGVcbiAgLy8gZGlhbG9nLiBUaGUgY2Fub25pY2FsIGRpYWxvZyBwYXJlbnQgaXMgdGhlIFwiTWF0RGlhbG9nQ29udGFpbmVyXCIuXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1kaWFsb2ctY29udGFpbmVyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBkaWFsb2cgd2l0aFxuICAgKiBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGBpZGAgZmluZHMgYSBkaWFsb2cgd2l0aCBzcGVjaWZpYyBpZC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBEaWFsb2dIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXREaWFsb2dIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdERpYWxvZ0hhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlkIG9mIHRoZSBkaWFsb2cuICovXG4gIGFzeW5jIGdldElkKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICBjb25zdCBpZCA9IGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgIC8vIEluIGNhc2Ugbm8gaWQgaGFzIGJlZW4gc3BlY2lmaWVkLCB0aGUgXCJpZFwiIHByb3BlcnR5IGFsd2F5cyByZXR1cm5zXG4gICAgLy8gYW4gZW1wdHkgc3RyaW5nLiBUbyBtYWtlIHRoaXMgbWV0aG9kIG1vcmUgZXhwbGljaXQsIHdlIHJldHVybiBudWxsLlxuICAgIHJldHVybiBpZCAhPT0gJycgPyBpZCA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcm9sZSBvZiB0aGUgZGlhbG9nLiAqL1xuICBhc3luYyBnZXRSb2xlKCk6IFByb21pc2U8RGlhbG9nUm9sZXxudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdyb2xlJykgYXMgUHJvbWlzZTxEaWFsb2dSb2xlfG51bGw+O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBkaWFsb2cncyBcImFyaWEtbGFiZWxcIiBhdHRyaWJ1dGUuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIGRpYWxvZydzIFwiYXJpYS1sYWJlbGxlZGJ5XCIgYXR0cmlidXRlLiAqL1xuICBhc3luYyBnZXRBcmlhTGFiZWxsZWRieSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgZGlhbG9nJ3MgXCJhcmlhLWRlc2NyaWJlZGJ5XCIgYXR0cmlidXRlLiAqL1xuICBhc3luYyBnZXRBcmlhRGVzY3JpYmVkYnkoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgZGlhbG9nIGJ5IHByZXNzaW5nIGVzY2FwZS4gTm90ZSB0aGF0IHRoaXMgbWV0aG9kIGNhbm5vdFxuICAgKiBiZSB1c2VkIGlmIFwiZGlzYWJsZUNsb3NlXCIgaGFzIGJlZW4gc2V0IHRvIHRydWUgZm9yIHRoZSBkaWFsb2cuXG4gICAqL1xuICBhc3luYyBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLnNlbmRLZXlzKFRlc3RLZXkuRVNDQVBFKTtcbiAgfVxufVxuIl19