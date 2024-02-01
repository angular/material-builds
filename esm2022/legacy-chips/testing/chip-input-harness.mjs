/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';
/**
 * Harness for interacting with a standard Material chip inputs in tests.
 * @deprecated Use `MatChipInputHarness` from `@angular/material/chips/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacyChipInputHarness extends ComponentHarness {
    static { this.hostSelector = '.mat-chip-input'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipInputHarness` that meets
     * certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyChipInputHarness, options)
            .addOption('value', options.value, async (harness, value) => {
            return (await harness.getValue()) === value;
        })
            .addOption('placeholder', options.placeholder, async (harness, placeholder) => {
            return (await harness.getPlaceholder()) === placeholder;
        });
    }
    /** Whether the input is disabled. */
    async isDisabled() {
        return (await this.host()).getProperty('disabled');
    }
    /** Whether the input is required. */
    async isRequired() {
        return (await this.host()).getProperty('required');
    }
    /** Gets the value of the input. */
    async getValue() {
        // The "value" property of the native input is never undefined.
        return (await (await this.host()).getProperty('value'));
    }
    /** Gets the placeholder of the input. */
    async getPlaceholder() {
        return await (await this.host()).getProperty('placeholder');
    }
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    async focus() {
        return (await this.host()).focus();
    }
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the input is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    async setValue(newValue) {
        const inputEl = await this.host();
        await inputEl.clear();
        // We don't want to send keys for the value if the value is an empty
        // string in order to clear the value. Sending keys with an empty string
        // still results in unnecessary focus events.
        if (newValue) {
            await inputEl.sendKeys(newValue);
        }
    }
    /** Sends a chip separator key to the input element. */
    async sendSeparatorKey(key) {
        const inputEl = await this.host();
        return inputEl.sendKeys(key);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1pbnB1dC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1jaGlwcy90ZXN0aW5nL2NoaXAtaW5wdXQtaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQVUsTUFBTSxzQkFBc0IsQ0FBQztBQUdqRjs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLHlCQUEwQixTQUFRLGdCQUFnQjthQUN0RCxpQkFBWSxHQUFHLGlCQUFpQixDQUFDO0lBRXhDOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FDVCxVQUF5QyxFQUFFO1FBRTNDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyx5QkFBeUIsRUFBRSxPQUFPLENBQUM7YUFDNUQsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDMUQsT0FBTyxDQUFDLE1BQU0sT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssS0FBSyxDQUFDO1FBQzlDLENBQUMsQ0FBQzthQUNELFNBQVMsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxFQUFFO1lBQzVFLE9BQU8sQ0FBQyxNQUFNLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxLQUFLLFdBQVcsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxxQ0FBcUM7SUFDckMsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFFLENBQUM7SUFDdEQsQ0FBQztJQUVELHFDQUFxQztJQUNyQyxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUUsQ0FBQztJQUN0RCxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLEtBQUssQ0FBQyxRQUFRO1FBQ1osK0RBQStEO1FBQy9ELE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUUsQ0FBQztJQUMzRCxDQUFDO0lBRUQseUNBQXlDO0lBQ3pDLEtBQUssQ0FBQyxjQUFjO1FBQ2xCLE9BQU8sTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsS0FBSztRQUNULE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsSUFBSTtRQUNSLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRCxvQ0FBb0M7SUFDcEMsS0FBSyxDQUFDLFNBQVM7UUFDYixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFnQjtRQUM3QixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNsQyxNQUFNLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUV0QixvRUFBb0U7UUFDcEUsd0VBQXdFO1FBQ3hFLDZDQUE2QztRQUM3QyxJQUFJLFFBQVEsRUFBRTtZQUNaLE1BQU0sT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7SUFFRCx1REFBdUQ7SUFDdkQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQXFCO1FBQzFDLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2xDLE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGFybmVzc1ByZWRpY2F0ZSwgQ29tcG9uZW50SGFybmVzcywgVGVzdEtleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtMZWdhY3lDaGlwSW5wdXRIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9jaGlwLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdGVyaWFsIGNoaXAgaW5wdXRzIGluIHRlc3RzLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRDaGlwSW5wdXRIYXJuZXNzYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9jaGlwcy90ZXN0aW5nYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lDaGlwSW5wdXRIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1jaGlwLWlucHV0JztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0Q2hpcElucHV0SGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggaW5wdXQgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgoXG4gICAgb3B0aW9uczogTGVnYWN5Q2hpcElucHV0SGFybmVzc0ZpbHRlcnMgPSB7fSxcbiAgKTogSGFybmVzc1ByZWRpY2F0ZTxNYXRMZWdhY3lDaGlwSW5wdXRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdExlZ2FjeUNoaXBJbnB1dEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAuYWRkT3B0aW9uKCd2YWx1ZScsIG9wdGlvbnMudmFsdWUsIGFzeW5jIChoYXJuZXNzLCB2YWx1ZSkgPT4ge1xuICAgICAgICByZXR1cm4gKGF3YWl0IGhhcm5lc3MuZ2V0VmFsdWUoKSkgPT09IHZhbHVlO1xuICAgICAgfSlcbiAgICAgIC5hZGRPcHRpb24oJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5wbGFjZWhvbGRlciwgYXN5bmMgKGhhcm5lc3MsIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgIHJldHVybiAoYXdhaXQgaGFybmVzcy5nZXRQbGFjZWhvbGRlcigpKSA9PT0gcGxhY2Vob2xkZXI7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnZGlzYWJsZWQnKSE7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgcmVxdWlyZWQuICovXG4gIGFzeW5jIGlzUmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ3JlcXVpcmVkJykhO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgXCJ2YWx1ZVwiIHByb3BlcnR5IG9mIHRoZSBuYXRpdmUgaW5wdXQgaXMgbmV2ZXIgdW5kZWZpbmVkLlxuICAgIHJldHVybiAoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgndmFsdWUnKSkhO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBsYWNlaG9sZGVyIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0UGxhY2Vob2xkZXIoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgncGxhY2Vob2xkZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBpbnB1dCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGVcbiAgICogYWN0aW9uIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCbHVycyB0aGUgaW5wdXQgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlXG4gICAqIGFjdGlvbiBpcyBjb21wbGV0ZS5cbiAgICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQuIFRoZSB2YWx1ZSB3aWxsIGJlIHNldCBieSBzaW11bGF0aW5nXG4gICAqIGtleXByZXNzZXMgdGhhdCBjb3JyZXNwb25kIHRvIHRoZSBnaXZlbiB2YWx1ZS5cbiAgICovXG4gIGFzeW5jIHNldFZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBpbnB1dEVsID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgYXdhaXQgaW5wdXRFbC5jbGVhcigpO1xuXG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB0byBzZW5kIGtleXMgZm9yIHRoZSB2YWx1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gZW1wdHlcbiAgICAvLyBzdHJpbmcgaW4gb3JkZXIgdG8gY2xlYXIgdGhlIHZhbHVlLiBTZW5kaW5nIGtleXMgd2l0aCBhbiBlbXB0eSBzdHJpbmdcbiAgICAvLyBzdGlsbCByZXN1bHRzIGluIHVubmVjZXNzYXJ5IGZvY3VzIGV2ZW50cy5cbiAgICBpZiAobmV3VmFsdWUpIHtcbiAgICAgIGF3YWl0IGlucHV0RWwuc2VuZEtleXMobmV3VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZW5kcyBhIGNoaXAgc2VwYXJhdG9yIGtleSB0byB0aGUgaW5wdXQgZWxlbWVudC4gKi9cbiAgYXN5bmMgc2VuZFNlcGFyYXRvcktleShrZXk6IFRlc3RLZXkgfCBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBpbnB1dEVsID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgcmV0dXJuIGlucHV0RWwuc2VuZEtleXMoa2V5KTtcbiAgfVxufVxuIl19