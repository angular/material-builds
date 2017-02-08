import { ElementRef, Renderer, ModuleWithProviders } from '@angular/core';
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export declare class MdButtonCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export declare class MdRaisedButtonCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export declare class MdIconButtonCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export declare class MdFabCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export declare class MdMiniFabCssMatStyler {
}
/**
 * Material design button.
 */
export declare class MdButton {
    private _elementRef;
    private _renderer;
    private _color;
    /** Whether the button has focus from the keyboard (not the mouse). Used for class binding. */
    _isKeyboardFocused: boolean;
    /** Whether a mousedown has occurred on this element in the last 100ms. */
    _isMouseDown: boolean;
    /** Whether the ripple effect on click should be disabled. */
    private _disableRipple;
    private _disabled;
    /** Whether the ripple effect for this button is disabled. */
    disableRipple: boolean;
    /** Whether the button is disabled. */
    disabled: boolean;
    constructor(_elementRef: ElementRef, _renderer: Renderer);
    /** The color of the button. Can be `primary`, `accent`, or `warn`. */
    color: string;
    _setMousedown(): void;
    _updateColor(newColor: string): void;
    _setElementColor(color: string, isAdd: boolean): void;
    _setKeyboardFocus(): void;
    _removeKeyboardFocus(): void;
    /** Focuses the button. */
    focus(): void;
    _getHostElement(): any;
    _isRoundButton(): any;
    _isRippleDisabled(): boolean;
}
/**
 * Raised Material design button.
 */
export declare class MdAnchor extends MdButton {
    constructor(elementRef: ElementRef, renderer: Renderer);
    /** @docs-private */
    readonly tabIndex: number;
    readonly _isAriaDisabled: string;
    _haltDisabledEvents(event: Event): void;
}
export declare class MdButtonModule {
    /** @deprecated */
    static forRoot(): ModuleWithProviders;
}
