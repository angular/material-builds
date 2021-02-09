/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { HarnessPredicate, ComponentHarness, } from '@angular/cdk/testing';
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
export class MatDatepickerInputHarnessBase extends ComponentHarness {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC1oYXJuZXNzLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci90ZXN0aW5nL2RhdGVwaWNrZXItaW5wdXQtaGFybmVzcy1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBRUwsZ0JBQWdCLEVBQ2hCLGdCQUFnQixHQUNqQixNQUFNLHNCQUFzQixDQUFDO0FBRzlCLG9FQUFvRTtBQUNwRSxNQUFNLFVBQVUsaUJBQWlCLENBQy9CLElBQW9DLEVBQ3BDLE9BQXNDO0lBRXRDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO1NBQ3ZDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNwRCxPQUFPLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkUsQ0FBQyxDQUFDO1NBQ0QsU0FBUyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxFQUFFO1FBQ3RFLE9BQU8sZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMvRSxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRCxpREFBaUQ7QUFDakQsTUFBTSxPQUFnQiw2QkFBOEIsU0FBUSxnQkFBZ0I7SUFDMUUscUNBQXFDO0lBQy9CLFVBQVU7O1lBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBRSxDQUFDO1FBQ3RELENBQUM7S0FBQTtJQUVELHFDQUFxQztJQUMvQixVQUFVOztZQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUUsQ0FBQztRQUN0RCxDQUFDO0tBQUE7SUFFRCxtQ0FBbUM7SUFDN0IsUUFBUTs7WUFDWiw4REFBOEQ7WUFDOUQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBRSxDQUFDO1FBQzNELENBQUM7S0FBQTtJQUVEOzs7T0FHRztJQUNHLFFBQVEsQ0FBQyxRQUFnQjs7WUFDN0IsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEMsTUFBTSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFdEIsb0VBQW9FO1lBQ3BFLHdFQUF3RTtZQUN4RSw2Q0FBNkM7WUFDN0MsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osTUFBTSxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ2xDO1lBRUQsTUFBTSxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7S0FBQTtJQUVELHlDQUF5QztJQUNuQyxjQUFjOztZQUNsQixPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDaEUsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ0csS0FBSzs7WUFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQyxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDRyxJQUFJOztZQUNSLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BDLENBQUM7S0FBQTtJQUVELG9DQUFvQztJQUM5QixTQUFTOztZQUNiLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3pDLENBQUM7S0FBQTtJQUVELDZEQUE2RDtJQUN2RCxNQUFNOztZQUNWLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxDQUFDO0tBQUE7SUFFRCw2REFBNkQ7SUFDdkQsTUFBTTs7WUFDVixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakQsQ0FBQztLQUFBO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBIYXJuZXNzUHJlZGljYXRlLFxuICBDb21wb25lbnRIYXJuZXNzLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0RhdGVwaWNrZXJJbnB1dEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2RhdGVwaWNrZXItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIFNldHMgdXAgdGhlIGZpbHRlciBwcmVkaWNhdGVzIGZvciBhIGRhdGVwaWNrZXIgaW5wdXQgaGFybmVzcy4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbnB1dFByZWRpY2F0ZTxUIGV4dGVuZHMgTWF0RGF0ZXBpY2tlcklucHV0SGFybmVzc0Jhc2U+KFxuICB0eXBlOiBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8VD4sXG4gIG9wdGlvbnM6IERhdGVwaWNrZXJJbnB1dEhhcm5lc3NGaWx0ZXJzKTogSGFybmVzc1ByZWRpY2F0ZTxUPiB7XG5cbiAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKHR5cGUsIG9wdGlvbnMpXG4gICAgLmFkZE9wdGlvbigndmFsdWUnLCBvcHRpb25zLnZhbHVlLCAoaGFybmVzcywgdmFsdWUpID0+IHtcbiAgICAgIHJldHVybiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRWYWx1ZSgpLCB2YWx1ZSk7XG4gICAgfSlcbiAgICAuYWRkT3B0aW9uKCdwbGFjZWhvbGRlcicsIG9wdGlvbnMucGxhY2Vob2xkZXIsIChoYXJuZXNzLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgcmV0dXJuIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFBsYWNlaG9sZGVyKCksIHBsYWNlaG9sZGVyKTtcbiAgICB9KTtcbn1cblxuLyoqIEJhc2UgY2xhc3MgZm9yIGRhdGVwaWNrZXIgaW5wdXQgaGFybmVzc2VzLiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdERhdGVwaWNrZXJJbnB1dEhhcm5lc3NCYXNlIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnZGlzYWJsZWQnKSE7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgcmVxdWlyZWQuICovXG4gIGFzeW5jIGlzUmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ3JlcXVpcmVkJykhO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgXCJ2YWx1ZVwiIHByb3BlcnR5IG9mIHRoZSBuYXRpdmUgaW5wdXQgaXMgYWx3YXlzIGRlZmluZWQuXG4gICAgcmV0dXJuIChhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5KCd2YWx1ZScpKSE7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0LiBUaGUgdmFsdWUgd2lsbCBiZSBzZXQgYnkgc2ltdWxhdGluZ1xuICAgKiBrZXlwcmVzc2VzIHRoYXQgY29ycmVzcG9uZCB0byB0aGUgZ2l2ZW4gdmFsdWUuXG4gICAqL1xuICBhc3luYyBzZXRWYWx1ZShuZXdWYWx1ZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgaW5wdXRFbCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGF3YWl0IGlucHV0RWwuY2xlYXIoKTtcblxuICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gc2VuZCBrZXlzIGZvciB0aGUgdmFsdWUgaWYgdGhlIHZhbHVlIGlzIGFuIGVtcHR5XG4gICAgLy8gc3RyaW5nIGluIG9yZGVyIHRvIGNsZWFyIHRoZSB2YWx1ZS4gU2VuZGluZyBrZXlzIHdpdGggYW4gZW1wdHkgc3RyaW5nXG4gICAgLy8gc3RpbGwgcmVzdWx0cyBpbiB1bm5lY2Vzc2FyeSBmb2N1cyBldmVudHMuXG4gICAgaWYgKG5ld1ZhbHVlKSB7XG4gICAgICBhd2FpdCBpbnB1dEVsLnNlbmRLZXlzKG5ld1ZhbHVlKTtcbiAgICB9XG5cbiAgICBhd2FpdCBpbnB1dEVsLmRpc3BhdGNoRXZlbnQoJ2NoYW5nZScpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBsYWNlaG9sZGVyIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0UGxhY2Vob2xkZXIoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ3BsYWNlaG9sZGVyJykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIGlucHV0IGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZVxuICAgKiBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJsdXJzIHRoZSBpbnB1dCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGVcbiAgICogYWN0aW9uIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmlzRm9jdXNlZCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGZvcm1hdHRlZCBtaW5pbXVtIGRhdGUgZm9yIHRoZSBpbnB1dCdzIHZhbHVlLiAqL1xuICBhc3luYyBnZXRNaW4oKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdtaW4nKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBmb3JtYXR0ZWQgbWF4aW11bSBkYXRlIGZvciB0aGUgaW5wdXQncyB2YWx1ZS4gKi9cbiAgYXN5bmMgZ2V0TWF4KCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnbWF4Jyk7XG4gIH1cbn1cbiJdfQ==