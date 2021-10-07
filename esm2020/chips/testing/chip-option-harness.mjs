/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatChipHarness } from './chip-harness';
export class MatChipOptionHarness extends MatChipHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipOptionHarness`
     * that meets certain criteria.
     * @param options Options for filtering which chip instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatChipOptionHarness, options)
            .addOption('text', options.text, (harness, label) => HarnessPredicate.stringMatches(harness.getText(), label))
            .addOption('selected', options.selected, async (harness, selected) => (await harness.isSelected()) === selected);
    }
    /** Whether the chip is selected. */
    async isSelected() {
        return (await this.host()).hasClass('mat-chip-selected');
    }
    /** Selects the given chip. Only applies if it's selectable. */
    async select() {
        if (!(await this.isSelected())) {
            await this.toggle();
        }
    }
    /** Deselects the given chip. Only applies if it's selectable. */
    async deselect() {
        if (await this.isSelected()) {
            await this.toggle();
        }
    }
    /** Toggles the selected state of the given chip. */
    async toggle() {
        return (await this.host()).sendKeys(' ');
    }
}
/** The selector for the host element of a selectable chip instance. */
MatChipOptionHarness.hostSelector = '.mat-chip';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1vcHRpb24taGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy90ZXN0aW5nL2NoaXAtb3B0aW9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRzlDLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxjQUFjO0lBSXREOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFVLElBQUksQ0FBQyxVQUFvQyxFQUFFO1FBRXpELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUM7YUFDckQsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUMzQixDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDaEYsU0FBUyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUNuQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFRCxvQ0FBb0M7SUFDM0IsS0FBSyxDQUFDLFVBQVU7UUFDdkIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELCtEQUErRDtJQUN0RCxLQUFLLENBQUMsTUFBTTtRQUNuQixJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFO1lBQzlCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUVELGlFQUFpRTtJQUN4RCxLQUFLLENBQUMsUUFBUTtRQUNyQixJQUFJLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQzNCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUVELG9EQUFvRDtJQUMzQyxLQUFLLENBQUMsTUFBTTtRQUNuQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQzs7QUF4Q0QsdUVBQXVFO0FBQ3ZELGlDQUFZLEdBQUcsV0FBVyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXRDaGlwSGFybmVzc30gZnJvbSAnLi9jaGlwLWhhcm5lc3MnO1xuaW1wb3J0IHtDaGlwT3B0aW9uSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vY2hpcC1oYXJuZXNzLWZpbHRlcnMnO1xuXG5leHBvcnQgY2xhc3MgTWF0Q2hpcE9wdGlvbkhhcm5lc3MgZXh0ZW5kcyBNYXRDaGlwSGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBzZWxlY3RhYmxlIGNoaXAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBvdmVycmlkZSBob3N0U2VsZWN0b3IgPSAnLm1hdC1jaGlwJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0Q2hpcE9wdGlvbkhhcm5lc3NgXG4gICAqIHRoYXQgbWVldHMgY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGNoaXAgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIG92ZXJyaWRlIHdpdGgob3B0aW9uczogQ2hpcE9wdGlvbkhhcm5lc3NGaWx0ZXJzID0ge30pOlxuICAgIEhhcm5lc3NQcmVkaWNhdGU8TWF0Q2hpcE9wdGlvbkhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0Q2hpcE9wdGlvbkhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3RleHQnLCBvcHRpb25zLnRleHQsXG4gICAgICAgICAgICAoaGFybmVzcywgbGFiZWwpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgbGFiZWwpKVxuICAgICAgICAuYWRkT3B0aW9uKCdzZWxlY3RlZCcsIG9wdGlvbnMuc2VsZWN0ZWQsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgc2VsZWN0ZWQpID0+IChhd2FpdCBoYXJuZXNzLmlzU2VsZWN0ZWQoKSkgPT09IHNlbGVjdGVkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGlzIHNlbGVjdGVkLiAqL1xuICBvdmVycmlkZSBhc3luYyBpc1NlbGVjdGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtY2hpcC1zZWxlY3RlZCcpO1xuICB9XG5cbiAgLyoqIFNlbGVjdHMgdGhlIGdpdmVuIGNoaXAuIE9ubHkgYXBwbGllcyBpZiBpdCdzIHNlbGVjdGFibGUuICovXG4gIG92ZXJyaWRlIGFzeW5jIHNlbGVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIShhd2FpdCB0aGlzLmlzU2VsZWN0ZWQoKSkpIHtcbiAgICAgIGF3YWl0IHRoaXMudG9nZ2xlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERlc2VsZWN0cyB0aGUgZ2l2ZW4gY2hpcC4gT25seSBhcHBsaWVzIGlmIGl0J3Mgc2VsZWN0YWJsZS4gKi9cbiAgb3ZlcnJpZGUgYXN5bmMgZGVzZWxlY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaXNTZWxlY3RlZCgpKSB7XG4gICAgICBhd2FpdCB0aGlzLnRvZ2dsZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiB0aGUgZ2l2ZW4gY2hpcC4gKi9cbiAgb3ZlcnJpZGUgYXN5bmMgdG9nZ2xlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnNlbmRLZXlzKCcgJyk7XG4gIH1cbn1cbiJdfQ==