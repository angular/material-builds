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
            // _animationState lives in host bindings and `detectChanges` does not refresh host bindings
            // so we have to call `markForCheck` to ensure the host view is refreshed eventually.
            this._changeDetectorRef.markForCheck();
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
            this._changeDetectorRef.markForCheck();
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatSnackBarContainer, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.Platform }, { token: i2.MatSnackBarConfig }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.1.0-next.5", type: MatSnackBarContainer, isStandalone: true, selector: "mat-snack-bar-container", host: { listeners: { "@state.done": "onAnimationEnd($event)" }, properties: { "@state": "_animationState" }, classAttribute: "mdc-snackbar mat-mdc-snack-bar-container mdc-snackbar--open" }, viewQueries: [{ propertyName: "_portalOutlet", first: true, predicate: CdkPortalOutlet, descendants: true, static: true }, { propertyName: "_label", first: true, predicate: ["label"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"mdc-snackbar__surface\">\n  <!--\n    This outer label wrapper will have the class `mdc-snackbar__label` applied if\n    the attached template/component does not contain it.\n  -->\n  <div class=\"mat-mdc-snack-bar-label\" #label>\n    <!-- Initialy holds the snack bar content, will be empty after announcing to screen readers. -->\n    <div aria-hidden=\"true\">\n      <ng-template cdkPortalOutlet />\n    </div>\n\n    <!-- Will receive the snack bar content from the non-live div, move will happen a short delay after opening -->\n    <div [attr.aria-live]=\"_live\" [attr.role]=\"_role\" [attr.id]=\"_liveElementId\"></div>\n  </div>\n</div>\n", styles: [".mdc-snackbar{display:none;position:fixed;right:0;bottom:0;left:0;align-items:center;justify-content:center;box-sizing:border-box;pointer-events:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mdc-snackbar--opening,.mdc-snackbar--open,.mdc-snackbar--closing{display:flex}.mdc-snackbar--open .mdc-snackbar__label,.mdc-snackbar--open .mdc-snackbar__actions{visibility:visible}.mdc-snackbar__surface{padding-left:0;padding-right:8px;display:flex;align-items:center;justify-content:flex-start;box-sizing:border-box;transform:scale(0.8);opacity:0}.mdc-snackbar__surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-snackbar__surface::before{border-color:CanvasText}}[dir=rtl] .mdc-snackbar__surface,.mdc-snackbar__surface[dir=rtl]{padding-left:8px;padding-right:0}.mdc-snackbar--open .mdc-snackbar__surface{transform:scale(1);opacity:1;pointer-events:auto}.mdc-snackbar--closing .mdc-snackbar__surface{transform:scale(1)}.mdc-snackbar__label{padding-left:16px;padding-right:8px;width:100%;flex-grow:1;box-sizing:border-box;margin:0;visibility:hidden;padding-top:14px;padding-bottom:14px}[dir=rtl] .mdc-snackbar__label,.mdc-snackbar__label[dir=rtl]{padding-left:8px;padding-right:16px}.mdc-snackbar__label::before{display:inline;content:attr(data-mdc-snackbar-label-text)}.mdc-snackbar__actions{display:flex;flex-shrink:0;align-items:center;box-sizing:border-box;visibility:hidden}.mdc-snackbar__action+.mdc-snackbar__dismiss{margin-left:8px;margin-right:0}[dir=rtl] .mdc-snackbar__action+.mdc-snackbar__dismiss,.mdc-snackbar__action+.mdc-snackbar__dismiss[dir=rtl]{margin-left:0;margin-right:8px}.mat-mdc-snack-bar-container{margin:8px;position:static}.mat-mdc-snack-bar-container .mdc-snackbar__surface{min-width:344px}@media(max-width: 480px),(max-width: 344px){.mat-mdc-snack-bar-container .mdc-snackbar__surface{min-width:100%}}@media(max-width: 480px),(max-width: 344px){.mat-mdc-snack-bar-container{width:100vw}}.mat-mdc-snack-bar-container .mdc-snackbar__surface{max-width:672px}.mat-mdc-snack-bar-container .mdc-snackbar__surface{box-shadow:0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)}.mat-mdc-snack-bar-container .mdc-snackbar__surface{background-color:var(--mdc-snackbar-container-color)}.mat-mdc-snack-bar-container .mdc-snackbar__surface{border-radius:var(--mdc-snackbar-container-shape)}.mat-mdc-snack-bar-container .mdc-snackbar__label{color:var(--mdc-snackbar-supporting-text-color)}.mat-mdc-snack-bar-container .mdc-snackbar__label{font-size:var(--mdc-snackbar-supporting-text-size);font-family:var(--mdc-snackbar-supporting-text-font);font-weight:var(--mdc-snackbar-supporting-text-weight);line-height:var(--mdc-snackbar-supporting-text-line-height)}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled){color:var(--mat-snack-bar-button-color);--mat-text-button-state-layer-color:currentColor;--mat-text-button-ripple-color:currentColor}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) .mat-ripple-element{opacity:.1}.mat-mdc-snack-bar-container .mdc-snackbar__label::before{display:none}.mat-mdc-snack-bar-handset,.mat-mdc-snack-bar-container,.mat-mdc-snack-bar-label{flex:1 1 auto}.mat-mdc-snack-bar-handset .mdc-snackbar__surface{width:100%}"], dependencies: [{ kind: "directive", type: CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [matSnackBarAnimations.snackBarState], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatSnackBarContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-snack-bar-container', changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, animations: [matSnackBarAnimations.snackBarState], standalone: true, imports: [CdkPortalOutlet], host: {
                        'class': 'mdc-snackbar mat-mdc-snack-bar-container mdc-snackbar--open',
                        '[@state]': '_animationState',
                        '(@state.done)': 'onAnimationEnd($event)',
                    }, template: "<div class=\"mdc-snackbar__surface\">\n  <!--\n    This outer label wrapper will have the class `mdc-snackbar__label` applied if\n    the attached template/component does not contain it.\n  -->\n  <div class=\"mat-mdc-snack-bar-label\" #label>\n    <!-- Initialy holds the snack bar content, will be empty after announcing to screen readers. -->\n    <div aria-hidden=\"true\">\n      <ng-template cdkPortalOutlet />\n    </div>\n\n    <!-- Will receive the snack bar content from the non-live div, move will happen a short delay after opening -->\n    <div [attr.aria-live]=\"_live\" [attr.role]=\"_role\" [attr.id]=\"_liveElementId\"></div>\n  </div>\n</div>\n", styles: [".mdc-snackbar{display:none;position:fixed;right:0;bottom:0;left:0;align-items:center;justify-content:center;box-sizing:border-box;pointer-events:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mdc-snackbar--opening,.mdc-snackbar--open,.mdc-snackbar--closing{display:flex}.mdc-snackbar--open .mdc-snackbar__label,.mdc-snackbar--open .mdc-snackbar__actions{visibility:visible}.mdc-snackbar__surface{padding-left:0;padding-right:8px;display:flex;align-items:center;justify-content:flex-start;box-sizing:border-box;transform:scale(0.8);opacity:0}.mdc-snackbar__surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-snackbar__surface::before{border-color:CanvasText}}[dir=rtl] .mdc-snackbar__surface,.mdc-snackbar__surface[dir=rtl]{padding-left:8px;padding-right:0}.mdc-snackbar--open .mdc-snackbar__surface{transform:scale(1);opacity:1;pointer-events:auto}.mdc-snackbar--closing .mdc-snackbar__surface{transform:scale(1)}.mdc-snackbar__label{padding-left:16px;padding-right:8px;width:100%;flex-grow:1;box-sizing:border-box;margin:0;visibility:hidden;padding-top:14px;padding-bottom:14px}[dir=rtl] .mdc-snackbar__label,.mdc-snackbar__label[dir=rtl]{padding-left:8px;padding-right:16px}.mdc-snackbar__label::before{display:inline;content:attr(data-mdc-snackbar-label-text)}.mdc-snackbar__actions{display:flex;flex-shrink:0;align-items:center;box-sizing:border-box;visibility:hidden}.mdc-snackbar__action+.mdc-snackbar__dismiss{margin-left:8px;margin-right:0}[dir=rtl] .mdc-snackbar__action+.mdc-snackbar__dismiss,.mdc-snackbar__action+.mdc-snackbar__dismiss[dir=rtl]{margin-left:0;margin-right:8px}.mat-mdc-snack-bar-container{margin:8px;position:static}.mat-mdc-snack-bar-container .mdc-snackbar__surface{min-width:344px}@media(max-width: 480px),(max-width: 344px){.mat-mdc-snack-bar-container .mdc-snackbar__surface{min-width:100%}}@media(max-width: 480px),(max-width: 344px){.mat-mdc-snack-bar-container{width:100vw}}.mat-mdc-snack-bar-container .mdc-snackbar__surface{max-width:672px}.mat-mdc-snack-bar-container .mdc-snackbar__surface{box-shadow:0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)}.mat-mdc-snack-bar-container .mdc-snackbar__surface{background-color:var(--mdc-snackbar-container-color)}.mat-mdc-snack-bar-container .mdc-snackbar__surface{border-radius:var(--mdc-snackbar-container-shape)}.mat-mdc-snack-bar-container .mdc-snackbar__label{color:var(--mdc-snackbar-supporting-text-color)}.mat-mdc-snack-bar-container .mdc-snackbar__label{font-size:var(--mdc-snackbar-supporting-text-size);font-family:var(--mdc-snackbar-supporting-text-font);font-weight:var(--mdc-snackbar-supporting-text-weight);line-height:var(--mdc-snackbar-supporting-text-line-height)}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled){color:var(--mat-snack-bar-button-color);--mat-text-button-state-layer-color:currentColor;--mat-text-button-ripple-color:currentColor}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) .mat-ripple-element{opacity:.1}.mat-mdc-snack-bar-container .mdc-snackbar__label::before{display:none}.mat-mdc-snack-bar-handset,.mat-mdc-snack-bar-container,.mat-mdc-snack-bar-label{flex:1 1 auto}.mat-mdc-snack-bar-handset .mdc-snackbar__surface{width:100%}"] }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.Platform }, { type: i2.MatSnackBarConfig }], propDecorators: { _portalOutlet: [{
                type: ViewChild,
                args: [CdkPortalOutlet, { static: true }]
            }], _label: [{
                type: ViewChild,
                args: ['label', { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLWNvbnRhaW5lci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLWNvbnRhaW5lci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFFVCxVQUFVLEVBRVYsTUFBTSxFQUNOLE1BQU0sRUFFTixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM3RCxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGVBQWUsR0FJaEIsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRXpDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUvQyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7QUFFckQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBRWpCOzs7R0FHRztBQW9CSCxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsZ0JBQWdCO0lBK0N4RCxZQUNVLE9BQWUsRUFDZixXQUFvQyxFQUNwQyxrQkFBcUMsRUFDckMsU0FBbUI7SUFDM0IsbUNBQW1DO0lBQzVCLGNBQWlDO1FBRXhDLEtBQUssRUFBRSxDQUFDO1FBUEEsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGdCQUFXLEdB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b0IsZ1VBY3BCLGVBQWUscUxDNUU1Qix3cEJBZUEsaThHRHdDWSxlQUFlLG1JQUZiLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDOztrR0FTdEMsb0JBQW9CO2tCQW5CaEMsU0FBUzsrQkFDRSx5QkFBeUIsbUJBT2xCLHVCQUF1QixDQUFDLE9BQU8saUJBQ2pDLGlCQUFpQixDQUFDLElBQUksY0FDekIsQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsY0FDckMsSUFBSSxXQUNQLENBQUMsZUFBZSxDQUFDLFFBQ3BCO3dCQUNKLE9BQU8sRUFBRSw2REFBNkQ7d0JBQ3RFLFVBQVUsRUFBRSxpQkFBaUI7d0JBQzdCLGVBQWUsRUFBRSx3QkFBd0I7cUJBQzFDOzJMQWdCMkMsYUFBYTtzQkFBeEQsU0FBUzt1QkFBQyxlQUFlLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2dCQXNCTixNQUFNO3NCQUF6QyxTQUFTO3VCQUFDLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRWxlbWVudFJlZixcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBpbmplY3QsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge21hdFNuYWNrQmFyQW5pbWF0aW9uc30gZnJvbSAnLi9zbmFjay1iYXItYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBCYXNlUG9ydGFsT3V0bGV0LFxuICBDZGtQb3J0YWxPdXRsZXQsXG4gIENvbXBvbmVudFBvcnRhbCxcbiAgRG9tUG9ydGFsLFxuICBUZW1wbGF0ZVBvcnRhbCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtBcmlhTGl2ZVBvbGl0ZW5lc3N9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRTbmFja0JhckNvbmZpZ30gZnJvbSAnLi9zbmFjay1iYXItY29uZmlnJztcblxubGV0IHVuaXF1ZUlkID0gMDtcblxuLyoqXG4gKiBJbnRlcm5hbCBjb21wb25lbnQgdGhhdCB3cmFwcyB1c2VyLXByb3ZpZGVkIHNuYWNrIGJhciBjb250ZW50LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc25hY2stYmFyLWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlVXJsOiAnc25hY2stYmFyLWNvbnRhaW5lci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3NuYWNrLWJhci1jb250YWluZXIuY3NzJ10sXG4gIC8vIEluIEl2eSBlbWJlZGRlZCB2aWV3cyB3aWxsIGJlIGNoYW5nZSBkZXRlY3RlZCBmcm9tIHRoZWlyIGRlY2xhcmF0aW9uIHBsYWNlLCByYXRoZXIgdGhhblxuICAvLyB3aGVyZSB0aGV5IHdlcmUgc3RhbXBlZCBvdXQuIFRoaXMgbWVhbnMgdGhhdCB3ZSBjYW4ndCBoYXZlIHRoZSBzbmFjayBiYXIgY29udGFpbmVyIGJlIE9uUHVzaCxcbiAgLy8gYmVjYXVzZSBpdCBtaWdodCBjYXVzZSBzbmFjayBiYXJzIHRoYXQgd2VyZSBvcGVuZWQgZnJvbSBhIHRlbXBsYXRlIG5vdCB0byBiZSBvdXQgb2YgZGF0ZS5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBhbmltYXRpb25zOiBbbWF0U25hY2tCYXJBbmltYXRpb25zLnNuYWNrQmFyU3RhdGVdLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ2RrUG9ydGFsT3V0bGV0XSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtZGMtc25hY2tiYXIgbWF0LW1kYy1zbmFjay1iYXItY29udGFpbmVyIG1kYy1zbmFja2Jhci0tb3BlbicsXG4gICAgJ1tAc3RhdGVdJzogJ19hbmltYXRpb25TdGF0ZScsXG4gICAgJyhAc3RhdGUuZG9uZSknOiAnb25BbmltYXRpb25FbmQoJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNuYWNrQmFyQ29udGFpbmVyIGV4dGVuZHMgQmFzZVBvcnRhbE91dGxldCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcbiAgcHJpdmF0ZSBfdHJhY2tlZE1vZGFscyA9IG5ldyBTZXQ8RWxlbWVudD4oKTtcblxuICAvKiogVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgYW5ub3VuY2luZyB0aGUgc25hY2sgYmFyJ3MgY29udGVudC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfYW5ub3VuY2VEZWxheTogbnVtYmVyID0gMTUwO1xuXG4gIC8qKiBUaGUgdGltZW91dCBmb3IgYW5ub3VuY2luZyB0aGUgc25hY2sgYmFyJ3MgY29udGVudC4gKi9cbiAgcHJpdmF0ZSBfYW5ub3VuY2VUaW1lb3V0SWQ6IG51bWJlcjtcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveWVkID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBwb3J0YWwgb3V0bGV0IGluc2lkZSBvZiB0aGlzIGNvbnRhaW5lciBpbnRvIHdoaWNoIHRoZSBzbmFjayBiYXIgY29udGVudCB3aWxsIGJlIGxvYWRlZC4gKi9cbiAgQFZpZXdDaGlsZChDZGtQb3J0YWxPdXRsZXQsIHtzdGF0aWM6IHRydWV9KSBfcG9ydGFsT3V0bGV0OiBDZGtQb3J0YWxPdXRsZXQ7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGF0IHRoZSBzbmFjayBiYXIgaGFzIGFubm91bmNlZCB0byBzY3JlZW4gcmVhZGVycy4gKi9cbiAgcmVhZG9ubHkgX29uQW5ub3VuY2U6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhhdCB0aGUgc25hY2sgYmFyIGhhcyBleGl0ZWQgZnJvbSB2aWV3LiAqL1xuICByZWFkb25seSBfb25FeGl0OiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3QoKTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoYXQgdGhlIHNuYWNrIGJhciBoYXMgZmluaXNoZWQgZW50ZXJpbmcgdGhlIHZpZXcuICovXG4gIHJlYWRvbmx5IF9vbkVudGVyOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3QoKTtcblxuICAvKiogVGhlIHN0YXRlIG9mIHRoZSBzbmFjayBiYXIgYW5pbWF0aW9ucy4gKi9cbiAgX2FuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuXG4gIC8qKiBhcmlhLWxpdmUgdmFsdWUgZm9yIHRoZSBsaXZlIHJlZ2lvbi4gKi9cbiAgX2xpdmU6IEFyaWFMaXZlUG9saXRlbmVzcztcblxuICAvKipcbiAgICogRWxlbWVudCB0aGF0IHdpbGwgaGF2ZSB0aGUgYG1kYy1zbmFja2Jhcl9fbGFiZWxgIGNsYXNzIGFwcGxpZWQgaWYgdGhlIGF0dGFjaGVkIGNvbXBvbmVudFxuICAgKiBvciB0ZW1wbGF0ZSBkb2VzIG5vdCBoYXZlIGl0LiBUaGlzIGVuc3VyZXMgdGhhdCB0aGUgYXBwcm9wcmlhdGUgc3RydWN0dXJlLCB0eXBvZ3JhcGh5LCBhbmRcbiAgICogY29sb3IgaXMgYXBwbGllZCB0byB0aGUgYXR0YWNoZWQgdmlldy5cbiAgICovXG4gIEBWaWV3Q2hpbGQoJ2xhYmVsJywge3N0YXRpYzogdHJ1ZX0pIF9sYWJlbDogRWxlbWVudFJlZjtcblxuICAvKipcbiAgICogUm9sZSBvZiB0aGUgbGl2ZSByZWdpb24uIFRoaXMgaXMgb25seSBmb3IgRmlyZWZveCBhcyB0aGVyZSBpcyBhIGtub3duIGlzc3VlIHdoZXJlIEZpcmVmb3ggK1xuICAgKiBKQVdTIGRvZXMgbm90IHJlYWQgb3V0IGFyaWEtbGl2ZSBtZXNzYWdlLlxuICAgKi9cbiAgX3JvbGU/OiAnc3RhdHVzJyB8ICdhbGVydCc7XG5cbiAgLyoqIFVuaXF1ZSBJRCBvZiB0aGUgYXJpYS1saXZlIGVsZW1lbnQuICovXG4gIHJlYWRvbmx5IF9saXZlRWxlbWVudElkID0gYG1hdC1zbmFjay1iYXItY29udGFpbmVyLWxpdmUtJHt1bmlxdWVJZCsrfWA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAvKiogVGhlIHNuYWNrIGJhciBjb25maWd1cmF0aW9uLiAqL1xuICAgIHB1YmxpYyBzbmFja0JhckNvbmZpZzogTWF0U25hY2tCYXJDb25maWcsXG4gICkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvLyBVc2UgYXJpYS1saXZlIHJhdGhlciB0aGFuIGEgbGl2ZSByb2xlIGxpa2UgJ2FsZXJ0JyBvciAnc3RhdHVzJ1xuICAgIC8vIGJlY2F1c2UgTlZEQSBhbmQgSkFXUyBoYXZlIHNob3cgaW5jb25zaXN0ZW50IGJlaGF2aW9yIHdpdGggbGl2ZSByb2xlcy5cbiAgICBpZiAoc25hY2tCYXJDb25maWcucG9saXRlbmVzcyA9PT0gJ2Fzc2VydGl2ZScgJiYgIXNuYWNrQmFyQ29uZmlnLmFubm91bmNlbWVudE1lc3NhZ2UpIHtcbiAgICAgIHRoaXMuX2xpdmUgPSAnYXNzZXJ0aXZlJztcbiAgICB9IGVsc2UgaWYgKHNuYWNrQmFyQ29uZmlnLnBvbGl0ZW5lc3MgPT09ICdvZmYnKSB7XG4gICAgICB0aGlzLl9saXZlID0gJ29mZic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2xpdmUgPSAncG9saXRlJztcbiAgICB9XG5cbiAgICAvLyBPbmx5IHNldCByb2xlIGZvciBGaXJlZm94LiBTZXQgcm9sZSBiYXNlZCBvbiBhcmlhLWxpdmUgYmVjYXVzZSBzZXR0aW5nIHJvbGU9XCJhbGVydFwiIGltcGxpZXNcbiAgICAvLyBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIiB3aGljaCBtYXkgY2F1c2UgaXNzdWVzIGlmIGFyaWEtbGl2ZSBpcyBzZXQgdG8gXCJwb2xpdGVcIiBhYm92ZS5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uRklSRUZPWCkge1xuICAgICAgaWYgKHRoaXMuX2xpdmUgPT09ICdwb2xpdGUnKSB7XG4gICAgICAgIHRoaXMuX3JvbGUgPSAnc3RhdHVzJztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9saXZlID09PSAnYXNzZXJ0aXZlJykge1xuICAgICAgICB0aGlzLl9yb2xlID0gJ2FsZXJ0JztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQXR0YWNoIGEgY29tcG9uZW50IHBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMgc25hY2sgYmFyIGNvbnRhaW5lci4gKi9cbiAgYXR0YWNoQ29tcG9uZW50UG9ydGFsPFQ+KHBvcnRhbDogQ29tcG9uZW50UG9ydGFsPFQ+KTogQ29tcG9uZW50UmVmPFQ+IHtcbiAgICB0aGlzLl9hc3NlcnROb3RBdHRhY2hlZCgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hDb21wb25lbnRQb3J0YWwocG9ydGFsKTtcbiAgICB0aGlzLl9hZnRlclBvcnRhbEF0dGFjaGVkKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKiBBdHRhY2ggYSB0ZW1wbGF0ZSBwb3J0YWwgYXMgY29udGVudCB0byB0aGlzIHNuYWNrIGJhciBjb250YWluZXIuICovXG4gIGF0dGFjaFRlbXBsYXRlUG9ydGFsPEM+KHBvcnRhbDogVGVtcGxhdGVQb3J0YWw8Qz4pOiBFbWJlZGRlZFZpZXdSZWY8Qz4ge1xuICAgIHRoaXMuX2Fzc2VydE5vdEF0dGFjaGVkKCk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fcG9ydGFsT3V0bGV0LmF0dGFjaFRlbXBsYXRlUG9ydGFsKHBvcnRhbCk7XG4gICAgdGhpcy5fYWZ0ZXJQb3J0YWxBdHRhY2hlZCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgYSBET00gcG9ydGFsIHRvIHRoZSBzbmFjayBiYXIgY29udGFpbmVyLlxuICAgKiBAZGVwcmVjYXRlZCBUbyBiZSB0dXJuZWQgaW50byBhIG1ldGhvZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICovXG4gIG92ZXJyaWRlIGF0dGFjaERvbVBvcnRhbCA9IChwb3J0YWw6IERvbVBvcnRhbCkgPT4ge1xuICAgIHRoaXMuX2Fzc2VydE5vdEF0dGFjaGVkKCk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fcG9ydGFsT3V0bGV0LmF0dGFjaERvbVBvcnRhbChwb3J0YWwpO1xuICAgIHRoaXMuX2FmdGVyUG9ydGFsQXR0YWNoZWQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8qKiBIYW5kbGUgZW5kIG9mIGFuaW1hdGlvbnMsIHVwZGF0aW5nIHRoZSBzdGF0ZSBvZiB0aGUgc25hY2tiYXIuICovXG4gIG9uQW5pbWF0aW9uRW5kKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIGNvbnN0IHtmcm9tU3RhdGUsIHRvU3RhdGV9ID0gZXZlbnQ7XG5cbiAgICBpZiAoKHRvU3RhdGUgPT09ICd2b2lkJyAmJiBmcm9tU3RhdGUgIT09ICd2b2lkJykgfHwgdG9TdGF0ZSA9PT0gJ2hpZGRlbicpIHtcbiAgICAgIHRoaXMuX2NvbXBsZXRlRXhpdCgpO1xuICAgIH1cblxuICAgIGlmICh0b1N0YXRlID09PSAndmlzaWJsZScpIHtcbiAgICAgIC8vIE5vdGU6IHdlIHNob3VsZG4ndCB1c2UgYHRoaXNgIGluc2lkZSB0aGUgem9uZSBjYWxsYmFjayxcbiAgICAgIC8vIGJlY2F1c2UgaXQgY2FuIGNhdXNlIGEgbWVtb3J5IGxlYWsuXG4gICAgICBjb25zdCBvbkVudGVyID0gdGhpcy5fb25FbnRlcjtcblxuICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIG9uRW50ZXIubmV4dCgpO1xuICAgICAgICBvbkVudGVyLmNvbXBsZXRlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogQmVnaW4gYW5pbWF0aW9uIG9mIHNuYWNrIGJhciBlbnRyYW5jZSBpbnRvIHZpZXcuICovXG4gIGVudGVyKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fZGVzdHJveWVkKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9ICd2aXNpYmxlJztcbiAgICAgIC8vIF9hbmltYXRpb25TdGF0ZSBsaXZlcyBpbiBob3N0IGJpbmRpbmdzIGFuZCBgZGV0ZWN0Q2hhbmdlc2AgZG9lcyBub3QgcmVmcmVzaCBob3N0IGJpbmRpbmdzXG4gICAgICAvLyBzbyB3ZSBoYXZlIHRvIGNhbGwgYG1hcmtGb3JDaGVja2AgdG8gZW5zdXJlIHRoZSBob3N0IHZpZXcgaXMgcmVmcmVzaGVkIGV2ZW50dWFsbHkuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3NjcmVlblJlYWRlckFubm91bmNlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEJlZ2luIGFuaW1hdGlvbiBvZiB0aGUgc25hY2sgYmFyIGV4aXRpbmcgZnJvbSB2aWV3LiAqL1xuICBleGl0KCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIC8vIEl0J3MgY29tbW9uIGZvciBzbmFjayBiYXJzIHRvIGJlIG9wZW5lZCBieSByYW5kb20gb3V0c2lkZSBjYWxscyBsaWtlIEhUVFAgcmVxdWVzdHMgb3JcbiAgICAvLyBlcnJvcnMuIFJ1biBpbnNpZGUgdGhlIE5nWm9uZSB0byBlbnN1cmUgdGhhdCBpdCBmdW5jdGlvbnMgY29ycmVjdGx5LlxuICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgLy8gTm90ZTogdGhpcyBvbmUgdHJhbnNpdGlvbnMgdG8gYGhpZGRlbmAsIHJhdGhlciB0aGFuIGB2b2lkYCwgaW4gb3JkZXIgdG8gaGFuZGxlIHRoZSBjYXNlXG4gICAgICAvLyB3aGVyZSBtdWx0aXBsZSBzbmFjayBiYXJzIGFyZSBvcGVuZWQgaW4gcXVpY2sgc3VjY2Vzc2lvbiAoZS5nLiB0d28gY29uc2VjdXRpdmUgY2FsbHMgdG9cbiAgICAgIC8vIGBNYXRTbmFja0Jhci5vcGVuYCkuXG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9ICdoaWRkZW4nO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgIC8vIE1hcmsgdGhpcyBlbGVtZW50IHdpdGggYW4gJ2V4aXQnIGF0dHJpYnV0ZSB0byBpbmRpY2F0ZSB0aGF0IHRoZSBzbmFja2JhciBoYXNcbiAgICAgIC8vIGJlZW4gZGlzbWlzc2VkIGFuZCB3aWxsIHNvb24gYmUgcmVtb3ZlZCBmcm9tIHRoZSBET00uIFRoaXMgaXMgdXNlZCBieSB0aGUgc25hY2tiYXJcbiAgICAgIC8vIHRlc3QgaGFybmVzcy5cbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ21hdC1leGl0JywgJycpO1xuXG4gICAgICAvLyBJZiB0aGUgc25hY2sgYmFyIGhhc24ndCBiZWVuIGFubm91bmNlZCBieSB0aGUgdGltZSBpdCBleGl0cyBpdCB3b3VsZG4ndCBoYXZlIGJlZW4gb3BlblxuICAgICAgLy8gbG9uZyBlbm91Z2ggdG8gdmlzdWFsbHkgcmVhZCBpdCBlaXRoZXIsIHNvIGNsZWFyIHRoZSB0aW1lb3V0IGZvciBhbm5vdW5jaW5nLlxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2Fubm91bmNlVGltZW91dElkKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLl9vbkV4aXQ7XG4gIH1cblxuICAvKiogTWFrZXMgc3VyZSB0aGUgZXhpdCBjYWxsYmFja3MgaGF2ZSBiZWVuIGludm9rZWQgd2hlbiB0aGUgZWxlbWVudCBpcyBkZXN0cm95ZWQuICovXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5fY2xlYXJGcm9tTW9kYWxzKCk7XG4gICAgdGhpcy5fY29tcGxldGVFeGl0KCk7XG4gIH1cblxuICAvKipcbiAgICogV2FpdHMgZm9yIHRoZSB6b25lIHRvIHNldHRsZSBiZWZvcmUgcmVtb3ZpbmcgdGhlIGVsZW1lbnQuIEhlbHBzIHByZXZlbnRcbiAgICogZXJyb3JzIHdoZXJlIHdlIGVuZCB1cCByZW1vdmluZyBhbiBlbGVtZW50IHdoaWNoIGlzIGluIHRoZSBtaWRkbGUgb2YgYW4gYW5pbWF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfY29tcGxldGVFeGl0KCkge1xuICAgIHRoaXMuX25nWm9uZS5vbk1pY3JvdGFza0VtcHR5LnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl9vbkV4aXQubmV4dCgpO1xuICAgICAgICB0aGlzLl9vbkV4aXQuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBhZnRlciB0aGUgcG9ydGFsIGNvbnRlbnRzIGhhdmUgYmVlbiBhdHRhY2hlZC4gQ2FuIGJlXG4gICAqIHVzZWQgdG8gbW9kaWZ5IHRoZSBET00gb25jZSBpdCdzIGd1YXJhbnRlZWQgdG8gYmUgaW4gcGxhY2UuXG4gICAqL1xuICBwcml2YXRlIF9hZnRlclBvcnRhbEF0dGFjaGVkKCkge1xuICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IHBhbmVsQ2xhc3NlcyA9IHRoaXMuc25hY2tCYXJDb25maWcucGFuZWxDbGFzcztcblxuICAgIGlmIChwYW5lbENsYXNzZXMpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhbmVsQ2xhc3NlcykpIHtcbiAgICAgICAgLy8gTm90ZSB0aGF0IHdlIGNhbid0IHVzZSBhIHNwcmVhZCBoZXJlLCBiZWNhdXNlIElFIGRvZXNuJ3Qgc3VwcG9ydCBtdWx0aXBsZSBhcmd1bWVudHMuXG4gICAgICAgIHBhbmVsQ2xhc3Nlcy5mb3JFYWNoKGNzc0NsYXNzID0+IGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjc3NDbGFzcykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHBhbmVsQ2xhc3Nlcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fZXhwb3NlVG9Nb2RhbHMoKTtcblxuICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYXR0YWNoZWQgY29tcG9uZW50IG9yIHRlbXBsYXRlIHVzZXMgdGhlIE1EQyB0ZW1wbGF0ZSBzdHJ1Y3R1cmUsXG4gICAgLy8gc3BlY2lmaWNhbGx5IHRoZSBNREMgbGFiZWwuIElmIG5vdCwgdGhlIGNvbnRhaW5lciBzaG91bGQgYXBwbHkgdGhlIE1EQyBsYWJlbCBjbGFzcyB0byB0aGlzXG4gICAgLy8gY29tcG9uZW50J3MgbGFiZWwgY29udGFpbmVyLCB3aGljaCB3aWxsIGFwcGx5IE1EQydzIGxhYmVsIHN0eWxlcyB0byB0aGUgYXR0YWNoZWQgdmlldy5cbiAgICBjb25zdCBsYWJlbCA9IHRoaXMuX2xhYmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgbGFiZWxDbGFzcyA9ICdtZGMtc25hY2tiYXJfX2xhYmVsJztcbiAgICBsYWJlbC5jbGFzc0xpc3QudG9nZ2xlKGxhYmVsQ2xhc3MsICFsYWJlbC5xdWVyeVNlbGVjdG9yKGAuJHtsYWJlbENsYXNzfWApKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTb21lIGJyb3dzZXJzIHdvbid0IGV4cG9zZSB0aGUgYWNjZXNzaWJpbGl0eSBub2RlIG9mIHRoZSBsaXZlIGVsZW1lbnQgaWYgdGhlcmUgaXMgYW5cbiAgICogYGFyaWEtbW9kYWxgIGFuZCB0aGUgbGl2ZSBlbGVtZW50IGlzIG91dHNpZGUgb2YgaXQuIFRoaXMgbWV0aG9kIHdvcmtzIGFyb3VuZCB0aGUgaXNzdWUgYnlcbiAgICogcG9pbnRpbmcgdGhlIGBhcmlhLW93bnNgIG9mIGFsbCBtb2RhbHMgdG8gdGhlIGxpdmUgZWxlbWVudC5cbiAgICovXG4gIHByaXZhdGUgX2V4cG9zZVRvTW9kYWxzKCkge1xuICAgIC8vIFRPRE8oaHR0cDovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8yNjg1Myk6IGNvbnNpZGVyIGRlLWR1cGxpY2F0aW5nIHRoaXMgd2l0aCB0aGVcbiAgICAvLyBgTGl2ZUFubm91bmNlcmAgYW5kIGFueSBvdGhlciB1c2FnZXMuXG4gICAgLy9cbiAgICAvLyBOb3RlIHRoYXQgdGhlIHNlbGVjdG9yIGhlcmUgaXMgbGltaXRlZCB0byBDREsgb3ZlcmxheXMgYXQgdGhlIG1vbWVudCBpbiBvcmRlciB0byByZWR1Y2UgdGhlXG4gICAgLy8gc2VjdGlvbiBvZiB0aGUgRE9NIHdlIG5lZWQgdG8gbG9vayB0aHJvdWdoLiBUaGlzIHNob3VsZCBjb3ZlciBhbGwgdGhlIGNhc2VzIHdlIHN1cHBvcnQsIGJ1dFxuICAgIC8vIHRoZSBzZWxlY3RvciBjYW4gYmUgZXhwYW5kZWQgaWYgaXQgdHVybnMgb3V0IHRvIGJlIHRvbyBuYXJyb3cuXG4gICAgY29uc3QgaWQgPSB0aGlzLl9saXZlRWxlbWVudElkO1xuICAgIGNvbnN0IG1vZGFscyA9IHRoaXMuX2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAnYm9keSA+IC5jZGstb3ZlcmxheS1jb250YWluZXIgW2FyaWEtbW9kYWw9XCJ0cnVlXCJdJyxcbiAgICApO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2RhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1vZGFsID0gbW9kYWxzW2ldO1xuICAgICAgY29uc3QgYXJpYU93bnMgPSBtb2RhbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtb3ducycpO1xuICAgICAgdGhpcy5fdHJhY2tlZE1vZGFscy5hZGQobW9kYWwpO1xuXG4gICAgICBpZiAoIWFyaWFPd25zKSB7XG4gICAgICAgIG1vZGFsLnNldEF0dHJpYnV0ZSgnYXJpYS1vd25zJywgaWQpO1xuICAgICAgfSBlbHNlIGlmIChhcmlhT3ducy5pbmRleE9mKGlkKSA9PT0gLTEpIHtcbiAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKCdhcmlhLW93bnMnLCBhcmlhT3ducyArICcgJyArIGlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQ2xlYXJzIHRoZSByZWZlcmVuY2VzIHRvIHRoZSBsaXZlIGVsZW1lbnQgZnJvbSBhbnkgbW9kYWxzIGl0IHdhcyBhZGRlZCB0by4gKi9cbiAgcHJpdmF0ZSBfY2xlYXJGcm9tTW9kYWxzKCkge1xuICAgIHRoaXMuX3RyYWNrZWRNb2RhbHMuZm9yRWFjaChtb2RhbCA9PiB7XG4gICAgICBjb25zdCBhcmlhT3ducyA9IG1vZGFsLmdldEF0dHJpYnV0ZSgnYXJpYS1vd25zJyk7XG5cbiAgICAgIGlmIChhcmlhT3ducykge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGFyaWFPd25zLnJlcGxhY2UodGhpcy5fbGl2ZUVsZW1lbnRJZCwgJycpLnRyaW0oKTtcblxuICAgICAgICBpZiAobmV3VmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIG1vZGFsLnNldEF0dHJpYnV0ZSgnYXJpYS1vd25zJywgbmV3VmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vZGFsLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1vd25zJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl90cmFja2VkTW9kYWxzLmNsZWFyKCk7XG4gIH1cblxuICAvKiogQXNzZXJ0cyB0aGF0IG5vIGNvbnRlbnQgaXMgYWxyZWFkeSBhdHRhY2hlZCB0byB0aGUgY29udGFpbmVyLiAqL1xuICBwcml2YXRlIF9hc3NlcnROb3RBdHRhY2hlZCgpIHtcbiAgICBpZiAodGhpcy5fcG9ydGFsT3V0bGV0Lmhhc0F0dGFjaGVkKCkgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IEVycm9yKCdBdHRlbXB0aW5nIHRvIGF0dGFjaCBzbmFjayBiYXIgY29udGVudCBhZnRlciBjb250ZW50IGlzIGFscmVhZHkgYXR0YWNoZWQnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIGEgdGltZW91dCB0byBtb3ZlIHRoZSBzbmFjayBiYXIgY29udGVudCB0byB0aGUgbGl2ZSByZWdpb24gc28gc2NyZWVuIHJlYWRlcnMgd2lsbFxuICAgKiBhbm5vdW5jZSBpdC5cbiAgICovXG4gIHByaXZhdGUgX3NjcmVlblJlYWRlckFubm91bmNlKCkge1xuICAgIGlmICghdGhpcy5fYW5ub3VuY2VUaW1lb3V0SWQpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMuX2Fubm91bmNlVGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5lcnRFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLWhpZGRlbl0nKTtcbiAgICAgICAgICBjb25zdCBsaXZlRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1saXZlXScpO1xuXG4gICAgICAgICAgaWYgKGluZXJ0RWxlbWVudCAmJiBsaXZlRWxlbWVudCkge1xuICAgICAgICAgICAgLy8gSWYgYW4gZWxlbWVudCBpbiB0aGUgc25hY2sgYmFyIGNvbnRlbnQgaXMgZm9jdXNlZCBiZWZvcmUgYmVpbmcgbW92ZWRcbiAgICAgICAgICAgIC8vIHRyYWNrIGl0IGFuZCByZXN0b3JlIGZvY3VzIGFmdGVyIG1vdmluZyB0byB0aGUgbGl2ZSByZWdpb24uXG4gICAgICAgICAgICBsZXQgZm9jdXNlZEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHRoaXMuX3BsYXRmb3JtLmlzQnJvd3NlciAmJlxuICAgICAgICAgICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAgICAgICAgICAgaW5lcnRFbGVtZW50LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgZm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbmVydEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICAgICAgICAgICAgbGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQoaW5lcnRFbGVtZW50KTtcbiAgICAgICAgICAgIGZvY3VzZWRFbGVtZW50Py5mb2N1cygpO1xuXG4gICAgICAgICAgICB0aGlzLl9vbkFubm91bmNlLm5leHQoKTtcbiAgICAgICAgICAgIHRoaXMuX29uQW5ub3VuY2UuY29tcGxldGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMuX2Fubm91bmNlRGVsYXkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwibWRjLXNuYWNrYmFyX19zdXJmYWNlXCI+XG4gIDwhLS1cbiAgICBUaGlzIG91dGVyIGxhYmVsIHdyYXBwZXIgd2lsbCBoYXZlIHRoZSBjbGFzcyBgbWRjLXNuYWNrYmFyX19sYWJlbGAgYXBwbGllZCBpZlxuICAgIHRoZSBhdHRhY2hlZCB0ZW1wbGF0ZS9jb21wb25lbnQgZG9lcyBub3QgY29udGFpbiBpdC5cbiAgLS0+XG4gIDxkaXYgY2xhc3M9XCJtYXQtbWRjLXNuYWNrLWJhci1sYWJlbFwiICNsYWJlbD5cbiAgICA8IS0tIEluaXRpYWx5IGhvbGRzIHRoZSBzbmFjayBiYXIgY29udGVudCwgd2lsbCBiZSBlbXB0eSBhZnRlciBhbm5vdW5jaW5nIHRvIHNjcmVlbiByZWFkZXJzLiAtLT5cbiAgICA8ZGl2IGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgPG5nLXRlbXBsYXRlIGNka1BvcnRhbE91dGxldCAvPlxuICAgIDwvZGl2PlxuXG4gICAgPCEtLSBXaWxsIHJlY2VpdmUgdGhlIHNuYWNrIGJhciBjb250ZW50IGZyb20gdGhlIG5vbi1saXZlIGRpdiwgbW92ZSB3aWxsIGhhcHBlbiBhIHNob3J0IGRlbGF5IGFmdGVyIG9wZW5pbmcgLS0+XG4gICAgPGRpdiBbYXR0ci5hcmlhLWxpdmVdPVwiX2xpdmVcIiBbYXR0ci5yb2xlXT1cIl9yb2xlXCIgW2F0dHIuaWRdPVwiX2xpdmVFbGVtZW50SWRcIj48L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj5cbiJdfQ==