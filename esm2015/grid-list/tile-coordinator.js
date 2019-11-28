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
     * @param {?} tiles
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS1jb29yZGluYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ncmlkLWxpc3QvdGlsZS1jb29yZGluYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxNQUFNLE9BQU8sZUFBZTtJQUE1Qjs7OztRQUtFLGdCQUFXLEdBQVcsQ0FBQyxDQUFDOzs7O1FBR3hCLGFBQVEsR0FBVyxDQUFDLENBQUM7SUE2SHZCLENBQUM7Ozs7O0lBMUhDLElBQUksUUFBUSxLQUFhLE9BQU8sSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7SUFNcEQsSUFBSSxPQUFPOztjQUNILFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM1QywrRUFBK0U7UUFDL0UscUNBQXFDO1FBQ3JDLE9BQU8sVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pFLENBQUM7Ozs7Ozs7SUFTRCxNQUFNLENBQUMsVUFBa0IsRUFBRSxLQUFvQjtRQUM3QyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUVsQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxHQUFHOzs7O1FBQUMsSUFBSSxDQUFDLEVB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LENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDcEQ7SUFDSCxDQUFDOzs7Ozs7OztJQU1PLGdCQUFnQixDQUFDLGFBQXFCO1FBQzVDLEtBQUssSUFBSSxDQUFDLEdBQUcsYUFBYSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDeEIsT0FBTyxDQUFDLENBQUM7YUFDVjtTQUNGO1FBRUQsd0NBQXdDO1FBQ3hDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDN0IsQ0FBQzs7Ozs7Ozs7SUFHTyxpQkFBaUIsQ0FBQyxLQUFhLEVBQUUsSUFBaUI7UUFDeEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUN4QztJQUNILENBQUM7Q0FDRjs7Ozs7O0lBbklDLGtDQUFrQjs7Ozs7SUFHbEIsc0NBQXdCOzs7OztJQUd4QixtQ0FBcUI7Ozs7O0lBaUJyQixvQ0FBMEI7Ozs7OztBQWtINUIsTUFBTSxPQUFPLFlBQVk7Ozs7O0lBQ3ZCLFlBQW1CLEdBQVcsRUFBUyxHQUFXO1FBQS9CLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFBUyxRQUFHLEdBQUgsR0FBRyxDQUFRO0lBQUcsQ0FBQztDQUN2RDs7O0lBRGEsMkJBQWtCOztJQUFFLDJCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01hdEdyaWRUaWxlfSBmcm9tICcuL2dyaWQtdGlsZSc7XG5cbi8qKlxuICogQ2xhc3MgZm9yIGRldGVybWluaW5nLCBmcm9tIGEgbGlzdCBvZiB0aWxlcywgdGhlIChyb3csIGNvbCkgcG9zaXRpb24gb2YgZWFjaCBvZiB0aG9zZSB0aWxlc1xuICogaW4gdGhlIGdyaWQuIFRoaXMgaXMgbmVjZXNzYXJ5IChyYXRoZXIgdGhhbiBqdXN0IHJlbmRlcmluZyB0aGUgdGlsZXMgaW4gbm9ybWFsIGRvY3VtZW50IGZsb3cpXG4gKiBiZWNhdXNlIHRoZSB0aWxlcyBjYW4gaGF2ZSBhIHJvd3NwYW4uXG4gKlxuICogVGhlIHBvc2l0aW9uaW5nIGFsZ29yaXRobSBncmVlZGlseSBwbGFjZXMgZWFjaCB0aWxlIGFzIHNvb24gYXMgaXQgZW5jb3VudGVycyBhIGdhcCBpbiB0aGUgZ3JpZFxuICogbGFyZ2UgZW5vdWdoIHRvIGFjY29tbW9kYXRlIGl0IHNvIHRoYXQgdGhlIHRpbGVzIHN0aWxsIHJlbmRlciBpbiB0aGUgc2FtZSBvcmRlciBpbiB3aGljaCB0aGV5XG4gKiBhcmUgZ2l2ZW4uXG4gKlxuICogVGhlIGJhc2lzIG9mIHRoZSBhbGdvcml0aG0gaXMgdGhlIHVzZSBvZiBhbiBhcnJheSB0byB0cmFjayB0aGUgYWxyZWFkeSBwbGFjZWQgdGlsZXMuIEVhY2hcbiAqIGVsZW1lbnQgb2YgdGhlIGFycmF5IGNvcnJlc3BvbmRzIHRvIGEgY29sdW1uLCBhbmQgdGhlIHZhbHVlIGluZGljYXRlcyBob3cgbWFueSBjZWxscyBpbiB0aGF0XG4gKiBjb2x1bW4gYXJlIGFscmVhZHkgb2NjdXBpZWQ7IHplcm8gaW5kaWNhdGVzIGFuIGVtcHR5IGNlbGwuIE1vdmluZyBcImRvd25cIiB0byB0aGUgbmV4dCByb3dcbiAqIGRlY3JlbWVudHMgZWFjaCB2YWx1ZSBpbiB0aGUgdHJhY2tpbmcgYXJyYXkgKGluZGljYXRpbmcgdGhhdCB0aGUgY29sdW1uIGlzIG9uZSBjZWxsIGNsb3NlciB0b1xuICogYmVpbmcgZnJlZSkuXG4gKlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgVGlsZUNvb3JkaW5hdG9yIHtcbiAgLyoqIFRyYWNraW5nIGFycmF5IChzZWUgY2xhc3MgZGVzY3JpcHRpb24pLiAqL1xuICB0cmFja2VyOiBudW1iZXJbXTtcblxuICAvKiogSW5kZXggYXQgd2hpY2ggdGhlIHNlYXJjaCBmb3IgdGhlIG5leHQgZ2FwIHdpbGwgc3RhcnQuICovXG4gIGNvbHVtbkluZGV4OiBudW1iZXIgPSAwO1xuXG4gIC8qKiBUaGUgY3VycmVudCByb3cgaW5kZXguICovXG4gIHJvd0luZGV4OiBudW1iZXIgPSAwO1xuXG4gIC8qKiBHZXRzIHRoZSB0b3RhbCBudW1iZXIgb2Ygcm93cyBvY2N1cGllZCBieSB0aWxlcyAqL1xuICBnZXQgcm93Q291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMucm93SW5kZXggKyAxOyB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRvdGFsIHNwYW4gb2Ygcm93cyBvY2N1cGllZCBieSB0aWxlcy5cbiAgICogRXg6IEEgbGlzdCB3aXRoIDEgcm93IHRoYXQgY29udGFpbnMgYSB0aWxlIHdpdGggcm93c3BhbiAyIHdpbGwgaGF2ZSBhIHRvdGFsIHJvd3NwYW4gb2YgMi5cbiAgICovXG4gIGdldCByb3dzcGFuKCkge1xuICAgIGNvbnN0IGxhc3RSb3dNYXggPSBNYXRoLm1heCguLi50aGlzLnRyYWNrZXIpO1xuICAgIC8vIGlmIGFueSBvZiB0aGUgdGlsZXMgaGFzIGEgcm93c3BhbiB0aGF0IHB1c2hlcyBpdCBiZXlvbmQgdGhlIHRvdGFsIHJvdyBjb3VudCxcbiAgICAvLyBhZGQgdGhlIGRpZmZlcmVuY2UgdG8gdGhlIHJvd2NvdW50XG4gICAgcmV0dXJuIGxhc3RSb3dNYXggPiAxID8gdGhpcy5yb3dDb3VudCArIGxhc3RSb3dNYXggLSAxIDogdGhpcy5yb3dDb3VudDtcbiAgfVxuXG4gIC8qKiBUaGUgY29tcHV0ZWQgKHJvdywgY29sKSBwb3NpdGlvbiBvZiBlYWNoIHRpbGUgKHRoZSBvdXRwdXQpLiAqL1xuICBwb3NpdGlvbnM6IFRpbGVQb3NpdGlvbltdO1xuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB0aWxlIHBvc2l0aW9ucy5cbiAgICogQHBhcmFtIG51bUNvbHVtbnMgQW1vdW50IG9mIGNvbHVtbnMgaW4gdGhlIGdyaWQuXG4gICAqL1xuICB1cGRhdGUobnVtQ29sdW1uczogbnVtYmVyLCB0aWxlczogTWF0R3JpZFRpbGVbXSkge1xuICAgIHRoaXMuY29sdW1uSW5kZXggPSAwO1xuICAgIHRoaXMucm93SW5kZXggPSAwO1xuXG4gICAgdGhpcy50cmFja2VyID0gbmV3IEFycmF5KG51bUNvbHVtbnMpO1xuICAgIHRoaXMudHJhY2tlci5maWxsKDAsIDAsIHRoaXMudHJhY2tlci5sZW5ndGgpO1xuICAgIHRoaXMucG9zaXRpb25zID0gdGlsZXMubWFwKHRpbGUgPT4gdGhpcy5fdHJhY2tUaWxlKHRpbGUpKTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSByb3cgYW5kIGNvbCBwb3NpdGlvbiBvZiBhIHRpbGUuICovXG4gIHByaXZhdGUgX3RyYWNrVGlsZSh0aWxlOiBNYXRHcmlkVGlsZSk6IFRpbGVQb3NpdGlvbiB7XG4gICAgLy8gRmluZCBhIGdhcCBsYXJnZSBlbm91Z2ggZm9yIHRoaXMgdGlsZS5cbiAgICBjb25zdCBnYXBTdGFydEluZGV4ID0gdGhpcy5fZmluZE1hdGNoaW5nR2FwKHRpbGUuY29sc3Bhbik7XG5cbiAgICAvLyBQbGFjZSB0aWxlIGluIHRoZSByZXN1bHRpbmcgZ2FwLlxuICAgIHRoaXMuX21hcmtUaWxlUG9zaXRpb24oZ2FwU3RhcnRJbmRleCwgdGlsZSk7XG5cbiAgICAvLyBUaGUgbmV4dCB0aW1lIHdlIGxvb2sgZm9yIGEgZ2FwLCB0aGUgc2VhcmNoIHdpbGwgc3RhcnQgYXQgY29sdW1uSW5kZXgsIHdoaWNoIHNob3VsZCBiZVxuICAgIC8vIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSB0aWxlIHRoYXQgaGFzIGp1c3QgYmVlbiBwbGFjZWQuXG4gICAgdGhpcy5jb2x1bW5JbmRleCA9IGdhcFN0YXJ0SW5kZXggKyB0aWxlLmNvbHNwYW47XG5cbiAgICByZXR1cm4gbmV3IFRpbGVQb3NpdGlvbih0aGlzLnJvd0luZGV4LCBnYXBTdGFydEluZGV4KTtcbiAgfVxuXG4gIC8qKiBGaW5kcyB0aGUgbmV4dCBhdmFpbGFibGUgc3BhY2UgbGFyZ2UgZW5vdWdoIHRvIGZpdCB0aGUgdGlsZS4gKi9cbiAgcHJpdmF0ZSBfZmluZE1hdGNoaW5nR2FwKHRpbGVDb2xzOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGlmICh0aWxlQ29scyA+IHRoaXMudHJhY2tlci5sZW5ndGgpIHtcbiAgICAgIHRocm93IEVycm9yKGBtYXQtZ3JpZC1saXN0OiB0aWxlIHdpdGggY29sc3BhbiAke3RpbGVDb2xzfSBpcyB3aWRlciB0aGFuIGAgK1xuICAgICAgICAgICAgICAgICAgICAgIGBncmlkIHdpdGggY29scz1cIiR7dGhpcy50cmFja2VyLmxlbmd0aH1cIi5gKTtcbiAgICB9XG5cbiAgICAvLyBTdGFydCBpbmRleCBpcyBpbmNsdXNpdmUsIGVuZCBpbmRleCBpcyBleGNsdXNpdmUuXG4gICAgbGV0IGdhcFN0YXJ0SW5kZXggPSAtMTtcbiAgICBsZXQgZ2FwRW5kSW5kZXggPSAtMTtcblxuICAgIC8vIExvb2sgZm9yIGEgZ2FwIGxhcmdlIGVub3VnaCB0byBmaXQgdGhlIGdpdmVuIHRpbGUuIEVtcHR5IHNwYWNlcyBhcmUgbWFya2VkIHdpdGggYSB6ZXJvLlxuICAgIGRvIHtcbiAgICAgIC8vIElmIHdlJ3ZlIHJlYWNoZWQgdGhlIGVuZCBvZiB0aGUgcm93LCBnbyB0byB0aGUgbmV4dCByb3cuXG4gICAgICBpZiAodGhpcy5jb2x1bW5JbmRleCArIHRpbGVDb2xzID4gdGhpcy50cmFja2VyLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9uZXh0Um93KCk7XG4gICAgICAgIGdhcFN0YXJ0SW5kZXggPSB0aGlzLnRyYWNrZXIuaW5kZXhPZigwLCB0aGlzLmNvbHVtbkluZGV4KTtcbiAgICAgICAgZ2FwRW5kSW5kZXggPSB0aGlzLl9maW5kR2FwRW5kSW5kZXgoZ2FwU3RhcnRJbmRleCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBnYXBTdGFydEluZGV4ID0gdGhpcy50cmFja2VyLmluZGV4T2YoMCwgdGhpcy5jb2x1bW5JbmRleCk7XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBtb3JlIGVtcHR5IHNwYWNlcyBpbiB0aGlzIHJvdyBhdCBhbGwsIG1vdmUgb24gdG8gdGhlIG5leHQgcm93LlxuICAgICAgaWYgKGdhcFN0YXJ0SW5kZXggPT0gLTEpIHtcbiAgICAgICAgdGhpcy5fbmV4dFJvdygpO1xuICAgICAgICBnYXBTdGFydEluZGV4ID0gdGhpcy50cmFja2VyLmluZGV4T2YoMCwgdGhpcy5jb2x1bW5JbmRleCk7XG4gICAgICAgIGdhcEVuZEluZGV4ID0gdGhpcy5fZmluZEdhcEVuZEluZGV4KGdhcFN0YXJ0SW5kZXgpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZ2FwRW5kSW5kZXggPSB0aGlzLl9maW5kR2FwRW5kSW5kZXgoZ2FwU3RhcnRJbmRleCk7XG5cbiAgICAgIC8vIElmIGEgZ2FwIGxhcmdlIGVub3VnaCBpc24ndCBmb3VuZCwgd2Ugd2FudCB0byBzdGFydCBsb29raW5nIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBjdXJyZW50XG4gICAgICAvLyBnYXAgb24gdGhlIG5leHQgaXRlcmF0aW9uLlxuICAgICAgdGhpcy5jb2x1bW5JbmRleCA9IGdhcFN0YXJ0SW5kZXggKyAxO1xuXG4gICAgICAvLyBDb250aW51ZSBpdGVyYXRpbmcgdW50aWwgd2UgZmluZCBhIGdhcCB3aWRlIGVub3VnaCBmb3IgdGhpcyB0aWxlLiBTaW5jZSBnYXBFbmRJbmRleCBpc1xuICAgICAgLy8gZXhjbHVzaXZlLCBnYXBFbmRJbmRleCBpcyAwIG1lYW5zIHdlIGRpZG4ndCBmaW5kIGEgZ2FwIGFuZCBzaG91bGQgY29udGludWUuXG4gICAgfSB3aGlsZSAoKGdhcEVuZEluZGV4IC0gZ2FwU3RhcnRJbmRleCA8IHRpbGVDb2xzKSB8fCAoZ2FwRW5kSW5kZXggPT0gMCkpO1xuXG4gICAgLy8gSWYgd2Ugc3RpbGwgZGlkbid0IG1hbmFnZSB0byBmaW5kIGEgZ2FwLCBlbnN1cmUgdGhhdCB0aGUgaW5kZXggaXNcbiAgICAvLyBhdCBsZWFzdCB6ZXJvIHNvIHRoZSB0aWxlIGRvZXNuJ3QgZ2V0IHB1bGxlZCBvdXQgb2YgdGhlIGdyaWQuXG4gICAgcmV0dXJuIE1hdGgubWF4KGdhcFN0YXJ0SW5kZXgsIDApO1xuICB9XG5cbiAgLyoqIE1vdmUgXCJkb3duXCIgdG8gdGhlIG5leHQgcm93LiAqL1xuICBwcml2YXRlIF9uZXh0Um93KCk6IHZvaWQge1xuICAgIHRoaXMuY29sdW1uSW5kZXggPSAwO1xuICAgIHRoaXMucm93SW5kZXgrKztcblxuICAgIC8vIERlY3JlbWVudCBhbGwgc3BhY2VzIGJ5IG9uZSB0byByZWZsZWN0IG1vdmluZyBkb3duIG9uZSByb3cuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRyYWNrZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMudHJhY2tlcltpXSA9IE1hdGgubWF4KDAsIHRoaXMudHJhY2tlcltpXSAtIDEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyB0aGUgZW5kIGluZGV4IChleGNsdXNpdmUpIG9mIGEgZ2FwIGdpdmVuIHRoZSBpbmRleCBmcm9tIHdoaWNoIHRvIHN0YXJ0IGxvb2tpbmcuXG4gICAqIFRoZSBnYXAgZW5kcyB3aGVuIGEgbm9uLXplcm8gdmFsdWUgaXMgZm91bmQuXG4gICAqL1xuICBwcml2YXRlIF9maW5kR2FwRW5kSW5kZXgoZ2FwU3RhcnRJbmRleDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBmb3IgKGxldCBpID0gZ2FwU3RhcnRJbmRleCArIDE7IGkgPCB0aGlzLnRyYWNrZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLnRyYWNrZXJbaV0gIT0gMCkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGUgZ2FwIGVuZHMgd2l0aCB0aGUgZW5kIG9mIHRoZSByb3cuXG4gICAgcmV0dXJuIHRoaXMudHJhY2tlci5sZW5ndGg7XG4gIH1cblxuICAvKiogVXBkYXRlIHRoZSB0aWxlIHRyYWNrZXIgdG8gYWNjb3VudCBmb3IgdGhlIGdpdmVuIHRpbGUgaW4gdGhlIGdpdmVuIHNwYWNlLiAqL1xuICBwcml2YXRlIF9tYXJrVGlsZVBvc2l0aW9uKHN0YXJ0OiBudW1iZXIsIHRpbGU6IE1hdEdyaWRUaWxlKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlLmNvbHNwYW47IGkrKykge1xuICAgICAgdGhpcy50cmFja2VyW3N0YXJ0ICsgaV0gPSB0aWxlLnJvd3NwYW47XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU2ltcGxlIGRhdGEgc3RydWN0dXJlIGZvciB0aWxlIHBvc2l0aW9uIChyb3csIGNvbCkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBUaWxlUG9zaXRpb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcm93OiBudW1iZXIsIHB1YmxpYyBjb2w6IG51bWJlcikge31cbn1cbiJdfQ==