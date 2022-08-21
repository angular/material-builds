/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import { MAT_TAB_LABEL, MatTabLabel as MatNonLegacyTabLabel } from '@angular/material/tabs';
import * as i0 from "@angular/core";
/** Used to flag tab labels for use with the portal directive */
export class MatLegacyTabLabel extends MatNonLegacyTabLabel {
}
MatLegacyTabLabel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyTabLabel, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatLegacyTabLabel.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatLegacyTabLabel, selector: "[mat-tab-label], [matTabLabel]", providers: [{ provide: MAT_TAB_LABEL, useExisting: MatLegacyTabLabel }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacyTabLabel, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-tab-label], [matTabLabel]',
                    providers: [{ provide: MAT_TAB_LABEL, useExisting: MatLegacyTabLabel }],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWxhYmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS10YWJzL3RhYi1sYWJlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxhQUFhLEVBQUUsV0FBVyxJQUFJLG9CQUFvQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7O0FBRTFGLGdFQUFnRTtBQUtoRSxNQUFNLE9BQU8saUJBQWtCLFNBQVEsb0JBQW9COzttSEFBOUMsaUJBQWlCO3VHQUFqQixpQkFBaUIseURBRmpCLENBQUMsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQyxDQUFDO2dHQUUxRCxpQkFBaUI7a0JBSjdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGdDQUFnQztvQkFDMUMsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFdBQVcsbUJBQW1CLEVBQUMsQ0FBQztpQkFDdEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNQVRfVEFCX0xBQkVMLCBNYXRUYWJMYWJlbCBhcyBNYXROb25MZWdhY3lUYWJMYWJlbH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdGFicyc7XG5cbi8qKiBVc2VkIHRvIGZsYWcgdGFiIGxhYmVscyBmb3IgdXNlIHdpdGggdGhlIHBvcnRhbCBkaXJlY3RpdmUgKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtdGFiLWxhYmVsXSwgW21hdFRhYkxhYmVsXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfVEFCX0xBQkVMLCB1c2VFeGlzdGluZzogTWF0TGVnYWN5VGFiTGFiZWx9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5VGFiTGFiZWwgZXh0ZW5kcyBNYXROb25MZWdhY3lUYWJMYWJlbCB7fVxuIl19