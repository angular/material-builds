/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
var EXPANSION_PANEL_CONTENT_SELECTOR = '.mat-expansion-panel-content';
/** Harness for interacting with a standard mat-expansion-panel in tests. */
var MatExpansionPanelHarness = /** @class */ (function (_super) {
    __extends(MatExpansionPanelHarness, _super);
    function MatExpansionPanelHarness() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._header = _this.locatorFor('.mat-expansion-panel-header');
        _this._title = _this.locatorForOptional('.mat-expansion-panel-header-title');
        _this._description = _this.locatorForOptional('.mat-expansion-panel-header-description');
        _this._expansionIndicator = _this.locatorForOptional('.mat-expansion-indicator');
        _this._content = _this.locatorFor(EXPANSION_PANEL_CONTENT_SELECTOR);
        return _this;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for an expansion-panel
     * with specific attributes.
     * @param options Options for narrowing the search:
     *   - `title` finds an expansion-panel with a specific title text.
     *   - `description` finds an expansion-panel with a specific description text.
     *   - `expanded` finds an expansion-panel that is currently expanded.
     *   - `disabled` finds an expansion-panel that is disabled.
     * @return a `HarnessPredicate` configured with the given options.
     */
    MatExpansionPanelHarness.with = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new HarnessPredicate(MatExpansionPanelHarness, options)
            .addOption('title', options.title, function (harness, title) { return HarnessPredicate.stringMatches(harness.getTitle(), title); })
            .addOption('description', options.description, function (harness, description) {
            return HarnessPredicate.stringMatches(harness.getDescription(), description);
        })
            .addOption('content', options.content, function (harness, content) { return HarnessPredicate.stringMatches(harness.getTextContent(), content); })
            .addOption('expanded', options.expanded, function (harness, expanded) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.isExpanded()];
                case 1: return [2 /*return*/, (_a.sent()) === expanded];
            }
        }); }); })
            .addOption('disabled', options.disabled, function (harness, disabled) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.isDisabled()];
                case 1: return [2 /*return*/, (_a.sent()) === disabled];
            }
        }); }); });
    };
    /** Whether the panel is expanded. */
    MatExpansionPanelHarness.prototype.isExpanded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.host()];
                    case 1: return [2 /*return*/, (_a.sent()).hasClass('mat-expanded')];
                }
            });
        });
    };
    /**
     * Gets the title text of the panel.
     * @returns Title text or `null` if no title is set up.
     */
    MatExpansionPanelHarness.prototype.getTitle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var titleEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._title()];
                    case 1:
                        titleEl = _a.sent();
                        return [2 /*return*/, titleEl ? titleEl.text() : null];
                }
            });
        });
    };
    /**
     * Gets the description text of the panel.
     * @returns Description text or `null` if no description is set up.
     */
    MatExpansionPanelHarness.prototype.getDescription = function () {
        return __awaiter(this, void 0, void 0, function () {
            var descriptionEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._description()];
                    case 1:
                        descriptionEl = _a.sent();
                        return [2 /*return*/, descriptionEl ? descriptionEl.text() : null];
                }
            });
        });
    };
    /** Whether the panel is disabled. */
    MatExpansionPanelHarness.prototype.isDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._header()];
                    case 1: return [4 /*yield*/, (_a.sent()).getAttribute('aria-disabled')];
                    case 2: return [2 /*return*/, (_a.sent()) === 'true'];
                }
            });
        });
    };
    /**
     * Toggles the expanded state of the panel by clicking on the panel
     * header. This method will not work if the panel is disabled.
     */
    MatExpansionPanelHarness.prototype.toggle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._header()];
                    case 1: return [4 /*yield*/, (_a.sent()).click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Expands the expansion panel if collapsed. */
    MatExpansionPanelHarness.prototype.expand = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isExpanded()];
                    case 1:
                        if (!!(_a.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.toggle()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /** Collapses the expansion panel if expanded. */
    MatExpansionPanelHarness.prototype.collapse = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isExpanded()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.toggle()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /** Gets the text content of the panel. */
    MatExpansionPanelHarness.prototype.getTextContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._content()];
                    case 1: return [2 /*return*/, (_a.sent()).text()];
                }
            });
        });
    };
    /**
     * Gets a `HarnessLoader` that can be used to load harnesses for
     * components within the panel's content area.
     */
    MatExpansionPanelHarness.prototype.getHarnessLoaderForContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.locatorFactory.harnessLoaderFor(EXPANSION_PANEL_CONTENT_SELECTOR)];
            });
        });
    };
    /** Focuses the panel. */
    MatExpansionPanelHarness.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._header()];
                    case 1: return [2 /*return*/, (_a.sent()).focus()];
                }
            });
        });
    };
    /** Blurs the panel. */
    MatExpansionPanelHarness.prototype.blur = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._header()];
                    case 1: return [2 /*return*/, (_a.sent()).blur()];
                }
            });
        });
    };
    /** Whether the panel has a toggle indicator displayed. */
    MatExpansionPanelHarness.prototype.hasToggleIndicator = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._expansionIndicator()];
                    case 1: return [2 /*return*/, (_a.sent()) !== null];
                }
            });
        });
    };
    /** Gets the position of the toggle indicator. */
    MatExpansionPanelHarness.prototype.getToggleIndicatorPosition = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._header()];
                    case 1: return [4 /*yield*/, (_a.sent()).hasClass('mat-expansion-toggle-indicator-before')];
                    case 2:
                        // By default the expansion indicator will show "after" the panel header content.
                        if (_a.sent()) {
                            return [2 /*return*/, 'before'];
                        }
                        return [2 /*return*/, 'after'];
                }
            });
        });
    };
    MatExpansionPanelHarness.hostSelector = '.mat-expansion-panel';
    return MatExpansionPanelHarness;
}(ComponentHarness));
export { MatExpansionPanelHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZXhwYW5zaW9uL3Rlc3RpbmcvZXhwYW5zaW9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBaUIsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUd2RixJQUFNLGdDQUFnQyxHQUFHLDhCQUE4QixDQUFDO0FBRXhFLDRFQUE0RTtBQUM1RTtJQUE4Qyw0Q0FBZ0I7SUFBOUQ7UUFBQSxxRUE4SEM7UUEzSFMsYUFBTyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUN6RCxZQUFNLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDdEUsa0JBQVksR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMseUNBQXlDLENBQUMsQ0FBQztRQUNsRix5QkFBbUIsR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUMxRSxjQUFRLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDOztJQXVIdkUsQ0FBQztJQXJIQzs7Ozs7Ozs7O09BU0c7SUFDSSw2QkFBSSxHQUFYLFVBQVksT0FBMEM7UUFBdEQsaUJBbUJDO1FBbkJXLHdCQUFBLEVBQUEsWUFBMEM7UUFFcEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQzthQUN6RCxTQUFTLENBQ04sT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQ3RCLFVBQUMsT0FBTyxFQUFFLEtBQUssSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQXpELENBQXlELENBQUM7YUFDakYsU0FBUyxDQUNOLGFBQWEsRUFBRSxPQUFPLENBQUMsV0FBVyxFQUNsQyxVQUFDLE9BQU8sRUFBRSxXQUFXO1lBQ2pCLE9BQUEsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBRSxXQUFXLENBQUM7UUFBckUsQ0FBcUUsQ0FBQzthQUM3RSxTQUFTLENBQ04sU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQzFCLFVBQUMsT0FBTyxFQUFFLE9BQU8sSUFBSyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQWpFLENBQWlFLENBQUM7YUFDM0YsU0FBUyxDQUNOLFVBQVUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUM1QixVQUFPLE9BQU8sRUFBRSxRQUFROzt3QkFBTSxxQkFBTSxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUE7d0JBQTNCLHNCQUFBLENBQUMsU0FBMEIsQ0FBQyxLQUFLLFFBQVEsRUFBQTs7aUJBQUEsQ0FBQzthQUMxRSxTQUFTLENBQ04sVUFBVSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQzVCLFVBQU8sT0FBTyxFQUFFLFFBQVE7O3dCQUFNLHFCQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBQTt3QkFBM0Isc0JBQUEsQ0FBQyxTQUEwQixDQUFDLEtBQUssUUFBUSxFQUFBOztpQkFBQSxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUVELHFDQUFxQztJQUMvQiw2Q0FBVSxHQUFoQjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBQzs7OztLQUNyRDtJQUVEOzs7T0FHRztJQUNHLDJDQUFRLEdBQWQ7Ozs7OzRCQUNrQixxQkFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUE7O3dCQUE3QixPQUFPLEdBQUcsU0FBbUI7d0JBQ25DLHNCQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUM7Ozs7S0FDeEM7SUFFRDs7O09BR0c7SUFDRyxpREFBYyxHQUFwQjs7Ozs7NEJBQ3dCLHFCQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBQTs7d0JBQXpDLGFBQWEsR0FBRyxTQUF5Qjt3QkFDL0Msc0JBQU8sYUFBYSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQzs7OztLQUNwRDtJQUVELHFDQUFxQztJQUMvQiw2Q0FBVSxHQUFoQjs7Ozs0QkFDZ0IscUJBQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFBOzRCQUEzQixxQkFBTSxDQUFDLFNBQW9CLENBQUMsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEVBQUE7NEJBQWpFLHNCQUFPLENBQUEsU0FBMEQsTUFBSyxNQUFNLEVBQUM7Ozs7S0FDOUU7SUFFRDs7O09BR0c7SUFDRyx5Q0FBTSxHQUFaOzs7OzRCQUNTLHFCQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQTs0QkFBM0IscUJBQU0sQ0FBQyxTQUFvQixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUFwQyxTQUFvQyxDQUFDOzs7OztLQUN0QztJQUVELGdEQUFnRDtJQUMxQyx5Q0FBTSxHQUFaOzs7OzRCQUNPLHFCQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBQTs7NkJBQXhCLENBQUMsQ0FBQSxTQUF1QixDQUFBLEVBQXhCLHdCQUF3Qjt3QkFDMUIscUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFBOzt3QkFBbkIsU0FBbUIsQ0FBQzs7Ozs7O0tBRXZCO0lBRUQsaURBQWlEO0lBQzNDLDJDQUFRLEdBQWQ7Ozs7NEJBQ00scUJBQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFBOzs2QkFBdkIsU0FBdUIsRUFBdkIsd0JBQXVCO3dCQUN6QixxQkFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUE7O3dCQUFuQixTQUFtQixDQUFDOzs7Ozs7S0FFdkI7SUFFRCwwQ0FBMEM7SUFDcEMsaURBQWMsR0FBcEI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFBOzRCQUE3QixzQkFBTyxDQUFDLFNBQXFCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBQzs7OztLQUN2QztJQUVEOzs7T0FHRztJQUNHLDZEQUEwQixHQUFoQzs7O2dCQUNFLHNCQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsZ0NBQWdDLENBQUMsRUFBQzs7O0tBQy9FO0lBRUQseUJBQXlCO0lBQ25CLHdDQUFLLEdBQVg7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFBOzRCQUE1QixzQkFBTyxDQUFDLFNBQW9CLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBQzs7OztLQUN2QztJQUVELHVCQUF1QjtJQUNqQix1Q0FBSSxHQUFWOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQTs0QkFBNUIsc0JBQU8sQ0FBQyxTQUFvQixDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUM7Ozs7S0FDdEM7SUFFRCwwREFBMEQ7SUFDcEQscURBQWtCLEdBQXhCOzs7OzRCQUNVLHFCQUFNLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxFQUFBOzRCQUF4QyxzQkFBTyxDQUFDLFNBQWdDLENBQUMsS0FBSyxJQUFJLEVBQUM7Ozs7S0FDcEQ7SUFFRCxpREFBaUQ7SUFDM0MsNkRBQTBCLEdBQWhDOzs7OzRCQUVhLHFCQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQTs0QkFBM0IscUJBQU0sQ0FBQyxTQUFvQixDQUFDLENBQUMsUUFBUSxDQUFDLHVDQUF1QyxDQUFDLEVBQUE7O3dCQURsRixpRkFBaUY7d0JBQ2pGLElBQUksU0FBOEUsRUFBRTs0QkFDbEYsc0JBQU8sUUFBUSxFQUFDO3lCQUNqQjt3QkFDRCxzQkFBTyxPQUFPLEVBQUM7Ozs7S0FDaEI7SUE1SE0scUNBQVksR0FBRyxzQkFBc0IsQ0FBQztJQTZIL0MsK0JBQUM7Q0FBQSxBQTlIRCxDQUE4QyxnQkFBZ0IsR0E4SDdEO1NBOUhZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NMb2FkZXIsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7RXhwYW5zaW9uUGFuZWxIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9leHBhbnNpb24taGFybmVzcy1maWx0ZXJzJztcblxuY29uc3QgRVhQQU5TSU9OX1BBTkVMX0NPTlRFTlRfU0VMRUNUT1IgPSAnLm1hdC1leHBhbnNpb24tcGFuZWwtY29udGVudCc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LWV4cGFuc2lvbi1wYW5lbCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWV4cGFuc2lvbi1wYW5lbCc7XG5cbiAgcHJpdmF0ZSBfaGVhZGVyID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXInKTtcbiAgcHJpdmF0ZSBfdGl0bGUgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyLXRpdGxlJyk7XG4gIHByaXZhdGUgX2Rlc2NyaXB0aW9uID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1kZXNjcmlwdGlvbicpO1xuICBwcml2YXRlIF9leHBhbnNpb25JbmRpY2F0b3IgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1leHBhbnNpb24taW5kaWNhdG9yJyk7XG4gIHByaXZhdGUgX2NvbnRlbnQgPSB0aGlzLmxvY2F0b3JGb3IoRVhQQU5TSU9OX1BBTkVMX0NPTlRFTlRfU0VMRUNUT1IpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhbiBleHBhbnNpb24tcGFuZWxcbiAgICogd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGB0aXRsZWAgZmluZHMgYW4gZXhwYW5zaW9uLXBhbmVsIHdpdGggYSBzcGVjaWZpYyB0aXRsZSB0ZXh0LlxuICAgKiAgIC0gYGRlc2NyaXB0aW9uYCBmaW5kcyBhbiBleHBhbnNpb24tcGFuZWwgd2l0aCBhIHNwZWNpZmljIGRlc2NyaXB0aW9uIHRleHQuXG4gICAqICAgLSBgZXhwYW5kZWRgIGZpbmRzIGFuIGV4cGFuc2lvbi1wYW5lbCB0aGF0IGlzIGN1cnJlbnRseSBleHBhbmRlZC5cbiAgICogICAtIGBkaXNhYmxlZGAgZmluZHMgYW4gZXhwYW5zaW9uLXBhbmVsIHRoYXQgaXMgZGlzYWJsZWQuXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogRXhwYW5zaW9uUGFuZWxIYXJuZXNzRmlsdGVycyA9IHt9KTpcbiAgICAgIEhhcm5lc3NQcmVkaWNhdGU8TWF0RXhwYW5zaW9uUGFuZWxIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEV4cGFuc2lvblBhbmVsSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgICAgICd0aXRsZScsIG9wdGlvbnMudGl0bGUsXG4gICAgICAgICAgICAoaGFybmVzcywgdGl0bGUpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRpdGxlKCksIHRpdGxlKSlcbiAgICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgICAgICdkZXNjcmlwdGlvbicsIG9wdGlvbnMuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAoaGFybmVzcywgZGVzY3JpcHRpb24pID0+XG4gICAgICAgICAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0RGVzY3JpcHRpb24oKSwgZGVzY3JpcHRpb24pKVxuICAgICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAgICAgJ2NvbnRlbnQnLCBvcHRpb25zLmNvbnRlbnQsXG4gICAgICAgICAgICAoaGFybmVzcywgY29udGVudCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGV4dENvbnRlbnQoKSwgY29udGVudCkpXG4gICAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICAgICAnZXhwYW5kZWQnLCBvcHRpb25zLmV4cGFuZGVkLFxuICAgICAgICAgICAgYXN5bmMgKGhhcm5lc3MsIGV4cGFuZGVkKSA9PiAoYXdhaXQgaGFybmVzcy5pc0V4cGFuZGVkKCkpID09PSBleHBhbmRlZClcbiAgICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgICAgICdkaXNhYmxlZCcsIG9wdGlvbnMuZGlzYWJsZWQsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgZGlzYWJsZWQpID0+IChhd2FpdCBoYXJuZXNzLmlzRGlzYWJsZWQoKSkgPT09IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBwYW5lbCBpcyBleHBhbmRlZC4gKi9cbiAgYXN5bmMgaXNFeHBhbmRlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWV4cGFuZGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdGl0bGUgdGV4dCBvZiB0aGUgcGFuZWwuXG4gICAqIEByZXR1cm5zIFRpdGxlIHRleHQgb3IgYG51bGxgIGlmIG5vIHRpdGxlIGlzIHNldCB1cC5cbiAgICovXG4gIGFzeW5jIGdldFRpdGxlKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICBjb25zdCB0aXRsZUVsID0gYXdhaXQgdGhpcy5fdGl0bGUoKTtcbiAgICByZXR1cm4gdGl0bGVFbCA/IHRpdGxlRWwudGV4dCgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkZXNjcmlwdGlvbiB0ZXh0IG9mIHRoZSBwYW5lbC5cbiAgICogQHJldHVybnMgRGVzY3JpcHRpb24gdGV4dCBvciBgbnVsbGAgaWYgbm8gZGVzY3JpcHRpb24gaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgZ2V0RGVzY3JpcHRpb24oKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uRWwgPSBhd2FpdCB0aGlzLl9kZXNjcmlwdGlvbigpO1xuICAgIHJldHVybiBkZXNjcmlwdGlvbkVsID8gZGVzY3JpcHRpb25FbC50ZXh0KCkgOiBudWxsO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHBhbmVsIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBhd2FpdCAoYXdhaXQgdGhpcy5faGVhZGVyKCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgZXhwYW5kZWQgc3RhdGUgb2YgdGhlIHBhbmVsIGJ5IGNsaWNraW5nIG9uIHRoZSBwYW5lbFxuICAgKiBoZWFkZXIuIFRoaXMgbWV0aG9kIHdpbGwgbm90IHdvcmsgaWYgdGhlIHBhbmVsIGlzIGRpc2FibGVkLlxuICAgKi9cbiAgYXN5bmMgdG9nZ2xlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IChhd2FpdCB0aGlzLl9oZWFkZXIoKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKiBFeHBhbmRzIHRoZSBleHBhbnNpb24gcGFuZWwgaWYgY29sbGFwc2VkLiAqL1xuICBhc3luYyBleHBhbmQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFhd2FpdCB0aGlzLmlzRXhwYW5kZWQoKSkge1xuICAgICAgYXdhaXQgdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ29sbGFwc2VzIHRoZSBleHBhbnNpb24gcGFuZWwgaWYgZXhwYW5kZWQuICovXG4gIGFzeW5jIGNvbGxhcHNlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChhd2FpdCB0aGlzLmlzRXhwYW5kZWQoKSkge1xuICAgICAgYXdhaXQgdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBjb250ZW50IG9mIHRoZSBwYW5lbC4gKi9cbiAgYXN5bmMgZ2V0VGV4dENvbnRlbnQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2NvbnRlbnQoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc0xvYWRlcmAgdGhhdCBjYW4gYmUgdXNlZCB0byBsb2FkIGhhcm5lc3NlcyBmb3JcbiAgICogY29tcG9uZW50cyB3aXRoaW4gdGhlIHBhbmVsJ3MgY29udGVudCBhcmVhLlxuICAgKi9cbiAgYXN5bmMgZ2V0SGFybmVzc0xvYWRlckZvckNvbnRlbnQoKTogUHJvbWlzZTxIYXJuZXNzTG9hZGVyPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZhY3RvcnkuaGFybmVzc0xvYWRlckZvcihFWFBBTlNJT05fUEFORUxfQ09OVEVOVF9TRUxFQ1RPUik7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgcGFuZWwuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faGVhZGVyKCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIHBhbmVsLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faGVhZGVyKCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBwYW5lbCBoYXMgYSB0b2dnbGUgaW5kaWNhdG9yIGRpc3BsYXllZC4gKi9cbiAgYXN5bmMgaGFzVG9nZ2xlSW5kaWNhdG9yKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fZXhwYW5zaW9uSW5kaWNhdG9yKCkpICE9PSBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSB0b2dnbGUgaW5kaWNhdG9yLiAqL1xuICBhc3luYyBnZXRUb2dnbGVJbmRpY2F0b3JQb3NpdGlvbigpOiBQcm9taXNlPCdiZWZvcmUnfCdhZnRlcic+IHtcbiAgICAvLyBCeSBkZWZhdWx0IHRoZSBleHBhbnNpb24gaW5kaWNhdG9yIHdpbGwgc2hvdyBcImFmdGVyXCIgdGhlIHBhbmVsIGhlYWRlciBjb250ZW50LlxuICAgIGlmIChhd2FpdCAoYXdhaXQgdGhpcy5faGVhZGVyKCkpLmhhc0NsYXNzKCdtYXQtZXhwYW5zaW9uLXRvZ2dsZS1pbmRpY2F0b3ItYmVmb3JlJykpIHtcbiAgICAgIHJldHVybiAnYmVmb3JlJztcbiAgICB9XG4gICAgcmV0dXJuICdhZnRlcic7XG4gIH1cbn1cbiJdfQ==