/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
 * \@docs-private
 * @abstract
 */
// tslint:disable-next-line:class-name
export class _MatTabHeaderBase extends MatPaginatedTabHeader {
    /**
     * @param {?} elementRef
     * @param {?} changeDetectorRef
     * @param {?} viewportRuler
     * @param {?} dir
     * @param {?} ngZone
     * @param {?} platform
     * @param {?=} animationMode
     */
    constructor(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, 
    // @breaking-change 9.0.0 `_animationMode` parameter to be made required.
    animationMode) {
        super(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode);
        this._disableRipple = false;
    }
    /**
     * Whether the ripple effect is disabled or not.
     * @return {?}
     */
    get disableRipple() { return this._disableRipple; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disableRipple(value) { this._disableRipple = coerceBooleanProperty(value); }
    /**
     * @protected
     * @param {?} event
     * @return {?}
     */
    _itemSelected(event) {
        event.preventDefault();
    }
}
_MatTabHeaderBase.decorators = [
    { type: Directive }
];
/** @nocollapse */
_MatTabHeaderBase.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: ViewportRuler },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NgZone },
    { type: Platform },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
_MatTabHeaderBase.propDecorators = {
    disableRipple: [{ type: Input }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    _MatTabHeaderBase.prototype._disableRipple;
}
/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 * \@docs-private
 */
export class MatTabHeader extends _MatTabHeaderBase {
    /**
     * @param {?} elementRef
     * @param {?} changeDetectorRef
     * @param {?} viewportRuler
     * @param {?} dir
     * @param {?} ngZone
     * @param {?} platform
     * @param {?=} animationMode
     */
    constructor(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, 
    // @breaking-change 9.0.0 `_animationMode` parameter to be made required.
    animationMode) {
        super(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode);
    }
}
MatTabHeader.decorators = [
    { type: Component, args: [{
                selector: 'mat-tab-header',
                template: "<div class=\"mat-tab-header-pagination mat-tab-header-pagination-before mat-elevation-z4\"\n     #previousPaginator\n     aria-hidden=\"true\"\n     mat-ripple [matRippleDisabled]=\"_disableScrollBefore || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollBefore\"\n     (click)=\"_handlePaginatorClick('before')\"\n     (mousedown)=\"_handlePaginatorPress('before')\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</div>\n\n<div class=\"mat-tab-label-container\" #tabListContainer (keydown)=\"_handleKeydown($event)\">\n  <div\n    #tabList\n    class=\"mat-tab-list\"\n    [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n    role=\"tablist\"\n    (cdkObserveContent)=\"_onContentChanges()\">\n    <div class=\"mat-tab-labels\">\n      <ng-content></ng-content>\n    </div>\n    <mat-ink-bar></mat-ink-bar>\n  </div>\n</div>\n\n<div class=\"mat-tab-header-pagination mat-tab-header-pagination-after mat-elevation-z4\"\n     #nextPaginator\n     aria-hidden=\"true\"\n     mat-ripple [matRippleDisabled]=\"_disableScrollAfter || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollAfter\"\n     (mousedown)=\"_handlePaginatorPress('after')\"\n     (click)=\"_handlePaginatorClick('after')\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</div>\n",
                inputs: ['selectedIndex'],
                outputs: ['selectFocusedIndex', 'indexFocused'],
                encapsulation: ViewEncapsulation.None,
                // tslint:disable-next-line:validate-decorators
                changeDetection: ChangeDetectionStrategy.Default,
                host: {
                    'class': 'mat-tab-header',
                    '[class.mat-tab-header-pagination-controls-enabled]': '_showPaginationControls',
                    '[class.mat-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
                },
                styles: [".mat-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-tab-header-pagination{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:transparent;touch-action:none}.mat-tab-header-pagination-controls-enabled .mat-tab-header-pagination{display:flex}.mat-tab-header-pagination-before,.mat-tab-header-rtl .mat-tab-header-pagination-after{padding-left:4px}.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-tab-header-rtl .mat-tab-header-pagination-before,.mat-tab-header-pagination-after{padding-right:4px}.mat-tab-header-rtl .mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;content:\"\";height:8px;width:8px}.mat-tab-header-pagination-disabled{box-shadow:none;cursor:default}.mat-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-ink-bar{transition:none;animation:none}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}.cdk-high-contrast-active .mat-ink-bar{outline:solid 2px;height:0}.mat-tab-labels{display:flex}[mat-align-tabs=center] .mat-tab-labels{justify-content:center}[mat-align-tabs=end] .mat-tab-labels{justify-content:flex-end}.mat-tab-label-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}._mat-animation-noopable.mat-tab-list{transition:none;animation:none}.mat-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:none}.mat-tab-label:focus:not(.mat-tab-disabled){opacity:1}.cdk-high-contrast-active .mat-tab-label:focus{outline:dotted 2px}.mat-tab-label.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-label.mat-tab-disabled{opacity:.5}.mat-tab-label .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-label{opacity:1}@media(max-width: 599px){.mat-tab-label{min-width:72px}}\n"]
            }] }
];
/** @nocollapse */
MatTabHeader.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: ViewportRuler },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NgZone },
    { type: Platform },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
MatTabHeader.propDecorators = {
    _items: [{ type: ContentChildren, args: [MatTabLabelWrapper,] }],
    _inkBar: [{ type: ViewChild, args: [MatInkBar, { static: true },] }],
    _tabListContainer: [{ type: ViewChild, args: ['tabListContainer', { static: true },] }],
    _tabList: [{ type: ViewChild, args: ['tabList', { static: true },] }],
    _nextPaginator: [{ type: ViewChild, args: ['nextPaginator',] }],
    _previousPaginator: [{ type: ViewChild, args: ['previousPaginator',] }]
};
if (false) {
    /** @type {?} */
    MatTabHeader.ngAcceptInputType_disableRipple;
    /** @type {?} */
    MatTabHeader.ngAcceptInputType_selectedIndex;
    /** @type {?} */
    MatTabHeader.prototype._items;
    /** @type {?} */
    MatTabHeader.prototype._inkBar;
    /** @type {?} */
    MatTabHeader.prototype._tabListContainer;
    /** @type {?} */
    MatTabHeader.prototype._tabList;
    /** @type {?} */
    MatTabHeader.prototype._nextPaginator;
    /** @type {?} */
    MatTabHeader.prototype._previousPaginator;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL3RhYi1oZWFkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFHTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsVUFBVSxFQUNWLE1BQU0sRUFFTixRQUFRLEVBQ1IsU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsRUFFakIsS0FBSyxFQUNMLE1BQU0sRUFDTixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNwQyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7Ozs7OztBQU83RCxzQ0FBc0M7QUFDdEMsTUFBTSxPQUFnQixpQkFBa0IsU0FBUSxxQkFBcUI7Ozs7Ozs7Ozs7SUFTbkUsWUFBWSxVQUFzQixFQUN0QixpQkFBb0MsRUFDcEMsYUFBNEIsRUFDaEIsR0FBbUIsRUFDL0IsTUFBYyxFQUNkLFFBQWtCO0lBQ2xCLHlFQUF5RTtJQUM5QixhQUFzQjtRQUMzRSxLQUFLLENBQUMsVUFBVSxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQVZwRixtQkFBYyxHQUFZLEtBQUssQ0FBQztJQVd4QyxDQUFDOzs7OztJQWRELElBQ0ksYUFBYSxLQUFLLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ25ELElBQUksYUFBYSxDQUFDLEtBQVUsSUFBSSxJQUFJLENBQUMsY0FBYyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0lBYzNFLGFBQWEsQ0FBQyxLQUFvQjtRQUMxQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekIsQ0FBQzs7O1lBeEJGLFNBQVM7Ozs7WUF2QlIsVUFBVTtZQUhWLGlCQUFpQjtZQUxYLGFBQWE7WUFEYixjQUFjLHVCQThDUCxRQUFRO1lBcENyQixNQUFNO1lBZUEsUUFBUTt5Q0F5QkQsUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7Ozs0QkFacEQsS0FBSzs7Ozs7OztJQUdOLDJDQUF3Qzs7Ozs7Ozs7O0FBd0MxQyxNQUFNLE9BQU8sWUFBYSxTQUFRLGlCQUFpQjs7Ozs7Ozs7OztJQVFqRCxZQUFZLFVBQXNCLEVBQ3RCLGlCQUFvQyxFQUNwQyxhQUE0QixFQUNoQixHQUFtQixFQUMvQixNQUFjLEVBQ2QsUUFBa0I7SUFDbEIseUVBQXlFO0lBQzlCLGFBQXNCO1FBQzNFLEtBQUssQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzVGLENBQUM7OztZQWhDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsczZDQUE4QjtnQkFFOUIsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDO2dCQUN6QixPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxjQUFjLENBQUM7Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOztnQkFFckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE9BQU87Z0JBQ2hELElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsZ0JBQWdCO29CQUN6QixvREFBb0QsRUFBRSx5QkFBeUI7b0JBQy9FLDRCQUE0QixFQUFFLGdDQUFnQztpQkFDL0Q7O2FBQ0Y7Ozs7WUF2RUMsVUFBVTtZQUhWLGlCQUFpQjtZQUxYLGFBQWE7WUFEYixjQUFjLHVCQTRGUCxRQUFRO1lBbEZyQixNQUFNO1lBZUEsUUFBUTt5Q0F1RUQsUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7OztxQkFkcEQsZUFBZSxTQUFDLGtCQUFrQjtzQkFDbEMsU0FBUyxTQUFDLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7Z0NBQ25DLFNBQVMsU0FBQyxrQkFBa0IsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7dUJBQzVDLFNBQVMsU0FBQyxTQUFTLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDOzZCQUNuQyxTQUFTLFNBQUMsZUFBZTtpQ0FDekIsU0FBUyxTQUFDLG1CQUFtQjs7OztJQWE5Qiw2Q0FBNEU7O0lBQzVFLDZDQUEyRTs7SUFuQjNFLDhCQUEyRTs7SUFDM0UsK0JBQXlEOztJQUN6RCx5Q0FBNkU7O0lBQzdFLGdDQUEyRDs7SUFDM0Qsc0NBQW9FOztJQUNwRSwwQ0FBNEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBBZnRlclZpZXdJbml0LFxuICBJbnB1dCxcbiAgSW5qZWN0LFxuICBEaXJlY3RpdmUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7TWF0SW5rQmFyfSBmcm9tICcuL2luay1iYXInO1xuaW1wb3J0IHtNYXRUYWJMYWJlbFdyYXBwZXJ9IGZyb20gJy4vdGFiLWxhYmVsLXdyYXBwZXInO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7TWF0UGFnaW5hdGVkVGFiSGVhZGVyfSBmcm9tICcuL3BhZ2luYXRlZC10YWItaGVhZGVyJztcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0VGFiSGVhZGVyYCBmdW5jdGlvbmFsaXR5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKClcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFRhYkhlYWRlckJhc2UgZXh0ZW5kcyBNYXRQYWdpbmF0ZWRUYWJIZWFkZXIgaW1wbGVtZW50c1xuICBBZnRlckNvbnRlbnRDaGVja2VkLCBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByaXBwbGUgZWZmZWN0IGlzIGRpc2FibGVkIG9yIG5vdC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVSaXBwbGUoKSB7IHJldHVybiB0aGlzLl9kaXNhYmxlUmlwcGxlOyB9XG4gIHNldCBkaXNhYmxlUmlwcGxlKHZhbHVlOiBhbnkpIHsgdGhpcy5fZGlzYWJsZVJpcHBsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfZGlzYWJsZVJpcHBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAgICAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBgX2FuaW1hdGlvbk1vZGVgIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGNoYW5nZURldGVjdG9yUmVmLCB2aWV3cG9ydFJ1bGVyLCBkaXIsIG5nWm9uZSwgcGxhdGZvcm0sIGFuaW1hdGlvbk1vZGUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9pdGVtU2VsZWN0ZWQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGhlYWRlciBvZiB0aGUgdGFiIGdyb3VwIHdoaWNoIGRpc3BsYXlzIGEgbGlzdCBvZiBhbGwgdGhlIHRhYnMgaW4gdGhlIHRhYiBncm91cC4gSW5jbHVkZXNcbiAqIGFuIGluayBiYXIgdGhhdCBmb2xsb3dzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgdGFiLiBXaGVuIHRoZSB0YWJzIGxpc3QncyB3aWR0aCBleGNlZWRzIHRoZVxuICogd2lkdGggb2YgdGhlIGhlYWRlciBjb250YWluZXIsIHRoZW4gYXJyb3dzIHdpbGwgYmUgZGlzcGxheWVkIHRvIGFsbG93IHRoZSB1c2VyIHRvIHNjcm9sbFxuICogbGVmdCBhbmQgcmlnaHQgYWNyb3NzIHRoZSBoZWFkZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWItaGVhZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICd0YWItaGVhZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsndGFiLWhlYWRlci5jc3MnXSxcbiAgaW5wdXRzOiBbJ3NlbGVjdGVkSW5kZXgnXSxcbiAgb3V0cHV0czogWydzZWxlY3RGb2N1c2VkSW5kZXgnLCAnaW5kZXhGb2N1c2VkJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtdGFiLWhlYWRlcicsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWhlYWRlci1wYWdpbmF0aW9uLWNvbnRyb2xzLWVuYWJsZWRdJzogJ19zaG93UGFnaW5hdGlvbkNvbnRyb2xzJyxcbiAgICAnW2NsYXNzLm1hdC10YWItaGVhZGVyLXJ0bF0nOiBcIl9nZXRMYXlvdXREaXJlY3Rpb24oKSA9PSAncnRsJ1wiLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWJIZWFkZXIgZXh0ZW5kcyBfTWF0VGFiSGVhZGVyQmFzZSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0VGFiTGFiZWxXcmFwcGVyKSBfaXRlbXM6IFF1ZXJ5TGlzdDxNYXRUYWJMYWJlbFdyYXBwZXI+O1xuICBAVmlld0NoaWxkKE1hdElua0Jhciwge3N0YXRpYzogdHJ1ZX0pIF9pbmtCYXI6IE1hdElua0JhcjtcbiAgQFZpZXdDaGlsZCgndGFiTGlzdENvbnRhaW5lcicsIHtzdGF0aWM6IHRydWV9KSBfdGFiTGlzdENvbnRhaW5lcjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgndGFiTGlzdCcsIHtzdGF0aWM6IHRydWV9KSBfdGFiTGlzdDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnbmV4dFBhZ2luYXRvcicpIF9uZXh0UGFnaW5hdG9yOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgncHJldmlvdXNQYWdpbmF0b3InKSBfcHJldmlvdXNQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAgICAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBgX2FuaW1hdGlvbk1vZGVgIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGNoYW5nZURldGVjdG9yUmVmLCB2aWV3cG9ydFJ1bGVyLCBkaXIsIG5nWm9uZSwgcGxhdGZvcm0sIGFuaW1hdGlvbk1vZGUpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2VsZWN0ZWRJbmRleDogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbn1cbiJdfQ==