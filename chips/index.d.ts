import { _AbstractConstructor } from '@angular/material/core';
import { AfterContentInit } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import { CanColor } from '@angular/material/core';
import { CanDisable } from '@angular/material/core';
import { CanDisableRipple } from '@angular/material/core';
import { CanUpdateErrorState } from '@angular/material/core';
import { ChangeDetectorRef } from '@angular/core';
import { _Constructor } from '@angular/material/core';
import { ControlValueAccessor } from '@angular/forms';
import { Directionality } from '@angular/cdk/bidi';
import { DoCheck } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { EventEmitter } from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { FormGroupDirective } from '@angular/forms';
import { HasTabIndex } from '@angular/material/core';
import * as i0 from '@angular/core';
import * as i4 from '@angular/material/core';
import { InjectionToken } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { NgControl } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { OnChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { QueryList } from '@angular/core';
import { RippleConfig } from '@angular/material/core';
import { RippleGlobalOptions } from '@angular/material/core';
import { RippleTarget } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';

declare namespace i1 {
    export {
        MatChipListChange,
        MatChipList
    }
}

declare namespace i2 {
    export {
        MatChipEvent,
        MatChipSelectionChange,
        MAT_CHIP_REMOVE,
        MAT_CHIP_AVATAR,
        MAT_CHIP_TRAILING_ICON,
        MatChipAvatar,
        MatChipTrailingIcon,
        MatChip,
        MatChipRemove
    }
}

declare namespace i3 {
    export {
        MatChipInputEvent,
        MatChipInput
    }
}

/**
 * Injection token that can be used to reference instances of `MatChipAvatar`. It serves as
 * alternative token to the actual `MatChipAvatar` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_CHIP_AVATAR: InjectionToken<MatChipAvatar>;

/**
 * Injection token that can be used to reference instances of `MatChipRemove`. It serves as
 * alternative token to the actual `MatChipRemove` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_CHIP_REMOVE: InjectionToken<MatChipRemove>;

/**
 * Injection token that can be used to reference instances of `MatChipTrailingIcon`. It serves as
 * alternative token to the actual `MatChipTrailingIcon` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_CHIP_TRAILING_ICON: InjectionToken<MatChipTrailingIcon>;

/** Injection token to be used to override the default options for the chips module. */
export declare const MAT_CHIPS_DEFAULT_OPTIONS: InjectionToken<MatChipsDefaultOptions>;

/** Material Design styled chip directive. Used inside the MatChipList component. */
export declare class MatChip extends _MatChipMixinBase implements FocusableOption, OnDestroy, CanColor, CanDisableRipple, RippleTarget, HasTabIndex, CanDisable {
    private _ngZone;
    private _changeDetectorRef;
    /** Reference to the RippleRenderer for the chip. */
    private _chipRipple;
    /**
     * Reference to the element that acts as the chip's ripple target. This element is
     * dynamically added as a child node of the chip. The chip itself cannot be used as the
     * ripple target because it must be the host of the focus indicator.
     */
    private _chipRippleTarget;
    /**
     * Ripple configuration for ripples that are launched on pointer down. The ripple config
     * is set to the global ripple options since we don't have any configurable options for
     * the chip ripples.
     * @docs-private
     */
    rippleConfig: RippleConfig & RippleGlobalOptions;
    /**
     * Whether ripples are disabled on interaction
     * @docs-private
     */
    get rippleDisabled(): boolean;
    /** Whether the chip has focus. */
    _hasFocus: boolean;
    /** Whether animations for the chip are enabled. */
    _animationsDisabled: boolean;
    /** Whether the chip list is selectable */
    chipListSelectable: boolean;
    /** Whether the chip list is in multi-selection mode. */
    _chipListMultiple: boolean;
    /** Whether the chip list as a whole is disabled. */
    _chipListDisabled: boolean;
    /** The chip avatar */
    avatar: MatChipAvatar;
    /** The chip's trailing icon. */
    trailingIcon: MatChipTrailingIcon;
    /** The chip's remove toggler. */
    removeIcon: MatChipRemove;
    /** ARIA role that should be applied to the chip. */
    role: string;
    /** Whether the chip is selected. */
    get selected(): boolean;
    set selected(value: BooleanInput);
    protected _selected: boolean;
    /** The value of the chip. Defaults to the content inside `<mat-chip>` tags. */
    get value(): any;
    set value(value: any);
    protected _value: any;
    /**
     * Whether or not the chip is selectable. When a chip is not selectable,
     * changes to its selected state are always ignored. By default a chip is
     * selectable, and it becomes non-selectable if its parent chip list is
     * not selectable.
     */
    get selectable(): boolean;
    set selectable(value: BooleanInput);
    protected _selectable: boolean;
    /** Whether the chip is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    protected _disabled: boolean;
    /**
     * Determines whether or not the chip displays the remove styling and emits (removed) events.
     */
    get removable(): boolean;
    set removable(value: BooleanInput);
    protected _removable: boolean;
    /** Emits when the chip is focused. */
    readonly _onFocus: Subject<MatChipEvent>;
    /** Emits when the chip is blured. */
    readonly _onBlur: Subject<MatChipEvent>;
    /** Emitted when the chip is selected or deselected. */
    readonly selectionChange: EventEmitter<MatChipSelectionChange>;
    /** Emitted when the chip is destroyed. */
    readonly destroyed: EventEmitter<MatChipEvent>;
    /** Emitted when a chip is to be removed. */
    readonly removed: EventEmitter<MatChipEvent>;
    /** The ARIA selected applied to the chip. */
    get ariaSelected(): string | null;
    constructor(elementRef: ElementRef<HTMLElement>, _ngZone: NgZone, platform: Platform, globalRippleOptions: RippleGlobalOptions | null, _changeDetectorRef: ChangeDetectorRef, _document: any, animationMode?: string, tabIndex?: string);
    _addHostClassName(): void;
    ngOnDestroy(): void;
    /** Selects the chip. */
    select(): void;
    /** Deselects the chip. */
    deselect(): void;
    /** Select this chip and emit selected event */
    selectViaInteraction(): void;
    /** Toggles the current selected state of this chip. */
    toggleSelected(isUserInput?: boolean): boolean;
    /** Allows for programmatic focusing of the chip. */
    focus(): void;
    /**
     * Allows for programmatic removal of the chip. Called by the MatChipList when the DELETE or
     * BACKSPACE keys are pressed.
     *
     * Informs any listeners of the removal request. Does not remove the chip from the DOM.
     */
    remove(): void;
    /** Handles click events on the chip. */
    _handleClick(event: Event): void;
    /** Handle custom key presses. */
    _handleKeydown(event: KeyboardEvent): void;
    _blur(): void;
    private _dispatchSelectionChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatChip, [null, null, null, { optional: true; }, null, null, { optional: true; }, { attribute: "tabindex"; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatChip, "mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]", ["matChip"], { "color": "color"; "disableRipple": "disableRipple"; "tabIndex": "tabIndex"; "role": "role"; "selected": "selected"; "value": "value"; "selectable": "selectable"; "disabled": "disabled"; "removable": "removable"; }, { "selectionChange": "selectionChange"; "destroyed": "destroyed"; "removed": "removed"; }, ["avatar", "trailingIcon", "removeIcon"], never, false>;
}

/**
 * Dummy directive to add CSS class to chip avatar.
 * @docs-private
 */
export declare class MatChipAvatar {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatChipAvatar, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatChipAvatar, "mat-chip-avatar, [matChipAvatar]", never, {}, {}, never, never, false>;
}

/** @docs-private */
declare abstract class MatChipBase {
    _elementRef: ElementRef;
    abstract disabled: boolean;
    constructor(_elementRef: ElementRef);
}

/** Represents an event fired on an individual `mat-chip`. */
export declare interface MatChipEvent {
    /** The chip the event was fired on. */
    chip: MatChip;
}

/**
 * Directive that adds chip-specific behaviors to an input element inside `<mat-form-field>`.
 * May be placed inside or outside of an `<mat-chip-list>`.
 */
export declare class MatChipInput implements MatChipTextControl, OnChanges, OnDestroy, AfterContentInit {
    protected _elementRef: ElementRef<HTMLInputElement>;
    private _defaultOptions;
    /** Used to prevent focus moving to chips while user is holding backspace */
    private _focusLastChipOnBackspace;
    /** Whether the control is focused. */
    focused: boolean;
    _chipList: MatChipList;
    /** Register input for chip list */
    set chipList(value: MatChipList);
    /**
     * Whether or not the chipEnd event will be emitted when the input is blurred.
     */
    get addOnBlur(): boolean;
    set addOnBlur(value: BooleanInput);
    _addOnBlur: boolean;
    /**
     * The list of key codes that will trigger a chipEnd event.
     *
     * Defaults to `[ENTER]`.
     */
    separatorKeyCodes: readonly number[] | ReadonlySet<number>;
    /** Emitted when a chip is to be added. */
    readonly chipEnd: EventEmitter<MatChipInputEvent>;
    /** The input's placeholder text. */
    placeholder: string;
    /** Unique id for the input. */
    id: string;
    /** Whether the input is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    private _disabled;
    /** Whether the input is empty. */
    get empty(): boolean;
    /** The native input element to which this directive is attached. */
    readonly inputElement: HTMLInputElement;
    constructor(_elementRef: ElementRef<HTMLInputElement>, _defaultOptions: MatChipsDefaultOptions);
    ngOnChanges(): void;
    ngOnDestroy(): void;
    ngAfterContentInit(): void;
    /** Utility method to make host definition/tests more clear. */
    _keydown(event?: KeyboardEvent): void;
    /**
     * Pass events to the keyboard manager. Available here for tests.
     */
    _keyup(event: KeyboardEvent): void;
    /** Checks to see if the blur should emit the (chipEnd) event. */
    _blur(): void;
    _focus(): void;
    /** Checks to see if the (chipEnd) event needs to be emitted. */
    _emitChipEnd(event?: KeyboardEvent): void;
    _onInput(): void;
    /** Focuses the input. */
    focus(options?: FocusOptions): void;
    /** Clears the input */
    clear(): void;
    /** Checks whether a keycode is one of the configured separators. */
    private _isSeparatorKey;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatChipInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatChipInput, "input[matChipInputFor]", ["matChipInput", "matChipInputFor"], { "chipList": "matChipInputFor"; "addOnBlur": "matChipInputAddOnBlur"; "separatorKeyCodes": "matChipInputSeparatorKeyCodes"; "placeholder": "placeholder"; "id": "id"; "disabled": "disabled"; }, { "chipEnd": "matChipInputTokenEnd"; }, never, never, false>;
}

/** Represents an input event on a `matChipInput`. */
export declare interface MatChipInputEvent {
    /**
     * The native `<input>` element that the event is being fired for.
     * @deprecated Use `MatChipInputEvent#chipInput.inputElement` instead.
     * @breaking-change 13.0.0 This property will be removed.
     */
    input: HTMLInputElement;
    /** The value of the input. */
    value: string;
    /** Reference to the chip input that emitted the event. */
    chipInput: MatChipInput;
}

/**
 * A material design chips component (named ChipList for its similarity to the List component).
 */
export declare class MatChipList extends _MatChipListBase implements MatFormFieldControl<any>, ControlValueAccessor, AfterContentInit, DoCheck, OnInit, OnDestroy, CanUpdateErrorState {
    protected _elementRef: ElementRef<HTMLElement>;
    private _changeDetectorRef;
    private _dir;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    readonly controlType: string;
    /**
     * When a chip is destroyed, we store the index of the destroyed chip until the chips
     * query list notifies about the update. This is necessary because we cannot determine an
     * appropriate chip that should receive focus until the array of chips updated completely.
     */
    private _lastDestroyedChipIndex;
    /** Subject that emits when the component has been destroyed. */
    private readonly _destroyed;
    /** Subscription to focus changes in the chips. */
    private _chipFocusSubscription;
    /** Subscription to blur changes in the chips. */
    private _chipBlurSubscription;
    /** Subscription to selection changes in chips. */
    private _chipSelectionSubscription;
    /** Subscription to remove changes in chips. */
    private _chipRemoveSubscription;
    /** The chip input to add more chips */
    protected _chipInput: MatChipTextControl;
    /** Uid of the chip list */
    _uid: string;
    /** Tab index for the chip list. */
    _tabIndex: number;
    /**
     * User defined tab index.
     * When it is not null, use user defined tab index. Otherwise use _tabIndex
     */
    _userTabIndex: number | null;
    /** The FocusKeyManager which handles focus. */
    _keyManager: FocusKeyManager<MatChip>;
    /** Function when touched */
    _onTouched: () => void;
    /** Function when changed */
    _onChange: (value: any) => void;
    _selectionModel: SelectionModel<MatChip>;
    /** The array of selected chips inside chip list. */
    get selected(): MatChip[] | MatChip;
    /** The ARIA role applied to the chip list. */
    get role(): string | null;
    set role(role: string | null);
    private _explicitRole?;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    userAriaDescribedBy: string;
    /** An object used to control when error messages are shown. */
    errorStateMatcher: ErrorStateMatcher;
    /** Whether the user should be allowed to select multiple chips. */
    get multiple(): boolean;
    set multiple(value: BooleanInput);
    private _multiple;
    /**
     * A function to compare the option values with the selected values. The first argument
     * is a value from an option. The second is a value from the selection. A boolean
     * should be returned.
     */
    get compareWith(): (o1: any, o2: any) => boolean;
    set compareWith(fn: (o1: any, o2: any) => boolean);
    private _compareWith;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get value(): any;
    set value(value: any);
    protected _value: any;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get id(): string;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get required(): boolean;
    set required(value: BooleanInput);
    protected _required: boolean | undefined;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get placeholder(): string;
    set placeholder(value: string);
    protected _placeholder: string;
    /** Whether any chips or the matChipInput inside of this chip-list has focus. */
    get focused(): boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get empty(): boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get shouldLabelFloat(): boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    protected _disabled: boolean;
    /** Orientation of the chip list. */
    ariaOrientation: 'horizontal' | 'vertical';
    /**
     * Whether or not this chip list is selectable. When a chip list is not selectable,
     * the selected states for all the chips inside the chip list are always ignored.
     */
    get selectable(): boolean;
    set selectable(value: BooleanInput);
    protected _selectable: boolean;
    set tabIndex(value: number);
    /** Combined stream of all of the child chips' selection change events. */
    get chipSelectionChanges(): Observable<MatChipSelectionChange>;
    /** Combined stream of all of the child chips' focus change events. */
    get chipFocusChanges(): Observable<MatChipEvent>;
    /** Combined stream of all of the child chips' blur change events. */
    get chipBlurChanges(): Observable<MatChipEvent>;
    /** Combined stream of all of the child chips' remove change events. */
    get chipRemoveChanges(): Observable<MatChipEvent>;
    /** Event emitted when the selected chip list value has been changed by the user. */
    readonly change: EventEmitter<MatChipListChange>;
    /**
     * Event that emits whenever the raw value of the chip-list changes. This is here primarily
     * to facilitate the two-way binding for the `value` input.
     * @docs-private
     */
    readonly valueChange: EventEmitter<any>;
    /** The chips contained within this chip list. */
    chips: QueryList<MatChip>;
    constructor(_elementRef: ElementRef<HTMLElement>, _changeDetectorRef: ChangeDetectorRef, _dir: Directionality, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, _defaultErrorStateMatcher: ErrorStateMatcher, ngControl: NgControl);
    ngAfterContentInit(): void;
    ngOnInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    /** Associates an HTML input element with this chip list. */
    registerInput(inputElement: MatChipTextControl): void;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    setDescribedByIds(ids: string[]): void;
    writeValue(value: any): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    onContainerClick(event: MouseEvent): void;
    /**
     * Focuses the first non-disabled chip in this chip list, or the associated input when there
     * are no eligible chips.
     */
    focus(options?: FocusOptions): void;
    /** Attempt to focus an input if we have one. */
    _focusInput(options?: FocusOptions): void;
    /**
     * Pass events to the keyboard manager. Available here for tests.
     */
    _keydown(event: KeyboardEvent): void;
    /**
     * Check the tab index as you should not be allowed to focus an empty list.
     */
    protected _updateTabIndex(): void;
    /**
     * If the amount of chips changed, we need to update the
     * key manager state and focus the next closest chip.
     */
    protected _updateFocusForDestroyedChips(): void;
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param index The index to be checked.
     * @returns True if the index is valid for our list of chips.
     */
    private _isValidIndex;
    _setSelectionByValue(value: any, isUserInput?: boolean): void;
    /**
     * Finds and selects the chip based on its value.
     * @returns Chip that has the corresponding value.
     */
    private _selectValue;
    private _initializeSelection;
    /**
     * Deselects every chip in the list.
     * @param skip Chip that should not be deselected.
     */
    private _clearSelection;
    /**
     * Sorts the model values, ensuring that they keep the same
     * order that they have in the panel.
     */
    private _sortValues;
    /** Emits change event to set the model value. */
    private _propagateChanges;
    /** When blurred, mark the field as touched when focus moved outside the chip list. */
    _blur(): void;
    /** Mark the field as touched */
    _markAsTouched(): void;
    /**
     * Removes the `tabindex` from the chip list and resets it back afterwards, allowing the
     * user to tab out of it. This prevents the list from capturing focus and redirecting
     * it back to the first chip, creating a focus trap, if it user tries to tab away.
     */
    _allowFocusEscape(): void;
    private _resetChips;
    private _dropSubscriptions;
    /** Listens to user-generated selection events on each chip. */
    private _listenToChipsSelection;
    /** Listens to user-generated selection events on each chip. */
    private _listenToChipsFocus;
    private _listenToChipsRemoved;
    /** Checks whether an event comes from inside a chip element. */
    private _originatesFromChip;
    /** Checks whether any of the chips is focused. */
    private _hasFocusedChip;
    /** Syncs the list's state with the individual chips. */
    private _syncChipsState;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatChipList, [null, null, { optional: true; }, { optional: true; }, { optional: true; }, null, { optional: true; self: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatChipList, "mat-chip-list", ["matChipList"], { "role": "role"; "userAriaDescribedBy": "aria-describedby"; "errorStateMatcher": "errorStateMatcher"; "multiple": "multiple"; "compareWith": "compareWith"; "value": "value"; "required": "required"; "placeholder": "placeholder"; "disabled": "disabled"; "ariaOrientation": "aria-orientation"; "selectable": "selectable"; "tabIndex": "tabIndex"; }, { "change": "change"; "valueChange": "valueChange"; }, ["chips"], ["*"], false>;
}

/** @docs-private */
declare const _MatChipListBase: _Constructor<CanUpdateErrorState> & _AbstractConstructor<CanUpdateErrorState> & {
    new (_defaultErrorStateMatcher: ErrorStateMatcher, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, ngControl: NgControl): {
        /**
         * Emits whenever the component state changes and should cause the parent
         * form-field to update. Implemented as part of `MatFormFieldControl`.
         * @docs-private
         */
        readonly stateChanges: Subject<void>;
        _defaultErrorStateMatcher: ErrorStateMatcher;
        _parentForm: NgForm;
        _parentFormGroup: FormGroupDirective;
        /**
         * Form control bound to the component.
         * Implemented as part of `MatFormFieldControl`.
         * @docs-private
         */
        ngControl: NgControl;
    };
};

/** Change event object that is emitted when the chip list value has changed. */
export declare class MatChipListChange {
    /** Chip list that emitted the event. */
    source: MatChipList;
    /** Value of the chip list when the event was emitted. */
    value: any;
    constructor(
    /** Chip list that emitted the event. */
    source: MatChipList, 
    /** Value of the chip list when the event was emitted. */
    value: any);
}

declare const _MatChipMixinBase: _Constructor<HasTabIndex> & _AbstractConstructor<HasTabIndex> & _Constructor<CanColor> & _AbstractConstructor<CanColor> & _Constructor<CanDisableRipple> & _AbstractConstructor<CanDisableRipple> & typeof MatChipBase;

/**
 * Applies proper (click) support and adds styling for use with the Material Design "cancel" icon
 * available at https://material.io/icons/#ic_cancel.
 *
 * Example:
 *
 *     `<mat-chip>
 *       <mat-icon matChipRemove>cancel</mat-icon>
 *     </mat-chip>`
 *
 * You *may* use a custom icon, but you may need to override the `mat-chip-remove` positioning
 * styles to properly center the icon within the chip.
 */
export declare class MatChipRemove {
    protected _parentChip: MatChip;
    constructor(_parentChip: MatChip, elementRef: ElementRef<HTMLElement>);
    /** Calls the parent chip's public `remove()` method if applicable. */
    _handleClick(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatChipRemove, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatChipRemove, "[matChipRemove]", never, {}, {}, never, never, false>;
}

/** Default options, for the chips module, that can be overridden. */
export declare interface MatChipsDefaultOptions {
    /** The list of key codes that will trigger a chipEnd event. */
    separatorKeyCodes: readonly number[] | ReadonlySet<number>;
}

/** Event object emitted by MatChip when selected or deselected. */
export declare class MatChipSelectionChange {
    /** Reference to the chip that emitted the event. */
    source: MatChip;
    /** Whether the chip that emitted the event is selected. */
    selected: boolean;
    /** Whether the selection change was a result of a user interaction. */
    isUserInput: boolean;
    constructor(
    /** Reference to the chip that emitted the event. */
    source: MatChip, 
    /** Whether the chip that emitted the event is selected. */
    selected: boolean, 
    /** Whether the selection change was a result of a user interaction. */
    isUserInput?: boolean);
}

export declare class MatChipsModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatChipsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatChipsModule, [typeof i1.MatChipList, typeof i2.MatChip, typeof i3.MatChipInput, typeof i2.MatChipRemove, typeof i2.MatChipAvatar, typeof i2.MatChipTrailingIcon], [typeof i4.MatCommonModule], [typeof i1.MatChipList, typeof i2.MatChip, typeof i3.MatChipInput, typeof i2.MatChipRemove, typeof i2.MatChipAvatar, typeof i2.MatChipTrailingIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatChipsModule>;
}


/** Interface for a text control that is used to drive interaction with a mat-chip-list. */
declare interface MatChipTextControl {
    /** Unique identifier for the text control. */
    id: string;
    /** The text control's placeholder text. */
    placeholder: string;
    /** Whether the text control has browser focus. */
    focused: boolean;
    /** Whether the text control is empty. */
    empty: boolean;
    /** Focuses the text control. */
    focus(options?: FocusOptions): void;
}

/**
 * Dummy directive to add CSS class to chip trailing icon.
 * @docs-private
 */
export declare class MatChipTrailingIcon {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatChipTrailingIcon, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatChipTrailingIcon, "mat-chip-trailing-icon, [matChipTrailingIcon]", never, {}, {}, never, never, false>;
}

export { }
