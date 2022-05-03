import { _AbstractConstructor } from '@angular/material/core';
import { AfterContentInit } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import { CanDisable } from '@angular/material/core';
import { CanDisableRipple } from '@angular/material/core';
import { ChangeDetectorRef } from '@angular/core';
import { _Constructor } from '@angular/material/core';
import { ControlValueAccessor } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { FocusMonitor } from '@angular/cdk/a11y';
import * as i0 from '@angular/core';
import * as i3 from '@angular/material/core';
import * as i4 from '@angular/common';
import * as i5 from '@angular/material/divider';
import { InjectionToken } from '@angular/core';
import { MatLine } from '@angular/material/core';
import { OnChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { QueryList } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { ThemePalette } from '@angular/material/core';

declare namespace i1 {
    export {
        MAT_LIST,
        MAT_NAV_LIST,
        MatNavList,
        MatList,
        MatListAvatarCssMatStyler,
        MatListIconCssMatStyler,
        MatListSubheaderCssMatStyler,
        MatListItem
    }
}

declare namespace i2 {
    export {
        MAT_SELECTION_LIST_VALUE_ACCESSOR,
        MatSelectionListChange,
        MatListOptionCheckboxPosition,
        MatListOption,
        MatSelectionList
    }
}

/**
 * Injection token that can be used to inject instances of `MatList`. It serves as
 * alternative token to the actual `MatList` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export declare const MAT_LIST: InjectionToken<MatList>;

/**
 * Injection token that can be used to inject instances of `MatNavList`. It serves as
 * alternative token to the actual `MatNavList` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export declare const MAT_NAV_LIST: InjectionToken<MatNavList>;

/** @docs-private */
export declare const MAT_SELECTION_LIST_VALUE_ACCESSOR: any;

export declare class MatList extends _MatListBase implements CanDisable, CanDisableRipple, OnChanges, OnDestroy {
    private _elementRef;
    /** Emits when the state of the list changes. */
    readonly _stateChanges: Subject<void>;
    constructor(_elementRef: ElementRef<HTMLElement>);
    _getListType(): 'list' | 'action-list' | null;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatList, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatList, "mat-list, mat-action-list", ["matList"], { "disableRipple": "disableRipple"; "disabled": "disabled"; }, {}, never, ["*"], false>;
}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatListAvatarCssMatStyler {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatListAvatarCssMatStyler, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatListAvatarCssMatStyler, "[mat-list-avatar], [matListAvatar]", never, {}, {}, never, never, false>;
}

/** @docs-private */
declare const _MatListBase: _Constructor<CanDisable> & _AbstractConstructor<CanDisable> & _Constructor<CanDisableRipple> & _AbstractConstructor<CanDisableRipple> & {
    new (): {};
};

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatListIconCssMatStyler {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatListIconCssMatStyler, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatListIconCssMatStyler, "[mat-list-icon], [matListIcon]", never, {}, {}, never, never, false>;
}

/** An item within a Material Design list. */
export declare class MatListItem extends _MatListItemMixinBase implements AfterContentInit, CanDisableRipple, OnDestroy {
    private _element;
    private _isInteractiveList;
    private _list?;
    private readonly _destroyed;
    _lines: QueryList<MatLine>;
    _avatar: MatListAvatarCssMatStyler;
    _icon: MatListIconCssMatStyler;
    constructor(_element: ElementRef<HTMLElement>, _changeDetectorRef: ChangeDetectorRef, navList?: MatNavList, list?: MatList);
    /** Whether the option is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    private _disabled;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Whether this list item should show a ripple effect when clicked. */
    _isRippleDisabled(): boolean;
    /** Retrieves the DOM element of the component host. */
    _getHostElement(): HTMLElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatListItem, [null, null, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatListItem, "mat-list-item, a[mat-list-item], button[mat-list-item]", ["matListItem"], { "disableRipple": "disableRipple"; "disabled": "disabled"; }, {}, ["_avatar", "_icon", "_lines"], ["[mat-list-avatar], [mat-list-icon], [matListAvatar], [matListIcon]", "[mat-line], [matLine]", "*"], false>;
}

/** @docs-private */
declare const _MatListItemMixinBase: _Constructor<CanDisableRipple> & _AbstractConstructor<CanDisableRipple> & {
    new (): {};
};

export declare class MatListModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatListModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatListModule, [typeof i1.MatList, typeof i1.MatNavList, typeof i1.MatListItem, typeof i1.MatListAvatarCssMatStyler, typeof i1.MatListIconCssMatStyler, typeof i1.MatListSubheaderCssMatStyler, typeof i2.MatSelectionList, typeof i2.MatListOption], [typeof i3.MatLineModule, typeof i3.MatRippleModule, typeof i3.MatCommonModule, typeof i3.MatPseudoCheckboxModule, typeof i4.CommonModule], [typeof i1.MatList, typeof i1.MatNavList, typeof i1.MatListItem, typeof i1.MatListAvatarCssMatStyler, typeof i3.MatLineModule, typeof i3.MatCommonModule, typeof i1.MatListIconCssMatStyler, typeof i1.MatListSubheaderCssMatStyler, typeof i3.MatPseudoCheckboxModule, typeof i2.MatSelectionList, typeof i2.MatListOption, typeof i5.MatDividerModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatListModule>;
}

/**
 * Component for list-options of selection-list. Each list-option can automatically
 * generate a checkbox and can put current item into the selectionModel of selection-list
 * if the current item is selected.
 */
export declare class MatListOption extends _MatListOptionBase implements AfterContentInit, OnDestroy, OnInit, FocusableOption, CanDisableRipple {
    private _element;
    private _changeDetector;
    /** @docs-private */
    selectionList: MatSelectionList;
    private _selected;
    private _disabled;
    private _hasFocus;
    _avatar: MatListAvatarCssMatStyler;
    _icon: MatListIconCssMatStyler;
    _lines: QueryList<MatLine>;
    /**
     * Emits when the selected state of the option has changed.
     * Use to facilitate two-data binding to the `selected` property.
     * @docs-private
     */
    readonly selectedChange: EventEmitter<boolean>;
    /** DOM element containing the item's text. */
    _text: ElementRef;
    /** Whether the label should appear before or after the checkbox. Defaults to 'after' */
    checkboxPosition: MatListOptionCheckboxPosition;
    /** Theme color of the list option. This sets the color of the checkbox. */
    get color(): ThemePalette;
    set color(newValue: ThemePalette);
    private _color;
    /**
     * This is set to true after the first OnChanges cycle so we don't clear the value of `selected`
     * in the first cycle.
     */
    private _inputsInitialized;
    /** Value of the option */
    get value(): any;
    set value(newValue: any);
    private _value;
    /** Whether the option is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    /** Whether the option is selected. */
    get selected(): boolean;
    set selected(value: BooleanInput);
    constructor(_element: ElementRef<HTMLElement>, _changeDetector: ChangeDetectorRef, 
    /** @docs-private */
    selectionList: MatSelectionList);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Toggles the selection state of the option. */
    toggle(): void;
    /** Allows for programmatic focusing of the option. */
    focus(): void;
    /**
     * Returns the list item's text label. Implemented as a part of the FocusKeyManager.
     * @docs-private
     */
    getLabel(): any;
    /** Whether this list item should show a ripple effect when clicked. */
    _isRippleDisabled(): boolean;
    _handleClick(): void;
    _handleFocus(): void;
    _handleBlur(): void;
    /** Retrieves the DOM element of the component host. */
    _getHostElement(): HTMLElement;
    /** Sets the selected state of the option. Returns whether the value has changed. */
    _setSelected(selected: boolean): boolean;
    /**
     * Notifies Angular that the option needs to be checked in the next change detection run. Mainly
     * used to trigger an update of the list option if the disabled state of the selection list
     * changed.
     */
    _markForCheck(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatListOption, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatListOption, "mat-list-option", ["matListOption"], { "disableRipple": "disableRipple"; "checkboxPosition": "checkboxPosition"; "color": "color"; "value": "value"; "disabled": "disabled"; "selected": "selected"; }, { "selectedChange": "selectedChange"; }, ["_avatar", "_icon", "_lines"], ["*", "[mat-list-avatar], [mat-list-icon], [matListAvatar], [matListIcon]"], false>;
}

declare const _MatListOptionBase: _Constructor<CanDisableRipple> & _AbstractConstructor<CanDisableRipple> & {
    new (): {};
};

/**
 * Type describing possible positions of a checkbox in a list option
 * with respect to the list item's text.
 */
export declare type MatListOptionCheckboxPosition = 'before' | 'after';

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatListSubheaderCssMatStyler {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatListSubheaderCssMatStyler, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatListSubheaderCssMatStyler, "[mat-subheader], [matSubheader]", never, {}, {}, never, never, false>;
}

export declare class MatNavList extends _MatListBase implements CanDisable, CanDisableRipple, OnChanges, OnDestroy {
    /** Emits when the state of the list changes. */
    readonly _stateChanges: Subject<void>;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatNavList, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatNavList, "mat-nav-list", ["matNavList"], { "disableRipple": "disableRipple"; "disabled": "disabled"; }, {}, never, ["*"], false>;
}

/**
 * Material Design list component where each item is a selectable option. Behaves as a listbox.
 */
export declare class MatSelectionList extends _MatSelectionListBase implements CanDisableRipple, AfterContentInit, ControlValueAccessor, OnDestroy, OnChanges {
    private _element;
    private _changeDetector;
    private _focusMonitor;
    private _multiple;
    private _contentInitialized;
    /** The FocusKeyManager which handles focus. */
    _keyManager: FocusKeyManager<MatListOption>;
    /** The option components contained within this selection-list. */
    options: QueryList<MatListOption>;
    /** Emits a change event whenever the selected state of an option changes. */
    readonly selectionChange: EventEmitter<MatSelectionListChange>;
    /** Theme color of the selection list. This sets the checkbox color for all list options. */
    color: ThemePalette;
    /**
     * Function used for comparing an option against the selected value when determining which
     * options should appear as selected. The first argument is the value of an options. The second
     * one is a value from the selected value. A boolean must be returned.
     */
    compareWith: (o1: any, o2: any) => boolean;
    /** Whether the selection list is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    private _disabled;
    /** Whether selection is limited to one or multiple items (default multiple). */
    get multiple(): boolean;
    set multiple(value: BooleanInput);
    /** The currently selected options. */
    selectedOptions: SelectionModel<MatListOption>;
    /** The tabindex of the selection list. */
    _tabIndex: number;
    /** View to model callback that should be called whenever the selected options change. */
    private _onChange;
    /** Keeps track of the currently-selected value. */
    _value: string[] | null;
    /** Emits when the list has been destroyed. */
    private readonly _destroyed;
    /** View to model callback that should be called if the list or its options lost focus. */
    _onTouched: () => void;
    /** Whether the list has been destroyed. */
    private _isDestroyed;
    constructor(_element: ElementRef<HTMLElement>, _changeDetector: ChangeDetectorRef, _focusMonitor: FocusMonitor);
    ngAfterContentInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /** Focuses the selection list. */
    focus(options?: FocusOptions): void;
    /** Selects all of the options. Returns the options that changed as a result. */
    selectAll(): MatListOption[];
    /** Deselects all of the options. Returns the options that changed as a result. */
    deselectAll(): MatListOption[];
    /** Sets the focused option of the selection-list. */
    _setFocusedOption(option: MatListOption): void;
    /**
     * Removes an option from the selection list and updates the active item.
     * @returns Currently-active item.
     */
    _removeOptionFromList(option: MatListOption): MatListOption | null;
    /** Passes relevant key presses to our key manager. */
    _keydown(event: KeyboardEvent): void;
    /** Reports a value change to the ControlValueAccessor */
    _reportValueChange(): void;
    /** Emits a change event if the selected state of an option changed. */
    _emitChangeEvent(options: MatListOption[]): void;
    /** Implemented as part of ControlValueAccessor. */
    writeValue(values: string[]): void;
    /** Implemented as a part of ControlValueAccessor. */
    setDisabledState(isDisabled: boolean): void;
    /** Implemented as part of ControlValueAccessor. */
    registerOnChange(fn: (value: any) => void): void;
    /** Implemented as part of ControlValueAccessor. */
    registerOnTouched(fn: () => void): void;
    /** Sets the selected options based on the specified values. */
    private _setOptionsFromValues;
    /** Returns the values of the selected options. */
    private _getSelectedOptionValues;
    /** Toggles the state of the currently focused option if enabled. */
    private _toggleFocusedOption;
    /**
     * Sets the selected state on all of the options
     * and emits an event if anything changed.
     */
    private _setAllOptionsSelected;
    /**
     * Utility to ensure all indexes are valid.
     * @param index The index to be checked.
     * @returns True if the index is valid for our list of options.
     */
    private _isValidIndex;
    /** Returns the index of the specified list option. */
    private _getOptionIndex;
    /** Marks all the options to be checked in the next change detection run. */
    private _markOptionsForCheck;
    /**
     * Removes the tabindex from the selection list and resets it back afterwards, allowing the user
     * to tab out of it. This prevents the list from capturing focus and redirecting it back within
     * the list, creating a focus trap if it user tries to tab away.
     */
    private _allowFocusEscape;
    /** Updates the tabindex based upon if the selection list is empty. */
    private _updateTabIndex;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSelectionList, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatSelectionList, "mat-selection-list", ["matSelectionList"], { "disableRipple": "disableRipple"; "color": "color"; "compareWith": "compareWith"; "disabled": "disabled"; "multiple": "multiple"; }, { "selectionChange": "selectionChange"; }, ["options"], ["*"], false>;
}

declare const _MatSelectionListBase: _Constructor<CanDisableRipple> & _AbstractConstructor<CanDisableRipple> & {
    new (): {};
};

/** Change event that is being fired whenever the selected state of an option changes. */
export declare class MatSelectionListChange {
    /** Reference to the selection list that emitted the event. */
    source: MatSelectionList;
    /** Reference to the options that have been changed. */
    options: MatListOption[];
    constructor(
    /** Reference to the selection list that emitted the event. */
    source: MatSelectionList, 
    /** Reference to the options that have been changed. */
    options: MatListOption[]);
}

export { }
