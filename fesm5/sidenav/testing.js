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
 * Harness for interacting with a standard mat-drawer in tests.
 * @dynamic
 */
var MatDrawerHarness = /** @class */ (function (_super) {
    __extends(MatDrawerHarness, _super);
    function MatDrawerHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a drawer with
     * specific attributes.
     * @param options Options for narrowing the search.
     * @return `HarnessPredicate` configured with the given options.
     */
    MatDrawerHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatDrawerHarness, options);
    };
    /** Gets whether the drawer is open. */
    MatDrawerHarness.prototype.isOpen = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-drawer-opened')];
                }
            });
        });
    };
    /** Gets the position of the drawer inside its container. */
    MatDrawerHarness.prototype.getPosition = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        return [4 /*yield*/, host.hasClass('mat-drawer-end')];
                    case 2: return [2 /*return*/, (_a.sent()) ? 'end' : 'start'];
                }
            });
        });
    };
    /** Gets the mode that the drawer is in. */
    MatDrawerHarness.prototype.getMode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        return [4 /*yield*/, host.hasClass('mat-drawer-push')];
                    case 2:
                        if (_a.sent()) {
                            return [2 /*return*/, 'push'];
                        }
                        return [4 /*yield*/, host.hasClass('mat-drawer-side')];
                    case 3:
                        if (_a.sent()) {
                            return [2 /*return*/, 'side'];
                        }
                        return [2 /*return*/, 'over'];
                }
            });
        });
    };
    MatDrawerHarness.hostSelector = '.mat-drawer';
    return MatDrawerHarness;
}(ComponentHarness));

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Harness for interacting with a standard mat-sidenav in tests.
 * @dynamic
 */
var MatSidenavHarness = /** @class */ (function (_super) {
    __extends(MatSidenavHarness, _super);
    function MatSidenavHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a sidenav with
     * specific attributes.
     * @param options Options for narrowing the search.
     * @return `HarnessPredicate` configured with the given options.
     */
    MatSidenavHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatDrawerHarness, options);
    };
    /** Gets whether the sidenav is fixed in the viewport. */
    MatSidenavHarness.prototype.isFixedInViewport = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-sidenav-fixed')];
                }
            });
        });
    };
    MatSidenavHarness.hostSelector = '.mat-sidenav';
    return MatSidenavHarness;
}(MatDrawerHarness));

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

export { MatDrawerHarness, MatSidenavHarness };
//# sourceMappingURL=testing.js.map
