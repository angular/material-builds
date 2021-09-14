/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { coerceArray } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { BasePortalOutlet, CdkPortalOutlet, } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, NgZone, Optional, ViewChild, ViewEncapsulation, } from '@angular/core';
import { matBottomSheetAnimations } from './bottom-sheet-animations';
import { MatBottomSheetConfig } from './bottom-sheet-config';
// TODO(crisbeto): consolidate some logic between this, MatDialog and MatSnackBar
/**
 * Internal component that wraps user-provided bottom sheet content.
 * @docs-private
 */
export class MatBottomSheetContainer extends BasePortalOutlet {
    constructor(_elementRef, _changeDetectorRef, _focusTrapFactory, _interactivityChecker, _ngZone, breakpointObserver, document, 
    /** The bottom sheet configuration. */
    bottomSheetConfig) {
        super();
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._interactivityChecker = _interactivityChecker;
        this._ngZone = _ngZone;
        this.bottomSheetConfig = bottomSheetConfig;
        /** The state of the bottom sheet animations. */
        this._animationState = 'void';
        /** Emits whenever the state of the animation changes. */
        this._animationStateChanged = new EventEmitter();
        /** Element that was focused before the bottom sheet was opened. */
        this._elementFocusedBeforeOpened = null;
        /**
         * Attaches a DOM portal to the bottom sheet container.
         * @deprecated To be turned into a method.
         * @breaking-change 10.0.0
         */
        this.attachDomPortal = (portal) => {
            this._validatePortalAttached();
            this._setPanelClass();
            this._savePreviouslyFocusedElement();
            return this._portalOutlet.attachDomPortal(portal);
        };
        this._document = document;
        this._breakpointSubscription = breakpointObserver
            .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
            .subscribe(() => {
            this._toggleClass('mat-bottom-sheet-container-medium', breakpointObserver.isMatched(Breakpoints.Medium));
            this._toggleClass('mat-bottom-sheet-container-large', breakpointObserver.isMatched(Breakpoints.Large));
            this._toggleClass('mat-bottom-sheet-container-xlarge', breakpointObserver.isMatched(Breakpoints.XLarge));
        });
    }
    /** Attach a component portal as content to this bottom sheet container. */
    attachComponentPortal(portal) {
        this._validatePortalAttached();
        this._setPanelClass();
        this._savePreviouslyFocusedElement();
        return this._portalOutlet.attachComponentPortal(portal);
    }
    /** Attach a template portal as content to this bottom sheet container. */
    attachTemplatePortal(portal) {
        this._validatePortalAttached();
        this._setPanelClass();
        this._savePreviouslyFocusedElement();
        return this._portalOutlet.attachTemplatePortal(portal);
    }
    /** Begin animation of bottom sheet entrance into view. */
    enter() {
        if (!this._destroyed) {
            this._animationState = 'visible';
            this._changeDetectorRef.detectChanges();
        }
    }
    /** Begin animation of the bottom sheet exiting from view. */
    exit() {
        if (!this._destroyed) {
            this._animationState = 'hidden';
            this._changeDetectorRef.markForCheck();
        }
    }
    ngOnDestroy() {
        this._breakpointSubscription.unsubscribe();
        this._destroyed = true;
    }
    _onAnimationDone(event) {
        if (event.toState === 'hidden') {
            this._restoreFocus();
        }
        else if (event.toState === 'visible') {
            this._trapFocus();
        }
        this._animationStateChanged.emit(event);
    }
    _onAnimationStart(event) {
        this._animationStateChanged.emit(event);
    }
    _toggleClass(cssClass, add) {
        this._elementRef.nativeElement.classList.toggle(cssClass, add);
    }
    _validatePortalAttached() {
        if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('Attempting to attach bottom sheet content after content is already attached');
        }
    }
    _setPanelClass() {
        const element = this._elementRef.nativeElement;
        element.classList.add(...coerceArray(this.bottomSheetConfig.panelClass || []));
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
     * Moves the focus inside the focus trap. When autoFocus is not set to 'bottom-sheet',
     * if focus cannot be moved then focus will go to the bottom sheet container.
     */
    _trapFocus() {
        const element = this._elementRef.nativeElement;
        if (!this._focusTrap) {
            this._focusTrap = this._focusTrapFactory.create(element);
        }
        // If were to attempt to focus immediately, then the content of the bottom sheet would not
        // yet be ready in instances where change detection has to run first. To deal with this,
        // we simply wait for the microtask queue to be empty when setting focus when autoFocus
        // isn't set to bottom sheet. If the element inside the bottom sheet can't be focused,
        // then the container is focused so the user can't tab into other elements behind it.
        switch (this.bottomSheetConfig.autoFocus) {
            case false:
            case 'dialog':
                const activeElement = _getFocusedElementPierceShadowDom();
                // Ensure that focus is on the bottom sheet container. It's possible that a different
                // component tried to move focus while the open animation was running. See:
                // https://github.com/angular/components/issues/16215. Note that we only want to do this
                // if the focus isn't inside the bottom sheet already, because it's possible that the
                // consumer specified `autoFocus` in order to move focus themselves.
                if (activeElement !== element && !element.contains(activeElement)) {
                    element.focus();
                }
                break;
            case true:
            case 'first-tabbable':
                this._focusTrap.focusInitialElementWhenReady();
                break;
            case 'first-heading':
                this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');
                break;
            default:
                this._focusByCssSelector(this.bottomSheetConfig.autoFocus);
                break;
        }
    }
    /** Restores focus to the element that was focused before the bottom sheet was opened. */
    _restoreFocus() {
        const toFocus = this._elementFocusedBeforeOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (this.bottomSheetConfig.restoreFocus && toFocus && typeof toFocus.focus === 'function') {
            const activeElement = _getFocusedElementPierceShadowDom();
            const element = this._elementRef.nativeElement;
            // Make sure that focus is still inside the bottom sheet or is on the body (usually because a
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
    /** Saves a reference to the element that was focused before the bottom sheet was opened. */
    _savePreviouslyFocusedElement() {
        this._elementFocusedBeforeOpened = _getFocusedElementPierceShadowDom();
        // The `focus` method isn't available during server-side rendering.
        if (this._elementRef.nativeElement.focus) {
            Promise.resolve().then(() => this._elementRef.nativeElement.focus());
        }
    }
}
MatBottomSheetContainer.decorators = [
    { type: Component, args: [{
                selector: 'mat-bottom-sheet-container',
                template: "<ng-template cdkPortalOutlet></ng-template>\r\n",
                // In Ivy embedded views will be change detected from their declaration place, rather than where
                // they were stamped out. This means that we can't have the bottom sheet container be OnPush,
                // because it might cause the sheets that were opened from a template not to be out of date.
                // tslint:disable-next-line:validate-decorators
                changeDetection: ChangeDetectionStrategy.Default,
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
                styles: [".mat-bottom-sheet-container{padding:8px 16px;min-width:100vw;box-sizing:border-box;display:block;outline:0;max-height:80vh;overflow:auto}.cdk-high-contrast-active .mat-bottom-sheet-container{outline:1px solid}.mat-bottom-sheet-container-xlarge,.mat-bottom-sheet-container-large,.mat-bottom-sheet-container-medium{border-top-left-radius:4px;border-top-right-radius:4px}.mat-bottom-sheet-container-medium{min-width:384px;max-width:calc(100vw - 128px)}.mat-bottom-sheet-container-large{min-width:512px;max-width:calc(100vw - 256px)}.mat-bottom-sheet-container-xlarge{min-width:576px;max-width:calc(100vw - 384px)}\n"]
            },] }
];
MatBottomSheetContainer.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: FocusTrapFactory },
    { type: InteractivityChecker },
    { type: NgZone },
    { type: BreakpointObserver },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: MatBottomSheetConfig }
];
MatBottomSheetContainer.propDecorators = {
    _portalOutlet: [{ type: ViewChild, args: [CdkPortalOutlet, { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LWNvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEVBQVksZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGtCQUFrQixFQUFFLFdBQVcsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3BFLE9BQU8sRUFBQyxpQ0FBaUMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hFLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsZUFBZSxHQUloQixNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBRVQsVUFBVSxFQUVWLFlBQVksRUFDWixNQUFNLEVBQ04sTUFBTSxFQUVOLFFBQVEsRUFDUixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ25FLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTNELGlGQUFpRjtBQUVqRjs7O0dBR0c7QUF1QkgsTUFBTSxPQUFPLHVCQUF3QixTQUFRLGdCQUFnQjtJQXdCM0QsWUFDVSxXQUFvQyxFQUNwQyxrQkFBcUMsRUFDckMsaUJBQW1DLEVBQzFCLHFCQUEyQyxFQUMzQyxPQUFlLEVBQ2hDLGtCQUFzQyxFQUNSLFFBQWE7SUFDM0Msc0NBQXNDO0lBQy9CLGlCQUF1QztRQUM5QyxL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OztZQXpDQyxVQUFVO1lBSFYsaUJBQWlCO1lBZEEsZ0JBQWdCO1lBQUUsb0JBQW9CO1lBcUJ2RCxNQUFNO1lBbkJBLGtCQUFrQjs0Q0F3RnJCLFFBQVEsWUFBSSxNQUFNLFNBQUMsUUFBUTtZQTdEeEIsb0JBQW9COzs7NEJBa0N6QixTQUFTLFNBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7Rm9jdXNUcmFwLCBGb2N1c1RyYXBGYWN0b3J5LCBJbnRlcmFjdGl2aXR5Q2hlY2tlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtjb2VyY2VBcnJheX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7QnJlYWtwb2ludE9ic2VydmVyLCBCcmVha3BvaW50c30gZnJvbSAnQGFuZ3VsYXIvY2RrL2xheW91dCc7XG5pbXBvcnQge19nZXRGb2N1c2VkRWxlbWVudFBpZXJjZVNoYWRvd0RvbX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7XG4gIEJhc2VQb3J0YWxPdXRsZXQsXG4gIENka1BvcnRhbE91dGxldCxcbiAgQ29tcG9uZW50UG9ydGFsLFxuICBEb21Qb3J0YWwsXG4gIFRlbXBsYXRlUG9ydGFsLFxufSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50UmVmLFxuICBFbGVtZW50UmVmLFxuICBFbWJlZGRlZFZpZXdSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXRCb3R0b21TaGVldEFuaW1hdGlvbnN9IGZyb20gJy4vYm90dG9tLXNoZWV0LWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRCb3R0b21TaGVldENvbmZpZ30gZnJvbSAnLi9ib3R0b20tc2hlZXQtY29uZmlnJztcblxuLy8gVE9ETyhjcmlzYmV0byk6IGNvbnNvbGlkYXRlIHNvbWUgbG9naWMgYmV0d2VlbiB0aGlzLCBNYXREaWFsb2cgYW5kIE1hdFNuYWNrQmFyXG5cbi8qKlxuICogSW50ZXJuYWwgY29tcG9uZW50IHRoYXQgd3JhcHMgdXNlci1wcm92aWRlZCBib3R0b20gc2hlZXQgY29udGVudC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWJvdHRvbS1zaGVldC1jb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJ2JvdHRvbS1zaGVldC1jb250YWluZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydib3R0b20tc2hlZXQtY29udGFpbmVyLmNzcyddLFxuICAvLyBJbiBJdnkgZW1iZWRkZWQgdmlld3Mgd2lsbCBiZSBjaGFuZ2UgZGV0ZWN0ZWQgZnJvbSB0aGVpciBkZWNsYXJhdGlvbiBwbGFjZSwgcmF0aGVyIHRoYW4gd2hlcmVcbiAgLy8gdGhleSB3ZXJlIHN0YW1wZWQgb3V0LiBUaGlzIG1lYW5zIHRoYXQgd2UgY2FuJ3QgaGF2ZSB0aGUgYm90dG9tIHNoZWV0IGNvbnRhaW5lciBiZSBPblB1c2gsXG4gIC8vIGJlY2F1c2UgaXQgbWlnaHQgY2F1c2UgdGhlIHNoZWV0cyB0aGF0IHdlcmUgb3BlbmVkIGZyb20gYSB0ZW1wbGF0ZSBub3QgdG8gYmUgb3V0IG9mIGRhdGUuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgYW5pbWF0aW9uczogW21hdEJvdHRvbVNoZWV0QW5pbWF0aW9ucy5ib3R0b21TaGVldFN0YXRlXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtYm90dG9tLXNoZWV0LWNvbnRhaW5lcicsXG4gICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAncm9sZSc6ICdkaWFsb2cnLFxuICAgICdhcmlhLW1vZGFsJzogJ3RydWUnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdib3R0b21TaGVldENvbmZpZz8uYXJpYUxhYmVsJyxcbiAgICAnW0BzdGF0ZV0nOiAnX2FuaW1hdGlvblN0YXRlJyxcbiAgICAnKEBzdGF0ZS5zdGFydCknOiAnX29uQW5pbWF0aW9uU3RhcnQoJGV2ZW50KScsXG4gICAgJyhAc3RhdGUuZG9uZSknOiAnX29uQW5pbWF0aW9uRG9uZSgkZXZlbnQpJ1xuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCb3R0b21TaGVldENvbnRhaW5lciBleHRlbmRzIEJhc2VQb3J0YWxPdXRsZXQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9icmVha3BvaW50U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqIFRoZSBwb3J0YWwgb3V0bGV0IGluc2lkZSBvZiB0aGlzIGNvbnRhaW5lciBpbnRvIHdoaWNoIHRoZSBjb250ZW50IHdpbGwgYmUgbG9hZGVkLiAqL1xuICBAVmlld0NoaWxkKENka1BvcnRhbE91dGxldCwge3N0YXRpYzogdHJ1ZX0pIF9wb3J0YWxPdXRsZXQ6IENka1BvcnRhbE91dGxldDtcblxuICAvKiogVGhlIHN0YXRlIG9mIHRoZSBib3R0b20gc2hlZXQgYW5pbWF0aW9ucy4gKi9cbiAgX2FuaW1hdGlvblN0YXRlOiAndm9pZCcgfCAndmlzaWJsZScgfCAnaGlkZGVuJyA9ICd2b2lkJztcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIHN0YXRlIG9mIHRoZSBhbmltYXRpb24gY2hhbmdlcy4gKi9cbiAgX2FuaW1hdGlvblN0YXRlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8QW5pbWF0aW9uRXZlbnQ+KCk7XG5cbiAgLyoqIFRoZSBjbGFzcyB0aGF0IHRyYXBzIGFuZCBtYW5hZ2VzIGZvY3VzIHdpdGhpbiB0aGUgYm90dG9tIHNoZWV0LiAqL1xuICBwcml2YXRlIF9mb2N1c1RyYXA6IEZvY3VzVHJhcDtcblxuICAvKiogRWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgYm90dG9tIHNoZWV0IHdhcyBvcGVuZWQuICovXG4gIHByaXZhdGUgX2VsZW1lbnRGb2N1c2VkQmVmb3JlT3BlbmVkOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBTZXJ2ZXItc2lkZSByZW5kZXJpbmctY29tcGF0aWJsZSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBkb2N1bWVudCBvYmplY3QuICovXG4gIHByaXZhdGUgX2RvY3VtZW50OiBEb2N1bWVudDtcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveWVkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9mb2N1c1RyYXBGYWN0b3J5OiBGb2N1c1RyYXBGYWN0b3J5LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ludGVyYWN0aXZpdHlDaGVja2VyOiBJbnRlcmFjdGl2aXR5Q2hlY2tlcixcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBicmVha3BvaW50T2JzZXJ2ZXI6IEJyZWFrcG9pbnRPYnNlcnZlcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIC8qKiBUaGUgYm90dG9tIHNoZWV0IGNvbmZpZ3VyYXRpb24uICovXG4gICAgcHVibGljIGJvdHRvbVNoZWV0Q29uZmlnOiBNYXRCb3R0b21TaGVldENvbmZpZykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuICAgIHRoaXMuX2JyZWFrcG9pbnRTdWJzY3JpcHRpb24gPSBicmVha3BvaW50T2JzZXJ2ZXJcbiAgICAgIC5vYnNlcnZlKFtCcmVha3BvaW50cy5NZWRpdW0sIEJyZWFrcG9pbnRzLkxhcmdlLCBCcmVha3BvaW50cy5YTGFyZ2VdKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3RvZ2dsZUNsYXNzKCdtYXQtYm90dG9tLXNoZWV0LWNvbnRhaW5lci1tZWRpdW0nLFxuICAgICAgICAgICAgYnJlYWtwb2ludE9ic2VydmVyLmlzTWF0Y2hlZChCcmVha3BvaW50cy5NZWRpdW0pKTtcbiAgICAgICAgdGhpcy5fdG9nZ2xlQ2xhc3MoJ21hdC1ib3R0b20tc2hlZXQtY29udGFpbmVyLWxhcmdlJyxcbiAgICAgICAgICAgIGJyZWFrcG9pbnRPYnNlcnZlci5pc01hdGNoZWQoQnJlYWtwb2ludHMuTGFyZ2UpKTtcbiAgICAgICAgdGhpcy5fdG9nZ2xlQ2xhc3MoJ21hdC1ib3R0b20tc2hlZXQtY29udGFpbmVyLXhsYXJnZScsXG4gICAgICAgICAgICBicmVha3BvaW50T2JzZXJ2ZXIuaXNNYXRjaGVkKEJyZWFrcG9pbnRzLlhMYXJnZSkpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKiogQXR0YWNoIGEgY29tcG9uZW50IHBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMgYm90dG9tIHNoZWV0IGNvbnRhaW5lci4gKi9cbiAgYXR0YWNoQ29tcG9uZW50UG9ydGFsPFQ+KHBvcnRhbDogQ29tcG9uZW50UG9ydGFsPFQ+KTogQ29tcG9uZW50UmVmPFQ+IHtcbiAgICB0aGlzLl92YWxpZGF0ZVBvcnRhbEF0dGFjaGVkKCk7XG4gICAgdGhpcy5fc2V0UGFuZWxDbGFzcygpO1xuICAgIHRoaXMuX3NhdmVQcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQoKTtcbiAgICByZXR1cm4gdGhpcy5fcG9ydGFsT3V0bGV0LmF0dGFjaENvbXBvbmVudFBvcnRhbChwb3J0YWwpO1xuICB9XG5cbiAgLyoqIEF0dGFjaCBhIHRlbXBsYXRlIHBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMgYm90dG9tIHNoZWV0IGNvbnRhaW5lci4gKi9cbiAgYXR0YWNoVGVtcGxhdGVQb3J0YWw8Qz4ocG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxDPik6IEVtYmVkZGVkVmlld1JlZjxDPiB7XG4gICAgdGhpcy5fdmFsaWRhdGVQb3J0YWxBdHRhY2hlZCgpO1xuICAgIHRoaXMuX3NldFBhbmVsQ2xhc3MoKTtcbiAgICB0aGlzLl9zYXZlUHJldmlvdXNseUZvY3VzZWRFbGVtZW50KCk7XG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hUZW1wbGF0ZVBvcnRhbChwb3J0YWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIGEgRE9NIHBvcnRhbCB0byB0aGUgYm90dG9tIHNoZWV0IGNvbnRhaW5lci5cbiAgICogQGRlcHJlY2F0ZWQgVG8gYmUgdHVybmVkIGludG8gYSBtZXRob2QuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAqL1xuICBvdmVycmlkZSBhdHRhY2hEb21Qb3J0YWwgPSAocG9ydGFsOiBEb21Qb3J0YWwpID0+IHtcbiAgICB0aGlzLl92YWxpZGF0ZVBvcnRhbEF0dGFjaGVkKCk7XG4gICAgdGhpcy5fc2V0UGFuZWxDbGFzcygpO1xuICAgIHRoaXMuX3NhdmVQcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQoKTtcbiAgICByZXR1cm4gdGhpcy5fcG9ydGFsT3V0bGV0LmF0dGFjaERvbVBvcnRhbChwb3J0YWwpO1xuICB9XG5cbiAgLyoqIEJlZ2luIGFuaW1hdGlvbiBvZiBib3R0b20gc2hlZXQgZW50cmFuY2UgaW50byB2aWV3LiAqL1xuICBlbnRlcigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2Rlc3Ryb3llZCkge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSAndmlzaWJsZSc7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEJlZ2luIGFuaW1hdGlvbiBvZiB0aGUgYm90dG9tIHNoZWV0IGV4aXRpbmcgZnJvbSB2aWV3LiAqL1xuICBleGl0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fZGVzdHJveWVkKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9ICdoaWRkZW4nO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fYnJlYWtwb2ludFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG4gIH1cblxuICBfb25BbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIGlmIChldmVudC50b1N0YXRlID09PSAnaGlkZGVuJykge1xuICAgICAgdGhpcy5fcmVzdG9yZUZvY3VzKCk7XG4gICAgfSBlbHNlIGlmIChldmVudC50b1N0YXRlID09PSAndmlzaWJsZScpIHtcbiAgICAgIHRoaXMuX3RyYXBGb2N1cygpO1xuICAgIH1cblxuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIF9vbkFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgX3RvZ2dsZUNsYXNzKGNzc0NsYXNzOiBzdHJpbmcsIGFkZDogYm9vbGVhbikge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKGNzc0NsYXNzLCBhZGQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdmFsaWRhdGVQb3J0YWxBdHRhY2hlZCgpIHtcbiAgICBpZiAodGhpcy5fcG9ydGFsT3V0bGV0Lmhhc0F0dGFjaGVkKCkgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IEVycm9yKCdBdHRlbXB0aW5nIHRvIGF0dGFjaCBib3R0b20gc2hlZXQgY29udGVudCBhZnRlciBjb250ZW50IGlzIGFscmVhZHkgYXR0YWNoZWQnKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zZXRQYW5lbENsYXNzKCkge1xuICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCguLi5jb2VyY2VBcnJheSh0aGlzLmJvdHRvbVNoZWV0Q29uZmlnLnBhbmVsQ2xhc3MgfHwgW10pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBwcm92aWRlZCBlbGVtZW50LiBJZiB0aGUgZWxlbWVudCBpcyBub3QgZm9jdXNhYmxlLCBpdCB3aWxsIGFkZCBhIHRhYkluZGV4XG4gICAqIGF0dHJpYnV0ZSB0byBmb3JjZWZ1bGx5IGZvY3VzIGl0LiBUaGUgYXR0cmlidXRlIGlzIHJlbW92ZWQgYWZ0ZXIgZm9jdXMgaXMgbW92ZWQuXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGZvY3VzLlxuICAgKi9cbiAgcHJpdmF0ZSBfZm9yY2VGb2N1cyhlbGVtZW50OiBIVE1MRWxlbWVudCwgb3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIGlmICghdGhpcy5faW50ZXJhY3Rpdml0eUNoZWNrZXIuaXNGb2N1c2FibGUoZWxlbWVudCkpIHtcbiAgICAgIGVsZW1lbnQudGFiSW5kZXggPSAtMTtcbiAgICAgIC8vIFRoZSB0YWJpbmRleCBhdHRyaWJ1dGUgc2hvdWxkIGJlIHJlbW92ZWQgdG8gYXZvaWQgbmF2aWdhdGluZyB0byB0aGF0IGVsZW1lbnQgYWdhaW5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpKTtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW4gc2VsZWN0b3Igd2l0aGluIHRoZSBmb2N1cyB0cmFwLlxuICAgKiBAcGFyYW0gc2VsZWN0b3IgVGhlIENTUyBzZWxlY3RvciBmb3IgdGhlIGVsZW1lbnQgdG8gc2V0IGZvY3VzIHRvLlxuICAgKi9cbiAgcHJpdmF0ZSBfZm9jdXNCeUNzc1NlbGVjdG9yKHNlbGVjdG9yOiBzdHJpbmcsIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICBsZXQgZWxlbWVudFRvRm9jdXMgPVxuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAoZWxlbWVudFRvRm9jdXMpIHtcbiAgICAgIHRoaXMuX2ZvcmNlRm9jdXMoZWxlbWVudFRvRm9jdXMsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgZm9jdXMgaW5zaWRlIHRoZSBmb2N1cyB0cmFwLiBXaGVuIGF1dG9Gb2N1cyBpcyBub3Qgc2V0IHRvICdib3R0b20tc2hlZXQnLFxuICAgKiBpZiBmb2N1cyBjYW5ub3QgYmUgbW92ZWQgdGhlbiBmb2N1cyB3aWxsIGdvIHRvIHRoZSBib3R0b20gc2hlZXQgY29udGFpbmVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfdHJhcEZvY3VzKCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAoIXRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgdGhpcy5fZm9jdXNUcmFwID0gdGhpcy5fZm9jdXNUcmFwRmFjdG9yeS5jcmVhdGUoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLy8gSWYgd2VyZSB0byBhdHRlbXB0IHRvIGZvY3VzIGltbWVkaWF0ZWx5LCB0aGVuIHRoZSBjb250ZW50IG9mIHRoZSBib3R0b20gc2hlZXQgd291bGQgbm90XG4gICAgLy8geWV0IGJlIHJlYWR5IGluIGluc3RhbmNlcyB3aGVyZSBjaGFuZ2UgZGV0ZWN0aW9uIGhhcyB0byBydW4gZmlyc3QuIFRvIGRlYWwgd2l0aCB0aGlzLFxuICAgIC8vIHdlIHNpbXBseSB3YWl0IGZvciB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGVtcHR5IHdoZW4gc2V0dGluZyBmb2N1cyB3aGVuIGF1dG9Gb2N1c1xuICAgIC8vIGlzbid0IHNldCB0byBib3R0b20gc2hlZXQuIElmIHRoZSBlbGVtZW50IGluc2lkZSB0aGUgYm90dG9tIHNoZWV0IGNhbid0IGJlIGZvY3VzZWQsXG4gICAgLy8gdGhlbiB0aGUgY29udGFpbmVyIGlzIGZvY3VzZWQgc28gdGhlIHVzZXIgY2FuJ3QgdGFiIGludG8gb3RoZXIgZWxlbWVudHMgYmVoaW5kIGl0LlxuICAgIHN3aXRjaCAodGhpcy5ib3R0b21TaGVldENvbmZpZy5hdXRvRm9jdXMpIHtcbiAgICAgIGNhc2UgZmFsc2U6XG4gICAgICBjYXNlICdkaWFsb2cnOlxuICAgICAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gX2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tKCk7XG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IGZvY3VzIGlzIG9uIHRoZSBib3R0b20gc2hlZXQgY29udGFpbmVyLiBJdCdzIHBvc3NpYmxlIHRoYXQgYSBkaWZmZXJlbnRcbiAgICAgICAgLy8gY29tcG9uZW50IHRyaWVkIHRvIG1vdmUgZm9jdXMgd2hpbGUgdGhlIG9wZW4gYW5pbWF0aW9uIHdhcyBydW5uaW5nLiBTZWU6XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzE2MjE1LiBOb3RlIHRoYXQgd2Ugb25seSB3YW50IHRvIGRvIHRoaXNcbiAgICAgICAgLy8gaWYgdGhlIGZvY3VzIGlzbid0IGluc2lkZSB0aGUgYm90dG9tIHNoZWV0IGFscmVhZHksIGJlY2F1c2UgaXQncyBwb3NzaWJsZSB0aGF0IHRoZVxuICAgICAgICAvLyBjb25zdW1lciBzcGVjaWZpZWQgYGF1dG9Gb2N1c2AgaW4gb3JkZXIgdG8gbW92ZSBmb2N1cyB0aGVtc2VsdmVzLlxuICAgICAgICBpZiAoYWN0aXZlRWxlbWVudCAhPT0gZWxlbWVudCAmJiAhZWxlbWVudC5jb250YWlucyhhY3RpdmVFbGVtZW50KSkge1xuICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgIGNhc2UgJ2ZpcnN0LXRhYmJhYmxlJzpcbiAgICAgICAgdGhpcy5fZm9jdXNUcmFwLmZvY3VzSW5pdGlhbEVsZW1lbnRXaGVuUmVhZHkoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmaXJzdC1oZWFkaW5nJzpcbiAgICAgICAgdGhpcy5fZm9jdXNCeUNzc1NlbGVjdG9yKCdoMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBbcm9sZT1cImhlYWRpbmdcIl0nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl9mb2N1c0J5Q3NzU2VsZWN0b3IodGhpcy5ib3R0b21TaGVldENvbmZpZy5hdXRvRm9jdXMhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlc3RvcmVzIGZvY3VzIHRvIHRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBib3R0b20gc2hlZXQgd2FzIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfcmVzdG9yZUZvY3VzKCkge1xuICAgIGNvbnN0IHRvRm9jdXMgPSB0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZU9wZW5lZDtcblxuICAgIC8vIFdlIG5lZWQgdGhlIGV4dHJhIGNoZWNrLCBiZWNhdXNlIElFIGNhbiBzZXQgdGhlIGBhY3RpdmVFbGVtZW50YCB0byBudWxsIGluIHNvbWUgY2FzZXMuXG4gICAgaWYgKHRoaXMuYm90dG9tU2hlZXRDb25maWcucmVzdG9yZUZvY3VzICYmIHRvRm9jdXMgJiYgdHlwZW9mIHRvRm9jdXMuZm9jdXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSBfZ2V0Rm9jdXNlZEVsZW1lbnRQaWVyY2VTaGFkb3dEb20oKTtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IGZvY3VzIGlzIHN0aWxsIGluc2lkZSB0aGUgYm90dG9tIHNoZWV0IG9yIGlzIG9uIHRoZSBib2R5ICh1c3VhbGx5IGJlY2F1c2UgYVxuICAgICAgLy8gbm9uLWZvY3VzYWJsZSBlbGVtZW50IGxpa2UgdGhlIGJhY2tkcm9wIHdhcyBjbGlja2VkKSBiZWZvcmUgbW92aW5nIGl0LiBJdCdzIHBvc3NpYmxlIHRoYXRcbiAgICAgIC8vIHRoZSBjb25zdW1lciBtb3ZlZCBpdCB0aGVtc2VsdmVzIGJlZm9yZSB0aGUgYW5pbWF0aW9uIHdhcyBkb25lLCBpbiB3aGljaCBjYXNlIHdlIHNob3VsZG4ndFxuICAgICAgLy8gZG8gYW55dGhpbmcuXG4gICAgICBpZiAoIWFjdGl2ZUVsZW1lbnQgfHwgYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5fZG9jdW1lbnQuYm9keSB8fCBhY3RpdmVFbGVtZW50ID09PSBlbGVtZW50IHx8XG4gICAgICAgIGVsZW1lbnQuY29udGFpbnMoYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgdG9Gb2N1cy5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9mb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX2ZvY3VzVHJhcC5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNhdmVzIGEgcmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBib3R0b20gc2hlZXQgd2FzIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfc2F2ZVByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCgpIHtcbiAgICB0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZU9wZW5lZCA9IF9nZXRGb2N1c2VkRWxlbWVudFBpZXJjZVNoYWRvd0RvbSgpO1xuXG4gICAgLy8gVGhlIGBmb2N1c2AgbWV0aG9kIGlzbid0IGF2YWlsYWJsZSBkdXJpbmcgc2VydmVyLXNpZGUgcmVuZGVyaW5nLlxuICAgIGlmICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMpIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCkpO1xuICAgIH1cbiAgfVxufVxuIl19