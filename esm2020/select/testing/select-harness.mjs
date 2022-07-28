/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, parallel, } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
import { MatLegacyOptionHarness, MatLegacyOptgroupHarness, } from '@angular/material/legacy-core/testing';
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
            ancestor: await this._getPanelSelector(),
        }))();
    }
    /** Gets the groups of options inside the panel. */
    async getOptionGroups(filter) {
        return this._documentRootLocator.locatorForAll(this._optionGroupClass.with({
            ...(filter || {}),
            ancestor: await this._getPanelSelector(),
        }))();
    }
    /** Gets whether the select is open. */
    async isOpen() {
        return !!(await this._documentRootLocator.locatorForOptional(await this._getPanelSelector())());
    }
    /** Opens the select's panel. */
    async open() {
        if (!(await this.isOpen())) {
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
        const [isMultiple, options] = await parallel(() => [
            this.isMultiple(),
            this.getOptions(filter),
        ]);
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
        this._optionClass = MatLegacyOptionHarness;
        this._optionGroupClass = MatLegacyOptgroupHarness;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3Rlc3Rpbmcvc2VsZWN0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixRQUFRLEdBSVQsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUN4RixPQUFPLEVBQ0wsc0JBQXNCLEVBQ3RCLHdCQUF3QixHQUd6QixNQUFNLHVDQUF1QyxDQUFDO0FBRy9DLE1BQU0sT0FBZ0IscUJBV3BCLFNBQVEsMEJBQTBCO0lBWHBDOztRQWVVLHlCQUFvQixHQUFHLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1FBQ3pELGNBQVMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUF1SHBGLENBQUM7SUFySEMsbUVBQW1FO0lBQ25FLEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sa0JBQWtCLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsZ0VBQWdFO0lBQ2hFLEtBQUssQ0FBQyxPQUFPO1FBQ1gsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELG1FQUFtRTtJQUNuRSxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLGtCQUFrQixD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LE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBZ0MsRUFBRTtRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekQsQ0FBQzs7QUFiTSw2QkFBWSxHQUFHLGFBQWEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBIYXJuZXNzUHJlZGljYXRlLFxuICBwYXJhbGxlbCxcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQmFzZUhhcm5lc3NGaWx0ZXJzLFxuICBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3IsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9jb250cm9sJztcbmltcG9ydCB7XG4gIE1hdExlZ2FjeU9wdGlvbkhhcm5lc3MsXG4gIE1hdExlZ2FjeU9wdGdyb3VwSGFybmVzcyxcbiAgT3B0aW9uSGFybmVzc0ZpbHRlcnMsXG4gIE9wdGdyb3VwSGFybmVzc0ZpbHRlcnMsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2xlZ2FjeS1jb3JlL3Rlc3RpbmcnO1xuaW1wb3J0IHtTZWxlY3RIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9zZWxlY3QtaGFybmVzcy1maWx0ZXJzJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRTZWxlY3RIYXJuZXNzQmFzZTxcbiAgT3B0aW9uVHlwZSBleHRlbmRzIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxPcHRpb24+ICYge1xuICAgIHdpdGg6IChvcHRpb25zPzogT3B0aW9uRmlsdGVycykgPT4gSGFybmVzc1ByZWRpY2F0ZTxPcHRpb24+O1xuICB9LFxuICBPcHRpb24gZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzICYge2NsaWNrKCk6IFByb21pc2U8dm9pZD59LFxuICBPcHRpb25GaWx0ZXJzIGV4dGVuZHMgQmFzZUhhcm5lc3NGaWx0ZXJzLFxuICBPcHRpb25Hcm91cFR5cGUgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8T3B0aW9uR3JvdXA+ICYge1xuICAgIHdpdGg6IChvcHRpb25zPzogT3B0aW9uR3JvdXBGaWx0ZXJzKSA9PiBIYXJuZXNzUHJlZGljYXRlPE9wdGlvbkdyb3VwPjtcbiAgfSxcbiAgT3B0aW9uR3JvdXAgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzLFxuICBPcHRpb25Hcm91cEZpbHRlcnMgZXh0ZW5kcyBCYXNlSGFybmVzc0ZpbHRlcnMsXG4+IGV4dGVuZHMgTWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3Mge1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3ByZWZpeDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX29wdGlvbkNsYXNzOiBPcHRpb25UeXBlO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX29wdGlvbkdyb3VwQ2xhc3M6IE9wdGlvbkdyb3VwVHlwZTtcbiAgcHJpdmF0ZSBfZG9jdW1lbnRSb290TG9jYXRvciA9IHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKTtcbiAgcHJpdmF0ZSBfYmFja2Ryb3AgPSB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3IoJy5jZGstb3ZlcmxheS1iYWNrZHJvcCcpO1xuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcyhgJHt0aGlzLl9wcmVmaXh9LXNlbGVjdC1kaXNhYmxlZGApO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgc2VsZWN0IGlzIHZhbGlkLiAqL1xuICBhc3luYyBpc1ZhbGlkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAhKGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ25nLWludmFsaWQnKSk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBzZWxlY3QgaXMgcmVxdWlyZWQuICovXG4gIGFzeW5jIGlzUmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoYCR7dGhpcy5fcHJlZml4fS1zZWxlY3QtcmVxdWlyZWRgKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyBlbXB0eSAobm8gdmFsdWUgaXMgc2VsZWN0ZWQpLiAqL1xuICBhc3luYyBpc0VtcHR5KCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKGAke3RoaXMuX3ByZWZpeH0tc2VsZWN0LWVtcHR5YCk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBzZWxlY3QgaXMgaW4gbXVsdGktc2VsZWN0aW9uIG1vZGUuICovXG4gIGFzeW5jIGlzTXVsdGlwbGUoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoYCR7dGhpcy5fcHJlZml4fS1zZWxlY3QtbXVsdGlwbGVgKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHNlbGVjdCdzIHZhbHVlIHRleHQuICovXG4gIGFzeW5jIGdldFZhbHVlVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IHZhbHVlID0gYXdhaXQgdGhpcy5sb2NhdG9yRm9yKGAuJHt0aGlzLl9wcmVmaXh9LXNlbGVjdC12YWx1ZWApKCk7XG4gICAgcmV0dXJuIHZhbHVlLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBzZWxlY3QgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBzZWxlY3QgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmlzRm9jdXNlZCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG9wdGlvbnMgaW5zaWRlIHRoZSBzZWxlY3QgcGFuZWwuICovXG4gIGFzeW5jIGdldE9wdGlvbnMoZmlsdGVyPzogT21pdDxPcHRpb25GaWx0ZXJzLCAnYW5jZXN0b3InPik6IFByb21pc2U8T3B0aW9uW10+IHtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yQWxsKFxuICAgICAgdGhpcy5fb3B0aW9uQ2xhc3Mud2l0aCh7XG4gICAgICAgIC4uLihmaWx0ZXIgfHwge30pLFxuICAgICAgICBhbmNlc3RvcjogYXdhaXQgdGhpcy5fZ2V0UGFuZWxTZWxlY3RvcigpLFxuICAgICAgfSBhcyBPcHRpb25GaWx0ZXJzKSxcbiAgICApKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZ3JvdXBzIG9mIG9wdGlvbnMgaW5zaWRlIHRoZSBwYW5lbC4gKi9cbiAgYXN5bmMgZ2V0T3B0aW9uR3JvdXBzKGZpbHRlcj86IE9taXQ8T3B0aW9uR3JvdXBGaWx0ZXJzLCAnYW5jZXN0b3InPik6IFByb21pc2U8T3B0aW9uR3JvdXBbXT4ge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoXG4gICAgICB0aGlzLl9vcHRpb25Hcm91cENsYXNzLndpdGgoe1xuICAgICAgICAuLi4oZmlsdGVyIHx8IHt9KSxcbiAgICAgICAgYW5jZXN0b3I6IGF3YWl0IHRoaXMuX2dldFBhbmVsU2VsZWN0b3IoKSxcbiAgICAgIH0gYXMgT3B0aW9uR3JvdXBGaWx0ZXJzKSxcbiAgICApKCkgYXMgUHJvbWlzZTxPcHRpb25Hcm91cFtdPjtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHNlbGVjdCBpcyBvcGVuLiAqL1xuICBhc3luYyBpc09wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEhKGF3YWl0IHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvck9wdGlvbmFsKGF3YWl0IHRoaXMuX2dldFBhbmVsU2VsZWN0b3IoKSkoKSk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIHNlbGVjdCdzIHBhbmVsLiAqL1xuICBhc3luYyBvcGVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuaXNPcGVuKCkpKSB7XG4gICAgICBjb25zdCB0cmlnZ2VyID0gYXdhaXQgdGhpcy5sb2NhdG9yRm9yKGAuJHt0aGlzLl9wcmVmaXh9LXNlbGVjdC10cmlnZ2VyYCkoKTtcbiAgICAgIHJldHVybiB0cmlnZ2VyLmNsaWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsaWNrcyB0aGUgb3B0aW9ucyB0aGF0IG1hdGNoIHRoZSBwYXNzZWQtaW4gZmlsdGVyLiBJZiB0aGUgc2VsZWN0IGlzIGluIG11bHRpLXNlbGVjdGlvblxuICAgKiBtb2RlIGFsbCBvcHRpb25zIHdpbGwgYmUgY2xpY2tlZCwgb3RoZXJ3aXNlIHRoZSBoYXJuZXNzIHdpbGwgcGljayB0aGUgZmlyc3QgbWF0Y2hpbmcgb3B0aW9uLlxuICAgKi9cbiAgYXN5bmMgY2xpY2tPcHRpb25zKGZpbHRlcj86IE9wdGlvbkZpbHRlcnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLm9wZW4oKTtcblxuICAgIGNvbnN0IFtpc011bHRpcGxlLCBvcHRpb25zXSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFtcbiAgICAgIHRoaXMuaXNNdWx0aXBsZSgpLFxuICAgICAgdGhpcy5nZXRPcHRpb25zKGZpbHRlciksXG4gICAgXSk7XG5cbiAgICBpZiAob3B0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IEVycm9yKCdTZWxlY3QgZG9lcyBub3QgaGF2ZSBvcHRpb25zIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVyJyk7XG4gICAgfVxuXG4gICAgaWYgKGlzTXVsdGlwbGUpIHtcbiAgICAgIGF3YWl0IHBhcmFsbGVsKCgpID0+IG9wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24uY2xpY2soKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBvcHRpb25zWzBdLmNsaWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgc2VsZWN0J3MgcGFuZWwuICovXG4gIGFzeW5jIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChhd2FpdCB0aGlzLmlzT3BlbigpKSB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBtb3N0IGNvbnNpc3RlbnQgd2F5IHRoYXQgd29ya3MgYm90aCBpbiBib3RoIHNpbmdsZSBhbmQgbXVsdGktc2VsZWN0IG1vZGVzLFxuICAgICAgLy8gYnV0IGl0IGFzc3VtZXMgdGhhdCBvbmx5IG9uZSBvdmVybGF5IGlzIG9wZW4gYXQgYSB0aW1lLiBXZSBzaG91bGQgYmUgYWJsZSB0byBtYWtlIGl0XG4gICAgICAvLyBhIGJpdCBtb3JlIHByZWNpc2UgYWZ0ZXIgIzE2NjQ1IHdoZXJlIHdlIGNhbiBkaXNwYXRjaCBhbiBFU0NBUEUgcHJlc3MgdG8gdGhlIGhvc3QgaW5zdGVhZC5cbiAgICAgIHJldHVybiAoYXdhaXQgdGhpcy5fYmFja2Ryb3AoKSkuY2xpY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2VsZWN0b3IgdGhhdCBzaG91bGQgYmUgdXNlZCB0byBmaW5kIHRoaXMgc2VsZWN0J3MgcGFuZWwuICovXG4gIHByaXZhdGUgYXN5bmMgX2dldFBhbmVsU2VsZWN0b3IoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBpZCA9IGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgIHJldHVybiBgIyR7aWR9LXBhbmVsYDtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1zZWxlY3QgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0SGFybmVzcyBleHRlbmRzIF9NYXRTZWxlY3RIYXJuZXNzQmFzZTxcbiAgdHlwZW9mIE1hdExlZ2FjeU9wdGlvbkhhcm5lc3MsXG4gIE1hdExlZ2FjeU9wdGlvbkhhcm5lc3MsXG4gIE9wdGlvbkhhcm5lc3NGaWx0ZXJzLFxuICB0eXBlb2YgTWF0TGVnYWN5T3B0Z3JvdXBIYXJuZXNzLFxuICBNYXRMZWdhY3lPcHRncm91cEhhcm5lc3MsXG4gIE9wdGdyb3VwSGFybmVzc0ZpbHRlcnNcbj4ge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc2VsZWN0JztcbiAgcHJvdGVjdGVkIF9wcmVmaXggPSAnbWF0JztcbiAgcHJvdGVjdGVkIF9vcHRpb25DbGFzcyA9IE1hdExlZ2FjeU9wdGlvbkhhcm5lc3M7XG4gIHByb3RlY3RlZCBfb3B0aW9uR3JvdXBDbGFzcyA9IE1hdExlZ2FjeU9wdGdyb3VwSGFybmVzcztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0U2VsZWN0SGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggc2VsZWN0IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFNlbGVjdEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFNlbGVjdEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U2VsZWN0SGFybmVzcywgb3B0aW9ucyk7XG4gIH1cbn1cbiJdfQ==