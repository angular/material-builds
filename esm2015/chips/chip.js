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
        return this.disabled || this.disableRipple || this._animationsDisabled ||
            !!this.rippleConfig.disabled;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy9jaGlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBZSxxQkFBcUIsRUFBYyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZGLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsWUFBWSxFQUNaLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFRTCx5QkFBeUIsRUFDekIsVUFBVSxFQUNWLGtCQUFrQixFQUNsQixhQUFhLEVBR2IsY0FBYyxHQUVmLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFTcEMsbUVBQW1FO0FBQ25FLE1BQU0sT0FBTyxzQkFBc0I7SUFDakM7SUFDRSxvREFBb0Q7SUFDN0MsTUFBZTtJQUN0QiwyREFBMkQ7SUFDcEQsUUFBaUI7SUFDeEIsdUVBQXVFO0lBQ2hFLGNBQWMsS0FBSztRQUpuQixXQUFNLEdBQU4sTUFBTSxDQUFTO1FBRWYsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUVqQixnQkFBVyxHQUFYLFdBQVcs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QVVMLEtBQUs7OEJBY0wsTUFBTTt3QkFJTixNQUFNO3NCQUdOLE1BQU07O0FBaUxUOzs7Ozs7Ozs7Ozs7R0FZRztBQVNILE1BQU0sT0FBTyxhQUFhO0lBQ3hCLFlBQ1ksV0FBb0IsRUFDOUIsVUFBbUM7UUFEekIsZ0JBQVcsR0FBWCxXQUFXLENBQVM7UUFFOUIsSUFBSSxVQUFVLENBQUMsYUFBYSxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDbEQsVUFBVSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ3pEO0lBQ0YsQ0FBQztJQUVGLHNFQUFzRTtJQUN0RSxZQUFZLENBQUMsS0FBWTtRQUN2QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRXBDLElBQUksVUFBVSxDQUFDLFNBQVMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUU7WUFDaEQsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JCO1FBRUQsc0ZBQXNGO1FBQ3RGLDJGQUEyRjtRQUMzRixzRkFBc0Y7UUFDdEYsMEZBQTBGO1FBQzFGLDhEQUE4RDtRQUM5RCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDMUIsQ0FBQzs7O1lBL0JGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLHdDQUF3QztvQkFDakQsU0FBUyxFQUFFLHNCQUFzQjtpQkFDbEM7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUMsQ0FBQzthQUNwRTs7O1lBRzBCLE9BQU87WUFuY2hDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c2FibGVPcHRpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHksIE51bWJlcklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtCQUNLU1BBQ0UsIERFTEVURSwgU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbnRlbnRDaGlsZCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5Db2xvcixcbiAgQ2FuQ29sb3JDdG9yLFxuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBDYW5EaXNhYmxlUmlwcGxlQ3RvcixcbiAgSGFzVGFiSW5kZXgsXG4gIEhhc1RhYkluZGV4Q3RvcixcbiAgTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUyxcbiAgbWl4aW5Db2xvcixcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBtaXhpblRhYkluZGV4LFxuICBSaXBwbGVDb25maWcsXG4gIFJpcHBsZUdsb2JhbE9wdGlvbnMsXG4gIFJpcHBsZVJlbmRlcmVyLFxuICBSaXBwbGVUYXJnZXQsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cblxuLyoqIFJlcHJlc2VudHMgYW4gZXZlbnQgZmlyZWQgb24gYW4gaW5kaXZpZHVhbCBgbWF0LWNoaXBgLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRDaGlwRXZlbnQge1xuICAvKiogVGhlIGNoaXAgdGhlIGV2ZW50IHdhcyBmaXJlZCBvbi4gKi9cbiAgY2hpcDogTWF0Q2hpcDtcbn1cblxuLyoqIEV2ZW50IG9iamVjdCBlbWl0dGVkIGJ5IE1hdENoaXAgd2hlbiBzZWxlY3RlZCBvciBkZXNlbGVjdGVkLiAqL1xuZXhwb3J0IGNsYXNzIE1hdENoaXBTZWxlY3Rpb25DaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjaGlwIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0Q2hpcCxcbiAgICAvKiogV2hldGhlciB0aGUgY2hpcCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50IGlzIHNlbGVjdGVkLiAqL1xuICAgIHB1YmxpYyBzZWxlY3RlZDogYm9vbGVhbixcbiAgICAvKiogV2hldGhlciB0aGUgc2VsZWN0aW9uIGNoYW5nZSB3YXMgYSByZXN1bHQgb2YgYSB1c2VyIGludGVyYWN0aW9uLiAqL1xuICAgIHB1YmxpYyBpc1VzZXJJbnB1dCA9IGZhbHNlKSB7IH1cbn1cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRDaGlwUmVtb3ZlYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRDaGlwUmVtb3ZlYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9DSElQX1JFTU9WRSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRDaGlwUmVtb3ZlPignTWF0Q2hpcFJlbW92ZScpO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYE1hdENoaXBBdmF0YXJgLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdENoaXBBdmF0YXJgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0NISVBfQVZBVEFSID0gbmV3IEluamVjdGlvblRva2VuPE1hdENoaXBBdmF0YXI+KCdNYXRDaGlwQXZhdGFyJyk7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGluc3RhbmNlcyBvZiBgTWF0Q2hpcFRyYWlsaW5nSWNvbmAuIEl0IHNlcnZlcyBhc1xuICogYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0Q2hpcFRyYWlsaW5nSWNvbmAgY2xhc3Mgd2hpY2ggY291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBkaXJlY3RpdmUgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQ0hJUF9UUkFJTElOR19JQ09OID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0Q2hpcFRyYWlsaW5nSWNvbj4oJ01hdENoaXBUcmFpbGluZ0ljb24nKTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRDaGlwLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdENoaXBCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxufVxuXG5jb25zdCBfTWF0Q2hpcE1peGluQmFzZTogQ2FuQ29sb3JDdG9yICYgQ2FuRGlzYWJsZVJpcHBsZUN0b3IgJlxuICAgIEhhc1RhYkluZGV4Q3RvciAmIHR5cGVvZiBNYXRDaGlwQmFzZSA9XG4gICAgICBtaXhpblRhYkluZGV4KG1peGluQ29sb3IobWl4aW5EaXNhYmxlUmlwcGxlKE1hdENoaXBCYXNlKSwgJ3ByaW1hcnknKSwgLTEpO1xuXG4vKipcbiAqIER1bW15IGRpcmVjdGl2ZSB0byBhZGQgQ1NTIGNsYXNzIHRvIGNoaXAgYXZhdGFyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hpcC1hdmF0YXIsIFttYXRDaGlwQXZhdGFyXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNoaXAtYXZhdGFyJ30sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfQ0hJUF9BVkFUQVIsIHVzZUV4aXN0aW5nOiBNYXRDaGlwQXZhdGFyfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcEF2YXRhciB7fVxuXG4vKipcbiAqIER1bW15IGRpcmVjdGl2ZSB0byBhZGQgQ1NTIGNsYXNzIHRvIGNoaXAgdHJhaWxpbmcgaWNvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWNoaXAtdHJhaWxpbmctaWNvbiwgW21hdENoaXBUcmFpbGluZ0ljb25dJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2hpcC10cmFpbGluZy1pY29uJ30sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfQ0hJUF9UUkFJTElOR19JQ09OLCB1c2VFeGlzdGluZzogTWF0Q2hpcFRyYWlsaW5nSWNvbn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwVHJhaWxpbmdJY29uIHt9XG5cblxuLyoqXG4gKiBNYXRlcmlhbCBkZXNpZ24gc3R5bGVkIENoaXAgY29tcG9uZW50LiBVc2VkIGluc2lkZSB0aGUgTWF0Q2hpcExpc3QgY29tcG9uZW50LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBtYXQtYmFzaWMtY2hpcCwgW21hdC1iYXNpYy1jaGlwXSwgbWF0LWNoaXAsIFttYXQtY2hpcF1gLFxuICBpbnB1dHM6IFsnY29sb3InLCAnZGlzYWJsZVJpcHBsZScsICd0YWJJbmRleCddLFxuICBleHBvcnRBczogJ21hdENoaXAnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jaGlwIG1hdC1mb2N1cy1pbmRpY2F0b3InLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnZGlzYWJsZWQgPyBudWxsIDogdGFiSW5kZXgnLFxuICAgICdyb2xlJzogJ29wdGlvbicsXG4gICAgJ1tjbGFzcy5tYXQtY2hpcC1zZWxlY3RlZF0nOiAnc2VsZWN0ZWQnLFxuICAgICdbY2xhc3MubWF0LWNoaXAtd2l0aC1hdmF0YXJdJzogJ2F2YXRhcicsXG4gICAgJ1tjbGFzcy5tYXQtY2hpcC13aXRoLXRyYWlsaW5nLWljb25dJzogJ3RyYWlsaW5nSWNvbiB8fCByZW1vdmVJY29uJyxcbiAgICAnW2NsYXNzLm1hdC1jaGlwLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbnNEaXNhYmxlZCcsXG4gICAgJ1thdHRyLmRpc2FibGVkXSc6ICdkaXNhYmxlZCB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtc2VsZWN0ZWRdJzogJ2FyaWFTZWxlY3RlZCcsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCRldmVudCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJyhmb2N1cyknOiAnZm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfYmx1cigpJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcCBleHRlbmRzIF9NYXRDaGlwTWl4aW5CYXNlIGltcGxlbWVudHMgRm9jdXNhYmxlT3B0aW9uLCBPbkRlc3Ryb3ksIENhbkNvbG9yLFxuICBDYW5EaXNhYmxlUmlwcGxlLCBSaXBwbGVUYXJnZXQsIEhhc1RhYkluZGV4LCBDYW5EaXNhYmxlIHtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBSaXBwbGVSZW5kZXJlciBmb3IgdGhlIGNoaXAuICovXG4gIHByaXZhdGUgX2NoaXBSaXBwbGU6IFJpcHBsZVJlbmRlcmVyO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIGVsZW1lbnQgdGhhdCBhY3RzIGFzIHRoZSBjaGlwJ3MgcmlwcGxlIHRhcmdldC4gVGhpcyBlbGVtZW50IGlzXG4gICAqIGR5bmFtaWNhbGx5IGFkZGVkIGFzIGEgY2hpbGQgbm9kZSBvZiB0aGUgY2hpcC4gVGhlIGNoaXAgaXRzZWxmIGNhbm5vdCBiZSB1c2VkIGFzIHRoZVxuICAgKiByaXBwbGUgdGFyZ2V0IGJlY2F1c2UgaXQgbXVzdCBiZSB0aGUgaG9zdCBvZiB0aGUgZm9jdXMgaW5kaWNhdG9yLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hpcFJpcHBsZVRhcmdldDogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIFJpcHBsZSBjb25maWd1cmF0aW9uIGZvciByaXBwbGVzIHRoYXQgYXJlIGxhdW5jaGVkIG9uIHBvaW50ZXIgZG93bi4gVGhlIHJpcHBsZSBjb25maWdcbiAgICogaXMgc2V0IHRvIHRoZSBnbG9iYWwgcmlwcGxlIG9wdGlvbnMgc2luY2Ugd2UgZG9uJ3QgaGF2ZSBhbnkgY29uZmlndXJhYmxlIG9wdGlvbnMgZm9yXG4gICAqIHRoZSBjaGlwIHJpcHBsZXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJpcHBsZUNvbmZpZzogUmlwcGxlQ29uZmlnICYgUmlwcGxlR2xvYmFsT3B0aW9ucztcblxuICAvKipcbiAgICogV2hldGhlciByaXBwbGVzIGFyZSBkaXNhYmxlZCBvbiBpbnRlcmFjdGlvblxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgcmlwcGxlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlUmlwcGxlIHx8IHRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCB8fFxuICAgICAgICAgICAhIXRoaXMucmlwcGxlQ29uZmlnLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgaGFzIGZvY3VzLiAqL1xuICBfaGFzRm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciBhbmltYXRpb25zIGZvciB0aGUgY2hpcCBhcmUgZW5hYmxlZC4gKi9cbiAgX2FuaW1hdGlvbnNEaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBsaXN0IGlzIHNlbGVjdGFibGUgKi9cbiAgY2hpcExpc3RTZWxlY3RhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBsaXN0IGlzIGluIG11bHRpLXNlbGVjdGlvbiBtb2RlLiAqL1xuICBfY2hpcExpc3RNdWx0aXBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGxpc3QgYXMgYSB3aG9sZSBpcyBkaXNhYmxlZC4gKi9cbiAgX2NoaXBMaXN0RGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIGNoaXAgYXZhdGFyICovXG4gIEBDb250ZW50Q2hpbGQoTUFUX0NISVBfQVZBVEFSKSBhdmF0YXI6IE1hdENoaXBBdmF0YXI7XG5cbiAgLyoqIFRoZSBjaGlwJ3MgdHJhaWxpbmcgaWNvbi4gKi9cbiAgQENvbnRlbnRDaGlsZChNQVRfQ0hJUF9UUkFJTElOR19JQ09OKSB0cmFpbGluZ0ljb246IE1hdENoaXBUcmFpbGluZ0ljb247XG5cbiAgLyoqIFRoZSBjaGlwJ3MgcmVtb3ZlIHRvZ2dsZXIuICovXG4gIEBDb250ZW50Q2hpbGQoTUFUX0NISVBfUkVNT1ZFKSByZW1vdmVJY29uOiBNYXRDaGlwUmVtb3ZlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGlzIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9zZWxlY3RlZDsgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBjb2VyY2VkVmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKGNvZXJjZWRWYWx1ZSAhPT0gdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gY29lcmNlZFZhbHVlO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cbiAgcHJvdGVjdGVkIF9zZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhlIGNoaXAuIERlZmF1bHRzIHRvIHRoZSBjb250ZW50IGluc2lkZSBgPG1hdC1jaGlwPmAgdGFncy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlICE9PSB1bmRlZmluZWRcbiAgICAgID8gdGhpcy5fdmFsdWVcbiAgICAgIDogdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnRleHRDb250ZW50O1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7IHRoaXMuX3ZhbHVlID0gdmFsdWU7IH1cbiAgcHJvdGVjdGVkIF92YWx1ZTogYW55O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgY2hpcCBpcyBzZWxlY3RhYmxlLiBXaGVuIGEgY2hpcCBpcyBub3Qgc2VsZWN0YWJsZSxcbiAgICogY2hhbmdlcyB0byBpdHMgc2VsZWN0ZWQgc3RhdGUgYXJlIGFsd2F5cyBpZ25vcmVkLiBCeSBkZWZhdWx0IGEgY2hpcCBpc1xuICAgKiBzZWxlY3RhYmxlLCBhbmQgaXQgYmVjb21lcyBub24tc2VsZWN0YWJsZSBpZiBpdHMgcGFyZW50IGNoaXAgbGlzdCBpc1xuICAgKiBub3Qgc2VsZWN0YWJsZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RhYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fc2VsZWN0YWJsZSAmJiB0aGlzLmNoaXBMaXN0U2VsZWN0YWJsZTsgfVxuICBzZXQgc2VsZWN0YWJsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3NlbGVjdGFibGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfc2VsZWN0YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NoaXBMaXN0RGlzYWJsZWQgfHwgdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgY2hpcCBkaXNwbGF5cyB0aGUgcmVtb3ZlIHN0eWxpbmcgYW5kIGVtaXRzIChyZW1vdmVkKSBldmVudHMuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVtb3ZhYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fcmVtb3ZhYmxlOyB9XG4gIHNldCByZW1vdmFibGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZW1vdmFibGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfcmVtb3ZhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY2hpcCBpcyBmb2N1c2VkLiAqL1xuICByZWFkb25seSBfb25Gb2N1cyA9IG5ldyBTdWJqZWN0PE1hdENoaXBFdmVudD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY2hpcCBpcyBibHVyZWQuICovXG4gIHJlYWRvbmx5IF9vbkJsdXIgPSBuZXcgU3ViamVjdDxNYXRDaGlwRXZlbnQ+KCk7XG5cbiAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgY2hpcCBpcyBzZWxlY3RlZCBvciBkZXNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcFNlbGVjdGlvbkNoYW5nZT4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRDaGlwU2VsZWN0aW9uQ2hhbmdlPigpO1xuXG4gIC8qKiBFbWl0dGVkIHdoZW4gdGhlIGNoaXAgaXMgZGVzdHJveWVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZGVzdHJveWVkOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PigpO1xuXG4gIC8qKiBFbWl0dGVkIHdoZW4gYSBjaGlwIGlzIHRvIGJlIHJlbW92ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSByZW1vdmVkOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PigpO1xuXG4gIC8qKiBUaGUgQVJJQSBzZWxlY3RlZCBhcHBsaWVkIHRvIHRoZSBjaGlwLiAqL1xuICBnZXQgYXJpYVNlbGVjdGVkKCk6IHN0cmluZyB8IG51bGwge1xuICAgIC8vIFJlbW92ZSB0aGUgYGFyaWEtc2VsZWN0ZWRgIHdoZW4gdGhlIGNoaXAgaXMgZGVzZWxlY3RlZCBpbiBzaW5nbGUtc2VsZWN0aW9uIG1vZGUsIGJlY2F1c2VcbiAgICAvLyBpdCBhZGRzIG5vaXNlIHRvIE5WREEgdXNlcnMgd2hlcmUgXCJub3Qgc2VsZWN0ZWRcIiB3aWxsIGJlIHJlYWQgb3V0IGZvciBlYWNoIGNoaXAuXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0YWJsZSAmJiAodGhpcy5fY2hpcExpc3RNdWx0aXBsZSB8fCB0aGlzLnNlbGVjdGVkKSA/XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQudG9TdHJpbmcoKSA6IG51bGw7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpXG4gICAgICAgICAgICAgICAgICBnbG9iYWxSaXBwbGVPcHRpb25zOiBSaXBwbGVHbG9iYWxPcHRpb25zIHwgbnVsbCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBfZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLl9hZGRIb3N0Q2xhc3NOYW1lKCk7XG5cbiAgICAvLyBEeW5hbWljYWxseSBjcmVhdGUgdGhlIHJpcHBsZSB0YXJnZXQsIGFwcGVuZCBpdCB3aXRoaW4gdGhlIGNoaXAsIGFuZCB1c2UgaXQgYXMgdGhlXG4gICAgLy8gY2hpcCdzIHJpcHBsZSB0YXJnZXQuIEFkZGluZyB0aGUgY2xhc3MgJy5tYXQtY2hpcC1yaXBwbGUnIGVuc3VyZXMgdGhhdCBpdCB3aWxsIGhhdmVcbiAgICAvLyB0aGUgcHJvcGVyIHN0eWxlcy5cbiAgICB0aGlzLl9jaGlwUmlwcGxlVGFyZ2V0ID0gX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX2NoaXBSaXBwbGVUYXJnZXQuY2xhc3NMaXN0LmFkZCgnbWF0LWNoaXAtcmlwcGxlJyk7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX2NoaXBSaXBwbGVUYXJnZXQpO1xuICAgIHRoaXMuX2NoaXBSaXBwbGUgPSBuZXcgUmlwcGxlUmVuZGVyZXIodGhpcywgX25nWm9uZSwgdGhpcy5fY2hpcFJpcHBsZVRhcmdldCwgcGxhdGZvcm0pO1xuICAgIHRoaXMuX2NoaXBSaXBwbGUuc2V0dXBUcmlnZ2VyRXZlbnRzKF9lbGVtZW50UmVmKTtcblxuICAgIHRoaXMucmlwcGxlQ29uZmlnID0gZ2xvYmFsUmlwcGxlT3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLl9hbmltYXRpb25zRGlzYWJsZWQgPSBhbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnO1xuICAgIHRoaXMudGFiSW5kZXggPSB0YWJJbmRleCAhPSBudWxsID8gKHBhcnNlSW50KHRhYkluZGV4KSB8fCAtMSkgOiAtMTtcbiAgfVxuXG4gIF9hZGRIb3N0Q2xhc3NOYW1lKCkge1xuICAgIGNvbnN0IGJhc2ljQ2hpcEF0dHJOYW1lID0gJ21hdC1iYXNpYy1jaGlwJztcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgaWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKGJhc2ljQ2hpcEF0dHJOYW1lKSB8fFxuICAgICAgICBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gYmFzaWNDaGlwQXR0ck5hbWUpIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChiYXNpY0NoaXBBdHRyTmFtZSk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LXN0YW5kYXJkLWNoaXAnKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3llZC5lbWl0KHtjaGlwOiB0aGlzfSk7XG4gICAgdGhpcy5fY2hpcFJpcHBsZS5fcmVtb3ZlVHJpZ2dlckV2ZW50cygpO1xuICB9XG5cbiAgLyoqIFNlbGVjdHMgdGhlIGNoaXAuICovXG4gIHNlbGVjdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLl9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZSgpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERlc2VsZWN0cyB0aGUgY2hpcC4gKi9cbiAgZGVzZWxlY3QoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZWxlY3QgdGhpcyBjaGlwIGFuZCBlbWl0IHNlbGVjdGVkIGV2ZW50ICovXG4gIHNlbGVjdFZpYUludGVyYWN0aW9uKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKHRydWUpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIGN1cnJlbnQgc2VsZWN0ZWQgc3RhdGUgb2YgdGhpcyBjaGlwLiAqL1xuICB0b2dnbGVTZWxlY3RlZChpc1VzZXJJbnB1dDogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSAhdGhpcy5zZWxlY3RlZDtcbiAgICB0aGlzLl9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZShpc1VzZXJJbnB1dCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWQ7XG4gIH1cblxuICAvKiogQWxsb3dzIGZvciBwcm9ncmFtbWF0aWMgZm9jdXNpbmcgb2YgdGhlIGNoaXAuICovXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5faGFzRm9jdXMpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5fb25Gb2N1cy5uZXh0KHtjaGlwOiB0aGlzfSk7XG4gICAgfVxuICAgIHRoaXMuX2hhc0ZvY3VzID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgZm9yIHByb2dyYW1tYXRpYyByZW1vdmFsIG9mIHRoZSBjaGlwLiBDYWxsZWQgYnkgdGhlIE1hdENoaXBMaXN0IHdoZW4gdGhlIERFTEVURSBvclxuICAgKiBCQUNLU1BBQ0Uga2V5cyBhcmUgcHJlc3NlZC5cbiAgICpcbiAgICogSW5mb3JtcyBhbnkgbGlzdGVuZXJzIG9mIHRoZSByZW1vdmFsIHJlcXVlc3QuIERvZXMgbm90IHJlbW92ZSB0aGUgY2hpcCBmcm9tIHRoZSBET00uXG4gICAqL1xuICByZW1vdmUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucmVtb3ZhYmxlKSB7XG4gICAgICB0aGlzLnJlbW92ZWQuZW1pdCh7Y2hpcDogdGhpc30pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGNsaWNrIGV2ZW50cyBvbiB0aGUgY2hpcC4gKi9cbiAgX2hhbmRsZUNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlIGN1c3RvbSBrZXkgcHJlc3Nlcy4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBERUxFVEU6XG4gICAgICBjYXNlIEJBQ0tTUEFDRTpcbiAgICAgICAgLy8gSWYgd2UgYXJlIHJlbW92YWJsZSwgcmVtb3ZlIHRoZSBmb2N1c2VkIGNoaXBcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgLy8gQWx3YXlzIHByZXZlbnQgc28gcGFnZSBuYXZpZ2F0aW9uIGRvZXMgbm90IG9jY3VyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTUEFDRTpcbiAgICAgICAgLy8gSWYgd2UgYXJlIHNlbGVjdGFibGUsIHRvZ2dsZSB0aGUgZm9jdXNlZCBjaGlwXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGFibGUpIHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZVNlbGVjdGVkKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWx3YXlzIHByZXZlbnQgc3BhY2UgZnJvbSBzY3JvbGxpbmcgdGhlIHBhZ2Ugc2luY2UgdGhlIGxpc3QgaGFzIGZvY3VzXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9ibHVyKCk6IHZvaWQge1xuICAgIC8vIFdoZW4gYW5pbWF0aW9ucyBhcmUgZW5hYmxlZCwgQW5ndWxhciBtYXkgZW5kIHVwIHJlbW92aW5nIHRoZSBjaGlwIGZyb20gdGhlIERPTSBhIGxpdHRsZVxuICAgIC8vIGVhcmxpZXIgdGhhbiB1c3VhbCwgY2F1c2luZyBpdCB0byBiZSBibHVycmVkIGFuZCB0aHJvd2luZyBvZmYgdGhlIGxvZ2ljIGluIHRoZSBjaGlwIGxpc3RcbiAgICAvLyB0aGF0IG1vdmVzIGZvY3VzIG5vdCB0aGUgbmV4dCBpdGVtLiBUbyB3b3JrIGFyb3VuZCB0aGUgaXNzdWUsIHdlIGRlZmVyIG1hcmtpbmcgdGhlIGNoaXBcbiAgICAvLyBhcyBub3QgZm9jdXNlZCB1bnRpbCB0aGUgbmV4dCB0aW1lIHRoZSB6b25lIHN0YWJpbGl6ZXMuXG4gICAgdGhpcy5fbmdab25lLm9uU3RhYmxlXG4gICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2hhc0ZvY3VzID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5fb25CbHVyLm5leHQoe2NoaXA6IHRoaXN9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKGlzVXNlcklucHV0ID0gZmFsc2UpIHtcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHtcbiAgICAgIHNvdXJjZTogdGhpcyxcbiAgICAgIGlzVXNlcklucHV0LFxuICAgICAgc2VsZWN0ZWQ6IHRoaXMuX3NlbGVjdGVkXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2VsZWN0ZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGFibGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlbW92YWJsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3RhYkluZGV4OiBOdW1iZXJJbnB1dDtcbn1cblxuLyoqXG4gKiBBcHBsaWVzIHByb3BlciAoY2xpY2spIHN1cHBvcnQgYW5kIGFkZHMgc3R5bGluZyBmb3IgdXNlIHdpdGggdGhlIE1hdGVyaWFsIERlc2lnbiBcImNhbmNlbFwiIGljb25cbiAqIGF2YWlsYWJsZSBhdCBodHRwczovL21hdGVyaWFsLmlvL2ljb25zLyNpY19jYW5jZWwuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgYDxtYXQtY2hpcD5cbiAqICAgICAgIDxtYXQtaWNvbiBtYXRDaGlwUmVtb3ZlPmNhbmNlbDwvbWF0LWljb24+XG4gKiAgICAgPC9tYXQtY2hpcD5gXG4gKlxuICogWW91ICptYXkqIHVzZSBhIGN1c3RvbSBpY29uLCBidXQgeW91IG1heSBuZWVkIHRvIG92ZXJyaWRlIHRoZSBgbWF0LWNoaXAtcmVtb3ZlYCBwb3NpdGlvbmluZ1xuICogc3R5bGVzIHRvIHByb3Blcmx5IGNlbnRlciB0aGUgaWNvbiB3aXRoaW4gdGhlIGNoaXAuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRDaGlwUmVtb3ZlXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNoaXAtcmVtb3ZlIG1hdC1jaGlwLXRyYWlsaW5nLWljb24nLFxuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygkZXZlbnQpJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9DSElQX1JFTU9WRSwgdXNlRXhpc3Rpbmc6IE1hdENoaXBSZW1vdmV9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcFJlbW92ZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBfcGFyZW50Q2hpcDogTWF0Q2hpcCxcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIGlmIChlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQubm9kZU5hbWUgPT09ICdCVVRUT04nKSB7XG4gICAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpO1xuICAgIH1cbiAgIH1cblxuICAvKiogQ2FsbHMgdGhlIHBhcmVudCBjaGlwJ3MgcHVibGljIGByZW1vdmUoKWAgbWV0aG9kIGlmIGFwcGxpY2FibGUuICovXG4gIF9oYW5kbGVDbGljayhldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBwYXJlbnRDaGlwID0gdGhpcy5fcGFyZW50Q2hpcDtcblxuICAgIGlmIChwYXJlbnRDaGlwLnJlbW92YWJsZSAmJiAhcGFyZW50Q2hpcC5kaXNhYmxlZCkge1xuICAgICAgcGFyZW50Q2hpcC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRvIHN0b3AgZXZlbnQgcHJvcGFnYXRpb24gYmVjYXVzZSBvdGhlcndpc2UgdGhlIGV2ZW50IHdpbGwgYnViYmxlIHVwIHRvIHRoZVxuICAgIC8vIGZvcm0gZmllbGQgYW5kIGNhdXNlIHRoZSBgb25Db250YWluZXJDbGlja2AgbWV0aG9kIHRvIGJlIGludm9rZWQuIFRoaXMgbWV0aG9kIHdvdWxkIHRoZW5cbiAgICAvLyByZXNldCB0aGUgZm9jdXNlZCBjaGlwIHRoYXQgaGFzIGJlZW4gZm9jdXNlZCBhZnRlciBjaGlwIHJlbW92YWwuIFVzdWFsbHkgdGhlIHBhcmVudFxuICAgIC8vIHRoZSBwYXJlbnQgY2xpY2sgbGlzdGVuZXIgb2YgdGhlIGBNYXRDaGlwYCB3b3VsZCBwcmV2ZW50IHByb3BhZ2F0aW9uLCBidXQgaXQgY2FuIGhhcHBlblxuICAgIC8vIHRoYXQgdGhlIGNoaXAgaXMgYmVpbmcgcmVtb3ZlZCBiZWZvcmUgdGhlIGV2ZW50IGJ1YmJsZXMgdXAuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cbn1cbiJdfQ==