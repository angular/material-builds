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
// Increasing integer for generating unique ids.
let nextUniqueId = 0;
/**
 * Directive that adds chip-specific behaviors to an input element inside `<mat-form-field>`.
 * May be placed inside or outside of an `<mat-chip-list>`.
 */
let MatChipInput = /** @class */ (() => {
    class MatChipInput {
        constructor(_elementRef, _defaultOptions) {
            this._elementRef = _elementRef;
            this._defaultOptions = _defaultOptions;
            /** Whether the control is focused. */
            this.focused = false;
            this._addOnBlur = false;
            /**
             * The list of key codes that will trigger a chipEnd event.
             *
             * Defaults to `[ENTER]`.
             */
            this.separatorKeyCodes = this._defaultOptions.separatorKeyCodes;
            /** Emitted when a chip is to be added. */
            this.chipEnd = new EventEmitter();
            /** The input's placeholder text. */
            this.placeholder = '';
            /** Unique id for the input. */
            this.id = `mat-chip-list-input-${nextUniqueId++}`;
            this._disabled = false;
            this._inputElement = this._elementRef.nativeElement;
        }
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
        get addOnBlur() { return this._addOnBlur; }
        set addOnBlur(value) { this._addOnBlur = coerceBooleanProperty(value); }
        /** Whether the input is disabled. */
        get disabled() { return this._disabled || (this._chipList && this._chipList.disabled); }
        set disabled(value) { this._disabled = coerceBooleanProperty(value); }
        /** Whether the input is empty. */
        get empty() { return !this._inputElement.value; }
        ngOnChanges() {
            this._chipList.stateChanges.next();
        }
        /** Utility method to make host definition/tests more clear. */
        _keydown(event) {
            // Allow the user's focus to escape when they're tabbing forward. Note that we don't
            // want to do this when going backwards, because focus should go back to the first chip.
            if (event && event.keyCode === TAB && !hasModifierKey(event, 'shiftKey')) {
                this._chipList._allowFocusEscape();
            }
            this._emitChipEnd(event);
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
            this._chipList.stateChanges.next();
        }
        /** Checks to see if the (chipEnd) event needs to be emitted. */
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
        _onInput() {
            // Let chip list know whenever the value changes.
            this._chipList.stateChanges.next();
        }
        /** Focuses the input. */
        focus(options) {
            this._inputElement.focus(options);
        }
        /** Checks whether a keycode is one of the configured separators. */
        _isSeparatorKey(event) {
            if (hasModifierKey(event)) {
                return false;
            }
            const separators = this.separatorKeyCodes;
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
                        '[attr.aria-required]': '_chipList && _chipList.required || null',
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
    return MatChipInput;
})();
export { MatChipInput };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy9jaGlwLWlucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFhLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwRyxPQUFPLEVBQUMsY0FBYyxFQUFFLEdBQUcsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBQyx5QkFBeUIsRUFBeUIsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBYXhDLGdEQUFnRDtBQUNoRCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFFckI7OztHQUdHO0FBQ0g7SUFBQSxNQWdCYSxZQUFZO1FBb0R2QixZQUNZLFdBQXlDLEVBQ1IsZUFBdUM7WUFEeEUsZ0JBQVcsR0FBWCxXQUFXLENBQThCO1lBQ1Isb0JBQWUsR0FBZixlQUFlLENBQXdCO1lBckRwRixzQ0FBc0M7WUFDdEMsWUFBTyxHQUFZLEtBQUssQ0FBQztZQWtCekIsZUFBVSxHQUFZLEtBQUssQ0FBQztZQUU1Qjs7OztlQUlHO1lBRUgsc0JBQWlCLEdBQTJCLElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUM7WUFFbkYsMENBQTBDO1lBRTFDLFlBQU8sR0FBb0MsSUFBSSxZQUFZLEVBQXFCLENBQUM7WUFFakYsb0NBQW9DO1lBQzNCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1lBRWxDLCtCQUErQjtZQUN0QixPQUFFLEdBQVcsdUJBQXVCLFlBQVksRUFBRSxFQUFFLENBQUM7WUFNdEQsY0FBUyxHQUFZLEtBQUssQ0FBQztZQVdq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NkZ4QixNQUFNLFNBQUMseUJBQXlCOzs7MkJBaERsQyxLQUFLLFNBQUMsaUJBQWlCOzRCQVd2QixLQUFLLFNBQUMsdUJBQXVCO29DQVU3QixLQUFLLFNBQUMsK0JBQStCOzBCQUlyQyxNQUFNLFNBQUMsc0JBQXNCOzhCQUk3QixLQUFLO3FCQUdMLEtBQUs7MkJBR0wsS0FBSzs7SUF1RlIsbUJBQUM7S0FBQTtTQWhJWSxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2hhc01vZGlmaWVyS2V5LCBUQUJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge01BVF9DSElQU19ERUZBVUxUX09QVElPTlMsIE1hdENoaXBzRGVmYXVsdE9wdGlvbnN9IGZyb20gJy4vY2hpcC1kZWZhdWx0LW9wdGlvbnMnO1xuaW1wb3J0IHtNYXRDaGlwTGlzdH0gZnJvbSAnLi9jaGlwLWxpc3QnO1xuaW1wb3J0IHtNYXRDaGlwVGV4dENvbnRyb2x9IGZyb20gJy4vY2hpcC10ZXh0LWNvbnRyb2wnO1xuXG5cbi8qKiBSZXByZXNlbnRzIGFuIGlucHV0IGV2ZW50IG9uIGEgYG1hdENoaXBJbnB1dGAuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdENoaXBJbnB1dEV2ZW50IHtcbiAgLyoqIFRoZSBuYXRpdmUgYDxpbnB1dD5gIGVsZW1lbnQgdGhhdCB0aGUgZXZlbnQgaXMgYmVpbmcgZmlyZWQgZm9yLiAqL1xuICBpbnB1dDogSFRNTElucHV0RWxlbWVudDtcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBpbnB1dC4gKi9cbiAgdmFsdWU6IHN0cmluZztcbn1cblxuLy8gSW5jcmVhc2luZyBpbnRlZ2VyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBpZHMuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuLyoqXG4gKiBEaXJlY3RpdmUgdGhhdCBhZGRzIGNoaXAtc3BlY2lmaWMgYmVoYXZpb3JzIHRvIGFuIGlucHV0IGVsZW1lbnQgaW5zaWRlIGA8bWF0LWZvcm0tZmllbGQ+YC5cbiAqIE1heSBiZSBwbGFjZWQgaW5zaWRlIG9yIG91dHNpZGUgb2YgYW4gYDxtYXQtY2hpcC1saXN0PmAuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W21hdENoaXBJbnB1dEZvcl0nLFxuICBleHBvcnRBczogJ21hdENoaXBJbnB1dCwgbWF0Q2hpcElucHV0Rm9yJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2hpcC1pbnB1dCBtYXQtaW5wdXQtZWxlbWVudCcsXG4gICAgJyhrZXlkb3duKSc6ICdfa2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKGJsdXIpJzogJ19ibHVyKCknLFxuICAgICcoZm9jdXMpJzogJ19mb2N1cygpJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgpJyxcbiAgICAnW2lkXSc6ICdpZCcsXG4gICAgJ1thdHRyLmRpc2FibGVkXSc6ICdkaXNhYmxlZCB8fCBudWxsJyxcbiAgICAnW2F0dHIucGxhY2Vob2xkZXJdJzogJ3BsYWNlaG9sZGVyIHx8IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWludmFsaWRdJzogJ19jaGlwTGlzdCAmJiBfY2hpcExpc3QubmdDb250cm9sID8gX2NoaXBMaXN0Lm5nQ29udHJvbC5pbnZhbGlkIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ19jaGlwTGlzdCAmJiBfY2hpcExpc3QucmVxdWlyZWQgfHwgbnVsbCcsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcElucHV0IGltcGxlbWVudHMgTWF0Q2hpcFRleHRDb250cm9sLCBPbkNoYW5nZXMge1xuICAvKiogV2hldGhlciB0aGUgY29udHJvbCBpcyBmb2N1c2VkLiAqL1xuICBmb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG4gIF9jaGlwTGlzdDogTWF0Q2hpcExpc3Q7XG5cbiAgLyoqIFJlZ2lzdGVyIGlucHV0IGZvciBjaGlwIGxpc3QgKi9cbiAgQElucHV0KCdtYXRDaGlwSW5wdXRGb3InKVxuICBzZXQgY2hpcExpc3QodmFsdWU6IE1hdENoaXBMaXN0KSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLl9jaGlwTGlzdCA9IHZhbHVlO1xuICAgICAgdGhpcy5fY2hpcExpc3QucmVnaXN0ZXJJbnB1dCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIGNoaXBFbmQgZXZlbnQgd2lsbCBiZSBlbWl0dGVkIHdoZW4gdGhlIGlucHV0IGlzIGJsdXJyZWQuXG4gICAqL1xuICBASW5wdXQoJ21hdENoaXBJbnB1dEFkZE9uQmx1cicpXG4gIGdldCBhZGRPbkJsdXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9hZGRPbkJsdXI7IH1cbiAgc2V0IGFkZE9uQmx1cih2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9hZGRPbkJsdXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIF9hZGRPbkJsdXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIGxpc3Qgb2Yga2V5IGNvZGVzIHRoYXQgd2lsbCB0cmlnZ2VyIGEgY2hpcEVuZCBldmVudC5cbiAgICpcbiAgICogRGVmYXVsdHMgdG8gYFtFTlRFUl1gLlxuICAgKi9cbiAgQElucHV0KCdtYXRDaGlwSW5wdXRTZXBhcmF0b3JLZXlDb2RlcycpXG4gIHNlcGFyYXRvcktleUNvZGVzOiBudW1iZXJbXSB8IFNldDxudW1iZXI+ID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuc2VwYXJhdG9yS2V5Q29kZXM7XG5cbiAgLyoqIEVtaXR0ZWQgd2hlbiBhIGNoaXAgaXMgdG8gYmUgYWRkZWQuICovXG4gIEBPdXRwdXQoJ21hdENoaXBJbnB1dFRva2VuRW5kJylcbiAgY2hpcEVuZDogRXZlbnRFbWl0dGVyPE1hdENoaXBJbnB1dEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcElucHV0RXZlbnQ+KCk7XG5cbiAgLyoqIFRoZSBpbnB1dCdzIHBsYWNlaG9sZGVyIHRleHQuICovXG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSAnJztcblxuICAvKiogVW5pcXVlIGlkIGZvciB0aGUgaW5wdXQuICovXG4gIEBJbnB1dCgpIGlkOiBzdHJpbmcgPSBgbWF0LWNoaXAtbGlzdC1pbnB1dC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlZCB8fCAodGhpcy5fY2hpcExpc3QgJiYgdGhpcy5fY2hpcExpc3QuZGlzYWJsZWQpOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgZW1wdHkuICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHsgcmV0dXJuICF0aGlzLl9pbnB1dEVsZW1lbnQudmFsdWU7IH1cblxuICAvKiogVGhlIG5hdGl2ZSBpbnB1dCBlbGVtZW50IHRvIHdoaWNoIHRoaXMgZGlyZWN0aXZlIGlzIGF0dGFjaGVkLiAqL1xuICBwcm90ZWN0ZWQgX2lucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgQEluamVjdChNQVRfQ0hJUFNfREVGQVVMVF9PUFRJT05TKSBwcml2YXRlIF9kZWZhdWx0T3B0aW9uczogTWF0Q2hpcHNEZWZhdWx0T3B0aW9ucykge1xuICAgIHRoaXMuX2lucHV0RWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5fY2hpcExpc3Quc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBVdGlsaXR5IG1ldGhvZCB0byBtYWtlIGhvc3QgZGVmaW5pdGlvbi90ZXN0cyBtb3JlIGNsZWFyLiAqL1xuICBfa2V5ZG93bihldmVudD86IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyBBbGxvdyB0aGUgdXNlcidzIGZvY3VzIHRvIGVzY2FwZSB3aGVuIHRoZXkncmUgdGFiYmluZyBmb3J3YXJkLiBOb3RlIHRoYXQgd2UgZG9uJ3RcbiAgICAvLyB3YW50IHRvIGRvIHRoaXMgd2hlbiBnb2luZyBiYWNrd2FyZHMsIGJlY2F1c2UgZm9jdXMgc2hvdWxkIGdvIGJhY2sgdG8gdGhlIGZpcnN0IGNoaXAuXG4gICAgaWYgKGV2ZW50ICYmIGV2ZW50LmtleUNvZGUgPT09IFRBQiAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQsICdzaGlmdEtleScpKSB7XG4gICAgICB0aGlzLl9jaGlwTGlzdC5fYWxsb3dGb2N1c0VzY2FwZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2VtaXRDaGlwRW5kKGV2ZW50KTtcbiAgfVxuXG4gIC8qKiBDaGVja3MgdG8gc2VlIGlmIHRoZSBibHVyIHNob3VsZCBlbWl0IHRoZSAoY2hpcEVuZCkgZXZlbnQuICovXG4gIF9ibHVyKCkge1xuICAgIGlmICh0aGlzLmFkZE9uQmx1cikge1xuICAgICAgdGhpcy5fZW1pdENoaXBFbmQoKTtcbiAgICB9XG4gICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgLy8gQmx1ciB0aGUgY2hpcCBsaXN0IGlmIGl0IGlzIG5vdCBmb2N1c2VkXG4gICAgaWYgKCF0aGlzLl9jaGlwTGlzdC5mb2N1c2VkKSB7XG4gICAgICB0aGlzLl9jaGlwTGlzdC5fYmx1cigpO1xuICAgIH1cbiAgICB0aGlzLl9jaGlwTGlzdC5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgX2ZvY3VzKCkge1xuICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4gICAgdGhpcy5fY2hpcExpc3Quc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBDaGVja3MgdG8gc2VlIGlmIHRoZSAoY2hpcEVuZCkgZXZlbnQgbmVlZHMgdG8gYmUgZW1pdHRlZC4gKi9cbiAgX2VtaXRDaGlwRW5kKGV2ZW50PzogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICghdGhpcy5faW5wdXRFbGVtZW50LnZhbHVlICYmICEhZXZlbnQpIHtcbiAgICAgIHRoaXMuX2NoaXBMaXN0Ll9rZXlkb3duKGV2ZW50KTtcbiAgICB9XG4gICAgaWYgKCFldmVudCB8fCB0aGlzLl9pc1NlcGFyYXRvcktleShldmVudCkpIHtcbiAgICAgIHRoaXMuY2hpcEVuZC5lbWl0KHsgaW5wdXQ6IHRoaXMuX2lucHV0RWxlbWVudCwgdmFsdWU6IHRoaXMuX2lucHV0RWxlbWVudC52YWx1ZSB9KTtcblxuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX29uSW5wdXQoKSB7XG4gICAgLy8gTGV0IGNoaXAgbGlzdCBrbm93IHdoZW5ldmVyIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgIHRoaXMuX2NoaXBMaXN0LnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgaW5wdXQuICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLl9pbnB1dEVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgYSBrZXljb2RlIGlzIG9uZSBvZiB0aGUgY29uZmlndXJlZCBzZXBhcmF0b3JzLiAqL1xuICBwcml2YXRlIF9pc1NlcGFyYXRvcktleShldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBzZXBhcmF0b3JzID0gdGhpcy5zZXBhcmF0b3JLZXlDb2RlcztcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShzZXBhcmF0b3JzKSA/IHNlcGFyYXRvcnMuaW5kZXhPZihrZXlDb2RlKSA+IC0xIDogc2VwYXJhdG9ycy5oYXMoa2V5Q29kZSk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfYWRkT25CbHVyOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19