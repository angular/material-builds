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
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
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
import * as i4 from "./snack-bar-config";
/** Injection token that can be used to specify default snack bar. */
export const MAT_SNACK_BAR_DEFAULT_OPTIONS = new InjectionToken('mat-snack-bar-default-options', {
    providedIn: 'root',
    factory: MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY,
});
/** @docs-private */
export function MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY() {
    return new MatSnackBarConfig();
}
export class _MatSnackBarBase {
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
}
_MatSnackBarBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: _MatSnackBarBase, deps: [{ token: i1.Overlay }, { token: i2.LiveAnnouncer }, { token: i0.Injector }, { token: i3.BreakpointObserver }, { token: _MatSnackBarBase, optional: true, skipSelf: true }, { token: MAT_SNACK_BAR_DEFAULT_OPTIONS }], target: i0.ɵɵFactoryTarget.Injectable });
_MatSnackBarBase.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: _MatSnackBarBase });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: _MatSnackBarBase, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i2.LiveAnnouncer }, { type: i0.Injector }, { type: i3.BreakpointObserver }, { type: _MatSnackBarBase, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i4.MatSnackBarConfig, decorators: [{
                    type: Inject,
                    args: [MAT_SNACK_BAR_DEFAULT_OPTIONS]
                }] }]; } });
/**
 * Service to dispatch Material Design snack bar messages.
 */
export class MatSnackBar extends _MatSnackBarBase {
    constructor(overlay, live, injector, breakpointObserver, parentSnackBar, defaultConfig) {
        super(overlay, live, injector, breakpointObserver, parentSnackBar, defaultConfig);
        this.simpleSnackBarComponent = SimpleSnackBar;
        this.snackBarContainerComponent = MatSnackBarContainer;
        this.handsetCssClass = 'mat-snack-bar-handset';
    }
}
MatSnackBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatSnackBar, deps: [{ token: i1.Overlay }, { token: i2.LiveAnnouncer }, { token: i0.Injector }, { token: i3.BreakpointObserver }, { token: MatSnackBar, optional: true, skipSelf: true }, { token: MAT_SNACK_BAR_DEFAULT_OPTIONS }], target: i0.ɵɵFactoryTarget.Injectable });
MatSnackBar.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatSnackBar, providedIn: MatSnackBarModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatSnackBar, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NuYWNrLWJhci9zbmFjay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxXQUFXLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRSxPQUFPLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBYSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxlQUFlLEVBQWlCLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25GLE9BQU8sRUFHTCxNQUFNLEVBQ04sVUFBVSxFQUNWLGNBQWMsRUFDZCxRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVEsRUFDUixXQUFXLEdBR1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBbUIsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDcEUsT0FBTyxFQUFDLGtCQUFrQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDekUsT0FBTyxFQUFDLG9CQUFvQixFQUE0QixNQUFNLHVCQUF1QixDQUFDO0FBQ3RGLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7O0FBRS9DLHFFQUFxRTtBQUNyRSxNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBRyxJQUFJLGNBQWMsQ0FDN0QsK0JBQStCLEVBQy9CO0lBQ0UsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLHFDQUFxQztDQUMvQyxDQUNGLENBQUM7QUFFRixvQkFBb0I7QUFDcEIsTUFB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NkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TGl2ZUFubm91bmNlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCcmVha3BvaW50T2JzZXJ2ZXIsIEJyZWFrcG9pbnRzfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7T3ZlcmxheSwgT3ZlcmxheUNvbmZpZywgT3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21wb25lbnRQb3J0YWwsIENvbXBvbmVudFR5cGUsIFRlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIENvbXBvbmVudFJlZixcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGFibGUsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3RvcixcbiAgT3B0aW9uYWwsXG4gIFNraXBTZWxmLFxuICBUZW1wbGF0ZVJlZixcbiAgT25EZXN0cm95LFxuICBUeXBlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1RleHRPbmx5U25hY2tCYXIsIFNpbXBsZVNuYWNrQmFyfSBmcm9tICcuL3NpbXBsZS1zbmFjay1iYXInO1xuaW1wb3J0IHtNQVRfU05BQ0tfQkFSX0RBVEEsIE1hdFNuYWNrQmFyQ29uZmlnfSBmcm9tICcuL3NuYWNrLWJhci1jb25maWcnO1xuaW1wb3J0IHtNYXRTbmFja0JhckNvbnRhaW5lciwgX01hdFNuYWNrQmFyQ29udGFpbmVyQmFzZX0gZnJvbSAnLi9zbmFjay1iYXItY29udGFpbmVyJztcbmltcG9ydCB7TWF0U25hY2tCYXJNb2R1bGV9IGZyb20gJy4vc25hY2stYmFyLW1vZHVsZSc7XG5pbXBvcnQge01hdFNuYWNrQmFyUmVmfSBmcm9tICcuL3NuYWNrLWJhci1yZWYnO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBkZWZhdWx0IHNuYWNrIGJhci4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTbmFja0JhckNvbmZpZz4oXG4gICdtYXQtc25hY2stYmFyLWRlZmF1bHQtb3B0aW9ucycsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogTUFUX1NOQUNLX0JBUl9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSxcbiAgfSxcbik7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1NOQUNLX0JBUl9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSgpOiBNYXRTbmFja0JhckNvbmZpZyB7XG4gIHJldHVybiBuZXcgTWF0U25hY2tCYXJDb25maWcoKTtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRTbmFja0JhckJhc2UgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IHNuYWNrIGJhciBpbiB0aGUgdmlldyAqYXQgdGhpcyBsZXZlbCogKGluIHRoZSBBbmd1bGFyIGluamVjdG9yIHRyZWUpLlxuICAgKiBJZiB0aGVyZSBpcyBhIHBhcmVudCBzbmFjay1iYXIgc2VydmljZSwgYWxsIG9wZXJhdGlvbnMgc2hvdWxkIGRlbGVnYXRlIHRvIHRoYXQgcGFyZW50XG4gICAqIHZpYSBgX29wZW5lZFNuYWNrQmFyUmVmYC5cbiAgICovXG4gIHByaXZhdGUgX3NuYWNrQmFyUmVmQXRUaGlzTGV2ZWw6IE1hdFNuYWNrQmFyUmVmPGFueT4gfCBudWxsID0gbnVsbDtcblxuICAvKiogVGhlIGNvbXBvbmVudCB0aGF0IHNob3VsZCBiZSByZW5kZXJlZCBhcyB0aGUgc25hY2sgYmFyJ3Mgc2ltcGxlIGNvbXBvbmVudC4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IHNpbXBsZVNuYWNrQmFyQ29tcG9uZW50OiBUeXBlPFRleHRPbmx5U25hY2tCYXI+O1xuXG4gIC8qKiBUaGUgY29udGFpbmVyIGNvbXBvbmVudCB0aGF0IGF0dGFjaGVzIHRoZSBwcm92aWRlZCB0ZW1wbGF0ZSBvciBjb21wb25lbnQuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBzbmFja0JhckNvbnRhaW5lckNvbXBvbmVudDogVHlwZTxfTWF0U25hY2tCYXJDb250YWluZXJCYXNlPjtcblxuICAvKiogVGhlIENTUyBjbGFzcyB0byBhcHBseSBmb3IgaGFuZHNldCBtb2RlLiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgaGFuZHNldENzc0NsYXNzOiBzdHJpbmc7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudGx5IG9wZW5lZCBzbmFja2JhciBhdCAqYW55KiBsZXZlbC4gKi9cbiAgZ2V0IF9vcGVuZWRTbmFja0JhclJlZigpOiBNYXRTbmFja0JhclJlZjxhbnk+IHwgbnVsbCB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50U25hY2tCYXI7XG4gICAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5fb3BlbmVkU25hY2tCYXJSZWYgOiB0aGlzLl9zbmFja0JhclJlZkF0VGhpc0xldmVsO1xuICB9XG5cbiAgc2V0IF9vcGVuZWRTbmFja0JhclJlZih2YWx1ZTogTWF0U25hY2tCYXJSZWY8YW55PiB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fcGFyZW50U25hY2tCYXIpIHtcbiAgICAgIHRoaXMuX3BhcmVudFNuYWNrQmFyLl9vcGVuZWRTbmFja0JhclJlZiA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zbmFja0JhclJlZkF0VGhpc0xldmVsID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcml2YXRlIF9saXZlOiBMaXZlQW5ub3VuY2VyLFxuICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIF9icmVha3BvaW50T2JzZXJ2ZXI6IEJyZWFrcG9pbnRPYnNlcnZlcixcbiAgICBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBwcml2YXRlIF9wYXJlbnRTbmFja0JhcjogX01hdFNuYWNrQmFyQmFzZSxcbiAgICBASW5qZWN0KE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TKSBwcml2YXRlIF9kZWZhdWx0Q29uZmlnOiBNYXRTbmFja0JhckNvbmZpZyxcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuZCBkaXNwYXRjaGVzIGEgc25hY2sgYmFyIHdpdGggYSBjdXN0b20gY29tcG9uZW50IGZvciB0aGUgY29udGVudCwgcmVtb3ZpbmcgYW55XG4gICAqIGN1cnJlbnRseSBvcGVuZWQgc25hY2sgYmFycy5cbiAgICpcbiAgICogQHBhcmFtIGNvbXBvbmVudCBDb21wb25lbnQgdG8gYmUgaW5zdGFudGlhdGVkLlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzbmFjayBiYXIuXG4gICAqL1xuICBvcGVuRnJvbUNvbXBvbmVudDxULCBEID0gYW55PihcbiAgICBjb21wb25lbnQ6IENvbXBvbmVudFR5cGU8VD4sXG4gICAgY29uZmlnPzogTWF0U25hY2tCYXJDb25maWc8RD4sXG4gICk6IE1hdFNuYWNrQmFyUmVmPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoKGNvbXBvbmVudCwgY29uZmlnKSBhcyBNYXRTbmFja0JhclJlZjxUPjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuZCBkaXNwYXRjaGVzIGEgc25hY2sgYmFyIHdpdGggYSBjdXN0b20gdGVtcGxhdGUgZm9yIHRoZSBjb250ZW50LCByZW1vdmluZyBhbnlcbiAgICogY3VycmVudGx5IG9wZW5lZCBzbmFjayBiYXJzLlxuICAgKlxuICAgKiBAcGFyYW0gdGVtcGxhdGUgVGVtcGxhdGUgdG8gYmUgaW5zdGFudGlhdGVkLlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzbmFjayBiYXIuXG4gICAqL1xuICBvcGVuRnJvbVRlbXBsYXRlKFxuICAgIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+LFxuICAgIGNvbmZpZz86IE1hdFNuYWNrQmFyQ29uZmlnLFxuICApOiBNYXRTbmFja0JhclJlZjxFbWJlZGRlZFZpZXdSZWY8YW55Pj4ge1xuICAgIHJldHVybiB0aGlzLl9hdHRhY2godGVtcGxhdGUsIGNvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogT3BlbnMgYSBzbmFja2JhciB3aXRoIGEgbWVzc2FnZSBhbmQgYW4gb3B0aW9uYWwgYWN0aW9uLlxuICAgKiBAcGFyYW0gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBzaG93IGluIHRoZSBzbmFja2Jhci5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgbGFiZWwgZm9yIHRoZSBzbmFja2JhciBhY3Rpb24uXG4gICAqIEBwYXJhbSBjb25maWcgQWRkaXRpb25hbCBjb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIHRoZSBzbmFja2Jhci5cbiAgICovXG4gIG9wZW4oXG4gICAgbWVzc2FnZTogc3RyaW5nLFxuICAgIGFjdGlvbjogc3RyaW5nID0gJycsXG4gICAgY29uZmlnPzogTWF0U25hY2tCYXJDb25maWcsXG4gICk6IE1hdFNuYWNrQmFyUmVmPFRleHRPbmx5U25hY2tCYXI+IHtcbiAgICBjb25zdCBfY29uZmlnID0gey4uLnRoaXMuX2RlZmF1bHRDb25maWcsIC4uLmNvbmZpZ307XG5cbiAgICAvLyBTaW5jZSB0aGUgdXNlciBkb2Vzbid0IGhhdmUgYWNjZXNzIHRvIHRoZSBjb21wb25lbnQsIHdlIGNhblxuICAgIC8vIG92ZXJyaWRlIHRoZSBkYXRhIHRvIHBhc3MgaW4gb3VyIG93biBtZXNzYWdlIGFuZCBhY3Rpb24uXG4gICAgX2NvbmZpZy5kYXRhID0ge21lc3NhZ2UsIGFjdGlvbn07XG5cbiAgICAvLyBTaW5jZSB0aGUgc25hY2sgYmFyIGhhcyBgcm9sZT1cImFsZXJ0XCJgLCB3ZSBkb24ndFxuICAgIC8vIHdhbnQgdG8gYW5ub3VuY2UgdGhlIHNhbWUgbWVzc2FnZSB0d2ljZS5cbiAgICBpZiAoX2NvbmZpZy5hbm5vdW5jZW1lbnRNZXNzYWdlID09PSBtZXNzYWdlKSB7XG4gICAgICBfY29uZmlnLmFubm91bmNlbWVudE1lc3NhZ2UgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub3BlbkZyb21Db21wb25lbnQodGhpcy5zaW1wbGVTbmFja0JhckNvbXBvbmVudCwgX2NvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHRoZSBjdXJyZW50bHktdmlzaWJsZSBzbmFjayBiYXIuXG4gICAqL1xuICBkaXNtaXNzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vcGVuZWRTbmFja0JhclJlZikge1xuICAgICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYuZGlzbWlzcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIC8vIE9ubHkgZGlzbWlzcyB0aGUgc25hY2sgYmFyIGF0IHRoZSBjdXJyZW50IGxldmVsIG9uIGRlc3Ryb3kuXG4gICAgaWYgKHRoaXMuX3NuYWNrQmFyUmVmQXRUaGlzTGV2ZWwpIHtcbiAgICAgIHRoaXMuX3NuYWNrQmFyUmVmQXRUaGlzTGV2ZWwuZGlzbWlzcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgc25hY2sgYmFyIGNvbnRhaW5lciBjb21wb25lbnQgdG8gdGhlIG92ZXJsYXkuXG4gICAqL1xuICBwcml2YXRlIF9hdHRhY2hTbmFja0JhckNvbnRhaW5lcihcbiAgICBvdmVybGF5UmVmOiBPdmVybGF5UmVmLFxuICAgIGNvbmZpZzogTWF0U25hY2tCYXJDb25maWcsXG4gICk6IF9NYXRTbmFja0JhckNvbnRhaW5lckJhc2Uge1xuICAgIGNvbnN0IHVzZXJJbmplY3RvciA9IGNvbmZpZyAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZiAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZi5pbmplY3RvcjtcbiAgICBjb25zdCBpbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRTbmFja0JhckNvbmZpZywgdXNlVmFsdWU6IGNvbmZpZ31dLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChcbiAgICAgIHRoaXMuc25hY2tCYXJDb250YWluZXJDb21wb25lbnQsXG4gICAgICBjb25maWcudmlld0NvbnRhaW5lclJlZixcbiAgICAgIGluamVjdG9yLFxuICAgICk7XG4gICAgY29uc3QgY29udGFpbmVyUmVmOiBDb21wb25lbnRSZWY8X01hdFNuYWNrQmFyQ29udGFpbmVyQmFzZT4gPVxuICAgICAgb3ZlcmxheVJlZi5hdHRhY2goY29udGFpbmVyUG9ydGFsKTtcbiAgICBjb250YWluZXJSZWYuaW5zdGFuY2Uuc25hY2tCYXJDb25maWcgPSBjb25maWc7XG4gICAgcmV0dXJuIGNvbnRhaW5lclJlZi5pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbGFjZXMgYSBuZXcgY29tcG9uZW50IG9yIGEgdGVtcGxhdGUgYXMgdGhlIGNvbnRlbnQgb2YgdGhlIHNuYWNrIGJhciBjb250YWluZXIuXG4gICAqL1xuICBwcml2YXRlIF9hdHRhY2g8VD4oXG4gICAgY29udGVudDogQ29tcG9uZW50VHlwZTxUPiB8IFRlbXBsYXRlUmVmPFQ+LFxuICAgIHVzZXJDb25maWc/OiBNYXRTbmFja0JhckNvbmZpZyxcbiAgKTogTWF0U25hY2tCYXJSZWY8VCB8IEVtYmVkZGVkVmlld1JlZjxhbnk+PiB7XG4gICAgY29uc3QgY29uZmlnID0gey4uLm5ldyBNYXRTbmFja0JhckNvbmZpZygpLCAuLi50aGlzLl9kZWZhdWx0Q29uZmlnLCAuLi51c2VyQ29uZmlnfTtcbiAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5fY3JlYXRlT3ZlcmxheShjb25maWcpO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2F0dGFjaFNuYWNrQmFyQ29udGFpbmVyKG92ZXJsYXlSZWYsIGNvbmZpZyk7XG4gICAgY29uc3Qgc25hY2tCYXJSZWYgPSBuZXcgTWF0U25hY2tCYXJSZWY8VCB8IEVtYmVkZGVkVmlld1JlZjxhbnk+Pihjb250YWluZXIsIG92ZXJsYXlSZWYpO1xuXG4gICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZikge1xuICAgICAgY29uc3QgcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKGNvbnRlbnQsIG51bGwhLCB7XG4gICAgICAgICRpbXBsaWNpdDogY29uZmlnLmRhdGEsXG4gICAgICAgIHNuYWNrQmFyUmVmLFxuICAgICAgfSBhcyBhbnkpO1xuXG4gICAgICBzbmFja0JhclJlZi5pbnN0YW5jZSA9IGNvbnRhaW5lci5hdHRhY2hUZW1wbGF0ZVBvcnRhbChwb3J0YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbmplY3RvciA9IHRoaXMuX2NyZWF0ZUluamVjdG9yKGNvbmZpZywgc25hY2tCYXJSZWYpO1xuICAgICAgY29uc3QgcG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChjb250ZW50LCB1bmRlZmluZWQsIGluamVjdG9yKTtcbiAgICAgIGNvbnN0IGNvbnRlbnRSZWYgPSBjb250YWluZXIuYXR0YWNoQ29tcG9uZW50UG9ydGFsPFQ+KHBvcnRhbCk7XG5cbiAgICAgIC8vIFdlIGNhbid0IHBhc3MgdGhpcyB2aWEgdGhlIGluamVjdG9yLCBiZWNhdXNlIHRoZSBpbmplY3RvciBpcyBjcmVhdGVkIGVhcmxpZXIuXG4gICAgICBzbmFja0JhclJlZi5pbnN0YW5jZSA9IGNvbnRlbnRSZWYuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgLy8gU3Vic2NyaWJlIHRvIHRoZSBicmVha3BvaW50IG9ic2VydmVyIGFuZCBhdHRhY2ggdGhlIG1hdC1zbmFjay1iYXItaGFuZHNldCBjbGFzcyBhc1xuICAgIC8vIGFwcHJvcHJpYXRlLiBUaGlzIGNsYXNzIGlzIGFwcGxpZWQgdG8gdGhlIG92ZXJsYXkgZWxlbWVudCBiZWNhdXNlIHRoZSBvdmVybGF5IG11c3QgZXhwYW5kIHRvXG4gICAgLy8gZmlsbCB0aGUgd2lkdGggb2YgdGhlIHNjcmVlbiBmb3IgZnVsbCB3aWR0aCBzbmFja2JhcnMuXG4gICAgdGhpcy5fYnJlYWtwb2ludE9ic2VydmVyXG4gICAgICAub2JzZXJ2ZShCcmVha3BvaW50cy5IYW5kc2V0UG9ydHJhaXQpXG4gICAgICAucGlwZSh0YWtlVW50aWwob3ZlcmxheVJlZi5kZXRhY2htZW50cygpKSlcbiAgICAgIC5zdWJzY3JpYmUoc3RhdGUgPT4ge1xuICAgICAgICBvdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUodGhpcy5oYW5kc2V0Q3NzQ2xhc3MsIHN0YXRlLm1hdGNoZXMpO1xuICAgICAgfSk7XG5cbiAgICBpZiAoY29uZmlnLmFubm91bmNlbWVudE1lc3NhZ2UpIHtcbiAgICAgIC8vIFdhaXQgdW50aWwgdGhlIHNuYWNrIGJhciBjb250ZW50cyBoYXZlIGJlZW4gYW5ub3VuY2VkIHRoZW4gZGVsaXZlciB0aGlzIG1lc3NhZ2UuXG4gICAgICBjb250YWluZXIuX29uQW5ub3VuY2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fbGl2ZS5hbm5vdW5jZShjb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSEsIGNvbmZpZy5wb2xpdGVuZXNzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX2FuaW1hdGVTbmFja0JhcihzbmFja0JhclJlZiwgY29uZmlnKTtcbiAgICB0aGlzLl9vcGVuZWRTbmFja0JhclJlZiA9IHNuYWNrQmFyUmVmO1xuICAgIHJldHVybiB0aGlzLl9vcGVuZWRTbmFja0JhclJlZjtcbiAgfVxuXG4gIC8qKiBBbmltYXRlcyB0aGUgb2xkIHNuYWNrIGJhciBvdXQgYW5kIHRoZSBuZXcgb25lIGluLiAqL1xuICBwcml2YXRlIF9hbmltYXRlU25hY2tCYXIoc25hY2tCYXJSZWY6IE1hdFNuYWNrQmFyUmVmPGFueT4sIGNvbmZpZzogTWF0U25hY2tCYXJDb25maWcpIHtcbiAgICAvLyBXaGVuIHRoZSBzbmFja2JhciBpcyBkaXNtaXNzZWQsIGNsZWFyIHRoZSByZWZlcmVuY2UgdG8gaXQuXG4gICAgc25hY2tCYXJSZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gQ2xlYXIgdGhlIHNuYWNrYmFyIHJlZiBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuIHJlcGxhY2VkIGJ5IGEgbmV3ZXIgc25hY2tiYXIuXG4gICAgICBpZiAodGhpcy5fb3BlbmVkU25hY2tCYXJSZWYgPT0gc25hY2tCYXJSZWYpIHtcbiAgICAgICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLmFubm91bmNlbWVudE1lc3NhZ2UpIHtcbiAgICAgICAgdGhpcy5fbGl2ZS5jbGVhcigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmKSB7XG4gICAgICAvLyBJZiBhIHNuYWNrIGJhciBpcyBhbHJlYWR5IGluIHZpZXcsIGRpc21pc3MgaXQgYW5kIGVudGVyIHRoZVxuICAgICAgLy8gbmV3IHNuYWNrIGJhciBhZnRlciBleGl0IGFuaW1hdGlvbiBpcyBjb21wbGV0ZS5cbiAgICAgIHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgc25hY2tCYXJSZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYuZGlzbWlzcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBubyBzbmFjayBiYXIgaXMgaW4gdmlldywgZW50ZXIgdGhlIG5ldyBzbmFjayBiYXIuXG4gICAgICBzbmFja0JhclJlZi5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpO1xuICAgIH1cblxuICAgIC8vIElmIGEgZGlzbWlzcyB0aW1lb3V0IGlzIHByb3ZpZGVkLCBzZXQgdXAgZGlzbWlzcyBiYXNlZCBvbiBhZnRlciB0aGUgc25hY2tiYXIgaXMgb3BlbmVkLlxuICAgIGlmIChjb25maWcuZHVyYXRpb24gJiYgY29uZmlnLmR1cmF0aW9uID4gMCkge1xuICAgICAgc25hY2tCYXJSZWYuYWZ0ZXJPcGVuZWQoKS5zdWJzY3JpYmUoKCkgPT4gc25hY2tCYXJSZWYuX2Rpc21pc3NBZnRlcihjb25maWcuZHVyYXRpb24hKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgb3ZlcmxheSBhbmQgcGxhY2VzIGl0IGluIHRoZSBjb3JyZWN0IGxvY2F0aW9uLlxuICAgKiBAcGFyYW0gY29uZmlnIFRoZSB1c2VyLXNwZWNpZmllZCBzbmFjayBiYXIgY29uZmlnLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlT3ZlcmxheShjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnKTogT3ZlcmxheVJlZiB7XG4gICAgY29uc3Qgb3ZlcmxheUNvbmZpZyA9IG5ldyBPdmVybGF5Q29uZmlnKCk7XG4gICAgb3ZlcmxheUNvbmZpZy5kaXJlY3Rpb24gPSBjb25maWcuZGlyZWN0aW9uO1xuXG4gICAgbGV0IHBvc2l0aW9uU3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCk7XG4gICAgLy8gU2V0IGhvcml6b250YWwgcG9zaXRpb24uXG4gICAgY29uc3QgaXNSdGwgPSBjb25maWcuZGlyZWN0aW9uID09PSAncnRsJztcbiAgICBjb25zdCBpc0xlZnQgPVxuICAgICAgY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ2xlZnQnIHx8XG4gICAgICAoY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ3N0YXJ0JyAmJiAhaXNSdGwpIHx8XG4gICAgICAoY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ2VuZCcgJiYgaXNSdGwpO1xuICAgIGNvbnN0IGlzUmlnaHQgPSAhaXNMZWZ0ICYmIGNvbmZpZy5ob3Jpem9udGFsUG9zaXRpb24gIT09ICdjZW50ZXInO1xuICAgIGlmIChpc0xlZnQpIHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3kubGVmdCgnMCcpO1xuICAgIH0gZWxzZSBpZiAoaXNSaWdodCkge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS5yaWdodCgnMCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LmNlbnRlckhvcml6b250YWxseSgpO1xuICAgIH1cbiAgICAvLyBTZXQgaG9yaXpvbnRhbCBwb3NpdGlvbi5cbiAgICBpZiAoY29uZmlnLnZlcnRpY2FsUG9zaXRpb24gPT09ICd0b3AnKSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LnRvcCgnMCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LmJvdHRvbSgnMCcpO1xuICAgIH1cblxuICAgIG92ZXJsYXlDb25maWcucG9zaXRpb25TdHJhdGVneSA9IHBvc2l0aW9uU3RyYXRlZ3k7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXkuY3JlYXRlKG92ZXJsYXlDb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5qZWN0b3IgdG8gYmUgdXNlZCBpbnNpZGUgb2YgYSBzbmFjayBiYXIgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY29uZmlnIENvbmZpZyB0aGF0IHdhcyB1c2VkIHRvIGNyZWF0ZSB0aGUgc25hY2sgYmFyLlxuICAgKiBAcGFyYW0gc25hY2tCYXJSZWYgUmVmZXJlbmNlIHRvIHRoZSBzbmFjayBiYXIuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVJbmplY3RvcjxUPihjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnLCBzbmFja0JhclJlZjogTWF0U25hY2tCYXJSZWY8VD4pOiBJbmplY3RvciB7XG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuXG4gICAgcmV0dXJuIEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7cHJvdmlkZTogTWF0U25hY2tCYXJSZWYsIHVzZVZhbHVlOiBzbmFja0JhclJlZn0sXG4gICAgICAgIHtwcm92aWRlOiBNQVRfU05BQ0tfQkFSX0RBVEEsIHVzZVZhbHVlOiBjb25maWcuZGF0YX0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogU2VydmljZSB0byBkaXNwYXRjaCBNYXRlcmlhbCBEZXNpZ24gc25hY2sgYmFyIG1lc3NhZ2VzLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogTWF0U25hY2tCYXJNb2R1bGV9KVxuZXhwb3J0IGNsYXNzIE1hdFNuYWNrQmFyIGV4dGVuZHMgX01hdFNuYWNrQmFyQmFzZSB7XG4gIHByb3RlY3RlZCBzaW1wbGVTbmFja0JhckNvbXBvbmVudCA9IFNpbXBsZVNuYWNrQmFyO1xuICBwcm90ZWN0ZWQgc25hY2tCYXJDb250YWluZXJDb21wb25lbnQgPSBNYXRTbmFja0JhckNvbnRhaW5lcjtcbiAgcHJvdGVjdGVkIGhhbmRzZXRDc3NDbGFzcyA9ICdtYXQtc25hY2stYmFyLWhhbmRzZXQnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIG92ZXJsYXk6IE92ZXJsYXksXG4gICAgbGl2ZTogTGl2ZUFubm91bmNlcixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgYnJlYWtwb2ludE9ic2VydmVyOiBCcmVha3BvaW50T2JzZXJ2ZXIsXG4gICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcGFyZW50U25hY2tCYXI6IE1hdFNuYWNrQmFyLFxuICAgIEBJbmplY3QoTUFUX1NOQUNLX0JBUl9ERUZBVUxUX09QVElPTlMpIGRlZmF1bHRDb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnLFxuICApIHtcbiAgICBzdXBlcihvdmVybGF5LCBsaXZlLCBpbmplY3RvciwgYnJlYWtwb2ludE9ic2VydmVyLCBwYXJlbnRTbmFja0JhciwgZGVmYXVsdENvbmZpZyk7XG4gIH1cbn1cbiJdfQ==