import { __extends, __awaiter, __generator } from 'tslib';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Harness for interacting with a standard mat-progress-spinner in tests.
 * @dynamic
 */
var MatProgressSpinnerHarness = /** @class */ (function (_super) {
    __extends(MatProgressSpinnerHarness, _super);
    function MatProgressSpinnerHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a progress bar with specific
     * attributes.
     */
    MatProgressSpinnerHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatProgressSpinnerHarness, options);
    };
    /** Gets a promise for the progress spinner's value. */
    MatProgressSpinnerHarness.prototype.getValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host, ariaValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        return [4 /*yield*/, host.getAttribute('aria-valuenow')];
                    case 2:
                        ariaValue = _a.sent();
                        return [2 /*return*/, ariaValue ? coerceNumberProperty(ariaValue) : null];
                }
            });
        });
    };
    /** Gets a promise for the progress spinner's mode. */
    MatProgressSpinnerHarness.prototype.getMode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modeAttr;
            return __generator(this, function (_a) {
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
    MatProgressSpinnerHarness.hostSelector = 'mat-progress-spinner';
    return MatProgressSpinnerHarness;
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

export { MatProgressSpinnerHarness };
//# sourceMappingURL=testing.js.map
