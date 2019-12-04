(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/testing')) :
    typeof define === 'function' && define.amd ? define('@angular/material/divider/testing', ['exports', 'tslib', '@angular/cdk/testing'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.divider = global.ng.material.divider || {}, global.ng.material.divider.testing = {}), global.tslib, global.ng.cdk.testing));
}(this, (function (exports, tslib, testing) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Harness for interacting with a `mat-divider`.
     * @dynamic
     */
    var MatDividerHarness = /** @class */ (function (_super) {
        tslib.__extends(MatDividerHarness, _super);
        function MatDividerHarness() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MatDividerHarness.with = function (options) {
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatDividerHarness, options);
        };
        MatDividerHarness.prototype.getOrientation = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-orientation')];
                    }
                });
            });
        };
        MatDividerHarness.prototype.isInset = function () {
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-divider-inset')];
                    }
                });
            });
        };
        MatDividerHarness.hostSelector = 'mat-divider';
        return MatDividerHarness;
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

    exports.MatDividerHarness = MatDividerHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-divider-testing.umd.js.map
