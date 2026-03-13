import { DatepickerTriggerHarnessBase, DatepickerToggleHarnessFilters, DatepickerActionsHarnessFilters } from './_date-range-input-harness-chunk.js';
export { CalendarCellHarnessFilters, CalendarHarnessFilters, CalendarView, DateRangeInputHarnessFilters, DatepickerInputHarnessFilters, MatCalendarCellHarness, MatCalendarHarness, MatDateRangeInputHarness, MatDatepickerInputHarness, MatEndDateHarness, MatStartDateHarness } from './_date-range-input-harness-chunk.js';
import { HarnessPredicate, ContentContainerComponentHarness } from '@angular/cdk/testing';
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

/** Harness for interacting with a standard Material datepicker actions in tests. */
declare class MatDatepickerActionsHarness extends ContentContainerComponentHarness<string> {
    static hostSelector: string;
    private _applyLocator;
    private _cancelLocator;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDatepickerActionsHarness` that
     * meets certain criteria.
     * @param options Options for filtering which datepicker actions instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DatepickerActionsHarnessFilters): HarnessPredicate<MatDatepickerActionsHarness>;
    /** Applies the current selection. */
    apply(): Promise<void>;
    /** Cancels the current selection. */
    cancel(): Promise<void>;
    private _clickAction;
}

export { DatepickerActionsHarnessFilters, DatepickerToggleHarnessFilters, MatDatepickerActionsHarness, MatDatepickerToggleHarness };
