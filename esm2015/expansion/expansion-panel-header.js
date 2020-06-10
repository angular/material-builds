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
    class MatExpansionPanelHeader {
        constructor(panel, _element, _focusMonitor, _changeDetectorRef, defaultOptions, _animationMode) {
            this.panel = panel;
            this._element = _element;
            this._focusMonitor = _focusMonitor;
            this._changeDetectorRef = _changeDetectorRef;
            this._animationMode = _animationMode;
            this._parentChangeSubscription = Subscription.EMPTY;
            const accordionHideToggleChange = panel.accordion ?
                panel.accordion._stateChanges.pipe(filter(changes => !!(changes['hideToggle'] || changes['togglePosition']))) :
                EMPTY;
            // Since the toggle state depends on an @Input on the panel, we
            // need to subscribe and trigger change detection manually.
            this._parentChangeSubscription =
                merge(panel.opened, panel.closed, accordionHideToggleChange, panel._inputChanges.pipe(filter(changes => {
                    return !!(changes['hideToggle'] ||
                        changes['disabled'] ||
                        changes['togglePosition']);
                })))
                    .subscribe(() => this._changeDetectorRef.markForCheck());
            // Avoids focus being lost if the panel contained the focused element and was closed.
            panel.closed
                .pipe(filter(() => panel._containsFocus()))
                .subscribe(() => _focusMonitor.focusVia(_element, 'program'));
            if (defaultOptions) {
                this.expandedHeight = defaultOptions.expandedHeight;
                this.collapsedHeight = defaultOptions.collapsedHeight;
            }
        }
        /**
         * Whether the associated panel is disabled. Implemented as a part of `FocusableOption`.
         * @docs-private
         */
        get disabled() {
            return this.panel.disabled;
        }
        /** Toggles the expanded state of the panel. */
        _toggle() {
            if (!this.disabled) {
                this.panel.toggle();
            }
        }
        /** Gets whether the panel is expanded. */
        _isExpanded() {
            return this.panel.expanded;
        }
        /** Gets the expanded state string of the panel. */
        _getExpandedState() {
            return this.panel._getExpandedState();
        }
        /** Gets the panel id. */
        _getPanelId() {
            return this.panel.id;
        }
        /** Gets the toggle position for the header. */
        _getTogglePosition() {
            return this.panel.togglePosition;
        }
        /** Gets whether the expand indicator should be shown. */
        _showToggle() {
            return !this.panel.hideToggle && !this.panel.disabled;
        }
        /**
         * Gets the current height of the header. Null if no custom height has been
         * specified, and if the default height from the stylesheet should be used.
         */
        _getHeaderHeight() {
            const isExpanded = this._isExpanded();
            if (isExpanded && this.expandedHeight) {
                return this.expandedHeight;
            }
            else if (!isExpanded && this.collapsedHeight) {
                return this.collapsedHeight;
            }
            return null;
        }
        /** Handle keydown event calling to toggle() if appropriate. */
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
         * @param origin Origin of the action that triggered the focus.
         * @docs-private
         */
        focus(origin = 'program', options) {
            this._focusMonitor.focusVia(this._element, origin, options);
        }
        ngAfterViewInit() {
            this._focusMonitor.monitor(this._element).subscribe(origin => {
                if (origin && this.panel.accordion) {
                    this.panel.accordion._handleHeaderFocus(this);
                }
            });
        }
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
                    styles: [".mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit;transition:height 225ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-expansion-panel-header._mat-animation-noopable{transition:none}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:none}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before{flex-direction:row-reverse}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 16px 0 0}[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 0 0 16px}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-expansion-panel-header-title,.mat-expansion-panel-header-description{display:flex;flex-grow:1;margin-right:16px}[dir=rtl] .mat-expansion-panel-header-title,[dir=rtl] .mat-expansion-panel-header-description{margin-right:0;margin-left:16px}.mat-expansion-panel-header-description{flex-grow:2}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:\"\";display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle}\n"]
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
/**
 * `<mat-panel-description>`
 *
 * This directive is to be used inside of the MatExpansionPanelHeader component.
 */
let MatExpansionPanelDescription = /** @class */ (() => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLWhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9leHBhbnNpb24vZXhwYW5zaW9uLXBhbmVsLWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUErQixNQUFNLG1CQUFtQixDQUFDO0FBQzdFLE9BQU8sRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ25FLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLElBQUksRUFDSixLQUFLLEVBRUwsaUJBQWlCLEVBQ2pCLFFBQVEsRUFDUixNQUFNLEdBRVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0QyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RCxPQUFPLEVBQ0wsaUJBQWlCLEVBRWpCLG1DQUFtQyxHQUNwQyxNQUFNLG1CQUFtQixDQUFDO0FBSTNCOzs7O0dBSUc7QUFDSDtJQUFBLE1BMEJhLHVCQUF1QjtRQUdsQyxZQUNtQixLQUF3QixFQUMvQixRQUFvQixFQUNwQixhQUEyQixFQUMzQixrQkFBcUMsRUFFekMsY0FBZ0QsRUFDRixjQUF1QjtZQU4xRCxVQUFLLEdBQUwsS0FBSyxDQUFtQjtZQUMvQixhQUFRLEdBQVIsUUFBUSxDQUFZO1lBQ3BCLGtCQUFhLEdBQWIsYUFBYSxDQUFjO1lBQzNCLHVCQUFrQixHQUFsQixrQkFB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QUNqQyxJQUFJLEVBQUU7d0JBQ0osS0FBSyxFQUFFLHdDQUF3QztxQkFDaEQ7aUJBQ0Y7O0lBQzBDLG1DQUFDO0tBQUE7U0FBL0IsNEJBQTRCO0FBRXpDOzs7O0dBSUc7QUFDSDtJQUFBLE1BTWEsc0JBQXNCOzs7Z0JBTmxDLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixJQUFJLEVBQUU7d0JBQ0osS0FBSyxFQUFFLGtDQUFrQztxQkFDMUM7aUJBQ0Y7O0lBQ29DLDZCQUFDO0tBQUE7U0FBekIsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNNb25pdG9yLCBGb2N1c2FibGVPcHRpb24sIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0VOVEVSLCBTUEFDRSwgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBIb3N0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgT3B0aW9uYWwsXG4gIEluamVjdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7bWVyZ2UsIFN1YnNjcmlwdGlvbiwgRU1QVFl9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXJ9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bWF0RXhwYW5zaW9uQW5pbWF0aW9uc30gZnJvbSAnLi9leHBhbnNpb24tYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBNYXRFeHBhbnNpb25QYW5lbCxcbiAgTWF0RXhwYW5zaW9uUGFuZWxEZWZhdWx0T3B0aW9ucyxcbiAgTUFUX0VYUEFOU0lPTl9QQU5FTF9ERUZBVUxUX09QVElPTlMsXG59IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsJztcbmltcG9ydCB7TWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb259IGZyb20gJy4vYWNjb3JkaW9uLWJhc2UnO1xuXG5cbi8qKlxuICogYDxtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcj5gXG4gKlxuICogVGhpcyBjb21wb25lbnQgY29ycmVzcG9uZHMgdG8gdGhlIGhlYWRlciBlbGVtZW50IG9mIGFuIGA8bWF0LWV4cGFuc2lvbi1wYW5lbD5gLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcicsXG4gIHN0eWxlVXJsczogWycuL2V4cGFuc2lvbi1wYW5lbC1oZWFkZXIuY3NzJ10sXG4gIHRlbXBsYXRlVXJsOiAnLi9leHBhbnNpb24tcGFuZWwtaGVhZGVyLmh0bWwnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgYW5pbWF0aW9uczogW1xuICAgIG1hdEV4cGFuc2lvbkFuaW1hdGlvbnMuaW5kaWNhdG9yUm90YXRlLFxuICBdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyIG1hdC1mb2N1cy1pbmRpY2F0b3InLFxuICAgICdyb2xlJzogJ2J1dHRvbicsXG4gICAgJ1thdHRyLmlkXSc6ICdwYW5lbC5faGVhZGVySWQnLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnZGlzYWJsZWQgPyAtMSA6IDAnLFxuICAgICdbYXR0ci5hcmlhLWNvbnRyb2xzXSc6ICdfZ2V0UGFuZWxJZCgpJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnX2lzRXhwYW5kZWQoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ3BhbmVsLmRpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1leHBhbmRlZF0nOiAnX2lzRXhwYW5kZWQoKScsXG4gICAgJ1tjbGFzcy5tYXQtZXhwYW5zaW9uLXRvZ2dsZS1pbmRpY2F0b3ItYWZ0ZXJdJzogYF9nZXRUb2dnbGVQb3NpdGlvbigpID09PSAnYWZ0ZXInYCxcbiAgICAnW2NsYXNzLm1hdC1leHBhbnNpb24tdG9nZ2xlLWluZGljYXRvci1iZWZvcmVdJzogYF9nZXRUb2dnbGVQb3NpdGlvbigpID09PSAnYmVmb3JlJ2AsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gICAgJ1tzdHlsZS5oZWlnaHRdJzogJ19nZXRIZWFkZXJIZWlnaHQoKScsXG4gICAgJyhjbGljayknOiAnX3RvZ2dsZSgpJyxcbiAgICAnKGtleWRvd24pJzogJ19rZXlkb3duKCRldmVudCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbEhlYWRlciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgRm9jdXNhYmxlT3B0aW9uIHtcbiAgcHJpdmF0ZSBfcGFyZW50Q2hhbmdlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQEhvc3QoKSBwdWJsaWMgcGFuZWw6IE1hdEV4cGFuc2lvblBhbmVsLFxuICAgICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcbiAgICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgQEluamVjdChNQVRfRVhQQU5TSU9OX1BBTkVMX0RFRkFVTFRfT1BUSU9OUykgQE9wdGlvbmFsKClcbiAgICAgICAgICBkZWZhdWx0T3B0aW9ucz86IE1hdEV4cGFuc2lvblBhbmVsRGVmYXVsdE9wdGlvbnMsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgY29uc3QgYWNjb3JkaW9uSGlkZVRvZ2dsZUNoYW5nZSA9IHBhbmVsLmFjY29yZGlvbiA/XG4gICAgICAgIHBhbmVsLmFjY29yZGlvbi5fc3RhdGVDaGFuZ2VzLnBpcGUoXG4gICAgICAgICAgICBmaWx0ZXIoY2hhbmdlcyA9PiAhIShjaGFuZ2VzWydoaWRlVG9nZ2xlJ10gfHwgY2hhbmdlc1sndG9nZ2xlUG9zaXRpb24nXSkpKSA6XG4gICAgICAgIEVNUFRZO1xuXG4gICAgLy8gU2luY2UgdGhlIHRvZ2dsZSBzdGF0ZSBkZXBlbmRzIG9uIGFuIEBJbnB1dCBvbiB0aGUgcGFuZWwsIHdlXG4gICAgLy8gbmVlZCB0byBzdWJzY3JpYmUgYW5kIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBtYW51YWxseS5cbiAgICB0aGlzLl9wYXJlbnRDaGFuZ2VTdWJzY3JpcHRpb24gPVxuICAgICAgICBtZXJnZShcbiAgICAgICAgICAgIHBhbmVsLm9wZW5lZCwgcGFuZWwuY2xvc2VkLCBhY2NvcmRpb25IaWRlVG9nZ2xlQ2hhbmdlLFxuICAgICAgICAgICAgcGFuZWwuX2lucHV0Q2hhbmdlcy5waXBlKGZpbHRlcihcbiAgICAgICAgICAgICAgICBjaGFuZ2VzID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAhIShcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlc1snaGlkZVRvZ2dsZSddIHx8XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZXNbJ2Rpc2FibGVkJ10gfHxcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlc1sndG9nZ2xlUG9zaXRpb24nXSk7XG4gICAgICAgICAgICAgICAgICB9KSkpXG4gICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG5cbiAgICAvLyBBdm9pZHMgZm9jdXMgYmVpbmcgbG9zdCBpZiB0aGUgcGFuZWwgY29udGFpbmVkIHRoZSBmb2N1c2VkIGVsZW1lbnQgYW5kIHdhcyBjbG9zZWQuXG4gICAgcGFuZWwuY2xvc2VkXG4gICAgICAucGlwZShmaWx0ZXIoKCkgPT4gcGFuZWwuX2NvbnRhaW5zRm9jdXMoKSkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IF9mb2N1c01vbml0b3IuZm9jdXNWaWEoX2VsZW1lbnQsICdwcm9ncmFtJykpO1xuXG4gICAgaWYgKGRlZmF1bHRPcHRpb25zKSB7XG4gICAgICB0aGlzLmV4cGFuZGVkSGVpZ2h0ID0gZGVmYXVsdE9wdGlvbnMuZXhwYW5kZWRIZWlnaHQ7XG4gICAgICB0aGlzLmNvbGxhcHNlZEhlaWdodCA9IGRlZmF1bHRPcHRpb25zLmNvbGxhcHNlZEhlaWdodDtcbiAgICB9XG4gIH1cblxuICAvKiogSGVpZ2h0IG9mIHRoZSBoZWFkZXIgd2hpbGUgdGhlIHBhbmVsIGlzIGV4cGFuZGVkLiAqL1xuICBASW5wdXQoKSBleHBhbmRlZEhlaWdodDogc3RyaW5nO1xuXG4gIC8qKiBIZWlnaHQgb2YgdGhlIGhlYWRlciB3aGlsZSB0aGUgcGFuZWwgaXMgY29sbGFwc2VkLiAqL1xuICBASW5wdXQoKSBjb2xsYXBzZWRIZWlnaHQ6IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYXNzb2NpYXRlZCBwYW5lbCBpcyBkaXNhYmxlZC4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBGb2N1c2FibGVPcHRpb25gLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgZGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwuZGlzYWJsZWQ7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgZXhwYW5kZWQgc3RhdGUgb2YgdGhlIHBhbmVsLiAqL1xuICBfdG9nZ2xlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5wYW5lbC50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBwYW5lbCBpcyBleHBhbmRlZC4gKi9cbiAgX2lzRXhwYW5kZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwuZXhwYW5kZWQ7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZXhwYW5kZWQgc3RhdGUgc3RyaW5nIG9mIHRoZSBwYW5lbC4gKi9cbiAgX2dldEV4cGFuZGVkU3RhdGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC5fZ2V0RXhwYW5kZWRTdGF0ZSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBhbmVsIGlkLiAqL1xuICBfZ2V0UGFuZWxJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnBhbmVsLmlkO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRvZ2dsZSBwb3NpdGlvbiBmb3IgdGhlIGhlYWRlci4gKi9cbiAgX2dldFRvZ2dsZVBvc2l0aW9uKCk6IE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC50b2dnbGVQb3NpdGlvbjtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGV4cGFuZCBpbmRpY2F0b3Igc2hvdWxkIGJlIHNob3duLiAqL1xuICBfc2hvd1RvZ2dsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMucGFuZWwuaGlkZVRvZ2dsZSAmJiAhdGhpcy5wYW5lbC5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXJyZW50IGhlaWdodCBvZiB0aGUgaGVhZGVyLiBOdWxsIGlmIG5vIGN1c3RvbSBoZWlnaHQgaGFzIGJlZW5cbiAgICogc3BlY2lmaWVkLCBhbmQgaWYgdGhlIGRlZmF1bHQgaGVpZ2h0IGZyb20gdGhlIHN0eWxlc2hlZXQgc2hvdWxkIGJlIHVzZWQuXG4gICAqL1xuICBfZ2V0SGVhZGVySGVpZ2h0KCk6IHN0cmluZ3xudWxsIHtcbiAgICBjb25zdCBpc0V4cGFuZGVkID0gdGhpcy5faXNFeHBhbmRlZCgpO1xuICAgIGlmIChpc0V4cGFuZGVkICYmIHRoaXMuZXhwYW5kZWRIZWlnaHQpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4cGFuZGVkSGVpZ2h0O1xuICAgIH0gZWxzZSBpZiAoIWlzRXhwYW5kZWQgJiYgdGhpcy5jb2xsYXBzZWRIZWlnaHQpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbGxhcHNlZEhlaWdodDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogSGFuZGxlIGtleWRvd24gZXZlbnQgY2FsbGluZyB0byB0b2dnbGUoKSBpZiBhcHByb3ByaWF0ZS4gKi9cbiAgX2tleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIC8vIFRvZ2dsZSBmb3Igc3BhY2UgYW5kIGVudGVyIGtleXMuXG4gICAgICBjYXNlIFNQQUNFOlxuICAgICAgY2FzZSBFTlRFUjpcbiAgICAgICAgaWYgKCFoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuX3RvZ2dsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAodGhpcy5wYW5lbC5hY2NvcmRpb24pIHtcbiAgICAgICAgICB0aGlzLnBhbmVsLmFjY29yZGlvbi5faGFuZGxlSGVhZGVyS2V5ZG93bihldmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIHBhbmVsIGhlYWRlci4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBGb2N1c2FibGVPcHRpb25gLlxuICAgKiBAcGFyYW0gb3JpZ2luIE9yaWdpbiBvZiB0aGUgYWN0aW9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBmb2N1cy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZm9jdXMob3JpZ2luOiBGb2N1c09yaWdpbiA9ICdwcm9ncmFtJywgb3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9lbGVtZW50LCBvcmlnaW4sIG9wdGlvbnMpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnQpLnN1YnNjcmliZShvcmlnaW4gPT4ge1xuICAgICAgaWYgKG9yaWdpbiAmJiB0aGlzLnBhbmVsLmFjY29yZGlvbikge1xuICAgICAgICB0aGlzLnBhbmVsLmFjY29yZGlvbi5faGFuZGxlSGVhZGVyRm9jdXModGhpcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9wYXJlbnRDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudCk7XG4gIH1cbn1cblxuLyoqXG4gKiBgPG1hdC1wYW5lbC1kZXNjcmlwdGlvbj5gXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgaXMgdG8gYmUgdXNlZCBpbnNpZGUgb2YgdGhlIE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyIGNvbXBvbmVudC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LXBhbmVsLWRlc2NyaXB0aW9uJyxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXItZGVzY3JpcHRpb24nXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RXhwYW5zaW9uUGFuZWxEZXNjcmlwdGlvbiB7fVxuXG4vKipcbiAqIGA8bWF0LXBhbmVsLXRpdGxlPmBcbiAqXG4gKiBUaGlzIGRpcmVjdGl2ZSBpcyB0byBiZSB1c2VkIGluc2lkZSBvZiB0aGUgTWF0RXhwYW5zaW9uUGFuZWxIZWFkZXIgY29tcG9uZW50LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtcGFuZWwtdGl0bGUnLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci10aXRsZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbFRpdGxlIHt9XG4iXX0=