/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, EventEmitter, Inject, Input, Output } from '@angular/core';
import { hasModifierKey, TAB } from '@angular/cdk/keycodes';
import { MAT_CHIPS_DEFAULT_OPTIONS } from './chip-default-options';
import { MatChipList } from './chip-list';
/**
 * Represents an input event on a `matChipInput`.
 * @record
 */
export function MatChipInputEvent() { }
if (false) {
    /**
     * The native `<input>` element that the event is being fired for.
     * @type {?}
     */
    MatChipInputEvent.prototype.input;
    /**
     * The value of the input.
     * @type {?}
     */
    MatChipInputEvent.prototype.value;
}
// Increasing integer for generating unique ids.
/** @type {?} */
let nextUniqueId = 0;
/**
 * Directive that adds chip-specific behaviors to an input element inside `<mat-form-field>`.
 * May be placed inside or outside of an `<mat-chip-list>`.
 */
export class MatChipInput {
    /**
     * @param {?} _elementRef
     * @param {?} _defaultOptions
     */
    constructor(_elementRef, _defaultOptions) {
        this._elementRef = _elementRef;
        this._defaultOptions = _defaultOptions;
        /**
         * Whether the control is focused.
         */
        this.focused = false;
        this._addOnBlur = false;
        /**
         * The list of key codes that will trigger a chipEnd event.
         *
         * Defaults to `[ENTER]`.
         */
        this.separatorKeyCodes = this._defaultOptions.separatorKeyCodes;
        /**
         * Emitted when a chip is to be added.
         */
        this.chipEnd = new EventEmitter();
        /**
         * The input's placeholder text.
         */
        this.placeholder = '';
        /**
         * Unique id for the input.
         */
        this.id = `mat-chip-list-input-${nextUniqueId++}`;
        this._disabled = false;
        this._inputElement = (/** @type {?} */ (this._elementRef.nativeElement));
    }
    /**
     * Register input for chip list
     * @param {?} value
     * @return {?}
     */
    set chipList(value) {
        if (value) {
            this._chipList = value;
            this._chipList.registerInput(this);
        }
    }
    /**
     * Whether or not the chipEnd event will be emitted when the input is blurred.
     * @return {?}
     */
    get addOnBlur() { return this._addOnBlur; }
    /**
     * @param {?} value
     * @return {?}
     */
    set addOnBlur(value) { this._addOnBlur = coerceBooleanProperty(value); }
    /**
     * Whether the input is disabled.
     * @return {?}
     */
    get disabled() { return this._disabled || (this._chipList && this._chipList.disabled); }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) { this._disabled = coerceBooleanProperty(value); }
    /**
     * Whether the input is empty.
     * @return {?}
     */
    get empty() { return !this._inputElement.value; }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this._chipList.stateChanges.next();
    }
    /**
     * Utility method to make host definition/tests more clear.
     * @param {?=} event
     * @return {?}
     */
    _keydown(event) {
        // Allow the user's focus to escape when they're tabbing forward. Note that we don't
        // want to do this when going backwards, because focus should go back to the first chip.
        if (event && event.keyCode === TAB && !hasModifierKey(event, 'shiftKey')) {
            this._chipList._allowFocusEscape();
        }
        this._emitChipEnd(event);
    }
    /**
     * Checks to see if the blur should emit the (chipEnd) event.
     * @return {?}
     */
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
    /**
     * @return {?}
     */
    _focus() {
        this.focused = true;
        this._chipList.stateChanges.next();
    }
    /**
     * Checks to see if the (chipEnd) event needs to be emitted.
     * @param {?=} event
     * @return {?}
     */
    _emitChipEnd(event) {
        if (!this._inputElement.value && !!event) {
            this._chipList._keydown(event);
        }
        if (!event || this._isSeparatorKey(event)) {
            this.chipEnd.emit({ input: this._inputElement, value: this._inputElement.value });
            if (event) {
                event.preventDefault();
            }
        }
    }
    /**
     * @return {?}
     */
    _onInput() {
        // Let chip list know whenever the value changes.
        this._chipList.stateChanges.next();
    }
    /**
     * Focuses the input.
     * @param {?=} options
     * @return {?}
     */
    focus(options) {
        this._inputElement.focus(options);
    }
    /**
     * Checks whether a keycode is one of the configured separators.
     * @private
     * @param {?} event
     * @return {?}
     */
    _isSeparatorKey(event) {
        if (hasModifierKey(event)) {
            return false;
        }
        /** @type {?} */
        const separators = this.separatorKeyCodes;
        /** @type {?} */
        const keyCode = event.keyCode;
        return Array.isArray(separators) ? separators.indexOf(keyCode) > -1 : separators.has(keyCode);
    }
}
MatChipInput.decorators = [
    { type: Directive, args: [{
                selector: 'input[matChipInputFor]',
                exportAs: 'matChipInput, matChipInputFor',
                host: {
                    'class': 'mat-chip-input mat-input-element',
                    '(keydown)': '_keydown($event)',
                    '(blur)': '_blur()',
                    '(focus)': '_focus()',
                    '(input)': '_onInput()',
                    '[id]': 'id',
                    '[attr.disabled]': 'disabled || null',
                    '[attr.placeholder]': 'placeholder || null',
                    '[attr.aria-invalid]': '_chipList && _chipList.ngControl ? _chipList.ngControl.invalid : null',
                }
            },] }
];
/** @nocollapse */
MatChipInput.ctorParameters = () => [
    { type: ElementRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_CHIPS_DEFAULT_OPTIONS,] }] }
];
MatChipInput.propDecorators = {
    chipList: [{ type: Input, args: ['matChipInputFor',] }],
    addOnBlur: [{ type: Input, args: ['matChipInputAddOnBlur',] }],
    separatorKeyCodes: [{ type: Input, args: ['matChipInputSeparatorKeyCodes',] }],
    chipEnd: [{ type: Output, args: ['matChipInputTokenEnd',] }],
    placeholder: [{ type: Input }],
    id: [{ type: Input }],
    disabled: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MatChipInput.ngAcceptInputType_addOnBlur;
    /** @type {?} */
    MatChipInput.ngAcceptInputType_disabled;
    /**
     * Whether the control is focused.
     * @type {?}
     */
    MatChipInput.prototype.focused;
    /** @type {?} */
    MatChipInput.prototype._chipList;
    /** @type {?} */
    MatChipInput.prototype._addOnBlur;
    /**
     * The list of key codes that will trigger a chipEnd event.
     *
     * Defaults to `[ENTER]`.
     * @type {?}
     */
    MatChipInput.prototype.separatorKeyCodes;
    /**
     * Emitted when a chip is to be added.
     * @type {?}
     */
    MatChipInput.prototype.chipEnd;
    /**
     * The input's placeholder text.
     * @type {?}
     */
    MatChipInput.prototype.placeholder;
    /**
     * Unique id for the input.
     * @type {?}
     */
    MatChipInput.prototype.id;
    /**
     * @type {?}
     * @private
     */
    MatChipInput.prototype._disabled;
    /**
     * The native input element to which this directive is attached.
     * @type {?}
     * @protected
     */
    MatChipInput.prototype._inputElement;
    /**
     * @type {?}
     * @protected
     */
    MatChipInput.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatChipInput.prototype._defaultOptions;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy9jaGlwLWlucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQWEsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BHLE9BQU8sRUFBQyxjQUFjLEVBQUUsR0FBRyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFDLHlCQUF5QixFQUF5QixNQUFNLHdCQUF3QixDQUFDO0FBQ3pGLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7Ozs7O0FBS3hDLHVDQU1DOzs7Ozs7SUFKQyxrQ0FBd0I7Ozs7O0lBR3hCLGtDQUFjOzs7O0lBSVosWUFBWSxHQUFHLENBQUM7Ozs7O0FBcUJwQixNQUFNLE9BQU8sWUFBWTs7Ozs7SUFvRHZCLFlBQ1ksV0FBeUMsRUFDUixlQUF1QztRQUR4RSxnQkFBVyxHQUFYLFdBQVcsQ0FBOEI7UUFDUixvQkFBZSxHQUFmLGVBQWUsQ0FBd0I7Ozs7UUFwRHBGLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFrQnpCLGVBQVUsR0FBWSxLQUFLLENBQUM7Ozs7OztRQVE1QixzQkFBaUIsR0FBMkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQzs7OztRQUluRixZQUFPLEdBQW9DLElBQUksWUFBWSxFQUFxQixDQUFDOzs7O1FBR3hFLGdCQUFXLEdBQVcsRUFBRSxDQUFDOzs7O1FBR3pCLE9BQUUsR0FBVyx1QkFBdUIsWUFBWSxFQUFFLEVBQUUsQ0FBQztRQU10RCxjQUFTLEdBQVksS0FBSyxDQUFDO1FBV2pDLElBQUksQ0FBQyxhQUFhLEdBQUcsbUJBQUEs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QUs7aUJBR0wsS0FBSzt1QkFHTCxLQUFLOzs7O0lBcUZOLHlDQUFxRDs7SUFDckQsd0NBQW9EOzs7OztJQTdIcEQsK0JBQXlCOztJQUN6QixpQ0FBdUI7O0lBaUJ2QixrQ0FBNEI7Ozs7Ozs7SUFPNUIseUNBQ21GOzs7OztJQUduRiwrQkFDaUY7Ozs7O0lBR2pGLG1DQUFrQzs7Ozs7SUFHbEMsMEJBQThEOzs7OztJQU05RCxpQ0FBbUM7Ozs7OztJQU1uQyxxQ0FBMEM7Ozs7O0lBR3hDLG1DQUFtRDs7Ozs7SUFDbkQsdUNBQWtGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPdXRwdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtoYXNNb2RpZmllcktleSwgVEFCfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtNQVRfQ0hJUFNfREVGQVVMVF9PUFRJT05TLCBNYXRDaGlwc0RlZmF1bHRPcHRpb25zfSBmcm9tICcuL2NoaXAtZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7TWF0Q2hpcExpc3R9IGZyb20gJy4vY2hpcC1saXN0JztcbmltcG9ydCB7TWF0Q2hpcFRleHRDb250cm9sfSBmcm9tICcuL2NoaXAtdGV4dC1jb250cm9sJztcblxuXG4vKiogUmVwcmVzZW50cyBhbiBpbnB1dCBldmVudCBvbiBhIGBtYXRDaGlwSW5wdXRgLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRDaGlwSW5wdXRFdmVudCB7XG4gIC8qKiBUaGUgbmF0aXZlIGA8aW5wdXQ+YCBlbGVtZW50IHRoYXQgdGhlIGV2ZW50IGlzIGJlaW5nIGZpcmVkIGZvci4gKi9cbiAgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQuICovXG4gIHZhbHVlOiBzdHJpbmc7XG59XG5cbi8vIEluY3JlYXNpbmcgaW50ZWdlciBmb3IgZ2VuZXJhdGluZyB1bmlxdWUgaWRzLlxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8qKlxuICogRGlyZWN0aXZlIHRoYXQgYWRkcyBjaGlwLXNwZWNpZmljIGJlaGF2aW9ycyB0byBhbiBpbnB1dCBlbGVtZW50IGluc2lkZSBgPG1hdC1mb3JtLWZpZWxkPmAuXG4gKiBNYXkgYmUgcGxhY2VkIGluc2lkZSBvciBvdXRzaWRlIG9mIGFuIGA8bWF0LWNoaXAtbGlzdD5gLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRDaGlwSW5wdXRGb3JdJyxcbiAgZXhwb3J0QXM6ICdtYXRDaGlwSW5wdXQsIG1hdENoaXBJbnB1dEZvcicsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNoaXAtaW5wdXQgbWF0LWlucHV0LWVsZW1lbnQnLFxuICAgICcoa2V5ZG93biknOiAnX2tleWRvd24oJGV2ZW50KScsXG4gICAgJyhibHVyKSc6ICdfYmx1cigpJyxcbiAgICAnKGZvY3VzKSc6ICdfZm9jdXMoKScsXG4gICAgJyhpbnB1dCknOiAnX29uSW5wdXQoKScsXG4gICAgJ1tpZF0nOiAnaWQnLFxuICAgICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQgfHwgbnVsbCcsXG4gICAgJ1thdHRyLnBsYWNlaG9sZGVyXSc6ICdwbGFjZWhvbGRlciB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1pbnZhbGlkXSc6ICdfY2hpcExpc3QgJiYgX2NoaXBMaXN0Lm5nQ29udHJvbCA/IF9jaGlwTGlzdC5uZ0NvbnRyb2wuaW52YWxpZCA6IG51bGwnLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXBJbnB1dCBpbXBsZW1lbnRzIE1hdENoaXBUZXh0Q29udHJvbCwgT25DaGFuZ2VzIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgZm9jdXNlZC4gKi9cbiAgZm9jdXNlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBfY2hpcExpc3Q6IE1hdENoaXBMaXN0O1xuXG4gIC8qKiBSZWdpc3RlciBpbnB1dCBmb3IgY2hpcCBsaXN0ICovXG4gIEBJbnB1dCgnbWF0Q2hpcElucHV0Rm9yJylcbiAgc2V0IGNoaXBMaXN0KHZhbHVlOiBNYXRDaGlwTGlzdCkge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5fY2hpcExpc3QgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX2NoaXBMaXN0LnJlZ2lzdGVySW5wdXQodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSBjaGlwRW5kIGV2ZW50IHdpbGwgYmUgZW1pdHRlZCB3aGVuIHRoZSBpbnB1dCBpcyBibHVycmVkLlxuICAgKi9cbiAgQElucHV0KCdtYXRDaGlwSW5wdXRBZGRPbkJsdXInKVxuICBnZXQgYWRkT25CbHVyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fYWRkT25CbHVyOyB9XG4gIHNldCBhZGRPbkJsdXIodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fYWRkT25CbHVyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBfYWRkT25CbHVyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIGtleSBjb2RlcyB0aGF0IHdpbGwgdHJpZ2dlciBhIGNoaXBFbmQgZXZlbnQuXG4gICAqXG4gICAqIERlZmF1bHRzIHRvIGBbRU5URVJdYC5cbiAgICovXG4gIEBJbnB1dCgnbWF0Q2hpcElucHV0U2VwYXJhdG9yS2V5Q29kZXMnKVxuICBzZXBhcmF0b3JLZXlDb2RlczogbnVtYmVyW10gfCBTZXQ8bnVtYmVyPiA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLnNlcGFyYXRvcktleUNvZGVzO1xuXG4gIC8qKiBFbWl0dGVkIHdoZW4gYSBjaGlwIGlzIHRvIGJlIGFkZGVkLiAqL1xuICBAT3V0cHV0KCdtYXRDaGlwSW5wdXRUb2tlbkVuZCcpXG4gIGNoaXBFbmQ6IEV2ZW50RW1pdHRlcjxNYXRDaGlwSW5wdXRFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdENoaXBJbnB1dEV2ZW50PigpO1xuXG4gIC8qKiBUaGUgaW5wdXQncyBwbGFjZWhvbGRlciB0ZXh0LiAqL1xuICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nID0gJyc7XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhlIGlucHV0LiAqL1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gYG1hdC1jaGlwLWxpc3QtaW5wdXQtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZWQgfHwgKHRoaXMuX2NoaXBMaXN0ICYmIHRoaXMuX2NoaXBMaXN0LmRpc2FibGVkKTsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGVtcHR5LiAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiAhdGhpcy5faW5wdXRFbGVtZW50LnZhbHVlOyB9XG5cbiAgLyoqIFRoZSBuYXRpdmUgaW5wdXQgZWxlbWVudCB0byB3aGljaCB0aGlzIGRpcmVjdGl2ZSBpcyBhdHRhY2hlZC4gKi9cbiAgcHJvdGVjdGVkIF9pbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIEBJbmplY3QoTUFUX0NISVBTX0RFRkFVTFRfT1BUSU9OUykgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM6IE1hdENoaXBzRGVmYXVsdE9wdGlvbnMpIHtcbiAgICB0aGlzLl9pbnB1dEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuX2NoaXBMaXN0LnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICAvKiogVXRpbGl0eSBtZXRob2QgdG8gbWFrZSBob3N0IGRlZmluaXRpb24vdGVzdHMgbW9yZSBjbGVhci4gKi9cbiAgX2tleWRvd24oZXZlbnQ/OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgLy8gQWxsb3cgdGhlIHVzZXIncyBmb2N1cyB0byBlc2NhcGUgd2hlbiB0aGV5J3JlIHRhYmJpbmcgZm9yd2FyZC4gTm90ZSB0aGF0IHdlIGRvbid0XG4gICAgLy8gd2FudCB0byBkbyB0aGlzIHdoZW4gZ29pbmcgYmFja3dhcmRzLCBiZWNhdXNlIGZvY3VzIHNob3VsZCBnbyBiYWNrIHRvIHRoZSBmaXJzdCBjaGlwLlxuICAgIGlmIChldmVudCAmJiBldmVudC5rZXlDb2RlID09PSBUQUIgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50LCAnc2hpZnRLZXknKSkge1xuICAgICAgdGhpcy5fY2hpcExpc3QuX2FsbG93Rm9jdXNFc2NhcGUoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9lbWl0Q2hpcEVuZChldmVudCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHRvIHNlZSBpZiB0aGUgYmx1ciBzaG91bGQgZW1pdCB0aGUgKGNoaXBFbmQpIGV2ZW50LiAqL1xuICBfYmx1cigpIHtcbiAgICBpZiAodGhpcy5hZGRPbkJsdXIpIHtcbiAgICAgIHRoaXMuX2VtaXRDaGlwRW5kKCk7XG4gICAgfVxuICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgIC8vIEJsdXIgdGhlIGNoaXAgbGlzdCBpZiBpdCBpcyBub3QgZm9jdXNlZFxuICAgIGlmICghdGhpcy5fY2hpcExpc3QuZm9jdXNlZCkge1xuICAgICAgdGhpcy5fY2hpcExpc3QuX2JsdXIoKTtcbiAgICB9XG4gICAgdGhpcy5fY2hpcExpc3Quc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIF9mb2N1cygpIHtcbiAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xuICAgIHRoaXMuX2NoaXBMaXN0LnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHRvIHNlZSBpZiB0aGUgKGNoaXBFbmQpIGV2ZW50IG5lZWRzIHRvIGJlIGVtaXR0ZWQuICovXG4gIF9lbWl0Q2hpcEVuZChldmVudD86IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuX2lucHV0RWxlbWVudC52YWx1ZSAmJiAhIWV2ZW50KSB7XG4gICAgICB0aGlzLl9jaGlwTGlzdC5fa2V5ZG93bihldmVudCk7XG4gICAgfVxuICAgIGlmICghZXZlbnQgfHwgdGhpcy5faXNTZXBhcmF0b3JLZXkoZXZlbnQpKSB7XG4gICAgICB0aGlzLmNoaXBFbmQuZW1pdCh7IGlucHV0OiB0aGlzLl9pbnB1dEVsZW1lbnQsIHZhbHVlOiB0aGlzLl9pbnB1dEVsZW1lbnQudmFsdWUgfSk7XG5cbiAgICAgIGlmIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9vbklucHV0KCkge1xuICAgIC8vIExldCBjaGlwIGxpc3Qga25vdyB3aGVuZXZlciB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICB0aGlzLl9jaGlwTGlzdC5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGlucHV0LiAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5faW5wdXRFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIGEga2V5Y29kZSBpcyBvbmUgb2YgdGhlIGNvbmZpZ3VyZWQgc2VwYXJhdG9ycy4gKi9cbiAgcHJpdmF0ZSBfaXNTZXBhcmF0b3JLZXkoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VwYXJhdG9ycyA9IHRoaXMuc2VwYXJhdG9yS2V5Q29kZXM7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoc2VwYXJhdG9ycykgPyBzZXBhcmF0b3JzLmluZGV4T2Yoa2V5Q29kZSkgPiAtMSA6IHNlcGFyYXRvcnMuaGFzKGtleUNvZGUpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2FkZE9uQmx1cjogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBib29sZWFuIHwgc3RyaW5nO1xufVxuIl19