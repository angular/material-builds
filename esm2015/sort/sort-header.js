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
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { merge } from 'rxjs';
import { MatSort } from './sort';
import { matSortAnimations } from './sort-animations';
import { getSortHeaderNotContainedWithinSortError } from './sort-errors';
import { MatSortHeaderIntl } from './sort-header-intl';
// Boilerplate for applying mixins to the sort header.
/** @docs-private */
class MatSortHeaderBase {
}
const _MatSortHeaderMixinBase = mixinDisabled(MatSortHeaderBase);
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
        /** The direction the arrow should be facing according to the current state. */
        this._arrowDirection = '';
        /**
         * Whether the view state animation should show the transition between the `from` and `to` states.
         */
        this._disableViewStateAnimation = false;
        /** Sets the position of the arrow that displays when sorted. */
        this.arrowPosition = 'after';
        if (!_sort) {
            throw getSortHeaderNotContainedWithinSortError();
        }
        this._rerenderSubscription = merge(_sort.sortChange, _sort._stateChanges, _intl.changes)
            .subscribe(() => {
            if (this._isSorted()) {
                this._updateArrowDirection();
            }
            // If this header was recently active and now no longer sorted, animate away the arrow.
            if (!this._isSorted() && this._viewState && this._viewState.toState === 'active') {
                this._disableViewStateAnimation = false;
                this._setAnimationTransitionState({ fromState: 'active', toState: this._arrowDirection });
            }
            changeDetectorRef.markForCheck();
        });
    }
    /** Overrides the disable clear value of the containing MatSort for this MatSortable. */
    get disableClear() { return this._disableClear; }
    set disableClear(v) { this._disableClear = coerceBooleanProperty(v); }
    ngOnInit() {
        if (!this.id && this._columnDef) {
            this.id = this._columnDef.name;
        }
        // Initialize the direction of the arrow and set the view state to be immediately that state.
        this._updateArrowDirection();
        this._setAnimationTransitionState({ toState: this._isSorted() ? 'active' : this._arrowDirection });
        this._sort.register(this);
    }
    ngAfterViewInit() {
        // We use the focus monitor because we also want to style
        // things differently based on the focus origin.
        this._focusMonitor.monitor(this._elementRef, true)
            .subscribe(origin => this._setIndicatorHintVisible(!!origin));
    }
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
        this._sort.deregister(this);
        this._rerenderSubscription.unsubscribe();
    }
    /**
     * Sets the "hint" state such that the arrow will be semi-transparently displayed as a hint to the
     * user showing what the active sort will become. If set to false, the arrow will fade away.
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
     */
    _setAnimationTransitionState(viewState) {
        this._viewState = viewState;
        // If the animation for arrow position state (opacity/translation) should be disabled,
        // remove the fromState so that it jumps right to the toState.
        if (this._disableViewStateAnimation) {
            this._viewState = { toState: viewState.toState };
        }
    }
    /** Triggers the sort on this sort header and removes the indicator hint. */
    _toggleOnInteraction() {
        this._sort.sort(this);
        // Do not show the animation if the header was already shown in the right position.
        if (this._viewState.toState === 'hint' || this._viewState.toState === 'active') {
            this._disableViewStateAnimation = true;
        }
        // If the arrow is now sorted, animate the arrow into place. Otherwise, animate it away into
        // the direction it is facing.
        const viewState = this._isSorted() ?
            { fromState: this._arrowDirection, toState: 'active' } :
            { fromState: 'active', toState: this._arrowDirection };
        this._setAnimationTransitionState(viewState);
        this._showIndicatorHint = false;
    }
    _handleClick() {
        if (!this._isDisabled()) {
            this._toggleOnInteraction();
        }
    }
    _handleKeydown(event) {
        if (!this._isDisabled() && (event.keyCode === SPACE || event.keyCode === ENTER)) {
            event.preventDefault();
            this._toggleOnInteraction();
        }
    }
    /** Whether this MatSortHeader is currently sorted in either ascending or descending order. */
    _isSorted() {
        return this._sort.active == this.id &&
            (this._sort.direction === 'asc' || this._sort.direction === 'desc');
    }
    /** Returns the animation state for the arrow direction (indicator and pointers). */
    _getArrowDirectionState() {
        return `${this._isSorted() ? 'active-' : ''}${this._arrowDirection}`;
    }
    /** Returns the arrow position state (opacity, translation). */
    _getArrowViewState() {
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
     */
    _updateArrowDirection() {
        this._arrowDirection = this._isSorted() ?
            this._sort.direction :
            (this.start || this._sort.start);
    }
    _isDisabled() {
        return this._sort.disabled || this.disabled;
    }
    /**
     * Gets the aria-sort attribute that should be applied to this sort header. If this header
     * is not sorted, returns null so that the attribute is removed from the host element. Aria spec
     * says that the aria-sort property should only be present on one header at a time, so removing
     * ensures this is true.
     */
    _getAriaSortAttribute() {
        if (!this._isSorted()) {
            return 'none';
        }
        return this._sort.direction == 'asc' ? 'ascending' : 'descending';
    }
    /** Whether the arrow inside the sort header should be rendered. */
    _renderArrow() {
        return !this._isDisabled() || this._isSorted();
    }
}
MatSortHeader.decorators = [
    { type: Component, args: [{
                selector: '[mat-sort-header]',
                exportAs: 'matSortHeader',
                template: "<!--\n  We set the `tabindex` on an element inside the table header, rather than the header itself,\n  because of a bug in NVDA where having a `tabindex` on a `th` breaks keyboard navigation in the\n  table (see https://github.com/nvaccess/nvda/issues/7718). This allows for the header to both\n  be focusable, and have screen readers read out its `aria-sort` state. We prefer this approach\n  over having a button with an `aria-label` inside the header, because the button's `aria-label`\n  will be read out as the user is navigating the table's cell (see #13012).\n\n  The approach is based off of: https://dequeuniversity.com/library/aria/tables/sf-sortable-grid\n-->\n<div class=\"mat-sort-header-container mat-focus-indicator\"\n     [class.mat-sort-header-sorted]=\"_isSorted()\"\n     [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\"\n     [attr.tabindex]=\"_isDisabled() ? null : 0\"\n     role=\"button\">\n\n  <!--\n    TODO(crisbeto): this div isn't strictly necessary, but we have to keep it due to a large\n    number of screenshot diff failures. It should be removed eventually. Note that the difference\n    isn't visible with a shorter header, but once it breaks up into multiple lines, this element\n    causes it to be center-aligned, whereas removing it will keep the text to the left.\n  -->\n  <div class=\"mat-sort-header-content\">\n    <ng-content></ng-content>\n  </div>\n\n  <!-- Disable animations while a current animation is running -->\n  <div class=\"mat-sort-header-arrow\"\n       *ngIf=\"_renderArrow()\"\n       [@arrowOpacity]=\"_getArrowViewState()\"\n       [@arrowPosition]=\"_getArrowViewState()\"\n       [@allowChildren]=\"_getArrowDirectionState()\"\n       (@arrowPosition.start)=\"_disableViewStateAnimation = true\"\n       (@arrowPosition.done)=\"_disableViewStateAnimation = false\">\n    <div class=\"mat-sort-header-stem\"></div>\n    <div class=\"mat-sort-header-indicator\" [@indicator]=\"_getArrowDirectionState()\">\n      <div class=\"mat-sort-header-pointer-left\" [@leftPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-right\" [@rightPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-middle\"></div>\n    </div>\n  </div>\n</div>\n",
                host: {
                    'class': 'mat-sort-header',
                    '(click)': '_handleClick()',
                    '(keydown)': '_handleKeydown($event)',
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
                styles: [".mat-sort-header-container{display:flex;cursor:pointer;align-items:center;letter-spacing:normal;outline:0}[mat-sort-header].cdk-keyboard-focused .mat-sort-header-container,[mat-sort-header].cdk-program-focused .mat-sort-header-container{border-bottom:solid 1px currentColor}.mat-sort-header-disabled .mat-sort-header-container{cursor:default}.mat-sort-header-content{text-align:center;display:flex;align-items:center}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-arrow{height:12px;width:12px;min-width:12px;position:relative;display:flex;opacity:0}.mat-sort-header-arrow,[dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow{margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow,[dir=rtl] .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-stem{background:currentColor;height:10px;width:2px;margin:auto;display:flex;align-items:center}.cdk-high-contrast-active .mat-sort-header-stem{width:0;border-left:solid 2px}.mat-sort-header-indicator{width:100%;height:2px;display:flex;align-items:center;position:absolute;top:0;left:0}.mat-sort-header-pointer-middle{margin:auto;height:2px;width:2px;background:currentColor;transform:rotate(45deg)}.cdk-high-contrast-active .mat-sort-header-pointer-middle{width:0;height:0;border-top:solid 2px;border-left:solid 2px}.mat-sort-header-pointer-left,.mat-sort-header-pointer-right{background:currentColor;width:6px;height:2px;position:absolute;top:0}.cdk-high-contrast-active .mat-sort-header-pointer-left,.cdk-high-contrast-active .mat-sort-header-pointer-right{width:0;height:0;border-left:solid 6px;border-top:solid 2px}.mat-sort-header-pointer-left{transform-origin:right;left:0}.mat-sort-header-pointer-right{transform-origin:left;right:0}\n"]
            },] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc29ydC9zb3J0LWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsS0FBSyxFQUdMLFFBQVEsRUFDUixpQkFBaUIsRUFDakIsTUFBTSxFQUNOLFVBQVUsR0FFWCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQTZCLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2pGLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFBQyxLQUFLLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLE9BQU8sRUFBYyxNQUFNLFFBQVEsQ0FBQztBQUM1QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVwRCxPQUFPLEVBQUMsd0NBQXdDLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHckQsc0RBQXNEO0FBQ3RELG9CQUFvQjtBQUNwQixNQUFNLGlCQUFpQjtDQUFHO0FBQzFCLE1BQU0sdUJBQXVCLEdBQ3pCLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBMkJyQzs7Ozs7Ozs7R0FRRztBQTJCSCxNQUFNLE9BQU8sYUFBYyxTQUFRLHVCQUF1QjtJQTJDeEQsWUFBbUIsS0FBd0IsRUFDL0IsaUJBQW9DLEVBQ2pCLEtBQWMsRUFFdEIsVUFBa0MsRUFDckMsYUFBMkIsRUFDM0Is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QUFRLEVBQUUsbUJBQW1CO2dCQUM3QixRQUFRLEVBQUUsZUFBZTtnQkFDekIsOHZFQUErQjtnQkFFL0IsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFNBQVMsRUFBRSxnQkFBZ0I7b0JBQzNCLFdBQVcsRUFBRSx3QkFBd0I7b0JBQ3JDLGNBQWMsRUFBRSxnQ0FBZ0M7b0JBQ2hELGNBQWMsRUFBRSxpQ0FBaUM7b0JBQ2pELGtCQUFrQixFQUFFLHlCQUF5QjtvQkFDN0Msa0NBQWtDLEVBQUUsZUFBZTtpQkFDcEQ7Z0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ3BCLFVBQVUsRUFBRTtvQkFDVixpQkFBaUIsQ0FBQyxTQUFTO29CQUMzQixpQkFBaUIsQ0FBQyxXQUFXO29CQUM3QixpQkFBaUIsQ0FBQyxZQUFZO29CQUM5QixpQkFBaUIsQ0FBQyxZQUFZO29CQUM5QixpQkFBaUIsQ0FBQyxhQUFhO29CQUMvQixpQkFBaUIsQ0FBQyxhQUFhO2lCQUNoQzs7YUFDRjs7O1lBcEVPLGlCQUFpQjtZQW5CdkIsaUJBQWlCO1lBZVgsT0FBTyx1QkFzSEEsUUFBUTs0Q0FDUixNQUFNLFNBQUMsNEJBQTRCLGNBQUcsUUFBUTtZQTFIckQsWUFBWTtZQUpsQixVQUFVOzs7aUJBNkdULEtBQUssU0FBQyxpQkFBaUI7NEJBR3ZCLEtBQUs7b0JBR0wsS0FBSzsyQkFHTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEluamVjdCxcbiAgRWxlbWVudFJlZixcbiAgQWZ0ZXJWaWV3SW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkRpc2FibGUsIENhbkRpc2FibGVDdG9yLCBtaXhpbkRpc2FibGVkfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Rm9jdXNNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0VOVEVSLCBTUEFDRX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7bWVyZ2UsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01hdFNvcnQsIE1hdFNvcnRhYmxlfSBmcm9tICcuL3NvcnQnO1xuaW1wb3J0IHttYXRTb3J0QW5pbWF0aW9uc30gZnJvbSAnLi9zb3J0LWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtTb3J0RGlyZWN0aW9ufSBmcm9tICcuL3NvcnQtZGlyZWN0aW9uJztcbmltcG9ydCB7Z2V0U29ydEhlYWRlck5vdENvbnRhaW5lZFdpdGhpblNvcnRFcnJvcn0gZnJvbSAnLi9zb3J0LWVycm9ycyc7XG5pbXBvcnQge01hdFNvcnRIZWFkZXJJbnRsfSBmcm9tICcuL3NvcnQtaGVhZGVyLWludGwnO1xuXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gdGhlIHNvcnQgaGVhZGVyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFNvcnRIZWFkZXJCYXNlIHt9XG5jb25zdCBfTWF0U29ydEhlYWRlck1peGluQmFzZTogQ2FuRGlzYWJsZUN0b3IgJiB0eXBlb2YgTWF0U29ydEhlYWRlckJhc2UgPVxuICAgIG1peGluRGlzYWJsZWQoTWF0U29ydEhlYWRlckJhc2UpO1xuXG4vKipcbiAqIFZhbGlkIHBvc2l0aW9ucyBmb3IgdGhlIGFycm93IHRvIGJlIGluIGZvciBpdHMgb3BhY2l0eSBhbmQgdHJhbnNsYXRpb24uIElmIHRoZSBzdGF0ZSBpcyBhXG4gKiBzb3J0IGRpcmVjdGlvbiwgdGhlIHBvc2l0aW9uIG9mIHRoZSBhcnJvdyB3aWxsIGJlIGFib3ZlL2JlbG93IGFuZCBvcGFjaXR5IDAuIElmIHRoZSBzdGF0ZSBpc1xuICogaGludCwgdGhlIGFycm93IHdpbGwgYmUgaW4gdGhlIGNlbnRlciB3aXRoIGEgc2xpZ2h0IG9wYWNpdHkuIEFjdGl2ZSBzdGF0ZSBtZWFucyB0aGUgYXJyb3cgd2lsbFxuICogYmUgZnVsbHkgb3BhcXVlIGluIHRoZSBjZW50ZXIuXG4gKlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgdHlwZSBBcnJvd1ZpZXdTdGF0ZSA9IFNvcnREaXJlY3Rpb24gfCAnaGludCcgfCAnYWN0aXZlJztcblxuLyoqXG4gKiBTdGF0ZXMgZGVzY3JpYmluZyB0aGUgYXJyb3cncyBhbmltYXRlZCBwb3NpdGlvbiAoYW5pbWF0aW5nIGZyb21TdGF0ZSB0byB0b1N0YXRlKS5cbiAqIElmIHRoZSBmcm9tU3RhdGUgaXMgbm90IGRlZmluZWQsIHRoZXJlIHdpbGwgYmUgbm8gYW5pbWF0ZWQgdHJhbnNpdGlvbiB0byB0aGUgdG9TdGF0ZS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb24ge1xuICBmcm9tU3RhdGU/OiBBcnJvd1ZpZXdTdGF0ZTtcbiAgdG9TdGF0ZTogQXJyb3dWaWV3U3RhdGU7XG59XG5cbi8qKiBDb2x1bW4gZGVmaW5pdGlvbiBhc3NvY2lhdGVkIHdpdGggYSBgTWF0U29ydEhlYWRlcmAuICovXG5pbnRlcmZhY2UgTWF0U29ydEhlYWRlckNvbHVtbkRlZiB7XG4gIG5hbWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBcHBsaWVzIHNvcnRpbmcgYmVoYXZpb3IgKGNsaWNrIHRvIGNoYW5nZSBzb3J0KSBhbmQgc3R5bGVzIHRvIGFuIGVsZW1lbnQsIGluY2x1ZGluZyBhblxuICogYXJyb3cgdG8gZGlzcGxheSB0aGUgY3VycmVudCBzb3J0IGRpcmVjdGlvbi5cbiAqXG4gKiBNdXN0IGJlIHByb3ZpZGVkIHdpdGggYW4gaWQgYW5kIGNvbnRhaW5lZCB3aXRoaW4gYSBwYXJlbnQgTWF0U29ydCBkaXJlY3RpdmUuXG4gKlxuICogSWYgdXNlZCBvbiBoZWFkZXIgY2VsbHMgaW4gYSBDZGtUYWJsZSwgaXQgd2lsbCBhdXRvbWF0aWNhbGx5IGRlZmF1bHQgaXRzIGlkIGZyb20gaXRzIGNvbnRhaW5pbmdcbiAqIGNvbHVtbiBkZWZpbml0aW9uLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbWF0LXNvcnQtaGVhZGVyXScsXG4gIGV4cG9ydEFzOiAnbWF0U29ydEhlYWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnc29ydC1oZWFkZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzb3J0LWhlYWRlci5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtc29ydC1oZWFkZXInLFxuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygpJyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICAgICcobW91c2VlbnRlciknOiAnX3NldEluZGljYXRvckhpbnRWaXNpYmxlKHRydWUpJyxcbiAgICAnKG1vdXNlbGVhdmUpJzogJ19zZXRJbmRpY2F0b3JIaW50VmlzaWJsZShmYWxzZSknLFxuICAgICdbYXR0ci5hcmlhLXNvcnRdJzogJ19nZXRBcmlhU29ydEF0dHJpYnV0ZSgpJyxcbiAgICAnW2NsYXNzLm1hdC1zb3J0LWhlYWRlci1kaXNhYmxlZF0nOiAnX2lzRGlzYWJsZWQoKScsXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnXSxcbiAgYW5pbWF0aW9uczogW1xuICAgIG1hdFNvcnRBbmltYXRpb25zLmluZGljYXRvcixcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5sZWZ0UG9pbnRlcixcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5yaWdodFBvaW50ZXIsXG4gICAgbWF0U29ydEFuaW1hdGlvbnMuYXJyb3dPcGFjaXR5LFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmFycm93UG9zaXRpb24sXG4gICAgbWF0U29ydEFuaW1hdGlvbnMuYWxsb3dDaGlsZHJlbixcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRTb3J0SGVhZGVyIGV4dGVuZHMgX01hdFNvcnRIZWFkZXJNaXhpbkJhc2VcbiAgICBpbXBsZW1lbnRzIENhbkRpc2FibGUsIE1hdFNvcnRhYmxlLCBPbkRlc3Ryb3ksIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gIHByaXZhdGUgX3JlcmVuZGVyU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqXG4gICAqIEZsYWcgc2V0IHRvIHRydWUgd2hlbiB0aGUgaW5kaWNhdG9yIHNob3VsZCBiZSBkaXNwbGF5ZWQgd2hpbGUgdGhlIHNvcnQgaXMgbm90IGFjdGl2ZS4gVXNlZCB0b1xuICAgKiBwcm92aWRlIGFuIGFmZm9yZGFuY2UgdGhhdCB0aGUgaGVhZGVyIGlzIHNvcnRhYmxlIGJ5IHNob3dpbmcgb24gZm9jdXMgYW5kIGhvdmVyLlxuICAgKi9cbiAgX3Nob3dJbmRpY2F0b3JIaW50OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSB2aWV3IHRyYW5zaXRpb24gc3RhdGUgb2YgdGhlIGFycm93ICh0cmFuc2xhdGlvbi8gb3BhY2l0eSkgLSBpbmRpY2F0ZXMgaXRzIGBmcm9tYCBhbmQgYHRvYFxuICAgKiBwb3NpdGlvbiB0aHJvdWdoIHRoZSBhbmltYXRpb24uIElmIGFuaW1hdGlvbnMgYXJlIGN1cnJlbnRseSBkaXNhYmxlZCwgdGhlIGZyb21TdGF0ZSBpcyByZW1vdmVkXG4gICAqIHNvIHRoYXQgdGhlcmUgaXMgbm8gYW5pbWF0aW9uIGRpc3BsYXllZC5cbiAgICovXG4gIF92aWV3U3RhdGU6IEFycm93Vmlld1N0YXRlVHJhbnNpdGlvbjtcblxuICAvKiogVGhlIGRpcmVjdGlvbiB0aGUgYXJyb3cgc2hvdWxkIGJlIGZhY2luZyBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuICovXG4gIF9hcnJvd0RpcmVjdGlvbjogU29ydERpcmVjdGlvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSB2aWV3IHN0YXRlIGFuaW1hdGlvbiBzaG91bGQgc2hvdyB0aGUgdHJhbnNpdGlvbiBiZXR3ZWVuIHRoZSBgZnJvbWAgYW5kIGB0b2Agc3RhdGVzLlxuICAgKi9cbiAgX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24gPSBmYWxzZTtcblxuICAvKipcbiAgICogSUQgb2YgdGhpcyBzb3J0IGhlYWRlci4gSWYgdXNlZCB3aXRoaW4gdGhlIGNvbnRleHQgb2YgYSBDZGtDb2x1bW5EZWYsIHRoaXMgd2lsbCBkZWZhdWx0IHRvXG4gICAqIHRoZSBjb2x1bW4ncyBuYW1lLlxuICAgKi9cbiAgQElucHV0KCdtYXQtc29ydC1oZWFkZXInKSBpZDogc3RyaW5nO1xuXG4gIC8qKiBTZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgYXJyb3cgdGhhdCBkaXNwbGF5cyB3aGVuIHNvcnRlZC4gKi9cbiAgQElucHV0KCkgYXJyb3dQb3NpdGlvbjogJ2JlZm9yZScgfCAnYWZ0ZXInID0gJ2FmdGVyJztcblxuICAvKiogT3ZlcnJpZGVzIHRoZSBzb3J0IHN0YXJ0IHZhbHVlIG9mIHRoZSBjb250YWluaW5nIE1hdFNvcnQgZm9yIHRoaXMgTWF0U29ydGFibGUuICovXG4gIEBJbnB1dCgpIHN0YXJ0OiAnYXNjJyB8ICdkZXNjJztcblxuICAvKiogT3ZlcnJpZGVzIHRoZSBkaXNhYmxlIGNsZWFyIHZhbHVlIG9mIHRoZSBjb250YWluaW5nIE1hdFNvcnQgZm9yIHRoaXMgTWF0U29ydGFibGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlQ2xlYXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlQ2xlYXI7IH1cbiAgc2V0IGRpc2FibGVDbGVhcih2KSB7IHRoaXMuX2Rpc2FibGVDbGVhciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2KTsgfVxuICBwcml2YXRlIF9kaXNhYmxlQ2xlYXI6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHVibGljIF9pbnRsOiBNYXRTb3J0SGVhZGVySW50bCxcbiAgICAgICAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX3NvcnQ6IE1hdFNvcnQsXG4gICAgICAgICAgICAgIEBJbmplY3QoJ01BVF9TT1JUX0hFQURFUl9DT0xVTU5fREVGJykgQE9wdGlvbmFsKClcbiAgICAgICAgICAgICAgICAgIHB1YmxpYyBfY29sdW1uRGVmOiBNYXRTb3J0SGVhZGVyQ29sdW1uRGVmLFxuICAgICAgICAgICAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgdXNlIGEgc3RyaW5nIHRva2VuIGZvciB0aGUgYF9jb2x1bW5EZWZgLCBiZWNhdXNlIHRoZSB2YWx1ZSBpcyBwcm92aWRlZCBib3RoIGJ5XG4gICAgLy8gYG1hdGVyaWFsL3RhYmxlYCBhbmQgYGNkay90YWJsZWAgYW5kIHdlIGNhbid0IGhhdmUgdGhlIENESyBkZXBlbmRpbmcgb24gTWF0ZXJpYWwsXG4gICAgLy8gYW5kIHdlIHdhbnQgdG8gYXZvaWQgaGF2aW5nIHRoZSBzb3J0IGhlYWRlciBkZXBlbmRpbmcgb24gdGhlIENESyB0YWJsZSBiZWNhdXNlXG4gICAgLy8gb2YgdGhpcyBzaW5nbGUgcmVmZXJlbmNlLlxuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoIV9zb3J0KSB7XG4gICAgICB0aHJvdyBnZXRTb3J0SGVhZGVyTm90Q29udGFpbmVkV2l0aGluU29ydEVycm9yKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVyZW5kZXJTdWJzY3JpcHRpb24gPSBtZXJnZShfc29ydC5zb3J0Q2hhbmdlLCBfc29ydC5fc3RhdGVDaGFuZ2VzLCBfaW50bC5jaGFuZ2VzKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5faXNTb3J0ZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQXJyb3dEaXJlY3Rpb24oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGlzIGhlYWRlciB3YXMgcmVjZW50bHkgYWN0aXZlIGFuZCBub3cgbm8gbG9uZ2VyIHNvcnRlZCwgYW5pbWF0ZSBhd2F5IHRoZSBhcnJvdy5cbiAgICAgICAgICBpZiAoIXRoaXMuX2lzU29ydGVkKCkgJiYgdGhpcy5fdmlld1N0YXRlICYmIHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID09PSAnYWN0aXZlJykge1xuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6ICdhY3RpdmUnLCB0b1N0YXRlOiB0aGlzLl9hcnJvd0RpcmVjdGlvbn0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5pZCAmJiB0aGlzLl9jb2x1bW5EZWYpIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLl9jb2x1bW5EZWYubmFtZTtcbiAgICB9XG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSBkaXJlY3Rpb24gb2YgdGhlIGFycm93IGFuZCBzZXQgdGhlIHZpZXcgc3RhdGUgdG8gYmUgaW1tZWRpYXRlbHkgdGhhdCBzdGF0ZS5cbiAgICB0aGlzLl91cGRhdGVBcnJvd0RpcmVjdGlvbigpO1xuICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZShcbiAgICAgICAge3RvU3RhdGU6IHRoaXMuX2lzU29ydGVkKCkgPyAnYWN0aXZlJyA6IHRoaXMuX2Fycm93RGlyZWN0aW9ufSk7XG5cbiAgICB0aGlzLl9zb3J0LnJlZ2lzdGVyKHRoaXMpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIFdlIHVzZSB0aGUgZm9jdXMgbW9uaXRvciBiZWNhdXNlIHdlIGFsc28gd2FudCB0byBzdHlsZVxuICAgIC8vIHRoaW5ncyBkaWZmZXJlbnRseSBiYXNlZCBvbiB0aGUgZm9jdXMgb3JpZ2luLlxuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpXG4gICAgICAgIC5zdWJzY3JpYmUob3JpZ2luID0+IHRoaXMuX3NldEluZGljYXRvckhpbnRWaXNpYmxlKCEhb3JpZ2luKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgdGhpcy5fc29ydC5kZXJlZ2lzdGVyKHRoaXMpO1xuICAgIHRoaXMuX3JlcmVuZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgXCJoaW50XCIgc3RhdGUgc3VjaCB0aGF0IHRoZSBhcnJvdyB3aWxsIGJlIHNlbWktdHJhbnNwYXJlbnRseSBkaXNwbGF5ZWQgYXMgYSBoaW50IHRvIHRoZVxuICAgKiB1c2VyIHNob3dpbmcgd2hhdCB0aGUgYWN0aXZlIHNvcnQgd2lsbCBiZWNvbWUuIElmIHNldCB0byBmYWxzZSwgdGhlIGFycm93IHdpbGwgZmFkZSBhd2F5LlxuICAgKi9cbiAgX3NldEluZGljYXRvckhpbnRWaXNpYmxlKHZpc2libGU6IGJvb2xlYW4pIHtcbiAgICAvLyBOby1vcCBpZiB0aGUgc29ydCBoZWFkZXIgaXMgZGlzYWJsZWQgLSBzaG91bGQgbm90IG1ha2UgdGhlIGhpbnQgdmlzaWJsZS5cbiAgICBpZiAodGhpcy5faXNEaXNhYmxlZCgpICYmIHZpc2libGUpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9zaG93SW5kaWNhdG9ySGludCA9IHZpc2libGU7XG5cbiAgICBpZiAoIXRoaXMuX2lzU29ydGVkKCkpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUFycm93RGlyZWN0aW9uKCk7XG4gICAgICBpZiAodGhpcy5fc2hvd0luZGljYXRvckhpbnQpIHtcbiAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9uLCB0b1N0YXRlOiAnaGludCd9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh7ZnJvbVN0YXRlOiAnaGludCcsIHRvU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9ufSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGFuaW1hdGlvbiB0cmFuc2l0aW9uIHZpZXcgc3RhdGUgZm9yIHRoZSBhcnJvdydzIHBvc2l0aW9uIGFuZCBvcGFjaXR5LiBJZiB0aGVcbiAgICogYGRpc2FibGVWaWV3U3RhdGVBbmltYXRpb25gIGZsYWcgaXMgc2V0IHRvIHRydWUsIHRoZSBgZnJvbVN0YXRlYCB3aWxsIGJlIGlnbm9yZWQgc28gdGhhdFxuICAgKiBubyBhbmltYXRpb24gYXBwZWFycy5cbiAgICovXG4gIF9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUodmlld1N0YXRlOiBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb24pIHtcbiAgICB0aGlzLl92aWV3U3RhdGUgPSB2aWV3U3RhdGU7XG5cbiAgICAvLyBJZiB0aGUgYW5pbWF0aW9uIGZvciBhcnJvdyBwb3NpdGlvbiBzdGF0ZSAob3BhY2l0eS90cmFuc2xhdGlvbikgc2hvdWxkIGJlIGRpc2FibGVkLFxuICAgIC8vIHJlbW92ZSB0aGUgZnJvbVN0YXRlIHNvIHRoYXQgaXQganVtcHMgcmlnaHQgdG8gdGhlIHRvU3RhdGUuXG4gICAgaWYgKHRoaXMuX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24pIHtcbiAgICAgIHRoaXMuX3ZpZXdTdGF0ZSA9IHt0b1N0YXRlOiB2aWV3U3RhdGUudG9TdGF0ZX07XG4gICAgfVxuICB9XG5cbiAgLyoqIFRyaWdnZXJzIHRoZSBzb3J0IG9uIHRoaXMgc29ydCBoZWFkZXIgYW5kIHJlbW92ZXMgdGhlIGluZGljYXRvciBoaW50LiAqL1xuICBfdG9nZ2xlT25JbnRlcmFjdGlvbigpIHtcblxuICAgIHRoaXMuX3NvcnQuc29ydCh0aGlzKTtcblxuICAgIC8vIERvIG5vdCBzaG93IHRoZSBhbmltYXRpb24gaWYgdGhlIGhlYWRlciB3YXMgYWxyZWFkeSBzaG93biBpbiB0aGUgcmlnaHQgcG9zaXRpb24uXG4gICAgaWYgKHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID09PSAnaGludCcgfHwgdGhpcy5fdmlld1N0YXRlLnRvU3RhdGUgPT09ICdhY3RpdmUnKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlVmlld1N0YXRlQW5pbWF0aW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgYXJyb3cgaXMgbm93IHNvcnRlZCwgYW5pbWF0ZSB0aGUgYXJyb3cgaW50byBwbGFjZS4gT3RoZXJ3aXNlLCBhbmltYXRlIGl0IGF3YXkgaW50b1xuICAgIC8vIHRoZSBkaXJlY3Rpb24gaXQgaXMgZmFjaW5nLlxuICAgIGNvbnN0IHZpZXdTdGF0ZTogQXJyb3dWaWV3U3RhdGVUcmFuc2l0aW9uID0gdGhpcy5faXNTb3J0ZWQoKSA/XG4gICAgICAgIHtmcm9tU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9uLCB0b1N0YXRlOiAnYWN0aXZlJ30gOlxuICAgICAgICB7ZnJvbVN0YXRlOiAnYWN0aXZlJywgdG9TdGF0ZTogdGhpcy5fYXJyb3dEaXJlY3Rpb259O1xuICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh2aWV3U3RhdGUpO1xuXG4gICAgdGhpcy5fc2hvd0luZGljYXRvckhpbnQgPSBmYWxzZTtcbiAgfVxuXG4gIF9oYW5kbGVDbGljaygpIHtcbiAgICBpZiAoIXRoaXMuX2lzRGlzYWJsZWQoKSkge1xuICAgICAgdGhpcy5fdG9nZ2xlT25JbnRlcmFjdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLl9pc0Rpc2FibGVkKCkgJiYgKGV2ZW50LmtleUNvZGUgPT09IFNQQUNFIHx8IGV2ZW50LmtleUNvZGUgPT09IEVOVEVSKSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuX3RvZ2dsZU9uSW50ZXJhY3Rpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIE1hdFNvcnRIZWFkZXIgaXMgY3VycmVudGx5IHNvcnRlZCBpbiBlaXRoZXIgYXNjZW5kaW5nIG9yIGRlc2NlbmRpbmcgb3JkZXIuICovXG4gIF9pc1NvcnRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydC5hY3RpdmUgPT0gdGhpcy5pZCAmJlxuICAgICAgICAodGhpcy5fc29ydC5kaXJlY3Rpb24gPT09ICdhc2MnIHx8IHRoaXMuX3NvcnQuZGlyZWN0aW9uID09PSAnZGVzYycpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGFuaW1hdGlvbiBzdGF0ZSBmb3IgdGhlIGFycm93IGRpcmVjdGlvbiAoaW5kaWNhdG9yIGFuZCBwb2ludGVycykuICovXG4gIF9nZXRBcnJvd0RpcmVjdGlvblN0YXRlKCkge1xuICAgIHJldHVybiBgJHt0aGlzLl9pc1NvcnRlZCgpID8gJ2FjdGl2ZS0nIDogJyd9JHt0aGlzLl9hcnJvd0RpcmVjdGlvbn1gO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGFycm93IHBvc2l0aW9uIHN0YXRlIChvcGFjaXR5LCB0cmFuc2xhdGlvbikuICovXG4gIF9nZXRBcnJvd1ZpZXdTdGF0ZSgpIHtcbiAgICBjb25zdCBmcm9tU3RhdGUgPSB0aGlzLl92aWV3U3RhdGUuZnJvbVN0YXRlO1xuICAgIHJldHVybiAoZnJvbVN0YXRlID8gYCR7ZnJvbVN0YXRlfS10by1gIDogJycpICsgdGhpcy5fdmlld1N0YXRlLnRvU3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgZGlyZWN0aW9uIHRoZSBhcnJvdyBzaG91bGQgYmUgcG9pbnRpbmcuIElmIGl0IGlzIG5vdCBzb3J0ZWQsIHRoZSBhcnJvdyBzaG91bGQgYmVcbiAgICogZmFjaW5nIHRoZSBzdGFydCBkaXJlY3Rpb24uIE90aGVyd2lzZSBpZiBpdCBpcyBzb3J0ZWQsIHRoZSBhcnJvdyBzaG91bGQgcG9pbnQgaW4gdGhlIGN1cnJlbnRseVxuICAgKiBhY3RpdmUgc29ydGVkIGRpcmVjdGlvbi4gVGhlIHJlYXNvbiB0aGlzIGlzIHVwZGF0ZWQgdGhyb3VnaCBhIGZ1bmN0aW9uIGlzIGJlY2F1c2UgdGhlIGRpcmVjdGlvblxuICAgKiBzaG91bGQgb25seSBiZSBjaGFuZ2VkIGF0IHNwZWNpZmljIHRpbWVzIC0gd2hlbiBkZWFjdGl2YXRlZCBidXQgdGhlIGhpbnQgaXMgZGlzcGxheWVkIGFuZCB3aGVuXG4gICAqIHRoZSBzb3J0IGlzIGFjdGl2ZSBhbmQgdGhlIGRpcmVjdGlvbiBjaGFuZ2VzLiBPdGhlcndpc2UgdGhlIGFycm93J3MgZGlyZWN0aW9uIHNob3VsZCBsaW5nZXJcbiAgICogaW4gY2FzZXMgc3VjaCBhcyB0aGUgc29ydCBiZWNvbWluZyBkZWFjdGl2YXRlZCBidXQgd2Ugd2FudCB0byBhbmltYXRlIHRoZSBhcnJvdyBhd2F5IHdoaWxlXG4gICAqIHByZXNlcnZpbmcgaXRzIGRpcmVjdGlvbiwgZXZlbiB0aG91Z2ggdGhlIG5leHQgc29ydCBkaXJlY3Rpb24gaXMgYWN0dWFsbHkgZGlmZmVyZW50IGFuZCBzaG91bGRcbiAgICogb25seSBiZSBjaGFuZ2VkIG9uY2UgdGhlIGFycm93IGRpc3BsYXlzIGFnYWluIChoaW50IG9yIGFjdGl2YXRpb24pLlxuICAgKi9cbiAgX3VwZGF0ZUFycm93RGlyZWN0aW9uKCkge1xuICAgIHRoaXMuX2Fycm93RGlyZWN0aW9uID0gdGhpcy5faXNTb3J0ZWQoKSA/XG4gICAgICAgIHRoaXMuX3NvcnQuZGlyZWN0aW9uIDpcbiAgICAgICAgKHRoaXMuc3RhcnQgfHwgdGhpcy5fc29ydC5zdGFydCk7XG4gIH1cblxuICBfaXNEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydC5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGFyaWEtc29ydCBhdHRyaWJ1dGUgdGhhdCBzaG91bGQgYmUgYXBwbGllZCB0byB0aGlzIHNvcnQgaGVhZGVyLiBJZiB0aGlzIGhlYWRlclxuICAgKiBpcyBub3Qgc29ydGVkLCByZXR1cm5zIG51bGwgc28gdGhhdCB0aGUgYXR0cmlidXRlIGlzIHJlbW92ZWQgZnJvbSB0aGUgaG9zdCBlbGVtZW50LiBBcmlhIHNwZWNcbiAgICogc2F5cyB0aGF0IHRoZSBhcmlhLXNvcnQgcHJvcGVydHkgc2hvdWxkIG9ubHkgYmUgcHJlc2VudCBvbiBvbmUgaGVhZGVyIGF0IGEgdGltZSwgc28gcmVtb3ZpbmdcbiAgICogZW5zdXJlcyB0aGlzIGlzIHRydWUuXG4gICAqL1xuICBfZ2V0QXJpYVNvcnRBdHRyaWJ1dGUoKSB7XG4gICAgaWYgKCF0aGlzLl9pc1NvcnRlZCgpKSB7XG4gICAgICByZXR1cm4gJ25vbmUnO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zb3J0LmRpcmVjdGlvbiA9PSAnYXNjJyA/ICdhc2NlbmRpbmcnIDogJ2Rlc2NlbmRpbmcnO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFycm93IGluc2lkZSB0aGUgc29ydCBoZWFkZXIgc2hvdWxkIGJlIHJlbmRlcmVkLiAqL1xuICBfcmVuZGVyQXJyb3coKSB7XG4gICAgcmV0dXJuICF0aGlzLl9pc0Rpc2FibGVkKCkgfHwgdGhpcy5faXNTb3J0ZWQoKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlQ2xlYXI6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=