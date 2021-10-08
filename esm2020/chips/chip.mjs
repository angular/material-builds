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
MatChipAvatar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatChipAvatar, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatChipAvatar.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatChipAvatar, selector: "mat-chip-avatar, [matChipAvatar]", host: { classAttribute: "mat-chip-avatar" }, providers: [{ provide: MAT_CHIP_AVATAR, useExisting: MatChipAvatar }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatChipAvatar, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-chip-avatar, [matChipAvatar]',
                    host: { 'class': 'mat-chip-avatar' },
                    providers: [{ provide: MAT_CHIP_AVATAR, useExisting: MatChipAvatar }]
                }]
        }] });
/**
 * Dummy directive to add CSS class to chip trailing icon.
 * @docs-private
 */
export class MatChipTrailingIcon {
}
MatChipTrailingIcon.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatChipTrailingIcon, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatChipTrailingIcon.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatChipTrailingIcon, selector: "mat-chip-trailing-icon, [matChipTrailingIcon]", host: { classAttribute: "mat-chip-trailing-icon" }, providers: [{ provide: MAT_CHIP_TRAILING_ICON, useExisting: MatChipTrailingIcon }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatChipTrailingIcon, decorators: [{
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
MatChip.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatChip, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i1.Platform }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: i0.ChangeDetectorRef }, { token: DOCUMENT }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Directive });
MatChip.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatChip, selector: "mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]", inputs: { color: "color", disableRipple: "disableRipple", tabIndex: "tabIndex", selected: "selected", value: "value", selectable: "selectable", disabled: "disabled", removable: "removable" }, outputs: { selectionChange: "selectionChange", destroyed: "destroyed", removed: "removed" }, host: { attributes: { "role": "option" }, listeners: { "click": "_handleClick($event)", "keydown": "_handleKeydown($event)", "focus": "focus()", "blur": "_blur()" }, properties: { "attr.tabindex": "disabled ? null : tabIndex", "class.mat-chip-selected": "selected", "class.mat-chip-with-avatar": "avatar", "class.mat-chip-with-trailing-icon": "trailingIcon || removeIcon", "class.mat-chip-disabled": "disabled", "class._mat-animation-noopable": "_animationsDisabled", "attr.disabled": "disabled || null", "attr.aria-disabled": "disabled.toString()", "attr.aria-selected": "ariaSelected" }, classAttribute: "mat-chip mat-focus-indicator" }, queries: [{ propertyName: "avatar", first: true, predicate: MAT_CHIP_AVATAR, descendants: true }, { propertyName: "trailingIcon", first: true, predicate: MAT_CHIP_TRAILING_ICON, descendants: true }, { propertyName: "removeIcon", first: true, predicate: MAT_CHIP_REMOVE, descendants: true }], exportAs: ["matChip"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatChip, decorators: [{
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
MatChipRemove.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatChipRemove, deps: [{ token: MatChip }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
MatChipRemove.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatChipRemove, selector: "[matChipRemove]", host: { listeners: { "click": "_handleClick($event)" }, classAttribute: "mat-chip-remove mat-chip-trailing-icon" }, providers: [{ provide: MAT_CHIP_REMOVE, useExisting: MatChipRemove }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatChipRemove, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy9jaGlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sRUFBZSxxQkFBcUIsRUFBYyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZGLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsWUFBWSxFQUNaLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFLTCx5QkFBeUIsRUFDekIsVUFBVSxFQUNWLGtCQUFrQixFQUNsQixhQUFhLEVBR2IsY0FBYyxHQUVmLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7OztBQVNwQyxtRUFBbUU7QUFDbkUsTUFBTSxPQUFPLHNCQUFzQjtJQUNqQztJQUNFLG9EQUFvRDtJQUM3QyxNQUFlO0lBQ3RCLDJEQUEyRDtJQUNwRCxRQUFpQjtJQUN4Qix1RUFBdUU7SUFDaEUsY0FBYyxLQUFLO1FBSm5CLFdBQU0sR0FBTixNQUFNLENBQVM7UUFFZixhQUFRLEdBQVIsUUFBUSxDQUFTO1FBRWpCLGdCQUFXLEdBQVgsV0FBVyxDQUFRO0lBQUksQ0FB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LENBQUM7SUFDMUIsQ0FBQzs7a0hBdkJVLGFBQWEsa0JBRUMsT0FBTztzR0FGckIsYUFBYSw4SkFGYixDQUFDLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFDLENBQUM7bUdBRXhELGFBQWE7a0JBUnpCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSx3Q0FBd0M7d0JBQ2pELFNBQVMsRUFBRSxzQkFBc0I7cUJBQ2xDO29CQUNELFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLGVBQWUsRUFBQyxDQUFDO2lCQUNwRTswREFHMEIsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzYWJsZU9wdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgTnVtYmVySW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0JBQ0tTUEFDRSwgREVMRVRFLCBTUEFDRX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29udGVudENoaWxkLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkNvbG9yLFxuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBIYXNUYWJJbmRleCxcbiAgTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUyxcbiAgbWl4aW5Db2xvcixcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBtaXhpblRhYkluZGV4LFxuICBSaXBwbGVDb25maWcsXG4gIFJpcHBsZUdsb2JhbE9wdGlvbnMsXG4gIFJpcHBsZVJlbmRlcmVyLFxuICBSaXBwbGVUYXJnZXQsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cblxuLyoqIFJlcHJlc2VudHMgYW4gZXZlbnQgZmlyZWQgb24gYW4gaW5kaXZpZHVhbCBgbWF0LWNoaXBgLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRDaGlwRXZlbnQge1xuICAvKiogVGhlIGNoaXAgdGhlIGV2ZW50IHdhcyBmaXJlZCBvbi4gKi9cbiAgY2hpcDogTWF0Q2hpcDtcbn1cblxuLyoqIEV2ZW50IG9iamVjdCBlbWl0dGVkIGJ5IE1hdENoaXAgd2hlbiBzZWxlY3RlZCBvciBkZXNlbGVjdGVkLiAqL1xuZXhwb3J0IGNsYXNzIE1hdENoaXBTZWxlY3Rpb25DaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjaGlwIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0Q2hpcCxcbiAgICAvKiogV2hldGhlciB0aGUgY2hpcCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50IGlzIHNlbGVjdGVkLiAqL1xuICAgIHB1YmxpYyBzZWxlY3RlZDogYm9vbGVhbixcbiAgICAvKiogV2hldGhlciB0aGUgc2VsZWN0aW9uIGNoYW5nZSB3YXMgYSByZXN1bHQgb2YgYSB1c2VyIGludGVyYWN0aW9uLiAqL1xuICAgIHB1YmxpYyBpc1VzZXJJbnB1dCA9IGZhbHNlKSB7IH1cbn1cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRDaGlwUmVtb3ZlYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRDaGlwUmVtb3ZlYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9DSElQX1JFTU9WRSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRDaGlwUmVtb3ZlPignTWF0Q2hpcFJlbW92ZScpO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYE1hdENoaXBBdmF0YXJgLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdENoaXBBdmF0YXJgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0NISVBfQVZBVEFSID0gbmV3IEluamVjdGlvblRva2VuPE1hdENoaXBBdmF0YXI+KCdNYXRDaGlwQXZhdGFyJyk7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGluc3RhbmNlcyBvZiBgTWF0Q2hpcFRyYWlsaW5nSWNvbmAuIEl0IHNlcnZlcyBhc1xuICogYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0Q2hpcFRyYWlsaW5nSWNvbmAgY2xhc3Mgd2hpY2ggY291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBkaXJlY3RpdmUgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQ0hJUF9UUkFJTElOR19JQ09OID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0Q2hpcFRyYWlsaW5nSWNvbj4oJ01hdENoaXBUcmFpbGluZ0ljb24nKTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRDaGlwLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmFic3RyYWN0IGNsYXNzIE1hdENoaXBCYXNlIHtcbiAgYWJzdHJhY3QgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn1cblxuY29uc3QgX01hdENoaXBNaXhpbkJhc2UgPSBtaXhpblRhYkluZGV4KG1peGluQ29sb3IobWl4aW5EaXNhYmxlUmlwcGxlKE1hdENoaXBCYXNlKSwgJ3ByaW1hcnknKSwgLTEpO1xuXG4vKipcbiAqIER1bW15IGRpcmVjdGl2ZSB0byBhZGQgQ1NTIGNsYXNzIHRvIGNoaXAgYXZhdGFyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hpcC1hdmF0YXIsIFttYXRDaGlwQXZhdGFyXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNoaXAtYXZhdGFyJ30sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfQ0hJUF9BVkFUQVIsIHVzZUV4aXN0aW5nOiBNYXRDaGlwQXZhdGFyfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcEF2YXRhciB7fVxuXG4vKipcbiAqIER1bW15IGRpcmVjdGl2ZSB0byBhZGQgQ1NTIGNsYXNzIHRvIGNoaXAgdHJhaWxpbmcgaWNvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWNoaXAtdHJhaWxpbmctaWNvbiwgW21hdENoaXBUcmFpbGluZ0ljb25dJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2hpcC10cmFpbGluZy1pY29uJ30sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfQ0hJUF9UUkFJTElOR19JQ09OLCB1c2VFeGlzdGluZzogTWF0Q2hpcFRyYWlsaW5nSWNvbn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwVHJhaWxpbmdJY29uIHt9XG5cblxuLyoqXG4gKiBNYXRlcmlhbCBkZXNpZ24gc3R5bGVkIENoaXAgY29tcG9uZW50LiBVc2VkIGluc2lkZSB0aGUgTWF0Q2hpcExpc3QgY29tcG9uZW50LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBtYXQtYmFzaWMtY2hpcCwgW21hdC1iYXNpYy1jaGlwXSwgbWF0LWNoaXAsIFttYXQtY2hpcF1gLFxuICBpbnB1dHM6IFsnY29sb3InLCAnZGlzYWJsZVJpcHBsZScsICd0YWJJbmRleCddLFxuICBleHBvcnRBczogJ21hdENoaXAnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jaGlwIG1hdC1mb2N1cy1pbmRpY2F0b3InLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnZGlzYWJsZWQgPyBudWxsIDogdGFiSW5kZXgnLFxuICAgICdyb2xlJzogJ29wdGlvbicsXG4gICAgJ1tjbGFzcy5tYXQtY2hpcC1zZWxlY3RlZF0nOiAnc2VsZWN0ZWQnLFxuICAgICdbY2xhc3MubWF0LWNoaXAtd2l0aC1hdmF0YXJdJzogJ2F2YXRhcicsXG4gICAgJ1tjbGFzcy5tYXQtY2hpcC13aXRoLXRyYWlsaW5nLWljb25dJzogJ3RyYWlsaW5nSWNvbiB8fCByZW1vdmVJY29uJyxcbiAgICAnW2NsYXNzLm1hdC1jaGlwLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbnNEaXNhYmxlZCcsXG4gICAgJ1thdHRyLmRpc2FibGVkXSc6ICdkaXNhYmxlZCB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtc2VsZWN0ZWRdJzogJ2FyaWFTZWxlY3RlZCcsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCRldmVudCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJyhmb2N1cyknOiAnZm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfYmx1cigpJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcCBleHRlbmRzIF9NYXRDaGlwTWl4aW5CYXNlIGltcGxlbWVudHMgRm9jdXNhYmxlT3B0aW9uLCBPbkRlc3Ryb3ksIENhbkNvbG9yLFxuICBDYW5EaXNhYmxlUmlwcGxlLCBSaXBwbGVUYXJnZXQsIEhhc1RhYkluZGV4LCBDYW5EaXNhYmxlIHtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBSaXBwbGVSZW5kZXJlciBmb3IgdGhlIGNoaXAuICovXG4gIHByaXZhdGUgX2NoaXBSaXBwbGU6IFJpcHBsZVJlbmRlcmVyO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIGVsZW1lbnQgdGhhdCBhY3RzIGFzIHRoZSBjaGlwJ3MgcmlwcGxlIHRhcmdldC4gVGhpcyBlbGVtZW50IGlzXG4gICAqIGR5bmFtaWNhbGx5IGFkZGVkIGFzIGEgY2hpbGQgbm9kZSBvZiB0aGUgY2hpcC4gVGhlIGNoaXAgaXRzZWxmIGNhbm5vdCBiZSB1c2VkIGFzIHRoZVxuICAgKiByaXBwbGUgdGFyZ2V0IGJlY2F1c2UgaXQgbXVzdCBiZSB0aGUgaG9zdCBvZiB0aGUgZm9jdXMgaW5kaWNhdG9yLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hpcFJpcHBsZVRhcmdldDogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIFJpcHBsZSBjb25maWd1cmF0aW9uIGZvciByaXBwbGVzIHRoYXQgYXJlIGxhdW5jaGVkIG9uIHBvaW50ZXIgZG93bi4gVGhlIHJpcHBsZSBjb25maWdcbiAgICogaXMgc2V0IHRvIHRoZSBnbG9iYWwgcmlwcGxlIG9wdGlvbnMgc2luY2Ugd2UgZG9uJ3QgaGF2ZSBhbnkgY29uZmlndXJhYmxlIG9wdGlvbnMgZm9yXG4gICAqIHRoZSBjaGlwIHJpcHBsZXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJpcHBsZUNvbmZpZzogUmlwcGxlQ29uZmlnICYgUmlwcGxlR2xvYmFsT3B0aW9ucztcblxuICAvKipcbiAgICogV2hldGhlciByaXBwbGVzIGFyZSBkaXNhYmxlZCBvbiBpbnRlcmFjdGlvblxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgcmlwcGxlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlUmlwcGxlIHx8IHRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCB8fFxuICAgICAgICAgICAhIXRoaXMucmlwcGxlQ29uZmlnLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgaGFzIGZvY3VzLiAqL1xuICBfaGFzRm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciBhbmltYXRpb25zIGZvciB0aGUgY2hpcCBhcmUgZW5hYmxlZC4gKi9cbiAgX2FuaW1hdGlvbnNEaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBsaXN0IGlzIHNlbGVjdGFibGUgKi9cbiAgY2hpcExpc3RTZWxlY3RhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBsaXN0IGlzIGluIG11bHRpLXNlbGVjdGlvbiBtb2RlLiAqL1xuICBfY2hpcExpc3RNdWx0aXBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGxpc3QgYXMgYSB3aG9sZSBpcyBkaXNhYmxlZC4gKi9cbiAgX2NoaXBMaXN0RGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIGNoaXAgYXZhdGFyICovXG4gIEBDb250ZW50Q2hpbGQoTUFUX0NISVBfQVZBVEFSKSBhdmF0YXI6IE1hdENoaXBBdmF0YXI7XG5cbiAgLyoqIFRoZSBjaGlwJ3MgdHJhaWxpbmcgaWNvbi4gKi9cbiAgQENvbnRlbnRDaGlsZChNQVRfQ0hJUF9UUkFJTElOR19JQ09OKSB0cmFpbGluZ0ljb246IE1hdENoaXBUcmFpbGluZ0ljb247XG5cbiAgLyoqIFRoZSBjaGlwJ3MgcmVtb3ZlIHRvZ2dsZXIuICovXG4gIEBDb250ZW50Q2hpbGQoTUFUX0NISVBfUkVNT1ZFKSByZW1vdmVJY29uOiBNYXRDaGlwUmVtb3ZlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGlzIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9zZWxlY3RlZDsgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBjb2VyY2VkVmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKGNvZXJjZWRWYWx1ZSAhPT0gdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gY29lcmNlZFZhbHVlO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cbiAgcHJvdGVjdGVkIF9zZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhlIGNoaXAuIERlZmF1bHRzIHRvIHRoZSBjb250ZW50IGluc2lkZSBgPG1hdC1jaGlwPmAgdGFncy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlICE9PSB1bmRlZmluZWRcbiAgICAgID8gdGhpcy5fdmFsdWVcbiAgICAgIDogdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnRleHRDb250ZW50O1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7IHRoaXMuX3ZhbHVlID0gdmFsdWU7IH1cbiAgcHJvdGVjdGVkIF92YWx1ZTogYW55O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgY2hpcCBpcyBzZWxlY3RhYmxlLiBXaGVuIGEgY2hpcCBpcyBub3Qgc2VsZWN0YWJsZSxcbiAgICogY2hhbmdlcyB0byBpdHMgc2VsZWN0ZWQgc3RhdGUgYXJlIGFsd2F5cyBpZ25vcmVkLiBCeSBkZWZhdWx0IGEgY2hpcCBpc1xuICAgKiBzZWxlY3RhYmxlLCBhbmQgaXQgYmVjb21lcyBub24tc2VsZWN0YWJsZSBpZiBpdHMgcGFyZW50IGNoaXAgbGlzdCBpc1xuICAgKiBub3Qgc2VsZWN0YWJsZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RhYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fc2VsZWN0YWJsZSAmJiB0aGlzLmNoaXBMaXN0U2VsZWN0YWJsZTsgfVxuICBzZXQgc2VsZWN0YWJsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3NlbGVjdGFibGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfc2VsZWN0YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NoaXBMaXN0RGlzYWJsZWQgfHwgdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgY2hpcCBkaXNwbGF5cyB0aGUgcmVtb3ZlIHN0eWxpbmcgYW5kIGVtaXRzIChyZW1vdmVkKSBldmVudHMuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVtb3ZhYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fcmVtb3ZhYmxlOyB9XG4gIHNldCByZW1vdmFibGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZW1vdmFibGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfcmVtb3ZhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY2hpcCBpcyBmb2N1c2VkLiAqL1xuICByZWFkb25seSBfb25Gb2N1cyA9IG5ldyBTdWJqZWN0PE1hdENoaXBFdmVudD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY2hpcCBpcyBibHVyZWQuICovXG4gIHJlYWRvbmx5IF9vbkJsdXIgPSBuZXcgU3ViamVjdDxNYXRDaGlwRXZlbnQ+KCk7XG5cbiAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgY2hpcCBpcyBzZWxlY3RlZCBvciBkZXNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcFNlbGVjdGlvbkNoYW5nZT4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRDaGlwU2VsZWN0aW9uQ2hhbmdlPigpO1xuXG4gIC8qKiBFbWl0dGVkIHdoZW4gdGhlIGNoaXAgaXMgZGVzdHJveWVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZGVzdHJveWVkOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PigpO1xuXG4gIC8qKiBFbWl0dGVkIHdoZW4gYSBjaGlwIGlzIHRvIGJlIHJlbW92ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSByZW1vdmVkOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PigpO1xuXG4gIC8qKiBUaGUgQVJJQSBzZWxlY3RlZCBhcHBsaWVkIHRvIHRoZSBjaGlwLiAqL1xuICBnZXQgYXJpYVNlbGVjdGVkKCk6IHN0cmluZyB8IG51bGwge1xuICAgIC8vIFJlbW92ZSB0aGUgYGFyaWEtc2VsZWN0ZWRgIHdoZW4gdGhlIGNoaXAgaXMgZGVzZWxlY3RlZCBpbiBzaW5nbGUtc2VsZWN0aW9uIG1vZGUsIGJlY2F1c2VcbiAgICAvLyBpdCBhZGRzIG5vaXNlIHRvIE5WREEgdXNlcnMgd2hlcmUgXCJub3Qgc2VsZWN0ZWRcIiB3aWxsIGJlIHJlYWQgb3V0IGZvciBlYWNoIGNoaXAuXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0YWJsZSAmJiAodGhpcy5fY2hpcExpc3RNdWx0aXBsZSB8fCB0aGlzLnNlbGVjdGVkKSA/XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQudG9TdHJpbmcoKSA6IG51bGw7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TKVxuICAgICAgICAgICAgICAgICAgZ2xvYmFsUmlwcGxlT3B0aW9uczogUmlwcGxlR2xvYmFsT3B0aW9ucyB8IG51bGwsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4Pzogc3RyaW5nKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLl9hZGRIb3N0Q2xhc3NOYW1lKCk7XG5cbiAgICAvLyBEeW5hbWljYWxseSBjcmVhdGUgdGhlIHJpcHBsZSB0YXJnZXQsIGFwcGVuZCBpdCB3aXRoaW4gdGhlIGNoaXAsIGFuZCB1c2UgaXQgYXMgdGhlXG4gICAgLy8gY2hpcCdzIHJpcHBsZSB0YXJnZXQuIEFkZGluZyB0aGUgY2xhc3MgJy5tYXQtY2hpcC1yaXBwbGUnIGVuc3VyZXMgdGhhdCBpdCB3aWxsIGhhdmVcbiAgICAvLyB0aGUgcHJvcGVyIHN0eWxlcy5cbiAgICB0aGlzLl9jaGlwUmlwcGxlVGFyZ2V0ID0gX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX2NoaXBSaXBwbGVUYXJnZXQuY2xhc3NMaXN0LmFkZCgnbWF0LWNoaXAtcmlwcGxlJyk7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX2NoaXBSaXBwbGVUYXJnZXQpO1xuICAgIHRoaXMuX2NoaXBSaXBwbGUgPSBuZXcgUmlwcGxlUmVuZGVyZXIodGhpcywgX25nWm9uZSwgdGhpcy5fY2hpcFJpcHBsZVRhcmdldCwgcGxhdGZvcm0pO1xuICAgIHRoaXMuX2NoaXBSaXBwbGUuc2V0dXBUcmlnZ2VyRXZlbnRzKGVsZW1lbnRSZWYpO1xuXG4gICAgdGhpcy5yaXBwbGVDb25maWcgPSBnbG9iYWxSaXBwbGVPcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCA9IGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucyc7XG4gICAgdGhpcy50YWJJbmRleCA9IHRhYkluZGV4ICE9IG51bGwgPyAocGFyc2VJbnQodGFiSW5kZXgpIHx8IC0xKSA6IC0xO1xuICB9XG5cbiAgX2FkZEhvc3RDbGFzc05hbWUoKSB7XG4gICAgY29uc3QgYmFzaWNDaGlwQXR0ck5hbWUgPSAnbWF0LWJhc2ljLWNoaXAnO1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICBpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoYmFzaWNDaGlwQXR0ck5hbWUpIHx8XG4gICAgICAgIGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBiYXNpY0NoaXBBdHRyTmFtZSkge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGJhc2ljQ2hpcEF0dHJOYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtc3RhbmRhcmQtY2hpcCcpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveWVkLmVtaXQoe2NoaXA6IHRoaXN9KTtcbiAgICB0aGlzLl9jaGlwUmlwcGxlLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG4gIH1cblxuICAvKiogU2VsZWN0cyB0aGUgY2hpcC4gKi9cbiAgc2VsZWN0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogRGVzZWxlY3RzIHRoZSBjaGlwLiAqL1xuICBkZXNlbGVjdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZSgpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNlbGVjdCB0aGlzIGNoaXAgYW5kIGVtaXQgc2VsZWN0ZWQgZXZlbnQgKi9cbiAgc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UodHJ1ZSk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgY3VycmVudCBzZWxlY3RlZCBzdGF0ZSBvZiB0aGlzIGNoaXAuICovXG4gIHRvZ2dsZVNlbGVjdGVkKGlzVXNlcklucHV0OiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcbiAgICB0aGlzLl9zZWxlY3RlZCA9ICF0aGlzLnNlbGVjdGVkO1xuICAgIHRoaXMuX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKGlzVXNlcklucHV0KTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZDtcbiAgfVxuXG4gIC8qKiBBbGxvd3MgZm9yIHByb2dyYW1tYXRpYyBmb2N1c2luZyBvZiB0aGUgY2hpcC4gKi9cbiAgZm9jdXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9oYXNGb2N1cykge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLl9vbkZvY3VzLm5leHQoe2NoaXA6IHRoaXN9KTtcbiAgICB9XG4gICAgdGhpcy5faGFzRm9jdXMgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBmb3IgcHJvZ3JhbW1hdGljIHJlbW92YWwgb2YgdGhlIGNoaXAuIENhbGxlZCBieSB0aGUgTWF0Q2hpcExpc3Qgd2hlbiB0aGUgREVMRVRFIG9yXG4gICAqIEJBQ0tTUEFDRSBrZXlzIGFyZSBwcmVzc2VkLlxuICAgKlxuICAgKiBJbmZvcm1zIGFueSBsaXN0ZW5lcnMgb2YgdGhlIHJlbW92YWwgcmVxdWVzdC4gRG9lcyBub3QgcmVtb3ZlIHRoZSBjaGlwIGZyb20gdGhlIERPTS5cbiAgICovXG4gIHJlbW92ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yZW1vdmFibGUpIHtcbiAgICAgIHRoaXMucmVtb3ZlZC5lbWl0KHtjaGlwOiB0aGlzfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgY2xpY2sgZXZlbnRzIG9uIHRoZSBjaGlwLiAqL1xuICBfaGFuZGxlQ2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGUgY3VzdG9tIGtleSBwcmVzc2VzLiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICBjYXNlIERFTEVURTpcbiAgICAgIGNhc2UgQkFDS1NQQUNFOlxuICAgICAgICAvLyBJZiB3ZSBhcmUgcmVtb3ZhYmxlLCByZW1vdmUgdGhlIGZvY3VzZWQgY2hpcFxuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAvLyBBbHdheXMgcHJldmVudCBzbyBwYWdlIG5hdmlnYXRpb24gZG9lcyBub3Qgb2NjdXJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNQQUNFOlxuICAgICAgICAvLyBJZiB3ZSBhcmUgc2VsZWN0YWJsZSwgdG9nZ2xlIHRoZSBmb2N1c2VkIGNoaXBcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0YWJsZSkge1xuICAgICAgICAgIHRoaXMudG9nZ2xlU2VsZWN0ZWQodHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbHdheXMgcHJldmVudCBzcGFjZSBmcm9tIHNjcm9sbGluZyB0aGUgcGFnZSBzaW5jZSB0aGUgbGlzdCBoYXMgZm9jdXNcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX2JsdXIoKTogdm9pZCB7XG4gICAgLy8gV2hlbiBhbmltYXRpb25zIGFyZSBlbmFibGVkLCBBbmd1bGFyIG1heSBlbmQgdXAgcmVtb3ZpbmcgdGhlIGNoaXAgZnJvbSB0aGUgRE9NIGEgbGl0dGxlXG4gICAgLy8gZWFybGllciB0aGFuIHVzdWFsLCBjYXVzaW5nIGl0IHRvIGJlIGJsdXJyZWQgYW5kIHRocm93aW5nIG9mZiB0aGUgbG9naWMgaW4gdGhlIGNoaXAgbGlzdFxuICAgIC8vIHRoYXQgbW92ZXMgZm9jdXMgbm90IHRoZSBuZXh0IGl0ZW0uIFRvIHdvcmsgYXJvdW5kIHRoZSBpc3N1ZSwgd2UgZGVmZXIgbWFya2luZyB0aGUgY2hpcFxuICAgIC8vIGFzIG5vdCBmb2N1c2VkIHVudGlsIHRoZSBuZXh0IHRpbWUgdGhlIHpvbmUgc3RhYmlsaXplcy5cbiAgICB0aGlzLl9uZ1pvbmUub25TdGFibGVcbiAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5faGFzRm9jdXMgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLl9vbkJsdXIubmV4dCh7Y2hpcDogdGhpc30pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UoaXNVc2VySW5wdXQgPSBmYWxzZSkge1xuICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQoe1xuICAgICAgc291cmNlOiB0aGlzLFxuICAgICAgaXNVc2VySW5wdXQsXG4gICAgICBzZWxlY3RlZDogdGhpcy5fc2VsZWN0ZWRcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zZWxlY3RlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2VsZWN0YWJsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVtb3ZhYmxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdGFiSW5kZXg6IE51bWJlcklucHV0O1xufVxuXG4vKipcbiAqIEFwcGxpZXMgcHJvcGVyIChjbGljaykgc3VwcG9ydCBhbmQgYWRkcyBzdHlsaW5nIGZvciB1c2Ugd2l0aCB0aGUgTWF0ZXJpYWwgRGVzaWduIFwiY2FuY2VsXCIgaWNvblxuICogYXZhaWxhYmxlIGF0IGh0dHBzOi8vbWF0ZXJpYWwuaW8vaWNvbnMvI2ljX2NhbmNlbC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgICBgPG1hdC1jaGlwPlxuICogICAgICAgPG1hdC1pY29uIG1hdENoaXBSZW1vdmU+Y2FuY2VsPC9tYXQtaWNvbj5cbiAqICAgICA8L21hdC1jaGlwPmBcbiAqXG4gKiBZb3UgKm1heSogdXNlIGEgY3VzdG9tIGljb24sIGJ1dCB5b3UgbWF5IG5lZWQgdG8gb3ZlcnJpZGUgdGhlIGBtYXQtY2hpcC1yZW1vdmVgIHBvc2l0aW9uaW5nXG4gKiBzdHlsZXMgdG8gcHJvcGVybHkgY2VudGVyIHRoZSBpY29uIHdpdGhpbiB0aGUgY2hpcC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdENoaXBSZW1vdmVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2hpcC1yZW1vdmUgbWF0LWNoaXAtdHJhaWxpbmctaWNvbicsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCRldmVudCknLFxuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX0NISVBfUkVNT1ZFLCB1c2VFeGlzdGluZzogTWF0Q2hpcFJlbW92ZX1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwUmVtb3ZlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIF9wYXJlbnRDaGlwOiBNYXRDaGlwLFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgaWYgKGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ub2RlTmFtZSA9PT0gJ0JVVFRPTicpIHtcbiAgICAgIGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJyk7XG4gICAgfVxuICAgfVxuXG4gIC8qKiBDYWxscyB0aGUgcGFyZW50IGNoaXAncyBwdWJsaWMgYHJlbW92ZSgpYCBtZXRob2QgaWYgYXBwbGljYWJsZS4gKi9cbiAgX2hhbmRsZUNsaWNrKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IHBhcmVudENoaXAgPSB0aGlzLl9wYXJlbnRDaGlwO1xuXG4gICAgaWYgKHBhcmVudENoaXAucmVtb3ZhYmxlICYmICFwYXJlbnRDaGlwLmRpc2FibGVkKSB7XG4gICAgICBwYXJlbnRDaGlwLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gc3RvcCBldmVudCBwcm9wYWdhdGlvbiBiZWNhdXNlIG90aGVyd2lzZSB0aGUgZXZlbnQgd2lsbCBidWJibGUgdXAgdG8gdGhlXG4gICAgLy8gZm9ybSBmaWVsZCBhbmQgY2F1c2UgdGhlIGBvbkNvbnRhaW5lckNsaWNrYCBtZXRob2QgdG8gYmUgaW52b2tlZC4gVGhpcyBtZXRob2Qgd291bGQgdGhlblxuICAgIC8vIHJlc2V0IHRoZSBmb2N1c2VkIGNoaXAgdGhhdCBoYXMgYmVlbiBmb2N1c2VkIGFmdGVyIGNoaXAgcmVtb3ZhbC4gVXN1YWxseSB0aGUgcGFyZW50XG4gICAgLy8gdGhlIHBhcmVudCBjbGljayBsaXN0ZW5lciBvZiB0aGUgYE1hdENoaXBgIHdvdWxkIHByZXZlbnQgcHJvcGFnYXRpb24sIGJ1dCBpdCBjYW4gaGFwcGVuXG4gICAgLy8gdGhhdCB0aGUgY2hpcCBpcyBiZWluZyByZW1vdmVkIGJlZm9yZSB0aGUgZXZlbnQgYnViYmxlcyB1cC5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxufVxuIl19