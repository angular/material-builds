/**
 * @fileoverview added by tsickle
 * Generated from: src/material/grid-list/tile-styler.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * RegExp that can be used to check whether a value will
 * be allowed inside a CSS `calc()` expression.
 * @type {?}
 */
const cssCalcAllowedValue = /^-?\d+((\.\d+)?[A-Za-z%$]?)+$/;
/**
 * Sets the style properties for an individual tile, given the position calculated by the
 * Tile Coordinator.
 * \@docs-private
 * @abstract
 */
export class TileStyler {
    constructor() {
        this._rows = 0;
        this._rowspan = 0;
    }
    /**
     * Adds grid-list layout info once it is available. Cannot be processed in the constructor
     * because these properties haven't been calculated by that point.
     *
     * @param {?} gutterSize Size of the grid's gutter.
     * @param {?} tracker Instance of the TileCoordinator.
     * @param {?} cols Amount of columns in the grid.
     * @param {?} direction Layout direction of the grid.
     * @return {?}
     */
    init(gutterSize, tracker, cols, direction) {
        this._gutterSize = normalizeUnits(gutterSize);
        this._rows = tracker.rowCount;
        this._rowspan = tracker.rowspan;
        this._cols = cols;
        this._direction = direction;
    }
    /**
     * Computes the amount of space a single 1x1 tile would take up (width or height).
     * Used as a basis for other calculations.
     * @param {?} sizePercent Percent of the total grid-list space that one 1x1 tile would take up.
     * @param {?} gutterFraction Fraction of the gutter size taken up by one 1x1 tile.
     * @return {?} The size of a 1x1 tile as an expression that can be evaluated via CSS calc().
     */
    getBaseTileSize(sizePercent, gutterFraction) {
        // Take the base size percent (as would be if evenly dividing the size between cells),
        // and then subtracting the size of one gutter. However, since there are no gutters on the
        // edges, each tile only uses a fraction (gutterShare = numGutters / numCells) of the gutter
        // size. (Imagine having one gutter per tile, and then breaking up the extra gutter on the
        // edge evenly among the cells).
        return `(${sizePercent}% - (${this._gutterSize} * ${gutterFraction}))`;
    }
    /**
     * Gets The horizontal or vertical position of a tile, e.g., the 'top' or 'left' property value.
     * @param {?} baseSize Base size of a 1x1 tile (as computed in getBaseTileSize).
     * @param {?} offset Number of tiles that have already been rendered in the row/column.
     * @return {?} Position of the tile as a CSS calc() expression.
     */
    getTilePosition(baseSize, offset) {
        // The position comes the size of a 1x1 tile plus gutter for each previous tile in the
        // row/column (offset).
        return offset === 0 ? '0' : calc(`(${baseSize} + ${this._gutterSize}) * ${offset}`);
    }
    /**
     * Gets the actual size of a tile, e.g., width or height, taking rowspan or colspan into account.
     * @param {?} baseSize Base size of a 1x1 tile (as computed in getBaseTileSize).
     * @param {?} span The tile's rowspan or colspan.
     * @return {?} Size of the tile as a CSS calc() expression.
     */
    getTileSize(baseSize, span) {
        return `(${baseSize} * ${span}) + (${span - 1} * ${this._gutterSize})`;
    }
    /**
     * Sets the style properties to be applied to a tile for the given row and column index.
     * @param {?} tile Tile to which to apply the styling.
     * @param {?} rowIndex Index of the tile's row.
     * @param {?} colIndex Index of the tile's column.
     * @return {?}
     */
    setStyle(tile, rowIndex, colIndex) {
        // Percent of the available horizontal space that one column takes up.
        /** @type {?} */
        let percentWidthPerTile = 100 / this._cols;
        // Fraction of the vertical gutter size that each column takes up.
        // For example, if there are 5 columns, each column uses 4/5 = 0.8 times the gutter width.
        /** @type {?} */
        let gutterWidthFractionPerTile = (this._cols - 1) / this._cols;
        this.setColStyles(tile, colIndex, percentWidthPerTile, gutterWidthFractionPerTile);
        this.setRowStyles(tile, rowIndex, percentWidthPerTile, gutterWidthFractionPerTile);
    }
    /**
     * Sets the horizontal placement of the tile in the list.
     * @param {?} tile
     * @param {?} colIndex
     * @param {?} percentWidth
     * @param {?} gutterWidth
     * @return {?}
     */
    setColStyles(tile, colIndex, percentWidth, gutterWidth) {
        // Base horizontal size of a column.
        /** @type {?} */
        let baseTileWidth = this.getBaseTileSize(percentWidth, gutterWidth);
        // The width and horizontal position of each tile is always calculated the same way, but the
        // height and vertical position depends on the rowMode.
        /** @type {?} */
        let side = this._direction === 'rtl' ? 'right' : 'left';
        tile._setStyle(side, this.getTilePosition(baseTileWidth, colIndex));
        tile._setStyle('width', calc(this.getTileSize(baseTileWidth, tile.colspan)));
    }
    /**
     * Calculates the total size taken up by gutters across one axis of a list.
     * @return {?}
     */
    getGutterSpan() {
        return `${this._gutterSize} * (${this._rowspan} - 1)`;
    }
    /**
     * Calculates the total size taken up by tiles across one axis of a list.
     * @param {?} tileHeight Height of the tile.
     * @return {?}
     */
    getTileSpan(tileHeight) {
        return `${this._rowspan} * ${this.getTileSize(tileHeight, 1)}`;
    }
    /**
     * Calculates the computed height and returns the correct style property to set.
     * This method can be implemented by each type of TileStyler.
     * \@docs-private
     * @return {?}
     */
    getComputedHeight() { return null; }
}
if (false) {
    /** @type {?} */
    TileStyler.prototype._gutterSize;
    /** @type {?} */
    TileStyler.prototype._rows;
    /** @type {?} */
    TileStyler.prototype._rowspan;
    /** @type {?} */
    TileStyler.prototype._cols;
    /** @type {?} */
    TileStyler.prototype._direction;
    /**
     * Sets the vertical placement of the tile in the list.
     * This method will be implemented by each type of TileStyler.
     * \@docs-private
     * @abstract
     * @param {?} tile
     * @param {?} rowIndex
     * @param {?} percentWidth
     * @param {?} gutterWidth
     * @return {?}
     */
    TileStyler.prototype.setRowStyles = function (tile, rowIndex, percentWidth, gutterWidth) { };
    /**
     * Called when the tile styler is swapped out with a different one. To be used for cleanup.
     * \@docs-private
     * @abstract
     * @param {?} list Grid list that the styler was attached to.
     * @return {?}
     */
    TileStyler.prototype.reset = function (list) { };
}
/**
 * This type of styler is instantiated when the user passes in a fixed row height.
 * Example `<mat-grid-list cols="3" rowHeight="100px">`
 * \@docs-private
 */
export class FixedTileStyler extends TileStyler {
    /**
     * @param {?} fixedRowHeight
     */
    constructor(fixedRowHeight) {
        super();
        this.fixedRowHeight = fixedRowHeight;
    }
    /**
     * @param {?} gutterSize
     * @param {?} tracker
     * @param {?} cols
     * @param {?} direction
     * @return {?}
     */
    init(gutterSize, tracker, cols, direction) {
        super.init(gutterSize, tracker, cols, direction);
        this.fixedRowHeight = normalizeUnits(this.fixedRowHeight);
        if (!cssCalcAllowedValue.test(this.fixedRowHeight)) {
            throw Error(`Invalid value "${this.fixedRowHeight}" set as rowHeight.`);
        }
    }
    /**
     * @param {?} tile
     * @param {?} rowIndex
     * @return {?}
     */
    setRowStyles(tile, rowIndex) {
        tile._setStyle('top', this.getTilePosition(this.fixedRowHeight, rowIndex));
        tile._setStyle('height', calc(this.getTileSize(this.fixedRowHeight, tile.rowspan)));
    }
    /**
     * @return {?}
     */
    getComputedHeight() {
        return [
            'height', calc(`${this.getTileSpan(this.fixedRowHeight)} + ${this.getGutterSpan()}`)
        ];
    }
    /**
     * @param {?} list
     * @return {?}
     */
    reset(list) {
        list._setListStyle(['height', null]);
        if (list._tiles) {
            list._tiles.forEach((/**
             * @param {?} tile
             * @return {?}
             */
            tile => {
                tile._setStyle('top', null);
                tile._setStyle('height', null);
            }));
        }
    }
}
if (false) {
    /** @type {?} */
    FixedTileStyler.prototype.fixedRowHeight;
}
/**
 * This type of styler is instantiated when the user passes in a width:height ratio
 * for the row height.  Example `<mat-grid-list cols="3" rowHeight="3:1">`
 * \@docs-private
 */
export class RatioTileStyler extends TileStyler {
    /**
     * @param {?} value
     */
    constructor(value) {
        super();
        this._parseRatio(value);
    }
    /**
     * @param {?} tile
     * @param {?} rowIndex
     * @param {?} percentWidth
     * @param {?} gutterWidth
     * @return {?}
     */
    setRowStyles(tile, rowIndex, percentWidth, gutterWidth) {
        /** @type {?} */
        let percentHeightPerTile = percentWidth / this.rowHeightRatio;
        this.baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterWidth);
        // Use padding-top and margin-top to maintain the given aspect ratio, as
        // a percentage-based value for these properties is applied versus the *width* of the
        // containing block. See http://www.w3.org/TR/CSS2/box.html#margin-properties
        tile._setStyle('marginTop', this.getTilePosition(this.baseTileHeight, rowIndex));
        tile._setStyle('paddingTop', calc(this.getTileSize(this.baseTileHeight, tile.rowspan)));
    }
    /**
     * @return {?}
     */
    getComputedHeight() {
        return [
            'paddingBottom', calc(`${this.getTileSpan(this.baseTileHeight)} + ${this.getGutterSpan()}`)
        ];
    }
    /**
     * @param {?} list
     * @return {?}
     */
    reset(list) {
        list._setListStyle(['paddingBottom', null]);
        list._tiles.forEach((/**
         * @param {?} tile
         * @return {?}
         */
        tile => {
            tile._setStyle('marginTop', null);
            tile._setStyle('paddingTop', null);
        }));
    }
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    _parseRatio(value) {
        /** @type {?} */
        const ratioParts = value.split(':');
        if (ratioParts.length !== 2) {
            throw Error(`mat-grid-list: invalid ratio given for row-height: "${value}"`);
        }
        this.rowHeightRatio = parseFloat(ratioParts[0]) / parseFloat(ratioParts[1]);
    }
}
if (false) {
    /**
     * Ratio width:height given by user to determine row height.
     * @type {?}
     */
    RatioTileStyler.prototype.rowHeightRatio;
    /** @type {?} */
    RatioTileStyler.prototype.baseTileHeight;
}
/**
 * This type of styler is instantiated when the user selects a "fit" row height mode.
 * In other words, the row height will reflect the total height of the container divided
 * by the number of rows.  Example `<mat-grid-list cols="3" rowHeight="fit">`
 *
 * \@docs-private
 */
export class FitTileStyler extends TileStyler {
    /**
     * @param {?} tile
     * @param {?} rowIndex
     * @return {?}
     */
    setRowStyles(tile, rowIndex) {
        // Percent of the available vertical space that one row takes up.
        /** @type {?} */
        let percentHeightPerTile = 100 / this._rowspan;
        // Fraction of the horizontal gutter size that each column takes up.
        /** @type {?} */
        let gutterHeightPerTile = (this._rows - 1) / this._rows;
        // Base vertical size of a column.
        /** @type {?} */
        let baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterHeightPerTile);
        tile._setStyle('top', this.getTilePosition(baseTileHeight, rowIndex));
        tile._setStyle('height', calc(this.getTileSize(baseTileHeight, tile.rowspan)));
    }
    /**
     * @param {?} list
     * @return {?}
     */
    reset(list) {
        if (list._tiles) {
            list._tiles.forEach((/**
             * @param {?} tile
             * @return {?}
             */
            tile => {
                tile._setStyle('top', null);
                tile._setStyle('height', null);
            }));
        }
    }
}
/**
 * Wraps a CSS string in a calc function
 * @param {?} exp
 * @return {?}
 */
function calc(exp) {
    return `calc(${exp})`;
}
/**
 * Appends pixels to a CSS string if no units are given.
 * @param {?} value
 * @return {?}
 */
function normalizeUnits(value) {
    return value.match(/([A-Za-z%]+)$/) ? value : `${value}px`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS1zdHlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZ3JpZC1saXN0L3RpbGUtc3R5bGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O01BZ0JNLG1CQUFtQixHQUFHLCtCQUErQjs7Ozs7OztBQU8zRCxNQUFNLE9BQWdCLFVBQVU7SUFBaEM7UUFFRSxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLGFBQVEsR0FBVyxDQUFDLENBQUM7SUFpSXZCLENBQUM7Ozs7Ozs7Ozs7O0lBcEhDLElBQUksQ0FBQyxVQUFrQixFQUFFLE9BQXdCLEVBQUUsSUFBWSxFQUFFLFNBQWlCO1FBQ2hGLElBQUksQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDOUIsQ0FBQzs7Ozs7Ozs7SUFTRCxlQUFlLENBQUMsV0FBbUIsRUFBRSxjQUFzQjtRQUN6RCxzRkFBc0Y7UUFDdEYsMEZBQTBGO1FBQzFGLDRGQUE0RjtRQUM1RiwwRkFBMEY7UUFDMUYsZ0NBQWdDO1FBQ2hDLE9BQU8sSUFBSSxXQUFXLFFBQVEsSUFBSSxDQUFDLFdBQVcsTUFBTSxjQUFjLElBQUksQ0FBQztJQUN6RSxDQUFDOzs7Ozs7O0lBU0QsZUFBZSxDQUFDLFFBQWdCLEVBQUUsTUFBYztRQUM5QyxzRkFBc0Y7UUFDdEYsdUJBQXVCO1FBQ3ZCLE9BQU8sTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxRQUFRLE1BQU0s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akMsQ0FBQyxFQUFDLENBQUM7U0FDSjtJQUNILENBQUM7Q0FDRjs7Ozs7O0FBSUQsU0FBUyxJQUFJLENBQUMsR0FBVztJQUN2QixPQUFPLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDeEIsQ0FBQzs7Ozs7O0FBSUQsU0FBUyxjQUFjLENBQUMsS0FBYTtJQUNuQyxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQztBQUM3RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TWF0R3JpZExpc3R9IGZyb20gJy4vZ3JpZC1saXN0JztcbmltcG9ydCB7TWF0R3JpZFRpbGV9IGZyb20gJy4vZ3JpZC10aWxlJztcbmltcG9ydCB7VGlsZUNvb3JkaW5hdG9yfSBmcm9tICcuL3RpbGUtY29vcmRpbmF0b3InO1xuXG4vKipcbiAqIFJlZ0V4cCB0aGF0IGNhbiBiZSB1c2VkIHRvIGNoZWNrIHdoZXRoZXIgYSB2YWx1ZSB3aWxsXG4gKiBiZSBhbGxvd2VkIGluc2lkZSBhIENTUyBgY2FsYygpYCBleHByZXNzaW9uLlxuICovXG5jb25zdCBjc3NDYWxjQWxsb3dlZFZhbHVlID0gL14tP1xcZCsoKFxcLlxcZCspP1tBLVphLXolJF0/KSskLztcblxuLyoqXG4gKiBTZXRzIHRoZSBzdHlsZSBwcm9wZXJ0aWVzIGZvciBhbiBpbmRpdmlkdWFsIHRpbGUsIGdpdmVuIHRoZSBwb3NpdGlvbiBjYWxjdWxhdGVkIGJ5IHRoZVxuICogVGlsZSBDb29yZGluYXRvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFRpbGVTdHlsZXIge1xuICBfZ3V0dGVyU2l6ZTogc3RyaW5nO1xuICBfcm93czogbnVtYmVyID0gMDtcbiAgX3Jvd3NwYW46IG51bWJlciA9IDA7XG4gIF9jb2xzOiBudW1iZXI7XG4gIF9kaXJlY3Rpb246IHN0cmluZztcblxuICAvKipcbiAgICogQWRkcyBncmlkLWxpc3QgbGF5b3V0IGluZm8gb25jZSBpdCBpcyBhdmFpbGFibGUuIENhbm5vdCBiZSBwcm9jZXNzZWQgaW4gdGhlIGNvbnN0cnVjdG9yXG4gICAqIGJlY2F1c2UgdGhlc2UgcHJvcGVydGllcyBoYXZlbid0IGJlZW4gY2FsY3VsYXRlZCBieSB0aGF0IHBvaW50LlxuICAgKlxuICAgKiBAcGFyYW0gZ3V0dGVyU2l6ZSBTaXplIG9mIHRoZSBncmlkJ3MgZ3V0dGVyLlxuICAgKiBAcGFyYW0gdHJhY2tlciBJbnN0YW5jZSBvZiB0aGUgVGlsZUNvb3JkaW5hdG9yLlxuICAgKiBAcGFyYW0gY29scyBBbW91bnQgb2YgY29sdW1ucyBpbiB0aGUgZ3JpZC5cbiAgICogQHBhcmFtIGRpcmVjdGlvbiBMYXlvdXQgZGlyZWN0aW9uIG9mIHRoZSBncmlkLlxuICAgKi9cbiAgaW5pdChndXR0ZXJTaXplOiBzdHJpbmcsIHRyYWNrZXI6IFRpbGVDb29yZGluYXRvciwgY29sczogbnVtYmVyLCBkaXJlY3Rpb246IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX2d1dHRlclNpemUgPSBub3JtYWxpemVVbml0cyhndXR0ZXJTaXplKTtcbiAgICB0aGlzLl9yb3dzID0gdHJhY2tlci5yb3dDb3VudDtcbiAgICB0aGlzLl9yb3dzcGFuID0gdHJhY2tlci5yb3dzcGFuO1xuICAgIHRoaXMuX2NvbHMgPSBjb2xzO1xuICAgIHRoaXMuX2RpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wdXRlcyB0aGUgYW1vdW50IG9mIHNwYWNlIGEgc2luZ2xlIDF4MSB0aWxlIHdvdWxkIHRha2UgdXAgKHdpZHRoIG9yIGhlaWdodCkuXG4gICAqIFVzZWQgYXMgYSBiYXNpcyBmb3Igb3RoZXIgY2FsY3VsYXRpb25zLlxuICAgKiBAcGFyYW0gc2l6ZVBlcmNlbnQgUGVyY2VudCBvZiB0aGUgdG90YWwgZ3JpZC1saXN0IHNwYWNlIHRoYXQgb25lIDF4MSB0aWxlIHdvdWxkIHRha2UgdXAuXG4gICAqIEBwYXJhbSBndXR0ZXJGcmFjdGlvbiBGcmFjdGlvbiBvZiB0aGUgZ3V0dGVyIHNpemUgdGFrZW4gdXAgYnkgb25lIDF4MSB0aWxlLlxuICAgKiBAcmV0dXJuIFRoZSBzaXplIG9mIGEgMXgxIHRpbGUgYXMgYW4gZXhwcmVzc2lvbiB0aGF0IGNhbiBiZSBldmFsdWF0ZWQgdmlhIENTUyBjYWxjKCkuXG4gICAqL1xuICBnZXRCYXNlVGlsZVNpemUoc2l6ZVBlcmNlbnQ6IG51bWJlciwgZ3V0dGVyRnJhY3Rpb246IG51bWJlcik6IHN0cmluZyB7XG4gICAgLy8gVGFrZSB0aGUgYmFzZSBzaXplIHBlcmNlbnQgKGFzIHdvdWxkIGJlIGlmIGV2ZW5seSBkaXZpZGluZyB0aGUgc2l6ZSBiZXR3ZWVuIGNlbGxzKSxcbiAgICAvLyBhbmQgdGhlbiBzdWJ0cmFjdGluZyB0aGUgc2l6ZSBvZiBvbmUgZ3V0dGVyLiBIb3dldmVyLCBzaW5jZSB0aGVyZSBhcmUgbm8gZ3V0dGVycyBvbiB0aGVcbiAgICAvLyBlZGdlcywgZWFjaCB0aWxlIG9ubHkgdXNlcyBhIGZyYWN0aW9uIChndXR0ZXJTaGFyZSA9IG51bUd1dHRlcnMgLyBudW1DZWxscykgb2YgdGhlIGd1dHRlclxuICAgIC8vIHNpemUuIChJbWFnaW5lIGhhdmluZyBvbmUgZ3V0dGVyIHBlciB0aWxlLCBhbmQgdGhlbiBicmVha2luZyB1cCB0aGUgZXh0cmEgZ3V0dGVyIG9uIHRoZVxuICAgIC8vIGVkZ2UgZXZlbmx5IGFtb25nIHRoZSBjZWxscykuXG4gICAgcmV0dXJuIGAoJHtzaXplUGVyY2VudH0lIC0gKCR7dGhpcy5fZ3V0dGVyU2l6ZX0gKiAke2d1dHRlckZyYWN0aW9ufSkpYDtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEdldHMgVGhlIGhvcml6b250YWwgb3IgdmVydGljYWwgcG9zaXRpb24gb2YgYSB0aWxlLCBlLmcuLCB0aGUgJ3RvcCcgb3IgJ2xlZnQnIHByb3BlcnR5IHZhbHVlLlxuICAgKiBAcGFyYW0gb2Zmc2V0IE51bWJlciBvZiB0aWxlcyB0aGF0IGhhdmUgYWxyZWFkeSBiZWVuIHJlbmRlcmVkIGluIHRoZSByb3cvY29sdW1uLlxuICAgKiBAcGFyYW0gYmFzZVNpemUgQmFzZSBzaXplIG9mIGEgMXgxIHRpbGUgKGFzIGNvbXB1dGVkIGluIGdldEJhc2VUaWxlU2l6ZSkuXG4gICAqIEByZXR1cm4gUG9zaXRpb24gb2YgdGhlIHRpbGUgYXMgYSBDU1MgY2FsYygpIGV4cHJlc3Npb24uXG4gICAqL1xuICBnZXRUaWxlUG9zaXRpb24oYmFzZVNpemU6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIC8vIFRoZSBwb3NpdGlvbiBjb21lcyB0aGUgc2l6ZSBvZiBhIDF4MSB0aWxlIHBsdXMgZ3V0dGVyIGZvciBlYWNoIHByZXZpb3VzIHRpbGUgaW4gdGhlXG4gICAgLy8gcm93L2NvbHVtbiAob2Zmc2V0KS5cbiAgICByZXR1cm4gb2Zmc2V0ID09PSAwID8gJzAnIDogY2FsYyhgKCR7YmFzZVNpemV9ICsgJHt0aGlzLl9ndXR0ZXJTaXplfSkgKiAke29mZnNldH1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGFjdHVhbCBzaXplIG9mIGEgdGlsZSwgZS5nLiwgd2lkdGggb3IgaGVpZ2h0LCB0YWtpbmcgcm93c3BhbiBvciBjb2xzcGFuIGludG8gYWNjb3VudC5cbiAgICogQHBhcmFtIGJhc2VTaXplIEJhc2Ugc2l6ZSBvZiBhIDF4MSB0aWxlIChhcyBjb21wdXRlZCBpbiBnZXRCYXNlVGlsZVNpemUpLlxuICAgKiBAcGFyYW0gc3BhbiBUaGUgdGlsZSdzIHJvd3NwYW4gb3IgY29sc3Bhbi5cbiAgICogQHJldHVybiBTaXplIG9mIHRoZSB0aWxlIGFzIGEgQ1NTIGNhbGMoKSBleHByZXNzaW9uLlxuICAgKi9cbiAgZ2V0VGlsZVNpemUoYmFzZVNpemU6IHN0cmluZywgc3BhbjogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCgke2Jhc2VTaXplfSAqICR7c3Bhbn0pICsgKCR7c3BhbiAtIDF9ICogJHt0aGlzLl9ndXR0ZXJTaXplfSlgO1xuICB9XG5cblxuICAvKipcbiAgICogU2V0cyB0aGUgc3R5bGUgcHJvcGVydGllcyB0byBiZSBhcHBsaWVkIHRvIGEgdGlsZSBmb3IgdGhlIGdpdmVuIHJvdyBhbmQgY29sdW1uIGluZGV4LlxuICAgKiBAcGFyYW0gdGlsZSBUaWxlIHRvIHdoaWNoIHRvIGFwcGx5IHRoZSBzdHlsaW5nLlxuICAgKiBAcGFyYW0gcm93SW5kZXggSW5kZXggb2YgdGhlIHRpbGUncyByb3cuXG4gICAqIEBwYXJhbSBjb2xJbmRleCBJbmRleCBvZiB0aGUgdGlsZSdzIGNvbHVtbi5cbiAgICovXG4gIHNldFN0eWxlKHRpbGU6IE1hdEdyaWRUaWxlLCByb3dJbmRleDogbnVtYmVyLCBjb2xJbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gUGVyY2VudCBvZiB0aGUgYXZhaWxhYmxlIGhvcml6b250YWwgc3BhY2UgdGhhdCBvbmUgY29sdW1uIHRha2VzIHVwLlxuICAgIGxldCBwZXJjZW50V2lkdGhQZXJUaWxlID0gMTAwIC8gdGhpcy5fY29scztcblxuICAgIC8vIEZyYWN0aW9uIG9mIHRoZSB2ZXJ0aWNhbCBndXR0ZXIgc2l6ZSB0aGF0IGVhY2ggY29sdW1uIHRha2VzIHVwLlxuICAgIC8vIEZvciBleGFtcGxlLCBpZiB0aGVyZSBhcmUgNSBjb2x1bW5zLCBlYWNoIGNvbHVtbiB1c2VzIDQvNSA9IDAuOCB0aW1lcyB0aGUgZ3V0dGVyIHdpZHRoLlxuICAgIGxldCBndXR0ZXJXaWR0aEZyYWN0aW9uUGVyVGlsZSA9ICh0aGlzLl9jb2xzIC0gMSkgLyB0aGlzLl9jb2xzO1xuXG4gICAgdGhpcy5zZXRDb2xTdHlsZXModGlsZSwgY29sSW5kZXgsIHBlcmNlbnRXaWR0aFBlclRpbGUsIGd1dHRlcldpZHRoRnJhY3Rpb25QZXJUaWxlKTtcbiAgICB0aGlzLnNldFJvd1N0eWxlcyh0aWxlLCByb3dJbmRleCwgcGVyY2VudFdpZHRoUGVyVGlsZSwgZ3V0dGVyV2lkdGhGcmFjdGlvblBlclRpbGUpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGhvcml6b250YWwgcGxhY2VtZW50IG9mIHRoZSB0aWxlIGluIHRoZSBsaXN0LiAqL1xuICBzZXRDb2xTdHlsZXModGlsZTogTWF0R3JpZFRpbGUsIGNvbEluZGV4OiBudW1iZXIsIHBlcmNlbnRXaWR0aDogbnVtYmVyLFxuICAgICAgICAgICAgICAgZ3V0dGVyV2lkdGg6IG51bWJlcikge1xuICAgIC8vIEJhc2UgaG9yaXpvbnRhbCBzaXplIG9mIGEgY29sdW1uLlxuICAgIGxldCBiYXNlVGlsZVdpZHRoID0gdGhpcy5nZXRCYXNlVGlsZVNpemUocGVyY2VudFdpZHRoLCBndXR0ZXJXaWR0aCk7XG5cbiAgICAvLyBUaGUgd2lkdGggYW5kIGhvcml6b250YWwgcG9zaXRpb24gb2YgZWFjaCB0aWxlIGlzIGFsd2F5cyBjYWxjdWxhdGVkIHRoZSBzYW1lIHdheSwgYnV0IHRoZVxuICAgIC8vIGhlaWdodCBhbmQgdmVydGljYWwgcG9zaXRpb24gZGVwZW5kcyBvbiB0aGUgcm93TW9kZS5cbiAgICBsZXQgc2lkZSA9IHRoaXMuX2RpcmVjdGlvbiA9PT0gJ3J0bCcgPyAncmlnaHQnIDogJ2xlZnQnO1xuICAgIHRpbGUuX3NldFN0eWxlKHNpZGUsIHRoaXMuZ2V0VGlsZVBvc2l0aW9uKGJhc2VUaWxlV2lkdGgsIGNvbEluZGV4KSk7XG4gICAgdGlsZS5fc2V0U3R5bGUoJ3dpZHRoJywgY2FsYyh0aGlzLmdldFRpbGVTaXplKGJhc2VUaWxlV2lkdGgsIHRpbGUuY29sc3BhbikpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSB0b3RhbCBzaXplIHRha2VuIHVwIGJ5IGd1dHRlcnMgYWNyb3NzIG9uZSBheGlzIG9mIGEgbGlzdC5cbiAgICovXG4gIGdldEd1dHRlclNwYW4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7dGhpcy5fZ3V0dGVyU2l6ZX0gKiAoJHt0aGlzLl9yb3dzcGFufSAtIDEpYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSB0b3RhbCBzaXplIHRha2VuIHVwIGJ5IHRpbGVzIGFjcm9zcyBvbmUgYXhpcyBvZiBhIGxpc3QuXG4gICAqIEBwYXJhbSB0aWxlSGVpZ2h0IEhlaWdodCBvZiB0aGUgdGlsZS5cbiAgICovXG4gIGdldFRpbGVTcGFuKHRpbGVIZWlnaHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3RoaXMuX3Jvd3NwYW59ICogJHt0aGlzLmdldFRpbGVTaXplKHRpbGVIZWlnaHQsIDEpfWA7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmVydGljYWwgcGxhY2VtZW50IG9mIHRoZSB0aWxlIGluIHRoZSBsaXN0LlxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIGJlIGltcGxlbWVudGVkIGJ5IGVhY2ggdHlwZSBvZiBUaWxlU3R5bGVyLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBhYnN0cmFjdCBzZXRSb3dTdHlsZXModGlsZTogTWF0R3JpZFRpbGUsIHJvd0luZGV4OiBudW1iZXIsIHBlcmNlbnRXaWR0aDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3V0dGVyV2lkdGg6IG51bWJlcik6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGNvbXB1dGVkIGhlaWdodCBhbmQgcmV0dXJucyB0aGUgY29ycmVjdCBzdHlsZSBwcm9wZXJ0eSB0byBzZXQuXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBpbXBsZW1lbnRlZCBieSBlYWNoIHR5cGUgb2YgVGlsZVN0eWxlci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0Q29tcHV0ZWRIZWlnaHQoKTogW3N0cmluZywgc3RyaW5nXSB8IG51bGwgeyByZXR1cm4gbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdGlsZSBzdHlsZXIgaXMgc3dhcHBlZCBvdXQgd2l0aCBhIGRpZmZlcmVudCBvbmUuIFRvIGJlIHVzZWQgZm9yIGNsZWFudXAuXG4gICAqIEBwYXJhbSBsaXN0IEdyaWQgbGlzdCB0aGF0IHRoZSBzdHlsZXIgd2FzIGF0dGFjaGVkIHRvLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBhYnN0cmFjdCByZXNldChsaXN0OiBNYXRHcmlkTGlzdCk6IHZvaWQ7XG59XG5cblxuLyoqXG4gKiBUaGlzIHR5cGUgb2Ygc3R5bGVyIGlzIGluc3RhbnRpYXRlZCB3aGVuIHRoZSB1c2VyIHBhc3NlcyBpbiBhIGZpeGVkIHJvdyBoZWlnaHQuXG4gKiBFeGFtcGxlIGA8bWF0LWdyaWQtbGlzdCBjb2xzPVwiM1wiIHJvd0hlaWdodD1cIjEwMHB4XCI+YFxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgRml4ZWRUaWxlU3R5bGVyIGV4dGVuZHMgVGlsZVN0eWxlciB7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGZpeGVkUm93SGVpZ2h0OiBzdHJpbmcpIHsgc3VwZXIoKTsgfVxuXG4gIGluaXQoZ3V0dGVyU2l6ZTogc3RyaW5nLCB0cmFja2VyOiBUaWxlQ29vcmRpbmF0b3IsIGNvbHM6IG51bWJlciwgZGlyZWN0aW9uOiBzdHJpbmcpIHtcbiAgICBzdXBlci5pbml0KGd1dHRlclNpemUsIHRyYWNrZXIsIGNvbHMsIGRpcmVjdGlvbik7XG4gICAgdGhpcy5maXhlZFJvd0hlaWdodCA9IG5vcm1hbGl6ZVVuaXRzKHRoaXMuZml4ZWRSb3dIZWlnaHQpO1xuXG4gICAgaWYgKCFjc3NDYWxjQWxsb3dlZFZhbHVlLnRlc3QodGhpcy5maXhlZFJvd0hlaWdodCkpIHtcbiAgICAgIHRocm93IEVycm9yKGBJbnZhbGlkIHZhbHVlIFwiJHt0aGlzLmZpeGVkUm93SGVpZ2h0fVwiIHNldCBhcyByb3dIZWlnaHQuYCk7XG4gICAgfVxuICB9XG5cbiAgc2V0Um93U3R5bGVzKHRpbGU6IE1hdEdyaWRUaWxlLCByb3dJbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGlsZS5fc2V0U3R5bGUoJ3RvcCcsIHRoaXMuZ2V0VGlsZVBvc2l0aW9uKHRoaXMuZml4ZWRSb3dIZWlnaHQsIHJvd0luZGV4KSk7XG4gICAgdGlsZS5fc2V0U3R5bGUoJ2hlaWdodCcsIGNhbGModGhpcy5nZXRUaWxlU2l6ZSh0aGlzLmZpeGVkUm93SGVpZ2h0LCB0aWxlLnJvd3NwYW4pKSk7XG4gIH1cblxuICBnZXRDb21wdXRlZEhlaWdodCgpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ2hlaWdodCcsIGNhbGMoYCR7dGhpcy5nZXRUaWxlU3Bhbih0aGlzLmZpeGVkUm93SGVpZ2h0KX0gKyAke3RoaXMuZ2V0R3V0dGVyU3BhbigpfWApXG4gICAgXTtcbiAgfVxuXG4gIHJlc2V0KGxpc3Q6IE1hdEdyaWRMaXN0KSB7XG4gICAgbGlzdC5fc2V0TGlzdFN0eWxlKFsnaGVpZ2h0JywgbnVsbF0pO1xuXG4gICAgaWYgKGxpc3QuX3RpbGVzKSB7XG4gICAgICBsaXN0Ll90aWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgICB0aWxlLl9zZXRTdHlsZSgndG9wJywgbnVsbCk7XG4gICAgICAgIHRpbGUuX3NldFN0eWxlKCdoZWlnaHQnLCBudWxsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5cbi8qKlxuICogVGhpcyB0eXBlIG9mIHN0eWxlciBpcyBpbnN0YW50aWF0ZWQgd2hlbiB0aGUgdXNlciBwYXNzZXMgaW4gYSB3aWR0aDpoZWlnaHQgcmF0aW9cbiAqIGZvciB0aGUgcm93IGhlaWdodC4gIEV4YW1wbGUgYDxtYXQtZ3JpZC1saXN0IGNvbHM9XCIzXCIgcm93SGVpZ2h0PVwiMzoxXCI+YFxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgUmF0aW9UaWxlU3R5bGVyIGV4dGVuZHMgVGlsZVN0eWxlciB7XG5cbiAgLyoqIFJhdGlvIHdpZHRoOmhlaWdodCBnaXZlbiBieSB1c2VyIHRvIGRldGVybWluZSByb3cgaGVpZ2h0LiAqL1xuICByb3dIZWlnaHRSYXRpbzogbnVtYmVyO1xuICBiYXNlVGlsZUhlaWdodDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3BhcnNlUmF0aW8odmFsdWUpO1xuICB9XG5cbiAgc2V0Um93U3R5bGVzKHRpbGU6IE1hdEdyaWRUaWxlLCByb3dJbmRleDogbnVtYmVyLCBwZXJjZW50V2lkdGg6IG51bWJlcixcbiAgICAgICAgICAgICAgIGd1dHRlcldpZHRoOiBudW1iZXIpOiB2b2lkIHtcbiAgICBsZXQgcGVyY2VudEhlaWdodFBlclRpbGUgPSBwZXJjZW50V2lkdGggLyB0aGlzLnJvd0hlaWdodFJhdGlvO1xuICAgIHRoaXMuYmFzZVRpbGVIZWlnaHQgPSB0aGlzLmdldEJhc2VUaWxlU2l6ZShwZXJjZW50SGVpZ2h0UGVyVGlsZSwgZ3V0dGVyV2lkdGgpO1xuXG4gICAgLy8gVXNlIHBhZGRpbmctdG9wIGFuZCBtYXJnaW4tdG9wIHRvIG1haW50YWluIHRoZSBnaXZlbiBhc3BlY3QgcmF0aW8sIGFzXG4gICAgLy8gYSBwZXJjZW50YWdlLWJhc2VkIHZhbHVlIGZvciB0aGVzZSBwcm9wZXJ0aWVzIGlzIGFwcGxpZWQgdmVyc3VzIHRoZSAqd2lkdGgqIG9mIHRoZVxuICAgIC8vIGNvbnRhaW5pbmcgYmxvY2suIFNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi9DU1MyL2JveC5odG1sI21hcmdpbi1wcm9wZXJ0aWVzXG4gICAgdGlsZS5fc2V0U3R5bGUoJ21hcmdpblRvcCcsIHRoaXMuZ2V0VGlsZVBvc2l0aW9uKHRoaXMuYmFzZVRpbGVIZWlnaHQsIHJvd0luZGV4KSk7XG4gICAgdGlsZS5fc2V0U3R5bGUoJ3BhZGRpbmdUb3AnLCBjYWxjKHRoaXMuZ2V0VGlsZVNpemUodGhpcy5iYXNlVGlsZUhlaWdodCwgdGlsZS5yb3dzcGFuKSkpO1xuICB9XG5cbiAgZ2V0Q29tcHV0ZWRIZWlnaHQoKTogW3N0cmluZywgc3RyaW5nXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICdwYWRkaW5nQm90dG9tJywgY2FsYyhgJHt0aGlzLmdldFRpbGVTcGFuKHRoaXMuYmFzZVRpbGVIZWlnaHQpfSArICR7dGhpcy5nZXRHdXR0ZXJTcGFuKCl9YClcbiAgICBdO1xuICB9XG5cbiAgcmVzZXQobGlzdDogTWF0R3JpZExpc3QpIHtcbiAgICBsaXN0Ll9zZXRMaXN0U3R5bGUoWydwYWRkaW5nQm90dG9tJywgbnVsbF0pO1xuXG4gICAgbGlzdC5fdGlsZXMuZm9yRWFjaCh0aWxlID0+IHtcbiAgICAgIHRpbGUuX3NldFN0eWxlKCdtYXJnaW5Ub3AnLCBudWxsKTtcbiAgICAgIHRpbGUuX3NldFN0eWxlKCdwYWRkaW5nVG9wJywgbnVsbCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9wYXJzZVJhdGlvKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCByYXRpb1BhcnRzID0gdmFsdWUuc3BsaXQoJzonKTtcblxuICAgIGlmIChyYXRpb1BhcnRzLmxlbmd0aCAhPT0gMikge1xuICAgICAgdGhyb3cgRXJyb3IoYG1hdC1ncmlkLWxpc3Q6IGludmFsaWQgcmF0aW8gZ2l2ZW4gZm9yIHJvdy1oZWlnaHQ6IFwiJHt2YWx1ZX1cImApO1xuICAgIH1cblxuICAgIHRoaXMucm93SGVpZ2h0UmF0aW8gPSBwYXJzZUZsb2F0KHJhdGlvUGFydHNbMF0pIC8gcGFyc2VGbG9hdChyYXRpb1BhcnRzWzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgdHlwZSBvZiBzdHlsZXIgaXMgaW5zdGFudGlhdGVkIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhIFwiZml0XCIgcm93IGhlaWdodCBtb2RlLlxuICogSW4gb3RoZXIgd29yZHMsIHRoZSByb3cgaGVpZ2h0IHdpbGwgcmVmbGVjdCB0aGUgdG90YWwgaGVpZ2h0IG9mIHRoZSBjb250YWluZXIgZGl2aWRlZFxuICogYnkgdGhlIG51bWJlciBvZiByb3dzLiAgRXhhbXBsZSBgPG1hdC1ncmlkLWxpc3QgY29scz1cIjNcIiByb3dIZWlnaHQ9XCJmaXRcIj5gXG4gKlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgRml0VGlsZVN0eWxlciBleHRlbmRzIFRpbGVTdHlsZXIge1xuICBzZXRSb3dTdHlsZXModGlsZTogTWF0R3JpZFRpbGUsIHJvd0luZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBQZXJjZW50IG9mIHRoZSBhdmFpbGFibGUgdmVydGljYWwgc3BhY2UgdGhhdCBvbmUgcm93IHRha2VzIHVwLlxuICAgIGxldCBwZXJjZW50SGVpZ2h0UGVyVGlsZSA9IDEwMCAvIHRoaXMuX3Jvd3NwYW47XG5cbiAgICAvLyBGcmFjdGlvbiBvZiB0aGUgaG9yaXpvbnRhbCBndXR0ZXIgc2l6ZSB0aGF0IGVhY2ggY29sdW1uIHRha2VzIHVwLlxuICAgIGxldCBndXR0ZXJIZWlnaHRQZXJUaWxlID0gKHRoaXMuX3Jvd3MgLSAxKSAvIHRoaXMuX3Jvd3M7XG5cbiAgICAvLyBCYXNlIHZlcnRpY2FsIHNpemUgb2YgYSBjb2x1bW4uXG4gICAgbGV0IGJhc2VUaWxlSGVpZ2h0ID0gdGhpcy5nZXRCYXNlVGlsZVNpemUocGVyY2VudEhlaWdodFBlclRpbGUsIGd1dHRlckhlaWdodFBlclRpbGUpO1xuXG4gICAgdGlsZS5fc2V0U3R5bGUoJ3RvcCcsIHRoaXMuZ2V0VGlsZVBvc2l0aW9uKGJhc2VUaWxlSGVpZ2h0LCByb3dJbmRleCkpO1xuICAgIHRpbGUuX3NldFN0eWxlKCdoZWlnaHQnLCBjYWxjKHRoaXMuZ2V0VGlsZVNpemUoYmFzZVRpbGVIZWlnaHQsIHRpbGUucm93c3BhbikpKTtcbiAgfVxuXG4gIHJlc2V0KGxpc3Q6IE1hdEdyaWRMaXN0KSB7XG4gICAgaWYgKGxpc3QuX3RpbGVzKSB7XG4gICAgICBsaXN0Ll90aWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgICB0aWxlLl9zZXRTdHlsZSgndG9wJywgbnVsbCk7XG4gICAgICAgIHRpbGUuX3NldFN0eWxlKCdoZWlnaHQnLCBudWxsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5cbi8qKiBXcmFwcyBhIENTUyBzdHJpbmcgaW4gYSBjYWxjIGZ1bmN0aW9uICovXG5mdW5jdGlvbiBjYWxjKGV4cDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGBjYWxjKCR7ZXhwfSlgO1xufVxuXG5cbi8qKiBBcHBlbmRzIHBpeGVscyB0byBhIENTUyBzdHJpbmcgaWYgbm8gdW5pdHMgYXJlIGdpdmVuLiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplVW5pdHModmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB2YWx1ZS5tYXRjaCgvKFtBLVphLXolXSspJC8pID8gdmFsdWUgOiBgJHt2YWx1ZX1weGA7XG59XG5cbiJdfQ==