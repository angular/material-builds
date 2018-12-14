/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, EventEmitter, NgZone, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DateAdapter, MatDateSelectionModel } from '@angular/material/core';
/**
 * Extra CSS classes that can be associated with a calendar cell.
 */
export declare type MatCalendarCellCssClasses = string | string[] | Set<string> | {
    [key: string]: any;
};
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 * @breaking-change 9.0.0 remove generic default type
 */
export declare class MatCalendarCell<D = unknown> {
    /** The range of dates represented by this cell (inclusive). */
    range: {
        start: D;
        end: D;
    };
    /** The text value to display in the cell. */
    displayValue: string;
    /** The aria-label to use for the cell. */
    ariaLabel: string;
    /** Whether the cell is enabled. */
    enabled: boolean;
    cssClasses?: string | Set<string> | {
        [key: string]: any;
    } | string[] | undefined;
    constructor(
    /** The range of dates represented by this cell (inclusive). */
    range: {
        start: D;
        end: D;
    }, 
    /** The text value to display in the cell. */
    displayValue: string, 
    /** The aria-label to use for the cell. */
    ariaLabel: string, 
    /** Whether the cell is enabled. */
    enabled: boolean, cssClasses?: string | Set<string> | {
        [key: string]: any;
    } | string[] | undefined);
}
/**
 * An internal component used to display calendar data in a table.
 * @docs-private
 */
export declare class MatCalendarBody<D = unknown> implements OnChanges, OnDestroy {
    private _elementRef;
    private _ngZone;
    private _cdr;
    private _dateAdapter;
    readonly _selectionModel: MatDateSelectionModel<D>;
    /** The label for the table. (e.g. "Jan 2017"). */
    label: string;
    /** The cells to display in the table. */
    rows: MatCalendarCell<D>[][];
    /**
     * The value in the table that corresponds to today.
     * @deprecated No longer needed since MatCalendarBody now gets today value from DateAdapter.
     * @breaking-change 9.0.0 remove this property
     */
    todayValue: number;
    /**
     * The value in the table that is currently selected.
     * @deprecated Please get/set the selection via the `MatDateSelectionModel` instead.
     * @breaking-change 9.0.0 remove this property.
     */
    selectedValue: number;
    /** The minimum number of free cells needed to fit the label in the first row. */
    labelMinRequiredCells: number;
    /** The number of columns in the table. */
    numCols: number;
    /** The cell number of the active cell in the table. */
    activeCell: number;
    /**
     * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
     * maintained even as the table resizes.
     */
    cellAspectRatio: number;
    /**
     * Emits when a new value is selected.
     * @deprecated Please listen for selection change via the `MatDateSelectionModel` instead.
     * @breaking-change 9.0.0 remove this property.
     */
    readonly selectedValueChange: EventEmitter<number>;
    /** The number of blank cells to put at the beginning for the first row. */
    _firstRowOffset: number;
    /** Padding for the individual date cells. */
    _cellPadding: string;
    /** Width of an individual cell. */
    _cellWidth: string;
    private _today;
    private _selectionSubscription;
    constructor(_elementRef: ElementRef<HTMLElement>, _ngZone: NgZone, _cdr: ChangeDetectorRef, _dateAdapter: DateAdapter<D>, _selectionModel: MatDateSelectionModel<D>);
    ngOnDestroy(): void;
    _cellClicked(cell: MatCalendarCell<D>): void;
    ngOnChanges(changes: SimpleChanges): void;
    _isActiveCell(rowIndex: number, colIndex: number): boolean;
    _isSelected(item: MatCalendarCell<D>): boolean;
    _isToday(item: MatCalendarCell<D>): boolean;
    /** Focuses the active cell after the microtask queue is empty. */
    _focusActiveCell(): void;
    _updateToday(): void;
    private _getFirstCellRange;
    private _getFirstCellGranularity;
}
