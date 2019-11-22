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
     * Gets a `HarnessPredicate` that can be used to search for a `MatMenuHarness` that meets certain
     * criteria.
     * @param options Options for filtering which menu instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatMenuHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatMenuHarness, options)
            .addOption('triggerText', options.triggerText, function (harness, text) { return HarnessPredicate.stringMatches(harness.getTriggerText(), text); });
    };
    /** Whether the menu is disabled. */
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
    /** Gets the text of the menu's trigger element. */
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
    /** Focuses the menu. */
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
    /** Blurs the menu. */
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
    /** Opens the menu. */
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
    /** Closes the menu. */
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
    /**
     * Gets a list of `MatMenuItemHarness` representing the items in the menu.
     * @param filters Optionally filters which menu items are included.
     */
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
    /**
     * Clicks an item in the menu, and optionally continues clicking items in subsequent sub-menus.
     * @param itemFilter A filter used to represent which item in the menu should be clicked. The
     *     first matching menu item will be clicked.
     * @param subItemFilters A list of filters representing the items to click in any subsequent
     *     sub-menus. The first item in the sub-menu matching the corresponding filter in
     *     `subItemFilters` will be clicked.
     */
    MatMenuHarness.prototype.clickItem = function (itemFilter) {
        var subItemFilters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            subItemFilters[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var items, menu;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.open()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getItems(itemFilter)];
                    case 2:
                        items = _a.sent();
                        if (!items.length) {
                            throw Error("Could not find item matching " + JSON.stringify(itemFilter));
                        }
                        if (!!subItemFilters.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, items[0].click()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [4 /*yield*/, items[0].getSubmenu()];
                    case 5:
                        menu = _a.sent();
                        if (!menu) {
                            throw Error("Item matching " + JSON.stringify(itemFilter) + " does not have a submenu");
                        }
                        return [2 /*return*/, menu.clickItem.apply(menu, __spread(subItemFilters))];
                }
            });
        });
    };
    /** Gets the menu panel associated with this menu. */
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
    /** Gets the id of the menu panel associated with this menu. */
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
    /** The selector for the host element of a `MatMenu` instance. */
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
     * Gets a `HarnessPredicate` that can be used to search for a `MatMenuItemHarness` that meets
     * certain criteria.
     * @param options Options for filtering which menu item instances are considered a match.
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
    /** Whether the menu is disabled. */
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
    /** Gets the text of the menu item. */
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
    /** Focuses the menu item. */
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
    /** Blurs the menu item. */
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
    /** The selector for the host element of a `MatMenuItem` instance. */
    MatMenuItemHarness.hostSelector = '.mat-menu-item';
    return MatMenuItemHarness;
}(ComponentHarness));
export { MatMenuItemHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvdGVzdGluZy9tZW51LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBZSxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUM5RixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUc1RCxpRUFBaUU7QUFDakU7SUFBb0Msa0NBQWdCO0lBQXBEO1FBQUEscUVBa0hDO1FBOUdTLDBCQUFvQixHQUFHLEtBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDOztJQThHbkUsQ0FBQztJQTVHQyw0Q0FBNEM7SUFFNUM7Ozs7O09BS0c7SUFDSSxtQkFBSSxHQUFYLFVBQVksT0FBZ0M7UUFBaEMsd0JBQUEsRUFBQSxZQUFnQztRQUMxQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQzthQUMvQyxTQUFTLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQ3pDLFVBQUMsT0FBTyxFQUFFLElBQUksSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQTlELENBQThELENBQUMsQ0FBQztJQUM3RixDQUFDO0lBRUQsb0NBQW9DO0lBQzlCLG1DQUFVLEdBQWhCOzs7Ozs0QkFDb0IscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzt3QkFBN0IsUUFBUSxHQUFHLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7d0JBQ3RELEtBQUEscUJBQXFCLENBQUE7d0JBQUMscUJBQU0sUUFBUSxFQUFBOzRCQUEzQyxzQkFBTyxrQkFBc0IsU0FBYyxF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TSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFDOzs7O0tBQ3BDO0lBRUQsdUNBQXVDO0lBQ2pDLHVDQUFVLEdBQWhCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs0QkFBekIsc0JBQU8sQ0FBQyxTQUFpQixDQUFDLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsRUFBQzs7OztLQUN6RTtJQUVELHdFQUF3RTtJQUNsRSx1Q0FBVSxHQUFoQjs7Ozs0QkFDTSxxQkFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUE7O3dCQUEzQixJQUFJLFNBQXVCLEVBQUU7NEJBQzNCLHNCQUFPLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBQzt5QkFDaEQ7d0JBQ0Qsc0JBQU8sSUFBSSxFQUFDOzs7O0tBQ2I7SUF0REQscUVBQXFFO0lBQzlELCtCQUFZLEdBQUcsZ0JBQWdCLENBQUM7SUFzRHpDLHlCQUFDO0NBQUEsQUF4REQsQ0FBd0MsZ0JBQWdCLEdBd0R2RDtTQXhEWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBUZXN0RWxlbWVudCwgVGVzdEtleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge01lbnVIYXJuZXNzRmlsdGVycywgTWVudUl0ZW1IYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9tZW51LWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LW1lbnUgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0TWVudUhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRNZW51YCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LW1lbnUtdHJpZ2dlcic7XG5cbiAgcHJpdmF0ZSBfZG9jdW1lbnRSb290TG9jYXRvciA9IHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKTtcblxuICAvLyBUT0RPOiBwb3RlbnRpYWxseSBleHRlbmQgTWF0QnV0dG9uSGFybmVzc1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRNZW51SGFybmVzc2AgdGhhdCBtZWV0cyBjZXJ0YWluXG4gICAqIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggbWVudSBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBNZW51SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TWVudUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TWVudUhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3RyaWdnZXJUZXh0Jywgb3B0aW9ucy50cmlnZ2VyVGV4dCxcbiAgICAgICAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUcmlnZ2VyVGV4dCgpLCB0ZXh0KSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXMgb3Blbi4gKi9cbiAgYXN5bmMgaXNPcGVuKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAhIShhd2FpdCB0aGlzLl9nZXRNZW51UGFuZWwoKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBvZiB0aGUgbWVudSdzIHRyaWdnZXIgZWxlbWVudC4gKi9cbiAgYXN5bmMgZ2V0VHJpZ2dlclRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgbWVudS4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgbWVudS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIG1lbnUuICovXG4gIGFzeW5jIG9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFhd2FpdCB0aGlzLmlzT3BlbigpKSB7XG4gICAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIG1lbnUuICovXG4gIGFzeW5jIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBhbmVsID0gYXdhaXQgdGhpcy5fZ2V0TWVudVBhbmVsKCk7XG4gICAgaWYgKHBhbmVsKSB7XG4gICAgICByZXR1cm4gcGFuZWwuc2VuZEtleXMoVGVzdEtleS5FU0NBUEUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgbGlzdCBvZiBgTWF0TWVudUl0ZW1IYXJuZXNzYCByZXByZXNlbnRpbmcgdGhlIGl0ZW1zIGluIHRoZSBtZW51LlxuICAgKiBAcGFyYW0gZmlsdGVycyBPcHRpb25hbGx5IGZpbHRlcnMgd2hpY2ggbWVudSBpdGVtcyBhcmUgaW5jbHVkZWQuXG4gICAqL1xuICBhc3luYyBnZXRJdGVtcyhmaWx0ZXJzOiBPbWl0PE1lbnVJdGVtSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+ID0ge30pOlxuICAgICAgUHJvbWlzZTxNYXRNZW51SXRlbUhhcm5lc3NbXT4ge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCB0aGlzLl9nZXRQYW5lbElkKCk7XG4gICAgaWYgKHBhbmVsSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoXG4gICAgICAgICAgTWF0TWVudUl0ZW1IYXJuZXNzLndpdGgoey4uLmZpbHRlcnMsIGFuY2VzdG9yOiBgIyR7cGFuZWxJZH1gfSkpKCk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGlja3MgYW4gaXRlbSBpbiB0aGUgbWVudSwgYW5kIG9wdGlvbmFsbHkgY29udGludWVzIGNsaWNraW5nIGl0ZW1zIGluIHN1YnNlcXVlbnQgc3ViLW1lbnVzLlxuICAgKiBAcGFyYW0gaXRlbUZpbHRlciBBIGZpbHRlciB1c2VkIHRvIHJlcHJlc2VudCB3aGljaCBpdGVtIGluIHRoZSBtZW51IHNob3VsZCBiZSBjbGlja2VkLiBUaGVcbiAgICogICAgIGZpcnN0IG1hdGNoaW5nIG1lbnUgaXRlbSB3aWxsIGJlIGNsaWNrZWQuXG4gICAqIEBwYXJhbSBzdWJJdGVtRmlsdGVycyBBIGxpc3Qgb2YgZmlsdGVycyByZXByZXNlbnRpbmcgdGhlIGl0ZW1zIHRvIGNsaWNrIGluIGFueSBzdWJzZXF1ZW50XG4gICAqICAgICBzdWItbWVudXMuIFRoZSBmaXJzdCBpdGVtIGluIHRoZSBzdWItbWVudSBtYXRjaGluZyB0aGUgY29ycmVzcG9uZGluZyBmaWx0ZXIgaW5cbiAgICogICAgIGBzdWJJdGVtRmlsdGVyc2Agd2lsbCBiZSBjbGlja2VkLlxuICAgKi9cbiAgYXN5bmMgY2xpY2tJdGVtKFxuICAgICAgaXRlbUZpbHRlcjogT21pdDxNZW51SXRlbUhhcm5lc3NGaWx0ZXJzLCAnYW5jZXN0b3InPixcbiAgICAgIC4uLnN1Ykl0ZW1GaWx0ZXJzOiBPbWl0PE1lbnVJdGVtSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+W10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLm9wZW4oKTtcbiAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0SXRlbXMoaXRlbUZpbHRlcik7XG4gICAgaWYgKCFpdGVtcy5sZW5ndGgpIHtcbiAgICAgIHRocm93IEVycm9yKGBDb3VsZCBub3QgZmluZCBpdGVtIG1hdGNoaW5nICR7SlNPTi5zdHJpbmdpZnkoaXRlbUZpbHRlcil9YCk7XG4gICAgfVxuXG4gICAgaWYgKCFzdWJJdGVtRmlsdGVycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBhd2FpdCBpdGVtc1swXS5jbGljaygpO1xuICAgIH1cblxuICAgIGNvbnN0IG1lbnUgPSBhd2FpdCBpdGVtc1swXS5nZXRTdWJtZW51KCk7XG4gICAgaWYgKCFtZW51KSB7XG4gICAgICB0aHJvdyBFcnJvcihgSXRlbSBtYXRjaGluZyAke0pTT04uc3RyaW5naWZ5KGl0ZW1GaWx0ZXIpfSBkb2VzIG5vdCBoYXZlIGEgc3VibWVudWApO1xuICAgIH1cbiAgICByZXR1cm4gbWVudS5jbGlja0l0ZW0oLi4uc3ViSXRlbUZpbHRlcnMgYXMgW09taXQ8TWVudUl0ZW1IYXJuZXNzRmlsdGVycywgJ2FuY2VzdG9yJz5dKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtZW51IHBhbmVsIGFzc29jaWF0ZWQgd2l0aCB0aGlzIG1lbnUuICovXG4gIHByaXZhdGUgYXN5bmMgX2dldE1lbnVQYW5lbCgpOiBQcm9taXNlPFRlc3RFbGVtZW50IHwgbnVsbD4ge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCB0aGlzLl9nZXRQYW5lbElkKCk7XG4gICAgcmV0dXJuIHBhbmVsSWQgPyB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JPcHRpb25hbChgIyR7cGFuZWxJZH1gKSgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpZCBvZiB0aGUgbWVudSBwYW5lbCBhc3NvY2lhdGVkIHdpdGggdGhpcyBtZW51LiAqL1xuICBwcml2YXRlIGFzeW5jIF9nZXRQYW5lbElkKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xuICAgIHJldHVybiBwYW5lbElkIHx8IG51bGw7XG4gIH1cbn1cblxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1tZW51LWl0ZW0gaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0TWVudUl0ZW1IYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0TWVudUl0ZW1gIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtbWVudS1pdGVtJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0TWVudUl0ZW1IYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBtZW51IGl0ZW0gaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTWVudUl0ZW1IYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRNZW51SXRlbUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TWVudUl0ZW1IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCkpXG4gICAgICAgIC5hZGRPcHRpb24oJ2hhc1N1Ym1lbnUnLCBvcHRpb25zLmhhc1N1Ym1lbnUsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgaGFzU3VibWVudSkgPT4gKGF3YWl0IGhhcm5lc3MuaGFzU3VibWVudSgpKSA9PT0gaGFzU3VibWVudSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRleHQgb2YgdGhlIG1lbnUgaXRlbS4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBtZW51IGl0ZW0uICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIG1lbnUgaXRlbS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogQ2xpY2tzIHRoZSBtZW51IGl0ZW0uICovXG4gIGFzeW5jIGNsaWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIGl0ZW0gaGFzIGEgc3VibWVudS4gKi9cbiAgYXN5bmMgaGFzU3VibWVudSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5tYXRjaGVzU2VsZWN0b3IoTWF0TWVudUhhcm5lc3MuaG9zdFNlbGVjdG9yKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzdWJtZW51IGFzc29jaWF0ZWQgd2l0aCB0aGlzIG1lbnUgaXRlbSwgb3IgbnVsbCBpZiBub25lLiAqL1xuICBhc3luYyBnZXRTdWJtZW51KCk6IFByb21pc2U8TWF0TWVudUhhcm5lc3MgfCBudWxsPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaGFzU3VibWVudSgpKSB7XG4gICAgICByZXR1cm4gbmV3IE1hdE1lbnVIYXJuZXNzKHRoaXMubG9jYXRvckZhY3RvcnkpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19