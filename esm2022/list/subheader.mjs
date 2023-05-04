/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
class MatListSubheaderCssMatStyler {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatListSubheaderCssMatStyler, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatListSubheaderCssMatStyler, selector: "[mat-subheader], [matSubheader]", host: { classAttribute: "mat-mdc-subheader mdc-list-group__subheader" }, ngImport: i0 }); }
}
export { MatListSubheaderCssMatStyler };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatListSubheaderCssMatStyler, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-subheader], [matSubheader]',
                    // TODO(mmalerba): MDC's subheader font looks identical to the list item font, figure out why and
                    //  make a change in one of the repos to visually distinguish.
                    host: { 'class': 'mat-mdc-subheader mdc-list-group__subheader' },
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xpc3Qvc3ViaGVhZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBRXhDOzs7R0FHRztBQUNILE1BTWEsNEJBQTRCOzhHQUE1Qiw0QkFBNEI7a0dBQTVCLDRCQUE0Qjs7U0FBNUIsNEJBQTRCOzJGQUE1Qiw0QkFBNEI7a0JBTnhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlDQUFpQztvQkFDM0MsaUdBQWlHO29CQUNqRyw4REFBOEQ7b0JBQzlELElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSw2Q0FBNkMsRUFBQztpQkFDL0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIERpcmVjdGl2ZSB3aG9zZSBwdXJwb3NlIGlzIHRvIGFkZCB0aGUgbWF0LSBDU1Mgc3R5bGluZyB0byB0aGlzIHNlbGVjdG9yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LXN1YmhlYWRlcl0sIFttYXRTdWJoZWFkZXJdJyxcbiAgLy8gVE9ETyhtbWFsZXJiYSk6IE1EQydzIHN1YmhlYWRlciBmb250IGxvb2tzIGlkZW50aWNhbCB0byB0aGUgbGlzdCBpdGVtIGZvbnQsIGZpZ3VyZSBvdXQgd2h5IGFuZFxuICAvLyAgbWFrZSBhIGNoYW5nZSBpbiBvbmUgb2YgdGhlIHJlcG9zIHRvIHZpc3VhbGx5IGRpc3Rpbmd1aXNoLlxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1tZGMtc3ViaGVhZGVyIG1kYy1saXN0LWdyb3VwX19zdWJoZWFkZXInfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGlzdFN1YmhlYWRlckNzc01hdFN0eWxlciB7fVxuIl19