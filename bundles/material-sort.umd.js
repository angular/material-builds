(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('tslib'), require('@angular/cdk/coercion'), require('@angular/material/core'), require('@angular/cdk/a11y'), require('rxjs'), require('@angular/animations'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@angular/material/sort', ['exports', '@angular/core', 'tslib', '@angular/cdk/coercion', '@angular/material/core', '@angular/cdk/a11y', 'rxjs', '@angular/animations', '@angular/common'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.sort = {}), global.ng.core, global.tslib, global.ng.cdk.coercion, global.ng.material.core, global.ng.cdk.a11y, global.rxjs, global.ng.animations, global.ng.common));
}(this, (function (exports, i0, tslib, coercion, core, a11y, rxjs, animations, common) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** @docs-private */
    function getSortDuplicateSortableIdError(id) {
        return Error("Cannot have two MatSortables with the same id (" + id + ").");
    }
    /** @docs-private */
    function getSortHeaderNotContainedWithinSortError() {
        return Error("MatSortHeader must be placed within a parent element with the MatSort directive.");
    }
    /** @docs-private */
    function getSortHeaderMissingIdError() {
        return Error("MatSortHeader must be provided with a unique id.");
    }
    /** @docs-private */
    function getSortInvalidDirectionError(direction) {
        return Error(direction + " is not a valid sort direction ('asc' or 'desc').");
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    // Boilerplate for applying mixins to MatSort.
    /** @docs-private */
    var MatSortBase = /** @class */ (function () {
        function MatSortBase() {
        }
        return MatSortBase;
    }());
    var _MatSortMixinBase = core.mixinInitialized(core.mixinDisabled(MatSortBase));
    /** Container for MatSortables to manage the sort state and provide default sort parameters. */
    var MatSort = /** @class */ (function (_super) {
        tslib.__extends(MatSort, _super);
        function MatSort() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /** Collection of all registered sortables that this directive manages. */
            _this.sortables = new Map();
            /** Used to notify any child components listening to state changes. */
            _this._stateChanges = new rxjs.Subject();
            /**
             * The direction to set when an MatSortable is initially sorted.
             * May be overriden by the MatSortable's sort start.
             */
            _this.start = 'asc';
            _this._direction = '';
            /** Event emitted when the user changes either the active sort or sort direction. */
            _this.sortChange = new i0.EventEmitter();
            return _this;
        }
        Object.defineProperty(MatSort.prototype, "direction", {
            /** The sort direction of the currently active MatSortable. */
            get: function () { return this._direction; },
            set: function (direction) {
                if (i0.isDevMode() && direction && direction !== 'asc' && direction !== 'desc') {
                    throw getSortInvalidDirectionError(direction);
                }
                this._direction = direction;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatSort.prototype, "disableClear", {
            /**
             * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
             * May be overriden by the MatSortable's disable clear input.
             */
            get: function () { return this._disableClear; },
            set: function (v) { this._disableClear = coercion.coerceBooleanProperty(v); },
            enumerable: true,
            configurable: true
        });
        /**
         * Register function to be used by the contained MatSortables. Adds the MatSortable to the
         * collection of MatSortables.
         */
        MatSort.prototype.register = function (sortable) {
            if (!sortable.id) {
                throw getSortHeaderMissingIdError();
            }
            if (this.sortables.has(sortable.id)) {
                throw getSortDuplicateSortableIdError(sortable.id);
            }
            this.sortables.set(sortable.id, sortable);
        };
        /**
         * Unregister function to be used by the contained MatSortables. Removes the MatSortable from the
         * collection of contained MatSortables.
         */
        MatSort.prototype.deregister = function (sortable) {
            this.sortables.delete(sortable.id);
        };
        /** Sets the active sort id and determines the new sort direction. */
        MatSort.prototype.sort = function (sortable) {
            if (this.active != sortable.id) {
                this.active = sortable.id;
                this.direction = sortable.start ? sortable.start : this.start;
            }
            else {
                this.direction = this.getNextSortDirection(sortable);
            }
            this.sortChange.emit({ active: this.active, direction: this.direction });
        };
        /** Returns the next sort direction of the active sortable, checking for potential overrides. */
        MatSort.prototype.getNextSortDirection = function (sortable) {
            if (!sortable) {
                return '';
            }
            // Get the sort direction cycle with the potential sortable overrides.
            var disableClear = sortable.disableClear != null ? sortable.disableClear : this.disableClear;
            var sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);
            // Get and return the next direction in the cycle
            var nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
            if (nextDirectionIndex >= sortDirectionCycle.length) {
                nextDirectionIndex = 0;
            }
            return sortDirectionCycle[nextDirectionIndex];
        };
        MatSort.prototype.ngOnInit = function () {
            this._markInitialized();
        };
        MatSort.prototype.ngOnChanges = function () {
            this._stateChanges.next();
        };
        MatSort.prototype.ngOnDestroy = function () {
            this._stateChanges.complete();
        };
        MatSort.decorators = [
            { type: i0.Directive, args: [{
                        selector: '[matSort]',
                        exportAs: 'matSort',
                        host: { 'class': 'mat-sort' },
                        inputs: ['disabled: matSortDisabled']
                    },] }
        ];
        MatSort.propDecorators = {
            active: [{ type: i0.Input, args: ['matSortActive',] }],
            start: [{ type: i0.Input, args: ['matSortStart',] }],
            direction: [{ type: i0.Input, args: ['matSortDirection',] }],
            disableClear: [{ type: i0.Input, args: ['matSortDisableClear',] }],
            sortChange: [{ type: i0.Output, args: ['matSortChange',] }]
        };
        return MatSort;
    }(_MatSortMixinBase));
    /** Returns the sort direction cycle to use given the provided parameters of order and clear. */
    function getSortDirectionCycle(start, disableClear) {
        var sortOrder = ['asc', 'desc'];
        if (start == 'desc') {
            sortOrder.reverse();
        }
        if (!disableClear) {
            sortOrder.push('');
        }
        return sortOrder;
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var SORT_ANIMATION_TRANSITION = core.AnimationDurations.ENTERING + ' ' +
        core.AnimationCurves.STANDARD_CURVE;
    /**
     * Animations used by MatSort.
     * @docs-private
     */
    var matSortAnimations = {
        /** Animation that moves the sort indicator. */
        indicator: animations.trigger('indicator', [
            animations.state('active-asc, asc', animations.style({ transform: 'translateY(0px)' })),
            // 10px is the height of the sort indicator, minus the width of the pointers
            animations.state('active-desc, desc', animations.style({ transform: 'translateY(10px)' })),
            animations.transition('active-asc <=> active-desc', animations.animate(SORT_ANIMATION_TRANSITION))
        ]),
        /** Animation that rotates the left pointer of the indicator based on the sorting direction. */
        leftPointer: animations.trigger('leftPointer', [
            animations.state('active-asc, asc', animations.style({ transform: 'rotate(-45deg)' })),
            animations.state('active-desc, desc', animations.style({ transform: 'rotate(45deg)' })),
            animations.transition('active-asc <=> active-desc', animations.animate(SORT_ANIMATION_TRANSITION))
        ]),
        /** Animation that rotates the right pointer of the indicator based on the sorting direction. */
        rightPointer: animations.trigger('rightPointer', [
            animations.state('active-asc, asc', animations.style({ transform: 'rotate(45deg)' })),
            animations.state('active-desc, desc', animations.style({ transform: 'rotate(-45deg)' })),
            animations.transition('active-asc <=> active-desc', animations.animate(SORT_ANIMATION_TRANSITION))
        ]),
        /** Animation that controls the arrow opacity. */
        arrowOpacity: animations.trigger('arrowOpacity', [
            animations.state('desc-to-active, asc-to-active, active', animations.style({ opacity: 1 })),
            animations.state('desc-to-hint, asc-to-hint, hint', animations.style({ opacity: .54 })),
            animations.state('hint-to-desc, active-to-desc, desc, hint-to-asc, active-to-asc, asc, void', animations.style({ opacity: 0 })),
            // Transition between all states except for immediate transitions
            animations.transition('* => asc, * => desc, * => active, * => hint, * => void', animations.animate('0ms')),
            animations.transition('* <=> *', animations.animate(SORT_ANIMATION_TRANSITION)),
        ]),
        /**
         * Animation for the translation of the arrow as a whole. States are separated into two
         * groups: ones with animations and others that are immediate. Immediate states are asc, desc,
         * peek, and active. The other states define a specific animation (source-to-destination)
         * and are determined as a function of their prev user-perceived state and what the next state
         * should be.
         */
        arrowPosition: animations.trigger('arrowPosition', [
            // Hidden Above => Hint Center
            animations.transition('* => desc-to-hint, * => desc-to-active', animations.animate(SORT_ANIMATION_TRANSITION, animations.keyframes([
                animations.style({ transform: 'translateY(-25%)' }),
                animations.style({ transform: 'translateY(0)' })
            ]))),
            // Hint Center => Hidden Below
            animations.transition('* => hint-to-desc, * => active-to-desc', animations.animate(SORT_ANIMATION_TRANSITION, animations.keyframes([
                animations.style({ transform: 'translateY(0)' }),
                animations.style({ transform: 'translateY(25%)' })
            ]))),
            // Hidden Below => Hint Center
            animations.transition('* => asc-to-hint, * => asc-to-active', animations.animate(SORT_ANIMATION_TRANSITION, animations.keyframes([
                animations.style({ transform: 'translateY(25%)' }),
                animations.style({ transform: 'translateY(0)' })
            ]))),
            // Hint Center => Hidden Above
            animations.transition('* => hint-to-asc, * => active-to-asc', animations.animate(SORT_ANIMATION_TRANSITION, animations.keyframes([
                animations.style({ transform: 'translateY(0)' }),
                animations.style({ transform: 'translateY(-25%)' })
            ]))),
            animations.state('desc-to-hint, asc-to-hint, hint, desc-to-active, asc-to-active, active', animations.style({ transform: 'translateY(0)' })),
            animations.state('hint-to-desc, active-to-desc, desc', animations.style({ transform: 'translateY(-25%)' })),
            animations.state('hint-to-asc, active-to-asc, asc', animations.style({ transform: 'translateY(25%)' })),
        ]),
        /** Necessary trigger that calls animate on children animations. */
        allowChildren: animations.trigger('allowChildren', [
            animations.transition('* <=> *', [
                animations.query('@*', animations.animateChild(), { optional: true })
            ])
        ]),
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * To modify the labels and text displayed, create a new instance of MatSortHeaderIntl and
     * include it in a custom provider.
     */
    var MatSortHeaderIntl = /** @class */ (function () {
        function MatSortHeaderIntl() {
            /**
             * Stream that emits whenever the labels here are changed. Use this to notify
             * components if the labels have changed after initialization.
             */
            this.changes = new rxjs.Subject();
            /** ARIA label for the sorting button. */
            this.sortButtonLabel = function (id) {
                return "Change sorting for " + id;
            };
        }
        MatSortHeaderIntl.decorators = [
            { type: i0.Injectable, args: [{ providedIn: 'root' },] }
        ];
        MatSortHeaderIntl.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatSortHeaderIntl_Factory() { return new MatSortHeaderIntl(); }, token: MatSortHeaderIntl, providedIn: "root" });
        return MatSortHeaderIntl;
    }());
    /** @docs-private */
    function MAT_SORT_HEADER_INTL_PROVIDER_FACTORY(parentIntl) {
        return parentIntl || new MatSortHeaderIntl();
    }
    /** @docs-private */
    var MAT_SORT_HEADER_INTL_PROVIDER = {
        // If there is already an MatSortHeaderIntl available, use that. Otherwise, provide a new one.
        provide: MatSortHeaderIntl,
        deps: [[new i0.Optional(), new i0.SkipSelf(), MatSortHeaderIntl]],
        useFactory: MAT_SORT_HEADER_INTL_PROVIDER_FACTORY
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    // Boilerplate for applying mixins to the sort header.
    /** @docs-private */
    var MatSortHeaderBase = /** @class */ (function () {
        function MatSortHeaderBase() {
        }
        return MatSortHeaderBase;
    }());
    var _MatSortHeaderMixinBase = core.mixinDisabled(MatSortHeaderBase);
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
        tslib.__extends(MatSortHeader, _super);
        function MatSortHeader(_intl, changeDetectorRef, _sort, _columnDef, 
        /**
         * @deprecated _focusMonitor and _elementRef to become required parameters.
         * @breaking-change 10.0.0
         */
        _focusMonitor, _elementRef) {
            var _this = 
            // Note that we use a string token for the `_columnDef`, because the value is provided both by
            // `material/table` and `cdk/table` and we can't have the CDK depending on Material,
            // and we want to avoid having the sort header depending on the CDK table because
            // of this single reference.
            _super.call(this) || this;
            _this._intl = _intl;
            _this._sort = _sort;
            _this._columnDef = _columnDef;
            _this._focusMonitor = _focusMonitor;
            _this._elementRef = _elementRef;
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
            _this._rerenderSubscription = rxjs.merge(_sort.sortChange, _sort._stateChanges, _intl.changes)
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
            if (_focusMonitor && _elementRef) {
                // We use the focus monitor because we also want to style
                // things differently based on the focus origin.
                _focusMonitor.monitor(_elementRef, true)
                    .subscribe(function (origin) { return _this._setIndicatorHintVisible(!!origin); });
            }
            return _this;
        }
        Object.defineProperty(MatSortHeader.prototype, "disableClear", {
            /** Overrides the disable clear value of the containing MatSort for this MatSortable. */
            get: function () { return this._disableClear; },
            set: function (v) { this._disableClear = coercion.coerceBooleanProperty(v); },
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
            // @breaking-change 10.0.0 Remove null check for _focusMonitor and _elementRef.
            if (this._focusMonitor && this._elementRef) {
                this._focusMonitor.stopMonitoring(this._elementRef);
            }
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
            { type: i0.Component, args: [{
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
                        encapsulation: i0.ViewEncapsulation.None,
                        changeDetection: i0.ChangeDetectionStrategy.OnPush,
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
        MatSortHeader.ctorParameters = function () { return [
            { type: MatSortHeaderIntl },
            { type: i0.ChangeDetectorRef },
            { type: MatSort, decorators: [{ type: i0.Optional }] },
            { type: undefined, decorators: [{ type: i0.Inject, args: ['MAT_SORT_HEADER_COLUMN_DEF',] }, { type: i0.Optional }] },
            { type: a11y.FocusMonitor },
            { type: i0.ElementRef }
        ]; };
        MatSortHeader.propDecorators = {
            id: [{ type: i0.Input, args: ['mat-sort-header',] }],
            arrowPosition: [{ type: i0.Input }],
            start: [{ type: i0.Input }],
            disableClear: [{ type: i0.Input }]
        };
        return MatSortHeader;
    }(_MatSortHeaderMixinBase));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MatSortModule = /** @class */ (function () {
        function MatSortModule() {
        }
        MatSortModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [common.CommonModule],
                        exports: [MatSort, MatSortHeader],
                        declarations: [MatSort, MatSortHeader],
                        providers: [MAT_SORT_HEADER_INTL_PROVIDER]
                    },] }
        ];
        return MatSortModule;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MAT_SORT_HEADER_INTL_PROVIDER = MAT_SORT_HEADER_INTL_PROVIDER;
    exports.MAT_SORT_HEADER_INTL_PROVIDER_FACTORY = MAT_SORT_HEADER_INTL_PROVIDER_FACTORY;
    exports.MatSort = MatSort;
    exports.MatSortHeader = MatSortHeader;
    exports.MatSortHeaderIntl = MatSortHeaderIntl;
    exports.MatSortModule = MatSortModule;
    exports.matSortAnimations = matSortAnimations;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-sort.umd.js.map
