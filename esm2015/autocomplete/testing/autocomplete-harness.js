/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatOptgroupHarness, MatOptionHarness } from '@angular/material/core/testing';
/** Selector for the autocomplete panel. */
const PANEL_SELECTOR = '.mat-autocomplete-panel';
/** Harness for interacting with a standard mat-autocomplete in tests. */
export class MatAutocompleteHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._documentRootLocator = this.documentRootLocatorFactory();
        this._optionalPanel = this._documentRootLocator.locatorForOptional(PANEL_SELECTOR);
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatAutocompleteHarness` that meets
     * certain criteria.
     * @param options Options for filtering which autocomplete instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatAutocompleteHarness, options)
            .addOption('value', options.value, (harness, value) => HarnessPredicate.stringMatches(harness.getValue(), value));
    }
    /** Gets the value of the autocomplete input. */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('value');
        });
    }
    /** Whether the autocomplete input is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this.host()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Focuses the autocomplete input. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /** Blurs the autocomplete input. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Enters text into the autocomplete. */
    enterText(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).sendKeys(value);
        });
    }
    /** Gets the options inside the autocomplete panel. */
    getOptions(filters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._documentRootLocator.locatorForAll(MatOptionHarness.with(Object.assign(Object.assign({}, filters), { ancestor: PANEL_SELECTOR })))();
        });
    }
    /** Gets the option groups inside the autocomplete panel. */
    getOptionGroups(filters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._documentRootLocator.locatorForAll(MatOptgroupHarness.with(Object.assign(Object.assign({}, filters), { ancestor: PANEL_SELECTOR })))();
        });
    }
    /** Selects the first option matching the given filters. */
    selectOption(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.focus(); // Focus the input to make sure the autocomplete panel is shown.
            const options = yield this.getOptions(filters);
            if (!options.length) {
                throw Error(`Could not find a mat-option matching ${JSON.stringify(filters)}`);
            }
            yield options[0].click();
        });
    }
    /** Whether the autocomplete is open. */
    isOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            const panel = yield this._optionalPanel();
            return !!panel && (yield panel.hasClass('mat-autocomplete-visible'));
        });
    }
}
/** The selector for the host element of a `MatAutocomplete` instance. */
MatAutocompleteHarness.hostSelector = '.mat-autocomplete-trigger';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3RpbmcvYXV0b2NvbXBsZXRlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFDTCxrQkFBa0IsRUFDbEIsZ0JBQWdCLEVBR2pCLE1BQU0sZ0NBQWdDLENBQUM7QUFHeEMsMkNBQTJDO0FBQzNDLE1BQU0sY0FBYyxHQUFHLHlCQUF5QixDQUFDO0FBRWpELHlFQUF5RTtBQUN6RSxNQUFNLE9BQU8sc0JBQXVCLFNBQVEsZ0JBQWdCO0lBQTVEOztRQUNVLHlCQUFvQixHQUFHLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1FBQ3pELG1CQUFjLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBNEV4RixDQUFDO0lBdkVDOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFzQyxFQUFFO1FBQ2xELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxzQkFBc0IsRUFBRSxPQUFPLENBQUM7YUFDdkQsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUM3QixDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN6RixDQUFDO0lBRUQsZ0RBQWdEO0lBQzFDLFFBQVE7O1lBQ1osT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELENBQUM7S0FBQTtJQUVELGtEQUFrRDtJQUM1QyxVQUFVOztZQUNkLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDOUQsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLENBQUM7S0FBQTtJQUVELHNDQUFzQztJQUNoQyxLQUFLOztZQUNULE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3JDLENBQUM7S0FBQTtJQUVELG9DQUFvQztJQUM5QixJQUFJOztZQUNSLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BDLENBQUM7S0FBQTtJQUVELHlDQUF5QztJQUNuQyxTQUFTLENBQUMsS0FBYTs7WUFDM0IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdDLENBQUM7S0FBQTtJQUVELHNEQUFzRDtJQUNoRCxVQUFVLENBQUMsVUFBa0QsRUFBRTs7WUFFbkUsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLElBQUksaUNBQy9ELE9BQU8sS0FDVixRQUFRLEVBQUUsY0FBYyxJQUN4QixDQUFDLEVBQUUsQ0FBQztRQUNSLENBQUM7S0FBQTtJQUVELDREQUE0RDtJQUN0RCxlQUFlLENBQUMsVUFBb0QsRUFBRTs7WUFFMUUsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLElBQUksaUNBQ2pFLE9BQU8sS0FDVixRQUFRLEVBQUUsY0FBYyxJQUN4QixDQUFDLEVBQUUsQ0FBQztRQUNSLENBQUM7S0FBQTtJQUVELDJEQUEyRDtJQUNyRCxZQUFZLENBQUMsT0FBNkI7O1lBQzlDLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsZ0VBQWdFO1lBQ3BGLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtnQkFDbkIsTUFBTSxLQUFLLENBQUMsd0NBQXdDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ2hGO1lBQ0QsTUFBTSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDM0IsQ0FBQztLQUFBO0lBRUQsd0NBQXdDO0lBQ2xDLE1BQU07O1lBQ1YsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDMUMsT0FBTyxDQUFDLENBQUMsS0FBSyxLQUFJLE1BQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFBLENBQUM7UUFDckUsQ0FBQztLQUFBOztBQXpFRCx5RUFBeUU7QUFDbEUsbUNBQVksR0FBRywyQkFBMkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtcbiAgTWF0T3B0Z3JvdXBIYXJuZXNzLFxuICBNYXRPcHRpb25IYXJuZXNzLFxuICBPcHRncm91cEhhcm5lc3NGaWx0ZXJzLFxuICBPcHRpb25IYXJuZXNzRmlsdGVyc1xufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlL3Rlc3RpbmcnO1xuaW1wb3J0IHtBdXRvY29tcGxldGVIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9hdXRvY29tcGxldGUtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIFNlbGVjdG9yIGZvciB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAqL1xuY29uc3QgUEFORUxfU0VMRUNUT1IgPSAnLm1hdC1hdXRvY29tcGxldGUtcGFuZWwnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1hdXRvY29tcGxldGUgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBwcml2YXRlIF9kb2N1bWVudFJvb3RMb2NhdG9yID0gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpO1xuICBwcml2YXRlIF9vcHRpb25hbFBhbmVsID0gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yT3B0aW9uYWwoUEFORUxfU0VMRUNUT1IpO1xuXG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0QXV0b2NvbXBsZXRlYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWF1dG9jb21wbGV0ZS10cmlnZ2VyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0QXV0b2NvbXBsZXRlSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggYXV0b2NvbXBsZXRlIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IEF1dG9jb21wbGV0ZUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEF1dG9jb21wbGV0ZUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0QXV0b2NvbXBsZXRlSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigndmFsdWUnLCBvcHRpb25zLnZhbHVlLFxuICAgICAgICAgICAgKGhhcm5lc3MsIHZhbHVlKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRWYWx1ZSgpLCB2YWx1ZSkpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBhdXRvY29tcGxldGUgaW5wdXQuICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ3ZhbHVlJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIGlucHV0IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgYXV0b2NvbXBsZXRlIGlucHV0LiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBhdXRvY29tcGxldGUgaW5wdXQuICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIEVudGVycyB0ZXh0IGludG8gdGhlIGF1dG9jb21wbGV0ZS4gKi9cbiAgYXN5bmMgZW50ZXJUZXh0KHZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5zZW5kS2V5cyh2YWx1ZSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgb3B0aW9ucyBpbnNpZGUgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC4gKi9cbiAgYXN5bmMgZ2V0T3B0aW9ucyhmaWx0ZXJzOiBPbWl0PE9wdGlvbkhhcm5lc3NGaWx0ZXJzLCAnYW5jZXN0b3InPiA9IHt9KTpcbiAgICBQcm9taXNlPE1hdE9wdGlvbkhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoTWF0T3B0aW9uSGFybmVzcy53aXRoKHtcbiAgICAgIC4uLmZpbHRlcnMsXG4gICAgICBhbmNlc3RvcjogUEFORUxfU0VMRUNUT1JcbiAgICB9KSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBvcHRpb24gZ3JvdXBzIGluc2lkZSB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAqL1xuICBhc3luYyBnZXRPcHRpb25Hcm91cHMoZmlsdGVyczogT21pdDxPcHRncm91cEhhcm5lc3NGaWx0ZXJzLCAnYW5jZXN0b3InPiA9IHt9KTpcbiAgICBQcm9taXNlPE1hdE9wdGdyb3VwSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvckFsbChNYXRPcHRncm91cEhhcm5lc3Mud2l0aCh7XG4gICAgICAuLi5maWx0ZXJzLFxuICAgICAgYW5jZXN0b3I6IFBBTkVMX1NFTEVDVE9SXG4gICAgfSkpKCk7XG4gIH1cblxuICAvKiogU2VsZWN0cyB0aGUgZmlyc3Qgb3B0aW9uIG1hdGNoaW5nIHRoZSBnaXZlbiBmaWx0ZXJzLiAqL1xuICBhc3luYyBzZWxlY3RPcHRpb24oZmlsdGVyczogT3B0aW9uSGFybmVzc0ZpbHRlcnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmZvY3VzKCk7IC8vIEZvY3VzIHRoZSBpbnB1dCB0byBtYWtlIHN1cmUgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBzaG93bi5cbiAgICBjb25zdCBvcHRpb25zID0gYXdhaXQgdGhpcy5nZXRPcHRpb25zKGZpbHRlcnMpO1xuICAgIGlmICghb3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHRocm93IEVycm9yKGBDb3VsZCBub3QgZmluZCBhIG1hdC1vcHRpb24gbWF0Y2hpbmcgJHtKU09OLnN0cmluZ2lmeShmaWx0ZXJzKX1gKTtcbiAgICB9XG4gICAgYXdhaXQgb3B0aW9uc1swXS5jbGljaygpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGF1dG9jb21wbGV0ZSBpcyBvcGVuLiAqL1xuICBhc3luYyBpc09wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcGFuZWwgPSBhd2FpdCB0aGlzLl9vcHRpb25hbFBhbmVsKCk7XG4gICAgcmV0dXJuICEhcGFuZWwgJiYgYXdhaXQgcGFuZWwuaGFzQ2xhc3MoJ21hdC1hdXRvY29tcGxldGUtdmlzaWJsZScpO1xuICB9XG59XG4iXX0=