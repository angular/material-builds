/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Directive } from '@angular/core';
import { MatChipAction } from './chip-action';
import { MAT_CHIP_AVATAR, MAT_CHIP_REMOVE, MAT_CHIP_TRAILING_ICON } from './tokens';
import * as i0 from "@angular/core";
/**
 * Directive to add CSS classes to chip leading icon.
 * @docs-private
 */
export class MatChipAvatar {
}
MatChipAvatar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatChipAvatar, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatChipAvatar.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: MatChipAvatar, selector: "mat-chip-avatar, [matChipAvatar]", host: { attributes: { "role": "img" }, classAttribute: "mat-mdc-chip-avatar mdc-evolution-chip__icon mdc-evolution-chip__icon--primary" }, providers: [{ provide: MAT_CHIP_AVATAR, useExisting: MatChipAvatar }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatChipAvatar, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-chip-avatar, [matChipAvatar]',
                    host: {
                        'class': 'mat-mdc-chip-avatar mdc-evolution-chip__icon mdc-evolution-chip__icon--primary',
                        'role': 'img',
                    },
                    providers: [{ provide: MAT_CHIP_AVATAR, useExisting: MatChipAvatar }],
                }]
        }] });
/**
 * Directive to add CSS classes to and configure attributes for chip trailing icon.
 * @docs-private
 */
export class MatChipTrailingIcon extends MatChipAction {
    constructor() {
        super(...arguments);
        /**
         * MDC considers all trailing actions as a remove icon,
         * but we support non-interactive trailing icons.
         */
        this.isInteractive = false;
        this._isPrimary = false;
    }
}
MatChipTrailingIcon.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatChipTrailingIcon, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatChipTrailingIcon.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: MatChipTrailingIcon, selector: "mat-chip-trailing-icon, [matChipTrailingIcon]", host: { attributes: { "aria-hidden": "true" }, classAttribute: "mat-mdc-chip-trailing-icon mdc-evolution-chip__icon mdc-evolution-chip__icon--trailing" }, providers: [{ provide: MAT_CHIP_TRAILING_ICON, useExisting: MatChipTrailingIcon }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatChipTrailingIcon, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-chip-trailing-icon, [matChipTrailingIcon]',
                    host: {
                        'class': 'mat-mdc-chip-trailing-icon mdc-evolution-chip__icon mdc-evolution-chip__icon--trailing',
                        'aria-hidden': 'true',
                    },
                    providers: [{ provide: MAT_CHIP_TRAILING_ICON, useExisting: MatChipTrailingIcon }],
                }]
        }] });
/**
 * Directive to remove the parent chip when the trailing icon is clicked or
 * when the ENTER key is pressed on it.
 *
 * Recommended for use with the Material Design "cancel" icon
 * available at https://material.io/icons/#ic_cancel.
 *
 * Example:
 *
 * ```
 * <mat-chip>
 *   <mat-icon matChipRemove>cancel</mat-icon>
 * </mat-chip>
 * ```
 */
export class MatChipRemove extends MatChipAction {
    constructor() {
        super(...arguments);
        this._isPrimary = false;
    }
    _handleClick(event) {
        if (!this.disabled) {
            event.stopPropagation();
            event.preventDefault();
            this._parentChip.remove();
        }
    }
    _handleKeydown(event) {
        if ((event.keyCode === ENTER || event.keyCode === SPACE) && !this.disabled) {
            event.stopPropagation();
            event.preventDefault();
            this._parentChip.remove();
        }
    }
}
MatChipRemove.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatChipRemove, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatChipRemove.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: MatChipRemove, selector: "[matChipRemove]", host: { attributes: { "role": "button" }, properties: { "attr.aria-hidden": "null" }, classAttribute: "mat-mdc-chip-remove mat-mdc-chip-trailing-icon mat-mdc-focus-indicator mdc-evolution-chip__icon mdc-evolution-chip__icon--trailing" }, providers: [{ provide: MAT_CHIP_REMOVE, useExisting: MatChipRemove }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatChipRemove, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matChipRemove]',
                    host: {
                        'class': 'mat-mdc-chip-remove mat-mdc-chip-trailing-icon mat-mdc-focus-indicator ' +
                            'mdc-evolution-chip__icon mdc-evolution-chip__icon--trailing',
                        'role': 'button',
                        '[attr.aria-hidden]': 'null',
                    },
                    providers: [{ provide: MAT_CHIP_REMOVE, useExisting: MatChipRemove }],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1pY29ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy9jaGlwLWljb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN4QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFFLHNCQUFzQixFQUFDLE1BQU0sVUFBVSxDQUFDOztBQUVsRjs7O0dBR0c7QUFTSCxNQUFNLE9BQU8sYUFBYTs7MEdBQWIsYUFBYTs4RkFBYixhQUFhLHNNQUZiLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUMsQ0FBQzsyRkFFeEQsYUFBYTtrQkFSekIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsa0NBQWtDO29CQUM1QyxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLGdGQUFnRjt3QkFDekYsTUFBTSxFQUFFLEtBQUs7cUJBQ2Q7b0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsZUFBZSxFQUFDLENBQUM7aUJBQ3BFOztBQUdEOzs7R0FHRztBQVVILE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxhQUFhO0lBVHREOztRQVVFOzs7V0FHRztRQUNNLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBRXRCLGVBQVUsR0FBRyxLQUFLLENBQUM7S0FDN0I7O2dIQVJZLG1CQUFtQjtvR0FBbkIsbUJBQW1CLG1PQUZuQixDQUFDLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBQyxDQUFDOzJGQUVyRSxtQkFBbUI7a0JBVC9CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLCtDQUErQztvQkFDekQsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFDTCx3RkFBd0Y7d0JBQzFGLGFBQWEsRUFBRSxNQUFNO3FCQUN0QjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxXQUFXLHFCQUFxQixFQUFDLENBQUM7aUJBQ2pGOztBQVdEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBYUgsTUFBTSxPQUFPLGFBQWMsU0FBUSxhQUFhO0lBWGhEOztRQVlXLGVBQVUsR0FBRyxLQUFLLENBQUM7S0FpQjdCO0lBZlUsWUFBWSxDQUFDLEtBQWlCO1FBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN4QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUMzQjtJQUNILENBQUM7SUFFUSxjQUFjLENBQUMsS0FBb0I7UUFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQzFFLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN4QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUMzQjtJQUNILENBQUM7OzBHQWpCVSxhQUFhOzhGQUFiLGFBQWEsd1JBRmIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBQyxDQUFDOzJGQUV4RCxhQUFhO2tCQVh6QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQ0wseUVBQXlFOzRCQUN6RSw2REFBNkQ7d0JBQy9ELE1BQU0sRUFBRSxRQUFRO3dCQUNoQixvQkFBb0IsRUFBRSxNQUFNO3FCQUM3QjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsV0FBVyxlQUFlLEVBQUMsQ0FBQztpQkFDcEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtFTlRFUiwgU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge0RpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENoaXBBY3Rpb259IGZyb20gJy4vY2hpcC1hY3Rpb24nO1xuaW1wb3J0IHtNQVRfQ0hJUF9BVkFUQVIsIE1BVF9DSElQX1JFTU9WRSwgTUFUX0NISVBfVFJBSUxJTkdfSUNPTn0gZnJvbSAnLi90b2tlbnMnO1xuXG4vKipcbiAqIERpcmVjdGl2ZSB0byBhZGQgQ1NTIGNsYXNzZXMgdG8gY2hpcCBsZWFkaW5nIGljb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1jaGlwLWF2YXRhciwgW21hdENoaXBBdmF0YXJdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbWRjLWNoaXAtYXZhdGFyIG1kYy1ldm9sdXRpb24tY2hpcF9faWNvbiBtZGMtZXZvbHV0aW9uLWNoaXBfX2ljb24tLXByaW1hcnknLFxuICAgICdyb2xlJzogJ2ltZycsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfQ0hJUF9BVkFUQVIsIHVzZUV4aXN0aW5nOiBNYXRDaGlwQXZhdGFyfV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXBBdmF0YXIge31cblxuLyoqXG4gKiBEaXJlY3RpdmUgdG8gYWRkIENTUyBjbGFzc2VzIHRvIGFuZCBjb25maWd1cmUgYXR0cmlidXRlcyBmb3IgY2hpcCB0cmFpbGluZyBpY29uLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hpcC10cmFpbGluZy1pY29uLCBbbWF0Q2hpcFRyYWlsaW5nSWNvbl0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzpcbiAgICAgICdtYXQtbWRjLWNoaXAtdHJhaWxpbmctaWNvbiBtZGMtZXZvbHV0aW9uLWNoaXBfX2ljb24gbWRjLWV2b2x1dGlvbi1jaGlwX19pY29uLS10cmFpbGluZycsXG4gICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnLFxuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX0NISVBfVFJBSUxJTkdfSUNPTiwgdXNlRXhpc3Rpbmc6IE1hdENoaXBUcmFpbGluZ0ljb259XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcFRyYWlsaW5nSWNvbiBleHRlbmRzIE1hdENoaXBBY3Rpb24ge1xuICAvKipcbiAgICogTURDIGNvbnNpZGVycyBhbGwgdHJhaWxpbmcgYWN0aW9ucyBhcyBhIHJlbW92ZSBpY29uLFxuICAgKiBidXQgd2Ugc3VwcG9ydCBub24taW50ZXJhY3RpdmUgdHJhaWxpbmcgaWNvbnMuXG4gICAqL1xuICBvdmVycmlkZSBpc0ludGVyYWN0aXZlID0gZmFsc2U7XG5cbiAgb3ZlcnJpZGUgX2lzUHJpbWFyeSA9IGZhbHNlO1xufVxuXG4vKipcbiAqIERpcmVjdGl2ZSB0byByZW1vdmUgdGhlIHBhcmVudCBjaGlwIHdoZW4gdGhlIHRyYWlsaW5nIGljb24gaXMgY2xpY2tlZCBvclxuICogd2hlbiB0aGUgRU5URVIga2V5IGlzIHByZXNzZWQgb24gaXQuXG4gKlxuICogUmVjb21tZW5kZWQgZm9yIHVzZSB3aXRoIHRoZSBNYXRlcmlhbCBEZXNpZ24gXCJjYW5jZWxcIiBpY29uXG4gKiBhdmFpbGFibGUgYXQgaHR0cHM6Ly9tYXRlcmlhbC5pby9pY29ucy8jaWNfY2FuY2VsLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBgXG4gKiA8bWF0LWNoaXA+XG4gKiAgIDxtYXQtaWNvbiBtYXRDaGlwUmVtb3ZlPmNhbmNlbDwvbWF0LWljb24+XG4gKiA8L21hdC1jaGlwPlxuICogYGBgXG4gKi9cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdENoaXBSZW1vdmVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6XG4gICAgICAnbWF0LW1kYy1jaGlwLXJlbW92ZSBtYXQtbWRjLWNoaXAtdHJhaWxpbmctaWNvbiBtYXQtbWRjLWZvY3VzLWluZGljYXRvciAnICtcbiAgICAgICdtZGMtZXZvbHV0aW9uLWNoaXBfX2ljb24gbWRjLWV2b2x1dGlvbi1jaGlwX19pY29uLS10cmFpbGluZycsXG4gICAgJ3JvbGUnOiAnYnV0dG9uJyxcbiAgICAnW2F0dHIuYXJpYS1oaWRkZW5dJzogJ251bGwnLFxuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX0NISVBfUkVNT1ZFLCB1c2VFeGlzdGluZzogTWF0Q2hpcFJlbW92ZX1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwUmVtb3ZlIGV4dGVuZHMgTWF0Q2hpcEFjdGlvbiB7XG4gIG92ZXJyaWRlIF9pc1ByaW1hcnkgPSBmYWxzZTtcblxuICBvdmVycmlkZSBfaGFuZGxlQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuX3BhcmVudENoaXAucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoKGV2ZW50LmtleUNvZGUgPT09IEVOVEVSIHx8IGV2ZW50LmtleUNvZGUgPT09IFNQQUNFKSAmJiAhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5fcGFyZW50Q2hpcC5yZW1vdmUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==