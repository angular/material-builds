/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ViewEncapsulation, ElementRef, Input, Optional, ContentChildren, QueryList, Directive, ChangeDetectionStrategy, Inject, } from '@angular/core';
import { MatLine, setLines } from '@angular/material/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MAT_GRID_LIST } from './grid-list-base';
let MatGridTile = /** @class */ (() => {
    class MatGridTile {
        constructor(_element, _gridList) {
            this._element = _element;
            this._gridList = _gridList;
            this._rowspan = 1;
            this._colspan = 1;
        }
        /** Amount of rows that the grid tile takes up. */
        get rowspan() { return this._rowspan; }
        set rowspan(value) { this._rowspan = Math.round(coerceNumberProperty(value)); }
        /** Amount of columns that the grid tile takes up. */
        get colspan() { return this._colspan; }
        set colspan(value) { this._colspan = Math.round(coerceNumberProperty(value)); }
        /**
         * Sets the style of the grid-tile element.  Needs to be set manually to avoid
         * "Changed after checked" errors that would occur with HostBinding.
         */
        _setStyle(property, value) {
            this._element.nativeElement.style[property] = value;
        }
    }
    MatGridTile.decorators = [
        { type: Component, args: [{
                    selector: 'mat-grid-tile',
                    exportAs: 'matGridTile',
                    host: {
                        'class': 'mat-grid-tile',
                        // Ensures that the "rowspan" and "colspan" input value is reflected in
                        // the DOM. This is needed for the grid-tile harness.
                        '[attr.rowspan]': 'rowspan',
                        '[attr.colspan]': 'colspan'
                    },
                    template: "<!-- TODO(kara): Revisit why this is a figure.-->\n<figure class=\"mat-figure\">\n  <ng-content></ng-content>\n</figure>",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-figure{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}\n"]
                }] }
    ];
    /** @nocollapse */
    MatGridTile.ctorParameters = () => [
        { type: ElementRef },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_GRID_LIST,] }] }
    ];
    MatGridTile.propDecorators = {
        rowspan: [{ type: Input }],
        colspan: [{ type: Input }]
    };
    return MatGridTile;
})();
export { MatGridTile };
let MatGridTileText = /** @class */ (() => {
    class MatGridTileText {
        constructor(_element) {
            this._element = _element;
        }
        ngAfterContentInit() {
            setLines(this._lines, this._element);
        }
    }
    MatGridTileText.decorators = [
        { type: Component, args: [{
                    selector: 'mat-grid-tile-header, mat-grid-tile-footer',
                    template: "<ng-content select=\"[mat-grid-avatar], [matGridAvatar]\"></ng-content>\n<div class=\"mat-grid-list-text\"><ng-content select=\"[mat-line], [matLine]\"></ng-content></div>\n<ng-content></ng-content>\n",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                }] }
    ];
    /** @nocollapse */
    MatGridTileText.ctorParameters = () => [
        { type: ElementRef }
    ];
    MatGridTileText.propDecorators = {
        _lines: [{ type: ContentChildren, args: [MatLine, { descendants: true },] }]
    };
    return MatGridTileText;
})();
export { MatGridTileText };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
let MatGridAvatarCssMatStyler = /** @class */ (() => {
    class MatGridAvatarCssMatStyler {
    }
    MatGridAvatarCssMatStyler.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-grid-avatar], [matGridAvatar]',
                    host: { 'class': 'mat-grid-avatar' }
                },] }
    ];
    return MatGridAvatarCssMatStyler;
})();
export { MatGridAvatarCssMatStyler };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
let MatGridTileHeaderCssMatStyler = /** @class */ (() => {
    class MatGridTileHeaderCssMatStyler {
    }
    MatGridTileHeaderCssMatStyler.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-grid-tile-header',
                    host: { 'class': 'mat-grid-tile-header' }
                },] }
    ];
    return MatGridTileHeaderCssMatStyler;
})();
export { MatGridTileHeaderCssMatStyler };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
let MatGridTileFooterCssMatStyler = /** @class */ (() => {
    class MatGridTileFooterCssMatStyler {
    }
    MatGridTileFooterCssMatStyler.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-grid-tile-footer',
                    host: { 'class': 'mat-grid-tile-footer' }
                },] }
    ];
    return MatGridTileFooterCssMatStyler;
})();
export { MatGridTileFooterCssMatStyler };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC10aWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLXRpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsVUFBVSxFQUNWLEtBQUssRUFDTCxRQUFRLEVBQ1IsZUFBZSxFQUNmLFNBQVMsRUFFVCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxvQkFBb0IsRUFBYyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxhQUFhLEVBQWtCLE1BQU0sa0JBQWtCLENBQUM7QUFFaEU7SUFBQSxNQWVhLFdBQVc7UUFJdEIsWUFDVSxRQUFpQyxFQUNDLFNBQTJCO1lBRDdELGFBQVEsR0FBUixRQUFRLENBQXlCO1lBQ0MsY0FBUyxHQUFULFNBQVMsQ0FBa0I7WUFMdkUsYUFBUSxHQUFXLENBQUMsQ0FBQztZQUNyQixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBSXFELENBQUM7UUFFM0Usa0RBQWtEO1FBQ2xELElBQ0ksT0FBTyxLQUFhLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDL0MsSUFBSSxPQUFPLENBQUMsS0FBYSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2RixxREFBcUQ7UUFDckQsSUFDSSxPQUFPLEtBQWEsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLE9BQU8sQ0FBQyxLQUFhLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXZGOzs7V0FHRztRQUNILFNBQVMsQ0FBQyxRQUFnQixFQUFFLEtBQVU7WUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUMvRCxDQUFDOzs7Z0JBdkNGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsZUFBZTt3QkFDeEIsdUVBQXVFO3dCQUN2RSxxREFBcUQ7d0JBQ3JELGdCQUFnQixFQUFFLFNBQVM7d0JBQzNCLGdCQUFnQixFQUFFLFNBQVM7cUJBQzVCO29CQUNELG9JQUE2QjtvQkFFN0IsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztpQkFDaEQ7Ozs7Z0JBNUJDLFVBQVU7Z0RBbUNQLFFBQVEsWUFBSSxNQUFNLFNBQUMsYUFBYTs7OzBCQUdsQyxLQUFLOzBCQUtMLEtBQUs7O0lBY1Isa0JBQUM7S0FBQTtTQTVCWSxXQUFXO0FBOEJ4QjtJQUFBLE1BTWEsZUFBZTtRQUcxQixZQUFvQixRQUFpQztZQUFqQyxhQUFRLEdBQVIsUUFBUSxDQUF5QjtRQUFHLENBQUM7UUFFekQsa0JBQWtCO1lBQ2hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QyxDQUFDOzs7Z0JBYkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSw0Q0FBNEM7b0JBQ3RELG9OQUFrQztvQkFDbEMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2lCQUN0Qzs7OztnQkFoRUMsVUFBVTs7O3lCQWtFVCxlQUFlLFNBQUMsT0FBTyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzs7SUFPL0Msc0JBQUM7S0FBQTtTQVJZLGVBQWU7QUFVNUI7OztHQUdHO0FBQ0g7SUFBQSxNQUlhLHlCQUF5Qjs7O2dCQUpyQyxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLG9DQUFvQztvQkFDOUMsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFDO2lCQUNuQzs7SUFDdUMsZ0NBQUM7S0FBQTtTQUE1Qix5QkFBeUI7QUFFdEM7OztHQUdHO0FBQ0g7SUFBQSxNQUlhLDZCQUE2Qjs7O2dCQUp6QyxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFDO2lCQUN4Qzs7SUFDMkMsb0NBQUM7S0FBQTtTQUFoQyw2QkFBNkI7QUFFMUM7OztHQUdHO0FBQ0g7SUFBQSxNQUlhLDZCQUE2Qjs7O2dCQUp6QyxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFDO2lCQUN4Qzs7SUFDMkMsb0NBQUM7S0FBQTtTQUFoQyw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE9wdGlvbmFsLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIFF1ZXJ5TGlzdCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgSW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0TGluZSwgc2V0TGluZXN9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtjb2VyY2VOdW1iZXJQcm9wZXJ0eSwgTnVtYmVySW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge01BVF9HUklEX0xJU1QsIE1hdEdyaWRMaXN0QmFzZX0gZnJvbSAnLi9ncmlkLWxpc3QtYmFzZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLXRpbGUnLFxuICBleHBvcnRBczogJ21hdEdyaWRUaWxlJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZ3JpZC10aWxlJyxcbiAgICAvLyBFbnN1cmVzIHRoYXQgdGhlIFwicm93c3BhblwiIGFuZCBcImNvbHNwYW5cIiBpbnB1dCB2YWx1ZSBpcyByZWZsZWN0ZWQgaW5cbiAgICAvLyB0aGUgRE9NLiBUaGlzIGlzIG5lZWRlZCBmb3IgdGhlIGdyaWQtdGlsZSBoYXJuZXNzLlxuICAgICdbYXR0ci5yb3dzcGFuXSc6ICdyb3dzcGFuJyxcbiAgICAnW2F0dHIuY29sc3Bhbl0nOiAnY29sc3BhbidcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICdncmlkLXRpbGUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydncmlkLWxpc3QuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRHcmlkVGlsZSB7XG4gIF9yb3dzcGFuOiBudW1iZXIgPSAxO1xuICBfY29sc3BhbjogbnVtYmVyID0gMTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9HUklEX0xJU1QpIHB1YmxpYyBfZ3JpZExpc3Q/OiBNYXRHcmlkTGlzdEJhc2UpIHt9XG5cbiAgLyoqIEFtb3VudCBvZiByb3dzIHRoYXQgdGhlIGdyaWQgdGlsZSB0YWtlcyB1cC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJvd3NwYW4oKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3Jvd3NwYW47IH1cbiAgc2V0IHJvd3NwYW4odmFsdWU6IG51bWJlcikgeyB0aGlzLl9yb3dzcGFuID0gTWF0aC5yb3VuZChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSkpOyB9XG5cbiAgLyoqIEFtb3VudCBvZiBjb2x1bW5zIHRoYXQgdGhlIGdyaWQgdGlsZSB0YWtlcyB1cC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGNvbHNwYW4oKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2NvbHNwYW47IH1cbiAgc2V0IGNvbHNwYW4odmFsdWU6IG51bWJlcikgeyB0aGlzLl9jb2xzcGFuID0gTWF0aC5yb3VuZChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSkpOyB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN0eWxlIG9mIHRoZSBncmlkLXRpbGUgZWxlbWVudC4gIE5lZWRzIHRvIGJlIHNldCBtYW51YWxseSB0byBhdm9pZFxuICAgKiBcIkNoYW5nZWQgYWZ0ZXIgY2hlY2tlZFwiIGVycm9ycyB0aGF0IHdvdWxkIG9jY3VyIHdpdGggSG9zdEJpbmRpbmcuXG4gICAqL1xuICBfc2V0U3R5bGUocHJvcGVydHk6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgICh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUgYXMgYW55KVtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yb3dzcGFuOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NvbHNwYW46IE51bWJlcklucHV0O1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZ3JpZC10aWxlLWhlYWRlciwgbWF0LWdyaWQtdGlsZS1mb290ZXInLFxuICB0ZW1wbGF0ZVVybDogJ2dyaWQtdGlsZS10ZXh0Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZFRpbGVUZXh0IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TGluZSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2xpbmVzOiBRdWVyeUxpc3Q8TWF0TGluZT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHt9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHNldExpbmVzKHRoaXMuX2xpbmVzLCB0aGlzLl9lbGVtZW50KTtcbiAgfVxufVxuXG4vKipcbiAqIERpcmVjdGl2ZSB3aG9zZSBwdXJwb3NlIGlzIHRvIGFkZCB0aGUgbWF0LSBDU1Mgc3R5bGluZyB0byB0aGlzIHNlbGVjdG9yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWdyaWQtYXZhdGFyXSwgW21hdEdyaWRBdmF0YXJdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZ3JpZC1hdmF0YXInfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRHcmlkQXZhdGFyQ3NzTWF0U3R5bGVyIHt9XG5cbi8qKlxuICogRGlyZWN0aXZlIHdob3NlIHB1cnBvc2UgaXMgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nIHRvIHRoaXMgc2VsZWN0b3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLXRpbGUtaGVhZGVyJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZ3JpZC10aWxlLWhlYWRlcid9XG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlSGVhZGVyQ3NzTWF0U3R5bGVyIHt9XG5cbi8qKlxuICogRGlyZWN0aXZlIHdob3NlIHB1cnBvc2UgaXMgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nIHRvIHRoaXMgc2VsZWN0b3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLXRpbGUtZm9vdGVyJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZ3JpZC10aWxlLWZvb3Rlcid9XG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlRm9vdGVyQ3NzTWF0U3R5bGVyIHt9XG4iXX0=