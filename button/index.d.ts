import { AfterViewInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { FocusOrigin } from '@angular/cdk/a11y';
import * as i0 from '@angular/core';
import * as i1 from '@angular/material/core';
import { InjectionToken } from '@angular/core';
import { MatRippleLoader } from '@angular/material/core';
import { NgZone } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

declare namespace i2 {
    export {
        MatButton,
        MatAnchor
    }
}

declare namespace i3 {
    export {
        MatIconButton,
        MatIconAnchor
    }
}

declare namespace i4 {
    export {
        MAT_FAB_DEFAULT_OPTIONS_FACTORY,
        MatFabDefaultOptions,
        MAT_FAB_DEFAULT_OPTIONS,
        MatFabButton,
        MatMiniFabButton,
        MatFabAnchor,
        MatMiniFabAnchor
    }
}

/** Injection token that can be used to provide the default options the button component. */
export declare const MAT_BUTTON_CONFIG: InjectionToken<MatButtonConfig>;

/** Injection token to be used to override the default options for FAB. */
export declare const MAT_FAB_DEFAULT_OPTIONS: InjectionToken<MatFabDefaultOptions>;

/** @docs-private */
export declare function MAT_FAB_DEFAULT_OPTIONS_FACTORY(): MatFabDefaultOptions;

/**
 * Material Design button component for anchor elements. Anchor elements are used to provide
 * links for the user to navigate across different routes or pages.
 * See https://material.io/components/buttons
 *
 * The `MatAnchor` class applies to native anchor elements and captures the appearances for
 * "text button", "outlined button", and "contained button" per the Material Design
 * specification. `MatAnchor` additionally captures an additional "flat" appearance, which matches
 * "contained" but without elevation.
 */
export declare class MatAnchor extends MatAnchorBase {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatAnchor, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatAnchor, "a[mat-button], a[mat-raised-button], a[mat-flat-button], a[mat-stroked-button]", ["matButton", "matAnchor"], {}, {}, never, [".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])", "*", ".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"], true, never>;
}

/**
 * Anchor button base.
 */
declare class MatAnchorBase extends MatButtonBase implements OnInit, OnDestroy {
    private _renderer;
    private _cleanupClick;
    tabIndex: number;
    ngOnInit(): void;
    ngOnDestroy(): void;
    _haltDisabledEvents: (event: Event) => void;
    protected _getAriaDisabled(): boolean | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatAnchorBase, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatAnchorBase, never, never, { "tabIndex": { "alias": "tabIndex"; "required": false; }; }, {}, never, never, true, never>;
    static ngAcceptInputType_tabIndex: unknown;
}

/**
 * Material Design button component. Users interact with a button to perform an action.
 * See https://material.io/components/buttons
 *
 * The `MatButton` class applies to native button elements and captures the appearances for
 * "text button", "outlined button", and "contained button" per the Material Design
 * specification. `MatButton` additionally captures an additional "flat" appearance, which matches
 * "contained" but without elevation.
 */
export declare class MatButton extends MatButtonBase {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatButton, "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", ["matButton"], {}, {}, never, [".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])", "*", ".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"], true, never>;
}

/** Base class for all buttons.  */
declare class MatButtonBase implements AfterViewInit, OnDestroy {
    _elementRef: ElementRef<any>;
    _ngZone: NgZone;
    _animationMode: "NoopAnimations" | "BrowserAnimations" | null;
    private readonly _focusMonitor;
    /**
     * Handles the lazy creation of the MatButton ripple.
     * Used to improve initial load time of large applications.
     */
    protected _rippleLoader: MatRippleLoader;
    /** Whether this button is a FAB. Used to apply the correct class on the ripple. */
    protected _isFab: boolean;
    /**
     * Theme color of the button. This API is supported in M2 themes only, it has
     * no effect in M3 themes. For color customization in M3, see https://material.angular.io/components/button/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.io/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color?: string | null;
    /** Whether the ripple effect is disabled or not. */
    get disableRipple(): boolean;
    set disableRipple(value: any);
    private _disableRipple;
    /** Whether the button is disabled. */
    get disabled(): boolean;
    set disabled(value: any);
    private _disabled;
    /** `aria-disabled` value of the button. */
    ariaDisabled: boolean | undefined;
    /**
     * Natively disabled buttons prevent focus and any pointer events from reaching the button.
     * In some scenarios this might not be desirable, because it can prevent users from finding out
     * why the button is disabled (e.g. via tooltip).
     *
     * Enabling this input will change the button so that it is styled to be disabled and will be
     * marked as `aria-disabled`, but it will allow the button to receive events and focus.
     *
     * Note that by enabling this, you need to set the `tabindex` yourself if the button isn't
     * meant to be tabbable and you have to prevent the button action (e.g. form submissions).
     */
    disabledInteractive: boolean;
    constructor(...args: unknown[]);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Focuses the button. */
    focus(origin?: FocusOrigin, options?: FocusOptions): void;
    protected _getAriaDisabled(): boolean | null;
    protected _getDisabledAttribute(): true | null;
    private _updateRippleDisabled;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatButtonBase, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatButtonBase, never, never, { "color": { "alias": "color"; "required": false; }; "disableRipple": { "alias": "disableRipple"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "ariaDisabled": { "alias": "aria-disabled"; "required": false; }; "disabledInteractive": { "alias": "disabledInteractive"; "required": false; }; }, {}, never, never, true, never>;
    static ngAcceptInputType_disableRipple: unknown;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_ariaDisabled: unknown;
    static ngAcceptInputType_disabledInteractive: unknown;
}

/** Object that can be used to configure the default options for the button component. */
export declare interface MatButtonConfig {
    /** Whether disabled buttons should be interactive. */
    disabledInteractive?: boolean;
    /** Default palette color to apply to buttons. */
    color?: ThemePalette;
}

export declare class MatButtonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatButtonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatButtonModule, never, [typeof i1.MatCommonModule, typeof i1.MatRippleModule, typeof i2.MatAnchor, typeof i2.MatButton, typeof i3.MatIconAnchor, typeof i4.MatMiniFabAnchor, typeof i4.MatMiniFabButton, typeof i3.MatIconButton, typeof i4.MatFabAnchor, typeof i4.MatFabButton], [typeof i2.MatAnchor, typeof i2.MatButton, typeof i3.MatIconAnchor, typeof i3.MatIconButton, typeof i4.MatMiniFabAnchor, typeof i4.MatMiniFabButton, typeof i4.MatFabAnchor, typeof i4.MatFabButton, typeof i1.MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatButtonModule>;
}

/**
 * Material Design floating action button (FAB) component for anchor elements. Anchor elements
 * are used to provide links for the user to navigate across different routes or pages.
 * See https://material.io/components/buttons-floating-action-button/
 *
 * The `MatFabAnchor` class has two appearances: normal and extended.
 */
export declare class MatFabAnchor extends MatAnchor {
    private _options;
    _isFab: boolean;
    extended: boolean;
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFabAnchor, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatFabAnchor, "a[mat-fab]", ["matButton", "matAnchor"], { "extended": { "alias": "extended"; "required": false; }; }, {}, never, [".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])", "*", ".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"], true, never>;
    static ngAcceptInputType_extended: unknown;
}

/**
 * Material Design floating action button (FAB) component. These buttons represent the primary
 * or most common action for users to interact with.
 * See https://material.io/components/buttons-floating-action-button/
 *
 * The `MatFabButton` class has two appearances: normal and extended.
 */
export declare class MatFabButton extends MatButtonBase {
    private _options;
    _isFab: boolean;
    extended: boolean;
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFabButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatFabButton, "button[mat-fab]", ["matButton"], { "extended": { "alias": "extended"; "required": false; }; }, {}, never, [".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])", "*", ".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"], true, never>;
    static ngAcceptInputType_extended: unknown;
}

/** Default FAB options that can be overridden. */
export declare interface MatFabDefaultOptions {
    /**
     * Default theme color of the button. This API is supported in M2 themes
     * only, it has no effect in M3 themes. For color customization in M3, see https://material.angular.io/components/button/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.io/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants.
     */
    color?: ThemePalette;
}

/**
 * Material Design icon button component for anchor elements. This button displays a single
 * interaction icon that allows users to navigate across different routes or pages.
 * See https://material.io/develop/web/components/buttons/icon-buttons/
 */
export declare class MatIconAnchor extends MatAnchorBase {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatIconAnchor, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatIconAnchor, "a[mat-icon-button]", ["matButton", "matAnchor"], {}, {}, never, ["*"], true, never>;
}

/**
 * Material Design icon button component. This type of button displays a single interactive icon for
 * users to perform an action.
 * See https://material.io/develop/web/components/buttons/icon-buttons/
 */
export declare class MatIconButton extends MatButtonBase {
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatIconButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatIconButton, "button[mat-icon-button]", ["matButton"], {}, {}, never, ["*"], true, never>;
}

/**
 * Material Design mini floating action button (FAB) component for anchor elements. Anchor elements
 * are used to provide links for the user to navigate across different routes or pages.
 * See https://material.io/components/buttons-floating-action-button/
 */
export declare class MatMiniFabAnchor extends MatAnchor {
    private _options;
    _isFab: boolean;
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatMiniFabAnchor, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatMiniFabAnchor, "a[mat-mini-fab]", ["matButton", "matAnchor"], {}, {}, never, [".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])", "*", ".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"], true, never>;
}

/**
 * Material Design mini floating action button (FAB) component. These buttons represent the primary
 * or most common action for users to interact with.
 * See https://material.io/components/buttons-floating-action-button/
 */
export declare class MatMiniFabButton extends MatButtonBase {
    private _options;
    _isFab: boolean;
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatMiniFabButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatMiniFabButton, "button[mat-mini-fab]", ["matButton"], {}, {}, never, [".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])", "*", ".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"], true, never>;
}

export { }
