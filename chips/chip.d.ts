import { ElementRef, EventEmitter, OnDestroy, OnInit, Renderer } from '@angular/core';
import { MdFocusable } from '../core/a11y/list-key-manager';
export interface MdChipEvent {
    chip: MdChip;
}
/**
 * A material design styled Chip component. Used inside the ChipList component.
 */
export declare class MdChip implements MdFocusable, OnInit, OnDestroy {
    protected _renderer: Renderer;
    protected _elementRef: ElementRef;
    protected _disabled: boolean;
    /**
     * Emitted when the chip is focused.
     */
    onFocus: EventEmitter<MdChipEvent>;
    /**
     * Emitted when the chip is destroyed.
     */
    destroy: EventEmitter<MdChipEvent>;
    constructor(_renderer: Renderer, _elementRef: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /** Whether or not the chip is disabled. */
    /** Sets the disabled state of the chip. */
    disabled: boolean;
    /** A String representation of the current disabled state. */
    readonly _isAriaDisabled: string;
    /** Allows for programmatic focusing of the chip. */
    focus(): void;
    /** Ensures events fire properly upon click. */
    _handleClick(event: Event): void;
}
