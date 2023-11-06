/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Inject, Input, booleanAttribute, numberAttribute, } from '@angular/core';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { MAT_CHIP } from './tokens';
import * as i0 from "@angular/core";
/**
 * Section within a chip.
 * @docs-private
 */
export class MatChipAction {
    /** Whether the action is disabled. */
    get disabled() {
        return this._disabled || this._parentChip.disabled;
    }
    set disabled(value) {
        this._disabled = value;
    }
    /**
     * Determine the value of the disabled attribute for this chip action.
     */
    _getDisabledAttribute() {
        // When this chip action is disabled and focusing disabled chips is not permitted, return empty
        // string to indicate that disabled attribute should be included.
        return this.disabled && !this._allowFocusWhenDisabled ? '' : null;
    }
    /**
     * Determine the value of the tabindex attribute for this chip action.
     */
    _getTabindex() {
        return (this.disabled && !this._allowFocusWhenDisabled) || !this.isInteractive
            ? null
            : this.tabIndex.toString();
    }
    constructor(_elementRef, _parentChip) {
        this._elementRef = _elementRef;
        this._parentChip = _parentChip;
        /** Whether the action is interactive. */
        this.isInteractive = true;
        /** Whether this is the primary action in the chip. */
        this._isPrimary = true;
        this._disabled = false;
        /** Tab index of the action. */
        this.tabIndex = -1;
        /**
         * Private API to allow focusing this chip when it is disabled.
         */
        this._allowFocusWhenDisabled = false;
        if (_elementRef.nativeElement.nodeName === 'BUTTON') {
            _elementRef.nativeElement.setAttribute('type', 'button');
        }
    }
    focus() {
        this._elementRef.nativeElement.focus();
    }
    _handleClick(event) {
        if (!this.disabled && this.isInteractive && this._isPrimary) {
            event.preventDefault();
            this._parentChip._handlePrimaryActionInteraction();
        }
    }
    _handleKeydown(event) {
        if ((event.keyCode === ENTER || event.keyCode === SPACE) &&
            !this.disabled &&
            this.isInteractive &&
            this._isPrimary &&
            !this._parentChip._isEditing) {
            event.preventDefault();
            this._parentChip._handlePrimaryActionInteraction();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0-rc.2", ngImport: i0, type: MatChipAction, deps: [{ token: i0.ElementRef }, { token: MAT_CHIP }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.0.0-rc.2", type: MatChipAction, selector: "[matChipAction]", inputs: { isInteractive: "isInteractive", disabled: ["disabled", "disabled", booleanAttribute], tabIndex: ["tabIndex", "tabIndex", (value) => (value == null ? -1 : numberAttribute(value))], _allowFocusWhenDisabled: "_allowFocusWhenDisabled" }, host: { listeners: { "click": "_handleClick($event)", "keydown": "_handleKeydown($event)" }, properties: { "class.mdc-evolution-chip__action--primary": "_isPrimary", "class.mdc-evolution-chip__action--presentational": "!isInteractive", "class.mdc-evolution-chip__action--trailing": "!_isPrimary", "attr.tabindex": "_getTabindex()", "attr.disabled": "_getDisabledAttribute()", "attr.aria-disabled": "disabled" }, classAttribute: "mdc-evolution-chip__action mat-mdc-chip-action" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0-rc.2", ngImport: i0, type: MatChipAction, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matChipAction]',
                    host: {
                        'class': 'mdc-evolution-chip__action mat-mdc-chip-action',
                        '[class.mdc-evolution-chip__action--primary]': '_isPrimary',
                        '[class.mdc-evolution-chip__action--presentational]': '!isInteractive',
                        '[class.mdc-evolution-chip__action--trailing]': '!_isPrimary',
                        '[attr.tabindex]': '_getTabindex()',
                        '[attr.disabled]': '_getDisabledAttribute()',
                        '[attr.aria-disabled]': 'disabled',
                        '(click)': '_handleClick($event)',
                        '(keydown)': '_handleKeydown($event)',
                    },
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_CHIP]
                }] }], propDecorators: { isInteractive: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], tabIndex: [{
                type: Input,
                args: [{
                        transform: (value) => (value == null ? -1 : numberAttribute(value)),
                    }]
            }], _allowFocusWhenDisabled: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hpcHMvY2hpcC1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxnQkFBZ0IsRUFDaEIsZUFBZSxHQUNoQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxVQUFVLENBQUM7O0FBRWxDOzs7R0FHRztBQWVILE1BQU0sT0FBTyxhQUFhO0lBT3hCLHNDQUFzQztJQUN0QyxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7SUFDckQsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLEtBQWM7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQWVEOztPQUVHO0lBQ08scUJBQXFCO1FBQzdCLCtGQUErRjtRQUMvRixpRUFBaUU7UUFDakUsT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNwRSxDQUFDO0lBRUQ7O09BRUc7SUFDTyxZQUFZO1FBQ3BCLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYTtZQUM1RSxDQUFDLENBQUMsSUFBSTtZQUNOLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRCxZQUNTLFdBQW9DLEVBRWpDLFdBS1Q7UUFQTSxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFFakMsZ0JBQVcsR0FBWCxXQUFXLENBS3BCO1FBdERILHlDQUF5QztRQUNoQyxrQkFBYSxHQUFHLElBQUksQ0FBQztRQUU5QixzREFBc0Q7UUFDdEQsZUFBVSxHQUFHLElBQUksQ0FBQztRQVVWLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFMUIsK0JBQStCO1FBSS9CLGFBQVEsR0FBVyxDQUFDLENBQUMsQ0FBQztRQUV0Qjs7V0FFRztRQUVLLDRCQUF1QixHQUFHLEtBQUssQ0FBQztRQThCdEMsSUFBSSxXQUFXLENBQUMsYUFBYSxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDbkQsV0FBVyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQzFEO0lBQ0gsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQWlCO1FBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUMzRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQywrQkFBK0IsRUFBRSxDQUFDO1NBQ3BEO0lBQ0gsQ0FBQztJQUVELGNBQWMsQ0FBQyxLQUFvQjtRQUNqQyxJQUNFLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUM7WUFDcEQsQ0FBQyxJQUFJLENBQUMsUUFBUTtZQUNkLElBQUksQ0FBQyxhQUFhO1lBQ2xCLElBQUksQ0FBQyxVQUFVO1lBQ2YsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFDNUI7WUFDQSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQywrQkFBK0IsRUFBRSxDQUFDO1NBQ3BEO0lBQ0gsQ0FBQzttSEFwRlUsYUFBYSw0Q0FpRGQsUUFBUTt1R0FqRFAsYUFBYSw0R0FRTCxnQkFBZ0Isc0NBV3RCLENBQUMsS0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7O2dHQW5CbkUsYUFBYTtrQkFkekIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLGdEQUFnRDt3QkFDekQsNkNBQTZDLEVBQUUsWUFBWTt3QkFDM0Qsb0RBQW9ELEVBQUUsZ0JBQWdCO3dCQUN0RSw4Q0FBOEMsRUFBRSxhQUFhO3dCQUM3RCxpQkFBaUIsRUFBRSxnQkFBZ0I7d0JBQ25DLGlCQUFpQixFQUFFLHlCQUF5Qjt3QkFDNUMsc0JBQXNCLEVBQUUsVUFBVTt3QkFDbEMsU0FBUyxFQUFFLHNCQUFzQjt3QkFDakMsV0FBVyxFQUFFLHdCQUF3QjtxQkFDdEM7aUJBQ0Y7OzBCQWtESSxNQUFNOzJCQUFDLFFBQVE7eUNBL0NULGFBQWE7c0JBQXJCLEtBQUs7Z0JBT0YsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFDO2dCQWFwQyxRQUFRO3NCQUhQLEtBQUs7dUJBQUM7d0JBQ0wsU0FBUyxFQUFFLENBQUMsS0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQzdFO2dCQU9PLHVCQUF1QjtzQkFEOUIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG4gIG51bWJlckF0dHJpYnV0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0VOVEVSLCBTUEFDRX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7TUFUX0NISVB9IGZyb20gJy4vdG9rZW5zJztcblxuLyoqXG4gKiBTZWN0aW9uIHdpdGhpbiBhIGNoaXAuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRDaGlwQWN0aW9uXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWRjLWV2b2x1dGlvbi1jaGlwX19hY3Rpb24gbWF0LW1kYy1jaGlwLWFjdGlvbicsXG4gICAgJ1tjbGFzcy5tZGMtZXZvbHV0aW9uLWNoaXBfX2FjdGlvbi0tcHJpbWFyeV0nOiAnX2lzUHJpbWFyeScsXG4gICAgJ1tjbGFzcy5tZGMtZXZvbHV0aW9uLWNoaXBfX2FjdGlvbi0tcHJlc2VudGF0aW9uYWxdJzogJyFpc0ludGVyYWN0aXZlJyxcbiAgICAnW2NsYXNzLm1kYy1ldm9sdXRpb24tY2hpcF9fYWN0aW9uLS10cmFpbGluZ10nOiAnIV9pc1ByaW1hcnknLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnX2dldFRhYmluZGV4KCknLFxuICAgICdbYXR0ci5kaXNhYmxlZF0nOiAnX2dldERpc2FibGVkQXR0cmlidXRlKCknLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCRldmVudCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXBBY3Rpb24ge1xuICAvKiogV2hldGhlciB0aGUgYWN0aW9uIGlzIGludGVyYWN0aXZlLiAqL1xuICBASW5wdXQoKSBpc0ludGVyYWN0aXZlID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGlzIGlzIHRoZSBwcmltYXJ5IGFjdGlvbiBpbiB0aGUgY2hpcC4gKi9cbiAgX2lzUHJpbWFyeSA9IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFjdGlvbiBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkIHx8IHRoaXMuX3BhcmVudENoaXAuZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKiBUYWIgaW5kZXggb2YgdGhlIGFjdGlvbi4gKi9cbiAgQElucHV0KHtcbiAgICB0cmFuc2Zvcm06ICh2YWx1ZTogdW5rbm93bikgPT4gKHZhbHVlID09IG51bGwgPyAtMSA6IG51bWJlckF0dHJpYnV0ZSh2YWx1ZSkpLFxuICB9KVxuICB0YWJJbmRleDogbnVtYmVyID0gLTE7XG5cbiAgLyoqXG4gICAqIFByaXZhdGUgQVBJIHRvIGFsbG93IGZvY3VzaW5nIHRoaXMgY2hpcCB3aGVuIGl0IGlzIGRpc2FibGVkLlxuICAgKi9cbiAgQElucHV0KClcbiAgcHJpdmF0ZSBfYWxsb3dGb2N1c1doZW5EaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIHZhbHVlIG9mIHRoZSBkaXNhYmxlZCBhdHRyaWJ1dGUgZm9yIHRoaXMgY2hpcCBhY3Rpb24uXG4gICAqL1xuICBwcm90ZWN0ZWQgX2dldERpc2FibGVkQXR0cmlidXRlKCk6IHN0cmluZyB8IG51bGwge1xuICAgIC8vIFdoZW4gdGhpcyBjaGlwIGFjdGlvbiBpcyBkaXNhYmxlZCBhbmQgZm9jdXNpbmcgZGlzYWJsZWQgY2hpcHMgaXMgbm90IHBlcm1pdHRlZCwgcmV0dXJuIGVtcHR5XG4gICAgLy8gc3RyaW5nIHRvIGluZGljYXRlIHRoYXQgZGlzYWJsZWQgYXR0cmlidXRlIHNob3VsZCBiZSBpbmNsdWRlZC5cbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5fYWxsb3dGb2N1c1doZW5EaXNhYmxlZCA/ICcnIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIHZhbHVlIG9mIHRoZSB0YWJpbmRleCBhdHRyaWJ1dGUgZm9yIHRoaXMgY2hpcCBhY3Rpb24uXG4gICAqL1xuICBwcm90ZWN0ZWQgX2dldFRhYmluZGV4KCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiAodGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5fYWxsb3dGb2N1c1doZW5EaXNhYmxlZCkgfHwgIXRoaXMuaXNJbnRlcmFjdGl2ZVxuICAgICAgPyBudWxsXG4gICAgICA6IHRoaXMudGFiSW5kZXgudG9TdHJpbmcoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQEluamVjdChNQVRfQ0hJUClcbiAgICBwcm90ZWN0ZWQgX3BhcmVudENoaXA6IHtcbiAgICAgIF9oYW5kbGVQcmltYXJ5QWN0aW9uSW50ZXJhY3Rpb24oKTogdm9pZDtcbiAgICAgIHJlbW92ZSgpOiB2b2lkO1xuICAgICAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgICBfaXNFZGl0aW5nPzogYm9vbGVhbjtcbiAgICB9LFxuICApIHtcbiAgICBpZiAoX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ub2RlTmFtZSA9PT0gJ0JVVFRPTicpIHtcbiAgICAgIF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpO1xuICAgIH1cbiAgfVxuXG4gIGZvY3VzKCkge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgX2hhbmRsZUNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkICYmIHRoaXMuaXNJbnRlcmFjdGl2ZSAmJiB0aGlzLl9pc1ByaW1hcnkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLl9wYXJlbnRDaGlwLl9oYW5kbGVQcmltYXJ5QWN0aW9uSW50ZXJhY3Rpb24oKTtcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChcbiAgICAgIChldmVudC5rZXlDb2RlID09PSBFTlRFUiB8fCBldmVudC5rZXlDb2RlID09PSBTUEFDRSkgJiZcbiAgICAgICF0aGlzLmRpc2FibGVkICYmXG4gICAgICB0aGlzLmlzSW50ZXJhY3RpdmUgJiZcbiAgICAgIHRoaXMuX2lzUHJpbWFyeSAmJlxuICAgICAgIXRoaXMuX3BhcmVudENoaXAuX2lzRWRpdGluZ1xuICAgICkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuX3BhcmVudENoaXAuX2hhbmRsZVByaW1hcnlBY3Rpb25JbnRlcmFjdGlvbigpO1xuICAgIH1cbiAgfVxufVxuIl19