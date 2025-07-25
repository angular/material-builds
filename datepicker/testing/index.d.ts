import { D as DatepickerTriggerHarnessBase, a as DatepickerToggleHarnessFilters } from '../../date-range-input-harness.d-D9G3xNDV.js';
export { c as CalendarCellHarnessFilters, C as CalendarHarnessFilters, h as CalendarView, d as DateRangeInputHarnessFilters, b as DatepickerInputHarnessFilters, j as MatCalendarCellHarness, i as MatCalendarHarness, g as MatDateRangeInputHarness, M as MatDatepickerInputHarness, f as MatEndDateHarness, e as MatStartDateHarness } from '../../date-range-input-harness.d-D9G3xNDV.js';
import { HarnessPredicate } from '@angular/cdk/testing';
import '@angular/material/form-field/testing/control';

/** Harness for interacting with a standard Material datepicker toggle in tests. */
declare class MatDatepickerToggleHarness extends DatepickerTriggerHarnessBase {
    static hostSelector: string;
    /** The clickable button inside the toggle. */
    private _button;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDatepickerToggleHarness` that
     * meets certain criteria.
     * @param options Options for filtering which datepicker toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DatepickerToggleHarnessFilters): HarnessPredicate<MatDatepickerToggleHarness>;
    /** Gets whether the calendar associated with the toggle is open. */
    isCalendarOpen(): Promise<boolean>;
    /** Whether the toggle is disabled. */
    isDisabled(): Promise<boolean>;
    protected _openCalendar(): Promise<void>;
}

export { DatepickerToggleHarnessFilters, MatDatepickerToggleHarness };
