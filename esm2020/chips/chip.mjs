import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BACKSPACE, DELETE, SPACE } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Attribute, ChangeDetectorRef, ContentChild, Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Optional, Output, } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, mixinColor, mixinDisableRipple, mixinTabIndex, RippleRenderer, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
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
MatChipAvatar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatChipAvatar, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatChipAvatar.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatChipAvatar, selector: "mat-chip-avatar, [matChipAvatar]", host: { classAttribute: "mat-chip-avatar" }, providers: [{ provide: MAT_CHIP_AVATAR, useExisting: MatChipAvatar }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatChipAvatar, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-chip-avatar, [matChipAvatar]',
                    host: { 'class': 'mat-chip-avatar' },
                    providers: [{ provide: MAT_CHIP_AVATAR, useExisting: MatChipAvatar }],
                }]
        }] });
/**
 * Dummy directive to add CSS class to chip trailing icon.
 * @docs-private
 */
export class MatChipTrailingIcon {
}
MatChipTrailingIcon.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatChipTrailingIcon, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatChipTrailingIcon.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatChipTrailingIcon, selector: "mat-chip-trailing-icon, [matChipTrailingIcon]", host: { classAttribute: "mat-chip-trailing-icon" }, providers: [{ provide: MAT_CHIP_TRAILING_ICON, useExisting: MatChipTrailingIcon }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatChipTrailingIcon, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-chip-trailing-icon, [matChipTrailingIcon]',
                    host: { 'class': 'mat-chip-trailing-icon' },
                    providers: [{ provide: MAT_CHIP_TRAILING_ICON, useExisting: MatChipTrailingIcon }],
                }]
        }] });
/**
 * Material design styled Chip component. Used inside the MatChipList component.
 */
export class MatChip extends _MatChipMixinBase {
    constructor(elementRef, _ngZone, platform, globalRippleOptions, _changeDetectorRef, _document, animationMode, tabIndex) {
        super(elementRef);
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
        this._chipRipple.setupTriggerEvents(elementRef);
        this.rippleConfig = globalRippleOptions || {};
        this._animationsDisabled = animationMode === 'NoopAnimations';
        this.tabIndex = tabIndex != null ? parseInt(tabIndex) || -1 : -1;
    }
    /**
     * Whether ripples are disabled on interaction
     * @docs-private
     */
    get rippleDisabled() {
        return (this.disabled ||
            this.disableRipple ||
            this._animationsDisabled ||
            !!this.rippleConfig.disabled);
    }
    /** Whether the chip is selected. */
    get selected() {
        return this._selected;
    }
    set selected(value) {
        const coercedValue = coerceBooleanProperty(value);
        if (coercedValue !== this._selected) {
            this._selected = coercedValue;
            this._dispatchSelectionChange();
        }
    }
    /** The value of the chip. Defaults to the content inside `<mat-chip>` tags. */
    get value() {
        return this._value !== undefined ? this._value : this._elementRef.nativeElement.textContent;
    }
    set value(value) {
        this._value = value;
    }
    /**
     * Whether or not the chip is selectable. When a chip is not selectable,
     * changes to its selected state are always ignored. By default a chip is
     * selectable, and it becomes non-selectable if its parent chip list is
     * not selectable.
     */
    get selectable() {
        return this._selectable && this.chipListSelectable;
    }
    set selectable(value) {
        this._selectable = coerceBooleanProperty(value);
    }
    /** Whether the chip is disabled. */
    get disabled() {
        return this._chipListDisabled || this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    /**
     * Determines whether or not the chip displays the remove styling and emits (removed) events.
     */
    get removable() {
        return this._removable;
    }
    set removable(value) {
        this._removable = coerceBooleanProperty(value);
    }
    /** The ARIA selected applied to the chip. */
    get ariaSelected() {
        // Remove the `aria-selected` when the chip is deselected in single-selection mode, because
        // it adds noise to NVDA users where "not selected" will be read out for each chip.
        return this.selectable && (this._chipListMultiple || this.selected)
            ? this.selected.toString()
            : null;
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
        this._ngZone.onStable.pipe(take(1)).subscribe(() => {
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
            selected: this._selected,
        });
    }
}
MatChip.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatChip, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i1.Platform }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: i0.ChangeDetectorRef }, { token: DOCUMENT }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Directive });
MatChip.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatChip, selector: "mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]", inputs: { color: "color", disableRipple: "disableRipple", tabIndex: "tabIndex", selected: "selected", value: "value", selectable: "selectable", disabled: "disabled", removable: "removable" }, outputs: { selectionChange: "selectionChange", destroyed: "destroyed", removed: "removed" }, host: { attributes: { "role": "option" }, listeners: { "click": "_handleClick($event)", "keydown": "_handleKeydown($event)", "focus": "focus()", "blur": "_blur()" }, properties: { "attr.tabindex": "disabled ? null : tabIndex", "class.mat-chip-selected": "selected", "class.mat-chip-with-avatar": "avatar", "class.mat-chip-with-trailing-icon": "trailingIcon || removeIcon", "class.mat-chip-disabled": "disabled", "class._mat-animation-noopable": "_animationsDisabled", "attr.disabled": "disabled || null", "attr.aria-disabled": "disabled.toString()", "attr.aria-selected": "ariaSelected" }, classAttribute: "mat-chip mat-focus-indicator" }, queries: [{ propertyName: "avatar", first: true, predicate: MAT_CHIP_AVATAR, descendants: true }, { propertyName: "trailingIcon", first: true, predicate: MAT_CHIP_TRAILING_ICON, descendants: true }, { propertyName: "removeIcon", first: true, predicate: MAT_CHIP_REMOVE, descendants: true }], exportAs: ["matChip"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatChip, decorators: [{
            type: Directive,
            args: [{
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
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i1.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_RIPPLE_GLOBAL_OPTIONS]
                }] }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }]; }, propDecorators: { avatar: [{
                type: ContentChild,
                args: [MAT_CHIP_AVATAR]
            }], trailingIcon: [{
                type: ContentChild,
                args: [MAT_CHIP_TRAILING_ICON]
            }], removeIcon: [{
                type: ContentChild,
                args: [MAT_CHIP_REMOVE]
            }], selected: [{
                type: Input
            }], value: [{
                type: Input
            }], selectable: [{
                type: Input
            }], disabled: [{
                type: Input
            }], removable: [{
                type: Input
            }], selectionChange: [{
                type: Output
            }], destroyed: [{
                type: Output
            }], removed: [{
                type: Output
            }] } });
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
        event.preventDefault();
    }
}
MatChipRemove.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatChipRemove, deps: [{ token: MatChip }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
MatChipRemove.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatChipRemove, selector: "[matChipRemove]", host: { listeners: { "click": "_handleClick($event)" }, classAttribute: "mat-chip-remove mat-chip-trailing-icon" }, providers: [{ provide: MAT_CHIP_REMOVE, useExisting: MatChipRemove }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatChipRemove, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matChipRemove]',
                    host: {
                        'class': 'mat-chip-remove mat-chip-trailing-icon',
                        '(click)': '_handleClick($event)',
                    },
                    providers: [{ provide: MAT_CHIP_REMOVE, useExisting: MatChipRemove }],
                }]
        }], ctorParameters: function () { return [{ type: MatChip }, { type: i0.ElementRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy9jaGlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsWUFBWSxFQUNaLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFLTCx5QkFBeUIsRUFDekIsVUFBVSxFQUNWLGtCQUFrQixFQUNsQixhQUFhLEVBR2IsY0FBYyxHQUVmLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7OztBQVFwQyxtRUFBbUU7QUFDbkUsTUFBTSxPQUFPLHNCQUFzQjtJQUNqQztJQUNFLG9EQUFvRDtJQUM3QyxNQUFlO0lBQ3RCLDJEQUEyRDtJQUNwRCxRQUFpQjtJQUN4Qix1RUFBdUU7SUFDaEUsY0FBYyxLQUFLO1FBSm5CLFdBQU0sR0FBTixNQUFNLENBQVM7UUFFZixhQUFRLEdBQVIsUUFBUSxDQUFTO1FBRWpCLGdCQUFXLEdBQVgsV0FBVyxDQUFRO0lBQ3pCLENB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QztJQUN6QixDQUFDOzswR0F0QlUsYUFBYSxrQkFDVyxPQUFPOzhGQUQvQixhQUFhLDhKQUZiLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUMsQ0FBQzsyRkFFeEQsYUFBYTtrQkFSekIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLHdDQUF3Qzt3QkFDakQsU0FBUyxFQUFFLHNCQUFzQjtxQkFDbEM7b0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsZUFBZSxFQUFDLENBQUM7aUJBQ3BFOzBEQUVvQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNhYmxlT3B0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtCQUNLU1BBQ0UsIERFTEVURSwgU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbnRlbnRDaGlsZCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5Db2xvcixcbiAgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgSGFzVGFiSW5kZXgsXG4gIE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsXG4gIG1peGluQ29sb3IsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5UYWJJbmRleCxcbiAgUmlwcGxlQ29uZmlnLFxuICBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICBSaXBwbGVSZW5kZXJlcixcbiAgUmlwcGxlVGFyZ2V0LFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKiogUmVwcmVzZW50cyBhbiBldmVudCBmaXJlZCBvbiBhbiBpbmRpdmlkdWFsIGBtYXQtY2hpcGAuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdENoaXBFdmVudCB7XG4gIC8qKiBUaGUgY2hpcCB0aGUgZXZlbnQgd2FzIGZpcmVkIG9uLiAqL1xuICBjaGlwOiBNYXRDaGlwO1xufVxuXG4vKiogRXZlbnQgb2JqZWN0IGVtaXR0ZWQgYnkgTWF0Q2hpcCB3aGVuIHNlbGVjdGVkIG9yIGRlc2VsZWN0ZWQuICovXG5leHBvcnQgY2xhc3MgTWF0Q2hpcFNlbGVjdGlvbkNoYW5nZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGNoaXAgdGhhdCBlbWl0dGVkIHRoZSBldmVudC4gKi9cbiAgICBwdWJsaWMgc291cmNlOiBNYXRDaGlwLFxuICAgIC8qKiBXaGV0aGVyIHRoZSBjaGlwIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQgaXMgc2VsZWN0ZWQuICovXG4gICAgcHVibGljIHNlbGVjdGVkOiBib29sZWFuLFxuICAgIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3Rpb24gY2hhbmdlIHdhcyBhIHJlc3VsdCBvZiBhIHVzZXIgaW50ZXJhY3Rpb24uICovXG4gICAgcHVibGljIGlzVXNlcklucHV0ID0gZmFsc2UsXG4gICkge31cbn1cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRDaGlwUmVtb3ZlYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRDaGlwUmVtb3ZlYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9DSElQX1JFTU9WRSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRDaGlwUmVtb3ZlPignTWF0Q2hpcFJlbW92ZScpO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYE1hdENoaXBBdmF0YXJgLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdENoaXBBdmF0YXJgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0NISVBfQVZBVEFSID0gbmV3IEluamVjdGlvblRva2VuPE1hdENoaXBBdmF0YXI+KCdNYXRDaGlwQXZhdGFyJyk7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGluc3RhbmNlcyBvZiBgTWF0Q2hpcFRyYWlsaW5nSWNvbmAuIEl0IHNlcnZlcyBhc1xuICogYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0Q2hpcFRyYWlsaW5nSWNvbmAgY2xhc3Mgd2hpY2ggY291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBkaXJlY3RpdmUgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQ0hJUF9UUkFJTElOR19JQ09OID0gbmV3IEluamVjdGlvblRva2VuPE1hdENoaXBUcmFpbGluZ0ljb24+KFxuICAnTWF0Q2hpcFRyYWlsaW5nSWNvbicsXG4pO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdENoaXAuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuYWJzdHJhY3QgY2xhc3MgTWF0Q2hpcEJhc2Uge1xuICBhYnN0cmFjdCBkaXNhYmxlZDogYm9vbGVhbjtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxufVxuXG5jb25zdCBfTWF0Q2hpcE1peGluQmFzZSA9IG1peGluVGFiSW5kZXgobWl4aW5Db2xvcihtaXhpbkRpc2FibGVSaXBwbGUoTWF0Q2hpcEJhc2UpLCAncHJpbWFyeScpLCAtMSk7XG5cbi8qKlxuICogRHVtbXkgZGlyZWN0aXZlIHRvIGFkZCBDU1MgY2xhc3MgdG8gY2hpcCBhdmF0YXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1jaGlwLWF2YXRhciwgW21hdENoaXBBdmF0YXJdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2hpcC1hdmF0YXInfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9DSElQX0FWQVRBUiwgdXNlRXhpc3Rpbmc6IE1hdENoaXBBdmF0YXJ9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcEF2YXRhciB7fVxuXG4vKipcbiAqIER1bW15IGRpcmVjdGl2ZSB0byBhZGQgQ1NTIGNsYXNzIHRvIGNoaXAgdHJhaWxpbmcgaWNvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWNoaXAtdHJhaWxpbmctaWNvbiwgW21hdENoaXBUcmFpbGluZ0ljb25dJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2hpcC10cmFpbGluZy1pY29uJ30sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfQ0hJUF9UUkFJTElOR19JQ09OLCB1c2VFeGlzdGluZzogTWF0Q2hpcFRyYWlsaW5nSWNvbn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwVHJhaWxpbmdJY29uIHt9XG5cbi8qKlxuICogTWF0ZXJpYWwgZGVzaWduIHN0eWxlZCBDaGlwIGNvbXBvbmVudC4gVXNlZCBpbnNpZGUgdGhlIE1hdENoaXBMaXN0IGNvbXBvbmVudC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgbWF0LWJhc2ljLWNoaXAsIFttYXQtYmFzaWMtY2hpcF0sIG1hdC1jaGlwLCBbbWF0LWNoaXBdYCxcbiAgaW5wdXRzOiBbJ2NvbG9yJywgJ2Rpc2FibGVSaXBwbGUnLCAndGFiSW5kZXgnXSxcbiAgZXhwb3J0QXM6ICdtYXRDaGlwJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2hpcCBtYXQtZm9jdXMtaW5kaWNhdG9yJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ2Rpc2FibGVkID8gbnVsbCA6IHRhYkluZGV4JyxcbiAgICAncm9sZSc6ICdvcHRpb24nLFxuICAgICdbY2xhc3MubWF0LWNoaXAtc2VsZWN0ZWRdJzogJ3NlbGVjdGVkJyxcbiAgICAnW2NsYXNzLm1hdC1jaGlwLXdpdGgtYXZhdGFyXSc6ICdhdmF0YXInLFxuICAgICdbY2xhc3MubWF0LWNoaXAtd2l0aC10cmFpbGluZy1pY29uXSc6ICd0cmFpbGluZ0ljb24gfHwgcmVtb3ZlSWNvbicsXG4gICAgJ1tjbGFzcy5tYXQtY2hpcC1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25zRGlzYWJsZWQnLFxuICAgICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLXNlbGVjdGVkXSc6ICdhcmlhU2VsZWN0ZWQnLFxuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygkZXZlbnQpJyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICAgICcoZm9jdXMpJzogJ2ZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX2JsdXIoKScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXBcbiAgZXh0ZW5kcyBfTWF0Q2hpcE1peGluQmFzZVxuICBpbXBsZW1lbnRzXG4gICAgRm9jdXNhYmxlT3B0aW9uLFxuICAgIE9uRGVzdHJveSxcbiAgICBDYW5Db2xvcixcbiAgICBDYW5EaXNhYmxlUmlwcGxlLFxuICAgIFJpcHBsZVRhcmdldCxcbiAgICBIYXNUYWJJbmRleCxcbiAgICBDYW5EaXNhYmxlXG57XG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIFJpcHBsZVJlbmRlcmVyIGZvciB0aGUgY2hpcC4gKi9cbiAgcHJpdmF0ZSBfY2hpcFJpcHBsZTogUmlwcGxlUmVuZGVyZXI7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCB0aGF0IGFjdHMgYXMgdGhlIGNoaXAncyByaXBwbGUgdGFyZ2V0LiBUaGlzIGVsZW1lbnQgaXNcbiAgICogZHluYW1pY2FsbHkgYWRkZWQgYXMgYSBjaGlsZCBub2RlIG9mIHRoZSBjaGlwLiBUaGUgY2hpcCBpdHNlbGYgY2Fubm90IGJlIHVzZWQgYXMgdGhlXG4gICAqIHJpcHBsZSB0YXJnZXQgYmVjYXVzZSBpdCBtdXN0IGJlIHRoZSBob3N0IG9mIHRoZSBmb2N1cyBpbmRpY2F0b3IuXG4gICAqL1xuICBwcml2YXRlIF9jaGlwUmlwcGxlVGFyZ2V0OiBIVE1MRWxlbWVudDtcblxuICAvKipcbiAgICogUmlwcGxlIGNvbmZpZ3VyYXRpb24gZm9yIHJpcHBsZXMgdGhhdCBhcmUgbGF1bmNoZWQgb24gcG9pbnRlciBkb3duLiBUaGUgcmlwcGxlIGNvbmZpZ1xuICAgKiBpcyBzZXQgdG8gdGhlIGdsb2JhbCByaXBwbGUgb3B0aW9ucyBzaW5jZSB3ZSBkb24ndCBoYXZlIGFueSBjb25maWd1cmFibGUgb3B0aW9ucyBmb3JcbiAgICogdGhlIGNoaXAgcmlwcGxlcy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmlwcGxlQ29uZmlnOiBSaXBwbGVDb25maWcgJiBSaXBwbGVHbG9iYWxPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHJpcHBsZXMgYXJlIGRpc2FibGVkIG9uIGludGVyYWN0aW9uXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCByaXBwbGVEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5kaXNhYmxlZCB8fFxuICAgICAgdGhpcy5kaXNhYmxlUmlwcGxlIHx8XG4gICAgICB0aGlzLl9hbmltYXRpb25zRGlzYWJsZWQgfHxcbiAgICAgICEhdGhpcy5yaXBwbGVDb25maWcuZGlzYWJsZWRcbiAgICApO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgaGFzIGZvY3VzLiAqL1xuICBfaGFzRm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciBhbmltYXRpb25zIGZvciB0aGUgY2hpcCBhcmUgZW5hYmxlZC4gKi9cbiAgX2FuaW1hdGlvbnNEaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBsaXN0IGlzIHNlbGVjdGFibGUgKi9cbiAgY2hpcExpc3RTZWxlY3RhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBsaXN0IGlzIGluIG11bHRpLXNlbGVjdGlvbiBtb2RlLiAqL1xuICBfY2hpcExpc3RNdWx0aXBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGxpc3QgYXMgYSB3aG9sZSBpcyBkaXNhYmxlZC4gKi9cbiAgX2NoaXBMaXN0RGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIGNoaXAgYXZhdGFyICovXG4gIEBDb250ZW50Q2hpbGQoTUFUX0NISVBfQVZBVEFSKSBhdmF0YXI6IE1hdENoaXBBdmF0YXI7XG5cbiAgLyoqIFRoZSBjaGlwJ3MgdHJhaWxpbmcgaWNvbi4gKi9cbiAgQENvbnRlbnRDaGlsZChNQVRfQ0hJUF9UUkFJTElOR19JQ09OKSB0cmFpbGluZ0ljb246IE1hdENoaXBUcmFpbGluZ0ljb247XG5cbiAgLyoqIFRoZSBjaGlwJ3MgcmVtb3ZlIHRvZ2dsZXIuICovXG4gIEBDb250ZW50Q2hpbGQoTUFUX0NISVBfUkVNT1ZFKSByZW1vdmVJY29uOiBNYXRDaGlwUmVtb3ZlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGlzIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICB9XG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgY29uc3QgY29lcmNlZFZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChjb2VyY2VkVmFsdWUgIT09IHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IGNvZXJjZWRWYWx1ZTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG4gIHByb3RlY3RlZCBfc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBjaGlwLiBEZWZhdWx0cyB0byB0aGUgY29udGVudCBpbnNpZGUgYDxtYXQtY2hpcD5gIHRhZ3MuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZSAhPT0gdW5kZWZpbmVkID8gdGhpcy5fdmFsdWUgOiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudGV4dENvbnRlbnQ7XG4gIH1cbiAgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICB9XG4gIHByb3RlY3RlZCBfdmFsdWU6IGFueTtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIGNoaXAgaXMgc2VsZWN0YWJsZS4gV2hlbiBhIGNoaXAgaXMgbm90IHNlbGVjdGFibGUsXG4gICAqIGNoYW5nZXMgdG8gaXRzIHNlbGVjdGVkIHN0YXRlIGFyZSBhbHdheXMgaWdub3JlZC4gQnkgZGVmYXVsdCBhIGNoaXAgaXNcbiAgICogc2VsZWN0YWJsZSwgYW5kIGl0IGJlY29tZXMgbm9uLXNlbGVjdGFibGUgaWYgaXRzIHBhcmVudCBjaGlwIGxpc3QgaXNcbiAgICogbm90IHNlbGVjdGFibGUuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0YWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0YWJsZSAmJiB0aGlzLmNoaXBMaXN0U2VsZWN0YWJsZTtcbiAgfVxuICBzZXQgc2VsZWN0YWJsZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fc2VsZWN0YWJsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJvdGVjdGVkIF9zZWxlY3RhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9jaGlwTGlzdERpc2FibGVkIHx8IHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgY2hpcCBkaXNwbGF5cyB0aGUgcmVtb3ZlIHN0eWxpbmcgYW5kIGVtaXRzIChyZW1vdmVkKSBldmVudHMuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVtb3ZhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZW1vdmFibGU7XG4gIH1cbiAgc2V0IHJlbW92YWJsZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fcmVtb3ZhYmxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcm90ZWN0ZWQgX3JlbW92YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNoaXAgaXMgZm9jdXNlZC4gKi9cbiAgcmVhZG9ubHkgX29uRm9jdXMgPSBuZXcgU3ViamVjdDxNYXRDaGlwRXZlbnQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNoaXAgaXMgYmx1cmVkLiAqL1xuICByZWFkb25seSBfb25CbHVyID0gbmV3IFN1YmplY3Q8TWF0Q2hpcEV2ZW50PigpO1xuXG4gIC8qKiBFbWl0dGVkIHdoZW4gdGhlIGNoaXAgaXMgc2VsZWN0ZWQgb3IgZGVzZWxlY3RlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdENoaXBTZWxlY3Rpb25DaGFuZ2U+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdENoaXBTZWxlY3Rpb25DaGFuZ2U+KCk7XG5cbiAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgY2hpcCBpcyBkZXN0cm95ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkZXN0cm95ZWQ6IEV2ZW50RW1pdHRlcjxNYXRDaGlwRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRDaGlwRXZlbnQ+KCk7XG5cbiAgLyoqIEVtaXR0ZWQgd2hlbiBhIGNoaXAgaXMgdG8gYmUgcmVtb3ZlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHJlbW92ZWQ6IEV2ZW50RW1pdHRlcjxNYXRDaGlwRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRDaGlwRXZlbnQ+KCk7XG5cbiAgLyoqIFRoZSBBUklBIHNlbGVjdGVkIGFwcGxpZWQgdG8gdGhlIGNoaXAuICovXG4gIGdldCBhcmlhU2VsZWN0ZWQoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgLy8gUmVtb3ZlIHRoZSBgYXJpYS1zZWxlY3RlZGAgd2hlbiB0aGUgY2hpcCBpcyBkZXNlbGVjdGVkIGluIHNpbmdsZS1zZWxlY3Rpb24gbW9kZSwgYmVjYXVzZVxuICAgIC8vIGl0IGFkZHMgbm9pc2UgdG8gTlZEQSB1c2VycyB3aGVyZSBcIm5vdCBzZWxlY3RlZFwiIHdpbGwgYmUgcmVhZCBvdXQgZm9yIGVhY2ggY2hpcC5cbiAgICByZXR1cm4gdGhpcy5zZWxlY3RhYmxlICYmICh0aGlzLl9jaGlwTGlzdE11bHRpcGxlIHx8IHRoaXMuc2VsZWN0ZWQpXG4gICAgICA/IHRoaXMuc2VsZWN0ZWQudG9TdHJpbmcoKVxuICAgICAgOiBudWxsO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TKVxuICAgIGdsb2JhbFJpcHBsZU9wdGlvbnM6IFJpcHBsZUdsb2JhbE9wdGlvbnMgfCBudWxsLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBfZG9jdW1lbnQ6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4Pzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcblxuICAgIHRoaXMuX2FkZEhvc3RDbGFzc05hbWUoKTtcblxuICAgIC8vIER5bmFtaWNhbGx5IGNyZWF0ZSB0aGUgcmlwcGxlIHRhcmdldCwgYXBwZW5kIGl0IHdpdGhpbiB0aGUgY2hpcCwgYW5kIHVzZSBpdCBhcyB0aGVcbiAgICAvLyBjaGlwJ3MgcmlwcGxlIHRhcmdldC4gQWRkaW5nIHRoZSBjbGFzcyAnLm1hdC1jaGlwLXJpcHBsZScgZW5zdXJlcyB0aGF0IGl0IHdpbGwgaGF2ZVxuICAgIC8vIHRoZSBwcm9wZXIgc3R5bGVzLlxuICAgIHRoaXMuX2NoaXBSaXBwbGVUYXJnZXQgPSBfZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5fY2hpcFJpcHBsZVRhcmdldC5jbGFzc0xpc3QuYWRkKCdtYXQtY2hpcC1yaXBwbGUnKTtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fY2hpcFJpcHBsZVRhcmdldCk7XG4gICAgdGhpcy5fY2hpcFJpcHBsZSA9IG5ldyBSaXBwbGVSZW5kZXJlcih0aGlzLCBfbmdab25lLCB0aGlzLl9jaGlwUmlwcGxlVGFyZ2V0LCBwbGF0Zm9ybSk7XG4gICAgdGhpcy5fY2hpcFJpcHBsZS5zZXR1cFRyaWdnZXJFdmVudHMoZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLnJpcHBsZUNvbmZpZyA9IGdsb2JhbFJpcHBsZU9wdGlvbnMgfHwge307XG4gICAgdGhpcy5fYW5pbWF0aW9uc0Rpc2FibGVkID0gYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJztcbiAgICB0aGlzLnRhYkluZGV4ID0gdGFiSW5kZXggIT0gbnVsbCA/IHBhcnNlSW50KHRhYkluZGV4KSB8fCAtMSA6IC0xO1xuICB9XG5cbiAgX2FkZEhvc3RDbGFzc05hbWUoKSB7XG4gICAgY29uc3QgYmFzaWNDaGlwQXR0ck5hbWUgPSAnbWF0LWJhc2ljLWNoaXAnO1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICBpZiAoXG4gICAgICBlbGVtZW50Lmhhc0F0dHJpYnV0ZShiYXNpY0NoaXBBdHRyTmFtZSkgfHxcbiAgICAgIGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBiYXNpY0NoaXBBdHRyTmFtZVxuICAgICkge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGJhc2ljQ2hpcEF0dHJOYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtc3RhbmRhcmQtY2hpcCcpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveWVkLmVtaXQoe2NoaXA6IHRoaXN9KTtcbiAgICB0aGlzLl9jaGlwUmlwcGxlLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG4gIH1cblxuICAvKiogU2VsZWN0cyB0aGUgY2hpcC4gKi9cbiAgc2VsZWN0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogRGVzZWxlY3RzIHRoZSBjaGlwLiAqL1xuICBkZXNlbGVjdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZSgpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNlbGVjdCB0aGlzIGNoaXAgYW5kIGVtaXQgc2VsZWN0ZWQgZXZlbnQgKi9cbiAgc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UodHJ1ZSk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgY3VycmVudCBzZWxlY3RlZCBzdGF0ZSBvZiB0aGlzIGNoaXAuICovXG4gIHRvZ2dsZVNlbGVjdGVkKGlzVXNlcklucHV0OiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcbiAgICB0aGlzLl9zZWxlY3RlZCA9ICF0aGlzLnNlbGVjdGVkO1xuICAgIHRoaXMuX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKGlzVXNlcklucHV0KTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZDtcbiAgfVxuXG4gIC8qKiBBbGxvd3MgZm9yIHByb2dyYW1tYXRpYyBmb2N1c2luZyBvZiB0aGUgY2hpcC4gKi9cbiAgZm9jdXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9oYXNGb2N1cykge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLl9vbkZvY3VzLm5leHQoe2NoaXA6IHRoaXN9KTtcbiAgICB9XG4gICAgdGhpcy5faGFzRm9jdXMgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBmb3IgcHJvZ3JhbW1hdGljIHJlbW92YWwgb2YgdGhlIGNoaXAuIENhbGxlZCBieSB0aGUgTWF0Q2hpcExpc3Qgd2hlbiB0aGUgREVMRVRFIG9yXG4gICAqIEJBQ0tTUEFDRSBrZXlzIGFyZSBwcmVzc2VkLlxuICAgKlxuICAgKiBJbmZvcm1zIGFueSBsaXN0ZW5lcnMgb2YgdGhlIHJlbW92YWwgcmVxdWVzdC4gRG9lcyBub3QgcmVtb3ZlIHRoZSBjaGlwIGZyb20gdGhlIERPTS5cbiAgICovXG4gIHJlbW92ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yZW1vdmFibGUpIHtcbiAgICAgIHRoaXMucmVtb3ZlZC5lbWl0KHtjaGlwOiB0aGlzfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgY2xpY2sgZXZlbnRzIG9uIHRoZSBjaGlwLiAqL1xuICBfaGFuZGxlQ2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZSBjdXN0b20ga2V5IHByZXNzZXMuICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgREVMRVRFOlxuICAgICAgY2FzZSBCQUNLU1BBQ0U6XG4gICAgICAgIC8vIElmIHdlIGFyZSByZW1vdmFibGUsIHJlbW92ZSB0aGUgZm9jdXNlZCBjaGlwXG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIC8vIEFsd2F5cyBwcmV2ZW50IHNvIHBhZ2UgbmF2aWdhdGlvbiBkb2VzIG5vdCBvY2N1clxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1BBQ0U6XG4gICAgICAgIC8vIElmIHdlIGFyZSBzZWxlY3RhYmxlLCB0b2dnbGUgdGhlIGZvY3VzZWQgY2hpcFxuICAgICAgICBpZiAodGhpcy5zZWxlY3RhYmxlKSB7XG4gICAgICAgICAgdGhpcy50b2dnbGVTZWxlY3RlZCh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsd2F5cyBwcmV2ZW50IHNwYWNlIGZyb20gc2Nyb2xsaW5nIHRoZSBwYWdlIHNpbmNlIHRoZSBsaXN0IGhhcyBmb2N1c1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfYmx1cigpOiB2b2lkIHtcbiAgICAvLyBXaGVuIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWQsIEFuZ3VsYXIgbWF5IGVuZCB1cCByZW1vdmluZyB0aGUgY2hpcCBmcm9tIHRoZSBET00gYSBsaXR0bGVcbiAgICAvLyBlYXJsaWVyIHRoYW4gdXN1YWwsIGNhdXNpbmcgaXQgdG8gYmUgYmx1cnJlZCBhbmQgdGhyb3dpbmcgb2ZmIHRoZSBsb2dpYyBpbiB0aGUgY2hpcCBsaXN0XG4gICAgLy8gdGhhdCBtb3ZlcyBmb2N1cyBub3QgdGhlIG5leHQgaXRlbS4gVG8gd29yayBhcm91bmQgdGhlIGlzc3VlLCB3ZSBkZWZlciBtYXJraW5nIHRoZSBjaGlwXG4gICAgLy8gYXMgbm90IGZvY3VzZWQgdW50aWwgdGhlIG5leHQgdGltZSB0aGUgem9uZSBzdGFiaWxpemVzLlxuICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5faGFzRm9jdXMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fb25CbHVyLm5leHQoe2NoaXA6IHRoaXN9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UoaXNVc2VySW5wdXQgPSBmYWxzZSkge1xuICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQoe1xuICAgICAgc291cmNlOiB0aGlzLFxuICAgICAgaXNVc2VySW5wdXQsXG4gICAgICBzZWxlY3RlZDogdGhpcy5fc2VsZWN0ZWQsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBcHBsaWVzIHByb3BlciAoY2xpY2spIHN1cHBvcnQgYW5kIGFkZHMgc3R5bGluZyBmb3IgdXNlIHdpdGggdGhlIE1hdGVyaWFsIERlc2lnbiBcImNhbmNlbFwiIGljb25cbiAqIGF2YWlsYWJsZSBhdCBodHRwczovL21hdGVyaWFsLmlvL2ljb25zLyNpY19jYW5jZWwuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgYDxtYXQtY2hpcD5cbiAqICAgICAgIDxtYXQtaWNvbiBtYXRDaGlwUmVtb3ZlPmNhbmNlbDwvbWF0LWljb24+XG4gKiAgICAgPC9tYXQtY2hpcD5gXG4gKlxuICogWW91ICptYXkqIHVzZSBhIGN1c3RvbSBpY29uLCBidXQgeW91IG1heSBuZWVkIHRvIG92ZXJyaWRlIHRoZSBgbWF0LWNoaXAtcmVtb3ZlYCBwb3NpdGlvbmluZ1xuICogc3R5bGVzIHRvIHByb3Blcmx5IGNlbnRlciB0aGUgaWNvbiB3aXRoaW4gdGhlIGNoaXAuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRDaGlwUmVtb3ZlXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNoaXAtcmVtb3ZlIG1hdC1jaGlwLXRyYWlsaW5nLWljb24nLFxuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygkZXZlbnQpJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9DSElQX1JFTU9WRSwgdXNlRXhpc3Rpbmc6IE1hdENoaXBSZW1vdmV9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcFJlbW92ZSB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfcGFyZW50Q2hpcDogTWF0Q2hpcCwgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICBpZiAoZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm5vZGVOYW1lID09PSAnQlVUVE9OJykge1xuICAgICAgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2FsbHMgdGhlIHBhcmVudCBjaGlwJ3MgcHVibGljIGByZW1vdmUoKWAgbWV0aG9kIGlmIGFwcGxpY2FibGUuICovXG4gIF9oYW5kbGVDbGljayhldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBwYXJlbnRDaGlwID0gdGhpcy5fcGFyZW50Q2hpcDtcblxuICAgIGlmIChwYXJlbnRDaGlwLnJlbW92YWJsZSAmJiAhcGFyZW50Q2hpcC5kaXNhYmxlZCkge1xuICAgICAgcGFyZW50Q2hpcC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRvIHN0b3AgZXZlbnQgcHJvcGFnYXRpb24gYmVjYXVzZSBvdGhlcndpc2UgdGhlIGV2ZW50IHdpbGwgYnViYmxlIHVwIHRvIHRoZVxuICAgIC8vIGZvcm0gZmllbGQgYW5kIGNhdXNlIHRoZSBgb25Db250YWluZXJDbGlja2AgbWV0aG9kIHRvIGJlIGludm9rZWQuIFRoaXMgbWV0aG9kIHdvdWxkIHRoZW5cbiAgICAvLyByZXNldCB0aGUgZm9jdXNlZCBjaGlwIHRoYXQgaGFzIGJlZW4gZm9jdXNlZCBhZnRlciBjaGlwIHJlbW92YWwuIFVzdWFsbHkgdGhlIHBhcmVudFxuICAgIC8vIHRoZSBwYXJlbnQgY2xpY2sgbGlzdGVuZXIgb2YgdGhlIGBNYXRDaGlwYCB3b3VsZCBwcmV2ZW50IHByb3BhZ2F0aW9uLCBidXQgaXQgY2FuIGhhcHBlblxuICAgIC8vIHRoYXQgdGhlIGNoaXAgaXMgYmVpbmcgcmVtb3ZlZCBiZWZvcmUgdGhlIGV2ZW50IGJ1YmJsZXMgdXAuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxufVxuIl19