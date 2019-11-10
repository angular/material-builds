/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Directive, Input } from '@angular/core';
/**
 * Directive to automatically resize a textarea to fit its content.
 * @deprecated Use `cdkTextareaAutosize` from `@angular/cdk/text-field` instead.
 * @breaking-change 8.0.0
 */
var MatTextareaAutosize = /** @class */ (function (_super) {
    __extends(MatTextareaAutosize, _super);
    function MatTextareaAutosize() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MatTextareaAutosize.prototype, "matAutosizeMinRows", {
        get: function () { return this.minRows; },
        set: function (value) { this.minRows = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatTextareaAutosize.prototype, "matAutosizeMaxRows", {
        get: function () { return this.maxRows; },
        set: function (value) { this.maxRows = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatTextareaAutosize.prototype, "matAutosize", {
        get: function () { return this.enabled; },
        set: function (value) { this.enabled = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatTextareaAutosize.prototype, "matTextareaAutosize", {
        get: function () { return this.enabled; },
        set: function (value) { this.enabled = value; },
        enumerable: true,
        configurable: true
    });
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
    return MatTextareaAutosize;
}(CdkTextareaAutosize));
export { MatTextareaAutosize };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b3NpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvaW5wdXQvYXV0b3NpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQzVELE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRS9DOzs7O0dBSUc7QUFDSDtJQVl5Qyx1Q0FBbUI7SUFaNUQ7O0lBZ0NBLENBQUM7SUFuQkMsc0JBQ0ksbURBQWtCO2FBRHRCLGNBQ21DLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDekQsVUFBdUIsS0FBYSxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BRE47SUFHekQsc0JBQ0ksbURBQWtCO2FBRHRCLGNBQ21DLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDekQsVUFBdUIsS0FBYSxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BRE47SUFHekQsc0JBQ0ksNENBQVc7YUFEZixjQUM2QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ25ELFVBQWdCLEtBQWMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUROO0lBR25ELHNCQUNJLG9EQUFtQjthQUR2QixjQUNxQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQzNELFVBQXdCLEtBQWMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUROOztnQkExQjVELFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsdURBQXVEO29CQUNqRSxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixNQUFNLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxvQkFBb0IsQ0FBQztvQkFDcEQsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxvQ0FBb0M7d0JBQzdDLHlGQUF5Rjt3QkFDekYsNEZBQTRGO3dCQUM1RixNQUFNLEVBQUUsR0FBRzt3QkFDWCxTQUFTLEVBQUUscUJBQXFCO3FCQUNqQztpQkFDRjs7O3FDQUVFLEtBQUs7cUNBSUwsS0FBSzs4QkFJTCxLQUFLLFNBQUMsY0FBYztzQ0FJcEIsS0FBSzs7SUFPUiwwQkFBQztDQUFBLEFBaENELENBWXlDLG1CQUFtQixHQW9CM0Q7U0FwQlksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2RrVGV4dGFyZWFBdXRvc2l6ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RleHQtZmllbGQnO1xuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBEaXJlY3RpdmUgdG8gYXV0b21hdGljYWxseSByZXNpemUgYSB0ZXh0YXJlYSB0byBmaXQgaXRzIGNvbnRlbnQuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYGNka1RleHRhcmVhQXV0b3NpemVgIGZyb20gYEBhbmd1bGFyL2Nkay90ZXh0LWZpZWxkYCBpbnN0ZWFkLlxuICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICd0ZXh0YXJlYVttYXQtYXV0b3NpemVdLCB0ZXh0YXJlYVttYXRUZXh0YXJlYUF1dG9zaXplXScsXG4gIGV4cG9ydEFzOiAnbWF0VGV4dGFyZWFBdXRvc2l6ZScsXG4gIGlucHV0czogWydjZGtBdXRvc2l6ZU1pblJvd3MnLCAnY2RrQXV0b3NpemVNYXhSb3dzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnY2RrLXRleHRhcmVhLWF1dG9zaXplIG1hdC1hdXRvc2l6ZScsXG4gICAgLy8gVGV4dGFyZWEgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBkaXJlY3RpdmUgYXBwbGllZCBzaG91bGQgaGF2ZSBhIHNpbmdsZSByb3cgYnkgZGVmYXVsdC5cbiAgICAvLyBCcm93c2VycyBub3JtYWxseSBzaG93IHR3byByb3dzIGJ5IGRlZmF1bHQgYW5kIHRoZXJlZm9yZSB0aGlzIGxpbWl0cyB0aGUgbWluUm93cyBiaW5kaW5nLlxuICAgICdyb3dzJzogJzEnLFxuICAgICcoaW5wdXQpJzogJ19ub29wSW5wdXRIYW5kbGVyKCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUZXh0YXJlYUF1dG9zaXplIGV4dGVuZHMgQ2RrVGV4dGFyZWFBdXRvc2l6ZSB7XG4gIEBJbnB1dCgpXG4gIGdldCBtYXRBdXRvc2l6ZU1pblJvd3MoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMubWluUm93czsgfVxuICBzZXQgbWF0QXV0b3NpemVNaW5Sb3dzKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5taW5Sb3dzID0gdmFsdWU7IH1cblxuICBASW5wdXQoKVxuICBnZXQgbWF0QXV0b3NpemVNYXhSb3dzKCk6IG51bWJlciB7IHJldHVybiB0aGlzLm1heFJvd3M7IH1cbiAgc2V0IG1hdEF1dG9zaXplTWF4Um93cyh2YWx1ZTogbnVtYmVyKSB7IHRoaXMubWF4Um93cyA9IHZhbHVlOyB9XG5cbiAgQElucHV0KCdtYXQtYXV0b3NpemUnKVxuICBnZXQgbWF0QXV0b3NpemUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmVuYWJsZWQ7IH1cbiAgc2V0IG1hdEF1dG9zaXplKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuZW5hYmxlZCA9IHZhbHVlOyB9XG5cbiAgQElucHV0KClcbiAgZ2V0IG1hdFRleHRhcmVhQXV0b3NpemUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmVuYWJsZWQ7IH1cbiAgc2V0IG1hdFRleHRhcmVhQXV0b3NpemUodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5lbmFibGVkID0gdmFsdWU7IH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbWluUm93czogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX21heFJvd3M6IG51bWJlciB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9lbmFibGVkOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbn1cbiJdfQ==