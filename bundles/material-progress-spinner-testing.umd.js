(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/coercion'), require('@angular/cdk/testing')) :
    typeof define === 'function' && define.amd ? define('@angular/material/progress-spinner/testing', ['exports', 'tslib', '@angular/cdk/coercion', '@angular/cdk/testing'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.progressSpinner = global.ng.material.progressSpinner || {}, global.ng.material.progressSpinner.testing = {}), global.tslib, global.ng.cdk.coercion, global.ng.cdk.testing));
}(this, (function (exports, tslib, coercion, testing) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Harness for interacting with a standard mat-progress-spinner in tests. */
    var MatProgressSpinnerHarness = /** @class */ (function (_super) {
        tslib.__extends(MatProgressSpinnerHarness, _super);
        function MatProgressSpinnerHarness() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatProgressSpinnerHarness` that
         * meets certain criteria.
         * @param options Options for filtering which progress spinner instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatProgressSpinnerHarness.with = function (options) {
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatProgressSpinnerHarness, options);
        };
        /** Gets the progress spinner's value. */
        MatProgressSpinnerHarness.prototype.getValue = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var host, ariaValue;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1:
                            host = _a.sent();
                            return [4 /*yield*/, host.getAttribute('aria-valuenow')];
                        case 2:
                            ariaValue = _a.sent();
                            return [2 /*return*/, ariaValue ? coercion.coerceNumberProperty(ariaValue) : null];
                    }
                });
            });
        };
        /** Gets the progress spinner's mode. */
        MatProgressSpinnerHarness.prototype.getMode = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var modeAttr;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1:
                            modeAttr = (_a.sent()).getAttribute('mode');
                            return [4 /*yield*/, modeAttr];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /** The selector for the host element of a `MatProgressSpinner` instance. */
        MatProgressSpinnerHarness.hostSelector = 'mat-progress-spinner';
        return MatProgressSpinnerHarness;
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

    exports.MatProgressSpinnerHarness = MatProgressSpinnerHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-progress-spinner-testing.umd.js.map
