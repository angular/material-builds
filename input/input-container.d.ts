import { AfterContentInit, ElementRef, QueryList, EventEmitter, Renderer } from '@angular/core';
import { NgControl } from '@angular/forms';
/**
 * The placeholder directive. The content can declare this to implement more
 * complex placeholders.
 */
export declare class MdPlaceholder {
}
/** The hint directive, used to tag content as hint labels (going under the input). */
export declare class MdHint {
    align: 'start' | 'end';
}
/** The input directive, used to mark the input that `MdInputContainer` is wrapping. */
export declare class MdInputDirective implements AfterContentInit {
    private _elementRef;
    private _renderer;
    _ngControl: NgControl;
    disabled: any;
    private _disabled;
    id: string;
    private _id;
    placeholder: string;
    private _placeholder;
    required: any;
    private _required;
    type: string;
    private _type;
    value: any;
    /**
     * Emits an event when the placeholder changes so that the `md-input-container` can re-validate.
     */
    _placeholderChange: EventEmitter<string>;
    readonly empty: boolean;
    focused: boolean;
    private readonly _uid;
    private _cachedUid;
    private _neverEmptyInputTypes;
    constructor(_elementRef: ElementRef, _renderer: Renderer, _ngControl: NgControl);
    ngAfterContentInit(): void;
    /** Focus the input element. */
    focus(): void;
    _onFocus(): void;
    _onBlur(): void;
    _onInput(): void;
    /** Make sure the input is a supported type. */
    private _validateType();
    private _isNeverEmpty();
}
/**
 * Component that represents a text input. It encapsulates the <input> HTMLElement and
 * improve on its behaviour, along with styling it according to the Material Design.
 */
export declare class MdInputContainer implements AfterContentInit {
    align: 'start' | 'end';
    dividerColor: 'primary' | 'accent' | 'warn';
    hintLabel: string;
    private _hintLabel;
    floatingPlaceholder: boolean;
    private _floatingPlaceholder;
    _mdInputChild: MdInputDirective;
    _placeholderChild: MdPlaceholder;
    _hintChildren: QueryList<MdHint>;
    ngAfterContentInit(): void;
    _isUntouched(): boolean;
    _isTouched(): boolean;
    _isPristine(): boolean;
    _isDirty(): boolean;
    _isValid(): boolean;
    _isInvalid(): boolean;
    _isPending(): boolean;
    /** Whether the input has a placeholder. */
    _hasPlaceholder(): boolean;
    _focusInput(): void;
    private _hasNgControl();
    /**
     * Ensure that there is only one placeholder (either `input` attribute or child element with the
     * `md-placeholder` attribute.
     */
    private _validatePlaceholders();
    /**
     * Ensure that there is a maximum of one of each `<md-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     */
    private _validateHints();
}
