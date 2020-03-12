/**
 * @fileoverview added by tsickle
 * Generated from: src/material/snack-bar/snack-bar-container.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BasePortalOutlet, CdkPortalOutlet, } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild, ViewEncapsulation, } from '@angular/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { matSnackBarAnimations } from './snack-bar-animations';
import { MatSnackBarConfig } from './snack-bar-config';
/**
 * Internal component that wraps user-provided snack bar content.
 * \@docs-private
 */
export class MatSnackBarContainer extends BasePortalOutlet {
    /**
     * @param {?} _ngZone
     * @param {?} _elementRef
     * @param {?} _changeDetectorRef
     * @param {?} snackBarConfig
     */
    constructor(_ngZone, _elementRef, _changeDetectorRef, snackBarConfig) {
        super();
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this.snackBarConfig = snackBarConfig;
        /**
         * Whether the component has been destroyed.
         */
        this._destroyed = false;
        /**
         * Subject for notifying that the snack bar has exited from view.
         */
        this._onExit = new Subject();
        /**
         * Subject for notifying that the snack bar has finished entering the view.
         */
        this._onEnter = new Subject();
        /**
         * The state of the snack bar animations.
         */
        this._animationState = 'void';
        /**
         * Attaches a DOM portal to the snack bar container.
         * @deprecated To be turned into a method.
         * \@breaking-change 10.0.0
         */
        this.attachDomPortal = (/**
         * @param {?} portal
         * @return {?}
         */
        (portal) => {
            this._assertNotAttached();
            this._applySnackBarClasses();
            return this._portalOutlet.attachDomPortal(portal);
        });
        // Based on the ARIA spec, `alert` and `status` roles have an
        // implicit `assertive` and `polite` politeness respectively.
        if (snackBarConfig.politeness === 'assertive' && !snackBarConfig.announcementMessage) {
            this._role = 'alert';
        }
        else if (snackBarConfig.politeness === 'off') {
            this._role = null;
        }
        else {
            this._role = 'status';
        }
    }
    /**
     * Attach a component portal as content to this snack bar container.
     * @template T
     * @param {?} portal
     * @return {?}
     */
    attachComponentPortal(portal) {
        this._assertNotAttached();
        this._applySnackBarClasses();
        return this._portalOutlet.attachComponentPortal(portal);
    }
    /**
     * Attach a template portal as content to this snack bar container.
     * @template C
     * @param {?} portal
     * @return {?}
     */
    attachTemplatePortal(portal) {
        this._assertNotAttached();
        this._applySnackBarClasses();
        return this._portalOutlet.attachTemplatePortal(portal);
    }
    /**
     * Handle end of animations, updating the state of the snackbar.
     * @param {?} event
     * @return {?}
     */
    onAnimationEnd(event) {
        const { fromState, toState } = event;
        if ((toState === 'void' && fromState !== 'void') || toState === 'hidden') {
            this._completeExit();
        }
        if (toState === 'visible') {
            // Note: we shouldn't use `this` inside the zone callback,
            // because it can cause a memory leak.
            /** @type {?} */
            const onEnter = this._onEnter;
            this._ngZone.run((/**
             * @return {?}
             */
            () => {
                onEnter.next();
                onEnter.complete();
            }));
        }
    }
    /**
     * Begin animation of snack bar entrance into view.
     * @return {?}
     */
    enter() {
        if (!this._destroyed) {
            this._animationState = 'visible';
            this._changeDetectorRef.detectChanges();
        }
    }
    /**
     * Begin animation of the snack bar exiting from view.
     * @return {?}
     */
    exit() {
        // Note: this one transitions to `hidden`, rather than `void`, in order to handle the case
        // where multiple snack bars are opened in quick succession (e.g. two consecutive calls to
        // `MatSnackBar.open`).
        this._animationState = 'hidden';
        // Mark this element with an 'exit' attribute to indicate that the snackbar has
        // been dismissed and will soon be removed from the DOM. This is used by the snackbar
        // test harness.
        this._elementRef.nativeElement.setAttribute('mat-exit', '');
        return this._onExit;
    }
    /**
     * Makes sure the exit callbacks have been invoked when the element is destroyed.
     * @return {?}
     */
    ngOnDestroy() {
        this._destroyed = true;
        this._completeExit();
    }
    /**
     * Waits for the zone to settle before removing the element. Helps prevent
     * errors where we end up removing an element which is in the middle of an animation.
     * @private
     * @return {?}
     */
    _completeExit() {
        this._ngZone.onMicrotaskEmpty.asObservable().pipe(take(1)).subscribe((/**
         * @return {?}
         */
        () => {
            this._onExit.next();
            this._onExit.complete();
        }));
    }
    /**
     * Applies the various positioning and user-configured CSS classes to the snack bar.
     * @private
     * @return {?}
     */
    _applySnackBarClasses() {
        /** @type {?} */
        const element = this._elementRef.nativeElement;
        /** @type {?} */
        const panelClasses = this.snackBarConfig.panelClass;
        if (panelClasses) {
            if (Array.isArray(panelClasses)) {
                // Note that we can't use a spread here, because IE doesn't support multiple arguments.
                panelClasses.forEach((/**
                 * @param {?} cssClass
                 * @return {?}
                 */
                cssClass => element.classList.add(cssClass)));
            }
            else {
                element.classList.add(panelClasses);
            }
        }
        if (this.snackBarConfig.horizontalPosition === 'center') {
            element.classList.add('mat-snack-bar-center');
        }
        if (this.snackBarConfig.verticalPosition === 'top') {
            element.classList.add('mat-snack-bar-top');
        }
    }
    /**
     * Asserts that no content is already attached to the container.
     * @private
     * @return {?}
     */
    _assertNotAttached() {
        if (this._portalOutlet.hasAttached()) {
            throw Error('Attempting to attach snack bar content after content is already attached');
        }
    }
}
MatSnackBarContainer.decorators = [
    { type: Component, args: [{
                selector: 'snack-bar-container',
                template: "<ng-template cdkPortalOutlet></ng-template>\n",
                // In Ivy embedded views will be change detected from their declaration place, rather than
                // where they were stamped out. This means that we can't have the snack bar container be OnPush,
                // because it might cause snack bars that were opened from a template not to be out of date.
                // tslint:disable-next-line:validate-decorators
                changeDetection: ChangeDetectionStrategy.Default,
                encapsulation: ViewEncapsulation.None,
                animations: [matSnackBarAnimations.snackBarState],
                host: {
                    '[attr.role]': '_role',
                    'class': 'mat-snack-bar-container',
                    '[@state]': '_animationState',
                    '(@state.done)': 'onAnimationEnd($event)'
                },
                styles: [".mat-snack-bar-container{border-radius:4px;box-sizing:border-box;display:block;margin:24px;max-width:33vw;min-width:344px;padding:14px 16px;min-height:48px;transform-origin:center}.cdk-high-contrast-active .mat-snack-bar-container{border:solid 1px}.mat-snack-bar-handset{width:100%}.mat-snack-bar-handset .mat-snack-bar-container{margin:8px;max-width:100%;min-width:0;width:100%}\n"]
            }] }
];
/** @nocollapse */
MatSnackBarContainer.ctorParameters = () => [
    { type: NgZone },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: MatSnackBarConfig }
];
MatSnackBarContainer.propDecorators = {
    _portalOutlet: [{ type: ViewChild, args: [CdkPortalOutlet, { static: true },] }]
};
if (false) {
    /**
     * Whether the component has been destroyed.
     * @type {?}
     * @private
     */
    MatSnackBarContainer.prototype._destroyed;
    /**
     * The portal outlet inside of this container into which the snack bar content will be loaded.
     * @type {?}
     */
    MatSnackBarContainer.prototype._portalOutlet;
    /**
     * Subject for notifying that the snack bar has exited from view.
     * @type {?}
     */
    MatSnackBarContainer.prototype._onExit;
    /**
     * Subject for notifying that the snack bar has finished entering the view.
     * @type {?}
     */
    MatSnackBarContainer.prototype._onEnter;
    /**
     * The state of the snack bar animations.
     * @type {?}
     */
    MatSnackBarContainer.prototype._animationState;
    /**
     * ARIA role for the snack bar container.
     * @type {?}
     */
    MatSnackBarContainer.prototype._role;
    /**
     * Attaches a DOM portal to the snack bar container.
     * @deprecated To be turned into a method.
     * \@breaking-change 10.0.0
     * @type {?}
     */
    MatSnackBarContainer.prototype.attachDomPortal;
    /**
     * @type {?}
     * @private
     */
    MatSnackBarContainer.prototype._ngZone;
    /**
     * @type {?}
     * @private
     */
    MatSnackBarContainer.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatSnackBarContainer.prototype._changeDetectorRef;
    /**
     * The snack bar configuration.
     * @type {?}
     */
    MatSnackBarContainer.prototype.snackBarConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLWNvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFTQSxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGVBQWUsR0FJaEIsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBRVQsVUFBVSxFQUVWLE1BQU0sRUFFTixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBYSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3BDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzdELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDOzs7OztBQXlCckQsTUFBTSxPQUFPLG9CQUFxQixTQUFRLGdCQUFnQjs7Ozs7OztJQW1CeEQsWUFDVSxPQUFlLEVBQ2YsV0FBb0MsRUFDcEMsa0JBQXFDLEVBRXRDLGNBQWlDO1FBRXhDLEtBQUssRUFBRSxDQUFDO1FBTkEsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUNwQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBRXRDLG1CQUFjLEdBQWQsY0FBYyxDQUFtQjs7OztRQXRCbEMsZUFBVSxHQUFHLEtBQUssQ0FBQzs7OztRQU1sQixZQUFPLEdBQWlCLElBQUksT0FBTyxFQUFFLENBQUM7Ozs7UUFHdEMsYUFBUSxHQUFpQixJQUFJLE9BQU8sRUFBRSxDQUFDOzs7O1FBR2hELG9CQUFlLEdBQUcsTUFBTSxDQUFDOzs7Ozs7UUE0Q3pCLG9C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LEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsVUFBVSxFQUFFLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDO2dCQUNqRCxJQUFJLEVBQUU7b0JBQ0osYUFBYSxFQUFFLE9BQU87b0JBQ3RCLE9BQU8sRUFBRSx5QkFBeUI7b0JBQ2xDLFVBQVUsRUFBRSxpQkFBaUI7b0JBQzdCLGVBQWUsRUFBRSx3QkFBd0I7aUJBQzFDOzthQUNGOzs7O1lBaENDLE1BQU07WUFGTixVQUFVO1lBSFYsaUJBQWlCO1lBYVgsaUJBQWlCOzs7NEJBOEJ0QixTQUFTLFNBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQzs7Ozs7Ozs7SUFIMUMsMENBQTJCOzs7OztJQUczQiw2Q0FBMkU7Ozs7O0lBRzNFLHVDQUErQzs7Ozs7SUFHL0Msd0NBQWdEOzs7OztJQUdoRCwrQ0FBeUI7Ozs7O0lBR3pCLHFDQUFpQzs7Ozs7OztJQXlDakMsK0NBSUM7Ozs7O0lBMUNDLHVDQUF1Qjs7Ozs7SUFDdkIsMkNBQTRDOzs7OztJQUM1QyxrREFBNkM7Ozs7O0lBRTdDLDhDQUF3QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIEJhc2VQb3J0YWxPdXRsZXQsXG4gIENka1BvcnRhbE91dGxldCxcbiAgQ29tcG9uZW50UG9ydGFsLFxuICBUZW1wbGF0ZVBvcnRhbCxcbiAgRG9tUG9ydGFsLFxufSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHttYXRTbmFja0JhckFuaW1hdGlvbnN9IGZyb20gJy4vc25hY2stYmFyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRTbmFja0JhckNvbmZpZ30gZnJvbSAnLi9zbmFjay1iYXItY29uZmlnJztcblxuXG4vKipcbiAqIEludGVybmFsIGNvbXBvbmVudCB0aGF0IHdyYXBzIHVzZXItcHJvdmlkZWQgc25hY2sgYmFyIGNvbnRlbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3NuYWNrLWJhci1jb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJ3NuYWNrLWJhci1jb250YWluZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzbmFjay1iYXItY29udGFpbmVyLmNzcyddLFxuICAvLyBJbiBJdnkgZW1iZWRkZWQgdmlld3Mgd2lsbCBiZSBjaGFuZ2UgZGV0ZWN0ZWQgZnJvbSB0aGVpciBkZWNsYXJhdGlvbiBwbGFjZSwgcmF0aGVyIHRoYW5cbiAgLy8gd2hlcmUgdGhleSB3ZXJlIHN0YW1wZWQgb3V0LiBUaGlzIG1lYW5zIHRoYXQgd2UgY2FuJ3QgaGF2ZSB0aGUgc25hY2sgYmFyIGNvbnRhaW5lciBiZSBPblB1c2gsXG4gIC8vIGJlY2F1c2UgaXQgbWlnaHQgY2F1c2Ugc25hY2sgYmFycyB0aGF0IHdlcmUgb3BlbmVkIGZyb20gYSB0ZW1wbGF0ZSBub3QgdG8gYmUgb3V0IG9mIGRhdGUuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgYW5pbWF0aW9uczogW21hdFNuYWNrQmFyQW5pbWF0aW9ucy5zbmFja0JhclN0YXRlXSxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5yb2xlXSc6ICdfcm9sZScsXG4gICAgJ2NsYXNzJzogJ21hdC1zbmFjay1iYXItY29udGFpbmVyJyxcbiAgICAnW0BzdGF0ZV0nOiAnX2FuaW1hdGlvblN0YXRlJyxcbiAgICAnKEBzdGF0ZS5kb25lKSc6ICdvbkFuaW1hdGlvbkVuZCgkZXZlbnQpJ1xuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbmFja0JhckNvbnRhaW5lciBleHRlbmRzIEJhc2VQb3J0YWxPdXRsZXQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveWVkID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBwb3J0YWwgb3V0bGV0IGluc2lkZSBvZiB0aGlzIGNvbnRhaW5lciBpbnRvIHdoaWNoIHRoZSBzbmFjayBiYXIgY29udGVudCB3aWxsIGJlIGxvYWRlZC4gKi9cbiAgQFZpZXdDaGlsZChDZGtQb3J0YWxPdXRsZXQsIHtzdGF0aWM6IHRydWV9KSBfcG9ydGFsT3V0bGV0OiBDZGtQb3J0YWxPdXRsZXQ7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGF0IHRoZSBzbmFjayBiYXIgaGFzIGV4aXRlZCBmcm9tIHZpZXcuICovXG4gIHJlYWRvbmx5IF9vbkV4aXQ6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGF0IHRoZSBzbmFjayBiYXIgaGFzIGZpbmlzaGVkIGVudGVyaW5nIHRoZSB2aWV3LiAqL1xuICByZWFkb25seSBfb25FbnRlcjogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTtcblxuICAvKiogVGhlIHN0YXRlIG9mIHRoZSBzbmFjayBiYXIgYW5pbWF0aW9ucy4gKi9cbiAgX2FuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuXG4gIC8qKiBBUklBIHJvbGUgZm9yIHRoZSBzbmFjayBiYXIgY29udGFpbmVyLiAqL1xuICBfcm9sZTogJ2FsZXJ0JyB8ICdzdGF0dXMnIHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgLyoqIFRoZSBzbmFjayBiYXIgY29uZmlndXJhdGlvbi4gKi9cbiAgICBwdWJsaWMgc25hY2tCYXJDb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnKSB7XG5cbiAgICBzdXBlcigpO1xuXG4gICAgLy8gQmFzZWQgb24gdGhlIEFSSUEgc3BlYywgYGFsZXJ0YCBhbmQgYHN0YXR1c2Agcm9sZXMgaGF2ZSBhblxuICAgIC8vIGltcGxpY2l0IGBhc3NlcnRpdmVgIGFuZCBgcG9saXRlYCBwb2xpdGVuZXNzIHJlc3BlY3RpdmVseS5cbiAgICBpZiAoc25hY2tCYXJDb25maWcucG9saXRlbmVzcyA9PT0gJ2Fzc2VydGl2ZScgJiYgIXNuYWNrQmFyQ29uZmlnLmFubm91bmNlbWVudE1lc3NhZ2UpIHtcbiAgICAgIHRoaXMuX3JvbGUgPSAnYWxlcnQnO1xuICAgIH0gZWxzZSBpZiAoc25hY2tCYXJDb25maWcucG9saXRlbmVzcyA9PT0gJ29mZicpIHtcbiAgICAgIHRoaXMuX3JvbGUgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yb2xlID0gJ3N0YXR1cyc7XG4gICAgfVxuICB9XG5cbiAgLyoqIEF0dGFjaCBhIGNvbXBvbmVudCBwb3J0YWwgYXMgY29udGVudCB0byB0aGlzIHNuYWNrIGJhciBjb250YWluZXIuICovXG4gIGF0dGFjaENvbXBvbmVudFBvcnRhbDxUPihwb3J0YWw6IENvbXBvbmVudFBvcnRhbDxUPik6IENvbXBvbmVudFJlZjxUPiB7XG4gICAgdGhpcy5fYXNzZXJ0Tm90QXR0YWNoZWQoKTtcbiAgICB0aGlzLl9hcHBseVNuYWNrQmFyQ2xhc3NlcygpO1xuICAgIHJldHVybiB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoQ29tcG9uZW50UG9ydGFsKHBvcnRhbCk7XG4gIH1cblxuICAvKiogQXR0YWNoIGEgdGVtcGxhdGUgcG9ydGFsIGFzIGNvbnRlbnQgdG8gdGhpcyBzbmFjayBiYXIgY29udGFpbmVyLiAqL1xuICBhdHRhY2hUZW1wbGF0ZVBvcnRhbDxDPihwb3J0YWw6IFRlbXBsYXRlUG9ydGFsPEM+KTogRW1iZWRkZWRWaWV3UmVmPEM+IHtcbiAgICB0aGlzLl9hc3NlcnROb3RBdHRhY2hlZCgpO1xuICAgIHRoaXMuX2FwcGx5U25hY2tCYXJDbGFzc2VzKCk7XG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hUZW1wbGF0ZVBvcnRhbChwb3J0YWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIGEgRE9NIHBvcnRhbCB0byB0aGUgc25hY2sgYmFyIGNvbnRhaW5lci5cbiAgICogQGRlcHJlY2F0ZWQgVG8gYmUgdHVybmVkIGludG8gYSBtZXRob2QuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAqL1xuICBhdHRhY2hEb21Qb3J0YWwgPSAocG9ydGFsOiBEb21Qb3J0YWwpID0+IHtcbiAgICB0aGlzLl9hc3NlcnROb3RBdHRhY2hlZCgpO1xuICAgIHRoaXMuX2FwcGx5U25hY2tCYXJDbGFzc2VzKCk7XG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hEb21Qb3J0YWwocG9ydGFsKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGUgZW5kIG9mIGFuaW1hdGlvbnMsIHVwZGF0aW5nIHRoZSBzdGF0ZSBvZiB0aGUgc25hY2tiYXIuICovXG4gIG9uQW5pbWF0aW9uRW5kKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIGNvbnN0IHtmcm9tU3RhdGUsIHRvU3RhdGV9ID0gZXZlbnQ7XG5cbiAgICBpZiAoKHRvU3RhdGUgPT09ICd2b2lkJyAmJiBmcm9tU3RhdGUgIT09ICd2b2lkJykgfHwgdG9TdGF0ZSA9PT0gJ2hpZGRlbicpIHtcbiAgICAgIHRoaXMuX2NvbXBsZXRlRXhpdCgpO1xuICAgIH1cblxuICAgIGlmICh0b1N0YXRlID09PSAndmlzaWJsZScpIHtcbiAgICAgIC8vIE5vdGU6IHdlIHNob3VsZG4ndCB1c2UgYHRoaXNgIGluc2lkZSB0aGUgem9uZSBjYWxsYmFjayxcbiAgICAgIC8vIGJlY2F1c2UgaXQgY2FuIGNhdXNlIGEgbWVtb3J5IGxlYWsuXG4gICAgICBjb25zdCBvbkVudGVyID0gdGhpcy5fb25FbnRlcjtcblxuICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIG9uRW50ZXIubmV4dCgpO1xuICAgICAgICBvbkVudGVyLmNvbXBsZXRlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogQmVnaW4gYW5pbWF0aW9uIG9mIHNuYWNrIGJhciBlbnRyYW5jZSBpbnRvIHZpZXcuICovXG4gIGVudGVyKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fZGVzdHJveWVkKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9ICd2aXNpYmxlJztcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQmVnaW4gYW5pbWF0aW9uIG9mIHRoZSBzbmFjayBiYXIgZXhpdGluZyBmcm9tIHZpZXcuICovXG4gIGV4aXQoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgLy8gTm90ZTogdGhpcyBvbmUgdHJhbnNpdGlvbnMgdG8gYGhpZGRlbmAsIHJhdGhlciB0aGFuIGB2b2lkYCwgaW4gb3JkZXIgdG8gaGFuZGxlIHRoZSBjYXNlXG4gICAgLy8gd2hlcmUgbXVsdGlwbGUgc25hY2sgYmFycyBhcmUgb3BlbmVkIGluIHF1aWNrIHN1Y2Nlc3Npb24gKGUuZy4gdHdvIGNvbnNlY3V0aXZlIGNhbGxzIHRvXG4gICAgLy8gYE1hdFNuYWNrQmFyLm9wZW5gKS5cbiAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9ICdoaWRkZW4nO1xuXG4gICAgLy8gTWFyayB0aGlzIGVsZW1lbnQgd2l0aCBhbiAnZXhpdCcgYXR0cmlidXRlIHRvIGluZGljYXRlIHRoYXQgdGhlIHNuYWNrYmFyIGhhc1xuICAgIC8vIGJlZW4gZGlzbWlzc2VkIGFuZCB3aWxsIHNvb24gYmUgcmVtb3ZlZCBmcm9tIHRoZSBET00uIFRoaXMgaXMgdXNlZCBieSB0aGUgc25hY2tiYXJcbiAgICAvLyB0ZXN0IGhhcm5lc3MuXG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnbWF0LWV4aXQnLCAnJyk7XG5cbiAgICByZXR1cm4gdGhpcy5fb25FeGl0O1xuICB9XG5cbiAgLyoqIE1ha2VzIHN1cmUgdGhlIGV4aXQgY2FsbGJhY2tzIGhhdmUgYmVlbiBpbnZva2VkIHdoZW4gdGhlIGVsZW1lbnQgaXMgZGVzdHJveWVkLiAqL1xuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuX2NvbXBsZXRlRXhpdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhaXRzIGZvciB0aGUgem9uZSB0byBzZXR0bGUgYmVmb3JlIHJlbW92aW5nIHRoZSBlbGVtZW50LiBIZWxwcyBwcmV2ZW50XG4gICAqIGVycm9ycyB3aGVyZSB3ZSBlbmQgdXAgcmVtb3ZpbmcgYW4gZWxlbWVudCB3aGljaCBpcyBpbiB0aGUgbWlkZGxlIG9mIGFuIGFuaW1hdGlvbi5cbiAgICovXG4gIHByaXZhdGUgX2NvbXBsZXRlRXhpdCgpIHtcbiAgICB0aGlzLl9uZ1pvbmUub25NaWNyb3Rhc2tFbXB0eS5hc09ic2VydmFibGUoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9vbkV4aXQubmV4dCgpO1xuICAgICAgdGhpcy5fb25FeGl0LmNvbXBsZXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQXBwbGllcyB0aGUgdmFyaW91cyBwb3NpdGlvbmluZyBhbmQgdXNlci1jb25maWd1cmVkIENTUyBjbGFzc2VzIHRvIHRoZSBzbmFjayBiYXIuICovXG4gIHByaXZhdGUgX2FwcGx5U25hY2tCYXJDbGFzc2VzKCkge1xuICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IHBhbmVsQ2xhc3NlcyA9IHRoaXMuc25hY2tCYXJDb25maWcucGFuZWxDbGFzcztcblxuICAgIGlmIChwYW5lbENsYXNzZXMpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhbmVsQ2xhc3NlcykpIHtcbiAgICAgICAgLy8gTm90ZSB0aGF0IHdlIGNhbid0IHVzZSBhIHNwcmVhZCBoZXJlLCBiZWNhdXNlIElFIGRvZXNuJ3Qgc3VwcG9ydCBtdWx0aXBsZSBhcmd1bWVudHMuXG4gICAgICAgIHBhbmVsQ2xhc3Nlcy5mb3JFYWNoKGNzc0NsYXNzID0+IGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjc3NDbGFzcykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHBhbmVsQ2xhc3Nlcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc25hY2tCYXJDb25maWcuaG9yaXpvbnRhbFBvc2l0aW9uID09PSAnY2VudGVyJykge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtc25hY2stYmFyLWNlbnRlcicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNuYWNrQmFyQ29uZmlnLnZlcnRpY2FsUG9zaXRpb24gPT09ICd0b3AnKSB7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1zbmFjay1iYXItdG9wJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEFzc2VydHMgdGhhdCBubyBjb250ZW50IGlzIGFscmVhZHkgYXR0YWNoZWQgdG8gdGhlIGNvbnRhaW5lci4gKi9cbiAgcHJpdmF0ZSBfYXNzZXJ0Tm90QXR0YWNoZWQoKSB7XG4gICAgaWYgKHRoaXMuX3BvcnRhbE91dGxldC5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aHJvdyBFcnJvcignQXR0ZW1wdGluZyB0byBhdHRhY2ggc25hY2sgYmFyIGNvbnRlbnQgYWZ0ZXIgY29udGVudCBpcyBhbHJlYWR5IGF0dGFjaGVkJyk7XG4gICAgfVxuICB9XG59XG4iXX0=