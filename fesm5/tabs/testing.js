import { __extends, __awaiter, __generator } from 'tslib';
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Angular Material tab-label in tests. */
var MatTabHarness = /** @class */ (function (_super) {
    __extends(MatTabHarness, _super);
    function MatTabHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a tab with specific attributes.
     */
    MatTabHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatTabHarness, options)
            .addOption('label', options.label, function (harness, label) { return HarnessPredicate.stringMatches(harness.getLabel(), label); });
    };
    /** Gets the label of the tab. */
    MatTabHarness.prototype.getLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Gets the aria label of the tab. */
    MatTabHarness.prototype.getAriaLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-label')];
                }
            });
        });
    };
    /** Gets the value of the "aria-labelledby" attribute. */
    MatTabHarness.prototype.getAriaLabelledby = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-labelledby')];
                }
            });
        });
    };
    /** Whether the tab is selected. */
    MatTabHarness.prototype.isSelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hostEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        hostEl = _a.sent();
                        return [4 /*yield*/, hostEl.getAttribute('aria-selected')];
                    case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                }
            });
        });
    };
    /** Whether the tab is disabled. */
    MatTabHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hostEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        hostEl = _a.sent();
                        return [4 /*yield*/, hostEl.getAttribute('aria-disabled')];
                    case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                }
            });
        });
    };
    /**
     * Selects the given tab by clicking on the label. Tab cannot be
     * selected if disabled.
     */
    MatTabHarness.prototype.select = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Gets the text content of the tab. */
    MatTabHarness.prototype.getTextContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contentId, contentEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getContentId()];
                    case 1:
                        contentId = _a.sent();
                        return [4 /*yield*/, this.documentRootLocatorFactory().locatorFor("#" + contentId)()];
                    case 2:
                        contentEl = _a.sent();
                        return [2 /*return*/, contentEl.text()];
                }
            });
        });
    };
    /**
     * Gets a `HarnessLoader` that can be used to load harnesses for components within the tab's
     * content area.
     */
    MatTabHarness.prototype.getHarnessLoaderForContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contentId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getContentId()];
                    case 1:
                        contentId = _a.sent();
                        return [2 /*return*/, this.documentRootLocatorFactory().harnessLoaderFor("#" + contentId)];
                }
            });
        });
    };
    /** Gets the element id for the content of the current tab. */
    MatTabHarness.prototype._getContentId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hostEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        hostEl = _a.sent();
                        return [4 /*yield*/, hostEl.getAttribute('aria-controls')];
                    case 2: 
                    // Tabs never have an empty "aria-controls" attribute.
                    return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    MatTabHarness.hostSelector = '.mat-tab-label';
    return MatTabHarness;
}(ComponentHarness));

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-tab-group in tests. */
var MatTabGroupHarness = /** @class */ (function (_super) {
    __extends(MatTabGroupHarness, _super);
    function MatTabGroupHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a radio-button with
     * specific attributes.
     * @param options Options for narrowing the search
     *   - `selector` finds a tab-group whose host element matches the given selector.
     *   - `selectedTabLabel` finds a tab-group with a selected tab that matches the
     *      specified tab label.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatTabGroupHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatTabGroupHarness, options)
            .addOption('selectedTabLabel', options.selectedTabLabel, function (harness, label) { return __awaiter(_this, void 0, void 0, function () {
            var selectedTab, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, harness.getSelectedTab()];
                    case 1:
                        selectedTab = _c.sent();
                        _b = (_a = HarnessPredicate).stringMatches;
                        return [4 /*yield*/, selectedTab.getLabel()];
                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent(), label])];
                }
            });
        }); });
    };
    /** Gets all tabs of the tab group. */
    MatTabGroupHarness.prototype.getTabs = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatTabHarness.with(filter))()];
            });
        });
    };
    /** Gets the selected tab of the tab group. */
    MatTabGroupHarness.prototype.getSelectedTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabs, isSelected, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTabs()];
                    case 1:
                        tabs = _a.sent();
                        return [4 /*yield*/, Promise.all(tabs.map(function (t) { return t.isSelected(); }))];
                    case 2:
                        isSelected = _a.sent();
                        for (i = 0; i < tabs.length; i++) {
                            if (isSelected[i]) {
                                return [2 /*return*/, tabs[i]];
                            }
                        }
                        throw new Error('No selected tab could be found.');
                }
            });
        });
    };
    /** Selects a tab in this tab group. */
    MatTabGroupHarness.prototype.selectTab = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var tabs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTabs(filter)];
                    case 1:
                        tabs = _a.sent();
                        if (!tabs.length) {
                            throw Error("Cannot find mat-tab matching filter " + JSON.stringify(filter));
                        }
                        return [4 /*yield*/, tabs[0].select()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MatTabGroupHarness.hostSelector = '.mat-tab-group';
    return MatTabGroupHarness;
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

export { MatTabGroupHarness, MatTabHarness };
//# sourceMappingURL=testing.js.map
