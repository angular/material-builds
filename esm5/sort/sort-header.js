/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Optional, ViewEncapsulation, Inject, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { merge } from 'rxjs';
import { MatSort } from './sort';
import { matSortAnimations } from './sort-animations';
import { getSortHeaderNotContainedWithinSortError } from './sort-errors';
import { MatSortHeaderIntl } from './sort-header-intl';
// Boilerplate for applying mixins to the sort header.
/** @docs-private */
var MatSortHeaderBase = /** @class */ (function () {
    function MatSortHeaderBase() {
    }
    return MatSortHeaderBase;
}());
var _MatSortHeaderMixinBase = mixinDisabled(MatSortHeaderBase);
/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MatSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
var MatSortHeader = /** @class */ (function (_super) {
    tslib_1.__extends(MatSortHeader, _super);
    function MatSortHeader(_intl, changeDetectorRef, _sort, _columnDef) {
        var _this = 
        // Note that we use a string token for the `_columnDef`, because the value is provided both by
        // `material/table` and `cdk/table` and we can't have the CDK depending on Material,
        // and we want to avoid having the sort header depending on the CDK table because
        // of this single reference.
        _super.call(this) || this;
        _this._intl = _intl;
        _this._sort = _sort;
        _this._columnDef = _columnDef;
        /**
         * Flag set to true when the indicator should be displayed while the sort is not active. Used to
         * provide an affordance that the header is sortable by showing on focus and hover.
         */
        _this._showIndicatorHint = false;
        /** The direction the arrow should be facing according to the current state. */
        _this._arrowDirection = '';
        /**
         * Whether the view state animation should show the transition between the `from` and `to` states.
         */
        _this._disableViewStateAnimation = false;
        /** Sets the position of the arrow that displays when sorted. */
        _this.arrowPosition = 'after';
        if (!_sort) {
            throw getSortHeaderNotContainedWithinSortError();
        }
        _this._rerenderSubscription = merge(_sort.sortChange, _sort._stateChanges, _intl.changes)
            .subscribe(function () {
            if (_this._isSorted()) {
                _this._updateArrowDirection();
            }
            // If this header was recently active and now no longer sorted, animate away the arrow.
            if (!_this._isSorted() && _this._viewState && _this._viewState.toState === 'active') {
                _this._disableViewStateAnimation = false;
                _this._setAnimationTransitionState({ fromState: 'active', toState: _this._arrowDirection });
            }
            changeDetectorRef.markForCheck();
        });
        return _this;
    }
    Object.defineProperty(MatSortHeader.prototype, "disableClear", {
        /** Overrides the disable clear value of the containing MatSort for this MatSortable. */
        get: function () { return this._disableClear; },
        set: function (v) { this._disableClear = coerceBooleanProperty(v); },
        enumerable: true,
        configurable: true
    });
    MatSortHeader.prototype.ngOnInit = function () {
        if (!this.id && this._columnDef) {
            this.id = this._columnDef.name;
        }
        // Initialize the direction of the arrow and set the view state to be immediately that state.
        this._updateArrowDirection();
        this._setAnimationTransitionState({ toState: this._isSorted() ? 'active' : this._arrowDirection });
        this._sort.register(this);
    };
    MatSortHeader.prototype.ngOnDestroy = function () {
        this._sort.deregister(this);
        this._rerenderSubscription.unsubscribe();
    };
    /**
     * Sets the "hint" state such that the arrow will be semi-transparently displayed as a hint to the
     * user showing what the active sort will become. If set to false, the arrow will fade away.
     */
    MatSortHeader.prototype._setIndicatorHintVisible = function (visible) {
        // No-op if the sort header is disabled - should not make the hint visible.
        if (this._isDisabled() && visible) {
            return;
        }
        this._showIndicatorHint = visible;
        if (!this._isSorted()) {
            this._updateArrowDirection();
            if (this._showIndicatorHint) {
                this._setAnimationTransitionState({ fromState: this._arrowDirection, toState: 'hint' });
            }
            else {
                this._setAnimationTransitionState({ fromState: 'hint', toState: this._arrowDirection });
            }
        }
    };
    /**
     * Sets the animation transition view state for the arrow's position and opacity. If the
     * `disableViewStateAnimation` flag is set to true, the `fromState` will be ignored so that
     * no animation appears.
     */
    MatSortHeader.prototype._setAnimationTransitionState = function (viewState) {
        this._viewState = viewState;
        // If the animation for arrow position state (opacity/translation) should be disabled,
        // remove the fromState so that it jumps right to the toState.
        if (this._disableViewStateAnimation) {
            this._viewState = { toState: viewState.toState };
        }
    };
    /** Triggers the sort on this sort header and removes the indicator hint. */
    MatSortHeader.prototype._handleClick = function () {
        if (this._isDisabled()) {
            return;
        }
        this._sort.sort(this);
        // Do not show the animation if the header was already shown in the right position.
        if (this._viewState.toState === 'hint' || this._viewState.toState === 'active') {
            this._disableViewStateAnimation = true;
        }
        // If the arrow is now sorted, animate the arrow into place. Otherwise, animate it away into
        // the direction it is facing.
        var viewState = this._isSorted() ?
            { fromState: this._arrowDirection, toState: 'active' } :
            { fromState: 'active', toState: this._arrowDirection };
        this._setAnimationTransitionState(viewState);
        this._showIndicatorHint = false;
    };
    /** Whether this MatSortHeader is currently sorted in either ascending or descending order. */
    MatSortHeader.prototype._isSorted = function () {
        return this._sort.active == this.id &&
            (this._sort.direction === 'asc' || this._sort.direction === 'desc');
    };
    /** Returns the animation state for the arrow direction (indicator and pointers). */
    MatSortHeader.prototype._getArrowDirectionState = function () {
        return "" + (this._isSorted() ? 'active-' : '') + this._arrowDirection;
    };
    /** Returns the arrow position state (opacity, translation). */
    MatSortHeader.prototype._getArrowViewState = function () {
        var fromState = this._viewState.fromState;
        return (fromState ? fromState + "-to-" : '') + this._viewState.toState;
    };
    /**
     * Updates the direction the arrow should be pointing. If it is not sorted, the arrow should be
     * facing the start direction. Otherwise if it is sorted, the arrow should point in the currently
     * active sorted direction. The reason this is updated through a function is because the direction
     * should only be changed at specific times - when deactivated but the hint is displayed and when
     * the sort is active and the direction changes. Otherwise the arrow's direction should linger
     * in cases such as the sort becoming deactivated but we want to animate the arrow away while
     * preserving its direction, even though the next sort direction is actually different and should
     * only be changed once the arrow displays again (hint or activation).
     */
    MatSortHeader.prototype._updateArrowDirection = function () {
        this._arrowDirection = this._isSorted() ?
            this._sort.direction :
            (this.start || this._sort.start);
    };
    MatSortHeader.prototype._isDisabled = function () {
        return this._sort.disabled || this.disabled;
    };
    /**
     * Gets the aria-sort attribute that should be applied to this sort header. If this header
     * is not sorted, returns null so that the attribute is removed from the host element. Aria spec
     * says that the aria-sort property should only be present on one header at a time, so removing
     * ensures this is true.
     */
    MatSortHeader.prototype._getAriaSortAttribute = function () {
        if (!this._isSorted()) {
            return null;
        }
        return this._sort.direction == 'asc' ? 'ascending' : 'descending';
    };
    /** Whether the arrow inside the sort header should be rendered. */
    MatSortHeader.prototype._renderArrow = function () {
        return !this._isDisabled() || this._isSorted();
    };
    MatSortHeader.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: '[mat-sort-header]',
                    exportAs: 'matSortHeader',
                    template: "<div class=\"mat-sort-header-container\"\n     [class.mat-sort-header-sorted]=\"_isSorted()\"\n     [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\">\n  <button class=\"mat-sort-header-button\" type=\"button\"\n          [attr.disabled]=\"_isDisabled() || null\"\n          [attr.aria-label]=\"_intl.sortButtonLabel(id)\"\n          (focus)=\"_setIndicatorHintVisible(true)\"\n          (blur)=\"_setIndicatorHintVisible(false)\">\n    <ng-content></ng-content>\n  </button>\n\n  <!-- Disable animations while a current animation is running -->\n  <div class=\"mat-sort-header-arrow\"\n       *ngIf=\"_renderArrow()\"\n       [@arrowOpacity]=\"_getArrowViewState()\"\n       [@arrowPosition]=\"_getArrowViewState()\"\n       [@allowChildren]=\"_getArrowDirectionState()\"\n       (@arrowPosition.start)=\"_disableViewStateAnimation = true\"\n       (@arrowPosition.done)=\"_disableViewStateAnimation = false\">\n    <div class=\"mat-sort-header-stem\"></div>\n    <div class=\"mat-sort-header-indicator\" [@indicator]=\"_getArrowDirectionState()\">\n      <div class=\"mat-sort-header-pointer-left\" [@leftPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-right\" [@rightPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-middle\"></div>\n    </div>\n  </div>\n</div>\n",
                    host: {
                        '(click)': '_handleClick()',
                        '(mouseenter)': '_setIndicatorHintVisible(true)',
                        '(mouseleave)': '_setIndicatorHintVisible(false)',
                        '[attr.aria-sort]': '_getAriaSortAttribute()',
                        '[class.mat-sort-header-disabled]': '_isDisabled()',
                    },
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: ['disabled'],
                    animations: [
                        matSortAnimations.indicator,
                        matSortAnimations.leftPointer,
                        matSortAnimations.rightPointer,
                        matSortAnimations.arrowOpacity,
                        matSortAnimations.arrowPosition,
                        matSortAnimations.allowChildren,
                    ],
                    styles: [".mat-sort-header-container{display:flex;cursor:pointer;align-items:center}.mat-sort-header-disabled .mat-sort-header-container{cursor:default}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-button{border:none;background:0 0;display:flex;align-items:center;padding:0;cursor:inherit;outline:0;font:inherit;color:currentColor}.mat-sort-header-button::-moz-focus-inner{border:0}.mat-sort-header-arrow{height:12px;width:12px;min-width:12px;position:relative;display:flex;opacity:0}.mat-sort-header-arrow,[dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow{margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow,[dir=rtl] .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-stem{background:currentColor;height:10px;width:2px;margin:auto;display:flex;align-items:center}@media(-ms-high-contrast: active){.mat-sort-header-stem{width:0;border-left:solid 2px}}.mat-sort-header-indicator{width:100%;height:2px;display:flex;align-items:center;position:absolute;top:0;left:0}.mat-sort-header-pointer-middle{margin:auto;height:2px;width:2px;background:currentColor;transform:rotate(45deg)}@media(-ms-high-contrast: active){.mat-sort-header-pointer-middle{width:0;height:0;border-top:solid 2px;border-left:solid 2px}}.mat-sort-header-pointer-left,.mat-sort-header-pointer-right{background:currentColor;width:6px;height:2px;position:absolute;top:0}@media(-ms-high-contrast: active){.mat-sort-header-pointer-left,.mat-sort-header-pointer-right{width:0;height:0;border-left:solid 6px;border-top:solid 2px}}.mat-sort-header-pointer-left{transform-origin:right;left:0}.mat-sort-header-pointer-right{transform-origin:left;right:0}/*# sourceMappingURL=sort-header.css.map */\n"]
                }] }
    ];
    /** @nocollapse */
    MatSortHeader.ctorParameters = function () { return [
        { type: MatSortHeaderIntl },
        { type: ChangeDetectorRef },
        { type: MatSort, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Inject, args: ['MAT_SORT_HEADER_COLUMN_DEF',] }, { type: Optional }] }
    ]; };
    MatSortHeader.propDecorators = {
        id: [{ type: Input, args: ['mat-sort-header',] }],
        arrowPosition: [{ type: Input }],
        start: [{ type: Input }],
        disableClear: [{ type: Input }]
    };
    return MatSortHeader;
}(_MatSortHeaderMixinBase));
export { MatSortHeader };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc29ydC9zb3J0LWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULEtBQUssRUFHTCxRQUFRLEVBQ1IsaUJBQWlCLEVBQ2pCLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQTZCLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2pGLE9BQU8sRUFBQyxLQUFLLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLE9BQU8sRUFBYyxNQUFNLFFBQVEsQ0FBQztBQUM1QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVwRCxPQUFPLEVBQUMsd0NBQXdDLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHckQsc0RBQXNEO0FBQ3RELG9CQUFvQjtBQUNwQjtJQUFBO0lBQXlCLENBQUM7SUFBRCx3QkFBQztBQUFELENBQUMsQUFBMUIsSUFBMEI7QUFDMUIsSUFBTSx1QkFBdUIsR0FDekIsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUEyQnJDOzs7Ozs7OztHQVFHO0FBQ0g7SUF5Qm1DLHlDQUF1QjtJQTJDeEQsdUJBQW1CLEtBQXdCLEVBQy9CLGlCQUFvQyxFQUNqQixLQUFjLEVBRXRCLFVBQWtDO1FBSnpEO1FBS0UsOEZBQThGO1FBQzlGLG9GQUFvRjtRQUNwRixpRkFBaUY7UUFDakYsNEJBQTRCO1FBQzVCLGlCQUFPLFNBb0JSO1FBN0JrQixXQUFLLEdBQUws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QWlCO2dDQUd2QixLQUFLO3dCQUdMLEtBQUs7K0JBR0wsS0FBSzs7SUFtS1Isb0JBQUM7Q0FBQSxBQWxPRCxDQXlCbUMsdUJBQXVCLEdBeU16RDtTQXpNWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBDYW5EaXNhYmxlQ3RvciwgbWl4aW5EaXNhYmxlZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge21lcmdlLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXRTb3J0LCBNYXRTb3J0YWJsZX0gZnJvbSAnLi9zb3J0JztcbmltcG9ydCB7bWF0U29ydEFuaW1hdGlvbnN9IGZyb20gJy4vc29ydC1hbmltYXRpb25zJztcbmltcG9ydCB7U29ydERpcmVjdGlvbn0gZnJvbSAnLi9zb3J0LWRpcmVjdGlvbic7XG5pbXBvcnQge2dldFNvcnRIZWFkZXJOb3RDb250YWluZWRXaXRoaW5Tb3J0RXJyb3J9IGZyb20gJy4vc29ydC1lcnJvcnMnO1xuaW1wb3J0IHtNYXRTb3J0SGVhZGVySW50bH0gZnJvbSAnLi9zb3J0LWhlYWRlci1pbnRsJztcblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIHRoZSBzb3J0IGhlYWRlci5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRTb3J0SGVhZGVyQmFzZSB7fVxuY29uc3QgX01hdFNvcnRIZWFkZXJNaXhpbkJhc2U6IENhbkRpc2FibGVDdG9yICYgdHlwZW9mIE1hdFNvcnRIZWFkZXJCYXNlID1cbiAgICBtaXhpbkRpc2FibGVkKE1hdFNvcnRIZWFkZXJCYXNlKTtcblxuLyoqXG4gKiBWYWxpZCBwb3NpdGlvbnMgZm9yIHRoZSBhcnJvdyB0byBiZSBpbiBmb3IgaXRzIG9wYWNpdHkgYW5kIHRyYW5zbGF0aW9uLiBJZiB0aGUgc3RhdGUgaXMgYVxuICogc29ydCBkaXJlY3Rpb24sIHRoZSBwb3NpdGlvbiBvZiB0aGUgYXJyb3cgd2lsbCBiZSBhYm92ZS9iZWxvdyBhbmQgb3BhY2l0eSAwLiBJZiB0aGUgc3RhdGUgaXNcbiAqIGhpbnQsIHRoZSBhcnJvdyB3aWxsIGJlIGluIHRoZSBjZW50ZXIgd2l0aCBhIHNsaWdodCBvcGFjaXR5LiBBY3RpdmUgc3RhdGUgbWVhbnMgdGhlIGFycm93IHdpbGxcbiAqIGJlIGZ1bGx5IG9wYXF1ZSBpbiB0aGUgY2VudGVyLlxuICpcbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IHR5cGUgQXJyb3dWaWV3U3RhdGUgPSBTb3J0RGlyZWN0aW9uIHwgJ2hpbnQnIHwgJ2FjdGl2ZSc7XG5cbi8qKlxuICogU3RhdGVzIGRlc2NyaWJpbmcgdGhlIGFycm93J3MgYW5pbWF0ZWQgcG9zaXRpb24gKGFuaW1hdGluZyBmcm9tU3RhdGUgdG8gdG9TdGF0ZSkuXG4gKiBJZiB0aGUgZnJvbVN0YXRlIGlzIG5vdCBkZWZpbmVkLCB0aGVyZSB3aWxsIGJlIG5vIGFuaW1hdGVkIHRyYW5zaXRpb24gdG8gdGhlIHRvU3RhdGUuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXJyb3dWaWV3U3RhdGVUcmFuc2l0aW9uIHtcbiAgZnJvbVN0YXRlPzogQXJyb3dWaWV3U3RhdGU7XG4gIHRvU3RhdGU6IEFycm93Vmlld1N0YXRlO1xufVxuXG4vKiogQ29sdW1uIGRlZmluaXRpb24gYXNzb2NpYXRlZCB3aXRoIGEgYE1hdFNvcnRIZWFkZXJgLiAqL1xuaW50ZXJmYWNlIE1hdFNvcnRIZWFkZXJDb2x1bW5EZWYge1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQXBwbGllcyBzb3J0aW5nIGJlaGF2aW9yIChjbGljayB0byBjaGFuZ2Ugc29ydCkgYW5kIHN0eWxlcyB0byBhbiBlbGVtZW50LCBpbmNsdWRpbmcgYW5cbiAqIGFycm93IHRvIGRpc3BsYXkgdGhlIGN1cnJlbnQgc29ydCBkaXJlY3Rpb24uXG4gKlxuICogTXVzdCBiZSBwcm92aWRlZCB3aXRoIGFuIGlkIGFuZCBjb250YWluZWQgd2l0aGluIGEgcGFyZW50IE1hdFNvcnQgZGlyZWN0aXZlLlxuICpcbiAqIElmIHVzZWQgb24gaGVhZGVyIGNlbGxzIGluIGEgQ2RrVGFibGUsIGl0IHdpbGwgYXV0b21hdGljYWxseSBkZWZhdWx0IGl0cyBpZCBmcm9tIGl0cyBjb250YWluaW5nXG4gKiBjb2x1bW4gZGVmaW5pdGlvbi5cbiAqL1xuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnW21hdC1zb3J0LWhlYWRlcl0nLFxuICBleHBvcnRBczogJ21hdFNvcnRIZWFkZXInLFxuICB0ZW1wbGF0ZVVybDogJ3NvcnQtaGVhZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc29ydC1oZWFkZXIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soKScsXG4gICAgJyhtb3VzZWVudGVyKSc6ICdfc2V0SW5kaWNhdG9ySGludFZpc2libGUodHJ1ZSknLFxuICAgICcobW91c2VsZWF2ZSknOiAnX3NldEluZGljYXRvckhpbnRWaXNpYmxlKGZhbHNlKScsXG4gICAgJ1thdHRyLmFyaWEtc29ydF0nOiAnX2dldEFyaWFTb3J0QXR0cmlidXRlKCknLFxuICAgICdbY2xhc3MubWF0LXNvcnQtaGVhZGVyLWRpc2FibGVkXSc6ICdfaXNEaXNhYmxlZCgpJyxcbiAgfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogWydkaXNhYmxlZCddLFxuICBhbmltYXRpb25zOiBbXG4gICAgbWF0U29ydEFuaW1hdGlvbnMuaW5kaWNhdG9yLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmxlZnRQb2ludGVyLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLnJpZ2h0UG9pbnRlcixcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5hcnJvd09wYWNpdHksXG4gICAgbWF0U29ydEFuaW1hdGlvbnMuYXJyb3dQb3NpdGlvbixcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5hbGxvd0NoaWxkcmVuLFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNvcnRIZWFkZXIgZXh0ZW5kcyBfTWF0U29ydEhlYWRlck1peGluQmFzZVxuICAgIGltcGxlbWVudHMgQ2FuRGlzYWJsZSwgTWF0U29ydGFibGUsIE9uRGVzdHJveSwgT25Jbml0IHtcbiAgcHJpdmF0ZSBfcmVyZW5kZXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKipcbiAgICogRmxhZyBzZXQgdG8gdHJ1ZSB3aGVuIHRoZSBpbmRpY2F0b3Igc2hvdWxkIGJlIGRpc3BsYXllZCB3aGlsZSB0aGUgc29ydCBpcyBub3QgYWN0aXZlLiBVc2VkIHRvXG4gICAqIHByb3ZpZGUgYW4gYWZmb3JkYW5jZSB0aGF0IHRoZSBoZWFkZXIgaXMgc29ydGFibGUgYnkgc2hvd2luZyBvbiBmb2N1cyBhbmQgaG92ZXIuXG4gICAqL1xuICBfc2hvd0luZGljYXRvckhpbnQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIHZpZXcgdHJhbnNpdGlvbiBzdGF0ZSBvZiB0aGUgYXJyb3cgKHRyYW5zbGF0aW9uLyBvcGFjaXR5KSAtIGluZGljYXRlcyBpdHMgYGZyb21gIGFuZCBgdG9gXG4gICAqIHBvc2l0aW9uIHRocm91Z2ggdGhlIGFuaW1hdGlvbi4gSWYgYW5pbWF0aW9ucyBhcmUgY3VycmVudGx5IGRpc2FibGVkLCB0aGUgZnJvbVN0YXRlIGlzIHJlbW92ZWRcbiAgICogc28gdGhhdCB0aGVyZSBpcyBubyBhbmltYXRpb24gZGlzcGxheWVkLlxuICAgKi9cbiAgX3ZpZXdTdGF0ZTogQXJyb3dWaWV3U3RhdGVUcmFuc2l0aW9uO1xuXG4gIC8qKiBUaGUgZGlyZWN0aW9uIHRoZSBhcnJvdyBzaG91bGQgYmUgZmFjaW5nIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBzdGF0ZS4gKi9cbiAgX2Fycm93RGlyZWN0aW9uOiBTb3J0RGlyZWN0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHZpZXcgc3RhdGUgYW5pbWF0aW9uIHNob3VsZCBzaG93IHRoZSB0cmFuc2l0aW9uIGJldHdlZW4gdGhlIGBmcm9tYCBhbmQgYHRvYCBzdGF0ZXMuXG4gICAqL1xuICBfZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJRCBvZiB0aGlzIHNvcnQgaGVhZGVyLiBJZiB1c2VkIHdpdGhpbiB0aGUgY29udGV4dCBvZiBhIENka0NvbHVtbkRlZiwgdGhpcyB3aWxsIGRlZmF1bHQgdG9cbiAgICogdGhlIGNvbHVtbidzIG5hbWUuXG4gICAqL1xuICBASW5wdXQoJ21hdC1zb3J0LWhlYWRlcicpIGlkOiBzdHJpbmc7XG5cbiAgLyoqIFNldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBhcnJvdyB0aGF0IGRpc3BsYXlzIHdoZW4gc29ydGVkLiAqL1xuICBASW5wdXQoKSBhcnJvd1Bvc2l0aW9uOiAnYmVmb3JlJyB8ICdhZnRlcicgPSAnYWZ0ZXInO1xuXG4gIC8qKiBPdmVycmlkZXMgdGhlIHNvcnQgc3RhcnQgdmFsdWUgb2YgdGhlIGNvbnRhaW5pbmcgTWF0U29ydCBmb3IgdGhpcyBNYXRTb3J0YWJsZS4gKi9cbiAgQElucHV0KCkgc3RhcnQ6ICdhc2MnIHwgJ2Rlc2MnO1xuXG4gIC8qKiBPdmVycmlkZXMgdGhlIGRpc2FibGUgY2xlYXIgdmFsdWUgb2YgdGhlIGNvbnRhaW5pbmcgTWF0U29ydCBmb3IgdGhpcyBNYXRTb3J0YWJsZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVDbGVhcigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVDbGVhcjsgfVxuICBzZXQgZGlzYWJsZUNsZWFyKHYpIHsgdGhpcy5fZGlzYWJsZUNsZWFyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpOyB9XG4gIHByaXZhdGUgX2Rpc2FibGVDbGVhcjogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2ludGw6IE1hdFNvcnRIZWFkZXJJbnRsLFxuICAgICAgICAgICAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfc29ydDogTWF0U29ydCxcbiAgICAgICAgICAgICAgQEluamVjdCgnTUFUX1NPUlRfSEVBREVSX0NPTFVNTl9ERUYnKSBAT3B0aW9uYWwoKVxuICAgICAgICAgICAgICAgICAgcHVibGljIF9jb2x1bW5EZWY6IE1hdFNvcnRIZWFkZXJDb2x1bW5EZWYpIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgdXNlIGEgc3RyaW5nIHRva2VuIGZvciB0aGUgYF9jb2x1bW5EZWZgLCBiZWNhdXNlIHRoZSB2YWx1ZSBpcyBwcm92aWRlZCBib3RoIGJ5XG4gICAgLy8gYG1hdGVyaWFsL3RhYmxlYCBhbmQgYGNkay90YWJsZWAgYW5kIHdlIGNhbid0IGhhdmUgdGhlIENESyBkZXBlbmRpbmcgb24gTWF0ZXJpYWwsXG4gICAgLy8gYW5kIHdlIHdhbnQgdG8gYXZvaWQgaGF2aW5nIHRoZSBzb3J0IGhlYWRlciBkZXBlbmRpbmcgb24gdGhlIENESyB0YWJsZSBiZWNhdXNlXG4gICAgLy8gb2YgdGhpcyBzaW5nbGUgcmVmZXJlbmNlLlxuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoIV9zb3J0KSB7XG4gICAgICB0aHJvdyBnZXRTb3J0SGVhZGVyTm90Q29udGFpbmVkV2l0aGluU29ydEVycm9yKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVyZW5kZXJTdWJzY3JpcHRpb24gPSBtZXJnZShfc29ydC5zb3J0Q2hhbmdlLCBfc29ydC5fc3RhdGVDaGFuZ2VzLCBfaW50bC5jaGFuZ2VzKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5faXNTb3J0ZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQXJyb3dEaXJlY3Rpb24oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGlzIGhlYWRlciB3YXMgcmVjZW50bHkgYWN0aXZlIGFuZCBub3cgbm8gbG9uZ2VyIHNvcnRlZCwgYW5pbWF0ZSBhd2F5IHRoZSBhcnJvdy5cbiAgICAgICAgICBpZiAoIXRoaXMuX2lzU29ydGVkKCkgJiYgdGhpcy5fdmlld1N0YXRlICYmIHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID09PSAnYWN0aXZlJykge1xuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6ICdhY3RpdmUnLCB0b1N0YXRlOiB0aGlzLl9hcnJvd0RpcmVjdGlvbn0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5pZCAmJiB0aGlzLl9jb2x1bW5EZWYpIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLl9jb2x1bW5EZWYubmFtZTtcbiAgICB9XG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSBkaXJlY3Rpb24gb2YgdGhlIGFycm93IGFuZCBzZXQgdGhlIHZpZXcgc3RhdGUgdG8gYmUgaW1tZWRpYXRlbHkgdGhhdCBzdGF0ZS5cbiAgICB0aGlzLl91cGRhdGVBcnJvd0RpcmVjdGlvbigpO1xuICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZShcbiAgICAgICAge3RvU3RhdGU6IHRoaXMuX2lzU29ydGVkKCkgPyAnYWN0aXZlJyA6IHRoaXMuX2Fycm93RGlyZWN0aW9ufSk7XG5cbiAgICB0aGlzLl9zb3J0LnJlZ2lzdGVyKHRoaXMpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc29ydC5kZXJlZ2lzdGVyKHRoaXMpO1xuICAgIHRoaXMuX3JlcmVuZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgXCJoaW50XCIgc3RhdGUgc3VjaCB0aGF0IHRoZSBhcnJvdyB3aWxsIGJlIHNlbWktdHJhbnNwYXJlbnRseSBkaXNwbGF5ZWQgYXMgYSBoaW50IHRvIHRoZVxuICAgKiB1c2VyIHNob3dpbmcgd2hhdCB0aGUgYWN0aXZlIHNvcnQgd2lsbCBiZWNvbWUuIElmIHNldCB0byBmYWxzZSwgdGhlIGFycm93IHdpbGwgZmFkZSBhd2F5LlxuICAgKi9cbiAgX3NldEluZGljYXRvckhpbnRWaXNpYmxlKHZpc2libGU6IGJvb2xlYW4pIHtcbiAgICAvLyBOby1vcCBpZiB0aGUgc29ydCBoZWFkZXIgaXMgZGlzYWJsZWQgLSBzaG91bGQgbm90IG1ha2UgdGhlIGhpbnQgdmlzaWJsZS5cbiAgICBpZiAodGhpcy5faXNEaXNhYmxlZCgpICYmIHZpc2libGUpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9zaG93SW5kaWNhdG9ySGludCA9IHZpc2libGU7XG5cbiAgICBpZiAoIXRoaXMuX2lzU29ydGVkKCkpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUFycm93RGlyZWN0aW9uKCk7XG4gICAgICBpZiAodGhpcy5fc2hvd0luZGljYXRvckhpbnQpIHtcbiAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9uLCB0b1N0YXRlOiAnaGludCd9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh7ZnJvbVN0YXRlOiAnaGludCcsIHRvU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9ufSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGFuaW1hdGlvbiB0cmFuc2l0aW9uIHZpZXcgc3RhdGUgZm9yIHRoZSBhcnJvdydzIHBvc2l0aW9uIGFuZCBvcGFjaXR5LiBJZiB0aGVcbiAgICogYGRpc2FibGVWaWV3U3RhdGVBbmltYXRpb25gIGZsYWcgaXMgc2V0IHRvIHRydWUsIHRoZSBgZnJvbVN0YXRlYCB3aWxsIGJlIGlnbm9yZWQgc28gdGhhdFxuICAgKiBubyBhbmltYXRpb24gYXBwZWFycy5cbiAgICovXG4gIF9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUodmlld1N0YXRlOiBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb24pIHtcbiAgICB0aGlzLl92aWV3U3RhdGUgPSB2aWV3U3RhdGU7XG5cbiAgICAvLyBJZiB0aGUgYW5pbWF0aW9uIGZvciBhcnJvdyBwb3NpdGlvbiBzdGF0ZSAob3BhY2l0eS90cmFuc2xhdGlvbikgc2hvdWxkIGJlIGRpc2FibGVkLFxuICAgIC8vIHJlbW92ZSB0aGUgZnJvbVN0YXRlIHNvIHRoYXQgaXQganVtcHMgcmlnaHQgdG8gdGhlIHRvU3RhdGUuXG4gICAgaWYgKHRoaXMuX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24pIHtcbiAgICAgIHRoaXMuX3ZpZXdTdGF0ZSA9IHt0b1N0YXRlOiB2aWV3U3RhdGUudG9TdGF0ZX07XG4gICAgfVxuICB9XG5cbiAgLyoqIFRyaWdnZXJzIHRoZSBzb3J0IG9uIHRoaXMgc29ydCBoZWFkZXIgYW5kIHJlbW92ZXMgdGhlIGluZGljYXRvciBoaW50LiAqL1xuICBfaGFuZGxlQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMuX2lzRGlzYWJsZWQoKSkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX3NvcnQuc29ydCh0aGlzKTtcblxuICAgIC8vIERvIG5vdCBzaG93IHRoZSBhbmltYXRpb24gaWYgdGhlIGhlYWRlciB3YXMgYWxyZWFkeSBzaG93biBpbiB0aGUgcmlnaHQgcG9zaXRpb24uXG4gICAgaWYgKHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID09PSAnaGludCcgfHwgdGhpcy5fdmlld1N0YXRlLnRvU3RhdGUgPT09ICdhY3RpdmUnKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlVmlld1N0YXRlQW5pbWF0aW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgYXJyb3cgaXMgbm93IHNvcnRlZCwgYW5pbWF0ZSB0aGUgYXJyb3cgaW50byBwbGFjZS4gT3RoZXJ3aXNlLCBhbmltYXRlIGl0IGF3YXkgaW50b1xuICAgIC8vIHRoZSBkaXJlY3Rpb24gaXQgaXMgZmFjaW5nLlxuICAgIGNvbnN0IHZpZXdTdGF0ZTogQXJyb3dWaWV3U3RhdGVUcmFuc2l0aW9uID0gdGhpcy5faXNTb3J0ZWQoKSA/XG4gICAgICAgIHtmcm9tU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9uLCB0b1N0YXRlOiAnYWN0aXZlJ30gOlxuICAgICAgICB7ZnJvbVN0YXRlOiAnYWN0aXZlJywgdG9TdGF0ZTogdGhpcy5fYXJyb3dEaXJlY3Rpb259O1xuICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh2aWV3U3RhdGUpO1xuXG4gICAgdGhpcy5fc2hvd0luZGljYXRvckhpbnQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgTWF0U29ydEhlYWRlciBpcyBjdXJyZW50bHkgc29ydGVkIGluIGVpdGhlciBhc2NlbmRpbmcgb3IgZGVzY2VuZGluZyBvcmRlci4gKi9cbiAgX2lzU29ydGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9zb3J0LmFjdGl2ZSA9PSB0aGlzLmlkICYmXG4gICAgICAgICh0aGlzLl9zb3J0LmRpcmVjdGlvbiA9PT0gJ2FzYycgfHwgdGhpcy5fc29ydC5kaXJlY3Rpb24gPT09ICdkZXNjJyk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgYW5pbWF0aW9uIHN0YXRlIGZvciB0aGUgYXJyb3cgZGlyZWN0aW9uIChpbmRpY2F0b3IgYW5kIHBvaW50ZXJzKS4gKi9cbiAgX2dldEFycm93RGlyZWN0aW9uU3RhdGUoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuX2lzU29ydGVkKCkgPyAnYWN0aXZlLScgOiAnJ30ke3RoaXMuX2Fycm93RGlyZWN0aW9ufWA7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgYXJyb3cgcG9zaXRpb24gc3RhdGUgKG9wYWNpdHksIHRyYW5zbGF0aW9uKS4gKi9cbiAgX2dldEFycm93Vmlld1N0YXRlKCkge1xuICAgIGNvbnN0IGZyb21TdGF0ZSA9IHRoaXMuX3ZpZXdTdGF0ZS5mcm9tU3RhdGU7XG4gICAgcmV0dXJuIChmcm9tU3RhdGUgPyBgJHtmcm9tU3RhdGV9LXRvLWAgOiAnJykgKyB0aGlzLl92aWV3U3RhdGUudG9TdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBkaXJlY3Rpb24gdGhlIGFycm93IHNob3VsZCBiZSBwb2ludGluZy4gSWYgaXQgaXMgbm90IHNvcnRlZCwgdGhlIGFycm93IHNob3VsZCBiZVxuICAgKiBmYWNpbmcgdGhlIHN0YXJ0IGRpcmVjdGlvbi4gT3RoZXJ3aXNlIGlmIGl0IGlzIHNvcnRlZCwgdGhlIGFycm93IHNob3VsZCBwb2ludCBpbiB0aGUgY3VycmVudGx5XG4gICAqIGFjdGl2ZSBzb3J0ZWQgZGlyZWN0aW9uLiBUaGUgcmVhc29uIHRoaXMgaXMgdXBkYXRlZCB0aHJvdWdoIGEgZnVuY3Rpb24gaXMgYmVjYXVzZSB0aGUgZGlyZWN0aW9uXG4gICAqIHNob3VsZCBvbmx5IGJlIGNoYW5nZWQgYXQgc3BlY2lmaWMgdGltZXMgLSB3aGVuIGRlYWN0aXZhdGVkIGJ1dCB0aGUgaGludCBpcyBkaXNwbGF5ZWQgYW5kIHdoZW5cbiAgICogdGhlIHNvcnQgaXMgYWN0aXZlIGFuZCB0aGUgZGlyZWN0aW9uIGNoYW5nZXMuIE90aGVyd2lzZSB0aGUgYXJyb3cncyBkaXJlY3Rpb24gc2hvdWxkIGxpbmdlclxuICAgKiBpbiBjYXNlcyBzdWNoIGFzIHRoZSBzb3J0IGJlY29taW5nIGRlYWN0aXZhdGVkIGJ1dCB3ZSB3YW50IHRvIGFuaW1hdGUgdGhlIGFycm93IGF3YXkgd2hpbGVcbiAgICogcHJlc2VydmluZyBpdHMgZGlyZWN0aW9uLCBldmVuIHRob3VnaCB0aGUgbmV4dCBzb3J0IGRpcmVjdGlvbiBpcyBhY3R1YWxseSBkaWZmZXJlbnQgYW5kIHNob3VsZFxuICAgKiBvbmx5IGJlIGNoYW5nZWQgb25jZSB0aGUgYXJyb3cgZGlzcGxheXMgYWdhaW4gKGhpbnQgb3IgYWN0aXZhdGlvbikuXG4gICAqL1xuICBfdXBkYXRlQXJyb3dEaXJlY3Rpb24oKSB7XG4gICAgdGhpcy5fYXJyb3dEaXJlY3Rpb24gPSB0aGlzLl9pc1NvcnRlZCgpID9cbiAgICAgICAgdGhpcy5fc29ydC5kaXJlY3Rpb24gOlxuICAgICAgICAodGhpcy5zdGFydCB8fCB0aGlzLl9zb3J0LnN0YXJ0KTtcbiAgfVxuXG4gIF9pc0Rpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9zb3J0LmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgYXJpYS1zb3J0IGF0dHJpYnV0ZSB0aGF0IHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoaXMgc29ydCBoZWFkZXIuIElmIHRoaXMgaGVhZGVyXG4gICAqIGlzIG5vdCBzb3J0ZWQsIHJldHVybnMgbnVsbCBzbyB0aGF0IHRoZSBhdHRyaWJ1dGUgaXMgcmVtb3ZlZCBmcm9tIHRoZSBob3N0IGVsZW1lbnQuIEFyaWEgc3BlY1xuICAgKiBzYXlzIHRoYXQgdGhlIGFyaWEtc29ydCBwcm9wZXJ0eSBzaG91bGQgb25seSBiZSBwcmVzZW50IG9uIG9uZSBoZWFkZXIgYXQgYSB0aW1lLCBzbyByZW1vdmluZ1xuICAgKiBlbnN1cmVzIHRoaXMgaXMgdHJ1ZS5cbiAgICovXG4gIF9nZXRBcmlhU29ydEF0dHJpYnV0ZSgpIHtcbiAgICBpZiAoIXRoaXMuX2lzU29ydGVkKCkpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIHJldHVybiB0aGlzLl9zb3J0LmRpcmVjdGlvbiA9PSAnYXNjJyA/ICdhc2NlbmRpbmcnIDogJ2Rlc2NlbmRpbmcnO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFycm93IGluc2lkZSB0aGUgc29ydCBoZWFkZXIgc2hvdWxkIGJlIHJlbmRlcmVkLiAqL1xuICBfcmVuZGVyQXJyb3coKSB7XG4gICAgcmV0dXJuICF0aGlzLl9pc0Rpc2FibGVkKCkgfHwgdGhpcy5faXNTb3J0ZWQoKTtcbiAgfVxufVxuIl19