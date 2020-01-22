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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b3NpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvaW5wdXQvYXV0b3NpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQzVELE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRS9DOzs7O0dBSUc7QUFDSDtJQVd5Qyx1Q0FBbUI7SUFYNUQ7O0lBMkJBLENBQUM7SUFmQyxzQkFDSSxtREFBa0I7YUFEdEIsY0FDbUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUN6RCxVQUF1QixLQUFhLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FETjtJQUd6RCxzQkFDSSxtREFBa0I7YUFEdEIsY0FDbUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUN6RCxVQUF1QixLQUFhLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FETjtJQUd6RCxzQkFDSSw0Q0FBVzthQURmLGNBQzZCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDbkQsVUFBZ0IsS0FBYyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BRE47SUFHbkQsc0JBQ0ksb0RBQW1CO2FBRHZCLGNBQ3FDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDM0QsVUFBd0IsS0FBYyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BRE47O2dCQXpCNUQsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx1REFBdUQ7b0JBQ2pFLFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLE1BQU0sRUFBRSxDQUFDLG9CQUFvQixFQUFFLG9CQUFvQixDQUFDO29CQUNwRCxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLG9DQUFvQzt3QkFDN0MseUZBQXlGO3dCQUN6Riw0RkFBNEY7d0JBQzVGLE1BQU0sRUFBRSxHQUFHO3FCQUNaO2lCQUNGOzs7cUNBRUUsS0FBSztxQ0FJTCxLQUFLOzhCQUlMLEtBQUssU0FBQyxjQUFjO3NDQUlwQixLQUFLOztJQUdSLDBCQUFDO0NBQUEsQUEzQkQsQ0FXeUMsbUJBQW1CLEdBZ0IzRDtTQWhCWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDZGtUZXh0YXJlYUF1dG9zaXplfSBmcm9tICdAYW5ndWxhci9jZGsvdGV4dC1maWVsZCc7XG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIERpcmVjdGl2ZSB0byBhdXRvbWF0aWNhbGx5IHJlc2l6ZSBhIHRleHRhcmVhIHRvIGZpdCBpdHMgY29udGVudC5cbiAqIEBkZXByZWNhdGVkIFVzZSBgY2RrVGV4dGFyZWFBdXRvc2l6ZWAgZnJvbSBgQGFuZ3VsYXIvY2RrL3RleHQtZmllbGRgIGluc3RlYWQuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ3RleHRhcmVhW21hdC1hdXRvc2l6ZV0sIHRleHRhcmVhW21hdFRleHRhcmVhQXV0b3NpemVdJyxcbiAgZXhwb3J0QXM6ICdtYXRUZXh0YXJlYUF1dG9zaXplJyxcbiAgaW5wdXRzOiBbJ2Nka0F1dG9zaXplTWluUm93cycsICdjZGtBdXRvc2l6ZU1heFJvd3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdjZGstdGV4dGFyZWEtYXV0b3NpemUgbWF0LWF1dG9zaXplJyxcbiAgICAvLyBUZXh0YXJlYSBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIGRpcmVjdGl2ZSBhcHBsaWVkIHNob3VsZCBoYXZlIGEgc2luZ2xlIHJvdyBieSBkZWZhdWx0LlxuICAgIC8vIEJyb3dzZXJzIG5vcm1hbGx5IHNob3cgdHdvIHJvd3MgYnkgZGVmYXVsdCBhbmQgdGhlcmVmb3JlIHRoaXMgbGltaXRzIHRoZSBtaW5Sb3dzIGJpbmRpbmcuXG4gICAgJ3Jvd3MnOiAnMScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRleHRhcmVhQXV0b3NpemUgZXh0ZW5kcyBDZGtUZXh0YXJlYUF1dG9zaXplIHtcbiAgQElucHV0KClcbiAgZ2V0IG1hdEF1dG9zaXplTWluUm93cygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5taW5Sb3dzOyB9XG4gIHNldCBtYXRBdXRvc2l6ZU1pblJvd3ModmFsdWU6IG51bWJlcikgeyB0aGlzLm1pblJvd3MgPSB2YWx1ZTsgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBtYXRBdXRvc2l6ZU1heFJvd3MoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMubWF4Um93czsgfVxuICBzZXQgbWF0QXV0b3NpemVNYXhSb3dzKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5tYXhSb3dzID0gdmFsdWU7IH1cblxuICBASW5wdXQoJ21hdC1hdXRvc2l6ZScpXG4gIGdldCBtYXRBdXRvc2l6ZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuZW5hYmxlZDsgfVxuICBzZXQgbWF0QXV0b3NpemUodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5lbmFibGVkID0gdmFsdWU7IH1cblxuICBASW5wdXQoKVxuICBnZXQgbWF0VGV4dGFyZWFBdXRvc2l6ZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuZW5hYmxlZDsgfVxuICBzZXQgbWF0VGV4dGFyZWFBdXRvc2l6ZSh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLmVuYWJsZWQgPSB2YWx1ZTsgfVxufVxuIl19