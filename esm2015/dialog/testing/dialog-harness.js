/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { ComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
/**
 * Harness for interacting with a standard MatDialog in tests.
 * @dynamic
 */
export class MatDialogHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a dialog with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `id` finds a dialog with specific id.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDialogHarness, options);
    }
    /** Gets the id of the dialog. */
    getId() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const id = yield (yield this.host()).getAttribute('id');
            // In case no id has been specified, the "id" property always returns
            // an empty string. To make this method more explicit, we return null.
            return id !== '' ? id : null;
        });
    }
    /** Gets the role of the dialog. */
    getRole() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('role');
        });
    }
    /** Gets the value of the dialog's "aria-label" attribute. */
    getAriaLabel() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-label');
        });
    }
    /** Gets the value of the dialog's "aria-labelledby" attribute. */
    getAriaLabelledby() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-labelledby');
        });
    }
    /** Gets the value of the dialog's "aria-describedby" attribute. */
    getAriaDescribedby() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-describedby');
        });
    }
    /**
     * Closes the dialog by pressing escape. Note that this method cannot
     * be used if "disableClose" has been set to true for the dialog.
     */
    close() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield (yield this.host()).sendKeys(TestKey.ESCAPE);
        });
    }
}
// Developers can provide a custom component or template for the
// dialog. The canonical dialog parent is the "MatDialogContainer".
MatDialogHarness.hostSelector = '.mat-dialog-container';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGlhbG9nL3Rlc3RpbmcvZGlhbG9nLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUlqRjs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsZ0JBQWdCO0lBS3BEOzs7Ozs7T0FNRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBZ0MsRUFBRTtRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELGlDQUFpQztJQUMzQixLQUFLOztZQUNULE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4RCxxRUFBcUU7WUFDckUsc0VBQXNFO1lBQ3RFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDL0IsQ0FBQztLQUFBO0lBRUQsbUNBQW1DO0lBQzdCLE9BQU87O1lBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBNkIsQ0FBQztRQUM5RSxDQUFDO0tBQUE7SUFFRCw2REFBNkQ7SUFDdkQsWUFBWTs7WUFDaEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3hELENBQUM7S0FBQTtJQUVELGtFQUFrRTtJQUM1RCxpQkFBaUI7O1lBQ3JCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzdELENBQUM7S0FBQTtJQUVELG1FQUFtRTtJQUM3RCxrQkFBa0I7O1lBQ3RCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzlELENBQUM7S0FBQTtJQUVEOzs7T0FHRztJQUNHLEtBQUs7O1lBQ1QsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyRCxDQUFDO0tBQUE7O0FBakRELGdFQUFnRTtBQUNoRSxtRUFBbUU7QUFDNUQsNkJBQVksR0FBRyx1QkFBdUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGUsIFRlc3RLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7RGlhbG9nUm9sZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcbmltcG9ydCB7RGlhbG9nSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vZGlhbG9nLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdERpYWxvZyBpbiB0ZXN0cy5cbiAqIEBkeW5hbWljXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8vIERldmVsb3BlcnMgY2FuIHByb3ZpZGUgYSBjdXN0b20gY29tcG9uZW50IG9yIHRlbXBsYXRlIGZvciB0aGVcbiAgLy8gZGlhbG9nLiBUaGUgY2Fub25pY2FsIGRpYWxvZyBwYXJlbnQgaXMgdGhlIFwiTWF0RGlhbG9nQ29udGFpbmVyXCIuXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1kaWFsb2ctY29udGFpbmVyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBkaWFsb2cgd2l0aFxuICAgKiBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGBpZGAgZmluZHMgYSBkaWFsb2cgd2l0aCBzcGVjaWZpYyBpZC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBEaWFsb2dIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXREaWFsb2dIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdERpYWxvZ0hhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlkIG9mIHRoZSBkaWFsb2cuICovXG4gIGFzeW5jIGdldElkKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICBjb25zdCBpZCA9IGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgIC8vIEluIGNhc2Ugbm8gaWQgaGFzIGJlZW4gc3BlY2lmaWVkLCB0aGUgXCJpZFwiIHByb3BlcnR5IGFsd2F5cyByZXR1cm5zXG4gICAgLy8gYW4gZW1wdHkgc3RyaW5nLiBUbyBtYWtlIHRoaXMgbWV0aG9kIG1vcmUgZXhwbGljaXQsIHdlIHJldHVybiBudWxsLlxuICAgIHJldHVybiBpZCAhPT0gJycgPyBpZCA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcm9sZSBvZiB0aGUgZGlhbG9nLiAqL1xuICBhc3luYyBnZXRSb2xlKCk6IFByb21pc2U8RGlhbG9nUm9sZXxudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdyb2xlJykgYXMgUHJvbWlzZTxEaWFsb2dSb2xlfG51bGw+O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBkaWFsb2cncyBcImFyaWEtbGFiZWxcIiBhdHRyaWJ1dGUuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIGRpYWxvZydzIFwiYXJpYS1sYWJlbGxlZGJ5XCIgYXR0cmlidXRlLiAqL1xuICBhc3luYyBnZXRBcmlhTGFiZWxsZWRieSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgZGlhbG9nJ3MgXCJhcmlhLWRlc2NyaWJlZGJ5XCIgYXR0cmlidXRlLiAqL1xuICBhc3luYyBnZXRBcmlhRGVzY3JpYmVkYnkoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgZGlhbG9nIGJ5IHByZXNzaW5nIGVzY2FwZS4gTm90ZSB0aGF0IHRoaXMgbWV0aG9kIGNhbm5vdFxuICAgKiBiZSB1c2VkIGlmIFwiZGlzYWJsZUNsb3NlXCIgaGFzIGJlZW4gc2V0IHRvIHRydWUgZm9yIHRoZSBkaWFsb2cuXG4gICAqL1xuICBhc3luYyBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLnNlbmRLZXlzKFRlc3RLZXkuRVNDQVBFKTtcbiAgfVxufVxuIl19