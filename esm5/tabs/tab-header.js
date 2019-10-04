/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { Directionality } from '@angular/cdk/bidi';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, NgZone, Optional, QueryList, ViewChild, ViewEncapsulation, Input, Inject, Directive, } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatInkBar } from './ink-bar';
import { MatTabLabelWrapper } from './tab-label-wrapper';
import { Platform } from '@angular/cdk/platform';
import { MatPaginatedTabHeader } from './paginated-tab-header';
/**
 * Base class with all of the `MatTabHeader` functionality.
 * @docs-private
 */
var _MatTabHeaderBase = /** @class */ (function (_super) {
    tslib_1.__extends(_MatTabHeaderBase, _super);
    function _MatTabHeaderBase(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, 
    // @breaking-change 9.0.0 `_animationMode` parameter to be made required.
    animationMode) {
        var _this = _super.call(this, elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode) || this;
        _this._disableRipple = false;
        return _this;
    }
    Object.defineProperty(_MatTabHeaderBase.prototype, "disableRipple", {
        /** Whether the ripple effect is disabled or not. */
        get: function () { return this._disableRipple; },
        set: function (value) { this._disableRipple = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    _MatTabHeaderBase.prototype._itemSelected = function (event) {
        event.preventDefault();
    };
    _MatTabHeaderBase.decorators = [
        { type: Directive, args: [{
                    // TODO(crisbeto): this selector can be removed when we update to Angular 9.0.
                    selector: 'do-not-use-abstract-mat-tab-header-base'
                },] }
    ];
    /** @nocollapse */
    _MatTabHeaderBase.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: ViewportRuler },
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: NgZone },
        { type: Platform },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ]; };
    _MatTabHeaderBase.propDecorators = {
        disableRipple: [{ type: Input }]
    };
    return _MatTabHeaderBase;
}(MatPaginatedTabHeader));
export { _MatTabHeaderBase };
/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 * @docs-private
 */
var MatTabHeader = /** @class */ (function (_super) {
    tslib_1.__extends(MatTabHeader, _super);
    function MatTabHeader(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, 
    // @breaking-change 9.0.0 `_animationMode` parameter to be made required.
    animationMode) {
        return _super.call(this, elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode) || this;
    }
    MatTabHeader.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: 'mat-tab-header',
                    template: "<div class=\"mat-tab-header-pagination mat-tab-header-pagination-before mat-elevation-z4\"\n     #previousPaginator\n     aria-hidden=\"true\"\n     mat-ripple [matRippleDisabled]=\"_disableScrollBefore || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollBefore\"\n     (click)=\"_handlePaginatorClick('before')\"\n     (mousedown)=\"_handlePaginatorPress('before')\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</div>\n\n<div class=\"mat-tab-label-container\" #tabListContainer (keydown)=\"_handleKeydown($event)\">\n  <div\n    #tabList\n    class=\"mat-tab-list\"\n    [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n    role=\"tablist\"\n    (cdkObserveContent)=\"_onContentChanges()\">\n    <div class=\"mat-tab-labels\">\n      <ng-content></ng-content>\n    </div>\n    <mat-ink-bar></mat-ink-bar>\n  </div>\n</div>\n\n<div class=\"mat-tab-header-pagination mat-tab-header-pagination-after mat-elevation-z4\"\n     #nextPaginator\n     aria-hidden=\"true\"\n     mat-ripple [matRippleDisabled]=\"_disableScrollAfter || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollAfter\"\n     (mousedown)=\"_handlePaginatorPress('after')\"\n     (click)=\"_handlePaginatorClick('after')\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</div>\n",
                    inputs: ['selectedIndex'],
                    outputs: ['selectFocusedIndex', 'indexFocused'],
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        'class': 'mat-tab-header',
                        '[class.mat-tab-header-pagination-controls-enabled]': '_showPaginationControls',
                        '[class.mat-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
                    },
                    styles: [".mat-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-tab-header-pagination{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:transparent;touch-action:none}.mat-tab-header-pagination-controls-enabled .mat-tab-header-pagination{display:flex}.mat-tab-header-pagination-before,.mat-tab-header-rtl .mat-tab-header-pagination-after{padding-left:4px}.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-tab-header-rtl .mat-tab-header-pagination-before,.mat-tab-header-pagination-after{padding-right:4px}.mat-tab-header-rtl .mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;content:\"\";height:8px;width:8px}.mat-tab-header-pagination-disabled{box-shadow:none;cursor:default}.mat-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-ink-bar{transition:none;animation:none}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}@media(-ms-high-contrast: active){.mat-ink-bar{outline:solid 2px;height:0}}.mat-tab-labels{display:flex}[mat-align-tabs=center] .mat-tab-labels{justify-content:center}[mat-align-tabs=end] .mat-tab-labels{justify-content:flex-end}.mat-tab-label-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}._mat-animation-noopable.mat-tab-list{transition:none;animation:none}.mat-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:none}.mat-tab-label:focus:not(.mat-tab-disabled){opacity:1}@media(-ms-high-contrast: active){.mat-tab-label:focus{outline:dotted 2px}}.mat-tab-label.mat-tab-disabled{cursor:default}@media(-ms-high-contrast: active){.mat-tab-label.mat-tab-disabled{opacity:.5}}.mat-tab-label .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}@media(-ms-high-contrast: active){.mat-tab-label{opacity:1}}@media(max-width: 599px){.mat-tab-label{min-width:72px}}\n"]
                }] }
    ];
    /** @nocollapse */
    MatTabHeader.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: ViewportRuler },
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: NgZone },
        { type: Platform },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ]; };
    MatTabHeader.propDecorators = {
        _items: [{ type: ContentChildren, args: [MatTabLabelWrapper,] }],
        _inkBar: [{ type: ViewChild, args: [MatInkBar, { static: true },] }],
        _tabListContainer: [{ type: ViewChild, args: ['tabListContainer', { static: true },] }],
        _tabList: [{ type: ViewChild, args: ['tabList', { static: true },] }],
        _nextPaginator: [{ type: ViewChild, args: ['nextPaginator', { static: false },] }],
        _previousPaginator: [{ type: ViewChild, args: ['previousPaginator', { static: false },] }]
    };
    return MatTabHeader;
}(_MatTabHeaderBase));
export { MatTabHeader };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL3RhYi1oZWFkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUdMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFDZixVQUFVLEVBQ1YsTUFBTSxFQUVOLFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixFQUVqQixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUU3RDs7O0dBR0c7QUFDSDtJQUtnRCw2Q0FBcUI7SUFTbkUsMkJBQVksVUFBc0IsRUFDdEIsaUJBQW9DLEVBQ3BDLGFBQTRCLEVBQ2hCLEdBQW1CLEVBQy9CLE1BQWMsRUFDZCxRQUFrQjtJQUNsQix5RUFBeUU7SUFDOUIsYUFBc0I7UUFQN0UsWUFRRSxrQkFBTSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLGFBQWEsQ0FBQyxTQUMxRjtRQVhPLG9CQUFjLEdBQVksS0FBSyxDQUFDOztJQVd4QyxDQUFDO0lBZEQsc0JBQ0ksNENBQWE7UUFGakIsb0RBQW9EO2FBQ3BELGNBQ3NCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7YUFDbkQsVUFBa0IsS0FBVSxJQUFJLElBQUksQ0FBQyxjQUFjLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FEbEM7SUFlekMseUNBQWEsR0FBdkIsVUFBd0IsS0FBb0I7UUFDMUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3pCLENBQUM7O2dCQTNCRixTQUFTLFNBQUM7b0JBQ1QsOEVBQThFO29CQUM5RSxRQUFRLEVBQUUseUNBQXlDO2lCQUNwRDs7OztnQkExQkMsVUFBVTtnQkFIVixpQkFBaUI7Z0JBTFgsYUFBYTtnQkFEYixjQUFjLHVCQWlEUCxRQUFRO2dCQXZDckIsTUFBTTtnQkFlQSxRQUFROzZDQTRCRCxRQUFRLFlBQUksTUFBTSxTQUFDLHFCQUFxQjs7O2dDQVpwRCxLQUFLOztJQW1CUix3QkFBQztDQUFBLEFBNUJELENBS2dELHFCQUFxQixHQXVCcEU7U0F2QnFCLGlCQUFpQjtBQXlCdkM7Ozs7OztHQU1HO0FBQ0g7SUFla0Msd0NBQWlCO0lBUWpELHNCQUFZLFVBQXNCLEVBQ3RCLGlCQUFvQyxFQUNwQyxhQUE0QixFQUNoQixHQUFtQixFQUMvQixNQUFjLEVBQ2QsUUFBa0I7SUFDbEIseUVBQXlFO0lBQzlCLGFBQXNCO2VBQzNFLGtCQUFNLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDO0lBQzNGLENBQUM7O2dCQWhDRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO29CQUNuQixRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixzNkNBQThCO29CQUU5QixNQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUM7b0JBQ3pCLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixFQUFFLGNBQWMsQ0FBQztvQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLGdCQUFnQjt3QkFDekIsb0RBQW9ELEVBQUUseUJBQXlCO3dCQUMvRSw0QkFBNEIsRUFBRSxnQ0FBZ0M7cUJBQy9EOztpQkFDRjs7OztnQkExRUMsVUFBVTtnQkFIVixpQkFBaUI7Z0JBTFgsYUFBYTtnQkFEYixjQUFjLHVCQStGUCxRQUFRO2dCQXJGckIsTUFBTTtnQkFlQSxRQUFROzZDQTBFRCxRQUFRLFlBQUksTUFBTSxTQUFDLHFCQUFxQjs7O3lCQWRwRCxlQUFlLFNBQUMsa0JBQWtCOzBCQUNsQyxTQUFTLFNBQUMsU0FBUyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztvQ0FDbkMsU0FBUyxTQUFDLGtCQUFrQixFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQzsyQkFDNUMsU0FBUyxTQUFDLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7aUNBQ25DLFNBQVMsU0FBQyxlQUFlLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDO3FDQUMxQyxTQUFTLFNBQUMsbUJBQW1CLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDOztJQVlqRCxtQkFBQztDQUFBLEFBakNELENBZWtDLGlCQUFpQixHQWtCbEQ7U0FsQlksWUFBWSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEFmdGVyVmlld0luaXQsXG4gIElucHV0LFxuICBJbmplY3QsXG4gIERpcmVjdGl2ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtNYXRJbmtCYXJ9IGZyb20gJy4vaW5rLWJhcic7XG5pbXBvcnQge01hdFRhYkxhYmVsV3JhcHBlcn0gZnJvbSAnLi90YWItbGFiZWwtd3JhcHBlcic7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtNYXRQYWdpbmF0ZWRUYWJIZWFkZXJ9IGZyb20gJy4vcGFnaW5hdGVkLXRhYi1oZWFkZXInO1xuXG4vKipcbiAqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRUYWJIZWFkZXJgIGZ1bmN0aW9uYWxpdHkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAvLyBUT0RPKGNyaXNiZXRvKTogdGhpcyBzZWxlY3RvciBjYW4gYmUgcmVtb3ZlZCB3aGVuIHdlIHVwZGF0ZSB0byBBbmd1bGFyIDkuMC5cbiAgc2VsZWN0b3I6ICdkby1ub3QtdXNlLWFic3RyYWN0LW1hdC10YWItaGVhZGVyLWJhc2UnXG59KVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNsYXNzLW5hbWVcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0VGFiSGVhZGVyQmFzZSBleHRlbmRzIE1hdFBhZ2luYXRlZFRhYkhlYWRlciBpbXBsZW1lbnRzXG4gIEFmdGVyQ29udGVudENoZWNrZWQsIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBlZmZlY3QgaXMgZGlzYWJsZWQgb3Igbm90LiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZVJpcHBsZSgpIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVSaXBwbGU7IH1cbiAgc2V0IGRpc2FibGVSaXBwbGUodmFsdWU6IGFueSkgeyB0aGlzLl9kaXNhYmxlUmlwcGxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9kaXNhYmxlUmlwcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIGBfYW5pbWF0aW9uTW9kZWAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgY2hhbmdlRGV0ZWN0b3JSZWYsIHZpZXdwb3J0UnVsZXIsIGRpciwgbmdab25lLCBwbGF0Zm9ybSwgYW5pbWF0aW9uTW9kZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2l0ZW1TZWxlY3RlZChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgaGVhZGVyIG9mIHRoZSB0YWIgZ3JvdXAgd2hpY2ggZGlzcGxheXMgYSBsaXN0IG9mIGFsbCB0aGUgdGFicyBpbiB0aGUgdGFiIGdyb3VwLiBJbmNsdWRlc1xuICogYW4gaW5rIGJhciB0aGF0IGZvbGxvd3MgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCB0YWIuIFdoZW4gdGhlIHRhYnMgbGlzdCdzIHdpZHRoIGV4Y2VlZHMgdGhlXG4gKiB3aWR0aCBvZiB0aGUgaGVhZGVyIGNvbnRhaW5lciwgdGhlbiBhcnJvd3Mgd2lsbCBiZSBkaXNwbGF5ZWQgdG8gYWxsb3cgdGhlIHVzZXIgdG8gc2Nyb2xsXG4gKiBsZWZ0IGFuZCByaWdodCBhY3Jvc3MgdGhlIGhlYWRlci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnbWF0LXRhYi1oZWFkZXInLFxuICB0ZW1wbGF0ZVVybDogJ3RhYi1oZWFkZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0YWItaGVhZGVyLmNzcyddLFxuICBpbnB1dHM6IFsnc2VsZWN0ZWRJbmRleCddLFxuICBvdXRwdXRzOiBbJ3NlbGVjdEZvY3VzZWRJbmRleCcsICdpbmRleEZvY3VzZWQnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRhYi1oZWFkZXInLFxuICAgICdbY2xhc3MubWF0LXRhYi1oZWFkZXItcGFnaW5hdGlvbi1jb250cm9scy1lbmFibGVkXSc6ICdfc2hvd1BhZ2luYXRpb25Db250cm9scycsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWhlYWRlci1ydGxdJzogXCJfZ2V0TGF5b3V0RGlyZWN0aW9uKCkgPT0gJ3J0bCdcIixcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiSGVhZGVyIGV4dGVuZHMgX01hdFRhYkhlYWRlckJhc2Uge1xuICBAQ29udGVudENoaWxkcmVuKE1hdFRhYkxhYmVsV3JhcHBlcikgX2l0ZW1zOiBRdWVyeUxpc3Q8TWF0VGFiTGFiZWxXcmFwcGVyPjtcbiAgQFZpZXdDaGlsZChNYXRJbmtCYXIsIHtzdGF0aWM6IHRydWV9KSBfaW5rQmFyOiBNYXRJbmtCYXI7XG4gIEBWaWV3Q2hpbGQoJ3RhYkxpc3RDb250YWluZXInLCB7c3RhdGljOiB0cnVlfSkgX3RhYkxpc3RDb250YWluZXI6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3RhYkxpc3QnLCB7c3RhdGljOiB0cnVlfSkgX3RhYkxpc3Q6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ25leHRQYWdpbmF0b3InLCB7c3RhdGljOiBmYWxzZX0pIF9uZXh0UGFnaW5hdG9yOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgncHJldmlvdXNQYWdpbmF0b3InLCB7c3RhdGljOiBmYWxzZX0pIF9wcmV2aW91c1BhZ2luYXRvcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIGBfYW5pbWF0aW9uTW9kZWAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgY2hhbmdlRGV0ZWN0b3JSZWYsIHZpZXdwb3J0UnVsZXIsIGRpciwgbmdab25lLCBwbGF0Zm9ybSwgYW5pbWF0aW9uTW9kZSk7XG4gIH1cbn1cbiJdfQ==