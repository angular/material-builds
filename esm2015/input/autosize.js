/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Directive, Input } from '@angular/core';
/**
 * Directive to automatically resize a textarea to fit its content.
 * @deprecated Use `cdkTextareaAutosize` from `@angular/cdk/text-field` instead.
 * @breaking-change 8.0.0
 */
let MatTextareaAutosize = /** @class */ (() => {
    let MatTextareaAutosize = class MatTextareaAutosize extends CdkTextareaAutosize {
        get matAutosizeMinRows() { return this.minRows; }
        set matAutosizeMinRows(value) { this.minRows = value; }
        get matAutosizeMaxRows() { return this.maxRows; }
        set matAutosizeMaxRows(value) { this.maxRows = value; }
        get matAutosize() { return this.enabled; }
        set matAutosize(value) { this.enabled = value; }
        get matTextareaAutosize() { return this.enabled; }
        set matTextareaAutosize(value) { this.enabled = value; }
    };
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], MatTextareaAutosize.prototype, "matAutosizeMinRows", null);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], MatTextareaAutosize.prototype, "matAutosizeMaxRows", null);
    __decorate([
        Input('mat-autosize'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatTextareaAutosize.prototype, "matAutosize", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatTextareaAutosize.prototype, "matTextareaAutosize", null);
    MatTextareaAutosize = __decorate([
        Directive({
            selector: 'textarea[mat-autosize], textarea[matTextareaAutosize]',
            exportAs: 'matTextareaAutosize',
            inputs: ['cdkAutosizeMinRows', 'cdkAutosizeMaxRows'],
            host: {
                'class': 'cdk-textarea-autosize mat-autosize',
                // Textarea elements that have the directive applied should have a single row by default.
                // Browsers normally show two rows by default and therefore this limits the minRows binding.
                'rows': '1',
            },
        })
    ], MatTextareaAutosize);
    return MatTextareaAutosize;
})();
export { MatTextareaAutosize };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b3NpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvaW5wdXQvYXV0b3NpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQzVELE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRS9DOzs7O0dBSUc7QUFZSDtJQUFBLElBQWEsbUJBQW1CLEdBQWhDLE1BQWEsbUJBQW9CLFNBQVEsbUJBQW1CO1FBRTFELElBQUksa0JBQWtCLEtBQWEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLGtCQUFrQixDQUFDLEtBQWEsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFHL0QsSUFBSSxrQkFBa0IsS0FBYSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQUksa0JBQWtCLENBQUMsS0FBYSxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUcvRCxJQUFJLFdBQVcsS0FBYyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ25ELElBQUksV0FBVyxDQUFDLEtBQWMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFHekQsSUFBSSxtQkFBbUIsS0FBYyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzNELElBQUksbUJBQW1CLENBQUMsS0FBYyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUNsRSxDQUFBO0lBZEM7UUFEQyxLQUFLLEVBQUU7OztpRUFDaUQ7SUFJekQ7UUFEQyxLQUFLLEVBQUU7OztpRUFDaUQ7SUFJekQ7UUFEQyxLQUFLLENBQUMsY0FBYyxDQUFDOzs7MERBQzZCO0lBSW5EO1FBREMsS0FBSyxFQUFFOzs7a0VBQ21EO0lBZGhELG1CQUFtQjtRQVgvQixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsdURBQXVEO1lBQ2pFLFFBQVEsRUFBRSxxQkFBcUI7WUFDL0IsTUFBTSxFQUFFLENBQUMsb0JBQW9CLEVBQUUsb0JBQW9CLENBQUM7WUFDcEQsSUFBSSxFQUFFO2dCQUNKLE9BQU8sRUFBRSxvQ0FBb0M7Z0JBQzdDLHlGQUF5RjtnQkFDekYsNEZBQTRGO2dCQUM1RixNQUFNLEVBQUUsR0FBRzthQUNaO1NBQ0YsQ0FBQztPQUNXLG1CQUFtQixDQWdCL0I7SUFBRCwwQkFBQztLQUFBO1NBaEJZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Nka1RleHRhcmVhQXV0b3NpemV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXh0LWZpZWxkJztcbmltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogRGlyZWN0aXZlIHRvIGF1dG9tYXRpY2FsbHkgcmVzaXplIGEgdGV4dGFyZWEgdG8gZml0IGl0cyBjb250ZW50LlxuICogQGRlcHJlY2F0ZWQgVXNlIGBjZGtUZXh0YXJlYUF1dG9zaXplYCBmcm9tIGBAYW5ndWxhci9jZGsvdGV4dC1maWVsZGAgaW5zdGVhZC5cbiAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAndGV4dGFyZWFbbWF0LWF1dG9zaXplXSwgdGV4dGFyZWFbbWF0VGV4dGFyZWFBdXRvc2l6ZV0nLFxuICBleHBvcnRBczogJ21hdFRleHRhcmVhQXV0b3NpemUnLFxuICBpbnB1dHM6IFsnY2RrQXV0b3NpemVNaW5Sb3dzJywgJ2Nka0F1dG9zaXplTWF4Um93cyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ2Nkay10ZXh0YXJlYS1hdXRvc2l6ZSBtYXQtYXV0b3NpemUnLFxuICAgIC8vIFRleHRhcmVhIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgZGlyZWN0aXZlIGFwcGxpZWQgc2hvdWxkIGhhdmUgYSBzaW5nbGUgcm93IGJ5IGRlZmF1bHQuXG4gICAgLy8gQnJvd3NlcnMgbm9ybWFsbHkgc2hvdyB0d28gcm93cyBieSBkZWZhdWx0IGFuZCB0aGVyZWZvcmUgdGhpcyBsaW1pdHMgdGhlIG1pblJvd3MgYmluZGluZy5cbiAgICAncm93cyc6ICcxJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGV4dGFyZWFBdXRvc2l6ZSBleHRlbmRzIENka1RleHRhcmVhQXV0b3NpemUge1xuICBASW5wdXQoKVxuICBnZXQgbWF0QXV0b3NpemVNaW5Sb3dzKCk6IG51bWJlciB7IHJldHVybiB0aGlzLm1pblJvd3M7IH1cbiAgc2V0IG1hdEF1dG9zaXplTWluUm93cyh2YWx1ZTogbnVtYmVyKSB7IHRoaXMubWluUm93cyA9IHZhbHVlOyB9XG5cbiAgQElucHV0KClcbiAgZ2V0IG1hdEF1dG9zaXplTWF4Um93cygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5tYXhSb3dzOyB9XG4gIHNldCBtYXRBdXRvc2l6ZU1heFJvd3ModmFsdWU6IG51bWJlcikgeyB0aGlzLm1heFJvd3MgPSB2YWx1ZTsgfVxuXG4gIEBJbnB1dCgnbWF0LWF1dG9zaXplJylcbiAgZ2V0IG1hdEF1dG9zaXplKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5lbmFibGVkOyB9XG4gIHNldCBtYXRBdXRvc2l6ZSh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLmVuYWJsZWQgPSB2YWx1ZTsgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBtYXRUZXh0YXJlYUF1dG9zaXplKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5lbmFibGVkOyB9XG4gIHNldCBtYXRUZXh0YXJlYUF1dG9zaXplKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuZW5hYmxlZCA9IHZhbHVlOyB9XG59XG4iXX0=