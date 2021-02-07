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
import { MatHorizontalStepper, MatStep, MatStepper, MatVerticalStepper } from './stepper';
import { MatStepperNext, MatStepperPrevious } from './stepper-button';
import { MatStepperIcon } from './stepper-icon';
import { MAT_STEPPER_INTL_PROVIDER } from './stepper-intl';
import { MatStepContent } from './step-content';
export class MatStepperModule {
}
MatStepperModule.decorators = [
    { type: NgModule, args: [{
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
                    MatHorizontalStepper,
                    MatVerticalStepper,
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
                    MatHorizontalStepper,
                    MatVerticalStepper,
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
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc3RlcHBlci9zdGVwcGVyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDakQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDM0YsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMxQyxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUN4RixPQUFPLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDcEUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQXdDOUMsTUFBTSxPQUFPLGdCQUFnQjs7O1lBckM1QixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLGVBQWU7b0JBQ2YsWUFBWTtvQkFDWixZQUFZO29CQUNaLGVBQWU7b0JBQ2YsZ0JBQWdCO29CQUNoQixhQUFhO29CQUNiLGVBQWU7aUJBQ2hCO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxlQUFlO29CQUNmLG9CQUFvQjtvQkFDcEIsa0JBQWtCO29CQUNsQixPQUFPO29CQUNQLFlBQVk7b0JBQ1osVUFBVTtvQkFDVixjQUFjO29CQUNkLGtCQUFrQjtvQkFDbEIsYUFBYTtvQkFDYixjQUFjO29CQUNkLGNBQWM7aUJBQ2Y7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLG9CQUFvQjtvQkFDcEIsa0JBQWtCO29CQUNsQixPQUFPO29CQUNQLFlBQVk7b0JBQ1osVUFBVTtvQkFDVixjQUFjO29CQUNkLGtCQUFrQjtvQkFDbEIsYUFBYTtvQkFDYixjQUFjO29CQUNkLGNBQWM7aUJBQ2Y7Z0JBQ0QsU0FBUyxFQUFFLENBQUMseUJBQXlCLEVBQUUsaUJBQWlCLENBQUM7YUFDMUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQb3J0YWxNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtDZGtTdGVwcGVyTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvc3RlcHBlcic7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRCdXR0b25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XG5pbXBvcnQge0Vycm9yU3RhdGVNYXRjaGVyLCBNYXRDb21tb25Nb2R1bGUsIE1hdFJpcHBsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdEljb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xuaW1wb3J0IHtNYXRTdGVwSGVhZGVyfSBmcm9tICcuL3N0ZXAtaGVhZGVyJztcbmltcG9ydCB7TWF0U3RlcExhYmVsfSBmcm9tICcuL3N0ZXAtbGFiZWwnO1xuaW1wb3J0IHtNYXRIb3Jpem9udGFsU3RlcHBlciwgTWF0U3RlcCwgTWF0U3RlcHBlciwgTWF0VmVydGljYWxTdGVwcGVyfSBmcm9tICcuL3N0ZXBwZXInO1xuaW1wb3J0IHtNYXRTdGVwcGVyTmV4dCwgTWF0U3RlcHBlclByZXZpb3VzfSBmcm9tICcuL3N0ZXBwZXItYnV0dG9uJztcbmltcG9ydCB7TWF0U3RlcHBlckljb259IGZyb20gJy4vc3RlcHBlci1pY29uJztcbmltcG9ydCB7TUFUX1NURVBQRVJfSU5UTF9QUk9WSURFUn0gZnJvbSAnLi9zdGVwcGVyLWludGwnO1xuaW1wb3J0IHtNYXRTdGVwQ29udGVudH0gZnJvbSAnLi9zdGVwLWNvbnRlbnQnO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIFBvcnRhbE1vZHVsZSxcbiAgICBNYXRCdXR0b25Nb2R1bGUsXG4gICAgQ2RrU3RlcHBlck1vZHVsZSxcbiAgICBNYXRJY29uTW9kdWxlLFxuICAgIE1hdFJpcHBsZU1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXRIb3Jpem9udGFsU3RlcHBlcixcbiAgICBNYXRWZXJ0aWNhbFN0ZXBwZXIsXG4gICAgTWF0U3RlcCxcbiAgICBNYXRTdGVwTGFiZWwsXG4gICAgTWF0U3RlcHBlcixcbiAgICBNYXRTdGVwcGVyTmV4dCxcbiAgICBNYXRTdGVwcGVyUHJldmlvdXMsXG4gICAgTWF0U3RlcEhlYWRlcixcbiAgICBNYXRTdGVwcGVySWNvbixcbiAgICBNYXRTdGVwQ29udGVudCxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0SG9yaXpvbnRhbFN0ZXBwZXIsXG4gICAgTWF0VmVydGljYWxTdGVwcGVyLFxuICAgIE1hdFN0ZXAsXG4gICAgTWF0U3RlcExhYmVsLFxuICAgIE1hdFN0ZXBwZXIsXG4gICAgTWF0U3RlcHBlck5leHQsXG4gICAgTWF0U3RlcHBlclByZXZpb3VzLFxuICAgIE1hdFN0ZXBIZWFkZXIsXG4gICAgTWF0U3RlcHBlckljb24sXG4gICAgTWF0U3RlcENvbnRlbnQsXG4gIF0sXG4gIHByb3ZpZGVyczogW01BVF9TVEVQUEVSX0lOVExfUFJPVklERVIsIEVycm9yU3RhdGVNYXRjaGVyXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U3RlcHBlck1vZHVsZSB7fVxuIl19