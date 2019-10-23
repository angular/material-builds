(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/testing'), require('@angular/cdk/coercion')) :
    typeof define === 'function' && define.amd ? define('@angular/material/menu/testing', ['exports', 'tslib', '@angular/cdk/testing', '@angular/cdk/coercion'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.menu = global.ng.material.menu || {}, global.ng.material.menu.testing = {}), global.tslib, global.ng.cdk.testing, global.ng.cdk.coercion));
}(this, function (exports, tslib, testing, coercion) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Harness for interacting with a standard mat-menu in tests.
     * @dynamic
     */
    var MatMenuHarness = /** @class */ (function (_super) {
        tslib.__extends(MatMenuHarness, _super);
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
            return new testing.HarnessPredicate(MatMenuHarness, options)
                .addOption('triggerText', options.triggerText, function (harness, text) { return testing.HarnessPredicate.stringMatches(harness.getTriggerText(), text); });
        };
        /** Gets a boolean promise indicating if the menu is disabled. */
        MatMenuHarness.prototype.isDisabled = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var disabled, _a;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1:
                            disabled = (_b.sent()).getAttribute('disabled');
                            _a = coercion.coerceBooleanProperty;
                            return [4 /*yield*/, disabled];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Whether the menu is open. */
        MatMenuHarness.prototype.isOpen = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._getMenuPanel()];
                        case 1: return [2 /*return*/, !!(_a.sent())];
                    }
                });
            });
        };
        MatMenuHarness.prototype.getTriggerText = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).text()];
                    }
                });
            });
        };
        /** Focuses the menu and returns a void promise that indicates when the action is complete. */
        MatMenuHarness.prototype.focus = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).focus()];
                    }
                });
            });
        };
        /** Blurs the menu and returns a void promise that indicates when the action is complete. */
        MatMenuHarness.prototype.blur = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).blur()];
                    }
                });
            });
        };
        MatMenuHarness.prototype.open = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
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
            return tslib.__awaiter(this, void 0, void 0, function () {
                var panel;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._getMenuPanel()];
                        case 1:
                            panel = _a.sent();
                            if (panel) {
                                return [2 /*return*/, panel.sendKeys(testing.TestKey.ESCAPE)];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        MatMenuHarness.prototype.getItems = function (filters) {
            if (filters === void 0) { filters = {}; }
            return tslib.__awaiter(this, void 0, void 0, function () {
                var panelId;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._getPanelId()];
                        case 1:
                            panelId = _a.sent();
                            if (panelId) {
                                return [2 /*return*/, this._documentRootLocator.locatorForAll(MatMenuItemHarness.with(tslib.__assign(tslib.__assign({}, filters), { ancestor: "#" + panelId })))()];
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
            return tslib.__awaiter(this, void 0, void 0, function () {
                var items, menu;
                return tslib.__generator(this, function (_a) {
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
                            return [2 /*return*/, menu.clickItem.apply(menu, tslib.__spread(filters))];
                    }
                });
            });
        };
        MatMenuHarness.prototype._getMenuPanel = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var panelId;
                return tslib.__generator(this, function (_a) {
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
            return tslib.__awaiter(this, void 0, void 0, function () {
                var panelId;
                return tslib.__generator(this, function (_a) {
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
    }(testing.ComponentHarness));
    /**
     * Harness for interacting with a standard mat-menu-item in tests.
     * @dynamic
     */
    var MatMenuItemHarness = /** @class */ (function (_super) {
        tslib.__extends(MatMenuItemHarness, _super);
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
            return new testing.HarnessPredicate(MatMenuItemHarness, options)
                .addOption('text', options.text, function (harness, text) { return testing.HarnessPredicate.stringMatches(harness.getText(), text); })
                .addOption('hasSubmenu', options.hasSubmenu, function (harness, hasSubmenu) { return tslib.__awaiter(_this, void 0, void 0, function () { return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, harness.hasSubmenu()];
                    case 1: return [2 /*return*/, (_a.sent()) === hasSubmenu];
                }
            }); }); });
        };
        /** Gets a boolean promise indicating if the menu is disabled. */
        MatMenuItemHarness.prototype.isDisabled = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var disabled, _a;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1:
                            disabled = (_b.sent()).getAttribute('disabled');
                            _a = coercion.coerceBooleanProperty;
                            return [4 /*yield*/, disabled];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        MatMenuItemHarness.prototype.getText = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).text()];
                    }
                });
            });
        };
        /** Focuses the menu and returns a void promise that indicates when the action is complete. */
        MatMenuItemHarness.prototype.focus = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).focus()];
                    }
                });
            });
        };
        /** Blurs the menu and returns a void promise that indicates when the action is complete. */
        MatMenuItemHarness.prototype.blur = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).blur()];
                    }
                });
            });
        };
        /** Clicks the menu item. */
        MatMenuItemHarness.prototype.click = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).click()];
                    }
                });
            });
        };
        /** Whether this item has a submenu. */
        MatMenuItemHarness.prototype.hasSubmenu = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).matchesSelector(MatMenuHarness.hostSelector)];
                    }
                });
            });
        };
        /** Gets the submenu associated with this menu item, or null if none. */
        MatMenuItemHarness.prototype.getSubmenu = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
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
    }(testing.ComponentHarness));

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

    exports.MatMenuHarness = MatMenuHarness;
    exports.MatMenuItemHarness = MatMenuItemHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=material-menu-testing.umd.js.map
