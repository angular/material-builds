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
const PANEL_SELECTOR = '.mat-autocomplete-panel';
/**
 * Harness for interacting with a standard mat-autocomplete in tests.
 * @dynamic
 */
export class MatAutocompleteHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._documentRootLocator = this.documentRootLocatorFactory();
        this._panel = this._documentRootLocator.locatorFor(PANEL_SELECTOR);
        this._optionalPanel = this._documentRootLocator.locatorForOptional(PANEL_SELECTOR);
        this._options = this._documentRootLocator.locatorForAll(`${PANEL_SELECTOR} .mat-option`);
        this._groups = this._documentRootLocator.locatorForAll(`${PANEL_SELECTOR} .mat-optgroup`);
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for an autocomplete with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `name` finds an autocomplete with a specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatAutocompleteHarness, options);
    }
    getAttribute(attributeName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute(attributeName);
        });
    }
    /** Gets a boolean promise indicating if the autocomplete input is disabled. */
    isDisabled() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this.host()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Gets a promise for the autocomplete's text. */
    getText() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('value');
        });
    }
    /** Focuses the input and returns a void promise that indicates when the action is complete. */
    focus() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /** Blurs the input and returns a void promise that indicates when the action is complete. */
    blur() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Enters text into the autocomplete. */
    enterText(value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).sendKeys(value);
        });
    }
    /** Gets the autocomplete panel. */
    getPanel() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this._panel();
        });
    }
    /** Gets the options inside the autocomplete panel. */
    getOptions() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this._options();
        });
    }
    /** Gets the groups of options inside the panel. */
    getOptionGroups() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this._groups();
        });
    }
    /** Gets whether the autocomplete panel is visible. */
    isPanelVisible() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this._panel()).hasClass('mat-autocomplete-visible');
        });
    }
    /** Gets whether the autocomplete is open. */
    isOpen() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return !!(yield this._optionalPanel());
        });
    }
}
MatAutocompleteHarness.hostSelector = '.mat-autocomplete-trigger';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3RpbmcvYXV0b2NvbXBsZXRlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBYyxNQUFNLHNCQUFzQixDQUFDO0FBQ3JGLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRzVELDJDQUEyQztBQUMzQyxNQUFNLGNBQWMsR0FBRyx5QkFBeUIsQ0FBQztBQUVqRDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sc0JBQXVCLFNBQVEsZ0JBQWdCO0lBQTVEOztRQUNVLHlCQUFvQixHQUFHLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1FBQ3pELFdBQU0sR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlELG1CQUFjLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlFLGFBQVEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLEdBQUcsY0FBYyxjQUFjLENBQUMsQ0FBQztRQUNwRixZQUFPLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxHQUFHLGNBQWMsZ0JBQWdCLENBQUMsQ0FBQztJQXFFL0YsQ0FBQztJQWpFQzs7Ozs7O09BTUc7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXNDLEVBQUU7UUFDbEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFSyxZQUFZLENBQUMsYUFBcUI7O1lBQ3RDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN6RCxDQUFDO0tBQUE7SUFFRCwrRUFBK0U7SUFDekUsVUFBVTs7WUFDZCxNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlELE9BQU8scUJBQXFCLENBQUMsTUFBTSxRQUFRLENBQUMsQ0FBQztRQUMvQyxDQUFDO0tBQUE7SUFFRCxrREFBa0Q7SUFDNUMsT0FBTzs7WUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEQsQ0FBQztLQUFBO0lBRUQsK0ZBQStGO0lBQ3pGLEtBQUs7O1lBQ1QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDckMsQ0FBQztLQUFBO0lBRUQsNkZBQTZGO0lBQ3ZGLElBQUk7O1lBQ1IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEMsQ0FBQztLQUFBO0lBRUQseUNBQXlDO0lBQ25DLFNBQVMsQ0FBQyxLQUFhOztZQUMzQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsQ0FBQztLQUFBO0lBRUQsbUNBQW1DO0lBQzdCLFFBQVE7O1lBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdkIsQ0FBQztLQUFBO0lBRUQsc0RBQXNEO0lBQ2hELFVBQVU7O1lBQ2QsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDekIsQ0FBQztLQUFBO0lBRUQsbURBQW1EO0lBQzdDLGVBQWU7O1lBQ25CLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hCLENBQUM7S0FBQTtJQUVELHNEQUFzRDtJQUNoRCxjQUFjOztZQUNsQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUNwRSxDQUFDO0tBQUE7SUFFRCw2Q0FBNkM7SUFDdkMsTUFBTTs7WUFDVixPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDekMsQ0FBQztLQUFBOztBQWxFTSxtQ0FBWSxHQUFHLDJCQUEyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZSwgVGVzdEVsZW1lbnR9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtBdXRvY29tcGxldGVIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9hdXRvY29tcGxldGUtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIFNlbGVjdG9yIGZvciB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAqL1xuY29uc3QgUEFORUxfU0VMRUNUT1IgPSAnLm1hdC1hdXRvY29tcGxldGUtcGFuZWwnO1xuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtYXV0b2NvbXBsZXRlIGluIHRlc3RzLlxuICogQGR5bmFtaWNcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZUhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnRSb290TG9jYXRvciA9IHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKTtcbiAgcHJpdmF0ZSBfcGFuZWwgPSB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3IoUEFORUxfU0VMRUNUT1IpO1xuICBwcml2YXRlIF9vcHRpb25hbFBhbmVsID0gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yT3B0aW9uYWwoUEFORUxfU0VMRUNUT1IpO1xuICBwcml2YXRlIF9vcHRpb25zID0gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yQWxsKGAke1BBTkVMX1NFTEVDVE9SfSAubWF0LW9wdGlvbmApO1xuICBwcml2YXRlIF9ncm91cHMgPSB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoYCR7UEFORUxfU0VMRUNUT1J9IC5tYXQtb3B0Z3JvdXBgKTtcblxuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtYXV0b2NvbXBsZXRlLXRyaWdnZXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhbiBhdXRvY29tcGxldGUgd2l0aFxuICAgKiBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGBuYW1lYCBmaW5kcyBhbiBhdXRvY29tcGxldGUgd2l0aCBhIHNwZWNpZmljIG5hbWUuXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogQXV0b2NvbXBsZXRlSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0QXV0b2NvbXBsZXRlSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRBdXRvY29tcGxldGVIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgYXV0b2NvbXBsZXRlIGlucHV0IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBhdXRvY29tcGxldGUncyB0ZXh0LiAqL1xuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ3ZhbHVlJyk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgaW5wdXQgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBpbnB1dCBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZSBhY3Rpb24gaXMgY29tcGxldGUuICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIEVudGVycyB0ZXh0IGludG8gdGhlIGF1dG9jb21wbGV0ZS4gKi9cbiAgYXN5bmMgZW50ZXJUZXh0KHZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5zZW5kS2V5cyh2YWx1ZSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAqL1xuICBhc3luYyBnZXRQYW5lbCgpOiBQcm9taXNlPFRlc3RFbGVtZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgb3B0aW9ucyBpbnNpZGUgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC4gKi9cbiAgYXN5bmMgZ2V0T3B0aW9ucygpOiBQcm9taXNlPFRlc3RFbGVtZW50W10+IHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9ucygpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGdyb3VwcyBvZiBvcHRpb25zIGluc2lkZSB0aGUgcGFuZWwuICovXG4gIGFzeW5jIGdldE9wdGlvbkdyb3VwcygpOiBQcm9taXNlPFRlc3RFbGVtZW50W10+IHtcbiAgICByZXR1cm4gdGhpcy5fZ3JvdXBzKCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgdmlzaWJsZS4gKi9cbiAgYXN5bmMgaXNQYW5lbFZpc2libGUoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9wYW5lbCgpKS5oYXNDbGFzcygnbWF0LWF1dG9jb21wbGV0ZS12aXNpYmxlJyk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBhdXRvY29tcGxldGUgaXMgb3Blbi4gKi9cbiAgYXN5bmMgaXNPcGVuKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAhIShhd2FpdCB0aGlzLl9vcHRpb25hbFBhbmVsKCkpO1xuICB9XG59XG4iXX0=