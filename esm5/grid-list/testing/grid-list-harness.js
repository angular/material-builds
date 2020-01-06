/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator, __read } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { ɵTileCoordinator as TileCoordinator } from '@angular/material/grid-list';
import { MatGridTileHarness } from './grid-tile-harness';
/** Harness for interacting with a standard `MatGridList` in tests. */
var MatGridListHarness = /** @class */ (function (_super) {
    __extends(MatGridListHarness, _super);
    function MatGridListHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Tile coordinator that is used by the "MatGridList" for computing
         * positions of tiles. We leverage the coordinator to provide an API
         * for retrieving tiles based on visual tile positions.
         */
        _this._tileCoordinator = new TileCoordinator();
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
        return new HarnessPredicate(MatGridListHarness, options);
    };
    /** Gets all tiles of the grid-list. */
    MatGridListHarness.prototype.getTiles = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.locatorForAll(MatGridTileHarness.with(filters))()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /** Gets the amount of columns of the grid-list. */
    MatGridListHarness.prototype.getColumns = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _b, tileHarnesses, columns, tileSpans, tiles, i, position, _c, rowspan, colspan;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, Promise.all([this.getTiles(), this.getColumns()])];
                    case 1:
                        _b = __read.apply(void 0, [_d.sent(), 2]), tileHarnesses = _b[0], columns = _b[1];
                        tileSpans = tileHarnesses.map(function (t) { return Promise.all([t.getColspan(), t.getRowspan()]); });
                        return [4 /*yield*/, Promise.all(tileSpans)];
                    case 2:
                        tiles = (_d.sent()).map(function (_a) {
                            var _b = __read(_a, 2), colspan = _b[0], rowspan = _b[1];
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
}(ComponentHarness));
export { MatGridListHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZ3JpZC1saXN0L3Rlc3RpbmcvZ3JpZC1saXN0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxnQkFBZ0IsSUFBSSxlQUFlLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUVoRixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUV2RCxzRUFBc0U7QUFDdEU7SUFBd0Msc0NBQWdCO0lBQXhEO1FBQUEscUVBNkRDO1FBL0NDOzs7O1dBSUc7UUFDSyxzQkFBZ0IsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDOztJQTBDbkQsQ0FBQztJQXpEQzs7Ozs7T0FLRztJQUNJLHVCQUFJLEdBQVgsVUFBWSxPQUFvQztRQUFwQyx3QkFBQSxFQUFBLFlBQW9DO1FBQzlDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBU0QsdUNBQXVDO0lBQ2pDLHFDQUFRLEdBQWQsVUFBZSxPQUFvQztRQUFwQyx3QkFBQSxFQUFBLFlBQW9DOzs7OzRCQUMxQyxxQkFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUE7NEJBQW5FLHNCQUFPLFNBQTRELEVBQUM7Ozs7S0FDckU7SUFFRCxtREFBbUQ7SUFDN0MsdUNBQVUsR0FBaEI7Ozs7Ozt3QkFDUyxLQUFBLE1BQU0sQ0FBQTt3QkFBUSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXhCLHFCQUFNLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBQTs0QkFBNUQsc0JBQU8sa0JBQU8sU0FBOEMsRUFBQyxFQUFDOzs7O0tBQy9EO0lBRUQ7Ozs7T0FJRztJQUNHLDhDQUFpQixHQUF2QixVQUF3QixFQUE0QztZQUEzQyxZQUFHLEVBQUUsa0JBQU07Ozs7OzRCQUVELHFCQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBQTs7d0JBQWxGLEtBQUEsc0JBQTJCLFNBQXVELEtBQUEsRUFBakYsYUFBYSxRQUFBLEVBQUUsT0FBTyxRQUFBO3dCQUN2QixTQUFTLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBN0MsQ0FBNkMsQ0FBQyxDQUFDO3dCQUN6RSxxQkFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFBOzt3QkFBckMsS0FBSyxHQUFHLENBQUMsU0FBNEIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQWtCO2dDQUFsQixrQkFBa0IsRUFBakIsZUFBTyxFQUFFLGVBQU87NEJBQU0sT0FBQSxDQUFDLEVBQUMsT0FBTyxTQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUMsQ0FBQzt3QkFBcEIsQ0FBb0IsQ0FBQzt3QkFDOUYsdUVBQXVFO3dCQUN2RSwyRUFBMkU7d0JBQzNFLG1GQUFtRjt3QkFDbkYsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQzdDLHNGQUFzRjt3QkFDdEYsMkZBQTJGO3dCQUMzRiwyRkFBMkY7d0JBQzNGLHlGQUF5Rjt3QkFDekYscUZBQXFGO3dCQUNyRixLQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUN6RCxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDOUMsS0FBcUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUE1QixPQUFPLGFBQUEsRUFBRSxPQUFPLGFBQUEsQ0FBYTs0QkFDcEMsK0VBQStFOzRCQUMvRSxJQUFJLE1BQU0sSUFBSSxRQUFRLENBQUMsR0FBRyxJQUFJLE1BQU0sSUFBSSxRQUFRLENBQUMsR0FBRyxHQUFHLE9BQU8sR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxHQUFHO2dDQUNyRixHQUFHLElBQUksUUFBUSxDQUFDLEdBQUcsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFO2dDQUNyQyxzQkFBTyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUM7NkJBQ3pCO3lCQUNGO3dCQUNELE1BQU0sS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7Ozs7S0FDdkQ7SUEzREQscUVBQXFFO0lBQzlELCtCQUFZLEdBQUcsZ0JBQWdCLENBQUM7SUEyRHpDLHlCQUFDO0NBQUEsQUE3REQsQ0FBd0MsZ0JBQWdCLEdBNkR2RDtTQTdEWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge8m1VGlsZUNvb3JkaW5hdG9yIGFzIFRpbGVDb29yZGluYXRvcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZ3JpZC1saXN0JztcbmltcG9ydCB7R3JpZExpc3RIYXJuZXNzRmlsdGVycywgR3JpZFRpbGVIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9ncmlkLWxpc3QtaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7TWF0R3JpZFRpbGVIYXJuZXNzfSBmcm9tICcuL2dyaWQtdGlsZS1oYXJuZXNzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBgTWF0R3JpZExpc3RgIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEdyaWRMaXN0SGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdEdyaWRMaXN0YCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWdyaWQtbGlzdCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdEdyaWRMaXN0SGFybmVzc2BcbiAgICogdGhhdCBtZWV0cyBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggZGlhbG9nIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IEdyaWRMaXN0SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0R3JpZExpc3RIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEdyaWRMaXN0SGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVGlsZSBjb29yZGluYXRvciB0aGF0IGlzIHVzZWQgYnkgdGhlIFwiTWF0R3JpZExpc3RcIiBmb3IgY29tcHV0aW5nXG4gICAqIHBvc2l0aW9ucyBvZiB0aWxlcy4gV2UgbGV2ZXJhZ2UgdGhlIGNvb3JkaW5hdG9yIHRvIHByb3ZpZGUgYW4gQVBJXG4gICAqIGZvciByZXRyaWV2aW5nIHRpbGVzIGJhc2VkIG9uIHZpc3VhbCB0aWxlIHBvc2l0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgX3RpbGVDb29yZGluYXRvciA9IG5ldyBUaWxlQ29vcmRpbmF0b3IoKTtcblxuICAvKiogR2V0cyBhbGwgdGlsZXMgb2YgdGhlIGdyaWQtbGlzdC4gKi9cbiAgYXN5bmMgZ2V0VGlsZXMoZmlsdGVyczogR3JpZFRpbGVIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRHcmlkVGlsZUhhcm5lc3NbXT4ge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0R3JpZFRpbGVIYXJuZXNzLndpdGgoZmlsdGVycykpKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYW1vdW50IG9mIGNvbHVtbnMgb2YgdGhlIGdyaWQtbGlzdC4gKi9cbiAgYXN5bmMgZ2V0Q29sdW1ucygpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBOdW1iZXIoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2NvbHMnKSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHRpbGUgb2YgdGhlIGdyaWQtbGlzdCB0aGF0IGlzIGxvY2F0ZWQgYXQgdGhlIGdpdmVuIGxvY2F0aW9uLlxuICAgKiBAcGFyYW0gcm93IFplcm8tYmFzZWQgcm93IGluZGV4LlxuICAgKiBAcGFyYW0gY29sdW1uIFplcm8tYmFzZWQgY29sdW1uIGluZGV4LlxuICAgKi9cbiAgYXN5bmMgZ2V0VGlsZUF0UG9zaXRpb24oe3JvdywgY29sdW1ufToge3JvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlcn0pOlxuICAgICAgUHJvbWlzZTxNYXRHcmlkVGlsZUhhcm5lc3M+IHtcbiAgICBjb25zdCBbdGlsZUhhcm5lc3NlcywgY29sdW1uc10gPSBhd2FpdCBQcm9taXNlLmFsbChbdGhpcy5nZXRUaWxlcygpLCB0aGlzLmdldENvbHVtbnMoKV0pO1xuICAgIGNvbnN0IHRpbGVTcGFucyA9IHRpbGVIYXJuZXNzZXMubWFwKHQgPT4gUHJvbWlzZS5hbGwoW3QuZ2V0Q29sc3BhbigpLCB0LmdldFJvd3NwYW4oKV0pKTtcbiAgICBjb25zdCB0aWxlcyA9IChhd2FpdCBQcm9taXNlLmFsbCh0aWxlU3BhbnMpKS5tYXAoKFtjb2xzcGFuLCByb3dzcGFuXSkgPT4gKHtjb2xzcGFuLCByb3dzcGFufSkpO1xuICAgIC8vIFVwZGF0ZSB0aGUgdGlsZSBjb29yZGluYXRvciB0byByZWZsZWN0IHRoZSBjdXJyZW50IGNvbHVtbiBhbW91bnQgYW5kXG4gICAgLy8gcmVuZGVyZWQgdGlsZXMuIFdlIHVwZGF0ZSB1cG9uIGV2ZXJ5IGNhbGwgb2YgdGhpcyBtZXRob2Qgc2luY2Ugd2UgZG8gbm90XG4gICAgLy8ga25vdyBpZiB0aWxlcyBoYXZlIGJlZW4gYWRkZWQsIHJlbW92ZWQgb3IgdXBkYXRlZCAoaW4gdGVybXMgb2Ygcm93c3Bhbi9jb2xzcGFuKS5cbiAgICB0aGlzLl90aWxlQ29vcmRpbmF0b3IudXBkYXRlKGNvbHVtbnMsIHRpbGVzKTtcbiAgICAvLyBUaGUgdGlsZSBjb29yZGluYXRvciByZXNwZWN0cyB0aGUgY29sc3BhbiBhbmQgcm93c3BhbiBmb3IgY2FsY3VsYXRpbmcgdGhlIHBvc2l0aW9uc1xuICAgIC8vIG9mIHRpbGVzLCBidXQgaXQgZG9lcyBub3QgY3JlYXRlIG11bHRpcGxlIHBvc2l0aW9uIGVudHJpZXMgaWYgYSB0aWxlIHNwYW5zIG92ZXIgbXVsdGlwbGVcbiAgICAvLyBjb2x1bW5zIG9yIHJvd3MuIFdlIHdhbnQgdG8gcHJvdmlkZSBhbiBBUEkgd2hlcmUgZGV2ZWxvcGVycyBjYW4gcmV0cmlldmUgYSB0aWxlIGJhc2VkIG9uXG4gICAgLy8gYW55IHBvc2l0aW9uIHRoYXQgbGllcyB3aXRoaW4gdGhlIHZpc3VhbCB0aWxlIGJvdW5kYXJpZXMuIEZvciBleGFtcGxlOiBJZiBhIHRpbGUgc3BhbnNcbiAgICAvLyBvdmVyIHR3byBjb2x1bW5zLCB0aGVuIHRoZSBzYW1lIHRpbGUgc2hvdWxkIGJlIHJldHVybmVkIGZvciBlaXRoZXIgY29sdW1uIGluZGljZXMuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90aWxlQ29vcmRpbmF0b3IucG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuX3RpbGVDb29yZGluYXRvci5wb3NpdGlvbnNbaV07XG4gICAgICBjb25zdCB7cm93c3BhbiwgY29sc3Bhbn0gPSB0aWxlc1tpXTtcbiAgICAgIC8vIFJldHVybiB0aGUgdGlsZSBoYXJuZXNzIGlmIHRoZSBnaXZlbiBwb3NpdGlvbiB2aXN1YWxseSByZXNvbHZlcyB0byB0aGUgdGlsZS5cbiAgICAgIGlmIChjb2x1bW4gPj0gcG9zaXRpb24uY29sICYmIGNvbHVtbiA8PSBwb3NpdGlvbi5jb2wgKyBjb2xzcGFuIC0gMSAmJiByb3cgPj0gcG9zaXRpb24ucm93ICYmXG4gICAgICAgICAgcm93IDw9IHBvc2l0aW9uLnJvdyArIHJvd3NwYW4gLSAxKSB7XG4gICAgICAgIHJldHVybiB0aWxlSGFybmVzc2VzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBFcnJvcignQ291bGQgbm90IGZpbmQgdGlsZSBhdCBnaXZlbiBwb3NpdGlvbi4nKTtcbiAgfVxufVxuIl19