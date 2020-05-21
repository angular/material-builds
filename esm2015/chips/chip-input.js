/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
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
    let MatChipInput = class MatChipInput {
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
    };
    __decorate([
        Input('matChipInputFor'),
        __metadata("design:type", MatChipList),
        __metadata("design:paramtypes", [MatChipList])
    ], MatChipInput.prototype, "chipList", null);
    __decorate([
        Input('matChipInputAddOnBlur'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatChipInput.prototype, "addOnBlur", null);
    __decorate([
        Input('matChipInputSeparatorKeyCodes'),
        __metadata("design:type", Object)
    ], MatChipInput.prototype, "separatorKeyCodes", void 0);
    __decorate([
        Output('matChipInputTokenEnd'),
        __metadata("design:type", EventEmitter)
    ], MatChipInput.prototype, "chipEnd", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatChipInput.prototype, "placeholder", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatChipInput.prototype, "id", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatChipInput.prototype, "disabled", null);
    MatChipInput = __decorate([
        Directive({
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
        }),
        __param(1, Inject(MAT_CHIPS_DEFAULT_OPTIONS)),
        __metadata("design:paramtypes", [ElementRef, Object])
    ], MatChipInput);
    return MatChipInput;
})();
export { MatChipInput };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy9jaGlwLWlucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBYSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDcEcsT0FBTyxFQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUMseUJBQXlCLEVBQXlCLE1BQU0sd0JBQXdCLENBQUM7QUFDekYsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQWF4QyxnREFBZ0Q7QUFDaEQsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBRXJCOzs7R0FHRztBQWlCSDtJQUFBLElBQWEsWUFBWSxHQUF6QixNQUFhLFlBQVk7UUFvRHZCLFlBQ1ksV0FBeUMsRUFDUixlQUF1QztZQUR4RSxnQkFBVyxHQUFYLFdBQVcsQ0FBOEI7WUFDUixvQkFBZSxHQUFmLGVBQWUsQ0FBd0I7WUFyRHBGLHNDQUFzQztZQUN0QyxZQUFPLEdBQVksS0FBSyxDQUFDO1lBa0J6QixlQUFVLEdBQVksS0FBSyxDQUFDO1lBRTVCOzs7O2VBSUc7WUFFSCxzQkFBaUIsR0FBMkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQztZQUVuRiwwQ0FBMEM7WUFFMUMsWUFBTyxHQUFvQyxJQUFJLFlBQVksRUFBcUIsQ0FBQztZQUVqRixvQ0FBb0M7WUFDM0IsZ0JBQVcsR0FBVyxFQUFFLENBQUM7WUFFbEMsK0JBQStCO1lBQ3RCLE9BQUUsR0FBVyx1QkFBdUIsWUFBWSxFQUFFLEVBQUUsQ0FBQztZQU10RCxjQUFTLEdB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RSx3QkFBd0I7WUFDbEMsUUFBUSxFQUFFLCtCQUErQjtZQUN6QyxJQUFJLEVBQUU7Z0JBQ0osT0FBTyxFQUFFLGtDQUFrQztnQkFDM0MsV0FBVyxFQUFFLGtCQUFrQjtnQkFDL0IsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLFNBQVMsRUFBRSxVQUFVO2dCQUNyQixTQUFTLEVBQUUsWUFBWTtnQkFDdkIsTUFBTSxFQUFFLElBQUk7Z0JBQ1osaUJBQWlCLEVBQUUsa0JBQWtCO2dCQUNyQyxvQkFBb0IsRUFBRSxxQkFBcUI7Z0JBQzNDLHFCQUFxQixFQUFFLHVFQUF1RTtnQkFDOUYsc0JBQXNCLEVBQUUseUNBQXlDO2FBQ2xFO1NBQ0YsQ0FBQztRQXVERyxXQUFBLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO3lDQURYLFVBQVU7T0FyRHhCLFlBQVksQ0FnSXhCO0lBQUQsbUJBQUM7S0FBQTtTQWhJWSxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2hhc01vZGlmaWVyS2V5LCBUQUJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge01BVF9DSElQU19ERUZBVUxUX09QVElPTlMsIE1hdENoaXBzRGVmYXVsdE9wdGlvbnN9IGZyb20gJy4vY2hpcC1kZWZhdWx0LW9wdGlvbnMnO1xuaW1wb3J0IHtNYXRDaGlwTGlzdH0gZnJvbSAnLi9jaGlwLWxpc3QnO1xuaW1wb3J0IHtNYXRDaGlwVGV4dENvbnRyb2x9IGZyb20gJy4vY2hpcC10ZXh0LWNvbnRyb2wnO1xuXG5cbi8qKiBSZXByZXNlbnRzIGFuIGlucHV0IGV2ZW50IG9uIGEgYG1hdENoaXBJbnB1dGAuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdENoaXBJbnB1dEV2ZW50IHtcbiAgLyoqIFRoZSBuYXRpdmUgYDxpbnB1dD5gIGVsZW1lbnQgdGhhdCB0aGUgZXZlbnQgaXMgYmVpbmcgZmlyZWQgZm9yLiAqL1xuICBpbnB1dDogSFRNTElucHV0RWxlbWVudDtcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBpbnB1dC4gKi9cbiAgdmFsdWU6IHN0cmluZztcbn1cblxuLy8gSW5jcmVhc2luZyBpbnRlZ2VyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBpZHMuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuLyoqXG4gKiBEaXJlY3RpdmUgdGhhdCBhZGRzIGNoaXAtc3BlY2lmaWMgYmVoYXZpb3JzIHRvIGFuIGlucHV0IGVsZW1lbnQgaW5zaWRlIGA8bWF0LWZvcm0tZmllbGQ+YC5cbiAqIE1heSBiZSBwbGFjZWQgaW5zaWRlIG9yIG91dHNpZGUgb2YgYW4gYDxtYXQtY2hpcC1saXN0PmAuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W21hdENoaXBJbnB1dEZvcl0nLFxuICBleHBvcnRBczogJ21hdENoaXBJbnB1dCwgbWF0Q2hpcElucHV0Rm9yJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2hpcC1pbnB1dCBtYXQtaW5wdXQtZWxlbWVudCcsXG4gICAgJyhrZXlkb3duKSc6ICdfa2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKGJsdXIpJzogJ19ibHVyKCknLFxuICAgICcoZm9jdXMpJzogJ19mb2N1cygpJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgpJyxcbiAgICAnW2lkXSc6ICdpZCcsXG4gICAgJ1thdHRyLmRpc2FibGVkXSc6ICdkaXNhYmxlZCB8fCBudWxsJyxcbiAgICAnW2F0dHIucGxhY2Vob2xkZXJdJzogJ3BsYWNlaG9sZGVyIHx8IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWludmFsaWRdJzogJ19jaGlwTGlzdCAmJiBfY2hpcExpc3QubmdDb250cm9sID8gX2NoaXBMaXN0Lm5nQ29udHJvbC5pbnZhbGlkIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ19jaGlwTGlzdCAmJiBfY2hpcExpc3QucmVxdWlyZWQgfHwgbnVsbCcsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcElucHV0IGltcGxlbWVudHMgTWF0Q2hpcFRleHRDb250cm9sLCBPbkNoYW5nZXMge1xuICAvKiogV2hldGhlciB0aGUgY29udHJvbCBpcyBmb2N1c2VkLiAqL1xuICBmb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG4gIF9jaGlwTGlzdDogTWF0Q2hpcExpc3Q7XG5cbiAgLyoqIFJlZ2lzdGVyIGlucHV0IGZvciBjaGlwIGxpc3QgKi9cbiAgQElucHV0KCdtYXRDaGlwSW5wdXRGb3InKVxuICBzZXQgY2hpcExpc3QodmFsdWU6IE1hdENoaXBMaXN0KSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLl9jaGlwTGlzdCA9IHZhbHVlO1xuICAgICAgdGhpcy5fY2hpcExpc3QucmVnaXN0ZXJJbnB1dCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIGNoaXBFbmQgZXZlbnQgd2lsbCBiZSBlbWl0dGVkIHdoZW4gdGhlIGlucHV0IGlzIGJsdXJyZWQuXG4gICAqL1xuICBASW5wdXQoJ21hdENoaXBJbnB1dEFkZE9uQmx1cicpXG4gIGdldCBhZGRPbkJsdXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9hZGRPbkJsdXI7IH1cbiAgc2V0IGFkZE9uQmx1cih2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9hZGRPbkJsdXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIF9hZGRPbkJsdXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIGxpc3Qgb2Yga2V5IGNvZGVzIHRoYXQgd2lsbCB0cmlnZ2VyIGEgY2hpcEVuZCBldmVudC5cbiAgICpcbiAgICogRGVmYXVsdHMgdG8gYFtFTlRFUl1gLlxuICAgKi9cbiAgQElucHV0KCdtYXRDaGlwSW5wdXRTZXBhcmF0b3JLZXlDb2RlcycpXG4gIHNlcGFyYXRvcktleUNvZGVzOiBudW1iZXJbXSB8IFNldDxudW1iZXI+ID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuc2VwYXJhdG9yS2V5Q29kZXM7XG5cbiAgLyoqIEVtaXR0ZWQgd2hlbiBhIGNoaXAgaXMgdG8gYmUgYWRkZWQuICovXG4gIEBPdXRwdXQoJ21hdENoaXBJbnB1dFRva2VuRW5kJylcbiAgY2hpcEVuZDogRXZlbnRFbWl0dGVyPE1hdENoaXBJbnB1dEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hpcElucHV0RXZlbnQ+KCk7XG5cbiAgLyoqIFRoZSBpbnB1dCdzIHBsYWNlaG9sZGVyIHRleHQuICovXG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSAnJztcblxuICAvKiogVW5pcXVlIGlkIGZvciB0aGUgaW5wdXQuICovXG4gIEBJbnB1dCgpIGlkOiBzdHJpbmcgPSBgbWF0LWNoaXAtbGlzdC1pbnB1dC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlZCB8fCAodGhpcy5fY2hpcExpc3QgJiYgdGhpcy5fY2hpcExpc3QuZGlzYWJsZWQpOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgZW1wdHkuICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHsgcmV0dXJuICF0aGlzLl9pbnB1dEVsZW1lbnQudmFsdWU7IH1cblxuICAvKiogVGhlIG5hdGl2ZSBpbnB1dCBlbGVtZW50IHRvIHdoaWNoIHRoaXMgZGlyZWN0aXZlIGlzIGF0dGFjaGVkLiAqL1xuICBwcm90ZWN0ZWQgX2lucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgQEluamVjdChNQVRfQ0hJUFNfREVGQVVMVF9PUFRJT05TKSBwcml2YXRlIF9kZWZhdWx0T3B0aW9uczogTWF0Q2hpcHNEZWZhdWx0T3B0aW9ucykge1xuICAgIHRoaXMuX2lucHV0RWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5fY2hpcExpc3Quc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBVdGlsaXR5IG1ldGhvZCB0byBtYWtlIGhvc3QgZGVmaW5pdGlvbi90ZXN0cyBtb3JlIGNsZWFyLiAqL1xuICBfa2V5ZG93bihldmVudD86IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyBBbGxvdyB0aGUgdXNlcidzIGZvY3VzIHRvIGVzY2FwZSB3aGVuIHRoZXkncmUgdGFiYmluZyBmb3J3YXJkLiBOb3RlIHRoYXQgd2UgZG9uJ3RcbiAgICAvLyB3YW50IHRvIGRvIHRoaXMgd2hlbiBnb2luZyBiYWNrd2FyZHMsIGJlY2F1c2UgZm9jdXMgc2hvdWxkIGdvIGJhY2sgdG8gdGhlIGZpcnN0IGNoaXAuXG4gICAgaWYgKGV2ZW50ICYmIGV2ZW50LmtleUNvZGUgPT09IFRBQiAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQsICdzaGlmdEtleScpKSB7XG4gICAgICB0aGlzLl9jaGlwTGlzdC5fYWxsb3dGb2N1c0VzY2FwZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2VtaXRDaGlwRW5kKGV2ZW50KTtcbiAgfVxuXG4gIC8qKiBDaGVja3MgdG8gc2VlIGlmIHRoZSBibHVyIHNob3VsZCBlbWl0IHRoZSAoY2hpcEVuZCkgZXZlbnQuICovXG4gIF9ibHVyKCkge1xuICAgIGlmICh0aGlzLmFkZE9uQmx1cikge1xuICAgICAgdGhpcy5fZW1pdENoaXBFbmQoKTtcbiAgICB9XG4gICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgLy8gQmx1ciB0aGUgY2hpcCBsaXN0IGlmIGl0IGlzIG5vdCBmb2N1c2VkXG4gICAgaWYgKCF0aGlzLl9jaGlwTGlzdC5mb2N1c2VkKSB7XG4gICAgICB0aGlzLl9jaGlwTGlzdC5fYmx1cigpO1xuICAgIH1cbiAgICB0aGlzLl9jaGlwTGlzdC5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgX2ZvY3VzKCkge1xuICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4gICAgdGhpcy5fY2hpcExpc3Quc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBDaGVja3MgdG8gc2VlIGlmIHRoZSAoY2hpcEVuZCkgZXZlbnQgbmVlZHMgdG8gYmUgZW1pdHRlZC4gKi9cbiAgX2VtaXRDaGlwRW5kKGV2ZW50PzogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICghdGhpcy5faW5wdXRFbGVtZW50LnZhbHVlICYmICEhZXZlbnQpIHtcbiAgICAgIHRoaXMuX2NoaXBMaXN0Ll9rZXlkb3duKGV2ZW50KTtcbiAgICB9XG4gICAgaWYgKCFldmVudCB8fCB0aGlzLl9pc1NlcGFyYXRvcktleShldmVudCkpIHtcbiAgICAgIHRoaXMuY2hpcEVuZC5lbWl0KHsgaW5wdXQ6IHRoaXMuX2lucHV0RWxlbWVudCwgdmFsdWU6IHRoaXMuX2lucHV0RWxlbWVudC52YWx1ZSB9KTtcblxuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX29uSW5wdXQoKSB7XG4gICAgLy8gTGV0IGNoaXAgbGlzdCBrbm93IHdoZW5ldmVyIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgIHRoaXMuX2NoaXBMaXN0LnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgaW5wdXQuICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLl9pbnB1dEVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgYSBrZXljb2RlIGlzIG9uZSBvZiB0aGUgY29uZmlndXJlZCBzZXBhcmF0b3JzLiAqL1xuICBwcml2YXRlIF9pc1NlcGFyYXRvcktleShldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBzZXBhcmF0b3JzID0gdGhpcy5zZXBhcmF0b3JLZXlDb2RlcztcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShzZXBhcmF0b3JzKSA/IHNlcGFyYXRvcnMuaW5kZXhPZihrZXlDb2RlKSA+IC0xIDogc2VwYXJhdG9ycy5oYXMoa2V5Q29kZSk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfYWRkT25CbHVyOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19