/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatRadioButton, MatRadioGroup } from './radio';
let MatRadioModule = /** @class */ (() => {
    let MatRadioModule = class MatRadioModule {
    };
    MatRadioModule = __decorate([
        NgModule({
            imports: [MatRippleModule, MatCommonModule],
            exports: [MatRadioGroup, MatRadioButton, MatCommonModule],
            declarations: [MatRadioGroup, MatRadioButton],
        })
    ], MatRadioModule);
    return MatRadioModule;
})();
export { MatRadioModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8tbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3JhZGlvL3JhZGlvLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxjQUFjLEVBQUUsYUFBYSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBUXREO0lBQUEsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBYztLQUFHLENBQUE7SUFBakIsY0FBYztRQUwxQixRQUFRLENBQUM7WUFDUixPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDO1lBQzNDLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxjQUFjLEVBQUUsZUFBZSxDQUFDO1lBQ3pELFlBQVksRUFBRSxDQUFDLGFBQWEsRUFBRSxjQUFjLENBQUM7U0FDOUMsQ0FBQztPQUNXLGNBQWMsQ0FBRztJQUFELHFCQUFDO0tBQUE7U0FBakIsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRSYWRpb0J1dHRvbiwgTWF0UmFkaW9Hcm91cH0gZnJvbSAnLi9yYWRpbyc7XG5cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdFJpcHBsZU1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdFJhZGlvR3JvdXAsIE1hdFJhZGlvQnV0dG9uLCBNYXRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRSYWRpb0dyb3VwLCBNYXRSYWRpb0J1dHRvbl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFJhZGlvTW9kdWxlIHt9XG4iXX0=