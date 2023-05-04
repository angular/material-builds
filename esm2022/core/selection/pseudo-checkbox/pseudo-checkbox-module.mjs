/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatPseudoCheckbox } from './pseudo-checkbox';
import { MatCommonModule } from '../../common-behaviors/common-module';
import * as i0 from "@angular/core";
class MatPseudoCheckboxModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatPseudoCheckboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatPseudoCheckboxModule, declarations: [MatPseudoCheckbox], imports: [MatCommonModule], exports: [MatPseudoCheckbox] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatPseudoCheckboxModule, imports: [MatCommonModule] }); }
}
export { MatPseudoCheckboxModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatPseudoCheckboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule],
                    exports: [MatPseudoCheckbox],
                    declarations: [MatPseudoCheckbox],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHNldWRvLWNoZWNrYm94LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3NlbGVjdGlvbi9wc2V1ZG8tY2hlY2tib3gvcHNldWRvLWNoZWNrYm94LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQzs7QUFFckUsTUFLYSx1QkFBdUI7OEdBQXZCLHVCQUF1QjsrR0FBdkIsdUJBQXVCLGlCQUZuQixpQkFBaUIsYUFGdEIsZUFBZSxhQUNmLGlCQUFpQjsrR0FHaEIsdUJBQXVCLFlBSnhCLGVBQWU7O1NBSWQsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBTG5DLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO29CQUMxQixPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDNUIsWUFBWSxFQUFFLENBQUMsaUJBQWlCLENBQUM7aUJBQ2xDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRQc2V1ZG9DaGVja2JveH0gZnJvbSAnLi9wc2V1ZG8tY2hlY2tib3gnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJy4uLy4uL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbTWF0UHNldWRvQ2hlY2tib3hdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRQc2V1ZG9DaGVja2JveF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFBzZXVkb0NoZWNrYm94TW9kdWxlIHt9XG4iXX0=