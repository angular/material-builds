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
    class MatChipAvatar {
    }
    MatChipAvatar.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-chip-avatar, [matChipAvatar]',
                    host: { 'class': 'mat-chip-avatar' }
                },] }
    ];
    return MatChipAvatar;
})();
export { MatChipAvatar };
/**
 * Dummy directive to add CSS class to chip trailing icon.
 * @docs-private
 */
let MatChipTrailingIcon = /** @class */ (() => {
    class MatChipTrailingIcon {
    }
    MatChipTrailingIcon.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-chip-trailing-icon, [matChipTrailingIcon]',
                    host: { 'class': 'mat-chip-trailing-icon' }
                },] }
    ];
    return MatChipTrailingIcon;
})();
export { MatChipTrailingIcon };
/**
 * Material design styled Chip component. Used inside the MatChipList component.
 */
let MatChip = /** @class */ (() => {
    class MatChip extends _MatChipMixinBase {
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
        removeIcon: [{ type: ContentChild, args: [forwardRef(() => MatChipRemove),] }],
        selected: [{ type: Input }],
        value: [{ type: Input }],
        selectable: [{ type: Input }],
        disabled: [{ type: Input }],
        removable: [{ type: Input }],
        selectionChange: [{ type: Output }],
        destroyed: [{ type: Output }],
        removed: [{ type: Output }]
    };
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
    class MatChipRemove {
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
    return MatChipRemove;
})();
export { MatChipRemove };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy9jaGlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QyxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUNMLFlBQVksRUFDWixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFPTCxhQUFhLEVBQ2IseUJBQXlCLEVBQ3pCLFVBQVUsRUFDVixrQkFBa0IsRUFHbEIsY0FBYyxHQUVmLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFTM0UsbUVBQW1FO0FBQ25FLE1BQU0sT0FBTyxzQkFBc0I7SUFDakM7SUFDRSxvREFBb0Q7SUFDN0MsTUFBZTtJQUN0QiwyREFBMkQ7SUFDcEQsUUFBaUI7SUFDeEIsdUVBQXVFO0lBQ2hFLGNBQWMsS0FBSztRQUpuQixXQUFNLEdBQU4sTUFBTSxDQUFTO1FBRWYsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUVqQixnQkFBVyxHQUFYLFdBQVcs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YUFBYTtRQUN4QixZQUNZLFdBQW9CO1FBQzlCLHNFQUFzRTtRQUN0RSxVQUFvQztZQUYxQixnQkFBVyxHQUFYLFdBQVcsQ0FBUztZQUk1Qiw4REFBOEQ7WUFDaEUsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO2dCQUNoRSxVQUFVLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDekQ7UUFDRixDQUFDO1FBRUYsc0VBQXNFO1FBQ3RFLFlBQVksQ0FBQyxLQUFZO1lBQ3ZCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFFcEMsSUFBSSxVQUFVLENBQUMsU0FBUyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtnQkFDaEQsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ3JCO1lBRUQsc0ZBQXNGO1lBQ3RGLDJGQUEyRjtZQUMzRixzRkFBc0Y7WUFDdEYsMEZBQTBGO1lBQzFGLDhEQUE4RDtZQUM5RCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDMUIsQ0FBQzs7O2dCQWpDRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSx3Q0FBd0M7d0JBQ2pELFNBQVMsRUFBRSxzQkFBc0I7cUJBQ2xDO2lCQUNGOzs7O2dCQUcwQixPQUFPO2dCQXRiaEMsVUFBVTs7SUErY1osb0JBQUM7S0FBQTtTQTNCWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0ZvY3VzYWJsZU9wdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7QkFDS1NQQUNFLCBERUxFVEUsIFNQQUNFfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7XG4gIENvbnRlbnRDaGlsZCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQXR0cmlidXRlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkNvbG9yLFxuICBDYW5Db2xvckN0b3IsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIENhbkRpc2FibGVSaXBwbGVDdG9yLFxuICBIYXNUYWJJbmRleCxcbiAgSGFzVGFiSW5kZXhDdG9yLFxuICBtaXhpblRhYkluZGV4LFxuICBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLFxuICBtaXhpbkNvbG9yLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIFJpcHBsZUNvbmZpZyxcbiAgUmlwcGxlR2xvYmFsT3B0aW9ucyxcbiAgUmlwcGxlUmVuZGVyZXIsXG4gIFJpcHBsZVRhcmdldCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuXG4vKiogUmVwcmVzZW50cyBhbiBldmVudCBmaXJlZCBvbiBhbiBpbmRpdmlkdWFsIGBtYXQtY2hpcGAuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdENoaXBFdmVudCB7XG4gIC8qKiBUaGUgY2hpcCB0aGUgZXZlbnQgd2FzIGZpcmVkIG9uLiAqL1xuICBjaGlwOiBNYXRDaGlwO1xufVxuXG4vKiogRXZlbnQgb2JqZWN0IGVtaXR0ZWQgYnkgTWF0Q2hpcCB3aGVuIHNlbGVjdGVkIG9yIGRlc2VsZWN0ZWQuICovXG5leHBvcnQgY2xhc3MgTWF0Q2hpcFNlbGVjdGlvbkNoYW5nZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGNoaXAgdGhhdCBlbWl0dGVkIHRoZSBldmVudC4gKi9cbiAgICBwdWJsaWMgc291cmNlOiBNYXRDaGlwLFxuICAgIC8qKiBXaGV0aGVyIHRoZSBjaGlwIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQgaXMgc2VsZWN0ZWQuICovXG4gICAgcHVibGljIHNlbGVjdGVkOiBib29sZWFuLFxuICAgIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3Rpb24gY2hhbmdlIHdhcyBhIHJlc3VsdCBvZiBhIHVzZXIgaW50ZXJhY3Rpb24uICovXG4gICAgcHVibGljIGlzVXNlcklucHV0ID0gZmFsc2UpIHsgfVxufVxuXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0Q2hpcC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRDaGlwQmFzZSB7XG4gIGRpc2FibGVkOiBib29sZWFuO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5cbmNvbnN0IF9NYXRDaGlwTWl4aW5CYXNlOiBDYW5Db2xvckN0b3IgJiBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmXG4gICAgSGFzVGFiSW5kZXhDdG9yICYgdHlwZW9mIE1hdENoaXBCYXNlID1cbiAgICAgIG1peGluVGFiSW5kZXgobWl4aW5Db2xvcihtaXhpbkRpc2FibGVSaXBwbGUoTWF0Q2hpcEJhc2UpLCAncHJpbWFyeScpLCAtMSk7XG5cbi8qKlxuICogRHVtbXkgZGlyZWN0aXZlIHRvIGFkZCBDU1MgY2xhc3MgdG8gY2hpcCBhdmF0YXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1jaGlwLWF2YXRhciwgW21hdENoaXBBdmF0YXJdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2hpcC1hdmF0YXInfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwQXZhdGFyIHt9XG5cbi8qKlxuICogRHVtbXkgZGlyZWN0aXZlIHRvIGFkZCBDU1MgY2xhc3MgdG8gY2hpcCB0cmFpbGluZyBpY29uLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hpcC10cmFpbGluZy1pY29uLCBbbWF0Q2hpcFRyYWlsaW5nSWNvbl0nLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jaGlwLXRyYWlsaW5nLWljb24nfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwVHJhaWxpbmdJY29uIHt9XG5cbi8qKlxuICogTWF0ZXJpYWwgZGVzaWduIHN0eWxlZCBDaGlwIGNvbXBvbmVudC4gVXNlZCBpbnNpZGUgdGhlIE1hdENoaXBMaXN0IGNvbXBvbmVudC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgbWF0LWJhc2ljLWNoaXAsIFttYXQtYmFzaWMtY2hpcF0sIG1hdC1jaGlwLCBbbWF0LWNoaXBdYCxcbiAgaW5wdXRzOiBbJ2NvbG9yJywgJ2Rpc2FibGVSaXBwbGUnLCAndGFiSW5kZXgnXSxcbiAgZXhwb3J0QXM6ICdtYXRDaGlwJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2hpcCBtYXQtZm9jdXMtaW5kaWNhdG9yJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ2Rpc2FibGVkID8gbnVsbCA6IHRhYkluZGV4JyxcbiAgICAncm9sZSc6ICdvcHRpb24nLFxuICAgICdbY2xhc3MubWF0LWNoaXAtc2VsZWN0ZWRdJzogJ3NlbGVjdGVkJyxcbiAgICAnW2NsYXNzLm1hdC1jaGlwLXdpdGgtYXZhdGFyXSc6ICdhdmF0YXInLFxuICAgICdbY2xhc3MubWF0LWNoaXAtd2l0aC10cmFpbGluZy1pY29uXSc6ICd0cmFpbGluZ0ljb24gfHwgcmVtb3ZlSWNvbicsXG4gICAgJ1tjbGFzcy5tYXQtY2hpcC1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25zRGlzYWJsZWQnLFxuICAgICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLXNlbGVjdGVkXSc6ICdhcmlhU2VsZWN0ZWQnLFxuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygkZXZlbnQpJyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICAgICcoZm9jdXMpJzogJ2ZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX2JsdXIoKScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXAgZXh0ZW5kcyBfTWF0Q2hpcE1peGluQmFzZSBpbXBsZW1lbnRzIEZvY3VzYWJsZU9wdGlvbiwgT25EZXN0cm95LCBDYW5Db2xvcixcbiAgQ2FuRGlzYWJsZVJpcHBsZSwgUmlwcGxlVGFyZ2V0LCBIYXNUYWJJbmRleCB7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgUmlwcGxlUmVuZGVyZXIgZm9yIHRoZSBjaGlwLiAqL1xuICBwcml2YXRlIF9jaGlwUmlwcGxlOiBSaXBwbGVSZW5kZXJlcjtcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IHRoYXQgYWN0cyBhcyB0aGUgY2hpcCdzIHJpcHBsZSB0YXJnZXQuIFRoaXMgZWxlbWVudCBpc1xuICAgKiBkeW5hbWljYWxseSBhZGRlZCBhcyBhIGNoaWxkIG5vZGUgb2YgdGhlIGNoaXAuIFRoZSBjaGlwIGl0c2VsZiBjYW5ub3QgYmUgdXNlZCBhcyB0aGVcbiAgICogcmlwcGxlIHRhcmdldCBiZWNhdXNlIGl0IG11c3QgYmUgdGhlIGhvc3Qgb2YgdGhlIGZvY3VzIGluZGljYXRvci5cbiAgICovXG4gIHByaXZhdGUgX2NoaXBSaXBwbGVUYXJnZXQ6IEhUTUxFbGVtZW50O1xuXG4gIC8qKlxuICAgKiBSaXBwbGUgY29uZmlndXJhdGlvbiBmb3IgcmlwcGxlcyB0aGF0IGFyZSBsYXVuY2hlZCBvbiBwb2ludGVyIGRvd24uIFRoZSByaXBwbGUgY29uZmlnXG4gICAqIGlzIHNldCB0byB0aGUgZ2xvYmFsIHJpcHBsZSBvcHRpb25zIHNpbmNlIHdlIGRvbid0IGhhdmUgYW55IGNvbmZpZ3VyYWJsZSBvcHRpb25zIGZvclxuICAgKiB0aGUgY2hpcCByaXBwbGVzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByaXBwbGVDb25maWc6IFJpcHBsZUNvbmZpZyAmIFJpcHBsZUdsb2JhbE9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgcmlwcGxlcyBhcmUgZGlzYWJsZWQgb24gaW50ZXJhY3Rpb25cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHJpcHBsZURpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVJpcHBsZSB8fCAhIXRoaXMucmlwcGxlQ29uZmlnLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgaGFzIGZvY3VzLiAqL1xuICBfaGFzRm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciBhbmltYXRpb25zIGZvciB0aGUgY2hpcCBhcmUgZW5hYmxlZC4gKi9cbiAgX2FuaW1hdGlvbnNEaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBsaXN0IGlzIHNlbGVjdGFibGUgKi9cbiAgY2hpcExpc3RTZWxlY3RhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBsaXN0IGlzIGluIG11bHRpLXNlbGVjdGlvbiBtb2RlLiAqL1xuICBfY2hpcExpc3RNdWx0aXBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGxpc3QgYXMgYSB3aG9sZSBpcyBkaXNhYmxlZC4gKi9cbiAgX2NoaXBMaXN0RGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIGNoaXAgYXZhdGFyICovXG4gIEBDb250ZW50Q2hpbGQoTWF0Q2hpcEF2YXRhcikgYXZhdGFyOiBNYXRDaGlwQXZhdGFyO1xuXG4gIC8qKiBUaGUgY2hpcCdzIHRyYWlsaW5nIGljb24uICovXG4gIEBDb250ZW50Q2hpbGQoTWF0Q2hpcFRyYWlsaW5nSWNvbikgdHJhaWxpbmdJY29uOiBNYXRDaGlwVHJhaWxpbmdJY29uO1xuXG4gIC8qKiBUaGUgY2hpcCdzIHJlbW92ZSB0b2dnbGVyLiAqL1xuICBAQ29udGVudENoaWxkKGZvcndhcmRSZWYoKCkgPT4gTWF0Q2hpcFJlbW92ZSkpIHJlbW92ZUljb246IE1hdENoaXBSZW1vdmU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgaXMgc2VsZWN0ZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3NlbGVjdGVkOyB9XG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IGNvZXJjZWRWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAoY29lcmNlZFZhbHVlICE9PSB0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSBjb2VyY2VkVmFsdWU7XG4gICAgICB0aGlzLl9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZSgpO1xuICAgIH1cbiAgfVxuICBwcm90ZWN0ZWQgX3NlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGUgY2hpcC4gRGVmYXVsdHMgdG8gdGhlIGNvbnRlbnQgaW5zaWRlIGA8bWF0LWNoaXA+YCB0YWdzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWUgIT09IHVuZGVmaW5lZFxuICAgICAgPyB0aGlzLl92YWx1ZVxuICAgICAgOiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudGV4dENvbnRlbnQ7XG4gIH1cbiAgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHsgdGhpcy5fdmFsdWUgPSB2YWx1ZTsgfVxuICBwcm90ZWN0ZWQgX3ZhbHVlOiBhbnk7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSBjaGlwIGlzIHNlbGVjdGFibGUuIFdoZW4gYSBjaGlwIGlzIG5vdCBzZWxlY3RhYmxlLFxuICAgKiBjaGFuZ2VzIHRvIGl0cyBzZWxlY3RlZCBzdGF0ZSBhcmUgYWx3YXlzIGlnbm9yZWQuIEJ5IGRlZmF1bHQgYSBjaGlwIGlzXG4gICAqIHNlbGVjdGFibGUsIGFuZCBpdCBiZWNvbWVzIG5vbi1zZWxlY3RhYmxlIGlmIGl0cyBwYXJlbnQgY2hpcCBsaXN0IGlzXG4gICAqIG5vdCBzZWxlY3RhYmxlLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGFibGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9zZWxlY3RhYmxlICYmIHRoaXMuY2hpcExpc3RTZWxlY3RhYmxlOyB9XG4gIHNldCBzZWxlY3RhYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2VsZWN0YWJsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJvdGVjdGVkIF9zZWxlY3RhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2hpcExpc3REaXNhYmxlZCB8fCB0aGlzLl9kaXNhYmxlZDsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJvdGVjdGVkIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBjaGlwIGRpc3BsYXlzIHRoZSByZW1vdmUgc3R5bGluZyBhbmQgZW1pdHMgKHJlbW92ZWQpIGV2ZW50cy5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCByZW1vdmFibGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZW1vdmFibGU7IH1cbiAgc2V0IHJlbW92YWJsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3JlbW92YWJsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJvdGVjdGVkIF9yZW1vdmFibGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjaGlwIGlzIGZvY3VzZWQuICovXG4gIHJlYWRvbmx5IF9vbkZvY3VzID0gbmV3IFN1YmplY3Q8TWF0Q2hpcEV2ZW50PigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjaGlwIGlzIGJsdXJlZC4gKi9cbiAgcmVhZG9ubHkgX29uQmx1ciA9IG5ldyBTdWJqZWN0PE1hdENoaXBFdmVudD4oKTtcblxuICAvKiogRW1pdHRlZCB3aGVuIHRoZSBjaGlwIGlzIHNlbGVjdGVkIG9yIGRlc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3Rpb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRDaGlwU2VsZWN0aW9uQ2hhbmdlPiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdENoaXBTZWxlY3Rpb25DaGFuZ2U+KCk7XG5cbiAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgY2hpcCBpcyBkZXN0cm95ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkZXN0cm95ZWQ6IEV2ZW50RW1pdHRlcjxNYXRDaGlwRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRDaGlwRXZlbnQ+KCk7XG5cbiAgLyoqIEVtaXR0ZWQgd2hlbiBhIGNoaXAgaXMgdG8gYmUgcmVtb3ZlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHJlbW92ZWQ6IEV2ZW50RW1pdHRlcjxNYXRDaGlwRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRDaGlwRXZlbnQ+KCk7XG5cbiAgLyoqIFRoZSBBUklBIHNlbGVjdGVkIGFwcGxpZWQgdG8gdGhlIGNoaXAuICovXG4gIGdldCBhcmlhU2VsZWN0ZWQoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgLy8gUmVtb3ZlIHRoZSBgYXJpYS1zZWxlY3RlZGAgd2hlbiB0aGUgY2hpcCBpcyBkZXNlbGVjdGVkIGluIHNpbmdsZS1zZWxlY3Rpb24gbW9kZSwgYmVjYXVzZVxuICAgIC8vIGl0IGFkZHMgbm9pc2UgdG8gTlZEQSB1c2VycyB3aGVyZSBcIm5vdCBzZWxlY3RlZFwiIHdpbGwgYmUgcmVhZCBvdXQgZm9yIGVhY2ggY2hpcC5cbiAgICByZXR1cm4gdGhpcy5zZWxlY3RhYmxlICYmICh0aGlzLl9jaGlwTGlzdE11bHRpcGxlIHx8IHRoaXMuc2VsZWN0ZWQpID9cbiAgICAgICAgdGhpcy5zZWxlY3RlZC50b1N0cmluZygpIDogbnVsbDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUylcbiAgICAgICAgICAgICAgZ2xvYmFsUmlwcGxlT3B0aW9uczogUmlwcGxlR2xvYmFsT3B0aW9ucyB8IG51bGwsXG4gICAgICAgICAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgYGFuaW1hdGlvbk1vZGVgIHBhcmFtZXRlciB0byBiZWNvbWUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIGBfY2hhbmdlRGV0ZWN0b3JSZWZgIHBhcmFtZXRlciB0byBiZWNvbWUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmPzogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg/OiBzdHJpbmcsXG4gICAgICAgICAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIGBfZG9jdW1lbnRgIHBhcmFtZXRlciB0byBiZWNvbWUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudD86IGFueSkge1xuICAgIHN1cGVyKF9lbGVtZW50UmVmKTtcblxuICAgIHRoaXMuX2FkZEhvc3RDbGFzc05hbWUoKTtcblxuICAgIC8vIER5bmFtaWNhbGx5IGNyZWF0ZSB0aGUgcmlwcGxlIHRhcmdldCwgYXBwZW5kIGl0IHdpdGhpbiB0aGUgY2hpcCwgYW5kIHVzZSBpdCBhcyB0aGVcbiAgICAvLyBjaGlwJ3MgcmlwcGxlIHRhcmdldC4gQWRkaW5nIHRoZSBjbGFzcyAnLm1hdC1jaGlwLXJpcHBsZScgZW5zdXJlcyB0aGF0IGl0IHdpbGwgaGF2ZVxuICAgIC8vIHRoZSBwcm9wZXIgc3R5bGVzLlxuICAgIHRoaXMuX2NoaXBSaXBwbGVUYXJnZXQgPSAoX2RvY3VtZW50IHx8IGRvY3VtZW50KS5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9jaGlwUmlwcGxlVGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ21hdC1jaGlwLXJpcHBsZScpO1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9jaGlwUmlwcGxlVGFyZ2V0KTtcbiAgICB0aGlzLl9jaGlwUmlwcGxlID0gbmV3IFJpcHBsZVJlbmRlcmVyKHRoaXMsIF9uZ1pvbmUsIHRoaXMuX2NoaXBSaXBwbGVUYXJnZXQsIHBsYXRmb3JtKTtcbiAgICB0aGlzLl9jaGlwUmlwcGxlLnNldHVwVHJpZ2dlckV2ZW50cyhfZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLnJpcHBsZUNvbmZpZyA9IGdsb2JhbFJpcHBsZU9wdGlvbnMgfHwge307XG4gICAgdGhpcy5fYW5pbWF0aW9uc0Rpc2FibGVkID0gYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJztcbiAgICB0aGlzLnRhYkluZGV4ID0gdGFiSW5kZXggIT0gbnVsbCA/IChwYXJzZUludCh0YWJJbmRleCkgfHwgLTEpIDogLTE7XG4gIH1cblxuICBfYWRkSG9zdENsYXNzTmFtZSgpIHtcbiAgICBjb25zdCBiYXNpY0NoaXBBdHRyTmFtZSA9ICdtYXQtYmFzaWMtY2hpcCc7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcblxuICAgIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZShiYXNpY0NoaXBBdHRyTmFtZSkgfHxcbiAgICAgICAgZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IGJhc2ljQ2hpcEF0dHJOYW1lKSB7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoYmFzaWNDaGlwQXR0ck5hbWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1zdGFuZGFyZC1jaGlwJyk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5kZXN0cm95ZWQuZW1pdCh7Y2hpcDogdGhpc30pO1xuICAgIHRoaXMuX2NoaXBSaXBwbGUuX3JlbW92ZVRyaWdnZXJFdmVudHMoKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBjaGlwLiAqL1xuICBzZWxlY3QoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UoKTtcbiAgICAgIHRoaXMuX21hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXNlbGVjdHMgdGhlIGNoaXAuICovXG4gIGRlc2VsZWN0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKCk7XG4gICAgICB0aGlzLl9tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogU2VsZWN0IHRoaXMgY2hpcCBhbmQgZW1pdCBzZWxlY3RlZCBldmVudCAqL1xuICBzZWxlY3RWaWFJbnRlcmFjdGlvbigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLl9kaXNwYXRjaFNlbGVjdGlvbkNoYW5nZSh0cnVlKTtcbiAgICAgIHRoaXMuX21hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSBjdXJyZW50IHNlbGVjdGVkIHN0YXRlIG9mIHRoaXMgY2hpcC4gKi9cbiAgdG9nZ2xlU2VsZWN0ZWQoaXNVc2VySW5wdXQ6IGJvb2xlYW4gPSBmYWxzZSk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gIXRoaXMuc2VsZWN0ZWQ7XG4gICAgdGhpcy5fZGlzcGF0Y2hTZWxlY3Rpb25DaGFuZ2UoaXNVc2VySW5wdXQpO1xuICAgIHRoaXMuX21hcmtGb3JDaGVjaygpO1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGVkO1xuICB9XG5cbiAgLyoqIEFsbG93cyBmb3IgcHJvZ3JhbW1hdGljIGZvY3VzaW5nIG9mIHRoZSBjaGlwLiAqL1xuICBmb2N1cygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2hhc0ZvY3VzKSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMuX29uRm9jdXMubmV4dCh7Y2hpcDogdGhpc30pO1xuICAgIH1cbiAgICB0aGlzLl9oYXNGb2N1cyA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIGZvciBwcm9ncmFtbWF0aWMgcmVtb3ZhbCBvZiB0aGUgY2hpcC4gQ2FsbGVkIGJ5IHRoZSBNYXRDaGlwTGlzdCB3aGVuIHRoZSBERUxFVEUgb3JcbiAgICogQkFDS1NQQUNFIGtleXMgYXJlIHByZXNzZWQuXG4gICAqXG4gICAqIEluZm9ybXMgYW55IGxpc3RlbmVycyBvZiB0aGUgcmVtb3ZhbCByZXF1ZXN0LiBEb2VzIG5vdCByZW1vdmUgdGhlIGNoaXAgZnJvbSB0aGUgRE9NLlxuICAgKi9cbiAgcmVtb3ZlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJlbW92YWJsZSkge1xuICAgICAgdGhpcy5yZW1vdmVkLmVtaXQoe2NoaXA6IHRoaXN9KTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBjbGljayBldmVudHMgb24gdGhlIGNoaXAuICovXG4gIF9oYW5kbGVDbGljayhldmVudDogRXZlbnQpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZSBjdXN0b20ga2V5IHByZXNzZXMuICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgREVMRVRFOlxuICAgICAgY2FzZSBCQUNLU1BBQ0U6XG4gICAgICAgIC8vIElmIHdlIGFyZSByZW1vdmFibGUsIHJlbW92ZSB0aGUgZm9jdXNlZCBjaGlwXG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIC8vIEFsd2F5cyBwcmV2ZW50IHNvIHBhZ2UgbmF2aWdhdGlvbiBkb2VzIG5vdCBvY2N1clxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1BBQ0U6XG4gICAgICAgIC8vIElmIHdlIGFyZSBzZWxlY3RhYmxlLCB0b2dnbGUgdGhlIGZvY3VzZWQgY2hpcFxuICAgICAgICBpZiAodGhpcy5zZWxlY3RhYmxlKSB7XG4gICAgICAgICAgdGhpcy50b2dnbGVTZWxlY3RlZCh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsd2F5cyBwcmV2ZW50IHNwYWNlIGZyb20gc2Nyb2xsaW5nIHRoZSBwYWdlIHNpbmNlIHRoZSBsaXN0IGhhcyBmb2N1c1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfYmx1cigpOiB2b2lkIHtcbiAgICAvLyBXaGVuIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWQsIEFuZ3VsYXIgbWF5IGVuZCB1cCByZW1vdmluZyB0aGUgY2hpcCBmcm9tIHRoZSBET00gYSBsaXR0bGVcbiAgICAvLyBlYXJsaWVyIHRoYW4gdXN1YWwsIGNhdXNpbmcgaXQgdG8gYmUgYmx1cnJlZCBhbmQgdGhyb3dpbmcgb2ZmIHRoZSBsb2dpYyBpbiB0aGUgY2hpcCBsaXN0XG4gICAgLy8gdGhhdCBtb3ZlcyBmb2N1cyBub3QgdGhlIG5leHQgaXRlbS4gVG8gd29yayBhcm91bmQgdGhlIGlzc3VlLCB3ZSBkZWZlciBtYXJraW5nIHRoZSBjaGlwXG4gICAgLy8gYXMgbm90IGZvY3VzZWQgdW50aWwgdGhlIG5leHQgdGltZSB0aGUgem9uZSBzdGFiaWxpemVzLlxuICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZVxuICAgICAgLmFzT2JzZXJ2YWJsZSgpXG4gICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2hhc0ZvY3VzID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5fb25CbHVyLm5leHQoe2NoaXA6IHRoaXN9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlKGlzVXNlcklucHV0ID0gZmFsc2UpIHtcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHtcbiAgICAgIHNvdXJjZTogdGhpcyxcbiAgICAgIGlzVXNlcklucHV0LFxuICAgICAgc2VsZWN0ZWQ6IHRoaXMuX3NlbGVjdGVkXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9tYXJrRm9yQ2hlY2soKSB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBSZW1vdmUgdGhpcyBtZXRob2Qgb25jZSB0aGUgX2NoYW5nZURldGVjdG9yUmVmIGlzIGEgcmVxdWlyZWQgcGFyYW0uXG4gICAgaWYgKHRoaXMuX2NoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2VsZWN0ZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGFibGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlbW92YWJsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbn1cblxuXG4vKipcbiAqIEFwcGxpZXMgcHJvcGVyIChjbGljaykgc3VwcG9ydCBhbmQgYWRkcyBzdHlsaW5nIGZvciB1c2Ugd2l0aCB0aGUgTWF0ZXJpYWwgRGVzaWduIFwiY2FuY2VsXCIgaWNvblxuICogYXZhaWxhYmxlIGF0IGh0dHBzOi8vbWF0ZXJpYWwuaW8vaWNvbnMvI2ljX2NhbmNlbC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgICBgPG1hdC1jaGlwPlxuICogICAgICAgPG1hdC1pY29uIG1hdENoaXBSZW1vdmU+Y2FuY2VsPC9tYXQtaWNvbj5cbiAqICAgICA8L21hdC1jaGlwPmBcbiAqXG4gKiBZb3UgKm1heSogdXNlIGEgY3VzdG9tIGljb24sIGJ1dCB5b3UgbWF5IG5lZWQgdG8gb3ZlcnJpZGUgdGhlIGBtYXQtY2hpcC1yZW1vdmVgIHBvc2l0aW9uaW5nXG4gKiBzdHlsZXMgdG8gcHJvcGVybHkgY2VudGVyIHRoZSBpY29uIHdpdGhpbiB0aGUgY2hpcC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdENoaXBSZW1vdmVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2hpcC1yZW1vdmUgbWF0LWNoaXAtdHJhaWxpbmctaWNvbicsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCRldmVudCknLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXBSZW1vdmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX3BhcmVudENoaXA6IE1hdENoaXAsXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgYGVsZW1lbnRSZWZgIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICAgIGVsZW1lbnRSZWY/OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuXG4gICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDExLjAuMCBSZW1vdmUgbnVsbCBjaGVjayBmb3IgYGVsZW1lbnRSZWZgLlxuICAgIGlmIChlbGVtZW50UmVmICYmIGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ub2RlTmFtZSA9PT0gJ0JVVFRPTicpIHtcbiAgICAgIGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJyk7XG4gICAgfVxuICAgfVxuXG4gIC8qKiBDYWxscyB0aGUgcGFyZW50IGNoaXAncyBwdWJsaWMgYHJlbW92ZSgpYCBtZXRob2QgaWYgYXBwbGljYWJsZS4gKi9cbiAgX2hhbmRsZUNsaWNrKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IHBhcmVudENoaXAgPSB0aGlzLl9wYXJlbnRDaGlwO1xuXG4gICAgaWYgKHBhcmVudENoaXAucmVtb3ZhYmxlICYmICFwYXJlbnRDaGlwLmRpc2FibGVkKSB7XG4gICAgICBwYXJlbnRDaGlwLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gc3RvcCBldmVudCBwcm9wYWdhdGlvbiBiZWNhdXNlIG90aGVyd2lzZSB0aGUgZXZlbnQgd2lsbCBidWJibGUgdXAgdG8gdGhlXG4gICAgLy8gZm9ybSBmaWVsZCBhbmQgY2F1c2UgdGhlIGBvbkNvbnRhaW5lckNsaWNrYCBtZXRob2QgdG8gYmUgaW52b2tlZC4gVGhpcyBtZXRob2Qgd291bGQgdGhlblxuICAgIC8vIHJlc2V0IHRoZSBmb2N1c2VkIGNoaXAgdGhhdCBoYXMgYmVlbiBmb2N1c2VkIGFmdGVyIGNoaXAgcmVtb3ZhbC4gVXN1YWxseSB0aGUgcGFyZW50XG4gICAgLy8gdGhlIHBhcmVudCBjbGljayBsaXN0ZW5lciBvZiB0aGUgYE1hdENoaXBgIHdvdWxkIHByZXZlbnQgcHJvcGFnYXRpb24sIGJ1dCBpdCBjYW4gaGFwcGVuXG4gICAgLy8gdGhhdCB0aGUgY2hpcCBpcyBiZWluZyByZW1vdmVkIGJlZm9yZSB0aGUgZXZlbnQgYnViYmxlcyB1cC5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxufVxuIl19