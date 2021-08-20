/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ContentContainerComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
// @breaking-change 14.0.0 change generic type to MatDialogSection.
/** Harness for interacting with a standard `MatDialog` in tests. */
export class MatDialogHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._title = this.locatorForOptional(".mat-dialog-title" /* TITLE */);
        this._content = this.locatorForOptional(".mat-dialog-content" /* CONTENT */);
        this._actions = this.locatorForOptional(".mat-dialog-actions" /* ACTIONS */);
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDialogHarness` that meets
     * certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDialogHarness, options);
    }
    /** Gets the id of the dialog. */
    getId() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield (yield this.host()).getAttribute('id');
            // In case no id has been specified, the "id" property always returns
            // an empty string. To make this method more explicit, we return null.
            return id !== '' ? id : null;
        });
    }
    /** Gets the role of the dialog. */
    getRole() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('role');
        });
    }
    /** Gets the value of the dialog's "aria-label" attribute. */
    getAriaLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-label');
        });
    }
    /** Gets the value of the dialog's "aria-labelledby" attribute. */
    getAriaLabelledby() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-labelledby');
        });
    }
    /** Gets the value of the dialog's "aria-describedby" attribute. */
    getAriaDescribedby() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-describedby');
        });
    }
    /**
     * Closes the dialog by pressing escape.
     *
     * Note: this method does nothing if `disableClose` has been set to `true` for the dialog.
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this.host()).sendKeys(TestKey.ESCAPE);
        });
    }
    /** Gets te dialog's text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
    /** Gets the dialog's title text. This only works if the dialog is using mat-dialog-title. */
    getTitleText() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return (_b = (_a = (yield this._title())) === null || _a === void 0 ? void 0 : _a.text()) !== null && _b !== void 0 ? _b : '';
        });
    }
    /** Gets the dialog's content text. This only works if the dialog is using mat-dialog-content. */
    getContentText() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return (_b = (_a = (yield this._content())) === null || _a === void 0 ? void 0 : _a.text()) !== null && _b !== void 0 ? _b : '';
        });
    }
    /** Gets the dialog's actions text. This only works if the dialog is using mat-dialog-actions. */
    getActionsText() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return (_b = (_a = (yield this._actions())) === null || _a === void 0 ? void 0 : _a.text()) !== null && _b !== void 0 ? _b : '';
        });
    }
}
// Developers can provide a custom component or template for the
// dialog. The canonical dialog parent is the "MatDialogContainer".
/** The selector for the host element of a `MatDialog` instance. */
MatDialogHarness.hostSelector = '.mat-dialog-container';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGlhbG9nL3Rlc3RpbmcvZGlhbG9nLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQ0FBZ0MsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQVdqRyxtRUFBbUU7QUFDbkUsb0VBQW9FO0FBQ3BFLE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxnQ0FBMkQ7SUFBakc7O1FBTVksV0FBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsaUNBQXdCLENBQUM7UUFDekQsYUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IscUNBQTBCLENBQUM7UUFDN0QsYUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IscUNBQTBCLENBQUM7SUFxRXpFLENBQUM7SUFsRUM7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWdDLEVBQUU7UUFDNUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxpQ0FBaUM7SUFDM0IsS0FBSzs7WUFDVCxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEQscUVBQXFFO1lBQ3JFLHNFQUFzRTtZQUN0RSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQy9CLENBQUM7S0FBQTtJQUVELG1DQUFtQztJQUM3QixPQUFPOztZQUNYLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQTZCLENBQUM7UUFDOUUsQ0FBQztLQUFBO0lBRUQsNkRBQTZEO0lBQ3ZELFlBQVk7O1lBQ2hCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN4RCxDQUFDO0tBQUE7SUFFRCxrRUFBa0U7SUFDNUQsaUJBQWlCOztZQUNyQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM3RCxDQUFDO0tBQUE7SUFFRCxtRUFBbUU7SUFDN0Qsa0JBQWtCOztZQUN0QixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM5RCxDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ0csS0FBSzs7WUFDVCxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELENBQUM7S0FBQTtJQUVELDZCQUE2QjtJQUN2QixPQUFPOztZQUNYLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BDLENBQUM7S0FBQTtJQUVELDZGQUE2RjtJQUN2RixZQUFZOzs7WUFDaEIsT0FBTyxNQUFBLE1BQUEsQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQywwQ0FBRSxJQUFJLEVBQUUsbUNBQUksRUFBRSxDQUFDOztLQUM1QztJQUVELGlHQUFpRztJQUMzRixjQUFjOzs7WUFDbEIsT0FBTyxNQUFBLE1BQUEsQ0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQywwQ0FBRSxJQUFJLEVBQUUsbUNBQUksRUFBRSxDQUFDOztLQUM5QztJQUVELGlHQUFpRztJQUMzRixjQUFjOzs7WUFDbEIsT0FBTyxNQUFBLE1BQUEsQ0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQywwQ0FBRSxJQUFJLEVBQUUsbUNBQUksRUFBRSxDQUFDOztLQUM5Qzs7QUEzRUQsZ0VBQWdFO0FBQ2hFLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDNUQsNkJBQVksR0FBRyx1QkFBdUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBUZXN0S2V5fSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0RpYWxvZ1JvbGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XG5pbXBvcnQge0RpYWxvZ0hhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2RpYWxvZy1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogU2VsZWN0b3JzIGZvciBkaWZmZXJlbnQgc2VjdGlvbnMgb2YgdGhlIG1hdC1kaWFsb2cgdGhhdCBjYW4gY29udGFpbiB1c2VyIGNvbnRlbnQuICovXG5leHBvcnQgY29uc3QgZW51bSBNYXREaWFsb2dTZWN0aW9uIHtcbiAgVElUTEUgPSAnLm1hdC1kaWFsb2ctdGl0bGUnLFxuICBDT05URU5UID0gJy5tYXQtZGlhbG9nLWNvbnRlbnQnLFxuICBBQ1RJT05TID0gJy5tYXQtZGlhbG9nLWFjdGlvbnMnXG59XG5cbi8vIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIGNoYW5nZSBnZW5lcmljIHR5cGUgdG8gTWF0RGlhbG9nU2VjdGlvbi5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgYE1hdERpYWxvZ2AgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nSGFybmVzcyBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPE1hdERpYWxvZ1NlY3Rpb24gfCBzdHJpbmc+IHtcbiAgLy8gRGV2ZWxvcGVycyBjYW4gcHJvdmlkZSBhIGN1c3RvbSBjb21wb25lbnQgb3IgdGVtcGxhdGUgZm9yIHRoZVxuICAvLyBkaWFsb2cuIFRoZSBjYW5vbmljYWwgZGlhbG9nIHBhcmVudCBpcyB0aGUgXCJNYXREaWFsb2dDb250YWluZXJcIi5cbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXREaWFsb2dgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtZGlhbG9nLWNvbnRhaW5lcic7XG5cbiAgcHJvdGVjdGVkIF90aXRsZSA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKE1hdERpYWxvZ1NlY3Rpb24uVElUTEUpO1xuICBwcm90ZWN0ZWQgX2NvbnRlbnQgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChNYXREaWFsb2dTZWN0aW9uLkNPTlRFTlQpO1xuICBwcm90ZWN0ZWQgX2FjdGlvbnMgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChNYXREaWFsb2dTZWN0aW9uLkFDVElPTlMpO1xuXG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdERpYWxvZ0hhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGRpYWxvZyBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBEaWFsb2dIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXREaWFsb2dIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdERpYWxvZ0hhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlkIG9mIHRoZSBkaWFsb2cuICovXG4gIGFzeW5jIGdldElkKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICBjb25zdCBpZCA9IGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgIC8vIEluIGNhc2Ugbm8gaWQgaGFzIGJlZW4gc3BlY2lmaWVkLCB0aGUgXCJpZFwiIHByb3BlcnR5IGFsd2F5cyByZXR1cm5zXG4gICAgLy8gYW4gZW1wdHkgc3RyaW5nLiBUbyBtYWtlIHRoaXMgbWV0aG9kIG1vcmUgZXhwbGljaXQsIHdlIHJldHVybiBudWxsLlxuICAgIHJldHVybiBpZCAhPT0gJycgPyBpZCA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcm9sZSBvZiB0aGUgZGlhbG9nLiAqL1xuICBhc3luYyBnZXRSb2xlKCk6IFByb21pc2U8RGlhbG9nUm9sZXxudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdyb2xlJykgYXMgUHJvbWlzZTxEaWFsb2dSb2xlfG51bGw+O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBkaWFsb2cncyBcImFyaWEtbGFiZWxcIiBhdHRyaWJ1dGUuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIGRpYWxvZydzIFwiYXJpYS1sYWJlbGxlZGJ5XCIgYXR0cmlidXRlLiAqL1xuICBhc3luYyBnZXRBcmlhTGFiZWxsZWRieSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgZGlhbG9nJ3MgXCJhcmlhLWRlc2NyaWJlZGJ5XCIgYXR0cmlidXRlLiAqL1xuICBhc3luYyBnZXRBcmlhRGVzY3JpYmVkYnkoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgZGlhbG9nIGJ5IHByZXNzaW5nIGVzY2FwZS5cbiAgICpcbiAgICogTm90ZTogdGhpcyBtZXRob2QgZG9lcyBub3RoaW5nIGlmIGBkaXNhYmxlQ2xvc2VgIGhhcyBiZWVuIHNldCB0byBgdHJ1ZWAgZm9yIHRoZSBkaWFsb2cuXG4gICAqL1xuICBhc3luYyBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLnNlbmRLZXlzKFRlc3RLZXkuRVNDQVBFKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRlIGRpYWxvZydzIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKSB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGRpYWxvZydzIHRpdGxlIHRleHQuIFRoaXMgb25seSB3b3JrcyBpZiB0aGUgZGlhbG9nIGlzIHVzaW5nIG1hdC1kaWFsb2ctdGl0bGUuICovXG4gIGFzeW5jIGdldFRpdGxlVGV4dCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3RpdGxlKCkpPy50ZXh0KCkgPz8gJyc7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGlhbG9nJ3MgY29udGVudCB0ZXh0LiBUaGlzIG9ubHkgd29ya3MgaWYgdGhlIGRpYWxvZyBpcyB1c2luZyBtYXQtZGlhbG9nLWNvbnRlbnQuICovXG4gIGFzeW5jIGdldENvbnRlbnRUZXh0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fY29udGVudCgpKT8udGV4dCgpID8/ICcnO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGRpYWxvZydzIGFjdGlvbnMgdGV4dC4gVGhpcyBvbmx5IHdvcmtzIGlmIHRoZSBkaWFsb2cgaXMgdXNpbmcgbWF0LWRpYWxvZy1hY3Rpb25zLiAqL1xuICBhc3luYyBnZXRBY3Rpb25zVGV4dCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2FjdGlvbnMoKSk/LnRleHQoKSA/PyAnJztcbiAgfVxufVxuIl19