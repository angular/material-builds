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
                        'class': 'mat-list-item mat-list-option',
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
            case A:
                if (hasModifierKey(event, 'ctrlKey') && !manager.isTyping()) {
                    this.options.find(function (option) { return !option.selected; }) ? this.selectAll() : this.deselectAll();
                    event.preventDefault();
                }
                break;
            default:
                manager.onKeydown(event);
        }
        if ((keyCode === UP_ARROW || keyCode === DOWN_ARROW) && event.shiftKey &&
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
                    styles: [".mat-subheader{display:flex;box-sizing:border-box;padding:16px;align-items:center}.mat-list-base .mat-subheader{margin:0}.mat-list-base{padding-top:8px;display:block;-webkit-tap-highlight-color:transparent}.mat-list-base .mat-subheader{height:48px;line-height:16px}.mat-list-base .mat-subheader:first-child{margin-top:-8px}.mat-list-base .mat-list-item,.mat-list-base .mat-list-option{display:block;height:48px;-webkit-tap-highlight-color:transparent;width:100%;padding:0}.mat-list-base .mat-list-item .mat-list-item-content,.mat-list-base .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base .mat-list-item .mat-list-item-content-reverse,.mat-list-base .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base .mat-list-item .mat-list-item-ripple,.mat-list-base .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar,.mat-list-base .mat-list-option.mat-list-item-with-avatar{height:56px}.mat-list-base .mat-list-item.mat-2-line,.mat-list-base .mat-list-option.mat-2-line{height:72px}.mat-list-base .mat-list-item.mat-3-line,.mat-list-base .mat-list-option.mat-3-line{height:88px}.mat-list-base .mat-list-item.mat-multi-line,.mat-list-base .mat-list-option.mat-multi-line{height:auto}.mat-list-base .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base .mat-list-item .mat-list-text,.mat-list-base .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base .mat-list-item .mat-list-text>*,.mat-list-base .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base .mat-list-item .mat-list-text:empty,.mat-list-base .mat-list-option .mat-list-text:empty{display:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base .mat-list-item .mat-list-avatar,.mat-list-base .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%;object-fit:cover}.mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:72px;width:calc(100% - 72px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:72px}.mat-list-base .mat-list-item .mat-list-icon,.mat-list-base .mat-list-option .mat-list-icon{flex-shrink:0;width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:64px;width:calc(100% - 64px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:64px}.mat-list-base .mat-list-item .mat-divider,.mat-list-base .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base .mat-list-item .mat-divider,[dir=rtl] .mat-list-base .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-list-base[dense]{padding-top:4px;display:block}.mat-list-base[dense] .mat-subheader{height:40px;line-height:8px}.mat-list-base[dense] .mat-subheader:first-child{margin-top:-4px}.mat-list-base[dense] .mat-list-item,.mat-list-base[dense] .mat-list-option{display:block;height:40px;-webkit-tap-highlight-color:transparent;width:100%;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-item-content,.mat-list-base[dense] .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base[dense] .mat-list-item .mat-list-item-content-reverse,.mat-list-base[dense] .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base[dense] .mat-list-item .mat-list-item-ripple,.mat-list-base[dense] .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar{height:48px}.mat-list-base[dense] .mat-list-item.mat-2-line,.mat-list-base[dense] .mat-list-option.mat-2-line{height:60px}.mat-list-base[dense] .mat-list-item.mat-3-line,.mat-list-base[dense] .mat-list-option.mat-3-line{height:76px}.mat-list-base[dense] .mat-list-item.mat-multi-line,.mat-list-base[dense] .mat-list-option.mat-multi-line{height:auto}.mat-list-base[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base[dense] .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base[dense] .mat-list-item .mat-list-text,.mat-list-base[dense] .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-text>*,.mat-list-base[dense] .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base[dense] .mat-list-item .mat-list-text:empty,.mat-list-base[dense] .mat-list-option .mat-list-text:empty{display:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base[dense] .mat-list-item .mat-list-avatar,.mat-list-base[dense] .mat-list-option .mat-list-avatar{flex-shrink:0;width:36px;height:36px;border-radius:50%;object-fit:cover}.mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:68px;width:calc(100% - 68px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:68px}.mat-list-base[dense] .mat-list-item .mat-list-icon,.mat-list-base[dense] .mat-list-option .mat-list-icon{flex-shrink:0;width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:60px;width:calc(100% - 60px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:60px}.mat-list-base[dense] .mat-list-item .mat-divider,.mat-list-base[dense] .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-divider,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base[dense] .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-nav-list a{text-decoration:none;color:inherit}.mat-nav-list .mat-list-item{cursor:pointer;outline:none}mat-action-list button{background:none;color:inherit;border:none;font:inherit;outline:inherit;-webkit-tap-highlight-color:transparent;text-align:left}[dir=rtl] mat-action-list button{text-align:right}mat-action-list button::-moz-focus-inner{border:0}mat-action-list .mat-list-item{cursor:pointer;outline:inherit}.mat-list-option:not(.mat-list-item-disabled){cursor:pointer;outline:none}.mat-list-item-disabled{pointer-events:none}.cdk-high-contrast-active .mat-selection-list:focus{outline-style:dotted}.cdk-high-contrast-active .mat-list-option:hover,.cdk-high-contrast-active .mat-list-option:focus,.cdk-high-contrast-active .mat-nav-list .mat-list-item:hover,.cdk-high-contrast-active .mat-nav-list .mat-list-item:focus,.cdk-high-contrast-active mat-action-list .mat-list-item:hover,.cdk-high-contrast-active mat-action-list .mat-list-item:focus{outline:dotted 1px}@media(hover: none){.mat-list-option:not(.mat-list-item-disabled):hover,.mat-nav-list .mat-list-item:not(.mat-list-item-disabled):hover,.mat-action-list .mat-list-item:not(.mat-list-item-disabled):hover{background:none}}\n"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLWxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC9zZWxlY3Rpb24tbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFrQixlQUFlLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRSxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUNMLENBQUMsRUFDRCxVQUFVLEVBQ1YsR0FBRyxFQUNILEtBQUssRUFDTCxjQUFjLEVBQ2QsSUFBSSxFQUNKLEtBQUssRUFDTCxRQUFRLEdBQ1QsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBRUwsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFJTCxNQUFNLEVBQ04sU0FBUyxFQUVULFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBR0wsT0FBTyxFQUNQLGtCQUFrQixFQUNsQixRQUFRLEdBRVQsTUFBTSx3QkFBd0IsQ0FBQztBQUVoQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLHlCQUF5QixFQUFFLHVCQUF1QixFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRzFFLG9CQUFvQjtBQUNwQjtJ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MkI7b0JBRXJDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxTQUFTLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQztvQkFDOUMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2lCQUNoRDs7OztnQkFyVEMsVUFBVTs2Q0EyWVAsU0FBUyxTQUFDLFVBQVU7Z0JBL1l2QixpQkFBaUI7OzswQkFtVWhCLGVBQWUsU0FBQyxhQUFhLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2tDQUdsRCxNQUFNOzJCQU9OLEtBQUs7d0JBR0wsS0FBSzs4QkFPTCxLQUFLOzJCQUdMLEtBQUs7MkJBY0wsS0FBSzs7SUFrVlIsdUJBQUM7Q0FBQSxBQXBaRCxDQW9Cc0MsMEJBQTBCLEdBZ1kvRDtTQWhZWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c2FibGVPcHRpb24sIEZvY3VzS2V5TWFuYWdlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7U2VsZWN0aW9uTW9kZWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge1xuICBBLFxuICBET1dOX0FSUk9XLFxuICBFTkQsXG4gIEVOVEVSLFxuICBoYXNNb2RpZmllcktleSxcbiAgSE9NRSxcbiAgU1BBQ0UsXG4gIFVQX0FSUk9XLFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIGlzRGV2TW9kZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZUN0b3IsXG4gIE1hdExpbmUsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgc2V0TGluZXMsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7TWF0TGlzdEF2YXRhckNzc01hdFN0eWxlciwgTWF0TGlzdEljb25Dc3NNYXRTdHlsZXJ9IGZyb20gJy4vbGlzdCc7XG5cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFNlbGVjdGlvbkxpc3RCYXNlIHt9XG5jb25zdCBfTWF0U2VsZWN0aW9uTGlzdE1peGluQmFzZTogQ2FuRGlzYWJsZVJpcHBsZUN0b3IgJiB0eXBlb2YgTWF0U2VsZWN0aW9uTGlzdEJhc2UgPVxuICAgIG1peGluRGlzYWJsZVJpcHBsZShNYXRTZWxlY3Rpb25MaXN0QmFzZSk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRMaXN0T3B0aW9uQmFzZSB7fVxuY29uc3QgX01hdExpc3RPcHRpb25NaXhpbkJhc2U6IENhbkRpc2FibGVSaXBwbGVDdG9yICYgdHlwZW9mIE1hdExpc3RPcHRpb25CYXNlID1cbiAgICBtaXhpbkRpc2FibGVSaXBwbGUoTWF0TGlzdE9wdGlvbkJhc2UpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TRUxFQ1RJT05fTElTVF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0U2VsZWN0aW9uTGlzdCksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKiogQ2hhbmdlIGV2ZW50IHRoYXQgaXMgYmVpbmcgZmlyZWQgd2hlbmV2ZXIgdGhlIHNlbGVjdGVkIHN0YXRlIG9mIGFuIG9wdGlvbiBjaGFuZ2VzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdGlvbkxpc3RDaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBzZWxlY3Rpb24gbGlzdCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdFNlbGVjdGlvbkxpc3QsXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgb3B0aW9uIHRoYXQgaGFzIGJlZW4gY2hhbmdlZC4gKi9cbiAgICBwdWJsaWMgb3B0aW9uOiBNYXRMaXN0T3B0aW9uKSB7fVxufVxuXG4vKipcbiAqIENvbXBvbmVudCBmb3IgbGlzdC1vcHRpb25zIG9mIHNlbGVjdGlvbi1saXN0LiBFYWNoIGxpc3Qtb3B0aW9uIGNhbiBhdXRvbWF0aWNhbGx5XG4gKiBnZW5lcmF0ZSBhIGNoZWNrYm94IGFuZCBjYW4gcHV0IGN1cnJlbnQgaXRlbSBpbnRvIHRoZSBzZWxlY3Rpb25Nb2RlbCBvZiBzZWxlY3Rpb24tbGlzdFxuICogaWYgdGhlIGN1cnJlbnQgaXRlbSBpcyBzZWxlY3RlZC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWxpc3Qtb3B0aW9uJyxcbiAgZXhwb3J0QXM6ICdtYXRMaXN0T3B0aW9uJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVSaXBwbGUnXSxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ29wdGlvbicsXG4gICAgJ2NsYXNzJzogJ21hdC1saXN0LWl0ZW0gbWF0LWxpc3Qtb3B0aW9uJyxcbiAgICAnKGZvY3VzKSc6ICdfaGFuZGxlRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfaGFuZGxlQmx1cigpJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soKScsXG4gICAgJ1tjbGFzcy5tYXQtbGlzdC1pdGVtLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbGlzdC1pdGVtLXdpdGgtYXZhdGFyXSc6ICdfYXZhdGFyIHx8IF9pY29uJyxcbiAgICAvLyBNYW51YWxseSBzZXQgdGhlIFwicHJpbWFyeVwiIG9yIFwid2FyblwiIGNsYXNzIGlmIHRoZSBjb2xvciBoYXMgYmVlbiBleHBsaWNpdGx5XG4gICAgLy8gc2V0IHRvIFwicHJpbWFyeVwiIG9yIFwid2FyblwiLiBUaGUgcHNldWRvIGNoZWNrYm94IHBpY2tzIHVwIHRoZXNlIGNsYXNzZXMgZm9yXG4gICAgLy8gaXRzIHRoZW1lLlxuICAgICdbY2xhc3MubWF0LXByaW1hcnldJzogJ2NvbG9yID09PSBcInByaW1hcnlcIicsXG4gICAgLy8gRXZlbiB0aG91Z2ggYWNjZW50IGlzIHRoZSBkZWZhdWx0LCB3ZSBuZWVkIHRvIHNldCB0aGlzIGNsYXNzIGFueXdheSwgYmVjYXVzZSB0aGUgIGxpc3QgbWlnaHRcbiAgICAvLyBiZSBwbGFjZWQgaW5zaWRlIGEgcGFyZW50IHRoYXQgaGFzIG9uZSBvZiB0aGUgb3RoZXIgY29sb3JzIHdpdGggYSBoaWdoZXIgc3BlY2lmaWNpdHkuXG4gICAgJ1tjbGFzcy5tYXQtYWNjZW50XSc6ICdjb2xvciAhPT0gXCJwcmltYXJ5XCIgJiYgY29sb3IgIT09IFwid2FyblwiJyxcbiAgICAnW2NsYXNzLm1hdC13YXJuXSc6ICdjb2xvciA9PT0gXCJ3YXJuXCInLFxuICAgICdbY2xhc3MubWF0LWxpc3Qtc2luZ2xlLXNlbGVjdGVkLW9wdGlvbl0nOiAnc2VsZWN0ZWQgJiYgIXNlbGVjdGlvbkxpc3QubXVsdGlwbGUnLFxuICAgICdbYXR0ci5hcmlhLXNlbGVjdGVkXSc6ICdzZWxlY3RlZCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJy0xJyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICdsaXN0LW9wdGlvbi5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdExpc3RPcHRpb24gZXh0ZW5kcyBfTWF0TGlzdE9wdGlvbk1peGluQmFzZSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPbkluaXQsIEZvY3VzYWJsZU9wdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5EaXNhYmxlUmlwcGxlIHtcbiAgcHJpdmF0ZSBfc2VsZWN0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfaGFzRm9jdXMgPSBmYWxzZTtcblxuICBAQ29udGVudENoaWxkKE1hdExpc3RBdmF0YXJDc3NNYXRTdHlsZXIpIF9hdmF0YXI6IE1hdExpc3RBdmF0YXJDc3NNYXRTdHlsZXI7XG4gIEBDb250ZW50Q2hpbGQoTWF0TGlzdEljb25Dc3NNYXRTdHlsZXIpIF9pY29uOiBNYXRMaXN0SWNvbkNzc01hdFN0eWxlcjtcbiAgQENvbnRlbnRDaGlsZHJlbihNYXRMaW5lLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfbGluZXM6IFF1ZXJ5TGlzdDxNYXRMaW5lPjtcblxuICAvKiogRE9NIGVsZW1lbnQgY29udGFpbmluZyB0aGUgaXRlbSdzIHRleHQuICovXG4gIEBWaWV3Q2hpbGQoJ3RleHQnKSBfdGV4dDogRWxlbWVudFJlZjtcblxuICAvKiogV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGFwcGVhciBiZWZvcmUgb3IgYWZ0ZXIgdGhlIGNoZWNrYm94LiBEZWZhdWx0cyB0byAnYWZ0ZXInICovXG4gIEBJbnB1dCgpIGNoZWNrYm94UG9zaXRpb246ICdiZWZvcmUnIHwgJ2FmdGVyJyA9ICdhZnRlcic7XG5cbiAgLyoqIFRoZW1lIGNvbG9yIG9mIHRoZSBsaXN0IG9wdGlvbi4gVGhpcyBzZXRzIHRoZSBjb2xvciBvZiB0aGUgY2hlY2tib3guICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUgeyByZXR1cm4gdGhpcy5fY29sb3IgfHwgdGhpcy5zZWxlY3Rpb25MaXN0LmNvbG9yOyB9XG4gIHNldCBjb2xvcihuZXdWYWx1ZTogVGhlbWVQYWxldHRlKSB7IHRoaXMuX2NvbG9yID0gbmV3VmFsdWU7IH1cbiAgcHJpdmF0ZSBfY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKipcbiAgICogVGhpcyBpcyBzZXQgdG8gdHJ1ZSBhZnRlciB0aGUgZmlyc3QgT25DaGFuZ2VzIGN5Y2xlIHNvIHdlIGRvbid0IGNsZWFyIHRoZSB2YWx1ZSBvZiBgc2VsZWN0ZWRgXG4gICAqIGluIHRoZSBmaXJzdCBjeWNsZS5cbiAgICovXG4gIHByaXZhdGUgX2lucHV0c0luaXRpYWxpemVkID0gZmFsc2U7XG4gIC8qKiBWYWx1ZSBvZiB0aGUgb3B0aW9uICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICBpZiAodGhpcy5zZWxlY3RlZCAmJiBuZXdWYWx1ZSAhPT0gdGhpcy52YWx1ZSAmJiB0aGlzLl9pbnB1dHNJbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfdmFsdWU6IGFueTtcblxuICAvKiogV2hldGhlciB0aGUgb3B0aW9uIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKSB7IHJldHVybiB0aGlzLl9kaXNhYmxlZCB8fCAodGhpcy5zZWxlY3Rpb25MaXN0ICYmIHRoaXMuc2VsZWN0aW9uTGlzdC5kaXNhYmxlZCk7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBhbnkpIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG9wdGlvbiBpcyBzZWxlY3RlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5zZWxlY3Rpb25MaXN0LnNlbGVjdGVkT3B0aW9ucy5pc1NlbGVjdGVkKHRoaXMpOyB9XG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKGlzU2VsZWN0ZWQgIT09IHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZXRTZWxlY3RlZChpc1NlbGVjdGVkKTtcbiAgICAgIHRoaXMuc2VsZWN0aW9uTGlzdC5fcmVwb3J0VmFsdWVDaGFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICAgICAgICAgICAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTWF0U2VsZWN0aW9uTGlzdCkpIHB1YmxpYyBzZWxlY3Rpb25MaXN0OiBNYXRTZWxlY3Rpb25MaXN0KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLnNlbGVjdGlvbkxpc3Q7XG5cbiAgICBpZiAobGlzdC5fdmFsdWUgJiYgbGlzdC5fdmFsdWUuc29tZSh2YWx1ZSA9PiBsaXN0LmNvbXBhcmVXaXRoKHZhbHVlLCB0aGlzLl92YWx1ZSkpKSB7XG4gICAgICB0aGlzLl9zZXRTZWxlY3RlZCh0cnVlKTtcbiAgICB9XG5cbiAgICBjb25zdCB3YXNTZWxlY3RlZCA9IHRoaXMuX3NlbGVjdGVkO1xuXG4gICAgLy8gTGlzdCBvcHRpb25zIHRoYXQgYXJlIHNlbGVjdGVkIGF0IGluaXRpYWxpemF0aW9uIGNhbid0IGJlIHJlcG9ydGVkIHByb3Blcmx5IHRvIHRoZSBmb3JtXG4gICAgLy8gY29udHJvbC4gVGhpcyBpcyBiZWNhdXNlIGl0IHRha2VzIHNvbWUgdGltZSB1bnRpbCB0aGUgc2VsZWN0aW9uLWxpc3Qga25vd3MgYWJvdXQgYWxsXG4gICAgLy8gYXZhaWxhYmxlIG9wdGlvbnMuIEFsc28gaXQgY2FuIGhhcHBlbiB0aGF0IHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBoYXMgYW4gaW5pdGlhbCB2YWx1ZVxuICAgIC8vIHRoYXQgc2hvdWxkIGJlIHVzZWQgaW5zdGVhZC4gRGVmZXJyaW5nIHRoZSB2YWx1ZSBjaGFuZ2UgcmVwb3J0IHRvIHRoZSBuZXh0IHRpY2sgZW5zdXJlc1xuICAgIC8vIHRoYXQgdGhlIGZvcm0gY29udHJvbCB2YWx1ZSBpcyBub3QgYmVpbmcgb3ZlcndyaXR0ZW4uXG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fc2VsZWN0ZWQgfHwgd2FzU2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX2lucHV0c0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBzZXRMaW5lcyh0aGlzLl9saW5lcywgdGhpcy5fZWxlbWVudCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zZWxlY3RlZCkge1xuICAgICAgLy8gV2UgaGF2ZSB0byBkZWxheSB0aGlzIHVudGlsIHRoZSBuZXh0IHRpY2sgaW4gb3JkZXJcbiAgICAgIC8vIHRvIGF2b2lkIGNoYW5nZWQgYWZ0ZXIgY2hlY2tlZCBlcnJvcnMuXG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgaGFkRm9jdXMgPSB0aGlzLl9oYXNGb2N1cztcbiAgICBjb25zdCBuZXdBY3RpdmVJdGVtID0gdGhpcy5zZWxlY3Rpb25MaXN0Ll9yZW1vdmVPcHRpb25Gcm9tTGlzdCh0aGlzKTtcblxuICAgIC8vIE9ubHkgbW92ZSBmb2N1cyBpZiB0aGlzIG9wdGlvbiB3YXMgZm9jdXNlZCBhdCB0aGUgdGltZSBpdCB3YXMgZGVzdHJveWVkLlxuICAgIGlmIChoYWRGb2N1cyAmJiBuZXdBY3RpdmVJdGVtKSB7XG4gICAgICBuZXdBY3RpdmVJdGVtLmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIHNlbGVjdGlvbiBzdGF0ZSBvZiB0aGUgb3B0aW9uLiAqL1xuICB0b2dnbGUoKTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3RlZCA9ICF0aGlzLnNlbGVjdGVkO1xuICB9XG5cbiAgLyoqIEFsbG93cyBmb3IgcHJvZ3JhbW1hdGljIGZvY3VzaW5nIG9mIHRoZSBvcHRpb24uICovXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxpc3QgaXRlbSdzIHRleHQgbGFiZWwuIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiB0aGUgRm9jdXNLZXlNYW5hZ2VyLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXRMYWJlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdGV4dCA/ICh0aGlzLl90ZXh0Lm5hdGl2ZUVsZW1lbnQudGV4dENvbnRlbnQgfHwgJycpIDogJyc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIGxpc3QgaXRlbSBzaG91bGQgc2hvdyBhIHJpcHBsZSBlZmZlY3Qgd2hlbiBjbGlja2VkLiAqL1xuICBfaXNSaXBwbGVEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVSaXBwbGUgfHwgdGhpcy5zZWxlY3Rpb25MaXN0LmRpc2FibGVSaXBwbGU7XG4gIH1cblxuICBfaGFuZGxlQ2xpY2soKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkICYmICh0aGlzLnNlbGVjdGlvbkxpc3QubXVsdGlwbGUgfHwgIXRoaXMuc2VsZWN0ZWQpKSB7XG4gICAgICB0aGlzLnRvZ2dsZSgpO1xuXG4gICAgICAvLyBFbWl0IGEgY2hhbmdlIGV2ZW50IGlmIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiB0aGUgb3B0aW9uIGNoYW5nZWQgdGhyb3VnaCB1c2VyIGludGVyYWN0aW9uLlxuICAgICAgdGhpcy5zZWxlY3Rpb25MaXN0Ll9lbWl0Q2hhbmdlRXZlbnQodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUZvY3VzKCkge1xuICAgIHRoaXMuc2VsZWN0aW9uTGlzdC5fc2V0Rm9jdXNlZE9wdGlvbih0aGlzKTtcbiAgICB0aGlzLl9oYXNGb2N1cyA9IHRydWU7XG4gIH1cblxuICBfaGFuZGxlQmx1cigpIHtcbiAgICB0aGlzLnNlbGVjdGlvbkxpc3QuX29uVG91Y2hlZCgpO1xuICAgIHRoaXMuX2hhc0ZvY3VzID0gZmFsc2U7XG4gIH1cblxuICAvKiogUmV0cmlldmVzIHRoZSBET00gZWxlbWVudCBvZiB0aGUgY29tcG9uZW50IGhvc3QuICovXG4gIF9nZXRIb3N0RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiB0aGUgb3B0aW9uLiBSZXR1cm5zIHdoZXRoZXIgdGhlIHZhbHVlIGhhcyBjaGFuZ2VkLiAqL1xuICBfc2V0U2VsZWN0ZWQoc2VsZWN0ZWQ6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICBpZiAoc2VsZWN0ZWQgPT09IHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBzZWxlY3RlZDtcblxuICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgdGhpcy5zZWxlY3Rpb25MaXN0LnNlbGVjdGVkT3B0aW9ucy5zZWxlY3QodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uTGlzdC5zZWxlY3RlZE9wdGlvbnMuZGVzZWxlY3QodGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogTm90aWZpZXMgQW5ndWxhciB0aGF0IHRoZSBvcHRpb24gbmVlZHMgdG8gYmUgY2hlY2tlZCBpbiB0aGUgbmV4dCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bi4gTWFpbmx5XG4gICAqIHVzZWQgdG8gdHJpZ2dlciBhbiB1cGRhdGUgb2YgdGhlIGxpc3Qgb3B0aW9uIGlmIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiB0aGUgc2VsZWN0aW9uIGxpc3RcbiAgICogY2hhbmdlZC5cbiAgICovXG4gIF9tYXJrRm9yQ2hlY2soKSB7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlUmlwcGxlOiBCb29sZWFuSW5wdXQ7XG59XG5cblxuLyoqXG4gKiBNYXRlcmlhbCBEZXNpZ24gbGlzdCBjb21wb25lbnQgd2hlcmUgZWFjaCBpdGVtIGlzIGEgc2VsZWN0YWJsZSBvcHRpb24uIEJlaGF2ZXMgYXMgYSBsaXN0Ym94LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc2VsZWN0aW9uLWxpc3QnLFxuICBleHBvcnRBczogJ21hdFNlbGVjdGlvbkxpc3QnLFxuICBpbnB1dHM6IFsnZGlzYWJsZVJpcHBsZSddLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnbGlzdGJveCcsXG4gICAgJ2NsYXNzJzogJ21hdC1zZWxlY3Rpb24tbGlzdCBtYXQtbGlzdC1iYXNlJyxcbiAgICAnKGZvY3VzKSc6ICdfb25Gb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ19vblRvdWNoZWQoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfa2V5ZG93bigkZXZlbnQpJyxcbiAgICAnW2F0dHIuYXJpYS1tdWx0aXNlbGVjdGFibGVdJzogJ211bHRpcGxlJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdfdGFiSW5kZXgnLFxuICB9LFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBzdHlsZVVybHM6IFsnbGlzdC5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbTUFUX1NFTEVDVElPTl9MSVNUX1ZBTFVFX0FDQ0VTU09SXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0aW9uTGlzdCBleHRlbmRzIF9NYXRTZWxlY3Rpb25MaXN0TWl4aW5CYXNlIGltcGxlbWVudHMgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgQWZ0ZXJDb250ZW50SW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgcHJpdmF0ZSBfbXVsdGlwbGUgPSB0cnVlO1xuICBwcml2YXRlIF9jb250ZW50SW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAvKiogVGhlIEZvY3VzS2V5TWFuYWdlciB3aGljaCBoYW5kbGVzIGZvY3VzLiAqL1xuICBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdExpc3RPcHRpb24+O1xuXG4gIC8qKiBUaGUgb3B0aW9uIGNvbXBvbmVudHMgY29udGFpbmVkIHdpdGhpbiB0aGlzIHNlbGVjdGlvbi1saXN0LiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdExpc3RPcHRpb24sIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbnM6IFF1ZXJ5TGlzdDxNYXRMaXN0T3B0aW9uPjtcblxuICAvKiogRW1pdHMgYSBjaGFuZ2UgZXZlbnQgd2hlbmV2ZXIgdGhlIHNlbGVjdGVkIHN0YXRlIG9mIGFuIG9wdGlvbiBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0U2VsZWN0aW9uTGlzdENoYW5nZT4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlPigpO1xuXG4gIC8qKlxuICAgKiBUYWJpbmRleCBvZiB0aGUgc2VsZWN0aW9uIGxpc3QuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIFJlbW92ZSBgdGFiSW5kZXhgIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCkgdGFiSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgLyoqIFRoZW1lIGNvbG9yIG9mIHRoZSBzZWxlY3Rpb24gbGlzdC4gVGhpcyBzZXRzIHRoZSBjaGVja2JveCBjb2xvciBmb3IgYWxsIGxpc3Qgb3B0aW9ucy4gKi9cbiAgQElucHV0KCkgY29sb3I6IFRoZW1lUGFsZXR0ZSA9ICdhY2NlbnQnO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB1c2VkIGZvciBjb21wYXJpbmcgYW4gb3B0aW9uIGFnYWluc3QgdGhlIHNlbGVjdGVkIHZhbHVlIHdoZW4gZGV0ZXJtaW5pbmcgd2hpY2hcbiAgICogb3B0aW9ucyBzaG91bGQgYXBwZWFyIGFzIHNlbGVjdGVkLiBUaGUgZmlyc3QgYXJndW1lbnQgaXMgdGhlIHZhbHVlIG9mIGFuIG9wdGlvbnMuIFRoZSBzZWNvbmRcbiAgICogb25lIGlzIGEgdmFsdWUgZnJvbSB0aGUgc2VsZWN0ZWQgdmFsdWUuIEEgYm9vbGVhbiBtdXN0IGJlIHJldHVybmVkLlxuICAgKi9cbiAgQElucHV0KCkgY29tcGFyZVdpdGg6IChvMTogYW55LCBvMjogYW55KSA9PiBib29sZWFuID0gKGExLCBhMikgPT4gYTEgPT09IGEyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3Rpb24gbGlzdCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgLy8gVGhlIGBNYXRTZWxlY3Rpb25MaXN0YCBhbmQgYE1hdExpc3RPcHRpb25gIGFyZSB1c2luZyB0aGUgYE9uUHVzaGAgY2hhbmdlIGRldGVjdGlvblxuICAgIC8vIHN0cmF0ZWd5LiBUaGVyZWZvcmUgdGhlIG9wdGlvbnMgd2lsbCBub3QgY2hlY2sgZm9yIGFueSBjaGFuZ2VzIGlmIHRoZSBgTWF0U2VsZWN0aW9uTGlzdGBcbiAgICAvLyBjaGFuZ2VkIGl0cyBzdGF0ZS4gU2luY2Ugd2Uga25vdyB0aGF0IGEgY2hhbmdlIHRvIGBkaXNhYmxlZGAgcHJvcGVydHkgb2YgdGhlIGxpc3QgYWZmZWN0c1xuICAgIC8vIHRoZSBzdGF0ZSBvZiB0aGUgb3B0aW9ucywgd2UgbWFudWFsbHkgbWFyayBlYWNoIG9wdGlvbiBmb3IgY2hlY2suXG4gICAgdGhpcy5fbWFya09wdGlvbnNGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgc2VsZWN0aW9uIGlzIGxpbWl0ZWQgdG8gb25lIG9yIG11bHRpcGxlIGl0ZW1zIChkZWZhdWx0IG11bHRpcGxlKS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG11bHRpcGxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fbXVsdGlwbGU7IH1cbiAgc2V0IG11bHRpcGxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9tdWx0aXBsZSkge1xuICAgICAgaWYgKGlzRGV2TW9kZSgpICYmIHRoaXMuX2NvbnRlbnRJbml0aWFsaXplZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnQ2Fubm90IGNoYW5nZSBgbXVsdGlwbGVgIG1vZGUgb2YgbWF0LXNlbGVjdGlvbi1saXN0IGFmdGVyIGluaXRpYWxpemF0aW9uLicpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9tdWx0aXBsZSA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMgPSBuZXcgU2VsZWN0aW9uTW9kZWwodGhpcy5fbXVsdGlwbGUsIHRoaXMuc2VsZWN0ZWRPcHRpb25zLnNlbGVjdGVkKTtcbiAgICB9XG4gIH1cblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBvcHRpb25zLiAqL1xuICBzZWxlY3RlZE9wdGlvbnMgPSBuZXcgU2VsZWN0aW9uTW9kZWw8TWF0TGlzdE9wdGlvbj4odGhpcy5fbXVsdGlwbGUpO1xuXG4gIC8qKiBUaGUgdGFiaW5kZXggb2YgdGhlIHNlbGVjdGlvbiBsaXN0LiAqL1xuICBfdGFiSW5kZXggPSAtMTtcblxuICAvKiogVmlldyB0byBtb2RlbCBjYWxsYmFjayB0aGF0IHNob3VsZCBiZSBjYWxsZWQgd2hlbmV2ZXIgdGhlIHNlbGVjdGVkIG9wdGlvbnMgY2hhbmdlLiAqL1xuICBwcml2YXRlIF9vbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoXzogYW55KSA9PiB7fTtcblxuICAvKiogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnRseS1zZWxlY3RlZCB2YWx1ZS4gKi9cbiAgX3ZhbHVlOiBzdHJpbmdbXXxudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBsaXN0IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVmlldyB0byBtb2RlbCBjYWxsYmFjayB0aGF0IHNob3VsZCBiZSBjYWxsZWQgaWYgdGhlIGxpc3Qgb3IgaXRzIG9wdGlvbnMgbG9zdCBmb2N1cy4gKi9cbiAgX29uVG91Y2hlZDogKCkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsaXN0IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSBfaXNEZXN0cm95ZWQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgUmVtb3ZlIGB0YWJJbmRleGAgcGFyYW1ldGVyLlxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbnRlbnRJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcjxNYXRMaXN0T3B0aW9uPih0aGlzLm9wdGlvbnMpXG4gICAgICAud2l0aFdyYXAoKVxuICAgICAgLndpdGhUeXBlQWhlYWQoKVxuICAgICAgLy8gQWxsb3cgZGlzYWJsZWQgaXRlbXMgdG8gYmUgZm9jdXNhYmxlLiBGb3IgYWNjZXNzaWJpbGl0eSByZWFzb25zLCB0aGVyZSBtdXN0IGJlIGEgd2F5IGZvclxuICAgICAgLy8gc2NyZWVucmVhZGVyIHVzZXJzLCB0aGF0IGFsbG93cyByZWFkaW5nIHRoZSBkaWZmZXJlbnQgb3B0aW9ucyBvZiB0aGUgbGlzdC5cbiAgICAgIC5za2lwUHJlZGljYXRlKCgpID0+IGZhbHNlKVxuICAgICAgLndpdGhBbGxvd2VkTW9kaWZpZXJLZXlzKFsnc2hpZnRLZXknXSk7XG5cbiAgICBpZiAodGhpcy5fdmFsdWUpIHtcbiAgICAgIHRoaXMuX3NldE9wdGlvbnNGcm9tVmFsdWVzKHRoaXMuX3ZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdXNlciBhdHRlbXB0cyB0byB0YWIgb3V0IG9mIHRoZSBzZWxlY3Rpb24gbGlzdCwgYWxsb3cgZm9jdXMgdG8gZXNjYXBlLlxuICAgIHRoaXMuX2tleU1hbmFnZXIudGFiT3V0LnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9hbGxvd0ZvY3VzRXNjYXBlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBXaGVuIHRoZSBudW1iZXIgb2Ygb3B0aW9ucyBjaGFuZ2UsIHVwZGF0ZSB0aGUgdGFiaW5kZXggb2YgdGhlIHNlbGVjdGlvbiBsaXN0LlxuICAgIHRoaXMub3B0aW9ucy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3VwZGF0ZVRhYkluZGV4KCk7XG4gICAgfSk7XG5cbiAgICAvLyBTeW5jIGV4dGVybmFsIGNoYW5nZXMgdG8gdGhlIG1vZGVsIGJhY2sgdG8gdGhlIG9wdGlvbnMuXG4gICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMuY2hhbmdlZC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKGV2ZW50LmFkZGVkKSB7XG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgZXZlbnQuYWRkZWQpIHtcbiAgICAgICAgICBpdGVtLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnQucmVtb3ZlZCkge1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGV2ZW50LnJlbW92ZWQpIHtcbiAgICAgICAgICBpdGVtLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBkaXNhYmxlUmlwcGxlQ2hhbmdlcyA9IGNoYW5nZXNbJ2Rpc2FibGVSaXBwbGUnXTtcbiAgICBjb25zdCBjb2xvckNoYW5nZXMgPSBjaGFuZ2VzWydjb2xvciddO1xuXG4gICAgaWYgKChkaXNhYmxlUmlwcGxlQ2hhbmdlcyAmJiAhZGlzYWJsZVJpcHBsZUNoYW5nZXMuZmlyc3RDaGFuZ2UpIHx8XG4gICAgICAgIChjb2xvckNoYW5nZXMgJiYgIWNvbG9yQ2hhbmdlcy5maXJzdENoYW5nZSkpIHtcbiAgICAgIHRoaXMuX21hcmtPcHRpb25zRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2lzRGVzdHJveWVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBzZWxlY3Rpb24gbGlzdC4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIGFsbCBvZiB0aGUgb3B0aW9ucy4gKi9cbiAgc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuX3NldEFsbE9wdGlvbnNTZWxlY3RlZCh0cnVlKTtcbiAgfVxuXG4gIC8qKiBEZXNlbGVjdHMgYWxsIG9mIHRoZSBvcHRpb25zLiAqL1xuICBkZXNlbGVjdEFsbCgpIHtcbiAgICB0aGlzLl9zZXRBbGxPcHRpb25zU2VsZWN0ZWQoZmFsc2UpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGZvY3VzZWQgb3B0aW9uIG9mIHRoZSBzZWxlY3Rpb24tbGlzdC4gKi9cbiAgX3NldEZvY3VzZWRPcHRpb24ob3B0aW9uOiBNYXRMaXN0T3B0aW9uKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKG9wdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbiBvcHRpb24gZnJvbSB0aGUgc2VsZWN0aW9uIGxpc3QgYW5kIHVwZGF0ZXMgdGhlIGFjdGl2ZSBpdGVtLlxuICAgKiBAcmV0dXJucyBDdXJyZW50bHktYWN0aXZlIGl0ZW0uXG4gICAqL1xuICBfcmVtb3ZlT3B0aW9uRnJvbUxpc3Qob3B0aW9uOiBNYXRMaXN0T3B0aW9uKTogTWF0TGlzdE9wdGlvbiB8IG51bGwge1xuICAgIGNvbnN0IG9wdGlvbkluZGV4ID0gdGhpcy5fZ2V0T3B0aW9uSW5kZXgob3B0aW9uKTtcblxuICAgIGlmIChvcHRpb25JbmRleCA+IC0xICYmIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4ID09PSBvcHRpb25JbmRleCkge1xuICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgb3B0aW9uIGlzIHRoZSBsYXN0IGl0ZW1cbiAgICAgIGlmIChvcHRpb25JbmRleCA+IDApIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKG9wdGlvbkluZGV4IC0gMSk7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbkluZGV4ID09PSAwICYmIHRoaXMub3B0aW9ucy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShNYXRoLm1pbihvcHRpb25JbmRleCArIDEsIHRoaXMub3B0aW9ucy5sZW5ndGggLSAxKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbTtcbiAgfVxuXG4gIC8qKiBQYXNzZXMgcmVsZXZhbnQga2V5IHByZXNzZXMgdG8gb3VyIGtleSBtYW5hZ2VyLiAqL1xuICBfa2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuICAgIGNvbnN0IHByZXZpb3VzRm9jdXNJbmRleCA9IG1hbmFnZXIuYWN0aXZlSXRlbUluZGV4O1xuICAgIGNvbnN0IGhhc01vZGlmaWVyID0gaGFzTW9kaWZpZXJLZXkoZXZlbnQpO1xuXG4gICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICBjYXNlIFNQQUNFOlxuICAgICAgY2FzZSBFTlRFUjpcbiAgICAgICAgaWYgKCFoYXNNb2RpZmllciAmJiAhbWFuYWdlci5pc1R5cGluZygpKSB7XG4gICAgICAgICAgdGhpcy5fdG9nZ2xlRm9jdXNlZE9wdGlvbigpO1xuICAgICAgICAgIC8vIEFsd2F5cyBwcmV2ZW50IHNwYWNlIGZyb20gc2Nyb2xsaW5nIHRoZSBwYWdlIHNpbmNlIHRoZSBsaXN0IGhhcyBmb2N1c1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEhPTUU6XG4gICAgICBjYXNlIEVORDpcbiAgICAgICAgaWYgKCFoYXNNb2RpZmllcikge1xuICAgICAgICAgIGtleUNvZGUgPT09IEhPTUUgPyBtYW5hZ2VyLnNldEZpcnN0SXRlbUFjdGl2ZSgpIDogbWFuYWdlci5zZXRMYXN0SXRlbUFjdGl2ZSgpO1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEE6XG4gICAgICAgIGlmIChoYXNNb2RpZmllcktleShldmVudCwgJ2N0cmxLZXknKSAmJiAhbWFuYWdlci5pc1R5cGluZygpKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLmZpbmQob3B0aW9uID0+ICFvcHRpb24uc2VsZWN0ZWQpID8gdGhpcy5zZWxlY3RBbGwoKSA6IHRoaXMuZGVzZWxlY3RBbGwoKTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgIH1cblxuICAgIGlmICgoa2V5Q29kZSA9PT0gVVBfQVJST1cgfHwga2V5Q29kZSA9PT0gRE9XTl9BUlJPVykgJiYgZXZlbnQuc2hpZnRLZXkgJiZcbiAgICAgICAgbWFuYWdlci5hY3RpdmVJdGVtSW5kZXggIT09IHByZXZpb3VzRm9jdXNJbmRleCkge1xuICAgICAgdGhpcy5fdG9nZ2xlRm9jdXNlZE9wdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXBvcnRzIGEgdmFsdWUgY2hhbmdlIHRvIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciAqL1xuICBfcmVwb3J0VmFsdWVDaGFuZ2UoKSB7XG4gICAgLy8gU3RvcCByZXBvcnRpbmcgdmFsdWUgY2hhbmdlcyBhZnRlciB0aGUgbGlzdCBoYXMgYmVlbiBkZXN0cm95ZWQuIFRoaXMgYXZvaWRzXG4gICAgLy8gY2FzZXMgd2hlcmUgdGhlIGxpc3QgbWlnaHQgd3JvbmdseSByZXNldCBpdHMgdmFsdWUgb25jZSBpdCBpcyByZW1vdmVkLCBidXRcbiAgICAvLyB0aGUgZm9ybSBjb250cm9sIGlzIHN0aWxsIGxpdmUuXG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiAhdGhpcy5faXNEZXN0cm95ZWQpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fZ2V0U2VsZWN0ZWRPcHRpb25WYWx1ZXMoKTtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlKTtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVtaXRzIGEgY2hhbmdlIGV2ZW50IGlmIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiBhbiBvcHRpb24gY2hhbmdlZC4gKi9cbiAgX2VtaXRDaGFuZ2VFdmVudChvcHRpb246IE1hdExpc3RPcHRpb24pIHtcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KG5ldyBNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlKHRoaXMsIG9wdGlvbikpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIHNlbGVjdGlvbiBsaXN0IGlzIGZvY3VzZWQsIHdlIHdhbnQgdG8gbW92ZSBmb2N1cyB0byBhbiBvcHRpb24gd2l0aGluIHRoZSBsaXN0LiBEbyB0aGlzXG4gICAqIGJ5IHNldHRpbmcgdGhlIGFwcHJvcHJpYXRlIG9wdGlvbiB0byBiZSBhY3RpdmUuXG4gICAqL1xuICBfb25Gb2N1cygpOiB2b2lkIHtcbiAgICBjb25zdCBhY3RpdmVJbmRleCA9IHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4O1xuXG4gICAgaWYgKCFhY3RpdmVJbmRleCB8fCAoYWN0aXZlSW5kZXggPT09IC0xKSkge1xuICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gYWN0aXZlIGluZGV4LCBzZXQgZm9jdXMgdG8gdGhlIGZpcnN0IG9wdGlvbi5cbiAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgc2V0IGZvY3VzIHRvIHRoZSBhY3RpdmUgb3B0aW9uLlxuICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKGFjdGl2ZUluZGV4KTtcbiAgICB9XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci4gKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZXM7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XG4gICAgICB0aGlzLl9zZXRPcHRpb25zRnJvbVZhbHVlcyh2YWx1ZXMgfHwgW10pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgLyoqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLiAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHNlbGVjdGVkIG9wdGlvbnMgYmFzZWQgb24gdGhlIHNwZWNpZmllZCB2YWx1ZXMuICovXG4gIHByaXZhdGUgX3NldE9wdGlvbnNGcm9tVmFsdWVzKHZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4gb3B0aW9uLl9zZXRTZWxlY3RlZChmYWxzZSkpO1xuXG4gICAgdmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgY29uc3QgY29ycmVzcG9uZGluZ09wdGlvbiA9IHRoaXMub3B0aW9ucy5maW5kKG9wdGlvbiA9PiB7XG4gICAgICAgIC8vIFNraXAgb3B0aW9ucyB0aGF0IGFyZSBhbHJlYWR5IGluIHRoZSBtb2RlbC4gVGhpcyBhbGxvd3MgdXMgdG8gaGFuZGxlIGNhc2VzXG4gICAgICAgIC8vIHdoZXJlIHRoZSBzYW1lIHByaW1pdGl2ZSB2YWx1ZSBpcyBzZWxlY3RlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICAgICAgcmV0dXJuIG9wdGlvbi5zZWxlY3RlZCA/IGZhbHNlIDogdGhpcy5jb21wYXJlV2l0aChvcHRpb24udmFsdWUsIHZhbHVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoY29ycmVzcG9uZGluZ09wdGlvbikge1xuICAgICAgICBjb3JyZXNwb25kaW5nT3B0aW9uLl9zZXRTZWxlY3RlZCh0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSB2YWx1ZXMgb2YgdGhlIHNlbGVjdGVkIG9wdGlvbnMuICovXG4gIHByaXZhdGUgX2dldFNlbGVjdGVkT3B0aW9uVmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZpbHRlcihvcHRpb24gPT4gb3B0aW9uLnNlbGVjdGVkKS5tYXAob3B0aW9uID0+IG9wdGlvbi52YWx1ZSk7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgc3RhdGUgb2YgdGhlIGN1cnJlbnRseSBmb2N1c2VkIG9wdGlvbiBpZiBlbmFibGVkLiAqL1xuICBwcml2YXRlIF90b2dnbGVGb2N1c2VkT3B0aW9uKCk6IHZvaWQge1xuICAgIGxldCBmb2N1c2VkSW5kZXggPSB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleDtcblxuICAgIGlmIChmb2N1c2VkSW5kZXggIT0gbnVsbCAmJiB0aGlzLl9pc1ZhbGlkSW5kZXgoZm9jdXNlZEluZGV4KSkge1xuICAgICAgbGV0IGZvY3VzZWRPcHRpb246IE1hdExpc3RPcHRpb24gPSB0aGlzLm9wdGlvbnMudG9BcnJheSgpW2ZvY3VzZWRJbmRleF07XG5cbiAgICAgIGlmIChmb2N1c2VkT3B0aW9uICYmICFmb2N1c2VkT3B0aW9uLmRpc2FibGVkICYmICh0aGlzLl9tdWx0aXBsZSB8fCAhZm9jdXNlZE9wdGlvbi5zZWxlY3RlZCkpIHtcbiAgICAgICAgZm9jdXNlZE9wdGlvbi50b2dnbGUoKTtcblxuICAgICAgICAvLyBFbWl0IGEgY2hhbmdlIGV2ZW50IGJlY2F1c2UgdGhlIGZvY3VzZWQgb3B0aW9uIGNoYW5nZWQgaXRzIHN0YXRlIHRocm91Z2ggdXNlclxuICAgICAgICAvLyBpbnRlcmFjdGlvbi5cbiAgICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KGZvY3VzZWRPcHRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzZWxlY3RlZCBzdGF0ZSBvbiBhbGwgb2YgdGhlIG9wdGlvbnNcbiAgICogYW5kIGVtaXRzIGFuIGV2ZW50IGlmIGFueXRoaW5nIGNoYW5nZWQuXG4gICAqL1xuICBwcml2YXRlIF9zZXRBbGxPcHRpb25zU2VsZWN0ZWQoaXNTZWxlY3RlZDogYm9vbGVhbikge1xuICAgIC8vIEtlZXAgdHJhY2sgb2Ygd2hldGhlciBhbnl0aGluZyBjaGFuZ2VkLCBiZWNhdXNlIHdlIG9ubHkgd2FudCB0b1xuICAgIC8vIGVtaXQgdGhlIGNoYW5nZWQgZXZlbnQgd2hlbiBzb21ldGhpbmcgYWN0dWFsbHkgY2hhbmdlZC5cbiAgICBsZXQgaGFzQ2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5vcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgIGlmIChvcHRpb24uX3NldFNlbGVjdGVkKGlzU2VsZWN0ZWQpKSB7XG4gICAgICAgIGhhc0NoYW5nZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGhhc0NoYW5nZWQpIHtcbiAgICAgIHRoaXMuX3JlcG9ydFZhbHVlQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFV0aWxpdHkgdG8gZW5zdXJlIGFsbCBpbmRleGVzIGFyZSB2YWxpZC5cbiAgICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCB0byBiZSBjaGVja2VkLlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBpbmRleCBpcyB2YWxpZCBmb3Igb3VyIGxpc3Qgb2Ygb3B0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgX2lzVmFsaWRJbmRleChpbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLm9wdGlvbnMubGVuZ3RoO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBzcGVjaWZpZWQgbGlzdCBvcHRpb24uICovXG4gIHByaXZhdGUgX2dldE9wdGlvbkluZGV4KG9wdGlvbjogTWF0TGlzdE9wdGlvbik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy50b0FycmF5KCkuaW5kZXhPZihvcHRpb24pO1xuICB9XG5cbiAgLyoqIE1hcmtzIGFsbCB0aGUgb3B0aW9ucyB0byBiZSBjaGVja2VkIGluIHRoZSBuZXh0IGNoYW5nZSBkZXRlY3Rpb24gcnVuLiAqL1xuICBwcml2YXRlIF9tYXJrT3B0aW9uc0ZvckNoZWNrKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiBvcHRpb24uX21hcmtGb3JDaGVjaygpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgdGFiaW5kZXggZnJvbSB0aGUgc2VsZWN0aW9uIGxpc3QgYW5kIHJlc2V0cyBpdCBiYWNrIGFmdGVyd2FyZHMsIGFsbG93aW5nIHRoZSB1c2VyXG4gICAqIHRvIHRhYiBvdXQgb2YgaXQuIFRoaXMgcHJldmVudHMgdGhlIGxpc3QgZnJvbSBjYXB0dXJpbmcgZm9jdXMgYW5kIHJlZGlyZWN0aW5nIGl0IGJhY2sgd2l0aGluXG4gICAqIHRoZSBsaXN0LCBjcmVhdGluZyBhIGZvY3VzIHRyYXAgaWYgaXQgdXNlciB0cmllcyB0byB0YWIgYXdheS5cbiAgICovXG4gIHByaXZhdGUgX2FsbG93Rm9jdXNFc2NhcGUoKSB7XG4gICAgdGhpcy5fdGFiSW5kZXggPSAtMTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fdGFiSW5kZXggPSAwO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgdGFiaW5kZXggYmFzZWQgdXBvbiBpZiB0aGUgc2VsZWN0aW9uIGxpc3QgaXMgZW1wdHkuICovXG4gIHByaXZhdGUgX3VwZGF0ZVRhYkluZGV4KCk6IHZvaWQge1xuICAgIHRoaXMuX3RhYkluZGV4ID0gKHRoaXMub3B0aW9ucy5sZW5ndGggPT09IDApID8gLTEgOiAwO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlUmlwcGxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9tdWx0aXBsZTogQm9vbGVhbklucHV0O1xufVxuIl19