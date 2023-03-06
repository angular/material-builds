/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, inject, NgZone, ViewChild, ViewEncapsulation, } from '@angular/core';
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
 * Base class for snack bar containers.
 * @docs-private
 */
export class _MatSnackBarContainerBase extends BasePortalOutlet {
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
    }
    /**
     * Some browsers won't expose the accessibility node of the live element if there is an
     * `aria-modal` and the live element is outside of it. This method works around the issue by
     * pointing the `aria-owns` of all modals to the live element.
     */
    _exposeToModals() {
        // TODO(crisbeto): consider de-duplicating this with the `LiveAnnouncer`.
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
}
_MatSnackBarContainerBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: _MatSnackBarContainerBase, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.Platform }, { token: i2.MatSnackBarConfig }], target: i0.ɵɵFactoryTarget.Directive });
_MatSnackBarContainerBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.0-rc.0", type: _MatSnackBarContainerBase, viewQueries: [{ propertyName: "_portalOutlet", first: true, predicate: CdkPortalOutlet, descendants: true, static: true }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: _MatSnackBarContainerBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.Platform }, { type: i2.MatSnackBarConfig }]; }, propDecorators: { _portalOutlet: [{
                type: ViewChild,
                args: [CdkPortalOutlet, { static: true }]
            }] } });
/**
 * Internal component that wraps user-provided snack bar content.
 * @docs-private
 */
export class MatSnackBarContainer extends _MatSnackBarContainerBase {
    /** Applies the correct CSS class to the label based on its content. */
    _afterPortalAttached() {
        super._afterPortalAttached();
        // Check to see if the attached component or template uses the MDC template structure,
        // specifically the MDC label. If not, the container should apply the MDC label class to this
        // component's label container, which will apply MDC's label styles to the attached view.
        const label = this._label.nativeElement;
        const labelClass = 'mdc-snackbar__label';
        label.classList.toggle(labelClass, !label.querySelector(`.${labelClass}`));
    }
}
MatSnackBarContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MatSnackBarContainer, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatSnackBarContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.0-rc.0", type: MatSnackBarContainer, selector: "mat-snack-bar-container", host: { listeners: { "@state.done": "onAnimationEnd($event)" }, properties: { "@state": "_animationState" }, classAttribute: "mdc-snackbar mat-mdc-snack-bar-container mdc-snackbar--open" }, viewQueries: [{ propertyName: "_label", first: true, predicate: ["label"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"mdc-snackbar__surface\">\n  <!--\n    This outer label wrapper will have the class `mdc-snackbar__label` applied if\n    the attached template/component does not contain it.\n  -->\n  <div class=\"mat-mdc-snack-bar-label\" #label>\n    <!-- Initialy holds the snack bar content, will be empty after announcing to screen readers. -->\n    <div aria-hidden=\"true\">\n      <ng-template cdkPortalOutlet></ng-template>\n    </div>\n\n    <!-- Will receive the snack bar content from the non-live div, move will happen a short delay after opening -->\n    <div [attr.aria-live]=\"_live\" [attr.role]=\"_role\" [attr.id]=\"_liveElementId\"></div>\n  </div>\n</div>\n", styles: [".mdc-snackbar{display:none;position:fixed;right:0;bottom:0;left:0;align-items:center;justify-content:center;box-sizing:border-box;pointer-events:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mdc-snackbar--opening,.mdc-snackbar--open,.mdc-snackbar--closing{display:flex}.mdc-snackbar--open .mdc-snackbar__label,.mdc-snackbar--open .mdc-snackbar__actions{visibility:visible}.mdc-snackbar__surface{padding-left:0;padding-right:8px;display:flex;align-items:center;justify-content:flex-start;box-sizing:border-box;transform:scale(0.8);opacity:0}.mdc-snackbar__surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-snackbar__surface::before{border-color:CanvasText}}[dir=rtl] .mdc-snackbar__surface,.mdc-snackbar__surface[dir=rtl]{padding-left:8px;padding-right:0}.mdc-snackbar--open .mdc-snackbar__surface{transform:scale(1);opacity:1;pointer-events:auto}.mdc-snackbar--closing .mdc-snackbar__surface{transform:scale(1)}.mdc-snackbar__label{padding-left:16px;padding-right:8px;width:100%;flex-grow:1;box-sizing:border-box;margin:0;visibility:hidden;padding-top:14px;padding-bottom:14px}[dir=rtl] .mdc-snackbar__label,.mdc-snackbar__label[dir=rtl]{padding-left:8px;padding-right:16px}.mdc-snackbar__label::before{display:inline;content:attr(data-mdc-snackbar-label-text)}.mdc-snackbar__actions{display:flex;flex-shrink:0;align-items:center;box-sizing:border-box;visibility:hidden}.mdc-snackbar__action+.mdc-snackbar__dismiss{margin-left:8px;margin-right:0}[dir=rtl] .mdc-snackbar__action+.mdc-snackbar__dismiss,.mdc-snackbar__action+.mdc-snackbar__dismiss[dir=rtl]{margin-left:0;margin-right:8px}.mat-mdc-snack-bar-container{margin:8px;position:static}.mat-mdc-snack-bar-container .mdc-snackbar__surface{min-width:344px}@media(max-width: 480px),(max-width: 344px){.mat-mdc-snack-bar-container .mdc-snackbar__surface{min-width:100%}}@media(max-width: 480px),(max-width: 344px){.mat-mdc-snack-bar-container{width:100vw}}.mat-mdc-snack-bar-container .mdc-snackbar__surface{max-width:672px}.mat-mdc-snack-bar-container .mdc-snackbar__surface{box-shadow:0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)}.mat-mdc-snack-bar-container .mdc-snackbar__dismiss .mdc-button__icon{font-size:var(--mdc-icon-button-icon-size, var(--mdc-snackbar-icon-size, 24px))}.mat-mdc-snack-bar-container .mdc-snackbar__dismiss svg,.mat-mdc-snack-bar-container .mdc-snackbar__dismiss img{width:var(--mdc-icon-button-icon-size, var(--mdc-snackbar-icon-size, 24px));height:var(--mdc-icon-button-icon-size, var(--mdc-snackbar-icon-size, 24px))}.mat-mdc-snack-bar-container .mdc-snackbar__surface{background-color:var(--mdc-snackbar-container-color, inherit)}.mat-mdc-snack-bar-container .mdc-snackbar__surface{border-radius:var(--mdc-snackbar-container-shape, var(--mdc-shape-small, 4px))}.mat-mdc-snack-bar-container .mdc-snackbar__label{color:var(--mdc-snackbar-supporting-text-color, inherit)}.mat-mdc-snack-bar-container .mdc-snackbar__label{font-size:var(--mdc-snackbar-supporting-text-size, inherit);font-family:var(--mdc-snackbar-supporting-text-font, inherit);font-weight:var(--mdc-snackbar-supporting-text-weight, inherit);line-height:var(--mdc-snackbar-supporting-text-line-height, inherit)}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled){color:var(--mat-mdc-snack-bar-button-color, transparent);--mat-mdc-button-persistent-ripple-color: currentColor}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) .mat-ripple-element{background-color:currentColor;opacity:.1}.mat-mdc-snack-bar-container .mdc-snackbar__label::before{display:none}.mat-mdc-snack-bar-handset,.mat-mdc-snack-bar-container,.mat-mdc-snack-bar-label{flex:1 1 auto}.mat-mdc-snack-bar-handset .mdc-snackbar__surface{width:100%}"], dependencies: [{ kind: "directive", type: i3.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [matSnackBarAnimations.snackBarState], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MatSnackBarContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-snack-bar-container', changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, animations: [matSnackBarAnimations.snackBarState], host: {
                        'class': 'mdc-snackbar mat-mdc-snack-bar-container mdc-snackbar--open',
                        '[@state]': '_animationState',
                        '(@state.done)': 'onAnimationEnd($event)',
                    }, template: "<div class=\"mdc-snackbar__surface\">\n  <!--\n    This outer label wrapper will have the class `mdc-snackbar__label` applied if\n    the attached template/component does not contain it.\n  -->\n  <div class=\"mat-mdc-snack-bar-label\" #label>\n    <!-- Initialy holds the snack bar content, will be empty after announcing to screen readers. -->\n    <div aria-hidden=\"true\">\n      <ng-template cdkPortalOutlet></ng-template>\n    </div>\n\n    <!-- Will receive the snack bar content from the non-live div, move will happen a short delay after opening -->\n    <div [attr.aria-live]=\"_live\" [attr.role]=\"_role\" [attr.id]=\"_liveElementId\"></div>\n  </div>\n</div>\n", styles: [".mdc-snackbar{display:none;position:fixed;right:0;bottom:0;left:0;align-items:center;justify-content:center;box-sizing:border-box;pointer-events:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mdc-snackbar--opening,.mdc-snackbar--open,.mdc-snackbar--closing{display:flex}.mdc-snackbar--open .mdc-snackbar__label,.mdc-snackbar--open .mdc-snackbar__actions{visibility:visible}.mdc-snackbar__surface{padding-left:0;padding-right:8px;display:flex;align-items:center;justify-content:flex-start;box-sizing:border-box;transform:scale(0.8);opacity:0}.mdc-snackbar__surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}@media screen and (forced-colors: active){.mdc-snackbar__surface::before{border-color:CanvasText}}[dir=rtl] .mdc-snackbar__surface,.mdc-snackbar__surface[dir=rtl]{padding-left:8px;padding-right:0}.mdc-snackbar--open .mdc-snackbar__surface{transform:scale(1);opacity:1;pointer-events:auto}.mdc-snackbar--closing .mdc-snackbar__surface{transform:scale(1)}.mdc-snackbar__label{padding-left:16px;padding-right:8px;width:100%;flex-grow:1;box-sizing:border-box;margin:0;visibility:hidden;padding-top:14px;padding-bottom:14px}[dir=rtl] .mdc-snackbar__label,.mdc-snackbar__label[dir=rtl]{padding-left:8px;padding-right:16px}.mdc-snackbar__label::before{display:inline;content:attr(data-mdc-snackbar-label-text)}.mdc-snackbar__actions{display:flex;flex-shrink:0;align-items:center;box-sizing:border-box;visibility:hidden}.mdc-snackbar__action+.mdc-snackbar__dismiss{margin-left:8px;margin-right:0}[dir=rtl] .mdc-snackbar__action+.mdc-snackbar__dismiss,.mdc-snackbar__action+.mdc-snackbar__dismiss[dir=rtl]{margin-left:0;margin-right:8px}.mat-mdc-snack-bar-container{margin:8px;position:static}.mat-mdc-snack-bar-container .mdc-snackbar__surface{min-width:344px}@media(max-width: 480px),(max-width: 344px){.mat-mdc-snack-bar-container .mdc-snackbar__surface{min-width:100%}}@media(max-width: 480px),(max-width: 344px){.mat-mdc-snack-bar-container{width:100vw}}.mat-mdc-snack-bar-container .mdc-snackbar__surface{max-width:672px}.mat-mdc-snack-bar-container .mdc-snackbar__surface{box-shadow:0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)}.mat-mdc-snack-bar-container .mdc-snackbar__dismiss .mdc-button__icon{font-size:var(--mdc-icon-button-icon-size, var(--mdc-snackbar-icon-size, 24px))}.mat-mdc-snack-bar-container .mdc-snackbar__dismiss svg,.mat-mdc-snack-bar-container .mdc-snackbar__dismiss img{width:var(--mdc-icon-button-icon-size, var(--mdc-snackbar-icon-size, 24px));height:var(--mdc-icon-button-icon-size, var(--mdc-snackbar-icon-size, 24px))}.mat-mdc-snack-bar-container .mdc-snackbar__surface{background-color:var(--mdc-snackbar-container-color, inherit)}.mat-mdc-snack-bar-container .mdc-snackbar__surface{border-radius:var(--mdc-snackbar-container-shape, var(--mdc-shape-small, 4px))}.mat-mdc-snack-bar-container .mdc-snackbar__label{color:var(--mdc-snackbar-supporting-text-color, inherit)}.mat-mdc-snack-bar-container .mdc-snackbar__label{font-size:var(--mdc-snackbar-supporting-text-size, inherit);font-family:var(--mdc-snackbar-supporting-text-font, inherit);font-weight:var(--mdc-snackbar-supporting-text-weight, inherit);line-height:var(--mdc-snackbar-supporting-text-line-height, inherit)}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled){color:var(--mat-mdc-snack-bar-button-color, transparent);--mat-mdc-button-persistent-ripple-color: currentColor}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) .mat-ripple-element{background-color:currentColor;opacity:.1}.mat-mdc-snack-bar-container .mdc-snackbar__label::before{display:none}.mat-mdc-snack-bar-handset,.mat-mdc-snack-bar-container,.mat-mdc-snack-bar-label{flex:1 1 auto}.mat-mdc-snack-bar-handset .mdc-snackbar__surface{width:100%}"] }]
        }], propDecorators: { _label: [{
                type: ViewChild,
                args: ['label', { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLWNvbnRhaW5lci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLWNvbnRhaW5lci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFFVCxTQUFTLEVBQ1QsVUFBVSxFQUVWLE1BQU0sRUFDTixNQUFNLEVBRU4sU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDN0QsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixlQUFlLEdBSWhCLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFhLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUV6QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFL0MsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3BDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDOzs7OztBQUVyRCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFFakI7OztHQUdHO0FBRUgsTUFBTSxPQUFnQix5QkFBMEIsU0FBUSxnQkFBZ0I7SUF3Q3RFLFlBQ1UsT0FBZSxFQUNiLFdBQW9DLEVBQ3RDLGtCQUFxQyxFQUNyQyxTQUFtQjtJQUMzQixtQ0FBbUM7SUFDNUIsY0FBaUM7UUFFeEMsS0FBSyxFQUFFLENBQUM7UUFQQSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FB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LG1CQU9sQix1QkFBdUIsQ0FBQyxPQUFPLGlCQUNqQyxpQkFBaUIsQ0FBQyxJQUFJLGNBQ3pCLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDLFFBQzNDO3dCQUNKLE9BQU8sRUFBRSw2REFBNkQ7d0JBQ3RFLFVBQVUsRUFBRSxpQkFBaUI7d0JBQzdCLGVBQWUsRUFBRSx3QkFBd0I7cUJBQzFDOzhCQVFtQyxNQUFNO3NCQUF6QyxTQUFTO3VCQUFDLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFbWJlZGRlZFZpZXdSZWYsXG4gIGluamVjdCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7bWF0U25hY2tCYXJBbmltYXRpb25zfSBmcm9tICcuL3NuYWNrLWJhci1hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIEJhc2VQb3J0YWxPdXRsZXQsXG4gIENka1BvcnRhbE91dGxldCxcbiAgQ29tcG9uZW50UG9ydGFsLFxuICBEb21Qb3J0YWwsXG4gIFRlbXBsYXRlUG9ydGFsLFxufSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0FyaWFMaXZlUG9saXRlbmVzc30gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdFNuYWNrQmFyQ29uZmlnfSBmcm9tICcuL3NuYWNrLWJhci1jb25maWcnO1xuXG5sZXQgdW5pcXVlSWQgPSAwO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHNuYWNrIGJhciBjb250YWluZXJzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0U25hY2tCYXJDb250YWluZXJCYXNlIGV4dGVuZHMgQmFzZVBvcnRhbE91dGxldCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcbiAgcHJpdmF0ZSBfdHJhY2tlZE1vZGFscyA9IG5ldyBTZXQ8RWxlbWVudD4oKTtcblxuICAvKiogVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgYW5ub3VuY2luZyB0aGUgc25hY2sgYmFyJ3MgY29udGVudC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfYW5ub3VuY2VEZWxheTogbnVtYmVyID0gMTUwO1xuXG4gIC8qKiBUaGUgdGltZW91dCBmb3IgYW5ub3VuY2luZyB0aGUgc25hY2sgYmFyJ3MgY29udGVudC4gKi9cbiAgcHJpdmF0ZSBfYW5ub3VuY2VUaW1lb3V0SWQ6IG51bWJlcjtcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveWVkID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBwb3J0YWwgb3V0bGV0IGluc2lkZSBvZiB0aGlzIGNvbnRhaW5lciBpbnRvIHdoaWNoIHRoZSBzbmFjayBiYXIgY29udGVudCB3aWxsIGJlIGxvYWRlZC4gKi9cbiAgQFZpZXdDaGlsZChDZGtQb3J0YWxPdXRsZXQsIHtzdGF0aWM6IHRydWV9KSBfcG9ydGFsT3V0bGV0OiBDZGtQb3J0YWxPdXRsZXQ7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGF0IHRoZSBzbmFjayBiYXIgaGFzIGFubm91bmNlZCB0byBzY3JlZW4gcmVhZGVycy4gKi9cbiAgcmVhZG9ubHkgX29uQW5ub3VuY2U6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhhdCB0aGUgc25hY2sgYmFyIGhhcyBleGl0ZWQgZnJvbSB2aWV3LiAqL1xuICByZWFkb25seSBfb25FeGl0OiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3QoKTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoYXQgdGhlIHNuYWNrIGJhciBoYXMgZmluaXNoZWQgZW50ZXJpbmcgdGhlIHZpZXcuICovXG4gIHJlYWRvbmx5IF9vbkVudGVyOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3QoKTtcblxuICAvKiogVGhlIHN0YXRlIG9mIHRoZSBzbmFjayBiYXIgYW5pbWF0aW9ucy4gKi9cbiAgX2FuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuXG4gIC8qKiBhcmlhLWxpdmUgdmFsdWUgZm9yIHRoZSBsaXZlIHJlZ2lvbi4gKi9cbiAgX2xpdmU6IEFyaWFMaXZlUG9saXRlbmVzcztcblxuICAvKipcbiAgICogUm9sZSBvZiB0aGUgbGl2ZSByZWdpb24uIFRoaXMgaXMgb25seSBmb3IgRmlyZWZveCBhcyB0aGVyZSBpcyBhIGtub3duIGlzc3VlIHdoZXJlIEZpcmVmb3ggK1xuICAgKiBKQVdTIGRvZXMgbm90IHJlYWQgb3V0IGFyaWEtbGl2ZSBtZXNzYWdlLlxuICAgKi9cbiAgX3JvbGU/OiAnc3RhdHVzJyB8ICdhbGVydCc7XG5cbiAgLyoqIFVuaXF1ZSBJRCBvZiB0aGUgYXJpYS1saXZlIGVsZW1lbnQuICovXG4gIHJlYWRvbmx5IF9saXZlRWxlbWVudElkID0gYG1hdC1zbmFjay1iYXItY29udGFpbmVyLWxpdmUtJHt1bmlxdWVJZCsrfWA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgcHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIC8qKiBUaGUgc25hY2sgYmFyIGNvbmZpZ3VyYXRpb24uICovXG4gICAgcHVibGljIHNuYWNrQmFyQ29uZmlnOiBNYXRTbmFja0JhckNvbmZpZyxcbiAgKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8vIFVzZSBhcmlhLWxpdmUgcmF0aGVyIHRoYW4gYSBsaXZlIHJvbGUgbGlrZSAnYWxlcnQnIG9yICdzdGF0dXMnXG4gICAgLy8gYmVjYXVzZSBOVkRBIGFuZCBKQVdTIGhhdmUgc2hvdyBpbmNvbnNpc3RlbnQgYmVoYXZpb3Igd2l0aCBsaXZlIHJvbGVzLlxuICAgIGlmIChzbmFja0JhckNvbmZpZy5wb2xpdGVuZXNzID09PSAnYXNzZXJ0aXZlJyAmJiAhc25hY2tCYXJDb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSkge1xuICAgICAgdGhpcy5fbGl2ZSA9ICdhc3NlcnRpdmUnO1xuICAgIH0gZWxzZSBpZiAoc25hY2tCYXJDb25maWcucG9saXRlbmVzcyA9PT0gJ29mZicpIHtcbiAgICAgIHRoaXMuX2xpdmUgPSAnb2ZmJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbGl2ZSA9ICdwb2xpdGUnO1xuICAgIH1cblxuICAgIC8vIE9ubHkgc2V0IHJvbGUgZm9yIEZpcmVmb3guIFNldCByb2xlIGJhc2VkIG9uIGFyaWEtbGl2ZSBiZWNhdXNlIHNldHRpbmcgcm9sZT1cImFsZXJ0XCIgaW1wbGllc1xuICAgIC8vIGFyaWEtbGl2ZT1cImFzc2VydGl2ZVwiIHdoaWNoIG1heSBjYXVzZSBpc3N1ZXMgaWYgYXJpYS1saXZlIGlzIHNldCB0byBcInBvbGl0ZVwiIGFib3ZlLlxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5GSVJFRk9YKSB7XG4gICAgICBpZiAodGhpcy5fbGl2ZSA9PT0gJ3BvbGl0ZScpIHtcbiAgICAgICAgdGhpcy5fcm9sZSA9ICdzdGF0dXMnO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX2xpdmUgPT09ICdhc3NlcnRpdmUnKSB7XG4gICAgICAgIHRoaXMuX3JvbGUgPSAnYWxlcnQnO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBBdHRhY2ggYSBjb21wb25lbnQgcG9ydGFsIGFzIGNvbnRlbnQgdG8gdGhpcyBzbmFjayBiYXIgY29udGFpbmVyLiAqL1xuICBhdHRhY2hDb21wb25lbnRQb3J0YWw8VD4ocG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VD4pOiBDb21wb25lbnRSZWY8VD4ge1xuICAgIHRoaXMuX2Fzc2VydE5vdEF0dGFjaGVkKCk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fcG9ydGFsT3V0bGV0LmF0dGFjaENvbXBvbmVudFBvcnRhbChwb3J0YWwpO1xuICAgIHRoaXMuX2FmdGVyUG9ydGFsQXR0YWNoZWQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqIEF0dGFjaCBhIHRlbXBsYXRlIHBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMgc25hY2sgYmFyIGNvbnRhaW5lci4gKi9cbiAgYXR0YWNoVGVtcGxhdGVQb3J0YWw8Qz4ocG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxDPik6IEVtYmVkZGVkVmlld1JlZjxDPiB7XG4gICAgdGhpcy5fYXNzZXJ0Tm90QXR0YWNoZWQoKTtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoVGVtcGxhdGVQb3J0YWwocG9ydGFsKTtcbiAgICB0aGlzLl9hZnRlclBvcnRhbEF0dGFjaGVkKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhIERPTSBwb3J0YWwgdG8gdGhlIHNuYWNrIGJhciBjb250YWluZXIuXG4gICAqIEBkZXByZWNhdGVkIFRvIGJlIHR1cm5lZCBpbnRvIGEgbWV0aG9kLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgKi9cbiAgb3ZlcnJpZGUgYXR0YWNoRG9tUG9ydGFsID0gKHBvcnRhbDogRG9tUG9ydGFsKSA9PiB7XG4gICAgdGhpcy5fYXNzZXJ0Tm90QXR0YWNoZWQoKTtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoRG9tUG9ydGFsKHBvcnRhbCk7XG4gICAgdGhpcy5fYWZ0ZXJQb3J0YWxBdHRhY2hlZCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLyoqIEhhbmRsZSBlbmQgb2YgYW5pbWF0aW9ucywgdXBkYXRpbmcgdGhlIHN0YXRlIG9mIHRoZSBzbmFja2Jhci4gKi9cbiAgb25BbmltYXRpb25FbmQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgY29uc3Qge2Zyb21TdGF0ZSwgdG9TdGF0ZX0gPSBldmVudDtcblxuICAgIGlmICgodG9TdGF0ZSA9PT0gJ3ZvaWQnICYmIGZyb21TdGF0ZSAhPT0gJ3ZvaWQnKSB8fCB0b1N0YXRlID09PSAnaGlkZGVuJykge1xuICAgICAgdGhpcy5fY29tcGxldGVFeGl0KCk7XG4gICAgfVxuXG4gICAgaWYgKHRvU3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgLy8gTm90ZTogd2Ugc2hvdWxkbid0IHVzZSBgdGhpc2AgaW5zaWRlIHRoZSB6b25lIGNhbGxiYWNrLFxuICAgICAgLy8gYmVjYXVzZSBpdCBjYW4gY2F1c2UgYSBtZW1vcnkgbGVhay5cbiAgICAgIGNvbnN0IG9uRW50ZXIgPSB0aGlzLl9vbkVudGVyO1xuXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgb25FbnRlci5uZXh0KCk7XG4gICAgICAgIG9uRW50ZXIuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBCZWdpbiBhbmltYXRpb24gb2Ygc25hY2sgYmFyIGVudHJhbmNlIGludG8gdmlldy4gKi9cbiAgZW50ZXIoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9kZXN0cm95ZWQpIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ3Zpc2libGUnO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgdGhpcy5fc2NyZWVuUmVhZGVyQW5ub3VuY2UoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQmVnaW4gYW5pbWF0aW9uIG9mIHRoZSBzbmFjayBiYXIgZXhpdGluZyBmcm9tIHZpZXcuICovXG4gIGV4aXQoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgLy8gSXQncyBjb21tb24gZm9yIHNuYWNrIGJhcnMgdG8gYmUgb3BlbmVkIGJ5IHJhbmRvbSBvdXRzaWRlIGNhbGxzIGxpa2UgSFRUUCByZXF1ZXN0cyBvclxuICAgIC8vIGVycm9ycy4gUnVuIGluc2lkZSB0aGUgTmdab25lIHRvIGVuc3VyZSB0aGF0IGl0IGZ1bmN0aW9ucyBjb3JyZWN0bHkuXG4gICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAvLyBOb3RlOiB0aGlzIG9uZSB0cmFuc2l0aW9ucyB0byBgaGlkZGVuYCwgcmF0aGVyIHRoYW4gYHZvaWRgLCBpbiBvcmRlciB0byBoYW5kbGUgdGhlIGNhc2VcbiAgICAgIC8vIHdoZXJlIG11bHRpcGxlIHNuYWNrIGJhcnMgYXJlIG9wZW5lZCBpbiBxdWljayBzdWNjZXNzaW9uIChlLmcuIHR3byBjb25zZWN1dGl2ZSBjYWxscyB0b1xuICAgICAgLy8gYE1hdFNuYWNrQmFyLm9wZW5gKS5cbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ2hpZGRlbic7XG5cbiAgICAgIC8vIE1hcmsgdGhpcyBlbGVtZW50IHdpdGggYW4gJ2V4aXQnIGF0dHJpYnV0ZSB0byBpbmRpY2F0ZSB0aGF0IHRoZSBzbmFja2JhciBoYXNcbiAgICAgIC8vIGJlZW4gZGlzbWlzc2VkIGFuZCB3aWxsIHNvb24gYmUgcmVtb3ZlZCBmcm9tIHRoZSBET00uIFRoaXMgaXMgdXNlZCBieSB0aGUgc25hY2tiYXJcbiAgICAgIC8vIHRlc3QgaGFybmVzcy5cbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ21hdC1leGl0JywgJycpO1xuXG4gICAgICAvLyBJZiB0aGUgc25hY2sgYmFyIGhhc24ndCBiZWVuIGFubm91bmNlZCBieSB0aGUgdGltZSBpdCBleGl0cyBpdCB3b3VsZG4ndCBoYXZlIGJlZW4gb3BlblxuICAgICAgLy8gbG9uZyBlbm91Z2ggdG8gdmlzdWFsbHkgcmVhZCBpdCBlaXRoZXIsIHNvIGNsZWFyIHRoZSB0aW1lb3V0IGZvciBhbm5vdW5jaW5nLlxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2Fubm91bmNlVGltZW91dElkKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLl9vbkV4aXQ7XG4gIH1cblxuICAvKiogTWFrZXMgc3VyZSB0aGUgZXhpdCBjYWxsYmFja3MgaGF2ZSBiZWVuIGludm9rZWQgd2hlbiB0aGUgZWxlbWVudCBpcyBkZXN0cm95ZWQuICovXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5fY2xlYXJGcm9tTW9kYWxzKCk7XG4gICAgdGhpcy5fY29tcGxldGVFeGl0KCk7XG4gIH1cblxuICAvKipcbiAgICogV2FpdHMgZm9yIHRoZSB6b25lIHRvIHNldHRsZSBiZWZvcmUgcmVtb3ZpbmcgdGhlIGVsZW1lbnQuIEhlbHBzIHByZXZlbnRcbiAgICogZXJyb3JzIHdoZXJlIHdlIGVuZCB1cCByZW1vdmluZyBhbiBlbGVtZW50IHdoaWNoIGlzIGluIHRoZSBtaWRkbGUgb2YgYW4gYW5pbWF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfY29tcGxldGVFeGl0KCkge1xuICAgIHRoaXMuX25nWm9uZS5vbk1pY3JvdGFza0VtcHR5LnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl9vbkV4aXQubmV4dCgpO1xuICAgICAgICB0aGlzLl9vbkV4aXQuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBhZnRlciB0aGUgcG9ydGFsIGNvbnRlbnRzIGhhdmUgYmVlbiBhdHRhY2hlZC4gQ2FuIGJlXG4gICAqIHVzZWQgdG8gbW9kaWZ5IHRoZSBET00gb25jZSBpdCdzIGd1YXJhbnRlZWQgdG8gYmUgaW4gcGxhY2UuXG4gICAqL1xuICBwcm90ZWN0ZWQgX2FmdGVyUG9ydGFsQXR0YWNoZWQoKSB7XG4gICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgcGFuZWxDbGFzc2VzID0gdGhpcy5zbmFja0JhckNvbmZpZy5wYW5lbENsYXNzO1xuXG4gICAgaWYgKHBhbmVsQ2xhc3Nlcykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFuZWxDbGFzc2VzKSkge1xuICAgICAgICAvLyBOb3RlIHRoYXQgd2UgY2FuJ3QgdXNlIGEgc3ByZWFkIGhlcmUsIGJlY2F1c2UgSUUgZG9lc24ndCBzdXBwb3J0IG11bHRpcGxlIGFyZ3VtZW50cy5cbiAgICAgICAgcGFuZWxDbGFzc2VzLmZvckVhY2goY3NzQ2xhc3MgPT4gZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNzc0NsYXNzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQocGFuZWxDbGFzc2VzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9leHBvc2VUb01vZGFscygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNvbWUgYnJvd3NlcnMgd29uJ3QgZXhwb3NlIHRoZSBhY2Nlc3NpYmlsaXR5IG5vZGUgb2YgdGhlIGxpdmUgZWxlbWVudCBpZiB0aGVyZSBpcyBhblxuICAgKiBgYXJpYS1tb2RhbGAgYW5kIHRoZSBsaXZlIGVsZW1lbnQgaXMgb3V0c2lkZSBvZiBpdC4gVGhpcyBtZXRob2Qgd29ya3MgYXJvdW5kIHRoZSBpc3N1ZSBieVxuICAgKiBwb2ludGluZyB0aGUgYGFyaWEtb3duc2Agb2YgYWxsIG1vZGFscyB0byB0aGUgbGl2ZSBlbGVtZW50LlxuICAgKi9cbiAgcHJpdmF0ZSBfZXhwb3NlVG9Nb2RhbHMoKSB7XG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IGNvbnNpZGVyIGRlLWR1cGxpY2F0aW5nIHRoaXMgd2l0aCB0aGUgYExpdmVBbm5vdW5jZXJgLlxuICAgIC8vIE5vdGUgdGhhdCB0aGUgc2VsZWN0b3IgaGVyZSBpcyBsaW1pdGVkIHRvIENESyBvdmVybGF5cyBhdCB0aGUgbW9tZW50IGluIG9yZGVyIHRvIHJlZHVjZSB0aGVcbiAgICAvLyBzZWN0aW9uIG9mIHRoZSBET00gd2UgbmVlZCB0byBsb29rIHRocm91Z2guIFRoaXMgc2hvdWxkIGNvdmVyIGFsbCB0aGUgY2FzZXMgd2Ugc3VwcG9ydCwgYnV0XG4gICAgLy8gdGhlIHNlbGVjdG9yIGNhbiBiZSBleHBhbmRlZCBpZiBpdCB0dXJucyBvdXQgdG8gYmUgdG9vIG5hcnJvdy5cbiAgICBjb25zdCBpZCA9IHRoaXMuX2xpdmVFbGVtZW50SWQ7XG4gICAgY29uc3QgbW9kYWxzID0gdGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICdib2R5ID4gLmNkay1vdmVybGF5LWNvbnRhaW5lciBbYXJpYS1tb2RhbD1cInRydWVcIl0nLFxuICAgICk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vZGFscy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbW9kYWwgPSBtb2RhbHNbaV07XG4gICAgICBjb25zdCBhcmlhT3ducyA9IG1vZGFsLmdldEF0dHJpYnV0ZSgnYXJpYS1vd25zJyk7XG4gICAgICB0aGlzLl90cmFja2VkTW9kYWxzLmFkZChtb2RhbCk7XG5cbiAgICAgIGlmICghYXJpYU93bnMpIHtcbiAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKCdhcmlhLW93bnMnLCBpZCk7XG4gICAgICB9IGVsc2UgaWYgKGFyaWFPd25zLmluZGV4T2YoaWQpID09PSAtMSkge1xuICAgICAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtb3ducycsIGFyaWFPd25zICsgJyAnICsgaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBDbGVhcnMgdGhlIHJlZmVyZW5jZXMgdG8gdGhlIGxpdmUgZWxlbWVudCBmcm9tIGFueSBtb2RhbHMgaXQgd2FzIGFkZGVkIHRvLiAqL1xuICBwcml2YXRlIF9jbGVhckZyb21Nb2RhbHMoKSB7XG4gICAgdGhpcy5fdHJhY2tlZE1vZGFscy5mb3JFYWNoKG1vZGFsID0+IHtcbiAgICAgIGNvbnN0IGFyaWFPd25zID0gbW9kYWwuZ2V0QXR0cmlidXRlKCdhcmlhLW93bnMnKTtcblxuICAgICAgaWYgKGFyaWFPd25zKSB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gYXJpYU93bnMucmVwbGFjZSh0aGlzLl9saXZlRWxlbWVudElkLCAnJykudHJpbSgpO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKCdhcmlhLW93bnMnLCBuZXdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9kYWwucmVtb3ZlQXR0cmlidXRlKCdhcmlhLW93bnMnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX3RyYWNrZWRNb2RhbHMuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKiBBc3NlcnRzIHRoYXQgbm8gY29udGVudCBpcyBhbHJlYWR5IGF0dGFjaGVkIHRvIHRoZSBjb250YWluZXIuICovXG4gIHByaXZhdGUgX2Fzc2VydE5vdEF0dGFjaGVkKCkge1xuICAgIGlmICh0aGlzLl9wb3J0YWxPdXRsZXQuaGFzQXR0YWNoZWQoKSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0F0dGVtcHRpbmcgdG8gYXR0YWNoIHNuYWNrIGJhciBjb250ZW50IGFmdGVyIGNvbnRlbnQgaXMgYWxyZWFkeSBhdHRhY2hlZCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgYSB0aW1lb3V0IHRvIG1vdmUgdGhlIHNuYWNrIGJhciBjb250ZW50IHRvIHRoZSBsaXZlIHJlZ2lvbiBzbyBzY3JlZW4gcmVhZGVycyB3aWxsXG4gICAqIGFubm91bmNlIGl0LlxuICAgKi9cbiAgcHJpdmF0ZSBfc2NyZWVuUmVhZGVyQW5ub3VuY2UoKSB7XG4gICAgaWYgKCF0aGlzLl9hbm5vdW5jZVRpbWVvdXRJZCkge1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5fYW5ub3VuY2VUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBjb25zdCBpbmVydEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignW2FyaWEtaGlkZGVuXScpO1xuICAgICAgICAgIGNvbnN0IGxpdmVFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLWxpdmVdJyk7XG5cbiAgICAgICAgICBpZiAoaW5lcnRFbGVtZW50ICYmIGxpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBJZiBhbiBlbGVtZW50IGluIHRoZSBzbmFjayBiYXIgY29udGVudCBpcyBmb2N1c2VkIGJlZm9yZSBiZWluZyBtb3ZlZFxuICAgICAgICAgICAgLy8gdHJhY2sgaXQgYW5kIHJlc3RvcmUgZm9jdXMgYWZ0ZXIgbW92aW5nIHRvIHRoZSBsaXZlIHJlZ2lvbi5cbiAgICAgICAgICAgIGxldCBmb2N1c2VkRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyICYmXG4gICAgICAgICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJlxuICAgICAgICAgICAgICBpbmVydEVsZW1lbnQuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBmb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluZXJ0RWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG4gICAgICAgICAgICBsaXZlRWxlbWVudC5hcHBlbmRDaGlsZChpbmVydEVsZW1lbnQpO1xuICAgICAgICAgICAgZm9jdXNlZEVsZW1lbnQ/LmZvY3VzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX29uQW5ub3VuY2UubmV4dCgpO1xuICAgICAgICAgICAgdGhpcy5fb25Bbm5vdW5jZS5jb21wbGV0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcy5fYW5ub3VuY2VEZWxheSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBJbnRlcm5hbCBjb21wb25lbnQgdGhhdCB3cmFwcyB1c2VyLXByb3ZpZGVkIHNuYWNrIGJhciBjb250ZW50LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc25hY2stYmFyLWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlVXJsOiAnc25hY2stYmFyLWNvbnRhaW5lci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3NuYWNrLWJhci1jb250YWluZXIuY3NzJ10sXG4gIC8vIEluIEl2eSBlbWJlZGRlZCB2aWV3cyB3aWxsIGJlIGNoYW5nZSBkZXRlY3RlZCBmcm9tIHRoZWlyIGRlY2xhcmF0aW9uIHBsYWNlLCByYXRoZXIgdGhhblxuICAvLyB3aGVyZSB0aGV5IHdlcmUgc3RhbXBlZCBvdXQuIFRoaXMgbWVhbnMgdGhhdCB3ZSBjYW4ndCBoYXZlIHRoZSBzbmFjayBiYXIgY29udGFpbmVyIGJlIE9uUHVzaCxcbiAgLy8gYmVjYXVzZSBpdCBtaWdodCBjYXVzZSBzbmFjayBiYXJzIHRoYXQgd2VyZSBvcGVuZWQgZnJvbSBhIHRlbXBsYXRlIG5vdCB0byBiZSBvdXQgb2YgZGF0ZS5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBhbmltYXRpb25zOiBbbWF0U25hY2tCYXJBbmltYXRpb25zLnNuYWNrQmFyU3RhdGVdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy1zbmFja2JhciBtYXQtbWRjLXNuYWNrLWJhci1jb250YWluZXIgbWRjLXNuYWNrYmFyLS1vcGVuJyxcbiAgICAnW0BzdGF0ZV0nOiAnX2FuaW1hdGlvblN0YXRlJyxcbiAgICAnKEBzdGF0ZS5kb25lKSc6ICdvbkFuaW1hdGlvbkVuZCgkZXZlbnQpJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U25hY2tCYXJDb250YWluZXIgZXh0ZW5kcyBfTWF0U25hY2tCYXJDb250YWluZXJCYXNlIHtcbiAgLyoqXG4gICAqIEVsZW1lbnQgdGhhdCB3aWxsIGhhdmUgdGhlIGBtZGMtc25hY2tiYXJfX2xhYmVsYCBjbGFzcyBhcHBsaWVkIGlmIHRoZSBhdHRhY2hlZCBjb21wb25lbnRcbiAgICogb3IgdGVtcGxhdGUgZG9lcyBub3QgaGF2ZSBpdC4gVGhpcyBlbnN1cmVzIHRoYXQgdGhlIGFwcHJvcHJpYXRlIHN0cnVjdHVyZSwgdHlwb2dyYXBoeSwgYW5kXG4gICAqIGNvbG9yIGlzIGFwcGxpZWQgdG8gdGhlIGF0dGFjaGVkIHZpZXcuXG4gICAqL1xuICBAVmlld0NoaWxkKCdsYWJlbCcsIHtzdGF0aWM6IHRydWV9KSBfbGFiZWw6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIEFwcGxpZXMgdGhlIGNvcnJlY3QgQ1NTIGNsYXNzIHRvIHRoZSBsYWJlbCBiYXNlZCBvbiBpdHMgY29udGVudC4gKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9hZnRlclBvcnRhbEF0dGFjaGVkKCkge1xuICAgIHN1cGVyLl9hZnRlclBvcnRhbEF0dGFjaGVkKCk7XG5cbiAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGF0dGFjaGVkIGNvbXBvbmVudCBvciB0ZW1wbGF0ZSB1c2VzIHRoZSBNREMgdGVtcGxhdGUgc3RydWN0dXJlLFxuICAgIC8vIHNwZWNpZmljYWxseSB0aGUgTURDIGxhYmVsLiBJZiBub3QsIHRoZSBjb250YWluZXIgc2hvdWxkIGFwcGx5IHRoZSBNREMgbGFiZWwgY2xhc3MgdG8gdGhpc1xuICAgIC8vIGNvbXBvbmVudCdzIGxhYmVsIGNvbnRhaW5lciwgd2hpY2ggd2lsbCBhcHBseSBNREMncyBsYWJlbCBzdHlsZXMgdG8gdGhlIGF0dGFjaGVkIHZpZXcuXG4gICAgY29uc3QgbGFiZWwgPSB0aGlzLl9sYWJlbC5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IGxhYmVsQ2xhc3MgPSAnbWRjLXNuYWNrYmFyX19sYWJlbCc7XG4gICAgbGFiZWwuY2xhc3NMaXN0LnRvZ2dsZShsYWJlbENsYXNzLCAhbGFiZWwucXVlcnlTZWxlY3RvcihgLiR7bGFiZWxDbGFzc31gKSk7XG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtZGMtc25hY2tiYXJfX3N1cmZhY2VcIj5cbiAgPCEtLVxuICAgIFRoaXMgb3V0ZXIgbGFiZWwgd3JhcHBlciB3aWxsIGhhdmUgdGhlIGNsYXNzIGBtZGMtc25hY2tiYXJfX2xhYmVsYCBhcHBsaWVkIGlmXG4gICAgdGhlIGF0dGFjaGVkIHRlbXBsYXRlL2NvbXBvbmVudCBkb2VzIG5vdCBjb250YWluIGl0LlxuICAtLT5cbiAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtc25hY2stYmFyLWxhYmVsXCIgI2xhYmVsPlxuICAgIDwhLS0gSW5pdGlhbHkgaG9sZHMgdGhlIHNuYWNrIGJhciBjb250ZW50LCB3aWxsIGJlIGVtcHR5IGFmdGVyIGFubm91bmNpbmcgdG8gc2NyZWVuIHJlYWRlcnMuIC0tPlxuICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICA8bmctdGVtcGxhdGUgY2RrUG9ydGFsT3V0bGV0PjwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG5cbiAgICA8IS0tIFdpbGwgcmVjZWl2ZSB0aGUgc25hY2sgYmFyIGNvbnRlbnQgZnJvbSB0aGUgbm9uLWxpdmUgZGl2LCBtb3ZlIHdpbGwgaGFwcGVuIGEgc2hvcnQgZGVsYXkgYWZ0ZXIgb3BlbmluZyAtLT5cbiAgICA8ZGl2IFthdHRyLmFyaWEtbGl2ZV09XCJfbGl2ZVwiIFthdHRyLnJvbGVdPVwiX3JvbGVcIiBbYXR0ci5pZF09XCJfbGl2ZUVsZW1lbnRJZFwiPjwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19