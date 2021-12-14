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
MatChipAvatar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: MatChipAvatar, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatChipAvatar.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.0", type: MatChipAvatar, selector: "mat-chip-avatar, [matChipAvatar]", host: { classAttribute: "mat-chip-avatar" }, providers: [{ provide: MAT_CHIP_AVATAR, useExisting: MatChipAvatar }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: MatChipAvatar, decorators: [{
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
MatChipTrailingIcon.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: MatChipTrailingIcon, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatChipTrailingIcon.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.0", type: MatChipTrailingIcon, selector: "mat-chip-trailing-icon, [matChipTrailingIcon]", host: { classAttribute: "mat-chip-trailing-icon" }, providers: [{ provide: MAT_CHIP_TRAILING_ICON, useExisting: MatChipTrailingIcon }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: MatChipTrailingIcon, decorators: [{
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
MatChip.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: MatChip, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i1.Platform }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: i0.ChangeDetectorRef }, { token: DOCUMENT }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Directive });
MatChip.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.0", type: MatChip, selector: "mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]", inputs: { color: "color", disableRipple: "disableRipple", tabIndex: "tabIndex", selected: "selected", value: "value", selectable: "selectable", disabled: "disabled", removable: "removable" }, outputs: { selectionChange: "selectionChange", destroyed: "destroyed", removed: "removed" }, host: { attributes: { "role": "option" }, listeners: { "click": "_handleClick($event)", "keydown": "_handleKeydown($event)", "focus": "focus()", "blur": "_blur()" }, properties: { "attr.tabindex": "disabled ? null : tabIndex", "class.mat-chip-selected": "selected", "class.mat-chip-with-avatar": "avatar", "class.mat-chip-with-trailing-icon": "trailingIcon || removeIcon", "class.mat-chip-disabled": "disabled", "class._mat-animation-noopable": "_animationsDisabled", "attr.disabled": "disabled || null", "attr.aria-disabled": "disabled.toString()", "attr.aria-selected": "ariaSelected" }, classAttribute: "mat-chip mat-focus-indicator" }, queries: [{ propertyName: "avatar", first: true, predicate: MAT_CHIP_AVATAR, descendants: true }, { propertyName: "trailingIcon", first: true, predicate: MAT_CHIP_TRAILING_ICON, descendants: true }, { propertyName: "removeIcon", first: true, predicate: MAT_CHIP_REMOVE, descendants: true }], exportAs: ["matChip"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: MatChip, decorators: [{
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
    }
}
MatChipRemove.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: MatChipRemove, deps: [{ token: MatChip }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
MatChipRemove.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.0", type: MatChipRemove, selector: "[matChipRemove]", host: { listeners: { "click": "_handleClick($event)" }, classAttribute: "mat-chip-remove mat-chip-trailing-icon" }, providers: [{ provide: MAT_CHIP_REMOVE, useExisting: MatChipRemove }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: MatChipRemove, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy9jaGlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsWUFBWSxFQUNaLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFLTCx5QkFBeUIsRUFDekIsVUFBVSxFQUNWLGtCQUFrQixFQUNsQixhQUFhLEVBR2IsY0FBYyxHQUVmLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7OztBQVFwQyxtRUFBbUU7QUFDbkUsTUFBTSxPQUFPLHNCQUFzQjtJQUNqQztJQUNFLG9EQUFvRDtJQUM3QyxNQUFlO0lBQ3RCLDJEQUEyRDtJQUNwRCxRQUFpQjtJQUN4Qix1RUFBdUU7SUFDaEUsY0FBYyxLQUFLO1FBSm5CLFdBQU0sR0FBTixNQUFNLENBQVM7UUFFZixhQUFRLEdBQVIsUUFBUSxDQUFTO1FBRWpCLGdCQUFXLEdBQVgsV0FBVyxDQUFRO0lBQ3pCLENB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ZSxFQUFFLENBQUM7SUFDMUIsQ0FBQzs7MEdBckJVLGFBQWEsa0JBQ1csT0FBTzs4RkFEL0IsYUFBYSw4SkFGYixDQUFDLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFDLENBQUM7MkZBRXhELGFBQWE7a0JBUnpCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSx3Q0FBd0M7d0JBQ2pELFNBQVMsRUFBRSxzQkFBc0I7cUJBQ2xDO29CQUNELFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLGVBQWUsRUFBQyxDQUFDO2lCQUNwRTswREFFb0MsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzYWJsZU9wdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7QkFDS1NQQUNFLCBERUxFVEUsIFNQQUNFfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb250ZW50Q2hpbGQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIEhhc1RhYkluZGV4LFxuICBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLFxuICBtaXhpbkNvbG9yLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIG1peGluVGFiSW5kZXgsXG4gIFJpcHBsZUNvbmZpZyxcbiAgUmlwcGxlR2xvYmFsT3B0aW9ucyxcbiAgUmlwcGxlUmVuZGVyZXIsXG4gIFJpcHBsZVRhcmdldCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqIFJlcHJlc2VudHMgYW4gZXZlbnQgZmlyZWQgb24gYW4gaW5kaXZpZHVhbCBgbWF0LWNoaXBgLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRDaGlwRXZlbnQge1xuICAvKiogVGhlIGNoaXAgdGhlIGV2ZW50IHdhcyBmaXJlZCBvbi4gKi9cbiAgY2hpcDogTWF0Q2hpcDtcbn1cblxuLyoqIEV2ZW50IG9iamVjdCBlbWl0dGVkIGJ5IE1hdENoaXAgd2hlbiBzZWxlY3RlZCBvciBkZXNlbGVjdGVkLiAqL1xuZXhwb3J0IGNsYXNzIE1hdENoaXBTZWxlY3Rpb25DaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjaGlwIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0Q2hpcCxcbiAgICAvKiogV2hldGhlciB0aGUgY2hpcCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50IGlzIHNlbGVjdGVkLiAqL1xuICAgIHB1YmxpYyBzZWxlY3RlZDogYm9vbGVhbixcbiAgICAvKiogV2hldGhlciB0aGUgc2VsZWN0aW9uIGNoYW5nZSB3YXMgYSByZXN1bHQgb2YgYSB1c2VyIGludGVyYWN0aW9uLiAqL1xuICAgIHB1YmxpYyBpc1VzZXJJbnB1dCA9IGZhbHNlLFxuICApIHt9XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGluc3RhbmNlcyBvZiBgTWF0Q2hpcFJlbW92ZWAuIEl0IHNlcnZlcyBhc1xuICogYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0Q2hpcFJlbW92ZWAgY2xhc3Mgd2hpY2ggY291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBkaXJlY3RpdmUgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQ0hJUF9SRU1PVkUgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0Q2hpcFJlbW92ZT4oJ01hdENoaXBSZW1vdmUnKTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRDaGlwQXZhdGFyYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRDaGlwQXZhdGFyYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9DSElQX0FWQVRBUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRDaGlwQXZhdGFyPignTWF0Q2hpcEF2YXRhcicpO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYE1hdENoaXBUcmFpbGluZ0ljb25gLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdENoaXBUcmFpbGluZ0ljb25gIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0NISVBfVFJBSUxJTkdfSUNPTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRDaGlwVHJhaWxpbmdJY29uPihcbiAgJ01hdENoaXBUcmFpbGluZ0ljb24nLFxuKTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRDaGlwLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmFic3RyYWN0IGNsYXNzIE1hdENoaXBCYXNlIHtcbiAgYWJzdHJhY3QgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn1cblxuY29uc3QgX01hdENoaXBNaXhpbkJhc2UgPSBtaXhpblRhYkluZGV4KG1peGluQ29sb3IobWl4aW5EaXNhYmxlUmlwcGxlKE1hdENoaXBCYXNlKSwgJ3ByaW1hcnknKSwgLTEpO1xuXG4vKipcbiAqIER1bW15IGRpcmVjdGl2ZSB0byBhZGQgQ1NTIGNsYXNzIHRvIGNoaXAgYXZhdGFyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hpcC1hdmF0YXIsIFttYXRDaGlwQXZhdGFyXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNoaXAtYXZhdGFyJ30sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfQ0hJUF9BVkFUQVIsIHVzZUV4aXN0aW5nOiBNYXRDaGlwQXZhdGFyfV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXBBdmF0YXIge31cblxuLyoqXG4gKiBEdW1teSBkaXJlY3RpdmUgdG8gYWRkIENTUyBjbGFzcyB0byBjaGlwIHRyYWlsaW5nIGljb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1jaGlwLXRyYWlsaW5nLWljb24sIFttYXRDaGlwVHJhaWxpbmdJY29uXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNoaXAtdHJhaWxpbmctaWNvbid9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX0NISVBfVFJBSUxJTkdfSUNPTiwgdXNlRXhpc3Rpbmc6IE1hdENoaXBUcmFpbGluZ0ljb259XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcFRyYWlsaW5nSWNvbiB7fVxuXG4vKipcbiAqIE1hdGVyaWFsIGRlc2lnbiBzdHlsZWQgQ2hpcCBjb21wb25lbnQuIFVzZWQgaW5zaWRlIHRoZSBNYXRDaGlwTGlzdCBjb21wb25lbnQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYG1hdC1iYXNpYy1jaGlwLCBbbWF0LWJhc2ljLWNoaXBdLCBtYXQtY2hpcCwgW21hdC1jaGlwXWAsXG4gIGlucHV0czogWydjb2xvcicsICdkaXNhYmxlUmlwcGxlJywgJ3RhYkluZGV4J10sXG4gIGV4cG9ydEFzOiAnbWF0Q2hpcCcsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNoaXAgbWF0LWZvY3VzLWluZGljYXRvcicsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdkaXNhYmxlZCA/IG51bGwgOiB0YWJJbmRleCcsXG4gICAgJ3JvbGUnOiAnb3B0aW9uJyxcbiAgICAnW2NsYXNzLm1hdC1jaGlwLXNlbGVjdGVkXSc6ICdzZWxlY3RlZCcsXG4gICAgJ1tjbGFzcy5tYXQtY2hpcC13aXRoLWF2YXRhcl0nOiAnYXZhdGFyJyxcbiAgICAnW2NsYXNzLm1hdC1jaGlwLXdpdGgtdHJhaWxpbmctaWNvbl0nOiAndHJhaWxpbmdJY29uIHx8IHJlbW92ZUljb24nLFxuICAgICdbY2xhc3MubWF0LWNoaXAtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uc0Rpc2FibGVkJyxcbiAgICAnW2F0dHIuZGlzYWJsZWRdJzogJ2Rpc2FibGVkIHx8IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1zZWxlY3RlZF0nOiAnYXJpYVNlbGVjdGVkJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soJGV2ZW50KScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKGZvY3VzKSc6ICdmb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ19ibHVyKCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwXG4gIGV4dGVuZHMgX01hdENoaXBNaXhpbkJhc2VcbiAgaW1wbGVtZW50c1xuICAgIEZvY3VzYWJsZU9wdGlvbixcbiAgICBPbkRlc3Ryb3ksXG4gICAgQ2FuQ29sb3IsXG4gICAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgICBSaXBwbGVUYXJnZXQsXG4gICAgSGFzVGFiSW5kZXgsXG4gICAgQ2FuRGlzYWJsZVxue1xuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBSaXBwbGVSZW5kZXJlciBmb3IgdGhlIGNoaXAuICovXG4gIHByaXZhdGUgX2NoaXBSaXBwbGU6IFJpcHBsZVJlbmRlcmVyO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIGVsZW1lbnQgdGhhdCBhY3RzIGFzIHRoZSBjaGlwJ3MgcmlwcGxlIHRhcmdldC4gVGhpcyBlbGVtZW50IGlzXG4gICAqIGR5bmFtaWNhbGx5IGFkZGVkIGFzIGEgY2hpbGQgbm9kZSBvZiB0aGUgY2hpcC4gVGhlIGNoaXAgaXRzZWxmIGNhbm5vdCBiZSB1c2VkIGFzIHRoZVxuICAgKiByaXBwbGUgdGFyZ2V0IGJlY2F1c2UgaXQgbXVzdCBiZSB0aGUgaG9zdCBvZiB0aGUgZm9jdXMgaW5kaWNhdG9yLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hpcFJpcHBsZVRhcmdldDogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIFJpcHBsZSBjb25maWd1cmF0aW9uIGZvciByaXBwbGVzIHRoYXQgYXJlIGxhdW5jaGVkIG9uIHBvaW50ZXIgZG93bi4gVGhlIHJpcHBsZSBjb25maWdcbiAgICogaXMgc2V0IHRvIHRoZSBnbG9iYWwgcmlwcGxlIG9wdGlvbnMgc2luY2Ugd2UgZG9uJ3QgaGF2ZSBhbnkgY29uZmlndXJhYmxlIG9wdGlvbnMgZm9yXG4gICAqIHRoZSBjaGlwIHJpcHBsZXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJpcHBsZUNvbmZpZzogUmlwcGxlQ29uZmlnICYgUmlwcGxlR2xvYmFsT3B0aW9ucztcblxuICAvKipcbiAgICogV2hldGhlciByaXBwbGVzIGFyZSBkaXNhYmxlZCBvbiBpbnRlcmFjdGlvblxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgcmlwcGxlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuZGlzYWJsZWQgfHxcbiAgICAgIHRoaXMuZGlzYWJsZVJpcHBsZSB8fFxuICAgICAgdGhpcy5fYW5pbWF0aW9uc0Rpc2FibGVkIHx8XG4gICAgICAhIXRoaXMucmlwcGxlQ29uZmlnLmRpc2FibGVkXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGhhcyBmb2N1cy4gKi9cbiAgX2hhc0ZvY3VzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgYW5pbWF0aW9ucyBmb3IgdGhlIGNoaXAgYXJlIGVuYWJsZWQuICovXG4gIF9hbmltYXRpb25zRGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgbGlzdCBpcyBzZWxlY3RhYmxlICovXG4gIGNoaXBMaXN0U2VsZWN0YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgbGlzdCBpcyBpbiBtdWx0aS1zZWxlY3Rpb24gbW9kZS4gKi9cbiAgX2NoaXBMaXN0TXVsdGlwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBsaXN0IGFzIGEgd2hvbGUgaXMgZGlzYWJsZWQuICovXG4gIF9jaGlwTGlzdERpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBjaGlwIGF2YXRhciAqL1xuICBAQ29udGVudENoaWxkKE1BVF9DSElQX0FWQVRBUikgYXZhdGFyOiBNYXRDaGlwQXZhdGFyO1xuXG4gIC8qKiBUaGUgY2hpcCdzIHRyYWlsaW5nIGljb24uICovXG4gIEBDb250ZW50Q2hpbGQoTUFUX0NISVBfVFJBSUxJTkdfSUNPTikgdHJhaWxpbmdJY29uOiBNYXRDaGlwVHJhaWxpbmdJY29uO1xuXG4gIC8qKiBUaGUgY2hpcCdzIHJlbW92ZSB0b2dnbGVyLiAqL1xuICBAQ29udGVudENoaWxkKE1BVF9DSElQX1JFTU9WRSkgcmVtb3ZlSWNvbjogTWF0Q2hpcFJlbW92ZTtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBpcyBzZWxlY3RlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIGNvbnN0IGNvZXJjZWRWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAoY29lcmNlZFZhbHVlICE9PSB0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSBjb2VyY2VkVmFsdWU7XG4gICAgICB0aGlzLl9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZSgpO1xuICAgIH1cbiAgfVxuICBwcm90ZWN0ZWQgX3NlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGUgY2hpcC4gRGVmYXVsdHMgdG8gdGhlIGNvbnRlbnQgaW5zaWRlIGA8bWF0LWNoaXA+YCB0YWdzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWUgIT09IHVuZGVmaW5lZCA/IHRoaXMuX3ZhbHVlIDogdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnRleHRDb250ZW50O1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgfVxuICBwcm90ZWN0ZWQgX3ZhbHVlOiBhbnk7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSBjaGlwIGlzIHNlbGVjdGFibGUuIFdoZW4gYSBjaGlwIGlzIG5vdCBzZWxlY3RhYmxlLFxuICAgKiBjaGFuZ2VzIHRvIGl0cyBzZWxlY3RlZCBzdGF0ZSBhcmUgYWx3YXlzIGlnbm9yZWQuIEJ5IGRlZmF1bHQgYSBjaGlwIGlzXG4gICAqIHNlbGVjdGFibGUsIGFuZCBpdCBiZWNvbWVzIG5vbi1zZWxlY3RhYmxlIGlmIGl0cyBwYXJlbnQgY2hpcCBsaXN0IGlzXG4gICAqIG5vdCBzZWxlY3RhYmxlLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGFibGUgJiYgdGhpcy5jaGlwTGlzdFNlbGVjdGFibGU7XG4gIH1cbiAgc2V0IHNlbGVjdGFibGUodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3NlbGVjdGFibGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfc2VsZWN0YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fY2hpcExpc3REaXNhYmxlZCB8fCB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcm90ZWN0ZWQgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciBvciBub3QgdGhlIGNoaXAgZGlzcGxheXMgdGhlIHJlbW92ZSBzdHlsaW5nIGFuZCBlbWl0cyAocmVtb3ZlZCkgZXZlbnRzLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlbW92YWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVtb3ZhYmxlO1xuICB9XG4gIHNldCByZW1vdmFibGUodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3JlbW92YWJsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJvdGVjdGVkIF9yZW1vdmFibGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjaGlwIGlzIGZvY3VzZWQuICovXG4gIHJlYWRvbmx5IF9vbkZvY3VzID0gbmV3IFN1YmplY3Q8TWF0Q2hpcEV2ZW50PigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjaGlwIGlzIGJsdXJlZC4gKi9cbiAgcmVhZG9ubHkgX29uQmx1ciA9IG5ldyBTdWJqZWN0PE1hdENoaXBFdmVudD4oKTtcblxuICAvKiogRW1pdHRlZCB3aGVuIHRoZSBjaGlwIGlzIHNlbGVjdGVkIG9yIGRlc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3Rpb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRDaGlwU2VsZWN0aW9uQ2hhbmdlPiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRDaGlwU2VsZWN0aW9uQ2hhbmdlPigpO1xuXG4gIC8qKiBFbWl0dGVkIHdoZW4gdGhlIGNoaXAgaXMgZGVzdHJveWVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZGVzdHJveWVkOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PigpO1xuXG4gIC8qKiBFbWl0dGVkIHdoZW4gYSBjaGlwIGlzIHRvIGJlIHJlbW92ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSByZW1vdmVkOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PigpO1xuXG4gIC8qKiBUaGUgQVJJQSBzZWxlY3RlZCBhcHBsaWVkIHRvIHRoZSBjaGlwLiAqL1xuICBnZXQgYXJpYVNlbGVjdGVkKCk6IHN0cmluZyB8IG51bGwge1xuICAgIC8vIFJlbW92ZSB0aGUgYGFyaWEtc2VsZWN0ZWRgIHdoZW4gdGhlIGNoaXAgaXMgZGVzZWxlY3RlZCBpbiBzaW5nbGUtc2VsZWN0aW9uIG1vZGUsIGJlY2F1c2VcbiAgICAvLyBpdCBhZGRzIG5vaXNlIHRvIE5WREEgdXNlcnMgd2hlcmUgXCJub3Qgc2VsZWN0ZWRcIiB3aWxsIGJlIHJlYWQgb3V0IGZvciBlYWNoIGNoaXAuXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0YWJsZSAmJiAodGhpcy5fY2hpcExpc3RNdWx0aXBsZSB8fCB0aGlzLnNlbGVjdGVkKVxuICAgICAgPyB0aGlzLnNlbGVjdGVkLnRvU3RyaW5nKClcbiAgICAgIDogbnVsbDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUylcbiAgICBnbG9iYWxSaXBwbGVPcHRpb25zOiBSaXBwbGVHbG9iYWxPcHRpb25zIHwgbnVsbCxcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleD86IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLl9hZGRIb3N0Q2xhc3NOYW1lKCk7XG5cbiAgICAvLyBEeW5hbWljYWxseSBjcmVhdGUgdGhlIHJpcHBsZSB0YXJnZXQsIGFwcGVuZCBpdCB3aXRoaW4gdGhlIGNoaXAsIGFuZCB1c2UgaXQgYXMgdGhlXG4gICAgLy8gY2hpcCdzIHJpcHBsZSB0YXJnZXQuIEFkZGluZyB0aGUgY2xhc3MgJy5tYXQtY2hpcC1yaXBwbGUnIGVuc3VyZXMgdGhhdCBpdCB3aWxsIGhhdmVcbiAgICAvLyB0aGUgcHJvcGVyIHN0eWxlcy5cbiAgICB0aGlzLl9jaGlwUmlwcGxlVGFyZ2V0ID0gX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX2NoaXBSaXBwbGVUYXJnZXQuY2xhc3NMaXN0LmFkZCgnbWF0LWNoaXAtcmlwcGxlJyk7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX2NoaXBSaXBwbGVUYXJnZXQpO1xuICAgIHRoaXMuX2NoaXBSaXBwbGUgPSBuZXcgUmlwcGxlUmVuZGVyZXIodGhpcywgX25nWm9uZSwgdGhpcy5fY2hpcFJpcHBsZVRhcmdldCwgcGxhdGZvcm0pO1xuICAgIHRoaXMuX2NoaXBSaXBwbGUuc2V0dXBUcmlnZ2VyRXZlbnRzKGVsZW1lbnRSZWYpO1xuXG4gICAgdGhpcy5yaXBwbGVDb25maWcgPSBnbG9iYWxSaXBwbGVPcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCA9IGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucyc7XG4gICAgdGhpcy50YWJJbmRleCA9IHRhYkluZGV4ICE9IG51bGwgPyBwYXJzZUludCh0YWJJbmRleCkgfHwgLTEgOiAtMTtcbiAgfVxuXG4gIF9hZGRIb3N0Q2xhc3NOYW1lKCkge1xuICAgIGNvbnN0IGJhc2ljQ2hpcEF0dHJOYW1lID0gJ21hdC1iYXNpYy1jaGlwJztcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgaWYgKFxuICAgICAgZWxlbWVudC5oYXNBdHRyaWJ1dGUoYmFzaWNDaGlwQXR0ck5hbWUpIHx8XG4gICAgICBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gYmFzaWNDaGlwQXR0ck5hbWVcbiAgICApIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChiYXNpY0NoaXBBdHRyTmFtZSk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LXN0YW5kYXJkLWNoaXAnKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3llZC5lbWl0KHtjaGlwOiB0aGlzfSk7XG4gICAgdGhpcy5fY2hpcFJpcHBsZS5fcmVtb3ZlVHJpZ2dlckV2ZW50cygpO1xuICB9XG5cbiAgLyoqIFNlbGVjdHMgdGhlIGNoaXAuICovXG4gIHNlbGVjdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLl9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZSgpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERlc2VsZWN0cyB0aGUgY2hpcC4gKi9cbiAgZGVzZWxlY3QoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZWxlY3QgdGhpcyBjaGlwIGFuZCBlbWl0IHNlbGVjdGVkIGV2ZW50ICovXG4gIHNlbGVjdFZpYUludGVyYWN0aW9uKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKHRydWUpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIGN1cnJlbnQgc2VsZWN0ZWQgc3RhdGUgb2YgdGhpcyBjaGlwLiAqL1xuICB0b2dnbGVTZWxlY3RlZChpc1VzZXJJbnB1dDogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSAhdGhpcy5zZWxlY3RlZDtcbiAgICB0aGlzLl9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZShpc1VzZXJJbnB1dCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWQ7XG4gIH1cblxuICAvKiogQWxsb3dzIGZvciBwcm9ncmFtbWF0aWMgZm9jdXNpbmcgb2YgdGhlIGNoaXAuICovXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5faGFzRm9jdXMpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5fb25Gb2N1cy5uZXh0KHtjaGlwOiB0aGlzfSk7XG4gICAgfVxuICAgIHRoaXMuX2hhc0ZvY3VzID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgZm9yIHByb2dyYW1tYXRpYyByZW1vdmFsIG9mIHRoZSBjaGlwLiBDYWxsZWQgYnkgdGhlIE1hdENoaXBMaXN0IHdoZW4gdGhlIERFTEVURSBvclxuICAgKiBCQUNLU1BBQ0Uga2V5cyBhcmUgcHJlc3NlZC5cbiAgICpcbiAgICogSW5mb3JtcyBhbnkgbGlzdGVuZXJzIG9mIHRoZSByZW1vdmFsIHJlcXVlc3QuIERvZXMgbm90IHJlbW92ZSB0aGUgY2hpcCBmcm9tIHRoZSBET00uXG4gICAqL1xuICByZW1vdmUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucmVtb3ZhYmxlKSB7XG4gICAgICB0aGlzLnJlbW92ZWQuZW1pdCh7Y2hpcDogdGhpc30pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGNsaWNrIGV2ZW50cyBvbiB0aGUgY2hpcC4gKi9cbiAgX2hhbmRsZUNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlIGN1c3RvbSBrZXkgcHJlc3Nlcy4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBERUxFVEU6XG4gICAgICBjYXNlIEJBQ0tTUEFDRTpcbiAgICAgICAgLy8gSWYgd2UgYXJlIHJlbW92YWJsZSwgcmVtb3ZlIHRoZSBmb2N1c2VkIGNoaXBcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgLy8gQWx3YXlzIHByZXZlbnQgc28gcGFnZSBuYXZpZ2F0aW9uIGRvZXMgbm90IG9jY3VyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTUEFDRTpcbiAgICAgICAgLy8gSWYgd2UgYXJlIHNlbGVjdGFibGUsIHRvZ2dsZSB0aGUgZm9jdXNlZCBjaGlwXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGFibGUpIHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZVNlbGVjdGVkKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWx3YXlzIHByZXZlbnQgc3BhY2UgZnJvbSBzY3JvbGxpbmcgdGhlIHBhZ2Ugc2luY2UgdGhlIGxpc3QgaGFzIGZvY3VzXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9ibHVyKCk6IHZvaWQge1xuICAgIC8vIFdoZW4gYW5pbWF0aW9ucyBhcmUgZW5hYmxlZCwgQW5ndWxhciBtYXkgZW5kIHVwIHJlbW92aW5nIHRoZSBjaGlwIGZyb20gdGhlIERPTSBhIGxpdHRsZVxuICAgIC8vIGVhcmxpZXIgdGhhbiB1c3VhbCwgY2F1c2luZyBpdCB0byBiZSBibHVycmVkIGFuZCB0aHJvd2luZyBvZmYgdGhlIGxvZ2ljIGluIHRoZSBjaGlwIGxpc3RcbiAgICAvLyB0aGF0IG1vdmVzIGZvY3VzIG5vdCB0aGUgbmV4dCBpdGVtLiBUbyB3b3JrIGFyb3VuZCB0aGUgaXNzdWUsIHdlIGRlZmVyIG1hcmtpbmcgdGhlIGNoaXBcbiAgICAvLyBhcyBub3QgZm9jdXNlZCB1bnRpbCB0aGUgbmV4dCB0aW1lIHRoZSB6b25lIHN0YWJpbGl6ZXMuXG4gICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl9oYXNGb2N1cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9vbkJsdXIubmV4dCh7Y2hpcDogdGhpc30pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZShpc1VzZXJJbnB1dCA9IGZhbHNlKSB7XG4gICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh7XG4gICAgICBzb3VyY2U6IHRoaXMsXG4gICAgICBpc1VzZXJJbnB1dCxcbiAgICAgIHNlbGVjdGVkOiB0aGlzLl9zZWxlY3RlZCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEFwcGxpZXMgcHJvcGVyIChjbGljaykgc3VwcG9ydCBhbmQgYWRkcyBzdHlsaW5nIGZvciB1c2Ugd2l0aCB0aGUgTWF0ZXJpYWwgRGVzaWduIFwiY2FuY2VsXCIgaWNvblxuICogYXZhaWxhYmxlIGF0IGh0dHBzOi8vbWF0ZXJpYWwuaW8vaWNvbnMvI2ljX2NhbmNlbC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgICBgPG1hdC1jaGlwPlxuICogICAgICAgPG1hdC1pY29uIG1hdENoaXBSZW1vdmU+Y2FuY2VsPC9tYXQtaWNvbj5cbiAqICAgICA8L21hdC1jaGlwPmBcbiAqXG4gKiBZb3UgKm1heSogdXNlIGEgY3VzdG9tIGljb24sIGJ1dCB5b3UgbWF5IG5lZWQgdG8gb3ZlcnJpZGUgdGhlIGBtYXQtY2hpcC1yZW1vdmVgIHBvc2l0aW9uaW5nXG4gKiBzdHlsZXMgdG8gcHJvcGVybHkgY2VudGVyIHRoZSBpY29uIHdpdGhpbiB0aGUgY2hpcC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdENoaXBSZW1vdmVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2hpcC1yZW1vdmUgbWF0LWNoaXAtdHJhaWxpbmctaWNvbicsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCRldmVudCknLFxuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX0NISVBfUkVNT1ZFLCB1c2VFeGlzdGluZzogTWF0Q2hpcFJlbW92ZX1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwUmVtb3ZlIHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9wYXJlbnRDaGlwOiBNYXRDaGlwLCBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIGlmIChlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQubm9kZU5hbWUgPT09ICdCVVRUT04nKSB7XG4gICAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDYWxscyB0aGUgcGFyZW50IGNoaXAncyBwdWJsaWMgYHJlbW92ZSgpYCBtZXRob2QgaWYgYXBwbGljYWJsZS4gKi9cbiAgX2hhbmRsZUNsaWNrKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IHBhcmVudENoaXAgPSB0aGlzLl9wYXJlbnRDaGlwO1xuXG4gICAgaWYgKHBhcmVudENoaXAucmVtb3ZhYmxlICYmICFwYXJlbnRDaGlwLmRpc2FibGVkKSB7XG4gICAgICBwYXJlbnRDaGlwLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gc3RvcCBldmVudCBwcm9wYWdhdGlvbiBiZWNhdXNlIG90aGVyd2lzZSB0aGUgZXZlbnQgd2lsbCBidWJibGUgdXAgdG8gdGhlXG4gICAgLy8gZm9ybSBmaWVsZCBhbmQgY2F1c2UgdGhlIGBvbkNvbnRhaW5lckNsaWNrYCBtZXRob2QgdG8gYmUgaW52b2tlZC4gVGhpcyBtZXRob2Qgd291bGQgdGhlblxuICAgIC8vIHJlc2V0IHRoZSBmb2N1c2VkIGNoaXAgdGhhdCBoYXMgYmVlbiBmb2N1c2VkIGFmdGVyIGNoaXAgcmVtb3ZhbC4gVXN1YWxseSB0aGUgcGFyZW50XG4gICAgLy8gdGhlIHBhcmVudCBjbGljayBsaXN0ZW5lciBvZiB0aGUgYE1hdENoaXBgIHdvdWxkIHByZXZlbnQgcHJvcGFnYXRpb24sIGJ1dCBpdCBjYW4gaGFwcGVuXG4gICAgLy8gdGhhdCB0aGUgY2hpcCBpcyBiZWluZyByZW1vdmVkIGJlZm9yZSB0aGUgZXZlbnQgYnViYmxlcyB1cC5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxufVxuIl19