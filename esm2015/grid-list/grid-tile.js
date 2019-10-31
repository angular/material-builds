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
import { Component, ViewEncapsulation, ElementRef, Input, Optional, ContentChildren, QueryList, Directive, ChangeDetectionStrategy, Inject, } from '@angular/core';
import { MatLine, setLines } from '@angular/material/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MAT_GRID_LIST } from './grid-list-base';
export class MatGridTile {
    /**
     * @param {?} _element
     * @param {?=} _gridList
     */
    constructor(_element, _gridList) {
        this._element = _element;
        this._gridList = _gridList;
        this._rowspan = 1;
        this._colspan = 1;
    }
    /**
     * Amount of rows that the grid tile takes up.
     * @return {?}
     */
    get rowspan() { return this._rowspan; }
    /**
     * @param {?} value
     * @return {?}
     */
    set rowspan(value) { this._rowspan = Math.round(coerceNumberProperty(value)); }
    /**
     * Amount of columns that the grid tile takes up.
     * @return {?}
     */
    get colspan() { return this._colspan; }
    /**
     * @param {?} value
     * @return {?}
     */
    set colspan(value) { this._colspan = Math.round(coerceNumberProperty(value)); }
    /**
     * Sets the style of the grid-tile element.  Needs to be set manually to avoid
     * "Changed after checked" errors that would occur with HostBinding.
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    _setStyle(property, value) {
        ((/** @type {?} */ (this._element.nativeElement.style)))[property] = value;
    }
}
MatGridTile.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-grid-tile',
                exportAs: 'matGridTile',
                host: {
                    'class': 'mat-grid-tile',
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
if (false) {
    /** @type {?} */
    MatGridTile.ngAcceptInputType_rowspan;
    /** @type {?} */
    MatGridTile.ngAcceptInputType_colspan;
    /** @type {?} */
    MatGridTile.prototype._rowspan;
    /** @type {?} */
    MatGridTile.prototype._colspan;
    /**
     * @type {?}
     * @private
     */
    MatGridTile.prototype._element;
    /** @type {?} */
    MatGridTile.prototype._gridList;
}
export class MatGridTileText {
    /**
     * @param {?} _element
     */
    constructor(_element) {
        this._element = _element;
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        setLines(this._lines, this._element);
    }
}
MatGridTileText.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
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
if (false) {
    /** @type {?} */
    MatGridTileText.prototype._lines;
    /**
     * @type {?}
     * @private
     */
    MatGridTileText.prototype._element;
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
export class MatGridAvatarCssMatStyler {
}
MatGridAvatarCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: '[mat-grid-avatar], [matGridAvatar]',
                host: { 'class': 'mat-grid-avatar' }
            },] }
];
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
export class MatGridTileHeaderCssMatStyler {
}
MatGridTileHeaderCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'mat-grid-tile-header',
                host: { 'class': 'mat-grid-tile-header' }
            },] }
];
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
export class MatGridTileFooterCssMatStyler {
}
MatGridTileFooterCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'mat-grid-tile-footer',
                host: { 'class': 'mat-grid-tile-footer' }
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC10aWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLXRpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQ0wsU0FBUyxFQUNULGlCQUFpQixFQUNqQixVQUFVLEVBQ1YsS0FBSyxFQUNMLFFBQVEsRUFDUixlQUFlLEVBQ2YsU0FBUyxFQUVULFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGFBQWEsRUFBa0IsTUFBTSxrQkFBa0IsQ0FBQztBQWNoRSxNQUFNLE9BQU8sV0FBVzs7Ozs7SUFJdEIsWUFDVSxRQUFpQyxFQUNDLFNBQTJCO1FBRDdELGFBQVEsR0FBUixRQUFRLENBQXlCO1FBQ0MsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFMdkUsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixhQUFRLEdBQVcsQ0FBQyxDQUFDO0lBSXFELENBQUM7Ozs7O0lBRzNFLElBQ0ksT0FBTyxLQUFhLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQy9DLElBQUksT0FBTyxDQUFDLEtBQWEsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBR3ZGLElBQ0ksT0FBTyxLQUFhLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQy9DLElBQUksT0FBTyxDQUFDLEtBQWEsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7O0lBTXZGLFNBQVMsQ0FBQyxRQUFnQixFQUFFLEtBQVU7UUFDcEMsQ0FBQyxtQkFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUMvRCxDQUFDOzs7WUFwQ0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDbkIsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLGVBQWU7aUJBQ3pCO2dCQUNELG9JQUE2QjtnQkFFN0IsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOzthQUNoRDs7OztZQXpCQyxVQUFVOzRDQWdDUCxRQUFRLFlBQUksTUFBTSxTQUFDLGFBQWE7OztzQkFHbEMsS0FBSztzQkFLTCxLQUFLOzs7O0lBWU4sc0NBQWtEOztJQUNsRCxzQ0FBa0Q7O0lBMUJsRCwrQkFBcUI7O0lBQ3JCLCtCQUFxQjs7Ozs7SUFHbkIsK0JBQXlDOztJQUN6QyxnQ0FBcUU7O0FBK0J6RSxNQUFNLE9BQU8sZUFBZTs7OztJQUcxQixZQUFvQixRQUFpQztRQUFqQyxhQUFRLEdBQVIsUUFBUSxDQUF5QjtJQUFHLENBQUM7Ozs7SUFFekQsa0JBQWtCO1FBQ2hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2QyxDQUFDOzs7WUFkRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUNuQixRQUFRLEVBQUUsNENBQTRDO2dCQUN0RCxvTkFBa0M7Z0JBQ2xDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN0Qzs7OztZQTlEQyxVQUFVOzs7cUJBZ0VULGVBQWUsU0FBQyxPQUFPLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOzs7O0lBQTdDLGlDQUEwRTs7Ozs7SUFFOUQsbUNBQXlDOzs7Ozs7QUFldkQsTUFBTSxPQUFPLHlCQUF5Qjs7O1lBSnJDLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0NBQW9DO2dCQUM5QyxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUM7YUFDbkM7Ozs7OztBQVdELE1BQU0sT0FBTyw2QkFBNkI7OztZQUp6QyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFDO2FBQ3hDOzs7Ozs7QUFXRCxNQUFNLE9BQU8sNkJBQTZCOzs7WUFKekMsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBQzthQUN4QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgUXVlcnlMaXN0LFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBEaXJlY3RpdmUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBJbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRMaW5lLCBzZXRMaW5lc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtNQVRfR1JJRF9MSVNULCBNYXRHcmlkTGlzdEJhc2V9IGZyb20gJy4vZ3JpZC1saXN0LWJhc2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdtYXQtZ3JpZC10aWxlJyxcbiAgZXhwb3J0QXM6ICdtYXRHcmlkVGlsZScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWdyaWQtdGlsZScsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnZ3JpZC10aWxlLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZ3JpZC1saXN0LmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZFRpbGUge1xuICBfcm93c3BhbjogbnVtYmVyID0gMTtcbiAgX2NvbHNwYW46IG51bWJlciA9IDE7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfR1JJRF9MSVNUKSBwdWJsaWMgX2dyaWRMaXN0PzogTWF0R3JpZExpc3RCYXNlKSB7fVxuXG4gIC8qKiBBbW91bnQgb2Ygcm93cyB0aGF0IHRoZSBncmlkIHRpbGUgdGFrZXMgdXAuICovXG4gIEBJbnB1dCgpXG4gIGdldCByb3dzcGFuKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9yb3dzcGFuOyB9XG4gIHNldCByb3dzcGFuKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5fcm93c3BhbiA9IE1hdGgucm91bmQoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpKTsgfVxuXG4gIC8qKiBBbW91bnQgb2YgY29sdW1ucyB0aGF0IHRoZSBncmlkIHRpbGUgdGFrZXMgdXAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xzcGFuKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9jb2xzcGFuOyB9XG4gIHNldCBjb2xzcGFuKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5fY29sc3BhbiA9IE1hdGgucm91bmQoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpKTsgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdHlsZSBvZiB0aGUgZ3JpZC10aWxlIGVsZW1lbnQuICBOZWVkcyB0byBiZSBzZXQgbWFudWFsbHkgdG8gYXZvaWRcbiAgICogXCJDaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvcnMgdGhhdCB3b3VsZCBvY2N1ciB3aXRoIEhvc3RCaW5kaW5nLlxuICAgKi9cbiAgX3NldFN0eWxlKHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlIGFzIGFueSlbcHJvcGVydHldID0gdmFsdWU7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcm93c3BhbjogbnVtYmVyIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfY29sc3BhbjogbnVtYmVyIHwgc3RyaW5nO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdtYXQtZ3JpZC10aWxlLWhlYWRlciwgbWF0LWdyaWQtdGlsZS1mb290ZXInLFxuICB0ZW1wbGF0ZVVybDogJ2dyaWQtdGlsZS10ZXh0Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZFRpbGVUZXh0IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TGluZSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2xpbmVzOiBRdWVyeUxpc3Q8TWF0TGluZT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHt9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHNldExpbmVzKHRoaXMuX2xpbmVzLCB0aGlzLl9lbGVtZW50KTtcbiAgfVxufVxuXG4vKipcbiAqIERpcmVjdGl2ZSB3aG9zZSBwdXJwb3NlIGlzIHRvIGFkZCB0aGUgbWF0LSBDU1Mgc3R5bGluZyB0byB0aGlzIHNlbGVjdG9yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWdyaWQtYXZhdGFyXSwgW21hdEdyaWRBdmF0YXJdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZ3JpZC1hdmF0YXInfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRHcmlkQXZhdGFyQ3NzTWF0U3R5bGVyIHt9XG5cbi8qKlxuICogRGlyZWN0aXZlIHdob3NlIHB1cnBvc2UgaXMgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nIHRvIHRoaXMgc2VsZWN0b3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLXRpbGUtaGVhZGVyJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZ3JpZC10aWxlLWhlYWRlcid9XG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlSGVhZGVyQ3NzTWF0U3R5bGVyIHt9XG5cbi8qKlxuICogRGlyZWN0aXZlIHdob3NlIHB1cnBvc2UgaXMgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nIHRvIHRoaXMgc2VsZWN0b3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLXRpbGUtZm9vdGVyJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZ3JpZC10aWxlLWZvb3Rlcid9XG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlRm9vdGVyQ3NzTWF0U3R5bGVyIHt9XG4iXX0=