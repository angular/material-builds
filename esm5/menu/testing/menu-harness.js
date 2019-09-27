/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
/**
 * Harness for interacting with a standard mat-menu in tests.
 * @dynamic
 */
var MatMenuHarness = /** @class */ (function (_super) {
    tslib_1.__extends(MatMenuHarness, _super);
    function MatMenuHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // TODO: potentially extend MatButtonHarness
    /**
     * Gets a `HarnessPredicate` that can be used to search for a menu with specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a menu whose host element matches the given selector.
     *   - `label` finds a menu with specific label text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatMenuHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatMenuHarness, options)
            .addOption('text', options.triggerText, function (harness, text) { return HarnessPredicate.stringMatches(harness.getTriggerText(), text); });
    };
    /** Gets a boolean promise indicating if the menu is disabled. */
    MatMenuHarness.prototype.isDisabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var disabled, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        disabled = (_b.sent()).getAttribute('disabled');
                        _a = coerceBooleanProperty;
                        return [4 /*yield*/, disabled];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    MatMenuHarness.prototype.isOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                throw Error('not implemented');
            });
        });
    };
    MatMenuHarness.prototype.getTriggerText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Focuses the menu and returns a void promise that indicates when the action is complete. */
    MatMenuHarness.prototype.focus = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the menu and returns a void promise that indicates when the action is complete. */
    MatMenuHarness.prototype.blur = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    MatMenuHarness.prototype.open = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                throw Error('not implemented');
            });
        });
    };
    MatMenuHarness.prototype.close = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                throw Error('not implemented');
            });
        });
    };
    MatMenuHarness.prototype.getItems = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                throw Error('not implemented');
            });
        });
    };
    MatMenuHarness.prototype.getItemLabels = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                throw Error('not implemented');
            });
        });
    };
    MatMenuHarness.prototype.getItemByLabel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                throw Error('not implemented');
            });
        });
    };
    MatMenuHarness.prototype.getItemByIndex = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                throw Error('not implemented');
            });
        });
    };
    MatMenuHarness.prototype.getFocusedItem = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                throw Error('not implemented');
            });
        });
    };
    MatMenuHarness.hostSelector = '.mat-menu-trigger';
    return MatMenuHarness;
}(ComponentHarness));
export { MatMenuHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvdGVzdGluZy9tZW51LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBSTVEOzs7R0FHRztBQUNIO0lBQW9DLDBDQUFnQjtJQUFwRDs7SUFxRUEsQ0FBQztJQWxFQyw0Q0FBNEM7SUFFNUM7Ozs7OztPQU1HO0lBQ0ksbUJBQUksR0FBWCxVQUFZLE9BQWdDO1FBQWhDLHdCQUFBLEVBQUEsWUFBZ0M7UUFDMUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUM7YUFDL0MsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsV0FBVyxFQUNsQyxVQUFDLE9BQU8sRUFBRSxJQUFJLElBQUssT0FBQSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUE5RCxDQUE4RCxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUVELGlFQUFpRTtJQUMzRCxtQ0FBVSxHQUFoQjs7Ozs7NEJBQ29CLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQTdCLFFBQVEsR0FBRyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO3dCQUN0RCxLQUFBLHFCQUFxQixDQUFBO3dCQUFDLHFCQUFNLFFBQVEsRUFBQTs0QkFBM0Msc0JBQU8sa0JBQXNCLFNBQWMsRUFBQyxFQUFDOzs7O0tBQzlDO0lBRUssK0JBQU0sR0FBWjs7O2dCQUNFLE1BQU0sS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7OztLQUNoQztJQUVLLHVDQUFjLEdBQXBCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUM7Ozs7S0FDbkM7SUFFRCw4RkFBOEY7SUFDeEYsOEJBQUssR0FBWDs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFDOzs7O0tBQ3BDO0lBRUQsNEZBQTRGO0lBQ3RGLDZCQUFJLEdBQVY7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQzs7OztLQUNuQztJQUVLLDZCQUFJLEdBQVY7OztnQkFDRSxNQUFNLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOzs7S0FDaEM7SUFFSyw4QkFBSyxHQUFYOzs7Z0JBQ0UsTUFBTSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7O0tBQ2hDO0lBRUssaUNBQVEsR0FBZDs7O2dCQUNFLE1BQU0sS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7OztLQUNoQztJQUVLLHNDQUFhLEdBQW5COzs7Z0JBQ0UsTUFBTSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7O0tBQ2hDO0lBRUssdUNBQWMsR0FBcEI7OztnQkFDRSxNQUFNLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOzs7S0FDaEM7SUFFSyx1Q0FBYyxHQUFwQjs7O2dCQUNFLE1BQU0sS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7OztLQUNoQztJQUVLLHVDQUFjLEdBQXBCOzs7Z0JBQ0UsTUFBTSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7O0tBQ2hDO0lBbkVNLDJCQUFZLEdBQUcsbUJBQW1CLENBQUM7SUFvRTVDLHFCQUFDO0NBQUEsQUFyRUQsQ0FBb0MsZ0JBQWdCLEdBcUVuRDtTQXJFWSxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge01lbnVIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9tZW51LWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge01hdE1lbnVJdGVtSGFybmVzc30gZnJvbSAnLi9tZW51LWl0ZW0taGFybmVzcyc7XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1tZW51IGluIHRlc3RzLlxuICogQGR5bmFtaWNcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdE1lbnVIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZW51LXRyaWdnZXInO1xuXG4gIC8vIFRPRE86IHBvdGVudGlhbGx5IGV4dGVuZCBNYXRCdXR0b25IYXJuZXNzXG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgbWVudSB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoOlxuICAgKiAgIC0gYHNlbGVjdG9yYCBmaW5kcyBhIG1lbnUgd2hvc2UgaG9zdCBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKiAgIC0gYGxhYmVsYCBmaW5kcyBhIG1lbnUgd2l0aCBzcGVjaWZpYyBsYWJlbCB0ZXh0LlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IE1lbnVIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRNZW51SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRNZW51SGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudHJpZ2dlclRleHQsXG4gICAgICAgICAgICAoaGFybmVzcywgdGV4dCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VHJpZ2dlclRleHQoKSwgdGV4dCkpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgbWVudSBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgYXN5bmMgaXNPcGVuKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHRocm93IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGdldFRyaWdnZXJUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIG1lbnUgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBtZW51IGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICBhc3luYyBvcGVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRocm93IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRocm93IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGdldEl0ZW1zKCk6IFByb21pc2U8TWF0TWVudUl0ZW1IYXJuZXNzW10+IHtcbiAgICB0aHJvdyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG4gIH1cblxuICBhc3luYyBnZXRJdGVtTGFiZWxzKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICB0aHJvdyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG4gIH1cblxuICBhc3luYyBnZXRJdGVtQnlMYWJlbCgpOiBQcm9taXNlPE1hdE1lbnVJdGVtSGFybmVzcz4ge1xuICAgIHRocm93IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGdldEl0ZW1CeUluZGV4KCk6IFByb21pc2U8TWF0TWVudUl0ZW1IYXJuZXNzPiB7XG4gICAgdGhyb3cgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Rm9jdXNlZEl0ZW0oKTogUHJvbWlzZTxNYXRNZW51SXRlbUhhcm5lc3M+IHtcbiAgICB0aHJvdyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG4gIH1cbn1cbiJdfQ==