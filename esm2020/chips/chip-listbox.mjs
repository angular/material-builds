/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { TAB } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, forwardRef, inject, Input, Output, QueryList, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { startWith, takeUntil } from 'rxjs/operators';
import { MatChipOption } from './chip-option';
import { MatChipSet } from './chip-set';
import { MAT_CHIPS_DEFAULT_OPTIONS } from './tokens';
import * as i0 from "@angular/core";
/** Change event object that is emitted when the chip listbox value has changed. */
export class MatChipListboxChange {
    constructor(
    /** Chip listbox that emitted the event. */
    source, 
    /** Value of the chip listbox when the event was emitted. */
    value) {
        this.source = source;
        this.value = value;
    }
}
/**
 * Provider Expression that allows mat-chip-listbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatChipListbox),
    multi: true,
};
/**
 * An extension of the MatChipSet component that supports chip selection.
 * Used with MatChipOption chips.
 */
export class MatChipListbox extends MatChipSet {
    constructor() {
        super(...arguments);
        /**
         * Function when touched. Set as part of ControlValueAccessor implementation.
         * @docs-private
         */
        this._onTouched = () => { };
        /**
         * Function when changed. Set as part of ControlValueAccessor implementation.
         * @docs-private
         */
        this._onChange = () => { };
        // TODO: MDC uses `grid` here
        this._defaultRole = 'listbox';
        /** Default chip options. */
        this._defaultOptions = inject(MAT_CHIPS_DEFAULT_OPTIONS, { optional: true });
        this._multiple = false;
        /** Orientation of the chip list. */
        this.ariaOrientation = 'horizontal';
        this._selectable = true;
        /**
         * A function to compare the option values with the selected values. The first argument
         * is a value from an option. The second is a value from the selection. A boolean
         * should be returned.
         */
        this.compareWith = (o1, o2) => o1 === o2;
        this._required = false;
        this._hideSingleSelectionIndicator = this._defaultOptions?.hideSingleSelectionIndicator ?? false;
        /** Event emitted when the selected chip listbox value has been changed by the user. */
        this.change = new EventEmitter();
    }
    /** Whether the user should be allowed to select multiple chips. */
    get multiple() {
        return this._multiple;
    }
    set multiple(value) {
        this._multiple = coerceBooleanProperty(value);
        this._syncListboxProperties();
    }
    /** The array of selected chips inside the chip listbox. */
    get selected() {
        const selectedChips = this._chips.toArray().filter(chip => chip.selected);
        return this.multiple ? selectedChips : selectedChips[0];
    }
    /**
     * Whether or not this chip listbox is selectable.
     *
     * When a chip listbox is not selectable, the selected states for all
     * the chips inside the chip listbox are always ignored.
     */
    get selectable() {
        return this._selectable;
    }
    set selectable(value) {
        this._selectable = coerceBooleanProperty(value);
        this._syncListboxProperties();
    }
    /** Whether this chip listbox is required. */
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = coerceBooleanProperty(value);
    }
    /** Whether checkmark indicator for single-selection options is hidden. */
    get hideSingleSelectionIndicator() {
        return this._hideSingleSelectionIndicator;
    }
    set hideSingleSelectionIndicator(value) {
        this._hideSingleSelectionIndicator = coerceBooleanProperty(value);
        this._syncListboxProperties();
    }
    /** Combined stream of all of the child chips' selection change events. */
    get chipSelectionChanges() {
        return this._getChipStream(chip => chip.selectionChange);
    }
    /** Combined stream of all of the child chips' blur events. */
    get chipBlurChanges() {
        return this._getChipStream(chip => chip._onBlur);
    }
    /** The value of the listbox, which is the combined value of the selected chips. */
    get value() {
        return this._value;
    }
    set value(value) {
        this.writeValue(value);
        this._value = value;
    }
    ngAfterContentInit() {
        if (this._pendingInitialValue !== undefined) {
            Promise.resolve().then(() => {
                this._setSelectionByValue(this._pendingInitialValue, false);
                this._pendingInitialValue = undefined;
            });
        }
        this._chips.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
            // Update listbox selectable/multiple properties on chips
            this._syncListboxProperties();
        });
        this.chipBlurChanges.pipe(takeUntil(this._destroyed)).subscribe(() => this._blur());
        this.chipSelectionChanges.pipe(takeUntil(this._destroyed)).subscribe(event => {
            if (!this.multiple) {
                this._chips.forEach(chip => {
                    if (chip !== event.source) {
                        chip._setSelectedState(false, false, false);
                    }
                });
            }
            if (event.isUserInput) {
                this._propagateChanges();
            }
        });
    }
    /**
     * Focuses the first selected chip in this chip listbox, or the first non-disabled chip when there
     * are no selected chips.
     */
    focus() {
        if (this.disabled) {
            return;
        }
        const firstSelectedChip = this._getFirstSelectedChip();
        if (firstSelectedChip && !firstSelectedChip.disabled) {
            firstSelectedChip.focus();
        }
        else if (this._chips.length > 0) {
            this._keyManager.setFirstItemActive();
        }
        else {
            this._elementRef.nativeElement.focus();
        }
    }
    /**
     * Implemented as part of ControlValueAccessor.
     * @docs-private
     */
    writeValue(value) {
        if (this._chips) {
            this._setSelectionByValue(value, false);
        }
        else if (value != null) {
            this._pendingInitialValue = value;
        }
    }
    /**
     * Implemented as part of ControlValueAccessor.
     * @docs-private
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * Implemented as part of ControlValueAccessor.
     * @docs-private
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * Implemented as part of ControlValueAccessor.
     * @docs-private
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /** Selects all chips with value. */
    _setSelectionByValue(value, isUserInput = true) {
        this._clearSelection();
        if (Array.isArray(value)) {
            value.forEach(currentValue => this._selectValue(currentValue, isUserInput));
        }
        else {
            this._selectValue(value, isUserInput);
        }
    }
    /** When blurred, marks the field as touched when focus moved outside the chip listbox. */
    _blur() {
        if (!this.disabled) {
            // Wait to see if focus moves to an individual chip.
            setTimeout(() => {
                if (!this.focused) {
                    this._markAsTouched();
                }
            });
        }
    }
    _keydown(event) {
        if (event.keyCode === TAB) {
            super._allowFocusEscape();
        }
    }
    /** Marks the field as touched */
    _markAsTouched() {
        this._onTouched();
        this._changeDetectorRef.markForCheck();
    }
    /** Emits change event to set the model value. */
    _propagateChanges() {
        let valueToEmit = null;
        if (Array.isArray(this.selected)) {
            valueToEmit = this.selected.map(chip => chip.value);
        }
        else {
            valueToEmit = this.selected ? this.selected.value : undefined;
        }
        this._value = valueToEmit;
        this.change.emit(new MatChipListboxChange(this, valueToEmit));
        this._onChange(valueToEmit);
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Deselects every chip in the listbox.
     * @param skip Chip that should not be deselected.
     */
    _clearSelection(skip) {
        this._chips.forEach(chip => {
            if (chip !== skip) {
                chip.deselect();
            }
        });
    }
    /**
     * Finds and selects the chip based on its value.
     * @returns Chip that has the corresponding value.
     */
    _selectValue(value, isUserInput) {
        const correspondingChip = this._chips.find(chip => {
            return chip.value != null && this.compareWith(chip.value, value);
        });
        if (correspondingChip) {
            isUserInput ? correspondingChip.selectViaInteraction() : correspondingChip.select();
        }
        return correspondingChip;
    }
    /** Syncs the chip-listbox selection state with the individual chips. */
    _syncListboxProperties() {
        if (this._chips) {
            // Defer setting the value in order to avoid the "Expression
            // has changed after it was checked" errors from Angular.
            Promise.resolve().then(() => {
                this._chips.forEach(chip => {
                    chip._chipListMultiple = this.multiple;
                    chip.chipListSelectable = this._selectable;
                    chip._chipListHideSingleSelectionIndicator = this.hideSingleSelectionIndicator;
                    chip._changeDetectorRef.markForCheck();
                });
            });
        }
    }
    /** Returns the first selected chip in this listbox, or undefined if no chips are selected. */
    _getFirstSelectedChip() {
        if (Array.isArray(this.selected)) {
            return this.selected.length ? this.selected[0] : undefined;
        }
        else {
            return this.selected;
        }
    }
    /**
     * Determines if key manager should avoid putting a given chip action in the tab index. Skip
     * non-interactive actions since the user can't do anything with them.
     */
    _skipPredicate(action) {
        // Override the skip predicate in the base class to avoid skipping disabled chips. Allow
        // disabled chip options to receive focus to align with WAI ARIA recommendation. Normally WAI
        // ARIA's instructions are to exclude disabled items from the tab order, but it makes a few
        // exceptions for compound widgets.
        //
        // From [Developing a Keyboard Interface](
        // https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/):
        //   "For the following composite widget elements, keep them focusable when disabled: Options in a
        //   Listbox..."
        return !action.isInteractive;
    }
}
MatChipListbox.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MatChipListbox, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatChipListbox.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.0-rc.0", type: MatChipListbox, selector: "mat-chip-listbox", inputs: { tabIndex: "tabIndex", multiple: "multiple", ariaOrientation: ["aria-orientation", "ariaOrientation"], selectable: "selectable", compareWith: "compareWith", required: "required", hideSingleSelectionIndicator: "hideSingleSelectionIndicator", value: "value" }, outputs: { change: "change" }, host: { listeners: { "focus": "focus()", "blur": "_blur()", "keydown": "_keydown($event)" }, properties: { "attr.role": "role", "tabIndex": "empty ? -1 : tabIndex", "attr.aria-describedby": "_ariaDescribedby || null", "attr.aria-required": "role ? required : null", "attr.aria-disabled": "disabled.toString()", "attr.aria-multiselectable": "multiple", "attr.aria-orientation": "ariaOrientation", "class.mat-mdc-chip-list-disabled": "disabled", "class.mat-mdc-chip-list-required": "required" }, classAttribute: "mdc-evolution-chip-set mat-mdc-chip-listbox" }, providers: [MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR], queries: [{ propertyName: "_chips", predicate: MatChipOption, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `, isInline: true, styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MatChipListbox, decorators: [{
            type: Component,
            args: [{ selector: 'mat-chip-listbox', template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `, inputs: ['tabIndex'], host: {
                        'class': 'mdc-evolution-chip-set mat-mdc-chip-listbox',
                        '[attr.role]': 'role',
                        '[tabIndex]': 'empty ? -1 : tabIndex',
                        // TODO: replace this binding with use of AriaDescriber
                        '[attr.aria-describedby]': '_ariaDescribedby || null',
                        '[attr.aria-required]': 'role ? required : null',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[attr.aria-multiselectable]': 'multiple',
                        '[attr.aria-orientation]': 'ariaOrientation',
                        '[class.mat-mdc-chip-list-disabled]': 'disabled',
                        '[class.mat-mdc-chip-list-required]': 'required',
                        '(focus)': 'focus()',
                        '(blur)': '_blur()',
                        '(keydown)': '_keydown($event)',
                    }, providers: [MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"] }]
        }], propDecorators: { multiple: [{
                type: Input
            }], ariaOrientation: [{
                type: Input,
                args: ['aria-orientation']
            }], selectable: [{
                type: Input
            }], compareWith: [{
                type: Input
            }], required: [{
                type: Input
            }], hideSingleSelectionIndicator: [{
                type: Input
            }], value: [{
                type: Input
            }], change: [{
                type: Output
            }], _chips: [{
                type: ContentChildren,
                args: [MatChipOption, {
                        // We need to use `descendants: true`, because Ivy will no longer match
                        // indirect descendants if it's left as false.
                        descendants: true,
                    }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1saXN0Ym94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoaXBzL2NoaXAtbGlzdGJveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUxRSxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUMsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFFTCxNQUFNLEVBQ04sU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFdkUsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsYUFBYSxFQUF5QixNQUFNLGVBQWUsQ0FBQztBQUNwRSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3RDLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7QUFFbkQsbUZBQW1GO0FBQ25GLE1BQU0sT0FBTyxvQkFBb0I7SUFDL0I7SUFDRSwyQ0FBMkM7SUFDcEMsTUFBc0I7SUFDN0IsNERBQTREO0lBQ3JELEtBQVU7UUFGVixXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQUV0QixVQUFLLEdBQUwsS0FBSyxDQUFLO0lBQ2hCLENBQUM7Q0FDTDtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSx1Q0FBdUMsR0FBUTtJQUMxRCxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO0lBQzdDLEtBQUssRUFB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Z0JBSUYsUUFBUTtzQkFEWCxLQUFLO2dCQVdGLDRCQUE0QjtzQkFEL0IsS0FBSztnQkF1QkYsS0FBSztzQkFEUixLQUFLO2dCQVdhLE1BQU07c0JBQXhCLE1BQU07Z0JBUUUsTUFBTTtzQkFMZCxlQUFlO3VCQUFDLGFBQWEsRUFBRTt3QkFDOUIsdUVBQXVFO3dCQUN2RSw4Q0FBOEM7d0JBQzlDLFdBQVcsRUFBRSxJQUFJO3FCQUNsQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtNYXRDaGlwQWN0aW9ufSBmcm9tICcuL2NoaXAtYWN0aW9uJztcbmltcG9ydCB7VEFCfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIGluamVjdCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRDaGlwLCBNYXRDaGlwRXZlbnR9IGZyb20gJy4vY2hpcCc7XG5pbXBvcnQge01hdENoaXBPcHRpb24sIE1hdENoaXBTZWxlY3Rpb25DaGFuZ2V9IGZyb20gJy4vY2hpcC1vcHRpb24nO1xuaW1wb3J0IHtNYXRDaGlwU2V0fSBmcm9tICcuL2NoaXAtc2V0JztcbmltcG9ydCB7TUFUX0NISVBTX0RFRkFVTFRfT1BUSU9OU30gZnJvbSAnLi90b2tlbnMnO1xuXG4vKiogQ2hhbmdlIGV2ZW50IG9iamVjdCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgY2hpcCBsaXN0Ym94IHZhbHVlIGhhcyBjaGFuZ2VkLiAqL1xuZXhwb3J0IGNsYXNzIE1hdENoaXBMaXN0Ym94Q2hhbmdlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIENoaXAgbGlzdGJveCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdENoaXBMaXN0Ym94LFxuICAgIC8qKiBWYWx1ZSBvZiB0aGUgY2hpcCBsaXN0Ym94IHdoZW4gdGhlIGV2ZW50IHdhcyBlbWl0dGVkLiAqL1xuICAgIHB1YmxpYyB2YWx1ZTogYW55LFxuICApIHt9XG59XG5cbi8qKlxuICogUHJvdmlkZXIgRXhwcmVzc2lvbiB0aGF0IGFsbG93cyBtYXQtY2hpcC1saXN0Ym94IHRvIHJlZ2lzdGVyIGFzIGEgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gKiBUaGlzIGFsbG93cyBpdCB0byBzdXBwb3J0IFsobmdNb2RlbCldLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX0NISVBfTElTVEJPWF9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRDaGlwTGlzdGJveCksXG4gIG11bHRpOiB0cnVlLFxufTtcblxuLyoqXG4gKiBBbiBleHRlbnNpb24gb2YgdGhlIE1hdENoaXBTZXQgY29tcG9uZW50IHRoYXQgc3VwcG9ydHMgY2hpcCBzZWxlY3Rpb24uXG4gKiBVc2VkIHdpdGggTWF0Q2hpcE9wdGlvbiBjaGlwcy5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWNoaXAtbGlzdGJveCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cIm1kYy1ldm9sdXRpb24tY2hpcC1zZXRfX2NoaXBzXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZVVybHM6IFsnY2hpcC1zZXQuY3NzJ10sXG4gIGlucHV0czogWyd0YWJJbmRleCddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy1ldm9sdXRpb24tY2hpcC1zZXQgbWF0LW1kYy1jaGlwLWxpc3Rib3gnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdyb2xlJyxcbiAgICAnW3RhYkluZGV4XSc6ICdlbXB0eSA/IC0xIDogdGFiSW5kZXgnLFxuICAgIC8vIFRPRE86IHJlcGxhY2UgdGhpcyBiaW5kaW5nIHdpdGggdXNlIG9mIEFyaWFEZXNjcmliZXJcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX2FyaWFEZXNjcmliZWRieSB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1yZXF1aXJlZF0nOiAncm9sZSA/IHJlcXVpcmVkIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLW11bHRpc2VsZWN0YWJsZV0nOiAnbXVsdGlwbGUnLFxuICAgICdbYXR0ci5hcmlhLW9yaWVudGF0aW9uXSc6ICdhcmlhT3JpZW50YXRpb24nLFxuICAgICdbY2xhc3MubWF0LW1kYy1jaGlwLWxpc3QtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtY2hpcC1saXN0LXJlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gICAgJyhmb2N1cyknOiAnZm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfYmx1cigpJyxcbiAgICAnKGtleWRvd24pJzogJ19rZXlkb3duKCRldmVudCknLFxuICB9LFxuICBwcm92aWRlcnM6IFtNQVRfQ0hJUF9MSVNUQk9YX0NPTlRST0xfVkFMVUVfQUNDRVNTT1JdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcExpc3Rib3hcbiAgZXh0ZW5kcyBNYXRDaGlwU2V0XG4gIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3Nvclxue1xuICAvKipcbiAgICogRnVuY3Rpb24gd2hlbiB0b3VjaGVkLiBTZXQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3NvciBpbXBsZW1lbnRhdGlvbi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB3aGVuIGNoYW5nZWQuIFNldCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGltcGxlbWVudGF0aW9uLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBfb25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLy8gVE9ETzogTURDIHVzZXMgYGdyaWRgIGhlcmVcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9kZWZhdWx0Um9sZSA9ICdsaXN0Ym94JztcblxuICAvKiogVmFsdWUgdGhhdCB3YXMgYXNzaWduZWQgYmVmb3JlIHRoZSBsaXN0Ym94IHdhcyBpbml0aWFsaXplZC4gKi9cbiAgcHJpdmF0ZSBfcGVuZGluZ0luaXRpYWxWYWx1ZTogYW55O1xuXG4gIC8qKiBEZWZhdWx0IGNoaXAgb3B0aW9ucy4gKi9cbiAgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnMgPSBpbmplY3QoTUFUX0NISVBTX0RFRkFVTFRfT1BUSU9OUywge29wdGlvbmFsOiB0cnVlfSk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgc2hvdWxkIGJlIGFsbG93ZWQgdG8gc2VsZWN0IG11bHRpcGxlIGNoaXBzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbXVsdGlwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX211bHRpcGxlO1xuICB9XG4gIHNldCBtdWx0aXBsZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fbXVsdGlwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX3N5bmNMaXN0Ym94UHJvcGVydGllcygpO1xuICB9XG4gIHByaXZhdGUgX211bHRpcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBhcnJheSBvZiBzZWxlY3RlZCBjaGlwcyBpbnNpZGUgdGhlIGNoaXAgbGlzdGJveC4gKi9cbiAgZ2V0IHNlbGVjdGVkKCk6IE1hdENoaXBPcHRpb25bXSB8IE1hdENoaXBPcHRpb24ge1xuICAgIGNvbnN0IHNlbGVjdGVkQ2hpcHMgPSB0aGlzLl9jaGlwcy50b0FycmF5KCkuZmlsdGVyKGNoaXAgPT4gY2hpcC5zZWxlY3RlZCk7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlwbGUgPyBzZWxlY3RlZENoaXBzIDogc2VsZWN0ZWRDaGlwc1swXTtcbiAgfVxuXG4gIC8qKiBPcmllbnRhdGlvbiBvZiB0aGUgY2hpcCBsaXN0LiAqL1xuICBASW5wdXQoJ2FyaWEtb3JpZW50YXRpb24nKSBhcmlhT3JpZW50YXRpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcgPSAnaG9yaXpvbnRhbCc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoaXMgY2hpcCBsaXN0Ym94IGlzIHNlbGVjdGFibGUuXG4gICAqXG4gICAqIFdoZW4gYSBjaGlwIGxpc3Rib3ggaXMgbm90IHNlbGVjdGFibGUsIHRoZSBzZWxlY3RlZCBzdGF0ZXMgZm9yIGFsbFxuICAgKiB0aGUgY2hpcHMgaW5zaWRlIHRoZSBjaGlwIGxpc3Rib3ggYXJlIGFsd2F5cyBpZ25vcmVkLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGFibGU7XG4gIH1cbiAgc2V0IHNlbGVjdGFibGUodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3NlbGVjdGFibGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX3N5bmNMaXN0Ym94UHJvcGVydGllcygpO1xuICB9XG4gIHByb3RlY3RlZCBfc2VsZWN0YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gdG8gY29tcGFyZSB0aGUgb3B0aW9uIHZhbHVlcyB3aXRoIHRoZSBzZWxlY3RlZCB2YWx1ZXMuIFRoZSBmaXJzdCBhcmd1bWVudFxuICAgKiBpcyBhIHZhbHVlIGZyb20gYW4gb3B0aW9uLiBUaGUgc2Vjb25kIGlzIGEgdmFsdWUgZnJvbSB0aGUgc2VsZWN0aW9uLiBBIGJvb2xlYW5cbiAgICogc2hvdWxkIGJlIHJldHVybmVkLlxuICAgKi9cbiAgQElucHV0KCkgY29tcGFyZVdpdGg6IChvMTogYW55LCBvMjogYW55KSA9PiBib29sZWFuID0gKG8xOiBhbnksIG8yOiBhbnkpID0+IG8xID09PSBvMjtcblxuICAvKiogV2hldGhlciB0aGlzIGNoaXAgbGlzdGJveCBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZXF1aXJlZDtcbiAgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcm90ZWN0ZWQgX3JlcXVpcmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgY2hlY2ttYXJrIGluZGljYXRvciBmb3Igc2luZ2xlLXNlbGVjdGlvbiBvcHRpb25zIGlzIGhpZGRlbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3I7XG4gIH1cbiAgc2V0IGhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2hpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX3N5bmNMaXN0Ym94UHJvcGVydGllcygpO1xuICB9XG4gIHByaXZhdGUgX2hpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3I6IGJvb2xlYW4gPVxuICAgIHRoaXMuX2RlZmF1bHRPcHRpb25zPy5oaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yID8/IGZhbHNlO1xuXG4gIC8qKiBDb21iaW5lZCBzdHJlYW0gb2YgYWxsIG9mIHRoZSBjaGlsZCBjaGlwcycgc2VsZWN0aW9uIGNoYW5nZSBldmVudHMuICovXG4gIGdldCBjaGlwU2VsZWN0aW9uQ2hhbmdlcygpOiBPYnNlcnZhYmxlPE1hdENoaXBTZWxlY3Rpb25DaGFuZ2U+IHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0Q2hpcFN0cmVhbTxNYXRDaGlwU2VsZWN0aW9uQ2hhbmdlLCBNYXRDaGlwT3B0aW9uPihjaGlwID0+IGNoaXAuc2VsZWN0aW9uQ2hhbmdlKTtcbiAgfVxuXG4gIC8qKiBDb21iaW5lZCBzdHJlYW0gb2YgYWxsIG9mIHRoZSBjaGlsZCBjaGlwcycgYmx1ciBldmVudHMuICovXG4gIGdldCBjaGlwQmx1ckNoYW5nZXMoKTogT2JzZXJ2YWJsZTxNYXRDaGlwRXZlbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0Q2hpcFN0cmVhbShjaGlwID0+IGNoaXAuX29uQmx1cik7XG4gIH1cblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBsaXN0Ym94LCB3aGljaCBpcyB0aGUgY29tYmluZWQgdmFsdWUgb2YgdGhlIHNlbGVjdGVkIGNoaXBzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cbiAgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLndyaXRlVmFsdWUodmFsdWUpO1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gIH1cbiAgcHJvdGVjdGVkIF92YWx1ZTogYW55O1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdGVkIGNoaXAgbGlzdGJveCB2YWx1ZSBoYXMgYmVlbiBjaGFuZ2VkIGJ5IHRoZSB1c2VyLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcExpc3Rib3hDaGFuZ2U+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdENoaXBMaXN0Ym94Q2hhbmdlPigpO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0Q2hpcE9wdGlvbiwge1xuICAgIC8vIFdlIG5lZWQgdG8gdXNlIGBkZXNjZW5kYW50czogdHJ1ZWAsIGJlY2F1c2UgSXZ5IHdpbGwgbm8gbG9uZ2VyIG1hdGNoXG4gICAgLy8gaW5kaXJlY3QgZGVzY2VuZGFudHMgaWYgaXQncyBsZWZ0IGFzIGZhbHNlLlxuICAgIGRlc2NlbmRhbnRzOiB0cnVlLFxuICB9KVxuICBvdmVycmlkZSBfY2hpcHM6IFF1ZXJ5TGlzdDxNYXRDaGlwT3B0aW9uPjtcblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgaWYgKHRoaXMuX3BlbmRpbmdJbml0aWFsVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUodGhpcy5fcGVuZGluZ0luaXRpYWxWYWx1ZSwgZmFsc2UpO1xuICAgICAgICB0aGlzLl9wZW5kaW5nSW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fY2hpcHMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBVcGRhdGUgbGlzdGJveCBzZWxlY3RhYmxlL211bHRpcGxlIHByb3BlcnRpZXMgb24gY2hpcHNcbiAgICAgIHRoaXMuX3N5bmNMaXN0Ym94UHJvcGVydGllcygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5jaGlwQmx1ckNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2JsdXIoKSk7XG4gICAgdGhpcy5jaGlwU2VsZWN0aW9uQ2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKCF0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuX2NoaXBzLmZvckVhY2goY2hpcCA9PiB7XG4gICAgICAgICAgaWYgKGNoaXAgIT09IGV2ZW50LnNvdXJjZSkge1xuICAgICAgICAgICAgY2hpcC5fc2V0U2VsZWN0ZWRTdGF0ZShmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnQuaXNVc2VySW5wdXQpIHtcbiAgICAgICAgdGhpcy5fcHJvcGFnYXRlQ2hhbmdlcygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIGZpcnN0IHNlbGVjdGVkIGNoaXAgaW4gdGhpcyBjaGlwIGxpc3Rib3gsIG9yIHRoZSBmaXJzdCBub24tZGlzYWJsZWQgY2hpcCB3aGVuIHRoZXJlXG4gICAqIGFyZSBubyBzZWxlY3RlZCBjaGlwcy5cbiAgICovXG4gIG92ZXJyaWRlIGZvY3VzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZmlyc3RTZWxlY3RlZENoaXAgPSB0aGlzLl9nZXRGaXJzdFNlbGVjdGVkQ2hpcCgpO1xuXG4gICAgaWYgKGZpcnN0U2VsZWN0ZWRDaGlwICYmICFmaXJzdFNlbGVjdGVkQ2hpcC5kaXNhYmxlZCkge1xuICAgICAgZmlyc3RTZWxlY3RlZENoaXAuZm9jdXMoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2NoaXBzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fY2hpcHMpIHtcbiAgICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUodmFsdWUsIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3BlbmRpbmdJbml0aWFsVmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICAvKiogU2VsZWN0cyBhbGwgY2hpcHMgd2l0aCB2YWx1ZS4gKi9cbiAgX3NldFNlbGVjdGlvbkJ5VmFsdWUodmFsdWU6IGFueSwgaXNVc2VySW5wdXQ6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgdGhpcy5fY2xlYXJTZWxlY3Rpb24oKTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdmFsdWUuZm9yRWFjaChjdXJyZW50VmFsdWUgPT4gdGhpcy5fc2VsZWN0VmFsdWUoY3VycmVudFZhbHVlLCBpc1VzZXJJbnB1dCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZWxlY3RWYWx1ZSh2YWx1ZSwgaXNVc2VySW5wdXQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGVuIGJsdXJyZWQsIG1hcmtzIHRoZSBmaWVsZCBhcyB0b3VjaGVkIHdoZW4gZm9jdXMgbW92ZWQgb3V0c2lkZSB0aGUgY2hpcCBsaXN0Ym94LiAqL1xuICBfYmx1cigpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIC8vIFdhaXQgdG8gc2VlIGlmIGZvY3VzIG1vdmVzIHRvIGFuIGluZGl2aWR1YWwgY2hpcC5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuZm9jdXNlZCkge1xuICAgICAgICAgIHRoaXMuX21hcmtBc1RvdWNoZWQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX2tleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gVEFCKSB7XG4gICAgICBzdXBlci5fYWxsb3dGb2N1c0VzY2FwZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBNYXJrcyB0aGUgZmllbGQgYXMgdG91Y2hlZCAqL1xuICBwcml2YXRlIF9tYXJrQXNUb3VjaGVkKCkge1xuICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIEVtaXRzIGNoYW5nZSBldmVudCB0byBzZXQgdGhlIG1vZGVsIHZhbHVlLiAqL1xuICBwcml2YXRlIF9wcm9wYWdhdGVDaGFuZ2VzKCk6IHZvaWQge1xuICAgIGxldCB2YWx1ZVRvRW1pdDogYW55ID0gbnVsbDtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc2VsZWN0ZWQpKSB7XG4gICAgICB2YWx1ZVRvRW1pdCA9IHRoaXMuc2VsZWN0ZWQubWFwKGNoaXAgPT4gY2hpcC52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlVG9FbWl0ID0gdGhpcy5zZWxlY3RlZCA/IHRoaXMuc2VsZWN0ZWQudmFsdWUgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWVUb0VtaXQ7XG4gICAgdGhpcy5jaGFuZ2UuZW1pdChuZXcgTWF0Q2hpcExpc3Rib3hDaGFuZ2UodGhpcywgdmFsdWVUb0VtaXQpKTtcbiAgICB0aGlzLl9vbkNoYW5nZSh2YWx1ZVRvRW1pdCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogRGVzZWxlY3RzIGV2ZXJ5IGNoaXAgaW4gdGhlIGxpc3Rib3guXG4gICAqIEBwYXJhbSBza2lwIENoaXAgdGhhdCBzaG91bGQgbm90IGJlIGRlc2VsZWN0ZWQuXG4gICAqL1xuICBwcml2YXRlIF9jbGVhclNlbGVjdGlvbihza2lwPzogTWF0Q2hpcCk6IHZvaWQge1xuICAgIHRoaXMuX2NoaXBzLmZvckVhY2goY2hpcCA9PiB7XG4gICAgICBpZiAoY2hpcCAhPT0gc2tpcCkge1xuICAgICAgICBjaGlwLmRlc2VsZWN0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgYW5kIHNlbGVjdHMgdGhlIGNoaXAgYmFzZWQgb24gaXRzIHZhbHVlLlxuICAgKiBAcmV0dXJucyBDaGlwIHRoYXQgaGFzIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2VsZWN0VmFsdWUodmFsdWU6IGFueSwgaXNVc2VySW5wdXQ6IGJvb2xlYW4pOiBNYXRDaGlwIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBjb3JyZXNwb25kaW5nQ2hpcCA9IHRoaXMuX2NoaXBzLmZpbmQoY2hpcCA9PiB7XG4gICAgICByZXR1cm4gY2hpcC52YWx1ZSAhPSBudWxsICYmIHRoaXMuY29tcGFyZVdpdGgoY2hpcC52YWx1ZSwgdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgaWYgKGNvcnJlc3BvbmRpbmdDaGlwKSB7XG4gICAgICBpc1VzZXJJbnB1dCA/IGNvcnJlc3BvbmRpbmdDaGlwLnNlbGVjdFZpYUludGVyYWN0aW9uKCkgOiBjb3JyZXNwb25kaW5nQ2hpcC5zZWxlY3QoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29ycmVzcG9uZGluZ0NoaXA7XG4gIH1cblxuICAvKiogU3luY3MgdGhlIGNoaXAtbGlzdGJveCBzZWxlY3Rpb24gc3RhdGUgd2l0aCB0aGUgaW5kaXZpZHVhbCBjaGlwcy4gKi9cbiAgcHJpdmF0ZSBfc3luY0xpc3Rib3hQcm9wZXJ0aWVzKCkge1xuICAgIGlmICh0aGlzLl9jaGlwcykge1xuICAgICAgLy8gRGVmZXIgc2V0dGluZyB0aGUgdmFsdWUgaW4gb3JkZXIgdG8gYXZvaWQgdGhlIFwiRXhwcmVzc2lvblxuICAgICAgLy8gaGFzIGNoYW5nZWQgYWZ0ZXIgaXQgd2FzIGNoZWNrZWRcIiBlcnJvcnMgZnJvbSBBbmd1bGFyLlxuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NoaXBzLmZvckVhY2goY2hpcCA9PiB7XG4gICAgICAgICAgY2hpcC5fY2hpcExpc3RNdWx0aXBsZSA9IHRoaXMubXVsdGlwbGU7XG4gICAgICAgICAgY2hpcC5jaGlwTGlzdFNlbGVjdGFibGUgPSB0aGlzLl9zZWxlY3RhYmxlO1xuICAgICAgICAgIGNoaXAuX2NoaXBMaXN0SGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvciA9IHRoaXMuaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvcjtcbiAgICAgICAgICBjaGlwLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgZmlyc3Qgc2VsZWN0ZWQgY2hpcCBpbiB0aGlzIGxpc3Rib3gsIG9yIHVuZGVmaW5lZCBpZiBubyBjaGlwcyBhcmUgc2VsZWN0ZWQuICovXG4gIHByaXZhdGUgX2dldEZpcnN0U2VsZWN0ZWRDaGlwKCk6IE1hdENoaXBPcHRpb24gfCB1bmRlZmluZWQge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc2VsZWN0ZWQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZC5sZW5ndGggPyB0aGlzLnNlbGVjdGVkWzBdIDogdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBrZXkgbWFuYWdlciBzaG91bGQgYXZvaWQgcHV0dGluZyBhIGdpdmVuIGNoaXAgYWN0aW9uIGluIHRoZSB0YWIgaW5kZXguIFNraXBcbiAgICogbm9uLWludGVyYWN0aXZlIGFjdGlvbnMgc2luY2UgdGhlIHVzZXIgY2FuJ3QgZG8gYW55dGhpbmcgd2l0aCB0aGVtLlxuICAgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9za2lwUHJlZGljYXRlKGFjdGlvbjogTWF0Q2hpcEFjdGlvbik6IGJvb2xlYW4ge1xuICAgIC8vIE92ZXJyaWRlIHRoZSBza2lwIHByZWRpY2F0ZSBpbiB0aGUgYmFzZSBjbGFzcyB0byBhdm9pZCBza2lwcGluZyBkaXNhYmxlZCBjaGlwcy4gQWxsb3dcbiAgICAvLyBkaXNhYmxlZCBjaGlwIG9wdGlvbnMgdG8gcmVjZWl2ZSBmb2N1cyB0byBhbGlnbiB3aXRoIFdBSSBBUklBIHJlY29tbWVuZGF0aW9uLiBOb3JtYWxseSBXQUlcbiAgICAvLyBBUklBJ3MgaW5zdHJ1Y3Rpb25zIGFyZSB0byBleGNsdWRlIGRpc2FibGVkIGl0ZW1zIGZyb20gdGhlIHRhYiBvcmRlciwgYnV0IGl0IG1ha2VzIGEgZmV3XG4gICAgLy8gZXhjZXB0aW9ucyBmb3IgY29tcG91bmQgd2lkZ2V0cy5cbiAgICAvL1xuICAgIC8vIEZyb20gW0RldmVsb3BpbmcgYSBLZXlib2FyZCBJbnRlcmZhY2VdKFxuICAgIC8vIGh0dHBzOi8vd3d3LnczLm9yZy9XQUkvQVJJQS9hcGcvcHJhY3RpY2VzL2tleWJvYXJkLWludGVyZmFjZS8pOlxuICAgIC8vICAgXCJGb3IgdGhlIGZvbGxvd2luZyBjb21wb3NpdGUgd2lkZ2V0IGVsZW1lbnRzLCBrZWVwIHRoZW0gZm9jdXNhYmxlIHdoZW4gZGlzYWJsZWQ6IE9wdGlvbnMgaW4gYVxuICAgIC8vICAgTGlzdGJveC4uLlwiXG4gICAgcmV0dXJuICFhY3Rpb24uaXNJbnRlcmFjdGl2ZTtcbiAgfVxufVxuIl19