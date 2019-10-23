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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS1zdHlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZ3JpZC1saXN0L3RpbGUtc3R5bGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7TUFnQk0sbUJBQW1CLEdBQUcsK0JBQStCOzs7Ozs7O0FBTzNELE1BQU0sT0FBZ0IsVUFBVTtJQUFoQztRQUVFLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsYUFBUSxHQUFXLENBQUMsQ0FBQztJQWlJdkIsQ0FBQzs7Ozs7Ozs7Ozs7SUFwSEMsSUFBSSxDQUFDLFVBQWtCLEVBQUUsT0FBd0IsRUFBRSxJQUFZLEVBQUUsU0FBaUI7UUFDaEYsSUFBSSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUM5QixDQUFDOzs7Ozs7OztJQVNELGVBQWUsQ0FBQyxXQUFtQixFQUFFLGNBQXNCO1FBQ3pELHNGQUFzRjtRQUN0RiwwRkFBMEY7UUFDMUYsNEZBQTRGO1FBQzVGLDBGQUEwRjtRQUMxRixnQ0FBZ0M7UUFDaEMsT0FBTyxJQUFJLFdBQVcsUUFBUSxJQUFJLENBQUMsV0FBVyxNQUFNLGNBQWMsSUFBSSxDQUFDO0lBQ3pFLENBQUM7Ozs7Ozs7SUFTRCxlQUFlLENBQUMsUUFBZ0IsRUFBRSxNQUFjO1FBQzlDLHNGQUFzRjtRQUN0Rix1QkFBdUI7UUFDdkIsT0FBTyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsTUFBTSxJ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QyxDQUFDLEVBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztDQUNGOzs7Ozs7QUFJRCxTQUFTLElBQUksQ0FBQyxHQUFXO0lBQ3ZCLE9BQU8sUUFBUSxHQUFHLEdBQUcsQ0FBQztBQUN4QixDQUFDOzs7Ozs7QUFJRCxTQUFTLGNBQWMsQ0FBQyxLQUFhO0lBQ25DLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDO0FBQzdELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNYXRHcmlkTGlzdH0gZnJvbSAnLi9ncmlkLWxpc3QnO1xuaW1wb3J0IHtNYXRHcmlkVGlsZX0gZnJvbSAnLi9ncmlkLXRpbGUnO1xuaW1wb3J0IHtUaWxlQ29vcmRpbmF0b3J9IGZyb20gJy4vdGlsZS1jb29yZGluYXRvcic7XG5cbi8qKlxuICogUmVnRXhwIHRoYXQgY2FuIGJlIHVzZWQgdG8gY2hlY2sgd2hldGhlciBhIHZhbHVlIHdpbGxcbiAqIGJlIGFsbG93ZWQgaW5zaWRlIGEgQ1NTIGBjYWxjKClgIGV4cHJlc3Npb24uXG4gKi9cbmNvbnN0IGNzc0NhbGNBbGxvd2VkVmFsdWUgPSAvXi0/XFxkKygoXFwuXFxkKyk/W0EtWmEteiUkXT8pKyQvO1xuXG4vKipcbiAqIFNldHMgdGhlIHN0eWxlIHByb3BlcnRpZXMgZm9yIGFuIGluZGl2aWR1YWwgdGlsZSwgZ2l2ZW4gdGhlIHBvc2l0aW9uIGNhbGN1bGF0ZWQgYnkgdGhlXG4gKiBUaWxlIENvb3JkaW5hdG9yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVGlsZVN0eWxlciB7XG4gIF9ndXR0ZXJTaXplOiBzdHJpbmc7XG4gIF9yb3dzOiBudW1iZXIgPSAwO1xuICBfcm93c3BhbjogbnVtYmVyID0gMDtcbiAgX2NvbHM6IG51bWJlcjtcbiAgX2RpcmVjdGlvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGRzIGdyaWQtbGlzdCBsYXlvdXQgaW5mbyBvbmNlIGl0IGlzIGF2YWlsYWJsZS4gQ2Fubm90IGJlIHByb2Nlc3NlZCBpbiB0aGUgY29uc3RydWN0b3JcbiAgICogYmVjYXVzZSB0aGVzZSBwcm9wZXJ0aWVzIGhhdmVuJ3QgYmVlbiBjYWxjdWxhdGVkIGJ5IHRoYXQgcG9pbnQuXG4gICAqXG4gICAqIEBwYXJhbSBndXR0ZXJTaXplIFNpemUgb2YgdGhlIGdyaWQncyBndXR0ZXIuXG4gICAqIEBwYXJhbSB0cmFja2VyIEluc3RhbmNlIG9mIHRoZSBUaWxlQ29vcmRpbmF0b3IuXG4gICAqIEBwYXJhbSBjb2xzIEFtb3VudCBvZiBjb2x1bW5zIGluIHRoZSBncmlkLlxuICAgKiBAcGFyYW0gZGlyZWN0aW9uIExheW91dCBkaXJlY3Rpb24gb2YgdGhlIGdyaWQuXG4gICAqL1xuICBpbml0KGd1dHRlclNpemU6IHN0cmluZywgdHJhY2tlcjogVGlsZUNvb3JkaW5hdG9yLCBjb2xzOiBudW1iZXIsIGRpcmVjdGlvbjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fZ3V0dGVyU2l6ZSA9IG5vcm1hbGl6ZVVuaXRzKGd1dHRlclNpemUpO1xuICAgIHRoaXMuX3Jvd3MgPSB0cmFja2VyLnJvd0NvdW50O1xuICAgIHRoaXMuX3Jvd3NwYW4gPSB0cmFja2VyLnJvd3NwYW47XG4gICAgdGhpcy5fY29scyA9IGNvbHM7XG4gICAgdGhpcy5fZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGVzIHRoZSBhbW91bnQgb2Ygc3BhY2UgYSBzaW5nbGUgMXgxIHRpbGUgd291bGQgdGFrZSB1cCAod2lkdGggb3IgaGVpZ2h0KS5cbiAgICogVXNlZCBhcyBhIGJhc2lzIGZvciBvdGhlciBjYWxjdWxhdGlvbnMuXG4gICAqIEBwYXJhbSBzaXplUGVyY2VudCBQZXJjZW50IG9mIHRoZSB0b3RhbCBncmlkLWxpc3Qgc3BhY2UgdGhhdCBvbmUgMXgxIHRpbGUgd291bGQgdGFrZSB1cC5cbiAgICogQHBhcmFtIGd1dHRlckZyYWN0aW9uIEZyYWN0aW9uIG9mIHRoZSBndXR0ZXIgc2l6ZSB0YWtlbiB1cCBieSBvbmUgMXgxIHRpbGUuXG4gICAqIEByZXR1cm4gVGhlIHNpemUgb2YgYSAxeDEgdGlsZSBhcyBhbiBleHByZXNzaW9uIHRoYXQgY2FuIGJlIGV2YWx1YXRlZCB2aWEgQ1NTIGNhbGMoKS5cbiAgICovXG4gIGdldEJhc2VUaWxlU2l6ZShzaXplUGVyY2VudDogbnVtYmVyLCBndXR0ZXJGcmFjdGlvbjogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAvLyBUYWtlIHRoZSBiYXNlIHNpemUgcGVyY2VudCAoYXMgd291bGQgYmUgaWYgZXZlbmx5IGRpdmlkaW5nIHRoZSBzaXplIGJldHdlZW4gY2VsbHMpLFxuICAgIC8vIGFuZCB0aGVuIHN1YnRyYWN0aW5nIHRoZSBzaXplIG9mIG9uZSBndXR0ZXIuIEhvd2V2ZXIsIHNpbmNlIHRoZXJlIGFyZSBubyBndXR0ZXJzIG9uIHRoZVxuICAgIC8vIGVkZ2VzLCBlYWNoIHRpbGUgb25seSB1c2VzIGEgZnJhY3Rpb24gKGd1dHRlclNoYXJlID0gbnVtR3V0dGVycyAvIG51bUNlbGxzKSBvZiB0aGUgZ3V0dGVyXG4gICAgLy8gc2l6ZS4gKEltYWdpbmUgaGF2aW5nIG9uZSBndXR0ZXIgcGVyIHRpbGUsIGFuZCB0aGVuIGJyZWFraW5nIHVwIHRoZSBleHRyYSBndXR0ZXIgb24gdGhlXG4gICAgLy8gZWRnZSBldmVubHkgYW1vbmcgdGhlIGNlbGxzKS5cbiAgICByZXR1cm4gYCgke3NpemVQZXJjZW50fSUgLSAoJHt0aGlzLl9ndXR0ZXJTaXplfSAqICR7Z3V0dGVyRnJhY3Rpb259KSlgO1xuICB9XG5cblxuICAvKipcbiAgICogR2V0cyBUaGUgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCBwb3NpdGlvbiBvZiBhIHRpbGUsIGUuZy4sIHRoZSAndG9wJyBvciAnbGVmdCcgcHJvcGVydHkgdmFsdWUuXG4gICAqIEBwYXJhbSBvZmZzZXQgTnVtYmVyIG9mIHRpbGVzIHRoYXQgaGF2ZSBhbHJlYWR5IGJlZW4gcmVuZGVyZWQgaW4gdGhlIHJvdy9jb2x1bW4uXG4gICAqIEBwYXJhbSBiYXNlU2l6ZSBCYXNlIHNpemUgb2YgYSAxeDEgdGlsZSAoYXMgY29tcHV0ZWQgaW4gZ2V0QmFzZVRpbGVTaXplKS5cbiAgICogQHJldHVybiBQb3NpdGlvbiBvZiB0aGUgdGlsZSBhcyBhIENTUyBjYWxjKCkgZXhwcmVzc2lvbi5cbiAgICovXG4gIGdldFRpbGVQb3NpdGlvbihiYXNlU2l6ZTogc3RyaW5nLCBvZmZzZXQ6IG51bWJlcik6IHN0cmluZyB7XG4gICAgLy8gVGhlIHBvc2l0aW9uIGNvbWVzIHRoZSBzaXplIG9mIGEgMXgxIHRpbGUgcGx1cyBndXR0ZXIgZm9yIGVhY2ggcHJldmlvdXMgdGlsZSBpbiB0aGVcbiAgICAvLyByb3cvY29sdW1uIChvZmZzZXQpLlxuICAgIHJldHVybiBvZmZzZXQgPT09IDAgPyAnMCcgOiBjYWxjKGAoJHtiYXNlU2l6ZX0gKyAke3RoaXMuX2d1dHRlclNpemV9KSAqICR7b2Zmc2V0fWApO1xuICB9XG5cblxuICAvKipcbiAgICogR2V0cyB0aGUgYWN0dWFsIHNpemUgb2YgYSB0aWxlLCBlLmcuLCB3aWR0aCBvciBoZWlnaHQsIHRha2luZyByb3dzcGFuIG9yIGNvbHNwYW4gaW50byBhY2NvdW50LlxuICAgKiBAcGFyYW0gYmFzZVNpemUgQmFzZSBzaXplIG9mIGEgMXgxIHRpbGUgKGFzIGNvbXB1dGVkIGluIGdldEJhc2VUaWxlU2l6ZSkuXG4gICAqIEBwYXJhbSBzcGFuIFRoZSB0aWxlJ3Mgcm93c3BhbiBvciBjb2xzcGFuLlxuICAgKiBAcmV0dXJuIFNpemUgb2YgdGhlIHRpbGUgYXMgYSBDU1MgY2FsYygpIGV4cHJlc3Npb24uXG4gICAqL1xuICBnZXRUaWxlU2l6ZShiYXNlU2l6ZTogc3RyaW5nLCBzcGFuOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBgKCR7YmFzZVNpemV9ICogJHtzcGFufSkgKyAoJHtzcGFuIC0gMX0gKiAke3RoaXMuX2d1dHRlclNpemV9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdHlsZSBwcm9wZXJ0aWVzIHRvIGJlIGFwcGxpZWQgdG8gYSB0aWxlIGZvciB0aGUgZ2l2ZW4gcm93IGFuZCBjb2x1bW4gaW5kZXguXG4gICAqIEBwYXJhbSB0aWxlIFRpbGUgdG8gd2hpY2ggdG8gYXBwbHkgdGhlIHN0eWxpbmcuXG4gICAqIEBwYXJhbSByb3dJbmRleCBJbmRleCBvZiB0aGUgdGlsZSdzIHJvdy5cbiAgICogQHBhcmFtIGNvbEluZGV4IEluZGV4IG9mIHRoZSB0aWxlJ3MgY29sdW1uLlxuICAgKi9cbiAgc2V0U3R5bGUodGlsZTogTWF0R3JpZFRpbGUsIHJvd0luZGV4OiBudW1iZXIsIGNvbEluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBQZXJjZW50IG9mIHRoZSBhdmFpbGFibGUgaG9yaXpvbnRhbCBzcGFjZSB0aGF0IG9uZSBjb2x1bW4gdGFrZXMgdXAuXG4gICAgbGV0IHBlcmNlbnRXaWR0aFBlclRpbGUgPSAxMDAgLyB0aGlzLl9jb2xzO1xuXG4gICAgLy8gRnJhY3Rpb24gb2YgdGhlIHZlcnRpY2FsIGd1dHRlciBzaXplIHRoYXQgZWFjaCBjb2x1bW4gdGFrZXMgdXAuXG4gICAgLy8gRm9yIGV4YW1wbGUsIGlmIHRoZXJlIGFyZSA1IGNvbHVtbnMsIGVhY2ggY29sdW1uIHVzZXMgNC81ID0gMC44IHRpbWVzIHRoZSBndXR0ZXIgd2lkdGguXG4gICAgbGV0IGd1dHRlcldpZHRoRnJhY3Rpb25QZXJUaWxlID0gKHRoaXMuX2NvbHMgLSAxKSAvIHRoaXMuX2NvbHM7XG5cbiAgICB0aGlzLnNldENvbFN0eWxlcyh0aWxlLCBjb2xJbmRleCwgcGVyY2VudFdpZHRoUGVyVGlsZSwgZ3V0dGVyV2lkdGhGcmFjdGlvblBlclRpbGUpO1xuICAgIHRoaXMuc2V0Um93U3R5bGVzKHRpbGUsIHJvd0luZGV4LCBwZXJjZW50V2lkdGhQZXJUaWxlLCBndXR0ZXJXaWR0aEZyYWN0aW9uUGVyVGlsZSk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgaG9yaXpvbnRhbCBwbGFjZW1lbnQgb2YgdGhlIHRpbGUgaW4gdGhlIGxpc3QuICovXG4gIHNldENvbFN0eWxlcyh0aWxlOiBNYXRHcmlkVGlsZSwgY29sSW5kZXg6IG51bWJlciwgcGVyY2VudFdpZHRoOiBudW1iZXIsXG4gICAgICAgICAgICAgICBndXR0ZXJXaWR0aDogbnVtYmVyKSB7XG4gICAgLy8gQmFzZSBob3Jpem9udGFsIHNpemUgb2YgYSBjb2x1bW4uXG4gICAgbGV0IGJhc2VUaWxlV2lkdGggPSB0aGlzLmdldEJhc2VUaWxlU2l6ZShwZXJjZW50V2lkdGgsIGd1dHRlcldpZHRoKTtcblxuICAgIC8vIFRoZSB3aWR0aCBhbmQgaG9yaXpvbnRhbCBwb3NpdGlvbiBvZiBlYWNoIHRpbGUgaXMgYWx3YXlzIGNhbGN1bGF0ZWQgdGhlIHNhbWUgd2F5LCBidXQgdGhlXG4gICAgLy8gaGVpZ2h0IGFuZCB2ZXJ0aWNhbCBwb3NpdGlvbiBkZXBlbmRzIG9uIHRoZSByb3dNb2RlLlxuICAgIGxldCBzaWRlID0gdGhpcy5fZGlyZWN0aW9uID09PSAncnRsJyA/ICdyaWdodCcgOiAnbGVmdCc7XG4gICAgdGlsZS5fc2V0U3R5bGUoc2lkZSwgdGhpcy5nZXRUaWxlUG9zaXRpb24oYmFzZVRpbGVXaWR0aCwgY29sSW5kZXgpKTtcbiAgICB0aWxlLl9zZXRTdHlsZSgnd2lkdGgnLCBjYWxjKHRoaXMuZ2V0VGlsZVNpemUoYmFzZVRpbGVXaWR0aCwgdGlsZS5jb2xzcGFuKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHRvdGFsIHNpemUgdGFrZW4gdXAgYnkgZ3V0dGVycyBhY3Jvc3Mgb25lIGF4aXMgb2YgYSBsaXN0LlxuICAgKi9cbiAgZ2V0R3V0dGVyU3BhbigpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt0aGlzLl9ndXR0ZXJTaXplfSAqICgke3RoaXMuX3Jvd3NwYW59IC0gMSlgO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHRvdGFsIHNpemUgdGFrZW4gdXAgYnkgdGlsZXMgYWNyb3NzIG9uZSBheGlzIG9mIGEgbGlzdC5cbiAgICogQHBhcmFtIHRpbGVIZWlnaHQgSGVpZ2h0IG9mIHRoZSB0aWxlLlxuICAgKi9cbiAgZ2V0VGlsZVNwYW4odGlsZUhlaWdodDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7dGhpcy5fcm93c3Bhbn0gKiAke3RoaXMuZ2V0VGlsZVNpemUodGlsZUhlaWdodCwgMSl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2ZXJ0aWNhbCBwbGFjZW1lbnQgb2YgdGhlIHRpbGUgaW4gdGhlIGxpc3QuXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgYmUgaW1wbGVtZW50ZWQgYnkgZWFjaCB0eXBlIG9mIFRpbGVTdHlsZXIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGFic3RyYWN0IHNldFJvd1N0eWxlcyh0aWxlOiBNYXRHcmlkVGlsZSwgcm93SW5kZXg6IG51bWJlciwgcGVyY2VudFdpZHRoOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBndXR0ZXJXaWR0aDogbnVtYmVyKTogdm9pZDtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgY29tcHV0ZWQgaGVpZ2h0IGFuZCByZXR1cm5zIHRoZSBjb3JyZWN0IHN0eWxlIHByb3BlcnR5IHRvIHNldC5cbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIGltcGxlbWVudGVkIGJ5IGVhY2ggdHlwZSBvZiBUaWxlU3R5bGVyLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXRDb21wdXRlZEhlaWdodCgpOiBbc3RyaW5nLCBzdHJpbmddIHwgbnVsbCB7IHJldHVybiBudWxsOyB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB0aWxlIHN0eWxlciBpcyBzd2FwcGVkIG91dCB3aXRoIGEgZGlmZmVyZW50IG9uZS4gVG8gYmUgdXNlZCBmb3IgY2xlYW51cC5cbiAgICogQHBhcmFtIGxpc3QgR3JpZCBsaXN0IHRoYXQgdGhlIHN0eWxlciB3YXMgYXR0YWNoZWQgdG8uXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGFic3RyYWN0IHJlc2V0KGxpc3Q6IE1hdEdyaWRMaXN0KTogdm9pZDtcbn1cblxuXG4vKipcbiAqIFRoaXMgdHlwZSBvZiBzdHlsZXIgaXMgaW5zdGFudGlhdGVkIHdoZW4gdGhlIHVzZXIgcGFzc2VzIGluIGEgZml4ZWQgcm93IGhlaWdodC5cbiAqIEV4YW1wbGUgYDxtYXQtZ3JpZC1saXN0IGNvbHM9XCIzXCIgcm93SGVpZ2h0PVwiMTAwcHhcIj5gXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBGaXhlZFRpbGVTdHlsZXIgZXh0ZW5kcyBUaWxlU3R5bGVyIHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZml4ZWRSb3dIZWlnaHQ6IHN0cmluZykgeyBzdXBlcigpOyB9XG5cbiAgaW5pdChndXR0ZXJTaXplOiBzdHJpbmcsIHRyYWNrZXI6IFRpbGVDb29yZGluYXRvciwgY29sczogbnVtYmVyLCBkaXJlY3Rpb246IHN0cmluZykge1xuICAgIHN1cGVyLmluaXQoZ3V0dGVyU2l6ZSwgdHJhY2tlciwgY29scywgZGlyZWN0aW9uKTtcbiAgICB0aGlzLmZpeGVkUm93SGVpZ2h0ID0gbm9ybWFsaXplVW5pdHModGhpcy5maXhlZFJvd0hlaWdodCk7XG5cbiAgICBpZiAoIWNzc0NhbGNBbGxvd2VkVmFsdWUudGVzdCh0aGlzLmZpeGVkUm93SGVpZ2h0KSkge1xuICAgICAgdGhyb3cgRXJyb3IoYEludmFsaWQgdmFsdWUgXCIke3RoaXMuZml4ZWRSb3dIZWlnaHR9XCIgc2V0IGFzIHJvd0hlaWdodC5gKTtcbiAgICB9XG4gIH1cblxuICBzZXRSb3dTdHlsZXModGlsZTogTWF0R3JpZFRpbGUsIHJvd0luZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aWxlLl9zZXRTdHlsZSgndG9wJywgdGhpcy5nZXRUaWxlUG9zaXRpb24odGhpcy5maXhlZFJvd0hlaWdodCwgcm93SW5kZXgpKTtcbiAgICB0aWxlLl9zZXRTdHlsZSgnaGVpZ2h0JywgY2FsYyh0aGlzLmdldFRpbGVTaXplKHRoaXMuZml4ZWRSb3dIZWlnaHQsIHRpbGUucm93c3BhbikpKTtcbiAgfVxuXG4gIGdldENvbXB1dGVkSGVpZ2h0KCk6IFtzdHJpbmcsIHN0cmluZ10ge1xuICAgIHJldHVybiBbXG4gICAgICAnaGVpZ2h0JywgY2FsYyhgJHt0aGlzLmdldFRpbGVTcGFuKHRoaXMuZml4ZWRSb3dIZWlnaHQpfSArICR7dGhpcy5nZXRHdXR0ZXJTcGFuKCl9YClcbiAgICBdO1xuICB9XG5cbiAgcmVzZXQobGlzdDogTWF0R3JpZExpc3QpIHtcbiAgICBsaXN0Ll9zZXRMaXN0U3R5bGUoWydoZWlnaHQnLCBudWxsXSk7XG5cbiAgICBpZiAobGlzdC5fdGlsZXMpIHtcbiAgICAgIGxpc3QuX3RpbGVzLmZvckVhY2godGlsZSA9PiB7XG4gICAgICAgIHRpbGUuX3NldFN0eWxlKCd0b3AnLCBudWxsKTtcbiAgICAgICAgdGlsZS5fc2V0U3R5bGUoJ2hlaWdodCcsIG51bGwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cblxuLyoqXG4gKiBUaGlzIHR5cGUgb2Ygc3R5bGVyIGlzIGluc3RhbnRpYXRlZCB3aGVuIHRoZSB1c2VyIHBhc3NlcyBpbiBhIHdpZHRoOmhlaWdodCByYXRpb1xuICogZm9yIHRoZSByb3cgaGVpZ2h0LiAgRXhhbXBsZSBgPG1hdC1ncmlkLWxpc3QgY29scz1cIjNcIiByb3dIZWlnaHQ9XCIzOjFcIj5gXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBSYXRpb1RpbGVTdHlsZXIgZXh0ZW5kcyBUaWxlU3R5bGVyIHtcblxuICAvKiogUmF0aW8gd2lkdGg6aGVpZ2h0IGdpdmVuIGJ5IHVzZXIgdG8gZGV0ZXJtaW5lIHJvdyBoZWlnaHQuICovXG4gIHJvd0hlaWdodFJhdGlvOiBudW1iZXI7XG4gIGJhc2VUaWxlSGVpZ2h0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fcGFyc2VSYXRpbyh2YWx1ZSk7XG4gIH1cblxuICBzZXRSb3dTdHlsZXModGlsZTogTWF0R3JpZFRpbGUsIHJvd0luZGV4OiBudW1iZXIsIHBlcmNlbnRXaWR0aDogbnVtYmVyLFxuICAgICAgICAgICAgICAgZ3V0dGVyV2lkdGg6IG51bWJlcik6IHZvaWQge1xuICAgIGxldCBwZXJjZW50SGVpZ2h0UGVyVGlsZSA9IHBlcmNlbnRXaWR0aCAvIHRoaXMucm93SGVpZ2h0UmF0aW87XG4gICAgdGhpcy5iYXNlVGlsZUhlaWdodCA9IHRoaXMuZ2V0QmFzZVRpbGVTaXplKHBlcmNlbnRIZWlnaHRQZXJUaWxlLCBndXR0ZXJXaWR0aCk7XG5cbiAgICAvLyBVc2UgcGFkZGluZy10b3AgYW5kIG1hcmdpbi10b3AgdG8gbWFpbnRhaW4gdGhlIGdpdmVuIGFzcGVjdCByYXRpbywgYXNcbiAgICAvLyBhIHBlcmNlbnRhZ2UtYmFzZWQgdmFsdWUgZm9yIHRoZXNlIHByb3BlcnRpZXMgaXMgYXBwbGllZCB2ZXJzdXMgdGhlICp3aWR0aCogb2YgdGhlXG4gICAgLy8gY29udGFpbmluZyBibG9jay4gU2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL0NTUzIvYm94Lmh0bWwjbWFyZ2luLXByb3BlcnRpZXNcbiAgICB0aWxlLl9zZXRTdHlsZSgnbWFyZ2luVG9wJywgdGhpcy5nZXRUaWxlUG9zaXRpb24odGhpcy5iYXNlVGlsZUhlaWdodCwgcm93SW5kZXgpKTtcbiAgICB0aWxlLl9zZXRTdHlsZSgncGFkZGluZ1RvcCcsIGNhbGModGhpcy5nZXRUaWxlU2l6ZSh0aGlzLmJhc2VUaWxlSGVpZ2h0LCB0aWxlLnJvd3NwYW4pKSk7XG4gIH1cblxuICBnZXRDb21wdXRlZEhlaWdodCgpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ3BhZGRpbmdCb3R0b20nLCBjYWxjKGAke3RoaXMuZ2V0VGlsZVNwYW4odGhpcy5iYXNlVGlsZUhlaWdodCl9ICsgJHt0aGlzLmdldEd1dHRlclNwYW4oKX1gKVxuICAgIF07XG4gIH1cblxuICByZXNldChsaXN0OiBNYXRHcmlkTGlzdCkge1xuICAgIGxpc3QuX3NldExpc3RTdHlsZShbJ3BhZGRpbmdCb3R0b20nLCBudWxsXSk7XG5cbiAgICBsaXN0Ll90aWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgdGlsZS5fc2V0U3R5bGUoJ21hcmdpblRvcCcsIG51bGwpO1xuICAgICAgdGlsZS5fc2V0U3R5bGUoJ3BhZGRpbmdUb3AnLCBudWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3BhcnNlUmF0aW8odmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHJhdGlvUGFydHMgPSB2YWx1ZS5zcGxpdCgnOicpO1xuXG4gICAgaWYgKHJhdGlvUGFydHMubGVuZ3RoICE9PSAyKSB7XG4gICAgICB0aHJvdyBFcnJvcihgbWF0LWdyaWQtbGlzdDogaW52YWxpZCByYXRpbyBnaXZlbiBmb3Igcm93LWhlaWdodDogXCIke3ZhbHVlfVwiYCk7XG4gICAgfVxuXG4gICAgdGhpcy5yb3dIZWlnaHRSYXRpbyA9IHBhcnNlRmxvYXQocmF0aW9QYXJ0c1swXSkgLyBwYXJzZUZsb2F0KHJhdGlvUGFydHNbMV0pO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyB0eXBlIG9mIHN0eWxlciBpcyBpbnN0YW50aWF0ZWQgd2hlbiB0aGUgdXNlciBzZWxlY3RzIGEgXCJmaXRcIiByb3cgaGVpZ2h0IG1vZGUuXG4gKiBJbiBvdGhlciB3b3JkcywgdGhlIHJvdyBoZWlnaHQgd2lsbCByZWZsZWN0IHRoZSB0b3RhbCBoZWlnaHQgb2YgdGhlIGNvbnRhaW5lciBkaXZpZGVkXG4gKiBieSB0aGUgbnVtYmVyIG9mIHJvd3MuICBFeGFtcGxlIGA8bWF0LWdyaWQtbGlzdCBjb2xzPVwiM1wiIHJvd0hlaWdodD1cImZpdFwiPmBcbiAqXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBGaXRUaWxlU3R5bGVyIGV4dGVuZHMgVGlsZVN0eWxlciB7XG4gIHNldFJvd1N0eWxlcyh0aWxlOiBNYXRHcmlkVGlsZSwgcm93SW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIFBlcmNlbnQgb2YgdGhlIGF2YWlsYWJsZSB2ZXJ0aWNhbCBzcGFjZSB0aGF0IG9uZSByb3cgdGFrZXMgdXAuXG4gICAgbGV0IHBlcmNlbnRIZWlnaHRQZXJUaWxlID0gMTAwIC8gdGhpcy5fcm93c3BhbjtcblxuICAgIC8vIEZyYWN0aW9uIG9mIHRoZSBob3Jpem9udGFsIGd1dHRlciBzaXplIHRoYXQgZWFjaCBjb2x1bW4gdGFrZXMgdXAuXG4gICAgbGV0IGd1dHRlckhlaWdodFBlclRpbGUgPSAodGhpcy5fcm93cyAtIDEpIC8gdGhpcy5fcm93cztcblxuICAgIC8vIEJhc2UgdmVydGljYWwgc2l6ZSBvZiBhIGNvbHVtbi5cbiAgICBsZXQgYmFzZVRpbGVIZWlnaHQgPSB0aGlzLmdldEJhc2VUaWxlU2l6ZShwZXJjZW50SGVpZ2h0UGVyVGlsZSwgZ3V0dGVySGVpZ2h0UGVyVGlsZSk7XG5cbiAgICB0aWxlLl9zZXRTdHlsZSgndG9wJywgdGhpcy5nZXRUaWxlUG9zaXRpb24oYmFzZVRpbGVIZWlnaHQsIHJvd0luZGV4KSk7XG4gICAgdGlsZS5fc2V0U3R5bGUoJ2hlaWdodCcsIGNhbGModGhpcy5nZXRUaWxlU2l6ZShiYXNlVGlsZUhlaWdodCwgdGlsZS5yb3dzcGFuKSkpO1xuICB9XG5cbiAgcmVzZXQobGlzdDogTWF0R3JpZExpc3QpIHtcbiAgICBpZiAobGlzdC5fdGlsZXMpIHtcbiAgICAgIGxpc3QuX3RpbGVzLmZvckVhY2godGlsZSA9PiB7XG4gICAgICAgIHRpbGUuX3NldFN0eWxlKCd0b3AnLCBudWxsKTtcbiAgICAgICAgdGlsZS5fc2V0U3R5bGUoJ2hlaWdodCcsIG51bGwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cblxuLyoqIFdyYXBzIGEgQ1NTIHN0cmluZyBpbiBhIGNhbGMgZnVuY3Rpb24gKi9cbmZ1bmN0aW9uIGNhbGMoZXhwOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYGNhbGMoJHtleHB9KWA7XG59XG5cblxuLyoqIEFwcGVuZHMgcGl4ZWxzIHRvIGEgQ1NTIHN0cmluZyBpZiBubyB1bml0cyBhcmUgZ2l2ZW4uICovXG5mdW5jdGlvbiBub3JtYWxpemVVbml0cyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlLm1hdGNoKC8oW0EtWmEteiVdKykkLykgPyB2YWx1ZSA6IGAke3ZhbHVlfXB4YDtcbn1cblxuIl19