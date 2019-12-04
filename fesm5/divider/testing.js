import { __extends, __awaiter, __generator } from 'tslib';
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

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
    __extends(MatDividerHarness, _super);
    function MatDividerHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatDividerHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatDividerHarness, options);
    };
    MatDividerHarness.prototype.getOrientation = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-orientation')];
                }
            });
        });
    };
    MatDividerHarness.prototype.isInset = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-divider-inset')];
                }
            });
        });
    };
    MatDividerHarness.hostSelector = 'mat-divider';
    return MatDividerHarness;
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

export { MatDividerHarness };
//# sourceMappingURL=testing.js.map
