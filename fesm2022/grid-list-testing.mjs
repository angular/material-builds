import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness, parallel } from '@angular/cdk/testing';
import { ɵTileCoordinator as _TileCoordinator } from './_public-api-chunk.mjs';

var MatGridTileSection;
(function (MatGridTileSection) {
  MatGridTileSection["HEADER"] = ".mat-grid-tile-header";
  MatGridTileSection["FOOTER"] = ".mat-grid-tile-footer";
})(MatGridTileSection || (MatGridTileSection = {}));
class MatGridTileHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-grid-tile';
  static with(options = {}) {
    return new HarnessPredicate(MatGridTileHarness, options).addOption('headerText', options.headerText, (harness, pattern) => HarnessPredicate.stringMatches(harness.getHeaderText(), pattern)).addOption('footerText', options.footerText, (harness, pattern) => HarnessPredicate.stringMatches(harness.getFooterText(), pattern));
  }
  _header = this.locatorForOptional(MatGridTileSection.HEADER);
  _footer = this.locatorForOptional(MatGridTileSection.FOOTER);
  _avatar = this.locatorForOptional('.mat-grid-avatar');
  async getRowspan() {
    return Number(await (await this.host()).getAttribute('rowspan'));
  }
  async getColspan() {
    return Number(await (await this.host()).getAttribute('colspan'));
  }
  async hasHeader() {
    return (await this._header()) !== null;
  }
  async hasFooter() {
    return (await this._footer()) !== null;
  }
  async hasAvatar() {
    return (await this._avatar()) !== null;
  }
  async getHeaderText() {
    const headerEl = await this._header();
    return headerEl ? headerEl.text() : null;
  }
  async getFooterText() {
    const headerEl = await this._footer();
    return headerEl ? headerEl.text() : null;
  }
}

class MatGridListHarness extends ComponentHarness {
  static hostSelector = '.mat-grid-list';
  static with(options = {}) {
    return new HarnessPredicate(MatGridListHarness, options);
  }
  _tileCoordinator = new _TileCoordinator();
  async getTiles(filters = {}) {
    return await this.locatorForAll(MatGridTileHarness.with(filters))();
  }
  async getColumns() {
    return Number(await (await this.host()).getAttribute('cols'));
  }
  async getTileAtPosition({
    row,
    column
  }) {
    const [tileHarnesses, columns] = await parallel(() => [this.getTiles(), this.getColumns()]);
    const tileSpans = tileHarnesses.map(t => parallel(() => [t.getColspan(), t.getRowspan()]));
    const tiles = (await parallel(() => tileSpans)).map(([colspan, rowspan]) => ({
      colspan,
      rowspan
    }));
    this._tileCoordinator.update(columns, tiles);
    for (let i = 0; i < this._tileCoordinator.positions.length; i++) {
      const position = this._tileCoordinator.positions[i];
      const {
        rowspan,
        colspan
      } = tiles[i];
      if (column >= position.col && column <= position.col + colspan - 1 && row >= position.row && row <= position.row + rowspan - 1) {
        return tileHarnesses[i];
      }
    }
    throw Error('Could not find tile at given position.');
  }
}

export { MatGridListHarness, MatGridTileHarness, MatGridTileSection };
//# sourceMappingURL=grid-list-testing.mjs.map
