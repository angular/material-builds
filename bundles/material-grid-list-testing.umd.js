(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/testing'), require('@angular/material/grid-list')) :
    typeof define === 'function' && define.amd ? define('@angular/material/grid-list/testing', ['exports', 'tslib', '@angular/cdk/testing', '@angular/material/grid-list'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.gridList = global.ng.material.gridList || {}, global.ng.material.gridList.testing = {}), global.tslib, global.ng.cdk.testing, global.ng.material.gridList));
}(this, (function (exports, tslib, testing, gridList) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Harness for interacting with a standard `MatGridTitle` in tests. */
    var MatGridTileHarness = /** @class */ (function (_super) {
        tslib.__extends(MatGridTileHarness, _super);
        function MatGridTileHarness() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._header = _this.locatorForOptional('.mat-grid-tile-header');
            _this._footer = _this.locatorForOptional('.mat-grid-tile-footer');
            _this._avatar = _this.locatorForOptional('.mat-grid-avatar');
            return _this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatGridTileHarness`
         * that meets certain criteria.
         * @param options Options for filtering which dialog instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatGridTileHarness.with = function (options) {
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatGridTileHarness, options)
                .addOption('headerText', options.headerText, function (harness, pattern) { return testing.HarnessPredicate.stringMatches(harness.getHeaderText(), pattern); })
                .addOption('footerText', options.footerText, function (harness, pattern) { return testing.HarnessPredicate.stringMatches(harness.getFooterText(), pattern); });
        };
        /** Gets the amount of rows that the grid-tile takes up. */
        MatGridTileHarness.prototype.getRowspan = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var _a;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = Number;
                            return [4 /*yield*/, this.host()];
                        case 1: return [4 /*yield*/, (_b.sent()).getAttribute('rowspan')];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Gets the amount of columns that the grid-tile takes up. */
        MatGridTileHarness.prototype.getColspan = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var _a;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = Number;
                            return [4 /*yield*/, this.host()];
                        case 1: return [4 /*yield*/, (_b.sent()).getAttribute('colspan')];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Whether the grid-tile has a header. */
        MatGridTileHarness.prototype.hasHeader = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._header()];
                        case 1: return [2 /*return*/, (_a.sent()) !== null];
                    }
                });
            });
        };
        /** Whether the grid-tile has a footer. */
        MatGridTileHarness.prototype.hasFooter = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._footer()];
                        case 1: return [2 /*return*/, (_a.sent()) !== null];
                    }
                });
            });
        };
        /** Whether the grid-tile has an avatar. */
        MatGridTileHarness.prototype.hasAvatar = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._avatar()];
                        case 1: return [2 /*return*/, (_a.sent()) !== null];
                    }
                });
            });
        };
        /** Gets the text of the header if present. */
        MatGridTileHarness.prototype.getHeaderText = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var headerEl;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._header()];
                        case 1:
                            headerEl = _a.sent();
                            return [2 /*return*/, headerEl ? headerEl.text() : null];
                    }
                });
            });
        };
        /** Gets the text of the footer if present. */
        MatGridTileHarness.prototype.getFooterText = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var headerEl;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._footer()];
                        case 1:
                            headerEl = _a.sent();
                            return [2 /*return*/, headerEl ? headerEl.text() : null];
                    }
                });
            });
        };
        /** The selector for the host element of a `MatGridTile` instance. */
        MatGridTileHarness.hostSelector = '.mat-grid-tile';
        return MatGridTileHarness;
    }(testing.ComponentHarness));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Harness for interacting with a standard `MatGridList` in tests. */
    var MatGridListHarness = /** @class */ (function (_super) {
        tslib.__extends(MatGridListHarness, _super);
        function MatGridListHarness() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * Tile coordinator that is used by the "MatGridList" for computing
             * positions of tiles. We leverage the coordinator to provide an API
             * for retrieving tiles based on visual tile positions.
             */
            _this._tileCoordinator = new gridList.ɵTileCoordinator();
            return _this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatGridListHarness`
         * that meets certain criteria.
         * @param options Options for filtering which dialog instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatGridListHarness.with = function (options) {
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatGridListHarness, options);
        };
        /** Gets all tiles of the grid-list. */
        MatGridListHarness.prototype.getTiles = function (filters) {
            if (filters === void 0) { filters = {}; }
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.locatorForAll(MatGridTileHarness.with(filters))()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /** Gets the amount of columns of the grid-list. */
        MatGridListHarness.prototype.getColumns = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var _a;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = Number;
                            return [4 /*yield*/, this.host()];
                        case 1: return [4 /*yield*/, (_b.sent()).getAttribute('cols')];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /**
         * Gets a tile of the grid-list that is located at the given location.
         * @param row Zero-based row index.
         * @param column Zero-based column index.
         */
        MatGridListHarness.prototype.getTileAtPosition = function (_a) {
            var row = _a.row, column = _a.column;
            return tslib.__awaiter(this, void 0, void 0, function () {
                var _b, tileHarnesses, columns, tileSpans, tiles, i, position, _c, rowspan, colspan;
                return tslib.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, Promise.all([this.getTiles(), this.getColumns()])];
                        case 1:
                            _b = tslib.__read.apply(void 0, [_d.sent(), 2]), tileHarnesses = _b[0], columns = _b[1];
                            tileSpans = tileHarnesses.map(function (t) { return Promise.all([t.getColspan(), t.getRowspan()]); });
                            return [4 /*yield*/, Promise.all(tileSpans)];
                        case 2:
                            tiles = (_d.sent()).map(function (_a) {
                                var _b = tslib.__read(_a, 2), colspan = _b[0], rowspan = _b[1];
                                return ({ colspan: colspan, rowspan: rowspan });
                            });
                            // Update the tile coordinator to reflect the current column amount and
                            // rendered tiles. We update upon every call of this method since we do not
                            // know if tiles have been added, removed or updated (in terms of rowspan/colspan).
                            this._tileCoordinator.update(columns, tiles);
                            // The tile coordinator respects the colspan and rowspan for calculating the positions
                            // of tiles, but it does not create multiple position entries if a tile spans over multiple
                            // columns or rows. We want to provide an API where developers can retrieve a tile based on
                            // any position that lies within the visual tile boundaries. For example: If a tile spans
                            // over two columns, then the same tile should be returned for either column indices.
                            for (i = 0; i < this._tileCoordinator.positions.length; i++) {
                                position = this._tileCoordinator.positions[i];
                                _c = tiles[i], rowspan = _c.rowspan, colspan = _c.colspan;
                                // Return the tile harness if the given position visually resolves to the tile.
                                if (column >= position.col && column <= position.col + colspan - 1 && row >= position.row &&
                                    row <= position.row + rowspan - 1) {
                                    return [2 /*return*/, tileHarnesses[i]];
                                }
                            }
                            throw Error('Could not find tile at given position.');
                    }
                });
            });
        };
        /** The selector for the host element of a `MatGridList` instance. */
        MatGridListHarness.hostSelector = '.mat-grid-list';
        return MatGridListHarness;
    }(testing.ComponentHarness));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    exports.MatGridListHarness = MatGridListHarness;
    exports.MatGridTileHarness = MatGridTileHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-grid-list-testing.umd.js.map
