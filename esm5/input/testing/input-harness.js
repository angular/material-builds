/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
/** Harness for interacting with a standard Material inputs in tests. */
var MatInputHarness = /** @class */ (function (_super) {
    __extends(MatInputHarness, _super);
    function MatInputHarness() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatInputHarness` that meets
     * certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatInputHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatInputHarness, options)
            .addOption('value', options.value, function (harness, value) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, harness.getValue()];
                    case 1: return [2 /*return*/, (_a.sent()) === value];
                }
            });
        }); })
            .addOption('placeholder', options.placeholder, function (harness, placeholder) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, harness.getPlaceholder()];
                    case 1: return [2 /*return*/, (_a.sent()) === placeholder];
                }
            });
        }); });
    };
    /** Whether the input is disabled. */
    MatInputHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getProperty('disabled')];
                }
            });
        });
    };
    /** Whether the input is required. */
    MatInputHarness.prototype.isRequired = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getProperty('required')];
                }
            });
        });
    };
    /** Whether the input is readonly. */
    MatInputHarness.prototype.isReadonly = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).getProperty('readOnly')];
                }
            });
        });
    };
    /** Gets the value of the input. */
    MatInputHarness.prototype.getValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getProperty('value')];
                    case 2: 
                    // The "value" property of the native input is never undefined.
                    return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /** Gets the name of the input. */
    MatInputHarness.prototype.getName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getProperty('name')];
                    case 2: 
                    // The "name" property of the native input is never undefined.
                    return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /**
     * Gets the type of the input. Returns "textarea" if the input is
     * a textarea.
     */
    MatInputHarness.prototype.getType = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getProperty('type')];
                    case 2: 
                    // The "type" property of the native input is never undefined.
                    return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /** Gets the placeholder of the input. */
    MatInputHarness.prototype.getPlaceholder = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getProperty('placeholder')];
                    case 2: 
                    // The "placeholder" property of the native input is never undefined.
                    return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /** Gets the id of the input. */
    MatInputHarness.prototype.getId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getProperty('id')];
                    case 2: 
                    // The input directive always assigns a unique id to the input in
                    // case no id has been explicitly specified.
                    return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    MatInputHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    MatInputHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    MatInputHarness.prototype.setValue = function (newValue) {
        return __awaiter(this, void 0, void 0, function () {
            var inputEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        inputEl = _a.sent();
                        return [4 /*yield*/, inputEl.clear()];
                    case 2:
                        _a.sent();
                        if (!newValue) return [3 /*break*/, 4];
                        return [4 /*yield*/, inputEl.sendKeys(newValue)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // TODO: We do not want to handle `select` elements with `matNativeControl` because
    // not all methods of this harness work reasonably for native select elements.
    // For more details. See: https://github.com/angular/components/pull/18221.
    MatInputHarness.hostSelector = '[matInput], input[matNativeControl], textarea[matNativeControl]';
    return MatInputHarness;
}(MatFormFieldControlHarness));
export { MatInputHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pbnB1dC90ZXN0aW5nL2lucHV0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBR3hGLHdFQUF3RTtBQUN4RTtJQUFxQyxtQ0FBMEI7SUFBL0Q7O0lBcUdBLENBQUM7SUEvRkM7Ozs7O09BS0c7SUFDSSxvQkFBSSxHQUFYLFVBQVksT0FBaUM7UUFBN0MsaUJBUUM7UUFSVyx3QkFBQSxFQUFBLFlBQWlDO1FBQzNDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDO2FBQ2hELFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFPLE9BQU8sRUFBRSxLQUFLOzs7NEJBQzlDLHFCQUFNLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBQTs0QkFBaEMsc0JBQU8sQ0FBQyxTQUF3QixDQUFDLEtBQUssS0FBSyxFQUFDOzs7YUFDN0MsQ0FBQzthQUNELFNBQVMsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxVQUFPLE9BQU8sRUFBRSxXQUFXOzs7NEJBQ2hFLHFCQUFNLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBQTs0QkFBdEMsc0JBQU8sQ0FBQyxTQUE4QixDQUFDLEtBQUssV0FBVyxFQUFDOzs7YUFDekQsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVELHFDQUFxQztJQUMvQixvQ0FBVSxHQUFoQjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFdBQVcs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RUFBMkU7SUFDcEUsNEJBQVksR0FBRyxpRUFBaUUsQ0FBQztJQWlHMUYsc0JBQUM7Q0FBQSxBQXJHRCxDQUFxQywwQkFBMEIsR0FxRzlEO1NBckdZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkL3Rlc3RpbmcvY29udHJvbCc7XG5pbXBvcnQge0lucHV0SGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vaW5wdXQtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBNYXRlcmlhbCBpbnB1dHMgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0SW5wdXRIYXJuZXNzIGV4dGVuZHMgTWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3Mge1xuICAvLyBUT0RPOiBXZSBkbyBub3Qgd2FudCB0byBoYW5kbGUgYHNlbGVjdGAgZWxlbWVudHMgd2l0aCBgbWF0TmF0aXZlQ29udHJvbGAgYmVjYXVzZVxuICAvLyBub3QgYWxsIG1ldGhvZHMgb2YgdGhpcyBoYXJuZXNzIHdvcmsgcmVhc29uYWJseSBmb3IgbmF0aXZlIHNlbGVjdCBlbGVtZW50cy5cbiAgLy8gRm9yIG1vcmUgZGV0YWlscy4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTgyMjEuXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnW21hdElucHV0XSwgaW5wdXRbbWF0TmF0aXZlQ29udHJvbF0sIHRleHRhcmVhW21hdE5hdGl2ZUNvbnRyb2xdJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0SW5wdXRIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBpbnB1dCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBJbnB1dEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdElucHV0SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRJbnB1dEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3ZhbHVlJywgb3B0aW9ucy52YWx1ZSwgYXN5bmMgKGhhcm5lc3MsIHZhbHVlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChhd2FpdCBoYXJuZXNzLmdldFZhbHVlKCkpID09PSB2YWx1ZTtcbiAgICAgICAgfSlcbiAgICAgICAgLmFkZE9wdGlvbigncGxhY2Vob2xkZXInLCBvcHRpb25zLnBsYWNlaG9sZGVyLCBhc3luYyAoaGFybmVzcywgcGxhY2Vob2xkZXIpID0+IHtcbiAgICAgICAgICByZXR1cm4gKGF3YWl0IGhhcm5lc3MuZ2V0UGxhY2Vob2xkZXIoKSkgPT09IHBsYWNlaG9sZGVyO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnZGlzYWJsZWQnKSE7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgcmVxdWlyZWQuICovXG4gIGFzeW5jIGlzUmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ3JlcXVpcmVkJykhO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIHJlYWRvbmx5LiAqL1xuICBhc3luYyBpc1JlYWRvbmx5KCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5KCdyZWFkT25seScpITtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQuICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgLy8gVGhlIFwidmFsdWVcIiBwcm9wZXJ0eSBvZiB0aGUgbmF0aXZlIGlucHV0IGlzIG5ldmVyIHVuZGVmaW5lZC5cbiAgICByZXR1cm4gKGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ3ZhbHVlJykpITtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIC8vIFRoZSBcIm5hbWVcIiBwcm9wZXJ0eSBvZiB0aGUgbmF0aXZlIGlucHV0IGlzIG5ldmVyIHVuZGVmaW5lZC5cbiAgICByZXR1cm4gKGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ25hbWUnKSkhO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHR5cGUgb2YgdGhlIGlucHV0LiBSZXR1cm5zIFwidGV4dGFyZWFcIiBpZiB0aGUgaW5wdXQgaXNcbiAgICogYSB0ZXh0YXJlYS5cbiAgICovXG4gIGFzeW5jIGdldFR5cGUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgXCJ0eXBlXCIgcHJvcGVydHkgb2YgdGhlIG5hdGl2ZSBpbnB1dCBpcyBuZXZlciB1bmRlZmluZWQuXG4gICAgcmV0dXJuIChhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5KCd0eXBlJykpITtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwbGFjZWhvbGRlciBvZiB0aGUgaW5wdXQuICovXG4gIGFzeW5jIGdldFBsYWNlaG9sZGVyKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgLy8gVGhlIFwicGxhY2Vob2xkZXJcIiBwcm9wZXJ0eSBvZiB0aGUgbmF0aXZlIGlucHV0IGlzIG5ldmVyIHVuZGVmaW5lZC5cbiAgICByZXR1cm4gKGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ3BsYWNlaG9sZGVyJykpITtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpZCBvZiB0aGUgaW5wdXQuICovXG4gIGFzeW5jIGdldElkKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgLy8gVGhlIGlucHV0IGRpcmVjdGl2ZSBhbHdheXMgYXNzaWducyBhIHVuaXF1ZSBpZCB0byB0aGUgaW5wdXQgaW5cbiAgICAvLyBjYXNlIG5vIGlkIGhhcyBiZWVuIGV4cGxpY2l0bHkgc3BlY2lmaWVkLlxuICAgIHJldHVybiAoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnaWQnKSkhO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIGlucHV0IGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZVxuICAgKiBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJsdXJzIHRoZSBpbnB1dCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGVcbiAgICogYWN0aW9uIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0LiBUaGUgdmFsdWUgd2lsbCBiZSBzZXQgYnkgc2ltdWxhdGluZ1xuICAgKiBrZXlwcmVzc2VzIHRoYXQgY29ycmVzcG9uZCB0byB0aGUgZ2l2ZW4gdmFsdWUuXG4gICAqL1xuICBhc3luYyBzZXRWYWx1ZShuZXdWYWx1ZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgaW5wdXRFbCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGF3YWl0IGlucHV0RWwuY2xlYXIoKTtcbiAgICAvLyBXZSBkb24ndCB3YW50IHRvIHNlbmQga2V5cyBmb3IgdGhlIHZhbHVlIGlmIHRoZSB2YWx1ZSBpcyBhbiBlbXB0eVxuICAgIC8vIHN0cmluZyBpbiBvcmRlciB0byBjbGVhciB0aGUgdmFsdWUuIFNlbmRpbmcga2V5cyB3aXRoIGFuIGVtcHR5IHN0cmluZ1xuICAgIC8vIHN0aWxsIHJlc3VsdHMgaW4gdW5uZWNlc3NhcnkgZm9jdXMgZXZlbnRzLlxuICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgYXdhaXQgaW5wdXRFbC5zZW5kS2V5cyhuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG59XG4iXX0=