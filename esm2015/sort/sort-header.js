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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc29ydC9zb3J0LWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsS0FBSyxFQUdMLFFBQVEsRUFDUixpQkFBaUIsRUFDakIsTUFBTSxFQUNOLFVBQVUsR0FFWCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQTZCLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2pGLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsS0FBSyxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxPQUFPLEVBQWMsTUFBTSxRQUFRLENBQUM7QUFDNUMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFcEQsT0FBTyxFQUFDLHdDQUF3QyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR3JELHNEQUFzRDtBQUN0RCxvQkFBb0I7QUFDcEIsTUFBTSxpQkFBaUI7Q0FBRztBQUMxQixNQUFNLHVCQUF1QixHQUN6QixhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQTJCckM7Ozs7Ozs7O0dBUUc7QUFDSDtJQUFBLE1BeUJhLGFBQWMsU0FBUSx1QkFBdUI7UUEyQ3hELFlBQW1CLEtBQXdCLEVBQy9CLGlCQUFvQyxFQUNqQixLQUFjLEVBRXRCLFVBQWtDLEVBQ3JDLGFBQTJCLEVBQzNCLFdBQW9DO1lBQ3RELDhGQUE4RjtZQUM5RixvRkFBb0Y7WUFDcEYsaUZBQWlGO1lBQ2pGLDRC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QUMvQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUM7b0JBQ3BCLFVBQVUsRUFBRTt3QkFDVixpQkFBaUIsQ0FBQyxTQUFTO3dCQUMzQixpQkFBaUIsQ0FBQyxXQUFXO3dCQUM3QixpQkFBaUIsQ0FBQyxZQUFZO3dCQUM5QixpQkFBaUIsQ0FBQyxZQUFZO3dCQUM5QixpQkFBaUIsQ0FBQyxhQUFhO3dCQUMvQixpQkFBaUIsQ0FBQyxhQUFhO3FCQUNoQzs7aUJBQ0Y7Ozs7Z0JBbkVPLGlCQUFpQjtnQkFsQnZCLGlCQUFpQjtnQkFjWCxPQUFPLHVCQXFIQSxRQUFRO2dEQUNSLE1BQU0sU0FBQyw0QkFBNEIsY0FBRyxRQUFRO2dCQXhIckQsWUFBWTtnQkFKbEIsVUFBVTs7O3FCQTJHVCxLQUFLLFNBQUMsaUJBQWlCO2dDQUd2QixLQUFLO3dCQUdMLEtBQUs7K0JBR0wsS0FBSzs7SUFnTFIsb0JBQUM7S0FBQTtTQXROWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEluamVjdCxcbiAgRWxlbWVudFJlZixcbiAgQWZ0ZXJWaWV3SW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkRpc2FibGUsIENhbkRpc2FibGVDdG9yLCBtaXhpbkRpc2FibGVkfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Rm9jdXNNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge21lcmdlLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXRTb3J0LCBNYXRTb3J0YWJsZX0gZnJvbSAnLi9zb3J0JztcbmltcG9ydCB7bWF0U29ydEFuaW1hdGlvbnN9IGZyb20gJy4vc29ydC1hbmltYXRpb25zJztcbmltcG9ydCB7U29ydERpcmVjdGlvbn0gZnJvbSAnLi9zb3J0LWRpcmVjdGlvbic7XG5pbXBvcnQge2dldFNvcnRIZWFkZXJOb3RDb250YWluZWRXaXRoaW5Tb3J0RXJyb3J9IGZyb20gJy4vc29ydC1lcnJvcnMnO1xuaW1wb3J0IHtNYXRTb3J0SGVhZGVySW50bH0gZnJvbSAnLi9zb3J0LWhlYWRlci1pbnRsJztcblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIHRoZSBzb3J0IGhlYWRlci5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRTb3J0SGVhZGVyQmFzZSB7fVxuY29uc3QgX01hdFNvcnRIZWFkZXJNaXhpbkJhc2U6IENhbkRpc2FibGVDdG9yICYgdHlwZW9mIE1hdFNvcnRIZWFkZXJCYXNlID1cbiAgICBtaXhpbkRpc2FibGVkKE1hdFNvcnRIZWFkZXJCYXNlKTtcblxuLyoqXG4gKiBWYWxpZCBwb3NpdGlvbnMgZm9yIHRoZSBhcnJvdyB0byBiZSBpbiBmb3IgaXRzIG9wYWNpdHkgYW5kIHRyYW5zbGF0aW9uLiBJZiB0aGUgc3RhdGUgaXMgYVxuICogc29ydCBkaXJlY3Rpb24sIHRoZSBwb3NpdGlvbiBvZiB0aGUgYXJyb3cgd2lsbCBiZSBhYm92ZS9iZWxvdyBhbmQgb3BhY2l0eSAwLiBJZiB0aGUgc3RhdGUgaXNcbiAqIGhpbnQsIHRoZSBhcnJvdyB3aWxsIGJlIGluIHRoZSBjZW50ZXIgd2l0aCBhIHNsaWdodCBvcGFjaXR5LiBBY3RpdmUgc3RhdGUgbWVhbnMgdGhlIGFycm93IHdpbGxcbiAqIGJlIGZ1bGx5IG9wYXF1ZSBpbiB0aGUgY2VudGVyLlxuICpcbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IHR5cGUgQXJyb3dWaWV3U3RhdGUgPSBTb3J0RGlyZWN0aW9uIHwgJ2hpbnQnIHwgJ2FjdGl2ZSc7XG5cbi8qKlxuICogU3RhdGVzIGRlc2NyaWJpbmcgdGhlIGFycm93J3MgYW5pbWF0ZWQgcG9zaXRpb24gKGFuaW1hdGluZyBmcm9tU3RhdGUgdG8gdG9TdGF0ZSkuXG4gKiBJZiB0aGUgZnJvbVN0YXRlIGlzIG5vdCBkZWZpbmVkLCB0aGVyZSB3aWxsIGJlIG5vIGFuaW1hdGVkIHRyYW5zaXRpb24gdG8gdGhlIHRvU3RhdGUuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXJyb3dWaWV3U3RhdGVUcmFuc2l0aW9uIHtcbiAgZnJvbVN0YXRlPzogQXJyb3dWaWV3U3RhdGU7XG4gIHRvU3RhdGU6IEFycm93Vmlld1N0YXRlO1xufVxuXG4vKiogQ29sdW1uIGRlZmluaXRpb24gYXNzb2NpYXRlZCB3aXRoIGEgYE1hdFNvcnRIZWFkZXJgLiAqL1xuaW50ZXJmYWNlIE1hdFNvcnRIZWFkZXJDb2x1bW5EZWYge1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQXBwbGllcyBzb3J0aW5nIGJlaGF2aW9yIChjbGljayB0byBjaGFuZ2Ugc29ydCkgYW5kIHN0eWxlcyB0byBhbiBlbGVtZW50LCBpbmNsdWRpbmcgYW5cbiAqIGFycm93IHRvIGRpc3BsYXkgdGhlIGN1cnJlbnQgc29ydCBkaXJlY3Rpb24uXG4gKlxuICogTXVzdCBiZSBwcm92aWRlZCB3aXRoIGFuIGlkIGFuZCBjb250YWluZWQgd2l0aGluIGEgcGFyZW50IE1hdFNvcnQgZGlyZWN0aXZlLlxuICpcbiAqIElmIHVzZWQgb24gaGVhZGVyIGNlbGxzIGluIGEgQ2RrVGFibGUsIGl0IHdpbGwgYXV0b21hdGljYWxseSBkZWZhdWx0IGl0cyBpZCBmcm9tIGl0cyBjb250YWluaW5nXG4gKiBjb2x1bW4gZGVmaW5pdGlvbi5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW21hdC1zb3J0LWhlYWRlcl0nLFxuICBleHBvcnRBczogJ21hdFNvcnRIZWFkZXInLFxuICB0ZW1wbGF0ZVVybDogJ3NvcnQtaGVhZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc29ydC1oZWFkZXIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXNvcnQtaGVhZGVyJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soKScsXG4gICAgJyhtb3VzZWVudGVyKSc6ICdfc2V0SW5kaWNhdG9ySGludFZpc2libGUodHJ1ZSknLFxuICAgICcobW91c2VsZWF2ZSknOiAnX3NldEluZGljYXRvckhpbnRWaXNpYmxlKGZhbHNlKScsXG4gICAgJ1thdHRyLmFyaWEtc29ydF0nOiAnX2dldEFyaWFTb3J0QXR0cmlidXRlKCknLFxuICAgICdbY2xhc3MubWF0LXNvcnQtaGVhZGVyLWRpc2FibGVkXSc6ICdfaXNEaXNhYmxlZCgpJyxcbiAgfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogWydkaXNhYmxlZCddLFxuICBhbmltYXRpb25zOiBbXG4gICAgbWF0U29ydEFuaW1hdGlvbnMuaW5kaWNhdG9yLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmxlZnRQb2ludGVyLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLnJpZ2h0UG9pbnRlcixcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5hcnJvd09wYWNpdHksXG4gICAgbWF0U29ydEFuaW1hdGlvbnMuYXJyb3dQb3NpdGlvbixcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5hbGxvd0NoaWxkcmVuLFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNvcnRIZWFkZXIgZXh0ZW5kcyBfTWF0U29ydEhlYWRlck1peGluQmFzZVxuICAgIGltcGxlbWVudHMgQ2FuRGlzYWJsZSwgTWF0U29ydGFibGUsIE9uRGVzdHJveSwgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcbiAgcHJpdmF0ZSBfcmVyZW5kZXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKipcbiAgICogRmxhZyBzZXQgdG8gdHJ1ZSB3aGVuIHRoZSBpbmRpY2F0b3Igc2hvdWxkIGJlIGRpc3BsYXllZCB3aGlsZSB0aGUgc29ydCBpcyBub3QgYWN0aXZlLiBVc2VkIHRvXG4gICAqIHByb3ZpZGUgYW4gYWZmb3JkYW5jZSB0aGF0IHRoZSBoZWFkZXIgaXMgc29ydGFibGUgYnkgc2hvd2luZyBvbiBmb2N1cyBhbmQgaG92ZXIuXG4gICAqL1xuICBfc2hvd0luZGljYXRvckhpbnQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIHZpZXcgdHJhbnNpdGlvbiBzdGF0ZSBvZiB0aGUgYXJyb3cgKHRyYW5zbGF0aW9uLyBvcGFjaXR5KSAtIGluZGljYXRlcyBpdHMgYGZyb21gIGFuZCBgdG9gXG4gICAqIHBvc2l0aW9uIHRocm91Z2ggdGhlIGFuaW1hdGlvbi4gSWYgYW5pbWF0aW9ucyBhcmUgY3VycmVudGx5IGRpc2FibGVkLCB0aGUgZnJvbVN0YXRlIGlzIHJlbW92ZWRcbiAgICogc28gdGhhdCB0aGVyZSBpcyBubyBhbmltYXRpb24gZGlzcGxheWVkLlxuICAgKi9cbiAgX3ZpZXdTdGF0ZTogQXJyb3dWaWV3U3RhdGVUcmFuc2l0aW9uO1xuXG4gIC8qKiBUaGUgZGlyZWN0aW9uIHRoZSBhcnJvdyBzaG91bGQgYmUgZmFjaW5nIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBzdGF0ZS4gKi9cbiAgX2Fycm93RGlyZWN0aW9uOiBTb3J0RGlyZWN0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHZpZXcgc3RhdGUgYW5pbWF0aW9uIHNob3VsZCBzaG93IHRoZSB0cmFuc2l0aW9uIGJldHdlZW4gdGhlIGBmcm9tYCBhbmQgYHRvYCBzdGF0ZXMuXG4gICAqL1xuICBfZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJRCBvZiB0aGlzIHNvcnQgaGVhZGVyLiBJZiB1c2VkIHdpdGhpbiB0aGUgY29udGV4dCBvZiBhIENka0NvbHVtbkRlZiwgdGhpcyB3aWxsIGRlZmF1bHQgdG9cbiAgICogdGhlIGNvbHVtbidzIG5hbWUuXG4gICAqL1xuICBASW5wdXQoJ21hdC1zb3J0LWhlYWRlcicpIGlkOiBzdHJpbmc7XG5cbiAgLyoqIFNldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBhcnJvdyB0aGF0IGRpc3BsYXlzIHdoZW4gc29ydGVkLiAqL1xuICBASW5wdXQoKSBhcnJvd1Bvc2l0aW9uOiAnYmVmb3JlJyB8ICdhZnRlcicgPSAnYWZ0ZXInO1xuXG4gIC8qKiBPdmVycmlkZXMgdGhlIHNvcnQgc3RhcnQgdmFsdWUgb2YgdGhlIGNvbnRhaW5pbmcgTWF0U29ydCBmb3IgdGhpcyBNYXRTb3J0YWJsZS4gKi9cbiAgQElucHV0KCkgc3RhcnQ6ICdhc2MnIHwgJ2Rlc2MnO1xuXG4gIC8qKiBPdmVycmlkZXMgdGhlIGRpc2FibGUgY2xlYXIgdmFsdWUgb2YgdGhlIGNvbnRhaW5pbmcgTWF0U29ydCBmb3IgdGhpcyBNYXRTb3J0YWJsZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVDbGVhcigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVDbGVhcjsgfVxuICBzZXQgZGlzYWJsZUNsZWFyKHYpIHsgdGhpcy5fZGlzYWJsZUNsZWFyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpOyB9XG4gIHByaXZhdGUgX2Rpc2FibGVDbGVhcjogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2ludGw6IE1hdFNvcnRIZWFkZXJJbnRsLFxuICAgICAgICAgICAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfc29ydDogTWF0U29ydCxcbiAgICAgICAgICAgICAgQEluamVjdCgnTUFUX1NPUlRfSEVBREVSX0NPTFVNTl9ERUYnKSBAT3B0aW9uYWwoKVxuICAgICAgICAgICAgICAgICAgcHVibGljIF9jb2x1bW5EZWY6IE1hdFNvcnRIZWFkZXJDb2x1bW5EZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgICAgICAgICAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSB1c2UgYSBzdHJpbmcgdG9rZW4gZm9yIHRoZSBgX2NvbHVtbkRlZmAsIGJlY2F1c2UgdGhlIHZhbHVlIGlzIHByb3ZpZGVkIGJvdGggYnlcbiAgICAvLyBgbWF0ZXJpYWwvdGFibGVgIGFuZCBgY2RrL3RhYmxlYCBhbmQgd2UgY2FuJ3QgaGF2ZSB0aGUgQ0RLIGRlcGVuZGluZyBvbiBNYXRlcmlhbCxcbiAgICAvLyBhbmQgd2Ugd2FudCB0byBhdm9pZCBoYXZpbmcgdGhlIHNvcnQgaGVhZGVyIGRlcGVuZGluZyBvbiB0aGUgQ0RLIHRhYmxlIGJlY2F1c2VcbiAgICAvLyBvZiB0aGlzIHNpbmdsZSByZWZlcmVuY2UuXG4gICAgc3VwZXIoKTtcblxuICAgIGlmICghX3NvcnQpIHtcbiAgICAgIHRocm93IGdldFNvcnRIZWFkZXJOb3RDb250YWluZWRXaXRoaW5Tb3J0RXJyb3IoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9yZXJlbmRlclN1YnNjcmlwdGlvbiA9IG1lcmdlKF9zb3J0LnNvcnRDaGFuZ2UsIF9zb3J0Ll9zdGF0ZUNoYW5nZXMsIF9pbnRsLmNoYW5nZXMpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLl9pc1NvcnRlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVBcnJvd0RpcmVjdGlvbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHRoaXMgaGVhZGVyIHdhcyByZWNlbnRseSBhY3RpdmUgYW5kIG5vdyBubyBsb25nZXIgc29ydGVkLCBhbmltYXRlIGF3YXkgdGhlIGFycm93LlxuICAgICAgICAgIGlmICghdGhpcy5faXNTb3J0ZWQoKSAmJiB0aGlzLl92aWV3U3RhdGUgJiYgdGhpcy5fdmlld1N0YXRlLnRvU3RhdGUgPT09ICdhY3RpdmUnKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlVmlld1N0YXRlQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUoe2Zyb21TdGF0ZTogJ2FjdGl2ZScsIHRvU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9ufSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLmlkICYmIHRoaXMuX2NvbHVtbkRlZikge1xuICAgICAgdGhpcy5pZCA9IHRoaXMuX2NvbHVtbkRlZi5uYW1lO1xuICAgIH1cblxuICAgIC8vIEluaXRpYWxpemUgdGhlIGRpcmVjdGlvbiBvZiB0aGUgYXJyb3cgYW5kIHNldCB0aGUgdmlldyBzdGF0ZSB0byBiZSBpbW1lZGlhdGVseSB0aGF0IHN0YXRlLlxuICAgIHRoaXMuX3VwZGF0ZUFycm93RGlyZWN0aW9uKCk7XG4gICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKFxuICAgICAgICB7dG9TdGF0ZTogdGhpcy5faXNTb3J0ZWQoKSA/ICdhY3RpdmUnIDogdGhpcy5fYXJyb3dEaXJlY3Rpb259KTtcblxuICAgIHRoaXMuX3NvcnQucmVnaXN0ZXIodGhpcyk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gV2UgdXNlIHRoZSBmb2N1cyBtb25pdG9yIGJlY2F1c2Ugd2UgYWxzbyB3YW50IHRvIHN0eWxlXG4gICAgLy8gdGhpbmdzIGRpZmZlcmVudGx5IGJhc2VkIG9uIHRoZSBmb2N1cyBvcmlnaW4uXG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgdHJ1ZSlcbiAgICAgICAgLnN1YnNjcmliZShvcmlnaW4gPT4gdGhpcy5fc2V0SW5kaWNhdG9ySGludFZpc2libGUoISFvcmlnaW4pKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgICB0aGlzLl9zb3J0LmRlcmVnaXN0ZXIodGhpcyk7XG4gICAgdGhpcy5fcmVyZW5kZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBcImhpbnRcIiBzdGF0ZSBzdWNoIHRoYXQgdGhlIGFycm93IHdpbGwgYmUgc2VtaS10cmFuc3BhcmVudGx5IGRpc3BsYXllZCBhcyBhIGhpbnQgdG8gdGhlXG4gICAqIHVzZXIgc2hvd2luZyB3aGF0IHRoZSBhY3RpdmUgc29ydCB3aWxsIGJlY29tZS4gSWYgc2V0IHRvIGZhbHNlLCB0aGUgYXJyb3cgd2lsbCBmYWRlIGF3YXkuXG4gICAqL1xuICBfc2V0SW5kaWNhdG9ySGludFZpc2libGUodmlzaWJsZTogYm9vbGVhbikge1xuICAgIC8vIE5vLW9wIGlmIHRoZSBzb3J0IGhlYWRlciBpcyBkaXNhYmxlZCAtIHNob3VsZCBub3QgbWFrZSB0aGUgaGludCB2aXNpYmxlLlxuICAgIGlmICh0aGlzLl9pc0Rpc2FibGVkKCkgJiYgdmlzaWJsZSkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX3Nob3dJbmRpY2F0b3JIaW50ID0gdmlzaWJsZTtcblxuICAgIGlmICghdGhpcy5faXNTb3J0ZWQoKSkge1xuICAgICAgdGhpcy5fdXBkYXRlQXJyb3dEaXJlY3Rpb24oKTtcbiAgICAgIGlmICh0aGlzLl9zaG93SW5kaWNhdG9ySGludCkge1xuICAgICAgICB0aGlzLl9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUoe2Zyb21TdGF0ZTogdGhpcy5fYXJyb3dEaXJlY3Rpb24sIHRvU3RhdGU6ICdoaW50J30pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6ICdoaW50JywgdG9TdGF0ZTogdGhpcy5fYXJyb3dEaXJlY3Rpb259KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYW5pbWF0aW9uIHRyYW5zaXRpb24gdmlldyBzdGF0ZSBmb3IgdGhlIGFycm93J3MgcG9zaXRpb24gYW5kIG9wYWNpdHkuIElmIHRoZVxuICAgKiBgZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbmAgZmxhZyBpcyBzZXQgdG8gdHJ1ZSwgdGhlIGBmcm9tU3RhdGVgIHdpbGwgYmUgaWdub3JlZCBzbyB0aGF0XG4gICAqIG5vIGFuaW1hdGlvbiBhcHBlYXJzLlxuICAgKi9cbiAgX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh2aWV3U3RhdGU6IEFycm93Vmlld1N0YXRlVHJhbnNpdGlvbikge1xuICAgIHRoaXMuX3ZpZXdTdGF0ZSA9IHZpZXdTdGF0ZTtcblxuICAgIC8vIElmIHRoZSBhbmltYXRpb24gZm9yIGFycm93IHBvc2l0aW9uIHN0YXRlIChvcGFjaXR5L3RyYW5zbGF0aW9uKSBzaG91bGQgYmUgZGlzYWJsZWQsXG4gICAgLy8gcmVtb3ZlIHRoZSBmcm9tU3RhdGUgc28gdGhhdCBpdCBqdW1wcyByaWdodCB0byB0aGUgdG9TdGF0ZS5cbiAgICBpZiAodGhpcy5fZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbikge1xuICAgICAgdGhpcy5fdmlld1N0YXRlID0ge3RvU3RhdGU6IHZpZXdTdGF0ZS50b1N0YXRlfTtcbiAgICB9XG4gIH1cblxuICAvKiogVHJpZ2dlcnMgdGhlIHNvcnQgb24gdGhpcyBzb3J0IGhlYWRlciBhbmQgcmVtb3ZlcyB0aGUgaW5kaWNhdG9yIGhpbnQuICovXG4gIF9oYW5kbGVDbGljaygpIHtcbiAgICBpZiAodGhpcy5faXNEaXNhYmxlZCgpKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fc29ydC5zb3J0KHRoaXMpO1xuXG4gICAgLy8gRG8gbm90IHNob3cgdGhlIGFuaW1hdGlvbiBpZiB0aGUgaGVhZGVyIHdhcyBhbHJlYWR5IHNob3duIGluIHRoZSByaWdodCBwb3NpdGlvbi5cbiAgICBpZiAodGhpcy5fdmlld1N0YXRlLnRvU3RhdGUgPT09ICdoaW50JyB8fCB0aGlzLl92aWV3U3RhdGUudG9TdGF0ZSA9PT0gJ2FjdGl2ZScpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBhcnJvdyBpcyBub3cgc29ydGVkLCBhbmltYXRlIHRoZSBhcnJvdyBpbnRvIHBsYWNlLiBPdGhlcndpc2UsIGFuaW1hdGUgaXQgYXdheSBpbnRvXG4gICAgLy8gdGhlIGRpcmVjdGlvbiBpdCBpcyBmYWNpbmcuXG4gICAgY29uc3Qgdmlld1N0YXRlOiBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb24gPSB0aGlzLl9pc1NvcnRlZCgpID9cbiAgICAgICAge2Zyb21TdGF0ZTogdGhpcy5fYXJyb3dEaXJlY3Rpb24sIHRvU3RhdGU6ICdhY3RpdmUnfSA6XG4gICAgICAgIHtmcm9tU3RhdGU6ICdhY3RpdmUnLCB0b1N0YXRlOiB0aGlzLl9hcnJvd0RpcmVjdGlvbn07XG4gICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHZpZXdTdGF0ZSk7XG5cbiAgICB0aGlzLl9zaG93SW5kaWNhdG9ySGludCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBNYXRTb3J0SGVhZGVyIGlzIGN1cnJlbnRseSBzb3J0ZWQgaW4gZWl0aGVyIGFzY2VuZGluZyBvciBkZXNjZW5kaW5nIG9yZGVyLiAqL1xuICBfaXNTb3J0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnQuYWN0aXZlID09IHRoaXMuaWQgJiZcbiAgICAgICAgKHRoaXMuX3NvcnQuZGlyZWN0aW9uID09PSAnYXNjJyB8fCB0aGlzLl9zb3J0LmRpcmVjdGlvbiA9PT0gJ2Rlc2MnKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBhbmltYXRpb24gc3RhdGUgZm9yIHRoZSBhcnJvdyBkaXJlY3Rpb24gKGluZGljYXRvciBhbmQgcG9pbnRlcnMpLiAqL1xuICBfZ2V0QXJyb3dEaXJlY3Rpb25TdGF0ZSgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5faXNTb3J0ZWQoKSA/ICdhY3RpdmUtJyA6ICcnfSR7dGhpcy5fYXJyb3dEaXJlY3Rpb259YDtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBhcnJvdyBwb3NpdGlvbiBzdGF0ZSAob3BhY2l0eSwgdHJhbnNsYXRpb24pLiAqL1xuICBfZ2V0QXJyb3dWaWV3U3RhdGUoKSB7XG4gICAgY29uc3QgZnJvbVN0YXRlID0gdGhpcy5fdmlld1N0YXRlLmZyb21TdGF0ZTtcbiAgICByZXR1cm4gKGZyb21TdGF0ZSA/IGAke2Zyb21TdGF0ZX0tdG8tYCA6ICcnKSArIHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGRpcmVjdGlvbiB0aGUgYXJyb3cgc2hvdWxkIGJlIHBvaW50aW5nLiBJZiBpdCBpcyBub3Qgc29ydGVkLCB0aGUgYXJyb3cgc2hvdWxkIGJlXG4gICAqIGZhY2luZyB0aGUgc3RhcnQgZGlyZWN0aW9uLiBPdGhlcndpc2UgaWYgaXQgaXMgc29ydGVkLCB0aGUgYXJyb3cgc2hvdWxkIHBvaW50IGluIHRoZSBjdXJyZW50bHlcbiAgICogYWN0aXZlIHNvcnRlZCBkaXJlY3Rpb24uIFRoZSByZWFzb24gdGhpcyBpcyB1cGRhdGVkIHRocm91Z2ggYSBmdW5jdGlvbiBpcyBiZWNhdXNlIHRoZSBkaXJlY3Rpb25cbiAgICogc2hvdWxkIG9ubHkgYmUgY2hhbmdlZCBhdCBzcGVjaWZpYyB0aW1lcyAtIHdoZW4gZGVhY3RpdmF0ZWQgYnV0IHRoZSBoaW50IGlzIGRpc3BsYXllZCBhbmQgd2hlblxuICAgKiB0aGUgc29ydCBpcyBhY3RpdmUgYW5kIHRoZSBkaXJlY3Rpb24gY2hhbmdlcy4gT3RoZXJ3aXNlIHRoZSBhcnJvdydzIGRpcmVjdGlvbiBzaG91bGQgbGluZ2VyXG4gICAqIGluIGNhc2VzIHN1Y2ggYXMgdGhlIHNvcnQgYmVjb21pbmcgZGVhY3RpdmF0ZWQgYnV0IHdlIHdhbnQgdG8gYW5pbWF0ZSB0aGUgYXJyb3cgYXdheSB3aGlsZVxuICAgKiBwcmVzZXJ2aW5nIGl0cyBkaXJlY3Rpb24sIGV2ZW4gdGhvdWdoIHRoZSBuZXh0IHNvcnQgZGlyZWN0aW9uIGlzIGFjdHVhbGx5IGRpZmZlcmVudCBhbmQgc2hvdWxkXG4gICAqIG9ubHkgYmUgY2hhbmdlZCBvbmNlIHRoZSBhcnJvdyBkaXNwbGF5cyBhZ2FpbiAoaGludCBvciBhY3RpdmF0aW9uKS5cbiAgICovXG4gIF91cGRhdGVBcnJvd0RpcmVjdGlvbigpIHtcbiAgICB0aGlzLl9hcnJvd0RpcmVjdGlvbiA9IHRoaXMuX2lzU29ydGVkKCkgP1xuICAgICAgICB0aGlzLl9zb3J0LmRpcmVjdGlvbiA6XG4gICAgICAgICh0aGlzLnN0YXJ0IHx8IHRoaXMuX3NvcnQuc3RhcnQpO1xuICB9XG5cbiAgX2lzRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnQuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBhcmlhLXNvcnQgYXR0cmlidXRlIHRoYXQgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhpcyBzb3J0IGhlYWRlci4gSWYgdGhpcyBoZWFkZXJcbiAgICogaXMgbm90IHNvcnRlZCwgcmV0dXJucyBudWxsIHNvIHRoYXQgdGhlIGF0dHJpYnV0ZSBpcyByZW1vdmVkIGZyb20gdGhlIGhvc3QgZWxlbWVudC4gQXJpYSBzcGVjXG4gICAqIHNheXMgdGhhdCB0aGUgYXJpYS1zb3J0IHByb3BlcnR5IHNob3VsZCBvbmx5IGJlIHByZXNlbnQgb24gb25lIGhlYWRlciBhdCBhIHRpbWUsIHNvIHJlbW92aW5nXG4gICAqIGVuc3VyZXMgdGhpcyBpcyB0cnVlLlxuICAgKi9cbiAgX2dldEFyaWFTb3J0QXR0cmlidXRlKCkge1xuICAgIGlmICghdGhpcy5faXNTb3J0ZWQoKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3NvcnQuZGlyZWN0aW9uID09ICdhc2MnID8gJ2FzY2VuZGluZycgOiAnZGVzY2VuZGluZyc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYXJyb3cgaW5zaWRlIHRoZSBzb3J0IGhlYWRlciBzaG91bGQgYmUgcmVuZGVyZWQuICovXG4gIF9yZW5kZXJBcnJvdygpIHtcbiAgICByZXR1cm4gIXRoaXMuX2lzRGlzYWJsZWQoKSB8fCB0aGlzLl9pc1NvcnRlZCgpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVDbGVhcjogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==