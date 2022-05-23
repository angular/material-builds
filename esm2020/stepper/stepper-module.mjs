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
import { MatButtonModule } from '@angular/material/button';
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
export class MatStepperModule {
}
MatStepperModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatStepperModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatStepperModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatStepperModule, declarations: [MatStep,
        MatStepLabel,
        MatStepper,
        MatStepperNext,
        MatStepperPrevious,
        MatStepHeader,
        MatStepperIcon,
        MatStepContent], imports: [MatCommonModule,
        CommonModule,
        PortalModule,
        MatButtonModule,
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
        MatStepContent] });
MatStepperModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatStepperModule, providers: [MAT_STEPPER_INTL_PROVIDER, ErrorStateMatcher], imports: [MatCommonModule,
        CommonModule,
        PortalModule,
        MatButtonModule,
        CdkStepperModule,
        MatIconModule,
        MatRippleModule, MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatStepperModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        MatCommonModule,
                        CommonModule,
                        PortalModule,
                        MatButtonModule,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc3RlcHBlci9zdGVwcGVyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDakQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDM0YsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMxQyxPQUFPLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUM5QyxPQUFPLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDcEUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFtQzlDLE1BQU0sT0FBTyxnQkFBZ0I7O2tIQUFoQixnQkFBZ0I7bUhBQWhCLGdCQUFnQixpQkFYekIsT0FBTztRQUNQLFlBQVk7UUFDWixVQUFVO1FBQ1YsY0FBYztRQUNkLGtCQUFrQjtRQUNsQixhQUFhO1FBQ2IsY0FBYztRQUNkLGNBQWMsYUEzQmQsZUFBZTtRQUNmLFlBQVk7UUFDWixZQUFZO1FBQ1osZUFBZTtRQUNmLGdCQUFnQjtRQUNoQixhQUFhO1FBQ2IsZUFBZSxhQUdmLGVBQWU7UUFDZixPQUFPO1FBQ1AsWUFBWTtRQUNaLFVBQVU7UUFDVixjQUFjO1FBQ2Qsa0JBQWtCO1FBQ2xCLGFBQWE7UUFDYixjQUFjO1FBQ2QsY0FBYzttSEFjTCxnQkFBZ0IsYUFGaEIsQ0FBQyx5QkFBeUIsRUFBRSxpQkFBaUIsQ0FBQyxZQTdCdkQsZUFBZTtRQUNmLFlBQVk7UUFDWixZQUFZO1FBQ1osZUFBZTtRQUNmLGdCQUFnQjtRQUNoQixhQUFhO1FBQ2IsZUFBZSxFQUdmLGVBQWU7Z0dBc0JOLGdCQUFnQjtrQkFqQzVCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLGVBQWU7d0JBQ2YsWUFBWTt3QkFDWixZQUFZO3dCQUNaLGVBQWU7d0JBQ2YsZ0JBQWdCO3dCQUNoQixhQUFhO3dCQUNiLGVBQWU7cUJBQ2hCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxlQUFlO3dCQUNmLE9BQU87d0JBQ1AsWUFBWTt3QkFDWixVQUFVO3dCQUNWLGNBQWM7d0JBQ2Qsa0JBQWtCO3dCQUNsQixhQUFhO3dCQUNiLGNBQWM7d0JBQ2QsY0FBYztxQkFDZjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osT0FBTzt3QkFDUCxZQUFZO3dCQUNaLFVBQVU7d0JBQ1YsY0FBYzt3QkFDZCxrQkFBa0I7d0JBQ2xCLGFBQWE7d0JBQ2IsY0FBYzt3QkFDZCxjQUFjO3FCQUNmO29CQUNELFNBQVMsRUFBRSxDQUFDLHlCQUF5QixFQUFFLGlCQUFpQixDQUFDO2lCQUMxRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1BvcnRhbE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0Nka1N0ZXBwZXJNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zdGVwcGVyJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdEJ1dHRvbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcbmltcG9ydCB7RXJyb3JTdGF0ZU1hdGNoZXIsIE1hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0SWNvbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbic7XG5pbXBvcnQge01hdFN0ZXBIZWFkZXJ9IGZyb20gJy4vc3RlcC1oZWFkZXInO1xuaW1wb3J0IHtNYXRTdGVwTGFiZWx9IGZyb20gJy4vc3RlcC1sYWJlbCc7XG5pbXBvcnQge01hdFN0ZXAsIE1hdFN0ZXBwZXJ9IGZyb20gJy4vc3RlcHBlcic7XG5pbXBvcnQge01hdFN0ZXBwZXJOZXh0LCBNYXRTdGVwcGVyUHJldmlvdXN9IGZyb20gJy4vc3RlcHBlci1idXR0b24nO1xuaW1wb3J0IHtNYXRTdGVwcGVySWNvbn0gZnJvbSAnLi9zdGVwcGVyLWljb24nO1xuaW1wb3J0IHtNQVRfU1RFUFBFUl9JTlRMX1BST1ZJREVSfSBmcm9tICcuL3N0ZXBwZXItaW50bCc7XG5pbXBvcnQge01hdFN0ZXBDb250ZW50fSBmcm9tICcuL3N0ZXAtY29udGVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIFBvcnRhbE1vZHVsZSxcbiAgICBNYXRCdXR0b25Nb2R1bGUsXG4gICAgQ2RrU3RlcHBlck1vZHVsZSxcbiAgICBNYXRJY29uTW9kdWxlLFxuICAgIE1hdFJpcHBsZU1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXRTdGVwLFxuICAgIE1hdFN0ZXBMYWJlbCxcbiAgICBNYXRTdGVwcGVyLFxuICAgIE1hdFN0ZXBwZXJOZXh0LFxuICAgIE1hdFN0ZXBwZXJQcmV2aW91cyxcbiAgICBNYXRTdGVwSGVhZGVyLFxuICAgIE1hdFN0ZXBwZXJJY29uLFxuICAgIE1hdFN0ZXBDb250ZW50LFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRTdGVwLFxuICAgIE1hdFN0ZXBMYWJlbCxcbiAgICBNYXRTdGVwcGVyLFxuICAgIE1hdFN0ZXBwZXJOZXh0LFxuICAgIE1hdFN0ZXBwZXJQcmV2aW91cyxcbiAgICBNYXRTdGVwSGVhZGVyLFxuICAgIE1hdFN0ZXBwZXJJY29uLFxuICAgIE1hdFN0ZXBDb250ZW50LFxuICBdLFxuICBwcm92aWRlcnM6IFtNQVRfU1RFUFBFUl9JTlRMX1BST1ZJREVSLCBFcnJvclN0YXRlTWF0Y2hlcl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFN0ZXBwZXJNb2R1bGUge31cbiJdfQ==