import { ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { FocusOriginMonitor, Platform } from '../core';
import { CanDisable } from '../core/common-behaviors/disabled';
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdButtonCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdRaisedButtonCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdIconButtonCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdFabCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdMiniFabCssMatStyler {
}
export declare class MdButtonBase {
}
export declare const _MdButtonMixinBase: (new (...args: any[]) => CanDisable) & typeof MdButtonBase;
/**
 * Material design button.
 */
export declare class MdButton extends _MdButtonMixinBase implements OnDestroy, CanDisable {
    private _elementRef;
    private _renderer;
    private _platform;
    private _focusOriginMonitor;
    private _color;
    /** Whether the button is round. */
    _isRoundButton: boolean;
    /** Whether the button is icon button. */
    _isIconButton: boolean;
    /** Whether the ripple effect on click should be disabled. */
    private _disableRipple;
    /** Whether the ripple effect for this button is disabled. */
    disableRipple: boolean;
    constructor(_elementRef: ElementRef, _renderer: Renderer2, _platform: Platform, _focusOriginMonitor: FocusOriginMonitor);
    ngOnDestroy(): void;
    /** The color of the button. Can be `primary`, `accent`, or `warn`. */
    color: string;
    _updateColor(newColor: string): void;
    _setElementColor(color: string, isAdd: boolean): void;
    /** Focuses the button. */
    focus(): void;
    _getHostElement(): any;
    _isRippleDisabled(): boolean;
    /**
     * Gets whether the button has one of the given attributes
     * with either an 'md-' or 'mat-' prefix.
     */
    _hasAttributeWithPrefix(...unprefixedAttributeNames: string[]): boolean;
}
/**
 * Raised Material design button.
 */
export declare class MdAnchor extends MdButton {
    constructor(elementRef: ElementRef, renderer: Renderer2, platform: Platform, focusOriginMonitor: FocusOriginMonitor);
    /** @docs-private */
    readonly tabIndex: number;
    readonly _isAriaDisabled: string;
    _haltDisabledEvents(event: Event): void;
}
