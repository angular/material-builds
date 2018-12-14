/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FactoryProvider, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DateAdapter } from './date-adapter';
/** A selection model used to represent the currently selected value in a date picker. */
export declare abstract class MatDateSelectionModel<D> implements OnDestroy {
    protected readonly adapter: DateAdapter<D>;
    /** Emits when the selected value has changed. */
    selectionChange: Subject<void>;
    protected constructor(adapter: DateAdapter<D>);
    ngOnDestroy(): void;
    /** Adds a date to the current selection. */
    abstract add(date: D): void;
    /** Clones this selection model. */
    abstract clone(): MatDateSelectionModel<D>;
    /** Gets the first date in the current selection. */
    abstract getFirstSelectedDate(): D | null;
    /** Gets the last date in the current selection. */
    abstract getLastSelectedDate(): D | null;
    /** Whether the selection is complete for this selection model. */
    abstract isComplete(): boolean;
    /** Whether the selection model contains the same selection as the given selection model. */
    abstract isSame(other: MatDateSelectionModel<D>): boolean;
    /** Whether the current selection is valid. */
    abstract isValid(): boolean;
    /** Whether the given date is contained in the current selection. */
    abstract contains(value: D): boolean;
    /** Whether the given date range overlaps the current selection in any way. */
    abstract overlaps(range: DateRange<D>): boolean;
}
/** Represents a date range. */
export interface DateRange<D> {
    /** The start of the range. */
    start: D | null;
    /** The end of the range. */
    end: D | null;
}
/** A concrete implementation of a `MatDateSelectionModel` that holds a single date. */
export declare class MatSingleDateSelectionModel<D> extends MatDateSelectionModel<D> {
    private date;
    constructor(adapter: DateAdapter<D>);
    /** Sets the current selection. */
    setSelection(date: D | null): void;
    /** Gets the current selection. */
    getSelection(): D | null;
    /**
     * Adds the given date to the selection model. For a `MatSingleDateSelectionModel` this means
     * simply replacing the current selection with the given selection.
     */
    add(date: D): void;
    clone(): MatDateSelectionModel<D>;
    getFirstSelectedDate(): D | null;
    getLastSelectedDate(): D | null;
    isComplete(): boolean;
    isSame(other: MatDateSelectionModel<D>): boolean;
    isValid(): boolean;
    contains(value: D): boolean;
    /**
     * Determines if the single date is within a given date range. Retuns false if either dates of
     * the range is null or if the selection is undefined.
     */
    overlaps(range: DateRange<D>): boolean;
}
/**
 * Concrete implementation of a MatDateSelectionModel that holds a date range, represented by
 * a start date and an end date.
 */
export declare class MatRangeDateSelectionModel<D> extends MatDateSelectionModel<D> {
    private start;
    private end;
    constructor(adapter: DateAdapter<D>);
    /** Sets the current selection. */
    setSelection(range: DateRange<D>): void;
    /** Gets the current selection. */
    getSelection(): DateRange<D>;
    /**
     * Adds the given date to the selection model. For a `MatRangeDateSelectionModel` this means:
     * - Setting the start date if nothing is already selected.
     * - Setting the end date if the start date is already set but the end is not.
     * - Clearing the selection and setting the start date if both the start and end are already set.
     */
    add(date: D): void;
    clone(): MatDateSelectionModel<D>;
    getFirstSelectedDate(): D | null;
    getLastSelectedDate(): D | null;
    isComplete(): boolean;
    isSame(other: MatDateSelectionModel<D>): boolean;
    isValid(): boolean;
    contains(value: D): boolean;
    /**
     * Returns true if the given range and the selection overlap in any way. False if otherwise, that
     * includes incomplete selections or ranges.
     */
    overlaps(range: DateRange<D>): boolean;
    private isBetween;
}
export declare function MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY<D>(parent: MatSingleDateSelectionModel<D>, adapter: DateAdapter<D>): MatSingleDateSelectionModel<D>;
export declare const MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER: FactoryProvider;
