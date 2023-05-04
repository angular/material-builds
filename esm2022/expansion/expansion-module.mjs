/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatAccordion } from './accordion';
import { MatExpansionPanel, MatExpansionPanelActionRow } from './expansion-panel';
import { MatExpansionPanelContent } from './expansion-panel-content';
import { MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle, } from './expansion-panel-header';
import * as i0 from "@angular/core";
class MatExpansionModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatExpansionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatExpansionModule, declarations: [MatAccordion,
            MatExpansionPanel,
            MatExpansionPanelActionRow,
            MatExpansionPanelHeader,
            MatExpansionPanelTitle,
            MatExpansionPanelDescription,
            MatExpansionPanelContent], imports: [CommonModule, MatCommonModule, CdkAccordionModule, PortalModule], exports: [MatAccordion,
            MatExpansionPanel,
            MatExpansionPanelActionRow,
            MatExpansionPanelHeader,
            MatExpansionPanelTitle,
            MatExpansionPanelDescription,
            MatExpansionPanelContent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatExpansionModule, imports: [CommonModule, MatCommonModule, CdkAccordionModule, PortalModule] }); }
}
export { MatExpansionModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatExpansionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatCommonModule, CdkAccordionModule, PortalModule],
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
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9leHBhbnNpb24vZXhwYW5zaW9uLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDakQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFDLGlCQUFpQixFQUFFLDBCQUEwQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDaEYsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDbkUsT0FBTyxFQUNMLDRCQUE0QixFQUM1Qix1QkFBdUIsRUFDdkIsc0JBQXNCLEdBQ3ZCLE1BQU0sMEJBQTBCLENBQUM7O0FBRWxDLE1BcUJhLGtCQUFrQjs4R0FBbEIsa0JBQWtCOytHQUFsQixrQkFBa0IsaUJBVDNCLFlBQVk7WUFDWixpQkFBaUI7WUFDakIsMEJBQTBCO1lBQzFCLHVCQUF1QjtZQUN2QixzQkFBc0I7WUFDdEIsNEJBQTRCO1lBQzVCLHdCQUF3QixhQWpCaEIsWUFBWSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxZQUFZLGFBRXZFLFlBQVk7WUFDWixpQkFBaUI7WUFDakIsMEJBQTBCO1lBQzFCLHVCQUF1QjtZQUN2QixzQkFBc0I7WUFDdEIsNEJBQTRCO1lBQzVCLHdCQUF3QjsrR0FZZixrQkFBa0IsWUFwQm5CLFlBQVksRUFBRSxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsWUFBWTs7U0FvQjlELGtCQUFrQjsyRkFBbEIsa0JBQWtCO2tCQXJCOUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLFlBQVksQ0FBQztvQkFDMUUsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osaUJBQWlCO3dCQUNqQiwwQkFBMEI7d0JBQzFCLHVCQUF1Qjt3QkFDdkIsc0JBQXNCO3dCQUN0Qiw0QkFBNEI7d0JBQzVCLHdCQUF3QjtxQkFDekI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLFlBQVk7d0JBQ1osaUJBQWlCO3dCQUNqQiwwQkFBMEI7d0JBQzFCLHVCQUF1Qjt3QkFDdkIsc0JBQXNCO3dCQUN0Qiw0QkFBNEI7d0JBQzVCLHdCQUF3QjtxQkFDekI7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDZGtBY2NvcmRpb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hY2NvcmRpb24nO1xuaW1wb3J0IHtQb3J0YWxNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0QWNjb3JkaW9ufSBmcm9tICcuL2FjY29yZGlvbic7XG5pbXBvcnQge01hdEV4cGFuc2lvblBhbmVsLCBNYXRFeHBhbnNpb25QYW5lbEFjdGlvblJvd30gZnJvbSAnLi9leHBhbnNpb24tcGFuZWwnO1xuaW1wb3J0IHtNYXRFeHBhbnNpb25QYW5lbENvbnRlbnR9IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsLWNvbnRlbnQnO1xuaW1wb3J0IHtcbiAgTWF0RXhwYW5zaW9uUGFuZWxEZXNjcmlwdGlvbixcbiAgTWF0RXhwYW5zaW9uUGFuZWxIZWFkZXIsXG4gIE1hdEV4cGFuc2lvblBhbmVsVGl0bGUsXG59IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsLWhlYWRlcic7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE1hdENvbW1vbk1vZHVsZSwgQ2RrQWNjb3JkaW9uTW9kdWxlLCBQb3J0YWxNb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgTWF0QWNjb3JkaW9uLFxuICAgIE1hdEV4cGFuc2lvblBhbmVsLFxuICAgIE1hdEV4cGFuc2lvblBhbmVsQWN0aW9uUm93LFxuICAgIE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyLFxuICAgIE1hdEV4cGFuc2lvblBhbmVsVGl0bGUsXG4gICAgTWF0RXhwYW5zaW9uUGFuZWxEZXNjcmlwdGlvbixcbiAgICBNYXRFeHBhbnNpb25QYW5lbENvbnRlbnQsXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE1hdEFjY29yZGlvbixcbiAgICBNYXRFeHBhbnNpb25QYW5lbCxcbiAgICBNYXRFeHBhbnNpb25QYW5lbEFjdGlvblJvdyxcbiAgICBNYXRFeHBhbnNpb25QYW5lbEhlYWRlcixcbiAgICBNYXRFeHBhbnNpb25QYW5lbFRpdGxlLFxuICAgIE1hdEV4cGFuc2lvblBhbmVsRGVzY3JpcHRpb24sXG4gICAgTWF0RXhwYW5zaW9uUGFuZWxDb250ZW50LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25Nb2R1bGUge31cbiJdfQ==