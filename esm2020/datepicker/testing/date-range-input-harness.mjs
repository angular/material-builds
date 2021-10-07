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
export class MatStartDateHarness extends MatDatepickerInputHarnessBase {
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
MatStartDateHarness.hostSelector = '.mat-start-date';
/** Harness for interacting with a standard Material date range end input in tests. */
export class MatEndDateHarness extends MatDatepickerInputHarnessBase {
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
MatEndDateHarness.hostSelector = '.mat-end-date';
/** Harness for interacting with a standard Material date range input in tests. */
export class MatDateRangeInputHarness extends DatepickerTriggerHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDateRangeInputHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDateRangeInputHarness, options)
            .addOption('value', options.value, (harness, value) => HarnessPredicate.stringMatches(harness.getValue(), value));
    }
    /** Gets the combined value of the start and end inputs, including the separator. */
    async getValue() {
        const [start, end, separator] = await parallel(() => [
            this.getStartInput().then(input => input.getValue()),
            this.getEndInput().then(input => input.getValue()),
            this.getSeparator()
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
            this.getEndInput().then(input => input.isDisabled())
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
MatDateRangeInputHarness.hostSelector = '.mat-date-range-input';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvdGVzdGluZy9kYXRlLXJhbmdlLWlucHV0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RSxPQUFPLEVBQUMsNkJBQTZCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUNqRyxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQU0vRSx3RkFBd0Y7QUFDeEYsTUFBTSxPQUFPLG1CQUFvQixTQUFRLDZCQUE2QjtJQUdwRTs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBeUMsRUFBRTtRQUVyRCxPQUFPLGlCQUFpQixDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7O0FBWE0sZ0NBQVksR0FBRyxpQkFBaUIsQ0FBQztBQWMxQyxzRkFBc0Y7QUFDdEYsTUFBTSxPQUFPLGlCQUFrQixTQUFRLDZCQUE2QjtJQUdsRTs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBeUMsRUFBRTtRQUVyRCxPQUFPLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELENBQUM7O0FBWE0sOEJBQVksR0FBRyxlQUFlLENBQUM7QUFleEMsa0ZBQWtGO0FBQ2xGLE1BQU0sT0FBTyx3QkFBeUIsU0FBUSw0QkFBNEI7SUFHeEU7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXdDLEVBQUU7UUFFbEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQzthQUMzRCxTQUFT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TyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzdELENBQUM7O0FBdkVNLHFDQUFZLEdBQUcsdUJBQXVCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIYXJuZXNzUHJlZGljYXRlLCBwYXJhbGxlbCwgVGVzdEtleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW5wdXRIYXJuZXNzQmFzZSwgZ2V0SW5wdXRQcmVkaWNhdGV9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1oYXJuZXNzLWJhc2UnO1xuaW1wb3J0IHtEYXRlcGlja2VyVHJpZ2dlckhhcm5lc3NCYXNlfSBmcm9tICcuL2RhdGVwaWNrZXItdHJpZ2dlci1oYXJuZXNzLWJhc2UnO1xuaW1wb3J0IHtcbiAgRGF0ZXBpY2tlcklucHV0SGFybmVzc0ZpbHRlcnMsXG4gIERhdGVSYW5nZUlucHV0SGFybmVzc0ZpbHRlcnMsXG59IGZyb20gJy4vZGF0ZXBpY2tlci1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdGVyaWFsIGRhdGUgcmFuZ2Ugc3RhcnQgaW5wdXQgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0U3RhcnREYXRlSGFybmVzcyBleHRlbmRzIE1hdERhdGVwaWNrZXJJbnB1dEhhcm5lc3NCYXNlIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXN0YXJ0LWRhdGUnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRTdGFydERhdGVIYXJuZXNzYFxuICAgKiB0aGF0IG1lZXRzIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBpbnB1dCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBEYXRlcGlja2VySW5wdXRIYXJuZXNzRmlsdGVycyA9IHt9KTpcbiAgICBIYXJuZXNzUHJlZGljYXRlPE1hdFN0YXJ0RGF0ZUhhcm5lc3M+IHtcbiAgICByZXR1cm4gZ2V0SW5wdXRQcmVkaWNhdGUoTWF0U3RhcnREYXRlSGFybmVzcywgb3B0aW9ucyk7XG4gIH1cbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBNYXRlcmlhbCBkYXRlIHJhbmdlIGVuZCBpbnB1dCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRFbmREYXRlSGFybmVzcyBleHRlbmRzIE1hdERhdGVwaWNrZXJJbnB1dEhhcm5lc3NCYXNlIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWVuZC1kYXRlJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0RW5kRGF0ZUhhcm5lc3NgXG4gICAqIHRoYXQgbWVldHMgY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGlucHV0IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IERhdGVwaWNrZXJJbnB1dEhhcm5lc3NGaWx0ZXJzID0ge30pOlxuICAgIEhhcm5lc3NQcmVkaWNhdGU8TWF0RW5kRGF0ZUhhcm5lc3M+IHtcbiAgICByZXR1cm4gZ2V0SW5wdXRQcmVkaWNhdGUoTWF0RW5kRGF0ZUhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG59XG5cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBNYXRlcmlhbCBkYXRlIHJhbmdlIGlucHV0IGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdERhdGVSYW5nZUlucHV0SGFybmVzcyBleHRlbmRzIERhdGVwaWNrZXJUcmlnZ2VySGFybmVzc0Jhc2Uge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtZGF0ZS1yYW5nZS1pbnB1dCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdERhdGVSYW5nZUlucHV0SGFybmVzc2BcbiAgICogdGhhdCBtZWV0cyBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggaW5wdXQgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogRGF0ZVJhbmdlSW5wdXRIYXJuZXNzRmlsdGVycyA9IHt9KTpcbiAgICBIYXJuZXNzUHJlZGljYXRlPE1hdERhdGVSYW5nZUlucHV0SGFybmVzcz4ge1xuICAgICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdERhdGVSYW5nZUlucHV0SGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigndmFsdWUnLCBvcHRpb25zLnZhbHVlLFxuICAgICAgICAgICAgKGhhcm5lc3MsIHZhbHVlKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRWYWx1ZSgpLCB2YWx1ZSkpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGNvbWJpbmVkIHZhbHVlIG9mIHRoZSBzdGFydCBhbmQgZW5kIGlucHV0cywgaW5jbHVkaW5nIHRoZSBzZXBhcmF0b3IuICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgW3N0YXJ0LCBlbmQsIHNlcGFyYXRvcl0gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbXG4gICAgICB0aGlzLmdldFN0YXJ0SW5wdXQoKS50aGVuKGlucHV0ID0+IGlucHV0LmdldFZhbHVlKCkpLFxuICAgICAgdGhpcy5nZXRFbmRJbnB1dCgpLnRoZW4oaW5wdXQgPT4gaW5wdXQuZ2V0VmFsdWUoKSksXG4gICAgICB0aGlzLmdldFNlcGFyYXRvcigpXG4gICAgXSk7XG5cbiAgICByZXR1cm4gc3RhcnQgKyBgJHtlbmQgPyBgICR7c2VwYXJhdG9yfSAke2VuZH1gIDogJyd9YDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpbm5lciBzdGFydCBkYXRlIGlucHV0IGluc2lkZSB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIGFzeW5jIGdldFN0YXJ0SW5wdXQoKTogUHJvbWlzZTxNYXRTdGFydERhdGVIYXJuZXNzPiB7XG4gICAgLy8gRG9uJ3QgcGFzcyBpbiBmaWx0ZXJzIGhlcmUgc2luY2UgdGhlIHN0YXJ0IGlucHV0IGlzIHJlcXVpcmVkIGFuZCB0aGVyZSBjYW4gb25seSBiZSBvbmUuXG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvcihNYXRTdGFydERhdGVIYXJuZXNzKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlubmVyIHN0YXJ0IGRhdGUgaW5wdXQgaW5zaWRlIHRoZSByYW5nZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0RW5kSW5wdXQoKTogUHJvbWlzZTxNYXRFbmREYXRlSGFybmVzcz4ge1xuICAgIC8vIERvbid0IHBhc3MgaW4gZmlsdGVycyBoZXJlIHNpbmNlIHRoZSBlbmQgaW5wdXQgaXMgcmVxdWlyZWQgYW5kIHRoZXJlIGNhbiBvbmx5IGJlIG9uZS5cbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yKE1hdEVuZERhdGVIYXJuZXNzKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHNlcGFyYXRvciB0ZXh0IGJldHdlZW4gdGhlIHZhbHVlcyBvZiB0aGUgdHdvIGlucHV0cy4gKi9cbiAgYXN5bmMgZ2V0U2VwYXJhdG9yKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtZGF0ZS1yYW5nZS1pbnB1dC1zZXBhcmF0b3InKSgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSByYW5nZSBpbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAvLyBXZSBjb25zaWRlciB0aGUgaW5wdXQgYXMgZGlzYWJsZWQgaWYgYm90aCBvZiB0aGUgc3ViLWlucHV0cyBhcmUgZGlzYWJsZWQuXG4gICAgY29uc3QgW3N0YXJ0RGlzYWJsZWQsIGVuZERpc2FibGVkXSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFtcbiAgICAgIHRoaXMuZ2V0U3RhcnRJbnB1dCgpLnRoZW4oaW5wdXQgPT4gaW5wdXQuaXNEaXNhYmxlZCgpKSxcbiAgICAgIHRoaXMuZ2V0RW5kSW5wdXQoKS50aGVuKGlucHV0ID0+IGlucHV0LmlzRGlzYWJsZWQoKSlcbiAgICBdKTtcblxuICAgIHJldHVybiBzdGFydERpc2FibGVkICYmIGVuZERpc2FibGVkO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgcmFuZ2UgaW5wdXQgaXMgcmVxdWlyZWQuICovXG4gIGFzeW5jIGlzUmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1kYXRlLXJhbmdlLWlucHV0LXJlcXVpcmVkJyk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIGNhbGVuZGFyIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQuICovXG4gIGFzeW5jIGlzQ2FsZW5kYXJPcGVuKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIC8vIGBhcmlhLW93bnNgIGlzIHNldCBvbiBib3RoIGlucHV0cyBvbmx5IGlmIHRoZXJlJ3MgYW5cbiAgICAvLyBvcGVuIHJhbmdlIHBpY2tlciBzbyB3ZSBjYW4gdXNlIGl0IGFzIGFuIGluZGljYXRvci5cbiAgICBjb25zdCBzdGFydEhvc3QgPSBhd2FpdCAoYXdhaXQgdGhpcy5nZXRTdGFydElucHV0KCkpLmhvc3QoKTtcbiAgICByZXR1cm4gKGF3YWl0IHN0YXJ0SG9zdC5nZXRBdHRyaWJ1dGUoJ2FyaWEtb3ducycpKSAhPSBudWxsO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIF9vcGVuQ2FsZW5kYXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gQWx0ICsgZG93biBhcnJvdyBpcyB0aGUgY29tYmluYXRpb24gZm9yIG9wZW5pbmcgdGhlIGNhbGVuZGFyIHdpdGggdGhlIGtleWJvYXJkLlxuICAgIGNvbnN0IHN0YXJ0SG9zdCA9IGF3YWl0IChhd2FpdCB0aGlzLmdldFN0YXJ0SW5wdXQoKSkuaG9zdCgpO1xuICAgIHJldHVybiBzdGFydEhvc3Quc2VuZEtleXMoe2FsdDogdHJ1ZX0sIFRlc3RLZXkuRE9XTl9BUlJPVyk7XG4gIH1cbn1cbiJdfQ==