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
        }
    }
}
MatDateRangePicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatDateRangePicker, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatDateRangePicker.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatDateRangePicker, selector: "mat-date-range-picker", providers: [
        MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
        MAT_CALENDAR_RANGE_STRATEGY_PROVIDER,
        { provide: MatDatepickerBase, useExisting: MatDateRangePicker },
    ], exportAs: ["matDateRangePicker"], usesInheritance: true, ngImport: i0, template: '', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatDateRangePicker, decorators: [{
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
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXJhbmdlLXBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BGLE9BQU8sRUFBQyxpQkFBaUIsRUFBNkMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRyxPQUFPLEVBQUMsdUNBQXVDLEVBQVksTUFBTSx3QkFBd0IsQ0FBQztBQUMxRixPQUFPLEVBQUMsb0NBQW9DLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQzs7QUFXckYsOEZBQThGO0FBQzlGLDZGQUE2RjtBQUM3RiwrRUFBK0U7QUFDL0UsNkVBQTZFO0FBYTdFLE1BQU0sT0FBTyxrQkFBc0IsU0FBUSxpQkFDekI7SUFDRyxxQkFBcUIsQ0FBQyxRQUErQztRQUN0RixLQUFLLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUVuQyxJQUFJLEtBQUssRUFBRTtZQUNULFFBQVEsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztZQUNqRCxRQUFRLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7U0FDOUM7SUFDSCxDQUFDOzt1SEFYVSxrQkFBa0I7MkdBQWxCLGtCQUFrQixnREFObEI7UUFDVCx1Q0FBdUM7UUFDdkMsb0NBQW9DO1FBQ3BDLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBQztLQUM5RCxtRkFSUyxFQUFFO21HQVVELGtCQUFrQjtrQkFaOUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsdUJBQXVCO29CQUNqQyxRQUFRLEVBQUUsRUFBRTtvQkFDWixRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLFNBQVMsRUFBRTt3QkFDVCx1Q0FBdUM7d0JBQ3ZDLG9DQUFvQzt3QkFDcEMsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxvQkFBb0IsRUFBQztxQkFDOUQ7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJCYXNlLCBNYXREYXRlcGlja2VyQ29udGVudCwgTWF0RGF0ZXBpY2tlckNvbnRyb2x9IGZyb20gJy4vZGF0ZXBpY2tlci1iYXNlJztcbmltcG9ydCB7TUFUX1JBTkdFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSLCBEYXRlUmFuZ2V9IGZyb20gJy4vZGF0ZS1zZWxlY3Rpb24tbW9kZWwnO1xuaW1wb3J0IHtNQVRfQ0FMRU5EQVJfUkFOR0VfU1RSQVRFR1lfUFJPVklERVJ9IGZyb20gJy4vZGF0ZS1yYW5nZS1zZWxlY3Rpb24tc3RyYXRlZ3knO1xuXG4vKipcbiAqIElucHV0IHRoYXQgY2FuIGJlIGFzc29jaWF0ZWQgd2l0aCBhIGRhdGUgcmFuZ2UgcGlja2VyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdERhdGVSYW5nZVBpY2tlcklucHV0PEQ+IGV4dGVuZHMgTWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4ge1xuICBjb21wYXJpc29uU3RhcnQ6IER8bnVsbDtcbiAgY29tcGFyaXNvbkVuZDogRHxudWxsO1xufVxuXG4vLyBUT0RPKG1tYWxlcmJhKTogV2UgdXNlIGEgY29tcG9uZW50IGluc3RlYWQgb2YgYSBkaXJlY3RpdmUgaGVyZSBzbyB0aGUgdXNlciBjYW4gdXNlIGltcGxpY2l0XG4vLyB0ZW1wbGF0ZSByZWZlcmVuY2UgdmFyaWFibGVzIChlLmcuICNkIHZzICNkPVwibWF0RGF0ZVJhbmdlUGlja2VyXCIpLiBXZSBjYW4gY2hhbmdlIHRoaXMgdG8gYVxuLy8gZGlyZWN0aXZlIGlmIGFuZ3VsYXIgYWRkcyBzdXBwb3J0IGZvciBgZXhwb3J0QXM6ICckaW1wbGljaXQnYCBvbiBkaXJlY3RpdmVzLlxuLyoqIENvbXBvbmVudCByZXNwb25zaWJsZSBmb3IgbWFuYWdpbmcgdGhlIGRhdGUgcmFuZ2UgcGlja2VyIHBvcHVwL2RpYWxvZy4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kYXRlLXJhbmdlLXBpY2tlcicsXG4gIHRlbXBsYXRlOiAnJyxcbiAgZXhwb3J0QXM6ICdtYXREYXRlUmFuZ2VQaWNrZXInLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTUFUX1JBTkdFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSLFxuICAgIE1BVF9DQUxFTkRBUl9SQU5HRV9TVFJBVEVHWV9QUk9WSURFUixcbiAgICB7cHJvdmlkZTogTWF0RGF0ZXBpY2tlckJhc2UsIHVzZUV4aXN0aW5nOiBNYXREYXRlUmFuZ2VQaWNrZXJ9LFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1hdERhdGVSYW5nZVBpY2tlcjxEPiBleHRlbmRzIE1hdERhdGVwaWNrZXJCYXNlPE1hdERhdGVSYW5nZVBpY2tlcklucHV0PEQ+LFxuICBEYXRlUmFuZ2U8RD4sIEQ+IHtcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9mb3J3YXJkQ29udGVudFZhbHVlcyhpbnN0YW5jZTogTWF0RGF0ZXBpY2tlckNvbnRlbnQ8RGF0ZVJhbmdlPEQ+LCBEPikge1xuICAgIHN1cGVyLl9mb3J3YXJkQ29udGVudFZhbHVlcyhpbnN0YW5jZSk7XG5cbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuZGF0ZXBpY2tlcklucHV0O1xuXG4gICAgaWYgKGlucHV0KSB7XG4gICAgICBpbnN0YW5jZS5jb21wYXJpc29uU3RhcnQgPSBpbnB1dC5jb21wYXJpc29uU3RhcnQ7XG4gICAgICBpbnN0YW5jZS5jb21wYXJpc29uRW5kID0gaW5wdXQuY29tcGFyaXNvbkVuZDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==