/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { PlatformModule } from '@angular/cdk/platform';
import { MatCommonModule } from '../common-behaviors/common-module';
import { MatRipple } from './ripple';
import * as i0 from "@angular/core";
export * from './ripple';
export * from './ripple-ref';
export * from './ripple-renderer';
export class MatRippleModule {
}
MatRippleModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: MatRippleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatRippleModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: MatRippleModule, declarations: [MatRipple], imports: [MatCommonModule, PlatformModule], exports: [MatRipple, MatCommonModule] });
MatRippleModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: MatRippleModule, imports: [[MatCommonModule, PlatformModule], MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: MatRippleModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, PlatformModule],
                    exports: [MatRipple, MatCommonModule],
                    declarations: [MatRipple],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9yaXBwbGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7O0FBRW5DLGNBQWMsVUFBVSxDQUFDO0FBQ3pCLGNBQWMsY0FBYyxDQUFDO0FBQzdCLGNBQWMsbUJBQW1CLENBQUM7QUFPbEMsTUFBTSxPQUFPLGVBQWU7OzRHQUFmLGVBQWU7NkdBQWYsZUFBZSxpQkFGWCxTQUFTLGFBRmQsZUFBZSxFQUFFLGNBQWMsYUFDL0IsU0FBUyxFQUFFLGVBQWU7NkdBR3pCLGVBQWUsWUFKakIsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLEVBQ3JCLGVBQWU7MkZBR3pCLGVBQWU7a0JBTDNCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLGNBQWMsQ0FBQztvQkFDMUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQztvQkFDckMsWUFBWSxFQUFFLENBQUMsU0FBUyxDQUFDO2lCQUMxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGxhdGZvcm1Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnLi4vY29tbW9uLWJlaGF2aW9ycy9jb21tb24tbW9kdWxlJztcbmltcG9ydCB7TWF0UmlwcGxlfSBmcm9tICcuL3JpcHBsZSc7XG5cbmV4cG9ydCAqIGZyb20gJy4vcmlwcGxlJztcbmV4cG9ydCAqIGZyb20gJy4vcmlwcGxlLXJlZic7XG5leHBvcnQgKiBmcm9tICcuL3JpcHBsZS1yZW5kZXJlcic7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRDb21tb25Nb2R1bGUsIFBsYXRmb3JtTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdFJpcHBsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0UmlwcGxlXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0UmlwcGxlTW9kdWxlIHt9XG4iXX0=