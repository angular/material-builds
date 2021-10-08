/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';
/** Harness for interacting with a standard Material chip inputs in tests. */
export class MatChipInputHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipInputHarness` that meets
     * certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatChipInputHarness, options)
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
        return (await (await this.host()).getProperty('placeholder'));
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
MatChipInputHarness.hostSelector = '.mat-chip-input';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1pbnB1dC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoaXBzL3Rlc3RpbmcvY2hpcC1pbnB1dC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBVSxNQUFNLHNCQUFzQixDQUFDO0FBR2pGLDZFQUE2RTtBQUM3RSxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsZ0JBQWdCO0lBR3ZEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFtQyxFQUFFO1FBQy9DLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUM7YUFDcEQsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDMUQsT0FBTyxDQUFDLE1BQU0sT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssS0FBSyxDQUFDO1FBQzlDLENBQUMsQ0FBQzthQUNELFNBQVMsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxFQUFFO1lBQzVFLE9BQU8sQ0FBQyxNQUFNLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxLQUFLLFdBQVcsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztJQUNULENBQUM7SUFFRCxxQ0FBcUM7SUFDckMsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFFLENBQUM7SUFDdEQsQ0FBQztJQUVELHFDQUFxQztJQUNyQyxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUUsQ0FBQztJQUN0RCxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLEtBQUssQ0FBQyxRQUFRO1FBQ1osK0RBQStEO1FBQy9ELE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUUsQ0FBQztJQUMzRCxDQUFDO0lBRUQseUNBQXlDO0lBQ3pDLEtBQUssQ0FBQyxjQUFjO1FBQ2xCLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLEtBQUs7UUFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLElBQUk7UUFDUixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQsb0NBQW9DO0lBQ3BDLEtBQUssQ0FBQyxTQUFTO1FBQ2IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBZ0I7UUFDN0IsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEMsTUFBTSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFdEIsb0VBQW9FO1FBQ3BFLHdFQUF3RTtRQUN4RSw2Q0FBNkM7UUFDN0MsSUFBSSxRQUFRLEVBQUU7WUFDWixNQUFNLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDO0lBRUQsdURBQXVEO0lBQ3ZELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFxQjtRQUMxQyxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNsQyxPQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7QUFoRk0sZ0NBQVksR0FBRyxpQkFBaUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGUsIENvbXBvbmVudEhhcm5lc3MsIFRlc3RLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7Q2hpcElucHV0SGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vY2hpcC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdGVyaWFsIGNoaXAgaW5wdXRzIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdENoaXBJbnB1dEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWNoaXAtaW5wdXQnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRDaGlwSW5wdXRIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBpbnB1dCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBDaGlwSW5wdXRIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRDaGlwSW5wdXRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdENoaXBJbnB1dEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3ZhbHVlJywgb3B0aW9ucy52YWx1ZSwgYXN5bmMgKGhhcm5lc3MsIHZhbHVlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChhd2FpdCBoYXJuZXNzLmdldFZhbHVlKCkpID09PSB2YWx1ZTtcbiAgICAgICAgfSlcbiAgICAgICAgLmFkZE9wdGlvbigncGxhY2Vob2xkZXInLCBvcHRpb25zLnBsYWNlaG9sZGVyLCBhc3luYyAoaGFybmVzcywgcGxhY2Vob2xkZXIpID0+IHtcbiAgICAgICAgICByZXR1cm4gKGF3YWl0IGhhcm5lc3MuZ2V0UGxhY2Vob2xkZXIoKSkgPT09IHBsYWNlaG9sZGVyO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnZGlzYWJsZWQnKSE7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgcmVxdWlyZWQuICovXG4gIGFzeW5jIGlzUmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ3JlcXVpcmVkJykhO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgXCJ2YWx1ZVwiIHByb3BlcnR5IG9mIHRoZSBuYXRpdmUgaW5wdXQgaXMgbmV2ZXIgdW5kZWZpbmVkLlxuICAgIHJldHVybiAoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgndmFsdWUnKSkhO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBsYWNlaG9sZGVyIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0UGxhY2Vob2xkZXIoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ3BsYWNlaG9sZGVyJykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIGlucHV0IGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZVxuICAgKiBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJsdXJzIHRoZSBpbnB1dCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGVcbiAgICogYWN0aW9uIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmlzRm9jdXNlZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dC4gVGhlIHZhbHVlIHdpbGwgYmUgc2V0IGJ5IHNpbXVsYXRpbmdcbiAgICoga2V5cHJlc3NlcyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhlIGdpdmVuIHZhbHVlLlxuICAgKi9cbiAgYXN5bmMgc2V0VmFsdWUobmV3VmFsdWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGlucHV0RWwgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBhd2FpdCBpbnB1dEVsLmNsZWFyKCk7XG5cbiAgICAvLyBXZSBkb24ndCB3YW50IHRvIHNlbmQga2V5cyBmb3IgdGhlIHZhbHVlIGlmIHRoZSB2YWx1ZSBpcyBhbiBlbXB0eVxuICAgIC8vIHN0cmluZyBpbiBvcmRlciB0byBjbGVhciB0aGUgdmFsdWUuIFNlbmRpbmcga2V5cyB3aXRoIGFuIGVtcHR5IHN0cmluZ1xuICAgIC8vIHN0aWxsIHJlc3VsdHMgaW4gdW5uZWNlc3NhcnkgZm9jdXMgZXZlbnRzLlxuICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgYXdhaXQgaW5wdXRFbC5zZW5kS2V5cyhuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNlbmRzIGEgY2hpcCBzZXBhcmF0b3Iga2V5IHRvIHRoZSBpbnB1dCBlbGVtZW50LiAqL1xuICBhc3luYyBzZW5kU2VwYXJhdG9yS2V5KGtleTogVGVzdEtleSB8IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGlucHV0RWwgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICByZXR1cm4gaW5wdXRFbC5zZW5kS2V5cyhrZXkpO1xuICB9XG59XG4iXX0=