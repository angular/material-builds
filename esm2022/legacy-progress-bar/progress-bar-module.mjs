/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material/core';
import { MatLegacyProgressBar } from './progress-bar';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatProgressBarModule` from `@angular/material/progress-bar` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyProgressBarModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyProgressBarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyProgressBarModule, declarations: [MatLegacyProgressBar], imports: [CommonModule, MatCommonModule], exports: [MatLegacyProgressBar, MatCommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyProgressBarModule, imports: [CommonModule, MatCommonModule, MatCommonModule] }); }
}
export { MatLegacyProgressBarModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyProgressBarModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatCommonModule],
                    exports: [MatLegacyProgressBar, MatCommonModule],
                    declarations: [MatLegacyProgressBar],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtYmFyLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktcHJvZ3Jlc3MtYmFyL3Byb2dyZXNzLWJhci1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDOztBQUVwRDs7O0dBR0c7QUFDSCxNQUthLDBCQUEwQjs4R0FBMUIsMEJBQTBCOytHQUExQiwwQkFBMEIsaUJBRnRCLG9CQUFvQixhQUZ6QixZQUFZLEVBQUUsZUFBZSxhQUM3QixvQkFBb0IsRUFBRSxlQUFlOytHQUdwQywwQkFBMEIsWUFKM0IsWUFBWSxFQUFFLGVBQWUsRUFDUCxlQUFlOztTQUdwQywwQkFBMEI7MkZBQTFCLDBCQUEwQjtrQkFMdEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDO29CQUN4QyxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxlQUFlLENBQUM7b0JBQ2hELFlBQVksRUFBRSxDQUFDLG9CQUFvQixDQUFDO2lCQUNyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRMZWdhY3lQcm9ncmVzc0Jhcn0gZnJvbSAnLi9wcm9ncmVzcy1iYXInO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0UHJvZ3Jlc3NCYXJNb2R1bGVgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3Byb2dyZXNzLWJhcmAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbTWF0TGVnYWN5UHJvZ3Jlc3NCYXIsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW01hdExlZ2FjeVByb2dyZXNzQmFyXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5UHJvZ3Jlc3NCYXJNb2R1bGUge31cbiJdfQ==