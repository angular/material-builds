import { AfterViewInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import * as i0 from '@angular/core';
import * as i2 from '@angular/material/core';
import { InjectionToken } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

declare namespace i1 {
    export {
        MAT_PROGRESS_BAR_LOCATION_FACTORY,
        ProgressAnimationEnd,
        MatProgressBarDefaultOptions,
        MAT_PROGRESS_BAR_DEFAULT_OPTIONS,
        MAT_PROGRESS_BAR_LOCATION,
        MatProgressBarLocation,
        ProgressBarMode,
        MatProgressBar
    }
}

/** Injection token to be used to override the default options for `mat-progress-bar`. */
export declare const MAT_PROGRESS_BAR_DEFAULT_OPTIONS: InjectionToken<MatProgressBarDefaultOptions>;

/**
 * Injection token used to provide the current location to `MatProgressBar`.
 * Used to handle server-side rendering and to stub out during unit tests.
 * @docs-private
 */
export declare const MAT_PROGRESS_BAR_LOCATION: InjectionToken<MatProgressBarLocation>;

/** @docs-private */
export declare function MAT_PROGRESS_BAR_LOCATION_FACTORY(): MatProgressBarLocation;

export declare class MatProgressBar implements AfterViewInit, OnDestroy {
    readonly _elementRef: ElementRef<HTMLElement>;
    private _ngZone;
    private _changeDetectorRef;
    private _renderer;
    private _cleanupTransitionEnd;
    _animationMode?: "NoopAnimations" | "BrowserAnimations" | null | undefined;
    constructor(...args: unknown[]);
    /** Flag that indicates whether NoopAnimations mode is set to true. */
    _isNoopAnimation: boolean;
    /**
     * Theme color of the progress bar. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.io/components/progress-bar/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.io/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    get color(): string | null | undefined;
    set color(value: string | null | undefined);
    private _color;
    private _defaultColor;
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
    static ɵfac: i0.ɵɵFactoryDeclaration<MatProgressBar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatProgressBar, "mat-progress-bar", ["matProgressBar"], { "color": { "alias": "color"; "required": false; }; "value": { "alias": "value"; "required": false; }; "bufferValue": { "alias": "bufferValue"; "required": false; }; "mode": { "alias": "mode"; "required": false; }; }, { "animationEnd": "animationEnd"; }, never, never, true, never>;
    static ngAcceptInputType_value: unknown;
    static ngAcceptInputType_bufferValue: unknown;
}

/** Default `mat-progress-bar` options that can be overridden. */
export declare interface MatProgressBarDefaultOptions {
    /**
     * Default theme color of the progress bar. This API is supported in M2 themes only,
     * it has no effect in M3 themes. For color customization in M3, see https://material.angular.io/components/progress-bar/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.io/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color?: ThemePalette;
    /** Default mode of the progress bar. */
    mode?: ProgressBarMode;
}

/**
 * Stubbed out location for `MatProgressBar`.
 * @docs-private
 */
export declare interface MatProgressBarLocation {
    getPathname: () => string;
}

export declare class MatProgressBarModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatProgressBarModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatProgressBarModule, never, [typeof i1.MatProgressBar], [typeof i1.MatProgressBar, typeof i2.MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatProgressBarModule>;
}

/** Last animation end data. */
export declare interface ProgressAnimationEnd {
    value: number;
}

export declare type ProgressBarMode = 'determinate' | 'indeterminate' | 'buffer' | 'query';

export { }
