/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { ɵTileCoordinator as TileCoordinator } from '@angular/material/grid-list';
import { MatGridTileHarness } from './grid-tile-harness';
/** Harness for interacting with a standard `MatGridList` in tests. */
class MatGridListHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        /**
         * Tile coordinator that is used by the "MatGridList" for computing
         * positions of tiles. We leverage the coordinator to provide an API
         * for retrieving tiles based on visual tile positions.
         */
        this._tileCoordinator = new TileCoordinator();
    }
    /** The selector for the host element of a `MatGridList` instance. */
    static { this.hostSelector = '.mat-grid-list'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatGridListHarness`
     * that meets certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatGridListHarness, options);
    }
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
export { MatGridListHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZ3JpZC1saXN0L3Rlc3RpbmcvZ3JpZC1saXN0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2xGLE9BQU8sRUFBQyxnQkFBZ0IsSUFBSSxlQUFlLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUVoRixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUV2RCxzRUFBc0U7QUFDdEUsTUFBYSxrQkFBbUIsU0FBUSxnQkFBZ0I7SUFBeEQ7O1FBY0U7Ozs7V0FJRztRQUNLLHFCQUFnQixHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7SUFzRG5ELENBQUM7SUF4RUMscUVBQXFFO2FBQzlELGlCQUFZLEdBQUcsZ0JBQWdCLEFBQW5CLENBQW9CO0lBRXZDOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFrQyxFQUFFO1FBQzlDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBU0QsdUNBQXVDO0lBQ3ZDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBa0MsRUFBRTtRQUNqRCxPQUFPLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ3RFLENBQUM7SUFFRCxtREFBbUQ7SUFDbkQsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUN0QixHQUFHLEVBQ0gsTUFBTSxHQUlQO1FBQ0MsTUFBTSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsR0FBRyxNQUFNLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVGLE1BQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNGLE1BQU0sS0FBSyxHQUFHLENBQUMsTUFBTSxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMzRSxPQUFPO1lBQ1AsT0FBTztTQUNSLENBQUMsQ0FBQyxDQUFDO1FBQ0osdUVBQXVFO1FBQ3ZFLDJFQUEyRTtRQUMzRSxtRkFBbUY7UUFDbkYsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0Msc0ZBQXNGO1FBQ3RGLDJGQUEyRjtRQUMzRiwyRkFBMkY7UUFDM0YseUZBQXlGO1FBQ3pGLHFGQUFxRjtRQUNyRixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRCxNQUFNLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQywrRUFBK0U7WUFDL0UsSUFDRSxNQUFNLElBQUksUUFBUSxDQUFDLEdBQUc7Z0JBQ3RCLE1BQU0sSUFBSSxRQUFRLENBQUMsR0FBRyxHQUFHLE9BQU8sR0FBRyxDQUFDO2dCQUNwQyxHQUFHLElBQUksUUFBUSxDQUFDLEdBQUc7Z0JBQ25CLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxHQUFHLE9BQU8sR0FBRyxDQUFDLEVBQ2pDO2dCQUNBLE9BQU8sYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pCO1NBQ0Y7UUFDRCxNQUFNLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0lBQ3hELENBQUM7O1NBeEVVLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGUsIHBhcmFsbGVsfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge8m1VGlsZUNvb3JkaW5hdG9yIGFzIFRpbGVDb29yZGluYXRvcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZ3JpZC1saXN0JztcbmltcG9ydCB7R3JpZExpc3RIYXJuZXNzRmlsdGVycywgR3JpZFRpbGVIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9ncmlkLWxpc3QtaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7TWF0R3JpZFRpbGVIYXJuZXNzfSBmcm9tICcuL2dyaWQtdGlsZS1oYXJuZXNzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBgTWF0R3JpZExpc3RgIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEdyaWRMaXN0SGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdEdyaWRMaXN0YCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWdyaWQtbGlzdCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdEdyaWRMaXN0SGFybmVzc2BcbiAgICogdGhhdCBtZWV0cyBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggZGlhbG9nIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IEdyaWRMaXN0SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0R3JpZExpc3RIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEdyaWRMaXN0SGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVGlsZSBjb29yZGluYXRvciB0aGF0IGlzIHVzZWQgYnkgdGhlIFwiTWF0R3JpZExpc3RcIiBmb3IgY29tcHV0aW5nXG4gICAqIHBvc2l0aW9ucyBvZiB0aWxlcy4gV2UgbGV2ZXJhZ2UgdGhlIGNvb3JkaW5hdG9yIHRvIHByb3ZpZGUgYW4gQVBJXG4gICAqIGZvciByZXRyaWV2aW5nIHRpbGVzIGJhc2VkIG9uIHZpc3VhbCB0aWxlIHBvc2l0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgX3RpbGVDb29yZGluYXRvciA9IG5ldyBUaWxlQ29vcmRpbmF0b3IoKTtcblxuICAvKiogR2V0cyBhbGwgdGlsZXMgb2YgdGhlIGdyaWQtbGlzdC4gKi9cbiAgYXN5bmMgZ2V0VGlsZXMoZmlsdGVyczogR3JpZFRpbGVIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRHcmlkVGlsZUhhcm5lc3NbXT4ge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0R3JpZFRpbGVIYXJuZXNzLndpdGgoZmlsdGVycykpKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYW1vdW50IG9mIGNvbHVtbnMgb2YgdGhlIGdyaWQtbGlzdC4gKi9cbiAgYXN5bmMgZ2V0Q29sdW1ucygpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBOdW1iZXIoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2NvbHMnKSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHRpbGUgb2YgdGhlIGdyaWQtbGlzdCB0aGF0IGlzIGxvY2F0ZWQgYXQgdGhlIGdpdmVuIGxvY2F0aW9uLlxuICAgKiBAcGFyYW0gcm93IFplcm8tYmFzZWQgcm93IGluZGV4LlxuICAgKiBAcGFyYW0gY29sdW1uIFplcm8tYmFzZWQgY29sdW1uIGluZGV4LlxuICAgKi9cbiAgYXN5bmMgZ2V0VGlsZUF0UG9zaXRpb24oe1xuICAgIHJvdyxcbiAgICBjb2x1bW4sXG4gIH06IHtcbiAgICByb3c6IG51bWJlcjtcbiAgICBjb2x1bW46IG51bWJlcjtcbiAgfSk6IFByb21pc2U8TWF0R3JpZFRpbGVIYXJuZXNzPiB7XG4gICAgY29uc3QgW3RpbGVIYXJuZXNzZXMsIGNvbHVtbnNdID0gYXdhaXQgcGFyYWxsZWwoKCkgPT4gW3RoaXMuZ2V0VGlsZXMoKSwgdGhpcy5nZXRDb2x1bW5zKCldKTtcbiAgICBjb25zdCB0aWxlU3BhbnMgPSB0aWxlSGFybmVzc2VzLm1hcCh0ID0+IHBhcmFsbGVsKCgpID0+IFt0LmdldENvbHNwYW4oKSwgdC5nZXRSb3dzcGFuKCldKSk7XG4gICAgY29uc3QgdGlsZXMgPSAoYXdhaXQgcGFyYWxsZWwoKCkgPT4gdGlsZVNwYW5zKSkubWFwKChbY29sc3Bhbiwgcm93c3Bhbl0pID0+ICh7XG4gICAgICBjb2xzcGFuLFxuICAgICAgcm93c3BhbixcbiAgICB9KSk7XG4gICAgLy8gVXBkYXRlIHRoZSB0aWxlIGNvb3JkaW5hdG9yIHRvIHJlZmxlY3QgdGhlIGN1cnJlbnQgY29sdW1uIGFtb3VudCBhbmRcbiAgICAvLyByZW5kZXJlZCB0aWxlcy4gV2UgdXBkYXRlIHVwb24gZXZlcnkgY2FsbCBvZiB0aGlzIG1ldGhvZCBzaW5jZSB3ZSBkbyBub3RcbiAgICAvLyBrbm93IGlmIHRpbGVzIGhhdmUgYmVlbiBhZGRlZCwgcmVtb3ZlZCBvciB1cGRhdGVkIChpbiB0ZXJtcyBvZiByb3dzcGFuL2NvbHNwYW4pLlxuICAgIHRoaXMuX3RpbGVDb29yZGluYXRvci51cGRhdGUoY29sdW1ucywgdGlsZXMpO1xuICAgIC8vIFRoZSB0aWxlIGNvb3JkaW5hdG9yIHJlc3BlY3RzIHRoZSBjb2xzcGFuIGFuZCByb3dzcGFuIGZvciBjYWxjdWxhdGluZyB0aGUgcG9zaXRpb25zXG4gICAgLy8gb2YgdGlsZXMsIGJ1dCBpdCBkb2VzIG5vdCBjcmVhdGUgbXVsdGlwbGUgcG9zaXRpb24gZW50cmllcyBpZiBhIHRpbGUgc3BhbnMgb3ZlciBtdWx0aXBsZVxuICAgIC8vIGNvbHVtbnMgb3Igcm93cy4gV2Ugd2FudCB0byBwcm92aWRlIGFuIEFQSSB3aGVyZSBkZXZlbG9wZXJzIGNhbiByZXRyaWV2ZSBhIHRpbGUgYmFzZWQgb25cbiAgICAvLyBhbnkgcG9zaXRpb24gdGhhdCBsaWVzIHdpdGhpbiB0aGUgdmlzdWFsIHRpbGUgYm91bmRhcmllcy4gRm9yIGV4YW1wbGU6IElmIGEgdGlsZSBzcGFuc1xuICAgIC8vIG92ZXIgdHdvIGNvbHVtbnMsIHRoZW4gdGhlIHNhbWUgdGlsZSBzaG91bGQgYmUgcmV0dXJuZWQgZm9yIGVpdGhlciBjb2x1bW4gaW5kaWNlcy5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RpbGVDb29yZGluYXRvci5wb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5fdGlsZUNvb3JkaW5hdG9yLnBvc2l0aW9uc1tpXTtcbiAgICAgIGNvbnN0IHtyb3dzcGFuLCBjb2xzcGFufSA9IHRpbGVzW2ldO1xuICAgICAgLy8gUmV0dXJuIHRoZSB0aWxlIGhhcm5lc3MgaWYgdGhlIGdpdmVuIHBvc2l0aW9uIHZpc3VhbGx5IHJlc29sdmVzIHRvIHRoZSB0aWxlLlxuICAgICAgaWYgKFxuICAgICAgICBjb2x1bW4gPj0gcG9zaXRpb24uY29sICYmXG4gICAgICAgIGNvbHVtbiA8PSBwb3NpdGlvbi5jb2wgKyBjb2xzcGFuIC0gMSAmJlxuICAgICAgICByb3cgPj0gcG9zaXRpb24ucm93ICYmXG4gICAgICAgIHJvdyA8PSBwb3NpdGlvbi5yb3cgKyByb3dzcGFuIC0gMVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB0aWxlSGFybmVzc2VzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBFcnJvcignQ291bGQgbm90IGZpbmQgdGlsZSBhdCBnaXZlbiBwb3NpdGlvbi4nKTtcbiAgfVxufVxuIl19