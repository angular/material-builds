import { __extends, __awaiter, __generator, __assign, __spread } from 'tslib';
import { HarnessPredicate, TestKey, ComponentHarness } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export { MatMenuHarness, MatMenuItemHarness };
//# sourceMappingURL=testing.js.map
