/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { MatChipHarness } from './chip-harness';
// TODO(crisbeto): add harness for the chip edit input inside the row.
/** Harness for interacting with a mat-chip-row in tests. */
export class MatChipRowHarness extends MatChipHarness {
    /** Whether the chip is editable. */
    async isEditable() {
        return (await this.host()).hasClass('mat-mdc-chip-editable');
    }
    /** Whether the chip is currently being edited. */
    async isEditing() {
        return (await this.host()).hasClass('mat-mdc-chip-editing');
    }
}
MatChipRowHarness.hostSelector = '.mat-mdc-chip-row';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1yb3ctaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy90ZXN0aW5nL2NoaXAtcm93LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTlDLHNFQUFzRTtBQUV0RSw0REFBNEQ7QUFDNUQsTUFBTSxPQUFPLGlCQUFrQixTQUFRLGNBQWM7SUFHbkQsb0NBQW9DO0lBQ3BDLEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELGtEQUFrRDtJQUNsRCxLQUFLLENBQUMsU0FBUztRQUNiLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzlELENBQUM7O0FBVmUsOEJBQVksR0FBRyxtQkFBbUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01hdENoaXBIYXJuZXNzfSBmcm9tICcuL2NoaXAtaGFybmVzcyc7XG5cbi8vIFRPRE8oY3Jpc2JldG8pOiBhZGQgaGFybmVzcyBmb3IgdGhlIGNoaXAgZWRpdCBpbnB1dCBpbnNpZGUgdGhlIHJvdy5cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBtYXQtY2hpcC1yb3cgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0Q2hpcFJvd0hhcm5lc3MgZXh0ZW5kcyBNYXRDaGlwSGFybmVzcyB7XG4gIHN0YXRpYyBvdmVycmlkZSBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZGMtY2hpcC1yb3cnO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGlzIGVkaXRhYmxlLiAqL1xuICBhc3luYyBpc0VkaXRhYmxlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtbWRjLWNoaXAtZWRpdGFibGUnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGlzIGN1cnJlbnRseSBiZWluZyBlZGl0ZWQuICovXG4gIGFzeW5jIGlzRWRpdGluZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LW1kYy1jaGlwLWVkaXRpbmcnKTtcbiAgfVxufVxuIl19