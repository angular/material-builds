/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BACKSPACE, hasModifierKey, TAB } from '@angular/cdk/keycodes';
import { Directive, ElementRef, EventEmitter, Inject, Input, Output, } from '@angular/core';
import { MAT_LEGACY_CHIPS_DEFAULT_OPTIONS, } from './chip-default-options';
import { MatLegacyChipList } from './chip-list';
import * as i0 from "@angular/core";
// Increasing integer for generating unique ids.
let nextUniqueId = 0;
/**
 * Directive that adds chip-specific behaviors to an input element inside `<mat-form-field>`.
 * May be placed inside or outside of an `<mat-chip-list>`.
 * @deprecated Use `MatChipInput` from `@angular/material/chips` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyChipInput {
    /** Register input for chip list */
    set chipList(value) {
        if (value) {
            this._chipList = value;
            this._chipList.registerInput(this);
        }
    }
    /**
     * Whether or not the chipEnd event will be emitted when the input is blurred.
     */
    get addOnBlur() {
        return this._addOnBlur;
    }
    set addOnBlur(value) {
        this._addOnBlur = coerceBooleanProperty(value);
    }
    /** Whether the input is disabled. */
    get disabled() {
        return this._disabled || (this._chipList && this._chipList.disabled);
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    /** Whether the input is empty. */
    get empty() {
        return !this.inputElement.value;
    }
    constructor(_elementRef, defaultOptions) {
        this._elementRef = _elementRef;
        /** Whether the control is focused. */
        this.focused = false;
        this._addOnBlur = false;
        /** Emitted when a chip is to be added. */
        this.chipEnd = new EventEmitter();
        /** The input's placeholder text. */
        this.placeholder = '';
        /** Unique id for the input. */
        this.id = `mat-chip-list-input-${nextUniqueId++}`;
        this._disabled = false;
        this.inputElement = this._elementRef.nativeElement;
        this.separatorKeyCodes = defaultOptions.separatorKeyCodes;
    }
    ngOnChanges() {
        this._chipList.stateChanges.next();
    }
    ngOnDestroy() {
        this.chipEnd.complete();
    }
    ngAfterContentInit() {
        this._focusLastChipOnBackspace = this.empty;
    }
    /** Utility method to make host definition/tests more clear. */
    _keydown(event) {
        if (event) {
            // Allow the user's focus to escape when they're tabbing forward. Note that we don't
            // want to do this when going backwards, because focus should go back to the first chip.
            if (event.keyCode === TAB && !hasModifierKey(event, 'shiftKey')) {
                this._chipList._allowFocusEscape();
            }
            // To prevent the user from accidentally deleting chips when pressing BACKSPACE continuously,
            // We focus the last chip on backspace only after the user has released the backspace button,
            // and the input is empty (see behaviour in _keyup)
            if (event.keyCode === BACKSPACE && this._focusLastChipOnBackspace) {
                this._chipList._keyManager.setLastItemActive();
                event.preventDefault();
                return;
            }
            else {
                this._focusLastChipOnBackspace = false;
            }
        }
        this._emitChipEnd(event);
    }
    /**
     * Pass events to the keyboard manager. Available here for tests.
     */
    _keyup(event) {
        // Allow user to move focus to chips next time he presses backspace
        if (!this._focusLastChipOnBackspace && event.keyCode === BACKSPACE && this.empty) {
            this._focusLastChipOnBackspace = true;
            event.preventDefault();
        }
    }
    /** Checks to see if the blur should emit the (chipEnd) event. */
    _blur() {
        if (this.addOnBlur) {
            this._emitChipEnd();
        }
        this.focused = false;
        // Blur the chip list if it is not focused
        if (!this._chipList.focused) {
            this._chipList._blur();
        }
        this._chipList.stateChanges.next();
    }
    _focus() {
        this.focused = true;
        this._focusLastChipOnBackspace = this.empty;
        this._chipList.stateChanges.next();
    }
    /** Checks to see if the (chipEnd) event needs to be emitted. */
    _emitChipEnd(event) {
        if (!this.inputElement.value && !!event) {
            this._chipList._keydown(event);
        }
        if (!event || this._isSeparatorKey(event)) {
            this.chipEnd.emit({
                input: this.inputElement,
                value: this.inputElement.value,
                chipInput: this,
            });
            event?.preventDefault();
        }
    }
    _onInput() {
        // Let chip list know whenever the value changes.
        this._chipList.stateChanges.next();
    }
    /** Focuses the input. */
    focus(options) {
        this.inputElement.focus(options);
    }
    /** Clears the input */
    clear() {
        this.inputElement.value = '';
        this._focusLastChipOnBackspace = true;
    }
    /** Checks whether a keycode is one of the configured separators. */
    _isSeparatorKey(event) {
        return !hasModifierKey(event) && new Set(this.separatorKeyCodes).has(event.keyCode);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyChipInput, deps: [{ token: i0.ElementRef }, { token: MAT_LEGACY_CHIPS_DEFAULT_OPTIONS }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyChipInput, selector: "input[matChipInputFor]", inputs: { chipList: ["matChipInputFor", "chipList"], addOnBlur: ["matChipInputAddOnBlur", "addOnBlur"], separatorKeyCodes: ["matChipInputSeparatorKeyCodes", "separatorKeyCodes"], placeholder: "placeholder", id: "id", disabled: "disabled" }, outputs: { chipEnd: "matChipInputTokenEnd" }, host: { listeners: { "keydown": "_keydown($event)", "keyup": "_keyup($event)", "blur": "_blur()", "focus": "_focus()", "input": "_onInput()" }, properties: { "id": "id", "attr.disabled": "disabled || null", "attr.placeholder": "placeholder || null", "attr.aria-invalid": "_chipList && _chipList.ngControl ? _chipList.ngControl.invalid : null", "attr.aria-required": "_chipList && _chipList.required || null" }, classAttribute: "mat-chip-input mat-input-element" }, exportAs: ["matChipInput", "matChipInputFor"], usesOnChanges: true, ngImport: i0 }); }
}
export { MatLegacyChipInput };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyChipInput, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[matChipInputFor]',
                    exportAs: 'matChipInput, matChipInputFor',
                    host: {
                        'class': 'mat-chip-input mat-input-element',
                        '(keydown)': '_keydown($event)',
                        '(keyup)': '_keyup($event)',
                        '(blur)': '_blur()',
                        '(focus)': '_focus()',
                        '(input)': '_onInput()',
                        '[id]': 'id',
                        '[attr.disabled]': 'disabled || null',
                        '[attr.placeholder]': 'placeholder || null',
                        '[attr.aria-invalid]': '_chipList && _chipList.ngControl ? _chipList.ngControl.invalid : null',
                        '[attr.aria-required]': '_chipList && _chipList.required || null',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_LEGACY_CHIPS_DEFAULT_OPTIONS]
                }] }]; }, propDecorators: { chipList: [{
                type: Input,
                args: ['matChipInputFor']
            }], addOnBlur: [{
                type: Input,
                args: ['matChipInputAddOnBlur']
            }], separatorKeyCodes: [{
                type: Input,
                args: ['matChipInputSeparatorKeyCodes']
            }], chipEnd: [{
                type: Output,
                args: ['matChipInputTokenEnd']
            }], placeholder: [{
                type: Input
            }], id: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktY2hpcHMvY2hpcC1pbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsU0FBUyxFQUFFLGNBQWMsRUFBRSxHQUFHLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRSxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUVMLGdDQUFnQyxHQUNqQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQzs7QUF1QjlDLGdEQUFnRDtBQUNoRCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFFckI7Ozs7O0dBS0c7QUFDSCxNQWlCYSxrQkFBa0I7SUFVN0IsbUNBQW1DO0lBQ25DLElBQ0ksUUFBUSxDQUFDLEtBQXdCO1FBQ25DLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUNJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUNELElBQUksU0FBUyxDQUFDLEtBQW1CO1FBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQW9CRCxxQ0FBcUM7SUFDckMsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FB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cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0JBQ0tTUEFDRSwgaGFzTW9kaWZpZXJLZXksIFRBQn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE1hdExlZ2FjeUNoaXBzRGVmYXVsdE9wdGlvbnMsXG4gIE1BVF9MRUdBQ1lfQ0hJUFNfREVGQVVMVF9PUFRJT05TLFxufSBmcm9tICcuL2NoaXAtZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7TWF0TGVnYWN5Q2hpcExpc3R9IGZyb20gJy4vY2hpcC1saXN0JztcbmltcG9ydCB7TWF0TGVnYWN5Q2hpcFRleHRDb250cm9sfSBmcm9tICcuL2NoaXAtdGV4dC1jb250cm9sJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIGlucHV0IGV2ZW50IG9uIGEgYG1hdENoaXBJbnB1dGAuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdENoaXBJbnB1dEV2ZW50YCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9jaGlwc2AgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdExlZ2FjeUNoaXBJbnB1dEV2ZW50IHtcbiAgLyoqXG4gICAqIFRoZSBuYXRpdmUgYDxpbnB1dD5gIGVsZW1lbnQgdGhhdCB0aGUgZXZlbnQgaXMgYmVpbmcgZmlyZWQgZm9yLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYE1hdENoaXBJbnB1dEV2ZW50I2NoaXBJbnB1dC5pbnB1dEVsZW1lbnRgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTMuMC4wIFRoaXMgcHJvcGVydHkgd2lsbCBiZSByZW1vdmVkLlxuICAgKi9cbiAgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQuICovXG4gIHZhbHVlOiBzdHJpbmc7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY2hpcCBpbnB1dCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICBjaGlwSW5wdXQ6IE1hdExlZ2FjeUNoaXBJbnB1dDtcbn1cblxuLy8gSW5jcmVhc2luZyBpbnRlZ2VyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBpZHMuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuLyoqXG4gKiBEaXJlY3RpdmUgdGhhdCBhZGRzIGNoaXAtc3BlY2lmaWMgYmVoYXZpb3JzIHRvIGFuIGlucHV0IGVsZW1lbnQgaW5zaWRlIGA8bWF0LWZvcm0tZmllbGQ+YC5cbiAqIE1heSBiZSBwbGFjZWQgaW5zaWRlIG9yIG91dHNpZGUgb2YgYW4gYDxtYXQtY2hpcC1saXN0PmAuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdENoaXBJbnB1dGAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY2hpcHNgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbbWF0Q2hpcElucHV0Rm9yXScsXG4gIGV4cG9ydEFzOiAnbWF0Q2hpcElucHV0LCBtYXRDaGlwSW5wdXRGb3InLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jaGlwLWlucHV0IG1hdC1pbnB1dC1lbGVtZW50JyxcbiAgICAnKGtleWRvd24pJzogJ19rZXlkb3duKCRldmVudCknLFxuICAgICcoa2V5dXApJzogJ19rZXl1cCgkZXZlbnQpJyxcbiAgICAnKGJsdXIpJzogJ19ibHVyKCknLFxuICAgICcoZm9jdXMpJzogJ19mb2N1cygpJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgpJyxcbiAgICAnW2lkXSc6ICdpZCcsXG4gICAgJ1thdHRyLmRpc2FibGVkXSc6ICdkaXNhYmxlZCB8fCBudWxsJyxcbiAgICAnW2F0dHIucGxhY2Vob2xkZXJdJzogJ3BsYWNlaG9sZGVyIHx8IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWludmFsaWRdJzogJ19jaGlwTGlzdCAmJiBfY2hpcExpc3QubmdDb250cm9sID8gX2NoaXBMaXN0Lm5nQ29udHJvbC5pbnZhbGlkIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ19jaGlwTGlzdCAmJiBfY2hpcExpc3QucmVxdWlyZWQgfHwgbnVsbCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeUNoaXBJbnB1dFxuICBpbXBsZW1lbnRzIE1hdExlZ2FjeUNoaXBUZXh0Q29udHJvbCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyQ29udGVudEluaXRcbntcbiAgLyoqIFVzZWQgdG8gcHJldmVudCBmb2N1cyBtb3ZpbmcgdG8gY2hpcHMgd2hpbGUgdXNlciBpcyBob2xkaW5nIGJhY2tzcGFjZSAqL1xuICBwcml2YXRlIF9mb2N1c0xhc3RDaGlwT25CYWNrc3BhY2U6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgZm9jdXNlZC4gKi9cbiAgZm9jdXNlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBfY2hpcExpc3Q6IE1hdExlZ2FjeUNoaXBMaXN0O1xuXG4gIC8qKiBSZWdpc3RlciBpbnB1dCBmb3IgY2hpcCBsaXN0ICovXG4gIEBJbnB1dCgnbWF0Q2hpcElucHV0Rm9yJylcbiAgc2V0IGNoaXBMaXN0KHZhbHVlOiBNYXRMZWdhY3lDaGlwTGlzdCkge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5fY2hpcExpc3QgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX2NoaXBMaXN0LnJlZ2lzdGVySW5wdXQodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSBjaGlwRW5kIGV2ZW50IHdpbGwgYmUgZW1pdHRlZCB3aGVuIHRoZSBpbnB1dCBpcyBibHVycmVkLlxuICAgKi9cbiAgQElucHV0KCdtYXRDaGlwSW5wdXRBZGRPbkJsdXInKVxuICBnZXQgYWRkT25CbHVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hZGRPbkJsdXI7XG4gIH1cbiAgc2V0IGFkZE9uQmx1cih2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fYWRkT25CbHVyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBfYWRkT25CbHVyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIGtleSBjb2RlcyB0aGF0IHdpbGwgdHJpZ2dlciBhIGNoaXBFbmQgZXZlbnQuXG4gICAqXG4gICAqIERlZmF1bHRzIHRvIGBbRU5URVJdYC5cbiAgICovXG4gIEBJbnB1dCgnbWF0Q2hpcElucHV0U2VwYXJhdG9yS2V5Q29kZXMnKVxuICBzZXBhcmF0b3JLZXlDb2RlczogcmVhZG9ubHkgbnVtYmVyW10gfCBSZWFkb25seVNldDxudW1iZXI+O1xuXG4gIC8qKiBFbWl0dGVkIHdoZW4gYSBjaGlwIGlzIHRvIGJlIGFkZGVkLiAqL1xuICBAT3V0cHV0KCdtYXRDaGlwSW5wdXRUb2tlbkVuZCcpIHJlYWRvbmx5IGNoaXBFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPE1hdExlZ2FjeUNoaXBJbnB1dEV2ZW50PigpO1xuXG4gIC8qKiBUaGUgaW5wdXQncyBwbGFjZWhvbGRlciB0ZXh0LiAqL1xuICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nID0gJyc7XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhlIGlucHV0LiAqL1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gYG1hdC1jaGlwLWxpc3QtaW5wdXQtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZCB8fCAodGhpcy5fY2hpcExpc3QgJiYgdGhpcy5fY2hpcExpc3QuZGlzYWJsZWQpO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGVtcHR5LiAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmlucHV0RWxlbWVudC52YWx1ZTtcbiAgfVxuXG4gIC8qKiBUaGUgbmF0aXZlIGlucHV0IGVsZW1lbnQgdG8gd2hpY2ggdGhpcyBkaXJlY3RpdmUgaXMgYXR0YWNoZWQuICovXG4gIHJlYWRvbmx5IGlucHV0RWxlbWVudCE6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIEBJbmplY3QoTUFUX0xFR0FDWV9DSElQU19ERUZBVUxUX09QVElPTlMpIGRlZmF1bHRPcHRpb25zOiBNYXRMZWdhY3lDaGlwc0RlZmF1bHRPcHRpb25zLFxuICApIHtcbiAgICB0aGlzLmlucHV0RWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHRoaXMuc2VwYXJhdG9yS2V5Q29kZXMgPSBkZWZhdWx0T3B0aW9ucy5zZXBhcmF0b3JLZXlDb2RlcztcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMuX2NoaXBMaXN0LnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmNoaXBFbmQuY29tcGxldGUoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9mb2N1c0xhc3RDaGlwT25CYWNrc3BhY2UgPSB0aGlzLmVtcHR5O1xuICB9XG5cbiAgLyoqIFV0aWxpdHkgbWV0aG9kIHRvIG1ha2UgaG9zdCBkZWZpbml0aW9uL3Rlc3RzIG1vcmUgY2xlYXIuICovXG4gIF9rZXlkb3duKGV2ZW50PzogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChldmVudCkge1xuICAgICAgLy8gQWxsb3cgdGhlIHVzZXIncyBmb2N1cyB0byBlc2NhcGUgd2hlbiB0aGV5J3JlIHRhYmJpbmcgZm9yd2FyZC4gTm90ZSB0aGF0IHdlIGRvbid0XG4gICAgICAvLyB3YW50IHRvIGRvIHRoaXMgd2hlbiBnb2luZyBiYWNrd2FyZHMsIGJlY2F1c2UgZm9jdXMgc2hvdWxkIGdvIGJhY2sgdG8gdGhlIGZpcnN0IGNoaXAuXG4gICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gVEFCICYmICFoYXNNb2RpZmllcktleShldmVudCwgJ3NoaWZ0S2V5JykpIHtcbiAgICAgICAgdGhpcy5fY2hpcExpc3QuX2FsbG93Rm9jdXNFc2NhcGUoKTtcbiAgICAgIH1cblxuICAgICAgLy8gVG8gcHJldmVudCB0aGUgdXNlciBmcm9tIGFjY2lkZW50YWxseSBkZWxldGluZyBjaGlwcyB3aGVuIHByZXNzaW5nIEJBQ0tTUEFDRSBjb250aW51b3VzbHksXG4gICAgICAvLyBXZSBmb2N1cyB0aGUgbGFzdCBjaGlwIG9uIGJhY2tzcGFjZSBvbmx5IGFmdGVyIHRoZSB1c2VyIGhhcyByZWxlYXNlZCB0aGUgYmFja3NwYWNlIGJ1dHRvbixcbiAgICAgIC8vIGFuZCB0aGUgaW5wdXQgaXMgZW1wdHkgKHNlZSBiZWhhdmlvdXIgaW4gX2tleXVwKVxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEJBQ0tTUEFDRSAmJiB0aGlzLl9mb2N1c0xhc3RDaGlwT25CYWNrc3BhY2UpIHtcbiAgICAgICAgdGhpcy5fY2hpcExpc3QuX2tleU1hbmFnZXIuc2V0TGFzdEl0ZW1BY3RpdmUoKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZm9jdXNMYXN0Q2hpcE9uQmFja3NwYWNlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fZW1pdENoaXBFbmQoZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhc3MgZXZlbnRzIHRvIHRoZSBrZXlib2FyZCBtYW5hZ2VyLiBBdmFpbGFibGUgaGVyZSBmb3IgdGVzdHMuXG4gICAqL1xuICBfa2V5dXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyBBbGxvdyB1c2VyIHRvIG1vdmUgZm9jdXMgdG8gY2hpcHMgbmV4dCB0aW1lIGhlIHByZXNzZXMgYmFja3NwYWNlXG4gICAgaWYgKCF0aGlzLl9mb2N1c0xhc3RDaGlwT25CYWNrc3BhY2UgJiYgZXZlbnQua2V5Q29kZSA9PT0gQkFDS1NQQUNFICYmIHRoaXMuZW1wdHkpIHtcbiAgICAgIHRoaXMuX2ZvY3VzTGFzdENoaXBPbkJhY2tzcGFjZSA9IHRydWU7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDaGVja3MgdG8gc2VlIGlmIHRoZSBibHVyIHNob3VsZCBlbWl0IHRoZSAoY2hpcEVuZCkgZXZlbnQuICovXG4gIF9ibHVyKCkge1xuICAgIGlmICh0aGlzLmFkZE9uQmx1cikge1xuICAgICAgdGhpcy5fZW1pdENoaXBFbmQoKTtcbiAgICB9XG4gICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgLy8gQmx1ciB0aGUgY2hpcCBsaXN0IGlmIGl0IGlzIG5vdCBmb2N1c2VkXG4gICAgaWYgKCF0aGlzLl9jaGlwTGlzdC5mb2N1c2VkKSB7XG4gICAgICB0aGlzLl9jaGlwTGlzdC5fYmx1cigpO1xuICAgIH1cbiAgICB0aGlzLl9jaGlwTGlzdC5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgX2ZvY3VzKCkge1xuICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4gICAgdGhpcy5fZm9jdXNMYXN0Q2hpcE9uQmFja3NwYWNlID0gdGhpcy5lbXB0eTtcbiAgICB0aGlzLl9jaGlwTGlzdC5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB0byBzZWUgaWYgdGhlIChjaGlwRW5kKSBldmVudCBuZWVkcyB0byBiZSBlbWl0dGVkLiAqL1xuICBfZW1pdENoaXBFbmQoZXZlbnQ/OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmlucHV0RWxlbWVudC52YWx1ZSAmJiAhIWV2ZW50KSB7XG4gICAgICB0aGlzLl9jaGlwTGlzdC5fa2V5ZG93bihldmVudCk7XG4gICAgfVxuXG4gICAgaWYgKCFldmVudCB8fCB0aGlzLl9pc1NlcGFyYXRvcktleShldmVudCkpIHtcbiAgICAgIHRoaXMuY2hpcEVuZC5lbWl0KHtcbiAgICAgICAgaW5wdXQ6IHRoaXMuaW5wdXRFbGVtZW50LFxuICAgICAgICB2YWx1ZTogdGhpcy5pbnB1dEVsZW1lbnQudmFsdWUsXG4gICAgICAgIGNoaXBJbnB1dDogdGhpcyxcbiAgICAgIH0pO1xuXG4gICAgICBldmVudD8ucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBfb25JbnB1dCgpIHtcbiAgICAvLyBMZXQgY2hpcCBsaXN0IGtub3cgd2hlbmV2ZXIgdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAgdGhpcy5fY2hpcExpc3Quc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBpbnB1dC4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuaW5wdXRFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIENsZWFycyB0aGUgaW5wdXQgKi9cbiAgY2xlYXIoKTogdm9pZCB7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnQudmFsdWUgPSAnJztcbiAgICB0aGlzLl9mb2N1c0xhc3RDaGlwT25CYWNrc3BhY2UgPSB0cnVlO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIGEga2V5Y29kZSBpcyBvbmUgb2YgdGhlIGNvbmZpZ3VyZWQgc2VwYXJhdG9ycy4gKi9cbiAgcHJpdmF0ZSBfaXNTZXBhcmF0b3JLZXkoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICByZXR1cm4gIWhhc01vZGlmaWVyS2V5KGV2ZW50KSAmJiBuZXcgU2V0KHRoaXMuc2VwYXJhdG9yS2V5Q29kZXMpLmhhcyhldmVudC5rZXlDb2RlKTtcbiAgfVxufVxuIl19