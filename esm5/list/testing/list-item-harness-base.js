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
 * Gets a `HarnessPredicate` that applies the given `BaseListItemHarnessFilters` to the given
 * list item harness.
 * @template H The type of list item harness to create a predicate for.
 * @param harnessType A constructor for a list item harness.
 * @param options An instance of `BaseListItemHarnessFilters` to apply.
 * @return A `HarnessPredicate` for the given harness type with the given options applied.
 */
export function getListItemPredicate(harnessType, options) {
    return new HarnessPredicate(harnessType, options)
        .addOption('text', options.text, function (harness, text) { return HarnessPredicate.stringMatches(harness.getText(), text); });
}
/** Harness for interacting with a list subheader. */
var MatSubheaderHarness = /** @class */ (function (_super) {
    __extends(MatSubheaderHarness, _super);
    function MatSubheaderHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatSubheaderHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatSubheaderHarness, options)
            .addOption('text', options.text, function (harness, text) { return HarnessPredicate.stringMatches(harness.getText(), text); });
    };
    /** Gets the full text content of the list item (including text from any font icons). */
    MatSubheaderHarness.prototype.getText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    MatSubheaderHarness.hostSelector = '[mat-subheader], [matSubheader]';
    return MatSubheaderHarness;
}(ComponentHarness));
export { MatSubheaderHarness };
/**
 * Shared behavior among the harnesses for the various `MatListItem` flavors.
 * @docs-private
 */
var MatListItemHarnessBase = /** @class */ (function (_super) {
    __extends(MatListItemHarnessBase, _super);
    function MatListItemHarnessBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._lines = _this.locatorForAll('[mat-line], [matLine]');
        _this._avatar = _this.locatorForOptional('[mat-list-avatar], [matListAvatar]');
        _this._icon = _this.locatorForOptional('[mat-list-icon], [matListIcon]');
        return _this;
    }
    /** Gets the full text content of the list item (including text from any font icons). */
    MatListItemHarnessBase.prototype.getText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Gets the lines of text (`mat-line` elements) in this nav list item. */
    MatListItemHarnessBase.prototype.getLinesText = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = Promise).all;
                        return [4 /*yield*/, this._lines()];
                    case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()).map(function (l) { return l.text(); })])];
                }
            });
        });
    };
    /** Whether this list item has an avatar. */
    MatListItemHarnessBase.prototype.hasAvatar = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._avatar()];
                    case 1: return [2 /*return*/, !!(_a.sent())];
                }
            });
        });
    };
    /** Whether this list item has an icon. */
    MatListItemHarnessBase.prototype.hasIcon = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._icon()];
                    case 1: return [2 /*return*/, !!(_a.sent())];
                }
            });
        });
    };
    /** Gets a `HarnessLoader` used to get harnesses within the list item's content. */
    MatListItemHarnessBase.prototype.getHarnessLoaderForContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorFactory.harnessLoaderFor('.mat-list-item-content')];
            });
        });
    };
    return MatListItemHarnessBase;
}(ComponentHarness));
export { MatListItemHarnessBase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1pdGVtLWhhcm5lc3MtYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9saXN0L3Rlc3RpbmcvbGlzdC1pdGVtLWhhcm5lc3MtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUNMLGdCQUFnQixFQUdoQixnQkFBZ0IsRUFDakIsTUFBTSxzQkFBc0IsQ0FBQztBQUc5Qjs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxVQUFVLG9CQUFvQixDQUNoQyxXQUEyQyxFQUMzQyxPQUFtQztJQUNyQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQztTQUM1QyxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQzNCLFVBQUMsT0FBTyxFQUFFLElBQUksSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQXZELENBQXVELENBQUMsQ0FBQztBQUN0RixDQUFDO0FBRUQscURBQXFEO0FBQ3JEO0lBQXlDLHVDQUFnQjtJQUF6RDs7SUFhQSxDQUFDO0lBVlEsd0JBQUksR0FBWCxVQUFZLE9BQXFDO1FBQXJDLHdCQUFBLEVBQUEsWUFBcUM7UUFDL0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQzthQUNwRCxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQzNCLFVBQUMsT0FBTyxFQUFFLElBQUksSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQXZELENBQXVELENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRUQsd0ZBQXdGO0lBQ2xGLHFDQUFPLEdBQWI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQzs7OztLQUNuQztJQVhNLGdDQUFZLEdBQUcsaUNBQWlDLENBQUM7SUFZMUQsMEJBQUM7Q0FBQSxBQWJELENBQXlDLGdCQUFnQixHQWF4RDtTQWJZLG1CQUFtQjtBQWVoQzs7O0dBR0c7QUFDSDtJQUE0QywwQ0FBZ0I7SUFBNUQ7UUFBQSxxRUE2QkM7UUE1QlMsWUFBTSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNyRCxhQUFPLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDeEUsV0FBSyxHQUFHLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDOztJQTBCNUUsQ0FBQztJQXhCQyx3RkFBd0Y7SUFDbEYsd0NBQU8sR0FBYjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDOzs7O0tBQ25DO0lBRUQsMEVBQTBFO0lBQ3BFLDZDQUFZLEdBQWxCOzs7Ozs7d0JBQ1MsS0FBQSxDQUFBLEtBQUEsT0FBTyxDQUFBLENBQUMsR0FBRyxDQUFBO3dCQUFFLHFCQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBQTs0QkFBdkMsc0JBQU8sY0FBWSxDQUFDLFNBQW1CLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQVIsQ0FBUSxDQUFDLEVBQUMsRUFBQzs7OztLQUM5RDtJQUVELDRDQUE0QztJQUN0QywwQ0FBUyxHQUFmOzs7OzRCQUNXLHFCQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQTs0QkFBN0Isc0JBQU8sQ0FBQyxDQUFDLENBQUEsU0FBb0IsQ0FBQSxFQUFDOzs7O0tBQy9CO0lBRUQsMENBQTBDO0lBQ3BDLHdDQUFPLEdBQWI7Ozs7NEJBQ1cscUJBQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFBOzRCQUEzQixzQkFBTyxDQUFDLENBQUMsQ0FBQSxTQUFrQixDQUFBLEVBQUM7Ozs7S0FDN0I7SUFFRCxtRkFBbUY7SUFDN0UsMkRBQTBCLEdBQWhDOzs7Z0JBQ0Usc0JBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFDOzs7S0FDdkU7SUFDSCw2QkFBQztBQUFELENBQUMsQUE3QkQsQ0FBNEMsZ0JBQWdCLEdBNkIzRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnRIYXJuZXNzLFxuICBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3IsXG4gIEhhcm5lc3NMb2FkZXIsXG4gIEhhcm5lc3NQcmVkaWNhdGVcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtCYXNlTGlzdEl0ZW1IYXJuZXNzRmlsdGVycywgU3ViaGVhZGVySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vbGlzdC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKipcbiAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBhcHBsaWVzIHRoZSBnaXZlbiBgQmFzZUxpc3RJdGVtSGFybmVzc0ZpbHRlcnNgIHRvIHRoZSBnaXZlblxuICogbGlzdCBpdGVtIGhhcm5lc3MuXG4gKiBAdGVtcGxhdGUgSCBUaGUgdHlwZSBvZiBsaXN0IGl0ZW0gaGFybmVzcyB0byBjcmVhdGUgYSBwcmVkaWNhdGUgZm9yLlxuICogQHBhcmFtIGhhcm5lc3NUeXBlIEEgY29uc3RydWN0b3IgZm9yIGEgbGlzdCBpdGVtIGhhcm5lc3MuXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiBpbnN0YW5jZSBvZiBgQmFzZUxpc3RJdGVtSGFybmVzc0ZpbHRlcnNgIHRvIGFwcGx5LlxuICogQHJldHVybiBBIGBIYXJuZXNzUHJlZGljYXRlYCBmb3IgdGhlIGdpdmVuIGhhcm5lc3MgdHlwZSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zIGFwcGxpZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaXN0SXRlbVByZWRpY2F0ZTxIIGV4dGVuZHMgTWF0TGlzdEl0ZW1IYXJuZXNzQmFzZT4oXG4gICAgaGFybmVzc1R5cGU6IENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxIPixcbiAgICBvcHRpb25zOiBCYXNlTGlzdEl0ZW1IYXJuZXNzRmlsdGVycyk6IEhhcm5lc3NQcmVkaWNhdGU8SD4ge1xuICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoaGFybmVzc1R5cGUsIG9wdGlvbnMpXG4gICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUZXh0KCksIHRleHQpKTtcbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBsaXN0IHN1YmhlYWRlci4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTdWJoZWFkZXJIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnW21hdC1zdWJoZWFkZXJdLCBbbWF0U3ViaGVhZGVyXSc7XG5cbiAgc3RhdGljIHdpdGgob3B0aW9uczogU3ViaGVhZGVySGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0U3ViaGVhZGVySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTdWJoZWFkZXJIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCkpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGZ1bGwgdGV4dCBjb250ZW50IG9mIHRoZSBsaXN0IGl0ZW0gKGluY2x1ZGluZyB0ZXh0IGZyb20gYW55IGZvbnQgaWNvbnMpLiAqL1xuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG59XG5cbi8qKlxuICogU2hhcmVkIGJlaGF2aW9yIGFtb25nIHRoZSBoYXJuZXNzZXMgZm9yIHRoZSB2YXJpb3VzIGBNYXRMaXN0SXRlbWAgZmxhdm9ycy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdExpc3RJdGVtSGFybmVzc0Jhc2UgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgcHJpdmF0ZSBfbGluZXMgPSB0aGlzLmxvY2F0b3JGb3JBbGwoJ1ttYXQtbGluZV0sIFttYXRMaW5lXScpO1xuICBwcml2YXRlIF9hdmF0YXIgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnW21hdC1saXN0LWF2YXRhcl0sIFttYXRMaXN0QXZhdGFyXScpO1xuICBwcml2YXRlIF9pY29uID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJ1ttYXQtbGlzdC1pY29uXSwgW21hdExpc3RJY29uXScpO1xuXG4gIC8qKiBHZXRzIHRoZSBmdWxsIHRleHQgY29udGVudCBvZiB0aGUgbGlzdCBpdGVtIChpbmNsdWRpbmcgdGV4dCBmcm9tIGFueSBmb250IGljb25zKS4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsaW5lcyBvZiB0ZXh0IChgbWF0LWxpbmVgIGVsZW1lbnRzKSBpbiB0aGlzIG5hdiBsaXN0IGl0ZW0uICovXG4gIGFzeW5jIGdldExpbmVzVGV4dCgpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKChhd2FpdCB0aGlzLl9saW5lcygpKS5tYXAobCA9PiBsLnRleHQoKSkpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBsaXN0IGl0ZW0gaGFzIGFuIGF2YXRhci4gKi9cbiAgYXN5bmMgaGFzQXZhdGFyKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAhIWF3YWl0IHRoaXMuX2F2YXRhcigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBsaXN0IGl0ZW0gaGFzIGFuIGljb24uICovXG4gIGFzeW5jIGhhc0ljb24oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEhYXdhaXQgdGhpcy5faWNvbigpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBgSGFybmVzc0xvYWRlcmAgdXNlZCB0byBnZXQgaGFybmVzc2VzIHdpdGhpbiB0aGUgbGlzdCBpdGVtJ3MgY29udGVudC4gKi9cbiAgYXN5bmMgZ2V0SGFybmVzc0xvYWRlckZvckNvbnRlbnQoKTogUHJvbWlzZTxIYXJuZXNzTG9hZGVyPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZhY3RvcnkuaGFybmVzc0xvYWRlckZvcignLm1hdC1saXN0LWl0ZW0tY29udGVudCcpO1xuICB9XG59XG4iXX0=