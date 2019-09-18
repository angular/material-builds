/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ViewChild, ElementRef, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, EventEmitter, Inject, Optional, } from '@angular/core';
import { BasePortalOutlet, CdkPortalOutlet, } from '@angular/cdk/portal';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatBottomSheetConfig } from './bottom-sheet-config';
import { matBottomSheetAnimations } from './bottom-sheet-animations';
import { DOCUMENT } from '@angular/common';
import { FocusTrapFactory } from '@angular/cdk/a11y';
// TODO(crisbeto): consolidate some logic between this, MatDialog and MatSnackBar
/**
 * Internal component that wraps user-provided bottom sheet content.
 * \@docs-private
 */
export class MatBottomSheetContainer extends BasePortalOutlet {
    /**
     * @param {?} _elementRef
     * @param {?} _changeDetectorRef
     * @param {?} _focusTrapFactory
     * @param {?} breakpointObserver
     * @param {?} document
     * @param {?} bottomSheetConfig
     */
    constructor(_elementRef, _changeDetectorRef, _focusTrapFactory, breakpointObserver, document, bottomSheetConfig) {
        super();
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._focusTrapFactory = _focusTrapFactory;
        this.bottomSheetConfig = bottomSheetConfig;
        /**
         * The state of the bottom sheet animations.
         */
        this._animationState = 'void';
        /**
         * Emits whenever the state of the animation changes.
         */
        this._animationStateChanged = new EventEmitter();
        /**
         * Element that was focused before the bottom sheet was opened.
         */
        this._elementFocusedBeforeOpened = null;
        this._document = document;
        this._breakpointSubscription = breakpointObserver
            .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
            .subscribe((/**
         * @return {?}
         */
        () => {
            this._toggleClass('mat-bottom-sheet-container-medium', breakpointObserver.isMatched(Breakpoints.Medium));
            this._toggleClass('mat-bottom-sheet-container-large', breakpointObserver.isMatched(Breakpoints.Large));
            this._toggleClass('mat-bottom-sheet-container-xlarge', breakpointObserver.isMatched(Breakpoints.XLarge));
        }));
    }
    /**
     * Attach a component portal as content to this bottom sheet container.
     * @template T
     * @param {?} portal
     * @return {?}
     */
    attachComponentPortal(portal) {
        this._validatePortalAttached();
        this._setPanelClass();
        this._savePreviouslyFocusedElement();
        return this._portalOutlet.attachComponentPortal(portal);
    }
    /**
     * Attach a template portal as content to this bottom sheet container.
     * @template C
     * @param {?} portal
     * @return {?}
     */
    attachTemplatePortal(portal) {
        this._validatePortalAttached();
        this._setPanelClass();
        this._savePreviouslyFocusedElement();
        return this._portalOutlet.attachTemplatePortal(portal);
    }
    /**
     * Begin animation of bottom sheet entrance into view.
     * @return {?}
     */
    enter() {
        if (!this._destroyed) {
            this._animationState = 'visible';
            this._changeDetectorRef.detectChanges();
        }
    }
    /**
     * Begin animation of the bottom sheet exiting from view.
     * @return {?}
     */
    exit() {
        if (!this._destroyed) {
            this._animationState = 'hidden';
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._breakpointSubscription.unsubscribe();
        this._destroyed = true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onAnimationDone(event) {
        if (event.toState === 'hidden') {
            this._restoreFocus();
        }
        else if (event.toState === 'visible') {
            this._trapFocus();
        }
        this._animationStateChanged.emit(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onAnimationStart(event) {
        this._animationStateChanged.emit(event);
    }
    /**
     * @private
     * @param {?} cssClass
     * @param {?} add
     * @return {?}
     */
    _toggleClass(cssClass, add) {
        /** @type {?} */
        const classList = this._elementRef.nativeElement.classList;
        add ? classList.add(cssClass) : classList.remove(cssClass);
    }
    /**
     * @private
     * @return {?}
     */
    _validatePortalAttached() {
        if (this._portalOutlet.hasAttached()) {
            throw Error('Attempting to attach bottom sheet content after content is already attached');
        }
    }
    /**
     * @private
     * @return {?}
     */
    _setPanelClass() {
        /** @type {?} */
        const element = this._elementRef.nativeElement;
        /** @type {?} */
        const panelClass = this.bottomSheetConfig.panelClass;
        if (Array.isArray(panelClass)) {
            // Note that we can't use a spread here, because IE doesn't support multiple arguments.
            panelClass.forEach((/**
             * @param {?} cssClass
             * @return {?}
             */
            cssClass => element.classList.add(cssClass)));
        }
        else if (panelClass) {
            element.classList.add(panelClass);
        }
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
        if (this.bottomSheetConfig.autoFocus) {
            this._focusTrap.focusInitialElementWhenReady();
        }
        else {
            /** @type {?} */
            const activeElement = this._document.activeElement;
            // Otherwise ensure that focus is on the container. It's possible that a different
            // component tried to move focus while the open animation was running. See:
            // https://github.com/angular/components/issues/16215. Note that we only want to do this
            // if the focus isn't inside the bottom sheet already, because it's possible that the
            // consumer turned off `autoFocus` in order to move focus themselves.
            if (activeElement !== element && !element.contains(activeElement)) {
                element.focus();
            }
        }
    }
    /**
     * Restores focus to the element that was focused before the bottom sheet was opened.
     * @private
     * @return {?}
     */
    _restoreFocus() {
        /** @type {?} */
        const toFocus = this._elementFocusedBeforeOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (this.bottomSheetConfig.restoreFocus && toFocus && typeof toFocus.focus === 'function') {
            toFocus.focus();
        }
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    }
    /**
     * Saves a reference to the element that was focused before the bottom sheet was opened.
     * @private
     * @return {?}
     */
    _savePreviouslyFocusedElement() {
        this._elementFocusedBeforeOpened = (/** @type {?} */ (this._document.activeElement));
        // The `focus` method isn't available during server-side rendering.
        if (this._elementRef.nativeElement.focus) {
            Promise.resolve().then((/**
             * @return {?}
             */
            () => this._elementRef.nativeElement.focus()));
        }
    }
}
MatBottomSheetContainer.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-bottom-sheet-container',
                template: "<ng-template cdkPortalOutlet></ng-template>\r\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                animations: [matBottomSheetAnimations.bottomSheetState],
                host: {
                    'class': 'mat-bottom-sheet-container',
                    'tabindex': '-1',
                    'role': 'dialog',
                    'aria-modal': 'true',
                    '[attr.aria-label]': 'bottomSheetConfig?.ariaLabel',
                    '[@state]': '_animationState',
                    '(@state.start)': '_onAnimationStart($event)',
                    '(@state.done)': '_onAnimationDone($event)'
                },
                styles: [".mat-bottom-sheet-container{padding:8px 16px;min-width:100vw;box-sizing:border-box;display:block;outline:0;max-height:80vh;overflow:auto}@media(-ms-high-contrast: active){.mat-bottom-sheet-container{outline:1px solid}}.mat-bottom-sheet-container-xlarge,.mat-bottom-sheet-container-large,.mat-bottom-sheet-container-medium{border-top-left-radius:4px;border-top-right-radius:4px}.mat-bottom-sheet-container-medium{min-width:384px;max-width:calc(100vw - 128px)}.mat-bottom-sheet-container-large{min-width:512px;max-width:calc(100vw - 256px)}.mat-bottom-sheet-container-xlarge{min-width:576px;max-width:calc(100vw - 384px)}/*# sourceMappingURL=bottom-sheet-container.css.map */\n"]
            }] }
];
/** @nocollapse */
MatBottomSheetContainer.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: FocusTrapFactory },
    { type: BreakpointObserver },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: MatBottomSheetConfig }
];
MatBottomSheetContainer.propDecorators = {
    _portalOutlet: [{ type: ViewChild, args: [CdkPortalOutlet, { static: true },] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatBottomSheetContainer.prototype._breakpointSubscription;
    /**
     * The portal outlet inside of this container into which the content will be loaded.
     * @type {?}
     */
    MatBottomSheetContainer.prototype._portalOutlet;
    /**
     * The state of the bottom sheet animations.
     * @type {?}
     */
    MatBottomSheetContainer.prototype._animationState;
    /**
     * Emits whenever the state of the animation changes.
     * @type {?}
     */
    MatBottomSheetContainer.prototype._animationStateChanged;
    /**
     * The class that traps and manages focus within the bottom sheet.
     * @type {?}
     * @private
     */
    MatBottomSheetContainer.prototype._focusTrap;
    /**
     * Element that was focused before the bottom sheet was opened.
     * @type {?}
     * @private
     */
    MatBottomSheetContainer.prototype._elementFocusedBeforeOpened;
    /**
     * Server-side rendering-compatible reference to the global document object.
     * @type {?}
     * @private
     */
    MatBottomSheetContainer.prototype._document;
    /**
     * Whether the component has been destroyed.
     * @type {?}
     * @private
     */
    MatBottomSheetContainer.prototype._destroyed;
    /**
     * @type {?}
     * @private
     */
    MatBottomSheetContainer.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatBottomSheetContainer.prototype._changeDetectorRef;
    /**
     * @type {?}
     * @private
     */
    MatBottomSheetContainer.prototype._focusTrapFactory;
    /**
     * The bottom sheet configuration.
     * @type {?}
     */
    MatBottomSheetContainer.prototype.bottomSheetConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LWNvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFDTCxTQUFTLEVBR1QsU0FBUyxFQUVULFVBQVUsRUFDVix1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLGlCQUFpQixFQUNqQixZQUFZLEVBQ1osTUFBTSxFQUNOLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsZ0JBQWdCLEVBR2hCLGVBQWUsR0FDaEIsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQUMsa0JBQWtCLEVBQUUsV0FBVyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDcEUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFFbkUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBWSxnQkFBZ0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7QUEyQjlELE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxnQkFBZ0I7Ozs7Ozs7OztJQXdCM0QsWUFDVSxXQUFvQyxFQUNwQyxrQkFBcUMsRUFDckMsaUJBQW1DLEVBQzNDLGtCQUFzQyxFQUNSLFFBQWEsRUFFcEMsaUJBQXVDO1FBQzlDLEtBQUssRUFBRSxDQUFDO1FBUEEsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ3BDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDckMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUlwQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQXNCOzs7O1FBeEJoRCxvQkFBZSxHQUFrQyxNQUFN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QUFDO2dCQUN2RCxJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLDRCQUE0QjtvQkFDckMsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLE1BQU0sRUFBRSxRQUFRO29CQUNoQixZQUFZLEVBQUUsTUFBTTtvQkFDcEIsbUJBQW1CLEVBQUUsOEJBQThCO29CQUNuRCxVQUFVLEVBQUUsaUJBQWlCO29CQUM3QixnQkFBZ0IsRUFBRSwyQkFBMkI7b0JBQzdDLGVBQWUsRUFBRSwwQkFBMEI7aUJBQzVDOzthQUNGOzs7O1lBOUNDLFVBQVU7WUFHVixpQkFBaUI7WUFpQkEsZ0JBQWdCO1lBTDNCLGtCQUFrQjs0Q0E2RHJCLFFBQVEsWUFBSSxNQUFNLFNBQUMsUUFBUTtZQTVEeEIsb0JBQW9COzs7NEJBbUN6QixTQUFTLFNBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQzs7Ozs7OztJQUgxQywwREFBOEM7Ozs7O0lBRzlDLGdEQUEyRTs7Ozs7SUFHM0Usa0RBQXdEOzs7OztJQUd4RCx5REFBNEQ7Ozs7OztJQUc1RCw2Q0FBOEI7Ozs7OztJQUc5Qiw4REFBK0Q7Ozs7OztJQUcvRCw0Q0FBNEI7Ozs7OztJQUc1Qiw2Q0FBNEI7Ozs7O0lBRzFCLDhDQUE0Qzs7Ozs7SUFDNUMscURBQTZDOzs7OztJQUM3QyxvREFBMkM7Ozs7O0lBSTNDLG9EQUE4QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBWaWV3Q2hpbGQsXG4gIE9uRGVzdHJveSxcbiAgRWxlbWVudFJlZixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIE9wdGlvbmFsLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgQmFzZVBvcnRhbE91dGxldCxcbiAgQ29tcG9uZW50UG9ydGFsLFxuICBUZW1wbGF0ZVBvcnRhbCxcbiAgQ2RrUG9ydGFsT3V0bGV0LFxufSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7QnJlYWtwb2ludE9ic2VydmVyLCBCcmVha3BvaW50c30gZnJvbSAnQGFuZ3VsYXIvY2RrL2xheW91dCc7XG5pbXBvcnQge01hdEJvdHRvbVNoZWV0Q29uZmlnfSBmcm9tICcuL2JvdHRvbS1zaGVldC1jb25maWcnO1xuaW1wb3J0IHttYXRCb3R0b21TaGVldEFuaW1hdGlvbnN9IGZyb20gJy4vYm90dG9tLXNoZWV0LWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7Rm9jdXNUcmFwLCBGb2N1c1RyYXBGYWN0b3J5fSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5cbi8vIFRPRE8oY3Jpc2JldG8pOiBjb25zb2xpZGF0ZSBzb21lIGxvZ2ljIGJldHdlZW4gdGhpcywgTWF0RGlhbG9nIGFuZCBNYXRTbmFja0JhclxuXG4vKipcbiAqIEludGVybmFsIGNvbXBvbmVudCB0aGF0IHdyYXBzIHVzZXItcHJvdmlkZWQgYm90dG9tIHNoZWV0IGNvbnRlbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC1ib3R0b20tc2hlZXQtY29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICdib3R0b20tc2hlZXQtY29udGFpbmVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnYm90dG9tLXNoZWV0LWNvbnRhaW5lci5jc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGFuaW1hdGlvbnM6IFttYXRCb3R0b21TaGVldEFuaW1hdGlvbnMuYm90dG9tU2hlZXRTdGF0ZV0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWJvdHRvbS1zaGVldC1jb250YWluZXInLFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ3JvbGUnOiAnZGlhbG9nJyxcbiAgICAnYXJpYS1tb2RhbCc6ICd0cnVlJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnYm90dG9tU2hlZXRDb25maWc/LmFyaWFMYWJlbCcsXG4gICAgJ1tAc3RhdGVdJzogJ19hbmltYXRpb25TdGF0ZScsXG4gICAgJyhAc3RhdGUuc3RhcnQpJzogJ19vbkFuaW1hdGlvblN0YXJ0KCRldmVudCknLFxuICAgICcoQHN0YXRlLmRvbmUpJzogJ19vbkFuaW1hdGlvbkRvbmUoJGV2ZW50KSdcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Qm90dG9tU2hlZXRDb250YWluZXIgZXh0ZW5kcyBCYXNlUG9ydGFsT3V0bGV0IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfYnJlYWtwb2ludFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKiBUaGUgcG9ydGFsIG91dGxldCBpbnNpZGUgb2YgdGhpcyBjb250YWluZXIgaW50byB3aGljaCB0aGUgY29udGVudCB3aWxsIGJlIGxvYWRlZC4gKi9cbiAgQFZpZXdDaGlsZChDZGtQb3J0YWxPdXRsZXQsIHtzdGF0aWM6IHRydWV9KSBfcG9ydGFsT3V0bGV0OiBDZGtQb3J0YWxPdXRsZXQ7XG5cbiAgLyoqIFRoZSBzdGF0ZSBvZiB0aGUgYm90dG9tIHNoZWV0IGFuaW1hdGlvbnMuICovXG4gIF9hbmltYXRpb25TdGF0ZTogJ3ZvaWQnIHwgJ3Zpc2libGUnIHwgJ2hpZGRlbicgPSAndm9pZCc7XG5cbiAgLyoqIEVtaXRzIHdoZW5ldmVyIHRoZSBzdGF0ZSBvZiB0aGUgYW5pbWF0aW9uIGNoYW5nZXMuICovXG4gIF9hbmltYXRpb25TdGF0ZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBUaGUgY2xhc3MgdGhhdCB0cmFwcyBhbmQgbWFuYWdlcyBmb2N1cyB3aXRoaW4gdGhlIGJvdHRvbSBzaGVldC4gKi9cbiAgcHJpdmF0ZSBfZm9jdXNUcmFwOiBGb2N1c1RyYXA7XG5cbiAgLyoqIEVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGJvdHRvbSBzaGVldCB3YXMgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9lbGVtZW50Rm9jdXNlZEJlZm9yZU9wZW5lZDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAvKiogU2VydmVyLXNpZGUgcmVuZGVyaW5nLWNvbXBhdGlibGUgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgZG9jdW1lbnQgb2JqZWN0LiAqL1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3llZDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfZm9jdXNUcmFwRmFjdG9yeTogRm9jdXNUcmFwRmFjdG9yeSxcbiAgICBicmVha3BvaW50T2JzZXJ2ZXI6IEJyZWFrcG9pbnRPYnNlcnZlcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIC8qKiBUaGUgYm90dG9tIHNoZWV0IGNvbmZpZ3VyYXRpb24uICovXG4gICAgcHVibGljIGJvdHRvbVNoZWV0Q29uZmlnOiBNYXRCb3R0b21TaGVldENvbmZpZykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuICAgIHRoaXMuX2JyZWFrcG9pbnRTdWJzY3JpcHRpb24gPSBicmVha3BvaW50T2JzZXJ2ZXJcbiAgICAgIC5vYnNlcnZlKFtCcmVha3BvaW50cy5NZWRpdW0sIEJyZWFrcG9pbnRzLkxhcmdlLCBCcmVha3BvaW50cy5YTGFyZ2VdKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3RvZ2dsZUNsYXNzKCdtYXQtYm90dG9tLXNoZWV0LWNvbnRhaW5lci1tZWRpdW0nLFxuICAgICAgICAgICAgYnJlYWtwb2ludE9ic2VydmVyLmlzTWF0Y2hlZChCcmVha3BvaW50cy5NZWRpdW0pKTtcbiAgICAgICAgdGhpcy5fdG9nZ2xlQ2xhc3MoJ21hdC1ib3R0b20tc2hlZXQtY29udGFpbmVyLWxhcmdlJyxcbiAgICAgICAgICAgIGJyZWFrcG9pbnRPYnNlcnZlci5pc01hdGNoZWQoQnJlYWtwb2ludHMuTGFyZ2UpKTtcbiAgICAgICAgdGhpcy5fdG9nZ2xlQ2xhc3MoJ21hdC1ib3R0b20tc2hlZXQtY29udGFpbmVyLXhsYXJnZScsXG4gICAgICAgICAgICBicmVha3BvaW50T2JzZXJ2ZXIuaXNNYXRjaGVkKEJyZWFrcG9pbnRzLlhMYXJnZSkpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKiogQXR0YWNoIGEgY29tcG9uZW50IHBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMgYm90dG9tIHNoZWV0IGNvbnRhaW5lci4gKi9cbiAgYXR0YWNoQ29tcG9uZW50UG9ydGFsPFQ+KHBvcnRhbDogQ29tcG9uZW50UG9ydGFsPFQ+KTogQ29tcG9uZW50UmVmPFQ+IHtcbiAgICB0aGlzLl92YWxpZGF0ZVBvcnRhbEF0dGFjaGVkKCk7XG4gICAgdGhpcy5fc2V0UGFuZWxDbGFzcygpO1xuICAgIHRoaXMuX3NhdmVQcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQoKTtcbiAgICByZXR1cm4gdGhpcy5fcG9ydGFsT3V0bGV0LmF0dGFjaENvbXBvbmVudFBvcnRhbChwb3J0YWwpO1xuICB9XG5cbiAgLyoqIEF0dGFjaCBhIHRlbXBsYXRlIHBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMgYm90dG9tIHNoZWV0IGNvbnRhaW5lci4gKi9cbiAgYXR0YWNoVGVtcGxhdGVQb3J0YWw8Qz4ocG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxDPik6IEVtYmVkZGVkVmlld1JlZjxDPiB7XG4gICAgdGhpcy5fdmFsaWRhdGVQb3J0YWxBdHRhY2hlZCgpO1xuICAgIHRoaXMuX3NldFBhbmVsQ2xhc3MoKTtcbiAgICB0aGlzLl9zYXZlUHJldmlvdXNseUZvY3VzZWRFbGVtZW50KCk7XG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hUZW1wbGF0ZVBvcnRhbChwb3J0YWwpO1xuICB9XG5cbiAgLyoqIEJlZ2luIGFuaW1hdGlvbiBvZiBib3R0b20gc2hlZXQgZW50cmFuY2UgaW50byB2aWV3LiAqL1xuICBlbnRlcigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2Rlc3Ryb3llZCkge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSAndmlzaWJsZSc7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEJlZ2luIGFuaW1hdGlvbiBvZiB0aGUgYm90dG9tIHNoZWV0IGV4aXRpbmcgZnJvbSB2aWV3LiAqL1xuICBleGl0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fZGVzdHJveWVkKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9ICdoaWRkZW4nO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fYnJlYWtwb2ludFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG4gIH1cblxuICBfb25BbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIGlmIChldmVudC50b1N0YXRlID09PSAnaGlkZGVuJykge1xuICAgICAgdGhpcy5fcmVzdG9yZUZvY3VzKCk7XG4gICAgfSBlbHNlIGlmIChldmVudC50b1N0YXRlID09PSAndmlzaWJsZScpIHtcbiAgICAgIHRoaXMuX3RyYXBGb2N1cygpO1xuICAgIH1cblxuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIF9vbkFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgX3RvZ2dsZUNsYXNzKGNzc0NsYXNzOiBzdHJpbmcsIGFkZDogYm9vbGVhbikge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgYWRkID8gY2xhc3NMaXN0LmFkZChjc3NDbGFzcykgOiBjbGFzc0xpc3QucmVtb3ZlKGNzc0NsYXNzKTtcbiAgfVxuXG4gIHByaXZhdGUgX3ZhbGlkYXRlUG9ydGFsQXR0YWNoZWQoKSB7XG4gICAgaWYgKHRoaXMuX3BvcnRhbE91dGxldC5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aHJvdyBFcnJvcignQXR0ZW1wdGluZyB0byBhdHRhY2ggYm90dG9tIHNoZWV0IGNvbnRlbnQgYWZ0ZXIgY29udGVudCBpcyBhbHJlYWR5IGF0dGFjaGVkJyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2V0UGFuZWxDbGFzcygpIHtcbiAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBwYW5lbENsYXNzID0gdGhpcy5ib3R0b21TaGVldENvbmZpZy5wYW5lbENsYXNzO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGFuZWxDbGFzcykpIHtcbiAgICAgIC8vIE5vdGUgdGhhdCB3ZSBjYW4ndCB1c2UgYSBzcHJlYWQgaGVyZSwgYmVjYXVzZSBJRSBkb2Vzbid0IHN1cHBvcnQgbXVsdGlwbGUgYXJndW1lbnRzLlxuICAgICAgcGFuZWxDbGFzcy5mb3JFYWNoKGNzc0NsYXNzID0+IGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjc3NDbGFzcykpO1xuICAgIH0gZWxzZSBpZiAocGFuZWxDbGFzcykge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHBhbmVsQ2xhc3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBNb3ZlcyB0aGUgZm9jdXMgaW5zaWRlIHRoZSBmb2N1cyB0cmFwLiAqL1xuICBwcml2YXRlIF90cmFwRm9jdXMoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGlmICghdGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICB0aGlzLl9mb2N1c1RyYXAgPSB0aGlzLl9mb2N1c1RyYXBGYWN0b3J5LmNyZWF0ZShlbGVtZW50KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ib3R0b21TaGVldENvbmZpZy5hdXRvRm9jdXMpIHtcbiAgICAgIHRoaXMuX2ZvY3VzVHJhcC5mb2N1c0luaXRpYWxFbGVtZW50V2hlblJlYWR5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgICAvLyBPdGhlcndpc2UgZW5zdXJlIHRoYXQgZm9jdXMgaXMgb24gdGhlIGNvbnRhaW5lci4gSXQncyBwb3NzaWJsZSB0aGF0IGEgZGlmZmVyZW50XG4gICAgICAvLyBjb21wb25lbnQgdHJpZWQgdG8gbW92ZSBmb2N1cyB3aGlsZSB0aGUgb3BlbiBhbmltYXRpb24gd2FzIHJ1bm5pbmcuIFNlZTpcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzE2MjE1LiBOb3RlIHRoYXQgd2Ugb25seSB3YW50IHRvIGRvIHRoaXNcbiAgICAgIC8vIGlmIHRoZSBmb2N1cyBpc24ndCBpbnNpZGUgdGhlIGJvdHRvbSBzaGVldCBhbHJlYWR5LCBiZWNhdXNlIGl0J3MgcG9zc2libGUgdGhhdCB0aGVcbiAgICAgIC8vIGNvbnN1bWVyIHR1cm5lZCBvZmYgYGF1dG9Gb2N1c2AgaW4gb3JkZXIgdG8gbW92ZSBmb2N1cyB0aGVtc2VsdmVzLlxuICAgICAgaWYgKGFjdGl2ZUVsZW1lbnQgIT09IGVsZW1lbnQgJiYgIWVsZW1lbnQuY29udGFpbnMoYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXN0b3JlcyBmb2N1cyB0byB0aGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgYm90dG9tIHNoZWV0IHdhcyBvcGVuZWQuICovXG4gIHByaXZhdGUgX3Jlc3RvcmVGb2N1cygpIHtcbiAgICBjb25zdCB0b0ZvY3VzID0gdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVPcGVuZWQ7XG5cbiAgICAvLyBXZSBuZWVkIHRoZSBleHRyYSBjaGVjaywgYmVjYXVzZSBJRSBjYW4gc2V0IHRoZSBgYWN0aXZlRWxlbWVudGAgdG8gbnVsbCBpbiBzb21lIGNhc2VzLlxuICAgIGlmICh0aGlzLmJvdHRvbVNoZWV0Q29uZmlnLnJlc3RvcmVGb2N1cyAmJiB0b0ZvY3VzICYmIHR5cGVvZiB0b0ZvY3VzLmZvY3VzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0b0ZvY3VzLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgdGhpcy5fZm9jdXNUcmFwLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICAvKiogU2F2ZXMgYSByZWZlcmVuY2UgdG8gdGhlIGVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGJvdHRvbSBzaGVldCB3YXMgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9zYXZlUHJldmlvdXNseUZvY3VzZWRFbGVtZW50KCkge1xuICAgIHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlT3BlbmVkID0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcblxuICAgIC8vIFRoZSBgZm9jdXNgIG1ldGhvZCBpc24ndCBhdmFpbGFibGUgZHVyaW5nIHNlcnZlci1zaWRlIHJlbmRlcmluZy5cbiAgICBpZiAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKSB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==