/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { hasModifierKey, TAB } from '@angular/cdk/keycodes';
import { booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Input, Optional, Output, QueryList, Self, ViewEncapsulation, } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm, Validators, } from '@angular/forms';
import { ErrorStateMatcher, _ErrorStateTracker } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatChipRow } from './chip-row';
import { MatChipSet } from './chip-set';
import { Directionality } from '@angular/cdk/bidi';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/material/core";
/** Change event object that is emitted when the chip grid value has changed. */
export class MatChipGridChange {
    constructor(
    /** Chip grid that emitted the event. */
    source, 
    /** Value of the chip grid when the event was emitted. */
    value) {
        this.source = source;
        this.value = value;
    }
}
/**
 * An extension of the MatChipSet component used with MatChipRow chips and
 * the matChipInputFor directive.
 */
export class MatChipGrid extends MatChipSet {
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get disabled() {
        return this.ngControl ? !!this.ngControl.disabled : this._disabled;
    }
    set disabled(value) {
        this._disabled = value;
        this._syncChipsState();
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get id() {
        return this._chipInput.id;
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get empty() {
        return ((!this._chipInput || this._chipInput.empty) && (!this._chips || this._chips.length === 0));
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get placeholder() {
        return this._chipInput ? this._chipInput.placeholder : this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    /** Whether any chips or the matChipInput inside of this chip-grid has focus. */
    get focused() {
        return this._chipInput.focused || this._hasFocusedChip();
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get required() {
        return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
    }
    set required(value) {
        this._required = value;
        this.stateChanges.next();
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get shouldLabelFloat() {
        return !this.empty || this.focused;
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    /** An object used to control when error messages are shown. */
    get errorStateMatcher() {
        return this._errorStateTracker.matcher;
    }
    set errorStateMatcher(value) {
        this._errorStateTracker.matcher = value;
    }
    /** Combined stream of all of the child chips' blur events. */
    get chipBlurChanges() {
        return this._getChipStream(chip => chip._onBlur);
    }
    /** Whether the chip grid is in an error state. */
    get errorState() {
        return this._errorStateTracker.errorState;
    }
    set errorState(value) {
        this._errorStateTracker.errorState = value;
    }
    constructor(elementRef, changeDetectorRef, dir, parentForm, parentFormGroup, defaultErrorStateMatcher, ngControl) {
        super(elementRef, changeDetectorRef, dir);
        this.ngControl = ngControl;
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        this.controlType = 'mat-chip-grid';
        this._defaultRole = 'grid';
        /**
         * List of element ids to propagate to the chipInput's aria-describedby attribute.
         */
        this._ariaDescribedbyIds = [];
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
        this._value = [];
        /** Emits when the chip grid value has been changed by the user. */
        this.change = new EventEmitter();
        /**
         * Emits whenever the raw value of the chip-grid changes. This is here primarily
         * to facilitate the two-way binding for the `value` input.
         * @docs-private
         */
        this.valueChange = new EventEmitter();
        this._chips = undefined;
        /**
         * Emits whenever the component state changes and should cause the parent
         * form-field to update. Implemented as part of `MatFormFieldControl`.
         * @docs-private
         */
        this.stateChanges = new Subject();
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
        this._errorStateTracker = new _ErrorStateTracker(defaultErrorStateMatcher, ngControl, parentFormGroup, parentForm, this.stateChanges);
    }
    ngAfterContentInit() {
        this.chipBlurChanges.pipe(takeUntil(this._destroyed)).subscribe(() => {
            this._blur();
            this.stateChanges.next();
        });
        merge(this.chipFocusChanges, this._chips.changes)
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => this.stateChanges.next());
    }
    ngAfterViewInit() {
        super.ngAfterViewInit();
        if (!this._chipInput && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('mat-chip-grid must be used in combination with matChipInputFor.');
        }
    }
    ngDoCheck() {
        if (this.ngControl) {
            // We need to re-evaluate this on every change detection cycle, because there are some
            // error triggers that we can't subscribe to (e.g. parent form submissions). This means
            // that whatever logic is in here has to be super lean or we risk destroying the performance.
            this.updateErrorState();
        }
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this.stateChanges.complete();
    }
    /** Associates an HTML input element with this chip grid. */
    registerInput(inputElement) {
        this._chipInput = inputElement;
        this._chipInput.setDescribedByIds(this._ariaDescribedbyIds);
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    onContainerClick(event) {
        if (!this.disabled && !this._originatesFromChip(event)) {
            this.focus();
        }
    }
    /**
     * Focuses the first chip in this chip grid, or the associated input when there
     * are no eligible chips.
     */
    focus() {
        if (this.disabled || this._chipInput.focused) {
            return;
        }
        if (!this._chips.length || this._chips.first.disabled) {
            // Delay until the next tick, because this can cause a "changed after checked"
            // error if the input does something on focus (e.g. opens an autocomplete).
            Promise.resolve().then(() => this._chipInput.focus());
        }
        else if (this._chips.length) {
            this._keyManager.setFirstItemActive();
        }
        this.stateChanges.next();
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    setDescribedByIds(ids) {
        // We must keep this up to date to handle the case where ids are set
        // before the chip input is registered.
        this._ariaDescribedbyIds = ids;
        this._chipInput?.setDescribedByIds(ids);
    }
    /**
     * Implemented as part of ControlValueAccessor.
     * @docs-private
     */
    writeValue(value) {
        // The user is responsible for creating the child chips, so we just store the value.
        this._value = value;
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
        this.stateChanges.next();
    }
    /** Refreshes the error state of the chip grid. */
    updateErrorState() {
        this._errorStateTracker.updateErrorState();
    }
    /** When blurred, mark the field as touched when focus moved outside the chip grid. */
    _blur() {
        if (!this.disabled) {
            // Check whether the focus moved to chip input.
            // If the focus is not moved to chip input, mark the field as touched. If the focus moved
            // to chip input, do nothing.
            // Timeout is needed to wait for the focus() event trigger on chip input.
            setTimeout(() => {
                if (!this.focused) {
                    this._propagateChanges();
                    this._markAsTouched();
                }
            });
        }
    }
    /**
     * Removes the `tabindex` from the chip grid and resets it back afterwards, allowing the
     * user to tab out of it. This prevents the grid from capturing focus and redirecting
     * it back to the first chip, creating a focus trap, if it user tries to tab away.
     */
    _allowFocusEscape() {
        if (!this._chipInput.focused) {
            super._allowFocusEscape();
        }
    }
    /** Handles custom keyboard events. */
    _handleKeydown(event) {
        if (event.keyCode === TAB) {
            if (this._chipInput.focused &&
                hasModifierKey(event, 'shiftKey') &&
                this._chips.length &&
                !this._chips.last.disabled) {
                event.preventDefault();
                if (this._keyManager.activeItem) {
                    this._keyManager.setActiveItem(this._keyManager.activeItem);
                }
                else {
                    this._focusLastChip();
                }
            }
            else {
                // Use the super method here since it doesn't check for the input
                // focused state. This allows focus to escape if there's only one
                // disabled chip left in the list.
                super._allowFocusEscape();
            }
        }
        else if (!this._chipInput.focused) {
            super._handleKeydown(event);
        }
        this.stateChanges.next();
    }
    _focusLastChip() {
        if (this._chips.length) {
            this._chips.last.focus();
        }
    }
    /** Emits change event to set the model value. */
    _propagateChanges() {
        const valueToEmit = this._chips.length ? this._chips.toArray().map(chip => chip.value) : [];
        this._value = valueToEmit;
        this.change.emit(new MatChipGridChange(this, valueToEmit));
        this.valueChange.emit(valueToEmit);
        this._onChange(valueToEmit);
        this._changeDetectorRef.markForCheck();
    }
    /** Mark the field as touched */
    _markAsTouched() {
        this._onTouched();
        this._changeDetectorRef.markForCheck();
        this.stateChanges.next();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatChipGrid, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.Directionality, optional: true }, { token: i2.NgForm, optional: true }, { token: i2.FormGroupDirective, optional: true }, { token: i3.ErrorStateMatcher }, { token: i2.NgControl, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "17.0.0", type: MatChipGrid, isStandalone: true, selector: "mat-chip-grid", inputs: { disabled: ["disabled", "disabled", booleanAttribute], placeholder: "placeholder", required: ["required", "required", booleanAttribute], value: "value", errorStateMatcher: "errorStateMatcher" }, outputs: { change: "change", valueChange: "valueChange" }, host: { listeners: { "focus": "focus()", "blur": "_blur()" }, properties: { "attr.role": "role", "attr.tabindex": "(disabled || (_chips && _chips.length === 0)) ? -1 : tabIndex", "attr.aria-disabled": "disabled.toString()", "attr.aria-invalid": "errorState", "class.mat-mdc-chip-list-disabled": "disabled", "class.mat-mdc-chip-list-invalid": "errorState", "class.mat-mdc-chip-list-required": "required" }, classAttribute: "mat-mdc-chip-set mat-mdc-chip-grid mdc-evolution-chip-set" }, providers: [{ provide: MatFormFieldControl, useExisting: MatChipGrid }], queries: [{ propertyName: "_chips", predicate: MatChipRow, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `, isInline: true, styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatChipGrid, decorators: [{
            type: Component,
            args: [{ selector: 'mat-chip-grid', template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `, host: {
                        'class': 'mat-mdc-chip-set mat-mdc-chip-grid mdc-evolution-chip-set',
                        '[attr.role]': 'role',
                        '[attr.tabindex]': '(disabled || (_chips && _chips.length === 0)) ? -1 : tabIndex',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[attr.aria-invalid]': 'errorState',
                        '[class.mat-mdc-chip-list-disabled]': 'disabled',
                        '[class.mat-mdc-chip-list-invalid]': 'errorState',
                        '[class.mat-mdc-chip-list-required]': 'required',
                        '(focus)': 'focus()',
                        '(blur)': '_blur()',
                    }, providers: [{ provide: MatFormFieldControl, useExisting: MatChipGrid }], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i2.NgForm, decorators: [{
                    type: Optional
                }] }, { type: i2.FormGroupDirective, decorators: [{
                    type: Optional
                }] }, { type: i3.ErrorStateMatcher }, { type: i2.NgControl, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }], propDecorators: { disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], placeholder: [{
                type: Input
            }], required: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], value: [{
                type: Input
            }], errorStateMatcher: [{
                type: Input
            }], change: [{
                type: Output
            }], valueChange: [{
                type: Output
            }], _chips: [{
                type: ContentChildren,
                args: [MatChipRow, {
                        // We need to use `descendants: true`, because Ivy will no longer match
                        // indirect descendants if it's left as false.
                        descendants: true,
                    }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1ncmlkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoaXBzL2NoaXAtZ3JpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsY0FBYyxFQUFFLEdBQUcsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFHTCxnQkFBZ0IsRUFDaEIsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUVmLFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUVMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULElBQUksRUFDSixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUVMLGtCQUFrQixFQUNsQixTQUFTLEVBQ1QsTUFBTSxFQUNOLFVBQVUsR0FDWCxNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzdFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBRWpFLE9BQU8sRUFBYSxPQUFPLEVBQUUsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3RDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDOzs7OztBQUVqRCxnRkFBZ0Y7QUFDaEYsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QjtJQUNFLHdDQUF3QztJQUNqQyxNQUFtQjtJQUMxQix5REFBeUQ7SUFDbEQsS0FBVTtRQUZWLFdBQU0sR0FBTixNQUFNLENBQWE7UUFFbkIs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QUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNLGNBQ25DLElBQUk7OzBCQWlMYixRQUFROzswQkFDUixRQUFROzswQkFDUixRQUFROzswQkFFUixRQUFROzswQkFBSSxJQUFJO3lDQXZJTixRQUFRO3NCQURwQixLQUFLO3VCQUFDLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFDO2dCQWdDaEMsV0FBVztzQkFEZCxLQUFLO2dCQW9CRixRQUFRO3NCQURYLEtBQUs7dUJBQUMsRUFBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUM7Z0JBdUJoQyxLQUFLO3NCQURSLEtBQUs7Z0JBV0YsaUJBQWlCO3NCQURwQixLQUFLO2dCQWNhLE1BQU07c0JBQXhCLE1BQU07Z0JBUVksV0FBVztzQkFBN0IsTUFBTTtnQkFRRSxNQUFNO3NCQU5kLGVBQWU7dUJBQUMsVUFBVSxFQUFFO3dCQUMzQix1RUFBdUU7d0JBQ3ZFLDhDQUE4Qzt3QkFDOUMsV0FBVyxFQUFFLElBQUk7cUJBQ2xCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7aGFzTW9kaWZpZXJLZXksIFRBQn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBTZWxmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgRm9ybUdyb3VwRGlyZWN0aXZlLFxuICBOZ0NvbnRyb2wsXG4gIE5nRm9ybSxcbiAgVmFsaWRhdG9ycyxcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtFcnJvclN0YXRlTWF0Y2hlciwgX0Vycm9yU3RhdGVUcmFja2VyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge01hdENoaXBUZXh0Q29udHJvbH0gZnJvbSAnLi9jaGlwLXRleHQtY29udHJvbCc7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YmplY3QsIG1lcmdlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdENoaXBFdmVudH0gZnJvbSAnLi9jaGlwJztcbmltcG9ydCB7TWF0Q2hpcFJvd30gZnJvbSAnLi9jaGlwLXJvdyc7XG5pbXBvcnQge01hdENoaXBTZXR9IGZyb20gJy4vY2hpcC1zZXQnO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuXG4vKiogQ2hhbmdlIGV2ZW50IG9iamVjdCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgY2hpcCBncmlkIHZhbHVlIGhhcyBjaGFuZ2VkLiAqL1xuZXhwb3J0IGNsYXNzIE1hdENoaXBHcmlkQ2hhbmdlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIENoaXAgZ3JpZCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdENoaXBHcmlkLFxuICAgIC8qKiBWYWx1ZSBvZiB0aGUgY2hpcCBncmlkIHdoZW4gdGhlIGV2ZW50IHdhcyBlbWl0dGVkLiAqL1xuICAgIHB1YmxpYyB2YWx1ZTogYW55LFxuICApIHt9XG59XG5cbi8qKlxuICogQW4gZXh0ZW5zaW9uIG9mIHRoZSBNYXRDaGlwU2V0IGNvbXBvbmVudCB1c2VkIHdpdGggTWF0Q2hpcFJvdyBjaGlwcyBhbmRcbiAqIHRoZSBtYXRDaGlwSW5wdXRGb3IgZGlyZWN0aXZlLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hpcC1ncmlkJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwibWRjLWV2b2x1dGlvbi1jaGlwLXNldF9fY2hpcHNcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlVXJsczogWydjaGlwLXNldC5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbWRjLWNoaXAtc2V0IG1hdC1tZGMtY2hpcC1ncmlkIG1kYy1ldm9sdXRpb24tY2hpcC1zZXQnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdyb2xlJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJyhkaXNhYmxlZCB8fCAoX2NoaXBzICYmIF9jaGlwcy5sZW5ndGggPT09IDApKSA/IC0xIDogdGFiSW5kZXgnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1pbnZhbGlkXSc6ICdlcnJvclN0YXRlJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtY2hpcC1saXN0LWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLWNoaXAtbGlzdC1pbnZhbGlkXSc6ICdlcnJvclN0YXRlJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtY2hpcC1saXN0LXJlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gICAgJyhmb2N1cyknOiAnZm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfYmx1cigpJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1hdEZvcm1GaWVsZENvbnRyb2wsIHVzZUV4aXN0aW5nOiBNYXRDaGlwR3JpZH1dLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcEdyaWRcbiAgZXh0ZW5kcyBNYXRDaGlwU2V0XG4gIGltcGxlbWVudHNcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIEFmdGVyVmlld0luaXQsXG4gICAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgRG9DaGVjayxcbiAgICBNYXRGb3JtRmllbGRDb250cm9sPGFueT4sXG4gICAgT25EZXN0cm95XG57XG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlYWRvbmx5IGNvbnRyb2xUeXBlOiBzdHJpbmcgPSAnbWF0LWNoaXAtZ3JpZCc7XG5cbiAgLyoqIFRoZSBjaGlwIGlucHV0IHRvIGFkZCBtb3JlIGNoaXBzICovXG4gIHByb3RlY3RlZCBfY2hpcElucHV0OiBNYXRDaGlwVGV4dENvbnRyb2w7XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9kZWZhdWx0Um9sZSA9ICdncmlkJztcbiAgcHJpdmF0ZSBfZXJyb3JTdGF0ZVRyYWNrZXI6IF9FcnJvclN0YXRlVHJhY2tlcjtcblxuICAvKipcbiAgICogTGlzdCBvZiBlbGVtZW50IGlkcyB0byBwcm9wYWdhdGUgdG8gdGhlIGNoaXBJbnB1dCdzIGFyaWEtZGVzY3JpYmVkYnkgYXR0cmlidXRlLlxuICAgKi9cbiAgcHJpdmF0ZSBfYXJpYURlc2NyaWJlZGJ5SWRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB3aGVuIHRvdWNoZWQuIFNldCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGltcGxlbWVudGF0aW9uLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBfb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHdoZW4gY2hhbmdlZC4gU2V0IGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW1wbGVtZW50YXRpb24uXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIF9vbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIG92ZXJyaWRlIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uZ0NvbnRyb2wgPyAhIXRoaXMubmdDb250cm9sLmRpc2FibGVkIDogdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgb3ZlcnJpZGUgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICB0aGlzLl9zeW5jQ2hpcHNTdGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2NoaXBJbnB1dC5pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG92ZXJyaWRlIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgKCF0aGlzLl9jaGlwSW5wdXQgfHwgdGhpcy5fY2hpcElucHV0LmVtcHR5KSAmJiAoIXRoaXMuX2NoaXBzIHx8IHRoaXMuX2NoaXBzLmxlbmd0aCA9PT0gMClcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHBsYWNlaG9sZGVyKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2NoaXBJbnB1dCA/IHRoaXMuX2NoaXBJbnB1dC5wbGFjZWhvbGRlciA6IHRoaXMuX3BsYWNlaG9sZGVyO1xuICB9XG4gIHNldCBwbGFjZWhvbGRlcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB2YWx1ZTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJvdGVjdGVkIF9wbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIGFueSBjaGlwcyBvciB0aGUgbWF0Q2hpcElucHV0IGluc2lkZSBvZiB0aGlzIGNoaXAtZ3JpZCBoYXMgZm9jdXMuICovXG4gIG92ZXJyaWRlIGdldCBmb2N1c2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9jaGlwSW5wdXQuZm9jdXNlZCB8fCB0aGlzLl9oYXNGb2N1c2VkQ2hpcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVkID8/IHRoaXMubmdDb250cm9sPy5jb250cm9sPy5oYXNWYWxpZGF0b3IoVmFsaWRhdG9ycy5yZXF1aXJlZCkgPz8gZmFsc2U7XG4gIH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSB2YWx1ZTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJvdGVjdGVkIF9yZXF1aXJlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgc2hvdWxkTGFiZWxGbG9hdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuZW1wdHkgfHwgdGhpcy5mb2N1c2VkO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgfVxuICBwcm90ZWN0ZWQgX3ZhbHVlOiBhbnlbXSA9IFtdO1xuXG4gIC8qKiBBbiBvYmplY3QgdXNlZCB0byBjb250cm9sIHdoZW4gZXJyb3IgbWVzc2FnZXMgYXJlIHNob3duLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZXJyb3JTdGF0ZU1hdGNoZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Vycm9yU3RhdGVUcmFja2VyLm1hdGNoZXI7XG4gIH1cbiAgc2V0IGVycm9yU3RhdGVNYXRjaGVyKHZhbHVlOiBFcnJvclN0YXRlTWF0Y2hlcikge1xuICAgIHRoaXMuX2Vycm9yU3RhdGVUcmFja2VyLm1hdGNoZXIgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBDb21iaW5lZCBzdHJlYW0gb2YgYWxsIG9mIHRoZSBjaGlsZCBjaGlwcycgYmx1ciBldmVudHMuICovXG4gIGdldCBjaGlwQmx1ckNoYW5nZXMoKTogT2JzZXJ2YWJsZTxNYXRDaGlwRXZlbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0Q2hpcFN0cmVhbShjaGlwID0+IGNoaXAuX29uQmx1cik7XG4gIH1cblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY2hpcCBncmlkIHZhbHVlIGhhcyBiZWVuIGNoYW5nZWQgYnkgdGhlIHVzZXIuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRDaGlwR3JpZENoYW5nZT4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcEdyaWRDaGFuZ2U+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW5ldmVyIHRoZSByYXcgdmFsdWUgb2YgdGhlIGNoaXAtZ3JpZCBjaGFuZ2VzLiBUaGlzIGlzIGhlcmUgcHJpbWFyaWx5XG4gICAqIHRvIGZhY2lsaXRhdGUgdGhlIHR3by13YXkgYmluZGluZyBmb3IgdGhlIGB2YWx1ZWAgaW5wdXQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2YWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAQ29udGVudENoaWxkcmVuKE1hdENoaXBSb3csIHtcbiAgICAvLyBXZSBuZWVkIHRvIHVzZSBgZGVzY2VuZGFudHM6IHRydWVgLCBiZWNhdXNlIEl2eSB3aWxsIG5vIGxvbmdlciBtYXRjaFxuICAgIC8vIGluZGlyZWN0IGRlc2NlbmRhbnRzIGlmIGl0J3MgbGVmdCBhcyBmYWxzZS5cbiAgICBkZXNjZW5kYW50czogdHJ1ZSxcbiAgfSlcbiAgLy8gV2UgbmVlZCBhbiBpbml0aWFsaXplciBoZXJlIHRvIGF2b2lkIGEgVFMgZXJyb3IuIFRoZSB2YWx1ZSB3aWxsIGJlIHNldCBpbiBgbmdBZnRlclZpZXdJbml0YC5cbiAgb3ZlcnJpZGUgX2NoaXBzOiBRdWVyeUxpc3Q8TWF0Q2hpcFJvdz4gPSB1bmRlZmluZWQhO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuZXZlciB0aGUgY29tcG9uZW50IHN0YXRlIGNoYW5nZXMgYW5kIHNob3VsZCBjYXVzZSB0aGUgcGFyZW50XG4gICAqIGZvcm0tZmllbGQgdG8gdXBkYXRlLiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBncmlkIGlzIGluIGFuIGVycm9yIHN0YXRlLiAqL1xuICBnZXQgZXJyb3JTdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZXJyb3JTdGF0ZVRyYWNrZXIuZXJyb3JTdGF0ZTtcbiAgfVxuICBzZXQgZXJyb3JTdGF0ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Vycm9yU3RhdGVUcmFja2VyLmVycm9yU3RhdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKCkgcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgIGRlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBwdWJsaWMgbmdDb250cm9sOiBOZ0NvbnRyb2wsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGNoYW5nZURldGVjdG9yUmVmLCBkaXIpO1xuXG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICB0aGlzLm5nQ29udHJvbC52YWx1ZUFjY2Vzc29yID0gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLl9lcnJvclN0YXRlVHJhY2tlciA9IG5ldyBfRXJyb3JTdGF0ZVRyYWNrZXIoXG4gICAgICBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgICBuZ0NvbnRyb2wsXG4gICAgICBwYXJlbnRGb3JtR3JvdXAsXG4gICAgICBwYXJlbnRGb3JtLFxuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMsXG4gICAgKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLmNoaXBCbHVyQ2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fYmx1cigpO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH0pO1xuXG4gICAgbWVyZ2UodGhpcy5jaGlwRm9jdXNDaGFuZ2VzLCB0aGlzLl9jaGlwcy5jaGFuZ2VzKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKSk7XG4gIH1cblxuICBvdmVycmlkZSBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XG5cbiAgICBpZiAoIXRoaXMuX2NoaXBJbnB1dCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ21hdC1jaGlwLWdyaWQgbXVzdCBiZSB1c2VkIGluIGNvbWJpbmF0aW9uIHdpdGggbWF0Q2hpcElucHV0Rm9yLicpO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gcmUtZXZhbHVhdGUgdGhpcyBvbiBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLCBiZWNhdXNlIHRoZXJlIGFyZSBzb21lXG4gICAgICAvLyBlcnJvciB0cmlnZ2VycyB0aGF0IHdlIGNhbid0IHN1YnNjcmliZSB0byAoZS5nLiBwYXJlbnQgZm9ybSBzdWJtaXNzaW9ucykuIFRoaXMgbWVhbnNcbiAgICAgIC8vIHRoYXQgd2hhdGV2ZXIgbG9naWMgaXMgaW4gaGVyZSBoYXMgdG8gYmUgc3VwZXIgbGVhbiBvciB3ZSByaXNrIGRlc3Ryb3lpbmcgdGhlIHBlcmZvcm1hbmNlLlxuICAgICAgdGhpcy51cGRhdGVFcnJvclN0YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIEFzc29jaWF0ZXMgYW4gSFRNTCBpbnB1dCBlbGVtZW50IHdpdGggdGhpcyBjaGlwIGdyaWQuICovXG4gIHJlZ2lzdGVySW5wdXQoaW5wdXRFbGVtZW50OiBNYXRDaGlwVGV4dENvbnRyb2wpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGlwSW5wdXQgPSBpbnB1dEVsZW1lbnQ7XG4gICAgdGhpcy5fY2hpcElucHV0LnNldERlc2NyaWJlZEJ5SWRzKHRoaXMuX2FyaWFEZXNjcmliZWRieUlkcyk7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBvbkNvbnRhaW5lckNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkICYmICF0aGlzLl9vcmlnaW5hdGVzRnJvbUNoaXAoZXZlbnQpKSB7XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIGZpcnN0IGNoaXAgaW4gdGhpcyBjaGlwIGdyaWQsIG9yIHRoZSBhc3NvY2lhdGVkIGlucHV0IHdoZW4gdGhlcmVcbiAgICogYXJlIG5vIGVsaWdpYmxlIGNoaXBzLlxuICAgKi9cbiAgb3ZlcnJpZGUgZm9jdXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5fY2hpcElucHV0LmZvY3VzZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2NoaXBzLmxlbmd0aCB8fCB0aGlzLl9jaGlwcy5maXJzdC5kaXNhYmxlZCkge1xuICAgICAgLy8gRGVsYXkgdW50aWwgdGhlIG5leHQgdGljaywgYmVjYXVzZSB0aGlzIGNhbiBjYXVzZSBhIFwiY2hhbmdlZCBhZnRlciBjaGVja2VkXCJcbiAgICAgIC8vIGVycm9yIGlmIHRoZSBpbnB1dCBkb2VzIHNvbWV0aGluZyBvbiBmb2N1cyAoZS5nLiBvcGVucyBhbiBhdXRvY29tcGxldGUpLlxuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB0aGlzLl9jaGlwSW5wdXQuZm9jdXMoKSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9jaGlwcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0RGVzY3JpYmVkQnlJZHMoaWRzOiBzdHJpbmdbXSkge1xuICAgIC8vIFdlIG11c3Qga2VlcCB0aGlzIHVwIHRvIGRhdGUgdG8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIGlkcyBhcmUgc2V0XG4gICAgLy8gYmVmb3JlIHRoZSBjaGlwIGlucHV0IGlzIHJlZ2lzdGVyZWQuXG4gICAgdGhpcy5fYXJpYURlc2NyaWJlZGJ5SWRzID0gaWRzO1xuICAgIHRoaXMuX2NoaXBJbnB1dD8uc2V0RGVzY3JpYmVkQnlJZHMoaWRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAvLyBUaGUgdXNlciBpcyByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGNoaWxkIGNoaXBzLCBzbyB3ZSBqdXN0IHN0b3JlIHRoZSB2YWx1ZS5cbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBSZWZyZXNoZXMgdGhlIGVycm9yIHN0YXRlIG9mIHRoZSBjaGlwIGdyaWQuICovXG4gIHVwZGF0ZUVycm9yU3RhdGUoKSB7XG4gICAgdGhpcy5fZXJyb3JTdGF0ZVRyYWNrZXIudXBkYXRlRXJyb3JTdGF0ZSgpO1xuICB9XG5cbiAgLyoqIFdoZW4gYmx1cnJlZCwgbWFyayB0aGUgZmllbGQgYXMgdG91Y2hlZCB3aGVuIGZvY3VzIG1vdmVkIG91dHNpZGUgdGhlIGNoaXAgZ3JpZC4gKi9cbiAgX2JsdXIoKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBmb2N1cyBtb3ZlZCB0byBjaGlwIGlucHV0LlxuICAgICAgLy8gSWYgdGhlIGZvY3VzIGlzIG5vdCBtb3ZlZCB0byBjaGlwIGlucHV0LCBtYXJrIHRoZSBmaWVsZCBhcyB0b3VjaGVkLiBJZiB0aGUgZm9jdXMgbW92ZWRcbiAgICAgIC8vIHRvIGNoaXAgaW5wdXQsIGRvIG5vdGhpbmcuXG4gICAgICAvLyBUaW1lb3V0IGlzIG5lZWRlZCB0byB3YWl0IGZvciB0aGUgZm9jdXMoKSBldmVudCB0cmlnZ2VyIG9uIGNoaXAgaW5wdXQuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZvY3VzZWQpIHtcbiAgICAgICAgICB0aGlzLl9wcm9wYWdhdGVDaGFuZ2VzKCk7XG4gICAgICAgICAgdGhpcy5fbWFya0FzVG91Y2hlZCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgYHRhYmluZGV4YCBmcm9tIHRoZSBjaGlwIGdyaWQgYW5kIHJlc2V0cyBpdCBiYWNrIGFmdGVyd2FyZHMsIGFsbG93aW5nIHRoZVxuICAgKiB1c2VyIHRvIHRhYiBvdXQgb2YgaXQuIFRoaXMgcHJldmVudHMgdGhlIGdyaWQgZnJvbSBjYXB0dXJpbmcgZm9jdXMgYW5kIHJlZGlyZWN0aW5nXG4gICAqIGl0IGJhY2sgdG8gdGhlIGZpcnN0IGNoaXAsIGNyZWF0aW5nIGEgZm9jdXMgdHJhcCwgaWYgaXQgdXNlciB0cmllcyB0byB0YWIgYXdheS5cbiAgICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfYWxsb3dGb2N1c0VzY2FwZSgpIHtcbiAgICBpZiAoIXRoaXMuX2NoaXBJbnB1dC5mb2N1c2VkKSB7XG4gICAgICBzdXBlci5fYWxsb3dGb2N1c0VzY2FwZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGN1c3RvbSBrZXlib2FyZCBldmVudHMuICovXG4gIG92ZXJyaWRlIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IFRBQikge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLl9jaGlwSW5wdXQuZm9jdXNlZCAmJlxuICAgICAgICBoYXNNb2RpZmllcktleShldmVudCwgJ3NoaWZ0S2V5JykgJiZcbiAgICAgICAgdGhpcy5fY2hpcHMubGVuZ3RoICYmXG4gICAgICAgICF0aGlzLl9jaGlwcy5sYXN0LmRpc2FibGVkXG4gICAgICApIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAodGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtKSB7XG4gICAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZm9jdXNMYXN0Q2hpcCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBVc2UgdGhlIHN1cGVyIG1ldGhvZCBoZXJlIHNpbmNlIGl0IGRvZXNuJ3QgY2hlY2sgZm9yIHRoZSBpbnB1dFxuICAgICAgICAvLyBmb2N1c2VkIHN0YXRlLiBUaGlzIGFsbG93cyBmb2N1cyB0byBlc2NhcGUgaWYgdGhlcmUncyBvbmx5IG9uZVxuICAgICAgICAvLyBkaXNhYmxlZCBjaGlwIGxlZnQgaW4gdGhlIGxpc3QuXG4gICAgICAgIHN1cGVyLl9hbGxvd0ZvY3VzRXNjYXBlKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghdGhpcy5fY2hpcElucHV0LmZvY3VzZWQpIHtcbiAgICAgIHN1cGVyLl9oYW5kbGVLZXlkb3duKGV2ZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICBfZm9jdXNMYXN0Q2hpcCgpIHtcbiAgICBpZiAodGhpcy5fY2hpcHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9jaGlwcy5sYXN0LmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVtaXRzIGNoYW5nZSBldmVudCB0byBzZXQgdGhlIG1vZGVsIHZhbHVlLiAqL1xuICBwcml2YXRlIF9wcm9wYWdhdGVDaGFuZ2VzKCk6IHZvaWQge1xuICAgIGNvbnN0IHZhbHVlVG9FbWl0ID0gdGhpcy5fY2hpcHMubGVuZ3RoID8gdGhpcy5fY2hpcHMudG9BcnJheSgpLm1hcChjaGlwID0+IGNoaXAudmFsdWUpIDogW107XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZVRvRW1pdDtcbiAgICB0aGlzLmNoYW5nZS5lbWl0KG5ldyBNYXRDaGlwR3JpZENoYW5nZSh0aGlzLCB2YWx1ZVRvRW1pdCkpO1xuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh2YWx1ZVRvRW1pdCk7XG4gICAgdGhpcy5fb25DaGFuZ2UodmFsdWVUb0VtaXQpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIE1hcmsgdGhlIGZpZWxkIGFzIHRvdWNoZWQgKi9cbiAgcHJpdmF0ZSBfbWFya0FzVG91Y2hlZCgpIHtcbiAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbn1cbiJdfQ==