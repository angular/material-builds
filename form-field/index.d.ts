import { _AbstractConstructor } from '@angular/material/core';
import { AbstractControlDirective } from '@angular/forms';
import { AfterContentChecked } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { AnimationTriggerMetadata } from '@angular/animations';
import { BooleanInput } from '@angular/cdk/coercion';
import { CanColor } from '@angular/material/core';
import { ChangeDetectorRef } from '@angular/core';
import { _Constructor } from '@angular/material/core';
import { Directionality } from '@angular/cdk/bidi';
import { ElementRef } from '@angular/core';
import * as i0 from '@angular/core';
import * as i10 from '@angular/cdk/observers';
import * as i8 from '@angular/common';
import * as i9 from '@angular/material/core';
import { InjectionToken } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { QueryList } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

/** Possible values for the "floatLabel" form field input. */
export declare type FloatLabelType = 'always' | 'never' | 'auto';

/** @docs-private */
export declare function getMatFormFieldDuplicatedHintError(align: string): Error;

/** @docs-private */
export declare function getMatFormFieldMissingControlError(): Error;


/** @docs-private */
export declare function getMatFormFieldPlaceholderConflictError(): Error;

declare namespace i1 {
    export {
        MAT_ERROR,
        MatError
    }
}

declare namespace i2 {
    export {
        MatFormFieldAppearance,
        FloatLabelType,
        MatFormFieldDefaultOptions,
        MAT_FORM_FIELD_DEFAULT_OPTIONS,
        MAT_FORM_FIELD,
        MatFormField
    }
}

declare namespace i3 {
    export {
        _MAT_HINT,
        MatHint
    }
}

declare namespace i4 {
    export {
        MatLabel
    }
}

declare namespace i5 {
    export {
        MatPlaceholder
    }
}

declare namespace i6 {
    export {
        MAT_PREFIX,
        MatPrefix
    }
}

declare namespace i7 {
    export {
        MAT_SUFFIX,
        MatSuffix
    }
}

/**
 * Injection token that can be used to reference instances of `MatError`. It serves as
 * alternative token to the actual `MatError` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_ERROR: InjectionToken<MatError>;

/**
 * Injection token that can be used to inject an instances of `MatFormField`. It serves
 * as alternative token to the actual `MatFormField` class which would cause unnecessary
 * retention of the `MatFormField` class and its component metadata.
 */
export declare const MAT_FORM_FIELD: InjectionToken<MatFormField>;

/**
 * Injection token that can be used to configure the
 * default options for all form field within an app.
 */
export declare const MAT_FORM_FIELD_DEFAULT_OPTIONS: InjectionToken<MatFormFieldDefaultOptions>;

/**
 * Injection token that can be used to reference instances of `MatHint`. It serves as
 * alternative token to the actual `MatHint` class which could cause unnecessary
 * retention of the class and its directive metadata.
 *
 * *Note*: This is not part of the public API as the MDC-based form-field will not
 * need a lightweight token for `MatHint` and we want to reduce breaking changes.
 */
export declare const _MAT_HINT: InjectionToken<MatHint>;

/**
 * Injection token that can be used to reference instances of `MatPrefix`. It serves as
 * alternative token to the actual `MatPrefix` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_PREFIX: InjectionToken<MatPrefix>;

/**
 * Injection token that can be used to reference instances of `MatSuffix`. It serves as
 * alternative token to the actual `MatSuffix` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_SUFFIX: InjectionToken<MatSuffix>;

/** Single error message to be shown underneath the form field. */
export declare class MatError {
    id: string;
    constructor(ariaLive: string, elementRef: ElementRef);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatError, [{ attribute: "aria-live"; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatError, "mat-error", never, { "id": "id"; }, {}, never, never, false>;
}

/** Container for form controls that applies Material Design styling and behavior. */
export declare class MatFormField extends _MatFormFieldBase implements AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy, CanColor {
    private _changeDetectorRef;
    private _dir;
    private _defaults;
    private _platform;
    private _ngZone;
    /**
     * Whether the outline gap needs to be calculated
     * immediately on the next change detection run.
     */
    private _outlineGapCalculationNeededImmediately;
    /** Whether the outline gap needs to be calculated next time the zone has stabilized. */
    private _outlineGapCalculationNeededOnStable;
    private readonly _destroyed;
    /** The form field appearance style. */
    get appearance(): MatFormFieldAppearance;
    set appearance(value: MatFormFieldAppearance);
    _appearance: MatFormFieldAppearance;
    /** Whether the required marker should be hidden. */
    get hideRequiredMarker(): boolean;
    set hideRequiredMarker(value: BooleanInput);
    private _hideRequiredMarker;
    /** Override for the logic that disables the label animation in certain cases. */
    private _showAlwaysAnimate;
    /** Whether the floating label should always float or not. */
    _shouldAlwaysFloat(): boolean;
    /** Whether the label can float or not. */
    _canLabelFloat(): boolean;
    /** State of the mat-hint and mat-error animations. */
    _subscriptAnimationState: string;
    /** Text for the form field hint. */
    get hintLabel(): string;
    set hintLabel(value: string);
    private _hintLabel;
    readonly _hintLabelId: string;
    readonly _labelId: string;
    /**
     * Whether the label should always float, never float or float as the user types.
     *
     * Note: only the legacy appearance supports the `never` option. `never` was originally added as a
     * way to make the floating label emulate the behavior of a standard input placeholder. However
     * the form field now supports both floating labels and placeholders. Therefore in the non-legacy
     * appearances the `never` option has been disabled in favor of just using the placeholder.
     */
    get floatLabel(): FloatLabelType;
    set floatLabel(value: FloatLabelType);
    private _floatLabel;
    /** Whether the Angular animations are enabled. */
    _animationsEnabled: boolean;
    _connectionContainerRef: ElementRef;
    _inputContainerRef: ElementRef;
    private _label;
    _controlNonStatic: MatFormFieldControl<any>;
    _controlStatic: MatFormFieldControl<any>;
    get _control(): MatFormFieldControl<any>;
    set _control(value: MatFormFieldControl<any>);
    private _explicitFormFieldControl;
    _labelChildNonStatic: MatLabel;
    _labelChildStatic: MatLabel;
    _placeholderChild: MatPlaceholder;
    _errorChildren: QueryList<MatError>;
    _hintChildren: QueryList<MatHint>;
    _prefixChildren: QueryList<MatPrefix>;
    _suffixChildren: QueryList<MatSuffix>;
    constructor(elementRef: ElementRef, _changeDetectorRef: ChangeDetectorRef, _dir: Directionality, _defaults: MatFormFieldDefaultOptions, _platform: Platform, _ngZone: NgZone, _animationMode: string);
    /**
     * Gets the id of the label element. If no label is present, returns `null`.
     */
    getLabelId(): string | null;
    /**
     * Gets an ElementRef for the element that a overlay attached to the form field should be
     * positioned relative to.
     */
    getConnectedOverlayOrigin(): ElementRef;
    ngAfterContentInit(): void;
    ngAfterContentChecked(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * Determines whether a class from the AbstractControlDirective
     * should be forwarded to the host element.
     */
    _shouldForward(prop: keyof AbstractControlDirective): boolean;
    _hasPlaceholder(): boolean;
    _hasLabel(): boolean;
    _shouldLabelFloat(): boolean;
    _hideControlPlaceholder(): boolean;
    _hasFloatingLabel(): boolean;
    /** Determines whether to display hints or errors. */
    _getDisplayedMessages(): 'error' | 'hint';
    /** Animates the placeholder up and locks it in position. */
    _animateAndLockLabel(): void;
    /**
     * Ensure that there is only one placeholder (either `placeholder` attribute on the child control
     * or child element with the `mat-placeholder` directive).
     */
    private _validatePlaceholders;
    /** Does any extra processing that is required when handling the hints. */
    private _processHints;
    /**
     * Ensure that there is a maximum of one of each `<mat-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     */
    private _validateHints;
    /** Gets the default float label state. */
    private _getDefaultFloatLabelState;
    /**
     * Sets the list of element IDs that describe the child control. This allows the control to update
     * its `aria-describedby` attribute accordingly.
     */
    private _syncDescribedByIds;
    /** Throws an error if the form field's control is missing. */
    protected _validateControlChild(): void;
    /**
     * Updates the width and position of the gap in the outline. Only relevant for the outline
     * appearance.
     */
    updateOutlineGap(): void;
    /** Gets the start end of the rect considering the current directionality. */
    private _getStartEnd;
    /** Checks whether the form field is attached to the DOM. */
    private _isAttachedToDOM;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFormField, [null, null, { optional: true; }, { optional: true; }, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatFormField, "mat-form-field", ["matFormField"], { "color": "color"; "appearance": "appearance"; "hideRequiredMarker": "hideRequiredMarker"; "hintLabel": "hintLabel"; "floatLabel": "floatLabel"; }, {}, ["_controlNonStatic", "_controlStatic", "_labelChildNonStatic", "_labelChildStatic", "_placeholderChild", "_errorChildren", "_hintChildren", "_prefixChildren", "_suffixChildren"], ["[matPrefix]", "*", "mat-placeholder", "mat-label", "[matSuffix]", "mat-error", "mat-hint:not([align='end'])", "mat-hint[align='end']"], false>;
}

/**
 * Animations used by the MatFormField.
 * @docs-private
 */
export declare const matFormFieldAnimations: {
    readonly transitionMessages: AnimationTriggerMetadata;
};

/** Possible appearance styles for the form field. */
export declare type MatFormFieldAppearance = 'legacy' | 'standard' | 'fill' | 'outline';

/**
 * Boilerplate for applying mixins to MatFormField.
 * @docs-private
 */
declare const _MatFormFieldBase: _Constructor<CanColor> & _AbstractConstructor<CanColor> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};

/** An interface which allows a control to work inside of a `MatFormField`. */
export declare abstract class MatFormFieldControl<T> {
    /** The value of the control. */
    value: T | null;
    /**
     * Stream that emits whenever the state of the control changes such that the parent `MatFormField`
     * needs to run change detection.
     */
    readonly stateChanges: Observable<void>;
    /** The element ID for this control. */
    readonly id: string;
    /** The placeholder for this control. */
    readonly placeholder: string;
    /** Gets the AbstractControlDirective for this control. */
    readonly ngControl: NgControl | AbstractControlDirective | null;
    /** Whether the control is focused. */
    readonly focused: boolean;
    /** Whether the control is empty. */
    readonly empty: boolean;
    /** Whether the `MatFormField` label should try to float. */
    readonly shouldLabelFloat: boolean;
    /** Whether the control is required. */
    readonly required: boolean;
    /** Whether the control is disabled. */
    readonly disabled: boolean;
    /** Whether the control is in an error state. */
    readonly errorState: boolean;
    /**
     * An optional name for the control type that can be used to distinguish `mat-form-field` elements
     * based on their control type. The form field will add a class,
     * `mat-form-field-type-{{controlType}}` to its root element.
     */
    readonly controlType?: string;
    /**
     * Whether the input is currently in an autofilled state. If property is not present on the
     * control it is assumed to be false.
     */
    readonly autofilled?: boolean;
    /**
     * Value of `aria-describedby` that should be merged with the described-by ids
     * which are set by the form-field.
     */
    readonly userAriaDescribedBy?: string;
    /** Sets the list of element IDs that currently describe this control. */
    abstract setDescribedByIds(ids: string[]): void;
    /** Handles a click on the control's container. */
    abstract onContainerClick(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFormFieldControl<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatFormFieldControl<any>, never, never, {}, {}, never, never, false>;
}

/**
 * Represents the default options for the form field that can be configured
 * using the `MAT_FORM_FIELD_DEFAULT_OPTIONS` injection token.
 */
export declare interface MatFormFieldDefaultOptions {
    /** Default form field appearance style. */
    appearance?: MatFormFieldAppearance;
    /** Default color of the form field. */
    color?: ThemePalette;
    /** Whether the required marker should be hidden by default. */
    hideRequiredMarker?: boolean;
    /**
     * Whether the label for form fields should by default float `always`,
     * `never`, or `auto` (only when necessary).
     */
    floatLabel?: FloatLabelType;
}

export declare class MatFormFieldModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFormFieldModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatFormFieldModule, [typeof i1.MatError, typeof i2.MatFormField, typeof i3.MatHint, typeof i4.MatLabel, typeof i5.MatPlaceholder, typeof i6.MatPrefix, typeof i7.MatSuffix], [typeof i8.CommonModule, typeof i9.MatCommonModule, typeof i10.ObserversModule], [typeof i9.MatCommonModule, typeof i1.MatError, typeof i2.MatFormField, typeof i3.MatHint, typeof i4.MatLabel, typeof i5.MatPlaceholder, typeof i6.MatPrefix, typeof i7.MatSuffix]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatFormFieldModule>;
}

/** Hint text to be shown underneath the form field control. */
export declare class MatHint {
    /** Whether to align the hint label at the start or end of the line. */
    align: 'start' | 'end';
    /** Unique ID for the hint. Used for the aria-describedby on the form field control. */
    id: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatHint, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatHint, "mat-hint", never, { "align": "align"; "id": "id"; }, {}, never, never, false>;
}

/** The floating label for a `mat-form-field`. */
export declare class MatLabel {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLabel, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatLabel, "mat-label", never, {}, {}, never, never, false>;
}

/**
 * The placeholder text for an `MatFormField`.
 * @deprecated Use `<mat-label>` to specify the label and the `placeholder` attribute to specify the
 *     placeholder.
 * @breaking-change 8.0.0
 */
export declare class MatPlaceholder {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatPlaceholder, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatPlaceholder, "mat-placeholder", never, {}, {}, never, never, false>;
}

/** Prefix to be placed in front of the form field. */
export declare class MatPrefix {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatPrefix, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatPrefix, "[matPrefix]", never, {}, {}, never, never, false>;
}

/** Suffix to be placed at the end of the form field. */
export declare class MatSuffix {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSuffix, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatSuffix, "[matSuffix]", never, {}, {}, never, never, false>;
}

export { }
