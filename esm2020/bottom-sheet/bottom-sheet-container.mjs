import { FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { coerceArray } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { BasePortalOutlet, CdkPortalOutlet, } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, NgZone, Optional, ViewChild, ViewEncapsulation, } from '@angular/core';
import { matBottomSheetAnimations } from './bottom-sheet-animations';
import { MatBottomSheetConfig } from './bottom-sheet-config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/cdk/layout";
import * as i3 from "./bottom-sheet-config";
import * as i4 from "@angular/cdk/portal";
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
MatBottomSheetContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatBottomSheetContainer, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.FocusTrapFactory }, { token: i1.InteractivityChecker }, { token: i0.NgZone }, { token: i2.BreakpointObserver }, { token: DOCUMENT, optional: true }, { token: i3.MatBottomSheetConfig }], target: i0.ɵɵFactoryTarget.Component });
MatBottomSheetContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatBottomSheetContainer, selector: "mat-bottom-sheet-container", host: { attributes: { "tabindex": "-1", "role": "dialog", "aria-modal": "true" }, listeners: { "@state.start": "_onAnimationStart($event)", "@state.done": "_onAnimationDone($event)" }, properties: { "attr.aria-label": "bottomSheetConfig?.ariaLabel", "@state": "_animationState" }, classAttribute: "mat-bottom-sheet-container" }, viewQueries: [{ propertyName: "_portalOutlet", first: true, predicate: CdkPortalOutlet, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<ng-template cdkPortalOutlet></ng-template>\r\n", styles: [".mat-bottom-sheet-container{padding:8px 16px;min-width:100vw;box-sizing:border-box;display:block;outline:0;max-height:80vh;overflow:auto}.cdk-high-contrast-active .mat-bottom-sheet-container{outline:1px solid}.mat-bottom-sheet-container-xlarge,.mat-bottom-sheet-container-large,.mat-bottom-sheet-container-medium{border-top-left-radius:4px;border-top-right-radius:4px}.mat-bottom-sheet-container-medium{min-width:384px;max-width:calc(100vw - 128px)}.mat-bottom-sheet-container-large{min-width:512px;max-width:calc(100vw - 256px)}.mat-bottom-sheet-container-xlarge{min-width:576px;max-width:calc(100vw - 384px)}\n"], directives: [{ type: i4.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [matBottomSheetAnimations.bottomSheetState], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatBottomSheetContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-bottom-sheet-container', changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, animations: [matBottomSheetAnimations.bottomSheetState], host: {
                        'class': 'mat-bottom-sheet-container',
                        'tabindex': '-1',
                        'role': 'dialog',
                        'aria-modal': 'true',
                        '[attr.aria-label]': 'bottomSheetConfig?.ariaLabel',
                        '[@state]': '_animationState',
                        '(@state.start)': '_onAnimationStart($event)',
                        '(@state.done)': '_onAnimationDone($event)'
                    }, template: "<ng-template cdkPortalOutlet></ng-template>\r\n", styles: [".mat-bottom-sheet-container{padding:8px 16px;min-width:100vw;box-sizing:border-box;display:block;outline:0;max-height:80vh;overflow:auto}.cdk-high-contrast-active .mat-bottom-sheet-container{outline:1px solid}.mat-bottom-sheet-container-xlarge,.mat-bottom-sheet-container-large,.mat-bottom-sheet-container-medium{border-top-left-radius:4px;border-top-right-radius:4px}.mat-bottom-sheet-container-medium{min-width:384px;max-width:calc(100vw - 128px)}.mat-bottom-sheet-container-large{min-width:512px;max-width:calc(100vw - 256px)}.mat-bottom-sheet-container-xlarge{min-width:576px;max-width:calc(100vw - 384px)}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.FocusTrapFactory }, { type: i1.InteractivityChecker }, { type: i0.NgZone }, { type: i2.BreakpointObserver }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i3.MatBottomSheetConfig }]; }, propDecorators: { _portalOutlet: [{
                type: ViewChild,
                args: [CdkPortalOutlet, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LWNvbnRhaW5lci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LWNvbnRhaW5lci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sRUFBWSxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BGLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsV0FBVyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDcEUsT0FBTyxFQUFDLGlDQUFpQyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixlQUFlLEdBSWhCLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFFVCxVQUFVLEVBRVYsWUFBWSxFQUNaLE1BQU0sRUFDTixNQUFNLEVBRU4sUUFBUSxFQUNSLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDbkUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7Ozs7OztBQUUzRCxpRkFBaUY7QUFFakY7OztHQUdHO0FBdUJILE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxnQkFBZ0I7SUF3QjNELFlBQ1UsV0FBb0MsRUFDcEMsa0JBQXFDLEVBQ3JDLGlCQUFtQyxFQUMxQixxQkFBMkMsRUFD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Z0JBQWdCLEVBQUUsMkJBQTJCO3dCQUM3QyxlQUFlLEVBQUUsMEJBQTBCO3FCQUM1Qzs7MEJBaUNFLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsUUFBUTsrRUEzQmMsYUFBYTtzQkFBeEQsU0FBUzt1QkFBQyxlQUFlLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtGb2N1c1RyYXAsIEZvY3VzVHJhcEZhY3RvcnksIEludGVyYWN0aXZpdHlDaGVja2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge2NvZXJjZUFycmF5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtCcmVha3BvaW50T2JzZXJ2ZXIsIEJyZWFrcG9pbnRzfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7X2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgQmFzZVBvcnRhbE91dGxldCxcbiAgQ2RrUG9ydGFsT3V0bGV0LFxuICBDb21wb25lbnRQb3J0YWwsXG4gIERvbVBvcnRhbCxcbiAgVGVtcGxhdGVQb3J0YWwsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hdEJvdHRvbVNoZWV0QW5pbWF0aW9uc30gZnJvbSAnLi9ib3R0b20tc2hlZXQtYW5pbWF0aW9ucyc7XG5pbXBvcnQge01hdEJvdHRvbVNoZWV0Q29uZmlnfSBmcm9tICcuL2JvdHRvbS1zaGVldC1jb25maWcnO1xuXG4vLyBUT0RPKGNyaXNiZXRvKTogY29uc29saWRhdGUgc29tZSBsb2dpYyBiZXR3ZWVuIHRoaXMsIE1hdERpYWxvZyBhbmQgTWF0U25hY2tCYXJcblxuLyoqXG4gKiBJbnRlcm5hbCBjb21wb25lbnQgdGhhdCB3cmFwcyB1c2VyLXByb3ZpZGVkIGJvdHRvbSBzaGVldCBjb250ZW50LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtYm90dG9tLXNoZWV0LWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlVXJsOiAnYm90dG9tLXNoZWV0LWNvbnRhaW5lci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2JvdHRvbS1zaGVldC1jb250YWluZXIuY3NzJ10sXG4gIC8vIEluIEl2eSBlbWJlZGRlZCB2aWV3cyB3aWxsIGJlIGNoYW5nZSBkZXRlY3RlZCBmcm9tIHRoZWlyIGRlY2xhcmF0aW9uIHBsYWNlLCByYXRoZXIgdGhhbiB3aGVyZVxuICAvLyB0aGV5IHdlcmUgc3RhbXBlZCBvdXQuIFRoaXMgbWVhbnMgdGhhdCB3ZSBjYW4ndCBoYXZlIHRoZSBib3R0b20gc2hlZXQgY29udGFpbmVyIGJlIE9uUHVzaCxcbiAgLy8gYmVjYXVzZSBpdCBtaWdodCBjYXVzZSB0aGUgc2hlZXRzIHRoYXQgd2VyZSBvcGVuZWQgZnJvbSBhIHRlbXBsYXRlIG5vdCB0byBiZSBvdXQgb2YgZGF0ZS5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBhbmltYXRpb25zOiBbbWF0Qm90dG9tU2hlZXRBbmltYXRpb25zLmJvdHRvbVNoZWV0U3RhdGVdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1ib3R0b20tc2hlZXQtY29udGFpbmVyJyxcbiAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICdyb2xlJzogJ2RpYWxvZycsXG4gICAgJ2FyaWEtbW9kYWwnOiAndHJ1ZScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ2JvdHRvbVNoZWV0Q29uZmlnPy5hcmlhTGFiZWwnLFxuICAgICdbQHN0YXRlXSc6ICdfYW5pbWF0aW9uU3RhdGUnLFxuICAgICcoQHN0YXRlLnN0YXJ0KSc6ICdfb25BbmltYXRpb25TdGFydCgkZXZlbnQpJyxcbiAgICAnKEBzdGF0ZS5kb25lKSc6ICdfb25BbmltYXRpb25Eb25lKCRldmVudCknXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEJvdHRvbVNoZWV0Q29udGFpbmVyIGV4dGVuZHMgQmFzZVBvcnRhbE91dGxldCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2JyZWFrcG9pbnRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKiogVGhlIHBvcnRhbCBvdXRsZXQgaW5zaWRlIG9mIHRoaXMgY29udGFpbmVyIGludG8gd2hpY2ggdGhlIGNvbnRlbnQgd2lsbCBiZSBsb2FkZWQuICovXG4gIEBWaWV3Q2hpbGQoQ2RrUG9ydGFsT3V0bGV0LCB7c3RhdGljOiB0cnVlfSkgX3BvcnRhbE91dGxldDogQ2RrUG9ydGFsT3V0bGV0O1xuXG4gIC8qKiBUaGUgc3RhdGUgb2YgdGhlIGJvdHRvbSBzaGVldCBhbmltYXRpb25zLiAqL1xuICBfYW5pbWF0aW9uU3RhdGU6ICd2b2lkJyB8ICd2aXNpYmxlJyB8ICdoaWRkZW4nID0gJ3ZvaWQnO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgc3RhdGUgb2YgdGhlIGFuaW1hdGlvbiBjaGFuZ2VzLiAqL1xuICBfYW5pbWF0aW9uU3RhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogVGhlIGNsYXNzIHRoYXQgdHJhcHMgYW5kIG1hbmFnZXMgZm9jdXMgd2l0aGluIHRoZSBib3R0b20gc2hlZXQuICovXG4gIHByaXZhdGUgX2ZvY3VzVHJhcDogRm9jdXNUcmFwO1xuXG4gIC8qKiBFbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBib3R0b20gc2hlZXQgd2FzIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfZWxlbWVudEZvY3VzZWRCZWZvcmVPcGVuZWQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFNlcnZlci1zaWRlIHJlbmRlcmluZy1jb21wYXRpYmxlIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIGRvY3VtZW50IG9iamVjdC4gKi9cbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIF9kZXN0cm95ZWQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2ZvY3VzVHJhcEZhY3Rvcnk6IEZvY3VzVHJhcEZhY3RvcnksXG4gICAgcHJpdmF0ZSByZWFkb25seSBfaW50ZXJhY3Rpdml0eUNoZWNrZXI6IEludGVyYWN0aXZpdHlDaGVja2VyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lLFxuICAgIGJyZWFrcG9pbnRPYnNlcnZlcjogQnJlYWtwb2ludE9ic2VydmVyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50OiBhbnksXG4gICAgLyoqIFRoZSBib3R0b20gc2hlZXQgY29uZmlndXJhdGlvbi4gKi9cbiAgICBwdWJsaWMgYm90dG9tU2hlZXRDb25maWc6IE1hdEJvdHRvbVNoZWV0Q29uZmlnKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX2RvY3VtZW50ID0gZG9jdW1lbnQ7XG4gICAgdGhpcy5fYnJlYWtwb2ludFN1YnNjcmlwdGlvbiA9IGJyZWFrcG9pbnRPYnNlcnZlclxuICAgICAgLm9ic2VydmUoW0JyZWFrcG9pbnRzLk1lZGl1bSwgQnJlYWtwb2ludHMuTGFyZ2UsIEJyZWFrcG9pbnRzLlhMYXJnZV0pXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fdG9nZ2xlQ2xhc3MoJ21hdC1ib3R0b20tc2hlZXQtY29udGFpbmVyLW1lZGl1bScsXG4gICAgICAgICAgICBicmVha3BvaW50T2JzZXJ2ZXIuaXNNYXRjaGVkKEJyZWFrcG9pbnRzLk1lZGl1bSkpO1xuICAgICAgICB0aGlzLl90b2dnbGVDbGFzcygnbWF0LWJvdHRvbS1zaGVldC1jb250YWluZXItbGFyZ2UnLFxuICAgICAgICAgICAgYnJlYWtwb2ludE9ic2VydmVyLmlzTWF0Y2hlZChCcmVha3BvaW50cy5MYXJnZSkpO1xuICAgICAgICB0aGlzLl90b2dnbGVDbGFzcygnbWF0LWJvdHRvbS1zaGVldC1jb250YWluZXIteGxhcmdlJyxcbiAgICAgICAgICAgIGJyZWFrcG9pbnRPYnNlcnZlci5pc01hdGNoZWQoQnJlYWtwb2ludHMuWExhcmdlKSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBBdHRhY2ggYSBjb21wb25lbnQgcG9ydGFsIGFzIGNvbnRlbnQgdG8gdGhpcyBib3R0b20gc2hlZXQgY29udGFpbmVyLiAqL1xuICBhdHRhY2hDb21wb25lbnRQb3J0YWw8VD4ocG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VD4pOiBDb21wb25lbnRSZWY8VD4ge1xuICAgIHRoaXMuX3ZhbGlkYXRlUG9ydGFsQXR0YWNoZWQoKTtcbiAgICB0aGlzLl9zZXRQYW5lbENsYXNzKCk7XG4gICAgdGhpcy5fc2F2ZVByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCgpO1xuICAgIHJldHVybiB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoQ29tcG9uZW50UG9ydGFsKHBvcnRhbCk7XG4gIH1cblxuICAvKiogQXR0YWNoIGEgdGVtcGxhdGUgcG9ydGFsIGFzIGNvbnRlbnQgdG8gdGhpcyBib3R0b20gc2hlZXQgY29udGFpbmVyLiAqL1xuICBhdHRhY2hUZW1wbGF0ZVBvcnRhbDxDPihwb3J0YWw6IFRlbXBsYXRlUG9ydGFsPEM+KTogRW1iZWRkZWRWaWV3UmVmPEM+IHtcbiAgICB0aGlzLl92YWxpZGF0ZVBvcnRhbEF0dGFjaGVkKCk7XG4gICAgdGhpcy5fc2V0UGFuZWxDbGFzcygpO1xuICAgIHRoaXMuX3NhdmVQcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQoKTtcbiAgICByZXR1cm4gdGhpcy5fcG9ydGFsT3V0bGV0LmF0dGFjaFRlbXBsYXRlUG9ydGFsKHBvcnRhbCk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgYSBET00gcG9ydGFsIHRvIHRoZSBib3R0b20gc2hlZXQgY29udGFpbmVyLlxuICAgKiBAZGVwcmVjYXRlZCBUbyBiZSB0dXJuZWQgaW50byBhIG1ldGhvZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICovXG4gIG92ZXJyaWRlIGF0dGFjaERvbVBvcnRhbCA9IChwb3J0YWw6IERvbVBvcnRhbCkgPT4ge1xuICAgIHRoaXMuX3ZhbGlkYXRlUG9ydGFsQXR0YWNoZWQoKTtcbiAgICB0aGlzLl9zZXRQYW5lbENsYXNzKCk7XG4gICAgdGhpcy5fc2F2ZVByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCgpO1xuICAgIHJldHVybiB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoRG9tUG9ydGFsKHBvcnRhbCk7XG4gIH1cblxuICAvKiogQmVnaW4gYW5pbWF0aW9uIG9mIGJvdHRvbSBzaGVldCBlbnRyYW5jZSBpbnRvIHZpZXcuICovXG4gIGVudGVyKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fZGVzdHJveWVkKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9ICd2aXNpYmxlJztcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQmVnaW4gYW5pbWF0aW9uIG9mIHRoZSBib3R0b20gc2hlZXQgZXhpdGluZyBmcm9tIHZpZXcuICovXG4gIGV4aXQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9kZXN0cm95ZWQpIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ2hpZGRlbic7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9icmVha3BvaW50U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcbiAgfVxuXG4gIF9vbkFuaW1hdGlvbkRvbmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICdoaWRkZW4nKSB7XG4gICAgICB0aGlzLl9yZXN0b3JlRm9jdXMoKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgdGhpcy5fdHJhcEZvY3VzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgX29uQW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdG9nZ2xlQ2xhc3MoY3NzQ2xhc3M6IHN0cmluZywgYWRkOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoY3NzQ2xhc3MsIGFkZCk7XG4gIH1cblxuICBwcml2YXRlIF92YWxpZGF0ZVBvcnRhbEF0dGFjaGVkKCkge1xuICAgIGlmICh0aGlzLl9wb3J0YWxPdXRsZXQuaGFzQXR0YWNoZWQoKSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0F0dGVtcHRpbmcgdG8gYXR0YWNoIGJvdHRvbSBzaGVldCBjb250ZW50IGFmdGVyIGNvbnRlbnQgaXMgYWxyZWFkeSBhdHRhY2hlZCcpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NldFBhbmVsQ2xhc3MoKSB7XG4gICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKC4uLmNvZXJjZUFycmF5KHRoaXMuYm90dG9tU2hlZXRDb25maWcucGFuZWxDbGFzcyB8fCBbXSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIHByb3ZpZGVkIGVsZW1lbnQuIElmIHRoZSBlbGVtZW50IGlzIG5vdCBmb2N1c2FibGUsIGl0IHdpbGwgYWRkIGEgdGFiSW5kZXhcbiAgICogYXR0cmlidXRlIHRvIGZvcmNlZnVsbHkgZm9jdXMgaXQuIFRoZSBhdHRyaWJ1dGUgaXMgcmVtb3ZlZCBhZnRlciBmb2N1cyBpcyBtb3ZlZC5cbiAgICogQHBhcmFtIGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gZm9jdXMuXG4gICAqL1xuICBwcml2YXRlIF9mb3JjZUZvY3VzKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgaWYgKCF0aGlzLl9pbnRlcmFjdGl2aXR5Q2hlY2tlci5pc0ZvY3VzYWJsZShlbGVtZW50KSkge1xuICAgICAgZWxlbWVudC50YWJJbmRleCA9IC0xO1xuICAgICAgLy8gVGhlIHRhYmluZGV4IGF0dHJpYnV0ZSBzaG91bGQgYmUgcmVtb3ZlZCB0byBhdm9pZCBuYXZpZ2F0aW5nIHRvIHRoYXQgZWxlbWVudCBhZ2FpblxuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4gZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4JykpO1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3RvciB3aXRoaW4gdGhlIGZvY3VzIHRyYXAuXG4gICAqIEBwYXJhbSBzZWxlY3RvciBUaGUgQ1NTIHNlbGVjdG9yIGZvciB0aGUgZWxlbWVudCB0byBzZXQgZm9jdXMgdG8uXG4gICAqL1xuICBwcml2YXRlIF9mb2N1c0J5Q3NzU2VsZWN0b3Ioc2VsZWN0b3I6IHN0cmluZywgb3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIGxldCBlbGVtZW50VG9Gb2N1cyA9XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmIChlbGVtZW50VG9Gb2N1cykge1xuICAgICAgdGhpcy5fZm9yY2VGb2N1cyhlbGVtZW50VG9Gb2N1cywgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIHRoZSBmb2N1cyBpbnNpZGUgdGhlIGZvY3VzIHRyYXAuIFdoZW4gYXV0b0ZvY3VzIGlzIG5vdCBzZXQgdG8gJ2JvdHRvbS1zaGVldCcsXG4gICAqIGlmIGZvY3VzIGNhbm5vdCBiZSBtb3ZlZCB0aGVuIGZvY3VzIHdpbGwgZ28gdG8gdGhlIGJvdHRvbSBzaGVldCBjb250YWluZXIuXG4gICAqL1xuICBwcml2YXRlIF90cmFwRm9jdXMoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGlmICghdGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICB0aGlzLl9mb2N1c1RyYXAgPSB0aGlzLl9mb2N1c1RyYXBGYWN0b3J5LmNyZWF0ZShlbGVtZW50KTtcbiAgICB9XG5cbiAgICAvLyBJZiB3ZXJlIHRvIGF0dGVtcHQgdG8gZm9jdXMgaW1tZWRpYXRlbHksIHRoZW4gdGhlIGNvbnRlbnQgb2YgdGhlIGJvdHRvbSBzaGVldCB3b3VsZCBub3RcbiAgICAvLyB5ZXQgYmUgcmVhZHkgaW4gaW5zdGFuY2VzIHdoZXJlIGNoYW5nZSBkZXRlY3Rpb24gaGFzIHRvIHJ1biBmaXJzdC4gVG8gZGVhbCB3aXRoIHRoaXMsXG4gICAgLy8gd2Ugc2ltcGx5IHdhaXQgZm9yIHRoZSBtaWNyb3Rhc2sgcXVldWUgdG8gYmUgZW1wdHkgd2hlbiBzZXR0aW5nIGZvY3VzIHdoZW4gYXV0b0ZvY3VzXG4gICAgLy8gaXNuJ3Qgc2V0IHRvIGJvdHRvbSBzaGVldC4gSWYgdGhlIGVsZW1lbnQgaW5zaWRlIHRoZSBib3R0b20gc2hlZXQgY2FuJ3QgYmUgZm9jdXNlZCxcbiAgICAvLyB0aGVuIHRoZSBjb250YWluZXIgaXMgZm9jdXNlZCBzbyB0aGUgdXNlciBjYW4ndCB0YWIgaW50byBvdGhlciBlbGVtZW50cyBiZWhpbmQgaXQuXG4gICAgc3dpdGNoICh0aGlzLmJvdHRvbVNoZWV0Q29uZmlnLmF1dG9Gb2N1cykge1xuICAgICAgY2FzZSBmYWxzZTpcbiAgICAgIGNhc2UgJ2RpYWxvZyc6XG4gICAgICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSBfZ2V0Rm9jdXNlZEVsZW1lbnRQaWVyY2VTaGFkb3dEb20oKTtcbiAgICAgICAgLy8gRW5zdXJlIHRoYXQgZm9jdXMgaXMgb24gdGhlIGJvdHRvbSBzaGVldCBjb250YWluZXIuIEl0J3MgcG9zc2libGUgdGhhdCBhIGRpZmZlcmVudFxuICAgICAgICAvLyBjb21wb25lbnQgdHJpZWQgdG8gbW92ZSBmb2N1cyB3aGlsZSB0aGUgb3BlbiBhbmltYXRpb24gd2FzIHJ1bm5pbmcuIFNlZTpcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTYyMTUuIE5vdGUgdGhhdCB3ZSBvbmx5IHdhbnQgdG8gZG8gdGhpc1xuICAgICAgICAvLyBpZiB0aGUgZm9jdXMgaXNuJ3QgaW5zaWRlIHRoZSBib3R0b20gc2hlZXQgYWxyZWFkeSwgYmVjYXVzZSBpdCdzIHBvc3NpYmxlIHRoYXQgdGhlXG4gICAgICAgIC8vIGNvbnN1bWVyIHNwZWNpZmllZCBgYXV0b0ZvY3VzYCBpbiBvcmRlciB0byBtb3ZlIGZvY3VzIHRoZW1zZWx2ZXMuXG4gICAgICAgIGlmIChhY3RpdmVFbGVtZW50ICE9PSBlbGVtZW50ICYmICFlbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0cnVlOlxuICAgICAgY2FzZSAnZmlyc3QtdGFiYmFibGUnOlxuICAgICAgICB0aGlzLl9mb2N1c1RyYXAuZm9jdXNJbml0aWFsRWxlbWVudFdoZW5SZWFkeSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ZpcnN0LWhlYWRpbmcnOlxuICAgICAgICB0aGlzLl9mb2N1c0J5Q3NzU2VsZWN0b3IoJ2gxLCBoMiwgaDMsIGg0LCBoNSwgaDYsIFtyb2xlPVwiaGVhZGluZ1wiXScpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuX2ZvY3VzQnlDc3NTZWxlY3Rvcih0aGlzLmJvdHRvbVNoZWV0Q29uZmlnLmF1dG9Gb2N1cyEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKiogUmVzdG9yZXMgZm9jdXMgdG8gdGhlIGVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGJvdHRvbSBzaGVldCB3YXMgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9yZXN0b3JlRm9jdXMoKSB7XG4gICAgY29uc3QgdG9Gb2N1cyA9IHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlT3BlbmVkO1xuXG4gICAgLy8gV2UgbmVlZCB0aGUgZXh0cmEgY2hlY2ssIGJlY2F1c2UgSUUgY2FuIHNldCB0aGUgYGFjdGl2ZUVsZW1lbnRgIHRvIG51bGwgaW4gc29tZSBjYXNlcy5cbiAgICBpZiAodGhpcy5ib3R0b21TaGVldENvbmZpZy5yZXN0b3JlRm9jdXMgJiYgdG9Gb2N1cyAmJiB0eXBlb2YgdG9Gb2N1cy5mb2N1cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IF9nZXRGb2N1c2VkRWxlbWVudFBpZXJjZVNoYWRvd0RvbSgpO1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgZm9jdXMgaXMgc3RpbGwgaW5zaWRlIHRoZSBib3R0b20gc2hlZXQgb3IgaXMgb24gdGhlIGJvZHkgKHVzdWFsbHkgYmVjYXVzZSBhXG4gICAgICAvLyBub24tZm9jdXNhYmxlIGVsZW1lbnQgbGlrZSB0aGUgYmFja2Ryb3Agd2FzIGNsaWNrZWQpIGJlZm9yZSBtb3ZpbmcgaXQuIEl0J3MgcG9zc2libGUgdGhhdFxuICAgICAgLy8gdGhlIGNvbnN1bWVyIG1vdmVkIGl0IHRoZW1zZWx2ZXMgYmVmb3JlIHRoZSBhbmltYXRpb24gd2FzIGRvbmUsIGluIHdoaWNoIGNhc2Ugd2Ugc2hvdWxkbid0XG4gICAgICAvLyBkbyBhbnl0aGluZy5cbiAgICAgIGlmICghYWN0aXZlRWxlbWVudCB8fCBhY3RpdmVFbGVtZW50ID09PSB0aGlzLl9kb2N1bWVudC5ib2R5IHx8IGFjdGl2ZUVsZW1lbnQgPT09IGVsZW1lbnQgfHxcbiAgICAgICAgZWxlbWVudC5jb250YWlucyhhY3RpdmVFbGVtZW50KSkge1xuICAgICAgICB0b0ZvY3VzLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgdGhpcy5fZm9jdXNUcmFwLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICAvKiogU2F2ZXMgYSByZWZlcmVuY2UgdG8gdGhlIGVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGJvdHRvbSBzaGVldCB3YXMgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9zYXZlUHJldmlvdXNseUZvY3VzZWRFbGVtZW50KCkge1xuICAgIHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlT3BlbmVkID0gX2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tKCk7XG5cbiAgICAvLyBUaGUgYGZvY3VzYCBtZXRob2QgaXNuJ3QgYXZhaWxhYmxlIGR1cmluZyBzZXJ2ZXItc2lkZSByZW5kZXJpbmcuXG4gICAgaWYgKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cykge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKSk7XG4gICAgfVxuICB9XG59XG4iLCI8bmctdGVtcGxhdGUgY2RrUG9ydGFsT3V0bGV0PjwvbmctdGVtcGxhdGU+XHJcbiJdfQ==