/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator, __read } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
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
export { MatSliderHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3Rlc3Rpbmcvc2xpZGVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBR2xGLG1FQUFtRTtBQUNuRTtJQUFzQyxvQ0FBZ0I7SUFBdEQ7UUFBQSxxRUFpSEM7UUFuR1MsZ0JBQVUsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDN0QsY0FBUSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7SUFrRzVELENBQUM7SUE3R0M7Ozs7O09BS0c7SUFDSSxxQkFBSSxHQUFYLFVBQVksT0FBa0M7UUFBbEMsd0JBQUEsRUFBQSxZQUFrQztRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUtELDRCQUE0QjtJQUN0QixnQ0FBSyxHQUFYOzs7Ozs0QkFDb0IscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF4QixxQkFBTSxDQUFDLFNBQWlCLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUE7O3dCQUFqRCxFQUFFLEdBQUcsU0FBNEM7d0JBQ3ZELHFFQUFxRTt3QkFDckUsc0VBQXNFO3dCQUN0RSxzQkFBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQzs7OztLQUM5QjtJQUVEOzs7T0FHRztJQUNHLDBDQUFlLEdBQXJCOzs7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RUFBRSxDQUFDLENBQUMsRUFBQTs7d0JBQXhFLEtBQUEsc0JBQWEsU0FBMkQsS0FBQSxFQUF2RSxHQUFHLFFBQUEsRUFBRSxHQUFHLFFBQUE7d0JBQ2Ysc0JBQU8sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUM7Ozs7S0FDcEM7SUEvR0QsbUVBQW1FO0lBQzVELDZCQUFZLEdBQUcsWUFBWSxDQUFDO0lBK0dyQyx1QkFBQztDQUFBLEFBakhELENBQXNDLGdCQUFnQixHQWlIckQ7U0FqSFksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHksIGNvZXJjZU51bWJlclByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtTbGlkZXJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9zbGlkZXItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtc2xpZGVyIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNsaWRlckhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRTbGlkZXJgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1zbGlkZXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRTbGlkZXJIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBzbGlkZXIgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogU2xpZGVySGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0U2xpZGVySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTbGlkZXJIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgX3RleHRMYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1zbGlkZXItdGh1bWItbGFiZWwtdGV4dCcpO1xuICBwcml2YXRlIF93cmFwcGVyID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXNsaWRlci13cmFwcGVyJyk7XG5cbiAgLyoqIEdldHMgdGhlIHNsaWRlcidzIGlkLiAqL1xuICBhc3luYyBnZXRJZCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgY29uc3QgaWQgPSBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAvLyBJbiBjYXNlIG5vIGlkIGhhcyBiZWVuIHNwZWNpZmllZCwgdGhlIFwiaWRcIiBwcm9wZXJ0eSBhbHdheXMgcmV0dXJuc1xuICAgIC8vIGFuIGVtcHR5IHN0cmluZy4gVG8gbWFrZSB0aGlzIG1ldGhvZCBtb3JlIGV4cGxpY2l0LCB3ZSByZXR1cm4gbnVsbC5cbiAgICByZXR1cm4gaWQgIT09ICcnID8gaWQgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGN1cnJlbnQgZGlzcGxheSB2YWx1ZSBvZiB0aGUgc2xpZGVyLiBSZXR1cm5zIGEgbnVsbCBwcm9taXNlIGlmIHRoZSB0aHVtYiBsYWJlbCBpc1xuICAgKiBkaXNhYmxlZC5cbiAgICovXG4gIGFzeW5jIGdldERpc3BsYXlWYWx1ZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgY29uc3QgW2hvc3QsIHRleHRMYWJlbF0gPSBhd2FpdCBQcm9taXNlLmFsbChbdGhpcy5ob3N0KCksIHRoaXMuX3RleHRMYWJlbCgpXSk7XG4gICAgaWYgKGF3YWl0IGhvc3QuaGFzQ2xhc3MoJ21hdC1zbGlkZXItdGh1bWItbGFiZWwtc2hvd2luZycpKSB7XG4gICAgICByZXR1cm4gdGV4dExhYmVsLnRleHQoKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY3VycmVudCBwZXJjZW50YWdlIHZhbHVlIG9mIHRoZSBzbGlkZXIuICovXG4gIGFzeW5jIGdldFBlcmNlbnRhZ2UoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy5fY2FsY3VsYXRlUGVyY2VudGFnZShhd2FpdCB0aGlzLmdldFZhbHVlKCkpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHNsaWRlci4gKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWF4aW11bSB2YWx1ZSBvZiB0aGUgc2xpZGVyLiAqL1xuICBhc3luYyBnZXRNYXhWYWx1ZSgpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eShhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1heCcpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtaW5pbXVtIHZhbHVlIG9mIHRoZSBzbGlkZXIuICovXG4gIGFzeW5jIGdldE1pblZhbHVlKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGNvZXJjZU51bWJlclByb3BlcnR5KGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWluJykpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHNsaWRlci4gKi9cbiAgYXN5bmMgZ2V0T3JpZW50YXRpb24oKTogUHJvbWlzZTwnaG9yaXpvbnRhbCd8J3ZlcnRpY2FsJz4ge1xuICAgIC8vIFwiYXJpYS1vcmllbnRhdGlvblwiIHdpbGwgYWx3YXlzIGJlIHNldCB0byBlaXRoZXIgXCJob3Jpem9udGFsXCIgb3IgXCJ2ZXJ0aWNhbFwiLlxuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1vcmllbnRhdGlvbicpIGFzIGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgc2xpZGVyIGJ5IGNsaWNraW5nIG9uIHRoZSBzbGlkZXIgdHJhY2suXG4gICAqXG4gICAqIE5vdGUgdGhhdCBpbiByYXJlIGNhc2VzIHRoZSB2YWx1ZSBjYW5ub3QgYmUgc2V0IHRvIHRoZSBleGFjdCBzcGVjaWZpZWQgdmFsdWUuIFRoaXNcbiAgICogY2FuIGhhcHBlbiBpZiBub3QgZXZlcnkgdmFsdWUgb2YgdGhlIHNsaWRlciBtYXBzIHRvIGEgc2luZ2xlIHBpeGVsIHRoYXQgY291bGQgYmVcbiAgICogY2xpY2tlZCB1c2luZyBtb3VzZSBpbnRlcmFjdGlvbi4gSW4gc3VjaCBjYXNlcyBjb25zaWRlciB1c2luZyB0aGUga2V5Ym9hcmQgdG9cbiAgICogc2VsZWN0IHRoZSBnaXZlbiB2YWx1ZSBvciBleHBhbmQgdGhlIHNsaWRlcidzIHNpemUgZm9yIGEgYmV0dGVyIHVzZXIgZXhwZXJpZW5jZS5cbiAgICovXG4gIGFzeW5jIHNldFZhbHVlKHZhbHVlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBbc2xpZGVyRWwsIHdyYXBwZXJFbCwgb3JpZW50YXRpb25dID1cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW3RoaXMuaG9zdCgpLCB0aGlzLl93cmFwcGVyKCksIHRoaXMuZ2V0T3JpZW50YXRpb24oKV0pO1xuICAgIGxldCBwZXJjZW50YWdlID0gYXdhaXQgdGhpcy5fY2FsY3VsYXRlUGVyY2VudGFnZSh2YWx1ZSk7XG4gICAgY29uc3Qge2hlaWdodCwgd2lkdGh9ID0gYXdhaXQgd3JhcHBlckVsLmdldERpbWVuc2lvbnMoKTtcbiAgICBjb25zdCBpc1ZlcnRpY2FsID0gb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCc7XG5cbiAgICAvLyBJbiBjYXNlIHRoZSBzbGlkZXIgaXMgaW52ZXJ0ZWQgaW4gTFRSIG1vZGUgb3Igbm90IGludmVydGVkIGluIFJUTCBtb2RlLFxuICAgIC8vIHdlIG5lZWQgdG8gaW52ZXJ0IHRoZSBwZXJjZW50YWdlIHNvIHRoYXQgdGhlIHByb3BlciB2YWx1ZSBpcyBzZXQuXG4gICAgaWYgKGF3YWl0IHNsaWRlckVsLmhhc0NsYXNzKCdtYXQtc2xpZGVyLWludmVydC1tb3VzZS1jb29yZHMnKSkge1xuICAgICAgcGVyY2VudGFnZSA9IDEgLSBwZXJjZW50YWdlO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gcm91bmQgdGhlIG5ldyBjb29yZGluYXRlcyBiZWNhdXNlIGNyZWF0aW5nIGZha2UgRE9NXG4gICAgLy8gZXZlbnRzIHdpbGwgY2F1c2UgdGhlIGNvb3JkaW5hdGVzIHRvIGJlIHJvdW5kZWQgZG93bi5cbiAgICBjb25zdCByZWxhdGl2ZVggPSBpc1ZlcnRpY2FsID8gMCA6IE1hdGgucm91bmQod2lkdGggKiBwZXJjZW50YWdlKTtcbiAgICBjb25zdCByZWxhdGl2ZVkgPSBpc1ZlcnRpY2FsID8gTWF0aC5yb3VuZChoZWlnaHQgKiBwZXJjZW50YWdlKSA6IDA7XG5cbiAgICBhd2FpdCB3cmFwcGVyRWwuY2xpY2socmVsYXRpdmVYLCByZWxhdGl2ZVkpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHNsaWRlci4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgc2xpZGVyLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSBwZXJjZW50YWdlIG9mIHRoZSBnaXZlbiB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfY2FsY3VsYXRlUGVyY2VudGFnZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgY29uc3QgW21pbiwgbWF4XSA9IGF3YWl0IFByb21pc2UuYWxsKFt0aGlzLmdldE1pblZhbHVlKCksIHRoaXMuZ2V0TWF4VmFsdWUoKV0pO1xuICAgIHJldHVybiAodmFsdWUgLSBtaW4pIC8gKG1heCAtIG1pbik7XG4gIH1cbn1cbiJdfQ==