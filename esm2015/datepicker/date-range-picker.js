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
MatDateRangePicker.decorators = [
    { type: Component, args: [{
                selector: 'mat-date-range-picker',
                template: '',
                exportAs: 'matDateRangePicker',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                providers: [
                    MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
                    MAT_CALENDAR_RANGE_STRATEGY_PROVIDER,
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXJhbmdlLXBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BGLE9BQU8sRUFBQyxpQkFBaUIsRUFBNkMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRyxPQUFPLEVBQUMsdUNBQXVDLEVBQVksTUFBTSx3QkFBd0IsQ0FBQztBQUMxRixPQUFPLEVBQUMsb0NBQW9DLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQVdyRiw4RkFBOEY7QUFDOUYsNkZBQTZGO0FBQzdGLCtFQUErRTtBQUMvRSw2RUFBNkU7QUFZN0UsTUFBTSxPQUFPLGtCQUFzQixTQUFRLGlCQUN6QjtJQUNOLHFCQUFxQixDQUFDLFFBQStDO1FBQzdFLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV0QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBRW5DLElBQUksS0FBSyxFQUFFO1lBQ1QsUUFBUSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO1lBQ2pELFFBQVEsQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztTQUM5QztJQUNILENBQUM7OztZQXRCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxTQUFTLEVBQUU7b0JBQ1QsdUNBQXVDO29CQUN2QyxvQ0FBb0M7aUJBQ3JDO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJCYXNlLCBNYXREYXRlcGlja2VyQ29udGVudCwgTWF0RGF0ZXBpY2tlckNvbnRyb2x9IGZyb20gJy4vZGF0ZXBpY2tlci1iYXNlJztcbmltcG9ydCB7TUFUX1JBTkdFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSLCBEYXRlUmFuZ2V9IGZyb20gJy4vZGF0ZS1zZWxlY3Rpb24tbW9kZWwnO1xuaW1wb3J0IHtNQVRfQ0FMRU5EQVJfUkFOR0VfU1RSQVRFR1lfUFJPVklERVJ9IGZyb20gJy4vZGF0ZS1yYW5nZS1zZWxlY3Rpb24tc3RyYXRlZ3knO1xuXG4vKipcbiAqIElucHV0IHRoYXQgY2FuIGJlIGFzc29jaWF0ZWQgd2l0aCBhIGRhdGUgcmFuZ2UgcGlja2VyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdERhdGVSYW5nZVBpY2tlcklucHV0PEQ+IGV4dGVuZHMgTWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4ge1xuICBjb21wYXJpc29uU3RhcnQ6IER8bnVsbDtcbiAgY29tcGFyaXNvbkVuZDogRHxudWxsO1xufVxuXG4vLyBUT0RPKG1tYWxlcmJhKTogV2UgdXNlIGEgY29tcG9uZW50IGluc3RlYWQgb2YgYSBkaXJlY3RpdmUgaGVyZSBzbyB0aGUgdXNlciBjYW4gdXNlIGltcGxpY2l0XG4vLyB0ZW1wbGF0ZSByZWZlcmVuY2UgdmFyaWFibGVzIChlLmcuICNkIHZzICNkPVwibWF0RGF0ZVJhbmdlUGlja2VyXCIpLiBXZSBjYW4gY2hhbmdlIHRoaXMgdG8gYVxuLy8gZGlyZWN0aXZlIGlmIGFuZ3VsYXIgYWRkcyBzdXBwb3J0IGZvciBgZXhwb3J0QXM6ICckaW1wbGljaXQnYCBvbiBkaXJlY3RpdmVzLlxuLyoqIENvbXBvbmVudCByZXNwb25zaWJsZSBmb3IgbWFuYWdpbmcgdGhlIGRhdGUgcmFuZ2UgcGlja2VyIHBvcHVwL2RpYWxvZy4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kYXRlLXJhbmdlLXBpY2tlcicsXG4gIHRlbXBsYXRlOiAnJyxcbiAgZXhwb3J0QXM6ICdtYXREYXRlUmFuZ2VQaWNrZXInLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTUFUX1JBTkdFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSLFxuICAgIE1BVF9DQUxFTkRBUl9SQU5HRV9TVFJBVEVHWV9QUk9WSURFUixcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRlUmFuZ2VQaWNrZXI8RD4gZXh0ZW5kcyBNYXREYXRlcGlja2VyQmFzZTxNYXREYXRlUmFuZ2VQaWNrZXJJbnB1dDxEPixcbiAgRGF0ZVJhbmdlPEQ+LCBEPiB7XG4gIHByb3RlY3RlZCBfZm9yd2FyZENvbnRlbnRWYWx1ZXMoaW5zdGFuY2U6IE1hdERhdGVwaWNrZXJDb250ZW50PERhdGVSYW5nZTxEPiwgRD4pIHtcbiAgICBzdXBlci5fZm9yd2FyZENvbnRlbnRWYWx1ZXMoaW5zdGFuY2UpO1xuXG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmRhdGVwaWNrZXJJbnB1dDtcblxuICAgIGlmIChpbnB1dCkge1xuICAgICAgaW5zdGFuY2UuY29tcGFyaXNvblN0YXJ0ID0gaW5wdXQuY29tcGFyaXNvblN0YXJ0O1xuICAgICAgaW5zdGFuY2UuY29tcGFyaXNvbkVuZCA9IGlucHV0LmNvbXBhcmlzb25FbmQ7XG4gICAgfVxuICB9XG59XG4iXX0=