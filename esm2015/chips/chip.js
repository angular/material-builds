/**
 * @fileoverview added by tsickle
 * Generated from: src/material/chips/chip.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BACKSPACE, DELETE, SPACE } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import { ContentChild, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, NgZone, Optional, Output, ChangeDetectorRef, Attribute, } from '@angular/core';
import { mixinTabIndex, MAT_RIPPLE_GLOBAL_OPTIONS, mixinColor, mixinDisableRipple, RippleRenderer, } from '@angular/material/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
/**
 * Represents an event fired on an individual `mat-chip`.
 * @record
 */
export function MatChipEvent() { }
if (false) {
    /**
     * The chip the event was fired on.
     * @type {?}
     */
    MatChipEvent.prototype.chip;
}
/**
 * Event object emitted by MatChip when selected or deselected.
 */
export class MatChipSelectionChange {
    /**
     * @param {?} source
     * @param {?} selected
     * @param {?=} isUserInput
     */
    constructor(source, selected, isUserInput = false) {
        this.source = source;
        this.selected = selected;
        this.isUserInput = isUserInput;
    }
}
if (false) {
    /**
     * Reference to the chip that emitted the event.
     * @type {?}
     */
    MatChipSelectionChange.prototype.source;
    /**
     * Whether the chip that emitted the event is selected.
     * @type {?}
     */
    MatChipSelectionChange.prototype.selected;
    /**
     * Whether the selection change was a result of a user interaction.
     * @type {?}
     */
    MatChipSelectionChange.prototype.isUserInput;
}
// Boilerplate for applying mixins to MatChip.
/**
 * \@docs-private
 */
class MatChipBase {
    /**
     * @param {?} _elementRef
     */
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
if (false) {
    /** @type {?} */
    MatChipBase.prototype.disabled;
    /** @type {?} */
    MatChipBase.prototype._elementRef;
}
/** @type {?} */
const _MatChipMixinBase = mixinTabIndex(mixinColor(mixinDisableRipple(MatChipBase), 'primary'), -1);
/**
 * Dummy directive to add CSS class to chip avatar.
 * \@docs-private
 */
export class MatChipAvatar {
}
MatChipAvatar.decorators = [
    { type: Directive, args: [{
                selector: 'mat-chip-avatar, [matChipAvatar]',
                host: { 'class': 'mat-chip-avatar' }
            },] }
];
/**
 * Dummy directive to add CSS class to chip trailing icon.
 * \@docs-private
 */
export class MatChipTrailingIcon {
}
MatChipTrailingIcon.decorators = [
    { type: Directive, args: [{
                selector: 'mat-chip-trailing-icon, [matChipTrailingIcon]',
                host: { 'class': 'mat-chip-trailing-icon' }
            },] }
];
/**
 * Material design styled Chip component. Used inside the MatChipList component.
 */
export class MatChip extends _MatChipMixinBase {
    /**
     * @param {?} _elementRef
     * @param {?} _ngZone
     * @param {?} platform
     * @param {?} globalRippleOptions
     * @param {?=} animationMode
     * @param {?=} _changeDetectorRef
     * @param {?=} tabIndex
     * @param {?=} _document
     */
    constructor(_elementRef, _ngZone, platform, globalRippleOptions, 
    // @breaking-change 8.0.0 `animationMode` parameter to become required.
    animationMode, _changeDetectorRef, tabIndex, 
    // @breaking-change 11.0.0 `_document` parameter to become required.
    _document) {
        super(_elementRef);
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Whether the chip has focus.
         */
        this._hasFocus = false;
        /**
         * Whether the chip list is selectable
         */
        this.chipListSelectable = true;
        /**
         * Whether the chip list is in multi-selection mode.
         */
        this._chipListMultiple = false;
        /**
         * Whether the chip list as a whole is disabled.
         */
        this._chipListDisabled = false;
        this._selected = false;
        this._selectable = true;
        this._disabled = false;
        this._removable = true;
        /**
         * Emits when the chip is focused.
         */
        this._onFocus = new Subject();
        /**
         * Emits when the chip is blured.
         */
        this._onBlur = new Subject();
        /**
         * Emitted when the chip is selected or deselected.
         */
        this.selectionChange = new EventEmitter();
        /**
         * Emitted when the chip is destroyed.
         */
        this.destroyed = new EventEmitter();
        /**
         * Emitted when a chip is to be removed.
         */
        this.removed = new EventEmitter();
        this._addHostClassName();
        // Dynamically create the ripple target, append it within the chip, and use it as the
        // chip's ripple target. Adding the class '.mat-chip-ripple' ensures that it will have
        // the proper styles.
        this._chipRippleTarget = (_document || document).createElement('div');
        this._chipRippleTarget.classList.add('mat-chip-ripple');
        this._elementRef.nativeElement.appendChild(this._chipRippleTarget);
        this._chipRipple = new RippleRenderer(this, _ngZone, this._chipRippleTarget, platform);
        this._chipRipple.setupTriggerEvents(_elementRef);
        this.rippleConfig = globalRippleOptions || {};
        this._animationsDisabled = animationMode === 'NoopAnimations';
        this.tabIndex = tabIndex != null ? (parseInt(tabIndex) || -1) : -1;
    }
    /**
     * Whether ripples are disabled on interaction
     * \@docs-private
     * @return {?}
     */
    get rippleDisabled() {
        return this.disabled || this.disableRipple || !!this.rippleConfig.disabled;
    }
    /**
     * Whether the chip is selected.
     * @return {?}
     */
    get selected() { return this._selected; }
    /**
     * @param {?} value
     * @return {?}
     */
    set selected(value) {
        /** @type {?} */
        const coercedValue = coerceBooleanProperty(value);
        if (coercedValue !== this._selected) {
            this._selected = coercedValue;
            this._dispatchSelectionChange();
        }
    }
    /**
     * The value of the chip. Defaults to the content inside `<mat-chip>` tags.
     * @return {?}
     */
    get value() {
        return this._value !== undefined
            ? this._value
            : this._elementRef.nativeElement.textContent;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set value(value) { this._value = value; }
    /**
     * Whether or not the chip is selectable. When a chip is not selectable,
     * changes to its selected state are always ignored. By default a chip is
     * selectable, and it becomes non-selectable if its parent chip list is
     * not selectable.
     * @return {?}
     */
    get selectable() { return this._selectable && this.chipListSelectable; }
    /**
     * @param {?} value
     * @return {?}
     */
    set selectable(value) {
        this._selectable = coerceBooleanProperty(value);
    }
    /**
     * Whether the chip is disabled.
     * @return {?}
     */
    get disabled() { return this._chipListDisabled || this._disabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    /**
     * Determines whether or not the chip displays the remove styling and emits (removed) events.
     * @return {?}
     */
    get removable() { return this._removable; }
    /**
     * @param {?} value
     * @return {?}
     */
    set removable(value) {
        this._removable = coerceBooleanProperty(value);
    }
    /**
     * The ARIA selected applied to the chip.
     * @return {?}
     */
    get ariaSelected() {
        // Remove the `aria-selected` when the chip is deselected in single-selection mode, because
        // it adds noise to NVDA users where "not selected" will be read out for each chip.
        return this.selectable && (this._chipListMultiple || this.selected) ?
            this.selected.toString() : null;
    }
    /**
     * @return {?}
     */
    _addHostClassName() {
        /** @type {?} */
        const basicChipAttrName = 'mat-basic-chip';
        /** @type {?} */
        const element = (/** @type {?} */ (this._elementRef.nativeElement));
        if (element.hasAttribute(basicChipAttrName) ||
            element.tagName.toLowerCase() === basicChipAttrName) {
            element.classList.add(basicChipAttrName);
            return;
        }
        else {
            element.classList.add('mat-standard-chip');
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.destroyed.emit({ chip: this });
        this._chipRipple._removeTriggerEvents();
    }
    /**
     * Selects the chip.
     * @return {?}
     */
    select() {
        if (!this._selected) {
            this._selected = true;
            this._dispatchSelectionChange();
            this._markForCheck();
        }
    }
    /**
     * Deselects the chip.
     * @return {?}
     */
    deselect() {
        if (this._selected) {
            this._selected = false;
            this._dispatchSelectionChange();
            this._markForCheck();
        }
    }
    /**
     * Select this chip and emit selected event
     * @return {?}
     */
    selectViaInteraction() {
        if (!this._selected) {
            this._selected = true;
            this._dispatchSelectionChange(true);
            this._markForCheck();
        }
    }
    /**
     * Toggles the current selected state of this chip.
     * @param {?=} isUserInput
     * @return {?}
     */
    toggleSelected(isUserInput = false) {
        this._selected = !this.selected;
        this._dispatchSelectionChange(isUserInput);
        this._markForCheck();
        return this.selected;
    }
    /**
     * Allows for programmatic focusing of the chip.
     * @return {?}
     */
    focus() {
        if (!this._hasFocus) {
            this._elementRef.nativeElement.focus();
            this._onFocus.next({ chip: this });
        }
        this._hasFocus = true;
    }
    /**
     * Allows for programmatic removal of the chip. Called by the MatChipList when the DELETE or
     * BACKSPACE keys are pressed.
     *
     * Informs any listeners of the removal request. Does not remove the chip from the DOM.
     * @return {?}
     */
    remove() {
        if (this.removable) {
            this.removed.emit({ chip: this });
        }
    }
    /**
     * Handles click events on the chip.
     * @param {?} event
     * @return {?}
     */
    _handleClick(event) {
        if (this.disabled) {
            event.preventDefault();
        }
        else {
            event.stopPropagation();
        }
    }
    /**
     * Handle custom key presses.
     * @param {?} event
     * @return {?}
     */
    _handleKeydown(event) {
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
                    this.toggleSelected(true);
                }
                // Always prevent space from scrolling the page since the list has focus
                event.preventDefault();
                break;
        }
    }
    /**
     * @return {?}
     */
    _blur() {
        // When animations are enabled, Angular may end up removing the chip from the DOM a little
        // earlier than usual, causing it to be blurred and throwing off the logic in the chip list
        // that moves focus not the next item. To work around the issue, we defer marking the chip
        // as not focused until the next time the zone stabilizes.
        this._ngZone.onStable
            .asObservable()
            .pipe(take(1))
            .subscribe((/**
         * @return {?}
         */
        () => {
            this._ngZone.run((/**
             * @return {?}
             */
            () => {
                this._hasFocus = false;
                this._onBlur.next({ chip: this });
            }));
        }));
    }
    /**
     * @private
     * @param {?=} isUserInput
     * @return {?}
     */
    _dispatchSelectionChange(isUserInput = false) {
        this.selectionChange.emit({
            source: this,
            isUserInput,
            selected: this._selected
        });
    }
    /**
     * @private
     * @return {?}
     */
    _markForCheck() {
        // @breaking-change 9.0.0 Remove this method once the _changeDetectorRef is a required param.
        if (this._changeDetectorRef) {
            this._changeDetectorRef.markForCheck();
        }
    }
}
MatChip.decorators = [
    { type: Directive, args: [{
                selector: `mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]`,
                inputs: ['color', 'disableRipple', 'tabIndex'],
                exportAs: 'matChip',
                host: {
                    'class': 'mat-chip mat-focus-indicator',
                    '[attr.tabindex]': 'disabled ? null : tabIndex',
                    'role': 'option',
                    '[class.mat-chip-selected]': 'selected',
                    '[class.mat-chip-with-avatar]': 'avatar',
                    '[class.mat-chip-with-trailing-icon]': 'trailingIcon || removeIcon',
                    '[class.mat-chip-disabled]': 'disabled',
                    '[class._mat-animation-noopable]': '_animationsDisabled',
                    '[attr.disabled]': 'disabled || null',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.aria-selected]': 'ariaSelected',
                    '(click)': '_handleClick($event)',
                    '(keydown)': '_handleKeydown($event)',
                    '(focus)': 'focus()',
                    '(blur)': '_blur()',
                },
            },] }
];
/** @nocollapse */
MatChip.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: Platform },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_RIPPLE_GLOBAL_OPTIONS,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
    { type: ChangeDetectorRef },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] }
];
MatChip.propDecorators = {
    avatar: [{ type: ContentChild, args: [MatChipAvatar,] }],
    trailingIcon: [{ type: ContentChild, args: [MatChipTrailingIcon,] }],
    removeIcon: [{ type: ContentChild, args: [forwardRef((/**
                 * @return {?}
                 */
                () => MatChipRemove)),] }],
    selected: [{ type: Input }],
    value: [{ type: Input }],
    selectable: [{ type: Input }],
    disabled: [{ type: Input }],
    removable: [{ type: Input }],
    selectionChange: [{ type: Output }],
    destroyed: [{ type: Output }],
    removed: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    MatChip.ngAcceptInputType_selected;
    /** @type {?} */
    MatChip.ngAcceptInputType_selectable;
    /** @type {?} */
    MatChip.ngAcceptInputType_removable;
    /** @type {?} */
    MatChip.ngAcceptInputType_disabled;
    /** @type {?} */
    MatChip.ngAcceptInputType_disableRipple;
    /**
     * Reference to the RippleRenderer for the chip.
     * @type {?}
     * @private
     */
    MatChip.prototype._chipRipple;
    /**
     * Reference to the element that acts as the chip's ripple target. This element is
     * dynamically added as a child node of the chip. The chip itself cannot be used as the
     * ripple target because it must be the host of the focus indicator.
     * @type {?}
     * @private
     */
    MatChip.prototype._chipRippleTarget;
    /**
     * Ripple configuration for ripples that are launched on pointer down. The ripple config
     * is set to the global ripple options since we don't have any configurable options for
     * the chip ripples.
     * \@docs-private
     * @type {?}
     */
    MatChip.prototype.rippleConfig;
    /**
     * Whether the chip has focus.
     * @type {?}
     */
    MatChip.prototype._hasFocus;
    /**
     * Whether animations for the chip are enabled.
     * @type {?}
     */
    MatChip.prototype._animationsDisabled;
    /**
     * Whether the chip list is selectable
     * @type {?}
     */
    MatChip.prototype.chipListSelectable;
    /**
     * Whether the chip list is in multi-selection mode.
     * @type {?}
     */
    MatChip.prototype._chipListMultiple;
    /**
     * Whether the chip list as a whole is disabled.
     * @type {?}
     */
    MatChip.prototype._chipListDisabled;
    /**
     * The chip avatar
     * @type {?}
     */
    MatChip.prototype.avatar;
    /**
     * The chip's trailing icon.
     * @type {?}
     */
    MatChip.prototype.trailingIcon;
    /**
     * The chip's remove toggler.
     * @type {?}
     */
    MatChip.prototype.removeIcon;
    /**
     * @type {?}
     * @protected
     */
    MatChip.prototype._selected;
    /**
     * @type {?}
     * @protected
     */
    MatChip.prototype._value;
    /**
     * @type {?}
     * @protected
     */
    MatChip.prototype._selectable;
    /**
     * @type {?}
     * @protected
     */
    MatChip.prototype._disabled;
    /**
     * @type {?}
     * @protected
     */
    MatChip.prototype._removable;
    /**
     * Emits when the chip is focused.
     * @type {?}
     */
    MatChip.prototype._onFocus;
    /**
     * Emits when the chip is blured.
     * @type {?}
     */
    MatChip.prototype._onBlur;
    /**
     * Emitted when the chip is selected or deselected.
     * @type {?}
     */
    MatChip.prototype.selectionChange;
    /**
     * Emitted when the chip is destroyed.
     * @type {?}
     */
    MatChip.prototype.destroyed;
    /**
     * Emitted when a chip is to be removed.
     * @type {?}
     */
    MatChip.prototype.removed;
    /** @type {?} */
    MatChip.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatChip.prototype._ngZone;
    /**
     * @type {?}
     * @private
     */
    MatChip.prototype._changeDetectorRef;
}
/**
 * Applies proper (click) support and adds styling for use with the Material Design "cancel" icon
 * available at https://material.io/icons/#ic_cancel.
 *
 * Example:
 *
 *     `<mat-chip>
 *       <mat-icon matChipRemove>cancel</mat-icon>
 *     </mat-chip>`
 *
 * You *may* use a custom icon, but you may need to override the `mat-chip-remove` positioning
 * styles to properly center the icon within the chip.
 */
export class MatChipRemove {
    /**
     * @param {?} _parentChip
     * @param {?=} elementRef
     */
    constructor(_parentChip, 
    // @breaking-change 11.0.0 `elementRef` parameter to be made required.
    elementRef) {
        this._parentChip = _parentChip;
        // @breaking-change 11.0.0 Remove null check for `elementRef`.
        if (elementRef && elementRef.nativeElement.nodeName === 'BUTTON') {
            elementRef.nativeElement.setAttribute('type', 'button');
        }
    }
    /**
     * Calls the parent chip's public `remove()` method if applicable.
     * @param {?} event
     * @return {?}
     */
    _handleClick(event) {
        /** @type {?} */
        const parentChip = this._parentChip;
        if (parentChip.removable && !parentChip.disabled) {
            parentChip.remove();
        }
        // We need to stop event propagation because otherwise the event will bubble up to the
        // form field and cause the `onContainerClick` method to be invoked. This method would then
        // reset the focused chip that has been focused after chip removal. Usually the parent
        // the parent click listener of the `MatChip` would prevent propagation, but it can happen
        // that the chip is being removed before the event bubbles up.
        event.stopPropagation();
    }
}
MatChipRemove.decorators = [
    { type: Directive, args: [{
                selector: '[matChipRemove]',
                host: {
                    'class': 'mat-chip-remove mat-chip-trailing-icon',
                    '(click)': '_handleClick($event)',
                }
            },] }
];
/** @nocollapse */
MatChipRemove.ctorParameters = () => [
    { type: MatChip },
    { type: ElementRef }
];
if (false) {
    /**
     * @type {?}
     * @protected
     */
    MatChipRemove.prototype._parentChip;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy9jaGlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QyxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUNMLFlBQVksRUFDWixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFPTCxhQUFhLEVBQ2IseUJBQXlCLEVBQ3pCLFVBQVUsRUFDVixrQkFBa0IsRUFHbEIsY0FBYyxHQUVmLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7Ozs7O0FBSTNFLGtDQUdDOzs7Ozs7SUFEQyw0QkFBYzs7Ozs7QUFJaEIsTUFBTSxPQUFPLHNCQUFzQjs7Ozs7O0lBQ2pDLFlBRVMsTUFBZSxFQUVmLFFBQWlCLEVBRWpCLGNBQWMsS0FBSztRQUpuQixXQUFNLEdBQU4sTUFBTSxDQUFTO1FBRWYsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUVqQixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtJQUFJLENBQUM7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QXFDOzs7OztJQUdyQywyQkFBZ0Q7Ozs7O0lBR2hELDBCQUErQzs7Ozs7SUFHL0Msa0NBQytDOzs7OztJQUcvQyw0QkFBNEY7Ozs7O0lBRzVGLDBCQUEwRjs7SUFVOUUsOEJBQTJDOzs7OztJQUMzQywwQkFBdUI7Ozs7O0lBT3ZCLHFDQUE4Qzs7Ozs7Ozs7Ozs7Ozs7O0FBOEw1RCxNQUFNLE9BQU8sYUFBYTs7Ozs7SUFDeEIsWUFDWSxXQUFvQjtJQUM5QixzRUFBc0U7SUFDdEUsVUFBb0M7UUFGMUIsZ0JBQVcsR0FBWCxXQUFXLENBQVM7UUFJNUIsOERBQThEO1FBQ2hFLElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtZQUNoRSxVQUFVLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDekQ7SUFDRixDQUFDOzs7Ozs7SUFHRixZQUFZLENBQUMsS0FBWTs7Y0FDakIsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXO1FBRW5DLElBQUksVUFBVSxDQUFDLFNBQVMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUU7WUFDaEQsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JCO1FBRUQsc0ZBQXNGO1FBQ3RGLDJGQUEyRjtRQUMzRixzRkFBc0Y7UUFDdEYsMEZBQTBGO1FBQzFGLDhEQUE4RDtRQUM5RCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDMUIsQ0FBQzs7O1lBakNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLHdDQUF3QztvQkFDakQsU0FBUyxFQUFFLHNCQUFzQjtpQkFDbEM7YUFDRjs7OztZQUcwQixPQUFPO1lBdGJoQyxVQUFVOzs7Ozs7O0lBc2JSLG9DQUE4QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtGb2N1c2FibGVPcHRpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0JBQ0tTUEFDRSwgREVMRVRFLCBTUEFDRX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1xuICBDb250ZW50Q2hpbGQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIEF0dHJpYnV0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5Db2xvcixcbiAgQ2FuQ29sb3JDdG9yLFxuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBDYW5EaXNhYmxlUmlwcGxlQ3RvcixcbiAgSGFzVGFiSW5kZXgsXG4gIEhhc1RhYkluZGV4Q3RvcixcbiAgbWl4aW5UYWJJbmRleCxcbiAgTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUyxcbiAgbWl4aW5Db2xvcixcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBSaXBwbGVDb25maWcsXG4gIFJpcHBsZUdsb2JhbE9wdGlvbnMsXG4gIFJpcHBsZVJlbmRlcmVyLFxuICBSaXBwbGVUYXJnZXQsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cblxuLyoqIFJlcHJlc2VudHMgYW4gZXZlbnQgZmlyZWQgb24gYW4gaW5kaXZpZHVhbCBgbWF0LWNoaXBgLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRDaGlwRXZlbnQge1xuICAvKiogVGhlIGNoaXAgdGhlIGV2ZW50IHdhcyBmaXJlZCBvbi4gKi9cbiAgY2hpcDogTWF0Q2hpcDtcbn1cblxuLyoqIEV2ZW50IG9iamVjdCBlbWl0dGVkIGJ5IE1hdENoaXAgd2hlbiBzZWxlY3RlZCBvciBkZXNlbGVjdGVkLiAqL1xuZXhwb3J0IGNsYXNzIE1hdENoaXBTZWxlY3Rpb25DaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjaGlwIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0Q2hpcCxcbiAgICAvKiogV2hldGhlciB0aGUgY2hpcCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50IGlzIHNlbGVjdGVkLiAqL1xuICAgIHB1YmxpYyBzZWxlY3RlZDogYm9vbGVhbixcbiAgICAvKiogV2hldGhlciB0aGUgc2VsZWN0aW9uIGNoYW5nZSB3YXMgYSByZXN1bHQgb2YgYSB1c2VyIGludGVyYWN0aW9uLiAqL1xuICAgIHB1YmxpYyBpc1VzZXJJbnB1dCA9IGZhbHNlKSB7IH1cbn1cblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdENoaXAuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0Q2hpcEJhc2Uge1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxufVxuXG5jb25zdCBfTWF0Q2hpcE1peGluQmFzZTogQ2FuQ29sb3JDdG9yICYgQ2FuRGlzYWJsZVJpcHBsZUN0b3IgJlxuICAgIEhhc1RhYkluZGV4Q3RvciAmIHR5cGVvZiBNYXRDaGlwQmFzZSA9XG4gICAgICBtaXhpblRhYkluZGV4KG1peGluQ29sb3IobWl4aW5EaXNhYmxlUmlwcGxlKE1hdENoaXBCYXNlKSwgJ3ByaW1hcnknKSwgLTEpO1xuXG4vKipcbiAqIER1bW15IGRpcmVjdGl2ZSB0byBhZGQgQ1NTIGNsYXNzIHRvIGNoaXAgYXZhdGFyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hpcC1hdmF0YXIsIFttYXRDaGlwQXZhdGFyXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNoaXAtYXZhdGFyJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcEF2YXRhciB7fVxuXG4vKipcbiAqIER1bW15IGRpcmVjdGl2ZSB0byBhZGQgQ1NTIGNsYXNzIHRvIGNoaXAgdHJhaWxpbmcgaWNvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWNoaXAtdHJhaWxpbmctaWNvbiwgW21hdENoaXBUcmFpbGluZ0ljb25dJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2hpcC10cmFpbGluZy1pY29uJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcFRyYWlsaW5nSWNvbiB7fVxuXG4vKipcbiAqIE1hdGVyaWFsIGRlc2lnbiBzdHlsZWQgQ2hpcCBjb21wb25lbnQuIFVzZWQgaW5zaWRlIHRoZSBNYXRDaGlwTGlzdCBjb21wb25lbnQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYG1hdC1iYXNpYy1jaGlwLCBbbWF0LWJhc2ljLWNoaXBdLCBtYXQtY2hpcCwgW21hdC1jaGlwXWAsXG4gIGlucHV0czogWydjb2xvcicsICdkaXNhYmxlUmlwcGxlJywgJ3RhYkluZGV4J10sXG4gIGV4cG9ydEFzOiAnbWF0Q2hpcCcsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNoaXAgbWF0LWZvY3VzLWluZGljYXRvcicsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdkaXNhYmxlZCA/IG51bGwgOiB0YWJJbmRleCcsXG4gICAgJ3JvbGUnOiAnb3B0aW9uJyxcbiAgICAnW2NsYXNzLm1hdC1jaGlwLXNlbGVjdGVkXSc6ICdzZWxlY3RlZCcsXG4gICAgJ1tjbGFzcy5tYXQtY2hpcC13aXRoLWF2YXRhcl0nOiAnYXZhdGFyJyxcbiAgICAnW2NsYXNzLm1hdC1jaGlwLXdpdGgtdHJhaWxpbmctaWNvbl0nOiAndHJhaWxpbmdJY29uIHx8IHJlbW92ZUljb24nLFxuICAgICdbY2xhc3MubWF0LWNoaXAtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uc0Rpc2FibGVkJyxcbiAgICAnW2F0dHIuZGlzYWJsZWRdJzogJ2Rpc2FibGVkIHx8IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1zZWxlY3RlZF0nOiAnYXJpYVNlbGVjdGVkJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soJGV2ZW50KScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKGZvY3VzKSc6ICdmb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ19ibHVyKCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwIGV4dGVuZHMgX01hdENoaXBNaXhpbkJhc2UgaW1wbGVtZW50cyBGb2N1c2FibGVPcHRpb24sIE9uRGVzdHJveSwgQ2FuQ29sb3IsXG4gIENhbkRpc2FibGVSaXBwbGUsIFJpcHBsZVRhcmdldCwgSGFzVGFiSW5kZXgge1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIFJpcHBsZVJlbmRlcmVyIGZvciB0aGUgY2hpcC4gKi9cbiAgcHJpdmF0ZSBfY2hpcFJpcHBsZTogUmlwcGxlUmVuZGVyZXI7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCB0aGF0IGFjdHMgYXMgdGhlIGNoaXAncyByaXBwbGUgdGFyZ2V0LiBUaGlzIGVsZW1lbnQgaXNcbiAgICogZHluYW1pY2FsbHkgYWRkZWQgYXMgYSBjaGlsZCBub2RlIG9mIHRoZSBjaGlwLiBUaGUgY2hpcCBpdHNlbGYgY2Fubm90IGJlIHVzZWQgYXMgdGhlXG4gICAqIHJpcHBsZSB0YXJnZXQgYmVjYXVzZSBpdCBtdXN0IGJlIHRoZSBob3N0IG9mIHRoZSBmb2N1cyBpbmRpY2F0b3IuXG4gICAqL1xuICBwcml2YXRlIF9jaGlwUmlwcGxlVGFyZ2V0OiBIVE1MRWxlbWVudDtcblxuICAvKipcbiAgICogUmlwcGxlIGNvbmZpZ3VyYXRpb24gZm9yIHJpcHBsZXMgdGhhdCBhcmUgbGF1bmNoZWQgb24gcG9pbnRlciBkb3duLiBUaGUgcmlwcGxlIGNvbmZpZ1xuICAgKiBpcyBzZXQgdG8gdGhlIGdsb2JhbCByaXBwbGUgb3B0aW9ucyBzaW5jZSB3ZSBkb24ndCBoYXZlIGFueSBjb25maWd1cmFibGUgb3B0aW9ucyBmb3JcbiAgICogdGhlIGNoaXAgcmlwcGxlcy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmlwcGxlQ29uZmlnOiBSaXBwbGVDb25maWcgJiBSaXBwbGVHbG9iYWxPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHJpcHBsZXMgYXJlIGRpc2FibGVkIG9uIGludGVyYWN0aW9uXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCByaXBwbGVEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVSaXBwbGUgfHwgISF0aGlzLnJpcHBsZUNvbmZpZy5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGhhcyBmb2N1cy4gKi9cbiAgX2hhc0ZvY3VzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgYW5pbWF0aW9ucyBmb3IgdGhlIGNoaXAgYXJlIGVuYWJsZWQuICovXG4gIF9hbmltYXRpb25zRGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgbGlzdCBpcyBzZWxlY3RhYmxlICovXG4gIGNoaXBMaXN0U2VsZWN0YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgbGlzdCBpcyBpbiBtdWx0aS1zZWxlY3Rpb24gbW9kZS4gKi9cbiAgX2NoaXBMaXN0TXVsdGlwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBsaXN0IGFzIGEgd2hvbGUgaXMgZGlzYWJsZWQuICovXG4gIF9jaGlwTGlzdERpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBjaGlwIGF2YXRhciAqL1xuICBAQ29udGVudENoaWxkKE1hdENoaXBBdmF0YXIpIGF2YXRhcjogTWF0Q2hpcEF2YXRhcjtcblxuICAvKiogVGhlIGNoaXAncyB0cmFpbGluZyBpY29uLiAqL1xuICBAQ29udGVudENoaWxkKE1hdENoaXBUcmFpbGluZ0ljb24pIHRyYWlsaW5nSWNvbjogTWF0Q2hpcFRyYWlsaW5nSWNvbjtcblxuICAvKiogVGhlIGNoaXAncyByZW1vdmUgdG9nZ2xlci4gKi9cbiAgQENvbnRlbnRDaGlsZChmb3J3YXJkUmVmKCgpID0+IE1hdENoaXBSZW1vdmUpKSByZW1vdmVJY29uOiBNYXRDaGlwUmVtb3ZlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGlzIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9zZWxlY3RlZDsgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBjb2VyY2VkVmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKGNvZXJjZWRWYWx1ZSAhPT0gdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gY29lcmNlZFZhbHVlO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cbiAgcHJvdGVjdGVkIF9zZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhlIGNoaXAuIERlZmF1bHRzIHRvIHRoZSBjb250ZW50IGluc2lkZSBgPG1hdC1jaGlwPmAgdGFncy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlICE9PSB1bmRlZmluZWRcbiAgICAgID8gdGhpcy5fdmFsdWVcbiAgICAgIDogdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnRleHRDb250ZW50O1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7IHRoaXMuX3ZhbHVlID0gdmFsdWU7IH1cbiAgcHJvdGVjdGVkIF92YWx1ZTogYW55O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgY2hpcCBpcyBzZWxlY3RhYmxlLiBXaGVuIGEgY2hpcCBpcyBub3Qgc2VsZWN0YWJsZSxcbiAgICogY2hhbmdlcyB0byBpdHMgc2VsZWN0ZWQgc3RhdGUgYXJlIGFsd2F5cyBpZ25vcmVkLiBCeSBkZWZhdWx0IGEgY2hpcCBpc1xuICAgKiBzZWxlY3RhYmxlLCBhbmQgaXQgYmVjb21lcyBub24tc2VsZWN0YWJsZSBpZiBpdHMgcGFyZW50IGNoaXAgbGlzdCBpc1xuICAgKiBub3Qgc2VsZWN0YWJsZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RhYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fc2VsZWN0YWJsZSAmJiB0aGlzLmNoaXBMaXN0U2VsZWN0YWJsZTsgfVxuICBzZXQgc2VsZWN0YWJsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3NlbGVjdGFibGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfc2VsZWN0YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NoaXBMaXN0RGlzYWJsZWQgfHwgdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgY2hpcCBkaXNwbGF5cyB0aGUgcmVtb3ZlIHN0eWxpbmcgYW5kIGVtaXRzIChyZW1vdmVkKSBldmVudHMuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVtb3ZhYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fcmVtb3ZhYmxlOyB9XG4gIHNldCByZW1vdmFibGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZW1vdmFibGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfcmVtb3ZhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY2hpcCBpcyBmb2N1c2VkLiAqL1xuICByZWFkb25seSBfb25Gb2N1cyA9IG5ldyBTdWJqZWN0PE1hdENoaXBFdmVudD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY2hpcCBpcyBibHVyZWQuICovXG4gIHJlYWRvbmx5IF9vbkJsdXIgPSBuZXcgU3ViamVjdDxNYXRDaGlwRXZlbnQ+KCk7XG5cbiAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgY2hpcCBpcyBzZWxlY3RlZCBvciBkZXNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcFNlbGVjdGlvbkNoYW5nZT4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRDaGlwU2VsZWN0aW9uQ2hhbmdlPigpO1xuXG4gIC8qKiBFbWl0dGVkIHdoZW4gdGhlIGNoaXAgaXMgZGVzdHJveWVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZGVzdHJveWVkOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PigpO1xuXG4gIC8qKiBFbWl0dGVkIHdoZW4gYSBjaGlwIGlzIHRvIGJlIHJlbW92ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSByZW1vdmVkOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PigpO1xuXG4gIC8qKiBUaGUgQVJJQSBzZWxlY3RlZCBhcHBsaWVkIHRvIHRoZSBjaGlwLiAqL1xuICBnZXQgYXJpYVNlbGVjdGVkKCk6IHN0cmluZyB8IG51bGwge1xuICAgIC8vIFJlbW92ZSB0aGUgYGFyaWEtc2VsZWN0ZWRgIHdoZW4gdGhlIGNoaXAgaXMgZGVzZWxlY3RlZCBpbiBzaW5nbGUtc2VsZWN0aW9uIG1vZGUsIGJlY2F1c2VcbiAgICAvLyBpdCBhZGRzIG5vaXNlIHRvIE5WREEgdXNlcnMgd2hlcmUgXCJub3Qgc2VsZWN0ZWRcIiB3aWxsIGJlIHJlYWQgb3V0IGZvciBlYWNoIGNoaXAuXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0YWJsZSAmJiAodGhpcy5fY2hpcExpc3RNdWx0aXBsZSB8fCB0aGlzLnNlbGVjdGVkKSA/XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQudG9TdHJpbmcoKSA6IG51bGw7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpXG4gICAgICAgICAgICAgIGdsb2JhbFJpcHBsZU9wdGlvbnM6IFJpcHBsZUdsb2JhbE9wdGlvbnMgfCBudWxsLFxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIGBhbmltYXRpb25Nb2RlYCBwYXJhbWV0ZXIgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgICAgICAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBgX2NoYW5nZURldGVjdG9yUmVmYCBwYXJhbWV0ZXIgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZj86IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4Pzogc3RyaW5nLFxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDExLjAuMCBgX2RvY3VtZW50YCBwYXJhbWV0ZXIgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBfZG9jdW1lbnQ/OiBhbnkpIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLl9hZGRIb3N0Q2xhc3NOYW1lKCk7XG5cbiAgICAvLyBEeW5hbWljYWxseSBjcmVhdGUgdGhlIHJpcHBsZSB0YXJnZXQsIGFwcGVuZCBpdCB3aXRoaW4gdGhlIGNoaXAsIGFuZCB1c2UgaXQgYXMgdGhlXG4gICAgLy8gY2hpcCdzIHJpcHBsZSB0YXJnZXQuIEFkZGluZyB0aGUgY2xhc3MgJy5tYXQtY2hpcC1yaXBwbGUnIGVuc3VyZXMgdGhhdCBpdCB3aWxsIGhhdmVcbiAgICAvLyB0aGUgcHJvcGVyIHN0eWxlcy5cbiAgICB0aGlzLl9jaGlwUmlwcGxlVGFyZ2V0ID0gKF9kb2N1bWVudCB8fCBkb2N1bWVudCkuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5fY2hpcFJpcHBsZVRhcmdldC5jbGFzc0xpc3QuYWRkKCdtYXQtY2hpcC1yaXBwbGUnKTtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fY2hpcFJpcHBsZVRhcmdldCk7XG4gICAgdGhpcy5fY2hpcFJpcHBsZSA9IG5ldyBSaXBwbGVSZW5kZXJlcih0aGlzLCBfbmdab25lLCB0aGlzLl9jaGlwUmlwcGxlVGFyZ2V0LCBwbGF0Zm9ybSk7XG4gICAgdGhpcy5fY2hpcFJpcHBsZS5zZXR1cFRyaWdnZXJFdmVudHMoX2VsZW1lbnRSZWYpO1xuXG4gICAgdGhpcy5yaXBwbGVDb25maWcgPSBnbG9iYWxSaXBwbGVPcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCA9IGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucyc7XG4gICAgdGhpcy50YWJJbmRleCA9IHRhYkluZGV4ICE9IG51bGwgPyAocGFyc2VJbnQodGFiSW5kZXgpIHx8IC0xKSA6IC0xO1xuICB9XG5cbiAgX2FkZEhvc3RDbGFzc05hbWUoKSB7XG4gICAgY29uc3QgYmFzaWNDaGlwQXR0ck5hbWUgPSAnbWF0LWJhc2ljLWNoaXAnO1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICBpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoYmFzaWNDaGlwQXR0ck5hbWUpIHx8XG4gICAgICAgIGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBiYXNpY0NoaXBBdHRyTmFtZSkge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGJhc2ljQ2hpcEF0dHJOYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtc3RhbmRhcmQtY2hpcCcpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveWVkLmVtaXQoe2NoaXA6IHRoaXN9KTtcbiAgICB0aGlzLl9jaGlwUmlwcGxlLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG4gIH1cblxuICAvKiogU2VsZWN0cyB0aGUgY2hpcC4gKi9cbiAgc2VsZWN0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKCk7XG4gICAgICB0aGlzLl9tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogRGVzZWxlY3RzIHRoZSBjaGlwLiAqL1xuICBkZXNlbGVjdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZSgpO1xuICAgICAgdGhpcy5fbWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNlbGVjdCB0aGlzIGNoaXAgYW5kIGVtaXQgc2VsZWN0ZWQgZXZlbnQgKi9cbiAgc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UodHJ1ZSk7XG4gICAgICB0aGlzLl9tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgY3VycmVudCBzZWxlY3RlZCBzdGF0ZSBvZiB0aGlzIGNoaXAuICovXG4gIHRvZ2dsZVNlbGVjdGVkKGlzVXNlcklucHV0OiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcbiAgICB0aGlzLl9zZWxlY3RlZCA9ICF0aGlzLnNlbGVjdGVkO1xuICAgIHRoaXMuX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKGlzVXNlcklucHV0KTtcbiAgICB0aGlzLl9tYXJrRm9yQ2hlY2soKTtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZDtcbiAgfVxuXG4gIC8qKiBBbGxvd3MgZm9yIHByb2dyYW1tYXRpYyBmb2N1c2luZyBvZiB0aGUgY2hpcC4gKi9cbiAgZm9jdXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9oYXNGb2N1cykge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLl9vbkZvY3VzLm5leHQoe2NoaXA6IHRoaXN9KTtcbiAgICB9XG4gICAgdGhpcy5faGFzRm9jdXMgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBmb3IgcHJvZ3JhbW1hdGljIHJlbW92YWwgb2YgdGhlIGNoaXAuIENhbGxlZCBieSB0aGUgTWF0Q2hpcExpc3Qgd2hlbiB0aGUgREVMRVRFIG9yXG4gICAqIEJBQ0tTUEFDRSBrZXlzIGFyZSBwcmVzc2VkLlxuICAgKlxuICAgKiBJbmZvcm1zIGFueSBsaXN0ZW5lcnMgb2YgdGhlIHJlbW92YWwgcmVxdWVzdC4gRG9lcyBub3QgcmVtb3ZlIHRoZSBjaGlwIGZyb20gdGhlIERPTS5cbiAgICovXG4gIHJlbW92ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yZW1vdmFibGUpIHtcbiAgICAgIHRoaXMucmVtb3ZlZC5lbWl0KHtjaGlwOiB0aGlzfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgY2xpY2sgZXZlbnRzIG9uIHRoZSBjaGlwLiAqL1xuICBfaGFuZGxlQ2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGUgY3VzdG9tIGtleSBwcmVzc2VzLiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICBjYXNlIERFTEVURTpcbiAgICAgIGNhc2UgQkFDS1NQQUNFOlxuICAgICAgICAvLyBJZiB3ZSBhcmUgcmVtb3ZhYmxlLCByZW1vdmUgdGhlIGZvY3VzZWQgY2hpcFxuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAvLyBBbHdheXMgcHJldmVudCBzbyBwYWdlIG5hdmlnYXRpb24gZG9lcyBub3Qgb2NjdXJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNQQUNFOlxuICAgICAgICAvLyBJZiB3ZSBhcmUgc2VsZWN0YWJsZSwgdG9nZ2xlIHRoZSBmb2N1c2VkIGNoaXBcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0YWJsZSkge1xuICAgICAgICAgIHRoaXMudG9nZ2xlU2VsZWN0ZWQodHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbHdheXMgcHJldmVudCBzcGFjZSBmcm9tIHNjcm9sbGluZyB0aGUgcGFnZSBzaW5jZSB0aGUgbGlzdCBoYXMgZm9jdXNcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX2JsdXIoKTogdm9pZCB7XG4gICAgLy8gV2hlbiBhbmltYXRpb25zIGFyZSBlbmFibGVkLCBBbmd1bGFyIG1heSBlbmQgdXAgcmVtb3ZpbmcgdGhlIGNoaXAgZnJvbSB0aGUgRE9NIGEgbGl0dGxlXG4gICAgLy8gZWFybGllciB0aGFuIHVzdWFsLCBjYXVzaW5nIGl0IHRvIGJlIGJsdXJyZWQgYW5kIHRocm93aW5nIG9mZiB0aGUgbG9naWMgaW4gdGhlIGNoaXAgbGlzdFxuICAgIC8vIHRoYXQgbW92ZXMgZm9jdXMgbm90IHRoZSBuZXh0IGl0ZW0uIFRvIHdvcmsgYXJvdW5kIHRoZSBpc3N1ZSwgd2UgZGVmZXIgbWFya2luZyB0aGUgY2hpcFxuICAgIC8vIGFzIG5vdCBmb2N1c2VkIHVudGlsIHRoZSBuZXh0IHRpbWUgdGhlIHpvbmUgc3RhYmlsaXplcy5cbiAgICB0aGlzLl9uZ1pvbmUub25TdGFibGVcbiAgICAgIC5hc09ic2VydmFibGUoKVxuICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9oYXNGb2N1cyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuX29uQmx1ci5uZXh0KHtjaGlwOiB0aGlzfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZShpc1VzZXJJbnB1dCA9IGZhbHNlKSB7XG4gICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh7XG4gICAgICBzb3VyY2U6IHRoaXMsXG4gICAgICBpc1VzZXJJbnB1dCxcbiAgICAgIHNlbGVjdGVkOiB0aGlzLl9zZWxlY3RlZFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfbWFya0ZvckNoZWNrKCkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgUmVtb3ZlIHRoaXMgbWV0aG9kIG9uY2UgdGhlIF9jaGFuZ2VEZXRlY3RvclJlZiBpcyBhIHJlcXVpcmVkIHBhcmFtLlxuICAgIGlmICh0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZikge1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zZWxlY3RhYmxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZW1vdmFibGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlUmlwcGxlOiBCb29sZWFuSW5wdXQ7XG59XG5cblxuLyoqXG4gKiBBcHBsaWVzIHByb3BlciAoY2xpY2spIHN1cHBvcnQgYW5kIGFkZHMgc3R5bGluZyBmb3IgdXNlIHdpdGggdGhlIE1hdGVyaWFsIERlc2lnbiBcImNhbmNlbFwiIGljb25cbiAqIGF2YWlsYWJsZSBhdCBodHRwczovL21hdGVyaWFsLmlvL2ljb25zLyNpY19jYW5jZWwuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgYDxtYXQtY2hpcD5cbiAqICAgICAgIDxtYXQtaWNvbiBtYXRDaGlwUmVtb3ZlPmNhbmNlbDwvbWF0LWljb24+XG4gKiAgICAgPC9tYXQtY2hpcD5gXG4gKlxuICogWW91ICptYXkqIHVzZSBhIGN1c3RvbSBpY29uLCBidXQgeW91IG1heSBuZWVkIHRvIG92ZXJyaWRlIHRoZSBgbWF0LWNoaXAtcmVtb3ZlYCBwb3NpdGlvbmluZ1xuICogc3R5bGVzIHRvIHByb3Blcmx5IGNlbnRlciB0aGUgaWNvbiB3aXRoaW4gdGhlIGNoaXAuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRDaGlwUmVtb3ZlXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNoaXAtcmVtb3ZlIG1hdC1jaGlwLXRyYWlsaW5nLWljb24nLFxuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygkZXZlbnQpJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwUmVtb3ZlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIF9wYXJlbnRDaGlwOiBNYXRDaGlwLFxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIGBlbGVtZW50UmVmYCBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZC5cbiAgICBlbGVtZW50UmVmPzogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcblxuICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgUmVtb3ZlIG51bGwgY2hlY2sgZm9yIGBlbGVtZW50UmVmYC5cbiAgICBpZiAoZWxlbWVudFJlZiAmJiBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQubm9kZU5hbWUgPT09ICdCVVRUT04nKSB7XG4gICAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpO1xuICAgIH1cbiAgIH1cblxuICAvKiogQ2FsbHMgdGhlIHBhcmVudCBjaGlwJ3MgcHVibGljIGByZW1vdmUoKWAgbWV0aG9kIGlmIGFwcGxpY2FibGUuICovXG4gIF9oYW5kbGVDbGljayhldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBwYXJlbnRDaGlwID0gdGhpcy5fcGFyZW50Q2hpcDtcblxuICAgIGlmIChwYXJlbnRDaGlwLnJlbW92YWJsZSAmJiAhcGFyZW50Q2hpcC5kaXNhYmxlZCkge1xuICAgICAgcGFyZW50Q2hpcC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRvIHN0b3AgZXZlbnQgcHJvcGFnYXRpb24gYmVjYXVzZSBvdGhlcndpc2UgdGhlIGV2ZW50IHdpbGwgYnViYmxlIHVwIHRvIHRoZVxuICAgIC8vIGZvcm0gZmllbGQgYW5kIGNhdXNlIHRoZSBgb25Db250YWluZXJDbGlja2AgbWV0aG9kIHRvIGJlIGludm9rZWQuIFRoaXMgbWV0aG9kIHdvdWxkIHRoZW5cbiAgICAvLyByZXNldCB0aGUgZm9jdXNlZCBjaGlwIHRoYXQgaGFzIGJlZW4gZm9jdXNlZCBhZnRlciBjaGlwIHJlbW92YWwuIFVzdWFsbHkgdGhlIHBhcmVudFxuICAgIC8vIHRoZSBwYXJlbnQgY2xpY2sgbGlzdGVuZXIgb2YgdGhlIGBNYXRDaGlwYCB3b3VsZCBwcmV2ZW50IHByb3BhZ2F0aW9uLCBidXQgaXQgY2FuIGhhcHBlblxuICAgIC8vIHRoYXQgdGhlIGNoaXAgaXMgYmVpbmcgcmVtb3ZlZCBiZWZvcmUgdGhlIGV2ZW50IGJ1YmJsZXMgdXAuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cbn1cbiJdfQ==