/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard `MatGridTitle` in tests. */
var MatGridTileHarness = /** @class */ (function (_super) {
    __extends(MatGridTileHarness, _super);
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
        return new HarnessPredicate(MatGridTileHarness, options)
            .addOption('headerText', options.headerText, function (harness, pattern) { return HarnessPredicate.stringMatches(harness.getHeaderText(), pattern); })
            .addOption('footerText', options.footerText, function (harness, pattern) { return HarnessPredicate.stringMatches(harness.getFooterText(), pattern); });
    };
    /** Gets the amount of rows that the grid-tile takes up. */
    MatGridTileHarness.prototype.getRowspan = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._header()];
                    case 1: return [2 /*return*/, (_a.sent()) !== null];
                }
            });
        });
    };
    /** Whether the grid-tile has a footer. */
    MatGridTileHarness.prototype.hasFooter = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._footer()];
                    case 1: return [2 /*return*/, (_a.sent()) !== null];
                }
            });
        });
    };
    /** Whether the grid-tile has an avatar. */
    MatGridTileHarness.prototype.hasAvatar = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._avatar()];
                    case 1: return [2 /*return*/, (_a.sent()) !== null];
                }
            });
        });
    };
    /** Gets the text of the header if present. */
    MatGridTileHarness.prototype.getHeaderText = function () {
        return __awaiter(this, void 0, void 0, function () {
            var headerEl;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var headerEl;
            return __generator(this, function (_a) {
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
}(ComponentHarness));
export { MatGridTileHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC10aWxlLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZ3JpZC1saXN0L3Rlc3RpbmcvZ3JpZC10aWxlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFLHVFQUF1RTtBQUN2RTtJQUF3QyxzQ0FBZ0I7SUFBeEQ7UUFBQSxxRUFnRUM7UUE1Q1MsYUFBTyxHQUFHLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzNELGFBQU8sR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUMzRCxhQUFPLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLENBQUM7O0lBMENoRSxDQUFDO0lBNURDOzs7OztPQUtHO0lBQ0ksdUJBQUksR0FBWCxVQUFZLE9BQW9DO1FBQXBDLHdCQUFBLEVBQUEsWUFBb0M7UUFDOUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQzthQUNuRCxTQUFTLENBQ04sWUFBWSxFQUFFLE9BQU8sQ0FBQyxVQUFVLEVBQ2hDLFVBQUMsT0FBTyxFQUFFLE9BQU8sSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQWhFLENBQWdFLENBQUM7YUFDMUYsU0FBUyxDQUNOLFlBQVksRUFBRSxPQUFPLENBQUMsVUFBVSxFQUNoQyxVQUFDLE9BQU8sRUFBRSxPQUFPLElBQUssT0FBQSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFoRSxDQUFnRSxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQU1ELDJEQUEyRDtJQUNyRCx1Q0FBVSxHQUFoQjs7Ozs7O3dCQUNTLEtBQUEsTUFBTSxDQUFBO3dCQUFRLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBeEIscUJBQU0sQ0FBQyxTQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFBOzRCQUEvRCxzQkFBTyxrQkFBTyxTQUFpRCxFQUFDLEVBQUM7Ozs7S0FDbEU7SUFFRCw4REFBOEQ7SUFDeEQsdUNBQVUsR0FBaEI7Ozs7Ozt3QkFDUyxLQUFBLE1BQU0sQ0FBQTt3QkFBUSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXhCLHFCQUFNLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsRUFBQTs0QkFBL0Qsc0JBQU8sa0JBQU8sU0FBaUQsRUFBQyxFQUFDOzs7O0tBQ2xFO0lBRUQsMENBQTBDO0lBQ3BDLHNDQUFTLEdBQWY7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFBOzRCQUE1QixzQkFBTyxDQUFDLFNBQW9CLENBQUMsS0FBSyxJQUFJLEVBQUM7Ozs7S0FDeEM7SUFFRCwwQ0FBMEM7SUFDcEMsc0NBQVMsR0FBZjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUE7NEJBQTVCLHNCQUFPLENBQUMsU0FBb0IsQ0FBQyxLQUFLLElBQUksRUFBQzs7OztLQUN4QztJQUVELDJDQUEyQztJQUNyQyxzQ0FBUyxHQUFmOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQTs0QkFBNUIsc0JBQU8sQ0FBQyxTQUFvQixDQUFDLEtBQUssSUFBSSxFQUFDOzs7O0tBQ3hDO0lBRUQsOENBQThDO0lBQ3hDLDBDQUFhLEdBQW5COzs7Ozs0QkFHbUIscUJBQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFBOzt3QkFBL0IsUUFBUSxHQUFHLFNBQW9CO3dCQUNyQyxzQkFBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDOzs7O0tBQzFDO0lBRUQsOENBQThDO0lBQ3hDLDBDQUFhLEdBQW5COzs7Ozs0QkFHbUIscUJBQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFBOzt3QkFBL0IsUUFBUSxHQUFHLFNBQW9CO3dCQUNyQyxzQkFBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDOzs7O0tBQzFDO0lBOURELHFFQUFxRTtJQUM5RCwrQkFBWSxHQUFHLGdCQUFnQixDQUFDO0lBOER6Qyx5QkFBQztDQUFBLEFBaEVELENBQXdDLGdCQUFnQixHQWdFdkQ7U0FoRVksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtHcmlkVGlsZUhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2dyaWQtbGlzdC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIGBNYXRHcmlkVGl0bGVgIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdEdyaWRUaWxlYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWdyaWQtdGlsZSc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdEdyaWRUaWxlSGFybmVzc2BcbiAgICogdGhhdCBtZWV0cyBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggZGlhbG9nIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IEdyaWRUaWxlSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0R3JpZFRpbGVIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEdyaWRUaWxlSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgICAgICdoZWFkZXJUZXh0Jywgb3B0aW9ucy5oZWFkZXJUZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHBhdHRlcm4pID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldEhlYWRlclRleHQoKSwgcGF0dGVybikpXG4gICAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICAgICAnZm9vdGVyVGV4dCcsIG9wdGlvbnMuZm9vdGVyVGV4dCxcbiAgICAgICAgICAgIChoYXJuZXNzLCBwYXR0ZXJuKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRGb290ZXJUZXh0KCksIHBhdHRlcm4pKTtcbiAgfVxuXG4gIHByaXZhdGUgX2hlYWRlciA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LWdyaWQtdGlsZS1oZWFkZXInKTtcbiAgcHJpdmF0ZSBfZm9vdGVyID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtZ3JpZC10aWxlLWZvb3RlcicpO1xuICBwcml2YXRlIF9hdmF0YXIgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1ncmlkLWF2YXRhcicpO1xuXG4gIC8qKiBHZXRzIHRoZSBhbW91bnQgb2Ygcm93cyB0aGF0IHRoZSBncmlkLXRpbGUgdGFrZXMgdXAuICovXG4gIGFzeW5jIGdldFJvd3NwYW4oKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gTnVtYmVyKGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdyb3dzcGFuJykpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGFtb3VudCBvZiBjb2x1bW5zIHRoYXQgdGhlIGdyaWQtdGlsZSB0YWtlcyB1cC4gKi9cbiAgYXN5bmMgZ2V0Q29sc3BhbigpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBOdW1iZXIoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2NvbHNwYW4nKSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZ3JpZC10aWxlIGhhcyBhIGhlYWRlci4gKi9cbiAgYXN5bmMgaGFzSGVhZGVyKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faGVhZGVyKCkpICE9PSBudWxsO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGdyaWQtdGlsZSBoYXMgYSBmb290ZXIuICovXG4gIGFzeW5jIGhhc0Zvb3RlcigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2Zvb3RlcigpKSAhPT0gbnVsbDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBncmlkLXRpbGUgaGFzIGFuIGF2YXRhci4gKi9cbiAgYXN5bmMgaGFzQXZhdGFyKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fYXZhdGFyKCkpICE9PSBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRleHQgb2YgdGhlIGhlYWRlciBpZiBwcmVzZW50LiAqL1xuICBhc3luYyBnZXRIZWFkZXJUZXh0KCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICAvLyBGb3IgcGVyZm9ybWFuY2UgcmVhc29ucywgd2UgZG8gbm90IHVzZSBcImhhc0hlYWRlclwiIGFzXG4gICAgLy8gd2Ugd291bGQgdGhlbiBuZWVkIHRvIHF1ZXJ5IHR3aWNlIGZvciB0aGUgaGVhZGVyLlxuICAgIGNvbnN0IGhlYWRlckVsID0gYXdhaXQgdGhpcy5faGVhZGVyKCk7XG4gICAgcmV0dXJuIGhlYWRlckVsID8gaGVhZGVyRWwudGV4dCgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBmb290ZXIgaWYgcHJlc2VudC4gKi9cbiAgYXN5bmMgZ2V0Rm9vdGVyVGV4dCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgLy8gRm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIHdlIGRvIG5vdCB1c2UgXCJoYXNGb290ZXJcIiBhc1xuICAgIC8vIHdlIHdvdWxkIHRoZW4gbmVlZCB0byBxdWVyeSB0d2ljZSBmb3IgdGhlIGZvb3Rlci5cbiAgICBjb25zdCBoZWFkZXJFbCA9IGF3YWl0IHRoaXMuX2Zvb3RlcigpO1xuICAgIHJldHVybiBoZWFkZXJFbCA/IGhlYWRlckVsLnRleHQoKSA6IG51bGw7XG4gIH1cbn1cbiJdfQ==