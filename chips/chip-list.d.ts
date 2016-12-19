import { AfterContentInit, ElementRef, ModuleWithProviders, QueryList } from '@angular/core';
import { MdChip } from './chip';
import { ListKeyManager } from '../core/a11y/list-key-manager';
/**
 * A material design chips component (named ChipList for it's similarity to the List component).
 *
 * Example:
 *
 *     <md-chip-list>
 *       <md-chip>Chip 1<md-chip>
 *       <md-chip>Chip 2<md-chip>
 *     </md-chip-list>
 */
export declare class MdChipList implements AfterContentInit {
    private _elementRef;
    /** Track which chips we're listening to for focus/destruction. */
    private _subscribed;
    /** The ListKeyManager which handles focus. */
    _keyManager: ListKeyManager;
    /** The chip components contained within this chip list. */
    chips: QueryList<MdChip>;
    constructor(_elementRef: ElementRef);
    ngAfterContentInit(): void;
    /** Pass relevant key presses to our key manager. */
    keydown(event: KeyboardEvent): void;
    /**
     * Iterate through the list of chips and add them to our list of
     * subscribed chips.
     *
     * @param chips The list of chips to be subscribed.
     */
    protected subscribeChips(chips: QueryList<MdChip>): void;
    /**
     * Add a specific chip to our subscribed list. If the chip has
     * already been subscribed, this ensures it is only subscribed
     * once.
     *
     * @param chip The chip to be subscribed (or checked for existing
     * subscription).
     */
    protected addChip(chip: MdChip): void;
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param index The index to be checked.
     * @returns {boolean} True if the index is valid for our list of chips.
     */
    private isValidIndex(index);
}
export declare class MdChipsModule {
    static forRoot(): ModuleWithProviders;
}
