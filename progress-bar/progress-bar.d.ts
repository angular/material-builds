/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NumberInput } from '@angular/cdk/coercion';
import { AfterViewInit, ElementRef, EventEmitter, InjectionToken, NgZone, OnDestroy } from '@angular/core';
import { CanColor } from '@angular/material/core';
/** Last animation end data. */
export interface ProgressAnimationEnd {
    value: number;
}
/** @docs-private */
declare const _MatProgressBarBase: import("@angular/material/core/common-behaviors/constructor").Constructor<CanColor> & import("@angular/material/core/common-behaviors/constructor").AbstractConstructor<CanColor> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};
/**
 * Injection token used to provide the current location to `MatProgressBar`.
 * Used to handle server-side rendering and to stub out during unit tests.
 * @docs-private
 */
export declare const MAT_PROGRESS_BAR_LOCATION: InjectionToken<MatProgressBarLocation>;
/**
 * Stubbed out location for `MatProgressBar`.
 * @docs-private
 */
export interface MatProgressBarLocation {
    getPathname: () => string;
}
/** @docs-private */
export declare function MAT_PROGRESS_BAR_LOCATION_FACTORY(): MatProgressBarLocation;
export declare type ProgressBarMode = 'determinate' | 'indeterminate' | 'buffer' | 'query';
/**
 * `<mat-progress-bar>` component.
 */
export declare class MatProgressBar extends _MatProgressBarBase implements CanColor, AfterViewInit, OnDestroy {
    private _ngZone;
    _animationMode?: string | undefined;
    constructor(elementRef: ElementRef, _ngZone: NgZone, _animationMode?: string | undefined, 
    /**
     * @deprecated `location` parameter to be made required.
     * @breaking-change 8.0.0
     */
    location?: MatProgressBarLocation);
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
    _primaryValueBar: ElementRef;
    /**
     * Event emitted when animation of the primary progress bar completes. This event will not
     * be emitted when animations are disabled, nor will it be emitted for modes with continuous
     * animations (indeterminate and query).
     */
    readonly animationEnd: EventEmitter<ProgressAnimationEnd>;
    /** Reference to animation end subscription to be unsubscribed on destroy. */
    private _animationEndSubscription;
    /**
     * Mode of the progress bar.
     *
     * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
     * 'determinate'.
     * Mirrored to mode attribute.
     */
    mode: ProgressBarMode;
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
    static ngAcceptInputType_value: NumberInput;
}
export {};
