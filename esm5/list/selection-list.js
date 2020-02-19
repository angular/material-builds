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
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, Input, Output, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
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
        if (!this.disabled) {
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
                        '[attr.aria-selected]': 'selected',
                        '[attr.aria-disabled]': 'disabled',
                        '[attr.tabindex]': '-1',
                    },
                    template: "<div class=\"mat-list-item-content\"\n  [class.mat-list-item-content-reverse]=\"checkboxPosition == 'after'\">\n\n  <div mat-ripple\n    class=\"mat-list-item-ripple\"\n    [matRippleTrigger]=\"_getHostElement()\"\n    [matRippleDisabled]=\"_isRippleDisabled()\"></div>\n\n  <mat-pseudo-checkbox\n    [state]=\"selected ? 'checked' : 'unchecked'\"\n    [disabled]=\"disabled\"></mat-pseudo-checkbox>\n\n  <div class=\"mat-list-text\" #text><ng-content></ng-content></div>\n\n  <ng-content select=\"[mat-list-avatar], [mat-list-icon], [matListAvatar], [matListIcon]\">\n  </ng-content>\n\n</div>\n",
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
        _this.selectedOptions = new SelectionModel(true);
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
    MatSelectionList.prototype.ngAfterContentInit = function () {
        var _this = this;
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
            if (focusedOption && !focusedOption.disabled) {
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
                        'aria-multiselectable': 'true',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[attr.tabindex]': '_tabIndex',
                    },
                    template: '<ng-content></ng-content>',
                    encapsulation: ViewEncapsulation.None,
                    providers: [MAT_SELECTION_LIST_VALUE_ACCESSOR],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".mat-subheader{display:flex;box-sizing:border-box;padding:16px;align-items:center}.mat-list-base .mat-subheader{margin:0}.mat-list-base{padding-top:8px;display:block;-webkit-tap-highlight-color:transparent}.mat-list-base .mat-subheader{height:48px;line-height:16px}.mat-list-base .mat-subheader:first-child{margin-top:-8px}.mat-list-base .mat-list-item,.mat-list-base .mat-list-option{display:block;height:48px;-webkit-tap-highlight-color:transparent;width:100%;padding:0}.mat-list-base .mat-list-item .mat-list-item-content,.mat-list-base .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base .mat-list-item .mat-list-item-content-reverse,.mat-list-base .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base .mat-list-item .mat-list-item-ripple,.mat-list-base .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar,.mat-list-base .mat-list-option.mat-list-item-with-avatar{height:56px}.mat-list-base .mat-list-item.mat-2-line,.mat-list-base .mat-list-option.mat-2-line{height:72px}.mat-list-base .mat-list-item.mat-3-line,.mat-list-base .mat-list-option.mat-3-line{height:88px}.mat-list-base .mat-list-item.mat-multi-line,.mat-list-base .mat-list-option.mat-multi-line{height:auto}.mat-list-base .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base .mat-list-item .mat-list-text,.mat-list-base .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base .mat-list-item .mat-list-text>*,.mat-list-base .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base .mat-list-item .mat-list-text:empty,.mat-list-base .mat-list-option .mat-list-text:empty{display:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base .mat-list-item .mat-list-avatar,.mat-list-base .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%;object-fit:cover}.mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:72px;width:calc(100% - 72px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:72px}.mat-list-base .mat-list-item .mat-list-icon,.mat-list-base .mat-list-option .mat-list-icon{flex-shrink:0;width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:64px;width:calc(100% - 64px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:64px}.mat-list-base .mat-list-item .mat-divider,.mat-list-base .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base .mat-list-item .mat-divider,[dir=rtl] .mat-list-base .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-list-base[dense]{padding-top:4px;display:block}.mat-list-base[dense] .mat-subheader{height:40px;line-height:8px}.mat-list-base[dense] .mat-subheader:first-child{margin-top:-4px}.mat-list-base[dense] .mat-list-item,.mat-list-base[dense] .mat-list-option{display:block;height:40px;-webkit-tap-highlight-color:transparent;width:100%;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-item-content,.mat-list-base[dense] .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base[dense] .mat-list-item .mat-list-item-content-reverse,.mat-list-base[dense] .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base[dense] .mat-list-item .mat-list-item-ripple,.mat-list-base[dense] .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar{height:48px}.mat-list-base[dense] .mat-list-item.mat-2-line,.mat-list-base[dense] .mat-list-option.mat-2-line{height:60px}.mat-list-base[dense] .mat-list-item.mat-3-line,.mat-list-base[dense] .mat-list-option.mat-3-line{height:76px}.mat-list-base[dense] .mat-list-item.mat-multi-line,.mat-list-base[dense] .mat-list-option.mat-multi-line{height:auto}.mat-list-base[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base[dense] .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base[dense] .mat-list-item .mat-list-text,.mat-list-base[dense] .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-text>*,.mat-list-base[dense] .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base[dense] .mat-list-item .mat-list-text:empty,.mat-list-base[dense] .mat-list-option .mat-list-text:empty{display:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base[dense] .mat-list-item .mat-list-avatar,.mat-list-base[dense] .mat-list-option .mat-list-avatar{flex-shrink:0;width:36px;height:36px;border-radius:50%;object-fit:cover}.mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:68px;width:calc(100% - 68px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:68px}.mat-list-base[dense] .mat-list-item .mat-list-icon,.mat-list-base[dense] .mat-list-option .mat-list-icon{flex-shrink:0;width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:60px;width:calc(100% - 60px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:60px}.mat-list-base[dense] .mat-list-item .mat-divider,.mat-list-base[dense] .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-divider,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base[dense] .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-nav-list a{text-decoration:none;color:inherit}.mat-nav-list .mat-list-item{cursor:pointer;outline:none}mat-action-list button{background:none;color:inherit;border:none;font:inherit;outline:inherit;-webkit-tap-highlight-color:transparent;text-align:left}[dir=rtl] mat-action-list button{text-align:right}mat-action-list button::-moz-focus-inner{border:0}mat-action-list .mat-list-item{cursor:pointer;outline:inherit}.mat-list-option:not(.mat-list-item-disabled){cursor:pointer;outline:none}.cdk-high-contrast-active .mat-selection-list:focus{outline-style:dotted}.cdk-high-contrast-active .mat-list-option:hover,.cdk-high-contrast-active .mat-list-option:focus,.cdk-high-contrast-active .mat-nav-list .mat-list-item:hover,.cdk-high-contrast-active .mat-nav-list .mat-list-item:focus,.cdk-high-contrast-active mat-action-list .mat-list-item:hover,.cdk-high-contrast-active mat-action-list .mat-list-item:focus{outline:dotted 1px}@media(hover: none){.mat-list-option:not(.mat-list-item-disabled):hover,.mat-nav-list .mat-list-item:not(.mat-list-item-disabled):hover,.mat-action-list .mat-list-item:not(.mat-list-item-disabled):hover{background:none}}\n"]
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
        disabled: [{ type: Input }]
    };
    return MatSelectionList;
}(_MatSelectionListMixinBase));
export { MatSelectionList };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLWxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC9zZWxlY3Rpb24tbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFrQixlQUFlLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRSxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUNMLENBQUMsRUFDRCxVQUFVLEVBQ1YsR0FBRyxFQUNILEtBQUssRUFDTCxjQUFjLEVBQ2QsSUFBSSxFQUNKLEtBQUssRUFDTCxRQUFRLEdBQ1QsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBRUwsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFJTCxNQUFNLEVBQ04sU0FBUyxFQUVULFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZFLE9BQU8sRUFHTCxPQUFPLEVBQ1Asa0JBQWtCLEVBQ2xCLFFBQVEsR0FFVCxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMseUJBQXlCLEVBQUUsdUJBQXVCLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFHMUUsb0JBQW9CO0FBQ3BCO0lBQUE7SUFBNEIs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RUFBRSxTQUFTO3dCQUNqQixPQUFPLEVBQUUsa0NBQWtDO3dCQUMzQyxTQUFTLEVBQUUsWUFBWTt3QkFDdkIsUUFBUSxFQUFFLGNBQWM7d0JBQ3hCLFdBQVcsRUFBRSxrQkFBa0I7d0JBQy9CLHNCQUFzQixFQUFFLE1BQU07d0JBQzlCLHNCQUFzQixFQUFFLHFCQUFxQjt3QkFDN0MsaUJBQWlCLEVBQUUsV0FBVztxQkFDL0I7b0JBQ0QsUUFBUSxFQUFFLDJCQUEyQjtvQkFFckMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLFNBQVMsRUFBRSxDQUFDLGlDQUFpQyxDQUFDO29CQUM5QyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7aUJBQ2hEOzs7O2dCQWxUQyxVQUFVOzZDQXFYUCxTQUFTLFNBQUMsVUFBVTtnQkF6WHZCLGlCQUFpQjs7OzBCQThUaEIsZUFBZSxTQUFDLGFBQWEsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7a0NBR2xELE1BQU07MkJBT04sS0FBSzt3QkFHTCxLQUFLOzhCQU9MLEtBQUs7MkJBR0wsS0FBSzs7SUE0VVIsdUJBQUM7Q0FBQSxBQTlYRCxDQW9Cc0MsMEJBQTBCLEdBMFcvRDtTQTFXWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c2FibGVPcHRpb24sIEZvY3VzS2V5TWFuYWdlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7U2VsZWN0aW9uTW9kZWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge1xuICBBLFxuICBET1dOX0FSUk9XLFxuICBFTkQsXG4gIEVOVEVSLFxuICBoYXNNb2RpZmllcktleSxcbiAgSE9NRSxcbiAgU1BBQ0UsXG4gIFVQX0FSUk9XLFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIENhbkRpc2FibGVSaXBwbGVDdG9yLFxuICBNYXRMaW5lLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIHNldExpbmVzLFxuICBUaGVtZVBhbGV0dGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRoLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyLCBNYXRMaXN0SWNvbkNzc01hdFN0eWxlcn0gZnJvbSAnLi9saXN0JztcblxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0U2VsZWN0aW9uTGlzdEJhc2Uge31cbmNvbnN0IF9NYXRTZWxlY3Rpb25MaXN0TWl4aW5CYXNlOiBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmIHR5cGVvZiBNYXRTZWxlY3Rpb25MaXN0QmFzZSA9XG4gICAgbWl4aW5EaXNhYmxlUmlwcGxlKE1hdFNlbGVjdGlvbkxpc3RCYXNlKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdExpc3RPcHRpb25CYXNlIHt9XG5jb25zdCBfTWF0TGlzdE9wdGlvbk1peGluQmFzZTogQ2FuRGlzYWJsZVJpcHBsZUN0b3IgJiB0eXBlb2YgTWF0TGlzdE9wdGlvbkJhc2UgPVxuICAgIG1peGluRGlzYWJsZVJpcHBsZShNYXRMaXN0T3B0aW9uQmFzZSk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX1NFTEVDVElPTl9MSVNUX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRTZWxlY3Rpb25MaXN0KSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKiBDaGFuZ2UgZXZlbnQgdGhhdCBpcyBiZWluZyBmaXJlZCB3aGVuZXZlciB0aGUgc2VsZWN0ZWQgc3RhdGUgb2YgYW4gb3B0aW9uIGNoYW5nZXMuICovXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0aW9uTGlzdENoYW5nZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIHNlbGVjdGlvbiBsaXN0IHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0U2VsZWN0aW9uTGlzdCxcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBvcHRpb24gdGhhdCBoYXMgYmVlbiBjaGFuZ2VkLiAqL1xuICAgIHB1YmxpYyBvcHRpb246IE1hdExpc3RPcHRpb24pIHt9XG59XG5cbi8qKlxuICogQ29tcG9uZW50IGZvciBsaXN0LW9wdGlvbnMgb2Ygc2VsZWN0aW9uLWxpc3QuIEVhY2ggbGlzdC1vcHRpb24gY2FuIGF1dG9tYXRpY2FsbHlcbiAqIGdlbmVyYXRlIGEgY2hlY2tib3ggYW5kIGNhbiBwdXQgY3VycmVudCBpdGVtIGludG8gdGhlIHNlbGVjdGlvbk1vZGVsIG9mIHNlbGVjdGlvbi1saXN0XG4gKiBpZiB0aGUgY3VycmVudCBpdGVtIGlzIHNlbGVjdGVkLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtbGlzdC1vcHRpb24nLFxuICBleHBvcnRBczogJ21hdExpc3RPcHRpb24nLFxuICBpbnB1dHM6IFsnZGlzYWJsZVJpcHBsZSddLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnb3B0aW9uJyxcbiAgICAnY2xhc3MnOiAnbWF0LWxpc3QtaXRlbSBtYXQtbGlzdC1vcHRpb24nLFxuICAgICcoZm9jdXMpJzogJ19oYW5kbGVGb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ19oYW5kbGVCbHVyKCknLFxuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygpJyxcbiAgICAnW2NsYXNzLm1hdC1saXN0LWl0ZW0tZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1saXN0LWl0ZW0td2l0aC1hdmF0YXJdJzogJ19hdmF0YXIgfHwgX2ljb24nLFxuICAgIC8vIE1hbnVhbGx5IHNldCB0aGUgXCJwcmltYXJ5XCIgb3IgXCJ3YXJuXCIgY2xhc3MgaWYgdGhlIGNvbG9yIGhhcyBiZWVuIGV4cGxpY2l0bHlcbiAgICAvLyBzZXQgdG8gXCJwcmltYXJ5XCIgb3IgXCJ3YXJuXCIuIFRoZSBwc2V1ZG8gY2hlY2tib3ggcGlja3MgdXAgdGhlc2UgY2xhc3NlcyBmb3JcbiAgICAvLyBpdHMgdGhlbWUuXG4gICAgJ1tjbGFzcy5tYXQtcHJpbWFyeV0nOiAnY29sb3IgPT09IFwicHJpbWFyeVwiJyxcbiAgICAvLyBFdmVuIHRob3VnaCBhY2NlbnQgaXMgdGhlIGRlZmF1bHQsIHdlIG5lZWQgdG8gc2V0IHRoaXMgY2xhc3MgYW55d2F5LCBiZWNhdXNlIHRoZSAgbGlzdCBtaWdodFxuICAgIC8vIGJlIHBsYWNlZCBpbnNpZGUgYSBwYXJlbnQgdGhhdCBoYXMgb25lIG9mIHRoZSBvdGhlciBjb2xvcnMgd2l0aCBhIGhpZ2hlciBzcGVjaWZpY2l0eS5cbiAgICAnW2NsYXNzLm1hdC1hY2NlbnRdJzogJ2NvbG9yICE9PSBcInByaW1hcnlcIiAmJiBjb2xvciAhPT0gXCJ3YXJuXCInLFxuICAgICdbY2xhc3MubWF0LXdhcm5dJzogJ2NvbG9yID09PSBcIndhcm5cIicsXG4gICAgJ1thdHRyLmFyaWEtc2VsZWN0ZWRdJzogJ3NlbGVjdGVkJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnLTEnLFxuICB9LFxuICB0ZW1wbGF0ZVVybDogJ2xpc3Qtb3B0aW9uLmh0bWwnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGlzdE9wdGlvbiBleHRlbmRzIF9NYXRMaXN0T3B0aW9uTWl4aW5CYXNlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9uSW5pdCwgRm9jdXNhYmxlT3B0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhbkRpc2FibGVSaXBwbGUge1xuICBwcml2YXRlIF9zZWxlY3RlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9oYXNGb2N1cyA9IGZhbHNlO1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0TGlzdEF2YXRhckNzc01hdFN0eWxlcikgX2F2YXRhcjogTWF0TGlzdEF2YXRhckNzc01hdFN0eWxlcjtcbiAgQENvbnRlbnRDaGlsZChNYXRMaXN0SWNvbkNzc01hdFN0eWxlcikgX2ljb246IE1hdExpc3RJY29uQ3NzTWF0U3R5bGVyO1xuICBAQ29udGVudENoaWxkcmVuKE1hdExpbmUsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9saW5lczogUXVlcnlMaXN0PE1hdExpbmU+O1xuXG4gIC8qKiBET00gZWxlbWVudCBjb250YWluaW5nIHRoZSBpdGVtJ3MgdGV4dC4gKi9cbiAgQFZpZXdDaGlsZCgndGV4dCcpIF90ZXh0OiBFbGVtZW50UmVmO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgYXBwZWFyIGJlZm9yZSBvciBhZnRlciB0aGUgY2hlY2tib3guIERlZmF1bHRzIHRvICdhZnRlcicgKi9cbiAgQElucHV0KCkgY2hlY2tib3hQb3NpdGlvbjogJ2JlZm9yZScgfCAnYWZ0ZXInID0gJ2FmdGVyJztcblxuICAvKiogVGhlbWUgY29sb3Igb2YgdGhlIGxpc3Qgb3B0aW9uLiBUaGlzIHNldHMgdGhlIGNvbG9yIG9mIHRoZSBjaGVja2JveC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGNvbG9yKCk6IFRoZW1lUGFsZXR0ZSB7IHJldHVybiB0aGlzLl9jb2xvciB8fCB0aGlzLnNlbGVjdGlvbkxpc3QuY29sb3I7IH1cbiAgc2V0IGNvbG9yKG5ld1ZhbHVlOiBUaGVtZVBhbGV0dGUpIHsgdGhpcy5fY29sb3IgPSBuZXdWYWx1ZTsgfVxuICBwcml2YXRlIF9jb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKlxuICAgKiBUaGlzIGlzIHNldCB0byB0cnVlIGFmdGVyIHRoZSBmaXJzdCBPbkNoYW5nZXMgY3ljbGUgc28gd2UgZG9uJ3QgY2xlYXIgdGhlIHZhbHVlIG9mIGBzZWxlY3RlZGBcbiAgICogaW4gdGhlIGZpcnN0IGN5Y2xlLlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5wdXRzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgLyoqIFZhbHVlIG9mIHRoZSBvcHRpb24gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLnNlbGVjdGVkICYmIG5ld1ZhbHVlICE9PSB0aGlzLnZhbHVlICYmIHRoaXMuX2lucHV0c0luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgfVxuICBwcml2YXRlIF92YWx1ZTogYW55O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBvcHRpb24gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVkIHx8ICh0aGlzLnNlbGVjdGlvbkxpc3QgJiYgdGhpcy5zZWxlY3Rpb25MaXN0LmRpc2FibGVkKTsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGFueSkge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgb3B0aW9uIGlzIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnNlbGVjdGlvbkxpc3Quc2VsZWN0ZWRPcHRpb25zLmlzU2VsZWN0ZWQodGhpcyk7IH1cbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAoaXNTZWxlY3RlZCAhPT0gdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NldFNlbGVjdGVkKGlzU2VsZWN0ZWQpO1xuICAgICAgdGhpcy5zZWxlY3Rpb25MaXN0Ll9yZXBvcnRWYWx1ZUNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIC8qKiBAZG9jcy1wcml2YXRlICovXG4gICAgICAgICAgICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBNYXRTZWxlY3Rpb25MaXN0KSkgcHVibGljIHNlbGVjdGlvbkxpc3Q6IE1hdFNlbGVjdGlvbkxpc3QpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuc2VsZWN0aW9uTGlzdDtcblxuICAgIGlmIChsaXN0Ll92YWx1ZSAmJiBsaXN0Ll92YWx1ZS5zb21lKHZhbHVlID0+IGxpc3QuY29tcGFyZVdpdGgodmFsdWUsIHRoaXMuX3ZhbHVlKSkpIHtcbiAgICAgIHRoaXMuX3NldFNlbGVjdGVkKHRydWUpO1xuICAgIH1cblxuICAgIGNvbnN0IHdhc1NlbGVjdGVkID0gdGhpcy5fc2VsZWN0ZWQ7XG5cbiAgICAvLyBMaXN0IG9wdGlvbnMgdGhhdCBhcmUgc2VsZWN0ZWQgYXQgaW5pdGlhbGl6YXRpb24gY2FuJ3QgYmUgcmVwb3J0ZWQgcHJvcGVybHkgdG8gdGhlIGZvcm1cbiAgICAvLyBjb250cm9sLiBUaGlzIGlzIGJlY2F1c2UgaXQgdGFrZXMgc29tZSB0aW1lIHVudGlsIHRoZSBzZWxlY3Rpb24tbGlzdCBrbm93cyBhYm91dCBhbGxcbiAgICAvLyBhdmFpbGFibGUgb3B0aW9ucy4gQWxzbyBpdCBjYW4gaGFwcGVuIHRoYXQgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGhhcyBhbiBpbml0aWFsIHZhbHVlXG4gICAgLy8gdGhhdCBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkLiBEZWZlcnJpbmcgdGhlIHZhbHVlIGNoYW5nZSByZXBvcnQgdG8gdGhlIG5leHQgdGljayBlbnN1cmVzXG4gICAgLy8gdGhhdCB0aGUgZm9ybSBjb250cm9sIHZhbHVlIGlzIG5vdCBiZWluZyBvdmVyd3JpdHRlbi5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9zZWxlY3RlZCB8fCB3YXNTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5faW5wdXRzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHNldExpbmVzKHRoaXMuX2xpbmVzLCB0aGlzLl9lbGVtZW50KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNlbGVjdGVkKSB7XG4gICAgICAvLyBXZSBoYXZlIHRvIGRlbGF5IHRoaXMgdW50aWwgdGhlIG5leHQgdGljayBpbiBvcmRlclxuICAgICAgLy8gdG8gYXZvaWQgY2hhbmdlZCBhZnRlciBjaGVja2VkIGVycm9ycy5cbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBoYWRGb2N1cyA9IHRoaXMuX2hhc0ZvY3VzO1xuICAgIGNvbnN0IG5ld0FjdGl2ZUl0ZW0gPSB0aGlzLnNlbGVjdGlvbkxpc3QuX3JlbW92ZU9wdGlvbkZyb21MaXN0KHRoaXMpO1xuXG4gICAgLy8gT25seSBtb3ZlIGZvY3VzIGlmIHRoaXMgb3B0aW9uIHdhcyBmb2N1c2VkIGF0IHRoZSB0aW1lIGl0IHdhcyBkZXN0cm95ZWQuXG4gICAgaWYgKGhhZEZvY3VzICYmIG5ld0FjdGl2ZUl0ZW0pIHtcbiAgICAgIG5ld0FjdGl2ZUl0ZW0uZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgc2VsZWN0aW9uIHN0YXRlIG9mIHRoZSBvcHRpb24uICovXG4gIHRvZ2dsZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdGVkID0gIXRoaXMuc2VsZWN0ZWQ7XG4gIH1cblxuICAvKiogQWxsb3dzIGZvciBwcm9ncmFtbWF0aWMgZm9jdXNpbmcgb2YgdGhlIG9wdGlvbi4gKi9cbiAgZm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbGlzdCBpdGVtJ3MgdGV4dCBsYWJlbC4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIHRoZSBGb2N1c0tleU1hbmFnZXIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldExhYmVsKCkge1xuICAgIHJldHVybiB0aGlzLl90ZXh0ID8gKHRoaXMuX3RleHQubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudCB8fCAnJykgOiAnJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgbGlzdCBpdGVtIHNob3VsZCBzaG93IGEgcmlwcGxlIGVmZmVjdCB3aGVuIGNsaWNrZWQuICovXG4gIF9pc1JpcHBsZURpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVJpcHBsZSB8fCB0aGlzLnNlbGVjdGlvbkxpc3QuZGlzYWJsZVJpcHBsZTtcbiAgfVxuXG4gIF9oYW5kbGVDbGljaygpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMudG9nZ2xlKCk7XG5cbiAgICAgIC8vIEVtaXQgYSBjaGFuZ2UgZXZlbnQgaWYgdGhlIHNlbGVjdGVkIHN0YXRlIG9mIHRoZSBvcHRpb24gY2hhbmdlZCB0aHJvdWdoIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgICB0aGlzLnNlbGVjdGlvbkxpc3QuX2VtaXRDaGFuZ2VFdmVudCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlRm9jdXMoKSB7XG4gICAgdGhpcy5zZWxlY3Rpb25MaXN0Ll9zZXRGb2N1c2VkT3B0aW9uKHRoaXMpO1xuICAgIHRoaXMuX2hhc0ZvY3VzID0gdHJ1ZTtcbiAgfVxuXG4gIF9oYW5kbGVCbHVyKCkge1xuICAgIHRoaXMuc2VsZWN0aW9uTGlzdC5fb25Ub3VjaGVkKCk7XG4gICAgdGhpcy5faGFzRm9jdXMgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBSZXRyaWV2ZXMgdGhlIERPTSBlbGVtZW50IG9mIHRoZSBjb21wb25lbnQgaG9zdC4gKi9cbiAgX2dldEhvc3RFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHNlbGVjdGVkIHN0YXRlIG9mIHRoZSBvcHRpb24uIFJldHVybnMgd2hldGhlciB0aGUgdmFsdWUgaGFzIGNoYW5nZWQuICovXG4gIF9zZXRTZWxlY3RlZChzZWxlY3RlZDogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGlmIChzZWxlY3RlZCA9PT0gdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLl9zZWxlY3RlZCA9IHNlbGVjdGVkO1xuXG4gICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkxpc3Quc2VsZWN0ZWRPcHRpb25zLnNlbGVjdCh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3Rpb25MaXN0LnNlbGVjdGVkT3B0aW9ucy5kZXNlbGVjdCh0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3RpZmllcyBBbmd1bGFyIHRoYXQgdGhlIG9wdGlvbiBuZWVkcyB0byBiZSBjaGVja2VkIGluIHRoZSBuZXh0IGNoYW5nZSBkZXRlY3Rpb24gcnVuLiBNYWlubHlcbiAgICogdXNlZCB0byB0cmlnZ2VyIGFuIHVwZGF0ZSBvZiB0aGUgbGlzdCBvcHRpb24gaWYgdGhlIGRpc2FibGVkIHN0YXRlIG9mIHRoZSBzZWxlY3Rpb24gbGlzdFxuICAgKiBjaGFuZ2VkLlxuICAgKi9cbiAgX21hcmtGb3JDaGVjaygpIHtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2VsZWN0ZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbn1cblxuXG4vKipcbiAqIE1hdGVyaWFsIERlc2lnbiBsaXN0IGNvbXBvbmVudCB3aGVyZSBlYWNoIGl0ZW0gaXMgYSBzZWxlY3RhYmxlIG9wdGlvbi4gQmVoYXZlcyBhcyBhIGxpc3Rib3guXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1zZWxlY3Rpb24tbGlzdCcsXG4gIGV4cG9ydEFzOiAnbWF0U2VsZWN0aW9uTGlzdCcsXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJ10sXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdsaXN0Ym94JyxcbiAgICAnY2xhc3MnOiAnbWF0LXNlbGVjdGlvbi1saXN0IG1hdC1saXN0LWJhc2UnLFxuICAgICcoZm9jdXMpJzogJ19vbkZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX29uVG91Y2hlZCgpJyxcbiAgICAnKGtleWRvd24pJzogJ19rZXlkb3duKCRldmVudCknLFxuICAgICdhcmlhLW11bHRpc2VsZWN0YWJsZSc6ICd0cnVlJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdfdGFiSW5kZXgnLFxuICB9LFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBzdHlsZVVybHM6IFsnbGlzdC5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbTUFUX1NFTEVDVElPTl9MSVNUX1ZBTFVFX0FDQ0VTU09SXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0aW9uTGlzdCBleHRlbmRzIF9NYXRTZWxlY3Rpb25MaXN0TWl4aW5CYXNlIGltcGxlbWVudHMgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgQWZ0ZXJDb250ZW50SW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcblxuICAvKiogVGhlIEZvY3VzS2V5TWFuYWdlciB3aGljaCBoYW5kbGVzIGZvY3VzLiAqL1xuICBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdExpc3RPcHRpb24+O1xuXG4gIC8qKiBUaGUgb3B0aW9uIGNvbXBvbmVudHMgY29udGFpbmVkIHdpdGhpbiB0aGlzIHNlbGVjdGlvbi1saXN0LiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdExpc3RPcHRpb24sIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbnM6IFF1ZXJ5TGlzdDxNYXRMaXN0T3B0aW9uPjtcblxuICAvKiogRW1pdHMgYSBjaGFuZ2UgZXZlbnQgd2hlbmV2ZXIgdGhlIHNlbGVjdGVkIHN0YXRlIG9mIGFuIG9wdGlvbiBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0U2VsZWN0aW9uTGlzdENoYW5nZT4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlPigpO1xuXG4gIC8qKlxuICAgKiBUYWJpbmRleCBvZiB0aGUgc2VsZWN0aW9uIGxpc3QuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIFJlbW92ZSBgdGFiSW5kZXhgIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCkgdGFiSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgLyoqIFRoZW1lIGNvbG9yIG9mIHRoZSBzZWxlY3Rpb24gbGlzdC4gVGhpcyBzZXRzIHRoZSBjaGVja2JveCBjb2xvciBmb3IgYWxsIGxpc3Qgb3B0aW9ucy4gKi9cbiAgQElucHV0KCkgY29sb3I6IFRoZW1lUGFsZXR0ZSA9ICdhY2NlbnQnO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB1c2VkIGZvciBjb21wYXJpbmcgYW4gb3B0aW9uIGFnYWluc3QgdGhlIHNlbGVjdGVkIHZhbHVlIHdoZW4gZGV0ZXJtaW5pbmcgd2hpY2hcbiAgICogb3B0aW9ucyBzaG91bGQgYXBwZWFyIGFzIHNlbGVjdGVkLiBUaGUgZmlyc3QgYXJndW1lbnQgaXMgdGhlIHZhbHVlIG9mIGFuIG9wdGlvbnMuIFRoZSBzZWNvbmRcbiAgICogb25lIGlzIGEgdmFsdWUgZnJvbSB0aGUgc2VsZWN0ZWQgdmFsdWUuIEEgYm9vbGVhbiBtdXN0IGJlIHJldHVybmVkLlxuICAgKi9cbiAgQElucHV0KCkgY29tcGFyZVdpdGg6IChvMTogYW55LCBvMjogYW55KSA9PiBib29sZWFuID0gKGExLCBhMikgPT4gYTEgPT09IGEyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3Rpb24gbGlzdCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgLy8gVGhlIGBNYXRTZWxlY3Rpb25MaXN0YCBhbmQgYE1hdExpc3RPcHRpb25gIGFyZSB1c2luZyB0aGUgYE9uUHVzaGAgY2hhbmdlIGRldGVjdGlvblxuICAgIC8vIHN0cmF0ZWd5LiBUaGVyZWZvcmUgdGhlIG9wdGlvbnMgd2lsbCBub3QgY2hlY2sgZm9yIGFueSBjaGFuZ2VzIGlmIHRoZSBgTWF0U2VsZWN0aW9uTGlzdGBcbiAgICAvLyBjaGFuZ2VkIGl0cyBzdGF0ZS4gU2luY2Ugd2Uga25vdyB0aGF0IGEgY2hhbmdlIHRvIGBkaXNhYmxlZGAgcHJvcGVydHkgb2YgdGhlIGxpc3QgYWZmZWN0c1xuICAgIC8vIHRoZSBzdGF0ZSBvZiB0aGUgb3B0aW9ucywgd2UgbWFudWFsbHkgbWFyayBlYWNoIG9wdGlvbiBmb3IgY2hlY2suXG4gICAgdGhpcy5fbWFya09wdGlvbnNGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgb3B0aW9ucy4gKi9cbiAgc2VsZWN0ZWRPcHRpb25zOiBTZWxlY3Rpb25Nb2RlbDxNYXRMaXN0T3B0aW9uPiA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxNYXRMaXN0T3B0aW9uPih0cnVlKTtcblxuICAvKiogVGhlIHRhYmluZGV4IG9mIHRoZSBzZWxlY3Rpb24gbGlzdC4gKi9cbiAgX3RhYkluZGV4ID0gLTE7XG5cbiAgLyoqIFZpZXcgdG8gbW9kZWwgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIHdoZW5ldmVyIHRoZSBzZWxlY3RlZCBvcHRpb25zIGNoYW5nZS4gKi9cbiAgcHJpdmF0ZSBfb25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKF86IGFueSkgPT4ge307XG5cbiAgLyoqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50bHktc2VsZWN0ZWQgdmFsdWUuICovXG4gIF92YWx1ZTogc3RyaW5nW118bnVsbDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgbGlzdCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFZpZXcgdG8gbW9kZWwgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIGlmIHRoZSBsaXN0IG9yIGl0cyBvcHRpb25zIGxvc3QgZm9jdXMuICovXG4gIF9vblRvdWNoZWQ6ICgpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogV2hldGhlciB0aGUgbGlzdCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgX2lzRGVzdHJveWVkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIFJlbW92ZSBgdGFiSW5kZXhgIHBhcmFtZXRlci5cbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcjxNYXRMaXN0T3B0aW9uPih0aGlzLm9wdGlvbnMpXG4gICAgICAud2l0aFdyYXAoKVxuICAgICAgLndpdGhUeXBlQWhlYWQoKVxuICAgICAgLy8gQWxsb3cgZGlzYWJsZWQgaXRlbXMgdG8gYmUgZm9jdXNhYmxlLiBGb3IgYWNjZXNzaWJpbGl0eSByZWFzb25zLCB0aGVyZSBtdXN0IGJlIGEgd2F5IGZvclxuICAgICAgLy8gc2NyZWVucmVhZGVyIHVzZXJzLCB0aGF0IGFsbG93cyByZWFkaW5nIHRoZSBkaWZmZXJlbnQgb3B0aW9ucyBvZiB0aGUgbGlzdC5cbiAgICAgIC5za2lwUHJlZGljYXRlKCgpID0+IGZhbHNlKVxuICAgICAgLndpdGhBbGxvd2VkTW9kaWZpZXJLZXlzKFsnc2hpZnRLZXknXSk7XG5cbiAgICBpZiAodGhpcy5fdmFsdWUpIHtcbiAgICAgIHRoaXMuX3NldE9wdGlvbnNGcm9tVmFsdWVzKHRoaXMuX3ZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdXNlciBhdHRlbXB0cyB0byB0YWIgb3V0IG9mIHRoZSBzZWxlY3Rpb24gbGlzdCwgYWxsb3cgZm9jdXMgdG8gZXNjYXBlLlxuICAgIHRoaXMuX2tleU1hbmFnZXIudGFiT3V0LnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9hbGxvd0ZvY3VzRXNjYXBlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBXaGVuIHRoZSBudW1iZXIgb2Ygb3B0aW9ucyBjaGFuZ2UsIHVwZGF0ZSB0aGUgdGFiaW5kZXggb2YgdGhlIHNlbGVjdGlvbiBsaXN0LlxuICAgIHRoaXMub3B0aW9ucy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3VwZGF0ZVRhYkluZGV4KCk7XG4gICAgfSk7XG5cbiAgICAvLyBTeW5jIGV4dGVybmFsIGNoYW5nZXMgdG8gdGhlIG1vZGVsIGJhY2sgdG8gdGhlIG9wdGlvbnMuXG4gICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMuY2hhbmdlZC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKGV2ZW50LmFkZGVkKSB7XG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgZXZlbnQuYWRkZWQpIHtcbiAgICAgICAgICBpdGVtLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnQucmVtb3ZlZCkge1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGV2ZW50LnJlbW92ZWQpIHtcbiAgICAgICAgICBpdGVtLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBkaXNhYmxlUmlwcGxlQ2hhbmdlcyA9IGNoYW5nZXNbJ2Rpc2FibGVSaXBwbGUnXTtcbiAgICBjb25zdCBjb2xvckNoYW5nZXMgPSBjaGFuZ2VzWydjb2xvciddO1xuXG4gICAgaWYgKChkaXNhYmxlUmlwcGxlQ2hhbmdlcyAmJiAhZGlzYWJsZVJpcHBsZUNoYW5nZXMuZmlyc3RDaGFuZ2UpIHx8XG4gICAgICAgIChjb2xvckNoYW5nZXMgJiYgIWNvbG9yQ2hhbmdlcy5maXJzdENoYW5nZSkpIHtcbiAgICAgIHRoaXMuX21hcmtPcHRpb25zRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2lzRGVzdHJveWVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBzZWxlY3Rpb24gbGlzdC4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIGFsbCBvZiB0aGUgb3B0aW9ucy4gKi9cbiAgc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuX3NldEFsbE9wdGlvbnNTZWxlY3RlZCh0cnVlKTtcbiAgfVxuXG4gIC8qKiBEZXNlbGVjdHMgYWxsIG9mIHRoZSBvcHRpb25zLiAqL1xuICBkZXNlbGVjdEFsbCgpIHtcbiAgICB0aGlzLl9zZXRBbGxPcHRpb25zU2VsZWN0ZWQoZmFsc2UpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGZvY3VzZWQgb3B0aW9uIG9mIHRoZSBzZWxlY3Rpb24tbGlzdC4gKi9cbiAgX3NldEZvY3VzZWRPcHRpb24ob3B0aW9uOiBNYXRMaXN0T3B0aW9uKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKG9wdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbiBvcHRpb24gZnJvbSB0aGUgc2VsZWN0aW9uIGxpc3QgYW5kIHVwZGF0ZXMgdGhlIGFjdGl2ZSBpdGVtLlxuICAgKiBAcmV0dXJucyBDdXJyZW50bHktYWN0aXZlIGl0ZW0uXG4gICAqL1xuICBfcmVtb3ZlT3B0aW9uRnJvbUxpc3Qob3B0aW9uOiBNYXRMaXN0T3B0aW9uKTogTWF0TGlzdE9wdGlvbiB8IG51bGwge1xuICAgIGNvbnN0IG9wdGlvbkluZGV4ID0gdGhpcy5fZ2V0T3B0aW9uSW5kZXgob3B0aW9uKTtcblxuICAgIGlmIChvcHRpb25JbmRleCA+IC0xICYmIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4ID09PSBvcHRpb25JbmRleCkge1xuICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgb3B0aW9uIGlzIHRoZSBsYXN0IGl0ZW1cbiAgICAgIGlmIChvcHRpb25JbmRleCA+IDApIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKG9wdGlvbkluZGV4IC0gMSk7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbkluZGV4ID09PSAwICYmIHRoaXMub3B0aW9ucy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShNYXRoLm1pbihvcHRpb25JbmRleCArIDEsIHRoaXMub3B0aW9ucy5sZW5ndGggLSAxKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbTtcbiAgfVxuXG4gIC8qKiBQYXNzZXMgcmVsZXZhbnQga2V5IHByZXNzZXMgdG8gb3VyIGtleSBtYW5hZ2VyLiAqL1xuICBfa2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuICAgIGNvbnN0IHByZXZpb3VzRm9jdXNJbmRleCA9IG1hbmFnZXIuYWN0aXZlSXRlbUluZGV4O1xuICAgIGNvbnN0IGhhc01vZGlmaWVyID0gaGFzTW9kaWZpZXJLZXkoZXZlbnQpO1xuXG4gICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICBjYXNlIFNQQUNFOlxuICAgICAgY2FzZSBFTlRFUjpcbiAgICAgICAgaWYgKCFoYXNNb2RpZmllciAmJiAhbWFuYWdlci5pc1R5cGluZygpKSB7XG4gICAgICAgICAgdGhpcy5fdG9nZ2xlRm9jdXNlZE9wdGlvbigpO1xuICAgICAgICAgIC8vIEFsd2F5cyBwcmV2ZW50IHNwYWNlIGZyb20gc2Nyb2xsaW5nIHRoZSBwYWdlIHNpbmNlIHRoZSBsaXN0IGhhcyBmb2N1c1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEhPTUU6XG4gICAgICBjYXNlIEVORDpcbiAgICAgICAgaWYgKCFoYXNNb2RpZmllcikge1xuICAgICAgICAgIGtleUNvZGUgPT09IEhPTUUgPyBtYW5hZ2VyLnNldEZpcnN0SXRlbUFjdGl2ZSgpIDogbWFuYWdlci5zZXRMYXN0SXRlbUFjdGl2ZSgpO1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEE6XG4gICAgICAgIGlmIChoYXNNb2RpZmllcktleShldmVudCwgJ2N0cmxLZXknKSAmJiAhbWFuYWdlci5pc1R5cGluZygpKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLmZpbmQob3B0aW9uID0+ICFvcHRpb24uc2VsZWN0ZWQpID8gdGhpcy5zZWxlY3RBbGwoKSA6IHRoaXMuZGVzZWxlY3RBbGwoKTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgIH1cblxuICAgIGlmICgoa2V5Q29kZSA9PT0gVVBfQVJST1cgfHwga2V5Q29kZSA9PT0gRE9XTl9BUlJPVykgJiYgZXZlbnQuc2hpZnRLZXkgJiZcbiAgICAgICAgbWFuYWdlci5hY3RpdmVJdGVtSW5kZXggIT09IHByZXZpb3VzRm9jdXNJbmRleCkge1xuICAgICAgdGhpcy5fdG9nZ2xlRm9jdXNlZE9wdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXBvcnRzIGEgdmFsdWUgY2hhbmdlIHRvIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciAqL1xuICBfcmVwb3J0VmFsdWVDaGFuZ2UoKSB7XG4gICAgLy8gU3RvcCByZXBvcnRpbmcgdmFsdWUgY2hhbmdlcyBhZnRlciB0aGUgbGlzdCBoYXMgYmVlbiBkZXN0cm95ZWQuIFRoaXMgYXZvaWRzXG4gICAgLy8gY2FzZXMgd2hlcmUgdGhlIGxpc3QgbWlnaHQgd3JvbmdseSByZXNldCBpdHMgdmFsdWUgb25jZSBpdCBpcyByZW1vdmVkLCBidXRcbiAgICAvLyB0aGUgZm9ybSBjb250cm9sIGlzIHN0aWxsIGxpdmUuXG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiAhdGhpcy5faXNEZXN0cm95ZWQpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fZ2V0U2VsZWN0ZWRPcHRpb25WYWx1ZXMoKTtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlKTtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVtaXRzIGEgY2hhbmdlIGV2ZW50IGlmIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiBhbiBvcHRpb24gY2hhbmdlZC4gKi9cbiAgX2VtaXRDaGFuZ2VFdmVudChvcHRpb246IE1hdExpc3RPcHRpb24pIHtcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KG5ldyBNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlKHRoaXMsIG9wdGlvbikpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIHNlbGVjdGlvbiBsaXN0IGlzIGZvY3VzZWQsIHdlIHdhbnQgdG8gbW92ZSBmb2N1cyB0byBhbiBvcHRpb24gd2l0aGluIHRoZSBsaXN0LiBEbyB0aGlzXG4gICAqIGJ5IHNldHRpbmcgdGhlIGFwcHJvcHJpYXRlIG9wdGlvbiB0byBiZSBhY3RpdmUuXG4gICAqL1xuICBfb25Gb2N1cygpOiB2b2lkIHtcbiAgICBjb25zdCBhY3RpdmVJbmRleCA9IHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4O1xuXG4gICAgaWYgKCFhY3RpdmVJbmRleCB8fCAoYWN0aXZlSW5kZXggPT09IC0xKSkge1xuICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gYWN0aXZlIGluZGV4LCBzZXQgZm9jdXMgdG8gdGhlIGZpcnN0IG9wdGlvbi5cbiAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgc2V0IGZvY3VzIHRvIHRoZSBhY3RpdmUgb3B0aW9uLlxuICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKGFjdGl2ZUluZGV4KTtcbiAgICB9XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci4gKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZXM7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XG4gICAgICB0aGlzLl9zZXRPcHRpb25zRnJvbVZhbHVlcyh2YWx1ZXMgfHwgW10pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgLyoqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLiAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHNlbGVjdGVkIG9wdGlvbnMgYmFzZWQgb24gdGhlIHNwZWNpZmllZCB2YWx1ZXMuICovXG4gIHByaXZhdGUgX3NldE9wdGlvbnNGcm9tVmFsdWVzKHZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4gb3B0aW9uLl9zZXRTZWxlY3RlZChmYWxzZSkpO1xuXG4gICAgdmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgY29uc3QgY29ycmVzcG9uZGluZ09wdGlvbiA9IHRoaXMub3B0aW9ucy5maW5kKG9wdGlvbiA9PiB7XG4gICAgICAgIC8vIFNraXAgb3B0aW9ucyB0aGF0IGFyZSBhbHJlYWR5IGluIHRoZSBtb2RlbC4gVGhpcyBhbGxvd3MgdXMgdG8gaGFuZGxlIGNhc2VzXG4gICAgICAgIC8vIHdoZXJlIHRoZSBzYW1lIHByaW1pdGl2ZSB2YWx1ZSBpcyBzZWxlY3RlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICAgICAgcmV0dXJuIG9wdGlvbi5zZWxlY3RlZCA/IGZhbHNlIDogdGhpcy5jb21wYXJlV2l0aChvcHRpb24udmFsdWUsIHZhbHVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoY29ycmVzcG9uZGluZ09wdGlvbikge1xuICAgICAgICBjb3JyZXNwb25kaW5nT3B0aW9uLl9zZXRTZWxlY3RlZCh0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSB2YWx1ZXMgb2YgdGhlIHNlbGVjdGVkIG9wdGlvbnMuICovXG4gIHByaXZhdGUgX2dldFNlbGVjdGVkT3B0aW9uVmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZpbHRlcihvcHRpb24gPT4gb3B0aW9uLnNlbGVjdGVkKS5tYXAob3B0aW9uID0+IG9wdGlvbi52YWx1ZSk7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgc3RhdGUgb2YgdGhlIGN1cnJlbnRseSBmb2N1c2VkIG9wdGlvbiBpZiBlbmFibGVkLiAqL1xuICBwcml2YXRlIF90b2dnbGVGb2N1c2VkT3B0aW9uKCk6IHZvaWQge1xuICAgIGxldCBmb2N1c2VkSW5kZXggPSB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleDtcblxuICAgIGlmIChmb2N1c2VkSW5kZXggIT0gbnVsbCAmJiB0aGlzLl9pc1ZhbGlkSW5kZXgoZm9jdXNlZEluZGV4KSkge1xuICAgICAgbGV0IGZvY3VzZWRPcHRpb246IE1hdExpc3RPcHRpb24gPSB0aGlzLm9wdGlvbnMudG9BcnJheSgpW2ZvY3VzZWRJbmRleF07XG5cbiAgICAgIGlmIChmb2N1c2VkT3B0aW9uICYmICFmb2N1c2VkT3B0aW9uLmRpc2FibGVkKSB7XG4gICAgICAgIGZvY3VzZWRPcHRpb24udG9nZ2xlKCk7XG5cbiAgICAgICAgLy8gRW1pdCBhIGNoYW5nZSBldmVudCBiZWNhdXNlIHRoZSBmb2N1c2VkIG9wdGlvbiBjaGFuZ2VkIGl0cyBzdGF0ZSB0aHJvdWdoIHVzZXJcbiAgICAgICAgLy8gaW50ZXJhY3Rpb24uXG4gICAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudChmb2N1c2VkT3B0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2VsZWN0ZWQgc3RhdGUgb24gYWxsIG9mIHRoZSBvcHRpb25zXG4gICAqIGFuZCBlbWl0cyBhbiBldmVudCBpZiBhbnl0aGluZyBjaGFuZ2VkLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0QWxsT3B0aW9uc1NlbGVjdGVkKGlzU2VsZWN0ZWQ6IGJvb2xlYW4pIHtcbiAgICAvLyBLZWVwIHRyYWNrIG9mIHdoZXRoZXIgYW55dGhpbmcgY2hhbmdlZCwgYmVjYXVzZSB3ZSBvbmx5IHdhbnQgdG9cbiAgICAvLyBlbWl0IHRoZSBjaGFuZ2VkIGV2ZW50IHdoZW4gc29tZXRoaW5nIGFjdHVhbGx5IGNoYW5nZWQuXG4gICAgbGV0IGhhc0NoYW5nZWQgPSBmYWxzZTtcblxuICAgIHRoaXMub3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICBpZiAob3B0aW9uLl9zZXRTZWxlY3RlZChpc1NlbGVjdGVkKSkge1xuICAgICAgICBoYXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChoYXNDaGFuZ2VkKSB7XG4gICAgICB0aGlzLl9yZXBvcnRWYWx1ZUNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVdGlsaXR5IHRvIGVuc3VyZSBhbGwgaW5kZXhlcyBhcmUgdmFsaWQuXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggdG8gYmUgY2hlY2tlZC5cbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgaW5kZXggaXMgdmFsaWQgZm9yIG91ciBsaXN0IG9mIG9wdGlvbnMuXG4gICAqL1xuICBwcml2YXRlIF9pc1ZhbGlkSW5kZXgoaW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5vcHRpb25zLmxlbmd0aDtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgc3BlY2lmaWVkIGxpc3Qgb3B0aW9uLiAqL1xuICBwcml2YXRlIF9nZXRPcHRpb25JbmRleChvcHRpb246IE1hdExpc3RPcHRpb24pOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMudG9BcnJheSgpLmluZGV4T2Yob3B0aW9uKTtcbiAgfVxuXG4gIC8qKiBNYXJrcyBhbGwgdGhlIG9wdGlvbnMgdG8gYmUgY2hlY2tlZCBpbiB0aGUgbmV4dCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bi4gKi9cbiAgcHJpdmF0ZSBfbWFya09wdGlvbnNGb3JDaGVjaygpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4gb3B0aW9uLl9tYXJrRm9yQ2hlY2soKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIHRhYmluZGV4IGZyb20gdGhlIHNlbGVjdGlvbiBsaXN0IGFuZCByZXNldHMgaXQgYmFjayBhZnRlcndhcmRzLCBhbGxvd2luZyB0aGUgdXNlclxuICAgKiB0byB0YWIgb3V0IG9mIGl0LiBUaGlzIHByZXZlbnRzIHRoZSBsaXN0IGZyb20gY2FwdHVyaW5nIGZvY3VzIGFuZCByZWRpcmVjdGluZyBpdCBiYWNrIHdpdGhpblxuICAgKiB0aGUgbGlzdCwgY3JlYXRpbmcgYSBmb2N1cyB0cmFwIGlmIGl0IHVzZXIgdHJpZXMgdG8gdGFiIGF3YXkuXG4gICAqL1xuICBwcml2YXRlIF9hbGxvd0ZvY3VzRXNjYXBlKCkge1xuICAgIHRoaXMuX3RhYkluZGV4ID0gLTE7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX3RhYkluZGV4ID0gMDtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHRhYmluZGV4IGJhc2VkIHVwb24gaWYgdGhlIHNlbGVjdGlvbiBsaXN0IGlzIGVtcHR5LiAqL1xuICBwcml2YXRlIF91cGRhdGVUYWJJbmRleCgpOiB2b2lkIHtcbiAgICB0aGlzLl90YWJJbmRleCA9ICh0aGlzLm9wdGlvbnMubGVuZ3RoID09PSAwKSA/IC0xIDogMDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xufVxuIl19