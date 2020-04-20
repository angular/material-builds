/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends, __read, __spread } from "tslib";
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
var MatChipListBase = /** @class */ (function () {
    function MatChipListBase(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, 
    /** @docs-private */
    ngControl) {
        this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this.ngControl = ngControl;
    }
    return MatChipListBase;
}());
var _MatChipListMixinBase = mixinErrorState(MatChipListBase);
// Increasing integer for generating unique ids for chip-list components.
var nextUniqueId = 0;
/** Change event object that is emitted when the chip list value has changed. */
var MatChipListChange = /** @class */ (function () {
    function MatChipListChange(
    /** Chip list that emitted the event. */
    source, 
    /** Value of the chip list when the event was emitted. */
    value) {
        this.source = source;
        this.value = value;
    }
    return MatChipListChange;
}());
export { MatChipListChange };
/**
 * A material design chips component (named ChipList for its similarity to the List component).
 */
var MatChipList = /** @class */ (function (_super) {
    __extends(MatChipList, _super);
    function MatChipList(_elementRef, _changeDetectorRef, _dir, _parentForm, _parentFormGroup, _defaultErrorStateMatcher, 
    /** @docs-private */
    ngControl) {
        var _this = _super.call(this, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl) || this;
        _this._elementRef = _elementRef;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._dir = _dir;
        _this.ngControl = ngControl;
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        _this.controlType = 'mat-chip-list';
        /**
         * When a chip is destroyed, we store the index of the destroyed chip until the chips
         * query list notifies about the update. This is necessary because we cannot determine an
         * appropriate chip that should receive focus until the array of chips updated completely.
         */
        _this._lastDestroyedChipIndex = null;
        /** Subject that emits when the component has been destroyed. */
        _this._destroyed = new Subject();
        /** Uid of the chip list */
        _this._uid = "mat-chip-list-" + nextUniqueId++;
        /** Tab index for the chip list. */
        _this._tabIndex = 0;
        /**
         * User defined tab index.
         * When it is not null, use user defined tab index. Otherwise use _tabIndex
         */
        _this._userTabIndex = null;
        /** Function when touched */
        _this._onTouched = function () { };
        /** Function when changed */
        _this._onChange = function () { };
        _this._multiple = false;
        _this._compareWith = function (o1, o2) { return o1 === o2; };
        _this._required = false;
        _this._disabled = false;
        /** Orientation of the chip list. */
        _this.ariaOrientation = 'horizontal';
        _this._selectable = true;
        /** Event emitted when the selected chip list value has been changed by the user. */
        _this.change = new EventEmitter();
        /**
         * Event that emits whenever the raw value of the chip-list changes. This is here primarily
         * to facilitate the two-way binding for the `value` input.
         * @docs-private
         */
        _this.valueChange = new EventEmitter();
        if (_this.ngControl) {
            _this.ngControl.valueAccessor = _this;
        }
        return _this;
    }
    Object.defineProperty(MatChipList.prototype, "selected", {
        /** The array of selected chips inside chip list. */
        get: function () {
            return this.multiple ? this._selectionModel.selected : this._selectionModel.selected[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "role", {
        /** The ARIA role applied to the chip list. */
        get: function () { return this.empty ? null : 'listbox'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "multiple", {
        /** Whether the user should be allowed to select multiple chips. */
        get: function () { return this._multiple; },
        set: function (value) {
            this._multiple = coerceBooleanProperty(value);
            this._syncChipsState();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "compareWith", {
        /**
         * A function to compare the option values with the selected values. The first argument
         * is a value from an option. The second is a value from the selection. A boolean
         * should be returned.
         */
        get: function () { return this._compareWith; },
        set: function (fn) {
            this._compareWith = fn;
            if (this._selectionModel) {
                // A different comparator means the selection could change.
                this._initializeSelection();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "value", {
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get: function () { return this._value; },
        set: function (value) {
            this.writeValue(value);
            this._value = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "id", {
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get: function () {
            return this._chipInput ? this._chipInput.id : this._uid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "required", {
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get: function () { return this._required; },
        set: function (value) {
            this._required = coerceBooleanProperty(value);
            this.stateChanges.next();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "placeholder", {
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get: function () {
            return this._chipInput ? this._chipInput.placeholder : this._placeholder;
        },
        set: function (value) {
            this._placeholder = value;
            this.stateChanges.next();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "focused", {
        /** Whether any chips or the matChipInput inside of this chip-list has focus. */
        get: function () {
            return (this._chipInput && this._chipInput.focused) || this._hasFocusedChip();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "empty", {
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get: function () {
            return (!this._chipInput || this._chipInput.empty) && this.chips.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "shouldLabelFloat", {
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get: function () { return !this.empty || this.focused; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "disabled", {
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get: function () { return this.ngControl ? !!this.ngControl.disabled : this._disabled; },
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
            this._syncChipsState();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "selectable", {
        /**
         * Whether or not this chip list is selectable. When a chip list is not selectable,
         * the selected states for all the chips inside the chip list are always ignored.
         */
        get: function () { return this._selectable; },
        set: function (value) {
            var _this = this;
            this._selectable = coerceBooleanProperty(value);
            if (this.chips) {
                this.chips.forEach(function (chip) { return chip.chipListSelectable = _this._selectable; });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "tabIndex", {
        set: function (value) {
            this._userTabIndex = value;
            this._tabIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "chipSelectionChanges", {
        /** Combined stream of all of the child chips' selection change events. */
        get: function () {
            return merge.apply(void 0, __spread(this.chips.map(function (chip) { return chip.selectionChange; })));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "chipFocusChanges", {
        /** Combined stream of all of the child chips' focus change events. */
        get: function () {
            return merge.apply(void 0, __spread(this.chips.map(function (chip) { return chip._onFocus; })));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "chipBlurChanges", {
        /** Combined stream of all of the child chips' blur change events. */
        get: function () {
            return merge.apply(void 0, __spread(this.chips.map(function (chip) { return chip._onBlur; })));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatChipList.prototype, "chipRemoveChanges", {
        /** Combined stream of all of the child chips' remove change events. */
        get: function () {
            return merge.apply(void 0, __spread(this.chips.map(function (chip) { return chip.destroyed; })));
        },
        enumerable: true,
        configurable: true
    });
    MatChipList.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._keyManager = new FocusKeyManager(this.chips)
            .withWrap()
            .withVerticalOrientation()
            .withHorizontalOrientation(this._dir ? this._dir.value : 'ltr');
        if (this._dir) {
            this._dir.change
                .pipe(takeUntil(this._destroyed))
                .subscribe(function (dir) { return _this._keyManager.withHorizontalOrientation(dir); });
        }
        this._keyManager.tabOut.pipe(takeUntil(this._destroyed)).subscribe(function () {
            _this._allowFocusEscape();
        });
        // When the list changes, re-subscribe
        this.chips.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(function () {
            if (_this.disabled) {
                // Since this happens after the content has been
                // checked, we need to defer it to the next tick.
                Promise.resolve().then(function () {
                    _this._syncChipsState();
                });
            }
            _this._resetChips();
            // Reset chips selected/deselected status
            _this._initializeSelection();
            // Check to see if we need to update our tab index
            _this._updateTabIndex();
            // Check to see if we have a destroyed chip and need to refocus
            _this._updateFocusForDestroyedChips();
            _this.stateChanges.next();
        });
    };
    MatChipList.prototype.ngOnInit = function () {
        this._selectionModel = new SelectionModel(this.multiple, undefined, false);
        this.stateChanges.next();
    };
    MatChipList.prototype.ngDoCheck = function () {
        if (this.ngControl) {
            // We need to re-evaluate this on every change detection cycle, because there are some
            // error triggers that we can't subscribe to (e.g. parent form submissions). This means
            // that whatever logic is in here has to be super lean or we risk destroying the performance.
            this.updateErrorState();
            if (this.ngControl.disabled !== this._disabled) {
                this.disabled = !!this.ngControl.disabled;
            }
        }
    };
    MatChipList.prototype.ngOnDestroy = function () {
        this._destroyed.next();
        this._destroyed.complete();
        this.stateChanges.complete();
        this._dropSubscriptions();
    };
    /** Associates an HTML input element with this chip list. */
    MatChipList.prototype.registerInput = function (inputElement) {
        this._chipInput = inputElement;
    };
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    MatChipList.prototype.setDescribedByIds = function (ids) { this._ariaDescribedby = ids.join(' '); };
    // Implemented as part of ControlValueAccessor.
    MatChipList.prototype.writeValue = function (value) {
        if (this.chips) {
            this._setSelectionByValue(value, false);
        }
    };
    // Implemented as part of ControlValueAccessor.
    MatChipList.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    // Implemented as part of ControlValueAccessor.
    MatChipList.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    // Implemented as part of ControlValueAccessor.
    MatChipList.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
        this.stateChanges.next();
    };
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    MatChipList.prototype.onContainerClick = function (event) {
        if (!this._originatesFromChip(event)) {
            this.focus();
        }
    };
    /**
     * Focuses the first non-disabled chip in this chip list, or the associated input when there
     * are no eligible chips.
     */
    MatChipList.prototype.focus = function (options) {
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
    };
    /** Attempt to focus an input if we have one. */
    MatChipList.prototype._focusInput = function (options) {
        if (this._chipInput) {
            this._chipInput.focus(options);
        }
    };
    /**
     * Pass events to the keyboard manager. Available here for tests.
     */
    MatChipList.prototype._keydown = function (event) {
        var target = event.target;
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
    };
    /**
     * Check the tab index as you should not be allowed to focus an empty list.
     */
    MatChipList.prototype._updateTabIndex = function () {
        // If we have 0 chips, we should not allow keyboard focus
        this._tabIndex = this._userTabIndex || (this.chips.length === 0 ? -1 : 0);
    };
    /**
     * If the amount of chips changed, we need to update the
     * key manager state and focus the next closest chip.
     */
    MatChipList.prototype._updateFocusForDestroyedChips = function () {
        // Move focus to the closest chip. If no other chips remain, focus the chip-list itself.
        if (this._lastDestroyedChipIndex != null) {
            if (this.chips.length) {
                var newChipIndex = Math.min(this._lastDestroyedChipIndex, this.chips.length - 1);
                this._keyManager.setActiveItem(newChipIndex);
            }
            else {
                this.focus();
            }
        }
        this._lastDestroyedChipIndex = null;
    };
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param index The index to be checked.
     * @returns True if the index is valid for our list of chips.
     */
    MatChipList.prototype._isValidIndex = function (index) {
        return index >= 0 && index < this.chips.length;
    };
    MatChipList.prototype._isInputEmpty = function (element) {
        if (element && element.nodeName.toLowerCase() === 'input') {
            var input = element;
            return !input.value;
        }
        return false;
    };
    MatChipList.prototype._setSelectionByValue = function (value, isUserInput) {
        var _this = this;
        if (isUserInput === void 0) { isUserInput = true; }
        this._clearSelection();
        this.chips.forEach(function (chip) { return chip.deselect(); });
        if (Array.isArray(value)) {
            value.forEach(function (currentValue) { return _this._selectValue(currentValue, isUserInput); });
            this._sortValues();
        }
        else {
            var correspondingChip = this._selectValue(value, isUserInput);
            // Shift focus to the active item. Note that we shouldn't do this in multiple
            // mode, because we don't know what chip the user interacted with last.
            if (correspondingChip) {
                if (isUserInput) {
                    this._keyManager.setActiveItem(correspondingChip);
                }
            }
        }
    };
    /**
     * Finds and selects the chip based on its value.
     * @returns Chip that has the corresponding value.
     */
    MatChipList.prototype._selectValue = function (value, isUserInput) {
        var _this = this;
        if (isUserInput === void 0) { isUserInput = true; }
        var correspondingChip = this.chips.find(function (chip) {
            return chip.value != null && _this._compareWith(chip.value, value);
        });
        if (correspondingChip) {
            isUserInput ? correspondingChip.selectViaInteraction() : correspondingChip.select();
            this._selectionModel.select(correspondingChip);
        }
        return correspondingChip;
    };
    MatChipList.prototype._initializeSelection = function () {
        var _this = this;
        // Defer setting the value in order to avoid the "Expression
        // has changed after it was checked" errors from Angular.
        Promise.resolve().then(function () {
            if (_this.ngControl || _this._value) {
                _this._setSelectionByValue(_this.ngControl ? _this.ngControl.value : _this._value, false);
                _this.stateChanges.next();
            }
        });
    };
    /**
     * Deselects every chip in the list.
     * @param skip Chip that should not be deselected.
     */
    MatChipList.prototype._clearSelection = function (skip) {
        this._selectionModel.clear();
        this.chips.forEach(function (chip) {
            if (chip !== skip) {
                chip.deselect();
            }
        });
        this.stateChanges.next();
    };
    /**
     * Sorts the model values, ensuring that they keep the same
     * order that they have in the panel.
     */
    MatChipList.prototype._sortValues = function () {
        var _this = this;
        if (this._multiple) {
            this._selectionModel.clear();
            this.chips.forEach(function (chip) {
                if (chip.selected) {
                    _this._selectionModel.select(chip);
                }
            });
            this.stateChanges.next();
        }
    };
    /** Emits change event to set the model value. */
    MatChipList.prototype._propagateChanges = function (fallbackValue) {
        var valueToEmit = null;
        if (Array.isArray(this.selected)) {
            valueToEmit = this.selected.map(function (chip) { return chip.value; });
        }
        else {
            valueToEmit = this.selected ? this.selected.value : fallbackValue;
        }
        this._value = valueToEmit;
        this.change.emit(new MatChipListChange(this, valueToEmit));
        this.valueChange.emit(valueToEmit);
        this._onChange(valueToEmit);
        this._changeDetectorRef.markForCheck();
    };
    /** When blurred, mark the field as touched when focus moved outside the chip list. */
    MatChipList.prototype._blur = function () {
        var _this = this;
        if (!this._hasFocusedChip()) {
            this._keyManager.setActiveItem(-1);
        }
        if (!this.disabled) {
            if (this._chipInput) {
                // If there's a chip input, we should check whether the focus moved to chip input.
                // If the focus is not moved to chip input, mark the field as touched. If the focus moved
                // to chip input, do nothing.
                // Timeout is needed to wait for the focus() event trigger on chip input.
                setTimeout(function () {
                    if (!_this.focused) {
                        _this._markAsTouched();
                    }
                });
            }
            else {
                // If there's no chip input, then mark the field as touched.
                this._markAsTouched();
            }
        }
    };
    /** Mark the field as touched */
    MatChipList.prototype._markAsTouched = function () {
        this._onTouched();
        this._changeDetectorRef.markForCheck();
        this.stateChanges.next();
    };
    /**
     * Removes the `tabindex` from the chip list and resets it back afterwards, allowing the
     * user to tab out of it. This prevents the list from capturing focus and redirecting
     * it back to the first chip, creating a focus trap, if it user tries to tab away.
     */
    MatChipList.prototype._allowFocusEscape = function () {
        var _this = this;
        if (this._tabIndex !== -1) {
            this._tabIndex = -1;
            setTimeout(function () {
                _this._tabIndex = _this._userTabIndex || 0;
                _this._changeDetectorRef.markForCheck();
            });
        }
    };
    MatChipList.prototype._resetChips = function () {
        this._dropSubscriptions();
        this._listenToChipsFocus();
        this._listenToChipsSelection();
        this._listenToChipsRemoved();
    };
    MatChipList.prototype._dropSubscriptions = function () {
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
    };
    /** Listens to user-generated selection events on each chip. */
    MatChipList.prototype._listenToChipsSelection = function () {
        var _this = this;
        this._chipSelectionSubscription = this.chipSelectionChanges.subscribe(function (event) {
            event.source.selected
                ? _this._selectionModel.select(event.source)
                : _this._selectionModel.deselect(event.source);
            // For single selection chip list, make sure the deselected value is unselected.
            if (!_this.multiple) {
                _this.chips.forEach(function (chip) {
                    if (!_this._selectionModel.isSelected(chip) && chip.selected) {
                        chip.deselect();
                    }
                });
            }
            if (event.isUserInput) {
                _this._propagateChanges();
            }
        });
    };
    /** Listens to user-generated selection events on each chip. */
    MatChipList.prototype._listenToChipsFocus = function () {
        var _this = this;
        this._chipFocusSubscription = this.chipFocusChanges.subscribe(function (event) {
            var chipIndex = _this.chips.toArray().indexOf(event.chip);
            if (_this._isValidIndex(chipIndex)) {
                _this._keyManager.updateActiveItem(chipIndex);
            }
            _this.stateChanges.next();
        });
        this._chipBlurSubscription = this.chipBlurChanges.subscribe(function () {
            _this._blur();
            _this.stateChanges.next();
        });
    };
    MatChipList.prototype._listenToChipsRemoved = function () {
        var _this = this;
        this._chipRemoveSubscription = this.chipRemoveChanges.subscribe(function (event) {
            var chip = event.chip;
            var chipIndex = _this.chips.toArray().indexOf(event.chip);
            // In case the chip that will be removed is currently focused, we temporarily store
            // the index in order to be able to determine an appropriate sibling chip that will
            // receive focus.
            if (_this._isValidIndex(chipIndex) && chip._hasFocus) {
                _this._lastDestroyedChipIndex = chipIndex;
            }
        });
    };
    /** Checks whether an event comes from inside a chip element. */
    MatChipList.prototype._originatesFromChip = function (event) {
        var currentElement = event.target;
        while (currentElement && currentElement !== this._elementRef.nativeElement) {
            if (currentElement.classList.contains('mat-chip')) {
                return true;
            }
            currentElement = currentElement.parentElement;
        }
        return false;
    };
    /** Checks whether any of the chips is focused. */
    MatChipList.prototype._hasFocusedChip = function () {
        return this.chips.some(function (chip) { return chip._hasFocus; });
    };
    /** Syncs the list's state with the individual chips. */
    MatChipList.prototype._syncChipsState = function () {
        var _this = this;
        if (this.chips) {
            this.chips.forEach(function (chip) {
                chip.disabled = _this._disabled;
                chip._chipListMultiple = _this.multiple;
            });
        }
    };
    MatChipList.decorators = [
        { type: Component, args: [{
                    selector: 'mat-chip-list',
                    template: "<div class=\"mat-chip-list-wrapper\"><ng-content></ng-content></div>",
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
                    providers: [{ provide: MatFormFieldControl, useExisting: MatChipList }],
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".mat-chip{position:relative;box-sizing:border-box;-webkit-tap-highlight-color:transparent;transform:translateZ(0);border:none;-webkit-appearance:none;-moz-appearance:none}.mat-standard-chip{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);display:inline-flex;padding:7px 12px;border-radius:16px;align-items:center;cursor:default;min-height:32px;height:1px}._mat-animation-noopable.mat-standard-chip{transition:none;animation:none}.mat-standard-chip .mat-chip-remove.mat-icon{width:18px;height:18px}.mat-standard-chip::after{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit;opacity:0;content:\"\";pointer-events:none;transition:opacity 200ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-standard-chip:hover::after{opacity:.12}.mat-standard-chip:focus{outline:none}.mat-standard-chip:focus::after{opacity:.16}.cdk-high-contrast-active .mat-standard-chip{outline:solid 1px}.cdk-high-contrast-active .mat-standard-chip:focus{outline:dotted 2px}.mat-standard-chip.mat-chip-disabled::after{opacity:0}.mat-standard-chip.mat-chip-disabled .mat-chip-remove,.mat-standard-chip.mat-chip-disabled .mat-chip-trailing-icon{cursor:default}.mat-standard-chip.mat-chip-with-trailing-icon.mat-chip-with-avatar,.mat-standard-chip.mat-chip-with-avatar{padding-top:0;padding-bottom:0}.mat-standard-chip.mat-chip-with-trailing-icon.mat-chip-with-avatar{padding-right:8px;padding-left:0}[dir=rtl] .mat-standard-chip.mat-chip-with-trailing-icon.mat-chip-with-avatar{padding-left:8px;padding-right:0}.mat-standard-chip.mat-chip-with-trailing-icon{padding-top:7px;padding-bottom:7px;padding-right:8px;padding-left:12px}[dir=rtl] .mat-standard-chip.mat-chip-with-trailing-icon{padding-left:8px;padding-right:12px}.mat-standard-chip.mat-chip-with-avatar{padding-left:0;padding-right:12px}[dir=rtl] .mat-standard-chip.mat-chip-with-avatar{padding-right:0;padding-left:12px}.mat-standard-chip .mat-chip-avatar{width:24px;height:24px;margin-right:8px;margin-left:4px}[dir=rtl] .mat-standard-chip .mat-chip-avatar{margin-left:8px;margin-right:4px}.mat-standard-chip .mat-chip-remove,.mat-standard-chip .mat-chip-trailing-icon{width:18px;height:18px;cursor:pointer}.mat-standard-chip .mat-chip-remove,.mat-standard-chip .mat-chip-trailing-icon{margin-left:8px;margin-right:0}[dir=rtl] .mat-standard-chip .mat-chip-remove,[dir=rtl] .mat-standard-chip .mat-chip-trailing-icon{margin-right:8px;margin-left:0}.mat-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit;overflow:hidden}.mat-chip-list-wrapper{display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;margin:-4px}.mat-chip-list-wrapper input.mat-input-element,.mat-chip-list-wrapper .mat-standard-chip{margin:4px}.mat-chip-list-stacked .mat-chip-list-wrapper{flex-direction:column;align-items:flex-start}.mat-chip-list-stacked .mat-chip-list-wrapper .mat-standard-chip{width:100%}.mat-chip-avatar{border-radius:50%;justify-content:center;align-items:center;display:flex;overflow:hidden;object-fit:cover}input.mat-chip-input{width:150px;margin:4px;flex:1 0 150px}\n"]
                }] }
    ];
    /** @nocollapse */
    MatChipList.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: NgForm, decorators: [{ type: Optional }] },
        { type: FormGroupDirective, decorators: [{ type: Optional }] },
        { type: ErrorStateMatcher },
        { type: NgControl, decorators: [{ type: Optional }, { type: Self }] }
    ]; };
    MatChipList.propDecorators = {
        errorStateMatcher: [{ type: Input }],
        multiple: [{ type: Input }],
        compareWith: [{ type: Input }],
        value: [{ type: Input }],
        required: [{ type: Input }],
        placeholder: [{ type: Input }],
        disabled: [{ type: Input }],
        ariaOrientation: [{ type: Input, args: ['aria-orientation',] }],
        selectable: [{ type: Input }],
        tabIndex: [{ type: Input }],
        change: [{ type: Output }],
        valueChange: [{ type: Output }],
        chips: [{ type: ContentChildren, args: [MatChip, {
                        // We need to use `descendants: true`, because Ivy will no longer match
                        // indirect descendants if it's left as false.
                        descendants: true
                    },] }]
    };
    return MatChipList;
}(_MatChipListMixinBase));
export { MatChipList };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoaXBzL2NoaXAtbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFFZixVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxJQUFJLEVBQ0osaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzNGLE9BQU8sRUFHTCxpQkFBaUIsRUFDakIsZUFBZSxHQUNoQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQ2pFLE9BQU8sRUFBQyxLQUFLLEVBQWMsT0FBTyxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBQzlELE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEQsT0FBTyxFQUFDLE9BQU8sRUFBdUMsTUFBTSxRQUFRLENBQUM7QUFJckUsa0RBQWtEO0FBQ2xELG9CQUFv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QStzQnJEO1NBL3NCWSxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNLZXlNYW5hZ2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7QkFDS1NQQUNFLCBFTkQsIEhPTUV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBTZWxmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBGb3JtR3JvdXBEaXJlY3RpdmUsIE5nQ29udHJvbCwgTmdGb3JtfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBDYW5VcGRhdGVFcnJvclN0YXRlLFxuICBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvcixcbiAgRXJyb3JTdGF0ZU1hdGNoZXIsXG4gIG1peGluRXJyb3JTdGF0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHttZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRoLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWF0Q2hpcCwgTWF0Q2hpcEV2ZW50LCBNYXRDaGlwU2VsZWN0aW9uQ2hhbmdlfSBmcm9tICcuL2NoaXAnO1xuaW1wb3J0IHtNYXRDaGlwVGV4dENvbnRyb2x9IGZyb20gJy4vY2hpcC10ZXh0LWNvbnRyb2wnO1xuXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0Q2hpcExpc3QuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0Q2hpcExpc3RCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgICAgICAgICAgICBwdWJsaWMgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICAgICAgICAgICAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgICAgICAgICAgICAgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sKSB7fVxufVxuY29uc3QgX01hdENoaXBMaXN0TWl4aW5CYXNlOiBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvciAmIHR5cGVvZiBNYXRDaGlwTGlzdEJhc2UgPVxuICAgIG1peGluRXJyb3JTdGF0ZShNYXRDaGlwTGlzdEJhc2UpO1xuXG5cbi8vIEluY3JlYXNpbmcgaW50ZWdlciBmb3IgZ2VuZXJhdGluZyB1bmlxdWUgaWRzIGZvciBjaGlwLWxpc3QgY29tcG9uZW50cy5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG4vKiogQ2hhbmdlIGV2ZW50IG9iamVjdCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgY2hpcCBsaXN0IHZhbHVlIGhhcyBjaGFuZ2VkLiAqL1xuZXhwb3J0IGNsYXNzIE1hdENoaXBMaXN0Q2hhbmdlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIENoaXAgbGlzdCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdENoaXBMaXN0LFxuICAgIC8qKiBWYWx1ZSBvZiB0aGUgY2hpcCBsaXN0IHdoZW4gdGhlIGV2ZW50IHdhcyBlbWl0dGVkLiAqL1xuICAgIHB1YmxpYyB2YWx1ZTogYW55KSB7IH1cbn1cblxuXG4vKipcbiAqIEEgbWF0ZXJpYWwgZGVzaWduIGNoaXBzIGNvbXBvbmVudCAobmFtZWQgQ2hpcExpc3QgZm9yIGl0cyBzaW1pbGFyaXR5IHRvIHRoZSBMaXN0IGNvbXBvbmVudCkuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1jaGlwLWxpc3QnLFxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJtYXQtY2hpcC1saXN0LXdyYXBwZXJcIj48bmctY29udGVudD48L25nLWNvbnRlbnQ+PC9kaXY+YCxcbiAgZXhwb3J0QXM6ICdtYXRDaGlwTGlzdCcsXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ2Rpc2FibGVkID8gbnVsbCA6IF90YWJJbmRleCcsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19hcmlhRGVzY3JpYmVkYnkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ3JvbGUgPyByZXF1aXJlZCA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1pbnZhbGlkXSc6ICdlcnJvclN0YXRlJyxcbiAgICAnW2F0dHIuYXJpYS1tdWx0aXNlbGVjdGFibGVdJzogJ211bHRpcGxlJyxcbiAgICAnW2F0dHIucm9sZV0nOiAncm9sZScsXG4gICAgJ1tjbGFzcy5tYXQtY2hpcC1saXN0LWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtY2hpcC1saXN0LWludmFsaWRdJzogJ2Vycm9yU3RhdGUnLFxuICAgICdbY2xhc3MubWF0LWNoaXAtbGlzdC1yZXF1aXJlZF0nOiAncmVxdWlyZWQnLFxuICAgICdbYXR0ci5hcmlhLW9yaWVudGF0aW9uXSc6ICdhcmlhT3JpZW50YXRpb24nLFxuICAgICdjbGFzcyc6ICdtYXQtY2hpcC1saXN0JyxcbiAgICAnKGZvY3VzKSc6ICdmb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ19ibHVyKCknLFxuICAgICcoa2V5ZG93biknOiAnX2tleWRvd24oJGV2ZW50KScsXG4gICAgJ1tpZF0nOiAnX3VpZCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRGb3JtRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTWF0Q2hpcExpc3R9XSxcbiAgc3R5bGVVcmxzOiBbJ2NoaXBzLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwTGlzdCBleHRlbmRzIF9NYXRDaGlwTGlzdE1peGluQmFzZSBpbXBsZW1lbnRzIE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PixcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsIEFmdGVyQ29udGVudEluaXQsIERvQ2hlY2ssIE9uSW5pdCwgT25EZXN0cm95LCBDYW5VcGRhdGVFcnJvclN0YXRlIHtcbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVhZG9ubHkgY29udHJvbFR5cGU6IHN0cmluZyA9ICdtYXQtY2hpcC1saXN0JztcblxuICAvKipcbiAgICogV2hlbiBhIGNoaXAgaXMgZGVzdHJveWVkLCB3ZSBzdG9yZSB0aGUgaW5kZXggb2YgdGhlIGRlc3Ryb3llZCBjaGlwIHVudGlsIHRoZSBjaGlwc1xuICAgKiBxdWVyeSBsaXN0IG5vdGlmaWVzIGFib3V0IHRoZSB1cGRhdGUuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugd2UgY2Fubm90IGRldGVybWluZSBhblxuICAgKiBhcHByb3ByaWF0ZSBjaGlwIHRoYXQgc2hvdWxkIHJlY2VpdmUgZm9jdXMgdW50aWwgdGhlIGFycmF5IG9mIGNoaXBzIHVwZGF0ZWQgY29tcGxldGVseS5cbiAgICovXG4gIHByaXZhdGUgX2xhc3REZXN0cm95ZWRDaGlwSW5kZXg6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBTdWJqZWN0IHRoYXQgZW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIGZvY3VzIGNoYW5nZXMgaW4gdGhlIGNoaXBzLiAqL1xuICBwcml2YXRlIF9jaGlwRm9jdXNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiB8IG51bGw7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBibHVyIGNoYW5nZXMgaW4gdGhlIGNoaXBzLiAqL1xuICBwcml2YXRlIF9jaGlwQmx1clN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbDtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIHNlbGVjdGlvbiBjaGFuZ2VzIGluIGNoaXBzLiAqL1xuICBwcml2YXRlIF9jaGlwU2VsZWN0aW9uU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gcmVtb3ZlIGNoYW5nZXMgaW4gY2hpcHMuICovXG4gIHByaXZhdGUgX2NoaXBSZW1vdmVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiB8IG51bGw7XG5cbiAgLyoqIFRoZSBjaGlwIGlucHV0IHRvIGFkZCBtb3JlIGNoaXBzICovXG4gIHByb3RlY3RlZCBfY2hpcElucHV0OiBNYXRDaGlwVGV4dENvbnRyb2w7XG5cbiAgLyoqIFVpZCBvZiB0aGUgY2hpcCBsaXN0ICovXG4gIF91aWQ6IHN0cmluZyA9IGBtYXQtY2hpcC1saXN0LSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKiogVGhlIGFyaWEtZGVzY3JpYmVkYnkgYXR0cmlidXRlIG9uIHRoZSBjaGlwIGxpc3QgZm9yIGltcHJvdmVkIGExMXkuICovXG4gIF9hcmlhRGVzY3JpYmVkYnk6IHN0cmluZztcblxuICAvKiogVGFiIGluZGV4IGZvciB0aGUgY2hpcCBsaXN0LiAqL1xuICBfdGFiSW5kZXggPSAwO1xuXG4gIC8qKlxuICAgKiBVc2VyIGRlZmluZWQgdGFiIGluZGV4LlxuICAgKiBXaGVuIGl0IGlzIG5vdCBudWxsLCB1c2UgdXNlciBkZWZpbmVkIHRhYiBpbmRleC4gT3RoZXJ3aXNlIHVzZSBfdGFiSW5kZXhcbiAgICovXG4gIF91c2VyVGFiSW5kZXg6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBUaGUgRm9jdXNLZXlNYW5hZ2VyIHdoaWNoIGhhbmRsZXMgZm9jdXMuICovXG4gIF9rZXlNYW5hZ2VyOiBGb2N1c0tleU1hbmFnZXI8TWF0Q2hpcD47XG5cbiAgLyoqIEZ1bmN0aW9uIHdoZW4gdG91Y2hlZCAqL1xuICBfb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgLyoqIEZ1bmN0aW9uIHdoZW4gY2hhbmdlZCAqL1xuICBfb25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgX3NlbGVjdGlvbk1vZGVsOiBTZWxlY3Rpb25Nb2RlbDxNYXRDaGlwPjtcblxuICAvKiogVGhlIGFycmF5IG9mIHNlbGVjdGVkIGNoaXBzIGluc2lkZSBjaGlwIGxpc3QuICovXG4gIGdldCBzZWxlY3RlZCgpOiBNYXRDaGlwW10gfCBNYXRDaGlwIHtcbiAgICByZXR1cm4gdGhpcy5tdWx0aXBsZSA/IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkIDogdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWRbMF07XG4gIH1cblxuICAvKiogVGhlIEFSSUEgcm9sZSBhcHBsaWVkIHRvIHRoZSBjaGlwIGxpc3QuICovXG4gIGdldCByb2xlKCk6IHN0cmluZyB8IG51bGwgeyByZXR1cm4gdGhpcy5lbXB0eSA/IG51bGwgOiAnbGlzdGJveCc7IH1cblxuICAvKiogQW4gb2JqZWN0IHVzZWQgdG8gY29udHJvbCB3aGVuIGVycm9yIG1lc3NhZ2VzIGFyZSBzaG93bi4gKi9cbiAgQElucHV0KCkgZXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIHNob3VsZCBiZSBhbGxvd2VkIHRvIHNlbGVjdCBtdWx0aXBsZSBjaGlwcy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG11bHRpcGxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fbXVsdGlwbGU7IH1cbiAgc2V0IG11bHRpcGxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fbXVsdGlwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX3N5bmNDaGlwc1N0YXRlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbXVsdGlwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB0byBjb21wYXJlIHRoZSBvcHRpb24gdmFsdWVzIHdpdGggdGhlIHNlbGVjdGVkIHZhbHVlcy4gVGhlIGZpcnN0IGFyZ3VtZW50XG4gICAqIGlzIGEgdmFsdWUgZnJvbSBhbiBvcHRpb24uIFRoZSBzZWNvbmQgaXMgYSB2YWx1ZSBmcm9tIHRoZSBzZWxlY3Rpb24uIEEgYm9vbGVhblxuICAgKiBzaG91bGQgYmUgcmV0dXJuZWQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgY29tcGFyZVdpdGgoKTogKG8xOiBhbnksIG8yOiBhbnkpID0+IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY29tcGFyZVdpdGg7IH1cbiAgc2V0IGNvbXBhcmVXaXRoKGZuOiAobzE6IGFueSwgbzI6IGFueSkgPT4gYm9vbGVhbikge1xuICAgIHRoaXMuX2NvbXBhcmVXaXRoID0gZm47XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsKSB7XG4gICAgICAvLyBBIGRpZmZlcmVudCBjb21wYXJhdG9yIG1lYW5zIHRoZSBzZWxlY3Rpb24gY291bGQgY2hhbmdlLlxuICAgICAgdGhpcy5faW5pdGlhbGl6ZVNlbGVjdGlvbigpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9jb21wYXJlV2l0aCA9IChvMTogYW55LCBvMjogYW55KSA9PiBvMSA9PT0gbzI7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMud3JpdGVWYWx1ZSh2YWx1ZSk7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgfVxuICBwcm90ZWN0ZWQgX3ZhbHVlOiBhbnk7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2NoaXBJbnB1dCA/IHRoaXMuX2NoaXBJbnB1dC5pZCA6IHRoaXMuX3VpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3JlcXVpcmVkOyB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJvdGVjdGVkIF9yZXF1aXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBwbGFjZWhvbGRlcigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9jaGlwSW5wdXQgPyB0aGlzLl9jaGlwSW5wdXQucGxhY2Vob2xkZXIgOiB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgfVxuICBzZXQgcGxhY2Vob2xkZXIodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyID0gdmFsdWU7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG4gIHByb3RlY3RlZCBfcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAvKiogV2hldGhlciBhbnkgY2hpcHMgb3IgdGhlIG1hdENoaXBJbnB1dCBpbnNpZGUgb2YgdGhpcyBjaGlwLWxpc3QgaGFzIGZvY3VzLiAqL1xuICBnZXQgZm9jdXNlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMuX2NoaXBJbnB1dCAmJiB0aGlzLl9jaGlwSW5wdXQuZm9jdXNlZCkgfHwgdGhpcy5faGFzRm9jdXNlZENoaXAoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKCF0aGlzLl9jaGlwSW5wdXQgfHwgdGhpcy5fY2hpcElucHV0LmVtcHR5KSAmJiB0aGlzLmNoaXBzLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBzaG91bGRMYWJlbEZsb2F0KCk6IGJvb2xlYW4geyByZXR1cm4gIXRoaXMuZW1wdHkgfHwgdGhpcy5mb2N1c2VkOyB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5uZ0NvbnRyb2wgPyAhIXRoaXMubmdDb250cm9sLmRpc2FibGVkIDogdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX3N5bmNDaGlwc1N0YXRlKCk7XG4gIH1cbiAgcHJvdGVjdGVkIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBPcmllbnRhdGlvbiBvZiB0aGUgY2hpcCBsaXN0LiAqL1xuICBASW5wdXQoJ2FyaWEtb3JpZW50YXRpb24nKSBhcmlhT3JpZW50YXRpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcgPSAnaG9yaXpvbnRhbCc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoaXMgY2hpcCBsaXN0IGlzIHNlbGVjdGFibGUuIFdoZW4gYSBjaGlwIGxpc3QgaXMgbm90IHNlbGVjdGFibGUsXG4gICAqIHRoZSBzZWxlY3RlZCBzdGF0ZXMgZm9yIGFsbCB0aGUgY2hpcHMgaW5zaWRlIHRoZSBjaGlwIGxpc3QgYXJlIGFsd2F5cyBpZ25vcmVkLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGFibGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9zZWxlY3RhYmxlOyB9XG4gIHNldCBzZWxlY3RhYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2VsZWN0YWJsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAodGhpcy5jaGlwcykge1xuICAgICAgdGhpcy5jaGlwcy5mb3JFYWNoKGNoaXAgPT4gY2hpcC5jaGlwTGlzdFNlbGVjdGFibGUgPSB0aGlzLl9zZWxlY3RhYmxlKTtcbiAgICB9XG4gIH1cbiAgcHJvdGVjdGVkIF9zZWxlY3RhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBzZXQgdGFiSW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3VzZXJUYWJJbmRleCA9IHZhbHVlO1xuICAgIHRoaXMuX3RhYkluZGV4ID0gdmFsdWU7XG4gIH1cblxuICAvKiogQ29tYmluZWQgc3RyZWFtIG9mIGFsbCBvZiB0aGUgY2hpbGQgY2hpcHMnIHNlbGVjdGlvbiBjaGFuZ2UgZXZlbnRzLiAqL1xuICBnZXQgY2hpcFNlbGVjdGlvbkNoYW5nZXMoKTogT2JzZXJ2YWJsZTxNYXRDaGlwU2VsZWN0aW9uQ2hhbmdlPiB7XG4gICAgcmV0dXJuIG1lcmdlKC4uLnRoaXMuY2hpcHMubWFwKGNoaXAgPT4gY2hpcC5zZWxlY3Rpb25DaGFuZ2UpKTtcbiAgfVxuXG4gIC8qKiBDb21iaW5lZCBzdHJlYW0gb2YgYWxsIG9mIHRoZSBjaGlsZCBjaGlwcycgZm9jdXMgY2hhbmdlIGV2ZW50cy4gKi9cbiAgZ2V0IGNoaXBGb2N1c0NoYW5nZXMoKTogT2JzZXJ2YWJsZTxNYXRDaGlwRXZlbnQ+IHtcbiAgICByZXR1cm4gbWVyZ2UoLi4udGhpcy5jaGlwcy5tYXAoY2hpcCA9PiBjaGlwLl9vbkZvY3VzKSk7XG4gIH1cblxuICAvKiogQ29tYmluZWQgc3RyZWFtIG9mIGFsbCBvZiB0aGUgY2hpbGQgY2hpcHMnIGJsdXIgY2hhbmdlIGV2ZW50cy4gKi9cbiAgZ2V0IGNoaXBCbHVyQ2hhbmdlcygpOiBPYnNlcnZhYmxlPE1hdENoaXBFdmVudD4ge1xuICAgIHJldHVybiBtZXJnZSguLi50aGlzLmNoaXBzLm1hcChjaGlwID0+IGNoaXAuX29uQmx1cikpO1xuICB9XG5cbiAgLyoqIENvbWJpbmVkIHN0cmVhbSBvZiBhbGwgb2YgdGhlIGNoaWxkIGNoaXBzJyByZW1vdmUgY2hhbmdlIGV2ZW50cy4gKi9cbiAgZ2V0IGNoaXBSZW1vdmVDaGFuZ2VzKCk6IE9ic2VydmFibGU8TWF0Q2hpcEV2ZW50PiB7XG4gICAgcmV0dXJuIG1lcmdlKC4uLnRoaXMuY2hpcHMubWFwKGNoaXAgPT4gY2hpcC5kZXN0cm95ZWQpKTtcbiAgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdGVkIGNoaXAgbGlzdCB2YWx1ZSBoYXMgYmVlbiBjaGFuZ2VkIGJ5IHRoZSB1c2VyLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcExpc3RDaGFuZ2U+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcExpc3RDaGFuZ2U+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIHJhdyB2YWx1ZSBvZiB0aGUgY2hpcC1saXN0IGNoYW5nZXMuIFRoaXMgaXMgaGVyZSBwcmltYXJpbHlcbiAgICogdG8gZmFjaWxpdGF0ZSB0aGUgdHdvLXdheSBiaW5kaW5nIGZvciB0aGUgYHZhbHVlYCBpbnB1dC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIC8qKiBUaGUgY2hpcCBjb21wb25lbnRzIGNvbnRhaW5lZCB3aXRoaW4gdGhpcyBjaGlwIGxpc3QuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0Q2hpcCwge1xuICAgIC8vIFdlIG5lZWQgdG8gdXNlIGBkZXNjZW5kYW50czogdHJ1ZWAsIGJlY2F1c2UgSXZ5IHdpbGwgbm8gbG9uZ2VyIG1hdGNoXG4gICAgLy8gaW5kaXJlY3QgZGVzY2VuZGFudHMgaWYgaXQncyBsZWZ0IGFzIGZhbHNlLlxuICAgIGRlc2NlbmRhbnRzOiB0cnVlXG4gIH0pIGNoaXBzOiBRdWVyeUxpc3Q8TWF0Q2hpcD47XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBfcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgICAgICAgICAgIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgICAgICAgICAgICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIHB1YmxpYyBuZ0NvbnRyb2w6IE5nQ29udHJvbCkge1xuICAgIHN1cGVyKF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXIsIF9wYXJlbnRGb3JtLCBfcGFyZW50Rm9ybUdyb3VwLCBuZ0NvbnRyb2wpO1xuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgdGhpcy5uZ0NvbnRyb2wudmFsdWVBY2Nlc3NvciA9IHRoaXM7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgRm9jdXNLZXlNYW5hZ2VyPE1hdENoaXA+KHRoaXMuY2hpcHMpXG4gICAgICAud2l0aFdyYXAoKVxuICAgICAgLndpdGhWZXJ0aWNhbE9yaWVudGF0aW9uKClcbiAgICAgIC53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKHRoaXMuX2RpciA/IHRoaXMuX2Rpci52YWx1ZSA6ICdsdHInKTtcblxuICAgIGlmICh0aGlzLl9kaXIpIHtcbiAgICAgIHRoaXMuX2Rpci5jaGFuZ2VcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAgIC5zdWJzY3JpYmUoZGlyID0+IHRoaXMuX2tleU1hbmFnZXIud2l0aEhvcml6b250YWxPcmllbnRhdGlvbihkaXIpKTtcbiAgICB9XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnRhYk91dC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fYWxsb3dGb2N1c0VzY2FwZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gV2hlbiB0aGUgbGlzdCBjaGFuZ2VzLCByZS1zdWJzY3JpYmVcbiAgICB0aGlzLmNoaXBzLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgLy8gU2luY2UgdGhpcyBoYXBwZW5zIGFmdGVyIHRoZSBjb250ZW50IGhhcyBiZWVuXG4gICAgICAgIC8vIGNoZWNrZWQsIHdlIG5lZWQgdG8gZGVmZXIgaXQgdG8gdGhlIG5leHQgdGljay5cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc3luY0NoaXBzU3RhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3Jlc2V0Q2hpcHMoKTtcblxuICAgICAgLy8gUmVzZXQgY2hpcHMgc2VsZWN0ZWQvZGVzZWxlY3RlZCBzdGF0dXNcbiAgICAgIHRoaXMuX2luaXRpYWxpemVTZWxlY3Rpb24oKTtcblxuICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHdlIG5lZWQgdG8gdXBkYXRlIG91ciB0YWIgaW5kZXhcbiAgICAgIHRoaXMuX3VwZGF0ZVRhYkluZGV4KCk7XG5cbiAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB3ZSBoYXZlIGEgZGVzdHJveWVkIGNoaXAgYW5kIG5lZWQgdG8gcmVmb2N1c1xuICAgICAgdGhpcy5fdXBkYXRlRm9jdXNGb3JEZXN0cm95ZWRDaGlwcygpO1xuXG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxNYXRDaGlwPih0aGlzLm11bHRpcGxlLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIHJlLWV2YWx1YXRlIHRoaXMgb24gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZSwgYmVjYXVzZSB0aGVyZSBhcmUgc29tZVxuICAgICAgLy8gZXJyb3IgdHJpZ2dlcnMgdGhhdCB3ZSBjYW4ndCBzdWJzY3JpYmUgdG8gKGUuZy4gcGFyZW50IGZvcm0gc3VibWlzc2lvbnMpLiBUaGlzIG1lYW5zXG4gICAgICAvLyB0aGF0IHdoYXRldmVyIGxvZ2ljIGlzIGluIGhlcmUgaGFzIHRvIGJlIHN1cGVyIGxlYW4gb3Igd2UgcmlzayBkZXN0cm95aW5nIHRoZSBwZXJmb3JtYW5jZS5cbiAgICAgIHRoaXMudXBkYXRlRXJyb3JTdGF0ZSgpO1xuXG4gICAgICBpZiAodGhpcy5uZ0NvbnRyb2wuZGlzYWJsZWQgIT09IHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSAhIXRoaXMubmdDb250cm9sLmRpc2FibGVkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcblxuICAgIHRoaXMuX2Ryb3BTdWJzY3JpcHRpb25zKCk7XG4gIH1cblxuXG4gIC8qKiBBc3NvY2lhdGVzIGFuIEhUTUwgaW5wdXQgZWxlbWVudCB3aXRoIHRoaXMgY2hpcCBsaXN0LiAqL1xuICByZWdpc3RlcklucHV0KGlucHV0RWxlbWVudDogTWF0Q2hpcFRleHRDb250cm9sKTogdm9pZCB7XG4gICAgdGhpcy5fY2hpcElucHV0ID0gaW5wdXRFbGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0RGVzY3JpYmVkQnlJZHMoaWRzOiBzdHJpbmdbXSkgeyB0aGlzLl9hcmlhRGVzY3JpYmVkYnkgPSBpZHMuam9pbignICcpOyB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2hpcHMpIHtcbiAgICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUodmFsdWUsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgb25Db250YWluZXJDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICghdGhpcy5fb3JpZ2luYXRlc0Zyb21DaGlwKGV2ZW50KSkge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBmaXJzdCBub24tZGlzYWJsZWQgY2hpcCBpbiB0aGlzIGNoaXAgbGlzdCwgb3IgdGhlIGFzc29jaWF0ZWQgaW5wdXQgd2hlbiB0aGVyZVxuICAgKiBhcmUgbm8gZWxpZ2libGUgY2hpcHMuXG4gICAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBBUklBIHNheXMgdGhpcyBzaG91bGQgZm9jdXMgdGhlIGZpcnN0IGBzZWxlY3RlZGAgY2hpcCBpZiBhbnkgYXJlIHNlbGVjdGVkLlxuICAgIC8vIEZvY3VzIG9uIGZpcnN0IGVsZW1lbnQgaWYgdGhlcmUncyBubyBjaGlwSW5wdXQgaW5zaWRlIGNoaXAtbGlzdFxuICAgIGlmICh0aGlzLl9jaGlwSW5wdXQgJiYgdGhpcy5fY2hpcElucHV0LmZvY3VzZWQpIHtcbiAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9IGVsc2UgaWYgKHRoaXMuY2hpcHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZm9jdXNJbnB1dChvcHRpb25zKTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQXR0ZW1wdCB0byBmb2N1cyBhbiBpbnB1dCBpZiB3ZSBoYXZlIG9uZS4gKi9cbiAgX2ZvY3VzSW5wdXQob3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIGlmICh0aGlzLl9jaGlwSW5wdXQpIHtcbiAgICAgIHRoaXMuX2NoaXBJbnB1dC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUGFzcyBldmVudHMgdG8gdGhlIGtleWJvYXJkIG1hbmFnZXIuIEF2YWlsYWJsZSBoZXJlIGZvciB0ZXN0cy5cbiAgICovXG4gIF9rZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgLy8gSWYgdGhleSBhcmUgb24gYW4gZW1wdHkgaW5wdXQgYW5kIGhpdCBiYWNrc3BhY2UsIGZvY3VzIHRoZSBsYXN0IGNoaXBcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gQkFDS1NQQUNFICYmIHRoaXMuX2lzSW5wdXRFbXB0eSh0YXJnZXQpKSB7XG4gICAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldExhc3RJdGVtQWN0aXZlKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0ICYmIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21hdC1jaGlwJykpIHtcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBIT01FKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IEVORCkge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldExhc3RJdGVtQWN0aXZlKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDaGVjayB0aGUgdGFiIGluZGV4IGFzIHlvdSBzaG91bGQgbm90IGJlIGFsbG93ZWQgdG8gZm9jdXMgYW4gZW1wdHkgbGlzdC5cbiAgICovXG4gIHByb3RlY3RlZCBfdXBkYXRlVGFiSW5kZXgoKTogdm9pZCB7XG4gICAgLy8gSWYgd2UgaGF2ZSAwIGNoaXBzLCB3ZSBzaG91bGQgbm90IGFsbG93IGtleWJvYXJkIGZvY3VzXG4gICAgdGhpcy5fdGFiSW5kZXggPSB0aGlzLl91c2VyVGFiSW5kZXggfHwgKHRoaXMuY2hpcHMubGVuZ3RoID09PSAwID8gLTEgOiAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgYW1vdW50IG9mIGNoaXBzIGNoYW5nZWQsIHdlIG5lZWQgdG8gdXBkYXRlIHRoZVxuICAgKiBrZXkgbWFuYWdlciBzdGF0ZSBhbmQgZm9jdXMgdGhlIG5leHQgY2xvc2VzdCBjaGlwLlxuICAgKi9cbiAgcHJvdGVjdGVkIF91cGRhdGVGb2N1c0ZvckRlc3Ryb3llZENoaXBzKCkge1xuICAgIC8vIE1vdmUgZm9jdXMgdG8gdGhlIGNsb3Nlc3QgY2hpcC4gSWYgbm8gb3RoZXIgY2hpcHMgcmVtYWluLCBmb2N1cyB0aGUgY2hpcC1saXN0IGl0c2VsZi5cbiAgICBpZiAodGhpcy5fbGFzdERlc3Ryb3llZENoaXBJbmRleCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jaGlwcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgbmV3Q2hpcEluZGV4ID0gTWF0aC5taW4odGhpcy5fbGFzdERlc3Ryb3llZENoaXBJbmRleCwgdGhpcy5jaGlwcy5sZW5ndGggLSAxKTtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKG5ld0NoaXBJbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fbGFzdERlc3Ryb3llZENoaXBJbmRleCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogVXRpbGl0eSB0byBlbnN1cmUgYWxsIGluZGV4ZXMgYXJlIHZhbGlkLlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IHRvIGJlIGNoZWNrZWQuXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGluZGV4IGlzIHZhbGlkIGZvciBvdXIgbGlzdCBvZiBjaGlwcy5cbiAgICovXG4gIHByaXZhdGUgX2lzVmFsaWRJbmRleChpbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLmNoaXBzLmxlbmd0aDtcbiAgfVxuXG4gIHByaXZhdGUgX2lzSW5wdXRFbXB0eShlbGVtZW50OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2lucHV0Jykge1xuICAgICAgbGV0IGlucHV0ID0gZWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgcmV0dXJuICFpbnB1dC52YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBfc2V0U2VsZWN0aW9uQnlWYWx1ZSh2YWx1ZTogYW55LCBpc1VzZXJJbnB1dDogYm9vbGVhbiA9IHRydWUpIHtcbiAgICB0aGlzLl9jbGVhclNlbGVjdGlvbigpO1xuICAgIHRoaXMuY2hpcHMuZm9yRWFjaChjaGlwID0+IGNoaXAuZGVzZWxlY3QoKSk7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHZhbHVlLmZvckVhY2goY3VycmVudFZhbHVlID0+IHRoaXMuX3NlbGVjdFZhbHVlKGN1cnJlbnRWYWx1ZSwgaXNVc2VySW5wdXQpKTtcbiAgICAgIHRoaXMuX3NvcnRWYWx1ZXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29ycmVzcG9uZGluZ0NoaXAgPSB0aGlzLl9zZWxlY3RWYWx1ZSh2YWx1ZSwgaXNVc2VySW5wdXQpO1xuXG4gICAgICAvLyBTaGlmdCBmb2N1cyB0byB0aGUgYWN0aXZlIGl0ZW0uIE5vdGUgdGhhdCB3ZSBzaG91bGRuJ3QgZG8gdGhpcyBpbiBtdWx0aXBsZVxuICAgICAgLy8gbW9kZSwgYmVjYXVzZSB3ZSBkb24ndCBrbm93IHdoYXQgY2hpcCB0aGUgdXNlciBpbnRlcmFjdGVkIHdpdGggbGFzdC5cbiAgICAgIGlmIChjb3JyZXNwb25kaW5nQ2hpcCkge1xuICAgICAgICBpZiAoaXNVc2VySW5wdXQpIHtcbiAgICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0oY29ycmVzcG9uZGluZ0NoaXApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGFuZCBzZWxlY3RzIHRoZSBjaGlwIGJhc2VkIG9uIGl0cyB2YWx1ZS5cbiAgICogQHJldHVybnMgQ2hpcCB0aGF0IGhhcyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZS5cbiAgICovXG4gIHByaXZhdGUgX3NlbGVjdFZhbHVlKHZhbHVlOiBhbnksIGlzVXNlcklucHV0OiBib29sZWFuID0gdHJ1ZSk6IE1hdENoaXAgfCB1bmRlZmluZWQge1xuXG4gICAgY29uc3QgY29ycmVzcG9uZGluZ0NoaXAgPSB0aGlzLmNoaXBzLmZpbmQoY2hpcCA9PiB7XG4gICAgICByZXR1cm4gY2hpcC52YWx1ZSAhPSBudWxsICYmIHRoaXMuX2NvbXBhcmVXaXRoKGNoaXAudmFsdWUsICB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICBpZiAoY29ycmVzcG9uZGluZ0NoaXApIHtcbiAgICAgIGlzVXNlcklucHV0ID8gY29ycmVzcG9uZGluZ0NoaXAuc2VsZWN0VmlhSW50ZXJhY3Rpb24oKSA6IGNvcnJlc3BvbmRpbmdDaGlwLnNlbGVjdCgpO1xuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0KGNvcnJlc3BvbmRpbmdDaGlwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29ycmVzcG9uZGluZ0NoaXA7XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplU2VsZWN0aW9uKCk6IHZvaWQge1xuICAgIC8vIERlZmVyIHNldHRpbmcgdGhlIHZhbHVlIGluIG9yZGVyIHRvIGF2b2lkIHRoZSBcIkV4cHJlc3Npb25cbiAgICAvLyBoYXMgY2hhbmdlZCBhZnRlciBpdCB3YXMgY2hlY2tlZFwiIGVycm9ycyBmcm9tIEFuZ3VsYXIuXG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5uZ0NvbnRyb2wgfHwgdGhpcy5fdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fc2V0U2VsZWN0aW9uQnlWYWx1ZSh0aGlzLm5nQ29udHJvbCA/IHRoaXMubmdDb250cm9sLnZhbHVlIDogdGhpcy5fdmFsdWUsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc2VsZWN0cyBldmVyeSBjaGlwIGluIHRoZSBsaXN0LlxuICAgKiBAcGFyYW0gc2tpcCBDaGlwIHRoYXQgc2hvdWxkIG5vdCBiZSBkZXNlbGVjdGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2xlYXJTZWxlY3Rpb24oc2tpcD86IE1hdENoaXApOiB2b2lkIHtcbiAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xuICAgIHRoaXMuY2hpcHMuZm9yRWFjaChjaGlwID0+IHtcbiAgICAgIGlmIChjaGlwICE9PSBza2lwKSB7XG4gICAgICAgIGNoaXAuZGVzZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogU29ydHMgdGhlIG1vZGVsIHZhbHVlcywgZW5zdXJpbmcgdGhhdCB0aGV5IGtlZXAgdGhlIHNhbWVcbiAgICogb3JkZXIgdGhhdCB0aGV5IGhhdmUgaW4gdGhlIHBhbmVsLlxuICAgKi9cbiAgcHJpdmF0ZSBfc29ydFZhbHVlcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fbXVsdGlwbGUpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNsZWFyKCk7XG5cbiAgICAgIHRoaXMuY2hpcHMuZm9yRWFjaChjaGlwID0+IHtcbiAgICAgICAgaWYgKGNoaXAuc2VsZWN0ZWQpIHtcbiAgICAgICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3QoY2hpcCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFbWl0cyBjaGFuZ2UgZXZlbnQgdG8gc2V0IHRoZSBtb2RlbCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfcHJvcGFnYXRlQ2hhbmdlcyhmYWxsYmFja1ZhbHVlPzogYW55KTogdm9pZCB7XG4gICAgbGV0IHZhbHVlVG9FbWl0OiBhbnkgPSBudWxsO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zZWxlY3RlZCkpIHtcbiAgICAgIHZhbHVlVG9FbWl0ID0gdGhpcy5zZWxlY3RlZC5tYXAoY2hpcCA9PiBjaGlwLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWVUb0VtaXQgPSB0aGlzLnNlbGVjdGVkID8gdGhpcy5zZWxlY3RlZC52YWx1ZSA6IGZhbGxiYWNrVmFsdWU7XG4gICAgfVxuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWVUb0VtaXQ7XG4gICAgdGhpcy5jaGFuZ2UuZW1pdChuZXcgTWF0Q2hpcExpc3RDaGFuZ2UodGhpcywgdmFsdWVUb0VtaXQpKTtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodmFsdWVUb0VtaXQpO1xuICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlVG9FbWl0KTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBXaGVuIGJsdXJyZWQsIG1hcmsgdGhlIGZpZWxkIGFzIHRvdWNoZWQgd2hlbiBmb2N1cyBtb3ZlZCBvdXRzaWRlIHRoZSBjaGlwIGxpc3QuICovXG4gIF9ibHVyKCkge1xuICAgIGlmICghdGhpcy5faGFzRm9jdXNlZENoaXAoKSkge1xuICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKC0xKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGlmICh0aGlzLl9jaGlwSW5wdXQpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUncyBhIGNoaXAgaW5wdXQsIHdlIHNob3VsZCBjaGVjayB3aGV0aGVyIHRoZSBmb2N1cyBtb3ZlZCB0byBjaGlwIGlucHV0LlxuICAgICAgICAvLyBJZiB0aGUgZm9jdXMgaXMgbm90IG1vdmVkIHRvIGNoaXAgaW5wdXQsIG1hcmsgdGhlIGZpZWxkIGFzIHRvdWNoZWQuIElmIHRoZSBmb2N1cyBtb3ZlZFxuICAgICAgICAvLyB0byBjaGlwIGlucHV0LCBkbyBub3RoaW5nLlxuICAgICAgICAvLyBUaW1lb3V0IGlzIG5lZWRlZCB0byB3YWl0IGZvciB0aGUgZm9jdXMoKSBldmVudCB0cmlnZ2VyIG9uIGNoaXAgaW5wdXQuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5mb2N1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXJrQXNUb3VjaGVkKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gY2hpcCBpbnB1dCwgdGhlbiBtYXJrIHRoZSBmaWVsZCBhcyB0b3VjaGVkLlxuICAgICAgICB0aGlzLl9tYXJrQXNUb3VjaGVkKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIE1hcmsgdGhlIGZpZWxkIGFzIHRvdWNoZWQgKi9cbiAgX21hcmtBc1RvdWNoZWQoKSB7XG4gICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGB0YWJpbmRleGAgZnJvbSB0aGUgY2hpcCBsaXN0IGFuZCByZXNldHMgaXQgYmFjayBhZnRlcndhcmRzLCBhbGxvd2luZyB0aGVcbiAgICogdXNlciB0byB0YWIgb3V0IG9mIGl0LiBUaGlzIHByZXZlbnRzIHRoZSBsaXN0IGZyb20gY2FwdHVyaW5nIGZvY3VzIGFuZCByZWRpcmVjdGluZ1xuICAgKiBpdCBiYWNrIHRvIHRoZSBmaXJzdCBjaGlwLCBjcmVhdGluZyBhIGZvY3VzIHRyYXAsIGlmIGl0IHVzZXIgdHJpZXMgdG8gdGFiIGF3YXkuXG4gICAqL1xuICBfYWxsb3dGb2N1c0VzY2FwZSgpIHtcbiAgICBpZiAodGhpcy5fdGFiSW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLl90YWJJbmRleCA9IC0xO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5fdGFiSW5kZXggPSB0aGlzLl91c2VyVGFiSW5kZXggfHwgMDtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9yZXNldENoaXBzKCkge1xuICAgIHRoaXMuX2Ryb3BTdWJzY3JpcHRpb25zKCk7XG4gICAgdGhpcy5fbGlzdGVuVG9DaGlwc0ZvY3VzKCk7XG4gICAgdGhpcy5fbGlzdGVuVG9DaGlwc1NlbGVjdGlvbigpO1xuICAgIHRoaXMuX2xpc3RlblRvQ2hpcHNSZW1vdmVkKCk7XG4gIH1cblxuICBwcml2YXRlIF9kcm9wU3Vic2NyaXB0aW9ucygpIHtcbiAgICBpZiAodGhpcy5fY2hpcEZvY3VzU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9jaGlwRm9jdXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuX2NoaXBGb2N1c1N1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2NoaXBCbHVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9jaGlwQmx1clN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fY2hpcEJsdXJTdWJzY3JpcHRpb24gPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9jaGlwU2VsZWN0aW9uU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9jaGlwU2VsZWN0aW9uU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLl9jaGlwU2VsZWN0aW9uU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY2hpcFJlbW92ZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fY2hpcFJlbW92ZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fY2hpcFJlbW92ZVN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqIExpc3RlbnMgdG8gdXNlci1nZW5lcmF0ZWQgc2VsZWN0aW9uIGV2ZW50cyBvbiBlYWNoIGNoaXAuICovXG4gIHByaXZhdGUgX2xpc3RlblRvQ2hpcHNTZWxlY3Rpb24oKTogdm9pZCB7XG4gICAgdGhpcy5fY2hpcFNlbGVjdGlvblN1YnNjcmlwdGlvbiA9IHRoaXMuY2hpcFNlbGVjdGlvbkNoYW5nZXMuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGV2ZW50LnNvdXJjZS5zZWxlY3RlZFxuICAgICAgICA/IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdChldmVudC5zb3VyY2UpXG4gICAgICAgIDogdGhpcy5fc2VsZWN0aW9uTW9kZWwuZGVzZWxlY3QoZXZlbnQuc291cmNlKTtcblxuICAgICAgLy8gRm9yIHNpbmdsZSBzZWxlY3Rpb24gY2hpcCBsaXN0LCBtYWtlIHN1cmUgdGhlIGRlc2VsZWN0ZWQgdmFsdWUgaXMgdW5zZWxlY3RlZC5cbiAgICAgIGlmICghdGhpcy5tdWx0aXBsZSkge1xuICAgICAgICB0aGlzLmNoaXBzLmZvckVhY2goY2hpcCA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9zZWxlY3Rpb25Nb2RlbC5pc1NlbGVjdGVkKGNoaXApICYmIGNoaXAuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIGNoaXAuZGVzZWxlY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnQuaXNVc2VySW5wdXQpIHtcbiAgICAgICAgdGhpcy5fcHJvcGFnYXRlQ2hhbmdlcygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIExpc3RlbnMgdG8gdXNlci1nZW5lcmF0ZWQgc2VsZWN0aW9uIGV2ZW50cyBvbiBlYWNoIGNoaXAuICovXG4gIHByaXZhdGUgX2xpc3RlblRvQ2hpcHNGb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGlwRm9jdXNTdWJzY3JpcHRpb24gPSB0aGlzLmNoaXBGb2N1c0NoYW5nZXMuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGxldCBjaGlwSW5kZXg6IG51bWJlciA9IHRoaXMuY2hpcHMudG9BcnJheSgpLmluZGV4T2YoZXZlbnQuY2hpcCk7XG5cbiAgICAgIGlmICh0aGlzLl9pc1ZhbGlkSW5kZXgoY2hpcEluZGV4KSkge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oY2hpcEluZGV4KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NoaXBCbHVyU3Vic2NyaXB0aW9uID0gdGhpcy5jaGlwQmx1ckNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2JsdXIoKTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2xpc3RlblRvQ2hpcHNSZW1vdmVkKCk6IHZvaWQge1xuICAgIHRoaXMuX2NoaXBSZW1vdmVTdWJzY3JpcHRpb24gPSB0aGlzLmNoaXBSZW1vdmVDaGFuZ2VzLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBjb25zdCBjaGlwID0gZXZlbnQuY2hpcDtcbiAgICAgIGNvbnN0IGNoaXBJbmRleCA9IHRoaXMuY2hpcHMudG9BcnJheSgpLmluZGV4T2YoZXZlbnQuY2hpcCk7XG5cbiAgICAgIC8vIEluIGNhc2UgdGhlIGNoaXAgdGhhdCB3aWxsIGJlIHJlbW92ZWQgaXMgY3VycmVudGx5IGZvY3VzZWQsIHdlIHRlbXBvcmFyaWx5IHN0b3JlXG4gICAgICAvLyB0aGUgaW5kZXggaW4gb3JkZXIgdG8gYmUgYWJsZSB0byBkZXRlcm1pbmUgYW4gYXBwcm9wcmlhdGUgc2libGluZyBjaGlwIHRoYXQgd2lsbFxuICAgICAgLy8gcmVjZWl2ZSBmb2N1cy5cbiAgICAgIGlmICh0aGlzLl9pc1ZhbGlkSW5kZXgoY2hpcEluZGV4KSAmJiBjaGlwLl9oYXNGb2N1cykge1xuICAgICAgICB0aGlzLl9sYXN0RGVzdHJveWVkQ2hpcEluZGV4ID0gY2hpcEluZGV4O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIGFuIGV2ZW50IGNvbWVzIGZyb20gaW5zaWRlIGEgY2hpcCBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9vcmlnaW5hdGVzRnJvbUNoaXAoZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiB7XG4gICAgbGV0IGN1cnJlbnRFbGVtZW50ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcblxuICAgIHdoaWxlIChjdXJyZW50RWxlbWVudCAmJiBjdXJyZW50RWxlbWVudCAhPT0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSB7XG4gICAgICBpZiAoY3VycmVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXQtY2hpcCcpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50RWxlbWVudCA9IGN1cnJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIGFueSBvZiB0aGUgY2hpcHMgaXMgZm9jdXNlZC4gKi9cbiAgcHJpdmF0ZSBfaGFzRm9jdXNlZENoaXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpcHMuc29tZShjaGlwID0+IGNoaXAuX2hhc0ZvY3VzKTtcbiAgfVxuXG4gIC8qKiBTeW5jcyB0aGUgbGlzdCdzIHN0YXRlIHdpdGggdGhlIGluZGl2aWR1YWwgY2hpcHMuICovXG4gIHByaXZhdGUgX3N5bmNDaGlwc1N0YXRlKCkge1xuICAgIGlmICh0aGlzLmNoaXBzKSB7XG4gICAgICB0aGlzLmNoaXBzLmZvckVhY2goY2hpcCA9PiB7XG4gICAgICAgIGNoaXAuZGlzYWJsZWQgPSB0aGlzLl9kaXNhYmxlZDtcbiAgICAgICAgY2hpcC5fY2hpcExpc3RNdWx0aXBsZSA9IHRoaXMubXVsdGlwbGU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbXVsdGlwbGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlcXVpcmVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2VsZWN0YWJsZTogQm9vbGVhbklucHV0O1xufVxuIl19