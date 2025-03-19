import { D as DatepickerTriggerHarnessBase } from '../date-range-input-harness-3718a667.mjs';
export { C as CalendarView, e as MatCalendarCellHarness, d as MatCalendarHarness, c as MatDateRangeInputHarness, M as MatDatepickerInputHarness, b as MatEndDateHarness, a as MatStartDateHarness } from '../date-range-input-harness-3718a667.mjs';
import { HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import '../form-field-control-harness-efefd4cf.mjs';

/** Harness for interacting with a standard Material datepicker toggle in tests. */
class MatDatepickerToggleHarness extends DatepickerTriggerHarnessBase {
    static hostSelector = '.mat-datepicker-toggle';
    /** The clickable button inside the toggle. */
    _button = this.locatorFor('button');
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDatepickerToggleHarness` that
     * meets certain criteria.
     * @param options Options for filtering which datepicker toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDatepickerToggleHarness, options);
    }
    /** Gets whether the calendar associated with the toggle is open. */
    async isCalendarOpen() {
        return (await this.host()).hasClass('mat-datepicker-toggle-active');
    }
    /** Whether the toggle is disabled. */
    async isDisabled() {
        const button = await this._button();
        return coerceBooleanProperty(await button.getAttribute('disabled'));
    }
    async _openCalendar() {
        return (await this._button()).click();
    }
}

export { MatDatepickerToggleHarness };
//# sourceMappingURL=testing.mjs.map
