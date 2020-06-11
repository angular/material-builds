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
                    case 4:
                        if (!inputEl.setInputValue) return [3 /*break*/, 6];
                        return [4 /*yield*/, inputEl.setInputValue(newValue)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pbnB1dC90ZXN0aW5nL2lucHV0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBR3hGLHdFQUF3RTtBQUN4RTtJQUFxQyxtQ0FBMEI7SUFBL0Q7O0lBNkdBLENBQUM7SUF2R0M7Ozs7O09BS0c7SUFDSSxvQkFBSSxHQUFYLFVBQVksT0FBaUM7UUFBN0MsaUJBUUM7UUFSVyx3QkFBQSxFQUFBLFlBQWlDO1FBQzNDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDO2FBQ2hELFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFPLE9BQU8sRUFBRSxLQUFLOzs7NEJBQzlDLHFCQUFNLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBQTs0QkFBaEMsc0JBQU8sQ0FBQyxTQUF3QixDQUFDLEtBQUssS0FBSyxFQUFDOzs7YUFDN0MsQ0FBQzthQUNELFNBQVMsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxVQUFPLE9BQU8sRUFBRSxXQUFXOzs7NEJBQ2hFLHFCQUFNLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBQTs0QkFBdEMsc0JBQU8sQ0FBQyxTQUE4QixDQUFDLEtBQUssV0FBVyxFQUFDOzs7YUFDekQsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVELHFDQUFxQztJQUMvQixvQ0FBVSxHQUFoQjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFdBQVcs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cUJBQU0sT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBQTs7d0JBQXJDLFNBQXFDLENBQUM7Ozs7OztLQUV6QztJQTNHRCxtRkFBbUY7SUFDbkYsOEVBQThFO0lBQzlFLDJFQUEyRTtJQUNwRSw0QkFBWSxHQUFHLGlFQUFpRSxDQUFDO0lBeUcxRixzQkFBQztDQUFBLEFBN0dELENBQXFDLDBCQUEwQixHQTZHOUQ7U0E3R1ksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9jb250cm9sJztcbmltcG9ydCB7SW5wdXRIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9pbnB1dC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdGVyaWFsIGlucHV0cyBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRJbnB1dEhhcm5lc3MgZXh0ZW5kcyBNYXRGb3JtRmllbGRDb250cm9sSGFybmVzcyB7XG4gIC8vIFRPRE86IFdlIGRvIG5vdCB3YW50IHRvIGhhbmRsZSBgc2VsZWN0YCBlbGVtZW50cyB3aXRoIGBtYXROYXRpdmVDb250cm9sYCBiZWNhdXNlXG4gIC8vIG5vdCBhbGwgbWV0aG9kcyBvZiB0aGlzIGhhcm5lc3Mgd29yayByZWFzb25hYmx5IGZvciBuYXRpdmUgc2VsZWN0IGVsZW1lbnRzLlxuICAvLyBGb3IgbW9yZSBkZXRhaWxzLiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xODIyMS5cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICdbbWF0SW5wdXRdLCBpbnB1dFttYXROYXRpdmVDb250cm9sXSwgdGV4dGFyZWFbbWF0TmF0aXZlQ29udHJvbF0nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRJbnB1dEhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGlucHV0IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IElucHV0SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0SW5wdXRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdElucHV0SGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigndmFsdWUnLCBvcHRpb25zLnZhbHVlLCBhc3luYyAoaGFybmVzcywgdmFsdWUpID0+IHtcbiAgICAgICAgICByZXR1cm4gKGF3YWl0IGhhcm5lc3MuZ2V0VmFsdWUoKSkgPT09IHZhbHVlO1xuICAgICAgICB9KVxuICAgICAgICAuYWRkT3B0aW9uKCdwbGFjZWhvbGRlcicsIG9wdGlvbnMucGxhY2Vob2xkZXIsIGFzeW5jIChoYXJuZXNzLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICAgIHJldHVybiAoYXdhaXQgaGFybmVzcy5nZXRQbGFjZWhvbGRlcigpKSA9PT0gcGxhY2Vob2xkZXI7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5KCdkaXNhYmxlZCcpITtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyByZXF1aXJlZC4gKi9cbiAgYXN5bmMgaXNSZXF1aXJlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgncmVxdWlyZWQnKSE7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgcmVhZG9ubHkuICovXG4gIGFzeW5jIGlzUmVhZG9ubHkoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ3JlYWRPbmx5JykhO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgXCJ2YWx1ZVwiIHByb3BlcnR5IG9mIHRoZSBuYXRpdmUgaW5wdXQgaXMgbmV2ZXIgdW5kZWZpbmVkLlxuICAgIHJldHVybiAoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgndmFsdWUnKSkhO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG5hbWUgb2YgdGhlIGlucHV0LiAqL1xuICBhc3luYyBnZXROYW1lKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgLy8gVGhlIFwibmFtZVwiIHByb3BlcnR5IG9mIHRoZSBuYXRpdmUgaW5wdXQgaXMgbmV2ZXIgdW5kZWZpbmVkLlxuICAgIHJldHVybiAoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnbmFtZScpKSE7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdHlwZSBvZiB0aGUgaW5wdXQuIFJldHVybnMgXCJ0ZXh0YXJlYVwiIGlmIHRoZSBpbnB1dCBpc1xuICAgKiBhIHRleHRhcmVhLlxuICAgKi9cbiAgYXN5bmMgZ2V0VHlwZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIC8vIFRoZSBcInR5cGVcIiBwcm9wZXJ0eSBvZiB0aGUgbmF0aXZlIGlucHV0IGlzIG5ldmVyIHVuZGVmaW5lZC5cbiAgICByZXR1cm4gKGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ3R5cGUnKSkhO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBsYWNlaG9sZGVyIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0UGxhY2Vob2xkZXIoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgXCJwbGFjZWhvbGRlclwiIHByb3BlcnR5IG9mIHRoZSBuYXRpdmUgaW5wdXQgaXMgbmV2ZXIgdW5kZWZpbmVkLlxuICAgIHJldHVybiAoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgncGxhY2Vob2xkZXInKSkhO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlkIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0SWQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgaW5wdXQgZGlyZWN0aXZlIGFsd2F5cyBhc3NpZ25zIGEgdW5pcXVlIGlkIHRvIHRoZSBpbnB1dCBpblxuICAgIC8vIGNhc2Ugbm8gaWQgaGFzIGJlZW4gZXhwbGljaXRseSBzcGVjaWZpZWQuXG4gICAgcmV0dXJuIChhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5KCdpZCcpKSE7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgaW5wdXQgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlXG4gICAqIGFjdGlvbiBpcyBjb21wbGV0ZS5cbiAgICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogQmx1cnMgdGhlIGlucHV0IGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZVxuICAgKiBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQuIFRoZSB2YWx1ZSB3aWxsIGJlIHNldCBieSBzaW11bGF0aW5nXG4gICAqIGtleXByZXNzZXMgdGhhdCBjb3JyZXNwb25kIHRvIHRoZSBnaXZlbiB2YWx1ZS5cbiAgICovXG4gIGFzeW5jIHNldFZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBpbnB1dEVsID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgYXdhaXQgaW5wdXRFbC5jbGVhcigpO1xuICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gc2VuZCBrZXlzIGZvciB0aGUgdmFsdWUgaWYgdGhlIHZhbHVlIGlzIGFuIGVtcHR5XG4gICAgLy8gc3RyaW5nIGluIG9yZGVyIHRvIGNsZWFyIHRoZSB2YWx1ZS4gU2VuZGluZyBrZXlzIHdpdGggYW4gZW1wdHkgc3RyaW5nXG4gICAgLy8gc3RpbGwgcmVzdWx0cyBpbiB1bm5lY2Vzc2FyeSBmb2N1cyBldmVudHMuXG4gICAgaWYgKG5ld1ZhbHVlKSB7XG4gICAgICBhd2FpdCBpbnB1dEVsLnNlbmRLZXlzKG5ld1ZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBTb21lIGlucHV0IHR5cGVzIHdvbid0IHJlc3BvbmQgdG8ga2V5IHByZXNzZXMgKGUuZy4gYGNvbG9yYCkgc28gdG8gYmUgc3VyZSB0aGF0IHRoZVxuICAgIC8vIHZhbHVlIGlzIHNldCwgd2UgYWxzbyBzZXQgdGhlIHByb3BlcnR5IGFmdGVyIHRoZSBrZXlib2FyZCBzZXF1ZW5jZS4gTm90ZSB0aGF0IHdlIGRvbid0XG4gICAgLy8gd2FudCB0byBkbyBpdCBiZWZvcmUsIGJlY2F1c2UgaXQgY2FuIGNhdXNlIHRoZSB2YWx1ZSB0byBiZSBlbnRlcmVkIHR3aWNlLlxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIFJlbW92ZSBub24tbnVsbCBhc3NlcnRpb24gb25jZSBgc2V0SW5wdXRWYWx1ZWAgaXMgcmVxdWlyZWQuXG4gICAgaWYgKGlucHV0RWwuc2V0SW5wdXRWYWx1ZSkge1xuICAgICAgYXdhaXQgaW5wdXRFbC5zZXRJbnB1dFZhbHVlKG5ld1ZhbHVlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==