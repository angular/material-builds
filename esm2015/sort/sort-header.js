/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
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
    let MatSortHeader = class MatSortHeader extends _MatSortHeaderMixinBase {
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
    };
    __decorate([
        Input('mat-sort-header'),
        __metadata("design:type", String)
    ], MatSortHeader.prototype, "id", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatSortHeader.prototype, "arrowPosition", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatSortHeader.prototype, "start", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Object])
    ], MatSortHeader.prototype, "disableClear", null);
    MatSortHeader = __decorate([
        Component({
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
            styles: [".mat-sort-header-container{display:flex;cursor:pointer;align-items:center}.mat-sort-header-disabled .mat-sort-header-container{cursor:default}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-button{border:none;background:0 0;display:flex;align-items:center;padding:0;cursor:inherit;outline:0;font:inherit;color:currentColor;position:relative}[mat-sort-header].cdk-keyboard-focused .mat-sort-header-button,[mat-sort-header].cdk-program-focused .mat-sort-header-button{border-bottom:solid 1px currentColor}.mat-sort-header-button::-moz-focus-inner{border:0}.mat-sort-header-arrow{height:12px;width:12px;min-width:12px;position:relative;display:flex;opacity:0}.mat-sort-header-arrow,[dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow{margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow,[dir=rtl] .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-stem{background:currentColor;height:10px;width:2px;margin:auto;display:flex;align-items:center}.cdk-high-contrast-active .mat-sort-header-stem{width:0;border-left:solid 2px}.mat-sort-header-indicator{width:100%;height:2px;display:flex;align-items:center;position:absolute;top:0;left:0}.mat-sort-header-pointer-middle{margin:auto;height:2px;width:2px;background:currentColor;transform:rotate(45deg)}.cdk-high-contrast-active .mat-sort-header-pointer-middle{width:0;height:0;border-top:solid 2px;border-left:solid 2px}.mat-sort-header-pointer-left,.mat-sort-header-pointer-right{background:currentColor;width:6px;height:2px;position:absolute;top:0}.cdk-high-contrast-active .mat-sort-header-pointer-left,.cdk-high-contrast-active .mat-sort-header-pointer-right{width:0;height:0;border-left:solid 6px;border-top:solid 2px}.mat-sort-header-pointer-left{transform-origin:right;left:0}.mat-sort-header-pointer-right{transform-origin:left;right:0}\n"]
        }),
        __param(2, Optional()),
        __param(3, Inject('MAT_SORT_HEADER_COLUMN_DEF')), __param(3, Optional()),
        __metadata("design:paramtypes", [MatSortHeaderIntl,
            ChangeDetectorRef,
            MatSort, Object, FocusMonitor,
            ElementRef])
    ], MatSortHeader);
    return MatSortHeader;
})();
export { MatSortHeader };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc29ydC9zb3J0LWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULEtBQUssRUFHTCxRQUFRLEVBQ1IsaUJBQWlCLEVBQ2pCLE1BQU0sRUFDTixVQUFVLEdBQ1gsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUE2QixhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDL0MsT0FBTyxFQUFDLEtBQUssRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUN6QyxPQUFPLEVBQUMsT0FBTyxFQUFjLE1BQU0sUUFBUSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXBELE9BQU8sRUFBQyx3Q0FBd0MsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2RSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUdyRCxzREFBc0Q7QUFDdEQsb0JBQW9CO0FBQ3BCLE1BQU0saUJBQWlCO0NBQUc7QUFDMUIsTUFBTSx1QkFBdUIsR0FDekIsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUEyQnJDOzs7Ozs7OztHQVFHO0FBMEJIO0lBQUEsSUFBYSxhQUFhLEdBQTFCLE1BQWEsYUFBYyxTQUFRLHVCQUF1QjtRQTJDeEQsWUFBbUIsS0FBd0IsRUFDL0IsaUJBQW9DLEVBQ2pCLEtBQWMsRUFFdEIsVUFBa0MsRUFDckMsYUFBMkIsRUFDM0IsV0FBb0M7WUFDdEQsOEZBQThGO1lBQzlGLG9GQUFvRjtZQUNw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Q2pELGtCQUFrQixFQUFFLHlCQUF5QjtnQkFDN0Msa0NBQWtDLEVBQUUsZUFBZTthQUNwRDtZQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1lBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1lBQy9DLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUNwQixVQUFVLEVBQUU7Z0JBQ1YsaUJBQWlCLENBQUMsU0FBUztnQkFDM0IsaUJBQWlCLENBQUMsV0FBVztnQkFDN0IsaUJBQWlCLENBQUMsWUFBWTtnQkFDOUIsaUJBQWlCLENBQUMsWUFBWTtnQkFDOUIsaUJBQWlCLENBQUMsYUFBYTtnQkFDL0IsaUJBQWlCLENBQUMsYUFBYTthQUNoQzs7U0FDRixDQUFDO1FBOENhLFdBQUEsUUFBUSxFQUFFLENBQUE7UUFDVixXQUFBLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBLEVBQUUsV0FBQSxRQUFRLEVBQUUsQ0FBQTt5Q0FIbkMsaUJBQWlCO1lBQ1osaUJBQWlCO1lBQ1YsT0FBTyxVQUdWLFlBQVk7WUFDZCxVQUFVO09BakRoQyxhQUFhLENBb056QjtJQUFELG9CQUFDO0tBQUE7U0FwTlksYUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3QsXG4gIEVsZW1lbnRSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBDYW5EaXNhYmxlQ3RvciwgbWl4aW5EaXNhYmxlZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0ZvY3VzTW9uaXRvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHttZXJnZSwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWF0U29ydCwgTWF0U29ydGFibGV9IGZyb20gJy4vc29ydCc7XG5pbXBvcnQge21hdFNvcnRBbmltYXRpb25zfSBmcm9tICcuL3NvcnQtYW5pbWF0aW9ucyc7XG5pbXBvcnQge1NvcnREaXJlY3Rpb259IGZyb20gJy4vc29ydC1kaXJlY3Rpb24nO1xuaW1wb3J0IHtnZXRTb3J0SGVhZGVyTm90Q29udGFpbmVkV2l0aGluU29ydEVycm9yfSBmcm9tICcuL3NvcnQtZXJyb3JzJztcbmltcG9ydCB7TWF0U29ydEhlYWRlckludGx9IGZyb20gJy4vc29ydC1oZWFkZXItaW50bCc7XG5cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byB0aGUgc29ydCBoZWFkZXIuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0U29ydEhlYWRlckJhc2Uge31cbmNvbnN0IF9NYXRTb3J0SGVhZGVyTWl4aW5CYXNlOiBDYW5EaXNhYmxlQ3RvciAmIHR5cGVvZiBNYXRTb3J0SGVhZGVyQmFzZSA9XG4gICAgbWl4aW5EaXNhYmxlZChNYXRTb3J0SGVhZGVyQmFzZSk7XG5cbi8qKlxuICogVmFsaWQgcG9zaXRpb25zIGZvciB0aGUgYXJyb3cgdG8gYmUgaW4gZm9yIGl0cyBvcGFjaXR5IGFuZCB0cmFuc2xhdGlvbi4gSWYgdGhlIHN0YXRlIGlzIGFcbiAqIHNvcnQgZGlyZWN0aW9uLCB0aGUgcG9zaXRpb24gb2YgdGhlIGFycm93IHdpbGwgYmUgYWJvdmUvYmVsb3cgYW5kIG9wYWNpdHkgMC4gSWYgdGhlIHN0YXRlIGlzXG4gKiBoaW50LCB0aGUgYXJyb3cgd2lsbCBiZSBpbiB0aGUgY2VudGVyIHdpdGggYSBzbGlnaHQgb3BhY2l0eS4gQWN0aXZlIHN0YXRlIG1lYW5zIHRoZSBhcnJvdyB3aWxsXG4gKiBiZSBmdWxseSBvcGFxdWUgaW4gdGhlIGNlbnRlci5cbiAqXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCB0eXBlIEFycm93Vmlld1N0YXRlID0gU29ydERpcmVjdGlvbiB8ICdoaW50JyB8ICdhY3RpdmUnO1xuXG4vKipcbiAqIFN0YXRlcyBkZXNjcmliaW5nIHRoZSBhcnJvdydzIGFuaW1hdGVkIHBvc2l0aW9uIChhbmltYXRpbmcgZnJvbVN0YXRlIHRvIHRvU3RhdGUpLlxuICogSWYgdGhlIGZyb21TdGF0ZSBpcyBub3QgZGVmaW5lZCwgdGhlcmUgd2lsbCBiZSBubyBhbmltYXRlZCB0cmFuc2l0aW9uIHRvIHRoZSB0b1N0YXRlLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFycm93Vmlld1N0YXRlVHJhbnNpdGlvbiB7XG4gIGZyb21TdGF0ZT86IEFycm93Vmlld1N0YXRlO1xuICB0b1N0YXRlOiBBcnJvd1ZpZXdTdGF0ZTtcbn1cblxuLyoqIENvbHVtbiBkZWZpbml0aW9uIGFzc29jaWF0ZWQgd2l0aCBhIGBNYXRTb3J0SGVhZGVyYC4gKi9cbmludGVyZmFjZSBNYXRTb3J0SGVhZGVyQ29sdW1uRGVmIHtcbiAgbmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIEFwcGxpZXMgc29ydGluZyBiZWhhdmlvciAoY2xpY2sgdG8gY2hhbmdlIHNvcnQpIGFuZCBzdHlsZXMgdG8gYW4gZWxlbWVudCwgaW5jbHVkaW5nIGFuXG4gKiBhcnJvdyB0byBkaXNwbGF5IHRoZSBjdXJyZW50IHNvcnQgZGlyZWN0aW9uLlxuICpcbiAqIE11c3QgYmUgcHJvdmlkZWQgd2l0aCBhbiBpZCBhbmQgY29udGFpbmVkIHdpdGhpbiBhIHBhcmVudCBNYXRTb3J0IGRpcmVjdGl2ZS5cbiAqXG4gKiBJZiB1c2VkIG9uIGhlYWRlciBjZWxscyBpbiBhIENka1RhYmxlLCBpdCB3aWxsIGF1dG9tYXRpY2FsbHkgZGVmYXVsdCBpdHMgaWQgZnJvbSBpdHMgY29udGFpbmluZ1xuICogY29sdW1uIGRlZmluaXRpb24uXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ1ttYXQtc29ydC1oZWFkZXJdJyxcbiAgZXhwb3J0QXM6ICdtYXRTb3J0SGVhZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdzb3J0LWhlYWRlci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3NvcnQtaGVhZGVyLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1zb3J0LWhlYWRlcicsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCknLFxuICAgICcobW91c2VlbnRlciknOiAnX3NldEluZGljYXRvckhpbnRWaXNpYmxlKHRydWUpJyxcbiAgICAnKG1vdXNlbGVhdmUpJzogJ19zZXRJbmRpY2F0b3JIaW50VmlzaWJsZShmYWxzZSknLFxuICAgICdbYXR0ci5hcmlhLXNvcnRdJzogJ19nZXRBcmlhU29ydEF0dHJpYnV0ZSgpJyxcbiAgICAnW2NsYXNzLm1hdC1zb3J0LWhlYWRlci1kaXNhYmxlZF0nOiAnX2lzRGlzYWJsZWQoKScsXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnXSxcbiAgYW5pbWF0aW9uczogW1xuICAgIG1hdFNvcnRBbmltYXRpb25zLmluZGljYXRvcixcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5sZWZ0UG9pbnRlcixcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5yaWdodFBvaW50ZXIsXG4gICAgbWF0U29ydEFuaW1hdGlvbnMuYXJyb3dPcGFjaXR5LFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmFycm93UG9zaXRpb24sXG4gICAgbWF0U29ydEFuaW1hdGlvbnMuYWxsb3dDaGlsZHJlbixcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRTb3J0SGVhZGVyIGV4dGVuZHMgX01hdFNvcnRIZWFkZXJNaXhpbkJhc2VcbiAgICBpbXBsZW1lbnRzIENhbkRpc2FibGUsIE1hdFNvcnRhYmxlLCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIHByaXZhdGUgX3JlcmVuZGVyU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqXG4gICAqIEZsYWcgc2V0IHRvIHRydWUgd2hlbiB0aGUgaW5kaWNhdG9yIHNob3VsZCBiZSBkaXNwbGF5ZWQgd2hpbGUgdGhlIHNvcnQgaXMgbm90IGFjdGl2ZS4gVXNlZCB0b1xuICAgKiBwcm92aWRlIGFuIGFmZm9yZGFuY2UgdGhhdCB0aGUgaGVhZGVyIGlzIHNvcnRhYmxlIGJ5IHNob3dpbmcgb24gZm9jdXMgYW5kIGhvdmVyLlxuICAgKi9cbiAgX3Nob3dJbmRpY2F0b3JIaW50OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSB2aWV3IHRyYW5zaXRpb24gc3RhdGUgb2YgdGhlIGFycm93ICh0cmFuc2xhdGlvbi8gb3BhY2l0eSkgLSBpbmRpY2F0ZXMgaXRzIGBmcm9tYCBhbmQgYHRvYFxuICAgKiBwb3NpdGlvbiB0aHJvdWdoIHRoZSBhbmltYXRpb24uIElmIGFuaW1hdGlvbnMgYXJlIGN1cnJlbnRseSBkaXNhYmxlZCwgdGhlIGZyb21TdGF0ZSBpcyByZW1vdmVkXG4gICAqIHNvIHRoYXQgdGhlcmUgaXMgbm8gYW5pbWF0aW9uIGRpc3BsYXllZC5cbiAgICovXG4gIF92aWV3U3RhdGU6IEFycm93Vmlld1N0YXRlVHJhbnNpdGlvbjtcblxuICAvKiogVGhlIGRpcmVjdGlvbiB0aGUgYXJyb3cgc2hvdWxkIGJlIGZhY2luZyBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuICovXG4gIF9hcnJvd0RpcmVjdGlvbjogU29ydERpcmVjdGlvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSB2aWV3IHN0YXRlIGFuaW1hdGlvbiBzaG91bGQgc2hvdyB0aGUgdHJhbnNpdGlvbiBiZXR3ZWVuIHRoZSBgZnJvbWAgYW5kIGB0b2Agc3RhdGVzLlxuICAgKi9cbiAgX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24gPSBmYWxzZTtcblxuICAvKipcbiAgICogSUQgb2YgdGhpcyBzb3J0IGhlYWRlci4gSWYgdXNlZCB3aXRoaW4gdGhlIGNvbnRleHQgb2YgYSBDZGtDb2x1bW5EZWYsIHRoaXMgd2lsbCBkZWZhdWx0IHRvXG4gICAqIHRoZSBjb2x1bW4ncyBuYW1lLlxuICAgKi9cbiAgQElucHV0KCdtYXQtc29ydC1oZWFkZXInKSBpZDogc3RyaW5nO1xuXG4gIC8qKiBTZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgYXJyb3cgdGhhdCBkaXNwbGF5cyB3aGVuIHNvcnRlZC4gKi9cbiAgQElucHV0KCkgYXJyb3dQb3NpdGlvbjogJ2JlZm9yZScgfCAnYWZ0ZXInID0gJ2FmdGVyJztcblxuICAvKiogT3ZlcnJpZGVzIHRoZSBzb3J0IHN0YXJ0IHZhbHVlIG9mIHRoZSBjb250YWluaW5nIE1hdFNvcnQgZm9yIHRoaXMgTWF0U29ydGFibGUuICovXG4gIEBJbnB1dCgpIHN0YXJ0OiAnYXNjJyB8ICdkZXNjJztcblxuICAvKiogT3ZlcnJpZGVzIHRoZSBkaXNhYmxlIGNsZWFyIHZhbHVlIG9mIHRoZSBjb250YWluaW5nIE1hdFNvcnQgZm9yIHRoaXMgTWF0U29ydGFibGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlQ2xlYXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlQ2xlYXI7IH1cbiAgc2V0IGRpc2FibGVDbGVhcih2KSB7IHRoaXMuX2Rpc2FibGVDbGVhciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2KTsgfVxuICBwcml2YXRlIF9kaXNhYmxlQ2xlYXI6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHVibGljIF9pbnRsOiBNYXRTb3J0SGVhZGVySW50bCxcbiAgICAgICAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX3NvcnQ6IE1hdFNvcnQsXG4gICAgICAgICAgICAgIEBJbmplY3QoJ01BVF9TT1JUX0hFQURFUl9DT0xVTU5fREVGJykgQE9wdGlvbmFsKClcbiAgICAgICAgICAgICAgICAgIHB1YmxpYyBfY29sdW1uRGVmOiBNYXRTb3J0SGVhZGVyQ29sdW1uRGVmLFxuICAgICAgICAgICAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgdXNlIGEgc3RyaW5nIHRva2VuIGZvciB0aGUgYF9jb2x1bW5EZWZgLCBiZWNhdXNlIHRoZSB2YWx1ZSBpcyBwcm92aWRlZCBib3RoIGJ5XG4gICAgLy8gYG1hdGVyaWFsL3RhYmxlYCBhbmQgYGNkay90YWJsZWAgYW5kIHdlIGNhbid0IGhhdmUgdGhlIENESyBkZXBlbmRpbmcgb24gTWF0ZXJpYWwsXG4gICAgLy8gYW5kIHdlIHdhbnQgdG8gYXZvaWQgaGF2aW5nIHRoZSBzb3J0IGhlYWRlciBkZXBlbmRpbmcgb24gdGhlIENESyB0YWJsZSBiZWNhdXNlXG4gICAgLy8gb2YgdGhpcyBzaW5nbGUgcmVmZXJlbmNlLlxuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoIV9zb3J0KSB7XG4gICAgICB0aHJvdyBnZXRTb3J0SGVhZGVyTm90Q29udGFpbmVkV2l0aGluU29ydEVycm9yKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVyZW5kZXJTdWJzY3JpcHRpb24gPSBtZXJnZShfc29ydC5zb3J0Q2hhbmdlLCBfc29ydC5fc3RhdGVDaGFuZ2VzLCBfaW50bC5jaGFuZ2VzKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5faXNTb3J0ZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQXJyb3dEaXJlY3Rpb24oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGlzIGhlYWRlciB3YXMgcmVjZW50bHkgYWN0aXZlIGFuZCBub3cgbm8gbG9uZ2VyIHNvcnRlZCwgYW5pbWF0ZSBhd2F5IHRoZSBhcnJvdy5cbiAgICAgICAgICBpZiAoIXRoaXMuX2lzU29ydGVkKCkgJiYgdGhpcy5fdmlld1N0YXRlICYmIHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID09PSAnYWN0aXZlJykge1xuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6ICdhY3RpdmUnLCB0b1N0YXRlOiB0aGlzLl9hcnJvd0RpcmVjdGlvbn0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KTtcblxuICAgIC8vIFdlIHVzZSB0aGUgZm9jdXMgbW9uaXRvciBiZWNhdXNlIHdlIGFsc28gd2FudCB0byBzdHlsZVxuICAgIC8vIHRoaW5ncyBkaWZmZXJlbnRseSBiYXNlZCBvbiB0aGUgZm9jdXMgb3JpZ2luLlxuICAgIF9mb2N1c01vbml0b3IubW9uaXRvcihfZWxlbWVudFJlZiwgdHJ1ZSlcbiAgICAgICAgLnN1YnNjcmliZShvcmlnaW4gPT4gdGhpcy5fc2V0SW5kaWNhdG9ySGludFZpc2libGUoISFvcmlnaW4pKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5pZCAmJiB0aGlzLl9jb2x1bW5EZWYpIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLl9jb2x1bW5EZWYubmFtZTtcbiAgICB9XG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSBkaXJlY3Rpb24gb2YgdGhlIGFycm93IGFuZCBzZXQgdGhlIHZpZXcgc3RhdGUgdG8gYmUgaW1tZWRpYXRlbHkgdGhhdCBzdGF0ZS5cbiAgICB0aGlzLl91cGRhdGVBcnJvd0RpcmVjdGlvbigpO1xuICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZShcbiAgICAgICAge3RvU3RhdGU6IHRoaXMuX2lzU29ydGVkKCkgPyAnYWN0aXZlJyA6IHRoaXMuX2Fycm93RGlyZWN0aW9ufSk7XG5cbiAgICB0aGlzLl9zb3J0LnJlZ2lzdGVyKHRoaXMpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICAgIHRoaXMuX3NvcnQuZGVyZWdpc3Rlcih0aGlzKTtcbiAgICB0aGlzLl9yZXJlbmRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIFwiaGludFwiIHN0YXRlIHN1Y2ggdGhhdCB0aGUgYXJyb3cgd2lsbCBiZSBzZW1pLXRyYW5zcGFyZW50bHkgZGlzcGxheWVkIGFzIGEgaGludCB0byB0aGVcbiAgICogdXNlciBzaG93aW5nIHdoYXQgdGhlIGFjdGl2ZSBzb3J0IHdpbGwgYmVjb21lLiBJZiBzZXQgdG8gZmFsc2UsIHRoZSBhcnJvdyB3aWxsIGZhZGUgYXdheS5cbiAgICovXG4gIF9zZXRJbmRpY2F0b3JIaW50VmlzaWJsZSh2aXNpYmxlOiBib29sZWFuKSB7XG4gICAgLy8gTm8tb3AgaWYgdGhlIHNvcnQgaGVhZGVyIGlzIGRpc2FibGVkIC0gc2hvdWxkIG5vdCBtYWtlIHRoZSBoaW50IHZpc2libGUuXG4gICAgaWYgKHRoaXMuX2lzRGlzYWJsZWQoKSAmJiB2aXNpYmxlKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fc2hvd0luZGljYXRvckhpbnQgPSB2aXNpYmxlO1xuXG4gICAgaWYgKCF0aGlzLl9pc1NvcnRlZCgpKSB7XG4gICAgICB0aGlzLl91cGRhdGVBcnJvd0RpcmVjdGlvbigpO1xuICAgICAgaWYgKHRoaXMuX3Nob3dJbmRpY2F0b3JIaW50KSB7XG4gICAgICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh7ZnJvbVN0YXRlOiB0aGlzLl9hcnJvd0RpcmVjdGlvbiwgdG9TdGF0ZTogJ2hpbnQnfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUoe2Zyb21TdGF0ZTogJ2hpbnQnLCB0b1N0YXRlOiB0aGlzLl9hcnJvd0RpcmVjdGlvbn0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBhbmltYXRpb24gdHJhbnNpdGlvbiB2aWV3IHN0YXRlIGZvciB0aGUgYXJyb3cncyBwb3NpdGlvbiBhbmQgb3BhY2l0eS4gSWYgdGhlXG4gICAqIGBkaXNhYmxlVmlld1N0YXRlQW5pbWF0aW9uYCBmbGFnIGlzIHNldCB0byB0cnVlLCB0aGUgYGZyb21TdGF0ZWAgd2lsbCBiZSBpZ25vcmVkIHNvIHRoYXRcbiAgICogbm8gYW5pbWF0aW9uIGFwcGVhcnMuXG4gICAqL1xuICBfc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHZpZXdTdGF0ZTogQXJyb3dWaWV3U3RhdGVUcmFuc2l0aW9uKSB7XG4gICAgdGhpcy5fdmlld1N0YXRlID0gdmlld1N0YXRlO1xuXG4gICAgLy8gSWYgdGhlIGFuaW1hdGlvbiBmb3IgYXJyb3cgcG9zaXRpb24gc3RhdGUgKG9wYWNpdHkvdHJhbnNsYXRpb24pIHNob3VsZCBiZSBkaXNhYmxlZCxcbiAgICAvLyByZW1vdmUgdGhlIGZyb21TdGF0ZSBzbyB0aGF0IGl0IGp1bXBzIHJpZ2h0IHRvIHRoZSB0b1N0YXRlLlxuICAgIGlmICh0aGlzLl9kaXNhYmxlVmlld1N0YXRlQW5pbWF0aW9uKSB7XG4gICAgICB0aGlzLl92aWV3U3RhdGUgPSB7dG9TdGF0ZTogdmlld1N0YXRlLnRvU3RhdGV9O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUcmlnZ2VycyB0aGUgc29ydCBvbiB0aGlzIHNvcnQgaGVhZGVyIGFuZCByZW1vdmVzIHRoZSBpbmRpY2F0b3IgaGludC4gKi9cbiAgX2hhbmRsZUNsaWNrKCkge1xuICAgIGlmICh0aGlzLl9pc0Rpc2FibGVkKCkpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9zb3J0LnNvcnQodGhpcyk7XG5cbiAgICAvLyBEbyBub3Qgc2hvdyB0aGUgYW5pbWF0aW9uIGlmIHRoZSBoZWFkZXIgd2FzIGFscmVhZHkgc2hvd24gaW4gdGhlIHJpZ2h0IHBvc2l0aW9uLlxuICAgIGlmICh0aGlzLl92aWV3U3RhdGUudG9TdGF0ZSA9PT0gJ2hpbnQnIHx8IHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID09PSAnYWN0aXZlJykge1xuICAgICAgdGhpcy5fZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGFycm93IGlzIG5vdyBzb3J0ZWQsIGFuaW1hdGUgdGhlIGFycm93IGludG8gcGxhY2UuIE90aGVyd2lzZSwgYW5pbWF0ZSBpdCBhd2F5IGludG9cbiAgICAvLyB0aGUgZGlyZWN0aW9uIGl0IGlzIGZhY2luZy5cbiAgICBjb25zdCB2aWV3U3RhdGU6IEFycm93Vmlld1N0YXRlVHJhbnNpdGlvbiA9IHRoaXMuX2lzU29ydGVkKCkgP1xuICAgICAgICB7ZnJvbVN0YXRlOiB0aGlzLl9hcnJvd0RpcmVjdGlvbiwgdG9TdGF0ZTogJ2FjdGl2ZSd9IDpcbiAgICAgICAge2Zyb21TdGF0ZTogJ2FjdGl2ZScsIHRvU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9ufTtcbiAgICB0aGlzLl9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUodmlld1N0YXRlKTtcblxuICAgIHRoaXMuX3Nob3dJbmRpY2F0b3JIaW50ID0gZmFsc2U7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIE1hdFNvcnRIZWFkZXIgaXMgY3VycmVudGx5IHNvcnRlZCBpbiBlaXRoZXIgYXNjZW5kaW5nIG9yIGRlc2NlbmRpbmcgb3JkZXIuICovXG4gIF9pc1NvcnRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydC5hY3RpdmUgPT0gdGhpcy5pZCAmJlxuICAgICAgICAodGhpcy5fc29ydC5kaXJlY3Rpb24gPT09ICdhc2MnIHx8IHRoaXMuX3NvcnQuZGlyZWN0aW9uID09PSAnZGVzYycpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGFuaW1hdGlvbiBzdGF0ZSBmb3IgdGhlIGFycm93IGRpcmVjdGlvbiAoaW5kaWNhdG9yIGFuZCBwb2ludGVycykuICovXG4gIF9nZXRBcnJvd0RpcmVjdGlvblN0YXRlKCkge1xuICAgIHJldHVybiBgJHt0aGlzLl9pc1NvcnRlZCgpID8gJ2FjdGl2ZS0nIDogJyd9JHt0aGlzLl9hcnJvd0RpcmVjdGlvbn1gO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGFycm93IHBvc2l0aW9uIHN0YXRlIChvcGFjaXR5LCB0cmFuc2xhdGlvbikuICovXG4gIF9nZXRBcnJvd1ZpZXdTdGF0ZSgpIHtcbiAgICBjb25zdCBmcm9tU3RhdGUgPSB0aGlzLl92aWV3U3RhdGUuZnJvbVN0YXRlO1xuICAgIHJldHVybiAoZnJvbVN0YXRlID8gYCR7ZnJvbVN0YXRlfS10by1gIDogJycpICsgdGhpcy5fdmlld1N0YXRlLnRvU3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgZGlyZWN0aW9uIHRoZSBhcnJvdyBzaG91bGQgYmUgcG9pbnRpbmcuIElmIGl0IGlzIG5vdCBzb3J0ZWQsIHRoZSBhcnJvdyBzaG91bGQgYmVcbiAgICogZmFjaW5nIHRoZSBzdGFydCBkaXJlY3Rpb24uIE90aGVyd2lzZSBpZiBpdCBpcyBzb3J0ZWQsIHRoZSBhcnJvdyBzaG91bGQgcG9pbnQgaW4gdGhlIGN1cnJlbnRseVxuICAgKiBhY3RpdmUgc29ydGVkIGRpcmVjdGlvbi4gVGhlIHJlYXNvbiB0aGlzIGlzIHVwZGF0ZWQgdGhyb3VnaCBhIGZ1bmN0aW9uIGlzIGJlY2F1c2UgdGhlIGRpcmVjdGlvblxuICAgKiBzaG91bGQgb25seSBiZSBjaGFuZ2VkIGF0IHNwZWNpZmljIHRpbWVzIC0gd2hlbiBkZWFjdGl2YXRlZCBidXQgdGhlIGhpbnQgaXMgZGlzcGxheWVkIGFuZCB3aGVuXG4gICAqIHRoZSBzb3J0IGlzIGFjdGl2ZSBhbmQgdGhlIGRpcmVjdGlvbiBjaGFuZ2VzLiBPdGhlcndpc2UgdGhlIGFycm93J3MgZGlyZWN0aW9uIHNob3VsZCBsaW5nZXJcbiAgICogaW4gY2FzZXMgc3VjaCBhcyB0aGUgc29ydCBiZWNvbWluZyBkZWFjdGl2YXRlZCBidXQgd2Ugd2FudCB0byBhbmltYXRlIHRoZSBhcnJvdyBhd2F5IHdoaWxlXG4gICAqIHByZXNlcnZpbmcgaXRzIGRpcmVjdGlvbiwgZXZlbiB0aG91Z2ggdGhlIG5leHQgc29ydCBkaXJlY3Rpb24gaXMgYWN0dWFsbHkgZGlmZmVyZW50IGFuZCBzaG91bGRcbiAgICogb25seSBiZSBjaGFuZ2VkIG9uY2UgdGhlIGFycm93IGRpc3BsYXlzIGFnYWluIChoaW50IG9yIGFjdGl2YXRpb24pLlxuICAgKi9cbiAgX3VwZGF0ZUFycm93RGlyZWN0aW9uKCkge1xuICAgIHRoaXMuX2Fycm93RGlyZWN0aW9uID0gdGhpcy5faXNTb3J0ZWQoKSA/XG4gICAgICAgIHRoaXMuX3NvcnQuZGlyZWN0aW9uIDpcbiAgICAgICAgKHRoaXMuc3RhcnQgfHwgdGhpcy5fc29ydC5zdGFydCk7XG4gIH1cblxuICBfaXNEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydC5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGFyaWEtc29ydCBhdHRyaWJ1dGUgdGhhdCBzaG91bGQgYmUgYXBwbGllZCB0byB0aGlzIHNvcnQgaGVhZGVyLiBJZiB0aGlzIGhlYWRlclxuICAgKiBpcyBub3Qgc29ydGVkLCByZXR1cm5zIG51bGwgc28gdGhhdCB0aGUgYXR0cmlidXRlIGlzIHJlbW92ZWQgZnJvbSB0aGUgaG9zdCBlbGVtZW50LiBBcmlhIHNwZWNcbiAgICogc2F5cyB0aGF0IHRoZSBhcmlhLXNvcnQgcHJvcGVydHkgc2hvdWxkIG9ubHkgYmUgcHJlc2VudCBvbiBvbmUgaGVhZGVyIGF0IGEgdGltZSwgc28gcmVtb3ZpbmdcbiAgICogZW5zdXJlcyB0aGlzIGlzIHRydWUuXG4gICAqL1xuICBfZ2V0QXJpYVNvcnRBdHRyaWJ1dGUoKSB7XG4gICAgaWYgKCF0aGlzLl9pc1NvcnRlZCgpKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICByZXR1cm4gdGhpcy5fc29ydC5kaXJlY3Rpb24gPT0gJ2FzYycgPyAnYXNjZW5kaW5nJyA6ICdkZXNjZW5kaW5nJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBhcnJvdyBpbnNpZGUgdGhlIHNvcnQgaGVhZGVyIHNob3VsZCBiZSByZW5kZXJlZC4gKi9cbiAgX3JlbmRlckFycm93KCkge1xuICAgIHJldHVybiAhdGhpcy5faXNEaXNhYmxlZCgpIHx8IHRoaXMuX2lzU29ydGVkKCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZUNsZWFyOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19