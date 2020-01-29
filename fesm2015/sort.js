import { EventEmitter, isDevMode, Directive, Input, Output, Injectable, ɵɵdefineInjectable, Optional, SkipSelf, Component, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, Inject, ElementRef, NgModule } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { mixinInitialized, mixinDisabled, AnimationDurations, AnimationCurves } from '@angular/material/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject, merge } from 'rxjs';
import { trigger, state, style, transition, animate, keyframes, query, animateChild } from '@angular/animations';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/sort/sort-errors.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@docs-private
 * @param {?} id
 * @return {?}
 */
function getSortDuplicateSortableIdError(id) {
    return Error(`Cannot have two MatSortables with the same id (${id}).`);
}
/**
 * \@docs-private
 * @return {?}
 */
function getSortHeaderNotContainedWithinSortError() {
    return Error(`MatSortHeader must be placed within a parent element with the MatSort directive.`);
}
/**
 * \@docs-private
 * @return {?}
 */
function getSortHeaderMissingIdError() {
    return Error(`MatSortHeader must be provided with a unique id.`);
}
/**
 * \@docs-private
 * @param {?} direction
 * @return {?}
 */
function getSortInvalidDirectionError(direction) {
    return Error(`${direction} is not a valid sort direction ('asc' or 'desc').`);
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/sort/sort.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Interface for a directive that holds sorting state consumed by `MatSortHeader`.
 * @record
 */
function MatSortable() { }
if (false) {
    /**
     * The id of the column being sorted.
     * @type {?}
     */
    MatSortable.prototype.id;
    /**
     * Starting sort direction.
     * @type {?}
     */
    MatSortable.prototype.start;
    /**
     * Whether to disable clearing the sorting state.
     * @type {?}
     */
    MatSortable.prototype.disableClear;
}
/**
 * The current sort state.
 * @record
 */
function Sort() { }
if (false) {
    /**
     * The id of the column being sorted.
     * @type {?}
     */
    Sort.prototype.active;
    /**
     * The sort direction.
     * @type {?}
     */
    Sort.prototype.direction;
}
// Boilerplate for applying mixins to MatSort.
/**
 * \@docs-private
 */
class MatSortBase {
}
/** @type {?} */
const _MatSortMixinBase = mixinInitialized(mixinDisabled(MatSortBase));
/**
 * Container for MatSortables to manage the sort state and provide default sort parameters.
 */
class MatSort extends _MatSortMixinBase {
    constructor() {
        super(...arguments);
        /**
         * Collection of all registered sortables that this directive manages.
         */
        this.sortables = new Map();
        /**
         * Used to notify any child components listening to state changes.
         */
        this._stateChanges = new Subject();
        /**
         * The direction to set when an MatSortable is initially sorted.
         * May be overriden by the MatSortable's sort start.
         */
        this.start = 'asc';
        this._direction = '';
        /**
         * Event emitted when the user changes either the active sort or sort direction.
         */
        this.sortChange = new EventEmitter();
    }
    /**
     * The sort direction of the currently active MatSortable.
     * @return {?}
     */
    get direction() { return this._direction; }
    /**
     * @param {?} direction
     * @return {?}
     */
    set direction(direction) {
        if (isDevMode() && direction && direction !== 'asc' && direction !== 'desc') {
            throw getSortInvalidDirectionError(direction);
        }
        this._direction = direction;
    }
    /**
     * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
     * May be overriden by the MatSortable's disable clear input.
     * @return {?}
     */
    get disableClear() { return this._disableClear; }
    /**
     * @param {?} v
     * @return {?}
     */
    set disableClear(v) { this._disableClear = coerceBooleanProperty(v); }
    /**
     * Register function to be used by the contained MatSortables. Adds the MatSortable to the
     * collection of MatSortables.
     * @param {?} sortable
     * @return {?}
     */
    register(sortable) {
        if (!sortable.id) {
            throw getSortHeaderMissingIdError();
        }
        if (this.sortables.has(sortable.id)) {
            throw getSortDuplicateSortableIdError(sortable.id);
        }
        this.sortables.set(sortable.id, sortable);
    }
    /**
     * Unregister function to be used by the contained MatSortables. Removes the MatSortable from the
     * collection of contained MatSortables.
     * @param {?} sortable
     * @return {?}
     */
    deregister(sortable) {
        this.sortables.delete(sortable.id);
    }
    /**
     * Sets the active sort id and determines the new sort direction.
     * @param {?} sortable
     * @return {?}
     */
    sort(sortable) {
        if (this.active != sortable.id) {
            this.active = sortable.id;
            this.direction = sortable.start ? sortable.start : this.start;
        }
        else {
            this.direction = this.getNextSortDirection(sortable);
        }
        this.sortChange.emit({ active: this.active, direction: this.direction });
    }
    /**
     * Returns the next sort direction of the active sortable, checking for potential overrides.
     * @param {?} sortable
     * @return {?}
     */
    getNextSortDirection(sortable) {
        if (!sortable) {
            return '';
        }
        // Get the sort direction cycle with the potential sortable overrides.
        /** @type {?} */
        const disableClear = sortable.disableClear != null ? sortable.disableClear : this.disableClear;
        /** @type {?} */
        let sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);
        // Get and return the next direction in the cycle
        /** @type {?} */
        let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
        if (nextDirectionIndex >= sortDirectionCycle.length) {
            nextDirectionIndex = 0;
        }
        return sortDirectionCycle[nextDirectionIndex];
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._markInitialized();
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this._stateChanges.next();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._stateChanges.complete();
    }
}
MatSort.decorators = [
    { type: Directive, args: [{
                selector: '[matSort]',
                exportAs: 'matSort',
                host: { 'class': 'mat-sort' },
                inputs: ['disabled: matSortDisabled']
            },] }
];
MatSort.propDecorators = {
    active: [{ type: Input, args: ['matSortActive',] }],
    start: [{ type: Input, args: ['matSortStart',] }],
    direction: [{ type: Input, args: ['matSortDirection',] }],
    disableClear: [{ type: Input, args: ['matSortDisableClear',] }],
    sortChange: [{ type: Output, args: ['matSortChange',] }]
};
if (false) {
    /** @type {?} */
    MatSort.ngAcceptInputType_disableClear;
    /** @type {?} */
    MatSort.ngAcceptInputType_disabled;
    /**
     * Collection of all registered sortables that this directive manages.
     * @type {?}
     */
    MatSort.prototype.sortables;
    /**
     * Used to notify any child components listening to state changes.
     * @type {?}
     */
    MatSort.prototype._stateChanges;
    /**
     * The id of the most recently sorted MatSortable.
     * @type {?}
     */
    MatSort.prototype.active;
    /**
     * The direction to set when an MatSortable is initially sorted.
     * May be overriden by the MatSortable's sort start.
     * @type {?}
     */
    MatSort.prototype.start;
    /**
     * @type {?}
     * @private
     */
    MatSort.prototype._direction;
    /**
     * @type {?}
     * @private
     */
    MatSort.prototype._disableClear;
    /**
     * Event emitted when the user changes either the active sort or sort direction.
     * @type {?}
     */
    MatSort.prototype.sortChange;
}
/**
 * Returns the sort direction cycle to use given the provided parameters of order and clear.
 * @param {?} start
 * @param {?} disableClear
 * @return {?}
 */
function getSortDirectionCycle(start, disableClear) {
    /** @type {?} */
    let sortOrder = ['asc', 'desc'];
    if (start == 'desc') {
        sortOrder.reverse();
    }
    if (!disableClear) {
        sortOrder.push('');
    }
    return sortOrder;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/sort/sort-animations.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const SORT_ANIMATION_TRANSITION = AnimationDurations.ENTERING + ' ' +
    AnimationCurves.STANDARD_CURVE;
/**
 * Animations used by MatSort.
 * \@docs-private
 * @type {?}
 */
const matSortAnimations = {
    /**
     * Animation that moves the sort indicator.
     */
    indicator: trigger('indicator', [
        state('active-asc, asc', style({ transform: 'translateY(0px)' })),
        // 10px is the height of the sort indicator, minus the width of the pointers
        state('active-desc, desc', style({ transform: 'translateY(10px)' })),
        transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION))
    ]),
    /**
     * Animation that rotates the left pointer of the indicator based on the sorting direction.
     */
    leftPointer: trigger('leftPointer', [
        state('active-asc, asc', style({ transform: 'rotate(-45deg)' })),
        state('active-desc, desc', style({ transform: 'rotate(45deg)' })),
        transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION))
    ]),
    /**
     * Animation that rotates the right pointer of the indicator based on the sorting direction.
     */
    rightPointer: trigger('rightPointer', [
        state('active-asc, asc', style({ transform: 'rotate(45deg)' })),
        state('active-desc, desc', style({ transform: 'rotate(-45deg)' })),
        transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION))
    ]),
    /**
     * Animation that controls the arrow opacity.
     */
    arrowOpacity: trigger('arrowOpacity', [
        state('desc-to-active, asc-to-active, active', style({ opacity: 1 })),
        state('desc-to-hint, asc-to-hint, hint', style({ opacity: .54 })),
        state('hint-to-desc, active-to-desc, desc, hint-to-asc, active-to-asc, asc, void', style({ opacity: 0 })),
        // Transition between all states except for immediate transitions
        transition('* => asc, * => desc, * => active, * => hint, * => void', animate('0ms')),
        transition('* <=> *', animate(SORT_ANIMATION_TRANSITION)),
    ]),
    /**
     * Animation for the translation of the arrow as a whole. States are separated into two
     * groups: ones with animations and others that are immediate. Immediate states are asc, desc,
     * peek, and active. The other states define a specific animation (source-to-destination)
     * and are determined as a function of their prev user-perceived state and what the next state
     * should be.
     */
    arrowPosition: trigger('arrowPosition', [
        // Hidden Above => Hint Center
        transition('* => desc-to-hint, * => desc-to-active', animate(SORT_ANIMATION_TRANSITION, keyframes([
            style({ transform: 'translateY(-25%)' }),
            style({ transform: 'translateY(0)' })
        ]))),
        // Hint Center => Hidden Below
        transition('* => hint-to-desc, * => active-to-desc', animate(SORT_ANIMATION_TRANSITION, keyframes([
            style({ transform: 'translateY(0)' }),
            style({ transform: 'translateY(25%)' })
        ]))),
        // Hidden Below => Hint Center
        transition('* => asc-to-hint, * => asc-to-active', animate(SORT_ANIMATION_TRANSITION, keyframes([
            style({ transform: 'translateY(25%)' }),
            style({ transform: 'translateY(0)' })
        ]))),
        // Hint Center => Hidden Above
        transition('* => hint-to-asc, * => active-to-asc', animate(SORT_ANIMATION_TRANSITION, keyframes([
            style({ transform: 'translateY(0)' }),
            style({ transform: 'translateY(-25%)' })
        ]))),
        state('desc-to-hint, asc-to-hint, hint, desc-to-active, asc-to-active, active', style({ transform: 'translateY(0)' })),
        state('hint-to-desc, active-to-desc, desc', style({ transform: 'translateY(-25%)' })),
        state('hint-to-asc, active-to-asc, asc', style({ transform: 'translateY(25%)' })),
    ]),
    /**
     * Necessary trigger that calls animate on children animations.
     */
    allowChildren: trigger('allowChildren', [
        transition('* <=> *', [
            query('@*', animateChild(), { optional: true })
        ])
    ]),
};

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/sort/sort-header-intl.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * To modify the labels and text displayed, create a new instance of MatSortHeaderIntl and
 * include it in a custom provider.
 */
class MatSortHeaderIntl {
    constructor() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /**
         * ARIA label for the sorting button.
         */
        this.sortButtonLabel = (/**
         * @param {?} id
         * @return {?}
         */
        (id) => {
            return `Change sorting for ${id}`;
        });
    }
}
MatSortHeaderIntl.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ MatSortHeaderIntl.ɵprov = ɵɵdefineInjectable({ factory: function MatSortHeaderIntl_Factory() { return new MatSortHeaderIntl(); }, token: MatSortHeaderIntl, providedIn: "root" });
if (false) {
    /**
     * Stream that emits whenever the labels here are changed. Use this to notify
     * components if the labels have changed after initialization.
     * @type {?}
     */
    MatSortHeaderIntl.prototype.changes;
    /**
     * ARIA label for the sorting button.
     * @type {?}
     */
    MatSortHeaderIntl.prototype.sortButtonLabel;
}
/**
 * \@docs-private
 * @param {?} parentIntl
 * @return {?}
 */
function MAT_SORT_HEADER_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatSortHeaderIntl();
}
/**
 * \@docs-private
 * @type {?}
 */
const MAT_SORT_HEADER_INTL_PROVIDER = {
    // If there is already an MatSortHeaderIntl available, use that. Otherwise, provide a new one.
    provide: MatSortHeaderIntl,
    deps: [[new Optional(), new SkipSelf(), MatSortHeaderIntl]],
    useFactory: MAT_SORT_HEADER_INTL_PROVIDER_FACTORY
};

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/sort/sort-header.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
function ArrowViewStateTransition() { }
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
class MatSortHeader extends _MatSortHeaderMixinBase {
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

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/sort/sort-module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MatSortModule {
}
MatSortModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [MatSort, MatSortHeader],
                declarations: [MatSort, MatSortHeader],
                providers: [MAT_SORT_HEADER_INTL_PROVIDER]
            },] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/sort/sort-direction.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/sort/public-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MAT_SORT_HEADER_INTL_PROVIDER, MAT_SORT_HEADER_INTL_PROVIDER_FACTORY, MatSort, MatSortHeader, MatSortHeaderIntl, MatSortModule, matSortAnimations };
//# sourceMappingURL=sort.js.map
