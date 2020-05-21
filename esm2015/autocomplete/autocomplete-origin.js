/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { Directive, ElementRef } from '@angular/core';
/**
 * Directive applied to an element to make it usable
 * as a connection point for an autocomplete panel.
 */
let MatAutocompleteOrigin = /** @class */ (() => {
    let MatAutocompleteOrigin = class MatAutocompleteOrigin {
        constructor(
        /** Reference to the element on which the directive is applied. */
        elementRef) {
            this.elementRef = elementRef;
        }
    };
    MatAutocompleteOrigin = __decorate([
        Directive({
            selector: '[matAutocompleteOrigin]',
            exportAs: 'matAutocompleteOrigin',
        }),
        __metadata("design:paramtypes", [ElementRef])
    ], MatAutocompleteOrigin);
    return MatAutocompleteOrigin;
})();
export { MatAutocompleteOrigin };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLW9yaWdpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9hdXRvY29tcGxldGUvYXV0b2NvbXBsZXRlLW9yaWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFcEQ7OztHQUdHO0FBS0g7SUFBQSxJQUFhLHFCQUFxQixHQUFsQyxNQUFhLHFCQUFxQjtRQUNoQztRQUNJLGtFQUFrRTtRQUMzRCxVQUFtQztZQUFuQyxlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUFJLENBQUM7S0FDcEQsQ0FBQTtJQUpZLHFCQUFxQjtRQUpqQyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUseUJBQXlCO1lBQ25DLFFBQVEsRUFBRSx1QkFBdUI7U0FDbEMsQ0FBQzt5Q0FJdUIsVUFBVTtPQUh0QixxQkFBcUIsQ0FJakM7SUFBRCw0QkFBQztLQUFBO1NBSlkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBEaXJlY3RpdmUgYXBwbGllZCB0byBhbiBlbGVtZW50IHRvIG1ha2UgaXQgdXNhYmxlXG4gKiBhcyBhIGNvbm5lY3Rpb24gcG9pbnQgZm9yIGFuIGF1dG9jb21wbGV0ZSBwYW5lbC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdEF1dG9jb21wbGV0ZU9yaWdpbl0nLFxuICBleHBvcnRBczogJ21hdEF1dG9jb21wbGV0ZU9yaWdpbicsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZU9yaWdpbiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCBvbiB3aGljaCB0aGUgZGlyZWN0aXZlIGlzIGFwcGxpZWQuICovXG4gICAgICBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHsgfVxufVxuIl19