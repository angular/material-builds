/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { Component, ElementRef, EventEmitter, Inject, Optional, ChangeDetectorRef, ViewChild, ViewEncapsulation, ChangeDetectionStrategy, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { matDialogAnimations } from './dialog-animations';
import { BasePortalOutlet, CdkPortalOutlet } from '@angular/cdk/portal';
import { FocusTrapFactory } from '@angular/cdk/a11y';
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
 * Internal component that wraps user-provided dialog content.
 * Animation is based on https://material.io/guidelines/motion/choreography.html.
 * @docs-private
 */
var MatDialogContainer = /** @class */ (function (_super) {
    __extends(MatDialogContainer, _super);
    function MatDialogContainer(_elementRef, _focusTrapFactory, _changeDetectorRef, _document, 
    /** The dialog configuration. */
    _config) {
        var _this = _super.call(this) || this;
        _this._elementRef = _elementRef;
        _this._focusTrapFactory = _focusTrapFactory;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._config = _config;
        /** Element that was focused before the dialog was opened. Save this to restore upon close. */
        _this._elementFocusedBeforeDialogWasOpened = null;
        /** State of the dialog animation. */
        _this._state = 'enter';
        /** Emits when an animation state changes. */
        _this._animationStateChanged = new EventEmitter();
        _this._ariaLabelledBy = _config.ariaLabelledBy || null;
        _this._document = _document;
        return _this;
    }
    /**
     * Attach a ComponentPortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    MatDialogContainer.prototype.attachComponentPortal = function (portal) {
        if (this._portalOutlet.hasAttached()) {
            throwMatDialogContentAlreadyAttachedError();
        }
        this._savePreviouslyFocusedElement();
        return this._portalOutlet.attachComponentPortal(portal);
    };
    /**
     * Attach a TemplatePortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    MatDialogContainer.prototype.attachTemplatePortal = function (portal) {
        if (this._portalOutlet.hasAttached()) {
            throwMatDialogContentAlreadyAttachedError();
        }
        this._savePreviouslyFocusedElement();
        return this._portalOutlet.attachTemplatePortal(portal);
    };
    /** Moves the focus inside the focus trap. */
    MatDialogContainer.prototype._trapFocus = function () {
        var element = this._elementRef.nativeElement;
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
            var activeElement = this._document.activeElement;
            // Otherwise ensure that focus is on the dialog container. It's possible that a different
            // component tried to move focus while the open animation was running. See:
            // https://github.com/angular/components/issues/16215. Note that we only want to do this
            // if the focus isn't inside the dialog already, because it's possible that the consumer
            // turned off `autoFocus` in order to move focus themselves.
            if (activeElement !== element && !element.contains(activeElement)) {
                element.focus();
            }
        }
    };
    /** Restores focus to the element that was focused before the dialog opened. */
    MatDialogContainer.prototype._restoreFocus = function () {
        var toFocus = this._elementFocusedBeforeDialogWasOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (this._config.restoreFocus && toFocus && typeof toFocus.focus === 'function') {
            var activeElement = this._document.activeElement;
            var element = this._elementRef.nativeElement;
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
    };
    /** Saves a reference to the element that was focused before the dialog was opened. */
    MatDialogContainer.prototype._savePreviouslyFocusedElement = function () {
        var _this = this;
        if (this._document) {
            this._elementFocusedBeforeDialogWasOpened = this._document.activeElement;
            // Note that there is no focus method when rendering on the server.
            if (this._elementRef.nativeElement.focus) {
                // Move focus onto the dialog immediately in order to prevent the user from accidentally
                // opening multiple dialogs at the same time. Needs to be async, because the element
                // may not be focusable immediately.
                Promise.resolve().then(function () { return _this._elementRef.nativeElement.focus(); });
            }
        }
    };
    /** Callback, invoked whenever an animation on the host completes. */
    MatDialogContainer.prototype._onAnimationDone = function (event) {
        if (event.toState === 'enter') {
            this._trapFocus();
        }
        else if (event.toState === 'exit') {
            this._restoreFocus();
        }
        this._animationStateChanged.emit(event);
    };
    /** Callback, invoked when an animation on the host starts. */
    MatDialogContainer.prototype._onAnimationStart = function (event) {
        this._animationStateChanged.emit(event);
    };
    /** Starts the dialog exit animation. */
    MatDialogContainer.prototype._startExitAnimation = function () {
        this._state = 'exit';
        // Mark the container for check so it can react if the
        // view container is using OnPush change detection.
        this._changeDetectorRef.markForCheck();
    };
    MatDialogContainer.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
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
    MatDialogContainer.ctorParameters = function () { return [
        { type: ElementRef },
        { type: FocusTrapFactory },
        { type: ChangeDetectorRef },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
        { type: MatDialogConfig }
    ]; };
    MatDialogContainer.propDecorators = {
        _portalOutlet: [{ type: ViewChild, args: [CdkPortalOutlet, { static: true },] }]
    };
    return MatDialogContainer;
}(BasePortalOutlet));
export { MatDialogContainer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFFVCxVQUFVLEVBRVYsWUFBWSxFQUNaLE1BQU0sRUFDTixRQUFRLEVBQ1IsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsdUJBQXVCLEdBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsZ0JBQWdCLEVBRWhCLGVBQWUsRUFFaEIsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQVksZ0JBQWdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFHaEQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSx5Q0FBeUM7SUFDdkQsTUFBTSxLQUFLLENBQUMsdUVBQXVFLENBQUMsQ0FBQztBQUN2RixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBd0J3QyxzQ0FBZ0I7SUF3QnRELDRCQUNVLFdBQXVCLEVBQ3ZCLGlCQUFtQyxFQUNuQyxrQkFBcUMsRUFDZixTQUFjO0lBQzVDLGdDQUFnQztJQUN6QixPQUF3QjtRQU5qQyxZQVFFLGlCQUFPLFNBR1I7UUFWUyxpQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN2Qix1QkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBQ25DLHdCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFHdEMsYUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFyQmpDLDhGQUE4RjtRQUN0Riww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O29CQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtvQkFDbkIsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMseURBQW9DO29CQUVwQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsOEZBQThGO29CQUM5RiwrQ0FBK0M7b0JBQy9DLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO29CQUNoRCxVQUFVLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUM7b0JBQ2pELElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsc0JBQXNCO3dCQUMvQixVQUFVLEVBQUUsSUFBSTt3QkFDaEIsWUFBWSxFQUFFLE1BQU07d0JBQ3BCLFdBQVcsRUFBRSxLQUFLO3dCQUNsQixhQUFhLEVBQUUsY0FBYzt3QkFDN0Isd0JBQXdCLEVBQUUsNENBQTRDO3dCQUN0RSxtQkFBbUIsRUFBRSxtQkFBbUI7d0JBQ3hDLHlCQUF5QixFQUFFLGlDQUFpQzt3QkFDNUQsb0JBQW9CLEVBQUUsUUFBUTt3QkFDOUIsMEJBQTBCLEVBQUUsMkJBQTJCO3dCQUN2RCx5QkFBeUIsRUFBRSwwQkFBMEI7cUJBQ3REOztpQkFDRjs7OztnQkE1REMsVUFBVTtnQkFtQk8sZ0JBQWdCO2dCQWRqQyxpQkFBaUI7Z0RBb0ZkLFFBQVEsWUFBSSxNQUFNLFNBQUMsUUFBUTtnQkFyRXhCLGVBQWU7OztnQ0E2Q3BCLFNBQVMsU0FBQyxlQUFlLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDOztJQXFKNUMseUJBQUM7Q0FBQSxBQWpMRCxDQXdCd0MsZ0JBQWdCLEdBeUp2RDtTQXpKWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIE9wdGlvbmFsLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHttYXREaWFsb2dBbmltYXRpb25zfSBmcm9tICcuL2RpYWxvZy1hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIEJhc2VQb3J0YWxPdXRsZXQsXG4gIENvbXBvbmVudFBvcnRhbCxcbiAgQ2RrUG9ydGFsT3V0bGV0LFxuICBUZW1wbGF0ZVBvcnRhbFxufSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7Rm9jdXNUcmFwLCBGb2N1c1RyYXBGYWN0b3J5fSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge01hdERpYWxvZ0NvbmZpZ30gZnJvbSAnLi9kaWFsb2ctY29uZmlnJztcblxuXG4vKipcbiAqIFRocm93cyBhbiBleGNlcHRpb24gZm9yIHRoZSBjYXNlIHdoZW4gYSBDb21wb25lbnRQb3J0YWwgaXNcbiAqIGF0dGFjaGVkIHRvIGEgRG9tUG9ydGFsT3V0bGV0IHdpdGhvdXQgYW4gb3JpZ2luLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dNYXREaWFsb2dDb250ZW50QWxyZWFkeUF0dGFjaGVkRXJyb3IoKSB7XG4gIHRocm93IEVycm9yKCdBdHRlbXB0aW5nIHRvIGF0dGFjaCBkaWFsb2cgY29udGVudCBhZnRlciBjb250ZW50IGlzIGFscmVhZHkgYXR0YWNoZWQnKTtcbn1cblxuLyoqXG4gKiBJbnRlcm5hbCBjb21wb25lbnQgdGhhdCB3cmFwcyB1c2VyLXByb3ZpZGVkIGRpYWxvZyBjb250ZW50LlxuICogQW5pbWF0aW9uIGlzIGJhc2VkIG9uIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZ3VpZGVsaW5lcy9tb3Rpb24vY2hvcmVvZ3JhcGh5Lmh0bWwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC1kaWFsb2ctY29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICdkaWFsb2ctY29udGFpbmVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZGlhbG9nLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAvLyBVc2luZyBPblB1c2ggZm9yIGRpYWxvZ3MgY2F1c2VkIHNvbWUgRzMgc3luYyBpc3N1ZXMuIERpc2FibGVkIHVudGlsIHdlIGNhbiB0cmFjayB0aGVtIGRvd24uXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgYW5pbWF0aW9uczogW21hdERpYWxvZ0FuaW1hdGlvbnMuZGlhbG9nQ29udGFpbmVyXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGlhbG9nLWNvbnRhaW5lcicsXG4gICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAnYXJpYS1tb2RhbCc6ICd0cnVlJyxcbiAgICAnW2F0dHIuaWRdJzogJ19pZCcsXG4gICAgJ1thdHRyLnJvbGVdJzogJ19jb25maWcucm9sZScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX2NvbmZpZy5hcmlhTGFiZWwgPyBudWxsIDogX2FyaWFMYWJlbGxlZEJ5JyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnX2NvbmZpZy5hcmlhTGFiZWwnLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfY29uZmlnLmFyaWFEZXNjcmliZWRCeSB8fCBudWxsJyxcbiAgICAnW0BkaWFsb2dDb250YWluZXJdJzogJ19zdGF0ZScsXG4gICAgJyhAZGlhbG9nQ29udGFpbmVyLnN0YXJ0KSc6ICdfb25BbmltYXRpb25TdGFydCgkZXZlbnQpJyxcbiAgICAnKEBkaWFsb2dDb250YWluZXIuZG9uZSknOiAnX29uQW5pbWF0aW9uRG9uZSgkZXZlbnQpJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nQ29udGFpbmVyIGV4dGVuZHMgQmFzZVBvcnRhbE91dGxldCB7XG4gIHByaXZhdGUgX2RvY3VtZW50OiBEb2N1bWVudDtcblxuICAvKiogVGhlIHBvcnRhbCBvdXRsZXQgaW5zaWRlIG9mIHRoaXMgY29udGFpbmVyIGludG8gd2hpY2ggdGhlIGRpYWxvZyBjb250ZW50IHdpbGwgYmUgbG9hZGVkLiAqL1xuICBAVmlld0NoaWxkKENka1BvcnRhbE91dGxldCwge3N0YXRpYzogdHJ1ZX0pIF9wb3J0YWxPdXRsZXQ6IENka1BvcnRhbE91dGxldDtcblxuICAvKiogVGhlIGNsYXNzIHRoYXQgdHJhcHMgYW5kIG1hbmFnZXMgZm9jdXMgd2l0aGluIHRoZSBkaWFsb2cuICovXG4gIHByaXZhdGUgX2ZvY3VzVHJhcDogRm9jdXNUcmFwO1xuXG4gIC8qKiBFbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBkaWFsb2cgd2FzIG9wZW5lZC4gU2F2ZSB0aGlzIHRvIHJlc3RvcmUgdXBvbiBjbG9zZS4gKi9cbiAgcHJpdmF0ZSBfZWxlbWVudEZvY3VzZWRCZWZvcmVEaWFsb2dXYXNPcGVuZWQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFN0YXRlIG9mIHRoZSBkaWFsb2cgYW5pbWF0aW9uLiAqL1xuICBfc3RhdGU6ICd2b2lkJyB8ICdlbnRlcicgfCAnZXhpdCcgPSAnZW50ZXInO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFuIGFuaW1hdGlvbiBzdGF0ZSBjaGFuZ2VzLiAqL1xuICBfYW5pbWF0aW9uU3RhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogSUQgb2YgdGhlIGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyB0aGUgZGlhbG9nJ3MgbGFiZWwuICovXG4gIF9hcmlhTGFiZWxsZWRCeTogc3RyaW5nIHwgbnVsbDtcblxuICAvKiogSUQgZm9yIHRoZSBjb250YWluZXIgRE9NIGVsZW1lbnQuICovXG4gIF9pZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfZm9jdXNUcmFwRmFjdG9yeTogRm9jdXNUcmFwRmFjdG9yeSxcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICAgLyoqIFRoZSBkaWFsb2cgY29uZmlndXJhdGlvbi4gKi9cbiAgICBwdWJsaWMgX2NvbmZpZzogTWF0RGlhbG9nQ29uZmlnKSB7XG5cbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2FyaWFMYWJlbGxlZEJ5ID0gX2NvbmZpZy5hcmlhTGFiZWxsZWRCeSB8fCBudWxsO1xuICAgIHRoaXMuX2RvY3VtZW50ID0gX2RvY3VtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaCBhIENvbXBvbmVudFBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMgZGlhbG9nIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIHBvcnRhbCBQb3J0YWwgdG8gYmUgYXR0YWNoZWQgYXMgdGhlIGRpYWxvZyBjb250ZW50LlxuICAgKi9cbiAgYXR0YWNoQ29tcG9uZW50UG9ydGFsPFQ+KHBvcnRhbDogQ29tcG9uZW50UG9ydGFsPFQ+KTogQ29tcG9uZW50UmVmPFQ+IHtcbiAgICBpZiAodGhpcy5fcG9ydGFsT3V0bGV0Lmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRocm93TWF0RGlhbG9nQ29udGVudEFscmVhZHlBdHRhY2hlZEVycm9yKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2F2ZVByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCgpO1xuICAgIHJldHVybiB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoQ29tcG9uZW50UG9ydGFsKHBvcnRhbCk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoIGEgVGVtcGxhdGVQb3J0YWwgYXMgY29udGVudCB0byB0aGlzIGRpYWxvZyBjb250YWluZXIuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIGF0dGFjaGVkIGFzIHRoZSBkaWFsb2cgY29udGVudC5cbiAgICovXG4gIGF0dGFjaFRlbXBsYXRlUG9ydGFsPEM+KHBvcnRhbDogVGVtcGxhdGVQb3J0YWw8Qz4pOiBFbWJlZGRlZFZpZXdSZWY8Qz4ge1xuICAgIGlmICh0aGlzLl9wb3J0YWxPdXRsZXQuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgdGhyb3dNYXREaWFsb2dDb250ZW50QWxyZWFkeUF0dGFjaGVkRXJyb3IoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zYXZlUHJldmlvdXNseUZvY3VzZWRFbGVtZW50KCk7XG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hUZW1wbGF0ZVBvcnRhbChwb3J0YWwpO1xuICB9XG5cbiAgLyoqIE1vdmVzIHRoZSBmb2N1cyBpbnNpZGUgdGhlIGZvY3VzIHRyYXAuICovXG4gIHByaXZhdGUgX3RyYXBGb2N1cygpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKCF0aGlzLl9mb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX2ZvY3VzVHJhcCA9IHRoaXMuX2ZvY3VzVHJhcEZhY3RvcnkuY3JlYXRlKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIC8vIElmIHdlIHdlcmUgdG8gYXR0ZW1wdCB0byBmb2N1cyBpbW1lZGlhdGVseSwgdGhlbiB0aGUgY29udGVudCBvZiB0aGUgZGlhbG9nIHdvdWxkIG5vdCB5ZXQgYmVcbiAgICAvLyByZWFkeSBpbiBpbnN0YW5jZXMgd2hlcmUgY2hhbmdlIGRldGVjdGlvbiBoYXMgdG8gcnVuIGZpcnN0LiBUbyBkZWFsIHdpdGggdGhpcywgd2Ugc2ltcGx5XG4gICAgLy8gd2FpdCBmb3IgdGhlIG1pY3JvdGFzayBxdWV1ZSB0byBiZSBlbXB0eS5cbiAgICBpZiAodGhpcy5fY29uZmlnLmF1dG9Gb2N1cykge1xuICAgICAgdGhpcy5fZm9jdXNUcmFwLmZvY3VzSW5pdGlhbEVsZW1lbnRXaGVuUmVhZHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIC8vIE90aGVyd2lzZSBlbnN1cmUgdGhhdCBmb2N1cyBpcyBvbiB0aGUgZGlhbG9nIGNvbnRhaW5lci4gSXQncyBwb3NzaWJsZSB0aGF0IGEgZGlmZmVyZW50XG4gICAgICAvLyBjb21wb25lbnQgdHJpZWQgdG8gbW92ZSBmb2N1cyB3aGlsZSB0aGUgb3BlbiBhbmltYXRpb24gd2FzIHJ1bm5pbmcuIFNlZTpcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzE2MjE1LiBOb3RlIHRoYXQgd2Ugb25seSB3YW50IHRvIGRvIHRoaXNcbiAgICAgIC8vIGlmIHRoZSBmb2N1cyBpc24ndCBpbnNpZGUgdGhlIGRpYWxvZyBhbHJlYWR5LCBiZWNhdXNlIGl0J3MgcG9zc2libGUgdGhhdCB0aGUgY29uc3VtZXJcbiAgICAgIC8vIHR1cm5lZCBvZmYgYGF1dG9Gb2N1c2AgaW4gb3JkZXIgdG8gbW92ZSBmb2N1cyB0aGVtc2VsdmVzLlxuICAgICAgaWYgKGFjdGl2ZUVsZW1lbnQgIT09IGVsZW1lbnQgJiYgIWVsZW1lbnQuY29udGFpbnMoYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXN0b3JlcyBmb2N1cyB0byB0aGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgZGlhbG9nIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfcmVzdG9yZUZvY3VzKCkge1xuICAgIGNvbnN0IHRvRm9jdXMgPSB0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZURpYWxvZ1dhc09wZW5lZDtcblxuICAgIC8vIFdlIG5lZWQgdGhlIGV4dHJhIGNoZWNrLCBiZWNhdXNlIElFIGNhbiBzZXQgdGhlIGBhY3RpdmVFbGVtZW50YCB0byBudWxsIGluIHNvbWUgY2FzZXMuXG4gICAgaWYgKHRoaXMuX2NvbmZpZy5yZXN0b3JlRm9jdXMgJiYgdG9Gb2N1cyAmJiB0eXBlb2YgdG9Gb2N1cy5mb2N1cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgICAvLyBNYWtlIHN1cmUgdGhhdCBmb2N1cyBpcyBzdGlsbCBpbnNpZGUgdGhlIGRpYWxvZyBvciBpcyBvbiB0aGUgYm9keSAodXN1YWxseSBiZWNhdXNlIGFcbiAgICAgIC8vIG5vbi1mb2N1c2FibGUgZWxlbWVudCBsaWtlIHRoZSBiYWNrZHJvcCB3YXMgY2xpY2tlZCkgYmVmb3JlIG1vdmluZyBpdC4gSXQncyBwb3NzaWJsZSB0aGF0XG4gICAgICAvLyB0aGUgY29uc3VtZXIgbW92ZWQgaXQgdGhlbXNlbHZlcyBiZWZvcmUgdGhlIGFuaW1hdGlvbiB3YXMgZG9uZSwgaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGRuJ3RcbiAgICAgIC8vIGRvIGFueXRoaW5nLlxuICAgICAgaWYgKCFhY3RpdmVFbGVtZW50IHx8IGFjdGl2ZUVsZW1lbnQgPT09IHRoaXMuX2RvY3VtZW50LmJvZHkgfHwgYWN0aXZlRWxlbWVudCA9PT0gZWxlbWVudCB8fFxuICAgICAgICBlbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgIHRvRm9jdXMuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICB0aGlzLl9mb2N1c1RyYXAuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTYXZlcyBhIHJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgZGlhbG9nIHdhcyBvcGVuZWQuICovXG4gIHByaXZhdGUgX3NhdmVQcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQoKSB7XG4gICAgaWYgKHRoaXMuX2RvY3VtZW50KSB7XG4gICAgICB0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZURpYWxvZ1dhc09wZW5lZCA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgIC8vIE5vdGUgdGhhdCB0aGVyZSBpcyBubyBmb2N1cyBtZXRob2Qgd2hlbiByZW5kZXJpbmcgb24gdGhlIHNlcnZlci5cbiAgICAgIGlmICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMpIHtcbiAgICAgICAgLy8gTW92ZSBmb2N1cyBvbnRvIHRoZSBkaWFsb2cgaW1tZWRpYXRlbHkgaW4gb3JkZXIgdG8gcHJldmVudCB0aGUgdXNlciBmcm9tIGFjY2lkZW50YWxseVxuICAgICAgICAvLyBvcGVuaW5nIG11bHRpcGxlIGRpYWxvZ3MgYXQgdGhlIHNhbWUgdGltZS4gTmVlZHMgdG8gYmUgYXN5bmMsIGJlY2F1c2UgdGhlIGVsZW1lbnRcbiAgICAgICAgLy8gbWF5IG5vdCBiZSBmb2N1c2FibGUgaW1tZWRpYXRlbHkuXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBDYWxsYmFjaywgaW52b2tlZCB3aGVuZXZlciBhbiBhbmltYXRpb24gb24gdGhlIGhvc3QgY29tcGxldGVzLiAqL1xuICBfb25BbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIGlmIChldmVudC50b1N0YXRlID09PSAnZW50ZXInKSB7XG4gICAgICB0aGlzLl90cmFwRm9jdXMoKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICdleGl0Jykge1xuICAgICAgdGhpcy5fcmVzdG9yZUZvY3VzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgLyoqIENhbGxiYWNrLCBpbnZva2VkIHdoZW4gYW4gYW5pbWF0aW9uIG9uIHRoZSBob3N0IHN0YXJ0cy4gKi9cbiAgX29uQW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgLyoqIFN0YXJ0cyB0aGUgZGlhbG9nIGV4aXQgYW5pbWF0aW9uLiAqL1xuICBfc3RhcnRFeGl0QW5pbWF0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMuX3N0YXRlID0gJ2V4aXQnO1xuXG4gICAgLy8gTWFyayB0aGUgY29udGFpbmVyIGZvciBjaGVjayBzbyBpdCBjYW4gcmVhY3QgaWYgdGhlXG4gICAgLy8gdmlldyBjb250YWluZXIgaXMgdXNpbmcgT25QdXNoIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbn1cbiJdfQ==