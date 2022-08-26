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
MatMenuModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatMenuModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.0", ngImport: i0, type: MatMenuModule, declarations: [MatMenu, MatMenuItem, MatMenuTrigger, MatMenuContent], imports: [CommonModule, MatCommonModule, MatRippleModule, OverlayModule], exports: [CdkScrollableModule,
        MatCommonModule,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        MatMenuContent] });
MatMenuModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatMenuModule, providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [CommonModule, MatCommonModule, MatRippleModule, OverlayModule, CdkScrollableModule,
        MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatCommonModule, MatRippleModule, OverlayModule],
                    exports: [
                        CdkScrollableModule,
                        MatCommonModule,
                        MatMenu,
                        MatMenuItem,
                        MatMenuTrigger,
                        MatMenuContent,
                    ],
                    declarations: [MatMenu, MatMenuItem, MatMenuTrigger, MatMenuContent],
                    providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbWVudS9tZW51LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyx5Q0FBeUMsRUFBRSxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFlekYsTUFBTSxPQUFPLGFBQWE7OzBHQUFiLGFBQWE7MkdBQWIsYUFBYSxpQkFIVCxPQUFPLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxjQUFjLGFBVHpELFlBQVksRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGFBQWEsYUFFckUsbUJBQW1CO1FBQ25CLGVBQWU7UUFDZixPQUFPO1FBQ1AsV0FBVztRQUNYLGNBQWM7UUFDZCxjQUFjOzJHQUtMLGFBQWEsYUFGYixDQUFDLHlDQUF5QyxDQUFDLFlBVjVDLFlBQVksRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFFckUsbUJBQW1CO1FBQ25CLGVBQWU7MkZBU04sYUFBYTtrQkFiekIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxhQUFhLENBQUM7b0JBQ3hFLE9BQU8sRUFBRTt3QkFDUCxtQkFBbUI7d0JBQ25CLGVBQWU7d0JBQ2YsT0FBTzt3QkFDUCxXQUFXO3dCQUNYLGNBQWM7d0JBQ2QsY0FBYztxQkFDZjtvQkFDRCxZQUFZLEVBQUUsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUM7b0JBQ3BFLFNBQVMsRUFBRSxDQUFDLHlDQUF5QyxDQUFDO2lCQUN2RCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge092ZXJsYXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge01hdE1lbnV9IGZyb20gJy4vbWVudSc7XG5pbXBvcnQge01hdE1lbnVDb250ZW50fSBmcm9tICcuL21lbnUtY29udGVudCc7XG5pbXBvcnQge01hdE1lbnVJdGVtfSBmcm9tICcuL21lbnUtaXRlbSc7XG5pbXBvcnQge01BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSLCBNYXRNZW51VHJpZ2dlcn0gZnJvbSAnLi9tZW51LXRyaWdnZXInO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBNYXRDb21tb25Nb2R1bGUsIE1hdFJpcHBsZU1vZHVsZSwgT3ZlcmxheU1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBDZGtTY3JvbGxhYmxlTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXRNZW51LFxuICAgIE1hdE1lbnVJdGVtLFxuICAgIE1hdE1lbnVUcmlnZ2VyLFxuICAgIE1hdE1lbnVDb250ZW50LFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRNZW51LCBNYXRNZW51SXRlbSwgTWF0TWVudVRyaWdnZXIsIE1hdE1lbnVDb250ZW50XSxcbiAgcHJvdmlkZXJzOiBbTUFUX01FTlVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVJdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRNZW51TW9kdWxlIHt9XG4iXX0=