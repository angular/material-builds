(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/testing')) :
    typeof define === 'function' && define.amd ? define('@angular/material/bottom-sheet/testing', ['exports', 'tslib', '@angular/cdk/testing'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.bottomSheet = global.ng.material.bottomSheet || {}, global.ng.material.bottomSheet.testing = {}), global.tslib, global.ng.cdk.testing));
}(this, (function (exports, tslib, testing) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Harness for interacting with a standard MatBottomSheet in tests.
     * @dynamic
     */
    var MatBottomSheetHarness = /** @class */ (function (_super) {
        tslib.__extends(MatBottomSheetHarness, _super);
        function MatBottomSheetHarness() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a bottom sheet with
         * specific attributes.
         * @param options Options for narrowing the search.
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatBottomSheetHarness.with = function (options) {
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatBottomSheetHarness, options);
        };
        /** Gets the value of the bottom sheet's "aria-label" attribute. */
        MatBottomSheetHarness.prototype.getAriaLabel = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-label')];
                    }
                });
            });
        };
        /**
         * Dismisses the bottom sheet by pressing escape. Note that this method cannot
         * be used if "disableClose" has been set to true via the config.
         */
        MatBottomSheetHarness.prototype.dismiss = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [4 /*yield*/, (_a.sent()).sendKeys(testing.TestKey.ESCAPE)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // Developers can provide a custom component or template for the
        // bottom sheet. The canonical parent is the ".mat-bottom-sheet-container".
        MatBottomSheetHarness.hostSelector = '.mat-bottom-sheet-container';
        return MatBottomSheetHarness;
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

    exports.MatBottomSheetHarness = MatBottomSheetHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-bottom-sheet-testing.umd.js.map
