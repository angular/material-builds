import { _AbstractConstructor } from '@angular/material/core';
import { AfterViewInit } from '@angular/core';
import { CanColor } from '@angular/material/core';
import { CanDisable } from '@angular/material/core';
import { CanDisableRipple } from '@angular/material/core';
import { _Constructor } from '@angular/material/core';
import { ElementRef } from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { FocusMonitor } from '@angular/cdk/a11y';
import { FocusOrigin } from '@angular/cdk/a11y';
import * as i0 from '@angular/core';
import * as i2 from '@angular/material/core';
import { MatRipple } from '@angular/material/core';
import { NgZone } from '@angular/core';
import { OnDestroy } from '@angular/core';

declare namespace i1 {
    export {
        MatButton,
        MatAnchor
    }
}

/**
 * Material design anchor button.
 */
export declare class MatAnchor extends MatButton implements AfterViewInit, OnDestroy {
    /** @breaking-change 14.0.0 _ngZone will be required. */
    private _ngZone?;
    /** Tabindex of the button. */
    tabIndex: number;
    constructor(focusMonitor: FocusMonitor, elementRef: ElementRef, animationMode: string, 
    /** @breaking-change 14.0.0 _ngZone will be required. */
    _ngZone?: NgZone | undefined);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    _haltDisabledEvents: (event: Event) => void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatAnchor, [null, null, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatAnchor, "a[mat-button], a[mat-raised-button], a[mat-icon-button], a[mat-fab],             a[mat-mini-fab], a[mat-stroked-button], a[mat-flat-button]", ["matButton", "matAnchor"], { "disabled": "disabled"; "disableRipple": "disableRipple"; "color": "color"; "tabIndex": "tabIndex"; }, {}, never, ["*"], false>;
}

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
    static ɵfac: i0.ɵɵFactoryDeclaration<MatButton, [null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatButton, "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", ["matButton"], { "disabled": "disabled"; "disableRipple": "disableRipple"; "color": "color"; }, {}, never, ["*"], false>;
}

declare const _MatButtonBase: _Constructor<CanColor> & _AbstractConstructor<CanColor> & _Constructor<CanDisable> & _AbstractConstructor<CanDisable> & _Constructor<CanDisableRipple> & _AbstractConstructor<CanDisableRipple> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};

export declare class MatButtonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatButtonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatButtonModule, [typeof i1.MatButton, typeof i1.MatAnchor], [typeof i2.MatRippleModule, typeof i2.MatCommonModule], [typeof i1.MatButton, typeof i1.MatAnchor, typeof i2.MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatButtonModule>;
}

export { }
