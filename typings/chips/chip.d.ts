import { ElementRef, EventEmitter, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Focusable } from '../core/a11y/focus-key-manager';
import { CanColor } from '../core/common-behaviors/color';
export interface MdChipEvent {
    chip: MdChip;
}
export declare class MdChipBase {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
}
export declare const _MdChipMixinBase: (new (...args: any[]) => CanColor) & typeof MdChipBase;
/**
 * Material design styled Chip component. Used inside the MdChipList component.
 */
export declare class MdChip extends _MdChipMixinBase implements Focusable, OnInit, OnDestroy, CanColor {
    /** Whether or not the chip is disabled. Disabled chips cannot be focused. */
    protected _disabled: boolean;
    /** Whether or not the chip is selected. */
    protected _selected: boolean;
    /** Emitted when the chip is focused. */
    onFocus: EventEmitter<MdChipEvent>;
    /** Emitted when the chip is selected. */
    select: EventEmitter<MdChipEvent>;
    /** Emitted when the chip is deselected. */
    deselect: EventEmitter<MdChipEvent>;
    /** Emitted when the chip is destroyed. */
    destroy: EventEmitter<MdChipEvent>;
    constructor(renderer: Renderer2, elementRef: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /** Whether or not the chip is disabled. */
    /** Sets the disabled state of the chip. */
    disabled: boolean;
    /** A String representation of the current disabled state. */
    readonly _isAriaDisabled: string;
    /** Whether or not this chip is selected. */
    selected: boolean;
    /**
     * Toggles the current selected state of this chip.
     * @return Whether the chip is selected.
     */
    toggleSelected(): boolean;
    /** Allows for programmatic focusing of the chip. */
    focus(): void;
    /** Ensures events fire properly upon click. */
    _handleClick(event: Event): void;
    /** Initializes the appropriate CSS classes based on the chip type (basic or standard). */
    private _addDefaultCSSClass();
}
