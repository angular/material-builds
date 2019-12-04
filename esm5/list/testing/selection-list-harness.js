/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator, __read, __spread } from "tslib";
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatListHarnessBase } from './list-harness-base';
import { getListItemPredicate, MatListItemHarnessBase } from './list-item-harness-base';
/** Harness for interacting with a standard mat-selection-list in tests. */
var MatSelectionListHarness = /** @class */ (function (_super) {
    __extends(MatSelectionListHarness, _super);
    function MatSelectionListHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._itemHarness = MatListOptionHarness;
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSelectionListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which selection list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatSelectionListHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatSelectionListHarness, options);
    };
    /** Whether the selection list is disabled. */
    MatSelectionListHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getAttribute('aria-disabled')];
                    case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                }
            });
        });
    };
    /**
     * Selects all items matching any of the given filters.
     * @param filters Filters that specify which items should be selected.
     */
    MatSelectionListHarness.prototype.selectItems = function () {
        var filters = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            filters[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getItems(filters)];
                    case 1:
                        items = _a.sent();
                        return [4 /*yield*/, Promise.all(items.map(function (item) { return item.select(); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deselects all items matching any of the given filters.
     * @param filters Filters that specify which items should be deselected.
     */
    MatSelectionListHarness.prototype.deselectItems = function () {
        var filters = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            filters[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getItems(filters)];
                    case 1:
                        items = _a.sent();
                        return [4 /*yield*/, Promise.all(items.map(function (item) { return item.deselect(); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Gets all items matching the given list of filters. */
    MatSelectionListHarness.prototype._getItems = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            var _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!filters.length) {
                            return [2 /*return*/, this.getItems()];
                        }
                        _b = (_a = (_d = []).concat).apply;
                        _c = [_d];
                        return [4 /*yield*/, Promise.all(filters.map(function (filter) { return _this.locatorForAll(MatListOptionHarness.with(filter))(); }))];
                    case 1: return [2 /*return*/, _b.apply(_a, _c.concat([__spread.apply(void 0, [_e.sent()])]))];
                }
            });
        });
    };
    /** The selector for the host element of a `MatSelectionList` instance. */
    MatSelectionListHarness.hostSelector = 'mat-selection-list';
    return MatSelectionListHarness;
}(MatListHarnessBase));
export { MatSelectionListHarness };
/** Harness for interacting with a list option. */
var MatListOptionHarness = /** @class */ (function (_super) {
    __extends(MatListOptionHarness, _super);
    function MatListOptionHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._itemContent = _this.locatorFor('.mat-list-item-content');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListOptionHarness` that
     * meets certain criteria.
     * @param options Options for filtering which list option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatListOptionHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return getListItemPredicate(MatListOptionHarness, options)
            .addOption('is selected', options.selected, function (harness, selected) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.isSelected()];
                case 1: return [2 /*return*/, (_a.sent()) === selected];
            }
        }); }); });
    };
    /** Gets the position of the checkbox relative to the list option content. */
    MatListOptionHarness.prototype.getCheckboxPosition = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._itemContent()];
                    case 1: return [4 /*yield*/, (_a.sent()).hasClass('mat-list-item-content-reverse')];
                    case 2: return [2 /*return*/, (_a.sent()) ?
                            'after' : 'before'];
                }
            });
        });
    };
    /** Whether the list option is selected. */
    MatListOptionHarness.prototype.isSelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getAttribute('aria-selected')];
                    case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                }
            });
        });
    };
    /** Whether the list option is disabled. */
    MatListOptionHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getAttribute('aria-disabled')];
                    case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                }
            });
        });
    };
    /** Focuses the list option. */
    MatListOptionHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the list option. */
    MatListOptionHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /** Toggles the checked state of the checkbox. */
    MatListOptionHarness.prototype.toggle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).click()];
                }
            });
        });
    };
    /**
     * Puts the list option in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked.
     */
    MatListOptionHarness.prototype.select = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isSelected()];
                    case 1:
                        if (!(_a.sent())) {
                            return [2 /*return*/, this.toggle()];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Puts the list option in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked.
     */
    MatListOptionHarness.prototype.deselect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isSelected()];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, this.toggle()];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /** The selector for the host element of a `MatListOption` instance. */
    MatListOptionHarness.hostSelector = 'mat-list-option';
    return MatListOptionHarness;
}(MatListItemHarnessBase));
export { MatListOptionHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLWxpc3QtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9saXN0L3Rlc3Rpbmcvc2VsZWN0aW9uLWxpc3QtaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFNdkQsT0FBTyxFQUFDLG9CQUFvQixFQUFFLHNCQUFzQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFFdEYsMkVBQTJFO0FBQzNFO0lBQTZDLDJDQUNtQztJQURoRjtRQUFBLHFFQWlEQztRQWpDQyxrQkFBWSxHQUFHLG9CQUFvQixDQUFDOztJQWlDdEMsQ0FBQztJQTVDQzs7Ozs7T0FLRztJQUNJLDRCQUFJLEdBQVgsVUFBWSxPQUF5QztRQUF6Qyx3QkFBQSxFQUFBLFlBQXlDO1FBRW5ELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyx1QkFBdUIsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBSUQsOENBQThDO0lBQ3hDLDRDQUFVLEdBQWhCOzs7OzRCQUNnQixxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXhCLHFCQUFNLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsRUFBQTs0QkFBOUQsc0JBQU8sQ0FBQSxTQUF1RCxNQUFLLE1BQU0sRUFBQzs7OztLQUMzRTtJQUVEOzs7T0FHRztJQUNHLDZDQUFXLEdBQWpCO1FBQWtCLGlCQUFzQzthQUF0QyxVQUFzQyxFQUF0QyxxQkFBc0MsRUFBdEMsSUFBc0M7WUFBdEMsNEJBQXNDOzs7Ozs7NEJBQ3hDLHFCQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUE7O3dC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MEMsc0JBQXNCLEdBb0UvRDtTQXBFWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdExpc3RIYXJuZXNzQmFzZX0gZnJvbSAnLi9saXN0LWhhcm5lc3MtYmFzZSc7XG5pbXBvcnQge1xuICBMaXN0SXRlbUhhcm5lc3NGaWx0ZXJzLFxuICBMaXN0T3B0aW9uSGFybmVzc0ZpbHRlcnMsXG4gIFNlbGVjdGlvbkxpc3RIYXJuZXNzRmlsdGVyc1xufSBmcm9tICcuL2xpc3QtaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7Z2V0TGlzdEl0ZW1QcmVkaWNhdGUsIE1hdExpc3RJdGVtSGFybmVzc0Jhc2V9IGZyb20gJy4vbGlzdC1pdGVtLWhhcm5lc3MtYmFzZSc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXNlbGVjdGlvbi1saXN0IGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdGlvbkxpc3RIYXJuZXNzIGV4dGVuZHMgTWF0TGlzdEhhcm5lc3NCYXNlPFxuICAgIHR5cGVvZiBNYXRMaXN0T3B0aW9uSGFybmVzcywgTWF0TGlzdE9wdGlvbkhhcm5lc3MsIExpc3RPcHRpb25IYXJuZXNzRmlsdGVycz4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFNlbGVjdGlvbkxpc3RgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1zZWxlY3Rpb24tbGlzdCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdFNlbGVjdGlvbkxpc3RIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBzZWxlY3Rpb24gbGlzdCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTZWxlY3Rpb25MaXN0SGFybmVzc0ZpbHRlcnMgPSB7fSk6XG4gICAgICBIYXJuZXNzUHJlZGljYXRlPE1hdFNlbGVjdGlvbkxpc3RIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFNlbGVjdGlvbkxpc3RIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIF9pdGVtSGFybmVzcyA9IE1hdExpc3RPcHRpb25IYXJuZXNzO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3Rpb24gbGlzdCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgYWxsIGl0ZW1zIG1hdGNoaW5nIGFueSBvZiB0aGUgZ2l2ZW4gZmlsdGVycy5cbiAgICogQHBhcmFtIGZpbHRlcnMgRmlsdGVycyB0aGF0IHNwZWNpZnkgd2hpY2ggaXRlbXMgc2hvdWxkIGJlIHNlbGVjdGVkLlxuICAgKi9cbiAgYXN5bmMgc2VsZWN0SXRlbXMoLi4uZmlsdGVyczogTGlzdE9wdGlvbkhhcm5lc3NGaWx0ZXJzW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuX2dldEl0ZW1zKGZpbHRlcnMpO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKGl0ZW1zLm1hcChpdGVtID0+IGl0ZW0uc2VsZWN0KCkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlbGVjdHMgYWxsIGl0ZW1zIG1hdGNoaW5nIGFueSBvZiB0aGUgZ2l2ZW4gZmlsdGVycy5cbiAgICogQHBhcmFtIGZpbHRlcnMgRmlsdGVycyB0aGF0IHNwZWNpZnkgd2hpY2ggaXRlbXMgc2hvdWxkIGJlIGRlc2VsZWN0ZWQuXG4gICAqL1xuICBhc3luYyBkZXNlbGVjdEl0ZW1zKC4uLmZpbHRlcnM6IExpc3RJdGVtSGFybmVzc0ZpbHRlcnNbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5fZ2V0SXRlbXMoZmlsdGVycyk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoaXRlbXMubWFwKGl0ZW0gPT4gaXRlbS5kZXNlbGVjdCgpKSk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgaXRlbXMgbWF0Y2hpbmcgdGhlIGdpdmVuIGxpc3Qgb2YgZmlsdGVycy4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0SXRlbXMoZmlsdGVyczogTGlzdE9wdGlvbkhhcm5lc3NGaWx0ZXJzW10pOiBQcm9taXNlPE1hdExpc3RPcHRpb25IYXJuZXNzW10+IHtcbiAgICBpZiAoIWZpbHRlcnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRJdGVtcygpO1xuICAgIH1cbiAgICByZXR1cm4gKFtdIGFzIE1hdExpc3RPcHRpb25IYXJuZXNzW10pLmNvbmNhdCguLi5hd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgZmlsdGVycy5tYXAoZmlsdGVyID0+IHRoaXMubG9jYXRvckZvckFsbChNYXRMaXN0T3B0aW9uSGFybmVzcy53aXRoKGZpbHRlcikpKCkpKSk7XG4gIH1cbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBsaXN0IG9wdGlvbi4gKi9cbmV4cG9ydCBjbGFzcyBNYXRMaXN0T3B0aW9uSGFybmVzcyBleHRlbmRzIE1hdExpc3RJdGVtSGFybmVzc0Jhc2Uge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdExpc3RPcHRpb25gIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1saXN0LW9wdGlvbic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdExpc3RPcHRpb25IYXJuZXNzYCB0aGF0XG4gICAqIG1lZXRzIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBsaXN0IG9wdGlvbiBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBMaXN0T3B0aW9uSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TGlzdE9wdGlvbkhhcm5lc3M+IHtcbiAgICByZXR1cm4gZ2V0TGlzdEl0ZW1QcmVkaWNhdGUoTWF0TGlzdE9wdGlvbkhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ2lzIHNlbGVjdGVkJywgb3B0aW9ucy5zZWxlY3RlZCxcbiAgICAgICAgICAgIGFzeW5jIChoYXJuZXNzLCBzZWxlY3RlZCkgPT4gYXdhaXQgaGFybmVzcy5pc1NlbGVjdGVkKCkgPT09IHNlbGVjdGVkKTtcbiAgfVxuXG4gIHByaXZhdGUgX2l0ZW1Db250ZW50ID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LWxpc3QtaXRlbS1jb250ZW50Jyk7XG5cbiAgLyoqIEdldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBjaGVja2JveCByZWxhdGl2ZSB0byB0aGUgbGlzdCBvcHRpb24gY29udGVudC4gKi9cbiAgYXN5bmMgZ2V0Q2hlY2tib3hQb3NpdGlvbigpOiBQcm9taXNlPCdiZWZvcmUnIHwgJ2FmdGVyJz4ge1xuICAgIHJldHVybiBhd2FpdCAoYXdhaXQgdGhpcy5faXRlbUNvbnRlbnQoKSkuaGFzQ2xhc3MoJ21hdC1saXN0LWl0ZW0tY29udGVudC1yZXZlcnNlJykgP1xuICAgICAgICAnYWZ0ZXInIDogJ2JlZm9yZSc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbGlzdCBvcHRpb24gaXMgc2VsZWN0ZWQuICovXG4gIGFzeW5jIGlzU2VsZWN0ZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBsaXN0IG9wdGlvbiBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGxpc3Qgb3B0aW9uLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBsaXN0IG9wdGlvbi4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgY2hlY2tlZCBzdGF0ZSBvZiB0aGUgY2hlY2tib3guICovXG4gIGFzeW5jIHRvZ2dsZSgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1dHMgdGhlIGxpc3Qgb3B0aW9uIGluIGEgY2hlY2tlZCBzdGF0ZSBieSB0b2dnbGluZyBpdCBpZiBpdCBpcyBjdXJyZW50bHkgdW5jaGVja2VkLCBvciBkb2luZ1xuICAgKiBub3RoaW5nIGlmIGl0IGlzIGFscmVhZHkgY2hlY2tlZC5cbiAgICovXG4gIGFzeW5jIHNlbGVjdCgpIHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuaXNTZWxlY3RlZCgpKSB7XG4gICAgICByZXR1cm4gdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHV0cyB0aGUgbGlzdCBvcHRpb24gaW4gYW4gdW5jaGVja2VkIHN0YXRlIGJ5IHRvZ2dsaW5nIGl0IGlmIGl0IGlzIGN1cnJlbnRseSBjaGVja2VkLCBvciBkb2luZ1xuICAgKiBub3RoaW5nIGlmIGl0IGlzIGFscmVhZHkgdW5jaGVja2VkLlxuICAgKi9cbiAgYXN5bmMgZGVzZWxlY3QoKSB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaXNTZWxlY3RlZCgpKSB7XG4gICAgICByZXR1cm4gdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==