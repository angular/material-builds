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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLWhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9leHBhbnNpb24vZXhwYW5zaW9uLXBhbmVsLWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsWUFBWSxFQUErQixNQUFNLG1CQUFtQixDQUFDO0FBQzdFLE9BQU8sRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ25FLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLElBQUksRUFDSixLQUFLLEVBRUwsaUJBQWlCLEVBQ2pCLFFBQVEsRUFDUixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0QyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RCxPQUFPLEVBQ0wsaUJBQWlCLEVBRWpCLG1DQUFtQyxHQUNwQyxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7QUEyQzNCLE1BQU0sT0FBTyx1QkFBdUI7Ozs7Ozs7O0lBTWxDLFlBQ21CLEtBQXdCLEVBQy9CLFFBQW9CLEVBQ3BCLGFBQTJCLEVBQzNCLGtCQUFxQyxFQUV6QyxjQUFnRDtRQUxyQyxVQUFLLEdBQUwsS0FBSyxDQUFtQjtRQUMvQixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLGtCQUFhLEdBQWIsYUFBYSxDQUFjO1FBQzNCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFUekMsOEJBQXlCLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQzs7OztRQUd2RCx3QkFB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Q29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c01vbml0b3IsIEZvY3VzYWJsZU9wdGlvbiwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RU5URVIsIFNQQUNFLCBoYXNNb2RpZmllcktleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3QsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPcHRpb25hbCxcbiAgSW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7bWVyZ2UsIFN1YnNjcmlwdGlvbiwgRU1QVFl9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXJ9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bWF0RXhwYW5zaW9uQW5pbWF0aW9uc30gZnJvbSAnLi9leHBhbnNpb24tYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBNYXRFeHBhbnNpb25QYW5lbCxcbiAgTWF0RXhwYW5zaW9uUGFuZWxEZWZhdWx0T3B0aW9ucyxcbiAgTUFUX0VYUEFOU0lPTl9QQU5FTF9ERUZBVUxUX09QVElPTlMsXG59IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsJztcbmltcG9ydCB7TWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb259IGZyb20gJy4vYWNjb3JkaW9uLWJhc2UnO1xuXG5cbi8qKlxuICogYDxtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcj5gXG4gKlxuICogVGhpcyBjb21wb25lbnQgY29ycmVzcG9uZHMgdG8gdGhlIGhlYWRlciBlbGVtZW50IG9mIGFuIGA8bWF0LWV4cGFuc2lvbi1wYW5lbD5gLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcicsXG4gIHN0eWxlVXJsczogWycuL2V4cGFuc2lvbi1wYW5lbC1oZWFkZXIuY3NzJ10sXG4gIHRlbXBsYXRlVXJsOiAnLi9leHBhbnNpb24tcGFuZWwtaGVhZGVyLmh0bWwnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgYW5pbWF0aW9uczogW1xuICAgIG1hdEV4cGFuc2lvbkFuaW1hdGlvbnMuaW5kaWNhdG9yUm90YXRlLFxuICAgIG1hdEV4cGFuc2lvbkFuaW1hdGlvbnMuZXhwYW5zaW9uSGVhZGVySGVpZ2h0XG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXInLFxuICAgICdyb2xlJzogJ2J1dHRvbicsXG4gICAgJ1thdHRyLmlkXSc6ICdwYW5lbC5faGVhZGVySWQnLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnZGlzYWJsZWQgPyAtMSA6IDAnLFxuICAgICdbYXR0ci5hcmlhLWNvbnRyb2xzXSc6ICdfZ2V0UGFuZWxJZCgpJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnX2lzRXhwYW5kZWQoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ3BhbmVsLmRpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1leHBhbmRlZF0nOiAnX2lzRXhwYW5kZWQoKScsXG4gICAgJ1tjbGFzcy5tYXQtZXhwYW5zaW9uLXRvZ2dsZS1pbmRpY2F0b3ItYWZ0ZXJdJzogYF9nZXRUb2dnbGVQb3NpdGlvbigpID09PSAnYWZ0ZXInYCxcbiAgICAnW2NsYXNzLm1hdC1leHBhbnNpb24tdG9nZ2xlLWluZGljYXRvci1iZWZvcmVdJzogYF9nZXRUb2dnbGVQb3NpdGlvbigpID09PSAnYmVmb3JlJ2AsXG4gICAgJyhjbGljayknOiAnX3RvZ2dsZSgpJyxcbiAgICAnKGtleWRvd24pJzogJ19rZXlkb3duKCRldmVudCknLFxuICAgICdbQC5kaXNhYmxlZF0nOiAnX2FuaW1hdGlvbnNEaXNhYmxlZCcsXG4gICAgJyhAZXhwYW5zaW9uSGVpZ2h0LnN0YXJ0KSc6ICdfYW5pbWF0aW9uU3RhcnRlZCgpJyxcbiAgICAnW0BleHBhbnNpb25IZWlnaHRdJzogYHtcbiAgICAgICAgdmFsdWU6IF9nZXRFeHBhbmRlZFN0YXRlKCksXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIGNvbGxhcHNlZEhlaWdodDogY29sbGFwc2VkSGVpZ2h0LFxuICAgICAgICAgIGV4cGFuZGVkSGVpZ2h0OiBleHBhbmRlZEhlaWdodFxuICAgICAgICB9XG4gICAgfWAsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyIGltcGxlbWVudHMgT25EZXN0cm95LCBGb2N1c2FibGVPcHRpb24ge1xuICBwcml2YXRlIF9wYXJlbnRDaGFuZ2VTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIFdoZXRoZXIgQW5ndWxhciBhbmltYXRpb25zIGluIHRoZSBwYW5lbCBoZWFkZXIgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBfYW5pbWF0aW9uc0Rpc2FibGVkID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBIb3N0KCkgcHVibGljIHBhbmVsOiBNYXRFeHBhbnNpb25QYW5lbCxcbiAgICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgIEBJbmplY3QoTUFUX0VYUEFOU0lPTl9QQU5FTF9ERUZBVUxUX09QVElPTlMpIEBPcHRpb25hbCgpXG4gICAgICAgICAgZGVmYXVsdE9wdGlvbnM/OiBNYXRFeHBhbnNpb25QYW5lbERlZmF1bHRPcHRpb25zKSB7XG4gICAgY29uc3QgYWNjb3JkaW9uSGlkZVRvZ2dsZUNoYW5nZSA9IHBhbmVsLmFjY29yZGlvbiA/XG4gICAgICAgIHBhbmVsLmFjY29yZGlvbi5fc3RhdGVDaGFuZ2VzLnBpcGUoXG4gICAgICAgICAgICBmaWx0ZXIoY2hhbmdlcyA9PiAhIShjaGFuZ2VzWydoaWRlVG9nZ2xlJ10gfHwgY2hhbmdlc1sndG9nZ2xlUG9zaXRpb24nXSkpKSA6XG4gICAgICAgIEVNUFRZO1xuXG4gICAgLy8gU2luY2UgdGhlIHRvZ2dsZSBzdGF0ZSBkZXBlbmRzIG9uIGFuIEBJbnB1dCBvbiB0aGUgcGFuZWwsIHdlXG4gICAgLy8gbmVlZCB0byBzdWJzY3JpYmUgYW5kIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBtYW51YWxseS5cbiAgICB0aGlzLl9wYXJlbnRDaGFuZ2VTdWJzY3JpcHRpb24gPVxuICAgICAgICBtZXJnZShcbiAgICAgICAgICAgIHBhbmVsLm9wZW5lZCwgcGFuZWwuY2xvc2VkLCBhY2NvcmRpb25IaWRlVG9nZ2xlQ2hhbmdlLFxuICAgICAgICAgICAgcGFuZWwuX2lucHV0Q2hhbmdlcy5waXBlKGZpbHRlcihcbiAgICAgICAgICAgICAgICBjaGFuZ2VzID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAhIShcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlc1snaGlkZVRvZ2dsZSddIHx8XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZXNbJ2Rpc2FibGVkJ10gfHxcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlc1sndG9nZ2xlUG9zaXRpb24nXSk7XG4gICAgICAgICAgICAgICAgICB9KSkpXG4gICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG5cbiAgICAvLyBBdm9pZHMgZm9jdXMgYmVpbmcgbG9zdCBpZiB0aGUgcGFuZWwgY29udGFpbmVkIHRoZSBmb2N1c2VkIGVsZW1lbnQgYW5kIHdhcyBjbG9zZWQuXG4gICAgcGFuZWwuY2xvc2VkXG4gICAgICAucGlwZShmaWx0ZXIoKCkgPT4gcGFuZWwuX2NvbnRhaW5zRm9jdXMoKSkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IF9mb2N1c01vbml0b3IuZm9jdXNWaWEoX2VsZW1lbnQsICdwcm9ncmFtJykpO1xuXG4gICAgX2ZvY3VzTW9uaXRvci5tb25pdG9yKF9lbGVtZW50KS5zdWJzY3JpYmUob3JpZ2luID0+IHtcbiAgICAgIGlmIChvcmlnaW4gJiYgcGFuZWwuYWNjb3JkaW9uKSB7XG4gICAgICAgIHBhbmVsLmFjY29yZGlvbi5faGFuZGxlSGVhZGVyRm9jdXModGhpcyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgIHRoaXMuZXhwYW5kZWRIZWlnaHQgPSBkZWZhdWx0T3B0aW9ucy5leHBhbmRlZEhlaWdodDtcbiAgICAgIHRoaXMuY29sbGFwc2VkSGVpZ2h0ID0gZGVmYXVsdE9wdGlvbnMuY29sbGFwc2VkSGVpZ2h0O1xuICAgIH1cbiAgfVxuXG4gIF9hbmltYXRpb25TdGFydGVkKCkge1xuICAgIC8vIEN1cnJlbnRseSB0aGUgYGV4cGFuc2lvbkhlaWdodGAgYW5pbWF0aW9uIGhhcyBhIGB2b2lkID0+IGNvbGxhcHNlZGAgdHJhbnNpdGlvbiB3aGljaCBpc1xuICAgIC8vIHRoZXJlIHRvIHdvcmsgYXJvdW5kIGEgYnVnIGluIEFuZ3VsYXIgKHNlZSAjMTMwODgpLCBob3dldmVyIHRoaXMgaW50cm9kdWNlcyBhIGRpZmZlcmVudFxuICAgIC8vIGlzc3VlLiBUaGUgbmV3IHRyYW5zaXRpb24gd2lsbCBjYXVzZSB0aGUgaGVhZGVyIHRvIGFuaW1hdGUgaW4gb24gaW5pdCAoc2VlICMxNjA2NyksIGlmIHRoZVxuICAgIC8vIGNvbnN1bWVyIGhhcyBzZXQgYSBoZWFkZXIgaGVpZ2h0IHRoYXQgaXMgZGlmZmVyZW50IGZyb20gdGhlIGRlZmF1bHQgb25lLiBXZSB3b3JrIGFyb3VuZCBpdFxuICAgIC8vIGJ5IGRpc2FibGluZyBhbmltYXRpb25zIG9uIHRoZSBoZWFkZXIgYW5kIHJlLWVuYWJsaW5nIHRoZW0gYWZ0ZXIgdGhlIGZpcnN0IGFuaW1hdGlvbiBoYXMgcnVuLlxuICAgIC8vIE5vdGUgdGhhdCBBbmd1bGFyIGRpc3BhdGNoZXMgYW5pbWF0aW9uIGV2ZW50cyBldmVuIGlmIGFuaW1hdGlvbnMgYXJlIGRpc2FibGVkLiBJZGVhbGx5IHRoaXNcbiAgICAvLyB3b3VsZG4ndCBiZSBuZWNlc3NhcnkgaWYgd2UgcmVtb3ZlIHRoZSBgdm9pZCA9PiBjb2xsYXBzZWRgIHRyYW5zaXRpb24sIGJ1dCB3ZSBoYXZlIHRvIHdhaXRcbiAgICAvLyBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTg4NDcgdG8gYmUgcmVzb2x2ZWQuXG4gICAgdGhpcy5fYW5pbWF0aW9uc0Rpc2FibGVkID0gZmFsc2U7XG4gIH1cblxuICAvKiogSGVpZ2h0IG9mIHRoZSBoZWFkZXIgd2hpbGUgdGhlIHBhbmVsIGlzIGV4cGFuZGVkLiAqL1xuICBASW5wdXQoKSBleHBhbmRlZEhlaWdodDogc3RyaW5nO1xuXG4gIC8qKiBIZWlnaHQgb2YgdGhlIGhlYWRlciB3aGlsZSB0aGUgcGFuZWwgaXMgY29sbGFwc2VkLiAqL1xuICBASW5wdXQoKSBjb2xsYXBzZWRIZWlnaHQ6IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYXNzb2NpYXRlZCBwYW5lbCBpcyBkaXNhYmxlZC4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBGb2N1c2FibGVPcHRpb25gLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgZGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwuZGlzYWJsZWQ7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgZXhwYW5kZWQgc3RhdGUgb2YgdGhlIHBhbmVsLiAqL1xuICBfdG9nZ2xlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5wYW5lbC50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBwYW5lbCBpcyBleHBhbmRlZC4gKi9cbiAgX2lzRXhwYW5kZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwuZXhwYW5kZWQ7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZXhwYW5kZWQgc3RhdGUgc3RyaW5nIG9mIHRoZSBwYW5lbC4gKi9cbiAgX2dldEV4cGFuZGVkU3RhdGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC5fZ2V0RXhwYW5kZWRTdGF0ZSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBhbmVsIGlkLiAqL1xuICBfZ2V0UGFuZWxJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnBhbmVsLmlkO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRvZ2dsZSBwb3NpdGlvbiBmb3IgdGhlIGhlYWRlci4gKi9cbiAgX2dldFRvZ2dsZVBvc2l0aW9uKCk6IE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC50b2dnbGVQb3NpdGlvbjtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGV4cGFuZCBpbmRpY2F0b3Igc2hvdWxkIGJlIHNob3duLiAqL1xuICBfc2hvd1RvZ2dsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMucGFuZWwuaGlkZVRvZ2dsZSAmJiAhdGhpcy5wYW5lbC5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBIYW5kbGUga2V5ZG93biBldmVudCBjYWxsaW5nIHRvIHRvZ2dsZSgpIGlmIGFwcHJvcHJpYXRlLiAqL1xuICBfa2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgLy8gVG9nZ2xlIGZvciBzcGFjZSBhbmQgZW50ZXIga2V5cy5cbiAgICAgIGNhc2UgU1BBQ0U6XG4gICAgICBjYXNlIEVOVEVSOlxuICAgICAgICBpZiAoIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5fdG9nZ2xlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmICh0aGlzLnBhbmVsLmFjY29yZGlvbikge1xuICAgICAgICAgIHRoaXMucGFuZWwuYWNjb3JkaW9uLl9oYW5kbGVIZWFkZXJLZXlkb3duKGV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgcGFuZWwgaGVhZGVyLiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgYEZvY3VzYWJsZU9wdGlvbmAuXG4gICAqIEBwYXJhbSBvcmlnaW4gT3JpZ2luIG9mIHRoZSBhY3Rpb24gdGhhdCB0cmlnZ2VyZWQgdGhlIGZvY3VzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBmb2N1cyhvcmlnaW46IEZvY3VzT3JpZ2luID0gJ3Byb2dyYW0nLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2VsZW1lbnQsIG9yaWdpbiwgb3B0aW9ucyk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9wYXJlbnRDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudCk7XG4gIH1cbn1cblxuLyoqXG4gKiBgPG1hdC1wYW5lbC1kZXNjcmlwdGlvbj5gXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgaXMgdG8gYmUgdXNlZCBpbnNpZGUgb2YgdGhlIE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyIGNvbXBvbmVudC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LXBhbmVsLWRlc2NyaXB0aW9uJyxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXItZGVzY3JpcHRpb24nXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RXhwYW5zaW9uUGFuZWxEZXNjcmlwdGlvbiB7fVxuXG4vKipcbiAqIGA8bWF0LXBhbmVsLXRpdGxlPmBcbiAqXG4gKiBUaGlzIGRpcmVjdGl2ZSBpcyB0byBiZSB1c2VkIGluc2lkZSBvZiB0aGUgTWF0RXhwYW5zaW9uUGFuZWxIZWFkZXIgY29tcG9uZW50LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtcGFuZWwtdGl0bGUnLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci10aXRsZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbFRpdGxlIHt9XG4iXX0=