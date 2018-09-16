/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Subject } from 'rxjs';
import { DateAdapter } from './date-adapter';
export declare abstract class MatDateSelection<D> {
    protected readonly adapter: DateAdapter<D>;
    valueChanges: Subject<void>;
    constructor(adapter: DateAdapter<D>);
    dispose(): void;
    abstract add(date: D): void;
    abstract clone(): MatDateSelection<D>;
    abstract getFirstSelectedDate(): D | null;
    abstract getLastSelectedDate(): D | null;
    abstract isComplete(): boolean;
    abstract isSame(other: MatDateSelection<D>): boolean;
    abstract isValid(): boolean;
}
export interface DateRange<D> {
    start: D | null;
    end: D | null;
}
/**
 * Concrete implementation of a MatDateSelection that holds a single date.
 */
export declare class MatSingleDateSelection<D> extends MatDateSelection<D> {
    private date;
    constructor(adapter: DateAdapter<D>, date?: D | null);
    add(date: D): void;
    clone(): MatDateSelection<D>;
    getFirstSelectedDate(): D | null;
    getLastSelectedDate(): D | null;
    isComplete(): boolean;
    isSame(other: MatDateSelection<D>): boolean;
    isValid(): boolean;
    asDate(): D | null;
}
/**
 * Concrete implementation of a MatDateSelection that holds a date range, represented by
 * a start date and an end date.
 */
export declare class MatRangeDateSelection<D> extends MatDateSelection<D> {
    private start;
    private end;
    constructor(adapter: DateAdapter<D>, start?: D | null, end?: D | null);
    /**
     * Adds an additional date to the range. If no date is set thus far, it will set it to the
     * beginning. If the beginning is set, it will set it to the end.
     * If add is called on a complete selection, it will empty the selection and set it as the start.
     */
    add(date: D): void;
    clone(): MatDateSelection<D>;
    getFirstSelectedDate(): D | null;
    getLastSelectedDate(): D | null;
    setFirstSelectedDate(value: D | null): void;
    setLastSelectedDate(value: D | null): void;
    isComplete(): boolean;
    isSame(other: MatDateSelection<D>): boolean;
    isValid(): boolean;
    asRange(): DateRange<D>;
}
