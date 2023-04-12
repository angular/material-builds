/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, parallel, TestKey } from '@angular/cdk/testing';
import { MatDatepickerInputHarnessBase, getInputPredicate } from './datepicker-input-harness-base';
import { DatepickerTriggerHarnessBase } from './datepicker-trigger-harness-base';
/** Harness for interacting with a standard Material date range start input in tests. */
class MatStartDateHarness extends MatDatepickerInputHarnessBase {
    static { this.hostSelector = '.mat-start-date'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStartDateHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getInputPredicate(MatStartDateHarness, options);
    }
}
export { MatStartDateHarness };
/** Harness for interacting with a standard Material date range end input in tests. */
class MatEndDateHarness extends MatDatepickerInputHarnessBase {
    static { this.hostSelector = '.mat-end-date'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatEndDateHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getInputPredicate(MatEndDateHarness, options);
    }
}
export { MatEndDateHarness };
/** Harness for interacting with a standard Material date range input in tests. */
class MatDateRangeInputHarness extends DatepickerTriggerHarnessBase {
    static { this.hostSelector = '.mat-date-range-input'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDateRangeInputHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDateRangeInputHarness, options).addOption('value', options.value, (harness, value) => HarnessPredicate.stringMatches(harness.getValue(), value));
    }
    /** Gets the combined value of the start and end inputs, including the separator. */
    async getValue() {
        const [start, end, separator] = await parallel(() => [
            this.getStartInput().then(input => input.getValue()),
            this.getEndInput().then(input => input.getValue()),
            this.getSeparator(),
        ]);
        return start + `${end ? ` ${separator} ${end}` : ''}`;
    }
    /** Gets the inner start date input inside the range input. */
    async getStartInput() {
        // Don't pass in filters here since the start input is required and there can only be one.
        return this.locatorFor(MatStartDateHarness)();
    }
    /** Gets the inner start date input inside the range input. */
    async getEndInput() {
        // Don't pass in filters here since the end input is required and there can only be one.
        return this.locatorFor(MatEndDateHarness)();
    }
    /** Gets the separator text between the values of the two inputs. */
    async getSeparator() {
        return (await this.locatorFor('.mat-date-range-input-separator')()).text();
    }
    /** Gets whether the range input is disabled. */
    async isDisabled() {
        // We consider the input as disabled if both of the sub-inputs are disabled.
        const [startDisabled, endDisabled] = await parallel(() => [
            this.getStartInput().then(input => input.isDisabled()),
            this.getEndInput().then(input => input.isDisabled()),
        ]);
        return startDisabled && endDisabled;
    }
    /** Gets whether the range input is required. */
    async isRequired() {
        return (await this.host()).hasClass('mat-date-range-input-required');
    }
    /** Opens the calendar associated with the input. */
    async isCalendarOpen() {
        // `aria-owns` is set on both inputs only if there's an
        // open range picker so we can use it as an indicator.
        const startHost = await (await this.getStartInput()).host();
        return (await startHost.getAttribute('aria-owns')) != null;
    }
    async _openCalendar() {
        // Alt + down arrow is the combination for opening the calendar with the keyboard.
        const startHost = await (await this.getStartInput()).host();
        return startHost.sendKeys({ alt: true }, TestKey.DOWN_ARROW);
    }
}
export { MatDateRangeInputHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvdGVzdGluZy9kYXRlLXJhbmdlLWlucHV0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RSxPQUFPLEVBQUMsNkJBQTZCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUNqRyxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQU0vRSx3RkFBd0Y7QUFDeEYsTUFBYSxtQkFBb0IsU0FBUSw2QkFBNkI7YUFDN0QsaUJBQVksR0FBRyxpQkFBaUIsQ0FBQztJQUV4Qzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBeUMsRUFBRTtRQUNyRCxPQUFPLGlCQUFpQixDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7O1NBWFUsbUJBQW1CO0FBY2hDLHNGQUFzRjtBQUN0RixNQUFhLGlCQUFrQixTQUFRLDZCQUE2QjthQUMzRCxpQkFBWSxHQUFHLGVBQWUsQ0FBQztJQUV0Qzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBeUMsRUFBRTtRQUNyRCxPQUFPLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELENBQUM7O1NBWFUsaUJBQWlCO0FBYzlCLGtGQUFrRjtBQUNsRixNQUFhLHdCQUF5QixTQUFRLDRCQUE0QjthQUNqRSxpQkFBWSxHQUFHLHVCQUF1QixDQUFDO0lBRTlDOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FDVCxVQUF3QyxFQUFFO1FBRTFDLE9BQU8sSUFBSSxnQkFB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LENBQUMsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzdELENBQUM7O1NBM0VVLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGUsIHBhcmFsbGVsLCBUZXN0S2V5fSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJJbnB1dEhhcm5lc3NCYXNlLCBnZXRJbnB1dFByZWRpY2F0ZX0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0LWhhcm5lc3MtYmFzZSc7XG5pbXBvcnQge0RhdGVwaWNrZXJUcmlnZ2VySGFybmVzc0Jhc2V9IGZyb20gJy4vZGF0ZXBpY2tlci10cmlnZ2VyLWhhcm5lc3MtYmFzZSc7XG5pbXBvcnQge1xuICBEYXRlcGlja2VySW5wdXRIYXJuZXNzRmlsdGVycyxcbiAgRGF0ZVJhbmdlSW5wdXRIYXJuZXNzRmlsdGVycyxcbn0gZnJvbSAnLi9kYXRlcGlja2VyLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgTWF0ZXJpYWwgZGF0ZSByYW5nZSBzdGFydCBpbnB1dCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTdGFydERhdGVIYXJuZXNzIGV4dGVuZHMgTWF0RGF0ZXBpY2tlcklucHV0SGFybmVzc0Jhc2Uge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc3RhcnQtZGF0ZSc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdFN0YXJ0RGF0ZUhhcm5lc3NgXG4gICAqIHRoYXQgbWVldHMgY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGlucHV0IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IERhdGVwaWNrZXJJbnB1dEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFN0YXJ0RGF0ZUhhcm5lc3M+IHtcbiAgICByZXR1cm4gZ2V0SW5wdXRQcmVkaWNhdGUoTWF0U3RhcnREYXRlSGFybmVzcywgb3B0aW9ucyk7XG4gIH1cbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBNYXRlcmlhbCBkYXRlIHJhbmdlIGVuZCBpbnB1dCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRFbmREYXRlSGFybmVzcyBleHRlbmRzIE1hdERhdGVwaWNrZXJJbnB1dEhhcm5lc3NCYXNlIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWVuZC1kYXRlJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0RW5kRGF0ZUhhcm5lc3NgXG4gICAqIHRoYXQgbWVldHMgY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGlucHV0IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IERhdGVwaWNrZXJJbnB1dEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEVuZERhdGVIYXJuZXNzPiB7XG4gICAgcmV0dXJuIGdldElucHV0UHJlZGljYXRlKE1hdEVuZERhdGVIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdGVyaWFsIGRhdGUgcmFuZ2UgaW5wdXQgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0RGF0ZVJhbmdlSW5wdXRIYXJuZXNzIGV4dGVuZHMgRGF0ZXBpY2tlclRyaWdnZXJIYXJuZXNzQmFzZSB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1kYXRlLXJhbmdlLWlucHV0JztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0RGF0ZVJhbmdlSW5wdXRIYXJuZXNzYFxuICAgKiB0aGF0IG1lZXRzIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBpbnB1dCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChcbiAgICBvcHRpb25zOiBEYXRlUmFuZ2VJbnB1dEhhcm5lc3NGaWx0ZXJzID0ge30sXG4gICk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0RGF0ZVJhbmdlSW5wdXRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdERhdGVSYW5nZUlucHV0SGFybmVzcywgb3B0aW9ucykuYWRkT3B0aW9uKFxuICAgICAgJ3ZhbHVlJyxcbiAgICAgIG9wdGlvbnMudmFsdWUsXG4gICAgICAoaGFybmVzcywgdmFsdWUpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFZhbHVlKCksIHZhbHVlKSxcbiAgICApO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGNvbWJpbmVkIHZhbHVlIG9mIHRoZSBzdGFydCBhbmQgZW5kIGlucHV0cywgaW5jbHVkaW5nIHRoZSBzZXBhcmF0b3IuICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgW3N0YXJ0LCBlbmQsIHNlcGFyYXRvcl0gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbXG4gICAgICB0aGlzLmdldFN0YXJ0SW5wdXQoKS50aGVuKGlucHV0ID0+IGlucHV0LmdldFZhbHVlKCkpLFxuICAgICAgdGhpcy5nZXRFbmRJbnB1dCgpLnRoZW4oaW5wdXQgPT4gaW5wdXQuZ2V0VmFsdWUoKSksXG4gICAgICB0aGlzLmdldFNlcGFyYXRvcigpLFxuICAgIF0pO1xuXG4gICAgcmV0dXJuIHN0YXJ0ICsgYCR7ZW5kID8gYCAke3NlcGFyYXRvcn0gJHtlbmR9YCA6ICcnfWA7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaW5uZXIgc3RhcnQgZGF0ZSBpbnB1dCBpbnNpZGUgdGhlIHJhbmdlIGlucHV0LiAqL1xuICBhc3luYyBnZXRTdGFydElucHV0KCk6IFByb21pc2U8TWF0U3RhcnREYXRlSGFybmVzcz4ge1xuICAgIC8vIERvbid0IHBhc3MgaW4gZmlsdGVycyBoZXJlIHNpbmNlIHRoZSBzdGFydCBpbnB1dCBpcyByZXF1aXJlZCBhbmQgdGhlcmUgY2FuIG9ubHkgYmUgb25lLlxuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3IoTWF0U3RhcnREYXRlSGFybmVzcykoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpbm5lciBzdGFydCBkYXRlIGlucHV0IGluc2lkZSB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIGFzeW5jIGdldEVuZElucHV0KCk6IFByb21pc2U8TWF0RW5kRGF0ZUhhcm5lc3M+IHtcbiAgICAvLyBEb24ndCBwYXNzIGluIGZpbHRlcnMgaGVyZSBzaW5jZSB0aGUgZW5kIGlucHV0IGlzIHJlcXVpcmVkIGFuZCB0aGVyZSBjYW4gb25seSBiZSBvbmUuXG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvcihNYXRFbmREYXRlSGFybmVzcykoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzZXBhcmF0b3IgdGV4dCBiZXR3ZWVuIHRoZSB2YWx1ZXMgb2YgdGhlIHR3byBpbnB1dHMuICovXG4gIGFzeW5jIGdldFNlcGFyYXRvcigpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5sb2NhdG9yRm9yKCcubWF0LWRhdGUtcmFuZ2UtaW5wdXQtc2VwYXJhdG9yJykoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgcmFuZ2UgaW5wdXQgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgLy8gV2UgY29uc2lkZXIgdGhlIGlucHV0IGFzIGRpc2FibGVkIGlmIGJvdGggb2YgdGhlIHN1Yi1pbnB1dHMgYXJlIGRpc2FibGVkLlxuICAgIGNvbnN0IFtzdGFydERpc2FibGVkLCBlbmREaXNhYmxlZF0gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbXG4gICAgICB0aGlzLmdldFN0YXJ0SW5wdXQoKS50aGVuKGlucHV0ID0+IGlucHV0LmlzRGlzYWJsZWQoKSksXG4gICAgICB0aGlzLmdldEVuZElucHV0KCkudGhlbihpbnB1dCA9PiBpbnB1dC5pc0Rpc2FibGVkKCkpLFxuICAgIF0pO1xuXG4gICAgcmV0dXJuIHN0YXJ0RGlzYWJsZWQgJiYgZW5kRGlzYWJsZWQ7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSByYW5nZSBpbnB1dCBpcyByZXF1aXJlZC4gKi9cbiAgYXN5bmMgaXNSZXF1aXJlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWRhdGUtcmFuZ2UtaW5wdXQtcmVxdWlyZWQnKTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgY2FsZW5kYXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgaXNDYWxlbmRhck9wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgLy8gYGFyaWEtb3duc2AgaXMgc2V0IG9uIGJvdGggaW5wdXRzIG9ubHkgaWYgdGhlcmUncyBhblxuICAgIC8vIG9wZW4gcmFuZ2UgcGlja2VyIHNvIHdlIGNhbiB1c2UgaXQgYXMgYW4gaW5kaWNhdG9yLlxuICAgIGNvbnN0IHN0YXJ0SG9zdCA9IGF3YWl0IChhd2FpdCB0aGlzLmdldFN0YXJ0SW5wdXQoKSkuaG9zdCgpO1xuICAgIHJldHVybiAoYXdhaXQgc3RhcnRIb3N0LmdldEF0dHJpYnV0ZSgnYXJpYS1vd25zJykpICE9IG51bGw7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgX29wZW5DYWxlbmRhcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvLyBBbHQgKyBkb3duIGFycm93IGlzIHRoZSBjb21iaW5hdGlvbiBmb3Igb3BlbmluZyB0aGUgY2FsZW5kYXIgd2l0aCB0aGUga2V5Ym9hcmQuXG4gICAgY29uc3Qgc3RhcnRIb3N0ID0gYXdhaXQgKGF3YWl0IHRoaXMuZ2V0U3RhcnRJbnB1dCgpKS5ob3N0KCk7XG4gICAgcmV0dXJuIHN0YXJ0SG9zdC5zZW5kS2V5cyh7YWx0OiB0cnVlfSwgVGVzdEtleS5ET1dOX0FSUk9XKTtcbiAgfVxufVxuIl19