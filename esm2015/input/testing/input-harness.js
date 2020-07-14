/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
/** Harness for interacting with a standard Material inputs in tests. */
export class MatInputHarness extends MatFormFieldControlHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatInputHarness` that meets
     * certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatInputHarness, options)
            .addOption('value', options.value, (harness, value) => __awaiter(this, void 0, void 0, function* () {
            return (yield harness.getValue()) === value;
        }))
            .addOption('placeholder', options.placeholder, (harness, placeholder) => __awaiter(this, void 0, void 0, function* () {
            return (yield harness.getPlaceholder()) === placeholder;
        }));
    }
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
    /** Whether the input is readonly. */
    isReadonly() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('readOnly');
        });
    }
    /** Gets the value of the input. */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            // The "value" property of the native input is never undefined.
            return (yield (yield this.host()).getProperty('value'));
        });
    }
    /** Gets the name of the input. */
    getName() {
        return __awaiter(this, void 0, void 0, function* () {
            // The "name" property of the native input is never undefined.
            return (yield (yield this.host()).getProperty('name'));
        });
    }
    /**
     * Gets the type of the input. Returns "textarea" if the input is
     * a textarea.
     */
    getType() {
        return __awaiter(this, void 0, void 0, function* () {
            // The "type" property of the native input is never undefined.
            return (yield (yield this.host()).getProperty('type'));
        });
    }
    /** Gets the placeholder of the input. */
    getPlaceholder() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            const [nativePlaceholder, fallback] = yield Promise.all([
                host.getProperty('placeholder'),
                host.getAttribute('data-placeholder')
            ]);
            return nativePlaceholder || fallback || '';
        });
    }
    /** Gets the id of the input. */
    getId() {
        return __awaiter(this, void 0, void 0, function* () {
            // The input directive always assigns a unique id to the input in
            // case no id has been explicitly specified.
            return (yield (yield this.host()).getProperty('id'));
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
            // Some input types won't respond to key presses (e.g. `color`) so to be sure that the
            // value is set, we also set the property after the keyboard sequence. Note that we don't
            // want to do it before, because it can cause the value to be entered twice.
            // @breaking-change 11.0.0 Remove non-null assertion once `setInputValue` is required.
            if (inputEl.setInputValue) {
                yield inputEl.setInputValue(newValue);
            }
        });
    }
}
// TODO: We do not want to handle `select` elements with `matNativeControl` because
// not all methods of this harness work reasonably for native select elements.
// For more details. See: https://github.com/angular/components/pull/18221.
MatInputHarness.hostSelector = '[matInput], input[matNativeControl], textarea[matNativeControl]';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pbnB1dC90ZXN0aW5nL2lucHV0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBR3hGLHdFQUF3RTtBQUN4RSxNQUFNLE9BQU8sZUFBZ0IsU0FBUSwwQkFBMEI7SUFNN0Q7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQStCLEVBQUU7UUFDM0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUM7YUFDaEQsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQU8sT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQzFELE9BQU8sQ0FBQyxNQUFNLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEtBQUssQ0FBQztRQUM5QyxDQUFDLENBQUEsQ0FBQzthQUNELFNBQVMsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFPLE9BQU8sRUFBRSxXQUFXLEVBQUUsRUFBRTtZQUM1RSxPQUFPLENBQUMsTUFBTSxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsS0FBSyxXQUFXLENBQUM7UUFDMUQsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNULENBQUM7SUFFRCxxQ0FBcUM7SUFDL0IsVUFBVTs7WUFDZCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFFLENBQUM7UUFDdEQsQ0FBQztLQUFBO0lBRUQscUNBQXFDO0lBQy9CLFVBQVU7O1lBQ2QsT0FBTyxDQUFDLE1BQU0sSUFB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RSw0QkFBWSxHQUFHLGlFQUFpRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRDb250cm9sSGFybmVzc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZC90ZXN0aW5nL2NvbnRyb2wnO1xuaW1wb3J0IHtJbnB1dEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2lucHV0LWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgTWF0ZXJpYWwgaW5wdXRzIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdElucHV0SGFybmVzcyBleHRlbmRzIE1hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzIHtcbiAgLy8gVE9ETzogV2UgZG8gbm90IHdhbnQgdG8gaGFuZGxlIGBzZWxlY3RgIGVsZW1lbnRzIHdpdGggYG1hdE5hdGl2ZUNvbnRyb2xgIGJlY2F1c2VcbiAgLy8gbm90IGFsbCBtZXRob2RzIG9mIHRoaXMgaGFybmVzcyB3b3JrIHJlYXNvbmFibHkgZm9yIG5hdGl2ZSBzZWxlY3QgZWxlbWVudHMuXG4gIC8vIEZvciBtb3JlIGRldGFpbHMuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE4MjIxLlxuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ1ttYXRJbnB1dF0sIGlucHV0W21hdE5hdGl2ZUNvbnRyb2xdLCB0ZXh0YXJlYVttYXROYXRpdmVDb250cm9sXSc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdElucHV0SGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggaW5wdXQgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogSW5wdXRIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRJbnB1dEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0SW5wdXRIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd2YWx1ZScsIG9wdGlvbnMudmFsdWUsIGFzeW5jIChoYXJuZXNzLCB2YWx1ZSkgPT4ge1xuICAgICAgICAgIHJldHVybiAoYXdhaXQgaGFybmVzcy5nZXRWYWx1ZSgpKSA9PT0gdmFsdWU7XG4gICAgICAgIH0pXG4gICAgICAgIC5hZGRPcHRpb24oJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5wbGFjZWhvbGRlciwgYXN5bmMgKGhhcm5lc3MsIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChhd2FpdCBoYXJuZXNzLmdldFBsYWNlaG9sZGVyKCkpID09PSBwbGFjZWhvbGRlcjtcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ2Rpc2FibGVkJykhO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIHJlcXVpcmVkLiAqL1xuICBhc3luYyBpc1JlcXVpcmVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5KCdyZXF1aXJlZCcpITtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyByZWFkb25seS4gKi9cbiAgYXN5bmMgaXNSZWFkb25seSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgncmVhZE9ubHknKSE7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0LiAqL1xuICBhc3luYyBnZXRWYWx1ZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIC8vIFRoZSBcInZhbHVlXCIgcHJvcGVydHkgb2YgdGhlIG5hdGl2ZSBpbnB1dCBpcyBuZXZlciB1bmRlZmluZWQuXG4gICAgcmV0dXJuIChhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5KCd2YWx1ZScpKSE7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbmFtZSBvZiB0aGUgaW5wdXQuICovXG4gIGFzeW5jIGdldE5hbWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgXCJuYW1lXCIgcHJvcGVydHkgb2YgdGhlIG5hdGl2ZSBpbnB1dCBpcyBuZXZlciB1bmRlZmluZWQuXG4gICAgcmV0dXJuIChhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5KCduYW1lJykpITtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB0eXBlIG9mIHRoZSBpbnB1dC4gUmV0dXJucyBcInRleHRhcmVhXCIgaWYgdGhlIGlucHV0IGlzXG4gICAqIGEgdGV4dGFyZWEuXG4gICAqL1xuICBhc3luYyBnZXRUeXBlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgLy8gVGhlIFwidHlwZVwiIHByb3BlcnR5IG9mIHRoZSBuYXRpdmUgaW5wdXQgaXMgbmV2ZXIgdW5kZWZpbmVkLlxuICAgIHJldHVybiAoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgndHlwZScpKSE7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcGxhY2Vob2xkZXIgb2YgdGhlIGlucHV0LiAqL1xuICBhc3luYyBnZXRQbGFjZWhvbGRlcigpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBjb25zdCBbbmF0aXZlUGxhY2Vob2xkZXIsIGZhbGxiYWNrXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIGhvc3QuZ2V0UHJvcGVydHkoJ3BsYWNlaG9sZGVyJyksXG4gICAgICBob3N0LmdldEF0dHJpYnV0ZSgnZGF0YS1wbGFjZWhvbGRlcicpXG4gICAgXSk7XG4gICAgcmV0dXJuIG5hdGl2ZVBsYWNlaG9sZGVyIHx8IGZhbGxiYWNrIHx8ICcnO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlkIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0SWQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgaW5wdXQgZGlyZWN0aXZlIGFsd2F5cyBhc3NpZ25zIGEgdW5pcXVlIGlkIHRvIHRoZSBpbnB1dCBpblxuICAgIC8vIGNhc2Ugbm8gaWQgaGFzIGJlZW4gZXhwbGljaXRseSBzcGVjaWZpZWQuXG4gICAgcmV0dXJuIChhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5KCdpZCcpKSE7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgaW5wdXQgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlXG4gICAqIGFjdGlvbiBpcyBjb21wbGV0ZS5cbiAgICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogQmx1cnMgdGhlIGlucHV0IGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZVxuICAgKiBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0LiBUaGUgdmFsdWUgd2lsbCBiZSBzZXQgYnkgc2ltdWxhdGluZ1xuICAgKiBrZXlwcmVzc2VzIHRoYXQgY29ycmVzcG9uZCB0byB0aGUgZ2l2ZW4gdmFsdWUuXG4gICAqL1xuICBhc3luYyBzZXRWYWx1ZShuZXdWYWx1ZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgaW5wdXRFbCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGF3YWl0IGlucHV0RWwuY2xlYXIoKTtcbiAgICAvLyBXZSBkb24ndCB3YW50IHRvIHNlbmQga2V5cyBmb3IgdGhlIHZhbHVlIGlmIHRoZSB2YWx1ZSBpcyBhbiBlbXB0eVxuICAgIC8vIHN0cmluZyBpbiBvcmRlciB0byBjbGVhciB0aGUgdmFsdWUuIFNlbmRpbmcga2V5cyB3aXRoIGFuIGVtcHR5IHN0cmluZ1xuICAgIC8vIHN0aWxsIHJlc3VsdHMgaW4gdW5uZWNlc3NhcnkgZm9jdXMgZXZlbnRzLlxuICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgYXdhaXQgaW5wdXRFbC5zZW5kS2V5cyhuZXdWYWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gU29tZSBpbnB1dCB0eXBlcyB3b24ndCByZXNwb25kIHRvIGtleSBwcmVzc2VzIChlLmcuIGBjb2xvcmApIHNvIHRvIGJlIHN1cmUgdGhhdCB0aGVcbiAgICAvLyB2YWx1ZSBpcyBzZXQsIHdlIGFsc28gc2V0IHRoZSBwcm9wZXJ0eSBhZnRlciB0aGUga2V5Ym9hcmQgc2VxdWVuY2UuIE5vdGUgdGhhdCB3ZSBkb24ndFxuICAgIC8vIHdhbnQgdG8gZG8gaXQgYmVmb3JlLCBiZWNhdXNlIGl0IGNhbiBjYXVzZSB0aGUgdmFsdWUgdG8gYmUgZW50ZXJlZCB0d2ljZS5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDExLjAuMCBSZW1vdmUgbm9uLW51bGwgYXNzZXJ0aW9uIG9uY2UgYHNldElucHV0VmFsdWVgIGlzIHJlcXVpcmVkLlxuICAgIGlmIChpbnB1dEVsLnNldElucHV0VmFsdWUpIHtcbiAgICAgIGF3YWl0IGlucHV0RWwuc2V0SW5wdXRWYWx1ZShuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG59XG4iXX0=