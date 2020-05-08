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
        /**
         * Attaches a DOM portal to the dialog container.
         * @param portal Portal to be attached.
         * @deprecated To be turned into a method.
         * @breaking-change 10.0.0
         */
        _this.attachDomPortal = function (portal) {
            if (_this._portalOutlet.hasAttached()) {
                throwMatDialogContentAlreadyAttachedError();
            }
            _this._setupFocusTrap();
            return _this._portalOutlet.attachDomPortal(portal);
        };
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
        this._setupFocusTrap();
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
        this._setupFocusTrap();
        return this._portalOutlet.attachTemplatePortal(portal);
    };
    /** Moves focus back into the dialog if it was moved out. */
    MatDialogContainer.prototype._recaptureFocus = function () {
        if (!this._containsFocus()) {
            var focusWasTrapped = this._focusTrap.focusInitialElement();
            if (!focusWasTrapped) {
                this._elementRef.nativeElement.focus();
            }
        }
    };
    /** Moves the focus inside the focus trap. */
    MatDialogContainer.prototype._trapFocus = function () {
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
    /**
     * Sets up the focus trand and saves a reference to the
     * element that was focused before the dialog was opened.
     */
    MatDialogContainer.prototype._setupFocusTrap = function () {
        var _this = this;
        if (!this._focusTrap) {
            this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        }
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
    /** Returns whether focus is inside the dialog. */
    MatDialogContainer.prototype._containsFocus = function () {
        var element = this._elementRef.nativeElement;
        var activeElement = this._document.activeElement;
        return element === activeElement || element.contains(activeElement);
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
                    styles: [".mat-dialog-container{display:block;padding:24px;border-radius:4px;box-sizing:border-box;overflow:auto;outline:0;width:100%;height:100%;min-height:inherit;max-height:inherit}.cdk-high-contrast-active .mat-dialog-container{outline:solid 1px}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:8px 0;display:flex;flex-wrap:wrap;min-height:52px;align-items:center;margin-bottom:-24px}.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions .mat-button-base+.mat-button-base,.mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFFVCxVQUFVLEVBRVYsWUFBWSxFQUNaLE1BQU0sRUFDTixRQUFRLEVBQ1IsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsdUJBQXVCLEdBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsZ0JBQWdCLEVBRWhCLGVBQWUsRUFHaEIsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQVksZ0JBQWdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFHaEQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSx5Q0FBeUM7SUFDdkQsTUFBTSxLQUFLLENBQUMsdUVBQXVFLENBQUMsQ0FBQztBQUN2RixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBdUJ3QyxzQ0FBZ0I7SUF3QnRELDRCQUNVLFdBQXVCLEVBQ3ZCLGlCQUFtQyxFQUNuQyxrQkFBcUMsRUFDZixTQUFjO0lBQzVDLGdDQUFnQztJQUN6QixPQUF3QjtRQU5qQyxZQVFFLGlCQUFPLFNBR1I7UUFWUyxpQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN2Qix1QkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBQ25DLHdCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFHdEMsYUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFyQmpDLDhGQUE4RjtRQUN0Riww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QUFtQjt3QkFDeEMseUJBQXlCLEVBQUUsaUNBQWlDO3dCQUM1RCxvQkFBb0IsRUFBRSxRQUFRO3dCQUM5QiwwQkFBMEIsRUFBRSwyQkFBMkI7d0JBQ3ZELHlCQUF5QixFQUFFLDBCQUEwQjtxQkFDdEQ7O2lCQUNGOzs7O2dCQTVEQyxVQUFVO2dCQW9CTyxnQkFBZ0I7Z0JBZmpDLGlCQUFpQjtnREFvRmQsUUFBUSxZQUFJLE1BQU0sU0FBQyxRQUFRO2dCQXBFeEIsZUFBZTs7O2dDQTRDcEIsU0FBUyxTQUFDLGVBQWUsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7O0lBbUw1Qyx5QkFBQztDQUFBLEFBOU1ELENBdUJ3QyxnQkFBZ0IsR0F1THZEO1NBdkxZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRWxlbWVudFJlZixcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge21hdERpYWxvZ0FuaW1hdGlvbnN9IGZyb20gJy4vZGlhbG9nLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgQmFzZVBvcnRhbE91dGxldCxcbiAgQ29tcG9uZW50UG9ydGFsLFxuICBDZGtQb3J0YWxPdXRsZXQsXG4gIFRlbXBsYXRlUG9ydGFsLFxuICBEb21Qb3J0YWxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0ZvY3VzVHJhcCwgRm9jdXNUcmFwRmFjdG9yeX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtNYXREaWFsb2dDb25maWd9IGZyb20gJy4vZGlhbG9nLWNvbmZpZyc7XG5cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXhjZXB0aW9uIGZvciB0aGUgY2FzZSB3aGVuIGEgQ29tcG9uZW50UG9ydGFsIGlzXG4gKiBhdHRhY2hlZCB0byBhIERvbVBvcnRhbE91dGxldCB3aXRob3V0IGFuIG9yaWdpbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93TWF0RGlhbG9nQ29udGVudEFscmVhZHlBdHRhY2hlZEVycm9yKCkge1xuICB0aHJvdyBFcnJvcignQXR0ZW1wdGluZyB0byBhdHRhY2ggZGlhbG9nIGNvbnRlbnQgYWZ0ZXIgY29udGVudCBpcyBhbHJlYWR5IGF0dGFjaGVkJyk7XG59XG5cbi8qKlxuICogSW50ZXJuYWwgY29tcG9uZW50IHRoYXQgd3JhcHMgdXNlci1wcm92aWRlZCBkaWFsb2cgY29udGVudC5cbiAqIEFuaW1hdGlvbiBpcyBiYXNlZCBvbiBodHRwczovL21hdGVyaWFsLmlvL2d1aWRlbGluZXMvbW90aW9uL2Nob3Jlb2dyYXBoeS5odG1sLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGlhbG9nLWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlVXJsOiAnZGlhbG9nLWNvbnRhaW5lci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RpYWxvZy5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gVXNpbmcgT25QdXNoIGZvciBkaWFsb2dzIGNhdXNlZCBzb21lIEczIHN5bmMgaXNzdWVzLiBEaXNhYmxlZCB1bnRpbCB3ZSBjYW4gdHJhY2sgdGhlbSBkb3duLlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGFuaW1hdGlvbnM6IFttYXREaWFsb2dBbmltYXRpb25zLmRpYWxvZ0NvbnRhaW5lcl0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRpYWxvZy1jb250YWluZXInLFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ2FyaWEtbW9kYWwnOiAndHJ1ZScsXG4gICAgJ1thdHRyLmlkXSc6ICdfaWQnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdfY29uZmlnLnJvbGUnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19jb25maWcuYXJpYUxhYmVsID8gbnVsbCA6IF9hcmlhTGFiZWxsZWRCeScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ19jb25maWcuYXJpYUxhYmVsJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX2NvbmZpZy5hcmlhRGVzY3JpYmVkQnkgfHwgbnVsbCcsXG4gICAgJ1tAZGlhbG9nQ29udGFpbmVyXSc6ICdfc3RhdGUnLFxuICAgICcoQGRpYWxvZ0NvbnRhaW5lci5zdGFydCknOiAnX29uQW5pbWF0aW9uU3RhcnQoJGV2ZW50KScsXG4gICAgJyhAZGlhbG9nQ29udGFpbmVyLmRvbmUpJzogJ19vbkFuaW1hdGlvbkRvbmUoJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ0NvbnRhaW5lciBleHRlbmRzIEJhc2VQb3J0YWxPdXRsZXQge1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqIFRoZSBwb3J0YWwgb3V0bGV0IGluc2lkZSBvZiB0aGlzIGNvbnRhaW5lciBpbnRvIHdoaWNoIHRoZSBkaWFsb2cgY29udGVudCB3aWxsIGJlIGxvYWRlZC4gKi9cbiAgQFZpZXdDaGlsZChDZGtQb3J0YWxPdXRsZXQsIHtzdGF0aWM6IHRydWV9KSBfcG9ydGFsT3V0bGV0OiBDZGtQb3J0YWxPdXRsZXQ7XG5cbiAgLyoqIFRoZSBjbGFzcyB0aGF0IHRyYXBzIGFuZCBtYW5hZ2VzIGZvY3VzIHdpdGhpbiB0aGUgZGlhbG9nLiAqL1xuICBwcml2YXRlIF9mb2N1c1RyYXA6IEZvY3VzVHJhcDtcblxuICAvKiogRWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgZGlhbG9nIHdhcyBvcGVuZWQuIFNhdmUgdGhpcyB0byByZXN0b3JlIHVwb24gY2xvc2UuICovXG4gIHByaXZhdGUgX2VsZW1lbnRGb2N1c2VkQmVmb3JlRGlhbG9nV2FzT3BlbmVkOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBTdGF0ZSBvZiB0aGUgZGlhbG9nIGFuaW1hdGlvbi4gKi9cbiAgX3N0YXRlOiAndm9pZCcgfCAnZW50ZXInIHwgJ2V4aXQnID0gJ2VudGVyJztcblxuICAvKiogRW1pdHMgd2hlbiBhbiBhbmltYXRpb24gc3RhdGUgY2hhbmdlcy4gKi9cbiAgX2FuaW1hdGlvblN0YXRlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8QW5pbWF0aW9uRXZlbnQ+KCk7XG5cbiAgLyoqIElEIG9mIHRoZSBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYXMgdGhlIGRpYWxvZydzIGxhYmVsLiAqL1xuICBfYXJpYUxhYmVsbGVkQnk6IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIElEIGZvciB0aGUgY29udGFpbmVyIERPTSBlbGVtZW50LiAqL1xuICBfaWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX2ZvY3VzVHJhcEZhY3Rvcnk6IEZvY3VzVHJhcEZhY3RvcnksXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudDogYW55LFxuICAgIC8qKiBUaGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24uICovXG4gICAgcHVibGljIF9jb25maWc6IE1hdERpYWxvZ0NvbmZpZykge1xuXG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9hcmlhTGFiZWxsZWRCeSA9IF9jb25maWcuYXJpYUxhYmVsbGVkQnkgfHwgbnVsbDtcbiAgICB0aGlzLl9kb2N1bWVudCA9IF9kb2N1bWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2ggYSBDb21wb25lbnRQb3J0YWwgYXMgY29udGVudCB0byB0aGlzIGRpYWxvZyBjb250YWluZXIuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIGF0dGFjaGVkIGFzIHRoZSBkaWFsb2cgY29udGVudC5cbiAgICovXG4gIGF0dGFjaENvbXBvbmVudFBvcnRhbDxUPihwb3J0YWw6IENvbXBvbmVudFBvcnRhbDxUPik6IENvbXBvbmVudFJlZjxUPiB7XG4gICAgaWYgKHRoaXMuX3BvcnRhbE91dGxldC5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aHJvd01hdERpYWxvZ0NvbnRlbnRBbHJlYWR5QXR0YWNoZWRFcnJvcigpO1xuICAgIH1cblxuICAgIHRoaXMuX3NldHVwRm9jdXNUcmFwKCk7XG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hDb21wb25lbnRQb3J0YWwocG9ydGFsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2ggYSBUZW1wbGF0ZVBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMgZGlhbG9nIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIHBvcnRhbCBQb3J0YWwgdG8gYmUgYXR0YWNoZWQgYXMgdGhlIGRpYWxvZyBjb250ZW50LlxuICAgKi9cbiAgYXR0YWNoVGVtcGxhdGVQb3J0YWw8Qz4ocG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxDPik6IEVtYmVkZGVkVmlld1JlZjxDPiB7XG4gICAgaWYgKHRoaXMuX3BvcnRhbE91dGxldC5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aHJvd01hdERpYWxvZ0NvbnRlbnRBbHJlYWR5QXR0YWNoZWRFcnJvcigpO1xuICAgIH1cblxuICAgIHRoaXMuX3NldHVwRm9jdXNUcmFwKCk7XG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hUZW1wbGF0ZVBvcnRhbChwb3J0YWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIGEgRE9NIHBvcnRhbCB0byB0aGUgZGlhbG9nIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIHBvcnRhbCBQb3J0YWwgdG8gYmUgYXR0YWNoZWQuXG4gICAqIEBkZXByZWNhdGVkIFRvIGJlIHR1cm5lZCBpbnRvIGEgbWV0aG9kLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgKi9cbiAgYXR0YWNoRG9tUG9ydGFsID0gKHBvcnRhbDogRG9tUG9ydGFsKSA9PiB7XG4gICAgaWYgKHRoaXMuX3BvcnRhbE91dGxldC5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aHJvd01hdERpYWxvZ0NvbnRlbnRBbHJlYWR5QXR0YWNoZWRFcnJvcigpO1xuICAgIH1cblxuICAgIHRoaXMuX3NldHVwRm9jdXNUcmFwKCk7XG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hEb21Qb3J0YWwocG9ydGFsKTtcbiAgfVxuXG4gIC8qKiBNb3ZlcyBmb2N1cyBiYWNrIGludG8gdGhlIGRpYWxvZyBpZiBpdCB3YXMgbW92ZWQgb3V0LiAqL1xuICBfcmVjYXB0dXJlRm9jdXMoKSB7XG4gICAgaWYgKCF0aGlzLl9jb250YWluc0ZvY3VzKCkpIHtcbiAgICAgIGNvbnN0IGZvY3VzV2FzVHJhcHBlZCA9IHRoaXMuX2ZvY3VzVHJhcC5mb2N1c0luaXRpYWxFbGVtZW50KCk7XG5cbiAgICAgIGlmICghZm9jdXNXYXNUcmFwcGVkKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBNb3ZlcyB0aGUgZm9jdXMgaW5zaWRlIHRoZSBmb2N1cyB0cmFwLiAqL1xuICBwcml2YXRlIF90cmFwRm9jdXMoKSB7XG4gICAgLy8gSWYgd2Ugd2VyZSB0byBhdHRlbXB0IHRvIGZvY3VzIGltbWVkaWF0ZWx5LCB0aGVuIHRoZSBjb250ZW50IG9mIHRoZSBkaWFsb2cgd291bGQgbm90IHlldCBiZVxuICAgIC8vIHJlYWR5IGluIGluc3RhbmNlcyB3aGVyZSBjaGFuZ2UgZGV0ZWN0aW9uIGhhcyB0byBydW4gZmlyc3QuIFRvIGRlYWwgd2l0aCB0aGlzLCB3ZSBzaW1wbHlcbiAgICAvLyB3YWl0IGZvciB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGVtcHR5LlxuICAgIGlmICh0aGlzLl9jb25maWcuYXV0b0ZvY3VzKSB7XG4gICAgICB0aGlzLl9mb2N1c1RyYXAuZm9jdXNJbml0aWFsRWxlbWVudFdoZW5SZWFkeSgpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NvbnRhaW5zRm9jdXMoKSkge1xuICAgICAgLy8gT3RoZXJ3aXNlIGVuc3VyZSB0aGF0IGZvY3VzIGlzIG9uIHRoZSBkaWFsb2cgY29udGFpbmVyLiBJdCdzIHBvc3NpYmxlIHRoYXQgYSBkaWZmZXJlbnRcbiAgICAgIC8vIGNvbXBvbmVudCB0cmllZCB0byBtb3ZlIGZvY3VzIHdoaWxlIHRoZSBvcGVuIGFuaW1hdGlvbiB3YXMgcnVubmluZy4gU2VlOlxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTYyMTUuIE5vdGUgdGhhdCB3ZSBvbmx5IHdhbnQgdG8gZG8gdGhpc1xuICAgICAgLy8gaWYgdGhlIGZvY3VzIGlzbid0IGluc2lkZSB0aGUgZGlhbG9nIGFscmVhZHksIGJlY2F1c2UgaXQncyBwb3NzaWJsZSB0aGF0IHRoZSBjb25zdW1lclxuICAgICAgLy8gdHVybmVkIG9mZiBgYXV0b0ZvY3VzYCBpbiBvcmRlciB0byBtb3ZlIGZvY3VzIHRoZW1zZWx2ZXMuXG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVzdG9yZXMgZm9jdXMgdG8gdGhlIGVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGRpYWxvZyBvcGVuZWQuICovXG4gIHByaXZhdGUgX3Jlc3RvcmVGb2N1cygpIHtcbiAgICBjb25zdCB0b0ZvY3VzID0gdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEaWFsb2dXYXNPcGVuZWQ7XG5cbiAgICAvLyBXZSBuZWVkIHRoZSBleHRyYSBjaGVjaywgYmVjYXVzZSBJRSBjYW4gc2V0IHRoZSBgYWN0aXZlRWxlbWVudGAgdG8gbnVsbCBpbiBzb21lIGNhc2VzLlxuICAgIGlmICh0aGlzLl9jb25maWcucmVzdG9yZUZvY3VzICYmIHRvRm9jdXMgJiYgdHlwZW9mIHRvRm9jdXMuZm9jdXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgZm9jdXMgaXMgc3RpbGwgaW5zaWRlIHRoZSBkaWFsb2cgb3IgaXMgb24gdGhlIGJvZHkgKHVzdWFsbHkgYmVjYXVzZSBhXG4gICAgICAvLyBub24tZm9jdXNhYmxlIGVsZW1lbnQgbGlrZSB0aGUgYmFja2Ryb3Agd2FzIGNsaWNrZWQpIGJlZm9yZSBtb3ZpbmcgaXQuIEl0J3MgcG9zc2libGUgdGhhdFxuICAgICAgLy8gdGhlIGNvbnN1bWVyIG1vdmVkIGl0IHRoZW1zZWx2ZXMgYmVmb3JlIHRoZSBhbmltYXRpb24gd2FzIGRvbmUsIGluIHdoaWNoIGNhc2Ugd2Ugc2hvdWxkbid0XG4gICAgICAvLyBkbyBhbnl0aGluZy5cbiAgICAgIGlmICghYWN0aXZlRWxlbWVudCB8fCBhY3RpdmVFbGVtZW50ID09PSB0aGlzLl9kb2N1bWVudC5ib2R5IHx8IGFjdGl2ZUVsZW1lbnQgPT09IGVsZW1lbnQgfHxcbiAgICAgICAgZWxlbWVudC5jb250YWlucyhhY3RpdmVFbGVtZW50KSkge1xuICAgICAgICB0b0ZvY3VzLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgdGhpcy5fZm9jdXNUcmFwLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB1cCB0aGUgZm9jdXMgdHJhbmQgYW5kIHNhdmVzIGEgcmVmZXJlbmNlIHRvIHRoZVxuICAgKiBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBkaWFsb2cgd2FzIG9wZW5lZC5cbiAgICovXG4gIHByaXZhdGUgX3NldHVwRm9jdXNUcmFwKCkge1xuICAgIGlmICghdGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICB0aGlzLl9mb2N1c1RyYXAgPSB0aGlzLl9mb2N1c1RyYXBGYWN0b3J5LmNyZWF0ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9kb2N1bWVudCkge1xuICAgICAgdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEaWFsb2dXYXNPcGVuZWQgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAvLyBOb3RlIHRoYXQgdGhlcmUgaXMgbm8gZm9jdXMgbWV0aG9kIHdoZW4gcmVuZGVyaW5nIG9uIHRoZSBzZXJ2ZXIuXG4gICAgICBpZiAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKSB7XG4gICAgICAgIC8vIE1vdmUgZm9jdXMgb250byB0aGUgZGlhbG9nIGltbWVkaWF0ZWx5IGluIG9yZGVyIHRvIHByZXZlbnQgdGhlIHVzZXIgZnJvbSBhY2NpZGVudGFsbHlcbiAgICAgICAgLy8gb3BlbmluZyBtdWx0aXBsZSBkaWFsb2dzIGF0IHRoZSBzYW1lIHRpbWUuIE5lZWRzIHRvIGJlIGFzeW5jLCBiZWNhdXNlIHRoZSBlbGVtZW50XG4gICAgICAgIC8vIG1heSBub3QgYmUgZm9jdXNhYmxlIGltbWVkaWF0ZWx5LlxuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogUmV0dXJucyB3aGV0aGVyIGZvY3VzIGlzIGluc2lkZSB0aGUgZGlhbG9nLiAqL1xuICBwcml2YXRlIF9jb250YWluc0ZvY3VzKCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgcmV0dXJuIGVsZW1lbnQgPT09IGFjdGl2ZUVsZW1lbnQgfHwgZWxlbWVudC5jb250YWlucyhhY3RpdmVFbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBDYWxsYmFjaywgaW52b2tlZCB3aGVuZXZlciBhbiBhbmltYXRpb24gb24gdGhlIGhvc3QgY29tcGxldGVzLiAqL1xuICBfb25BbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIGlmIChldmVudC50b1N0YXRlID09PSAnZW50ZXInKSB7XG4gICAgICB0aGlzLl90cmFwRm9jdXMoKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICdleGl0Jykge1xuICAgICAgdGhpcy5fcmVzdG9yZUZvY3VzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgLyoqIENhbGxiYWNrLCBpbnZva2VkIHdoZW4gYW4gYW5pbWF0aW9uIG9uIHRoZSBob3N0IHN0YXJ0cy4gKi9cbiAgX29uQW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgLyoqIFN0YXJ0cyB0aGUgZGlhbG9nIGV4aXQgYW5pbWF0aW9uLiAqL1xuICBfc3RhcnRFeGl0QW5pbWF0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMuX3N0YXRlID0gJ2V4aXQnO1xuXG4gICAgLy8gTWFyayB0aGUgY29udGFpbmVyIGZvciBjaGVjayBzbyBpdCBjYW4gcmVhY3QgaWYgdGhlXG4gICAgLy8gdmlldyBjb250YWluZXIgaXMgdXNpbmcgT25QdXNoIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbn1cbiJdfQ==