/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { TAB } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, forwardRef, Input, Output, QueryList, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { startWith, takeUntil } from 'rxjs/operators';
import { MatChipOption } from './chip-option';
import { MatChipSet } from './chip-set';
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
                    this._propagateChanges();
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
MatChipListbox.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MatChipListbox, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatChipListbox.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: MatChipListbox, selector: "mat-chip-listbox", inputs: { tabIndex: "tabIndex", multiple: "multiple", ariaOrientation: ["aria-orientation", "ariaOrientation"], selectable: "selectable", compareWith: "compareWith", required: "required", value: "value" }, outputs: { change: "change" }, host: { listeners: { "focus": "focus()", "blur": "_blur()", "keydown": "_keydown($event)" }, properties: { "attr.role": "role", "tabIndex": "empty ? -1 : tabIndex", "attr.aria-describedby": "_ariaDescribedby || null", "attr.aria-required": "role ? required : null", "attr.aria-disabled": "disabled.toString()", "attr.aria-multiselectable": "multiple", "attr.aria-orientation": "ariaOrientation", "class.mat-mdc-chip-list-disabled": "disabled", "class.mat-mdc-chip-list-required": "required" }, classAttribute: "mdc-evolution-chip-set mat-mdc-chip-listbox" }, providers: [MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR], queries: [{ propertyName: "_chips", predicate: MatChipOption, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <span class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </span>
  `, isInline: true, styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MatChipListbox, decorators: [{
            type: Component,
            args: [{ selector: 'mat-chip-listbox', template: `
    <span class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </span>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1saXN0Ym94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoaXBzL2NoaXAtbGlzdGJveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUxRSxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUMsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLFlBQVksRUFDWixVQUFVLEVBQ1YsS0FBSyxFQUVMLE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV2RSxPQUFPLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxhQUFhLEVBQXlCLE1BQU0sZUFBZSxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxZQUFZLENBQUM7O0FBRXRDLG1GQUFtRjtBQUNuRixNQUFNLE9BQU8sb0JBQW9CO0lBQy9CO0lBQ0UsMkNBQTJDO0lBQ3BDLE1BQXNCO0lBQzdCLDREQUE0RDtJQUNyRCxLQUFVO1FBRlYsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFFdEIsVUFBSyxHQUFMLEtBQUssQ0FBSztJQUNoQixDQUFDO0NBQ0w7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sdUNBQXVDLEdBQVE7SUFDMUQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQztJQUM3QyxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRjs7O0dBR0c7QUE4QkgsTUFBTSxPQUFPLGNBQ1gsU0FB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QUFhLEVBQUUsTUFBTTt3QkFDckIsWUFBWSxFQUFFLHVCQUF1Qjt3QkFDckMsdURBQXVEO3dCQUN2RCx5QkFBeUIsRUFBRSwwQkFBMEI7d0JBQ3JELHNCQUFzQixFQUFFLHdCQUF3Qjt3QkFDaEQsc0JBQXNCLEVBQUUscUJBQXFCO3dCQUM3Qyw2QkFBNkIsRUFBRSxVQUFVO3dCQUN6Qyx5QkFBeUIsRUFBRSxpQkFBaUI7d0JBQzVDLG9DQUFvQyxFQUFFLFVBQVU7d0JBQ2hELG9DQUFvQyxFQUFFLFVBQVU7d0JBQ2hELFNBQVMsRUFBRSxTQUFTO3dCQUNwQixRQUFRLEVBQUUsU0FBUzt3QkFDbkIsV0FBVyxFQUFFLGtCQUFrQjtxQkFDaEMsYUFDVSxDQUFDLHVDQUF1QyxDQUFDLGlCQUNyQyxpQkFBaUIsQ0FBQyxJQUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNOzhCQTBCM0MsUUFBUTtzQkFEWCxLQUFLO2dCQWlCcUIsZUFBZTtzQkFBekMsS0FBSzt1QkFBQyxrQkFBa0I7Z0JBU3JCLFVBQVU7c0JBRGIsS0FBSztnQkFlRyxXQUFXO3NCQUFuQixLQUFLO2dCQUlGLFFBQVE7c0JBRFgsS0FBSztnQkFxQkYsS0FBSztzQkFEUixLQUFLO2dCQVdhLE1BQU07c0JBQXhCLE1BQU07Z0JBUUUsTUFBTTtzQkFMZCxlQUFlO3VCQUFDLGFBQWEsRUFBRTt3QkFDOUIsdUVBQXVFO3dCQUN2RSw4Q0FBOEM7d0JBQzlDLFdBQVcsRUFBRSxJQUFJO3FCQUNsQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtNYXRDaGlwQWN0aW9ufSBmcm9tICcuL2NoaXAtYWN0aW9uJztcbmltcG9ydCB7VEFCfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRoLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWF0Q2hpcCwgTWF0Q2hpcEV2ZW50fSBmcm9tICcuL2NoaXAnO1xuaW1wb3J0IHtNYXRDaGlwT3B0aW9uLCBNYXRDaGlwU2VsZWN0aW9uQ2hhbmdlfSBmcm9tICcuL2NoaXAtb3B0aW9uJztcbmltcG9ydCB7TWF0Q2hpcFNldH0gZnJvbSAnLi9jaGlwLXNldCc7XG5cbi8qKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IHRoYXQgaXMgZW1pdHRlZCB3aGVuIHRoZSBjaGlwIGxpc3Rib3ggdmFsdWUgaGFzIGNoYW5nZWQuICovXG5leHBvcnQgY2xhc3MgTWF0Q2hpcExpc3Rib3hDaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogQ2hpcCBsaXN0Ym94IHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0Q2hpcExpc3Rib3gsXG4gICAgLyoqIFZhbHVlIG9mIHRoZSBjaGlwIGxpc3Rib3ggd2hlbiB0aGUgZXZlbnQgd2FzIGVtaXR0ZWQuICovXG4gICAgcHVibGljIHZhbHVlOiBhbnksXG4gICkge31cbn1cblxuLyoqXG4gKiBQcm92aWRlciBFeHByZXNzaW9uIHRoYXQgYWxsb3dzIG1hdC1jaGlwLWxpc3Rib3ggdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIFRoaXMgYWxsb3dzIGl0IHRvIHN1cHBvcnQgWyhuZ01vZGVsKV0uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQ0hJUF9MSVNUQk9YX0NPTlRST0xfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdENoaXBMaXN0Ym94KSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKipcbiAqIEFuIGV4dGVuc2lvbiBvZiB0aGUgTWF0Q2hpcFNldCBjb21wb25lbnQgdGhhdCBzdXBwb3J0cyBjaGlwIHNlbGVjdGlvbi5cbiAqIFVzZWQgd2l0aCBNYXRDaGlwT3B0aW9uIGNoaXBzLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hpcC1saXN0Ym94JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3BhbiBjbGFzcz1cIm1kYy1ldm9sdXRpb24tY2hpcC1zZXRfX2NoaXBzXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvc3Bhbj5cbiAgYCxcbiAgc3R5bGVVcmxzOiBbJ2NoaXAtc2V0LmNzcyddLFxuICBpbnB1dHM6IFsndGFiSW5kZXgnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtZGMtZXZvbHV0aW9uLWNoaXAtc2V0IG1hdC1tZGMtY2hpcC1saXN0Ym94JyxcbiAgICAnW2F0dHIucm9sZV0nOiAncm9sZScsXG4gICAgJ1t0YWJJbmRleF0nOiAnZW1wdHkgPyAtMSA6IHRhYkluZGV4JyxcbiAgICAvLyBUT0RPOiByZXBsYWNlIHRoaXMgYmluZGluZyB3aXRoIHVzZSBvZiBBcmlhRGVzY3JpYmVyXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19hcmlhRGVzY3JpYmVkYnkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ3JvbGUgPyByZXF1aXJlZCA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1tdWx0aXNlbGVjdGFibGVdJzogJ211bHRpcGxlJyxcbiAgICAnW2F0dHIuYXJpYS1vcmllbnRhdGlvbl0nOiAnYXJpYU9yaWVudGF0aW9uJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtY2hpcC1saXN0LWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLWNoaXAtbGlzdC1yZXF1aXJlZF0nOiAncmVxdWlyZWQnLFxuICAgICcoZm9jdXMpJzogJ2ZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX2JsdXIoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfa2V5ZG93bigkZXZlbnQpJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbTUFUX0NISVBfTElTVEJPWF9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXBMaXN0Ym94XG4gIGV4dGVuZHMgTWF0Q2hpcFNldFxuICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3JcbntcbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHdoZW4gdG91Y2hlZC4gU2V0IGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW1wbGVtZW50YXRpb24uXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKipcbiAgICogRnVuY3Rpb24gd2hlbiBjaGFuZ2VkLiBTZXQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3NvciBpbXBsZW1lbnRhdGlvbi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgX29uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8vIFRPRE86IE1EQyB1c2VzIGBncmlkYCBoZXJlXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfZGVmYXVsdFJvbGUgPSAnbGlzdGJveCc7XG5cbiAgLyoqIFZhbHVlIHRoYXQgd2FzIGFzc2lnbmVkIGJlZm9yZSB0aGUgbGlzdGJveCB3YXMgaW5pdGlhbGl6ZWQuICovXG4gIHByaXZhdGUgX3BlbmRpbmdJbml0aWFsVmFsdWU6IGFueTtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBzaG91bGQgYmUgYWxsb3dlZCB0byBzZWxlY3QgbXVsdGlwbGUgY2hpcHMuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtdWx0aXBsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbXVsdGlwbGU7XG4gIH1cbiAgc2V0IG11bHRpcGxlKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9tdWx0aXBsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5fc3luY0xpc3Rib3hQcm9wZXJ0aWVzKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbXVsdGlwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIGFycmF5IG9mIHNlbGVjdGVkIGNoaXBzIGluc2lkZSB0aGUgY2hpcCBsaXN0Ym94LiAqL1xuICBnZXQgc2VsZWN0ZWQoKTogTWF0Q2hpcE9wdGlvbltdIHwgTWF0Q2hpcE9wdGlvbiB7XG4gICAgY29uc3Qgc2VsZWN0ZWRDaGlwcyA9IHRoaXMuX2NoaXBzLnRvQXJyYXkoKS5maWx0ZXIoY2hpcCA9PiBjaGlwLnNlbGVjdGVkKTtcbiAgICByZXR1cm4gdGhpcy5tdWx0aXBsZSA/IHNlbGVjdGVkQ2hpcHMgOiBzZWxlY3RlZENoaXBzWzBdO1xuICB9XG5cbiAgLyoqIE9yaWVudGF0aW9uIG9mIHRoZSBjaGlwIGxpc3QuICovXG4gIEBJbnB1dCgnYXJpYS1vcmllbnRhdGlvbicpIGFyaWFPcmllbnRhdGlvbjogJ2hvcml6b250YWwnIHwgJ3ZlcnRpY2FsJyA9ICdob3Jpem9udGFsJztcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhpcyBjaGlwIGxpc3Rib3ggaXMgc2VsZWN0YWJsZS5cbiAgICpcbiAgICogV2hlbiBhIGNoaXAgbGlzdGJveCBpcyBub3Qgc2VsZWN0YWJsZSwgdGhlIHNlbGVjdGVkIHN0YXRlcyBmb3IgYWxsXG4gICAqIHRoZSBjaGlwcyBpbnNpZGUgdGhlIGNoaXAgbGlzdGJveCBhcmUgYWx3YXlzIGlnbm9yZWQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0YWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0YWJsZTtcbiAgfVxuICBzZXQgc2VsZWN0YWJsZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fc2VsZWN0YWJsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5fc3luY0xpc3Rib3hQcm9wZXJ0aWVzKCk7XG4gIH1cbiAgcHJvdGVjdGVkIF9zZWxlY3RhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB0byBjb21wYXJlIHRoZSBvcHRpb24gdmFsdWVzIHdpdGggdGhlIHNlbGVjdGVkIHZhbHVlcy4gVGhlIGZpcnN0IGFyZ3VtZW50XG4gICAqIGlzIGEgdmFsdWUgZnJvbSBhbiBvcHRpb24uIFRoZSBzZWNvbmQgaXMgYSB2YWx1ZSBmcm9tIHRoZSBzZWxlY3Rpb24uIEEgYm9vbGVhblxuICAgKiBzaG91bGQgYmUgcmV0dXJuZWQuXG4gICAqL1xuICBASW5wdXQoKSBjb21wYXJlV2l0aDogKG8xOiBhbnksIG8yOiBhbnkpID0+IGJvb2xlYW4gPSAobzE6IGFueSwgbzI6IGFueSkgPT4gbzEgPT09IG8yO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgY2hpcCBsaXN0Ym94IGlzIHJlcXVpcmVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVkO1xuICB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfcmVxdWlyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQ29tYmluZWQgc3RyZWFtIG9mIGFsbCBvZiB0aGUgY2hpbGQgY2hpcHMnIHNlbGVjdGlvbiBjaGFuZ2UgZXZlbnRzLiAqL1xuICBnZXQgY2hpcFNlbGVjdGlvbkNoYW5nZXMoKTogT2JzZXJ2YWJsZTxNYXRDaGlwU2VsZWN0aW9uQ2hhbmdlPiB7XG4gICAgcmV0dXJuIHRoaXMuX2dldENoaXBTdHJlYW08TWF0Q2hpcFNlbGVjdGlvbkNoYW5nZSwgTWF0Q2hpcE9wdGlvbj4oY2hpcCA9PiBjaGlwLnNlbGVjdGlvbkNoYW5nZSk7XG4gIH1cblxuICAvKiogQ29tYmluZWQgc3RyZWFtIG9mIGFsbCBvZiB0aGUgY2hpbGQgY2hpcHMnIGJsdXIgZXZlbnRzLiAqL1xuICBnZXQgY2hpcEJsdXJDaGFuZ2VzKCk6IE9ic2VydmFibGU8TWF0Q2hpcEV2ZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX2dldENoaXBTdHJlYW0oY2hpcCA9PiBjaGlwLl9vbkJsdXIpO1xuICB9XG5cbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGUgbGlzdGJveCwgd2hpY2ggaXMgdGhlIGNvbWJpbmVkIHZhbHVlIG9mIHRoZSBzZWxlY3RlZCBjaGlwcy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy53cml0ZVZhbHVlKHZhbHVlKTtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICB9XG4gIHByb3RlY3RlZCBfdmFsdWU6IGFueTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3RlZCBjaGlwIGxpc3Rib3ggdmFsdWUgaGFzIGJlZW4gY2hhbmdlZCBieSB0aGUgdXNlci4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdENoaXBMaXN0Ym94Q2hhbmdlPiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRDaGlwTGlzdGJveENoYW5nZT4oKTtcblxuICBAQ29udGVudENoaWxkcmVuKE1hdENoaXBPcHRpb24sIHtcbiAgICAvLyBXZSBuZWVkIHRvIHVzZSBgZGVzY2VuZGFudHM6IHRydWVgLCBiZWNhdXNlIEl2eSB3aWxsIG5vIGxvbmdlciBtYXRjaFxuICAgIC8vIGluZGlyZWN0IGRlc2NlbmRhbnRzIGlmIGl0J3MgbGVmdCBhcyBmYWxzZS5cbiAgICBkZXNjZW5kYW50czogdHJ1ZSxcbiAgfSlcbiAgb3ZlcnJpZGUgX2NoaXBzOiBRdWVyeUxpc3Q8TWF0Q2hpcE9wdGlvbj47XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIGlmICh0aGlzLl9wZW5kaW5nSW5pdGlhbFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl9zZXRTZWxlY3Rpb25CeVZhbHVlKHRoaXMuX3BlbmRpbmdJbml0aWFsVmFsdWUsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5fcGVuZGluZ0luaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX2NoaXBzLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gVXBkYXRlIGxpc3Rib3ggc2VsZWN0YWJsZS9tdWx0aXBsZSBwcm9wZXJ0aWVzIG9uIGNoaXBzXG4gICAgICB0aGlzLl9zeW5jTGlzdGJveFByb3BlcnRpZXMoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuY2hpcEJsdXJDaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9ibHVyKCkpO1xuICAgIHRoaXMuY2hpcFNlbGVjdGlvbkNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmICghdGhpcy5tdWx0aXBsZSkge1xuICAgICAgICB0aGlzLl9jaGlwcy5mb3JFYWNoKGNoaXAgPT4ge1xuICAgICAgICAgIGlmIChjaGlwICE9PSBldmVudC5zb3VyY2UpIHtcbiAgICAgICAgICAgIGNoaXAuX3NldFNlbGVjdGVkU3RhdGUoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50LmlzVXNlcklucHV0KSB7XG4gICAgICAgIHRoaXMuX3Byb3BhZ2F0ZUNoYW5nZXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBmaXJzdCBzZWxlY3RlZCBjaGlwIGluIHRoaXMgY2hpcCBsaXN0Ym94LCBvciB0aGUgZmlyc3Qgbm9uLWRpc2FibGVkIGNoaXAgd2hlbiB0aGVyZVxuICAgKiBhcmUgbm8gc2VsZWN0ZWQgY2hpcHMuXG4gICAqL1xuICBvdmVycmlkZSBmb2N1cygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZpcnN0U2VsZWN0ZWRDaGlwID0gdGhpcy5fZ2V0Rmlyc3RTZWxlY3RlZENoaXAoKTtcblxuICAgIGlmIChmaXJzdFNlbGVjdGVkQ2hpcCAmJiAhZmlyc3RTZWxlY3RlZENoaXAuZGlzYWJsZWQpIHtcbiAgICAgIGZpcnN0U2VsZWN0ZWRDaGlwLmZvY3VzKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9jaGlwcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldEZpcnN0SXRlbUFjdGl2ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2NoaXBzKSB7XG4gICAgICB0aGlzLl9zZXRTZWxlY3Rpb25CeVZhbHVlKHZhbHVlLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9wZW5kaW5nSW5pdGlhbFZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgLyoqIFNlbGVjdHMgYWxsIGNoaXBzIHdpdGggdmFsdWUuICovXG4gIF9zZXRTZWxlY3Rpb25CeVZhbHVlKHZhbHVlOiBhbnksIGlzVXNlcklucHV0OiBib29sZWFuID0gdHJ1ZSkge1xuICAgIHRoaXMuX2NsZWFyU2VsZWN0aW9uKCk7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHZhbHVlLmZvckVhY2goY3VycmVudFZhbHVlID0+IHRoaXMuX3NlbGVjdFZhbHVlKGN1cnJlbnRWYWx1ZSwgaXNVc2VySW5wdXQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2VsZWN0VmFsdWUodmFsdWUsIGlzVXNlcklucHV0KTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hlbiBibHVycmVkLCBtYXJrcyB0aGUgZmllbGQgYXMgdG91Y2hlZCB3aGVuIGZvY3VzIG1vdmVkIG91dHNpZGUgdGhlIGNoaXAgbGlzdGJveC4gKi9cbiAgX2JsdXIoKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAvLyBXYWl0IHRvIHNlZSBpZiBmb2N1cyBtb3ZlcyB0byBhbiBpbmRpdmlkdWFsIGNoaXAuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZvY3VzZWQpIHtcbiAgICAgICAgICB0aGlzLl9wcm9wYWdhdGVDaGFuZ2VzKCk7XG4gICAgICAgICAgdGhpcy5fbWFya0FzVG91Y2hlZCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfa2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSBUQUIpIHtcbiAgICAgIHN1cGVyLl9hbGxvd0ZvY3VzRXNjYXBlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIE1hcmtzIHRoZSBmaWVsZCBhcyB0b3VjaGVkICovXG4gIHByaXZhdGUgX21hcmtBc1RvdWNoZWQoKSB7XG4gICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogRW1pdHMgY2hhbmdlIGV2ZW50IHRvIHNldCB0aGUgbW9kZWwgdmFsdWUuICovXG4gIHByaXZhdGUgX3Byb3BhZ2F0ZUNoYW5nZXMoKTogdm9pZCB7XG4gICAgbGV0IHZhbHVlVG9FbWl0OiBhbnkgPSBudWxsO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zZWxlY3RlZCkpIHtcbiAgICAgIHZhbHVlVG9FbWl0ID0gdGhpcy5zZWxlY3RlZC5tYXAoY2hpcCA9PiBjaGlwLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWVUb0VtaXQgPSB0aGlzLnNlbGVjdGVkID8gdGhpcy5zZWxlY3RlZC52YWx1ZSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZVRvRW1pdDtcbiAgICB0aGlzLmNoYW5nZS5lbWl0KG5ldyBNYXRDaGlwTGlzdGJveENoYW5nZSh0aGlzLCB2YWx1ZVRvRW1pdCkpO1xuICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlVG9FbWl0KTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlbGVjdHMgZXZlcnkgY2hpcCBpbiB0aGUgbGlzdGJveC5cbiAgICogQHBhcmFtIHNraXAgQ2hpcCB0aGF0IHNob3VsZCBub3QgYmUgZGVzZWxlY3RlZC5cbiAgICovXG4gIHByaXZhdGUgX2NsZWFyU2VsZWN0aW9uKHNraXA/OiBNYXRDaGlwKTogdm9pZCB7XG4gICAgdGhpcy5fY2hpcHMuZm9yRWFjaChjaGlwID0+IHtcbiAgICAgIGlmIChjaGlwICE9PSBza2lwKSB7XG4gICAgICAgIGNoaXAuZGVzZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbmQgc2VsZWN0cyB0aGUgY2hpcCBiYXNlZCBvbiBpdHMgdmFsdWUuXG4gICAqIEByZXR1cm5zIENoaXAgdGhhdCBoYXMgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUuXG4gICAqL1xuICBwcml2YXRlIF9zZWxlY3RWYWx1ZSh2YWx1ZTogYW55LCBpc1VzZXJJbnB1dDogYm9vbGVhbik6IE1hdENoaXAgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdDaGlwID0gdGhpcy5fY2hpcHMuZmluZChjaGlwID0+IHtcbiAgICAgIHJldHVybiBjaGlwLnZhbHVlICE9IG51bGwgJiYgdGhpcy5jb21wYXJlV2l0aChjaGlwLnZhbHVlLCB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICBpZiAoY29ycmVzcG9uZGluZ0NoaXApIHtcbiAgICAgIGlzVXNlcklucHV0ID8gY29ycmVzcG9uZGluZ0NoaXAuc2VsZWN0VmlhSW50ZXJhY3Rpb24oKSA6IGNvcnJlc3BvbmRpbmdDaGlwLnNlbGVjdCgpO1xuICAgIH1cblxuICAgIHJldHVybiBjb3JyZXNwb25kaW5nQ2hpcDtcbiAgfVxuXG4gIC8qKiBTeW5jcyB0aGUgY2hpcC1saXN0Ym94IHNlbGVjdGlvbiBzdGF0ZSB3aXRoIHRoZSBpbmRpdmlkdWFsIGNoaXBzLiAqL1xuICBwcml2YXRlIF9zeW5jTGlzdGJveFByb3BlcnRpZXMoKSB7XG4gICAgaWYgKHRoaXMuX2NoaXBzKSB7XG4gICAgICAvLyBEZWZlciBzZXR0aW5nIHRoZSB2YWx1ZSBpbiBvcmRlciB0byBhdm9pZCB0aGUgXCJFeHByZXNzaW9uXG4gICAgICAvLyBoYXMgY2hhbmdlZCBhZnRlciBpdCB3YXMgY2hlY2tlZFwiIGVycm9ycyBmcm9tIEFuZ3VsYXIuXG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5fY2hpcHMuZm9yRWFjaChjaGlwID0+IHtcbiAgICAgICAgICBjaGlwLl9jaGlwTGlzdE11bHRpcGxlID0gdGhpcy5tdWx0aXBsZTtcbiAgICAgICAgICBjaGlwLmNoaXBMaXN0U2VsZWN0YWJsZSA9IHRoaXMuX3NlbGVjdGFibGU7XG4gICAgICAgICAgY2hpcC5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGZpcnN0IHNlbGVjdGVkIGNoaXAgaW4gdGhpcyBsaXN0Ym94LCBvciB1bmRlZmluZWQgaWYgbm8gY2hpcHMgYXJlIHNlbGVjdGVkLiAqL1xuICBwcml2YXRlIF9nZXRGaXJzdFNlbGVjdGVkQ2hpcCgpOiBNYXRDaGlwT3B0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnNlbGVjdGVkKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWQubGVuZ3RoID8gdGhpcy5zZWxlY3RlZFswXSA6IHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYga2V5IG1hbmFnZXIgc2hvdWxkIGF2b2lkIHB1dHRpbmcgYSBnaXZlbiBjaGlwIGFjdGlvbiBpbiB0aGUgdGFiIGluZGV4LiBTa2lwXG4gICAqIG5vbi1pbnRlcmFjdGl2ZSBhY3Rpb25zIHNpbmNlIHRoZSB1c2VyIGNhbid0IGRvIGFueXRoaW5nIHdpdGggdGhlbS5cbiAgICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfc2tpcFByZWRpY2F0ZShhY3Rpb246IE1hdENoaXBBY3Rpb24pOiBib29sZWFuIHtcbiAgICAvLyBPdmVycmlkZSB0aGUgc2tpcCBwcmVkaWNhdGUgaW4gdGhlIGJhc2UgY2xhc3MgdG8gYXZvaWQgc2tpcHBpbmcgZGlzYWJsZWQgY2hpcHMuIEFsbG93XG4gICAgLy8gZGlzYWJsZWQgY2hpcCBvcHRpb25zIHRvIHJlY2VpdmUgZm9jdXMgdG8gYWxpZ24gd2l0aCBXQUkgQVJJQSByZWNvbW1lbmRhdGlvbi4gTm9ybWFsbHkgV0FJXG4gICAgLy8gQVJJQSdzIGluc3RydWN0aW9ucyBhcmUgdG8gZXhjbHVkZSBkaXNhYmxlZCBpdGVtcyBmcm9tIHRoZSB0YWIgb3JkZXIsIGJ1dCBpdCBtYWtlcyBhIGZld1xuICAgIC8vIGV4Y2VwdGlvbnMgZm9yIGNvbXBvdW5kIHdpZGdldHMuXG4gICAgLy9cbiAgICAvLyBGcm9tIFtEZXZlbG9waW5nIGEgS2V5Ym9hcmQgSW50ZXJmYWNlXShcbiAgICAvLyBodHRwczovL3d3dy53My5vcmcvV0FJL0FSSUEvYXBnL3ByYWN0aWNlcy9rZXlib2FyZC1pbnRlcmZhY2UvKTpcbiAgICAvLyAgIFwiRm9yIHRoZSBmb2xsb3dpbmcgY29tcG9zaXRlIHdpZGdldCBlbGVtZW50cywga2VlcCB0aGVtIGZvY3VzYWJsZSB3aGVuIGRpc2FibGVkOiBPcHRpb25zIGluIGFcbiAgICAvLyAgIExpc3Rib3guLi5cIlxuICAgIHJldHVybiAhYWN0aW9uLmlzSW50ZXJhY3RpdmU7XG4gIH1cbn1cbiJdfQ==