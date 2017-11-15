/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '@angular/common';
import '@angular/core';
import { MatLineSetter, mixinDisableRipple, mixinDisabled, mixinTabIndex } from '@angular/material/core';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import '@angular/cdk/collections';
import { SPACE } from '@angular/cdk/keycodes';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * \@docs-private
 */
class MatListBase {
}
const _MatListMixinBase = mixinDisableRipple(MatListBase);
/**
 * \@docs-private
 */
class MatListItemBase {
}
const _MatListItemMixinBase = mixinDisableRipple(MatListItemBase);
/**
 * Divider between items within a list.
 */
class MatListDivider {
}
/**
 * A Material Design list component.
 */
class MatList extends _MatListMixinBase {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MatListCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MatNavListCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MatDividerCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MatListAvatarCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MatListIconCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MatListSubheaderCssMatStyler {
}
/**
 * An item within a Material Design list.
 */
class MatListItem extends _MatListItemMixinBase {
    /**
     * @param {?} _renderer
     * @param {?} _element
     * @param {?} _list
     * @param {?} navList
     */
    constructor(_renderer, _element, _list, navList) {
        super();
        this._renderer = _renderer;
        this._element = _element;
        this._list = _list;
        this._isNavList = !!navList;
    }
    /**
     * @param {?} avatar
     * @return {?}
     */
    set _hasAvatar(avatar) {
        if (avatar != null) {
            this._renderer.addClass(this._element.nativeElement, 'mat-list-item-avatar');
        }
        else {
            this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-avatar');
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._lineSetter = new MatLineSetter(this._lines, this._renderer, this._element);
    }
    /**
     * Whether this list item should show a ripple effect when clicked.
     * @return {?}
     */
    _isRippleDisabled() {
        return !this._isNavList || this.disableRipple || this._list.disableRipple;
    }
    /**
     * @return {?}
     */
    _handleFocus() {
        this._renderer.addClass(this._element.nativeElement, 'mat-list-item-focus');
    }
    /**
     * @return {?}
     */
    _handleBlur() {
        this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-focus');
    }
    /**
     * Retrieves the DOM element of the component host.
     * @return {?}
     */
    _getHostElement() {
        return this._element.nativeElement;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * \@docs-private
 */
class MatSelectionListBase {
}
const _MatSelectionListMixinBase = mixinTabIndex(mixinDisableRipple(mixinDisabled(MatSelectionListBase)));
/**
 * \@docs-private
 */
class MatListOptionBase {
}
const _MatListOptionMixinBase = mixinDisableRipple(MatListOptionBase);
/**
 * Change event object emitted by MatListOption
 */
class MatListOptionChange {
}
/**
 * Component for list-options of selection-list. Each list-option can automatically
 * generate a checkbox and can put current item into the selectionModel of selection-list
 * if the current item is selected.
 */
class MatListOption extends _MatListOptionMixinBase {
    /**
     * @param {?} _renderer
     * @param {?} _element
     * @param {?} _changeDetector
     * @param {?} selectionList
     */
    constructor(_renderer, _element, _changeDetector, selectionList) {
        super();
        this._renderer = _renderer;
        this._element = _element;
        this._changeDetector = _changeDetector;
        this.selectionList = selectionList;
    }
    /**
     * Whether the option is disabled.
     * @return {?}
     */
    get disabled() {
        return (this.selectionList && this.selectionList.disabled) || this._disabled;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) { this._disabled = coerceBooleanProperty(value); }
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
        const /** @type {?} */ isSelected = coerceBooleanProperty(value);
        if (isSelected !== this.selected) {
            this.selectionList.selectedOptions.toggle(this);
            this._changeDetector.markForCheck();
            this.selectionChange.emit(this._createChangeEvent());
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.selected) {
            this.selectionList.selectedOptions.select(this);
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._lineSetter = new MatLineSetter(this._lines, this._renderer, this._element);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.selectionList._removeOptionFromList(this);
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
        }
    }
    /**
     * @return {?}
     */
    _handleFocus() {
        this._hasFocus = true;
        this.selectionList._setFocusedOption(this);
    }
    /**
     * Creates a selection event object from the specified option.
     * @param {?=} option
     * @return {?}
     */
    _createChangeEvent(option = this) {
        const /** @type {?} */ event = new MatListOptionChange();
        event.source = option;
        event.selected = option.selected;
        return event;
    }
    /**
     * Retrieves the DOM element of the component host.
     * @return {?}
     */
    _getHostElement() {
        return this._element.nativeElement;
    }
}
/**
 * Material Design list component where each item is a selectable option. Behaves as a listbox.
 */
class MatSelectionList extends _MatSelectionListMixinBase {
    /**
     * @param {?} _element
     * @param {?} tabIndex
     */
    constructor(_element, tabIndex) {
        super();
        this._element = _element;
        this.tabIndex = parseInt(tabIndex) || 0;
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._keyManager = new FocusKeyManager(this.options).withWrap();
    }
    /**
     * Focus the selection-list.
     * @return {?}
     */
    focus() {
        this._element.nativeElement.focus();
    }
    /**
     * Selects all of the options.
     * @return {?}
     */
    selectAll() {
        this.options.forEach(option => {
            if (!option.selected) {
                option.toggle();
            }
        });
    }
    /**
     * Deselects all of the options.
     * @return {?}
     */
    deselectAll() {
        this.options.forEach(option => {
            if (option.selected) {
                option.toggle();
            }
        });
    }
    /**
     * Sets the focused option of the selection-list.
     * @param {?} option
     * @return {?}
     */
    _setFocusedOption(option) {
        this._keyManager.updateActiveItemIndex(this._getOptionIndex(option));
    }
    /**
     * Removes an option from the selection list and updates the active item.
     * @param {?} option
     * @return {?}
     */
    _removeOptionFromList(option) {
        if (option._hasFocus) {
            const /** @type {?} */ optionIndex = this._getOptionIndex(option);
            // Check whether the option is the last item
            if (optionIndex > 0) {
                this._keyManager.setPreviousItemActive();
            }
            else if (optionIndex === 0 && this.options.length > 1) {
                this._keyManager.setNextItemActive();
            }
        }
    }
    /**
     * Passes relevant key presses to our key manager.
     * @param {?} event
     * @return {?}
     */
    _keydown(event) {
        switch (event.keyCode) {
            case SPACE:
                this._toggleSelectOnFocusedOption();
                // Always prevent space from scrolling the page since the list has focus
                event.preventDefault();
                break;
            default:
                this._keyManager.onKeydown(event);
        }
    }
    /**
     * Toggles the selected state of the currently focused option.
     * @return {?}
     */
    _toggleSelectOnFocusedOption() {
        let /** @type {?} */ focusedIndex = this._keyManager.activeItemIndex;
        if (focusedIndex != null && this._isValidIndex(focusedIndex)) {
            let /** @type {?} */ focusedOption = this.options.toArray()[focusedIndex];
            if (focusedOption) {
                focusedOption.toggle();
            }
        }
    }
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param {?} index The index to be checked.
     * @return {?} True if the index is valid for our list of options.
     */
    _isValidIndex(index) {
        return index >= 0 && index < this.options.length;
    }
    /**
     * Returns the index of the specified list option.
     * @param {?} option
     * @return {?}
     */
    _getOptionIndex(option) {
        return this.options.toArray().indexOf(option);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatListModule {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatListModule, MatListBase, _MatListMixinBase, MatListItemBase, _MatListItemMixinBase, MatListDivider, MatList, MatListCssMatStyler, MatNavListCssMatStyler, MatDividerCssMatStyler, MatListAvatarCssMatStyler, MatListIconCssMatStyler, MatListSubheaderCssMatStyler, MatListItem, MatSelectionListBase, _MatSelectionListMixinBase, MatListOptionBase, _MatListOptionMixinBase, MatListOptionChange, MatListOption, MatSelectionList };
//# sourceMappingURL=list.js.map
