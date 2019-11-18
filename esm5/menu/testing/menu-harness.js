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
/** Harness for interacting with a standard mat-menu in tests. */
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
/** Harness for interacting with a standard mat-menu-item in tests. */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvdGVzdGluZy9tZW51LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBZSxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUM5RixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUc1RCxpRUFBaUU7QUFDakU7SUFBb0Msa0NBQWdCO0lBQXBEO1FBQUEscUVBZ0dDO1FBN0ZTLDBCQUFvQixHQUFHLEtBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDOztJQTZGbkUsQ0FBQztJQTNGQyw0Q0FBNEM7SUFFNUM7Ozs7OztPQU1HO0lBQ0ksbUJBQUksR0FBWCxVQUFZLE9BQWdDO1FBQWhDLHdCQUFBLEVBQUEsWUFBZ0M7UUFDMUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUM7YUFDL0MsU0FBUyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsV0FBVyxFQUN6QyxVQUFDLE9BQU8sRUFBRSxJQUFJLElBQUssT0FBQSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUE5RCxDQUE4RCxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUVELGlFQUFpRTtJQUMzRCxtQ0FBVSxHQUFoQjs7Ozs7NEJBQ29CLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQTdCLFFBQVEsR0FBRyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO3dCQUN0RCxLQUFBLHFCQUFxQixDQUFBO3dCQUFDLHFCQUFNLFFBQVEsRUFBQTs0QkFBM0Msc0JBQU8sa0JBQXNCLFNBQWMs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QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEVBQUM7Ozs7S0FDekU7SUFFRCx3RUFBd0U7SUFDbEUsdUNBQVUsR0FBaEI7Ozs7NEJBQ00scUJBQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFBOzt3QkFBM0IsSUFBSSxTQUF1QixFQUFFOzRCQUMzQixzQkFBTyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUM7eUJBQ2hEO3dCQUNELHNCQUFPLElBQUksRUFBQzs7OztLQUNiO0lBckRNLCtCQUFZLEdBQUcsZ0JBQWdCLENBQUM7SUFzRHpDLHlCQUFDO0NBQUEsQUF2REQsQ0FBd0MsZ0JBQWdCLEdBdUR2RDtTQXZEWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBUZXN0RWxlbWVudCwgVGVzdEtleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge01lbnVIYXJuZXNzRmlsdGVycywgTWVudUl0ZW1IYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9tZW51LWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LW1lbnUgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0TWVudUhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LW1lbnUtdHJpZ2dlcic7XG5cbiAgcHJpdmF0ZSBfZG9jdW1lbnRSb290TG9jYXRvciA9IHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKTtcblxuICAvLyBUT0RPOiBwb3RlbnRpYWxseSBleHRlbmQgTWF0QnV0dG9uSGFybmVzc1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIG1lbnUgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSBtZW51IHdob3NlIGhvc3QgZWxlbWVudCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3Rvci5cbiAgICogICAtIGBsYWJlbGAgZmluZHMgYSBtZW51IHdpdGggc3BlY2lmaWMgbGFiZWwgdGV4dC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBNZW51SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TWVudUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TWVudUhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3RyaWdnZXJUZXh0Jywgb3B0aW9ucy50cmlnZ2VyVGV4dCxcbiAgICAgICAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUcmlnZ2VyVGV4dCgpLCB0ZXh0KSk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBtZW51IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBvcGVuLiAqL1xuICBhc3luYyBpc09wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEhKGF3YWl0IHRoaXMuX2dldE1lbnVQYW5lbCgpKTtcbiAgfVxuXG4gIGFzeW5jIGdldFRyaWdnZXJUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIG1lbnUgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBtZW51IGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICBhc3luYyBvcGVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghYXdhaXQgdGhpcy5pc09wZW4oKSkge1xuICAgICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuY2xpY2soKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwYW5lbCA9IGF3YWl0IHRoaXMuX2dldE1lbnVQYW5lbCgpO1xuICAgIGlmIChwYW5lbCkge1xuICAgICAgcmV0dXJuIHBhbmVsLnNlbmRLZXlzKFRlc3RLZXkuRVNDQVBFKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBnZXRJdGVtcyhmaWx0ZXJzOiBPbWl0PE1lbnVJdGVtSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+ID0ge30pOlxuICAgICAgUHJvbWlzZTxNYXRNZW51SXRlbUhhcm5lc3NbXT4ge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCB0aGlzLl9nZXRQYW5lbElkKCk7XG4gICAgaWYgKHBhbmVsSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoXG4gICAgICAgICAgTWF0TWVudUl0ZW1IYXJuZXNzLndpdGgoey4uLmZpbHRlcnMsIGFuY2VzdG9yOiBgIyR7cGFuZWxJZH1gfSkpKCk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGFzeW5jIGNsaWNrSXRlbShmaWx0ZXI6IE9taXQ8TWVudUl0ZW1IYXJuZXNzRmlsdGVycywgJ2FuY2VzdG9yJz4sXG4gICAgICAgICAgICAgICAgICAuLi5maWx0ZXJzOiBPbWl0PE1lbnVJdGVtSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+W10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLm9wZW4oKTtcbiAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0SXRlbXMoZmlsdGVyKTtcbiAgICBpZiAoIWl0ZW1zLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGl0ZW0gbWF0Y2hpbmcgJHtKU09OLnN0cmluZ2lmeShmaWx0ZXIpfWApO1xuICAgIH1cblxuICAgIGlmICghZmlsdGVycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBhd2FpdCBpdGVtc1swXS5jbGljaygpO1xuICAgIH1cblxuICAgIGNvbnN0IG1lbnUgPSBhd2FpdCBpdGVtc1swXS5nZXRTdWJtZW51KCk7XG4gICAgaWYgKCFtZW51KSB7XG4gICAgICB0aHJvdyBFcnJvcihgSXRlbSBtYXRjaGluZyAke0pTT04uc3RyaW5naWZ5KGZpbHRlcil9IGRvZXMgbm90IGhhdmUgYSBzdWJtZW51YCk7XG4gICAgfVxuICAgIHJldHVybiBtZW51LmNsaWNrSXRlbSguLi5maWx0ZXJzIGFzIFtPbWl0PE1lbnVJdGVtSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+XSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9nZXRNZW51UGFuZWwoKTogUHJvbWlzZTxUZXN0RWxlbWVudCB8IG51bGw+IHtcbiAgICBjb25zdCBwYW5lbElkID0gYXdhaXQgdGhpcy5fZ2V0UGFuZWxJZCgpO1xuICAgIHJldHVybiBwYW5lbElkID8gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yT3B0aW9uYWwoYCMke3BhbmVsSWR9YCkoKSA6IG51bGw7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9nZXRQYW5lbElkKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xuICAgIHJldHVybiBwYW5lbElkIHx8IG51bGw7XG4gIH1cbn1cblxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1tZW51LWl0ZW0gaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0TWVudUl0ZW1IYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZW51LWl0ZW0nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIG1lbnUgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSBtZW51IGl0ZW0gd2hvc2UgaG9zdCBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKiAgIC0gYGxhYmVsYCBmaW5kcyBhIG1lbnUgaXRlbSB3aXRoIHNwZWNpZmljIGxhYmVsIHRleHQuXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTWVudUl0ZW1IYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRNZW51SXRlbUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TWVudUl0ZW1IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCkpXG4gICAgICAgIC5hZGRPcHRpb24oJ2hhc1N1Ym1lbnUnLCBvcHRpb25zLmhhc1N1Ym1lbnUsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgaGFzU3VibWVudSkgPT4gKGF3YWl0IGhhcm5lc3MuaGFzU3VibWVudSgpKSA9PT0gaGFzU3VibWVudSk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBtZW51IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIG1lbnUgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBtZW51IGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogQ2xpY2tzIHRoZSBtZW51IGl0ZW0uICovXG4gIGFzeW5jIGNsaWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIGl0ZW0gaGFzIGEgc3VibWVudS4gKi9cbiAgYXN5bmMgaGFzU3VibWVudSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5tYXRjaGVzU2VsZWN0b3IoTWF0TWVudUhhcm5lc3MuaG9zdFNlbGVjdG9yKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzdWJtZW51IGFzc29jaWF0ZWQgd2l0aCB0aGlzIG1lbnUgaXRlbSwgb3IgbnVsbCBpZiBub25lLiAqL1xuICBhc3luYyBnZXRTdWJtZW51KCk6IFByb21pc2U8TWF0TWVudUhhcm5lc3MgfCBudWxsPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaGFzU3VibWVudSgpKSB7XG4gICAgICByZXR1cm4gbmV3IE1hdE1lbnVIYXJuZXNzKHRoaXMubG9jYXRvckZhY3RvcnkpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19