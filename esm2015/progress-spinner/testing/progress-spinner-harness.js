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
/**
 * Harness for interacting with a standard mat-progress-spinner in tests.
 * @dynamic
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Byb2dyZXNzLXNwaW5uZXIvdGVzdGluZy9wcm9ncmVzcy1zcGlubmVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBSXhFOzs7R0FHRztBQUNILE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxnQkFBZ0I7SUFHN0Q7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUF5QyxFQUFFO1FBRXJELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyx5QkFBeUIsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsdURBQXVEO0lBQ2pELFFBQVE7O1lBQ1osTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDL0IsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzNELE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQzVELENBQUM7S0FBQTtJQUVELHNEQUFzRDtJQUNoRCxPQUFPOztZQUNYLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUQsT0FBTyxNQUFNLFFBQStCLENBQUM7UUFDL0MsQ0FBQztLQUFBOztBQXRCTSxzQ0FBWSxHQUFHLHNCQUFzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7UHJvZ3Jlc3NTcGlubmVyTW9kZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lcic7XG5pbXBvcnQge1Byb2dyZXNzU3Bpbm5lckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3Byb2dyZXNzLXNwaW5uZXItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXByb2dyZXNzLXNwaW5uZXIgaW4gdGVzdHMuXG4gKiBAZHluYW1pY1xuICovXG5leHBvcnQgY2xhc3MgTWF0UHJvZ3Jlc3NTcGlubmVySGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1wcm9ncmVzcy1zcGlubmVyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBwcm9ncmVzcyBiYXIgd2l0aCBzcGVjaWZpY1xuICAgKiBhdHRyaWJ1dGVzLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUHJvZ3Jlc3NTcGlubmVySGFybmVzc0ZpbHRlcnMgPSB7fSk6XG4gICAgICBIYXJuZXNzUHJlZGljYXRlPE1hdFByb2dyZXNzU3Bpbm5lckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0UHJvZ3Jlc3NTcGlubmVySGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBwcm9ncmVzcyBzcGlubmVyJ3MgdmFsdWUuICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8bnVtYmVyfG51bGw+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgYXJpYVZhbHVlID0gYXdhaXQgaG9zdC5nZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnKTtcbiAgICByZXR1cm4gYXJpYVZhbHVlID8gY29lcmNlTnVtYmVyUHJvcGVydHkoYXJpYVZhbHVlKSA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBwcm9ncmVzcyBzcGlubmVyJ3MgbW9kZS4gKi9cbiAgYXN5bmMgZ2V0TW9kZSgpOiBQcm9taXNlPFByb2dyZXNzU3Bpbm5lck1vZGU+IHtcbiAgICBjb25zdCBtb2RlQXR0ciA9IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdtb2RlJyk7XG4gICAgcmV0dXJuIGF3YWl0IG1vZGVBdHRyIGFzIFByb2dyZXNzU3Bpbm5lck1vZGU7XG4gIH1cbn1cbiJdfQ==