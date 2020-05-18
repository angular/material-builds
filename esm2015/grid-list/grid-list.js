/**
 * @fileoverview added by tsickle
 * Generated from: src/material/grid-list/grid-list.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
let MatGridList = /** @class */ (() => {
    class MatGridList {
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
    return MatGridList;
})();
export { MatGridList };
if (false) {
    /** @type {?} */
    MatGridList.ngAcceptInputType_cols;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLWxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFHakIsS0FBSyxFQUNMLGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFFBQVEsRUFDUix1QkFBdUIsR0FDeEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxFQUFhLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzFGLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsb0JBQW9CLEVBQWMsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RSxPQUFPLEVBQUMsYUFBYSxFQUFrQixNQUFNLGtCQUFrQixDQUFDOzs7OztNQU8xRCxZQUFZLEdBQUcsS0FBSztBQUUxQjtJQUFBLE1Ba0JhLFdBQVc7Ozs7O1FBd0J0QixZQUFvQixRQUFpQyxFQUNyQixJQUFvQjtZQURoQyxhQUFRLEdBQVIsUUFBUSxDQUF5QjtZQUNyQixTQUFJLEdBQUosSUFBSSxDQUFnQjs7OztZQVQ1QyxZQUFPLEdBQVcsS0FBSyxDQUFDO1FBU3VCLENBQUM7Ozs7O1FBR3hELElBQ0ksSUFBSSxLQUFhLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Ozs7O1FBQ3pDLElBQUksSUFBSSxDQUFDLEtBQWE7WUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFD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ZSxTQUFDLFdBQVcsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7dUJBTWhELEtBQUs7NkJBT0wsS0FBSzs0QkFLTCxLQUFLOztJQW9GUixrQkFBQztLQUFBO1NBNUhZLFdBQVc7OztJQTJIdEIsbUNBQTJDOzs7Ozs7SUF6SDNDLDRCQUFzQjs7Ozs7O0lBR3RCLHVDQUEwQzs7Ozs7Ozs7O0lBUTFDLGlDQUEyQjs7Ozs7O0lBRzNCLDhCQUFnQzs7Ozs7O0lBR2hDLGtDQUFnQzs7Ozs7SUFHaEMsNkJBQWtGOzs7OztJQUV0RSwrQkFBeUM7Ozs7O0lBQ3pDLDJCQUF3QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBPbkluaXQsXG4gIElucHV0LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIFF1ZXJ5TGlzdCxcbiAgRWxlbWVudFJlZixcbiAgT3B0aW9uYWwsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0R3JpZFRpbGV9IGZyb20gJy4vZ3JpZC10aWxlJztcbmltcG9ydCB7VGlsZUNvb3JkaW5hdG9yfSBmcm9tICcuL3RpbGUtY29vcmRpbmF0b3InO1xuaW1wb3J0IHtUaWxlU3R5bGVyLCBGaXRUaWxlU3R5bGVyLCBSYXRpb1RpbGVTdHlsZXIsIEZpeGVkVGlsZVN0eWxlcn0gZnJvbSAnLi90aWxlLXN0eWxlcic7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7TUFUX0dSSURfTElTVCwgTWF0R3JpZExpc3RCYXNlfSBmcm9tICcuL2dyaWQtbGlzdC1iYXNlJztcblxuXG4vLyBUT0RPKGthcmEpOiBDb25kaXRpb25hbCAocmVzcG9uc2l2ZSkgY29sdW1uIGNvdW50IC8gcm93IHNpemUuXG4vLyBUT0RPKGthcmEpOiBSZS1sYXlvdXQgb24gd2luZG93IHJlc2l6ZSAvIG1lZGlhIGNoYW5nZSAoZGVib3VuY2VkKS5cbi8vIFRPRE8oa2FyYSk6IGdyaWRUaWxlSGVhZGVyIGFuZCBncmlkVGlsZUZvb3Rlci5cblxuY29uc3QgTUFUX0ZJVF9NT0RFID0gJ2ZpdCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLWxpc3QnLFxuICBleHBvcnRBczogJ21hdEdyaWRMaXN0JyxcbiAgdGVtcGxhdGVVcmw6ICdncmlkLWxpc3QuaHRtbCcsXG4gIHN0eWxlVXJsczogWydncmlkLWxpc3QuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWdyaWQtbGlzdCcsXG4gICAgLy8gRW5zdXJlcyB0aGF0IHRoZSBcImNvbHNcIiBpbnB1dCB2YWx1ZSBpcyByZWZsZWN0ZWQgaW4gdGhlIERPTS4gVGhpcyBpc1xuICAgIC8vIG5lZWRlZCBmb3IgdGhlIGdyaWQtbGlzdCBoYXJuZXNzLlxuICAgICdbYXR0ci5jb2xzXSc6ICdjb2xzJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe1xuICAgIHByb3ZpZGU6IE1BVF9HUklEX0xJU1QsXG4gICAgdXNlRXhpc3Rpbmc6IE1hdEdyaWRMaXN0XG4gIH1dLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZExpc3QgaW1wbGVtZW50cyBNYXRHcmlkTGlzdEJhc2UsIE9uSW5pdCwgQWZ0ZXJDb250ZW50Q2hlY2tlZCB7XG4gIC8qKiBOdW1iZXIgb2YgY29sdW1ucyBiZWluZyByZW5kZXJlZC4gKi9cbiAgcHJpdmF0ZSBfY29sczogbnVtYmVyO1xuXG4gIC8qKiBVc2VkIGZvciBkZXRlcm1pbmluZ3RoZSBwb3NpdGlvbiBvZiBlYWNoIHRpbGUgaW4gdGhlIGdyaWQuICovXG4gIHByaXZhdGUgX3RpbGVDb29yZGluYXRvcjogVGlsZUNvb3JkaW5hdG9yO1xuXG4gIC8qKlxuICAgKiBSb3cgaGVpZ2h0IHZhbHVlIHBhc3NlZCBpbiBieSB1c2VyLiBUaGlzIGNhbiBiZSBvbmUgb2YgdGhyZWUgdHlwZXM6XG4gICAqIC0gTnVtYmVyIHZhbHVlIChleDogXCIxMDBweFwiKTogIHNldHMgYSBmaXhlZCByb3cgaGVpZ2h0IHRvIHRoYXQgdmFsdWVcbiAgICogLSBSYXRpbyB2YWx1ZSAoZXg6IFwiNDozXCIpOiBzZXRzIHRoZSByb3cgaGVpZ2h0IGJhc2VkIG9uIHdpZHRoOmhlaWdodCByYXRpb1xuICAgKiAtIFwiRml0XCIgbW9kZSAoZXg6IFwiZml0XCIpOiBzZXRzIHRoZSByb3cgaGVpZ2h0IHRvIHRvdGFsIGhlaWdodCBkaXZpZGVkIGJ5IG51bWJlciBvZiByb3dzXG4gICAqL1xuICBwcml2YXRlIF9yb3dIZWlnaHQ6IHN0cmluZztcblxuICAvKiogVGhlIGFtb3VudCBvZiBzcGFjZSBiZXR3ZWVuIHRpbGVzLiBUaGlzIHdpbGwgYmUgc29tZXRoaW5nIGxpa2UgJzVweCcgb3IgJzJlbScuICovXG4gIHByaXZhdGUgX2d1dHRlcjogc3RyaW5nID0gJzFweCc7XG5cbiAgLyoqIFNldHMgcG9zaXRpb24gYW5kIHNpemUgc3R5bGVzIGZvciBhIHRpbGUgKi9cbiAgcHJpdmF0ZSBfdGlsZVN0eWxlcjogVGlsZVN0eWxlcjtcblxuICAvKiogUXVlcnkgbGlzdCBvZiB0aWxlcyB0aGF0IGFyZSBiZWluZyByZW5kZXJlZC4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRHcmlkVGlsZSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3RpbGVzOiBRdWVyeUxpc3Q8TWF0R3JpZFRpbGU+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5KSB7fVxuXG4gIC8qKiBBbW91bnQgb2YgY29sdW1ucyBpbiB0aGUgZ3JpZCBsaXN0LiAqL1xuICBASW5wdXQoKVxuICBnZXQgY29scygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fY29sczsgfVxuICBzZXQgY29scyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fY29scyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpKSk7XG4gIH1cblxuICAvKiogU2l6ZSBvZiB0aGUgZ3JpZCBsaXN0J3MgZ3V0dGVyIGluIHBpeGVscy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGd1dHRlclNpemUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2d1dHRlcjsgfVxuICBzZXQgZ3V0dGVyU2l6ZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMuX2d1dHRlciA9IGAke3ZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlfWA7IH1cblxuICAvKiogU2V0IGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIHJvdyBoZWlnaHQgZnJvbSB0aGUgdXNlci1wcm92aWRlZCB2YWx1ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJvd0hlaWdodCgpOiBzdHJpbmcgfCBudW1iZXIgeyByZXR1cm4gdGhpcy5fcm93SGVpZ2h0OyB9XG4gIHNldCByb3dIZWlnaHQodmFsdWU6IHN0cmluZyB8IG51bWJlcikge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gYCR7dmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWV9YDtcblxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fcm93SGVpZ2h0KSB7XG4gICAgICB0aGlzLl9yb3dIZWlnaHQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuX3NldFRpbGVTdHlsZXIodGhpcy5fcm93SGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9jaGVja0NvbHMoKTtcbiAgICB0aGlzLl9jaGVja1Jvd0hlaWdodCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBsYXlvdXQgY2FsY3VsYXRpb24gaXMgZmFpcmx5IGNoZWFwIGlmIG5vdGhpbmcgY2hhbmdlcywgc28gdGhlcmUncyBsaXR0bGUgY29zdFxuICAgKiB0byBydW4gaXQgZnJlcXVlbnRseS5cbiAgICovXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICB0aGlzLl9sYXlvdXRUaWxlcygpO1xuICB9XG5cbiAgLyoqIFRocm93IGEgZnJpZW5kbHkgZXJyb3IgaWYgY29scyBwcm9wZXJ0eSBpcyBtaXNzaW5nICovXG4gIHByaXZhdGUgX2NoZWNrQ29scygpIHtcbiAgICBpZiAoIXRoaXMuY29scykge1xuICAgICAgdGhyb3cgRXJyb3IoYG1hdC1ncmlkLWxpc3Q6IG11c3QgcGFzcyBpbiBudW1iZXIgb2YgY29sdW1ucy4gYCArXG4gICAgICAgICAgICAgICAgICBgRXhhbXBsZTogPG1hdC1ncmlkLWxpc3QgY29scz1cIjNcIj5gKTtcbiAgICB9XG4gIH1cblxuICAvKiogRGVmYXVsdCB0byBlcXVhbCB3aWR0aDpoZWlnaHQgaWYgcm93SGVpZ2h0IHByb3BlcnR5IGlzIG1pc3NpbmcgKi9cbiAgcHJpdmF0ZSBfY2hlY2tSb3dIZWlnaHQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9yb3dIZWlnaHQpIHtcbiAgICAgIHRoaXMuX3NldFRpbGVTdHlsZXIoJzE6MScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGNvcnJlY3QgVGlsZSBTdHlsZXIgc3VidHlwZSBiYXNlZCBvbiByb3dIZWlnaHQgcGFzc2VkIGluIGJ5IHVzZXIgKi9cbiAgcHJpdmF0ZSBfc2V0VGlsZVN0eWxlcihyb3dIZWlnaHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLl90aWxlU3R5bGVyKSB7XG4gICAgICB0aGlzLl90aWxlU3R5bGVyLnJlc2V0KHRoaXMpO1xuICAgIH1cblxuICAgIGlmIChyb3dIZWlnaHQgPT09IE1BVF9GSVRfTU9ERSkge1xuICAgICAgdGhpcy5fdGlsZVN0eWxlciA9IG5ldyBGaXRUaWxlU3R5bGVyKCk7XG4gICAgfSBlbHNlIGlmIChyb3dIZWlnaHQgJiYgcm93SGVpZ2h0LmluZGV4T2YoJzonKSA+IC0xKSB7XG4gICAgICB0aGlzLl90aWxlU3R5bGVyID0gbmV3IFJhdGlvVGlsZVN0eWxlcihyb3dIZWlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aWxlU3R5bGVyID0gbmV3IEZpeGVkVGlsZVN0eWxlcihyb3dIZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDb21wdXRlcyBhbmQgYXBwbGllcyB0aGUgc2l6ZSBhbmQgcG9zaXRpb24gZm9yIGFsbCBjaGlsZHJlbiBncmlkIHRpbGVzLiAqL1xuICBwcml2YXRlIF9sYXlvdXRUaWxlcygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3RpbGVDb29yZGluYXRvcikge1xuICAgICAgdGhpcy5fdGlsZUNvb3JkaW5hdG9yID0gbmV3IFRpbGVDb29yZGluYXRvcigpO1xuICAgIH1cblxuXG4gICAgY29uc3QgdHJhY2tlciA9IHRoaXMuX3RpbGVDb29yZGluYXRvcjtcbiAgICBjb25zdCB0aWxlcyA9IHRoaXMuX3RpbGVzLmZpbHRlcih0aWxlID0+ICF0aWxlLl9ncmlkTGlzdCB8fCB0aWxlLl9ncmlkTGlzdCA9PT0gdGhpcyk7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5fZGlyID8gdGhpcy5fZGlyLnZhbHVlIDogJ2x0cic7XG5cbiAgICB0aGlzLl90aWxlQ29vcmRpbmF0b3IudXBkYXRlKHRoaXMuY29scywgdGlsZXMpO1xuICAgIHRoaXMuX3RpbGVTdHlsZXIuaW5pdCh0aGlzLmd1dHRlclNpemUsIHRyYWNrZXIsIHRoaXMuY29scywgZGlyZWN0aW9uKTtcblxuICAgIHRpbGVzLmZvckVhY2goKHRpbGUsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBwb3MgPSB0cmFja2VyLnBvc2l0aW9uc1tpbmRleF07XG4gICAgICB0aGlzLl90aWxlU3R5bGVyLnNldFN0eWxlKHRpbGUsIHBvcy5yb3csIHBvcy5jb2wpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc2V0TGlzdFN0eWxlKHRoaXMuX3RpbGVTdHlsZXIuZ2V0Q29tcHV0ZWRIZWlnaHQoKSk7XG4gIH1cblxuICAvKiogU2V0cyBzdHlsZSBvbiB0aGUgbWFpbiBncmlkLWxpc3QgZWxlbWVudCwgZ2l2ZW4gdGhlIHN0eWxlIG5hbWUgYW5kIHZhbHVlLiAqL1xuICBfc2V0TGlzdFN0eWxlKHN0eWxlOiBbc3RyaW5nLCBzdHJpbmcgfCBudWxsXSB8IG51bGwpOiB2b2lkIHtcbiAgICBpZiAoc3R5bGUpIHtcbiAgICAgICh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUgYXMgYW55KVtzdHlsZVswXV0gPSBzdHlsZVsxXTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfY29sczogTnVtYmVySW5wdXQ7XG59XG4iXX0=