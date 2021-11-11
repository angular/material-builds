/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, Optional, ViewEncapsulation, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
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
    _sort, _columnDef, _focusMonitor, _elementRef, 
    /** @breaking-change 14.0.0 _ariaDescriber will be required. */
    _ariaDescriber) {
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
        this._ariaDescriber = _ariaDescriber;
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
        // Default the action description to "Sort" because it's better than nothing.
        // Without a description, the button's label comes from the sort header text content,
        // which doesn't give any indication that it performs a sorting operation.
        this._sortActionDescription = 'Sort';
        if (!_sort && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getSortHeaderNotContainedWithinSortError();
        }
        this._handleStateChanges();
    }
    /**
     * Description applied to MatSortHeader's button element with aria-describedby. This text should
     * describe the action that will occur when the user clicks the sort header.
     */
    get sortActionDescription() {
        return this._sortActionDescription;
    }
    set sortActionDescription(value) {
        this._updateSortActionDescription(value);
    }
    /** Overrides the disable clear value of the containing MatSort for this MatSortable. */
    get disableClear() {
        return this._disableClear;
    }
    set disableClear(v) {
        this._disableClear = coerceBooleanProperty(v);
    }
    ngOnInit() {
        if (!this.id && this._columnDef) {
            this.id = this._columnDef.name;
        }
        // Initialize the direction of the arrow and set the view state to be immediately that state.
        this._updateArrowDirection();
        this._setAnimationTransitionState({
            toState: this._isSorted() ? 'active' : this._arrowDirection,
        });
        this._sort.register(this);
        this._sortButton = this._elementRef.nativeElement.querySelector('[role="button"]');
        this._updateSortActionDescription(this._sortActionDescription);
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
        return (this._sort.active == this.id &&
            (this._sort.direction === 'asc' || this._sort.direction === 'desc'));
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
        this._arrowDirection = this._isSorted() ? this._sort.direction : this.start || this._sort.start;
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
    _updateSortActionDescription(newDescription) {
        // We use AriaDescriber for the sort button instead of setting an `aria-label` because some
        // screen readers (notably VoiceOver) will read both the column header *and* the button's label
        // for every *cell* in the table, creating a lot of unnecessary noise.
        // If _sortButton is undefined, the component hasn't been initialized yet so there's
        // nothing to update in the DOM.
        if (this._sortButton) {
            // removeDescription will no-op if there is no existing message.
            // TODO(jelbourn): remove optional chaining when AriaDescriber is required.
            this._ariaDescriber?.removeDescription(this._sortButton, this._sortActionDescription);
            this._ariaDescriber?.describe(this._sortButton, newDescription);
        }
        this._sortActionDescription = newDescription;
    }
    /** Handles changes in the sorting state. */
    _handleStateChanges() {
        this._rerenderSubscription = merge(this._sort.sortChange, this._sort._stateChanges, this._intl.changes).subscribe(() => {
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
MatSortHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatSortHeader, deps: [{ token: i1.MatSortHeaderIntl }, { token: i0.ChangeDetectorRef }, { token: i2.MatSort, optional: true }, { token: 'MAT_SORT_HEADER_COLUMN_DEF', optional: true }, { token: i3.FocusMonitor }, { token: i0.ElementRef }, { token: i3.AriaDescriber, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatSortHeader.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.1", type: MatSortHeader, selector: "[mat-sort-header]", inputs: { disabled: "disabled", id: ["mat-sort-header", "id"], arrowPosition: "arrowPosition", start: "start", sortActionDescription: "sortActionDescription", disableClear: "disableClear" }, host: { listeners: { "click": "_handleClick()", "keydown": "_handleKeydown($event)", "mouseenter": "_setIndicatorHintVisible(true)", "mouseleave": "_setIndicatorHintVisible(false)" }, properties: { "attr.aria-sort": "_getAriaSortAttribute()", "class.mat-sort-header-disabled": "_isDisabled()" }, classAttribute: "mat-sort-header" }, exportAs: ["matSortHeader"], usesInheritance: true, ngImport: i0, template: "<!--\n  We set the `tabindex` on an element inside the table header, rather than the header itself,\n  because of a bug in NVDA where having a `tabindex` on a `th` breaks keyboard navigation in the\n  table (see https://github.com/nvaccess/nvda/issues/7718). This allows for the header to both\n  be focusable, and have screen readers read out its `aria-sort` state. We prefer this approach\n  over having a button with an `aria-label` inside the header, because the button's `aria-label`\n  will be read out as the user is navigating the table's cell (see #13012).\n\n  The approach is based off of: https://dequeuniversity.com/library/aria/tables/sf-sortable-grid\n-->\n<div class=\"mat-sort-header-container mat-focus-indicator\"\n     [class.mat-sort-header-sorted]=\"_isSorted()\"\n     [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\"\n     [attr.tabindex]=\"_isDisabled() ? null : 0\"\n     role=\"button\">\n\n  <!--\n    TODO(crisbeto): this div isn't strictly necessary, but we have to keep it due to a large\n    number of screenshot diff failures. It should be removed eventually. Note that the difference\n    isn't visible with a shorter header, but once it breaks up into multiple lines, this element\n    causes it to be center-aligned, whereas removing it will keep the text to the left.\n  -->\n  <div class=\"mat-sort-header-content\">\n    <ng-content></ng-content>\n  </div>\n\n  <!-- Disable animations while a current animation is running -->\n  <div class=\"mat-sort-header-arrow\"\n       *ngIf=\"_renderArrow()\"\n       [@arrowOpacity]=\"_getArrowViewState()\"\n       [@arrowPosition]=\"_getArrowViewState()\"\n       [@allowChildren]=\"_getArrowDirectionState()\"\n       (@arrowPosition.start)=\"_disableViewStateAnimation = true\"\n       (@arrowPosition.done)=\"_disableViewStateAnimation = false\">\n    <div class=\"mat-sort-header-stem\"></div>\n    <div class=\"mat-sort-header-indicator\" [@indicator]=\"_getArrowDirectionState()\">\n      <div class=\"mat-sort-header-pointer-left\" [@leftPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-right\" [@rightPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-middle\"></div>\n    </div>\n  </div>\n</div>\n", styles: [".mat-sort-header-container{display:flex;cursor:pointer;align-items:center;letter-spacing:normal;outline:0}[mat-sort-header].cdk-keyboard-focused .mat-sort-header-container,[mat-sort-header].cdk-program-focused .mat-sort-header-container{border-bottom:solid 1px currentColor}.mat-sort-header-disabled .mat-sort-header-container{cursor:default}.mat-sort-header-content{text-align:center;display:flex;align-items:center}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-arrow{height:12px;width:12px;min-width:12px;position:relative;display:flex;opacity:0}.mat-sort-header-arrow,[dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow{margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow,[dir=rtl] .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-stem{background:currentColor;height:10px;width:2px;margin:auto;display:flex;align-items:center}.cdk-high-contrast-active .mat-sort-header-stem{width:0;border-left:solid 2px}.mat-sort-header-indicator{width:100%;height:2px;display:flex;align-items:center;position:absolute;top:0;left:0}.mat-sort-header-pointer-middle{margin:auto;height:2px;width:2px;background:currentColor;transform:rotate(45deg)}.cdk-high-contrast-active .mat-sort-header-pointer-middle{width:0;height:0;border-top:solid 2px;border-left:solid 2px}.mat-sort-header-pointer-left,.mat-sort-header-pointer-right{background:currentColor;width:6px;height:2px;position:absolute;top:0}.cdk-high-contrast-active .mat-sort-header-pointer-left,.cdk-high-contrast-active .mat-sort-header-pointer-right{width:0;height:0;border-left:solid 6px;border-top:solid 2px}.mat-sort-header-pointer-left{transform-origin:right;left:0}.mat-sort-header-pointer-right{transform-origin:left;right:0}\n"], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], animations: [
        matSortAnimations.indicator,
        matSortAnimations.leftPointer,
        matSortAnimations.rightPointer,
        matSortAnimations.arrowOpacity,
        matSortAnimations.arrowPosition,
        matSortAnimations.allowChildren,
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatSortHeader, decorators: [{
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
                }] }, { type: i3.FocusMonitor }, { type: i0.ElementRef }, { type: i3.AriaDescriber, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { id: [{
                type: Input,
                args: ['mat-sort-header']
            }], arrowPosition: [{
                type: Input
            }], start: [{
                type: Input
            }], sortActionDescription: [{
                type: Input
            }], disableClear: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc29ydC9zb3J0LWhlYWRlci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3NvcnQtaGVhZGVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFnQixZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFHTCxRQUFRLEVBQ1IsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBYSxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRSxPQUFPLEVBQUMsS0FBSyxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxPQUFPLEVBQWMsTUFBTSxRQUFRLENBQUM7QUFDNUMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFcEQsT0FBTyxFQUFDLHdDQUF3QyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDOzs7Ozs7QUFFckQsc0RBQXNEO0FBQ3RELG9CQUFvQjtBQUNwQixNQUFNLGtCQUFrQixHQUFHLGFBQWEsQ0FBQztDQUFRLENBQUMsQ0FBQztBQTJCbkQ7Ozs7Ozs7O0dBUUc7QUEyQkgsTUFBTSxPQUFPLGFBQ1gsU0FBUSxrQkFBa0I7SUFzRTFCO0lBQ0U7OztPQUdHO0lBQ0ksS0FBd0IsRUFDdkIsa0JB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LFlBQVk7d0JBQzlCLGlCQUFpQixDQUFDLGFBQWE7d0JBQy9CLGlCQUFpQixDQUFDLGFBQWE7cUJBQ2hDOzswQkFrRkUsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyw0QkFBNEI7OzBCQUNuQyxRQUFROzswQkFLUixRQUFROzRDQWxEZSxFQUFFO3NCQUEzQixLQUFLO3VCQUFDLGlCQUFpQjtnQkFHZixhQUFhO3NCQUFyQixLQUFLO2dCQUdHLEtBQUs7c0JBQWIsS0FBSztnQkFPRixxQkFBcUI7c0JBRHhCLEtBQUs7Z0JBY0YsWUFBWTtzQkFEZixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QXJpYURlc2NyaWJlciwgRm9jdXNNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFTlRFUiwgU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkRpc2FibGUsIG1peGluRGlzYWJsZWR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHttZXJnZSwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWF0U29ydCwgTWF0U29ydGFibGV9IGZyb20gJy4vc29ydCc7XG5pbXBvcnQge21hdFNvcnRBbmltYXRpb25zfSBmcm9tICcuL3NvcnQtYW5pbWF0aW9ucyc7XG5pbXBvcnQge1NvcnREaXJlY3Rpb259IGZyb20gJy4vc29ydC1kaXJlY3Rpb24nO1xuaW1wb3J0IHtnZXRTb3J0SGVhZGVyTm90Q29udGFpbmVkV2l0aGluU29ydEVycm9yfSBmcm9tICcuL3NvcnQtZXJyb3JzJztcbmltcG9ydCB7TWF0U29ydEhlYWRlckludGx9IGZyb20gJy4vc29ydC1oZWFkZXItaW50bCc7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gdGhlIHNvcnQgaGVhZGVyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRTb3J0SGVhZGVyQmFzZSA9IG1peGluRGlzYWJsZWQoY2xhc3Mge30pO1xuXG4vKipcbiAqIFZhbGlkIHBvc2l0aW9ucyBmb3IgdGhlIGFycm93IHRvIGJlIGluIGZvciBpdHMgb3BhY2l0eSBhbmQgdHJhbnNsYXRpb24uIElmIHRoZSBzdGF0ZSBpcyBhXG4gKiBzb3J0IGRpcmVjdGlvbiwgdGhlIHBvc2l0aW9uIG9mIHRoZSBhcnJvdyB3aWxsIGJlIGFib3ZlL2JlbG93IGFuZCBvcGFjaXR5IDAuIElmIHRoZSBzdGF0ZSBpc1xuICogaGludCwgdGhlIGFycm93IHdpbGwgYmUgaW4gdGhlIGNlbnRlciB3aXRoIGEgc2xpZ2h0IG9wYWNpdHkuIEFjdGl2ZSBzdGF0ZSBtZWFucyB0aGUgYXJyb3cgd2lsbFxuICogYmUgZnVsbHkgb3BhcXVlIGluIHRoZSBjZW50ZXIuXG4gKlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgdHlwZSBBcnJvd1ZpZXdTdGF0ZSA9IFNvcnREaXJlY3Rpb24gfCAnaGludCcgfCAnYWN0aXZlJztcblxuLyoqXG4gKiBTdGF0ZXMgZGVzY3JpYmluZyB0aGUgYXJyb3cncyBhbmltYXRlZCBwb3NpdGlvbiAoYW5pbWF0aW5nIGZyb21TdGF0ZSB0byB0b1N0YXRlKS5cbiAqIElmIHRoZSBmcm9tU3RhdGUgaXMgbm90IGRlZmluZWQsIHRoZXJlIHdpbGwgYmUgbm8gYW5pbWF0ZWQgdHJhbnNpdGlvbiB0byB0aGUgdG9TdGF0ZS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb24ge1xuICBmcm9tU3RhdGU/OiBBcnJvd1ZpZXdTdGF0ZTtcbiAgdG9TdGF0ZT86IEFycm93Vmlld1N0YXRlO1xufVxuXG4vKiogQ29sdW1uIGRlZmluaXRpb24gYXNzb2NpYXRlZCB3aXRoIGEgYE1hdFNvcnRIZWFkZXJgLiAqL1xuaW50ZXJmYWNlIE1hdFNvcnRIZWFkZXJDb2x1bW5EZWYge1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQXBwbGllcyBzb3J0aW5nIGJlaGF2aW9yIChjbGljayB0byBjaGFuZ2Ugc29ydCkgYW5kIHN0eWxlcyB0byBhbiBlbGVtZW50LCBpbmNsdWRpbmcgYW5cbiAqIGFycm93IHRvIGRpc3BsYXkgdGhlIGN1cnJlbnQgc29ydCBkaXJlY3Rpb24uXG4gKlxuICogTXVzdCBiZSBwcm92aWRlZCB3aXRoIGFuIGlkIGFuZCBjb250YWluZWQgd2l0aGluIGEgcGFyZW50IE1hdFNvcnQgZGlyZWN0aXZlLlxuICpcbiAqIElmIHVzZWQgb24gaGVhZGVyIGNlbGxzIGluIGEgQ2RrVGFibGUsIGl0IHdpbGwgYXV0b21hdGljYWxseSBkZWZhdWx0IGl0cyBpZCBmcm9tIGl0cyBjb250YWluaW5nXG4gKiBjb2x1bW4gZGVmaW5pdGlvbi5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW21hdC1zb3J0LWhlYWRlcl0nLFxuICBleHBvcnRBczogJ21hdFNvcnRIZWFkZXInLFxuICB0ZW1wbGF0ZVVybDogJ3NvcnQtaGVhZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc29ydC1oZWFkZXIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXNvcnQtaGVhZGVyJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soKScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKG1vdXNlZW50ZXIpJzogJ19zZXRJbmRpY2F0b3JIaW50VmlzaWJsZSh0cnVlKScsXG4gICAgJyhtb3VzZWxlYXZlKSc6ICdfc2V0SW5kaWNhdG9ySGludFZpc2libGUoZmFsc2UpJyxcbiAgICAnW2F0dHIuYXJpYS1zb3J0XSc6ICdfZ2V0QXJpYVNvcnRBdHRyaWJ1dGUoKScsXG4gICAgJ1tjbGFzcy5tYXQtc29ydC1oZWFkZXItZGlzYWJsZWRdJzogJ19pc0Rpc2FibGVkKCknLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5pbmRpY2F0b3IsXG4gICAgbWF0U29ydEFuaW1hdGlvbnMubGVmdFBvaW50ZXIsXG4gICAgbWF0U29ydEFuaW1hdGlvbnMucmlnaHRQb2ludGVyLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmFycm93T3BhY2l0eSxcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5hcnJvd1Bvc2l0aW9uLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmFsbG93Q2hpbGRyZW4sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNvcnRIZWFkZXJcbiAgZXh0ZW5kcyBfTWF0U29ydEhlYWRlckJhc2VcbiAgaW1wbGVtZW50cyBDYW5EaXNhYmxlLCBNYXRTb3J0YWJsZSwgT25EZXN0cm95LCBPbkluaXQsIEFmdGVyVmlld0luaXRcbntcbiAgcHJpdmF0ZSBfcmVyZW5kZXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKipcbiAgICogVGhlIGVsZW1lbnQgd2l0aCByb2xlPVwiYnV0dG9uXCIgaW5zaWRlIHRoaXMgY29tcG9uZW50J3Mgdmlldy4gV2UgbmVlZCB0aGlzXG4gICAqIGluIG9yZGVyIHRvIGFwcGx5IGEgZGVzY3JpcHRpb24gd2l0aCBBcmlhRGVzY3JpYmVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfc29ydEJ1dHRvbjogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIEZsYWcgc2V0IHRvIHRydWUgd2hlbiB0aGUgaW5kaWNhdG9yIHNob3VsZCBiZSBkaXNwbGF5ZWQgd2hpbGUgdGhlIHNvcnQgaXMgbm90IGFjdGl2ZS4gVXNlZCB0b1xuICAgKiBwcm92aWRlIGFuIGFmZm9yZGFuY2UgdGhhdCB0aGUgaGVhZGVyIGlzIHNvcnRhYmxlIGJ5IHNob3dpbmcgb24gZm9jdXMgYW5kIGhvdmVyLlxuICAgKi9cbiAgX3Nob3dJbmRpY2F0b3JIaW50OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSB2aWV3IHRyYW5zaXRpb24gc3RhdGUgb2YgdGhlIGFycm93ICh0cmFuc2xhdGlvbi8gb3BhY2l0eSkgLSBpbmRpY2F0ZXMgaXRzIGBmcm9tYCBhbmQgYHRvYFxuICAgKiBwb3NpdGlvbiB0aHJvdWdoIHRoZSBhbmltYXRpb24uIElmIGFuaW1hdGlvbnMgYXJlIGN1cnJlbnRseSBkaXNhYmxlZCwgdGhlIGZyb21TdGF0ZSBpcyByZW1vdmVkXG4gICAqIHNvIHRoYXQgdGhlcmUgaXMgbm8gYW5pbWF0aW9uIGRpc3BsYXllZC5cbiAgICovXG4gIF92aWV3U3RhdGU6IEFycm93Vmlld1N0YXRlVHJhbnNpdGlvbiA9IHt9O1xuXG4gIC8qKiBUaGUgZGlyZWN0aW9uIHRoZSBhcnJvdyBzaG91bGQgYmUgZmFjaW5nIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBzdGF0ZS4gKi9cbiAgX2Fycm93RGlyZWN0aW9uOiBTb3J0RGlyZWN0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHZpZXcgc3RhdGUgYW5pbWF0aW9uIHNob3VsZCBzaG93IHRoZSB0cmFuc2l0aW9uIGJldHdlZW4gdGhlIGBmcm9tYCBhbmQgYHRvYCBzdGF0ZXMuXG4gICAqL1xuICBfZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJRCBvZiB0aGlzIHNvcnQgaGVhZGVyLiBJZiB1c2VkIHdpdGhpbiB0aGUgY29udGV4dCBvZiBhIENka0NvbHVtbkRlZiwgdGhpcyB3aWxsIGRlZmF1bHQgdG9cbiAgICogdGhlIGNvbHVtbidzIG5hbWUuXG4gICAqL1xuICBASW5wdXQoJ21hdC1zb3J0LWhlYWRlcicpIGlkOiBzdHJpbmc7XG5cbiAgLyoqIFNldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBhcnJvdyB0aGF0IGRpc3BsYXlzIHdoZW4gc29ydGVkLiAqL1xuICBASW5wdXQoKSBhcnJvd1Bvc2l0aW9uOiAnYmVmb3JlJyB8ICdhZnRlcicgPSAnYWZ0ZXInO1xuXG4gIC8qKiBPdmVycmlkZXMgdGhlIHNvcnQgc3RhcnQgdmFsdWUgb2YgdGhlIGNvbnRhaW5pbmcgTWF0U29ydCBmb3IgdGhpcyBNYXRTb3J0YWJsZS4gKi9cbiAgQElucHV0KCkgc3RhcnQ6ICdhc2MnIHwgJ2Rlc2MnO1xuXG4gIC8qKlxuICAgKiBEZXNjcmlwdGlvbiBhcHBsaWVkIHRvIE1hdFNvcnRIZWFkZXIncyBidXR0b24gZWxlbWVudCB3aXRoIGFyaWEtZGVzY3JpYmVkYnkuIFRoaXMgdGV4dCBzaG91bGRcbiAgICogZGVzY3JpYmUgdGhlIGFjdGlvbiB0aGF0IHdpbGwgb2NjdXIgd2hlbiB0aGUgdXNlciBjbGlja3MgdGhlIHNvcnQgaGVhZGVyLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHNvcnRBY3Rpb25EZXNjcmlwdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9zb3J0QWN0aW9uRGVzY3JpcHRpb247XG4gIH1cbiAgc2V0IHNvcnRBY3Rpb25EZXNjcmlwdGlvbih2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdXBkYXRlU29ydEFjdGlvbkRlc2NyaXB0aW9uKHZhbHVlKTtcbiAgfVxuICAvLyBEZWZhdWx0IHRoZSBhY3Rpb24gZGVzY3JpcHRpb24gdG8gXCJTb3J0XCIgYmVjYXVzZSBpdCdzIGJldHRlciB0aGFuIG5vdGhpbmcuXG4gIC8vIFdpdGhvdXQgYSBkZXNjcmlwdGlvbiwgdGhlIGJ1dHRvbidzIGxhYmVsIGNvbWVzIGZyb20gdGhlIHNvcnQgaGVhZGVyIHRleHQgY29udGVudCxcbiAgLy8gd2hpY2ggZG9lc24ndCBnaXZlIGFueSBpbmRpY2F0aW9uIHRoYXQgaXQgcGVyZm9ybXMgYSBzb3J0aW5nIG9wZXJhdGlvbi5cbiAgcHJpdmF0ZSBfc29ydEFjdGlvbkRlc2NyaXB0aW9uOiBzdHJpbmcgPSAnU29ydCc7XG5cbiAgLyoqIE92ZXJyaWRlcyB0aGUgZGlzYWJsZSBjbGVhciB2YWx1ZSBvZiB0aGUgY29udGFpbmluZyBNYXRTb3J0IGZvciB0aGlzIE1hdFNvcnRhYmxlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZUNsZWFyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlQ2xlYXI7XG4gIH1cbiAgc2V0IGRpc2FibGVDbGVhcih2KSB7XG4gICAgdGhpcy5fZGlzYWJsZUNsZWFyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVDbGVhcjogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBgX2ludGxgIHBhcmFtZXRlciBpc24ndCBiZWluZyB1c2VkIGFueW1vcmUgYW5kIGl0J2xsIGJlIHJlbW92ZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxMy4wLjBcbiAgICAgKi9cbiAgICBwdWJsaWMgX2ludGw6IE1hdFNvcnRIZWFkZXJJbnRsLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAvLyBgTWF0U29ydGAgaXMgbm90IG9wdGlvbmFsbHkgaW5qZWN0ZWQsIGJ1dCBqdXN0IGFzc2VydGVkIG1hbnVhbGx5IHcvIGJldHRlciBlcnJvci5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGxpZ2h0d2VpZ2h0LXRva2Vuc1xuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfc29ydDogTWF0U29ydCxcbiAgICBASW5qZWN0KCdNQVRfU09SVF9IRUFERVJfQ09MVU1OX0RFRicpXG4gICAgQE9wdGlvbmFsKClcbiAgICBwdWJsaWMgX2NvbHVtbkRlZjogTWF0U29ydEhlYWRlckNvbHVtbkRlZixcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAvKiogQGJyZWFraW5nLWNoYW5nZSAxNC4wLjAgX2FyaWFEZXNjcmliZXIgd2lsbCBiZSByZXF1aXJlZC4gKi9cbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9hcmlhRGVzY3JpYmVyPzogQXJpYURlc2NyaWJlciB8IG51bGwsXG4gICkge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSB1c2UgYSBzdHJpbmcgdG9rZW4gZm9yIHRoZSBgX2NvbHVtbkRlZmAsIGJlY2F1c2UgdGhlIHZhbHVlIGlzIHByb3ZpZGVkIGJvdGggYnlcbiAgICAvLyBgbWF0ZXJpYWwvdGFibGVgIGFuZCBgY2RrL3RhYmxlYCBhbmQgd2UgY2FuJ3QgaGF2ZSB0aGUgQ0RLIGRlcGVuZGluZyBvbiBNYXRlcmlhbCxcbiAgICAvLyBhbmQgd2Ugd2FudCB0byBhdm9pZCBoYXZpbmcgdGhlIHNvcnQgaGVhZGVyIGRlcGVuZGluZyBvbiB0aGUgQ0RLIHRhYmxlIGJlY2F1c2VcbiAgICAvLyBvZiB0aGlzIHNpbmdsZSByZWZlcmVuY2UuXG4gICAgc3VwZXIoKTtcblxuICAgIGlmICghX3NvcnQgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IGdldFNvcnRIZWFkZXJOb3RDb250YWluZWRXaXRoaW5Tb3J0RXJyb3IoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9oYW5kbGVTdGF0ZUNoYW5nZXMoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5pZCAmJiB0aGlzLl9jb2x1bW5EZWYpIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLl9jb2x1bW5EZWYubmFtZTtcbiAgICB9XG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSBkaXJlY3Rpb24gb2YgdGhlIGFycm93IGFuZCBzZXQgdGhlIHZpZXcgc3RhdGUgdG8gYmUgaW1tZWRpYXRlbHkgdGhhdCBzdGF0ZS5cbiAgICB0aGlzLl91cGRhdGVBcnJvd0RpcmVjdGlvbigpO1xuICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh7XG4gICAgICB0b1N0YXRlOiB0aGlzLl9pc1NvcnRlZCgpID8gJ2FjdGl2ZScgOiB0aGlzLl9hcnJvd0RpcmVjdGlvbixcbiAgICB9KTtcblxuICAgIHRoaXMuX3NvcnQucmVnaXN0ZXIodGhpcyk7XG5cbiAgICB0aGlzLl9zb3J0QnV0dG9uID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tyb2xlPVwiYnV0dG9uXCJdJykhO1xuICAgIHRoaXMuX3VwZGF0ZVNvcnRBY3Rpb25EZXNjcmlwdGlvbih0aGlzLl9zb3J0QWN0aW9uRGVzY3JpcHRpb24pO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIFdlIHVzZSB0aGUgZm9jdXMgbW9uaXRvciBiZWNhdXNlIHdlIGFsc28gd2FudCB0byBzdHlsZVxuICAgIC8vIHRoaW5ncyBkaWZmZXJlbnRseSBiYXNlZCBvbiB0aGUgZm9jdXMgb3JpZ2luLlxuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpLnN1YnNjcmliZShvcmlnaW4gPT4ge1xuICAgICAgY29uc3QgbmV3U3RhdGUgPSAhIW9yaWdpbjtcbiAgICAgIGlmIChuZXdTdGF0ZSAhPT0gdGhpcy5fc2hvd0luZGljYXRvckhpbnQpIHtcbiAgICAgICAgdGhpcy5fc2V0SW5kaWNhdG9ySGludFZpc2libGUobmV3U3RhdGUpO1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgICB0aGlzLl9zb3J0LmRlcmVnaXN0ZXIodGhpcyk7XG4gICAgdGhpcy5fcmVyZW5kZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBcImhpbnRcIiBzdGF0ZSBzdWNoIHRoYXQgdGhlIGFycm93IHdpbGwgYmUgc2VtaS10cmFuc3BhcmVudGx5IGRpc3BsYXllZCBhcyBhIGhpbnQgdG8gdGhlXG4gICAqIHVzZXIgc2hvd2luZyB3aGF0IHRoZSBhY3RpdmUgc29ydCB3aWxsIGJlY29tZS4gSWYgc2V0IHRvIGZhbHNlLCB0aGUgYXJyb3cgd2lsbCBmYWRlIGF3YXkuXG4gICAqL1xuICBfc2V0SW5kaWNhdG9ySGludFZpc2libGUodmlzaWJsZTogYm9vbGVhbikge1xuICAgIC8vIE5vLW9wIGlmIHRoZSBzb3J0IGhlYWRlciBpcyBkaXNhYmxlZCAtIHNob3VsZCBub3QgbWFrZSB0aGUgaGludCB2aXNpYmxlLlxuICAgIGlmICh0aGlzLl9pc0Rpc2FibGVkKCkgJiYgdmlzaWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3Nob3dJbmRpY2F0b3JIaW50ID0gdmlzaWJsZTtcblxuICAgIGlmICghdGhpcy5faXNTb3J0ZWQoKSkge1xuICAgICAgdGhpcy5fdXBkYXRlQXJyb3dEaXJlY3Rpb24oKTtcbiAgICAgIGlmICh0aGlzLl9zaG93SW5kaWNhdG9ySGludCkge1xuICAgICAgICB0aGlzLl9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUoe2Zyb21TdGF0ZTogdGhpcy5fYXJyb3dEaXJlY3Rpb24sIHRvU3RhdGU6ICdoaW50J30pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6ICdoaW50JywgdG9TdGF0ZTogdGhpcy5fYXJyb3dEaXJlY3Rpb259KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYW5pbWF0aW9uIHRyYW5zaXRpb24gdmlldyBzdGF0ZSBmb3IgdGhlIGFycm93J3MgcG9zaXRpb24gYW5kIG9wYWNpdHkuIElmIHRoZVxuICAgKiBgZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbmAgZmxhZyBpcyBzZXQgdG8gdHJ1ZSwgdGhlIGBmcm9tU3RhdGVgIHdpbGwgYmUgaWdub3JlZCBzbyB0aGF0XG4gICAqIG5vIGFuaW1hdGlvbiBhcHBlYXJzLlxuICAgKi9cbiAgX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh2aWV3U3RhdGU6IEFycm93Vmlld1N0YXRlVHJhbnNpdGlvbikge1xuICAgIHRoaXMuX3ZpZXdTdGF0ZSA9IHZpZXdTdGF0ZSB8fCB7fTtcblxuICAgIC8vIElmIHRoZSBhbmltYXRpb24gZm9yIGFycm93IHBvc2l0aW9uIHN0YXRlIChvcGFjaXR5L3RyYW5zbGF0aW9uKSBzaG91bGQgYmUgZGlzYWJsZWQsXG4gICAgLy8gcmVtb3ZlIHRoZSBmcm9tU3RhdGUgc28gdGhhdCBpdCBqdW1wcyByaWdodCB0byB0aGUgdG9TdGF0ZS5cbiAgICBpZiAodGhpcy5fZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbikge1xuICAgICAgdGhpcy5fdmlld1N0YXRlID0ge3RvU3RhdGU6IHZpZXdTdGF0ZS50b1N0YXRlfTtcbiAgICB9XG4gIH1cblxuICAvKiogVHJpZ2dlcnMgdGhlIHNvcnQgb24gdGhpcyBzb3J0IGhlYWRlciBhbmQgcmVtb3ZlcyB0aGUgaW5kaWNhdG9yIGhpbnQuICovXG4gIF90b2dnbGVPbkludGVyYWN0aW9uKCkge1xuICAgIHRoaXMuX3NvcnQuc29ydCh0aGlzKTtcblxuICAgIC8vIERvIG5vdCBzaG93IHRoZSBhbmltYXRpb24gaWYgdGhlIGhlYWRlciB3YXMgYWxyZWFkeSBzaG93biBpbiB0aGUgcmlnaHQgcG9zaXRpb24uXG4gICAgaWYgKHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID09PSAnaGludCcgfHwgdGhpcy5fdmlld1N0YXRlLnRvU3RhdGUgPT09ICdhY3RpdmUnKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlVmlld1N0YXRlQW5pbWF0aW9uID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlQ2xpY2soKSB7XG4gICAgaWYgKCF0aGlzLl9pc0Rpc2FibGVkKCkpIHtcbiAgICAgIHRoaXMuX3NvcnQuc29ydCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICghdGhpcy5faXNEaXNhYmxlZCgpICYmIChldmVudC5rZXlDb2RlID09PSBTUEFDRSB8fCBldmVudC5rZXlDb2RlID09PSBFTlRFUikpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLl90b2dnbGVPbkludGVyYWN0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBNYXRTb3J0SGVhZGVyIGlzIGN1cnJlbnRseSBzb3J0ZWQgaW4gZWl0aGVyIGFzY2VuZGluZyBvciBkZXNjZW5kaW5nIG9yZGVyLiAqL1xuICBfaXNTb3J0ZWQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX3NvcnQuYWN0aXZlID09IHRoaXMuaWQgJiZcbiAgICAgICh0aGlzLl9zb3J0LmRpcmVjdGlvbiA9PT0gJ2FzYycgfHwgdGhpcy5fc29ydC5kaXJlY3Rpb24gPT09ICdkZXNjJylcbiAgICApO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGFuaW1hdGlvbiBzdGF0ZSBmb3IgdGhlIGFycm93IGRpcmVjdGlvbiAoaW5kaWNhdG9yIGFuZCBwb2ludGVycykuICovXG4gIF9nZXRBcnJvd0RpcmVjdGlvblN0YXRlKCkge1xuICAgIHJldHVybiBgJHt0aGlzLl9pc1NvcnRlZCgpID8gJ2FjdGl2ZS0nIDogJyd9JHt0aGlzLl9hcnJvd0RpcmVjdGlvbn1gO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGFycm93IHBvc2l0aW9uIHN0YXRlIChvcGFjaXR5LCB0cmFuc2xhdGlvbikuICovXG4gIF9nZXRBcnJvd1ZpZXdTdGF0ZSgpIHtcbiAgICBjb25zdCBmcm9tU3RhdGUgPSB0aGlzLl92aWV3U3RhdGUuZnJvbVN0YXRlO1xuICAgIHJldHVybiAoZnJvbVN0YXRlID8gYCR7ZnJvbVN0YXRlfS10by1gIDogJycpICsgdGhpcy5fdmlld1N0YXRlLnRvU3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgZGlyZWN0aW9uIHRoZSBhcnJvdyBzaG91bGQgYmUgcG9pbnRpbmcuIElmIGl0IGlzIG5vdCBzb3J0ZWQsIHRoZSBhcnJvdyBzaG91bGQgYmVcbiAgICogZmFjaW5nIHRoZSBzdGFydCBkaXJlY3Rpb24uIE90aGVyd2lzZSBpZiBpdCBpcyBzb3J0ZWQsIHRoZSBhcnJvdyBzaG91bGQgcG9pbnQgaW4gdGhlIGN1cnJlbnRseVxuICAgKiBhY3RpdmUgc29ydGVkIGRpcmVjdGlvbi4gVGhlIHJlYXNvbiB0aGlzIGlzIHVwZGF0ZWQgdGhyb3VnaCBhIGZ1bmN0aW9uIGlzIGJlY2F1c2UgdGhlIGRpcmVjdGlvblxuICAgKiBzaG91bGQgb25seSBiZSBjaGFuZ2VkIGF0IHNwZWNpZmljIHRpbWVzIC0gd2hlbiBkZWFjdGl2YXRlZCBidXQgdGhlIGhpbnQgaXMgZGlzcGxheWVkIGFuZCB3aGVuXG4gICAqIHRoZSBzb3J0IGlzIGFjdGl2ZSBhbmQgdGhlIGRpcmVjdGlvbiBjaGFuZ2VzLiBPdGhlcndpc2UgdGhlIGFycm93J3MgZGlyZWN0aW9uIHNob3VsZCBsaW5nZXJcbiAgICogaW4gY2FzZXMgc3VjaCBhcyB0aGUgc29ydCBiZWNvbWluZyBkZWFjdGl2YXRlZCBidXQgd2Ugd2FudCB0byBhbmltYXRlIHRoZSBhcnJvdyBhd2F5IHdoaWxlXG4gICAqIHByZXNlcnZpbmcgaXRzIGRpcmVjdGlvbiwgZXZlbiB0aG91Z2ggdGhlIG5leHQgc29ydCBkaXJlY3Rpb24gaXMgYWN0dWFsbHkgZGlmZmVyZW50IGFuZCBzaG91bGRcbiAgICogb25seSBiZSBjaGFuZ2VkIG9uY2UgdGhlIGFycm93IGRpc3BsYXlzIGFnYWluIChoaW50IG9yIGFjdGl2YXRpb24pLlxuICAgKi9cbiAgX3VwZGF0ZUFycm93RGlyZWN0aW9uKCkge1xuICAgIHRoaXMuX2Fycm93RGlyZWN0aW9uID0gdGhpcy5faXNTb3J0ZWQoKSA/IHRoaXMuX3NvcnQuZGlyZWN0aW9uIDogdGhpcy5zdGFydCB8fCB0aGlzLl9zb3J0LnN0YXJ0O1xuICB9XG5cbiAgX2lzRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnQuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBhcmlhLXNvcnQgYXR0cmlidXRlIHRoYXQgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhpcyBzb3J0IGhlYWRlci4gSWYgdGhpcyBoZWFkZXJcbiAgICogaXMgbm90IHNvcnRlZCwgcmV0dXJucyBudWxsIHNvIHRoYXQgdGhlIGF0dHJpYnV0ZSBpcyByZW1vdmVkIGZyb20gdGhlIGhvc3QgZWxlbWVudC4gQXJpYSBzcGVjXG4gICAqIHNheXMgdGhhdCB0aGUgYXJpYS1zb3J0IHByb3BlcnR5IHNob3VsZCBvbmx5IGJlIHByZXNlbnQgb24gb25lIGhlYWRlciBhdCBhIHRpbWUsIHNvIHJlbW92aW5nXG4gICAqIGVuc3VyZXMgdGhpcyBpcyB0cnVlLlxuICAgKi9cbiAgX2dldEFyaWFTb3J0QXR0cmlidXRlKCkge1xuICAgIGlmICghdGhpcy5faXNTb3J0ZWQoKSkge1xuICAgICAgcmV0dXJuICdub25lJztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc29ydC5kaXJlY3Rpb24gPT0gJ2FzYycgPyAnYXNjZW5kaW5nJyA6ICdkZXNjZW5kaW5nJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBhcnJvdyBpbnNpZGUgdGhlIHNvcnQgaGVhZGVyIHNob3VsZCBiZSByZW5kZXJlZC4gKi9cbiAgX3JlbmRlckFycm93KCkge1xuICAgIHJldHVybiAhdGhpcy5faXNEaXNhYmxlZCgpIHx8IHRoaXMuX2lzU29ydGVkKCk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVTb3J0QWN0aW9uRGVzY3JpcHRpb24obmV3RGVzY3JpcHRpb246IHN0cmluZykge1xuICAgIC8vIFdlIHVzZSBBcmlhRGVzY3JpYmVyIGZvciB0aGUgc29ydCBidXR0b24gaW5zdGVhZCBvZiBzZXR0aW5nIGFuIGBhcmlhLWxhYmVsYCBiZWNhdXNlIHNvbWVcbiAgICAvLyBzY3JlZW4gcmVhZGVycyAobm90YWJseSBWb2ljZU92ZXIpIHdpbGwgcmVhZCBib3RoIHRoZSBjb2x1bW4gaGVhZGVyICphbmQqIHRoZSBidXR0b24ncyBsYWJlbFxuICAgIC8vIGZvciBldmVyeSAqY2VsbCogaW4gdGhlIHRhYmxlLCBjcmVhdGluZyBhIGxvdCBvZiB1bm5lY2Vzc2FyeSBub2lzZS5cblxuICAgIC8vIElmIF9zb3J0QnV0dG9uIGlzIHVuZGVmaW5lZCwgdGhlIGNvbXBvbmVudCBoYXNuJ3QgYmVlbiBpbml0aWFsaXplZCB5ZXQgc28gdGhlcmUnc1xuICAgIC8vIG5vdGhpbmcgdG8gdXBkYXRlIGluIHRoZSBET00uXG4gICAgaWYgKHRoaXMuX3NvcnRCdXR0b24pIHtcbiAgICAgIC8vIHJlbW92ZURlc2NyaXB0aW9uIHdpbGwgbm8tb3AgaWYgdGhlcmUgaXMgbm8gZXhpc3RpbmcgbWVzc2FnZS5cbiAgICAgIC8vIFRPRE8oamVsYm91cm4pOiByZW1vdmUgb3B0aW9uYWwgY2hhaW5pbmcgd2hlbiBBcmlhRGVzY3JpYmVyIGlzIHJlcXVpcmVkLlxuICAgICAgdGhpcy5fYXJpYURlc2NyaWJlcj8ucmVtb3ZlRGVzY3JpcHRpb24odGhpcy5fc29ydEJ1dHRvbiwgdGhpcy5fc29ydEFjdGlvbkRlc2NyaXB0aW9uKTtcbiAgICAgIHRoaXMuX2FyaWFEZXNjcmliZXI/LmRlc2NyaWJlKHRoaXMuX3NvcnRCdXR0b24sIG5ld0Rlc2NyaXB0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zb3J0QWN0aW9uRGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGNoYW5nZXMgaW4gdGhlIHNvcnRpbmcgc3RhdGUuICovXG4gIHByaXZhdGUgX2hhbmRsZVN0YXRlQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9yZXJlbmRlclN1YnNjcmlwdGlvbiA9IG1lcmdlKFxuICAgICAgdGhpcy5fc29ydC5zb3J0Q2hhbmdlLFxuICAgICAgdGhpcy5fc29ydC5fc3RhdGVDaGFuZ2VzLFxuICAgICAgdGhpcy5faW50bC5jaGFuZ2VzLFxuICAgICkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9pc1NvcnRlZCgpKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUFycm93RGlyZWN0aW9uKCk7XG5cbiAgICAgICAgLy8gRG8gbm90IHNob3cgdGhlIGFuaW1hdGlvbiBpZiB0aGUgaGVhZGVyIHdhcyBhbHJlYWR5IHNob3duIGluIHRoZSByaWdodCBwb3NpdGlvbi5cbiAgICAgICAgaWYgKHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID09PSAnaGludCcgfHwgdGhpcy5fdmlld1N0YXRlLnRvU3RhdGUgPT09ICdhY3RpdmUnKSB7XG4gICAgICAgICAgdGhpcy5fZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUoe2Zyb21TdGF0ZTogdGhpcy5fYXJyb3dEaXJlY3Rpb24sIHRvU3RhdGU6ICdhY3RpdmUnfSk7XG4gICAgICAgIHRoaXMuX3Nob3dJbmRpY2F0b3JIaW50ID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoaXMgaGVhZGVyIHdhcyByZWNlbnRseSBhY3RpdmUgYW5kIG5vdyBubyBsb25nZXIgc29ydGVkLCBhbmltYXRlIGF3YXkgdGhlIGFycm93LlxuICAgICAgaWYgKCF0aGlzLl9pc1NvcnRlZCgpICYmIHRoaXMuX3ZpZXdTdGF0ZSAmJiB0aGlzLl92aWV3U3RhdGUudG9TdGF0ZSA9PT0gJ2FjdGl2ZScpIHtcbiAgICAgICAgdGhpcy5fZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUoe2Zyb21TdGF0ZTogJ2FjdGl2ZScsIHRvU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9ufSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVDbGVhcjogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiIsIjwhLS1cbiAgV2Ugc2V0IHRoZSBgdGFiaW5kZXhgIG9uIGFuIGVsZW1lbnQgaW5zaWRlIHRoZSB0YWJsZSBoZWFkZXIsIHJhdGhlciB0aGFuIHRoZSBoZWFkZXIgaXRzZWxmLFxuICBiZWNhdXNlIG9mIGEgYnVnIGluIE5WREEgd2hlcmUgaGF2aW5nIGEgYHRhYmluZGV4YCBvbiBhIGB0aGAgYnJlYWtzIGtleWJvYXJkIG5hdmlnYXRpb24gaW4gdGhlXG4gIHRhYmxlIChzZWUgaHR0cHM6Ly9naXRodWIuY29tL252YWNjZXNzL252ZGEvaXNzdWVzLzc3MTgpLiBUaGlzIGFsbG93cyBmb3IgdGhlIGhlYWRlciB0byBib3RoXG4gIGJlIGZvY3VzYWJsZSwgYW5kIGhhdmUgc2NyZWVuIHJlYWRlcnMgcmVhZCBvdXQgaXRzIGBhcmlhLXNvcnRgIHN0YXRlLiBXZSBwcmVmZXIgdGhpcyBhcHByb2FjaFxuICBvdmVyIGhhdmluZyBhIGJ1dHRvbiB3aXRoIGFuIGBhcmlhLWxhYmVsYCBpbnNpZGUgdGhlIGhlYWRlciwgYmVjYXVzZSB0aGUgYnV0dG9uJ3MgYGFyaWEtbGFiZWxgXG4gIHdpbGwgYmUgcmVhZCBvdXQgYXMgdGhlIHVzZXIgaXMgbmF2aWdhdGluZyB0aGUgdGFibGUncyBjZWxsIChzZWUgIzEzMDEyKS5cblxuICBUaGUgYXBwcm9hY2ggaXMgYmFzZWQgb2ZmIG9mOiBodHRwczovL2RlcXVldW5pdmVyc2l0eS5jb20vbGlicmFyeS9hcmlhL3RhYmxlcy9zZi1zb3J0YWJsZS1ncmlkXG4tLT5cbjxkaXYgY2xhc3M9XCJtYXQtc29ydC1oZWFkZXItY29udGFpbmVyIG1hdC1mb2N1cy1pbmRpY2F0b3JcIlxuICAgICBbY2xhc3MubWF0LXNvcnQtaGVhZGVyLXNvcnRlZF09XCJfaXNTb3J0ZWQoKVwiXG4gICAgIFtjbGFzcy5tYXQtc29ydC1oZWFkZXItcG9zaXRpb24tYmVmb3JlXT1cImFycm93UG9zaXRpb24gPT0gJ2JlZm9yZSdcIlxuICAgICBbYXR0ci50YWJpbmRleF09XCJfaXNEaXNhYmxlZCgpID8gbnVsbCA6IDBcIlxuICAgICByb2xlPVwiYnV0dG9uXCI+XG5cbiAgPCEtLVxuICAgIFRPRE8oY3Jpc2JldG8pOiB0aGlzIGRpdiBpc24ndCBzdHJpY3RseSBuZWNlc3NhcnksIGJ1dCB3ZSBoYXZlIHRvIGtlZXAgaXQgZHVlIHRvIGEgbGFyZ2VcbiAgICBudW1iZXIgb2Ygc2NyZWVuc2hvdCBkaWZmIGZhaWx1cmVzLiBJdCBzaG91bGQgYmUgcmVtb3ZlZCBldmVudHVhbGx5LiBOb3RlIHRoYXQgdGhlIGRpZmZlcmVuY2VcbiAgICBpc24ndCB2aXNpYmxlIHdpdGggYSBzaG9ydGVyIGhlYWRlciwgYnV0IG9uY2UgaXQgYnJlYWtzIHVwIGludG8gbXVsdGlwbGUgbGluZXMsIHRoaXMgZWxlbWVudFxuICAgIGNhdXNlcyBpdCB0byBiZSBjZW50ZXItYWxpZ25lZCwgd2hlcmVhcyByZW1vdmluZyBpdCB3aWxsIGtlZXAgdGhlIHRleHQgdG8gdGhlIGxlZnQuXG4gIC0tPlxuICA8ZGl2IGNsYXNzPVwibWF0LXNvcnQtaGVhZGVyLWNvbnRlbnRcIj5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIDwvZGl2PlxuXG4gIDwhLS0gRGlzYWJsZSBhbmltYXRpb25zIHdoaWxlIGEgY3VycmVudCBhbmltYXRpb24gaXMgcnVubmluZyAtLT5cbiAgPGRpdiBjbGFzcz1cIm1hdC1zb3J0LWhlYWRlci1hcnJvd1wiXG4gICAgICAgKm5nSWY9XCJfcmVuZGVyQXJyb3coKVwiXG4gICAgICAgW0BhcnJvd09wYWNpdHldPVwiX2dldEFycm93Vmlld1N0YXRlKClcIlxuICAgICAgIFtAYXJyb3dQb3NpdGlvbl09XCJfZ2V0QXJyb3dWaWV3U3RhdGUoKVwiXG4gICAgICAgW0BhbGxvd0NoaWxkcmVuXT1cIl9nZXRBcnJvd0RpcmVjdGlvblN0YXRlKClcIlxuICAgICAgIChAYXJyb3dQb3NpdGlvbi5zdGFydCk9XCJfZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IHRydWVcIlxuICAgICAgIChAYXJyb3dQb3NpdGlvbi5kb25lKT1cIl9kaXNhYmxlVmlld1N0YXRlQW5pbWF0aW9uID0gZmFsc2VcIj5cbiAgICA8ZGl2IGNsYXNzPVwibWF0LXNvcnQtaGVhZGVyLXN0ZW1cIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwibWF0LXNvcnQtaGVhZGVyLWluZGljYXRvclwiIFtAaW5kaWNhdG9yXT1cIl9nZXRBcnJvd0RpcmVjdGlvblN0YXRlKClcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYXQtc29ydC1oZWFkZXItcG9pbnRlci1sZWZ0XCIgW0BsZWZ0UG9pbnRlcl09XCJfZ2V0QXJyb3dEaXJlY3Rpb25TdGF0ZSgpXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwibWF0LXNvcnQtaGVhZGVyLXBvaW50ZXItcmlnaHRcIiBbQHJpZ2h0UG9pbnRlcl09XCJfZ2V0QXJyb3dEaXJlY3Rpb25TdGF0ZSgpXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwibWF0LXNvcnQtaGVhZGVyLXBvaW50ZXItbWlkZGxlXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG4iXX0=