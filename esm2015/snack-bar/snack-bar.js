/**
 * @fileoverview added by tsickle
 * Generated from: src/material/snack-bar/snack-bar.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector, TemplatePortal } from '@angular/cdk/portal';
import { Inject, Injectable, InjectionToken, Injector, Optional, SkipSelf, TemplateRef, } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { SimpleSnackBar } from './simple-snack-bar';
import { MAT_SNACK_BAR_DATA, MatSnackBarConfig } from './snack-bar-config';
import { MatSnackBarContainer } from './snack-bar-container';
import { MatSnackBarModule } from './snack-bar-module';
import { MatSnackBarRef } from './snack-bar-ref';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/cdk/a11y";
import * as i3 from "@angular/cdk/layout";
import * as i4 from "./snack-bar-module";
/**
 * Injection token that can be used to specify default snack bar.
 * @type {?}
 */
export const MAT_SNACK_BAR_DEFAULT_OPTIONS = new InjectionToken('mat-snack-bar-default-options', {
    providedIn: 'root',
    factory: MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY,
});
/**
 * \@docs-private
 * @return {?}
 */
export function MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY() {
    return new MatSnackBarConfig();
}
/**
 * Service to dispatch Material Design snack bar messages.
 */
let MatSnackBar = /** @class */ (() => {
    /**
     * Service to dispatch Material Design snack bar messages.
     */
    class MatSnackBar {
        /**
         * @param {?} _overlay
         * @param {?} _live
         * @param {?} _injector
         * @param {?} _breakpointObserver
         * @param {?} _parentSnackBar
         * @param {?} _defaultConfig
         */
        constructor(_overlay, _live, _injector, _breakpointObserver, _parentSnackBar, _defaultConfig) {
            this._overlay = _overlay;
            this._live = _live;
            this._injector = _injector;
            this._breakpointObserver = _breakpointObserver;
            this._parentSnackBar = _parentSnackBar;
            this._defaultConfig = _defaultConfig;
            /**
             * Reference to the current snack bar in the view *at this level* (in the Angular injector tree).
             * If there is a parent snack-bar service, all operations should delegate to that parent
             * via `_openedSnackBarRef`.
             */
            this._snackBarRefAtThisLevel = null;
        }
        /**
         * Reference to the currently opened snackbar at *any* level.
         * @return {?}
         */
        get _openedSnackBarRef() {
            /** @type {?} */
            const parent = this._parentSnackBar;
            return parent ? parent._openedSnackBarRef : this._snackBarRefAtThisLevel;
        }
        /**
         * @param {?} value
         * @return {?}
         */
        set _openedSnackBarRef(value) {
            if (this._parentSnackBar) {
                this._parentSnackBar._openedSnackBarRef = value;
            }
            else {
                this._snackBarRefAtThisLevel = value;
            }
        }
        /**
         * Creates and dispatches a snack bar with a custom component for the content, removing any
         * currently opened snack bars.
         *
         * @template T
         * @param {?} component Component to be instantiated.
         * @param {?=} config Extra configuration for the snack bar.
         * @return {?}
         */
        openFromComponent(component, config) {
            return (/** @type {?} */ (this._attach(component, config)));
        }
        /**
         * Creates and dispatches a snack bar with a custom template for the content, removing any
         * currently opened snack bars.
         *
         * @param {?} template Template to be instantiated.
         * @param {?=} config Extra configuration for the snack bar.
         * @return {?}
         */
        openFromTemplate(template, config) {
            return this._attach(template, config);
        }
        /**
         * Opens a snackbar with a message and an optional action.
         * @param {?} message The message to show in the snackbar.
         * @param {?=} action The label for the snackbar action.
         * @param {?=} config Additional configuration options for the snackbar.
         * @return {?}
         */
        open(message, action = '', config) {
            /** @type {?} */
            const _config = Object.assign(Object.assign({}, this._defaultConfig), config);
            // Since the user doesn't have access to the component, we can
            // override the data to pass in our own message and action.
            _config.data = { message, action };
            if (!_config.announcementMessage) {
                _config.announcementMessage = message;
            }
            return this.openFromComponent(SimpleSnackBar, _config);
        }
        /**
         * Dismisses the currently-visible snack bar.
         * @return {?}
         */
        dismiss() {
            if (this._openedSnackBarRef) {
                this._openedSnackBarRef.dismiss();
            }
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            // Only dismiss the snack bar at the current level on destroy.
            if (this._snackBarRefAtThisLevel) {
                this._snackBarRefAtThisLevel.dismiss();
            }
        }
        /**
         * Attaches the snack bar container component to the overlay.
         * @private
         * @param {?} overlayRef
         * @param {?} config
         * @return {?}
         */
        _attachSnackBarContainer(overlayRef, config) {
            /** @type {?} */
            const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
            /** @type {?} */
            const injector = new PortalInjector(userInjector || this._injector, new WeakMap([
                [MatSnackBarConfig, config]
            ]));
            /** @type {?} */
            const containerPortal = new ComponentPortal(MatSnackBarContainer, config.viewContainerRef, injector);
            /** @type {?} */
            const containerRef = overlayRef.attach(containerPortal);
            containerRef.instance.snackBarConfig = config;
            return containerRef.instance;
        }
        /**
         * Places a new component or a template as the content of the snack bar container.
         * @private
         * @template T
         * @param {?} content
         * @param {?=} userConfig
         * @return {?}
         */
        _attach(content, userConfig) {
            /** @type {?} */
            const config = Object.assign(Object.assign(Object.assign({}, new MatSnackBarConfig()), this._defaultConfig), userConfig);
            /** @type {?} */
            const overlayRef = this._createOverlay(config);
            /** @type {?} */
            const container = this._attachSnackBarContainer(overlayRef, config);
            /** @type {?} */
            const snackBarRef = new MatSnackBarRef(container, overlayRef);
            if (content instanceof TemplateRef) {
                /** @type {?} */
                const portal = new TemplatePortal(content, (/** @type {?} */ (null)), (/** @type {?} */ ({
                    $implicit: config.data,
                    snackBarRef
                })));
                snackBarRef.instance = container.attachTemplatePortal(portal);
            }
            else {
                /** @type {?} */
                const injector = this._createInjector(config, snackBarRef);
                /** @type {?} */
                const portal = new ComponentPortal(content, undefined, injector);
                /** @type {?} */
                const contentRef = container.attachComponentPortal(portal);
                // We can't pass this via the injector, because the injector is created earlier.
                snackBarRef.instance = contentRef.instance;
            }
            // Subscribe to the breakpoint observer and attach the mat-snack-bar-handset class as
            // appropriate. This class is applied to the overlay element because the overlay must expand to
            // fill the width of the screen for full width snackbars.
            this._breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(takeUntil(overlayRef.detachments())).subscribe((/**
             * @param {?} state
             * @return {?}
             */
            state => {
                /** @type {?} */
                const classList = overlayRef.overlayElement.classList;
                /** @type {?} */
                const className = 'mat-snack-bar-handset';
                state.matches ? classList.add(className) : classList.remove(className);
            }));
            this._animateSnackBar(snackBarRef, config);
            this._openedSnackBarRef = snackBarRef;
            return this._openedSnackBarRef;
        }
        /**
         * Animates the old snack bar out and the new one in.
         * @private
         * @param {?} snackBarRef
         * @param {?} config
         * @return {?}
         */
        _animateSnackBar(snackBarRef, config) {
            // When the snackbar is dismissed, clear the reference to it.
            snackBarRef.afterDismissed().subscribe((/**
             * @return {?}
             */
            () => {
                // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
                if (this._openedSnackBarRef == snackBarRef) {
                    this._openedSnackBarRef = null;
                }
                if (config.announcementMessage) {
                    this._live.clear();
                }
            }));
            if (this._openedSnackBarRef) {
                // If a snack bar is already in view, dismiss it and enter the
                // new snack bar after exit animation is complete.
                this._openedSnackBarRef.afterDismissed().subscribe((/**
                 * @return {?}
                 */
                () => {
                    snackBarRef.containerInstance.enter();
                }));
                this._openedSnackBarRef.dismiss();
            }
            else {
                // If no snack bar is in view, enter the new snack bar.
                snackBarRef.containerInstance.enter();
            }
            // If a dismiss timeout is provided, set up dismiss based on after the snackbar is opened.
            if (config.duration && config.duration > 0) {
                snackBarRef.afterOpened().subscribe((/**
                 * @return {?}
                 */
                () => snackBarRef._dismissAfter((/** @type {?} */ (config.duration)))));
            }
            if (config.announcementMessage) {
                this._live.announce(config.announcementMessage, config.politeness);
            }
        }
        /**
         * Creates a new overlay and places it in the correct location.
         * @private
         * @param {?} config The user-specified snack bar config.
         * @return {?}
         */
        _createOverlay(config) {
            /** @type {?} */
            const overlayConfig = new OverlayConfig();
            overlayConfig.direction = config.direction;
            /** @type {?} */
            let positionStrategy = this._overlay.position().global();
            // Set horizontal position.
            /** @type {?} */
            const isRtl = config.direction === 'rtl';
            /** @type {?} */
            const isLeft = (config.horizontalPosition === 'left' ||
                (config.horizontalPosition === 'start' && !isRtl) ||
                (config.horizontalPosition === 'end' && isRtl));
            /** @type {?} */
            const isRight = !isLeft && config.horizontalPosition !== 'center';
            if (isLeft) {
                positionStrategy.left('0');
            }
            else if (isRight) {
                positionStrategy.right('0');
            }
            else {
                positionStrategy.centerHorizontally();
            }
            // Set horizontal position.
            if (config.verticalPosition === 'top') {
                positionStrategy.top('0');
            }
            else {
                positionStrategy.bottom('0');
            }
            overlayConfig.positionStrategy = positionStrategy;
            return this._overlay.create(overlayConfig);
        }
        /**
         * Creates an injector to be used inside of a snack bar component.
         * @private
         * @template T
         * @param {?} config Config that was used to create the snack bar.
         * @param {?} snackBarRef Reference to the snack bar.
         * @return {?}
         */
        _createInjector(config, snackBarRef) {
            /** @type {?} */
            const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
            return new PortalInjector(userInjector || this._injector, new WeakMap([
                [MatSnackBarRef, snackBarRef],
                [MAT_SNACK_BAR_DATA, config.data]
            ]));
        }
    }
    MatSnackBar.decorators = [
        { type: Injectable, args: [{ providedIn: MatSnackBarModule },] }
    ];
    /** @nocollapse */
    MatSnackBar.ctorParameters = () => [
        { type: Overlay },
        { type: LiveAnnouncer },
        { type: Injector },
        { type: BreakpointObserver },
        { type: MatSnackBar, decorators: [{ type: Optional }, { type: SkipSelf }] },
        { type: MatSnackBarConfig, decorators: [{ type: Inject, args: [MAT_SNACK_BAR_DEFAULT_OPTIONS,] }] }
    ];
    /** @nocollapse */ MatSnackBar.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatSnackBar_Factory() { return new MatSnackBar(i0.ɵɵinject(i1.Overlay), i0.ɵɵinject(i2.LiveAnnouncer), i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(i3.BreakpointObserver), i0.ɵɵinject(MatSnackBar, 12), i0.ɵɵinject(MAT_SNACK_BAR_DEFAULT_OPTIONS)); }, token: MatSnackBar, providedIn: i4.MatSnackBarModule });
    return MatSnackBar;
})();
export { MatSnackBar };
if (false) {
    /**
     * Reference to the current snack bar in the view *at this level* (in the Angular injector tree).
     * If there is a parent snack-bar service, all operations should delegate to that parent
     * via `_openedSnackBarRef`.
     * @type {?}
     * @private
     */
    MatSnackBar.prototype._snackBarRefAtThisLevel;
    /**
     * @type {?}
     * @private
     */
    MatSnackBar.prototype._overlay;
    /**
     * @type {?}
     * @private
     */
    MatSnackBar.prototype._live;
    /**
     * @type {?}
     * @private
     */
    MatSnackBar.prototype._injector;
    /**
     * @type {?}
     * @private
     */
    MatSnackBar.prototype._breakpointObserver;
    /**
     * @type {?}
     * @private
     */
    MatSnackBar.prototype._parentSnackBar;
    /**
     * @type {?}
     * @private
     */
    MatSnackBar.prototype._defaultConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NuYWNrLWJhci9zbmFjay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxXQUFXLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRSxPQUFPLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBYSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxlQUFlLEVBQWlCLGNBQWMsRUFBRSxjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRyxPQUFPLEVBR0wsTUFBTSxFQUNOLFVBQVUsRUFDVixjQUFjLEVBQ2QsUUFBUSxFQUNSLFFBQVEsRUFDUixRQUFRLEVBQ1IsV0FBVyxHQUVaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFDLGtCQUFrQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDekUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7Ozs7Ozs7O0FBSS9DLE1BQU0sT0FBTyw2QkFBNkIsR0FDdEMsSUFBSSxjQUFjLENBQW9CLCtCQUErQixFQUFFO0lBQ3JFLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSxxQ0FBcUM7Q0FDL0MsQ0FBQzs7Ozs7QUFHTixNQUFNLFVBQVUscUNBQXFDO0lBQ25ELE9BQU8sSUFBSSxpQkFBaUIsRUFBRSxDQUFDO0FBQ2pDLENBQUM7Ozs7QUFLRDs7OztJQUFBLE1BQ2EsV0FBVzs7Ozs7Ozs7O1FBc0J0QixZQUNZLFFBQWlCLEVBQ2pCLEtBQW9CLEVBQ3BCLFNBQW1CLEVBQ25CLG1CQUF1QyxFQUNmLGVBQTRCLEVBQ2IsY0FBaUM7WUFMeEUsYUFBUSxHQUFSLFFBQVEsQ0FBUztZQUNqQixVQUFLLEdBQUwsS0FBSyxDQUFlO1lBQ3BCLGNBQVMsR0FBVCxTQUFTLENBQVU7WUFDbkIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFvQjtZQUNmLG9CQUFlLEdBQWYsZUFBZSxDQUFhO1lBQ2IsbUJBQWMsR0FBZCxjQUFjLENBQW1COzs7Ozs7WUF0QjVFLDRCQUF1QixHQUErQixJQUFJLENBQUM7UUFzQm9CLENBQUM7Ozs7O1FBbkJ4RixJQUFJLGtCQUFrQjs7a0JBQ2QsTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlO1lBQ25DLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztRQUMzRSxDQUFDOzs7OztRQUVELElBQUksa0JBQWtCLENBQUMsS0FBaUM7WUFDdEQsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUN4QixJQUFJLENBQUMsZUFBZSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQzthQUNqRDtpQkFBTTtnQkFDTCxJQUFJLENBQUMsdUJBQXVCLEdBQUcsS0FBSyxDQUFDO2FBQ3RDO1FBQ0gsQ0FBQzs7Ozs7Ozs7OztRQWlCRCxpQkFBaUIsQ0FBSSxTQUEyQixFQUFFLE1BQTBCO1lBRTFFLE9BQU8sbUJBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEVBQXFCLENBQUM7UUFDOUQsQ0FBQzs7Ozs7Ozs7O1FBU0QsZ0JBQWdCLENBQUMsUUFBMEIsRUFBRSxNQUEwQjtZQUVyRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLENBQUM7Ozs7Ozs7O1FBUUQsSUFBSSxDQUFDLE9BQWUsRUFBRSxTQUFpQixFQUFFLEVBQUUsTUFBMEI7O2tCQUU3RCxPQUFPLG1DQUFPLElBQUksQ0FBQyxjQUFjLEdBQUssTUFBTSxDQUFDO1lBRW5ELDhEQUE4RDtZQUM5RCwyREFBMkQ7WUFDM0QsT0FBTyxDQUFDLElBQUksR0FBRyxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUMsQ0FBQztZQUVqQyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFO2dCQUNoQyxPQUFPLENBQUMsbUJBQW1CLEdBQUcsT0FBTyxDQUFDO2FBQ3ZDO1lBRUQsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3pELENBQUM7Ozs7O1FBS0QsT0FBTztZQUNMLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO2dCQUMzQixJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDbkM7UUFDSCxDQUFDOzs7O1FBRUQsV0FBVztZQUNULDhEQUE4RDtZQUM5RCxJQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ3hDO1FBQ0gsQ0FBQzs7Ozs7Ozs7UUFLTyx3QkFBd0IsQ0FBQyxVQUFzQixFQUN0QixNQUF5Qjs7a0JBRWxELFlBQVksR0FBRyxNQUFNLElBQUksTUFBTSxDQUFDLGdCQUFnQixJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFROztrQkFDcEYsUUFBUSxHQUFHLElBQUksY0FBYyxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksT0FBTyxDQUFDO2dCQUM5RSxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQzthQUM1QixDQUFDLENBQUM7O2tCQUVHLGVBQWUsR0FDakIsSUFBSSxlQUFlLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQzs7a0JBQzFFLFlBQVksR0FBdUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFDM0YsWUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDO1lBQzlDLE9BQU8sWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUMvQixDQUFDOzs7Ozs7Ozs7UUFLTyxPQUFPLENBQUksT0FBMEMsRUFBRSxVQUE4Qjs7a0JBR3JGLE1BQU0saURBQU8sSUFBSSxpQkFBaUIsRUFBRSxHQUFLLElBQUksQ0FBQyxjQUFjLEdBQUssVUFBVSxDQUFDOztrQkFDNUUsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDOztrQkFDeEMsU0FBUyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDOztrQkFDN0QsV0FBVyxHQUFHLElBQUksY0FBYyxDQUEyQixTQUFTLEVBQUUsVUFBVSxDQUFDO1lBRXZGLElBQUksT0FBTyxZQUFZLFdBQVcsRUFBRTs7c0JBQzVCLE1BQU0sR0FBRyxJQUFJLGNBQWMsQ0FBQyxPQUFPLEVBQUUsbUJBQUEsSUFBSSxFQUFDLEVBQUUsbUJBQUE7b0JBQ2hELFNBQVMsRUFBRSxNQUFNLENBQUMsSUFBSTtvQkFDdEIsV0FBVztpQkFDWixFQUFPLENBQUM7Z0JBRVQsV0FBVyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDL0Q7aUJBQU07O3NCQUNDLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUM7O3NCQUNwRCxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUM7O3NCQUMxRCxVQUFVLEdBQUcsU0FBUyxDQUFDLHFCQUFxQixDQUFJLE1BQU0sQ0FBQztnQkFFN0QsZ0ZBQWdGO2dCQUNoRixXQUFXLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUM7YUFDNUM7WUFFRCxxRkFBcUY7WUFDckYsK0ZBQStGO1lBQy9GLHlEQUF5RDtZQUN6RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQ2hFLFNBQVMsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FDcEMsQ0FBQyxTQUFTOzs7O1lBQUMsS0FBSyxDQUFDLEVBQUU7O3NCQUNaLFNBQVMsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDLFNBQVM7O3NCQUMvQyxTQUFTLEdBQUcsdUJBQXVCO2dCQUN6QyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3pFLENBQUMsRUFBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsV0FBVyxDQUFDO1lBQ3RDLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBQ2pDLENBQUM7Ozs7Ozs7O1FBR08sZ0JBQWdCLENBQUMsV0FBZ0MsRUFBRSxNQUF5QjtZQUNsRiw2REFBNkQ7WUFDN0QsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDLFNBQVM7OztZQUFDLEdBQUcsRUFBRTtnQkFDMUMsaUZBQWlGO2dCQUNqRixJQUFJLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxXQUFXLEVBQUU7b0JBQzFDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7aUJBQ2hDO2dCQUVELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO29CQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNwQjtZQUNILENBQUMsRUFBQyxDQUFDO1lBRUgsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7Z0JBQzNCLDhEQUE4RDtnQkFDOUQsa0RBQWtEO2dCQUNsRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLENBQUMsU0FBUzs7O2dCQUFDLEdBQUcsRUFBRTtvQkFDdEQsV0FBVyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUN4QyxDQUFDLEVBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDbkM7aUJBQU07Z0JBQ0wsdURBQXVEO2dCQUN2RCxXQUFXLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDdkM7WUFFRCwwRkFBMEY7WUFDMUYsSUFBSSxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFO2dCQUMxQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUzs7O2dCQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsbUJBQUEsTUFBTSxDQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsQ0FBQzthQUN4RjtZQUVELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO2dCQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ3BFO1FBQ0gsQ0FBQzs7Ozs7OztRQU1PLGNBQWMsQ0FBQyxNQUF5Qjs7a0JBQ3hDLGFBQWEsR0FBRyxJQUFJLGFBQWEsRUFBRTtZQUN6QyxhQUFhLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7O2dCQUV2QyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRTs7O2tCQUVsRCxLQUFLLEdBQUcsTUFBTSxDQUFDLFNBQVMsS0FBSyxLQUFLOztrQkFDbEMsTUFBTSxHQUFHLENBQ2IsTUFBTSxDQUFDLGtCQUFrQixLQUFLLE1BQU07Z0JBQ3BDLENBQUMsTUFBTSxDQUFDLGtCQUFrQixLQUFLLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDakQsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEtBQUssS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDOztrQkFDM0MsT0FBTyxHQUFHLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsS0FBSyxRQUFRO1lBQ2pFLElBQUksTUFBTSxFQUFFO2dCQUNWLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM1QjtpQkFBTSxJQUFJLE9BQU8sRUFBRTtnQkFDbEIsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzdCO2lCQUFNO2dCQUNMLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLENBQUM7YUFDdkM7WUFDRCwyQkFBMkI7WUFDM0IsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLEtBQUssS0FBSyxFQUFFO2dCQUNyQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDM0I7aUJBQU07Z0JBQ0wsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzlCO1lBRUQsYUFBYSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO1lBQ2xELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDN0MsQ0FBQzs7Ozs7Ozs7O1FBT08sZUFBZSxDQUNuQixNQUF5QixFQUN6QixXQUE4Qjs7a0JBRTFCLFlBQVksR0FBRyxNQUFNLElBQUksTUFBTSxDQUFDLGdCQUFnQixJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRO1lBRTFGLE9BQU8sSUFBSSxjQUFjLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxPQUFPLENBQVc7Z0JBQzlFLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQztnQkFDN0IsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDO2FBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQzs7O2dCQTlPRixVQUFVLFNBQUMsRUFBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUM7Ozs7Z0JBckNuQyxPQUFPO2dCQUZQLGFBQWE7Z0JBVW5CLFFBQVE7Z0JBVEYsa0JBQWtCO2dCQWtFNkIsV0FBVyx1QkFBM0QsUUFBUSxZQUFJLFFBQVE7Z0JBakRDLGlCQUFpQix1QkFrRHRDLE1BQU0sU0FBQyw2QkFBNkI7OztzQkE1RTNDO0tBOFJDO1NBOU9ZLFdBQVc7Ozs7Ozs7OztJQU10Qiw4Q0FBbUU7Ozs7O0lBaUIvRCwrQkFBeUI7Ozs7O0lBQ3pCLDRCQUE0Qjs7Ozs7SUFDNUIsZ0NBQTJCOzs7OztJQUMzQiwwQ0FBK0M7Ozs7O0lBQy9DLHNDQUE0RDs7Ozs7SUFDNUQscUNBQWdGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TGl2ZUFubm91bmNlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCcmVha3BvaW50T2JzZXJ2ZXIsIEJyZWFrcG9pbnRzfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7T3ZlcmxheSwgT3ZlcmxheUNvbmZpZywgT3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21wb25lbnRQb3J0YWwsIENvbXBvbmVudFR5cGUsIFBvcnRhbEluamVjdG9yLCBUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBDb21wb25lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgSW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIE9wdGlvbmFsLFxuICBTa2lwU2VsZixcbiAgVGVtcGxhdGVSZWYsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3Rha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtTaW1wbGVTbmFja0Jhcn0gZnJvbSAnLi9zaW1wbGUtc25hY2stYmFyJztcbmltcG9ydCB7TUFUX1NOQUNLX0JBUl9EQVRBLCBNYXRTbmFja0JhckNvbmZpZ30gZnJvbSAnLi9zbmFjay1iYXItY29uZmlnJztcbmltcG9ydCB7TWF0U25hY2tCYXJDb250YWluZXJ9IGZyb20gJy4vc25hY2stYmFyLWNvbnRhaW5lcic7XG5pbXBvcnQge01hdFNuYWNrQmFyTW9kdWxlfSBmcm9tICcuL3NuYWNrLWJhci1tb2R1bGUnO1xuaW1wb3J0IHtNYXRTbmFja0JhclJlZn0gZnJvbSAnLi9zbmFjay1iYXItcmVmJztcblxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBkZWZhdWx0IHNuYWNrIGJhci4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdFNuYWNrQmFyQ29uZmlnPignbWF0LXNuYWNrLWJhci1kZWZhdWx0LW9wdGlvbnMnLCB7XG4gICAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgICBmYWN0b3J5OiBNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZLFxuICAgIH0pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0U25hY2tCYXJDb25maWcge1xuICByZXR1cm4gbmV3IE1hdFNuYWNrQmFyQ29uZmlnKCk7XG59XG5cbi8qKlxuICogU2VydmljZSB0byBkaXNwYXRjaCBNYXRlcmlhbCBEZXNpZ24gc25hY2sgYmFyIG1lc3NhZ2VzLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogTWF0U25hY2tCYXJNb2R1bGV9KVxuZXhwb3J0IGNsYXNzIE1hdFNuYWNrQmFyIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCBzbmFjayBiYXIgaW4gdGhlIHZpZXcgKmF0IHRoaXMgbGV2ZWwqIChpbiB0aGUgQW5ndWxhciBpbmplY3RvciB0cmVlKS5cbiAgICogSWYgdGhlcmUgaXMgYSBwYXJlbnQgc25hY2stYmFyIHNlcnZpY2UsIGFsbCBvcGVyYXRpb25zIHNob3VsZCBkZWxlZ2F0ZSB0byB0aGF0IHBhcmVudFxuICAgKiB2aWEgYF9vcGVuZWRTbmFja0JhclJlZmAuXG4gICAqL1xuICBwcml2YXRlIF9zbmFja0JhclJlZkF0VGhpc0xldmVsOiBNYXRTbmFja0JhclJlZjxhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudGx5IG9wZW5lZCBzbmFja2JhciBhdCAqYW55KiBsZXZlbC4gKi9cbiAgZ2V0IF9vcGVuZWRTbmFja0JhclJlZigpOiBNYXRTbmFja0JhclJlZjxhbnk+IHwgbnVsbCB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50U25hY2tCYXI7XG4gICAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5fb3BlbmVkU25hY2tCYXJSZWYgOiB0aGlzLl9zbmFja0JhclJlZkF0VGhpc0xldmVsO1xuICB9XG5cbiAgc2V0IF9vcGVuZWRTbmFja0JhclJlZih2YWx1ZTogTWF0U25hY2tCYXJSZWY8YW55PiB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fcGFyZW50U25hY2tCYXIpIHtcbiAgICAgIHRoaXMuX3BhcmVudFNuYWNrQmFyLl9vcGVuZWRTbmFja0JhclJlZiA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zbmFja0JhclJlZkF0VGhpc0xldmVsID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgICAgcHJpdmF0ZSBfbGl2ZTogTGl2ZUFubm91bmNlcixcbiAgICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICAgIHByaXZhdGUgX2JyZWFrcG9pbnRPYnNlcnZlcjogQnJlYWtwb2ludE9ic2VydmVyLFxuICAgICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcHJpdmF0ZSBfcGFyZW50U25hY2tCYXI6IE1hdFNuYWNrQmFyLFxuICAgICAgQEluamVjdChNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OUykgcHJpdmF0ZSBfZGVmYXVsdENvbmZpZzogTWF0U25hY2tCYXJDb25maWcpIHt9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW5kIGRpc3BhdGNoZXMgYSBzbmFjayBiYXIgd2l0aCBhIGN1c3RvbSBjb21wb25lbnQgZm9yIHRoZSBjb250ZW50LCByZW1vdmluZyBhbnlcbiAgICogY3VycmVudGx5IG9wZW5lZCBzbmFjayBiYXJzLlxuICAgKlxuICAgKiBAcGFyYW0gY29tcG9uZW50IENvbXBvbmVudCB0byBiZSBpbnN0YW50aWF0ZWQuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNuYWNrIGJhci5cbiAgICovXG4gIG9wZW5Gcm9tQ29tcG9uZW50PFQ+KGNvbXBvbmVudDogQ29tcG9uZW50VHlwZTxUPiwgY29uZmlnPzogTWF0U25hY2tCYXJDb25maWcpOlxuICAgIE1hdFNuYWNrQmFyUmVmPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoKGNvbXBvbmVudCwgY29uZmlnKSBhcyBNYXRTbmFja0JhclJlZjxUPjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuZCBkaXNwYXRjaGVzIGEgc25hY2sgYmFyIHdpdGggYSBjdXN0b20gdGVtcGxhdGUgZm9yIHRoZSBjb250ZW50LCByZW1vdmluZyBhbnlcbiAgICogY3VycmVudGx5IG9wZW5lZCBzbmFjayBiYXJzLlxuICAgKlxuICAgKiBAcGFyYW0gdGVtcGxhdGUgVGVtcGxhdGUgdG8gYmUgaW5zdGFudGlhdGVkLlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzbmFjayBiYXIuXG4gICAqL1xuICBvcGVuRnJvbVRlbXBsYXRlKHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+LCBjb25maWc/OiBNYXRTbmFja0JhckNvbmZpZyk6XG4gICAgTWF0U25hY2tCYXJSZWY8RW1iZWRkZWRWaWV3UmVmPGFueT4+IHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoKHRlbXBsYXRlLCBjb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGEgc25hY2tiYXIgd2l0aCBhIG1lc3NhZ2UgYW5kIGFuIG9wdGlvbmFsIGFjdGlvbi5cbiAgICogQHBhcmFtIG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gc2hvdyBpbiB0aGUgc25hY2tiYXIuXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGxhYmVsIGZvciB0aGUgc25hY2tiYXIgYWN0aW9uLlxuICAgKiBAcGFyYW0gY29uZmlnIEFkZGl0aW9uYWwgY29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgc25hY2tiYXIuXG4gICAqL1xuICBvcGVuKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uOiBzdHJpbmcgPSAnJywgY29uZmlnPzogTWF0U25hY2tCYXJDb25maWcpOlxuICAgICAgTWF0U25hY2tCYXJSZWY8U2ltcGxlU25hY2tCYXI+IHtcbiAgICBjb25zdCBfY29uZmlnID0gey4uLnRoaXMuX2RlZmF1bHRDb25maWcsIC4uLmNvbmZpZ307XG5cbiAgICAvLyBTaW5jZSB0aGUgdXNlciBkb2Vzbid0IGhhdmUgYWNjZXNzIHRvIHRoZSBjb21wb25lbnQsIHdlIGNhblxuICAgIC8vIG92ZXJyaWRlIHRoZSBkYXRhIHRvIHBhc3MgaW4gb3VyIG93biBtZXNzYWdlIGFuZCBhY3Rpb24uXG4gICAgX2NvbmZpZy5kYXRhID0ge21lc3NhZ2UsIGFjdGlvbn07XG5cbiAgICBpZiAoIV9jb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSkge1xuICAgICAgX2NvbmZpZy5hbm5vdW5jZW1lbnRNZXNzYWdlID0gbWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vcGVuRnJvbUNvbXBvbmVudChTaW1wbGVTbmFja0JhciwgX2NvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHRoZSBjdXJyZW50bHktdmlzaWJsZSBzbmFjayBiYXIuXG4gICAqL1xuICBkaXNtaXNzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vcGVuZWRTbmFja0JhclJlZikge1xuICAgICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYuZGlzbWlzcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIC8vIE9ubHkgZGlzbWlzcyB0aGUgc25hY2sgYmFyIGF0IHRoZSBjdXJyZW50IGxldmVsIG9uIGRlc3Ryb3kuXG4gICAgaWYgKHRoaXMuX3NuYWNrQmFyUmVmQXRUaGlzTGV2ZWwpIHtcbiAgICAgIHRoaXMuX3NuYWNrQmFyUmVmQXRUaGlzTGV2ZWwuZGlzbWlzcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgc25hY2sgYmFyIGNvbnRhaW5lciBjb21wb25lbnQgdG8gdGhlIG92ZXJsYXkuXG4gICAqL1xuICBwcml2YXRlIF9hdHRhY2hTbmFja0JhckNvbnRhaW5lcihvdmVybGF5UmVmOiBPdmVybGF5UmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnKTogTWF0U25hY2tCYXJDb250YWluZXIge1xuXG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuICAgIGNvbnN0IGluamVjdG9yID0gbmV3IFBvcnRhbEluamVjdG9yKHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvciwgbmV3IFdlYWtNYXAoW1xuICAgICAgW01hdFNuYWNrQmFyQ29uZmlnLCBjb25maWddXG4gICAgXSkpO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID1cbiAgICAgICAgbmV3IENvbXBvbmVudFBvcnRhbChNYXRTbmFja0JhckNvbnRhaW5lciwgY29uZmlnLnZpZXdDb250YWluZXJSZWYsIGluamVjdG9yKTtcbiAgICBjb25zdCBjb250YWluZXJSZWY6IENvbXBvbmVudFJlZjxNYXRTbmFja0JhckNvbnRhaW5lcj4gPSBvdmVybGF5UmVmLmF0dGFjaChjb250YWluZXJQb3J0YWwpO1xuICAgIGNvbnRhaW5lclJlZi5pbnN0YW5jZS5zbmFja0JhckNvbmZpZyA9IGNvbmZpZztcbiAgICByZXR1cm4gY29udGFpbmVyUmVmLmluc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsYWNlcyBhIG5ldyBjb21wb25lbnQgb3IgYSB0ZW1wbGF0ZSBhcyB0aGUgY29udGVudCBvZiB0aGUgc25hY2sgYmFyIGNvbnRhaW5lci5cbiAgICovXG4gIHByaXZhdGUgX2F0dGFjaDxUPihjb250ZW50OiBDb21wb25lbnRUeXBlPFQ+IHwgVGVtcGxhdGVSZWY8VD4sIHVzZXJDb25maWc/OiBNYXRTbmFja0JhckNvbmZpZyk6XG4gICAgTWF0U25hY2tCYXJSZWY8VCB8IEVtYmVkZGVkVmlld1JlZjxhbnk+PiB7XG5cbiAgICBjb25zdCBjb25maWcgPSB7Li4ubmV3IE1hdFNuYWNrQmFyQ29uZmlnKCksIC4uLnRoaXMuX2RlZmF1bHRDb25maWcsIC4uLnVzZXJDb25maWd9O1xuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9jcmVhdGVPdmVybGF5KGNvbmZpZyk7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fYXR0YWNoU25hY2tCYXJDb250YWluZXIob3ZlcmxheVJlZiwgY29uZmlnKTtcbiAgICBjb25zdCBzbmFja0JhclJlZiA9IG5ldyBNYXRTbmFja0JhclJlZjxUIHwgRW1iZWRkZWRWaWV3UmVmPGFueT4+KGNvbnRhaW5lciwgb3ZlcmxheVJlZik7XG5cbiAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmKSB7XG4gICAgICBjb25zdCBwb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwoY29udGVudCwgbnVsbCEsIHtcbiAgICAgICAgJGltcGxpY2l0OiBjb25maWcuZGF0YSxcbiAgICAgICAgc25hY2tCYXJSZWZcbiAgICAgIH0gYXMgYW55KTtcblxuICAgICAgc25hY2tCYXJSZWYuaW5zdGFuY2UgPSBjb250YWluZXIuYXR0YWNoVGVtcGxhdGVQb3J0YWwocG9ydGFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5qZWN0b3IgPSB0aGlzLl9jcmVhdGVJbmplY3Rvcihjb25maWcsIHNuYWNrQmFyUmVmKTtcbiAgICAgIGNvbnN0IHBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoY29udGVudCwgdW5kZWZpbmVkLCBpbmplY3Rvcik7XG4gICAgICBjb25zdCBjb250ZW50UmVmID0gY29udGFpbmVyLmF0dGFjaENvbXBvbmVudFBvcnRhbDxUPihwb3J0YWwpO1xuXG4gICAgICAvLyBXZSBjYW4ndCBwYXNzIHRoaXMgdmlhIHRoZSBpbmplY3RvciwgYmVjYXVzZSB0aGUgaW5qZWN0b3IgaXMgY3JlYXRlZCBlYXJsaWVyLlxuICAgICAgc25hY2tCYXJSZWYuaW5zdGFuY2UgPSBjb250ZW50UmVmLmluc3RhbmNlO1xuICAgIH1cblxuICAgIC8vIFN1YnNjcmliZSB0byB0aGUgYnJlYWtwb2ludCBvYnNlcnZlciBhbmQgYXR0YWNoIHRoZSBtYXQtc25hY2stYmFyLWhhbmRzZXQgY2xhc3MgYXNcbiAgICAvLyBhcHByb3ByaWF0ZS4gVGhpcyBjbGFzcyBpcyBhcHBsaWVkIHRvIHRoZSBvdmVybGF5IGVsZW1lbnQgYmVjYXVzZSB0aGUgb3ZlcmxheSBtdXN0IGV4cGFuZCB0b1xuICAgIC8vIGZpbGwgdGhlIHdpZHRoIG9mIHRoZSBzY3JlZW4gZm9yIGZ1bGwgd2lkdGggc25hY2tiYXJzLlxuICAgIHRoaXMuX2JyZWFrcG9pbnRPYnNlcnZlci5vYnNlcnZlKEJyZWFrcG9pbnRzLkhhbmRzZXRQb3J0cmFpdCkucGlwZShcbiAgICAgIHRha2VVbnRpbChvdmVybGF5UmVmLmRldGFjaG1lbnRzKCkpXG4gICAgKS5zdWJzY3JpYmUoc3RhdGUgPT4ge1xuICAgICAgY29uc3QgY2xhc3NMaXN0ID0gb3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSAnbWF0LXNuYWNrLWJhci1oYW5kc2V0JztcbiAgICAgIHN0YXRlLm1hdGNoZXMgPyBjbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkgOiBjbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9hbmltYXRlU25hY2tCYXIoc25hY2tCYXJSZWYsIGNvbmZpZyk7XG4gICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYgPSBzbmFja0JhclJlZjtcbiAgICByZXR1cm4gdGhpcy5fb3BlbmVkU25hY2tCYXJSZWY7XG4gIH1cblxuICAvKiogQW5pbWF0ZXMgdGhlIG9sZCBzbmFjayBiYXIgb3V0IGFuZCB0aGUgbmV3IG9uZSBpbi4gKi9cbiAgcHJpdmF0ZSBfYW5pbWF0ZVNuYWNrQmFyKHNuYWNrQmFyUmVmOiBNYXRTbmFja0JhclJlZjxhbnk+LCBjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnKSB7XG4gICAgLy8gV2hlbiB0aGUgc25hY2tiYXIgaXMgZGlzbWlzc2VkLCBjbGVhciB0aGUgcmVmZXJlbmNlIHRvIGl0LlxuICAgIHNuYWNrQmFyUmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIENsZWFyIHRoZSBzbmFja2JhciByZWYgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiByZXBsYWNlZCBieSBhIG5ld2VyIHNuYWNrYmFyLlxuICAgICAgaWYgKHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmID09IHNuYWNrQmFyUmVmKSB7XG4gICAgICAgIHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5hbm5vdW5jZW1lbnRNZXNzYWdlKSB7XG4gICAgICAgIHRoaXMuX2xpdmUuY2xlYXIoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9vcGVuZWRTbmFja0JhclJlZikge1xuICAgICAgLy8gSWYgYSBzbmFjayBiYXIgaXMgYWxyZWFkeSBpbiB2aWV3LCBkaXNtaXNzIGl0IGFuZCBlbnRlciB0aGVcbiAgICAgIC8vIG5ldyBzbmFjayBiYXIgYWZ0ZXIgZXhpdCBhbmltYXRpb24gaXMgY29tcGxldGUuXG4gICAgICB0aGlzLl9vcGVuZWRTbmFja0JhclJlZi5hZnRlckRpc21pc3NlZCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHNuYWNrQmFyUmVmLmNvbnRhaW5lckluc3RhbmNlLmVudGVyKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmLmRpc21pc3MoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgbm8gc25hY2sgYmFyIGlzIGluIHZpZXcsIGVudGVyIHRoZSBuZXcgc25hY2sgYmFyLlxuICAgICAgc25hY2tCYXJSZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKTtcbiAgICB9XG5cbiAgICAvLyBJZiBhIGRpc21pc3MgdGltZW91dCBpcyBwcm92aWRlZCwgc2V0IHVwIGRpc21pc3MgYmFzZWQgb24gYWZ0ZXIgdGhlIHNuYWNrYmFyIGlzIG9wZW5lZC5cbiAgICBpZiAoY29uZmlnLmR1cmF0aW9uICYmIGNvbmZpZy5kdXJhdGlvbiA+IDApIHtcbiAgICAgIHNuYWNrQmFyUmVmLmFmdGVyT3BlbmVkKCkuc3Vic2NyaWJlKCgpID0+IHNuYWNrQmFyUmVmLl9kaXNtaXNzQWZ0ZXIoY29uZmlnLmR1cmF0aW9uISkpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSkge1xuICAgICAgdGhpcy5fbGl2ZS5hbm5vdW5jZShjb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSwgY29uZmlnLnBvbGl0ZW5lc3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG92ZXJsYXkgYW5kIHBsYWNlcyBpdCBpbiB0aGUgY29ycmVjdCBsb2NhdGlvbi5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgdXNlci1zcGVjaWZpZWQgc25hY2sgYmFyIGNvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkoY29uZmlnOiBNYXRTbmFja0JhckNvbmZpZyk6IE92ZXJsYXlSZWYge1xuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSBuZXcgT3ZlcmxheUNvbmZpZygpO1xuICAgIG92ZXJsYXlDb25maWcuZGlyZWN0aW9uID0gY29uZmlnLmRpcmVjdGlvbjtcblxuICAgIGxldCBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpLmdsb2JhbCgpO1xuICAgIC8vIFNldCBob3Jpem9udGFsIHBvc2l0aW9uLlxuICAgIGNvbnN0IGlzUnRsID0gY29uZmlnLmRpcmVjdGlvbiA9PT0gJ3J0bCc7XG4gICAgY29uc3QgaXNMZWZ0ID0gKFxuICAgICAgY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ2xlZnQnIHx8XG4gICAgICAoY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ3N0YXJ0JyAmJiAhaXNSdGwpIHx8XG4gICAgICAoY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ2VuZCcgJiYgaXNSdGwpKTtcbiAgICBjb25zdCBpc1JpZ2h0ID0gIWlzTGVmdCAmJiBjb25maWcuaG9yaXpvbnRhbFBvc2l0aW9uICE9PSAnY2VudGVyJztcbiAgICBpZiAoaXNMZWZ0KSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LmxlZnQoJzAnKTtcbiAgICB9IGVsc2UgaWYgKGlzUmlnaHQpIHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3kucmlnaHQoJzAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS5jZW50ZXJIb3Jpem9udGFsbHkoKTtcbiAgICB9XG4gICAgLy8gU2V0IGhvcml6b250YWwgcG9zaXRpb24uXG4gICAgaWYgKGNvbmZpZy52ZXJ0aWNhbFBvc2l0aW9uID09PSAndG9wJykge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS50b3AoJzAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS5ib3R0b20oJzAnKTtcbiAgICB9XG5cbiAgICBvdmVybGF5Q29uZmlnLnBvc2l0aW9uU3RyYXRlZ3kgPSBwb3NpdGlvblN0cmF0ZWd5O1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5LmNyZWF0ZShvdmVybGF5Q29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluamVjdG9yIHRvIGJlIHVzZWQgaW5zaWRlIG9mIGEgc25hY2sgYmFyIGNvbXBvbmVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgdGhhdCB3YXMgdXNlZCB0byBjcmVhdGUgdGhlIHNuYWNrIGJhci5cbiAgICogQHBhcmFtIHNuYWNrQmFyUmVmIFJlZmVyZW5jZSB0byB0aGUgc25hY2sgYmFyLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlSW5qZWN0b3I8VD4oXG4gICAgICBjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnLFxuICAgICAgc25hY2tCYXJSZWY6IE1hdFNuYWNrQmFyUmVmPFQ+KTogUG9ydGFsSW5qZWN0b3Ige1xuXG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuXG4gICAgcmV0dXJuIG5ldyBQb3J0YWxJbmplY3Rvcih1c2VySW5qZWN0b3IgfHwgdGhpcy5faW5qZWN0b3IsIG5ldyBXZWFrTWFwPGFueSwgYW55PihbXG4gICAgICBbTWF0U25hY2tCYXJSZWYsIHNuYWNrQmFyUmVmXSxcbiAgICAgIFtNQVRfU05BQ0tfQkFSX0RBVEEsIGNvbmZpZy5kYXRhXVxuICAgIF0pKTtcbiAgfVxufVxuIl19