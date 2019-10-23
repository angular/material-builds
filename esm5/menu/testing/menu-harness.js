/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __assign, __awaiter, __extends, __generator, __read, __spread } from "tslib";
import { ComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
/**
 * Harness for interacting with a standard mat-menu in tests.
 * @dynamic
 */
var MatMenuHarness = /** @class */ (function (_super) {
    __extends(MatMenuHarness, _super);
    function MatMenuHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._documentRootLocator = _this.documentRootLocatorFactory();
        return _this;
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
            .addOption('triggerText', options.triggerText, function (harness, text) { return HarnessPredicate.stringMatches(harness.getTriggerText(), text); });
    };
    /** Gets a boolean promise indicating if the menu is disabled. */
    MatMenuHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var disabled, _a;
            return __generator(this, function (_b) {
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
    /** Whether the menu is open. */
    MatMenuHarness.prototype.isOpen = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getMenuPanel()];
                    case 1: return [2 /*return*/, !!(_a.sent())];
                }
            });
        });
    };
    MatMenuHarness.prototype.getTriggerText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Focuses the menu and returns a void promise that indicates when the action is complete. */
    MatMenuHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the menu and returns a void promise that indicates when the action is complete. */
    MatMenuHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    MatMenuHarness.prototype.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isOpen()];
                    case 1:
                        if (!!(_a.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.host()];
                    case 2: return [2 /*return*/, (_a.sent()).click()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MatMenuHarness.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var panel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getMenuPanel()];
                    case 1:
                        panel = _a.sent();
                        if (panel) {
                            return [2 /*return*/, panel.sendKeys(TestKey.ESCAPE)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MatMenuHarness.prototype.getItems = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var panelId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getPanelId()];
                    case 1:
                        panelId = _a.sent();
                        if (panelId) {
                            return [2 /*return*/, this._documentRootLocator.locatorForAll(MatMenuItemHarness.with(__assign(__assign({}, filters), { ancestor: "#" + panelId })))()];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    MatMenuHarness.prototype.clickItem = function (filter) {
        var filters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            filters[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var items, menu;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.open()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getItems(filter)];
                    case 2:
                        items = _a.sent();
                        if (!items.length) {
                            throw Error("Could not find item matching " + JSON.stringify(filter));
                        }
                        if (!!filters.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, items[0].click()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [4 /*yield*/, items[0].getSubmenu()];
                    case 5:
                        menu = _a.sent();
                        if (!menu) {
                            throw Error("Item matching " + JSON.stringify(filter) + " does not have a submenu");
                        }
                        return [2 /*return*/, menu.clickItem.apply(menu, __spread(filters))];
                }
            });
        });
    };
    MatMenuHarness.prototype._getMenuPanel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var panelId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getPanelId()];
                    case 1:
                        panelId = _a.sent();
                        return [2 /*return*/, panelId ? this._documentRootLocator.locatorForOptional("#" + panelId)() : null];
                }
            });
        });
    };
    MatMenuHarness.prototype._getPanelId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var panelId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getAttribute('aria-controls')];
                    case 2:
                        panelId = _a.sent();
                        return [2 /*return*/, panelId || null];
                }
            });
        });
    };
    MatMenuHarness.hostSelector = '.mat-menu-trigger';
    return MatMenuHarness;
}(ComponentHarness));
export { MatMenuHarness };
/**
 * Harness for interacting with a standard mat-menu-item in tests.
 * @dynamic
 */
var MatMenuItemHarness = /** @class */ (function (_super) {
    __extends(MatMenuItemHarness, _super);
    function MatMenuItemHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a menu with specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a menu item whose host element matches the given selector.
     *   - `label` finds a menu item with specific label text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatMenuItemHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatMenuItemHarness, options)
            .addOption('text', options.text, function (harness, text) { return HarnessPredicate.stringMatches(harness.getText(), text); })
            .addOption('hasSubmenu', options.hasSubmenu, function (harness, hasSubmenu) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.hasSubmenu()];
                case 1: return [2 /*return*/, (_a.sent()) === hasSubmenu];
            }
        }); }); });
    };
    /** Gets a boolean promise indicating if the menu is disabled. */
    MatMenuItemHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var disabled, _a;
            return __generator(this, function (_b) {
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
    MatMenuItemHarness.prototype.getText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Focuses the menu and returns a void promise that indicates when the action is complete. */
    MatMenuItemHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the menu and returns a void promise that indicates when the action is complete. */
    MatMenuItemHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /** Clicks the menu item. */
    MatMenuItemHarness.prototype.click = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).click()];
                }
            });
        });
    };
    /** Whether this item has a submenu. */
    MatMenuItemHarness.prototype.hasSubmenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).matchesSelector(MatMenuHarness.hostSelector)];
                }
            });
        });
    };
    /** Gets the submenu associated with this menu item, or null if none. */
    MatMenuItemHarness.prototype.getSubmenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hasSubmenu()];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, new MatMenuHarness(this.locatorFactory)];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    MatMenuItemHarness.hostSelector = '.mat-menu-item';
    return MatMenuItemHarness;
}(ComponentHarness));
export { MatMenuItemHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvdGVzdGluZy9tZW51LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBZSxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUM5RixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUc1RDs7O0dBR0c7QUFDSDtJQUFvQyxrQ0FBZ0I7SUFBcEQ7UUFBQSxxRUFnR0M7UUE3RlMsMEJBQW9CLEdBQUcsS0FBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7O0lBNkZuRSxDQUFDO0lBM0ZDLDRDQUE0QztJQUU1Qzs7Ozs7O09BTUc7SUFDSSxtQkFBSSxHQUFYLFVBQVksT0FBZ0M7UUFBaEMsd0JBQUEsRUFBQSxZQUFnQztRQUMxQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQzthQUMvQyxTQUFTLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQ3pDLFVBQUMsT0FBTyxFQUFFLElBQUksSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQTlELENBQThELENBQUMsQ0FBQztJQUM3RixDQUFDO0lBRUQsaUVBQWlFO0lBQzNELG1DQUFVLEdBQWhCOzs7Ozs0QkFDb0IscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzt3QkFBN0IsUUFBUSxHQUFHLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7d0JBQ3RELEtBQUEscUJBQXFCLENBQUE7d0JBQUMscUJBQU0sUUFBUSxFQUFBOzRCQUEzQyxzQkFBTyxrQkFBc0IsU0FBYyxF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Q1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxFQUFDOzs7O0tBQ3pFO0lBRUQsd0VBQXdFO0lBQ2xFLHVDQUFVLEdBQWhCOzs7OzRCQUNNLHFCQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBQTs7d0JBQTNCLElBQUksU0FBdUIsRUFBRTs0QkFDM0Isc0JBQU8sSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFDO3lCQUNoRDt3QkFDRCxzQkFBTyxJQUFJLEVBQUM7Ozs7S0FDYjtJQXJETSwrQkFBWSxHQUFHLGdCQUFnQixDQUFDO0lBc0R6Qyx5QkFBQztDQUFBLEFBdkRELENBQXdDLGdCQUFnQixHQXVEdkQ7U0F2RFksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZSwgVGVzdEVsZW1lbnQsIFRlc3RLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtNZW51SGFybmVzc0ZpbHRlcnMsIE1lbnVJdGVtSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vbWVudS1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtbWVudSBpbiB0ZXN0cy5cbiAqIEBkeW5hbWljXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRNZW51SGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtbWVudS10cmlnZ2VyJztcblxuICBwcml2YXRlIF9kb2N1bWVudFJvb3RMb2NhdG9yID0gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpO1xuXG4gIC8vIFRPRE86IHBvdGVudGlhbGx5IGV4dGVuZCBNYXRCdXR0b25IYXJuZXNzXG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgbWVudSB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoOlxuICAgKiAgIC0gYHNlbGVjdG9yYCBmaW5kcyBhIG1lbnUgd2hvc2UgaG9zdCBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKiAgIC0gYGxhYmVsYCBmaW5kcyBhIG1lbnUgd2l0aCBzcGVjaWZpYyBsYWJlbCB0ZXh0LlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IE1lbnVIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRNZW51SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRNZW51SGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigndHJpZ2dlclRleHQnLCBvcHRpb25zLnRyaWdnZXJUZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRyaWdnZXJUZXh0KCksIHRleHQpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIG1lbnUgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIG9wZW4uICovXG4gIGFzeW5jIGlzT3BlbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gISEoYXdhaXQgdGhpcy5fZ2V0TWVudVBhbmVsKCkpO1xuICB9XG5cbiAgYXN5bmMgZ2V0VHJpZ2dlclRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgbWVudSBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZSBhY3Rpb24gaXMgY29tcGxldGUuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIG1lbnUgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIGFzeW5jIG9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFhd2FpdCB0aGlzLmlzT3BlbigpKSB7XG4gICAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBhbmVsID0gYXdhaXQgdGhpcy5fZ2V0TWVudVBhbmVsKCk7XG4gICAgaWYgKHBhbmVsKSB7XG4gICAgICByZXR1cm4gcGFuZWwuc2VuZEtleXMoVGVzdEtleS5FU0NBUEUpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdldEl0ZW1zKGZpbHRlcnM6IE9taXQ8TWVudUl0ZW1IYXJuZXNzRmlsdGVycywgJ2FuY2VzdG9yJz4gPSB7fSk6XG4gICAgICBQcm9taXNlPE1hdE1lbnVJdGVtSGFybmVzc1tdPiB7XG4gICAgY29uc3QgcGFuZWxJZCA9IGF3YWl0IHRoaXMuX2dldFBhbmVsSWQoKTtcbiAgICBpZiAocGFuZWxJZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvckFsbChcbiAgICAgICAgICBNYXRNZW51SXRlbUhhcm5lc3Mud2l0aCh7Li4uZmlsdGVycywgYW5jZXN0b3I6IGAjJHtwYW5lbElkfWB9KSkoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgYXN5bmMgY2xpY2tJdGVtKGZpbHRlcjogT21pdDxNZW51SXRlbUhhcm5lc3NGaWx0ZXJzLCAnYW5jZXN0b3InPixcbiAgICAgICAgICAgICAgICAgIC4uLmZpbHRlcnM6IE9taXQ8TWVudUl0ZW1IYXJuZXNzRmlsdGVycywgJ2FuY2VzdG9yJz5bXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMub3BlbigpO1xuICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRJdGVtcyhmaWx0ZXIpO1xuICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGZpbmQgaXRlbSBtYXRjaGluZyAke0pTT04uc3RyaW5naWZ5KGZpbHRlcil9YCk7XG4gICAgfVxuXG4gICAgaWYgKCFmaWx0ZXJzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGF3YWl0IGl0ZW1zWzBdLmNsaWNrKCk7XG4gICAgfVxuXG4gICAgY29uc3QgbWVudSA9IGF3YWl0IGl0ZW1zWzBdLmdldFN1Ym1lbnUoKTtcbiAgICBpZiAoIW1lbnUpIHtcbiAgICAgIHRocm93IEVycm9yKGBJdGVtIG1hdGNoaW5nICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVyKX0gZG9lcyBub3QgaGF2ZSBhIHN1Ym1lbnVgKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbnUuY2xpY2tJdGVtKC4uLmZpbHRlcnMgYXMgW09taXQ8TWVudUl0ZW1IYXJuZXNzRmlsdGVycywgJ2FuY2VzdG9yJz5dKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX2dldE1lbnVQYW5lbCgpOiBQcm9taXNlPFRlc3RFbGVtZW50IHwgbnVsbD4ge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCB0aGlzLl9nZXRQYW5lbElkKCk7XG4gICAgcmV0dXJuIHBhbmVsSWQgPyB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JPcHRpb25hbChgIyR7cGFuZWxJZH1gKSgpIDogbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX2dldFBhbmVsSWQoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgY29uc3QgcGFuZWxJZCA9IGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XG4gICAgcmV0dXJuIHBhbmVsSWQgfHwgbnVsbDtcbiAgfVxufVxuXG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1tZW51LWl0ZW0gaW4gdGVzdHMuXG4gKiBAZHluYW1pY1xuICovXG5leHBvcnQgY2xhc3MgTWF0TWVudUl0ZW1IYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZW51LWl0ZW0nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIG1lbnUgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSBtZW51IGl0ZW0gd2hvc2UgaG9zdCBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKiAgIC0gYGxhYmVsYCBmaW5kcyBhIG1lbnUgaXRlbSB3aXRoIHNwZWNpZmljIGxhYmVsIHRleHQuXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTWVudUl0ZW1IYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRNZW51SXRlbUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TWVudUl0ZW1IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCkpXG4gICAgICAgIC5hZGRPcHRpb24oJ2hhc1N1Ym1lbnUnLCBvcHRpb25zLmhhc1N1Ym1lbnUsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgaGFzU3VibWVudSkgPT4gKGF3YWl0IGhhcm5lc3MuaGFzU3VibWVudSgpKSA9PT0gaGFzU3VibWVudSk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBtZW51IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIG1lbnUgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBtZW51IGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogQ2xpY2tzIHRoZSBtZW51IGl0ZW0uICovXG4gIGFzeW5jIGNsaWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIGl0ZW0gaGFzIGEgc3VibWVudS4gKi9cbiAgYXN5bmMgaGFzU3VibWVudSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5tYXRjaGVzU2VsZWN0b3IoTWF0TWVudUhhcm5lc3MuaG9zdFNlbGVjdG9yKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzdWJtZW51IGFzc29jaWF0ZWQgd2l0aCB0aGlzIG1lbnUgaXRlbSwgb3IgbnVsbCBpZiBub25lLiAqL1xuICBhc3luYyBnZXRTdWJtZW51KCk6IFByb21pc2U8TWF0TWVudUhhcm5lc3MgfCBudWxsPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaGFzU3VibWVudSgpKSB7XG4gICAgICByZXR1cm4gbmV3IE1hdE1lbnVIYXJuZXNzKHRoaXMubG9jYXRvckZhY3RvcnkpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19