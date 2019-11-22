import { __extends, __awaiter, __generator, __read } from 'tslib';
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';
import { coerceNumberProperty, coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-slider in tests. */
var MatSliderHarness = /** @class */ (function (_super) {
    __extends(MatSliderHarness, _super);
    function MatSliderHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._textLabel = _this.locatorFor('.mat-slider-thumb-label-text');
        _this._wrapper = _this.locatorFor('.mat-slider-wrapper');
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSliderHarness` that meets
     * certain criteria.
     * @param options Options for filtering which slider instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatSliderHarness.with = function (options) {
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatSliderHarness, options);
    };
    /** Gets the slider's id. */
    MatSliderHarness.prototype.getId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getAttribute('id')];
                    case 2:
                        id = _a.sent();
                        // In case no id has been specified, the "id" property always returns
                        // an empty string. To make this method more explicit, we return null.
                        return [2 /*return*/, id !== '' ? id : null];
                }
            });
        });
    };
    /**
     * Gets the current display value of the slider. Returns a null promise if the thumb label is
     * disabled.
     */
    MatSliderHarness.prototype.getDisplayValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, host, textLabel;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([this.host(), this._textLabel()])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), host = _a[0], textLabel = _a[1];
                        return [4 /*yield*/, host.hasClass('mat-slider-thumb-label-showing')];
                    case 2:
                        if (_b.sent()) {
                            return [2 /*return*/, textLabel.text()];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /** Gets the current percentage value of the slider. */
    MatSliderHarness.prototype.getPercentage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this._calculatePercentage;
                        return [4 /*yield*/, this.getValue()];
                    case 1: return [2 /*return*/, _a.apply(this, [_b.sent()])];
                }
            });
        });
    };
    /** Gets the current value of the slider. */
    MatSliderHarness.prototype.getValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = coerceNumberProperty;
                        return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_b.sent()).getAttribute('aria-valuenow')];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    /** Gets the maximum value of the slider. */
    MatSliderHarness.prototype.getMaxValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = coerceNumberProperty;
                        return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_b.sent()).getAttribute('aria-valuemax')];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    /** Gets the minimum value of the slider. */
    MatSliderHarness.prototype.getMinValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = coerceNumberProperty;
                        return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_b.sent()).getAttribute('aria-valuemin')];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    /** Whether the slider is disabled. */
    MatSliderHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var disabled, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        disabled = (_b.sent()).getAttribute('aria-disabled');
                        _a = coerceBooleanProperty;
                        return [4 /*yield*/, disabled];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    /** Gets the orientation of the slider. */
    MatSliderHarness.prototype.getOrientation = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: 
                    // "aria-orientation" will always be set to either "horizontal" or "vertical".
                    return [2 /*return*/, (_a.sent()).getAttribute('aria-orientation')];
                }
            });
        });
    };
    /**
     * Sets the value of the slider by clicking on the slider track.
     *
     * Note that in rare cases the value cannot be set to the exact specified value. This
     * can happen if not every value of the slider maps to a single pixel that could be
     * clicked using mouse interaction. In such cases consider using the keyboard to
     * select the given value or expand the slider's size for a better user experience.
     */
    MatSliderHarness.prototype.setValue = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, sliderEl, wrapperEl, orientation, percentage, _b, height, width, isVertical, relativeX, relativeY;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Promise.all([this.host(), this._wrapper(), this.getOrientation()])];
                    case 1:
                        _a = __read.apply(void 0, [_c.sent(), 3]), sliderEl = _a[0], wrapperEl = _a[1], orientation = _a[2];
                        return [4 /*yield*/, this._calculatePercentage(value)];
                    case 2:
                        percentage = _c.sent();
                        return [4 /*yield*/, wrapperEl.getDimensions()];
                    case 3:
                        _b = _c.sent(), height = _b.height, width = _b.width;
                        isVertical = orientation === 'vertical';
                        return [4 /*yield*/, sliderEl.hasClass('mat-slider-invert-mouse-coords')];
                    case 4:
                        // In case the slider is inverted in LTR mode or not inverted in RTL mode,
                        // we need to invert the percentage so that the proper value is set.
                        if (_c.sent()) {
                            percentage = 1 - percentage;
                        }
                        relativeX = isVertical ? 0 : Math.round(width * percentage);
                        relativeY = isVertical ? Math.round(height * percentage) : 0;
                        return [4 /*yield*/, wrapperEl.click(relativeX, relativeY)];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Focuses the slider. */
    MatSliderHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the slider. */
    MatSliderHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /** Calculates the percentage of the given value. */
    MatSliderHarness.prototype._calculatePercentage = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, min, max;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([this.getMinValue(), this.getMaxValue()])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), min = _a[0], max = _a[1];
                        return [2 /*return*/, (value - min) / (max - min)];
                }
            });
        });
    };
    /** The selector for the host element of a `MatSlider` instance. */
    MatSliderHarness.hostSelector = 'mat-slider';
    return MatSliderHarness;
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

export { MatSliderHarness };
//# sourceMappingURL=testing.js.map
