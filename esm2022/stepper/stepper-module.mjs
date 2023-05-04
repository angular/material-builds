/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { PortalModule } from '@angular/cdk/portal';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ErrorStateMatcher, MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepHeader } from './step-header';
import { MatStepLabel } from './step-label';
import { MatStep, MatStepper } from './stepper';
import { MatStepperNext, MatStepperPrevious } from './stepper-button';
import { MatStepperIcon } from './stepper-icon';
import { MAT_STEPPER_INTL_PROVIDER } from './stepper-intl';
import { MatStepContent } from './step-content';
import * as i0 from "@angular/core";
class MatStepperModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatStepperModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatStepperModule, declarations: [MatStep,
            MatStepLabel,
            MatStepper,
            MatStepperNext,
            MatStepperPrevious,
            MatStepHeader,
            MatStepperIcon,
            MatStepContent], imports: [MatCommonModule,
            CommonModule,
            PortalModule,
            CdkStepperModule,
            MatIconModule,
            MatRippleModule], exports: [MatCommonModule,
            MatStep,
            MatStepLabel,
            MatStepper,
            MatStepperNext,
            MatStepperPrevious,
            MatStepHeader,
            MatStepperIcon,
            MatStepContent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatStepperModule, providers: [MAT_STEPPER_INTL_PROVIDER, ErrorStateMatcher], imports: [MatCommonModule,
            CommonModule,
            PortalModule,
            CdkStepperModule,
            MatIconModule,
            MatRippleModule, MatCommonModule] }); }
}
export { MatStepperModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatStepperModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        MatCommonModule,
                        CommonModule,
                        PortalModule,
                        CdkStepperModule,
                        MatIconModule,
                        MatRippleModule,
                    ],
                    exports: [
                        MatCommonModule,
                        MatStep,
                        MatStepLabel,
                        MatStepper,
                        MatStepperNext,
                        MatStepperPrevious,
                        MatStepHeader,
                        MatStepperIcon,
                        MatStepContent,
                    ],
                    declarations: [
                        MatStep,
                        MatStepLabel,
                        MatStepper,
                        MatStepperNext,
                        MatStepperPrevious,
                        MatStepHeader,
                        MatStepperIcon,
                        MatStepContent,
                    ],
                    providers: [MAT_STEPPER_INTL_PROVIDER, ErrorStateMatcher],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc3RlcHBlci9zdGVwcGVyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDakQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQzlDLE9BQU8sRUFBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNwRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDOztBQUU5QyxNQWdDYSxnQkFBZ0I7OEdBQWhCLGdCQUFnQjsrR0FBaEIsZ0JBQWdCLGlCQVh6QixPQUFPO1lBQ1AsWUFBWTtZQUNaLFVBQVU7WUFDVixjQUFjO1lBQ2Qsa0JBQWtCO1lBQ2xCLGFBQWE7WUFDYixjQUFjO1lBQ2QsY0FBYyxhQTFCZCxlQUFlO1lBQ2YsWUFBWTtZQUNaLFlBQVk7WUFDWixnQkFBZ0I7WUFDaEIsYUFBYTtZQUNiLGVBQWUsYUFHZixlQUFlO1lBQ2YsT0FBTztZQUNQLFlBQVk7WUFDWixVQUFVO1lBQ1YsY0FBYztZQUNkLGtCQUFrQjtZQUNsQixhQUFhO1lBQ2IsY0FBYztZQUNkLGNBQWM7K0dBY0wsZ0JBQWdCLGFBRmhCLENBQUMseUJBQXlCLEVBQUUsaUJBQWlCLENBQUMsWUE1QnZELGVBQWU7WUFDZixZQUFZO1lBQ1osWUFBWTtZQUNaLGdCQUFnQjtZQUNoQixhQUFhO1lBQ2IsZUFBZSxFQUdmLGVBQWU7O1NBc0JOLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQWhDNUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsZUFBZTt3QkFDZixZQUFZO3dCQUNaLFlBQVk7d0JBQ1osZ0JBQWdCO3dCQUNoQixhQUFhO3dCQUNiLGVBQWU7cUJBQ2hCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxlQUFlO3dCQUNmLE9BQU87d0JBQ1AsWUFBWTt3QkFDWixVQUFVO3dCQUNWLGNBQWM7d0JBQ2Qsa0JBQWtCO3dCQUNsQixhQUFhO3dCQUNiLGNBQWM7d0JBQ2QsY0FBYztxQkFDZjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osT0FBTzt3QkFDUCxZQUFZO3dCQUNaLFVBQVU7d0JBQ1YsY0FBYzt3QkFDZCxrQkFBa0I7d0JBQ2xCLGFBQWE7d0JBQ2IsY0FBYzt3QkFDZCxjQUFjO3FCQUNmO29CQUNELFNBQVMsRUFBRSxDQUFDLHlCQUF5QixFQUFFLGlCQUFpQixDQUFDO2lCQUMxRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1BvcnRhbE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0Nka1N0ZXBwZXJNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zdGVwcGVyJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Vycm9yU3RhdGVNYXRjaGVyLCBNYXRDb21tb25Nb2R1bGUsIE1hdFJpcHBsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdEljb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xuaW1wb3J0IHtNYXRTdGVwSGVhZGVyfSBmcm9tICcuL3N0ZXAtaGVhZGVyJztcbmltcG9ydCB7TWF0U3RlcExhYmVsfSBmcm9tICcuL3N0ZXAtbGFiZWwnO1xuaW1wb3J0IHtNYXRTdGVwLCBNYXRTdGVwcGVyfSBmcm9tICcuL3N0ZXBwZXInO1xuaW1wb3J0IHtNYXRTdGVwcGVyTmV4dCwgTWF0U3RlcHBlclByZXZpb3VzfSBmcm9tICcuL3N0ZXBwZXItYnV0dG9uJztcbmltcG9ydCB7TWF0U3RlcHBlckljb259IGZyb20gJy4vc3RlcHBlci1pY29uJztcbmltcG9ydCB7TUFUX1NURVBQRVJfSU5UTF9QUk9WSURFUn0gZnJvbSAnLi9zdGVwcGVyLWludGwnO1xuaW1wb3J0IHtNYXRTdGVwQ29udGVudH0gZnJvbSAnLi9zdGVwLWNvbnRlbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIENvbW1vbk1vZHVsZSxcbiAgICBQb3J0YWxNb2R1bGUsXG4gICAgQ2RrU3RlcHBlck1vZHVsZSxcbiAgICBNYXRJY29uTW9kdWxlLFxuICAgIE1hdFJpcHBsZU1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXRTdGVwLFxuICAgIE1hdFN0ZXBMYWJlbCxcbiAgICBNYXRTdGVwcGVyLFxuICAgIE1hdFN0ZXBwZXJOZXh0LFxuICAgIE1hdFN0ZXBwZXJQcmV2aW91cyxcbiAgICBNYXRTdGVwSGVhZGVyLFxuICAgIE1hdFN0ZXBwZXJJY29uLFxuICAgIE1hdFN0ZXBDb250ZW50LFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRTdGVwLFxuICAgIE1hdFN0ZXBMYWJlbCxcbiAgICBNYXRTdGVwcGVyLFxuICAgIE1hdFN0ZXBwZXJOZXh0LFxuICAgIE1hdFN0ZXBwZXJQcmV2aW91cyxcbiAgICBNYXRTdGVwSGVhZGVyLFxuICAgIE1hdFN0ZXBwZXJJY29uLFxuICAgIE1hdFN0ZXBDb250ZW50LFxuICBdLFxuICBwcm92aWRlcnM6IFtNQVRfU1RFUFBFUl9JTlRMX1BST1ZJREVSLCBFcnJvclN0YXRlTWF0Y2hlcl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFN0ZXBwZXJNb2R1bGUge31cbiJdfQ==