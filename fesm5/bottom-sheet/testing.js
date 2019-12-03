import { __extends, __awaiter, __generator } from 'tslib';
import { HarnessPredicate, TestKey, ComponentHarness } from '@angular/cdk/testing';

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
    __extends(MatBottomSheetHarness, _super);
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
        return new HarnessPredicate(MatBottomSheetHarness, options);
    };
    /** Gets the value of the bottom sheet's "aria-label" attribute. */
    MatBottomSheetHarness.prototype.getAriaLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).sendKeys(TestKey.ESCAPE)];
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

export { MatBottomSheetHarness };
//# sourceMappingURL=testing.js.map
