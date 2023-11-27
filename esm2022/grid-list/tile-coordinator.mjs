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
 * @docs-private
 */
export class TileCoordinator {
    constructor() {
        /** Index at which the search for the next gap will start. */
        this.columnIndex = 0;
        /** The current row index. */
        this.rowIndex = 0;
    }
    /** Gets the total number of rows occupied by tiles */
    get rowCount() {
        return this.rowIndex + 1;
    }
    /**
     * Gets the total span of rows occupied by tiles.
     * Ex: A list with 1 row that contains a tile with rowspan 2 will have a total rowspan of 2.
     */
    get rowspan() {
        const lastRowMax = Math.max(...this.tracker);
        // if any of the tiles has a rowspan that pushes it beyond the total row count,
        // add the difference to the rowcount
        return lastRowMax > 1 ? this.rowCount + lastRowMax - 1 : this.rowCount;
    }
    /**
     * Updates the tile positions.
     * @param numColumns Amount of columns in the grid.
     * @param tiles Tiles to be positioned.
     */
    update(numColumns, tiles) {
        this.columnIndex = 0;
        this.rowIndex = 0;
        this.tracker = new Array(numColumns);
        this.tracker.fill(0, 0, this.tracker.length);
        this.positions = tiles.map(tile => this._trackTile(tile));
    }
    /** Calculates the row and col position of a tile. */
    _trackTile(tile) {
        // Find a gap large enough for this tile.
        const gapStartIndex = this._findMatchingGap(tile.colspan);
        // Place tile in the resulting gap.
        this._markTilePosition(gapStartIndex, tile);
        // The next time we look for a gap, the search will start at columnIndex, which should be
        // immediately after the tile that has just been placed.
        this.columnIndex = gapStartIndex + tile.colspan;
        return new TilePosition(this.rowIndex, gapStartIndex);
    }
    /** Finds the next available space large enough to fit the tile. */
    _findMatchingGap(tileCols) {
        if (tileCols > this.tracker.length && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error(`mat-grid-list: tile with colspan ${tileCols} is wider than ` +
                `grid with cols="${this.tracker.length}".`);
        }
        // Start index is inclusive, end index is exclusive.
        let gapStartIndex = -1;
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
        } while (gapEndIndex - gapStartIndex < tileCols || gapEndIndex == 0);
        // If we still didn't manage to find a gap, ensure that the index is
        // at least zero so the tile doesn't get pulled out of the grid.
        return Math.max(gapStartIndex, 0);
    }
    /** Move "down" to the next row. */
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
    /** Update the tile tracker to account for the given tile in the given space. */
    _markTilePosition(start, tile) {
        for (let i = 0; i < tile.colspan; i++) {
            this.tracker[start + i] = tile.rowspan;
        }
    }
}
/**
 * Simple data structure for tile position (row, col).
 * @docs-private
 */
export class TilePosition {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS1jb29yZGluYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ncmlkLWxpc3QvdGlsZS1jb29yZGluYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFhSDs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILE1BQU0sT0FBTyxlQUFlO0lBQTVCO1FBSUUsNkRBQTZEO1FBQzdELGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBRXhCLDZCQUE2QjtRQUM3QixhQUFRLEdBQVcsQ0FBQyxDQUFDO0lBa0l2QixDQUFDO0lBaElDLHNEQUFzRDtJQUN0RCxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLE9BQU87UUFDVCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLCtFQUErRTtRQUMvRSxxQ0FBcUM7UUFDckMsT0FBTyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekUsQ0FBQztJQUtEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsVUFBa0IsRUFBRSxLQUFhO1FBQ3RDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRWxCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFD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QWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogSW50ZXJmYWNlIGRlc2NyaWJpbmcgYSB0aWxlLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRpbGUge1xuICAvKiogQW1vdW50IG9mIHJvd3MgdGhhdCB0aGUgdGlsZSB0YWtlcyB1cC4gKi9cbiAgcm93c3BhbjogbnVtYmVyO1xuICAvKiogQW1vdW50IG9mIGNvbHVtbnMgdGhhdCB0aGUgdGlsZSB0YWtlcyB1cC4gKi9cbiAgY29sc3BhbjogbnVtYmVyO1xufVxuXG4vKipcbiAqIENsYXNzIGZvciBkZXRlcm1pbmluZywgZnJvbSBhIGxpc3Qgb2YgdGlsZXMsIHRoZSAocm93LCBjb2wpIHBvc2l0aW9uIG9mIGVhY2ggb2YgdGhvc2UgdGlsZXNcbiAqIGluIHRoZSBncmlkLiBUaGlzIGlzIG5lY2Vzc2FyeSAocmF0aGVyIHRoYW4ganVzdCByZW5kZXJpbmcgdGhlIHRpbGVzIGluIG5vcm1hbCBkb2N1bWVudCBmbG93KVxuICogYmVjYXVzZSB0aGUgdGlsZXMgY2FuIGhhdmUgYSByb3dzcGFuLlxuICpcbiAqIFRoZSBwb3NpdGlvbmluZyBhbGdvcml0aG0gZ3JlZWRpbHkgcGxhY2VzIGVhY2ggdGlsZSBhcyBzb29uIGFzIGl0IGVuY291bnRlcnMgYSBnYXAgaW4gdGhlIGdyaWRcbiAqIGxhcmdlIGVub3VnaCB0byBhY2NvbW1vZGF0ZSBpdCBzbyB0aGF0IHRoZSB0aWxlcyBzdGlsbCByZW5kZXIgaW4gdGhlIHNhbWUgb3JkZXIgaW4gd2hpY2ggdGhleVxuICogYXJlIGdpdmVuLlxuICpcbiAqIFRoZSBiYXNpcyBvZiB0aGUgYWxnb3JpdGhtIGlzIHRoZSB1c2Ugb2YgYW4gYXJyYXkgdG8gdHJhY2sgdGhlIGFscmVhZHkgcGxhY2VkIHRpbGVzLiBFYWNoXG4gKiBlbGVtZW50IG9mIHRoZSBhcnJheSBjb3JyZXNwb25kcyB0byBhIGNvbHVtbiwgYW5kIHRoZSB2YWx1ZSBpbmRpY2F0ZXMgaG93IG1hbnkgY2VsbHMgaW4gdGhhdFxuICogY29sdW1uIGFyZSBhbHJlYWR5IG9jY3VwaWVkOyB6ZXJvIGluZGljYXRlcyBhbiBlbXB0eSBjZWxsLiBNb3ZpbmcgXCJkb3duXCIgdG8gdGhlIG5leHQgcm93XG4gKiBkZWNyZW1lbnRzIGVhY2ggdmFsdWUgaW4gdGhlIHRyYWNraW5nIGFycmF5IChpbmRpY2F0aW5nIHRoYXQgdGhlIGNvbHVtbiBpcyBvbmUgY2VsbCBjbG9zZXIgdG9cbiAqIGJlaW5nIGZyZWUpLlxuICpcbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIFRpbGVDb29yZGluYXRvciB7XG4gIC8qKiBUcmFja2luZyBhcnJheSAoc2VlIGNsYXNzIGRlc2NyaXB0aW9uKS4gKi9cbiAgdHJhY2tlcjogbnVtYmVyW107XG5cbiAgLyoqIEluZGV4IGF0IHdoaWNoIHRoZSBzZWFyY2ggZm9yIHRoZSBuZXh0IGdhcCB3aWxsIHN0YXJ0LiAqL1xuICBjb2x1bW5JbmRleDogbnVtYmVyID0gMDtcblxuICAvKiogVGhlIGN1cnJlbnQgcm93IGluZGV4LiAqL1xuICByb3dJbmRleDogbnVtYmVyID0gMDtcblxuICAvKiogR2V0cyB0aGUgdG90YWwgbnVtYmVyIG9mIHJvd3Mgb2NjdXBpZWQgYnkgdGlsZXMgKi9cbiAgZ2V0IHJvd0NvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucm93SW5kZXggKyAxO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRvdGFsIHNwYW4gb2Ygcm93cyBvY2N1cGllZCBieSB0aWxlcy5cbiAgICogRXg6IEEgbGlzdCB3aXRoIDEgcm93IHRoYXQgY29udGFpbnMgYSB0aWxlIHdpdGggcm93c3BhbiAyIHdpbGwgaGF2ZSBhIHRvdGFsIHJvd3NwYW4gb2YgMi5cbiAgICovXG4gIGdldCByb3dzcGFuKCkge1xuICAgIGNvbnN0IGxhc3RSb3dNYXggPSBNYXRoLm1heCguLi50aGlzLnRyYWNrZXIpO1xuICAgIC8vIGlmIGFueSBvZiB0aGUgdGlsZXMgaGFzIGEgcm93c3BhbiB0aGF0IHB1c2hlcyBpdCBiZXlvbmQgdGhlIHRvdGFsIHJvdyBjb3VudCxcbiAgICAvLyBhZGQgdGhlIGRpZmZlcmVuY2UgdG8gdGhlIHJvd2NvdW50XG4gICAgcmV0dXJuIGxhc3RSb3dNYXggPiAxID8gdGhpcy5yb3dDb3VudCArIGxhc3RSb3dNYXggLSAxIDogdGhpcy5yb3dDb3VudDtcbiAgfVxuXG4gIC8qKiBUaGUgY29tcHV0ZWQgKHJvdywgY29sKSBwb3NpdGlvbiBvZiBlYWNoIHRpbGUgKHRoZSBvdXRwdXQpLiAqL1xuICBwb3NpdGlvbnM6IFRpbGVQb3NpdGlvbltdO1xuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB0aWxlIHBvc2l0aW9ucy5cbiAgICogQHBhcmFtIG51bUNvbHVtbnMgQW1vdW50IG9mIGNvbHVtbnMgaW4gdGhlIGdyaWQuXG4gICAqIEBwYXJhbSB0aWxlcyBUaWxlcyB0byBiZSBwb3NpdGlvbmVkLlxuICAgKi9cbiAgdXBkYXRlKG51bUNvbHVtbnM6IG51bWJlciwgdGlsZXM6IFRpbGVbXSkge1xuICAgIHRoaXMuY29sdW1uSW5kZXggPSAwO1xuICAgIHRoaXMucm93SW5kZXggPSAwO1xuXG4gICAgdGhpcy50cmFja2VyID0gbmV3IEFycmF5KG51bUNvbHVtbnMpO1xuICAgIHRoaXMudHJhY2tlci5maWxsKDAsIDAsIHRoaXMudHJhY2tlci5sZW5ndGgpO1xuICAgIHRoaXMucG9zaXRpb25zID0gdGlsZXMubWFwKHRpbGUgPT4gdGhpcy5fdHJhY2tUaWxlKHRpbGUpKTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSByb3cgYW5kIGNvbCBwb3NpdGlvbiBvZiBhIHRpbGUuICovXG4gIHByaXZhdGUgX3RyYWNrVGlsZSh0aWxlOiBUaWxlKTogVGlsZVBvc2l0aW9uIHtcbiAgICAvLyBGaW5kIGEgZ2FwIGxhcmdlIGVub3VnaCBmb3IgdGhpcyB0aWxlLlxuICAgIGNvbnN0IGdhcFN0YXJ0SW5kZXggPSB0aGlzLl9maW5kTWF0Y2hpbmdHYXAodGlsZS5jb2xzcGFuKTtcblxuICAgIC8vIFBsYWNlIHRpbGUgaW4gdGhlIHJlc3VsdGluZyBnYXAuXG4gICAgdGhpcy5fbWFya1RpbGVQb3NpdGlvbihnYXBTdGFydEluZGV4LCB0aWxlKTtcblxuICAgIC8vIFRoZSBuZXh0IHRpbWUgd2UgbG9vayBmb3IgYSBnYXAsIHRoZSBzZWFyY2ggd2lsbCBzdGFydCBhdCBjb2x1bW5JbmRleCwgd2hpY2ggc2hvdWxkIGJlXG4gICAgLy8gaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIHRpbGUgdGhhdCBoYXMganVzdCBiZWVuIHBsYWNlZC5cbiAgICB0aGlzLmNvbHVtbkluZGV4ID0gZ2FwU3RhcnRJbmRleCArIHRpbGUuY29sc3BhbjtcblxuICAgIHJldHVybiBuZXcgVGlsZVBvc2l0aW9uKHRoaXMucm93SW5kZXgsIGdhcFN0YXJ0SW5kZXgpO1xuICB9XG5cbiAgLyoqIEZpbmRzIHRoZSBuZXh0IGF2YWlsYWJsZSBzcGFjZSBsYXJnZSBlbm91Z2ggdG8gZml0IHRoZSB0aWxlLiAqL1xuICBwcml2YXRlIF9maW5kTWF0Y2hpbmdHYXAodGlsZUNvbHM6IG51bWJlcik6IG51bWJlciB7XG4gICAgaWYgKHRpbGVDb2xzID4gdGhpcy50cmFja2VyLmxlbmd0aCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgIGBtYXQtZ3JpZC1saXN0OiB0aWxlIHdpdGggY29sc3BhbiAke3RpbGVDb2xzfSBpcyB3aWRlciB0aGFuIGAgK1xuICAgICAgICAgIGBncmlkIHdpdGggY29scz1cIiR7dGhpcy50cmFja2VyLmxlbmd0aH1cIi5gLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBTdGFydCBpbmRleCBpcyBpbmNsdXNpdmUsIGVuZCBpbmRleCBpcyBleGNsdXNpdmUuXG4gICAgbGV0IGdhcFN0YXJ0SW5kZXggPSAtMTtcbiAgICBsZXQgZ2FwRW5kSW5kZXggPSAtMTtcblxuICAgIC8vIExvb2sgZm9yIGEgZ2FwIGxhcmdlIGVub3VnaCB0byBmaXQgdGhlIGdpdmVuIHRpbGUuIEVtcHR5IHNwYWNlcyBhcmUgbWFya2VkIHdpdGggYSB6ZXJvLlxuICAgIGRvIHtcbiAgICAgIC8vIElmIHdlJ3ZlIHJlYWNoZWQgdGhlIGVuZCBvZiB0aGUgcm93LCBnbyB0byB0aGUgbmV4dCByb3cuXG4gICAgICBpZiAodGhpcy5jb2x1bW5JbmRleCArIHRpbGVDb2xzID4gdGhpcy50cmFja2VyLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9uZXh0Um93KCk7XG4gICAgICAgIGdhcFN0YXJ0SW5kZXggPSB0aGlzLnRyYWNrZXIuaW5kZXhPZigwLCB0aGlzLmNvbHVtbkluZGV4KTtcbiAgICAgICAgZ2FwRW5kSW5kZXggPSB0aGlzLl9maW5kR2FwRW5kSW5kZXgoZ2FwU3RhcnRJbmRleCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBnYXBTdGFydEluZGV4ID0gdGhpcy50cmFja2VyLmluZGV4T2YoMCwgdGhpcy5jb2x1bW5JbmRleCk7XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBtb3JlIGVtcHR5IHNwYWNlcyBpbiB0aGlzIHJvdyBhdCBhbGwsIG1vdmUgb24gdG8gdGhlIG5leHQgcm93LlxuICAgICAgaWYgKGdhcFN0YXJ0SW5kZXggPT0gLTEpIHtcbiAgICAgICAgdGhpcy5fbmV4dFJvdygpO1xuICAgICAgICBnYXBTdGFydEluZGV4ID0gdGhpcy50cmFja2VyLmluZGV4T2YoMCwgdGhpcy5jb2x1bW5JbmRleCk7XG4gICAgICAgIGdhcEVuZEluZGV4ID0gdGhpcy5fZmluZEdhcEVuZEluZGV4KGdhcFN0YXJ0SW5kZXgpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZ2FwRW5kSW5kZXggPSB0aGlzLl9maW5kR2FwRW5kSW5kZXgoZ2FwU3RhcnRJbmRleCk7XG5cbiAgICAgIC8vIElmIGEgZ2FwIGxhcmdlIGVub3VnaCBpc24ndCBmb3VuZCwgd2Ugd2FudCB0byBzdGFydCBsb29raW5nIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBjdXJyZW50XG4gICAgICAvLyBnYXAgb24gdGhlIG5leHQgaXRlcmF0aW9uLlxuICAgICAgdGhpcy5jb2x1bW5JbmRleCA9IGdhcFN0YXJ0SW5kZXggKyAxO1xuXG4gICAgICAvLyBDb250aW51ZSBpdGVyYXRpbmcgdW50aWwgd2UgZmluZCBhIGdhcCB3aWRlIGVub3VnaCBmb3IgdGhpcyB0aWxlLiBTaW5jZSBnYXBFbmRJbmRleCBpc1xuICAgICAgLy8gZXhjbHVzaXZlLCBnYXBFbmRJbmRleCBpcyAwIG1lYW5zIHdlIGRpZG4ndCBmaW5kIGEgZ2FwIGFuZCBzaG91bGQgY29udGludWUuXG4gICAgfSB3aGlsZSAoZ2FwRW5kSW5kZXggLSBnYXBTdGFydEluZGV4IDwgdGlsZUNvbHMgfHwgZ2FwRW5kSW5kZXggPT0gMCk7XG5cbiAgICAvLyBJZiB3ZSBzdGlsbCBkaWRuJ3QgbWFuYWdlIHRvIGZpbmQgYSBnYXAsIGVuc3VyZSB0aGF0IHRoZSBpbmRleCBpc1xuICAgIC8vIGF0IGxlYXN0IHplcm8gc28gdGhlIHRpbGUgZG9lc24ndCBnZXQgcHVsbGVkIG91dCBvZiB0aGUgZ3JpZC5cbiAgICByZXR1cm4gTWF0aC5tYXgoZ2FwU3RhcnRJbmRleCwgMCk7XG4gIH1cblxuICAvKiogTW92ZSBcImRvd25cIiB0byB0aGUgbmV4dCByb3cuICovXG4gIHByaXZhdGUgX25leHRSb3coKTogdm9pZCB7XG4gICAgdGhpcy5jb2x1bW5JbmRleCA9IDA7XG4gICAgdGhpcy5yb3dJbmRleCsrO1xuXG4gICAgLy8gRGVjcmVtZW50IGFsbCBzcGFjZXMgYnkgb25lIHRvIHJlZmxlY3QgbW92aW5nIGRvd24gb25lIHJvdy5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudHJhY2tlci5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy50cmFja2VyW2ldID0gTWF0aC5tYXgoMCwgdGhpcy50cmFja2VyW2ldIC0gMSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIHRoZSBlbmQgaW5kZXggKGV4Y2x1c2l2ZSkgb2YgYSBnYXAgZ2l2ZW4gdGhlIGluZGV4IGZyb20gd2hpY2ggdG8gc3RhcnQgbG9va2luZy5cbiAgICogVGhlIGdhcCBlbmRzIHdoZW4gYSBub24temVybyB2YWx1ZSBpcyBmb3VuZC5cbiAgICovXG4gIHByaXZhdGUgX2ZpbmRHYXBFbmRJbmRleChnYXBTdGFydEluZGV4OiBudW1iZXIpOiBudW1iZXIge1xuICAgIGZvciAobGV0IGkgPSBnYXBTdGFydEluZGV4ICsgMTsgaSA8IHRoaXMudHJhY2tlci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMudHJhY2tlcltpXSAhPSAwKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZSBnYXAgZW5kcyB3aXRoIHRoZSBlbmQgb2YgdGhlIHJvdy5cbiAgICByZXR1cm4gdGhpcy50cmFja2VyLmxlbmd0aDtcbiAgfVxuXG4gIC8qKiBVcGRhdGUgdGhlIHRpbGUgdHJhY2tlciB0byBhY2NvdW50IGZvciB0aGUgZ2l2ZW4gdGlsZSBpbiB0aGUgZ2l2ZW4gc3BhY2UuICovXG4gIHByaXZhdGUgX21hcmtUaWxlUG9zaXRpb24oc3RhcnQ6IG51bWJlciwgdGlsZTogVGlsZSk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZS5jb2xzcGFuOyBpKyspIHtcbiAgICAgIHRoaXMudHJhY2tlcltzdGFydCArIGldID0gdGlsZS5yb3dzcGFuO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNpbXBsZSBkYXRhIHN0cnVjdHVyZSBmb3IgdGlsZSBwb3NpdGlvbiAocm93LCBjb2wpLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgVGlsZVBvc2l0aW9uIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJvdzogbnVtYmVyLFxuICAgIHB1YmxpYyBjb2w6IG51bWJlcixcbiAgKSB7fVxufVxuIl19