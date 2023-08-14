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
import { Inject, Injectable, InjectionToken, Injector, Optional, SkipSelf, TemplateRef, } from '@angular/core';
import { MatSnackBarModule } from './module';
import { SimpleSnackBar } from './simple-snack-bar';
import { MatSnackBarContainer } from './snack-bar-container';
import { MAT_SNACK_BAR_DATA, MatSnackBarConfig } from './snack-bar-config';
import { MatSnackBarRef } from './snack-bar-ref';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/cdk/a11y";
import * as i3 from "@angular/cdk/layout";
import * as i4 from "./snack-bar-config";
/** @docs-private */
export function MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY() {
    return new MatSnackBarConfig();
}
/** Injection token that can be used to specify default snack bar. */
export const MAT_SNACK_BAR_DEFAULT_OPTIONS = new InjectionToken('mat-snack-bar-default-options', {
    providedIn: 'root',
    factory: MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY,
});
/**
 * Service to dispatch Material Design snack bar messages.
 */
export class MatSnackBar {
    /** Reference to the currently opened snackbar at *any* level. */
    get _openedSnackBarRef() {
        const parent = this._parentSnackBar;
        return parent ? parent._openedSnackBarRef : this._snackBarRefAtThisLevel;
    }
    set _openedSnackBarRef(value) {
        if (this._parentSnackBar) {
            this._parentSnackBar._openedSnackBarRef = value;
        }
        else {
            this._snackBarRefAtThisLevel = value;
        }
    }
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
        /** The component that should be rendered as the snack bar's simple component. */
        this.simpleSnackBarComponent = SimpleSnackBar;
        /** The container component that attaches the provided template or component. */
        this.snackBarContainerComponent = MatSnackBarContainer;
        /** The CSS class to apply for handset mode. */
        this.handsetCssClass = 'mat-mdc-snack-bar-handset';
    }
    /**
     * Creates and dispatches a snack bar with a custom component for the content, removing any
     * currently opened snack bars.
     *
     * @param component Component to be instantiated.
     * @param config Extra configuration for the snack bar.
     */
    openFromComponent(component, config) {
        return this._attach(component, config);
    }
    /**
     * Creates and dispatches a snack bar with a custom template for the content, removing any
     * currently opened snack bars.
     *
     * @param template Template to be instantiated.
     * @param config Extra configuration for the snack bar.
     */
    openFromTemplate(template, config) {
        return this._attach(template, config);
    }
    /**
     * Opens a snackbar with a message and an optional action.
     * @param message The message to show in the snackbar.
     * @param action The label for the snackbar action.
     * @param config Additional configuration options for the snackbar.
     */
    open(message, action = '', config) {
        const _config = { ...this._defaultConfig, ...config };
        // Since the user doesn't have access to the component, we can
        // override the data to pass in our own message and action.
        _config.data = { message, action };
        // Since the snack bar has `role="alert"`, we don't
        // want to announce the same message twice.
        if (_config.announcementMessage === message) {
            _config.announcementMessage = undefined;
        }
        return this.openFromComponent(this.simpleSnackBarComponent, _config);
    }
    /**
     * Dismisses the currently-visible snack bar.
     */
    dismiss() {
        if (this._openedSnackBarRef) {
            this._openedSnackBarRef.dismiss();
        }
    }
    ngOnDestroy() {
        // Only dismiss the snack bar at the current level on destroy.
        if (this._snackBarRefAtThisLevel) {
            this._snackBarRefAtThisLevel.dismiss();
        }
    }
    /**
     * Attaches the snack bar container component to the overlay.
     */
    _attachSnackBarContainer(overlayRef, config) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const injector = Injector.create({
            parent: userInjector || this._injector,
            providers: [{ provide: MatSnackBarConfig, useValue: config }],
        });
        const containerPortal = new ComponentPortal(this.snackBarContainerComponent, config.viewContainerRef, injector);
        const containerRef = overlayRef.attach(containerPortal);
        containerRef.instance.snackBarConfig = config;
        return containerRef.instance;
    }
    /**
     * Places a new component or a template as the content of the snack bar container.
     */
    _attach(content, userConfig) {
        const config = { ...new MatSnackBarConfig(), ...this._defaultConfig, ...userConfig };
        const overlayRef = this._createOverlay(config);
        const container = this._attachSnackBarContainer(overlayRef, config);
        const snackBarRef = new MatSnackBarRef(container, overlayRef);
        if (content instanceof TemplateRef) {
            const portal = new TemplatePortal(content, null, {
                $implicit: config.data,
                snackBarRef,
            });
            snackBarRef.instance = container.attachTemplatePortal(portal);
        }
        else {
            const injector = this._createInjector(config, snackBarRef);
            const portal = new ComponentPortal(content, undefined, injector);
            const contentRef = container.attachComponentPortal(portal);
            // We can't pass this via the injector, because the injector is created earlier.
            snackBarRef.instance = contentRef.instance;
        }
        // Subscribe to the breakpoint observer and attach the mat-snack-bar-handset class as
        // appropriate. This class is applied to the overlay element because the overlay must expand to
        // fill the width of the screen for full width snackbars.
        this._breakpointObserver
            .observe(Breakpoints.HandsetPortrait)
            .pipe(takeUntil(overlayRef.detachments()))
            .subscribe(state => {
            overlayRef.overlayElement.classList.toggle(this.handsetCssClass, state.matches);
        });
        if (config.announcementMessage) {
            // Wait until the snack bar contents have been announced then deliver this message.
            container._onAnnounce.subscribe(() => {
                this._live.announce(config.announcementMessage, config.politeness);
            });
        }
        this._animateSnackBar(snackBarRef, config);
        this._openedSnackBarRef = snackBarRef;
        return this._openedSnackBarRef;
    }
    /** Animates the old snack bar out and the new one in. */
    _animateSnackBar(snackBarRef, config) {
        // When the snackbar is dismissed, clear the reference to it.
        snackBarRef.afterDismissed().subscribe(() => {
            // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
            if (this._openedSnackBarRef == snackBarRef) {
                this._openedSnackBarRef = null;
            }
            if (config.announcementMessage) {
                this._live.clear();
            }
        });
        if (this._openedSnackBarRef) {
            // If a snack bar is already in view, dismiss it and enter the
            // new snack bar after exit animation is complete.
            this._openedSnackBarRef.afterDismissed().subscribe(() => {
                snackBarRef.containerInstance.enter();
            });
            this._openedSnackBarRef.dismiss();
        }
        else {
            // If no snack bar is in view, enter the new snack bar.
            snackBarRef.containerInstance.enter();
        }
        // If a dismiss timeout is provided, set up dismiss based on after the snackbar is opened.
        if (config.duration && config.duration > 0) {
            snackBarRef.afterOpened().subscribe(() => snackBarRef._dismissAfter(config.duration));
        }
    }
    /**
     * Creates a new overlay and places it in the correct location.
     * @param config The user-specified snack bar config.
     */
    _createOverlay(config) {
        const overlayConfig = new OverlayConfig();
        overlayConfig.direction = config.direction;
        let positionStrategy = this._overlay.position().global();
        // Set horizontal position.
        const isRtl = config.direction === 'rtl';
        const isLeft = config.horizontalPosition === 'left' ||
            (config.horizontalPosition === 'start' && !isRtl) ||
            (config.horizontalPosition === 'end' && isRtl);
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
     * @param config Config that was used to create the snack bar.
     * @param snackBarRef Reference to the snack bar.
     */
    _createInjector(config, snackBarRef) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        return Injector.create({
            parent: userInjector || this._injector,
            providers: [
                { provide: MatSnackBarRef, useValue: snackBarRef },
                { provide: MAT_SNACK_BAR_DATA, useValue: config.data },
            ],
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatSnackBar, deps: [{ token: i1.Overlay }, { token: i2.LiveAnnouncer }, { token: i0.Injector }, { token: i3.BreakpointObserver }, { token: MatSnackBar, optional: true, skipSelf: true }, { token: MAT_SNACK_BAR_DEFAULT_OPTIONS }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatSnackBar, providedIn: MatSnackBarModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatSnackBar, decorators: [{
            type: Injectable,
            args: [{ providedIn: MatSnackBarModule }]
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i2.LiveAnnouncer }, { type: i0.Injector }, { type: i3.BreakpointObserver }, { type: MatSnackBar, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i4.MatSnackBarConfig, decorators: [{
                    type: Inject,
                    args: [MAT_SNACK_BAR_DEFAULT_OPTIONS]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NuYWNrLWJhci9zbmFjay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxXQUFXLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRSxPQUFPLEVBQWdCLE9BQU8sRUFBRSxhQUFhLEVBQWEsTUFBTSxzQkFBc0IsQ0FBQztBQUN2RixPQUFPLEVBR0wsTUFBTSxFQUNOLFVBQVUsRUFDVixjQUFjLEVBQ2QsUUFBUSxFQUVSLFFBQVEsRUFDUixRQUFRLEVBQ1IsV0FBVyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUMzQyxPQUFPLEVBQUMsY0FBYyxFQUFtQixNQUFNLG9CQUFvQixDQUFDO0FBQ3BFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3pFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3BFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7O0FBRXpDLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUscUNBQXFDO0lBQ25ELE9BQU8sSUFBSSxpQkFBaUIsRUFBRSxDQUFDO0FBQ2pDLENBQUM7QUFFRCxxRUFBcUU7QUFDckUsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQUcsSUFBSSxjQUFjLENBQzdELCtCQUErQixFQUMvQjtJQUNF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LE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLGVBQWUsQ0FBSSxNQUF5QixFQUFFLFdBQThCO1FBQ2xGLE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBSSxNQUFNLENBQUMsZ0JBQWdCLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztRQUUzRixPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDckIsTUFBTSxFQUFFLFlBQVksSUFBSSxJQUFJLENBQUMsU0FBUztZQUN0QyxTQUFTLEVBQUU7Z0JBQ1QsRUFBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUM7Z0JBQ2hELEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFDO2FBQ3JEO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs4R0F4UVUsV0FBVyx3TEFxQ1osNkJBQTZCO2tIQXJDNUIsV0FBVyxjQURDLGlCQUFpQjs7MkZBQzdCLFdBQVc7a0JBRHZCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUM7OzBCQXFDdEMsUUFBUTs7MEJBQUksUUFBUTs7MEJBQ3BCLE1BQU07MkJBQUMsNkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TGl2ZUFubm91bmNlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCcmVha3BvaW50T2JzZXJ2ZXIsIEJyZWFrcG9pbnRzfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7Q29tcG9uZW50VHlwZSwgT3ZlcmxheSwgT3ZlcmxheUNvbmZpZywgT3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50UmVmLFxuICBFbWJlZGRlZFZpZXdSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBTa2lwU2VsZixcbiAgVGVtcGxhdGVSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRTbmFja0Jhck1vZHVsZX0gZnJvbSAnLi9tb2R1bGUnO1xuaW1wb3J0IHtTaW1wbGVTbmFja0JhciwgVGV4dE9ubHlTbmFja0Jhcn0gZnJvbSAnLi9zaW1wbGUtc25hY2stYmFyJztcbmltcG9ydCB7TWF0U25hY2tCYXJDb250YWluZXJ9IGZyb20gJy4vc25hY2stYmFyLWNvbnRhaW5lcic7XG5pbXBvcnQge01BVF9TTkFDS19CQVJfREFUQSwgTWF0U25hY2tCYXJDb25maWd9IGZyb20gJy4vc25hY2stYmFyLWNvbmZpZyc7XG5pbXBvcnQge01hdFNuYWNrQmFyUmVmfSBmcm9tICcuL3NuYWNrLWJhci1yZWYnO1xuaW1wb3J0IHtDb21wb25lbnRQb3J0YWwsIFRlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1NOQUNLX0JBUl9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSgpOiBNYXRTbmFja0JhckNvbmZpZyB7XG4gIHJldHVybiBuZXcgTWF0U25hY2tCYXJDb25maWcoKTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgZGVmYXVsdCBzbmFjayBiYXIuICovXG5leHBvcnQgY29uc3QgTUFUX1NOQUNLX0JBUl9ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0U25hY2tCYXJDb25maWc+KFxuICAnbWF0LXNuYWNrLWJhci1kZWZhdWx0LW9wdGlvbnMnLFxuICB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6IE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlksXG4gIH0sXG4pO1xuXG4vKipcbiAqIFNlcnZpY2UgdG8gZGlzcGF0Y2ggTWF0ZXJpYWwgRGVzaWduIHNuYWNrIGJhciBtZXNzYWdlcy5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46IE1hdFNuYWNrQmFyTW9kdWxlfSlcbmV4cG9ydCBjbGFzcyBNYXRTbmFja0JhciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgc25hY2sgYmFyIGluIHRoZSB2aWV3ICphdCB0aGlzIGxldmVsKiAoaW4gdGhlIEFuZ3VsYXIgaW5qZWN0b3IgdHJlZSkuXG4gICAqIElmIHRoZXJlIGlzIGEgcGFyZW50IHNuYWNrLWJhciBzZXJ2aWNlLCBhbGwgb3BlcmF0aW9ucyBzaG91bGQgZGVsZWdhdGUgdG8gdGhhdCBwYXJlbnRcbiAgICogdmlhIGBfb3BlbmVkU25hY2tCYXJSZWZgLlxuICAgKi9cbiAgcHJpdmF0ZSBfc25hY2tCYXJSZWZBdFRoaXNMZXZlbDogTWF0U25hY2tCYXJSZWY8YW55PiB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBUaGUgY29tcG9uZW50IHRoYXQgc2hvdWxkIGJlIHJlbmRlcmVkIGFzIHRoZSBzbmFjayBiYXIncyBzaW1wbGUgY29tcG9uZW50LiAqL1xuICBzaW1wbGVTbmFja0JhckNvbXBvbmVudCA9IFNpbXBsZVNuYWNrQmFyO1xuXG4gIC8qKiBUaGUgY29udGFpbmVyIGNvbXBvbmVudCB0aGF0IGF0dGFjaGVzIHRoZSBwcm92aWRlZCB0ZW1wbGF0ZSBvciBjb21wb25lbnQuICovXG4gIHNuYWNrQmFyQ29udGFpbmVyQ29tcG9uZW50ID0gTWF0U25hY2tCYXJDb250YWluZXI7XG5cbiAgLyoqIFRoZSBDU1MgY2xhc3MgdG8gYXBwbHkgZm9yIGhhbmRzZXQgbW9kZS4gKi9cbiAgaGFuZHNldENzc0NsYXNzID0gJ21hdC1tZGMtc25hY2stYmFyLWhhbmRzZXQnO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnRseSBvcGVuZWQgc25hY2tiYXIgYXQgKmFueSogbGV2ZWwuICovXG4gIGdldCBfb3BlbmVkU25hY2tCYXJSZWYoKTogTWF0U25hY2tCYXJSZWY8YW55PiB8IG51bGwge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX3BhcmVudFNuYWNrQmFyO1xuICAgIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuX29wZW5lZFNuYWNrQmFyUmVmIDogdGhpcy5fc25hY2tCYXJSZWZBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIHNldCBfb3BlbmVkU25hY2tCYXJSZWYodmFsdWU6IE1hdFNuYWNrQmFyUmVmPGFueT4gfCBudWxsKSB7XG4gICAgaWYgKHRoaXMuX3BhcmVudFNuYWNrQmFyKSB7XG4gICAgICB0aGlzLl9wYXJlbnRTbmFja0Jhci5fb3BlbmVkU25hY2tCYXJSZWYgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc25hY2tCYXJSZWZBdFRoaXNMZXZlbCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgcHJpdmF0ZSBfbGl2ZTogTGl2ZUFubm91bmNlcixcbiAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJpdmF0ZSBfYnJlYWtwb2ludE9ic2VydmVyOiBCcmVha3BvaW50T2JzZXJ2ZXIsXG4gICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcHJpdmF0ZSBfcGFyZW50U25hY2tCYXI6IE1hdFNuYWNrQmFyLFxuICAgIEBJbmplY3QoTUFUX1NOQUNLX0JBUl9ERUZBVUxUX09QVElPTlMpIHByaXZhdGUgX2RlZmF1bHRDb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnLFxuICApIHt9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW5kIGRpc3BhdGNoZXMgYSBzbmFjayBiYXIgd2l0aCBhIGN1c3RvbSBjb21wb25lbnQgZm9yIHRoZSBjb250ZW50LCByZW1vdmluZyBhbnlcbiAgICogY3VycmVudGx5IG9wZW5lZCBzbmFjayBiYXJzLlxuICAgKlxuICAgKiBAcGFyYW0gY29tcG9uZW50IENvbXBvbmVudCB0byBiZSBpbnN0YW50aWF0ZWQuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNuYWNrIGJhci5cbiAgICovXG4gIG9wZW5Gcm9tQ29tcG9uZW50PFQsIEQgPSBhbnk+KFxuICAgIGNvbXBvbmVudDogQ29tcG9uZW50VHlwZTxUPixcbiAgICBjb25maWc/OiBNYXRTbmFja0JhckNvbmZpZzxEPixcbiAgKTogTWF0U25hY2tCYXJSZWY8VD4ge1xuICAgIHJldHVybiB0aGlzLl9hdHRhY2goY29tcG9uZW50LCBjb25maWcpIGFzIE1hdFNuYWNrQmFyUmVmPFQ+O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW5kIGRpc3BhdGNoZXMgYSBzbmFjayBiYXIgd2l0aCBhIGN1c3RvbSB0ZW1wbGF0ZSBmb3IgdGhlIGNvbnRlbnQsIHJlbW92aW5nIGFueVxuICAgKiBjdXJyZW50bHkgb3BlbmVkIHNuYWNrIGJhcnMuXG4gICAqXG4gICAqIEBwYXJhbSB0ZW1wbGF0ZSBUZW1wbGF0ZSB0byBiZSBpbnN0YW50aWF0ZWQuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNuYWNrIGJhci5cbiAgICovXG4gIG9wZW5Gcm9tVGVtcGxhdGUoXG4gICAgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4sXG4gICAgY29uZmlnPzogTWF0U25hY2tCYXJDb25maWcsXG4gICk6IE1hdFNuYWNrQmFyUmVmPEVtYmVkZGVkVmlld1JlZjxhbnk+PiB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dGFjaCh0ZW1wbGF0ZSwgY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyBhIHNuYWNrYmFyIHdpdGggYSBtZXNzYWdlIGFuZCBhbiBvcHRpb25hbCBhY3Rpb24uXG4gICAqIEBwYXJhbSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIHNob3cgaW4gdGhlIHNuYWNrYmFyLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBsYWJlbCBmb3IgdGhlIHNuYWNrYmFyIGFjdGlvbi5cbiAgICogQHBhcmFtIGNvbmZpZyBBZGRpdGlvbmFsIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgdGhlIHNuYWNrYmFyLlxuICAgKi9cbiAgb3BlbihcbiAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgYWN0aW9uOiBzdHJpbmcgPSAnJyxcbiAgICBjb25maWc/OiBNYXRTbmFja0JhckNvbmZpZyxcbiAgKTogTWF0U25hY2tCYXJSZWY8VGV4dE9ubHlTbmFja0Jhcj4ge1xuICAgIGNvbnN0IF9jb25maWcgPSB7Li4udGhpcy5fZGVmYXVsdENvbmZpZywgLi4uY29uZmlnfTtcblxuICAgIC8vIFNpbmNlIHRoZSB1c2VyIGRvZXNuJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhlIGNvbXBvbmVudCwgd2UgY2FuXG4gICAgLy8gb3ZlcnJpZGUgdGhlIGRhdGEgdG8gcGFzcyBpbiBvdXIgb3duIG1lc3NhZ2UgYW5kIGFjdGlvbi5cbiAgICBfY29uZmlnLmRhdGEgPSB7bWVzc2FnZSwgYWN0aW9ufTtcblxuICAgIC8vIFNpbmNlIHRoZSBzbmFjayBiYXIgaGFzIGByb2xlPVwiYWxlcnRcImAsIHdlIGRvbid0XG4gICAgLy8gd2FudCB0byBhbm5vdW5jZSB0aGUgc2FtZSBtZXNzYWdlIHR3aWNlLlxuICAgIGlmIChfY29uZmlnLmFubm91bmNlbWVudE1lc3NhZ2UgPT09IG1lc3NhZ2UpIHtcbiAgICAgIF9jb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vcGVuRnJvbUNvbXBvbmVudCh0aGlzLnNpbXBsZVNuYWNrQmFyQ29tcG9uZW50LCBfY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIGN1cnJlbnRseS12aXNpYmxlIHNuYWNrIGJhci5cbiAgICovXG4gIGRpc21pc3MoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmKSB7XG4gICAgICB0aGlzLl9vcGVuZWRTbmFja0JhclJlZi5kaXNtaXNzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy8gT25seSBkaXNtaXNzIHRoZSBzbmFjayBiYXIgYXQgdGhlIGN1cnJlbnQgbGV2ZWwgb24gZGVzdHJveS5cbiAgICBpZiAodGhpcy5fc25hY2tCYXJSZWZBdFRoaXNMZXZlbCkge1xuICAgICAgdGhpcy5fc25hY2tCYXJSZWZBdFRoaXNMZXZlbC5kaXNtaXNzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHRoZSBzbmFjayBiYXIgY29udGFpbmVyIGNvbXBvbmVudCB0byB0aGUgb3ZlcmxheS5cbiAgICovXG4gIHByaXZhdGUgX2F0dGFjaFNuYWNrQmFyQ29udGFpbmVyKFxuICAgIG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgY29uZmlnOiBNYXRTbmFja0JhckNvbmZpZyxcbiAgKTogTWF0U25hY2tCYXJDb250YWluZXIge1xuICAgIGNvbnN0IHVzZXJJbmplY3RvciA9IGNvbmZpZyAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZiAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZi5pbmplY3RvcjtcbiAgICBjb25zdCBpbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRTbmFja0JhckNvbmZpZywgdXNlVmFsdWU6IGNvbmZpZ31dLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChcbiAgICAgIHRoaXMuc25hY2tCYXJDb250YWluZXJDb21wb25lbnQsXG4gICAgICBjb25maWcudmlld0NvbnRhaW5lclJlZixcbiAgICAgIGluamVjdG9yLFxuICAgICk7XG4gICAgY29uc3QgY29udGFpbmVyUmVmOiBDb21wb25lbnRSZWY8TWF0U25hY2tCYXJDb250YWluZXI+ID0gb3ZlcmxheVJlZi5hdHRhY2goY29udGFpbmVyUG9ydGFsKTtcbiAgICBjb250YWluZXJSZWYuaW5zdGFuY2Uuc25hY2tCYXJDb25maWcgPSBjb25maWc7XG4gICAgcmV0dXJuIGNvbnRhaW5lclJlZi5pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbGFjZXMgYSBuZXcgY29tcG9uZW50IG9yIGEgdGVtcGxhdGUgYXMgdGhlIGNvbnRlbnQgb2YgdGhlIHNuYWNrIGJhciBjb250YWluZXIuXG4gICAqL1xuICBwcml2YXRlIF9hdHRhY2g8VD4oXG4gICAgY29udGVudDogQ29tcG9uZW50VHlwZTxUPiB8IFRlbXBsYXRlUmVmPFQ+LFxuICAgIHVzZXJDb25maWc/OiBNYXRTbmFja0JhckNvbmZpZyxcbiAgKTogTWF0U25hY2tCYXJSZWY8VCB8IEVtYmVkZGVkVmlld1JlZjxhbnk+PiB7XG4gICAgY29uc3QgY29uZmlnID0gey4uLm5ldyBNYXRTbmFja0JhckNvbmZpZygpLCAuLi50aGlzLl9kZWZhdWx0Q29uZmlnLCAuLi51c2VyQ29uZmlnfTtcbiAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5fY3JlYXRlT3ZlcmxheShjb25maWcpO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2F0dGFjaFNuYWNrQmFyQ29udGFpbmVyKG92ZXJsYXlSZWYsIGNvbmZpZyk7XG4gICAgY29uc3Qgc25hY2tCYXJSZWYgPSBuZXcgTWF0U25hY2tCYXJSZWY8VCB8IEVtYmVkZGVkVmlld1JlZjxhbnk+Pihjb250YWluZXIsIG92ZXJsYXlSZWYpO1xuXG4gICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZikge1xuICAgICAgY29uc3QgcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKGNvbnRlbnQsIG51bGwhLCB7XG4gICAgICAgICRpbXBsaWNpdDogY29uZmlnLmRhdGEsXG4gICAgICAgIHNuYWNrQmFyUmVmLFxuICAgICAgfSBhcyBhbnkpO1xuXG4gICAgICBzbmFja0JhclJlZi5pbnN0YW5jZSA9IGNvbnRhaW5lci5hdHRhY2hUZW1wbGF0ZVBvcnRhbChwb3J0YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbmplY3RvciA9IHRoaXMuX2NyZWF0ZUluamVjdG9yKGNvbmZpZywgc25hY2tCYXJSZWYpO1xuICAgICAgY29uc3QgcG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChjb250ZW50LCB1bmRlZmluZWQsIGluamVjdG9yKTtcbiAgICAgIGNvbnN0IGNvbnRlbnRSZWYgPSBjb250YWluZXIuYXR0YWNoQ29tcG9uZW50UG9ydGFsPFQ+KHBvcnRhbCk7XG5cbiAgICAgIC8vIFdlIGNhbid0IHBhc3MgdGhpcyB2aWEgdGhlIGluamVjdG9yLCBiZWNhdXNlIHRoZSBpbmplY3RvciBpcyBjcmVhdGVkIGVhcmxpZXIuXG4gICAgICBzbmFja0JhclJlZi5pbnN0YW5jZSA9IGNvbnRlbnRSZWYuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgLy8gU3Vic2NyaWJlIHRvIHRoZSBicmVha3BvaW50IG9ic2VydmVyIGFuZCBhdHRhY2ggdGhlIG1hdC1zbmFjay1iYXItaGFuZHNldCBjbGFzcyBhc1xuICAgIC8vIGFwcHJvcHJpYXRlLiBUaGlzIGNsYXNzIGlzIGFwcGxpZWQgdG8gdGhlIG92ZXJsYXkgZWxlbWVudCBiZWNhdXNlIHRoZSBvdmVybGF5IG11c3QgZXhwYW5kIHRvXG4gICAgLy8gZmlsbCB0aGUgd2lkdGggb2YgdGhlIHNjcmVlbiBmb3IgZnVsbCB3aWR0aCBzbmFja2JhcnMuXG4gICAgdGhpcy5fYnJlYWtwb2ludE9ic2VydmVyXG4gICAgICAub2JzZXJ2ZShCcmVha3BvaW50cy5IYW5kc2V0UG9ydHJhaXQpXG4gICAgICAucGlwZSh0YWtlVW50aWwob3ZlcmxheVJlZi5kZXRhY2htZW50cygpKSlcbiAgICAgIC5zdWJzY3JpYmUoc3RhdGUgPT4ge1xuICAgICAgICBvdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUodGhpcy5oYW5kc2V0Q3NzQ2xhc3MsIHN0YXRlLm1hdGNoZXMpO1xuICAgICAgfSk7XG5cbiAgICBpZiAoY29uZmlnLmFubm91bmNlbWVudE1lc3NhZ2UpIHtcbiAgICAgIC8vIFdhaXQgdW50aWwgdGhlIHNuYWNrIGJhciBjb250ZW50cyBoYXZlIGJlZW4gYW5ub3VuY2VkIHRoZW4gZGVsaXZlciB0aGlzIG1lc3NhZ2UuXG4gICAgICBjb250YWluZXIuX29uQW5ub3VuY2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fbGl2ZS5hbm5vdW5jZShjb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSEsIGNvbmZpZy5wb2xpdGVuZXNzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX2FuaW1hdGVTbmFja0JhcihzbmFja0JhclJlZiwgY29uZmlnKTtcbiAgICB0aGlzLl9vcGVuZWRTbmFja0JhclJlZiA9IHNuYWNrQmFyUmVmO1xuICAgIHJldHVybiB0aGlzLl9vcGVuZWRTbmFja0JhclJlZjtcbiAgfVxuXG4gIC8qKiBBbmltYXRlcyB0aGUgb2xkIHNuYWNrIGJhciBvdXQgYW5kIHRoZSBuZXcgb25lIGluLiAqL1xuICBwcml2YXRlIF9hbmltYXRlU25hY2tCYXIoc25hY2tCYXJSZWY6IE1hdFNuYWNrQmFyUmVmPGFueT4sIGNvbmZpZzogTWF0U25hY2tCYXJDb25maWcpIHtcbiAgICAvLyBXaGVuIHRoZSBzbmFja2JhciBpcyBkaXNtaXNzZWQsIGNsZWFyIHRoZSByZWZlcmVuY2UgdG8gaXQuXG4gICAgc25hY2tCYXJSZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gQ2xlYXIgdGhlIHNuYWNrYmFyIHJlZiBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuIHJlcGxhY2VkIGJ5IGEgbmV3ZXIgc25hY2tiYXIuXG4gICAgICBpZiAodGhpcy5fb3BlbmVkU25hY2tCYXJSZWYgPT0gc25hY2tCYXJSZWYpIHtcbiAgICAgICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLmFubm91bmNlbWVudE1lc3NhZ2UpIHtcbiAgICAgICAgdGhpcy5fbGl2ZS5jbGVhcigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmKSB7XG4gICAgICAvLyBJZiBhIHNuYWNrIGJhciBpcyBhbHJlYWR5IGluIHZpZXcsIGRpc21pc3MgaXQgYW5kIGVudGVyIHRoZVxuICAgICAgLy8gbmV3IHNuYWNrIGJhciBhZnRlciBleGl0IGFuaW1hdGlvbiBpcyBjb21wbGV0ZS5cbiAgICAgIHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgc25hY2tCYXJSZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYuZGlzbWlzcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBubyBzbmFjayBiYXIgaXMgaW4gdmlldywgZW50ZXIgdGhlIG5ldyBzbmFjayBiYXIuXG4gICAgICBzbmFja0JhclJlZi5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpO1xuICAgIH1cblxuICAgIC8vIElmIGEgZGlzbWlzcyB0aW1lb3V0IGlzIHByb3ZpZGVkLCBzZXQgdXAgZGlzbWlzcyBiYXNlZCBvbiBhZnRlciB0aGUgc25hY2tiYXIgaXMgb3BlbmVkLlxuICAgIGlmIChjb25maWcuZHVyYXRpb24gJiYgY29uZmlnLmR1cmF0aW9uID4gMCkge1xuICAgICAgc25hY2tCYXJSZWYuYWZ0ZXJPcGVuZWQoKS5zdWJzY3JpYmUoKCkgPT4gc25hY2tCYXJSZWYuX2Rpc21pc3NBZnRlcihjb25maWcuZHVyYXRpb24hKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgb3ZlcmxheSBhbmQgcGxhY2VzIGl0IGluIHRoZSBjb3JyZWN0IGxvY2F0aW9uLlxuICAgKiBAcGFyYW0gY29uZmlnIFRoZSB1c2VyLXNwZWNpZmllZCBzbmFjayBiYXIgY29uZmlnLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlT3ZlcmxheShjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnKTogT3ZlcmxheVJlZiB7XG4gICAgY29uc3Qgb3ZlcmxheUNvbmZpZyA9IG5ldyBPdmVybGF5Q29uZmlnKCk7XG4gICAgb3ZlcmxheUNvbmZpZy5kaXJlY3Rpb24gPSBjb25maWcuZGlyZWN0aW9uO1xuXG4gICAgbGV0IHBvc2l0aW9uU3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCk7XG4gICAgLy8gU2V0IGhvcml6b250YWwgcG9zaXRpb24uXG4gICAgY29uc3QgaXNSdGwgPSBjb25maWcuZGlyZWN0aW9uID09PSAncnRsJztcbiAgICBjb25zdCBpc0xlZnQgPVxuICAgICAgY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ2xlZnQnIHx8XG4gICAgICAoY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ3N0YXJ0JyAmJiAhaXNSdGwpIHx8XG4gICAgICAoY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ2VuZCcgJiYgaXNSdGwpO1xuICAgIGNvbnN0IGlzUmlnaHQgPSAhaXNMZWZ0ICYmIGNvbmZpZy5ob3Jpem9udGFsUG9zaXRpb24gIT09ICdjZW50ZXInO1xuICAgIGlmIChpc0xlZnQpIHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3kubGVmdCgnMCcpO1xuICAgIH0gZWxzZSBpZiAoaXNSaWdodCkge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS5yaWdodCgnMCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LmNlbnRlckhvcml6b250YWxseSgpO1xuICAgIH1cbiAgICAvLyBTZXQgaG9yaXpvbnRhbCBwb3NpdGlvbi5cbiAgICBpZiAoY29uZmlnLnZlcnRpY2FsUG9zaXRpb24gPT09ICd0b3AnKSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LnRvcCgnMCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LmJvdHRvbSgnMCcpO1xuICAgIH1cblxuICAgIG92ZXJsYXlDb25maWcucG9zaXRpb25TdHJhdGVneSA9IHBvc2l0aW9uU3RyYXRlZ3k7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXkuY3JlYXRlKG92ZXJsYXlDb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5qZWN0b3IgdG8gYmUgdXNlZCBpbnNpZGUgb2YgYSBzbmFjayBiYXIgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY29uZmlnIENvbmZpZyB0aGF0IHdhcyB1c2VkIHRvIGNyZWF0ZSB0aGUgc25hY2sgYmFyLlxuICAgKiBAcGFyYW0gc25hY2tCYXJSZWYgUmVmZXJlbmNlIHRvIHRoZSBzbmFjayBiYXIuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVJbmplY3RvcjxUPihjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnLCBzbmFja0JhclJlZjogTWF0U25hY2tCYXJSZWY8VD4pOiBJbmplY3RvciB7XG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuXG4gICAgcmV0dXJuIEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7cHJvdmlkZTogTWF0U25hY2tCYXJSZWYsIHVzZVZhbHVlOiBzbmFja0JhclJlZn0sXG4gICAgICAgIHtwcm92aWRlOiBNQVRfU05BQ0tfQkFSX0RBVEEsIHVzZVZhbHVlOiBjb25maWcuZGF0YX0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG59XG4iXX0=