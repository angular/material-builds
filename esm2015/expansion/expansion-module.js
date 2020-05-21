/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatAccordion } from './accordion';
import { MatExpansionPanel, MatExpansionPanelActionRow } from './expansion-panel';
import { MatExpansionPanelContent } from './expansion-panel-content';
import { MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle, } from './expansion-panel-header';
let MatExpansionModule = /** @class */ (() => {
    let MatExpansionModule = class MatExpansionModule {
    };
    MatExpansionModule = __decorate([
        NgModule({
            imports: [CommonModule, CdkAccordionModule, PortalModule],
            exports: [
                MatAccordion,
                MatExpansionPanel,
                MatExpansionPanelActionRow,
                MatExpansionPanelHeader,
                MatExpansionPanelTitle,
                MatExpansionPanelDescription,
                MatExpansionPanelContent,
            ],
            declarations: [
                MatAccordion,
                MatExpansionPanel,
                MatExpansionPanelActionRow,
                MatExpansionPanelHeader,
                MatExpansionPanelTitle,
                MatExpansionPanelDescription,
                MatExpansionPanelContent,
            ],
        })
    ], MatExpansionModule);
    return MatExpansionModule;
})();
export { MatExpansionModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9leHBhbnNpb24vZXhwYW5zaW9uLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDMUQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFDLGlCQUFpQixFQUFFLDBCQUEwQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDaEYsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDbkUsT0FBTyxFQUNMLDRCQUE0QixFQUM1Qix1QkFBdUIsRUFDdkIsc0JBQXNCLEdBQ3ZCLE1BQU0sMEJBQTBCLENBQUM7QUF3QmxDO0lBQUEsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBa0I7S0FBRyxDQUFBO0lBQXJCLGtCQUFrQjtRQXJCOUIsUUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGtCQUFrQixFQUFFLFlBQVksQ0FBQztZQUN6RCxPQUFPLEVBQUU7Z0JBQ1AsWUFBWTtnQkFDWixpQkFBaUI7Z0JBQ2pCLDBCQUEwQjtnQkFDMUIsdUJBQXVCO2dCQUN2QixzQkFBc0I7Z0JBQ3RCLDRCQUE0QjtnQkFDNUIsd0JBQXdCO2FBQ3pCO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLFlBQVk7Z0JBQ1osaUJBQWlCO2dCQUNqQiwwQkFBMEI7Z0JBQzFCLHVCQUF1QjtnQkFDdkIsc0JBQXNCO2dCQUN0Qiw0QkFBNEI7Z0JBQzVCLHdCQUF3QjthQUN6QjtTQUNGLENBQUM7T0FDVyxrQkFBa0IsQ0FBRztJQUFELHlCQUFDO0tBQUE7U0FBckIsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2RrQWNjb3JkaW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvYWNjb3JkaW9uJztcbmltcG9ydCB7UG9ydGFsTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdEFjY29yZGlvbn0gZnJvbSAnLi9hY2NvcmRpb24nO1xuaW1wb3J0IHtNYXRFeHBhbnNpb25QYW5lbCwgTWF0RXhwYW5zaW9uUGFuZWxBY3Rpb25Sb3d9IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsJztcbmltcG9ydCB7TWF0RXhwYW5zaW9uUGFuZWxDb250ZW50fSBmcm9tICcuL2V4cGFuc2lvbi1wYW5lbC1jb250ZW50JztcbmltcG9ydCB7XG4gIE1hdEV4cGFuc2lvblBhbmVsRGVzY3JpcHRpb24sXG4gIE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyLFxuICBNYXRFeHBhbnNpb25QYW5lbFRpdGxlLFxufSBmcm9tICcuL2V4cGFuc2lvbi1wYW5lbC1oZWFkZXInO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIENka0FjY29yZGlvbk1vZHVsZSwgUG9ydGFsTW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIE1hdEFjY29yZGlvbixcbiAgICBNYXRFeHBhbnNpb25QYW5lbCxcbiAgICBNYXRFeHBhbnNpb25QYW5lbEFjdGlvblJvdyxcbiAgICBNYXRFeHBhbnNpb25QYW5lbEhlYWRlcixcbiAgICBNYXRFeHBhbnNpb25QYW5lbFRpdGxlLFxuICAgIE1hdEV4cGFuc2lvblBhbmVsRGVzY3JpcHRpb24sXG4gICAgTWF0RXhwYW5zaW9uUGFuZWxDb250ZW50LFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRBY2NvcmRpb24sXG4gICAgTWF0RXhwYW5zaW9uUGFuZWwsXG4gICAgTWF0RXhwYW5zaW9uUGFuZWxBY3Rpb25Sb3csXG4gICAgTWF0RXhwYW5zaW9uUGFuZWxIZWFkZXIsXG4gICAgTWF0RXhwYW5zaW9uUGFuZWxUaXRsZSxcbiAgICBNYXRFeHBhbnNpb25QYW5lbERlc2NyaXB0aW9uLFxuICAgIE1hdEV4cGFuc2lvblBhbmVsQ29udGVudCxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RXhwYW5zaW9uTW9kdWxlIHt9XG4iXX0=