/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator, __read } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
/** Harness for interacting with a standard Material form-field's in tests. */
var MatFormFieldHarness = /** @class */ (function (_super) {
    __extends(MatFormFieldHarness, _super);
    function MatFormFieldHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._prefixContainer = _this.locatorForOptional('.mat-form-field-prefix');
        _this._suffixContainer = _this.locatorForOptional('.mat-form-field-suffix');
        _this._label = _this.locatorForOptional('.mat-form-field-label');
        _this._errors = _this.locatorForAll('.mat-error');
        _this._hints = _this.locatorForAll('mat-hint, .mat-hint');
        _this._inputControl = _this.locatorForOptional(MatInputHarness);
        _this._selectControl = _this.locatorForOptional(MatSelectHarness);
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatFormFieldHarness` that meets
     * certain criteria.
     * @param options Options for filtering which form field instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatFormFieldHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatFormFieldHarness, options)
            .addOption('floatingLabelText', options.floatingLabelText, function (harness, text) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = HarnessPredicate).stringMatches;
                    return [4 /*yield*/, harness.getLabel()];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent(), text])];
            }
        }); }); })
            .addOption('hasErrors', options.hasErrors, function (harness, hasErrors) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.hasErrors()];
                case 1: return [2 /*return*/, (_a.sent()) === hasErrors];
            }
        }); }); });
    };
    /** Gets the appearance of the form-field. */
    MatFormFieldHarness.prototype.getAppearance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hostClasses, appearanceMatch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, (_a.sent()).getAttribute('class')];
                    case 2:
                        hostClasses = _a.sent();
                        if (hostClasses !== null) {
                            appearanceMatch = hostClasses.match(/mat-form-field-appearance-(legacy|standard|fill|outline)(?:$| )/);
                            if (appearanceMatch) {
                                return [2 /*return*/, appearanceMatch[1]];
                            }
                        }
                        throw Error('Could not determine appearance of form-field.');
                }
            });
        });
    };
    // Implementation of the "getControl" method overload signatures.
    MatFormFieldHarness.prototype.getControl = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var hostEl, _a, isInput, isSelect;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (type) {
                            return [2 /*return*/, this.locatorForOptional(type)()];
                        }
                        return [4 /*yield*/, this.host()];
                    case 1:
                        hostEl = _b.sent();
                        return [4 /*yield*/, Promise.all([
                                hostEl.hasClass('mat-form-field-type-mat-input'),
                                hostEl.hasClass('mat-form-field-type-mat-select'),
                            ])];
                    case 2:
                        _a = __read.apply(void 0, [_b.sent(), 2]), isInput = _a[0], isSelect = _a[1];
                        if (isInput) {
                            return [2 /*return*/, this._inputControl()];
                        }
                        else if (isSelect) {
                            return [2 /*return*/, this._selectControl()];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /** Whether the form-field has a label. */
    MatFormFieldHarness.prototype.hasLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-form-field-has-label')];
                }
            });
        });
    };
    /** Gets the label of the form-field. */
    MatFormFieldHarness.prototype.getLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var labelEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._label()];
                    case 1:
                        labelEl = _a.sent();
                        return [2 /*return*/, labelEl ? labelEl.text() : null];
                }
            });
        });
    };
    /** Whether the form-field has errors. */
    MatFormFieldHarness.prototype.hasErrors = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTextErrors()];
                    case 1: return [2 /*return*/, (_a.sent()).length > 0];
                }
            });
        });
    };
    /** Whether the label is currently floating. */
    MatFormFieldHarness.prototype.isLabelFloating = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, hasLabel, shouldFloat, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _c = (_b = Promise).all;
                        _d = [this.hasLabel()];
                        return [4 /*yield*/, this.host()];
                    case 1: return [4 /*yield*/, _c.apply(_b, [_d.concat([
                                (_e.sent()).hasClass('mat-form-field-should-float')
                            ])])];
                    case 2:
                        _a = __read.apply(void 0, [_e.sent(), 2]), hasLabel = _a[0], shouldFloat = _a[1];
                        // If there is no label, the label conceptually can never float. The `should-float` class
                        // is just always set regardless of whether the label is displayed or not.
                        return [2 /*return*/, hasLabel && shouldFloat];
                }
            });
        });
    };
    /** Whether the form-field is disabled. */
    MatFormFieldHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-form-field-disabled')];
                }
            });
        });
    };
    /** Whether the form-field is currently autofilled. */
    MatFormFieldHarness.prototype.isAutofilled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-form-field-autofilled')];
                }
            });
        });
    };
    /** Gets the theme color of the form-field. */
    MatFormFieldHarness.prototype.getThemeColor = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hostEl, _a, isAccent, isWarn;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        hostEl = _b.sent();
                        return [4 /*yield*/, Promise.all([hostEl.hasClass('mat-accent'), hostEl.hasClass('mat-warn')])];
                    case 2:
                        _a = __read.apply(void 0, [_b.sent(), 2]), isAccent = _a[0], isWarn = _a[1];
                        if (isAccent) {
                            return [2 /*return*/, 'accent'];
                        }
                        else if (isWarn) {
                            return [2 /*return*/, 'warn'];
                        }
                        return [2 /*return*/, 'primary'];
                }
            });
        });
    };
    /** Gets error messages which are currently displayed in the form-field. */
    MatFormFieldHarness.prototype.getTextErrors = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = Promise).all;
                        return [4 /*yield*/, this._errors()];
                    case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()).map(function (e) { return e.text(); })])];
                }
            });
        });
    };
    /** Gets hint messages which are currently displayed in the form-field. */
    MatFormFieldHarness.prototype.getTextHints = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = Promise).all;
                        return [4 /*yield*/, this._hints()];
                    case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()).map(function (e) { return e.text(); })])];
                }
            });
        });
    };
    /**
     * Gets a reference to the container element which contains all projected
     * prefixes of the form-field.
     */
    MatFormFieldHarness.prototype.getHarnessLoaderForPrefix = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._prefixContainer()];
            });
        });
    };
    /**
     * Gets a reference to the container element which contains all projected
     * suffixes of the form-field.
     */
    MatFormFieldHarness.prototype.getHarnessLoaderForSuffix = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._suffixContainer()];
            });
        });
    };
    /**
     * Whether the form control has been touched. Returns "null"
     * if no form control is set up.
     */
    MatFormFieldHarness.prototype.isControlTouched = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._hasFormControl()];
                    case 1:
                        if (!(_a.sent())) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.host()];
                    case 2: return [2 /*return*/, (_a.sent()).hasClass('ng-touched')];
                }
            });
        });
    };
    /**
     * Whether the form control is dirty. Returns "null"
     * if no form control is set up.
     */
    MatFormFieldHarness.prototype.isControlDirty = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._hasFormControl()];
                    case 1:
                        if (!(_a.sent())) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.host()];
                    case 2: return [2 /*return*/, (_a.sent()).hasClass('ng-dirty')];
                }
            });
        });
    };
    /**
     * Whether the form control is valid. Returns "null"
     * if no form control is set up.
     */
    MatFormFieldHarness.prototype.isControlValid = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._hasFormControl()];
                    case 1:
                        if (!(_a.sent())) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.host()];
                    case 2: return [2 /*return*/, (_a.sent()).hasClass('ng-valid')];
                }
            });
        });
    };
    /**
     * Whether the form control is pending validation. Returns "null"
     * if no form control is set up.
     */
    MatFormFieldHarness.prototype.isControlPending = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._hasFormControl()];
                    case 1:
                        if (!(_a.sent())) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.host()];
                    case 2: return [2 /*return*/, (_a.sent()).hasClass('ng-pending')];
                }
            });
        });
    };
    /** Checks whether the form-field control has set up a form control. */
    MatFormFieldHarness.prototype._hasFormControl = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hostEl, _a, isTouched, isUntouched;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1:
                        hostEl = _b.sent();
                        return [4 /*yield*/, Promise.all([hostEl.hasClass('ng-touched'), hostEl.hasClass('ng-untouched')])];
                    case 2:
                        _a = __read.apply(void 0, [_b.sent(), 2]), isTouched = _a[0], isUntouched = _a[1];
                        return [2 /*return*/, isTouched || isUntouched];
                }
            });
        });
    };
    MatFormFieldHarness.hostSelector = '.mat-form-field';
    return MatFormFieldHarness;
}(ComponentHarness));
export { MatFormFieldHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9mb3JtLWZpZWxkLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFDTCxnQkFBZ0IsRUFFaEIsZ0JBQWdCLEVBR2pCLE1BQU0sc0JBQXNCLENBQUM7QUFFOUIsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBQ2hFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBUWxFLDhFQUE4RTtBQUM5RTtJQUF5Qyx1Q0FBZ0I7SUFBekQ7UUFBQSxxRUFnTkM7UUEvTFMsc0JBQWdCLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDckUsc0JBQWdCLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDckUsWUFBTSxHQUFHLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzFELGFBQU8sR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzNDLFlBQU0sR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFFbkQsbUJBQWEsR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekQsb0JBQWMsR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7SUF3THJFLENBQUM7SUE3TUM7Ozs7O09BS0c7SUFDSSx3QkFBSSxHQUFYLFVBQVksT0FBcUM7UUFBakQsaUJBTUM7UUFOVyx3QkFBQSxFQUFBLFlBQXFDO1FBQy9DLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxt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RyxTQUFpQjt3QkFLNUIscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUE7O3dCQURqRixLQUFBLHNCQUNGLFNBQW1GLEtBQUEsRUFEaEYsU0FBUyxRQUFBLEVBQUUsV0FBVyxRQUFBO3dCQUU3QixzQkFBTyxTQUFTLElBQUksV0FBVyxFQUFDOzs7O0tBQ2pDO0lBOU1NLGdDQUFZLEdBQUcsaUJBQWlCLENBQUM7SUErTTFDLDBCQUFDO0NBQUEsQUFoTkQsQ0FBeUMsZ0JBQWdCLEdBZ054RDtTQWhOWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBIYXJuZXNzUHJlZGljYXRlLFxuICBIYXJuZXNzUXVlcnksXG4gIFRlc3RFbGVtZW50XG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9jb250cm9sJztcbmltcG9ydCB7TWF0SW5wdXRIYXJuZXNzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dC90ZXN0aW5nJztcbmltcG9ydCB7TWF0U2VsZWN0SGFybmVzc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0L3Rlc3RpbmcnO1xuaW1wb3J0IHtGb3JtRmllbGRIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9mb3JtLWZpZWxkLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8vIFRPRE8oZGV2dmVyc2lvbik6IHN1cHBvcnQgZGF0ZXBpY2tlciBoYXJuZXNzIG9uY2UgZGV2ZWxvcGVkIChDT01QLTIwMykuXG4vLyBBbHNvIHN1cHBvcnQgY2hpcCBsaXN0IGhhcm5lc3MuXG4vKiogUG9zc2libGUgaGFybmVzc2VzIG9mIGNvbnRyb2xzIHdoaWNoIGNhbiBiZSBib3VuZCB0byBhIGZvcm0tZmllbGQuICovXG5leHBvcnQgdHlwZSBGb3JtRmllbGRDb250cm9sSGFybmVzcyA9IE1hdElucHV0SGFybmVzc3xNYXRTZWxlY3RIYXJuZXNzO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdGVyaWFsIGZvcm0tZmllbGQncyBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRGb3JtRmllbGRIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1mb3JtLWZpZWxkJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0Rm9ybUZpZWxkSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggZm9ybSBmaWVsZCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBGb3JtRmllbGRIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRGb3JtRmllbGRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEZvcm1GaWVsZEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAuYWRkT3B0aW9uKCdmbG9hdGluZ0xhYmVsVGV4dCcsIG9wdGlvbnMuZmxvYXRpbmdMYWJlbFRleHQsIGFzeW5jIChoYXJuZXNzLCB0ZXh0KSA9PlxuICAgICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhhd2FpdCBoYXJuZXNzLmdldExhYmVsKCksIHRleHQpKVxuICAgICAgLmFkZE9wdGlvbignaGFzRXJyb3JzJywgb3B0aW9ucy5oYXNFcnJvcnMsIGFzeW5jIChoYXJuZXNzLCBoYXNFcnJvcnMpID0+XG4gICAgICAgICAgYXdhaXQgaGFybmVzcy5oYXNFcnJvcnMoKSA9PT0gaGFzRXJyb3JzKTtcbiAgfVxuXG4gIHByaXZhdGUgX3ByZWZpeENvbnRhaW5lciA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LWZvcm0tZmllbGQtcHJlZml4Jyk7XG4gIHByaXZhdGUgX3N1ZmZpeENvbnRhaW5lciA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LWZvcm0tZmllbGQtc3VmZml4Jyk7XG4gIHByaXZhdGUgX2xhYmVsID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtZm9ybS1maWVsZC1sYWJlbCcpO1xuICBwcml2YXRlIF9lcnJvcnMgPSB0aGlzLmxvY2F0b3JGb3JBbGwoJy5tYXQtZXJyb3InKTtcbiAgcHJpdmF0ZSBfaGludHMgPSB0aGlzLmxvY2F0b3JGb3JBbGwoJ21hdC1oaW50LCAubWF0LWhpbnQnKTtcblxuICBwcml2YXRlIF9pbnB1dENvbnRyb2wgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChNYXRJbnB1dEhhcm5lc3MpO1xuICBwcml2YXRlIF9zZWxlY3RDb250cm9sID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0U2VsZWN0SGFybmVzcyk7XG5cbiAgLyoqIEdldHMgdGhlIGFwcGVhcmFuY2Ugb2YgdGhlIGZvcm0tZmllbGQuICovXG4gIGFzeW5jIGdldEFwcGVhcmFuY2UoKTogUHJvbWlzZTwnbGVnYWN5J3wnc3RhbmRhcmQnfCdmaWxsJ3wnb3V0bGluZSc+IHtcbiAgICBjb25zdCBob3N0Q2xhc3NlcyA9IGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xuICAgIGlmIChob3N0Q2xhc3NlcyAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgYXBwZWFyYW5jZU1hdGNoID1cbiAgICAgICAgICBob3N0Q2xhc3Nlcy5tYXRjaCgvbWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS0obGVnYWN5fHN0YW5kYXJkfGZpbGx8b3V0bGluZSkoPzokfCApLyk7XG4gICAgICBpZiAoYXBwZWFyYW5jZU1hdGNoKSB7XG4gICAgICAgIHJldHVybiBhcHBlYXJhbmNlTWF0Y2hbMV0gYXMgJ2xlZ2FjeScgfCAnc3RhbmRhcmQnIHwgJ2ZpbGwnIHwgJ291dGxpbmUnO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBFcnJvcignQ291bGQgbm90IGRldGVybWluZSBhcHBlYXJhbmNlIG9mIGZvcm0tZmllbGQuJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaGFybmVzcyBvZiB0aGUgY29udHJvbCB0aGF0IGlzIGJvdW5kIHRvIHRoZSBmb3JtLWZpZWxkLiBPbmx5XG4gICAqIGRlZmF1bHQgY29udHJvbHMgc3VjaCBhcyBcIk1hdElucHV0SGFybmVzc1wiIGFuZCBcIk1hdFNlbGVjdEhhcm5lc3NcIiBhcmVcbiAgICogc3VwcG9ydGVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0Q29udHJvbCgpOiBQcm9taXNlPEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzfG51bGw+O1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBoYXJuZXNzIG9mIHRoZSBjb250cm9sIHRoYXQgaXMgYm91bmQgdG8gdGhlIGZvcm0tZmllbGQuIFNlYXJjaGVzXG4gICAqIGZvciBhIGNvbnRyb2wgdGhhdCBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgaGFybmVzcyB0eXBlLlxuICAgKi9cbiAgYXN5bmMgZ2V0Q29udHJvbDxYIGV4dGVuZHMgTWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3M+KHR5cGU6IENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxYPik6XG4gICAgICBQcm9taXNlPFh8bnVsbD47XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGhhcm5lc3Mgb2YgdGhlIGNvbnRyb2wgdGhhdCBpcyBib3VuZCB0byB0aGUgZm9ybS1maWVsZC4gU2VhcmNoZXNcbiAgICogZm9yIGEgY29udHJvbCB0aGF0IG1hdGNoZXMgdGhlIHNwZWNpZmllZCBoYXJuZXNzIHByZWRpY2F0ZS5cbiAgICovXG4gIGFzeW5jIGdldENvbnRyb2w8WCBleHRlbmRzIE1hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzPih0eXBlOiBIYXJuZXNzUHJlZGljYXRlPFg+KTpcbiAgICAgIFByb21pc2U8WHxudWxsPjtcblxuICAvLyBJbXBsZW1lbnRhdGlvbiBvZiB0aGUgXCJnZXRDb250cm9sXCIgbWV0aG9kIG92ZXJsb2FkIHNpZ25hdHVyZXMuXG4gIGFzeW5jIGdldENvbnRyb2w8WCBleHRlbmRzIE1hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzPih0eXBlPzogSGFybmVzc1F1ZXJ5PFg+KSB7XG4gICAgaWYgKHR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCh0eXBlKSgpO1xuICAgIH1cbiAgICBjb25zdCBob3N0RWwgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBjb25zdCBbaXNJbnB1dCwgaXNTZWxlY3RdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgaG9zdEVsLmhhc0NsYXNzKCdtYXQtZm9ybS1maWVsZC10eXBlLW1hdC1pbnB1dCcpLFxuICAgICAgaG9zdEVsLmhhc0NsYXNzKCdtYXQtZm9ybS1maWVsZC10eXBlLW1hdC1zZWxlY3QnKSxcbiAgICBdKTtcbiAgICBpZiAoaXNJbnB1dCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2lucHV0Q29udHJvbCgpO1xuICAgIH0gZWxzZSBpZiAoaXNTZWxlY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RDb250cm9sKCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZvcm0tZmllbGQgaGFzIGEgbGFiZWwuICovXG4gIGFzeW5jIGhhc0xhYmVsKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtZm9ybS1maWVsZC1oYXMtbGFiZWwnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsYWJlbCBvZiB0aGUgZm9ybS1maWVsZC4gKi9cbiAgYXN5bmMgZ2V0TGFiZWwoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIGNvbnN0IGxhYmVsRWwgPSBhd2FpdCB0aGlzLl9sYWJlbCgpO1xuICAgIHJldHVybiBsYWJlbEVsID8gbGFiZWxFbC50ZXh0KCkgOiBudWxsO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZvcm0tZmllbGQgaGFzIGVycm9ycy4gKi9cbiAgYXN5bmMgaGFzRXJyb3JzKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRUZXh0RXJyb3JzKCkpLmxlbmd0aCA+IDA7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbGFiZWwgaXMgY3VycmVudGx5IGZsb2F0aW5nLiAqL1xuICBhc3luYyBpc0xhYmVsRmxvYXRpbmcoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgW2hhc0xhYmVsLCBzaG91bGRGbG9hdF0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLmhhc0xhYmVsKCksXG4gICAgICAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtZm9ybS1maWVsZC1zaG91bGQtZmxvYXQnKSxcbiAgICBdKTtcbiAgICAvLyBJZiB0aGVyZSBpcyBubyBsYWJlbCwgdGhlIGxhYmVsIGNvbmNlcHR1YWxseSBjYW4gbmV2ZXIgZmxvYXQuIFRoZSBgc2hvdWxkLWZsb2F0YCBjbGFzc1xuICAgIC8vIGlzIGp1c3QgYWx3YXlzIHNldCByZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhlIGxhYmVsIGlzIGRpc3BsYXllZCBvciBub3QuXG4gICAgcmV0dXJuIGhhc0xhYmVsICYmIHNob3VsZEZsb2F0O1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZvcm0tZmllbGQgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLWRpc2FibGVkJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZm9ybS1maWVsZCBpcyBjdXJyZW50bHkgYXV0b2ZpbGxlZC4gKi9cbiAgYXN5bmMgaXNBdXRvZmlsbGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtZm9ybS1maWVsZC1hdXRvZmlsbGVkJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGhlbWUgY29sb3Igb2YgdGhlIGZvcm0tZmllbGQuICovXG4gIGFzeW5jIGdldFRoZW1lQ29sb3IoKTogUHJvbWlzZTwncHJpbWFyeSd8J2FjY2VudCd8J3dhcm4nPiB7XG4gICAgY29uc3QgaG9zdEVsID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgW2lzQWNjZW50LCBpc1dhcm5dID1cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW2hvc3RFbC5oYXNDbGFzcygnbWF0LWFjY2VudCcpLCBob3N0RWwuaGFzQ2xhc3MoJ21hdC13YXJuJyldKTtcbiAgICBpZiAoaXNBY2NlbnQpIHtcbiAgICAgIHJldHVybiAnYWNjZW50JztcbiAgICB9IGVsc2UgaWYgKGlzV2Fybikge1xuICAgICAgcmV0dXJuICd3YXJuJztcbiAgICB9XG4gICAgcmV0dXJuICdwcmltYXJ5JztcbiAgfVxuXG4gIC8qKiBHZXRzIGVycm9yIG1lc3NhZ2VzIHdoaWNoIGFyZSBjdXJyZW50bHkgZGlzcGxheWVkIGluIHRoZSBmb3JtLWZpZWxkLiAqL1xuICBhc3luYyBnZXRUZXh0RXJyb3JzKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoKGF3YWl0IHRoaXMuX2Vycm9ycygpKS5tYXAoZSA9PiBlLnRleHQoKSkpO1xuICB9XG5cbiAgLyoqIEdldHMgaGludCBtZXNzYWdlcyB3aGljaCBhcmUgY3VycmVudGx5IGRpc3BsYXllZCBpbiB0aGUgZm9ybS1maWVsZC4gKi9cbiAgYXN5bmMgZ2V0VGV4dEhpbnRzKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoKGF3YWl0IHRoaXMuX2hpbnRzKCkpLm1hcChlID0+IGUudGV4dCgpKSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHJlZmVyZW5jZSB0byB0aGUgY29udGFpbmVyIGVsZW1lbnQgd2hpY2ggY29udGFpbnMgYWxsIHByb2plY3RlZFxuICAgKiBwcmVmaXhlcyBvZiB0aGUgZm9ybS1maWVsZC5cbiAgICovXG4gIGFzeW5jIGdldEhhcm5lc3NMb2FkZXJGb3JQcmVmaXgoKTogUHJvbWlzZTxUZXN0RWxlbWVudHxudWxsPiB7XG4gICAgcmV0dXJuIHRoaXMuX3ByZWZpeENvbnRhaW5lcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSByZWZlcmVuY2UgdG8gdGhlIGNvbnRhaW5lciBlbGVtZW50IHdoaWNoIGNvbnRhaW5zIGFsbCBwcm9qZWN0ZWRcbiAgICogc3VmZml4ZXMgb2YgdGhlIGZvcm0tZmllbGQuXG4gICAqL1xuICBhc3luYyBnZXRIYXJuZXNzTG9hZGVyRm9yU3VmZml4KCk6IFByb21pc2U8VGVzdEVsZW1lbnR8bnVsbD4ge1xuICAgIHJldHVybiB0aGlzLl9zdWZmaXhDb250YWluZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBmb3JtIGNvbnRyb2wgaGFzIGJlZW4gdG91Y2hlZC4gUmV0dXJucyBcIm51bGxcIlxuICAgKiBpZiBubyBmb3JtIGNvbnRyb2wgaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgaXNDb250cm9sVG91Y2hlZCgpOiBQcm9taXNlPGJvb2xlYW58bnVsbD4ge1xuICAgIGlmICghYXdhaXQgdGhpcy5faGFzRm9ybUNvbnRyb2woKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCduZy10b3VjaGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZm9ybSBjb250cm9sIGlzIGRpcnR5LiBSZXR1cm5zIFwibnVsbFwiXG4gICAqIGlmIG5vIGZvcm0gY29udHJvbCBpcyBzZXQgdXAuXG4gICAqL1xuICBhc3luYyBpc0NvbnRyb2xEaXJ0eSgpOiBQcm9taXNlPGJvb2xlYW58bnVsbD4ge1xuICAgIGlmICghYXdhaXQgdGhpcy5faGFzRm9ybUNvbnRyb2woKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCduZy1kaXJ0eScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGZvcm0gY29udHJvbCBpcyB2YWxpZC4gUmV0dXJucyBcIm51bGxcIlxuICAgKiBpZiBubyBmb3JtIGNvbnRyb2wgaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgaXNDb250cm9sVmFsaWQoKTogUHJvbWlzZTxib29sZWFufG51bGw+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuX2hhc0Zvcm1Db250cm9sKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbmctdmFsaWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBmb3JtIGNvbnRyb2wgaXMgcGVuZGluZyB2YWxpZGF0aW9uLiBSZXR1cm5zIFwibnVsbFwiXG4gICAqIGlmIG5vIGZvcm0gY29udHJvbCBpcyBzZXQgdXAuXG4gICAqL1xuICBhc3luYyBpc0NvbnRyb2xQZW5kaW5nKCk6IFByb21pc2U8Ym9vbGVhbnxudWxsPiB7XG4gICAgaWYgKCFhd2FpdCB0aGlzLl9oYXNGb3JtQ29udHJvbCgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ25nLXBlbmRpbmcnKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgZm9ybS1maWVsZCBjb250cm9sIGhhcyBzZXQgdXAgYSBmb3JtIGNvbnRyb2wuICovXG4gIHByaXZhdGUgYXN5bmMgX2hhc0Zvcm1Db250cm9sKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGhvc3RFbCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIC8vIElmIG5vIGZvcm0gXCJOZ0NvbnRyb2xcIiBpcyBib3VuZCB0byB0aGUgZm9ybS1maWVsZCBjb250cm9sLCB0aGUgZm9ybS1maWVsZFxuICAgIC8vIGlzIG5vdCBhYmxlIHRvIGZvcndhcmQgYW55IGNvbnRyb2wgc3RhdHVzIGNsYXNzZXMuIFRoZXJlZm9yZSBpZiBlaXRoZXIgdGhlXG4gICAgLy8gXCJuZy10b3VjaGVkXCIgb3IgXCJuZy11bnRvdWNoZWRcIiBjbGFzcyBpcyBzZXQsIHdlIGtub3cgdGhhdCBpdCBoYXMgYSBmb3JtIGNvbnRyb2xcbiAgICBjb25zdCBbaXNUb3VjaGVkLCBpc1VudG91Y2hlZF0gPVxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbaG9zdEVsLmhhc0NsYXNzKCduZy10b3VjaGVkJyksIGhvc3RFbC5oYXNDbGFzcygnbmctdW50b3VjaGVkJyldKTtcbiAgICByZXR1cm4gaXNUb3VjaGVkIHx8IGlzVW50b3VjaGVkO1xuICB9XG59XG4iXX0=