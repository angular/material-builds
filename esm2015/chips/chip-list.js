/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { BACKSPACE, END, HOME } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Input, Optional, Output, QueryList, Self, ViewEncapsulation, } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher, mixinErrorState, } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { merge, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { MatChip } from './chip';
// Boilerplate for applying mixins to MatChipList.
/** @docs-private */
class MatChipListBase {
    constructor(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, 
    /** @docs-private */
    ngControl) {
        this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this.ngControl = ngControl;
    }
}
const _MatChipListMixinBase = mixinErrorState(MatChipListBase);
// Increasing integer for generating unique ids for chip-list components.
let nextUniqueId = 0;
/** Change event object that is emitted when the chip list value has changed. */
export class MatChipListChange {
    constructor(
    /** Chip list that emitted the event. */
    source, 
    /** Value of the chip list when the event was emitted. */
    value) {
        this.source = source;
        this.value = value;
    }
}
/**
 * A material design chips component (named ChipList for its similarity to the List component).
 */
let MatChipList = /** @class */ (() => {
    var MatChipList_1;
    let MatChipList = MatChipList_1 = class MatChipList extends _MatChipListMixinBase {
        constructor(_elementRef, _changeDetectorRef, _dir, _parentForm, _parentFormGroup, _defaultErrorStateMatcher, 
        /** @docs-private */
        ngControl) {
            super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
            this._elementRef = _elementRef;
            this._changeDetectorRef = _changeDetectorRef;
            this._dir = _dir;
            this.ngControl = ngControl;
            /**
             * Implemented as part of MatFormFieldControl.
             * @docs-private
             */
            this.controlType = 'mat-chip-list';
            /**
             * When a chip is destroyed, we store the index of the destroyed chip until the chips
             * query list notifies about the update. This is necessary because we cannot determine an
             * appropriate chip that should receive focus until the array of chips updated completely.
             */
            this._lastDestroyedChipIndex = null;
            /** Subject that emits when the component has been destroyed. */
            this._destroyed = new Subject();
            /** Uid of the chip list */
            this._uid = `mat-chip-list-${nextUniqueId++}`;
            /** Tab index for the chip list. */
            this._tabIndex = 0;
            /**
             * User defined tab index.
             * When it is not null, use user defined tab index. Otherwise use _tabIndex
             */
            this._userTabIndex = null;
            /** Function when touched */
            this._onTouched = () => { };
            /** Function when changed */
            this._onChange = () => { };
            this._multiple = false;
            this._compareWith = (o1, o2) => o1 === o2;
            this._required = false;
            this._disabled = false;
            /** Orientation of the chip list. */
            this.ariaOrientation = 'horizontal';
            this._selectable = true;
            /** Event emitted when the selected chip list value has been changed by the user. */
            this.change = new EventEmitter();
            /**
             * Event that emits whenever the raw value of the chip-list changes. This is here primarily
             * to facilitate the two-way binding for the `value` input.
             * @docs-private
             */
            this.valueChange = new EventEmitter();
            if (this.ngControl) {
                this.ngControl.valueAccessor = this;
            }
        }
        /** The array of selected chips inside chip list. */
        get selected() {
            return this.multiple ? this._selectionModel.selected : this._selectionModel.selected[0];
        }
        /** The ARIA role applied to the chip list. */
        get role() { return this.empty ? null : 'listbox'; }
        /** Whether the user should be allowed to select multiple chips. */
        get multiple() { return this._multiple; }
        set multiple(value) {
            this._multiple = coerceBooleanProperty(value);
            this._syncChipsState();
        }
        /**
         * A function to compare the option values with the selected values. The first argument
         * is a value from an option. The second is a value from the selection. A boolean
         * should be returned.
         */
        get compareWith() { return this._compareWith; }
        set compareWith(fn) {
            this._compareWith = fn;
            if (this._selectionModel) {
                // A different comparator means the selection could change.
                this._initializeSelection();
            }
        }
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get value() { return this._value; }
        set value(value) {
            this.writeValue(value);
            this._value = value;
        }
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get id() {
            return this._chipInput ? this._chipInput.id : this._uid;
        }
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get required() { return this._required; }
        set required(value) {
            this._required = coerceBooleanProperty(value);
            this.stateChanges.next();
        }
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get placeholder() {
            return this._chipInput ? this._chipInput.placeholder : this._placeholder;
        }
        set placeholder(value) {
            this._placeholder = value;
            this.stateChanges.next();
        }
        /** Whether any chips or the matChipInput inside of this chip-list has focus. */
        get focused() {
            return (this._chipInput && this._chipInput.focused) || this._hasFocusedChip();
        }
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get empty() {
            return (!this._chipInput || this._chipInput.empty) && this.chips.length === 0;
        }
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get shouldLabelFloat() { return !this.empty || this.focused; }
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get disabled() { return this.ngControl ? !!this.ngControl.disabled : this._disabled; }
        set disabled(value) {
            this._disabled = coerceBooleanProperty(value);
            this._syncChipsState();
        }
        /**
         * Whether or not this chip list is selectable. When a chip list is not selectable,
         * the selected states for all the chips inside the chip list are always ignored.
         */
        get selectable() { return this._selectable; }
        set selectable(value) {
            this._selectable = coerceBooleanProperty(value);
            if (this.chips) {
                this.chips.forEach(chip => chip.chipListSelectable = this._selectable);
            }
        }
        set tabIndex(value) {
            this._userTabIndex = value;
            this._tabIndex = value;
        }
        /** Combined stream of all of the child chips' selection change events. */
        get chipSelectionChanges() {
            return merge(...this.chips.map(chip => chip.selectionChange));
        }
        /** Combined stream of all of the child chips' focus change events. */
        get chipFocusChanges() {
            return merge(...this.chips.map(chip => chip._onFocus));
        }
        /** Combined stream of all of the child chips' blur change events. */
        get chipBlurChanges() {
            return merge(...this.chips.map(chip => chip._onBlur));
        }
        /** Combined stream of all of the child chips' remove change events. */
        get chipRemoveChanges() {
            return merge(...this.chips.map(chip => chip.destroyed));
        }
        ngAfterContentInit() {
            this._keyManager = new FocusKeyManager(this.chips)
                .withWrap()
                .withVerticalOrientation()
                .withHorizontalOrientation(this._dir ? this._dir.value : 'ltr');
            if (this._dir) {
                this._dir.change
                    .pipe(takeUntil(this._destroyed))
                    .subscribe(dir => this._keyManager.withHorizontalOrientation(dir));
            }
            this._keyManager.tabOut.pipe(takeUntil(this._destroyed)).subscribe(() => {
                this._allowFocusEscape();
            });
            // When the list changes, re-subscribe
            this.chips.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
                if (this.disabled) {
                    // Since this happens after the content has been
                    // checked, we need to defer it to the next tick.
                    Promise.resolve().then(() => {
                        this._syncChipsState();
                    });
                }
                this._resetChips();
                // Reset chips selected/deselected status
                this._initializeSelection();
                // Check to see if we need to update our tab index
                this._updateTabIndex();
                // Check to see if we have a destroyed chip and need to refocus
                this._updateFocusForDestroyedChips();
                this.stateChanges.next();
            });
        }
        ngOnInit() {
            this._selectionModel = new SelectionModel(this.multiple, undefined, false);
            this.stateChanges.next();
        }
        ngDoCheck() {
            if (this.ngControl) {
                // We need to re-evaluate this on every change detection cycle, because there are some
                // error triggers that we can't subscribe to (e.g. parent form submissions). This means
                // that whatever logic is in here has to be super lean or we risk destroying the performance.
                this.updateErrorState();
                if (this.ngControl.disabled !== this._disabled) {
                    this.disabled = !!this.ngControl.disabled;
                }
            }
        }
        ngOnDestroy() {
            this._destroyed.next();
            this._destroyed.complete();
            this.stateChanges.complete();
            this._dropSubscriptions();
        }
        /** Associates an HTML input element with this chip list. */
        registerInput(inputElement) {
            this._chipInput = inputElement;
        }
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        setDescribedByIds(ids) { this._ariaDescribedby = ids.join(' '); }
        // Implemented as part of ControlValueAccessor.
        writeValue(value) {
            if (this.chips) {
                this._setSelectionByValue(value, false);
            }
        }
        // Implemented as part of ControlValueAccessor.
        registerOnChange(fn) {
            this._onChange = fn;
        }
        // Implemented as part of ControlValueAccessor.
        registerOnTouched(fn) {
            this._onTouched = fn;
        }
        // Implemented as part of ControlValueAccessor.
        setDisabledState(isDisabled) {
            this.disabled = isDisabled;
            this.stateChanges.next();
        }
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        onContainerClick(event) {
            if (!this._originatesFromChip(event)) {
                this.focus();
            }
        }
        /**
         * Focuses the first non-disabled chip in this chip list, or the associated input when there
         * are no eligible chips.
         */
        focus(options) {
            if (this.disabled) {
                return;
            }
            // TODO: ARIA says this should focus the first `selected` chip if any are selected.
            // Focus on first element if there's no chipInput inside chip-list
            if (this._chipInput && this._chipInput.focused) {
                // do nothing
            }
            else if (this.chips.length > 0) {
                this._keyManager.setFirstItemActive();
                this.stateChanges.next();
            }
            else {
                this._focusInput(options);
                this.stateChanges.next();
            }
        }
        /** Attempt to focus an input if we have one. */
        _focusInput(options) {
            if (this._chipInput) {
                this._chipInput.focus(options);
            }
        }
        /**
         * Pass events to the keyboard manager. Available here for tests.
         */
        _keydown(event) {
            const target = event.target;
            // If they are on an empty input and hit backspace, focus the last chip
            if (event.keyCode === BACKSPACE && this._isInputEmpty(target)) {
                this._keyManager.setLastItemActive();
                event.preventDefault();
            }
            else if (target && target.classList.contains('mat-chip')) {
                if (event.keyCode === HOME) {
                    this._keyManager.setFirstItemActive();
                    event.preventDefault();
                }
                else if (event.keyCode === END) {
                    this._keyManager.setLastItemActive();
                    event.preventDefault();
                }
                else {
                    this._keyManager.onKeydown(event);
                }
                this.stateChanges.next();
            }
        }
        /**
         * Check the tab index as you should not be allowed to focus an empty list.
         */
        _updateTabIndex() {
            // If we have 0 chips, we should not allow keyboard focus
            this._tabIndex = this._userTabIndex || (this.chips.length === 0 ? -1 : 0);
        }
        /**
         * If the amount of chips changed, we need to update the
         * key manager state and focus the next closest chip.
         */
        _updateFocusForDestroyedChips() {
            // Move focus to the closest chip. If no other chips remain, focus the chip-list itself.
            if (this._lastDestroyedChipIndex != null) {
                if (this.chips.length) {
                    const newChipIndex = Math.min(this._lastDestroyedChipIndex, this.chips.length - 1);
                    this._keyManager.setActiveItem(newChipIndex);
                }
                else {
                    this.focus();
                }
            }
            this._lastDestroyedChipIndex = null;
        }
        /**
         * Utility to ensure all indexes are valid.
         *
         * @param index The index to be checked.
         * @returns True if the index is valid for our list of chips.
         */
        _isValidIndex(index) {
            return index >= 0 && index < this.chips.length;
        }
        _isInputEmpty(element) {
            if (element && element.nodeName.toLowerCase() === 'input') {
                let input = element;
                return !input.value;
            }
            return false;
        }
        _setSelectionByValue(value, isUserInput = true) {
            this._clearSelection();
            this.chips.forEach(chip => chip.deselect());
            if (Array.isArray(value)) {
                value.forEach(currentValue => this._selectValue(currentValue, isUserInput));
                this._sortValues();
            }
            else {
                const correspondingChip = this._selectValue(value, isUserInput);
                // Shift focus to the active item. Note that we shouldn't do this in multiple
                // mode, because we don't know what chip the user interacted with last.
                if (correspondingChip) {
                    if (isUserInput) {
                        this._keyManager.setActiveItem(correspondingChip);
                    }
                }
            }
        }
        /**
         * Finds and selects the chip based on its value.
         * @returns Chip that has the corresponding value.
         */
        _selectValue(value, isUserInput = true) {
            const correspondingChip = this.chips.find(chip => {
                return chip.value != null && this._compareWith(chip.value, value);
            });
            if (correspondingChip) {
                isUserInput ? correspondingChip.selectViaInteraction() : correspondingChip.select();
                this._selectionModel.select(correspondingChip);
            }
            return correspondingChip;
        }
        _initializeSelection() {
            // Defer setting the value in order to avoid the "Expression
            // has changed after it was checked" errors from Angular.
            Promise.resolve().then(() => {
                if (this.ngControl || this._value) {
                    this._setSelectionByValue(this.ngControl ? this.ngControl.value : this._value, false);
                    this.stateChanges.next();
                }
            });
        }
        /**
         * Deselects every chip in the list.
         * @param skip Chip that should not be deselected.
         */
        _clearSelection(skip) {
            this._selectionModel.clear();
            this.chips.forEach(chip => {
                if (chip !== skip) {
                    chip.deselect();
                }
            });
            this.stateChanges.next();
        }
        /**
         * Sorts the model values, ensuring that they keep the same
         * order that they have in the panel.
         */
        _sortValues() {
            if (this._multiple) {
                this._selectionModel.clear();
                this.chips.forEach(chip => {
                    if (chip.selected) {
                        this._selectionModel.select(chip);
                    }
                });
                this.stateChanges.next();
            }
        }
        /** Emits change event to set the model value. */
        _propagateChanges(fallbackValue) {
            let valueToEmit = null;
            if (Array.isArray(this.selected)) {
                valueToEmit = this.selected.map(chip => chip.value);
            }
            else {
                valueToEmit = this.selected ? this.selected.value : fallbackValue;
            }
            this._value = valueToEmit;
            this.change.emit(new MatChipListChange(this, valueToEmit));
            this.valueChange.emit(valueToEmit);
            this._onChange(valueToEmit);
            this._changeDetectorRef.markForCheck();
        }
        /** When blurred, mark the field as touched when focus moved outside the chip list. */
        _blur() {
            if (!this._hasFocusedChip()) {
                this._keyManager.setActiveItem(-1);
            }
            if (!this.disabled) {
                if (this._chipInput) {
                    // If there's a chip input, we should check whether the focus moved to chip input.
                    // If the focus is not moved to chip input, mark the field as touched. If the focus moved
                    // to chip input, do nothing.
                    // Timeout is needed to wait for the focus() event trigger on chip input.
                    setTimeout(() => {
                        if (!this.focused) {
                            this._markAsTouched();
                        }
                    });
                }
                else {
                    // If there's no chip input, then mark the field as touched.
                    this._markAsTouched();
                }
            }
        }
        /** Mark the field as touched */
        _markAsTouched() {
            this._onTouched();
            this._changeDetectorRef.markForCheck();
            this.stateChanges.next();
        }
        /**
         * Removes the `tabindex` from the chip list and resets it back afterwards, allowing the
         * user to tab out of it. This prevents the list from capturing focus and redirecting
         * it back to the first chip, creating a focus trap, if it user tries to tab away.
         */
        _allowFocusEscape() {
            if (this._tabIndex !== -1) {
                this._tabIndex = -1;
                setTimeout(() => {
                    this._tabIndex = this._userTabIndex || 0;
                    this._changeDetectorRef.markForCheck();
                });
            }
        }
        _resetChips() {
            this._dropSubscriptions();
            this._listenToChipsFocus();
            this._listenToChipsSelection();
            this._listenToChipsRemoved();
        }
        _dropSubscriptions() {
            if (this._chipFocusSubscription) {
                this._chipFocusSubscription.unsubscribe();
                this._chipFocusSubscription = null;
            }
            if (this._chipBlurSubscription) {
                this._chipBlurSubscription.unsubscribe();
                this._chipBlurSubscription = null;
            }
            if (this._chipSelectionSubscription) {
                this._chipSelectionSubscription.unsubscribe();
                this._chipSelectionSubscription = null;
            }
            if (this._chipRemoveSubscription) {
                this._chipRemoveSubscription.unsubscribe();
                this._chipRemoveSubscription = null;
            }
        }
        /** Listens to user-generated selection events on each chip. */
        _listenToChipsSelection() {
            this._chipSelectionSubscription = this.chipSelectionChanges.subscribe(event => {
                event.source.selected
                    ? this._selectionModel.select(event.source)
                    : this._selectionModel.deselect(event.source);
                // For single selection chip list, make sure the deselected value is unselected.
                if (!this.multiple) {
                    this.chips.forEach(chip => {
                        if (!this._selectionModel.isSelected(chip) && chip.selected) {
                            chip.deselect();
                        }
                    });
                }
                if (event.isUserInput) {
                    this._propagateChanges();
                }
            });
        }
        /** Listens to user-generated selection events on each chip. */
        _listenToChipsFocus() {
            this._chipFocusSubscription = this.chipFocusChanges.subscribe(event => {
                let chipIndex = this.chips.toArray().indexOf(event.chip);
                if (this._isValidIndex(chipIndex)) {
                    this._keyManager.updateActiveItem(chipIndex);
                }
                this.stateChanges.next();
            });
            this._chipBlurSubscription = this.chipBlurChanges.subscribe(() => {
                this._blur();
                this.stateChanges.next();
            });
        }
        _listenToChipsRemoved() {
            this._chipRemoveSubscription = this.chipRemoveChanges.subscribe(event => {
                const chip = event.chip;
                const chipIndex = this.chips.toArray().indexOf(event.chip);
                // In case the chip that will be removed is currently focused, we temporarily store
                // the index in order to be able to determine an appropriate sibling chip that will
                // receive focus.
                if (this._isValidIndex(chipIndex) && chip._hasFocus) {
                    this._lastDestroyedChipIndex = chipIndex;
                }
            });
        }
        /** Checks whether an event comes from inside a chip element. */
        _originatesFromChip(event) {
            let currentElement = event.target;
            while (currentElement && currentElement !== this._elementRef.nativeElement) {
                if (currentElement.classList.contains('mat-chip')) {
                    return true;
                }
                currentElement = currentElement.parentElement;
            }
            return false;
        }
        /** Checks whether any of the chips is focused. */
        _hasFocusedChip() {
            return this.chips.some(chip => chip._hasFocus);
        }
        /** Syncs the list's state with the individual chips. */
        _syncChipsState() {
            if (this.chips) {
                this.chips.forEach(chip => {
                    chip._chipListDisabled = this._disabled;
                    chip._chipListMultiple = this.multiple;
                });
            }
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", ErrorStateMatcher)
    ], MatChipList.prototype, "errorStateMatcher", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatChipList.prototype, "multiple", null);
    __decorate([
        Input(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function])
    ], MatChipList.prototype, "compareWith", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MatChipList.prototype, "value", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatChipList.prototype, "required", null);
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MatChipList.prototype, "placeholder", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatChipList.prototype, "disabled", null);
    __decorate([
        Input('aria-orientation'),
        __metadata("design:type", String)
    ], MatChipList.prototype, "ariaOrientation", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatChipList.prototype, "selectable", null);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], MatChipList.prototype, "tabIndex", null);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MatChipList.prototype, "change", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MatChipList.prototype, "valueChange", void 0);
    __decorate([
        ContentChildren(MatChip, {
            // We need to use `descendants: true`, because Ivy will no longer match
            // indirect descendants if it's left as false.
            descendants: true
        }),
        __metadata("design:type", QueryList)
    ], MatChipList.prototype, "chips", void 0);
    MatChipList = MatChipList_1 = __decorate([
        Component({
            selector: 'mat-chip-list',
            template: `<div class="mat-chip-list-wrapper"><ng-content></ng-content></div>`,
            exportAs: 'matChipList',
            host: {
                '[attr.tabindex]': 'disabled ? null : _tabIndex',
                '[attr.aria-describedby]': '_ariaDescribedby || null',
                '[attr.aria-required]': 'role ? required : null',
                '[attr.aria-disabled]': 'disabled.toString()',
                '[attr.aria-invalid]': 'errorState',
                '[attr.aria-multiselectable]': 'multiple',
                '[attr.role]': 'role',
                '[class.mat-chip-list-disabled]': 'disabled',
                '[class.mat-chip-list-invalid]': 'errorState',
                '[class.mat-chip-list-required]': 'required',
                '[attr.aria-orientation]': 'ariaOrientation',
                'class': 'mat-chip-list',
                '(focus)': 'focus()',
                '(blur)': '_blur()',
                '(keydown)': '_keydown($event)',
                '[id]': '_uid',
            },
            providers: [{ provide: MatFormFieldControl, useExisting: MatChipList_1 }],
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [".mat-chip{position:relative;box-sizing:border-box;-webkit-tap-highlight-color:transparent;transform:translateZ(0);border:none;-webkit-appearance:none;-moz-appearance:none}.mat-standard-chip{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);display:inline-flex;padding:7px 12px;border-radius:16px;align-items:center;cursor:default;min-height:32px;height:1px}._mat-animation-noopable.mat-standard-chip{transition:none;animation:none}.mat-standard-chip .mat-chip-remove.mat-icon{width:18px;height:18px}.mat-standard-chip::after{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit;opacity:0;content:\"\";pointer-events:none;transition:opacity 200ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-standard-chip:hover::after{opacity:.12}.mat-standard-chip:focus{outline:none}.mat-standard-chip:focus::after{opacity:.16}.cdk-high-contrast-active .mat-standard-chip{outline:solid 1px}.cdk-high-contrast-active .mat-standard-chip:focus{outline:dotted 2px}.mat-standard-chip.mat-chip-disabled::after{opacity:0}.mat-standard-chip.mat-chip-disabled .mat-chip-remove,.mat-standard-chip.mat-chip-disabled .mat-chip-trailing-icon{cursor:default}.mat-standard-chip.mat-chip-with-trailing-icon.mat-chip-with-avatar,.mat-standard-chip.mat-chip-with-avatar{padding-top:0;padding-bottom:0}.mat-standard-chip.mat-chip-with-trailing-icon.mat-chip-with-avatar{padding-right:8px;padding-left:0}[dir=rtl] .mat-standard-chip.mat-chip-with-trailing-icon.mat-chip-with-avatar{padding-left:8px;padding-right:0}.mat-standard-chip.mat-chip-with-trailing-icon{padding-top:7px;padding-bottom:7px;padding-right:8px;padding-left:12px}[dir=rtl] .mat-standard-chip.mat-chip-with-trailing-icon{padding-left:8px;padding-right:12px}.mat-standard-chip.mat-chip-with-avatar{padding-left:0;padding-right:12px}[dir=rtl] .mat-standard-chip.mat-chip-with-avatar{padding-right:0;padding-left:12px}.mat-standard-chip .mat-chip-avatar{width:24px;height:24px;margin-right:8px;margin-left:4px}[dir=rtl] .mat-standard-chip .mat-chip-avatar{margin-left:8px;margin-right:4px}.mat-standard-chip .mat-chip-remove,.mat-standard-chip .mat-chip-trailing-icon{width:18px;height:18px;cursor:pointer}.mat-standard-chip .mat-chip-remove,.mat-standard-chip .mat-chip-trailing-icon{margin-left:8px;margin-right:0}[dir=rtl] .mat-standard-chip .mat-chip-remove,[dir=rtl] .mat-standard-chip .mat-chip-trailing-icon{margin-right:8px;margin-left:0}.mat-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit;overflow:hidden}.mat-chip-list-wrapper{display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;margin:-4px}.mat-chip-list-wrapper input.mat-input-element,.mat-chip-list-wrapper .mat-standard-chip{margin:4px}.mat-chip-list-stacked .mat-chip-list-wrapper{flex-direction:column;align-items:flex-start}.mat-chip-list-stacked .mat-chip-list-wrapper .mat-standard-chip{width:100%}.mat-chip-avatar{border-radius:50%;justify-content:center;align-items:center;display:flex;overflow:hidden;object-fit:cover}input.mat-chip-input{width:150px;margin:4px;flex:1 0 150px}\n"]
        }),
        __param(2, Optional()),
        __param(3, Optional()),
        __param(4, Optional()),
        __param(6, Optional()), __param(6, Self()),
        __metadata("design:paramtypes", [ElementRef,
            ChangeDetectorRef,
            Directionality,
            NgForm,
            FormGroupDirective,
            ErrorStateMatcher,
            NgControl])
    ], MatChipList);
    return MatChipList;
})();
export { MatChipList };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoaXBzL2NoaXAtbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFFZixVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxJQUFJLEVBQ0osaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzNGLE9BQU8sRUFHTCxpQkFBaUIsRUFDakIsZUFBZSxHQUNoQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQ2pFLE9BQU8sRUFBQyxLQUFLLEVBQWMsT0FBTyxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBQzlELE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEQsT0FBTyxFQUFDLE9BQU8sRUFBdUMsTUFBTSxRQUFRLENBQUM7QUFJckUsa0RBQWtEO0FBQ2xELG9CQUFvQjtBQUNwQixNQUFN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QUN2QixJQUFJLEVBQUU7Z0JBQ0osaUJBQWlCLEVBQUUsNkJBQTZCO2dCQUNoRCx5QkFBeUIsRUFBRSwwQkFBMEI7Z0JBQ3JELHNCQUFzQixFQUFFLHdCQUF3QjtnQkFDaEQsc0JBQXNCLEVBQUUscUJBQXFCO2dCQUM3QyxxQkFBcUIsRUFBRSxZQUFZO2dCQUNuQyw2QkFBNkIsRUFBRSxVQUFVO2dCQUN6QyxhQUFhLEVBQUUsTUFBTTtnQkFDckIsZ0NBQWdDLEVBQUUsVUFBVTtnQkFDNUMsK0JBQStCLEVBQUUsWUFBWTtnQkFDN0MsZ0NBQWdDLEVBQUUsVUFBVTtnQkFDNUMseUJBQXlCLEVBQUUsaUJBQWlCO2dCQUM1QyxPQUFPLEVBQUUsZUFBZTtnQkFDeEIsU0FBUyxFQUFFLFNBQVM7Z0JBQ3BCLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixXQUFXLEVBQUUsa0JBQWtCO2dCQUMvQixNQUFNLEVBQUUsTUFBTTthQUNmO1lBQ0QsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLGFBQVcsRUFBQyxDQUFDO1lBRXJFLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1lBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztTQUNoRCxDQUFDO1FBNk9hLFdBQUEsUUFBUSxFQUFFLENBQUE7UUFDVixXQUFBLFFBQVEsRUFBRSxDQUFBO1FBQ1YsV0FBQSxRQUFRLEVBQUUsQ0FBQTtRQUdWLFdBQUEsUUFBUSxFQUFFLENBQUEsRUFBRSxXQUFBLElBQUksRUFBRSxDQUFBO3lDQVBJLFVBQVU7WUFDTCxpQkFBaUI7WUFDbkIsY0FBYztZQUNmLE1BQU07WUFDRCxrQkFBa0I7WUFDckIsaUJBQWlCO1lBRU4sU0FBUztPQWpQaEQsV0FBVyxDQStzQnZCO0lBQUQsa0JBQUM7S0FBQTtTQS9zQlksV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzS2V5TWFuYWdlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7U2VsZWN0aW9uTW9kZWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge0JBQ0tTUEFDRSwgRU5ELCBIT01FfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2VsZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgRm9ybUdyb3VwRGlyZWN0aXZlLCBOZ0NvbnRyb2wsIE5nRm9ybX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuVXBkYXRlRXJyb3JTdGF0ZSxcbiAgQ2FuVXBkYXRlRXJyb3JTdGF0ZUN0b3IsXG4gIEVycm9yU3RhdGVNYXRjaGVyLFxuICBtaXhpbkVycm9yU3RhdGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRDb250cm9sfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7bWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3QsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdENoaXAsIE1hdENoaXBFdmVudCwgTWF0Q2hpcFNlbGVjdGlvbkNoYW5nZX0gZnJvbSAnLi9jaGlwJztcbmltcG9ydCB7TWF0Q2hpcFRleHRDb250cm9sfSBmcm9tICcuL2NoaXAtdGV4dC1jb250cm9sJztcblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdENoaXBMaXN0LlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdENoaXBMaXN0QmFzZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgICAgICAgICAgIHB1YmxpYyBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgICAgICAgICAgIC8qKiBAZG9jcy1wcml2YXRlICovXG4gICAgICAgICAgICAgIHB1YmxpYyBuZ0NvbnRyb2w6IE5nQ29udHJvbCkge31cbn1cbmNvbnN0IF9NYXRDaGlwTGlzdE1peGluQmFzZTogQ2FuVXBkYXRlRXJyb3JTdGF0ZUN0b3IgJiB0eXBlb2YgTWF0Q2hpcExpc3RCYXNlID1cbiAgICBtaXhpbkVycm9yU3RhdGUoTWF0Q2hpcExpc3RCYXNlKTtcblxuXG4vLyBJbmNyZWFzaW5nIGludGVnZXIgZm9yIGdlbmVyYXRpbmcgdW5pcXVlIGlkcyBmb3IgY2hpcC1saXN0IGNvbXBvbmVudHMuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuLyoqIENoYW5nZSBldmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gdGhlIGNoaXAgbGlzdCB2YWx1ZSBoYXMgY2hhbmdlZC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRDaGlwTGlzdENoYW5nZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBDaGlwIGxpc3QgdGhhdCBlbWl0dGVkIHRoZSBldmVudC4gKi9cbiAgICBwdWJsaWMgc291cmNlOiBNYXRDaGlwTGlzdCxcbiAgICAvKiogVmFsdWUgb2YgdGhlIGNoaXAgbGlzdCB3aGVuIHRoZSBldmVudCB3YXMgZW1pdHRlZC4gKi9cbiAgICBwdWJsaWMgdmFsdWU6IGFueSkgeyB9XG59XG5cblxuLyoqXG4gKiBBIG1hdGVyaWFsIGRlc2lnbiBjaGlwcyBjb21wb25lbnQgKG5hbWVkIENoaXBMaXN0IGZvciBpdHMgc2ltaWxhcml0eSB0byB0aGUgTGlzdCBjb21wb25lbnQpLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hpcC1saXN0JyxcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwibWF0LWNoaXAtbGlzdC13cmFwcGVyXCI+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PjwvZGl2PmAsXG4gIGV4cG9ydEFzOiAnbWF0Q2hpcExpc3QnLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdkaXNhYmxlZCA/IG51bGwgOiBfdGFiSW5kZXgnLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfYXJpYURlc2NyaWJlZGJ5IHx8IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLXJlcXVpcmVkXSc6ICdyb2xlID8gcmVxdWlyZWQgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtaW52YWxpZF0nOiAnZXJyb3JTdGF0ZScsXG4gICAgJ1thdHRyLmFyaWEtbXVsdGlzZWxlY3RhYmxlXSc6ICdtdWx0aXBsZScsXG4gICAgJ1thdHRyLnJvbGVdJzogJ3JvbGUnLFxuICAgICdbY2xhc3MubWF0LWNoaXAtbGlzdC1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LWNoaXAtbGlzdC1pbnZhbGlkXSc6ICdlcnJvclN0YXRlJyxcbiAgICAnW2NsYXNzLm1hdC1jaGlwLWxpc3QtcmVxdWlyZWRdJzogJ3JlcXVpcmVkJyxcbiAgICAnW2F0dHIuYXJpYS1vcmllbnRhdGlvbl0nOiAnYXJpYU9yaWVudGF0aW9uJyxcbiAgICAnY2xhc3MnOiAnbWF0LWNoaXAtbGlzdCcsXG4gICAgJyhmb2N1cyknOiAnZm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfYmx1cigpJyxcbiAgICAnKGtleWRvd24pJzogJ19rZXlkb3duKCRldmVudCknLFxuICAgICdbaWRdJzogJ191aWQnLFxuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTWF0Rm9ybUZpZWxkQ29udHJvbCwgdXNlRXhpc3Rpbmc6IE1hdENoaXBMaXN0fV0sXG4gIHN0eWxlVXJsczogWydjaGlwcy5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcExpc3QgZXh0ZW5kcyBfTWF0Q2hpcExpc3RNaXhpbkJhc2UgaW1wbGVtZW50cyBNYXRGb3JtRmllbGRDb250cm9sPGFueT4sXG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBBZnRlckNvbnRlbnRJbml0LCBEb0NoZWNrLCBPbkluaXQsIE9uRGVzdHJveSwgQ2FuVXBkYXRlRXJyb3JTdGF0ZSB7XG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlYWRvbmx5IGNvbnRyb2xUeXBlOiBzdHJpbmcgPSAnbWF0LWNoaXAtbGlzdCc7XG5cbiAgLyoqXG4gICAqIFdoZW4gYSBjaGlwIGlzIGRlc3Ryb3llZCwgd2Ugc3RvcmUgdGhlIGluZGV4IG9mIHRoZSBkZXN0cm95ZWQgY2hpcCB1bnRpbCB0aGUgY2hpcHNcbiAgICogcXVlcnkgbGlzdCBub3RpZmllcyBhYm91dCB0aGUgdXBkYXRlLiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHdlIGNhbm5vdCBkZXRlcm1pbmUgYW5cbiAgICogYXBwcm9wcmlhdGUgY2hpcCB0aGF0IHNob3VsZCByZWNlaXZlIGZvY3VzIHVudGlsIHRoZSBhcnJheSBvZiBjaGlwcyB1cGRhdGVkIGNvbXBsZXRlbHkuXG4gICAqL1xuICBwcml2YXRlIF9sYXN0RGVzdHJveWVkQ2hpcEluZGV4OiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKiogU3ViamVjdCB0aGF0IGVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBmb2N1cyBjaGFuZ2VzIGluIHRoZSBjaGlwcy4gKi9cbiAgcHJpdmF0ZSBfY2hpcEZvY3VzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gYmx1ciBjaGFuZ2VzIGluIHRoZSBjaGlwcy4gKi9cbiAgcHJpdmF0ZSBfY2hpcEJsdXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiB8IG51bGw7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBzZWxlY3Rpb24gY2hhbmdlcyBpbiBjaGlwcy4gKi9cbiAgcHJpdmF0ZSBfY2hpcFNlbGVjdGlvblN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbDtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIHJlbW92ZSBjaGFuZ2VzIGluIGNoaXBzLiAqL1xuICBwcml2YXRlIF9jaGlwUmVtb3ZlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsO1xuXG4gIC8qKiBUaGUgY2hpcCBpbnB1dCB0byBhZGQgbW9yZSBjaGlwcyAqL1xuICBwcm90ZWN0ZWQgX2NoaXBJbnB1dDogTWF0Q2hpcFRleHRDb250cm9sO1xuXG4gIC8qKiBVaWQgb2YgdGhlIGNoaXAgbGlzdCAqL1xuICBfdWlkOiBzdHJpbmcgPSBgbWF0LWNoaXAtbGlzdC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqIFRoZSBhcmlhLWRlc2NyaWJlZGJ5IGF0dHJpYnV0ZSBvbiB0aGUgY2hpcCBsaXN0IGZvciBpbXByb3ZlZCBhMTF5LiAqL1xuICBfYXJpYURlc2NyaWJlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIFRhYiBpbmRleCBmb3IgdGhlIGNoaXAgbGlzdC4gKi9cbiAgX3RhYkluZGV4ID0gMDtcblxuICAvKipcbiAgICogVXNlciBkZWZpbmVkIHRhYiBpbmRleC5cbiAgICogV2hlbiBpdCBpcyBub3QgbnVsbCwgdXNlIHVzZXIgZGVmaW5lZCB0YWIgaW5kZXguIE90aGVyd2lzZSB1c2UgX3RhYkluZGV4XG4gICAqL1xuICBfdXNlclRhYkluZGV4OiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKiogVGhlIEZvY3VzS2V5TWFuYWdlciB3aGljaCBoYW5kbGVzIGZvY3VzLiAqL1xuICBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdENoaXA+O1xuXG4gIC8qKiBGdW5jdGlvbiB3aGVuIHRvdWNoZWQgKi9cbiAgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBGdW5jdGlvbiB3aGVuIGNoYW5nZWQgKi9cbiAgX29uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIF9zZWxlY3Rpb25Nb2RlbDogU2VsZWN0aW9uTW9kZWw8TWF0Q2hpcD47XG5cbiAgLyoqIFRoZSBhcnJheSBvZiBzZWxlY3RlZCBjaGlwcyBpbnNpZGUgY2hpcCBsaXN0LiAqL1xuICBnZXQgc2VsZWN0ZWQoKTogTWF0Q2hpcFtdIHwgTWF0Q2hpcCB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlwbGUgPyB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZCA6IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkWzBdO1xuICB9XG5cbiAgLyoqIFRoZSBBUklBIHJvbGUgYXBwbGllZCB0byB0aGUgY2hpcCBsaXN0LiAqL1xuICBnZXQgcm9sZSgpOiBzdHJpbmcgfCBudWxsIHsgcmV0dXJuIHRoaXMuZW1wdHkgPyBudWxsIDogJ2xpc3Rib3gnOyB9XG5cbiAgLyoqIEFuIG9iamVjdCB1c2VkIHRvIGNvbnRyb2wgd2hlbiBlcnJvciBtZXNzYWdlcyBhcmUgc2hvd24uICovXG4gIEBJbnB1dCgpIGVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcjtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBzaG91bGQgYmUgYWxsb3dlZCB0byBzZWxlY3QgbXVsdGlwbGUgY2hpcHMuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtdWx0aXBsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX211bHRpcGxlOyB9XG4gIHNldCBtdWx0aXBsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX211bHRpcGxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLl9zeW5jQ2hpcHNTdGF0ZSgpO1xuICB9XG4gIHByaXZhdGUgX211bHRpcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gdG8gY29tcGFyZSB0aGUgb3B0aW9uIHZhbHVlcyB3aXRoIHRoZSBzZWxlY3RlZCB2YWx1ZXMuIFRoZSBmaXJzdCBhcmd1bWVudFxuICAgKiBpcyBhIHZhbHVlIGZyb20gYW4gb3B0aW9uLiBUaGUgc2Vjb25kIGlzIGEgdmFsdWUgZnJvbSB0aGUgc2VsZWN0aW9uLiBBIGJvb2xlYW5cbiAgICogc2hvdWxkIGJlIHJldHVybmVkLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGNvbXBhcmVXaXRoKCk6IChvMTogYW55LCBvMjogYW55KSA9PiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NvbXBhcmVXaXRoOyB9XG4gIHNldCBjb21wYXJlV2l0aChmbjogKG8xOiBhbnksIG8yOiBhbnkpID0+IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9jb21wYXJlV2l0aCA9IGZuO1xuICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbCkge1xuICAgICAgLy8gQSBkaWZmZXJlbnQgY29tcGFyYXRvciBtZWFucyB0aGUgc2VsZWN0aW9uIGNvdWxkIGNoYW5nZS5cbiAgICAgIHRoaXMuX2luaXRpYWxpemVTZWxlY3Rpb24oKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfY29tcGFyZVdpdGggPSAobzE6IGFueSwgbzI6IGFueSkgPT4gbzEgPT09IG8yO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cbiAgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLndyaXRlVmFsdWUodmFsdWUpO1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gIH1cbiAgcHJvdGVjdGVkIF92YWx1ZTogYW55O1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBpZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9jaGlwSW5wdXQgPyB0aGlzLl9jaGlwSW5wdXQuaWQgOiB0aGlzLl91aWQ7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZXF1aXJlZDsgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZXF1aXJlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG4gIHByb3RlY3RlZCBfcmVxdWlyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcGxhY2Vob2xkZXIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fY2hpcElucHV0ID8gdGhpcy5fY2hpcElucHV0LnBsYWNlaG9sZGVyIDogdGhpcy5fcGxhY2Vob2xkZXI7XG4gIH1cbiAgc2V0IHBsYWNlaG9sZGVyKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9wbGFjZWhvbGRlciA9IHZhbHVlO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuICBwcm90ZWN0ZWQgX3BsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgYW55IGNoaXBzIG9yIHRoZSBtYXRDaGlwSW5wdXQgaW5zaWRlIG9mIHRoaXMgY2hpcC1saXN0IGhhcyBmb2N1cy4gKi9cbiAgZ2V0IGZvY3VzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLl9jaGlwSW5wdXQgJiYgdGhpcy5fY2hpcElucHV0LmZvY3VzZWQpIHx8IHRoaXMuX2hhc0ZvY3VzZWRDaGlwKCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICghdGhpcy5fY2hpcElucHV0IHx8IHRoaXMuX2NoaXBJbnB1dC5lbXB0eSkgJiYgdGhpcy5jaGlwcy5sZW5ndGggPT09IDA7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgc2hvdWxkTGFiZWxGbG9hdCgpOiBib29sZWFuIHsgcmV0dXJuICF0aGlzLmVtcHR5IHx8IHRoaXMuZm9jdXNlZDsgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubmdDb250cm9sID8gISF0aGlzLm5nQ29udHJvbC5kaXNhYmxlZCA6IHRoaXMuX2Rpc2FibGVkOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLl9zeW5jQ2hpcHNTdGF0ZSgpO1xuICB9XG4gIHByb3RlY3RlZCBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogT3JpZW50YXRpb24gb2YgdGhlIGNoaXAgbGlzdC4gKi9cbiAgQElucHV0KCdhcmlhLW9yaWVudGF0aW9uJykgYXJpYU9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnID0gJ2hvcml6b250YWwnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGlzIGNoaXAgbGlzdCBpcyBzZWxlY3RhYmxlLiBXaGVuIGEgY2hpcCBsaXN0IGlzIG5vdCBzZWxlY3RhYmxlLFxuICAgKiB0aGUgc2VsZWN0ZWQgc3RhdGVzIGZvciBhbGwgdGhlIGNoaXBzIGluc2lkZSB0aGUgY2hpcCBsaXN0IGFyZSBhbHdheXMgaWdub3JlZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RhYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fc2VsZWN0YWJsZTsgfVxuICBzZXQgc2VsZWN0YWJsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3NlbGVjdGFibGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKHRoaXMuY2hpcHMpIHtcbiAgICAgIHRoaXMuY2hpcHMuZm9yRWFjaChjaGlwID0+IGNoaXAuY2hpcExpc3RTZWxlY3RhYmxlID0gdGhpcy5fc2VsZWN0YWJsZSk7XG4gICAgfVxuICB9XG4gIHByb3RlY3RlZCBfc2VsZWN0YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgc2V0IHRhYkluZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl91c2VyVGFiSW5kZXggPSB2YWx1ZTtcbiAgICB0aGlzLl90YWJJbmRleCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIENvbWJpbmVkIHN0cmVhbSBvZiBhbGwgb2YgdGhlIGNoaWxkIGNoaXBzJyBzZWxlY3Rpb24gY2hhbmdlIGV2ZW50cy4gKi9cbiAgZ2V0IGNoaXBTZWxlY3Rpb25DaGFuZ2VzKCk6IE9ic2VydmFibGU8TWF0Q2hpcFNlbGVjdGlvbkNoYW5nZT4ge1xuICAgIHJldHVybiBtZXJnZSguLi50aGlzLmNoaXBzLm1hcChjaGlwID0+IGNoaXAuc2VsZWN0aW9uQ2hhbmdlKSk7XG4gIH1cblxuICAvKiogQ29tYmluZWQgc3RyZWFtIG9mIGFsbCBvZiB0aGUgY2hpbGQgY2hpcHMnIGZvY3VzIGNoYW5nZSBldmVudHMuICovXG4gIGdldCBjaGlwRm9jdXNDaGFuZ2VzKCk6IE9ic2VydmFibGU8TWF0Q2hpcEV2ZW50PiB7XG4gICAgcmV0dXJuIG1lcmdlKC4uLnRoaXMuY2hpcHMubWFwKGNoaXAgPT4gY2hpcC5fb25Gb2N1cykpO1xuICB9XG5cbiAgLyoqIENvbWJpbmVkIHN0cmVhbSBvZiBhbGwgb2YgdGhlIGNoaWxkIGNoaXBzJyBibHVyIGNoYW5nZSBldmVudHMuICovXG4gIGdldCBjaGlwQmx1ckNoYW5nZXMoKTogT2JzZXJ2YWJsZTxNYXRDaGlwRXZlbnQ+IHtcbiAgICByZXR1cm4gbWVyZ2UoLi4udGhpcy5jaGlwcy5tYXAoY2hpcCA9PiBjaGlwLl9vbkJsdXIpKTtcbiAgfVxuXG4gIC8qKiBDb21iaW5lZCBzdHJlYW0gb2YgYWxsIG9mIHRoZSBjaGlsZCBjaGlwcycgcmVtb3ZlIGNoYW5nZSBldmVudHMuICovXG4gIGdldCBjaGlwUmVtb3ZlQ2hhbmdlcygpOiBPYnNlcnZhYmxlPE1hdENoaXBFdmVudD4ge1xuICAgIHJldHVybiBtZXJnZSguLi50aGlzLmNoaXBzLm1hcChjaGlwID0+IGNoaXAuZGVzdHJveWVkKSk7XG4gIH1cblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3RlZCBjaGlwIGxpc3QgdmFsdWUgaGFzIGJlZW4gY2hhbmdlZCBieSB0aGUgdXNlci4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdENoaXBMaXN0Q2hhbmdlPiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdENoaXBMaXN0Q2hhbmdlPigpO1xuXG4gIC8qKlxuICAgKiBFdmVudCB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSByYXcgdmFsdWUgb2YgdGhlIGNoaXAtbGlzdCBjaGFuZ2VzLiBUaGlzIGlzIGhlcmUgcHJpbWFyaWx5XG4gICAqIHRvIGZhY2lsaXRhdGUgdGhlIHR3by13YXkgYmluZGluZyBmb3IgdGhlIGB2YWx1ZWAgaW5wdXQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2YWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvKiogVGhlIGNoaXAgY29tcG9uZW50cyBjb250YWluZWQgd2l0aGluIHRoaXMgY2hpcCBsaXN0LiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdENoaXAsIHtcbiAgICAvLyBXZSBuZWVkIHRvIHVzZSBgZGVzY2VuZGFudHM6IHRydWVgLCBiZWNhdXNlIEl2eSB3aWxsIG5vIGxvbmdlciBtYXRjaFxuICAgIC8vIGluZGlyZWN0IGRlc2NlbmRhbnRzIGlmIGl0J3MgbGVmdCBhcyBmYWxzZS5cbiAgICBkZXNjZW5kYW50czogdHJ1ZVxuICB9KSBjaGlwczogUXVlcnlMaXN0PE1hdENoaXA+O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgX3BhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgICAgICAgICAgICBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICAgICAgICAgICAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBwdWJsaWMgbmdDb250cm9sOiBOZ0NvbnRyb2wpIHtcbiAgICBzdXBlcihfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBfcGFyZW50Rm9ybSwgX3BhcmVudEZvcm1Hcm91cCwgbmdDb250cm9sKTtcbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wpIHtcbiAgICAgIHRoaXMubmdDb250cm9sLnZhbHVlQWNjZXNzb3IgPSB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcjxNYXRDaGlwPih0aGlzLmNoaXBzKVxuICAgICAgLndpdGhXcmFwKClcbiAgICAgIC53aXRoVmVydGljYWxPcmllbnRhdGlvbigpXG4gICAgICAud2l0aEhvcml6b250YWxPcmllbnRhdGlvbih0aGlzLl9kaXIgPyB0aGlzLl9kaXIudmFsdWUgOiAnbHRyJyk7XG5cbiAgICBpZiAodGhpcy5fZGlyKSB7XG4gICAgICB0aGlzLl9kaXIuY2hhbmdlXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgICAuc3Vic2NyaWJlKGRpciA9PiB0aGlzLl9rZXlNYW5hZ2VyLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24oZGlyKSk7XG4gICAgfVxuXG4gICAgdGhpcy5fa2V5TWFuYWdlci50YWJPdXQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2FsbG93Rm9jdXNFc2NhcGUoKTtcbiAgICB9KTtcblxuICAgIC8vIFdoZW4gdGhlIGxpc3QgY2hhbmdlcywgcmUtc3Vic2NyaWJlXG4gICAgdGhpcy5jaGlwcy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIC8vIFNpbmNlIHRoaXMgaGFwcGVucyBhZnRlciB0aGUgY29udGVudCBoYXMgYmVlblxuICAgICAgICAvLyBjaGVja2VkLCB3ZSBuZWVkIHRvIGRlZmVyIGl0IHRvIHRoZSBuZXh0IHRpY2suXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3N5bmNDaGlwc1N0YXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9yZXNldENoaXBzKCk7XG5cbiAgICAgIC8vIFJlc2V0IGNoaXBzIHNlbGVjdGVkL2Rlc2VsZWN0ZWQgc3RhdHVzXG4gICAgICB0aGlzLl9pbml0aWFsaXplU2VsZWN0aW9uKCk7XG5cbiAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB3ZSBuZWVkIHRvIHVwZGF0ZSBvdXIgdGFiIGluZGV4XG4gICAgICB0aGlzLl91cGRhdGVUYWJJbmRleCgpO1xuXG4gICAgICAvLyBDaGVjayB0byBzZWUgaWYgd2UgaGF2ZSBhIGRlc3Ryb3llZCBjaGlwIGFuZCBuZWVkIHRvIHJlZm9jdXNcbiAgICAgIHRoaXMuX3VwZGF0ZUZvY3VzRm9yRGVzdHJveWVkQ2hpcHMoKTtcblxuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwgPSBuZXcgU2VsZWN0aW9uTW9kZWw8TWF0Q2hpcD4odGhpcy5tdWx0aXBsZSwgdW5kZWZpbmVkLCBmYWxzZSk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgLy8gV2UgbmVlZCB0byByZS1ldmFsdWF0ZSB0aGlzIG9uIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUsIGJlY2F1c2UgdGhlcmUgYXJlIHNvbWVcbiAgICAgIC8vIGVycm9yIHRyaWdnZXJzIHRoYXQgd2UgY2FuJ3Qgc3Vic2NyaWJlIHRvIChlLmcuIHBhcmVudCBmb3JtIHN1Ym1pc3Npb25zKS4gVGhpcyBtZWFuc1xuICAgICAgLy8gdGhhdCB3aGF0ZXZlciBsb2dpYyBpcyBpbiBoZXJlIGhhcyB0byBiZSBzdXBlciBsZWFuIG9yIHdlIHJpc2sgZGVzdHJveWluZyB0aGUgcGVyZm9ybWFuY2UuXG4gICAgICB0aGlzLnVwZGF0ZUVycm9yU3RhdGUoKTtcblxuICAgICAgaWYgKHRoaXMubmdDb250cm9sLmRpc2FibGVkICE9PSB0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gISF0aGlzLm5nQ29udHJvbC5kaXNhYmxlZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG5cbiAgICB0aGlzLl9kcm9wU3Vic2NyaXB0aW9ucygpO1xuICB9XG5cblxuICAvKiogQXNzb2NpYXRlcyBhbiBIVE1MIGlucHV0IGVsZW1lbnQgd2l0aCB0aGlzIGNoaXAgbGlzdC4gKi9cbiAgcmVnaXN0ZXJJbnB1dChpbnB1dEVsZW1lbnQ6IE1hdENoaXBUZXh0Q29udHJvbCk6IHZvaWQge1xuICAgIHRoaXMuX2NoaXBJbnB1dCA9IGlucHV0RWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldERlc2NyaWJlZEJ5SWRzKGlkczogc3RyaW5nW10pIHsgdGhpcy5fYXJpYURlc2NyaWJlZGJ5ID0gaWRzLmpvaW4oJyAnKTsgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNoaXBzKSB7XG4gICAgICB0aGlzLl9zZXRTZWxlY3Rpb25CeVZhbHVlKHZhbHVlLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG9uQ29udGFpbmVyQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuX29yaWdpbmF0ZXNGcm9tQ2hpcChldmVudCkpIHtcbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgZmlyc3Qgbm9uLWRpc2FibGVkIGNoaXAgaW4gdGhpcyBjaGlwIGxpc3QsIG9yIHRoZSBhc3NvY2lhdGVkIGlucHV0IHdoZW4gdGhlcmVcbiAgICogYXJlIG5vIGVsaWdpYmxlIGNoaXBzLlxuICAgKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVE9ETzogQVJJQSBzYXlzIHRoaXMgc2hvdWxkIGZvY3VzIHRoZSBmaXJzdCBgc2VsZWN0ZWRgIGNoaXAgaWYgYW55IGFyZSBzZWxlY3RlZC5cbiAgICAvLyBGb2N1cyBvbiBmaXJzdCBlbGVtZW50IGlmIHRoZXJlJ3Mgbm8gY2hpcElucHV0IGluc2lkZSBjaGlwLWxpc3RcbiAgICBpZiAodGhpcy5fY2hpcElucHV0ICYmIHRoaXMuX2NoaXBJbnB1dC5mb2N1c2VkKSB7XG4gICAgICAvLyBkbyBub3RoaW5nXG4gICAgfSBlbHNlIGlmICh0aGlzLmNoaXBzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2ZvY3VzSW5wdXQob3B0aW9ucyk7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEF0dGVtcHQgdG8gZm9jdXMgYW4gaW5wdXQgaWYgd2UgaGF2ZSBvbmUuICovXG4gIF9mb2N1c0lucHV0KG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5fY2hpcElucHV0KSB7XG4gICAgICB0aGlzLl9jaGlwSW5wdXQuZm9jdXMob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBhc3MgZXZlbnRzIHRvIHRoZSBrZXlib2FyZCBtYW5hZ2VyLiBBdmFpbGFibGUgaGVyZSBmb3IgdGVzdHMuXG4gICAqL1xuICBfa2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuICAgIC8vIElmIHRoZXkgYXJlIG9uIGFuIGVtcHR5IGlucHV0IGFuZCBoaXQgYmFja3NwYWNlLCBmb2N1cyB0aGUgbGFzdCBjaGlwXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEJBQ0tTUEFDRSAmJiB0aGlzLl9pc0lucHV0RW1wdHkodGFyZ2V0KSkge1xuICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRMYXN0SXRlbUFjdGl2ZSgpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldCAmJiB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXQtY2hpcCcpKSB7XG4gICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gSE9NRSkge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldEZpcnN0SXRlbUFjdGl2ZSgpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSBFTkQpIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRMYXN0SXRlbUFjdGl2ZSgpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogQ2hlY2sgdGhlIHRhYiBpbmRleCBhcyB5b3Ugc2hvdWxkIG5vdCBiZSBhbGxvd2VkIHRvIGZvY3VzIGFuIGVtcHR5IGxpc3QuXG4gICAqL1xuICBwcm90ZWN0ZWQgX3VwZGF0ZVRhYkluZGV4KCk6IHZvaWQge1xuICAgIC8vIElmIHdlIGhhdmUgMCBjaGlwcywgd2Ugc2hvdWxkIG5vdCBhbGxvdyBrZXlib2FyZCBmb2N1c1xuICAgIHRoaXMuX3RhYkluZGV4ID0gdGhpcy5fdXNlclRhYkluZGV4IHx8ICh0aGlzLmNoaXBzLmxlbmd0aCA9PT0gMCA/IC0xIDogMCk7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIGFtb3VudCBvZiBjaGlwcyBjaGFuZ2VkLCB3ZSBuZWVkIHRvIHVwZGF0ZSB0aGVcbiAgICoga2V5IG1hbmFnZXIgc3RhdGUgYW5kIGZvY3VzIHRoZSBuZXh0IGNsb3Nlc3QgY2hpcC5cbiAgICovXG4gIHByb3RlY3RlZCBfdXBkYXRlRm9jdXNGb3JEZXN0cm95ZWRDaGlwcygpIHtcbiAgICAvLyBNb3ZlIGZvY3VzIHRvIHRoZSBjbG9zZXN0IGNoaXAuIElmIG5vIG90aGVyIGNoaXBzIHJlbWFpbiwgZm9jdXMgdGhlIGNoaXAtbGlzdCBpdHNlbGYuXG4gICAgaWYgKHRoaXMuX2xhc3REZXN0cm95ZWRDaGlwSW5kZXggIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY2hpcHMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IG5ld0NoaXBJbmRleCA9IE1hdGgubWluKHRoaXMuX2xhc3REZXN0cm95ZWRDaGlwSW5kZXgsIHRoaXMuY2hpcHMubGVuZ3RoIC0gMSk7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbShuZXdDaGlwSW5kZXgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2xhc3REZXN0cm95ZWRDaGlwSW5kZXggPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFV0aWxpdHkgdG8gZW5zdXJlIGFsbCBpbmRleGVzIGFyZSB2YWxpZC5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCB0byBiZSBjaGVja2VkLlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBpbmRleCBpcyB2YWxpZCBmb3Igb3VyIGxpc3Qgb2YgY2hpcHMuXG4gICAqL1xuICBwcml2YXRlIF9pc1ZhbGlkSW5kZXgoaW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5jaGlwcy5sZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIF9pc0lucHV0RW1wdHkoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpbnB1dCcpIHtcbiAgICAgIGxldCBpbnB1dCA9IGVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgIHJldHVybiAhaW5wdXQudmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgX3NldFNlbGVjdGlvbkJ5VmFsdWUodmFsdWU6IGFueSwgaXNVc2VySW5wdXQ6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgdGhpcy5fY2xlYXJTZWxlY3Rpb24oKTtcbiAgICB0aGlzLmNoaXBzLmZvckVhY2goY2hpcCA9PiBjaGlwLmRlc2VsZWN0KCkpO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB2YWx1ZS5mb3JFYWNoKGN1cnJlbnRWYWx1ZSA9PiB0aGlzLl9zZWxlY3RWYWx1ZShjdXJyZW50VmFsdWUsIGlzVXNlcklucHV0KSk7XG4gICAgICB0aGlzLl9zb3J0VmFsdWVzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdDaGlwID0gdGhpcy5fc2VsZWN0VmFsdWUodmFsdWUsIGlzVXNlcklucHV0KTtcblxuICAgICAgLy8gU2hpZnQgZm9jdXMgdG8gdGhlIGFjdGl2ZSBpdGVtLiBOb3RlIHRoYXQgd2Ugc2hvdWxkbid0IGRvIHRoaXMgaW4gbXVsdGlwbGVcbiAgICAgIC8vIG1vZGUsIGJlY2F1c2Ugd2UgZG9uJ3Qga25vdyB3aGF0IGNoaXAgdGhlIHVzZXIgaW50ZXJhY3RlZCB3aXRoIGxhc3QuXG4gICAgICBpZiAoY29ycmVzcG9uZGluZ0NoaXApIHtcbiAgICAgICAgaWYgKGlzVXNlcklucHV0KSB7XG4gICAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKGNvcnJlc3BvbmRpbmdDaGlwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbmQgc2VsZWN0cyB0aGUgY2hpcCBiYXNlZCBvbiBpdHMgdmFsdWUuXG4gICAqIEByZXR1cm5zIENoaXAgdGhhdCBoYXMgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUuXG4gICAqL1xuICBwcml2YXRlIF9zZWxlY3RWYWx1ZSh2YWx1ZTogYW55LCBpc1VzZXJJbnB1dDogYm9vbGVhbiA9IHRydWUpOiBNYXRDaGlwIHwgdW5kZWZpbmVkIHtcblxuICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdDaGlwID0gdGhpcy5jaGlwcy5maW5kKGNoaXAgPT4ge1xuICAgICAgcmV0dXJuIGNoaXAudmFsdWUgIT0gbnVsbCAmJiB0aGlzLl9jb21wYXJlV2l0aChjaGlwLnZhbHVlLCAgdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgaWYgKGNvcnJlc3BvbmRpbmdDaGlwKSB7XG4gICAgICBpc1VzZXJJbnB1dCA/IGNvcnJlc3BvbmRpbmdDaGlwLnNlbGVjdFZpYUludGVyYWN0aW9uKCkgOiBjb3JyZXNwb25kaW5nQ2hpcC5zZWxlY3QoKTtcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdChjb3JyZXNwb25kaW5nQ2hpcCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvcnJlc3BvbmRpbmdDaGlwO1xuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZVNlbGVjdGlvbigpOiB2b2lkIHtcbiAgICAvLyBEZWZlciBzZXR0aW5nIHRoZSB2YWx1ZSBpbiBvcmRlciB0byBhdm9pZCB0aGUgXCJFeHByZXNzaW9uXG4gICAgLy8gaGFzIGNoYW5nZWQgYWZ0ZXIgaXQgd2FzIGNoZWNrZWRcIiBlcnJvcnMgZnJvbSBBbmd1bGFyLlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubmdDb250cm9sIHx8IHRoaXMuX3ZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUodGhpcy5uZ0NvbnRyb2wgPyB0aGlzLm5nQ29udHJvbC52YWx1ZSA6IHRoaXMuX3ZhbHVlLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlbGVjdHMgZXZlcnkgY2hpcCBpbiB0aGUgbGlzdC5cbiAgICogQHBhcmFtIHNraXAgQ2hpcCB0aGF0IHNob3VsZCBub3QgYmUgZGVzZWxlY3RlZC5cbiAgICovXG4gIHByaXZhdGUgX2NsZWFyU2VsZWN0aW9uKHNraXA/OiBNYXRDaGlwKTogdm9pZCB7XG4gICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuY2xlYXIoKTtcbiAgICB0aGlzLmNoaXBzLmZvckVhY2goY2hpcCA9PiB7XG4gICAgICBpZiAoY2hpcCAhPT0gc2tpcCkge1xuICAgICAgICBjaGlwLmRlc2VsZWN0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNvcnRzIHRoZSBtb2RlbCB2YWx1ZXMsIGVuc3VyaW5nIHRoYXQgdGhleSBrZWVwIHRoZSBzYW1lXG4gICAqIG9yZGVyIHRoYXQgdGhleSBoYXZlIGluIHRoZSBwYW5lbC5cbiAgICovXG4gIHByaXZhdGUgX3NvcnRWYWx1ZXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX211bHRpcGxlKSB7XG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xuXG4gICAgICB0aGlzLmNoaXBzLmZvckVhY2goY2hpcCA9PiB7XG4gICAgICAgIGlmIChjaGlwLnNlbGVjdGVkKSB7XG4gICAgICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0KGNoaXApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogRW1pdHMgY2hhbmdlIGV2ZW50IHRvIHNldCB0aGUgbW9kZWwgdmFsdWUuICovXG4gIHByaXZhdGUgX3Byb3BhZ2F0ZUNoYW5nZXMoZmFsbGJhY2tWYWx1ZT86IGFueSk6IHZvaWQge1xuICAgIGxldCB2YWx1ZVRvRW1pdDogYW55ID0gbnVsbDtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc2VsZWN0ZWQpKSB7XG4gICAgICB2YWx1ZVRvRW1pdCA9IHRoaXMuc2VsZWN0ZWQubWFwKGNoaXAgPT4gY2hpcC52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlVG9FbWl0ID0gdGhpcy5zZWxlY3RlZCA/IHRoaXMuc2VsZWN0ZWQudmFsdWUgOiBmYWxsYmFja1ZhbHVlO1xuICAgIH1cbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlVG9FbWl0O1xuICAgIHRoaXMuY2hhbmdlLmVtaXQobmV3IE1hdENoaXBMaXN0Q2hhbmdlKHRoaXMsIHZhbHVlVG9FbWl0KSk7XG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHZhbHVlVG9FbWl0KTtcbiAgICB0aGlzLl9vbkNoYW5nZSh2YWx1ZVRvRW1pdCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogV2hlbiBibHVycmVkLCBtYXJrIHRoZSBmaWVsZCBhcyB0b3VjaGVkIHdoZW4gZm9jdXMgbW92ZWQgb3V0c2lkZSB0aGUgY2hpcCBsaXN0LiAqL1xuICBfYmx1cigpIHtcbiAgICBpZiAoIXRoaXMuX2hhc0ZvY3VzZWRDaGlwKCkpIHtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSgtMSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICBpZiAodGhpcy5fY2hpcElucHV0KSB7XG4gICAgICAgIC8vIElmIHRoZXJlJ3MgYSBjaGlwIGlucHV0LCB3ZSBzaG91bGQgY2hlY2sgd2hldGhlciB0aGUgZm9jdXMgbW92ZWQgdG8gY2hpcCBpbnB1dC5cbiAgICAgICAgLy8gSWYgdGhlIGZvY3VzIGlzIG5vdCBtb3ZlZCB0byBjaGlwIGlucHV0LCBtYXJrIHRoZSBmaWVsZCBhcyB0b3VjaGVkLiBJZiB0aGUgZm9jdXMgbW92ZWRcbiAgICAgICAgLy8gdG8gY2hpcCBpbnB1dCwgZG8gbm90aGluZy5cbiAgICAgICAgLy8gVGltZW91dCBpcyBuZWVkZWQgdG8gd2FpdCBmb3IgdGhlIGZvY3VzKCkgZXZlbnQgdHJpZ2dlciBvbiBjaGlwIGlucHV0LlxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuZm9jdXNlZCkge1xuICAgICAgICAgICAgdGhpcy5fbWFya0FzVG91Y2hlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIGNoaXAgaW5wdXQsIHRoZW4gbWFyayB0aGUgZmllbGQgYXMgdG91Y2hlZC5cbiAgICAgICAgdGhpcy5fbWFya0FzVG91Y2hlZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBNYXJrIHRoZSBmaWVsZCBhcyB0b3VjaGVkICovXG4gIF9tYXJrQXNUb3VjaGVkKCkge1xuICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBgdGFiaW5kZXhgIGZyb20gdGhlIGNoaXAgbGlzdCBhbmQgcmVzZXRzIGl0IGJhY2sgYWZ0ZXJ3YXJkcywgYWxsb3dpbmcgdGhlXG4gICAqIHVzZXIgdG8gdGFiIG91dCBvZiBpdC4gVGhpcyBwcmV2ZW50cyB0aGUgbGlzdCBmcm9tIGNhcHR1cmluZyBmb2N1cyBhbmQgcmVkaXJlY3RpbmdcbiAgICogaXQgYmFjayB0byB0aGUgZmlyc3QgY2hpcCwgY3JlYXRpbmcgYSBmb2N1cyB0cmFwLCBpZiBpdCB1c2VyIHRyaWVzIHRvIHRhYiBhd2F5LlxuICAgKi9cbiAgX2FsbG93Rm9jdXNFc2NhcGUoKSB7XG4gICAgaWYgKHRoaXMuX3RhYkluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy5fdGFiSW5kZXggPSAtMTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3RhYkluZGV4ID0gdGhpcy5fdXNlclRhYkluZGV4IHx8IDA7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcmVzZXRDaGlwcygpIHtcbiAgICB0aGlzLl9kcm9wU3Vic2NyaXB0aW9ucygpO1xuICAgIHRoaXMuX2xpc3RlblRvQ2hpcHNGb2N1cygpO1xuICAgIHRoaXMuX2xpc3RlblRvQ2hpcHNTZWxlY3Rpb24oKTtcbiAgICB0aGlzLl9saXN0ZW5Ub0NoaXBzUmVtb3ZlZCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZHJvcFN1YnNjcmlwdGlvbnMoKSB7XG4gICAgaWYgKHRoaXMuX2NoaXBGb2N1c1N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fY2hpcEZvY3VzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLl9jaGlwRm9jdXNTdWJzY3JpcHRpb24gPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9jaGlwQmx1clN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fY2hpcEJsdXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuX2NoaXBCbHVyU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY2hpcFNlbGVjdGlvblN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fY2hpcFNlbGVjdGlvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fY2hpcFNlbGVjdGlvblN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2NoaXBSZW1vdmVTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2NoaXBSZW1vdmVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuX2NoaXBSZW1vdmVTdWJzY3JpcHRpb24gPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBMaXN0ZW5zIHRvIHVzZXItZ2VuZXJhdGVkIHNlbGVjdGlvbiBldmVudHMgb24gZWFjaCBjaGlwLiAqL1xuICBwcml2YXRlIF9saXN0ZW5Ub0NoaXBzU2VsZWN0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMuX2NoaXBTZWxlY3Rpb25TdWJzY3JpcHRpb24gPSB0aGlzLmNoaXBTZWxlY3Rpb25DaGFuZ2VzLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBldmVudC5zb3VyY2Uuc2VsZWN0ZWRcbiAgICAgICAgPyB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3QoZXZlbnQuc291cmNlKVxuICAgICAgICA6IHRoaXMuX3NlbGVjdGlvbk1vZGVsLmRlc2VsZWN0KGV2ZW50LnNvdXJjZSk7XG5cbiAgICAgIC8vIEZvciBzaW5nbGUgc2VsZWN0aW9uIGNoaXAgbGlzdCwgbWFrZSBzdXJlIHRoZSBkZXNlbGVjdGVkIHZhbHVlIGlzIHVuc2VsZWN0ZWQuXG4gICAgICBpZiAoIXRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5jaGlwcy5mb3JFYWNoKGNoaXAgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5fc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RlZChjaGlwKSAmJiBjaGlwLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICBjaGlwLmRlc2VsZWN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50LmlzVXNlcklucHV0KSB7XG4gICAgICAgIHRoaXMuX3Byb3BhZ2F0ZUNoYW5nZXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBMaXN0ZW5zIHRvIHVzZXItZ2VuZXJhdGVkIHNlbGVjdGlvbiBldmVudHMgb24gZWFjaCBjaGlwLiAqL1xuICBwcml2YXRlIF9saXN0ZW5Ub0NoaXBzRm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5fY2hpcEZvY3VzU3Vic2NyaXB0aW9uID0gdGhpcy5jaGlwRm9jdXNDaGFuZ2VzLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBsZXQgY2hpcEluZGV4OiBudW1iZXIgPSB0aGlzLmNoaXBzLnRvQXJyYXkoKS5pbmRleE9mKGV2ZW50LmNoaXApO1xuXG4gICAgICBpZiAodGhpcy5faXNWYWxpZEluZGV4KGNoaXBJbmRleCkpIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKGNoaXBJbmRleCk7XG4gICAgICB9XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jaGlwQmx1clN1YnNjcmlwdGlvbiA9IHRoaXMuY2hpcEJsdXJDaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9ibHVyKCk7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9saXN0ZW5Ub0NoaXBzUmVtb3ZlZCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGlwUmVtb3ZlU3Vic2NyaXB0aW9uID0gdGhpcy5jaGlwUmVtb3ZlQ2hhbmdlcy5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgY29uc3QgY2hpcCA9IGV2ZW50LmNoaXA7XG4gICAgICBjb25zdCBjaGlwSW5kZXggPSB0aGlzLmNoaXBzLnRvQXJyYXkoKS5pbmRleE9mKGV2ZW50LmNoaXApO1xuXG4gICAgICAvLyBJbiBjYXNlIHRoZSBjaGlwIHRoYXQgd2lsbCBiZSByZW1vdmVkIGlzIGN1cnJlbnRseSBmb2N1c2VkLCB3ZSB0ZW1wb3JhcmlseSBzdG9yZVxuICAgICAgLy8gdGhlIGluZGV4IGluIG9yZGVyIHRvIGJlIGFibGUgdG8gZGV0ZXJtaW5lIGFuIGFwcHJvcHJpYXRlIHNpYmxpbmcgY2hpcCB0aGF0IHdpbGxcbiAgICAgIC8vIHJlY2VpdmUgZm9jdXMuXG4gICAgICBpZiAodGhpcy5faXNWYWxpZEluZGV4KGNoaXBJbmRleCkgJiYgY2hpcC5faGFzRm9jdXMpIHtcbiAgICAgICAgdGhpcy5fbGFzdERlc3Ryb3llZENoaXBJbmRleCA9IGNoaXBJbmRleDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciBhbiBldmVudCBjb21lcyBmcm9tIGluc2lkZSBhIGNoaXAgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfb3JpZ2luYXRlc0Zyb21DaGlwKGV2ZW50OiBFdmVudCk6IGJvb2xlYW4ge1xuICAgIGxldCBjdXJyZW50RWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG5cbiAgICB3aGlsZSAoY3VycmVudEVsZW1lbnQgJiYgY3VycmVudEVsZW1lbnQgIT09IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkge1xuICAgICAgaWYgKGN1cnJlbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWF0LWNoaXAnKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY3VycmVudEVsZW1lbnQgPSBjdXJyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciBhbnkgb2YgdGhlIGNoaXBzIGlzIGZvY3VzZWQuICovXG4gIHByaXZhdGUgX2hhc0ZvY3VzZWRDaGlwKCkge1xuICAgIHJldHVybiB0aGlzLmNoaXBzLnNvbWUoY2hpcCA9PiBjaGlwLl9oYXNGb2N1cyk7XG4gIH1cblxuICAvKiogU3luY3MgdGhlIGxpc3QncyBzdGF0ZSB3aXRoIHRoZSBpbmRpdmlkdWFsIGNoaXBzLiAqL1xuICBwcml2YXRlIF9zeW5jQ2hpcHNTdGF0ZSgpIHtcbiAgICBpZiAodGhpcy5jaGlwcykge1xuICAgICAgdGhpcy5jaGlwcy5mb3JFYWNoKGNoaXAgPT4ge1xuICAgICAgICBjaGlwLl9jaGlwTGlzdERpc2FibGVkID0gdGhpcy5fZGlzYWJsZWQ7XG4gICAgICAgIGNoaXAuX2NoaXBMaXN0TXVsdGlwbGUgPSB0aGlzLm11bHRpcGxlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX211bHRpcGxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGFibGU6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==