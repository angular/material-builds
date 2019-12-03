/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/**
 * Harness for interacting with a standard Material badge in tests.
 * @dynamic
 */
var MatBadgeHarness = /** @class */ (function (_super) {
    __extends(MatBadgeHarness, _super);
    function MatBadgeHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._badgeElement = _this.locatorFor('.mat-badge-content');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a badge with specific attributes.
     * @param options Options for narrowing the search:
     *   - `text` finds a badge host with a particular text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatBadgeHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatBadgeHarness, options)
            .addOption('text', options.text, function (harness, text) { return HarnessPredicate.stringMatches(harness.getText(), text); });
    };
    /** Gets a promise for the badge text. */
    MatBadgeHarness.prototype.getText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._badgeElement()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Gets whether the badge is overlapping the content. */
    MatBadgeHarness.prototype.isOverlapping = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-badge-overlap')];
                }
            });
        });
    };
    /** Gets the position of the badge. */
    MatBadgeHarness.prototype.getPosition = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        result = '';
                        return [4 /*yield*/, host.hasClass('mat-badge-above')];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        result += 'above';
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, host.hasClass('mat-badge-below')];
                    case 4:
                        if (_a.sent()) {
                            result += 'below';
                        }
                        _a.label = 5;
                    case 5: return [4 /*yield*/, host.hasClass('mat-badge-before')];
                    case 6:
                        if (!_a.sent()) return [3 /*break*/, 7];
                        result += ' before';
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, host.hasClass('mat-badge-after')];
                    case 8:
                        if (_a.sent()) {
                            result += ' after';
                        }
                        _a.label = 9;
                    case 9: return [2 /*return*/, result.trim()];
                }
            });
        });
    };
    /** Gets the size of the badge. */
    MatBadgeHarness.prototype.getSize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        return [4 /*yield*/, host.hasClass('mat-badge-small')];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [2 /*return*/, 'small'];
                    case 3: return [4 /*yield*/, host.hasClass('mat-badge-large')];
                    case 4:
                        if (_a.sent()) {
                            return [2 /*return*/, 'large'];
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/, 'medium'];
                }
            });
        });
    };
    /** Gets whether the badge is hidden. */
    MatBadgeHarness.prototype.isHidden = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-badge-hidden')];
                }
            });
        });
    };
    /** Gets whether the badge is disabled. */
    MatBadgeHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-badge-disabled')];
                }
            });
        });
    };
    MatBadgeHarness.hostSelector = '.mat-badge';
    return MatBadgeHarness;
}(ComponentHarness));
export { MatBadgeHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9iYWRnZS90ZXN0aW5nL2JhZGdlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBS3hFOzs7R0FHRztBQUNIO0lBQXFDLG1DQUFnQjtJQUFyRDtRQUFBLHFFQXFFQztRQXREUyxtQkFBYSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7SUFzRGhFLENBQUM7SUFsRUM7Ozs7O09BS0c7SUFDSSxvQkFBSSxHQUFYLFVBQVksT0FBaUM7UUFBakMsd0JBQUEsRUFBQSxZQUFpQztRQUMzQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQzthQUNoRCxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQzNCLFVBQUMsT0FBTyxFQUFFLElBQUksSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQXZELENBQXVELENBQUMsQ0FBQztJQUN0RixDQUFDO0lBSUQseUNBQXlDO0lBQ25DLGlDQUFPLEdBQWI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFBOzRCQUFsQyxzQkFBTyxDQUFDLFNBQTBCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQzs7OztLQUM1QztJQUVELHlEQUF5RDtJQUNuRCx1Q0FBYSxHQUFuQjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDOzs7O0tBQzFEO0lBRUQsc0NBQXNDO0lBQ2hDLHFDQUFXLEdBQWpCOzs7Ozs0QkFDZSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUF4QixJQUFJLEdBQUcsU0FBaUI7d0JBQzFCLE1BQU0sR0FBRyxFQUFFLENBQUM7d0JBRVoscUJBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFBOzs2QkFBdEMsU0FBc0MsRUFBdEMsd0JBQXNDO3dCQUN4QyxNQUFNLElBQUksT0FBTyxDQUFDOzs0QkFDVCxxQkFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUE7O3dCQUExQyxJQUFJLFNBQXNDLEVBQUU7NEJBQ2pELE1BQU0sSUFBSSxPQUFPLENBQUM7eUJBQ25COzs0QkFFRyxxQkFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQUE7OzZCQUF2QyxTQUF1QyxFQUF2Qyx3QkFBdUM7d0JBQ3pDLE1BQU0sSUFBSSxTQUFTLENBQUM7OzRCQUNYLHFCQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBQTs7d0JBQTFDLElBQUksU0FBc0MsRUFBRTs0QkFDakQsTUFBTSxJQUFJLFFBQVEsQ0FBQzt5QkFDcEI7OzRCQUVELHNCQUFPLE1BQU0sQ0FBQyxJQUFJLEVBQXNCLEVBQUM7Ozs7S0FDMUM7SUFFRCxrQ0FBa0M7SUFDNUIsaUNBQU8sR0FBYjs7Ozs7NEJBQ2UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzt3QkFBeEIsSUFBSSxHQUFHLFNBQWlCO3dCQUUxQixxQkFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUE7OzZCQUF0QyxTQUFzQyxFQUF0Qyx3QkFBc0M7d0JBQ3hDLHNCQUFPLE9BQU8sRUFBQzs0QkFDTixxQkFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUE7O3dCQUExQyxJQUFJLFNBQXNDLEVBQUU7NEJBQ2pELHNCQUFPLE9BQU8sRUFBQzt5QkFDaEI7OzRCQUVELHNCQUFPLFFBQVEsRUFBQzs7OztLQUNqQjtJQUVELHdDQUF3QztJQUNsQyxrQ0FBUSxHQUFkOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQUM7Ozs7S0FDekQ7SUFFRCwwQ0FBMEM7SUFDcEMsb0NBQVUsR0FBaEI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsRUFBQzs7OztLQUMzRDtJQW5FTSw0QkFBWSxHQUFHLFlBQVksQ0FBQztJQW9FckMsc0JBQUM7Q0FBQSxBQXJFRCxDQUFxQyxnQkFBZ0IsR0FxRXBEO1NBckVZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdEJhZGdlUG9zaXRpb24sIE1hdEJhZGdlU2l6ZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYmFkZ2UnO1xuaW1wb3J0IHtCYWRnZUhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2JhZGdlLWhhcm5lc3MtZmlsdGVycyc7XG5cblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgTWF0ZXJpYWwgYmFkZ2UgaW4gdGVzdHMuXG4gKiBAZHluYW1pY1xuICovXG5leHBvcnQgY2xhc3MgTWF0QmFkZ2VIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1iYWRnZSc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYmFkZ2Ugd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGB0ZXh0YCBmaW5kcyBhIGJhZGdlIGhvc3Qgd2l0aCBhIHBhcnRpY3VsYXIgdGV4dC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBCYWRnZUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEJhZGdlSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRCYWRnZUhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3RleHQnLCBvcHRpb25zLnRleHQsXG4gICAgICAgICAgICAoaGFybmVzcywgdGV4dCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGV4dCgpLCB0ZXh0KSk7XG4gIH1cblxuICBwcml2YXRlIF9iYWRnZUVsZW1lbnQgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtYmFkZ2UtY29udGVudCcpO1xuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIGJhZGdlIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2JhZGdlRWxlbWVudCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBiYWRnZSBpcyBvdmVybGFwcGluZyB0aGUgY29udGVudC4gKi9cbiAgYXN5bmMgaXNPdmVybGFwcGluZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWJhZGdlLW92ZXJsYXAnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgYmFkZ2UuICovXG4gIGFzeW5jIGdldFBvc2l0aW9uKCk6IFByb21pc2U8TWF0QmFkZ2VQb3NpdGlvbj4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgICBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWJhZGdlLWFib3ZlJykpIHtcbiAgICAgIHJlc3VsdCArPSAnYWJvdmUnO1xuICAgIH0gZWxzZSBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWJhZGdlLWJlbG93JykpIHtcbiAgICAgIHJlc3VsdCArPSAnYmVsb3cnO1xuICAgIH1cblxuICAgIGlmIChhd2FpdCBob3N0Lmhhc0NsYXNzKCdtYXQtYmFkZ2UtYmVmb3JlJykpIHtcbiAgICAgIHJlc3VsdCArPSAnIGJlZm9yZSc7XG4gICAgfSBlbHNlIGlmIChhd2FpdCBob3N0Lmhhc0NsYXNzKCdtYXQtYmFkZ2UtYWZ0ZXInKSkge1xuICAgICAgcmVzdWx0ICs9ICcgYWZ0ZXInO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQudHJpbSgpIGFzIE1hdEJhZGdlUG9zaXRpb247XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2l6ZSBvZiB0aGUgYmFkZ2UuICovXG4gIGFzeW5jIGdldFNpemUoKTogUHJvbWlzZTxNYXRCYWRnZVNpemU+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG5cbiAgICBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWJhZGdlLXNtYWxsJykpIHtcbiAgICAgIHJldHVybiAnc21hbGwnO1xuICAgIH0gZWxzZSBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWJhZGdlLWxhcmdlJykpIHtcbiAgICAgIHJldHVybiAnbGFyZ2UnO1xuICAgIH1cblxuICAgIHJldHVybiAnbWVkaXVtJztcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGJhZGdlIGlzIGhpZGRlbi4gKi9cbiAgYXN5bmMgaXNIaWRkZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1iYWRnZS1oaWRkZW4nKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGJhZGdlIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtYmFkZ2UtZGlzYWJsZWQnKTtcbiAgfVxufVxuIl19