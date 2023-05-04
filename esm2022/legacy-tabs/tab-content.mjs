/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import { MAT_TAB_CONTENT, MatTabContent as MatNonLegacyTabContent } from '@angular/material/tabs';
import * as i0 from "@angular/core";
/**
 * Decorates the `ng-template` tags and reads out the template from it.
 * @deprecated Use `MatTabContent` from `@angular/material/tabs` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyTabContent extends MatNonLegacyTabContent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTabContent, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyTabContent, selector: "[matTabContent]", providers: [{ provide: MAT_TAB_CONTENT, useExisting: MatLegacyTabContent }], usesInheritance: true, ngImport: i0 }); }
}
export { MatLegacyTabContent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTabContent, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTabContent]',
                    providers: [{ provide: MAT_TAB_CONTENT, useExisting: MatLegacyTabContent }],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWNvbnRlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LXRhYnMvdGFiLWNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN4QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsSUFBSSxzQkFBc0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDOztBQUVoRzs7OztHQUlHO0FBQ0gsTUFJYSxtQkFBb0IsU0FBUSxzQkFBc0I7OEdBQWxELG1CQUFtQjtrR0FBbkIsbUJBQW1CLDBDQUZuQixDQUFDLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQzs7U0FFOUQsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBSi9CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcscUJBQXFCLEVBQUMsQ0FBQztpQkFDMUUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNQVRfVEFCX0NPTlRFTlQsIE1hdFRhYkNvbnRlbnQgYXMgTWF0Tm9uTGVnYWN5VGFiQ29udGVudH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdGFicyc7XG5cbi8qKlxuICogRGVjb3JhdGVzIHRoZSBgbmctdGVtcGxhdGVgIHRhZ3MgYW5kIHJlYWRzIG91dCB0aGUgdGVtcGxhdGUgZnJvbSBpdC5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0VGFiQ29udGVudGAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvdGFic2AgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VGFiQ29udGVudF0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1RBQl9DT05URU5ULCB1c2VFeGlzdGluZzogTWF0TGVnYWN5VGFiQ29udGVudH1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lUYWJDb250ZW50IGV4dGVuZHMgTWF0Tm9uTGVnYWN5VGFiQ29udGVudCB7fVxuIl19