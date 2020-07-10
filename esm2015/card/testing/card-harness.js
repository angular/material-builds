/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-card in tests. */
export class MatCardHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._title = this.locatorForOptional('.mat-card-title');
        this._subtitle = this.locatorForOptional('.mat-card-subtitle');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCardHarness` that meets
     * certain criteria.
     * @param options Options for filtering which card instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatCardHarness, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('title', options.title, (harness, title) => HarnessPredicate.stringMatches(harness.getTitleText(), title))
            .addOption('subtitle', options.subtitle, (harness, subtitle) => HarnessPredicate.stringMatches(harness.getSubtitleText(), subtitle));
    }
    /** Gets all of the card's content as text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
    /** Gets the cards's title text. */
    getTitleText() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return (_b = (_a = (yield this._title())) === null || _a === void 0 ? void 0 : _a.text()) !== null && _b !== void 0 ? _b : '';
        });
    }
    /** Gets the cards's subtitle text. */
    getSubtitleText() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return (_b = (_a = (yield this._subtitle())) === null || _a === void 0 ? void 0 : _a.text()) !== null && _b !== void 0 ? _b : '';
        });
    }
    getChildLoader(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.locatorFactory.rootHarnessLoader()).getChildLoader(selector);
        });
    }
    getAllChildLoaders(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.locatorFactory.rootHarnessLoader()).getAllChildLoaders(selector);
        });
    }
    getHarness(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.locatorFactory.rootHarnessLoader()).getHarness(query);
        });
    }
    getAllHarnesses(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.locatorFactory.rootHarnessLoader()).getAllHarnesses(query);
        });
    }
}
/** The selector for the host element of a `MatCard` instance. */
MatCardHarness.hostSelector = 'mat-card';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NhcmQvdGVzdGluZy9jYXJkLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFDTCxnQkFBZ0IsRUFFaEIsZ0JBQWdCLEVBRWpCLE1BQU0sc0JBQXNCLENBQUM7QUFXOUIsaUVBQWlFO0FBQ2pFLE1BQU0sT0FBTyxjQUFlLFNBQVEsZ0JBQWdCO0lBQXBEOztRQXFCVSxXQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDcEQsY0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBZ0NwRSxDQUFDO0lBbERDOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUE4QixFQUFFO1FBQzFDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDO2FBQy9DLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFDM0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzlFLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFDN0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3JGLFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFDbkMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FDbEIsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFLRCw4Q0FBOEM7SUFDeEMsT0FBTzs7WUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQyxDQUFDO0tBQUE7SUFFRCxtQ0FBbUM7SUFDN0IsWUFBWTs7O1lBQ2hCLG1CQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsMENBQUUsSUFBSSxxQ0FBTSxFQUFFLENBQUM7O0tBQzVDO0lBRUQsc0NBQXNDO0lBQ2hDLGVBQWU7OztZQUNuQixtQkFBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLDBDQUFFLElBQUkscUNBQU0sRUFBRSxDQUFDOztLQUMvQztJQUVLLGNBQWMsQ0FBQyxRQUFnQjs7WUFDbkMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xGLENBQUM7S0FBQTtJQUVLLGtCQUFrQixDQUFDLFFBQWdCOztZQUN2QyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RixDQUFDO0tBQUE7SUFFSyxVQUFVLENBQTZCLEtBQXNCOztZQUNqRSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0UsQ0FBQztLQUFBO0lBRUssZUFBZSxDQUE2QixLQUFzQjs7WUFDdEUsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hGLENBQUM7S0FBQTs7QUFwREQsaUVBQWlFO0FBQzFELDJCQUFZLEdBQUcsVUFBVSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudEhhcm5lc3MsXG4gIEhhcm5lc3NMb2FkZXIsXG4gIEhhcm5lc3NQcmVkaWNhdGUsXG4gIEhhcm5lc3NRdWVyeVxufSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0NhcmRIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9jYXJkLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBTZWxlY3RvcnMgZm9yIGRpZmZlcmVudCBzZWN0aW9ucyBvZiB0aGUgbWF0LWNhcmQgdGhhdCBjYW4gY29udGFpbmVyIHVzZXIgY29udGVudC4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIE1hdENhcmRTZWN0aW9uIHtcbiAgSEVBREVSID0gJy5tYXQtY2FyZC1oZWFkZXInLFxuICBDT05URU5UID0gJy5tYXQtY2FyZC1jb250ZW50JyxcbiAgQUNUSU9OUyA9ICcubWF0LWNhcmQtYWN0aW9ucycsXG4gIEZPT1RFUiA9ICcubWF0LWNhcmQtZm9vdGVyJ1xufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1jYXJkIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdENhcmRIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyBpbXBsZW1lbnRzIEhhcm5lc3NMb2FkZXIge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdENhcmRgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1jYXJkJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0Q2FyZEhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGNhcmQgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogQ2FyZEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdENhcmRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdENhcmRIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCkpXG4gICAgICAgIC5hZGRPcHRpb24oJ3RpdGxlJywgb3B0aW9ucy50aXRsZSxcbiAgICAgICAgICAgIChoYXJuZXNzLCB0aXRsZSkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGl0bGVUZXh0KCksIHRpdGxlKSlcbiAgICAgICAgLmFkZE9wdGlvbignc3VidGl0bGUnLCBvcHRpb25zLnN1YnRpdGxlLFxuICAgICAgICAgICAgKGhhcm5lc3MsIHN1YnRpdGxlKSA9PlxuICAgICAgICAgICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFN1YnRpdGxlVGV4dCgpLCBzdWJ0aXRsZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdGl0bGUgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1jYXJkLXRpdGxlJyk7XG4gIHByaXZhdGUgX3N1YnRpdGxlID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtY2FyZC1zdWJ0aXRsZScpO1xuXG4gIC8qKiBHZXRzIGFsbCBvZiB0aGUgY2FyZCdzIGNvbnRlbnQgYXMgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjYXJkcydzIHRpdGxlIHRleHQuICovXG4gIGFzeW5jIGdldFRpdGxlVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fdGl0bGUoKSk/LnRleHQoKSA/PyAnJztcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjYXJkcydzIHN1YnRpdGxlIHRleHQuICovXG4gIGFzeW5jIGdldFN1YnRpdGxlVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fc3VidGl0bGUoKSk/LnRleHQoKSA/PyAnJztcbiAgfVxuXG4gIGFzeW5jIGdldENoaWxkTG9hZGVyKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXI+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMubG9jYXRvckZhY3Rvcnkucm9vdEhhcm5lc3NMb2FkZXIoKSkuZ2V0Q2hpbGRMb2FkZXIoc2VsZWN0b3IpO1xuICB9XG5cbiAgYXN5bmMgZ2V0QWxsQ2hpbGRMb2FkZXJzKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXJbXT4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5sb2NhdG9yRmFjdG9yeS5yb290SGFybmVzc0xvYWRlcigpKS5nZXRBbGxDaGlsZExvYWRlcnMoc2VsZWN0b3IpO1xuICB9XG5cbiAgYXN5bmMgZ2V0SGFybmVzczxUIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcz4ocXVlcnk6IEhhcm5lc3NRdWVyeTxUPik6IFByb21pc2U8VD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5sb2NhdG9yRmFjdG9yeS5yb290SGFybmVzc0xvYWRlcigpKS5nZXRIYXJuZXNzKHF1ZXJ5KTtcbiAgfVxuXG4gIGFzeW5jIGdldEFsbEhhcm5lc3NlczxUIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcz4ocXVlcnk6IEhhcm5lc3NRdWVyeTxUPik6IFByb21pc2U8VFtdPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmxvY2F0b3JGYWN0b3J5LnJvb3RIYXJuZXNzTG9hZGVyKCkpLmdldEFsbEhhcm5lc3NlcyhxdWVyeSk7XG4gIH1cbn1cbiJdfQ==