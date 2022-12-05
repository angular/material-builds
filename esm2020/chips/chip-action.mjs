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
export class MatChipAction extends _MatChipActionMixinBase {
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
            this._isPrimary) {
            event.preventDefault();
            this._parentChip._handlePrimaryActionInteraction();
        }
    }
}
MatChipAction.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatChipAction, deps: [{ token: i0.ElementRef }, { token: MAT_CHIP }], target: i0.ɵɵFactoryTarget.Directive });
MatChipAction.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: MatChipAction, selector: "[matChipAction]", inputs: { disabled: "disabled", tabIndex: "tabIndex", isInteractive: "isInteractive", _allowFocusWhenDisabled: "_allowFocusWhenDisabled" }, host: { listeners: { "click": "_handleClick($event)", "keydown": "_handleKeydown($event)" }, properties: { "class.mdc-evolution-chip__action--primary": "_isPrimary", "class.mdc-evolution-chip__action--presentational": "!isInteractive", "class.mdc-evolution-chip__action--trailing": "!_isPrimary", "attr.tabindex": "_getTabindex()", "attr.disabled": "_getDisabledAttribute()", "attr.aria-disabled": "disabled" }, classAttribute: "mdc-evolution-chip__action mat-mdc-chip-action" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatChipAction, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hpcHMvY2hpcC1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25FLE9BQU8sRUFBYyxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNsRSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sVUFBVSxDQUFDOztBQUVsQyxNQUFlLGtCQUFrQjtDQUVoQztBQUVELE1BQU0sdUJBQXVCLEdBQUcsYUFBYSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFdEU7OztHQUdHO0FBZ0JILE1BQU0sT0FBTyxhQUFjLFNBQVEsdUJBQXVCO0lBeUN4RCxZQUNTLFdBQW9DLEVBRWpDLFdBSVQ7UUFFRCxLQUFLLEVBQUUsQ0FBQztRQVJELGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUVqQyxnQkFBVyxHQUFYLFdBQVcsQ0FJcEI7UUEvQ0gseUNBQXlDO1FBQ2hDLGtCQUFhLEdBQUcsSUFBSSxDQUFDO1FBRTlCLHNEQUFzRDtRQUN0RCxlQUFVLEdBQUcsSUFBSSxDQUFDO1FBVVYsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUUxQjs7V0FFRztRQUVLLDRCQUF1QixHQUFHLEtBQUssQ0FBQztRQStCdEMsSUFBSSxXQUFXLENBQUMsYUFBYSxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDbkQsV0FBVyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQzFEO0lBQ0gsQ0FBQztJQWhERCxzQ0FBc0M7SUFDdEMsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO0lBQ3JELENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFtQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFTRDs7T0FFRztJQUNPLHFCQUFxQjtRQUM3QiwrRkFBK0Y7UUFDL0YsaUVBQWlFO1FBQ2pFLE9BQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDcEUsQ0FBQztJQUVEOztPQUVHO0lBQ08sWUFBWTtRQUNwQixPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7WUFDNUUsQ0FBQyxDQUFDLElBQUk7WUFDTixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBa0JELEtBQUs7UUFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQWlCO1FBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUMzRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQywrQkFBK0IsRUFBRSxDQUFDO1NBQ3BEO0lBQ0gsQ0FBQztJQUVELGNBQWMsQ0FBQyxLQUFvQjtRQUNqQyxJQUNFLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUM7WUFDcEQsQ0FBQyxJQUFJLENBQUMsUUFBUTtZQUNkLElBQUksQ0FBQyxhQUFhO1lBQ2xCLElBQUksQ0FBQyxVQUFVLEVBQ2Y7WUFDQSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQywrQkFBK0IsRUFBRSxDQUFDO1NBQ3BEO0lBQ0gsQ0FBQzs7MEdBOUVVLGFBQWEsNENBMkNkLFFBQVE7OEZBM0NQLGFBQWE7MkZBQWIsYUFBYTtrQkFmekIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO29CQUNoQyxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLGdEQUFnRDt3QkFDekQsNkNBQTZDLEVBQUUsWUFBWTt3QkFDM0Qsb0RBQW9ELEVBQUUsZ0JBQWdCO3dCQUN0RSw4Q0FBOEMsRUFBRSxhQUFhO3dCQUM3RCxpQkFBaUIsRUFBRSxnQkFBZ0I7d0JBQ25DLGlCQUFpQixFQUFFLHlCQUF5Qjt3QkFDNUMsc0JBQXNCLEVBQUUsVUFBVTt3QkFDbEMsU0FBUyxFQUFFLHNCQUFzQjt3QkFDakMsV0FBVyxFQUFFLHdCQUF3QjtxQkFDdEM7aUJBQ0Y7OzBCQTRDSSxNQUFNOzJCQUFDLFFBQVE7NENBekNULGFBQWE7c0JBQXJCLEtBQUs7Z0JBT0YsUUFBUTtzQkFEWCxLQUFLO2dCQWFFLHVCQUF1QjtzQkFEOUIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFTlRFUiwgU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0LCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0hhc1RhYkluZGV4LCBtaXhpblRhYkluZGV4fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TUFUX0NISVB9IGZyb20gJy4vdG9rZW5zJztcblxuYWJzdHJhY3QgY2xhc3MgX01hdENoaXBBY3Rpb25CYXNlIHtcbiAgYWJzdHJhY3QgZGlzYWJsZWQ6IGJvb2xlYW47XG59XG5cbmNvbnN0IF9NYXRDaGlwQWN0aW9uTWl4aW5CYXNlID0gbWl4aW5UYWJJbmRleChfTWF0Q2hpcEFjdGlvbkJhc2UsIC0xKTtcblxuLyoqXG4gKiBTZWN0aW9uIHdpdGhpbiBhIGNoaXAuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRDaGlwQWN0aW9uXScsXG4gIGlucHV0czogWydkaXNhYmxlZCcsICd0YWJJbmRleCddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy1ldm9sdXRpb24tY2hpcF9fYWN0aW9uIG1hdC1tZGMtY2hpcC1hY3Rpb24nLFxuICAgICdbY2xhc3MubWRjLWV2b2x1dGlvbi1jaGlwX19hY3Rpb24tLXByaW1hcnldJzogJ19pc1ByaW1hcnknLFxuICAgICdbY2xhc3MubWRjLWV2b2x1dGlvbi1jaGlwX19hY3Rpb24tLXByZXNlbnRhdGlvbmFsXSc6ICchaXNJbnRlcmFjdGl2ZScsXG4gICAgJ1tjbGFzcy5tZGMtZXZvbHV0aW9uLWNoaXBfX2FjdGlvbi0tdHJhaWxpbmddJzogJyFfaXNQcmltYXJ5JyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ19nZXRUYWJpbmRleCgpJyxcbiAgICAnW2F0dHIuZGlzYWJsZWRdJzogJ19nZXREaXNhYmxlZEF0dHJpYnV0ZSgpJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygkZXZlbnQpJyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwQWN0aW9uIGV4dGVuZHMgX01hdENoaXBBY3Rpb25NaXhpbkJhc2UgaW1wbGVtZW50cyBIYXNUYWJJbmRleCB7XG4gIC8qKiBXaGV0aGVyIHRoZSBhY3Rpb24gaXMgaW50ZXJhY3RpdmUuICovXG4gIEBJbnB1dCgpIGlzSW50ZXJhY3RpdmUgPSB0cnVlO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgaXMgdGhlIHByaW1hcnkgYWN0aW9uIGluIHRoZSBjaGlwLiAqL1xuICBfaXNQcmltYXJ5ID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgYWN0aW9uIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkIHx8IHRoaXMuX3BhcmVudENoaXAuZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogUHJpdmF0ZSBBUEkgdG8gYWxsb3cgZm9jdXNpbmcgdGhpcyBjaGlwIHdoZW4gaXQgaXMgZGlzYWJsZWQuXG4gICAqL1xuICBASW5wdXQoKVxuICBwcml2YXRlIF9hbGxvd0ZvY3VzV2hlbkRpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0aGUgdmFsdWUgb2YgdGhlIGRpc2FibGVkIGF0dHJpYnV0ZSBmb3IgdGhpcyBjaGlwIGFjdGlvbi5cbiAgICovXG4gIHByb3RlY3RlZCBfZ2V0RGlzYWJsZWRBdHRyaWJ1dGUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgLy8gV2hlbiB0aGlzIGNoaXAgYWN0aW9uIGlzIGRpc2FibGVkIGFuZCBmb2N1c2luZyBkaXNhYmxlZCBjaGlwcyBpcyBub3QgcGVybWl0dGVkLCByZXR1cm4gZW1wdHlcbiAgICAvLyBzdHJpbmcgdG8gaW5kaWNhdGUgdGhhdCBkaXNhYmxlZCBhdHRyaWJ1dGUgc2hvdWxkIGJlIGluY2x1ZGVkLlxuICAgIHJldHVybiB0aGlzLmRpc2FibGVkICYmICF0aGlzLl9hbGxvd0ZvY3VzV2hlbkRpc2FibGVkID8gJycgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0aGUgdmFsdWUgb2YgdGhlIHRhYmluZGV4IGF0dHJpYnV0ZSBmb3IgdGhpcyBjaGlwIGFjdGlvbi5cbiAgICovXG4gIHByb3RlY3RlZCBfZ2V0VGFiaW5kZXgoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuICh0aGlzLmRpc2FibGVkICYmICF0aGlzLl9hbGxvd0ZvY3VzV2hlbkRpc2FibGVkKSB8fCAhdGhpcy5pc0ludGVyYWN0aXZlXG4gICAgICA/IG51bGxcbiAgICAgIDogdGhpcy50YWJJbmRleC50b1N0cmluZygpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBASW5qZWN0KE1BVF9DSElQKVxuICAgIHByb3RlY3RlZCBfcGFyZW50Q2hpcDoge1xuICAgICAgX2hhbmRsZVByaW1hcnlBY3Rpb25JbnRlcmFjdGlvbigpOiB2b2lkO1xuICAgICAgcmVtb3ZlKCk6IHZvaWQ7XG4gICAgICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgICB9LFxuICApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQubm9kZU5hbWUgPT09ICdCVVRUT04nKSB7XG4gICAgICBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcbiAgICB9XG4gIH1cblxuICBmb2N1cygpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIF9oYW5kbGVDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiB0aGlzLmlzSW50ZXJhY3RpdmUgJiYgdGhpcy5faXNQcmltYXJ5KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5fcGFyZW50Q2hpcC5faGFuZGxlUHJpbWFyeUFjdGlvbkludGVyYWN0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoXG4gICAgICAoZXZlbnQua2V5Q29kZSA9PT0gRU5URVIgfHwgZXZlbnQua2V5Q29kZSA9PT0gU1BBQ0UpICYmXG4gICAgICAhdGhpcy5kaXNhYmxlZCAmJlxuICAgICAgdGhpcy5pc0ludGVyYWN0aXZlICYmXG4gICAgICB0aGlzLl9pc1ByaW1hcnlcbiAgICApIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLl9wYXJlbnRDaGlwLl9oYW5kbGVQcmltYXJ5QWN0aW9uSW50ZXJhY3Rpb24oKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==