import { AfterContentInit, SimpleChange, ElementRef, Renderer, QueryList, OnChanges, ModuleWithProviders } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { MdError } from '../core';
import { Observable } from 'rxjs/Observable';
import { MdPlaceholder, MdHint } from './input-container';
export declare const MD_INPUT_CONTROL_VALUE_ACCESSOR: any;
/** @docs-private */
export declare class MdInputPlaceholderConflictError extends MdError {
    constructor();
}
/** @docs-private */
export declare class MdInputUnsupportedTypeError extends MdError {
    constructor(type: string);
}
/** @docs-private */
export declare class MdInputDuplicatedHintError extends MdError {
    constructor(align: string);
}
/**
 * Component that represents a text input. It encapsulates the <input> HTMLElement and
 * improve on its behaviour, along with styling it according to the Material Design.
 * @deprecated
 * @docs-private
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
    /** Mirrors the native `aria-disabled` attribute. */
    ariaDisabled: boolean;
    /** Mirrors the native `aria-required` attribute. */
    ariaRequired: boolean;
    /** Mirrors the native `aria-invalid` attribute. */
    ariaInvalid: boolean;
    /**
     * Content directives.
     */
    _placeholderChild: MdPlaceholder;
    _hintChildren: QueryList<MdHint>;
    /** Readonly properties. */
    /** Whether the element is focused. */
    readonly focused: boolean;
    /** Whether the element is empty. */
    readonly empty: boolean;
    /** Amount of characters inside the element. */
    readonly characterCount: number;
    /** Unique element id. */
    readonly inputId: string;
    /** Alignment of the input container's content. */
    align: 'start' | 'end';
    /** Color of the input divider, based on the theme. */
    dividerColor: 'primary' | 'accent' | 'warn';
    /** Text for the input hint. */
    hintLabel: string;
    /** Mirrors the native `autocomplete` attribute. */
    autocomplete: string;
    /** Mirrors the native `autocorrect` attribute. */
    autocorrect: string;
    /** Mirrors the native `autocapitalize` attribute. */
    autocapitalize: string;
    /** Unique id for the input element. */
    id: string;
    /** Mirrors the native `list` attribute. */
    list: string;
    /** Mirrors the native `max` attribute. */
    max: string | number;
    /** Mirrors the native `maxlength` attribute. */
    maxlength: number;
    /** Mirrors the native `min` attribute. */
    min: string | number;
    /** Mirrors the native `minlength` attribute. */
    minlength: number;
    /** Mirrors the native `placeholder` attribute. */
    placeholder: string;
    /** Mirrors the native `step` attribute. */
    step: number;
    /** Mirrors the native `tabindex` attribute. */
    tabindex: number;
    /** Mirrors the native `type` attribute. */
    type: string;
    /** Mirrors the native `name` attribute. */
    name: string;
    /** Mirrors the native `rows` attribute. */
    rows: number;
    /** Mirrors the native `cols` attribute. */
    cols: number;
    /** Whether to do a soft or hard wrap of the text.. */
    wrap: 'soft' | 'hard';
    private _floatingPlaceholder;
    private _autofocus;
    private _disabled;
    private _readonly;
    private _required;
    private _spellcheck;
    /** Text for the floating placeholder. */
    floatingPlaceholder: boolean;
    /** Whether to automatically focus the input. */
    autofocus: boolean;
    /** Whether the input is disabled. */
    disabled: boolean;
    /** Whether the input is readonly. */
    readonly: boolean;
    /** Whether the input is required. */
    required: boolean;
    /** Whether spellchecking is enable on the input. */
    spellcheck: boolean;
    private _blurEmitter;
    private _focusEmitter;
    /** Event emitted when the input is blurred. */
    readonly onBlur: Observable<FocusEvent>;
    /** Event emitted when the input is focused. */
    readonly onFocus: Observable<FocusEvent>;
    /** Value of the input. */
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
    /**
     * Sets the model value of the input. Implemented as part of ControlValueAccessor.
     * @param value Value to be set.
     */
    writeValue(value: any): void;
    /**
     * Registers a callback to be triggered when the input value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnChange(fn: any): void;
    /**
     * Registers a callback to be triggered when the input has been touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnTouched(fn: any): void;
    /**
     * Sets whether the input is disabled.
     * Implemented as a part of ControlValueAccessor.
     * @param isDisabled Whether the input should be disabled.
     */
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
