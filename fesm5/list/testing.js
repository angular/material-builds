import { __extends, __awaiter, __generator, __values, __spread } from 'tslib';
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';
import { MatDividerHarness } from '@angular/material/divider/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Gets a `HarnessPredicate` that applies the given `BaseListItemHarnessFilters` to the given
 * list item harness.
 * @template H The type of list item harness to create a predicate for.
 * @param harnessType A constructor for a list item harness.
 * @param options An instance of `BaseListItemHarnessFilters` to apply.
 * @return A `HarnessPredicate` for the given harness type with the given options applied.
 */
function getListItemPredicate(harnessType, options) {
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

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Shared behavior among the harnesses for the various `MatList` flavors.
 * @template T A constructor type for a list item harness type used by this list harness.
 * @template C The list item harness type that `T` constructs.
 * @template F The filter type used filter list item harness of type `C`.
 * @docs-private
 */
var MatListHarnessBase = /** @class */ (function (_super) {
    __extends(MatListHarnessBase, _super);
    function MatListHarnessBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a list of harnesses representing the items in this list.
     * @param filters Optional filters used to narrow which harnesses are included
     * @return The list of items matching the given filters.
     */
    MatListHarnessBase.prototype.getItems = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(this._itemHarness.with(filters))()];
            });
        });
    };
    /**
     * Gets a list of `ListSection` representing the list items grouped by subheaders. If the list has
     * no subheaders it is represented as a single `ListSection` with an undefined `heading` property.
     * @param filters Optional filters used to narrow which list item harnesses are included
     * @return The list of items matching the given filters, grouped into sections by subheader.
     */
    MatListHarnessBase.prototype.getItemsGroupedBySubheader = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var listSections, currentSection, itemsAndSubheaders, itemsAndSubheaders_1, itemsAndSubheaders_1_1, itemOrSubheader, _a, e_1_1;
            var e_1, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        listSections = [];
                        currentSection = { items: [] };
                        return [4 /*yield*/, this.getItemsWithSubheadersAndDividers({ item: filters, divider: false })];
                    case 1:
                        itemsAndSubheaders = _c.sent();
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 8, 9, 10]);
                        itemsAndSubheaders_1 = __values(itemsAndSubheaders), itemsAndSubheaders_1_1 = itemsAndSubheaders_1.next();
                        _c.label = 3;
                    case 3:
                        if (!!itemsAndSubheaders_1_1.done) return [3 /*break*/, 7];
                        itemOrSubheader = itemsAndSubheaders_1_1.value;
                        if (!(itemOrSubheader instanceof MatSubheaderHarness)) return [3 /*break*/, 5];
                        if (currentSection.heading !== undefined || currentSection.items.length) {
                            listSections.push(currentSection);
                        }
                        _a = {};
                        return [4 /*yield*/, itemOrSubheader.getText()];
                    case 4:
                        currentSection = (_a.heading = _c.sent(), _a.items = [], _a);
                        return [3 /*break*/, 6];
                    case 5:
                        currentSection.items.push(itemOrSubheader);
                        _c.label = 6;
                    case 6:
                        itemsAndSubheaders_1_1 = itemsAndSubheaders_1.next();
                        return [3 /*break*/, 3];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _c.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (itemsAndSubheaders_1_1 && !itemsAndSubheaders_1_1.done && (_b = itemsAndSubheaders_1.return)) _b.call(itemsAndSubheaders_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        if (currentSection.heading !== undefined || currentSection.items.length ||
                            !listSections.length) {
                            listSections.push(currentSection);
                        }
                        return [2 /*return*/, listSections];
                }
            });
        });
    };
    /**
     * Gets a list of sub-lists representing the list items grouped by dividers. If the list has no
     * dividers it is represented as a list with a single sub-list.
     * @param filters Optional filters used to narrow which list item harnesses are included
     * @return The list of items matching the given filters, grouped into sub-lists by divider.
     */
    MatListHarnessBase.prototype.getItemsGroupedByDividers = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var listSections, itemsAndDividers, itemsAndDividers_1, itemsAndDividers_1_1, itemOrDivider;
            var e_2, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        listSections = [[]];
                        return [4 /*yield*/, this.getItemsWithSubheadersAndDividers({ item: filters, subheader: false })];
                    case 1:
                        itemsAndDividers = _b.sent();
                        try {
                            for (itemsAndDividers_1 = __values(itemsAndDividers), itemsAndDividers_1_1 = itemsAndDividers_1.next(); !itemsAndDividers_1_1.done; itemsAndDividers_1_1 = itemsAndDividers_1.next()) {
                                itemOrDivider = itemsAndDividers_1_1.value;
                                if (itemOrDivider instanceof MatDividerHarness) {
                                    listSections.push([]);
                                }
                                else {
                                    listSections[listSections.length - 1].push(itemOrDivider);
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (itemsAndDividers_1_1 && !itemsAndDividers_1_1.done && (_a = itemsAndDividers_1.return)) _a.call(itemsAndDividers_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        return [2 /*return*/, listSections];
                }
            });
        });
    };
    MatListHarnessBase.prototype.getItemsWithSubheadersAndDividers = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                query = [];
                if (filters.item !== false) {
                    query.push(this._itemHarness.with(filters.item || {}));
                }
                if (filters.subheader !== false) {
                    query.push(MatSubheaderHarness.with(filters.subheader));
                }
                if (filters.divider !== false) {
                    query.push(MatDividerHarness.with(filters.divider));
                }
                return [2 /*return*/, this.locatorForAll.apply(this, __spread(query))()];
            });
        });
    };
    return MatListHarnessBase;
}(ComponentHarness));

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-action-list in tests. */
var MatActionListHarness = /** @class */ (function (_super) {
    __extends(MatActionListHarness, _super);
    function MatActionListHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._itemHarness = MatActionListItemHarness;
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatActionListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which action list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatActionListHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatActionListHarness, options);
    };
    /** The selector for the host element of a `MatActionList` instance. */
    MatActionListHarness.hostSelector = 'mat-action-list';
    return MatActionListHarness;
}(MatListHarnessBase));
/** Harness for interacting with an action list item. */
var MatActionListItemHarness = /** @class */ (function (_super) {
    __extends(MatActionListItemHarness, _super);
    function MatActionListItemHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatActionListItemHarness` that
     * meets certain criteria.
     * @param options Options for filtering which action list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatActionListItemHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return getListItemPredicate(MatActionListItemHarness, options);
    };
    /** Clicks on the action list item. */
    MatActionListItemHarness.prototype.click = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).click()];
                }
            });
        });
    };
    /** Focuses the action list item. */
    MatActionListItemHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the action list item. */
    MatActionListItemHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /** The selector for the host element of a `MatListItem` instance. */
    MatActionListItemHarness.hostSelector = ['mat-list-item', 'a[mat-list-item]', 'button[mat-list-item]']
        .map(function (selector) { return MatActionListHarness.hostSelector + " " + selector; })
        .join(',');
    return MatActionListItemHarness;
}(MatListItemHarnessBase));

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-list in tests. */
var MatListHarness = /** @class */ (function (_super) {
    __extends(MatListHarness, _super);
    function MatListHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._itemHarness = MatListItemHarness;
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListHarness` that meets certain
     * criteria.
     * @param options Options for filtering which list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatListHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatListHarness, options);
    };
    /** The selector for the host element of a `MatList` instance. */
    MatListHarness.hostSelector = 'mat-list';
    return MatListHarness;
}(MatListHarnessBase));
/** Harness for interacting with a list item. */
var MatListItemHarness = /** @class */ (function (_super) {
    __extends(MatListItemHarness, _super);
    function MatListItemHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListItemHarness` that meets
     * certain criteria.
     * @param options Options for filtering which list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatListItemHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return getListItemPredicate(MatListItemHarness, options);
    };
    /** The selector for the host element of a `MatListItem` instance. */
    MatListItemHarness.hostSelector = ['mat-list-item', 'a[mat-list-item]', 'button[mat-list-item]']
        .map(function (selector) { return MatListHarness.hostSelector + " " + selector; })
        .join(',');
    return MatListItemHarness;
}(MatListItemHarnessBase));

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-nav-list in tests. */
var MatNavListHarness = /** @class */ (function (_super) {
    __extends(MatNavListHarness, _super);
    function MatNavListHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._itemHarness = MatNavListItemHarness;
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNavListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which nav list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatNavListHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatNavListHarness, options);
    };
    /** The selector for the host element of a `MatNavList` instance. */
    MatNavListHarness.hostSelector = 'mat-nav-list';
    return MatNavListHarness;
}(MatListHarnessBase));
/** Harness for interacting with a nav list item. */
var MatNavListItemHarness = /** @class */ (function (_super) {
    __extends(MatNavListItemHarness, _super);
    function MatNavListItemHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNavListItemHarness` that
     * meets certain criteria.
     * @param options Options for filtering which nav list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatNavListItemHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return getListItemPredicate(MatNavListItemHarness, options)
            .addOption('href', options.href, function (harness, href) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, HarnessPredicate.stringMatches(harness.getHref(), href)];
        }); }); });
    };
    /** Gets the href for this nav list item. */
    MatNavListItemHarness.prototype.getHref = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('href')];
                }
            });
        });
    };
    /** Clicks on the nav list item. */
    MatNavListItemHarness.prototype.click = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).click()];
                }
            });
        });
    };
    /** Focuses the nav list item. */
    MatNavListItemHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the nav list item. */
    MatNavListItemHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /** The selector for the host element of a `MatListItem` instance. */
    MatNavListItemHarness.hostSelector = ['mat-list-item', 'a[mat-list-item]', 'button[mat-list-item]']
        .map(function (selector) { return MatNavListHarness.hostSelector + " " + selector; })
        .join(',');
    return MatNavListItemHarness;
}(MatListItemHarnessBase));

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-selection-list in tests. */
var MatSelectionListHarness = /** @class */ (function (_super) {
    __extends(MatSelectionListHarness, _super);
    function MatSelectionListHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._itemHarness = MatListOptionHarness;
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSelectionListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which selection list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatSelectionListHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatSelectionListHarness, options);
    };
    /** Whether the selection list is disabled. */
    MatSelectionListHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getAttribute('aria-disabled')];
                    case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                }
            });
        });
    };
    /**
     * Selects all items matching any of the given filters.
     * @param filters Filters that specify which items should be selected.
     */
    MatSelectionListHarness.prototype.selectItems = function () {
        var filters = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            filters[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getItems(filters)];
                    case 1:
                        items = _a.sent();
                        return [4 /*yield*/, Promise.all(items.map(function (item) { return item.select(); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deselects all items matching any of the given filters.
     * @param filters Filters that specify which items should be deselected.
     */
    MatSelectionListHarness.prototype.deselectItems = function () {
        var filters = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            filters[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getItems(filters)];
                    case 1:
                        items = _a.sent();
                        return [4 /*yield*/, Promise.all(items.map(function (item) { return item.deselect(); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Gets all items matching the given list of filters. */
    MatSelectionListHarness.prototype._getItems = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            var _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!filters.length) {
                            return [2 /*return*/, this.getItems()];
                        }
                        _b = (_a = (_d = []).concat).apply;
                        _c = [_d];
                        return [4 /*yield*/, Promise.all(filters.map(function (filter) { return _this.locatorForAll(MatListOptionHarness.with(filter))(); }))];
                    case 1: return [2 /*return*/, _b.apply(_a, _c.concat([__spread.apply(void 0, [_e.sent()])]))];
                }
            });
        });
    };
    /** The selector for the host element of a `MatSelectionList` instance. */
    MatSelectionListHarness.hostSelector = 'mat-selection-list';
    return MatSelectionListHarness;
}(MatListHarnessBase));
/** Harness for interacting with a list option. */
var MatListOptionHarness = /** @class */ (function (_super) {
    __extends(MatListOptionHarness, _super);
    function MatListOptionHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._itemContent = _this.locatorFor('.mat-list-item-content');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListOptionHarness` that
     * meets certain criteria.
     * @param options Options for filtering which list option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatListOptionHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return getListItemPredicate(MatListOptionHarness, options)
            .addOption('is selected', options.selected, function (harness, selected) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.isSelected()];
                case 1: return [2 /*return*/, (_a.sent()) === selected];
            }
        }); }); });
    };
    /** Gets the position of the checkbox relative to the list option content. */
    MatListOptionHarness.prototype.getCheckboxPosition = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._itemContent()];
                    case 1: return [4 /*yield*/, (_a.sent()).hasClass('mat-list-item-content-reverse')];
                    case 2: return [2 /*return*/, (_a.sent()) ?
                            'after' : 'before'];
                }
            });
        });
    };
    /** Whether the list option is selected. */
    MatListOptionHarness.prototype.isSelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getAttribute('aria-selected')];
                    case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                }
            });
        });
    };
    /** Whether the list option is disabled. */
    MatListOptionHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getAttribute('aria-disabled')];
                    case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                }
            });
        });
    };
    /** Focuses the list option. */
    MatListOptionHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the list option. */
    MatListOptionHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /** Toggles the checked state of the checkbox. */
    MatListOptionHarness.prototype.toggle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).click()];
                }
            });
        });
    };
    /**
     * Puts the list option in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked.
     */
    MatListOptionHarness.prototype.select = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isSelected()];
                    case 1:
                        if (!(_a.sent())) {
                            return [2 /*return*/, this.toggle()];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Puts the list option in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked.
     */
    MatListOptionHarness.prototype.deselect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isSelected()];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, this.toggle()];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /** The selector for the host element of a `MatListOption` instance. */
    MatListOptionHarness.hostSelector = 'mat-list-option';
    return MatListOptionHarness;
}(MatListItemHarnessBase));

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

export { MatActionListHarness, MatActionListItemHarness, MatListHarness, MatListItemHarness, MatListOptionHarness, MatNavListHarness, MatNavListItemHarness, MatSelectionListHarness };
//# sourceMappingURL=testing.js.map
