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
                    moduleId: module.id,
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
        _lines: [{ type: ContentChildren, args: [MatLine,] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC10aWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLXRpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsVUFBVSxFQUNWLEtBQUssRUFDTCxRQUFRLEVBQ1IsZUFBZSxFQUNmLFNBQVMsRUFFVCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyxhQUFhLEVBQWtCLE1BQU0sa0JBQWtCLENBQUM7QUFFaEU7SUFnQkUscUJBQ1UsUUFBaUMsRUFDQyxTQUEyQjtRQUQ3RCxhQUFRLEdBQVIsUUFBUSxDQUF5QjtRQUNDLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBTHZFLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsYUFBUSxHQUFXLENBQUMsQ0FBQztJQUlxRCxDQUFDO0lBRzNFLHNCQUNJLGdDQUFPO1FBRlgsa0RBQWtEO2FBQ2xELGNBQ3dCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7YUFDL0MsVUFBWSxLQUFhLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FEeEM7SUFJL0Msc0JBQ0ksZ0NBQU87UUFGWCxxREFBcUQ7YUFDckQsY0FDd0IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzthQUMvQyxVQUFZLEtBQWEsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUR4QztJQUcvQzs7O09BR0c7SUFDSCwrQkFBUyxHQUFULFVBQVUsUUFBZ0IsRUFBRSxLQUFVO1FBQ25DLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDL0QsQ0FBQzs7Z0JBcENGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7b0JBQ25CLFFBQVEsRUFBRSxlQUFlO29CQUN6QixRQUFRLEVBQUUsYUFBYTtvQkFDdkIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxlQUFlO3FCQUN6QjtvQkFDRCxvSUFBNkI7b0JBRTdCLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7aUJBQ2hEOzs7O2dCQXpCQyxVQUFVO2dEQWdDUCxRQUFRLFlBQUksTUFBTSxTQUFDLGFBQWE7OzswQkFHbEMsS0FBSzswQkFLTCxLQUFLOztJQVdSLGtCQUFDO0NBQUEsQUFyQ0QsSUFxQ0M7U0F6QlksV0FBVztBQTJCeEI7SUFVRSx5QkFBb0IsUUFBaUM7UUFBakMsYUFBUSxHQUFSLFFBQVEsQ0FBeUI7SUFBRyxDQUFDO0lBRXpELDRDQUFrQixHQUFsQjtRQUNFLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2QyxDQUFDOztnQkFkRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO29CQUNuQixRQUFRLEVBQUUsNENBQTRDO29CQUN0RCxvTkFBa0M7b0JBQ2xDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtpQkFDdEM7Ozs7Z0JBM0RDLFVBQVU7Ozt5QkE2RFQsZUFBZSxTQUFDLE9BQU87O0lBTzFCLHNCQUFDO0NBQUEsQUFmRCxJQWVDO1NBUlksZUFBZTtBQVU1Qjs7O0dBR0c7QUFDSDtJQUFBO0lBSXdDLENBQUM7O2dCQUp4QyxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLG9DQUFvQztvQkFDOUMsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFDO2lCQUNuQzs7SUFDdUMsZ0NBQUM7Q0FBQSxBQUp6QyxJQUl5QztTQUE1Qix5QkFBeUI7QUFFdEM7OztHQUdHO0FBQ0g7SUFBQTtJQUk0QyxDQUFDOztnQkFKNUMsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBQztpQkFDeEM7O0lBQzJDLG9DQUFDO0NBQUEsQUFKN0MsSUFJNkM7U0FBaEMsNkJBQTZCO0FBRTFDOzs7R0FHRztBQUNIO0lBQUE7SUFJNEMsQ0FBQzs7Z0JBSjVDLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUM7aUJBQ3hDOztJQUMyQyxvQ0FBQztDQUFBLEFBSjdDLElBSTZDO1NBQWhDLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgUXVlcnlMaXN0LFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBEaXJlY3RpdmUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBJbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRMaW5lLCBzZXRMaW5lc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtNQVRfR1JJRF9MSVNULCBNYXRHcmlkTGlzdEJhc2V9IGZyb20gJy4vZ3JpZC1saXN0LWJhc2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdtYXQtZ3JpZC10aWxlJyxcbiAgZXhwb3J0QXM6ICdtYXRHcmlkVGlsZScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWdyaWQtdGlsZScsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnZ3JpZC10aWxlLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZ3JpZC1saXN0LmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZFRpbGUge1xuICBfcm93c3BhbjogbnVtYmVyID0gMTtcbiAgX2NvbHNwYW46IG51bWJlciA9IDE7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfR1JJRF9MSVNUKSBwdWJsaWMgX2dyaWRMaXN0PzogTWF0R3JpZExpc3RCYXNlKSB7fVxuXG4gIC8qKiBBbW91bnQgb2Ygcm93cyB0aGF0IHRoZSBncmlkIHRpbGUgdGFrZXMgdXAuICovXG4gIEBJbnB1dCgpXG4gIGdldCByb3dzcGFuKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9yb3dzcGFuOyB9XG4gIHNldCByb3dzcGFuKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5fcm93c3BhbiA9IE1hdGgucm91bmQoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpKTsgfVxuXG4gIC8qKiBBbW91bnQgb2YgY29sdW1ucyB0aGF0IHRoZSBncmlkIHRpbGUgdGFrZXMgdXAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xzcGFuKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9jb2xzcGFuOyB9XG4gIHNldCBjb2xzcGFuKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5fY29sc3BhbiA9IE1hdGgucm91bmQoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpKTsgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdHlsZSBvZiB0aGUgZ3JpZC10aWxlIGVsZW1lbnQuICBOZWVkcyB0byBiZSBzZXQgbWFudWFsbHkgdG8gYXZvaWRcbiAgICogXCJDaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvcnMgdGhhdCB3b3VsZCBvY2N1ciB3aXRoIEhvc3RCaW5kaW5nLlxuICAgKi9cbiAgX3NldFN0eWxlKHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlIGFzIGFueSlbcHJvcGVydHldID0gdmFsdWU7XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnbWF0LWdyaWQtdGlsZS1oZWFkZXIsIG1hdC1ncmlkLXRpbGUtZm9vdGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdncmlkLXRpbGUtdGV4dC5odG1sJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlVGV4dCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICBAQ29udGVudENoaWxkcmVuKE1hdExpbmUpIF9saW5lczogUXVlcnlMaXN0PE1hdExpbmU+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7fVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBzZXRMaW5lcyh0aGlzLl9saW5lcywgdGhpcy5fZWxlbWVudCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXJlY3RpdmUgd2hvc2UgcHVycG9zZSBpcyB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcgdG8gdGhpcyBzZWxlY3Rvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1ncmlkLWF2YXRhcl0sIFttYXRHcmlkQXZhdGFyXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWdyaWQtYXZhdGFyJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZEF2YXRhckNzc01hdFN0eWxlciB7fVxuXG4vKipcbiAqIERpcmVjdGl2ZSB3aG9zZSBwdXJwb3NlIGlzIHRvIGFkZCB0aGUgbWF0LSBDU1Mgc3R5bGluZyB0byB0aGlzIHNlbGVjdG9yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtZ3JpZC10aWxlLWhlYWRlcicsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWdyaWQtdGlsZS1oZWFkZXInfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRHcmlkVGlsZUhlYWRlckNzc01hdFN0eWxlciB7fVxuXG4vKipcbiAqIERpcmVjdGl2ZSB3aG9zZSBwdXJwb3NlIGlzIHRvIGFkZCB0aGUgbWF0LSBDU1Mgc3R5bGluZyB0byB0aGlzIHNlbGVjdG9yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtZ3JpZC10aWxlLWZvb3RlcicsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWdyaWQtdGlsZS1mb290ZXInfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRHcmlkVGlsZUZvb3RlckNzc01hdFN0eWxlciB7fVxuIl19