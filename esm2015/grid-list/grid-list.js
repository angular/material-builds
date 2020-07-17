/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ViewEncapsulation, Input, ContentChildren, QueryList, ElementRef, Optional, ChangeDetectionStrategy, } from '@angular/core';
import { MatGridTile } from './grid-tile';
import { TileCoordinator } from './tile-coordinator';
import { FitTileStyler, RatioTileStyler, FixedTileStyler, } from './tile-styler';
import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MAT_GRID_LIST } from './grid-list-base';
// TODO(kara): Conditional (responsive) column count / row size.
// TODO(kara): Re-layout on window resize / media change (debounced).
// TODO(kara): gridTileHeader and gridTileFooter.
const MAT_FIT_MODE = 'fit';
export class MatGridList {
    constructor(_element, _dir) {
        this._element = _element;
        this._dir = _dir;
        /** The amount of space between tiles. This will be something like '5px' or '2em'. */
        this._gutter = '1px';
    }
    /** Amount of columns in the grid list. */
    get cols() { return this._cols; }
    set cols(value) {
        this._cols = Math.max(1, Math.round(coerceNumberProperty(value)));
    }
    /** Size of the grid list's gutter in pixels. */
    get gutterSize() { return this._gutter; }
    set gutterSize(value) { this._gutter = `${value == null ? '' : value}`; }
    /** Set internal representation of row height from the user-provided value. */
    get rowHeight() { return this._rowHeight; }
    set rowHeight(value) {
        const newValue = `${value == null ? '' : value}`;
        if (newValue !== this._rowHeight) {
            this._rowHeight = newValue;
            this._setTileStyler(this._rowHeight);
        }
    }
    ngOnInit() {
        this._checkCols();
        this._checkRowHeight();
    }
    /**
     * The layout calculation is fairly cheap if nothing changes, so there's little cost
     * to run it frequently.
     */
    ngAfterContentChecked() {
        this._layoutTiles();
    }
    /** Throw a friendly error if cols property is missing */
    _checkCols() {
        if (!this.cols) {
            throw Error(`mat-grid-list: must pass in number of columns. ` +
                `Example: <mat-grid-list cols="3">`);
        }
    }
    /** Default to equal width:height if rowHeight property is missing */
    _checkRowHeight() {
        if (!this._rowHeight) {
            this._setTileStyler('1:1');
        }
    }
    /** Creates correct Tile Styler subtype based on rowHeight passed in by user */
    _setTileStyler(rowHeight) {
        if (this._tileStyler) {
            this._tileStyler.reset(this);
        }
        if (rowHeight === MAT_FIT_MODE) {
            this._tileStyler = new FitTileStyler();
        }
        else if (rowHeight && rowHeight.indexOf(':') > -1) {
            this._tileStyler = new RatioTileStyler(rowHeight);
        }
        else {
            this._tileStyler = new FixedTileStyler(rowHeight);
        }
    }
    /** Computes and applies the size and position for all children grid tiles. */
    _layoutTiles() {
        if (!this._tileCoordinator) {
            this._tileCoordinator = new TileCoordinator();
        }
        const tracker = this._tileCoordinator;
        const tiles = this._tiles.filter(tile => !tile._gridList || tile._gridList === this);
        const direction = this._dir ? this._dir.value : 'ltr';
        this._tileCoordinator.update(this.cols, tiles);
        this._tileStyler.init(this.gutterSize, tracker, this.cols, direction);
        tiles.forEach((tile, index) => {
            const pos = tracker.positions[index];
            this._tileStyler.setStyle(tile, pos.row, pos.col);
        });
        this._setListStyle(this._tileStyler.getComputedHeight());
    }
    /** Sets style on the main grid-list element, given the style name and value. */
    _setListStyle(style) {
        if (style) {
            this._element.nativeElement.style[style[0]] = style[1];
        }
    }
}
MatGridList.decorators = [
    { type: Component, args: [{
                selector: 'mat-grid-list',
                exportAs: 'matGridList',
                template: "<div>\n  <ng-content></ng-content>\n</div>",
                host: {
                    'class': 'mat-grid-list',
                    // Ensures that the "cols" input value is reflected in the DOM. This is
                    // needed for the grid-list harness.
                    '[attr.cols]': 'cols',
                },
                providers: [{
                        provide: MAT_GRID_LIST,
                        useExisting: MatGridList
                    }],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-figure{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}\n"]
            },] }
];
MatGridList.ctorParameters = () => [
    { type: ElementRef },
    { type: Directionality, decorators: [{ type: Optional }] }
];
MatGridList.propDecorators = {
    _tiles: [{ type: ContentChildren, args: [MatGridTile, { descendants: true },] }],
    cols: [{ type: Input }],
    gutterSize: [{ type: Input }],
    rowHeight: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLWxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFHakIsS0FBSyxFQUNMLGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFFBQVEsRUFDUix1QkFBdUIsR0FDeEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxFQUVMLGFBQWEsRUFDYixlQUFlLEVBQ2YsZUFBZSxHQUVoQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLG9CQUFvQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGFBQWEsRUFBa0IsTUFBTSxrQkFBa0IsQ0FBQztBQUdoRSxnRUFBZ0U7QUFDaEUscUVBQXFFO0FBQ3JFLGlEQUFpRDtBQUVqRCxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUM7QUFvQjNCLE1BQU0sT0FBTyxXQUFXO0lBd0J0QixZQUFvQixRQUFpQyxFQUNyQixJQUFvQjtRQURoQyxhQUFRLEdBQVIsUUFBUSxDQUF5QjtRQUNyQixTQUFJLEdBQUosSUFBSSxDQUFnQjtRQVZwRCxxRkFBcUY7UUFDN0UsWUFBTyxHQUFXLEtBQUssQ0FBQztJQVN1QixDQUFDO0lBRXhELDBDQUEwQztJQUMxQyxJQUNJLElBQUksS0FBYSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLElBQUksSUFBSSxDQUFDLEtBQWE7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJ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cUJBQ3pCLENBQUM7Z0JBQ0YsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN0Qzs7O1lBekNDLFVBQVU7WUFhSixjQUFjLHVCQXNEUCxRQUFROzs7cUJBSHBCLGVBQWUsU0FBQyxXQUFXLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO21CQU1oRCxLQUFLO3lCQU9MLEtBQUs7d0JBS0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBPbkluaXQsXG4gIElucHV0LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIFF1ZXJ5TGlzdCxcbiAgRWxlbWVudFJlZixcbiAgT3B0aW9uYWwsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0R3JpZFRpbGV9IGZyb20gJy4vZ3JpZC10aWxlJztcbmltcG9ydCB7VGlsZUNvb3JkaW5hdG9yfSBmcm9tICcuL3RpbGUtY29vcmRpbmF0b3InO1xuaW1wb3J0IHtcbiAgVGlsZVN0eWxlcixcbiAgRml0VGlsZVN0eWxlcixcbiAgUmF0aW9UaWxlU3R5bGVyLFxuICBGaXhlZFRpbGVTdHlsZXIsXG4gIFRpbGVTdHlsZVRhcmdldCxcbn0gZnJvbSAnLi90aWxlLXN0eWxlcic7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7TUFUX0dSSURfTElTVCwgTWF0R3JpZExpc3RCYXNlfSBmcm9tICcuL2dyaWQtbGlzdC1iYXNlJztcblxuXG4vLyBUT0RPKGthcmEpOiBDb25kaXRpb25hbCAocmVzcG9uc2l2ZSkgY29sdW1uIGNvdW50IC8gcm93IHNpemUuXG4vLyBUT0RPKGthcmEpOiBSZS1sYXlvdXQgb24gd2luZG93IHJlc2l6ZSAvIG1lZGlhIGNoYW5nZSAoZGVib3VuY2VkKS5cbi8vIFRPRE8oa2FyYSk6IGdyaWRUaWxlSGVhZGVyIGFuZCBncmlkVGlsZUZvb3Rlci5cblxuY29uc3QgTUFUX0ZJVF9NT0RFID0gJ2ZpdCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLWxpc3QnLFxuICBleHBvcnRBczogJ21hdEdyaWRMaXN0JyxcbiAgdGVtcGxhdGVVcmw6ICdncmlkLWxpc3QuaHRtbCcsXG4gIHN0eWxlVXJsczogWydncmlkLWxpc3QuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWdyaWQtbGlzdCcsXG4gICAgLy8gRW5zdXJlcyB0aGF0IHRoZSBcImNvbHNcIiBpbnB1dCB2YWx1ZSBpcyByZWZsZWN0ZWQgaW4gdGhlIERPTS4gVGhpcyBpc1xuICAgIC8vIG5lZWRlZCBmb3IgdGhlIGdyaWQtbGlzdCBoYXJuZXNzLlxuICAgICdbYXR0ci5jb2xzXSc6ICdjb2xzJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe1xuICAgIHByb3ZpZGU6IE1BVF9HUklEX0xJU1QsXG4gICAgdXNlRXhpc3Rpbmc6IE1hdEdyaWRMaXN0XG4gIH1dLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZExpc3QgaW1wbGVtZW50cyBNYXRHcmlkTGlzdEJhc2UsIE9uSW5pdCwgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgVGlsZVN0eWxlVGFyZ2V0IHtcbiAgLyoqIE51bWJlciBvZiBjb2x1bW5zIGJlaW5nIHJlbmRlcmVkLiAqL1xuICBwcml2YXRlIF9jb2xzOiBudW1iZXI7XG5cbiAgLyoqIFVzZWQgZm9yIGRldGVybWluaW5ndGhlIHBvc2l0aW9uIG9mIGVhY2ggdGlsZSBpbiB0aGUgZ3JpZC4gKi9cbiAgcHJpdmF0ZSBfdGlsZUNvb3JkaW5hdG9yOiBUaWxlQ29vcmRpbmF0b3I7XG5cbiAgLyoqXG4gICAqIFJvdyBoZWlnaHQgdmFsdWUgcGFzc2VkIGluIGJ5IHVzZXIuIFRoaXMgY2FuIGJlIG9uZSBvZiB0aHJlZSB0eXBlczpcbiAgICogLSBOdW1iZXIgdmFsdWUgKGV4OiBcIjEwMHB4XCIpOiAgc2V0cyBhIGZpeGVkIHJvdyBoZWlnaHQgdG8gdGhhdCB2YWx1ZVxuICAgKiAtIFJhdGlvIHZhbHVlIChleDogXCI0OjNcIik6IHNldHMgdGhlIHJvdyBoZWlnaHQgYmFzZWQgb24gd2lkdGg6aGVpZ2h0IHJhdGlvXG4gICAqIC0gXCJGaXRcIiBtb2RlIChleDogXCJmaXRcIik6IHNldHMgdGhlIHJvdyBoZWlnaHQgdG8gdG90YWwgaGVpZ2h0IGRpdmlkZWQgYnkgbnVtYmVyIG9mIHJvd3NcbiAgICovXG4gIHByaXZhdGUgX3Jvd0hlaWdodDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgYW1vdW50IG9mIHNwYWNlIGJldHdlZW4gdGlsZXMuIFRoaXMgd2lsbCBiZSBzb21ldGhpbmcgbGlrZSAnNXB4JyBvciAnMmVtJy4gKi9cbiAgcHJpdmF0ZSBfZ3V0dGVyOiBzdHJpbmcgPSAnMXB4JztcblxuICAvKiogU2V0cyBwb3NpdGlvbiBhbmQgc2l6ZSBzdHlsZXMgZm9yIGEgdGlsZSAqL1xuICBwcml2YXRlIF90aWxlU3R5bGVyOiBUaWxlU3R5bGVyO1xuXG4gIC8qKiBRdWVyeSBsaXN0IG9mIHRpbGVzIHRoYXQgYXJlIGJlaW5nIHJlbmRlcmVkLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdEdyaWRUaWxlLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfdGlsZXM6IFF1ZXJ5TGlzdDxNYXRHcmlkVGlsZT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHkpIHt9XG5cbiAgLyoqIEFtb3VudCBvZiBjb2x1bW5zIGluIHRoZSBncmlkIGxpc3QuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xzKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9jb2xzOyB9XG4gIHNldCBjb2xzKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9jb2xzID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSkpKTtcbiAgfVxuXG4gIC8qKiBTaXplIG9mIHRoZSBncmlkIGxpc3QncyBndXR0ZXIgaW4gcGl4ZWxzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZ3V0dGVyU2l6ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZ3V0dGVyOyB9XG4gIHNldCBndXR0ZXJTaXplKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5fZ3V0dGVyID0gYCR7dmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWV9YDsgfVxuXG4gIC8qKiBTZXQgaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2Ygcm93IGhlaWdodCBmcm9tIHRoZSB1c2VyLXByb3ZpZGVkIHZhbHVlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcm93SGVpZ2h0KCk6IHN0cmluZyB8IG51bWJlciB7IHJldHVybiB0aGlzLl9yb3dIZWlnaHQ7IH1cbiAgc2V0IHJvd0hlaWdodCh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBgJHt2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZX1gO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9yb3dIZWlnaHQpIHtcbiAgICAgIHRoaXMuX3Jvd0hlaWdodCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fc2V0VGlsZVN0eWxlcih0aGlzLl9yb3dIZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2NoZWNrQ29scygpO1xuICAgIHRoaXMuX2NoZWNrUm93SGVpZ2h0KCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGxheW91dCBjYWxjdWxhdGlvbiBpcyBmYWlybHkgY2hlYXAgaWYgbm90aGluZyBjaGFuZ2VzLCBzbyB0aGVyZSdzIGxpdHRsZSBjb3N0XG4gICAqIHRvIHJ1biBpdCBmcmVxdWVudGx5LlxuICAgKi9cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIHRoaXMuX2xheW91dFRpbGVzKCk7XG4gIH1cblxuICAvKiogVGhyb3cgYSBmcmllbmRseSBlcnJvciBpZiBjb2xzIHByb3BlcnR5IGlzIG1pc3NpbmcgKi9cbiAgcHJpdmF0ZSBfY2hlY2tDb2xzKCkge1xuICAgIGlmICghdGhpcy5jb2xzKSB7XG4gICAgICB0aHJvdyBFcnJvcihgbWF0LWdyaWQtbGlzdDogbXVzdCBwYXNzIGluIG51bWJlciBvZiBjb2x1bW5zLiBgICtcbiAgICAgICAgICAgICAgICAgIGBFeGFtcGxlOiA8bWF0LWdyaWQtbGlzdCBjb2xzPVwiM1wiPmApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZWZhdWx0IHRvIGVxdWFsIHdpZHRoOmhlaWdodCBpZiByb3dIZWlnaHQgcHJvcGVydHkgaXMgbWlzc2luZyAqL1xuICBwcml2YXRlIF9jaGVja1Jvd0hlaWdodCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3Jvd0hlaWdodCkge1xuICAgICAgdGhpcy5fc2V0VGlsZVN0eWxlcignMToxJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENyZWF0ZXMgY29ycmVjdCBUaWxlIFN0eWxlciBzdWJ0eXBlIGJhc2VkIG9uIHJvd0hlaWdodCBwYXNzZWQgaW4gYnkgdXNlciAqL1xuICBwcml2YXRlIF9zZXRUaWxlU3R5bGVyKHJvd0hlaWdodDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3RpbGVTdHlsZXIpIHtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIucmVzZXQodGhpcyk7XG4gICAgfVxuXG4gICAgaWYgKHJvd0hlaWdodCA9PT0gTUFUX0ZJVF9NT0RFKSB7XG4gICAgICB0aGlzLl90aWxlU3R5bGVyID0gbmV3IEZpdFRpbGVTdHlsZXIoKTtcbiAgICB9IGVsc2UgaWYgKHJvd0hlaWdodCAmJiByb3dIZWlnaHQuaW5kZXhPZignOicpID4gLTEpIHtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIgPSBuZXcgUmF0aW9UaWxlU3R5bGVyKHJvd0hlaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIgPSBuZXcgRml4ZWRUaWxlU3R5bGVyKHJvd0hlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENvbXB1dGVzIGFuZCBhcHBsaWVzIHRoZSBzaXplIGFuZCBwb3NpdGlvbiBmb3IgYWxsIGNoaWxkcmVuIGdyaWQgdGlsZXMuICovXG4gIHByaXZhdGUgX2xheW91dFRpbGVzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fdGlsZUNvb3JkaW5hdG9yKSB7XG4gICAgICB0aGlzLl90aWxlQ29vcmRpbmF0b3IgPSBuZXcgVGlsZUNvb3JkaW5hdG9yKCk7XG4gICAgfVxuXG5cbiAgICBjb25zdCB0cmFja2VyID0gdGhpcy5fdGlsZUNvb3JkaW5hdG9yO1xuICAgIGNvbnN0IHRpbGVzID0gdGhpcy5fdGlsZXMuZmlsdGVyKHRpbGUgPT4gIXRpbGUuX2dyaWRMaXN0IHx8IHRpbGUuX2dyaWRMaXN0ID09PSB0aGlzKTtcbiAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLl9kaXIgPyB0aGlzLl9kaXIudmFsdWUgOiAnbHRyJztcblxuICAgIHRoaXMuX3RpbGVDb29yZGluYXRvci51cGRhdGUodGhpcy5jb2xzLCB0aWxlcyk7XG4gICAgdGhpcy5fdGlsZVN0eWxlci5pbml0KHRoaXMuZ3V0dGVyU2l6ZSwgdHJhY2tlciwgdGhpcy5jb2xzLCBkaXJlY3Rpb24pO1xuXG4gICAgdGlsZXMuZm9yRWFjaCgodGlsZSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHBvcyA9IHRyYWNrZXIucG9zaXRpb25zW2luZGV4XTtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIuc2V0U3R5bGUodGlsZSwgcG9zLnJvdywgcG9zLmNvbCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9zZXRMaXN0U3R5bGUodGhpcy5fdGlsZVN0eWxlci5nZXRDb21wdXRlZEhlaWdodCgpKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHN0eWxlIG9uIHRoZSBtYWluIGdyaWQtbGlzdCBlbGVtZW50LCBnaXZlbiB0aGUgc3R5bGUgbmFtZSBhbmQgdmFsdWUuICovXG4gIF9zZXRMaXN0U3R5bGUoc3R5bGU6IFtzdHJpbmcsIHN0cmluZyB8IG51bGxdIHwgbnVsbCk6IHZvaWQge1xuICAgIGlmIChzdHlsZSkge1xuICAgICAgKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZSBhcyBhbnkpW3N0eWxlWzBdXSA9IHN0eWxlWzFdO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jb2xzOiBOdW1iZXJJbnB1dDtcbn1cbiJdfQ==