/**
 * @fileoverview added by tsickle
 * Generated from: src/material/list/selection-list.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
import { A, DOWN_ARROW, END, ENTER, hasModifierKey, HOME, SPACE, UP_ARROW, } from '@angular/cdk/keycodes';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, Input, Output, QueryList, ViewChild, ViewEncapsulation, isDevMode, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatLine, mixinDisableRipple, setLines, } from '@angular/material/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
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
        /**
         * This is set to true after the first OnChanges cycle so we don't clear the value of `selected`
         * in the first cycle.
         */
        this._inputsInitialized = false;
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
        if (this.selected && newValue !== this.value && this._inputsInitialized) {
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
        this._inputsInitialized = true;
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
        if (!this.disabled && (this.selectionList.multiple || !this.selected)) {
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
MatListOption.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: MatSelectionList, decorators: [{ type: Inject, args: [forwardRef((/**
                     * @return {?}
                     */
                    () => MatSelectionList)),] }] }
];
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
if (false) {
    /** @type {?} */
    MatListOption.ngAcceptInputType_disabled;
    /** @type {?} */
    MatListOption.ngAcceptInputType_selected;
    /** @type {?} */
    MatListOption.ngAcceptInputType_disableRipple;
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
     * This is set to true after the first OnChanges cycle so we don't clear the value of `selected`
     * in the first cycle.
     * @type {?}
     * @private
     */
    MatListOption.prototype._inputsInitialized;
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
     * @param {?} _changeDetector
     */
    constructor(_element, 
    // @breaking-change 11.0.0 Remove `tabIndex` parameter.
    tabIndex, _changeDetector) {
        super();
        this._element = _element;
        this._changeDetector = _changeDetector;
        this._multiple = true;
        this._contentInitialized = false;
        /**
         * Emits a change event whenever the selected state of an option changes.
         */
        this.selectionChange = new EventEmitter();
        /**
         * Tabindex of the selection list.
         * \@breaking-change 11.0.0 Remove `tabIndex` input.
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
        this.selectedOptions = new SelectionModel(this._multiple);
        /**
         * The tabindex of the selection list.
         */
        this._tabIndex = -1;
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
     * Whether selection is limited to one or multiple items (default multiple).
     * @return {?}
     */
    get multiple() { return this._multiple; }
    /**
     * @param {?} value
     * @return {?}
     */
    set multiple(value) {
        /** @type {?} */
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._multiple) {
            if (isDevMode() && this._contentInitialized) {
                throw new Error('Cannot change `multiple` mode of mat-selection-list after initialization.');
            }
            this._multiple = newValue;
            this.selectedOptions = new SelectionModel(this._multiple, this.selectedOptions.selected);
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._contentInitialized = true;
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
        // If the user attempts to tab out of the selection list, allow focus to escape.
        this._keyManager.tabOut.pipe(takeUntil(this._destroyed)).subscribe((/**
         * @return {?}
         */
        () => {
            this._allowFocusEscape();
        }));
        // When the number of options change, update the tabindex of the selection list.
        this.options.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe((/**
         * @return {?}
         */
        () => {
            this._updateTabIndex();
        }));
        // Sync external changes to the model back to the options.
        this.selectedOptions.changed.pipe(takeUntil(this._destroyed)).subscribe((/**
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
                    /** @type {?} */
                    const shouldSelect = this.options.some((/**
                     * @param {?} option
                     * @return {?}
                     */
                    option => !option.disabled && !option.selected));
                    this._setAllOptionsSelected(shouldSelect, true);
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
     * When the selection list is focused, we want to move focus to an option within the list. Do this
     * by setting the appropriate option to be active.
     * @return {?}
     */
    _onFocus() {
        /** @type {?} */
        const activeIndex = this._keyManager.activeItemIndex;
        if (!activeIndex || (activeIndex === -1)) {
            // If there is no active index, set focus to the first option.
            this._keyManager.setFirstItemActive();
        }
        else {
            // Otherwise, set focus to the active option.
            this._keyManager.setActiveItem(activeIndex);
        }
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
            if (focusedOption && !focusedOption.disabled && (this._multiple || !focusedOption.selected)) {
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
     * @param {?=} skipDisabled
     * @return {?}
     */
    _setAllOptionsSelected(isSelected, skipDisabled) {
        // Keep track of whether anything changed, because we only want to
        // emit the changed event when something actually changed.
        /** @type {?} */
        let hasChanged = false;
        this.options.forEach((/**
         * @param {?} option
         * @return {?}
         */
        option => {
            if ((!skipDisabled || !option.disabled) && option._setSelected(isSelected)) {
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
    /**
     * Removes the tabindex from the selection list and resets it back afterwards, allowing the user
     * to tab out of it. This prevents the list from capturing focus and redirecting it back within
     * the list, creating a focus trap if it user tries to tab away.
     * @private
     * @return {?}
     */
    _allowFocusEscape() {
        this._tabIndex = -1;
        setTimeout((/**
         * @return {?}
         */
        () => {
            this._tabIndex = 0;
            this._changeDetector.markForCheck();
        }));
    }
    /**
     * Updates the tabindex based upon if the selection list is empty.
     * @private
     * @return {?}
     */
    _updateTabIndex() {
        this._tabIndex = (this.options.length === 0) ? -1 : 0;
    }
}
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
MatSelectionList.ctorParameters = () => [
    { type: ElementRef },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
    { type: ChangeDetectorRef }
];
MatSelectionList.propDecorators = {
    options: [{ type: ContentChildren, args: [MatListOption, { descendants: true },] }],
    selectionChange: [{ type: Output }],
    tabIndex: [{ type: Input }],
    color: [{ type: Input }],
    compareWith: [{ type: Input }],
    disabled: [{ type: Input }],
    multiple: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MatSelectionList.ngAcceptInputType_disabled;
    /** @type {?} */
    MatSelectionList.ngAcceptInputType_disableRipple;
    /** @type {?} */
    MatSelectionList.ngAcceptInputType_multiple;
    /**
     * @type {?}
     * @private
     */
    MatSelectionList.prototype._multiple;
    /**
     * @type {?}
     * @private
     */
    MatSelectionList.prototype._contentInitialized;
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
     * \@breaking-change 11.0.0 Remove `tabIndex` input.
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
     * The tabindex of the selection list.
     * @type {?}
     */
    MatSelectionList.prototype._tabIndex;
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
    /**
     * @type {?}
     * @private
     */
    MatSelectionList.prototype._changeDetector;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLWxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC9zZWxlY3Rpb24tbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQWtCLGVBQWUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ25FLE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsQ0FBQyxFQUNELFVBQVUsRUFDVixHQUFHLEVBQ0gsS0FBSyxFQUNMLGNBQWMsRUFDZCxJQUFJLEVBQ0osS0FBSyxFQUNMLFFBQVEsR0FDVCxNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFFTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUlMLE1BQU0sRUFDTixTQUFTLEVBRVQsU0FBUyxFQUNULGlCQUFpQixFQUNqQixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZFLE9BQU8sRUFHTCxPQUFPLEVBQ1Asa0JBQWtCLEVBQ2xCLFFBQVEsR0FFVCxNQUFNLHdCQUF3QixDQUFDO0FBRWhDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMseUJBQXlCLEVBQUUsdUJBQXVCLEVBQUMsTUFBTSxRQUFRLENBQUM7Ozs7QUFJMUUsTUFBTSxvQkFBb0I7Q0FBRzs7TUFDdkIsMEJB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UUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFdBQVcsRUFBRSxrQkFBa0I7b0JBQy9CLDZCQUE2QixFQUFFLFVBQVU7b0JBQ3pDLHNCQUFzQixFQUFFLHFCQUFxQjtvQkFDN0MsaUJBQWlCLEVBQUUsV0FBVztpQkFDL0I7Z0JBQ0QsUUFBUSxFQUFFLDJCQUEyQjtnQkFFckMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLFNBQVMsRUFBRSxDQUFDLGlDQUFpQyxDQUFDO2dCQUM5QyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7YUFDaEQ7Ozs7WUFyVEMsVUFBVTt5Q0EyWVAsU0FBUyxTQUFDLFVBQVU7WUEvWXZCLGlCQUFpQjs7O3NCQW1VaEIsZUFBZSxTQUFDLGFBQWEsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7OEJBR2xELE1BQU07dUJBT04sS0FBSztvQkFHTCxLQUFLOzBCQU9MLEtBQUs7dUJBR0wsS0FBSzt1QkFjTCxLQUFLOzs7O0lBaVZOLDRDQUFnRDs7SUFDaEQsaURBQXFEOztJQUNyRCw0Q0FBZ0Q7Ozs7O0lBL1hoRCxxQ0FBeUI7Ozs7O0lBQ3pCLCtDQUFvQzs7Ozs7SUFHcEMsdUNBQTRDOzs7OztJQUc1QyxtQ0FBdUY7Ozs7O0lBR3ZGLDJDQUMrQzs7Ozs7O0lBTS9DLG9DQUE4Qjs7Ozs7SUFHOUIsaUNBQXdDOzs7Ozs7O0lBT3hDLHVDQUE0RTs7Ozs7SUFjNUUscUNBQW1DOzs7OztJQW9CbkMsMkNBQW9FOzs7OztJQUdwRSxxQ0FBZTs7Ozs7O0lBR2YscUNBQXlEOzs7OztJQUd6RCxrQ0FBc0I7Ozs7OztJQUd0QixzQ0FBeUM7Ozs7O0lBR3pDLHNDQUFrQzs7Ozs7O0lBR2xDLHdDQUE4Qjs7Ozs7SUFFbEIsb0NBQXlDOzs7OztJQUduRCwyQ0FBMEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c2FibGVPcHRpb24sIEZvY3VzS2V5TWFuYWdlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7U2VsZWN0aW9uTW9kZWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge1xuICBBLFxuICBET1dOX0FSUk9XLFxuICBFTkQsXG4gIEVOVEVSLFxuICBoYXNNb2RpZmllcktleSxcbiAgSE9NRSxcbiAgU1BBQ0UsXG4gIFVQX0FSUk9XLFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIGlzRGV2TW9kZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZUN0b3IsXG4gIE1hdExpbmUsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgc2V0TGluZXMsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7TWF0TGlzdEF2YXRhckNzc01hdFN0eWxlciwgTWF0TGlzdEljb25Dc3NNYXRTdHlsZXJ9IGZyb20gJy4vbGlzdCc7XG5cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFNlbGVjdGlvbkxpc3RCYXNlIHt9XG5jb25zdCBfTWF0U2VsZWN0aW9uTGlzdE1peGluQmFzZTogQ2FuRGlzYWJsZVJpcHBsZUN0b3IgJiB0eXBlb2YgTWF0U2VsZWN0aW9uTGlzdEJhc2UgPVxuICAgIG1peGluRGlzYWJsZVJpcHBsZShNYXRTZWxlY3Rpb25MaXN0QmFzZSk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRMaXN0T3B0aW9uQmFzZSB7fVxuY29uc3QgX01hdExpc3RPcHRpb25NaXhpbkJhc2U6IENhbkRpc2FibGVSaXBwbGVDdG9yICYgdHlwZW9mIE1hdExpc3RPcHRpb25CYXNlID1cbiAgICBtaXhpbkRpc2FibGVSaXBwbGUoTWF0TGlzdE9wdGlvbkJhc2UpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TRUxFQ1RJT05fTElTVF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0U2VsZWN0aW9uTGlzdCksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKiogQ2hhbmdlIGV2ZW50IHRoYXQgaXMgYmVpbmcgZmlyZWQgd2hlbmV2ZXIgdGhlIHNlbGVjdGVkIHN0YXRlIG9mIGFuIG9wdGlvbiBjaGFuZ2VzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdGlvbkxpc3RDaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBzZWxlY3Rpb24gbGlzdCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdFNlbGVjdGlvbkxpc3QsXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgb3B0aW9uIHRoYXQgaGFzIGJlZW4gY2hhbmdlZC4gKi9cbiAgICBwdWJsaWMgb3B0aW9uOiBNYXRMaXN0T3B0aW9uKSB7fVxufVxuXG4vKipcbiAqIENvbXBvbmVudCBmb3IgbGlzdC1vcHRpb25zIG9mIHNlbGVjdGlvbi1saXN0LiBFYWNoIGxpc3Qtb3B0aW9uIGNhbiBhdXRvbWF0aWNhbGx5XG4gKiBnZW5lcmF0ZSBhIGNoZWNrYm94IGFuZCBjYW4gcHV0IGN1cnJlbnQgaXRlbSBpbnRvIHRoZSBzZWxlY3Rpb25Nb2RlbCBvZiBzZWxlY3Rpb24tbGlzdFxuICogaWYgdGhlIGN1cnJlbnQgaXRlbSBpcyBzZWxlY3RlZC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWxpc3Qtb3B0aW9uJyxcbiAgZXhwb3J0QXM6ICdtYXRMaXN0T3B0aW9uJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVSaXBwbGUnXSxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ29wdGlvbicsXG4gICAgJ2NsYXNzJzogJ21hdC1saXN0LWl0ZW0gbWF0LWxpc3Qtb3B0aW9uIG1hdC1mb2N1cy1pbmRpY2F0b3InLFxuICAgICcoZm9jdXMpJzogJ19oYW5kbGVGb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ19oYW5kbGVCbHVyKCknLFxuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygpJyxcbiAgICAnW2NsYXNzLm1hdC1saXN0LWl0ZW0tZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1saXN0LWl0ZW0td2l0aC1hdmF0YXJdJzogJ19hdmF0YXIgfHwgX2ljb24nLFxuICAgIC8vIE1hbnVhbGx5IHNldCB0aGUgXCJwcmltYXJ5XCIgb3IgXCJ3YXJuXCIgY2xhc3MgaWYgdGhlIGNvbG9yIGhhcyBiZWVuIGV4cGxpY2l0bHlcbiAgICAvLyBzZXQgdG8gXCJwcmltYXJ5XCIgb3IgXCJ3YXJuXCIuIFRoZSBwc2V1ZG8gY2hlY2tib3ggcGlja3MgdXAgdGhlc2UgY2xhc3NlcyBmb3JcbiAgICAvLyBpdHMgdGhlbWUuXG4gICAgJ1tjbGFzcy5tYXQtcHJpbWFyeV0nOiAnY29sb3IgPT09IFwicHJpbWFyeVwiJyxcbiAgICAvLyBFdmVuIHRob3VnaCBhY2NlbnQgaXMgdGhlIGRlZmF1bHQsIHdlIG5lZWQgdG8gc2V0IHRoaXMgY2xhc3MgYW55d2F5LCBiZWNhdXNlIHRoZSAgbGlzdCBtaWdodFxuICAgIC8vIGJlIHBsYWNlZCBpbnNpZGUgYSBwYXJlbnQgdGhhdCBoYXMgb25lIG9mIHRoZSBvdGhlciBjb2xvcnMgd2l0aCBhIGhpZ2hlciBzcGVjaWZpY2l0eS5cbiAgICAnW2NsYXNzLm1hdC1hY2NlbnRdJzogJ2NvbG9yICE9PSBcInByaW1hcnlcIiAmJiBjb2xvciAhPT0gXCJ3YXJuXCInLFxuICAgICdbY2xhc3MubWF0LXdhcm5dJzogJ2NvbG9yID09PSBcIndhcm5cIicsXG4gICAgJ1tjbGFzcy5tYXQtbGlzdC1zaW5nbGUtc2VsZWN0ZWQtb3B0aW9uXSc6ICdzZWxlY3RlZCAmJiAhc2VsZWN0aW9uTGlzdC5tdWx0aXBsZScsXG4gICAgJ1thdHRyLmFyaWEtc2VsZWN0ZWRdJzogJ3NlbGVjdGVkJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnLTEnLFxuICB9LFxuICB0ZW1wbGF0ZVVybDogJ2xpc3Qtb3B0aW9uLmh0bWwnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGlzdE9wdGlvbiBleHRlbmRzIF9NYXRMaXN0T3B0aW9uTWl4aW5CYXNlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9uSW5pdCwgRm9jdXNhYmxlT3B0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhbkRpc2FibGVSaXBwbGUge1xuICBwcml2YXRlIF9zZWxlY3RlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9oYXNGb2N1cyA9IGZhbHNlO1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0TGlzdEF2YXRhckNzc01hdFN0eWxlcikgX2F2YXRhcjogTWF0TGlzdEF2YXRhckNzc01hdFN0eWxlcjtcbiAgQENvbnRlbnRDaGlsZChNYXRMaXN0SWNvbkNzc01hdFN0eWxlcikgX2ljb246IE1hdExpc3RJY29uQ3NzTWF0U3R5bGVyO1xuICBAQ29udGVudENoaWxkcmVuKE1hdExpbmUsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9saW5lczogUXVlcnlMaXN0PE1hdExpbmU+O1xuXG4gIC8qKiBET00gZWxlbWVudCBjb250YWluaW5nIHRoZSBpdGVtJ3MgdGV4dC4gKi9cbiAgQFZpZXdDaGlsZCgndGV4dCcpIF90ZXh0OiBFbGVtZW50UmVmO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgYXBwZWFyIGJlZm9yZSBvciBhZnRlciB0aGUgY2hlY2tib3guIERlZmF1bHRzIHRvICdhZnRlcicgKi9cbiAgQElucHV0KCkgY2hlY2tib3hQb3NpdGlvbjogJ2JlZm9yZScgfCAnYWZ0ZXInID0gJ2FmdGVyJztcblxuICAvKiogVGhlbWUgY29sb3Igb2YgdGhlIGxpc3Qgb3B0aW9uLiBUaGlzIHNldHMgdGhlIGNvbG9yIG9mIHRoZSBjaGVja2JveC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGNvbG9yKCk6IFRoZW1lUGFsZXR0ZSB7IHJldHVybiB0aGlzLl9jb2xvciB8fCB0aGlzLnNlbGVjdGlvbkxpc3QuY29sb3I7IH1cbiAgc2V0IGNvbG9yKG5ld1ZhbHVlOiBUaGVtZVBhbGV0dGUpIHsgdGhpcy5fY29sb3IgPSBuZXdWYWx1ZTsgfVxuICBwcml2YXRlIF9jb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKlxuICAgKiBUaGlzIGlzIHNldCB0byB0cnVlIGFmdGVyIHRoZSBmaXJzdCBPbkNoYW5nZXMgY3ljbGUgc28gd2UgZG9uJ3QgY2xlYXIgdGhlIHZhbHVlIG9mIGBzZWxlY3RlZGBcbiAgICogaW4gdGhlIGZpcnN0IGN5Y2xlLlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5wdXRzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgLyoqIFZhbHVlIG9mIHRoZSBvcHRpb24gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLnNlbGVjdGVkICYmIG5ld1ZhbHVlICE9PSB0aGlzLnZhbHVlICYmIHRoaXMuX2lucHV0c0luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgfVxuICBwcml2YXRlIF92YWx1ZTogYW55O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBvcHRpb24gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVkIHx8ICh0aGlzLnNlbGVjdGlvbkxpc3QgJiYgdGhpcy5zZWxlY3Rpb25MaXN0LmRpc2FibGVkKTsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGFueSkge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgb3B0aW9uIGlzIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnNlbGVjdGlvbkxpc3Quc2VsZWN0ZWRPcHRpb25zLmlzU2VsZWN0ZWQodGhpcyk7IH1cbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAoaXNTZWxlY3RlZCAhPT0gdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NldFNlbGVjdGVkKGlzU2VsZWN0ZWQpO1xuICAgICAgdGhpcy5zZWxlY3Rpb25MaXN0Ll9yZXBvcnRWYWx1ZUNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIC8qKiBAZG9jcy1wcml2YXRlICovXG4gICAgICAgICAgICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBNYXRTZWxlY3Rpb25MaXN0KSkgcHVibGljIHNlbGVjdGlvbkxpc3Q6IE1hdFNlbGVjdGlvbkxpc3QpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuc2VsZWN0aW9uTGlzdDtcblxuICAgIGlmIChsaXN0Ll92YWx1ZSAmJiBsaXN0Ll92YWx1ZS5zb21lKHZhbHVlID0+IGxpc3QuY29tcGFyZVdpdGgodmFsdWUsIHRoaXMuX3ZhbHVlKSkpIHtcbiAgICAgIHRoaXMuX3NldFNlbGVjdGVkKHRydWUpO1xuICAgIH1cblxuICAgIGNvbnN0IHdhc1NlbGVjdGVkID0gdGhpcy5fc2VsZWN0ZWQ7XG5cbiAgICAvLyBMaXN0IG9wdGlvbnMgdGhhdCBhcmUgc2VsZWN0ZWQgYXQgaW5pdGlhbGl6YXRpb24gY2FuJ3QgYmUgcmVwb3J0ZWQgcHJvcGVybHkgdG8gdGhlIGZvcm1cbiAgICAvLyBjb250cm9sLiBUaGlzIGlzIGJlY2F1c2UgaXQgdGFrZXMgc29tZSB0aW1lIHVudGlsIHRoZSBzZWxlY3Rpb24tbGlzdCBrbm93cyBhYm91dCBhbGxcbiAgICAvLyBhdmFpbGFibGUgb3B0aW9ucy4gQWxzbyBpdCBjYW4gaGFwcGVuIHRoYXQgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGhhcyBhbiBpbml0aWFsIHZhbHVlXG4gICAgLy8gdGhhdCBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkLiBEZWZlcnJpbmcgdGhlIHZhbHVlIGNoYW5nZSByZXBvcnQgdG8gdGhlIG5leHQgdGljayBlbnN1cmVzXG4gICAgLy8gdGhhdCB0aGUgZm9ybSBjb250cm9sIHZhbHVlIGlzIG5vdCBiZWluZyBvdmVyd3JpdHRlbi5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9zZWxlY3RlZCB8fCB3YXNTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5faW5wdXRzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHNldExpbmVzKHRoaXMuX2xpbmVzLCB0aGlzLl9lbGVtZW50KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNlbGVjdGVkKSB7XG4gICAgICAvLyBXZSBoYXZlIHRvIGRlbGF5IHRoaXMgdW50aWwgdGhlIG5leHQgdGljayBpbiBvcmRlclxuICAgICAgLy8gdG8gYXZvaWQgY2hhbmdlZCBhZnRlciBjaGVja2VkIGVycm9ycy5cbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBoYWRGb2N1cyA9IHRoaXMuX2hhc0ZvY3VzO1xuICAgIGNvbnN0IG5ld0FjdGl2ZUl0ZW0gPSB0aGlzLnNlbGVjdGlvbkxpc3QuX3JlbW92ZU9wdGlvbkZyb21MaXN0KHRoaXMpO1xuXG4gICAgLy8gT25seSBtb3ZlIGZvY3VzIGlmIHRoaXMgb3B0aW9uIHdhcyBmb2N1c2VkIGF0IHRoZSB0aW1lIGl0IHdhcyBkZXN0cm95ZWQuXG4gICAgaWYgKGhhZEZvY3VzICYmIG5ld0FjdGl2ZUl0ZW0pIHtcbiAgICAgIG5ld0FjdGl2ZUl0ZW0uZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgc2VsZWN0aW9uIHN0YXRlIG9mIHRoZSBvcHRpb24uICovXG4gIHRvZ2dsZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdGVkID0gIXRoaXMuc2VsZWN0ZWQ7XG4gIH1cblxuICAvKiogQWxsb3dzIGZvciBwcm9ncmFtbWF0aWMgZm9jdXNpbmcgb2YgdGhlIG9wdGlvbi4gKi9cbiAgZm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbGlzdCBpdGVtJ3MgdGV4dCBsYWJlbC4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIHRoZSBGb2N1c0tleU1hbmFnZXIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldExhYmVsKCkge1xuICAgIHJldHVybiB0aGlzLl90ZXh0ID8gKHRoaXMuX3RleHQubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudCB8fCAnJykgOiAnJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgbGlzdCBpdGVtIHNob3VsZCBzaG93IGEgcmlwcGxlIGVmZmVjdCB3aGVuIGNsaWNrZWQuICovXG4gIF9pc1JpcHBsZURpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVJpcHBsZSB8fCB0aGlzLnNlbGVjdGlvbkxpc3QuZGlzYWJsZVJpcHBsZTtcbiAgfVxuXG4gIF9oYW5kbGVDbGljaygpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgKHRoaXMuc2VsZWN0aW9uTGlzdC5tdWx0aXBsZSB8fCAhdGhpcy5zZWxlY3RlZCkpIHtcbiAgICAgIHRoaXMudG9nZ2xlKCk7XG5cbiAgICAgIC8vIEVtaXQgYSBjaGFuZ2UgZXZlbnQgaWYgdGhlIHNlbGVjdGVkIHN0YXRlIG9mIHRoZSBvcHRpb24gY2hhbmdlZCB0aHJvdWdoIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgICB0aGlzLnNlbGVjdGlvbkxpc3QuX2VtaXRDaGFuZ2VFdmVudCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlRm9jdXMoKSB7XG4gICAgdGhpcy5zZWxlY3Rpb25MaXN0Ll9zZXRGb2N1c2VkT3B0aW9uKHRoaXMpO1xuICAgIHRoaXMuX2hhc0ZvY3VzID0gdHJ1ZTtcbiAgfVxuXG4gIF9oYW5kbGVCbHVyKCkge1xuICAgIHRoaXMuc2VsZWN0aW9uTGlzdC5fb25Ub3VjaGVkKCk7XG4gICAgdGhpcy5faGFzRm9jdXMgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBSZXRyaWV2ZXMgdGhlIERPTSBlbGVtZW50IG9mIHRoZSBjb21wb25lbnQgaG9zdC4gKi9cbiAgX2dldEhvc3RFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHNlbGVjdGVkIHN0YXRlIG9mIHRoZSBvcHRpb24uIFJldHVybnMgd2hldGhlciB0aGUgdmFsdWUgaGFzIGNoYW5nZWQuICovXG4gIF9zZXRTZWxlY3RlZChzZWxlY3RlZDogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGlmIChzZWxlY3RlZCA9PT0gdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLl9zZWxlY3RlZCA9IHNlbGVjdGVkO1xuXG4gICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkxpc3Quc2VsZWN0ZWRPcHRpb25zLnNlbGVjdCh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3Rpb25MaXN0LnNlbGVjdGVkT3B0aW9ucy5kZXNlbGVjdCh0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3RpZmllcyBBbmd1bGFyIHRoYXQgdGhlIG9wdGlvbiBuZWVkcyB0byBiZSBjaGVja2VkIGluIHRoZSBuZXh0IGNoYW5nZSBkZXRlY3Rpb24gcnVuLiBNYWlubHlcbiAgICogdXNlZCB0byB0cmlnZ2VyIGFuIHVwZGF0ZSBvZiB0aGUgbGlzdCBvcHRpb24gaWYgdGhlIGRpc2FibGVkIHN0YXRlIG9mIHRoZSBzZWxlY3Rpb24gbGlzdFxuICAgKiBjaGFuZ2VkLlxuICAgKi9cbiAgX21hcmtGb3JDaGVjaygpIHtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2VsZWN0ZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbn1cblxuXG4vKipcbiAqIE1hdGVyaWFsIERlc2lnbiBsaXN0IGNvbXBvbmVudCB3aGVyZSBlYWNoIGl0ZW0gaXMgYSBzZWxlY3RhYmxlIG9wdGlvbi4gQmVoYXZlcyBhcyBhIGxpc3Rib3guXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1zZWxlY3Rpb24tbGlzdCcsXG4gIGV4cG9ydEFzOiAnbWF0U2VsZWN0aW9uTGlzdCcsXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJ10sXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdsaXN0Ym94JyxcbiAgICAnY2xhc3MnOiAnbWF0LXNlbGVjdGlvbi1saXN0IG1hdC1saXN0LWJhc2UnLFxuICAgICcoZm9jdXMpJzogJ19vbkZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX29uVG91Y2hlZCgpJyxcbiAgICAnKGtleWRvd24pJzogJ19rZXlkb3duKCRldmVudCknLFxuICAgICdbYXR0ci5hcmlhLW11bHRpc2VsZWN0YWJsZV0nOiAnbXVsdGlwbGUnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ190YWJJbmRleCcsXG4gIH0sXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIHN0eWxlVXJsczogWydsaXN0LmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFtNQVRfU0VMRUNUSU9OX0xJU1RfVkFMVUVfQUNDRVNTT1JdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3Rpb25MaXN0IGV4dGVuZHMgX01hdFNlbGVjdGlvbkxpc3RNaXhpbkJhc2UgaW1wbGVtZW50cyBDYW5EaXNhYmxlUmlwcGxlLFxuICBBZnRlckNvbnRlbnRJbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBwcml2YXRlIF9tdWx0aXBsZSA9IHRydWU7XG4gIHByaXZhdGUgX2NvbnRlbnRJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgRm9jdXNLZXlNYW5hZ2VyIHdoaWNoIGhhbmRsZXMgZm9jdXMuICovXG4gIF9rZXlNYW5hZ2VyOiBGb2N1c0tleU1hbmFnZXI8TWF0TGlzdE9wdGlvbj47XG5cbiAgLyoqIFRoZSBvcHRpb24gY29tcG9uZW50cyBjb250YWluZWQgd2l0aGluIHRoaXMgc2VsZWN0aW9uLWxpc3QuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TGlzdE9wdGlvbiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgb3B0aW9uczogUXVlcnlMaXN0PE1hdExpc3RPcHRpb24+O1xuXG4gIC8qKiBFbWl0cyBhIGNoYW5nZSBldmVudCB3aGVuZXZlciB0aGUgc2VsZWN0ZWQgc3RhdGUgb2YgYW4gb3B0aW9uIGNoYW5nZXMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3Rpb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlPiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFNlbGVjdGlvbkxpc3RDaGFuZ2U+KCk7XG5cbiAgLyoqXG4gICAqIFRhYmluZGV4IG9mIHRoZSBzZWxlY3Rpb24gbGlzdC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgUmVtb3ZlIGB0YWJJbmRleGAgaW5wdXQuXG4gICAqL1xuICBASW5wdXQoKSB0YWJJbmRleDogbnVtYmVyID0gMDtcblxuICAvKiogVGhlbWUgY29sb3Igb2YgdGhlIHNlbGVjdGlvbiBsaXN0LiBUaGlzIHNldHMgdGhlIGNoZWNrYm94IGNvbG9yIGZvciBhbGwgbGlzdCBvcHRpb25zLiAqL1xuICBASW5wdXQoKSBjb2xvcjogVGhlbWVQYWxldHRlID0gJ2FjY2VudCc7XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHVzZWQgZm9yIGNvbXBhcmluZyBhbiBvcHRpb24gYWdhaW5zdCB0aGUgc2VsZWN0ZWQgdmFsdWUgd2hlbiBkZXRlcm1pbmluZyB3aGljaFxuICAgKiBvcHRpb25zIHNob3VsZCBhcHBlYXIgYXMgc2VsZWN0ZWQuIFRoZSBmaXJzdCBhcmd1bWVudCBpcyB0aGUgdmFsdWUgb2YgYW4gb3B0aW9ucy4gVGhlIHNlY29uZFxuICAgKiBvbmUgaXMgYSB2YWx1ZSBmcm9tIHRoZSBzZWxlY3RlZCB2YWx1ZS4gQSBib29sZWFuIG11c3QgYmUgcmV0dXJuZWQuXG4gICAqL1xuICBASW5wdXQoKSBjb21wYXJlV2l0aDogKG8xOiBhbnksIG8yOiBhbnkpID0+IGJvb2xlYW4gPSAoYTEsIGEyKSA9PiBhMSA9PT0gYTI7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNlbGVjdGlvbiBsaXN0IGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlZDsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICAvLyBUaGUgYE1hdFNlbGVjdGlvbkxpc3RgIGFuZCBgTWF0TGlzdE9wdGlvbmAgYXJlIHVzaW5nIHRoZSBgT25QdXNoYCBjaGFuZ2UgZGV0ZWN0aW9uXG4gICAgLy8gc3RyYXRlZ3kuIFRoZXJlZm9yZSB0aGUgb3B0aW9ucyB3aWxsIG5vdCBjaGVjayBmb3IgYW55IGNoYW5nZXMgaWYgdGhlIGBNYXRTZWxlY3Rpb25MaXN0YFxuICAgIC8vIGNoYW5nZWQgaXRzIHN0YXRlLiBTaW5jZSB3ZSBrbm93IHRoYXQgYSBjaGFuZ2UgdG8gYGRpc2FibGVkYCBwcm9wZXJ0eSBvZiB0aGUgbGlzdCBhZmZlY3RzXG4gICAgLy8gdGhlIHN0YXRlIG9mIHRoZSBvcHRpb25zLCB3ZSBtYW51YWxseSBtYXJrIGVhY2ggb3B0aW9uIGZvciBjaGVjay5cbiAgICB0aGlzLl9tYXJrT3B0aW9uc0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciBzZWxlY3Rpb24gaXMgbGltaXRlZCB0byBvbmUgb3IgbXVsdGlwbGUgaXRlbXMgKGRlZmF1bHQgbXVsdGlwbGUpLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbXVsdGlwbGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9tdWx0aXBsZTsgfVxuICBzZXQgbXVsdGlwbGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX211bHRpcGxlKSB7XG4gICAgICBpZiAoaXNEZXZNb2RlKCkgJiYgdGhpcy5fY29udGVudEluaXRpYWxpemVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdDYW5ub3QgY2hhbmdlIGBtdWx0aXBsZWAgbW9kZSBvZiBtYXQtc2VsZWN0aW9uLWxpc3QgYWZ0ZXIgaW5pdGlhbGl6YXRpb24uJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX211bHRpcGxlID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLnNlbGVjdGVkT3B0aW9ucyA9IG5ldyBTZWxlY3Rpb25Nb2RlbCh0aGlzLl9tdWx0aXBsZSwgdGhpcy5zZWxlY3RlZE9wdGlvbnMuc2VsZWN0ZWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIG9wdGlvbnMuICovXG4gIHNlbGVjdGVkT3B0aW9ucyA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxNYXRMaXN0T3B0aW9uPih0aGlzLl9tdWx0aXBsZSk7XG5cbiAgLyoqIFRoZSB0YWJpbmRleCBvZiB0aGUgc2VsZWN0aW9uIGxpc3QuICovXG4gIF90YWJJbmRleCA9IC0xO1xuXG4gIC8qKiBWaWV3IHRvIG1vZGVsIGNhbGxiYWNrIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCB3aGVuZXZlciB0aGUgc2VsZWN0ZWQgb3B0aW9ucyBjaGFuZ2UuICovXG4gIHByaXZhdGUgX29uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9IChfOiBhbnkpID0+IHt9O1xuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudGx5LXNlbGVjdGVkIHZhbHVlLiAqL1xuICBfdmFsdWU6IHN0cmluZ1tdfG51bGw7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGxpc3QgaGFzIGJlZW4gZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBWaWV3IHRvIG1vZGVsIGNhbGxiYWNrIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCBpZiB0aGUgbGlzdCBvciBpdHMgb3B0aW9ucyBsb3N0IGZvY3VzLiAqL1xuICBfb25Ub3VjaGVkOiAoKSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxpc3QgaGFzIGJlZW4gZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIF9pc0Rlc3Ryb3llZDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDExLjAuMCBSZW1vdmUgYHRhYkluZGV4YCBwYXJhbWV0ZXIuXG4gICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fY29udGVudEluaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgRm9jdXNLZXlNYW5hZ2VyPE1hdExpc3RPcHRpb24+KHRoaXMub3B0aW9ucylcbiAgICAgIC53aXRoV3JhcCgpXG4gICAgICAud2l0aFR5cGVBaGVhZCgpXG4gICAgICAvLyBBbGxvdyBkaXNhYmxlZCBpdGVtcyB0byBiZSBmb2N1c2FibGUuIEZvciBhY2Nlc3NpYmlsaXR5IHJlYXNvbnMsIHRoZXJlIG11c3QgYmUgYSB3YXkgZm9yXG4gICAgICAvLyBzY3JlZW5yZWFkZXIgdXNlcnMsIHRoYXQgYWxsb3dzIHJlYWRpbmcgdGhlIGRpZmZlcmVudCBvcHRpb25zIG9mIHRoZSBsaXN0LlxuICAgICAgLnNraXBQcmVkaWNhdGUoKCkgPT4gZmFsc2UpXG4gICAgICAud2l0aEFsbG93ZWRNb2RpZmllcktleXMoWydzaGlmdEtleSddKTtcblxuICAgIGlmICh0aGlzLl92YWx1ZSkge1xuICAgICAgdGhpcy5fc2V0T3B0aW9uc0Zyb21WYWx1ZXModGhpcy5fdmFsdWUpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSB1c2VyIGF0dGVtcHRzIHRvIHRhYiBvdXQgb2YgdGhlIHNlbGVjdGlvbiBsaXN0LCBhbGxvdyBmb2N1cyB0byBlc2NhcGUuXG4gICAgdGhpcy5fa2V5TWFuYWdlci50YWJPdXQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2FsbG93Rm9jdXNFc2NhcGUoKTtcbiAgICB9KTtcblxuICAgIC8vIFdoZW4gdGhlIG51bWJlciBvZiBvcHRpb25zIGNoYW5nZSwgdXBkYXRlIHRoZSB0YWJpbmRleCBvZiB0aGUgc2VsZWN0aW9uIGxpc3QuXG4gICAgdGhpcy5vcHRpb25zLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fdXBkYXRlVGFiSW5kZXgoKTtcbiAgICB9KTtcblxuICAgIC8vIFN5bmMgZXh0ZXJuYWwgY2hhbmdlcyB0byB0aGUgbW9kZWwgYmFjayB0byB0aGUgb3B0aW9ucy5cbiAgICB0aGlzLnNlbGVjdGVkT3B0aW9ucy5jaGFuZ2VkLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQuYWRkZWQpIHtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBldmVudC5hZGRlZCkge1xuICAgICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudC5yZW1vdmVkKSB7XG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgZXZlbnQucmVtb3ZlZCkge1xuICAgICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IGRpc2FibGVSaXBwbGVDaGFuZ2VzID0gY2hhbmdlc1snZGlzYWJsZVJpcHBsZSddO1xuICAgIGNvbnN0IGNvbG9yQ2hhbmdlcyA9IGNoYW5nZXNbJ2NvbG9yJ107XG5cbiAgICBpZiAoKGRpc2FibGVSaXBwbGVDaGFuZ2VzICYmICFkaXNhYmxlUmlwcGxlQ2hhbmdlcy5maXJzdENoYW5nZSkgfHxcbiAgICAgICAgKGNvbG9yQ2hhbmdlcyAmJiAhY29sb3JDaGFuZ2VzLmZpcnN0Q2hhbmdlKSkge1xuICAgICAgdGhpcy5fbWFya09wdGlvbnNGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5faXNEZXN0cm95ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHNlbGVjdGlvbiBsaXN0LiAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIFNlbGVjdHMgYWxsIG9mIHRoZSBvcHRpb25zLiAqL1xuICBzZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5fc2V0QWxsT3B0aW9uc1NlbGVjdGVkKHRydWUpO1xuICB9XG5cbiAgLyoqIERlc2VsZWN0cyBhbGwgb2YgdGhlIG9wdGlvbnMuICovXG4gIGRlc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuX3NldEFsbE9wdGlvbnNTZWxlY3RlZChmYWxzZSk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgZm9jdXNlZCBvcHRpb24gb2YgdGhlIHNlbGVjdGlvbi1saXN0LiAqL1xuICBfc2V0Rm9jdXNlZE9wdGlvbihvcHRpb246IE1hdExpc3RPcHRpb24pIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0ob3B0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuIG9wdGlvbiBmcm9tIHRoZSBzZWxlY3Rpb24gbGlzdCBhbmQgdXBkYXRlcyB0aGUgYWN0aXZlIGl0ZW0uXG4gICAqIEByZXR1cm5zIEN1cnJlbnRseS1hY3RpdmUgaXRlbS5cbiAgICovXG4gIF9yZW1vdmVPcHRpb25Gcm9tTGlzdChvcHRpb246IE1hdExpc3RPcHRpb24pOiBNYXRMaXN0T3B0aW9uIHwgbnVsbCB7XG4gICAgY29uc3Qgb3B0aW9uSW5kZXggPSB0aGlzLl9nZXRPcHRpb25JbmRleChvcHRpb24pO1xuXG4gICAgaWYgKG9wdGlvbkluZGV4ID4gLTEgJiYgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtSW5kZXggPT09IG9wdGlvbkluZGV4KSB7XG4gICAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBvcHRpb24gaXMgdGhlIGxhc3QgaXRlbVxuICAgICAgaWYgKG9wdGlvbkluZGV4ID4gMCkge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0ob3B0aW9uSW5kZXggLSAxKTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uSW5kZXggPT09IDAgJiYgdGhpcy5vcHRpb25zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKE1hdGgubWluKG9wdGlvbkluZGV4ICsgMSwgdGhpcy5vcHRpb25zLmxlbmd0aCAtIDEpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtO1xuICB9XG5cbiAgLyoqIFBhc3NlcyByZWxldmFudCBrZXkgcHJlc3NlcyB0byBvdXIga2V5IG1hbmFnZXIuICovXG4gIF9rZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgY29uc3QgbWFuYWdlciA9IHRoaXMuX2tleU1hbmFnZXI7XG4gICAgY29uc3QgcHJldmlvdXNGb2N1c0luZGV4ID0gbWFuYWdlci5hY3RpdmVJdGVtSW5kZXg7XG4gICAgY29uc3QgaGFzTW9kaWZpZXIgPSBoYXNNb2RpZmllcktleShldmVudCk7XG5cbiAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgIGNhc2UgU1BBQ0U6XG4gICAgICBjYXNlIEVOVEVSOlxuICAgICAgICBpZiAoIWhhc01vZGlmaWVyICYmICFtYW5hZ2VyLmlzVHlwaW5nKCkpIHtcbiAgICAgICAgICB0aGlzLl90b2dnbGVGb2N1c2VkT3B0aW9uKCk7XG4gICAgICAgICAgLy8gQWx3YXlzIHByZXZlbnQgc3BhY2UgZnJvbSBzY3JvbGxpbmcgdGhlIHBhZ2Ugc2luY2UgdGhlIGxpc3QgaGFzIGZvY3VzXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSE9NRTpcbiAgICAgIGNhc2UgRU5EOlxuICAgICAgICBpZiAoIWhhc01vZGlmaWVyKSB7XG4gICAgICAgICAga2V5Q29kZSA9PT0gSE9NRSA/IG1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCkgOiBtYW5hZ2VyLnNldExhc3RJdGVtQWN0aXZlKCk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIFRoZSBcIkFcIiBrZXkgZ2V0cyBzcGVjaWFsIHRyZWF0bWVudCwgYmVjYXVzZSBpdCdzIHVzZWQgZm9yIHRoZSBcInNlbGVjdCBhbGxcIiBmdW5jdGlvbmFsaXR5LlxuICAgICAgICBpZiAoa2V5Q29kZSA9PT0gQSAmJiB0aGlzLm11bHRpcGxlICYmIGhhc01vZGlmaWVyS2V5KGV2ZW50LCAnY3RybEtleScpICYmXG4gICAgICAgICAgICAhbWFuYWdlci5pc1R5cGluZygpKSB7XG4gICAgICAgICAgY29uc3Qgc2hvdWxkU2VsZWN0ID0gdGhpcy5vcHRpb25zLnNvbWUob3B0aW9uID0+ICFvcHRpb24uZGlzYWJsZWQgJiYgIW9wdGlvbi5zZWxlY3RlZCk7XG4gICAgICAgICAgdGhpcy5fc2V0QWxsT3B0aW9uc1NlbGVjdGVkKHNob3VsZFNlbGVjdCwgdHJ1ZSk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiAoa2V5Q29kZSA9PT0gVVBfQVJST1cgfHwga2V5Q29kZSA9PT0gRE9XTl9BUlJPVykgJiYgZXZlbnQuc2hpZnRLZXkgJiZcbiAgICAgICAgbWFuYWdlci5hY3RpdmVJdGVtSW5kZXggIT09IHByZXZpb3VzRm9jdXNJbmRleCkge1xuICAgICAgdGhpcy5fdG9nZ2xlRm9jdXNlZE9wdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXBvcnRzIGEgdmFsdWUgY2hhbmdlIHRvIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciAqL1xuICBfcmVwb3J0VmFsdWVDaGFuZ2UoKSB7XG4gICAgLy8gU3RvcCByZXBvcnRpbmcgdmFsdWUgY2hhbmdlcyBhZnRlciB0aGUgbGlzdCBoYXMgYmVlbiBkZXN0cm95ZWQuIFRoaXMgYXZvaWRzXG4gICAgLy8gY2FzZXMgd2hlcmUgdGhlIGxpc3QgbWlnaHQgd3JvbmdseSByZXNldCBpdHMgdmFsdWUgb25jZSBpdCBpcyByZW1vdmVkLCBidXRcbiAgICAvLyB0aGUgZm9ybSBjb250cm9sIGlzIHN0aWxsIGxpdmUuXG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiAhdGhpcy5faXNEZXN0cm95ZWQpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fZ2V0U2VsZWN0ZWRPcHRpb25WYWx1ZXMoKTtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlKTtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVtaXRzIGEgY2hhbmdlIGV2ZW50IGlmIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiBhbiBvcHRpb24gY2hhbmdlZC4gKi9cbiAgX2VtaXRDaGFuZ2VFdmVudChvcHRpb246IE1hdExpc3RPcHRpb24pIHtcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KG5ldyBNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlKHRoaXMsIG9wdGlvbikpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIHNlbGVjdGlvbiBsaXN0IGlzIGZvY3VzZWQsIHdlIHdhbnQgdG8gbW92ZSBmb2N1cyB0byBhbiBvcHRpb24gd2l0aGluIHRoZSBsaXN0LiBEbyB0aGlzXG4gICAqIGJ5IHNldHRpbmcgdGhlIGFwcHJvcHJpYXRlIG9wdGlvbiB0byBiZSBhY3RpdmUuXG4gICAqL1xuICBfb25Gb2N1cygpOiB2b2lkIHtcbiAgICBjb25zdCBhY3RpdmVJbmRleCA9IHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4O1xuXG4gICAgaWYgKCFhY3RpdmVJbmRleCB8fCAoYWN0aXZlSW5kZXggPT09IC0xKSkge1xuICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gYWN0aXZlIGluZGV4LCBzZXQgZm9jdXMgdG8gdGhlIGZpcnN0IG9wdGlvbi5cbiAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgc2V0IGZvY3VzIHRvIHRoZSBhY3RpdmUgb3B0aW9uLlxuICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKGFjdGl2ZUluZGV4KTtcbiAgICB9XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci4gKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZXM7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XG4gICAgICB0aGlzLl9zZXRPcHRpb25zRnJvbVZhbHVlcyh2YWx1ZXMgfHwgW10pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgLyoqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLiAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHNlbGVjdGVkIG9wdGlvbnMgYmFzZWQgb24gdGhlIHNwZWNpZmllZCB2YWx1ZXMuICovXG4gIHByaXZhdGUgX3NldE9wdGlvbnNGcm9tVmFsdWVzKHZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4gb3B0aW9uLl9zZXRTZWxlY3RlZChmYWxzZSkpO1xuXG4gICAgdmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgY29uc3QgY29ycmVzcG9uZGluZ09wdGlvbiA9IHRoaXMub3B0aW9ucy5maW5kKG9wdGlvbiA9PiB7XG4gICAgICAgIC8vIFNraXAgb3B0aW9ucyB0aGF0IGFyZSBhbHJlYWR5IGluIHRoZSBtb2RlbC4gVGhpcyBhbGxvd3MgdXMgdG8gaGFuZGxlIGNhc2VzXG4gICAgICAgIC8vIHdoZXJlIHRoZSBzYW1lIHByaW1pdGl2ZSB2YWx1ZSBpcyBzZWxlY3RlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICAgICAgcmV0dXJuIG9wdGlvbi5zZWxlY3RlZCA/IGZhbHNlIDogdGhpcy5jb21wYXJlV2l0aChvcHRpb24udmFsdWUsIHZhbHVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoY29ycmVzcG9uZGluZ09wdGlvbikge1xuICAgICAgICBjb3JyZXNwb25kaW5nT3B0aW9uLl9zZXRTZWxlY3RlZCh0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSB2YWx1ZXMgb2YgdGhlIHNlbGVjdGVkIG9wdGlvbnMuICovXG4gIHByaXZhdGUgX2dldFNlbGVjdGVkT3B0aW9uVmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZpbHRlcihvcHRpb24gPT4gb3B0aW9uLnNlbGVjdGVkKS5tYXAob3B0aW9uID0+IG9wdGlvbi52YWx1ZSk7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgc3RhdGUgb2YgdGhlIGN1cnJlbnRseSBmb2N1c2VkIG9wdGlvbiBpZiBlbmFibGVkLiAqL1xuICBwcml2YXRlIF90b2dnbGVGb2N1c2VkT3B0aW9uKCk6IHZvaWQge1xuICAgIGxldCBmb2N1c2VkSW5kZXggPSB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleDtcblxuICAgIGlmIChmb2N1c2VkSW5kZXggIT0gbnVsbCAmJiB0aGlzLl9pc1ZhbGlkSW5kZXgoZm9jdXNlZEluZGV4KSkge1xuICAgICAgbGV0IGZvY3VzZWRPcHRpb246IE1hdExpc3RPcHRpb24gPSB0aGlzLm9wdGlvbnMudG9BcnJheSgpW2ZvY3VzZWRJbmRleF07XG5cbiAgICAgIGlmIChmb2N1c2VkT3B0aW9uICYmICFmb2N1c2VkT3B0aW9uLmRpc2FibGVkICYmICh0aGlzLl9tdWx0aXBsZSB8fCAhZm9jdXNlZE9wdGlvbi5zZWxlY3RlZCkpIHtcbiAgICAgICAgZm9jdXNlZE9wdGlvbi50b2dnbGUoKTtcblxuICAgICAgICAvLyBFbWl0IGEgY2hhbmdlIGV2ZW50IGJlY2F1c2UgdGhlIGZvY3VzZWQgb3B0aW9uIGNoYW5nZWQgaXRzIHN0YXRlIHRocm91Z2ggdXNlclxuICAgICAgICAvLyBpbnRlcmFjdGlvbi5cbiAgICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KGZvY3VzZWRPcHRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzZWxlY3RlZCBzdGF0ZSBvbiBhbGwgb2YgdGhlIG9wdGlvbnNcbiAgICogYW5kIGVtaXRzIGFuIGV2ZW50IGlmIGFueXRoaW5nIGNoYW5nZWQuXG4gICAqL1xuICBwcml2YXRlIF9zZXRBbGxPcHRpb25zU2VsZWN0ZWQoaXNTZWxlY3RlZDogYm9vbGVhbiwgc2tpcERpc2FibGVkPzogYm9vbGVhbikge1xuICAgIC8vIEtlZXAgdHJhY2sgb2Ygd2hldGhlciBhbnl0aGluZyBjaGFuZ2VkLCBiZWNhdXNlIHdlIG9ubHkgd2FudCB0b1xuICAgIC8vIGVtaXQgdGhlIGNoYW5nZWQgZXZlbnQgd2hlbiBzb21ldGhpbmcgYWN0dWFsbHkgY2hhbmdlZC5cbiAgICBsZXQgaGFzQ2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5vcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgIGlmICgoIXNraXBEaXNhYmxlZCB8fCAhb3B0aW9uLmRpc2FibGVkKSAmJiBvcHRpb24uX3NldFNlbGVjdGVkKGlzU2VsZWN0ZWQpKSB7XG4gICAgICAgIGhhc0NoYW5nZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGhhc0NoYW5nZWQpIHtcbiAgICAgIHRoaXMuX3JlcG9ydFZhbHVlQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFV0aWxpdHkgdG8gZW5zdXJlIGFsbCBpbmRleGVzIGFyZSB2YWxpZC5cbiAgICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCB0byBiZSBjaGVja2VkLlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBpbmRleCBpcyB2YWxpZCBmb3Igb3VyIGxpc3Qgb2Ygb3B0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgX2lzVmFsaWRJbmRleChpbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLm9wdGlvbnMubGVuZ3RoO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBzcGVjaWZpZWQgbGlzdCBvcHRpb24uICovXG4gIHByaXZhdGUgX2dldE9wdGlvbkluZGV4KG9wdGlvbjogTWF0TGlzdE9wdGlvbik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy50b0FycmF5KCkuaW5kZXhPZihvcHRpb24pO1xuICB9XG5cbiAgLyoqIE1hcmtzIGFsbCB0aGUgb3B0aW9ucyB0byBiZSBjaGVja2VkIGluIHRoZSBuZXh0IGNoYW5nZSBkZXRlY3Rpb24gcnVuLiAqL1xuICBwcml2YXRlIF9tYXJrT3B0aW9uc0ZvckNoZWNrKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiBvcHRpb24uX21hcmtGb3JDaGVjaygpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgdGFiaW5kZXggZnJvbSB0aGUgc2VsZWN0aW9uIGxpc3QgYW5kIHJlc2V0cyBpdCBiYWNrIGFmdGVyd2FyZHMsIGFsbG93aW5nIHRoZSB1c2VyXG4gICAqIHRvIHRhYiBvdXQgb2YgaXQuIFRoaXMgcHJldmVudHMgdGhlIGxpc3QgZnJvbSBjYXB0dXJpbmcgZm9jdXMgYW5kIHJlZGlyZWN0aW5nIGl0IGJhY2sgd2l0aGluXG4gICAqIHRoZSBsaXN0LCBjcmVhdGluZyBhIGZvY3VzIHRyYXAgaWYgaXQgdXNlciB0cmllcyB0byB0YWIgYXdheS5cbiAgICovXG4gIHByaXZhdGUgX2FsbG93Rm9jdXNFc2NhcGUoKSB7XG4gICAgdGhpcy5fdGFiSW5kZXggPSAtMTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fdGFiSW5kZXggPSAwO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgdGFiaW5kZXggYmFzZWQgdXBvbiBpZiB0aGUgc2VsZWN0aW9uIGxpc3QgaXMgZW1wdHkuICovXG4gIHByaXZhdGUgX3VwZGF0ZVRhYkluZGV4KCk6IHZvaWQge1xuICAgIHRoaXMuX3RhYkluZGV4ID0gKHRoaXMub3B0aW9ucy5sZW5ndGggPT09IDApID8gLTEgOiAwO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlUmlwcGxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9tdWx0aXBsZTogQm9vbGVhbklucHV0O1xufVxuIl19