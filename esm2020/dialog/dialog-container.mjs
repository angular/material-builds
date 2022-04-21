import { FocusMonitor, FocusTrapFactory, InteractivityChecker, } from '@angular/cdk/a11y';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { BasePortalOutlet, CdkPortalOutlet, } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, EventEmitter, Inject, NgZone, Optional, ViewChild, ViewEncapsulation, } from '@angular/core';
import { matDialogAnimations, defaultParams } from './dialog-animations';
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
        if (!this._config.delayFocusTrap) {
            this._trapFocus();
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
                const callback = () => {
                    element.removeEventListener('blur', callback);
                    element.removeEventListener('mousedown', callback);
                    element.removeAttribute('tabindex');
                };
                element.addEventListener('blur', callback);
                element.addEventListener('mousedown', callback);
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
    /**
     * Callback for when the open dialog animation has finished. Intended to
     * be called by sub-classes that use different animation implementations.
     */
    _openAnimationDone(totalTime) {
        if (this._config.delayFocusTrap) {
            this._trapFocus();
        }
        this._animationStateChanged.next({ state: 'opened', totalTime });
    }
}
_MatDialogContainerBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.0-next.14", ngImport: i0, type: _MatDialogContainerBase, deps: [{ token: i0.ElementRef }, { token: i1.FocusTrapFactory }, { token: i0.ChangeDetectorRef }, { token: DOCUMENT, optional: true }, { token: i2.MatDialogConfig }, { token: i1.InteractivityChecker }, { token: i0.NgZone }, { token: i1.FocusMonitor }], target: i0.ɵɵFactoryTarget.Directive });
_MatDialogContainerBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "14.0.0-next.14", type: _MatDialogContainerBase, viewQueries: [{ propertyName: "_portalOutlet", first: true, predicate: CdkPortalOutlet, descendants: true, static: true }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.0-next.14", ngImport: i0, type: _MatDialogContainerBase, decorators: [{
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
            this._openAnimationDone(totalTime);
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
    _getAnimationState() {
        return {
            value: this._state,
            params: {
                'enterAnimationDuration': this._config.enterAnimationDuration || defaultParams.params.enterAnimationDuration,
                'exitAnimationDuration': this._config.exitAnimationDuration || defaultParams.params.exitAnimationDuration,
            },
        };
    }
}
MatDialogContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.0-next.14", ngImport: i0, type: MatDialogContainer, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatDialogContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "14.0.0-next.14", type: MatDialogContainer, selector: "mat-dialog-container", host: { attributes: { "tabindex": "-1", "aria-modal": "true" }, listeners: { "@dialogContainer.start": "_onAnimationStart($event)", "@dialogContainer.done": "_onAnimationDone($event)" }, properties: { "id": "_id", "attr.role": "_config.role", "attr.aria-labelledby": "_config.ariaLabel ? null : _ariaLabelledBy", "attr.aria-label": "_config.ariaLabel", "attr.aria-describedby": "_config.ariaDescribedBy || null", "@dialogContainer": "_getAnimationState()" }, classAttribute: "mat-dialog-container" }, usesInheritance: true, ngImport: i0, template: "<ng-template cdkPortalOutlet></ng-template>\n", styles: [".mat-dialog-container{display:block;padding:24px;border-radius:4px;box-sizing:border-box;overflow:auto;outline:0;width:100%;height:100%;min-height:inherit;max-height:inherit}.cdk-high-contrast-active .mat-dialog-container{outline:solid 1px}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:8px 0;display:flex;flex-wrap:wrap;min-height:52px;align-items:center;box-sizing:content-box;margin-bottom:-24px}.mat-dialog-actions.mat-dialog-actions-align-center,.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions.mat-dialog-actions-align-end,.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions .mat-button-base+.mat-button-base,.mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}"], dependencies: [{ kind: "directive", type: i3.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [matDialogAnimations.dialogContainer], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.0-next.14", ngImport: i0, type: MatDialogContainer, decorators: [{
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
                        '[@dialogContainer]': `_getAnimationState()`,
                        '(@dialogContainer.start)': '_onAnimationStart($event)',
                        '(@dialogContainer.done)': '_onAnimationDone($event)',
                    }, template: "<ng-template cdkPortalOutlet></ng-template>\n", styles: [".mat-dialog-container{display:block;padding:24px;border-radius:4px;box-sizing:border-box;overflow:auto;outline:0;width:100%;height:100%;min-height:inherit;max-height:inherit}.cdk-high-contrast-active .mat-dialog-container{outline:solid 1px}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:8px 0;display:flex;flex-wrap:wrap;min-height:52px;align-items:center;box-sizing:content-box;margin-bottom:-24px}.mat-dialog-actions.mat-dialog-actions-align-center,.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions.mat-dialog-actions-align-end,.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions .mat-button-base+.mat-button-base,.mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sRUFDTCxZQUFZLEVBR1osZ0JBQWdCLEVBQ2hCLG9CQUFvQixHQUNyQixNQUFNLG1CQUFtQixDQUFDO0FBQzNCLE9BQU8sRUFBQyxpQ0FBaUMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hFLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsZUFBZSxHQUloQixNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBRVQsU0FBUyxFQUNULFVBQVUsRUFFVixZQUFZLEVBQ1osTUFBTSxFQUNOLE1BQU0sRUFDTixRQUFRLEVBQ1IsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsbUJBQW1CLEVBQUUsYUFBYSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdkUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7OztBQVFoRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLHlDQUF5QztJQUN2RCxNQUFNLEtBQUssQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDO0FBQ3ZGLENBQUM7QUFFRDs7O0dBR0c7QUFFSCxNQUFNLE9BQWdCLHVCQUF3QixTQUFRLGdCQUFnQjtJQTRCcEUsWUFDWSxXQUF1QixFQUN2QixpQkFBbUMsRUFDbkMsa0JBQXFDLEVBQ2pCLFNBQWM7SUFDNUMsZ0NBQWdDO0lBQ3pCLE9BQXdCLEVBQ2QscUJB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IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgRm9jdXNNb25pdG9yLFxuICBGb2N1c09yaWdpbixcbiAgRm9jdXNUcmFwLFxuICBGb2N1c1RyYXBGYWN0b3J5LFxuICBJbnRlcmFjdGl2aXR5Q2hlY2tlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtfZ2V0Rm9jdXNlZEVsZW1lbnRQaWVyY2VTaGFkb3dEb219IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1xuICBCYXNlUG9ydGFsT3V0bGV0LFxuICBDZGtQb3J0YWxPdXRsZXQsXG4gIENvbXBvbmVudFBvcnRhbCxcbiAgRG9tUG9ydGFsLFxuICBUZW1wbGF0ZVBvcnRhbCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFbWJlZGRlZFZpZXdSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBOZ1pvbmUsXG4gIE9wdGlvbmFsLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7bWF0RGlhbG9nQW5pbWF0aW9ucywgZGVmYXVsdFBhcmFtc30gZnJvbSAnLi9kaWFsb2ctYW5pbWF0aW9ucyc7XG5pbXBvcnQge01hdERpYWxvZ0NvbmZpZ30gZnJvbSAnLi9kaWFsb2ctY29uZmlnJztcblxuLyoqIEV2ZW50IHRoYXQgY2FwdHVyZXMgdGhlIHN0YXRlIG9mIGRpYWxvZyBjb250YWluZXIgYW5pbWF0aW9ucy4gKi9cbmludGVyZmFjZSBEaWFsb2dBbmltYXRpb25FdmVudCB7XG4gIHN0YXRlOiAnb3BlbmVkJyB8ICdvcGVuaW5nJyB8ICdjbG9zaW5nJyB8ICdjbG9zZWQnO1xuICB0b3RhbFRpbWU6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXhjZXB0aW9uIGZvciB0aGUgY2FzZSB3aGVuIGEgQ29tcG9uZW50UG9ydGFsIGlzXG4gKiBhdHRhY2hlZCB0byBhIERvbVBvcnRhbE91dGxldCB3aXRob3V0IGFuIG9yaWdpbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93TWF0RGlhbG9nQ29udGVudEFscmVhZHlBdHRhY2hlZEVycm9yKCkge1xuICB0aHJvdyBFcnJvcignQXR0ZW1wdGluZyB0byBhdHRhY2ggZGlhbG9nIGNvbnRlbnQgYWZ0ZXIgY29udGVudCBpcyBhbHJlYWR5IGF0dGFjaGVkJyk7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgdGhlIGBNYXREaWFsb2dDb250YWluZXJgLiBUaGUgYmFzZSBjbGFzcyBkb2VzIG5vdCBpbXBsZW1lbnRcbiAqIGFuaW1hdGlvbnMgYXMgdGhlc2UgYXJlIGxlZnQgdG8gaW1wbGVtZW50ZXJzIG9mIHRoZSBkaWFsb2cgY29udGFpbmVyLlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0RGlhbG9nQ29udGFpbmVyQmFzZSBleHRlbmRzIEJhc2VQb3J0YWxPdXRsZXQge1xuICBwcm90ZWN0ZWQgX2RvY3VtZW50OiBEb2N1bWVudDtcblxuICAvKiogVGhlIHBvcnRhbCBvdXRsZXQgaW5zaWRlIG9mIHRoaXMgY29udGFpbmVyIGludG8gd2hpY2ggdGhlIGRpYWxvZyBjb250ZW50IHdpbGwgYmUgbG9hZGVkLiAqL1xuICBAVmlld0NoaWxkKENka1BvcnRhbE91dGxldCwge3N0YXRpYzogdHJ1ZX0pIF9wb3J0YWxPdXRsZXQ6IENka1BvcnRhbE91dGxldDtcblxuICAvKiogVGhlIGNsYXNzIHRoYXQgdHJhcHMgYW5kIG1hbmFnZXMgZm9jdXMgd2l0aGluIHRoZSBkaWFsb2cuICovXG4gIHByaXZhdGUgX2ZvY3VzVHJhcDogRm9jdXNUcmFwO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFuIGFuaW1hdGlvbiBzdGF0ZSBjaGFuZ2VzLiAqL1xuICBfYW5pbWF0aW9uU3RhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxEaWFsb2dBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogRWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgZGlhbG9nIHdhcyBvcGVuZWQuIFNhdmUgdGhpcyB0byByZXN0b3JlIHVwb24gY2xvc2UuICovXG4gIHByaXZhdGUgX2VsZW1lbnRGb2N1c2VkQmVmb3JlRGlhbG9nV2FzT3BlbmVkOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIGludGVyYWN0aW9uIHRoYXQgbGVkIHRvIHRoZSBkaWFsb2cgYmVpbmcgY2xvc2VkLiBUaGlzIGlzIHVzZWQgdG8gZGV0ZXJtaW5lXG4gICAqIHdoZXRoZXIgdGhlIGZvY3VzIHN0eWxlIHdpbGwgYmUgYXBwbGllZCB3aGVuIHJldHVybmluZyBmb2N1cyB0byBpdHMgb3JpZ2luYWwgbG9jYXRpb25cbiAgICogYWZ0ZXIgdGhlIGRpYWxvZyBpcyBjbG9zZWQuXG4gICAqL1xuICBfY2xvc2VJbnRlcmFjdGlvblR5cGU6IEZvY3VzT3JpZ2luIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIElEIG9mIHRoZSBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYXMgdGhlIGRpYWxvZydzIGxhYmVsLiAqL1xuICBfYXJpYUxhYmVsbGVkQnk6IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIElEIGZvciB0aGUgY29udGFpbmVyIERPTSBlbGVtZW50LiAqL1xuICBfaWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIF9mb2N1c1RyYXBGYWN0b3J5OiBGb2N1c1RyYXBGYWN0b3J5LFxuICAgIHByb3RlY3RlZCBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudDogYW55LFxuICAgIC8qKiBUaGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24uICovXG4gICAgcHVibGljIF9jb25maWc6IE1hdERpYWxvZ0NvbmZpZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9pbnRlcmFjdGl2aXR5Q2hlY2tlcjogSW50ZXJhY3Rpdml0eUNoZWNrZXIsXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yPzogRm9jdXNNb25pdG9yLFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2FyaWFMYWJlbGxlZEJ5ID0gX2NvbmZpZy5hcmlhTGFiZWxsZWRCeSB8fCBudWxsO1xuICAgIHRoaXMuX2RvY3VtZW50ID0gX2RvY3VtZW50O1xuICB9XG5cbiAgLyoqIFN0YXJ0cyB0aGUgZGlhbG9nIGV4aXQgYW5pbWF0aW9uLiAqL1xuICBhYnN0cmFjdCBfc3RhcnRFeGl0QW5pbWF0aW9uKCk6IHZvaWQ7XG5cbiAgLyoqIEluaXRpYWxpemVzIHRoZSBkaWFsb2cgY29udGFpbmVyIHdpdGggdGhlIGF0dGFjaGVkIGNvbnRlbnQuICovXG4gIF9pbml0aWFsaXplV2l0aEF0dGFjaGVkQ29udGVudCgpIHtcbiAgICB0aGlzLl9mb2N1c1RyYXAgPSB0aGlzLl9mb2N1c1RyYXBGYWN0b3J5LmNyZWF0ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgLy8gU2F2ZSB0aGUgcHJldmlvdXNseSBmb2N1c2VkIGVsZW1lbnQuIFRoaXMgZWxlbWVudCB3aWxsIGJlIHJlLWZvY3VzZWRcbiAgICAvLyB3aGVuIHRoZSBkaWFsb2cgY2xvc2VzLlxuICAgIGlmICh0aGlzLl9kb2N1bWVudCkge1xuICAgICAgdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEaWFsb2dXYXNPcGVuZWQgPSBfZ2V0Rm9jdXNlZEVsZW1lbnRQaWVyY2VTaGFkb3dEb20oKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2NvbmZpZy5kZWxheUZvY3VzVHJhcCkge1xuICAgICAgdGhpcy5fdHJhcEZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaCBhIENvbXBvbmVudFBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMgZGlhbG9nIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIHBvcnRhbCBQb3J0YWwgdG8gYmUgYXR0YWNoZWQgYXMgdGhlIGRpYWxvZyBjb250ZW50LlxuICAgKi9cbiAgYXR0YWNoQ29tcG9uZW50UG9ydGFsPFQ+KHBvcnRhbDogQ29tcG9uZW50UG9ydGFsPFQ+KTogQ29tcG9uZW50UmVmPFQ+IHtcbiAgICBpZiAodGhpcy5fcG9ydGFsT3V0bGV0Lmhhc0F0dGFjaGVkKCkgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93TWF0RGlhbG9nQ29udGVudEFscmVhZHlBdHRhY2hlZEVycm9yKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hDb21wb25lbnRQb3J0YWwocG9ydGFsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2ggYSBUZW1wbGF0ZVBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMgZGlhbG9nIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIHBvcnRhbCBQb3J0YWwgdG8gYmUgYXR0YWNoZWQgYXMgdGhlIGRpYWxvZyBjb250ZW50LlxuICAgKi9cbiAgYXR0YWNoVGVtcGxhdGVQb3J0YWw8Qz4ocG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxDPik6IEVtYmVkZGVkVmlld1JlZjxDPiB7XG4gICAgaWYgKHRoaXMuX3BvcnRhbE91dGxldC5oYXNBdHRhY2hlZCgpICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvd01hdERpYWxvZ0NvbnRlbnRBbHJlYWR5QXR0YWNoZWRFcnJvcigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoVGVtcGxhdGVQb3J0YWwocG9ydGFsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhIERPTSBwb3J0YWwgdG8gdGhlIGRpYWxvZyBjb250YWluZXIuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIGF0dGFjaGVkLlxuICAgKiBAZGVwcmVjYXRlZCBUbyBiZSB0dXJuZWQgaW50byBhIG1ldGhvZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICovXG4gIG92ZXJyaWRlIGF0dGFjaERvbVBvcnRhbCA9IChwb3J0YWw6IERvbVBvcnRhbCkgPT4ge1xuICAgIGlmICh0aGlzLl9wb3J0YWxPdXRsZXQuaGFzQXR0YWNoZWQoKSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3dNYXREaWFsb2dDb250ZW50QWxyZWFkeUF0dGFjaGVkRXJyb3IoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcG9ydGFsT3V0bGV0LmF0dGFjaERvbVBvcnRhbChwb3J0YWwpO1xuICB9O1xuXG4gIC8qKiBNb3ZlcyBmb2N1cyBiYWNrIGludG8gdGhlIGRpYWxvZyBpZiBpdCB3YXMgbW92ZWQgb3V0LiAqL1xuICBfcmVjYXB0dXJlRm9jdXMoKSB7XG4gICAgaWYgKCF0aGlzLl9jb250YWluc0ZvY3VzKCkpIHtcbiAgICAgIHRoaXMuX3RyYXBGb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBwcm92aWRlZCBlbGVtZW50LiBJZiB0aGUgZWxlbWVudCBpcyBub3QgZm9jdXNhYmxlLCBpdCB3aWxsIGFkZCBhIHRhYkluZGV4XG4gICAqIGF0dHJpYnV0ZSB0byBmb3JjZWZ1bGx5IGZvY3VzIGl0LiBUaGUgYXR0cmlidXRlIGlzIHJlbW92ZWQgYWZ0ZXIgZm9jdXMgaXMgbW92ZWQuXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGZvY3VzLlxuICAgKi9cbiAgcHJpdmF0ZSBfZm9yY2VGb2N1cyhlbGVtZW50OiBIVE1MRWxlbWVudCwgb3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIGlmICghdGhpcy5faW50ZXJhY3Rpdml0eUNoZWNrZXIuaXNGb2N1c2FibGUoZWxlbWVudCkpIHtcbiAgICAgIGVsZW1lbnQudGFiSW5kZXggPSAtMTtcbiAgICAgIC8vIFRoZSB0YWJpbmRleCBhdHRyaWJ1dGUgc2hvdWxkIGJlIHJlbW92ZWQgdG8gYXZvaWQgbmF2aWdhdGluZyB0byB0aGF0IGVsZW1lbnQgYWdhaW5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIGNhbGxiYWNrKTtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNhbGxiYWNrKTtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICAgICAgfTtcblxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBjYWxsYmFjayk7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yIHdpdGhpbiB0aGUgZm9jdXMgdHJhcC5cbiAgICogQHBhcmFtIHNlbGVjdG9yIFRoZSBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBlbGVtZW50IHRvIHNldCBmb2N1cyB0by5cbiAgICovXG4gIHByaXZhdGUgX2ZvY3VzQnlDc3NTZWxlY3RvcihzZWxlY3Rvcjogc3RyaW5nLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgbGV0IGVsZW1lbnRUb0ZvY3VzID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBzZWxlY3RvcixcbiAgICApIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAoZWxlbWVudFRvRm9jdXMpIHtcbiAgICAgIHRoaXMuX2ZvcmNlRm9jdXMoZWxlbWVudFRvRm9jdXMsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgZm9jdXMgaW5zaWRlIHRoZSBmb2N1cyB0cmFwLiBXaGVuIGF1dG9Gb2N1cyBpcyBub3Qgc2V0IHRvICdkaWFsb2cnLCBpZiBmb2N1c1xuICAgKiBjYW5ub3QgYmUgbW92ZWQgdGhlbiBmb2N1cyB3aWxsIGdvIHRvIHRoZSBkaWFsb2cgY29udGFpbmVyLlxuICAgKi9cbiAgcHJvdGVjdGVkIF90cmFwRm9jdXMoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAvLyBJZiB3ZXJlIHRvIGF0dGVtcHQgdG8gZm9jdXMgaW1tZWRpYXRlbHksIHRoZW4gdGhlIGNvbnRlbnQgb2YgdGhlIGRpYWxvZyB3b3VsZCBub3QgeWV0IGJlXG4gICAgLy8gcmVhZHkgaW4gaW5zdGFuY2VzIHdoZXJlIGNoYW5nZSBkZXRlY3Rpb24gaGFzIHRvIHJ1biBmaXJzdC4gVG8gZGVhbCB3aXRoIHRoaXMsIHdlIHNpbXBseVxuICAgIC8vIHdhaXQgZm9yIHRoZSBtaWNyb3Rhc2sgcXVldWUgdG8gYmUgZW1wdHkgd2hlbiBzZXR0aW5nIGZvY3VzIHdoZW4gYXV0b0ZvY3VzIGlzbid0IHNldCB0b1xuICAgIC8vIGRpYWxvZy4gSWYgdGhlIGVsZW1lbnQgaW5zaWRlIHRoZSBkaWFsb2cgY2FuJ3QgYmUgZm9jdXNlZCwgdGhlbiB0aGUgY29udGFpbmVyIGlzIGZvY3VzZWRcbiAgICAvLyBzbyB0aGUgdXNlciBjYW4ndCB0YWIgaW50byBvdGhlciBlbGVtZW50cyBiZWhpbmQgaXQuXG4gICAgc3dpdGNoICh0aGlzLl9jb25maWcuYXV0b0ZvY3VzKSB7XG4gICAgICBjYXNlIGZhbHNlOlxuICAgICAgY2FzZSAnZGlhbG9nJzpcbiAgICAgICAgLy8gRW5zdXJlIHRoYXQgZm9jdXMgaXMgb24gdGhlIGRpYWxvZyBjb250YWluZXIuIEl0J3MgcG9zc2libGUgdGhhdCBhIGRpZmZlcmVudFxuICAgICAgICAvLyBjb21wb25lbnQgdHJpZWQgdG8gbW92ZSBmb2N1cyB3aGlsZSB0aGUgb3BlbiBhbmltYXRpb24gd2FzIHJ1bm5pbmcuIFNlZTpcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTYyMTUuIE5vdGUgdGhhdCB3ZSBvbmx5IHdhbnQgdG8gZG8gdGhpc1xuICAgICAgICAvLyBpZiB0aGUgZm9jdXMgaXNuJ3QgaW5zaWRlIHRoZSBkaWFsb2cgYWxyZWFkeSwgYmVjYXVzZSBpdCdzIHBvc3NpYmxlIHRoYXQgdGhlIGNvbnN1bWVyXG4gICAgICAgIC8vIHR1cm5lZCBvZmYgYGF1dG9Gb2N1c2AgaW4gb3JkZXIgdG8gbW92ZSBmb2N1cyB0aGVtc2VsdmVzLlxuICAgICAgICBpZiAoIXRoaXMuX2NvbnRhaW5zRm9jdXMoKSkge1xuICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgIGNhc2UgJ2ZpcnN0LXRhYmJhYmxlJzpcbiAgICAgICAgdGhpcy5fZm9jdXNUcmFwLmZvY3VzSW5pdGlhbEVsZW1lbnRXaGVuUmVhZHkoKS50aGVuKGZvY3VzZWRTdWNjZXNzZnVsbHkgPT4ge1xuICAgICAgICAgIC8vIElmIHdlIHdlcmVuJ3QgYWJsZSB0byBmaW5kIGEgZm9jdXNhYmxlIGVsZW1lbnQgaW4gdGhlIGRpYWxvZywgdGhlbiBmb2N1cyB0aGUgZGlhbG9nXG4gICAgICAgICAgLy8gY29udGFpbmVyIGluc3RlYWQuXG4gICAgICAgICAgaWYgKCFmb2N1c2VkU3VjY2Vzc2Z1bGx5KSB7XG4gICAgICAgICAgICB0aGlzLl9mb2N1c0RpYWxvZ0NvbnRhaW5lcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZmlyc3QtaGVhZGluZyc6XG4gICAgICAgIHRoaXMuX2ZvY3VzQnlDc3NTZWxlY3RvcignaDEsIGgyLCBoMywgaDQsIGg1LCBoNiwgW3JvbGU9XCJoZWFkaW5nXCJdJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5fZm9jdXNCeUNzc1NlbGVjdG9yKHRoaXMuX2NvbmZpZy5hdXRvRm9jdXMhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlc3RvcmVzIGZvY3VzIHRvIHRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBkaWFsb2cgb3BlbmVkLiAqL1xuICBwcm90ZWN0ZWQgX3Jlc3RvcmVGb2N1cygpIHtcbiAgICBjb25zdCBwcmV2aW91c0VsZW1lbnQgPSB0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZURpYWxvZ1dhc09wZW5lZDtcblxuICAgIC8vIFdlIG5lZWQgdGhlIGV4dHJhIGNoZWNrLCBiZWNhdXNlIElFIGNhbiBzZXQgdGhlIGBhY3RpdmVFbGVtZW50YCB0byBudWxsIGluIHNvbWUgY2FzZXMuXG4gICAgaWYgKFxuICAgICAgdGhpcy5fY29uZmlnLnJlc3RvcmVGb2N1cyAmJlxuICAgICAgcHJldmlvdXNFbGVtZW50ICYmXG4gICAgICB0eXBlb2YgcHJldmlvdXNFbGVtZW50LmZvY3VzID09PSAnZnVuY3Rpb24nXG4gICAgKSB7XG4gICAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gX2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tKCk7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgICAvLyBNYWtlIHN1cmUgdGhhdCBmb2N1cyBpcyBzdGlsbCBpbnNpZGUgdGhlIGRpYWxvZyBvciBpcyBvbiB0aGUgYm9keSAodXN1YWxseSBiZWNhdXNlIGFcbiAgICAgIC8vIG5vbi1mb2N1c2FibGUgZWxlbWVudCBsaWtlIHRoZSBiYWNrZHJvcCB3YXMgY2xpY2tlZCkgYmVmb3JlIG1vdmluZyBpdC4gSXQncyBwb3NzaWJsZSB0aGF0XG4gICAgICAvLyB0aGUgY29uc3VtZXIgbW92ZWQgaXQgdGhlbXNlbHZlcyBiZWZvcmUgdGhlIGFuaW1hdGlvbiB3YXMgZG9uZSwgaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGRuJ3RcbiAgICAgIC8vIGRvIGFueXRoaW5nLlxuICAgICAgaWYgKFxuICAgICAgICAhYWN0aXZlRWxlbWVudCB8fFxuICAgICAgICBhY3RpdmVFbGVtZW50ID09PSB0aGlzLl9kb2N1bWVudC5ib2R5IHx8XG4gICAgICAgIGFjdGl2ZUVsZW1lbnQgPT09IGVsZW1lbnQgfHxcbiAgICAgICAgZWxlbWVudC5jb250YWlucyhhY3RpdmVFbGVtZW50KVxuICAgICAgKSB7XG4gICAgICAgIGlmICh0aGlzLl9mb2N1c01vbml0b3IpIHtcbiAgICAgICAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEocHJldmlvdXNFbGVtZW50LCB0aGlzLl9jbG9zZUludGVyYWN0aW9uVHlwZSk7XG4gICAgICAgICAgdGhpcy5fY2xvc2VJbnRlcmFjdGlvblR5cGUgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByZXZpb3VzRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgdGhpcy5fZm9jdXNUcmFwLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgZGlhbG9nIGNvbnRhaW5lci4gKi9cbiAgcHJpdmF0ZSBfZm9jdXNEaWFsb2dDb250YWluZXIoKSB7XG4gICAgLy8gTm90ZSB0aGF0IHRoZXJlIGlzIG5vIGZvY3VzIG1ldGhvZCB3aGVuIHJlbmRlcmluZyBvbiB0aGUgc2VydmVyLlxuICAgIGlmICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHdoZXRoZXIgZm9jdXMgaXMgaW5zaWRlIHRoZSBkaWFsb2cuICovXG4gIHByaXZhdGUgX2NvbnRhaW5zRm9jdXMoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gX2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tKCk7XG4gICAgcmV0dXJuIGVsZW1lbnQgPT09IGFjdGl2ZUVsZW1lbnQgfHwgZWxlbWVudC5jb250YWlucyhhY3RpdmVFbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3Igd2hlbiB0aGUgb3BlbiBkaWFsb2cgYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC4gSW50ZW5kZWQgdG9cbiAgICogYmUgY2FsbGVkIGJ5IHN1Yi1jbGFzc2VzIHRoYXQgdXNlIGRpZmZlcmVudCBhbmltYXRpb24gaW1wbGVtZW50YXRpb25zLlxuICAgKi9cbiAgcHJvdGVjdGVkIF9vcGVuQW5pbWF0aW9uRG9uZSh0b3RhbFRpbWU6IG51bWJlcikge1xuICAgIGlmICh0aGlzLl9jb25maWcuZGVsYXlGb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX3RyYXBGb2N1cygpO1xuICAgIH1cblxuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5uZXh0KHtzdGF0ZTogJ29wZW5lZCcsIHRvdGFsVGltZX0pO1xuICB9XG59XG5cbi8qKlxuICogSW50ZXJuYWwgY29tcG9uZW50IHRoYXQgd3JhcHMgdXNlci1wcm92aWRlZCBkaWFsb2cgY29udGVudC5cbiAqIEFuaW1hdGlvbiBpcyBiYXNlZCBvbiBodHRwczovL21hdGVyaWFsLmlvL2d1aWRlbGluZXMvbW90aW9uL2Nob3Jlb2dyYXBoeS5odG1sLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGlhbG9nLWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlVXJsOiAnZGlhbG9nLWNvbnRhaW5lci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RpYWxvZy5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gVXNpbmcgT25QdXNoIGZvciBkaWFsb2dzIGNhdXNlZCBzb21lIEczIHN5bmMgaXNzdWVzLiBEaXNhYmxlZCB1bnRpbCB3ZSBjYW4gdHJhY2sgdGhlbSBkb3duLlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGFuaW1hdGlvbnM6IFttYXREaWFsb2dBbmltYXRpb25zLmRpYWxvZ0NvbnRhaW5lcl0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRpYWxvZy1jb250YWluZXInLFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ2FyaWEtbW9kYWwnOiAndHJ1ZScsXG4gICAgJ1tpZF0nOiAnX2lkJyxcbiAgICAnW2F0dHIucm9sZV0nOiAnX2NvbmZpZy5yb2xlJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfY29uZmlnLmFyaWFMYWJlbCA/IG51bGwgOiBfYXJpYUxhYmVsbGVkQnknLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdfY29uZmlnLmFyaWFMYWJlbCcsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19jb25maWcuYXJpYURlc2NyaWJlZEJ5IHx8IG51bGwnLFxuICAgICdbQGRpYWxvZ0NvbnRhaW5lcl0nOiBgX2dldEFuaW1hdGlvblN0YXRlKClgLFxuICAgICcoQGRpYWxvZ0NvbnRhaW5lci5zdGFydCknOiAnX29uQW5pbWF0aW9uU3RhcnQoJGV2ZW50KScsXG4gICAgJyhAZGlhbG9nQ29udGFpbmVyLmRvbmUpJzogJ19vbkFuaW1hdGlvbkRvbmUoJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ0NvbnRhaW5lciBleHRlbmRzIF9NYXREaWFsb2dDb250YWluZXJCYXNlIHtcbiAgLyoqIFN0YXRlIG9mIHRoZSBkaWFsb2cgYW5pbWF0aW9uLiAqL1xuICBfc3RhdGU6ICd2b2lkJyB8ICdlbnRlcicgfCAnZXhpdCcgPSAnZW50ZXInO1xuXG4gIC8qKiBDYWxsYmFjaywgaW52b2tlZCB3aGVuZXZlciBhbiBhbmltYXRpb24gb24gdGhlIGhvc3QgY29tcGxldGVzLiAqL1xuICBfb25BbmltYXRpb25Eb25lKHt0b1N0YXRlLCB0b3RhbFRpbWV9OiBBbmltYXRpb25FdmVudCkge1xuICAgIGlmICh0b1N0YXRlID09PSAnZW50ZXInKSB7XG4gICAgICB0aGlzLl9vcGVuQW5pbWF0aW9uRG9uZSh0b3RhbFRpbWUpO1xuICAgIH0gZWxzZSBpZiAodG9TdGF0ZSA9PT0gJ2V4aXQnKSB7XG4gICAgICB0aGlzLl9yZXN0b3JlRm9jdXMoKTtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5uZXh0KHtzdGF0ZTogJ2Nsb3NlZCcsIHRvdGFsVGltZX0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDYWxsYmFjaywgaW52b2tlZCB3aGVuIGFuIGFuaW1hdGlvbiBvbiB0aGUgaG9zdCBzdGFydHMuICovXG4gIF9vbkFuaW1hdGlvblN0YXJ0KHt0b1N0YXRlLCB0b3RhbFRpbWV9OiBBbmltYXRpb25FdmVudCkge1xuICAgIGlmICh0b1N0YXRlID09PSAnZW50ZXInKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQubmV4dCh7c3RhdGU6ICdvcGVuaW5nJywgdG90YWxUaW1lfSk7XG4gICAgfSBlbHNlIGlmICh0b1N0YXRlID09PSAnZXhpdCcgfHwgdG9TdGF0ZSA9PT0gJ3ZvaWQnKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQubmV4dCh7c3RhdGU6ICdjbG9zaW5nJywgdG90YWxUaW1lfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFN0YXJ0cyB0aGUgZGlhbG9nIGV4aXQgYW5pbWF0aW9uLiAqL1xuICBfc3RhcnRFeGl0QW5pbWF0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMuX3N0YXRlID0gJ2V4aXQnO1xuXG4gICAgLy8gTWFyayB0aGUgY29udGFpbmVyIGZvciBjaGVjayBzbyBpdCBjYW4gcmVhY3QgaWYgdGhlXG4gICAgLy8gdmlldyBjb250YWluZXIgaXMgdXNpbmcgT25QdXNoIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBfZ2V0QW5pbWF0aW9uU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB0aGlzLl9zdGF0ZSxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICAnZW50ZXJBbmltYXRpb25EdXJhdGlvbic6XG4gICAgICAgICAgdGhpcy5fY29uZmlnLmVudGVyQW5pbWF0aW9uRHVyYXRpb24gfHwgZGVmYXVsdFBhcmFtcy5wYXJhbXMuZW50ZXJBbmltYXRpb25EdXJhdGlvbixcbiAgICAgICAgJ2V4aXRBbmltYXRpb25EdXJhdGlvbic6XG4gICAgICAgICAgdGhpcy5fY29uZmlnLmV4aXRBbmltYXRpb25EdXJhdGlvbiB8fCBkZWZhdWx0UGFyYW1zLnBhcmFtcy5leGl0QW5pbWF0aW9uRHVyYXRpb24sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiIsIjxuZy10ZW1wbGF0ZSBjZGtQb3J0YWxPdXRsZXQ+PC9uZy10ZW1wbGF0ZT5cbiJdfQ==