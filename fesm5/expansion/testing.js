import { __extends, __awaiter, __generator } from 'tslib';
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var EXPANSION_PANEL_CONTENT_SELECTOR = '.mat-expansion-panel-content';
/** Harness for interacting with a standard mat-expansion-panel in tests. */
var MatExpansionPanelHarness = /** @class */ (function (_super) {
    __extends(MatExpansionPanelHarness, _super);
    function MatExpansionPanelHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._header = _this.locatorFor('.mat-expansion-panel-header');
        _this._title = _this.locatorForOptional('.mat-expansion-panel-header-title');
        _this._description = _this.locatorForOptional('.mat-expansion-panel-header-description');
        _this._expansionIndicator = _this.locatorForOptional('.mat-expansion-indicator');
        _this._content = _this.locatorFor(EXPANSION_PANEL_CONTENT_SELECTOR);
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for an expansion-panel
     * with specific attributes.
     * @param options Options for narrowing the search:
     *   - `title` finds an expansion-panel with a specific title text.
     *   - `description` finds an expansion-panel with a specific description text.
     *   - `expanded` finds an expansion-panel that is currently expanded.
     *   - `disabled` finds an expansion-panel that is disabled.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatExpansionPanelHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatExpansionPanelHarness, options)
            .addOption('title', options.title, function (harness, title) { return HarnessPredicate.stringMatches(harness.getTitle(), title); })
            .addOption('description', options.description, function (harness, description) {
            return HarnessPredicate.stringMatches(harness.getDescription(), description);
        })
            .addOption('content', options.content, function (harness, content) { return HarnessPredicate.stringMatches(harness.getTextContent(), content); })
            .addOption('expanded', options.expanded, function (harness, expanded) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.isExpanded()];
                case 1: return [2 /*return*/, (_a.sent()) === expanded];
            }
        }); }); })
            .addOption('disabled', options.disabled, function (harness, disabled) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.isDisabled()];
                case 1: return [2 /*return*/, (_a.sent()) === disabled];
            }
        }); }); });
    };
    /** Whether the panel is expanded. */
    MatExpansionPanelHarness.prototype.isExpanded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-expanded')];
                }
            });
        });
    };
    /**
     * Gets the title text of the panel.
     * @returns Title text or `null` if no title is set up.
     */
    MatExpansionPanelHarness.prototype.getTitle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var titleEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._title()];
                    case 1:
                        titleEl = _a.sent();
                        return [2 /*return*/, titleEl ? titleEl.text() : null];
                }
            });
        });
    };
    /**
     * Gets the description text of the panel.
     * @returns Description text or `null` if no description is set up.
     */
    MatExpansionPanelHarness.prototype.getDescription = function () {
        return __awaiter(this, void 0, void 0, function () {
            var descriptionEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._description()];
                    case 1:
                        descriptionEl = _a.sent();
                        return [2 /*return*/, descriptionEl ? descriptionEl.text() : null];
                }
            });
        });
    };
    /** Whether the panel is disabled. */
    MatExpansionPanelHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._header()];
                    case 1: return [4 /*yield*/, (_a.sent()).getAttribute('aria-disabled')];
                    case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                }
            });
        });
    };
    /**
     * Toggles the expanded state of the panel by clicking on the panel
     * header. This method will not work if the panel is disabled.
     */
    MatExpansionPanelHarness.prototype.toggle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._header()];
                    case 1: return [4 /*yield*/, (_a.sent()).click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Expands the expansion panel if collapsed. */
    MatExpansionPanelHarness.prototype.expand = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isExpanded()];
                    case 1:
                        if (!!(_a.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.toggle()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /** Collapses the expansion panel if expanded. */
    MatExpansionPanelHarness.prototype.collapse = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isExpanded()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.toggle()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /** Gets the text content of the panel. */
    MatExpansionPanelHarness.prototype.getTextContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._content()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /**
     * Gets a `HarnessLoader` that can be used to load harnesses for
     * components within the panel's content area.
     */
    MatExpansionPanelHarness.prototype.getHarnessLoaderForContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorFactory.harnessLoaderFor(EXPANSION_PANEL_CONTENT_SELECTOR)];
            });
        });
    };
    /** Focuses the panel. */
    MatExpansionPanelHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._header()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the panel. */
    MatExpansionPanelHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._header()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /** Whether the panel has a toggle indicator displayed. */
    MatExpansionPanelHarness.prototype.hasToggleIndicator = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._expansionIndicator()];
                    case 1: return [2 /*return*/, (_a.sent()) !== null];
                }
            });
        });
    };
    /** Gets the position of the toggle indicator. */
    MatExpansionPanelHarness.prototype.getToggleIndicatorPosition = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._header()];
                    case 1: return [4 /*yield*/, (_a.sent()).hasClass('mat-expansion-toggle-indicator-before')];
                    case 2:
                        // By default the expansion indicator will show "after" the panel header content.
                        if (_a.sent()) {
                            return [2 /*return*/, 'before'];
                        }
                        return [2 /*return*/, 'after'];
                }
            });
        });
    };
    MatExpansionPanelHarness.hostSelector = '.mat-expansion-panel';
    return MatExpansionPanelHarness;
}(ComponentHarness));

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-accordion in tests. */
var MatAccordionHarness = /** @class */ (function (_super) {
    __extends(MatAccordionHarness, _super);
    function MatAccordionHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for an accordion
     * with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatAccordionHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatAccordionHarness, options);
    };
    /** Gets all expansion panels which are part of the accordion. */
    MatAccordionHarness.prototype.getExpansionPanels = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatExpansionPanelHarness.with(filter))()];
            });
        });
    };
    /** Whether the accordion allows multiple expanded panels simultaneously. */
    MatAccordionHarness.prototype.isMulti = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-accordion-multi')];
                }
            });
        });
    };
    MatAccordionHarness.hostSelector = '.mat-accordion';
    return MatAccordionHarness;
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

export { MatAccordionHarness, MatExpansionPanelHarness };
//# sourceMappingURL=testing.js.map
