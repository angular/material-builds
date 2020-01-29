/**
 * @fileoverview added by tsickle
 * Generated from: src/material/sort/sort-header.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Optional, ViewEncapsulation, Inject, ElementRef, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { merge } from 'rxjs';
import { MatSort } from './sort';
import { matSortAnimations } from './sort-animations';
import { getSortHeaderNotContainedWithinSortError } from './sort-errors';
import { MatSortHeaderIntl } from './sort-header-intl';
// Boilerplate for applying mixins to the sort header.
/**
 * \@docs-private
 */
class MatSortHeaderBase {
}
/** @type {?} */
const _MatSortHeaderMixinBase = mixinDisabled(MatSortHeaderBase);
/**
 * States describing the arrow's animated position (animating fromState to toState).
 * If the fromState is not defined, there will be no animated transition to the toState.
 * \@docs-private
 * @record
 */
export function ArrowViewStateTransition() { }
if (false) {
    /** @type {?|undefined} */
    ArrowViewStateTransition.prototype.fromState;
    /** @type {?} */
    ArrowViewStateTransition.prototype.toState;
}
/**
 * Column definition associated with a `MatSortHeader`.
 * @record
 */
function MatSortHeaderColumnDef() { }
if (false) {
    /** @type {?} */
    MatSortHeaderColumnDef.prototype.name;
}
/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MatSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
export class MatSortHeader extends _MatSortHeaderMixinBase {
    /**
     * @param {?} _intl
     * @param {?} changeDetectorRef
     * @param {?} _sort
     * @param {?} _columnDef
     * @param {?=} _focusMonitor
     * @param {?=} _elementRef
     */
    constructor(_intl, changeDetectorRef, _sort, _columnDef, _focusMonitor, _elementRef) {
        // Note that we use a string token for the `_columnDef`, because the value is provided both by
        // `material/table` and `cdk/table` and we can't have the CDK depending on Material,
        // and we want to avoid having the sort header depending on the CDK table because
        // of this single reference.
        super();
        this._intl = _intl;
        this._sort = _sort;
        this._columnDef = _columnDef;
        this._focusMonitor = _focusMonitor;
        this._elementRef = _elementRef;
        /**
         * Flag set to true when the indicator should be displayed while the sort is not active. Used to
         * provide an affordance that the header is sortable by showing on focus and hover.
         */
        this._showIndicatorHint = false;
        /**
         * The direction the arrow should be facing according to the current state.
         */
        this._arrowDirection = '';
        /**
         * Whether the view state animation should show the transition between the `from` and `to` states.
         */
        this._disableViewStateAnimation = false;
        /**
         * Sets the position of the arrow that displays when sorted.
         */
        this.arrowPosition = 'after';
        if (!_sort) {
            throw getSortHeaderNotContainedWithinSortError();
        }
        this._rerenderSubscription = merge(_sort.sortChange, _sort._stateChanges, _intl.changes)
            .subscribe((/**
         * @return {?}
         */
        () => {
            if (this._isSorted()) {
                this._updateArrowDirection();
            }
            // If this header was recently active and now no longer sorted, animate away the arrow.
            if (!this._isSorted() && this._viewState && this._viewState.toState === 'active') {
                this._disableViewStateAnimation = false;
                this._setAnimationTransitionState({ fromState: 'active', toState: this._arrowDirection });
            }
            changeDetectorRef.markForCheck();
        }));
        if (_focusMonitor && _elementRef) {
            // We use the focus monitor because we also want to style
            // things differently based on the focus origin.
            _focusMonitor.monitor(_elementRef, true)
                .subscribe((/**
             * @param {?} origin
             * @return {?}
             */
            origin => this._setIndicatorHintVisible(!!origin)));
        }
    }
    /**
     * Overrides the disable clear value of the containing MatSort for this MatSortable.
     * @return {?}
     */
    get disableClear() { return this._disableClear; }
    /**
     * @param {?} v
     * @return {?}
     */
    set disableClear(v) { this._disableClear = coerceBooleanProperty(v); }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.id && this._columnDef) {
            this.id = this._columnDef.name;
        }
        // Initialize the direction of the arrow and set the view state to be immediately that state.
        this._updateArrowDirection();
        this._setAnimationTransitionState({ toState: this._isSorted() ? 'active' : this._arrowDirection });
        this._sort.register(this);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        // @breaking-change 10.0.0 Remove null check for _focusMonitor and _elementRef.
        if (this._focusMonitor && this._elementRef) {
            this._focusMonitor.stopMonitoring(this._elementRef);
        }
        this._sort.deregister(this);
        this._rerenderSubscription.unsubscribe();
    }
    /**
     * Sets the "hint" state such that the arrow will be semi-transparently displayed as a hint to the
     * user showing what the active sort will become. If set to false, the arrow will fade away.
     * @param {?} visible
     * @return {?}
     */
    _setIndicatorHintVisible(visible) {
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
    }
    /**
     * Sets the animation transition view state for the arrow's position and opacity. If the
     * `disableViewStateAnimation` flag is set to true, the `fromState` will be ignored so that
     * no animation appears.
     * @param {?} viewState
     * @return {?}
     */
    _setAnimationTransitionState(viewState) {
        this._viewState = viewState;
        // If the animation for arrow position state (opacity/translation) should be disabled,
        // remove the fromState so that it jumps right to the toState.
        if (this._disableViewStateAnimation) {
            this._viewState = { toState: viewState.toState };
        }
    }
    /**
     * Triggers the sort on this sort header and removes the indicator hint.
     * @return {?}
     */
    _handleClick() {
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
        /** @type {?} */
        const viewState = this._isSorted() ?
            { fromState: this._arrowDirection, toState: 'active' } :
            { fromState: 'active', toState: this._arrowDirection };
        this._setAnimationTransitionState(viewState);
        this._showIndicatorHint = false;
    }
    /**
     * Whether this MatSortHeader is currently sorted in either ascending or descending order.
     * @return {?}
     */
    _isSorted() {
        return this._sort.active == this.id &&
            (this._sort.direction === 'asc' || this._sort.direction === 'desc');
    }
    /**
     * Returns the animation state for the arrow direction (indicator and pointers).
     * @return {?}
     */
    _getArrowDirectionState() {
        return `${this._isSorted() ? 'active-' : ''}${this._arrowDirection}`;
    }
    /**
     * Returns the arrow position state (opacity, translation).
     * @return {?}
     */
    _getArrowViewState() {
        /** @type {?} */
        const fromState = this._viewState.fromState;
        return (fromState ? `${fromState}-to-` : '') + this._viewState.toState;
    }
    /**
     * Updates the direction the arrow should be pointing. If it is not sorted, the arrow should be
     * facing the start direction. Otherwise if it is sorted, the arrow should point in the currently
     * active sorted direction. The reason this is updated through a function is because the direction
     * should only be changed at specific times - when deactivated but the hint is displayed and when
     * the sort is active and the direction changes. Otherwise the arrow's direction should linger
     * in cases such as the sort becoming deactivated but we want to animate the arrow away while
     * preserving its direction, even though the next sort direction is actually different and should
     * only be changed once the arrow displays again (hint or activation).
     * @return {?}
     */
    _updateArrowDirection() {
        this._arrowDirection = this._isSorted() ?
            this._sort.direction :
            (this.start || this._sort.start);
    }
    /**
     * @return {?}
     */
    _isDisabled() {
        return this._sort.disabled || this.disabled;
    }
    /**
     * Gets the aria-sort attribute that should be applied to this sort header. If this header
     * is not sorted, returns null so that the attribute is removed from the host element. Aria spec
     * says that the aria-sort property should only be present on one header at a time, so removing
     * ensures this is true.
     * @return {?}
     */
    _getAriaSortAttribute() {
        if (!this._isSorted()) {
            return null;
        }
        return this._sort.direction == 'asc' ? 'ascending' : 'descending';
    }
    /**
     * Whether the arrow inside the sort header should be rendered.
     * @return {?}
     */
    _renderArrow() {
        return !this._isDisabled() || this._isSorted();
    }
}
MatSortHeader.decorators = [
    { type: Component, args: [{
                selector: '[mat-sort-header]',
                exportAs: 'matSortHeader',
                template: "<div class=\"mat-sort-header-container\"\n     [class.mat-sort-header-sorted]=\"_isSorted()\"\n     [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\">\n  <button class=\"mat-sort-header-button\" type=\"button\"\n          [attr.disabled]=\"_isDisabled() || null\"\n          [attr.aria-label]=\"_intl.sortButtonLabel(id)\">\n    <ng-content></ng-content>\n  </button>\n\n  <!-- Disable animations while a current animation is running -->\n  <div class=\"mat-sort-header-arrow\"\n       *ngIf=\"_renderArrow()\"\n       [@arrowOpacity]=\"_getArrowViewState()\"\n       [@arrowPosition]=\"_getArrowViewState()\"\n       [@allowChildren]=\"_getArrowDirectionState()\"\n       (@arrowPosition.start)=\"_disableViewStateAnimation = true\"\n       (@arrowPosition.done)=\"_disableViewStateAnimation = false\">\n    <div class=\"mat-sort-header-stem\"></div>\n    <div class=\"mat-sort-header-indicator\" [@indicator]=\"_getArrowDirectionState()\">\n      <div class=\"mat-sort-header-pointer-left\" [@leftPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-right\" [@rightPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-middle\"></div>\n    </div>\n  </div>\n</div>\n",
                host: {
                    'class': 'mat-sort-header',
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
                styles: [".mat-sort-header-container{display:flex;cursor:pointer;align-items:center}.mat-sort-header-disabled .mat-sort-header-container{cursor:default}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-button{border:none;background:0 0;display:flex;align-items:center;padding:0;cursor:inherit;outline:0;font:inherit;color:currentColor}[mat-sort-header].cdk-keyboard-focused .mat-sort-header-button,[mat-sort-header].cdk-program-focused .mat-sort-header-button{border-bottom:solid 1px currentColor}.mat-sort-header-button::-moz-focus-inner{border:0}.mat-sort-header-arrow{height:12px;width:12px;min-width:12px;position:relative;display:flex;opacity:0}.mat-sort-header-arrow,[dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow{margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow,[dir=rtl] .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-stem{background:currentColor;height:10px;width:2px;margin:auto;display:flex;align-items:center}.cdk-high-contrast-active .mat-sort-header-stem{width:0;border-left:solid 2px}.mat-sort-header-indicator{width:100%;height:2px;display:flex;align-items:center;position:absolute;top:0;left:0}.mat-sort-header-pointer-middle{margin:auto;height:2px;width:2px;background:currentColor;transform:rotate(45deg)}.cdk-high-contrast-active .mat-sort-header-pointer-middle{width:0;height:0;border-top:solid 2px;border-left:solid 2px}.mat-sort-header-pointer-left,.mat-sort-header-pointer-right{background:currentColor;width:6px;height:2px;position:absolute;top:0}.cdk-high-contrast-active .mat-sort-header-pointer-left,.cdk-high-contrast-active .mat-sort-header-pointer-right{width:0;height:0;border-left:solid 6px;border-top:solid 2px}.mat-sort-header-pointer-left{transform-origin:right;left:0}.mat-sort-header-pointer-right{transform-origin:left;right:0}\n"]
            }] }
];
/** @nocollapse */
MatSortHeader.ctorParameters = () => [
    { type: MatSortHeaderIntl },
    { type: ChangeDetectorRef },
    { type: MatSort, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Inject, args: ['MAT_SORT_HEADER_COLUMN_DEF',] }, { type: Optional }] },
    { type: FocusMonitor },
    { type: ElementRef }
];
MatSortHeader.propDecorators = {
    id: [{ type: Input, args: ['mat-sort-header',] }],
    arrowPosition: [{ type: Input }],
    start: [{ type: Input }],
    disableClear: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MatSortHeader.ngAcceptInputType_disableClear;
    /** @type {?} */
    MatSortHeader.ngAcceptInputType_disabled;
    /**
     * @type {?}
     * @private
     */
    MatSortHeader.prototype._rerenderSubscription;
    /**
     * Flag set to true when the indicator should be displayed while the sort is not active. Used to
     * provide an affordance that the header is sortable by showing on focus and hover.
     * @type {?}
     */
    MatSortHeader.prototype._showIndicatorHint;
    /**
     * The view transition state of the arrow (translation/ opacity) - indicates its `from` and `to`
     * position through the animation. If animations are currently disabled, the fromState is removed
     * so that there is no animation displayed.
     * @type {?}
     */
    MatSortHeader.prototype._viewState;
    /**
     * The direction the arrow should be facing according to the current state.
     * @type {?}
     */
    MatSortHeader.prototype._arrowDirection;
    /**
     * Whether the view state animation should show the transition between the `from` and `to` states.
     * @type {?}
     */
    MatSortHeader.prototype._disableViewStateAnimation;
    /**
     * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
     * the column's name.
     * @type {?}
     */
    MatSortHeader.prototype.id;
    /**
     * Sets the position of the arrow that displays when sorted.
     * @type {?}
     */
    MatSortHeader.prototype.arrowPosition;
    /**
     * Overrides the sort start value of the containing MatSort for this MatSortable.
     * @type {?}
     */
    MatSortHeader.prototype.start;
    /**
     * @type {?}
     * @private
     */
    MatSortHeader.prototype._disableClear;
    /** @type {?} */
    MatSortHeader.prototype._intl;
    /** @type {?} */
    MatSortHeader.prototype._sort;
    /** @type {?} */
    MatSortHeader.prototype._columnDef;
    /**
     * @deprecated _focusMonitor and _elementRef to become required parameters.
     * \@breaking-change 10.0.0
     * @type {?}
     * @private
     */
    MatSortHeader.prototype._focusMonitor;
    /**
     * @type {?}
     * @private
     */
    MatSortHeader.prototype._elementRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc29ydC9zb3J0LWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsS0FBSyxFQUdMLFFBQVEsRUFDUixpQkFBaUIsRUFDakIsTUFBTSxFQUNOLFVBQVUsR0FDWCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQTZCLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2pGLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsS0FBSyxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxPQUFPLEVBQWMsTUFBTSxRQUFRLENBQUM7QUFDNUMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFcEQsT0FBTyxFQUFDLHdDQUF3QyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDOzs7OztBQUtyRCxNQUFNLGlCQUFpQjtDQUFHOztNQUNwQix1QkFBdUIsR0FDekIsYUFBYSxDQUFDLGlCQUFpQixDQUFDOzs7Ozs7O0FBaUJwQyw4Q0FHQzs7O0lBRkMsNkNBQTJCOztJQUMzQiwyQ0FBd0I7Ozs7OztBQUkxQixxQ0FFQzs7O0lBREMsc0NBQWE7Ozs7Ozs7Ozs7O0FBcUNmLE1BQU0sT0FBTyxhQUFjLFNBQVEsdUJBQXVCOzs7Ozs7Ozs7SUEyQ3hELFlBQW1CLEtBQXdCLEVBQy9CLGlCQUFvQyxFQUNqQixLQUFjLEVBRXRCLFVBQWtDLEVBS3JDLGFBQTRCLEVBQzVCLFdBQXFDO1FBQ3ZE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QixDQUFDLFNBQVM7b0JBQzNCLGlCQUFpQixDQUFDLFdBQVc7b0JBQzdCLGlCQUFpQixDQUFDLFlBQVk7b0JBQzlCLGlCQUFpQixDQUFDLFlBQVk7b0JBQzlCLGlCQUFpQixDQUFDLGFBQWE7b0JBQy9CLGlCQUFpQixDQUFDLGFBQWE7aUJBQ2hDOzthQUNGOzs7O1lBbkVPLGlCQUFpQjtZQWpCdkIsaUJBQWlCO1lBYVgsT0FBTyx1QkFxSEEsUUFBUTs0Q0FDUixNQUFNLFNBQUMsNEJBQTRCLGNBQUcsUUFBUTtZQXhIckQsWUFBWTtZQUhsQixVQUFVOzs7aUJBMEdULEtBQUssU0FBQyxpQkFBaUI7NEJBR3ZCLEtBQUs7b0JBR0wsS0FBSzsyQkFHTCxLQUFLOzs7O0lBc0xOLDZDQUFvRDs7SUFDcEQseUNBQWdEOzs7OztJQTNOaEQsOENBQTRDOzs7Ozs7SUFNNUMsMkNBQW9DOzs7Ozs7O0lBT3BDLG1DQUFxQzs7Ozs7SUFHckMsd0NBQW9DOzs7OztJQUtwQyxtREFBbUM7Ozs7OztJQU1uQywyQkFBcUM7Ozs7O0lBR3JDLHNDQUFxRDs7Ozs7SUFHckQsOEJBQStCOzs7OztJQU0vQixzQ0FBK0I7O0lBRW5CLDhCQUErQjs7SUFFL0IsOEJBQWlDOztJQUNqQyxtQ0FDNkM7Ozs7Ozs7SUFLN0Msc0NBQW9DOzs7OztJQUNwQyxvQ0FBNkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5qZWN0LFxuICBFbGVtZW50UmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuRGlzYWJsZSwgQ2FuRGlzYWJsZUN0b3IsIG1peGluRGlzYWJsZWR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtGb2N1c01vbml0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7bWVyZ2UsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01hdFNvcnQsIE1hdFNvcnRhYmxlfSBmcm9tICcuL3NvcnQnO1xuaW1wb3J0IHttYXRTb3J0QW5pbWF0aW9uc30gZnJvbSAnLi9zb3J0LWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtTb3J0RGlyZWN0aW9ufSBmcm9tICcuL3NvcnQtZGlyZWN0aW9uJztcbmltcG9ydCB7Z2V0U29ydEhlYWRlck5vdENvbnRhaW5lZFdpdGhpblNvcnRFcnJvcn0gZnJvbSAnLi9zb3J0LWVycm9ycyc7XG5pbXBvcnQge01hdFNvcnRIZWFkZXJJbnRsfSBmcm9tICcuL3NvcnQtaGVhZGVyLWludGwnO1xuXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gdGhlIHNvcnQgaGVhZGVyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFNvcnRIZWFkZXJCYXNlIHt9XG5jb25zdCBfTWF0U29ydEhlYWRlck1peGluQmFzZTogQ2FuRGlzYWJsZUN0b3IgJiB0eXBlb2YgTWF0U29ydEhlYWRlckJhc2UgPVxuICAgIG1peGluRGlzYWJsZWQoTWF0U29ydEhlYWRlckJhc2UpO1xuXG4vKipcbiAqIFZhbGlkIHBvc2l0aW9ucyBmb3IgdGhlIGFycm93IHRvIGJlIGluIGZvciBpdHMgb3BhY2l0eSBhbmQgdHJhbnNsYXRpb24uIElmIHRoZSBzdGF0ZSBpcyBhXG4gKiBzb3J0IGRpcmVjdGlvbiwgdGhlIHBvc2l0aW9uIG9mIHRoZSBhcnJvdyB3aWxsIGJlIGFib3ZlL2JlbG93IGFuZCBvcGFjaXR5IDAuIElmIHRoZSBzdGF0ZSBpc1xuICogaGludCwgdGhlIGFycm93IHdpbGwgYmUgaW4gdGhlIGNlbnRlciB3aXRoIGEgc2xpZ2h0IG9wYWNpdHkuIEFjdGl2ZSBzdGF0ZSBtZWFucyB0aGUgYXJyb3cgd2lsbFxuICogYmUgZnVsbHkgb3BhcXVlIGluIHRoZSBjZW50ZXIuXG4gKlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgdHlwZSBBcnJvd1ZpZXdTdGF0ZSA9IFNvcnREaXJlY3Rpb24gfCAnaGludCcgfCAnYWN0aXZlJztcblxuLyoqXG4gKiBTdGF0ZXMgZGVzY3JpYmluZyB0aGUgYXJyb3cncyBhbmltYXRlZCBwb3NpdGlvbiAoYW5pbWF0aW5nIGZyb21TdGF0ZSB0byB0b1N0YXRlKS5cbiAqIElmIHRoZSBmcm9tU3RhdGUgaXMgbm90IGRlZmluZWQsIHRoZXJlIHdpbGwgYmUgbm8gYW5pbWF0ZWQgdHJhbnNpdGlvbiB0byB0aGUgdG9TdGF0ZS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb24ge1xuICBmcm9tU3RhdGU/OiBBcnJvd1ZpZXdTdGF0ZTtcbiAgdG9TdGF0ZTogQXJyb3dWaWV3U3RhdGU7XG59XG5cbi8qKiBDb2x1bW4gZGVmaW5pdGlvbiBhc3NvY2lhdGVkIHdpdGggYSBgTWF0U29ydEhlYWRlcmAuICovXG5pbnRlcmZhY2UgTWF0U29ydEhlYWRlckNvbHVtbkRlZiB7XG4gIG5hbWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBcHBsaWVzIHNvcnRpbmcgYmVoYXZpb3IgKGNsaWNrIHRvIGNoYW5nZSBzb3J0KSBhbmQgc3R5bGVzIHRvIGFuIGVsZW1lbnQsIGluY2x1ZGluZyBhblxuICogYXJyb3cgdG8gZGlzcGxheSB0aGUgY3VycmVudCBzb3J0IGRpcmVjdGlvbi5cbiAqXG4gKiBNdXN0IGJlIHByb3ZpZGVkIHdpdGggYW4gaWQgYW5kIGNvbnRhaW5lZCB3aXRoaW4gYSBwYXJlbnQgTWF0U29ydCBkaXJlY3RpdmUuXG4gKlxuICogSWYgdXNlZCBvbiBoZWFkZXIgY2VsbHMgaW4gYSBDZGtUYWJsZSwgaXQgd2lsbCBhdXRvbWF0aWNhbGx5IGRlZmF1bHQgaXRzIGlkIGZyb20gaXRzIGNvbnRhaW5pbmdcbiAqIGNvbHVtbiBkZWZpbml0aW9uLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbWF0LXNvcnQtaGVhZGVyXScsXG4gIGV4cG9ydEFzOiAnbWF0U29ydEhlYWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnc29ydC1oZWFkZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzb3J0LWhlYWRlci5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtc29ydC1oZWFkZXInLFxuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygpJyxcbiAgICAnKG1vdXNlZW50ZXIpJzogJ19zZXRJbmRpY2F0b3JIaW50VmlzaWJsZSh0cnVlKScsXG4gICAgJyhtb3VzZWxlYXZlKSc6ICdfc2V0SW5kaWNhdG9ySGludFZpc2libGUoZmFsc2UpJyxcbiAgICAnW2F0dHIuYXJpYS1zb3J0XSc6ICdfZ2V0QXJpYVNvcnRBdHRyaWJ1dGUoKScsXG4gICAgJ1tjbGFzcy5tYXQtc29ydC1oZWFkZXItZGlzYWJsZWRdJzogJ19pc0Rpc2FibGVkKCknLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5pbmRpY2F0b3IsXG4gICAgbWF0U29ydEFuaW1hdGlvbnMubGVmdFBvaW50ZXIsXG4gICAgbWF0U29ydEFuaW1hdGlvbnMucmlnaHRQb2ludGVyLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmFycm93T3BhY2l0eSxcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5hcnJvd1Bvc2l0aW9uLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmFsbG93Q2hpbGRyZW4sXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTWF0U29ydEhlYWRlciBleHRlbmRzIF9NYXRTb3J0SGVhZGVyTWl4aW5CYXNlXG4gICAgaW1wbGVtZW50cyBDYW5EaXNhYmxlLCBNYXRTb3J0YWJsZSwgT25EZXN0cm95LCBPbkluaXQge1xuICBwcml2YXRlIF9yZXJlbmRlclN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKlxuICAgKiBGbGFnIHNldCB0byB0cnVlIHdoZW4gdGhlIGluZGljYXRvciBzaG91bGQgYmUgZGlzcGxheWVkIHdoaWxlIHRoZSBzb3J0IGlzIG5vdCBhY3RpdmUuIFVzZWQgdG9cbiAgICogcHJvdmlkZSBhbiBhZmZvcmRhbmNlIHRoYXQgdGhlIGhlYWRlciBpcyBzb3J0YWJsZSBieSBzaG93aW5nIG9uIGZvY3VzIGFuZCBob3Zlci5cbiAgICovXG4gIF9zaG93SW5kaWNhdG9ySGludDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGUgdmlldyB0cmFuc2l0aW9uIHN0YXRlIG9mIHRoZSBhcnJvdyAodHJhbnNsYXRpb24vIG9wYWNpdHkpIC0gaW5kaWNhdGVzIGl0cyBgZnJvbWAgYW5kIGB0b2BcbiAgICogcG9zaXRpb24gdGhyb3VnaCB0aGUgYW5pbWF0aW9uLiBJZiBhbmltYXRpb25zIGFyZSBjdXJyZW50bHkgZGlzYWJsZWQsIHRoZSBmcm9tU3RhdGUgaXMgcmVtb3ZlZFxuICAgKiBzbyB0aGF0IHRoZXJlIGlzIG5vIGFuaW1hdGlvbiBkaXNwbGF5ZWQuXG4gICAqL1xuICBfdmlld1N0YXRlOiBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb247XG5cbiAgLyoqIFRoZSBkaXJlY3Rpb24gdGhlIGFycm93IHNob3VsZCBiZSBmYWNpbmcgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLiAqL1xuICBfYXJyb3dEaXJlY3Rpb246IFNvcnREaXJlY3Rpb24gPSAnJztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgdmlldyBzdGF0ZSBhbmltYXRpb24gc2hvdWxkIHNob3cgdGhlIHRyYW5zaXRpb24gYmV0d2VlbiB0aGUgYGZyb21gIGFuZCBgdG9gIHN0YXRlcy5cbiAgICovXG4gIF9kaXNhYmxlVmlld1N0YXRlQW5pbWF0aW9uID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIElEIG9mIHRoaXMgc29ydCBoZWFkZXIuIElmIHVzZWQgd2l0aGluIHRoZSBjb250ZXh0IG9mIGEgQ2RrQ29sdW1uRGVmLCB0aGlzIHdpbGwgZGVmYXVsdCB0b1xuICAgKiB0aGUgY29sdW1uJ3MgbmFtZS5cbiAgICovXG4gIEBJbnB1dCgnbWF0LXNvcnQtaGVhZGVyJykgaWQ6IHN0cmluZztcblxuICAvKiogU2V0cyB0aGUgcG9zaXRpb24gb2YgdGhlIGFycm93IHRoYXQgZGlzcGxheXMgd2hlbiBzb3J0ZWQuICovXG4gIEBJbnB1dCgpIGFycm93UG9zaXRpb246ICdiZWZvcmUnIHwgJ2FmdGVyJyA9ICdhZnRlcic7XG5cbiAgLyoqIE92ZXJyaWRlcyB0aGUgc29ydCBzdGFydCB2YWx1ZSBvZiB0aGUgY29udGFpbmluZyBNYXRTb3J0IGZvciB0aGlzIE1hdFNvcnRhYmxlLiAqL1xuICBASW5wdXQoKSBzdGFydDogJ2FzYycgfCAnZGVzYyc7XG5cbiAgLyoqIE92ZXJyaWRlcyB0aGUgZGlzYWJsZSBjbGVhciB2YWx1ZSBvZiB0aGUgY29udGFpbmluZyBNYXRTb3J0IGZvciB0aGlzIE1hdFNvcnRhYmxlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZUNsZWFyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZUNsZWFyOyB9XG4gIHNldCBkaXNhYmxlQ2xlYXIodikgeyB0aGlzLl9kaXNhYmxlQ2xlYXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodik7IH1cbiAgcHJpdmF0ZSBfZGlzYWJsZUNsZWFyOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfaW50bDogTWF0U29ydEhlYWRlckludGwsXG4gICAgICAgICAgICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHVibGljIF9zb3J0OiBNYXRTb3J0LFxuICAgICAgICAgICAgICBASW5qZWN0KCdNQVRfU09SVF9IRUFERVJfQ09MVU1OX0RFRicpIEBPcHRpb25hbCgpXG4gICAgICAgICAgICAgICAgICBwdWJsaWMgX2NvbHVtbkRlZjogTWF0U29ydEhlYWRlckNvbHVtbkRlZixcbiAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAqIEBkZXByZWNhdGVkIF9mb2N1c01vbml0b3IgYW5kIF9lbGVtZW50UmVmIHRvIGJlY29tZSByZXF1aXJlZCBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yPzogRm9jdXNNb25pdG9yLFxuICAgICAgICAgICAgICBwcml2YXRlIF9lbGVtZW50UmVmPzogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgdXNlIGEgc3RyaW5nIHRva2VuIGZvciB0aGUgYF9jb2x1bW5EZWZgLCBiZWNhdXNlIHRoZSB2YWx1ZSBpcyBwcm92aWRlZCBib3RoIGJ5XG4gICAgLy8gYG1hdGVyaWFsL3RhYmxlYCBhbmQgYGNkay90YWJsZWAgYW5kIHdlIGNhbid0IGhhdmUgdGhlIENESyBkZXBlbmRpbmcgb24gTWF0ZXJpYWwsXG4gICAgLy8gYW5kIHdlIHdhbnQgdG8gYXZvaWQgaGF2aW5nIHRoZSBzb3J0IGhlYWRlciBkZXBlbmRpbmcgb24gdGhlIENESyB0YWJsZSBiZWNhdXNlXG4gICAgLy8gb2YgdGhpcyBzaW5nbGUgcmVmZXJlbmNlLlxuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoIV9zb3J0KSB7XG4gICAgICB0aHJvdyBnZXRTb3J0SGVhZGVyTm90Q29udGFpbmVkV2l0aGluU29ydEVycm9yKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVyZW5kZXJTdWJzY3JpcHRpb24gPSBtZXJnZShfc29ydC5zb3J0Q2hhbmdlLCBfc29ydC5fc3RhdGVDaGFuZ2VzLCBfaW50bC5jaGFuZ2VzKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5faXNTb3J0ZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQXJyb3dEaXJlY3Rpb24oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGlzIGhlYWRlciB3YXMgcmVjZW50bHkgYWN0aXZlIGFuZCBub3cgbm8gbG9uZ2VyIHNvcnRlZCwgYW5pbWF0ZSBhd2F5IHRoZSBhcnJvdy5cbiAgICAgICAgICBpZiAoIXRoaXMuX2lzU29ydGVkKCkgJiYgdGhpcy5fdmlld1N0YXRlICYmIHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID09PSAnYWN0aXZlJykge1xuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6ICdhY3RpdmUnLCB0b1N0YXRlOiB0aGlzLl9hcnJvd0RpcmVjdGlvbn0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KTtcblxuICAgIGlmIChfZm9jdXNNb25pdG9yICYmIF9lbGVtZW50UmVmKSB7XG4gICAgICAvLyBXZSB1c2UgdGhlIGZvY3VzIG1vbml0b3IgYmVjYXVzZSB3ZSBhbHNvIHdhbnQgdG8gc3R5bGVcbiAgICAgIC8vIHRoaW5ncyBkaWZmZXJlbnRseSBiYXNlZCBvbiB0aGUgZm9jdXMgb3JpZ2luLlxuICAgICAgX2ZvY3VzTW9uaXRvci5tb25pdG9yKF9lbGVtZW50UmVmLCB0cnVlKVxuICAgICAgICAgIC5zdWJzY3JpYmUob3JpZ2luID0+IHRoaXMuX3NldEluZGljYXRvckhpbnRWaXNpYmxlKCEhb3JpZ2luKSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLmlkICYmIHRoaXMuX2NvbHVtbkRlZikge1xuICAgICAgdGhpcy5pZCA9IHRoaXMuX2NvbHVtbkRlZi5uYW1lO1xuICAgIH1cblxuICAgIC8vIEluaXRpYWxpemUgdGhlIGRpcmVjdGlvbiBvZiB0aGUgYXJyb3cgYW5kIHNldCB0aGUgdmlldyBzdGF0ZSB0byBiZSBpbW1lZGlhdGVseSB0aGF0IHN0YXRlLlxuICAgIHRoaXMuX3VwZGF0ZUFycm93RGlyZWN0aW9uKCk7XG4gICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKFxuICAgICAgICB7dG9TdGF0ZTogdGhpcy5faXNTb3J0ZWQoKSA/ICdhY3RpdmUnIDogdGhpcy5fYXJyb3dEaXJlY3Rpb259KTtcblxuICAgIHRoaXMuX3NvcnQucmVnaXN0ZXIodGhpcyk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMCBSZW1vdmUgbnVsbCBjaGVjayBmb3IgX2ZvY3VzTW9uaXRvciBhbmQgX2VsZW1lbnRSZWYuXG4gICAgaWYgKHRoaXMuX2ZvY3VzTW9uaXRvciAmJiB0aGlzLl9lbGVtZW50UmVmKSB7XG4gICAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgfVxuXG4gICAgdGhpcy5fc29ydC5kZXJlZ2lzdGVyKHRoaXMpO1xuICAgIHRoaXMuX3JlcmVuZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgXCJoaW50XCIgc3RhdGUgc3VjaCB0aGF0IHRoZSBhcnJvdyB3aWxsIGJlIHNlbWktdHJhbnNwYXJlbnRseSBkaXNwbGF5ZWQgYXMgYSBoaW50IHRvIHRoZVxuICAgKiB1c2VyIHNob3dpbmcgd2hhdCB0aGUgYWN0aXZlIHNvcnQgd2lsbCBiZWNvbWUuIElmIHNldCB0byBmYWxzZSwgdGhlIGFycm93IHdpbGwgZmFkZSBhd2F5LlxuICAgKi9cbiAgX3NldEluZGljYXRvckhpbnRWaXNpYmxlKHZpc2libGU6IGJvb2xlYW4pIHtcbiAgICAvLyBOby1vcCBpZiB0aGUgc29ydCBoZWFkZXIgaXMgZGlzYWJsZWQgLSBzaG91bGQgbm90IG1ha2UgdGhlIGhpbnQgdmlzaWJsZS5cbiAgICBpZiAodGhpcy5faXNEaXNhYmxlZCgpICYmIHZpc2libGUpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9zaG93SW5kaWNhdG9ySGludCA9IHZpc2libGU7XG5cbiAgICBpZiAoIXRoaXMuX2lzU29ydGVkKCkpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUFycm93RGlyZWN0aW9uKCk7XG4gICAgICBpZiAodGhpcy5fc2hvd0luZGljYXRvckhpbnQpIHtcbiAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9uLCB0b1N0YXRlOiAnaGludCd9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh7ZnJvbVN0YXRlOiAnaGludCcsIHRvU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9ufSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGFuaW1hdGlvbiB0cmFuc2l0aW9uIHZpZXcgc3RhdGUgZm9yIHRoZSBhcnJvdydzIHBvc2l0aW9uIGFuZCBvcGFjaXR5LiBJZiB0aGVcbiAgICogYGRpc2FibGVWaWV3U3RhdGVBbmltYXRpb25gIGZsYWcgaXMgc2V0IHRvIHRydWUsIHRoZSBgZnJvbVN0YXRlYCB3aWxsIGJlIGlnbm9yZWQgc28gdGhhdFxuICAgKiBubyBhbmltYXRpb24gYXBwZWFycy5cbiAgICovXG4gIF9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUodmlld1N0YXRlOiBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb24pIHtcbiAgICB0aGlzLl92aWV3U3RhdGUgPSB2aWV3U3RhdGU7XG5cbiAgICAvLyBJZiB0aGUgYW5pbWF0aW9uIGZvciBhcnJvdyBwb3NpdGlvbiBzdGF0ZSAob3BhY2l0eS90cmFuc2xhdGlvbikgc2hvdWxkIGJlIGRpc2FibGVkLFxuICAgIC8vIHJlbW92ZSB0aGUgZnJvbVN0YXRlIHNvIHRoYXQgaXQganVtcHMgcmlnaHQgdG8gdGhlIHRvU3RhdGUuXG4gICAgaWYgKHRoaXMuX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24pIHtcbiAgICAgIHRoaXMuX3ZpZXdTdGF0ZSA9IHt0b1N0YXRlOiB2aWV3U3RhdGUudG9TdGF0ZX07XG4gICAgfVxuICB9XG5cbiAgLyoqIFRyaWdnZXJzIHRoZSBzb3J0IG9uIHRoaXMgc29ydCBoZWFkZXIgYW5kIHJlbW92ZXMgdGhlIGluZGljYXRvciBoaW50LiAqL1xuICBfaGFuZGxlQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMuX2lzRGlzYWJsZWQoKSkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX3NvcnQuc29ydCh0aGlzKTtcblxuICAgIC8vIERvIG5vdCBzaG93IHRoZSBhbmltYXRpb24gaWYgdGhlIGhlYWRlciB3YXMgYWxyZWFkeSBzaG93biBpbiB0aGUgcmlnaHQgcG9zaXRpb24uXG4gICAgaWYgKHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID09PSAnaGludCcgfHwgdGhpcy5fdmlld1N0YXRlLnRvU3RhdGUgPT09ICdhY3RpdmUnKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlVmlld1N0YXRlQW5pbWF0aW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgYXJyb3cgaXMgbm93IHNvcnRlZCwgYW5pbWF0ZSB0aGUgYXJyb3cgaW50byBwbGFjZS4gT3RoZXJ3aXNlLCBhbmltYXRlIGl0IGF3YXkgaW50b1xuICAgIC8vIHRoZSBkaXJlY3Rpb24gaXQgaXMgZmFjaW5nLlxuICAgIGNvbnN0IHZpZXdTdGF0ZTogQXJyb3dWaWV3U3RhdGVUcmFuc2l0aW9uID0gdGhpcy5faXNTb3J0ZWQoKSA/XG4gICAgICAgIHtmcm9tU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9uLCB0b1N0YXRlOiAnYWN0aXZlJ30gOlxuICAgICAgICB7ZnJvbVN0YXRlOiAnYWN0aXZlJywgdG9TdGF0ZTogdGhpcy5fYXJyb3dEaXJlY3Rpb259O1xuICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh2aWV3U3RhdGUpO1xuXG4gICAgdGhpcy5fc2hvd0luZGljYXRvckhpbnQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgTWF0U29ydEhlYWRlciBpcyBjdXJyZW50bHkgc29ydGVkIGluIGVpdGhlciBhc2NlbmRpbmcgb3IgZGVzY2VuZGluZyBvcmRlci4gKi9cbiAgX2lzU29ydGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9zb3J0LmFjdGl2ZSA9PSB0aGlzLmlkICYmXG4gICAgICAgICh0aGlzLl9zb3J0LmRpcmVjdGlvbiA9PT0gJ2FzYycgfHwgdGhpcy5fc29ydC5kaXJlY3Rpb24gPT09ICdkZXNjJyk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgYW5pbWF0aW9uIHN0YXRlIGZvciB0aGUgYXJyb3cgZGlyZWN0aW9uIChpbmRpY2F0b3IgYW5kIHBvaW50ZXJzKS4gKi9cbiAgX2dldEFycm93RGlyZWN0aW9uU3RhdGUoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuX2lzU29ydGVkKCkgPyAnYWN0aXZlLScgOiAnJ30ke3RoaXMuX2Fycm93RGlyZWN0aW9ufWA7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgYXJyb3cgcG9zaXRpb24gc3RhdGUgKG9wYWNpdHksIHRyYW5zbGF0aW9uKS4gKi9cbiAgX2dldEFycm93Vmlld1N0YXRlKCkge1xuICAgIGNvbnN0IGZyb21TdGF0ZSA9IHRoaXMuX3ZpZXdTdGF0ZS5mcm9tU3RhdGU7XG4gICAgcmV0dXJuIChmcm9tU3RhdGUgPyBgJHtmcm9tU3RhdGV9LXRvLWAgOiAnJykgKyB0aGlzLl92aWV3U3RhdGUudG9TdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBkaXJlY3Rpb24gdGhlIGFycm93IHNob3VsZCBiZSBwb2ludGluZy4gSWYgaXQgaXMgbm90IHNvcnRlZCwgdGhlIGFycm93IHNob3VsZCBiZVxuICAgKiBmYWNpbmcgdGhlIHN0YXJ0IGRpcmVjdGlvbi4gT3RoZXJ3aXNlIGlmIGl0IGlzIHNvcnRlZCwgdGhlIGFycm93IHNob3VsZCBwb2ludCBpbiB0aGUgY3VycmVudGx5XG4gICAqIGFjdGl2ZSBzb3J0ZWQgZGlyZWN0aW9uLiBUaGUgcmVhc29uIHRoaXMgaXMgdXBkYXRlZCB0aHJvdWdoIGEgZnVuY3Rpb24gaXMgYmVjYXVzZSB0aGUgZGlyZWN0aW9uXG4gICAqIHNob3VsZCBvbmx5IGJlIGNoYW5nZWQgYXQgc3BlY2lmaWMgdGltZXMgLSB3aGVuIGRlYWN0aXZhdGVkIGJ1dCB0aGUgaGludCBpcyBkaXNwbGF5ZWQgYW5kIHdoZW5cbiAgICogdGhlIHNvcnQgaXMgYWN0aXZlIGFuZCB0aGUgZGlyZWN0aW9uIGNoYW5nZXMuIE90aGVyd2lzZSB0aGUgYXJyb3cncyBkaXJlY3Rpb24gc2hvdWxkIGxpbmdlclxuICAgKiBpbiBjYXNlcyBzdWNoIGFzIHRoZSBzb3J0IGJlY29taW5nIGRlYWN0aXZhdGVkIGJ1dCB3ZSB3YW50IHRvIGFuaW1hdGUgdGhlIGFycm93IGF3YXkgd2hpbGVcbiAgICogcHJlc2VydmluZyBpdHMgZGlyZWN0aW9uLCBldmVuIHRob3VnaCB0aGUgbmV4dCBzb3J0IGRpcmVjdGlvbiBpcyBhY3R1YWxseSBkaWZmZXJlbnQgYW5kIHNob3VsZFxuICAgKiBvbmx5IGJlIGNoYW5nZWQgb25jZSB0aGUgYXJyb3cgZGlzcGxheXMgYWdhaW4gKGhpbnQgb3IgYWN0aXZhdGlvbikuXG4gICAqL1xuICBfdXBkYXRlQXJyb3dEaXJlY3Rpb24oKSB7XG4gICAgdGhpcy5fYXJyb3dEaXJlY3Rpb24gPSB0aGlzLl9pc1NvcnRlZCgpID9cbiAgICAgICAgdGhpcy5fc29ydC5kaXJlY3Rpb24gOlxuICAgICAgICAodGhpcy5zdGFydCB8fCB0aGlzLl9zb3J0LnN0YXJ0KTtcbiAgfVxuXG4gIF9pc0Rpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9zb3J0LmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgYXJpYS1zb3J0IGF0dHJpYnV0ZSB0aGF0IHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoaXMgc29ydCBoZWFkZXIuIElmIHRoaXMgaGVhZGVyXG4gICAqIGlzIG5vdCBzb3J0ZWQsIHJldHVybnMgbnVsbCBzbyB0aGF0IHRoZSBhdHRyaWJ1dGUgaXMgcmVtb3ZlZCBmcm9tIHRoZSBob3N0IGVsZW1lbnQuIEFyaWEgc3BlY1xuICAgKiBzYXlzIHRoYXQgdGhlIGFyaWEtc29ydCBwcm9wZXJ0eSBzaG91bGQgb25seSBiZSBwcmVzZW50IG9uIG9uZSBoZWFkZXIgYXQgYSB0aW1lLCBzbyByZW1vdmluZ1xuICAgKiBlbnN1cmVzIHRoaXMgaXMgdHJ1ZS5cbiAgICovXG4gIF9nZXRBcmlhU29ydEF0dHJpYnV0ZSgpIHtcbiAgICBpZiAoIXRoaXMuX2lzU29ydGVkKCkpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIHJldHVybiB0aGlzLl9zb3J0LmRpcmVjdGlvbiA9PSAnYXNjJyA/ICdhc2NlbmRpbmcnIDogJ2Rlc2NlbmRpbmcnO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFycm93IGluc2lkZSB0aGUgc29ydCBoZWFkZXIgc2hvdWxkIGJlIHJlbmRlcmVkLiAqL1xuICBfcmVuZGVyQXJyb3coKSB7XG4gICAgcmV0dXJuICF0aGlzLl9pc0Rpc2FibGVkKCkgfHwgdGhpcy5faXNTb3J0ZWQoKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlQ2xlYXI6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=