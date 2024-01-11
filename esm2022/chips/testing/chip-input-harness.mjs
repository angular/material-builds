/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
/** Harness for interacting with a grid's chip input in tests. */
export class MatChipInputHarness extends ComponentHarness {
    static { this.hostSelector = '.mat-mdc-chip-input'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a chip input with specific
     * attributes.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options)
            .addOption('value', options.value, async (harness, value) => {
            return (await harness.getValue()) === value;
        })
            .addOption('placeholder', options.placeholder, async (harness, placeholder) => {
            return (await harness.getPlaceholder()) === placeholder;
        })
            .addOption('disabled', options.disabled, async (harness, disabled) => {
            return (await harness.isDisabled()) === disabled;
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
        return await (await this.host()).getProperty('value');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1pbnB1dC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoaXBzL3Rlc3RpbmcvY2hpcC1pbnB1dC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxnQkFBZ0IsRUFFaEIsZ0JBQWdCLEdBRWpCLE1BQU0sc0JBQXNCLENBQUM7QUFHOUIsaUVBQWlFO0FBQ2pFLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxnQkFBZ0I7YUFDaEQsaUJBQVksR0FBRyxxQkFBcUIsQ0FBQztJQUU1Qzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBRVQsVUFBbUMsRUFBRTtRQUVyQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQzthQUN2QyxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUMxRCxPQUFPLENBQUMsTUFBTSxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxLQUFLLENBQUM7UUFDOUMsQ0FBQyxDQUFDO2FBQ0QsU0FBUyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLEVBQUU7WUFDNUUsT0FBTyxDQUFDLE1BQU0sT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLEtBQUssV0FBVyxDQUFDO1FBQzFELENBQUMsQ0FBQzthQUNELFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQ25FLE9BQU8sQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxxQ0FBcUM7SUFDckMsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQVUsVUFBVSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELHFDQUFxQztJQUNyQyxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBVSxVQUFVLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLEtBQUssQ0FBQyxRQUFRO1FBQ1osK0RBQStEO1FBQy9ELE9BQU8sTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFTLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCx5Q0FBeUM7SUFDekMsS0FBSyxDQUFDLGNBQWM7UUFDbEIsT0FBTyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQVMsYUFBYSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxLQUFLO1FBQ1QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxJQUFJO1FBQ1IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVELG9DQUFvQztJQUNwQyxLQUFLLENBQUMsU0FBUztRQUNiLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQWdCO1FBQzdCLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2xDLE1BQU0sT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXRCLG9FQUFvRTtRQUNwRSx3RUFBd0U7UUFDeEUsNkNBQTZDO1FBQzdDLElBQUksUUFBUSxFQUFFO1lBQ1osTUFBTSxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztJQUVELHVEQUF1RDtJQUN2RCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBcUI7UUFDMUMsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEMsT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBIYXJuZXNzUHJlZGljYXRlLFxuICBUZXN0S2V5LFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0NoaXBJbnB1dEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2NoaXAtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBncmlkJ3MgY2hpcCBpbnB1dCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRDaGlwSW5wdXRIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZGMtY2hpcC1pbnB1dCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgY2hpcCBpbnB1dCB3aXRoIHNwZWNpZmljXG4gICAqIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBpbnB1dCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aDxUIGV4dGVuZHMgTWF0Q2hpcElucHV0SGFybmVzcz4oXG4gICAgdGhpczogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFQ+LFxuICAgIG9wdGlvbnM6IENoaXBJbnB1dEhhcm5lc3NGaWx0ZXJzID0ge30sXG4gICk6IEhhcm5lc3NQcmVkaWNhdGU8VD4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZSh0aGlzLCBvcHRpb25zKVxuICAgICAgLmFkZE9wdGlvbigndmFsdWUnLCBvcHRpb25zLnZhbHVlLCBhc3luYyAoaGFybmVzcywgdmFsdWUpID0+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCBoYXJuZXNzLmdldFZhbHVlKCkpID09PSB2YWx1ZTtcbiAgICAgIH0pXG4gICAgICAuYWRkT3B0aW9uKCdwbGFjZWhvbGRlcicsIG9wdGlvbnMucGxhY2Vob2xkZXIsIGFzeW5jIChoYXJuZXNzLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICByZXR1cm4gKGF3YWl0IGhhcm5lc3MuZ2V0UGxhY2Vob2xkZXIoKSkgPT09IHBsYWNlaG9sZGVyO1xuICAgICAgfSlcbiAgICAgIC5hZGRPcHRpb24oJ2Rpc2FibGVkJywgb3B0aW9ucy5kaXNhYmxlZCwgYXN5bmMgKGhhcm5lc3MsIGRpc2FibGVkKSA9PiB7XG4gICAgICAgIHJldHVybiAoYXdhaXQgaGFybmVzcy5pc0Rpc2FibGVkKCkpID09PSBkaXNhYmxlZDtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5PGJvb2xlYW4+KCdkaXNhYmxlZCcpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIHJlcXVpcmVkLiAqL1xuICBhc3luYyBpc1JlcXVpcmVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5PGJvb2xlYW4+KCdyZXF1aXJlZCcpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgXCJ2YWx1ZVwiIHByb3BlcnR5IG9mIHRoZSBuYXRpdmUgaW5wdXQgaXMgbmV2ZXIgdW5kZWZpbmVkLlxuICAgIHJldHVybiBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5PHN0cmluZz4oJ3ZhbHVlJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcGxhY2Vob2xkZXIgb2YgdGhlIGlucHV0LiAqL1xuICBhc3luYyBnZXRQbGFjZWhvbGRlcigpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5PHN0cmluZz4oJ3BsYWNlaG9sZGVyJyk7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgaW5wdXQgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlXG4gICAqIGFjdGlvbiBpcyBjb21wbGV0ZS5cbiAgICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogQmx1cnMgdGhlIGlucHV0IGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZVxuICAgKiBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0LiBUaGUgdmFsdWUgd2lsbCBiZSBzZXQgYnkgc2ltdWxhdGluZ1xuICAgKiBrZXlwcmVzc2VzIHRoYXQgY29ycmVzcG9uZCB0byB0aGUgZ2l2ZW4gdmFsdWUuXG4gICAqL1xuICBhc3luYyBzZXRWYWx1ZShuZXdWYWx1ZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgaW5wdXRFbCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGF3YWl0IGlucHV0RWwuY2xlYXIoKTtcblxuICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gc2VuZCBrZXlzIGZvciB0aGUgdmFsdWUgaWYgdGhlIHZhbHVlIGlzIGFuIGVtcHR5XG4gICAgLy8gc3RyaW5nIGluIG9yZGVyIHRvIGNsZWFyIHRoZSB2YWx1ZS4gU2VuZGluZyBrZXlzIHdpdGggYW4gZW1wdHkgc3RyaW5nXG4gICAgLy8gc3RpbGwgcmVzdWx0cyBpbiB1bm5lY2Vzc2FyeSBmb2N1cyBldmVudHMuXG4gICAgaWYgKG5ld1ZhbHVlKSB7XG4gICAgICBhd2FpdCBpbnB1dEVsLnNlbmRLZXlzKG5ld1ZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogU2VuZHMgYSBjaGlwIHNlcGFyYXRvciBrZXkgdG8gdGhlIGlucHV0IGVsZW1lbnQuICovXG4gIGFzeW5jIHNlbmRTZXBhcmF0b3JLZXkoa2V5OiBUZXN0S2V5IHwgc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgaW5wdXRFbCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIHJldHVybiBpbnB1dEVsLnNlbmRLZXlzKGtleSk7XG4gIH1cbn1cbiJdfQ==