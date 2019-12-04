/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __extends, __generator } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
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
export { MatDividerHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGl2aWRlci1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RpdmlkZXIvdGVzdGluZy9kaXZpZGVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFOzs7R0FHRztBQUNIO0lBQXVDLHFDQUFnQjtJQUF2RDs7SUFlQSxDQUFDO0lBWlEsc0JBQUksR0FBWCxVQUFZLE9BQW1DO1FBQW5DLHdCQUFBLEVBQUEsWUFBbUM7UUFDN0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFSywwQ0FBYyxHQUFwQjs7Ozs0QkFDVSxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7NEJBQXpCLHNCQUFPLENBQUMsU0FBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FDcEIsRUFBQzs7OztLQUN4QztJQUVLLG1DQUFPLEdBQWI7Ozs7NEJBQ1UscUJBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFBOzRCQUF6QixzQkFBTyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsRUFBQzs7OztLQUMxRDtJQWJNLDhCQUFZLEdBQUcsYUFBYSxDQUFDO0lBY3RDLHdCQUFDO0NBQUEsQUFmRCxDQUF1QyxnQkFBZ0IsR0FldEQ7U0FmWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0RpdmlkZXJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9kaXZpZGVyLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIGBtYXQtZGl2aWRlcmAuXG4gKiBAZHluYW1pY1xuICovXG5leHBvcnQgY2xhc3MgTWF0RGl2aWRlckhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICdtYXQtZGl2aWRlcic7XG5cbiAgc3RhdGljIHdpdGgob3B0aW9uczogRGl2aWRlckhhcm5lc3NGaWx0ZXJzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0RGl2aWRlckhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0T3JpZW50YXRpb24oKTogUHJvbWlzZTwnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLW9yaWVudGF0aW9uJykgYXNcbiAgICAgICAgUHJvbWlzZTwnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnPjtcbiAgfVxuXG4gIGFzeW5jIGlzSW5zZXQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1kaXZpZGVyLWluc2V0Jyk7XG4gIH1cbn1cbiJdfQ==