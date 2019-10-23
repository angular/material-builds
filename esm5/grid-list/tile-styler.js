/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
/**
 * RegExp that can be used to check whether a value will
 * be allowed inside a CSS `calc()` expression.
 */
var cssCalcAllowedValue = /^-?\d+((\.\d+)?[A-Za-z%$]?)+$/;
/**
 * Sets the style properties for an individual tile, given the position calculated by the
 * Tile Coordinator.
 * @docs-private
 */
var TileStyler = /** @class */ (function () {
    function TileStyler() {
        this._rows = 0;
        this._rowspan = 0;
    }
    /**
     * Adds grid-list layout info once it is available. Cannot be processed in the constructor
     * because these properties haven't been calculated by that point.
     *
     * @param gutterSize Size of the grid's gutter.
     * @param tracker Instance of the TileCoordinator.
     * @param cols Amount of columns in the grid.
     * @param direction Layout direction of the grid.
     */
    TileStyler.prototype.init = function (gutterSize, tracker, cols, direction) {
        this._gutterSize = normalizeUnits(gutterSize);
        this._rows = tracker.rowCount;
        this._rowspan = tracker.rowspan;
        this._cols = cols;
        this._direction = direction;
    };
    /**
     * Computes the amount of space a single 1x1 tile would take up (width or height).
     * Used as a basis for other calculations.
     * @param sizePercent Percent of the total grid-list space that one 1x1 tile would take up.
     * @param gutterFraction Fraction of the gutter size taken up by one 1x1 tile.
     * @return The size of a 1x1 tile as an expression that can be evaluated via CSS calc().
     */
    TileStyler.prototype.getBaseTileSize = function (sizePercent, gutterFraction) {
        // Take the base size percent (as would be if evenly dividing the size between cells),
        // and then subtracting the size of one gutter. However, since there are no gutters on the
        // edges, each tile only uses a fraction (gutterShare = numGutters / numCells) of the gutter
        // size. (Imagine having one gutter per tile, and then breaking up the extra gutter on the
        // edge evenly among the cells).
        return "(" + sizePercent + "% - (" + this._gutterSize + " * " + gutterFraction + "))";
    };
    /**
     * Gets The horizontal or vertical position of a tile, e.g., the 'top' or 'left' property value.
     * @param offset Number of tiles that have already been rendered in the row/column.
     * @param baseSize Base size of a 1x1 tile (as computed in getBaseTileSize).
     * @return Position of the tile as a CSS calc() expression.
     */
    TileStyler.prototype.getTilePosition = function (baseSize, offset) {
        // The position comes the size of a 1x1 tile plus gutter for each previous tile in the
        // row/column (offset).
        return offset === 0 ? '0' : calc("(" + baseSize + " + " + this._gutterSize + ") * " + offset);
    };
    /**
     * Gets the actual size of a tile, e.g., width or height, taking rowspan or colspan into account.
     * @param baseSize Base size of a 1x1 tile (as computed in getBaseTileSize).
     * @param span The tile's rowspan or colspan.
     * @return Size of the tile as a CSS calc() expression.
     */
    TileStyler.prototype.getTileSize = function (baseSize, span) {
        return "(" + baseSize + " * " + span + ") + (" + (span - 1) + " * " + this._gutterSize + ")";
    };
    /**
     * Sets the style properties to be applied to a tile for the given row and column index.
     * @param tile Tile to which to apply the styling.
     * @param rowIndex Index of the tile's row.
     * @param colIndex Index of the tile's column.
     */
    TileStyler.prototype.setStyle = function (tile, rowIndex, colIndex) {
        // Percent of the available horizontal space that one column takes up.
        var percentWidthPerTile = 100 / this._cols;
        // Fraction of the vertical gutter size that each column takes up.
        // For example, if there are 5 columns, each column uses 4/5 = 0.8 times the gutter width.
        var gutterWidthFractionPerTile = (this._cols - 1) / this._cols;
        this.setColStyles(tile, colIndex, percentWidthPerTile, gutterWidthFractionPerTile);
        this.setRowStyles(tile, rowIndex, percentWidthPerTile, gutterWidthFractionPerTile);
    };
    /** Sets the horizontal placement of the tile in the list. */
    TileStyler.prototype.setColStyles = function (tile, colIndex, percentWidth, gutterWidth) {
        // Base horizontal size of a column.
        var baseTileWidth = this.getBaseTileSize(percentWidth, gutterWidth);
        // The width and horizontal position of each tile is always calculated the same way, but the
        // height and vertical position depends on the rowMode.
        var side = this._direction === 'rtl' ? 'right' : 'left';
        tile._setStyle(side, this.getTilePosition(baseTileWidth, colIndex));
        tile._setStyle('width', calc(this.getTileSize(baseTileWidth, tile.colspan)));
    };
    /**
     * Calculates the total size taken up by gutters across one axis of a list.
     */
    TileStyler.prototype.getGutterSpan = function () {
        return this._gutterSize + " * (" + this._rowspan + " - 1)";
    };
    /**
     * Calculates the total size taken up by tiles across one axis of a list.
     * @param tileHeight Height of the tile.
     */
    TileStyler.prototype.getTileSpan = function (tileHeight) {
        return this._rowspan + " * " + this.getTileSize(tileHeight, 1);
    };
    /**
     * Calculates the computed height and returns the correct style property to set.
     * This method can be implemented by each type of TileStyler.
     * @docs-private
     */
    TileStyler.prototype.getComputedHeight = function () { return null; };
    return TileStyler;
}());
export { TileStyler };
/**
 * This type of styler is instantiated when the user passes in a fixed row height.
 * Example `<mat-grid-list cols="3" rowHeight="100px">`
 * @docs-private
 */
var FixedTileStyler = /** @class */ (function (_super) {
    __extends(FixedTileStyler, _super);
    function FixedTileStyler(fixedRowHeight) {
        var _this = _super.call(this) || this;
        _this.fixedRowHeight = fixedRowHeight;
        return _this;
    }
    FixedTileStyler.prototype.init = function (gutterSize, tracker, cols, direction) {
        _super.prototype.init.call(this, gutterSize, tracker, cols, direction);
        this.fixedRowHeight = normalizeUnits(this.fixedRowHeight);
        if (!cssCalcAllowedValue.test(this.fixedRowHeight)) {
            throw Error("Invalid value \"" + this.fixedRowHeight + "\" set as rowHeight.");
        }
    };
    FixedTileStyler.prototype.setRowStyles = function (tile, rowIndex) {
        tile._setStyle('top', this.getTilePosition(this.fixedRowHeight, rowIndex));
        tile._setStyle('height', calc(this.getTileSize(this.fixedRowHeight, tile.rowspan)));
    };
    FixedTileStyler.prototype.getComputedHeight = function () {
        return [
            'height', calc(this.getTileSpan(this.fixedRowHeight) + " + " + this.getGutterSpan())
        ];
    };
    FixedTileStyler.prototype.reset = function (list) {
        list._setListStyle(['height', null]);
        if (list._tiles) {
            list._tiles.forEach(function (tile) {
                tile._setStyle('top', null);
                tile._setStyle('height', null);
            });
        }
    };
    return FixedTileStyler;
}(TileStyler));
export { FixedTileStyler };
/**
 * This type of styler is instantiated when the user passes in a width:height ratio
 * for the row height.  Example `<mat-grid-list cols="3" rowHeight="3:1">`
 * @docs-private
 */
var RatioTileStyler = /** @class */ (function (_super) {
    __extends(RatioTileStyler, _super);
    function RatioTileStyler(value) {
        var _this = _super.call(this) || this;
        _this._parseRatio(value);
        return _this;
    }
    RatioTileStyler.prototype.setRowStyles = function (tile, rowIndex, percentWidth, gutterWidth) {
        var percentHeightPerTile = percentWidth / this.rowHeightRatio;
        this.baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterWidth);
        // Use padding-top and margin-top to maintain the given aspect ratio, as
        // a percentage-based value for these properties is applied versus the *width* of the
        // containing block. See http://www.w3.org/TR/CSS2/box.html#margin-properties
        tile._setStyle('marginTop', this.getTilePosition(this.baseTileHeight, rowIndex));
        tile._setStyle('paddingTop', calc(this.getTileSize(this.baseTileHeight, tile.rowspan)));
    };
    RatioTileStyler.prototype.getComputedHeight = function () {
        return [
            'paddingBottom', calc(this.getTileSpan(this.baseTileHeight) + " + " + this.getGutterSpan())
        ];
    };
    RatioTileStyler.prototype.reset = function (list) {
        list._setListStyle(['paddingBottom', null]);
        list._tiles.forEach(function (tile) {
            tile._setStyle('marginTop', null);
            tile._setStyle('paddingTop', null);
        });
    };
    RatioTileStyler.prototype._parseRatio = function (value) {
        var ratioParts = value.split(':');
        if (ratioParts.length !== 2) {
            throw Error("mat-grid-list: invalid ratio given for row-height: \"" + value + "\"");
        }
        this.rowHeightRatio = parseFloat(ratioParts[0]) / parseFloat(ratioParts[1]);
    };
    return RatioTileStyler;
}(TileStyler));
export { RatioTileStyler };
/**
 * This type of styler is instantiated when the user selects a "fit" row height mode.
 * In other words, the row height will reflect the total height of the container divided
 * by the number of rows.  Example `<mat-grid-list cols="3" rowHeight="fit">`
 *
 * @docs-private
 */
var FitTileStyler = /** @class */ (function (_super) {
    __extends(FitTileStyler, _super);
    function FitTileStyler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FitTileStyler.prototype.setRowStyles = function (tile, rowIndex) {
        // Percent of the available vertical space that one row takes up.
        var percentHeightPerTile = 100 / this._rowspan;
        // Fraction of the horizontal gutter size that each column takes up.
        var gutterHeightPerTile = (this._rows - 1) / this._rows;
        // Base vertical size of a column.
        var baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterHeightPerTile);
        tile._setStyle('top', this.getTilePosition(baseTileHeight, rowIndex));
        tile._setStyle('height', calc(this.getTileSize(baseTileHeight, tile.rowspan)));
    };
    FitTileStyler.prototype.reset = function (list) {
        if (list._tiles) {
            list._tiles.forEach(function (tile) {
                tile._setStyle('top', null);
                tile._setStyle('height', null);
            });
        }
    };
    return FitTileStyler;
}(TileStyler));
export { FitTileStyler };
/** Wraps a CSS string in a calc function */
function calc(exp) {
    return "calc(" + exp + ")";
}
/** Appends pixels to a CSS string if no units are given. */
function normalizeUnits(value) {
    return value.match(/([A-Za-z%]+)$/) ? value : value + "px";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS1zdHlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZ3JpZC1saXN0L3RpbGUtc3R5bGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFNSDs7O0dBR0c7QUFDSCxJQUFNLG1CQUFtQixHQUFHLCtCQUErQixDQUFDO0FBRTVEOzs7O0dBSUc7QUFDSDtJQUFBO1FBRUUsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNsQixhQUFRLEdBQVcsQ0FBQyxDQUFDO0lBaUl2QixDQUFDO0lBN0hDOzs7Ozs7OztPQVFHO0lBQ0gseUJBQUksR0FBSixVQUFLLFVBQWtCLEVBQUUsT0FBd0IsRUFBRSxJQUFZLEVBQUUsU0FBaUI7UUFDaEYsSUFBSSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUM5QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsb0NBQWUsR0FBZixVQUFnQixXQUFtQixFQUFFLGNBQXNCO1FBQ3pELHNGQUFzRjtRQUN0RiwwRkFBMEY7UUFDMUYsNEZBQTRGO1FBQzVGLDBGQUEwRjtRQUMxRixnQ0FBZ0M7UUFDaEMsT0FBTyxNQUFJLFdBQVcsYUFBUSxJQUFJLENBQUMsV0FBVyxXQUFNLGNBQWMsT0FBSSxDQUFDO0lBQ3pFLENBQUM7SUFHRDs7Ozs7T0FLRztJQUNILG9DQUFlLEdBQWYsVUFBZ0IsUUFBZ0IsRUFBRSxNQUFjO1FBQzlDLHNGQUFzRjtRQUN0Rix1QkFBdUI7UUFDdkIsT0FBTyxNQUFNLEtBQUss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QztJQUNqRixDQUFDO0lBRUQsNkJBQUssR0FBTCxVQUFNLElBQWlCO1FBQ3JCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtnQkFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBdkJELENBQW1DLFVBQVUsR0F1QjVDOztBQUdELDRDQUE0QztBQUM1QyxTQUFTLElBQUksQ0FBQyxHQUFXO0lBQ3ZCLE9BQU8sVUFBUSxHQUFHLE1BQUcsQ0FBQztBQUN4QixDQUFDO0FBR0QsNERBQTREO0FBQzVELFNBQVMsY0FBYyxDQUFDLEtBQWE7SUFDbkMsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFJLEtBQUssT0FBSSxDQUFDO0FBQzdELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNYXRHcmlkTGlzdH0gZnJvbSAnLi9ncmlkLWxpc3QnO1xuaW1wb3J0IHtNYXRHcmlkVGlsZX0gZnJvbSAnLi9ncmlkLXRpbGUnO1xuaW1wb3J0IHtUaWxlQ29vcmRpbmF0b3J9IGZyb20gJy4vdGlsZS1jb29yZGluYXRvcic7XG5cbi8qKlxuICogUmVnRXhwIHRoYXQgY2FuIGJlIHVzZWQgdG8gY2hlY2sgd2hldGhlciBhIHZhbHVlIHdpbGxcbiAqIGJlIGFsbG93ZWQgaW5zaWRlIGEgQ1NTIGBjYWxjKClgIGV4cHJlc3Npb24uXG4gKi9cbmNvbnN0IGNzc0NhbGNBbGxvd2VkVmFsdWUgPSAvXi0/XFxkKygoXFwuXFxkKyk/W0EtWmEteiUkXT8pKyQvO1xuXG4vKipcbiAqIFNldHMgdGhlIHN0eWxlIHByb3BlcnRpZXMgZm9yIGFuIGluZGl2aWR1YWwgdGlsZSwgZ2l2ZW4gdGhlIHBvc2l0aW9uIGNhbGN1bGF0ZWQgYnkgdGhlXG4gKiBUaWxlIENvb3JkaW5hdG9yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVGlsZVN0eWxlciB7XG4gIF9ndXR0ZXJTaXplOiBzdHJpbmc7XG4gIF9yb3dzOiBudW1iZXIgPSAwO1xuICBfcm93c3BhbjogbnVtYmVyID0gMDtcbiAgX2NvbHM6IG51bWJlcjtcbiAgX2RpcmVjdGlvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGRzIGdyaWQtbGlzdCBsYXlvdXQgaW5mbyBvbmNlIGl0IGlzIGF2YWlsYWJsZS4gQ2Fubm90IGJlIHByb2Nlc3NlZCBpbiB0aGUgY29uc3RydWN0b3JcbiAgICogYmVjYXVzZSB0aGVzZSBwcm9wZXJ0aWVzIGhhdmVuJ3QgYmVlbiBjYWxjdWxhdGVkIGJ5IHRoYXQgcG9pbnQuXG4gICAqXG4gICAqIEBwYXJhbSBndXR0ZXJTaXplIFNpemUgb2YgdGhlIGdyaWQncyBndXR0ZXIuXG4gICAqIEBwYXJhbSB0cmFja2VyIEluc3RhbmNlIG9mIHRoZSBUaWxlQ29vcmRpbmF0b3IuXG4gICAqIEBwYXJhbSBjb2xzIEFtb3VudCBvZiBjb2x1bW5zIGluIHRoZSBncmlkLlxuICAgKiBAcGFyYW0gZGlyZWN0aW9uIExheW91dCBkaXJlY3Rpb24gb2YgdGhlIGdyaWQuXG4gICAqL1xuICBpbml0KGd1dHRlclNpemU6IHN0cmluZywgdHJhY2tlcjogVGlsZUNvb3JkaW5hdG9yLCBjb2xzOiBudW1iZXIsIGRpcmVjdGlvbjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fZ3V0dGVyU2l6ZSA9IG5vcm1hbGl6ZVVuaXRzKGd1dHRlclNpemUpO1xuICAgIHRoaXMuX3Jvd3MgPSB0cmFja2VyLnJvd0NvdW50O1xuICAgIHRoaXMuX3Jvd3NwYW4gPSB0cmFja2VyLnJvd3NwYW47XG4gICAgdGhpcy5fY29scyA9IGNvbHM7XG4gICAgdGhpcy5fZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGVzIHRoZSBhbW91bnQgb2Ygc3BhY2UgYSBzaW5nbGUgMXgxIHRpbGUgd291bGQgdGFrZSB1cCAod2lkdGggb3IgaGVpZ2h0KS5cbiAgICogVXNlZCBhcyBhIGJhc2lzIGZvciBvdGhlciBjYWxjdWxhdGlvbnMuXG4gICAqIEBwYXJhbSBzaXplUGVyY2VudCBQZXJjZW50IG9mIHRoZSB0b3RhbCBncmlkLWxpc3Qgc3BhY2UgdGhhdCBvbmUgMXgxIHRpbGUgd291bGQgdGFrZSB1cC5cbiAgICogQHBhcmFtIGd1dHRlckZyYWN0aW9uIEZyYWN0aW9uIG9mIHRoZSBndXR0ZXIgc2l6ZSB0YWtlbiB1cCBieSBvbmUgMXgxIHRpbGUuXG4gICAqIEByZXR1cm4gVGhlIHNpemUgb2YgYSAxeDEgdGlsZSBhcyBhbiBleHByZXNzaW9uIHRoYXQgY2FuIGJlIGV2YWx1YXRlZCB2aWEgQ1NTIGNhbGMoKS5cbiAgICovXG4gIGdldEJhc2VUaWxlU2l6ZShzaXplUGVyY2VudDogbnVtYmVyLCBndXR0ZXJGcmFjdGlvbjogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAvLyBUYWtlIHRoZSBiYXNlIHNpemUgcGVyY2VudCAoYXMgd291bGQgYmUgaWYgZXZlbmx5IGRpdmlkaW5nIHRoZSBzaXplIGJldHdlZW4gY2VsbHMpLFxuICAgIC8vIGFuZCB0aGVuIHN1YnRyYWN0aW5nIHRoZSBzaXplIG9mIG9uZSBndXR0ZXIuIEhvd2V2ZXIsIHNpbmNlIHRoZXJlIGFyZSBubyBndXR0ZXJzIG9uIHRoZVxuICAgIC8vIGVkZ2VzLCBlYWNoIHRpbGUgb25seSB1c2VzIGEgZnJhY3Rpb24gKGd1dHRlclNoYXJlID0gbnVtR3V0dGVycyAvIG51bUNlbGxzKSBvZiB0aGUgZ3V0dGVyXG4gICAgLy8gc2l6ZS4gKEltYWdpbmUgaGF2aW5nIG9uZSBndXR0ZXIgcGVyIHRpbGUsIGFuZCB0aGVuIGJyZWFraW5nIHVwIHRoZSBleHRyYSBndXR0ZXIgb24gdGhlXG4gICAgLy8gZWRnZSBldmVubHkgYW1vbmcgdGhlIGNlbGxzKS5cbiAgICByZXR1cm4gYCgke3NpemVQZXJjZW50fSUgLSAoJHt0aGlzLl9ndXR0ZXJTaXplfSAqICR7Z3V0dGVyRnJhY3Rpb259KSlgO1xuICB9XG5cblxuICAvKipcbiAgICogR2V0cyBUaGUgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCBwb3NpdGlvbiBvZiBhIHRpbGUsIGUuZy4sIHRoZSAndG9wJyBvciAnbGVmdCcgcHJvcGVydHkgdmFsdWUuXG4gICAqIEBwYXJhbSBvZmZzZXQgTnVtYmVyIG9mIHRpbGVzIHRoYXQgaGF2ZSBhbHJlYWR5IGJlZW4gcmVuZGVyZWQgaW4gdGhlIHJvdy9jb2x1bW4uXG4gICAqIEBwYXJhbSBiYXNlU2l6ZSBCYXNlIHNpemUgb2YgYSAxeDEgdGlsZSAoYXMgY29tcHV0ZWQgaW4gZ2V0QmFzZVRpbGVTaXplKS5cbiAgICogQHJldHVybiBQb3NpdGlvbiBvZiB0aGUgdGlsZSBhcyBhIENTUyBjYWxjKCkgZXhwcmVzc2lvbi5cbiAgICovXG4gIGdldFRpbGVQb3NpdGlvbihiYXNlU2l6ZTogc3RyaW5nLCBvZmZzZXQ6IG51bWJlcik6IHN0cmluZyB7XG4gICAgLy8gVGhlIHBvc2l0aW9uIGNvbWVzIHRoZSBzaXplIG9mIGEgMXgxIHRpbGUgcGx1cyBndXR0ZXIgZm9yIGVhY2ggcHJldmlvdXMgdGlsZSBpbiB0aGVcbiAgICAvLyByb3cvY29sdW1uIChvZmZzZXQpLlxuICAgIHJldHVybiBvZmZzZXQgPT09IDAgPyAnMCcgOiBjYWxjKGAoJHtiYXNlU2l6ZX0gKyAke3RoaXMuX2d1dHRlclNpemV9KSAqICR7b2Zmc2V0fWApO1xuICB9XG5cblxuICAvKipcbiAgICogR2V0cyB0aGUgYWN0dWFsIHNpemUgb2YgYSB0aWxlLCBlLmcuLCB3aWR0aCBvciBoZWlnaHQsIHRha2luZyByb3dzcGFuIG9yIGNvbHNwYW4gaW50byBhY2NvdW50LlxuICAgKiBAcGFyYW0gYmFzZVNpemUgQmFzZSBzaXplIG9mIGEgMXgxIHRpbGUgKGFzIGNvbXB1dGVkIGluIGdldEJhc2VUaWxlU2l6ZSkuXG4gICAqIEBwYXJhbSBzcGFuIFRoZSB0aWxlJ3Mgcm93c3BhbiBvciBjb2xzcGFuLlxuICAgKiBAcmV0dXJuIFNpemUgb2YgdGhlIHRpbGUgYXMgYSBDU1MgY2FsYygpIGV4cHJlc3Npb24uXG4gICAqL1xuICBnZXRUaWxlU2l6ZShiYXNlU2l6ZTogc3RyaW5nLCBzcGFuOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBgKCR7YmFzZVNpemV9ICogJHtzcGFufSkgKyAoJHtzcGFuIC0gMX0gKiAke3RoaXMuX2d1dHRlclNpemV9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdHlsZSBwcm9wZXJ0aWVzIHRvIGJlIGFwcGxpZWQgdG8gYSB0aWxlIGZvciB0aGUgZ2l2ZW4gcm93IGFuZCBjb2x1bW4gaW5kZXguXG4gICAqIEBwYXJhbSB0aWxlIFRpbGUgdG8gd2hpY2ggdG8gYXBwbHkgdGhlIHN0eWxpbmcuXG4gICAqIEBwYXJhbSByb3dJbmRleCBJbmRleCBvZiB0aGUgdGlsZSdzIHJvdy5cbiAgICogQHBhcmFtIGNvbEluZGV4IEluZGV4IG9mIHRoZSB0aWxlJ3MgY29sdW1uLlxuICAgKi9cbiAgc2V0U3R5bGUodGlsZTogTWF0R3JpZFRpbGUsIHJvd0luZGV4OiBudW1iZXIsIGNvbEluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBQZXJjZW50IG9mIHRoZSBhdmFpbGFibGUgaG9yaXpvbnRhbCBzcGFjZSB0aGF0IG9uZSBjb2x1bW4gdGFrZXMgdXAuXG4gICAgbGV0IHBlcmNlbnRXaWR0aFBlclRpbGUgPSAxMDAgLyB0aGlzLl9jb2xzO1xuXG4gICAgLy8gRnJhY3Rpb24gb2YgdGhlIHZlcnRpY2FsIGd1dHRlciBzaXplIHRoYXQgZWFjaCBjb2x1bW4gdGFrZXMgdXAuXG4gICAgLy8gRm9yIGV4YW1wbGUsIGlmIHRoZXJlIGFyZSA1IGNvbHVtbnMsIGVhY2ggY29sdW1uIHVzZXMgNC81ID0gMC44IHRpbWVzIHRoZSBndXR0ZXIgd2lkdGguXG4gICAgbGV0IGd1dHRlcldpZHRoRnJhY3Rpb25QZXJUaWxlID0gKHRoaXMuX2NvbHMgLSAxKSAvIHRoaXMuX2NvbHM7XG5cbiAgICB0aGlzLnNldENvbFN0eWxlcyh0aWxlLCBjb2xJbmRleCwgcGVyY2VudFdpZHRoUGVyVGlsZSwgZ3V0dGVyV2lkdGhGcmFjdGlvblBlclRpbGUpO1xuICAgIHRoaXMuc2V0Um93U3R5bGVzKHRpbGUsIHJvd0luZGV4LCBwZXJjZW50V2lkdGhQZXJUaWxlLCBndXR0ZXJXaWR0aEZyYWN0aW9uUGVyVGlsZSk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgaG9yaXpvbnRhbCBwbGFjZW1lbnQgb2YgdGhlIHRpbGUgaW4gdGhlIGxpc3QuICovXG4gIHNldENvbFN0eWxlcyh0aWxlOiBNYXRHcmlkVGlsZSwgY29sSW5kZXg6IG51bWJlciwgcGVyY2VudFdpZHRoOiBudW1iZXIsXG4gICAgICAgICAgICAgICBndXR0ZXJXaWR0aDogbnVtYmVyKSB7XG4gICAgLy8gQmFzZSBob3Jpem9udGFsIHNpemUgb2YgYSBjb2x1bW4uXG4gICAgbGV0IGJhc2VUaWxlV2lkdGggPSB0aGlzLmdldEJhc2VUaWxlU2l6ZShwZXJjZW50V2lkdGgsIGd1dHRlcldpZHRoKTtcblxuICAgIC8vIFRoZSB3aWR0aCBhbmQgaG9yaXpvbnRhbCBwb3NpdGlvbiBvZiBlYWNoIHRpbGUgaXMgYWx3YXlzIGNhbGN1bGF0ZWQgdGhlIHNhbWUgd2F5LCBidXQgdGhlXG4gICAgLy8gaGVpZ2h0IGFuZCB2ZXJ0aWNhbCBwb3NpdGlvbiBkZXBlbmRzIG9uIHRoZSByb3dNb2RlLlxuICAgIGxldCBzaWRlID0gdGhpcy5fZGlyZWN0aW9uID09PSAncnRsJyA/ICdyaWdodCcgOiAnbGVmdCc7XG4gICAgdGlsZS5fc2V0U3R5bGUoc2lkZSwgdGhpcy5nZXRUaWxlUG9zaXRpb24oYmFzZVRpbGVXaWR0aCwgY29sSW5kZXgpKTtcbiAgICB0aWxlLl9zZXRTdHlsZSgnd2lkdGgnLCBjYWxjKHRoaXMuZ2V0VGlsZVNpemUoYmFzZVRpbGVXaWR0aCwgdGlsZS5jb2xzcGFuKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHRvdGFsIHNpemUgdGFrZW4gdXAgYnkgZ3V0dGVycyBhY3Jvc3Mgb25lIGF4aXMgb2YgYSBsaXN0LlxuICAgKi9cbiAgZ2V0R3V0dGVyU3BhbigpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt0aGlzLl9ndXR0ZXJTaXplfSAqICgke3RoaXMuX3Jvd3NwYW59IC0gMSlgO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHRvdGFsIHNpemUgdGFrZW4gdXAgYnkgdGlsZXMgYWNyb3NzIG9uZSBheGlzIG9mIGEgbGlzdC5cbiAgICogQHBhcmFtIHRpbGVIZWlnaHQgSGVpZ2h0IG9mIHRoZSB0aWxlLlxuICAgKi9cbiAgZ2V0VGlsZVNwYW4odGlsZUhlaWdodDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7dGhpcy5fcm93c3Bhbn0gKiAke3RoaXMuZ2V0VGlsZVNpemUodGlsZUhlaWdodCwgMSl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2ZXJ0aWNhbCBwbGFjZW1lbnQgb2YgdGhlIHRpbGUgaW4gdGhlIGxpc3QuXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgYmUgaW1wbGVtZW50ZWQgYnkgZWFjaCB0eXBlIG9mIFRpbGVTdHlsZXIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGFic3RyYWN0IHNldFJvd1N0eWxlcyh0aWxlOiBNYXRHcmlkVGlsZSwgcm93SW5kZXg6IG51bWJlciwgcGVyY2VudFdpZHRoOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBndXR0ZXJXaWR0aDogbnVtYmVyKTogdm9pZDtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgY29tcHV0ZWQgaGVpZ2h0IGFuZCByZXR1cm5zIHRoZSBjb3JyZWN0IHN0eWxlIHByb3BlcnR5IHRvIHNldC5cbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIGltcGxlbWVudGVkIGJ5IGVhY2ggdHlwZSBvZiBUaWxlU3R5bGVyLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXRDb21wdXRlZEhlaWdodCgpOiBbc3RyaW5nLCBzdHJpbmddIHwgbnVsbCB7IHJldHVybiBudWxsOyB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB0aWxlIHN0eWxlciBpcyBzd2FwcGVkIG91dCB3aXRoIGEgZGlmZmVyZW50IG9uZS4gVG8gYmUgdXNlZCBmb3IgY2xlYW51cC5cbiAgICogQHBhcmFtIGxpc3QgR3JpZCBsaXN0IHRoYXQgdGhlIHN0eWxlciB3YXMgYXR0YWNoZWQgdG8uXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGFic3RyYWN0IHJlc2V0KGxpc3Q6IE1hdEdyaWRMaXN0KTogdm9pZDtcbn1cblxuXG4vKipcbiAqIFRoaXMgdHlwZSBvZiBzdHlsZXIgaXMgaW5zdGFudGlhdGVkIHdoZW4gdGhlIHVzZXIgcGFzc2VzIGluIGEgZml4ZWQgcm93IGhlaWdodC5cbiAqIEV4YW1wbGUgYDxtYXQtZ3JpZC1saXN0IGNvbHM9XCIzXCIgcm93SGVpZ2h0PVwiMTAwcHhcIj5gXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBGaXhlZFRpbGVTdHlsZXIgZXh0ZW5kcyBUaWxlU3R5bGVyIHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZml4ZWRSb3dIZWlnaHQ6IHN0cmluZykgeyBzdXBlcigpOyB9XG5cbiAgaW5pdChndXR0ZXJTaXplOiBzdHJpbmcsIHRyYWNrZXI6IFRpbGVDb29yZGluYXRvciwgY29sczogbnVtYmVyLCBkaXJlY3Rpb246IHN0cmluZykge1xuICAgIHN1cGVyLmluaXQoZ3V0dGVyU2l6ZSwgdHJhY2tlciwgY29scywgZGlyZWN0aW9uKTtcbiAgICB0aGlzLmZpeGVkUm93SGVpZ2h0ID0gbm9ybWFsaXplVW5pdHModGhpcy5maXhlZFJvd0hlaWdodCk7XG5cbiAgICBpZiAoIWNzc0NhbGNBbGxvd2VkVmFsdWUudGVzdCh0aGlzLmZpeGVkUm93SGVpZ2h0KSkge1xuICAgICAgdGhyb3cgRXJyb3IoYEludmFsaWQgdmFsdWUgXCIke3RoaXMuZml4ZWRSb3dIZWlnaHR9XCIgc2V0IGFzIHJvd0hlaWdodC5gKTtcbiAgICB9XG4gIH1cblxuICBzZXRSb3dTdHlsZXModGlsZTogTWF0R3JpZFRpbGUsIHJvd0luZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aWxlLl9zZXRTdHlsZSgndG9wJywgdGhpcy5nZXRUaWxlUG9zaXRpb24odGhpcy5maXhlZFJvd0hlaWdodCwgcm93SW5kZXgpKTtcbiAgICB0aWxlLl9zZXRTdHlsZSgnaGVpZ2h0JywgY2FsYyh0aGlzLmdldFRpbGVTaXplKHRoaXMuZml4ZWRSb3dIZWlnaHQsIHRpbGUucm93c3BhbikpKTtcbiAgfVxuXG4gIGdldENvbXB1dGVkSGVpZ2h0KCk6IFtzdHJpbmcsIHN0cmluZ10ge1xuICAgIHJldHVybiBbXG4gICAgICAnaGVpZ2h0JywgY2FsYyhgJHt0aGlzLmdldFRpbGVTcGFuKHRoaXMuZml4ZWRSb3dIZWlnaHQpfSArICR7dGhpcy5nZXRHdXR0ZXJTcGFuKCl9YClcbiAgICBdO1xuICB9XG5cbiAgcmVzZXQobGlzdDogTWF0R3JpZExpc3QpIHtcbiAgICBsaXN0Ll9zZXRMaXN0U3R5bGUoWydoZWlnaHQnLCBudWxsXSk7XG5cbiAgICBpZiAobGlzdC5fdGlsZXMpIHtcbiAgICAgIGxpc3QuX3RpbGVzLmZvckVhY2godGlsZSA9PiB7XG4gICAgICAgIHRpbGUuX3NldFN0eWxlKCd0b3AnLCBudWxsKTtcbiAgICAgICAgdGlsZS5fc2V0U3R5bGUoJ2hlaWdodCcsIG51bGwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cblxuLyoqXG4gKiBUaGlzIHR5cGUgb2Ygc3R5bGVyIGlzIGluc3RhbnRpYXRlZCB3aGVuIHRoZSB1c2VyIHBhc3NlcyBpbiBhIHdpZHRoOmhlaWdodCByYXRpb1xuICogZm9yIHRoZSByb3cgaGVpZ2h0LiAgRXhhbXBsZSBgPG1hdC1ncmlkLWxpc3QgY29scz1cIjNcIiByb3dIZWlnaHQ9XCIzOjFcIj5gXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBSYXRpb1RpbGVTdHlsZXIgZXh0ZW5kcyBUaWxlU3R5bGVyIHtcblxuICAvKiogUmF0aW8gd2lkdGg6aGVpZ2h0IGdpdmVuIGJ5IHVzZXIgdG8gZGV0ZXJtaW5lIHJvdyBoZWlnaHQuICovXG4gIHJvd0hlaWdodFJhdGlvOiBudW1iZXI7XG4gIGJhc2VUaWxlSGVpZ2h0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fcGFyc2VSYXRpbyh2YWx1ZSk7XG4gIH1cblxuICBzZXRSb3dTdHlsZXModGlsZTogTWF0R3JpZFRpbGUsIHJvd0luZGV4OiBudW1iZXIsIHBlcmNlbnRXaWR0aDogbnVtYmVyLFxuICAgICAgICAgICAgICAgZ3V0dGVyV2lkdGg6IG51bWJlcik6IHZvaWQge1xuICAgIGxldCBwZXJjZW50SGVpZ2h0UGVyVGlsZSA9IHBlcmNlbnRXaWR0aCAvIHRoaXMucm93SGVpZ2h0UmF0aW87XG4gICAgdGhpcy5iYXNlVGlsZUhlaWdodCA9IHRoaXMuZ2V0QmFzZVRpbGVTaXplKHBlcmNlbnRIZWlnaHRQZXJUaWxlLCBndXR0ZXJXaWR0aCk7XG5cbiAgICAvLyBVc2UgcGFkZGluZy10b3AgYW5kIG1hcmdpbi10b3AgdG8gbWFpbnRhaW4gdGhlIGdpdmVuIGFzcGVjdCByYXRpbywgYXNcbiAgICAvLyBhIHBlcmNlbnRhZ2UtYmFzZWQgdmFsdWUgZm9yIHRoZXNlIHByb3BlcnRpZXMgaXMgYXBwbGllZCB2ZXJzdXMgdGhlICp3aWR0aCogb2YgdGhlXG4gICAgLy8gY29udGFpbmluZyBibG9jay4gU2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL0NTUzIvYm94Lmh0bWwjbWFyZ2luLXByb3BlcnRpZXNcbiAgICB0aWxlLl9zZXRTdHlsZSgnbWFyZ2luVG9wJywgdGhpcy5nZXRUaWxlUG9zaXRpb24odGhpcy5iYXNlVGlsZUhlaWdodCwgcm93SW5kZXgpKTtcbiAgICB0aWxlLl9zZXRTdHlsZSgncGFkZGluZ1RvcCcsIGNhbGModGhpcy5nZXRUaWxlU2l6ZSh0aGlzLmJhc2VUaWxlSGVpZ2h0LCB0aWxlLnJvd3NwYW4pKSk7XG4gIH1cblxuICBnZXRDb21wdXRlZEhlaWdodCgpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ3BhZGRpbmdCb3R0b20nLCBjYWxjKGAke3RoaXMuZ2V0VGlsZVNwYW4odGhpcy5iYXNlVGlsZUhlaWdodCl9ICsgJHt0aGlzLmdldEd1dHRlclNwYW4oKX1gKVxuICAgIF07XG4gIH1cblxuICByZXNldChsaXN0OiBNYXRHcmlkTGlzdCkge1xuICAgIGxpc3QuX3NldExpc3RTdHlsZShbJ3BhZGRpbmdCb3R0b20nLCBudWxsXSk7XG5cbiAgICBsaXN0Ll90aWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgdGlsZS5fc2V0U3R5bGUoJ21hcmdpblRvcCcsIG51bGwpO1xuICAgICAgdGlsZS5fc2V0U3R5bGUoJ3BhZGRpbmdUb3AnLCBudWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3BhcnNlUmF0aW8odmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHJhdGlvUGFydHMgPSB2YWx1ZS5zcGxpdCgnOicpO1xuXG4gICAgaWYgKHJhdGlvUGFydHMubGVuZ3RoICE9PSAyKSB7XG4gICAgICB0aHJvdyBFcnJvcihgbWF0LWdyaWQtbGlzdDogaW52YWxpZCByYXRpbyBnaXZlbiBmb3Igcm93LWhlaWdodDogXCIke3ZhbHVlfVwiYCk7XG4gICAgfVxuXG4gICAgdGhpcy5yb3dIZWlnaHRSYXRpbyA9IHBhcnNlRmxvYXQocmF0aW9QYXJ0c1swXSkgLyBwYXJzZUZsb2F0KHJhdGlvUGFydHNbMV0pO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyB0eXBlIG9mIHN0eWxlciBpcyBpbnN0YW50aWF0ZWQgd2hlbiB0aGUgdXNlciBzZWxlY3RzIGEgXCJmaXRcIiByb3cgaGVpZ2h0IG1vZGUuXG4gKiBJbiBvdGhlciB3b3JkcywgdGhlIHJvdyBoZWlnaHQgd2lsbCByZWZsZWN0IHRoZSB0b3RhbCBoZWlnaHQgb2YgdGhlIGNvbnRhaW5lciBkaXZpZGVkXG4gKiBieSB0aGUgbnVtYmVyIG9mIHJvd3MuICBFeGFtcGxlIGA8bWF0LWdyaWQtbGlzdCBjb2xzPVwiM1wiIHJvd0hlaWdodD1cImZpdFwiPmBcbiAqXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBGaXRUaWxlU3R5bGVyIGV4dGVuZHMgVGlsZVN0eWxlciB7XG4gIHNldFJvd1N0eWxlcyh0aWxlOiBNYXRHcmlkVGlsZSwgcm93SW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIFBlcmNlbnQgb2YgdGhlIGF2YWlsYWJsZSB2ZXJ0aWNhbCBzcGFjZSB0aGF0IG9uZSByb3cgdGFrZXMgdXAuXG4gICAgbGV0IHBlcmNlbnRIZWlnaHRQZXJUaWxlID0gMTAwIC8gdGhpcy5fcm93c3BhbjtcblxuICAgIC8vIEZyYWN0aW9uIG9mIHRoZSBob3Jpem9udGFsIGd1dHRlciBzaXplIHRoYXQgZWFjaCBjb2x1bW4gdGFrZXMgdXAuXG4gICAgbGV0IGd1dHRlckhlaWdodFBlclRpbGUgPSAodGhpcy5fcm93cyAtIDEpIC8gdGhpcy5fcm93cztcblxuICAgIC8vIEJhc2UgdmVydGljYWwgc2l6ZSBvZiBhIGNvbHVtbi5cbiAgICBsZXQgYmFzZVRpbGVIZWlnaHQgPSB0aGlzLmdldEJhc2VUaWxlU2l6ZShwZXJjZW50SGVpZ2h0UGVyVGlsZSwgZ3V0dGVySGVpZ2h0UGVyVGlsZSk7XG5cbiAgICB0aWxlLl9zZXRTdHlsZSgndG9wJywgdGhpcy5nZXRUaWxlUG9zaXRpb24oYmFzZVRpbGVIZWlnaHQsIHJvd0luZGV4KSk7XG4gICAgdGlsZS5fc2V0U3R5bGUoJ2hlaWdodCcsIGNhbGModGhpcy5nZXRUaWxlU2l6ZShiYXNlVGlsZUhlaWdodCwgdGlsZS5yb3dzcGFuKSkpO1xuICB9XG5cbiAgcmVzZXQobGlzdDogTWF0R3JpZExpc3QpIHtcbiAgICBpZiAobGlzdC5fdGlsZXMpIHtcbiAgICAgIGxpc3QuX3RpbGVzLmZvckVhY2godGlsZSA9PiB7XG4gICAgICAgIHRpbGUuX3NldFN0eWxlKCd0b3AnLCBudWxsKTtcbiAgICAgICAgdGlsZS5fc2V0U3R5bGUoJ2hlaWdodCcsIG51bGwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cblxuLyoqIFdyYXBzIGEgQ1NTIHN0cmluZyBpbiBhIGNhbGMgZnVuY3Rpb24gKi9cbmZ1bmN0aW9uIGNhbGMoZXhwOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYGNhbGMoJHtleHB9KWA7XG59XG5cblxuLyoqIEFwcGVuZHMgcGl4ZWxzIHRvIGEgQ1NTIHN0cmluZyBpZiBubyB1bml0cyBhcmUgZ2l2ZW4uICovXG5mdW5jdGlvbiBub3JtYWxpemVVbml0cyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlLm1hdGNoKC8oW0EtWmEteiVdKykkLykgPyB2YWx1ZSA6IGAke3ZhbHVlfXB4YDtcbn1cblxuIl19