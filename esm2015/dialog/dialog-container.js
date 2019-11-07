/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ElementRef, EventEmitter, Inject, Optional, ChangeDetectorRef, ViewChild, ViewEncapsulation, ChangeDetectionStrategy, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { matDialogAnimations } from './dialog-animations';
import { BasePortalOutlet, CdkPortalOutlet } from '@angular/cdk/portal';
import { FocusTrapFactory } from '@angular/cdk/a11y';
import { MatDialogConfig } from './dialog-config';
/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalOutlet without an origin.
 * \@docs-private
 * @return {?}
 */
export function throwMatDialogContentAlreadyAttachedError() {
    throw Error('Attempting to attach dialog content after content is already attached');
}
/**
 * Internal component that wraps user-provided dialog content.
 * Animation is based on https://material.io/guidelines/motion/choreography.html.
 * \@docs-private
 */
export class MatDialogContainer extends BasePortalOutlet {
    /**
     * @param {?} _elementRef
     * @param {?} _focusTrapFactory
     * @param {?} _changeDetectorRef
     * @param {?} _document
     * @param {?} _config
     */
    constructor(_elementRef, _focusTrapFactory, _changeDetectorRef, _document, _config) {
        super();
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._changeDetectorRef = _changeDetectorRef;
        this._config = _config;
        /**
         * Element that was focused before the dialog was opened. Save this to restore upon close.
         */
        this._elementFocusedBeforeDialogWasOpened = null;
        /**
         * State of the dialog animation.
         */
        this._state = 'enter';
        /**
         * Emits when an animation state changes.
         */
        this._animationStateChanged = new EventEmitter();
        /**
         * Attaches a DOM portal to the dialog container.
         * @param portal Portal to be attached.
         * @deprecated To be turned into a method.
         * \@breaking-change 10.0.0
         */
        this.attachDomPortal = (/**
         * @param {?} portal
         * @return {?}
         */
        (portal) => {
            if (this._portalOutlet.hasAttached()) {
                throwMatDialogContentAlreadyAttachedError();
            }
            this._savePreviouslyFocusedElement();
            return this._portalOutlet.attachDomPortal(portal);
        });
        this._ariaLabelledBy = _config.ariaLabelledBy || null;
        this._document = _document;
    }
    /**
     * Attach a ComponentPortal as content to this dialog container.
     * @template T
     * @param {?} portal Portal to be attached as the dialog content.
     * @return {?}
     */
    attachComponentPortal(portal) {
        if (this._portalOutlet.hasAttached()) {
            throwMatDialogContentAlreadyAttachedError();
        }
        this._savePreviouslyFocusedElement();
        return this._portalOutlet.attachComponentPortal(portal);
    }
    /**
     * Attach a TemplatePortal as content to this dialog container.
     * @template C
     * @param {?} portal Portal to be attached as the dialog content.
     * @return {?}
     */
    attachTemplatePortal(portal) {
        if (this._portalOutlet.hasAttached()) {
            throwMatDialogContentAlreadyAttachedError();
        }
        this._savePreviouslyFocusedElement();
        return this._portalOutlet.attachTemplatePortal(portal);
    }
    /**
     * Moves the focus inside the focus trap.
     * @private
     * @return {?}
     */
    _trapFocus() {
        /** @type {?} */
        const element = this._elementRef.nativeElement;
        if (!this._focusTrap) {
            this._focusTrap = this._focusTrapFactory.create(element);
        }
        // If we were to attempt to focus immediately, then the content of the dialog would not yet be
        // ready in instances where change detection has to run first. To deal with this, we simply
        // wait for the microtask queue to be empty.
        if (this._config.autoFocus) {
            this._focusTrap.focusInitialElementWhenReady();
        }
        else {
            /** @type {?} */
            const activeElement = this._document.activeElement;
            // Otherwise ensure that focus is on the dialog container. It's possible that a different
            // component tried to move focus while the open animation was running. See:
            // https://github.com/angular/components/issues/16215. Note that we only want to do this
            // if the focus isn't inside the dialog already, because it's possible that the consumer
            // turned off `autoFocus` in order to move focus themselves.
            if (activeElement !== element && !element.contains(activeElement)) {
                element.focus();
            }
        }
    }
    /**
     * Restores focus to the element that was focused before the dialog opened.
     * @private
     * @return {?}
     */
    _restoreFocus() {
        /** @type {?} */
        const toFocus = this._elementFocusedBeforeDialogWasOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (this._config.restoreFocus && toFocus && typeof toFocus.focus === 'function') {
            /** @type {?} */
            const activeElement = this._document.activeElement;
            /** @type {?} */
            const element = this._elementRef.nativeElement;
            // Make sure that focus is still inside the dialog or is on the body (usually because a
            // non-focusable element like the backdrop was clicked) before moving it. It's possible that
            // the consumer moved it themselves before the animation was done, in which case we shouldn't
            // do anything.
            if (!activeElement || activeElement === this._document.body || activeElement === element ||
                element.contains(activeElement)) {
                toFocus.focus();
            }
        }
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    }
    /**
     * Saves a reference to the element that was focused before the dialog was opened.
     * @private
     * @return {?}
     */
    _savePreviouslyFocusedElement() {
        if (this._document) {
            this._elementFocusedBeforeDialogWasOpened = (/** @type {?} */ (this._document.activeElement));
            // Note that there is no focus method when rendering on the server.
            if (this._elementRef.nativeElement.focus) {
                // Move focus onto the dialog immediately in order to prevent the user from accidentally
                // opening multiple dialogs at the same time. Needs to be async, because the element
                // may not be focusable immediately.
                Promise.resolve().then((/**
                 * @return {?}
                 */
                () => this._elementRef.nativeElement.focus()));
            }
        }
    }
    /**
     * Callback, invoked whenever an animation on the host completes.
     * @param {?} event
     * @return {?}
     */
    _onAnimationDone(event) {
        if (event.toState === 'enter') {
            this._trapFocus();
        }
        else if (event.toState === 'exit') {
            this._restoreFocus();
        }
        this._animationStateChanged.emit(event);
    }
    /**
     * Callback, invoked when an animation on the host starts.
     * @param {?} event
     * @return {?}
     */
    _onAnimationStart(event) {
        this._animationStateChanged.emit(event);
    }
    /**
     * Starts the dialog exit animation.
     * @return {?}
     */
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
                    '[attr.id]': '_id',
                    '[attr.role]': '_config.role',
                    '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledBy',
                    '[attr.aria-label]': '_config.ariaLabel',
                    '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
                    '[@dialogContainer]': '_state',
                    '(@dialogContainer.start)': '_onAnimationStart($event)',
                    '(@dialogContainer.done)': '_onAnimationDone($event)',
                },
                styles: [".mat-dialog-container{display:block;padding:24px;border-radius:4px;box-sizing:border-box;overflow:auto;outline:0;width:100%;height:100%;min-height:inherit;max-height:inherit}@media(-ms-high-contrast: active){.mat-dialog-container{outline:solid 1px}}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:8px 0;display:flex;flex-wrap:wrap;min-height:52px;align-items:center;margin-bottom:-24px}.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions .mat-button-base+.mat-button-base{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button-base+.mat-button-base{margin-left:0;margin-right:8px}\n"]
            }] }
];
/** @nocollapse */
MatDialogContainer.ctorParameters = () => [
    { type: ElementRef },
    { type: FocusTrapFactory },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: MatDialogConfig }
];
MatDialogContainer.propDecorators = {
    _portalOutlet: [{ type: ViewChild, args: [CdkPortalOutlet, { static: true },] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatDialogContainer.prototype._document;
    /**
     * The portal outlet inside of this container into which the dialog content will be loaded.
     * @type {?}
     */
    MatDialogContainer.prototype._portalOutlet;
    /**
     * The class that traps and manages focus within the dialog.
     * @type {?}
     * @private
     */
    MatDialogContainer.prototype._focusTrap;
    /**
     * Element that was focused before the dialog was opened. Save this to restore upon close.
     * @type {?}
     * @private
     */
    MatDialogContainer.prototype._elementFocusedBeforeDialogWasOpened;
    /**
     * State of the dialog animation.
     * @type {?}
     */
    MatDialogContainer.prototype._state;
    /**
     * Emits when an animation state changes.
     * @type {?}
     */
    MatDialogContainer.prototype._animationStateChanged;
    /**
     * ID of the element that should be considered as the dialog's label.
     * @type {?}
     */
    MatDialogContainer.prototype._ariaLabelledBy;
    /**
     * ID for the container DOM element.
     * @type {?}
     */
    MatDialogContainer.prototype._id;
    /**
     * Attaches a DOM portal to the dialog container.
     * \@param portal Portal to be attached.
     * @deprecated To be turned into a method.
     * \@breaking-change 10.0.0
     * @type {?}
     */
    MatDialogContainer.prototype.attachDomPortal;
    /**
     * @type {?}
     * @private
     */
    MatDialogContainer.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatDialogContainer.prototype._focusTrapFactory;
    /**
     * @type {?}
     * @private
     */
    MatDialogContainer.prototype._changeDetectorRef;
    /**
     * The dialog configuration.
     * @type {?}
     */
    MatDialogContainer.prototype._config;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsVUFBVSxFQUVWLFlBQVksRUFDWixNQUFNLEVBQ04sUUFBUSxFQUNSLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLHVCQUF1QixHQUN4QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFekMsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDeEQsT0FBTyxFQUNMLGdCQUFnQixFQUVoQixlQUFlLEVBR2hCLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFZLGdCQUFnQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDOUQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7Ozs7O0FBUWhELE1BQU0sVUFBVSx5Q0FBeUM7SUFDdkQsTUFBTSxLQUFLLENBQUMsdUVBQXVFLENBQUMsQ0FBQztBQUN2RixDQUFDOzs7Ozs7QUE4QkQsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGdCQUFnQjs7Ozs7Ozs7SUF3QnRELFlBQ1UsV0FBdUIsRUFDdkIsaUJBQW1DLEVBQ25DLGtCQUFxQyxFQUNmLFNBQWMsRUFFckMsT0FBd0I7UUFFL0IsS0FBSyxFQUFFLENBQUM7UUFQQSxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN2QixzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBQ25DLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFHdEMsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7Ozs7UUFwQnpCLHlDQUFvQyxHQUF1QixJQUFJLENBQUM7Ozs7UUFHeEUsV0FB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OUxGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQyx5REFBb0M7Z0JBRXBDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzs7Z0JBR3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO2dCQUNoRCxVQUFVLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUM7Z0JBQ2pELElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsc0JBQXNCO29CQUMvQixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsWUFBWSxFQUFFLE1BQU07b0JBQ3BCLFdBQVcsRUFBRSxLQUFLO29CQUNsQixhQUFhLEVBQUUsY0FBYztvQkFDN0Isd0JBQXdCLEVBQUUsNENBQTRDO29CQUN0RSxtQkFBbUIsRUFBRSxtQkFBbUI7b0JBQ3hDLHlCQUF5QixFQUFFLGlDQUFpQztvQkFDNUQsb0JBQW9CLEVBQUUsUUFBUTtvQkFDOUIsMEJBQTBCLEVBQUUsMkJBQTJCO29CQUN2RCx5QkFBeUIsRUFBRSwwQkFBMEI7aUJBQ3REOzthQUNGOzs7O1lBNURDLFVBQVU7WUFvQk8sZ0JBQWdCO1lBZmpDLGlCQUFpQjs0Q0FvRmQsUUFBUSxZQUFJLE1BQU0sU0FBQyxRQUFRO1lBcEV4QixlQUFlOzs7NEJBNENwQixTQUFTLFNBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQzs7Ozs7OztJQUgxQyx1Q0FBNEI7Ozs7O0lBRzVCLDJDQUEyRTs7Ozs7O0lBRzNFLHdDQUE4Qjs7Ozs7O0lBRzlCLGtFQUF3RTs7Ozs7SUFHeEUsb0NBQTRDOzs7OztJQUc1QyxvREFBNEQ7Ozs7O0lBRzVELDZDQUErQjs7Ozs7SUFHL0IsaUNBQVk7Ozs7Ozs7O0lBK0NaLDZDQU9DOzs7OztJQW5EQyx5Q0FBK0I7Ozs7O0lBQy9CLCtDQUEyQzs7Ozs7SUFDM0MsZ0RBQTZDOzs7OztJQUc3QyxxQ0FBK0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIE9wdGlvbmFsLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHttYXREaWFsb2dBbmltYXRpb25zfSBmcm9tICcuL2RpYWxvZy1hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIEJhc2VQb3J0YWxPdXRsZXQsXG4gIENvbXBvbmVudFBvcnRhbCxcbiAgQ2RrUG9ydGFsT3V0bGV0LFxuICBUZW1wbGF0ZVBvcnRhbCxcbiAgRG9tUG9ydGFsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtGb2N1c1RyYXAsIEZvY3VzVHJhcEZhY3Rvcnl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7TWF0RGlhbG9nQ29uZmlnfSBmcm9tICcuL2RpYWxvZy1jb25maWcnO1xuXG5cbi8qKlxuICogVGhyb3dzIGFuIGV4Y2VwdGlvbiBmb3IgdGhlIGNhc2Ugd2hlbiBhIENvbXBvbmVudFBvcnRhbCBpc1xuICogYXR0YWNoZWQgdG8gYSBEb21Qb3J0YWxPdXRsZXQgd2l0aG91dCBhbiBvcmlnaW4uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd01hdERpYWxvZ0NvbnRlbnRBbHJlYWR5QXR0YWNoZWRFcnJvcigpIHtcbiAgdGhyb3cgRXJyb3IoJ0F0dGVtcHRpbmcgdG8gYXR0YWNoIGRpYWxvZyBjb250ZW50IGFmdGVyIGNvbnRlbnQgaXMgYWxyZWFkeSBhdHRhY2hlZCcpO1xufVxuXG4vKipcbiAqIEludGVybmFsIGNvbXBvbmVudCB0aGF0IHdyYXBzIHVzZXItcHJvdmlkZWQgZGlhbG9nIGNvbnRlbnQuXG4gKiBBbmltYXRpb24gaXMgYmFzZWQgb24gaHR0cHM6Ly9tYXRlcmlhbC5pby9ndWlkZWxpbmVzL21vdGlvbi9jaG9yZW9ncmFwaHkuaHRtbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRpYWxvZy1jb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJ2RpYWxvZy1jb250YWluZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkaWFsb2cuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIFVzaW5nIE9uUHVzaCBmb3IgZGlhbG9ncyBjYXVzZWQgc29tZSBHMyBzeW5jIGlzc3Vlcy4gRGlzYWJsZWQgdW50aWwgd2UgY2FuIHRyYWNrIHRoZW0gZG93bi5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBhbmltYXRpb25zOiBbbWF0RGlhbG9nQW5pbWF0aW9ucy5kaWFsb2dDb250YWluZXJdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kaWFsb2ctY29udGFpbmVyJyxcbiAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICdhcmlhLW1vZGFsJzogJ3RydWUnLFxuICAgICdbYXR0ci5pZF0nOiAnX2lkJyxcbiAgICAnW2F0dHIucm9sZV0nOiAnX2NvbmZpZy5yb2xlJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfY29uZmlnLmFyaWFMYWJlbCA/IG51bGwgOiBfYXJpYUxhYmVsbGVkQnknLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdfY29uZmlnLmFyaWFMYWJlbCcsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19jb25maWcuYXJpYURlc2NyaWJlZEJ5IHx8IG51bGwnLFxuICAgICdbQGRpYWxvZ0NvbnRhaW5lcl0nOiAnX3N0YXRlJyxcbiAgICAnKEBkaWFsb2dDb250YWluZXIuc3RhcnQpJzogJ19vbkFuaW1hdGlvblN0YXJ0KCRldmVudCknLFxuICAgICcoQGRpYWxvZ0NvbnRhaW5lci5kb25lKSc6ICdfb25BbmltYXRpb25Eb25lKCRldmVudCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dDb250YWluZXIgZXh0ZW5kcyBCYXNlUG9ydGFsT3V0bGV0IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKiBUaGUgcG9ydGFsIG91dGxldCBpbnNpZGUgb2YgdGhpcyBjb250YWluZXIgaW50byB3aGljaCB0aGUgZGlhbG9nIGNvbnRlbnQgd2lsbCBiZSBsb2FkZWQuICovXG4gIEBWaWV3Q2hpbGQoQ2RrUG9ydGFsT3V0bGV0LCB7c3RhdGljOiB0cnVlfSkgX3BvcnRhbE91dGxldDogQ2RrUG9ydGFsT3V0bGV0O1xuXG4gIC8qKiBUaGUgY2xhc3MgdGhhdCB0cmFwcyBhbmQgbWFuYWdlcyBmb2N1cyB3aXRoaW4gdGhlIGRpYWxvZy4gKi9cbiAgcHJpdmF0ZSBfZm9jdXNUcmFwOiBGb2N1c1RyYXA7XG5cbiAgLyoqIEVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGRpYWxvZyB3YXMgb3BlbmVkLiBTYXZlIHRoaXMgdG8gcmVzdG9yZSB1cG9uIGNsb3NlLiAqL1xuICBwcml2YXRlIF9lbGVtZW50Rm9jdXNlZEJlZm9yZURpYWxvZ1dhc09wZW5lZDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAvKiogU3RhdGUgb2YgdGhlIGRpYWxvZyBhbmltYXRpb24uICovXG4gIF9zdGF0ZTogJ3ZvaWQnIHwgJ2VudGVyJyB8ICdleGl0JyA9ICdlbnRlcic7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW4gYW5pbWF0aW9uIHN0YXRlIGNoYW5nZXMuICovXG4gIF9hbmltYXRpb25TdGF0ZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBJRCBvZiB0aGUgZWxlbWVudCB0aGF0IHNob3VsZCBiZSBjb25zaWRlcmVkIGFzIHRoZSBkaWFsb2cncyBsYWJlbC4gKi9cbiAgX2FyaWFMYWJlbGxlZEJ5OiBzdHJpbmcgfCBudWxsO1xuXG4gIC8qKiBJRCBmb3IgdGhlIGNvbnRhaW5lciBET00gZWxlbWVudC4gKi9cbiAgX2lkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9mb2N1c1RyYXBGYWN0b3J5OiBGb2N1c1RyYXBGYWN0b3J5LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBfZG9jdW1lbnQ6IGFueSxcbiAgICAvKiogVGhlIGRpYWxvZyBjb25maWd1cmF0aW9uLiAqL1xuICAgIHB1YmxpYyBfY29uZmlnOiBNYXREaWFsb2dDb25maWcpIHtcblxuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fYXJpYUxhYmVsbGVkQnkgPSBfY29uZmlnLmFyaWFMYWJlbGxlZEJ5IHx8IG51bGw7XG4gICAgdGhpcy5fZG9jdW1lbnQgPSBfZG9jdW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoIGEgQ29tcG9uZW50UG9ydGFsIGFzIGNvbnRlbnQgdG8gdGhpcyBkaWFsb2cgY29udGFpbmVyLlxuICAgKiBAcGFyYW0gcG9ydGFsIFBvcnRhbCB0byBiZSBhdHRhY2hlZCBhcyB0aGUgZGlhbG9nIGNvbnRlbnQuXG4gICAqL1xuICBhdHRhY2hDb21wb25lbnRQb3J0YWw8VD4ocG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VD4pOiBDb21wb25lbnRSZWY8VD4ge1xuICAgIGlmICh0aGlzLl9wb3J0YWxPdXRsZXQuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgdGhyb3dNYXREaWFsb2dDb250ZW50QWxyZWFkeUF0dGFjaGVkRXJyb3IoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zYXZlUHJldmlvdXNseUZvY3VzZWRFbGVtZW50KCk7XG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hDb21wb25lbnRQb3J0YWwocG9ydGFsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2ggYSBUZW1wbGF0ZVBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMgZGlhbG9nIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIHBvcnRhbCBQb3J0YWwgdG8gYmUgYXR0YWNoZWQgYXMgdGhlIGRpYWxvZyBjb250ZW50LlxuICAgKi9cbiAgYXR0YWNoVGVtcGxhdGVQb3J0YWw8Qz4ocG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxDPik6IEVtYmVkZGVkVmlld1JlZjxDPiB7XG4gICAgaWYgKHRoaXMuX3BvcnRhbE91dGxldC5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aHJvd01hdERpYWxvZ0NvbnRlbnRBbHJlYWR5QXR0YWNoZWRFcnJvcigpO1xuICAgIH1cblxuICAgIHRoaXMuX3NhdmVQcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQoKTtcbiAgICByZXR1cm4gdGhpcy5fcG9ydGFsT3V0bGV0LmF0dGFjaFRlbXBsYXRlUG9ydGFsKHBvcnRhbCk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgYSBET00gcG9ydGFsIHRvIHRoZSBkaWFsb2cgY29udGFpbmVyLlxuICAgKiBAcGFyYW0gcG9ydGFsIFBvcnRhbCB0byBiZSBhdHRhY2hlZC5cbiAgICogQGRlcHJlY2F0ZWQgVG8gYmUgdHVybmVkIGludG8gYSBtZXRob2QuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAqL1xuICBhdHRhY2hEb21Qb3J0YWwgPSAocG9ydGFsOiBEb21Qb3J0YWwpID0+IHtcbiAgICBpZiAodGhpcy5fcG9ydGFsT3V0bGV0Lmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRocm93TWF0RGlhbG9nQ29udGVudEFscmVhZHlBdHRhY2hlZEVycm9yKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2F2ZVByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCgpO1xuICAgIHJldHVybiB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoRG9tUG9ydGFsKHBvcnRhbCk7XG4gIH1cblxuICAvKiogTW92ZXMgdGhlIGZvY3VzIGluc2lkZSB0aGUgZm9jdXMgdHJhcC4gKi9cbiAgcHJpdmF0ZSBfdHJhcEZvY3VzKCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAoIXRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgdGhpcy5fZm9jdXNUcmFwID0gdGhpcy5fZm9jdXNUcmFwRmFjdG9yeS5jcmVhdGUoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLy8gSWYgd2Ugd2VyZSB0byBhdHRlbXB0IHRvIGZvY3VzIGltbWVkaWF0ZWx5LCB0aGVuIHRoZSBjb250ZW50IG9mIHRoZSBkaWFsb2cgd291bGQgbm90IHlldCBiZVxuICAgIC8vIHJlYWR5IGluIGluc3RhbmNlcyB3aGVyZSBjaGFuZ2UgZGV0ZWN0aW9uIGhhcyB0byBydW4gZmlyc3QuIFRvIGRlYWwgd2l0aCB0aGlzLCB3ZSBzaW1wbHlcbiAgICAvLyB3YWl0IGZvciB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGVtcHR5LlxuICAgIGlmICh0aGlzLl9jb25maWcuYXV0b0ZvY3VzKSB7XG4gICAgICB0aGlzLl9mb2N1c1RyYXAuZm9jdXNJbml0aWFsRWxlbWVudFdoZW5SZWFkeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblxuICAgICAgLy8gT3RoZXJ3aXNlIGVuc3VyZSB0aGF0IGZvY3VzIGlzIG9uIHRoZSBkaWFsb2cgY29udGFpbmVyLiBJdCdzIHBvc3NpYmxlIHRoYXQgYSBkaWZmZXJlbnRcbiAgICAgIC8vIGNvbXBvbmVudCB0cmllZCB0byBtb3ZlIGZvY3VzIHdoaWxlIHRoZSBvcGVuIGFuaW1hdGlvbiB3YXMgcnVubmluZy4gU2VlOlxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTYyMTUuIE5vdGUgdGhhdCB3ZSBvbmx5IHdhbnQgdG8gZG8gdGhpc1xuICAgICAgLy8gaWYgdGhlIGZvY3VzIGlzbid0IGluc2lkZSB0aGUgZGlhbG9nIGFscmVhZHksIGJlY2F1c2UgaXQncyBwb3NzaWJsZSB0aGF0IHRoZSBjb25zdW1lclxuICAgICAgLy8gdHVybmVkIG9mZiBgYXV0b0ZvY3VzYCBpbiBvcmRlciB0byBtb3ZlIGZvY3VzIHRoZW1zZWx2ZXMuXG4gICAgICBpZiAoYWN0aXZlRWxlbWVudCAhPT0gZWxlbWVudCAmJiAhZWxlbWVudC5jb250YWlucyhhY3RpdmVFbGVtZW50KSkge1xuICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlc3RvcmVzIGZvY3VzIHRvIHRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBkaWFsb2cgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9yZXN0b3JlRm9jdXMoKSB7XG4gICAgY29uc3QgdG9Gb2N1cyA9IHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRGlhbG9nV2FzT3BlbmVkO1xuXG4gICAgLy8gV2UgbmVlZCB0aGUgZXh0cmEgY2hlY2ssIGJlY2F1c2UgSUUgY2FuIHNldCB0aGUgYGFjdGl2ZUVsZW1lbnRgIHRvIG51bGwgaW4gc29tZSBjYXNlcy5cbiAgICBpZiAodGhpcy5fY29uZmlnLnJlc3RvcmVGb2N1cyAmJiB0b0ZvY3VzICYmIHR5cGVvZiB0b0ZvY3VzLmZvY3VzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IGZvY3VzIGlzIHN0aWxsIGluc2lkZSB0aGUgZGlhbG9nIG9yIGlzIG9uIHRoZSBib2R5ICh1c3VhbGx5IGJlY2F1c2UgYVxuICAgICAgLy8gbm9uLWZvY3VzYWJsZSBlbGVtZW50IGxpa2UgdGhlIGJhY2tkcm9wIHdhcyBjbGlja2VkKSBiZWZvcmUgbW92aW5nIGl0LiBJdCdzIHBvc3NpYmxlIHRoYXRcbiAgICAgIC8vIHRoZSBjb25zdW1lciBtb3ZlZCBpdCB0aGVtc2VsdmVzIGJlZm9yZSB0aGUgYW5pbWF0aW9uIHdhcyBkb25lLCBpbiB3aGljaCBjYXNlIHdlIHNob3VsZG4ndFxuICAgICAgLy8gZG8gYW55dGhpbmcuXG4gICAgICBpZiAoIWFjdGl2ZUVsZW1lbnQgfHwgYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5fZG9jdW1lbnQuYm9keSB8fCBhY3RpdmVFbGVtZW50ID09PSBlbGVtZW50IHx8XG4gICAgICAgIGVsZW1lbnQuY29udGFpbnMoYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgdG9Gb2N1cy5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9mb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX2ZvY3VzVHJhcC5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNhdmVzIGEgcmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBkaWFsb2cgd2FzIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfc2F2ZVByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCgpIHtcbiAgICBpZiAodGhpcy5fZG9jdW1lbnQpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRGlhbG9nV2FzT3BlbmVkID0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgLy8gTm90ZSB0aGF0IHRoZXJlIGlzIG5vIGZvY3VzIG1ldGhvZCB3aGVuIHJlbmRlcmluZyBvbiB0aGUgc2VydmVyLlxuICAgICAgaWYgKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cykge1xuICAgICAgICAvLyBNb3ZlIGZvY3VzIG9udG8gdGhlIGRpYWxvZyBpbW1lZGlhdGVseSBpbiBvcmRlciB0byBwcmV2ZW50IHRoZSB1c2VyIGZyb20gYWNjaWRlbnRhbGx5XG4gICAgICAgIC8vIG9wZW5pbmcgbXVsdGlwbGUgZGlhbG9ncyBhdCB0aGUgc2FtZSB0aW1lLiBOZWVkcyB0byBiZSBhc3luYywgYmVjYXVzZSB0aGUgZWxlbWVudFxuICAgICAgICAvLyBtYXkgbm90IGJlIGZvY3VzYWJsZSBpbW1lZGlhdGVseS5cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENhbGxiYWNrLCBpbnZva2VkIHdoZW5ldmVyIGFuIGFuaW1hdGlvbiBvbiB0aGUgaG9zdCBjb21wbGV0ZXMuICovXG4gIF9vbkFuaW1hdGlvbkRvbmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICdlbnRlcicpIHtcbiAgICAgIHRoaXMuX3RyYXBGb2N1cygpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ2V4aXQnKSB7XG4gICAgICB0aGlzLl9yZXN0b3JlRm9jdXMoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQuZW1pdChldmVudCk7XG4gIH1cblxuICAvKiogQ2FsbGJhY2ssIGludm9rZWQgd2hlbiBhbiBhbmltYXRpb24gb24gdGhlIGhvc3Qgc3RhcnRzLiAqL1xuICBfb25BbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQuZW1pdChldmVudCk7XG4gIH1cblxuICAvKiogU3RhcnRzIHRoZSBkaWFsb2cgZXhpdCBhbmltYXRpb24uICovXG4gIF9zdGFydEV4aXRBbmltYXRpb24oKTogdm9pZCB7XG4gICAgdGhpcy5fc3RhdGUgPSAnZXhpdCc7XG5cbiAgICAvLyBNYXJrIHRoZSBjb250YWluZXIgZm9yIGNoZWNrIHNvIGl0IGNhbiByZWFjdCBpZiB0aGVcbiAgICAvLyB2aWV3IGNvbnRhaW5lciBpcyB1c2luZyBPblB1c2ggY2hhbmdlIGRldGVjdGlvbi5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxufVxuIl19