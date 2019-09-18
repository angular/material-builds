/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCalendar, MatCalendarHeader } from './calendar';
import { MatCalendarBody } from './calendar-body';
import { MatDatepicker, MatDatepickerContent, MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER, } from './datepicker';
import { MatDatepickerInput } from './datepicker-input';
import { MatDatepickerIntl } from './datepicker-intl';
import { MatDatepickerToggle, MatDatepickerToggleIcon } from './datepicker-toggle';
import { MatMonthView } from './month-view';
import { MatMultiYearView } from './multi-year-view';
import { MatYearView } from './year-view';
var MatDatepickerModule = /** @class */ (function () {
    function MatDatepickerModule() {
    }
    MatDatepickerModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        MatButtonModule,
                        MatDialogModule,
                        OverlayModule,
                        A11yModule,
                        PortalModule,
                    ],
                    exports: [
                        MatCalendar,
                        MatCalendarBody,
                        MatDatepicker,
                        MatDatepickerContent,
                        MatDatepickerInput,
                        MatDatepickerToggle,
                        MatDatepickerToggleIcon,
                        MatMonthView,
                        MatYearView,
                        MatMultiYearView,
                        MatCalendarHeader,
                    ],
                    declarations: [
                        MatCalendar,
                        MatCalendarBody,
                        MatDatepicker,
                        MatDatepickerContent,
                        MatDatepickerInput,
                        MatDatepickerToggle,
                        MatDatepickerToggleIcon,
                        MatMonthView,
                        MatYearView,
                        MatMultiYearView,
                        MatCalendarHeader,
                    ],
                    providers: [
                        MatDatepickerIntl,
                        MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
                    ],
                    entryComponents: [
                        MatDatepickerContent,
                        MatCalendarHeader,
                    ]
                },] }
    ];
    return MatDatepickerModule;
}());
export { MatDatepickerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlcGlja2VyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxXQUFXLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDMUQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2hELE9BQU8sRUFDTCxhQUFhLEVBQ2Isb0JBQW9CLEVBQ3BCLCtDQUErQyxHQUNoRCxNQUFNLGNBQWMsQ0FBQztBQUN0QixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUUsdUJBQXVCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFHeEM7SUFBQTtJQTRDa0MsQ0FBQzs7Z0JBNUNsQyxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixlQUFlO3dCQUNmLGFBQWE7d0JBQ2IsVUFBVTt3QkFDVixZQUFZO3FCQUNiO29CQUNELE9BQU8sRUFBRTt3QkFDUCxXQUFXO3dCQUNYLGVBQWU7d0JBQ2YsYUFBYTt3QkFDYixvQkFBb0I7d0JBQ3BCLGtCQUFrQjt3QkFDbEIsbUJBQW1CO3dCQUNuQix1QkFBdUI7d0JBQ3ZCLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxnQkFBZ0I7d0JBQ2hCLGlCQUFpQjtxQkFDbEI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLFdBQVc7d0JBQ1gsZUFBZTt3QkFDZixhQUFhO3dCQUNiLG9CQUFvQjt3QkFDcEIsa0JBQWtCO3dCQUNsQixtQkFBbUI7d0JBQ25CLHVCQUF1Qjt3QkFDdkIsWUFBWTt3QkFDWixXQUFXO3dCQUNYLGdCQUFnQjt3QkFDaEIsaUJBQWlCO3FCQUNsQjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1QsaUJBQWlCO3dCQUNqQiwrQ0FBK0M7cUJBQ2hEO29CQUNELGVBQWUsRUFBRTt3QkFDZixvQkFBb0I7d0JBQ3BCLGlCQUFpQjtxQkFDbEI7aUJBQ0Y7O0lBQ2lDLDBCQUFDO0NBQUEsQUE1Q25DLElBNENtQztTQUF0QixtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBMTF5TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge092ZXJsYXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7UG9ydGFsTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdEJ1dHRvbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcbmltcG9ydCB7TWF0RGlhbG9nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xuaW1wb3J0IHtNYXRDYWxlbmRhciwgTWF0Q2FsZW5kYXJIZWFkZXJ9IGZyb20gJy4vY2FsZW5kYXInO1xuaW1wb3J0IHtNYXRDYWxlbmRhckJvZHl9IGZyb20gJy4vY2FsZW5kYXItYm9keSc7XG5pbXBvcnQge1xuICBNYXREYXRlcGlja2VyLFxuICBNYXREYXRlcGlja2VyQ29udGVudCxcbiAgTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIsXG59IGZyb20gJy4vZGF0ZXBpY2tlcic7XG5pbXBvcnQge01hdERhdGVwaWNrZXJJbnB1dH0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0JztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlckludGx9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnRsJztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlclRvZ2dsZSwgTWF0RGF0ZXBpY2tlclRvZ2dsZUljb259IGZyb20gJy4vZGF0ZXBpY2tlci10b2dnbGUnO1xuaW1wb3J0IHtNYXRNb250aFZpZXd9IGZyb20gJy4vbW9udGgtdmlldyc7XG5pbXBvcnQge01hdE11bHRpWWVhclZpZXd9IGZyb20gJy4vbXVsdGkteWVhci12aWV3JztcbmltcG9ydCB7TWF0WWVhclZpZXd9IGZyb20gJy4veWVhci12aWV3JztcblxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIE1hdEJ1dHRvbk1vZHVsZSxcbiAgICBNYXREaWFsb2dNb2R1bGUsXG4gICAgT3ZlcmxheU1vZHVsZSxcbiAgICBBMTF5TW9kdWxlLFxuICAgIFBvcnRhbE1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIE1hdENhbGVuZGFyLFxuICAgIE1hdENhbGVuZGFyQm9keSxcbiAgICBNYXREYXRlcGlja2VyLFxuICAgIE1hdERhdGVwaWNrZXJDb250ZW50LFxuICAgIE1hdERhdGVwaWNrZXJJbnB1dCxcbiAgICBNYXREYXRlcGlja2VyVG9nZ2xlLFxuICAgIE1hdERhdGVwaWNrZXJUb2dnbGVJY29uLFxuICAgIE1hdE1vbnRoVmlldyxcbiAgICBNYXRZZWFyVmlldyxcbiAgICBNYXRNdWx0aVllYXJWaWV3LFxuICAgIE1hdENhbGVuZGFySGVhZGVyLFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRDYWxlbmRhcixcbiAgICBNYXRDYWxlbmRhckJvZHksXG4gICAgTWF0RGF0ZXBpY2tlcixcbiAgICBNYXREYXRlcGlja2VyQ29udGVudCxcbiAgICBNYXREYXRlcGlja2VySW5wdXQsXG4gICAgTWF0RGF0ZXBpY2tlclRvZ2dsZSxcbiAgICBNYXREYXRlcGlja2VyVG9nZ2xlSWNvbixcbiAgICBNYXRNb250aFZpZXcsXG4gICAgTWF0WWVhclZpZXcsXG4gICAgTWF0TXVsdGlZZWFyVmlldyxcbiAgICBNYXRDYWxlbmRhckhlYWRlcixcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTWF0RGF0ZXBpY2tlckludGwsXG4gICAgTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIsXG4gIF0sXG4gIGVudHJ5Q29tcG9uZW50czogW1xuICAgIE1hdERhdGVwaWNrZXJDb250ZW50LFxuICAgIE1hdENhbGVuZGFySGVhZGVyLFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1hdERhdGVwaWNrZXJNb2R1bGUge31cbiJdfQ==