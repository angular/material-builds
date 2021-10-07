/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, parallel, } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
import { MatOptionHarness, MatOptgroupHarness, } from '@angular/material/core/testing';
export class _MatSelectHarnessBase extends MatFormFieldControlHarness {
    constructor() {
        super(...arguments);
        this._documentRootLocator = this.documentRootLocatorFactory();
        this._backdrop = this._documentRootLocator.locatorFor('.cdk-overlay-backdrop');
    }
    /** Gets a boolean promise indicating if the select is disabled. */
    async isDisabled() {
        return (await this.host()).hasClass(`${this._prefix}-select-disabled`);
    }
    /** Gets a boolean promise indicating if the select is valid. */
    async isValid() {
        return !(await (await this.host()).hasClass('ng-invalid'));
    }
    /** Gets a boolean promise indicating if the select is required. */
    async isRequired() {
        return (await this.host()).hasClass(`${this._prefix}-select-required`);
    }
    /** Gets a boolean promise indicating if the select is empty (no value is selected). */
    async isEmpty() {
        return (await this.host()).hasClass(`${this._prefix}-select-empty`);
    }
    /** Gets a boolean promise indicating if the select is in multi-selection mode. */
    async isMultiple() {
        return (await this.host()).hasClass(`${this._prefix}-select-multiple`);
    }
    /** Gets a promise for the select's value text. */
    async getValueText() {
        const value = await this.locatorFor(`.${this._prefix}-select-value`)();
        return value.text();
    }
    /** Focuses the select and returns a void promise that indicates when the action is complete. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the select and returns a void promise that indicates when the action is complete. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the select is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Gets the options inside the select panel. */
    async getOptions(filter) {
        return this._documentRootLocator.locatorForAll(this._optionClass.with({
            ...(filter || {}),
            ancestor: await this._getPanelSelector()
        }))();
    }
    /** Gets the groups of options inside the panel. */
    async getOptionGroups(filter) {
        return this._documentRootLocator.locatorForAll(this._optionGroupClass.with({
            ...(filter || {}),
            ancestor: await this._getPanelSelector()
        }))();
    }
    /** Gets whether the select is open. */
    async isOpen() {
        return !!await this._documentRootLocator.locatorForOptional(await this._getPanelSelector())();
    }
    /** Opens the select's panel. */
    async open() {
        if (!await this.isOpen()) {
            const trigger = await this.locatorFor(`.${this._prefix}-select-trigger`)();
            return trigger.click();
        }
    }
    /**
     * Clicks the options that match the passed-in filter. If the select is in multi-selection
     * mode all options will be clicked, otherwise the harness will pick the first matching option.
     */
    async clickOptions(filter) {
        await this.open();
        const [isMultiple, options] = await parallel(() => [this.isMultiple(), this.getOptions(filter)]);
        if (options.length === 0) {
            throw Error('Select does not have options matching the specified filter');
        }
        if (isMultiple) {
            await parallel(() => options.map(option => option.click()));
        }
        else {
            await options[0].click();
        }
    }
    /** Closes the select's panel. */
    async close() {
        if (await this.isOpen()) {
            // This is the most consistent way that works both in both single and multi-select modes,
            // but it assumes that only one overlay is open at a time. We should be able to make it
            // a bit more precise after #16645 where we can dispatch an ESCAPE press to the host instead.
            return (await this._backdrop()).click();
        }
    }
    /** Gets the selector that should be used to find this select's panel. */
    async _getPanelSelector() {
        const id = await (await this.host()).getAttribute('id');
        return `#${id}-panel`;
    }
}
/** Harness for interacting with a standard mat-select in tests. */
export class MatSelectHarness extends _MatSelectHarnessBase {
    constructor() {
        super(...arguments);
        this._prefix = 'mat';
        this._optionClass = MatOptionHarness;
        this._optionGroupClass = MatOptgroupHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSelectHarness` that meets
     * certain criteria.
     * @param options Options for filtering which select instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSelectHarness, options);
    }
}
MatSelectHarness.hostSelector = '.mat-select';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3Rlc3Rpbmcvc2VsZWN0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixRQUFRLEdBSVQsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUN4RixPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGtCQUFrQixHQUduQixNQUFNLGdDQUFnQyxDQUFDO0FBR3hDLE1BQU0sT0FBZ0IscUJBU3BCLFNBQVEsMEJBQTBCO0lBVHBDOztRQWFVLHlCQUFvQixHQUFHLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1FBQ3pELGNBQVMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFpSHBGLENBQUM7SUEvR0MsbUVBQW1FO0lBQ25FLEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sa0JBQWtCLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsZ0VBQWdFO0lBQ2hFLEtBQUssQ0FBQyxPQUFPO1FBQ1gsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELG1FQUFtRTtJQUNuRSxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLGtCQUFrQixD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Z0MsRUFBRTtRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekQsQ0FBQzs7QUFiTSw2QkFBWSxHQUFHLGFBQWEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBIYXJuZXNzUHJlZGljYXRlLFxuICBwYXJhbGxlbCxcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQmFzZUhhcm5lc3NGaWx0ZXJzLFxuICBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3IsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9jb250cm9sJztcbmltcG9ydCB7XG4gIE1hdE9wdGlvbkhhcm5lc3MsXG4gIE1hdE9wdGdyb3VwSGFybmVzcyxcbiAgT3B0aW9uSGFybmVzc0ZpbHRlcnMsXG4gIE9wdGdyb3VwSGFybmVzc0ZpbHRlcnMsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUvdGVzdGluZyc7XG5pbXBvcnQge1NlbGVjdEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3NlbGVjdC1oYXJuZXNzLWZpbHRlcnMnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFNlbGVjdEhhcm5lc3NCYXNlPFxuICAgIE9wdGlvblR5cGUgZXh0ZW5kcyAoQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPE9wdGlvbj4gJiB7XG4gICAgICB3aXRoOiAob3B0aW9ucz86IE9wdGlvbkZpbHRlcnMpID0+IEhhcm5lc3NQcmVkaWNhdGU8T3B0aW9uPn0pLFxuICAgIE9wdGlvbiBleHRlbmRzIENvbXBvbmVudEhhcm5lc3MgJiB7Y2xpY2soKTogUHJvbWlzZTx2b2lkPn0sXG4gICAgT3B0aW9uRmlsdGVycyBleHRlbmRzIEJhc2VIYXJuZXNzRmlsdGVycyxcbiAgICBPcHRpb25Hcm91cFR5cGUgZXh0ZW5kcyAoQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPE9wdGlvbkdyb3VwPiAmIHtcbiAgICAgIHdpdGg6IChvcHRpb25zPzogT3B0aW9uR3JvdXBGaWx0ZXJzKSA9PiBIYXJuZXNzUHJlZGljYXRlPE9wdGlvbkdyb3VwPn0pLFxuICAgIE9wdGlvbkdyb3VwIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyxcbiAgICBPcHRpb25Hcm91cEZpbHRlcnMgZXh0ZW5kcyBCYXNlSGFybmVzc0ZpbHRlcnNcbj4gZXh0ZW5kcyBNYXRGb3JtRmllbGRDb250cm9sSGFybmVzcyB7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfcHJlZml4OiBzdHJpbmc7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfb3B0aW9uQ2xhc3M6IE9wdGlvblR5cGU7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfb3B0aW9uR3JvdXBDbGFzczogT3B0aW9uR3JvdXBUeXBlO1xuICBwcml2YXRlIF9kb2N1bWVudFJvb3RMb2NhdG9yID0gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpO1xuICBwcml2YXRlIF9iYWNrZHJvcCA9IHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvcignLmNkay1vdmVybGF5LWJhY2tkcm9wJyk7XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgc2VsZWN0IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKGAke3RoaXMuX3ByZWZpeH0tc2VsZWN0LWRpc2FibGVkYCk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBzZWxlY3QgaXMgdmFsaWQuICovXG4gIGFzeW5jIGlzVmFsaWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbmctaW52YWxpZCcpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyByZXF1aXJlZC4gKi9cbiAgYXN5bmMgaXNSZXF1aXJlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcyhgJHt0aGlzLl9wcmVmaXh9LXNlbGVjdC1yZXF1aXJlZGApO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgc2VsZWN0IGlzIGVtcHR5IChubyB2YWx1ZSBpcyBzZWxlY3RlZCkuICovXG4gIGFzeW5jIGlzRW1wdHkoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoYCR7dGhpcy5fcHJlZml4fS1zZWxlY3QtZW1wdHlgKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyBpbiBtdWx0aS1zZWxlY3Rpb24gbW9kZS4gKi9cbiAgYXN5bmMgaXNNdWx0aXBsZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcyhgJHt0aGlzLl9wcmVmaXh9LXNlbGVjdC1tdWx0aXBsZWApO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgc2VsZWN0J3MgdmFsdWUgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VmFsdWVUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgdmFsdWUgPSBhd2FpdCB0aGlzLmxvY2F0b3JGb3IoYC4ke3RoaXMuX3ByZWZpeH0tc2VsZWN0LXZhbHVlYCkoKTtcbiAgICByZXR1cm4gdmFsdWUudGV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHNlbGVjdCBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZSBhY3Rpb24gaXMgY29tcGxldGUuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIHNlbGVjdCBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZSBhY3Rpb24gaXMgY29tcGxldGUuICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNlbGVjdCBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgb3B0aW9ucyBpbnNpZGUgdGhlIHNlbGVjdCBwYW5lbC4gKi9cbiAgYXN5bmMgZ2V0T3B0aW9ucyhmaWx0ZXI/OiBPbWl0PE9wdGlvbkZpbHRlcnMsICdhbmNlc3Rvcic+KTogUHJvbWlzZTxPcHRpb25bXT4ge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwodGhpcy5fb3B0aW9uQ2xhc3Mud2l0aCh7XG4gICAgICAuLi4oZmlsdGVyIHx8IHt9KSxcbiAgICAgIGFuY2VzdG9yOiBhd2FpdCB0aGlzLl9nZXRQYW5lbFNlbGVjdG9yKClcbiAgICB9IGFzIE9wdGlvbkZpbHRlcnMpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGdyb3VwcyBvZiBvcHRpb25zIGluc2lkZSB0aGUgcGFuZWwuICovXG4gIGFzeW5jIGdldE9wdGlvbkdyb3VwcyhmaWx0ZXI/OiBPbWl0PE9wdGlvbkdyb3VwRmlsdGVycywgJ2FuY2VzdG9yJz4pOiBQcm9taXNlPE9wdGlvbkdyb3VwW10+IHtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yQWxsKHRoaXMuX29wdGlvbkdyb3VwQ2xhc3Mud2l0aCh7XG4gICAgICAuLi4oZmlsdGVyIHx8IHt9KSxcbiAgICAgIGFuY2VzdG9yOiBhd2FpdCB0aGlzLl9nZXRQYW5lbFNlbGVjdG9yKClcbiAgICB9IGFzIE9wdGlvbkdyb3VwRmlsdGVycykpKCkgYXMgUHJvbWlzZTxPcHRpb25Hcm91cFtdPjtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHNlbGVjdCBpcyBvcGVuLiAqL1xuICBhc3luYyBpc09wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEhYXdhaXQgdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yT3B0aW9uYWwoYXdhaXQgdGhpcy5fZ2V0UGFuZWxTZWxlY3RvcigpKSgpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBzZWxlY3QncyBwYW5lbC4gKi9cbiAgYXN5bmMgb3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBhd2FpdCB0aGlzLmxvY2F0b3JGb3IoYC4ke3RoaXMuX3ByZWZpeH0tc2VsZWN0LXRyaWdnZXJgKSgpO1xuICAgICAgcmV0dXJuIHRyaWdnZXIuY2xpY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xpY2tzIHRoZSBvcHRpb25zIHRoYXQgbWF0Y2ggdGhlIHBhc3NlZC1pbiBmaWx0ZXIuIElmIHRoZSBzZWxlY3QgaXMgaW4gbXVsdGktc2VsZWN0aW9uXG4gICAqIG1vZGUgYWxsIG9wdGlvbnMgd2lsbCBiZSBjbGlja2VkLCBvdGhlcndpc2UgdGhlIGhhcm5lc3Mgd2lsbCBwaWNrIHRoZSBmaXJzdCBtYXRjaGluZyBvcHRpb24uXG4gICAqL1xuICBhc3luYyBjbGlja09wdGlvbnMoZmlsdGVyPzogT3B0aW9uRmlsdGVycyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMub3BlbigpO1xuXG4gICAgY29uc3QgW2lzTXVsdGlwbGUsIG9wdGlvbnNdID1cbiAgICAgIGF3YWl0IHBhcmFsbGVsKCgpID0+IFt0aGlzLmlzTXVsdGlwbGUoKSwgdGhpcy5nZXRPcHRpb25zKGZpbHRlcildKTtcblxuICAgIGlmIChvcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1NlbGVjdCBkb2VzIG5vdCBoYXZlIG9wdGlvbnMgbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBmaWx0ZXInKTtcbiAgICB9XG5cbiAgICBpZiAoaXNNdWx0aXBsZSkge1xuICAgICAgYXdhaXQgcGFyYWxsZWwoKCkgPT4gb3B0aW9ucy5tYXAob3B0aW9uID0+IG9wdGlvbi5jbGljaygpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IG9wdGlvbnNbMF0uY2xpY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBzZWxlY3QncyBwYW5lbC4gKi9cbiAgYXN5bmMgY2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIG1vc3QgY29uc2lzdGVudCB3YXkgdGhhdCB3b3JrcyBib3RoIGluIGJvdGggc2luZ2xlIGFuZCBtdWx0aS1zZWxlY3QgbW9kZXMsXG4gICAgICAvLyBidXQgaXQgYXNzdW1lcyB0aGF0IG9ubHkgb25lIG92ZXJsYXkgaXMgb3BlbiBhdCBhIHRpbWUuIFdlIHNob3VsZCBiZSBhYmxlIHRvIG1ha2UgaXRcbiAgICAgIC8vIGEgYml0IG1vcmUgcHJlY2lzZSBhZnRlciAjMTY2NDUgd2hlcmUgd2UgY2FuIGRpc3BhdGNoIGFuIEVTQ0FQRSBwcmVzcyB0byB0aGUgaG9zdCBpbnN0ZWFkLlxuICAgICAgcmV0dXJuIChhd2FpdCB0aGlzLl9iYWNrZHJvcCgpKS5jbGljaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzZWxlY3RvciB0aGF0IHNob3VsZCBiZSB1c2VkIHRvIGZpbmQgdGhpcyBzZWxlY3QncyBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0UGFuZWxTZWxlY3RvcigpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGlkID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgcmV0dXJuIGAjJHtpZH0tcGFuZWxgO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXNlbGVjdCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RIYXJuZXNzIGV4dGVuZHMgIF9NYXRTZWxlY3RIYXJuZXNzQmFzZTxcbiAgdHlwZW9mIE1hdE9wdGlvbkhhcm5lc3MsIE1hdE9wdGlvbkhhcm5lc3MsIE9wdGlvbkhhcm5lc3NGaWx0ZXJzLFxuICB0eXBlb2YgTWF0T3B0Z3JvdXBIYXJuZXNzLCBNYXRPcHRncm91cEhhcm5lc3MsIE9wdGdyb3VwSGFybmVzc0ZpbHRlcnNcbj4ge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc2VsZWN0JztcbiAgcHJvdGVjdGVkIF9wcmVmaXggPSAnbWF0JztcbiAgcHJvdGVjdGVkIF9vcHRpb25DbGFzcyA9IE1hdE9wdGlvbkhhcm5lc3M7XG4gIHByb3RlY3RlZCBfb3B0aW9uR3JvdXBDbGFzcyA9IE1hdE9wdGdyb3VwSGFybmVzcztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0U2VsZWN0SGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggc2VsZWN0IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFNlbGVjdEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFNlbGVjdEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U2VsZWN0SGFybmVzcywgb3B0aW9ucyk7XG4gIH1cbn1cbiJdfQ==