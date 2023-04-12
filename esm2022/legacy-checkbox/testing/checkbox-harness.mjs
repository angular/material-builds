/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { _MatCheckboxHarnessBase } from '@angular/material/checkbox/testing';
/**
 * Harness for interacting with a standard mat-checkbox in tests.
 * @deprecated Use `MatCheckboxHarness` from `@angular/material/checkbox/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCheckboxHarness extends _MatCheckboxHarnessBase {
    constructor() {
        super(...arguments);
        this._input = this.locatorFor('input');
        this._label = this.locatorFor('.mat-checkbox-label');
        this._inputContainer = this.locatorFor('.mat-checkbox-inner-container');
    }
    /** The selector for the host element of a checkbox instance. */
    static { this.hostSelector = '.mat-checkbox'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a checkbox harness that meets
     * certain criteria.
     * @param options Options for filtering which checkbox instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return (new HarnessPredicate(MatLegacyCheckboxHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label))
            // We want to provide a filter option for "name" because the name of the checkbox is
            // only set on the underlying input. This means that it's not possible for developers
            // to retrieve the harness of a specific checkbox with name through a CSS selector.
            .addOption('name', options.name, async (harness, name) => (await harness.getName()) === name)
            .addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) == checked)
            .addOption('disabled', options.disabled, async (harness, disabled) => {
            return (await harness.isDisabled()) === disabled;
        }));
    }
    async toggle() {
        return (await this._inputContainer()).click();
    }
}
export { MatLegacyCheckboxHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktY2hlY2tib3gvdGVzdGluZy9jaGVja2JveC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQyx1QkFBdUIsRUFBeUIsTUFBTSxvQ0FBb0MsQ0FBQztBQUVuRzs7OztHQUlHO0FBQ0gsTUFBYSx3QkFBeUIsU0FBUSx1QkFBdUI7SUFBckU7O1FBbUNZLFdBQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLFdBQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDbEQsb0JBQWUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLCtCQUErQixDQUFDLENBQUM7SUFLN0UsQ0FBQztJQXpDQyxnRUFBZ0U7YUFDekQsaUJBQVksR0FBRyxlQUFlLEFBQWxCLENBQW1CO0lBRXRDOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFrQyxFQUFFO1FBQzlDLE9BQU8sQ0FDTCxJQUFJLGdCQUFnQixDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQzthQUNwRCxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FDcEQsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FDOUQ7WUFDRCxvRkFBb0Y7WUFDcEYscUZBQXFGO1lBQ3JGLG1GQUFtRjthQUNsRixTQUFTLENBQ1IsTUFBTSxFQUNOLE9BQU8sQ0FBQyxJQUFJLEVBQ1osS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxJQUFJLENBQzVEO2FBQ0EsU0FBUyxDQUNSLFNBQVMsRUFDVCxPQUFPLENBQUMsT0FBTyxFQUNmLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksT0FBTyxDQUNuRTthQUNBLFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQ25FLE9BQU8sQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FDTCxDQUFDO0lBQ0osQ0FBQztJQU1ELEtBQUssQ0FBQyxNQUFNO1FBQ1YsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDaEQsQ0FBQzs7U0F6Q1Usd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtfTWF0Q2hlY2tib3hIYXJuZXNzQmFzZSwgQ2hlY2tib3hIYXJuZXNzRmlsdGVyc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY2hlY2tib3gvdGVzdGluZyc7XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1jaGVja2JveCBpbiB0ZXN0cy5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0Q2hlY2tib3hIYXJuZXNzYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9jaGVja2JveC90ZXN0aW5nYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lDaGVja2JveEhhcm5lc3MgZXh0ZW5kcyBfTWF0Q2hlY2tib3hIYXJuZXNzQmFzZSB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBjaGVja2JveCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWNoZWNrYm94JztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBjaGVja2JveCBoYXJuZXNzIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGNoZWNrYm94IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IENoZWNrYm94SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TGVnYWN5Q2hlY2tib3hIYXJuZXNzPiB7XG4gICAgcmV0dXJuIChcbiAgICAgIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdExlZ2FjeUNoZWNrYm94SGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbignbGFiZWwnLCBvcHRpb25zLmxhYmVsLCAoaGFybmVzcywgbGFiZWwpID0+XG4gICAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWxUZXh0KCksIGxhYmVsKSxcbiAgICAgICAgKVxuICAgICAgICAvLyBXZSB3YW50IHRvIHByb3ZpZGUgYSBmaWx0ZXIgb3B0aW9uIGZvciBcIm5hbWVcIiBiZWNhdXNlIHRoZSBuYW1lIG9mIHRoZSBjaGVja2JveCBpc1xuICAgICAgICAvLyBvbmx5IHNldCBvbiB0aGUgdW5kZXJseWluZyBpbnB1dC4gVGhpcyBtZWFucyB0aGF0IGl0J3Mgbm90IHBvc3NpYmxlIGZvciBkZXZlbG9wZXJzXG4gICAgICAgIC8vIHRvIHJldHJpZXZlIHRoZSBoYXJuZXNzIG9mIGEgc3BlY2lmaWMgY2hlY2tib3ggd2l0aCBuYW1lIHRocm91Z2ggYSBDU1Mgc2VsZWN0b3IuXG4gICAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICAgJ25hbWUnLFxuICAgICAgICAgIG9wdGlvbnMubmFtZSxcbiAgICAgICAgICBhc3luYyAoaGFybmVzcywgbmFtZSkgPT4gKGF3YWl0IGhhcm5lc3MuZ2V0TmFtZSgpKSA9PT0gbmFtZSxcbiAgICAgICAgKVxuICAgICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAgICdjaGVja2VkJyxcbiAgICAgICAgICBvcHRpb25zLmNoZWNrZWQsXG4gICAgICAgICAgYXN5bmMgKGhhcm5lc3MsIGNoZWNrZWQpID0+IChhd2FpdCBoYXJuZXNzLmlzQ2hlY2tlZCgpKSA9PSBjaGVja2VkLFxuICAgICAgICApXG4gICAgICAgIC5hZGRPcHRpb24oJ2Rpc2FibGVkJywgb3B0aW9ucy5kaXNhYmxlZCwgYXN5bmMgKGhhcm5lc3MsIGRpc2FibGVkKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChhd2FpdCBoYXJuZXNzLmlzRGlzYWJsZWQoKSkgPT09IGRpc2FibGVkO1xuICAgICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2lucHV0ID0gdGhpcy5sb2NhdG9yRm9yKCdpbnB1dCcpO1xuICBwcm90ZWN0ZWQgX2xhYmVsID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LWNoZWNrYm94LWxhYmVsJyk7XG4gIHByaXZhdGUgX2lucHV0Q29udGFpbmVyID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LWNoZWNrYm94LWlubmVyLWNvbnRhaW5lcicpO1xuXG4gIGFzeW5jIHRvZ2dsZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0Q29udGFpbmVyKCkpLmNsaWNrKCk7XG4gIH1cbn1cbiJdfQ==