/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
/** Harness for interacting with an editable chip's input in tests. */
class MatChipEditInputHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a chip edit input with specific
     * attributes.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
    /** Sets the value of the input. */
    async setValue(value) {
        const host = await this.host();
        // @breaking-change 16.0.0 Remove this null check once `setContenteditableValue`
        // becomes a required method.
        if (!host.setContenteditableValue) {
            throw new Error('Cannot set chip edit input value, because test ' +
                'element does not implement the `setContenteditableValue` method.');
        }
        return host.setContenteditableValue(value);
    }
}
MatChipEditInputHarness.hostSelector = '.mat-chip-edit-input';
export { MatChipEditInputHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1lZGl0LWlucHV0LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hpcHMvdGVzdGluZy9jaGlwLWVkaXQtaW5wdXQtaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsZ0JBQWdCLEVBRWhCLGdCQUFnQixHQUNqQixNQUFNLHNCQUFzQixDQUFDO0FBRzlCLHNFQUFzRTtBQUN0RSxNQUFhLHVCQUF3QixTQUFRLGdCQUFnQjtJQUczRDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBRVQsVUFBdUMsRUFBRTtRQUV6QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxtQ0FBbUM7SUFDbkMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFhO1FBQzFCLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRS9CLGdGQUFnRjtRQUNoRiw2QkFBNkI7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtZQUNqQyxNQUFNLElBQUksS0FBSyxDQUNiLGlEQUFpRDtnQkFDL0Msa0VBQWtFLENBQ3JFLENBQUM7U0FDSDtRQUVELE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdDLENBQUM7O0FBN0JNLG9DQUFZLEdBQUcsc0JBQXNCLENBQUM7U0FEbEMsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudEhhcm5lc3MsXG4gIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcixcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtDaGlwRWRpdElucHV0SGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vY2hpcC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhbiBlZGl0YWJsZSBjaGlwJ3MgaW5wdXQgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0Q2hpcEVkaXRJbnB1dEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWNoaXAtZWRpdC1pbnB1dCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgY2hpcCBlZGl0IGlucHV0IHdpdGggc3BlY2lmaWNcbiAgICogYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGlucHV0IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoPFQgZXh0ZW5kcyBNYXRDaGlwRWRpdElucHV0SGFybmVzcz4oXG4gICAgdGhpczogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFQ+LFxuICAgIG9wdGlvbnM6IENoaXBFZGl0SW5wdXRIYXJuZXNzRmlsdGVycyA9IHt9LFxuICApOiBIYXJuZXNzUHJlZGljYXRlPFQ+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUodGhpcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0LiAqL1xuICBhc3luYyBzZXRWYWx1ZSh2YWx1ZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxNi4wLjAgUmVtb3ZlIHRoaXMgbnVsbCBjaGVjayBvbmNlIGBzZXRDb250ZW50ZWRpdGFibGVWYWx1ZWBcbiAgICAvLyBiZWNvbWVzIGEgcmVxdWlyZWQgbWV0aG9kLlxuICAgIGlmICghaG9zdC5zZXRDb250ZW50ZWRpdGFibGVWYWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ2Fubm90IHNldCBjaGlwIGVkaXQgaW5wdXQgdmFsdWUsIGJlY2F1c2UgdGVzdCAnICtcbiAgICAgICAgICAnZWxlbWVudCBkb2VzIG5vdCBpbXBsZW1lbnQgdGhlIGBzZXRDb250ZW50ZWRpdGFibGVWYWx1ZWAgbWV0aG9kLicsXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBob3N0LnNldENvbnRlbnRlZGl0YWJsZVZhbHVlKHZhbHVlKTtcbiAgfVxufVxuIl19