import { AfterContentInit, SimpleChange, ElementRef, Renderer, QueryList, OnChanges, ModuleWithProviders } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { MdError } from '../core';
import { Observable } from 'rxjs/Observable';
import { MdPlaceholder, MdHint } from './input-container';
export declare const MD_INPUT_CONTROL_VALUE_ACCESSOR: any;
export declare class MdInputPlaceholderConflictError extends MdError {
    constructor();
}
export declare class MdInputUnsupportedTypeError extends MdError {
    constructor(type: string);
}
export declare class MdInputDuplicatedHintError extends MdError {
    constructor(align: string);
}
/**
 * Component that represents a text input. It encapsulates the <input> HTMLElement and
 * improve on its behaviour, along with styling it according to the Material Design.
 */
export declare class MdInput implements ControlValueAccessor, AfterContentInit, OnChanges {
    private _renderer;
    private _focused;
    private _value;
    /** Callback registered via registerOnTouched (ControlValueAccessor) */
    private _onTouchedCallback;
    /** Callback registered via registerOnChange (ControlValueAccessor) */
    private _onChangeCallback;
    /**
     * Aria related inputs.
     */
    ariaLabel: string;
    ariaLabelledBy: string;
    private _ariaDisabled;
    private _ariaRequired;
    private _ariaInvalid;
    ariaDisabled: boolean;
    ariaRequired: boolean;
    ariaInvalid: boolean;
    /**
     * Content directives.
     */
    _placeholderChild: MdPlaceholder;
    _hintChildren: QueryList<MdHint>;
    /** Readonly properties. */
    readonly focused: boolean;
    readonly empty: boolean;
    readonly characterCount: number;
    readonly inputId: string;
    /**
     * Bindings.
     */
    align: 'start' | 'end';
    dividerColor: 'primary' | 'accent' | 'warn';
    hintLabel: string;
    autocomplete: string;
    autocorrect: string;
    autocapitalize: string;
    id: string;
    list: string;
    max: string | number;
    maxlength: number;
    min: string | number;
    minlength: number;
    placeholder: string;
    step: number;
    tabindex: number;
    type: string;
    name: string;
    rows: number;
    cols: number;
    wrap: 'soft' | 'hard';
    private _floatingPlaceholder;
    private _autofocus;
    private _disabled;
    private _readonly;
    private _required;
    private _spellcheck;
    floatingPlaceholder: boolean;
    autofocus: boolean;
    disabled: boolean;
    readonly: boolean;
    required: boolean;
    spellcheck: boolean;
    private _blurEmitter;
    private _focusEmitter;
    readonly onBlur: Observable<FocusEvent>;
    readonly onFocus: Observable<FocusEvent>;
    value: any;
    readonly _align: any;
    _inputElement: ElementRef;
    _elementType: 'input' | 'textarea';
    constructor(elementRef: ElementRef, _renderer: Renderer);
    /** Set focus on input */
    focus(): void;
    _handleFocus(event: FocusEvent): void;
    _handleBlur(event: FocusEvent): void;
    _handleChange(event: Event): void;
    _hasPlaceholder(): boolean;
    /** Implemented as part of ControlValueAccessor. */
    writeValue(value: any): void;
    /** Implemented as part of ControlValueAccessor. */
    registerOnChange(fn: any): void;
    /** Implemented as part of ControlValueAccessor. */
    registerOnTouched(fn: any): void;
    /** Implemented as a part of ControlValueAccessor. */
    setDisabledState(isDisabled: boolean): void;
    ngAfterContentInit(): void;
    ngOnChanges(changes: {
        [key: string]: SimpleChange;
    }): void;
    /**
     * Convert the value passed in to a value that is expected from the type of the md-input.
     * This is normally performed by the *_VALUE_ACCESSOR in forms, but since the type is bound
     * on our internal input it won't work locally.
     * @private
     */
    private _convertValueForInputType(v);
    /**
     * Ensure that all constraints defined by the API are validated, or throw errors otherwise.
     * Constraints for now:
     *   - placeholder attribute and <md-placeholder> are mutually exclusive.
     *   - type attribute is not one of the forbidden types (see constant at the top).
     *   - Maximum one of each `<md-hint>` alignment specified, with the attribute being
     *     considered as align="start".
     * @private
     */
    private _validateConstraints();
}
export declare class MdInputModule {
    static forRoot(): ModuleWithProviders;
}
