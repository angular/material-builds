/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, TemplateRef } from '@angular/core';
import '@angular/common';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { BasePortalOutlet, ComponentPortal, PortalInjector, TemplatePortal } from '@angular/cdk/portal';
import '@angular/cdk/a11y';
import { extendObject } from '@angular/material/core';
import { ESCAPE } from '@angular/cdk/keycodes';
import { filter } from 'rxjs/operators/filter';
import 'rxjs/operators/startWith';
import { Directionality } from '@angular/cdk/bidi';
import 'rxjs/observable/defer';
import 'rxjs/Subject';
import '@angular/animations';
import '@angular/platform-browser';
import { first } from 'rxjs/operators/first';
import { of } from 'rxjs/observable/of';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Possible overrides for a dialog's position.
 * @record
 */

/**
 * Configuration for opening a modal dialog with the MatDialog service.
 */
class MatDialogConfig {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalOutlet without an origin.
 * \@docs-private
 * @return {?}
 */
function throwMatDialogContentAlreadyAttachedError() {
    throw Error('Attempting to attach dialog content after content is already attached');
}
/**
 * Internal component that wraps user-provided dialog content.
 * Animation is based on https://material.io/guidelines/motion/choreography.html.
 * \@docs-private
 */
class MatDialogContainer extends BasePortalOutlet {
    /**
     * @param {?} _elementRef
     * @param {?} _focusTrapFactory
     * @param {?} _changeDetectorRef
     * @param {?} _document
     */
    constructor(_elementRef, _focusTrapFactory, _changeDetectorRef, _document) {
        super();
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._changeDetectorRef = _changeDetectorRef;
        this._document = _document;
    }
    /**
     * Attach a ComponentPortal as content to this dialog container.
     * @template T
     * @param {?} portal Portal to be attached as the dialog content.
     * @return {?}
     */
    attachComponentPortal(portal) {
        if (this._portalOutlet.hasAttached()) {
            throwMatDialogContentAlreadyAttachedError();
        }
        this._savePreviouslyFocusedElement();
        return this._portalOutlet.attachComponentPortal(portal);
    }
    /**
     * Attach a TemplatePortal as content to this dialog container.
     * @template C
     * @param {?} portal Portal to be attached as the dialog content.
     * @return {?}
     */
    attachTemplatePortal(portal) {
        if (this._portalOutlet.hasAttached()) {
            throwMatDialogContentAlreadyAttachedError();
        }
        this._savePreviouslyFocusedElement();
        return this._portalOutlet.attachTemplatePortal(portal);
    }
    /**
     * Moves the focus inside the focus trap.
     * @return {?}
     */
    _trapFocus() {
        if (!this._focusTrap) {
            this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        }
        // If were to attempt to focus immediately, then the content of the dialog would not yet be
        // ready in instances where change detection has to run first. To deal with this, we simply
        // wait for the microtask queue to be empty.
        this._focusTrap.focusInitialElementWhenReady();
    }
    /**
     * Restores focus to the element that was focused before the dialog opened.
     * @return {?}
     */
    _restoreFocus() {
        const /** @type {?} */ toFocus = this._elementFocusedBeforeDialogWasOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (toFocus && typeof toFocus.focus === 'function') {
            toFocus.focus();
        }
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    }
    /**
     * Saves a reference to the element that was focused before the dialog was opened.
     * @return {?}
     */
    _savePreviouslyFocusedElement() {
        if (this._document) {
            this._elementFocusedBeforeDialogWasOpened = /** @type {?} */ (this._document.activeElement);
            // Move focus onto the dialog immediately in order to prevent the user from accidentally
            // opening multiple dialogs at the same time. Needs to be async, because the element
            // may not be focusable immediately.
            Promise.resolve().then(() => this._elementRef.nativeElement.focus());
        }
    }
    /**
     * Callback, invoked whenever an animation on the host completes.
     * @param {?} event
     * @return {?}
     */
    _onAnimationDone(event) {
        if (event.toState === 'enter') {
            this._trapFocus();
        }
        else if (event.toState === 'exit') {
            this._restoreFocus();
        }
        this._animationStateChanged.emit(event);
    }
    /**
     * Callback, invoked when an animation on the host starts.
     * @param {?} event
     * @return {?}
     */
    _onAnimationStart(event) {
        this._animationStateChanged.emit(event);
    }
    /**
     * Starts the dialog exit animation.
     * @return {?}
     */
    _startExitAnimation() {
        this._state = 'exit';
        // Mark the container for check so it can react if the
        // view container is using OnPush change detection.
        this._changeDetectorRef.markForCheck();
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// TODO(jelbourn): resizing
// Counter for unique dialog ids.
let uniqueId = 0;
/**
 * Reference to a dialog opened via the MatDialog service.
 */
class MatDialogRef {
    /**
     * @param {?} _overlayRef
     * @param {?} _containerInstance
     * @param {?=} id
     */
    constructor(_overlayRef, _containerInstance, id = `mat-dialog-${uniqueId++}`) {
        this._overlayRef = _overlayRef;
        this._containerInstance = _containerInstance;
        this.id = id;
        // Emit when opening animation completes
        _containerInstance._animationStateChanged.pipe(filter(event => event.phaseName === 'done' && event.toState === 'enter'), first())
            .subscribe(() => {
            this._afterOpen.next();
            this._afterOpen.complete();
        });
        // Dispose overlay when closing animation is complete
        _containerInstance._animationStateChanged.pipe(filter(event => event.phaseName === 'done' && event.toState === 'exit'), first())
            .subscribe(() => {
            this._overlayRef.dispose();
            this._afterClosed.next(this._result);
            this._afterClosed.complete();
            this.componentInstance = /** @type {?} */ ((null));
        });
    }
    /**
     * Close the dialog.
     * @param {?=} dialogResult Optional result to return to the dialog opener.
     * @return {?}
     */
    close(dialogResult) {
        this._result = dialogResult;
        // Transition the backdrop in parallel to the dialog.
        this._containerInstance._animationStateChanged.pipe(filter(event => event.phaseName === 'start'), first())
            .subscribe(() => {
            this._beforeClose.next(dialogResult);
            this._beforeClose.complete();
            this._overlayRef.detachBackdrop();
        });
        this._containerInstance._startExitAnimation();
    }
    /**
     * Gets an observable that is notified when the dialog is finished opening.
     * @return {?}
     */
    afterOpen() {
        return this._afterOpen.asObservable();
    }
    /**
     * Gets an observable that is notified when the dialog is finished closing.
     * @return {?}
     */
    afterClosed() {
        return this._afterClosed.asObservable();
    }
    /**
     * Gets an observable that is notified when the dialog has started closing.
     * @return {?}
     */
    beforeClose() {
        return this._beforeClose.asObservable();
    }
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     * @return {?}
     */
    backdropClick() {
        return this._overlayRef.backdropClick();
    }
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     * @return {?}
     */
    keydownEvents() {
        return this._overlayRef.keydownEvents();
    }
    /**
     * Updates the dialog's position.
     * @param {?=} position New dialog position.
     * @return {?}
     */
    updatePosition(position) {
        let /** @type {?} */ strategy = this._getPositionStrategy();
        if (position && (position.left || position.right)) {
            position.left ? strategy.left(position.left) : strategy.right(position.right);
        }
        else {
            strategy.centerHorizontally();
        }
        if (position && (position.top || position.bottom)) {
            position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
        }
        else {
            strategy.centerVertically();
        }
        this._overlayRef.updatePosition();
        return this;
    }
    /**
     * Updates the dialog's width and height.
     * @param {?=} width New width of the dialog.
     * @param {?=} height New height of the dialog.
     * @return {?}
     */
    updateSize(width = 'auto', height = 'auto') {
        this._getPositionStrategy().width(width).height(height);
        this._overlayRef.updatePosition();
        return this;
    }
    /**
     * Fetches the position strategy object from the overlay ref.
     * @return {?}
     */
    _getPositionStrategy() {
        return /** @type {?} */ (this._overlayRef.getConfig().positionStrategy);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

const MAT_DIALOG_DATA = new InjectionToken('MatDialogData');
/**
 * Injection token that determines the scroll handling while the dialog is open.
 */
const MAT_DIALOG_SCROLL_STRATEGY = new InjectionToken('mat-dialog-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return () => overlay.scrollStrategies.block();
}
/**
 * \@docs-private
 */
const MAT_DIALOG_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_DIALOG_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Service to open Material Design modal dialogs.
 */
class MatDialog {
    /**
     * @param {?} _overlay
     * @param {?} _injector
     * @param {?} location
     * @param {?} _scrollStrategy
     * @param {?} _parentDialog
     */
    constructor(_overlay, _injector, location, _scrollStrategy, _parentDialog) {
        this._overlay = _overlay;
        this._injector = _injector;
        this._scrollStrategy = _scrollStrategy;
        this._parentDialog = _parentDialog;
        // Close all of the dialogs when the user goes forwards/backwards in history or when the
        // location hash changes. Note that this usually doesn't include clicking on links (unless
        // the user is using the `HashLocationStrategy`).
        if (!_parentDialog && location) {
            location.subscribe(() => this.closeAll());
        }
    }
    /**
     * Keeps track of the currently-open dialogs.
     * @return {?}
     */
    get openDialogs() {
        return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
    }
    /**
     * Stream that emits when a dialog has been opened.
     * @return {?}
     */
    get afterOpen() {
        return this._parentDialog ? this._parentDialog.afterOpen : this._afterOpenAtThisLevel;
    }
    /**
     * @return {?}
     */
    get _afterAllClosed() {
        const /** @type {?} */ parent = this._parentDialog;
        return parent ? parent._afterAllClosed : this._afterAllClosedAtThisLevel;
    }
    /**
     * Opens a modal dialog containing the given component.
     * @template T, D
     * @param {?} componentOrTemplateRef Type of the component to load into the dialog,
     *     or a TemplateRef to instantiate as the dialog content.
     * @param {?=} config Extra configuration options.
     * @return {?} Reference to the newly-opened dialog.
     */
    open(componentOrTemplateRef, config) {
        config = _applyConfigDefaults(config);
        if (config.id && this.getDialogById(config.id)) {
            throw Error(`Dialog with id "${config.id}" exists already. The dialog id must be unique.`);
        }
        const /** @type {?} */ overlayRef = this._createOverlay(config);
        const /** @type {?} */ dialogContainer = this._attachDialogContainer(overlayRef, config);
        const /** @type {?} */ dialogRef = this._attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config);
        this.openDialogs.push(dialogRef);
        dialogRef.afterClosed().subscribe(() => this._removeOpenDialog(dialogRef));
        this.afterOpen.next(dialogRef);
        return dialogRef;
    }
    /**
     * Closes all of the currently-open dialogs.
     * @return {?}
     */
    closeAll() {
        let /** @type {?} */ i = this.openDialogs.length;
        while (i--) {
            // The `_openDialogs` property isn't updated after close until the rxjs subscription
            // runs on the next microtask, in addition to modifying the array as we're going
            // through it. We loop through all of them and call close without assuming that
            // they'll be removed from the list instantaneously.
            this.openDialogs[i].close();
        }
    }
    /**
     * Finds an open dialog by its id.
     * @param {?} id ID to use when looking up the dialog.
     * @return {?}
     */
    getDialogById(id) {
        return this.openDialogs.find(dialog => dialog.id === id);
    }
    /**
     * Creates the overlay into which the dialog will be loaded.
     * @param {?} config The dialog configuration.
     * @return {?} A promise resolving to the OverlayRef for the created overlay.
     */
    _createOverlay(config) {
        const /** @type {?} */ overlayConfig = this._getOverlayConfig(config);
        return this._overlay.create(overlayConfig);
    }
    /**
     * Creates an overlay config from a dialog config.
     * @param {?} dialogConfig The dialog configuration.
     * @return {?} The overlay configuration.
     */
    _getOverlayConfig(dialogConfig) {
        const /** @type {?} */ state$$1 = new OverlayConfig({
            positionStrategy: this._overlay.position().global(),
            scrollStrategy: this._scrollStrategy(),
            panelClass: dialogConfig.panelClass,
            hasBackdrop: dialogConfig.hasBackdrop,
            direction: dialogConfig.direction,
            minWidth: dialogConfig.minWidth,
            minHeight: dialogConfig.minHeight,
            maxWidth: dialogConfig.maxWidth,
            maxHeight: dialogConfig.maxHeight
        });
        if (dialogConfig.backdropClass) {
            state$$1.backdropClass = dialogConfig.backdropClass;
        }
        return state$$1;
    }
    /**
     * Attaches an MatDialogContainer to a dialog's already-created overlay.
     * @param {?} overlay Reference to the dialog's underlying overlay.
     * @param {?} config The dialog configuration.
     * @return {?} A promise resolving to a ComponentRef for the attached container.
     */
    _attachDialogContainer(overlay, config) {
        let /** @type {?} */ containerPortal = new ComponentPortal(MatDialogContainer, config.viewContainerRef);
        let /** @type {?} */ containerRef = overlay.attach(containerPortal);
        containerRef.instance._config = config;
        return containerRef.instance;
    }
    /**
     * Attaches the user-provided component to the already-created MatDialogContainer.
     * @template T
     * @param {?} componentOrTemplateRef The type of component being loaded into the dialog,
     *     or a TemplateRef to instantiate as the content.
     * @param {?} dialogContainer Reference to the wrapping MatDialogContainer.
     * @param {?} overlayRef Reference to the overlay in which the dialog resides.
     * @param {?} config The dialog configuration.
     * @return {?} A promise resolving to the MatDialogRef that should be returned to the user.
     */
    _attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config) {
        // Create a reference to the dialog we're creating in order to give the user a handle
        // to modify and close it.
        const /** @type {?} */ dialogRef = new MatDialogRef(overlayRef, dialogContainer, config.id);
        // When the dialog backdrop is clicked, we want to close it.
        if (config.hasBackdrop) {
            overlayRef.backdropClick().subscribe(() => {
                if (!dialogRef.disableClose) {
                    dialogRef.close();
                }
            });
        }
        // Close when escape keydown event occurs
        overlayRef.keydownEvents().pipe(filter(event => event.keyCode === ESCAPE && !dialogRef.disableClose)).subscribe(() => dialogRef.close());
        if (componentOrTemplateRef instanceof TemplateRef) {
            dialogContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, /** @type {?} */ ((null)), /** @type {?} */ ({ $implicit: config.data, dialogRef })));
        }
        else {
            const /** @type {?} */ injector = this._createInjector(config, dialogRef, dialogContainer);
            const /** @type {?} */ contentRef = dialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, undefined, injector));
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
     * @template T
     * @param {?} config Config object that is used to construct the dialog.
     * @param {?} dialogRef Reference to the dialog.
     * @param {?} dialogContainer
     * @return {?} The custom injector that can be used inside the dialog.
     */
    _createInjector(config, dialogRef, dialogContainer) {
        const /** @type {?} */ userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const /** @type {?} */ injectionTokens = new WeakMap();
        injectionTokens.set(MatDialogRef, dialogRef);
        // The MatDialogContainer is injected in the portal as the MatDialogContainer and the dialog's
        // content are created out of the same ViewContainerRef and as such, are siblings for injector
        // purposes.  To allow the hierarchy that is expected, the MatDialogContainer is explicitly
        // added to the injection tokens.
        injectionTokens.set(MatDialogContainer, dialogContainer);
        injectionTokens.set(MAT_DIALOG_DATA, config.data);
        injectionTokens.set(Directionality, {
            value: config.direction,
            change: of()
        });
        return new PortalInjector(userInjector || this._injector, injectionTokens);
    }
    /**
     * Removes a dialog from the array of open dialogs.
     * @param {?} dialogRef Dialog to be removed.
     * @return {?}
     */
    _removeOpenDialog(dialogRef) {
        const /** @type {?} */ index = this.openDialogs.indexOf(dialogRef);
        if (index > -1) {
            this.openDialogs.splice(index, 1);
            // no open dialogs are left, call next on afterAllClosed Subject
            if (!this.openDialogs.length) {
                this._afterAllClosed.next();
            }
        }
    }
}
/**
 * Applies default options to the dialog config.
 * @param {?=} config Config to be modified.
 * @return {?} The new configuration object.
 */
function _applyConfigDefaults(config) {
    return extendObject(new MatDialogConfig(), config);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Button that will close the current dialog.
 */
class MatDialogClose {
    /**
     * @param {?} dialogRef
     */
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        const /** @type {?} */ proxiedChange = changes["_matDialogClose"] || changes["_matDialogCloseResult"];
        if (proxiedChange) {
            this.dialogResult = proxiedChange.currentValue;
        }
    }
}
/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
class MatDialogTitle {
    /**
     * @param {?} _container
     */
    constructor(_container) {
        this._container = _container;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this._container && !this._container._ariaLabelledBy) {
            Promise.resolve().then(() => this._container._ariaLabelledBy = this.id);
        }
    }
}
/**
 * Scrollable content container of a dialog.
 */
class MatDialogContent {
}
/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
class MatDialogActions {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatDialogModule {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatDialogModule, MAT_DIALOG_DATA, MAT_DIALOG_SCROLL_STRATEGY, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, throwMatDialogContentAlreadyAttachedError, MatDialogContainer, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogConfig, MatDialogRef };
//# sourceMappingURL=dialog.js.map
