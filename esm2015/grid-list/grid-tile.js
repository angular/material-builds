/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { Component, ViewEncapsulation, ElementRef, Input, Optional, ContentChildren, QueryList, Directive, ChangeDetectionStrategy, Inject, } from '@angular/core';
import { MatLine, setLines } from '@angular/material/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MAT_GRID_LIST } from './grid-list-base';
let MatGridTile = /** @class */ (() => {
    let MatGridTile = class MatGridTile {
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
    };
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], MatGridTile.prototype, "rowspan", null);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], MatGridTile.prototype, "colspan", null);
    MatGridTile = __decorate([
        Component({
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
        }),
        __param(1, Optional()), __param(1, Inject(MAT_GRID_LIST)),
        __metadata("design:paramtypes", [ElementRef, Object])
    ], MatGridTile);
    return MatGridTile;
})();
export { MatGridTile };
let MatGridTileText = /** @class */ (() => {
    let MatGridTileText = class MatGridTileText {
        constructor(_element) {
            this._element = _element;
        }
        ngAfterContentInit() {
            setLines(this._lines, this._element);
        }
    };
    __decorate([
        ContentChildren(MatLine, { descendants: true }),
        __metadata("design:type", QueryList)
    ], MatGridTileText.prototype, "_lines", void 0);
    MatGridTileText = __decorate([
        Component({
            selector: 'mat-grid-tile-header, mat-grid-tile-footer',
            template: "<ng-content select=\"[mat-grid-avatar], [matGridAvatar]\"></ng-content>\n<div class=\"mat-grid-list-text\"><ng-content select=\"[mat-line], [matLine]\"></ng-content></div>\n<ng-content></ng-content>\n",
            changeDetection: ChangeDetectionStrategy.OnPush,
            encapsulation: ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [ElementRef])
    ], MatGridTileText);
    return MatGridTileText;
})();
export { MatGridTileText };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
let MatGridAvatarCssMatStyler = /** @class */ (() => {
    let MatGridAvatarCssMatStyler = class MatGridAvatarCssMatStyler {
    };
    MatGridAvatarCssMatStyler = __decorate([
        Directive({
            selector: '[mat-grid-avatar], [matGridAvatar]',
            host: { 'class': 'mat-grid-avatar' }
        })
    ], MatGridAvatarCssMatStyler);
    return MatGridAvatarCssMatStyler;
})();
export { MatGridAvatarCssMatStyler };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
let MatGridTileHeaderCssMatStyler = /** @class */ (() => {
    let MatGridTileHeaderCssMatStyler = class MatGridTileHeaderCssMatStyler {
    };
    MatGridTileHeaderCssMatStyler = __decorate([
        Directive({
            selector: 'mat-grid-tile-header',
            host: { 'class': 'mat-grid-tile-header' }
        })
    ], MatGridTileHeaderCssMatStyler);
    return MatGridTileHeaderCssMatStyler;
})();
export { MatGridTileHeaderCssMatStyler };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
let MatGridTileFooterCssMatStyler = /** @class */ (() => {
    let MatGridTileFooterCssMatStyler = class MatGridTileFooterCssMatStyler {
    };
    MatGridTileFooterCssMatStyler = __decorate([
        Directive({
            selector: 'mat-grid-tile-footer',
            host: { 'class': 'mat-grid-tile-footer' }
        })
    ], MatGridTileFooterCssMatStyler);
    return MatGridTileFooterCssMatStyler;
})();
export { MatGridTileFooterCssMatStyler };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC10aWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLXRpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLFVBQVUsRUFDVixLQUFLLEVBQ0wsUUFBUSxFQUNSLGVBQWUsRUFDZixTQUFTLEVBRVQsU0FBUyxFQUNULHVCQUF1QixFQUN2QixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUMsb0JBQW9CLEVBQWMsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RSxPQUFPLEVBQUMsYUFBYSxFQUFrQixNQUFNLGtCQUFrQixDQUFDO0FBaUJoRTtJQUFBLElBQWEsV0FBVyxHQUF4QixNQUFhLFdBQVc7UUFJdEIsWUFDVSxRQUFpQyxFQUNDLFNBQTJCO1lBRDdELGFBQVEsR0FBUixRQUFRLENBQXlCO1lBQ0MsY0FBUyxHQUFULFNBQVMsQ0FBa0I7WUFMdkUsYUFBUSxHQUFXLENBQUMsQ0FBQztZQUNyQixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBSXFELENBQUM7UUFFM0Usa0RBQWtEO1FBRWxELElBQUksT0FBTyxLQUFhLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDL0MsSUFBSSxPQUFPLENBQUMsS0FBYSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2RixxREFBcUQ7UUFFckQsSUFBSSxPQUFPLEtBQWEsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLE9BQU8sQ0FBQyxLQUFhLElBQUks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ICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgUXVlcnlMaXN0LFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBEaXJlY3RpdmUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBJbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRMaW5lLCBzZXRMaW5lc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7TUFUX0dSSURfTElTVCwgTWF0R3JpZExpc3RCYXNlfSBmcm9tICcuL2dyaWQtbGlzdC1iYXNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWdyaWQtdGlsZScsXG4gIGV4cG9ydEFzOiAnbWF0R3JpZFRpbGUnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1ncmlkLXRpbGUnLFxuICAgIC8vIEVuc3VyZXMgdGhhdCB0aGUgXCJyb3dzcGFuXCIgYW5kIFwiY29sc3BhblwiIGlucHV0IHZhbHVlIGlzIHJlZmxlY3RlZCBpblxuICAgIC8vIHRoZSBET00uIFRoaXMgaXMgbmVlZGVkIGZvciB0aGUgZ3JpZC10aWxlIGhhcm5lc3MuXG4gICAgJ1thdHRyLnJvd3NwYW5dJzogJ3Jvd3NwYW4nLFxuICAgICdbYXR0ci5jb2xzcGFuXSc6ICdjb2xzcGFuJ1xuICB9LFxuICB0ZW1wbGF0ZVVybDogJ2dyaWQtdGlsZS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2dyaWQtbGlzdC5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlIHtcbiAgX3Jvd3NwYW46IG51bWJlciA9IDE7XG4gIF9jb2xzcGFuOiBudW1iZXIgPSAxO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0dSSURfTElTVCkgcHVibGljIF9ncmlkTGlzdD86IE1hdEdyaWRMaXN0QmFzZSkge31cblxuICAvKiogQW1vdW50IG9mIHJvd3MgdGhhdCB0aGUgZ3JpZCB0aWxlIHRha2VzIHVwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcm93c3BhbigpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fcm93c3BhbjsgfVxuICBzZXQgcm93c3Bhbih2YWx1ZTogbnVtYmVyKSB7IHRoaXMuX3Jvd3NwYW4gPSBNYXRoLnJvdW5kKGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKSk7IH1cblxuICAvKiogQW1vdW50IG9mIGNvbHVtbnMgdGhhdCB0aGUgZ3JpZCB0aWxlIHRha2VzIHVwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgY29sc3BhbigpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fY29sc3BhbjsgfVxuICBzZXQgY29sc3Bhbih2YWx1ZTogbnVtYmVyKSB7IHRoaXMuX2NvbHNwYW4gPSBNYXRoLnJvdW5kKGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKSk7IH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc3R5bGUgb2YgdGhlIGdyaWQtdGlsZSBlbGVtZW50LiAgTmVlZHMgdG8gYmUgc2V0IG1hbnVhbGx5IHRvIGF2b2lkXG4gICAqIFwiQ2hhbmdlZCBhZnRlciBjaGVja2VkXCIgZXJyb3JzIHRoYXQgd291bGQgb2NjdXIgd2l0aCBIb3N0QmluZGluZy5cbiAgICovXG4gIF9zZXRTdHlsZShwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZSBhcyBhbnkpW3Byb3BlcnR5XSA9IHZhbHVlO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3Jvd3NwYW46IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfY29sc3BhbjogTnVtYmVySW5wdXQ7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLXRpbGUtaGVhZGVyLCBtYXQtZ3JpZC10aWxlLWZvb3RlcicsXG4gIHRlbXBsYXRlVXJsOiAnZ3JpZC10aWxlLXRleHQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRHcmlkVGlsZVRleHQgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcbiAgQENvbnRlbnRDaGlsZHJlbihNYXRMaW5lLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfbGluZXM6IFF1ZXJ5TGlzdDxNYXRMaW5lPjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge31cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgc2V0TGluZXModGhpcy5fbGluZXMsIHRoaXMuX2VsZW1lbnQpO1xuICB9XG59XG5cbi8qKlxuICogRGlyZWN0aXZlIHdob3NlIHB1cnBvc2UgaXMgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nIHRvIHRoaXMgc2VsZWN0b3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtZ3JpZC1hdmF0YXJdLCBbbWF0R3JpZEF2YXRhcl0nLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1ncmlkLWF2YXRhcid9XG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRBdmF0YXJDc3NNYXRTdHlsZXIge31cblxuLyoqXG4gKiBEaXJlY3RpdmUgd2hvc2UgcHVycG9zZSBpcyB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcgdG8gdGhpcyBzZWxlY3Rvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWdyaWQtdGlsZS1oZWFkZXInLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1ncmlkLXRpbGUtaGVhZGVyJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZFRpbGVIZWFkZXJDc3NNYXRTdHlsZXIge31cblxuLyoqXG4gKiBEaXJlY3RpdmUgd2hvc2UgcHVycG9zZSBpcyB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcgdG8gdGhpcyBzZWxlY3Rvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWdyaWQtdGlsZS1mb290ZXInLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1ncmlkLXRpbGUtZm9vdGVyJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZFRpbGVGb290ZXJDc3NNYXRTdHlsZXIge31cbiJdfQ==