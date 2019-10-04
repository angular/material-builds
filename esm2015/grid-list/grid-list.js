/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
import { FitTileStyler, RatioTileStyler, FixedTileStyler } from './tile-styler';
import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MAT_GRID_LIST } from './grid-list-base';
// TODO(kara): Conditional (responsive) column count / row size.
// TODO(kara): Re-layout on window resize / media change (debounced).
// TODO(kara): gridTileHeader and gridTileFooter.
/** @type {?} */
const MAT_FIT_MODE = 'fit';
export class MatGridList {
    /**
     * @param {?} _element
     * @param {?} _dir
     */
    constructor(_element, _dir) {
        this._element = _element;
        this._dir = _dir;
        /**
         * The amount of space between tiles. This will be something like '5px' or '2em'.
         */
        this._gutter = '1px';
    }
    /**
     * Amount of columns in the grid list.
     * @return {?}
     */
    get cols() { return this._cols; }
    /**
     * @param {?} value
     * @return {?}
     */
    set cols(value) {
        this._cols = Math.max(1, Math.round(coerceNumberProperty(value)));
    }
    /**
     * Size of the grid list's gutter in pixels.
     * @return {?}
     */
    get gutterSize() { return this._gutter; }
    /**
     * @param {?} value
     * @return {?}
     */
    set gutterSize(value) { this._gutter = `${value == null ? '' : value}`; }
    /**
     * Set internal representation of row height from the user-provided value.
     * @return {?}
     */
    get rowHeight() { return this._rowHeight; }
    /**
     * @param {?} value
     * @return {?}
     */
    set rowHeight(value) {
        /** @type {?} */
        const newValue = `${value == null ? '' : value}`;
        if (newValue !== this._rowHeight) {
            this._rowHeight = newValue;
            this._setTileStyler(this._rowHeight);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._checkCols();
        this._checkRowHeight();
    }
    /**
     * The layout calculation is fairly cheap if nothing changes, so there's little cost
     * to run it frequently.
     * @return {?}
     */
    ngAfterContentChecked() {
        this._layoutTiles();
    }
    /**
     * Throw a friendly error if cols property is missing
     * @private
     * @return {?}
     */
    _checkCols() {
        if (!this.cols) {
            throw Error(`mat-grid-list: must pass in number of columns. ` +
                `Example: <mat-grid-list cols="3">`);
        }
    }
    /**
     * Default to equal width:height if rowHeight property is missing
     * @private
     * @return {?}
     */
    _checkRowHeight() {
        if (!this._rowHeight) {
            this._setTileStyler('1:1');
        }
    }
    /**
     * Creates correct Tile Styler subtype based on rowHeight passed in by user
     * @private
     * @param {?} rowHeight
     * @return {?}
     */
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
    /**
     * Computes and applies the size and position for all children grid tiles.
     * @private
     * @return {?}
     */
    _layoutTiles() {
        if (!this._tileCoordinator) {
            this._tileCoordinator = new TileCoordinator();
        }
        /** @type {?} */
        const tracker = this._tileCoordinator;
        /** @type {?} */
        const tiles = this._tiles.filter((/**
         * @param {?} tile
         * @return {?}
         */
        tile => !tile._gridList || tile._gridList === this));
        /** @type {?} */
        const direction = this._dir ? this._dir.value : 'ltr';
        this._tileCoordinator.update(this.cols, tiles);
        this._tileStyler.init(this.gutterSize, tracker, this.cols, direction);
        tiles.forEach((/**
         * @param {?} tile
         * @param {?} index
         * @return {?}
         */
        (tile, index) => {
            /** @type {?} */
            const pos = tracker.positions[index];
            this._tileStyler.setStyle(tile, pos.row, pos.col);
        }));
        this._setListStyle(this._tileStyler.getComputedHeight());
    }
    /**
     * Sets style on the main grid-list element, given the style name and value.
     * @param {?} style
     * @return {?}
     */
    _setListStyle(style) {
        if (style) {
            ((/** @type {?} */ (this._element.nativeElement.style)))[style[0]] = style[1];
        }
    }
}
MatGridList.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-grid-list',
                exportAs: 'matGridList',
                template: "<div>\n  <ng-content></ng-content>\n</div>",
                host: {
                    'class': 'mat-grid-list',
                },
                providers: [{
                        provide: MAT_GRID_LIST,
                        useExisting: MatGridList
                    }],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-figure{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}\n"]
            }] }
];
/** @nocollapse */
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
if (false) {
    /**
     * Number of columns being rendered.
     * @type {?}
     * @private
     */
    MatGridList.prototype._cols;
    /**
     * Used for determiningthe position of each tile in the grid.
     * @type {?}
     * @private
     */
    MatGridList.prototype._tileCoordinator;
    /**
     * Row height value passed in by user. This can be one of three types:
     * - Number value (ex: "100px"):  sets a fixed row height to that value
     * - Ratio value (ex: "4:3"): sets the row height based on width:height ratio
     * - "Fit" mode (ex: "fit"): sets the row height to total height divided by number of rows
     * @type {?}
     * @private
     */
    MatGridList.prototype._rowHeight;
    /**
     * The amount of space between tiles. This will be something like '5px' or '2em'.
     * @type {?}
     * @private
     */
    MatGridList.prototype._gutter;
    /**
     * Sets position and size styles for a tile
     * @type {?}
     * @private
     */
    MatGridList.prototype._tileStyler;
    /**
     * Query list of tiles that are being rendered.
     * @type {?}
     */
    MatGridList.prototype._tiles;
    /**
     * @type {?}
     * @private
     */
    MatGridList.prototype._element;
    /**
     * @type {?}
     * @private
     */
    MatGridList.prototype._dir;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLWxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQ0wsU0FBUyxFQUNULGlCQUFpQixFQUdqQixLQUFLLEVBQ0wsZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUNSLHVCQUF1QixHQUN4QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQWEsYUFBYSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDMUYsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyxhQUFhLEVBQWtCLE1BQU0sa0JBQWtCLENBQUM7Ozs7O01BTzFELFlBQVksR0FBRyxLQUFLO0FBa0IxQixNQUFNLE9BQU8sV0FBVzs7Ozs7SUF3QnRCLFlBQW9CLFFBQWlDLEVBQ3JCLElBQW9CO1FBRGhDLGFBQVEsR0FBUixRQUFRLENBQXlCO1FBQ3JCLFNBQUksR0FBSixJQUFJLENBQWdCOzs7O1FBVDVDLFlBQU8sR0FBVyxLQUFLLENBQUM7SUFTdUIsQ0FBQzs7Ozs7SUFHeEQsSUFDSSxJQUFJLEtBQWEsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFDekMsSUFBSSxJQUFJLENBQUMsS0FBYTtRQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMs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QUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO21CQU1oRCxLQUFLO3lCQU9MLEtBQUs7d0JBS0wsS0FBSzs7Ozs7Ozs7SUF0Q04sNEJBQXNCOzs7Ozs7SUFHdEIsdUNBQTBDOzs7Ozs7Ozs7SUFRMUMsaUNBQTJCOzs7Ozs7SUFHM0IsOEJBQWdDOzs7Ozs7SUFHaEMsa0NBQWdDOzs7OztJQUdoQyw2QkFBa0Y7Ozs7O0lBRXRFLCtCQUF5Qzs7Ozs7SUFDekMsMkJBQXdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgUXVlcnlMaXN0LFxuICBFbGVtZW50UmVmLFxuICBPcHRpb25hbCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRHcmlkVGlsZX0gZnJvbSAnLi9ncmlkLXRpbGUnO1xuaW1wb3J0IHtUaWxlQ29vcmRpbmF0b3J9IGZyb20gJy4vdGlsZS1jb29yZGluYXRvcic7XG5pbXBvcnQge1RpbGVTdHlsZXIsIEZpdFRpbGVTdHlsZXIsIFJhdGlvVGlsZVN0eWxlciwgRml4ZWRUaWxlU3R5bGVyfSBmcm9tICcuL3RpbGUtc3R5bGVyJztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge01BVF9HUklEX0xJU1QsIE1hdEdyaWRMaXN0QmFzZX0gZnJvbSAnLi9ncmlkLWxpc3QtYmFzZSc7XG5cblxuLy8gVE9ETyhrYXJhKTogQ29uZGl0aW9uYWwgKHJlc3BvbnNpdmUpIGNvbHVtbiBjb3VudCAvIHJvdyBzaXplLlxuLy8gVE9ETyhrYXJhKTogUmUtbGF5b3V0IG9uIHdpbmRvdyByZXNpemUgLyBtZWRpYSBjaGFuZ2UgKGRlYm91bmNlZCkuXG4vLyBUT0RPKGthcmEpOiBncmlkVGlsZUhlYWRlciBhbmQgZ3JpZFRpbGVGb290ZXIuXG5cbmNvbnN0IE1BVF9GSVRfTU9ERSA9ICdmaXQnO1xuXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdtYXQtZ3JpZC1saXN0JyxcbiAgZXhwb3J0QXM6ICdtYXRHcmlkTGlzdCcsXG4gIHRlbXBsYXRlVXJsOiAnZ3JpZC1saXN0Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZ3JpZC1saXN0LmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1ncmlkLWxpc3QnLFxuICB9LFxuICBwcm92aWRlcnM6IFt7XG4gICAgcHJvdmlkZTogTUFUX0dSSURfTElTVCxcbiAgICB1c2VFeGlzdGluZzogTWF0R3JpZExpc3RcbiAgfV0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRHcmlkTGlzdCBpbXBsZW1lbnRzIE1hdEdyaWRMaXN0QmFzZSwgT25Jbml0LCBBZnRlckNvbnRlbnRDaGVja2VkIHtcbiAgLyoqIE51bWJlciBvZiBjb2x1bW5zIGJlaW5nIHJlbmRlcmVkLiAqL1xuICBwcml2YXRlIF9jb2xzOiBudW1iZXI7XG5cbiAgLyoqIFVzZWQgZm9yIGRldGVybWluaW5ndGhlIHBvc2l0aW9uIG9mIGVhY2ggdGlsZSBpbiB0aGUgZ3JpZC4gKi9cbiAgcHJpdmF0ZSBfdGlsZUNvb3JkaW5hdG9yOiBUaWxlQ29vcmRpbmF0b3I7XG5cbiAgLyoqXG4gICAqIFJvdyBoZWlnaHQgdmFsdWUgcGFzc2VkIGluIGJ5IHVzZXIuIFRoaXMgY2FuIGJlIG9uZSBvZiB0aHJlZSB0eXBlczpcbiAgICogLSBOdW1iZXIgdmFsdWUgKGV4OiBcIjEwMHB4XCIpOiAgc2V0cyBhIGZpeGVkIHJvdyBoZWlnaHQgdG8gdGhhdCB2YWx1ZVxuICAgKiAtIFJhdGlvIHZhbHVlIChleDogXCI0OjNcIik6IHNldHMgdGhlIHJvdyBoZWlnaHQgYmFzZWQgb24gd2lkdGg6aGVpZ2h0IHJhdGlvXG4gICAqIC0gXCJGaXRcIiBtb2RlIChleDogXCJmaXRcIik6IHNldHMgdGhlIHJvdyBoZWlnaHQgdG8gdG90YWwgaGVpZ2h0IGRpdmlkZWQgYnkgbnVtYmVyIG9mIHJvd3NcbiAgICovXG4gIHByaXZhdGUgX3Jvd0hlaWdodDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgYW1vdW50IG9mIHNwYWNlIGJldHdlZW4gdGlsZXMuIFRoaXMgd2lsbCBiZSBzb21ldGhpbmcgbGlrZSAnNXB4JyBvciAnMmVtJy4gKi9cbiAgcHJpdmF0ZSBfZ3V0dGVyOiBzdHJpbmcgPSAnMXB4JztcblxuICAvKiogU2V0cyBwb3NpdGlvbiBhbmQgc2l6ZSBzdHlsZXMgZm9yIGEgdGlsZSAqL1xuICBwcml2YXRlIF90aWxlU3R5bGVyOiBUaWxlU3R5bGVyO1xuXG4gIC8qKiBRdWVyeSBsaXN0IG9mIHRpbGVzIHRoYXQgYXJlIGJlaW5nIHJlbmRlcmVkLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdEdyaWRUaWxlLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfdGlsZXM6IFF1ZXJ5TGlzdDxNYXRHcmlkVGlsZT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHkpIHt9XG5cbiAgLyoqIEFtb3VudCBvZiBjb2x1bW5zIGluIHRoZSBncmlkIGxpc3QuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xzKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9jb2xzOyB9XG4gIHNldCBjb2xzKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9jb2xzID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSkpKTtcbiAgfVxuXG4gIC8qKiBTaXplIG9mIHRoZSBncmlkIGxpc3QncyBndXR0ZXIgaW4gcGl4ZWxzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZ3V0dGVyU2l6ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZ3V0dGVyOyB9XG4gIHNldCBndXR0ZXJTaXplKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5fZ3V0dGVyID0gYCR7dmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWV9YDsgfVxuXG4gIC8qKiBTZXQgaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2Ygcm93IGhlaWdodCBmcm9tIHRoZSB1c2VyLXByb3ZpZGVkIHZhbHVlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcm93SGVpZ2h0KCk6IHN0cmluZyB8IG51bWJlciB7IHJldHVybiB0aGlzLl9yb3dIZWlnaHQ7IH1cbiAgc2V0IHJvd0hlaWdodCh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBgJHt2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZX1gO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9yb3dIZWlnaHQpIHtcbiAgICAgIHRoaXMuX3Jvd0hlaWdodCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fc2V0VGlsZVN0eWxlcih0aGlzLl9yb3dIZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2NoZWNrQ29scygpO1xuICAgIHRoaXMuX2NoZWNrUm93SGVpZ2h0KCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGxheW91dCBjYWxjdWxhdGlvbiBpcyBmYWlybHkgY2hlYXAgaWYgbm90aGluZyBjaGFuZ2VzLCBzbyB0aGVyZSdzIGxpdHRsZSBjb3N0XG4gICAqIHRvIHJ1biBpdCBmcmVxdWVudGx5LlxuICAgKi9cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIHRoaXMuX2xheW91dFRpbGVzKCk7XG4gIH1cblxuICAvKiogVGhyb3cgYSBmcmllbmRseSBlcnJvciBpZiBjb2xzIHByb3BlcnR5IGlzIG1pc3NpbmcgKi9cbiAgcHJpdmF0ZSBfY2hlY2tDb2xzKCkge1xuICAgIGlmICghdGhpcy5jb2xzKSB7XG4gICAgICB0aHJvdyBFcnJvcihgbWF0LWdyaWQtbGlzdDogbXVzdCBwYXNzIGluIG51bWJlciBvZiBjb2x1bW5zLiBgICtcbiAgICAgICAgICAgICAgICAgIGBFeGFtcGxlOiA8bWF0LWdyaWQtbGlzdCBjb2xzPVwiM1wiPmApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZWZhdWx0IHRvIGVxdWFsIHdpZHRoOmhlaWdodCBpZiByb3dIZWlnaHQgcHJvcGVydHkgaXMgbWlzc2luZyAqL1xuICBwcml2YXRlIF9jaGVja1Jvd0hlaWdodCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3Jvd0hlaWdodCkge1xuICAgICAgdGhpcy5fc2V0VGlsZVN0eWxlcignMToxJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENyZWF0ZXMgY29ycmVjdCBUaWxlIFN0eWxlciBzdWJ0eXBlIGJhc2VkIG9uIHJvd0hlaWdodCBwYXNzZWQgaW4gYnkgdXNlciAqL1xuICBwcml2YXRlIF9zZXRUaWxlU3R5bGVyKHJvd0hlaWdodDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3RpbGVTdHlsZXIpIHtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIucmVzZXQodGhpcyk7XG4gICAgfVxuXG4gICAgaWYgKHJvd0hlaWdodCA9PT0gTUFUX0ZJVF9NT0RFKSB7XG4gICAgICB0aGlzLl90aWxlU3R5bGVyID0gbmV3IEZpdFRpbGVTdHlsZXIoKTtcbiAgICB9IGVsc2UgaWYgKHJvd0hlaWdodCAmJiByb3dIZWlnaHQuaW5kZXhPZignOicpID4gLTEpIHtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIgPSBuZXcgUmF0aW9UaWxlU3R5bGVyKHJvd0hlaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIgPSBuZXcgRml4ZWRUaWxlU3R5bGVyKHJvd0hlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENvbXB1dGVzIGFuZCBhcHBsaWVzIHRoZSBzaXplIGFuZCBwb3NpdGlvbiBmb3IgYWxsIGNoaWxkcmVuIGdyaWQgdGlsZXMuICovXG4gIHByaXZhdGUgX2xheW91dFRpbGVzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fdGlsZUNvb3JkaW5hdG9yKSB7XG4gICAgICB0aGlzLl90aWxlQ29vcmRpbmF0b3IgPSBuZXcgVGlsZUNvb3JkaW5hdG9yKCk7XG4gICAgfVxuXG5cbiAgICBjb25zdCB0cmFja2VyID0gdGhpcy5fdGlsZUNvb3JkaW5hdG9yO1xuICAgIGNvbnN0IHRpbGVzID0gdGhpcy5fdGlsZXMuZmlsdGVyKHRpbGUgPT4gIXRpbGUuX2dyaWRMaXN0IHx8IHRpbGUuX2dyaWRMaXN0ID09PSB0aGlzKTtcbiAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLl9kaXIgPyB0aGlzLl9kaXIudmFsdWUgOiAnbHRyJztcblxuICAgIHRoaXMuX3RpbGVDb29yZGluYXRvci51cGRhdGUodGhpcy5jb2xzLCB0aWxlcyk7XG4gICAgdGhpcy5fdGlsZVN0eWxlci5pbml0KHRoaXMuZ3V0dGVyU2l6ZSwgdHJhY2tlciwgdGhpcy5jb2xzLCBkaXJlY3Rpb24pO1xuXG4gICAgdGlsZXMuZm9yRWFjaCgodGlsZSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHBvcyA9IHRyYWNrZXIucG9zaXRpb25zW2luZGV4XTtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIuc2V0U3R5bGUodGlsZSwgcG9zLnJvdywgcG9zLmNvbCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9zZXRMaXN0U3R5bGUodGhpcy5fdGlsZVN0eWxlci5nZXRDb21wdXRlZEhlaWdodCgpKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHN0eWxlIG9uIHRoZSBtYWluIGdyaWQtbGlzdCBlbGVtZW50LCBnaXZlbiB0aGUgc3R5bGUgbmFtZSBhbmQgdmFsdWUuICovXG4gIF9zZXRMaXN0U3R5bGUoc3R5bGU6IFtzdHJpbmcsIHN0cmluZyB8IG51bGxdIHwgbnVsbCk6IHZvaWQge1xuICAgIGlmIChzdHlsZSkge1xuICAgICAgKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZSBhcyBhbnkpW3N0eWxlWzBdXSA9IHN0eWxlWzFdO1xuICAgIH1cbiAgfVxufVxuIl19