/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor, FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { CanColor, CanDisable, CanDisableRipple, MatRipple } from '@angular/material/core';
declare const _MatButtonBase: import("@angular/material/core/common-behaviors/constructor").Constructor<CanColor> & import("@angular/material/core/common-behaviors/constructor").AbstractConstructor<CanColor> & import("@angular/material/core/common-behaviors/constructor").Constructor<CanDisable> & import("@angular/material/core/common-behaviors/constructor").AbstractConstructor<CanDisable> & import("@angular/material/core/common-behaviors/constructor").Constructor<CanDisableRipple> & import("@angular/material/core/common-behaviors/constructor").AbstractConstructor<CanDisableRipple> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};
/**
 * Material design button.
 */
export declare class MatButton extends _MatButtonBase implements AfterViewInit, OnDestroy, CanDisable, CanColor, CanDisableRipple, FocusableOption {
    private _focusMonitor;
    _animationMode: string;
    /** Whether the button is round. */
    readonly isRoundButton: boolean;
    /** Whether the button is icon button. */
    readonly isIconButton: boolean;
    /** Reference to the MatRipple instance of the button. */
    ripple: MatRipple;
    constructor(elementRef: ElementRef, _focusMonitor: FocusMonitor, _animationMode: string);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Focuses the button. */
    focus(origin?: FocusOrigin, options?: FocusOptions): void;
    _getHostElement(): any;
    _isRippleDisabled(): boolean;
    /** Gets whether the button has one of the given attributes. */
    _hasHostAttributes(...attributes: string[]): boolean;
    static ngAcceptInputType_disabled: BooleanInput;
    static ngAcceptInputType_disableRipple: BooleanInput;
}
/**
 * Material design anchor button.
 */
export declare class MatAnchor extends MatButton {
    /** Tabindex of the button. */
    tabIndex: number;
    constructor(focusMonitor: FocusMonitor, elementRef: ElementRef, animationMode: string);
    _haltDisabledEvents(event: Event): void;
}
export {};
