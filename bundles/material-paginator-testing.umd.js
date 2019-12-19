(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/testing'), require('@angular/material/select/testing'), require('@angular/cdk/coercion')) :
    typeof define === 'function' && define.amd ? define('@angular/material/paginator/testing', ['exports', 'tslib', '@angular/cdk/testing', '@angular/material/select/testing', '@angular/cdk/coercion'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.paginator = global.ng.material.paginator || {}, global.ng.material.paginator.testing = {}), global.tslib, global.ng.cdk.testing, global.ng.material.select.testing, global.ng.cdk.coercion));
}(this, (function (exports, tslib, testing, testing$1, coercion) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Harness for interacting with a standard mat-paginator in tests. */
    var MatPaginatorHarness = /** @class */ (function (_super) {
        tslib.__extends(MatPaginatorHarness, _super);
        function MatPaginatorHarness() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._nextButton = _this.locatorFor('.mat-paginator-navigation-next');
            _this._previousButton = _this.locatorFor('.mat-paginator-navigation-previous');
            _this._firstPageButton = _this.locatorForOptional('.mat-paginator-navigation-first');
            _this._lastPageButton = _this.locatorForOptional('.mat-paginator-navigation-last');
            _this._select = _this.locatorForOptional(testing$1.MatSelectHarness.with({
                ancestor: '.mat-paginator-page-size'
            }));
            _this._pageSizeFallback = _this.locatorFor('.mat-paginator-page-size-value');
            _this._rangeLabel = _this.locatorFor('.mat-paginator-range-label');
            return _this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatPaginatorHarness` that meets
         * certain criteria.
         * @param options Options for filtering which paginator instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatPaginatorHarness.with = function (options) {
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatPaginatorHarness, options);
        };
        /** Goes to the next page in the paginator. */
        MatPaginatorHarness.prototype.goToNextPage = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._nextButton()];
                        case 1: return [2 /*return*/, (_a.sent()).click()];
                    }
                });
            });
        };
        /** Goes to the previous page in the paginator. */
        MatPaginatorHarness.prototype.goToPreviousPage = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._previousButton()];
                        case 1: return [2 /*return*/, (_a.sent()).click()];
                    }
                });
            });
        };
        /** Goes to the first page in the paginator. */
        MatPaginatorHarness.prototype.goToFirstPage = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var button;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._firstPageButton()];
                        case 1:
                            button = _a.sent();
                            // The first page button isn't enabled by default so we need to check for it.
                            if (!button) {
                                throw Error('Could not find first page button inside paginator. ' +
                                    'Make sure that `showFirstLastButtons` is enabled.');
                            }
                            return [2 /*return*/, button.click()];
                    }
                });
            });
        };
        /** Goes to the last page in the paginator. */
        MatPaginatorHarness.prototype.goToLastPage = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var button;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._lastPageButton()];
                        case 1:
                            button = _a.sent();
                            // The last page button isn't enabled by default so we need to check for it.
                            if (!button) {
                                throw Error('Could not find last page button inside paginator. ' +
                                    'Make sure that `showFirstLastButtons` is enabled.');
                            }
                            return [2 /*return*/, button.click()];
                    }
                });
            });
        };
        /**
         * Sets the page size of the paginator.
         * @param size Page size that should be select.
         */
        MatPaginatorHarness.prototype.setPageSize = function (size) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var select;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._select()];
                        case 1:
                            select = _a.sent();
                            // The select is only available if the `pageSizeOptions` are
                            // set to an array with more than one item.
                            if (!select) {
                                throw Error('Cannot find page size selector in paginator. ' +
                                    'Make sure that the `pageSizeOptions` have been configured.');
                            }
                            return [2 /*return*/, select.clickOptions({ text: "" + size })];
                    }
                });
            });
        };
        /** Gets the page size of the paginator. */
        MatPaginatorHarness.prototype.getPageSize = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var select, value, _a, _b;
                return tslib.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this._select()];
                        case 1:
                            select = _c.sent();
                            if (!select) return [3 /*break*/, 2];
                            _a = select.getValueText();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this._pageSizeFallback()];
                        case 3:
                            _a = (_c.sent()).text();
                            _c.label = 4;
                        case 4:
                            value = _a;
                            _b = coercion.coerceNumberProperty;
                            return [4 /*yield*/, value];
                        case 5: return [2 /*return*/, _b.apply(void 0, [_c.sent()])];
                    }
                });
            });
        };
        /** Gets the text of the range labe of the paginator. */
        MatPaginatorHarness.prototype.getRangeLabel = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._rangeLabel()];
                        case 1: return [2 /*return*/, (_a.sent()).text()];
                    }
                });
            });
        };
        /** Selector used to find paginator instances. */
        MatPaginatorHarness.hostSelector = '.mat-paginator';
        return MatPaginatorHarness;
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

    exports.MatPaginatorHarness = MatPaginatorHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-paginator-testing.umd.js.map
