/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/**
 * Harness for interacting with a the `mat-option` for a `mat-autocomplete` in tests.
 * @dynamic
 */
export class MatAutocompleteOptionHarness extends ComponentHarness {
    static with(options = {}) {
        return new HarnessPredicate(MatAutocompleteOptionHarness, options)
            .addOption('text', options.text, (harness, title) => tslib_1.__awaiter(this, void 0, void 0, function* () { return HarnessPredicate.stringMatches(yield harness.getText(), title); }));
    }
    /** Clicks the option. */
    click() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).click();
        });
    }
    /** Gets a promise for the option's label text. */
    getText() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
}
MatAutocompleteOptionHarness.hostSelector = '.mat-autocomplete-panel .mat-option';
/**
 * Harness for interacting with a the `mat-optgroup` for a `mat-autocomplete` in tests.
 * @dynamic
 */
export class MatAutocompleteOptionGroupHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._label = this.locatorFor('.mat-optgroup-label');
    }
    static with(options = {}) {
        return new HarnessPredicate(MatAutocompleteOptionGroupHarness, options)
            .addOption('labelText', options.labelText, (harness, title) => tslib_1.__awaiter(this, void 0, void 0, function* () { return HarnessPredicate.stringMatches(yield harness.getLabelText(), title); }));
    }
    /** Gets a promise for the option group's label text. */
    getLabelText() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this._label()).text();
        });
    }
}
MatAutocompleteOptionGroupHarness.hostSelector = '.mat-autocomplete-panel .mat-optgroup';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3Rpbmcvb3B0aW9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBcUIsTUFBTSxzQkFBc0IsQ0FBQztBQWE1Rjs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sNEJBQTZCLFNBQVEsZ0JBQWdCO0lBR2hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBZ0MsRUFBRTtRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsNEJBQTRCLEVBQUUsT0FBTyxDQUFDO2FBQzdELFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFDM0IsQ0FBTyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsd0RBQ3JCLE9BQUEsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE1BQU0sT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBLEdBQUEsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCx5QkFBeUI7SUFDbkIsS0FBSzs7WUFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQyxDQUFDO0tBQUE7SUFFRCxrREFBa0Q7SUFDNUMsT0FBTzs7WUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQyxDQUFDO0tBQUE7O0FBakJNLHlDQUFZLEdBQUcscUNBQXFDLENBQUM7QUFvQjlEOzs7R0FHRztBQUNILE1BQU0sT0FBTyxpQ0FBa0MsU0FBUSxnQkFBZ0I7SUFBdkU7O1FBQ1UsV0FBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQWMxRCxDQUFDO0lBWEMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFxQyxFQUFFO1FBQ2pELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxpQ0FBaUMsRUFBRSxPQUFPLENBQUM7YUFDbEUsU0FBUyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUNyQyxDQUFPLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSx3REFDckIsT0FBQSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsTUFBTSxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUEsR0FBQSxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVELHdEQUF3RDtJQUNsRCxZQUFZOztZQUNoQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QyxDQUFDO0tBQUE7O0FBWk0sOENBQVksR0FBRyx1Q0FBdUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGUsIEJhc2VIYXJuZXNzRmlsdGVyc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuXG4vLyBUT0RPKGNyaXNiZXRvKTogY29tYmluZSB0aGVzZSB3aXRoIHRoZSBvbmVzIGluIGBtYXQtc2VsZWN0YFxuLy8gYW5kIGV4cGFuZCB0byBjb3ZlciBhbGwgc3RhdGVzIG9uY2Ugd2UgaGF2ZSBleHBlcmltZW50YWwvY29yZS5cblxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25IYXJuZXNzRmlsdGVycyBleHRlbmRzIEJhc2VIYXJuZXNzRmlsdGVycyB7XG4gIHRleHQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uR3JvdXBIYXJuZXNzRmlsdGVycyBleHRlbmRzIEJhc2VIYXJuZXNzRmlsdGVycyB7XG4gIGxhYmVsVGV4dD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgdGhlIGBtYXQtb3B0aW9uYCBmb3IgYSBgbWF0LWF1dG9jb21wbGV0ZWAgaW4gdGVzdHMuXG4gKiBAZHluYW1pY1xuICovXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlT3B0aW9uSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtYXV0b2NvbXBsZXRlLXBhbmVsIC5tYXQtb3B0aW9uJztcblxuICBzdGF0aWMgd2l0aChvcHRpb25zOiBPcHRpb25IYXJuZXNzRmlsdGVycyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEF1dG9jb21wbGV0ZU9wdGlvbkhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3RleHQnLCBvcHRpb25zLnRleHQsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgdGl0bGUpID0+XG4gICAgICAgICAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGF3YWl0IGhhcm5lc3MuZ2V0VGV4dCgpLCB0aXRsZSkpO1xuICB9XG5cbiAgLyoqIENsaWNrcyB0aGUgb3B0aW9uLiAqL1xuICBhc3luYyBjbGljaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgb3B0aW9uJ3MgbGFiZWwgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxufVxuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSB0aGUgYG1hdC1vcHRncm91cGAgZm9yIGEgYG1hdC1hdXRvY29tcGxldGVgIGluIHRlc3RzLlxuICogQGR5bmFtaWNcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZU9wdGlvbkdyb3VwSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBwcml2YXRlIF9sYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1vcHRncm91cC1sYWJlbCcpO1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtYXV0b2NvbXBsZXRlLXBhbmVsIC5tYXQtb3B0Z3JvdXAnO1xuXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IE9wdGlvbkdyb3VwSGFybmVzc0ZpbHRlcnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRBdXRvY29tcGxldGVPcHRpb25Hcm91cEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ2xhYmVsVGV4dCcsIG9wdGlvbnMubGFiZWxUZXh0LFxuICAgICAgICAgICAgYXN5bmMgKGhhcm5lc3MsIHRpdGxlKSA9PlxuICAgICAgICAgICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhhd2FpdCBoYXJuZXNzLmdldExhYmVsVGV4dCgpLCB0aXRsZSkpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgb3B0aW9uIGdyb3VwJ3MgbGFiZWwgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0TGFiZWxUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9sYWJlbCgpKS50ZXh0KCk7XG4gIH1cbn1cblxuIl19