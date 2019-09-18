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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, NgZone, Optional, QueryList, ViewChild, ViewEncapsulation, Input, Inject, } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatInkBar } from './ink-bar';
import { MatTabLabelWrapper } from './tab-label-wrapper';
import { Platform } from '@angular/cdk/platform';
import { MatPaginatedTabHeader } from './paginated-tab-header';
/** Base class with all of the `MatTabHeader` functionality. */
// tslint:disable-next-line:class-name
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
                    styles: [".mat-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-tab-header-pagination{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:transparent;touch-action:none}.mat-tab-header-pagination-controls-enabled .mat-tab-header-pagination{display:flex}.mat-tab-header-pagination-before,.mat-tab-header-rtl .mat-tab-header-pagination-after{padding-left:4px}.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-tab-header-rtl .mat-tab-header-pagination-before,.mat-tab-header-pagination-after{padding-right:4px}.mat-tab-header-rtl .mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;content:\"\";height:8px;width:8px}.mat-tab-header-pagination-disabled{box-shadow:none;cursor:default}.mat-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-ink-bar{transition:none;animation:none}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}@media(-ms-high-contrast: active){.mat-ink-bar{outline:solid 2px;height:0}}.mat-tab-labels{display:flex}[mat-align-tabs=center] .mat-tab-labels{justify-content:center}[mat-align-tabs=end] .mat-tab-labels{justify-content:flex-end}.mat-tab-label-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}._mat-animation-noopable.mat-tab-list{transition:none;animation:none}.mat-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:none}.mat-tab-label:focus:not(.mat-tab-disabled){opacity:1}@media(-ms-high-contrast: active){.mat-tab-label:focus{outline:dotted 2px}}.mat-tab-label.mat-tab-disabled{cursor:default}@media(-ms-high-contrast: active){.mat-tab-label.mat-tab-disabled{opacity:.5}}.mat-tab-label .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}@media(-ms-high-contrast: active){.mat-tab-label{opacity:1}}@media(max-width: 599px){.mat-tab-label{min-width:72px}}/*# sourceMappingURL=tab-header.css.map */\n"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL3RhYi1oZWFkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUdMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFDZixVQUFVLEVBQ1YsTUFBTSxFQUVOLFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixFQUVqQixLQUFLLEVBQ0wsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDcEMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRTdELCtEQUErRDtBQUMvRCxzQ0FBc0M7QUFDdEM7SUFBZ0QsNkNBQXFCO0lBU25FLDJCQUFZLFVBQXNCLEVBQ3RCLGlCQUFvQyxFQUNwQyxhQUE0QixFQUNoQixHQUFtQixFQUMvQixNQUFjLEVBQ2QsUUFBa0I7SUFDbEIseUVBQXlFO0lBQzlCLGFBQXNCO1FBUDdFLFlBUUUsa0JBQU0sVUFBVSxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsU0FDMUY7UUFYTyxvQkFBYyxHQUFZLEtBQUssQ0FBQzs7SUFXeEMsQ0FBQztJQWRELHNCQUNJLDRDQUFhO1FBRmpCLG9EQUFvRDthQUNwRCxjQUNzQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2FBQ25ELFVBQWtCLEtBQVUsSUFBSSxJQUFJLENBQUMsY0FBYyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BRGxDO0lBZXpDLHlDQUFhLEdBQXZCLFVBQXdCLEtBQW9CO1FBQzFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN6QixDQUFDOzs7Z0JBMUNELFVBQVU7Z0JBSFYsaUJBQWlCO2dCQUxYLGFBQWE7Z0JBRGIsY0FBYyx1QkF5Q1AsUUFBUTtnQkEvQnJCLE1BQU07Z0JBY0EsUUFBUTs2Q0FxQkQsUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7OztnQ0FacEQsS0FBSzs7SUFtQlIsd0JBQUM7Q0FBQSxBQXZCRCxDQUFnRCxxQkFBcUIsR0F1QnBFO1NBdkJxQixpQkFBaUI7QUF5QnZDOzs7Ozs7R0FNRztBQUNIO0lBZWtDLHdDQUFpQjtJQVFqRCxzQkFBWSxVQUFzQixFQUN0QixpQkFBb0MsRUFDcEMsYUFBNEIsRUFDaEIsR0FBbUIsRUFDL0IsTUFBYyxFQUNkLFFBQWtCO0lBQ2xCLHlFQUF5RTtJQUM5QixhQUFzQjtlQUMzRSxrQkFBTSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLGFBQWEsQ0FBQztJQUMzRixDQUFDOztnQkFoQ0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtvQkFDbkIsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsczZDQUE4QjtvQkFFOUIsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDO29CQUN6QixPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxjQUFjLENBQUM7b0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxnQkFBZ0I7d0JBQ3pCLG9EQUFvRCxFQUFFLHlCQUF5Qjt3QkFDL0UsNEJBQTRCLEVBQUUsZ0NBQWdDO3FCQUMvRDs7aUJBQ0Y7Ozs7Z0JBbEVDLFVBQVU7Z0JBSFYsaUJBQWlCO2dCQUxYLGFBQWE7Z0JBRGIsY0FBYyx1QkF1RlAsUUFBUTtnQkE3RXJCLE1BQU07Z0JBY0EsUUFBUTs2Q0FtRUQsUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7Ozt5QkFkcEQsZUFBZSxTQUFDLGtCQUFrQjswQkFDbEMsU0FBUyxTQUFDLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7b0NBQ25DLFNBQVMsU0FBQyxrQkFBa0IsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7MkJBQzVDLFNBQVMsU0FBQyxTQUFTLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2lDQUNuQyxTQUFTLFNBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQztxQ0FDMUMsU0FBUyxTQUFDLG1CQUFtQixFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQzs7SUFZakQsbUJBQUM7Q0FBQSxBQWpDRCxDQWVrQyxpQkFBaUIsR0FrQmxEO1NBbEJZLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBBZnRlclZpZXdJbml0LFxuICBJbnB1dCxcbiAgSW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge01hdElua0Jhcn0gZnJvbSAnLi9pbmstYmFyJztcbmltcG9ydCB7TWF0VGFiTGFiZWxXcmFwcGVyfSBmcm9tICcuL3RhYi1sYWJlbC13cmFwcGVyJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge01hdFBhZ2luYXRlZFRhYkhlYWRlcn0gZnJvbSAnLi9wYWdpbmF0ZWQtdGFiLWhlYWRlcic7XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0VGFiSGVhZGVyYCBmdW5jdGlvbmFsaXR5LiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNsYXNzLW5hbWVcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0VGFiSGVhZGVyQmFzZSBleHRlbmRzIE1hdFBhZ2luYXRlZFRhYkhlYWRlciBpbXBsZW1lbnRzXG4gIEFmdGVyQ29udGVudENoZWNrZWQsIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBlZmZlY3QgaXMgZGlzYWJsZWQgb3Igbm90LiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZVJpcHBsZSgpIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVSaXBwbGU7IH1cbiAgc2V0IGRpc2FibGVSaXBwbGUodmFsdWU6IGFueSkgeyB0aGlzLl9kaXNhYmxlUmlwcGxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9kaXNhYmxlUmlwcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIGBfYW5pbWF0aW9uTW9kZWAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgY2hhbmdlRGV0ZWN0b3JSZWYsIHZpZXdwb3J0UnVsZXIsIGRpciwgbmdab25lLCBwbGF0Zm9ybSwgYW5pbWF0aW9uTW9kZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2l0ZW1TZWxlY3RlZChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgaGVhZGVyIG9mIHRoZSB0YWIgZ3JvdXAgd2hpY2ggZGlzcGxheXMgYSBsaXN0IG9mIGFsbCB0aGUgdGFicyBpbiB0aGUgdGFiIGdyb3VwLiBJbmNsdWRlc1xuICogYW4gaW5rIGJhciB0aGF0IGZvbGxvd3MgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCB0YWIuIFdoZW4gdGhlIHRhYnMgbGlzdCdzIHdpZHRoIGV4Y2VlZHMgdGhlXG4gKiB3aWR0aCBvZiB0aGUgaGVhZGVyIGNvbnRhaW5lciwgdGhlbiBhcnJvd3Mgd2lsbCBiZSBkaXNwbGF5ZWQgdG8gYWxsb3cgdGhlIHVzZXIgdG8gc2Nyb2xsXG4gKiBsZWZ0IGFuZCByaWdodCBhY3Jvc3MgdGhlIGhlYWRlci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnbWF0LXRhYi1oZWFkZXInLFxuICB0ZW1wbGF0ZVVybDogJ3RhYi1oZWFkZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0YWItaGVhZGVyLmNzcyddLFxuICBpbnB1dHM6IFsnc2VsZWN0ZWRJbmRleCddLFxuICBvdXRwdXRzOiBbJ3NlbGVjdEZvY3VzZWRJbmRleCcsICdpbmRleEZvY3VzZWQnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRhYi1oZWFkZXInLFxuICAgICdbY2xhc3MubWF0LXRhYi1oZWFkZXItcGFnaW5hdGlvbi1jb250cm9scy1lbmFibGVkXSc6ICdfc2hvd1BhZ2luYXRpb25Db250cm9scycsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWhlYWRlci1ydGxdJzogXCJfZ2V0TGF5b3V0RGlyZWN0aW9uKCkgPT0gJ3J0bCdcIixcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiSGVhZGVyIGV4dGVuZHMgX01hdFRhYkhlYWRlckJhc2Uge1xuICBAQ29udGVudENoaWxkcmVuKE1hdFRhYkxhYmVsV3JhcHBlcikgX2l0ZW1zOiBRdWVyeUxpc3Q8TWF0VGFiTGFiZWxXcmFwcGVyPjtcbiAgQFZpZXdDaGlsZChNYXRJbmtCYXIsIHtzdGF0aWM6IHRydWV9KSBfaW5rQmFyOiBNYXRJbmtCYXI7XG4gIEBWaWV3Q2hpbGQoJ3RhYkxpc3RDb250YWluZXInLCB7c3RhdGljOiB0cnVlfSkgX3RhYkxpc3RDb250YWluZXI6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3RhYkxpc3QnLCB7c3RhdGljOiB0cnVlfSkgX3RhYkxpc3Q6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ25leHRQYWdpbmF0b3InLCB7c3RhdGljOiBmYWxzZX0pIF9uZXh0UGFnaW5hdG9yOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgncHJldmlvdXNQYWdpbmF0b3InLCB7c3RhdGljOiBmYWxzZX0pIF9wcmV2aW91c1BhZ2luYXRvcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIGBfYW5pbWF0aW9uTW9kZWAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgY2hhbmdlRGV0ZWN0b3JSZWYsIHZpZXdwb3J0UnVsZXIsIGRpciwgbmdab25lLCBwbGF0Zm9ybSwgYW5pbWF0aW9uTW9kZSk7XG4gIH1cbn1cbiJdfQ==