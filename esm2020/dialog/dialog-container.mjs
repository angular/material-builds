import { FocusMonitor, FocusTrapFactory, InteractivityChecker, } from '@angular/cdk/a11y';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { BasePortalOutlet, CdkPortalOutlet, } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, EventEmitter, Inject, NgZone, Optional, ViewChild, ViewEncapsulation, } from '@angular/core';
import { matDialogAnimations } from './dialog-animations';
import { MatDialogConfig } from './dialog-config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "./dialog-config";
import * as i3 from "@angular/cdk/portal";
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
    _config, _interactivityChecker, _ngZone, _focusMonitor) {
        super();
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._changeDetectorRef = _changeDetectorRef;
        this._config = _config;
        this._interactivityChecker = _interactivityChecker;
        this._ngZone = _ngZone;
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
        this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        // Save the previously focused element. This element will be re-focused
        // when the dialog closes.
        if (this._document) {
            this._elementFocusedBeforeDialogWasOpened = _getFocusedElementPierceShadowDom();
        }
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
            this._trapFocus();
        }
    }
    /**
     * Focuses the provided element. If the element is not focusable, it will add a tabIndex
     * attribute to forcefully focus it. The attribute is removed after focus is moved.
     * @param element The element to focus.
     */
    _forceFocus(element, options) {
        if (!this._interactivityChecker.isFocusable(element)) {
            element.tabIndex = -1;
            // The tabindex attribute should be removed to avoid navigating to that element again
            this._ngZone.runOutsideAngular(() => {
                element.addEventListener('blur', () => element.removeAttribute('tabindex'));
                element.addEventListener('mousedown', () => element.removeAttribute('tabindex'));
            });
        }
        element.focus(options);
    }
    /**
     * Focuses the first element that matches the given selector within the focus trap.
     * @param selector The CSS selector for the element to set focus to.
     */
    _focusByCssSelector(selector, options) {
        let elementToFocus = this._elementRef.nativeElement.querySelector(selector);
        if (elementToFocus) {
            this._forceFocus(elementToFocus, options);
        }
    }
    /**
     * Moves the focus inside the focus trap. When autoFocus is not set to 'dialog', if focus
     * cannot be moved then focus will go to the dialog container.
     */
    _trapFocus() {
        const element = this._elementRef.nativeElement;
        // If were to attempt to focus immediately, then the content of the dialog would not yet be
        // ready in instances where change detection has to run first. To deal with this, we simply
        // wait for the microtask queue to be empty when setting focus when autoFocus isn't set to
        // dialog. If the element inside the dialog can't be focused, then the container is focused
        // so the user can't tab into other elements behind it.
        switch (this._config.autoFocus) {
            case false:
            case 'dialog':
                // Ensure that focus is on the dialog container. It's possible that a different
                // component tried to move focus while the open animation was running. See:
                // https://github.com/angular/components/issues/16215. Note that we only want to do this
                // if the focus isn't inside the dialog already, because it's possible that the consumer
                // turned off `autoFocus` in order to move focus themselves.
                if (!this._containsFocus()) {
                    element.focus();
                }
                break;
            case true:
            case 'first-tabbable':
                this._focusTrap.focusInitialElementWhenReady().then(focusedSuccessfully => {
                    // If we weren't able to find a focusable element in the dialog, then focus the dialog
                    // container instead.
                    if (!focusedSuccessfully) {
                        this._focusDialogContainer();
                    }
                });
                break;
            case 'first-heading':
                this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');
                break;
            default:
                this._focusByCssSelector(this._config.autoFocus);
                break;
        }
    }
    /** Restores focus to the element that was focused before the dialog opened. */
    _restoreFocus() {
        const previousElement = this._elementFocusedBeforeDialogWasOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (this._config.restoreFocus &&
            previousElement &&
            typeof previousElement.focus === 'function') {
            const activeElement = _getFocusedElementPierceShadowDom();
            const element = this._elementRef.nativeElement;
            // Make sure that focus is still inside the dialog or is on the body (usually because a
            // non-focusable element like the backdrop was clicked) before moving it. It's possible that
            // the consumer moved it themselves before the animation was done, in which case we shouldn't
            // do anything.
            if (!activeElement ||
                activeElement === this._document.body ||
                activeElement === element ||
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
        const activeElement = _getFocusedElementPierceShadowDom();
        return element === activeElement || element.contains(activeElement);
    }
}
_MatDialogContainerBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: _MatDialogContainerBase, deps: [{ token: i0.ElementRef }, { token: i1.FocusTrapFactory }, { token: i0.ChangeDetectorRef }, { token: DOCUMENT, optional: true }, { token: i2.MatDialogConfig }, { token: i1.InteractivityChecker }, { token: i0.NgZone }, { token: i1.FocusMonitor }], target: i0.ɵɵFactoryTarget.Directive });
_MatDialogContainerBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.0", type: _MatDialogContainerBase, viewQueries: [{ propertyName: "_portalOutlet", first: true, predicate: CdkPortalOutlet, descendants: true, static: true }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: _MatDialogContainerBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.FocusTrapFactory }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i2.MatDialogConfig }, { type: i1.InteractivityChecker }, { type: i0.NgZone }, { type: i1.FocusMonitor }]; }, propDecorators: { _portalOutlet: [{
                type: ViewChild,
                args: [CdkPortalOutlet, { static: true }]
            }] } });
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
            if (this._config.delayFocusTrap) {
                this._trapFocus();
            }
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
    _initializeWithAttachedContent() {
        super._initializeWithAttachedContent();
        if (!this._config.delayFocusTrap) {
            this._trapFocus();
        }
    }
}
MatDialogContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: MatDialogContainer, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatDialogContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.0", type: MatDialogContainer, selector: "mat-dialog-container", host: { attributes: { "tabindex": "-1", "aria-modal": "true" }, listeners: { "@dialogContainer.start": "_onAnimationStart($event)", "@dialogContainer.done": "_onAnimationDone($event)" }, properties: { "id": "_id", "attr.role": "_config.role", "attr.aria-labelledby": "_config.ariaLabel ? null : _ariaLabelledBy", "attr.aria-label": "_config.ariaLabel", "attr.aria-describedby": "_config.ariaDescribedBy || null", "@dialogContainer": "_state" }, classAttribute: "mat-dialog-container" }, usesInheritance: true, ngImport: i0, template: "<ng-template cdkPortalOutlet></ng-template>\n", styles: [".mat-dialog-container{display:block;padding:24px;border-radius:4px;box-sizing:border-box;overflow:auto;outline:0;width:100%;height:100%;min-height:inherit;max-height:inherit}.cdk-high-contrast-active .mat-dialog-container{outline:solid 1px}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:8px 0;display:flex;flex-wrap:wrap;min-height:52px;align-items:center;box-sizing:content-box;margin-bottom:-24px}.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions .mat-button-base+.mat-button-base,.mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"], directives: [{ type: i3.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [matDialogAnimations.dialogContainer], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: MatDialogContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-dialog-container', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, animations: [matDialogAnimations.dialogContainer], host: {
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
                    }, template: "<ng-template cdkPortalOutlet></ng-template>\n", styles: [".mat-dialog-container{display:block;padding:24px;border-radius:4px;box-sizing:border-box;overflow:auto;outline:0;width:100%;height:100%;min-height:inherit;max-height:inherit}.cdk-high-contrast-active .mat-dialog-container{outline:solid 1px}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:8px 0;display:flex;flex-wrap:wrap;min-height:52px;align-items:center;box-sizing:content-box;margin-bottom:-24px}.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions .mat-button-base+.mat-button-base,.mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sRUFDTCxZQUFZLEVBR1osZ0JBQWdCLEVBQ2hCLG9CQUFvQixHQUNyQixNQUFNLG1CQUFtQixDQUFDO0FBQzNCLE9BQU8sRUFBQyxpQ0FBaUMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hFLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsZUFBZSxHQUloQixNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBRVQsU0FBUyxFQUNULFVBQVUsRUFFVixZQUFZLEVBQ1osTUFBTSxFQUNOLE1BQU0sRUFDTixRQUFRLEVBQ1IsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN4RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0saUJBQWlCLENBQUM7Ozs7O0FBUWhEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUseUNBQXlDO0lBQ3ZELE1BQU0sS0FBSyxDQUFDLHVFQUF1RSxDQUFDLENBQUM7QUFDdkYsQ0FBQztBQUVEOzs7R0FHRztBQUVILE1BQU0sT0FBZ0IsdUJBQXdCLFNBQVEsZ0JBQWdCO0lBNEJwRSxZQUNZLFdBQXVCLEVBQ3ZCLGlCQUFtQyxFQUNuQyxrQkFBcUMsRUFDakIsU0FBYztJQUM1QyxnQ0FBZ0M7SUFDekIsT0FBd0IsRUFDZCxxQkFBMkMsRUFDM0Ms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Q0EsbW9DRCtTYyxDQUFDLG1CQUFtQixDQUFDLGVBQWUsQ0FBQzsyRkFldEMsa0JBQWtCO2tCQXZCOUIsU0FBUzsrQkFDRSxzQkFBc0IsaUJBR2pCLGlCQUFpQixDQUFDLElBQUksbUJBR3BCLHVCQUF1QixDQUFDLE9BQU8sY0FDcEMsQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsUUFDM0M7d0JBQ0osT0FBTyxFQUFFLHNCQUFzQjt3QkFDL0IsVUFBVSxFQUFFLElBQUk7d0JBQ2hCLFlBQVksRUFBRSxNQUFNO3dCQUNwQixNQUFNLEVBQUUsS0FBSzt3QkFDYixhQUFhLEVBQUUsY0FBYzt3QkFDN0Isd0JBQXdCLEVBQUUsNENBQTRDO3dCQUN0RSxtQkFBbUIsRUFBRSxtQkFBbUI7d0JBQ3hDLHlCQUF5QixFQUFFLGlDQUFpQzt3QkFDNUQsb0JBQW9CLEVBQUUsUUFBUTt3QkFDOUIsMEJBQTBCLEVBQUUsMkJBQTJCO3dCQUN2RCx5QkFBeUIsRUFBRSwwQkFBMEI7cUJBQ3REIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgRm9jdXNNb25pdG9yLFxuICBGb2N1c09yaWdpbixcbiAgRm9jdXNUcmFwLFxuICBGb2N1c1RyYXBGYWN0b3J5LFxuICBJbnRlcmFjdGl2aXR5Q2hlY2tlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtfZ2V0Rm9jdXNlZEVsZW1lbnRQaWVyY2VTaGFkb3dEb219IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1xuICBCYXNlUG9ydGFsT3V0bGV0LFxuICBDZGtQb3J0YWxPdXRsZXQsXG4gIENvbXBvbmVudFBvcnRhbCxcbiAgRG9tUG9ydGFsLFxuICBUZW1wbGF0ZVBvcnRhbCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFbWJlZGRlZFZpZXdSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBOZ1pvbmUsXG4gIE9wdGlvbmFsLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7bWF0RGlhbG9nQW5pbWF0aW9uc30gZnJvbSAnLi9kaWFsb2ctYW5pbWF0aW9ucyc7XG5pbXBvcnQge01hdERpYWxvZ0NvbmZpZ30gZnJvbSAnLi9kaWFsb2ctY29uZmlnJztcblxuLyoqIEV2ZW50IHRoYXQgY2FwdHVyZXMgdGhlIHN0YXRlIG9mIGRpYWxvZyBjb250YWluZXIgYW5pbWF0aW9ucy4gKi9cbmludGVyZmFjZSBEaWFsb2dBbmltYXRpb25FdmVudCB7XG4gIHN0YXRlOiAnb3BlbmVkJyB8ICdvcGVuaW5nJyB8ICdjbG9zaW5nJyB8ICdjbG9zZWQnO1xuICB0b3RhbFRpbWU6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXhjZXB0aW9uIGZvciB0aGUgY2FzZSB3aGVuIGEgQ29tcG9uZW50UG9ydGFsIGlzXG4gKiBhdHRhY2hlZCB0byBhIERvbVBvcnRhbE91dGxldCB3aXRob3V0IGFuIG9yaWdpbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93TWF0RGlhbG9nQ29udGVudEFscmVhZHlBdHRhY2hlZEVycm9yKCkge1xuICB0aHJvdyBFcnJvcignQXR0ZW1wdGluZyB0byBhdHRhY2ggZGlhbG9nIGNvbnRlbnQgYWZ0ZXIgY29udGVudCBpcyBhbHJlYWR5IGF0dGFjaGVkJyk7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgdGhlIGBNYXREaWFsb2dDb250YWluZXJgLiBUaGUgYmFzZSBjbGFzcyBkb2VzIG5vdCBpbXBsZW1lbnRcbiAqIGFuaW1hdGlvbnMgYXMgdGhlc2UgYXJlIGxlZnQgdG8gaW1wbGVtZW50ZXJzIG9mIHRoZSBkaWFsb2cgY29udGFpbmVyLlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0RGlhbG9nQ29udGFpbmVyQmFzZSBleHRlbmRzIEJhc2VQb3J0YWxPdXRsZXQge1xuICBwcm90ZWN0ZWQgX2RvY3VtZW50OiBEb2N1bWVudDtcblxuICAvKiogVGhlIHBvcnRhbCBvdXRsZXQgaW5zaWRlIG9mIHRoaXMgY29udGFpbmVyIGludG8gd2hpY2ggdGhlIGRpYWxvZyBjb250ZW50IHdpbGwgYmUgbG9hZGVkLiAqL1xuICBAVmlld0NoaWxkKENka1BvcnRhbE91dGxldCwge3N0YXRpYzogdHJ1ZX0pIF9wb3J0YWxPdXRsZXQ6IENka1BvcnRhbE91dGxldDtcblxuICAvKiogVGhlIGNsYXNzIHRoYXQgdHJhcHMgYW5kIG1hbmFnZXMgZm9jdXMgd2l0aGluIHRoZSBkaWFsb2cuICovXG4gIHByaXZhdGUgX2ZvY3VzVHJhcDogRm9jdXNUcmFwO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFuIGFuaW1hdGlvbiBzdGF0ZSBjaGFuZ2VzLiAqL1xuICBfYW5pbWF0aW9uU3RhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxEaWFsb2dBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogRWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgZGlhbG9nIHdhcyBvcGVuZWQuIFNhdmUgdGhpcyB0byByZXN0b3JlIHVwb24gY2xvc2UuICovXG4gIHByaXZhdGUgX2VsZW1lbnRGb2N1c2VkQmVmb3JlRGlhbG9nV2FzT3BlbmVkOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIGludGVyYWN0aW9uIHRoYXQgbGVkIHRvIHRoZSBkaWFsb2cgYmVpbmcgY2xvc2VkLiBUaGlzIGlzIHVzZWQgdG8gZGV0ZXJtaW5lXG4gICAqIHdoZXRoZXIgdGhlIGZvY3VzIHN0eWxlIHdpbGwgYmUgYXBwbGllZCB3aGVuIHJldHVybmluZyBmb2N1cyB0byBpdHMgb3JpZ2luYWwgbG9jYXRpb25cbiAgICogYWZ0ZXIgdGhlIGRpYWxvZyBpcyBjbG9zZWQuXG4gICAqL1xuICBfY2xvc2VJbnRlcmFjdGlvblR5cGU6IEZvY3VzT3JpZ2luIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIElEIG9mIHRoZSBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYXMgdGhlIGRpYWxvZydzIGxhYmVsLiAqL1xuICBfYXJpYUxhYmVsbGVkQnk6IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIElEIGZvciB0aGUgY29udGFpbmVyIERPTSBlbGVtZW50LiAqL1xuICBfaWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIF9mb2N1c1RyYXBGYWN0b3J5OiBGb2N1c1RyYXBGYWN0b3J5LFxuICAgIHByb3RlY3RlZCBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudDogYW55LFxuICAgIC8qKiBUaGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24uICovXG4gICAgcHVibGljIF9jb25maWc6IE1hdERpYWxvZ0NvbmZpZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9pbnRlcmFjdGl2aXR5Q2hlY2tlcjogSW50ZXJhY3Rpdml0eUNoZWNrZXIsXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yPzogRm9jdXNNb25pdG9yLFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2FyaWFMYWJlbGxlZEJ5ID0gX2NvbmZpZy5hcmlhTGFiZWxsZWRCeSB8fCBudWxsO1xuICAgIHRoaXMuX2RvY3VtZW50ID0gX2RvY3VtZW50O1xuICB9XG5cbiAgLyoqIFN0YXJ0cyB0aGUgZGlhbG9nIGV4aXQgYW5pbWF0aW9uLiAqL1xuICBhYnN0cmFjdCBfc3RhcnRFeGl0QW5pbWF0aW9uKCk6IHZvaWQ7XG5cbiAgLyoqIEluaXRpYWxpemVzIHRoZSBkaWFsb2cgY29udGFpbmVyIHdpdGggdGhlIGF0dGFjaGVkIGNvbnRlbnQuICovXG4gIF9pbml0aWFsaXplV2l0aEF0dGFjaGVkQ29udGVudCgpIHtcbiAgICB0aGlzLl9mb2N1c1RyYXAgPSB0aGlzLl9mb2N1c1RyYXBGYWN0b3J5LmNyZWF0ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgLy8gU2F2ZSB0aGUgcHJldmlvdXNseSBmb2N1c2VkIGVsZW1lbnQuIFRoaXMgZWxlbWVudCB3aWxsIGJlIHJlLWZvY3VzZWRcbiAgICAvLyB3aGVuIHRoZSBkaWFsb2cgY2xvc2VzLlxuICAgIGlmICh0aGlzLl9kb2N1bWVudCkge1xuICAgICAgdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEaWFsb2dXYXNPcGVuZWQgPSBfZ2V0Rm9jdXNlZEVsZW1lbnRQaWVyY2VTaGFkb3dEb20oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoIGEgQ29tcG9uZW50UG9ydGFsIGFzIGNvbnRlbnQgdG8gdGhpcyBkaWFsb2cgY29udGFpbmVyLlxuICAgKiBAcGFyYW0gcG9ydGFsIFBvcnRhbCB0byBiZSBhdHRhY2hlZCBhcyB0aGUgZGlhbG9nIGNvbnRlbnQuXG4gICAqL1xuICBhdHRhY2hDb21wb25lbnRQb3J0YWw8VD4ocG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VD4pOiBDb21wb25lbnRSZWY8VD4ge1xuICAgIGlmICh0aGlzLl9wb3J0YWxPdXRsZXQuaGFzQXR0YWNoZWQoKSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3dNYXREaWFsb2dDb250ZW50QWxyZWFkeUF0dGFjaGVkRXJyb3IoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcG9ydGFsT3V0bGV0LmF0dGFjaENvbXBvbmVudFBvcnRhbChwb3J0YWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaCBhIFRlbXBsYXRlUG9ydGFsIGFzIGNvbnRlbnQgdG8gdGhpcyBkaWFsb2cgY29udGFpbmVyLlxuICAgKiBAcGFyYW0gcG9ydGFsIFBvcnRhbCB0byBiZSBhdHRhY2hlZCBhcyB0aGUgZGlhbG9nIGNvbnRlbnQuXG4gICAqL1xuICBhdHRhY2hUZW1wbGF0ZVBvcnRhbDxDPihwb3J0YWw6IFRlbXBsYXRlUG9ydGFsPEM+KTogRW1iZWRkZWRWaWV3UmVmPEM+IHtcbiAgICBpZiAodGhpcy5fcG9ydGFsT3V0bGV0Lmhhc0F0dGFjaGVkKCkgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93TWF0RGlhbG9nQ29udGVudEFscmVhZHlBdHRhY2hlZEVycm9yKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hUZW1wbGF0ZVBvcnRhbChwb3J0YWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIGEgRE9NIHBvcnRhbCB0byB0aGUgZGlhbG9nIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIHBvcnRhbCBQb3J0YWwgdG8gYmUgYXR0YWNoZWQuXG4gICAqIEBkZXByZWNhdGVkIFRvIGJlIHR1cm5lZCBpbnRvIGEgbWV0aG9kLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgKi9cbiAgb3ZlcnJpZGUgYXR0YWNoRG9tUG9ydGFsID0gKHBvcnRhbDogRG9tUG9ydGFsKSA9PiB7XG4gICAgaWYgKHRoaXMuX3BvcnRhbE91dGxldC5oYXNBdHRhY2hlZCgpICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvd01hdERpYWxvZ0NvbnRlbnRBbHJlYWR5QXR0YWNoZWRFcnJvcigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoRG9tUG9ydGFsKHBvcnRhbCk7XG4gIH07XG5cbiAgLyoqIE1vdmVzIGZvY3VzIGJhY2sgaW50byB0aGUgZGlhbG9nIGlmIGl0IHdhcyBtb3ZlZCBvdXQuICovXG4gIF9yZWNhcHR1cmVGb2N1cygpIHtcbiAgICBpZiAoIXRoaXMuX2NvbnRhaW5zRm9jdXMoKSkge1xuICAgICAgdGhpcy5fdHJhcEZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIHByb3ZpZGVkIGVsZW1lbnQuIElmIHRoZSBlbGVtZW50IGlzIG5vdCBmb2N1c2FibGUsIGl0IHdpbGwgYWRkIGEgdGFiSW5kZXhcbiAgICogYXR0cmlidXRlIHRvIGZvcmNlZnVsbHkgZm9jdXMgaXQuIFRoZSBhdHRyaWJ1dGUgaXMgcmVtb3ZlZCBhZnRlciBmb2N1cyBpcyBtb3ZlZC5cbiAgICogQHBhcmFtIGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gZm9jdXMuXG4gICAqL1xuICBwcml2YXRlIF9mb3JjZUZvY3VzKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgaWYgKCF0aGlzLl9pbnRlcmFjdGl2aXR5Q2hlY2tlci5pc0ZvY3VzYWJsZShlbGVtZW50KSkge1xuICAgICAgZWxlbWVudC50YWJJbmRleCA9IC0xO1xuICAgICAgLy8gVGhlIHRhYmluZGV4IGF0dHJpYnV0ZSBzaG91bGQgYmUgcmVtb3ZlZCB0byBhdm9pZCBuYXZpZ2F0aW5nIHRvIHRoYXQgZWxlbWVudCBhZ2FpblxuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4gZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4JykpO1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3RvciB3aXRoaW4gdGhlIGZvY3VzIHRyYXAuXG4gICAqIEBwYXJhbSBzZWxlY3RvciBUaGUgQ1NTIHNlbGVjdG9yIGZvciB0aGUgZWxlbWVudCB0byBzZXQgZm9jdXMgdG8uXG4gICAqL1xuICBwcml2YXRlIF9mb2N1c0J5Q3NzU2VsZWN0b3Ioc2VsZWN0b3I6IHN0cmluZywgb3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIGxldCBlbGVtZW50VG9Gb2N1cyA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgc2VsZWN0b3IsXG4gICAgKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKGVsZW1lbnRUb0ZvY3VzKSB7XG4gICAgICB0aGlzLl9mb3JjZUZvY3VzKGVsZW1lbnRUb0ZvY3VzLCBvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgdGhlIGZvY3VzIGluc2lkZSB0aGUgZm9jdXMgdHJhcC4gV2hlbiBhdXRvRm9jdXMgaXMgbm90IHNldCB0byAnZGlhbG9nJywgaWYgZm9jdXNcbiAgICogY2Fubm90IGJlIG1vdmVkIHRoZW4gZm9jdXMgd2lsbCBnbyB0byB0aGUgZGlhbG9nIGNvbnRhaW5lci5cbiAgICovXG4gIHByb3RlY3RlZCBfdHJhcEZvY3VzKCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgLy8gSWYgd2VyZSB0byBhdHRlbXB0IHRvIGZvY3VzIGltbWVkaWF0ZWx5LCB0aGVuIHRoZSBjb250ZW50IG9mIHRoZSBkaWFsb2cgd291bGQgbm90IHlldCBiZVxuICAgIC8vIHJlYWR5IGluIGluc3RhbmNlcyB3aGVyZSBjaGFuZ2UgZGV0ZWN0aW9uIGhhcyB0byBydW4gZmlyc3QuIFRvIGRlYWwgd2l0aCB0aGlzLCB3ZSBzaW1wbHlcbiAgICAvLyB3YWl0IGZvciB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGVtcHR5IHdoZW4gc2V0dGluZyBmb2N1cyB3aGVuIGF1dG9Gb2N1cyBpc24ndCBzZXQgdG9cbiAgICAvLyBkaWFsb2cuIElmIHRoZSBlbGVtZW50IGluc2lkZSB0aGUgZGlhbG9nIGNhbid0IGJlIGZvY3VzZWQsIHRoZW4gdGhlIGNvbnRhaW5lciBpcyBmb2N1c2VkXG4gICAgLy8gc28gdGhlIHVzZXIgY2FuJ3QgdGFiIGludG8gb3RoZXIgZWxlbWVudHMgYmVoaW5kIGl0LlxuICAgIHN3aXRjaCAodGhpcy5fY29uZmlnLmF1dG9Gb2N1cykge1xuICAgICAgY2FzZSBmYWxzZTpcbiAgICAgIGNhc2UgJ2RpYWxvZyc6XG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IGZvY3VzIGlzIG9uIHRoZSBkaWFsb2cgY29udGFpbmVyLiBJdCdzIHBvc3NpYmxlIHRoYXQgYSBkaWZmZXJlbnRcbiAgICAgICAgLy8gY29tcG9uZW50IHRyaWVkIHRvIG1vdmUgZm9jdXMgd2hpbGUgdGhlIG9wZW4gYW5pbWF0aW9uIHdhcyBydW5uaW5nLiBTZWU6XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzE2MjE1LiBOb3RlIHRoYXQgd2Ugb25seSB3YW50IHRvIGRvIHRoaXNcbiAgICAgICAgLy8gaWYgdGhlIGZvY3VzIGlzbid0IGluc2lkZSB0aGUgZGlhbG9nIGFscmVhZHksIGJlY2F1c2UgaXQncyBwb3NzaWJsZSB0aGF0IHRoZSBjb25zdW1lclxuICAgICAgICAvLyB0dXJuZWQgb2ZmIGBhdXRvRm9jdXNgIGluIG9yZGVyIHRvIG1vdmUgZm9jdXMgdGhlbXNlbHZlcy5cbiAgICAgICAgaWYgKCF0aGlzLl9jb250YWluc0ZvY3VzKCkpIHtcbiAgICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRydWU6XG4gICAgICBjYXNlICdmaXJzdC10YWJiYWJsZSc6XG4gICAgICAgIHRoaXMuX2ZvY3VzVHJhcC5mb2N1c0luaXRpYWxFbGVtZW50V2hlblJlYWR5KCkudGhlbihmb2N1c2VkU3VjY2Vzc2Z1bGx5ID0+IHtcbiAgICAgICAgICAvLyBJZiB3ZSB3ZXJlbid0IGFibGUgdG8gZmluZCBhIGZvY3VzYWJsZSBlbGVtZW50IGluIHRoZSBkaWFsb2csIHRoZW4gZm9jdXMgdGhlIGRpYWxvZ1xuICAgICAgICAgIC8vIGNvbnRhaW5lciBpbnN0ZWFkLlxuICAgICAgICAgIGlmICghZm9jdXNlZFN1Y2Nlc3NmdWxseSkge1xuICAgICAgICAgICAgdGhpcy5fZm9jdXNEaWFsb2dDb250YWluZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ZpcnN0LWhlYWRpbmcnOlxuICAgICAgICB0aGlzLl9mb2N1c0J5Q3NzU2VsZWN0b3IoJ2gxLCBoMiwgaDMsIGg0LCBoNSwgaDYsIFtyb2xlPVwiaGVhZGluZ1wiXScpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuX2ZvY3VzQnlDc3NTZWxlY3Rvcih0aGlzLl9jb25maWcuYXV0b0ZvY3VzISk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXN0b3JlcyBmb2N1cyB0byB0aGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgZGlhbG9nIG9wZW5lZC4gKi9cbiAgcHJvdGVjdGVkIF9yZXN0b3JlRm9jdXMoKSB7XG4gICAgY29uc3QgcHJldmlvdXNFbGVtZW50ID0gdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEaWFsb2dXYXNPcGVuZWQ7XG5cbiAgICAvLyBXZSBuZWVkIHRoZSBleHRyYSBjaGVjaywgYmVjYXVzZSBJRSBjYW4gc2V0IHRoZSBgYWN0aXZlRWxlbWVudGAgdG8gbnVsbCBpbiBzb21lIGNhc2VzLlxuICAgIGlmIChcbiAgICAgIHRoaXMuX2NvbmZpZy5yZXN0b3JlRm9jdXMgJiZcbiAgICAgIHByZXZpb3VzRWxlbWVudCAmJlxuICAgICAgdHlwZW9mIHByZXZpb3VzRWxlbWVudC5mb2N1cyA9PT0gJ2Z1bmN0aW9uJ1xuICAgICkge1xuICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IF9nZXRGb2N1c2VkRWxlbWVudFBpZXJjZVNoYWRvd0RvbSgpO1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgZm9jdXMgaXMgc3RpbGwgaW5zaWRlIHRoZSBkaWFsb2cgb3IgaXMgb24gdGhlIGJvZHkgKHVzdWFsbHkgYmVjYXVzZSBhXG4gICAgICAvLyBub24tZm9jdXNhYmxlIGVsZW1lbnQgbGlrZSB0aGUgYmFja2Ryb3Agd2FzIGNsaWNrZWQpIGJlZm9yZSBtb3ZpbmcgaXQuIEl0J3MgcG9zc2libGUgdGhhdFxuICAgICAgLy8gdGhlIGNvbnN1bWVyIG1vdmVkIGl0IHRoZW1zZWx2ZXMgYmVmb3JlIHRoZSBhbmltYXRpb24gd2FzIGRvbmUsIGluIHdoaWNoIGNhc2Ugd2Ugc2hvdWxkbid0XG4gICAgICAvLyBkbyBhbnl0aGluZy5cbiAgICAgIGlmIChcbiAgICAgICAgIWFjdGl2ZUVsZW1lbnQgfHxcbiAgICAgICAgYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5fZG9jdW1lbnQuYm9keSB8fFxuICAgICAgICBhY3RpdmVFbGVtZW50ID09PSBlbGVtZW50IHx8XG4gICAgICAgIGVsZW1lbnQuY29udGFpbnMoYWN0aXZlRWxlbWVudClcbiAgICAgICkge1xuICAgICAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yKSB7XG4gICAgICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHByZXZpb3VzRWxlbWVudCwgdGhpcy5fY2xvc2VJbnRlcmFjdGlvblR5cGUpO1xuICAgICAgICAgIHRoaXMuX2Nsb3NlSW50ZXJhY3Rpb25UeXBlID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmV2aW91c0VsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9mb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX2ZvY3VzVHJhcC5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGRpYWxvZyBjb250YWluZXIuICovXG4gIHByaXZhdGUgX2ZvY3VzRGlhbG9nQ29udGFpbmVyKCkge1xuICAgIC8vIE5vdGUgdGhhdCB0aGVyZSBpcyBubyBmb2N1cyBtZXRob2Qgd2hlbiByZW5kZXJpbmcgb24gdGhlIHNlcnZlci5cbiAgICBpZiAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmV0dXJucyB3aGV0aGVyIGZvY3VzIGlzIGluc2lkZSB0aGUgZGlhbG9nLiAqL1xuICBwcml2YXRlIF9jb250YWluc0ZvY3VzKCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IF9nZXRGb2N1c2VkRWxlbWVudFBpZXJjZVNoYWRvd0RvbSgpO1xuICAgIHJldHVybiBlbGVtZW50ID09PSBhY3RpdmVFbGVtZW50IHx8IGVsZW1lbnQuY29udGFpbnMoYWN0aXZlRWxlbWVudCk7XG4gIH1cbn1cblxuLyoqXG4gKiBJbnRlcm5hbCBjb21wb25lbnQgdGhhdCB3cmFwcyB1c2VyLXByb3ZpZGVkIGRpYWxvZyBjb250ZW50LlxuICogQW5pbWF0aW9uIGlzIGJhc2VkIG9uIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZ3VpZGVsaW5lcy9tb3Rpb24vY2hvcmVvZ3JhcGh5Lmh0bWwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kaWFsb2ctY29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICdkaWFsb2ctY29udGFpbmVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZGlhbG9nLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAvLyBVc2luZyBPblB1c2ggZm9yIGRpYWxvZ3MgY2F1c2VkIHNvbWUgRzMgc3luYyBpc3N1ZXMuIERpc2FibGVkIHVudGlsIHdlIGNhbiB0cmFjayB0aGVtIGRvd24uXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgYW5pbWF0aW9uczogW21hdERpYWxvZ0FuaW1hdGlvbnMuZGlhbG9nQ29udGFpbmVyXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGlhbG9nLWNvbnRhaW5lcicsXG4gICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAnYXJpYS1tb2RhbCc6ICd0cnVlJyxcbiAgICAnW2lkXSc6ICdfaWQnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdfY29uZmlnLnJvbGUnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19jb25maWcuYXJpYUxhYmVsID8gbnVsbCA6IF9hcmlhTGFiZWxsZWRCeScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ19jb25maWcuYXJpYUxhYmVsJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX2NvbmZpZy5hcmlhRGVzY3JpYmVkQnkgfHwgbnVsbCcsXG4gICAgJ1tAZGlhbG9nQ29udGFpbmVyXSc6ICdfc3RhdGUnLFxuICAgICcoQGRpYWxvZ0NvbnRhaW5lci5zdGFydCknOiAnX29uQW5pbWF0aW9uU3RhcnQoJGV2ZW50KScsXG4gICAgJyhAZGlhbG9nQ29udGFpbmVyLmRvbmUpJzogJ19vbkFuaW1hdGlvbkRvbmUoJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ0NvbnRhaW5lciBleHRlbmRzIF9NYXREaWFsb2dDb250YWluZXJCYXNlIHtcbiAgLyoqIFN0YXRlIG9mIHRoZSBkaWFsb2cgYW5pbWF0aW9uLiAqL1xuICBfc3RhdGU6ICd2b2lkJyB8ICdlbnRlcicgfCAnZXhpdCcgPSAnZW50ZXInO1xuXG4gIC8qKiBDYWxsYmFjaywgaW52b2tlZCB3aGVuZXZlciBhbiBhbmltYXRpb24gb24gdGhlIGhvc3QgY29tcGxldGVzLiAqL1xuICBfb25BbmltYXRpb25Eb25lKHt0b1N0YXRlLCB0b3RhbFRpbWV9OiBBbmltYXRpb25FdmVudCkge1xuICAgIGlmICh0b1N0YXRlID09PSAnZW50ZXInKSB7XG4gICAgICBpZiAodGhpcy5fY29uZmlnLmRlbGF5Rm9jdXNUcmFwKSB7XG4gICAgICAgIHRoaXMuX3RyYXBGb2N1cygpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQubmV4dCh7c3RhdGU6ICdvcGVuZWQnLCB0b3RhbFRpbWV9KTtcbiAgICB9IGVsc2UgaWYgKHRvU3RhdGUgPT09ICdleGl0Jykge1xuICAgICAgdGhpcy5fcmVzdG9yZUZvY3VzKCk7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQubmV4dCh7c3RhdGU6ICdjbG9zZWQnLCB0b3RhbFRpbWV9KTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2FsbGJhY2ssIGludm9rZWQgd2hlbiBhbiBhbmltYXRpb24gb24gdGhlIGhvc3Qgc3RhcnRzLiAqL1xuICBfb25BbmltYXRpb25TdGFydCh7dG9TdGF0ZSwgdG90YWxUaW1lfTogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICBpZiAodG9TdGF0ZSA9PT0gJ2VudGVyJykge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLm5leHQoe3N0YXRlOiAnb3BlbmluZycsIHRvdGFsVGltZX0pO1xuICAgIH0gZWxzZSBpZiAodG9TdGF0ZSA9PT0gJ2V4aXQnIHx8IHRvU3RhdGUgPT09ICd2b2lkJykge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLm5leHQoe3N0YXRlOiAnY2xvc2luZycsIHRvdGFsVGltZX0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTdGFydHMgdGhlIGRpYWxvZyBleGl0IGFuaW1hdGlvbi4gKi9cbiAgX3N0YXJ0RXhpdEFuaW1hdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLl9zdGF0ZSA9ICdleGl0JztcblxuICAgIC8vIE1hcmsgdGhlIGNvbnRhaW5lciBmb3IgY2hlY2sgc28gaXQgY2FuIHJlYWN0IGlmIHRoZVxuICAgIC8vIHZpZXcgY29udGFpbmVyIGlzIHVzaW5nIE9uUHVzaCBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgb3ZlcnJpZGUgX2luaXRpYWxpemVXaXRoQXR0YWNoZWRDb250ZW50KCkge1xuICAgIHN1cGVyLl9pbml0aWFsaXplV2l0aEF0dGFjaGVkQ29udGVudCgpO1xuXG4gICAgaWYgKCF0aGlzLl9jb25maWcuZGVsYXlGb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX3RyYXBGb2N1cygpO1xuICAgIH1cbiAgfVxufVxuIiwiPG5nLXRlbXBsYXRlIGNka1BvcnRhbE91dGxldD48L25nLXRlbXBsYXRlPlxuIl19