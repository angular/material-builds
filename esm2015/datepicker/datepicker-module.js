/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatCalendar, MatCalendarHeader } from './calendar';
import { MatCalendarBody } from './calendar-body';
import { MatDatepicker } from './datepicker';
import { MatDatepickerContent, MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER, } from './datepicker-base';
import { MatDatepickerInput } from './datepicker-input';
import { MatDatepickerIntl } from './datepicker-intl';
import { MatDatepickerToggle, MatDatepickerToggleIcon } from './datepicker-toggle';
import { MatMonthView } from './month-view';
import { MatMultiYearView } from './multi-year-view';
import { MatYearView } from './year-view';
import { MatDateRangeInput } from './date-range-input';
import { MatStartDate, MatEndDate } from './date-range-input-parts';
import { MatDateRangePicker } from './date-range-picker';
import { MAT_DATE_RANGE_SELECTION_STRATEGY, DefaultMatCalendarRangeStrategy } from './date-range-selection-strategy';
let MatDatepickerModule = /** @class */ (() => {
    let MatDatepickerModule = class MatDatepickerModule {
    };
    MatDatepickerModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                MatButtonModule,
                MatDialogModule,
                OverlayModule,
                A11yModule,
                PortalModule,
            ],
            exports: [
                CdkScrollableModule,
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
                MatDateRangeInput,
                MatStartDate,
                MatEndDate,
                MatDateRangePicker,
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
                MatDateRangeInput,
                MatStartDate,
                MatEndDate,
                MatDateRangePicker,
            ],
            providers: [
                MatDatepickerIntl,
                MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
                {
                    provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
                    useClass: DefaultMatCalendarRangeStrategy
                }
            ],
            entryComponents: [
                MatDatepickerContent,
                MatCalendarHeader,
            ]
        })
    ], MatDatepickerModule);
    return MatDatepickerModule;
})();
export { MatDatepickerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlcGlja2VyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDakQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsV0FBVyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQzFELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzNDLE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIsK0NBQStDLEdBQ2hELE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDdEQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFDLG1CQUFtQixFQUFFLHVCQUF1QixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDakYsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMxQyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxZQUFZLEVBQUUsVUFBVSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbEUsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUNMLGlDQUFpQyxFQUNqQywrQkFBK0IsRUFDaEMsTUFBTSxpQ0FBaUMsQ0FBQztBQTREekM7SUFBQSxJQUFhLG1CQUFtQixHQUFoQyxNQUFhLG1CQUFtQjtLQUFHLENBQUE7SUFBdEIsbUJBQW1CO1FBekQvQixRQUFRLENBQUM7WUFDUixPQUFPLEVBQUU7Z0JBQ1AsWUFBWTtnQkFDWixlQUFlO2dCQUNmLGVBQWU7Z0JBQ2YsYUFBYTtnQkFDYixVQUFVO2dCQUNWLFlBQVk7YUFDYjtZQUNELE9BQU8sRUFBRTtnQkFDUCxtQkFBbUI7Z0JBQ25CLFdBQVc7Z0JBQ1gsZUFBZTtnQkFDZixhQUFhO2dCQUNiLG9CQUFvQjtnQkFDcEIsa0JBQWtCO2dCQUNsQixtQkFBbUI7Z0JBQ25CLHVCQUF1QjtnQkFDdkIsWUFBWTtnQkFDWixXQUFXO2dCQUNYLGdCQUFnQjtnQkFDaEIsaUJBQWlCO2dCQUNqQixpQkFBaUI7Z0JBQ2pCLFlBQVk7Z0JBQ1osVUFBVTtnQkFDVixrQkFBa0I7YUFDbkI7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osV0FBVztnQkFDWCxlQUFlO2dCQUNmLGFBQWE7Z0JBQ2Isb0JBQW9CO2dCQUNwQixrQkFBa0I7Z0JBQ2xCLG1CQUFtQjtnQkFDbkIsdUJBQXVCO2dCQUN2QixZQUFZO2dCQUNaLFdBQVc7Z0JBQ1gsZ0JBQWdCO2dCQUNoQixpQkFBaUI7Z0JBQ2pCLGlCQUFpQjtnQkFDakIsWUFBWTtnQkFDWixVQUFVO2dCQUNWLGtCQUFrQjthQUNuQjtZQUNELFNBQVMsRUFBRTtnQkFDVCxpQkFBaUI7Z0JBQ2pCLCtDQUErQztnQkFDL0M7b0JBQ0UsT0FBTyxFQUFFLGlDQUFpQztvQkFDMUMsUUFBUSxFQUFFLCtCQUErQjtpQkFDMUM7YUFDRjtZQUNELGVBQWUsRUFBRTtnQkFDZixvQkFBb0I7Z0JBQ3BCLGlCQUFpQjthQUNsQjtTQUNGLENBQUM7T0FDVyxtQkFBbUIsQ0FBRztJQUFELDBCQUFDO0tBQUE7U0FBdEIsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QTExeU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtPdmVybGF5TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge1BvcnRhbE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRCdXR0b25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XG5pbXBvcnQge01hdERpYWxvZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge01hdENhbGVuZGFyLCBNYXRDYWxlbmRhckhlYWRlcn0gZnJvbSAnLi9jYWxlbmRhcic7XG5pbXBvcnQge01hdENhbGVuZGFyQm9keX0gZnJvbSAnLi9jYWxlbmRhci1ib2R5JztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlcn0gZnJvbSAnLi9kYXRlcGlja2VyJztcbmltcG9ydCB7XG4gIE1hdERhdGVwaWNrZXJDb250ZW50LFxuICBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUixcbn0gZnJvbSAnLi9kYXRlcGlja2VyLWJhc2UnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW5wdXR9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dCc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJJbnRsfSBmcm9tICcuL2RhdGVwaWNrZXItaW50bCc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJUb2dnbGUsIE1hdERhdGVwaWNrZXJUb2dnbGVJY29ufSBmcm9tICcuL2RhdGVwaWNrZXItdG9nZ2xlJztcbmltcG9ydCB7TWF0TW9udGhWaWV3fSBmcm9tICcuL21vbnRoLXZpZXcnO1xuaW1wb3J0IHtNYXRNdWx0aVllYXJWaWV3fSBmcm9tICcuL211bHRpLXllYXItdmlldyc7XG5pbXBvcnQge01hdFllYXJWaWV3fSBmcm9tICcuL3llYXItdmlldyc7XG5pbXBvcnQge01hdERhdGVSYW5nZUlucHV0fSBmcm9tICcuL2RhdGUtcmFuZ2UtaW5wdXQnO1xuaW1wb3J0IHtNYXRTdGFydERhdGUsIE1hdEVuZERhdGV9IGZyb20gJy4vZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cyc7XG5pbXBvcnQge01hdERhdGVSYW5nZVBpY2tlcn0gZnJvbSAnLi9kYXRlLXJhbmdlLXBpY2tlcic7XG5pbXBvcnQge1xuICBNQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1ksXG4gIERlZmF1bHRNYXRDYWxlbmRhclJhbmdlU3RyYXRlZ3lcbn0gZnJvbSAnLi9kYXRlLXJhbmdlLXNlbGVjdGlvbi1zdHJhdGVneSc7XG5cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBNYXRCdXR0b25Nb2R1bGUsXG4gICAgTWF0RGlhbG9nTW9kdWxlLFxuICAgIE92ZXJsYXlNb2R1bGUsXG4gICAgQTExeU1vZHVsZSxcbiAgICBQb3J0YWxNb2R1bGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBDZGtTY3JvbGxhYmxlTW9kdWxlLFxuICAgIE1hdENhbGVuZGFyLFxuICAgIE1hdENhbGVuZGFyQm9keSxcbiAgICBNYXREYXRlcGlja2VyLFxuICAgIE1hdERhdGVwaWNrZXJDb250ZW50LFxuICAgIE1hdERhdGVwaWNrZXJJbnB1dCxcbiAgICBNYXREYXRlcGlja2VyVG9nZ2xlLFxuICAgIE1hdERhdGVwaWNrZXJUb2dnbGVJY29uLFxuICAgIE1hdE1vbnRoVmlldyxcbiAgICBNYXRZZWFyVmlldyxcbiAgICBNYXRNdWx0aVllYXJWaWV3LFxuICAgIE1hdENhbGVuZGFySGVhZGVyLFxuICAgIE1hdERhdGVSYW5nZUlucHV0LFxuICAgIE1hdFN0YXJ0RGF0ZSxcbiAgICBNYXRFbmREYXRlLFxuICAgIE1hdERhdGVSYW5nZVBpY2tlcixcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0Q2FsZW5kYXIsXG4gICAgTWF0Q2FsZW5kYXJCb2R5LFxuICAgIE1hdERhdGVwaWNrZXIsXG4gICAgTWF0RGF0ZXBpY2tlckNvbnRlbnQsXG4gICAgTWF0RGF0ZXBpY2tlcklucHV0LFxuICAgIE1hdERhdGVwaWNrZXJUb2dnbGUsXG4gICAgTWF0RGF0ZXBpY2tlclRvZ2dsZUljb24sXG4gICAgTWF0TW9udGhWaWV3LFxuICAgIE1hdFllYXJWaWV3LFxuICAgIE1hdE11bHRpWWVhclZpZXcsXG4gICAgTWF0Q2FsZW5kYXJIZWFkZXIsXG4gICAgTWF0RGF0ZVJhbmdlSW5wdXQsXG4gICAgTWF0U3RhcnREYXRlLFxuICAgIE1hdEVuZERhdGUsXG4gICAgTWF0RGF0ZVJhbmdlUGlja2VyLFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBNYXREYXRlcGlja2VySW50bCxcbiAgICBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUixcbiAgICB7XG4gICAgICBwcm92aWRlOiBNQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1ksXG4gICAgICB1c2VDbGFzczogRGVmYXVsdE1hdENhbGVuZGFyUmFuZ2VTdHJhdGVneVxuICAgIH1cbiAgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbXG4gICAgTWF0RGF0ZXBpY2tlckNvbnRlbnQsXG4gICAgTWF0Q2FsZW5kYXJIZWFkZXIsXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXBpY2tlck1vZHVsZSB7fVxuIl19