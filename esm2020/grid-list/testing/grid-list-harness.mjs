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
export class MatGridListHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        /**
         * Tile coordinator that is used by the "MatGridList" for computing
         * positions of tiles. We leverage the coordinator to provide an API
         * for retrieving tiles based on visual tile positions.
         */
        this._tileCoordinator = new TileCoordinator();
    }
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
    async getTileAtPosition({ row, column }) {
        const [tileHarnesses, columns] = await parallel(() => [this.getTiles(), this.getColumns()]);
        const tileSpans = tileHarnesses.map(t => parallel(() => [t.getColspan(), t.getRowspan()]));
        const tiles = (await parallel(() => tileSpans))
            .map(([colspan, rowspan]) => ({ colspan, rowspan }));
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
            if (column >= position.col && column <= position.col + colspan - 1 && row >= position.row &&
                row <= position.row + rowspan - 1) {
                return tileHarnesses[i];
            }
        }
        throw Error('Could not find tile at given position.');
    }
}
/** The selector for the host element of a `MatGridList` instance. */
MatGridListHarness.hostSelector = '.mat-grid-list';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZ3JpZC1saXN0L3Rlc3RpbmcvZ3JpZC1saXN0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2xGLE9BQU8sRUFBQyxnQkFBZ0IsSUFBSSxlQUFlLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUVoRixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUV2RCxzRUFBc0U7QUFDdEUsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGdCQUFnQjtJQUF4RDs7UUFjRTs7OztXQUlHO1FBQ0sscUJBQWdCLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztJQTJDbkQsQ0FBQztJQTFEQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBa0MsRUFBRTtRQUM5QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQVNELHVDQUF1QztJQUN2QyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQWtDLEVBQUU7UUFDakQsT0FBTyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN0RSxDQUFDO0lBRUQsbURBQW1EO0lBQ25ELEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFnQztRQUVsRSxNQUFNLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUYsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0YsTUFBTSxLQUFLLEdBQUcsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUMxQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsdUVBQXVFO1FBQ3ZFLDJFQUEyRTtRQUMzRSxtRkFBbUY7UUFDbkYsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0Msc0ZBQXNGO1FBQ3RGLDJGQUEyRjtRQUMzRiwyRkFBMkY7UUFDM0YseUZBQXlGO1FBQ3pGLHFGQUFxRjtRQUNyRixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRCxNQUFNLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQywrRUFBK0U7WUFDL0UsSUFBSSxNQUFNLElBQUksUUFBUSxDQUFDLEdBQUcsSUFBSSxNQUFNLElBQUksUUFBUSxDQUFDLEdBQUcsR0FBRyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRztnQkFDckYsR0FBRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRTtnQkFDckMsT0FBTyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekI7U0FDRjtRQUNELE1BQU0sS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7SUFDeEQsQ0FBQzs7QUE1REQscUVBQXFFO0FBQzlELCtCQUFZLEdBQUcsZ0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBwYXJhbGxlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHvJtVRpbGVDb29yZGluYXRvciBhcyBUaWxlQ29vcmRpbmF0b3J9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2dyaWQtbGlzdCc7XG5pbXBvcnQge0dyaWRMaXN0SGFybmVzc0ZpbHRlcnMsIEdyaWRUaWxlSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vZ3JpZC1saXN0LWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge01hdEdyaWRUaWxlSGFybmVzc30gZnJvbSAnLi9ncmlkLXRpbGUtaGFybmVzcyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgYE1hdEdyaWRMaXN0YCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRHcmlkTGlzdEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRHcmlkTGlzdGAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1ncmlkLWxpc3QnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRHcmlkTGlzdEhhcm5lc3NgXG4gICAqIHRoYXQgbWVldHMgY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGRpYWxvZyBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBHcmlkTGlzdEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEdyaWRMaXN0SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRHcmlkTGlzdEhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRpbGUgY29vcmRpbmF0b3IgdGhhdCBpcyB1c2VkIGJ5IHRoZSBcIk1hdEdyaWRMaXN0XCIgZm9yIGNvbXB1dGluZ1xuICAgKiBwb3NpdGlvbnMgb2YgdGlsZXMuIFdlIGxldmVyYWdlIHRoZSBjb29yZGluYXRvciB0byBwcm92aWRlIGFuIEFQSVxuICAgKiBmb3IgcmV0cmlldmluZyB0aWxlcyBiYXNlZCBvbiB2aXN1YWwgdGlsZSBwb3NpdGlvbnMuXG4gICAqL1xuICBwcml2YXRlIF90aWxlQ29vcmRpbmF0b3IgPSBuZXcgVGlsZUNvb3JkaW5hdG9yKCk7XG5cbiAgLyoqIEdldHMgYWxsIHRpbGVzIG9mIHRoZSBncmlkLWxpc3QuICovXG4gIGFzeW5jIGdldFRpbGVzKGZpbHRlcnM6IEdyaWRUaWxlSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0R3JpZFRpbGVIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5sb2NhdG9yRm9yQWxsKE1hdEdyaWRUaWxlSGFybmVzcy53aXRoKGZpbHRlcnMpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGFtb3VudCBvZiBjb2x1bW5zIG9mIHRoZSBncmlkLWxpc3QuICovXG4gIGFzeW5jIGdldENvbHVtbnMoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gTnVtYmVyKGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdjb2xzJykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSB0aWxlIG9mIHRoZSBncmlkLWxpc3QgdGhhdCBpcyBsb2NhdGVkIGF0IHRoZSBnaXZlbiBsb2NhdGlvbi5cbiAgICogQHBhcmFtIHJvdyBaZXJvLWJhc2VkIHJvdyBpbmRleC5cbiAgICogQHBhcmFtIGNvbHVtbiBaZXJvLWJhc2VkIGNvbHVtbiBpbmRleC5cbiAgICovXG4gIGFzeW5jIGdldFRpbGVBdFBvc2l0aW9uKHtyb3csIGNvbHVtbn06IHtyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9KTpcbiAgICAgIFByb21pc2U8TWF0R3JpZFRpbGVIYXJuZXNzPiB7XG4gICAgY29uc3QgW3RpbGVIYXJuZXNzZXMsIGNvbHVtbnNdID0gYXdhaXQgcGFyYWxsZWwoKCkgPT4gW3RoaXMuZ2V0VGlsZXMoKSwgdGhpcy5nZXRDb2x1bW5zKCldKTtcbiAgICBjb25zdCB0aWxlU3BhbnMgPSB0aWxlSGFybmVzc2VzLm1hcCh0ID0+IHBhcmFsbGVsKCgpID0+IFt0LmdldENvbHNwYW4oKSwgdC5nZXRSb3dzcGFuKCldKSk7XG4gICAgY29uc3QgdGlsZXMgPSAoYXdhaXQgcGFyYWxsZWwoKCkgPT4gdGlsZVNwYW5zKSlcbiAgICAgICAgLm1hcCgoW2NvbHNwYW4sIHJvd3NwYW5dKSA9PiAoe2NvbHNwYW4sIHJvd3NwYW59KSk7XG4gICAgLy8gVXBkYXRlIHRoZSB0aWxlIGNvb3JkaW5hdG9yIHRvIHJlZmxlY3QgdGhlIGN1cnJlbnQgY29sdW1uIGFtb3VudCBhbmRcbiAgICAvLyByZW5kZXJlZCB0aWxlcy4gV2UgdXBkYXRlIHVwb24gZXZlcnkgY2FsbCBvZiB0aGlzIG1ldGhvZCBzaW5jZSB3ZSBkbyBub3RcbiAgICAvLyBrbm93IGlmIHRpbGVzIGhhdmUgYmVlbiBhZGRlZCwgcmVtb3ZlZCBvciB1cGRhdGVkIChpbiB0ZXJtcyBvZiByb3dzcGFuL2NvbHNwYW4pLlxuICAgIHRoaXMuX3RpbGVDb29yZGluYXRvci51cGRhdGUoY29sdW1ucywgdGlsZXMpO1xuICAgIC8vIFRoZSB0aWxlIGNvb3JkaW5hdG9yIHJlc3BlY3RzIHRoZSBjb2xzcGFuIGFuZCByb3dzcGFuIGZvciBjYWxjdWxhdGluZyB0aGUgcG9zaXRpb25zXG4gICAgLy8gb2YgdGlsZXMsIGJ1dCBpdCBkb2VzIG5vdCBjcmVhdGUgbXVsdGlwbGUgcG9zaXRpb24gZW50cmllcyBpZiBhIHRpbGUgc3BhbnMgb3ZlciBtdWx0aXBsZVxuICAgIC8vIGNvbHVtbnMgb3Igcm93cy4gV2Ugd2FudCB0byBwcm92aWRlIGFuIEFQSSB3aGVyZSBkZXZlbG9wZXJzIGNhbiByZXRyaWV2ZSBhIHRpbGUgYmFzZWQgb25cbiAgICAvLyBhbnkgcG9zaXRpb24gdGhhdCBsaWVzIHdpdGhpbiB0aGUgdmlzdWFsIHRpbGUgYm91bmRhcmllcy4gRm9yIGV4YW1wbGU6IElmIGEgdGlsZSBzcGFuc1xuICAgIC8vIG92ZXIgdHdvIGNvbHVtbnMsIHRoZW4gdGhlIHNhbWUgdGlsZSBzaG91bGQgYmUgcmV0dXJuZWQgZm9yIGVpdGhlciBjb2x1bW4gaW5kaWNlcy5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RpbGVDb29yZGluYXRvci5wb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5fdGlsZUNvb3JkaW5hdG9yLnBvc2l0aW9uc1tpXTtcbiAgICAgIGNvbnN0IHtyb3dzcGFuLCBjb2xzcGFufSA9IHRpbGVzW2ldO1xuICAgICAgLy8gUmV0dXJuIHRoZSB0aWxlIGhhcm5lc3MgaWYgdGhlIGdpdmVuIHBvc2l0aW9uIHZpc3VhbGx5IHJlc29sdmVzIHRvIHRoZSB0aWxlLlxuICAgICAgaWYgKGNvbHVtbiA+PSBwb3NpdGlvbi5jb2wgJiYgY29sdW1uIDw9IHBvc2l0aW9uLmNvbCArIGNvbHNwYW4gLSAxICYmIHJvdyA+PSBwb3NpdGlvbi5yb3cgJiZcbiAgICAgICAgICByb3cgPD0gcG9zaXRpb24ucm93ICsgcm93c3BhbiAtIDEpIHtcbiAgICAgICAgcmV0dXJuIHRpbGVIYXJuZXNzZXNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHRocm93IEVycm9yKCdDb3VsZCBub3QgZmluZCB0aWxlIGF0IGdpdmVuIHBvc2l0aW9uLicpO1xuICB9XG59XG4iXX0=