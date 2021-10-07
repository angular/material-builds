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
import * as i0 from "@angular/core";
import * as i1 from "./sort-header-intl";
import * as i2 from "./sort";
import * as i3 from "@angular/cdk/a11y";
import * as i4 from "@angular/common";
// Boilerplate for applying mixins to the sort header.
/** @docs-private */
const _MatSortHeaderBase = mixinDisabled(class {
});
/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MatSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
export class MatSortHeader extends _MatSortHeaderBase {
    constructor(
    /**
     * @deprecated `_intl` parameter isn't being used anymore and it'll be removed.
     * @breaking-change 13.0.0
     */
    _intl, _changeDetectorRef, 
    // `MatSort` is not optionally injected, but just asserted manually w/ better error.
    // tslint:disable-next-line: lightweight-tokens
    _sort, _columnDef, _focusMonitor, _elementRef) {
        // Note that we use a string token for the `_columnDef`, because the value is provided both by
        // `material/table` and `cdk/table` and we can't have the CDK depending on Material,
        // and we want to avoid having the sort header depending on the CDK table because
        // of this single reference.
        super();
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
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
         * The view transition state of the arrow (translation/ opacity) - indicates its `from` and `to`
         * position through the animation. If animations are currently disabled, the fromState is removed
         * so that there is no animation displayed.
         */
        this._viewState = {};
        /** The direction the arrow should be facing according to the current state. */
        this._arrowDirection = '';
        /**
         * Whether the view state animation should show the transition between the `from` and `to` states.
         */
        this._disableViewStateAnimation = false;
        /** Sets the position of the arrow that displays when sorted. */
        this.arrowPosition = 'after';
        if (!_sort && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getSortHeaderNotContainedWithinSortError();
        }
        this._handleStateChanges();
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
        this._focusMonitor.monitor(this._elementRef, true).subscribe(origin => {
            const newState = !!origin;
            if (newState !== this._showIndicatorHint) {
                this._setIndicatorHintVisible(newState);
                this._changeDetectorRef.markForCheck();
            }
        });
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
        this._viewState = viewState || {};
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
    }
    _handleClick() {
        if (!this._isDisabled()) {
            this._sort.sort(this);
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
    /** Handles changes in the sorting state. */
    _handleStateChanges() {
        this._rerenderSubscription =
            merge(this._sort.sortChange, this._sort._stateChanges, this._intl.changes).subscribe(() => {
                if (this._isSorted()) {
                    this._updateArrowDirection();
                    // Do not show the animation if the header was already shown in the right position.
                    if (this._viewState.toState === 'hint' || this._viewState.toState === 'active') {
                        this._disableViewStateAnimation = true;
                    }
                    this._setAnimationTransitionState({ fromState: this._arrowDirection, toState: 'active' });
                    this._showIndicatorHint = false;
                }
                // If this header was recently active and now no longer sorted, animate away the arrow.
                if (!this._isSorted() && this._viewState && this._viewState.toState === 'active') {
                    this._disableViewStateAnimation = false;
                    this._setAnimationTransitionState({ fromState: 'active', toState: this._arrowDirection });
                }
                this._changeDetectorRef.markForCheck();
            });
    }
}
MatSortHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSortHeader, deps: [{ token: i1.MatSortHeaderIntl }, { token: i0.ChangeDetectorRef }, { token: i2.MatSort, optional: true }, { token: 'MAT_SORT_HEADER_COLUMN_DEF', optional: true }, { token: i3.FocusMonitor }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
MatSortHeader.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatSortHeader, selector: "[mat-sort-header]", inputs: { disabled: "disabled", id: ["mat-sort-header", "id"], arrowPosition: "arrowPosition", start: "start", disableClear: "disableClear" }, host: { listeners: { "click": "_handleClick()", "keydown": "_handleKeydown($event)", "mouseenter": "_setIndicatorHintVisible(true)", "mouseleave": "_setIndicatorHintVisible(false)" }, properties: { "attr.aria-sort": "_getAriaSortAttribute()", "class.mat-sort-header-disabled": "_isDisabled()" }, classAttribute: "mat-sort-header" }, exportAs: ["matSortHeader"], usesInheritance: true, ngImport: i0, template: "<!--\n  We set the `tabindex` on an element inside the table header, rather than the header itself,\n  because of a bug in NVDA where having a `tabindex` on a `th` breaks keyboard navigation in the\n  table (see https://github.com/nvaccess/nvda/issues/7718). This allows for the header to both\n  be focusable, and have screen readers read out its `aria-sort` state. We prefer this approach\n  over having a button with an `aria-label` inside the header, because the button's `aria-label`\n  will be read out as the user is navigating the table's cell (see #13012).\n\n  The approach is based off of: https://dequeuniversity.com/library/aria/tables/sf-sortable-grid\n-->\n<div class=\"mat-sort-header-container mat-focus-indicator\"\n     [class.mat-sort-header-sorted]=\"_isSorted()\"\n     [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\"\n     [attr.tabindex]=\"_isDisabled() ? null : 0\"\n     role=\"button\">\n\n  <!--\n    TODO(crisbeto): this div isn't strictly necessary, but we have to keep it due to a large\n    number of screenshot diff failures. It should be removed eventually. Note that the difference\n    isn't visible with a shorter header, but once it breaks up into multiple lines, this element\n    causes it to be center-aligned, whereas removing it will keep the text to the left.\n  -->\n  <div class=\"mat-sort-header-content\">\n    <ng-content></ng-content>\n  </div>\n\n  <!-- Disable animations while a current animation is running -->\n  <div class=\"mat-sort-header-arrow\"\n       *ngIf=\"_renderArrow()\"\n       [@arrowOpacity]=\"_getArrowViewState()\"\n       [@arrowPosition]=\"_getArrowViewState()\"\n       [@allowChildren]=\"_getArrowDirectionState()\"\n       (@arrowPosition.start)=\"_disableViewStateAnimation = true\"\n       (@arrowPosition.done)=\"_disableViewStateAnimation = false\">\n    <div class=\"mat-sort-header-stem\"></div>\n    <div class=\"mat-sort-header-indicator\" [@indicator]=\"_getArrowDirectionState()\">\n      <div class=\"mat-sort-header-pointer-left\" [@leftPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-right\" [@rightPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-middle\"></div>\n    </div>\n  </div>\n</div>\n", styles: [".mat-sort-header-container{display:flex;cursor:pointer;align-items:center;letter-spacing:normal;outline:0}[mat-sort-header].cdk-keyboard-focused .mat-sort-header-container,[mat-sort-header].cdk-program-focused .mat-sort-header-container{border-bottom:solid 1px currentColor}.mat-sort-header-disabled .mat-sort-header-container{cursor:default}.mat-sort-header-content{text-align:center;display:flex;align-items:center}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-arrow{height:12px;width:12px;min-width:12px;position:relative;display:flex;opacity:0}.mat-sort-header-arrow,[dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow{margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow,[dir=rtl] .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-stem{background:currentColor;height:10px;width:2px;margin:auto;display:flex;align-items:center}.cdk-high-contrast-active .mat-sort-header-stem{width:0;border-left:solid 2px}.mat-sort-header-indicator{width:100%;height:2px;display:flex;align-items:center;position:absolute;top:0;left:0}.mat-sort-header-pointer-middle{margin:auto;height:2px;width:2px;background:currentColor;transform:rotate(45deg)}.cdk-high-contrast-active .mat-sort-header-pointer-middle{width:0;height:0;border-top:solid 2px;border-left:solid 2px}.mat-sort-header-pointer-left,.mat-sort-header-pointer-right{background:currentColor;width:6px;height:2px;position:absolute;top:0}.cdk-high-contrast-active .mat-sort-header-pointer-left,.cdk-high-contrast-active .mat-sort-header-pointer-right{width:0;height:0;border-left:solid 6px;border-top:solid 2px}.mat-sort-header-pointer-left{transform-origin:right;left:0}.mat-sort-header-pointer-right{transform-origin:left;right:0}\n"], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], animations: [
        matSortAnimations.indicator,
        matSortAnimations.leftPointer,
        matSortAnimations.rightPointer,
        matSortAnimations.arrowOpacity,
        matSortAnimations.arrowPosition,
        matSortAnimations.allowChildren,
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSortHeader, decorators: [{
            type: Component,
            args: [{ selector: '[mat-sort-header]', exportAs: 'matSortHeader', host: {
                        'class': 'mat-sort-header',
                        '(click)': '_handleClick()',
                        '(keydown)': '_handleKeydown($event)',
                        '(mouseenter)': '_setIndicatorHintVisible(true)',
                        '(mouseleave)': '_setIndicatorHintVisible(false)',
                        '[attr.aria-sort]': '_getAriaSortAttribute()',
                        '[class.mat-sort-header-disabled]': '_isDisabled()',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['disabled'], animations: [
                        matSortAnimations.indicator,
                        matSortAnimations.leftPointer,
                        matSortAnimations.rightPointer,
                        matSortAnimations.arrowOpacity,
                        matSortAnimations.arrowPosition,
                        matSortAnimations.allowChildren,
                    ], template: "<!--\n  We set the `tabindex` on an element inside the table header, rather than the header itself,\n  because of a bug in NVDA where having a `tabindex` on a `th` breaks keyboard navigation in the\n  table (see https://github.com/nvaccess/nvda/issues/7718). This allows for the header to both\n  be focusable, and have screen readers read out its `aria-sort` state. We prefer this approach\n  over having a button with an `aria-label` inside the header, because the button's `aria-label`\n  will be read out as the user is navigating the table's cell (see #13012).\n\n  The approach is based off of: https://dequeuniversity.com/library/aria/tables/sf-sortable-grid\n-->\n<div class=\"mat-sort-header-container mat-focus-indicator\"\n     [class.mat-sort-header-sorted]=\"_isSorted()\"\n     [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\"\n     [attr.tabindex]=\"_isDisabled() ? null : 0\"\n     role=\"button\">\n\n  <!--\n    TODO(crisbeto): this div isn't strictly necessary, but we have to keep it due to a large\n    number of screenshot diff failures. It should be removed eventually. Note that the difference\n    isn't visible with a shorter header, but once it breaks up into multiple lines, this element\n    causes it to be center-aligned, whereas removing it will keep the text to the left.\n  -->\n  <div class=\"mat-sort-header-content\">\n    <ng-content></ng-content>\n  </div>\n\n  <!-- Disable animations while a current animation is running -->\n  <div class=\"mat-sort-header-arrow\"\n       *ngIf=\"_renderArrow()\"\n       [@arrowOpacity]=\"_getArrowViewState()\"\n       [@arrowPosition]=\"_getArrowViewState()\"\n       [@allowChildren]=\"_getArrowDirectionState()\"\n       (@arrowPosition.start)=\"_disableViewStateAnimation = true\"\n       (@arrowPosition.done)=\"_disableViewStateAnimation = false\">\n    <div class=\"mat-sort-header-stem\"></div>\n    <div class=\"mat-sort-header-indicator\" [@indicator]=\"_getArrowDirectionState()\">\n      <div class=\"mat-sort-header-pointer-left\" [@leftPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-right\" [@rightPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-middle\"></div>\n    </div>\n  </div>\n</div>\n", styles: [".mat-sort-header-container{display:flex;cursor:pointer;align-items:center;letter-spacing:normal;outline:0}[mat-sort-header].cdk-keyboard-focused .mat-sort-header-container,[mat-sort-header].cdk-program-focused .mat-sort-header-container{border-bottom:solid 1px currentColor}.mat-sort-header-disabled .mat-sort-header-container{cursor:default}.mat-sort-header-content{text-align:center;display:flex;align-items:center}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-arrow{height:12px;width:12px;min-width:12px;position:relative;display:flex;opacity:0}.mat-sort-header-arrow,[dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow{margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow,[dir=rtl] .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-stem{background:currentColor;height:10px;width:2px;margin:auto;display:flex;align-items:center}.cdk-high-contrast-active .mat-sort-header-stem{width:0;border-left:solid 2px}.mat-sort-header-indicator{width:100%;height:2px;display:flex;align-items:center;position:absolute;top:0;left:0}.mat-sort-header-pointer-middle{margin:auto;height:2px;width:2px;background:currentColor;transform:rotate(45deg)}.cdk-high-contrast-active .mat-sort-header-pointer-middle{width:0;height:0;border-top:solid 2px;border-left:solid 2px}.mat-sort-header-pointer-left,.mat-sort-header-pointer-right{background:currentColor;width:6px;height:2px;position:absolute;top:0}.cdk-high-contrast-active .mat-sort-header-pointer-left,.cdk-high-contrast-active .mat-sort-header-pointer-right{width:0;height:0;border-left:solid 6px;border-top:solid 2px}.mat-sort-header-pointer-left{transform-origin:right;left:0}.mat-sort-header-pointer-right{transform-origin:left;right:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.MatSortHeaderIntl }, { type: i0.ChangeDetectorRef }, { type: i2.MatSort, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: ['MAT_SORT_HEADER_COLUMN_DEF']
                }, {
                    type: Optional
                }] }, { type: i3.FocusMonitor }, { type: i0.ElementRef }]; }, propDecorators: { id: [{
                type: Input,
                args: ['mat-sort-header']
            }], arrowPosition: [{
                type: Input
            }], start: [{
                type: Input
            }], disableClear: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc29ydC9zb3J0LWhlYWRlci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3NvcnQtaGVhZGVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULEtBQUssRUFHTCxRQUFRLEVBQ1IsaUJBQWlCLEVBQ2pCLE1BQU0sRUFDTixVQUFVLEdBRVgsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFhLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2pFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFBQyxLQUFLLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLE9BQU8sRUFBYyxNQUFNLFFBQVEsQ0FBQztBQUM1QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVwRCxPQUFPLEVBQUMsd0NBQXdDLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7OztBQUdyRCxzREFBc0Q7QUFDdEQsb0JBQW9CO0FBQ3BCLE1BQU0sa0JBQWtCLEdBQUcsYUFBYSxDQUFDO0NBQVEsQ0FBQyxDQUFDO0FBMkJuRDs7Ozs7Ozs7R0FRRztBQTJCSCxNQUFNLE9BQU8sYUFBYyxTQUFRLGtCQUFrQjtJQTJDbkQ7SUFDWTs7O09BR0c7SUFDSSxLQUF3QixFQUN2QixrQkFB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cEIsdUJBQXVCLENBQUMsTUFBTSxVQUN2QyxDQUFDLFVBQVUsQ0FBQyxjQUNSO3dCQUNWLGlCQUFpQixDQUFDLFNBQVM7d0JBQzNCLGlCQUFpQixDQUFDLFdBQVc7d0JBQzdCLGlCQUFpQixDQUFDLFlBQVk7d0JBQzlCLGlCQUFpQixDQUFDLFlBQVk7d0JBQzlCLGlCQUFpQixDQUFDLGFBQWE7d0JBQy9CLGlCQUFpQixDQUFDLGFBQWE7cUJBQ2hDOzswQkFzRFksUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyw0QkFBNEI7OzBCQUFHLFFBQVE7Z0dBeEJqQyxFQUFFO3NCQUEzQixLQUFLO3VCQUFDLGlCQUFpQjtnQkFHZixhQUFhO3NCQUFyQixLQUFLO2dCQUdHLEtBQUs7c0JBQWIsS0FBSztnQkFJRixZQUFZO3NCQURmLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5qZWN0LFxuICBFbGVtZW50UmVmLFxuICBBZnRlclZpZXdJbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuRGlzYWJsZSwgbWl4aW5EaXNhYmxlZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0ZvY3VzTW9uaXRvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtFTlRFUiwgU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge21lcmdlLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXRTb3J0LCBNYXRTb3J0YWJsZX0gZnJvbSAnLi9zb3J0JztcbmltcG9ydCB7bWF0U29ydEFuaW1hdGlvbnN9IGZyb20gJy4vc29ydC1hbmltYXRpb25zJztcbmltcG9ydCB7U29ydERpcmVjdGlvbn0gZnJvbSAnLi9zb3J0LWRpcmVjdGlvbic7XG5pbXBvcnQge2dldFNvcnRIZWFkZXJOb3RDb250YWluZWRXaXRoaW5Tb3J0RXJyb3J9IGZyb20gJy4vc29ydC1lcnJvcnMnO1xuaW1wb3J0IHtNYXRTb3J0SGVhZGVySW50bH0gZnJvbSAnLi9zb3J0LWhlYWRlci1pbnRsJztcblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIHRoZSBzb3J0IGhlYWRlci5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0U29ydEhlYWRlckJhc2UgPSBtaXhpbkRpc2FibGVkKGNsYXNzIHt9KTtcblxuLyoqXG4gKiBWYWxpZCBwb3NpdGlvbnMgZm9yIHRoZSBhcnJvdyB0byBiZSBpbiBmb3IgaXRzIG9wYWNpdHkgYW5kIHRyYW5zbGF0aW9uLiBJZiB0aGUgc3RhdGUgaXMgYVxuICogc29ydCBkaXJlY3Rpb24sIHRoZSBwb3NpdGlvbiBvZiB0aGUgYXJyb3cgd2lsbCBiZSBhYm92ZS9iZWxvdyBhbmQgb3BhY2l0eSAwLiBJZiB0aGUgc3RhdGUgaXNcbiAqIGhpbnQsIHRoZSBhcnJvdyB3aWxsIGJlIGluIHRoZSBjZW50ZXIgd2l0aCBhIHNsaWdodCBvcGFjaXR5LiBBY3RpdmUgc3RhdGUgbWVhbnMgdGhlIGFycm93IHdpbGxcbiAqIGJlIGZ1bGx5IG9wYXF1ZSBpbiB0aGUgY2VudGVyLlxuICpcbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IHR5cGUgQXJyb3dWaWV3U3RhdGUgPSBTb3J0RGlyZWN0aW9uIHwgJ2hpbnQnIHwgJ2FjdGl2ZSc7XG5cbi8qKlxuICogU3RhdGVzIGRlc2NyaWJpbmcgdGhlIGFycm93J3MgYW5pbWF0ZWQgcG9zaXRpb24gKGFuaW1hdGluZyBmcm9tU3RhdGUgdG8gdG9TdGF0ZSkuXG4gKiBJZiB0aGUgZnJvbVN0YXRlIGlzIG5vdCBkZWZpbmVkLCB0aGVyZSB3aWxsIGJlIG5vIGFuaW1hdGVkIHRyYW5zaXRpb24gdG8gdGhlIHRvU3RhdGUuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXJyb3dWaWV3U3RhdGVUcmFuc2l0aW9uIHtcbiAgZnJvbVN0YXRlPzogQXJyb3dWaWV3U3RhdGU7XG4gIHRvU3RhdGU/OiBBcnJvd1ZpZXdTdGF0ZTtcbn1cblxuLyoqIENvbHVtbiBkZWZpbml0aW9uIGFzc29jaWF0ZWQgd2l0aCBhIGBNYXRTb3J0SGVhZGVyYC4gKi9cbmludGVyZmFjZSBNYXRTb3J0SGVhZGVyQ29sdW1uRGVmIHtcbiAgbmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIEFwcGxpZXMgc29ydGluZyBiZWhhdmlvciAoY2xpY2sgdG8gY2hhbmdlIHNvcnQpIGFuZCBzdHlsZXMgdG8gYW4gZWxlbWVudCwgaW5jbHVkaW5nIGFuXG4gKiBhcnJvdyB0byBkaXNwbGF5IHRoZSBjdXJyZW50IHNvcnQgZGlyZWN0aW9uLlxuICpcbiAqIE11c3QgYmUgcHJvdmlkZWQgd2l0aCBhbiBpZCBhbmQgY29udGFpbmVkIHdpdGhpbiBhIHBhcmVudCBNYXRTb3J0IGRpcmVjdGl2ZS5cbiAqXG4gKiBJZiB1c2VkIG9uIGhlYWRlciBjZWxscyBpbiBhIENka1RhYmxlLCBpdCB3aWxsIGF1dG9tYXRpY2FsbHkgZGVmYXVsdCBpdHMgaWQgZnJvbSBpdHMgY29udGFpbmluZ1xuICogY29sdW1uIGRlZmluaXRpb24uXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ1ttYXQtc29ydC1oZWFkZXJdJyxcbiAgZXhwb3J0QXM6ICdtYXRTb3J0SGVhZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdzb3J0LWhlYWRlci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3NvcnQtaGVhZGVyLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1zb3J0LWhlYWRlcicsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJyhtb3VzZWVudGVyKSc6ICdfc2V0SW5kaWNhdG9ySGludFZpc2libGUodHJ1ZSknLFxuICAgICcobW91c2VsZWF2ZSknOiAnX3NldEluZGljYXRvckhpbnRWaXNpYmxlKGZhbHNlKScsXG4gICAgJ1thdHRyLmFyaWEtc29ydF0nOiAnX2dldEFyaWFTb3J0QXR0cmlidXRlKCknLFxuICAgICdbY2xhc3MubWF0LXNvcnQtaGVhZGVyLWRpc2FibGVkXSc6ICdfaXNEaXNhYmxlZCgpJyxcbiAgfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogWydkaXNhYmxlZCddLFxuICBhbmltYXRpb25zOiBbXG4gICAgbWF0U29ydEFuaW1hdGlvbnMuaW5kaWNhdG9yLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmxlZnRQb2ludGVyLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLnJpZ2h0UG9pbnRlcixcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5hcnJvd09wYWNpdHksXG4gICAgbWF0U29ydEFuaW1hdGlvbnMuYXJyb3dQb3NpdGlvbixcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5hbGxvd0NoaWxkcmVuLFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNvcnRIZWFkZXIgZXh0ZW5kcyBfTWF0U29ydEhlYWRlckJhc2VcbiAgICBpbXBsZW1lbnRzIENhbkRpc2FibGUsIE1hdFNvcnRhYmxlLCBPbkRlc3Ryb3ksIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gIHByaXZhdGUgX3JlcmVuZGVyU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqXG4gICAqIEZsYWcgc2V0IHRvIHRydWUgd2hlbiB0aGUgaW5kaWNhdG9yIHNob3VsZCBiZSBkaXNwbGF5ZWQgd2hpbGUgdGhlIHNvcnQgaXMgbm90IGFjdGl2ZS4gVXNlZCB0b1xuICAgKiBwcm92aWRlIGFuIGFmZm9yZGFuY2UgdGhhdCB0aGUgaGVhZGVyIGlzIHNvcnRhYmxlIGJ5IHNob3dpbmcgb24gZm9jdXMgYW5kIGhvdmVyLlxuICAgKi9cbiAgX3Nob3dJbmRpY2F0b3JIaW50OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSB2aWV3IHRyYW5zaXRpb24gc3RhdGUgb2YgdGhlIGFycm93ICh0cmFuc2xhdGlvbi8gb3BhY2l0eSkgLSBpbmRpY2F0ZXMgaXRzIGBmcm9tYCBhbmQgYHRvYFxuICAgKiBwb3NpdGlvbiB0aHJvdWdoIHRoZSBhbmltYXRpb24uIElmIGFuaW1hdGlvbnMgYXJlIGN1cnJlbnRseSBkaXNhYmxlZCwgdGhlIGZyb21TdGF0ZSBpcyByZW1vdmVkXG4gICAqIHNvIHRoYXQgdGhlcmUgaXMgbm8gYW5pbWF0aW9uIGRpc3BsYXllZC5cbiAgICovXG4gIF92aWV3U3RhdGU6IEFycm93Vmlld1N0YXRlVHJhbnNpdGlvbiA9IHsgfTtcblxuICAvKiogVGhlIGRpcmVjdGlvbiB0aGUgYXJyb3cgc2hvdWxkIGJlIGZhY2luZyBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuICovXG4gIF9hcnJvd0RpcmVjdGlvbjogU29ydERpcmVjdGlvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSB2aWV3IHN0YXRlIGFuaW1hdGlvbiBzaG91bGQgc2hvdyB0aGUgdHJhbnNpdGlvbiBiZXR3ZWVuIHRoZSBgZnJvbWAgYW5kIGB0b2Agc3RhdGVzLlxuICAgKi9cbiAgX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24gPSBmYWxzZTtcblxuICAvKipcbiAgICogSUQgb2YgdGhpcyBzb3J0IGhlYWRlci4gSWYgdXNlZCB3aXRoaW4gdGhlIGNvbnRleHQgb2YgYSBDZGtDb2x1bW5EZWYsIHRoaXMgd2lsbCBkZWZhdWx0IHRvXG4gICAqIHRoZSBjb2x1bW4ncyBuYW1lLlxuICAgKi9cbiAgQElucHV0KCdtYXQtc29ydC1oZWFkZXInKSBpZDogc3RyaW5nO1xuXG4gIC8qKiBTZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgYXJyb3cgdGhhdCBkaXNwbGF5cyB3aGVuIHNvcnRlZC4gKi9cbiAgQElucHV0KCkgYXJyb3dQb3NpdGlvbjogJ2JlZm9yZScgfCAnYWZ0ZXInID0gJ2FmdGVyJztcblxuICAvKiogT3ZlcnJpZGVzIHRoZSBzb3J0IHN0YXJ0IHZhbHVlIG9mIHRoZSBjb250YWluaW5nIE1hdFNvcnQgZm9yIHRoaXMgTWF0U29ydGFibGUuICovXG4gIEBJbnB1dCgpIHN0YXJ0OiAnYXNjJyB8ICdkZXNjJztcblxuICAvKiogT3ZlcnJpZGVzIHRoZSBkaXNhYmxlIGNsZWFyIHZhbHVlIG9mIHRoZSBjb250YWluaW5nIE1hdFNvcnQgZm9yIHRoaXMgTWF0U29ydGFibGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlQ2xlYXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlQ2xlYXI7IH1cbiAgc2V0IGRpc2FibGVDbGVhcih2KSB7IHRoaXMuX2Rpc2FibGVDbGVhciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2KTsgfVxuICBwcml2YXRlIF9kaXNhYmxlQ2xlYXI6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgKiBAZGVwcmVjYXRlZCBgX2ludGxgIHBhcmFtZXRlciBpc24ndCBiZWluZyB1c2VkIGFueW1vcmUgYW5kIGl0J2xsIGJlIHJlbW92ZWQuXG4gICAgICAgICAgICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTMuMC4wXG4gICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICBwdWJsaWMgX2ludGw6IE1hdFNvcnRIZWFkZXJJbnRsLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIC8vIGBNYXRTb3J0YCBpcyBub3Qgb3B0aW9uYWxseSBpbmplY3RlZCwgYnV0IGp1c3QgYXNzZXJ0ZWQgbWFudWFsbHkgdy8gYmV0dGVyIGVycm9yLlxuICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGxpZ2h0d2VpZ2h0LXRva2Vuc1xuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX3NvcnQ6IE1hdFNvcnQsXG4gICAgICAgICAgICAgIEBJbmplY3QoJ01BVF9TT1JUX0hFQURFUl9DT0xVTU5fREVGJykgQE9wdGlvbmFsKClcbiAgICAgICAgICAgICAgICAgIHB1YmxpYyBfY29sdW1uRGVmOiBNYXRTb3J0SGVhZGVyQ29sdW1uRGVmLFxuICAgICAgICAgICAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgdXNlIGEgc3RyaW5nIHRva2VuIGZvciB0aGUgYF9jb2x1bW5EZWZgLCBiZWNhdXNlIHRoZSB2YWx1ZSBpcyBwcm92aWRlZCBib3RoIGJ5XG4gICAgLy8gYG1hdGVyaWFsL3RhYmxlYCBhbmQgYGNkay90YWJsZWAgYW5kIHdlIGNhbid0IGhhdmUgdGhlIENESyBkZXBlbmRpbmcgb24gTWF0ZXJpYWwsXG4gICAgLy8gYW5kIHdlIHdhbnQgdG8gYXZvaWQgaGF2aW5nIHRoZSBzb3J0IGhlYWRlciBkZXBlbmRpbmcgb24gdGhlIENESyB0YWJsZSBiZWNhdXNlXG4gICAgLy8gb2YgdGhpcyBzaW5nbGUgcmVmZXJlbmNlLlxuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoIV9zb3J0ICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRTb3J0SGVhZGVyTm90Q29udGFpbmVkV2l0aGluU29ydEVycm9yKCk7XG4gICAgfVxuXG4gICAgdGhpcy5faGFuZGxlU3RhdGVDaGFuZ2VzKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuaWQgJiYgdGhpcy5fY29sdW1uRGVmKSB7XG4gICAgICB0aGlzLmlkID0gdGhpcy5fY29sdW1uRGVmLm5hbWU7XG4gICAgfVxuXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgZGlyZWN0aW9uIG9mIHRoZSBhcnJvdyBhbmQgc2V0IHRoZSB2aWV3IHN0YXRlIHRvIGJlIGltbWVkaWF0ZWx5IHRoYXQgc3RhdGUuXG4gICAgdGhpcy5fdXBkYXRlQXJyb3dEaXJlY3Rpb24oKTtcbiAgICB0aGlzLl9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUoXG4gICAgICAgIHt0b1N0YXRlOiB0aGlzLl9pc1NvcnRlZCgpID8gJ2FjdGl2ZScgOiB0aGlzLl9hcnJvd0RpcmVjdGlvbn0pO1xuXG4gICAgdGhpcy5fc29ydC5yZWdpc3Rlcih0aGlzKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBXZSB1c2UgdGhlIGZvY3VzIG1vbml0b3IgYmVjYXVzZSB3ZSBhbHNvIHdhbnQgdG8gc3R5bGVcbiAgICAvLyB0aGluZ3MgZGlmZmVyZW50bHkgYmFzZWQgb24gdGhlIGZvY3VzIG9yaWdpbi5cbiAgICB0aGlzLl9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLCB0cnVlKS5zdWJzY3JpYmUob3JpZ2luID0+IHtcbiAgICAgIGNvbnN0IG5ld1N0YXRlID0gISFvcmlnaW47XG4gICAgICBpZiAobmV3U3RhdGUgIT09IHRoaXMuX3Nob3dJbmRpY2F0b3JIaW50KSB7XG4gICAgICAgIHRoaXMuX3NldEluZGljYXRvckhpbnRWaXNpYmxlKG5ld1N0YXRlKTtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgdGhpcy5fc29ydC5kZXJlZ2lzdGVyKHRoaXMpO1xuICAgIHRoaXMuX3JlcmVuZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgXCJoaW50XCIgc3RhdGUgc3VjaCB0aGF0IHRoZSBhcnJvdyB3aWxsIGJlIHNlbWktdHJhbnNwYXJlbnRseSBkaXNwbGF5ZWQgYXMgYSBoaW50IHRvIHRoZVxuICAgKiB1c2VyIHNob3dpbmcgd2hhdCB0aGUgYWN0aXZlIHNvcnQgd2lsbCBiZWNvbWUuIElmIHNldCB0byBmYWxzZSwgdGhlIGFycm93IHdpbGwgZmFkZSBhd2F5LlxuICAgKi9cbiAgX3NldEluZGljYXRvckhpbnRWaXNpYmxlKHZpc2libGU6IGJvb2xlYW4pIHtcbiAgICAvLyBOby1vcCBpZiB0aGUgc29ydCBoZWFkZXIgaXMgZGlzYWJsZWQgLSBzaG91bGQgbm90IG1ha2UgdGhlIGhpbnQgdmlzaWJsZS5cbiAgICBpZiAodGhpcy5faXNEaXNhYmxlZCgpICYmIHZpc2libGUpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9zaG93SW5kaWNhdG9ySGludCA9IHZpc2libGU7XG5cbiAgICBpZiAoIXRoaXMuX2lzU29ydGVkKCkpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUFycm93RGlyZWN0aW9uKCk7XG4gICAgICBpZiAodGhpcy5fc2hvd0luZGljYXRvckhpbnQpIHtcbiAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9uLCB0b1N0YXRlOiAnaGludCd9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh7ZnJvbVN0YXRlOiAnaGludCcsIHRvU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9ufSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGFuaW1hdGlvbiB0cmFuc2l0aW9uIHZpZXcgc3RhdGUgZm9yIHRoZSBhcnJvdydzIHBvc2l0aW9uIGFuZCBvcGFjaXR5LiBJZiB0aGVcbiAgICogYGRpc2FibGVWaWV3U3RhdGVBbmltYXRpb25gIGZsYWcgaXMgc2V0IHRvIHRydWUsIHRoZSBgZnJvbVN0YXRlYCB3aWxsIGJlIGlnbm9yZWQgc28gdGhhdFxuICAgKiBubyBhbmltYXRpb24gYXBwZWFycy5cbiAgICovXG4gIF9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUodmlld1N0YXRlOiBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb24pIHtcbiAgICB0aGlzLl92aWV3U3RhdGUgPSB2aWV3U3RhdGUgfHwgeyB9O1xuXG4gICAgLy8gSWYgdGhlIGFuaW1hdGlvbiBmb3IgYXJyb3cgcG9zaXRpb24gc3RhdGUgKG9wYWNpdHkvdHJhbnNsYXRpb24pIHNob3VsZCBiZSBkaXNhYmxlZCxcbiAgICAvLyByZW1vdmUgdGhlIGZyb21TdGF0ZSBzbyB0aGF0IGl0IGp1bXBzIHJpZ2h0IHRvIHRoZSB0b1N0YXRlLlxuICAgIGlmICh0aGlzLl9kaXNhYmxlVmlld1N0YXRlQW5pbWF0aW9uKSB7XG4gICAgICB0aGlzLl92aWV3U3RhdGUgPSB7dG9TdGF0ZTogdmlld1N0YXRlLnRvU3RhdGV9O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUcmlnZ2VycyB0aGUgc29ydCBvbiB0aGlzIHNvcnQgaGVhZGVyIGFuZCByZW1vdmVzIHRoZSBpbmRpY2F0b3IgaGludC4gKi9cbiAgX3RvZ2dsZU9uSW50ZXJhY3Rpb24oKSB7XG4gICAgdGhpcy5fc29ydC5zb3J0KHRoaXMpO1xuXG4gICAgLy8gRG8gbm90IHNob3cgdGhlIGFuaW1hdGlvbiBpZiB0aGUgaGVhZGVyIHdhcyBhbHJlYWR5IHNob3duIGluIHRoZSByaWdodCBwb3NpdGlvbi5cbiAgICBpZiAodGhpcy5fdmlld1N0YXRlLnRvU3RhdGUgPT09ICdoaW50JyB8fCB0aGlzLl92aWV3U3RhdGUudG9TdGF0ZSA9PT0gJ2FjdGl2ZScpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24gPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVDbGljaygpIHtcbiAgICBpZiAoIXRoaXMuX2lzRGlzYWJsZWQoKSkge1xuICAgICAgdGhpcy5fc29ydC5zb3J0KHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLl9pc0Rpc2FibGVkKCkgJiYgKGV2ZW50LmtleUNvZGUgPT09IFNQQUNFIHx8IGV2ZW50LmtleUNvZGUgPT09IEVOVEVSKSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuX3RvZ2dsZU9uSW50ZXJhY3Rpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIE1hdFNvcnRIZWFkZXIgaXMgY3VycmVudGx5IHNvcnRlZCBpbiBlaXRoZXIgYXNjZW5kaW5nIG9yIGRlc2NlbmRpbmcgb3JkZXIuICovXG4gIF9pc1NvcnRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydC5hY3RpdmUgPT0gdGhpcy5pZCAmJlxuICAgICAgICAodGhpcy5fc29ydC5kaXJlY3Rpb24gPT09ICdhc2MnIHx8IHRoaXMuX3NvcnQuZGlyZWN0aW9uID09PSAnZGVzYycpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGFuaW1hdGlvbiBzdGF0ZSBmb3IgdGhlIGFycm93IGRpcmVjdGlvbiAoaW5kaWNhdG9yIGFuZCBwb2ludGVycykuICovXG4gIF9nZXRBcnJvd0RpcmVjdGlvblN0YXRlKCkge1xuICAgIHJldHVybiBgJHt0aGlzLl9pc1NvcnRlZCgpID8gJ2FjdGl2ZS0nIDogJyd9JHt0aGlzLl9hcnJvd0RpcmVjdGlvbn1gO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGFycm93IHBvc2l0aW9uIHN0YXRlIChvcGFjaXR5LCB0cmFuc2xhdGlvbikuICovXG4gIF9nZXRBcnJvd1ZpZXdTdGF0ZSgpIHtcbiAgICBjb25zdCBmcm9tU3RhdGUgPSB0aGlzLl92aWV3U3RhdGUuZnJvbVN0YXRlO1xuICAgIHJldHVybiAoZnJvbVN0YXRlID8gYCR7ZnJvbVN0YXRlfS10by1gIDogJycpICsgdGhpcy5fdmlld1N0YXRlLnRvU3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgZGlyZWN0aW9uIHRoZSBhcnJvdyBzaG91bGQgYmUgcG9pbnRpbmcuIElmIGl0IGlzIG5vdCBzb3J0ZWQsIHRoZSBhcnJvdyBzaG91bGQgYmVcbiAgICogZmFjaW5nIHRoZSBzdGFydCBkaXJlY3Rpb24uIE90aGVyd2lzZSBpZiBpdCBpcyBzb3J0ZWQsIHRoZSBhcnJvdyBzaG91bGQgcG9pbnQgaW4gdGhlIGN1cnJlbnRseVxuICAgKiBhY3RpdmUgc29ydGVkIGRpcmVjdGlvbi4gVGhlIHJlYXNvbiB0aGlzIGlzIHVwZGF0ZWQgdGhyb3VnaCBhIGZ1bmN0aW9uIGlzIGJlY2F1c2UgdGhlIGRpcmVjdGlvblxuICAgKiBzaG91bGQgb25seSBiZSBjaGFuZ2VkIGF0IHNwZWNpZmljIHRpbWVzIC0gd2hlbiBkZWFjdGl2YXRlZCBidXQgdGhlIGhpbnQgaXMgZGlzcGxheWVkIGFuZCB3aGVuXG4gICAqIHRoZSBzb3J0IGlzIGFjdGl2ZSBhbmQgdGhlIGRpcmVjdGlvbiBjaGFuZ2VzLiBPdGhlcndpc2UgdGhlIGFycm93J3MgZGlyZWN0aW9uIHNob3VsZCBsaW5nZXJcbiAgICogaW4gY2FzZXMgc3VjaCBhcyB0aGUgc29ydCBiZWNvbWluZyBkZWFjdGl2YXRlZCBidXQgd2Ugd2FudCB0byBhbmltYXRlIHRoZSBhcnJvdyBhd2F5IHdoaWxlXG4gICAqIHByZXNlcnZpbmcgaXRzIGRpcmVjdGlvbiwgZXZlbiB0aG91Z2ggdGhlIG5leHQgc29ydCBkaXJlY3Rpb24gaXMgYWN0dWFsbHkgZGlmZmVyZW50IGFuZCBzaG91bGRcbiAgICogb25seSBiZSBjaGFuZ2VkIG9uY2UgdGhlIGFycm93IGRpc3BsYXlzIGFnYWluIChoaW50IG9yIGFjdGl2YXRpb24pLlxuICAgKi9cbiAgX3VwZGF0ZUFycm93RGlyZWN0aW9uKCkge1xuICAgIHRoaXMuX2Fycm93RGlyZWN0aW9uID0gdGhpcy5faXNTb3J0ZWQoKSA/XG4gICAgICAgIHRoaXMuX3NvcnQuZGlyZWN0aW9uIDpcbiAgICAgICAgKHRoaXMuc3RhcnQgfHwgdGhpcy5fc29ydC5zdGFydCk7XG4gIH1cblxuICBfaXNEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydC5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGFyaWEtc29ydCBhdHRyaWJ1dGUgdGhhdCBzaG91bGQgYmUgYXBwbGllZCB0byB0aGlzIHNvcnQgaGVhZGVyLiBJZiB0aGlzIGhlYWRlclxuICAgKiBpcyBub3Qgc29ydGVkLCByZXR1cm5zIG51bGwgc28gdGhhdCB0aGUgYXR0cmlidXRlIGlzIHJlbW92ZWQgZnJvbSB0aGUgaG9zdCBlbGVtZW50LiBBcmlhIHNwZWNcbiAgICogc2F5cyB0aGF0IHRoZSBhcmlhLXNvcnQgcHJvcGVydHkgc2hvdWxkIG9ubHkgYmUgcHJlc2VudCBvbiBvbmUgaGVhZGVyIGF0IGEgdGltZSwgc28gcmVtb3ZpbmdcbiAgICogZW5zdXJlcyB0aGlzIGlzIHRydWUuXG4gICAqL1xuICBfZ2V0QXJpYVNvcnRBdHRyaWJ1dGUoKSB7XG4gICAgaWYgKCF0aGlzLl9pc1NvcnRlZCgpKSB7XG4gICAgICByZXR1cm4gJ25vbmUnO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zb3J0LmRpcmVjdGlvbiA9PSAnYXNjJyA/ICdhc2NlbmRpbmcnIDogJ2Rlc2NlbmRpbmcnO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFycm93IGluc2lkZSB0aGUgc29ydCBoZWFkZXIgc2hvdWxkIGJlIHJlbmRlcmVkLiAqL1xuICBfcmVuZGVyQXJyb3coKSB7XG4gICAgcmV0dXJuICF0aGlzLl9pc0Rpc2FibGVkKCkgfHwgdGhpcy5faXNTb3J0ZWQoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGNoYW5nZXMgaW4gdGhlIHNvcnRpbmcgc3RhdGUuICovXG4gIHByaXZhdGUgX2hhbmRsZVN0YXRlQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9yZXJlbmRlclN1YnNjcmlwdGlvbiA9XG4gICAgICBtZXJnZSh0aGlzLl9zb3J0LnNvcnRDaGFuZ2UsIHRoaXMuX3NvcnQuX3N0YXRlQ2hhbmdlcywgdGhpcy5faW50bC5jaGFuZ2VzKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5faXNTb3J0ZWQoKSkge1xuICAgICAgICAgIHRoaXMuX3VwZGF0ZUFycm93RGlyZWN0aW9uKCk7XG5cbiAgICAgICAgICAvLyBEbyBub3Qgc2hvdyB0aGUgYW5pbWF0aW9uIGlmIHRoZSBoZWFkZXIgd2FzIGFscmVhZHkgc2hvd24gaW4gdGhlIHJpZ2h0IHBvc2l0aW9uLlxuICAgICAgICAgIGlmICh0aGlzLl92aWV3U3RhdGUudG9TdGF0ZSA9PT0gJ2hpbnQnIHx8IHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID09PSAnYWN0aXZlJykge1xuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9uLCB0b1N0YXRlOiAnYWN0aXZlJ30pO1xuICAgICAgICAgIHRoaXMuX3Nob3dJbmRpY2F0b3JIaW50ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGlzIGhlYWRlciB3YXMgcmVjZW50bHkgYWN0aXZlIGFuZCBub3cgbm8gbG9uZ2VyIHNvcnRlZCwgYW5pbWF0ZSBhd2F5IHRoZSBhcnJvdy5cbiAgICAgICAgaWYgKCF0aGlzLl9pc1NvcnRlZCgpICYmIHRoaXMuX3ZpZXdTdGF0ZSAmJiB0aGlzLl92aWV3U3RhdGUudG9TdGF0ZSA9PT0gJ2FjdGl2ZScpIHtcbiAgICAgICAgICB0aGlzLl9kaXNhYmxlVmlld1N0YXRlQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6ICdhY3RpdmUnLCB0b1N0YXRlOiB0aGlzLl9hcnJvd0RpcmVjdGlvbn0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlQ2xlYXI6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iLCI8IS0tXG4gIFdlIHNldCB0aGUgYHRhYmluZGV4YCBvbiBhbiBlbGVtZW50IGluc2lkZSB0aGUgdGFibGUgaGVhZGVyLCByYXRoZXIgdGhhbiB0aGUgaGVhZGVyIGl0c2VsZixcbiAgYmVjYXVzZSBvZiBhIGJ1ZyBpbiBOVkRBIHdoZXJlIGhhdmluZyBhIGB0YWJpbmRleGAgb24gYSBgdGhgIGJyZWFrcyBrZXlib2FyZCBuYXZpZ2F0aW9uIGluIHRoZVxuICB0YWJsZSAoc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9udmFjY2Vzcy9udmRhL2lzc3Vlcy83NzE4KS4gVGhpcyBhbGxvd3MgZm9yIHRoZSBoZWFkZXIgdG8gYm90aFxuICBiZSBmb2N1c2FibGUsIGFuZCBoYXZlIHNjcmVlbiByZWFkZXJzIHJlYWQgb3V0IGl0cyBgYXJpYS1zb3J0YCBzdGF0ZS4gV2UgcHJlZmVyIHRoaXMgYXBwcm9hY2hcbiAgb3ZlciBoYXZpbmcgYSBidXR0b24gd2l0aCBhbiBgYXJpYS1sYWJlbGAgaW5zaWRlIHRoZSBoZWFkZXIsIGJlY2F1c2UgdGhlIGJ1dHRvbidzIGBhcmlhLWxhYmVsYFxuICB3aWxsIGJlIHJlYWQgb3V0IGFzIHRoZSB1c2VyIGlzIG5hdmlnYXRpbmcgdGhlIHRhYmxlJ3MgY2VsbCAoc2VlICMxMzAxMikuXG5cbiAgVGhlIGFwcHJvYWNoIGlzIGJhc2VkIG9mZiBvZjogaHR0cHM6Ly9kZXF1ZXVuaXZlcnNpdHkuY29tL2xpYnJhcnkvYXJpYS90YWJsZXMvc2Ytc29ydGFibGUtZ3JpZFxuLS0+XG48ZGl2IGNsYXNzPVwibWF0LXNvcnQtaGVhZGVyLWNvbnRhaW5lciBtYXQtZm9jdXMtaW5kaWNhdG9yXCJcbiAgICAgW2NsYXNzLm1hdC1zb3J0LWhlYWRlci1zb3J0ZWRdPVwiX2lzU29ydGVkKClcIlxuICAgICBbY2xhc3MubWF0LXNvcnQtaGVhZGVyLXBvc2l0aW9uLWJlZm9yZV09XCJhcnJvd1Bvc2l0aW9uID09ICdiZWZvcmUnXCJcbiAgICAgW2F0dHIudGFiaW5kZXhdPVwiX2lzRGlzYWJsZWQoKSA/IG51bGwgOiAwXCJcbiAgICAgcm9sZT1cImJ1dHRvblwiPlxuXG4gIDwhLS1cbiAgICBUT0RPKGNyaXNiZXRvKTogdGhpcyBkaXYgaXNuJ3Qgc3RyaWN0bHkgbmVjZXNzYXJ5LCBidXQgd2UgaGF2ZSB0byBrZWVwIGl0IGR1ZSB0byBhIGxhcmdlXG4gICAgbnVtYmVyIG9mIHNjcmVlbnNob3QgZGlmZiBmYWlsdXJlcy4gSXQgc2hvdWxkIGJlIHJlbW92ZWQgZXZlbnR1YWxseS4gTm90ZSB0aGF0IHRoZSBkaWZmZXJlbmNlXG4gICAgaXNuJ3QgdmlzaWJsZSB3aXRoIGEgc2hvcnRlciBoZWFkZXIsIGJ1dCBvbmNlIGl0IGJyZWFrcyB1cCBpbnRvIG11bHRpcGxlIGxpbmVzLCB0aGlzIGVsZW1lbnRcbiAgICBjYXVzZXMgaXQgdG8gYmUgY2VudGVyLWFsaWduZWQsIHdoZXJlYXMgcmVtb3ZpbmcgaXQgd2lsbCBrZWVwIHRoZSB0ZXh0IHRvIHRoZSBsZWZ0LlxuICAtLT5cbiAgPGRpdiBjbGFzcz1cIm1hdC1zb3J0LWhlYWRlci1jb250ZW50XCI+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICA8L2Rpdj5cblxuICA8IS0tIERpc2FibGUgYW5pbWF0aW9ucyB3aGlsZSBhIGN1cnJlbnQgYW5pbWF0aW9uIGlzIHJ1bm5pbmcgLS0+XG4gIDxkaXYgY2xhc3M9XCJtYXQtc29ydC1oZWFkZXItYXJyb3dcIlxuICAgICAgICpuZ0lmPVwiX3JlbmRlckFycm93KClcIlxuICAgICAgIFtAYXJyb3dPcGFjaXR5XT1cIl9nZXRBcnJvd1ZpZXdTdGF0ZSgpXCJcbiAgICAgICBbQGFycm93UG9zaXRpb25dPVwiX2dldEFycm93Vmlld1N0YXRlKClcIlxuICAgICAgIFtAYWxsb3dDaGlsZHJlbl09XCJfZ2V0QXJyb3dEaXJlY3Rpb25TdGF0ZSgpXCJcbiAgICAgICAoQGFycm93UG9zaXRpb24uc3RhcnQpPVwiX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24gPSB0cnVlXCJcbiAgICAgICAoQGFycm93UG9zaXRpb24uZG9uZSk9XCJfZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IGZhbHNlXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1zb3J0LWhlYWRlci1zdGVtXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1zb3J0LWhlYWRlci1pbmRpY2F0b3JcIiBbQGluZGljYXRvcl09XCJfZ2V0QXJyb3dEaXJlY3Rpb25TdGF0ZSgpXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibWF0LXNvcnQtaGVhZGVyLXBvaW50ZXItbGVmdFwiIFtAbGVmdFBvaW50ZXJdPVwiX2dldEFycm93RGlyZWN0aW9uU3RhdGUoKVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cIm1hdC1zb3J0LWhlYWRlci1wb2ludGVyLXJpZ2h0XCIgW0ByaWdodFBvaW50ZXJdPVwiX2dldEFycm93RGlyZWN0aW9uU3RhdGUoKVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cIm1hdC1zb3J0LWhlYWRlci1wb2ludGVyLW1pZGRsZVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19