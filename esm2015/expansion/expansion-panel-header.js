/**
 * @fileoverview added by tsickle
 * Generated from: src/material/expansion/expansion-panel-header.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { ENTER, SPACE, hasModifierKey } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, Host, Input, ViewEncapsulation, Optional, Inject, } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { merge, Subscription, EMPTY } from 'rxjs';
import { filter } from 'rxjs/operators';
import { matExpansionAnimations } from './expansion-animations';
import { MatExpansionPanel, MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, } from './expansion-panel';
/**
 * `<mat-expansion-panel-header>`
 *
 * This component corresponds to the header element of an `<mat-expansion-panel>`.
 */
let MatExpansionPanelHeader = /** @class */ (() => {
    /**
     * `<mat-expansion-panel-header>`
     *
     * This component corresponds to the header element of an `<mat-expansion-panel>`.
     */
    class MatExpansionPanelHeader {
        /**
         * @param {?} panel
         * @param {?} _element
         * @param {?} _focusMonitor
         * @param {?} _changeDetectorRef
         * @param {?=} defaultOptions
         * @param {?=} _animationMode
         */
        constructor(panel, _element, _focusMonitor, _changeDetectorRef, defaultOptions, _animationMode) {
            this.panel = panel;
            this._element = _element;
            this._focusMonitor = _focusMonitor;
            this._changeDetectorRef = _changeDetectorRef;
            this._animationMode = _animationMode;
            this._parentChangeSubscription = Subscription.EMPTY;
            /** @type {?} */
            const accordionHideToggleChange = panel.accordion ?
                panel.accordion._stateChanges.pipe(filter((/**
                 * @param {?} changes
                 * @return {?}
                 */
                changes => !!(changes['hideToggle'] || changes['togglePosition'])))) :
                EMPTY;
            // Since the toggle state depends on an @Input on the panel, we
            // need to subscribe and trigger change detection manually.
            this._parentChangeSubscription =
                merge(panel.opened, panel.closed, accordionHideToggleChange, panel._inputChanges.pipe(filter((/**
                 * @param {?} changes
                 * @return {?}
                 */
                changes => {
                    return !!(changes['hideToggle'] ||
                        changes['disabled'] ||
                        changes['togglePosition']);
                }))))
                    .subscribe((/**
                 * @return {?}
                 */
                () => this._changeDetectorRef.markForCheck()));
            // Avoids focus being lost if the panel contained the focused element and was closed.
            panel.closed
                .pipe(filter((/**
             * @return {?}
             */
            () => panel._containsFocus())))
                .subscribe((/**
             * @return {?}
             */
            () => _focusMonitor.focusVia(_element, 'program')));
            _focusMonitor.monitor(_element).subscribe((/**
             * @param {?} origin
             * @return {?}
             */
            origin => {
                if (origin && panel.accordion) {
                    panel.accordion._handleHeaderFocus(this);
                }
            }));
            if (defaultOptions) {
                this.expandedHeight = defaultOptions.expandedHeight;
                this.collapsedHeight = defaultOptions.collapsedHeight;
            }
        }
        /**
         * Whether the associated panel is disabled. Implemented as a part of `FocusableOption`.
         * \@docs-private
         * @return {?}
         */
        get disabled() {
            return this.panel.disabled;
        }
        /**
         * Toggles the expanded state of the panel.
         * @return {?}
         */
        _toggle() {
            if (!this.disabled) {
                this.panel.toggle();
            }
        }
        /**
         * Gets whether the panel is expanded.
         * @return {?}
         */
        _isExpanded() {
            return this.panel.expanded;
        }
        /**
         * Gets the expanded state string of the panel.
         * @return {?}
         */
        _getExpandedState() {
            return this.panel._getExpandedState();
        }
        /**
         * Gets the panel id.
         * @return {?}
         */
        _getPanelId() {
            return this.panel.id;
        }
        /**
         * Gets the toggle position for the header.
         * @return {?}
         */
        _getTogglePosition() {
            return this.panel.togglePosition;
        }
        /**
         * Gets whether the expand indicator should be shown.
         * @return {?}
         */
        _showToggle() {
            return !this.panel.hideToggle && !this.panel.disabled;
        }
        /**
         * Gets the current height of the header. Null if no custom height has been
         * specified, and if the default height from the stylesheet should be used.
         * @return {?}
         */
        _getHeaderHeight() {
            /** @type {?} */
            const isExpanded = this._isExpanded();
            if (isExpanded && this.expandedHeight) {
                return this.expandedHeight;
            }
            else if (!isExpanded && this.collapsedHeight) {
                return this.collapsedHeight;
            }
            return null;
        }
        /**
         * Handle keydown event calling to toggle() if appropriate.
         * @param {?} event
         * @return {?}
         */
        _keydown(event) {
            switch (event.keyCode) {
                // Toggle for space and enter keys.
                case SPACE:
                case ENTER:
                    if (!hasModifierKey(event)) {
                        event.preventDefault();
                        this._toggle();
                    }
                    break;
                default:
                    if (this.panel.accordion) {
                        this.panel.accordion._handleHeaderKeydown(event);
                    }
                    return;
            }
        }
        /**
         * Focuses the panel header. Implemented as a part of `FocusableOption`.
         * \@docs-private
         * @param {?=} origin Origin of the action that triggered the focus.
         * @param {?=} options
         * @return {?}
         */
        focus(origin = 'program', options) {
            this._focusMonitor.focusVia(this._element, origin, options);
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            this._parentChangeSubscription.unsubscribe();
            this._focusMonitor.stopMonitoring(this._element);
        }
    }
    MatExpansionPanelHeader.decorators = [
        { type: Component, args: [{
                    selector: 'mat-expansion-panel-header',
                    template: "<span class=\"mat-content\">\n  <ng-content select=\"mat-panel-title\"></ng-content>\n  <ng-content select=\"mat-panel-description\"></ng-content>\n  <ng-content></ng-content>\n</span>\n<span [@indicatorRotate]=\"_getExpandedState()\" *ngIf=\"_showToggle()\"\n      class=\"mat-expansion-indicator\"></span>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    animations: [
                        matExpansionAnimations.indicatorRotate,
                    ],
                    host: {
                        'class': 'mat-expansion-panel-header mat-focus-indicator',
                        'role': 'button',
                        '[attr.id]': 'panel._headerId',
                        '[attr.tabindex]': 'disabled ? -1 : 0',
                        '[attr.aria-controls]': '_getPanelId()',
                        '[attr.aria-expanded]': '_isExpanded()',
                        '[attr.aria-disabled]': 'panel.disabled',
                        '[class.mat-expanded]': '_isExpanded()',
                        '[class.mat-expansion-toggle-indicator-after]': `_getTogglePosition() === 'after'`,
                        '[class.mat-expansion-toggle-indicator-before]': `_getTogglePosition() === 'before'`,
                        '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                        '[style.height]': '_getHeaderHeight()',
                        '(click)': '_toggle()',
                        '(keydown)': '_keydown($event)',
                    },
                    styles: [".mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit;position:relative;transition:height 225ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-expansion-panel-header._mat-animation-noopable{transition:none}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:none}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before{flex-direction:row-reverse}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 16px 0 0}[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 0 0 16px}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-expansion-panel-header-title,.mat-expansion-panel-header-description{display:flex;flex-grow:1;margin-right:16px}[dir=rtl] .mat-expansion-panel-header-title,[dir=rtl] .mat-expansion-panel-header-description{margin-right:0;margin-left:16px}.mat-expansion-panel-header-description{flex-grow:2}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:\"\";display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle}\n"]
                }] }
    ];
    /** @nocollapse */
    MatExpansionPanelHeader.ctorParameters = () => [
        { type: MatExpansionPanel, decorators: [{ type: Host }] },
        { type: ElementRef },
        { type: FocusMonitor },
        { type: ChangeDetectorRef },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_EXPANSION_PANEL_DEFAULT_OPTIONS,] }, { type: Optional }] },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ];
    MatExpansionPanelHeader.propDecorators = {
        expandedHeight: [{ type: Input }],
        collapsedHeight: [{ type: Input }]
    };
    return MatExpansionPanelHeader;
})();
export { MatExpansionPanelHeader };
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatExpansionPanelHeader.prototype._parentChangeSubscription;
    /**
     * Height of the header while the panel is expanded.
     * @type {?}
     */
    MatExpansionPanelHeader.prototype.expandedHeight;
    /**
     * Height of the header while the panel is collapsed.
     * @type {?}
     */
    MatExpansionPanelHeader.prototype.collapsedHeight;
    /** @type {?} */
    MatExpansionPanelHeader.prototype.panel;
    /**
     * @type {?}
     * @private
     */
    MatExpansionPanelHeader.prototype._element;
    /**
     * @type {?}
     * @private
     */
    MatExpansionPanelHeader.prototype._focusMonitor;
    /**
     * @type {?}
     * @private
     */
    MatExpansionPanelHeader.prototype._changeDetectorRef;
    /** @type {?} */
    MatExpansionPanelHeader.prototype._animationMode;
}
/**
 * `<mat-panel-description>`
 *
 * This directive is to be used inside of the MatExpansionPanelHeader component.
 */
let MatExpansionPanelDescription = /** @class */ (() => {
    /**
     * `<mat-panel-description>`
     *
     * This directive is to be used inside of the MatExpansionPanelHeader component.
     */
    class MatExpansionPanelDescription {
    }
    MatExpansionPanelDescription.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-panel-description',
                    host: {
                        class: 'mat-expansion-panel-header-description'
                    }
                },] }
    ];
    return MatExpansionPanelDescription;
})();
export { MatExpansionPanelDescription };
/**
 * `<mat-panel-title>`
 *
 * This directive is to be used inside of the MatExpansionPanelHeader component.
 */
let MatExpansionPanelTitle = /** @class */ (() => {
    /**
     * `<mat-panel-title>`
     *
     * This directive is to be used inside of the MatExpansionPanelHeader component.
     */
    class MatExpansionPanelTitle {
    }
    MatExpansionPanelTitle.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-panel-title',
                    host: {
                        class: 'mat-expansion-panel-header-title'
                    }
                },] }
    ];
    return MatExpansionPanelTitle;
})();
export { MatExpansionPanelTitle };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLWhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9leHBhbnNpb24vZXhwYW5zaW9uLXBhbmVsLWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsWUFBWSxFQUErQixNQUFNLG1CQUFtQixDQUFDO0FBQzdFLE9BQU8sRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ25FLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLElBQUksRUFDSixLQUFLLEVBRUwsaUJBQWlCLEVBQ2pCLFFBQVEsRUFDUixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0QyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RCxPQUFPLEVBQ0wsaUJBQWlCLEVBRWpCLG1DQUFtQyxHQUNwQyxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7QUFTM0I7Ozs7OztJQUFBLE1BMEJhLHVCQUF1Qjs7Ozs7Ozs7O1FBR2xDLFlBQ21CLEtBQXdCLEVBQy9CLFFBQW9CLEVBQ3BCLGFBQTJCLEVBQzNCLGtCQUFxQyxFQUV6QyxjQUFnRCxFQUNGLGNBQXVCO1lBTjFELFVBQUssR0FBTCxLQUFLLENBQW1CO1lBQy9CLGFBQVEsR0FBUixRQUFRLENBQVk7WUFDcEIsa0JBQWEsR0FBYixhQUFhLENBQWM7WUFDM0IsdUJBQWtCLEdBQWxCLGtC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LElBQUksRUFBRTt3QkFDSixLQUFLLEVBQUUsd0NBQXdDO3FCQUNoRDtpQkFDRjs7SUFDMEMsbUNBQUM7S0FBQTtTQUEvQiw0QkFBNEI7Ozs7OztBQU96Qzs7Ozs7O0lBQUEsTUFNYSxzQkFBc0I7OztnQkFObEMsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLElBQUksRUFBRTt3QkFDSixLQUFLLEVBQUUsa0NBQWtDO3FCQUMxQztpQkFDRjs7SUFDb0MsNkJBQUM7S0FBQTtTQUF6QixzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c01vbml0b3IsIEZvY3VzYWJsZU9wdGlvbiwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RU5URVIsIFNQQUNFLCBoYXNNb2RpZmllcktleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3QsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPcHRpb25hbCxcbiAgSW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHttZXJnZSwgU3Vic2NyaXB0aW9uLCBFTVBUWX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlcn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHttYXRFeHBhbnNpb25BbmltYXRpb25zfSBmcm9tICcuL2V4cGFuc2lvbi1hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIE1hdEV4cGFuc2lvblBhbmVsLFxuICBNYXRFeHBhbnNpb25QYW5lbERlZmF1bHRPcHRpb25zLFxuICBNQVRfRVhQQU5TSU9OX1BBTkVMX0RFRkFVTFRfT1BUSU9OUyxcbn0gZnJvbSAnLi9leHBhbnNpb24tcGFuZWwnO1xuaW1wb3J0IHtNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbn0gZnJvbSAnLi9hY2NvcmRpb24tYmFzZSc7XG5cblxuLyoqXG4gKiBgPG1hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyPmBcbiAqXG4gKiBUaGlzIGNvbXBvbmVudCBjb3JyZXNwb25kcyB0byB0aGUgaGVhZGVyIGVsZW1lbnQgb2YgYW4gYDxtYXQtZXhwYW5zaW9uLXBhbmVsPmAuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyJyxcbiAgc3R5bGVVcmxzOiBbJy4vZXhwYW5zaW9uLXBhbmVsLWhlYWRlci5jc3MnXSxcbiAgdGVtcGxhdGVVcmw6ICcuL2V4cGFuc2lvbi1wYW5lbC1oZWFkZXIuaHRtbCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBhbmltYXRpb25zOiBbXG4gICAgbWF0RXhwYW5zaW9uQW5pbWF0aW9ucy5pbmRpY2F0b3JSb3RhdGUsXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXIgbWF0LWZvY3VzLWluZGljYXRvcicsXG4gICAgJ3JvbGUnOiAnYnV0dG9uJyxcbiAgICAnW2F0dHIuaWRdJzogJ3BhbmVsLl9oZWFkZXJJZCcsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdkaXNhYmxlZCA/IC0xIDogMCcsXG4gICAgJ1thdHRyLmFyaWEtY29udHJvbHNdJzogJ19nZXRQYW5lbElkKCknLFxuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdfaXNFeHBhbmRlZCgpJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAncGFuZWwuZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LWV4cGFuZGVkXSc6ICdfaXNFeHBhbmRlZCgpJyxcbiAgICAnW2NsYXNzLm1hdC1leHBhbnNpb24tdG9nZ2xlLWluZGljYXRvci1hZnRlcl0nOiBgX2dldFRvZ2dsZVBvc2l0aW9uKCkgPT09ICdhZnRlcidgLFxuICAgICdbY2xhc3MubWF0LWV4cGFuc2lvbi10b2dnbGUtaW5kaWNhdG9yLWJlZm9yZV0nOiBgX2dldFRvZ2dsZVBvc2l0aW9uKCkgPT09ICdiZWZvcmUnYCxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uTW9kZSA9PT0gXCJOb29wQW5pbWF0aW9uc1wiJyxcbiAgICAnW3N0eWxlLmhlaWdodF0nOiAnX2dldEhlYWRlckhlaWdodCgpJyxcbiAgICAnKGNsaWNrKSc6ICdfdG9nZ2xlKCknLFxuICAgICcoa2V5ZG93biknOiAnX2tleWRvd24oJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyIGltcGxlbWVudHMgT25EZXN0cm95LCBGb2N1c2FibGVPcHRpb24ge1xuICBwcml2YXRlIF9wYXJlbnRDaGFuZ2VTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBASG9zdCgpIHB1YmxpYyBwYW5lbDogTWF0RXhwYW5zaW9uUGFuZWwsXG4gICAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLFxuICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICBASW5qZWN0KE1BVF9FWFBBTlNJT05fUEFORUxfREVGQVVMVF9PUFRJT05TKSBAT3B0aW9uYWwoKVxuICAgICAgICAgIGRlZmF1bHRPcHRpb25zPzogTWF0RXhwYW5zaW9uUGFuZWxEZWZhdWx0T3B0aW9ucyxcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBhY2NvcmRpb25IaWRlVG9nZ2xlQ2hhbmdlID0gcGFuZWwuYWNjb3JkaW9uID9cbiAgICAgICAgcGFuZWwuYWNjb3JkaW9uLl9zdGF0ZUNoYW5nZXMucGlwZShcbiAgICAgICAgICAgIGZpbHRlcihjaGFuZ2VzID0+ICEhKGNoYW5nZXNbJ2hpZGVUb2dnbGUnXSB8fCBjaGFuZ2VzWyd0b2dnbGVQb3NpdGlvbiddKSkpIDpcbiAgICAgICAgRU1QVFk7XG5cbiAgICAvLyBTaW5jZSB0aGUgdG9nZ2xlIHN0YXRlIGRlcGVuZHMgb24gYW4gQElucHV0IG9uIHRoZSBwYW5lbCwgd2VcbiAgICAvLyBuZWVkIHRvIHN1YnNjcmliZSBhbmQgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uIG1hbnVhbGx5LlxuICAgIHRoaXMuX3BhcmVudENoYW5nZVN1YnNjcmlwdGlvbiA9XG4gICAgICAgIG1lcmdlKFxuICAgICAgICAgICAgcGFuZWwub3BlbmVkLCBwYW5lbC5jbG9zZWQsIGFjY29yZGlvbkhpZGVUb2dnbGVDaGFuZ2UsXG4gICAgICAgICAgICBwYW5lbC5faW5wdXRDaGFuZ2VzLnBpcGUoZmlsdGVyKFxuICAgICAgICAgICAgICAgIGNoYW5nZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICEhKFxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VzWydoaWRlVG9nZ2xlJ10gfHxcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlc1snZGlzYWJsZWQnXSB8fFxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VzWyd0b2dnbGVQb3NpdGlvbiddKTtcbiAgICAgICAgICAgICAgICAgIH0pKSlcbiAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpKTtcblxuICAgIC8vIEF2b2lkcyBmb2N1cyBiZWluZyBsb3N0IGlmIHRoZSBwYW5lbCBjb250YWluZWQgdGhlIGZvY3VzZWQgZWxlbWVudCBhbmQgd2FzIGNsb3NlZC5cbiAgICBwYW5lbC5jbG9zZWRcbiAgICAgIC5waXBlKGZpbHRlcigoKSA9PiBwYW5lbC5fY29udGFpbnNGb2N1cygpKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYShfZWxlbWVudCwgJ3Byb2dyYW0nKSk7XG5cbiAgICBfZm9jdXNNb25pdG9yLm1vbml0b3IoX2VsZW1lbnQpLnN1YnNjcmliZShvcmlnaW4gPT4ge1xuICAgICAgaWYgKG9yaWdpbiAmJiBwYW5lbC5hY2NvcmRpb24pIHtcbiAgICAgICAgcGFuZWwuYWNjb3JkaW9uLl9oYW5kbGVIZWFkZXJGb2N1cyh0aGlzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChkZWZhdWx0T3B0aW9ucykge1xuICAgICAgdGhpcy5leHBhbmRlZEhlaWdodCA9IGRlZmF1bHRPcHRpb25zLmV4cGFuZGVkSGVpZ2h0O1xuICAgICAgdGhpcy5jb2xsYXBzZWRIZWlnaHQgPSBkZWZhdWx0T3B0aW9ucy5jb2xsYXBzZWRIZWlnaHQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhlaWdodCBvZiB0aGUgaGVhZGVyIHdoaWxlIHRoZSBwYW5lbCBpcyBleHBhbmRlZC4gKi9cbiAgQElucHV0KCkgZXhwYW5kZWRIZWlnaHQ6IHN0cmluZztcblxuICAvKiogSGVpZ2h0IG9mIHRoZSBoZWFkZXIgd2hpbGUgdGhlIHBhbmVsIGlzIGNvbGxhcHNlZC4gKi9cbiAgQElucHV0KCkgY29sbGFwc2VkSGVpZ2h0OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGFzc29jaWF0ZWQgcGFuZWwgaXMgZGlzYWJsZWQuIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgRm9jdXNhYmxlT3B0aW9uYC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IGRpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVsLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIGV4cGFuZGVkIHN0YXRlIG9mIHRoZSBwYW5lbC4gKi9cbiAgX3RvZ2dsZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMucGFuZWwudG9nZ2xlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgcGFuZWwgaXMgZXhwYW5kZWQuICovXG4gIF9pc0V4cGFuZGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBhbmVsLmV4cGFuZGVkO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGV4cGFuZGVkIHN0YXRlIHN0cmluZyBvZiB0aGUgcGFuZWwuICovXG4gIF9nZXRFeHBhbmRlZFN0YXRlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwuX2dldEV4cGFuZGVkU3RhdGUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwYW5lbCBpZC4gKi9cbiAgX2dldFBhbmVsSWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC5pZDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0b2dnbGUgcG9zaXRpb24gZm9yIHRoZSBoZWFkZXIuICovXG4gIF9nZXRUb2dnbGVQb3NpdGlvbigpOiBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwudG9nZ2xlUG9zaXRpb247XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBleHBhbmQgaW5kaWNhdG9yIHNob3VsZCBiZSBzaG93bi4gKi9cbiAgX3Nob3dUb2dnbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnBhbmVsLmhpZGVUb2dnbGUgJiYgIXRoaXMucGFuZWwuZGlzYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgY3VycmVudCBoZWlnaHQgb2YgdGhlIGhlYWRlci4gTnVsbCBpZiBubyBjdXN0b20gaGVpZ2h0IGhhcyBiZWVuXG4gICAqIHNwZWNpZmllZCwgYW5kIGlmIHRoZSBkZWZhdWx0IGhlaWdodCBmcm9tIHRoZSBzdHlsZXNoZWV0IHNob3VsZCBiZSB1c2VkLlxuICAgKi9cbiAgX2dldEhlYWRlckhlaWdodCgpOiBzdHJpbmd8bnVsbCB7XG4gICAgY29uc3QgaXNFeHBhbmRlZCA9IHRoaXMuX2lzRXhwYW5kZWQoKTtcbiAgICBpZiAoaXNFeHBhbmRlZCAmJiB0aGlzLmV4cGFuZGVkSGVpZ2h0KSB7XG4gICAgICByZXR1cm4gdGhpcy5leHBhbmRlZEhlaWdodDtcbiAgICB9IGVsc2UgaWYgKCFpc0V4cGFuZGVkICYmIHRoaXMuY29sbGFwc2VkSGVpZ2h0KSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2xsYXBzZWRIZWlnaHQ7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBrZXlkb3duIGV2ZW50IGNhbGxpbmcgdG8gdG9nZ2xlKCkgaWYgYXBwcm9wcmlhdGUuICovXG4gIF9rZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAvLyBUb2dnbGUgZm9yIHNwYWNlIGFuZCBlbnRlciBrZXlzLlxuICAgICAgY2FzZSBTUEFDRTpcbiAgICAgIGNhc2UgRU5URVI6XG4gICAgICAgIGlmICghaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLl90b2dnbGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKHRoaXMucGFuZWwuYWNjb3JkaW9uKSB7XG4gICAgICAgICAgdGhpcy5wYW5lbC5hY2NvcmRpb24uX2hhbmRsZUhlYWRlcktleWRvd24oZXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBwYW5lbCBoZWFkZXIuIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgRm9jdXNhYmxlT3B0aW9uYC5cbiAgICogQHBhcmFtIG9yaWdpbiBPcmlnaW4gb2YgdGhlIGFjdGlvbiB0aGF0IHRyaWdnZXJlZCB0aGUgZm9jdXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGZvY3VzKG9yaWdpbjogRm9jdXNPcmlnaW4gPSAncHJvZ3JhbScsIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5fZWxlbWVudCwgb3JpZ2luLCBvcHRpb25zKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3BhcmVudENoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50KTtcbiAgfVxufVxuXG4vKipcbiAqIGA8bWF0LXBhbmVsLWRlc2NyaXB0aW9uPmBcbiAqXG4gKiBUaGlzIGRpcmVjdGl2ZSBpcyB0byBiZSB1c2VkIGluc2lkZSBvZiB0aGUgTWF0RXhwYW5zaW9uUGFuZWxIZWFkZXIgY29tcG9uZW50LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtcGFuZWwtZGVzY3JpcHRpb24nLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1kZXNjcmlwdGlvbidcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbERlc2NyaXB0aW9uIHt9XG5cbi8qKlxuICogYDxtYXQtcGFuZWwtdGl0bGU+YFxuICpcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIHRvIGJlIHVzZWQgaW5zaWRlIG9mIHRoZSBNYXRFeHBhbnNpb25QYW5lbEhlYWRlciBjb21wb25lbnQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1wYW5lbC10aXRsZScsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ21hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyLXRpdGxlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdEV4cGFuc2lvblBhbmVsVGl0bGUge31cbiJdfQ==