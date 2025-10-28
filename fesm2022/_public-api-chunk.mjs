class TileCoordinator {
  tracker;
  columnIndex = 0;
  rowIndex = 0;
  get rowCount() {
    return this.rowIndex + 1;
  }
  get rowspan() {
    const lastRowMax = Math.max(...this.tracker);
    return lastRowMax > 1 ? this.rowCount + lastRowMax - 1 : this.rowCount;
  }
  positions;
  update(numColumns, tiles) {
    this.columnIndex = 0;
    this.rowIndex = 0;
    this.tracker = new Array(numColumns);
    this.tracker.fill(0, 0, this.tracker.length);
    this.positions = tiles.map(tile => this._trackTile(tile));
  }
  _trackTile(tile) {
    const gapStartIndex = this._findMatchingGap(tile.colspan);
    this._markTilePosition(gapStartIndex, tile);
    this.columnIndex = gapStartIndex + tile.colspan;
    return new TilePosition(this.rowIndex, gapStartIndex);
  }
  _findMatchingGap(tileCols) {
    if (tileCols > this.tracker.length && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error(`mat-grid-list: tile with colspan ${tileCols} is wider than ` + `grid with cols="${this.tracker.length}".`);
    }
    let gapStartIndex = -1;
    let gapEndIndex = -1;
    do {
      if (this.columnIndex + tileCols > this.tracker.length) {
        this._nextRow();
        gapStartIndex = this.tracker.indexOf(0, this.columnIndex);
        gapEndIndex = this._findGapEndIndex(gapStartIndex);
        continue;
      }
      gapStartIndex = this.tracker.indexOf(0, this.columnIndex);
      if (gapStartIndex == -1) {
        this._nextRow();
        gapStartIndex = this.tracker.indexOf(0, this.columnIndex);
        gapEndIndex = this._findGapEndIndex(gapStartIndex);
        continue;
      }
      gapEndIndex = this._findGapEndIndex(gapStartIndex);
      this.columnIndex = gapStartIndex + 1;
    } while (gapEndIndex - gapStartIndex < tileCols || gapEndIndex == 0);
    return Math.max(gapStartIndex, 0);
  }
  _nextRow() {
    this.columnIndex = 0;
    this.rowIndex++;
    for (let i = 0; i < this.tracker.length; i++) {
      this.tracker[i] = Math.max(0, this.tracker[i] - 1);
    }
  }
  _findGapEndIndex(gapStartIndex) {
    for (let i = gapStartIndex + 1; i < this.tracker.length; i++) {
      if (this.tracker[i] != 0) {
        return i;
      }
    }
    return this.tracker.length;
  }
  _markTilePosition(start, tile) {
    for (let i = 0; i < tile.colspan; i++) {
      this.tracker[start + i] = tile.rowspan;
    }
  }
}
class TilePosition {
  row;
  col;
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }
}

const ɵTileCoordinator = TileCoordinator;

export { TileCoordinator, ɵTileCoordinator };
//# sourceMappingURL=_public-api-chunk.mjs.map
