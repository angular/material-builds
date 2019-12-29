/**
 * @fileoverview added by tsickle
 * Generated from: src/material/grid-list/tile-coordinator.ts
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
 * Interface describing a tile.
 * \@docs-private
 * @record
 */
export function Tile() { }
if (false) {
    /**
     * Amount of rows that the tile takes up.
     * @type {?}
     */
    Tile.prototype.rowspan;
    /**
     * Amount of columns that the tile takes up.
     * @type {?}
     */
    Tile.prototype.colspan;
}
/**
 * Class for determining, from a list of tiles, the (row, col) position of each of those tiles
 * in the grid. This is necessary (rather than just rendering the tiles in normal document flow)
 * because the tiles can have a rowspan.
 *
 * The positioning algorithm greedily places each tile as soon as it encounters a gap in the grid
 * large enough to accommodate it so that the tiles still render in the same order in which they
 * are given.
 *
 * The basis of the algorithm is the use of an array to track the already placed tiles. Each
 * element of the array corresponds to a column, and the value indicates how many cells in that
 * column are already occupied; zero indicates an empty cell. Moving "down" to the next row
 * decrements each value in the tracking array (indicating that the column is one cell closer to
 * being free).
 *
 * \@docs-private
 */
export class TileCoordinator {
    constructor() {
        /**
         * Index at which the search for the next gap will start.
         */
        this.columnIndex = 0;
        /**
         * The current row index.
         */
        this.rowIndex = 0;
    }
    /**
     * Gets the total number of rows occupied by tiles
     * @return {?}
     */
    get rowCount() { return this.rowIndex + 1; }
    /**
     * Gets the total span of rows occupied by tiles.
     * Ex: A list with 1 row that contains a tile with rowspan 2 will have a total rowspan of 2.
     * @return {?}
     */
    get rowspan() {
        /** @type {?} */
        const lastRowMax = Math.max(...this.tracker);
        // if any of the tiles has a rowspan that pushes it beyond the total row count,
        // add the difference to the rowcount
        return lastRowMax > 1 ? this.rowCount + lastRowMax - 1 : this.rowCount;
    }
    /**
     * Updates the tile positions.
     * @param {?} numColumns Amount of columns in the grid.
     * @param {?} tiles Tiles to be positioned.
     * @return {?}
     */
    update(numColumns, tiles) {
        this.columnIndex = 0;
        this.rowIndex = 0;
        this.tracker = new Array(numColumns);
        this.tracker.fill(0, 0, this.tracker.length);
        this.positions = tiles.map((/**
         * @param {?} tile
         * @return {?}
         */
        tile => this._trackTile(tile)));
    }
    /**
     * Calculates the row and col position of a tile.
     * @private
     * @param {?} tile
     * @return {?}
     */
    _trackTile(tile) {
        // Find a gap large enough for this tile.
        /** @type {?} */
        const gapStartIndex = this._findMatchingGap(tile.colspan);
        // Place tile in the resulting gap.
        this._markTilePosition(gapStartIndex, tile);
        // The next time we look for a gap, the search will start at columnIndex, which should be
        // immediately after the tile that has just been placed.
        this.columnIndex = gapStartIndex + tile.colspan;
        return new TilePosition(this.rowIndex, gapStartIndex);
    }
    /**
     * Finds the next available space large enough to fit the tile.
     * @private
     * @param {?} tileCols
     * @return {?}
     */
    _findMatchingGap(tileCols) {
        if (tileCols > this.tracker.length) {
            throw Error(`mat-grid-list: tile with colspan ${tileCols} is wider than ` +
                `grid with cols="${this.tracker.length}".`);
        }
        // Start index is inclusive, end index is exclusive.
        /** @type {?} */
        let gapStartIndex = -1;
        /** @type {?} */
        let gapEndIndex = -1;
        // Look for a gap large enough to fit the given tile. Empty spaces are marked with a zero.
        do {
            // If we've reached the end of the row, go to the next row.
            if (this.columnIndex + tileCols > this.tracker.length) {
                this._nextRow();
                gapStartIndex = this.tracker.indexOf(0, this.columnIndex);
                gapEndIndex = this._findGapEndIndex(gapStartIndex);
                continue;
            }
            gapStartIndex = this.tracker.indexOf(0, this.columnIndex);
            // If there are no more empty spaces in this row at all, move on to the next row.
            if (gapStartIndex == -1) {
                this._nextRow();
                gapStartIndex = this.tracker.indexOf(0, this.columnIndex);
                gapEndIndex = this._findGapEndIndex(gapStartIndex);
                continue;
            }
            gapEndIndex = this._findGapEndIndex(gapStartIndex);
            // If a gap large enough isn't found, we want to start looking immediately after the current
            // gap on the next iteration.
            this.columnIndex = gapStartIndex + 1;
            // Continue iterating until we find a gap wide enough for this tile. Since gapEndIndex is
            // exclusive, gapEndIndex is 0 means we didn't find a gap and should continue.
        } while ((gapEndIndex - gapStartIndex < tileCols) || (gapEndIndex == 0));
        // If we still didn't manage to find a gap, ensure that the index is
        // at least zero so the tile doesn't get pulled out of the grid.
        return Math.max(gapStartIndex, 0);
    }
    /**
     * Move "down" to the next row.
     * @private
     * @return {?}
     */
    _nextRow() {
        this.columnIndex = 0;
        this.rowIndex++;
        // Decrement all spaces by one to reflect moving down one row.
        for (let i = 0; i < this.tracker.length; i++) {
            this.tracker[i] = Math.max(0, this.tracker[i] - 1);
        }
    }
    /**
     * Finds the end index (exclusive) of a gap given the index from which to start looking.
     * The gap ends when a non-zero value is found.
     * @private
     * @param {?} gapStartIndex
     * @return {?}
     */
    _findGapEndIndex(gapStartIndex) {
        for (let i = gapStartIndex + 1; i < this.tracker.length; i++) {
            if (this.tracker[i] != 0) {
                return i;
            }
        }
        // The gap ends with the end of the row.
        return this.tracker.length;
    }
    /**
     * Update the tile tracker to account for the given tile in the given space.
     * @private
     * @param {?} start
     * @param {?} tile
     * @return {?}
     */
    _markTilePosition(start, tile) {
        for (let i = 0; i < tile.colspan; i++) {
            this.tracker[start + i] = tile.rowspan;
        }
    }
}
if (false) {
    /**
     * Tracking array (see class description).
     * @type {?}
     */
    TileCoordinator.prototype.tracker;
    /**
     * Index at which the search for the next gap will start.
     * @type {?}
     */
    TileCoordinator.prototype.columnIndex;
    /**
     * The current row index.
     * @type {?}
     */
    TileCoordinator.prototype.rowIndex;
    /**
     * The computed (row, col) position of each tile (the output).
     * @type {?}
     */
    TileCoordinator.prototype.positions;
}
/**
 * Simple data structure for tile position (row, col).
 * \@docs-private
 */
export class TilePosition {
    /**
     * @param {?} row
     * @param {?} col
     */
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}
if (false) {
    /** @type {?} */
    TilePosition.prototype.row;
    /** @type {?} */
    TilePosition.prototype.col;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS1jb29yZGluYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ncmlkLWxpc3QvdGlsZS1jb29yZGluYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQVlBLDBCQUtDOzs7Ozs7SUFIQyx1QkFBZ0I7Ozs7O0lBRWhCLHVCQUFnQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CbEIsTUFBTSxPQUFPLGVBQWU7SUFBNUI7Ozs7UUFLRSxnQkFBVyxHQUFXLENBQUMsQ0FBQzs7OztRQUd4QixhQUFRLEdBQVcsQ0FBQyxDQUFDO0lBOEh2QixDQUFDOzs7OztJQTNIQyxJQUFJLFFBQVEsS0FBYSxPQUFPLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0lBTXBELElBQUksT0FBTzs7Y0FDSCxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDNUMsK0VBQStFO1FBQy9FLHFDQUFxQztRQUNyQyxPQUFPLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6RSxDQUFDOzs7Ozs7O0lBVUQsTUFBTSxDQUFDLFVBQWtCLEVBQUUsS0FBYTtRQUN0QyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUVsQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxJQUFJ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LEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNwRDtJQUNILENBQUM7Ozs7Ozs7O0lBTU8sZ0JBQWdCLENBQUMsYUFBcUI7UUFDNUMsS0FBSyxJQUFJLENBQUMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1RCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN4QixPQUFPLENBQUMsQ0FBQzthQUNWO1NBQ0Y7UUFFRCx3Q0FBd0M7UUFDeEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUM3QixDQUFDOzs7Ozs7OztJQUdPLGlCQUFpQixDQUFDLEtBQWEsRUFBRSxJQUFVO1FBQ2pELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDeEM7SUFDSCxDQUFDO0NBQ0Y7Ozs7OztJQXBJQyxrQ0FBa0I7Ozs7O0lBR2xCLHNDQUF3Qjs7Ozs7SUFHeEIsbUNBQXFCOzs7OztJQWlCckIsb0NBQTBCOzs7Ozs7QUFtSDVCLE1BQU0sT0FBTyxZQUFZOzs7OztJQUN2QixZQUFtQixHQUFXLEVBQVMsR0FBVztRQUEvQixRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBUTtJQUFHLENBQUM7Q0FDdkQ7OztJQURhLDJCQUFrQjs7SUFBRSwyQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBJbnRlcmZhY2UgZGVzY3JpYmluZyBhIHRpbGUuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGlsZSB7XG4gIC8qKiBBbW91bnQgb2Ygcm93cyB0aGF0IHRoZSB0aWxlIHRha2VzIHVwLiAqL1xuICByb3dzcGFuOiBudW1iZXI7XG4gIC8qKiBBbW91bnQgb2YgY29sdW1ucyB0aGF0IHRoZSB0aWxlIHRha2VzIHVwLiAqL1xuICBjb2xzcGFuOiBudW1iZXI7XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIGRldGVybWluaW5nLCBmcm9tIGEgbGlzdCBvZiB0aWxlcywgdGhlIChyb3csIGNvbCkgcG9zaXRpb24gb2YgZWFjaCBvZiB0aG9zZSB0aWxlc1xuICogaW4gdGhlIGdyaWQuIFRoaXMgaXMgbmVjZXNzYXJ5IChyYXRoZXIgdGhhbiBqdXN0IHJlbmRlcmluZyB0aGUgdGlsZXMgaW4gbm9ybWFsIGRvY3VtZW50IGZsb3cpXG4gKiBiZWNhdXNlIHRoZSB0aWxlcyBjYW4gaGF2ZSBhIHJvd3NwYW4uXG4gKlxuICogVGhlIHBvc2l0aW9uaW5nIGFsZ29yaXRobSBncmVlZGlseSBwbGFjZXMgZWFjaCB0aWxlIGFzIHNvb24gYXMgaXQgZW5jb3VudGVycyBhIGdhcCBpbiB0aGUgZ3JpZFxuICogbGFyZ2UgZW5vdWdoIHRvIGFjY29tbW9kYXRlIGl0IHNvIHRoYXQgdGhlIHRpbGVzIHN0aWxsIHJlbmRlciBpbiB0aGUgc2FtZSBvcmRlciBpbiB3aGljaCB0aGV5XG4gKiBhcmUgZ2l2ZW4uXG4gKlxuICogVGhlIGJhc2lzIG9mIHRoZSBhbGdvcml0aG0gaXMgdGhlIHVzZSBvZiBhbiBhcnJheSB0byB0cmFjayB0aGUgYWxyZWFkeSBwbGFjZWQgdGlsZXMuIEVhY2hcbiAqIGVsZW1lbnQgb2YgdGhlIGFycmF5IGNvcnJlc3BvbmRzIHRvIGEgY29sdW1uLCBhbmQgdGhlIHZhbHVlIGluZGljYXRlcyBob3cgbWFueSBjZWxscyBpbiB0aGF0XG4gKiBjb2x1bW4gYXJlIGFscmVhZHkgb2NjdXBpZWQ7IHplcm8gaW5kaWNhdGVzIGFuIGVtcHR5IGNlbGwuIE1vdmluZyBcImRvd25cIiB0byB0aGUgbmV4dCByb3dcbiAqIGRlY3JlbWVudHMgZWFjaCB2YWx1ZSBpbiB0aGUgdHJhY2tpbmcgYXJyYXkgKGluZGljYXRpbmcgdGhhdCB0aGUgY29sdW1uIGlzIG9uZSBjZWxsIGNsb3NlciB0b1xuICogYmVpbmcgZnJlZSkuXG4gKlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgVGlsZUNvb3JkaW5hdG9yIHtcbiAgLyoqIFRyYWNraW5nIGFycmF5IChzZWUgY2xhc3MgZGVzY3JpcHRpb24pLiAqL1xuICB0cmFja2VyOiBudW1iZXJbXTtcblxuICAvKiogSW5kZXggYXQgd2hpY2ggdGhlIHNlYXJjaCBmb3IgdGhlIG5leHQgZ2FwIHdpbGwgc3RhcnQuICovXG4gIGNvbHVtbkluZGV4OiBudW1iZXIgPSAwO1xuXG4gIC8qKiBUaGUgY3VycmVudCByb3cgaW5kZXguICovXG4gIHJvd0luZGV4OiBudW1iZXIgPSAwO1xuXG4gIC8qKiBHZXRzIHRoZSB0b3RhbCBudW1iZXIgb2Ygcm93cyBvY2N1cGllZCBieSB0aWxlcyAqL1xuICBnZXQgcm93Q291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMucm93SW5kZXggKyAxOyB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRvdGFsIHNwYW4gb2Ygcm93cyBvY2N1cGllZCBieSB0aWxlcy5cbiAgICogRXg6IEEgbGlzdCB3aXRoIDEgcm93IHRoYXQgY29udGFpbnMgYSB0aWxlIHdpdGggcm93c3BhbiAyIHdpbGwgaGF2ZSBhIHRvdGFsIHJvd3NwYW4gb2YgMi5cbiAgICovXG4gIGdldCByb3dzcGFuKCkge1xuICAgIGNvbnN0IGxhc3RSb3dNYXggPSBNYXRoLm1heCguLi50aGlzLnRyYWNrZXIpO1xuICAgIC8vIGlmIGFueSBvZiB0aGUgdGlsZXMgaGFzIGEgcm93c3BhbiB0aGF0IHB1c2hlcyBpdCBiZXlvbmQgdGhlIHRvdGFsIHJvdyBjb3VudCxcbiAgICAvLyBhZGQgdGhlIGRpZmZlcmVuY2UgdG8gdGhlIHJvd2NvdW50XG4gICAgcmV0dXJuIGxhc3RSb3dNYXggPiAxID8gdGhpcy5yb3dDb3VudCArIGxhc3RSb3dNYXggLSAxIDogdGhpcy5yb3dDb3VudDtcbiAgfVxuXG4gIC8qKiBUaGUgY29tcHV0ZWQgKHJvdywgY29sKSBwb3NpdGlvbiBvZiBlYWNoIHRpbGUgKHRoZSBvdXRwdXQpLiAqL1xuICBwb3NpdGlvbnM6IFRpbGVQb3NpdGlvbltdO1xuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB0aWxlIHBvc2l0aW9ucy5cbiAgICogQHBhcmFtIG51bUNvbHVtbnMgQW1vdW50IG9mIGNvbHVtbnMgaW4gdGhlIGdyaWQuXG4gICAqIEBwYXJhbSB0aWxlcyBUaWxlcyB0byBiZSBwb3NpdGlvbmVkLlxuICAgKi9cbiAgdXBkYXRlKG51bUNvbHVtbnM6IG51bWJlciwgdGlsZXM6IFRpbGVbXSkge1xuICAgIHRoaXMuY29sdW1uSW5kZXggPSAwO1xuICAgIHRoaXMucm93SW5kZXggPSAwO1xuXG4gICAgdGhpcy50cmFja2VyID0gbmV3IEFycmF5KG51bUNvbHVtbnMpO1xuICAgIHRoaXMudHJhY2tlci5maWxsKDAsIDAsIHRoaXMudHJhY2tlci5sZW5ndGgpO1xuICAgIHRoaXMucG9zaXRpb25zID0gdGlsZXMubWFwKHRpbGUgPT4gdGhpcy5fdHJhY2tUaWxlKHRpbGUpKTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSByb3cgYW5kIGNvbCBwb3NpdGlvbiBvZiBhIHRpbGUuICovXG4gIHByaXZhdGUgX3RyYWNrVGlsZSh0aWxlOiBUaWxlKTogVGlsZVBvc2l0aW9uIHtcbiAgICAvLyBGaW5kIGEgZ2FwIGxhcmdlIGVub3VnaCBmb3IgdGhpcyB0aWxlLlxuICAgIGNvbnN0IGdhcFN0YXJ0SW5kZXggPSB0aGlzLl9maW5kTWF0Y2hpbmdHYXAodGlsZS5jb2xzcGFuKTtcblxuICAgIC8vIFBsYWNlIHRpbGUgaW4gdGhlIHJlc3VsdGluZyBnYXAuXG4gICAgdGhpcy5fbWFya1RpbGVQb3NpdGlvbihnYXBTdGFydEluZGV4LCB0aWxlKTtcblxuICAgIC8vIFRoZSBuZXh0IHRpbWUgd2UgbG9vayBmb3IgYSBnYXAsIHRoZSBzZWFyY2ggd2lsbCBzdGFydCBhdCBjb2x1bW5JbmRleCwgd2hpY2ggc2hvdWxkIGJlXG4gICAgLy8gaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIHRpbGUgdGhhdCBoYXMganVzdCBiZWVuIHBsYWNlZC5cbiAgICB0aGlzLmNvbHVtbkluZGV4ID0gZ2FwU3RhcnRJbmRleCArIHRpbGUuY29sc3BhbjtcblxuICAgIHJldHVybiBuZXcgVGlsZVBvc2l0aW9uKHRoaXMucm93SW5kZXgsIGdhcFN0YXJ0SW5kZXgpO1xuICB9XG5cbiAgLyoqIEZpbmRzIHRoZSBuZXh0IGF2YWlsYWJsZSBzcGFjZSBsYXJnZSBlbm91Z2ggdG8gZml0IHRoZSB0aWxlLiAqL1xuICBwcml2YXRlIF9maW5kTWF0Y2hpbmdHYXAodGlsZUNvbHM6IG51bWJlcik6IG51bWJlciB7XG4gICAgaWYgKHRpbGVDb2xzID4gdGhpcy50cmFja2VyLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoYG1hdC1ncmlkLWxpc3Q6IHRpbGUgd2l0aCBjb2xzcGFuICR7dGlsZUNvbHN9IGlzIHdpZGVyIHRoYW4gYCArXG4gICAgICAgICAgICAgICAgICAgICAgYGdyaWQgd2l0aCBjb2xzPVwiJHt0aGlzLnRyYWNrZXIubGVuZ3RofVwiLmApO1xuICAgIH1cblxuICAgIC8vIFN0YXJ0IGluZGV4IGlzIGluY2x1c2l2ZSwgZW5kIGluZGV4IGlzIGV4Y2x1c2l2ZS5cbiAgICBsZXQgZ2FwU3RhcnRJbmRleCA9IC0xO1xuICAgIGxldCBnYXBFbmRJbmRleCA9IC0xO1xuXG4gICAgLy8gTG9vayBmb3IgYSBnYXAgbGFyZ2UgZW5vdWdoIHRvIGZpdCB0aGUgZ2l2ZW4gdGlsZS4gRW1wdHkgc3BhY2VzIGFyZSBtYXJrZWQgd2l0aCBhIHplcm8uXG4gICAgZG8ge1xuICAgICAgLy8gSWYgd2UndmUgcmVhY2hlZCB0aGUgZW5kIG9mIHRoZSByb3csIGdvIHRvIHRoZSBuZXh0IHJvdy5cbiAgICAgIGlmICh0aGlzLmNvbHVtbkluZGV4ICsgdGlsZUNvbHMgPiB0aGlzLnRyYWNrZXIubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX25leHRSb3coKTtcbiAgICAgICAgZ2FwU3RhcnRJbmRleCA9IHRoaXMudHJhY2tlci5pbmRleE9mKDAsIHRoaXMuY29sdW1uSW5kZXgpO1xuICAgICAgICBnYXBFbmRJbmRleCA9IHRoaXMuX2ZpbmRHYXBFbmRJbmRleChnYXBTdGFydEluZGV4KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGdhcFN0YXJ0SW5kZXggPSB0aGlzLnRyYWNrZXIuaW5kZXhPZigwLCB0aGlzLmNvbHVtbkluZGV4KTtcblxuICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIG1vcmUgZW1wdHkgc3BhY2VzIGluIHRoaXMgcm93IGF0IGFsbCwgbW92ZSBvbiB0byB0aGUgbmV4dCByb3cuXG4gICAgICBpZiAoZ2FwU3RhcnRJbmRleCA9PSAtMSkge1xuICAgICAgICB0aGlzLl9uZXh0Um93KCk7XG4gICAgICAgIGdhcFN0YXJ0SW5kZXggPSB0aGlzLnRyYWNrZXIuaW5kZXhPZigwLCB0aGlzLmNvbHVtbkluZGV4KTtcbiAgICAgICAgZ2FwRW5kSW5kZXggPSB0aGlzLl9maW5kR2FwRW5kSW5kZXgoZ2FwU3RhcnRJbmRleCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBnYXBFbmRJbmRleCA9IHRoaXMuX2ZpbmRHYXBFbmRJbmRleChnYXBTdGFydEluZGV4KTtcblxuICAgICAgLy8gSWYgYSBnYXAgbGFyZ2UgZW5vdWdoIGlzbid0IGZvdW5kLCB3ZSB3YW50IHRvIHN0YXJ0IGxvb2tpbmcgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIGN1cnJlbnRcbiAgICAgIC8vIGdhcCBvbiB0aGUgbmV4dCBpdGVyYXRpb24uXG4gICAgICB0aGlzLmNvbHVtbkluZGV4ID0gZ2FwU3RhcnRJbmRleCArIDE7XG5cbiAgICAgIC8vIENvbnRpbnVlIGl0ZXJhdGluZyB1bnRpbCB3ZSBmaW5kIGEgZ2FwIHdpZGUgZW5vdWdoIGZvciB0aGlzIHRpbGUuIFNpbmNlIGdhcEVuZEluZGV4IGlzXG4gICAgICAvLyBleGNsdXNpdmUsIGdhcEVuZEluZGV4IGlzIDAgbWVhbnMgd2UgZGlkbid0IGZpbmQgYSBnYXAgYW5kIHNob3VsZCBjb250aW51ZS5cbiAgICB9IHdoaWxlICgoZ2FwRW5kSW5kZXggLSBnYXBTdGFydEluZGV4IDwgdGlsZUNvbHMpIHx8IChnYXBFbmRJbmRleCA9PSAwKSk7XG5cbiAgICAvLyBJZiB3ZSBzdGlsbCBkaWRuJ3QgbWFuYWdlIHRvIGZpbmQgYSBnYXAsIGVuc3VyZSB0aGF0IHRoZSBpbmRleCBpc1xuICAgIC8vIGF0IGxlYXN0IHplcm8gc28gdGhlIHRpbGUgZG9lc24ndCBnZXQgcHVsbGVkIG91dCBvZiB0aGUgZ3JpZC5cbiAgICByZXR1cm4gTWF0aC5tYXgoZ2FwU3RhcnRJbmRleCwgMCk7XG4gIH1cblxuICAvKiogTW92ZSBcImRvd25cIiB0byB0aGUgbmV4dCByb3cuICovXG4gIHByaXZhdGUgX25leHRSb3coKTogdm9pZCB7XG4gICAgdGhpcy5jb2x1bW5JbmRleCA9IDA7XG4gICAgdGhpcy5yb3dJbmRleCsrO1xuXG4gICAgLy8gRGVjcmVtZW50IGFsbCBzcGFjZXMgYnkgb25lIHRvIHJlZmxlY3QgbW92aW5nIGRvd24gb25lIHJvdy5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudHJhY2tlci5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy50cmFja2VyW2ldID0gTWF0aC5tYXgoMCwgdGhpcy50cmFja2VyW2ldIC0gMSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIHRoZSBlbmQgaW5kZXggKGV4Y2x1c2l2ZSkgb2YgYSBnYXAgZ2l2ZW4gdGhlIGluZGV4IGZyb20gd2hpY2ggdG8gc3RhcnQgbG9va2luZy5cbiAgICogVGhlIGdhcCBlbmRzIHdoZW4gYSBub24temVybyB2YWx1ZSBpcyBmb3VuZC5cbiAgICovXG4gIHByaXZhdGUgX2ZpbmRHYXBFbmRJbmRleChnYXBTdGFydEluZGV4OiBudW1iZXIpOiBudW1iZXIge1xuICAgIGZvciAobGV0IGkgPSBnYXBTdGFydEluZGV4ICsgMTsgaSA8IHRoaXMudHJhY2tlci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMudHJhY2tlcltpXSAhPSAwKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZSBnYXAgZW5kcyB3aXRoIHRoZSBlbmQgb2YgdGhlIHJvdy5cbiAgICByZXR1cm4gdGhpcy50cmFja2VyLmxlbmd0aDtcbiAgfVxuXG4gIC8qKiBVcGRhdGUgdGhlIHRpbGUgdHJhY2tlciB0byBhY2NvdW50IGZvciB0aGUgZ2l2ZW4gdGlsZSBpbiB0aGUgZ2l2ZW4gc3BhY2UuICovXG4gIHByaXZhdGUgX21hcmtUaWxlUG9zaXRpb24oc3RhcnQ6IG51bWJlciwgdGlsZTogVGlsZSk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZS5jb2xzcGFuOyBpKyspIHtcbiAgICAgIHRoaXMudHJhY2tlcltzdGFydCArIGldID0gdGlsZS5yb3dzcGFuO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNpbXBsZSBkYXRhIHN0cnVjdHVyZSBmb3IgdGlsZSBwb3NpdGlvbiAocm93LCBjb2wpLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgVGlsZVBvc2l0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJvdzogbnVtYmVyLCBwdWJsaWMgY29sOiBudW1iZXIpIHt9XG59XG4iXX0=