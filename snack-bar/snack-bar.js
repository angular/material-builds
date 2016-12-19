var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule, Injectable } from '@angular/core';
import { ComponentPortal, Overlay, OverlayModule, OverlayState, PortalModule, OVERLAY_PROVIDERS, MdLiveAnnouncer, DefaultStyleCompatibilityModeModule } from '../core';
import { CommonModule } from '@angular/common';
import { MdSnackBarConfig } from './snack-bar-config';
import { MdSnackBarRef } from './snack-bar-ref';
import { MdSnackBarContainer } from './snack-bar-container';
import { SimpleSnackBar } from './simple-snack-bar';
import { extendObject } from '../core/util/object-extend';
/**
 * Service to dispatch Material Design snack bar messages.
 */
export var MdSnackBar = (function () {
    function MdSnackBar(_overlay, _live) {
        this._overlay = _overlay;
        this._live = _live;
    }
    /**
     * Creates and dispatches a snack bar with a custom component for the content, removing any
     * currently opened snack bars.
     */
    MdSnackBar.prototype.openFromComponent = function (component, config) {
        var _this = this;
        config = _applyConfigDefaults(config);
        var overlayRef = this._createOverlay();
        var snackBarContainer = this._attachSnackBarContainer(overlayRef, config);
        var snackBarRef = this._attachSnackbarContent(component, snackBarContainer, overlayRef);
        // When the snackbar is dismissed, clear the reference to it.
        snackBarRef.afterDismissed().subscribe(function () {
            // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
            if (_this._snackBarRef == snackBarRef) {
                _this._snackBarRef = null;
            }
        });
        // If a snack bar is already in view, dismiss it and enter the new snack bar after exit
        // animation is complete.
        if (this._snackBarRef) {
            this._snackBarRef.afterDismissed().subscribe(function () {
                snackBarRef.containerInstance.enter();
            });
            this._snackBarRef.dismiss();
        }
        else {
            snackBarRef.containerInstance.enter();
        }
        // If a dismiss timeout is provided, set up dismiss based on after the snackbar is opened.
        if (config.duration > 0) {
            snackBarRef.afterOpened().subscribe(function () {
                setTimeout(function () { return snackBarRef.dismiss(); }, config.duration);
            });
        }
        this._live.announce(config.announcementMessage, config.politeness);
        this._snackBarRef = snackBarRef;
        return this._snackBarRef;
    };
    /**
     * Opens a snackbar with a message and an optional action.
     * @param message The message to show in the snackbar.
     * @param action The label for the snackbar action.
     * @param config Additional configuration options for the snackbar.
     * @returns {MdSnackBarRef<SimpleSnackBar>}
     */
    MdSnackBar.prototype.open = function (message, action, config) {
        if (action === void 0) { action = ''; }
        if (config === void 0) { config = {}; }
        config.announcementMessage = message;
        var simpleSnackBarRef = this.openFromComponent(SimpleSnackBar, config);
        simpleSnackBarRef.instance.snackBarRef = simpleSnackBarRef;
        simpleSnackBarRef.instance.message = message;
        simpleSnackBarRef.instance.action = action;
        return simpleSnackBarRef;
    };
    /**
     * Attaches the snack bar container component to the overlay.
     */
    MdSnackBar.prototype._attachSnackBarContainer = function (overlayRef, config) {
        var containerPortal = new ComponentPortal(MdSnackBarContainer, config.viewContainerRef);
        var containerRef = overlayRef.attach(containerPortal);
        containerRef.instance.snackBarConfig = config;
        return containerRef.instance;
    };
    /**
     * Places a new component as the content of the snack bar container.
     */
    MdSnackBar.prototype._attachSnackbarContent = function (component, container, overlayRef) {
        var portal = new ComponentPortal(component);
        var contentRef = container.attachComponentPortal(portal);
        return new MdSnackBarRef(contentRef.instance, container, overlayRef);
    };
    /**
     * Creates a new overlay and places it in the correct location.
     */
    MdSnackBar.prototype._createOverlay = function () {
        var state = new OverlayState();
        state.positionStrategy = this._overlay.position().global()
            .centerHorizontally()
            .bottom('0');
        return this._overlay.create(state);
    };
    MdSnackBar = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Overlay, MdLiveAnnouncer])
    ], MdSnackBar);
    return MdSnackBar;
}());
/**
 * Applies default options to the snackbar config.
 * @param config The configuration to which the defaults will be applied.
 * @returns The new configuration object with defaults applied.
 */
function _applyConfigDefaults(config) {
    return extendObject(new MdSnackBarConfig(), config);
}
export var MdSnackBarModule = (function () {
    function MdSnackBarModule() {
    }
    MdSnackBarModule.forRoot = function () {
        return {
            ngModule: MdSnackBarModule,
            providers: [MdSnackBar, OVERLAY_PROVIDERS, MdLiveAnnouncer]
        };
    };
    MdSnackBarModule = __decorate([
        NgModule({
            imports: [OverlayModule, PortalModule, CommonModule, DefaultStyleCompatibilityModeModule],
            exports: [MdSnackBarContainer, DefaultStyleCompatibilityModeModule],
            declarations: [MdSnackBarContainer, SimpleSnackBar],
            entryComponents: [MdSnackBarContainer, SimpleSnackBar],
        }), 
        __metadata('design:paramtypes', [])
    ], MdSnackBarModule);
    return MdSnackBarModule;
}());

//# sourceMappingURL=snack-bar.js.map
