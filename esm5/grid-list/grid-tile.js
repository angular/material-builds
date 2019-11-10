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
var MatGridTile = /** @class */ (function () {
    function MatGridTile(_element, _gridList) {
        this._element = _element;
        this._gridList = _gridList;
        this._rowspan = 1;
        this._colspan = 1;
    }
    Object.defineProperty(MatGridTile.prototype, "rowspan", {
        /** Amount of rows that the grid tile takes up. */
        get: function () { return this._rowspan; },
        set: function (value) { this._rowspan = Math.round(coerceNumberProperty(value)); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatGridTile.prototype, "colspan", {
        /** Amount of columns that the grid tile takes up. */
        get: function () { return this._colspan; },
        set: function (value) { this._colspan = Math.round(coerceNumberProperty(value)); },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the style of the grid-tile element.  Needs to be set manually to avoid
     * "Changed after checked" errors that would occur with HostBinding.
     */
    MatGridTile.prototype._setStyle = function (property, value) {
        this._element.nativeElement.style[property] = value;
    };
    MatGridTile.decorators = [
        { type: Component, args: [{
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
    MatGridTile.ctorParameters = function () { return [
        { type: ElementRef },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_GRID_LIST,] }] }
    ]; };
    MatGridTile.propDecorators = {
        rowspan: [{ type: Input }],
        colspan: [{ type: Input }]
    };
    return MatGridTile;
}());
export { MatGridTile };
var MatGridTileText = /** @class */ (function () {
    function MatGridTileText(_element) {
        this._element = _element;
    }
    MatGridTileText.prototype.ngAfterContentInit = function () {
        setLines(this._lines, this._element);
    };
    MatGridTileText.decorators = [
        { type: Component, args: [{
                    selector: 'mat-grid-tile-header, mat-grid-tile-footer',
                    template: "<ng-content select=\"[mat-grid-avatar], [matGridAvatar]\"></ng-content>\n<div class=\"mat-grid-list-text\"><ng-content select=\"[mat-line], [matLine]\"></ng-content></div>\n<ng-content></ng-content>\n",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                }] }
    ];
    /** @nocollapse */
    MatGridTileText.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    MatGridTileText.propDecorators = {
        _lines: [{ type: ContentChildren, args: [MatLine, { descendants: true },] }]
    };
    return MatGridTileText;
}());
export { MatGridTileText };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
var MatGridAvatarCssMatStyler = /** @class */ (function () {
    function MatGridAvatarCssMatStyler() {
    }
    MatGridAvatarCssMatStyler.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-grid-avatar], [matGridAvatar]',
                    host: { 'class': 'mat-grid-avatar' }
                },] }
    ];
    return MatGridAvatarCssMatStyler;
}());
export { MatGridAvatarCssMatStyler };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
var MatGridTileHeaderCssMatStyler = /** @class */ (function () {
    function MatGridTileHeaderCssMatStyler() {
    }
    MatGridTileHeaderCssMatStyler.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-grid-tile-header',
                    host: { 'class': 'mat-grid-tile-header' }
                },] }
    ];
    return MatGridTileHeaderCssMatStyler;
}());
export { MatGridTileHeaderCssMatStyler };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
var MatGridTileFooterCssMatStyler = /** @class */ (function () {
    function MatGridTileFooterCssMatStyler() {
    }
    MatGridTileFooterCssMatStyler.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-grid-tile-footer',
                    host: { 'class': 'mat-grid-tile-footer' }
                },] }
    ];
    return MatGridTileFooterCssMatStyler;
}());
export { MatGridTileFooterCssMatStyler };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC10aWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLXRpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsVUFBVSxFQUNWLEtBQUssRUFDTCxRQUFRLEVBQ1IsZUFBZSxFQUNmLFNBQVMsRUFFVCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyxhQUFhLEVBQWtCLE1BQU0sa0JBQWtCLENBQUM7QUFFaEU7SUFlRSxxQkFDVSxRQUFpQyxFQUNDLFNBQTJCO1FBRDdELGFBQVEsR0FBUixRQUFRLENBQXlCO1FBQ0MsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFMdkUsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixhQUFRLEdBQVcsQ0FBQyxDQUFDO0lBSXFELENBQUM7SUFHM0Usc0JBQ0ksZ0NBQU87UUFGWCxrREFBa0Q7YUFDbEQsY0FDd0IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzthQUMvQyxVQUFZLEtBQWEsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUR4QztJQUkvQyxzQkFDSSxnQ0FBTztRQUZYLHFEQUFxRDthQUNyRCxjQUN3QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2FBQy9DLFVBQVksS0FBYSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BRHhDO0lBRy9DOzs7T0FHRztJQUNILCtCQUFTLEdBQVQsVUFBVSxRQUFnQixFQUFFLEtBQVU7UUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUMvRCxDQUFDOztnQkFuQ0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO29CQUN6QixRQUFRLEVBQUUsYUFBYTtvQkFDdkIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxlQUFlO3FCQUN6QjtvQkFDRCxvSUFBNkI7b0JBRTdCLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7aUJBQ2hEOzs7O2dCQXhCQyxVQUFVO2dEQStCUCxRQUFRLFlBQUksTUFBTSxTQUFDLGFBQWE7OzswQkFHbEMsS0FBSzswQkFLTCxLQUFLOztJQWNSLGtCQUFDO0NBQUEsQUF2Q0QsSUF1Q0M7U0E1QlksV0FBVztBQThCeEI7SUFTRSx5QkFBb0IsUUFBaUM7UUFBakMsYUFBUSxHQUFSLFFBQVEsQ0FBeUI7SUFBRyxDQUFDO0lBRXpELDRDQUFrQixHQUFsQjtRQUNFLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2QyxDQUFDOztnQkFiRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLDRDQUE0QztvQkFDdEQsb05BQWtDO29CQUNsQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7aUJBQ3RDOzs7O2dCQTVEQyxVQUFVOzs7eUJBOERULGVBQWUsU0FBQyxPQUFPLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOztJQU8vQyxzQkFBQztDQUFBLEFBZEQsSUFjQztTQVJZLGVBQWU7QUFVNUI7OztHQUdHO0FBQ0g7SUFBQTtJQUl3QyxDQUFDOztnQkFKeEMsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxvQ0FBb0M7b0JBQzlDLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBQztpQkFDbkM7O0lBQ3VDLGdDQUFDO0NBQUEsQUFKekMsSUFJeUM7U0FBNUIseUJBQXlCO0FBRXRDOzs7R0FHRztBQUNIO0lBQUE7SUFJNEMsQ0FBQzs7Z0JBSjVDLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUM7aUJBQ3hDOztJQUMyQyxvQ0FBQztDQUFBLEFBSjdDLElBSTZDO1NBQWhDLDZCQUE2QjtBQUUxQzs7O0dBR0c7QUFDSDtJQUFBO0lBSTRDLENBQUM7O2dCQUo1QyxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFDO2lCQUN4Qzs7SUFDMkMsb0NBQUM7Q0FBQSxBQUo3QyxJQUk2QztTQUFoQyw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE9wdGlvbmFsLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIFF1ZXJ5TGlzdCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgSW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0TGluZSwgc2V0TGluZXN9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtjb2VyY2VOdW1iZXJQcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7TUFUX0dSSURfTElTVCwgTWF0R3JpZExpc3RCYXNlfSBmcm9tICcuL2dyaWQtbGlzdC1iYXNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWdyaWQtdGlsZScsXG4gIGV4cG9ydEFzOiAnbWF0R3JpZFRpbGUnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1ncmlkLXRpbGUnLFxuICB9LFxuICB0ZW1wbGF0ZVVybDogJ2dyaWQtdGlsZS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2dyaWQtbGlzdC5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlIHtcbiAgX3Jvd3NwYW46IG51bWJlciA9IDE7XG4gIF9jb2xzcGFuOiBudW1iZXIgPSAxO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0dSSURfTElTVCkgcHVibGljIF9ncmlkTGlzdD86IE1hdEdyaWRMaXN0QmFzZSkge31cblxuICAvKiogQW1vdW50IG9mIHJvd3MgdGhhdCB0aGUgZ3JpZCB0aWxlIHRha2VzIHVwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcm93c3BhbigpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fcm93c3BhbjsgfVxuICBzZXQgcm93c3Bhbih2YWx1ZTogbnVtYmVyKSB7IHRoaXMuX3Jvd3NwYW4gPSBNYXRoLnJvdW5kKGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKSk7IH1cblxuICAvKiogQW1vdW50IG9mIGNvbHVtbnMgdGhhdCB0aGUgZ3JpZCB0aWxlIHRha2VzIHVwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgY29sc3BhbigpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fY29sc3BhbjsgfVxuICBzZXQgY29sc3Bhbih2YWx1ZTogbnVtYmVyKSB7IHRoaXMuX2NvbHNwYW4gPSBNYXRoLnJvdW5kKGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKSk7IH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc3R5bGUgb2YgdGhlIGdyaWQtdGlsZSBlbGVtZW50LiAgTmVlZHMgdG8gYmUgc2V0IG1hbnVhbGx5IHRvIGF2b2lkXG4gICAqIFwiQ2hhbmdlZCBhZnRlciBjaGVja2VkXCIgZXJyb3JzIHRoYXQgd291bGQgb2NjdXIgd2l0aCBIb3N0QmluZGluZy5cbiAgICovXG4gIF9zZXRTdHlsZShwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZSBhcyBhbnkpW3Byb3BlcnR5XSA9IHZhbHVlO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3Jvd3NwYW46IG51bWJlciB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jb2xzcGFuOiBudW1iZXIgfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZ3JpZC10aWxlLWhlYWRlciwgbWF0LWdyaWQtdGlsZS1mb290ZXInLFxuICB0ZW1wbGF0ZVVybDogJ2dyaWQtdGlsZS10ZXh0Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZFRpbGVUZXh0IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TGluZSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2xpbmVzOiBRdWVyeUxpc3Q8TWF0TGluZT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHt9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHNldExpbmVzKHRoaXMuX2xpbmVzLCB0aGlzLl9lbGVtZW50KTtcbiAgfVxufVxuXG4vKipcbiAqIERpcmVjdGl2ZSB3aG9zZSBwdXJwb3NlIGlzIHRvIGFkZCB0aGUgbWF0LSBDU1Mgc3R5bGluZyB0byB0aGlzIHNlbGVjdG9yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWdyaWQtYXZhdGFyXSwgW21hdEdyaWRBdmF0YXJdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZ3JpZC1hdmF0YXInfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRHcmlkQXZhdGFyQ3NzTWF0U3R5bGVyIHt9XG5cbi8qKlxuICogRGlyZWN0aXZlIHdob3NlIHB1cnBvc2UgaXMgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nIHRvIHRoaXMgc2VsZWN0b3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLXRpbGUtaGVhZGVyJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZ3JpZC10aWxlLWhlYWRlcid9XG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlSGVhZGVyQ3NzTWF0U3R5bGVyIHt9XG5cbi8qKlxuICogRGlyZWN0aXZlIHdob3NlIHB1cnBvc2UgaXMgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nIHRvIHRoaXMgc2VsZWN0b3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLXRpbGUtZm9vdGVyJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZ3JpZC10aWxlLWZvb3Rlcid9XG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlRm9vdGVyQ3NzTWF0U3R5bGVyIHt9XG4iXX0=