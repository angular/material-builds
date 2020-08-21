/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusKeyManager, FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { A, DOWN_ARROW, ENTER, hasModifierKey, SPACE, UP_ARROW, } from '@angular/cdk/keycodes';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, Input, Output, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatLine, mixinDisableRipple, setLines, } from '@angular/material/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { MatListAvatarCssMatStyler, MatListIconCssMatStyler } from './list';
class MatSelectionListBase {
}
const _MatSelectionListMixinBase = mixinDisableRipple(MatSelectionListBase);
class MatListOptionBase {
}
const _MatListOptionMixinBase = mixinDisableRipple(MatListOptionBase);
/** @docs-private */
export const MAT_SELECTION_LIST_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatSelectionList),
    multi: true
};
/** Change event that is being fired whenever the selected state of an option changes. */
export class MatSelectionListChange {
    constructor(
    /** Reference to the selection list that emitted the event. */
    source, 
    /** Reference to the option that has been changed. */
    option) {
        this.source = source;
        this.option = option;
    }
}
/**
 * Component for list-options of selection-list. Each list-option can automatically
 * generate a checkbox and can put current item into the selectionModel of selection-list
 * if the current item is selected.
 */
export class MatListOption extends _MatListOptionMixinBase {
    constructor(_element, _changeDetector, 
    /** @docs-private */
    selectionList) {
        super();
        this._element = _element;
        this._changeDetector = _changeDetector;
        this.selectionList = selectionList;
        this._selected = false;
        this._disabled = false;
        this._hasFocus = false;
        /** Whether the label should appear before or after the checkbox. Defaults to 'after' */
        this.checkboxPosition = 'after';
        /**
         * This is set to true after the first OnChanges cycle so we don't clear the value of `selected`
         * in the first cycle.
         */
        this._inputsInitialized = false;
    }
    /** Theme color of the list option. This sets the color of the checkbox. */
    get color() { return this._color || this.selectionList.color; }
    set color(newValue) { this._color = newValue; }
    /** Value of the option */
    get value() { return this._value; }
    set value(newValue) {
        if (this.selected &&
            !this.selectionList.compareWith(newValue, this.value) &&
            this._inputsInitialized) {
            this.selected = false;
        }
        this._value = newValue;
    }
    /** Whether the option is disabled. */
    get disabled() { return this._disabled || (this.selectionList && this.selectionList.disabled); }
    set disabled(value) {
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._disabled) {
            this._disabled = newValue;
            this._changeDetector.markForCheck();
        }
    }
    /** Whether the option is selected. */
    get selected() { return this.selectionList.selectedOptions.isSelected(this); }
    set selected(value) {
        const isSelected = coerceBooleanProperty(value);
        if (isSelected !== this._selected) {
            this._setSelected(isSelected);
            this.selectionList._reportValueChange();
        }
    }
    ngOnInit() {
        const list = this.selectionList;
        if (list._value && list._value.some(value => list.compareWith(value, this._value))) {
            this._setSelected(true);
        }
        const wasSelected = this._selected;
        // List options that are selected at initialization can't be reported properly to the form
        // control. This is because it takes some time until the selection-list knows about all
        // available options. Also it can happen that the ControlValueAccessor has an initial value
        // that should be used instead. Deferring the value change report to the next tick ensures
        // that the form control value is not being overwritten.
        Promise.resolve().then(() => {
            if (this._selected || wasSelected) {
                this.selected = true;
                this._changeDetector.markForCheck();
            }
        });
        this._inputsInitialized = true;
    }
    ngAfterContentInit() {
        setLines(this._lines, this._element);
    }
    ngOnDestroy() {
        if (this.selected) {
            // We have to delay this until the next tick in order
            // to avoid changed after checked errors.
            Promise.resolve().then(() => {
                this.selected = false;
            });
        }
        const hadFocus = this._hasFocus;
        const newActiveItem = this.selectionList._removeOptionFromList(this);
        // Only move focus if this option was focused at the time it was destroyed.
        if (hadFocus && newActiveItem) {
            newActiveItem.focus();
        }
    }
    /** Toggles the selection state of the option. */
    toggle() {
        this.selected = !this.selected;
    }
    /** Allows for programmatic focusing of the option. */
    focus() {
        this._element.nativeElement.focus();
    }
    /**
     * Returns the list item's text label. Implemented as a part of the FocusKeyManager.
     * @docs-private
     */
    getLabel() {
        return this._text ? (this._text.nativeElement.textContent || '') : '';
    }
    /** Whether this list item should show a ripple effect when clicked. */
    _isRippleDisabled() {
        return this.disabled || this.disableRipple || this.selectionList.disableRipple;
    }
    _handleClick() {
        if (!this.disabled && (this.selectionList.multiple || !this.selected)) {
            this.toggle();
            // Emit a change event if the selected state of the option changed through user interaction.
            this.selectionList._emitChangeEvent(this);
        }
    }
    _handleFocus() {
        this.selectionList._setFocusedOption(this);
        this._hasFocus = true;
    }
    _handleBlur() {
        this.selectionList._onTouched();
        this._hasFocus = false;
    }
    /** Retrieves the DOM element of the component host. */
    _getHostElement() {
        return this._element.nativeElement;
    }
    /** Sets the selected state of the option. Returns whether the value has changed. */
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
            },] }
];
MatListOption.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: MatSelectionList, decorators: [{ type: Inject, args: [forwardRef(() => MatSelectionList),] }] }
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
/**
 * Material Design list component where each item is a selectable option. Behaves as a listbox.
 */
export class MatSelectionList extends _MatSelectionListMixinBase {
    constructor(_element, 
    // @breaking-change 11.0.0 Remove `tabIndex` parameter.
    tabIndex, _changeDetector, 
    // @breaking-change 11.0.0 `_focusMonitor` parameter to become required.
    _focusMonitor) {
        super();
        this._element = _element;
        this._changeDetector = _changeDetector;
        this._focusMonitor = _focusMonitor;
        this._multiple = true;
        this._contentInitialized = false;
        /** Emits a change event whenever the selected state of an option changes. */
        this.selectionChange = new EventEmitter();
        /**
         * Tabindex of the selection list.
         * @breaking-change 11.0.0 Remove `tabIndex` input.
         */
        this.tabIndex = 0;
        /** Theme color of the selection list. This sets the checkbox color for all list options. */
        this.color = 'accent';
        /**
         * Function used for comparing an option against the selected value when determining which
         * options should appear as selected. The first argument is the value of an options. The second
         * one is a value from the selected value. A boolean must be returned.
         */
        this.compareWith = (a1, a2) => a1 === a2;
        this._disabled = false;
        /** The currently selected options. */
        this.selectedOptions = new SelectionModel(this._multiple);
        /** The tabindex of the selection list. */
        this._tabIndex = -1;
        /** View to model callback that should be called whenever the selected options change. */
        this._onChange = (_) => { };
        /** Emits when the list has been destroyed. */
        this._destroyed = new Subject();
        /** View to model callback that should be called if the list or its options lost focus. */
        this._onTouched = () => { };
    }
    /** Whether the selection list is disabled. */
    get disabled() { return this._disabled; }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        // The `MatSelectionList` and `MatListOption` are using the `OnPush` change detection
        // strategy. Therefore the options will not check for any changes if the `MatSelectionList`
        // changed its state. Since we know that a change to `disabled` property of the list affects
        // the state of the options, we manually mark each option for check.
        this._markOptionsForCheck();
    }
    /** Whether selection is limited to one or multiple items (default multiple). */
    get multiple() { return this._multiple; }
    set multiple(value) {
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._multiple) {
            if (this._contentInitialized && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw new Error('Cannot change `multiple` mode of mat-selection-list after initialization.');
            }
            this._multiple = newValue;
            this.selectedOptions = new SelectionModel(this._multiple, this.selectedOptions.selected);
        }
    }
    ngAfterContentInit() {
        var _a;
        this._contentInitialized = true;
        this._keyManager = new FocusKeyManager(this.options)
            .withWrap()
            .withTypeAhead()
            .withHomeAndEnd()
            // Allow disabled items to be focusable. For accessibility reasons, there must be a way for
            // screenreader users, that allows reading the different options of the list.
            .skipPredicate(() => false)
            .withAllowedModifierKeys(['shiftKey']);
        if (this._value) {
            this._setOptionsFromValues(this._value);
        }
        // If the user attempts to tab out of the selection list, allow focus to escape.
        this._keyManager.tabOut.pipe(takeUntil(this._destroyed)).subscribe(() => {
            this._allowFocusEscape();
        });
        // When the number of options change, update the tabindex of the selection list.
        this.options.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
            this._updateTabIndex();
        });
        // Sync external changes to the model back to the options.
        this.selectedOptions.changed.pipe(takeUntil(this._destroyed)).subscribe(event => {
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
        });
        // @breaking-change 11.0.0 Remove null assertion once _focusMonitor is required.
        (_a = this._focusMonitor) === null || _a === void 0 ? void 0 : _a.monitor(this._element).pipe(takeUntil(this._destroyed)).subscribe(origin => {
            if (origin === 'keyboard' || origin === 'program') {
                const activeIndex = this._keyManager.activeItemIndex;
                if (!activeIndex || activeIndex === -1) {
                    // If there is no active index, set focus to the first option.
                    this._keyManager.setFirstItemActive();
                }
                else {
                    // Otherwise, set focus to the active option.
                    this._keyManager.setActiveItem(activeIndex);
                }
            }
        });
    }
    ngOnChanges(changes) {
        const disableRippleChanges = changes['disableRipple'];
        const colorChanges = changes['color'];
        if ((disableRippleChanges && !disableRippleChanges.firstChange) ||
            (colorChanges && !colorChanges.firstChange)) {
            this._markOptionsForCheck();
        }
    }
    ngOnDestroy() {
        var _a;
        // @breaking-change 11.0.0 Remove null assertion once _focusMonitor is required.
        (_a = this._focusMonitor) === null || _a === void 0 ? void 0 : _a.stopMonitoring(this._element);
        this._destroyed.next();
        this._destroyed.complete();
        this._isDestroyed = true;
    }
    /** Focuses the selection list. */
    focus(options) {
        this._element.nativeElement.focus(options);
    }
    /** Selects all of the options. */
    selectAll() {
        this._setAllOptionsSelected(true);
    }
    /** Deselects all of the options. */
    deselectAll() {
        this._setAllOptionsSelected(false);
    }
    /** Sets the focused option of the selection-list. */
    _setFocusedOption(option) {
        this._keyManager.updateActiveItem(option);
    }
    /**
     * Removes an option from the selection list and updates the active item.
     * @returns Currently-active item.
     */
    _removeOptionFromList(option) {
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
    /** Passes relevant key presses to our key manager. */
    _keydown(event) {
        const keyCode = event.keyCode;
        const manager = this._keyManager;
        const previousFocusIndex = manager.activeItemIndex;
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
            default:
                // The "A" key gets special treatment, because it's used for the "select all" functionality.
                if (keyCode === A && this.multiple && hasModifierKey(event, 'ctrlKey') &&
                    !manager.isTyping()) {
                    const shouldSelect = this.options.some(option => !option.disabled && !option.selected);
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
    /** Reports a value change to the ControlValueAccessor */
    _reportValueChange() {
        // Stop reporting value changes after the list has been destroyed. This avoids
        // cases where the list might wrongly reset its value once it is removed, but
        // the form control is still live.
        if (this.options && !this._isDestroyed) {
            const value = this._getSelectedOptionValues();
            this._onChange(value);
            this._value = value;
        }
    }
    /** Emits a change event if the selected state of an option changed. */
    _emitChangeEvent(option) {
        this.selectionChange.emit(new MatSelectionListChange(this, option));
    }
    /** Implemented as part of ControlValueAccessor. */
    writeValue(values) {
        this._value = values;
        if (this.options) {
            this._setOptionsFromValues(values || []);
        }
    }
    /** Implemented as a part of ControlValueAccessor. */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /** Implemented as part of ControlValueAccessor. */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /** Implemented as part of ControlValueAccessor. */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /** Sets the selected options based on the specified values. */
    _setOptionsFromValues(values) {
        this.options.forEach(option => option._setSelected(false));
        values.forEach(value => {
            const correspondingOption = this.options.find(option => {
                // Skip options that are already in the model. This allows us to handle cases
                // where the same primitive value is selected multiple times.
                return option.selected ? false : this.compareWith(option.value, value);
            });
            if (correspondingOption) {
                correspondingOption._setSelected(true);
            }
        });
    }
    /** Returns the values of the selected options. */
    _getSelectedOptionValues() {
        return this.options.filter(option => option.selected).map(option => option.value);
    }
    /** Toggles the state of the currently focused option if enabled. */
    _toggleFocusedOption() {
        let focusedIndex = this._keyManager.activeItemIndex;
        if (focusedIndex != null && this._isValidIndex(focusedIndex)) {
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
     */
    _setAllOptionsSelected(isSelected, skipDisabled) {
        // Keep track of whether anything changed, because we only want to
        // emit the changed event when something actually changed.
        let hasChanged = false;
        this.options.forEach(option => {
            if ((!skipDisabled || !option.disabled) && option._setSelected(isSelected)) {
                hasChanged = true;
            }
        });
        if (hasChanged) {
            this._reportValueChange();
        }
    }
    /**
     * Utility to ensure all indexes are valid.
     * @param index The index to be checked.
     * @returns True if the index is valid for our list of options.
     */
    _isValidIndex(index) {
        return index >= 0 && index < this.options.length;
    }
    /** Returns the index of the specified list option. */
    _getOptionIndex(option) {
        return this.options.toArray().indexOf(option);
    }
    /** Marks all the options to be checked in the next change detection run. */
    _markOptionsForCheck() {
        if (this.options) {
            this.options.forEach(option => option._markForCheck());
        }
    }
    /**
     * Removes the tabindex from the selection list and resets it back afterwards, allowing the user
     * to tab out of it. This prevents the list from capturing focus and redirecting it back within
     * the list, creating a focus trap if it user tries to tab away.
     */
    _allowFocusEscape() {
        this._tabIndex = -1;
        setTimeout(() => {
            this._tabIndex = 0;
            this._changeDetector.markForCheck();
        });
    }
    /** Updates the tabindex based upon if the selection list is empty. */
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
                    '(keydown)': '_keydown($event)',
                    '[attr.aria-multiselectable]': 'multiple',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.tabindex]': '_tabIndex',
                },
                template: '<ng-content></ng-content>',
                encapsulation: ViewEncapsulation.None,
                providers: [MAT_SELECTION_LIST_VALUE_ACCESSOR],
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-subheader{display:flex;box-sizing:border-box;padding:16px;align-items:center}.mat-list-base .mat-subheader{margin:0}.mat-list-base{padding-top:8px;display:block;-webkit-tap-highlight-color:transparent}.mat-list-base .mat-subheader{height:48px;line-height:16px}.mat-list-base .mat-subheader:first-child{margin-top:-8px}.mat-list-base .mat-list-item,.mat-list-base .mat-list-option{display:block;height:48px;-webkit-tap-highlight-color:transparent;width:100%;padding:0}.mat-list-base .mat-list-item .mat-list-item-content,.mat-list-base .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base .mat-list-item .mat-list-item-content-reverse,.mat-list-base .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base .mat-list-item .mat-list-item-ripple,.mat-list-base .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar,.mat-list-base .mat-list-option.mat-list-item-with-avatar{height:56px}.mat-list-base .mat-list-item.mat-2-line,.mat-list-base .mat-list-option.mat-2-line{height:72px}.mat-list-base .mat-list-item.mat-3-line,.mat-list-base .mat-list-option.mat-3-line{height:88px}.mat-list-base .mat-list-item.mat-multi-line,.mat-list-base .mat-list-option.mat-multi-line{height:auto}.mat-list-base .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base .mat-list-item .mat-list-text,.mat-list-base .mat-list-option .mat-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base .mat-list-item .mat-list-text>*,.mat-list-base .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base .mat-list-item .mat-list-text:empty,.mat-list-base .mat-list-option .mat-list-text:empty{display:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base .mat-list-item .mat-list-avatar,.mat-list-base .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%;object-fit:cover}.mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:72px;width:calc(100% - 72px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:72px}.mat-list-base .mat-list-item .mat-list-icon,.mat-list-base .mat-list-option .mat-list-icon{flex-shrink:0;width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:64px;width:calc(100% - 64px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:64px}.mat-list-base .mat-list-item .mat-divider,.mat-list-base .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base .mat-list-item .mat-divider,[dir=rtl] .mat-list-base .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-list-base[dense]{padding-top:4px;display:block}.mat-list-base[dense] .mat-subheader{height:40px;line-height:8px}.mat-list-base[dense] .mat-subheader:first-child{margin-top:-4px}.mat-list-base[dense] .mat-list-item,.mat-list-base[dense] .mat-list-option{display:block;height:40px;-webkit-tap-highlight-color:transparent;width:100%;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-item-content,.mat-list-base[dense] .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base[dense] .mat-list-item .mat-list-item-content-reverse,.mat-list-base[dense] .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base[dense] .mat-list-item .mat-list-item-ripple,.mat-list-base[dense] .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar{height:48px}.mat-list-base[dense] .mat-list-item.mat-2-line,.mat-list-base[dense] .mat-list-option.mat-2-line{height:60px}.mat-list-base[dense] .mat-list-item.mat-3-line,.mat-list-base[dense] .mat-list-option.mat-3-line{height:76px}.mat-list-base[dense] .mat-list-item.mat-multi-line,.mat-list-base[dense] .mat-list-option.mat-multi-line{height:auto}.mat-list-base[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base[dense] .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base[dense] .mat-list-item .mat-list-text,.mat-list-base[dense] .mat-list-option .mat-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-text>*,.mat-list-base[dense] .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base[dense] .mat-list-item .mat-list-text:empty,.mat-list-base[dense] .mat-list-option .mat-list-text:empty{display:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base[dense] .mat-list-item .mat-list-avatar,.mat-list-base[dense] .mat-list-option .mat-list-avatar{flex-shrink:0;width:36px;height:36px;border-radius:50%;object-fit:cover}.mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:68px;width:calc(100% - 68px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:68px}.mat-list-base[dense] .mat-list-item .mat-list-icon,.mat-list-base[dense] .mat-list-option .mat-list-icon{flex-shrink:0;width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:60px;width:calc(100% - 60px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:60px}.mat-list-base[dense] .mat-list-item .mat-divider,.mat-list-base[dense] .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-divider,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base[dense] .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-nav-list a{text-decoration:none;color:inherit}.mat-nav-list .mat-list-item{cursor:pointer;outline:none}mat-action-list button{background:none;color:inherit;border:none;font:inherit;outline:inherit;-webkit-tap-highlight-color:transparent;text-align:left}[dir=rtl] mat-action-list button{text-align:right}mat-action-list button::-moz-focus-inner{border:0}mat-action-list .mat-list-item{cursor:pointer;outline:inherit}.mat-list-option:not(.mat-list-item-disabled){cursor:pointer;outline:none}.mat-list-item-disabled{pointer-events:none}.cdk-high-contrast-active .mat-list-item-disabled{opacity:.5}.cdk-high-contrast-active :host .mat-list-item-disabled{opacity:.5}.cdk-high-contrast-active .mat-selection-list:focus{outline-style:dotted}.cdk-high-contrast-active .mat-list-option:hover,.cdk-high-contrast-active .mat-list-option:focus,.cdk-high-contrast-active .mat-nav-list .mat-list-item:hover,.cdk-high-contrast-active .mat-nav-list .mat-list-item:focus,.cdk-high-contrast-active mat-action-list .mat-list-item:hover,.cdk-high-contrast-active mat-action-list .mat-list-item:focus{outline:dotted 1px}.cdk-high-contrast-active .mat-list-single-selected-option::after{content:\"\";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}.cdk-high-contrast-active [dir=rtl] .mat-list-single-selected-option::after{right:auto;left:16px}@media(hover: none){.mat-list-option:not(.mat-list-single-selected-option):not(.mat-list-item-disabled):hover,.mat-nav-list .mat-list-item:not(.mat-list-item-disabled):hover,.mat-action-list .mat-list-item:not(.mat-list-item-disabled):hover{background:none}}\n"]
            },] }
];
MatSelectionList.ctorParameters = () => [
    { type: ElementRef },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
    { type: ChangeDetectorRef },
    { type: FocusMonitor }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLWxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC9zZWxlY3Rpb24tbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWtCLGVBQWUsRUFBRSxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRixPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUNMLENBQUMsRUFDRCxVQUFVLEVBQ1YsS0FBSyxFQUNMLGNBQWMsRUFDZCxLQUFLLEVBQ0wsUUFBUSxHQUNULE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUVMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBSUwsTUFBTSxFQUNOLFNBQVMsRUFFVCxTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBR0wsT0FBTyxFQUNQLGtCQUFrQixFQUNsQixRQUFRLEdBRVQsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEQsT0FBTyxFQUFDLHlCQUF5QixFQUFFLHVCQUF1QixFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRTFFLE1BQU0sb0JBQW9CO0NBQUc7QUFDN0IsTUFBTSwwQkFBMEIsR0FDNUIsa0JBQWtC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Ii8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzYWJsZU9wdGlvbiwgRm9jdXNLZXlNYW5hZ2VyLCBGb2N1c01vbml0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1NlbGVjdGlvbk1vZGVsfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQSxcbiAgRE9XTl9BUlJPVyxcbiAgRU5URVIsXG4gIGhhc01vZGlmaWVyS2V5LFxuICBTUEFDRSxcbiAgVVBfQVJST1csXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZUN0b3IsXG4gIE1hdExpbmUsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgc2V0TGluZXMsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyLCBNYXRMaXN0SWNvbkNzc01hdFN0eWxlcn0gZnJvbSAnLi9saXN0JztcblxuY2xhc3MgTWF0U2VsZWN0aW9uTGlzdEJhc2Uge31cbmNvbnN0IF9NYXRTZWxlY3Rpb25MaXN0TWl4aW5CYXNlOiBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmIHR5cGVvZiBNYXRTZWxlY3Rpb25MaXN0QmFzZSA9XG4gICAgbWl4aW5EaXNhYmxlUmlwcGxlKE1hdFNlbGVjdGlvbkxpc3RCYXNlKTtcblxuY2xhc3MgTWF0TGlzdE9wdGlvbkJhc2Uge31cbmNvbnN0IF9NYXRMaXN0T3B0aW9uTWl4aW5CYXNlOiBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmIHR5cGVvZiBNYXRMaXN0T3B0aW9uQmFzZSA9XG4gICAgbWl4aW5EaXNhYmxlUmlwcGxlKE1hdExpc3RPcHRpb25CYXNlKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfU0VMRUNUSU9OX0xJU1RfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdFNlbGVjdGlvbkxpc3QpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqIENoYW5nZSBldmVudCB0aGF0IGlzIGJlaW5nIGZpcmVkIHdoZW5ldmVyIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiBhbiBvcHRpb24gY2hhbmdlcy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgc2VsZWN0aW9uIGxpc3QgdGhhdCBlbWl0dGVkIHRoZSBldmVudC4gKi9cbiAgICBwdWJsaWMgc291cmNlOiBNYXRTZWxlY3Rpb25MaXN0LFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIG9wdGlvbiB0aGF0IGhhcyBiZWVuIGNoYW5nZWQuICovXG4gICAgcHVibGljIG9wdGlvbjogTWF0TGlzdE9wdGlvbikge31cbn1cblxuLyoqXG4gKiBDb21wb25lbnQgZm9yIGxpc3Qtb3B0aW9ucyBvZiBzZWxlY3Rpb24tbGlzdC4gRWFjaCBsaXN0LW9wdGlvbiBjYW4gYXV0b21hdGljYWxseVxuICogZ2VuZXJhdGUgYSBjaGVja2JveCBhbmQgY2FuIHB1dCBjdXJyZW50IGl0ZW0gaW50byB0aGUgc2VsZWN0aW9uTW9kZWwgb2Ygc2VsZWN0aW9uLWxpc3RcbiAqIGlmIHRoZSBjdXJyZW50IGl0ZW0gaXMgc2VsZWN0ZWQuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1saXN0LW9wdGlvbicsXG4gIGV4cG9ydEFzOiAnbWF0TGlzdE9wdGlvbicsXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJ10sXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdvcHRpb24nLFxuICAgICdjbGFzcyc6ICdtYXQtbGlzdC1pdGVtIG1hdC1saXN0LW9wdGlvbiBtYXQtZm9jdXMtaW5kaWNhdG9yJyxcbiAgICAnKGZvY3VzKSc6ICdfaGFuZGxlRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfaGFuZGxlQmx1cigpJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soKScsXG4gICAgJ1tjbGFzcy5tYXQtbGlzdC1pdGVtLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbGlzdC1pdGVtLXdpdGgtYXZhdGFyXSc6ICdfYXZhdGFyIHx8IF9pY29uJyxcbiAgICAvLyBNYW51YWxseSBzZXQgdGhlIFwicHJpbWFyeVwiIG9yIFwid2FyblwiIGNsYXNzIGlmIHRoZSBjb2xvciBoYXMgYmVlbiBleHBsaWNpdGx5XG4gICAgLy8gc2V0IHRvIFwicHJpbWFyeVwiIG9yIFwid2FyblwiLiBUaGUgcHNldWRvIGNoZWNrYm94IHBpY2tzIHVwIHRoZXNlIGNsYXNzZXMgZm9yXG4gICAgLy8gaXRzIHRoZW1lLlxuICAgICdbY2xhc3MubWF0LXByaW1hcnldJzogJ2NvbG9yID09PSBcInByaW1hcnlcIicsXG4gICAgLy8gRXZlbiB0aG91Z2ggYWNjZW50IGlzIHRoZSBkZWZhdWx0LCB3ZSBuZWVkIHRvIHNldCB0aGlzIGNsYXNzIGFueXdheSwgYmVjYXVzZSB0aGUgIGxpc3QgbWlnaHRcbiAgICAvLyBiZSBwbGFjZWQgaW5zaWRlIGEgcGFyZW50IHRoYXQgaGFzIG9uZSBvZiB0aGUgb3RoZXIgY29sb3JzIHdpdGggYSBoaWdoZXIgc3BlY2lmaWNpdHkuXG4gICAgJ1tjbGFzcy5tYXQtYWNjZW50XSc6ICdjb2xvciAhPT0gXCJwcmltYXJ5XCIgJiYgY29sb3IgIT09IFwid2FyblwiJyxcbiAgICAnW2NsYXNzLm1hdC13YXJuXSc6ICdjb2xvciA9PT0gXCJ3YXJuXCInLFxuICAgICdbY2xhc3MubWF0LWxpc3Qtc2luZ2xlLXNlbGVjdGVkLW9wdGlvbl0nOiAnc2VsZWN0ZWQgJiYgIXNlbGVjdGlvbkxpc3QubXVsdGlwbGUnLFxuICAgICdbYXR0ci5hcmlhLXNlbGVjdGVkXSc6ICdzZWxlY3RlZCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJy0xJyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICdsaXN0LW9wdGlvbi5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdExpc3RPcHRpb24gZXh0ZW5kcyBfTWF0TGlzdE9wdGlvbk1peGluQmFzZSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPbkluaXQsIEZvY3VzYWJsZU9wdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5EaXNhYmxlUmlwcGxlIHtcbiAgcHJpdmF0ZSBfc2VsZWN0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfaGFzRm9jdXMgPSBmYWxzZTtcblxuICBAQ29udGVudENoaWxkKE1hdExpc3RBdmF0YXJDc3NNYXRTdHlsZXIpIF9hdmF0YXI6IE1hdExpc3RBdmF0YXJDc3NNYXRTdHlsZXI7XG4gIEBDb250ZW50Q2hpbGQoTWF0TGlzdEljb25Dc3NNYXRTdHlsZXIpIF9pY29uOiBNYXRMaXN0SWNvbkNzc01hdFN0eWxlcjtcbiAgQENvbnRlbnRDaGlsZHJlbihNYXRMaW5lLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfbGluZXM6IFF1ZXJ5TGlzdDxNYXRMaW5lPjtcblxuICAvKiogRE9NIGVsZW1lbnQgY29udGFpbmluZyB0aGUgaXRlbSdzIHRleHQuICovXG4gIEBWaWV3Q2hpbGQoJ3RleHQnKSBfdGV4dDogRWxlbWVudFJlZjtcblxuICAvKiogV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGFwcGVhciBiZWZvcmUgb3IgYWZ0ZXIgdGhlIGNoZWNrYm94LiBEZWZhdWx0cyB0byAnYWZ0ZXInICovXG4gIEBJbnB1dCgpIGNoZWNrYm94UG9zaXRpb246ICdiZWZvcmUnIHwgJ2FmdGVyJyA9ICdhZnRlcic7XG5cbiAgLyoqIFRoZW1lIGNvbG9yIG9mIHRoZSBsaXN0IG9wdGlvbi4gVGhpcyBzZXRzIHRoZSBjb2xvciBvZiB0aGUgY2hlY2tib3guICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUgeyByZXR1cm4gdGhpcy5fY29sb3IgfHwgdGhpcy5zZWxlY3Rpb25MaXN0LmNvbG9yOyB9XG4gIHNldCBjb2xvcihuZXdWYWx1ZTogVGhlbWVQYWxldHRlKSB7IHRoaXMuX2NvbG9yID0gbmV3VmFsdWU7IH1cbiAgcHJpdmF0ZSBfY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKipcbiAgICogVGhpcyBpcyBzZXQgdG8gdHJ1ZSBhZnRlciB0aGUgZmlyc3QgT25DaGFuZ2VzIGN5Y2xlIHNvIHdlIGRvbid0IGNsZWFyIHRoZSB2YWx1ZSBvZiBgc2VsZWN0ZWRgXG4gICAqIGluIHRoZSBmaXJzdCBjeWNsZS5cbiAgICovXG4gIHByaXZhdGUgX2lucHV0c0luaXRpYWxpemVkID0gZmFsc2U7XG4gIC8qKiBWYWx1ZSBvZiB0aGUgb3B0aW9uICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnNlbGVjdGVkICYmXG4gICAgICAhdGhpcy5zZWxlY3Rpb25MaXN0LmNvbXBhcmVXaXRoKG5ld1ZhbHVlLCB0aGlzLnZhbHVlKSAmJlxuICAgICAgdGhpcy5faW5wdXRzSW5pdGlhbGl6ZWRcbiAgICApIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICB9XG4gIHByaXZhdGUgX3ZhbHVlOiBhbnk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG9wdGlvbiBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5fZGlzYWJsZWQgfHwgKHRoaXMuc2VsZWN0aW9uTGlzdCAmJiB0aGlzLnNlbGVjdGlvbkxpc3QuZGlzYWJsZWQpOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYW55KSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fZGlzYWJsZWQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBvcHRpb24gaXMgc2VsZWN0ZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc2VsZWN0aW9uTGlzdC5zZWxlY3RlZE9wdGlvbnMuaXNTZWxlY3RlZCh0aGlzKTsgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChpc1NlbGVjdGVkICE9PSB0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2V0U2VsZWN0ZWQoaXNTZWxlY3RlZCk7XG4gICAgICB0aGlzLnNlbGVjdGlvbkxpc3QuX3JlcG9ydFZhbHVlQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgICAgICAgICAgICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE1hdFNlbGVjdGlvbkxpc3QpKSBwdWJsaWMgc2VsZWN0aW9uTGlzdDogTWF0U2VsZWN0aW9uTGlzdCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5zZWxlY3Rpb25MaXN0O1xuXG4gICAgaWYgKGxpc3QuX3ZhbHVlICYmIGxpc3QuX3ZhbHVlLnNvbWUodmFsdWUgPT4gbGlzdC5jb21wYXJlV2l0aCh2YWx1ZSwgdGhpcy5fdmFsdWUpKSkge1xuICAgICAgdGhpcy5fc2V0U2VsZWN0ZWQodHJ1ZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd2FzU2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3RlZDtcblxuICAgIC8vIExpc3Qgb3B0aW9ucyB0aGF0IGFyZSBzZWxlY3RlZCBhdCBpbml0aWFsaXphdGlvbiBjYW4ndCBiZSByZXBvcnRlZCBwcm9wZXJseSB0byB0aGUgZm9ybVxuICAgIC8vIGNvbnRyb2wuIFRoaXMgaXMgYmVjYXVzZSBpdCB0YWtlcyBzb21lIHRpbWUgdW50aWwgdGhlIHNlbGVjdGlvbi1saXN0IGtub3dzIGFib3V0IGFsbFxuICAgIC8vIGF2YWlsYWJsZSBvcHRpb25zLiBBbHNvIGl0IGNhbiBoYXBwZW4gdGhhdCB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaGFzIGFuIGluaXRpYWwgdmFsdWVcbiAgICAvLyB0aGF0IHNob3VsZCBiZSB1c2VkIGluc3RlYWQuIERlZmVycmluZyB0aGUgdmFsdWUgY2hhbmdlIHJlcG9ydCB0byB0aGUgbmV4dCB0aWNrIGVuc3VyZXNcbiAgICAvLyB0aGF0IHRoZSBmb3JtIGNvbnRyb2wgdmFsdWUgaXMgbm90IGJlaW5nIG92ZXJ3cml0dGVuLlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkIHx8IHdhc1NlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl9pbnB1dHNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgc2V0TGluZXModGhpcy5fbGluZXMsIHRoaXMuX2VsZW1lbnQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgIC8vIFdlIGhhdmUgdG8gZGVsYXkgdGhpcyB1bnRpbCB0aGUgbmV4dCB0aWNrIGluIG9yZGVyXG4gICAgICAvLyB0byBhdm9pZCBjaGFuZ2VkIGFmdGVyIGNoZWNrZWQgZXJyb3JzLlxuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGhhZEZvY3VzID0gdGhpcy5faGFzRm9jdXM7XG4gICAgY29uc3QgbmV3QWN0aXZlSXRlbSA9IHRoaXMuc2VsZWN0aW9uTGlzdC5fcmVtb3ZlT3B0aW9uRnJvbUxpc3QodGhpcyk7XG5cbiAgICAvLyBPbmx5IG1vdmUgZm9jdXMgaWYgdGhpcyBvcHRpb24gd2FzIGZvY3VzZWQgYXQgdGhlIHRpbWUgaXQgd2FzIGRlc3Ryb3llZC5cbiAgICBpZiAoaGFkRm9jdXMgJiYgbmV3QWN0aXZlSXRlbSkge1xuICAgICAgbmV3QWN0aXZlSXRlbS5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSBzZWxlY3Rpb24gc3RhdGUgb2YgdGhlIG9wdGlvbi4gKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0ZWQgPSAhdGhpcy5zZWxlY3RlZDtcbiAgfVxuXG4gIC8qKiBBbGxvd3MgZm9yIHByb2dyYW1tYXRpYyBmb2N1c2luZyBvZiB0aGUgb3B0aW9uLiAqL1xuICBmb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBsaXN0IGl0ZW0ncyB0ZXh0IGxhYmVsLiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgdGhlIEZvY3VzS2V5TWFuYWdlci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0TGFiZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RleHQgPyAodGhpcy5fdGV4dC5uYXRpdmVFbGVtZW50LnRleHRDb250ZW50IHx8ICcnKSA6ICcnO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBsaXN0IGl0ZW0gc2hvdWxkIHNob3cgYSByaXBwbGUgZWZmZWN0IHdoZW4gY2xpY2tlZC4gKi9cbiAgX2lzUmlwcGxlRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlUmlwcGxlIHx8IHRoaXMuc2VsZWN0aW9uTGlzdC5kaXNhYmxlUmlwcGxlO1xuICB9XG5cbiAgX2hhbmRsZUNsaWNrKCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiAodGhpcy5zZWxlY3Rpb25MaXN0Lm11bHRpcGxlIHx8ICF0aGlzLnNlbGVjdGVkKSkge1xuICAgICAgdGhpcy50b2dnbGUoKTtcblxuICAgICAgLy8gRW1pdCBhIGNoYW5nZSBldmVudCBpZiB0aGUgc2VsZWN0ZWQgc3RhdGUgb2YgdGhlIG9wdGlvbiBjaGFuZ2VkIHRocm91Z2ggdXNlciBpbnRlcmFjdGlvbi5cbiAgICAgIHRoaXMuc2VsZWN0aW9uTGlzdC5fZW1pdENoYW5nZUV2ZW50KHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVGb2N1cygpIHtcbiAgICB0aGlzLnNlbGVjdGlvbkxpc3QuX3NldEZvY3VzZWRPcHRpb24odGhpcyk7XG4gICAgdGhpcy5faGFzRm9jdXMgPSB0cnVlO1xuICB9XG5cbiAgX2hhbmRsZUJsdXIoKSB7XG4gICAgdGhpcy5zZWxlY3Rpb25MaXN0Ll9vblRvdWNoZWQoKTtcbiAgICB0aGlzLl9oYXNGb2N1cyA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIFJldHJpZXZlcyB0aGUgRE9NIGVsZW1lbnQgb2YgdGhlIGNvbXBvbmVudCBob3N0LiAqL1xuICBfZ2V0SG9zdEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgc2VsZWN0ZWQgc3RhdGUgb2YgdGhlIG9wdGlvbi4gUmV0dXJucyB3aGV0aGVyIHRoZSB2YWx1ZSBoYXMgY2hhbmdlZC4gKi9cbiAgX3NldFNlbGVjdGVkKHNlbGVjdGVkOiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgaWYgKHNlbGVjdGVkID09PSB0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuX3NlbGVjdGVkID0gc2VsZWN0ZWQ7XG5cbiAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uTGlzdC5zZWxlY3RlZE9wdGlvbnMuc2VsZWN0KHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkxpc3Quc2VsZWN0ZWRPcHRpb25zLmRlc2VsZWN0KHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vdGlmaWVzIEFuZ3VsYXIgdGhhdCB0aGUgb3B0aW9uIG5lZWRzIHRvIGJlIGNoZWNrZWQgaW4gdGhlIG5leHQgY2hhbmdlIGRldGVjdGlvbiBydW4uIE1haW5seVxuICAgKiB1c2VkIHRvIHRyaWdnZXIgYW4gdXBkYXRlIG9mIHRoZSBsaXN0IG9wdGlvbiBpZiB0aGUgZGlzYWJsZWQgc3RhdGUgb2YgdGhlIHNlbGVjdGlvbiBsaXN0XG4gICAqIGNoYW5nZWQuXG4gICAqL1xuICBfbWFya0ZvckNoZWNrKCkge1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zZWxlY3RlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xufVxuXG5cbi8qKlxuICogTWF0ZXJpYWwgRGVzaWduIGxpc3QgY29tcG9uZW50IHdoZXJlIGVhY2ggaXRlbSBpcyBhIHNlbGVjdGFibGUgb3B0aW9uLiBCZWhhdmVzIGFzIGEgbGlzdGJveC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNlbGVjdGlvbi1saXN0JyxcbiAgZXhwb3J0QXM6ICdtYXRTZWxlY3Rpb25MaXN0JyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVSaXBwbGUnXSxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ2xpc3Rib3gnLFxuICAgICdjbGFzcyc6ICdtYXQtc2VsZWN0aW9uLWxpc3QgbWF0LWxpc3QtYmFzZScsXG4gICAgJyhrZXlkb3duKSc6ICdfa2V5ZG93bigkZXZlbnQpJyxcbiAgICAnW2F0dHIuYXJpYS1tdWx0aXNlbGVjdGFibGVdJzogJ211bHRpcGxlJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdfdGFiSW5kZXgnLFxuICB9LFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBzdHlsZVVybHM6IFsnbGlzdC5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbTUFUX1NFTEVDVElPTl9MSVNUX1ZBTFVFX0FDQ0VTU09SXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0aW9uTGlzdCBleHRlbmRzIF9NYXRTZWxlY3Rpb25MaXN0TWl4aW5CYXNlIGltcGxlbWVudHMgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgQWZ0ZXJDb250ZW50SW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgcHJpdmF0ZSBfbXVsdGlwbGUgPSB0cnVlO1xuICBwcml2YXRlIF9jb250ZW50SW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAvKiogVGhlIEZvY3VzS2V5TWFuYWdlciB3aGljaCBoYW5kbGVzIGZvY3VzLiAqL1xuICBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdExpc3RPcHRpb24+O1xuXG4gIC8qKiBUaGUgb3B0aW9uIGNvbXBvbmVudHMgY29udGFpbmVkIHdpdGhpbiB0aGlzIHNlbGVjdGlvbi1saXN0LiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdExpc3RPcHRpb24sIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbnM6IFF1ZXJ5TGlzdDxNYXRMaXN0T3B0aW9uPjtcblxuICAvKiogRW1pdHMgYSBjaGFuZ2UgZXZlbnQgd2hlbmV2ZXIgdGhlIHNlbGVjdGVkIHN0YXRlIG9mIGFuIG9wdGlvbiBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0U2VsZWN0aW9uTGlzdENoYW5nZT4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlPigpO1xuXG4gIC8qKlxuICAgKiBUYWJpbmRleCBvZiB0aGUgc2VsZWN0aW9uIGxpc3QuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIFJlbW92ZSBgdGFiSW5kZXhgIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCkgdGFiSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgLyoqIFRoZW1lIGNvbG9yIG9mIHRoZSBzZWxlY3Rpb24gbGlzdC4gVGhpcyBzZXRzIHRoZSBjaGVja2JveCBjb2xvciBmb3IgYWxsIGxpc3Qgb3B0aW9ucy4gKi9cbiAgQElucHV0KCkgY29sb3I6IFRoZW1lUGFsZXR0ZSA9ICdhY2NlbnQnO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB1c2VkIGZvciBjb21wYXJpbmcgYW4gb3B0aW9uIGFnYWluc3QgdGhlIHNlbGVjdGVkIHZhbHVlIHdoZW4gZGV0ZXJtaW5pbmcgd2hpY2hcbiAgICogb3B0aW9ucyBzaG91bGQgYXBwZWFyIGFzIHNlbGVjdGVkLiBUaGUgZmlyc3QgYXJndW1lbnQgaXMgdGhlIHZhbHVlIG9mIGFuIG9wdGlvbnMuIFRoZSBzZWNvbmRcbiAgICogb25lIGlzIGEgdmFsdWUgZnJvbSB0aGUgc2VsZWN0ZWQgdmFsdWUuIEEgYm9vbGVhbiBtdXN0IGJlIHJldHVybmVkLlxuICAgKi9cbiAgQElucHV0KCkgY29tcGFyZVdpdGg6IChvMTogYW55LCBvMjogYW55KSA9PiBib29sZWFuID0gKGExLCBhMikgPT4gYTEgPT09IGEyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3Rpb24gbGlzdCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgLy8gVGhlIGBNYXRTZWxlY3Rpb25MaXN0YCBhbmQgYE1hdExpc3RPcHRpb25gIGFyZSB1c2luZyB0aGUgYE9uUHVzaGAgY2hhbmdlIGRldGVjdGlvblxuICAgIC8vIHN0cmF0ZWd5LiBUaGVyZWZvcmUgdGhlIG9wdGlvbnMgd2lsbCBub3QgY2hlY2sgZm9yIGFueSBjaGFuZ2VzIGlmIHRoZSBgTWF0U2VsZWN0aW9uTGlzdGBcbiAgICAvLyBjaGFuZ2VkIGl0cyBzdGF0ZS4gU2luY2Ugd2Uga25vdyB0aGF0IGEgY2hhbmdlIHRvIGBkaXNhYmxlZGAgcHJvcGVydHkgb2YgdGhlIGxpc3QgYWZmZWN0c1xuICAgIC8vIHRoZSBzdGF0ZSBvZiB0aGUgb3B0aW9ucywgd2UgbWFudWFsbHkgbWFyayBlYWNoIG9wdGlvbiBmb3IgY2hlY2suXG4gICAgdGhpcy5fbWFya09wdGlvbnNGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgc2VsZWN0aW9uIGlzIGxpbWl0ZWQgdG8gb25lIG9yIG11bHRpcGxlIGl0ZW1zIChkZWZhdWx0IG11bHRpcGxlKS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG11bHRpcGxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fbXVsdGlwbGU7IH1cbiAgc2V0IG11bHRpcGxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9tdWx0aXBsZSkge1xuICAgICAgaWYgKHRoaXMuX2NvbnRlbnRJbml0aWFsaXplZCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnQ2Fubm90IGNoYW5nZSBgbXVsdGlwbGVgIG1vZGUgb2YgbWF0LXNlbGVjdGlvbi1saXN0IGFmdGVyIGluaXRpYWxpemF0aW9uLicpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9tdWx0aXBsZSA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMgPSBuZXcgU2VsZWN0aW9uTW9kZWwodGhpcy5fbXVsdGlwbGUsIHRoaXMuc2VsZWN0ZWRPcHRpb25zLnNlbGVjdGVkKTtcbiAgICB9XG4gIH1cblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBvcHRpb25zLiAqL1xuICBzZWxlY3RlZE9wdGlvbnMgPSBuZXcgU2VsZWN0aW9uTW9kZWw8TWF0TGlzdE9wdGlvbj4odGhpcy5fbXVsdGlwbGUpO1xuXG4gIC8qKiBUaGUgdGFiaW5kZXggb2YgdGhlIHNlbGVjdGlvbiBsaXN0LiAqL1xuICBfdGFiSW5kZXggPSAtMTtcblxuICAvKiogVmlldyB0byBtb2RlbCBjYWxsYmFjayB0aGF0IHNob3VsZCBiZSBjYWxsZWQgd2hlbmV2ZXIgdGhlIHNlbGVjdGVkIG9wdGlvbnMgY2hhbmdlLiAqL1xuICBwcml2YXRlIF9vbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoXzogYW55KSA9PiB7fTtcblxuICAvKiogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnRseS1zZWxlY3RlZCB2YWx1ZS4gKi9cbiAgX3ZhbHVlOiBzdHJpbmdbXXxudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBsaXN0IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVmlldyB0byBtb2RlbCBjYWxsYmFjayB0aGF0IHNob3VsZCBiZSBjYWxsZWQgaWYgdGhlIGxpc3Qgb3IgaXRzIG9wdGlvbnMgbG9zdCBmb2N1cy4gKi9cbiAgX29uVG91Y2hlZDogKCkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsaXN0IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSBfaXNEZXN0cm95ZWQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgUmVtb3ZlIGB0YWJJbmRleGAgcGFyYW1ldGVyLlxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgYF9mb2N1c01vbml0b3JgIHBhcmFtZXRlciB0byBiZWNvbWUgcmVxdWlyZWQuXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yPzogRm9jdXNNb25pdG9yKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jb250ZW50SW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgdGhpcy5fa2V5TWFuYWdlciA9IG5ldyBGb2N1c0tleU1hbmFnZXI8TWF0TGlzdE9wdGlvbj4odGhpcy5vcHRpb25zKVxuICAgICAgLndpdGhXcmFwKClcbiAgICAgIC53aXRoVHlwZUFoZWFkKClcbiAgICAgIC53aXRoSG9tZUFuZEVuZCgpXG4gICAgICAvLyBBbGxvdyBkaXNhYmxlZCBpdGVtcyB0byBiZSBmb2N1c2FibGUuIEZvciBhY2Nlc3NpYmlsaXR5IHJlYXNvbnMsIHRoZXJlIG11c3QgYmUgYSB3YXkgZm9yXG4gICAgICAvLyBzY3JlZW5yZWFkZXIgdXNlcnMsIHRoYXQgYWxsb3dzIHJlYWRpbmcgdGhlIGRpZmZlcmVudCBvcHRpb25zIG9mIHRoZSBsaXN0LlxuICAgICAgLnNraXBQcmVkaWNhdGUoKCkgPT4gZmFsc2UpXG4gICAgICAud2l0aEFsbG93ZWRNb2RpZmllcktleXMoWydzaGlmdEtleSddKTtcblxuICAgIGlmICh0aGlzLl92YWx1ZSkge1xuICAgICAgdGhpcy5fc2V0T3B0aW9uc0Zyb21WYWx1ZXModGhpcy5fdmFsdWUpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSB1c2VyIGF0dGVtcHRzIHRvIHRhYiBvdXQgb2YgdGhlIHNlbGVjdGlvbiBsaXN0LCBhbGxvdyBmb2N1cyB0byBlc2NhcGUuXG4gICAgdGhpcy5fa2V5TWFuYWdlci50YWJPdXQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2FsbG93Rm9jdXNFc2NhcGUoKTtcbiAgICB9KTtcblxuICAgIC8vIFdoZW4gdGhlIG51bWJlciBvZiBvcHRpb25zIGNoYW5nZSwgdXBkYXRlIHRoZSB0YWJpbmRleCBvZiB0aGUgc2VsZWN0aW9uIGxpc3QuXG4gICAgdGhpcy5vcHRpb25zLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fdXBkYXRlVGFiSW5kZXgoKTtcbiAgICB9KTtcblxuICAgIC8vIFN5bmMgZXh0ZXJuYWwgY2hhbmdlcyB0byB0aGUgbW9kZWwgYmFjayB0byB0aGUgb3B0aW9ucy5cbiAgICB0aGlzLnNlbGVjdGVkT3B0aW9ucy5jaGFuZ2VkLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQuYWRkZWQpIHtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBldmVudC5hZGRlZCkge1xuICAgICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudC5yZW1vdmVkKSB7XG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgZXZlbnQucmVtb3ZlZCkge1xuICAgICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgUmVtb3ZlIG51bGwgYXNzZXJ0aW9uIG9uY2UgX2ZvY3VzTW9uaXRvciBpcyByZXF1aXJlZC5cbiAgICB0aGlzLl9mb2N1c01vbml0b3I/Lm1vbml0b3IodGhpcy5fZWxlbWVudClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZShvcmlnaW4gPT4ge1xuICAgICAgICBpZiAob3JpZ2luID09PSAna2V5Ym9hcmQnIHx8IG9yaWdpbiA9PT0gJ3Byb2dyYW0nKSB7XG4gICAgICAgICAgY29uc3QgYWN0aXZlSW5kZXggPSB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleDtcblxuICAgICAgICAgIGlmICghYWN0aXZlSW5kZXggfHwgYWN0aXZlSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyBhY3RpdmUgaW5kZXgsIHNldCBmb2N1cyB0byB0aGUgZmlyc3Qgb3B0aW9uLlxuICAgICAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBzZXQgZm9jdXMgdG8gdGhlIGFjdGl2ZSBvcHRpb24uXG4gICAgICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0oYWN0aXZlSW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgZGlzYWJsZVJpcHBsZUNoYW5nZXMgPSBjaGFuZ2VzWydkaXNhYmxlUmlwcGxlJ107XG4gICAgY29uc3QgY29sb3JDaGFuZ2VzID0gY2hhbmdlc1snY29sb3InXTtcblxuICAgIGlmICgoZGlzYWJsZVJpcHBsZUNoYW5nZXMgJiYgIWRpc2FibGVSaXBwbGVDaGFuZ2VzLmZpcnN0Q2hhbmdlKSB8fFxuICAgICAgICAoY29sb3JDaGFuZ2VzICYmICFjb2xvckNoYW5nZXMuZmlyc3RDaGFuZ2UpKSB7XG4gICAgICB0aGlzLl9tYXJrT3B0aW9uc0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgUmVtb3ZlIG51bGwgYXNzZXJ0aW9uIG9uY2UgX2ZvY3VzTW9uaXRvciBpcyByZXF1aXJlZC5cbiAgICB0aGlzLl9mb2N1c01vbml0b3I/LnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnQpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5faXNEZXN0cm95ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHNlbGVjdGlvbiBsaXN0LiAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIFNlbGVjdHMgYWxsIG9mIHRoZSBvcHRpb25zLiAqL1xuICBzZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5fc2V0QWxsT3B0aW9uc1NlbGVjdGVkKHRydWUpO1xuICB9XG5cbiAgLyoqIERlc2VsZWN0cyBhbGwgb2YgdGhlIG9wdGlvbnMuICovXG4gIGRlc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuX3NldEFsbE9wdGlvbnNTZWxlY3RlZChmYWxzZSk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgZm9jdXNlZCBvcHRpb24gb2YgdGhlIHNlbGVjdGlvbi1saXN0LiAqL1xuICBfc2V0Rm9jdXNlZE9wdGlvbihvcHRpb246IE1hdExpc3RPcHRpb24pIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0ob3B0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuIG9wdGlvbiBmcm9tIHRoZSBzZWxlY3Rpb24gbGlzdCBhbmQgdXBkYXRlcyB0aGUgYWN0aXZlIGl0ZW0uXG4gICAqIEByZXR1cm5zIEN1cnJlbnRseS1hY3RpdmUgaXRlbS5cbiAgICovXG4gIF9yZW1vdmVPcHRpb25Gcm9tTGlzdChvcHRpb246IE1hdExpc3RPcHRpb24pOiBNYXRMaXN0T3B0aW9uIHwgbnVsbCB7XG4gICAgY29uc3Qgb3B0aW9uSW5kZXggPSB0aGlzLl9nZXRPcHRpb25JbmRleChvcHRpb24pO1xuXG4gICAgaWYgKG9wdGlvbkluZGV4ID4gLTEgJiYgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtSW5kZXggPT09IG9wdGlvbkluZGV4KSB7XG4gICAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBvcHRpb24gaXMgdGhlIGxhc3QgaXRlbVxuICAgICAgaWYgKG9wdGlvbkluZGV4ID4gMCkge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0ob3B0aW9uSW5kZXggLSAxKTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uSW5kZXggPT09IDAgJiYgdGhpcy5vcHRpb25zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKE1hdGgubWluKG9wdGlvbkluZGV4ICsgMSwgdGhpcy5vcHRpb25zLmxlbmd0aCAtIDEpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtO1xuICB9XG5cbiAgLyoqIFBhc3NlcyByZWxldmFudCBrZXkgcHJlc3NlcyB0byBvdXIga2V5IG1hbmFnZXIuICovXG4gIF9rZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgY29uc3QgbWFuYWdlciA9IHRoaXMuX2tleU1hbmFnZXI7XG4gICAgY29uc3QgcHJldmlvdXNGb2N1c0luZGV4ID0gbWFuYWdlci5hY3RpdmVJdGVtSW5kZXg7XG4gICAgY29uc3QgaGFzTW9kaWZpZXIgPSBoYXNNb2RpZmllcktleShldmVudCk7XG5cbiAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgIGNhc2UgU1BBQ0U6XG4gICAgICBjYXNlIEVOVEVSOlxuICAgICAgICBpZiAoIWhhc01vZGlmaWVyICYmICFtYW5hZ2VyLmlzVHlwaW5nKCkpIHtcbiAgICAgICAgICB0aGlzLl90b2dnbGVGb2N1c2VkT3B0aW9uKCk7XG4gICAgICAgICAgLy8gQWx3YXlzIHByZXZlbnQgc3BhY2UgZnJvbSBzY3JvbGxpbmcgdGhlIHBhZ2Ugc2luY2UgdGhlIGxpc3QgaGFzIGZvY3VzXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIFRoZSBcIkFcIiBrZXkgZ2V0cyBzcGVjaWFsIHRyZWF0bWVudCwgYmVjYXVzZSBpdCdzIHVzZWQgZm9yIHRoZSBcInNlbGVjdCBhbGxcIiBmdW5jdGlvbmFsaXR5LlxuICAgICAgICBpZiAoa2V5Q29kZSA9PT0gQSAmJiB0aGlzLm11bHRpcGxlICYmIGhhc01vZGlmaWVyS2V5KGV2ZW50LCAnY3RybEtleScpICYmXG4gICAgICAgICAgICAhbWFuYWdlci5pc1R5cGluZygpKSB7XG4gICAgICAgICAgY29uc3Qgc2hvdWxkU2VsZWN0ID0gdGhpcy5vcHRpb25zLnNvbWUob3B0aW9uID0+ICFvcHRpb24uZGlzYWJsZWQgJiYgIW9wdGlvbi5zZWxlY3RlZCk7XG4gICAgICAgICAgdGhpcy5fc2V0QWxsT3B0aW9uc1NlbGVjdGVkKHNob3VsZFNlbGVjdCwgdHJ1ZSk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiAoa2V5Q29kZSA9PT0gVVBfQVJST1cgfHwga2V5Q29kZSA9PT0gRE9XTl9BUlJPVykgJiYgZXZlbnQuc2hpZnRLZXkgJiZcbiAgICAgICAgbWFuYWdlci5hY3RpdmVJdGVtSW5kZXggIT09IHByZXZpb3VzRm9jdXNJbmRleCkge1xuICAgICAgdGhpcy5fdG9nZ2xlRm9jdXNlZE9wdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXBvcnRzIGEgdmFsdWUgY2hhbmdlIHRvIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciAqL1xuICBfcmVwb3J0VmFsdWVDaGFuZ2UoKSB7XG4gICAgLy8gU3RvcCByZXBvcnRpbmcgdmFsdWUgY2hhbmdlcyBhZnRlciB0aGUgbGlzdCBoYXMgYmVlbiBkZXN0cm95ZWQuIFRoaXMgYXZvaWRzXG4gICAgLy8gY2FzZXMgd2hlcmUgdGhlIGxpc3QgbWlnaHQgd3JvbmdseSByZXNldCBpdHMgdmFsdWUgb25jZSBpdCBpcyByZW1vdmVkLCBidXRcbiAgICAvLyB0aGUgZm9ybSBjb250cm9sIGlzIHN0aWxsIGxpdmUuXG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiAhdGhpcy5faXNEZXN0cm95ZWQpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fZ2V0U2VsZWN0ZWRPcHRpb25WYWx1ZXMoKTtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlKTtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVtaXRzIGEgY2hhbmdlIGV2ZW50IGlmIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiBhbiBvcHRpb24gY2hhbmdlZC4gKi9cbiAgX2VtaXRDaGFuZ2VFdmVudChvcHRpb246IE1hdExpc3RPcHRpb24pIHtcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KG5ldyBNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlKHRoaXMsIG9wdGlvbikpO1xuICB9XG5cbiAgLyoqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuICovXG4gIHdyaXRlVmFsdWUodmFsdWVzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWVzO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgdGhpcy5fc2V0T3B0aW9uc0Zyb21WYWx1ZXModmFsdWVzIHx8IFtdKTtcbiAgICB9XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLiAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLiAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci4gKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBzZWxlY3RlZCBvcHRpb25zIGJhc2VkIG9uIHRoZSBzcGVjaWZpZWQgdmFsdWVzLiAqL1xuICBwcml2YXRlIF9zZXRPcHRpb25zRnJvbVZhbHVlcyh2YWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5vcHRpb25zLmZvckVhY2gob3B0aW9uID0+IG9wdGlvbi5fc2V0U2VsZWN0ZWQoZmFsc2UpKTtcblxuICAgIHZhbHVlcy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdPcHRpb24gPSB0aGlzLm9wdGlvbnMuZmluZChvcHRpb24gPT4ge1xuICAgICAgICAvLyBTa2lwIG9wdGlvbnMgdGhhdCBhcmUgYWxyZWFkeSBpbiB0aGUgbW9kZWwuIFRoaXMgYWxsb3dzIHVzIHRvIGhhbmRsZSBjYXNlc1xuICAgICAgICAvLyB3aGVyZSB0aGUgc2FtZSBwcmltaXRpdmUgdmFsdWUgaXMgc2VsZWN0ZWQgbXVsdGlwbGUgdGltZXMuXG4gICAgICAgIHJldHVybiBvcHRpb24uc2VsZWN0ZWQgPyBmYWxzZSA6IHRoaXMuY29tcGFyZVdpdGgob3B0aW9uLnZhbHVlLCB2YWx1ZSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGNvcnJlc3BvbmRpbmdPcHRpb24pIHtcbiAgICAgICAgY29ycmVzcG9uZGluZ09wdGlvbi5fc2V0U2VsZWN0ZWQodHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgdmFsdWVzIG9mIHRoZSBzZWxlY3RlZCBvcHRpb25zLiAqL1xuICBwcml2YXRlIF9nZXRTZWxlY3RlZE9wdGlvblZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIob3B0aW9uID0+IG9wdGlvbi5zZWxlY3RlZCkubWFwKG9wdGlvbiA9PiBvcHRpb24udmFsdWUpO1xuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIHN0YXRlIG9mIHRoZSBjdXJyZW50bHkgZm9jdXNlZCBvcHRpb24gaWYgZW5hYmxlZC4gKi9cbiAgcHJpdmF0ZSBfdG9nZ2xlRm9jdXNlZE9wdGlvbigpOiB2b2lkIHtcbiAgICBsZXQgZm9jdXNlZEluZGV4ID0gdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtSW5kZXg7XG5cbiAgICBpZiAoZm9jdXNlZEluZGV4ICE9IG51bGwgJiYgdGhpcy5faXNWYWxpZEluZGV4KGZvY3VzZWRJbmRleCkpIHtcbiAgICAgIGxldCBmb2N1c2VkT3B0aW9uOiBNYXRMaXN0T3B0aW9uID0gdGhpcy5vcHRpb25zLnRvQXJyYXkoKVtmb2N1c2VkSW5kZXhdO1xuXG4gICAgICBpZiAoZm9jdXNlZE9wdGlvbiAmJiAhZm9jdXNlZE9wdGlvbi5kaXNhYmxlZCAmJiAodGhpcy5fbXVsdGlwbGUgfHwgIWZvY3VzZWRPcHRpb24uc2VsZWN0ZWQpKSB7XG4gICAgICAgIGZvY3VzZWRPcHRpb24udG9nZ2xlKCk7XG5cbiAgICAgICAgLy8gRW1pdCBhIGNoYW5nZSBldmVudCBiZWNhdXNlIHRoZSBmb2N1c2VkIG9wdGlvbiBjaGFuZ2VkIGl0cyBzdGF0ZSB0aHJvdWdoIHVzZXJcbiAgICAgICAgLy8gaW50ZXJhY3Rpb24uXG4gICAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudChmb2N1c2VkT3B0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2VsZWN0ZWQgc3RhdGUgb24gYWxsIG9mIHRoZSBvcHRpb25zXG4gICAqIGFuZCBlbWl0cyBhbiBldmVudCBpZiBhbnl0aGluZyBjaGFuZ2VkLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0QWxsT3B0aW9uc1NlbGVjdGVkKGlzU2VsZWN0ZWQ6IGJvb2xlYW4sIHNraXBEaXNhYmxlZD86IGJvb2xlYW4pIHtcbiAgICAvLyBLZWVwIHRyYWNrIG9mIHdoZXRoZXIgYW55dGhpbmcgY2hhbmdlZCwgYmVjYXVzZSB3ZSBvbmx5IHdhbnQgdG9cbiAgICAvLyBlbWl0IHRoZSBjaGFuZ2VkIGV2ZW50IHdoZW4gc29tZXRoaW5nIGFjdHVhbGx5IGNoYW5nZWQuXG4gICAgbGV0IGhhc0NoYW5nZWQgPSBmYWxzZTtcblxuICAgIHRoaXMub3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICBpZiAoKCFza2lwRGlzYWJsZWQgfHwgIW9wdGlvbi5kaXNhYmxlZCkgJiYgb3B0aW9uLl9zZXRTZWxlY3RlZChpc1NlbGVjdGVkKSkge1xuICAgICAgICBoYXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChoYXNDaGFuZ2VkKSB7XG4gICAgICB0aGlzLl9yZXBvcnRWYWx1ZUNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVdGlsaXR5IHRvIGVuc3VyZSBhbGwgaW5kZXhlcyBhcmUgdmFsaWQuXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggdG8gYmUgY2hlY2tlZC5cbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgaW5kZXggaXMgdmFsaWQgZm9yIG91ciBsaXN0IG9mIG9wdGlvbnMuXG4gICAqL1xuICBwcml2YXRlIF9pc1ZhbGlkSW5kZXgoaW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5vcHRpb25zLmxlbmd0aDtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgc3BlY2lmaWVkIGxpc3Qgb3B0aW9uLiAqL1xuICBwcml2YXRlIF9nZXRPcHRpb25JbmRleChvcHRpb246IE1hdExpc3RPcHRpb24pOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMudG9BcnJheSgpLmluZGV4T2Yob3B0aW9uKTtcbiAgfVxuXG4gIC8qKiBNYXJrcyBhbGwgdGhlIG9wdGlvbnMgdG8gYmUgY2hlY2tlZCBpbiB0aGUgbmV4dCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bi4gKi9cbiAgcHJpdmF0ZSBfbWFya09wdGlvbnNGb3JDaGVjaygpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4gb3B0aW9uLl9tYXJrRm9yQ2hlY2soKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIHRhYmluZGV4IGZyb20gdGhlIHNlbGVjdGlvbiBsaXN0IGFuZCByZXNldHMgaXQgYmFjayBhZnRlcndhcmRzLCBhbGxvd2luZyB0aGUgdXNlclxuICAgKiB0byB0YWIgb3V0IG9mIGl0LiBUaGlzIHByZXZlbnRzIHRoZSBsaXN0IGZyb20gY2FwdHVyaW5nIGZvY3VzIGFuZCByZWRpcmVjdGluZyBpdCBiYWNrIHdpdGhpblxuICAgKiB0aGUgbGlzdCwgY3JlYXRpbmcgYSBmb2N1cyB0cmFwIGlmIGl0IHVzZXIgdHJpZXMgdG8gdGFiIGF3YXkuXG4gICAqL1xuICBwcml2YXRlIF9hbGxvd0ZvY3VzRXNjYXBlKCkge1xuICAgIHRoaXMuX3RhYkluZGV4ID0gLTE7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX3RhYkluZGV4ID0gMDtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHRhYmluZGV4IGJhc2VkIHVwb24gaWYgdGhlIHNlbGVjdGlvbiBsaXN0IGlzIGVtcHR5LiAqL1xuICBwcml2YXRlIF91cGRhdGVUYWJJbmRleCgpOiB2b2lkIHtcbiAgICB0aGlzLl90YWJJbmRleCA9ICh0aGlzLm9wdGlvbnMubGVuZ3RoID09PSAwKSA/IC0xIDogMDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbXVsdGlwbGU6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==