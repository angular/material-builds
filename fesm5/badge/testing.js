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
 * Harness for interacting with a standard Material badge in tests.
 * @dynamic
 */
var MatBadgeHarness = /** @class */ (function (_super) {
    __extends(MatBadgeHarness, _super);
    function MatBadgeHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._badgeElement = _this.locatorFor('.mat-badge-content');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a badge with specific attributes.
     * @param options Options for narrowing the search:
     *   - `text` finds a badge host with a particular text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatBadgeHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatBadgeHarness, options)
            .addOption('text', options.text, function (harness, text) { return HarnessPredicate.stringMatches(harness.getText(), text); });
    };
    /** Gets a promise for the badge text. */
    MatBadgeHarness.prototype.getText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._badgeElement()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /** Gets whether the badge is overlapping the content. */
    MatBadgeHarness.prototype.isOverlapping = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-badge-overlap')];
                }
            });
        });
    };
    /** Gets the position of the badge. */
    MatBadgeHarness.prototype.getPosition = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        result = '';
                        return [4 /*yield*/, host.hasClass('mat-badge-above')];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        result += 'above';
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, host.hasClass('mat-badge-below')];
                    case 4:
                        if (_a.sent()) {
                            result += 'below';
                        }
                        _a.label = 5;
                    case 5: return [4 /*yield*/, host.hasClass('mat-badge-before')];
                    case 6:
                        if (!_a.sent()) return [3 /*break*/, 7];
                        result += ' before';
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, host.hasClass('mat-badge-after')];
                    case 8:
                        if (_a.sent()) {
                            result += ' after';
                        }
                        _a.label = 9;
                    case 9: return [2 /*return*/, result.trim()];
                }
            });
        });
    };
    /** Gets the size of the badge. */
    MatBadgeHarness.prototype.getSize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        host = _a.sent();
                        return [4 /*yield*/, host.hasClass('mat-badge-small')];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [2 /*return*/, 'small'];
                    case 3: return [4 /*yield*/, host.hasClass('mat-badge-large')];
                    case 4:
                        if (_a.sent()) {
                            return [2 /*return*/, 'large'];
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/, 'medium'];
                }
            });
        });
    };
    /** Gets whether the badge is hidden. */
    MatBadgeHarness.prototype.isHidden = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-badge-hidden')];
                }
            });
        });
    };
    /** Gets whether the badge is disabled. */
    MatBadgeHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-badge-disabled')];
                }
            });
        });
    };
    MatBadgeHarness.hostSelector = '.mat-badge';
    return MatBadgeHarness;
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

export { MatBadgeHarness };
//# sourceMappingURL=testing.js.map
