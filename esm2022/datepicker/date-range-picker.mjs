/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatDatepickerBase } from './datepicker-base';
import { MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER } from './date-selection-model';
import { MAT_CALENDAR_RANGE_STRATEGY_PROVIDER } from './date-range-selection-strategy';
import * as i0 from "@angular/core";
// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="matDateRangePicker"). We can change this to a
// directive if angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the date range picker popup/dialog. */
export class MatDateRangePicker extends MatDatepickerBase {
    _forwardContentValues(instance) {
        super._forwardContentValues(instance);
        const input = this.datepickerInput;
        if (input) {
            instance.comparisonStart = input.comparisonStart;
            instance.comparisonEnd = input.comparisonEnd;
            instance.startDateAccessibleName = input._getStartDateAccessibleName();
            instance.endDateAccessibleName = input._getEndDateAccessibleName();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatDateRangePicker, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.0.4", type: MatDateRangePicker, isStandalone: true, selector: "mat-date-range-picker", providers: [
            MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
            MAT_CALENDAR_RANGE_STRATEGY_PROVIDER,
            { provide: MatDatepickerBase, useExisting: MatDateRangePicker },
        ], exportAs: ["matDateRangePicker"], usesInheritance: true, ngImport: i0, template: '', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatDateRangePicker, decorators: [{
            type: Component,
            args: [{
                    selector: 'mat-date-range-picker',
                    template: '',
                    exportAs: 'matDateRangePicker',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    providers: [
                        MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
                        MAT_CALENDAR_RANGE_STRATEGY_PROVIDER,
                        { provide: MatDatepickerBase, useExisting: MatDateRangePicker },
                    ],
                    standalone: true,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXJhbmdlLXBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BGLE9BQU8sRUFBQyxpQkFBaUIsRUFBNkMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRyxPQUFPLEVBQUMsdUNBQXVDLEVBQVksTUFBTSx3QkFBd0IsQ0FBQztBQUMxRixPQUFPLEVBQUMsb0NBQW9DLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQzs7QUFhckYsOEZBQThGO0FBQzlGLDZGQUE2RjtBQUM3RiwrRUFBK0U7QUFDL0UsNkVBQTZFO0FBYzdFLE1BQU0sT0FBTyxrQkFBc0IsU0FBUSxpQkFJMUM7SUFDb0IscUJBQXFCLENBQUMsUUFBK0M7UUFDdEYsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFFbkMsSUFBSSxLQUFLLEVBQUU7WUFDVCxRQUFRLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7WUFDakQsUUFBUSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO1lBQzdDLFFBQVEsQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztZQUN2RSxRQUFRLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLHlCQUF5QixFQUFFLENBQUM7U0FDcEU7SUFDSCxDQUFDOzhHQWhCVSxrQkFBa0I7a0dBQWxCLGtCQUFrQixvRUFQbEI7WUFDVCx1Q0FBdUM7WUFDdkMsb0NBQW9DO1lBQ3BDLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBQztTQUM5RCxtRkFSUyxFQUFFOzsyRkFXRCxrQkFBa0I7a0JBYjlCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtvQkFDakMsUUFBUSxFQUFFLEVBQUU7b0JBQ1osUUFBUSxFQUFFLG9CQUFvQjtvQkFDOUIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxTQUFTLEVBQUU7d0JBQ1QsdUNBQXVDO3dCQUN2QyxvQ0FBb0M7d0JBQ3BDLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsb0JBQW9CLEVBQUM7cUJBQzlEO29CQUNELFVBQVUsRUFBRSxJQUFJO2lCQUNqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlckJhc2UsIE1hdERhdGVwaWNrZXJDb250ZW50LCBNYXREYXRlcGlja2VyQ29udHJvbH0gZnJvbSAnLi9kYXRlcGlja2VyLWJhc2UnO1xuaW1wb3J0IHtNQVRfUkFOR0VfREFURV9TRUxFQ1RJT05fTU9ERUxfUFJPVklERVIsIERhdGVSYW5nZX0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5pbXBvcnQge01BVF9DQUxFTkRBUl9SQU5HRV9TVFJBVEVHWV9QUk9WSURFUn0gZnJvbSAnLi9kYXRlLXJhbmdlLXNlbGVjdGlvbi1zdHJhdGVneSc7XG5cbi8qKlxuICogSW5wdXQgdGhhdCBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgZGF0ZSByYW5nZSBwaWNrZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0RGF0ZVJhbmdlUGlja2VySW5wdXQ8RD4gZXh0ZW5kcyBNYXREYXRlcGlja2VyQ29udHJvbDxEPiB7XG4gIF9nZXRFbmREYXRlQWNjZXNzaWJsZU5hbWUoKTogc3RyaW5nIHwgbnVsbDtcbiAgX2dldFN0YXJ0RGF0ZUFjY2Vzc2libGVOYW1lKCk6IHN0cmluZyB8IG51bGw7XG4gIGNvbXBhcmlzb25TdGFydDogRCB8IG51bGw7XG4gIGNvbXBhcmlzb25FbmQ6IEQgfCBudWxsO1xufVxuXG4vLyBUT0RPKG1tYWxlcmJhKTogV2UgdXNlIGEgY29tcG9uZW50IGluc3RlYWQgb2YgYSBkaXJlY3RpdmUgaGVyZSBzbyB0aGUgdXNlciBjYW4gdXNlIGltcGxpY2l0XG4vLyB0ZW1wbGF0ZSByZWZlcmVuY2UgdmFyaWFibGVzIChlLmcuICNkIHZzICNkPVwibWF0RGF0ZVJhbmdlUGlja2VyXCIpLiBXZSBjYW4gY2hhbmdlIHRoaXMgdG8gYVxuLy8gZGlyZWN0aXZlIGlmIGFuZ3VsYXIgYWRkcyBzdXBwb3J0IGZvciBgZXhwb3J0QXM6ICckaW1wbGljaXQnYCBvbiBkaXJlY3RpdmVzLlxuLyoqIENvbXBvbmVudCByZXNwb25zaWJsZSBmb3IgbWFuYWdpbmcgdGhlIGRhdGUgcmFuZ2UgcGlja2VyIHBvcHVwL2RpYWxvZy4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kYXRlLXJhbmdlLXBpY2tlcicsXG4gIHRlbXBsYXRlOiAnJyxcbiAgZXhwb3J0QXM6ICdtYXREYXRlUmFuZ2VQaWNrZXInLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTUFUX1JBTkdFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSLFxuICAgIE1BVF9DQUxFTkRBUl9SQU5HRV9TVFJBVEVHWV9QUk9WSURFUixcbiAgICB7cHJvdmlkZTogTWF0RGF0ZXBpY2tlckJhc2UsIHVzZUV4aXN0aW5nOiBNYXREYXRlUmFuZ2VQaWNrZXJ9LFxuICBdLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRlUmFuZ2VQaWNrZXI8RD4gZXh0ZW5kcyBNYXREYXRlcGlja2VyQmFzZTxcbiAgTWF0RGF0ZVJhbmdlUGlja2VySW5wdXQ8RD4sXG4gIERhdGVSYW5nZTxEPixcbiAgRFxuPiB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBfZm9yd2FyZENvbnRlbnRWYWx1ZXMoaW5zdGFuY2U6IE1hdERhdGVwaWNrZXJDb250ZW50PERhdGVSYW5nZTxEPiwgRD4pIHtcbiAgICBzdXBlci5fZm9yd2FyZENvbnRlbnRWYWx1ZXMoaW5zdGFuY2UpO1xuXG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmRhdGVwaWNrZXJJbnB1dDtcblxuICAgIGlmIChpbnB1dCkge1xuICAgICAgaW5zdGFuY2UuY29tcGFyaXNvblN0YXJ0ID0gaW5wdXQuY29tcGFyaXNvblN0YXJ0O1xuICAgICAgaW5zdGFuY2UuY29tcGFyaXNvbkVuZCA9IGlucHV0LmNvbXBhcmlzb25FbmQ7XG4gICAgICBpbnN0YW5jZS5zdGFydERhdGVBY2Nlc3NpYmxlTmFtZSA9IGlucHV0Ll9nZXRTdGFydERhdGVBY2Nlc3NpYmxlTmFtZSgpO1xuICAgICAgaW5zdGFuY2UuZW5kRGF0ZUFjY2Vzc2libGVOYW1lID0gaW5wdXQuX2dldEVuZERhdGVBY2Nlc3NpYmxlTmFtZSgpO1xuICAgIH1cbiAgfVxufVxuIl19