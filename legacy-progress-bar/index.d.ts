import { _AbstractConstructor } from '@angular/material/core';
import { AfterViewInit } from '@angular/core';
import { CanColor } from '@angular/material/core';
import { ChangeDetectorRef } from '@angular/core';
import { _Constructor } from '@angular/material/core';
import { ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import * as i0 from '@angular/core';
import * as i2 from '@angular/common';
import * as i3 from '@angular/material/core';
import { InjectionToken } from '@angular/core';
import { NgZone } from '@angular/core';
import { NumberInput } from '@angular/cdk/coercion';
import { OnDestroy } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

declare namespace i1 {
    export {
        MAT_LEGACY_PROGRESS_BAR_LOCATION_FACTORY,
        LegacyProgressAnimationEnd,
        MAT_LEGACY_PROGRESS_BAR_LOCATION,
        MatLegacyProgressBarLocation,
        LegacyProgressBarMode,
        MatLegacyProgressBarDefaultOptions,
        MAT_LEGACY_PROGRESS_BAR_DEFAULT_OPTIONS,
        MatLegacyProgressBar
    }
}

/** Last animation end data. */
export declare interface LegacyProgressAnimationEnd {
    value: number;
}

export declare type LegacyProgressBarMode = 'determinate' | 'indeterminate' | 'buffer' | 'query';

/** Injection token to be used to override the default options for `mat-progress-bar`. */
export declare const MAT_LEGACY_PROGRESS_BAR_DEFAULT_OPTIONS: InjectionToken<MatLegacyProgressBarDefaultOptions>;

/**
 * Injection token used to provide the current location to `MatProgressBar`.
 * Used to handle server-side rendering and to stub out during unit tests.
 * @docs-private
 */
export declare const MAT_LEGACY_PROGRESS_BAR_LOCATION: InjectionToken<MatLegacyProgressBarLocation>;

/** @docs-private */
export declare function MAT_LEGACY_PROGRESS_BAR_LOCATION_FACTORY(): MatLegacyProgressBarLocation;

/**
 * `<mat-progress-bar>` component.
 */
export declare class MatLegacyProgressBar extends _MatProgressBarBase implements CanColor, AfterViewInit, OnDestroy {
    private _ngZone;
    _animationMode?: string | undefined;
    /**
     * @deprecated `_changeDetectorRef` parameter to be made required.
     * @breaking-change 11.0.0
     */
    private _changeDetectorRef?;
    constructor(elementRef: ElementRef, _ngZone: NgZone, _animationMode?: string | undefined, 
    /**
     * @deprecated `location` parameter to be made required.
     * @breaking-change 8.0.0
     */
    location?: MatLegacyProgressBarLocation, defaults?: MatLegacyProgressBarDefaultOptions, 
    /**
     * @deprecated `_changeDetectorRef` parameter to be made required.
     * @breaking-change 11.0.0
     */
    _changeDetectorRef?: ChangeDetectorRef | undefined);
    /** Flag that indicates whether NoopAnimations mode is set to true. */
    _isNoopAnimation: boolean;
    /** Value of the progress bar. Defaults to zero. Mirrored to aria-valuenow. */
    get value(): number;
    set value(v: NumberInput);
    private _value;
    /** Buffer value of the progress bar. Defaults to zero. */
    get bufferValue(): number;
    set bufferValue(v: number);
    private _bufferValue;
    _primaryValueBar: ElementRef;
    /**
     * Event emitted when animation of the primary progress bar completes. This event will not
     * be emitted when animations are disabled, nor will it be emitted for modes with continuous
     * animations (indeterminate and query).
     */
    readonly animationEnd: EventEmitter<LegacyProgressAnimationEnd>;
    /** Reference to animation end subscription to be unsubscribed on destroy. */
    private _animationEndSubscription;
    /**
     * Mode of the progress bar.
     *
     * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
     * 'determinate'.
     * Mirrored to mode attribute.
     */
    mode: LegacyProgressBarMode;
    /** ID of the progress bar. */
    progressbarId: string;
    /** Attribute to be used for the `fill` attribute on the internal `rect` element. */
    _rectangleFillValue: string;
    /** Gets the current transform value for the progress bar's primary indicator. */
    _primaryTransform(): {
        transform: string;
    };
    /**
     * Gets the current transform value for the progress bar's buffer indicator. Only used if the
     * progress mode is set to buffer, otherwise returns an undefined, causing no transformation.
     */
    _bufferTransform(): {
        transform: string;
    } | null;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLegacyProgressBar, [null, null, { optional: true; }, { optional: true; }, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatLegacyProgressBar, "mat-progress-bar", ["matProgressBar"], { "color": "color"; "value": "value"; "bufferValue": "bufferValue"; "mode": "mode"; }, { "animationEnd": "animationEnd"; }, never, never, false>;
}

/** Default `mat-progress-bar` options that can be overridden. */
export declare interface MatLegacyProgressBarDefaultOptions {
    /** Default color of the progress bar. */
    color?: ThemePalette;
    /** Default mode of the progress bar. */
    mode?: LegacyProgressBarMode;
}

/**
 * Stubbed out location for `MatProgressBar`.
 * @docs-private
 */
export declare interface MatLegacyProgressBarLocation {
    getPathname: () => string;
}

export declare class MatLegacyProgressBarModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLegacyProgressBarModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatLegacyProgressBarModule, [typeof i1.MatLegacyProgressBar], [typeof i2.CommonModule, typeof i3.MatCommonModule], [typeof i1.MatLegacyProgressBar, typeof i3.MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatLegacyProgressBarModule>;
}

/** @docs-private */
declare const _MatProgressBarBase: _Constructor<CanColor> & _AbstractConstructor<CanColor> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};

export { }
