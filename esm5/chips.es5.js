import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, Input, NgModule, Optional, Output, Renderer2, ViewEncapsulation, forwardRef } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BACKSPACE, DELETE, ENTER, LEFT_ARROW, RIGHT_ARROW, SPACE, UP_ARROW, mixinColor, mixinDisabled } from '@angular/material/core';
import { Subject } from 'rxjs/Subject';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { Subscription } from 'rxjs/Subscription';
/**
 * \@docs-private
 */
var MdChipBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdChipBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdChipBase;
}());
var _MdChipMixinBase = mixinColor(mixinDisabled(MdChipBase), 'primary');
/**
 * Dummy directive to add CSS class to basic chips.
 * \@docs-private
 */
var MdBasicChip = (function () {
    function MdBasicChip() {
    }
    return MdBasicChip;
}());
MdBasicChip.decorators = [
    { type: Directive, args: [{
                selector: "md-basic-chip, [md-basic-chip], mat-basic-chip, [mat-basic-chip]",
                host: { 'class': 'mat-basic-chip' }
            },] },
];
/**
 * @nocollapse
 */
MdBasicChip.ctorParameters = function () { return []; };
/**
 * Material design styled Chip component. Used inside the MdChipList component.
 */
var MdChip = (function (_super) {
    tslib_1.__extends(MdChip, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     */
    function MdChip(renderer, elementRef) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._selected = false;
        _this._selectable = true;
        _this._removable = true;
        /**
         * Whether the chip has focus.
         */
        _this._hasFocus = false;
        /**
         * Emits when the chip is focused.
         */
        _this._onFocus = new Subject();
        /**
         * Emitted when the chip is selected.
         */
        _this.select = new EventEmitter();
        /**
         * Emitted when the chip is deselected.
         */
        _this.deselect = new EventEmitter();
        /**
         * Emitted when the chip is destroyed.
         */
        _this.destroy = new EventEmitter();
        /**
         * Emitted when a chip is to be removed.
         */
        _this.onRemove = new EventEmitter();
        return _this;
    }
    Object.defineProperty(MdChip.prototype, "selected", {
        /**
         * Whether the chip is selected.
         * @return {?}
         */
        get: function () { return this._selected; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selected = coerceBooleanProperty(value);
            (this.selected ? this.select : this.deselect).emit({ chip: this });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChip.prototype, "selectable", {
        /**
         * Whether or not the chips are selectable. When a chip is not selectable,
         * changes to it's selected state are always ignored.
         * @return {?}
         */
        get: function () {
            return this._selectable;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selectable = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChip.prototype, "removable", {
        /**
         * Determines whether or not the chip displays the remove styling and emits (remove) events.
         * @return {?}
         */
        get: function () {
            return this._removable;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._removable = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChip.prototype, "ariaSelected", {
        /**
         * @return {?}
         */
        get: function () {
            return this.selectable ? this.selected.toString() : null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdChip.prototype.ngOnDestroy = function () {
        this.destroy.emit({ chip: this });
    };
    /**
     * Toggles the current selected state of this chip.
     * @return {?}
     */
    MdChip.prototype.toggleSelected = function () {
        this.selected = !this.selected;
        return this.selected;
    };
    /**
     * Allows for programmatic focusing of the chip.
     * @return {?}
     */
    MdChip.prototype.focus = function () {
        this._elementRef.nativeElement.focus();
        this._onFocus.next({ chip: this });
    };
    /**
     * Allows for programmatic removal of the chip. Called by the MdChipList when the DELETE or
     * BACKSPACE keys are pressed.
     *
     * Informs any listeners of the removal request. Does not remove the chip from the DOM.
     * @return {?}
     */
    MdChip.prototype.remove = function () {
        if (this.removable) {
            this.onRemove.emit({ chip: this });
        }
    };
    /**
     * Ensures events fire properly upon click.
     * @param {?} event
     * @return {?}
     */
    MdChip.prototype._handleClick = function (event) {
        // Check disabled
        if (this.disabled) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        this.focus();
    };
    /**
     * Handle custom key presses.
     * @param {?} event
     * @return {?}
     */
    MdChip.prototype._handleKeydown = function (event) {
        if (this.disabled) {
            return;
        }
        switch (event.keyCode) {
            case DELETE:
            case BACKSPACE:
                // If we are removable, remove the focused chip
                this.remove();
                // Always prevent so page navigation does not occur
                event.preventDefault();
                break;
            case SPACE:
                // If we are selectable, toggle the focused chip
                if (this.selectable) {
                    this.toggleSelected();
                }
                // Always prevent space from scrolling the page since the list has focus
                event.preventDefault();
                break;
        }
    };
    return MdChip;
}(_MdChipMixinBase));
MdChip.decorators = [
    { type: Directive, args: [{
                selector: "md-basic-chip, [md-basic-chip], md-chip, [md-chip],\n             mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]",
                inputs: ['color', 'disabled'],
                exportAs: 'mdChip',
                host: {
                    'class': 'mat-chip',
                    'tabindex': '-1',
                    'role': 'option',
                    '[class.mat-chip-selected]': 'selected',
                    '[attr.disabled]': 'disabled || null',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.aria-selected]': 'ariaSelected',
                    '(click)': '_handleClick($event)',
                    '(keydown)': '_handleKeydown($event)',
                    '(focus)': '_hasFocus = true',
                    '(blur)': '_hasFocus = false',
                }
            },] },
];
/**
 * @nocollapse
 */
MdChip.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
]; };
MdChip.propDecorators = {
    '_chipRemove': [{ type: ContentChild, args: [forwardRef(function () { return MdChipRemove; }),] },],
    'selected': [{ type: Input },],
    'selectable': [{ type: Input },],
    'removable': [{ type: Input },],
    'select': [{ type: Output },],
    'deselect': [{ type: Output },],
    'destroy': [{ type: Output },],
    'onRemove': [{ type: Output, args: ['remove',] },],
};
/**
 * Applies proper (click) support and adds styling for use with the Material Design "cancel" icon
 * available at https://material.io/icons/#ic_cancel.
 *
 * Example:
 *
 *     <md-chip>
 *       <md-icon mdChipRemove>cancel</md-icon>
 *     </md-chip>
 *
 * You *may* use a custom icon, but you may need to override the `md-chip-remove` positioning styles
 * to properly center the icon within the chip.
 */
var MdChipRemove = (function () {
    /**
     * @param {?} _parentChip
     */
    function MdChipRemove(_parentChip) {
        this._parentChip = _parentChip;
    }
    /**
     * Calls the parent chip's public `remove()` method if applicable.
     * @return {?}
     */
    MdChipRemove.prototype._handleClick = function () {
        if (this._parentChip.removable) {
            this._parentChip.remove();
        }
    };
    return MdChipRemove;
}());
MdChipRemove.decorators = [
    { type: Directive, args: [{
                selector: '[mdChipRemove], [matChipRemove]',
                host: {
                    'class': 'mat-chip-remove',
                    '(click)': '_handleClick($event)'
                }
            },] },
];
/**
 * @nocollapse
 */
MdChipRemove.ctorParameters = function () { return [
    { type: MdChip, },
]; };
/**
 * A material design chips component (named ChipList for it's similarity to the List component).
 *
 * Example:
 *
 *     <md-chip-list>
 *       <md-chip>Chip 1<md-chip>
 *       <md-chip>Chip 2<md-chip>
 *     </md-chip-list>
 */
var MdChipList = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     * @param {?} _dir
     */
    function MdChipList(_renderer, _elementRef, _dir) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._dir = _dir;
        /**
         * When a chip is destroyed, we track the index so we can focus the appropriate next chip.
         */
        this._lastDestroyedIndex = null;
        /**
         * Track which chips we're listening to for focus/destruction.
         */
        this._chipSet = new WeakMap();
        /**
         * Subscription to tabbing out from the chip list.
         */
        this._tabOutSubscription = Subscription.EMPTY;
        /**
         * Whether or not the chip is selectable.
         */
        this._selectable = true;
        /**
         * Tab index for the chip list.
         */
        this._tabIndex = 0;
        /**
         * User defined tab index.
         * When it is not null, use user defined tab index. Otherwise use _tabIndex
         */
        this._userTabIndex = null;
        /**
         * Orientation of the chip list.
         */
        this.ariaOrientation = 'horizontal';
    }
    /**
     * @return {?}
     */
    MdChipList.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._keyManager = new FocusKeyManager(this.chips).withWrap();
        // Prevents the chip list from capturing focus and redirecting
        // it back to the first chip when the user tabs out.
        this._tabOutSubscription = this._keyManager.tabOut.subscribe(function () {
            _this._tabIndex = -1;
            setTimeout(function () { return _this._tabIndex = _this._userTabIndex || 0; });
        });
        // Go ahead and subscribe all of the initial chips
        this._subscribeChips(this.chips);
        // Make sure we set our tab index at the start
        this._updateTabIndex();
        // When the list changes, re-subscribe
        this.chips.changes.subscribe(function (chips) {
            _this._subscribeChips(chips);
            // If we have 0 chips, attempt to focus an input (if available)
            if (chips.length === 0) {
                _this._focusInput();
            }
            // Check to see if we need to update our tab index
            _this._updateTabIndex();
            // Check to see if we have a destroyed chip and need to refocus
            _this._updateFocusForDestroyedChips();
        });
    };
    /**
     * @return {?}
     */
    MdChipList.prototype.ngOnDestroy = function () {
        this._tabOutSubscription.unsubscribe();
    };
    Object.defineProperty(MdChipList.prototype, "selectable", {
        /**
         * Whether or not this chip is selectable. When a chip is not selectable,
         * it's selected state is always ignored.
         * @return {?}
         */
        get: function () {
            return this._selectable;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selectable = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipList.prototype, "tabIndex", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._userTabIndex = value;
            this._tabIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Associates an HTML input element with this chip list.
     * @param {?} inputElement
     * @return {?}
     */
    MdChipList.prototype.registerInput = function (inputElement) {
        this._inputElement = inputElement;
    };
    /**
     * Focuses the the first non-disabled chip in this chip list, or the associated input when there
     * are no eligible chips.
     * @return {?}
     */
    MdChipList.prototype.focus = function () {
        // TODO: ARIA says this should focus the first `selected` chip if any are selected.
        if (this.chips.length > 0) {
            this._keyManager.setFirstItemActive();
        }
        else {
            this._focusInput();
        }
    };
    /**
     * Attempt to focus an input if we have one.
     * @return {?}
     */
    MdChipList.prototype._focusInput = function () {
        if (this._inputElement) {
            this._inputElement.focus();
        }
    };
    /**
     * Pass events to the keyboard manager. Available here for tests.
     * @param {?} event
     * @return {?}
     */
    MdChipList.prototype._keydown = function (event) {
        var /** @type {?} */ code = event.keyCode;
        var /** @type {?} */ target = (event.target);
        var /** @type {?} */ isInputEmpty = this._isInputEmpty(target);
        var /** @type {?} */ isRtl = this._dir && this._dir.value == 'rtl';
        var /** @type {?} */ isPrevKey = (code === (isRtl ? RIGHT_ARROW : LEFT_ARROW));
        var /** @type {?} */ isNextKey = (code === (isRtl ? LEFT_ARROW : RIGHT_ARROW));
        var /** @type {?} */ isBackKey = (code === BACKSPACE || code == DELETE || code == UP_ARROW || isPrevKey);
        // If they are on an empty input and hit backspace/delete/left arrow, focus the last chip
        if (isInputEmpty && isBackKey) {
            this._keyManager.setLastItemActive();
            event.preventDefault();
            return;
        }
        // If they are on a chip, check for space/left/right, otherwise pass to our key manager (like
        // up/down keys)
        if (target && target.classList.contains('mat-chip')) {
            if (isPrevKey) {
                this._keyManager.setPreviousItemActive();
                event.preventDefault();
            }
            else if (isNextKey) {
                this._keyManager.setNextItemActive();
                event.preventDefault();
            }
            else {
                this._keyManager.onKeydown(event);
            }
        }
    };
    /**
     * Iterate through the list of chips and add them to our list of
     * subscribed chips.
     *
     * @param {?} chips The list of chips to be subscribed.
     * @return {?}
     */
    MdChipList.prototype._subscribeChips = function (chips) {
        var _this = this;
        chips.forEach(function (chip) { return _this._addChip(chip); });
    };
    /**
     * Check the tab index as you should not be allowed to focus an empty list.
     * @return {?}
     */
    MdChipList.prototype._updateTabIndex = function () {
        // If we have 0 chips, we should not allow keyboard focus
        this._tabIndex = this._userTabIndex || (this.chips.length === 0 ? -1 : 0);
    };
    /**
     * Add a specific chip to our subscribed list. If the chip has
     * already been subscribed, this ensures it is only subscribed
     * once.
     *
     * @param {?} chip The chip to be subscribed (or checked for existing
     * subscription).
     * @return {?}
     */
    MdChipList.prototype._addChip = function (chip) {
        var _this = this;
        // If we've already been subscribed to a parent, do nothing
        if (this._chipSet.has(chip)) {
            return;
        }
        // Watch for focus events outside of the keyboard navigation
        chip._onFocus.subscribe(function () {
            var /** @type {?} */ chipIndex = _this.chips.toArray().indexOf(chip);
            if (_this._isValidIndex(chipIndex)) {
                _this._keyManager.updateActiveItemIndex(chipIndex);
            }
        });
        // On destroy, remove the item from our list, and setup our destroyed focus check
        chip.destroy.subscribe(function () {
            var /** @type {?} */ chipIndex = _this.chips.toArray().indexOf(chip);
            if (_this._isValidIndex(chipIndex)) {
                if (chip._hasFocus) {
                    // Check whether the chip is the last item
                    if (chipIndex < _this.chips.length - 1) {
                        _this._keyManager.setActiveItem(chipIndex);
                    }
                    else if (chipIndex - 1 >= 0) {
                        _this._keyManager.setActiveItem(chipIndex - 1);
                    }
                }
                if (_this._keyManager.activeItemIndex === chipIndex) {
                    _this._lastDestroyedIndex = chipIndex;
                }
            }
            _this._chipSet.delete(chip);
            chip.destroy.unsubscribe();
        });
        this._chipSet.set(chip, true);
    };
    /**
     * Checks to see if a focus chip was recently destroyed so that we can refocus the next closest
     * one.
     * @return {?}
     */
    MdChipList.prototype._updateFocusForDestroyedChips = function () {
        var /** @type {?} */ chipsArray = this.chips;
        if (this._lastDestroyedIndex != null && chipsArray.length > 0) {
            // Check whether the destroyed chip was the last item
            var /** @type {?} */ newFocusIndex = Math.min(this._lastDestroyedIndex, chipsArray.length - 1);
            this._keyManager.setActiveItem(newFocusIndex);
            var /** @type {?} */ focusChip = this._keyManager.activeItem;
            // Focus the chip
            if (focusChip) {
                focusChip.focus();
            }
        }
        // Reset our destroyed index
        this._lastDestroyedIndex = null;
    };
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param {?} index The index to be checked.
     * @return {?} True if the index is valid for our list of chips.
     */
    MdChipList.prototype._isValidIndex = function (index) {
        return index >= 0 && index < this.chips.length;
    };
    /**
     * @param {?} element
     * @return {?}
     */
    MdChipList.prototype._isInputEmpty = function (element) {
        if (element && element.nodeName.toLowerCase() === 'input') {
            var /** @type {?} */ input = (element);
            return !input.value;
        }
        return false;
    };
    return MdChipList;
}());
MdChipList.decorators = [
    { type: Component, args: [{ selector: 'md-chip-list, mat-chip-list',
                template: "<div class=\"mat-chip-list-wrapper\"><ng-content></ng-content></div>",
                exportAs: 'mdChipList',
                host: {
                    '[attr.tabindex]': '_tabIndex',
                    'role': 'listbox',
                    '[attr.aria-orientation]': 'ariaOrientation',
                    'class': 'mat-chip-list',
                    '(focus)': 'focus()',
                    '(keydown)': '_keydown($event)'
                },
                queries: {
                    chips: new ContentChildren(MdChip)
                },
                styles: [".mat-chip-list-wrapper{display:flex;flex-direction:row;flex-wrap:wrap;align-items:flex-start}.mat-chip:not(.mat-basic-chip){transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);display:inline-flex;padding:7px 12px;border-radius:24px;align-items:center;cursor:default}.mat-chip:not(.mat-basic-chip)+.mat-chip:not(.mat-basic-chip){margin:0 0 0 8px}[dir=rtl] .mat-chip:not(.mat-basic-chip)+.mat-chip:not(.mat-basic-chip){margin:0 8px 0 0}.mat-form-field-prefix .mat-chip:not(.mat-basic-chip):last-child{margin-right:8px}[dir=rtl] .mat-form-field-prefix .mat-chip:not(.mat-basic-chip):last-child{margin-left:8px}.mat-chip:not(.mat-basic-chip) .mat-chip-remove.mat-icon{width:1em;height:1em}.mat-chip:not(.mat-basic-chip):focus{box-shadow:0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12);outline:0}@media screen and (-ms-high-contrast:active){.mat-chip:not(.mat-basic-chip){outline:solid 1px}}.mat-chip-list-stacked .mat-chip-list-wrapper{display:block}.mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip){display:block;margin:0;margin-bottom:8px}[dir=rtl] .mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip){margin:0;margin-bottom:8px}.mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip):last-child,[dir=rtl] .mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip):last-child{margin-bottom:0}.mat-form-field-prefix .mat-chip-list-wrapper{margin-bottom:8px}.mat-chip-remove{margin-right:-4px;margin-left:6px;cursor:pointer}[dir=rtl] .mat-chip-remove{margin-right:6px;margin-left:-4px}"],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
MdChipList.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: Directionality, decorators: [{ type: Optional },] },
]; };
MdChipList.propDecorators = {
    'ariaOrientation': [{ type: Input, args: ['aria-orientation',] },],
    'selectable': [{ type: Input },],
    'tabIndex': [{ type: Input },],
};
var MdChipInput = (function () {
    /**
     * @param {?} _elementRef
     */
    function MdChipInput(_elementRef) {
        this._elementRef = _elementRef;
        this._addOnBlur = false;
        /**
         * The list of key codes that will trigger a chipEnd event.
         *
         * Defaults to `[ENTER]`.
         */
        // TODO(tinayuangao): Support Set here
        this.separatorKeyCodes = [ENTER];
        /**
         * Emitted when a chip is to be added.
         */
        this.chipEnd = new EventEmitter();
        this._inputElement = this._elementRef.nativeElement;
    }
    Object.defineProperty(MdChipInput.prototype, "chipList", {
        /**
         * Register input for chip list
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value) {
                this._chipList = value;
                this._chipList.registerInput(this._inputElement);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipInput.prototype, "addOnBlur", {
        /**
         * Whether or not the chipEnd event will be emitted when the input is blurred.
         * @return {?}
         */
        get: function () { return this._addOnBlur; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._addOnBlur = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipInput.prototype, "matChipList", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this.chipList = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipInput.prototype, "matAddOnBlur", {
        /**
         * @return {?}
         */
        get: function () { return this._addOnBlur; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this.addOnBlur = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipInput.prototype, "matSeparatorKeyCodes", {
        /**
         * @return {?}
         */
        get: function () { return this.separatorKeyCodes; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.separatorKeyCodes = v; },
        enumerable: true,
        configurable: true
    });
    /**
     * Utility method to make host definition/tests more clear.
     * @param {?=} event
     * @return {?}
     */
    MdChipInput.prototype._keydown = function (event) {
        this._emitChipEnd(event);
    };
    /**
     * Checks to see if the blur should emit the (chipEnd) event.
     * @return {?}
     */
    MdChipInput.prototype._blur = function () {
        if (this.addOnBlur) {
            this._emitChipEnd();
        }
    };
    /**
     * Checks to see if the (chipEnd) event needs to be emitted.
     * @param {?=} event
     * @return {?}
     */
    MdChipInput.prototype._emitChipEnd = function (event) {
        if (!this._inputElement.value && !!event) {
            this._chipList._keydown(event);
        }
        if (!event || this.separatorKeyCodes.indexOf(event.keyCode) > -1) {
            this.chipEnd.emit({ input: this._inputElement, value: this._inputElement.value });
            if (event) {
                event.preventDefault();
            }
        }
    };
    return MdChipInput;
}());
MdChipInput.decorators = [
    { type: Directive, args: [{
                selector: 'input[mdChipInputFor], input[matChipInputFor]',
                host: {
                    'class': 'mat-chip-input',
                    '(keydown)': '_keydown($event)',
                    '(blur)': '_blur()'
                }
            },] },
];
/**
 * @nocollapse
 */
MdChipInput.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
MdChipInput.propDecorators = {
    'chipList': [{ type: Input, args: ['mdChipInputFor',] },],
    'addOnBlur': [{ type: Input, args: ['mdChipInputAddOnBlur',] },],
    'separatorKeyCodes': [{ type: Input, args: ['mdChipInputSeparatorKeyCodes',] },],
    'chipEnd': [{ type: Output, args: ['mdChipInputTokenEnd',] },],
    'matChipList': [{ type: Input, args: ['matChipInputFor',] },],
    'matAddOnBlur': [{ type: Input, args: ['matChipInputAddOnBlur',] },],
    'matSeparatorKeyCodes': [{ type: Input, args: ['matChipInputSeparatorKeyCodes',] },],
};
var MdChipsModule = (function () {
    function MdChipsModule() {
    }
    return MdChipsModule;
}());
MdChipsModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
                exports: [MdChipList, MdChip, MdChipInput, MdChipRemove, MdChipRemove, MdBasicChip],
                declarations: [MdChipList, MdChip, MdChipInput, MdChipRemove, MdChipRemove, MdBasicChip]
            },] },
];
/**
 * @nocollapse
 */
MdChipsModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { MdChipsModule, MdChipList, MdChipBase, _MdChipMixinBase, MdBasicChip, MdChip, MdChipRemove, MdChipInput };
//# sourceMappingURL=chips.es5.js.map
