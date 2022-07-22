import { _AbstractConstructor } from '@angular/material/core';
import { AfterViewInit } from '@angular/core';
import { CanColor } from '@angular/material/core';
import { ChangeDetectorRef } from '@angular/core';
import { _Constructor } from '@angular/material/core';
import { ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import * as i0 from '@angular/core';
import * as i2 from '@angular/material/core';
import { MAT_LEGACY_PROGRESS_BAR_DEFAULT_OPTIONS as MAT_PROGRESS_BAR_DEFAULT_OPTIONS } from '@angular/material/legacy-progress-bar';
import { MAT_LEGACY_PROGRESS_BAR_LOCATION as MAT_PROGRESS_BAR_LOCATION } from '@angular/material/legacy-progress-bar';
import { MAT_LEGACY_PROGRESS_BAR_LOCATION_FACTORY as MAT_PROGRESS_BAR_LOCATION_FACTORY } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressBarDefaultOptions as MatProgressBarDefaultOptions } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressBarLocation as MatProgressBarLocation } from '@angular/material/legacy-progress-bar';
import { NgZone } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { LegacyProgressAnimationEnd as ProgressAnimationEnd } from '@angular/material/legacy-progress-bar';

declare namespace i1 {
    export {
        ProgressBarMode,
        MatProgressBar
    }
}

export { MAT_PROGRESS_BAR_DEFAULT_OPTIONS }

export { MAT_PROGRESS_BAR_LOCATION }

export { MAT_PROGRESS_BAR_LOCATION_FACTORY }

export declare class MatProgressBar extends _MatProgressBarBase implements AfterViewInit, OnDestroy, CanColor {
    private _ngZone;
    private _changeDetectorRef;
    _animationMode?: string | undefined;
    constructor(elementRef: ElementRef<HTMLElement>, _ngZone: NgZone, _changeDetectorRef: ChangeDetectorRef, _animationMode?: string | undefined, defaults?: MatProgressBarDefaultOptions);
    /** Flag that indicates whether NoopAnimations mode is set to true. */
    _isNoopAnimation: boolean;
    /** Value of the progress bar. Defaults to zero. Mirrored to aria-valuenow. */
    get value(): number;
    set value(v: number);
    private _value;
    /** Buffer value of the progress bar. Defaults to zero. */
    get bufferValue(): number;
    set bufferValue(v: number);
    private _bufferValue;
    /**
     * Event emitted when animation of the primary progress bar completes. This event will not
     * be emitted when animations are disabled, nor will it be emitted for modes with continuous
     * animations (indeterminate and query).
     */
    readonly animationEnd: EventEmitter<ProgressAnimationEnd>;
    /**
     * Mode of the progress bar.
     *
     * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
     * 'determinate'.
     * Mirrored to mode attribute.
     */
    get mode(): ProgressBarMode;
    set mode(value: ProgressBarMode);
    private _mode;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Gets the transform style that should be applied to the primary bar. */
    _getPrimaryBarTransform(): string;
    /** Gets the `flex-basis` value that should be applied to the buffer bar. */
    _getBufferBarFlexBasis(): string;
    /** Returns whether the progress bar is indeterminate. */
    _isIndeterminate(): boolean;
    /** Event handler for `transitionend` events. */
    private _transitionendHandler;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatProgressBar, [null, null, null, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatProgressBar, "mat-progress-bar", ["matProgressBar"], { "color": "color"; "value": "value"; "bufferValue": "bufferValue"; "mode": "mode"; }, { "animationEnd": "animationEnd"; }, never, never, false>;
}

/** @docs-private */
declare const _MatProgressBarBase: _Constructor<CanColor> & _AbstractConstructor<CanColor> & {
    new (_elementRef: ElementRef<HTMLElement>): {
        _elementRef: ElementRef<HTMLElement>;
    };
};

export { MatProgressBarDefaultOptions }

export { MatProgressBarLocation }

export declare class MatProgressBarModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatProgressBarModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatProgressBarModule, [typeof i1.MatProgressBar], never, [typeof i1.MatProgressBar, typeof i2.MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatProgressBarModule>;
}

export { ProgressAnimationEnd }

export declare type ProgressBarMode = 'determinate' | 'indeterminate' | 'buffer' | 'query';

export { }
