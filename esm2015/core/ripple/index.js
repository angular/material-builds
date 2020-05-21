/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { PlatformModule } from '@angular/cdk/platform';
import { MatCommonModule } from '../common-behaviors/common-module';
import { MatRipple } from './ripple';
export * from './ripple';
export * from './ripple-ref';
export * from './ripple-renderer';
let MatRippleModule = /** @class */ (() => {
    let MatRippleModule = class MatRippleModule {
    };
    MatRippleModule = __decorate([
        NgModule({
            imports: [MatCommonModule, PlatformModule],
            exports: [MatRipple, MatCommonModule],
            declarations: [MatRipple],
        })
    ], MatRippleModule);
    return MatRippleModule;
})();
export { MatRippleModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9yaXBwbGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRW5DLGNBQWMsVUFBVSxDQUFDO0FBQ3pCLGNBQWMsY0FBYyxDQUFDO0FBQzdCLGNBQWMsbUJBQW1CLENBQUM7QUFPbEM7SUFBQSxJQUFhLGVBQWUsR0FBNUIsTUFBYSxlQUFlO0tBQUcsQ0FBQTtJQUFsQixlQUFlO1FBTDNCLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUM7WUFDMUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQztZQUNyQyxZQUFZLEVBQUUsQ0FBQyxTQUFTLENBQUM7U0FDMUIsQ0FBQztPQUNXLGVBQWUsQ0FBRztJQUFELHNCQUFDO0tBQUE7U0FBbEIsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGxhdGZvcm1Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnLi4vY29tbW9uLWJlaGF2aW9ycy9jb21tb24tbW9kdWxlJztcbmltcG9ydCB7TWF0UmlwcGxlfSBmcm9tICcuL3JpcHBsZSc7XG5cbmV4cG9ydCAqIGZyb20gJy4vcmlwcGxlJztcbmV4cG9ydCAqIGZyb20gJy4vcmlwcGxlLXJlZic7XG5leHBvcnQgKiBmcm9tICcuL3JpcHBsZS1yZW5kZXJlcic7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRDb21tb25Nb2R1bGUsIFBsYXRmb3JtTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdFJpcHBsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0UmlwcGxlXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0UmlwcGxlTW9kdWxlIHt9XG4iXX0=