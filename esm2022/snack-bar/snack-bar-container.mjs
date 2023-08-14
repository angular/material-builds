/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, NgZone, ViewChild, ViewEncapsulation, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { matSnackBarAnimations } from './snack-bar-animations';
import { BasePortalOutlet, CdkPortalOutlet, } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { take } from 'rxjs/operators';
import { MatSnackBarConfig } from './snack-bar-config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
import * as i2 from "./snack-bar-config";
import * as i3 from "@angular/cdk/portal";
let uniqueId = 0;
/**
 * Internal component that wraps user-provided snack bar content.
 * @docs-private
 */
export class MatSnackBarContainer extends BasePortalOutlet {
    constructor(_ngZone, _elementRef, _changeDetectorRef, _platform, 
    /** The snack bar configuration. */
    snackBarConfig) {
        super();
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._platform = _platform;
        this.snackBarConfig = snackBarConfig;
        this._document = inject(DOCUMENT);
        this._trackedModals = new Set();
        /** The number of milliseconds to wait before announcing the snack bar's content. */
        this._announceDelay = 150;
        /** Whether the component has been destroyed. */
        this._destroyed = false;
        /** Subject for notifying that the snack bar has announced to screen readers. */
        this._onAnnounce = new Subject();
        /** Subject for notifying that the snack bar has exited from view. */
        this._onExit = new Subject();
        /** Subject for notifying that the snack bar has finished entering the view. */
        this._onEnter = new Subject();
        /** The state of the snack bar animations. */
        this._animationState = 'void';
        /** Unique ID of the aria-live element. */
        this._liveElementId = `mat-snack-bar-container-live-${uniqueId++}`;
        /**
         * Attaches a DOM portal to the snack bar container.
         * @deprecated To be turned into a method.
         * @breaking-change 10.0.0
         */
        this.attachDomPortal = (portal) => {
            this._assertNotAttached();
            const result = this._portalOutlet.attachDomPortal(portal);
            this._afterPortalAttached();
            return result;
        };
        // Use aria-live rather than a live role like 'alert' or 'status'
        // because NVDA and JAWS have show inconsistent behavior with live roles.
        if (snackBarConfig.politeness === 'assertive' && !snackBarConfig.announcementMessage) {
            this._live = 'assertive';
        }
        else if (snackBarConfig.politeness === 'off') {
            this._live = 'off';
        }
        else {
            this._live = 'polite';
        }
        // Only set role for Firefox. Set role based on aria-live because setting role="alert" implies
        // aria-live="assertive" which may cause issues if aria-live is set to "polite" above.
        if (this._platform.FIREFOX) {
            if (this._live === 'polite') {
                this._role = 'status';
            }
            if (this._live === 'assertive') {
                this._role = 'alert';
            }
        }
    }
    /** Attach a component portal as content to this snack bar container. */
    attachComponentPortal(portal) {
        this._assertNotAttached();
        const result = this._portalOutlet.attachComponentPortal(portal);
        this._afterPortalAttached();
        return result;
    }
    /** Attach a template portal as content to this snack bar container. */
    attachTemplatePortal(portal) {
        this._assertNotAttached();
        const result = this._portalOutlet.attachTemplatePortal(portal);
        this._afterPortalAttached();
        return result;
    }
    /** Handle end of animations, updating the state of the snackbar. */
    onAnimationEnd(event) {
        const { fromState, toState } = event;
        if ((toState === 'void' && fromState !== 'void') || toState === 'hidden') {
            this._completeExit();
        }
        if (toState === 'visible') {
            // Note: we shouldn't use `this` inside the zone callback,
            // because it can cause a memory leak.
            const onEnter = this._onEnter;
            this._ngZone.run(() => {
                onEnter.next();
                onEnter.complete();
            });
        }
    }
    /** Begin animation of snack bar entrance into view. */
    enter() {
        if (!this._destroyed) {
            this._animationState = 'visible';
            this._changeDetectorRef.detectChanges();
            this._screenReaderAnnounce();
        }
    }
    /** Begin animation of the snack bar exiting from view. */
    exit() {
        // It's common for snack bars to be opened by random outside calls like HTTP requests or
        // errors. Run inside the NgZone to ensure that it functions correctly.
        this._ngZone.run(() => {
            // Note: this one transitions to `hidden`, rather than `void`, in order to handle the case
            // where multiple snack bars are opened in quick succession (e.g. two consecutive calls to
            // `MatSnackBar.open`).
            this._animationState = 'hidden';
            // Mark this element with an 'exit' attribute to indicate that the snackbar has
            // been dismissed and will soon be removed from the DOM. This is used by the snackbar
            // test harness.
            this._elementRef.nativeElement.setAttribute('mat-exit', '');
            // If the snack bar hasn't been announced by the time it exits it wouldn't have been open
            // long enough to visually read it either, so clear the timeout for announcing.
            clearTimeout(this._announceTimeoutId);
        });
        return this._onExit;
    }
    /** Makes sure the exit callbacks have been invoked when the element is destroyed. */
    ngOnDestroy() {
        this._destroyed = true;
        this._clearFromModals();
        this._completeExit();
    }
    /**
     * Waits for the zone to settle before removing the element. Helps prevent
     * errors where we end up removing an element which is in the middle of an animation.
     */
    _completeExit() {
        this._ngZone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => {
            this._ngZone.run(() => {
                this._onExit.next();
                this._onExit.complete();
            });
        });
    }
    /**
     * Called after the portal contents have been attached. Can be
     * used to modify the DOM once it's guaranteed to be in place.
     */
    _afterPortalAttached() {
        const element = this._elementRef.nativeElement;
        const panelClasses = this.snackBarConfig.panelClass;
        if (panelClasses) {
            if (Array.isArray(panelClasses)) {
                // Note that we can't use a spread here, because IE doesn't support multiple arguments.
                panelClasses.forEach(cssClass => element.classList.add(cssClass));
            }
            else {
                element.classList.add(panelClasses);
            }
        }
        this._exposeToModals();
        // Check to see if the attached component or template uses the MDC template structure,
        // specifically the MDC label. If not, the container should apply the MDC label class to this
        // component's label container, which will apply MDC's label styles to the attached view.
        const label = this._label.nativeElement;
        const labelClass = 'mdc-snackbar__label';
        label.classList.toggle(labelClass, !label.querySelector(`.${labelClass}`));
    }
    /**
     * Some browsers won't expose the accessibility node of the live element if there is an
     * `aria-modal` and the live element is outside of it. This method works around the issue by
     * pointing the `aria-owns` of all modals to the live element.
     */
    _exposeToModals() {
        // TODO(http://github.com/angular/components/issues/26853): consider de-duplicating this with the
        // `LiveAnnouncer` and any other usages.
        //
        // Note that the selector here is limited to CDK overlays at the moment in order to reduce the
        // section of the DOM we need to look through. This should cover all the cases we support, but
        // the selector can be expanded if it turns out to be too narrow.
        const id = this._liveElementId;
        const modals = this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');
        for (let i = 0; i < modals.length; i++) {
            const modal = modals[i];
            const ariaOwns = modal.getAttribute('aria-owns');
            this._trackedModals.add(modal);
            if (!ariaOwns) {
                modal.setAttribute('aria-owns', id);
            }
            else if (ariaOwns.indexOf(id) === -1) {
                modal.setAttribute('aria-owns', ariaOwns + ' ' + id);
            }
        }
    }
    /** Clears the references to the live element from any modals it was added to. */
    _clearFromModals() {
        this._trackedModals.forEach(modal => {
            const ariaOwns = modal.getAttribute('aria-owns');
            if (ariaOwns) {
                const newValue = ariaOwns.replace(this._liveElementId, '').trim();
                if (newValue.length > 0) {
                    modal.setAttribute('aria-owns', newValue);
                }
                else {
                    modal.removeAttribute('aria-owns');
                }
            }
        });
        this._trackedModals.clear();
    }
    /** Asserts that no content is already attached to the container. */
    _assertNotAttached() {
        if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('Attempting to attach snack bar content after content is already attached');
        }
    }
    /**
     * Starts a timeout to move the snack bar content to the live region so screen readers will
     * announce it.
     */
    _screenReaderAnnounce() {
        if (!this._announceTimeoutId) {
            this._ngZone.runOutsideAngular(() => {
                this._announceTimeoutId = setTimeout(() => {
                    const inertElement = this._elementRef.nativeElement.querySelector('[aria-hidden]');
                    const liveElement = this._elementRef.nativeElement.querySelector('[aria-live]');
                    if (inertElement && liveElement) {
                        // If an element in the snack bar content is focused before being moved
                        // track it and restore focus after moving to the live region.
                        let focusedElement = null;
                        if (this._platform.isBrowser &&
                            document.activeElement instanceof HTMLElement &&
                            inertElement.contains(document.activeElement)) {
                            focusedElement = document.activeElement;
                        }
                        inertElement.removeAttribute('aria-hidden');
                        liveElement.appendChild(inertElement);
                        focusedElement?.focus();
                        this._onAnnounce.next();
                        this._onAnnounce.complete();
                    }
                }, this._announceDelay);
            });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatSnackBarContainer, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.Platform }, { token: i2.MatSnackBarConfig }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatSnackBarContainer, selector: "mat-snack-bar-container", host: { listeners: { "@state.done": "onAnimationEnd($event)" }, properties: { "@state": "_animationState" }, classAttribute: "mdc-snackbar mat-mdc-snack-bar-container mdc-snackbar--open" }, viewQueries: [{ propertyName: "_portalOutlet", first: true, predicate: CdkPortalOutlet, descendants: true, static: true }, { propertyName: "_label", first: true, predicate: ["label"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"mdc-snackbar__surface\">\n  <!--\n    This outer label wrapper will have the class `mdc-snackbar__label` applied if\n    the attached template/component does not contain it.\n  -->\n  <div class=\"mat-mdc-snack-bar-label\" #label>\n    <!-- Initialy holds the snack bar content, will be empty after announcing to screen readers. -->\n    <div aria-hidden=\"true\">\n      <ng-template cdkPortalOutlet></ng-template>\n    </div>\n\n    <!-- Will receive the snack bar content from the non-live div, move will happen a short delay after opening -->\n    <div [attr.aria-live]=\"_live\" [attr.role]=\"_role\" [attr.id]=\"_liveElementId\"></div>\n  </div>\n</div>\n", styles: [".mdc-snackbar{display:none;position:fixed;right:0;bottom:0;left:0;align-items:center;justify-content:center;box-sizing:border-box;pointer-events:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mdc-snackbar--opening,.mdc-snackbar--open,.mdc-snackbar--closing{display:flex}.mdc-snackbar--open .mdc-snackbar__label,.mdc-snackbar--open .mdc-snackbar__actions{visibility:visible}.mdc-snackbar__surface{padding-left:0;padding-right:8px;display:flex;align-items:center;justify-content:flex-start;box-sizing:border-box;transform:scale(0.8);opacity:0}.mdc-snackbar__surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-snackbar__surface::before{border-color:CanvasText}}[dir=rtl] .mdc-snackbar__surface,.mdc-snackbar__surface[dir=rtl]{padding-left:8px;padding-right:0}.mdc-snackbar--open .mdc-snackbar__surface{transform:scale(1);opacity:1;pointer-events:auto}.mdc-snackbar--closing .mdc-snackbar__surface{transform:scale(1)}.mdc-snackbar__label{padding-left:16px;padding-right:8px;width:100%;flex-grow:1;box-sizing:border-box;margin:0;visibility:hidden;padding-top:14px;padding-bottom:14px}[dir=rtl] .mdc-snackbar__label,.mdc-snackbar__label[dir=rtl]{padding-left:8px;padding-right:16px}.mdc-snackbar__label::before{display:inline;content:attr(data-mdc-snackbar-label-text)}.mdc-snackbar__actions{display:flex;flex-shrink:0;align-items:center;box-sizing:border-box;visibility:hidden}.mdc-snackbar__action+.mdc-snackbar__dismiss{margin-left:8px;margin-right:0}[dir=rtl] .mdc-snackbar__action+.mdc-snackbar__dismiss,.mdc-snackbar__action+.mdc-snackbar__dismiss[dir=rtl]{margin-left:0;margin-right:8px}.mat-mdc-snack-bar-container{margin:8px;position:static}.mat-mdc-snack-bar-container .mdc-snackbar__surface{min-width:344px}@media(max-width: 480px),(max-width: 344px){.mat-mdc-snack-bar-container .mdc-snackbar__surface{min-width:100%}}@media(max-width: 480px),(max-width: 344px){.mat-mdc-snack-bar-container{width:100vw}}.mat-mdc-snack-bar-container .mdc-snackbar__surface{max-width:672px}.mat-mdc-snack-bar-container .mdc-snackbar__surface{box-shadow:0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)}.mat-mdc-snack-bar-container .mdc-snackbar__surface{background-color:var(--mdc-snackbar-container-color)}.mat-mdc-snack-bar-container .mdc-snackbar__surface{border-radius:var(--mdc-snackbar-container-shape)}.mat-mdc-snack-bar-container .mdc-snackbar__label{color:var(--mdc-snackbar-supporting-text-color)}.mat-mdc-snack-bar-container .mdc-snackbar__label{font-size:var(--mdc-snackbar-supporting-text-size);font-family:var(--mdc-snackbar-supporting-text-font);font-weight:var(--mdc-snackbar-supporting-text-weight);line-height:var(--mdc-snackbar-supporting-text-line-height)}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled){color:var(--mat-snack-bar-button-color);--mat-mdc-button-persistent-ripple-color: currentColor}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) .mat-ripple-element{background-color:currentColor;opacity:.1}.mat-mdc-snack-bar-container .mdc-snackbar__label::before{display:none}.mat-mdc-snack-bar-handset,.mat-mdc-snack-bar-container,.mat-mdc-snack-bar-label{flex:1 1 auto}.mat-mdc-snack-bar-handset .mdc-snackbar__surface{width:100%}"], dependencies: [{ kind: "directive", type: i3.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [matSnackBarAnimations.snackBarState], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatSnackBarContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-snack-bar-container', changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, animations: [matSnackBarAnimations.snackBarState], host: {
                        'class': 'mdc-snackbar mat-mdc-snack-bar-container mdc-snackbar--open',
                        '[@state]': '_animationState',
                        '(@state.done)': 'onAnimationEnd($event)',
                    }, template: "<div class=\"mdc-snackbar__surface\">\n  <!--\n    This outer label wrapper will have the class `mdc-snackbar__label` applied if\n    the attached template/component does not contain it.\n  -->\n  <div class=\"mat-mdc-snack-bar-label\" #label>\n    <!-- Initialy holds the snack bar content, will be empty after announcing to screen readers. -->\n    <div aria-hidden=\"true\">\n      <ng-template cdkPortalOutlet></ng-template>\n    </div>\n\n    <!-- Will receive the snack bar content from the non-live div, move will happen a short delay after opening -->\n    <div [attr.aria-live]=\"_live\" [attr.role]=\"_role\" [attr.id]=\"_liveElementId\"></div>\n  </div>\n</div>\n", styles: [".mdc-snackbar{display:none;position:fixed;right:0;bottom:0;left:0;align-items:center;justify-content:center;box-sizing:border-box;pointer-events:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mdc-snackbar--opening,.mdc-snackbar--open,.mdc-snackbar--closing{display:flex}.mdc-snackbar--open .mdc-snackbar__label,.mdc-snackbar--open .mdc-snackbar__actions{visibility:visible}.mdc-snackbar__surface{padding-left:0;padding-right:8px;display:flex;align-items:center;justify-content:flex-start;box-sizing:border-box;transform:scale(0.8);opacity:0}.mdc-snackbar__surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-snackbar__surface::before{border-color:CanvasText}}[dir=rtl] .mdc-snackbar__surface,.mdc-snackbar__surface[dir=rtl]{padding-left:8px;padding-right:0}.mdc-snackbar--open .mdc-snackbar__surface{transform:scale(1);opacity:1;pointer-events:auto}.mdc-snackbar--closing .mdc-snackbar__surface{transform:scale(1)}.mdc-snackbar__label{padding-left:16px;padding-right:8px;width:100%;flex-grow:1;box-sizing:border-box;margin:0;visibility:hidden;padding-top:14px;padding-bottom:14px}[dir=rtl] .mdc-snackbar__label,.mdc-snackbar__label[dir=rtl]{padding-left:8px;padding-right:16px}.mdc-snackbar__label::before{display:inline;content:attr(data-mdc-snackbar-label-text)}.mdc-snackbar__actions{display:flex;flex-shrink:0;align-items:center;box-sizing:border-box;visibility:hidden}.mdc-snackbar__action+.mdc-snackbar__dismiss{margin-left:8px;margin-right:0}[dir=rtl] .mdc-snackbar__action+.mdc-snackbar__dismiss,.mdc-snackbar__action+.mdc-snackbar__dismiss[dir=rtl]{margin-left:0;margin-right:8px}.mat-mdc-snack-bar-container{margin:8px;position:static}.mat-mdc-snack-bar-container .mdc-snackbar__surface{min-width:344px}@media(max-width: 480px),(max-width: 344px){.mat-mdc-snack-bar-container .mdc-snackbar__surface{min-width:100%}}@media(max-width: 480px),(max-width: 344px){.mat-mdc-snack-bar-container{width:100vw}}.mat-mdc-snack-bar-container .mdc-snackbar__surface{max-width:672px}.mat-mdc-snack-bar-container .mdc-snackbar__surface{box-shadow:0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)}.mat-mdc-snack-bar-container .mdc-snackbar__surface{background-color:var(--mdc-snackbar-container-color)}.mat-mdc-snack-bar-container .mdc-snackbar__surface{border-radius:var(--mdc-snackbar-container-shape)}.mat-mdc-snack-bar-container .mdc-snackbar__label{color:var(--mdc-snackbar-supporting-text-color)}.mat-mdc-snack-bar-container .mdc-snackbar__label{font-size:var(--mdc-snackbar-supporting-text-size);font-family:var(--mdc-snackbar-supporting-text-font);font-weight:var(--mdc-snackbar-supporting-text-weight);line-height:var(--mdc-snackbar-supporting-text-line-height)}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled){color:var(--mat-snack-bar-button-color);--mat-mdc-button-persistent-ripple-color: currentColor}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) .mat-ripple-element{background-color:currentColor;opacity:.1}.mat-mdc-snack-bar-container .mdc-snackbar__label::before{display:none}.mat-mdc-snack-bar-handset,.mat-mdc-snack-bar-container,.mat-mdc-snack-bar-label{flex:1 1 auto}.mat-mdc-snack-bar-handset .mdc-snackbar__surface{width:100%}"] }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.Platform }, { type: i2.MatSnackBarConfig }]; }, propDecorators: { _portalOutlet: [{
                type: ViewChild,
                args: [CdkPortalOutlet, { static: true }]
            }], _label: [{
                type: ViewChild,
                args: ['label', { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLWNvbnRhaW5lci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLWNvbnRhaW5lci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFFVCxVQUFVLEVBRVYsTUFBTSxFQUNOLE1BQU0sRUFFTixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM3RCxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGVBQWUsR0FJaEIsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRXpDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUvQyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7O0FBRXJELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUVqQjs7O0dBR0c7QUFrQkgsTUFBTSxPQUFPLG9CQUFxQixTQUFRLGdCQUFnQjtJQStDeEQsWUFDVSxPQUFlLEVBQ2YsV0FBb0MsRUFDcEMsa0JBQXFDLEVBQ3JDLFNBQW1CO0lBQzNCLG1DQUFtQztJQUM1QixjQUFpQztRQUV4QyxLQUFLLEVBQUUsQ0FBQztRQVBBLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixnQkFBVyxH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LEVBQUM7Z0JBc0JOLE1BQU07c0JBQXpDLFNBQVM7dUJBQUMsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50UmVmLFxuICBFbGVtZW50UmVmLFxuICBFbWJlZGRlZFZpZXdSZWYsXG4gIGluamVjdCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7bWF0U25hY2tCYXJBbmltYXRpb25zfSBmcm9tICcuL3NuYWNrLWJhci1hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIEJhc2VQb3J0YWxPdXRsZXQsXG4gIENka1BvcnRhbE91dGxldCxcbiAgQ29tcG9uZW50UG9ydGFsLFxuICBEb21Qb3J0YWwsXG4gIFRlbXBsYXRlUG9ydGFsLFxufSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0FyaWFMaXZlUG9saXRlbmVzc30gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdFNuYWNrQmFyQ29uZmlnfSBmcm9tICcuL3NuYWNrLWJhci1jb25maWcnO1xuXG5sZXQgdW5pcXVlSWQgPSAwO1xuXG4vKipcbiAqIEludGVybmFsIGNvbXBvbmVudCB0aGF0IHdyYXBzIHVzZXItcHJvdmlkZWQgc25hY2sgYmFyIGNvbnRlbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1zbmFjay1iYXItY29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICdzbmFjay1iYXItY29udGFpbmVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc25hY2stYmFyLWNvbnRhaW5lci5jc3MnXSxcbiAgLy8gSW4gSXZ5IGVtYmVkZGVkIHZpZXdzIHdpbGwgYmUgY2hhbmdlIGRldGVjdGVkIGZyb20gdGhlaXIgZGVjbGFyYXRpb24gcGxhY2UsIHJhdGhlciB0aGFuXG4gIC8vIHdoZXJlIHRoZXkgd2VyZSBzdGFtcGVkIG91dC4gVGhpcyBtZWFucyB0aGF0IHdlIGNhbid0IGhhdmUgdGhlIHNuYWNrIGJhciBjb250YWluZXIgYmUgT25QdXNoLFxuICAvLyBiZWNhdXNlIGl0IG1pZ2h0IGNhdXNlIHNuYWNrIGJhcnMgdGhhdCB3ZXJlIG9wZW5lZCBmcm9tIGEgdGVtcGxhdGUgbm90IHRvIGJlIG91dCBvZiBkYXRlLlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGFuaW1hdGlvbnM6IFttYXRTbmFja0JhckFuaW1hdGlvbnMuc25hY2tCYXJTdGF0ZV0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWRjLXNuYWNrYmFyIG1hdC1tZGMtc25hY2stYmFyLWNvbnRhaW5lciBtZGMtc25hY2tiYXItLW9wZW4nLFxuICAgICdbQHN0YXRlXSc6ICdfYW5pbWF0aW9uU3RhdGUnLFxuICAgICcoQHN0YXRlLmRvbmUpJzogJ29uQW5pbWF0aW9uRW5kKCRldmVudCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbmFja0JhckNvbnRhaW5lciBleHRlbmRzIEJhc2VQb3J0YWxPdXRsZXQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9kb2N1bWVudCA9IGluamVjdChET0NVTUVOVCk7XG4gIHByaXZhdGUgX3RyYWNrZWRNb2RhbHMgPSBuZXcgU2V0PEVsZW1lbnQ+KCk7XG5cbiAgLyoqIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIGFubm91bmNpbmcgdGhlIHNuYWNrIGJhcidzIGNvbnRlbnQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Fubm91bmNlRGVsYXk6IG51bWJlciA9IDE1MDtcblxuICAvKiogVGhlIHRpbWVvdXQgZm9yIGFubm91bmNpbmcgdGhlIHNuYWNrIGJhcidzIGNvbnRlbnQuICovXG4gIHByaXZhdGUgX2Fubm91bmNlVGltZW91dElkOiBudW1iZXI7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgcG9ydGFsIG91dGxldCBpbnNpZGUgb2YgdGhpcyBjb250YWluZXIgaW50byB3aGljaCB0aGUgc25hY2sgYmFyIGNvbnRlbnQgd2lsbCBiZSBsb2FkZWQuICovXG4gIEBWaWV3Q2hpbGQoQ2RrUG9ydGFsT3V0bGV0LCB7c3RhdGljOiB0cnVlfSkgX3BvcnRhbE91dGxldDogQ2RrUG9ydGFsT3V0bGV0O1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhhdCB0aGUgc25hY2sgYmFyIGhhcyBhbm5vdW5jZWQgdG8gc2NyZWVuIHJlYWRlcnMuICovXG4gIHJlYWRvbmx5IF9vbkFubm91bmNlOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3QoKTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoYXQgdGhlIHNuYWNrIGJhciBoYXMgZXhpdGVkIGZyb20gdmlldy4gKi9cbiAgcmVhZG9ubHkgX29uRXhpdDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGF0IHRoZSBzbmFjayBiYXIgaGFzIGZpbmlzaGVkIGVudGVyaW5nIHRoZSB2aWV3LiAqL1xuICByZWFkb25seSBfb25FbnRlcjogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgLyoqIFRoZSBzdGF0ZSBvZiB0aGUgc25hY2sgYmFyIGFuaW1hdGlvbnMuICovXG4gIF9hbmltYXRpb25TdGF0ZSA9ICd2b2lkJztcblxuICAvKiogYXJpYS1saXZlIHZhbHVlIGZvciB0aGUgbGl2ZSByZWdpb24uICovXG4gIF9saXZlOiBBcmlhTGl2ZVBvbGl0ZW5lc3M7XG5cbiAgLyoqXG4gICAqIEVsZW1lbnQgdGhhdCB3aWxsIGhhdmUgdGhlIGBtZGMtc25hY2tiYXJfX2xhYmVsYCBjbGFzcyBhcHBsaWVkIGlmIHRoZSBhdHRhY2hlZCBjb21wb25lbnRcbiAgICogb3IgdGVtcGxhdGUgZG9lcyBub3QgaGF2ZSBpdC4gVGhpcyBlbnN1cmVzIHRoYXQgdGhlIGFwcHJvcHJpYXRlIHN0cnVjdHVyZSwgdHlwb2dyYXBoeSwgYW5kXG4gICAqIGNvbG9yIGlzIGFwcGxpZWQgdG8gdGhlIGF0dGFjaGVkIHZpZXcuXG4gICAqL1xuICBAVmlld0NoaWxkKCdsYWJlbCcsIHtzdGF0aWM6IHRydWV9KSBfbGFiZWw6IEVsZW1lbnRSZWY7XG5cbiAgLyoqXG4gICAqIFJvbGUgb2YgdGhlIGxpdmUgcmVnaW9uLiBUaGlzIGlzIG9ubHkgZm9yIEZpcmVmb3ggYXMgdGhlcmUgaXMgYSBrbm93biBpc3N1ZSB3aGVyZSBGaXJlZm94ICtcbiAgICogSkFXUyBkb2VzIG5vdCByZWFkIG91dCBhcmlhLWxpdmUgbWVzc2FnZS5cbiAgICovXG4gIF9yb2xlPzogJ3N0YXR1cycgfCAnYWxlcnQnO1xuXG4gIC8qKiBVbmlxdWUgSUQgb2YgdGhlIGFyaWEtbGl2ZSBlbGVtZW50LiAqL1xuICByZWFkb25seSBfbGl2ZUVsZW1lbnRJZCA9IGBtYXQtc25hY2stYmFyLWNvbnRhaW5lci1saXZlLSR7dW5pcXVlSWQrK31gO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgLyoqIFRoZSBzbmFjayBiYXIgY29uZmlndXJhdGlvbi4gKi9cbiAgICBwdWJsaWMgc25hY2tCYXJDb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnLFxuICApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLy8gVXNlIGFyaWEtbGl2ZSByYXRoZXIgdGhhbiBhIGxpdmUgcm9sZSBsaWtlICdhbGVydCcgb3IgJ3N0YXR1cydcbiAgICAvLyBiZWNhdXNlIE5WREEgYW5kIEpBV1MgaGF2ZSBzaG93IGluY29uc2lzdGVudCBiZWhhdmlvciB3aXRoIGxpdmUgcm9sZXMuXG4gICAgaWYgKHNuYWNrQmFyQ29uZmlnLnBvbGl0ZW5lc3MgPT09ICdhc3NlcnRpdmUnICYmICFzbmFja0JhckNvbmZpZy5hbm5vdW5jZW1lbnRNZXNzYWdlKSB7XG4gICAgICB0aGlzLl9saXZlID0gJ2Fzc2VydGl2ZSc7XG4gICAgfSBlbHNlIGlmIChzbmFja0JhckNvbmZpZy5wb2xpdGVuZXNzID09PSAnb2ZmJykge1xuICAgICAgdGhpcy5fbGl2ZSA9ICdvZmYnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9saXZlID0gJ3BvbGl0ZSc7XG4gICAgfVxuXG4gICAgLy8gT25seSBzZXQgcm9sZSBmb3IgRmlyZWZveC4gU2V0IHJvbGUgYmFzZWQgb24gYXJpYS1saXZlIGJlY2F1c2Ugc2V0dGluZyByb2xlPVwiYWxlcnRcIiBpbXBsaWVzXG4gICAgLy8gYXJpYS1saXZlPVwiYXNzZXJ0aXZlXCIgd2hpY2ggbWF5IGNhdXNlIGlzc3VlcyBpZiBhcmlhLWxpdmUgaXMgc2V0IHRvIFwicG9saXRlXCIgYWJvdmUuXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLkZJUkVGT1gpIHtcbiAgICAgIGlmICh0aGlzLl9saXZlID09PSAncG9saXRlJykge1xuICAgICAgICB0aGlzLl9yb2xlID0gJ3N0YXR1cyc7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fbGl2ZSA9PT0gJ2Fzc2VydGl2ZScpIHtcbiAgICAgICAgdGhpcy5fcm9sZSA9ICdhbGVydCc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEF0dGFjaCBhIGNvbXBvbmVudCBwb3J0YWwgYXMgY29udGVudCB0byB0aGlzIHNuYWNrIGJhciBjb250YWluZXIuICovXG4gIGF0dGFjaENvbXBvbmVudFBvcnRhbDxUPihwb3J0YWw6IENvbXBvbmVudFBvcnRhbDxUPik6IENvbXBvbmVudFJlZjxUPiB7XG4gICAgdGhpcy5fYXNzZXJ0Tm90QXR0YWNoZWQoKTtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoQ29tcG9uZW50UG9ydGFsKHBvcnRhbCk7XG4gICAgdGhpcy5fYWZ0ZXJQb3J0YWxBdHRhY2hlZCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQXR0YWNoIGEgdGVtcGxhdGUgcG9ydGFsIGFzIGNvbnRlbnQgdG8gdGhpcyBzbmFjayBiYXIgY29udGFpbmVyLiAqL1xuICBhdHRhY2hUZW1wbGF0ZVBvcnRhbDxDPihwb3J0YWw6IFRlbXBsYXRlUG9ydGFsPEM+KTogRW1iZWRkZWRWaWV3UmVmPEM+IHtcbiAgICB0aGlzLl9hc3NlcnROb3RBdHRhY2hlZCgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hUZW1wbGF0ZVBvcnRhbChwb3J0YWwpO1xuICAgIHRoaXMuX2FmdGVyUG9ydGFsQXR0YWNoZWQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIGEgRE9NIHBvcnRhbCB0byB0aGUgc25hY2sgYmFyIGNvbnRhaW5lci5cbiAgICogQGRlcHJlY2F0ZWQgVG8gYmUgdHVybmVkIGludG8gYSBtZXRob2QuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAqL1xuICBvdmVycmlkZSBhdHRhY2hEb21Qb3J0YWwgPSAocG9ydGFsOiBEb21Qb3J0YWwpID0+IHtcbiAgICB0aGlzLl9hc3NlcnROb3RBdHRhY2hlZCgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hEb21Qb3J0YWwocG9ydGFsKTtcbiAgICB0aGlzLl9hZnRlclBvcnRhbEF0dGFjaGVkKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvKiogSGFuZGxlIGVuZCBvZiBhbmltYXRpb25zLCB1cGRhdGluZyB0aGUgc3RhdGUgb2YgdGhlIHNuYWNrYmFyLiAqL1xuICBvbkFuaW1hdGlvbkVuZChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICBjb25zdCB7ZnJvbVN0YXRlLCB0b1N0YXRlfSA9IGV2ZW50O1xuXG4gICAgaWYgKCh0b1N0YXRlID09PSAndm9pZCcgJiYgZnJvbVN0YXRlICE9PSAndm9pZCcpIHx8IHRvU3RhdGUgPT09ICdoaWRkZW4nKSB7XG4gICAgICB0aGlzLl9jb21wbGV0ZUV4aXQoKTtcbiAgICB9XG5cbiAgICBpZiAodG9TdGF0ZSA9PT0gJ3Zpc2libGUnKSB7XG4gICAgICAvLyBOb3RlOiB3ZSBzaG91bGRuJ3QgdXNlIGB0aGlzYCBpbnNpZGUgdGhlIHpvbmUgY2FsbGJhY2ssXG4gICAgICAvLyBiZWNhdXNlIGl0IGNhbiBjYXVzZSBhIG1lbW9yeSBsZWFrLlxuICAgICAgY29uc3Qgb25FbnRlciA9IHRoaXMuX29uRW50ZXI7XG5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBvbkVudGVyLm5leHQoKTtcbiAgICAgICAgb25FbnRlci5jb21wbGV0ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEJlZ2luIGFuaW1hdGlvbiBvZiBzbmFjayBiYXIgZW50cmFuY2UgaW50byB2aWV3LiAqL1xuICBlbnRlcigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2Rlc3Ryb3llZCkge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSAndmlzaWJsZSc7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl9zY3JlZW5SZWFkZXJBbm5vdW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBCZWdpbiBhbmltYXRpb24gb2YgdGhlIHNuYWNrIGJhciBleGl0aW5nIGZyb20gdmlldy4gKi9cbiAgZXhpdCgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICAvLyBJdCdzIGNvbW1vbiBmb3Igc25hY2sgYmFycyB0byBiZSBvcGVuZWQgYnkgcmFuZG9tIG91dHNpZGUgY2FsbHMgbGlrZSBIVFRQIHJlcXVlc3RzIG9yXG4gICAgLy8gZXJyb3JzLiBSdW4gaW5zaWRlIHRoZSBOZ1pvbmUgdG8gZW5zdXJlIHRoYXQgaXQgZnVuY3Rpb25zIGNvcnJlY3RseS5cbiAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgIC8vIE5vdGU6IHRoaXMgb25lIHRyYW5zaXRpb25zIHRvIGBoaWRkZW5gLCByYXRoZXIgdGhhbiBgdm9pZGAsIGluIG9yZGVyIHRvIGhhbmRsZSB0aGUgY2FzZVxuICAgICAgLy8gd2hlcmUgbXVsdGlwbGUgc25hY2sgYmFycyBhcmUgb3BlbmVkIGluIHF1aWNrIHN1Y2Nlc3Npb24gKGUuZy4gdHdvIGNvbnNlY3V0aXZlIGNhbGxzIHRvXG4gICAgICAvLyBgTWF0U25hY2tCYXIub3BlbmApLlxuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSAnaGlkZGVuJztcblxuICAgICAgLy8gTWFyayB0aGlzIGVsZW1lbnQgd2l0aCBhbiAnZXhpdCcgYXR0cmlidXRlIHRvIGluZGljYXRlIHRoYXQgdGhlIHNuYWNrYmFyIGhhc1xuICAgICAgLy8gYmVlbiBkaXNtaXNzZWQgYW5kIHdpbGwgc29vbiBiZSByZW1vdmVkIGZyb20gdGhlIERPTS4gVGhpcyBpcyB1c2VkIGJ5IHRoZSBzbmFja2JhclxuICAgICAgLy8gdGVzdCBoYXJuZXNzLlxuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnbWF0LWV4aXQnLCAnJyk7XG5cbiAgICAgIC8vIElmIHRoZSBzbmFjayBiYXIgaGFzbid0IGJlZW4gYW5ub3VuY2VkIGJ5IHRoZSB0aW1lIGl0IGV4aXRzIGl0IHdvdWxkbid0IGhhdmUgYmVlbiBvcGVuXG4gICAgICAvLyBsb25nIGVub3VnaCB0byB2aXN1YWxseSByZWFkIGl0IGVpdGhlciwgc28gY2xlYXIgdGhlIHRpbWVvdXQgZm9yIGFubm91bmNpbmcuXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fYW5ub3VuY2VUaW1lb3V0SWQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuX29uRXhpdDtcbiAgfVxuXG4gIC8qKiBNYWtlcyBzdXJlIHRoZSBleGl0IGNhbGxiYWNrcyBoYXZlIGJlZW4gaW52b2tlZCB3aGVuIHRoZSBlbGVtZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLl9jbGVhckZyb21Nb2RhbHMoKTtcbiAgICB0aGlzLl9jb21wbGV0ZUV4aXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXYWl0cyBmb3IgdGhlIHpvbmUgdG8gc2V0dGxlIGJlZm9yZSByZW1vdmluZyB0aGUgZWxlbWVudC4gSGVscHMgcHJldmVudFxuICAgKiBlcnJvcnMgd2hlcmUgd2UgZW5kIHVwIHJlbW92aW5nIGFuIGVsZW1lbnQgd2hpY2ggaXMgaW4gdGhlIG1pZGRsZSBvZiBhbiBhbmltYXRpb24uXG4gICAqL1xuICBwcml2YXRlIF9jb21wbGV0ZUV4aXQoKSB7XG4gICAgdGhpcy5fbmdab25lLm9uTWljcm90YXNrRW1wdHkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMuX29uRXhpdC5uZXh0KCk7XG4gICAgICAgIHRoaXMuX29uRXhpdC5jb21wbGV0ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIGFmdGVyIHRoZSBwb3J0YWwgY29udGVudHMgaGF2ZSBiZWVuIGF0dGFjaGVkLiBDYW4gYmVcbiAgICogdXNlZCB0byBtb2RpZnkgdGhlIERPTSBvbmNlIGl0J3MgZ3VhcmFudGVlZCB0byBiZSBpbiBwbGFjZS5cbiAgICovXG4gIHByaXZhdGUgX2FmdGVyUG9ydGFsQXR0YWNoZWQoKSB7XG4gICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgcGFuZWxDbGFzc2VzID0gdGhpcy5zbmFja0JhckNvbmZpZy5wYW5lbENsYXNzO1xuXG4gICAgaWYgKHBhbmVsQ2xhc3Nlcykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFuZWxDbGFzc2VzKSkge1xuICAgICAgICAvLyBOb3RlIHRoYXQgd2UgY2FuJ3QgdXNlIGEgc3ByZWFkIGhlcmUsIGJlY2F1c2UgSUUgZG9lc24ndCBzdXBwb3J0IG11bHRpcGxlIGFyZ3VtZW50cy5cbiAgICAgICAgcGFuZWxDbGFzc2VzLmZvckVhY2goY3NzQ2xhc3MgPT4gZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNzc0NsYXNzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQocGFuZWxDbGFzc2VzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9leHBvc2VUb01vZGFscygpO1xuXG4gICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBhdHRhY2hlZCBjb21wb25lbnQgb3IgdGVtcGxhdGUgdXNlcyB0aGUgTURDIHRlbXBsYXRlIHN0cnVjdHVyZSxcbiAgICAvLyBzcGVjaWZpY2FsbHkgdGhlIE1EQyBsYWJlbC4gSWYgbm90LCB0aGUgY29udGFpbmVyIHNob3VsZCBhcHBseSB0aGUgTURDIGxhYmVsIGNsYXNzIHRvIHRoaXNcbiAgICAvLyBjb21wb25lbnQncyBsYWJlbCBjb250YWluZXIsIHdoaWNoIHdpbGwgYXBwbHkgTURDJ3MgbGFiZWwgc3R5bGVzIHRvIHRoZSBhdHRhY2hlZCB2aWV3LlxuICAgIGNvbnN0IGxhYmVsID0gdGhpcy5fbGFiZWwubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBsYWJlbENsYXNzID0gJ21kYy1zbmFja2Jhcl9fbGFiZWwnO1xuICAgIGxhYmVsLmNsYXNzTGlzdC50b2dnbGUobGFiZWxDbGFzcywgIWxhYmVsLnF1ZXJ5U2VsZWN0b3IoYC4ke2xhYmVsQ2xhc3N9YCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNvbWUgYnJvd3NlcnMgd29uJ3QgZXhwb3NlIHRoZSBhY2Nlc3NpYmlsaXR5IG5vZGUgb2YgdGhlIGxpdmUgZWxlbWVudCBpZiB0aGVyZSBpcyBhblxuICAgKiBgYXJpYS1tb2RhbGAgYW5kIHRoZSBsaXZlIGVsZW1lbnQgaXMgb3V0c2lkZSBvZiBpdC4gVGhpcyBtZXRob2Qgd29ya3MgYXJvdW5kIHRoZSBpc3N1ZSBieVxuICAgKiBwb2ludGluZyB0aGUgYGFyaWEtb3duc2Agb2YgYWxsIG1vZGFscyB0byB0aGUgbGl2ZSBlbGVtZW50LlxuICAgKi9cbiAgcHJpdmF0ZSBfZXhwb3NlVG9Nb2RhbHMoKSB7XG4gICAgLy8gVE9ETyhodHRwOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzI2ODUzKTogY29uc2lkZXIgZGUtZHVwbGljYXRpbmcgdGhpcyB3aXRoIHRoZVxuICAgIC8vIGBMaXZlQW5ub3VuY2VyYCBhbmQgYW55IG90aGVyIHVzYWdlcy5cbiAgICAvL1xuICAgIC8vIE5vdGUgdGhhdCB0aGUgc2VsZWN0b3IgaGVyZSBpcyBsaW1pdGVkIHRvIENESyBvdmVybGF5cyBhdCB0aGUgbW9tZW50IGluIG9yZGVyIHRvIHJlZHVjZSB0aGVcbiAgICAvLyBzZWN0aW9uIG9mIHRoZSBET00gd2UgbmVlZCB0byBsb29rIHRocm91Z2guIFRoaXMgc2hvdWxkIGNvdmVyIGFsbCB0aGUgY2FzZXMgd2Ugc3VwcG9ydCwgYnV0XG4gICAgLy8gdGhlIHNlbGVjdG9yIGNhbiBiZSBleHBhbmRlZCBpZiBpdCB0dXJucyBvdXQgdG8gYmUgdG9vIG5hcnJvdy5cbiAgICBjb25zdCBpZCA9IHRoaXMuX2xpdmVFbGVtZW50SWQ7XG4gICAgY29uc3QgbW9kYWxzID0gdGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICdib2R5ID4gLmNkay1vdmVybGF5LWNvbnRhaW5lciBbYXJpYS1tb2RhbD1cInRydWVcIl0nLFxuICAgICk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vZGFscy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbW9kYWwgPSBtb2RhbHNbaV07XG4gICAgICBjb25zdCBhcmlhT3ducyA9IG1vZGFsLmdldEF0dHJpYnV0ZSgnYXJpYS1vd25zJyk7XG4gICAgICB0aGlzLl90cmFja2VkTW9kYWxzLmFkZChtb2RhbCk7XG5cbiAgICAgIGlmICghYXJpYU93bnMpIHtcbiAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKCdhcmlhLW93bnMnLCBpZCk7XG4gICAgICB9IGVsc2UgaWYgKGFyaWFPd25zLmluZGV4T2YoaWQpID09PSAtMSkge1xuICAgICAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtb3ducycsIGFyaWFPd25zICsgJyAnICsgaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBDbGVhcnMgdGhlIHJlZmVyZW5jZXMgdG8gdGhlIGxpdmUgZWxlbWVudCBmcm9tIGFueSBtb2RhbHMgaXQgd2FzIGFkZGVkIHRvLiAqL1xuICBwcml2YXRlIF9jbGVhckZyb21Nb2RhbHMoKSB7XG4gICAgdGhpcy5fdHJhY2tlZE1vZGFscy5mb3JFYWNoKG1vZGFsID0+IHtcbiAgICAgIGNvbnN0IGFyaWFPd25zID0gbW9kYWwuZ2V0QXR0cmlidXRlKCdhcmlhLW93bnMnKTtcblxuICAgICAgaWYgKGFyaWFPd25zKSB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gYXJpYU93bnMucmVwbGFjZSh0aGlzLl9saXZlRWxlbWVudElkLCAnJykudHJpbSgpO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKCdhcmlhLW93bnMnLCBuZXdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9kYWwucmVtb3ZlQXR0cmlidXRlKCdhcmlhLW93bnMnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX3RyYWNrZWRNb2RhbHMuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKiBBc3NlcnRzIHRoYXQgbm8gY29udGVudCBpcyBhbHJlYWR5IGF0dGFjaGVkIHRvIHRoZSBjb250YWluZXIuICovXG4gIHByaXZhdGUgX2Fzc2VydE5vdEF0dGFjaGVkKCkge1xuICAgIGlmICh0aGlzLl9wb3J0YWxPdXRsZXQuaGFzQXR0YWNoZWQoKSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0F0dGVtcHRpbmcgdG8gYXR0YWNoIHNuYWNrIGJhciBjb250ZW50IGFmdGVyIGNvbnRlbnQgaXMgYWxyZWFkeSBhdHRhY2hlZCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgYSB0aW1lb3V0IHRvIG1vdmUgdGhlIHNuYWNrIGJhciBjb250ZW50IHRvIHRoZSBsaXZlIHJlZ2lvbiBzbyBzY3JlZW4gcmVhZGVycyB3aWxsXG4gICAqIGFubm91bmNlIGl0LlxuICAgKi9cbiAgcHJpdmF0ZSBfc2NyZWVuUmVhZGVyQW5ub3VuY2UoKSB7XG4gICAgaWYgKCF0aGlzLl9hbm5vdW5jZVRpbWVvdXRJZCkge1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5fYW5ub3VuY2VUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBjb25zdCBpbmVydEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignW2FyaWEtaGlkZGVuXScpO1xuICAgICAgICAgIGNvbnN0IGxpdmVFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLWxpdmVdJyk7XG5cbiAgICAgICAgICBpZiAoaW5lcnRFbGVtZW50ICYmIGxpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBJZiBhbiBlbGVtZW50IGluIHRoZSBzbmFjayBiYXIgY29udGVudCBpcyBmb2N1c2VkIGJlZm9yZSBiZWluZyBtb3ZlZFxuICAgICAgICAgICAgLy8gdHJhY2sgaXQgYW5kIHJlc3RvcmUgZm9jdXMgYWZ0ZXIgbW92aW5nIHRvIHRoZSBsaXZlIHJlZ2lvbi5cbiAgICAgICAgICAgIGxldCBmb2N1c2VkRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyICYmXG4gICAgICAgICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJlxuICAgICAgICAgICAgICBpbmVydEVsZW1lbnQuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBmb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluZXJ0RWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG4gICAgICAgICAgICBsaXZlRWxlbWVudC5hcHBlbmRDaGlsZChpbmVydEVsZW1lbnQpO1xuICAgICAgICAgICAgZm9jdXNlZEVsZW1lbnQ/LmZvY3VzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX29uQW5ub3VuY2UubmV4dCgpO1xuICAgICAgICAgICAgdGhpcy5fb25Bbm5vdW5jZS5jb21wbGV0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcy5fYW5ub3VuY2VEZWxheSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtZGMtc25hY2tiYXJfX3N1cmZhY2VcIj5cbiAgPCEtLVxuICAgIFRoaXMgb3V0ZXIgbGFiZWwgd3JhcHBlciB3aWxsIGhhdmUgdGhlIGNsYXNzIGBtZGMtc25hY2tiYXJfX2xhYmVsYCBhcHBsaWVkIGlmXG4gICAgdGhlIGF0dGFjaGVkIHRlbXBsYXRlL2NvbXBvbmVudCBkb2VzIG5vdCBjb250YWluIGl0LlxuICAtLT5cbiAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtc25hY2stYmFyLWxhYmVsXCIgI2xhYmVsPlxuICAgIDwhLS0gSW5pdGlhbHkgaG9sZHMgdGhlIHNuYWNrIGJhciBjb250ZW50LCB3aWxsIGJlIGVtcHR5IGFmdGVyIGFubm91bmNpbmcgdG8gc2NyZWVuIHJlYWRlcnMuIC0tPlxuICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICA8bmctdGVtcGxhdGUgY2RrUG9ydGFsT3V0bGV0PjwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG5cbiAgICA8IS0tIFdpbGwgcmVjZWl2ZSB0aGUgc25hY2sgYmFyIGNvbnRlbnQgZnJvbSB0aGUgbm9uLWxpdmUgZGl2LCBtb3ZlIHdpbGwgaGFwcGVuIGEgc2hvcnQgZGVsYXkgYWZ0ZXIgb3BlbmluZyAtLT5cbiAgICA8ZGl2IFthdHRyLmFyaWEtbGl2ZV09XCJfbGl2ZVwiIFthdHRyLnJvbGVdPVwiX3JvbGVcIiBbYXR0ci5pZF09XCJfbGl2ZUVsZW1lbnRJZFwiPjwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19