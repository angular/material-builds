/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BACKSPACE, hasModifierKey, TAB } from '@angular/cdk/keycodes';
import { Directive, ElementRef, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_CHIPS_DEFAULT_OPTIONS } from './chip-default-options';
import { MatChipList } from './chip-list';
// Increasing integer for generating unique ids.
let nextUniqueId = 0;
/**
 * Directive that adds chip-specific behaviors to an input element inside `<mat-form-field>`.
 * May be placed inside or outside of an `<mat-chip-list>`.
 */
export class MatChipInput {
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
        this.inputElement = this._elementRef.nativeElement;
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
    get empty() { return !this.inputElement.value; }
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
            event === null || event === void 0 ? void 0 : event.preventDefault();
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
}
MatChipInput.decorators = [
    { type: Directive, args: [{
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
                }
            },] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy9jaGlwLWlucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxTQUFTLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3JFLE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUdMLE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXlCLHlCQUF5QixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDekYsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQXNCeEMsZ0RBQWdEO0FBQ2hELElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUVyQjs7O0dBR0c7QUFrQkgsTUFBTSxPQUFPLFlBQVk7SUF3RHZCLFlBQ1ksV0FBeUMsRUFDUixlQUF1QztRQUR4RSxnQkFBVyxHQUFYLFdBQVcsQ0FBOEI7UUFDUixvQkFBZSxHQUFmLGVBQWUsQ0FBd0I7UUF0RHBGLHNDQUFzQztRQUN0QyxZQUFPLEdBQVksS0FBSyxDQUFDO1FBa0J6QixlQUFVLEdBQVksS0FBSyxDQUFDO1FBRTVCOzs7O1dBSUc7UUFFSCxzQkFBaUIsR0FDYixJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDO1FBRTNDLDBDQUEwQztRQUUxQyxZQUFPLEdBQW9DLElBQUksWUFBWSxFQUFxQixDQUFDO1FBRWpGLG9DQUFvQztRQUMzQixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUVsQywrQkFBK0I7UUFDdEIsT0FBRSxHQUFXLHVCQUF1QixZQUFZLEVBQUUsRUFBRSxDQUFDO1FBTXRELGNBQVMsR0FBWSxLQUFLLENBQUM7UUFXakMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWlDLENBQUM7SUFDekUsQ0FBQztJQXBERCxtQ0FBbUM7SUFDbkMsSUFDSSxRQUFRLENBQUMsS0FBa0I7UUFDN0IsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7SUFFRDs7T0FFRztJQUNILElBQ0ksU0FBUyxLQUFjLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDcEQsSUFBSSxTQUFTLENBQUMsS0FBYyxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBc0JqRixxQ0FBcUM7SUFDckMsSUFDSSxRQUFRLEtBQWMsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRyxJQUFJLFFBQVEsQ0FBQyxLQUFjLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFHL0Usa0NBQWtDO0lBQ2xDLElBQUksS0FBSyxLQUFjLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFXekQsV0FBVztRQUNULElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzlDLENBQUM7SUFFRCwrREFBK0Q7SUFDL0QsUUFBUSxDQUFDLEtBQXFCO1FBQzVCLElBQUksS0FBSyxFQUFFO1lBQ1Qsb0ZBQW9GO1lBQ3BGLHdGQUF3RjtZQUN4RixJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRTtnQkFDL0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2FBQ3BDO1lBRUQsNkZBQTZGO1lBQzdGLDZGQUE2RjtZQUM3RixtREFBbUQ7WUFDbkQsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMseUJBQXlCLEVBQUU7Z0JBQ2pFLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLENBQUM7Z0JBQy9DLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdkIsT0FBTzthQUNSO2lCQUFNO2dCQUNMLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxLQUFLLENBQUM7YUFDeEM7U0FDRjtRQUVELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLEtBQW9CO1FBQ3pCLG1FQUFtRTtRQUNuRSxJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDaEYsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQztZQUN0QyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQsaUVBQWlFO0lBQ2pFLEtBQUs7UUFDSCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3JCO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsMENBQTBDO1FBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3hCO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQsZ0VBQWdFO0lBQ2hFLFlBQVksQ0FBQyxLQUFxQjtRQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUN2QyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNoQztRQUVELElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDaEIsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUN4QixLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLO2dCQUM5QixTQUFTLEVBQUUsSUFBSTthQUNoQixDQUFDLENBQUM7WUFFSCxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsY0FBYyxHQUFHO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDTixpREFBaUQ7UUFDakQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELHlCQUF5QjtJQUN6QixLQUFLLENBQUMsT0FBc0I7UUFDMUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELHVCQUF1QjtJQUN2QixLQUFLO1FBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUM7SUFDeEMsQ0FBQztJQUVELG9FQUFvRTtJQUM1RCxlQUFlLENBQUMsS0FBb0I7UUFDMUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RGLENBQUM7OztZQXBMRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsUUFBUSxFQUFFLCtCQUErQjtnQkFDekMsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxrQ0FBa0M7b0JBQzNDLFdBQVcsRUFBRSxrQkFBa0I7b0JBQy9CLFNBQVMsRUFBRSxnQkFBZ0I7b0JBQzNCLFFBQVEsRUFBRSxTQUFTO29CQUNuQixTQUFTLEVBQUUsVUFBVTtvQkFDckIsU0FBUyxFQUFFLFlBQVk7b0JBQ3ZCLE1BQU0sRUFBRSxJQUFJO29CQUNaLGlCQUFpQixFQUFFLGtCQUFrQjtvQkFDckMsb0JBQW9CLEVBQUUscUJBQXFCO29CQUMzQyxxQkFBcUIsRUFBRSx1RUFBdUU7b0JBQzlGLHNCQUFzQixFQUFFLHlDQUF5QztpQkFDbEU7YUFDRjs7O1lBdERDLFVBQVU7NENBaUhQLE1BQU0sU0FBQyx5QkFBeUI7Ozt1QkFqRGxDLEtBQUssU0FBQyxpQkFBaUI7d0JBV3ZCLEtBQUssU0FBQyx1QkFBdUI7Z0NBVTdCLEtBQUssU0FBQywrQkFBK0I7c0JBS3JDLE1BQU0sU0FBQyxzQkFBc0I7MEJBSTdCLEtBQUs7aUJBR0wsS0FBSzt1QkFHTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0JBQ0tTUEFDRSwgaGFzTW9kaWZpZXJLZXksIFRBQn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDaGlwc0RlZmF1bHRPcHRpb25zLCBNQVRfQ0hJUFNfREVGQVVMVF9PUFRJT05TfSBmcm9tICcuL2NoaXAtZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7TWF0Q2hpcExpc3R9IGZyb20gJy4vY2hpcC1saXN0JztcbmltcG9ydCB7TWF0Q2hpcFRleHRDb250cm9sfSBmcm9tICcuL2NoaXAtdGV4dC1jb250cm9sJztcblxuLyoqIFJlcHJlc2VudHMgYW4gaW5wdXQgZXZlbnQgb24gYSBgbWF0Q2hpcElucHV0YC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0Q2hpcElucHV0RXZlbnQge1xuICAvKipcbiAgICogVGhlIG5hdGl2ZSBgPGlucHV0PmAgZWxlbWVudCB0aGF0IHRoZSBldmVudCBpcyBiZWluZyBmaXJlZCBmb3IuXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgTWF0Q2hpcElucHV0RXZlbnQjY2hpcElucHV0LmlucHV0RWxlbWVudGAgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMy4wLjAgVGhpcyBwcm9wZXJ0eSB3aWxsIGJlIHJlbW92ZWQuXG4gICAqL1xuICBpbnB1dDogSFRNTElucHV0RWxlbWVudDtcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBpbnB1dC4gKi9cbiAgdmFsdWU6IHN0cmluZztcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHRvIHRoZSBjaGlwIGlucHV0IHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTMuMC4wIFRoaXMgcHJvcGVydHkgd2lsbCBiZSBtYWRlIHJlcXVpcmVkLlxuICAgKi9cbiAgY2hpcElucHV0PzogTWF0Q2hpcElucHV0O1xufVxuXG4vLyBJbmNyZWFzaW5nIGludGVnZXIgZm9yIGdlbmVyYXRpbmcgdW5pcXVlIGlkcy5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG4vKipcbiAqIERpcmVjdGl2ZSB0aGF0IGFkZHMgY2hpcC1zcGVjaWZpYyBiZWhhdmlvcnMgdG8gYW4gaW5wdXQgZWxlbWVudCBpbnNpZGUgYDxtYXQtZm9ybS1maWVsZD5gLlxuICogTWF5IGJlIHBsYWNlZCBpbnNpZGUgb3Igb3V0c2lkZSBvZiBhbiBgPG1hdC1jaGlwLWxpc3Q+YC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbbWF0Q2hpcElucHV0Rm9yXScsXG4gIGV4cG9ydEFzOiAnbWF0Q2hpcElucHV0LCBtYXRDaGlwSW5wdXRGb3InLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jaGlwLWlucHV0IG1hdC1pbnB1dC1lbGVtZW50JyxcbiAgICAnKGtleWRvd24pJzogJ19rZXlkb3duKCRldmVudCknLFxuICAgICcoa2V5dXApJzogJ19rZXl1cCgkZXZlbnQpJyxcbiAgICAnKGJsdXIpJzogJ19ibHVyKCknLFxuICAgICcoZm9jdXMpJzogJ19mb2N1cygpJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgpJyxcbiAgICAnW2lkXSc6ICdpZCcsXG4gICAgJ1thdHRyLmRpc2FibGVkXSc6ICdkaXNhYmxlZCB8fCBudWxsJyxcbiAgICAnW2F0dHIucGxhY2Vob2xkZXJdJzogJ3BsYWNlaG9sZGVyIHx8IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWludmFsaWRdJzogJ19jaGlwTGlzdCAmJiBfY2hpcExpc3QubmdDb250cm9sID8gX2NoaXBMaXN0Lm5nQ29udHJvbC5pbnZhbGlkIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ19jaGlwTGlzdCAmJiBfY2hpcExpc3QucmVxdWlyZWQgfHwgbnVsbCcsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcElucHV0IGltcGxlbWVudHMgTWF0Q2hpcFRleHRDb250cm9sLCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIC8qKiBVc2VkIHRvIHByZXZlbnQgZm9jdXMgbW92aW5nIHRvIGNoaXBzIHdoaWxlIHVzZXIgaXMgaG9sZGluZyBiYWNrc3BhY2UgKi9cbiAgcHJpdmF0ZSBfZm9jdXNMYXN0Q2hpcE9uQmFja3NwYWNlOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250cm9sIGlzIGZvY3VzZWQuICovXG4gIGZvY3VzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgX2NoaXBMaXN0OiBNYXRDaGlwTGlzdDtcblxuICAvKiogUmVnaXN0ZXIgaW5wdXQgZm9yIGNoaXAgbGlzdCAqL1xuICBASW5wdXQoJ21hdENoaXBJbnB1dEZvcicpXG4gIHNldCBjaGlwTGlzdCh2YWx1ZTogTWF0Q2hpcExpc3QpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuX2NoaXBMaXN0ID0gdmFsdWU7XG4gICAgICB0aGlzLl9jaGlwTGlzdC5yZWdpc3RlcklucHV0KHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgY2hpcEVuZCBldmVudCB3aWxsIGJlIGVtaXR0ZWQgd2hlbiB0aGUgaW5wdXQgaXMgYmx1cnJlZC5cbiAgICovXG4gIEBJbnB1dCgnbWF0Q2hpcElucHV0QWRkT25CbHVyJylcbiAgZ2V0IGFkZE9uQmx1cigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2FkZE9uQmx1cjsgfVxuICBzZXQgYWRkT25CbHVyKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2FkZE9uQmx1ciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgX2FkZE9uQmx1cjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiBrZXkgY29kZXMgdGhhdCB3aWxsIHRyaWdnZXIgYSBjaGlwRW5kIGV2ZW50LlxuICAgKlxuICAgKiBEZWZhdWx0cyB0byBgW0VOVEVSXWAuXG4gICAqL1xuICBASW5wdXQoJ21hdENoaXBJbnB1dFNlcGFyYXRvcktleUNvZGVzJylcbiAgc2VwYXJhdG9yS2V5Q29kZXM6IHJlYWRvbmx5IG51bWJlcltdIHwgUmVhZG9ubHlTZXQ8bnVtYmVyPiA9XG4gICAgICB0aGlzLl9kZWZhdWx0T3B0aW9ucy5zZXBhcmF0b3JLZXlDb2RlcztcblxuICAvKiogRW1pdHRlZCB3aGVuIGEgY2hpcCBpcyB0byBiZSBhZGRlZC4gKi9cbiAgQE91dHB1dCgnbWF0Q2hpcElucHV0VG9rZW5FbmQnKVxuICBjaGlwRW5kOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcElucHV0RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRDaGlwSW5wdXRFdmVudD4oKTtcblxuICAvKiogVGhlIGlucHV0J3MgcGxhY2Vob2xkZXIgdGV4dC4gKi9cbiAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoZSBpbnB1dC4gKi9cbiAgQElucHV0KCkgaWQ6IHN0cmluZyA9IGBtYXQtY2hpcC1saXN0LWlucHV0LSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVkIHx8ICh0aGlzLl9jaGlwTGlzdCAmJiB0aGlzLl9jaGlwTGlzdC5kaXNhYmxlZCk7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBlbXB0eS4gKi9cbiAgZ2V0IGVtcHR5KCk6IGJvb2xlYW4geyByZXR1cm4gIXRoaXMuaW5wdXRFbGVtZW50LnZhbHVlOyB9XG5cbiAgLyoqIFRoZSBuYXRpdmUgaW5wdXQgZWxlbWVudCB0byB3aGljaCB0aGlzIGRpcmVjdGl2ZSBpcyBhdHRhY2hlZC4gKi9cbiAgcmVhZG9ubHkgaW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBASW5qZWN0KE1BVF9DSElQU19ERUZBVUxUX09QVElPTlMpIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zOiBNYXRDaGlwc0RlZmF1bHRPcHRpb25zKSB7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMuX2NoaXBMaXN0LnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmNoaXBFbmQuY29tcGxldGUoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9mb2N1c0xhc3RDaGlwT25CYWNrc3BhY2UgPSB0aGlzLmVtcHR5O1xuICB9XG5cbiAgLyoqIFV0aWxpdHkgbWV0aG9kIHRvIG1ha2UgaG9zdCBkZWZpbml0aW9uL3Rlc3RzIG1vcmUgY2xlYXIuICovXG4gIF9rZXlkb3duKGV2ZW50PzogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChldmVudCkge1xuICAgICAgLy8gQWxsb3cgdGhlIHVzZXIncyBmb2N1cyB0byBlc2NhcGUgd2hlbiB0aGV5J3JlIHRhYmJpbmcgZm9yd2FyZC4gTm90ZSB0aGF0IHdlIGRvbid0XG4gICAgICAvLyB3YW50IHRvIGRvIHRoaXMgd2hlbiBnb2luZyBiYWNrd2FyZHMsIGJlY2F1c2UgZm9jdXMgc2hvdWxkIGdvIGJhY2sgdG8gdGhlIGZpcnN0IGNoaXAuXG4gICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gVEFCICYmICFoYXNNb2RpZmllcktleShldmVudCwgJ3NoaWZ0S2V5JykpIHtcbiAgICAgICAgdGhpcy5fY2hpcExpc3QuX2FsbG93Rm9jdXNFc2NhcGUoKTtcbiAgICAgIH1cblxuICAgICAgLy8gVG8gcHJldmVudCB0aGUgdXNlciBmcm9tIGFjY2lkZW50YWxseSBkZWxldGluZyBjaGlwcyB3aGVuIHByZXNzaW5nIEJBQ0tTUEFDRSBjb250aW51b3VzbHksXG4gICAgICAvLyBXZSBmb2N1cyB0aGUgbGFzdCBjaGlwIG9uIGJhY2tzcGFjZSBvbmx5IGFmdGVyIHRoZSB1c2VyIGhhcyByZWxlYXNlZCB0aGUgYmFja3NwYWNlIGJ1dHRvbixcbiAgICAgIC8vIGFuZCB0aGUgaW5wdXQgaXMgZW1wdHkgKHNlZSBiZWhhdmlvdXIgaW4gX2tleXVwKVxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEJBQ0tTUEFDRSAmJiB0aGlzLl9mb2N1c0xhc3RDaGlwT25CYWNrc3BhY2UpIHtcbiAgICAgICAgdGhpcy5fY2hpcExpc3QuX2tleU1hbmFnZXIuc2V0TGFzdEl0ZW1BY3RpdmUoKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZm9jdXNMYXN0Q2hpcE9uQmFja3NwYWNlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fZW1pdENoaXBFbmQoZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhc3MgZXZlbnRzIHRvIHRoZSBrZXlib2FyZCBtYW5hZ2VyLiBBdmFpbGFibGUgaGVyZSBmb3IgdGVzdHMuXG4gICAqL1xuICBfa2V5dXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyBBbGxvdyB1c2VyIHRvIG1vdmUgZm9jdXMgdG8gY2hpcHMgbmV4dCB0aW1lIGhlIHByZXNzZXMgYmFja3NwYWNlXG4gICAgaWYgKCF0aGlzLl9mb2N1c0xhc3RDaGlwT25CYWNrc3BhY2UgJiYgZXZlbnQua2V5Q29kZSA9PT0gQkFDS1NQQUNFICYmIHRoaXMuZW1wdHkpIHtcbiAgICAgIHRoaXMuX2ZvY3VzTGFzdENoaXBPbkJhY2tzcGFjZSA9IHRydWU7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDaGVja3MgdG8gc2VlIGlmIHRoZSBibHVyIHNob3VsZCBlbWl0IHRoZSAoY2hpcEVuZCkgZXZlbnQuICovXG4gIF9ibHVyKCkge1xuICAgIGlmICh0aGlzLmFkZE9uQmx1cikge1xuICAgICAgdGhpcy5fZW1pdENoaXBFbmQoKTtcbiAgICB9XG4gICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgLy8gQmx1ciB0aGUgY2hpcCBsaXN0IGlmIGl0IGlzIG5vdCBmb2N1c2VkXG4gICAgaWYgKCF0aGlzLl9jaGlwTGlzdC5mb2N1c2VkKSB7XG4gICAgICB0aGlzLl9jaGlwTGlzdC5fYmx1cigpO1xuICAgIH1cbiAgICB0aGlzLl9jaGlwTGlzdC5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgX2ZvY3VzKCkge1xuICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4gICAgdGhpcy5fY2hpcExpc3Quc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBDaGVja3MgdG8gc2VlIGlmIHRoZSAoY2hpcEVuZCkgZXZlbnQgbmVlZHMgdG8gYmUgZW1pdHRlZC4gKi9cbiAgX2VtaXRDaGlwRW5kKGV2ZW50PzogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICghdGhpcy5pbnB1dEVsZW1lbnQudmFsdWUgJiYgISFldmVudCkge1xuICAgICAgdGhpcy5fY2hpcExpc3QuX2tleWRvd24oZXZlbnQpO1xuICAgIH1cblxuICAgIGlmICghZXZlbnQgfHwgdGhpcy5faXNTZXBhcmF0b3JLZXkoZXZlbnQpKSB7XG4gICAgICB0aGlzLmNoaXBFbmQuZW1pdCh7XG4gICAgICAgIGlucHV0OiB0aGlzLmlucHV0RWxlbWVudCxcbiAgICAgICAgdmFsdWU6IHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlLFxuICAgICAgICBjaGlwSW5wdXQ6IHRoaXMsXG4gICAgICB9KTtcblxuICAgICAgZXZlbnQ/LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgX29uSW5wdXQoKSB7XG4gICAgLy8gTGV0IGNoaXAgbGlzdCBrbm93IHdoZW5ldmVyIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgIHRoaXMuX2NoaXBMaXN0LnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgaW5wdXQuICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmlucHV0RWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBDbGVhcnMgdGhlIGlucHV0ICovXG4gIGNsZWFyKCk6IHZvaWQge1xuICAgIHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgdGhpcy5fZm9jdXNMYXN0Q2hpcE9uQmFja3NwYWNlID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciBhIGtleWNvZGUgaXMgb25lIG9mIHRoZSBjb25maWd1cmVkIHNlcGFyYXRvcnMuICovXG4gIHByaXZhdGUgX2lzU2VwYXJhdG9yS2V5KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgcmV0dXJuICFoYXNNb2RpZmllcktleShldmVudCkgJiYgbmV3IFNldCh0aGlzLnNlcGFyYXRvcktleUNvZGVzKS5oYXMoZXZlbnQua2V5Q29kZSk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfYWRkT25CbHVyOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19