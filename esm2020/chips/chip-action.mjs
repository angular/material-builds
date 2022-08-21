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
MatChipAction.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatChipAction, deps: [{ token: i0.ElementRef }, { token: MAT_CHIP }], target: i0.ɵɵFactoryTarget.Directive });
MatChipAction.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatChipAction, selector: "[matChipAction]", inputs: { disabled: "disabled", tabIndex: "tabIndex", isInteractive: "isInteractive" }, host: { listeners: { "click": "_handleClick($event)", "keydown": "_handleKeydown($event)" }, properties: { "class.mdc-evolution-chip__action--primary": "_isPrimary", "class.mdc-evolution-chip__action--presentational": "_isPrimary", "class.mdc-evolution-chip__action--trailing": "!_isPrimary", "attr.tabindex": "(disabled || !isInteractive) ? null : tabIndex", "attr.disabled": "disabled ? '' : null", "attr.aria-disabled": "disabled" }, classAttribute: "mdc-evolution-chip__action mat-mdc-chip-action" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatChipAction, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matChipAction]',
                    inputs: ['disabled', 'tabIndex'],
                    host: {
                        'class': 'mdc-evolution-chip__action mat-mdc-chip-action',
                        '[class.mdc-evolution-chip__action--primary]': '_isPrimary',
                        // Note that while our actions are interactive, we have to add the `--presentational` class,
                        // in order to avoid some super-specific `:hover` styles from MDC.
                        '[class.mdc-evolution-chip__action--presentational]': '_isPrimary',
                        '[class.mdc-evolution-chip__action--trailing]': '!_isPrimary',
                        '[attr.tabindex]': '(disabled || !isInteractive) ? null : tabIndex',
                        '[attr.disabled]': "disabled ? '' : null",
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
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hpcHMvY2hpcC1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25FLE9BQU8sRUFBYyxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNsRSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sVUFBVSxDQUFDOztBQUVsQyxNQUFlLGtCQUFrQjtDQUVoQztBQUVELE1BQU0sdUJBQXVCLEdBQUcsYUFBYSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFdEU7OztHQUdHO0FBa0JILE1BQU0sT0FBTyxhQUFjLFNBQVEsdUJBQXVCO0lBaUJ4RCxZQUNTLFdBQW9DLEVBRWpDLFdBSVQ7UUFFRCxLQUFLLEVBQUUsQ0FBQztRQVJELGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUVqQyxnQkFBVyxHQUFYLFdBQVcsQ0FJcEI7UUF2QkgseUNBQXlDO1FBQ2hDLGtCQUFhLEdBQUcsSUFBSSxDQUFDO1FBRTlCLHNEQUFzRDtRQUN0RCxlQUFVLEdBQUcsSUFBSSxDQUFDO1FBVVYsY0FBUyxHQUFHLEtBQUssQ0FBQztRQWF4QixJQUFJLFdBQVcsQ0FBQyxhQUFhLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtZQUNuRCxXQUFXLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDMUQ7SUFDSCxDQUFDO0lBeEJELHNDQUFzQztJQUN0QyxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7SUFDckQsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLEtBQW1CO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQW1CRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELFlBQVksQ0FBQyxLQUFpQjtRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDM0QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsK0JBQStCLEVBQUUsQ0FBQztTQUNwRDtJQUNILENBQUM7SUFFRCxjQUFjLENBQUMsS0FBb0I7UUFDakMsSUFDRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDO1lBQ3BELENBQUMsSUFBSSxDQUFDLFFBQVE7WUFDZCxJQUFJLENBQUMsYUFBYTtZQUNsQixJQUFJLENBQUMsVUFBVSxFQUNmO1lBQ0EsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsK0JBQStCLEVBQUUsQ0FBQztTQUNwRDtJQUNILENBQUM7OytHQXREVSxhQUFhLDRDQW1CZCxRQUFRO21HQW5CUCxhQUFhO2dHQUFiLGFBQWE7a0JBakJ6QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLE1BQU0sRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7b0JBQ2hDLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsZ0RBQWdEO3dCQUN6RCw2Q0FBNkMsRUFBRSxZQUFZO3dCQUMzRCw0RkFBNEY7d0JBQzVGLGtFQUFrRTt3QkFDbEUsb0RBQW9ELEVBQUUsWUFBWTt3QkFDbEUsOENBQThDLEVBQUUsYUFBYTt3QkFDN0QsaUJBQWlCLEVBQUUsZ0RBQWdEO3dCQUNuRSxpQkFBaUIsRUFBRSxzQkFBc0I7d0JBQ3pDLHNCQUFzQixFQUFFLFVBQVU7d0JBQ2xDLFNBQVMsRUFBRSxzQkFBc0I7d0JBQ2pDLFdBQVcsRUFBRSx3QkFBd0I7cUJBQ3RDO2lCQUNGOzswQkFvQkksTUFBTTsyQkFBQyxRQUFROzRDQWpCVCxhQUFhO3NCQUFyQixLQUFLO2dCQU9GLFFBQVE7c0JBRFgsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFTlRFUiwgU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0LCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0hhc1RhYkluZGV4LCBtaXhpblRhYkluZGV4fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TUFUX0NISVB9IGZyb20gJy4vdG9rZW5zJztcblxuYWJzdHJhY3QgY2xhc3MgX01hdENoaXBBY3Rpb25CYXNlIHtcbiAgYWJzdHJhY3QgZGlzYWJsZWQ6IGJvb2xlYW47XG59XG5cbmNvbnN0IF9NYXRDaGlwQWN0aW9uTWl4aW5CYXNlID0gbWl4aW5UYWJJbmRleChfTWF0Q2hpcEFjdGlvbkJhc2UsIC0xKTtcblxuLyoqXG4gKiBTZWN0aW9uIHdpdGhpbiBhIGNoaXAuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRDaGlwQWN0aW9uXScsXG4gIGlucHV0czogWydkaXNhYmxlZCcsICd0YWJJbmRleCddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy1ldm9sdXRpb24tY2hpcF9fYWN0aW9uIG1hdC1tZGMtY2hpcC1hY3Rpb24nLFxuICAgICdbY2xhc3MubWRjLWV2b2x1dGlvbi1jaGlwX19hY3Rpb24tLXByaW1hcnldJzogJ19pc1ByaW1hcnknLFxuICAgIC8vIE5vdGUgdGhhdCB3aGlsZSBvdXIgYWN0aW9ucyBhcmUgaW50ZXJhY3RpdmUsIHdlIGhhdmUgdG8gYWRkIHRoZSBgLS1wcmVzZW50YXRpb25hbGAgY2xhc3MsXG4gICAgLy8gaW4gb3JkZXIgdG8gYXZvaWQgc29tZSBzdXBlci1zcGVjaWZpYyBgOmhvdmVyYCBzdHlsZXMgZnJvbSBNREMuXG4gICAgJ1tjbGFzcy5tZGMtZXZvbHV0aW9uLWNoaXBfX2FjdGlvbi0tcHJlc2VudGF0aW9uYWxdJzogJ19pc1ByaW1hcnknLFxuICAgICdbY2xhc3MubWRjLWV2b2x1dGlvbi1jaGlwX19hY3Rpb24tLXRyYWlsaW5nXSc6ICchX2lzUHJpbWFyeScsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICcoZGlzYWJsZWQgfHwgIWlzSW50ZXJhY3RpdmUpID8gbnVsbCA6IHRhYkluZGV4JyxcbiAgICAnW2F0dHIuZGlzYWJsZWRdJzogXCJkaXNhYmxlZCA/ICcnIDogbnVsbFwiLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCRldmVudCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXBBY3Rpb24gZXh0ZW5kcyBfTWF0Q2hpcEFjdGlvbk1peGluQmFzZSBpbXBsZW1lbnRzIEhhc1RhYkluZGV4IHtcbiAgLyoqIFdoZXRoZXIgdGhlIGFjdGlvbiBpcyBpbnRlcmFjdGl2ZS4gKi9cbiAgQElucHV0KCkgaXNJbnRlcmFjdGl2ZSA9IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBpcyB0aGUgcHJpbWFyeSBhY3Rpb24gaW4gdGhlIGNoaXAuICovXG4gIF9pc1ByaW1hcnkgPSB0cnVlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBhY3Rpb24gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQgfHwgdGhpcy5fcGFyZW50Q2hpcC5kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQEluamVjdChNQVRfQ0hJUClcbiAgICBwcm90ZWN0ZWQgX3BhcmVudENoaXA6IHtcbiAgICAgIF9oYW5kbGVQcmltYXJ5QWN0aW9uSW50ZXJhY3Rpb24oKTogdm9pZDtcbiAgICAgIHJlbW92ZSgpOiB2b2lkO1xuICAgICAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgfSxcbiAgKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmIChfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm5vZGVOYW1lID09PSAnQlVUVE9OJykge1xuICAgICAgX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJyk7XG4gICAgfVxuICB9XG5cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICBfaGFuZGxlQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5pc0ludGVyYWN0aXZlICYmIHRoaXMuX2lzUHJpbWFyeSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuX3BhcmVudENoaXAuX2hhbmRsZVByaW1hcnlBY3Rpb25JbnRlcmFjdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKFxuICAgICAgKGV2ZW50LmtleUNvZGUgPT09IEVOVEVSIHx8IGV2ZW50LmtleUNvZGUgPT09IFNQQUNFKSAmJlxuICAgICAgIXRoaXMuZGlzYWJsZWQgJiZcbiAgICAgIHRoaXMuaXNJbnRlcmFjdGl2ZSAmJlxuICAgICAgdGhpcy5faXNQcmltYXJ5XG4gICAgKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5fcGFyZW50Q2hpcC5faGFuZGxlUHJpbWFyeUFjdGlvbkludGVyYWN0aW9uKCk7XG4gICAgfVxuICB9XG59XG4iXX0=