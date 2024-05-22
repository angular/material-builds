/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor, FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { OverlayRef } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, NgZone, Optional, ViewEncapsulation, ANIMATION_MODULE_TYPE, } from '@angular/core';
import { MatDialogConfig } from './dialog-config';
import { CdkDialogContainer } from '@angular/cdk/dialog';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "./dialog-config";
import * as i3 from "@angular/cdk/overlay";
/** Class added when the dialog is open. */
const OPEN_CLASS = 'mdc-dialog--open';
/** Class added while the dialog is opening. */
const OPENING_CLASS = 'mdc-dialog--opening';
/** Class added while the dialog is closing. */
const CLOSING_CLASS = 'mdc-dialog--closing';
/** Duration of the opening animation in milliseconds. */
export const OPEN_ANIMATION_DURATION = 150;
/** Duration of the closing animation in milliseconds. */
export const CLOSE_ANIMATION_DURATION = 75;
export class MatDialogContainer extends CdkDialogContainer {
    constructor(elementRef, focusTrapFactory, _document, dialogConfig, interactivityChecker, ngZone, overlayRef, _animationMode, focusMonitor) {
        super(elementRef, focusTrapFactory, _document, dialogConfig, interactivityChecker, ngZone, overlayRef, focusMonitor);
        this._animationMode = _animationMode;
        /** Emits when an animation state changes. */
        this._animationStateChanged = new EventEmitter();
        /** Whether animations are enabled. */
        this._animationsEnabled = this._animationMode !== 'NoopAnimations';
        /** Number of actions projected in the dialog. */
        this._actionSectionCount = 0;
        /** Host element of the dialog container component. */
        this._hostElement = this._elementRef.nativeElement;
        /** Duration of the dialog open animation. */
        this._enterAnimationDuration = this._animationsEnabled
            ? parseCssTime(this._config.enterAnimationDuration) ?? OPEN_ANIMATION_DURATION
            : 0;
        /** Duration of the dialog close animation. */
        this._exitAnimationDuration = this._animationsEnabled
            ? parseCssTime(this._config.exitAnimationDuration) ?? CLOSE_ANIMATION_DURATION
            : 0;
        /** Current timer for dialog animations. */
        this._animationTimer = null;
        this._isDestroyed = false;
        /**
         * Completes the dialog open by clearing potential animation classes, trapping
         * focus and emitting an opened event.
         */
        this._finishDialogOpen = () => {
            this._clearAnimationClasses();
            this._openAnimationDone(this._enterAnimationDuration);
        };
        /**
         * Completes the dialog close by clearing potential animation classes, restoring
         * focus and emitting a closed event.
         */
        this._finishDialogClose = () => {
            this._clearAnimationClasses();
            this._animationStateChanged.emit({ state: 'closed', totalTime: this._exitAnimationDuration });
        };
    }
    _contentAttached() {
        // Delegate to the original dialog-container initialization (i.e. saving the
        // previous element, setting up the focus trap and moving focus to the container).
        super._contentAttached();
        // Note: Usually we would be able to use the MDC dialog foundation here to handle
        // the dialog animation for us, but there are a few reasons why we just leverage
        // their styles and not use the runtime foundation code:
        //   1. Foundation does not allow us to disable animations.
        //   2. Foundation contains unnecessary features we don't need and aren't
        //      tree-shakeable. e.g. background scrim, keyboard event handlers for ESC button.
        //   3. Foundation uses unnecessary timers for animations to work around limitations
        //      in React's `setState` mechanism.
        //      https://github.com/material-components/material-components-web/pull/3682.
        this._startOpenAnimation();
    }
    /** Starts the dialog open animation if enabled. */
    _startOpenAnimation() {
        this._animationStateChanged.emit({ state: 'opening', totalTime: this._enterAnimationDuration });
        if (this._animationsEnabled) {
            this._hostElement.style.setProperty(TRANSITION_DURATION_PROPERTY, `${this._enterAnimationDuration}ms`);
            // We need to give the `setProperty` call from above some time to be applied.
            // One would expect that the open class is added once the animation finished, but MDC
            // uses the open class in combination with the opening class to start the animation.
            this._requestAnimationFrame(() => this._hostElement.classList.add(OPENING_CLASS, OPEN_CLASS));
            this._waitForAnimationToComplete(this._enterAnimationDuration, this._finishDialogOpen);
        }
        else {
            this._hostElement.classList.add(OPEN_CLASS);
            // Note: We could immediately finish the dialog opening here with noop animations,
            // but we defer until next tick so that consumers can subscribe to `afterOpened`.
            // Executing this immediately would mean that `afterOpened` emits synchronously
            // on `dialog.open` before the consumer had a change to subscribe to `afterOpened`.
            Promise.resolve().then(() => this._finishDialogOpen());
        }
    }
    /**
     * Starts the exit animation of the dialog if enabled. This method is
     * called by the dialog ref.
     */
    _startExitAnimation() {
        this._animationStateChanged.emit({ state: 'closing', totalTime: this._exitAnimationDuration });
        this._hostElement.classList.remove(OPEN_CLASS);
        if (this._animationsEnabled) {
            this._hostElement.style.setProperty(TRANSITION_DURATION_PROPERTY, `${this._exitAnimationDuration}ms`);
            // We need to give the `setProperty` call from above some time to be applied.
            this._requestAnimationFrame(() => this._hostElement.classList.add(CLOSING_CLASS));
            this._waitForAnimationToComplete(this._exitAnimationDuration, this._finishDialogClose);
        }
        else {
            // This subscription to the `OverlayRef#backdropClick` observable in the `DialogRef` is
            // set up before any user can subscribe to the backdrop click. The subscription triggers
            // the dialog close and this method synchronously. If we'd synchronously emit the `CLOSED`
            // animation state event if animations are disabled, the overlay would be disposed
            // immediately and all other subscriptions to `DialogRef#backdropClick` would be silently
            // skipped. We work around this by waiting with the dialog close until the next tick when
            // all subscriptions have been fired as expected. This is not an ideal solution, but
            // there doesn't seem to be any other good way. Alternatives that have been considered:
            //   1. Deferring `DialogRef.close`. This could be a breaking change due to a new microtask.
            //      Also this issue is specific to the MDC implementation where the dialog could
            //      technically be closed synchronously. In the non-MDC one, Angular animations are used
            //      and closing always takes at least a tick.
            //   2. Ensuring that user subscriptions to `backdropClick`, `keydownEvents` in the dialog
            //      ref are first. This would solve the issue, but has the risk of memory leaks and also
            //      doesn't solve the case where consumers call `DialogRef.close` in their subscriptions.
            // Based on the fact that this is specific to the MDC-based implementation of the dialog
            // animations, the defer is applied here.
            Promise.resolve().then(() => this._finishDialogClose());
        }
    }
    /**
     * Updates the number action sections.
     * @param delta Increase/decrease in the number of sections.
     */
    _updateActionSectionCount(delta) {
        this._actionSectionCount += delta;
        this._changeDetectorRef.markForCheck();
    }
    /** Clears all dialog animation classes. */
    _clearAnimationClasses() {
        this._hostElement.classList.remove(OPENING_CLASS, CLOSING_CLASS);
    }
    _waitForAnimationToComplete(duration, callback) {
        if (this._animationTimer !== null) {
            clearTimeout(this._animationTimer);
        }
        // Note that we want this timer to run inside the NgZone, because we want
        // the related events like `afterClosed` to be inside the zone as well.
        this._animationTimer = setTimeout(callback, duration);
    }
    /** Runs a callback in `requestAnimationFrame`, if available. */
    _requestAnimationFrame(callback) {
        this._ngZone.runOutsideAngular(() => {
            if (typeof requestAnimationFrame === 'function') {
                requestAnimationFrame(callback);
            }
            else {
                callback();
            }
        });
    }
    _captureInitialFocus() {
        if (!this._config.delayFocusTrap) {
            this._trapFocus();
        }
    }
    /**
     * Callback for when the open dialog animation has finished. Intended to
     * be called by sub-classes that use different animation implementations.
     */
    _openAnimationDone(totalTime) {
        if (this._isDestroyed) {
            return;
        }
        if (this._config.delayFocusTrap) {
            this._trapFocus();
        }
        this._animationStateChanged.next({ state: 'opened', totalTime });
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._animationTimer !== null) {
            clearTimeout(this._animationTimer);
        }
        this._isDestroyed = true;
    }
    attachComponentPortal(portal) {
        // When a component is passed into the dialog, the host element interrupts
        // the `display:flex` from affecting the dialog title, content, and
        // actions. To fix this, we make the component host `display: contents` by
        // marking its host with the `mat-mdc-dialog-component-host` class.
        //
        // Note that this problem does not exist when a template ref is used since
        // the title, contents, and actions are then nested directly under the
        // dialog surface.
        const ref = super.attachComponentPortal(portal);
        ref.location.nativeElement.classList.add('mat-mdc-dialog-component-host');
        return ref;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatDialogContainer, deps: [{ token: i0.ElementRef }, { token: i1.FocusTrapFactory }, { token: DOCUMENT, optional: true }, { token: i2.MatDialogConfig }, { token: i1.InteractivityChecker }, { token: i0.NgZone }, { token: i3.OverlayRef }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: i1.FocusMonitor }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.0", type: MatDialogContainer, isStandalone: true, selector: "mat-dialog-container", host: { attributes: { "tabindex": "-1" }, properties: { "attr.aria-modal": "_config.ariaModal", "id": "_config.id", "attr.role": "_config.role", "attr.aria-labelledby": "_config.ariaLabel ? null : _ariaLabelledByQueue[0]", "attr.aria-label": "_config.ariaLabel", "attr.aria-describedby": "_config.ariaDescribedBy || null", "class._mat-animation-noopable": "!_animationsEnabled", "class.mat-mdc-dialog-container-with-actions": "_actionSectionCount > 0" }, classAttribute: "mat-mdc-dialog-container mdc-dialog" }, usesInheritance: true, ngImport: i0, template: "<div class=\"mat-mdc-dialog-inner-container mdc-dialog__container\">\n  <div class=\"mat-mdc-dialog-surface mdc-dialog__surface\">\n    <ng-template cdkPortalOutlet />\n  </div>\n</div>\n", styles: [".mat-mdc-dialog-container{width:100%;height:100%;display:block;box-sizing:border-box;max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;outline:0}.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-max-width, 80vw);min-width:var(--mat-dialog-container-min-width, 0)}@media(max-width: 599px){.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-small-max-width, 80vw)}}.mat-mdc-dialog-inner-container{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;opacity:0;transition:opacity linear var(--mat-dialog-transition-duration, 0ms);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit}.mdc-dialog--closing .mat-mdc-dialog-inner-container{transition:opacity 75ms linear;transform:none}.mdc-dialog--open .mat-mdc-dialog-inner-container{opacity:1}._mat-animation-noopable .mat-mdc-dialog-inner-container{transition:none}.mat-mdc-dialog-surface{display:flex;flex-direction:column;flex-grow:0;flex-shrink:0;box-sizing:border-box;width:100%;height:100%;position:relative;overflow-y:auto;outline:0;transform:scale(0.8);transition:transform var(--mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;box-shadow:var(--mat-dialog-container-elevation-shadow, 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12));border-radius:var(--mdc-dialog-container-shape, 4px);background-color:var(--mdc-dialog-container-color, white)}[dir=rtl] .mat-mdc-dialog-surface{text-align:right}.mdc-dialog--open .mat-mdc-dialog-surface,.mdc-dialog--closing .mat-mdc-dialog-surface{transform:none}._mat-animation-noopable .mat-mdc-dialog-surface{transition:none}.mat-mdc-dialog-surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:2px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}.mat-mdc-dialog-title{display:block;margin-top:0;position:relative;flex-shrink:0;box-sizing:border-box;margin:0 0 1px;padding:var(--mat-dialog-headline-padding, 0 24px 9px)}.mat-mdc-dialog-title::before{display:inline-block;width:0;height:40px;content:\"\";vertical-align:0}[dir=rtl] .mat-mdc-dialog-title{text-align:right}.mat-mdc-dialog-container .mat-mdc-dialog-title{color:var(--mdc-dialog-subhead-color, rgba(0, 0, 0, 0.87));font-family:var(--mdc-dialog-subhead-font, Roboto, sans-serif);line-height:var(--mdc-dialog-subhead-line-height, 1.5rem);font-size:var(--mdc-dialog-subhead-size, 1rem);font-weight:var(--mdc-dialog-subhead-weight, 400);letter-spacing:var(--mdc-dialog-subhead-tracking, 0.03125em)}.mat-mdc-dialog-content{display:block;flex-grow:1;box-sizing:border-box;margin:0;overflow:auto;max-height:65vh}.mat-mdc-dialog-content>:first-child{margin-top:0}.mat-mdc-dialog-content>:last-child{margin-bottom:0}.mat-mdc-dialog-container .mat-mdc-dialog-content{color:var(--mdc-dialog-supporting-text-color, rgba(0, 0, 0, 0.6));font-family:var(--mdc-dialog-supporting-text-font, Roboto, sans-serif);line-height:var(--mdc-dialog-supporting-text-line-height, 1.5rem);font-size:var(--mdc-dialog-supporting-text-size, 1rem);font-weight:var(--mdc-dialog-supporting-text-weight, 400);letter-spacing:var(--mdc-dialog-supporting-text-tracking, 0.03125em)}.mat-mdc-dialog-container .mat-mdc-dialog-content{padding:var(--mat-dialog-content-padding, 20px 24px)}.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content{padding:var(--mat-dialog-with-actions-content-padding, 20px 24px)}.mat-mdc-dialog-container .mat-mdc-dialog-title+.mat-mdc-dialog-content{padding-top:0}.mat-mdc-dialog-actions{display:flex;position:relative;flex-shrink:0;flex-wrap:wrap;align-items:center;justify-content:flex-end;box-sizing:border-box;min-height:52px;margin:0;padding:8px;border-top:1px solid rgba(0,0,0,0);padding:var(--mat-dialog-actions-padding, 8px);justify-content:var(--mat-dialog-actions-alignment, start)}.cdk-high-contrast-active .mat-mdc-dialog-actions{border-top-color:CanvasText}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start,.mat-mdc-dialog-actions[align=start]{justify-content:start}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center,.mat-mdc-dialog-actions[align=center]{justify-content:center}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end,.mat-mdc-dialog-actions[align=end]{justify-content:flex-end}.mat-mdc-dialog-actions .mat-button-base+.mat-button-base,.mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-mdc-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}.mat-mdc-dialog-component-host{display:contents}"], dependencies: [{ kind: "directive", type: CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatDialogContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-dialog-container', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, standalone: true, imports: [CdkPortalOutlet], host: {
                        'class': 'mat-mdc-dialog-container mdc-dialog',
                        'tabindex': '-1',
                        '[attr.aria-modal]': '_config.ariaModal',
                        '[id]': '_config.id',
                        '[attr.role]': '_config.role',
                        '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledByQueue[0]',
                        '[attr.aria-label]': '_config.ariaLabel',
                        '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
                        '[class._mat-animation-noopable]': '!_animationsEnabled',
                        '[class.mat-mdc-dialog-container-with-actions]': '_actionSectionCount > 0',
                    }, template: "<div class=\"mat-mdc-dialog-inner-container mdc-dialog__container\">\n  <div class=\"mat-mdc-dialog-surface mdc-dialog__surface\">\n    <ng-template cdkPortalOutlet />\n  </div>\n</div>\n", styles: [".mat-mdc-dialog-container{width:100%;height:100%;display:block;box-sizing:border-box;max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;outline:0}.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-max-width, 80vw);min-width:var(--mat-dialog-container-min-width, 0)}@media(max-width: 599px){.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-small-max-width, 80vw)}}.mat-mdc-dialog-inner-container{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;opacity:0;transition:opacity linear var(--mat-dialog-transition-duration, 0ms);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit}.mdc-dialog--closing .mat-mdc-dialog-inner-container{transition:opacity 75ms linear;transform:none}.mdc-dialog--open .mat-mdc-dialog-inner-container{opacity:1}._mat-animation-noopable .mat-mdc-dialog-inner-container{transition:none}.mat-mdc-dialog-surface{display:flex;flex-direction:column;flex-grow:0;flex-shrink:0;box-sizing:border-box;width:100%;height:100%;position:relative;overflow-y:auto;outline:0;transform:scale(0.8);transition:transform var(--mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;box-shadow:var(--mat-dialog-container-elevation-shadow, 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12));border-radius:var(--mdc-dialog-container-shape, 4px);background-color:var(--mdc-dialog-container-color, white)}[dir=rtl] .mat-mdc-dialog-surface{text-align:right}.mdc-dialog--open .mat-mdc-dialog-surface,.mdc-dialog--closing .mat-mdc-dialog-surface{transform:none}._mat-animation-noopable .mat-mdc-dialog-surface{transition:none}.mat-mdc-dialog-surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:2px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}.mat-mdc-dialog-title{display:block;margin-top:0;position:relative;flex-shrink:0;box-sizing:border-box;margin:0 0 1px;padding:var(--mat-dialog-headline-padding, 0 24px 9px)}.mat-mdc-dialog-title::before{display:inline-block;width:0;height:40px;content:\"\";vertical-align:0}[dir=rtl] .mat-mdc-dialog-title{text-align:right}.mat-mdc-dialog-container .mat-mdc-dialog-title{color:var(--mdc-dialog-subhead-color, rgba(0, 0, 0, 0.87));font-family:var(--mdc-dialog-subhead-font, Roboto, sans-serif);line-height:var(--mdc-dialog-subhead-line-height, 1.5rem);font-size:var(--mdc-dialog-subhead-size, 1rem);font-weight:var(--mdc-dialog-subhead-weight, 400);letter-spacing:var(--mdc-dialog-subhead-tracking, 0.03125em)}.mat-mdc-dialog-content{display:block;flex-grow:1;box-sizing:border-box;margin:0;overflow:auto;max-height:65vh}.mat-mdc-dialog-content>:first-child{margin-top:0}.mat-mdc-dialog-content>:last-child{margin-bottom:0}.mat-mdc-dialog-container .mat-mdc-dialog-content{color:var(--mdc-dialog-supporting-text-color, rgba(0, 0, 0, 0.6));font-family:var(--mdc-dialog-supporting-text-font, Roboto, sans-serif);line-height:var(--mdc-dialog-supporting-text-line-height, 1.5rem);font-size:var(--mdc-dialog-supporting-text-size, 1rem);font-weight:var(--mdc-dialog-supporting-text-weight, 400);letter-spacing:var(--mdc-dialog-supporting-text-tracking, 0.03125em)}.mat-mdc-dialog-container .mat-mdc-dialog-content{padding:var(--mat-dialog-content-padding, 20px 24px)}.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content{padding:var(--mat-dialog-with-actions-content-padding, 20px 24px)}.mat-mdc-dialog-container .mat-mdc-dialog-title+.mat-mdc-dialog-content{padding-top:0}.mat-mdc-dialog-actions{display:flex;position:relative;flex-shrink:0;flex-wrap:wrap;align-items:center;justify-content:flex-end;box-sizing:border-box;min-height:52px;margin:0;padding:8px;border-top:1px solid rgba(0,0,0,0);padding:var(--mat-dialog-actions-padding, 8px);justify-content:var(--mat-dialog-actions-alignment, start)}.cdk-high-contrast-active .mat-mdc-dialog-actions{border-top-color:CanvasText}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start,.mat-mdc-dialog-actions[align=start]{justify-content:start}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center,.mat-mdc-dialog-actions[align=center]{justify-content:center}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end,.mat-mdc-dialog-actions[align=end]{justify-content:flex-end}.mat-mdc-dialog-actions .mat-button-base+.mat-button-base,.mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-mdc-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}.mat-mdc-dialog-component-host{display:contents}"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.FocusTrapFactory }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i2.MatDialogConfig }, { type: i1.InteractivityChecker }, { type: i0.NgZone }, { type: i3.OverlayRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }, { type: i1.FocusMonitor }] });
const TRANSITION_DURATION_PROPERTY = '--mat-dialog-transition-duration';
// TODO(mmalerba): Remove this function after animation durations are required
//  to be numbers.
/**
 * Converts a CSS time string to a number in ms. If the given time is already a
 * number, it is assumed to be in ms.
 */
function parseCssTime(time) {
    if (time == null) {
        return null;
    }
    if (typeof time === 'number') {
        return time;
    }
    if (time.endsWith('ms')) {
        return coerceNumberProperty(time.substring(0, time.length - 2));
    }
    if (time.endsWith('s')) {
        return coerceNumberProperty(time.substring(0, time.length - 1)) * 1000;
    }
    if (time === '0') {
        return 0;
    }
    return null; // anything else is invalid.
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUN2RixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDaEQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLE1BQU0sRUFFTixRQUFRLEVBQ1IsaUJBQWlCLEVBQ2pCLHFCQUFxQixHQUN0QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDaEQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGVBQWUsRUFBa0IsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7QUFRckUsMkNBQTJDO0FBQzNDLE1BQU0sVUFBVSxHQUFHLGtCQUFrQixDQUFDO0FBRXRDLCtDQUErQztBQUMvQyxNQUFNLGFBQWEsR0FBRyxxQkFBcUIsQ0FBQztBQUU1QywrQ0FBK0M7QUFDL0MsTUFBTSxhQUFhLEdBQUcscUJBQXFCLENBQUM7QUFFNUMseURBQXlEO0FBQ3pELE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHLEdBQUcsQ0FBQztBQUUzQyx5REFBeUQ7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TyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDeEIsT0FBTyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUNELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLE9BQU8sb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUN6RSxDQUFDO0lBQ0QsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBQ0QsT0FBTyxJQUFJLENBQUMsQ0FBQyw0QkFBNEI7QUFDM0MsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNUcmFwRmFjdG9yeSwgSW50ZXJhY3Rpdml0eUNoZWNrZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7T3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEFOSU1BVElPTl9NT0RVTEVfVFlQRSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdERpYWxvZ0NvbmZpZ30gZnJvbSAnLi9kaWFsb2ctY29uZmlnJztcbmltcG9ydCB7Q2RrRGlhbG9nQ29udGFpbmVyfSBmcm9tICdAYW5ndWxhci9jZGsvZGlhbG9nJztcbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0Nka1BvcnRhbE91dGxldCwgQ29tcG9uZW50UG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcblxuLyoqIEV2ZW50IHRoYXQgY2FwdHVyZXMgdGhlIHN0YXRlIG9mIGRpYWxvZyBjb250YWluZXIgYW5pbWF0aW9ucy4gKi9cbmludGVyZmFjZSBMZWdhY3lEaWFsb2dBbmltYXRpb25FdmVudCB7XG4gIHN0YXRlOiAnb3BlbmVkJyB8ICdvcGVuaW5nJyB8ICdjbG9zaW5nJyB8ICdjbG9zZWQnO1xuICB0b3RhbFRpbWU6IG51bWJlcjtcbn1cblxuLyoqIENsYXNzIGFkZGVkIHdoZW4gdGhlIGRpYWxvZyBpcyBvcGVuLiAqL1xuY29uc3QgT1BFTl9DTEFTUyA9ICdtZGMtZGlhbG9nLS1vcGVuJztcblxuLyoqIENsYXNzIGFkZGVkIHdoaWxlIHRoZSBkaWFsb2cgaXMgb3BlbmluZy4gKi9cbmNvbnN0IE9QRU5JTkdfQ0xBU1MgPSAnbWRjLWRpYWxvZy0tb3BlbmluZyc7XG5cbi8qKiBDbGFzcyBhZGRlZCB3aGlsZSB0aGUgZGlhbG9nIGlzIGNsb3NpbmcuICovXG5jb25zdCBDTE9TSU5HX0NMQVNTID0gJ21kYy1kaWFsb2ctLWNsb3NpbmcnO1xuXG4vKiogRHVyYXRpb24gb2YgdGhlIG9wZW5pbmcgYW5pbWF0aW9uIGluIG1pbGxpc2Vjb25kcy4gKi9cbmV4cG9ydCBjb25zdCBPUEVOX0FOSU1BVElPTl9EVVJBVElPTiA9IDE1MDtcblxuLyoqIER1cmF0aW9uIG9mIHRoZSBjbG9zaW5nIGFuaW1hdGlvbiBpbiBtaWxsaXNlY29uZHMuICovXG5leHBvcnQgY29uc3QgQ0xPU0VfQU5JTUFUSU9OX0RVUkFUSU9OID0gNzU7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kaWFsb2ctY29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICdkaWFsb2ctY29udGFpbmVyLmh0bWwnLFxuICBzdHlsZVVybDogJ2RpYWxvZy5jc3MnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAvLyBEaXNhYmxlZCBmb3IgY29uc2lzdGVuY3kgd2l0aCB0aGUgbm9uLU1EQyBkaWFsb2cgY29udGFpbmVyLlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtDZGtQb3J0YWxPdXRsZXRdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtZGlhbG9nLWNvbnRhaW5lciBtZGMtZGlhbG9nJyxcbiAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICdbYXR0ci5hcmlhLW1vZGFsXSc6ICdfY29uZmlnLmFyaWFNb2RhbCcsXG4gICAgJ1tpZF0nOiAnX2NvbmZpZy5pZCcsXG4gICAgJ1thdHRyLnJvbGVdJzogJ19jb25maWcucm9sZScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX2NvbmZpZy5hcmlhTGFiZWwgPyBudWxsIDogX2FyaWFMYWJlbGxlZEJ5UXVldWVbMF0nLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdfY29uZmlnLmFyaWFMYWJlbCcsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19jb25maWcuYXJpYURlc2NyaWJlZEJ5IHx8IG51bGwnLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJyFfYW5pbWF0aW9uc0VuYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LW1kYy1kaWFsb2ctY29udGFpbmVyLXdpdGgtYWN0aW9uc10nOiAnX2FjdGlvblNlY3Rpb25Db3VudCA+IDAnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dDb250YWluZXIgZXh0ZW5kcyBDZGtEaWFsb2dDb250YWluZXI8TWF0RGlhbG9nQ29uZmlnPiBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKiBFbWl0cyB3aGVuIGFuIGFuaW1hdGlvbiBzdGF0ZSBjaGFuZ2VzLiAqL1xuICBfYW5pbWF0aW9uU3RhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxMZWdhY3lEaWFsb2dBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogV2hldGhlciBhbmltYXRpb25zIGFyZSBlbmFibGVkLiAqL1xuICBfYW5pbWF0aW9uc0VuYWJsZWQ6IGJvb2xlYW4gPSB0aGlzLl9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnO1xuXG4gIC8qKiBOdW1iZXIgb2YgYWN0aW9ucyBwcm9qZWN0ZWQgaW4gdGhlIGRpYWxvZy4gKi9cbiAgcHJvdGVjdGVkIF9hY3Rpb25TZWN0aW9uQ291bnQgPSAwO1xuXG4gIC8qKiBIb3N0IGVsZW1lbnQgb2YgdGhlIGRpYWxvZyBjb250YWluZXIgY29tcG9uZW50LiAqL1xuICBwcml2YXRlIF9ob3N0RWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIC8qKiBEdXJhdGlvbiBvZiB0aGUgZGlhbG9nIG9wZW4gYW5pbWF0aW9uLiAqL1xuICBwcml2YXRlIF9lbnRlckFuaW1hdGlvbkR1cmF0aW9uID0gdGhpcy5fYW5pbWF0aW9uc0VuYWJsZWRcbiAgICA/IHBhcnNlQ3NzVGltZSh0aGlzLl9jb25maWcuZW50ZXJBbmltYXRpb25EdXJhdGlvbikgPz8gT1BFTl9BTklNQVRJT05fRFVSQVRJT05cbiAgICA6IDA7XG4gIC8qKiBEdXJhdGlvbiBvZiB0aGUgZGlhbG9nIGNsb3NlIGFuaW1hdGlvbi4gKi9cbiAgcHJpdmF0ZSBfZXhpdEFuaW1hdGlvbkR1cmF0aW9uID0gdGhpcy5fYW5pbWF0aW9uc0VuYWJsZWRcbiAgICA/IHBhcnNlQ3NzVGltZSh0aGlzLl9jb25maWcuZXhpdEFuaW1hdGlvbkR1cmF0aW9uKSA/PyBDTE9TRV9BTklNQVRJT05fRFVSQVRJT05cbiAgICA6IDA7XG4gIC8qKiBDdXJyZW50IHRpbWVyIGZvciBkaWFsb2cgYW5pbWF0aW9ucy4gKi9cbiAgcHJpdmF0ZSBfYW5pbWF0aW9uVGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBfaXNEZXN0cm95ZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIGZvY3VzVHJhcEZhY3Rvcnk6IEZvY3VzVHJhcEZhY3RvcnksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICAgZGlhbG9nQ29uZmlnOiBNYXREaWFsb2dDb25maWcsXG4gICAgaW50ZXJhY3Rpdml0eUNoZWNrZXI6IEludGVyYWN0aXZpdHlDaGVja2VyLFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHByaXZhdGUgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgZm9jdXNNb25pdG9yPzogRm9jdXNNb25pdG9yLFxuICApIHtcbiAgICBzdXBlcihcbiAgICAgIGVsZW1lbnRSZWYsXG4gICAgICBmb2N1c1RyYXBGYWN0b3J5LFxuICAgICAgX2RvY3VtZW50LFxuICAgICAgZGlhbG9nQ29uZmlnLFxuICAgICAgaW50ZXJhY3Rpdml0eUNoZWNrZXIsXG4gICAgICBuZ1pvbmUsXG4gICAgICBvdmVybGF5UmVmLFxuICAgICAgZm9jdXNNb25pdG9yLFxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX2NvbnRlbnRBdHRhY2hlZCgpOiB2b2lkIHtcbiAgICAvLyBEZWxlZ2F0ZSB0byB0aGUgb3JpZ2luYWwgZGlhbG9nLWNvbnRhaW5lciBpbml0aWFsaXphdGlvbiAoaS5lLiBzYXZpbmcgdGhlXG4gICAgLy8gcHJldmlvdXMgZWxlbWVudCwgc2V0dGluZyB1cCB0aGUgZm9jdXMgdHJhcCBhbmQgbW92aW5nIGZvY3VzIHRvIHRoZSBjb250YWluZXIpLlxuICAgIHN1cGVyLl9jb250ZW50QXR0YWNoZWQoKTtcblxuICAgIC8vIE5vdGU6IFVzdWFsbHkgd2Ugd291bGQgYmUgYWJsZSB0byB1c2UgdGhlIE1EQyBkaWFsb2cgZm91bmRhdGlvbiBoZXJlIHRvIGhhbmRsZVxuICAgIC8vIHRoZSBkaWFsb2cgYW5pbWF0aW9uIGZvciB1cywgYnV0IHRoZXJlIGFyZSBhIGZldyByZWFzb25zIHdoeSB3ZSBqdXN0IGxldmVyYWdlXG4gICAgLy8gdGhlaXIgc3R5bGVzIGFuZCBub3QgdXNlIHRoZSBydW50aW1lIGZvdW5kYXRpb24gY29kZTpcbiAgICAvLyAgIDEuIEZvdW5kYXRpb24gZG9lcyBub3QgYWxsb3cgdXMgdG8gZGlzYWJsZSBhbmltYXRpb25zLlxuICAgIC8vICAgMi4gRm91bmRhdGlvbiBjb250YWlucyB1bm5lY2Vzc2FyeSBmZWF0dXJlcyB3ZSBkb24ndCBuZWVkIGFuZCBhcmVuJ3RcbiAgICAvLyAgICAgIHRyZWUtc2hha2VhYmxlLiBlLmcuIGJhY2tncm91bmQgc2NyaW0sIGtleWJvYXJkIGV2ZW50IGhhbmRsZXJzIGZvciBFU0MgYnV0dG9uLlxuICAgIC8vICAgMy4gRm91bmRhdGlvbiB1c2VzIHVubmVjZXNzYXJ5IHRpbWVycyBmb3IgYW5pbWF0aW9ucyB0byB3b3JrIGFyb3VuZCBsaW1pdGF0aW9uc1xuICAgIC8vICAgICAgaW4gUmVhY3QncyBgc2V0U3RhdGVgIG1lY2hhbmlzbS5cbiAgICAvLyAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRlcmlhbC1jb21wb25lbnRzL21hdGVyaWFsLWNvbXBvbmVudHMtd2ViL3B1bGwvMzY4Mi5cbiAgICB0aGlzLl9zdGFydE9wZW5BbmltYXRpb24oKTtcbiAgfVxuXG4gIC8qKiBTdGFydHMgdGhlIGRpYWxvZyBvcGVuIGFuaW1hdGlvbiBpZiBlbmFibGVkLiAqL1xuICBwcml2YXRlIF9zdGFydE9wZW5BbmltYXRpb24oKSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLmVtaXQoe3N0YXRlOiAnb3BlbmluZycsIHRvdGFsVGltZTogdGhpcy5fZW50ZXJBbmltYXRpb25EdXJhdGlvbn0pO1xuXG4gICAgaWYgKHRoaXMuX2FuaW1hdGlvbnNFbmFibGVkKSB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcbiAgICAgICAgVFJBTlNJVElPTl9EVVJBVElPTl9QUk9QRVJUWSxcbiAgICAgICAgYCR7dGhpcy5fZW50ZXJBbmltYXRpb25EdXJhdGlvbn1tc2AsXG4gICAgICApO1xuXG4gICAgICAvLyBXZSBuZWVkIHRvIGdpdmUgdGhlIGBzZXRQcm9wZXJ0eWAgY2FsbCBmcm9tIGFib3ZlIHNvbWUgdGltZSB0byBiZSBhcHBsaWVkLlxuICAgICAgLy8gT25lIHdvdWxkIGV4cGVjdCB0aGF0IHRoZSBvcGVuIGNsYXNzIGlzIGFkZGVkIG9uY2UgdGhlIGFuaW1hdGlvbiBmaW5pc2hlZCwgYnV0IE1EQ1xuICAgICAgLy8gdXNlcyB0aGUgb3BlbiBjbGFzcyBpbiBjb21iaW5hdGlvbiB3aXRoIHRoZSBvcGVuaW5nIGNsYXNzIHRvIHN0YXJ0IHRoZSBhbmltYXRpb24uXG4gICAgICB0aGlzLl9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LmFkZChPUEVOSU5HX0NMQVNTLCBPUEVOX0NMQVNTKSk7XG4gICAgICB0aGlzLl93YWl0Rm9yQW5pbWF0aW9uVG9Db21wbGV0ZSh0aGlzLl9lbnRlckFuaW1hdGlvbkR1cmF0aW9uLCB0aGlzLl9maW5pc2hEaWFsb2dPcGVuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LmFkZChPUEVOX0NMQVNTKTtcbiAgICAgIC8vIE5vdGU6IFdlIGNvdWxkIGltbWVkaWF0ZWx5IGZpbmlzaCB0aGUgZGlhbG9nIG9wZW5pbmcgaGVyZSB3aXRoIG5vb3AgYW5pbWF0aW9ucyxcbiAgICAgIC8vIGJ1dCB3ZSBkZWZlciB1bnRpbCBuZXh0IHRpY2sgc28gdGhhdCBjb25zdW1lcnMgY2FuIHN1YnNjcmliZSB0byBgYWZ0ZXJPcGVuZWRgLlxuICAgICAgLy8gRXhlY3V0aW5nIHRoaXMgaW1tZWRpYXRlbHkgd291bGQgbWVhbiB0aGF0IGBhZnRlck9wZW5lZGAgZW1pdHMgc3luY2hyb25vdXNseVxuICAgICAgLy8gb24gYGRpYWxvZy5vcGVuYCBiZWZvcmUgdGhlIGNvbnN1bWVyIGhhZCBhIGNoYW5nZSB0byBzdWJzY3JpYmUgdG8gYGFmdGVyT3BlbmVkYC5cbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gdGhpcy5fZmluaXNoRGlhbG9nT3BlbigpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBleGl0IGFuaW1hdGlvbiBvZiB0aGUgZGlhbG9nIGlmIGVuYWJsZWQuIFRoaXMgbWV0aG9kIGlzXG4gICAqIGNhbGxlZCBieSB0aGUgZGlhbG9nIHJlZi5cbiAgICovXG4gIF9zdGFydEV4aXRBbmltYXRpb24oKTogdm9pZCB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLmVtaXQoe3N0YXRlOiAnY2xvc2luZycsIHRvdGFsVGltZTogdGhpcy5fZXhpdEFuaW1hdGlvbkR1cmF0aW9ufSk7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShPUEVOX0NMQVNTKTtcblxuICAgIGlmICh0aGlzLl9hbmltYXRpb25zRW5hYmxlZCkge1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXG4gICAgICAgIFRSQU5TSVRJT05fRFVSQVRJT05fUFJPUEVSVFksXG4gICAgICAgIGAke3RoaXMuX2V4aXRBbmltYXRpb25EdXJhdGlvbn1tc2AsXG4gICAgICApO1xuXG4gICAgICAvLyBXZSBuZWVkIHRvIGdpdmUgdGhlIGBzZXRQcm9wZXJ0eWAgY2FsbCBmcm9tIGFib3ZlIHNvbWUgdGltZSB0byBiZSBhcHBsaWVkLlxuICAgICAgdGhpcy5fcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xPU0lOR19DTEFTUykpO1xuICAgICAgdGhpcy5fd2FpdEZvckFuaW1hdGlvblRvQ29tcGxldGUodGhpcy5fZXhpdEFuaW1hdGlvbkR1cmF0aW9uLCB0aGlzLl9maW5pc2hEaWFsb2dDbG9zZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoaXMgc3Vic2NyaXB0aW9uIHRvIHRoZSBgT3ZlcmxheVJlZiNiYWNrZHJvcENsaWNrYCBvYnNlcnZhYmxlIGluIHRoZSBgRGlhbG9nUmVmYCBpc1xuICAgICAgLy8gc2V0IHVwIGJlZm9yZSBhbnkgdXNlciBjYW4gc3Vic2NyaWJlIHRvIHRoZSBiYWNrZHJvcCBjbGljay4gVGhlIHN1YnNjcmlwdGlvbiB0cmlnZ2Vyc1xuICAgICAgLy8gdGhlIGRpYWxvZyBjbG9zZSBhbmQgdGhpcyBtZXRob2Qgc3luY2hyb25vdXNseS4gSWYgd2UnZCBzeW5jaHJvbm91c2x5IGVtaXQgdGhlIGBDTE9TRURgXG4gICAgICAvLyBhbmltYXRpb24gc3RhdGUgZXZlbnQgaWYgYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQsIHRoZSBvdmVybGF5IHdvdWxkIGJlIGRpc3Bvc2VkXG4gICAgICAvLyBpbW1lZGlhdGVseSBhbmQgYWxsIG90aGVyIHN1YnNjcmlwdGlvbnMgdG8gYERpYWxvZ1JlZiNiYWNrZHJvcENsaWNrYCB3b3VsZCBiZSBzaWxlbnRseVxuICAgICAgLy8gc2tpcHBlZC4gV2Ugd29yayBhcm91bmQgdGhpcyBieSB3YWl0aW5nIHdpdGggdGhlIGRpYWxvZyBjbG9zZSB1bnRpbCB0aGUgbmV4dCB0aWNrIHdoZW5cbiAgICAgIC8vIGFsbCBzdWJzY3JpcHRpb25zIGhhdmUgYmVlbiBmaXJlZCBhcyBleHBlY3RlZC4gVGhpcyBpcyBub3QgYW4gaWRlYWwgc29sdXRpb24sIGJ1dFxuICAgICAgLy8gdGhlcmUgZG9lc24ndCBzZWVtIHRvIGJlIGFueSBvdGhlciBnb29kIHdheS4gQWx0ZXJuYXRpdmVzIHRoYXQgaGF2ZSBiZWVuIGNvbnNpZGVyZWQ6XG4gICAgICAvLyAgIDEuIERlZmVycmluZyBgRGlhbG9nUmVmLmNsb3NlYC4gVGhpcyBjb3VsZCBiZSBhIGJyZWFraW5nIGNoYW5nZSBkdWUgdG8gYSBuZXcgbWljcm90YXNrLlxuICAgICAgLy8gICAgICBBbHNvIHRoaXMgaXNzdWUgaXMgc3BlY2lmaWMgdG8gdGhlIE1EQyBpbXBsZW1lbnRhdGlvbiB3aGVyZSB0aGUgZGlhbG9nIGNvdWxkXG4gICAgICAvLyAgICAgIHRlY2huaWNhbGx5IGJlIGNsb3NlZCBzeW5jaHJvbm91c2x5LiBJbiB0aGUgbm9uLU1EQyBvbmUsIEFuZ3VsYXIgYW5pbWF0aW9ucyBhcmUgdXNlZFxuICAgICAgLy8gICAgICBhbmQgY2xvc2luZyBhbHdheXMgdGFrZXMgYXQgbGVhc3QgYSB0aWNrLlxuICAgICAgLy8gICAyLiBFbnN1cmluZyB0aGF0IHVzZXIgc3Vic2NyaXB0aW9ucyB0byBgYmFja2Ryb3BDbGlja2AsIGBrZXlkb3duRXZlbnRzYCBpbiB0aGUgZGlhbG9nXG4gICAgICAvLyAgICAgIHJlZiBhcmUgZmlyc3QuIFRoaXMgd291bGQgc29sdmUgdGhlIGlzc3VlLCBidXQgaGFzIHRoZSByaXNrIG9mIG1lbW9yeSBsZWFrcyBhbmQgYWxzb1xuICAgICAgLy8gICAgICBkb2Vzbid0IHNvbHZlIHRoZSBjYXNlIHdoZXJlIGNvbnN1bWVycyBjYWxsIGBEaWFsb2dSZWYuY2xvc2VgIGluIHRoZWlyIHN1YnNjcmlwdGlvbnMuXG4gICAgICAvLyBCYXNlZCBvbiB0aGUgZmFjdCB0aGF0IHRoaXMgaXMgc3BlY2lmaWMgdG8gdGhlIE1EQy1iYXNlZCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgZGlhbG9nXG4gICAgICAvLyBhbmltYXRpb25zLCB0aGUgZGVmZXIgaXMgYXBwbGllZCBoZXJlLlxuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB0aGlzLl9maW5pc2hEaWFsb2dDbG9zZSgpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgbnVtYmVyIGFjdGlvbiBzZWN0aW9ucy5cbiAgICogQHBhcmFtIGRlbHRhIEluY3JlYXNlL2RlY3JlYXNlIGluIHRoZSBudW1iZXIgb2Ygc2VjdGlvbnMuXG4gICAqL1xuICBfdXBkYXRlQWN0aW9uU2VjdGlvbkNvdW50KGRlbHRhOiBudW1iZXIpIHtcbiAgICB0aGlzLl9hY3Rpb25TZWN0aW9uQ291bnQgKz0gZGVsdGE7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGxldGVzIHRoZSBkaWFsb2cgb3BlbiBieSBjbGVhcmluZyBwb3RlbnRpYWwgYW5pbWF0aW9uIGNsYXNzZXMsIHRyYXBwaW5nXG4gICAqIGZvY3VzIGFuZCBlbWl0dGluZyBhbiBvcGVuZWQgZXZlbnQuXG4gICAqL1xuICBwcml2YXRlIF9maW5pc2hEaWFsb2dPcGVuID0gKCkgPT4ge1xuICAgIHRoaXMuX2NsZWFyQW5pbWF0aW9uQ2xhc3NlcygpO1xuICAgIHRoaXMuX29wZW5BbmltYXRpb25Eb25lKHRoaXMuX2VudGVyQW5pbWF0aW9uRHVyYXRpb24pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb21wbGV0ZXMgdGhlIGRpYWxvZyBjbG9zZSBieSBjbGVhcmluZyBwb3RlbnRpYWwgYW5pbWF0aW9uIGNsYXNzZXMsIHJlc3RvcmluZ1xuICAgKiBmb2N1cyBhbmQgZW1pdHRpbmcgYSBjbG9zZWQgZXZlbnQuXG4gICAqL1xuICBwcml2YXRlIF9maW5pc2hEaWFsb2dDbG9zZSA9ICgpID0+IHtcbiAgICB0aGlzLl9jbGVhckFuaW1hdGlvbkNsYXNzZXMoKTtcbiAgICB0aGlzLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQuZW1pdCh7c3RhdGU6ICdjbG9zZWQnLCB0b3RhbFRpbWU6IHRoaXMuX2V4aXRBbmltYXRpb25EdXJhdGlvbn0pO1xuICB9O1xuXG4gIC8qKiBDbGVhcnMgYWxsIGRpYWxvZyBhbmltYXRpb24gY2xhc3Nlcy4gKi9cbiAgcHJpdmF0ZSBfY2xlYXJBbmltYXRpb25DbGFzc2VzKCkge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoT1BFTklOR19DTEFTUywgQ0xPU0lOR19DTEFTUyk7XG4gIH1cblxuICBwcml2YXRlIF93YWl0Rm9yQW5pbWF0aW9uVG9Db21wbGV0ZShkdXJhdGlvbjogbnVtYmVyLCBjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgIGlmICh0aGlzLl9hbmltYXRpb25UaW1lciAhPT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2FuaW1hdGlvblRpbWVyKTtcbiAgICB9XG5cbiAgICAvLyBOb3RlIHRoYXQgd2Ugd2FudCB0aGlzIHRpbWVyIHRvIHJ1biBpbnNpZGUgdGhlIE5nWm9uZSwgYmVjYXVzZSB3ZSB3YW50XG4gICAgLy8gdGhlIHJlbGF0ZWQgZXZlbnRzIGxpa2UgYGFmdGVyQ2xvc2VkYCB0byBiZSBpbnNpZGUgdGhlIHpvbmUgYXMgd2VsbC5cbiAgICB0aGlzLl9hbmltYXRpb25UaW1lciA9IHNldFRpbWVvdXQoY2FsbGJhY2ssIGR1cmF0aW9uKTtcbiAgfVxuXG4gIC8qKiBSdW5zIGEgY2FsbGJhY2sgaW4gYHJlcXVlc3RBbmltYXRpb25GcmFtZWAsIGlmIGF2YWlsYWJsZS4gKi9cbiAgcHJpdmF0ZSBfcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9jYXB0dXJlSW5pdGlhbEZvY3VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fY29uZmlnLmRlbGF5Rm9jdXNUcmFwKSB7XG4gICAgICB0aGlzLl90cmFwRm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIHdoZW4gdGhlIG9wZW4gZGlhbG9nIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQuIEludGVuZGVkIHRvXG4gICAqIGJlIGNhbGxlZCBieSBzdWItY2xhc3NlcyB0aGF0IHVzZSBkaWZmZXJlbnQgYW5pbWF0aW9uIGltcGxlbWVudGF0aW9ucy5cbiAgICovXG4gIHByb3RlY3RlZCBfb3BlbkFuaW1hdGlvbkRvbmUodG90YWxUaW1lOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY29uZmlnLmRlbGF5Rm9jdXNUcmFwKSB7XG4gICAgICB0aGlzLl90cmFwRm9jdXMoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQubmV4dCh7c3RhdGU6ICdvcGVuZWQnLCB0b3RhbFRpbWV9KTtcbiAgfVxuXG4gIG92ZXJyaWRlIG5nT25EZXN0cm95KCkge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG5cbiAgICBpZiAodGhpcy5fYW5pbWF0aW9uVGltZXIgIT09IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9hbmltYXRpb25UaW1lcik7XG4gICAgfVxuXG4gICAgdGhpcy5faXNEZXN0cm95ZWQgPSB0cnVlO1xuICB9XG5cbiAgb3ZlcnJpZGUgYXR0YWNoQ29tcG9uZW50UG9ydGFsPFQ+KHBvcnRhbDogQ29tcG9uZW50UG9ydGFsPFQ+KTogQ29tcG9uZW50UmVmPFQ+IHtcbiAgICAvLyBXaGVuIGEgY29tcG9uZW50IGlzIHBhc3NlZCBpbnRvIHRoZSBkaWFsb2csIHRoZSBob3N0IGVsZW1lbnQgaW50ZXJydXB0c1xuICAgIC8vIHRoZSBgZGlzcGxheTpmbGV4YCBmcm9tIGFmZmVjdGluZyB0aGUgZGlhbG9nIHRpdGxlLCBjb250ZW50LCBhbmRcbiAgICAvLyBhY3Rpb25zLiBUbyBmaXggdGhpcywgd2UgbWFrZSB0aGUgY29tcG9uZW50IGhvc3QgYGRpc3BsYXk6IGNvbnRlbnRzYCBieVxuICAgIC8vIG1hcmtpbmcgaXRzIGhvc3Qgd2l0aCB0aGUgYG1hdC1tZGMtZGlhbG9nLWNvbXBvbmVudC1ob3N0YCBjbGFzcy5cbiAgICAvL1xuICAgIC8vIE5vdGUgdGhhdCB0aGlzIHByb2JsZW0gZG9lcyBub3QgZXhpc3Qgd2hlbiBhIHRlbXBsYXRlIHJlZiBpcyB1c2VkIHNpbmNlXG4gICAgLy8gdGhlIHRpdGxlLCBjb250ZW50cywgYW5kIGFjdGlvbnMgYXJlIHRoZW4gbmVzdGVkIGRpcmVjdGx5IHVuZGVyIHRoZVxuICAgIC8vIGRpYWxvZyBzdXJmYWNlLlxuICAgIGNvbnN0IHJlZiA9IHN1cGVyLmF0dGFjaENvbXBvbmVudFBvcnRhbChwb3J0YWwpO1xuICAgIHJlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1tZGMtZGlhbG9nLWNvbXBvbmVudC1ob3N0Jyk7XG4gICAgcmV0dXJuIHJlZjtcbiAgfVxufVxuXG5jb25zdCBUUkFOU0lUSU9OX0RVUkFUSU9OX1BST1BFUlRZID0gJy0tbWF0LWRpYWxvZy10cmFuc2l0aW9uLWR1cmF0aW9uJztcblxuLy8gVE9ETyhtbWFsZXJiYSk6IFJlbW92ZSB0aGlzIGZ1bmN0aW9uIGFmdGVyIGFuaW1hdGlvbiBkdXJhdGlvbnMgYXJlIHJlcXVpcmVkXG4vLyAgdG8gYmUgbnVtYmVycy5cbi8qKlxuICogQ29udmVydHMgYSBDU1MgdGltZSBzdHJpbmcgdG8gYSBudW1iZXIgaW4gbXMuIElmIHRoZSBnaXZlbiB0aW1lIGlzIGFscmVhZHkgYVxuICogbnVtYmVyLCBpdCBpcyBhc3N1bWVkIHRvIGJlIGluIG1zLlxuICovXG5mdW5jdGlvbiBwYXJzZUNzc1RpbWUodGltZTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkKTogbnVtYmVyIHwgbnVsbCB7XG4gIGlmICh0aW1lID09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAodHlwZW9mIHRpbWUgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHRpbWU7XG4gIH1cbiAgaWYgKHRpbWUuZW5kc1dpdGgoJ21zJykpIHtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkodGltZS5zdWJzdHJpbmcoMCwgdGltZS5sZW5ndGggLSAyKSk7XG4gIH1cbiAgaWYgKHRpbWUuZW5kc1dpdGgoJ3MnKSkge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aW1lLnN1YnN0cmluZygwLCB0aW1lLmxlbmd0aCAtIDEpKSAqIDEwMDA7XG4gIH1cbiAgaWYgKHRpbWUgPT09ICcwJykge1xuICAgIHJldHVybiAwO1xuICB9XG4gIHJldHVybiBudWxsOyAvLyBhbnl0aGluZyBlbHNlIGlzIGludmFsaWQuXG59XG4iLCI8ZGl2IGNsYXNzPVwibWF0LW1kYy1kaWFsb2ctaW5uZXItY29udGFpbmVyIG1kYy1kaWFsb2dfX2NvbnRhaW5lclwiPlxuICA8ZGl2IGNsYXNzPVwibWF0LW1kYy1kaWFsb2ctc3VyZmFjZSBtZGMtZGlhbG9nX19zdXJmYWNlXCI+XG4gICAgPG5nLXRlbXBsYXRlIGNka1BvcnRhbE91dGxldCAvPlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19