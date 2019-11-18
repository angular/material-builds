/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-progress-spinner in tests. */
export class MatProgressSpinnerHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a progress bar with specific
     * attributes.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatProgressSpinnerHarness, options);
    }
    /** Gets a promise for the progress spinner's value. */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            const ariaValue = yield host.getAttribute('aria-valuenow');
            return ariaValue ? coerceNumberProperty(ariaValue) : null;
        });
    }
    /** Gets a promise for the progress spinner's mode. */
    getMode() {
        return __awaiter(this, void 0, void 0, function* () {
            const modeAttr = (yield this.host()).getAttribute('mode');
            return yield modeAttr;
        });
    }
}
MatProgressSpinnerHarness.hostSelector = 'mat-progress-spinner';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Byb2dyZXNzLXNwaW5uZXIvdGVzdGluZy9wcm9ncmVzcy1zcGlubmVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBSXhFLDZFQUE2RTtBQUM3RSxNQUFNLE9BQU8seUJBQTBCLFNBQVEsZ0JBQWdCO0lBRzdEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBeUMsRUFBRTtRQUVyRCxPQUFPLElBQUksZ0JBQWdCLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELHVEQUF1RDtJQUNqRCxRQUFROztZQUNaLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQy9CLE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUMzRCxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUM1RCxDQUFDO0tBQUE7SUFFRCxzREFBc0Q7SUFDaEQsT0FBTzs7WUFDWCxNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFELE9BQU8sTUFBTSxRQUErQixDQUFDO1FBQy9DLENBQUM7S0FBQTs7QUF0Qk0sc0NBQVksR0FBRyxzQkFBc0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1Byb2dyZXNzU3Bpbm5lck1vZGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3Byb2dyZXNzLXNwaW5uZXInO1xuaW1wb3J0IHtQcm9ncmVzc1NwaW5uZXJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9wcm9ncmVzcy1zcGlubmVyLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXByb2dyZXNzLXNwaW5uZXIgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0UHJvZ3Jlc3NTcGlubmVySGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1wcm9ncmVzcy1zcGlubmVyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBwcm9ncmVzcyBiYXIgd2l0aCBzcGVjaWZpY1xuICAgKiBhdHRyaWJ1dGVzLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUHJvZ3Jlc3NTcGlubmVySGFybmVzc0ZpbHRlcnMgPSB7fSk6XG4gICAgICBIYXJuZXNzUHJlZGljYXRlPE1hdFByb2dyZXNzU3Bpbm5lckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0UHJvZ3Jlc3NTcGlubmVySGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBwcm9ncmVzcyBzcGlubmVyJ3MgdmFsdWUuICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8bnVtYmVyfG51bGw+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgYXJpYVZhbHVlID0gYXdhaXQgaG9zdC5nZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnKTtcbiAgICByZXR1cm4gYXJpYVZhbHVlID8gY29lcmNlTnVtYmVyUHJvcGVydHkoYXJpYVZhbHVlKSA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBwcm9ncmVzcyBzcGlubmVyJ3MgbW9kZS4gKi9cbiAgYXN5bmMgZ2V0TW9kZSgpOiBQcm9taXNlPFByb2dyZXNzU3Bpbm5lck1vZGU+IHtcbiAgICBjb25zdCBtb2RlQXR0ciA9IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdtb2RlJyk7XG4gICAgcmV0dXJuIGF3YWl0IG1vZGVBdHRyIGFzIFByb2dyZXNzU3Bpbm5lck1vZGU7XG4gIH1cbn1cbiJdfQ==