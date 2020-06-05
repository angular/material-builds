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
let MatSortHeader = /** @class */ (() => {
    class MatSortHeader extends _MatSortHeaderMixinBase {
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
            // We use the focus monitor because we also want to style
            // things differently based on the focus origin.
            _focusMonitor.monitor(_elementRef, true)
                .subscribe(origin => this._setIndicatorHintVisible(!!origin));
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
            const viewState = this._isSorted() ?
                { fromState: this._arrowDirection, toState: 'active' } :
                { fromState: 'active', toState: this._arrowDirection };
            this._setAnimationTransitionState(viewState);
            this._showIndicatorHint = false;
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
                return null;
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
                    template: "<div class=\"mat-sort-header-container\"\n     [class.mat-sort-header-sorted]=\"_isSorted()\"\n     [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\">\n  <button class=\"mat-sort-header-button mat-focus-indicator\" type=\"button\"\n          [attr.disabled]=\"_isDisabled() || null\"\n          [attr.aria-label]=\"_intl.sortButtonLabel(id)\">\n    <ng-content></ng-content>\n  </button>\n\n  <!-- Disable animations while a current animation is running -->\n  <div class=\"mat-sort-header-arrow\"\n       *ngIf=\"_renderArrow()\"\n       [@arrowOpacity]=\"_getArrowViewState()\"\n       [@arrowPosition]=\"_getArrowViewState()\"\n       [@allowChildren]=\"_getArrowDirectionState()\"\n       (@arrowPosition.start)=\"_disableViewStateAnimation = true\"\n       (@arrowPosition.done)=\"_disableViewStateAnimation = false\">\n    <div class=\"mat-sort-header-stem\"></div>\n    <div class=\"mat-sort-header-indicator\" [@indicator]=\"_getArrowDirectionState()\">\n      <div class=\"mat-sort-header-pointer-left\" [@leftPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-right\" [@rightPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-middle\"></div>\n    </div>\n  </div>\n</div>\n",
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
    return MatSortHeader;
})();
export { MatSortHeader };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc29ydC9zb3J0LWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsS0FBSyxFQUdMLFFBQVEsRUFDUixpQkFBaUIsRUFDakIsTUFBTSxFQUNOLFVBQVUsR0FDWCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQTZCLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2pGLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsS0FBSyxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxPQUFPLEVBQWMsTUFBTSxRQUFRLENBQUM7QUFDNUMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFcEQsT0FBTyxFQUFDLHdDQUF3QyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR3JELHNEQUFzRDtBQUN0RCxvQkFBb0I7QUFDcEIsTUFBTSxpQkFBaUI7Q0FBRztBQUMxQixNQUFNLHVCQUF1QixHQUN6QixhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQTJCckM7Ozs7Ozs7O0dBUUc7QUFDSDtJQUFBLE1BeUJhLGFBQWMsU0FBUSx1QkFBdUI7UUEyQ3hELFlBQW1CLEtBQXdCLEVBQy9CLGlCQUFvQyxFQUNqQixLQUFjLEVBRXRCLFVBQWtDLEVBQ3JDLGFBQTJCLEVBQzNCLFdBQW9DO1lBQ3RELDhGQUE4RjtZQUM5RixvRkFBb0Y7WUFDcEYsaUZBQWlGO1lBQ2pGLDRC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VSxFQUFFO3dCQUNWLGlCQUFpQixDQUFDLFNBQVM7d0JBQzNCLGlCQUFpQixDQUFDLFdBQVc7d0JBQzdCLGlCQUFpQixDQUFDLFlBQVk7d0JBQzlCLGlCQUFpQixDQUFDLFlBQVk7d0JBQzlCLGlCQUFpQixDQUFDLGFBQWE7d0JBQy9CLGlCQUFpQixDQUFDLGFBQWE7cUJBQ2hDOztpQkFDRjs7OztnQkFuRU8saUJBQWlCO2dCQWpCdkIsaUJBQWlCO2dCQWFYLE9BQU8sdUJBcUhBLFFBQVE7Z0RBQ1IsTUFBTSxTQUFDLDRCQUE0QixjQUFHLFFBQVE7Z0JBeEhyRCxZQUFZO2dCQUhsQixVQUFVOzs7cUJBMEdULEtBQUssU0FBQyxpQkFBaUI7Z0NBR3ZCLEtBQUs7d0JBR0wsS0FBSzsrQkFHTCxLQUFLOztJQThLUixvQkFBQztLQUFBO1NBcE5ZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5qZWN0LFxuICBFbGVtZW50UmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuRGlzYWJsZSwgQ2FuRGlzYWJsZUN0b3IsIG1peGluRGlzYWJsZWR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtGb2N1c01vbml0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7bWVyZ2UsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01hdFNvcnQsIE1hdFNvcnRhYmxlfSBmcm9tICcuL3NvcnQnO1xuaW1wb3J0IHttYXRTb3J0QW5pbWF0aW9uc30gZnJvbSAnLi9zb3J0LWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtTb3J0RGlyZWN0aW9ufSBmcm9tICcuL3NvcnQtZGlyZWN0aW9uJztcbmltcG9ydCB7Z2V0U29ydEhlYWRlck5vdENvbnRhaW5lZFdpdGhpblNvcnRFcnJvcn0gZnJvbSAnLi9zb3J0LWVycm9ycyc7XG5pbXBvcnQge01hdFNvcnRIZWFkZXJJbnRsfSBmcm9tICcuL3NvcnQtaGVhZGVyLWludGwnO1xuXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gdGhlIHNvcnQgaGVhZGVyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFNvcnRIZWFkZXJCYXNlIHt9XG5jb25zdCBfTWF0U29ydEhlYWRlck1peGluQmFzZTogQ2FuRGlzYWJsZUN0b3IgJiB0eXBlb2YgTWF0U29ydEhlYWRlckJhc2UgPVxuICAgIG1peGluRGlzYWJsZWQoTWF0U29ydEhlYWRlckJhc2UpO1xuXG4vKipcbiAqIFZhbGlkIHBvc2l0aW9ucyBmb3IgdGhlIGFycm93IHRvIGJlIGluIGZvciBpdHMgb3BhY2l0eSBhbmQgdHJhbnNsYXRpb24uIElmIHRoZSBzdGF0ZSBpcyBhXG4gKiBzb3J0IGRpcmVjdGlvbiwgdGhlIHBvc2l0aW9uIG9mIHRoZSBhcnJvdyB3aWxsIGJlIGFib3ZlL2JlbG93IGFuZCBvcGFjaXR5IDAuIElmIHRoZSBzdGF0ZSBpc1xuICogaGludCwgdGhlIGFycm93IHdpbGwgYmUgaW4gdGhlIGNlbnRlciB3aXRoIGEgc2xpZ2h0IG9wYWNpdHkuIEFjdGl2ZSBzdGF0ZSBtZWFucyB0aGUgYXJyb3cgd2lsbFxuICogYmUgZnVsbHkgb3BhcXVlIGluIHRoZSBjZW50ZXIuXG4gKlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgdHlwZSBBcnJvd1ZpZXdTdGF0ZSA9IFNvcnREaXJlY3Rpb24gfCAnaGludCcgfCAnYWN0aXZlJztcblxuLyoqXG4gKiBTdGF0ZXMgZGVzY3JpYmluZyB0aGUgYXJyb3cncyBhbmltYXRlZCBwb3NpdGlvbiAoYW5pbWF0aW5nIGZyb21TdGF0ZSB0byB0b1N0YXRlKS5cbiAqIElmIHRoZSBmcm9tU3RhdGUgaXMgbm90IGRlZmluZWQsIHRoZXJlIHdpbGwgYmUgbm8gYW5pbWF0ZWQgdHJhbnNpdGlvbiB0byB0aGUgdG9TdGF0ZS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb24ge1xuICBmcm9tU3RhdGU/OiBBcnJvd1ZpZXdTdGF0ZTtcbiAgdG9TdGF0ZTogQXJyb3dWaWV3U3RhdGU7XG59XG5cbi8qKiBDb2x1bW4gZGVmaW5pdGlvbiBhc3NvY2lhdGVkIHdpdGggYSBgTWF0U29ydEhlYWRlcmAuICovXG5pbnRlcmZhY2UgTWF0U29ydEhlYWRlckNvbHVtbkRlZiB7XG4gIG5hbWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBcHBsaWVzIHNvcnRpbmcgYmVoYXZpb3IgKGNsaWNrIHRvIGNoYW5nZSBzb3J0KSBhbmQgc3R5bGVzIHRvIGFuIGVsZW1lbnQsIGluY2x1ZGluZyBhblxuICogYXJyb3cgdG8gZGlzcGxheSB0aGUgY3VycmVudCBzb3J0IGRpcmVjdGlvbi5cbiAqXG4gKiBNdXN0IGJlIHByb3ZpZGVkIHdpdGggYW4gaWQgYW5kIGNvbnRhaW5lZCB3aXRoaW4gYSBwYXJlbnQgTWF0U29ydCBkaXJlY3RpdmUuXG4gKlxuICogSWYgdXNlZCBvbiBoZWFkZXIgY2VsbHMgaW4gYSBDZGtUYWJsZSwgaXQgd2lsbCBhdXRvbWF0aWNhbGx5IGRlZmF1bHQgaXRzIGlkIGZyb20gaXRzIGNvbnRhaW5pbmdcbiAqIGNvbHVtbiBkZWZpbml0aW9uLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbWF0LXNvcnQtaGVhZGVyXScsXG4gIGV4cG9ydEFzOiAnbWF0U29ydEhlYWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnc29ydC1oZWFkZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzb3J0LWhlYWRlci5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtc29ydC1oZWFkZXInLFxuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygpJyxcbiAgICAnKG1vdXNlZW50ZXIpJzogJ19zZXRJbmRpY2F0b3JIaW50VmlzaWJsZSh0cnVlKScsXG4gICAgJyhtb3VzZWxlYXZlKSc6ICdfc2V0SW5kaWNhdG9ySGludFZpc2libGUoZmFsc2UpJyxcbiAgICAnW2F0dHIuYXJpYS1zb3J0XSc6ICdfZ2V0QXJpYVNvcnRBdHRyaWJ1dGUoKScsXG4gICAgJ1tjbGFzcy5tYXQtc29ydC1oZWFkZXItZGlzYWJsZWRdJzogJ19pc0Rpc2FibGVkKCknLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5pbmRpY2F0b3IsXG4gICAgbWF0U29ydEFuaW1hdGlvbnMubGVmdFBvaW50ZXIsXG4gICAgbWF0U29ydEFuaW1hdGlvbnMucmlnaHRQb2ludGVyLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmFycm93T3BhY2l0eSxcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5hcnJvd1Bvc2l0aW9uLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmFsbG93Q2hpbGRyZW4sXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTWF0U29ydEhlYWRlciBleHRlbmRzIF9NYXRTb3J0SGVhZGVyTWl4aW5CYXNlXG4gICAgaW1wbGVtZW50cyBDYW5EaXNhYmxlLCBNYXRTb3J0YWJsZSwgT25EZXN0cm95LCBPbkluaXQge1xuICBwcml2YXRlIF9yZXJlbmRlclN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKlxuICAgKiBGbGFnIHNldCB0byB0cnVlIHdoZW4gdGhlIGluZGljYXRvciBzaG91bGQgYmUgZGlzcGxheWVkIHdoaWxlIHRoZSBzb3J0IGlzIG5vdCBhY3RpdmUuIFVzZWQgdG9cbiAgICogcHJvdmlkZSBhbiBhZmZvcmRhbmNlIHRoYXQgdGhlIGhlYWRlciBpcyBzb3J0YWJsZSBieSBzaG93aW5nIG9uIGZvY3VzIGFuZCBob3Zlci5cbiAgICovXG4gIF9zaG93SW5kaWNhdG9ySGludDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGUgdmlldyB0cmFuc2l0aW9uIHN0YXRlIG9mIHRoZSBhcnJvdyAodHJhbnNsYXRpb24vIG9wYWNpdHkpIC0gaW5kaWNhdGVzIGl0cyBgZnJvbWAgYW5kIGB0b2BcbiAgICogcG9zaXRpb24gdGhyb3VnaCB0aGUgYW5pbWF0aW9uLiBJZiBhbmltYXRpb25zIGFyZSBjdXJyZW50bHkgZGlzYWJsZWQsIHRoZSBmcm9tU3RhdGUgaXMgcmVtb3ZlZFxuICAgKiBzbyB0aGF0IHRoZXJlIGlzIG5vIGFuaW1hdGlvbiBkaXNwbGF5ZWQuXG4gICAqL1xuICBfdmlld1N0YXRlOiBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb247XG5cbiAgLyoqIFRoZSBkaXJlY3Rpb24gdGhlIGFycm93IHNob3VsZCBiZSBmYWNpbmcgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLiAqL1xuICBfYXJyb3dEaXJlY3Rpb246IFNvcnREaXJlY3Rpb24gPSAnJztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgdmlldyBzdGF0ZSBhbmltYXRpb24gc2hvdWxkIHNob3cgdGhlIHRyYW5zaXRpb24gYmV0d2VlbiB0aGUgYGZyb21gIGFuZCBgdG9gIHN0YXRlcy5cbiAgICovXG4gIF9kaXNhYmxlVmlld1N0YXRlQW5pbWF0aW9uID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIElEIG9mIHRoaXMgc29ydCBoZWFkZXIuIElmIHVzZWQgd2l0aGluIHRoZSBjb250ZXh0IG9mIGEgQ2RrQ29sdW1uRGVmLCB0aGlzIHdpbGwgZGVmYXVsdCB0b1xuICAgKiB0aGUgY29sdW1uJ3MgbmFtZS5cbiAgICovXG4gIEBJbnB1dCgnbWF0LXNvcnQtaGVhZGVyJykgaWQ6IHN0cmluZztcblxuICAvKiogU2V0cyB0aGUgcG9zaXRpb24gb2YgdGhlIGFycm93IHRoYXQgZGlzcGxheXMgd2hlbiBzb3J0ZWQuICovXG4gIEBJbnB1dCgpIGFycm93UG9zaXRpb246ICdiZWZvcmUnIHwgJ2FmdGVyJyA9ICdhZnRlcic7XG5cbiAgLyoqIE92ZXJyaWRlcyB0aGUgc29ydCBzdGFydCB2YWx1ZSBvZiB0aGUgY29udGFpbmluZyBNYXRTb3J0IGZvciB0aGlzIE1hdFNvcnRhYmxlLiAqL1xuICBASW5wdXQoKSBzdGFydDogJ2FzYycgfCAnZGVzYyc7XG5cbiAgLyoqIE92ZXJyaWRlcyB0aGUgZGlzYWJsZSBjbGVhciB2YWx1ZSBvZiB0aGUgY29udGFpbmluZyBNYXRTb3J0IGZvciB0aGlzIE1hdFNvcnRhYmxlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZUNsZWFyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZUNsZWFyOyB9XG4gIHNldCBkaXNhYmxlQ2xlYXIodikgeyB0aGlzLl9kaXNhYmxlQ2xlYXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodik7IH1cbiAgcHJpdmF0ZSBfZGlzYWJsZUNsZWFyOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfaW50bDogTWF0U29ydEhlYWRlckludGwsXG4gICAgICAgICAgICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHVibGljIF9zb3J0OiBNYXRTb3J0LFxuICAgICAgICAgICAgICBASW5qZWN0KCdNQVRfU09SVF9IRUFERVJfQ09MVU1OX0RFRicpIEBPcHRpb25hbCgpXG4gICAgICAgICAgICAgICAgICBwdWJsaWMgX2NvbHVtbkRlZjogTWF0U29ydEhlYWRlckNvbHVtbkRlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgLy8gTm90ZSB0aGF0IHdlIHVzZSBhIHN0cmluZyB0b2tlbiBmb3IgdGhlIGBfY29sdW1uRGVmYCwgYmVjYXVzZSB0aGUgdmFsdWUgaXMgcHJvdmlkZWQgYm90aCBieVxuICAgIC8vIGBtYXRlcmlhbC90YWJsZWAgYW5kIGBjZGsvdGFibGVgIGFuZCB3ZSBjYW4ndCBoYXZlIHRoZSBDREsgZGVwZW5kaW5nIG9uIE1hdGVyaWFsLFxuICAgIC8vIGFuZCB3ZSB3YW50IHRvIGF2b2lkIGhhdmluZyB0aGUgc29ydCBoZWFkZXIgZGVwZW5kaW5nIG9uIHRoZSBDREsgdGFibGUgYmVjYXVzZVxuICAgIC8vIG9mIHRoaXMgc2luZ2xlIHJlZmVyZW5jZS5cbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKCFfc29ydCkge1xuICAgICAgdGhyb3cgZ2V0U29ydEhlYWRlck5vdENvbnRhaW5lZFdpdGhpblNvcnRFcnJvcigpO1xuICAgIH1cblxuICAgIHRoaXMuX3JlcmVuZGVyU3Vic2NyaXB0aW9uID0gbWVyZ2UoX3NvcnQuc29ydENoYW5nZSwgX3NvcnQuX3N0YXRlQ2hhbmdlcywgX2ludGwuY2hhbmdlcylcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuX2lzU29ydGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUFycm93RGlyZWN0aW9uKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgdGhpcyBoZWFkZXIgd2FzIHJlY2VudGx5IGFjdGl2ZSBhbmQgbm93IG5vIGxvbmdlciBzb3J0ZWQsIGFuaW1hdGUgYXdheSB0aGUgYXJyb3cuXG4gICAgICAgICAgaWYgKCF0aGlzLl9pc1NvcnRlZCgpICYmIHRoaXMuX3ZpZXdTdGF0ZSAmJiB0aGlzLl92aWV3U3RhdGUudG9TdGF0ZSA9PT0gJ2FjdGl2ZScpIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24gPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh7ZnJvbVN0YXRlOiAnYWN0aXZlJywgdG9TdGF0ZTogdGhpcy5fYXJyb3dEaXJlY3Rpb259KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG5cbiAgICAvLyBXZSB1c2UgdGhlIGZvY3VzIG1vbml0b3IgYmVjYXVzZSB3ZSBhbHNvIHdhbnQgdG8gc3R5bGVcbiAgICAvLyB0aGluZ3MgZGlmZmVyZW50bHkgYmFzZWQgb24gdGhlIGZvY3VzIG9yaWdpbi5cbiAgICBfZm9jdXNNb25pdG9yLm1vbml0b3IoX2VsZW1lbnRSZWYsIHRydWUpXG4gICAgICAgIC5zdWJzY3JpYmUob3JpZ2luID0+IHRoaXMuX3NldEluZGljYXRvckhpbnRWaXNpYmxlKCEhb3JpZ2luKSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuaWQgJiYgdGhpcy5fY29sdW1uRGVmKSB7XG4gICAgICB0aGlzLmlkID0gdGhpcy5fY29sdW1uRGVmLm5hbWU7XG4gICAgfVxuXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgZGlyZWN0aW9uIG9mIHRoZSBhcnJvdyBhbmQgc2V0IHRoZSB2aWV3IHN0YXRlIHRvIGJlIGltbWVkaWF0ZWx5IHRoYXQgc3RhdGUuXG4gICAgdGhpcy5fdXBkYXRlQXJyb3dEaXJlY3Rpb24oKTtcbiAgICB0aGlzLl9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUoXG4gICAgICAgIHt0b1N0YXRlOiB0aGlzLl9pc1NvcnRlZCgpID8gJ2FjdGl2ZScgOiB0aGlzLl9hcnJvd0RpcmVjdGlvbn0pO1xuXG4gICAgdGhpcy5fc29ydC5yZWdpc3Rlcih0aGlzKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgICB0aGlzLl9zb3J0LmRlcmVnaXN0ZXIodGhpcyk7XG4gICAgdGhpcy5fcmVyZW5kZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBcImhpbnRcIiBzdGF0ZSBzdWNoIHRoYXQgdGhlIGFycm93IHdpbGwgYmUgc2VtaS10cmFuc3BhcmVudGx5IGRpc3BsYXllZCBhcyBhIGhpbnQgdG8gdGhlXG4gICAqIHVzZXIgc2hvd2luZyB3aGF0IHRoZSBhY3RpdmUgc29ydCB3aWxsIGJlY29tZS4gSWYgc2V0IHRvIGZhbHNlLCB0aGUgYXJyb3cgd2lsbCBmYWRlIGF3YXkuXG4gICAqL1xuICBfc2V0SW5kaWNhdG9ySGludFZpc2libGUodmlzaWJsZTogYm9vbGVhbikge1xuICAgIC8vIE5vLW9wIGlmIHRoZSBzb3J0IGhlYWRlciBpcyBkaXNhYmxlZCAtIHNob3VsZCBub3QgbWFrZSB0aGUgaGludCB2aXNpYmxlLlxuICAgIGlmICh0aGlzLl9pc0Rpc2FibGVkKCkgJiYgdmlzaWJsZSkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX3Nob3dJbmRpY2F0b3JIaW50ID0gdmlzaWJsZTtcblxuICAgIGlmICghdGhpcy5faXNTb3J0ZWQoKSkge1xuICAgICAgdGhpcy5fdXBkYXRlQXJyb3dEaXJlY3Rpb24oKTtcbiAgICAgIGlmICh0aGlzLl9zaG93SW5kaWNhdG9ySGludCkge1xuICAgICAgICB0aGlzLl9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUoe2Zyb21TdGF0ZTogdGhpcy5fYXJyb3dEaXJlY3Rpb24sIHRvU3RhdGU6ICdoaW50J30pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6ICdoaW50JywgdG9TdGF0ZTogdGhpcy5fYXJyb3dEaXJlY3Rpb259KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYW5pbWF0aW9uIHRyYW5zaXRpb24gdmlldyBzdGF0ZSBmb3IgdGhlIGFycm93J3MgcG9zaXRpb24gYW5kIG9wYWNpdHkuIElmIHRoZVxuICAgKiBgZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbmAgZmxhZyBpcyBzZXQgdG8gdHJ1ZSwgdGhlIGBmcm9tU3RhdGVgIHdpbGwgYmUgaWdub3JlZCBzbyB0aGF0XG4gICAqIG5vIGFuaW1hdGlvbiBhcHBlYXJzLlxuICAgKi9cbiAgX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh2aWV3U3RhdGU6IEFycm93Vmlld1N0YXRlVHJhbnNpdGlvbikge1xuICAgIHRoaXMuX3ZpZXdTdGF0ZSA9IHZpZXdTdGF0ZTtcblxuICAgIC8vIElmIHRoZSBhbmltYXRpb24gZm9yIGFycm93IHBvc2l0aW9uIHN0YXRlIChvcGFjaXR5L3RyYW5zbGF0aW9uKSBzaG91bGQgYmUgZGlzYWJsZWQsXG4gICAgLy8gcmVtb3ZlIHRoZSBmcm9tU3RhdGUgc28gdGhhdCBpdCBqdW1wcyByaWdodCB0byB0aGUgdG9TdGF0ZS5cbiAgICBpZiAodGhpcy5fZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbikge1xuICAgICAgdGhpcy5fdmlld1N0YXRlID0ge3RvU3RhdGU6IHZpZXdTdGF0ZS50b1N0YXRlfTtcbiAgICB9XG4gIH1cblxuICAvKiogVHJpZ2dlcnMgdGhlIHNvcnQgb24gdGhpcyBzb3J0IGhlYWRlciBhbmQgcmVtb3ZlcyB0aGUgaW5kaWNhdG9yIGhpbnQuICovXG4gIF9oYW5kbGVDbGljaygpIHtcbiAgICBpZiAodGhpcy5faXNEaXNhYmxlZCgpKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fc29ydC5zb3J0KHRoaXMpO1xuXG4gICAgLy8gRG8gbm90IHNob3cgdGhlIGFuaW1hdGlvbiBpZiB0aGUgaGVhZGVyIHdhcyBhbHJlYWR5IHNob3duIGluIHRoZSByaWdodCBwb3NpdGlvbi5cbiAgICBpZiAodGhpcy5fdmlld1N0YXRlLnRvU3RhdGUgPT09ICdoaW50JyB8fCB0aGlzLl92aWV3U3RhdGUudG9TdGF0ZSA9PT0gJ2FjdGl2ZScpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBhcnJvdyBpcyBub3cgc29ydGVkLCBhbmltYXRlIHRoZSBhcnJvdyBpbnRvIHBsYWNlLiBPdGhlcndpc2UsIGFuaW1hdGUgaXQgYXdheSBpbnRvXG4gICAgLy8gdGhlIGRpcmVjdGlvbiBpdCBpcyBmYWNpbmcuXG4gICAgY29uc3Qgdmlld1N0YXRlOiBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb24gPSB0aGlzLl9pc1NvcnRlZCgpID9cbiAgICAgICAge2Zyb21TdGF0ZTogdGhpcy5fYXJyb3dEaXJlY3Rpb24sIHRvU3RhdGU6ICdhY3RpdmUnfSA6XG4gICAgICAgIHtmcm9tU3RhdGU6ICdhY3RpdmUnLCB0b1N0YXRlOiB0aGlzLl9hcnJvd0RpcmVjdGlvbn07XG4gICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHZpZXdTdGF0ZSk7XG5cbiAgICB0aGlzLl9zaG93SW5kaWNhdG9ySGludCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBNYXRTb3J0SGVhZGVyIGlzIGN1cnJlbnRseSBzb3J0ZWQgaW4gZWl0aGVyIGFzY2VuZGluZyBvciBkZXNjZW5kaW5nIG9yZGVyLiAqL1xuICBfaXNTb3J0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnQuYWN0aXZlID09IHRoaXMuaWQgJiZcbiAgICAgICAgKHRoaXMuX3NvcnQuZGlyZWN0aW9uID09PSAnYXNjJyB8fCB0aGlzLl9zb3J0LmRpcmVjdGlvbiA9PT0gJ2Rlc2MnKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBhbmltYXRpb24gc3RhdGUgZm9yIHRoZSBhcnJvdyBkaXJlY3Rpb24gKGluZGljYXRvciBhbmQgcG9pbnRlcnMpLiAqL1xuICBfZ2V0QXJyb3dEaXJlY3Rpb25TdGF0ZSgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5faXNTb3J0ZWQoKSA/ICdhY3RpdmUtJyA6ICcnfSR7dGhpcy5fYXJyb3dEaXJlY3Rpb259YDtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBhcnJvdyBwb3NpdGlvbiBzdGF0ZSAob3BhY2l0eSwgdHJhbnNsYXRpb24pLiAqL1xuICBfZ2V0QXJyb3dWaWV3U3RhdGUoKSB7XG4gICAgY29uc3QgZnJvbVN0YXRlID0gdGhpcy5fdmlld1N0YXRlLmZyb21TdGF0ZTtcbiAgICByZXR1cm4gKGZyb21TdGF0ZSA/IGAke2Zyb21TdGF0ZX0tdG8tYCA6ICcnKSArIHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGRpcmVjdGlvbiB0aGUgYXJyb3cgc2hvdWxkIGJlIHBvaW50aW5nLiBJZiBpdCBpcyBub3Qgc29ydGVkLCB0aGUgYXJyb3cgc2hvdWxkIGJlXG4gICAqIGZhY2luZyB0aGUgc3RhcnQgZGlyZWN0aW9uLiBPdGhlcndpc2UgaWYgaXQgaXMgc29ydGVkLCB0aGUgYXJyb3cgc2hvdWxkIHBvaW50IGluIHRoZSBjdXJyZW50bHlcbiAgICogYWN0aXZlIHNvcnRlZCBkaXJlY3Rpb24uIFRoZSByZWFzb24gdGhpcyBpcyB1cGRhdGVkIHRocm91Z2ggYSBmdW5jdGlvbiBpcyBiZWNhdXNlIHRoZSBkaXJlY3Rpb25cbiAgICogc2hvdWxkIG9ubHkgYmUgY2hhbmdlZCBhdCBzcGVjaWZpYyB0aW1lcyAtIHdoZW4gZGVhY3RpdmF0ZWQgYnV0IHRoZSBoaW50IGlzIGRpc3BsYXllZCBhbmQgd2hlblxuICAgKiB0aGUgc29ydCBpcyBhY3RpdmUgYW5kIHRoZSBkaXJlY3Rpb24gY2hhbmdlcy4gT3RoZXJ3aXNlIHRoZSBhcnJvdydzIGRpcmVjdGlvbiBzaG91bGQgbGluZ2VyXG4gICAqIGluIGNhc2VzIHN1Y2ggYXMgdGhlIHNvcnQgYmVjb21pbmcgZGVhY3RpdmF0ZWQgYnV0IHdlIHdhbnQgdG8gYW5pbWF0ZSB0aGUgYXJyb3cgYXdheSB3aGlsZVxuICAgKiBwcmVzZXJ2aW5nIGl0cyBkaXJlY3Rpb24sIGV2ZW4gdGhvdWdoIHRoZSBuZXh0IHNvcnQgZGlyZWN0aW9uIGlzIGFjdHVhbGx5IGRpZmZlcmVudCBhbmQgc2hvdWxkXG4gICAqIG9ubHkgYmUgY2hhbmdlZCBvbmNlIHRoZSBhcnJvdyBkaXNwbGF5cyBhZ2FpbiAoaGludCBvciBhY3RpdmF0aW9uKS5cbiAgICovXG4gIF91cGRhdGVBcnJvd0RpcmVjdGlvbigpIHtcbiAgICB0aGlzLl9hcnJvd0RpcmVjdGlvbiA9IHRoaXMuX2lzU29ydGVkKCkgP1xuICAgICAgICB0aGlzLl9zb3J0LmRpcmVjdGlvbiA6XG4gICAgICAgICh0aGlzLnN0YXJ0IHx8IHRoaXMuX3NvcnQuc3RhcnQpO1xuICB9XG5cbiAgX2lzRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnQuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBhcmlhLXNvcnQgYXR0cmlidXRlIHRoYXQgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhpcyBzb3J0IGhlYWRlci4gSWYgdGhpcyBoZWFkZXJcbiAgICogaXMgbm90IHNvcnRlZCwgcmV0dXJucyBudWxsIHNvIHRoYXQgdGhlIGF0dHJpYnV0ZSBpcyByZW1vdmVkIGZyb20gdGhlIGhvc3QgZWxlbWVudC4gQXJpYSBzcGVjXG4gICAqIHNheXMgdGhhdCB0aGUgYXJpYS1zb3J0IHByb3BlcnR5IHNob3VsZCBvbmx5IGJlIHByZXNlbnQgb24gb25lIGhlYWRlciBhdCBhIHRpbWUsIHNvIHJlbW92aW5nXG4gICAqIGVuc3VyZXMgdGhpcyBpcyB0cnVlLlxuICAgKi9cbiAgX2dldEFyaWFTb3J0QXR0cmlidXRlKCkge1xuICAgIGlmICghdGhpcy5faXNTb3J0ZWQoKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3NvcnQuZGlyZWN0aW9uID09ICdhc2MnID8gJ2FzY2VuZGluZycgOiAnZGVzY2VuZGluZyc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYXJyb3cgaW5zaWRlIHRoZSBzb3J0IGhlYWRlciBzaG91bGQgYmUgcmVuZGVyZWQuICovXG4gIF9yZW5kZXJBcnJvdygpIHtcbiAgICByZXR1cm4gIXRoaXMuX2lzRGlzYWJsZWQoKSB8fCB0aGlzLl9pc1NvcnRlZCgpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVDbGVhcjogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==