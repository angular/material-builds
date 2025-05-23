import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness, parallel } from '@angular/cdk/testing';
import { ɵ as _TileCoordinator } from '../public-api-BoO5eSq-.mjs';

/** Selectors for the various `mat-grid-tile` sections that may contain user content. */
var MatGridTileSection;
(function (MatGridTileSection) {
    MatGridTileSection["HEADER"] = ".mat-grid-tile-header";
    MatGridTileSection["FOOTER"] = ".mat-grid-tile-footer";
})(MatGridTileSection || (MatGridTileSection = {}));
/** Harness for interacting with a standard `MatGridTitle` in tests. */
class MatGridTileHarness extends ContentContainerComponentHarness {
    /** The selector for the host element of a `MatGridTile` instance. */
    static hostSelector = '.mat-grid-tile';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatGridTileHarness`
     * that meets certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatGridTileHarness, options)
            .addOption('headerText', options.headerText, (harness, pattern) => HarnessPredicate.stringMatches(harness.getHeaderText(), pattern))
            .addOption('footerText', options.footerText, (harness, pattern) => HarnessPredicate.stringMatches(harness.getFooterText(), pattern));
    }
    _header = this.locatorForOptional(MatGridTileSection.HEADER);
    _footer = this.locatorForOptional(MatGridTileSection.FOOTER);
    _avatar = this.locatorForOptional('.mat-grid-avatar');
    /** Gets the amount of rows that the grid-tile takes up. */
    async getRowspan() {
        return Number(await (await this.host()).getAttribute('rowspan'));
    }
    /** Gets the amount of columns that the grid-tile takes up. */
    async getColspan() {
        return Number(await (await this.host()).getAttribute('colspan'));
    }
    /** Whether the grid-tile has a header. */
    async hasHeader() {
        return (await this._header()) !== null;
    }
    /** Whether the grid-tile has a footer. */
    async hasFooter() {
        return (await this._footer()) !== null;
    }
    /** Whether the grid-tile has an avatar. */
    async hasAvatar() {
        return (await this._avatar()) !== null;
    }
    /** Gets the text of the header if present. */
    async getHeaderText() {
        // For performance reasons, we do not use "hasHeader" as
        // we would then need to query twice for the header.
        const headerEl = await this._header();
        return headerEl ? headerEl.text() : null;
    }
    /** Gets the text of the footer if present. */
    async getFooterText() {
        // For performance reasons, we do not use "hasFooter" as
        // we would then need to query twice for the footer.
        const headerEl = await this._footer();
        return headerEl ? headerEl.text() : null;
    }
}

/** Harness for interacting with a standard `MatGridList` in tests. */
class MatGridListHarness extends ComponentHarness {
    /** The selector for the host element of a `MatGridList` instance. */
    static hostSelector = '.mat-grid-list';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatGridListHarness`
     * that meets certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatGridListHarness, options);
    }
    /**
     * Tile coordinator that is used by the "MatGridList" for computing
     * positions of tiles. We leverage the coordinator to provide an API
     * for retrieving tiles based on visual tile positions.
     */
    _tileCoordinator = new _TileCoordinator();
    /** Gets all tiles of the grid-list. */
    async getTiles(filters = {}) {
        return await this.locatorForAll(MatGridTileHarness.with(filters))();
    }
    /** Gets the amount of columns of the grid-list. */
    async getColumns() {
        return Number(await (await this.host()).getAttribute('cols'));
    }
    /**
     * Gets a tile of the grid-list that is located at the given location.
     * @param row Zero-based row index.
     * @param column Zero-based column index.
     */
    async getTileAtPosition({ row, column, }) {
        const [tileHarnesses, columns] = await parallel(() => [this.getTiles(), this.getColumns()]);
        const tileSpans = tileHarnesses.map(t => parallel(() => [t.getColspan(), t.getRowspan()]));
        const tiles = (await parallel(() => tileSpans)).map(([colspan, rowspan]) => ({
            colspan,
            rowspan,
        }));
        // Update the tile coordinator to reflect the current column amount and
        // rendered tiles. We update upon every call of this method since we do not
        // know if tiles have been added, removed or updated (in terms of rowspan/colspan).
        this._tileCoordinator.update(columns, tiles);
        // The tile coordinator respects the colspan and rowspan for calculating the positions
        // of tiles, but it does not create multiple position entries if a tile spans over multiple
        // columns or rows. We want to provide an API where developers can retrieve a tile based on
        // any position that lies within the visual tile boundaries. For example: If a tile spans
        // over two columns, then the same tile should be returned for either column indices.
        for (let i = 0; i < this._tileCoordinator.positions.length; i++) {
            const position = this._tileCoordinator.positions[i];
            const { rowspan, colspan } = tiles[i];
            // Return the tile harness if the given position visually resolves to the tile.
            if (column >= position.col &&
                column <= position.col + colspan - 1 &&
                row >= position.row &&
                row <= position.row + rowspan - 1) {
                return tileHarnesses[i];
            }
        }
        throw Error('Could not find tile at given position.');
    }
}

export { MatGridListHarness, MatGridTileHarness, MatGridTileSection };
//# sourceMappingURL=testing.mjs.map
