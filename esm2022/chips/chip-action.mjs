/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Directive, ElementRef, Inject, Input } from '@angular/core';
import { mixinTabIndex } from '@angular/material/core';
import { MAT_CHIP } from './tokens';
import * as i0 from "@angular/core";
class _MatChipActionBase {
}
const _MatChipActionMixinBase = mixinTabIndex(_MatChipActionBase, -1);
/**
 * Section within a chip.
 * @docs-private
 */
class MatChipAction extends _MatChipActionMixinBase {
    /** Whether the action is disabled. */
    get disabled() {
        return this._disabled || this._parentChip.disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
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
        super();
        this._elementRef = _elementRef;
        this._parentChip = _parentChip;
        /** Whether the action is interactive. */
        this.isInteractive = true;
        /** Whether this is the primary action in the chip. */
        this._isPrimary = true;
        this._disabled = false;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatChipAction, deps: [{ token: i0.ElementRef }, { token: MAT_CHIP }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatChipAction, selector: "[matChipAction]", inputs: { disabled: "disabled", tabIndex: "tabIndex", isInteractive: "isInteractive", _allowFocusWhenDisabled: "_allowFocusWhenDisabled" }, host: { listeners: { "click": "_handleClick($event)", "keydown": "_handleKeydown($event)" }, properties: { "class.mdc-evolution-chip__action--primary": "_isPrimary", "class.mdc-evolution-chip__action--presentational": "!isInteractive", "class.mdc-evolution-chip__action--trailing": "!_isPrimary", "attr.tabindex": "_getTabindex()", "attr.disabled": "_getDisabledAttribute()", "attr.aria-disabled": "disabled" }, classAttribute: "mdc-evolution-chip__action mat-mdc-chip-action" }, usesInheritance: true, ngImport: i0 }); }
}
export { MatChipAction };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatChipAction, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matChipAction]',
                    inputs: ['disabled', 'tabIndex'],
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
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_CHIP]
                }] }]; }, propDecorators: { isInteractive: [{
                type: Input
            }], disabled: [{
                type: Input
            }], _allowFocusWhenDisabled: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hpcHMvY2hpcC1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25FLE9BQU8sRUFBYyxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNsRSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sVUFBVSxDQUFDOztBQUVsQyxNQUFlLGtCQUFrQjtDQUVoQztBQUVELE1BQU0sdUJBQXVCLEdBQUcsYUFBYSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFdEU7OztHQUdHO0FBQ0gsTUFlYSxhQUFjLFNBQVEsdUJBQXVCO0lBT3hELHNDQUFzQztJQUN0QyxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7SUFDckQsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLEtBQW1CO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQVNEOztPQUVHO0lBQ08scUJBQXFCO1FBQzdCLCtGQUErRjtRQUMvRixpRUFBaUU7UUFDakUsT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNwRSxDQUFDO0lBRUQ7O09BRUc7SUFDTyxZQUFZO1FBQ3BCLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYTtZQUM1RSxDQUFDLENBQUMsSUFBSTtZQUNOLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRCxZQUNTLFdBQW9DLEVBRWpDLFdBS1Q7UUFFRCxLQUFLLEVBQUUsQ0FBQztRQVRELGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUVqQyxnQkFBVyxHQUFYLFdBQVcsQ0FLcEI7UUFoREgseUNBQXlDO1FBQ2hDLGtCQUFhLEdBQUcsSUFBSSxDQUFDO1FBRTlCLHNEQUFzRDtRQUN0RCxlQUFVLEdBQUcsSUFBSSxDQUFDO1FBVVYsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUUxQjs7V0FFRztRQUVLLDRCQUF1QixHQUFHLEtBQUssQ0FBQztRQWdDdEMsSUFBSSxXQUFXLENBQUMsYUFBYSxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDbkQsV0FBVyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQzFEO0lBQ0gsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQWlCO1FBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUMzRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQywrQkFBK0IsRUFBRSxDQUFDO1NBQ3BEO0lBQ0gsQ0FBQztJQUVELGNBQWMsQ0FBQyxLQUFvQjtRQUNqQyxJQUNFLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUM7WUFDcEQsQ0FBQyxJQUFJLENBQUMsUUFBUTtZQUNkLElBQUksQ0FBQyxhQUFhO1lBQ2xCLElBQUksQ0FBQyxVQUFVO1lBQ2YsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFDNUI7WUFDQSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQywrQkFBK0IsRUFBRSxDQUFDO1NBQ3BEO0lBQ0gsQ0FBQzs4R0FoRlUsYUFBYSw0Q0EyQ2QsUUFBUTtrR0EzQ1AsYUFBYTs7U0FBYixhQUFhOzJGQUFiLGFBQWE7a0JBZnpCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsTUFBTSxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztvQkFDaEMsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxnREFBZ0Q7d0JBQ3pELDZDQUE2QyxFQUFFLFlBQVk7d0JBQzNELG9EQUFvRCxFQUFFLGdCQUFnQjt3QkFDdEUsOENBQThDLEVBQUUsYUFBYTt3QkFDN0QsaUJBQWlCLEVBQUUsZ0JBQWdCO3dCQUNuQyxpQkFBaUIsRUFBRSx5QkFBeUI7d0JBQzVDLHNCQUFzQixFQUFFLFVBQVU7d0JBQ2xDLFNBQVMsRUFBRSxzQkFBc0I7d0JBQ2pDLFdBQVcsRUFBRSx3QkFBd0I7cUJBQ3RDO2lCQUNGOzswQkE0Q0ksTUFBTTsyQkFBQyxRQUFROzRDQXpDVCxhQUFhO3NCQUFyQixLQUFLO2dCQU9GLFFBQVE7c0JBRFgsS0FBSztnQkFhRSx1QkFBdUI7c0JBRDlCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RU5URVIsIFNQQUNFfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdCwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIYXNUYWJJbmRleCwgbWl4aW5UYWJJbmRleH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01BVF9DSElQfSBmcm9tICcuL3Rva2Vucyc7XG5cbmFic3RyYWN0IGNsYXNzIF9NYXRDaGlwQWN0aW9uQmFzZSB7XG4gIGFic3RyYWN0IGRpc2FibGVkOiBib29sZWFuO1xufVxuXG5jb25zdCBfTWF0Q2hpcEFjdGlvbk1peGluQmFzZSA9IG1peGluVGFiSW5kZXgoX01hdENoaXBBY3Rpb25CYXNlLCAtMSk7XG5cbi8qKlxuICogU2VjdGlvbiB3aXRoaW4gYSBjaGlwLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0Q2hpcEFjdGlvbl0nLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAndGFiSW5kZXgnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtZGMtZXZvbHV0aW9uLWNoaXBfX2FjdGlvbiBtYXQtbWRjLWNoaXAtYWN0aW9uJyxcbiAgICAnW2NsYXNzLm1kYy1ldm9sdXRpb24tY2hpcF9fYWN0aW9uLS1wcmltYXJ5XSc6ICdfaXNQcmltYXJ5JyxcbiAgICAnW2NsYXNzLm1kYy1ldm9sdXRpb24tY2hpcF9fYWN0aW9uLS1wcmVzZW50YXRpb25hbF0nOiAnIWlzSW50ZXJhY3RpdmUnLFxuICAgICdbY2xhc3MubWRjLWV2b2x1dGlvbi1jaGlwX19hY3Rpb24tLXRyYWlsaW5nXSc6ICchX2lzUHJpbWFyeScsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdfZ2V0VGFiaW5kZXgoKScsXG4gICAgJ1thdHRyLmRpc2FibGVkXSc6ICdfZ2V0RGlzYWJsZWRBdHRyaWJ1dGUoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soJGV2ZW50KScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcEFjdGlvbiBleHRlbmRzIF9NYXRDaGlwQWN0aW9uTWl4aW5CYXNlIGltcGxlbWVudHMgSGFzVGFiSW5kZXgge1xuICAvKiogV2hldGhlciB0aGUgYWN0aW9uIGlzIGludGVyYWN0aXZlLiAqL1xuICBASW5wdXQoKSBpc0ludGVyYWN0aXZlID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGlzIGlzIHRoZSBwcmltYXJ5IGFjdGlvbiBpbiB0aGUgY2hpcC4gKi9cbiAgX2lzUHJpbWFyeSA9IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFjdGlvbiBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZCB8fCB0aGlzLl9wYXJlbnRDaGlwLmRpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFByaXZhdGUgQVBJIHRvIGFsbG93IGZvY3VzaW5nIHRoaXMgY2hpcCB3aGVuIGl0IGlzIGRpc2FibGVkLlxuICAgKi9cbiAgQElucHV0KClcbiAgcHJpdmF0ZSBfYWxsb3dGb2N1c1doZW5EaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIHZhbHVlIG9mIHRoZSBkaXNhYmxlZCBhdHRyaWJ1dGUgZm9yIHRoaXMgY2hpcCBhY3Rpb24uXG4gICAqL1xuICBwcm90ZWN0ZWQgX2dldERpc2FibGVkQXR0cmlidXRlKCk6IHN0cmluZyB8IG51bGwge1xuICAgIC8vIFdoZW4gdGhpcyBjaGlwIGFjdGlvbiBpcyBkaXNhYmxlZCBhbmQgZm9jdXNpbmcgZGlzYWJsZWQgY2hpcHMgaXMgbm90IHBlcm1pdHRlZCwgcmV0dXJuIGVtcHR5XG4gICAgLy8gc3RyaW5nIHRvIGluZGljYXRlIHRoYXQgZGlzYWJsZWQgYXR0cmlidXRlIHNob3VsZCBiZSBpbmNsdWRlZC5cbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5fYWxsb3dGb2N1c1doZW5EaXNhYmxlZCA/ICcnIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIHZhbHVlIG9mIHRoZSB0YWJpbmRleCBhdHRyaWJ1dGUgZm9yIHRoaXMgY2hpcCBhY3Rpb24uXG4gICAqL1xuICBwcm90ZWN0ZWQgX2dldFRhYmluZGV4KCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiAodGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5fYWxsb3dGb2N1c1doZW5EaXNhYmxlZCkgfHwgIXRoaXMuaXNJbnRlcmFjdGl2ZVxuICAgICAgPyBudWxsXG4gICAgICA6IHRoaXMudGFiSW5kZXgudG9TdHJpbmcoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQEluamVjdChNQVRfQ0hJUClcbiAgICBwcm90ZWN0ZWQgX3BhcmVudENoaXA6IHtcbiAgICAgIF9oYW5kbGVQcmltYXJ5QWN0aW9uSW50ZXJhY3Rpb24oKTogdm9pZDtcbiAgICAgIHJlbW92ZSgpOiB2b2lkO1xuICAgICAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgICBfaXNFZGl0aW5nPzogYm9vbGVhbjtcbiAgICB9LFxuICApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQubm9kZU5hbWUgPT09ICdCVVRUT04nKSB7XG4gICAgICBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcbiAgICB9XG4gIH1cblxuICBmb2N1cygpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIF9oYW5kbGVDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiB0aGlzLmlzSW50ZXJhY3RpdmUgJiYgdGhpcy5faXNQcmltYXJ5KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5fcGFyZW50Q2hpcC5faGFuZGxlUHJpbWFyeUFjdGlvbkludGVyYWN0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoXG4gICAgICAoZXZlbnQua2V5Q29kZSA9PT0gRU5URVIgfHwgZXZlbnQua2V5Q29kZSA9PT0gU1BBQ0UpICYmXG4gICAgICAhdGhpcy5kaXNhYmxlZCAmJlxuICAgICAgdGhpcy5pc0ludGVyYWN0aXZlICYmXG4gICAgICB0aGlzLl9pc1ByaW1hcnkgJiZcbiAgICAgICF0aGlzLl9wYXJlbnRDaGlwLl9pc0VkaXRpbmdcbiAgICApIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLl9wYXJlbnRDaGlwLl9oYW5kbGVQcmltYXJ5QWN0aW9uSW50ZXJhY3Rpb24oKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==