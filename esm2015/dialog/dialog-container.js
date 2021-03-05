/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor, FocusTrapFactory } from '@angular/cdk/a11y';
import { BasePortalOutlet, CdkPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, EventEmitter, Inject, Optional, ViewChild, ViewEncapsulation, } from '@angular/core';
import { matDialogAnimations } from './dialog-animations';
import { MatDialogConfig } from './dialog-config';
/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalOutlet without an origin.
 * @docs-private
 */
export function throwMatDialogContentAlreadyAttachedError() {
    throw Error('Attempting to attach dialog content after content is already attached');
}
/**
 * Base class for the `MatDialogContainer`. The base class does not implement
 * animations as these are left to implementers of the dialog container.
 */
export class _MatDialogContainerBase extends BasePortalOutlet {
    constructor(_elementRef, _focusTrapFactory, _changeDetectorRef, _document, 
    /** The dialog configuration. */
    _config, _focusMonitor) {
        super();
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._changeDetectorRef = _changeDetectorRef;
        this._config = _config;
        this._focusMonitor = _focusMonitor;
        /** Emits when an animation state changes. */
        this._animationStateChanged = new EventEmitter();
        /** Element that was focused before the dialog was opened. Save this to restore upon close. */
        this._elementFocusedBeforeDialogWasOpened = null;
        /**
         * Type of interaction that led to the dialog being closed. This is used to determine
         * whether the focus style will be applied when returning focus to its original location
         * after the dialog is closed.
         */
        this._closeInteractionType = null;
        /**
         * Attaches a DOM portal to the dialog container.
         * @param portal Portal to be attached.
         * @deprecated To be turned into a method.
         * @breaking-change 10.0.0
         */
        this.attachDomPortal = (portal) => {
            if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throwMatDialogContentAlreadyAttachedError();
            }
            return this._portalOutlet.attachDomPortal(portal);
        };
        this._ariaLabelledBy = _config.ariaLabelledBy || null;
        this._document = _document;
    }
    /** Initializes the dialog container with the attached content. */
    _initializeWithAttachedContent() {
        this._setupFocusTrap();
        // Save the previously focused element. This element will be re-focused
        // when the dialog closes.
        this._capturePreviouslyFocusedElement();
        // Move focus onto the dialog immediately in order to prevent the user
        // from accidentally opening multiple dialogs at the same time.
        this._focusDialogContainer();
    }
    /**
     * Attach a ComponentPortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachComponentPortal(portal) {
        if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwMatDialogContentAlreadyAttachedError();
        }
        return this._portalOutlet.attachComponentPortal(portal);
    }
    /**
     * Attach a TemplatePortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachTemplatePortal(portal) {
        if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwMatDialogContentAlreadyAttachedError();
        }
        return this._portalOutlet.attachTemplatePortal(portal);
    }
    /** Moves focus back into the dialog if it was moved out. */
    _recaptureFocus() {
        if (!this._containsFocus()) {
            const focusContainer = !this._config.autoFocus || !this._focusTrap.focusInitialElement();
            if (focusContainer) {
                this._elementRef.nativeElement.focus();
            }
        }
    }
    /** Moves the focus inside the focus trap. */
    _trapFocus() {
        // If we were to attempt to focus immediately, then the content of the dialog would not yet be
        // ready in instances where change detection has to run first. To deal with this, we simply
        // wait for the microtask queue to be empty.
        if (this._config.autoFocus) {
            this._focusTrap.focusInitialElementWhenReady();
        }
        else if (!this._containsFocus()) {
            // Otherwise ensure that focus is on the dialog container. It's possible that a different
            // component tried to move focus while the open animation was running. See:
            // https://github.com/angular/components/issues/16215. Note that we only want to do this
            // if the focus isn't inside the dialog already, because it's possible that the consumer
            // turned off `autoFocus` in order to move focus themselves.
            this._elementRef.nativeElement.focus();
        }
    }
    /** Restores focus to the element that was focused before the dialog opened. */
    _restoreFocus() {
        const previousElement = this._elementFocusedBeforeDialogWasOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (this._config.restoreFocus && previousElement &&
            typeof previousElement.focus === 'function') {
            const activeElement = this._getActiveElement();
            const element = this._elementRef.nativeElement;
            // Make sure that focus is still inside the dialog or is on the body (usually because a
            // non-focusable element like the backdrop was clicked) before moving it. It's possible that
            // the consumer moved it themselves before the animation was done, in which case we shouldn't
            // do anything.
            if (!activeElement || activeElement === this._document.body || activeElement === element ||
                element.contains(activeElement)) {
                if (this._focusMonitor) {
                    this._focusMonitor.focusVia(previousElement, this._closeInteractionType);
                    this._closeInteractionType = null;
                }
                else {
                    previousElement.focus();
                }
            }
        }
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    }
    /** Sets up the focus trap. */
    _setupFocusTrap() {
        this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
    }
    /** Captures the element that was focused before the dialog was opened. */
    _capturePreviouslyFocusedElement() {
        if (this._document) {
            this._elementFocusedBeforeDialogWasOpened = this._getActiveElement();
        }
    }
    /** Focuses the dialog container. */
    _focusDialogContainer() {
        // Note that there is no focus method when rendering on the server.
        if (this._elementRef.nativeElement.focus) {
            this._elementRef.nativeElement.focus();
        }
    }
    /** Returns whether focus is inside the dialog. */
    _containsFocus() {
        const element = this._elementRef.nativeElement;
        const activeElement = this._getActiveElement();
        return element === activeElement || element.contains(activeElement);
    }
    /** Gets the currently-focused element on the page. */
    _getActiveElement() {
        var _a;
        // If the `activeElement` is inside a shadow root, `document.activeElement` will
        // point to the shadow root so we have to descend into it ourselves.
        const activeElement = this._document.activeElement;
        return ((_a = activeElement === null || activeElement === void 0 ? void 0 : activeElement.shadowRoot) === null || _a === void 0 ? void 0 : _a.activeElement) || activeElement;
    }
}
_MatDialogContainerBase.decorators = [
    { type: Directive }
];
_MatDialogContainerBase.ctorParameters = () => [
    { type: ElementRef },
    { type: FocusTrapFactory },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: MatDialogConfig },
    { type: FocusMonitor }
];
_MatDialogContainerBase.propDecorators = {
    _portalOutlet: [{ type: ViewChild, args: [CdkPortalOutlet, { static: true },] }]
};
/**
 * Internal component that wraps user-provided dialog content.
 * Animation is based on https://material.io/guidelines/motion/choreography.html.
 * @docs-private
 */
export class MatDialogContainer extends _MatDialogContainerBase {
    constructor() {
        super(...arguments);
        /** State of the dialog animation. */
        this._state = 'enter';
    }
    /** Callback, invoked whenever an animation on the host completes. */
    _onAnimationDone({ toState, totalTime }) {
        if (toState === 'enter') {
            this._trapFocus();
            this._animationStateChanged.next({ state: 'opened', totalTime });
        }
        else if (toState === 'exit') {
            this._restoreFocus();
            this._animationStateChanged.next({ state: 'closed', totalTime });
        }
    }
    /** Callback, invoked when an animation on the host starts. */
    _onAnimationStart({ toState, totalTime }) {
        if (toState === 'enter') {
            this._animationStateChanged.next({ state: 'opening', totalTime });
        }
        else if (toState === 'exit' || toState === 'void') {
            this._animationStateChanged.next({ state: 'closing', totalTime });
        }
    }
    /** Starts the dialog exit animation. */
    _startExitAnimation() {
        this._state = 'exit';
        // Mark the container for check so it can react if the
        // view container is using OnPush change detection.
        this._changeDetectorRef.markForCheck();
    }
}
MatDialogContainer.decorators = [
    { type: Component, args: [{
                selector: 'mat-dialog-container',
                template: "<ng-template cdkPortalOutlet></ng-template>\n",
                encapsulation: ViewEncapsulation.None,
                // Using OnPush for dialogs caused some G3 sync issues. Disabled until we can track them down.
                // tslint:disable-next-line:validate-decorators
                changeDetection: ChangeDetectionStrategy.Default,
                animations: [matDialogAnimations.dialogContainer],
                host: {
                    'class': 'mat-dialog-container',
                    'tabindex': '-1',
                    'aria-modal': 'true',
                    '[id]': '_id',
                    '[attr.role]': '_config.role',
                    '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledBy',
                    '[attr.aria-label]': '_config.ariaLabel',
                    '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
                    '[@dialogContainer]': '_state',
                    '(@dialogContainer.start)': '_onAnimationStart($event)',
                    '(@dialogContainer.done)': '_onAnimationDone($event)',
                },
                styles: [".mat-dialog-container{display:block;padding:24px;border-radius:4px;box-sizing:border-box;overflow:auto;outline:0;width:100%;height:100%;min-height:inherit;max-height:inherit}.cdk-high-contrast-active .mat-dialog-container{outline:solid 1px}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:8px 0;display:flex;flex-wrap:wrap;min-height:52px;align-items:center;box-sizing:content-box;margin-bottom:-24px}.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions .mat-button-base+.mat-button-base,.mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEVBQUMsWUFBWSxFQUEwQixnQkFBZ0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3pGLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsZUFBZSxFQUloQixNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBRVQsU0FBUyxFQUNULFVBQVUsRUFFVixZQUFZLEVBQ1osTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3hELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQVFoRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLHlDQUF5QztJQUN2RCxNQUFNLEtBQUssQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDO0FBQ3ZGLENBQUM7QUFFRDs7O0dBR0c7QUFFSCxNQUFNLE9BQWdCLHVCQUF3QixTQUFRLGdCQUFnQjtJQTRCcEUsWUFDWSxXQUF1QixFQUN2QixpQkFBbUMsRUFDbkMsa0JBQXFDLEVBQ2pCLFNBQWM7SUFDNUMsZ0NBQWdDO0lBQ3pCLE9BQXdCLEVBQ3ZCLGFBQTRCO1FBRXBDLEtBQUssRUFBRSxDQUFDO1FBUkUsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDdkIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNuQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBR3hDLFlBQU8sR0FB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QUMvQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsT0FBTztnQkFDaEQsVUFBVSxFQUFFLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFDO2dCQUNqRCxJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLHNCQUFzQjtvQkFDL0IsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLFlBQVksRUFBRSxNQUFNO29CQUNwQixNQUFNLEVBQUUsS0FBSztvQkFDYixhQUFhLEVBQUUsY0FBYztvQkFDN0Isd0JBQXdCLEVBQUUsNENBQTRDO29CQUN0RSxtQkFBbUIsRUFBRSxtQkFBbUI7b0JBQ3hDLHlCQUF5QixFQUFFLGlDQUFpQztvQkFDNUQsb0JBQW9CLEVBQUUsUUFBUTtvQkFDOUIsMEJBQTBCLEVBQUUsMkJBQTJCO29CQUN2RCx5QkFBeUIsRUFBRSwwQkFBMEI7aUJBQ3REOzthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtGb2N1c01vbml0b3IsIEZvY3VzT3JpZ2luLCBGb2N1c1RyYXAsIEZvY3VzVHJhcEZhY3Rvcnl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7XG4gIEJhc2VQb3J0YWxPdXRsZXQsXG4gIENka1BvcnRhbE91dGxldCxcbiAgQ29tcG9uZW50UG9ydGFsLFxuICBEb21Qb3J0YWwsXG4gIFRlbXBsYXRlUG9ydGFsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHttYXREaWFsb2dBbmltYXRpb25zfSBmcm9tICcuL2RpYWxvZy1hbmltYXRpb25zJztcbmltcG9ydCB7TWF0RGlhbG9nQ29uZmlnfSBmcm9tICcuL2RpYWxvZy1jb25maWcnO1xuXG4vKiogRXZlbnQgdGhhdCBjYXB0dXJlcyB0aGUgc3RhdGUgb2YgZGlhbG9nIGNvbnRhaW5lciBhbmltYXRpb25zLiAqL1xuaW50ZXJmYWNlIERpYWxvZ0FuaW1hdGlvbkV2ZW50IHtcbiAgc3RhdGU6ICdvcGVuZWQnIHwgJ29wZW5pbmcnIHwgJ2Nsb3NpbmcnIHwgJ2Nsb3NlZCc7XG4gIHRvdGFsVGltZTogbnVtYmVyO1xufVxuXG4vKipcbiAqIFRocm93cyBhbiBleGNlcHRpb24gZm9yIHRoZSBjYXNlIHdoZW4gYSBDb21wb25lbnRQb3J0YWwgaXNcbiAqIGF0dGFjaGVkIHRvIGEgRG9tUG9ydGFsT3V0bGV0IHdpdGhvdXQgYW4gb3JpZ2luLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dNYXREaWFsb2dDb250ZW50QWxyZWFkeUF0dGFjaGVkRXJyb3IoKSB7XG4gIHRocm93IEVycm9yKCdBdHRlbXB0aW5nIHRvIGF0dGFjaCBkaWFsb2cgY29udGVudCBhZnRlciBjb250ZW50IGlzIGFscmVhZHkgYXR0YWNoZWQnKTtcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciB0aGUgYE1hdERpYWxvZ0NvbnRhaW5lcmAuIFRoZSBiYXNlIGNsYXNzIGRvZXMgbm90IGltcGxlbWVudFxuICogYW5pbWF0aW9ucyBhcyB0aGVzZSBhcmUgbGVmdCB0byBpbXBsZW1lbnRlcnMgb2YgdGhlIGRpYWxvZyBjb250YWluZXIuXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXREaWFsb2dDb250YWluZXJCYXNlIGV4dGVuZHMgQmFzZVBvcnRhbE91dGxldCB7XG4gIHByb3RlY3RlZCBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKiBUaGUgcG9ydGFsIG91dGxldCBpbnNpZGUgb2YgdGhpcyBjb250YWluZXIgaW50byB3aGljaCB0aGUgZGlhbG9nIGNvbnRlbnQgd2lsbCBiZSBsb2FkZWQuICovXG4gIEBWaWV3Q2hpbGQoQ2RrUG9ydGFsT3V0bGV0LCB7c3RhdGljOiB0cnVlfSkgX3BvcnRhbE91dGxldDogQ2RrUG9ydGFsT3V0bGV0O1xuXG4gIC8qKiBUaGUgY2xhc3MgdGhhdCB0cmFwcyBhbmQgbWFuYWdlcyBmb2N1cyB3aXRoaW4gdGhlIGRpYWxvZy4gKi9cbiAgcHJpdmF0ZSBfZm9jdXNUcmFwOiBGb2N1c1RyYXA7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW4gYW5pbWF0aW9uIHN0YXRlIGNoYW5nZXMuICovXG4gIF9hbmltYXRpb25TdGF0ZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPERpYWxvZ0FuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBFbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBkaWFsb2cgd2FzIG9wZW5lZC4gU2F2ZSB0aGlzIHRvIHJlc3RvcmUgdXBvbiBjbG9zZS4gKi9cbiAgcHJpdmF0ZSBfZWxlbWVudEZvY3VzZWRCZWZvcmVEaWFsb2dXYXNPcGVuZWQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgaW50ZXJhY3Rpb24gdGhhdCBsZWQgdG8gdGhlIGRpYWxvZyBiZWluZyBjbG9zZWQuIFRoaXMgaXMgdXNlZCB0byBkZXRlcm1pbmVcbiAgICogd2hldGhlciB0aGUgZm9jdXMgc3R5bGUgd2lsbCBiZSBhcHBsaWVkIHdoZW4gcmV0dXJuaW5nIGZvY3VzIHRvIGl0cyBvcmlnaW5hbCBsb2NhdGlvblxuICAgKiBhZnRlciB0aGUgZGlhbG9nIGlzIGNsb3NlZC5cbiAgICovXG4gIF9jbG9zZUludGVyYWN0aW9uVHlwZTogRm9jdXNPcmlnaW58bnVsbCA9IG51bGw7XG5cbiAgLyoqIElEIG9mIHRoZSBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYXMgdGhlIGRpYWxvZydzIGxhYmVsLiAqL1xuICBfYXJpYUxhYmVsbGVkQnk6IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIElEIGZvciB0aGUgY29udGFpbmVyIERPTSBlbGVtZW50LiAqL1xuICBfaWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIF9mb2N1c1RyYXBGYWN0b3J5OiBGb2N1c1RyYXBGYWN0b3J5LFxuICAgIHByb3RlY3RlZCBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudDogYW55LFxuICAgIC8qKiBUaGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24uICovXG4gICAgcHVibGljIF9jb25maWc6IE1hdERpYWxvZ0NvbmZpZyxcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I/OiBGb2N1c01vbml0b3IpIHtcblxuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fYXJpYUxhYmVsbGVkQnkgPSBfY29uZmlnLmFyaWFMYWJlbGxlZEJ5IHx8IG51bGw7XG4gICAgdGhpcy5fZG9jdW1lbnQgPSBfZG9jdW1lbnQ7XG4gIH1cblxuICAvKiogU3RhcnRzIHRoZSBkaWFsb2cgZXhpdCBhbmltYXRpb24uICovXG4gIGFic3RyYWN0IF9zdGFydEV4aXRBbmltYXRpb24oKTogdm9pZDtcblxuICAvKiogSW5pdGlhbGl6ZXMgdGhlIGRpYWxvZyBjb250YWluZXIgd2l0aCB0aGUgYXR0YWNoZWQgY29udGVudC4gKi9cbiAgX2luaXRpYWxpemVXaXRoQXR0YWNoZWRDb250ZW50KCkge1xuICAgIHRoaXMuX3NldHVwRm9jdXNUcmFwKCk7XG4gICAgLy8gU2F2ZSB0aGUgcHJldmlvdXNseSBmb2N1c2VkIGVsZW1lbnQuIFRoaXMgZWxlbWVudCB3aWxsIGJlIHJlLWZvY3VzZWRcbiAgICAvLyB3aGVuIHRoZSBkaWFsb2cgY2xvc2VzLlxuICAgIHRoaXMuX2NhcHR1cmVQcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQoKTtcbiAgICAvLyBNb3ZlIGZvY3VzIG9udG8gdGhlIGRpYWxvZyBpbW1lZGlhdGVseSBpbiBvcmRlciB0byBwcmV2ZW50IHRoZSB1c2VyXG4gICAgLy8gZnJvbSBhY2NpZGVudGFsbHkgb3BlbmluZyBtdWx0aXBsZSBkaWFsb2dzIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgdGhpcy5fZm9jdXNEaWFsb2dDb250YWluZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2ggYSBDb21wb25lbnRQb3J0YWwgYXMgY29udGVudCB0byB0aGlzIGRpYWxvZyBjb250YWluZXIuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIGF0dGFjaGVkIGFzIHRoZSBkaWFsb2cgY29udGVudC5cbiAgICovXG4gIGF0dGFjaENvbXBvbmVudFBvcnRhbDxUPihwb3J0YWw6IENvbXBvbmVudFBvcnRhbDxUPik6IENvbXBvbmVudFJlZjxUPiB7XG4gICAgaWYgKHRoaXMuX3BvcnRhbE91dGxldC5oYXNBdHRhY2hlZCgpICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvd01hdERpYWxvZ0NvbnRlbnRBbHJlYWR5QXR0YWNoZWRFcnJvcigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoQ29tcG9uZW50UG9ydGFsKHBvcnRhbCk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoIGEgVGVtcGxhdGVQb3J0YWwgYXMgY29udGVudCB0byB0aGlzIGRpYWxvZyBjb250YWluZXIuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIGF0dGFjaGVkIGFzIHRoZSBkaWFsb2cgY29udGVudC5cbiAgICovXG4gIGF0dGFjaFRlbXBsYXRlUG9ydGFsPEM+KHBvcnRhbDogVGVtcGxhdGVQb3J0YWw8Qz4pOiBFbWJlZGRlZFZpZXdSZWY8Qz4ge1xuICAgIGlmICh0aGlzLl9wb3J0YWxPdXRsZXQuaGFzQXR0YWNoZWQoKSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3dNYXREaWFsb2dDb250ZW50QWxyZWFkeUF0dGFjaGVkRXJyb3IoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcG9ydGFsT3V0bGV0LmF0dGFjaFRlbXBsYXRlUG9ydGFsKHBvcnRhbCk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgYSBET00gcG9ydGFsIHRvIHRoZSBkaWFsb2cgY29udGFpbmVyLlxuICAgKiBAcGFyYW0gcG9ydGFsIFBvcnRhbCB0byBiZSBhdHRhY2hlZC5cbiAgICogQGRlcHJlY2F0ZWQgVG8gYmUgdHVybmVkIGludG8gYSBtZXRob2QuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAqL1xuICBhdHRhY2hEb21Qb3J0YWwgPSAocG9ydGFsOiBEb21Qb3J0YWwpID0+IHtcbiAgICBpZiAodGhpcy5fcG9ydGFsT3V0bGV0Lmhhc0F0dGFjaGVkKCkgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93TWF0RGlhbG9nQ29udGVudEFscmVhZHlBdHRhY2hlZEVycm9yKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hEb21Qb3J0YWwocG9ydGFsKTtcbiAgfVxuXG4gIC8qKiBNb3ZlcyBmb2N1cyBiYWNrIGludG8gdGhlIGRpYWxvZyBpZiBpdCB3YXMgbW92ZWQgb3V0LiAqL1xuICBfcmVjYXB0dXJlRm9jdXMoKSB7XG4gICAgaWYgKCF0aGlzLl9jb250YWluc0ZvY3VzKCkpIHtcbiAgICAgIGNvbnN0IGZvY3VzQ29udGFpbmVyID0gIXRoaXMuX2NvbmZpZy5hdXRvRm9jdXMgfHwgIXRoaXMuX2ZvY3VzVHJhcC5mb2N1c0luaXRpYWxFbGVtZW50KCk7XG5cbiAgICAgIGlmIChmb2N1c0NvbnRhaW5lcikge1xuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogTW92ZXMgdGhlIGZvY3VzIGluc2lkZSB0aGUgZm9jdXMgdHJhcC4gKi9cbiAgcHJvdGVjdGVkIF90cmFwRm9jdXMoKSB7XG4gICAgLy8gSWYgd2Ugd2VyZSB0byBhdHRlbXB0IHRvIGZvY3VzIGltbWVkaWF0ZWx5LCB0aGVuIHRoZSBjb250ZW50IG9mIHRoZSBkaWFsb2cgd291bGQgbm90IHlldCBiZVxuICAgIC8vIHJlYWR5IGluIGluc3RhbmNlcyB3aGVyZSBjaGFuZ2UgZGV0ZWN0aW9uIGhhcyB0byBydW4gZmlyc3QuIFRvIGRlYWwgd2l0aCB0aGlzLCB3ZSBzaW1wbHlcbiAgICAvLyB3YWl0IGZvciB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGVtcHR5LlxuICAgIGlmICh0aGlzLl9jb25maWcuYXV0b0ZvY3VzKSB7XG4gICAgICB0aGlzLl9mb2N1c1RyYXAuZm9jdXNJbml0aWFsRWxlbWVudFdoZW5SZWFkeSgpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NvbnRhaW5zRm9jdXMoKSkge1xuICAgICAgLy8gT3RoZXJ3aXNlIGVuc3VyZSB0aGF0IGZvY3VzIGlzIG9uIHRoZSBkaWFsb2cgY29udGFpbmVyLiBJdCdzIHBvc3NpYmxlIHRoYXQgYSBkaWZmZXJlbnRcbiAgICAgIC8vIGNvbXBvbmVudCB0cmllZCB0byBtb3ZlIGZvY3VzIHdoaWxlIHRoZSBvcGVuIGFuaW1hdGlvbiB3YXMgcnVubmluZy4gU2VlOlxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTYyMTUuIE5vdGUgdGhhdCB3ZSBvbmx5IHdhbnQgdG8gZG8gdGhpc1xuICAgICAgLy8gaWYgdGhlIGZvY3VzIGlzbid0IGluc2lkZSB0aGUgZGlhbG9nIGFscmVhZHksIGJlY2F1c2UgaXQncyBwb3NzaWJsZSB0aGF0IHRoZSBjb25zdW1lclxuICAgICAgLy8gdHVybmVkIG9mZiBgYXV0b0ZvY3VzYCBpbiBvcmRlciB0byBtb3ZlIGZvY3VzIHRoZW1zZWx2ZXMuXG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVzdG9yZXMgZm9jdXMgdG8gdGhlIGVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGRpYWxvZyBvcGVuZWQuICovXG4gIHByb3RlY3RlZCBfcmVzdG9yZUZvY3VzKCkge1xuICAgIGNvbnN0IHByZXZpb3VzRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRGlhbG9nV2FzT3BlbmVkO1xuXG4gICAgLy8gV2UgbmVlZCB0aGUgZXh0cmEgY2hlY2ssIGJlY2F1c2UgSUUgY2FuIHNldCB0aGUgYGFjdGl2ZUVsZW1lbnRgIHRvIG51bGwgaW4gc29tZSBjYXNlcy5cbiAgICBpZiAodGhpcy5fY29uZmlnLnJlc3RvcmVGb2N1cyAmJiBwcmV2aW91c0VsZW1lbnQgJiZcbiAgICAgICAgdHlwZW9mIHByZXZpb3VzRWxlbWVudC5mb2N1cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IHRoaXMuX2dldEFjdGl2ZUVsZW1lbnQoKTtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IGZvY3VzIGlzIHN0aWxsIGluc2lkZSB0aGUgZGlhbG9nIG9yIGlzIG9uIHRoZSBib2R5ICh1c3VhbGx5IGJlY2F1c2UgYVxuICAgICAgLy8gbm9uLWZvY3VzYWJsZSBlbGVtZW50IGxpa2UgdGhlIGJhY2tkcm9wIHdhcyBjbGlja2VkKSBiZWZvcmUgbW92aW5nIGl0LiBJdCdzIHBvc3NpYmxlIHRoYXRcbiAgICAgIC8vIHRoZSBjb25zdW1lciBtb3ZlZCBpdCB0aGVtc2VsdmVzIGJlZm9yZSB0aGUgYW5pbWF0aW9uIHdhcyBkb25lLCBpbiB3aGljaCBjYXNlIHdlIHNob3VsZG4ndFxuICAgICAgLy8gZG8gYW55dGhpbmcuXG4gICAgICBpZiAoIWFjdGl2ZUVsZW1lbnQgfHwgYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5fZG9jdW1lbnQuYm9keSB8fCBhY3RpdmVFbGVtZW50ID09PSBlbGVtZW50IHx8XG4gICAgICAgICAgZWxlbWVudC5jb250YWlucyhhY3RpdmVFbGVtZW50KSkge1xuICAgICAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yKSB7XG4gICAgICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHByZXZpb3VzRWxlbWVudCwgdGhpcy5fY2xvc2VJbnRlcmFjdGlvblR5cGUpO1xuICAgICAgICAgIHRoaXMuX2Nsb3NlSW50ZXJhY3Rpb25UeXBlID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmV2aW91c0VsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9mb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX2ZvY3VzVHJhcC5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNldHMgdXAgdGhlIGZvY3VzIHRyYXAuICovXG4gIHByaXZhdGUgX3NldHVwRm9jdXNUcmFwKCkge1xuICAgIHRoaXMuX2ZvY3VzVHJhcCA9IHRoaXMuX2ZvY3VzVHJhcEZhY3RvcnkuY3JlYXRlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gIH1cblxuICAvKiogQ2FwdHVyZXMgdGhlIGVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGRpYWxvZyB3YXMgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9jYXB0dXJlUHJldmlvdXNseUZvY3VzZWRFbGVtZW50KCkge1xuICAgIGlmICh0aGlzLl9kb2N1bWVudCkge1xuICAgICAgdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEaWFsb2dXYXNPcGVuZWQgPSB0aGlzLl9nZXRBY3RpdmVFbGVtZW50KCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGRpYWxvZyBjb250YWluZXIuICovXG4gIHByaXZhdGUgX2ZvY3VzRGlhbG9nQ29udGFpbmVyKCkge1xuICAgIC8vIE5vdGUgdGhhdCB0aGVyZSBpcyBubyBmb2N1cyBtZXRob2Qgd2hlbiByZW5kZXJpbmcgb24gdGhlIHNlcnZlci5cbiAgICBpZiAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmV0dXJucyB3aGV0aGVyIGZvY3VzIGlzIGluc2lkZSB0aGUgZGlhbG9nLiAqL1xuICBwcml2YXRlIF9jb250YWluc0ZvY3VzKCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IHRoaXMuX2dldEFjdGl2ZUVsZW1lbnQoKTtcbiAgICByZXR1cm4gZWxlbWVudCA9PT0gYWN0aXZlRWxlbWVudCB8fCBlbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGN1cnJlbnRseS1mb2N1c2VkIGVsZW1lbnQgb24gdGhlIHBhZ2UuICovXG4gIHByaXZhdGUgX2dldEFjdGl2ZUVsZW1lbnQoKTogRWxlbWVudCB8IG51bGwge1xuICAgIC8vIElmIHRoZSBgYWN0aXZlRWxlbWVudGAgaXMgaW5zaWRlIGEgc2hhZG93IHJvb3QsIGBkb2N1bWVudC5hY3RpdmVFbGVtZW50YCB3aWxsXG4gICAgLy8gcG9pbnQgdG8gdGhlIHNoYWRvdyByb290IHNvIHdlIGhhdmUgdG8gZGVzY2VuZCBpbnRvIGl0IG91cnNlbHZlcy5cbiAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICByZXR1cm4gYWN0aXZlRWxlbWVudD8uc2hhZG93Um9vdD8uYWN0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCB8fCBhY3RpdmVFbGVtZW50O1xuICB9XG59XG5cbi8qKlxuICogSW50ZXJuYWwgY29tcG9uZW50IHRoYXQgd3JhcHMgdXNlci1wcm92aWRlZCBkaWFsb2cgY29udGVudC5cbiAqIEFuaW1hdGlvbiBpcyBiYXNlZCBvbiBodHRwczovL21hdGVyaWFsLmlvL2d1aWRlbGluZXMvbW90aW9uL2Nob3Jlb2dyYXBoeS5odG1sLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGlhbG9nLWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlVXJsOiAnZGlhbG9nLWNvbnRhaW5lci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RpYWxvZy5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gVXNpbmcgT25QdXNoIGZvciBkaWFsb2dzIGNhdXNlZCBzb21lIEczIHN5bmMgaXNzdWVzLiBEaXNhYmxlZCB1bnRpbCB3ZSBjYW4gdHJhY2sgdGhlbSBkb3duLlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGFuaW1hdGlvbnM6IFttYXREaWFsb2dBbmltYXRpb25zLmRpYWxvZ0NvbnRhaW5lcl0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRpYWxvZy1jb250YWluZXInLFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ2FyaWEtbW9kYWwnOiAndHJ1ZScsXG4gICAgJ1tpZF0nOiAnX2lkJyxcbiAgICAnW2F0dHIucm9sZV0nOiAnX2NvbmZpZy5yb2xlJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfY29uZmlnLmFyaWFMYWJlbCA/IG51bGwgOiBfYXJpYUxhYmVsbGVkQnknLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdfY29uZmlnLmFyaWFMYWJlbCcsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19jb25maWcuYXJpYURlc2NyaWJlZEJ5IHx8IG51bGwnLFxuICAgICdbQGRpYWxvZ0NvbnRhaW5lcl0nOiAnX3N0YXRlJyxcbiAgICAnKEBkaWFsb2dDb250YWluZXIuc3RhcnQpJzogJ19vbkFuaW1hdGlvblN0YXJ0KCRldmVudCknLFxuICAgICcoQGRpYWxvZ0NvbnRhaW5lci5kb25lKSc6ICdfb25BbmltYXRpb25Eb25lKCRldmVudCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dDb250YWluZXIgZXh0ZW5kcyBfTWF0RGlhbG9nQ29udGFpbmVyQmFzZSB7XG4gIC8qKiBTdGF0ZSBvZiB0aGUgZGlhbG9nIGFuaW1hdGlvbi4gKi9cbiAgX3N0YXRlOiAndm9pZCcgfCAnZW50ZXInIHwgJ2V4aXQnID0gJ2VudGVyJztcblxuICAvKiogQ2FsbGJhY2ssIGludm9rZWQgd2hlbmV2ZXIgYW4gYW5pbWF0aW9uIG9uIHRoZSBob3N0IGNvbXBsZXRlcy4gKi9cbiAgX29uQW5pbWF0aW9uRG9uZSh7dG9TdGF0ZSwgdG90YWxUaW1lfTogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICBpZiAodG9TdGF0ZSA9PT0gJ2VudGVyJykge1xuICAgICAgdGhpcy5fdHJhcEZvY3VzKCk7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQubmV4dCh7c3RhdGU6ICdvcGVuZWQnLCB0b3RhbFRpbWV9KTtcbiAgICB9IGVsc2UgaWYgKHRvU3RhdGUgPT09ICdleGl0Jykge1xuICAgICAgdGhpcy5fcmVzdG9yZUZvY3VzKCk7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQubmV4dCh7c3RhdGU6ICdjbG9zZWQnLCB0b3RhbFRpbWV9KTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2FsbGJhY2ssIGludm9rZWQgd2hlbiBhbiBhbmltYXRpb24gb24gdGhlIGhvc3Qgc3RhcnRzLiAqL1xuICBfb25BbmltYXRpb25TdGFydCh7dG9TdGF0ZSwgdG90YWxUaW1lfTogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICBpZiAodG9TdGF0ZSA9PT0gJ2VudGVyJykge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLm5leHQoe3N0YXRlOiAnb3BlbmluZycsIHRvdGFsVGltZX0pO1xuICAgIH0gZWxzZSBpZiAodG9TdGF0ZSA9PT0gJ2V4aXQnIHx8IHRvU3RhdGUgPT09ICd2b2lkJykge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLm5leHQoe3N0YXRlOiAnY2xvc2luZycsIHRvdGFsVGltZX0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTdGFydHMgdGhlIGRpYWxvZyBleGl0IGFuaW1hdGlvbi4gKi9cbiAgX3N0YXJ0RXhpdEFuaW1hdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLl9zdGF0ZSA9ICdleGl0JztcblxuICAgIC8vIE1hcmsgdGhlIGNvbnRhaW5lciBmb3IgY2hlY2sgc28gaXQgY2FuIHJlYWN0IGlmIHRoZVxuICAgIC8vIHZpZXcgY29udGFpbmVyIGlzIHVzaW5nIE9uUHVzaCBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG59XG4iXX0=