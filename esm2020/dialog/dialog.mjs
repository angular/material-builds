/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { Overlay, OverlayConfig, OverlayContainer, } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { Location } from '@angular/common';
import { Directive, Inject, Injectable, InjectFlags, InjectionToken, Injector, Optional, SkipSelf, TemplateRef, Type, } from '@angular/core';
import { defer, of as observableOf, Subject, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { MatDialogConfig } from './dialog-config';
import { MatDialogContainer } from './dialog-container';
import { MatDialogRef } from './dialog-ref';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/common";
import * as i3 from "./dialog-config";
/** Injection token that can be used to access the data that was passed in to a dialog. */
export const MAT_DIALOG_DATA = new InjectionToken('MatDialogData');
/** Injection token that can be used to specify default dialog options. */
export const MAT_DIALOG_DEFAULT_OPTIONS = new InjectionToken('mat-dialog-default-options');
/** Injection token that determines the scroll handling while the dialog is open. */
export const MAT_DIALOG_SCROLL_STRATEGY = new InjectionToken('mat-dialog-scroll-strategy');
/** @docs-private */
export function MAT_DIALOG_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.block();
}
/** @docs-private */
export function MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return () => overlay.scrollStrategies.block();
}
/** @docs-private */
export const MAT_DIALOG_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_DIALOG_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Base class for dialog services. The base dialog service allows
 * for arbitrary dialog refs and dialog container components.
 */
export class _MatDialogBase {
    constructor(_overlay, _injector, _defaultOptions, _parentDialog, _overlayContainer, scrollStrategy, _dialogRefConstructor, _dialogContainerType, _dialogDataToken, _animationMode) {
        this._overlay = _overlay;
        this._injector = _injector;
        this._defaultOptions = _defaultOptions;
        this._parentDialog = _parentDialog;
        this._overlayContainer = _overlayContainer;
        this._dialogRefConstructor = _dialogRefConstructor;
        this._dialogContainerType = _dialogContainerType;
        this._dialogDataToken = _dialogDataToken;
        this._animationMode = _animationMode;
        this._openDialogsAtThisLevel = [];
        this._afterAllClosedAtThisLevel = new Subject();
        this._afterOpenedAtThisLevel = new Subject();
        this._ariaHiddenElements = new Map();
        this._dialogAnimatingOpen = false;
        // TODO (jelbourn): tighten the typing right-hand side of this expression.
        /**
         * Stream that emits when all open dialog have finished closing.
         * Will emit on subscribe if there are no open dialogs to begin with.
         */
        this.afterAllClosed = defer(() => this.openDialogs.length ?
            this._getAfterAllClosed() :
            this._getAfterAllClosed().pipe(startWith(undefined)));
        this._scrollStrategy = scrollStrategy;
    }
    /** Keeps track of the currently-open dialogs. */
    get openDialogs() {
        return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
    }
    /** Stream that emits when a dialog has been opened. */
    get afterOpened() {
        return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
    }
    _getAfterAllClosed() {
        const parent = this._parentDialog;
        return parent ? parent._getAfterAllClosed() : this._afterAllClosedAtThisLevel;
    }
    open(componentOrTemplateRef, config) {
        config = _applyConfigDefaults(config, this._defaultOptions || new MatDialogConfig());
        if (config.id && this.getDialogById(config.id) &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error(`Dialog with id "${config.id}" exists already. The dialog id must be unique.`);
        }
        // If there is a dialog that is currently animating open, return the MatDialogRef of that dialog
        if (this._dialogAnimatingOpen) {
            return this._lastDialogRef;
        }
        const overlayRef = this._createOverlay(config);
        const dialogContainer = this._attachDialogContainer(overlayRef, config);
        if (this._animationMode !== 'NoopAnimations') {
            const animationStateSubscription = dialogContainer._animationStateChanged.subscribe((dialogAnimationEvent) => {
                if (dialogAnimationEvent.state === 'opening') {
                    this._dialogAnimatingOpen = true;
                }
                if (dialogAnimationEvent.state === 'opened') {
                    this._dialogAnimatingOpen = false;
                    animationStateSubscription.unsubscribe();
                }
            });
            if (!this._animationStateSubscriptions) {
                this._animationStateSubscriptions = new Subscription();
            }
            this._animationStateSubscriptions.add(animationStateSubscription);
        }
        const dialogRef = this._attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config);
        this._lastDialogRef = dialogRef;
        // If this is the first dialog that we're opening, hide all the non-overlay content.
        if (!this.openDialogs.length) {
            this._hideNonDialogContentFromAssistiveTechnology();
        }
        this.openDialogs.push(dialogRef);
        dialogRef.afterClosed().subscribe(() => this._removeOpenDialog(dialogRef));
        this.afterOpened.next(dialogRef);
        // Notify the dialog container that the content has been attached.
        dialogContainer._initializeWithAttachedContent();
        return dialogRef;
    }
    /**
     * Closes all of the currently-open dialogs.
     */
    closeAll() {
        this._closeDialogs(this.openDialogs);
    }
    /**
     * Finds an open dialog by its id.
     * @param id ID to use when looking up the dialog.
     */
    getDialogById(id) {
        return this.openDialogs.find(dialog => dialog.id === id);
    }
    ngOnDestroy() {
        // Only close the dialogs at this level on destroy
        // since the parent service may still be active.
        this._closeDialogs(this._openDialogsAtThisLevel);
        this._afterAllClosedAtThisLevel.complete();
        this._afterOpenedAtThisLevel.complete();
        // Clean up any subscriptions to dialogs that never finished opening.
        if (this._animationStateSubscriptions) {
            this._animationStateSubscriptions.unsubscribe();
        }
    }
    /**
     * Creates the overlay into which the dialog will be loaded.
     * @param config The dialog configuration.
     * @returns A promise resolving to the OverlayRef for the created overlay.
     */
    _createOverlay(config) {
        const overlayConfig = this._getOverlayConfig(config);
        return this._overlay.create(overlayConfig);
    }
    /**
     * Creates an overlay config from a dialog config.
     * @param dialogConfig The dialog configuration.
     * @returns The overlay configuration.
     */
    _getOverlayConfig(dialogConfig) {
        const state = new OverlayConfig({
            positionStrategy: this._overlay.position().global(),
            scrollStrategy: dialogConfig.scrollStrategy || this._scrollStrategy(),
            panelClass: dialogConfig.panelClass,
            hasBackdrop: dialogConfig.hasBackdrop,
            direction: dialogConfig.direction,
            minWidth: dialogConfig.minWidth,
            minHeight: dialogConfig.minHeight,
            maxWidth: dialogConfig.maxWidth,
            maxHeight: dialogConfig.maxHeight,
            disposeOnNavigation: dialogConfig.closeOnNavigation
        });
        if (dialogConfig.backdropClass) {
            state.backdropClass = dialogConfig.backdropClass;
        }
        return state;
    }
    /**
     * Attaches a dialog container to a dialog's already-created overlay.
     * @param overlay Reference to the dialog's underlying overlay.
     * @param config The dialog configuration.
     * @returns A promise resolving to a ComponentRef for the attached container.
     */
    _attachDialogContainer(overlay, config) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const injector = Injector.create({
            parent: userInjector || this._injector,
            providers: [{ provide: MatDialogConfig, useValue: config }]
        });
        const containerPortal = new ComponentPortal(this._dialogContainerType, config.viewContainerRef, injector, config.componentFactoryResolver);
        const containerRef = overlay.attach(containerPortal);
        return containerRef.instance;
    }
    /**
     * Attaches the user-provided component to the already-created dialog container.
     * @param componentOrTemplateRef The type of component being loaded into the dialog,
     *     or a TemplateRef to instantiate as the content.
     * @param dialogContainer Reference to the wrapping dialog container.
     * @param overlayRef Reference to the overlay in which the dialog resides.
     * @param config The dialog configuration.
     * @returns A promise resolving to the MatDialogRef that should be returned to the user.
     */
    _attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config) {
        // Create a reference to the dialog we're creating in order to give the user a handle
        // to modify and close it.
        const dialogRef = new this._dialogRefConstructor(overlayRef, dialogContainer, config.id);
        if (componentOrTemplateRef instanceof TemplateRef) {
            dialogContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, null, { $implicit: config.data, dialogRef }));
        }
        else {
            const injector = this._createInjector(config, dialogRef, dialogContainer);
            const contentRef = dialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector));
            dialogRef.componentInstance = contentRef.instance;
        }
        dialogRef
            .updateSize(config.width, config.height)
            .updatePosition(config.position);
        return dialogRef;
    }
    /**
     * Creates a custom injector to be used inside the dialog. This allows a component loaded inside
     * of a dialog to close itself and, optionally, to return a value.
     * @param config Config object that is used to construct the dialog.
     * @param dialogRef Reference to the dialog.
     * @param dialogContainer Dialog container element that wraps all of the contents.
     * @returns The custom injector that can be used inside the dialog.
     */
    _createInjector(config, dialogRef, dialogContainer) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        // The dialog container should be provided as the dialog container and the dialog's
        // content are created out of the same `ViewContainerRef` and as such, are siblings
        // for injector purposes. To allow the hierarchy that is expected, the dialog
        // container is explicitly provided in the injector.
        const providers = [
            { provide: this._dialogContainerType, useValue: dialogContainer },
            { provide: this._dialogDataToken, useValue: config.data },
            { provide: this._dialogRefConstructor, useValue: dialogRef }
        ];
        if (config.direction && (!userInjector ||
            !userInjector.get(Directionality, null, InjectFlags.Optional))) {
            providers.push({
                provide: Directionality,
                useValue: { value: config.direction, change: observableOf() }
            });
        }
        return Injector.create({ parent: userInjector || this._injector, providers });
    }
    /**
     * Removes a dialog from the array of open dialogs.
     * @param dialogRef Dialog to be removed.
     */
    _removeOpenDialog(dialogRef) {
        const index = this.openDialogs.indexOf(dialogRef);
        if (index > -1) {
            this.openDialogs.splice(index, 1);
            // If all the dialogs were closed, remove/restore the `aria-hidden`
            // to a the siblings and emit to the `afterAllClosed` stream.
            if (!this.openDialogs.length) {
                this._ariaHiddenElements.forEach((previousValue, element) => {
                    if (previousValue) {
                        element.setAttribute('aria-hidden', previousValue);
                    }
                    else {
                        element.removeAttribute('aria-hidden');
                    }
                });
                this._ariaHiddenElements.clear();
                this._getAfterAllClosed().next();
            }
        }
    }
    /**
     * Hides all of the content that isn't an overlay from assistive technology.
     */
    _hideNonDialogContentFromAssistiveTechnology() {
        const overlayContainer = this._overlayContainer.getContainerElement();
        // Ensure that the overlay container is attached to the DOM.
        if (overlayContainer.parentElement) {
            const siblings = overlayContainer.parentElement.children;
            for (let i = siblings.length - 1; i > -1; i--) {
                let sibling = siblings[i];
                if (sibling !== overlayContainer &&
                    sibling.nodeName !== 'SCRIPT' &&
                    sibling.nodeName !== 'STYLE' &&
                    !sibling.hasAttribute('aria-live')) {
                    this._ariaHiddenElements.set(sibling, sibling.getAttribute('aria-hidden'));
                    sibling.setAttribute('aria-hidden', 'true');
                }
            }
        }
    }
    /** Closes all of the dialogs in an array. */
    _closeDialogs(dialogs) {
        let i = dialogs.length;
        while (i--) {
            // The `_openDialogs` property isn't updated after close until the rxjs subscription
            // runs on the next microtask, in addition to modifying the array as we're going
            // through it. We loop through all of them and call close without assuming that
            // they'll be removed from the list instantaneously.
            dialogs[i].close();
        }
    }
}
_MatDialogBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatDialogBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive });
_MatDialogBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: _MatDialogBase, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatDialogBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.Injector }, { type: undefined }, { type: undefined }, { type: i1.OverlayContainer }, { type: undefined }, { type: i0.Type }, { type: i0.Type }, { type: i0.InjectionToken }, { type: undefined }]; } });
/**
 * Service to open Material Design modal dialogs.
 */
export class MatDialog extends _MatDialogBase {
    constructor(overlay, injector, 
    /**
     * @deprecated `_location` parameter to be removed.
     * @breaking-change 10.0.0
     */
    location, defaultOptions, scrollStrategy, parentDialog, overlayContainer, animationMode) {
        super(overlay, injector, defaultOptions, parentDialog, overlayContainer, scrollStrategy, MatDialogRef, MatDialogContainer, MAT_DIALOG_DATA, animationMode);
    }
}
MatDialog.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatDialog, deps: [{ token: i1.Overlay }, { token: i0.Injector }, { token: i2.Location, optional: true }, { token: MAT_DIALOG_DEFAULT_OPTIONS, optional: true }, { token: MAT_DIALOG_SCROLL_STRATEGY }, { token: MatDialog, optional: true, skipSelf: true }, { token: i1.OverlayContainer }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
MatDialog.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatDialog });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatDialog, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.Injector }, { type: i2.Location, decorators: [{
                    type: Optional
                }] }, { type: i3.MatDialogConfig, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DIALOG_DEFAULT_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_SCROLL_STRATEGY]
                }] }, { type: MatDialog, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i1.OverlayContainer }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; } });
/**
 * Applies default options to the dialog config.
 * @param config Config to be modified.
 * @param defaultOptions Default options provided.
 * @returns The new configuration object.
 */
function _applyConfigDefaults(config, defaultOptions) {
    return { ...defaultOptions, ...config };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RpYWxvZy9kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFDTCxPQUFPLEVBQ1AsYUFBYSxFQUNiLGdCQUFnQixHQUdqQixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxlQUFlLEVBQWlCLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25GLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsU0FBUyxFQUNULE1BQU0sRUFDTixVQUFVLEVBQ1YsV0FBVyxFQUNYLGNBQWMsRUFDZCxRQUFRLEVBRVIsUUFBUSxFQUNSLFFBQVEsRUFFUixXQUFXLEVBQ1gsSUFBSSxHQUNMLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxLQUFLLEVBQWMsRUFBRSxJQUFJLFlBQVksRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2xGLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDaEQsT0FBTyxFQUFDLGtCQUFrQixFQUEwQixNQUFNLG9CQUFvQixDQUFDO0FBQy9FLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDMUMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7Ozs7O0FBRzNFLDBGQUEwRjtBQUMxRixNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQU0sZUFBZSxDQUFDLENBQUM7QUFFeEUsMEVBQTBFO0FBQzFFLE1BQU0sQ0FBQyxNQUFNLDBCQUEwQixHQUNuQyxJQUFJLGNBQWMsQ0FBa0IsNEJBQTRCLENBQUMsQ0FBQztBQUV0RSxvRkFBb0Y7QUFDcEYsTUFBTSxDQUFDLE1BQU0sMEJBQTBCLEdBQ25DLElBQUksY0FBYyxDQUF1Qiw0QkFBNEIsQ0FBQyxDQUFDO0FBRTNFLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsa0NBQWtDLENBQUMsT0FBZ0I7SUFDakUsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDaEQsQ0FBQztBQUVELG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsMkNBQTJDLENBQUMsT0FBZ0I7SUFFMUUsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDaEQsQ0FBQztBQUVELG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSxtQ0FBbUMsR0FBRztJQUNqRCxPQUFPLEVBQUUsMEJBQTBCO0lBQ25DLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUNmLFVBQVUsRUFBRSwyQ0FBMkM7Q0FDeEQsQ0FBQztBQUVGOzs7R0FHRztBQUVILE1BQU0sT0FBZ0IsY0FBYztJQWtDbEMsWUFDWSxRQUFpQixFQUNqQixTQUFtQixFQUNuQixlQUEwQyxFQUMxQyxhQUEwQyxFQUMxQyxpQkFBbUMsRUFDM0MsY0FBbUIsRUFDWCxxQkFBOEMsRUFDOUMsb0JBQTZCLEVBQzdCLGdCQUFxQyxFQUNyQyxjQUF1RDtRQVR2RCxhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQ2pCLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFDbkIsb0JBQWUsR0FBZixlQUFlLENBQTJCO1FBQzFDLGtCQUFhLEdBQWIsYUFBYSxDQUE2QjtRQUMxQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBRW5DLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBeUI7UUFDOUMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFTO1FBQzdCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBcUI7UUFDckMsbUJBQWMsR0FBZCxjQUFjLENBQXlDO1FBM0MzRCw0QkFBdUIsR0FBd0IsRUFBRSxDQUFDO1FBQ3pDLCtCQUEwQixHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDakQsNEJBQXVCLEdBQUcsSUFBSSxPQUFPLEVBQXFCLENBQUM7UUFDcEUsd0JBQW1CLEdBQUcsSUFBSSxHQUFHLEVBQXdCLENBQUM7UUFFdEQseUJBQW9CLEdBQUcsS0FBSyxDQUFDO1FBbUJyQywwRUFBMEU7UUFDMUU7OztXQUdHO1FBQ00sbUJBQWMsR0FBcUIsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0UsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQW9CLENBQUM7UUFhM0UsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7SUFDeEMsQ0FBQztJQXBDRCxpREFBaUQ7SUFDakQsSUFBSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDO0lBQzVGLENBQUM7SUFFRCx1REFBdUQ7SUFDdkQsSUFBSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDO0lBQzVGLENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUNsQyxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQztJQUNoRixDQUFDO0lBOENELElBQUksQ0FBc0Isc0JBQXlELEVBQ3pELE1BQTJCO1FBQ25ELE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFFckYsSUFBSSxNQUFNLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUM1QyxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRTtZQUNqRCxNQUFNLEtBQUssQ0FBQyxtQkFBbUIsTUFBTSxDQUFDLEVBQUUsaURBQWlELENBQUMsQ0FBQztTQUM1RjtRQUVELGdHQUFnRztRQUNoRyxJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtZQUM3QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDNUI7UUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEUsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLGdCQUFnQixFQUFFO1lBQzVDLE1BQU0sMEJBQTBCLEdBQzlCLGVBQWUsQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFO2dCQUN4RSxJQUFJLG9CQUFvQixDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7b0JBQzVDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7aUJBQ2xDO2dCQUNELElBQUksb0JBQW9CLENBQUMsS0FBSyxLQUFLLFFBQVEsRUFBRTtvQkFDM0MsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztvQkFDbEMsMEJBQTBCLENBQUMsV0FBVyxFQUFFLENBQUM7aUJBQzFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFO2dCQUN0QyxJQUFJLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQzthQUN4RDtZQUNELElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztTQUNuRTtRQUVELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBTyxzQkFBc0IsRUFDdEIsZUFBZSxFQUNmLFVBQVUsRUFDVixNQUFNLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztRQUVoQyxvRkFBb0Y7UUFDcEYsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQzVCLElBQUksQ0FBQyw0Q0FBNEMsRUFBRSxDQUFDO1NBQ3JEO1FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVqQyxrRUFBa0U7UUFDbEUsZUFBZSxDQUFDLDhCQUE4QixFQUFFLENBQUM7UUFFakQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsUUFBUTtRQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxhQUFhLENBQUMsRUFBVTtRQUN0QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsV0FBVztRQUNULGtEQUFrRDtRQUNsRCxnREFBZ0Q7UUFDaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hDLHFFQUFxRTtRQUNyRSxJQUFJLElBQUksQ0FBQyw0QkFBNEIsRUFBRTtZQUNyQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDakQ7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLGNBQWMsQ0FBQyxNQUF1QjtRQUM1QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLGlCQUFpQixDQUFDLFlBQTZCO1FBQ3JELE1BQU0sS0FBSyxHQUFHLElBQUksYUFBYSxDQUFDO1lBQzlCLGdCQUFnQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFO1lBQ25ELGNBQWMsRUFBRSxZQUFZLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDckUsVUFBVSxFQUFFLFlBQVksQ0FBQyxVQUFVO1lBQ25DLFdBQVcsRUFBRSxZQUFZLENBQUMsV0FBVztZQUNyQyxTQUFTLEVBQUUsWUFBWSxDQUFDLFNBQVM7WUFDakMsUUFBUSxFQUFFLFlBQVksQ0FBQyxRQUFRO1lBQy9CLFNBQVMsRUFBRSxZQUFZLENBQUMsU0FBUztZQUNqQyxRQUFRLEVBQUUsWUFBWSxDQUFDLFFBQVE7WUFDL0IsU0FBUyxFQUFFLFlBQVksQ0FBQyxTQUFTO1lBQ2pDLG1CQUFtQixFQUFFLFlBQVksQ0FBQyxpQkFBaUI7U0FDcEQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxZQUFZLENBQUMsYUFBYSxFQUFFO1lBQzlCLEtBQUssQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQztTQUNsRDtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssc0JBQXNCLENBQUMsT0FBbUIsRUFBRSxNQUF1QjtRQUN6RSxNQUFNLFlBQVksR0FBRyxNQUFNLElBQUksTUFBTSxDQUFDLGdCQUFnQixJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7UUFDM0YsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUMvQixNQUFNLEVBQUUsWUFBWSxJQUFJLElBQUksQ0FBQyxTQUFTO1lBQ3RDLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFDLENBQUM7U0FDMUQsQ0FBQyxDQUFDO1FBRUgsTUFBTSxlQUFlLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUNqRSxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUksZUFBZSxDQUFDLENBQUM7UUFFeEQsT0FBTyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQy9CLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNLLG9CQUFvQixDQUN4QixzQkFBeUQsRUFDekQsZUFBa0IsRUFDbEIsVUFBc0IsRUFDdEIsTUFBdUI7UUFFekIscUZBQXFGO1FBQ3JGLDBCQUEwQjtRQUMxQixNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV6RixJQUFJLHNCQUFzQixZQUFZLFdBQVcsRUFBRTtZQUNqRCxlQUFlLENBQUMsb0JBQW9CLENBQ2xDLElBQUksY0FBYyxDQUFJLHNCQUFzQixFQUFFLElBQUssRUFDNUMsRUFBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEQ7YUFBTTtZQUNMLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUksTUFBTSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUM3RSxNQUFNLFVBQVUsR0FBRyxlQUFlLENBQUMscUJBQXFCLENBQ3BELElBQUksZUFBZSxDQUFDLHNCQUFzQixFQUFFLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDO1NBQ25EO1FBRUQsU0FBUzthQUNOLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDdkMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVuQyxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNLLGVBQWUsQ0FDbkIsTUFBdUIsRUFDdkIsU0FBMEIsRUFDMUIsZUFBa0I7UUFFcEIsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO1FBRTNGLG1GQUFtRjtRQUNuRixtRkFBbUY7UUFDbkYsNkVBQTZFO1FBQzdFLG9EQUFvRDtRQUNwRCxNQUFNLFNBQVMsR0FBcUI7WUFDbEMsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUM7WUFDL0QsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFDO1lBQ3ZELEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFDO1NBQzNELENBQUM7UUFFRixJQUFJLE1BQU0sQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLFlBQVk7WUFDbEMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUF3QixjQUFjLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO1lBQ3pGLFNBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2IsT0FBTyxFQUFFLGNBQWM7Z0JBQ3ZCLFFBQVEsRUFBRSxFQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBQzthQUM1RCxDQUFDLENBQUM7U0FDSjtRQUVELE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxZQUFZLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRDs7O09BR0c7SUFDSyxpQkFBaUIsQ0FBQyxTQUE0QjtRQUNwRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVsRCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNkLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUVsQyxtRUFBbUU7WUFDbkUsNkRBQTZEO1lBQzdELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtnQkFDNUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsRUFBRTtvQkFDMUQsSUFBSSxhQUFhLEVBQUU7d0JBQ2pCLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO3FCQUNwRDt5QkFBTTt3QkFDTCxPQUFPLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3FCQUN4QztnQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFFSCxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2xDO1NBQ0Y7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSyw0Q0FBNEM7UUFDbEQsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUV0RSw0REFBNEQ7UUFDNUQsSUFBSSxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUU7WUFDbEMsTUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztZQUV6RCxLQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDN0MsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUxQixJQUFJLE9BQU8sS0FBSyxnQkFBZ0I7b0JBQzlCLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUTtvQkFDN0IsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPO29CQUM1QixDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEVBQUU7b0JBRXBDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDM0UsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQzdDO2FBQ0Y7U0FDRjtJQUNILENBQUM7SUFFRCw2Q0FBNkM7SUFDckMsYUFBYSxDQUFDLE9BQTRCO1FBQ2hELElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFFdkIsT0FBTyxDQUFDLEVBQUUsRUFBRTtZQUNWLG9GQUFvRjtZQUNwRixnRkFBZ0Y7WUFDaEYsK0VBQStFO1lBQy9FLG9EQUFvRDtZQUNwRCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDcEI7SUFDSCxDQUFDOzttSEF0Vm1CLGNBQWM7dUdBQWQsY0FBYzttR0FBZCxjQUFjO2tCQURuQyxTQUFTOztBQTJWVjs7R0FFRztBQUVILE1BQU0sT0FBTyxTQUFVLFNBQVEsY0FBa0M7SUFDL0QsWUFDSSxPQUFnQixFQUFFLFFBQWtCO0lBQ3BDOzs7T0FHRztJQUNTLFFBQWtCLEVBQ2tCLGNBQStCLEVBQzNDLGNBQW1CLEVBQy9CLFlBQXVCLEVBQUUsZ0JBQWtDLEVBQ3hDLGFBQ3hCO1FBQ3JCLEtBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUNuRixZQUFZLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7OzhHQWZVLFNBQVMseUdBUUksMEJBQTBCLDZCQUN0QywwQkFBMEIsYUFDSSxTQUFTLDZFQUMzQixxQkFBcUI7a0hBWGxDLFNBQVM7bUdBQVQsU0FBUztrQkFEckIsVUFBVTs7MEJBUUosUUFBUTs7MEJBQ1IsUUFBUTs7MEJBQUksTUFBTTsyQkFBQywwQkFBMEI7OzBCQUM3QyxNQUFNOzJCQUFDLDBCQUEwQjs4QkFDSSxTQUFTOzBCQUE5QyxRQUFROzswQkFBSSxRQUFROzswQkFDcEIsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUI7O0FBTy9DOzs7OztHQUtHO0FBQ0gsU0FBUyxvQkFBb0IsQ0FDekIsTUFBd0IsRUFBRSxjQUFnQztJQUM1RCxPQUFPLEVBQUMsR0FBRyxjQUFjLEVBQUUsR0FBRyxNQUFNLEVBQUMsQ0FBQztBQUN4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlDb250YWluZXIsXG4gIE92ZXJsYXlSZWYsXG4gIFNjcm9sbFN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0NvbXBvbmVudFBvcnRhbCwgQ29tcG9uZW50VHlwZSwgVGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBJbmplY3RGbGFncyxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBTa2lwU2VsZixcbiAgU3RhdGljUHJvdmlkZXIsXG4gIFRlbXBsYXRlUmVmLFxuICBUeXBlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ZGVmZXIsIE9ic2VydmFibGUsIG9mIGFzIG9ic2VydmFibGVPZiwgU3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRofSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdERpYWxvZ0NvbmZpZ30gZnJvbSAnLi9kaWFsb2ctY29uZmlnJztcbmltcG9ydCB7TWF0RGlhbG9nQ29udGFpbmVyLCBfTWF0RGlhbG9nQ29udGFpbmVyQmFzZX0gZnJvbSAnLi9kaWFsb2ctY29udGFpbmVyJztcbmltcG9ydCB7TWF0RGlhbG9nUmVmfSBmcm9tICcuL2RpYWxvZy1yZWYnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgZGF0YSB0aGF0IHdhcyBwYXNzZWQgaW4gdG8gYSBkaWFsb2cuICovXG5leHBvcnQgY29uc3QgTUFUX0RJQUxPR19EQVRBID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ01hdERpYWxvZ0RhdGEnKTtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgZGVmYXVsdCBkaWFsb2cgb3B0aW9ucy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRElBTE9HX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdERpYWxvZ0NvbmZpZz4oJ21hdC1kaWFsb2ctZGVmYXVsdC1vcHRpb25zJyk7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIGRpYWxvZyBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KCdtYXQtZGlhbG9nLXNjcm9sbC1zdHJhdGVneScpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6XG4gICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBkaWFsb2cgc2VydmljZXMuIFRoZSBiYXNlIGRpYWxvZyBzZXJ2aWNlIGFsbG93c1xuICogZm9yIGFyYml0cmFyeSBkaWFsb2cgcmVmcyBhbmQgZGlhbG9nIGNvbnRhaW5lciBjb21wb25lbnRzLlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0RGlhbG9nQmFzZTxDIGV4dGVuZHMgX01hdERpYWxvZ0NvbnRhaW5lckJhc2U+IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfb3BlbkRpYWxvZ3NBdFRoaXNMZXZlbDogTWF0RGlhbG9nUmVmPGFueT5bXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IF9hZnRlckFsbENsb3NlZEF0VGhpc0xldmVsID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfYWZ0ZXJPcGVuZWRBdFRoaXNMZXZlbCA9IG5ldyBTdWJqZWN0PE1hdERpYWxvZ1JlZjxhbnk+PigpO1xuICBwcml2YXRlIF9hcmlhSGlkZGVuRWxlbWVudHMgPSBuZXcgTWFwPEVsZW1lbnQsIHN0cmluZ3xudWxsPigpO1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG4gIHByaXZhdGUgX2RpYWxvZ0FuaW1hdGluZ09wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfYW5pbWF0aW9uU3RhdGVTdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX2xhc3REaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxhbnk+O1xuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudGx5LW9wZW4gZGlhbG9ncy4gKi9cbiAgZ2V0IG9wZW5EaWFsb2dzKCk6IE1hdERpYWxvZ1JlZjxhbnk+W10ge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnREaWFsb2cgPyB0aGlzLl9wYXJlbnREaWFsb2cub3BlbkRpYWxvZ3MgOiB0aGlzLl9vcGVuRGlhbG9nc0F0VGhpc0xldmVsO1xuICB9XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYSBkaWFsb2cgaGFzIGJlZW4gb3BlbmVkLiAqL1xuICBnZXQgYWZ0ZXJPcGVuZWQoKTogU3ViamVjdDxNYXREaWFsb2dSZWY8YW55Pj4ge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnREaWFsb2cgPyB0aGlzLl9wYXJlbnREaWFsb2cuYWZ0ZXJPcGVuZWQgOiB0aGlzLl9hZnRlck9wZW5lZEF0VGhpc0xldmVsO1xuICB9XG5cbiAgX2dldEFmdGVyQWxsQ2xvc2VkKCk6IFN1YmplY3Q8dm9pZD4ge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX3BhcmVudERpYWxvZztcbiAgICByZXR1cm4gcGFyZW50ID8gcGFyZW50Ll9nZXRBZnRlckFsbENsb3NlZCgpIDogdGhpcy5fYWZ0ZXJBbGxDbG9zZWRBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIC8vIFRPRE8gKGplbGJvdXJuKTogdGlnaHRlbiB0aGUgdHlwaW5nIHJpZ2h0LWhhbmQgc2lkZSBvZiB0aGlzIGV4cHJlc3Npb24uXG4gIC8qKlxuICAgKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGFsbCBvcGVuIGRpYWxvZyBoYXZlIGZpbmlzaGVkIGNsb3NpbmcuXG4gICAqIFdpbGwgZW1pdCBvbiBzdWJzY3JpYmUgaWYgdGhlcmUgYXJlIG5vIG9wZW4gZGlhbG9ncyB0byBiZWdpbiB3aXRoLlxuICAgKi9cbiAgcmVhZG9ubHkgYWZ0ZXJBbGxDbG9zZWQ6IE9ic2VydmFibGU8dm9pZD4gPSBkZWZlcigoKSA9PiB0aGlzLm9wZW5EaWFsb2dzLmxlbmd0aCA/XG4gICAgICB0aGlzLl9nZXRBZnRlckFsbENsb3NlZCgpIDpcbiAgICAgIHRoaXMuX2dldEFmdGVyQWxsQ2xvc2VkKCkucGlwZShzdGFydFdpdGgodW5kZWZpbmVkKSkpIGFzIE9ic2VydmFibGU8YW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICBwcml2YXRlIF9kZWZhdWx0T3B0aW9uczogTWF0RGlhbG9nQ29uZmlnfHVuZGVmaW5lZCxcbiAgICAgIHByaXZhdGUgX3BhcmVudERpYWxvZzogX01hdERpYWxvZ0Jhc2U8Qz58dW5kZWZpbmVkLFxuICAgICAgcHJpdmF0ZSBfb3ZlcmxheUNvbnRhaW5lcjogT3ZlcmxheUNvbnRhaW5lcixcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiBhbnksXG4gICAgICBwcml2YXRlIF9kaWFsb2dSZWZDb25zdHJ1Y3RvcjogVHlwZTxNYXREaWFsb2dSZWY8YW55Pj4sXG4gICAgICBwcml2YXRlIF9kaWFsb2dDb250YWluZXJUeXBlOiBUeXBlPEM+LFxuICAgICAgcHJpdmF0ZSBfZGlhbG9nRGF0YVRva2VuOiBJbmplY3Rpb25Ub2tlbjxhbnk+LFxuICAgICAgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZT86ICdOb29wQW5pbWF0aW9ucycgfCAnQnJvd3NlckFuaW1hdGlvbnMnKSB7XG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyBhIG1vZGFsIGRpYWxvZyBjb250YWluaW5nIHRoZSBnaXZlbiBjb21wb25lbnQuXG4gICAqIEBwYXJhbSBjb21wb25lbnQgVHlwZSBvZiB0aGUgY29tcG9uZW50IHRvIGxvYWQgaW50byB0aGUgZGlhbG9nLlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQHJldHVybnMgUmVmZXJlbmNlIHRvIHRoZSBuZXdseS1vcGVuZWQgZGlhbG9nLlxuICAgKi9cbiAgb3BlbjxULCBEID0gYW55LCBSID0gYW55Pihjb21wb25lbnQ6IENvbXBvbmVudFR5cGU8VD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnPzogTWF0RGlhbG9nQ29uZmlnPEQ+KTogTWF0RGlhbG9nUmVmPFQsIFI+O1xuXG4gIC8qKlxuICAgKiBPcGVucyBhIG1vZGFsIGRpYWxvZyBjb250YWluaW5nIHRoZSBnaXZlbiB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHRlbXBsYXRlIFRlbXBsYXRlUmVmIHRvIGluc3RhbnRpYXRlIGFzIHRoZSBkaWFsb2cgY29udGVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEByZXR1cm5zIFJlZmVyZW5jZSB0byB0aGUgbmV3bHktb3BlbmVkIGRpYWxvZy5cbiAgICovXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4odGVtcGxhdGU6IFRlbXBsYXRlUmVmPFQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZz86IE1hdERpYWxvZ0NvbmZpZzxEPik6IE1hdERpYWxvZ1JlZjxULCBSPjtcblxuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KHRlbXBsYXRlOiBDb21wb25lbnRUeXBlPFQ+IHwgVGVtcGxhdGVSZWY8VD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnPzogTWF0RGlhbG9nQ29uZmlnPEQ+KTogTWF0RGlhbG9nUmVmPFQsIFI+O1xuXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZjogQ29tcG9uZW50VHlwZTxUPiB8IFRlbXBsYXRlUmVmPFQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZz86IE1hdERpYWxvZ0NvbmZpZzxEPik6IE1hdERpYWxvZ1JlZjxULCBSPiB7XG4gICAgY29uZmlnID0gX2FwcGx5Q29uZmlnRGVmYXVsdHMoY29uZmlnLCB0aGlzLl9kZWZhdWx0T3B0aW9ucyB8fCBuZXcgTWF0RGlhbG9nQ29uZmlnKCkpO1xuXG4gICAgaWYgKGNvbmZpZy5pZCAmJiB0aGlzLmdldERpYWxvZ0J5SWQoY29uZmlnLmlkKSAmJlxuICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IEVycm9yKGBEaWFsb2cgd2l0aCBpZCBcIiR7Y29uZmlnLmlkfVwiIGV4aXN0cyBhbHJlYWR5LiBUaGUgZGlhbG9nIGlkIG11c3QgYmUgdW5pcXVlLmApO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGlzIGEgZGlhbG9nIHRoYXQgaXMgY3VycmVudGx5IGFuaW1hdGluZyBvcGVuLCByZXR1cm4gdGhlIE1hdERpYWxvZ1JlZiBvZiB0aGF0IGRpYWxvZ1xuICAgIGlmICh0aGlzLl9kaWFsb2dBbmltYXRpbmdPcGVuKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbGFzdERpYWxvZ1JlZjtcbiAgICB9XG5cbiAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5fY3JlYXRlT3ZlcmxheShjb25maWcpO1xuICAgIGNvbnN0IGRpYWxvZ0NvbnRhaW5lciA9IHRoaXMuX2F0dGFjaERpYWxvZ0NvbnRhaW5lcihvdmVybGF5UmVmLCBjb25maWcpO1xuICAgIGlmICh0aGlzLl9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICBjb25zdCBhbmltYXRpb25TdGF0ZVN1YnNjcmlwdGlvbiA9XG4gICAgICAgIGRpYWxvZ0NvbnRhaW5lci5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLnN1YnNjcmliZSgoZGlhbG9nQW5pbWF0aW9uRXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZGlhbG9nQW5pbWF0aW9uRXZlbnQuc3RhdGUgPT09ICdvcGVuaW5nJykge1xuICAgICAgICAgICAgdGhpcy5fZGlhbG9nQW5pbWF0aW5nT3BlbiA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkaWFsb2dBbmltYXRpb25FdmVudC5zdGF0ZSA9PT0gJ29wZW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpYWxvZ0FuaW1hdGluZ09wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGFuaW1hdGlvblN0YXRlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIGlmICghdGhpcy5fYW5pbWF0aW9uU3RhdGVTdWJzY3JpcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlU3Vic2NyaXB0aW9ucyA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlU3Vic2NyaXB0aW9ucy5hZGQoYW5pbWF0aW9uU3RhdGVTdWJzY3JpcHRpb24pO1xuICAgIH1cblxuICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuX2F0dGFjaERpYWxvZ0NvbnRlbnQ8VCwgUj4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpYWxvZ0NvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJsYXlSZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcpO1xuICAgIHRoaXMuX2xhc3REaWFsb2dSZWYgPSBkaWFsb2dSZWY7XG5cbiAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCBkaWFsb2cgdGhhdCB3ZSdyZSBvcGVuaW5nLCBoaWRlIGFsbCB0aGUgbm9uLW92ZXJsYXkgY29udGVudC5cbiAgICBpZiAoIXRoaXMub3BlbkRpYWxvZ3MubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9oaWRlTm9uRGlhbG9nQ29udGVudEZyb21Bc3Npc3RpdmVUZWNobm9sb2d5KCk7XG4gICAgfVxuXG4gICAgdGhpcy5vcGVuRGlhbG9ncy5wdXNoKGRpYWxvZ1JlZik7XG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKCgpID0+IHRoaXMuX3JlbW92ZU9wZW5EaWFsb2coZGlhbG9nUmVmKSk7XG4gICAgdGhpcy5hZnRlck9wZW5lZC5uZXh0KGRpYWxvZ1JlZik7XG5cbiAgICAvLyBOb3RpZnkgdGhlIGRpYWxvZyBjb250YWluZXIgdGhhdCB0aGUgY29udGVudCBoYXMgYmVlbiBhdHRhY2hlZC5cbiAgICBkaWFsb2dDb250YWluZXIuX2luaXRpYWxpemVXaXRoQXR0YWNoZWRDb250ZW50KCk7XG5cbiAgICByZXR1cm4gZGlhbG9nUmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyBhbGwgb2YgdGhlIGN1cnJlbnRseS1vcGVuIGRpYWxvZ3MuXG4gICAqL1xuICBjbG9zZUFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jbG9zZURpYWxvZ3ModGhpcy5vcGVuRGlhbG9ncyk7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgYW4gb3BlbiBkaWFsb2cgYnkgaXRzIGlkLlxuICAgKiBAcGFyYW0gaWQgSUQgdG8gdXNlIHdoZW4gbG9va2luZyB1cCB0aGUgZGlhbG9nLlxuICAgKi9cbiAgZ2V0RGlhbG9nQnlJZChpZDogc3RyaW5nKTogTWF0RGlhbG9nUmVmPGFueT4gfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLm9wZW5EaWFsb2dzLmZpbmQoZGlhbG9nID0+IGRpYWxvZy5pZCA9PT0gaWQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy8gT25seSBjbG9zZSB0aGUgZGlhbG9ncyBhdCB0aGlzIGxldmVsIG9uIGRlc3Ryb3lcbiAgICAvLyBzaW5jZSB0aGUgcGFyZW50IHNlcnZpY2UgbWF5IHN0aWxsIGJlIGFjdGl2ZS5cbiAgICB0aGlzLl9jbG9zZURpYWxvZ3ModGhpcy5fb3BlbkRpYWxvZ3NBdFRoaXNMZXZlbCk7XG4gICAgdGhpcy5fYWZ0ZXJBbGxDbG9zZWRBdFRoaXNMZXZlbC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2FmdGVyT3BlbmVkQXRUaGlzTGV2ZWwuY29tcGxldGUoKTtcbiAgICAvLyBDbGVhbiB1cCBhbnkgc3Vic2NyaXB0aW9ucyB0byBkaWFsb2dzIHRoYXQgbmV2ZXIgZmluaXNoZWQgb3BlbmluZy5cbiAgICBpZiAodGhpcy5fYW5pbWF0aW9uU3RhdGVTdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZVN1YnNjcmlwdGlvbnMudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgb3ZlcmxheSBpbnRvIHdoaWNoIHRoZSBkaWFsb2cgd2lsbCBiZSBsb2FkZWQuXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIGRpYWxvZyBjb25maWd1cmF0aW9uLlxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgcmVzb2x2aW5nIHRvIHRoZSBPdmVybGF5UmVmIGZvciB0aGUgY3JlYXRlZCBvdmVybGF5LlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlT3ZlcmxheShjb25maWc6IE1hdERpYWxvZ0NvbmZpZyk6IE92ZXJsYXlSZWYge1xuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSB0aGlzLl9nZXRPdmVybGF5Q29uZmlnKGNvbmZpZyk7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXkuY3JlYXRlKG92ZXJsYXlDb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gb3ZlcmxheSBjb25maWcgZnJvbSBhIGRpYWxvZyBjb25maWcuXG4gICAqIEBwYXJhbSBkaWFsb2dDb25maWcgVGhlIGRpYWxvZyBjb25maWd1cmF0aW9uLlxuICAgKiBAcmV0dXJucyBUaGUgb3ZlcmxheSBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0T3ZlcmxheUNvbmZpZyhkaWFsb2dDb25maWc6IE1hdERpYWxvZ0NvbmZpZyk6IE92ZXJsYXlDb25maWcge1xuICAgIGNvbnN0IHN0YXRlID0gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpLmdsb2JhbCgpLFxuICAgICAgc2Nyb2xsU3RyYXRlZ3k6IGRpYWxvZ0NvbmZpZy5zY3JvbGxTdHJhdGVneSB8fCB0aGlzLl9zY3JvbGxTdHJhdGVneSgpLFxuICAgICAgcGFuZWxDbGFzczogZGlhbG9nQ29uZmlnLnBhbmVsQ2xhc3MsXG4gICAgICBoYXNCYWNrZHJvcDogZGlhbG9nQ29uZmlnLmhhc0JhY2tkcm9wLFxuICAgICAgZGlyZWN0aW9uOiBkaWFsb2dDb25maWcuZGlyZWN0aW9uLFxuICAgICAgbWluV2lkdGg6IGRpYWxvZ0NvbmZpZy5taW5XaWR0aCxcbiAgICAgIG1pbkhlaWdodDogZGlhbG9nQ29uZmlnLm1pbkhlaWdodCxcbiAgICAgIG1heFdpZHRoOiBkaWFsb2dDb25maWcubWF4V2lkdGgsXG4gICAgICBtYXhIZWlnaHQ6IGRpYWxvZ0NvbmZpZy5tYXhIZWlnaHQsXG4gICAgICBkaXNwb3NlT25OYXZpZ2F0aW9uOiBkaWFsb2dDb25maWcuY2xvc2VPbk5hdmlnYXRpb25cbiAgICB9KTtcblxuICAgIGlmIChkaWFsb2dDb25maWcuYmFja2Ryb3BDbGFzcykge1xuICAgICAgc3RhdGUuYmFja2Ryb3BDbGFzcyA9IGRpYWxvZ0NvbmZpZy5iYWNrZHJvcENsYXNzO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhIGRpYWxvZyBjb250YWluZXIgdG8gYSBkaWFsb2cncyBhbHJlYWR5LWNyZWF0ZWQgb3ZlcmxheS5cbiAgICogQHBhcmFtIG92ZXJsYXkgUmVmZXJlbmNlIHRvIHRoZSBkaWFsb2cncyB1bmRlcmx5aW5nIG92ZXJsYXkuXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIGRpYWxvZyBjb25maWd1cmF0aW9uLlxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgcmVzb2x2aW5nIHRvIGEgQ29tcG9uZW50UmVmIGZvciB0aGUgYXR0YWNoZWQgY29udGFpbmVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfYXR0YWNoRGlhbG9nQ29udGFpbmVyKG92ZXJsYXk6IE92ZXJsYXlSZWYsIGNvbmZpZzogTWF0RGlhbG9nQ29uZmlnKTogQyB7XG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuICAgIGNvbnN0IGluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHBhcmVudDogdXNlckluamVjdG9yIHx8IHRoaXMuX2luamVjdG9yLFxuICAgICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1hdERpYWxvZ0NvbmZpZywgdXNlVmFsdWU6IGNvbmZpZ31dXG4gICAgfSk7XG5cbiAgICBjb25zdCBjb250YWluZXJQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKHRoaXMuX2RpYWxvZ0NvbnRhaW5lclR5cGUsXG4gICAgICAgIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLCBpbmplY3RvciwgY29uZmlnLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcik7XG4gICAgY29uc3QgY29udGFpbmVyUmVmID0gb3ZlcmxheS5hdHRhY2g8Qz4oY29udGFpbmVyUG9ydGFsKTtcblxuICAgIHJldHVybiBjb250YWluZXJSZWYuaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhlIHVzZXItcHJvdmlkZWQgY29tcG9uZW50IHRvIHRoZSBhbHJlYWR5LWNyZWF0ZWQgZGlhbG9nIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIGNvbXBvbmVudE9yVGVtcGxhdGVSZWYgVGhlIHR5cGUgb2YgY29tcG9uZW50IGJlaW5nIGxvYWRlZCBpbnRvIHRoZSBkaWFsb2csXG4gICAqICAgICBvciBhIFRlbXBsYXRlUmVmIHRvIGluc3RhbnRpYXRlIGFzIHRoZSBjb250ZW50LlxuICAgKiBAcGFyYW0gZGlhbG9nQ29udGFpbmVyIFJlZmVyZW5jZSB0byB0aGUgd3JhcHBpbmcgZGlhbG9nIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIG92ZXJsYXlSZWYgUmVmZXJlbmNlIHRvIHRoZSBvdmVybGF5IGluIHdoaWNoIHRoZSBkaWFsb2cgcmVzaWRlcy5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24uXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSByZXNvbHZpbmcgdG8gdGhlIE1hdERpYWxvZ1JlZiB0aGF0IHNob3VsZCBiZSByZXR1cm5lZCB0byB0aGUgdXNlci5cbiAgICovXG4gIHByaXZhdGUgX2F0dGFjaERpYWxvZ0NvbnRlbnQ8VCwgUj4oXG4gICAgICBjb21wb25lbnRPclRlbXBsYXRlUmVmOiBDb21wb25lbnRUeXBlPFQ+IHwgVGVtcGxhdGVSZWY8VD4sXG4gICAgICBkaWFsb2dDb250YWluZXI6IEMsXG4gICAgICBvdmVybGF5UmVmOiBPdmVybGF5UmVmLFxuICAgICAgY29uZmlnOiBNYXREaWFsb2dDb25maWcpOiBNYXREaWFsb2dSZWY8VCwgUj4ge1xuXG4gICAgLy8gQ3JlYXRlIGEgcmVmZXJlbmNlIHRvIHRoZSBkaWFsb2cgd2UncmUgY3JlYXRpbmcgaW4gb3JkZXIgdG8gZ2l2ZSB0aGUgdXNlciBhIGhhbmRsZVxuICAgIC8vIHRvIG1vZGlmeSBhbmQgY2xvc2UgaXQuXG4gICAgY29uc3QgZGlhbG9nUmVmID0gbmV3IHRoaXMuX2RpYWxvZ1JlZkNvbnN0cnVjdG9yKG92ZXJsYXlSZWYsIGRpYWxvZ0NvbnRhaW5lciwgY29uZmlnLmlkKTtcblxuICAgIGlmIChjb21wb25lbnRPclRlbXBsYXRlUmVmIGluc3RhbmNlb2YgVGVtcGxhdGVSZWYpIHtcbiAgICAgIGRpYWxvZ0NvbnRhaW5lci5hdHRhY2hUZW1wbGF0ZVBvcnRhbChcbiAgICAgICAgbmV3IFRlbXBsYXRlUG9ydGFsPFQ+KGNvbXBvbmVudE9yVGVtcGxhdGVSZWYsIG51bGwhLFxuICAgICAgICAgIDxhbnk+eyRpbXBsaWNpdDogY29uZmlnLmRhdGEsIGRpYWxvZ1JlZn0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5qZWN0b3IgPSB0aGlzLl9jcmVhdGVJbmplY3RvcjxUPihjb25maWcsIGRpYWxvZ1JlZiwgZGlhbG9nQ29udGFpbmVyKTtcbiAgICAgIGNvbnN0IGNvbnRlbnRSZWYgPSBkaWFsb2dDb250YWluZXIuYXR0YWNoQ29tcG9uZW50UG9ydGFsPFQ+KFxuICAgICAgICAgIG5ldyBDb21wb25lbnRQb3J0YWwoY29tcG9uZW50T3JUZW1wbGF0ZVJlZiwgY29uZmlnLnZpZXdDb250YWluZXJSZWYsIGluamVjdG9yKSk7XG4gICAgICBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UgPSBjb250ZW50UmVmLmluc3RhbmNlO1xuICAgIH1cblxuICAgIGRpYWxvZ1JlZlxuICAgICAgLnVwZGF0ZVNpemUoY29uZmlnLndpZHRoLCBjb25maWcuaGVpZ2h0KVxuICAgICAgLnVwZGF0ZVBvc2l0aW9uKGNvbmZpZy5wb3NpdGlvbik7XG5cbiAgICByZXR1cm4gZGlhbG9nUmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjdXN0b20gaW5qZWN0b3IgdG8gYmUgdXNlZCBpbnNpZGUgdGhlIGRpYWxvZy4gVGhpcyBhbGxvd3MgYSBjb21wb25lbnQgbG9hZGVkIGluc2lkZVxuICAgKiBvZiBhIGRpYWxvZyB0byBjbG9zZSBpdHNlbGYgYW5kLCBvcHRpb25hbGx5LCB0byByZXR1cm4gYSB2YWx1ZS5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgb2JqZWN0IHRoYXQgaXMgdXNlZCB0byBjb25zdHJ1Y3QgdGhlIGRpYWxvZy5cbiAgICogQHBhcmFtIGRpYWxvZ1JlZiBSZWZlcmVuY2UgdG8gdGhlIGRpYWxvZy5cbiAgICogQHBhcmFtIGRpYWxvZ0NvbnRhaW5lciBEaWFsb2cgY29udGFpbmVyIGVsZW1lbnQgdGhhdCB3cmFwcyBhbGwgb2YgdGhlIGNvbnRlbnRzLlxuICAgKiBAcmV0dXJucyBUaGUgY3VzdG9tIGluamVjdG9yIHRoYXQgY2FuIGJlIHVzZWQgaW5zaWRlIHRoZSBkaWFsb2cuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVJbmplY3RvcjxUPihcbiAgICAgIGNvbmZpZzogTWF0RGlhbG9nQ29uZmlnLFxuICAgICAgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8VD4sXG4gICAgICBkaWFsb2dDb250YWluZXI6IEMpOiBJbmplY3RvciB7XG5cbiAgICBjb25zdCB1c2VySW5qZWN0b3IgPSBjb25maWcgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYuaW5qZWN0b3I7XG5cbiAgICAvLyBUaGUgZGlhbG9nIGNvbnRhaW5lciBzaG91bGQgYmUgcHJvdmlkZWQgYXMgdGhlIGRpYWxvZyBjb250YWluZXIgYW5kIHRoZSBkaWFsb2cnc1xuICAgIC8vIGNvbnRlbnQgYXJlIGNyZWF0ZWQgb3V0IG9mIHRoZSBzYW1lIGBWaWV3Q29udGFpbmVyUmVmYCBhbmQgYXMgc3VjaCwgYXJlIHNpYmxpbmdzXG4gICAgLy8gZm9yIGluamVjdG9yIHB1cnBvc2VzLiBUbyBhbGxvdyB0aGUgaGllcmFyY2h5IHRoYXQgaXMgZXhwZWN0ZWQsIHRoZSBkaWFsb2dcbiAgICAvLyBjb250YWluZXIgaXMgZXhwbGljaXRseSBwcm92aWRlZCBpbiB0aGUgaW5qZWN0b3IuXG4gICAgY29uc3QgcHJvdmlkZXJzOiBTdGF0aWNQcm92aWRlcltdID0gW1xuICAgICAge3Byb3ZpZGU6IHRoaXMuX2RpYWxvZ0NvbnRhaW5lclR5cGUsIHVzZVZhbHVlOiBkaWFsb2dDb250YWluZXJ9LFxuICAgICAge3Byb3ZpZGU6IHRoaXMuX2RpYWxvZ0RhdGFUb2tlbiwgdXNlVmFsdWU6IGNvbmZpZy5kYXRhfSxcbiAgICAgIHtwcm92aWRlOiB0aGlzLl9kaWFsb2dSZWZDb25zdHJ1Y3RvciwgdXNlVmFsdWU6IGRpYWxvZ1JlZn1cbiAgICBdO1xuXG4gICAgaWYgKGNvbmZpZy5kaXJlY3Rpb24gJiYgKCF1c2VySW5qZWN0b3IgfHxcbiAgICAgICAgIXVzZXJJbmplY3Rvci5nZXQ8RGlyZWN0aW9uYWxpdHkgfCBudWxsPihEaXJlY3Rpb25hbGl0eSwgbnVsbCwgSW5qZWN0RmxhZ3MuT3B0aW9uYWwpKSkge1xuICAgICAgcHJvdmlkZXJzLnB1c2goe1xuICAgICAgICBwcm92aWRlOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgdXNlVmFsdWU6IHt2YWx1ZTogY29uZmlnLmRpcmVjdGlvbiwgY2hhbmdlOiBvYnNlcnZhYmxlT2YoKX1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBJbmplY3Rvci5jcmVhdGUoe3BhcmVudDogdXNlckluamVjdG9yIHx8IHRoaXMuX2luamVjdG9yLCBwcm92aWRlcnN9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgZGlhbG9nIGZyb20gdGhlIGFycmF5IG9mIG9wZW4gZGlhbG9ncy5cbiAgICogQHBhcmFtIGRpYWxvZ1JlZiBEaWFsb2cgdG8gYmUgcmVtb3ZlZC5cbiAgICovXG4gIHByaXZhdGUgX3JlbW92ZU9wZW5EaWFsb2coZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8YW55Pikge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5vcGVuRGlhbG9ncy5pbmRleE9mKGRpYWxvZ1JlZik7XG5cbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgdGhpcy5vcGVuRGlhbG9ncy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAvLyBJZiBhbGwgdGhlIGRpYWxvZ3Mgd2VyZSBjbG9zZWQsIHJlbW92ZS9yZXN0b3JlIHRoZSBgYXJpYS1oaWRkZW5gXG4gICAgICAvLyB0byBhIHRoZSBzaWJsaW5ncyBhbmQgZW1pdCB0byB0aGUgYGFmdGVyQWxsQ2xvc2VkYCBzdHJlYW0uXG4gICAgICBpZiAoIXRoaXMub3BlbkRpYWxvZ3MubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX2FyaWFIaWRkZW5FbGVtZW50cy5mb3JFYWNoKChwcmV2aW91c1ZhbHVlLCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgaWYgKHByZXZpb3VzVmFsdWUpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHByZXZpb3VzVmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2FyaWFIaWRkZW5FbGVtZW50cy5jbGVhcigpO1xuICAgICAgICB0aGlzLl9nZXRBZnRlckFsbENsb3NlZCgpLm5leHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGlkZXMgYWxsIG9mIHRoZSBjb250ZW50IHRoYXQgaXNuJ3QgYW4gb3ZlcmxheSBmcm9tIGFzc2lzdGl2ZSB0ZWNobm9sb2d5LlxuICAgKi9cbiAgcHJpdmF0ZSBfaGlkZU5vbkRpYWxvZ0NvbnRlbnRGcm9tQXNzaXN0aXZlVGVjaG5vbG9neSgpIHtcbiAgICBjb25zdCBvdmVybGF5Q29udGFpbmVyID0gdGhpcy5fb3ZlcmxheUNvbnRhaW5lci5nZXRDb250YWluZXJFbGVtZW50KCk7XG5cbiAgICAvLyBFbnN1cmUgdGhhdCB0aGUgb3ZlcmxheSBjb250YWluZXIgaXMgYXR0YWNoZWQgdG8gdGhlIERPTS5cbiAgICBpZiAob3ZlcmxheUNvbnRhaW5lci5wYXJlbnRFbGVtZW50KSB7XG4gICAgICBjb25zdCBzaWJsaW5ncyA9IG92ZXJsYXlDb250YWluZXIucGFyZW50RWxlbWVudC5jaGlsZHJlbjtcblxuICAgICAgZm9yIChsZXQgaSA9IHNpYmxpbmdzLmxlbmd0aCAtIDE7IGkgPiAtMTsgaS0tKSB7XG4gICAgICAgIGxldCBzaWJsaW5nID0gc2libGluZ3NbaV07XG5cbiAgICAgICAgaWYgKHNpYmxpbmcgIT09IG92ZXJsYXlDb250YWluZXIgJiZcbiAgICAgICAgICBzaWJsaW5nLm5vZGVOYW1lICE9PSAnU0NSSVBUJyAmJlxuICAgICAgICAgIHNpYmxpbmcubm9kZU5hbWUgIT09ICdTVFlMRScgJiZcbiAgICAgICAgICAhc2libGluZy5oYXNBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScpKSB7XG5cbiAgICAgICAgICB0aGlzLl9hcmlhSGlkZGVuRWxlbWVudHMuc2V0KHNpYmxpbmcsIHNpYmxpbmcuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpKTtcbiAgICAgICAgICBzaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlcyBhbGwgb2YgdGhlIGRpYWxvZ3MgaW4gYW4gYXJyYXkuICovXG4gIHByaXZhdGUgX2Nsb3NlRGlhbG9ncyhkaWFsb2dzOiBNYXREaWFsb2dSZWY8YW55PltdKSB7XG4gICAgbGV0IGkgPSBkaWFsb2dzLmxlbmd0aDtcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIC8vIFRoZSBgX29wZW5EaWFsb2dzYCBwcm9wZXJ0eSBpc24ndCB1cGRhdGVkIGFmdGVyIGNsb3NlIHVudGlsIHRoZSByeGpzIHN1YnNjcmlwdGlvblxuICAgICAgLy8gcnVucyBvbiB0aGUgbmV4dCBtaWNyb3Rhc2ssIGluIGFkZGl0aW9uIHRvIG1vZGlmeWluZyB0aGUgYXJyYXkgYXMgd2UncmUgZ29pbmdcbiAgICAgIC8vIHRocm91Z2ggaXQuIFdlIGxvb3AgdGhyb3VnaCBhbGwgb2YgdGhlbSBhbmQgY2FsbCBjbG9zZSB3aXRob3V0IGFzc3VtaW5nIHRoYXRcbiAgICAgIC8vIHRoZXknbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBsaXN0IGluc3RhbnRhbmVvdXNseS5cbiAgICAgIGRpYWxvZ3NbaV0uY2xvc2UoKTtcbiAgICB9XG4gIH1cblxufVxuXG4vKipcbiAqIFNlcnZpY2UgdG8gb3BlbiBNYXRlcmlhbCBEZXNpZ24gbW9kYWwgZGlhbG9ncy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZyBleHRlbmRzIF9NYXREaWFsb2dCYXNlPE1hdERpYWxvZ0NvbnRhaW5lcj4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIG92ZXJsYXk6IE92ZXJsYXksIGluamVjdG9yOiBJbmplY3RvcixcbiAgICAgIC8qKlxuICAgICAgICogQGRlcHJlY2F0ZWQgYF9sb2NhdGlvbmAgcGFyYW1ldGVyIHRvIGJlIHJlbW92ZWQuXG4gICAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgICAgICovXG4gICAgICBAT3B0aW9uYWwoKSBsb2NhdGlvbjogTG9jYXRpb24sXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9ESUFMT0dfREVGQVVMVF9PUFRJT05TKSBkZWZhdWx0T3B0aW9uczogTWF0RGlhbG9nQ29uZmlnLFxuICAgICAgQEluamVjdChNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICAgIEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIHBhcmVudERpYWxvZzogTWF0RGlhbG9nLCBvdmVybGF5Q29udGFpbmVyOiBPdmVybGF5Q29udGFpbmVyLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiAnTm9vcEFuaW1hdGlvbnMnfFxuICAgICAgJ0Jyb3dzZXJBbmltYXRpb25zJykge1xuICAgIHN1cGVyKG92ZXJsYXksIGluamVjdG9yLCBkZWZhdWx0T3B0aW9ucywgcGFyZW50RGlhbG9nLCBvdmVybGF5Q29udGFpbmVyLCBzY3JvbGxTdHJhdGVneSxcbiAgICAgICAgTWF0RGlhbG9nUmVmLCBNYXREaWFsb2dDb250YWluZXIsIE1BVF9ESUFMT0dfREFUQSwgYW5pbWF0aW9uTW9kZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBcHBsaWVzIGRlZmF1bHQgb3B0aW9ucyB0byB0aGUgZGlhbG9nIGNvbmZpZy5cbiAqIEBwYXJhbSBjb25maWcgQ29uZmlnIHRvIGJlIG1vZGlmaWVkLlxuICogQHBhcmFtIGRlZmF1bHRPcHRpb25zIERlZmF1bHQgb3B0aW9ucyBwcm92aWRlZC5cbiAqIEByZXR1cm5zIFRoZSBuZXcgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIF9hcHBseUNvbmZpZ0RlZmF1bHRzKFxuICAgIGNvbmZpZz86IE1hdERpYWxvZ0NvbmZpZywgZGVmYXVsdE9wdGlvbnM/OiBNYXREaWFsb2dDb25maWcpOiBNYXREaWFsb2dDb25maWcge1xuICByZXR1cm4gey4uLmRlZmF1bHRPcHRpb25zLCAuLi5jb25maWd9O1xufVxuIl19