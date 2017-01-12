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
export declare class MdInputDirective {
    private _elementRef;
    private _renderer;
    _ngControl: NgControl;
    /** Variables used as cache for getters and setters. */
    private _type;
    private _placeholder;
    private _disabled;
    private _required;
    private _id;
    private _cachedUid;
    /** Whether the element is focused or not. */
    focused: boolean;
    /** Whether the element is disabled. */
    disabled: any;
    /** Unique id of the element. */
    id: string;
    /** Placeholder attribute of the element. */
    placeholder: string;
    /** Whether the element is required. */
    required: any;
    /** Input type of the element. */
    type: string;
    /** The input element's value. */
    value: string;
    /**
     * Emits an event when the placeholder changes so that the `md-input-container` can re-validate.
     */
    _placeholderChange: EventEmitter<string>;
    readonly empty: boolean;
    private readonly _uid;
    private _neverEmptyInputTypes;
    constructor(_elementRef: ElementRef, _renderer: Renderer, _ngControl: NgControl);
    /** Focuses the input element. */
    focus(): void;
    _onFocus(): void;
    _onBlur(): void;
    _onInput(): void;
    /** Make sure the input is a supported type. */
    private _validateType();
    private _isNeverEmpty();
    private _isBadInput();
    /** Determines if the component host is a textarea. If not recognizable it returns false. */
    private _isTextarea();
}
/**
 * Component that represents a text input. It encapsulates the <input> HTMLElement and
 * improve on its behaviour, along with styling it according to the Material Design.
 */
export declare class MdInputContainer implements AfterContentInit {
    /** Alignment of the input container's content. */
    align: 'start' | 'end';
    /** Color of the input divider, based on the theme. */
    dividerColor: 'primary' | 'accent' | 'warn';
    /** Text for the input hint. */
    hintLabel: string;
    private _hintLabel;
    /** Text or the floating placeholder. */
    floatingPlaceholder: boolean;
    private _floatingPlaceholder;
    _mdInputChild: MdInputDirective;
    _placeholderChild: MdPlaceholder;
    _hintChildren: QueryList<MdHint>;
    ngAfterContentInit(): void;
    /** Determines whether a class from the NgControl should be forwarded to the host element. */
    _shouldForward(prop: string): boolean;
    /** Whether the input has a placeholder. */
    _hasPlaceholder(): boolean;
    _focusInput(): void;
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
