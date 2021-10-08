/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatPseudoCheckbox } from './pseudo-checkbox/pseudo-checkbox';
import { MatCommonModule } from '../common-behaviors/common-module';
import * as i0 from "@angular/core";
export class MatPseudoCheckboxModule {
}
MatPseudoCheckboxModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatPseudoCheckboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatPseudoCheckboxModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatPseudoCheckboxModule, declarations: [MatPseudoCheckbox], imports: [MatCommonModule], exports: [MatPseudoCheckbox] });
MatPseudoCheckboxModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatPseudoCheckboxModule, imports: [[MatCommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatPseudoCheckboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule],
                    exports: [MatPseudoCheckbox],
                    declarations: [MatPseudoCheckbox]
                }]
        }] });
export * from './pseudo-checkbox/pseudo-checkbox';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9zZWxlY3Rpb24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNwRSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sbUNBQW1DLENBQUM7O0FBUWxFLE1BQU0sT0FBTyx1QkFBdUI7OzRIQUF2Qix1QkFBdUI7NkhBQXZCLHVCQUF1QixpQkFGbkIsaUJBQWlCLGFBRnRCLGVBQWUsYUFDZixpQkFBaUI7NkhBR2hCLHVCQUF1QixZQUp6QixDQUFDLGVBQWUsQ0FBQzttR0FJZix1QkFBdUI7a0JBTG5DLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO29CQUMxQixPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDNUIsWUFBWSxFQUFFLENBQUMsaUJBQWlCLENBQUM7aUJBQ2xDOztBQUlELGNBQWMsbUNBQW1DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdFBzZXVkb0NoZWNrYm94fSBmcm9tICcuL3BzZXVkby1jaGVja2JveC9wc2V1ZG8tY2hlY2tib3gnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJy4uL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZSc7XG5cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRQc2V1ZG9DaGVja2JveF0sXG4gIGRlY2xhcmF0aW9uczogW01hdFBzZXVkb0NoZWNrYm94XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRQc2V1ZG9DaGVja2JveE1vZHVsZSB7IH1cblxuXG5leHBvcnQgKiBmcm9tICcuL3BzZXVkby1jaGVja2JveC9wc2V1ZG8tY2hlY2tib3gnO1xuIl19