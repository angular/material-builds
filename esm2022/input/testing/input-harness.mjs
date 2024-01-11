/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
/** Harness for interacting with a standard Material inputs in tests. */
export class MatInputHarness extends MatFormFieldControlHarness {
    // TODO: We do not want to handle `select` elements with `matNativeControl` because
    // not all methods of this harness work reasonably for native select elements.
    // For more details. See: https://github.com/angular/components/pull/18221.
    static { this.hostSelector = '[matInput], input[matNativeControl], textarea[matNativeControl]'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatInputHarness` that meets
     * certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatInputHarness, options)
            .addOption('value', options.value, (harness, value) => {
            return HarnessPredicate.stringMatches(harness.getValue(), value);
        })
            .addOption('placeholder', options.placeholder, (harness, placeholder) => {
            return HarnessPredicate.stringMatches(harness.getPlaceholder(), placeholder);
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
    /** Whether the input is readonly. */
    async isReadonly() {
        return (await this.host()).getProperty('readOnly');
    }
    /** Gets the value of the input. */
    async getValue() {
        // The "value" property of the native input is never undefined.
        return await (await this.host()).getProperty('value');
    }
    /** Gets the name of the input. */
    async getName() {
        // The "name" property of the native input is never undefined.
        return await (await this.host()).getProperty('name');
    }
    /**
     * Gets the type of the input. Returns "textarea" if the input is
     * a textarea.
     */
    async getType() {
        // The "type" property of the native input is never undefined.
        return await (await this.host()).getProperty('type');
    }
    /** Gets the placeholder of the input. */
    async getPlaceholder() {
        const host = await this.host();
        const [nativePlaceholder, fallback] = await parallel(() => [
            host.getProperty('placeholder'),
            host.getAttribute('data-placeholder'),
        ]);
        return nativePlaceholder || fallback || '';
    }
    /** Gets the id of the input. */
    async getId() {
        // The input directive always assigns a unique id to the input in
        // case no id has been explicitly specified.
        return await (await this.host()).getProperty('id');
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
        // Some input types won't respond to key presses (e.g. `color`) so to be sure that the
        // value is set, we also set the property after the keyboard sequence. Note that we don't
        // want to do it before, because it can cause the value to be entered twice.
        await inputEl.setInputValue(newValue);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pbnB1dC90ZXN0aW5nL2lucHV0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLFFBQVEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2hFLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBR3hGLHdFQUF3RTtBQUN4RSxNQUFNLE9BQU8sZUFBZ0IsU0FBUSwwQkFBMEI7SUFDN0QsbUZBQW1GO0lBQ25GLDhFQUE4RTtJQUM5RSwyRUFBMkU7YUFDcEUsaUJBQVksR0FBRyxpRUFBaUUsQ0FBQztJQUV4Rjs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBK0IsRUFBRTtRQUMzQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQzthQUNsRCxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDcEQsT0FBTyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQzthQUNELFNBQVMsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsRUFBRTtZQUN0RSxPQUFPLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDL0UsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQscUNBQXFDO0lBQ3JDLEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFB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QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGFybmVzc1ByZWRpY2F0ZSwgcGFyYWxsZWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9jb250cm9sJztcbmltcG9ydCB7SW5wdXRIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9pbnB1dC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdGVyaWFsIGlucHV0cyBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRJbnB1dEhhcm5lc3MgZXh0ZW5kcyBNYXRGb3JtRmllbGRDb250cm9sSGFybmVzcyB7XG4gIC8vIFRPRE86IFdlIGRvIG5vdCB3YW50IHRvIGhhbmRsZSBgc2VsZWN0YCBlbGVtZW50cyB3aXRoIGBtYXROYXRpdmVDb250cm9sYCBiZWNhdXNlXG4gIC8vIG5vdCBhbGwgbWV0aG9kcyBvZiB0aGlzIGhhcm5lc3Mgd29yayByZWFzb25hYmx5IGZvciBuYXRpdmUgc2VsZWN0IGVsZW1lbnRzLlxuICAvLyBGb3IgbW9yZSBkZXRhaWxzLiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xODIyMS5cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICdbbWF0SW5wdXRdLCBpbnB1dFttYXROYXRpdmVDb250cm9sXSwgdGV4dGFyZWFbbWF0TmF0aXZlQ29udHJvbF0nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRJbnB1dEhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGlucHV0IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IElucHV0SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0SW5wdXRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdElucHV0SGFybmVzcywgb3B0aW9ucylcbiAgICAgIC5hZGRPcHRpb24oJ3ZhbHVlJywgb3B0aW9ucy52YWx1ZSwgKGhhcm5lc3MsIHZhbHVlKSA9PiB7XG4gICAgICAgIHJldHVybiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRWYWx1ZSgpLCB2YWx1ZSk7XG4gICAgICB9KVxuICAgICAgLmFkZE9wdGlvbigncGxhY2Vob2xkZXInLCBvcHRpb25zLnBsYWNlaG9sZGVyLCAoaGFybmVzcywgcGxhY2Vob2xkZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFBsYWNlaG9sZGVyKCksIHBsYWNlaG9sZGVyKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5PGJvb2xlYW4+KCdkaXNhYmxlZCcpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIHJlcXVpcmVkLiAqL1xuICBhc3luYyBpc1JlcXVpcmVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5PGJvb2xlYW4+KCdyZXF1aXJlZCcpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIHJlYWRvbmx5LiAqL1xuICBhc3luYyBpc1JlYWRvbmx5KCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5PGJvb2xlYW4+KCdyZWFkT25seScpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgXCJ2YWx1ZVwiIHByb3BlcnR5IG9mIHRoZSBuYXRpdmUgaW5wdXQgaXMgbmV2ZXIgdW5kZWZpbmVkLlxuICAgIHJldHVybiBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5PHN0cmluZz4oJ3ZhbHVlJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbmFtZSBvZiB0aGUgaW5wdXQuICovXG4gIGFzeW5jIGdldE5hbWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgXCJuYW1lXCIgcHJvcGVydHkgb2YgdGhlIG5hdGl2ZSBpbnB1dCBpcyBuZXZlciB1bmRlZmluZWQuXG4gICAgcmV0dXJuIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHk8c3RyaW5nPignbmFtZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHR5cGUgb2YgdGhlIGlucHV0LiBSZXR1cm5zIFwidGV4dGFyZWFcIiBpZiB0aGUgaW5wdXQgaXNcbiAgICogYSB0ZXh0YXJlYS5cbiAgICovXG4gIGFzeW5jIGdldFR5cGUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgXCJ0eXBlXCIgcHJvcGVydHkgb2YgdGhlIG5hdGl2ZSBpbnB1dCBpcyBuZXZlciB1bmRlZmluZWQuXG4gICAgcmV0dXJuIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHk8c3RyaW5nPigndHlwZScpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBsYWNlaG9sZGVyIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0UGxhY2Vob2xkZXIoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgW25hdGl2ZVBsYWNlaG9sZGVyLCBmYWxsYmFja10gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbXG4gICAgICBob3N0LmdldFByb3BlcnR5KCdwbGFjZWhvbGRlcicpLFxuICAgICAgaG9zdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGxhY2Vob2xkZXInKSxcbiAgICBdKTtcbiAgICByZXR1cm4gbmF0aXZlUGxhY2Vob2xkZXIgfHwgZmFsbGJhY2sgfHwgJyc7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaWQgb2YgdGhlIGlucHV0LiAqL1xuICBhc3luYyBnZXRJZCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIC8vIFRoZSBpbnB1dCBkaXJlY3RpdmUgYWx3YXlzIGFzc2lnbnMgYSB1bmlxdWUgaWQgdG8gdGhlIGlucHV0IGluXG4gICAgLy8gY2FzZSBubyBpZCBoYXMgYmVlbiBleHBsaWNpdGx5IHNwZWNpZmllZC5cbiAgICByZXR1cm4gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxzdHJpbmc+KCdpZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIGlucHV0IGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZVxuICAgKiBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJsdXJzIHRoZSBpbnB1dCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGVcbiAgICogYWN0aW9uIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmlzRm9jdXNlZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dC4gVGhlIHZhbHVlIHdpbGwgYmUgc2V0IGJ5IHNpbXVsYXRpbmdcbiAgICoga2V5cHJlc3NlcyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhlIGdpdmVuIHZhbHVlLlxuICAgKi9cbiAgYXN5bmMgc2V0VmFsdWUobmV3VmFsdWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGlucHV0RWwgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBhd2FpdCBpbnB1dEVsLmNsZWFyKCk7XG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB0byBzZW5kIGtleXMgZm9yIHRoZSB2YWx1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gZW1wdHlcbiAgICAvLyBzdHJpbmcgaW4gb3JkZXIgdG8gY2xlYXIgdGhlIHZhbHVlLiBTZW5kaW5nIGtleXMgd2l0aCBhbiBlbXB0eSBzdHJpbmdcbiAgICAvLyBzdGlsbCByZXN1bHRzIGluIHVubmVjZXNzYXJ5IGZvY3VzIGV2ZW50cy5cbiAgICBpZiAobmV3VmFsdWUpIHtcbiAgICAgIGF3YWl0IGlucHV0RWwuc2VuZEtleXMobmV3VmFsdWUpO1xuICAgIH1cblxuICAgIC8vIFNvbWUgaW5wdXQgdHlwZXMgd29uJ3QgcmVzcG9uZCB0byBrZXkgcHJlc3NlcyAoZS5nLiBgY29sb3JgKSBzbyB0byBiZSBzdXJlIHRoYXQgdGhlXG4gICAgLy8gdmFsdWUgaXMgc2V0LCB3ZSBhbHNvIHNldCB0aGUgcHJvcGVydHkgYWZ0ZXIgdGhlIGtleWJvYXJkIHNlcXVlbmNlLiBOb3RlIHRoYXQgd2UgZG9uJ3RcbiAgICAvLyB3YW50IHRvIGRvIGl0IGJlZm9yZSwgYmVjYXVzZSBpdCBjYW4gY2F1c2UgdGhlIHZhbHVlIHRvIGJlIGVudGVyZWQgdHdpY2UuXG4gICAgYXdhaXQgaW5wdXRFbC5zZXRJbnB1dFZhbHVlKG5ld1ZhbHVlKTtcbiAgfVxufVxuIl19