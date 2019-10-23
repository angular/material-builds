/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/**
 * Harness for interacting with a the `mat-option` for a `mat-autocomplete` in tests.
 * @dynamic
 */
export class MatAutocompleteOptionHarness extends ComponentHarness {
    static with(options = {}) {
        return new HarnessPredicate(MatAutocompleteOptionHarness, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
    }
    /** Clicks the option. */
    select() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).click();
        });
    }
    /** Gets a promise for the option's label text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
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
            .addOption('labelText', options.labelText, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label));
    }
    /** Gets a promise for the option group's label text. */
    getLabelText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._label()).text();
        });
    }
}
MatAutocompleteOptionGroupHarness.hostSelector = '.mat-autocomplete-panel .mat-optgroup';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3Rpbmcvb3B0aW9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBcUIsTUFBTSxzQkFBc0IsQ0FBQztBQWE1Rjs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sNEJBQTZCLFNBQVEsZ0JBQWdCO0lBR2hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBZ0MsRUFBRTtRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsNEJBQTRCLEVBQUUsT0FBTyxDQUFDO2FBQzdELFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFDM0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUVELHlCQUF5QjtJQUNuQixNQUFNOztZQUNWLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3JDLENBQUM7S0FBQTtJQUVELGtEQUFrRDtJQUM1QyxPQUFPOztZQUNYLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BDLENBQUM7S0FBQTs7QUFoQk0seUNBQVksR0FBRyxxQ0FBcUMsQ0FBQztBQW1COUQ7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLGlDQUFrQyxTQUFRLGdCQUFnQjtJQUF2RTs7UUFDVSxXQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBYTFELENBQUM7SUFWQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXFDLEVBQUU7UUFDakQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGlDQUFpQyxFQUFFLE9BQU8sQ0FBQzthQUNsRSxTQUFTLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQ3JDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFFRCx3REFBd0Q7SUFDbEQsWUFBWTs7WUFDaEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEMsQ0FBQztLQUFBOztBQVhNLDhDQUFZLEdBQUcsdUNBQXVDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBCYXNlSGFybmVzc0ZpbHRlcnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcblxuLy8gVE9ETyhjcmlzYmV0byk6IGNvbWJpbmUgdGhlc2Ugd2l0aCB0aGUgb25lcyBpbiBgbWF0LXNlbGVjdGBcbi8vIGFuZCBleHBhbmQgdG8gY292ZXIgYWxsIHN0YXRlcyBvbmNlIHdlIGhhdmUgZXhwZXJpbWVudGFsL2NvcmUuXG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uSGFybmVzc0ZpbHRlcnMgZXh0ZW5kcyBCYXNlSGFybmVzc0ZpbHRlcnMge1xuICB0ZXh0Pzogc3RyaW5nIHwgUmVnRXhwO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbkdyb3VwSGFybmVzc0ZpbHRlcnMgZXh0ZW5kcyBCYXNlSGFybmVzc0ZpbHRlcnMge1xuICBsYWJlbFRleHQ/OiBzdHJpbmcgfCBSZWdFeHA7XG59XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHRoZSBgbWF0LW9wdGlvbmAgZm9yIGEgYG1hdC1hdXRvY29tcGxldGVgIGluIHRlc3RzLlxuICogQGR5bmFtaWNcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZU9wdGlvbkhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWF1dG9jb21wbGV0ZS1wYW5lbCAubWF0LW9wdGlvbic7XG5cbiAgc3RhdGljIHdpdGgob3B0aW9uczogT3B0aW9uSGFybmVzc0ZpbHRlcnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRBdXRvY29tcGxldGVPcHRpb25IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCkpO1xuICB9XG5cbiAgLyoqIENsaWNrcyB0aGUgb3B0aW9uLiAqL1xuICBhc3luYyBzZWxlY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIG9wdGlvbidzIGxhYmVsIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cbn1cblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgdGhlIGBtYXQtb3B0Z3JvdXBgIGZvciBhIGBtYXQtYXV0b2NvbXBsZXRlYCBpbiB0ZXN0cy5cbiAqIEBkeW5hbWljXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVPcHRpb25Hcm91cEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgcHJpdmF0ZSBfbGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtb3B0Z3JvdXAtbGFiZWwnKTtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWF1dG9jb21wbGV0ZS1wYW5lbCAubWF0LW9wdGdyb3VwJztcblxuICBzdGF0aWMgd2l0aChvcHRpb25zOiBPcHRpb25Hcm91cEhhcm5lc3NGaWx0ZXJzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0QXV0b2NvbXBsZXRlT3B0aW9uR3JvdXBIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCdsYWJlbFRleHQnLCBvcHRpb25zLmxhYmVsVGV4dCxcbiAgICAgICAgICAgIChoYXJuZXNzLCBsYWJlbCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWxUZXh0KCksIGxhYmVsKSk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBvcHRpb24gZ3JvdXAncyBsYWJlbCB0ZXh0LiAqL1xuICBhc3luYyBnZXRMYWJlbFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2xhYmVsKCkpLnRleHQoKTtcbiAgfVxufVxuIl19