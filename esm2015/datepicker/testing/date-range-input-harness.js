/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { HarnessPredicate, TestKey } from '@angular/cdk/testing';
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
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            const [start, end, separator] = yield Promise.all([
                this.getStartInput().then(input => input.getValue()),
                this.getEndInput().then(input => input.getValue()),
                this.getSeparator()
            ]);
            return start + `${end ? ` ${separator} ${end}` : ''}`;
        });
    }
    /** Gets the inner start date input inside the range input. */
    getStartInput() {
        return __awaiter(this, void 0, void 0, function* () {
            // Don't pass in filters here since the start input is required and there can only be one.
            return this.locatorFor(MatStartDateHarness)();
        });
    }
    /** Gets the inner start date input inside the range input. */
    getEndInput() {
        return __awaiter(this, void 0, void 0, function* () {
            // Don't pass in filters here since the end input is required and there can only be one.
            return this.locatorFor(MatEndDateHarness)();
        });
    }
    /** Gets the separator text between the values of the two inputs. */
    getSeparator() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.locatorFor('.mat-date-range-input-separator')()).text();
        });
    }
    /** Gets whether the range input is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            // We consider the input as disabled if both of the sub-inputs are disabled.
            const [startDisabled, endDisabled] = yield Promise.all([
                this.getStartInput().then(input => input.isDisabled()),
                this.getEndInput().then(input => input.isDisabled())
            ]);
            return startDisabled && endDisabled;
        });
    }
    /** Gets whether the range input is required. */
    isRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-date-range-input-required');
        });
    }
    /** Opens the calendar associated with the input. */
    isCalendarOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            // `aria-owns` is set on both inputs only if there's an
            // open range picker so we can use it as an indicator.
            const startHost = yield (yield this.getStartInput()).host();
            return (yield startHost.getAttribute('aria-owns')) != null;
        });
    }
    _openCalendar() {
        return __awaiter(this, void 0, void 0, function* () {
            // Alt + down arrow is the combination for opening the calendar with the keyboard.
            const startHost = yield (yield this.getStartInput()).host();
            return startHost.sendKeys({ alt: true }, TestKey.DOWN_ARROW);
        });
    }
}
MatDateRangeInputHarness.hostSelector = '.mat-date-range-input';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvdGVzdGluZy9kYXRlLXJhbmdlLWlucHV0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUMvRCxPQUFPLEVBQUMsNkJBQTZCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUNqRyxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQU0vRSx3RkFBd0Y7QUFDeEYsTUFBTSxPQUFPLG1CQUFvQixTQUFRLDZCQUE2QjtJQUdwRTs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBeUMsRUFBRTtRQUVyRCxPQUFPLGlCQUFpQixDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7O0FBWE0sZ0NBQVksR0FBRyxpQkFBaUIsQ0FBQztBQWMxQyxzRkFBc0Y7QUFDdEYsTUFBTSxPQUFPLGlCQUFrQixTQUFRLDZCQUE2QjtJQUdsRTs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBeUMsRUFBRTtRQUVyRCxPQUFPLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELENBQUM7O0FBWE0sOEJBQVksR0FBRyxlQUFlLENBQUM7QUFleEMsa0ZBQWtGO0FBQ2xGLE1BQU0sT0FBTyx3QkFBeUIsU0FBUSw0QkFBNEI7SUFHeEU7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXdDLEVBQUU7UUFFbEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQzthQUMzRCxTQUFTLENBQUMsT0FB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R0FBRyx1QkFBdUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGUsIFRlc3RLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlcklucHV0SGFybmVzc0Jhc2UsIGdldElucHV0UHJlZGljYXRlfSBmcm9tICcuL2RhdGVwaWNrZXItaW5wdXQtaGFybmVzcy1iYXNlJztcbmltcG9ydCB7RGF0ZXBpY2tlclRyaWdnZXJIYXJuZXNzQmFzZX0gZnJvbSAnLi9kYXRlcGlja2VyLXRyaWdnZXItaGFybmVzcy1iYXNlJztcbmltcG9ydCB7XG4gIERhdGVwaWNrZXJJbnB1dEhhcm5lc3NGaWx0ZXJzLFxuICBEYXRlUmFuZ2VJbnB1dEhhcm5lc3NGaWx0ZXJzLFxufSBmcm9tICcuL2RhdGVwaWNrZXItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBNYXRlcmlhbCBkYXRlIHJhbmdlIHN0YXJ0IGlucHV0IGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFN0YXJ0RGF0ZUhhcm5lc3MgZXh0ZW5kcyBNYXREYXRlcGlja2VySW5wdXRIYXJuZXNzQmFzZSB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1zdGFydC1kYXRlJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0U3RhcnREYXRlSGFybmVzc2BcbiAgICogdGhhdCBtZWV0cyBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggaW5wdXQgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogRGF0ZXBpY2tlcklucHV0SGFybmVzc0ZpbHRlcnMgPSB7fSk6XG4gICAgSGFybmVzc1ByZWRpY2F0ZTxNYXRTdGFydERhdGVIYXJuZXNzPiB7XG4gICAgcmV0dXJuIGdldElucHV0UHJlZGljYXRlKE1hdFN0YXJ0RGF0ZUhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgTWF0ZXJpYWwgZGF0ZSByYW5nZSBlbmQgaW5wdXQgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0RW5kRGF0ZUhhcm5lc3MgZXh0ZW5kcyBNYXREYXRlcGlja2VySW5wdXRIYXJuZXNzQmFzZSB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1lbmQtZGF0ZSc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdEVuZERhdGVIYXJuZXNzYFxuICAgKiB0aGF0IG1lZXRzIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBpbnB1dCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBEYXRlcGlja2VySW5wdXRIYXJuZXNzRmlsdGVycyA9IHt9KTpcbiAgICBIYXJuZXNzUHJlZGljYXRlPE1hdEVuZERhdGVIYXJuZXNzPiB7XG4gICAgcmV0dXJuIGdldElucHV0UHJlZGljYXRlKE1hdEVuZERhdGVIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxufVxuXG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgTWF0ZXJpYWwgZGF0ZSByYW5nZSBpbnB1dCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXREYXRlUmFuZ2VJbnB1dEhhcm5lc3MgZXh0ZW5kcyBEYXRlcGlja2VyVHJpZ2dlckhhcm5lc3NCYXNlIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWRhdGUtcmFuZ2UtaW5wdXQnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXREYXRlUmFuZ2VJbnB1dEhhcm5lc3NgXG4gICAqIHRoYXQgbWVldHMgY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGlucHV0IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IERhdGVSYW5nZUlucHV0SGFybmVzc0ZpbHRlcnMgPSB7fSk6XG4gICAgSGFybmVzc1ByZWRpY2F0ZTxNYXREYXRlUmFuZ2VJbnB1dEhhcm5lc3M+IHtcbiAgICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXREYXRlUmFuZ2VJbnB1dEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3ZhbHVlJywgb3B0aW9ucy52YWx1ZSxcbiAgICAgICAgICAgIChoYXJuZXNzLCB2YWx1ZSkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VmFsdWUoKSwgdmFsdWUpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjb21iaW5lZCB2YWx1ZSBvZiB0aGUgc3RhcnQgYW5kIGVuZCBpbnB1dHMsIGluY2x1ZGluZyB0aGUgc2VwYXJhdG9yLiAqL1xuICBhc3luYyBnZXRWYWx1ZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IFtzdGFydCwgZW5kLCBzZXBhcmF0b3JdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgdGhpcy5nZXRTdGFydElucHV0KCkudGhlbihpbnB1dCA9PiBpbnB1dC5nZXRWYWx1ZSgpKSxcbiAgICAgIHRoaXMuZ2V0RW5kSW5wdXQoKS50aGVuKGlucHV0ID0+IGlucHV0LmdldFZhbHVlKCkpLFxuICAgICAgdGhpcy5nZXRTZXBhcmF0b3IoKVxuICAgIF0pO1xuXG4gICAgcmV0dXJuIHN0YXJ0ICsgYCR7ZW5kID8gYCAke3NlcGFyYXRvcn0gJHtlbmR9YCA6ICcnfWA7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaW5uZXIgc3RhcnQgZGF0ZSBpbnB1dCBpbnNpZGUgdGhlIHJhbmdlIGlucHV0LiAqL1xuICBhc3luYyBnZXRTdGFydElucHV0KCk6IFByb21pc2U8TWF0U3RhcnREYXRlSGFybmVzcz4ge1xuICAgIC8vIERvbid0IHBhc3MgaW4gZmlsdGVycyBoZXJlIHNpbmNlIHRoZSBzdGFydCBpbnB1dCBpcyByZXF1aXJlZCBhbmQgdGhlcmUgY2FuIG9ubHkgYmUgb25lLlxuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3IoTWF0U3RhcnREYXRlSGFybmVzcykoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpbm5lciBzdGFydCBkYXRlIGlucHV0IGluc2lkZSB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIGFzeW5jIGdldEVuZElucHV0KCk6IFByb21pc2U8TWF0RW5kRGF0ZUhhcm5lc3M+IHtcbiAgICAvLyBEb24ndCBwYXNzIGluIGZpbHRlcnMgaGVyZSBzaW5jZSB0aGUgZW5kIGlucHV0IGlzIHJlcXVpcmVkIGFuZCB0aGVyZSBjYW4gb25seSBiZSBvbmUuXG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvcihNYXRFbmREYXRlSGFybmVzcykoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzZXBhcmF0b3IgdGV4dCBiZXR3ZWVuIHRoZSB2YWx1ZXMgb2YgdGhlIHR3byBpbnB1dHMuICovXG4gIGFzeW5jIGdldFNlcGFyYXRvcigpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5sb2NhdG9yRm9yKCcubWF0LWRhdGUtcmFuZ2UtaW5wdXQtc2VwYXJhdG9yJykoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgcmFuZ2UgaW5wdXQgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgLy8gV2UgY29uc2lkZXIgdGhlIGlucHV0IGFzIGRpc2FibGVkIGlmIGJvdGggb2YgdGhlIHN1Yi1pbnB1dHMgYXJlIGRpc2FibGVkLlxuICAgIGNvbnN0IFtzdGFydERpc2FibGVkLCBlbmREaXNhYmxlZF0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLmdldFN0YXJ0SW5wdXQoKS50aGVuKGlucHV0ID0+IGlucHV0LmlzRGlzYWJsZWQoKSksXG4gICAgICB0aGlzLmdldEVuZElucHV0KCkudGhlbihpbnB1dCA9PiBpbnB1dC5pc0Rpc2FibGVkKCkpXG4gICAgXSk7XG5cbiAgICByZXR1cm4gc3RhcnREaXNhYmxlZCAmJiBlbmREaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHJhbmdlIGlucHV0IGlzIHJlcXVpcmVkLiAqL1xuICBhc3luYyBpc1JlcXVpcmVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtZGF0ZS1yYW5nZS1pbnB1dC1yZXF1aXJlZCcpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBjYWxlbmRhciBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0LiAqL1xuICBhc3luYyBpc0NhbGVuZGFyT3BlbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAvLyBgYXJpYS1vd25zYCBpcyBzZXQgb24gYm90aCBpbnB1dHMgb25seSBpZiB0aGVyZSdzIGFuXG4gICAgLy8gb3BlbiByYW5nZSBwaWNrZXIgc28gd2UgY2FuIHVzZSBpdCBhcyBhbiBpbmRpY2F0b3IuXG4gICAgY29uc3Qgc3RhcnRIb3N0ID0gYXdhaXQgKGF3YWl0IHRoaXMuZ2V0U3RhcnRJbnB1dCgpKS5ob3N0KCk7XG4gICAgcmV0dXJuIChhd2FpdCBzdGFydEhvc3QuZ2V0QXR0cmlidXRlKCdhcmlhLW93bnMnKSkgIT0gbnVsbDtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBfb3BlbkNhbGVuZGFyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vIEFsdCArIGRvd24gYXJyb3cgaXMgdGhlIGNvbWJpbmF0aW9uIGZvciBvcGVuaW5nIHRoZSBjYWxlbmRhciB3aXRoIHRoZSBrZXlib2FyZC5cbiAgICBjb25zdCBzdGFydEhvc3QgPSBhd2FpdCAoYXdhaXQgdGhpcy5nZXRTdGFydElucHV0KCkpLmhvc3QoKTtcbiAgICByZXR1cm4gc3RhcnRIb3N0LnNlbmRLZXlzKHthbHQ6IHRydWV9LCBUZXN0S2V5LkRPV05fQVJST1cpO1xuICB9XG59XG4iXX0=