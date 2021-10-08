/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatMenu } from './menu';
import { MatMenuContent } from './menu-content';
import { MatMenuItem } from './menu-item';
import { MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER, MatMenuTrigger } from './menu-trigger';
import * as i0 from "@angular/core";
export class MatMenuModule {
}
MatMenuModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatMenuModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatMenuModule, declarations: [MatMenu, MatMenuItem, MatMenuTrigger, MatMenuContent], imports: [CommonModule,
        MatCommonModule,
        MatRippleModule,
        OverlayModule], exports: [CdkScrollableModule,
        MatCommonModule,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        MatMenuContent] });
MatMenuModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatMenuModule, providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [[
            CommonModule,
            MatCommonModule,
            MatRippleModule,
            OverlayModule,
        ], CdkScrollableModule,
        MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        MatCommonModule,
                        MatRippleModule,
                        OverlayModule,
                    ],
                    exports: [
                        CdkScrollableModule,
                        MatCommonModule,
                        MatMenu,
                        MatMenuItem,
                        MatMenuTrigger,
                        MatMenuContent
                    ],
                    declarations: [MatMenu, MatMenuItem, MatMenuTrigger, MatMenuContent],
                    providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbWVudS9tZW51LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyx5Q0FBeUMsRUFBRSxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFvQnpGLE1BQU0sT0FBTyxhQUFhOztrSEFBYixhQUFhO21IQUFiLGFBQWEsaUJBSFQsT0FBTyxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsY0FBYyxhQWJqRSxZQUFZO1FBQ1osZUFBZTtRQUNmLGVBQWU7UUFDZixhQUFhLGFBR2IsbUJBQW1CO1FBQ25CLGVBQWU7UUFDZixPQUFPO1FBQ1AsV0FBVztRQUNYLGNBQWM7UUFDZCxjQUFjO21IQUtMLGFBQWEsYUFGYixDQUFDLHlDQUF5QyxDQUFDLFlBZjdDO1lBQ1AsWUFBWTtZQUNaLGVBQWU7WUFDZixlQUFlO1lBQ2YsYUFBYTtTQUNkLEVBRUMsbUJBQW1CO1FBQ25CLGVBQWU7bUdBU04sYUFBYTtrQkFsQnpCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixlQUFlO3dCQUNmLGFBQWE7cUJBQ2Q7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLG1CQUFtQjt3QkFDbkIsZUFBZTt3QkFDZixPQUFPO3dCQUNQLFdBQVc7d0JBQ1gsY0FBYzt3QkFDZCxjQUFjO3FCQUNmO29CQUNELFlBQVksRUFBRSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQztvQkFDcEUsU0FBUyxFQUFFLENBQUMseUNBQXlDLENBQUM7aUJBQ3ZEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T3ZlcmxheU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtDZGtTY3JvbGxhYmxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7TWF0TWVudX0gZnJvbSAnLi9tZW51JztcbmltcG9ydCB7TWF0TWVudUNvbnRlbnR9IGZyb20gJy4vbWVudS1jb250ZW50JztcbmltcG9ydCB7TWF0TWVudUl0ZW19IGZyb20gJy4vbWVudS1pdGVtJztcbmltcG9ydCB7TUFUX01FTlVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIsIE1hdE1lbnVUcmlnZ2VyfSBmcm9tICcuL21lbnUtdHJpZ2dlcic7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE1hdFJpcHBsZU1vZHVsZSxcbiAgICBPdmVybGF5TW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgQ2RrU2Nyb2xsYWJsZU1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgTWF0TWVudSxcbiAgICBNYXRNZW51SXRlbSxcbiAgICBNYXRNZW51VHJpZ2dlcixcbiAgICBNYXRNZW51Q29udGVudFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRNZW51LCBNYXRNZW51SXRlbSwgTWF0TWVudVRyaWdnZXIsIE1hdE1lbnVDb250ZW50XSxcbiAgcHJvdmlkZXJzOiBbTUFUX01FTlVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVJdXG59KVxuZXhwb3J0IGNsYXNzIE1hdE1lbnVNb2R1bGUge31cbiJdfQ==