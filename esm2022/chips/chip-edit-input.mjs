/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
/**
 * A directive that makes a span editable and exposes functions to modify and retrieve the
 * element's contents.
 */
class MatChipEditInput {
    constructor(_elementRef, _document) {
        this._elementRef = _elementRef;
        this._document = _document;
    }
    initialize(initialValue) {
        this.getNativeElement().focus();
        this.setValue(initialValue);
    }
    getNativeElement() {
        return this._elementRef.nativeElement;
    }
    setValue(value) {
        this.getNativeElement().textContent = value;
        this._moveCursorToEndOfInput();
    }
    getValue() {
        return this.getNativeElement().textContent || '';
    }
    _moveCursorToEndOfInput() {
        const range = this._document.createRange();
        range.selectNodeContents(this.getNativeElement());
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatChipEditInput, deps: [{ token: i0.ElementRef }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatChipEditInput, selector: "span[matChipEditInput]", host: { attributes: { "role": "textbox", "tabindex": "-1", "contenteditable": "true" }, classAttribute: "mat-chip-edit-input" }, ngImport: i0 }); }
}
export { MatChipEditInput };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatChipEditInput, decorators: [{
            type: Directive,
            args: [{
                    selector: 'span[matChipEditInput]',
                    host: {
                        'class': 'mat-chip-edit-input',
                        'role': 'textbox',
                        'tabindex': '-1',
                        'contenteditable': 'true',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1lZGl0LWlucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoaXBzL2NoaXAtZWRpdC1pbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDOztBQUV6Qzs7O0dBR0c7QUFDSCxNQVNhLGdCQUFnQjtJQUMzQixZQUNtQixXQUF1QixFQUNMLFNBQWM7UUFEaEMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDTCxjQUFTLEdBQVQsU0FBUyxDQUFLO0lBQ2hELENBQUM7SUFFSixVQUFVLENBQUMsWUFBb0I7UUFDN0IsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztJQUN4QyxDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQWE7UUFDcEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUM1QyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQztJQUNuRCxDQUFDO0lBRU8sdUJBQXVCO1FBQzdCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDM0MsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDbEQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFHLENBQUM7UUFDbkMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3RCLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEIsQ0FBQzs4R0EvQlUsZ0JBQWdCLDRDQUdqQixRQUFRO2tHQUhQLGdCQUFnQjs7U0FBaEIsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBVDVCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtvQkFDbEMsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxxQkFBcUI7d0JBQzlCLE1BQU0sRUFBRSxTQUFTO3dCQUNqQixVQUFVLEVBQUUsSUFBSTt3QkFDaEIsaUJBQWlCLEVBQUUsTUFBTTtxQkFDMUI7aUJBQ0Y7OzBCQUlJLE1BQU07MkJBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBtYWtlcyBhIHNwYW4gZWRpdGFibGUgYW5kIGV4cG9zZXMgZnVuY3Rpb25zIHRvIG1vZGlmeSBhbmQgcmV0cmlldmUgdGhlXG4gKiBlbGVtZW50J3MgY29udGVudHMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ3NwYW5bbWF0Q2hpcEVkaXRJbnB1dF0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jaGlwLWVkaXQtaW5wdXQnLFxuICAgICdyb2xlJzogJ3RleHRib3gnLFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ2NvbnRlbnRlZGl0YWJsZSc6ICd0cnVlJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcEVkaXRJbnB1dCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSByZWFkb25seSBfZG9jdW1lbnQ6IGFueSxcbiAgKSB7fVxuXG4gIGluaXRpYWxpemUoaW5pdGlhbFZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmdldE5hdGl2ZUVsZW1lbnQoKS5mb2N1cygpO1xuICAgIHRoaXMuc2V0VmFsdWUoaW5pdGlhbFZhbHVlKTtcbiAgfVxuXG4gIGdldE5hdGl2ZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBzZXRWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5nZXROYXRpdmVFbGVtZW50KCkudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICB0aGlzLl9tb3ZlQ3Vyc29yVG9FbmRPZklucHV0KCk7XG4gIH1cblxuICBnZXRWYWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldE5hdGl2ZUVsZW1lbnQoKS50ZXh0Q29udGVudCB8fCAnJztcbiAgfVxuXG4gIHByaXZhdGUgX21vdmVDdXJzb3JUb0VuZE9mSW5wdXQoKSB7XG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyh0aGlzLmdldE5hdGl2ZUVsZW1lbnQoKSk7XG4gICAgcmFuZ2UuY29sbGFwc2UoZmFsc2UpO1xuICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKSE7XG4gICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIHNlbC5hZGRSYW5nZShyYW5nZSk7XG4gIH1cbn1cbiJdfQ==