import * as i0 from '@angular/core';
import { Version, InjectionToken, Provider } from '@angular/core';
export { G as GranularSanityChecks, a as MATERIAL_SANITY_CHECKS, M as MatCommonModule, S as SanityChecks } from '../common-module.d-0e6515ae.js';
export { T as ThemePalette } from '../palette.d-ec4a617c.js';
import { NgControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { E as ErrorStateMatcher$1 } from '../error-options.d-448d9046.js';
export { E as ErrorStateMatcher, S as ShowOnDirtyErrorStateMatcher } from '../error-options.d-448d9046.js';
export { M as MatLine, a as MatLineModule, s as setLines } from '../line.d-570a2537.js';
export { M as MatOptionModule } from '../index.d-37e31cd3.js';
export { M as MatRippleLoader } from '../ripple-loader.d-8aac2988.js';
export { M as MatRippleModule } from '../index.d-0536b706.js';
export { b as MatPseudoCheckbox, M as MatPseudoCheckboxModule, a as MatPseudoCheckboxState } from '../pseudo-checkbox-module.d-3abc0461.js';
import { D as DateAdapter } from '../date-adapter.d-c6835d41.js';
export { D as DateAdapter, M as MAT_DATE_LOCALE, a as MAT_DATE_LOCALE_FACTORY } from '../date-adapter.d-c6835d41.js';
export { d as MAT_OPTGROUP, a as MatOptgroup, M as MatOption, b as MatOptionSelectionChange, _ as _countGroupLabelsBeforeOption, c as _getOptionScrollPosition } from '../option.d-6f493d78.js';
export { a as MAT_OPTION_PARENT_COMPONENT, M as MatOptionParentComponent } from '../option-parent.d-559ad5c5.js';
export { c as MAT_RIPPLE_GLOBAL_OPTIONS, M as MatRipple, g as RippleAnimationConfig, f as RippleConfig, b as RippleGlobalOptions, h as RippleRef, R as RippleRenderer, e as RippleState, a as RippleTarget, d as defaultRippleAnimationConfig } from '../ripple.d-2fb57d04.js';
import '@angular/cdk/bidi';
import '@angular/cdk/a11y';
import '@angular/cdk/platform';

/** Current version of Angular Material. */
declare const VERSION: Version;

/**
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 * @docs-private
 */
declare class AnimationCurves {
    static STANDARD_CURVE: string;
    static DECELERATION_CURVE: string;
    static ACCELERATION_CURVE: string;
    static SHARP_CURVE: string;
}
/**
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 * @docs-private
 */
declare class AnimationDurations {
    static COMPLEX: string;
    static ENTERING: string;
    static EXITING: string;
}

interface ErrorStateMatcher extends ErrorStateMatcher$1 {
}
/**
 * Class that tracks the error state of a component.
 * @docs-private
 */
declare class _ErrorStateTracker {
    private _defaultMatcher;
    ngControl: NgControl | null;
    private _parentFormGroup;
    private _parentForm;
    private _stateChanges;
    /** Whether the tracker is currently in an error state. */
    errorState: boolean;
    /** User-defined matcher for the error state. */
    matcher: ErrorStateMatcher;
    constructor(_defaultMatcher: ErrorStateMatcher | null, ngControl: NgControl | null, _parentFormGroup: FormGroupDirective | null, _parentForm: NgForm | null, _stateChanges: Subject<void>);
    /** Updates the error state based on the provided error state matcher. */
    updateErrorState(): void;
}

type MatDateFormats = {
    parse: {
        dateInput: any;
        timeInput?: any;
    };
    display: {
        dateInput: any;
        monthLabel?: any;
        monthYearLabel: any;
        dateA11yLabel: any;
        monthYearA11yLabel: any;
        timeInput?: any;
        timeOptionLabel?: any;
    };
};
declare const MAT_DATE_FORMATS: InjectionToken<MatDateFormats>;

/** Adapts the native JS Date for use with cdk-based components that work with dates. */
declare class NativeDateAdapter extends DateAdapter<Date> {
    /**
     * @deprecated No longer being used. To be removed.
     * @breaking-change 14.0.0
     */
    useUtcForDisplay: boolean;
    /** The injected locale. */
    private readonly _matDateLocale;
    constructor(...args: unknown[]);
    getYear(date: Date): number;
    getMonth(date: Date): number;
    getDate(date: Date): number;
    getDayOfWeek(date: Date): number;
    getMonthNames(style: 'long' | 'short' | 'narrow'): string[];
    getDateNames(): string[];
    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[];
    getYearName(date: Date): string;
    getFirstDayOfWeek(): number;
    getNumDaysInMonth(date: Date): number;
    clone(date: Date): Date;
    createDate(year: number, month: number, date: number): Date;
    today(): Date;
    parse(value: any, parseFormat?: any): Date | null;
    format(date: Date, displayFormat: Object): string;
    addCalendarYears(date: Date, years: number): Date;
    addCalendarMonths(date: Date, months: number): Date;
    addCalendarDays(date: Date, days: number): Date;
    toIso8601(date: Date): string;
    /**
     * Returns the given value if given a valid Date or null. Deserializes valid ISO 8601 strings
     * (https://www.ietf.org/rfc/rfc3339.txt) into valid Dates and empty string into null. Returns an
     * invalid date for all other values.
     */
    deserialize(value: any): Date | null;
    isDateInstance(obj: any): obj is Date;
    isValid(date: Date): boolean;
    invalid(): Date;
    setTime(target: Date, hours: number, minutes: number, seconds: number): Date;
    getHours(date: Date): number;
    getMinutes(date: Date): number;
    getSeconds(date: Date): number;
    parseTime(userValue: any, parseFormat?: any): Date | null;
    addSeconds(date: Date, amount: number): Date;
    /** Creates a date but allows the month and date to overflow. */
    private _createDateWithOverflow;
    /**
     * Pads a number to make it two digits.
     * @param n The number to pad.
     * @returns The padded number.
     */
    private _2digit;
    /**
     * When converting Date object to string, javascript built-in functions may return wrong
     * results because it applies its internal DST rules. The DST rules around the world change
     * very frequently, and the current valid rule is not always valid in previous years though.
     * We work around this problem building a new Date object which has its internal UTC
     * representation with the local date and time.
     * @param dtf Intl.DateTimeFormat object, containing the desired string format. It must have
     *    timeZone set to 'utc' to work fine.
     * @param date Date from which we want to get the string representation according to dtf
     * @returns A Date object with its UTC representation based on the passed in date info
     */
    private _format;
    /**
     * Attempts to parse a time string into a date object. Returns null if it cannot be parsed.
     * @param value Time string to parse.
     */
    private _parseTimeString;
    static ɵfac: i0.ɵɵFactoryDeclaration<NativeDateAdapter, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NativeDateAdapter>;
}

declare const MAT_NATIVE_DATE_FORMATS: MatDateFormats;

declare class NativeDateModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<NativeDateModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<NativeDateModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<NativeDateModule>;
}
declare class MatNativeDateModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatNativeDateModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatNativeDateModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatNativeDateModule>;
}
declare function provideNativeDateAdapter(formats?: MatDateFormats): Provider[];

/**
 * Component used to load structural styles for focus indicators.
 * @docs-private
 */
declare class _StructuralStylesLoader {
    static ɵfac: i0.ɵɵFactoryDeclaration<_StructuralStylesLoader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<_StructuralStylesLoader, "structural-styles", never, {}, {}, never, never, true, never>;
}

/**
 * Internal shared component used as a container in form field controls.
 * Not to be confused with `mat-form-field` which MDC calls a "text field".
 * @docs-private
 */
declare class _MatInternalFormField {
    /** Position of the label relative to the content. */
    labelPosition: 'before' | 'after';
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatInternalFormField, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<_MatInternalFormField, "div[mat-internal-form-field]", never, { "labelPosition": { "alias": "labelPosition"; "required": true; }; }, {}, never, ["*"], true, never>;
}

export { AnimationCurves, AnimationDurations, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, type MatDateFormats, MatNativeDateModule, NativeDateAdapter, NativeDateModule, VERSION, _ErrorStateTracker, _MatInternalFormField, _StructuralStylesLoader, provideNativeDateAdapter };
