/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { booleanAttribute, ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, forwardRef, inject, Input, Output, QueryList, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { startWith, takeUntil } from 'rxjs/operators';
import { TAB } from '@angular/cdk/keycodes';
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
        /** Whether this chip listbox is required. */
        this.required = false;
        this._hideSingleSelectionIndicator = this._defaultOptions?.hideSingleSelectionIndicator ?? false;
        /** Event emitted when the selected chip listbox value has been changed by the user. */
        this.change = new EventEmitter();
        this._chips = undefined;
    }
    /** Whether the user should be allowed to select multiple chips. */
    get multiple() {
        return this._multiple;
    }
    set multiple(value) {
        this._multiple = value;
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
        this._selectable = value;
        this._syncListboxProperties();
    }
    /** Whether checkmark indicator for single-selection options is hidden. */
    get hideSingleSelectionIndicator() {
        return this._hideSingleSelectionIndicator;
    }
    set hideSingleSelectionIndicator(value) {
        this._hideSingleSelectionIndicator = value;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatChipListbox, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "17.0.0", type: MatChipListbox, isStandalone: true, selector: "mat-chip-listbox", inputs: { multiple: ["multiple", "multiple", booleanAttribute], ariaOrientation: ["aria-orientation", "ariaOrientation"], selectable: ["selectable", "selectable", booleanAttribute], compareWith: "compareWith", required: ["required", "required", booleanAttribute], hideSingleSelectionIndicator: ["hideSingleSelectionIndicator", "hideSingleSelectionIndicator", booleanAttribute], value: "value" }, outputs: { change: "change" }, host: { attributes: { "ngSkipHydration": "" }, listeners: { "focus": "focus()", "blur": "_blur()", "keydown": "_keydown($event)" }, properties: { "attr.role": "role", "tabIndex": "(disabled || empty) ? -1 : tabIndex", "attr.aria-describedby": "_ariaDescribedby || null", "attr.aria-required": "role ? required : null", "attr.aria-disabled": "disabled.toString()", "attr.aria-multiselectable": "multiple", "attr.aria-orientation": "ariaOrientation", "class.mat-mdc-chip-list-disabled": "disabled", "class.mat-mdc-chip-list-required": "required" }, classAttribute: "mdc-evolution-chip-set mat-mdc-chip-listbox" }, providers: [MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR], queries: [{ propertyName: "_chips", predicate: MatChipOption, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `, isInline: true, styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatChipListbox, decorators: [{
            type: Component,
            args: [{ selector: 'mat-chip-listbox', template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `, host: {
                        'class': 'mdc-evolution-chip-set mat-mdc-chip-listbox',
                        '[attr.role]': 'role',
                        '[tabIndex]': '(disabled || empty) ? -1 : tabIndex',
                        // TODO: replace this binding with use of AriaDescriber
                        '[attr.aria-describedby]': '_ariaDescribedby || null',
                        '[attr.aria-required]': 'role ? required : null',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[attr.aria-multiselectable]': 'multiple',
                        '[attr.aria-orientation]': 'ariaOrientation',
                        'ngSkipHydration': '',
                        '[class.mat-mdc-chip-list-disabled]': 'disabled',
                        '[class.mat-mdc-chip-list-required]': 'required',
                        '(focus)': 'focus()',
                        '(blur)': '_blur()',
                        '(keydown)': '_keydown($event)',
                    }, providers: [MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"] }]
        }], propDecorators: { multiple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], ariaOrientation: [{
                type: Input,
                args: ['aria-orientation']
            }], selectable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], compareWith: [{
                type: Input
            }], required: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], hideSingleSelectionIndicator: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1saXN0Ym94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoaXBzL2NoaXAtbGlzdGJveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBRUwsZ0JBQWdCLEVBQ2hCLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFFTCxNQUFNLEVBQ04sU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFdkUsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFMUMsT0FBTyxFQUFDLGFBQWEsRUFBeUIsTUFBTSxlQUFlLENBQUM7QUFDcEUsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUV0QyxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSxVQUFVLENBQUM7O0FBRW5ELG1GQUFtRjtBQUNuRixNQUFNLE9BQU8sb0JBQW9CO0lBQy9CO0lBQ0UsMkNBQTJDO0lBQ3BDLE1BQXNCO0lBQzdCLDREQUE0RDtJQUNyRCxLQUFVO1FBRlYsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFFdEIsVUFBSyxHQUFMLEtBQUssQ0FBSztJQUNoQixDQUFDO0NBQ0w7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sdUNBQXVDLEdBQVE7SUFDMUQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQztJQUM3QyxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRjs7O0dBR0c7QUEr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QTRCO3NCQUQvQixLQUFLO3VCQUFDLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFDO2dCQXVCaEMsS0FBSztzQkFEUixLQUFLO2dCQVdhLE1BQU07c0JBQXhCLE1BQU07Z0JBU0UsTUFBTTtzQkFOZCxlQUFlO3VCQUFDLGFBQWEsRUFBRTt3QkFDOUIsdUVBQXVFO3dCQUN2RSw4Q0FBOEM7d0JBQzlDLFdBQVcsRUFBRSxJQUFJO3FCQUNsQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBib29sZWFuQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgaW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1RBQn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7TWF0Q2hpcCwgTWF0Q2hpcEV2ZW50fSBmcm9tICcuL2NoaXAnO1xuaW1wb3J0IHtNYXRDaGlwT3B0aW9uLCBNYXRDaGlwU2VsZWN0aW9uQ2hhbmdlfSBmcm9tICcuL2NoaXAtb3B0aW9uJztcbmltcG9ydCB7TWF0Q2hpcFNldH0gZnJvbSAnLi9jaGlwLXNldCc7XG5pbXBvcnQge01hdENoaXBBY3Rpb259IGZyb20gJy4vY2hpcC1hY3Rpb24nO1xuaW1wb3J0IHtNQVRfQ0hJUFNfREVGQVVMVF9PUFRJT05TfSBmcm9tICcuL3Rva2Vucyc7XG5cbi8qKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IHRoYXQgaXMgZW1pdHRlZCB3aGVuIHRoZSBjaGlwIGxpc3Rib3ggdmFsdWUgaGFzIGNoYW5nZWQuICovXG5leHBvcnQgY2xhc3MgTWF0Q2hpcExpc3Rib3hDaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogQ2hpcCBsaXN0Ym94IHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0Q2hpcExpc3Rib3gsXG4gICAgLyoqIFZhbHVlIG9mIHRoZSBjaGlwIGxpc3Rib3ggd2hlbiB0aGUgZXZlbnQgd2FzIGVtaXR0ZWQuICovXG4gICAgcHVibGljIHZhbHVlOiBhbnksXG4gICkge31cbn1cblxuLyoqXG4gKiBQcm92aWRlciBFeHByZXNzaW9uIHRoYXQgYWxsb3dzIG1hdC1jaGlwLWxpc3Rib3ggdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIFRoaXMgYWxsb3dzIGl0IHRvIHN1cHBvcnQgWyhuZ01vZGVsKV0uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQ0hJUF9MSVNUQk9YX0NPTlRST0xfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdENoaXBMaXN0Ym94KSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKipcbiAqIEFuIGV4dGVuc2lvbiBvZiB0aGUgTWF0Q2hpcFNldCBjb21wb25lbnQgdGhhdCBzdXBwb3J0cyBjaGlwIHNlbGVjdGlvbi5cbiAqIFVzZWQgd2l0aCBNYXRDaGlwT3B0aW9uIGNoaXBzLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hpcC1saXN0Ym94JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwibWRjLWV2b2x1dGlvbi1jaGlwLXNldF9fY2hpcHNcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlVXJsczogWydjaGlwLXNldC5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtZGMtZXZvbHV0aW9uLWNoaXAtc2V0IG1hdC1tZGMtY2hpcC1saXN0Ym94JyxcbiAgICAnW2F0dHIucm9sZV0nOiAncm9sZScsXG4gICAgJ1t0YWJJbmRleF0nOiAnKGRpc2FibGVkIHx8IGVtcHR5KSA/IC0xIDogdGFiSW5kZXgnLFxuICAgIC8vIFRPRE86IHJlcGxhY2UgdGhpcyBiaW5kaW5nIHdpdGggdXNlIG9mIEFyaWFEZXNjcmliZXJcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX2FyaWFEZXNjcmliZWRieSB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1yZXF1aXJlZF0nOiAncm9sZSA/IHJlcXVpcmVkIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLW11bHRpc2VsZWN0YWJsZV0nOiAnbXVsdGlwbGUnLFxuICAgICdbYXR0ci5hcmlhLW9yaWVudGF0aW9uXSc6ICdhcmlhT3JpZW50YXRpb24nLFxuICAgICduZ1NraXBIeWRyYXRpb24nOiAnJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtY2hpcC1saXN0LWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLWNoaXAtbGlzdC1yZXF1aXJlZF0nOiAncmVxdWlyZWQnLFxuICAgICcoZm9jdXMpJzogJ2ZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX2JsdXIoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfa2V5ZG93bigkZXZlbnQpJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbTUFUX0NISVBfTElTVEJPWF9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXBMaXN0Ym94XG4gIGV4dGVuZHMgTWF0Q2hpcFNldFxuICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3JcbntcbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHdoZW4gdG91Y2hlZC4gU2V0IGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW1wbGVtZW50YXRpb24uXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKipcbiAgICogRnVuY3Rpb24gd2hlbiBjaGFuZ2VkLiBTZXQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3NvciBpbXBsZW1lbnRhdGlvbi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgX29uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8vIFRPRE86IE1EQyB1c2VzIGBncmlkYCBoZXJlXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfZGVmYXVsdFJvbGUgPSAnbGlzdGJveCc7XG5cbiAgLyoqIFZhbHVlIHRoYXQgd2FzIGFzc2lnbmVkIGJlZm9yZSB0aGUgbGlzdGJveCB3YXMgaW5pdGlhbGl6ZWQuICovXG4gIHByaXZhdGUgX3BlbmRpbmdJbml0aWFsVmFsdWU6IGFueTtcblxuICAvKiogRGVmYXVsdCBjaGlwIG9wdGlvbnMuICovXG4gIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zID0gaW5qZWN0KE1BVF9DSElQU19ERUZBVUxUX09QVElPTlMsIHtvcHRpb25hbDogdHJ1ZX0pO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIHNob3VsZCBiZSBhbGxvd2VkIHRvIHNlbGVjdCBtdWx0aXBsZSBjaGlwcy4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBnZXQgbXVsdGlwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX211bHRpcGxlO1xuICB9XG4gIHNldCBtdWx0aXBsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX211bHRpcGxlID0gdmFsdWU7XG4gICAgdGhpcy5fc3luY0xpc3Rib3hQcm9wZXJ0aWVzKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbXVsdGlwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIGFycmF5IG9mIHNlbGVjdGVkIGNoaXBzIGluc2lkZSB0aGUgY2hpcCBsaXN0Ym94LiAqL1xuICBnZXQgc2VsZWN0ZWQoKTogTWF0Q2hpcE9wdGlvbltdIHwgTWF0Q2hpcE9wdGlvbiB7XG4gICAgY29uc3Qgc2VsZWN0ZWRDaGlwcyA9IHRoaXMuX2NoaXBzLnRvQXJyYXkoKS5maWx0ZXIoY2hpcCA9PiBjaGlwLnNlbGVjdGVkKTtcbiAgICByZXR1cm4gdGhpcy5tdWx0aXBsZSA/IHNlbGVjdGVkQ2hpcHMgOiBzZWxlY3RlZENoaXBzWzBdO1xuICB9XG5cbiAgLyoqIE9yaWVudGF0aW9uIG9mIHRoZSBjaGlwIGxpc3QuICovXG4gIEBJbnB1dCgnYXJpYS1vcmllbnRhdGlvbicpIGFyaWFPcmllbnRhdGlvbjogJ2hvcml6b250YWwnIHwgJ3ZlcnRpY2FsJyA9ICdob3Jpem9udGFsJztcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhpcyBjaGlwIGxpc3Rib3ggaXMgc2VsZWN0YWJsZS5cbiAgICpcbiAgICogV2hlbiBhIGNoaXAgbGlzdGJveCBpcyBub3Qgc2VsZWN0YWJsZSwgdGhlIHNlbGVjdGVkIHN0YXRlcyBmb3IgYWxsXG4gICAqIHRoZSBjaGlwcyBpbnNpZGUgdGhlIGNoaXAgbGlzdGJveCBhcmUgYWx3YXlzIGlnbm9yZWQuXG4gICAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGdldCBzZWxlY3RhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RhYmxlO1xuICB9XG4gIHNldCBzZWxlY3RhYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2VsZWN0YWJsZSA9IHZhbHVlO1xuICAgIHRoaXMuX3N5bmNMaXN0Ym94UHJvcGVydGllcygpO1xuICB9XG4gIHByb3RlY3RlZCBfc2VsZWN0YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gdG8gY29tcGFyZSB0aGUgb3B0aW9uIHZhbHVlcyB3aXRoIHRoZSBzZWxlY3RlZCB2YWx1ZXMuIFRoZSBmaXJzdCBhcmd1bWVudFxuICAgKiBpcyBhIHZhbHVlIGZyb20gYW4gb3B0aW9uLiBUaGUgc2Vjb25kIGlzIGEgdmFsdWUgZnJvbSB0aGUgc2VsZWN0aW9uLiBBIGJvb2xlYW5cbiAgICogc2hvdWxkIGJlIHJldHVybmVkLlxuICAgKi9cbiAgQElucHV0KCkgY29tcGFyZVdpdGg6IChvMTogYW55LCBvMjogYW55KSA9PiBib29sZWFuID0gKG8xOiBhbnksIG8yOiBhbnkpID0+IG8xID09PSBvMjtcblxuICAvKiogV2hldGhlciB0aGlzIGNoaXAgbGlzdGJveCBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICByZXF1aXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIGNoZWNrbWFyayBpbmRpY2F0b3IgZm9yIHNpbmdsZS1zZWxlY3Rpb24gb3B0aW9ucyBpcyBoaWRkZW4uICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZ2V0IGhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3I7XG4gIH1cbiAgc2V0IGhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9oaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yID0gdmFsdWU7XG4gICAgdGhpcy5fc3luY0xpc3Rib3hQcm9wZXJ0aWVzKCk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvcjogYm9vbGVhbiA9XG4gICAgdGhpcy5fZGVmYXVsdE9wdGlvbnM/LmhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IgPz8gZmFsc2U7XG5cbiAgLyoqIENvbWJpbmVkIHN0cmVhbSBvZiBhbGwgb2YgdGhlIGNoaWxkIGNoaXBzJyBzZWxlY3Rpb24gY2hhbmdlIGV2ZW50cy4gKi9cbiAgZ2V0IGNoaXBTZWxlY3Rpb25DaGFuZ2VzKCk6IE9ic2VydmFibGU8TWF0Q2hpcFNlbGVjdGlvbkNoYW5nZT4ge1xuICAgIHJldHVybiB0aGlzLl9nZXRDaGlwU3RyZWFtPE1hdENoaXBTZWxlY3Rpb25DaGFuZ2UsIE1hdENoaXBPcHRpb24+KGNoaXAgPT4gY2hpcC5zZWxlY3Rpb25DaGFuZ2UpO1xuICB9XG5cbiAgLyoqIENvbWJpbmVkIHN0cmVhbSBvZiBhbGwgb2YgdGhlIGNoaWxkIGNoaXBzJyBibHVyIGV2ZW50cy4gKi9cbiAgZ2V0IGNoaXBCbHVyQ2hhbmdlcygpOiBPYnNlcnZhYmxlPE1hdENoaXBFdmVudD4ge1xuICAgIHJldHVybiB0aGlzLl9nZXRDaGlwU3RyZWFtKGNoaXAgPT4gY2hpcC5fb25CbHVyKTtcbiAgfVxuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhlIGxpc3Rib3gsIHdoaWNoIGlzIHRoZSBjb21iaW5lZCB2YWx1ZSBvZiB0aGUgc2VsZWN0ZWQgY2hpcHMuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMud3JpdGVWYWx1ZSh2YWx1ZSk7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgfVxuICBwcm90ZWN0ZWQgX3ZhbHVlOiBhbnk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0ZWQgY2hpcCBsaXN0Ym94IHZhbHVlIGhhcyBiZWVuIGNoYW5nZWQgYnkgdGhlIHVzZXIuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRDaGlwTGlzdGJveENoYW5nZT4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcExpc3Rib3hDaGFuZ2U+KCk7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRDaGlwT3B0aW9uLCB7XG4gICAgLy8gV2UgbmVlZCB0byB1c2UgYGRlc2NlbmRhbnRzOiB0cnVlYCwgYmVjYXVzZSBJdnkgd2lsbCBubyBsb25nZXIgbWF0Y2hcbiAgICAvLyBpbmRpcmVjdCBkZXNjZW5kYW50cyBpZiBpdCdzIGxlZnQgYXMgZmFsc2UuXG4gICAgZGVzY2VuZGFudHM6IHRydWUsXG4gIH0pXG4gIC8vIFdlIG5lZWQgYW4gaW5pdGlhbGl6ZXIgaGVyZSB0byBhdm9pZCBhIFRTIGVycm9yLiBUaGUgdmFsdWUgd2lsbCBiZSBzZXQgaW4gYG5nQWZ0ZXJWaWV3SW5pdGAuXG4gIG92ZXJyaWRlIF9jaGlwczogUXVlcnlMaXN0PE1hdENoaXBPcHRpb24+ID0gdW5kZWZpbmVkITtcblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgaWYgKHRoaXMuX3BlbmRpbmdJbml0aWFsVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUodGhpcy5fcGVuZGluZ0luaXRpYWxWYWx1ZSwgZmFsc2UpO1xuICAgICAgICB0aGlzLl9wZW5kaW5nSW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fY2hpcHMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBVcGRhdGUgbGlzdGJveCBzZWxlY3RhYmxlL211bHRpcGxlIHByb3BlcnRpZXMgb24gY2hpcHNcbiAgICAgIHRoaXMuX3N5bmNMaXN0Ym94UHJvcGVydGllcygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5jaGlwQmx1ckNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2JsdXIoKSk7XG4gICAgdGhpcy5jaGlwU2VsZWN0aW9uQ2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKCF0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuX2NoaXBzLmZvckVhY2goY2hpcCA9PiB7XG4gICAgICAgICAgaWYgKGNoaXAgIT09IGV2ZW50LnNvdXJjZSkge1xuICAgICAgICAgICAgY2hpcC5fc2V0U2VsZWN0ZWRTdGF0ZShmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnQuaXNVc2VySW5wdXQpIHtcbiAgICAgICAgdGhpcy5fcHJvcGFnYXRlQ2hhbmdlcygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIGZpcnN0IHNlbGVjdGVkIGNoaXAgaW4gdGhpcyBjaGlwIGxpc3Rib3gsIG9yIHRoZSBmaXJzdCBub24tZGlzYWJsZWQgY2hpcCB3aGVuIHRoZXJlXG4gICAqIGFyZSBubyBzZWxlY3RlZCBjaGlwcy5cbiAgICovXG4gIG92ZXJyaWRlIGZvY3VzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZmlyc3RTZWxlY3RlZENoaXAgPSB0aGlzLl9nZXRGaXJzdFNlbGVjdGVkQ2hpcCgpO1xuXG4gICAgaWYgKGZpcnN0U2VsZWN0ZWRDaGlwICYmICFmaXJzdFNlbGVjdGVkQ2hpcC5kaXNhYmxlZCkge1xuICAgICAgZmlyc3RTZWxlY3RlZENoaXAuZm9jdXMoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2NoaXBzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fY2hpcHMpIHtcbiAgICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUodmFsdWUsIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3BlbmRpbmdJbml0aWFsVmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICAvKiogU2VsZWN0cyBhbGwgY2hpcHMgd2l0aCB2YWx1ZS4gKi9cbiAgX3NldFNlbGVjdGlvbkJ5VmFsdWUodmFsdWU6IGFueSwgaXNVc2VySW5wdXQ6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgdGhpcy5fY2xlYXJTZWxlY3Rpb24oKTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdmFsdWUuZm9yRWFjaChjdXJyZW50VmFsdWUgPT4gdGhpcy5fc2VsZWN0VmFsdWUoY3VycmVudFZhbHVlLCBpc1VzZXJJbnB1dCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZWxlY3RWYWx1ZSh2YWx1ZSwgaXNVc2VySW5wdXQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGVuIGJsdXJyZWQsIG1hcmtzIHRoZSBmaWVsZCBhcyB0b3VjaGVkIHdoZW4gZm9jdXMgbW92ZWQgb3V0c2lkZSB0aGUgY2hpcCBsaXN0Ym94LiAqL1xuICBfYmx1cigpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIC8vIFdhaXQgdG8gc2VlIGlmIGZvY3VzIG1vdmVzIHRvIGFuIGluZGl2aWR1YWwgY2hpcC5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuZm9jdXNlZCkge1xuICAgICAgICAgIHRoaXMuX21hcmtBc1RvdWNoZWQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX2tleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gVEFCKSB7XG4gICAgICBzdXBlci5fYWxsb3dGb2N1c0VzY2FwZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBNYXJrcyB0aGUgZmllbGQgYXMgdG91Y2hlZCAqL1xuICBwcml2YXRlIF9tYXJrQXNUb3VjaGVkKCkge1xuICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIEVtaXRzIGNoYW5nZSBldmVudCB0byBzZXQgdGhlIG1vZGVsIHZhbHVlLiAqL1xuICBwcml2YXRlIF9wcm9wYWdhdGVDaGFuZ2VzKCk6IHZvaWQge1xuICAgIGxldCB2YWx1ZVRvRW1pdDogYW55ID0gbnVsbDtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc2VsZWN0ZWQpKSB7XG4gICAgICB2YWx1ZVRvRW1pdCA9IHRoaXMuc2VsZWN0ZWQubWFwKGNoaXAgPT4gY2hpcC52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlVG9FbWl0ID0gdGhpcy5zZWxlY3RlZCA/IHRoaXMuc2VsZWN0ZWQudmFsdWUgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWVUb0VtaXQ7XG4gICAgdGhpcy5jaGFuZ2UuZW1pdChuZXcgTWF0Q2hpcExpc3Rib3hDaGFuZ2UodGhpcywgdmFsdWVUb0VtaXQpKTtcbiAgICB0aGlzLl9vbkNoYW5nZSh2YWx1ZVRvRW1pdCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogRGVzZWxlY3RzIGV2ZXJ5IGNoaXAgaW4gdGhlIGxpc3Rib3guXG4gICAqIEBwYXJhbSBza2lwIENoaXAgdGhhdCBzaG91bGQgbm90IGJlIGRlc2VsZWN0ZWQuXG4gICAqL1xuICBwcml2YXRlIF9jbGVhclNlbGVjdGlvbihza2lwPzogTWF0Q2hpcCk6IHZvaWQge1xuICAgIHRoaXMuX2NoaXBzLmZvckVhY2goY2hpcCA9PiB7XG4gICAgICBpZiAoY2hpcCAhPT0gc2tpcCkge1xuICAgICAgICBjaGlwLmRlc2VsZWN0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgYW5kIHNlbGVjdHMgdGhlIGNoaXAgYmFzZWQgb24gaXRzIHZhbHVlLlxuICAgKiBAcmV0dXJucyBDaGlwIHRoYXQgaGFzIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2VsZWN0VmFsdWUodmFsdWU6IGFueSwgaXNVc2VySW5wdXQ6IGJvb2xlYW4pOiBNYXRDaGlwIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBjb3JyZXNwb25kaW5nQ2hpcCA9IHRoaXMuX2NoaXBzLmZpbmQoY2hpcCA9PiB7XG4gICAgICByZXR1cm4gY2hpcC52YWx1ZSAhPSBudWxsICYmIHRoaXMuY29tcGFyZVdpdGgoY2hpcC52YWx1ZSwgdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgaWYgKGNvcnJlc3BvbmRpbmdDaGlwKSB7XG4gICAgICBpc1VzZXJJbnB1dCA/IGNvcnJlc3BvbmRpbmdDaGlwLnNlbGVjdFZpYUludGVyYWN0aW9uKCkgOiBjb3JyZXNwb25kaW5nQ2hpcC5zZWxlY3QoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29ycmVzcG9uZGluZ0NoaXA7XG4gIH1cblxuICAvKiogU3luY3MgdGhlIGNoaXAtbGlzdGJveCBzZWxlY3Rpb24gc3RhdGUgd2l0aCB0aGUgaW5kaXZpZHVhbCBjaGlwcy4gKi9cbiAgcHJpdmF0ZSBfc3luY0xpc3Rib3hQcm9wZXJ0aWVzKCkge1xuICAgIGlmICh0aGlzLl9jaGlwcykge1xuICAgICAgLy8gRGVmZXIgc2V0dGluZyB0aGUgdmFsdWUgaW4gb3JkZXIgdG8gYXZvaWQgdGhlIFwiRXhwcmVzc2lvblxuICAgICAgLy8gaGFzIGNoYW5nZWQgYWZ0ZXIgaXQgd2FzIGNoZWNrZWRcIiBlcnJvcnMgZnJvbSBBbmd1bGFyLlxuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NoaXBzLmZvckVhY2goY2hpcCA9PiB7XG4gICAgICAgICAgY2hpcC5fY2hpcExpc3RNdWx0aXBsZSA9IHRoaXMubXVsdGlwbGU7XG4gICAgICAgICAgY2hpcC5jaGlwTGlzdFNlbGVjdGFibGUgPSB0aGlzLl9zZWxlY3RhYmxlO1xuICAgICAgICAgIGNoaXAuX2NoaXBMaXN0SGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvciA9IHRoaXMuaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvcjtcbiAgICAgICAgICBjaGlwLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgZmlyc3Qgc2VsZWN0ZWQgY2hpcCBpbiB0aGlzIGxpc3Rib3gsIG9yIHVuZGVmaW5lZCBpZiBubyBjaGlwcyBhcmUgc2VsZWN0ZWQuICovXG4gIHByaXZhdGUgX2dldEZpcnN0U2VsZWN0ZWRDaGlwKCk6IE1hdENoaXBPcHRpb24gfCB1bmRlZmluZWQge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc2VsZWN0ZWQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZC5sZW5ndGggPyB0aGlzLnNlbGVjdGVkWzBdIDogdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBrZXkgbWFuYWdlciBzaG91bGQgYXZvaWQgcHV0dGluZyBhIGdpdmVuIGNoaXAgYWN0aW9uIGluIHRoZSB0YWIgaW5kZXguIFNraXBcbiAgICogbm9uLWludGVyYWN0aXZlIGFjdGlvbnMgc2luY2UgdGhlIHVzZXIgY2FuJ3QgZG8gYW55dGhpbmcgd2l0aCB0aGVtLlxuICAgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9za2lwUHJlZGljYXRlKGFjdGlvbjogTWF0Q2hpcEFjdGlvbik6IGJvb2xlYW4ge1xuICAgIC8vIE92ZXJyaWRlIHRoZSBza2lwIHByZWRpY2F0ZSBpbiB0aGUgYmFzZSBjbGFzcyB0byBhdm9pZCBza2lwcGluZyBkaXNhYmxlZCBjaGlwcy4gQWxsb3dcbiAgICAvLyBkaXNhYmxlZCBjaGlwIG9wdGlvbnMgdG8gcmVjZWl2ZSBmb2N1cyB0byBhbGlnbiB3aXRoIFdBSSBBUklBIHJlY29tbWVuZGF0aW9uLiBOb3JtYWxseSBXQUlcbiAgICAvLyBBUklBJ3MgaW5zdHJ1Y3Rpb25zIGFyZSB0byBleGNsdWRlIGRpc2FibGVkIGl0ZW1zIGZyb20gdGhlIHRhYiBvcmRlciwgYnV0IGl0IG1ha2VzIGEgZmV3XG4gICAgLy8gZXhjZXB0aW9ucyBmb3IgY29tcG91bmQgd2lkZ2V0cy5cbiAgICAvL1xuICAgIC8vIEZyb20gW0RldmVsb3BpbmcgYSBLZXlib2FyZCBJbnRlcmZhY2VdKFxuICAgIC8vIGh0dHBzOi8vd3d3LnczLm9yZy9XQUkvQVJJQS9hcGcvcHJhY3RpY2VzL2tleWJvYXJkLWludGVyZmFjZS8pOlxuICAgIC8vICAgXCJGb3IgdGhlIGZvbGxvd2luZyBjb21wb3NpdGUgd2lkZ2V0IGVsZW1lbnRzLCBrZWVwIHRoZW0gZm9jdXNhYmxlIHdoZW4gZGlzYWJsZWQ6IE9wdGlvbnMgaW4gYVxuICAgIC8vICAgTGlzdGJveC4uLlwiXG4gICAgcmV0dXJuICFhY3Rpb24uaXNJbnRlcmFjdGl2ZTtcbiAgfVxufVxuIl19