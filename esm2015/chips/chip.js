/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BACKSPACE, DELETE, SPACE } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Attribute, ChangeDetectorRef, ContentChild, Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Optional, Output, } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, mixinColor, mixinDisableRipple, mixinTabIndex, RippleRenderer, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
/** Event object emitted by MatChip when selected or deselected. */
export class MatChipSelectionChange {
    constructor(
    /** Reference to the chip that emitted the event. */
    source, 
    /** Whether the chip that emitted the event is selected. */
    selected, 
    /** Whether the selection change was a result of a user interaction. */
    isUserInput = false) {
        this.source = source;
        this.selected = selected;
        this.isUserInput = isUserInput;
    }
}
/**
 * Injection token that can be used to reference instances of `MatChipRemove`. It serves as
 * alternative token to the actual `MatChipRemove` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const MAT_CHIP_REMOVE = new InjectionToken('MatChipRemove');
/**
 * Injection token that can be used to reference instances of `MatChipAvatar`. It serves as
 * alternative token to the actual `MatChipAvatar` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const MAT_CHIP_AVATAR = new InjectionToken('MatChipAvatar');
/**
 * Injection token that can be used to reference instances of `MatChipTrailingIcon`. It serves as
 * alternative token to the actual `MatChipTrailingIcon` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const MAT_CHIP_TRAILING_ICON = new InjectionToken('MatChipTrailingIcon');
// Boilerplate for applying mixins to MatChip.
/** @docs-private */
class MatChipBase {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
const _MatChipMixinBase = mixinTabIndex(mixinColor(mixinDisableRipple(MatChipBase), 'primary'), -1);
/**
 * Dummy directive to add CSS class to chip avatar.
 * @docs-private
 */
export class MatChipAvatar {
}
MatChipAvatar.decorators = [
    { type: Directive, args: [{
                selector: 'mat-chip-avatar, [matChipAvatar]',
                host: { 'class': 'mat-chip-avatar' },
                providers: [{ provide: MAT_CHIP_AVATAR, useExisting: MatChipAvatar }]
            },] }
];
/**
 * Dummy directive to add CSS class to chip trailing icon.
 * @docs-private
 */
export class MatChipTrailingIcon {
}
MatChipTrailingIcon.decorators = [
    { type: Directive, args: [{
                selector: 'mat-chip-trailing-icon, [matChipTrailingIcon]',
                host: { 'class': 'mat-chip-trailing-icon' },
                providers: [{ provide: MAT_CHIP_TRAILING_ICON, useExisting: MatChipTrailingIcon }],
            },] }
];
/**
 * Material design styled Chip component. Used inside the MatChipList component.
 */
export class MatChip extends _MatChipMixinBase {
    constructor(_elementRef, _ngZone, platform, globalRippleOptions, _changeDetectorRef, _document, animationMode, tabIndex) {
        super(_elementRef);
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._changeDetectorRef = _changeDetectorRef;
        /** Whether the chip has focus. */
        this._hasFocus = false;
        /** Whether the chip list is selectable */
        this.chipListSelectable = true;
        /** Whether the chip list is in multi-selection mode. */
        this._chipListMultiple = false;
        /** Whether the chip list as a whole is disabled. */
        this._chipListDisabled = false;
        this._selected = false;
        this._selectable = true;
        this._disabled = false;
        this._removable = true;
        /** Emits when the chip is focused. */
        this._onFocus = new Subject();
        /** Emits when the chip is blured. */
        this._onBlur = new Subject();
        /** Emitted when the chip is selected or deselected. */
        this.selectionChange = new EventEmitter();
        /** Emitted when the chip is destroyed. */
        this.destroyed = new EventEmitter();
        /** Emitted when a chip is to be removed. */
        this.removed = new EventEmitter();
        this._addHostClassName();
        // Dynamically create the ripple target, append it within the chip, and use it as the
        // chip's ripple target. Adding the class '.mat-chip-ripple' ensures that it will have
        // the proper styles.
        this._chipRippleTarget = _document.createElement('div');
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
     * @docs-private
     */
    get rippleDisabled() {
        return this.disabled || this.disableRipple || !!this.rippleConfig.disabled;
    }
    /** Whether the chip is selected. */
    get selected() { return this._selected; }
    set selected(value) {
        const coercedValue = coerceBooleanProperty(value);
        if (coercedValue !== this._selected) {
            this._selected = coercedValue;
            this._dispatchSelectionChange();
        }
    }
    /** The value of the chip. Defaults to the content inside `<mat-chip>` tags. */
    get value() {
        return this._value !== undefined
            ? this._value
            : this._elementRef.nativeElement.textContent;
    }
    set value(value) { this._value = value; }
    /**
     * Whether or not the chip is selectable. When a chip is not selectable,
     * changes to its selected state are always ignored. By default a chip is
     * selectable, and it becomes non-selectable if its parent chip list is
     * not selectable.
     */
    get selectable() { return this._selectable && this.chipListSelectable; }
    set selectable(value) {
        this._selectable = coerceBooleanProperty(value);
    }
    /** Whether the chip is disabled. */
    get disabled() { return this._chipListDisabled || this._disabled; }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    /**
     * Determines whether or not the chip displays the remove styling and emits (removed) events.
     */
    get removable() { return this._removable; }
    set removable(value) {
        this._removable = coerceBooleanProperty(value);
    }
    /** The ARIA selected applied to the chip. */
    get ariaSelected() {
        // Remove the `aria-selected` when the chip is deselected in single-selection mode, because
        // it adds noise to NVDA users where "not selected" will be read out for each chip.
        return this.selectable && (this._chipListMultiple || this.selected) ?
            this.selected.toString() : null;
    }
    _addHostClassName() {
        const basicChipAttrName = 'mat-basic-chip';
        const element = this._elementRef.nativeElement;
        if (element.hasAttribute(basicChipAttrName) ||
            element.tagName.toLowerCase() === basicChipAttrName) {
            element.classList.add(basicChipAttrName);
            return;
        }
        else {
            element.classList.add('mat-standard-chip');
        }
    }
    ngOnDestroy() {
        this.destroyed.emit({ chip: this });
        this._chipRipple._removeTriggerEvents();
    }
    /** Selects the chip. */
    select() {
        if (!this._selected) {
            this._selected = true;
            this._dispatchSelectionChange();
            this._changeDetectorRef.markForCheck();
        }
    }
    /** Deselects the chip. */
    deselect() {
        if (this._selected) {
            this._selected = false;
            this._dispatchSelectionChange();
            this._changeDetectorRef.markForCheck();
        }
    }
    /** Select this chip and emit selected event */
    selectViaInteraction() {
        if (!this._selected) {
            this._selected = true;
            this._dispatchSelectionChange(true);
            this._changeDetectorRef.markForCheck();
        }
    }
    /** Toggles the current selected state of this chip. */
    toggleSelected(isUserInput = false) {
        this._selected = !this.selected;
        this._dispatchSelectionChange(isUserInput);
        this._changeDetectorRef.markForCheck();
        return this.selected;
    }
    /** Allows for programmatic focusing of the chip. */
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
     */
    remove() {
        if (this.removable) {
            this.removed.emit({ chip: this });
        }
    }
    /** Handles click events on the chip. */
    _handleClick(event) {
        if (this.disabled) {
            event.preventDefault();
        }
        else {
            event.stopPropagation();
        }
    }
    /** Handle custom key presses. */
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
    _blur() {
        // When animations are enabled, Angular may end up removing the chip from the DOM a little
        // earlier than usual, causing it to be blurred and throwing off the logic in the chip list
        // that moves focus not the next item. To work around the issue, we defer marking the chip
        // as not focused until the next time the zone stabilizes.
        this._ngZone.onStable
            .pipe(take(1))
            .subscribe(() => {
            this._ngZone.run(() => {
                this._hasFocus = false;
                this._onBlur.next({ chip: this });
            });
        });
    }
    _dispatchSelectionChange(isUserInput = false) {
        this.selectionChange.emit({
            source: this,
            isUserInput,
            selected: this._selected
        });
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
MatChip.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: Platform },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_RIPPLE_GLOBAL_OPTIONS,] }] },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] }
];
MatChip.propDecorators = {
    avatar: [{ type: ContentChild, args: [MAT_CHIP_AVATAR,] }],
    trailingIcon: [{ type: ContentChild, args: [MAT_CHIP_TRAILING_ICON,] }],
    removeIcon: [{ type: ContentChild, args: [MAT_CHIP_REMOVE,] }],
    selected: [{ type: Input }],
    value: [{ type: Input }],
    selectable: [{ type: Input }],
    disabled: [{ type: Input }],
    removable: [{ type: Input }],
    selectionChange: [{ type: Output }],
    destroyed: [{ type: Output }],
    removed: [{ type: Output }]
};
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
    constructor(_parentChip, elementRef) {
        this._parentChip = _parentChip;
        if (elementRef.nativeElement.nodeName === 'BUTTON') {
            elementRef.nativeElement.setAttribute('type', 'button');
        }
    }
    /** Calls the parent chip's public `remove()` method if applicable. */
    _handleClick(event) {
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
                },
                providers: [{ provide: MAT_CHIP_REMOVE, useExisting: MatChipRemove }],
            },] }
];
MatChipRemove.ctorParameters = () => [
    { type: MatChip },
    { type: ElementRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy9jaGlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBZSxxQkFBcUIsRUFBYyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZGLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsWUFBWSxFQUNaLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFPTCx5QkFBeUIsRUFDekIsVUFBVSxFQUNWLGtCQUFrQixFQUNsQixhQUFhLEVBR2IsY0FBYyxHQUVmLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFTcEMsbUVBQW1FO0FBQ25FLE1BQU0sT0FBTyxzQkFBc0I7SUFDakM7SUFDRSxvREFBb0Q7SUFDN0MsTUFBZTtJQUN0QiwyREFBMkQ7SUFDcEQsUUFBaUI7SUFDeEIsdUVBQXVFO0lBQ2hFLGNBQWMsS0FBSztRQUpuQixXQUFNLEdBQU4sTUFBTSxDQUFTO1FBRWYsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUVqQixnQkFBVyxHQUFYLFdBQVcs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d0JBSU4sTUFBTTtzQkFHTixNQUFNOztBQWlMVDs7Ozs7Ozs7Ozs7O0dBWUc7QUFTSCxNQUFNLE9BQU8sYUFBYTtJQUN4QixZQUNZLFdBQW9CLEVBQzlCLFVBQW1DO1FBRHpCLGdCQUFXLEdBQVgsV0FBVyxDQUFTO1FBRTlCLElBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO1lBQ2xELFVBQVUsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztTQUN6RDtJQUNGLENBQUM7SUFFRixzRUFBc0U7SUFDdEUsWUFBWSxDQUFDLEtBQVk7UUFDdkIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUVwQyxJQUFJLFVBQVUsQ0FBQyxTQUFTLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFO1lBQ2hELFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNyQjtRQUVELHNGQUFzRjtRQUN0RiwyRkFBMkY7UUFDM0Ysc0ZBQXNGO1FBQ3RGLDBGQUEwRjtRQUMxRiw4REFBOEQ7UUFDOUQsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzFCLENBQUM7OztZQS9CRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSx3Q0FBd0M7b0JBQ2pELFNBQVMsRUFBRSxzQkFBc0I7aUJBQ2xDO2dCQUNELFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFDLENBQUM7YUFDcEU7OztZQUcwQixPQUFPO1lBcmNoQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNhYmxlT3B0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7QkFDS1NQQUNFLCBERUxFVEUsIFNQQUNFfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb250ZW50Q2hpbGQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIENhbkNvbG9yQ3RvcixcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZUN0b3IsXG4gIEhhc1RhYkluZGV4LFxuICBIYXNUYWJJbmRleEN0b3IsXG4gIE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsXG4gIG1peGluQ29sb3IsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5UYWJJbmRleCxcbiAgUmlwcGxlQ29uZmlnLFxuICBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICBSaXBwbGVSZW5kZXJlcixcbiAgUmlwcGxlVGFyZ2V0LFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5cbi8qKiBSZXByZXNlbnRzIGFuIGV2ZW50IGZpcmVkIG9uIGFuIGluZGl2aWR1YWwgYG1hdC1jaGlwYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0Q2hpcEV2ZW50IHtcbiAgLyoqIFRoZSBjaGlwIHRoZSBldmVudCB3YXMgZmlyZWQgb24uICovXG4gIGNoaXA6IE1hdENoaXA7XG59XG5cbi8qKiBFdmVudCBvYmplY3QgZW1pdHRlZCBieSBNYXRDaGlwIHdoZW4gc2VsZWN0ZWQgb3IgZGVzZWxlY3RlZC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRDaGlwU2VsZWN0aW9uQ2hhbmdlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY2hpcCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdENoaXAsXG4gICAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgdGhhdCBlbWl0dGVkIHRoZSBldmVudCBpcyBzZWxlY3RlZC4gKi9cbiAgICBwdWJsaWMgc2VsZWN0ZWQ6IGJvb2xlYW4sXG4gICAgLyoqIFdoZXRoZXIgdGhlIHNlbGVjdGlvbiBjaGFuZ2Ugd2FzIGEgcmVzdWx0IG9mIGEgdXNlciBpbnRlcmFjdGlvbi4gKi9cbiAgICBwdWJsaWMgaXNVc2VySW5wdXQgPSBmYWxzZSkgeyB9XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGluc3RhbmNlcyBvZiBgTWF0Q2hpcFJlbW92ZWAuIEl0IHNlcnZlcyBhc1xuICogYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0Q2hpcFJlbW92ZWAgY2xhc3Mgd2hpY2ggY291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBkaXJlY3RpdmUgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQ0hJUF9SRU1PVkUgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0Q2hpcFJlbW92ZT4oJ01hdENoaXBSZW1vdmUnKTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRDaGlwQXZhdGFyYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRDaGlwQXZhdGFyYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9DSElQX0FWQVRBUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRDaGlwQXZhdGFyPignTWF0Q2hpcEF2YXRhcicpO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYE1hdENoaXBUcmFpbGluZ0ljb25gLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdENoaXBUcmFpbGluZ0ljb25gIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0NISVBfVFJBSUxJTkdfSUNPTiA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdENoaXBUcmFpbGluZ0ljb24+KCdNYXRDaGlwVHJhaWxpbmdJY29uJyk7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0Q2hpcC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5hYnN0cmFjdCBjbGFzcyBNYXRDaGlwQmFzZSB7XG4gIGFic3RyYWN0IGRpc2FibGVkOiBib29sZWFuO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5cbmNvbnN0IF9NYXRDaGlwTWl4aW5CYXNlOiBDYW5Db2xvckN0b3IgJiBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmXG4gICAgSGFzVGFiSW5kZXhDdG9yICYgdHlwZW9mIE1hdENoaXBCYXNlID1cbiAgICAgIG1peGluVGFiSW5kZXgobWl4aW5Db2xvcihtaXhpbkRpc2FibGVSaXBwbGUoTWF0Q2hpcEJhc2UpLCAncHJpbWFyeScpLCAtMSk7XG5cbi8qKlxuICogRHVtbXkgZGlyZWN0aXZlIHRvIGFkZCBDU1MgY2xhc3MgdG8gY2hpcCBhdmF0YXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1jaGlwLWF2YXRhciwgW21hdENoaXBBdmF0YXJdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2hpcC1hdmF0YXInfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9DSElQX0FWQVRBUiwgdXNlRXhpc3Rpbmc6IE1hdENoaXBBdmF0YXJ9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwQXZhdGFyIHt9XG5cbi8qKlxuICogRHVtbXkgZGlyZWN0aXZlIHRvIGFkZCBDU1MgY2xhc3MgdG8gY2hpcCB0cmFpbGluZyBpY29uLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hpcC10cmFpbGluZy1pY29uLCBbbWF0Q2hpcFRyYWlsaW5nSWNvbl0nLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jaGlwLXRyYWlsaW5nLWljb24nfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9DSElQX1RSQUlMSU5HX0lDT04sIHVzZUV4aXN0aW5nOiBNYXRDaGlwVHJhaWxpbmdJY29ufV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXBUcmFpbGluZ0ljb24ge31cblxuXG4vKipcbiAqIE1hdGVyaWFsIGRlc2lnbiBzdHlsZWQgQ2hpcCBjb21wb25lbnQuIFVzZWQgaW5zaWRlIHRoZSBNYXRDaGlwTGlzdCBjb21wb25lbnQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYG1hdC1iYXNpYy1jaGlwLCBbbWF0LWJhc2ljLWNoaXBdLCBtYXQtY2hpcCwgW21hdC1jaGlwXWAsXG4gIGlucHV0czogWydjb2xvcicsICdkaXNhYmxlUmlwcGxlJywgJ3RhYkluZGV4J10sXG4gIGV4cG9ydEFzOiAnbWF0Q2hpcCcsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNoaXAgbWF0LWZvY3VzLWluZGljYXRvcicsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdkaXNhYmxlZCA/IG51bGwgOiB0YWJJbmRleCcsXG4gICAgJ3JvbGUnOiAnb3B0aW9uJyxcbiAgICAnW2NsYXNzLm1hdC1jaGlwLXNlbGVjdGVkXSc6ICdzZWxlY3RlZCcsXG4gICAgJ1tjbGFzcy5tYXQtY2hpcC13aXRoLWF2YXRhcl0nOiAnYXZhdGFyJyxcbiAgICAnW2NsYXNzLm1hdC1jaGlwLXdpdGgtdHJhaWxpbmctaWNvbl0nOiAndHJhaWxpbmdJY29uIHx8IHJlbW92ZUljb24nLFxuICAgICdbY2xhc3MubWF0LWNoaXAtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uc0Rpc2FibGVkJyxcbiAgICAnW2F0dHIuZGlzYWJsZWRdJzogJ2Rpc2FibGVkIHx8IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1zZWxlY3RlZF0nOiAnYXJpYVNlbGVjdGVkJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soJGV2ZW50KScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKGZvY3VzKSc6ICdmb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ19ibHVyKCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwIGV4dGVuZHMgX01hdENoaXBNaXhpbkJhc2UgaW1wbGVtZW50cyBGb2N1c2FibGVPcHRpb24sIE9uRGVzdHJveSwgQ2FuQ29sb3IsXG4gIENhbkRpc2FibGVSaXBwbGUsIFJpcHBsZVRhcmdldCwgSGFzVGFiSW5kZXgge1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIFJpcHBsZVJlbmRlcmVyIGZvciB0aGUgY2hpcC4gKi9cbiAgcHJpdmF0ZSBfY2hpcFJpcHBsZTogUmlwcGxlUmVuZGVyZXI7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCB0aGF0IGFjdHMgYXMgdGhlIGNoaXAncyByaXBwbGUgdGFyZ2V0LiBUaGlzIGVsZW1lbnQgaXNcbiAgICogZHluYW1pY2FsbHkgYWRkZWQgYXMgYSBjaGlsZCBub2RlIG9mIHRoZSBjaGlwLiBUaGUgY2hpcCBpdHNlbGYgY2Fubm90IGJlIHVzZWQgYXMgdGhlXG4gICAqIHJpcHBsZSB0YXJnZXQgYmVjYXVzZSBpdCBtdXN0IGJlIHRoZSBob3N0IG9mIHRoZSBmb2N1cyBpbmRpY2F0b3IuXG4gICAqL1xuICBwcml2YXRlIF9jaGlwUmlwcGxlVGFyZ2V0OiBIVE1MRWxlbWVudDtcblxuICAvKipcbiAgICogUmlwcGxlIGNvbmZpZ3VyYXRpb24gZm9yIHJpcHBsZXMgdGhhdCBhcmUgbGF1bmNoZWQgb24gcG9pbnRlciBkb3duLiBUaGUgcmlwcGxlIGNvbmZpZ1xuICAgKiBpcyBzZXQgdG8gdGhlIGdsb2JhbCByaXBwbGUgb3B0aW9ucyBzaW5jZSB3ZSBkb24ndCBoYXZlIGFueSBjb25maWd1cmFibGUgb3B0aW9ucyBmb3JcbiAgICogdGhlIGNoaXAgcmlwcGxlcy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmlwcGxlQ29uZmlnOiBSaXBwbGVDb25maWcgJiBSaXBwbGVHbG9iYWxPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHJpcHBsZXMgYXJlIGRpc2FibGVkIG9uIGludGVyYWN0aW9uXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCByaXBwbGVEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVSaXBwbGUgfHwgISF0aGlzLnJpcHBsZUNvbmZpZy5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGhhcyBmb2N1cy4gKi9cbiAgX2hhc0ZvY3VzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgYW5pbWF0aW9ucyBmb3IgdGhlIGNoaXAgYXJlIGVuYWJsZWQuICovXG4gIF9hbmltYXRpb25zRGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgbGlzdCBpcyBzZWxlY3RhYmxlICovXG4gIGNoaXBMaXN0U2VsZWN0YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgbGlzdCBpcyBpbiBtdWx0aS1zZWxlY3Rpb24gbW9kZS4gKi9cbiAgX2NoaXBMaXN0TXVsdGlwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBsaXN0IGFzIGEgd2hvbGUgaXMgZGlzYWJsZWQuICovXG4gIF9jaGlwTGlzdERpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLy8gVE9ETzogUmVtb3ZlIGNhc3Qgb25jZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL3B1bGwvMzc1MDYgaXMgYXZhaWxhYmxlLlxuICAvKiogVGhlIGNoaXAgYXZhdGFyICovXG4gIEBDb250ZW50Q2hpbGQoTUFUX0NISVBfQVZBVEFSIGFzIGFueSkgYXZhdGFyOiBNYXRDaGlwQXZhdGFyO1xuXG4gIC8vIFRPRE86IFJlbW92ZSBjYXN0IG9uY2UgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzM3NTA2IGlzIGF2YWlsYWJsZS5cbiAgLyoqIFRoZSBjaGlwJ3MgdHJhaWxpbmcgaWNvbi4gKi9cbiAgQENvbnRlbnRDaGlsZChNQVRfQ0hJUF9UUkFJTElOR19JQ09OIGFzIGFueSkgdHJhaWxpbmdJY29uOiBNYXRDaGlwVHJhaWxpbmdJY29uO1xuXG4gIC8vIFRPRE86IFJlbW92ZSBjYXN0IG9uY2UgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzM3NTA2IGlzIGF2YWlsYWJsZS5cbiAgLyoqIFRoZSBjaGlwJ3MgcmVtb3ZlIHRvZ2dsZXIuICovXG4gIEBDb250ZW50Q2hpbGQoTUFUX0NISVBfUkVNT1ZFIGFzIGFueSkgcmVtb3ZlSWNvbjogTWF0Q2hpcFJlbW92ZTtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBpcyBzZWxlY3RlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7IH1cbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgY29lcmNlZFZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChjb2VyY2VkVmFsdWUgIT09IHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IGNvZXJjZWRWYWx1ZTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG4gIHByb3RlY3RlZCBfc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBjaGlwLiBEZWZhdWx0cyB0byB0aGUgY29udGVudCBpbnNpZGUgYDxtYXQtY2hpcD5gIHRhZ3MuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZSAhPT0gdW5kZWZpbmVkXG4gICAgICA/IHRoaXMuX3ZhbHVlXG4gICAgICA6IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudDtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkgeyB0aGlzLl92YWx1ZSA9IHZhbHVlOyB9XG4gIHByb3RlY3RlZCBfdmFsdWU6IGFueTtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIGNoaXAgaXMgc2VsZWN0YWJsZS4gV2hlbiBhIGNoaXAgaXMgbm90IHNlbGVjdGFibGUsXG4gICAqIGNoYW5nZXMgdG8gaXRzIHNlbGVjdGVkIHN0YXRlIGFyZSBhbHdheXMgaWdub3JlZC4gQnkgZGVmYXVsdCBhIGNoaXAgaXNcbiAgICogc2VsZWN0YWJsZSwgYW5kIGl0IGJlY29tZXMgbm9uLXNlbGVjdGFibGUgaWYgaXRzIHBhcmVudCBjaGlwIGxpc3QgaXNcbiAgICogbm90IHNlbGVjdGFibGUuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0YWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3NlbGVjdGFibGUgJiYgdGhpcy5jaGlwTGlzdFNlbGVjdGFibGU7IH1cbiAgc2V0IHNlbGVjdGFibGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zZWxlY3RhYmxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcm90ZWN0ZWQgX3NlbGVjdGFibGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jaGlwTGlzdERpc2FibGVkIHx8IHRoaXMuX2Rpc2FibGVkOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcm90ZWN0ZWQgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciBvciBub3QgdGhlIGNoaXAgZGlzcGxheXMgdGhlIHJlbW92ZSBzdHlsaW5nIGFuZCBlbWl0cyAocmVtb3ZlZCkgZXZlbnRzLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlbW92YWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3JlbW92YWJsZTsgfVxuICBzZXQgcmVtb3ZhYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVtb3ZhYmxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcm90ZWN0ZWQgX3JlbW92YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNoaXAgaXMgZm9jdXNlZC4gKi9cbiAgcmVhZG9ubHkgX29uRm9jdXMgPSBuZXcgU3ViamVjdDxNYXRDaGlwRXZlbnQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNoaXAgaXMgYmx1cmVkLiAqL1xuICByZWFkb25seSBfb25CbHVyID0gbmV3IFN1YmplY3Q8TWF0Q2hpcEV2ZW50PigpO1xuXG4gIC8qKiBFbWl0dGVkIHdoZW4gdGhlIGNoaXAgaXMgc2VsZWN0ZWQgb3IgZGVzZWxlY3RlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdENoaXBTZWxlY3Rpb25DaGFuZ2U+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcFNlbGVjdGlvbkNoYW5nZT4oKTtcblxuICAvKiogRW1pdHRlZCB3aGVuIHRoZSBjaGlwIGlzIGRlc3Ryb3llZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRlc3Ryb3llZDogRXZlbnRFbWl0dGVyPE1hdENoaXBFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdENoaXBFdmVudD4oKTtcblxuICAvKiogRW1pdHRlZCB3aGVuIGEgY2hpcCBpcyB0byBiZSByZW1vdmVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcmVtb3ZlZDogRXZlbnRFbWl0dGVyPE1hdENoaXBFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdENoaXBFdmVudD4oKTtcblxuICAvKiogVGhlIEFSSUEgc2VsZWN0ZWQgYXBwbGllZCB0byB0aGUgY2hpcC4gKi9cbiAgZ2V0IGFyaWFTZWxlY3RlZCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAvLyBSZW1vdmUgdGhlIGBhcmlhLXNlbGVjdGVkYCB3aGVuIHRoZSBjaGlwIGlzIGRlc2VsZWN0ZWQgaW4gc2luZ2xlLXNlbGVjdGlvbiBtb2RlLCBiZWNhdXNlXG4gICAgLy8gaXQgYWRkcyBub2lzZSB0byBOVkRBIHVzZXJzIHdoZXJlIFwibm90IHNlbGVjdGVkXCIgd2lsbCBiZSByZWFkIG91dCBmb3IgZWFjaCBjaGlwLlxuICAgIHJldHVybiB0aGlzLnNlbGVjdGFibGUgJiYgKHRoaXMuX2NoaXBMaXN0TXVsdGlwbGUgfHwgdGhpcy5zZWxlY3RlZCkgP1xuICAgICAgICB0aGlzLnNlbGVjdGVkLnRvU3RyaW5nKCkgOiBudWxsO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TKVxuICAgICAgICAgICAgICAgICAgZ2xvYmFsUmlwcGxlT3B0aW9uczogUmlwcGxlR2xvYmFsT3B0aW9ucyB8IG51bGwsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4Pzogc3RyaW5nKSB7XG4gICAgc3VwZXIoX2VsZW1lbnRSZWYpO1xuXG4gICAgdGhpcy5fYWRkSG9zdENsYXNzTmFtZSgpO1xuXG4gICAgLy8gRHluYW1pY2FsbHkgY3JlYXRlIHRoZSByaXBwbGUgdGFyZ2V0LCBhcHBlbmQgaXQgd2l0aGluIHRoZSBjaGlwLCBhbmQgdXNlIGl0IGFzIHRoZVxuICAgIC8vIGNoaXAncyByaXBwbGUgdGFyZ2V0LiBBZGRpbmcgdGhlIGNsYXNzICcubWF0LWNoaXAtcmlwcGxlJyBlbnN1cmVzIHRoYXQgaXQgd2lsbCBoYXZlXG4gICAgLy8gdGhlIHByb3BlciBzdHlsZXMuXG4gICAgdGhpcy5fY2hpcFJpcHBsZVRhcmdldCA9IF9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9jaGlwUmlwcGxlVGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ21hdC1jaGlwLXJpcHBsZScpO1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9jaGlwUmlwcGxlVGFyZ2V0KTtcbiAgICB0aGlzLl9jaGlwUmlwcGxlID0gbmV3IFJpcHBsZVJlbmRlcmVyKHRoaXMsIF9uZ1pvbmUsIHRoaXMuX2NoaXBSaXBwbGVUYXJnZXQsIHBsYXRmb3JtKTtcbiAgICB0aGlzLl9jaGlwUmlwcGxlLnNldHVwVHJpZ2dlckV2ZW50cyhfZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLnJpcHBsZUNvbmZpZyA9IGdsb2JhbFJpcHBsZU9wdGlvbnMgfHwge307XG4gICAgdGhpcy5fYW5pbWF0aW9uc0Rpc2FibGVkID0gYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJztcbiAgICB0aGlzLnRhYkluZGV4ID0gdGFiSW5kZXggIT0gbnVsbCA/IChwYXJzZUludCh0YWJJbmRleCkgfHwgLTEpIDogLTE7XG4gIH1cblxuICBfYWRkSG9zdENsYXNzTmFtZSgpIHtcbiAgICBjb25zdCBiYXNpY0NoaXBBdHRyTmFtZSA9ICdtYXQtYmFzaWMtY2hpcCc7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcblxuICAgIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZShiYXNpY0NoaXBBdHRyTmFtZSkgfHxcbiAgICAgICAgZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IGJhc2ljQ2hpcEF0dHJOYW1lKSB7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoYmFzaWNDaGlwQXR0ck5hbWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1zdGFuZGFyZC1jaGlwJyk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5kZXN0cm95ZWQuZW1pdCh7Y2hpcDogdGhpc30pO1xuICAgIHRoaXMuX2NoaXBSaXBwbGUuX3JlbW92ZVRyaWdnZXJFdmVudHMoKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBjaGlwLiAqL1xuICBzZWxlY3QoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXNlbGVjdHMgdGhlIGNoaXAuICovXG4gIGRlc2VsZWN0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogU2VsZWN0IHRoaXMgY2hpcCBhbmQgZW1pdCBzZWxlY3RlZCBldmVudCAqL1xuICBzZWxlY3RWaWFJbnRlcmFjdGlvbigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLl9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZSh0cnVlKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSBjdXJyZW50IHNlbGVjdGVkIHN0YXRlIG9mIHRoaXMgY2hpcC4gKi9cbiAgdG9nZ2xlU2VsZWN0ZWQoaXNVc2VySW5wdXQ6IGJvb2xlYW4gPSBmYWxzZSk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gIXRoaXMuc2VsZWN0ZWQ7XG4gICAgdGhpcy5fZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UoaXNVc2VySW5wdXQpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGVkO1xuICB9XG5cbiAgLyoqIEFsbG93cyBmb3IgcHJvZ3JhbW1hdGljIGZvY3VzaW5nIG9mIHRoZSBjaGlwLiAqL1xuICBmb2N1cygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2hhc0ZvY3VzKSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMuX29uRm9jdXMubmV4dCh7Y2hpcDogdGhpc30pO1xuICAgIH1cbiAgICB0aGlzLl9oYXNGb2N1cyA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIGZvciBwcm9ncmFtbWF0aWMgcmVtb3ZhbCBvZiB0aGUgY2hpcC4gQ2FsbGVkIGJ5IHRoZSBNYXRDaGlwTGlzdCB3aGVuIHRoZSBERUxFVEUgb3JcbiAgICogQkFDS1NQQUNFIGtleXMgYXJlIHByZXNzZWQuXG4gICAqXG4gICAqIEluZm9ybXMgYW55IGxpc3RlbmVycyBvZiB0aGUgcmVtb3ZhbCByZXF1ZXN0LiBEb2VzIG5vdCByZW1vdmUgdGhlIGNoaXAgZnJvbSB0aGUgRE9NLlxuICAgKi9cbiAgcmVtb3ZlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJlbW92YWJsZSkge1xuICAgICAgdGhpcy5yZW1vdmVkLmVtaXQoe2NoaXA6IHRoaXN9KTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBjbGljayBldmVudHMgb24gdGhlIGNoaXAuICovXG4gIF9oYW5kbGVDbGljayhldmVudDogRXZlbnQpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZSBjdXN0b20ga2V5IHByZXNzZXMuICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgREVMRVRFOlxuICAgICAgY2FzZSBCQUNLU1BBQ0U6XG4gICAgICAgIC8vIElmIHdlIGFyZSByZW1vdmFibGUsIHJlbW92ZSB0aGUgZm9jdXNlZCBjaGlwXG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIC8vIEFsd2F5cyBwcmV2ZW50IHNvIHBhZ2UgbmF2aWdhdGlvbiBkb2VzIG5vdCBvY2N1clxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1BBQ0U6XG4gICAgICAgIC8vIElmIHdlIGFyZSBzZWxlY3RhYmxlLCB0b2dnbGUgdGhlIGZvY3VzZWQgY2hpcFxuICAgICAgICBpZiAodGhpcy5zZWxlY3RhYmxlKSB7XG4gICAgICAgICAgdGhpcy50b2dnbGVTZWxlY3RlZCh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsd2F5cyBwcmV2ZW50IHNwYWNlIGZyb20gc2Nyb2xsaW5nIHRoZSBwYWdlIHNpbmNlIHRoZSBsaXN0IGhhcyBmb2N1c1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfYmx1cigpOiB2b2lkIHtcbiAgICAvLyBXaGVuIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWQsIEFuZ3VsYXIgbWF5IGVuZCB1cCByZW1vdmluZyB0aGUgY2hpcCBmcm9tIHRoZSBET00gYSBsaXR0bGVcbiAgICAvLyBlYXJsaWVyIHRoYW4gdXN1YWwsIGNhdXNpbmcgaXQgdG8gYmUgYmx1cnJlZCBhbmQgdGhyb3dpbmcgb2ZmIHRoZSBsb2dpYyBpbiB0aGUgY2hpcCBsaXN0XG4gICAgLy8gdGhhdCBtb3ZlcyBmb2N1cyBub3QgdGhlIG5leHQgaXRlbS4gVG8gd29yayBhcm91bmQgdGhlIGlzc3VlLCB3ZSBkZWZlciBtYXJraW5nIHRoZSBjaGlwXG4gICAgLy8gYXMgbm90IGZvY3VzZWQgdW50aWwgdGhlIG5leHQgdGltZSB0aGUgem9uZSBzdGFiaWxpemVzLlxuICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZVxuICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9oYXNGb2N1cyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuX29uQmx1ci5uZXh0KHtjaGlwOiB0aGlzfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZShpc1VzZXJJbnB1dCA9IGZhbHNlKSB7XG4gICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh7XG4gICAgICBzb3VyY2U6IHRoaXMsXG4gICAgICBpc1VzZXJJbnB1dCxcbiAgICAgIHNlbGVjdGVkOiB0aGlzLl9zZWxlY3RlZFxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zZWxlY3RhYmxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZW1vdmFibGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlUmlwcGxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90YWJJbmRleDogTnVtYmVySW5wdXQ7XG59XG5cbi8qKlxuICogQXBwbGllcyBwcm9wZXIgKGNsaWNrKSBzdXBwb3J0IGFuZCBhZGRzIHN0eWxpbmcgZm9yIHVzZSB3aXRoIHRoZSBNYXRlcmlhbCBEZXNpZ24gXCJjYW5jZWxcIiBpY29uXG4gKiBhdmFpbGFibGUgYXQgaHR0cHM6Ly9tYXRlcmlhbC5pby9pY29ucy8jaWNfY2FuY2VsLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgIGA8bWF0LWNoaXA+XG4gKiAgICAgICA8bWF0LWljb24gbWF0Q2hpcFJlbW92ZT5jYW5jZWw8L21hdC1pY29uPlxuICogICAgIDwvbWF0LWNoaXA+YFxuICpcbiAqIFlvdSAqbWF5KiB1c2UgYSBjdXN0b20gaWNvbiwgYnV0IHlvdSBtYXkgbmVlZCB0byBvdmVycmlkZSB0aGUgYG1hdC1jaGlwLXJlbW92ZWAgcG9zaXRpb25pbmdcbiAqIHN0eWxlcyB0byBwcm9wZXJseSBjZW50ZXIgdGhlIGljb24gd2l0aGluIHRoZSBjaGlwLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0Q2hpcFJlbW92ZV0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jaGlwLXJlbW92ZSBtYXQtY2hpcC10cmFpbGluZy1pY29uJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soJGV2ZW50KScsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfQ0hJUF9SRU1PVkUsIHVzZUV4aXN0aW5nOiBNYXRDaGlwUmVtb3ZlfV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXBSZW1vdmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX3BhcmVudENoaXA6IE1hdENoaXAsXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICBpZiAoZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm5vZGVOYW1lID09PSAnQlVUVE9OJykge1xuICAgICAgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcbiAgICB9XG4gICB9XG5cbiAgLyoqIENhbGxzIHRoZSBwYXJlbnQgY2hpcCdzIHB1YmxpYyBgcmVtb3ZlKClgIG1ldGhvZCBpZiBhcHBsaWNhYmxlLiAqL1xuICBfaGFuZGxlQ2xpY2soZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgcGFyZW50Q2hpcCA9IHRoaXMuX3BhcmVudENoaXA7XG5cbiAgICBpZiAocGFyZW50Q2hpcC5yZW1vdmFibGUgJiYgIXBhcmVudENoaXAuZGlzYWJsZWQpIHtcbiAgICAgIHBhcmVudENoaXAucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0byBzdG9wIGV2ZW50IHByb3BhZ2F0aW9uIGJlY2F1c2Ugb3RoZXJ3aXNlIHRoZSBldmVudCB3aWxsIGJ1YmJsZSB1cCB0byB0aGVcbiAgICAvLyBmb3JtIGZpZWxkIGFuZCBjYXVzZSB0aGUgYG9uQ29udGFpbmVyQ2xpY2tgIG1ldGhvZCB0byBiZSBpbnZva2VkLiBUaGlzIG1ldGhvZCB3b3VsZCB0aGVuXG4gICAgLy8gcmVzZXQgdGhlIGZvY3VzZWQgY2hpcCB0aGF0IGhhcyBiZWVuIGZvY3VzZWQgYWZ0ZXIgY2hpcCByZW1vdmFsLiBVc3VhbGx5IHRoZSBwYXJlbnRcbiAgICAvLyB0aGUgcGFyZW50IGNsaWNrIGxpc3RlbmVyIG9mIHRoZSBgTWF0Q2hpcGAgd291bGQgcHJldmVudCBwcm9wYWdhdGlvbiwgYnV0IGl0IGNhbiBoYXBwZW5cbiAgICAvLyB0aGF0IHRoZSBjaGlwIGlzIGJlaW5nIHJlbW92ZWQgYmVmb3JlIHRoZSBldmVudCBidWJibGVzIHVwLlxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG59XG4iXX0=