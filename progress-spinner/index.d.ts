import { _AbstractConstructor } from '@angular/material/core';
import { CanColor } from '@angular/material/core';
import { _Constructor } from '@angular/material/core';
import { ElementRef } from '@angular/core';
import * as i0 from '@angular/core';
import * as i2 from '@angular/common';
import * as i3 from '@angular/material/core';
import { MAT_LEGACY_PROGRESS_SPINNER_DEFAULT_OPTIONS as MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS } from '@angular/material/legacy-progress-spinner';
import { MAT_LEGACY_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY as MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY } from '@angular/material/legacy-progress-spinner';
import { MatLegacyProgressSpinnerDefaultOptions as MatProgressSpinnerDefaultOptions } from '@angular/material/legacy-progress-spinner';
import { NumberInput } from '@angular/cdk/coercion';

declare namespace i1 {
    export {
        ProgressSpinnerMode,
        MatProgressSpinner,
        MatSpinner
    }
}

export { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS }

export { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY }

export declare class MatProgressSpinner extends _MatProgressSpinnerBase implements CanColor {
    /** Whether the _mat-animation-noopable class should be applied, disabling animations.  */
    _noopAnimations: boolean;
    /** The element of the determinate spinner. */
    _determinateCircle: ElementRef<HTMLElement>;
    constructor(elementRef: ElementRef<HTMLElement>, animationMode: string, defaults?: MatProgressSpinnerDefaultOptions);
    /**
     * Mode of the progress bar.
     *
     * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
     * 'determinate'.
     * Mirrored to mode attribute.
     */
    mode: ProgressSpinnerMode;
    /** Value of the progress bar. Defaults to zero. Mirrored to aria-valuenow. */
    get value(): number;
    set value(v: NumberInput);
    private _value;
    /** The diameter of the progress spinner (will set width and height of svg). */
    get diameter(): number;
    set diameter(size: NumberInput);
    private _diameter;
    /** Stroke width of the progress spinner. */
    get strokeWidth(): number;
    set strokeWidth(value: NumberInput);
    private _strokeWidth;
    /** The radius of the spinner, adjusted for stroke width. */
    _circleRadius(): number;
    /** The view box of the spinner's svg element. */
    _viewBox(): string;
    /** The stroke circumference of the svg circle. */
    _strokeCircumference(): number;
    /** The dash offset of the svg circle. */
    _strokeDashOffset(): number | null;
    /** Stroke width of the circle in percent. */
    _circleStrokeWidth(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatProgressSpinner, [null, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatProgressSpinner, "mat-progress-spinner, mat-spinner", ["matProgressSpinner"], { "color": "color"; "mode": "mode"; "value": "value"; "diameter": "diameter"; "strokeWidth": "strokeWidth"; }, {}, never, never, false>;
}

declare const _MatProgressSpinnerBase: _Constructor<CanColor> & _AbstractConstructor<CanColor> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};

export { MatProgressSpinnerDefaultOptions }

export declare class MatProgressSpinnerModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatProgressSpinnerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatProgressSpinnerModule, [typeof i1.MatProgressSpinner, typeof i1.MatProgressSpinner], [typeof i2.CommonModule], [typeof i1.MatProgressSpinner, typeof i1.MatProgressSpinner, typeof i3.MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatProgressSpinnerModule>;
}

/**
 * `<mat-spinner>` component.
 *
 * This is a component definition to be used as a convenience reference to create an
 * indeterminate `<mat-progress-spinner>` instance.
 */
export declare const MatSpinner: typeof MatProgressSpinner;

/** Possible mode for a progress spinner. */
export declare type ProgressSpinnerMode = 'determinate' | 'indeterminate';

export { }
