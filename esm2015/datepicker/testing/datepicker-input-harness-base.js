/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { HarnessPredicate, } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
/** Sets up the filter predicates for a datepicker input harness. */
export function getInputPredicate(type, options) {
    return new HarnessPredicate(type, options)
        .addOption('value', options.value, (harness, value) => {
        return HarnessPredicate.stringMatches(harness.getValue(), value);
    })
        .addOption('placeholder', options.placeholder, (harness, placeholder) => {
        return HarnessPredicate.stringMatches(harness.getPlaceholder(), placeholder);
    });
}
/** Base class for datepicker input harnesses. */
export class MatDatepickerInputHarnessBase extends MatFormFieldControlHarness {
    /** Whether the input is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('disabled');
        });
    }
    /** Whether the input is required. */
    isRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('required');
        });
    }
    /** Gets the value of the input. */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            // The "value" property of the native input is always defined.
            return (yield (yield this.host()).getProperty('value'));
        });
    }
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    setValue(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputEl = yield this.host();
            yield inputEl.clear();
            // We don't want to send keys for the value if the value is an empty
            // string in order to clear the value. Sending keys with an empty string
            // still results in unnecessary focus events.
            if (newValue) {
                yield inputEl.sendKeys(newValue);
            }
            yield inputEl.dispatchEvent('change');
        });
    }
    /** Gets the placeholder of the input. */
    getPlaceholder() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield (yield this.host()).getProperty('placeholder'));
        });
    }
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Whether the input is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).isFocused();
        });
    }
    /** Gets the formatted minimum date for the input's value. */
    getMin() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('min');
        });
    }
    /** Gets the formatted maximum date for the input's value. */
    getMax() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('max');
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC1oYXJuZXNzLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci90ZXN0aW5nL2RhdGVwaWNrZXItaW5wdXQtaGFybmVzcy1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBRUwsZ0JBQWdCLEdBQ2pCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sOENBQThDLENBQUM7QUFHeEYsb0VBQW9FO0FBQ3BFLE1BQU0sVUFBVSxpQkFBaUIsQ0FDL0IsSUFBb0MsRUFDcEMsT0FBc0M7SUFFdEMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7U0FDdkMsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3BELE9BQU8sZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRSxDQUFDLENBQUM7U0FDRCxTQUFTLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLEVBQUU7UUFDdEUsT0FBTyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQy9FLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVELGlEQUFpRDtBQUNqRCxNQUFNLE9BQWdCLDZCQUE4QixTQUFRLDBCQUEwQjtJQUNwRixxQ0FBcUM7SUFDL0IsVUFBVTs7WUFDZCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQVUsVUFBVSxDQUFDLENBQUM7UUFDOUQsQ0FBQztLQUFBO0lBRUQscUNBQXFDO0lBQy9CLFVBQVU7O1lBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFVLFVBQVUsQ0FBQyxDQUFDO1FBQzlELENBQUM7S0FBQTtJQUVELG1DQUFtQztJQUM3QixRQUFROztZQUNaLDhEQUE4RDtZQUM5RCxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFTLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbEUsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ0csUUFBUSxDQUFDLFFBQWdCOztZQUM3QixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsQyxNQUFNLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUV0QixvRUFBb0U7WUFDcEUsd0VBQXdFO1lBQ3hFLDZDQUE2QztZQUM3QyxJQUFJLFFBQVEsRUFBRTtnQkFDWixNQUFNLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDbEM7WUFFRCxNQUFNLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEMsQ0FBQztLQUFBO0lBRUQseUNBQXlDO0lBQ25DLGNBQWM7O1lBQ2xCLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQVMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUN4RSxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDRyxLQUFLOztZQUNULE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3JDLENBQUM7S0FBQTtJQUVEOzs7T0FHRztJQUNHLElBQUk7O1lBQ1IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEMsQ0FBQztLQUFBO0lBRUQsb0NBQW9DO0lBQzlCLFNBQVM7O1lBQ2IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDekMsQ0FBQztLQUFBO0lBRUQsNkRBQTZEO0lBQ3ZELE1BQU07O1lBQ1YsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pELENBQUM7S0FBQTtJQUVELDZEQUE2RDtJQUN2RCxNQUFNOztZQUNWLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxDQUFDO0tBQUE7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3IsXG4gIEhhcm5lc3NQcmVkaWNhdGUsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9jb250cm9sJztcbmltcG9ydCB7RGF0ZXBpY2tlcklucHV0SGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vZGF0ZXBpY2tlci1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogU2V0cyB1cCB0aGUgZmlsdGVyIHByZWRpY2F0ZXMgZm9yIGEgZGF0ZXBpY2tlciBpbnB1dCBoYXJuZXNzLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldElucHV0UHJlZGljYXRlPFQgZXh0ZW5kcyBNYXREYXRlcGlja2VySW5wdXRIYXJuZXNzQmFzZT4oXG4gIHR5cGU6IENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxUPixcbiAgb3B0aW9uczogRGF0ZXBpY2tlcklucHV0SGFybmVzc0ZpbHRlcnMpOiBIYXJuZXNzUHJlZGljYXRlPFQ+IHtcblxuICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUodHlwZSwgb3B0aW9ucylcbiAgICAuYWRkT3B0aW9uKCd2YWx1ZScsIG9wdGlvbnMudmFsdWUsIChoYXJuZXNzLCB2YWx1ZSkgPT4ge1xuICAgICAgcmV0dXJuIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFZhbHVlKCksIHZhbHVlKTtcbiAgICB9KVxuICAgIC5hZGRPcHRpb24oJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5wbGFjZWhvbGRlciwgKGhhcm5lc3MsIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICByZXR1cm4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0UGxhY2Vob2xkZXIoKSwgcGxhY2Vob2xkZXIpO1xuICAgIH0pO1xufVxuXG4vKiogQmFzZSBjbGFzcyBmb3IgZGF0ZXBpY2tlciBpbnB1dCBoYXJuZXNzZXMuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0RGF0ZXBpY2tlcklucHV0SGFybmVzc0Jhc2UgZXh0ZW5kcyBNYXRGb3JtRmllbGRDb250cm9sSGFybmVzcyB7XG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxib29sZWFuPignZGlzYWJsZWQnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyByZXF1aXJlZC4gKi9cbiAgYXN5bmMgaXNSZXF1aXJlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxib29sZWFuPigncmVxdWlyZWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQuICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgLy8gVGhlIFwidmFsdWVcIiBwcm9wZXJ0eSBvZiB0aGUgbmF0aXZlIGlucHV0IGlzIGFsd2F5cyBkZWZpbmVkLlxuICAgIHJldHVybiAoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxzdHJpbmc+KCd2YWx1ZScpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQuIFRoZSB2YWx1ZSB3aWxsIGJlIHNldCBieSBzaW11bGF0aW5nXG4gICAqIGtleXByZXNzZXMgdGhhdCBjb3JyZXNwb25kIHRvIHRoZSBnaXZlbiB2YWx1ZS5cbiAgICovXG4gIGFzeW5jIHNldFZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBpbnB1dEVsID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgYXdhaXQgaW5wdXRFbC5jbGVhcigpO1xuXG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB0byBzZW5kIGtleXMgZm9yIHRoZSB2YWx1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gZW1wdHlcbiAgICAvLyBzdHJpbmcgaW4gb3JkZXIgdG8gY2xlYXIgdGhlIHZhbHVlLiBTZW5kaW5nIGtleXMgd2l0aCBhbiBlbXB0eSBzdHJpbmdcbiAgICAvLyBzdGlsbCByZXN1bHRzIGluIHVubmVjZXNzYXJ5IGZvY3VzIGV2ZW50cy5cbiAgICBpZiAobmV3VmFsdWUpIHtcbiAgICAgIGF3YWl0IGlucHV0RWwuc2VuZEtleXMobmV3VmFsdWUpO1xuICAgIH1cblxuICAgIGF3YWl0IGlucHV0RWwuZGlzcGF0Y2hFdmVudCgnY2hhbmdlJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcGxhY2Vob2xkZXIgb2YgdGhlIGlucHV0LiAqL1xuICBhc3luYyBnZXRQbGFjZWhvbGRlcigpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxzdHJpbmc+KCdwbGFjZWhvbGRlcicpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBpbnB1dCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGVcbiAgICogYWN0aW9uIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCbHVycyB0aGUgaW5wdXQgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlXG4gICAqIGFjdGlvbiBpcyBjb21wbGV0ZS5cbiAgICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBmb3JtYXR0ZWQgbWluaW11bSBkYXRlIGZvciB0aGUgaW5wdXQncyB2YWx1ZS4gKi9cbiAgYXN5bmMgZ2V0TWluKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnbWluJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZm9ybWF0dGVkIG1heGltdW0gZGF0ZSBmb3IgdGhlIGlucHV0J3MgdmFsdWUuICovXG4gIGFzeW5jIGdldE1heCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ21heCcpO1xuICB9XG59XG4iXX0=