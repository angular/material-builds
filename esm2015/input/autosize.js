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
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Directive, Input } from '@angular/core';
/**
 * Directive to automatically resize a textarea to fit its content.
 * @deprecated Use `cdkTextareaAutosize` from `\@angular/cdk/text-field` instead.
 * \@breaking-change 8.0.0
 */
export class MatTextareaAutosize extends CdkTextareaAutosize {
    /**
     * @return {?}
     */
    get matAutosizeMinRows() { return this.minRows; }
    /**
     * @param {?} value
     * @return {?}
     */
    set matAutosizeMinRows(value) { this.minRows = value; }
    /**
     * @return {?}
     */
    get matAutosizeMaxRows() { return this.maxRows; }
    /**
     * @param {?} value
     * @return {?}
     */
    set matAutosizeMaxRows(value) { this.maxRows = value; }
    /**
     * @return {?}
     */
    get matAutosize() { return this.enabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set matAutosize(value) { this.enabled = value; }
    /**
     * @return {?}
     */
    get matTextareaAutosize() { return this.enabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set matTextareaAutosize(value) { this.enabled = value; }
}
MatTextareaAutosize.decorators = [
    { type: Directive, args: [{
                selector: 'textarea[mat-autosize], textarea[matTextareaAutosize]',
                exportAs: 'matTextareaAutosize',
                inputs: ['cdkAutosizeMinRows', 'cdkAutosizeMaxRows'],
                host: {
                    'class': 'cdk-textarea-autosize mat-autosize',
                    // Textarea elements that have the directive applied should have a single row by default.
                    // Browsers normally show two rows by default and therefore this limits the minRows binding.
                    'rows': '1',
                    '(input)': '_noopInputHandler()',
                },
            },] }
];
MatTextareaAutosize.propDecorators = {
    matAutosizeMinRows: [{ type: Input }],
    matAutosizeMaxRows: [{ type: Input }],
    matAutosize: [{ type: Input, args: ['mat-autosize',] }],
    matTextareaAutosize: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b3NpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvaW5wdXQvYXV0b3NpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQzs7Ozs7O0FBbUIvQyxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsbUJBQW1COzs7O0lBQzFELElBQ0ksa0JBQWtCLEtBQWEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFDekQsSUFBSSxrQkFBa0IsQ0FBQyxLQUFhLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7O0lBRS9ELElBQ0ksa0JBQWtCLEtBQWEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFDekQsSUFBSSxrQkFBa0IsQ0FBQyxLQUFhLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7O0lBRS9ELElBQ0ksV0FBVyxLQUFjLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ25ELElBQUksV0FBVyxDQUFDLEtBQWMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7Ozs7SUFFekQsSUFDSSxtQkFBbUIsS0FBYyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzs7OztJQUMzRCxJQUFJLG1CQUFtQixDQUFDLEtBQWMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7OztZQTNCbEUsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx1REFBdUQ7Z0JBQ2pFLFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLE1BQU0sRUFBRSxDQUFDLG9CQUFvQixFQUFFLG9CQUFvQixDQUFDO2dCQUNwRCxJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLG9DQUFvQzs7O29CQUc3QyxNQUFNLEVBQUUsR0FBRztvQkFDWCxTQUFTLEVBQUUscUJBQXFCO2lCQUNqQzthQUNGOzs7aUNBRUUsS0FBSztpQ0FJTCxLQUFLOzBCQUlMLEtBQUssU0FBQyxjQUFjO2tDQUlwQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2RrVGV4dGFyZWFBdXRvc2l6ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RleHQtZmllbGQnO1xuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBEaXJlY3RpdmUgdG8gYXV0b21hdGljYWxseSByZXNpemUgYSB0ZXh0YXJlYSB0byBmaXQgaXRzIGNvbnRlbnQuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYGNka1RleHRhcmVhQXV0b3NpemVgIGZyb20gYEBhbmd1bGFyL2Nkay90ZXh0LWZpZWxkYCBpbnN0ZWFkLlxuICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICd0ZXh0YXJlYVttYXQtYXV0b3NpemVdLCB0ZXh0YXJlYVttYXRUZXh0YXJlYUF1dG9zaXplXScsXG4gIGV4cG9ydEFzOiAnbWF0VGV4dGFyZWFBdXRvc2l6ZScsXG4gIGlucHV0czogWydjZGtBdXRvc2l6ZU1pblJvd3MnLCAnY2RrQXV0b3NpemVNYXhSb3dzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnY2RrLXRleHRhcmVhLWF1dG9zaXplIG1hdC1hdXRvc2l6ZScsXG4gICAgLy8gVGV4dGFyZWEgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBkaXJlY3RpdmUgYXBwbGllZCBzaG91bGQgaGF2ZSBhIHNpbmdsZSByb3cgYnkgZGVmYXVsdC5cbiAgICAvLyBCcm93c2VycyBub3JtYWxseSBzaG93IHR3byByb3dzIGJ5IGRlZmF1bHQgYW5kIHRoZXJlZm9yZSB0aGlzIGxpbWl0cyB0aGUgbWluUm93cyBiaW5kaW5nLlxuICAgICdyb3dzJzogJzEnLFxuICAgICcoaW5wdXQpJzogJ19ub29wSW5wdXRIYW5kbGVyKCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUZXh0YXJlYUF1dG9zaXplIGV4dGVuZHMgQ2RrVGV4dGFyZWFBdXRvc2l6ZSB7XG4gIEBJbnB1dCgpXG4gIGdldCBtYXRBdXRvc2l6ZU1pblJvd3MoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMubWluUm93czsgfVxuICBzZXQgbWF0QXV0b3NpemVNaW5Sb3dzKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5taW5Sb3dzID0gdmFsdWU7IH1cblxuICBASW5wdXQoKVxuICBnZXQgbWF0QXV0b3NpemVNYXhSb3dzKCk6IG51bWJlciB7IHJldHVybiB0aGlzLm1heFJvd3M7IH1cbiAgc2V0IG1hdEF1dG9zaXplTWF4Um93cyh2YWx1ZTogbnVtYmVyKSB7IHRoaXMubWF4Um93cyA9IHZhbHVlOyB9XG5cbiAgQElucHV0KCdtYXQtYXV0b3NpemUnKVxuICBnZXQgbWF0QXV0b3NpemUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmVuYWJsZWQ7IH1cbiAgc2V0IG1hdEF1dG9zaXplKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuZW5hYmxlZCA9IHZhbHVlOyB9XG5cbiAgQElucHV0KClcbiAgZ2V0IG1hdFRleHRhcmVhQXV0b3NpemUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmVuYWJsZWQ7IH1cbiAgc2V0IG1hdFRleHRhcmVhQXV0b3NpemUodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5lbmFibGVkID0gdmFsdWU7IH1cbn1cbiJdfQ==