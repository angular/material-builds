import { __extends, __awaiter, __generator } from 'tslib';
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Angular Material sort header in tests. */
var MatSortHeaderHarness = /** @class */ (function (_super) {
    __extends(MatSortHeaderHarness, _super);
    function MatSortHeaderHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._button = _this.locatorFor('.mat-sort-header-button');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to
     * search for a sort header with specific attributes.
     */
    MatSortHeaderHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatSortHeaderHarness, options)
            .addOption('label', options.label, function (harness, label) { return HarnessPredicate.stringMatches(harness.getLabel(), label); })
            .addOption('sortDirection', options.sortDirection, function (harness, sortDirection) {
            return HarnessPredicate.stringMatches(harness.getSortDirection(), sortDirection);
        });
    };
    /** Gets the label of the sort header. */
    MatSortHeaderHarness.prototype.getLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._button()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Gets the sorting direction of the header. */
    MatSortHeaderHarness.prototype.getSortDirection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host, ariaSort;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        return [4 /*yield*/, host.getAttribute('aria-sort')];
                    case 2:
                        ariaSort = _a.sent();
                        if (ariaSort === 'ascending') {
                            return [2 /*return*/, 'asc'];
                        }
                        else if (ariaSort === 'descending') {
                            return [2 /*return*/, 'desc'];
                        }
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    /** Gets the aria-label of the sort header. */
    MatSortHeaderHarness.prototype.getAriaLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._button()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-label')];
                }
            });
        });
    };
    /** Gets whether the sort header is currently being sorted by. */
    MatSortHeaderHarness.prototype.isActive = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSortDirection()];
                    case 1: return [2 /*return*/, !!(_a.sent())];
                }
            });
        });
    };
    /** Whether the sort header is disabled. */
    MatSortHeaderHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var button;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._button()];
                    case 1:
                        button = _a.sent();
                        return [4 /*yield*/, button.getAttribute('disabled')];
                    case 2: return [2 /*return*/, (_a.sent()) != null];
                }
            });
        });
    };
    /** Clicks the header to change its sorting direction. Only works if the header is enabled. */
    MatSortHeaderHarness.prototype.click = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).click()];
                }
            });
        });
    };
    MatSortHeaderHarness.hostSelector = '.mat-sort-header';
    return MatSortHeaderHarness;
}(ComponentHarness));

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard `mat-sort` in tests. */
var MatSortHarness = /** @class */ (function (_super) {
    __extends(MatSortHarness, _super);
    function MatSortHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `mat-sort` with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatSortHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatSortHarness, options);
    };
    /** Gets all of the sort headers in the `mat-sort`. */
    MatSortHarness.prototype.getSortHeaders = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorForAll(MatSortHeaderHarness.with(filter))()];
            });
        });
    };
    /** Gets the selected header in the `mat-sort`. */
    MatSortHarness.prototype.getActiveHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var headers, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSortHeaders()];
                    case 1:
                        headers = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < headers.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, headers[i].isActive()];
                    case 3:
                        if (_a.sent()) {
                            return [2 /*return*/, headers[i]];
                        }
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, null];
                }
            });
        });
    };
    MatSortHarness.hostSelector = '.mat-sort';
    return MatSortHarness;
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

export { MatSortHarness, MatSortHeaderHarness };
//# sourceMappingURL=testing.js.map
