/**
 * @fileoverview added by tsickle
 * Generated from: src/material/input/autosize.ts
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
                },
            },] }
];
MatTextareaAutosize.propDecorators = {
    matAutosizeMinRows: [{ type: Input }],
    matAutosizeMaxRows: [{ type: Input }],
    matAutosize: [{ type: Input, args: ['mat-autosize',] }],
    matTextareaAutosize: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b3NpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvaW5wdXQvYXV0b3NpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7Ozs7OztBQWtCL0MsTUFBTSxPQUFPLG1CQUFvQixTQUFRLG1CQUFtQjs7OztJQUMxRCxJQUNJLGtCQUFrQixLQUFhLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ3pELElBQUksa0JBQWtCLENBQUMsS0FBYSxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7OztJQUUvRCxJQUNJLGtCQUFrQixLQUFhLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ3pELElBQUksa0JBQWtCLENBQUMsS0FBYSxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7OztJQUUvRCxJQUNJLFdBQVcsS0FBYyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzs7OztJQUNuRCxJQUFJLFdBQVcsQ0FBQyxLQUFjLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7O0lBRXpELElBQ0ksbUJBQW1CLEtBQWMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFDM0QsSUFBSSxtQkFBbUIsQ0FBQyxLQUFjLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7WUExQmxFLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdURBQXVEO2dCQUNqRSxRQUFRLEVBQUUscUJBQXFCO2dCQUMvQixNQUFNLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxvQkFBb0IsQ0FBQztnQkFDcEQsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxvQ0FBb0M7OztvQkFHN0MsTUFBTSxFQUFFLEdBQUc7aUJBQ1o7YUFDRjs7O2lDQUVFLEtBQUs7aUNBSUwsS0FBSzswQkFJTCxLQUFLLFNBQUMsY0FBYztrQ0FJcEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Nka1RleHRhcmVhQXV0b3NpemV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXh0LWZpZWxkJztcbmltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogRGlyZWN0aXZlIHRvIGF1dG9tYXRpY2FsbHkgcmVzaXplIGEgdGV4dGFyZWEgdG8gZml0IGl0cyBjb250ZW50LlxuICogQGRlcHJlY2F0ZWQgVXNlIGBjZGtUZXh0YXJlYUF1dG9zaXplYCBmcm9tIGBAYW5ndWxhci9jZGsvdGV4dC1maWVsZGAgaW5zdGVhZC5cbiAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAndGV4dGFyZWFbbWF0LWF1dG9zaXplXSwgdGV4dGFyZWFbbWF0VGV4dGFyZWFBdXRvc2l6ZV0nLFxuICBleHBvcnRBczogJ21hdFRleHRhcmVhQXV0b3NpemUnLFxuICBpbnB1dHM6IFsnY2RrQXV0b3NpemVNaW5Sb3dzJywgJ2Nka0F1dG9zaXplTWF4Um93cyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ2Nkay10ZXh0YXJlYS1hdXRvc2l6ZSBtYXQtYXV0b3NpemUnLFxuICAgIC8vIFRleHRhcmVhIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgZGlyZWN0aXZlIGFwcGxpZWQgc2hvdWxkIGhhdmUgYSBzaW5nbGUgcm93IGJ5IGRlZmF1bHQuXG4gICAgLy8gQnJvd3NlcnMgbm9ybWFsbHkgc2hvdyB0d28gcm93cyBieSBkZWZhdWx0IGFuZCB0aGVyZWZvcmUgdGhpcyBsaW1pdHMgdGhlIG1pblJvd3MgYmluZGluZy5cbiAgICAncm93cyc6ICcxJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGV4dGFyZWFBdXRvc2l6ZSBleHRlbmRzIENka1RleHRhcmVhQXV0b3NpemUge1xuICBASW5wdXQoKVxuICBnZXQgbWF0QXV0b3NpemVNaW5Sb3dzKCk6IG51bWJlciB7IHJldHVybiB0aGlzLm1pblJvd3M7IH1cbiAgc2V0IG1hdEF1dG9zaXplTWluUm93cyh2YWx1ZTogbnVtYmVyKSB7IHRoaXMubWluUm93cyA9IHZhbHVlOyB9XG5cbiAgQElucHV0KClcbiAgZ2V0IG1hdEF1dG9zaXplTWF4Um93cygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5tYXhSb3dzOyB9XG4gIHNldCBtYXRBdXRvc2l6ZU1heFJvd3ModmFsdWU6IG51bWJlcikgeyB0aGlzLm1heFJvd3MgPSB2YWx1ZTsgfVxuXG4gIEBJbnB1dCgnbWF0LWF1dG9zaXplJylcbiAgZ2V0IG1hdEF1dG9zaXplKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5lbmFibGVkOyB9XG4gIHNldCBtYXRBdXRvc2l6ZSh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLmVuYWJsZWQgPSB2YWx1ZTsgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBtYXRUZXh0YXJlYUF1dG9zaXplKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5lbmFibGVkOyB9XG4gIHNldCBtYXRUZXh0YXJlYUF1dG9zaXplKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuZW5hYmxlZCA9IHZhbHVlOyB9XG59XG4iXX0=