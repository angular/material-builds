(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/testing'), require('@angular/cdk/coercion')) :
    typeof define === 'function' && define.amd ? define('@angular/material/menu/testing', ['exports', 'tslib', '@angular/cdk/testing', '@angular/cdk/coercion'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.menu = global.ng.material.menu || {}, global.ng.material.menu.testing = {}), global.tslib, global.ng.cdk.testing, global.ng.cdk.coercion));
}(this, function (exports, tslib_1, testing, coercion) { 'use strict';

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
            return new testing.HarnessPredicate(MatMenuHarness, options)
                .addOption('text', options.triggerText, function (harness, text) { return testing.HarnessPredicate.stringMatches(harness.getTriggerText(), text); });
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
                            _a = coercion.coerceBooleanProperty;
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
    }(testing.ComponentHarness));

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
    var MatMenuItemHarness = /** @class */ (function (_super) {
        tslib_1.__extends(MatMenuItemHarness, _super);
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
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatMenuItemHarness, options); // TODO: add options here
        };
        /** Gets a boolean promise indicating if the menu is disabled. */
        MatMenuItemHarness.prototype.isDisabled = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var disabled, _a;
                return tslib_1.__generator(this, function (_b) {
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
        MatMenuItemHarness.prototype.focus = function () {
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
        MatMenuItemHarness.prototype.blur = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).blur()];
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
