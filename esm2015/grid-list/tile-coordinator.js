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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS1jb29yZGluYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ncmlkLWxpc3QvdGlsZS1jb29yZGluYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBLE1BQU0sT0FBTyxlQUFlO0lBQTVCOzs7O1FBS0UsZ0JBQVcsR0FBVyxDQUFDLENBQUM7Ozs7UUFHeEIsYUFBUSxHQUFXLENBQUMsQ0FBQztJQTZIdkIsQ0FBQzs7Ozs7SUExSEMsSUFBSSxRQUFRLEtBQWEsT0FBTyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7OztJQU1wRCxJQUFJLE9BQU87O2NBQ0gsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzVDLCtFQUErRTtRQUMvRSxxQ0FBcUM7UUFDckMsT0FBTyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekUsQ0FBQzs7Ozs7OztJQVNELE1BQU0sQ0FBQyxVQUFrQixFQUFFLEtBQW9CO1FBQzdDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRWxCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUc7Ozs7UUFBQyxJQUFJLENBQUMsRUFB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Q0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNwRDtJQUNILENBQUM7Ozs7Ozs7O0lBTU8sZ0JBQWdCLENBQUMsYUFBcUI7UUFDNUMsS0FBSyxJQUFJLENBQUMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1RCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN4QixPQUFPLENBQUMsQ0FBQzthQUNWO1NBQ0Y7UUFFRCx3Q0FBd0M7UUFDeEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUM3QixDQUFDOzs7Ozs7OztJQUdPLGlCQUFpQixDQUFDLEtBQWEsRUFBRSxJQUFpQjtRQUN4RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztDQUNGOzs7Ozs7SUFuSUMsa0NBQWtCOzs7OztJQUdsQixzQ0FBd0I7Ozs7O0lBR3hCLG1DQUFxQjs7Ozs7SUFpQnJCLG9DQUEwQjs7Ozs7O0FBa0g1QixNQUFNLE9BQU8sWUFBWTs7Ozs7SUFDdkIsWUFBbUIsR0FBVyxFQUFTLEdBQVc7UUFBL0IsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUFTLFFBQUcsR0FBSCxHQUFHLENBQVE7SUFBRyxDQUFDO0NBQ3ZEOzs7SUFEYSwyQkFBa0I7O0lBQUUsMkJBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TWF0R3JpZFRpbGV9IGZyb20gJy4vZ3JpZC10aWxlJztcblxuLyoqXG4gKiBDbGFzcyBmb3IgZGV0ZXJtaW5pbmcsIGZyb20gYSBsaXN0IG9mIHRpbGVzLCB0aGUgKHJvdywgY29sKSBwb3NpdGlvbiBvZiBlYWNoIG9mIHRob3NlIHRpbGVzXG4gKiBpbiB0aGUgZ3JpZC4gVGhpcyBpcyBuZWNlc3NhcnkgKHJhdGhlciB0aGFuIGp1c3QgcmVuZGVyaW5nIHRoZSB0aWxlcyBpbiBub3JtYWwgZG9jdW1lbnQgZmxvdylcbiAqIGJlY2F1c2UgdGhlIHRpbGVzIGNhbiBoYXZlIGEgcm93c3Bhbi5cbiAqXG4gKiBUaGUgcG9zaXRpb25pbmcgYWxnb3JpdGhtIGdyZWVkaWx5IHBsYWNlcyBlYWNoIHRpbGUgYXMgc29vbiBhcyBpdCBlbmNvdW50ZXJzIGEgZ2FwIGluIHRoZSBncmlkXG4gKiBsYXJnZSBlbm91Z2ggdG8gYWNjb21tb2RhdGUgaXQgc28gdGhhdCB0aGUgdGlsZXMgc3RpbGwgcmVuZGVyIGluIHRoZSBzYW1lIG9yZGVyIGluIHdoaWNoIHRoZXlcbiAqIGFyZSBnaXZlbi5cbiAqXG4gKiBUaGUgYmFzaXMgb2YgdGhlIGFsZ29yaXRobSBpcyB0aGUgdXNlIG9mIGFuIGFycmF5IHRvIHRyYWNrIHRoZSBhbHJlYWR5IHBsYWNlZCB0aWxlcy4gRWFjaFxuICogZWxlbWVudCBvZiB0aGUgYXJyYXkgY29ycmVzcG9uZHMgdG8gYSBjb2x1bW4sIGFuZCB0aGUgdmFsdWUgaW5kaWNhdGVzIGhvdyBtYW55IGNlbGxzIGluIHRoYXRcbiAqIGNvbHVtbiBhcmUgYWxyZWFkeSBvY2N1cGllZDsgemVybyBpbmRpY2F0ZXMgYW4gZW1wdHkgY2VsbC4gTW92aW5nIFwiZG93blwiIHRvIHRoZSBuZXh0IHJvd1xuICogZGVjcmVtZW50cyBlYWNoIHZhbHVlIGluIHRoZSB0cmFja2luZyBhcnJheSAoaW5kaWNhdGluZyB0aGF0IHRoZSBjb2x1bW4gaXMgb25lIGNlbGwgY2xvc2VyIHRvXG4gKiBiZWluZyBmcmVlKS5cbiAqXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBUaWxlQ29vcmRpbmF0b3Ige1xuICAvKiogVHJhY2tpbmcgYXJyYXkgKHNlZSBjbGFzcyBkZXNjcmlwdGlvbikuICovXG4gIHRyYWNrZXI6IG51bWJlcltdO1xuXG4gIC8qKiBJbmRleCBhdCB3aGljaCB0aGUgc2VhcmNoIGZvciB0aGUgbmV4dCBnYXAgd2lsbCBzdGFydC4gKi9cbiAgY29sdW1uSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgLyoqIFRoZSBjdXJyZW50IHJvdyBpbmRleC4gKi9cbiAgcm93SW5kZXg6IG51bWJlciA9IDA7XG5cbiAgLyoqIEdldHMgdGhlIHRvdGFsIG51bWJlciBvZiByb3dzIG9jY3VwaWVkIGJ5IHRpbGVzICovXG4gIGdldCByb3dDb3VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5yb3dJbmRleCArIDE7IH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdG90YWwgc3BhbiBvZiByb3dzIG9jY3VwaWVkIGJ5IHRpbGVzLlxuICAgKiBFeDogQSBsaXN0IHdpdGggMSByb3cgdGhhdCBjb250YWlucyBhIHRpbGUgd2l0aCByb3dzcGFuIDIgd2lsbCBoYXZlIGEgdG90YWwgcm93c3BhbiBvZiAyLlxuICAgKi9cbiAgZ2V0IHJvd3NwYW4oKSB7XG4gICAgY29uc3QgbGFzdFJvd01heCA9IE1hdGgubWF4KC4uLnRoaXMudHJhY2tlcik7XG4gICAgLy8gaWYgYW55IG9mIHRoZSB0aWxlcyBoYXMgYSByb3dzcGFuIHRoYXQgcHVzaGVzIGl0IGJleW9uZCB0aGUgdG90YWwgcm93IGNvdW50LFxuICAgIC8vIGFkZCB0aGUgZGlmZmVyZW5jZSB0byB0aGUgcm93Y291bnRcbiAgICByZXR1cm4gbGFzdFJvd01heCA+IDEgPyB0aGlzLnJvd0NvdW50ICsgbGFzdFJvd01heCAtIDEgOiB0aGlzLnJvd0NvdW50O1xuICB9XG5cbiAgLyoqIFRoZSBjb21wdXRlZCAocm93LCBjb2wpIHBvc2l0aW9uIG9mIGVhY2ggdGlsZSAodGhlIG91dHB1dCkuICovXG4gIHBvc2l0aW9uczogVGlsZVBvc2l0aW9uW107XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHRpbGUgcG9zaXRpb25zLlxuICAgKiBAcGFyYW0gbnVtQ29sdW1ucyBBbW91bnQgb2YgY29sdW1ucyBpbiB0aGUgZ3JpZC5cbiAgICovXG4gIHVwZGF0ZShudW1Db2x1bW5zOiBudW1iZXIsIHRpbGVzOiBNYXRHcmlkVGlsZVtdKSB7XG4gICAgdGhpcy5jb2x1bW5JbmRleCA9IDA7XG4gICAgdGhpcy5yb3dJbmRleCA9IDA7XG5cbiAgICB0aGlzLnRyYWNrZXIgPSBuZXcgQXJyYXkobnVtQ29sdW1ucyk7XG4gICAgdGhpcy50cmFja2VyLmZpbGwoMCwgMCwgdGhpcy50cmFja2VyLmxlbmd0aCk7XG4gICAgdGhpcy5wb3NpdGlvbnMgPSB0aWxlcy5tYXAodGlsZSA9PiB0aGlzLl90cmFja1RpbGUodGlsZSkpO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZXMgdGhlIHJvdyBhbmQgY29sIHBvc2l0aW9uIG9mIGEgdGlsZS4gKi9cbiAgcHJpdmF0ZSBfdHJhY2tUaWxlKHRpbGU6IE1hdEdyaWRUaWxlKTogVGlsZVBvc2l0aW9uIHtcbiAgICAvLyBGaW5kIGEgZ2FwIGxhcmdlIGVub3VnaCBmb3IgdGhpcyB0aWxlLlxuICAgIGNvbnN0IGdhcFN0YXJ0SW5kZXggPSB0aGlzLl9maW5kTWF0Y2hpbmdHYXAodGlsZS5jb2xzcGFuKTtcblxuICAgIC8vIFBsYWNlIHRpbGUgaW4gdGhlIHJlc3VsdGluZyBnYXAuXG4gICAgdGhpcy5fbWFya1RpbGVQb3NpdGlvbihnYXBTdGFydEluZGV4LCB0aWxlKTtcblxuICAgIC8vIFRoZSBuZXh0IHRpbWUgd2UgbG9vayBmb3IgYSBnYXAsIHRoZSBzZWFyY2ggd2lsbCBzdGFydCBhdCBjb2x1bW5JbmRleCwgd2hpY2ggc2hvdWxkIGJlXG4gICAgLy8gaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIHRpbGUgdGhhdCBoYXMganVzdCBiZWVuIHBsYWNlZC5cbiAgICB0aGlzLmNvbHVtbkluZGV4ID0gZ2FwU3RhcnRJbmRleCArIHRpbGUuY29sc3BhbjtcblxuICAgIHJldHVybiBuZXcgVGlsZVBvc2l0aW9uKHRoaXMucm93SW5kZXgsIGdhcFN0YXJ0SW5kZXgpO1xuICB9XG5cbiAgLyoqIEZpbmRzIHRoZSBuZXh0IGF2YWlsYWJsZSBzcGFjZSBsYXJnZSBlbm91Z2ggdG8gZml0IHRoZSB0aWxlLiAqL1xuICBwcml2YXRlIF9maW5kTWF0Y2hpbmdHYXAodGlsZUNvbHM6IG51bWJlcik6IG51bWJlciB7XG4gICAgaWYgKHRpbGVDb2xzID4gdGhpcy50cmFja2VyLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoYG1hdC1ncmlkLWxpc3Q6IHRpbGUgd2l0aCBjb2xzcGFuICR7dGlsZUNvbHN9IGlzIHdpZGVyIHRoYW4gYCArXG4gICAgICAgICAgICAgICAgICAgICAgYGdyaWQgd2l0aCBjb2xzPVwiJHt0aGlzLnRyYWNrZXIubGVuZ3RofVwiLmApO1xuICAgIH1cblxuICAgIC8vIFN0YXJ0IGluZGV4IGlzIGluY2x1c2l2ZSwgZW5kIGluZGV4IGlzIGV4Y2x1c2l2ZS5cbiAgICBsZXQgZ2FwU3RhcnRJbmRleCA9IC0xO1xuICAgIGxldCBnYXBFbmRJbmRleCA9IC0xO1xuXG4gICAgLy8gTG9vayBmb3IgYSBnYXAgbGFyZ2UgZW5vdWdoIHRvIGZpdCB0aGUgZ2l2ZW4gdGlsZS4gRW1wdHkgc3BhY2VzIGFyZSBtYXJrZWQgd2l0aCBhIHplcm8uXG4gICAgZG8ge1xuICAgICAgLy8gSWYgd2UndmUgcmVhY2hlZCB0aGUgZW5kIG9mIHRoZSByb3csIGdvIHRvIHRoZSBuZXh0IHJvdy5cbiAgICAgIGlmICh0aGlzLmNvbHVtbkluZGV4ICsgdGlsZUNvbHMgPiB0aGlzLnRyYWNrZXIubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX25leHRSb3coKTtcbiAgICAgICAgZ2FwU3RhcnRJbmRleCA9IHRoaXMudHJhY2tlci5pbmRleE9mKDAsIHRoaXMuY29sdW1uSW5kZXgpO1xuICAgICAgICBnYXBFbmRJbmRleCA9IHRoaXMuX2ZpbmRHYXBFbmRJbmRleChnYXBTdGFydEluZGV4KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGdhcFN0YXJ0SW5kZXggPSB0aGlzLnRyYWNrZXIuaW5kZXhPZigwLCB0aGlzLmNvbHVtbkluZGV4KTtcblxuICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIG1vcmUgZW1wdHkgc3BhY2VzIGluIHRoaXMgcm93IGF0IGFsbCwgbW92ZSBvbiB0byB0aGUgbmV4dCByb3cuXG4gICAgICBpZiAoZ2FwU3RhcnRJbmRleCA9PSAtMSkge1xuICAgICAgICB0aGlzLl9uZXh0Um93KCk7XG4gICAgICAgIGdhcFN0YXJ0SW5kZXggPSB0aGlzLnRyYWNrZXIuaW5kZXhPZigwLCB0aGlzLmNvbHVtbkluZGV4KTtcbiAgICAgICAgZ2FwRW5kSW5kZXggPSB0aGlzLl9maW5kR2FwRW5kSW5kZXgoZ2FwU3RhcnRJbmRleCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBnYXBFbmRJbmRleCA9IHRoaXMuX2ZpbmRHYXBFbmRJbmRleChnYXBTdGFydEluZGV4KTtcblxuICAgICAgLy8gSWYgYSBnYXAgbGFyZ2UgZW5vdWdoIGlzbid0IGZvdW5kLCB3ZSB3YW50IHRvIHN0YXJ0IGxvb2tpbmcgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIGN1cnJlbnRcbiAgICAgIC8vIGdhcCBvbiB0aGUgbmV4dCBpdGVyYXRpb24uXG4gICAgICB0aGlzLmNvbHVtbkluZGV4ID0gZ2FwU3RhcnRJbmRleCArIDE7XG5cbiAgICAgIC8vIENvbnRpbnVlIGl0ZXJhdGluZyB1bnRpbCB3ZSBmaW5kIGEgZ2FwIHdpZGUgZW5vdWdoIGZvciB0aGlzIHRpbGUuIFNpbmNlIGdhcEVuZEluZGV4IGlzXG4gICAgICAvLyBleGNsdXNpdmUsIGdhcEVuZEluZGV4IGlzIDAgbWVhbnMgd2UgZGlkbid0IGZpbmQgYSBnYXAgYW5kIHNob3VsZCBjb250aW51ZS5cbiAgICB9IHdoaWxlICgoZ2FwRW5kSW5kZXggLSBnYXBTdGFydEluZGV4IDwgdGlsZUNvbHMpIHx8IChnYXBFbmRJbmRleCA9PSAwKSk7XG5cbiAgICAvLyBJZiB3ZSBzdGlsbCBkaWRuJ3QgbWFuYWdlIHRvIGZpbmQgYSBnYXAsIGVuc3VyZSB0aGF0IHRoZSBpbmRleCBpc1xuICAgIC8vIGF0IGxlYXN0IHplcm8gc28gdGhlIHRpbGUgZG9lc24ndCBnZXQgcHVsbGVkIG91dCBvZiB0aGUgZ3JpZC5cbiAgICByZXR1cm4gTWF0aC5tYXgoZ2FwU3RhcnRJbmRleCwgMCk7XG4gIH1cblxuICAvKiogTW92ZSBcImRvd25cIiB0byB0aGUgbmV4dCByb3cuICovXG4gIHByaXZhdGUgX25leHRSb3coKTogdm9pZCB7XG4gICAgdGhpcy5jb2x1bW5JbmRleCA9IDA7XG4gICAgdGhpcy5yb3dJbmRleCsrO1xuXG4gICAgLy8gRGVjcmVtZW50IGFsbCBzcGFjZXMgYnkgb25lIHRvIHJlZmxlY3QgbW92aW5nIGRvd24gb25lIHJvdy5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudHJhY2tlci5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy50cmFja2VyW2ldID0gTWF0aC5tYXgoMCwgdGhpcy50cmFja2VyW2ldIC0gMSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIHRoZSBlbmQgaW5kZXggKGV4Y2x1c2l2ZSkgb2YgYSBnYXAgZ2l2ZW4gdGhlIGluZGV4IGZyb20gd2hpY2ggdG8gc3RhcnQgbG9va2luZy5cbiAgICogVGhlIGdhcCBlbmRzIHdoZW4gYSBub24temVybyB2YWx1ZSBpcyBmb3VuZC5cbiAgICovXG4gIHByaXZhdGUgX2ZpbmRHYXBFbmRJbmRleChnYXBTdGFydEluZGV4OiBudW1iZXIpOiBudW1iZXIge1xuICAgIGZvciAobGV0IGkgPSBnYXBTdGFydEluZGV4ICsgMTsgaSA8IHRoaXMudHJhY2tlci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMudHJhY2tlcltpXSAhPSAwKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZSBnYXAgZW5kcyB3aXRoIHRoZSBlbmQgb2YgdGhlIHJvdy5cbiAgICByZXR1cm4gdGhpcy50cmFja2VyLmxlbmd0aDtcbiAgfVxuXG4gIC8qKiBVcGRhdGUgdGhlIHRpbGUgdHJhY2tlciB0byBhY2NvdW50IGZvciB0aGUgZ2l2ZW4gdGlsZSBpbiB0aGUgZ2l2ZW4gc3BhY2UuICovXG4gIHByaXZhdGUgX21hcmtUaWxlUG9zaXRpb24oc3RhcnQ6IG51bWJlciwgdGlsZTogTWF0R3JpZFRpbGUpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGUuY29sc3BhbjsgaSsrKSB7XG4gICAgICB0aGlzLnRyYWNrZXJbc3RhcnQgKyBpXSA9IHRpbGUucm93c3BhbjtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTaW1wbGUgZGF0YSBzdHJ1Y3R1cmUgZm9yIHRpbGUgcG9zaXRpb24gKHJvdywgY29sKS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIFRpbGVQb3NpdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByb3c6IG51bWJlciwgcHVibGljIGNvbDogbnVtYmVyKSB7fVxufVxuIl19