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
 * @docs-private
 */
export class MatBottomSheetContainer extends BasePortalOutlet {
    constructor(_elementRef, _changeDetectorRef, _focusTrapFactory, breakpointObserver, document, 
    /** The bottom sheet configuration. */
    bottomSheetConfig) {
        super();
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._focusTrapFactory = _focusTrapFactory;
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
        const classList = this._elementRef.nativeElement.classList;
        add ? classList.add(cssClass) : classList.remove(cssClass);
    }
    _validatePortalAttached() {
        if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('Attempting to attach bottom sheet content after content is already attached');
        }
    }
    _setPanelClass() {
        const element = this._elementRef.nativeElement;
        const panelClass = this.bottomSheetConfig.panelClass;
        if (Array.isArray(panelClass)) {
            // Note that we can't use a spread here, because IE doesn't support multiple arguments.
            panelClass.forEach(cssClass => element.classList.add(cssClass));
        }
        else if (panelClass) {
            element.classList.add(panelClass);
        }
    }
    /** Moves the focus inside the focus trap. */
    _trapFocus() {
        const element = this._elementRef.nativeElement;
        if (!this._focusTrap) {
            this._focusTrap = this._focusTrapFactory.create(element);
        }
        if (this.bottomSheetConfig.autoFocus) {
            this._focusTrap.focusInitialElementWhenReady();
        }
        else {
            const activeElement = this._getActiveElement();
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
    /** Restores focus to the element that was focused before the bottom sheet was opened. */
    _restoreFocus() {
        const toFocus = this._elementFocusedBeforeOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (this.bottomSheetConfig.restoreFocus && toFocus && typeof toFocus.focus === 'function') {
            const activeElement = this._getActiveElement();
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
        this._elementFocusedBeforeOpened = this._getActiveElement();
        // The `focus` method isn't available during server-side rendering.
        if (this._elementRef.nativeElement.focus) {
            Promise.resolve().then(() => this._elementRef.nativeElement.focus());
        }
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
    { type: BreakpointObserver },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: MatBottomSheetConfig }
];
MatBottomSheetContainer.propDecorators = {
    _portalOutlet: [{ type: ViewChild, args: [CdkPortalOutlet, { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LWNvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUdULFNBQVMsRUFFVCxVQUFVLEVBQ1YsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixpQkFBaUIsRUFDakIsWUFBWSxFQUNaLE1BQU0sRUFDTixRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUNMLGdCQUFnQixFQUdoQixlQUFlLEdBRWhCLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFDLGtCQUFrQixFQUFFLFdBQVcsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3BFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBRW5FLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQVksZ0JBQWdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUU5RCxpRkFBaUY7QUFFakY7OztHQUdHO0FBdUJILE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxnQkFBZ0I7SUF3QjNELFlBQ1UsV0FBb0MsRUFDcEMsa0JBQXFDLEVBQ3JDLGlCQUFtQyxFQUMzQyxrQkFBc0MsRUFDUixRQUFhO0lBQzNDLHNDQUFzQztJQUMvQixpQkFBdUM7UUFDOUMsS0FBSyxFQUFFLENBQUM7UUFQQSxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQUNyQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBSXBDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FB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SSxFQUFFO29CQUNKLE9BQU8sRUFBRSw0QkFBNEI7b0JBQ3JDLFVBQVUsRUFBRSxJQUFJO29CQUNoQixNQUFNLEVBQUUsUUFBUTtvQkFDaEIsWUFBWSxFQUFFLE1BQU07b0JBQ3BCLG1CQUFtQixFQUFFLDhCQUE4QjtvQkFDbkQsVUFBVSxFQUFFLGlCQUFpQjtvQkFDN0IsZ0JBQWdCLEVBQUUsMkJBQTJCO29CQUM3QyxlQUFlLEVBQUUsMEJBQTBCO2lCQUM1Qzs7YUFDRjs7O1lBbERDLFVBQVU7WUFHVixpQkFBaUI7WUFrQkEsZ0JBQWdCO1lBTDNCLGtCQUFrQjs0Q0FnRXJCLFFBQVEsWUFBSSxNQUFNLFNBQUMsUUFBUTtZQS9EeEIsb0JBQW9COzs7NEJBc0N6QixTQUFTLFNBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBWaWV3Q2hpbGQsXG4gIE9uRGVzdHJveSxcbiAgRWxlbWVudFJlZixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIE9wdGlvbmFsLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgQmFzZVBvcnRhbE91dGxldCxcbiAgQ29tcG9uZW50UG9ydGFsLFxuICBUZW1wbGF0ZVBvcnRhbCxcbiAgQ2RrUG9ydGFsT3V0bGV0LFxuICBEb21Qb3J0YWwsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtCcmVha3BvaW50T2JzZXJ2ZXIsIEJyZWFrcG9pbnRzfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7TWF0Qm90dG9tU2hlZXRDb25maWd9IGZyb20gJy4vYm90dG9tLXNoZWV0LWNvbmZpZyc7XG5pbXBvcnQge21hdEJvdHRvbVNoZWV0QW5pbWF0aW9uc30gZnJvbSAnLi9ib3R0b20tc2hlZXQtYW5pbWF0aW9ucyc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtGb2N1c1RyYXAsIEZvY3VzVHJhcEZhY3Rvcnl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcblxuLy8gVE9ETyhjcmlzYmV0byk6IGNvbnNvbGlkYXRlIHNvbWUgbG9naWMgYmV0d2VlbiB0aGlzLCBNYXREaWFsb2cgYW5kIE1hdFNuYWNrQmFyXG5cbi8qKlxuICogSW50ZXJuYWwgY29tcG9uZW50IHRoYXQgd3JhcHMgdXNlci1wcm92aWRlZCBib3R0b20gc2hlZXQgY29udGVudC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWJvdHRvbS1zaGVldC1jb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJ2JvdHRvbS1zaGVldC1jb250YWluZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydib3R0b20tc2hlZXQtY29udGFpbmVyLmNzcyddLFxuICAvLyBJbiBJdnkgZW1iZWRkZWQgdmlld3Mgd2lsbCBiZSBjaGFuZ2UgZGV0ZWN0ZWQgZnJvbSB0aGVpciBkZWNsYXJhdGlvbiBwbGFjZSwgcmF0aGVyIHRoYW4gd2hlcmVcbiAgLy8gdGhleSB3ZXJlIHN0YW1wZWQgb3V0LiBUaGlzIG1lYW5zIHRoYXQgd2UgY2FuJ3QgaGF2ZSB0aGUgYm90dG9tIHNoZWV0IGNvbnRhaW5lciBiZSBPblB1c2gsXG4gIC8vIGJlY2F1c2UgaXQgbWlnaHQgY2F1c2UgdGhlIHNoZWV0cyB0aGF0IHdlcmUgb3BlbmVkIGZyb20gYSB0ZW1wbGF0ZSBub3QgdG8gYmUgb3V0IG9mIGRhdGUuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgYW5pbWF0aW9uczogW21hdEJvdHRvbVNoZWV0QW5pbWF0aW9ucy5ib3R0b21TaGVldFN0YXRlXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtYm90dG9tLXNoZWV0LWNvbnRhaW5lcicsXG4gICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAncm9sZSc6ICdkaWFsb2cnLFxuICAgICdhcmlhLW1vZGFsJzogJ3RydWUnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdib3R0b21TaGVldENvbmZpZz8uYXJpYUxhYmVsJyxcbiAgICAnW0BzdGF0ZV0nOiAnX2FuaW1hdGlvblN0YXRlJyxcbiAgICAnKEBzdGF0ZS5zdGFydCknOiAnX29uQW5pbWF0aW9uU3RhcnQoJGV2ZW50KScsXG4gICAgJyhAc3RhdGUuZG9uZSknOiAnX29uQW5pbWF0aW9uRG9uZSgkZXZlbnQpJ1xuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCb3R0b21TaGVldENvbnRhaW5lciBleHRlbmRzIEJhc2VQb3J0YWxPdXRsZXQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9icmVha3BvaW50U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqIFRoZSBwb3J0YWwgb3V0bGV0IGluc2lkZSBvZiB0aGlzIGNvbnRhaW5lciBpbnRvIHdoaWNoIHRoZSBjb250ZW50IHdpbGwgYmUgbG9hZGVkLiAqL1xuICBAVmlld0NoaWxkKENka1BvcnRhbE91dGxldCwge3N0YXRpYzogdHJ1ZX0pIF9wb3J0YWxPdXRsZXQ6IENka1BvcnRhbE91dGxldDtcblxuICAvKiogVGhlIHN0YXRlIG9mIHRoZSBib3R0b20gc2hlZXQgYW5pbWF0aW9ucy4gKi9cbiAgX2FuaW1hdGlvblN0YXRlOiAndm9pZCcgfCAndmlzaWJsZScgfCAnaGlkZGVuJyA9ICd2b2lkJztcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIHN0YXRlIG9mIHRoZSBhbmltYXRpb24gY2hhbmdlcy4gKi9cbiAgX2FuaW1hdGlvblN0YXRlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8QW5pbWF0aW9uRXZlbnQ+KCk7XG5cbiAgLyoqIFRoZSBjbGFzcyB0aGF0IHRyYXBzIGFuZCBtYW5hZ2VzIGZvY3VzIHdpdGhpbiB0aGUgYm90dG9tIHNoZWV0LiAqL1xuICBwcml2YXRlIF9mb2N1c1RyYXA6IEZvY3VzVHJhcDtcblxuICAvKiogRWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgYm90dG9tIHNoZWV0IHdhcyBvcGVuZWQuICovXG4gIHByaXZhdGUgX2VsZW1lbnRGb2N1c2VkQmVmb3JlT3BlbmVkOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBTZXJ2ZXItc2lkZSByZW5kZXJpbmctY29tcGF0aWJsZSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBkb2N1bWVudCBvYmplY3QuICovXG4gIHByaXZhdGUgX2RvY3VtZW50OiBEb2N1bWVudDtcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveWVkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9mb2N1c1RyYXBGYWN0b3J5OiBGb2N1c1RyYXBGYWN0b3J5LFxuICAgIGJyZWFrcG9pbnRPYnNlcnZlcjogQnJlYWtwb2ludE9ic2VydmVyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50OiBhbnksXG4gICAgLyoqIFRoZSBib3R0b20gc2hlZXQgY29uZmlndXJhdGlvbi4gKi9cbiAgICBwdWJsaWMgYm90dG9tU2hlZXRDb25maWc6IE1hdEJvdHRvbVNoZWV0Q29uZmlnKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX2RvY3VtZW50ID0gZG9jdW1lbnQ7XG4gICAgdGhpcy5fYnJlYWtwb2ludFN1YnNjcmlwdGlvbiA9IGJyZWFrcG9pbnRPYnNlcnZlclxuICAgICAgLm9ic2VydmUoW0JyZWFrcG9pbnRzLk1lZGl1bSwgQnJlYWtwb2ludHMuTGFyZ2UsIEJyZWFrcG9pbnRzLlhMYXJnZV0pXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fdG9nZ2xlQ2xhc3MoJ21hdC1ib3R0b20tc2hlZXQtY29udGFpbmVyLW1lZGl1bScsXG4gICAgICAgICAgICBicmVha3BvaW50T2JzZXJ2ZXIuaXNNYXRjaGVkKEJyZWFrcG9pbnRzLk1lZGl1bSkpO1xuICAgICAgICB0aGlzLl90b2dnbGVDbGFzcygnbWF0LWJvdHRvbS1zaGVldC1jb250YWluZXItbGFyZ2UnLFxuICAgICAgICAgICAgYnJlYWtwb2ludE9ic2VydmVyLmlzTWF0Y2hlZChCcmVha3BvaW50cy5MYXJnZSkpO1xuICAgICAgICB0aGlzLl90b2dnbGVDbGFzcygnbWF0LWJvdHRvbS1zaGVldC1jb250YWluZXIteGxhcmdlJyxcbiAgICAgICAgICAgIGJyZWFrcG9pbnRPYnNlcnZlci5pc01hdGNoZWQoQnJlYWtwb2ludHMuWExhcmdlKSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBBdHRhY2ggYSBjb21wb25lbnQgcG9ydGFsIGFzIGNvbnRlbnQgdG8gdGhpcyBib3R0b20gc2hlZXQgY29udGFpbmVyLiAqL1xuICBhdHRhY2hDb21wb25lbnRQb3J0YWw8VD4ocG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VD4pOiBDb21wb25lbnRSZWY8VD4ge1xuICAgIHRoaXMuX3ZhbGlkYXRlUG9ydGFsQXR0YWNoZWQoKTtcbiAgICB0aGlzLl9zZXRQYW5lbENsYXNzKCk7XG4gICAgdGhpcy5fc2F2ZVByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCgpO1xuICAgIHJldHVybiB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoQ29tcG9uZW50UG9ydGFsKHBvcnRhbCk7XG4gIH1cblxuICAvKiogQXR0YWNoIGEgdGVtcGxhdGUgcG9ydGFsIGFzIGNvbnRlbnQgdG8gdGhpcyBib3R0b20gc2hlZXQgY29udGFpbmVyLiAqL1xuICBhdHRhY2hUZW1wbGF0ZVBvcnRhbDxDPihwb3J0YWw6IFRlbXBsYXRlUG9ydGFsPEM+KTogRW1iZWRkZWRWaWV3UmVmPEM+IHtcbiAgICB0aGlzLl92YWxpZGF0ZVBvcnRhbEF0dGFjaGVkKCk7XG4gICAgdGhpcy5fc2V0UGFuZWxDbGFzcygpO1xuICAgIHRoaXMuX3NhdmVQcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQoKTtcbiAgICByZXR1cm4gdGhpcy5fcG9ydGFsT3V0bGV0LmF0dGFjaFRlbXBsYXRlUG9ydGFsKHBvcnRhbCk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgYSBET00gcG9ydGFsIHRvIHRoZSBib3R0b20gc2hlZXQgY29udGFpbmVyLlxuICAgKiBAZGVwcmVjYXRlZCBUbyBiZSB0dXJuZWQgaW50byBhIG1ldGhvZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICovXG4gIGF0dGFjaERvbVBvcnRhbCA9IChwb3J0YWw6IERvbVBvcnRhbCkgPT4ge1xuICAgIHRoaXMuX3ZhbGlkYXRlUG9ydGFsQXR0YWNoZWQoKTtcbiAgICB0aGlzLl9zZXRQYW5lbENsYXNzKCk7XG4gICAgdGhpcy5fc2F2ZVByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCgpO1xuICAgIHJldHVybiB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoRG9tUG9ydGFsKHBvcnRhbCk7XG4gIH1cblxuICAvKiogQmVnaW4gYW5pbWF0aW9uIG9mIGJvdHRvbSBzaGVldCBlbnRyYW5jZSBpbnRvIHZpZXcuICovXG4gIGVudGVyKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fZGVzdHJveWVkKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9ICd2aXNpYmxlJztcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQmVnaW4gYW5pbWF0aW9uIG9mIHRoZSBib3R0b20gc2hlZXQgZXhpdGluZyBmcm9tIHZpZXcuICovXG4gIGV4aXQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9kZXN0cm95ZWQpIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ2hpZGRlbic7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9icmVha3BvaW50U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcbiAgfVxuXG4gIF9vbkFuaW1hdGlvbkRvbmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICdoaWRkZW4nKSB7XG4gICAgICB0aGlzLl9yZXN0b3JlRm9jdXMoKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgdGhpcy5fdHJhcEZvY3VzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgX29uQW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdG9nZ2xlQ2xhc3MoY3NzQ2xhc3M6IHN0cmluZywgYWRkOiBib29sZWFuKSB7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdDtcbiAgICBhZGQgPyBjbGFzc0xpc3QuYWRkKGNzc0NsYXNzKSA6IGNsYXNzTGlzdC5yZW1vdmUoY3NzQ2xhc3MpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdmFsaWRhdGVQb3J0YWxBdHRhY2hlZCgpIHtcbiAgICBpZiAodGhpcy5fcG9ydGFsT3V0bGV0Lmhhc0F0dGFjaGVkKCkgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IEVycm9yKCdBdHRlbXB0aW5nIHRvIGF0dGFjaCBib3R0b20gc2hlZXQgY29udGVudCBhZnRlciBjb250ZW50IGlzIGFscmVhZHkgYXR0YWNoZWQnKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zZXRQYW5lbENsYXNzKCkge1xuICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IHBhbmVsQ2xhc3MgPSB0aGlzLmJvdHRvbVNoZWV0Q29uZmlnLnBhbmVsQ2xhc3M7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShwYW5lbENsYXNzKSkge1xuICAgICAgLy8gTm90ZSB0aGF0IHdlIGNhbid0IHVzZSBhIHNwcmVhZCBoZXJlLCBiZWNhdXNlIElFIGRvZXNuJ3Qgc3VwcG9ydCBtdWx0aXBsZSBhcmd1bWVudHMuXG4gICAgICBwYW5lbENsYXNzLmZvckVhY2goY3NzQ2xhc3MgPT4gZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNzc0NsYXNzKSk7XG4gICAgfSBlbHNlIGlmIChwYW5lbENsYXNzKSB7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQocGFuZWxDbGFzcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIE1vdmVzIHRoZSBmb2N1cyBpbnNpZGUgdGhlIGZvY3VzIHRyYXAuICovXG4gIHByaXZhdGUgX3RyYXBGb2N1cygpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKCF0aGlzLl9mb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX2ZvY3VzVHJhcCA9IHRoaXMuX2ZvY3VzVHJhcEZhY3RvcnkuY3JlYXRlKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmJvdHRvbVNoZWV0Q29uZmlnLmF1dG9Gb2N1cykge1xuICAgICAgdGhpcy5fZm9jdXNUcmFwLmZvY3VzSW5pdGlhbEVsZW1lbnRXaGVuUmVhZHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IHRoaXMuX2dldEFjdGl2ZUVsZW1lbnQoKTtcblxuICAgICAgLy8gT3RoZXJ3aXNlIGVuc3VyZSB0aGF0IGZvY3VzIGlzIG9uIHRoZSBjb250YWluZXIuIEl0J3MgcG9zc2libGUgdGhhdCBhIGRpZmZlcmVudFxuICAgICAgLy8gY29tcG9uZW50IHRyaWVkIHRvIG1vdmUgZm9jdXMgd2hpbGUgdGhlIG9wZW4gYW5pbWF0aW9uIHdhcyBydW5uaW5nLiBTZWU6XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xNjIxNS4gTm90ZSB0aGF0IHdlIG9ubHkgd2FudCB0byBkbyB0aGlzXG4gICAgICAvLyBpZiB0aGUgZm9jdXMgaXNuJ3QgaW5zaWRlIHRoZSBib3R0b20gc2hlZXQgYWxyZWFkeSwgYmVjYXVzZSBpdCdzIHBvc3NpYmxlIHRoYXQgdGhlXG4gICAgICAvLyBjb25zdW1lciB0dXJuZWQgb2ZmIGBhdXRvRm9jdXNgIGluIG9yZGVyIHRvIG1vdmUgZm9jdXMgdGhlbXNlbHZlcy5cbiAgICAgIGlmIChhY3RpdmVFbGVtZW50ICE9PSBlbGVtZW50ICYmICFlbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogUmVzdG9yZXMgZm9jdXMgdG8gdGhlIGVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGJvdHRvbSBzaGVldCB3YXMgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9yZXN0b3JlRm9jdXMoKSB7XG4gICAgY29uc3QgdG9Gb2N1cyA9IHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlT3BlbmVkO1xuXG4gICAgLy8gV2UgbmVlZCB0aGUgZXh0cmEgY2hlY2ssIGJlY2F1c2UgSUUgY2FuIHNldCB0aGUgYGFjdGl2ZUVsZW1lbnRgIHRvIG51bGwgaW4gc29tZSBjYXNlcy5cbiAgICBpZiAodGhpcy5ib3R0b21TaGVldENvbmZpZy5yZXN0b3JlRm9jdXMgJiYgdG9Gb2N1cyAmJiB0eXBlb2YgdG9Gb2N1cy5mb2N1cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IHRoaXMuX2dldEFjdGl2ZUVsZW1lbnQoKTtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IGZvY3VzIGlzIHN0aWxsIGluc2lkZSB0aGUgYm90dG9tIHNoZWV0IG9yIGlzIG9uIHRoZSBib2R5ICh1c3VhbGx5IGJlY2F1c2UgYVxuICAgICAgLy8gbm9uLWZvY3VzYWJsZSBlbGVtZW50IGxpa2UgdGhlIGJhY2tkcm9wIHdhcyBjbGlja2VkKSBiZWZvcmUgbW92aW5nIGl0LiBJdCdzIHBvc3NpYmxlIHRoYXRcbiAgICAgIC8vIHRoZSBjb25zdW1lciBtb3ZlZCBpdCB0aGVtc2VsdmVzIGJlZm9yZSB0aGUgYW5pbWF0aW9uIHdhcyBkb25lLCBpbiB3aGljaCBjYXNlIHdlIHNob3VsZG4ndFxuICAgICAgLy8gZG8gYW55dGhpbmcuXG4gICAgICBpZiAoIWFjdGl2ZUVsZW1lbnQgfHwgYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5fZG9jdW1lbnQuYm9keSB8fCBhY3RpdmVFbGVtZW50ID09PSBlbGVtZW50IHx8XG4gICAgICAgIGVsZW1lbnQuY29udGFpbnMoYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgdG9Gb2N1cy5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9mb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX2ZvY3VzVHJhcC5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNhdmVzIGEgcmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBib3R0b20gc2hlZXQgd2FzIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfc2F2ZVByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCgpIHtcbiAgICB0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZU9wZW5lZCA9IHRoaXMuX2dldEFjdGl2ZUVsZW1lbnQoKTtcblxuICAgIC8vIFRoZSBgZm9jdXNgIG1ldGhvZCBpc24ndCBhdmFpbGFibGUgZHVyaW5nIHNlcnZlci1zaWRlIHJlbmRlcmluZy5cbiAgICBpZiAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKSB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY3VycmVudGx5LWZvY3VzZWQgZWxlbWVudCBvbiB0aGUgcGFnZS4gKi9cbiAgcHJpdmF0ZSBfZ2V0QWN0aXZlRWxlbWVudCgpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICAgIC8vIElmIHRoZSBgYWN0aXZlRWxlbWVudGAgaXMgaW5zaWRlIGEgc2hhZG93IHJvb3QsIGBkb2N1bWVudC5hY3RpdmVFbGVtZW50YCB3aWxsXG4gICAgLy8gcG9pbnQgdG8gdGhlIHNoYWRvdyByb290IHNvIHdlIGhhdmUgdG8gZGVzY2VuZCBpbnRvIGl0IG91cnNlbHZlcy5cbiAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICByZXR1cm4gYWN0aXZlRWxlbWVudD8uc2hhZG93Um9vdD8uYWN0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCB8fCBhY3RpdmVFbGVtZW50O1xuICB9XG59XG4iXX0=