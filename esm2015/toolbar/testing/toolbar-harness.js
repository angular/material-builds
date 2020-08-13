/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-toolbar in tests. */
export class MatToolbarHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._getRows = this.locatorForAll(".mat-toolbar-row" /* ROW */);
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatToolbarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which card instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatToolbarHarness, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness._getText(), text));
    }
    /** Whether the toolbar has multiple rows. */
    hasMultipleRows() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-toolbar-multiple-rows');
        });
    }
    /** Gets all of the toolbar's content as text. */
    _getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
    /** Gets the text of each row in the toolbar. */
    getRowsAsText() {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this._getRows();
            return Promise.all(rows.length ? rows.map(r => r.text()) : [this._getText()]);
        });
    }
}
MatToolbarHarness.hostSelector = '.mat-toolbar';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbGJhci1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Rvb2xiYXIvdGVzdGluZy90b29sYmFyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUdILE9BQU8sRUFBQyxnQ0FBZ0MsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBUXhGLG9FQUFvRTtBQUNwRSxNQUFNLE9BQU8saUJBQWtCLFNBQVEsZ0NBQW1EO0lBQTFGOztRQUdVLGFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSw4QkFBdUIsQ0FBQztJQTZCL0QsQ0FBQztJQTNCQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBaUMsRUFBRTtRQUM3QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDO2FBQ3BELFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFDN0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVELDZDQUE2QztJQUN2QyxlQUFlOztZQUNuQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUNuRSxDQUFDO0tBQUE7SUFFRCxpREFBaUQ7SUFDbkMsUUFBUTs7WUFDcEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEMsQ0FBQztLQUFBO0lBRUQsZ0RBQWdEO0lBQzFDLGFBQWE7O1lBQ2pCLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25DLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRixDQUFDO0tBQUE7O0FBOUJNLDhCQUFZLEdBQUcsY0FBYyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cblxuaW1wb3J0IHtDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtUb29sYmFySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vdG9vbGJhci1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogU2VsZWN0b3JzIGZvciBkaWZmZXJlbnQgc2VjdGlvbnMgb2YgdGhlIG1hdC10b29sYmFyIHRoYXQgY29udGFpbiB1c2VyIGNvbnRlbnQuICovXG5leHBvcnQgY29uc3QgZW51bSBNYXRUb29sYmFyU2VjdGlvbiB7XG4gIFJPVyA9ICcubWF0LXRvb2xiYXItcm93J1xufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC10b29sYmFyIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRvb2xiYXJIYXJuZXNzIGV4dGVuZHMgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3M8TWF0VG9vbGJhclNlY3Rpb24+IHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXRvb2xiYXInO1xuXG4gIHByaXZhdGUgX2dldFJvd3MgPSB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0VG9vbGJhclNlY3Rpb24uUk9XKTtcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0VG9vbGJhckhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGNhcmQgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogVG9vbGJhckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFRvb2xiYXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFRvb2xiYXJIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCxcbiAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLl9nZXRUZXh0KCksIHRleHQpKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSB0b29sYmFyIGhhcyBtdWx0aXBsZSByb3dzLiAqL1xuICBhc3luYyBoYXNNdWx0aXBsZVJvd3MoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC10b29sYmFyLW11bHRpcGxlLXJvd3MnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFsbCBvZiB0aGUgdG9vbGJhcidzIGNvbnRlbnQgYXMgdGV4dC4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IG9mIGVhY2ggcm93IGluIHRoZSB0b29sYmFyLiAqL1xuICBhc3luYyBnZXRSb3dzQXNUZXh0KCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCByb3dzID0gYXdhaXQgdGhpcy5fZ2V0Um93cygpO1xuICAgIHJldHVybiBQcm9taXNlLmFsbChyb3dzLmxlbmd0aCA/IHJvd3MubWFwKHIgPT4gci50ZXh0KCkpIDogW3RoaXMuX2dldFRleHQoKV0pO1xuICB9XG59XG4iXX0=