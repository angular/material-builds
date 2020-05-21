/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { DOCUMENT } from '@angular/common';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BACKSPACE, DELETE, SPACE } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import { ContentChild, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, NgZone, Optional, Output, ChangeDetectorRef, Attribute, } from '@angular/core';
import { mixinTabIndex, MAT_RIPPLE_GLOBAL_OPTIONS, mixinColor, mixinDisableRipple, RippleRenderer, } from '@angular/material/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
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
let MatChipAvatar = /** @class */ (() => {
    let MatChipAvatar = class MatChipAvatar {
    };
    MatChipAvatar = __decorate([
        Directive({
            selector: 'mat-chip-avatar, [matChipAvatar]',
            host: { 'class': 'mat-chip-avatar' }
        })
    ], MatChipAvatar);
    return MatChipAvatar;
})();
export { MatChipAvatar };
/**
 * Dummy directive to add CSS class to chip trailing icon.
 * @docs-private
 */
let MatChipTrailingIcon = /** @class */ (() => {
    let MatChipTrailingIcon = class MatChipTrailingIcon {
    };
    MatChipTrailingIcon = __decorate([
        Directive({
            selector: 'mat-chip-trailing-icon, [matChipTrailingIcon]',
            host: { 'class': 'mat-chip-trailing-icon' }
        })
    ], MatChipTrailingIcon);
    return MatChipTrailingIcon;
})();
export { MatChipTrailingIcon };
/**
 * Material design styled Chip component. Used inside the MatChipList component.
 */
let MatChip = /** @class */ (() => {
    let MatChip = class MatChip extends _MatChipMixinBase {
        constructor(_elementRef, _ngZone, platform, globalRippleOptions, 
        // @breaking-change 8.0.0 `animationMode` parameter to become required.
        animationMode, 
        // @breaking-change 9.0.0 `_changeDetectorRef` parameter to become required.
        _changeDetectorRef, tabIndex, 
        // @breaking-change 11.0.0 `_document` parameter to become required.
        _document) {
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
                this._markForCheck();
            }
        }
        /** Deselects the chip. */
        deselect() {
            if (this._selected) {
                this._selected = false;
                this._dispatchSelectionChange();
                this._markForCheck();
            }
        }
        /** Select this chip and emit selected event */
        selectViaInteraction() {
            if (!this._selected) {
                this._selected = true;
                this._dispatchSelectionChange(true);
                this._markForCheck();
            }
        }
        /** Toggles the current selected state of this chip. */
        toggleSelected(isUserInput = false) {
            this._selected = !this.selected;
            this._dispatchSelectionChange(isUserInput);
            this._markForCheck();
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
                .asObservable()
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
        _markForCheck() {
            // @breaking-change 9.0.0 Remove this method once the _changeDetectorRef is a required param.
            if (this._changeDetectorRef) {
                this._changeDetectorRef.markForCheck();
            }
        }
    };
    __decorate([
        ContentChild(MatChipAvatar),
        __metadata("design:type", MatChipAvatar)
    ], MatChip.prototype, "avatar", void 0);
    __decorate([
        ContentChild(MatChipTrailingIcon),
        __metadata("design:type", MatChipTrailingIcon)
    ], MatChip.prototype, "trailingIcon", void 0);
    __decorate([
        ContentChild(forwardRef(() => MatChipRemove)),
        __metadata("design:type", MatChipRemove)
    ], MatChip.prototype, "removeIcon", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatChip.prototype, "selected", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MatChip.prototype, "value", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatChip.prototype, "selectable", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatChip.prototype, "disabled", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatChip.prototype, "removable", null);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MatChip.prototype, "selectionChange", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MatChip.prototype, "destroyed", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MatChip.prototype, "removed", void 0);
    MatChip = __decorate([
        Directive({
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
        }),
        __param(3, Optional()), __param(3, Inject(MAT_RIPPLE_GLOBAL_OPTIONS)),
        __param(4, Optional()), __param(4, Inject(ANIMATION_MODULE_TYPE)),
        __param(6, Attribute('tabindex')),
        __param(7, Optional()), __param(7, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [ElementRef,
            NgZone,
            Platform, Object, String, ChangeDetectorRef, String, Object])
    ], MatChip);
    return MatChip;
})();
export { MatChip };
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
let MatChipRemove = /** @class */ (() => {
    let MatChipRemove = class MatChipRemove {
        constructor(_parentChip, 
        // @breaking-change 11.0.0 `elementRef` parameter to be made required.
        elementRef) {
            this._parentChip = _parentChip;
            // @breaking-change 11.0.0 Remove null check for `elementRef`.
            if (elementRef && elementRef.nativeElement.nodeName === 'BUTTON') {
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
    };
    MatChipRemove = __decorate([
        Directive({
            selector: '[matChipRemove]',
            host: {
                'class': 'mat-chip-remove mat-chip-trailing-icon',
                '(click)': '_handleClick($event)',
            }
        }),
        __metadata("design:paramtypes", [MatChip,
            ElementRef])
    ], MatChipRemove);
    return MatChipRemove;
})();
export { MatChipRemove };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy9jaGlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFekMsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0QsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFDTCxZQUFZLEVBQ1osU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixNQUFNLEVBQ04saUJBQWlCLEVBQ2pCLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBT0wsYUFBYSxFQUNiLHlCQUF5QixFQUN6QixVQUFVLEVBQ1Ysa0JBQWtCLEVBR2xCLGNBQWMsR0FFZixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3BDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBUzNFLG1FQUFtRTtBQUNuRSxNQUFNLE9BQU8sc0JBQXNCO0lBQ2pDO0lBQ0Usb0RBQW9EO0lBQzdDLE1BQWU7SUFDdEIsMkRBQTJEO0lBQ3BELFFBQWlCO0lBQ3hCLHVFQUF1RTtJQUNoRSxjQUFjLEtBQUs7UUFKbkIsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUVmLGFBQVEsR0FBUixRQUFRLENBQVM7UUFFakIsZ0JBQVcsR0FBWCxXQUFX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QU0sRUFBRSxDQUFDO2FBQ3JCO1lBRUQsc0ZBQXNGO1lBQ3RGLDJGQUEyRjtZQUMzRixzRkFBc0Y7WUFDdEYsMEZBQTBGO1lBQzFGLDhEQUE4RDtZQUM5RCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDMUIsQ0FBQztLQUNGLENBQUE7SUEzQlksYUFBYTtRQVB6QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLElBQUksRUFBRTtnQkFDSixPQUFPLEVBQUUsd0NBQXdDO2dCQUNqRCxTQUFTLEVBQUUsc0JBQXNCO2FBQ2xDO1NBQ0YsQ0FBQzt5Q0FHeUIsT0FBTztZQUVqQixVQUFVO09BSmQsYUFBYSxDQTJCekI7SUFBRCxvQkFBQztLQUFBO1NBM0JZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7Rm9jdXNhYmxlT3B0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtCQUNLU1BBQ0UsIERFTEVURSwgU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgQ29udGVudENoaWxkLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBBdHRyaWJ1dGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIENhbkNvbG9yQ3RvcixcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZUN0b3IsXG4gIEhhc1RhYkluZGV4LFxuICBIYXNUYWJJbmRleEN0b3IsXG4gIG1peGluVGFiSW5kZXgsXG4gIE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsXG4gIG1peGluQ29sb3IsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgUmlwcGxlQ29uZmlnLFxuICBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICBSaXBwbGVSZW5kZXJlcixcbiAgUmlwcGxlVGFyZ2V0LFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5cbi8qKiBSZXByZXNlbnRzIGFuIGV2ZW50IGZpcmVkIG9uIGFuIGluZGl2aWR1YWwgYG1hdC1jaGlwYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0Q2hpcEV2ZW50IHtcbiAgLyoqIFRoZSBjaGlwIHRoZSBldmVudCB3YXMgZmlyZWQgb24uICovXG4gIGNoaXA6IE1hdENoaXA7XG59XG5cbi8qKiBFdmVudCBvYmplY3QgZW1pdHRlZCBieSBNYXRDaGlwIHdoZW4gc2VsZWN0ZWQgb3IgZGVzZWxlY3RlZC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRDaGlwU2VsZWN0aW9uQ2hhbmdlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY2hpcCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdENoaXAsXG4gICAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgdGhhdCBlbWl0dGVkIHRoZSBldmVudCBpcyBzZWxlY3RlZC4gKi9cbiAgICBwdWJsaWMgc2VsZWN0ZWQ6IGJvb2xlYW4sXG4gICAgLyoqIFdoZXRoZXIgdGhlIHNlbGVjdGlvbiBjaGFuZ2Ugd2FzIGEgcmVzdWx0IG9mIGEgdXNlciBpbnRlcmFjdGlvbi4gKi9cbiAgICBwdWJsaWMgaXNVc2VySW5wdXQgPSBmYWxzZSkgeyB9XG59XG5cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRDaGlwLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdENoaXBCYXNlIHtcbiAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn1cblxuY29uc3QgX01hdENoaXBNaXhpbkJhc2U6IENhbkNvbG9yQ3RvciAmIENhbkRpc2FibGVSaXBwbGVDdG9yICZcbiAgICBIYXNUYWJJbmRleEN0b3IgJiB0eXBlb2YgTWF0Q2hpcEJhc2UgPVxuICAgICAgbWl4aW5UYWJJbmRleChtaXhpbkNvbG9yKG1peGluRGlzYWJsZVJpcHBsZShNYXRDaGlwQmFzZSksICdwcmltYXJ5JyksIC0xKTtcblxuLyoqXG4gKiBEdW1teSBkaXJlY3RpdmUgdG8gYWRkIENTUyBjbGFzcyB0byBjaGlwIGF2YXRhci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWNoaXAtYXZhdGFyLCBbbWF0Q2hpcEF2YXRhcl0nLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jaGlwLWF2YXRhcid9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXBBdmF0YXIge31cblxuLyoqXG4gKiBEdW1teSBkaXJlY3RpdmUgdG8gYWRkIENTUyBjbGFzcyB0byBjaGlwIHRyYWlsaW5nIGljb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1jaGlwLXRyYWlsaW5nLWljb24sIFttYXRDaGlwVHJhaWxpbmdJY29uXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNoaXAtdHJhaWxpbmctaWNvbid9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXBUcmFpbGluZ0ljb24ge31cblxuLyoqXG4gKiBNYXRlcmlhbCBkZXNpZ24gc3R5bGVkIENoaXAgY29tcG9uZW50LiBVc2VkIGluc2lkZSB0aGUgTWF0Q2hpcExpc3QgY29tcG9uZW50LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBtYXQtYmFzaWMtY2hpcCwgW21hdC1iYXNpYy1jaGlwXSwgbWF0LWNoaXAsIFttYXQtY2hpcF1gLFxuICBpbnB1dHM6IFsnY29sb3InLCAnZGlzYWJsZVJpcHBsZScsICd0YWJJbmRleCddLFxuICBleHBvcnRBczogJ21hdENoaXAnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jaGlwIG1hdC1mb2N1cy1pbmRpY2F0b3InLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnZGlzYWJsZWQgPyBudWxsIDogdGFiSW5kZXgnLFxuICAgICdyb2xlJzogJ29wdGlvbicsXG4gICAgJ1tjbGFzcy5tYXQtY2hpcC1zZWxlY3RlZF0nOiAnc2VsZWN0ZWQnLFxuICAgICdbY2xhc3MubWF0LWNoaXAtd2l0aC1hdmF0YXJdJzogJ2F2YXRhcicsXG4gICAgJ1tjbGFzcy5tYXQtY2hpcC13aXRoLXRyYWlsaW5nLWljb25dJzogJ3RyYWlsaW5nSWNvbiB8fCByZW1vdmVJY29uJyxcbiAgICAnW2NsYXNzLm1hdC1jaGlwLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbnNEaXNhYmxlZCcsXG4gICAgJ1thdHRyLmRpc2FibGVkXSc6ICdkaXNhYmxlZCB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtc2VsZWN0ZWRdJzogJ2FyaWFTZWxlY3RlZCcsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCRldmVudCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJyhmb2N1cyknOiAnZm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfYmx1cigpJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcCBleHRlbmRzIF9NYXRDaGlwTWl4aW5CYXNlIGltcGxlbWVudHMgRm9jdXNhYmxlT3B0aW9uLCBPbkRlc3Ryb3ksIENhbkNvbG9yLFxuICBDYW5EaXNhYmxlUmlwcGxlLCBSaXBwbGVUYXJnZXQsIEhhc1RhYkluZGV4IHtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBSaXBwbGVSZW5kZXJlciBmb3IgdGhlIGNoaXAuICovXG4gIHByaXZhdGUgX2NoaXBSaXBwbGU6IFJpcHBsZVJlbmRlcmVyO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIGVsZW1lbnQgdGhhdCBhY3RzIGFzIHRoZSBjaGlwJ3MgcmlwcGxlIHRhcmdldC4gVGhpcyBlbGVtZW50IGlzXG4gICAqIGR5bmFtaWNhbGx5IGFkZGVkIGFzIGEgY2hpbGQgbm9kZSBvZiB0aGUgY2hpcC4gVGhlIGNoaXAgaXRzZWxmIGNhbm5vdCBiZSB1c2VkIGFzIHRoZVxuICAgKiByaXBwbGUgdGFyZ2V0IGJlY2F1c2UgaXQgbXVzdCBiZSB0aGUgaG9zdCBvZiB0aGUgZm9jdXMgaW5kaWNhdG9yLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hpcFJpcHBsZVRhcmdldDogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIFJpcHBsZSBjb25maWd1cmF0aW9uIGZvciByaXBwbGVzIHRoYXQgYXJlIGxhdW5jaGVkIG9uIHBvaW50ZXIgZG93bi4gVGhlIHJpcHBsZSBjb25maWdcbiAgICogaXMgc2V0IHRvIHRoZSBnbG9iYWwgcmlwcGxlIG9wdGlvbnMgc2luY2Ugd2UgZG9uJ3QgaGF2ZSBhbnkgY29uZmlndXJhYmxlIG9wdGlvbnMgZm9yXG4gICAqIHRoZSBjaGlwIHJpcHBsZXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJpcHBsZUNvbmZpZzogUmlwcGxlQ29uZmlnICYgUmlwcGxlR2xvYmFsT3B0aW9ucztcblxuICAvKipcbiAgICogV2hldGhlciByaXBwbGVzIGFyZSBkaXNhYmxlZCBvbiBpbnRlcmFjdGlvblxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgcmlwcGxlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlUmlwcGxlIHx8ICEhdGhpcy5yaXBwbGVDb25maWcuZGlzYWJsZWQ7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBoYXMgZm9jdXMuICovXG4gIF9oYXNGb2N1czogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIGFuaW1hdGlvbnMgZm9yIHRoZSBjaGlwIGFyZSBlbmFibGVkLiAqL1xuICBfYW5pbWF0aW9uc0Rpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGxpc3QgaXMgc2VsZWN0YWJsZSAqL1xuICBjaGlwTGlzdFNlbGVjdGFibGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGxpc3QgaXMgaW4gbXVsdGktc2VsZWN0aW9uIG1vZGUuICovXG4gIF9jaGlwTGlzdE11bHRpcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgbGlzdCBhcyBhIHdob2xlIGlzIGRpc2FibGVkLiAqL1xuICBfY2hpcExpc3REaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgY2hpcCBhdmF0YXIgKi9cbiAgQENvbnRlbnRDaGlsZChNYXRDaGlwQXZhdGFyKSBhdmF0YXI6IE1hdENoaXBBdmF0YXI7XG5cbiAgLyoqIFRoZSBjaGlwJ3MgdHJhaWxpbmcgaWNvbi4gKi9cbiAgQENvbnRlbnRDaGlsZChNYXRDaGlwVHJhaWxpbmdJY29uKSB0cmFpbGluZ0ljb246IE1hdENoaXBUcmFpbGluZ0ljb247XG5cbiAgLyoqIFRoZSBjaGlwJ3MgcmVtb3ZlIHRvZ2dsZXIuICovXG4gIEBDb250ZW50Q2hpbGQoZm9yd2FyZFJlZigoKSA9PiBNYXRDaGlwUmVtb3ZlKSkgcmVtb3ZlSWNvbjogTWF0Q2hpcFJlbW92ZTtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBpcyBzZWxlY3RlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7IH1cbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgY29lcmNlZFZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChjb2VyY2VkVmFsdWUgIT09IHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IGNvZXJjZWRWYWx1ZTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG4gIHByb3RlY3RlZCBfc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBjaGlwLiBEZWZhdWx0cyB0byB0aGUgY29udGVudCBpbnNpZGUgYDxtYXQtY2hpcD5gIHRhZ3MuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZSAhPT0gdW5kZWZpbmVkXG4gICAgICA/IHRoaXMuX3ZhbHVlXG4gICAgICA6IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudDtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkgeyB0aGlzLl92YWx1ZSA9IHZhbHVlOyB9XG4gIHByb3RlY3RlZCBfdmFsdWU6IGFueTtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIGNoaXAgaXMgc2VsZWN0YWJsZS4gV2hlbiBhIGNoaXAgaXMgbm90IHNlbGVjdGFibGUsXG4gICAqIGNoYW5nZXMgdG8gaXRzIHNlbGVjdGVkIHN0YXRlIGFyZSBhbHdheXMgaWdub3JlZC4gQnkgZGVmYXVsdCBhIGNoaXAgaXNcbiAgICogc2VsZWN0YWJsZSwgYW5kIGl0IGJlY29tZXMgbm9uLXNlbGVjdGFibGUgaWYgaXRzIHBhcmVudCBjaGlwIGxpc3QgaXNcbiAgICogbm90IHNlbGVjdGFibGUuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0YWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3NlbGVjdGFibGUgJiYgdGhpcy5jaGlwTGlzdFNlbGVjdGFibGU7IH1cbiAgc2V0IHNlbGVjdGFibGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zZWxlY3RhYmxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcm90ZWN0ZWQgX3NlbGVjdGFibGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jaGlwTGlzdERpc2FibGVkIHx8IHRoaXMuX2Rpc2FibGVkOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcm90ZWN0ZWQgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciBvciBub3QgdGhlIGNoaXAgZGlzcGxheXMgdGhlIHJlbW92ZSBzdHlsaW5nIGFuZCBlbWl0cyAocmVtb3ZlZCkgZXZlbnRzLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlbW92YWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3JlbW92YWJsZTsgfVxuICBzZXQgcmVtb3ZhYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVtb3ZhYmxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcm90ZWN0ZWQgX3JlbW92YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNoaXAgaXMgZm9jdXNlZC4gKi9cbiAgcmVhZG9ubHkgX29uRm9jdXMgPSBuZXcgU3ViamVjdDxNYXRDaGlwRXZlbnQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNoaXAgaXMgYmx1cmVkLiAqL1xuICByZWFkb25seSBfb25CbHVyID0gbmV3IFN1YmplY3Q8TWF0Q2hpcEV2ZW50PigpO1xuXG4gIC8qKiBFbWl0dGVkIHdoZW4gdGhlIGNoaXAgaXMgc2VsZWN0ZWQgb3IgZGVzZWxlY3RlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdENoaXBTZWxlY3Rpb25DaGFuZ2U+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcFNlbGVjdGlvbkNoYW5nZT4oKTtcblxuICAvKiogRW1pdHRlZCB3aGVuIHRoZSBjaGlwIGlzIGRlc3Ryb3llZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRlc3Ryb3llZDogRXZlbnRFbWl0dGVyPE1hdENoaXBFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdENoaXBFdmVudD4oKTtcblxuICAvKiogRW1pdHRlZCB3aGVuIGEgY2hpcCBpcyB0byBiZSByZW1vdmVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcmVtb3ZlZDogRXZlbnRFbWl0dGVyPE1hdENoaXBFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdENoaXBFdmVudD4oKTtcblxuICAvKiogVGhlIEFSSUEgc2VsZWN0ZWQgYXBwbGllZCB0byB0aGUgY2hpcC4gKi9cbiAgZ2V0IGFyaWFTZWxlY3RlZCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAvLyBSZW1vdmUgdGhlIGBhcmlhLXNlbGVjdGVkYCB3aGVuIHRoZSBjaGlwIGlzIGRlc2VsZWN0ZWQgaW4gc2luZ2xlLXNlbGVjdGlvbiBtb2RlLCBiZWNhdXNlXG4gICAgLy8gaXQgYWRkcyBub2lzZSB0byBOVkRBIHVzZXJzIHdoZXJlIFwibm90IHNlbGVjdGVkXCIgd2lsbCBiZSByZWFkIG91dCBmb3IgZWFjaCBjaGlwLlxuICAgIHJldHVybiB0aGlzLnNlbGVjdGFibGUgJiYgKHRoaXMuX2NoaXBMaXN0TXVsdGlwbGUgfHwgdGhpcy5zZWxlY3RlZCkgP1xuICAgICAgICB0aGlzLnNlbGVjdGVkLnRvU3RyaW5nKCkgOiBudWxsO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TKVxuICAgICAgICAgICAgICBnbG9iYWxSaXBwbGVPcHRpb25zOiBSaXBwbGVHbG9iYWxPcHRpb25zIHwgbnVsbCxcbiAgICAgICAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBgYW5pbWF0aW9uTW9kZWAgcGFyYW1ldGVyIHRvIGJlY29tZSByZXF1aXJlZC5cbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgICAgICAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgYF9jaGFuZ2VEZXRlY3RvclJlZmAgcGFyYW1ldGVyIHRvIGJlY29tZSByZXF1aXJlZC5cbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleD86IHN0cmluZyxcbiAgICAgICAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgYF9kb2N1bWVudGAgcGFyYW1ldGVyIHRvIGJlY29tZSByZXF1aXJlZC5cbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50PzogYW55KSB7XG4gICAgc3VwZXIoX2VsZW1lbnRSZWYpO1xuXG4gICAgdGhpcy5fYWRkSG9zdENsYXNzTmFtZSgpO1xuXG4gICAgLy8gRHluYW1pY2FsbHkgY3JlYXRlIHRoZSByaXBwbGUgdGFyZ2V0LCBhcHBlbmQgaXQgd2l0aGluIHRoZSBjaGlwLCBhbmQgdXNlIGl0IGFzIHRoZVxuICAgIC8vIGNoaXAncyByaXBwbGUgdGFyZ2V0LiBBZGRpbmcgdGhlIGNsYXNzICcubWF0LWNoaXAtcmlwcGxlJyBlbnN1cmVzIHRoYXQgaXQgd2lsbCBoYXZlXG4gICAgLy8gdGhlIHByb3BlciBzdHlsZXMuXG4gICAgdGhpcy5fY2hpcFJpcHBsZVRhcmdldCA9IChfZG9jdW1lbnQgfHwgZG9jdW1lbnQpLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX2NoaXBSaXBwbGVUYXJnZXQuY2xhc3NMaXN0LmFkZCgnbWF0LWNoaXAtcmlwcGxlJyk7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX2NoaXBSaXBwbGVUYXJnZXQpO1xuICAgIHRoaXMuX2NoaXBSaXBwbGUgPSBuZXcgUmlwcGxlUmVuZGVyZXIodGhpcywgX25nWm9uZSwgdGhpcy5fY2hpcFJpcHBsZVRhcmdldCwgcGxhdGZvcm0pO1xuICAgIHRoaXMuX2NoaXBSaXBwbGUuc2V0dXBUcmlnZ2VyRXZlbnRzKF9lbGVtZW50UmVmKTtcblxuICAgIHRoaXMucmlwcGxlQ29uZmlnID0gZ2xvYmFsUmlwcGxlT3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLl9hbmltYXRpb25zRGlzYWJsZWQgPSBhbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnO1xuICAgIHRoaXMudGFiSW5kZXggPSB0YWJJbmRleCAhPSBudWxsID8gKHBhcnNlSW50KHRhYkluZGV4KSB8fCAtMSkgOiAtMTtcbiAgfVxuXG4gIF9hZGRIb3N0Q2xhc3NOYW1lKCkge1xuICAgIGNvbnN0IGJhc2ljQ2hpcEF0dHJOYW1lID0gJ21hdC1iYXNpYy1jaGlwJztcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgaWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKGJhc2ljQ2hpcEF0dHJOYW1lKSB8fFxuICAgICAgICBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gYmFzaWNDaGlwQXR0ck5hbWUpIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChiYXNpY0NoaXBBdHRyTmFtZSk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LXN0YW5kYXJkLWNoaXAnKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3llZC5lbWl0KHtjaGlwOiB0aGlzfSk7XG4gICAgdGhpcy5fY2hpcFJpcHBsZS5fcmVtb3ZlVHJpZ2dlckV2ZW50cygpO1xuICB9XG5cbiAgLyoqIFNlbGVjdHMgdGhlIGNoaXAuICovXG4gIHNlbGVjdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLl9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZSgpO1xuICAgICAgdGhpcy5fbWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERlc2VsZWN0cyB0aGUgY2hpcC4gKi9cbiAgZGVzZWxlY3QoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UoKTtcbiAgICAgIHRoaXMuX21hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZWxlY3QgdGhpcyBjaGlwIGFuZCBlbWl0IHNlbGVjdGVkIGV2ZW50ICovXG4gIHNlbGVjdFZpYUludGVyYWN0aW9uKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKHRydWUpO1xuICAgICAgdGhpcy5fbWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIGN1cnJlbnQgc2VsZWN0ZWQgc3RhdGUgb2YgdGhpcyBjaGlwLiAqL1xuICB0b2dnbGVTZWxlY3RlZChpc1VzZXJJbnB1dDogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSAhdGhpcy5zZWxlY3RlZDtcbiAgICB0aGlzLl9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZShpc1VzZXJJbnB1dCk7XG4gICAgdGhpcy5fbWFya0ZvckNoZWNrKCk7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWQ7XG4gIH1cblxuICAvKiogQWxsb3dzIGZvciBwcm9ncmFtbWF0aWMgZm9jdXNpbmcgb2YgdGhlIGNoaXAuICovXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5faGFzRm9jdXMpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5fb25Gb2N1cy5uZXh0KHtjaGlwOiB0aGlzfSk7XG4gICAgfVxuICAgIHRoaXMuX2hhc0ZvY3VzID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgZm9yIHByb2dyYW1tYXRpYyByZW1vdmFsIG9mIHRoZSBjaGlwLiBDYWxsZWQgYnkgdGhlIE1hdENoaXBMaXN0IHdoZW4gdGhlIERFTEVURSBvclxuICAgKiBCQUNLU1BBQ0Uga2V5cyBhcmUgcHJlc3NlZC5cbiAgICpcbiAgICogSW5mb3JtcyBhbnkgbGlzdGVuZXJzIG9mIHRoZSByZW1vdmFsIHJlcXVlc3QuIERvZXMgbm90IHJlbW92ZSB0aGUgY2hpcCBmcm9tIHRoZSBET00uXG4gICAqL1xuICByZW1vdmUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucmVtb3ZhYmxlKSB7XG4gICAgICB0aGlzLnJlbW92ZWQuZW1pdCh7Y2hpcDogdGhpc30pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGNsaWNrIGV2ZW50cyBvbiB0aGUgY2hpcC4gKi9cbiAgX2hhbmRsZUNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlIGN1c3RvbSBrZXkgcHJlc3Nlcy4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBERUxFVEU6XG4gICAgICBjYXNlIEJBQ0tTUEFDRTpcbiAgICAgICAgLy8gSWYgd2UgYXJlIHJlbW92YWJsZSwgcmVtb3ZlIHRoZSBmb2N1c2VkIGNoaXBcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgLy8gQWx3YXlzIHByZXZlbnQgc28gcGFnZSBuYXZpZ2F0aW9uIGRvZXMgbm90IG9jY3VyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTUEFDRTpcbiAgICAgICAgLy8gSWYgd2UgYXJlIHNlbGVjdGFibGUsIHRvZ2dsZSB0aGUgZm9jdXNlZCBjaGlwXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGFibGUpIHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZVNlbGVjdGVkKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWx3YXlzIHByZXZlbnQgc3BhY2UgZnJvbSBzY3JvbGxpbmcgdGhlIHBhZ2Ugc2luY2UgdGhlIGxpc3QgaGFzIGZvY3VzXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9ibHVyKCk6IHZvaWQge1xuICAgIC8vIFdoZW4gYW5pbWF0aW9ucyBhcmUgZW5hYmxlZCwgQW5ndWxhciBtYXkgZW5kIHVwIHJlbW92aW5nIHRoZSBjaGlwIGZyb20gdGhlIERPTSBhIGxpdHRsZVxuICAgIC8vIGVhcmxpZXIgdGhhbiB1c3VhbCwgY2F1c2luZyBpdCB0byBiZSBibHVycmVkIGFuZCB0aHJvd2luZyBvZmYgdGhlIGxvZ2ljIGluIHRoZSBjaGlwIGxpc3RcbiAgICAvLyB0aGF0IG1vdmVzIGZvY3VzIG5vdCB0aGUgbmV4dCBpdGVtLiBUbyB3b3JrIGFyb3VuZCB0aGUgaXNzdWUsIHdlIGRlZmVyIG1hcmtpbmcgdGhlIGNoaXBcbiAgICAvLyBhcyBub3QgZm9jdXNlZCB1bnRpbCB0aGUgbmV4dCB0aW1lIHRoZSB6b25lIHN0YWJpbGl6ZXMuXG4gICAgdGhpcy5fbmdab25lLm9uU3RhYmxlXG4gICAgICAuYXNPYnNlcnZhYmxlKClcbiAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5faGFzRm9jdXMgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLl9vbkJsdXIubmV4dCh7Y2hpcDogdGhpc30pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UoaXNVc2VySW5wdXQgPSBmYWxzZSkge1xuICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQoe1xuICAgICAgc291cmNlOiB0aGlzLFxuICAgICAgaXNVc2VySW5wdXQsXG4gICAgICBzZWxlY3RlZDogdGhpcy5fc2VsZWN0ZWRcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX21hcmtGb3JDaGVjaygpIHtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIFJlbW92ZSB0aGlzIG1ldGhvZCBvbmNlIHRoZSBfY2hhbmdlRGV0ZWN0b3JSZWYgaXMgYSByZXF1aXJlZCBwYXJhbS5cbiAgICBpZiAodGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zZWxlY3RlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2VsZWN0YWJsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVtb3ZhYmxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xufVxuXG5cbi8qKlxuICogQXBwbGllcyBwcm9wZXIgKGNsaWNrKSBzdXBwb3J0IGFuZCBhZGRzIHN0eWxpbmcgZm9yIHVzZSB3aXRoIHRoZSBNYXRlcmlhbCBEZXNpZ24gXCJjYW5jZWxcIiBpY29uXG4gKiBhdmFpbGFibGUgYXQgaHR0cHM6Ly9tYXRlcmlhbC5pby9pY29ucy8jaWNfY2FuY2VsLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgIGA8bWF0LWNoaXA+XG4gKiAgICAgICA8bWF0LWljb24gbWF0Q2hpcFJlbW92ZT5jYW5jZWw8L21hdC1pY29uPlxuICogICAgIDwvbWF0LWNoaXA+YFxuICpcbiAqIFlvdSAqbWF5KiB1c2UgYSBjdXN0b20gaWNvbiwgYnV0IHlvdSBtYXkgbmVlZCB0byBvdmVycmlkZSB0aGUgYG1hdC1jaGlwLXJlbW92ZWAgcG9zaXRpb25pbmdcbiAqIHN0eWxlcyB0byBwcm9wZXJseSBjZW50ZXIgdGhlIGljb24gd2l0aGluIHRoZSBjaGlwLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0Q2hpcFJlbW92ZV0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jaGlwLXJlbW92ZSBtYXQtY2hpcC10cmFpbGluZy1pY29uJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soJGV2ZW50KScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcFJlbW92ZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBfcGFyZW50Q2hpcDogTWF0Q2hpcCxcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDExLjAuMCBgZWxlbWVudFJlZmAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgZWxlbWVudFJlZj86IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG5cbiAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIFJlbW92ZSBudWxsIGNoZWNrIGZvciBgZWxlbWVudFJlZmAuXG4gICAgaWYgKGVsZW1lbnRSZWYgJiYgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm5vZGVOYW1lID09PSAnQlVUVE9OJykge1xuICAgICAgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcbiAgICB9XG4gICB9XG5cbiAgLyoqIENhbGxzIHRoZSBwYXJlbnQgY2hpcCdzIHB1YmxpYyBgcmVtb3ZlKClgIG1ldGhvZCBpZiBhcHBsaWNhYmxlLiAqL1xuICBfaGFuZGxlQ2xpY2soZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgcGFyZW50Q2hpcCA9IHRoaXMuX3BhcmVudENoaXA7XG5cbiAgICBpZiAocGFyZW50Q2hpcC5yZW1vdmFibGUgJiYgIXBhcmVudENoaXAuZGlzYWJsZWQpIHtcbiAgICAgIHBhcmVudENoaXAucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0byBzdG9wIGV2ZW50IHByb3BhZ2F0aW9uIGJlY2F1c2Ugb3RoZXJ3aXNlIHRoZSBldmVudCB3aWxsIGJ1YmJsZSB1cCB0byB0aGVcbiAgICAvLyBmb3JtIGZpZWxkIGFuZCBjYXVzZSB0aGUgYG9uQ29udGFpbmVyQ2xpY2tgIG1ldGhvZCB0byBiZSBpbnZva2VkLiBUaGlzIG1ldGhvZCB3b3VsZCB0aGVuXG4gICAgLy8gcmVzZXQgdGhlIGZvY3VzZWQgY2hpcCB0aGF0IGhhcyBiZWVuIGZvY3VzZWQgYWZ0ZXIgY2hpcCByZW1vdmFsLiBVc3VhbGx5IHRoZSBwYXJlbnRcbiAgICAvLyB0aGUgcGFyZW50IGNsaWNrIGxpc3RlbmVyIG9mIHRoZSBgTWF0Q2hpcGAgd291bGQgcHJldmVudCBwcm9wYWdhdGlvbiwgYnV0IGl0IGNhbiBoYXBwZW5cbiAgICAvLyB0aGF0IHRoZSBjaGlwIGlzIGJlaW5nIHJlbW92ZWQgYmVmb3JlIHRoZSBldmVudCBidWJibGVzIHVwLlxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG59XG4iXX0=