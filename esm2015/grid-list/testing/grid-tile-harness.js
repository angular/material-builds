/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard `MatGridTitle` in tests. */
export class MatGridTileHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._header = this.locatorForOptional('.mat-grid-tile-header');
        this._footer = this.locatorForOptional('.mat-grid-tile-footer');
        this._avatar = this.locatorForOptional('.mat-grid-avatar');
    }
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
    /** Gets the amount of rows that the grid-tile takes up. */
    getRowspan() {
        return __awaiter(this, void 0, void 0, function* () {
            return Number(yield (yield this.host()).getAttribute('rowspan'));
        });
    }
    /** Gets the amount of columns that the grid-tile takes up. */
    getColspan() {
        return __awaiter(this, void 0, void 0, function* () {
            return Number(yield (yield this.host()).getAttribute('colspan'));
        });
    }
    /** Whether the grid-tile has a header. */
    hasHeader() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._header()) !== null;
        });
    }
    /** Whether the grid-tile has a footer. */
    hasFooter() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._footer()) !== null;
        });
    }
    /** Whether the grid-tile has an avatar. */
    hasAvatar() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._avatar()) !== null;
        });
    }
    /** Gets the text of the header if present. */
    getHeaderText() {
        return __awaiter(this, void 0, void 0, function* () {
            // For performance reasons, we do not use "hasHeader" as
            // we would then need to query twice for the header.
            const headerEl = yield this._header();
            return headerEl ? headerEl.text() : null;
        });
    }
    /** Gets the text of the footer if present. */
    getFooterText() {
        return __awaiter(this, void 0, void 0, function* () {
            // For performance reasons, we do not use "hasFooter" as
            // we would then need to query twice for the footer.
            const headerEl = yield this._footer();
            return headerEl ? headerEl.text() : null;
        });
    }
}
/** The selector for the host element of a `MatGridTile` instance. */
MatGridTileHarness.hostSelector = '.mat-grid-tile';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC10aWxlLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZ3JpZC1saXN0L3Rlc3RpbmcvZ3JpZC10aWxlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFLHVFQUF1RTtBQUN2RSxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsZ0JBQWdCO0lBQXhEOztRQW9CVSxZQUFPLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDM0QsWUFBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzNELFlBQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQTBDaEUsQ0FBQztJQTVEQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBa0MsRUFBRTtRQUM5QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDO2FBQ25ELFNBQVMsQ0FDTixZQUFZLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFDaEMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQzFGLFNBQVMsQ0FDTixZQUFZLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFDaEMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQU1ELDJEQUEyRDtJQUNyRCxVQUFVOztZQUNkLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ25FLENBQUM7S0FBQTtJQUVELDhEQUE4RDtJQUN4RCxVQUFVOztZQUNkLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ25FLENBQUM7S0FBQTtJQUVELDBDQUEwQztJQUNwQyxTQUFTOztZQUNiLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQztRQUN6QyxDQUFDO0tBQUE7SUFFRCwwQ0FBMEM7SUFDcEMsU0FBUzs7WUFDYixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUM7UUFDekMsQ0FBQztLQUFBO0lBRUQsMkNBQTJDO0lBQ3JDLFNBQVM7O1lBQ2IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDO1FBQ3pDLENBQUM7S0FBQTtJQUVELDhDQUE4QztJQUN4QyxhQUFhOztZQUNqQix3REFBd0Q7WUFDeEQsb0RBQW9EO1lBQ3BELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3RDLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUMzQyxDQUFDO0tBQUE7SUFFRCw4Q0FBOEM7SUFDeEMsYUFBYTs7WUFDakIsd0RBQXdEO1lBQ3hELG9EQUFvRDtZQUNwRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN0QyxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDM0MsQ0FBQztLQUFBOztBQTlERCxxRUFBcUU7QUFDOUQsK0JBQVksR0FBRyxnQkFBZ0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7R3JpZFRpbGVIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9ncmlkLWxpc3QtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBgTWF0R3JpZFRpdGxlYCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRHcmlkVGlsZUhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRHcmlkVGlsZWAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1ncmlkLXRpbGUnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRHcmlkVGlsZUhhcm5lc3NgXG4gICAqIHRoYXQgbWVldHMgY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGRpYWxvZyBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBHcmlkVGlsZUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEdyaWRUaWxlSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRHcmlkVGlsZUhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICAgICAnaGVhZGVyVGV4dCcsIG9wdGlvbnMuaGVhZGVyVGV4dCxcbiAgICAgICAgICAgIChoYXJuZXNzLCBwYXR0ZXJuKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRIZWFkZXJUZXh0KCksIHBhdHRlcm4pKVxuICAgICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAgICAgJ2Zvb3RlclRleHQnLCBvcHRpb25zLmZvb3RlclRleHQsXG4gICAgICAgICAgICAoaGFybmVzcywgcGF0dGVybikgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0Rm9vdGVyVGV4dCgpLCBwYXR0ZXJuKSk7XG4gIH1cblxuICBwcml2YXRlIF9oZWFkZXIgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1ncmlkLXRpbGUtaGVhZGVyJyk7XG4gIHByaXZhdGUgX2Zvb3RlciA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LWdyaWQtdGlsZS1mb290ZXInKTtcbiAgcHJpdmF0ZSBfYXZhdGFyID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtZ3JpZC1hdmF0YXInKTtcblxuICAvKiogR2V0cyB0aGUgYW1vdW50IG9mIHJvd3MgdGhhdCB0aGUgZ3JpZC10aWxlIHRha2VzIHVwLiAqL1xuICBhc3luYyBnZXRSb3dzcGFuKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIE51bWJlcihhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgncm93c3BhbicpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhbW91bnQgb2YgY29sdW1ucyB0aGF0IHRoZSBncmlkLXRpbGUgdGFrZXMgdXAuICovXG4gIGFzeW5jIGdldENvbHNwYW4oKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gTnVtYmVyKGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdjb2xzcGFuJykpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGdyaWQtdGlsZSBoYXMgYSBoZWFkZXIuICovXG4gIGFzeW5jIGhhc0hlYWRlcigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2hlYWRlcigpKSAhPT0gbnVsbDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBncmlkLXRpbGUgaGFzIGEgZm9vdGVyLiAqL1xuICBhc3luYyBoYXNGb290ZXIoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9mb290ZXIoKSkgIT09IG51bGw7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZ3JpZC10aWxlIGhhcyBhbiBhdmF0YXIuICovXG4gIGFzeW5jIGhhc0F2YXRhcigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2F2YXRhcigpKSAhPT0gbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBoZWFkZXIgaWYgcHJlc2VudC4gKi9cbiAgYXN5bmMgZ2V0SGVhZGVyVGV4dCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgLy8gRm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIHdlIGRvIG5vdCB1c2UgXCJoYXNIZWFkZXJcIiBhc1xuICAgIC8vIHdlIHdvdWxkIHRoZW4gbmVlZCB0byBxdWVyeSB0d2ljZSBmb3IgdGhlIGhlYWRlci5cbiAgICBjb25zdCBoZWFkZXJFbCA9IGF3YWl0IHRoaXMuX2hlYWRlcigpO1xuICAgIHJldHVybiBoZWFkZXJFbCA/IGhlYWRlckVsLnRleHQoKSA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBvZiB0aGUgZm9vdGVyIGlmIHByZXNlbnQuICovXG4gIGFzeW5jIGdldEZvb3RlclRleHQoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIC8vIEZvciBwZXJmb3JtYW5jZSByZWFzb25zLCB3ZSBkbyBub3QgdXNlIFwiaGFzRm9vdGVyXCIgYXNcbiAgICAvLyB3ZSB3b3VsZCB0aGVuIG5lZWQgdG8gcXVlcnkgdHdpY2UgZm9yIHRoZSBmb290ZXIuXG4gICAgY29uc3QgaGVhZGVyRWwgPSBhd2FpdCB0aGlzLl9mb290ZXIoKTtcbiAgICByZXR1cm4gaGVhZGVyRWwgPyBoZWFkZXJFbC50ZXh0KCkgOiBudWxsO1xuICB9XG59XG4iXX0=