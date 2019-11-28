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
import { merge, Subscription, EMPTY } from 'rxjs';
import { filter } from 'rxjs/operators';
import { matExpansionAnimations } from './expansion-animations';
import { MatExpansionPanel, MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, } from './expansion-panel';
/**
 * `<mat-expansion-panel-header>`
 *
 * This component corresponds to the header element of an `<mat-expansion-panel>`.
 */
export class MatExpansionPanelHeader {
    /**
     * @param {?} panel
     * @param {?} _element
     * @param {?} _focusMonitor
     * @param {?} _changeDetectorRef
     * @param {?=} defaultOptions
     */
    constructor(panel, _element, _focusMonitor, _changeDetectorRef, defaultOptions) {
        this.panel = panel;
        this._element = _element;
        this._focusMonitor = _focusMonitor;
        this._changeDetectorRef = _changeDetectorRef;
        this._parentChangeSubscription = Subscription.EMPTY;
        /**
         * Whether Angular animations in the panel header should be disabled.
         */
        this._animationsDisabled = true;
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
     * @return {?}
     */
    _animationStarted() {
        // Currently the `expansionHeight` animation has a `void => collapsed` transition which is
        // there to work around a bug in Angular (see #13088), however this introduces a different
        // issue. The new transition will cause the header to animate in on init (see #16067), if the
        // consumer has set a header height that is different from the default one. We work around it
        // by disabling animations on the header and re-enabling them after the first animation has run.
        // Note that Angular dispatches animation events even if animations are disabled. Ideally this
        // wouldn't be necessary if we remove the `void => collapsed` transition, but we have to wait
        // for https://github.com/angular/angular/issues/18847 to be resolved.
        this._animationsDisabled = false;
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
        this.panel.toggle();
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
                    matExpansionAnimations.expansionHeaderHeight
                ],
                host: {
                    'class': 'mat-expansion-panel-header',
                    'role': 'button',
                    '[attr.id]': 'panel._headerId',
                    '[attr.tabindex]': 'disabled ? -1 : 0',
                    '[attr.aria-controls]': '_getPanelId()',
                    '[attr.aria-expanded]': '_isExpanded()',
                    '[attr.aria-disabled]': 'panel.disabled',
                    '[class.mat-expanded]': '_isExpanded()',
                    '[class.mat-expansion-toggle-indicator-after]': `_getTogglePosition() === 'after'`,
                    '[class.mat-expansion-toggle-indicator-before]': `_getTogglePosition() === 'before'`,
                    '(click)': '_toggle()',
                    '(keydown)': '_keydown($event)',
                    '[@.disabled]': '_animationsDisabled',
                    '(@expansionHeight.start)': '_animationStarted()',
                    '[@expansionHeight]': `{
        value: _getExpandedState(),
        params: {
          collapsedHeight: collapsedHeight,
          expandedHeight: expandedHeight
        }
    }`,
                },
                styles: [".mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:none}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before{flex-direction:row-reverse}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 16px 0 0}[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 0 0 16px}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-expansion-panel-header-title,.mat-expansion-panel-header-description{display:flex;flex-grow:1;margin-right:16px}[dir=rtl] .mat-expansion-panel-header-title,[dir=rtl] .mat-expansion-panel-header-description{margin-right:0;margin-left:16px}.mat-expansion-panel-header-description{flex-grow:2}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:\"\";display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle}\n"]
            }] }
];
/** @nocollapse */
MatExpansionPanelHeader.ctorParameters = () => [
    { type: MatExpansionPanel, decorators: [{ type: Host }] },
    { type: ElementRef },
    { type: FocusMonitor },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_EXPANSION_PANEL_DEFAULT_OPTIONS,] }, { type: Optional }] }
];
MatExpansionPanelHeader.propDecorators = {
    expandedHeight: [{ type: Input }],
    collapsedHeight: [{ type: Input }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatExpansionPanelHeader.prototype._parentChangeSubscription;
    /**
     * Whether Angular animations in the panel header should be disabled.
     * @type {?}
     */
    MatExpansionPanelHeader.prototype._animationsDisabled;
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
}
/**
 * `<mat-panel-description>`
 *
 * This directive is to be used inside of the MatExpansionPanelHeader component.
 */
export class MatExpansionPanelDescription {
}
MatExpansionPanelDescription.decorators = [
    { type: Directive, args: [{
                selector: 'mat-panel-description',
                host: {
                    class: 'mat-expansion-panel-header-description'
                }
            },] }
];
/**
 * `<mat-panel-title>`
 *
 * This directive is to be used inside of the MatExpansionPanelHeader component.
 */
export class MatExpansionPanelTitle {
}
MatExpansionPanelTitle.decorators = [
    { type: Directive, args: [{
                selector: 'mat-panel-title',
                host: {
                    class: 'mat-expansion-panel-header-title'
                }
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLWhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9leHBhbnNpb24vZXhwYW5zaW9uLXBhbmVsLWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsWUFBWSxFQUErQixNQUFNLG1CQUFtQixDQUFDO0FBQzdFLE9BQU8sRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ25FLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLElBQUksRUFDSixLQUFLLEVBRUwsaUJBQWlCLEVBQ2pCLFFBQVEsRUFDUixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0QyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RCxPQUFPLEVBQ0wsaUJBQWlCLEVBRWpCLG1DQUFtQyxHQUNwQyxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7QUEyQzNCLE1BQU0sT0FBTyx1QkFBdUI7Ozs7Ozs7O0lBTWxDLFlBQ21CLEtBQXdCLEVBQy9CLFFBQW9CLEVBQ3BCLGFBQTJCLEVBQzNCLGtCQUFxQyxFQUV6QyxjQUFnRDtRQUxyQyxVQUFLLEdBQUwsS0FBSyxDQUFtQjtRQUMvQixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLGtCQUFhLEdBQWIsYUFBYSxDQUFjO1FBQzNCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFUekMsOEJBQXlCLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQzs7OztRQUd2RCx3QkFB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IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNNb25pdG9yLCBGb2N1c2FibGVPcHRpb24sIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0VOVEVSLCBTUEFDRSwgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBIb3N0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgT3B0aW9uYWwsXG4gIEluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge21lcmdlLCBTdWJzY3JpcHRpb24sIEVNUFRZfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge21hdEV4cGFuc2lvbkFuaW1hdGlvbnN9IGZyb20gJy4vZXhwYW5zaW9uLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgTWF0RXhwYW5zaW9uUGFuZWwsXG4gIE1hdEV4cGFuc2lvblBhbmVsRGVmYXVsdE9wdGlvbnMsXG4gIE1BVF9FWFBBTlNJT05fUEFORUxfREVGQVVMVF9PUFRJT05TLFxufSBmcm9tICcuL2V4cGFuc2lvbi1wYW5lbCc7XG5pbXBvcnQge01hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9ufSBmcm9tICcuL2FjY29yZGlvbi1iYXNlJztcblxuXG4vKipcbiAqIGA8bWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXI+YFxuICpcbiAqIFRoaXMgY29tcG9uZW50IGNvcnJlc3BvbmRzIHRvIHRoZSBoZWFkZXIgZWxlbWVudCBvZiBhbiBgPG1hdC1leHBhbnNpb24tcGFuZWw+YC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXInLFxuICBzdHlsZVVybHM6IFsnLi9leHBhbnNpb24tcGFuZWwtaGVhZGVyLmNzcyddLFxuICB0ZW1wbGF0ZVVybDogJy4vZXhwYW5zaW9uLXBhbmVsLWhlYWRlci5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGFuaW1hdGlvbnM6IFtcbiAgICBtYXRFeHBhbnNpb25BbmltYXRpb25zLmluZGljYXRvclJvdGF0ZSxcbiAgICBtYXRFeHBhbnNpb25BbmltYXRpb25zLmV4cGFuc2lvbkhlYWRlckhlaWdodFxuICBdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyJyxcbiAgICAncm9sZSc6ICdidXR0b24nLFxuICAgICdbYXR0ci5pZF0nOiAncGFuZWwuX2hlYWRlcklkJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ2Rpc2FibGVkID8gLTEgOiAwJyxcbiAgICAnW2F0dHIuYXJpYS1jb250cm9sc10nOiAnX2dldFBhbmVsSWQoKScsXG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ19pc0V4cGFuZGVkKCknLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdwYW5lbC5kaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtZXhwYW5kZWRdJzogJ19pc0V4cGFuZGVkKCknLFxuICAgICdbY2xhc3MubWF0LWV4cGFuc2lvbi10b2dnbGUtaW5kaWNhdG9yLWFmdGVyXSc6IGBfZ2V0VG9nZ2xlUG9zaXRpb24oKSA9PT0gJ2FmdGVyJ2AsXG4gICAgJ1tjbGFzcy5tYXQtZXhwYW5zaW9uLXRvZ2dsZS1pbmRpY2F0b3ItYmVmb3JlXSc6IGBfZ2V0VG9nZ2xlUG9zaXRpb24oKSA9PT0gJ2JlZm9yZSdgLFxuICAgICcoY2xpY2spJzogJ190b2dnbGUoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfa2V5ZG93bigkZXZlbnQpJyxcbiAgICAnW0AuZGlzYWJsZWRdJzogJ19hbmltYXRpb25zRGlzYWJsZWQnLFxuICAgICcoQGV4cGFuc2lvbkhlaWdodC5zdGFydCknOiAnX2FuaW1hdGlvblN0YXJ0ZWQoKScsXG4gICAgJ1tAZXhwYW5zaW9uSGVpZ2h0XSc6IGB7XG4gICAgICAgIHZhbHVlOiBfZ2V0RXhwYW5kZWRTdGF0ZSgpLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBjb2xsYXBzZWRIZWlnaHQ6IGNvbGxhcHNlZEhlaWdodCxcbiAgICAgICAgICBleHBhbmRlZEhlaWdodDogZXhwYW5kZWRIZWlnaHRcbiAgICAgICAgfVxuICAgIH1gLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbEhlYWRlciBpbXBsZW1lbnRzIE9uRGVzdHJveSwgRm9jdXNhYmxlT3B0aW9uIHtcbiAgcHJpdmF0ZSBfcGFyZW50Q2hhbmdlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBXaGV0aGVyIEFuZ3VsYXIgYW5pbWF0aW9ucyBpbiB0aGUgcGFuZWwgaGVhZGVyIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgX2FuaW1hdGlvbnNEaXNhYmxlZCA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBASG9zdCgpIHB1YmxpYyBwYW5lbDogTWF0RXhwYW5zaW9uUGFuZWwsXG4gICAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLFxuICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICBASW5qZWN0KE1BVF9FWFBBTlNJT05fUEFORUxfREVGQVVMVF9PUFRJT05TKSBAT3B0aW9uYWwoKVxuICAgICAgICAgIGRlZmF1bHRPcHRpb25zPzogTWF0RXhwYW5zaW9uUGFuZWxEZWZhdWx0T3B0aW9ucykge1xuICAgIGNvbnN0IGFjY29yZGlvbkhpZGVUb2dnbGVDaGFuZ2UgPSBwYW5lbC5hY2NvcmRpb24gP1xuICAgICAgICBwYW5lbC5hY2NvcmRpb24uX3N0YXRlQ2hhbmdlcy5waXBlKFxuICAgICAgICAgICAgZmlsdGVyKGNoYW5nZXMgPT4gISEoY2hhbmdlc1snaGlkZVRvZ2dsZSddIHx8IGNoYW5nZXNbJ3RvZ2dsZVBvc2l0aW9uJ10pKSkgOlxuICAgICAgICBFTVBUWTtcblxuICAgIC8vIFNpbmNlIHRoZSB0b2dnbGUgc3RhdGUgZGVwZW5kcyBvbiBhbiBASW5wdXQgb24gdGhlIHBhbmVsLCB3ZVxuICAgIC8vIG5lZWQgdG8gc3Vic2NyaWJlIGFuZCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24gbWFudWFsbHkuXG4gICAgdGhpcy5fcGFyZW50Q2hhbmdlU3Vic2NyaXB0aW9uID1cbiAgICAgICAgbWVyZ2UoXG4gICAgICAgICAgICBwYW5lbC5vcGVuZWQsIHBhbmVsLmNsb3NlZCwgYWNjb3JkaW9uSGlkZVRvZ2dsZUNoYW5nZSxcbiAgICAgICAgICAgIHBhbmVsLl9pbnB1dENoYW5nZXMucGlwZShmaWx0ZXIoXG4gICAgICAgICAgICAgICAgY2hhbmdlcyA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gISEoXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZXNbJ2hpZGVUb2dnbGUnXSB8fFxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VzWydkaXNhYmxlZCddIHx8XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZXNbJ3RvZ2dsZVBvc2l0aW9uJ10pO1xuICAgICAgICAgICAgICAgICAgfSkpKVxuICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCkpO1xuXG4gICAgLy8gQXZvaWRzIGZvY3VzIGJlaW5nIGxvc3QgaWYgdGhlIHBhbmVsIGNvbnRhaW5lZCB0aGUgZm9jdXNlZCBlbGVtZW50IGFuZCB3YXMgY2xvc2VkLlxuICAgIHBhbmVsLmNsb3NlZFxuICAgICAgLnBpcGUoZmlsdGVyKCgpID0+IHBhbmVsLl9jb250YWluc0ZvY3VzKCkpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiBfZm9jdXNNb25pdG9yLmZvY3VzVmlhKF9lbGVtZW50LCAncHJvZ3JhbScpKTtcblxuICAgIF9mb2N1c01vbml0b3IubW9uaXRvcihfZWxlbWVudCkuc3Vic2NyaWJlKG9yaWdpbiA9PiB7XG4gICAgICBpZiAob3JpZ2luICYmIHBhbmVsLmFjY29yZGlvbikge1xuICAgICAgICBwYW5lbC5hY2NvcmRpb24uX2hhbmRsZUhlYWRlckZvY3VzKHRoaXMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGRlZmF1bHRPcHRpb25zKSB7XG4gICAgICB0aGlzLmV4cGFuZGVkSGVpZ2h0ID0gZGVmYXVsdE9wdGlvbnMuZXhwYW5kZWRIZWlnaHQ7XG4gICAgICB0aGlzLmNvbGxhcHNlZEhlaWdodCA9IGRlZmF1bHRPcHRpb25zLmNvbGxhcHNlZEhlaWdodDtcbiAgICB9XG4gIH1cblxuICBfYW5pbWF0aW9uU3RhcnRlZCgpIHtcbiAgICAvLyBDdXJyZW50bHkgdGhlIGBleHBhbnNpb25IZWlnaHRgIGFuaW1hdGlvbiBoYXMgYSBgdm9pZCA9PiBjb2xsYXBzZWRgIHRyYW5zaXRpb24gd2hpY2ggaXNcbiAgICAvLyB0aGVyZSB0byB3b3JrIGFyb3VuZCBhIGJ1ZyBpbiBBbmd1bGFyIChzZWUgIzEzMDg4KSwgaG93ZXZlciB0aGlzIGludHJvZHVjZXMgYSBkaWZmZXJlbnRcbiAgICAvLyBpc3N1ZS4gVGhlIG5ldyB0cmFuc2l0aW9uIHdpbGwgY2F1c2UgdGhlIGhlYWRlciB0byBhbmltYXRlIGluIG9uIGluaXQgKHNlZSAjMTYwNjcpLCBpZiB0aGVcbiAgICAvLyBjb25zdW1lciBoYXMgc2V0IGEgaGVhZGVyIGhlaWdodCB0aGF0IGlzIGRpZmZlcmVudCBmcm9tIHRoZSBkZWZhdWx0IG9uZS4gV2Ugd29yayBhcm91bmQgaXRcbiAgICAvLyBieSBkaXNhYmxpbmcgYW5pbWF0aW9ucyBvbiB0aGUgaGVhZGVyIGFuZCByZS1lbmFibGluZyB0aGVtIGFmdGVyIHRoZSBmaXJzdCBhbmltYXRpb24gaGFzIHJ1bi5cbiAgICAvLyBOb3RlIHRoYXQgQW5ndWxhciBkaXNwYXRjaGVzIGFuaW1hdGlvbiBldmVudHMgZXZlbiBpZiBhbmltYXRpb25zIGFyZSBkaXNhYmxlZC4gSWRlYWxseSB0aGlzXG4gICAgLy8gd291bGRuJ3QgYmUgbmVjZXNzYXJ5IGlmIHdlIHJlbW92ZSB0aGUgYHZvaWQgPT4gY29sbGFwc2VkYCB0cmFuc2l0aW9uLCBidXQgd2UgaGF2ZSB0byB3YWl0XG4gICAgLy8gZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE4ODQ3IHRvIGJlIHJlc29sdmVkLlxuICAgIHRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIEhlaWdodCBvZiB0aGUgaGVhZGVyIHdoaWxlIHRoZSBwYW5lbCBpcyBleHBhbmRlZC4gKi9cbiAgQElucHV0KCkgZXhwYW5kZWRIZWlnaHQ6IHN0cmluZztcblxuICAvKiogSGVpZ2h0IG9mIHRoZSBoZWFkZXIgd2hpbGUgdGhlIHBhbmVsIGlzIGNvbGxhcHNlZC4gKi9cbiAgQElucHV0KCkgY29sbGFwc2VkSGVpZ2h0OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGFzc29jaWF0ZWQgcGFuZWwgaXMgZGlzYWJsZWQuIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgRm9jdXNhYmxlT3B0aW9uYC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IGRpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVsLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIGV4cGFuZGVkIHN0YXRlIG9mIHRoZSBwYW5lbC4gKi9cbiAgX3RvZ2dsZSgpOiB2b2lkIHtcbiAgICB0aGlzLnBhbmVsLnRvZ2dsZSgpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgcGFuZWwgaXMgZXhwYW5kZWQuICovXG4gIF9pc0V4cGFuZGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBhbmVsLmV4cGFuZGVkO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGV4cGFuZGVkIHN0YXRlIHN0cmluZyBvZiB0aGUgcGFuZWwuICovXG4gIF9nZXRFeHBhbmRlZFN0YXRlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwuX2dldEV4cGFuZGVkU3RhdGUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwYW5lbCBpZC4gKi9cbiAgX2dldFBhbmVsSWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC5pZDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0b2dnbGUgcG9zaXRpb24gZm9yIHRoZSBoZWFkZXIuICovXG4gIF9nZXRUb2dnbGVQb3NpdGlvbigpOiBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwudG9nZ2xlUG9zaXRpb247XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBleHBhbmQgaW5kaWNhdG9yIHNob3VsZCBiZSBzaG93bi4gKi9cbiAgX3Nob3dUb2dnbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnBhbmVsLmhpZGVUb2dnbGUgJiYgIXRoaXMucGFuZWwuZGlzYWJsZWQ7XG4gIH1cblxuICAvKiogSGFuZGxlIGtleWRvd24gZXZlbnQgY2FsbGluZyB0byB0b2dnbGUoKSBpZiBhcHByb3ByaWF0ZS4gKi9cbiAgX2tleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIC8vIFRvZ2dsZSBmb3Igc3BhY2UgYW5kIGVudGVyIGtleXMuXG4gICAgICBjYXNlIFNQQUNFOlxuICAgICAgY2FzZSBFTlRFUjpcbiAgICAgICAgaWYgKCFoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuX3RvZ2dsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAodGhpcy5wYW5lbC5hY2NvcmRpb24pIHtcbiAgICAgICAgICB0aGlzLnBhbmVsLmFjY29yZGlvbi5faGFuZGxlSGVhZGVyS2V5ZG93bihldmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIHBhbmVsIGhlYWRlci4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBGb2N1c2FibGVPcHRpb25gLlxuICAgKiBAcGFyYW0gb3JpZ2luIE9yaWdpbiBvZiB0aGUgYWN0aW9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBmb2N1cy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZm9jdXMob3JpZ2luOiBGb2N1c09yaWdpbiA9ICdwcm9ncmFtJywgb3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9lbGVtZW50LCBvcmlnaW4sIG9wdGlvbnMpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fcGFyZW50Q2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnQpO1xuICB9XG59XG5cbi8qKlxuICogYDxtYXQtcGFuZWwtZGVzY3JpcHRpb24+YFxuICpcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIHRvIGJlIHVzZWQgaW5zaWRlIG9mIHRoZSBNYXRFeHBhbnNpb25QYW5lbEhlYWRlciBjb21wb25lbnQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1wYW5lbC1kZXNjcmlwdGlvbicsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ21hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyLWRlc2NyaXB0aW9uJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdEV4cGFuc2lvblBhbmVsRGVzY3JpcHRpb24ge31cblxuLyoqXG4gKiBgPG1hdC1wYW5lbC10aXRsZT5gXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgaXMgdG8gYmUgdXNlZCBpbnNpZGUgb2YgdGhlIE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyIGNvbXBvbmVudC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LXBhbmVsLXRpdGxlJyxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXItdGl0bGUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RXhwYW5zaW9uUGFuZWxUaXRsZSB7fVxuIl19