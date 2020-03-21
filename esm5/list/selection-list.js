/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends, __values } from "tslib";
import { FocusKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { A, DOWN_ARROW, END, ENTER, hasModifierKey, HOME, SPACE, UP_ARROW, } from '@angular/cdk/keycodes';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, Input, Output, QueryList, ViewChild, ViewEncapsulation, isDevMode, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatLine, mixinDisableRipple, setLines, } from '@angular/material/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { MatListAvatarCssMatStyler, MatListIconCssMatStyler } from './list';
/** @docs-private */
var MatSelectionListBase = /** @class */ (function () {
    function MatSelectionListBase() {
    }
    return MatSelectionListBase;
}());
var _MatSelectionListMixinBase = mixinDisableRipple(MatSelectionListBase);
/** @docs-private */
var MatListOptionBase = /** @class */ (function () {
    function MatListOptionBase() {
    }
    return MatListOptionBase;
}());
var _MatListOptionMixinBase = mixinDisableRipple(MatListOptionBase);
/** @docs-private */
export var MAT_SELECTION_LIST_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MatSelectionList; }),
    multi: true
};
/** Change event that is being fired whenever the selected state of an option changes. */
var MatSelectionListChange = /** @class */ (function () {
    function MatSelectionListChange(
    /** Reference to the selection list that emitted the event. */
    source, 
    /** Reference to the option that has been changed. */
    option) {
        this.source = source;
        this.option = option;
    }
    return MatSelectionListChange;
}());
export { MatSelectionListChange };
/**
 * Component for list-options of selection-list. Each list-option can automatically
 * generate a checkbox and can put current item into the selectionModel of selection-list
 * if the current item is selected.
 */
var MatListOption = /** @class */ (function (_super) {
    __extends(MatListOption, _super);
    function MatListOption(_element, _changeDetector, 
    /** @docs-private */
    selectionList) {
        var _this = _super.call(this) || this;
        _this._element = _element;
        _this._changeDetector = _changeDetector;
        _this.selectionList = selectionList;
        _this._selected = false;
        _this._disabled = false;
        _this._hasFocus = false;
        /** Whether the label should appear before or after the checkbox. Defaults to 'after' */
        _this.checkboxPosition = 'after';
        /**
         * This is set to true after the first OnChanges cycle so we don't clear the value of `selected`
         * in the first cycle.
         */
        _this._inputsInitialized = false;
        return _this;
    }
    Object.defineProperty(MatListOption.prototype, "color", {
        /** Theme color of the list option. This sets the color of the checkbox. */
        get: function () { return this._color || this.selectionList.color; },
        set: function (newValue) { this._color = newValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatListOption.prototype, "value", {
        /** Value of the option */
        get: function () { return this._value; },
        set: function (newValue) {
            if (this.selected && newValue !== this.value && this._inputsInitialized) {
                this.selected = false;
            }
            this._value = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatListOption.prototype, "disabled", {
        /** Whether the option is disabled. */
        get: function () { return this._disabled || (this.selectionList && this.selectionList.disabled); },
        set: function (value) {
            var newValue = coerceBooleanProperty(value);
            if (newValue !== this._disabled) {
                this._disabled = newValue;
                this._changeDetector.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatListOption.prototype, "selected", {
        /** Whether the option is selected. */
        get: function () { return this.selectionList.selectedOptions.isSelected(this); },
        set: function (value) {
            var isSelected = coerceBooleanProperty(value);
            if (isSelected !== this._selected) {
                this._setSelected(isSelected);
                this.selectionList._reportValueChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    MatListOption.prototype.ngOnInit = function () {
        var _this = this;
        var list = this.selectionList;
        if (list._value && list._value.some(function (value) { return list.compareWith(value, _this._value); })) {
            this._setSelected(true);
        }
        var wasSelected = this._selected;
        // List options that are selected at initialization can't be reported properly to the form
        // control. This is because it takes some time until the selection-list knows about all
        // available options. Also it can happen that the ControlValueAccessor has an initial value
        // that should be used instead. Deferring the value change report to the next tick ensures
        // that the form control value is not being overwritten.
        Promise.resolve().then(function () {
            if (_this._selected || wasSelected) {
                _this.selected = true;
                _this._changeDetector.markForCheck();
            }
        });
        this._inputsInitialized = true;
    };
    MatListOption.prototype.ngAfterContentInit = function () {
        setLines(this._lines, this._element);
    };
    MatListOption.prototype.ngOnDestroy = function () {
        var _this = this;
        if (this.selected) {
            // We have to delay this until the next tick in order
            // to avoid changed after checked errors.
            Promise.resolve().then(function () {
                _this.selected = false;
            });
        }
        var hadFocus = this._hasFocus;
        var newActiveItem = this.selectionList._removeOptionFromList(this);
        // Only move focus if this option was focused at the time it was destroyed.
        if (hadFocus && newActiveItem) {
            newActiveItem.focus();
        }
    };
    /** Toggles the selection state of the option. */
    MatListOption.prototype.toggle = function () {
        this.selected = !this.selected;
    };
    /** Allows for programmatic focusing of the option. */
    MatListOption.prototype.focus = function () {
        this._element.nativeElement.focus();
    };
    /**
     * Returns the list item's text label. Implemented as a part of the FocusKeyManager.
     * @docs-private
     */
    MatListOption.prototype.getLabel = function () {
        return this._text ? (this._text.nativeElement.textContent || '') : '';
    };
    /** Whether this list item should show a ripple effect when clicked. */
    MatListOption.prototype._isRippleDisabled = function () {
        return this.disabled || this.disableRipple || this.selectionList.disableRipple;
    };
    MatListOption.prototype._handleClick = function () {
        if (!this.disabled && (this.selectionList.multiple || !this.selected)) {
            this.toggle();
            // Emit a change event if the selected state of the option changed through user interaction.
            this.selectionList._emitChangeEvent(this);
        }
    };
    MatListOption.prototype._handleFocus = function () {
        this.selectionList._setFocusedOption(this);
        this._hasFocus = true;
    };
    MatListOption.prototype._handleBlur = function () {
        this.selectionList._onTouched();
        this._hasFocus = false;
    };
    /** Retrieves the DOM element of the component host. */
    MatListOption.prototype._getHostElement = function () {
        return this._element.nativeElement;
    };
    /** Sets the selected state of the option. Returns whether the value has changed. */
    MatListOption.prototype._setSelected = function (selected) {
        if (selected === this._selected) {
            return false;
        }
        this._selected = selected;
        if (selected) {
            this.selectionList.selectedOptions.select(this);
        }
        else {
            this.selectionList.selectedOptions.deselect(this);
        }
        this._changeDetector.markForCheck();
        return true;
    };
    /**
     * Notifies Angular that the option needs to be checked in the next change detection run. Mainly
     * used to trigger an update of the list option if the disabled state of the selection list
     * changed.
     */
    MatListOption.prototype._markForCheck = function () {
        this._changeDetector.markForCheck();
    };
    MatListOption.decorators = [
        { type: Component, args: [{
                    selector: 'mat-list-option',
                    exportAs: 'matListOption',
                    inputs: ['disableRipple'],
                    host: {
                        'role': 'option',
                        'class': 'mat-list-item mat-list-option mat-focus-indicator',
                        '(focus)': '_handleFocus()',
                        '(blur)': '_handleBlur()',
                        '(click)': '_handleClick()',
                        '[class.mat-list-item-disabled]': 'disabled',
                        '[class.mat-list-item-with-avatar]': '_avatar || _icon',
                        // Manually set the "primary" or "warn" class if the color has been explicitly
                        // set to "primary" or "warn". The pseudo checkbox picks up these classes for
                        // its theme.
                        '[class.mat-primary]': 'color === "primary"',
                        // Even though accent is the default, we need to set this class anyway, because the  list might
                        // be placed inside a parent that has one of the other colors with a higher specificity.
                        '[class.mat-accent]': 'color !== "primary" && color !== "warn"',
                        '[class.mat-warn]': 'color === "warn"',
                        '[class.mat-list-single-selected-option]': 'selected && !selectionList.multiple',
                        '[attr.aria-selected]': 'selected',
                        '[attr.aria-disabled]': 'disabled',
                        '[attr.tabindex]': '-1',
                    },
                    template: "<div class=\"mat-list-item-content\"\n  [class.mat-list-item-content-reverse]=\"checkboxPosition == 'after'\">\n\n  <div mat-ripple\n    class=\"mat-list-item-ripple\"\n    [matRippleTrigger]=\"_getHostElement()\"\n    [matRippleDisabled]=\"_isRippleDisabled()\"></div>\n\n  <mat-pseudo-checkbox\n    *ngIf=\"selectionList.multiple\"\n    [state]=\"selected ? 'checked' : 'unchecked'\"\n    [disabled]=\"disabled\"></mat-pseudo-checkbox>\n\n  <div class=\"mat-list-text\" #text><ng-content></ng-content></div>\n\n  <ng-content select=\"[mat-list-avatar], [mat-list-icon], [matListAvatar], [matListIcon]\">\n  </ng-content>\n\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    MatListOption.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: MatSelectionList, decorators: [{ type: Inject, args: [forwardRef(function () { return MatSelectionList; }),] }] }
    ]; };
    MatListOption.propDecorators = {
        _avatar: [{ type: ContentChild, args: [MatListAvatarCssMatStyler,] }],
        _icon: [{ type: ContentChild, args: [MatListIconCssMatStyler,] }],
        _lines: [{ type: ContentChildren, args: [MatLine, { descendants: true },] }],
        _text: [{ type: ViewChild, args: ['text',] }],
        checkboxPosition: [{ type: Input }],
        color: [{ type: Input }],
        value: [{ type: Input }],
        disabled: [{ type: Input }],
        selected: [{ type: Input }]
    };
    return MatListOption;
}(_MatListOptionMixinBase));
export { MatListOption };
/**
 * Material Design list component where each item is a selectable option. Behaves as a listbox.
 */
var MatSelectionList = /** @class */ (function (_super) {
    __extends(MatSelectionList, _super);
    function MatSelectionList(_element, 
    // @breaking-change 11.0.0 Remove `tabIndex` parameter.
    tabIndex, _changeDetector) {
        var _this = _super.call(this) || this;
        _this._element = _element;
        _this._changeDetector = _changeDetector;
        _this._multiple = true;
        _this._contentInitialized = false;
        /** Emits a change event whenever the selected state of an option changes. */
        _this.selectionChange = new EventEmitter();
        /**
         * Tabindex of the selection list.
         * @breaking-change 11.0.0 Remove `tabIndex` input.
         */
        _this.tabIndex = 0;
        /** Theme color of the selection list. This sets the checkbox color for all list options. */
        _this.color = 'accent';
        /**
         * Function used for comparing an option against the selected value when determining which
         * options should appear as selected. The first argument is the value of an options. The second
         * one is a value from the selected value. A boolean must be returned.
         */
        _this.compareWith = function (a1, a2) { return a1 === a2; };
        _this._disabled = false;
        /** The currently selected options. */
        _this.selectedOptions = new SelectionModel(_this._multiple);
        /** The tabindex of the selection list. */
        _this._tabIndex = -1;
        /** View to model callback that should be called whenever the selected options change. */
        _this._onChange = function (_) { };
        /** Emits when the list has been destroyed. */
        _this._destroyed = new Subject();
        /** View to model callback that should be called if the list or its options lost focus. */
        _this._onTouched = function () { };
        return _this;
    }
    Object.defineProperty(MatSelectionList.prototype, "disabled", {
        /** Whether the selection list is disabled. */
        get: function () { return this._disabled; },
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
            // The `MatSelectionList` and `MatListOption` are using the `OnPush` change detection
            // strategy. Therefore the options will not check for any changes if the `MatSelectionList`
            // changed its state. Since we know that a change to `disabled` property of the list affects
            // the state of the options, we manually mark each option for check.
            this._markOptionsForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSelectionList.prototype, "multiple", {
        /** Whether selection is limited to one or multiple items (default multiple). */
        get: function () { return this._multiple; },
        set: function (value) {
            var newValue = coerceBooleanProperty(value);
            if (newValue !== this._multiple) {
                if (isDevMode() && this._contentInitialized) {
                    throw new Error('Cannot change `multiple` mode of mat-selection-list after initialization.');
                }
                this._multiple = newValue;
                this.selectedOptions = new SelectionModel(this._multiple, this.selectedOptions.selected);
            }
        },
        enumerable: true,
        configurable: true
    });
    MatSelectionList.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._contentInitialized = true;
        this._keyManager = new FocusKeyManager(this.options)
            .withWrap()
            .withTypeAhead()
            // Allow disabled items to be focusable. For accessibility reasons, there must be a way for
            // screenreader users, that allows reading the different options of the list.
            .skipPredicate(function () { return false; })
            .withAllowedModifierKeys(['shiftKey']);
        if (this._value) {
            this._setOptionsFromValues(this._value);
        }
        // If the user attempts to tab out of the selection list, allow focus to escape.
        this._keyManager.tabOut.pipe(takeUntil(this._destroyed)).subscribe(function () {
            _this._allowFocusEscape();
        });
        // When the number of options change, update the tabindex of the selection list.
        this.options.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(function () {
            _this._updateTabIndex();
        });
        // Sync external changes to the model back to the options.
        this.selectedOptions.changed.pipe(takeUntil(this._destroyed)).subscribe(function (event) {
            var e_1, _a, e_2, _b;
            if (event.added) {
                try {
                    for (var _c = __values(event.added), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var item = _d.value;
                        item.selected = true;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            if (event.removed) {
                try {
                    for (var _e = __values(event.removed), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var item = _f.value;
                        item.selected = false;
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        });
    };
    MatSelectionList.prototype.ngOnChanges = function (changes) {
        var disableRippleChanges = changes['disableRipple'];
        var colorChanges = changes['color'];
        if ((disableRippleChanges && !disableRippleChanges.firstChange) ||
            (colorChanges && !colorChanges.firstChange)) {
            this._markOptionsForCheck();
        }
    };
    MatSelectionList.prototype.ngOnDestroy = function () {
        this._destroyed.next();
        this._destroyed.complete();
        this._isDestroyed = true;
    };
    /** Focuses the selection list. */
    MatSelectionList.prototype.focus = function (options) {
        this._element.nativeElement.focus(options);
    };
    /** Selects all of the options. */
    MatSelectionList.prototype.selectAll = function () {
        this._setAllOptionsSelected(true);
    };
    /** Deselects all of the options. */
    MatSelectionList.prototype.deselectAll = function () {
        this._setAllOptionsSelected(false);
    };
    /** Sets the focused option of the selection-list. */
    MatSelectionList.prototype._setFocusedOption = function (option) {
        this._keyManager.updateActiveItem(option);
    };
    /**
     * Removes an option from the selection list and updates the active item.
     * @returns Currently-active item.
     */
    MatSelectionList.prototype._removeOptionFromList = function (option) {
        var optionIndex = this._getOptionIndex(option);
        if (optionIndex > -1 && this._keyManager.activeItemIndex === optionIndex) {
            // Check whether the option is the last item
            if (optionIndex > 0) {
                this._keyManager.updateActiveItem(optionIndex - 1);
            }
            else if (optionIndex === 0 && this.options.length > 1) {
                this._keyManager.updateActiveItem(Math.min(optionIndex + 1, this.options.length - 1));
            }
        }
        return this._keyManager.activeItem;
    };
    /** Passes relevant key presses to our key manager. */
    MatSelectionList.prototype._keydown = function (event) {
        var keyCode = event.keyCode;
        var manager = this._keyManager;
        var previousFocusIndex = manager.activeItemIndex;
        var hasModifier = hasModifierKey(event);
        switch (keyCode) {
            case SPACE:
            case ENTER:
                if (!hasModifier && !manager.isTyping()) {
                    this._toggleFocusedOption();
                    // Always prevent space from scrolling the page since the list has focus
                    event.preventDefault();
                }
                break;
            case HOME:
            case END:
                if (!hasModifier) {
                    keyCode === HOME ? manager.setFirstItemActive() : manager.setLastItemActive();
                    event.preventDefault();
                }
                break;
            default:
                // The "A" key gets special treatment, because it's used for the "select all" functionality.
                if (keyCode === A && this.multiple && hasModifierKey(event, 'ctrlKey') &&
                    !manager.isTyping()) {
                    this.options.find(function (option) { return !option.selected; }) ? this.selectAll() : this.deselectAll();
                    event.preventDefault();
                }
                else {
                    manager.onKeydown(event);
                }
        }
        if (this.multiple && (keyCode === UP_ARROW || keyCode === DOWN_ARROW) && event.shiftKey &&
            manager.activeItemIndex !== previousFocusIndex) {
            this._toggleFocusedOption();
        }
    };
    /** Reports a value change to the ControlValueAccessor */
    MatSelectionList.prototype._reportValueChange = function () {
        // Stop reporting value changes after the list has been destroyed. This avoids
        // cases where the list might wrongly reset its value once it is removed, but
        // the form control is still live.
        if (this.options && !this._isDestroyed) {
            var value = this._getSelectedOptionValues();
            this._onChange(value);
            this._value = value;
        }
    };
    /** Emits a change event if the selected state of an option changed. */
    MatSelectionList.prototype._emitChangeEvent = function (option) {
        this.selectionChange.emit(new MatSelectionListChange(this, option));
    };
    /**
     * When the selection list is focused, we want to move focus to an option within the list. Do this
     * by setting the appropriate option to be active.
     */
    MatSelectionList.prototype._onFocus = function () {
        var activeIndex = this._keyManager.activeItemIndex;
        if (!activeIndex || (activeIndex === -1)) {
            // If there is no active index, set focus to the first option.
            this._keyManager.setFirstItemActive();
        }
        else {
            // Otherwise, set focus to the active option.
            this._keyManager.setActiveItem(activeIndex);
        }
    };
    /** Implemented as part of ControlValueAccessor. */
    MatSelectionList.prototype.writeValue = function (values) {
        this._value = values;
        if (this.options) {
            this._setOptionsFromValues(values || []);
        }
    };
    /** Implemented as a part of ControlValueAccessor. */
    MatSelectionList.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    /** Implemented as part of ControlValueAccessor. */
    MatSelectionList.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    /** Implemented as part of ControlValueAccessor. */
    MatSelectionList.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    /** Sets the selected options based on the specified values. */
    MatSelectionList.prototype._setOptionsFromValues = function (values) {
        var _this = this;
        this.options.forEach(function (option) { return option._setSelected(false); });
        values.forEach(function (value) {
            var correspondingOption = _this.options.find(function (option) {
                // Skip options that are already in the model. This allows us to handle cases
                // where the same primitive value is selected multiple times.
                return option.selected ? false : _this.compareWith(option.value, value);
            });
            if (correspondingOption) {
                correspondingOption._setSelected(true);
            }
        });
    };
    /** Returns the values of the selected options. */
    MatSelectionList.prototype._getSelectedOptionValues = function () {
        return this.options.filter(function (option) { return option.selected; }).map(function (option) { return option.value; });
    };
    /** Toggles the state of the currently focused option if enabled. */
    MatSelectionList.prototype._toggleFocusedOption = function () {
        var focusedIndex = this._keyManager.activeItemIndex;
        if (focusedIndex != null && this._isValidIndex(focusedIndex)) {
            var focusedOption = this.options.toArray()[focusedIndex];
            if (focusedOption && !focusedOption.disabled && (this._multiple || !focusedOption.selected)) {
                focusedOption.toggle();
                // Emit a change event because the focused option changed its state through user
                // interaction.
                this._emitChangeEvent(focusedOption);
            }
        }
    };
    /**
     * Sets the selected state on all of the options
     * and emits an event if anything changed.
     */
    MatSelectionList.prototype._setAllOptionsSelected = function (isSelected) {
        // Keep track of whether anything changed, because we only want to
        // emit the changed event when something actually changed.
        var hasChanged = false;
        this.options.forEach(function (option) {
            if (option._setSelected(isSelected)) {
                hasChanged = true;
            }
        });
        if (hasChanged) {
            this._reportValueChange();
        }
    };
    /**
     * Utility to ensure all indexes are valid.
     * @param index The index to be checked.
     * @returns True if the index is valid for our list of options.
     */
    MatSelectionList.prototype._isValidIndex = function (index) {
        return index >= 0 && index < this.options.length;
    };
    /** Returns the index of the specified list option. */
    MatSelectionList.prototype._getOptionIndex = function (option) {
        return this.options.toArray().indexOf(option);
    };
    /** Marks all the options to be checked in the next change detection run. */
    MatSelectionList.prototype._markOptionsForCheck = function () {
        if (this.options) {
            this.options.forEach(function (option) { return option._markForCheck(); });
        }
    };
    /**
     * Removes the tabindex from the selection list and resets it back afterwards, allowing the user
     * to tab out of it. This prevents the list from capturing focus and redirecting it back within
     * the list, creating a focus trap if it user tries to tab away.
     */
    MatSelectionList.prototype._allowFocusEscape = function () {
        var _this = this;
        this._tabIndex = -1;
        setTimeout(function () {
            _this._tabIndex = 0;
            _this._changeDetector.markForCheck();
        });
    };
    /** Updates the tabindex based upon if the selection list is empty. */
    MatSelectionList.prototype._updateTabIndex = function () {
        this._tabIndex = (this.options.length === 0) ? -1 : 0;
    };
    MatSelectionList.decorators = [
        { type: Component, args: [{
                    selector: 'mat-selection-list',
                    exportAs: 'matSelectionList',
                    inputs: ['disableRipple'],
                    host: {
                        'role': 'listbox',
                        'class': 'mat-selection-list mat-list-base',
                        '(focus)': '_onFocus()',
                        '(blur)': '_onTouched()',
                        '(keydown)': '_keydown($event)',
                        '[attr.aria-multiselectable]': 'multiple',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[attr.tabindex]': '_tabIndex',
                    },
                    template: '<ng-content></ng-content>',
                    encapsulation: ViewEncapsulation.None,
                    providers: [MAT_SELECTION_LIST_VALUE_ACCESSOR],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".mat-subheader{display:flex;box-sizing:border-box;padding:16px;align-items:center}.mat-list-base .mat-subheader{margin:0}.mat-list-base{padding-top:8px;display:block;-webkit-tap-highlight-color:transparent}.mat-list-base .mat-subheader{height:48px;line-height:16px}.mat-list-base .mat-subheader:first-child{margin-top:-8px}.mat-list-base .mat-list-item,.mat-list-base .mat-list-option{display:block;height:48px;-webkit-tap-highlight-color:transparent;width:100%;padding:0;position:relative}.mat-list-base .mat-list-item .mat-list-item-content,.mat-list-base .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base .mat-list-item .mat-list-item-content-reverse,.mat-list-base .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base .mat-list-item .mat-list-item-ripple,.mat-list-base .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar,.mat-list-base .mat-list-option.mat-list-item-with-avatar{height:56px}.mat-list-base .mat-list-item.mat-2-line,.mat-list-base .mat-list-option.mat-2-line{height:72px}.mat-list-base .mat-list-item.mat-3-line,.mat-list-base .mat-list-option.mat-3-line{height:88px}.mat-list-base .mat-list-item.mat-multi-line,.mat-list-base .mat-list-option.mat-multi-line{height:auto}.mat-list-base .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base .mat-list-item .mat-list-text,.mat-list-base .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base .mat-list-item .mat-list-text>*,.mat-list-base .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base .mat-list-item .mat-list-text:empty,.mat-list-base .mat-list-option .mat-list-text:empty{display:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base .mat-list-item .mat-list-avatar,.mat-list-base .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%;object-fit:cover}.mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:72px;width:calc(100% - 72px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:72px}.mat-list-base .mat-list-item .mat-list-icon,.mat-list-base .mat-list-option .mat-list-icon{flex-shrink:0;width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:64px;width:calc(100% - 64px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:64px}.mat-list-base .mat-list-item .mat-divider,.mat-list-base .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base .mat-list-item .mat-divider,[dir=rtl] .mat-list-base .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-list-base[dense]{padding-top:4px;display:block}.mat-list-base[dense] .mat-subheader{height:40px;line-height:8px}.mat-list-base[dense] .mat-subheader:first-child{margin-top:-4px}.mat-list-base[dense] .mat-list-item,.mat-list-base[dense] .mat-list-option{display:block;height:40px;-webkit-tap-highlight-color:transparent;width:100%;padding:0;position:relative}.mat-list-base[dense] .mat-list-item .mat-list-item-content,.mat-list-base[dense] .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base[dense] .mat-list-item .mat-list-item-content-reverse,.mat-list-base[dense] .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base[dense] .mat-list-item .mat-list-item-ripple,.mat-list-base[dense] .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar{height:48px}.mat-list-base[dense] .mat-list-item.mat-2-line,.mat-list-base[dense] .mat-list-option.mat-2-line{height:60px}.mat-list-base[dense] .mat-list-item.mat-3-line,.mat-list-base[dense] .mat-list-option.mat-3-line{height:76px}.mat-list-base[dense] .mat-list-item.mat-multi-line,.mat-list-base[dense] .mat-list-option.mat-multi-line{height:auto}.mat-list-base[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base[dense] .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base[dense] .mat-list-item .mat-list-text,.mat-list-base[dense] .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-text>*,.mat-list-base[dense] .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base[dense] .mat-list-item .mat-list-text:empty,.mat-list-base[dense] .mat-list-option .mat-list-text:empty{display:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base[dense] .mat-list-item .mat-list-avatar,.mat-list-base[dense] .mat-list-option .mat-list-avatar{flex-shrink:0;width:36px;height:36px;border-radius:50%;object-fit:cover}.mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:68px;width:calc(100% - 68px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:68px}.mat-list-base[dense] .mat-list-item .mat-list-icon,.mat-list-base[dense] .mat-list-option .mat-list-icon{flex-shrink:0;width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:60px;width:calc(100% - 60px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:60px}.mat-list-base[dense] .mat-list-item .mat-divider,.mat-list-base[dense] .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-divider,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base[dense] .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-nav-list a{text-decoration:none;color:inherit}.mat-nav-list .mat-list-item{cursor:pointer;outline:none}mat-action-list button{background:none;color:inherit;border:none;font:inherit;outline:inherit;-webkit-tap-highlight-color:transparent;text-align:left}[dir=rtl] mat-action-list button{text-align:right}mat-action-list button::-moz-focus-inner{border:0}mat-action-list .mat-list-item{cursor:pointer;outline:inherit}.mat-list-option:not(.mat-list-item-disabled){cursor:pointer;outline:none}.mat-list-item-disabled{pointer-events:none}.cdk-high-contrast-active .mat-list-item-disabled{opacity:.5}.cdk-high-contrast-active :host .mat-list-item-disabled{opacity:.5}.cdk-high-contrast-active .mat-selection-list:focus{outline-style:dotted}.cdk-high-contrast-active .mat-list-option:hover,.cdk-high-contrast-active .mat-list-option:focus,.cdk-high-contrast-active .mat-nav-list .mat-list-item:hover,.cdk-high-contrast-active .mat-nav-list .mat-list-item:focus,.cdk-high-contrast-active mat-action-list .mat-list-item:hover,.cdk-high-contrast-active mat-action-list .mat-list-item:focus{outline:dotted 1px}.cdk-high-contrast-active .mat-list-single-selected-option::after{content:\"\";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}.cdk-high-contrast-active [dir=rtl] .mat-list-single-selected-option::after{right:auto;left:16px}@media(hover: none){.mat-list-option:not(.mat-list-item-disabled):hover,.mat-nav-list .mat-list-item:not(.mat-list-item-disabled):hover,.mat-action-list .mat-list-item:not(.mat-list-item-disabled):hover{background:none}}\n"]
                }] }
    ];
    /** @nocollapse */
    MatSelectionList.ctorParameters = function () { return [
        { type: ElementRef },
        { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
        { type: ChangeDetectorRef }
    ]; };
    MatSelectionList.propDecorators = {
        options: [{ type: ContentChildren, args: [MatListOption, { descendants: true },] }],
        selectionChange: [{ type: Output }],
        tabIndex: [{ type: Input }],
        color: [{ type: Input }],
        compareWith: [{ type: Input }],
        disabled: [{ type: Input }],
        multiple: [{ type: Input }]
    };
    return MatSelectionList;
}(_MatSelectionListMixinBase));
export { MatSelectionList };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLWxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC9zZWxlY3Rpb24tbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFrQixlQUFlLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRSxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUNMLENBQUMsRUFDRCxVQUFVLEVBQ1YsR0FBRyxFQUNILEtBQUssRUFDTCxjQUFjLEVBQ2QsSUFBSSxFQUNKLEtBQUssRUFDTCxRQUFRLEdBQ1QsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBRUwsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFJTCxNQUFNLEVBQ04sU0FBUyxFQUVULFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBR0wsT0FBTyxFQUNQLGtCQUFrQixFQUNsQixRQUFRLEdBRVQsTUFBTSx3QkFBd0IsQ0FBQztBQUVoQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLHlCQUF5QixFQUFFLHVCQUF1QixFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRzFFLG9CQUFvQjtBQUNwQjtJ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QUFFLHFCQUFxQjt3QkFDN0MsaUJBQWlCLEVBQUUsV0FBVztxQkFDL0I7b0JBQ0QsUUFBUSxFQUFFLDJCQUEyQjtvQkFFckMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLFNBQVMsRUFBRSxDQUFDLGlDQUFpQyxDQUFDO29CQUM5QyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7aUJBQ2hEOzs7O2dCQXJUQyxVQUFVOzZDQTJZUCxTQUFTLFNBQUMsVUFBVTtnQkEvWXZCLGlCQUFpQjs7OzBCQW1VaEIsZUFBZSxTQUFDLGFBQWEsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7a0NBR2xELE1BQU07MkJBT04sS0FBSzt3QkFHTCxLQUFLOzhCQU9MLEtBQUs7MkJBR0wsS0FBSzsyQkFjTCxLQUFLOztJQW1WUix1QkFBQztDQUFBLEFBclpELENBb0JzQywwQkFBMEIsR0FpWS9EO1NBallZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzYWJsZU9wdGlvbiwgRm9jdXNLZXlNYW5hZ2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIEEsXG4gIERPV05fQVJST1csXG4gIEVORCxcbiAgRU5URVIsXG4gIGhhc01vZGlmaWVyS2V5LFxuICBIT01FLFxuICBTUEFDRSxcbiAgVVBfQVJST1csXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgaXNEZXZNb2RlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBDYW5EaXNhYmxlUmlwcGxlQ3RvcixcbiAgTWF0TGluZSxcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBzZXRMaW5lcyxcbiAgVGhlbWVQYWxldHRlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcblxuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRoLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyLCBNYXRMaXN0SWNvbkNzc01hdFN0eWxlcn0gZnJvbSAnLi9saXN0JztcblxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0U2VsZWN0aW9uTGlzdEJhc2Uge31cbmNvbnN0IF9NYXRTZWxlY3Rpb25MaXN0TWl4aW5CYXNlOiBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmIHR5cGVvZiBNYXRTZWxlY3Rpb25MaXN0QmFzZSA9XG4gICAgbWl4aW5EaXNhYmxlUmlwcGxlKE1hdFNlbGVjdGlvbkxpc3RCYXNlKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdExpc3RPcHRpb25CYXNlIHt9XG5jb25zdCBfTWF0TGlzdE9wdGlvbk1peGluQmFzZTogQ2FuRGlzYWJsZVJpcHBsZUN0b3IgJiB0eXBlb2YgTWF0TGlzdE9wdGlvbkJhc2UgPVxuICAgIG1peGluRGlzYWJsZVJpcHBsZShNYXRMaXN0T3B0aW9uQmFzZSk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX1NFTEVDVElPTl9MSVNUX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRTZWxlY3Rpb25MaXN0KSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKiBDaGFuZ2UgZXZlbnQgdGhhdCBpcyBiZWluZyBmaXJlZCB3aGVuZXZlciB0aGUgc2VsZWN0ZWQgc3RhdGUgb2YgYW4gb3B0aW9uIGNoYW5nZXMuICovXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0aW9uTGlzdENoYW5nZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIHNlbGVjdGlvbiBsaXN0IHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0U2VsZWN0aW9uTGlzdCxcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBvcHRpb24gdGhhdCBoYXMgYmVlbiBjaGFuZ2VkLiAqL1xuICAgIHB1YmxpYyBvcHRpb246IE1hdExpc3RPcHRpb24pIHt9XG59XG5cbi8qKlxuICogQ29tcG9uZW50IGZvciBsaXN0LW9wdGlvbnMgb2Ygc2VsZWN0aW9uLWxpc3QuIEVhY2ggbGlzdC1vcHRpb24gY2FuIGF1dG9tYXRpY2FsbHlcbiAqIGdlbmVyYXRlIGEgY2hlY2tib3ggYW5kIGNhbiBwdXQgY3VycmVudCBpdGVtIGludG8gdGhlIHNlbGVjdGlvbk1vZGVsIG9mIHNlbGVjdGlvbi1saXN0XG4gKiBpZiB0aGUgY3VycmVudCBpdGVtIGlzIHNlbGVjdGVkLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtbGlzdC1vcHRpb24nLFxuICBleHBvcnRBczogJ21hdExpc3RPcHRpb24nLFxuICBpbnB1dHM6IFsnZGlzYWJsZVJpcHBsZSddLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnb3B0aW9uJyxcbiAgICAnY2xhc3MnOiAnbWF0LWxpc3QtaXRlbSBtYXQtbGlzdC1vcHRpb24gbWF0LWZvY3VzLWluZGljYXRvcicsXG4gICAgJyhmb2N1cyknOiAnX2hhbmRsZUZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX2hhbmRsZUJsdXIoKScsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCknLFxuICAgICdbY2xhc3MubWF0LWxpc3QtaXRlbS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LWxpc3QtaXRlbS13aXRoLWF2YXRhcl0nOiAnX2F2YXRhciB8fCBfaWNvbicsXG4gICAgLy8gTWFudWFsbHkgc2V0IHRoZSBcInByaW1hcnlcIiBvciBcIndhcm5cIiBjbGFzcyBpZiB0aGUgY29sb3IgaGFzIGJlZW4gZXhwbGljaXRseVxuICAgIC8vIHNldCB0byBcInByaW1hcnlcIiBvciBcIndhcm5cIi4gVGhlIHBzZXVkbyBjaGVja2JveCBwaWNrcyB1cCB0aGVzZSBjbGFzc2VzIGZvclxuICAgIC8vIGl0cyB0aGVtZS5cbiAgICAnW2NsYXNzLm1hdC1wcmltYXJ5XSc6ICdjb2xvciA9PT0gXCJwcmltYXJ5XCInLFxuICAgIC8vIEV2ZW4gdGhvdWdoIGFjY2VudCBpcyB0aGUgZGVmYXVsdCwgd2UgbmVlZCB0byBzZXQgdGhpcyBjbGFzcyBhbnl3YXksIGJlY2F1c2UgdGhlICBsaXN0IG1pZ2h0XG4gICAgLy8gYmUgcGxhY2VkIGluc2lkZSBhIHBhcmVudCB0aGF0IGhhcyBvbmUgb2YgdGhlIG90aGVyIGNvbG9ycyB3aXRoIGEgaGlnaGVyIHNwZWNpZmljaXR5LlxuICAgICdbY2xhc3MubWF0LWFjY2VudF0nOiAnY29sb3IgIT09IFwicHJpbWFyeVwiICYmIGNvbG9yICE9PSBcIndhcm5cIicsXG4gICAgJ1tjbGFzcy5tYXQtd2Fybl0nOiAnY29sb3IgPT09IFwid2FyblwiJyxcbiAgICAnW2NsYXNzLm1hdC1saXN0LXNpbmdsZS1zZWxlY3RlZC1vcHRpb25dJzogJ3NlbGVjdGVkICYmICFzZWxlY3Rpb25MaXN0Lm11bHRpcGxlJyxcbiAgICAnW2F0dHIuYXJpYS1zZWxlY3RlZF0nOiAnc2VsZWN0ZWQnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICctMScsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnbGlzdC1vcHRpb24uaHRtbCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMaXN0T3B0aW9uIGV4dGVuZHMgX01hdExpc3RPcHRpb25NaXhpbkJhc2UgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT25Jbml0LCBGb2N1c2FibGVPcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2FuRGlzYWJsZVJpcHBsZSB7XG4gIHByaXZhdGUgX3NlbGVjdGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2hhc0ZvY3VzID0gZmFsc2U7XG5cbiAgQENvbnRlbnRDaGlsZChNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyKSBfYXZhdGFyOiBNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyO1xuICBAQ29udGVudENoaWxkKE1hdExpc3RJY29uQ3NzTWF0U3R5bGVyKSBfaWNvbjogTWF0TGlzdEljb25Dc3NNYXRTdHlsZXI7XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TGluZSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2xpbmVzOiBRdWVyeUxpc3Q8TWF0TGluZT47XG5cbiAgLyoqIERPTSBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIGl0ZW0ncyB0ZXh0LiAqL1xuICBAVmlld0NoaWxkKCd0ZXh0JykgX3RleHQ6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBhcHBlYXIgYmVmb3JlIG9yIGFmdGVyIHRoZSBjaGVja2JveC4gRGVmYXVsdHMgdG8gJ2FmdGVyJyAqL1xuICBASW5wdXQoKSBjaGVja2JveFBvc2l0aW9uOiAnYmVmb3JlJyB8ICdhZnRlcicgPSAnYWZ0ZXInO1xuXG4gIC8qKiBUaGVtZSBjb2xvciBvZiB0aGUgbGlzdCBvcHRpb24uIFRoaXMgc2V0cyB0aGUgY29sb3Igb2YgdGhlIGNoZWNrYm94LiAqL1xuICBASW5wdXQoKVxuICBnZXQgY29sb3IoKTogVGhlbWVQYWxldHRlIHsgcmV0dXJuIHRoaXMuX2NvbG9yIHx8IHRoaXMuc2VsZWN0aW9uTGlzdC5jb2xvcjsgfVxuICBzZXQgY29sb3IobmV3VmFsdWU6IFRoZW1lUGFsZXR0ZSkgeyB0aGlzLl9jb2xvciA9IG5ld1ZhbHVlOyB9XG4gIHByaXZhdGUgX2NvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgc2V0IHRvIHRydWUgYWZ0ZXIgdGhlIGZpcnN0IE9uQ2hhbmdlcyBjeWNsZSBzbyB3ZSBkb24ndCBjbGVhciB0aGUgdmFsdWUgb2YgYHNlbGVjdGVkYFxuICAgKiBpbiB0aGUgZmlyc3QgY3ljbGUuXG4gICAqL1xuICBwcml2YXRlIF9pbnB1dHNJbml0aWFsaXplZCA9IGZhbHNlO1xuICAvKiogVmFsdWUgb2YgdGhlIG9wdGlvbiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMuX3ZhbHVlOyB9XG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWQgJiYgbmV3VmFsdWUgIT09IHRoaXMudmFsdWUgJiYgdGhpcy5faW5wdXRzSW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICB9XG4gIHByaXZhdGUgX3ZhbHVlOiBhbnk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG9wdGlvbiBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5fZGlzYWJsZWQgfHwgKHRoaXMuc2VsZWN0aW9uTGlzdCAmJiB0aGlzLnNlbGVjdGlvbkxpc3QuZGlzYWJsZWQpOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYW55KSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fZGlzYWJsZWQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBvcHRpb24gaXMgc2VsZWN0ZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc2VsZWN0aW9uTGlzdC5zZWxlY3RlZE9wdGlvbnMuaXNTZWxlY3RlZCh0aGlzKTsgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChpc1NlbGVjdGVkICE9PSB0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2V0U2VsZWN0ZWQoaXNTZWxlY3RlZCk7XG4gICAgICB0aGlzLnNlbGVjdGlvbkxpc3QuX3JlcG9ydFZhbHVlQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgICAgICAgICAgICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE1hdFNlbGVjdGlvbkxpc3QpKSBwdWJsaWMgc2VsZWN0aW9uTGlzdDogTWF0U2VsZWN0aW9uTGlzdCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5zZWxlY3Rpb25MaXN0O1xuXG4gICAgaWYgKGxpc3QuX3ZhbHVlICYmIGxpc3QuX3ZhbHVlLnNvbWUodmFsdWUgPT4gbGlzdC5jb21wYXJlV2l0aCh2YWx1ZSwgdGhpcy5fdmFsdWUpKSkge1xuICAgICAgdGhpcy5fc2V0U2VsZWN0ZWQodHJ1ZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd2FzU2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3RlZDtcblxuICAgIC8vIExpc3Qgb3B0aW9ucyB0aGF0IGFyZSBzZWxlY3RlZCBhdCBpbml0aWFsaXphdGlvbiBjYW4ndCBiZSByZXBvcnRlZCBwcm9wZXJseSB0byB0aGUgZm9ybVxuICAgIC8vIGNvbnRyb2wuIFRoaXMgaXMgYmVjYXVzZSBpdCB0YWtlcyBzb21lIHRpbWUgdW50aWwgdGhlIHNlbGVjdGlvbi1saXN0IGtub3dzIGFib3V0IGFsbFxuICAgIC8vIGF2YWlsYWJsZSBvcHRpb25zLiBBbHNvIGl0IGNhbiBoYXBwZW4gdGhhdCB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaGFzIGFuIGluaXRpYWwgdmFsdWVcbiAgICAvLyB0aGF0IHNob3VsZCBiZSB1c2VkIGluc3RlYWQuIERlZmVycmluZyB0aGUgdmFsdWUgY2hhbmdlIHJlcG9ydCB0byB0aGUgbmV4dCB0aWNrIGVuc3VyZXNcbiAgICAvLyB0aGF0IHRoZSBmb3JtIGNvbnRyb2wgdmFsdWUgaXMgbm90IGJlaW5nIG92ZXJ3cml0dGVuLlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkIHx8IHdhc1NlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl9pbnB1dHNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgc2V0TGluZXModGhpcy5fbGluZXMsIHRoaXMuX2VsZW1lbnQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgIC8vIFdlIGhhdmUgdG8gZGVsYXkgdGhpcyB1bnRpbCB0aGUgbmV4dCB0aWNrIGluIG9yZGVyXG4gICAgICAvLyB0byBhdm9pZCBjaGFuZ2VkIGFmdGVyIGNoZWNrZWQgZXJyb3JzLlxuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGhhZEZvY3VzID0gdGhpcy5faGFzRm9jdXM7XG4gICAgY29uc3QgbmV3QWN0aXZlSXRlbSA9IHRoaXMuc2VsZWN0aW9uTGlzdC5fcmVtb3ZlT3B0aW9uRnJvbUxpc3QodGhpcyk7XG5cbiAgICAvLyBPbmx5IG1vdmUgZm9jdXMgaWYgdGhpcyBvcHRpb24gd2FzIGZvY3VzZWQgYXQgdGhlIHRpbWUgaXQgd2FzIGRlc3Ryb3llZC5cbiAgICBpZiAoaGFkRm9jdXMgJiYgbmV3QWN0aXZlSXRlbSkge1xuICAgICAgbmV3QWN0aXZlSXRlbS5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSBzZWxlY3Rpb24gc3RhdGUgb2YgdGhlIG9wdGlvbi4gKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0ZWQgPSAhdGhpcy5zZWxlY3RlZDtcbiAgfVxuXG4gIC8qKiBBbGxvd3MgZm9yIHByb2dyYW1tYXRpYyBmb2N1c2luZyBvZiB0aGUgb3B0aW9uLiAqL1xuICBmb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBsaXN0IGl0ZW0ncyB0ZXh0IGxhYmVsLiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgdGhlIEZvY3VzS2V5TWFuYWdlci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0TGFiZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RleHQgPyAodGhpcy5fdGV4dC5uYXRpdmVFbGVtZW50LnRleHRDb250ZW50IHx8ICcnKSA6ICcnO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBsaXN0IGl0ZW0gc2hvdWxkIHNob3cgYSByaXBwbGUgZWZmZWN0IHdoZW4gY2xpY2tlZC4gKi9cbiAgX2lzUmlwcGxlRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlUmlwcGxlIHx8IHRoaXMuc2VsZWN0aW9uTGlzdC5kaXNhYmxlUmlwcGxlO1xuICB9XG5cbiAgX2hhbmRsZUNsaWNrKCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiAodGhpcy5zZWxlY3Rpb25MaXN0Lm11bHRpcGxlIHx8ICF0aGlzLnNlbGVjdGVkKSkge1xuICAgICAgdGhpcy50b2dnbGUoKTtcblxuICAgICAgLy8gRW1pdCBhIGNoYW5nZSBldmVudCBpZiB0aGUgc2VsZWN0ZWQgc3RhdGUgb2YgdGhlIG9wdGlvbiBjaGFuZ2VkIHRocm91Z2ggdXNlciBpbnRlcmFjdGlvbi5cbiAgICAgIHRoaXMuc2VsZWN0aW9uTGlzdC5fZW1pdENoYW5nZUV2ZW50KHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVGb2N1cygpIHtcbiAgICB0aGlzLnNlbGVjdGlvbkxpc3QuX3NldEZvY3VzZWRPcHRpb24odGhpcyk7XG4gICAgdGhpcy5faGFzRm9jdXMgPSB0cnVlO1xuICB9XG5cbiAgX2hhbmRsZUJsdXIoKSB7XG4gICAgdGhpcy5zZWxlY3Rpb25MaXN0Ll9vblRvdWNoZWQoKTtcbiAgICB0aGlzLl9oYXNGb2N1cyA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIFJldHJpZXZlcyB0aGUgRE9NIGVsZW1lbnQgb2YgdGhlIGNvbXBvbmVudCBob3N0LiAqL1xuICBfZ2V0SG9zdEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgc2VsZWN0ZWQgc3RhdGUgb2YgdGhlIG9wdGlvbi4gUmV0dXJucyB3aGV0aGVyIHRoZSB2YWx1ZSBoYXMgY2hhbmdlZC4gKi9cbiAgX3NldFNlbGVjdGVkKHNlbGVjdGVkOiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgaWYgKHNlbGVjdGVkID09PSB0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuX3NlbGVjdGVkID0gc2VsZWN0ZWQ7XG5cbiAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uTGlzdC5zZWxlY3RlZE9wdGlvbnMuc2VsZWN0KHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkxpc3Quc2VsZWN0ZWRPcHRpb25zLmRlc2VsZWN0KHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vdGlmaWVzIEFuZ3VsYXIgdGhhdCB0aGUgb3B0aW9uIG5lZWRzIHRvIGJlIGNoZWNrZWQgaW4gdGhlIG5leHQgY2hhbmdlIGRldGVjdGlvbiBydW4uIE1haW5seVxuICAgKiB1c2VkIHRvIHRyaWdnZXIgYW4gdXBkYXRlIG9mIHRoZSBsaXN0IG9wdGlvbiBpZiB0aGUgZGlzYWJsZWQgc3RhdGUgb2YgdGhlIHNlbGVjdGlvbiBsaXN0XG4gICAqIGNoYW5nZWQuXG4gICAqL1xuICBfbWFya0ZvckNoZWNrKCkge1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zZWxlY3RlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xufVxuXG5cbi8qKlxuICogTWF0ZXJpYWwgRGVzaWduIGxpc3QgY29tcG9uZW50IHdoZXJlIGVhY2ggaXRlbSBpcyBhIHNlbGVjdGFibGUgb3B0aW9uLiBCZWhhdmVzIGFzIGEgbGlzdGJveC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNlbGVjdGlvbi1saXN0JyxcbiAgZXhwb3J0QXM6ICdtYXRTZWxlY3Rpb25MaXN0JyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVSaXBwbGUnXSxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ2xpc3Rib3gnLFxuICAgICdjbGFzcyc6ICdtYXQtc2VsZWN0aW9uLWxpc3QgbWF0LWxpc3QtYmFzZScsXG4gICAgJyhmb2N1cyknOiAnX29uRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfb25Ub3VjaGVkKCknLFxuICAgICcoa2V5ZG93biknOiAnX2tleWRvd24oJGV2ZW50KScsXG4gICAgJ1thdHRyLmFyaWEtbXVsdGlzZWxlY3RhYmxlXSc6ICdtdWx0aXBsZScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnX3RhYkluZGV4JyxcbiAgfSxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgc3R5bGVVcmxzOiBbJ2xpc3QuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByb3ZpZGVyczogW01BVF9TRUxFQ1RJT05fTElTVF9WQUxVRV9BQ0NFU1NPUl0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdGlvbkxpc3QgZXh0ZW5kcyBfTWF0U2VsZWN0aW9uTGlzdE1peGluQmFzZSBpbXBsZW1lbnRzIENhbkRpc2FibGVSaXBwbGUsXG4gIEFmdGVyQ29udGVudEluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIHByaXZhdGUgX211bHRpcGxlID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfY29udGVudEluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBGb2N1c0tleU1hbmFnZXIgd2hpY2ggaGFuZGxlcyBmb2N1cy4gKi9cbiAgX2tleU1hbmFnZXI6IEZvY3VzS2V5TWFuYWdlcjxNYXRMaXN0T3B0aW9uPjtcblxuICAvKiogVGhlIG9wdGlvbiBjb21wb25lbnRzIGNvbnRhaW5lZCB3aXRoaW4gdGhpcyBzZWxlY3Rpb24tbGlzdC4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRMaXN0T3B0aW9uLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBvcHRpb25zOiBRdWVyeUxpc3Q8TWF0TGlzdE9wdGlvbj47XG5cbiAgLyoqIEVtaXRzIGEgY2hhbmdlIGV2ZW50IHdoZW5ldmVyIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiBhbiBvcHRpb24gY2hhbmdlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdFNlbGVjdGlvbkxpc3RDaGFuZ2U+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0U2VsZWN0aW9uTGlzdENoYW5nZT4oKTtcblxuICAvKipcbiAgICogVGFiaW5kZXggb2YgdGhlIHNlbGVjdGlvbiBsaXN0LlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDExLjAuMCBSZW1vdmUgYHRhYkluZGV4YCBpbnB1dC5cbiAgICovXG4gIEBJbnB1dCgpIHRhYkluZGV4OiBudW1iZXIgPSAwO1xuXG4gIC8qKiBUaGVtZSBjb2xvciBvZiB0aGUgc2VsZWN0aW9uIGxpc3QuIFRoaXMgc2V0cyB0aGUgY2hlY2tib3ggY29sb3IgZm9yIGFsbCBsaXN0IG9wdGlvbnMuICovXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGUgPSAnYWNjZW50JztcblxuICAvKipcbiAgICogRnVuY3Rpb24gdXNlZCBmb3IgY29tcGFyaW5nIGFuIG9wdGlvbiBhZ2FpbnN0IHRoZSBzZWxlY3RlZCB2YWx1ZSB3aGVuIGRldGVybWluaW5nIHdoaWNoXG4gICAqIG9wdGlvbnMgc2hvdWxkIGFwcGVhciBhcyBzZWxlY3RlZC4gVGhlIGZpcnN0IGFyZ3VtZW50IGlzIHRoZSB2YWx1ZSBvZiBhbiBvcHRpb25zLiBUaGUgc2Vjb25kXG4gICAqIG9uZSBpcyBhIHZhbHVlIGZyb20gdGhlIHNlbGVjdGVkIHZhbHVlLiBBIGJvb2xlYW4gbXVzdCBiZSByZXR1cm5lZC5cbiAgICovXG4gIEBJbnB1dCgpIGNvbXBhcmVXaXRoOiAobzE6IGFueSwgbzI6IGFueSkgPT4gYm9vbGVhbiA9IChhMSwgYTIpID0+IGExID09PSBhMjtcblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0aW9uIGxpc3QgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVkOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIC8vIFRoZSBgTWF0U2VsZWN0aW9uTGlzdGAgYW5kIGBNYXRMaXN0T3B0aW9uYCBhcmUgdXNpbmcgdGhlIGBPblB1c2hgIGNoYW5nZSBkZXRlY3Rpb25cbiAgICAvLyBzdHJhdGVneS4gVGhlcmVmb3JlIHRoZSBvcHRpb25zIHdpbGwgbm90IGNoZWNrIGZvciBhbnkgY2hhbmdlcyBpZiB0aGUgYE1hdFNlbGVjdGlvbkxpc3RgXG4gICAgLy8gY2hhbmdlZCBpdHMgc3RhdGUuIFNpbmNlIHdlIGtub3cgdGhhdCBhIGNoYW5nZSB0byBgZGlzYWJsZWRgIHByb3BlcnR5IG9mIHRoZSBsaXN0IGFmZmVjdHNcbiAgICAvLyB0aGUgc3RhdGUgb2YgdGhlIG9wdGlvbnMsIHdlIG1hbnVhbGx5IG1hcmsgZWFjaCBvcHRpb24gZm9yIGNoZWNrLlxuICAgIHRoaXMuX21hcmtPcHRpb25zRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHNlbGVjdGlvbiBpcyBsaW1pdGVkIHRvIG9uZSBvciBtdWx0aXBsZSBpdGVtcyAoZGVmYXVsdCBtdWx0aXBsZSkuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtdWx0aXBsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX211bHRpcGxlOyB9XG4gIHNldCBtdWx0aXBsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fbXVsdGlwbGUpIHtcbiAgICAgIGlmIChpc0Rldk1vZGUoKSAmJiB0aGlzLl9jb250ZW50SW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgJ0Nhbm5vdCBjaGFuZ2UgYG11bHRpcGxlYCBtb2RlIG9mIG1hdC1zZWxlY3Rpb24tbGlzdCBhZnRlciBpbml0aWFsaXphdGlvbi4nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbXVsdGlwbGUgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRPcHRpb25zID0gbmV3IFNlbGVjdGlvbk1vZGVsKHRoaXMuX211bHRpcGxlLCB0aGlzLnNlbGVjdGVkT3B0aW9ucy5zZWxlY3RlZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgb3B0aW9ucy4gKi9cbiAgc2VsZWN0ZWRPcHRpb25zID0gbmV3IFNlbGVjdGlvbk1vZGVsPE1hdExpc3RPcHRpb24+KHRoaXMuX211bHRpcGxlKTtcblxuICAvKiogVGhlIHRhYmluZGV4IG9mIHRoZSBzZWxlY3Rpb24gbGlzdC4gKi9cbiAgX3RhYkluZGV4ID0gLTE7XG5cbiAgLyoqIFZpZXcgdG8gbW9kZWwgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIHdoZW5ldmVyIHRoZSBzZWxlY3RlZCBvcHRpb25zIGNoYW5nZS4gKi9cbiAgcHJpdmF0ZSBfb25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKF86IGFueSkgPT4ge307XG5cbiAgLyoqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50bHktc2VsZWN0ZWQgdmFsdWUuICovXG4gIF92YWx1ZTogc3RyaW5nW118bnVsbDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgbGlzdCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFZpZXcgdG8gbW9kZWwgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIGlmIHRoZSBsaXN0IG9yIGl0cyBvcHRpb25zIGxvc3QgZm9jdXMuICovXG4gIF9vblRvdWNoZWQ6ICgpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogV2hldGhlciB0aGUgbGlzdCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgX2lzRGVzdHJveWVkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIFJlbW92ZSBgdGFiSW5kZXhgIHBhcmFtZXRlci5cbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jb250ZW50SW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgdGhpcy5fa2V5TWFuYWdlciA9IG5ldyBGb2N1c0tleU1hbmFnZXI8TWF0TGlzdE9wdGlvbj4odGhpcy5vcHRpb25zKVxuICAgICAgLndpdGhXcmFwKClcbiAgICAgIC53aXRoVHlwZUFoZWFkKClcbiAgICAgIC8vIEFsbG93IGRpc2FibGVkIGl0ZW1zIHRvIGJlIGZvY3VzYWJsZS4gRm9yIGFjY2Vzc2liaWxpdHkgcmVhc29ucywgdGhlcmUgbXVzdCBiZSBhIHdheSBmb3JcbiAgICAgIC8vIHNjcmVlbnJlYWRlciB1c2VycywgdGhhdCBhbGxvd3MgcmVhZGluZyB0aGUgZGlmZmVyZW50IG9wdGlvbnMgb2YgdGhlIGxpc3QuXG4gICAgICAuc2tpcFByZWRpY2F0ZSgoKSA9PiBmYWxzZSlcbiAgICAgIC53aXRoQWxsb3dlZE1vZGlmaWVyS2V5cyhbJ3NoaWZ0S2V5J10pO1xuXG4gICAgaWYgKHRoaXMuX3ZhbHVlKSB7XG4gICAgICB0aGlzLl9zZXRPcHRpb25zRnJvbVZhbHVlcyh0aGlzLl92YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHVzZXIgYXR0ZW1wdHMgdG8gdGFiIG91dCBvZiB0aGUgc2VsZWN0aW9uIGxpc3QsIGFsbG93IGZvY3VzIHRvIGVzY2FwZS5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnRhYk91dC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fYWxsb3dGb2N1c0VzY2FwZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gV2hlbiB0aGUgbnVtYmVyIG9mIG9wdGlvbnMgY2hhbmdlLCB1cGRhdGUgdGhlIHRhYmluZGV4IG9mIHRoZSBzZWxlY3Rpb24gbGlzdC5cbiAgICB0aGlzLm9wdGlvbnMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl91cGRhdGVUYWJJbmRleCgpO1xuICAgIH0pO1xuXG4gICAgLy8gU3luYyBleHRlcm5hbCBjaGFuZ2VzIHRvIHRoZSBtb2RlbCBiYWNrIHRvIHRoZSBvcHRpb25zLlxuICAgIHRoaXMuc2VsZWN0ZWRPcHRpb25zLmNoYW5nZWQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmIChldmVudC5hZGRlZCkge1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGV2ZW50LmFkZGVkKSB7XG4gICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50LnJlbW92ZWQpIHtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBldmVudC5yZW1vdmVkKSB7XG4gICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgZGlzYWJsZVJpcHBsZUNoYW5nZXMgPSBjaGFuZ2VzWydkaXNhYmxlUmlwcGxlJ107XG4gICAgY29uc3QgY29sb3JDaGFuZ2VzID0gY2hhbmdlc1snY29sb3InXTtcblxuICAgIGlmICgoZGlzYWJsZVJpcHBsZUNoYW5nZXMgJiYgIWRpc2FibGVSaXBwbGVDaGFuZ2VzLmZpcnN0Q2hhbmdlKSB8fFxuICAgICAgICAoY29sb3JDaGFuZ2VzICYmICFjb2xvckNoYW5nZXMuZmlyc3RDaGFuZ2UpKSB7XG4gICAgICB0aGlzLl9tYXJrT3B0aW9uc0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9pc0Rlc3Ryb3llZCA9IHRydWU7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgc2VsZWN0aW9uIGxpc3QuICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogU2VsZWN0cyBhbGwgb2YgdGhlIG9wdGlvbnMuICovXG4gIHNlbGVjdEFsbCgpIHtcbiAgICB0aGlzLl9zZXRBbGxPcHRpb25zU2VsZWN0ZWQodHJ1ZSk7XG4gIH1cblxuICAvKiogRGVzZWxlY3RzIGFsbCBvZiB0aGUgb3B0aW9ucy4gKi9cbiAgZGVzZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5fc2V0QWxsT3B0aW9uc1NlbGVjdGVkKGZhbHNlKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBmb2N1c2VkIG9wdGlvbiBvZiB0aGUgc2VsZWN0aW9uLWxpc3QuICovXG4gIF9zZXRGb2N1c2VkT3B0aW9uKG9wdGlvbjogTWF0TGlzdE9wdGlvbikge1xuICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShvcHRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW4gb3B0aW9uIGZyb20gdGhlIHNlbGVjdGlvbiBsaXN0IGFuZCB1cGRhdGVzIHRoZSBhY3RpdmUgaXRlbS5cbiAgICogQHJldHVybnMgQ3VycmVudGx5LWFjdGl2ZSBpdGVtLlxuICAgKi9cbiAgX3JlbW92ZU9wdGlvbkZyb21MaXN0KG9wdGlvbjogTWF0TGlzdE9wdGlvbik6IE1hdExpc3RPcHRpb24gfCBudWxsIHtcbiAgICBjb25zdCBvcHRpb25JbmRleCA9IHRoaXMuX2dldE9wdGlvbkluZGV4KG9wdGlvbik7XG5cbiAgICBpZiAob3B0aW9uSW5kZXggPiAtMSAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCA9PT0gb3B0aW9uSW5kZXgpIHtcbiAgICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIG9wdGlvbiBpcyB0aGUgbGFzdCBpdGVtXG4gICAgICBpZiAob3B0aW9uSW5kZXggPiAwKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShvcHRpb25JbmRleCAtIDEpO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb25JbmRleCA9PT0gMCAmJiB0aGlzLm9wdGlvbnMubGVuZ3RoID4gMSkge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oTWF0aC5taW4ob3B0aW9uSW5kZXggKyAxLCB0aGlzLm9wdGlvbnMubGVuZ3RoIC0gMSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW07XG4gIH1cblxuICAvKiogUGFzc2VzIHJlbGV2YW50IGtleSBwcmVzc2VzIHRvIG91ciBrZXkgbWFuYWdlci4gKi9cbiAgX2tleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcbiAgICBjb25zdCBwcmV2aW91c0ZvY3VzSW5kZXggPSBtYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleDtcbiAgICBjb25zdCBoYXNNb2RpZmllciA9IGhhc01vZGlmaWVyS2V5KGV2ZW50KTtcblxuICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgY2FzZSBTUEFDRTpcbiAgICAgIGNhc2UgRU5URVI6XG4gICAgICAgIGlmICghaGFzTW9kaWZpZXIgJiYgIW1hbmFnZXIuaXNUeXBpbmcoKSkge1xuICAgICAgICAgIHRoaXMuX3RvZ2dsZUZvY3VzZWRPcHRpb24oKTtcbiAgICAgICAgICAvLyBBbHdheXMgcHJldmVudCBzcGFjZSBmcm9tIHNjcm9sbGluZyB0aGUgcGFnZSBzaW5jZSB0aGUgbGlzdCBoYXMgZm9jdXNcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBIT01FOlxuICAgICAgY2FzZSBFTkQ6XG4gICAgICAgIGlmICghaGFzTW9kaWZpZXIpIHtcbiAgICAgICAgICBrZXlDb2RlID09PSBIT01FID8gbWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKSA6IG1hbmFnZXIuc2V0TGFzdEl0ZW1BY3RpdmUoKTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gVGhlIFwiQVwiIGtleSBnZXRzIHNwZWNpYWwgdHJlYXRtZW50LCBiZWNhdXNlIGl0J3MgdXNlZCBmb3IgdGhlIFwic2VsZWN0IGFsbFwiIGZ1bmN0aW9uYWxpdHkuXG4gICAgICAgIGlmIChrZXlDb2RlID09PSBBICYmIHRoaXMubXVsdGlwbGUgJiYgaGFzTW9kaWZpZXJLZXkoZXZlbnQsICdjdHJsS2V5JykgJiZcbiAgICAgICAgICAgICFtYW5hZ2VyLmlzVHlwaW5nKCkpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuZmluZChvcHRpb24gPT4gIW9wdGlvbi5zZWxlY3RlZCkgPyB0aGlzLnNlbGVjdEFsbCgpIDogdGhpcy5kZXNlbGVjdEFsbCgpO1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgKGtleUNvZGUgPT09IFVQX0FSUk9XIHx8IGtleUNvZGUgPT09IERPV05fQVJST1cpICYmIGV2ZW50LnNoaWZ0S2V5ICYmXG4gICAgICAgIG1hbmFnZXIuYWN0aXZlSXRlbUluZGV4ICE9PSBwcmV2aW91c0ZvY3VzSW5kZXgpIHtcbiAgICAgIHRoaXMuX3RvZ2dsZUZvY3VzZWRPcHRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVwb3J0cyBhIHZhbHVlIGNoYW5nZSB0byB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgKi9cbiAgX3JlcG9ydFZhbHVlQ2hhbmdlKCkge1xuICAgIC8vIFN0b3AgcmVwb3J0aW5nIHZhbHVlIGNoYW5nZXMgYWZ0ZXIgdGhlIGxpc3QgaGFzIGJlZW4gZGVzdHJveWVkLiBUaGlzIGF2b2lkc1xuICAgIC8vIGNhc2VzIHdoZXJlIHRoZSBsaXN0IG1pZ2h0IHdyb25nbHkgcmVzZXQgaXRzIHZhbHVlIG9uY2UgaXQgaXMgcmVtb3ZlZCwgYnV0XG4gICAgLy8gdGhlIGZvcm0gY29udHJvbCBpcyBzdGlsbCBsaXZlLlxuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgIXRoaXMuX2lzRGVzdHJveWVkKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2dldFNlbGVjdGVkT3B0aW9uVmFsdWVzKCk7XG4gICAgICB0aGlzLl9vbkNoYW5nZSh2YWx1ZSk7XG4gICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFbWl0cyBhIGNoYW5nZSBldmVudCBpZiB0aGUgc2VsZWN0ZWQgc3RhdGUgb2YgYW4gb3B0aW9uIGNoYW5nZWQuICovXG4gIF9lbWl0Q2hhbmdlRXZlbnQob3B0aW9uOiBNYXRMaXN0T3B0aW9uKSB7XG4gICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdChuZXcgTWF0U2VsZWN0aW9uTGlzdENoYW5nZSh0aGlzLCBvcHRpb24pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSBzZWxlY3Rpb24gbGlzdCBpcyBmb2N1c2VkLCB3ZSB3YW50IHRvIG1vdmUgZm9jdXMgdG8gYW4gb3B0aW9uIHdpdGhpbiB0aGUgbGlzdC4gRG8gdGhpc1xuICAgKiBieSBzZXR0aW5nIHRoZSBhcHByb3ByaWF0ZSBvcHRpb24gdG8gYmUgYWN0aXZlLlxuICAgKi9cbiAgX29uRm9jdXMoKTogdm9pZCB7XG4gICAgY29uc3QgYWN0aXZlSW5kZXggPSB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleDtcblxuICAgIGlmICghYWN0aXZlSW5kZXggfHwgKGFjdGl2ZUluZGV4ID09PSAtMSkpIHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIG5vIGFjdGl2ZSBpbmRleCwgc2V0IGZvY3VzIHRvIHRoZSBmaXJzdCBvcHRpb24uXG4gICAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldEZpcnN0SXRlbUFjdGl2ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdGhlcndpc2UsIHNldCBmb2N1cyB0byB0aGUgYWN0aXZlIG9wdGlvbi5cbiAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbShhY3RpdmVJbmRleCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuICovXG4gIHdyaXRlVmFsdWUodmFsdWVzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWVzO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgdGhpcy5fc2V0T3B0aW9uc0Zyb21WYWx1ZXModmFsdWVzIHx8IFtdKTtcbiAgICB9XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLiAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLiAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci4gKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBzZWxlY3RlZCBvcHRpb25zIGJhc2VkIG9uIHRoZSBzcGVjaWZpZWQgdmFsdWVzLiAqL1xuICBwcml2YXRlIF9zZXRPcHRpb25zRnJvbVZhbHVlcyh2YWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5vcHRpb25zLmZvckVhY2gob3B0aW9uID0+IG9wdGlvbi5fc2V0U2VsZWN0ZWQoZmFsc2UpKTtcblxuICAgIHZhbHVlcy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdPcHRpb24gPSB0aGlzLm9wdGlvbnMuZmluZChvcHRpb24gPT4ge1xuICAgICAgICAvLyBTa2lwIG9wdGlvbnMgdGhhdCBhcmUgYWxyZWFkeSBpbiB0aGUgbW9kZWwuIFRoaXMgYWxsb3dzIHVzIHRvIGhhbmRsZSBjYXNlc1xuICAgICAgICAvLyB3aGVyZSB0aGUgc2FtZSBwcmltaXRpdmUgdmFsdWUgaXMgc2VsZWN0ZWQgbXVsdGlwbGUgdGltZXMuXG4gICAgICAgIHJldHVybiBvcHRpb24uc2VsZWN0ZWQgPyBmYWxzZSA6IHRoaXMuY29tcGFyZVdpdGgob3B0aW9uLnZhbHVlLCB2YWx1ZSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGNvcnJlc3BvbmRpbmdPcHRpb24pIHtcbiAgICAgICAgY29ycmVzcG9uZGluZ09wdGlvbi5fc2V0U2VsZWN0ZWQodHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgdmFsdWVzIG9mIHRoZSBzZWxlY3RlZCBvcHRpb25zLiAqL1xuICBwcml2YXRlIF9nZXRTZWxlY3RlZE9wdGlvblZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIob3B0aW9uID0+IG9wdGlvbi5zZWxlY3RlZCkubWFwKG9wdGlvbiA9PiBvcHRpb24udmFsdWUpO1xuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIHN0YXRlIG9mIHRoZSBjdXJyZW50bHkgZm9jdXNlZCBvcHRpb24gaWYgZW5hYmxlZC4gKi9cbiAgcHJpdmF0ZSBfdG9nZ2xlRm9jdXNlZE9wdGlvbigpOiB2b2lkIHtcbiAgICBsZXQgZm9jdXNlZEluZGV4ID0gdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtSW5kZXg7XG5cbiAgICBpZiAoZm9jdXNlZEluZGV4ICE9IG51bGwgJiYgdGhpcy5faXNWYWxpZEluZGV4KGZvY3VzZWRJbmRleCkpIHtcbiAgICAgIGxldCBmb2N1c2VkT3B0aW9uOiBNYXRMaXN0T3B0aW9uID0gdGhpcy5vcHRpb25zLnRvQXJyYXkoKVtmb2N1c2VkSW5kZXhdO1xuXG4gICAgICBpZiAoZm9jdXNlZE9wdGlvbiAmJiAhZm9jdXNlZE9wdGlvbi5kaXNhYmxlZCAmJiAodGhpcy5fbXVsdGlwbGUgfHwgIWZvY3VzZWRPcHRpb24uc2VsZWN0ZWQpKSB7XG4gICAgICAgIGZvY3VzZWRPcHRpb24udG9nZ2xlKCk7XG5cbiAgICAgICAgLy8gRW1pdCBhIGNoYW5nZSBldmVudCBiZWNhdXNlIHRoZSBmb2N1c2VkIG9wdGlvbiBjaGFuZ2VkIGl0cyBzdGF0ZSB0aHJvdWdoIHVzZXJcbiAgICAgICAgLy8gaW50ZXJhY3Rpb24uXG4gICAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudChmb2N1c2VkT3B0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2VsZWN0ZWQgc3RhdGUgb24gYWxsIG9mIHRoZSBvcHRpb25zXG4gICAqIGFuZCBlbWl0cyBhbiBldmVudCBpZiBhbnl0aGluZyBjaGFuZ2VkLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0QWxsT3B0aW9uc1NlbGVjdGVkKGlzU2VsZWN0ZWQ6IGJvb2xlYW4pIHtcbiAgICAvLyBLZWVwIHRyYWNrIG9mIHdoZXRoZXIgYW55dGhpbmcgY2hhbmdlZCwgYmVjYXVzZSB3ZSBvbmx5IHdhbnQgdG9cbiAgICAvLyBlbWl0IHRoZSBjaGFuZ2VkIGV2ZW50IHdoZW4gc29tZXRoaW5nIGFjdHVhbGx5IGNoYW5nZWQuXG4gICAgbGV0IGhhc0NoYW5nZWQgPSBmYWxzZTtcblxuICAgIHRoaXMub3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICBpZiAob3B0aW9uLl9zZXRTZWxlY3RlZChpc1NlbGVjdGVkKSkge1xuICAgICAgICBoYXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChoYXNDaGFuZ2VkKSB7XG4gICAgICB0aGlzLl9yZXBvcnRWYWx1ZUNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVdGlsaXR5IHRvIGVuc3VyZSBhbGwgaW5kZXhlcyBhcmUgdmFsaWQuXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggdG8gYmUgY2hlY2tlZC5cbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgaW5kZXggaXMgdmFsaWQgZm9yIG91ciBsaXN0IG9mIG9wdGlvbnMuXG4gICAqL1xuICBwcml2YXRlIF9pc1ZhbGlkSW5kZXgoaW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5vcHRpb25zLmxlbmd0aDtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgc3BlY2lmaWVkIGxpc3Qgb3B0aW9uLiAqL1xuICBwcml2YXRlIF9nZXRPcHRpb25JbmRleChvcHRpb246IE1hdExpc3RPcHRpb24pOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMudG9BcnJheSgpLmluZGV4T2Yob3B0aW9uKTtcbiAgfVxuXG4gIC8qKiBNYXJrcyBhbGwgdGhlIG9wdGlvbnMgdG8gYmUgY2hlY2tlZCBpbiB0aGUgbmV4dCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bi4gKi9cbiAgcHJpdmF0ZSBfbWFya09wdGlvbnNGb3JDaGVjaygpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4gb3B0aW9uLl9tYXJrRm9yQ2hlY2soKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIHRhYmluZGV4IGZyb20gdGhlIHNlbGVjdGlvbiBsaXN0IGFuZCByZXNldHMgaXQgYmFjayBhZnRlcndhcmRzLCBhbGxvd2luZyB0aGUgdXNlclxuICAgKiB0byB0YWIgb3V0IG9mIGl0LiBUaGlzIHByZXZlbnRzIHRoZSBsaXN0IGZyb20gY2FwdHVyaW5nIGZvY3VzIGFuZCByZWRpcmVjdGluZyBpdCBiYWNrIHdpdGhpblxuICAgKiB0aGUgbGlzdCwgY3JlYXRpbmcgYSBmb2N1cyB0cmFwIGlmIGl0IHVzZXIgdHJpZXMgdG8gdGFiIGF3YXkuXG4gICAqL1xuICBwcml2YXRlIF9hbGxvd0ZvY3VzRXNjYXBlKCkge1xuICAgIHRoaXMuX3RhYkluZGV4ID0gLTE7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX3RhYkluZGV4ID0gMDtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHRhYmluZGV4IGJhc2VkIHVwb24gaWYgdGhlIHNlbGVjdGlvbiBsaXN0IGlzIGVtcHR5LiAqL1xuICBwcml2YXRlIF91cGRhdGVUYWJJbmRleCgpOiB2b2lkIHtcbiAgICB0aGlzLl90YWJJbmRleCA9ICh0aGlzLm9wdGlvbnMubGVuZ3RoID09PSAwKSA/IC0xIDogMDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbXVsdGlwbGU6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==