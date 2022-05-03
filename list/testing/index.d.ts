import { BaseHarnessFilters } from '@angular/cdk/testing';
import { ComponentHarness } from '@angular/cdk/testing';
import { ComponentHarnessConstructor } from '@angular/cdk/testing';
import { ContentContainerComponentHarness } from '@angular/cdk/testing';
import { DividerHarnessFilters } from '@angular/material/divider/testing';
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatDividerHarness } from '@angular/material/divider/testing';
import { MatListOptionCheckboxPosition } from '@angular/material/list';

export declare interface ActionListHarnessFilters extends BaseHarnessFilters {
}

export declare interface ActionListItemHarnessFilters extends BaseListItemHarnessFilters {
}

export declare interface BaseListItemHarnessFilters extends BaseHarnessFilters {
    text?: string | RegExp;
}

export declare interface ListHarnessFilters extends BaseHarnessFilters {
}

export declare interface ListItemHarnessFilters extends BaseListItemHarnessFilters {
}

export declare interface ListOptionHarnessFilters extends BaseListItemHarnessFilters {
    selected?: boolean;
}

/** Represents a section of a list falling under a specific header. */
declare interface ListSection<I> {
    /** The heading for this list section. `undefined` if there is no heading. */
    heading?: string;
    /** The items in this list section. */
    items: I[];
}

/** Harness for interacting with a standard mat-action-list in tests. */
export declare class MatActionListHarness extends MatListHarnessBase<typeof MatActionListItemHarness, MatActionListItemHarness, ActionListItemHarnessFilters> {
    /** The selector for the host element of a `MatActionList` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatActionListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which action list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ActionListHarnessFilters): HarnessPredicate<MatActionListHarness>;
    _itemHarness: typeof MatActionListItemHarness;
}

/** Harness for interacting with an action list item. */
export declare class MatActionListItemHarness extends MatListItemHarnessBase {
    /** The selector for the host element of a `MatListItem` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatActionListItemHarness` that
     * meets certain criteria.
     * @param options Options for filtering which action list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ActionListItemHarnessFilters): HarnessPredicate<MatActionListItemHarness>;
    /** Clicks on the action list item. */
    click(): Promise<void>;
    /** Focuses the action list item. */
    focus(): Promise<void>;
    /** Blurs the action list item. */
    blur(): Promise<void>;
    /** Whether the action list item is focused. */
    isFocused(): Promise<boolean>;
}

/** Harness for interacting with a standard mat-list in tests. */
export declare class MatListHarness extends MatListHarnessBase<typeof MatListItemHarness, MatListItemHarness, ListItemHarnessFilters> {
    /** The selector for the host element of a `MatList` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListHarness` that meets certain
     * criteria.
     * @param options Options for filtering which list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ListHarnessFilters): HarnessPredicate<MatListHarness>;
    _itemHarness: typeof MatListItemHarness;
}

/**
 * Shared behavior among the harnesses for the various `MatList` flavors.
 * @template T A constructor type for a list item harness type used by this list harness.
 * @template C The list item harness type that `T` constructs.
 * @template F The filter type used filter list item harness of type `C`.
 * @docs-private
 */
declare abstract class MatListHarnessBase<T extends ComponentHarnessConstructor<C> & {
    with: (options?: F) => HarnessPredicate<C>;
}, C extends ComponentHarness, F extends BaseListItemHarnessFilters> extends ComponentHarness {
    protected _itemHarness: T;
    /**
     * Gets a list of harnesses representing the items in this list.
     * @param filters Optional filters used to narrow which harnesses are included
     * @return The list of items matching the given filters.
     */
    getItems(filters?: F): Promise<C[]>;
    /**
     * Gets a list of `ListSection` representing the list items grouped by subheaders. If the list has
     * no subheaders it is represented as a single `ListSection` with an undefined `heading` property.
     * @param filters Optional filters used to narrow which list item harnesses are included
     * @return The list of items matching the given filters, grouped into sections by subheader.
     */
    getItemsGroupedBySubheader(filters?: F): Promise<ListSection<C>[]>;
    /**
     * Gets a list of sub-lists representing the list items grouped by dividers. If the list has no
     * dividers it is represented as a list with a single sub-list.
     * @param filters Optional filters used to narrow which list item harnesses are included
     * @return The list of items matching the given filters, grouped into sub-lists by divider.
     */
    getItemsGroupedByDividers(filters?: F): Promise<C[][]>;
    /**
     * Gets a list of harnesses representing all of the items, subheaders, and dividers
     * (in the order they appear in the list). Use `instanceof` to check which type of harness a given
     * item is.
     * @param filters Optional filters used to narrow which list items, subheaders, and dividers are
     *     included. A value of `false` for the `item`, `subheader`, or `divider` properties indicates
     *     that the respective harness type should be omitted completely.
     * @return The list of harnesses representing the items, subheaders, and dividers matching the
     *     given filters.
     */
    getItemsWithSubheadersAndDividers(filters: {
        item: false;
        subheader: false;
        divider: false;
    }): Promise<[]>;
    getItemsWithSubheadersAndDividers(filters: {
        item?: F | false;
        subheader: false;
        divider: false;
    }): Promise<C[]>;
    getItemsWithSubheadersAndDividers(filters: {
        item: false;
        subheader?: SubheaderHarnessFilters | false;
        divider: false;
    }): Promise<MatSubheaderHarness[]>;
    getItemsWithSubheadersAndDividers(filters: {
        item: false;
        subheader: false;
        divider?: DividerHarnessFilters | false;
    }): Promise<MatDividerHarness[]>;
    getItemsWithSubheadersAndDividers(filters: {
        item?: F | false;
        subheader?: SubheaderHarnessFilters | false;
        divider: false;
    }): Promise<(C | MatSubheaderHarness)[]>;
    getItemsWithSubheadersAndDividers(filters: {
        item?: F | false;
        subheader: false;
        divider?: false | DividerHarnessFilters;
    }): Promise<(C | MatDividerHarness)[]>;
    getItemsWithSubheadersAndDividers(filters: {
        item: false;
        subheader?: false | SubheaderHarnessFilters;
        divider?: false | DividerHarnessFilters;
    }): Promise<(MatSubheaderHarness | MatDividerHarness)[]>;
    getItemsWithSubheadersAndDividers(filters?: {
        item?: F | false;
        subheader?: SubheaderHarnessFilters | false;
        divider?: DividerHarnessFilters | false;
    }): Promise<(C | MatSubheaderHarness | MatDividerHarness)[]>;
}

/** Harness for interacting with a list item. */
export declare class MatListItemHarness extends MatListItemHarnessBase {
    /** The selector for the host element of a `MatListItem` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListItemHarness` that meets
     * certain criteria.
     * @param options Options for filtering which list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ListItemHarnessFilters): HarnessPredicate<MatListItemHarness>;
}

/**
 * Shared behavior among the harnesses for the various `MatListItem` flavors.
 * @docs-private
 */
declare abstract class MatListItemHarnessBase extends ContentContainerComponentHarness<MatListItemSection> {
    private _lines;
    private _avatar;
    private _icon;
    /** Gets the full text content of the list item. */
    getText(): Promise<string>;
    /** Gets the lines of text (`mat-line` elements) in this nav list item. */
    getLinesText(): Promise<string[]>;
    /** Whether this list item has an avatar. */
    hasAvatar(): Promise<boolean>;
    /** Whether this list item has an icon. */
    hasIcon(): Promise<boolean>;
    /** Whether this list option is disabled. */
    isDisabled(): Promise<boolean>;
}

/** Selectors for the various list item sections that may contain user content. */
export declare const enum MatListItemSection {
    CONTENT = ".mat-list-item-content"
}

/** Harness for interacting with a list option. */
export declare class MatListOptionHarness extends MatListItemHarnessBase {
    /** The selector for the host element of a `MatListOption` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListOptionHarness` that
     * meets certain criteria.
     * @param options Options for filtering which list option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ListOptionHarnessFilters): HarnessPredicate<MatListOptionHarness>;
    private _itemContent;
    /** Gets the position of the checkbox relative to the list option content. */
    getCheckboxPosition(): Promise<MatListOptionCheckboxPosition>;
    /** Whether the list option is selected. */
    isSelected(): Promise<boolean>;
    /** Focuses the list option. */
    focus(): Promise<void>;
    /** Blurs the list option. */
    blur(): Promise<void>;
    /** Whether the list option is focused. */
    isFocused(): Promise<boolean>;
    /** Toggles the checked state of the checkbox. */
    toggle(): Promise<void>;
    /**
     * Puts the list option in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked.
     */
    select(): Promise<void>;
    /**
     * Puts the list option in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked.
     */
    deselect(): Promise<void>;
}

/** Harness for interacting with a standard mat-nav-list in tests. */
export declare class MatNavListHarness extends MatListHarnessBase<typeof MatNavListItemHarness, MatNavListItemHarness, NavListItemHarnessFilters> {
    /** The selector for the host element of a `MatNavList` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNavListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which nav list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: NavListHarnessFilters): HarnessPredicate<MatNavListHarness>;
    _itemHarness: typeof MatNavListItemHarness;
}

/** Harness for interacting with a nav list item. */
export declare class MatNavListItemHarness extends MatListItemHarnessBase {
    /** The selector for the host element of a `MatListItem` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNavListItemHarness` that
     * meets certain criteria.
     * @param options Options for filtering which nav list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: NavListItemHarnessFilters): HarnessPredicate<MatNavListItemHarness>;
    /** Gets the href for this nav list item. */
    getHref(): Promise<string | null>;
    /** Clicks on the nav list item. */
    click(): Promise<void>;
    /** Focuses the nav list item. */
    focus(): Promise<void>;
    /** Blurs the nav list item. */
    blur(): Promise<void>;
    /** Whether the nav list item is focused. */
    isFocused(): Promise<boolean>;
}

/** Harness for interacting with a standard mat-selection-list in tests. */
export declare class MatSelectionListHarness extends MatListHarnessBase<typeof MatListOptionHarness, MatListOptionHarness, ListOptionHarnessFilters> {
    /** The selector for the host element of a `MatSelectionList` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSelectionListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which selection list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: SelectionListHarnessFilters): HarnessPredicate<MatSelectionListHarness>;
    _itemHarness: typeof MatListOptionHarness;
    /** Whether the selection list is disabled. */
    isDisabled(): Promise<boolean>;
    /**
     * Selects all items matching any of the given filters.
     * @param filters Filters that specify which items should be selected.
     */
    selectItems(...filters: ListOptionHarnessFilters[]): Promise<void>;
    /**
     * Deselects all items matching any of the given filters.
     * @param filters Filters that specify which items should be deselected.
     */
    deselectItems(...filters: ListItemHarnessFilters[]): Promise<void>;
    /** Gets all items matching the given list of filters. */
    private _getItems;
}

/** Harness for interacting with a list subheader. */
declare class MatSubheaderHarness extends ComponentHarness {
    static hostSelector: string;
    static with(options?: SubheaderHarnessFilters): HarnessPredicate<MatSubheaderHarness>;
    /** Gets the full text content of the list item (including text from any font icons). */
    getText(): Promise<string>;
}

export declare interface NavListHarnessFilters extends BaseHarnessFilters {
}

export declare interface NavListItemHarnessFilters extends BaseListItemHarnessFilters {
    href?: string | RegExp | null;
}

export declare interface SelectionListHarnessFilters extends BaseHarnessFilters {
}

export declare interface SubheaderHarnessFilters extends BaseHarnessFilters {
    text?: string | RegExp;
}

export { }
