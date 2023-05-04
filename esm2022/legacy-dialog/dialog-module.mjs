/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DialogModule } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MAT_LEGACY_DIALOG_SCROLL_STRATEGY_PROVIDER, MatLegacyDialog } from './dialog';
import { MatLegacyDialogContainer } from './dialog-container';
import { MatLegacyDialogActions, MatLegacyDialogClose, MatLegacyDialogContent, MatLegacyDialogTitle, } from './dialog-content-directives';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatDialogModule` from `@angular/material/dialog` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyDialogModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyDialogModule, declarations: [MatLegacyDialogContainer,
            MatLegacyDialogClose,
            MatLegacyDialogTitle,
            MatLegacyDialogActions,
            MatLegacyDialogContent], imports: [DialogModule, OverlayModule, PortalModule, MatCommonModule], exports: [MatLegacyDialogContainer,
            MatLegacyDialogClose,
            MatLegacyDialogTitle,
            MatLegacyDialogContent,
            MatLegacyDialogActions,
            MatCommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyDialogModule, providers: [MatLegacyDialog, MAT_LEGACY_DIALOG_SCROLL_STRATEGY_PROVIDER], imports: [DialogModule, OverlayModule, PortalModule, MatCommonModule, MatCommonModule] }); }
}
export { MatLegacyDialogModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [DialogModule, OverlayModule, PortalModule, MatCommonModule],
                    exports: [
                        MatLegacyDialogContainer,
                        MatLegacyDialogClose,
                        MatLegacyDialogTitle,
                        MatLegacyDialogContent,
                        MatLegacyDialogActions,
                        MatCommonModule,
                    ],
                    declarations: [
                        MatLegacyDialogContainer,
                        MatLegacyDialogClose,
                        MatLegacyDialogTitle,
                        MatLegacyDialogActions,
                        MatLegacyDialogContent,
                    ],
                    providers: [MatLegacyDialog, MAT_LEGACY_DIALOG_SCROLL_STRATEGY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktZGlhbG9nL2RpYWxvZy1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDakQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLDBDQUEwQyxFQUFFLGVBQWUsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNyRixPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUM1RCxPQUFPLEVBQ0wsc0JBQXNCLEVBQ3RCLG9CQUFvQixFQUNwQixzQkFBc0IsRUFDdEIsb0JBQW9CLEdBQ3JCLE1BQU0sNkJBQTZCLENBQUM7O0FBRXJDOzs7R0FHRztBQUNILE1BbUJhLHFCQUFxQjs4R0FBckIscUJBQXFCOytHQUFyQixxQkFBcUIsaUJBUjlCLHdCQUF3QjtZQUN4QixvQkFBb0I7WUFDcEIsb0JBQW9CO1lBQ3BCLHNCQUFzQjtZQUN0QixzQkFBc0IsYUFkZCxZQUFZLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxlQUFlLGFBRWxFLHdCQUF3QjtZQUN4QixvQkFBb0I7WUFDcEIsb0JBQW9CO1lBQ3BCLHNCQUFzQjtZQUN0QixzQkFBc0I7WUFDdEIsZUFBZTsrR0FXTixxQkFBcUIsYUFGckIsQ0FBQyxlQUFlLEVBQUUsMENBQTBDLENBQUMsWUFoQjlELFlBQVksRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFPbEUsZUFBZTs7U0FXTixxQkFBcUI7MkZBQXJCLHFCQUFxQjtrQkFuQmpDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDO29CQUNyRSxPQUFPLEVBQUU7d0JBQ1Asd0JBQXdCO3dCQUN4QixvQkFBb0I7d0JBQ3BCLG9CQUFvQjt3QkFDcEIsc0JBQXNCO3dCQUN0QixzQkFBc0I7d0JBQ3RCLGVBQWU7cUJBQ2hCO29CQUNELFlBQVksRUFBRTt3QkFDWix3QkFBd0I7d0JBQ3hCLG9CQUFvQjt3QkFDcEIsb0JBQW9CO3dCQUNwQixzQkFBc0I7d0JBQ3RCLHNCQUFzQjtxQkFDdkI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsZUFBZSxFQUFFLDBDQUEwQyxDQUFDO2lCQUN6RSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpYWxvZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2RpYWxvZyc7XG5pbXBvcnQge092ZXJsYXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7UG9ydGFsTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNQVRfTEVHQUNZX0RJQUxPR19TQ1JPTExfU1RSQVRFR1lfUFJPVklERVIsIE1hdExlZ2FjeURpYWxvZ30gZnJvbSAnLi9kaWFsb2cnO1xuaW1wb3J0IHtNYXRMZWdhY3lEaWFsb2dDb250YWluZXJ9IGZyb20gJy4vZGlhbG9nLWNvbnRhaW5lcic7XG5pbXBvcnQge1xuICBNYXRMZWdhY3lEaWFsb2dBY3Rpb25zLFxuICBNYXRMZWdhY3lEaWFsb2dDbG9zZSxcbiAgTWF0TGVnYWN5RGlhbG9nQ29udGVudCxcbiAgTWF0TGVnYWN5RGlhbG9nVGl0bGUsXG59IGZyb20gJy4vZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcyc7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXREaWFsb2dNb2R1bGVgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2RpYWxvZ2AgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbRGlhbG9nTW9kdWxlLCBPdmVybGF5TW9kdWxlLCBQb3J0YWxNb2R1bGUsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBNYXRMZWdhY3lEaWFsb2dDb250YWluZXIsXG4gICAgTWF0TGVnYWN5RGlhbG9nQ2xvc2UsXG4gICAgTWF0TGVnYWN5RGlhbG9nVGl0bGUsXG4gICAgTWF0TGVnYWN5RGlhbG9nQ29udGVudCxcbiAgICBNYXRMZWdhY3lEaWFsb2dBY3Rpb25zLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0TGVnYWN5RGlhbG9nQ29udGFpbmVyLFxuICAgIE1hdExlZ2FjeURpYWxvZ0Nsb3NlLFxuICAgIE1hdExlZ2FjeURpYWxvZ1RpdGxlLFxuICAgIE1hdExlZ2FjeURpYWxvZ0FjdGlvbnMsXG4gICAgTWF0TGVnYWN5RGlhbG9nQ29udGVudCxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbTWF0TGVnYWN5RGlhbG9nLCBNQVRfTEVHQUNZX0RJQUxPR19TQ1JPTExfU1RSQVRFR1lfUFJPVklERVJdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lEaWFsb2dNb2R1bGUge31cbiJdfQ==