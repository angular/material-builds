/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { SPACE, ENTER, HOME, END, UP_ARROW, DOWN_ARROW, A, hasModifierKey, } from '@angular/cdk/keycodes';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, Input, Output, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MatLine, setLines, mixinDisableRipple, } from '@angular/material/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatListAvatarCssMatStyler, MatListIconCssMatStyler } from './list';
/**
 * \@docs-private
 */
class MatSelectionListBase {
}
/** @type {?} */
const _MatSelectionListMixinBase = mixinDisableRipple(MatSelectionListBase);
/**
 * \@docs-private
 */
class MatListOptionBase {
}
/** @type {?} */
const _MatListOptionMixinBase = mixinDisableRipple(MatListOptionBase);
/**
 * \@docs-private
 * @type {?}
 */
export const MAT_SELECTION_LIST_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => MatSelectionList)),
    multi: true
};
/**
 * Change event that is being fired whenever the selected state of an option changes.
 */
export class MatSelectionListChange {
    /**
     * @param {?} source
     * @param {?} option
     */
    constructor(source, option) {
        this.source = source;
        this.option = option;
    }
}
if (false) {
    /**
     * Reference to the selection list that emitted the event.
     * @type {?}
     */
    MatSelectionListChange.prototype.source;
    /**
     * Reference to the option that has been changed.
     * @type {?}
     */
    MatSelectionListChange.prototype.option;
}
/**
 * Component for list-options of selection-list. Each list-option can automatically
 * generate a checkbox and can put current item into the selectionModel of selection-list
 * if the current item is selected.
 */
export class MatListOption extends _MatListOptionMixinBase {
    /**
     * @param {?} _element
     * @param {?} _changeDetector
     * @param {?} selectionList
     */
    constructor(_element, _changeDetector, selectionList) {
        super();
        this._element = _element;
        this._changeDetector = _changeDetector;
        this.selectionList = selectionList;
        this._selected = false;
        this._disabled = false;
        this._hasFocus = false;
        /**
         * Whether the label should appear before or after the checkbox. Defaults to 'after'
         */
        this.checkboxPosition = 'after';
    }
    /**
     * Theme color of the list option. This sets the color of the checkbox.
     * @return {?}
     */
    get color() { return this._color || this.selectionList.color; }
    /**
     * @param {?} newValue
     * @return {?}
     */
    set color(newValue) { this._color = newValue; }
    /**
     * Value of the option
     * @return {?}
     */
    get value() { return this._value; }
    /**
     * @param {?} newValue
     * @return {?}
     */
    set value(newValue) {
        if (this.selected && newValue !== this.value) {
            this.selected = false;
        }
        this._value = newValue;
    }
    /**
     * Whether the option is disabled.
     * @return {?}
     */
    get disabled() { return this._disabled || (this.selectionList && this.selectionList.disabled); }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        /** @type {?} */
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._disabled) {
            this._disabled = newValue;
            this._changeDetector.markForCheck();
        }
    }
    /**
     * Whether the option is selected.
     * @return {?}
     */
    get selected() { return this.selectionList.selectedOptions.isSelected(this); }
    /**
     * @param {?} value
     * @return {?}
     */
    set selected(value) {
        /** @type {?} */
        const isSelected = coerceBooleanProperty(value);
        if (isSelected !== this._selected) {
            this._setSelected(isSelected);
            this.selectionList._reportValueChange();
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        /** @type {?} */
        const list = this.selectionList;
        if (list._value && list._value.some((/**
         * @param {?} value
         * @return {?}
         */
        value => list.compareWith(value, this._value)))) {
            this._setSelected(true);
        }
        /** @type {?} */
        const wasSelected = this._selected;
        // List options that are selected at initialization can't be reported properly to the form
        // control. This is because it takes some time until the selection-list knows about all
        // available options. Also it can happen that the ControlValueAccessor has an initial value
        // that should be used instead. Deferring the value change report to the next tick ensures
        // that the form control value is not being overwritten.
        Promise.resolve().then((/**
         * @return {?}
         */
        () => {
            if (this._selected || wasSelected) {
                this.selected = true;
                this._changeDetector.markForCheck();
            }
        }));
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        setLines(this._lines, this._element);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.selected) {
            // We have to delay this until the next tick in order
            // to avoid changed after checked errors.
            Promise.resolve().then((/**
             * @return {?}
             */
            () => {
                this.selected = false;
            }));
        }
        /** @type {?} */
        const hadFocus = this._hasFocus;
        /** @type {?} */
        const newActiveItem = this.selectionList._removeOptionFromList(this);
        // Only move focus if this option was focused at the time it was destroyed.
        if (hadFocus && newActiveItem) {
            newActiveItem.focus();
        }
    }
    /**
     * Toggles the selection state of the option.
     * @return {?}
     */
    toggle() {
        this.selected = !this.selected;
    }
    /**
     * Allows for programmatic focusing of the option.
     * @return {?}
     */
    focus() {
        this._element.nativeElement.focus();
    }
    /**
     * Returns the list item's text label. Implemented as a part of the FocusKeyManager.
     * \@docs-private
     * @return {?}
     */
    getLabel() {
        return this._text ? (this._text.nativeElement.textContent || '') : '';
    }
    /**
     * Whether this list item should show a ripple effect when clicked.
     * @return {?}
     */
    _isRippleDisabled() {
        return this.disabled || this.disableRipple || this.selectionList.disableRipple;
    }
    /**
     * @return {?}
     */
    _handleClick() {
        if (!this.disabled) {
            this.toggle();
            // Emit a change event if the selected state of the option changed through user interaction.
            this.selectionList._emitChangeEvent(this);
        }
    }
    /**
     * @return {?}
     */
    _handleFocus() {
        this.selectionList._setFocusedOption(this);
        this._hasFocus = true;
    }
    /**
     * @return {?}
     */
    _handleBlur() {
        this.selectionList._onTouched();
        this._hasFocus = false;
    }
    /**
     * Retrieves the DOM element of the component host.
     * @return {?}
     */
    _getHostElement() {
        return this._element.nativeElement;
    }
    /**
     * Sets the selected state of the option. Returns whether the value has changed.
     * @param {?} selected
     * @return {?}
     */
    _setSelected(selected) {
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
    }
    /**
     * Notifies Angular that the option needs to be checked in the next change detection run. Mainly
     * used to trigger an update of the list option if the disabled state of the selection list
     * changed.
     * @return {?}
     */
    _markForCheck() {
        this._changeDetector.markForCheck();
    }
}
MatListOption.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-list-option',
                exportAs: 'matListOption',
                inputs: ['disableRipple'],
                host: {
                    'role': 'option',
                    'class': 'mat-list-item mat-list-option',
                    '(focus)': '_handleFocus()',
                    '(blur)': '_handleBlur()',
                    '(click)': '_handleClick()',
                    'tabindex': '-1',
                    '[class.mat-list-item-disabled]': 'disabled',
                    '[class.mat-list-item-with-avatar]': '_avatar || _icon',
                    // Manually set the "primary" or "warn" class if the color has been explicitly
                    // set to "primary" or "warn". The pseudo checkbox picks up these classes for
                    // its theme. The accent theme palette is the default and doesn't need to be set.
                    '[class.mat-primary]': 'color === "primary"',
                    '[class.mat-warn]': 'color === "warn"',
                    '[attr.aria-selected]': 'selected',
                    '[attr.aria-disabled]': 'disabled',
                },
                template: "<div class=\"mat-list-item-content\"\n  [class.mat-list-item-content-reverse]=\"checkboxPosition == 'after'\">\n\n  <div mat-ripple\n    class=\"mat-list-item-ripple\"\n    [matRippleTrigger]=\"_getHostElement()\"\n    [matRippleDisabled]=\"_isRippleDisabled()\"></div>\n\n  <mat-pseudo-checkbox\n    [state]=\"selected ? 'checked' : 'unchecked'\"\n    [disabled]=\"disabled\"></mat-pseudo-checkbox>\n\n  <div class=\"mat-list-text\" #text><ng-content></ng-content></div>\n\n  <ng-content select=\"[mat-list-avatar], [mat-list-icon], [matListAvatar], [matListIcon]\">\n  </ng-content>\n\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
MatListOption.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: MatSelectionList, decorators: [{ type: Inject, args: [forwardRef((/**
                     * @return {?}
                     */
                    () => MatSelectionList)),] }] }
];
MatListOption.propDecorators = {
    _avatar: [{ type: ContentChild, args: [MatListAvatarCssMatStyler, { static: false },] }],
    _icon: [{ type: ContentChild, args: [MatListIconCssMatStyler, { static: false },] }],
    _lines: [{ type: ContentChildren, args: [MatLine,] }],
    _text: [{ type: ViewChild, args: ['text', { static: false },] }],
    checkboxPosition: [{ type: Input }],
    color: [{ type: Input }],
    value: [{ type: Input }],
    disabled: [{ type: Input }],
    selected: [{ type: Input }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatListOption.prototype._selected;
    /**
     * @type {?}
     * @private
     */
    MatListOption.prototype._disabled;
    /**
     * @type {?}
     * @private
     */
    MatListOption.prototype._hasFocus;
    /** @type {?} */
    MatListOption.prototype._avatar;
    /** @type {?} */
    MatListOption.prototype._icon;
    /** @type {?} */
    MatListOption.prototype._lines;
    /**
     * DOM element containing the item's text.
     * @type {?}
     */
    MatListOption.prototype._text;
    /**
     * Whether the label should appear before or after the checkbox. Defaults to 'after'
     * @type {?}
     */
    MatListOption.prototype.checkboxPosition;
    /**
     * @type {?}
     * @private
     */
    MatListOption.prototype._color;
    /**
     * @type {?}
     * @private
     */
    MatListOption.prototype._value;
    /**
     * @type {?}
     * @private
     */
    MatListOption.prototype._element;
    /**
     * @type {?}
     * @private
     */
    MatListOption.prototype._changeDetector;
    /**
     * \@docs-private
     * @type {?}
     */
    MatListOption.prototype.selectionList;
}
/**
 * Material Design list component where each item is a selectable option. Behaves as a listbox.
 */
export class MatSelectionList extends _MatSelectionListMixinBase {
    /**
     * @param {?} _element
     * @param {?} tabIndex
     */
    constructor(_element, tabIndex) {
        super();
        this._element = _element;
        /**
         * Emits a change event whenever the selected state of an option changes.
         */
        this.selectionChange = new EventEmitter();
        /**
         * Tabindex of the selection list.
         */
        this.tabIndex = 0;
        /**
         * Theme color of the selection list. This sets the checkbox color for all list options.
         */
        this.color = 'accent';
        /**
         * Function used for comparing an option against the selected value when determining which
         * options should appear as selected. The first argument is the value of an options. The second
         * one is a value from the selected value. A boolean must be returned.
         */
        this.compareWith = (/**
         * @param {?} a1
         * @param {?} a2
         * @return {?}
         */
        (a1, a2) => a1 === a2);
        this._disabled = false;
        /**
         * The currently selected options.
         */
        this.selectedOptions = new SelectionModel(true);
        /**
         * View to model callback that should be called whenever the selected options change.
         */
        this._onChange = (/**
         * @param {?} _
         * @return {?}
         */
        (_) => { });
        /**
         * Emits when the list has been destroyed.
         */
        this._destroyed = new Subject();
        /**
         * View to model callback that should be called if the list or its options lost focus.
         */
        this._onTouched = (/**
         * @return {?}
         */
        () => { });
        this.tabIndex = parseInt(tabIndex) || 0;
    }
    /**
     * Whether the selection list is disabled.
     * @return {?}
     */
    get disabled() { return this._disabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        // The `MatSelectionList` and `MatListOption` are using the `OnPush` change detection
        // strategy. Therefore the options will not check for any changes if the `MatSelectionList`
        // changed its state. Since we know that a change to `disabled` property of the list affects
        // the state of the options, we manually mark each option for check.
        this._markOptionsForCheck();
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._keyManager = new FocusKeyManager(this.options)
            .withWrap()
            .withTypeAhead()
            // Allow disabled items to be focusable. For accessibility reasons, there must be a way for
            // screenreader users, that allows reading the different options of the list.
            .skipPredicate((/**
         * @return {?}
         */
        () => false))
            .withAllowedModifierKeys(['shiftKey']);
        if (this._value) {
            this._setOptionsFromValues(this._value);
        }
        // Sync external changes to the model back to the options.
        this.selectedOptions.onChange.pipe(takeUntil(this._destroyed)).subscribe((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            if (event.added) {
                for (let item of event.added) {
                    item.selected = true;
                }
            }
            if (event.removed) {
                for (let item of event.removed) {
                    item.selected = false;
                }
            }
        }));
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const disableRippleChanges = changes['disableRipple'];
        /** @type {?} */
        const colorChanges = changes['color'];
        if ((disableRippleChanges && !disableRippleChanges.firstChange) ||
            (colorChanges && !colorChanges.firstChange)) {
            this._markOptionsForCheck();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
        this._isDestroyed = true;
    }
    /**
     * Focuses the selection list.
     * @param {?=} options
     * @return {?}
     */
    focus(options) {
        this._element.nativeElement.focus(options);
    }
    /**
     * Selects all of the options.
     * @return {?}
     */
    selectAll() {
        this._setAllOptionsSelected(true);
    }
    /**
     * Deselects all of the options.
     * @return {?}
     */
    deselectAll() {
        this._setAllOptionsSelected(false);
    }
    /**
     * Sets the focused option of the selection-list.
     * @param {?} option
     * @return {?}
     */
    _setFocusedOption(option) {
        this._keyManager.updateActiveItem(option);
    }
    /**
     * Removes an option from the selection list and updates the active item.
     * @param {?} option
     * @return {?} Currently-active item.
     */
    _removeOptionFromList(option) {
        /** @type {?} */
        const optionIndex = this._getOptionIndex(option);
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
    }
    /**
     * Passes relevant key presses to our key manager.
     * @param {?} event
     * @return {?}
     */
    _keydown(event) {
        /** @type {?} */
        const keyCode = event.keyCode;
        /** @type {?} */
        const manager = this._keyManager;
        /** @type {?} */
        const previousFocusIndex = manager.activeItemIndex;
        /** @type {?} */
        const hasModifier = hasModifierKey(event);
        switch (keyCode) {
            case SPACE:
            case ENTER:
                if (!hasModifier) {
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
                if (hasModifierKey(event, 'ctrlKey')) {
                    this.options.find((/**
                     * @param {?} option
                     * @return {?}
                     */
                    option => !option.selected)) ? this.selectAll() : this.deselectAll();
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
    }
    /**
     * Reports a value change to the ControlValueAccessor
     * @return {?}
     */
    _reportValueChange() {
        // Stop reporting value changes after the list has been destroyed. This avoids
        // cases where the list might wrongly reset its value once it is removed, but
        // the form control is still live.
        if (this.options && !this._isDestroyed) {
            /** @type {?} */
            const value = this._getSelectedOptionValues();
            this._onChange(value);
            this._value = value;
        }
    }
    /**
     * Emits a change event if the selected state of an option changed.
     * @param {?} option
     * @return {?}
     */
    _emitChangeEvent(option) {
        this.selectionChange.emit(new MatSelectionListChange(this, option));
    }
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} values
     * @return {?}
     */
    writeValue(values) {
        this._value = values;
        if (this.options) {
            this._setOptionsFromValues(values || []);
        }
    }
    /**
     * Implemented as a part of ControlValueAccessor.
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * Sets the selected options based on the specified values.
     * @private
     * @param {?} values
     * @return {?}
     */
    _setOptionsFromValues(values) {
        this.options.forEach((/**
         * @param {?} option
         * @return {?}
         */
        option => option._setSelected(false)));
        values.forEach((/**
         * @param {?} value
         * @return {?}
         */
        value => {
            /** @type {?} */
            const correspondingOption = this.options.find((/**
             * @param {?} option
             * @return {?}
             */
            option => {
                // Skip options that are already in the model. This allows us to handle cases
                // where the same primitive value is selected multiple times.
                return option.selected ? false : this.compareWith(option.value, value);
            }));
            if (correspondingOption) {
                correspondingOption._setSelected(true);
            }
        }));
    }
    /**
     * Returns the values of the selected options.
     * @private
     * @return {?}
     */
    _getSelectedOptionValues() {
        return this.options.filter((/**
         * @param {?} option
         * @return {?}
         */
        option => option.selected)).map((/**
         * @param {?} option
         * @return {?}
         */
        option => option.value));
    }
    /**
     * Toggles the state of the currently focused option if enabled.
     * @private
     * @return {?}
     */
    _toggleFocusedOption() {
        /** @type {?} */
        let focusedIndex = this._keyManager.activeItemIndex;
        if (focusedIndex != null && this._isValidIndex(focusedIndex)) {
            /** @type {?} */
            let focusedOption = this.options.toArray()[focusedIndex];
            if (focusedOption && !focusedOption.disabled) {
                focusedOption.toggle();
                // Emit a change event because the focused option changed its state through user
                // interaction.
                this._emitChangeEvent(focusedOption);
            }
        }
    }
    /**
     * Sets the selected state on all of the options
     * and emits an event if anything changed.
     * @private
     * @param {?} isSelected
     * @return {?}
     */
    _setAllOptionsSelected(isSelected) {
        // Keep track of whether anything changed, because we only want to
        // emit the changed event when something actually changed.
        /** @type {?} */
        let hasChanged = false;
        this.options.forEach((/**
         * @param {?} option
         * @return {?}
         */
        option => {
            if (option._setSelected(isSelected)) {
                hasChanged = true;
            }
        }));
        if (hasChanged) {
            this._reportValueChange();
        }
    }
    /**
     * Utility to ensure all indexes are valid.
     * @private
     * @param {?} index The index to be checked.
     * @return {?} True if the index is valid for our list of options.
     */
    _isValidIndex(index) {
        return index >= 0 && index < this.options.length;
    }
    /**
     * Returns the index of the specified list option.
     * @private
     * @param {?} option
     * @return {?}
     */
    _getOptionIndex(option) {
        return this.options.toArray().indexOf(option);
    }
    /**
     * Marks all the options to be checked in the next change detection run.
     * @private
     * @return {?}
     */
    _markOptionsForCheck() {
        if (this.options) {
            this.options.forEach((/**
             * @param {?} option
             * @return {?}
             */
            option => option._markForCheck()));
        }
    }
}
MatSelectionList.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-selection-list',
                exportAs: 'matSelectionList',
                inputs: ['disableRipple'],
                host: {
                    'role': 'listbox',
                    '[tabIndex]': 'tabIndex',
                    'class': 'mat-selection-list mat-list-base',
                    '(blur)': '_onTouched()',
                    '(keydown)': '_keydown($event)',
                    'aria-multiselectable': 'true',
                    '[attr.aria-disabled]': 'disabled.toString()',
                },
                template: '<ng-content></ng-content>',
                encapsulation: ViewEncapsulation.None,
                providers: [MAT_SELECTION_LIST_VALUE_ACCESSOR],
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-subheader{display:flex;box-sizing:border-box;padding:16px;align-items:center}.mat-list-base .mat-subheader{margin:0}.mat-list-base{padding-top:8px;display:block;-webkit-tap-highlight-color:transparent}.mat-list-base .mat-subheader{height:48px;line-height:16px}.mat-list-base .mat-subheader:first-child{margin-top:-8px}.mat-list-base .mat-list-item,.mat-list-base .mat-list-option{display:block;height:48px;-webkit-tap-highlight-color:transparent;width:100%;padding:0}.mat-list-base .mat-list-item .mat-list-item-content,.mat-list-base .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base .mat-list-item .mat-list-item-content-reverse,.mat-list-base .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base .mat-list-item .mat-list-item-ripple,.mat-list-base .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar,.mat-list-base .mat-list-option.mat-list-item-with-avatar{height:56px}.mat-list-base .mat-list-item.mat-2-line,.mat-list-base .mat-list-option.mat-2-line{height:72px}.mat-list-base .mat-list-item.mat-3-line,.mat-list-base .mat-list-option.mat-3-line{height:88px}.mat-list-base .mat-list-item.mat-multi-line,.mat-list-base .mat-list-option.mat-multi-line{height:auto}.mat-list-base .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base .mat-list-item .mat-list-text,.mat-list-base .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base .mat-list-item .mat-list-text>*,.mat-list-base .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base .mat-list-item .mat-list-text:empty,.mat-list-base .mat-list-option .mat-list-text:empty{display:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base .mat-list-item .mat-list-avatar,.mat-list-base .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%;object-fit:cover}.mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:72px;width:calc(100% - 72px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:72px}.mat-list-base .mat-list-item .mat-list-icon,.mat-list-base .mat-list-option .mat-list-icon{flex-shrink:0;width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:64px;width:calc(100% - 64px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:64px}.mat-list-base .mat-list-item .mat-divider,.mat-list-base .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base .mat-list-item .mat-divider,[dir=rtl] .mat-list-base .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-list-base[dense]{padding-top:4px;display:block}.mat-list-base[dense] .mat-subheader{height:40px;line-height:8px}.mat-list-base[dense] .mat-subheader:first-child{margin-top:-4px}.mat-list-base[dense] .mat-list-item,.mat-list-base[dense] .mat-list-option{display:block;height:40px;-webkit-tap-highlight-color:transparent;width:100%;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-item-content,.mat-list-base[dense] .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base[dense] .mat-list-item .mat-list-item-content-reverse,.mat-list-base[dense] .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base[dense] .mat-list-item .mat-list-item-ripple,.mat-list-base[dense] .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar{height:48px}.mat-list-base[dense] .mat-list-item.mat-2-line,.mat-list-base[dense] .mat-list-option.mat-2-line{height:60px}.mat-list-base[dense] .mat-list-item.mat-3-line,.mat-list-base[dense] .mat-list-option.mat-3-line{height:76px}.mat-list-base[dense] .mat-list-item.mat-multi-line,.mat-list-base[dense] .mat-list-option.mat-multi-line{height:auto}.mat-list-base[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base[dense] .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base[dense] .mat-list-item .mat-list-text,.mat-list-base[dense] .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-text>*,.mat-list-base[dense] .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base[dense] .mat-list-item .mat-list-text:empty,.mat-list-base[dense] .mat-list-option .mat-list-text:empty{display:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base[dense] .mat-list-item .mat-list-avatar,.mat-list-base[dense] .mat-list-option .mat-list-avatar{flex-shrink:0;width:36px;height:36px;border-radius:50%;object-fit:cover}.mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:68px;width:calc(100% - 68px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:68px}.mat-list-base[dense] .mat-list-item .mat-list-icon,.mat-list-base[dense] .mat-list-option .mat-list-icon{flex-shrink:0;width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:60px;width:calc(100% - 60px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:60px}.mat-list-base[dense] .mat-list-item .mat-divider,.mat-list-base[dense] .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-divider,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base[dense] .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-nav-list a{text-decoration:none;color:inherit}.mat-nav-list .mat-list-item{cursor:pointer;outline:none}mat-action-list button{background:none;color:inherit;border:none;font:inherit;outline:inherit;-webkit-tap-highlight-color:transparent;text-align:left}[dir=rtl] mat-action-list button{text-align:right}mat-action-list button::-moz-focus-inner{border:0}mat-action-list .mat-list-item{cursor:pointer;outline:inherit}.mat-list-option:not(.mat-list-item-disabled){cursor:pointer;outline:none}@media(-ms-high-contrast: active){.mat-selection-list:focus{outline-style:dotted}.mat-list-option:hover,.mat-list-option:focus,.mat-nav-list .mat-list-item:hover,.mat-nav-list .mat-list-item:focus,mat-action-list .mat-list-item:hover,mat-action-list .mat-list-item:focus{outline:dotted 1px}}@media(hover: none){.mat-list-option:not(.mat-list-item-disabled):hover,.mat-nav-list .mat-list-item:not(.mat-list-item-disabled):hover,.mat-action-list .mat-list-item:not(.mat-list-item-disabled):hover{background:none}}/*# sourceMappingURL=list.css.map */\n"]
            }] }
];
/** @nocollapse */
MatSelectionList.ctorParameters = () => [
    { type: ElementRef },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] }
];
MatSelectionList.propDecorators = {
    options: [{ type: ContentChildren, args: [MatListOption, { descendants: true },] }],
    selectionChange: [{ type: Output }],
    tabIndex: [{ type: Input }],
    color: [{ type: Input }],
    compareWith: [{ type: Input }],
    disabled: [{ type: Input }]
};
if (false) {
    /**
     * The FocusKeyManager which handles focus.
     * @type {?}
     */
    MatSelectionList.prototype._keyManager;
    /**
     * The option components contained within this selection-list.
     * @type {?}
     */
    MatSelectionList.prototype.options;
    /**
     * Emits a change event whenever the selected state of an option changes.
     * @type {?}
     */
    MatSelectionList.prototype.selectionChange;
    /**
     * Tabindex of the selection list.
     * @type {?}
     */
    MatSelectionList.prototype.tabIndex;
    /**
     * Theme color of the selection list. This sets the checkbox color for all list options.
     * @type {?}
     */
    MatSelectionList.prototype.color;
    /**
     * Function used for comparing an option against the selected value when determining which
     * options should appear as selected. The first argument is the value of an options. The second
     * one is a value from the selected value. A boolean must be returned.
     * @type {?}
     */
    MatSelectionList.prototype.compareWith;
    /**
     * @type {?}
     * @private
     */
    MatSelectionList.prototype._disabled;
    /**
     * The currently selected options.
     * @type {?}
     */
    MatSelectionList.prototype.selectedOptions;
    /**
     * View to model callback that should be called whenever the selected options change.
     * @type {?}
     * @private
     */
    MatSelectionList.prototype._onChange;
    /**
     * Keeps track of the currently-selected value.
     * @type {?}
     */
    MatSelectionList.prototype._value;
    /**
     * Emits when the list has been destroyed.
     * @type {?}
     * @private
     */
    MatSelectionList.prototype._destroyed;
    /**
     * View to model callback that should be called if the list or its options lost focus.
     * @type {?}
     */
    MatSelectionList.prototype._onTouched;
    /**
     * Whether the list has been destroyed.
     * @type {?}
     * @private
     */
    MatSelectionList.prototype._isDestroyed;
    /**
     * @type {?}
     * @private
     */
    MatSelectionList.prototype._element;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLWxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC9zZWxlY3Rpb24tbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBa0IsZUFBZSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDbkUsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFDTCxLQUFLLEVBQ0wsS0FBSyxFQUNMLElBQUksRUFDSixHQUFHLEVBQ0gsUUFBUSxFQUNSLFVBQVUsRUFDVixDQUFDLEVBQ0QsY0FBYyxHQUNmLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUVMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBR2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFFTCxPQUFPLEVBQ1AsUUFBUSxFQUNSLGtCQUFrQixHQUVuQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUMseUJBQXlCLEVBQUUsdUJBQXVCLEVBQUMsTUFBTSxRQUFRLENBQUM7Ozs7QUFJMUUsTUFBTSxvQkFBb0I7Q0FBRzs7TUFDdkIsMEJBQTBCLEdBQzVCLGtCQUFrQixDQUFD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QUMsSUFBSTtnQkFDckMsU0FBUyxFQUFFLENBQUMsaUNBQWlDLENBQUM7Z0JBQzlDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOzthQUNoRDs7OztZQXBTQyxVQUFVO3lDQStWOEMsU0FBUyxTQUFDLFVBQVU7OztzQkFuRDNFLGVBQWUsU0FBQyxhQUFhLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOzhCQUdsRCxNQUFNO3VCQUlOLEtBQUs7b0JBR0wsS0FBSzswQkFPTCxLQUFLO3VCQUdMLEtBQUs7Ozs7Ozs7SUF2Qk4sdUNBQTRDOzs7OztJQUc1QyxtQ0FBdUY7Ozs7O0lBR3ZGLDJDQUMrQzs7Ozs7SUFHL0Msb0NBQThCOzs7OztJQUc5QixpQ0FBd0M7Ozs7Ozs7SUFPeEMsdUNBQTRFOzs7OztJQWM1RSxxQ0FBbUM7Ozs7O0lBR25DLDJDQUF5Rjs7Ozs7O0lBR3pGLHFDQUF5RDs7Ozs7SUFHekQsa0NBQXNCOzs7Ozs7SUFHdEIsc0NBQXlDOzs7OztJQUd6QyxzQ0FBa0M7Ozs7OztJQUdsQyx3Q0FBOEI7Ozs7O0lBRWxCLG9DQUF5QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzYWJsZU9wdGlvbiwgRm9jdXNLZXlNYW5hZ2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7U2VsZWN0aW9uTW9kZWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge1xuICBTUEFDRSxcbiAgRU5URVIsXG4gIEhPTUUsXG4gIEVORCxcbiAgVVBfQVJST1csXG4gIERPV05fQVJST1csXG4gIEEsXG4gIGhhc01vZGlmaWVyS2V5LFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBPbkNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZVJpcHBsZSwgQ2FuRGlzYWJsZVJpcHBsZUN0b3IsXG4gIE1hdExpbmUsXG4gIHNldExpbmVzLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdExpc3RBdmF0YXJDc3NNYXRTdHlsZXIsIE1hdExpc3RJY29uQ3NzTWF0U3R5bGVyfSBmcm9tICcuL2xpc3QnO1xuXG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRTZWxlY3Rpb25MaXN0QmFzZSB7fVxuY29uc3QgX01hdFNlbGVjdGlvbkxpc3RNaXhpbkJhc2U6IENhbkRpc2FibGVSaXBwbGVDdG9yICYgdHlwZW9mIE1hdFNlbGVjdGlvbkxpc3RCYXNlID1cbiAgICBtaXhpbkRpc2FibGVSaXBwbGUoTWF0U2VsZWN0aW9uTGlzdEJhc2UpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0TGlzdE9wdGlvbkJhc2Uge31cbmNvbnN0IF9NYXRMaXN0T3B0aW9uTWl4aW5CYXNlOiBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmIHR5cGVvZiBNYXRMaXN0T3B0aW9uQmFzZSA9XG4gICAgbWl4aW5EaXNhYmxlUmlwcGxlKE1hdExpc3RPcHRpb25CYXNlKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfU0VMRUNUSU9OX0xJU1RfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdFNlbGVjdGlvbkxpc3QpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqIENoYW5nZSBldmVudCB0aGF0IGlzIGJlaW5nIGZpcmVkIHdoZW5ldmVyIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiBhbiBvcHRpb24gY2hhbmdlcy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgc2VsZWN0aW9uIGxpc3QgdGhhdCBlbWl0dGVkIHRoZSBldmVudC4gKi9cbiAgICBwdWJsaWMgc291cmNlOiBNYXRTZWxlY3Rpb25MaXN0LFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIG9wdGlvbiB0aGF0IGhhcyBiZWVuIGNoYW5nZWQuICovXG4gICAgcHVibGljIG9wdGlvbjogTWF0TGlzdE9wdGlvbikge31cbn1cblxuLyoqXG4gKiBDb21wb25lbnQgZm9yIGxpc3Qtb3B0aW9ucyBvZiBzZWxlY3Rpb24tbGlzdC4gRWFjaCBsaXN0LW9wdGlvbiBjYW4gYXV0b21hdGljYWxseVxuICogZ2VuZXJhdGUgYSBjaGVja2JveCBhbmQgY2FuIHB1dCBjdXJyZW50IGl0ZW0gaW50byB0aGUgc2VsZWN0aW9uTW9kZWwgb2Ygc2VsZWN0aW9uLWxpc3RcbiAqIGlmIHRoZSBjdXJyZW50IGl0ZW0gaXMgc2VsZWN0ZWQuXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC1saXN0LW9wdGlvbicsXG4gIGV4cG9ydEFzOiAnbWF0TGlzdE9wdGlvbicsXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJ10sXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdvcHRpb24nLFxuICAgICdjbGFzcyc6ICdtYXQtbGlzdC1pdGVtIG1hdC1saXN0LW9wdGlvbicsXG4gICAgJyhmb2N1cyknOiAnX2hhbmRsZUZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX2hhbmRsZUJsdXIoKScsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCknLFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ1tjbGFzcy5tYXQtbGlzdC1pdGVtLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbGlzdC1pdGVtLXdpdGgtYXZhdGFyXSc6ICdfYXZhdGFyIHx8IF9pY29uJyxcbiAgICAvLyBNYW51YWxseSBzZXQgdGhlIFwicHJpbWFyeVwiIG9yIFwid2FyblwiIGNsYXNzIGlmIHRoZSBjb2xvciBoYXMgYmVlbiBleHBsaWNpdGx5XG4gICAgLy8gc2V0IHRvIFwicHJpbWFyeVwiIG9yIFwid2FyblwiLiBUaGUgcHNldWRvIGNoZWNrYm94IHBpY2tzIHVwIHRoZXNlIGNsYXNzZXMgZm9yXG4gICAgLy8gaXRzIHRoZW1lLiBUaGUgYWNjZW50IHRoZW1lIHBhbGV0dGUgaXMgdGhlIGRlZmF1bHQgYW5kIGRvZXNuJ3QgbmVlZCB0byBiZSBzZXQuXG4gICAgJ1tjbGFzcy5tYXQtcHJpbWFyeV0nOiAnY29sb3IgPT09IFwicHJpbWFyeVwiJyxcbiAgICAnW2NsYXNzLm1hdC13YXJuXSc6ICdjb2xvciA9PT0gXCJ3YXJuXCInLFxuICAgICdbYXR0ci5hcmlhLXNlbGVjdGVkXSc6ICdzZWxlY3RlZCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICdsaXN0LW9wdGlvbi5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdExpc3RPcHRpb24gZXh0ZW5kcyBfTWF0TGlzdE9wdGlvbk1peGluQmFzZVxuICAgIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95LCBPbkluaXQsIEZvY3VzYWJsZU9wdGlvbiwgQ2FuRGlzYWJsZVJpcHBsZSB7XG5cbiAgcHJpdmF0ZSBfc2VsZWN0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfaGFzRm9jdXMgPSBmYWxzZTtcblxuICBAQ29udGVudENoaWxkKE1hdExpc3RBdmF0YXJDc3NNYXRTdHlsZXIsIHtzdGF0aWM6IGZhbHNlfSkgX2F2YXRhcjogTWF0TGlzdEF2YXRhckNzc01hdFN0eWxlcjtcbiAgQENvbnRlbnRDaGlsZChNYXRMaXN0SWNvbkNzc01hdFN0eWxlciwge3N0YXRpYzogZmFsc2V9KSBfaWNvbjogTWF0TGlzdEljb25Dc3NNYXRTdHlsZXI7XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TGluZSkgX2xpbmVzOiBRdWVyeUxpc3Q8TWF0TGluZT47XG5cbiAgLyoqIERPTSBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIGl0ZW0ncyB0ZXh0LiAqL1xuICBAVmlld0NoaWxkKCd0ZXh0Jywge3N0YXRpYzogZmFsc2V9KSBfdGV4dDogRWxlbWVudFJlZjtcblxuICAvKiogV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGFwcGVhciBiZWZvcmUgb3IgYWZ0ZXIgdGhlIGNoZWNrYm94LiBEZWZhdWx0cyB0byAnYWZ0ZXInICovXG4gIEBJbnB1dCgpIGNoZWNrYm94UG9zaXRpb246ICdiZWZvcmUnIHwgJ2FmdGVyJyA9ICdhZnRlcic7XG5cbiAgLyoqIFRoZW1lIGNvbG9yIG9mIHRoZSBsaXN0IG9wdGlvbi4gVGhpcyBzZXRzIHRoZSBjb2xvciBvZiB0aGUgY2hlY2tib3guICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUgeyByZXR1cm4gdGhpcy5fY29sb3IgfHwgdGhpcy5zZWxlY3Rpb25MaXN0LmNvbG9yOyB9XG4gIHNldCBjb2xvcihuZXdWYWx1ZTogVGhlbWVQYWxldHRlKSB7IHRoaXMuX2NvbG9yID0gbmV3VmFsdWU7IH1cbiAgcHJpdmF0ZSBfY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKiogVmFsdWUgb2YgdGhlIG9wdGlvbiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMuX3ZhbHVlOyB9XG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWQgJiYgbmV3VmFsdWUgIT09IHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICB9XG4gIHByaXZhdGUgX3ZhbHVlOiBhbnk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG9wdGlvbiBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5fZGlzYWJsZWQgfHwgKHRoaXMuc2VsZWN0aW9uTGlzdCAmJiB0aGlzLnNlbGVjdGlvbkxpc3QuZGlzYWJsZWQpOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYW55KSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fZGlzYWJsZWQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBvcHRpb24gaXMgc2VsZWN0ZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc2VsZWN0aW9uTGlzdC5zZWxlY3RlZE9wdGlvbnMuaXNTZWxlY3RlZCh0aGlzKTsgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChpc1NlbGVjdGVkICE9PSB0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2V0U2VsZWN0ZWQoaXNTZWxlY3RlZCk7XG4gICAgICB0aGlzLnNlbGVjdGlvbkxpc3QuX3JlcG9ydFZhbHVlQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgICAgICAgICAgICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE1hdFNlbGVjdGlvbkxpc3QpKSBwdWJsaWMgc2VsZWN0aW9uTGlzdDogTWF0U2VsZWN0aW9uTGlzdCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5zZWxlY3Rpb25MaXN0O1xuXG4gICAgaWYgKGxpc3QuX3ZhbHVlICYmIGxpc3QuX3ZhbHVlLnNvbWUodmFsdWUgPT4gbGlzdC5jb21wYXJlV2l0aCh2YWx1ZSwgdGhpcy5fdmFsdWUpKSkge1xuICAgICAgdGhpcy5fc2V0U2VsZWN0ZWQodHJ1ZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd2FzU2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3RlZDtcblxuICAgIC8vIExpc3Qgb3B0aW9ucyB0aGF0IGFyZSBzZWxlY3RlZCBhdCBpbml0aWFsaXphdGlvbiBjYW4ndCBiZSByZXBvcnRlZCBwcm9wZXJseSB0byB0aGUgZm9ybVxuICAgIC8vIGNvbnRyb2wuIFRoaXMgaXMgYmVjYXVzZSBpdCB0YWtlcyBzb21lIHRpbWUgdW50aWwgdGhlIHNlbGVjdGlvbi1saXN0IGtub3dzIGFib3V0IGFsbFxuICAgIC8vIGF2YWlsYWJsZSBvcHRpb25zLiBBbHNvIGl0IGNhbiBoYXBwZW4gdGhhdCB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaGFzIGFuIGluaXRpYWwgdmFsdWVcbiAgICAvLyB0aGF0IHNob3VsZCBiZSB1c2VkIGluc3RlYWQuIERlZmVycmluZyB0aGUgdmFsdWUgY2hhbmdlIHJlcG9ydCB0byB0aGUgbmV4dCB0aWNrIGVuc3VyZXNcbiAgICAvLyB0aGF0IHRoZSBmb3JtIGNvbnRyb2wgdmFsdWUgaXMgbm90IGJlaW5nIG92ZXJ3cml0dGVuLlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkIHx8IHdhc1NlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBzZXRMaW5lcyh0aGlzLl9saW5lcywgdGhpcy5fZWxlbWVudCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zZWxlY3RlZCkge1xuICAgICAgLy8gV2UgaGF2ZSB0byBkZWxheSB0aGlzIHVudGlsIHRoZSBuZXh0IHRpY2sgaW4gb3JkZXJcbiAgICAgIC8vIHRvIGF2b2lkIGNoYW5nZWQgYWZ0ZXIgY2hlY2tlZCBlcnJvcnMuXG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgaGFkRm9jdXMgPSB0aGlzLl9oYXNGb2N1cztcbiAgICBjb25zdCBuZXdBY3RpdmVJdGVtID0gdGhpcy5zZWxlY3Rpb25MaXN0Ll9yZW1vdmVPcHRpb25Gcm9tTGlzdCh0aGlzKTtcblxuICAgIC8vIE9ubHkgbW92ZSBmb2N1cyBpZiB0aGlzIG9wdGlvbiB3YXMgZm9jdXNlZCBhdCB0aGUgdGltZSBpdCB3YXMgZGVzdHJveWVkLlxuICAgIGlmIChoYWRGb2N1cyAmJiBuZXdBY3RpdmVJdGVtKSB7XG4gICAgICBuZXdBY3RpdmVJdGVtLmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIHNlbGVjdGlvbiBzdGF0ZSBvZiB0aGUgb3B0aW9uLiAqL1xuICB0b2dnbGUoKTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3RlZCA9ICF0aGlzLnNlbGVjdGVkO1xuICB9XG5cbiAgLyoqIEFsbG93cyBmb3IgcHJvZ3JhbW1hdGljIGZvY3VzaW5nIG9mIHRoZSBvcHRpb24uICovXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxpc3QgaXRlbSdzIHRleHQgbGFiZWwuIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiB0aGUgRm9jdXNLZXlNYW5hZ2VyLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXRMYWJlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdGV4dCA/ICh0aGlzLl90ZXh0Lm5hdGl2ZUVsZW1lbnQudGV4dENvbnRlbnQgfHwgJycpIDogJyc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIGxpc3QgaXRlbSBzaG91bGQgc2hvdyBhIHJpcHBsZSBlZmZlY3Qgd2hlbiBjbGlja2VkLiAqL1xuICBfaXNSaXBwbGVEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVSaXBwbGUgfHwgdGhpcy5zZWxlY3Rpb25MaXN0LmRpc2FibGVSaXBwbGU7XG4gIH1cblxuICBfaGFuZGxlQ2xpY2soKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLnRvZ2dsZSgpO1xuXG4gICAgICAvLyBFbWl0IGEgY2hhbmdlIGV2ZW50IGlmIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiB0aGUgb3B0aW9uIGNoYW5nZWQgdGhyb3VnaCB1c2VyIGludGVyYWN0aW9uLlxuICAgICAgdGhpcy5zZWxlY3Rpb25MaXN0Ll9lbWl0Q2hhbmdlRXZlbnQodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUZvY3VzKCkge1xuICAgIHRoaXMuc2VsZWN0aW9uTGlzdC5fc2V0Rm9jdXNlZE9wdGlvbih0aGlzKTtcbiAgICB0aGlzLl9oYXNGb2N1cyA9IHRydWU7XG4gIH1cblxuICBfaGFuZGxlQmx1cigpIHtcbiAgICB0aGlzLnNlbGVjdGlvbkxpc3QuX29uVG91Y2hlZCgpO1xuICAgIHRoaXMuX2hhc0ZvY3VzID0gZmFsc2U7XG4gIH1cblxuICAvKiogUmV0cmlldmVzIHRoZSBET00gZWxlbWVudCBvZiB0aGUgY29tcG9uZW50IGhvc3QuICovXG4gIF9nZXRIb3N0RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiB0aGUgb3B0aW9uLiBSZXR1cm5zIHdoZXRoZXIgdGhlIHZhbHVlIGhhcyBjaGFuZ2VkLiAqL1xuICBfc2V0U2VsZWN0ZWQoc2VsZWN0ZWQ6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICBpZiAoc2VsZWN0ZWQgPT09IHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBzZWxlY3RlZDtcblxuICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgdGhpcy5zZWxlY3Rpb25MaXN0LnNlbGVjdGVkT3B0aW9ucy5zZWxlY3QodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uTGlzdC5zZWxlY3RlZE9wdGlvbnMuZGVzZWxlY3QodGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogTm90aWZpZXMgQW5ndWxhciB0aGF0IHRoZSBvcHRpb24gbmVlZHMgdG8gYmUgY2hlY2tlZCBpbiB0aGUgbmV4dCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bi4gTWFpbmx5XG4gICAqIHVzZWQgdG8gdHJpZ2dlciBhbiB1cGRhdGUgb2YgdGhlIGxpc3Qgb3B0aW9uIGlmIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiB0aGUgc2VsZWN0aW9uIGxpc3RcbiAgICogY2hhbmdlZC5cbiAgICovXG4gIF9tYXJrRm9yQ2hlY2soKSB7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gIH1cbn1cblxuXG4vKipcbiAqIE1hdGVyaWFsIERlc2lnbiBsaXN0IGNvbXBvbmVudCB3aGVyZSBlYWNoIGl0ZW0gaXMgYSBzZWxlY3RhYmxlIG9wdGlvbi4gQmVoYXZlcyBhcyBhIGxpc3Rib3guXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC1zZWxlY3Rpb24tbGlzdCcsXG4gIGV4cG9ydEFzOiAnbWF0U2VsZWN0aW9uTGlzdCcsXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJ10sXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdsaXN0Ym94JyxcbiAgICAnW3RhYkluZGV4XSc6ICd0YWJJbmRleCcsXG4gICAgJ2NsYXNzJzogJ21hdC1zZWxlY3Rpb24tbGlzdCBtYXQtbGlzdC1iYXNlJyxcbiAgICAnKGJsdXIpJzogJ19vblRvdWNoZWQoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfa2V5ZG93bigkZXZlbnQpJyxcbiAgICAnYXJpYS1tdWx0aXNlbGVjdGFibGUnOiAndHJ1ZScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICB9LFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBzdHlsZVVybHM6IFsnbGlzdC5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbTUFUX1NFTEVDVElPTl9MSVNUX1ZBTFVFX0FDQ0VTU09SXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0aW9uTGlzdCBleHRlbmRzIF9NYXRTZWxlY3Rpb25MaXN0TWl4aW5CYXNlIGltcGxlbWVudHMgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgQWZ0ZXJDb250ZW50SW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcblxuICAvKiogVGhlIEZvY3VzS2V5TWFuYWdlciB3aGljaCBoYW5kbGVzIGZvY3VzLiAqL1xuICBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdExpc3RPcHRpb24+O1xuXG4gIC8qKiBUaGUgb3B0aW9uIGNvbXBvbmVudHMgY29udGFpbmVkIHdpdGhpbiB0aGlzIHNlbGVjdGlvbi1saXN0LiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdExpc3RPcHRpb24sIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbnM6IFF1ZXJ5TGlzdDxNYXRMaXN0T3B0aW9uPjtcblxuICAvKiogRW1pdHMgYSBjaGFuZ2UgZXZlbnQgd2hlbmV2ZXIgdGhlIHNlbGVjdGVkIHN0YXRlIG9mIGFuIG9wdGlvbiBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0U2VsZWN0aW9uTGlzdENoYW5nZT4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlPigpO1xuXG4gIC8qKiBUYWJpbmRleCBvZiB0aGUgc2VsZWN0aW9uIGxpc3QuICovXG4gIEBJbnB1dCgpIHRhYkluZGV4OiBudW1iZXIgPSAwO1xuXG4gIC8qKiBUaGVtZSBjb2xvciBvZiB0aGUgc2VsZWN0aW9uIGxpc3QuIFRoaXMgc2V0cyB0aGUgY2hlY2tib3ggY29sb3IgZm9yIGFsbCBsaXN0IG9wdGlvbnMuICovXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGUgPSAnYWNjZW50JztcblxuICAvKipcbiAgICogRnVuY3Rpb24gdXNlZCBmb3IgY29tcGFyaW5nIGFuIG9wdGlvbiBhZ2FpbnN0IHRoZSBzZWxlY3RlZCB2YWx1ZSB3aGVuIGRldGVybWluaW5nIHdoaWNoXG4gICAqIG9wdGlvbnMgc2hvdWxkIGFwcGVhciBhcyBzZWxlY3RlZC4gVGhlIGZpcnN0IGFyZ3VtZW50IGlzIHRoZSB2YWx1ZSBvZiBhbiBvcHRpb25zLiBUaGUgc2Vjb25kXG4gICAqIG9uZSBpcyBhIHZhbHVlIGZyb20gdGhlIHNlbGVjdGVkIHZhbHVlLiBBIGJvb2xlYW4gbXVzdCBiZSByZXR1cm5lZC5cbiAgICovXG4gIEBJbnB1dCgpIGNvbXBhcmVXaXRoOiAobzE6IGFueSwgbzI6IGFueSkgPT4gYm9vbGVhbiA9IChhMSwgYTIpID0+IGExID09PSBhMjtcblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0aW9uIGxpc3QgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVkOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIC8vIFRoZSBgTWF0U2VsZWN0aW9uTGlzdGAgYW5kIGBNYXRMaXN0T3B0aW9uYCBhcmUgdXNpbmcgdGhlIGBPblB1c2hgIGNoYW5nZSBkZXRlY3Rpb25cbiAgICAvLyBzdHJhdGVneS4gVGhlcmVmb3JlIHRoZSBvcHRpb25zIHdpbGwgbm90IGNoZWNrIGZvciBhbnkgY2hhbmdlcyBpZiB0aGUgYE1hdFNlbGVjdGlvbkxpc3RgXG4gICAgLy8gY2hhbmdlZCBpdHMgc3RhdGUuIFNpbmNlIHdlIGtub3cgdGhhdCBhIGNoYW5nZSB0byBgZGlzYWJsZWRgIHByb3BlcnR5IG9mIHRoZSBsaXN0IGFmZmVjdHNcbiAgICAvLyB0aGUgc3RhdGUgb2YgdGhlIG9wdGlvbnMsIHdlIG1hbnVhbGx5IG1hcmsgZWFjaCBvcHRpb24gZm9yIGNoZWNrLlxuICAgIHRoaXMuX21hcmtPcHRpb25zRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIG9wdGlvbnMuICovXG4gIHNlbGVjdGVkT3B0aW9uczogU2VsZWN0aW9uTW9kZWw8TWF0TGlzdE9wdGlvbj4gPSBuZXcgU2VsZWN0aW9uTW9kZWw8TWF0TGlzdE9wdGlvbj4odHJ1ZSk7XG5cbiAgLyoqIFZpZXcgdG8gbW9kZWwgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIHdoZW5ldmVyIHRoZSBzZWxlY3RlZCBvcHRpb25zIGNoYW5nZS4gKi9cbiAgcHJpdmF0ZSBfb25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKF86IGFueSkgPT4ge307XG5cbiAgLyoqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50bHktc2VsZWN0ZWQgdmFsdWUuICovXG4gIF92YWx1ZTogc3RyaW5nW118bnVsbDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgbGlzdCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFZpZXcgdG8gbW9kZWwgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIGlmIHRoZSBsaXN0IG9yIGl0cyBvcHRpb25zIGxvc3QgZm9jdXMuICovXG4gIF9vblRvdWNoZWQ6ICgpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogV2hldGhlciB0aGUgbGlzdCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgX2lzRGVzdHJveWVkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudGFiSW5kZXggPSBwYXJzZUludCh0YWJJbmRleCkgfHwgMDtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcjxNYXRMaXN0T3B0aW9uPih0aGlzLm9wdGlvbnMpXG4gICAgICAud2l0aFdyYXAoKVxuICAgICAgLndpdGhUeXBlQWhlYWQoKVxuICAgICAgLy8gQWxsb3cgZGlzYWJsZWQgaXRlbXMgdG8gYmUgZm9jdXNhYmxlLiBGb3IgYWNjZXNzaWJpbGl0eSByZWFzb25zLCB0aGVyZSBtdXN0IGJlIGEgd2F5IGZvclxuICAgICAgLy8gc2NyZWVucmVhZGVyIHVzZXJzLCB0aGF0IGFsbG93cyByZWFkaW5nIHRoZSBkaWZmZXJlbnQgb3B0aW9ucyBvZiB0aGUgbGlzdC5cbiAgICAgIC5za2lwUHJlZGljYXRlKCgpID0+IGZhbHNlKVxuICAgICAgLndpdGhBbGxvd2VkTW9kaWZpZXJLZXlzKFsnc2hpZnRLZXknXSk7XG5cbiAgICBpZiAodGhpcy5fdmFsdWUpIHtcbiAgICAgIHRoaXMuX3NldE9wdGlvbnNGcm9tVmFsdWVzKHRoaXMuX3ZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBTeW5jIGV4dGVybmFsIGNoYW5nZXMgdG8gdGhlIG1vZGVsIGJhY2sgdG8gdGhlIG9wdGlvbnMuXG4gICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMub25DaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmIChldmVudC5hZGRlZCkge1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGV2ZW50LmFkZGVkKSB7XG4gICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50LnJlbW92ZWQpIHtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBldmVudC5yZW1vdmVkKSB7XG4gICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgZGlzYWJsZVJpcHBsZUNoYW5nZXMgPSBjaGFuZ2VzWydkaXNhYmxlUmlwcGxlJ107XG4gICAgY29uc3QgY29sb3JDaGFuZ2VzID0gY2hhbmdlc1snY29sb3InXTtcblxuICAgIGlmICgoZGlzYWJsZVJpcHBsZUNoYW5nZXMgJiYgIWRpc2FibGVSaXBwbGVDaGFuZ2VzLmZpcnN0Q2hhbmdlKSB8fFxuICAgICAgICAoY29sb3JDaGFuZ2VzICYmICFjb2xvckNoYW5nZXMuZmlyc3RDaGFuZ2UpKSB7XG4gICAgICB0aGlzLl9tYXJrT3B0aW9uc0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9pc0Rlc3Ryb3llZCA9IHRydWU7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgc2VsZWN0aW9uIGxpc3QuICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogU2VsZWN0cyBhbGwgb2YgdGhlIG9wdGlvbnMuICovXG4gIHNlbGVjdEFsbCgpIHtcbiAgICB0aGlzLl9zZXRBbGxPcHRpb25zU2VsZWN0ZWQodHJ1ZSk7XG4gIH1cblxuICAvKiogRGVzZWxlY3RzIGFsbCBvZiB0aGUgb3B0aW9ucy4gKi9cbiAgZGVzZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5fc2V0QWxsT3B0aW9uc1NlbGVjdGVkKGZhbHNlKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBmb2N1c2VkIG9wdGlvbiBvZiB0aGUgc2VsZWN0aW9uLWxpc3QuICovXG4gIF9zZXRGb2N1c2VkT3B0aW9uKG9wdGlvbjogTWF0TGlzdE9wdGlvbikge1xuICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShvcHRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW4gb3B0aW9uIGZyb20gdGhlIHNlbGVjdGlvbiBsaXN0IGFuZCB1cGRhdGVzIHRoZSBhY3RpdmUgaXRlbS5cbiAgICogQHJldHVybnMgQ3VycmVudGx5LWFjdGl2ZSBpdGVtLlxuICAgKi9cbiAgX3JlbW92ZU9wdGlvbkZyb21MaXN0KG9wdGlvbjogTWF0TGlzdE9wdGlvbik6IE1hdExpc3RPcHRpb24gfCBudWxsIHtcbiAgICBjb25zdCBvcHRpb25JbmRleCA9IHRoaXMuX2dldE9wdGlvbkluZGV4KG9wdGlvbik7XG5cbiAgICBpZiAob3B0aW9uSW5kZXggPiAtMSAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCA9PT0gb3B0aW9uSW5kZXgpIHtcbiAgICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIG9wdGlvbiBpcyB0aGUgbGFzdCBpdGVtXG4gICAgICBpZiAob3B0aW9uSW5kZXggPiAwKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShvcHRpb25JbmRleCAtIDEpO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb25JbmRleCA9PT0gMCAmJiB0aGlzLm9wdGlvbnMubGVuZ3RoID4gMSkge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oTWF0aC5taW4ob3B0aW9uSW5kZXggKyAxLCB0aGlzLm9wdGlvbnMubGVuZ3RoIC0gMSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW07XG4gIH1cblxuICAvKiogUGFzc2VzIHJlbGV2YW50IGtleSBwcmVzc2VzIHRvIG91ciBrZXkgbWFuYWdlci4gKi9cbiAgX2tleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcbiAgICBjb25zdCBwcmV2aW91c0ZvY3VzSW5kZXggPSBtYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleDtcbiAgICBjb25zdCBoYXNNb2RpZmllciA9IGhhc01vZGlmaWVyS2V5KGV2ZW50KTtcblxuICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgY2FzZSBTUEFDRTpcbiAgICAgIGNhc2UgRU5URVI6XG4gICAgICAgIGlmICghaGFzTW9kaWZpZXIpIHtcbiAgICAgICAgICB0aGlzLl90b2dnbGVGb2N1c2VkT3B0aW9uKCk7XG4gICAgICAgICAgLy8gQWx3YXlzIHByZXZlbnQgc3BhY2UgZnJvbSBzY3JvbGxpbmcgdGhlIHBhZ2Ugc2luY2UgdGhlIGxpc3QgaGFzIGZvY3VzXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSE9NRTpcbiAgICAgIGNhc2UgRU5EOlxuICAgICAgICBpZiAoIWhhc01vZGlmaWVyKSB7XG4gICAgICAgICAga2V5Q29kZSA9PT0gSE9NRSA/IG1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCkgOiBtYW5hZ2VyLnNldExhc3RJdGVtQWN0aXZlKCk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgQTpcbiAgICAgICAgaWYgKGhhc01vZGlmaWVyS2V5KGV2ZW50LCAnY3RybEtleScpKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLmZpbmQob3B0aW9uID0+ICFvcHRpb24uc2VsZWN0ZWQpID8gdGhpcy5zZWxlY3RBbGwoKSA6IHRoaXMuZGVzZWxlY3RBbGwoKTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgIH1cblxuICAgIGlmICgoa2V5Q29kZSA9PT0gVVBfQVJST1cgfHwga2V5Q29kZSA9PT0gRE9XTl9BUlJPVykgJiYgZXZlbnQuc2hpZnRLZXkgJiZcbiAgICAgICAgbWFuYWdlci5hY3RpdmVJdGVtSW5kZXggIT09IHByZXZpb3VzRm9jdXNJbmRleCkge1xuICAgICAgdGhpcy5fdG9nZ2xlRm9jdXNlZE9wdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXBvcnRzIGEgdmFsdWUgY2hhbmdlIHRvIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciAqL1xuICBfcmVwb3J0VmFsdWVDaGFuZ2UoKSB7XG4gICAgLy8gU3RvcCByZXBvcnRpbmcgdmFsdWUgY2hhbmdlcyBhZnRlciB0aGUgbGlzdCBoYXMgYmVlbiBkZXN0cm95ZWQuIFRoaXMgYXZvaWRzXG4gICAgLy8gY2FzZXMgd2hlcmUgdGhlIGxpc3QgbWlnaHQgd3JvbmdseSByZXNldCBpdHMgdmFsdWUgb25jZSBpdCBpcyByZW1vdmVkLCBidXRcbiAgICAvLyB0aGUgZm9ybSBjb250cm9sIGlzIHN0aWxsIGxpdmUuXG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiAhdGhpcy5faXNEZXN0cm95ZWQpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fZ2V0U2VsZWN0ZWRPcHRpb25WYWx1ZXMoKTtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlKTtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVtaXRzIGEgY2hhbmdlIGV2ZW50IGlmIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiBhbiBvcHRpb24gY2hhbmdlZC4gKi9cbiAgX2VtaXRDaGFuZ2VFdmVudChvcHRpb246IE1hdExpc3RPcHRpb24pIHtcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KG5ldyBNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlKHRoaXMsIG9wdGlvbikpO1xuICB9XG5cbiAgLyoqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuICovXG4gIHdyaXRlVmFsdWUodmFsdWVzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWVzO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgdGhpcy5fc2V0T3B0aW9uc0Zyb21WYWx1ZXModmFsdWVzIHx8IFtdKTtcbiAgICB9XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLiAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLiAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci4gKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBzZWxlY3RlZCBvcHRpb25zIGJhc2VkIG9uIHRoZSBzcGVjaWZpZWQgdmFsdWVzLiAqL1xuICBwcml2YXRlIF9zZXRPcHRpb25zRnJvbVZhbHVlcyh2YWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5vcHRpb25zLmZvckVhY2gob3B0aW9uID0+IG9wdGlvbi5fc2V0U2VsZWN0ZWQoZmFsc2UpKTtcblxuICAgIHZhbHVlcy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdPcHRpb24gPSB0aGlzLm9wdGlvbnMuZmluZChvcHRpb24gPT4ge1xuICAgICAgICAvLyBTa2lwIG9wdGlvbnMgdGhhdCBhcmUgYWxyZWFkeSBpbiB0aGUgbW9kZWwuIFRoaXMgYWxsb3dzIHVzIHRvIGhhbmRsZSBjYXNlc1xuICAgICAgICAvLyB3aGVyZSB0aGUgc2FtZSBwcmltaXRpdmUgdmFsdWUgaXMgc2VsZWN0ZWQgbXVsdGlwbGUgdGltZXMuXG4gICAgICAgIHJldHVybiBvcHRpb24uc2VsZWN0ZWQgPyBmYWxzZSA6IHRoaXMuY29tcGFyZVdpdGgob3B0aW9uLnZhbHVlLCB2YWx1ZSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGNvcnJlc3BvbmRpbmdPcHRpb24pIHtcbiAgICAgICAgY29ycmVzcG9uZGluZ09wdGlvbi5fc2V0U2VsZWN0ZWQodHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgdmFsdWVzIG9mIHRoZSBzZWxlY3RlZCBvcHRpb25zLiAqL1xuICBwcml2YXRlIF9nZXRTZWxlY3RlZE9wdGlvblZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIob3B0aW9uID0+IG9wdGlvbi5zZWxlY3RlZCkubWFwKG9wdGlvbiA9PiBvcHRpb24udmFsdWUpO1xuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIHN0YXRlIG9mIHRoZSBjdXJyZW50bHkgZm9jdXNlZCBvcHRpb24gaWYgZW5hYmxlZC4gKi9cbiAgcHJpdmF0ZSBfdG9nZ2xlRm9jdXNlZE9wdGlvbigpOiB2b2lkIHtcbiAgICBsZXQgZm9jdXNlZEluZGV4ID0gdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtSW5kZXg7XG5cbiAgICBpZiAoZm9jdXNlZEluZGV4ICE9IG51bGwgJiYgdGhpcy5faXNWYWxpZEluZGV4KGZvY3VzZWRJbmRleCkpIHtcbiAgICAgIGxldCBmb2N1c2VkT3B0aW9uOiBNYXRMaXN0T3B0aW9uID0gdGhpcy5vcHRpb25zLnRvQXJyYXkoKVtmb2N1c2VkSW5kZXhdO1xuXG4gICAgICBpZiAoZm9jdXNlZE9wdGlvbiAmJiAhZm9jdXNlZE9wdGlvbi5kaXNhYmxlZCkge1xuICAgICAgICBmb2N1c2VkT3B0aW9uLnRvZ2dsZSgpO1xuXG4gICAgICAgIC8vIEVtaXQgYSBjaGFuZ2UgZXZlbnQgYmVjYXVzZSB0aGUgZm9jdXNlZCBvcHRpb24gY2hhbmdlZCBpdHMgc3RhdGUgdGhyb3VnaCB1c2VyXG4gICAgICAgIC8vIGludGVyYWN0aW9uLlxuICAgICAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoZm9jdXNlZE9wdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHNlbGVjdGVkIHN0YXRlIG9uIGFsbCBvZiB0aGUgb3B0aW9uc1xuICAgKiBhbmQgZW1pdHMgYW4gZXZlbnQgaWYgYW55dGhpbmcgY2hhbmdlZC5cbiAgICovXG4gIHByaXZhdGUgX3NldEFsbE9wdGlvbnNTZWxlY3RlZChpc1NlbGVjdGVkOiBib29sZWFuKSB7XG4gICAgLy8gS2VlcCB0cmFjayBvZiB3aGV0aGVyIGFueXRoaW5nIGNoYW5nZWQsIGJlY2F1c2Ugd2Ugb25seSB3YW50IHRvXG4gICAgLy8gZW1pdCB0aGUgY2hhbmdlZCBldmVudCB3aGVuIHNvbWV0aGluZyBhY3R1YWxseSBjaGFuZ2VkLlxuICAgIGxldCBoYXNDaGFuZ2VkID0gZmFsc2U7XG5cbiAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgaWYgKG9wdGlvbi5fc2V0U2VsZWN0ZWQoaXNTZWxlY3RlZCkpIHtcbiAgICAgICAgaGFzQ2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoaGFzQ2hhbmdlZCkge1xuICAgICAgdGhpcy5fcmVwb3J0VmFsdWVDaGFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXRpbGl0eSB0byBlbnN1cmUgYWxsIGluZGV4ZXMgYXJlIHZhbGlkLlxuICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IHRvIGJlIGNoZWNrZWQuXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGluZGV4IGlzIHZhbGlkIGZvciBvdXIgbGlzdCBvZiBvcHRpb25zLlxuICAgKi9cbiAgcHJpdmF0ZSBfaXNWYWxpZEluZGV4KGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMub3B0aW9ucy5sZW5ndGg7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIHNwZWNpZmllZCBsaXN0IG9wdGlvbi4gKi9cbiAgcHJpdmF0ZSBfZ2V0T3B0aW9uSW5kZXgob3B0aW9uOiBNYXRMaXN0T3B0aW9uKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnRvQXJyYXkoKS5pbmRleE9mKG9wdGlvbik7XG4gIH1cblxuICAvKiogTWFya3MgYWxsIHRoZSBvcHRpb25zIHRvIGJlIGNoZWNrZWQgaW4gdGhlIG5leHQgY2hhbmdlIGRldGVjdGlvbiBydW4uICovXG4gIHByaXZhdGUgX21hcmtPcHRpb25zRm9yQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zLmZvckVhY2gob3B0aW9uID0+IG9wdGlvbi5fbWFya0ZvckNoZWNrKCkpO1xuICAgIH1cbiAgfVxufVxuIl19