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
_MatSnackBarBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatSnackBarBase, deps: [{ token: i1.Overlay }, { token: i2.LiveAnnouncer }, { token: i0.Injector }, { token: i3.BreakpointObserver }, { token: _MatSnackBarBase, optional: true, skipSelf: true }, { token: MAT_SNACK_BAR_DEFAULT_OPTIONS }], target: i0.ɵɵFactoryTarget.Injectable });
_MatSnackBarBase.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatSnackBarBase });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatSnackBarBase, decorators: [{
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
MatSnackBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSnackBar, deps: [{ token: i1.Overlay }, { token: i2.LiveAnnouncer }, { token: i0.Injector }, { token: i3.BreakpointObserver }, { token: MatSnackBar, optional: true, skipSelf: true }, { token: MAT_SNACK_BAR_DEFAULT_OPTIONS }], target: i0.ɵɵFactoryTarget.Injectable });
MatSnackBar.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSnackBar, providedIn: MatSnackBarModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSnackBar, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NuYWNrLWJhci9zbmFjay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxXQUFXLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRSxPQUFPLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBYSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxlQUFlLEVBQWlCLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25GLE9BQU8sRUFHTCxNQUFNLEVBQ04sVUFBVSxFQUNWLGNBQWMsRUFDZCxRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVEsRUFDUixXQUFXLEdBR1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBbUIsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDcEUsT0FBTyxFQUFDLGtCQUFrQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDekUsT0FBTyxFQUFDLG9CQUFvQixFQUFxQixNQUFNLHVCQUF1QixDQUFDO0FBQy9FLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7O0FBRS9DLHFFQUFxRTtBQUNyRSxNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBRyxJQUFJLGNBQWMsQ0FDN0QsK0JBQStCLEVBQy9CO0lBQ0UsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLHFDQUFxQztDQUMvQyxDQUNGLENBQUM7QUFFRixvQkFBb0I7QUFDcEIsTUFB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QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtMaXZlQW5ub3VuY2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0JyZWFrcG9pbnRPYnNlcnZlciwgQnJlYWtwb2ludHN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9sYXlvdXQnO1xuaW1wb3J0IHtPdmVybGF5LCBPdmVybGF5Q29uZmlnLCBPdmVybGF5UmVmfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0NvbXBvbmVudFBvcnRhbCwgQ29tcG9uZW50VHlwZSwgVGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50UmVmLFxuICBFbWJlZGRlZFZpZXdSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdG9yLFxuICBPcHRpb25hbCxcbiAgU2tpcFNlbGYsXG4gIFRlbXBsYXRlUmVmLFxuICBPbkRlc3Ryb3ksXG4gIFR5cGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7VGV4dE9ubHlTbmFja0JhciwgU2ltcGxlU25hY2tCYXJ9IGZyb20gJy4vc2ltcGxlLXNuYWNrLWJhcic7XG5pbXBvcnQge01BVF9TTkFDS19CQVJfREFUQSwgTWF0U25hY2tCYXJDb25maWd9IGZyb20gJy4vc25hY2stYmFyLWNvbmZpZyc7XG5pbXBvcnQge01hdFNuYWNrQmFyQ29udGFpbmVyLCBfU25hY2tCYXJDb250YWluZXJ9IGZyb20gJy4vc25hY2stYmFyLWNvbnRhaW5lcic7XG5pbXBvcnQge01hdFNuYWNrQmFyTW9kdWxlfSBmcm9tICcuL3NuYWNrLWJhci1tb2R1bGUnO1xuaW1wb3J0IHtNYXRTbmFja0JhclJlZn0gZnJvbSAnLi9zbmFjay1iYXItcmVmJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgZGVmYXVsdCBzbmFjayBiYXIuICovXG5leHBvcnQgY29uc3QgTUFUX1NOQUNLX0JBUl9ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0U25hY2tCYXJDb25maWc+KFxuICAnbWF0LXNuYWNrLWJhci1kZWZhdWx0LW9wdGlvbnMnLFxuICB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6IE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlksXG4gIH0sXG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0U25hY2tCYXJDb25maWcge1xuICByZXR1cm4gbmV3IE1hdFNuYWNrQmFyQ29uZmlnKCk7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0U25hY2tCYXJCYXNlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCBzbmFjayBiYXIgaW4gdGhlIHZpZXcgKmF0IHRoaXMgbGV2ZWwqIChpbiB0aGUgQW5ndWxhciBpbmplY3RvciB0cmVlKS5cbiAgICogSWYgdGhlcmUgaXMgYSBwYXJlbnQgc25hY2stYmFyIHNlcnZpY2UsIGFsbCBvcGVyYXRpb25zIHNob3VsZCBkZWxlZ2F0ZSB0byB0aGF0IHBhcmVudFxuICAgKiB2aWEgYF9vcGVuZWRTbmFja0JhclJlZmAuXG4gICAqL1xuICBwcml2YXRlIF9zbmFja0JhclJlZkF0VGhpc0xldmVsOiBNYXRTbmFja0JhclJlZjxhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFRoZSBjb21wb25lbnQgdGhhdCBzaG91bGQgYmUgcmVuZGVyZWQgYXMgdGhlIHNuYWNrIGJhcidzIHNpbXBsZSBjb21wb25lbnQuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBzaW1wbGVTbmFja0JhckNvbXBvbmVudDogVHlwZTxUZXh0T25seVNuYWNrQmFyPjtcblxuICAvKiogVGhlIGNvbnRhaW5lciBjb21wb25lbnQgdGhhdCBhdHRhY2hlcyB0aGUgcHJvdmlkZWQgdGVtcGxhdGUgb3IgY29tcG9uZW50LiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3Qgc25hY2tCYXJDb250YWluZXJDb21wb25lbnQ6IFR5cGU8X1NuYWNrQmFyQ29udGFpbmVyPjtcblxuICAvKiogVGhlIENTUyBjbGFzcyB0byBhcHBseSBmb3IgaGFuZHNldCBtb2RlLiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgaGFuZHNldENzc0NsYXNzOiBzdHJpbmc7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudGx5IG9wZW5lZCBzbmFja2JhciBhdCAqYW55KiBsZXZlbC4gKi9cbiAgZ2V0IF9vcGVuZWRTbmFja0JhclJlZigpOiBNYXRTbmFja0JhclJlZjxhbnk+IHwgbnVsbCB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50U25hY2tCYXI7XG4gICAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5fb3BlbmVkU25hY2tCYXJSZWYgOiB0aGlzLl9zbmFja0JhclJlZkF0VGhpc0xldmVsO1xuICB9XG5cbiAgc2V0IF9vcGVuZWRTbmFja0JhclJlZih2YWx1ZTogTWF0U25hY2tCYXJSZWY8YW55PiB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fcGFyZW50U25hY2tCYXIpIHtcbiAgICAgIHRoaXMuX3BhcmVudFNuYWNrQmFyLl9vcGVuZWRTbmFja0JhclJlZiA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zbmFja0JhclJlZkF0VGhpc0xldmVsID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcml2YXRlIF9saXZlOiBMaXZlQW5ub3VuY2VyLFxuICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIF9icmVha3BvaW50T2JzZXJ2ZXI6IEJyZWFrcG9pbnRPYnNlcnZlcixcbiAgICBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBwcml2YXRlIF9wYXJlbnRTbmFja0JhcjogX01hdFNuYWNrQmFyQmFzZSxcbiAgICBASW5qZWN0KE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TKSBwcml2YXRlIF9kZWZhdWx0Q29uZmlnOiBNYXRTbmFja0JhckNvbmZpZyxcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuZCBkaXNwYXRjaGVzIGEgc25hY2sgYmFyIHdpdGggYSBjdXN0b20gY29tcG9uZW50IGZvciB0aGUgY29udGVudCwgcmVtb3ZpbmcgYW55XG4gICAqIGN1cnJlbnRseSBvcGVuZWQgc25hY2sgYmFycy5cbiAgICpcbiAgICogQHBhcmFtIGNvbXBvbmVudCBDb21wb25lbnQgdG8gYmUgaW5zdGFudGlhdGVkLlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzbmFjayBiYXIuXG4gICAqL1xuICBvcGVuRnJvbUNvbXBvbmVudDxUPihjb21wb25lbnQ6IENvbXBvbmVudFR5cGU8VD4sIGNvbmZpZz86IE1hdFNuYWNrQmFyQ29uZmlnKTogTWF0U25hY2tCYXJSZWY8VD4ge1xuICAgIHJldHVybiB0aGlzLl9hdHRhY2goY29tcG9uZW50LCBjb25maWcpIGFzIE1hdFNuYWNrQmFyUmVmPFQ+O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW5kIGRpc3BhdGNoZXMgYSBzbmFjayBiYXIgd2l0aCBhIGN1c3RvbSB0ZW1wbGF0ZSBmb3IgdGhlIGNvbnRlbnQsIHJlbW92aW5nIGFueVxuICAgKiBjdXJyZW50bHkgb3BlbmVkIHNuYWNrIGJhcnMuXG4gICAqXG4gICAqIEBwYXJhbSB0ZW1wbGF0ZSBUZW1wbGF0ZSB0byBiZSBpbnN0YW50aWF0ZWQuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNuYWNrIGJhci5cbiAgICovXG4gIG9wZW5Gcm9tVGVtcGxhdGUoXG4gICAgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4sXG4gICAgY29uZmlnPzogTWF0U25hY2tCYXJDb25maWcsXG4gICk6IE1hdFNuYWNrQmFyUmVmPEVtYmVkZGVkVmlld1JlZjxhbnk+PiB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dGFjaCh0ZW1wbGF0ZSwgY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyBhIHNuYWNrYmFyIHdpdGggYSBtZXNzYWdlIGFuZCBhbiBvcHRpb25hbCBhY3Rpb24uXG4gICAqIEBwYXJhbSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIHNob3cgaW4gdGhlIHNuYWNrYmFyLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBsYWJlbCBmb3IgdGhlIHNuYWNrYmFyIGFjdGlvbi5cbiAgICogQHBhcmFtIGNvbmZpZyBBZGRpdGlvbmFsIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgdGhlIHNuYWNrYmFyLlxuICAgKi9cbiAgb3BlbihcbiAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgYWN0aW9uOiBzdHJpbmcgPSAnJyxcbiAgICBjb25maWc/OiBNYXRTbmFja0JhckNvbmZpZyxcbiAgKTogTWF0U25hY2tCYXJSZWY8VGV4dE9ubHlTbmFja0Jhcj4ge1xuICAgIGNvbnN0IF9jb25maWcgPSB7Li4udGhpcy5fZGVmYXVsdENvbmZpZywgLi4uY29uZmlnfTtcblxuICAgIC8vIFNpbmNlIHRoZSB1c2VyIGRvZXNuJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhlIGNvbXBvbmVudCwgd2UgY2FuXG4gICAgLy8gb3ZlcnJpZGUgdGhlIGRhdGEgdG8gcGFzcyBpbiBvdXIgb3duIG1lc3NhZ2UgYW5kIGFjdGlvbi5cbiAgICBfY29uZmlnLmRhdGEgPSB7bWVzc2FnZSwgYWN0aW9ufTtcblxuICAgIC8vIFNpbmNlIHRoZSBzbmFjayBiYXIgaGFzIGByb2xlPVwiYWxlcnRcImAsIHdlIGRvbid0XG4gICAgLy8gd2FudCB0byBhbm5vdW5jZSB0aGUgc2FtZSBtZXNzYWdlIHR3aWNlLlxuICAgIGlmIChfY29uZmlnLmFubm91bmNlbWVudE1lc3NhZ2UgPT09IG1lc3NhZ2UpIHtcbiAgICAgIF9jb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vcGVuRnJvbUNvbXBvbmVudCh0aGlzLnNpbXBsZVNuYWNrQmFyQ29tcG9uZW50LCBfY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIGN1cnJlbnRseS12aXNpYmxlIHNuYWNrIGJhci5cbiAgICovXG4gIGRpc21pc3MoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmKSB7XG4gICAgICB0aGlzLl9vcGVuZWRTbmFja0JhclJlZi5kaXNtaXNzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy8gT25seSBkaXNtaXNzIHRoZSBzbmFjayBiYXIgYXQgdGhlIGN1cnJlbnQgbGV2ZWwgb24gZGVzdHJveS5cbiAgICBpZiAodGhpcy5fc25hY2tCYXJSZWZBdFRoaXNMZXZlbCkge1xuICAgICAgdGhpcy5fc25hY2tCYXJSZWZBdFRoaXNMZXZlbC5kaXNtaXNzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHRoZSBzbmFjayBiYXIgY29udGFpbmVyIGNvbXBvbmVudCB0byB0aGUgb3ZlcmxheS5cbiAgICovXG4gIHByaXZhdGUgX2F0dGFjaFNuYWNrQmFyQ29udGFpbmVyKFxuICAgIG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgY29uZmlnOiBNYXRTbmFja0JhckNvbmZpZyxcbiAgKTogX1NuYWNrQmFyQ29udGFpbmVyIHtcbiAgICBjb25zdCB1c2VySW5qZWN0b3IgPSBjb25maWcgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYuaW5qZWN0b3I7XG4gICAgY29uc3QgaW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xuICAgICAgcGFyZW50OiB1c2VySW5qZWN0b3IgfHwgdGhpcy5faW5qZWN0b3IsXG4gICAgICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTWF0U25hY2tCYXJDb25maWcsIHVzZVZhbHVlOiBjb25maWd9XSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNvbnRhaW5lclBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoXG4gICAgICB0aGlzLnNuYWNrQmFyQ29udGFpbmVyQ29tcG9uZW50LFxuICAgICAgY29uZmlnLnZpZXdDb250YWluZXJSZWYsXG4gICAgICBpbmplY3RvcixcbiAgICApO1xuICAgIGNvbnN0IGNvbnRhaW5lclJlZjogQ29tcG9uZW50UmVmPF9TbmFja0JhckNvbnRhaW5lcj4gPSBvdmVybGF5UmVmLmF0dGFjaChjb250YWluZXJQb3J0YWwpO1xuICAgIGNvbnRhaW5lclJlZi5pbnN0YW5jZS5zbmFja0JhckNvbmZpZyA9IGNvbmZpZztcbiAgICByZXR1cm4gY29udGFpbmVyUmVmLmluc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsYWNlcyBhIG5ldyBjb21wb25lbnQgb3IgYSB0ZW1wbGF0ZSBhcyB0aGUgY29udGVudCBvZiB0aGUgc25hY2sgYmFyIGNvbnRhaW5lci5cbiAgICovXG4gIHByaXZhdGUgX2F0dGFjaDxUPihcbiAgICBjb250ZW50OiBDb21wb25lbnRUeXBlPFQ+IHwgVGVtcGxhdGVSZWY8VD4sXG4gICAgdXNlckNvbmZpZz86IE1hdFNuYWNrQmFyQ29uZmlnLFxuICApOiBNYXRTbmFja0JhclJlZjxUIHwgRW1iZWRkZWRWaWV3UmVmPGFueT4+IHtcbiAgICBjb25zdCBjb25maWcgPSB7Li4ubmV3IE1hdFNuYWNrQmFyQ29uZmlnKCksIC4uLnRoaXMuX2RlZmF1bHRDb25maWcsIC4uLnVzZXJDb25maWd9O1xuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9jcmVhdGVPdmVybGF5KGNvbmZpZyk7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fYXR0YWNoU25hY2tCYXJDb250YWluZXIob3ZlcmxheVJlZiwgY29uZmlnKTtcbiAgICBjb25zdCBzbmFja0JhclJlZiA9IG5ldyBNYXRTbmFja0JhclJlZjxUIHwgRW1iZWRkZWRWaWV3UmVmPGFueT4+KGNvbnRhaW5lciwgb3ZlcmxheVJlZik7XG5cbiAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmKSB7XG4gICAgICBjb25zdCBwb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwoY29udGVudCwgbnVsbCEsIHtcbiAgICAgICAgJGltcGxpY2l0OiBjb25maWcuZGF0YSxcbiAgICAgICAgc25hY2tCYXJSZWYsXG4gICAgICB9IGFzIGFueSk7XG5cbiAgICAgIHNuYWNrQmFyUmVmLmluc3RhbmNlID0gY29udGFpbmVyLmF0dGFjaFRlbXBsYXRlUG9ydGFsKHBvcnRhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGluamVjdG9yID0gdGhpcy5fY3JlYXRlSW5qZWN0b3IoY29uZmlnLCBzbmFja0JhclJlZik7XG4gICAgICBjb25zdCBwb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKGNvbnRlbnQsIHVuZGVmaW5lZCwgaW5qZWN0b3IpO1xuICAgICAgY29uc3QgY29udGVudFJlZiA9IGNvbnRhaW5lci5hdHRhY2hDb21wb25lbnRQb3J0YWw8VD4ocG9ydGFsKTtcblxuICAgICAgLy8gV2UgY2FuJ3QgcGFzcyB0aGlzIHZpYSB0aGUgaW5qZWN0b3IsIGJlY2F1c2UgdGhlIGluamVjdG9yIGlzIGNyZWF0ZWQgZWFybGllci5cbiAgICAgIHNuYWNrQmFyUmVmLmluc3RhbmNlID0gY29udGVudFJlZi5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICAvLyBTdWJzY3JpYmUgdG8gdGhlIGJyZWFrcG9pbnQgb2JzZXJ2ZXIgYW5kIGF0dGFjaCB0aGUgbWF0LXNuYWNrLWJhci1oYW5kc2V0IGNsYXNzIGFzXG4gICAgLy8gYXBwcm9wcmlhdGUuIFRoaXMgY2xhc3MgaXMgYXBwbGllZCB0byB0aGUgb3ZlcmxheSBlbGVtZW50IGJlY2F1c2UgdGhlIG92ZXJsYXkgbXVzdCBleHBhbmQgdG9cbiAgICAvLyBmaWxsIHRoZSB3aWR0aCBvZiB0aGUgc2NyZWVuIGZvciBmdWxsIHdpZHRoIHNuYWNrYmFycy5cbiAgICB0aGlzLl9icmVha3BvaW50T2JzZXJ2ZXJcbiAgICAgIC5vYnNlcnZlKEJyZWFrcG9pbnRzLkhhbmRzZXRQb3J0cmFpdClcbiAgICAgIC5waXBlKHRha2VVbnRpbChvdmVybGF5UmVmLmRldGFjaG1lbnRzKCkpKVxuICAgICAgLnN1YnNjcmliZShzdGF0ZSA9PiB7XG4gICAgICAgIG92ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLmhhbmRzZXRDc3NDbGFzcywgc3RhdGUubWF0Y2hlcyk7XG4gICAgICB9KTtcblxuICAgIGlmIChjb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSkge1xuICAgICAgLy8gV2FpdCB1bnRpbCB0aGUgc25hY2sgYmFyIGNvbnRlbnRzIGhhdmUgYmVlbiBhbm5vdW5jZWQgdGhlbiBkZWxpdmVyIHRoaXMgbWVzc2FnZS5cbiAgICAgIGNvbnRhaW5lci5fb25Bbm5vdW5jZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9saXZlLmFubm91bmNlKGNvbmZpZy5hbm5vdW5jZW1lbnRNZXNzYWdlISwgY29uZmlnLnBvbGl0ZW5lc3MpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fYW5pbWF0ZVNuYWNrQmFyKHNuYWNrQmFyUmVmLCBjb25maWcpO1xuICAgIHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmID0gc25hY2tCYXJSZWY7XG4gICAgcmV0dXJuIHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmO1xuICB9XG5cbiAgLyoqIEFuaW1hdGVzIHRoZSBvbGQgc25hY2sgYmFyIG91dCBhbmQgdGhlIG5ldyBvbmUgaW4uICovXG4gIHByaXZhdGUgX2FuaW1hdGVTbmFja0JhcihzbmFja0JhclJlZjogTWF0U25hY2tCYXJSZWY8YW55PiwgY29uZmlnOiBNYXRTbmFja0JhckNvbmZpZykge1xuICAgIC8vIFdoZW4gdGhlIHNuYWNrYmFyIGlzIGRpc21pc3NlZCwgY2xlYXIgdGhlIHJlZmVyZW5jZSB0byBpdC5cbiAgICBzbmFja0JhclJlZi5hZnRlckRpc21pc3NlZCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBDbGVhciB0aGUgc25hY2tiYXIgcmVmIGlmIGl0IGhhc24ndCBhbHJlYWR5IGJlZW4gcmVwbGFjZWQgYnkgYSBuZXdlciBzbmFja2Jhci5cbiAgICAgIGlmICh0aGlzLl9vcGVuZWRTbmFja0JhclJlZiA9PSBzbmFja0JhclJlZikge1xuICAgICAgICB0aGlzLl9vcGVuZWRTbmFja0JhclJlZiA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSkge1xuICAgICAgICB0aGlzLl9saXZlLmNsZWFyKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fb3BlbmVkU25hY2tCYXJSZWYpIHtcbiAgICAgIC8vIElmIGEgc25hY2sgYmFyIGlzIGFscmVhZHkgaW4gdmlldywgZGlzbWlzcyBpdCBhbmQgZW50ZXIgdGhlXG4gICAgICAvLyBuZXcgc25hY2sgYmFyIGFmdGVyIGV4aXQgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLlxuICAgICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBzbmFja0JhclJlZi5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9vcGVuZWRTbmFja0JhclJlZi5kaXNtaXNzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIG5vIHNuYWNrIGJhciBpcyBpbiB2aWV3LCBlbnRlciB0aGUgbmV3IHNuYWNrIGJhci5cbiAgICAgIHNuYWNrQmFyUmVmLmNvbnRhaW5lckluc3RhbmNlLmVudGVyKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgYSBkaXNtaXNzIHRpbWVvdXQgaXMgcHJvdmlkZWQsIHNldCB1cCBkaXNtaXNzIGJhc2VkIG9uIGFmdGVyIHRoZSBzbmFja2JhciBpcyBvcGVuZWQuXG4gICAgaWYgKGNvbmZpZy5kdXJhdGlvbiAmJiBjb25maWcuZHVyYXRpb24gPiAwKSB7XG4gICAgICBzbmFja0JhclJlZi5hZnRlck9wZW5lZCgpLnN1YnNjcmliZSgoKSA9PiBzbmFja0JhclJlZi5fZGlzbWlzc0FmdGVyKGNvbmZpZy5kdXJhdGlvbiEpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBvdmVybGF5IGFuZCBwbGFjZXMgaXQgaW4gdGhlIGNvcnJlY3QgbG9jYXRpb24uXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIHVzZXItc3BlY2lmaWVkIHNuYWNrIGJhciBjb25maWcuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KGNvbmZpZzogTWF0U25hY2tCYXJDb25maWcpOiBPdmVybGF5UmVmIHtcbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gbmV3IE92ZXJsYXlDb25maWcoKTtcbiAgICBvdmVybGF5Q29uZmlnLmRpcmVjdGlvbiA9IGNvbmZpZy5kaXJlY3Rpb247XG5cbiAgICBsZXQgcG9zaXRpb25TdHJhdGVneSA9IHRoaXMuX292ZXJsYXkucG9zaXRpb24oKS5nbG9iYWwoKTtcbiAgICAvLyBTZXQgaG9yaXpvbnRhbCBwb3NpdGlvbi5cbiAgICBjb25zdCBpc1J0bCA9IGNvbmZpZy5kaXJlY3Rpb24gPT09ICdydGwnO1xuICAgIGNvbnN0IGlzTGVmdCA9XG4gICAgICBjb25maWcuaG9yaXpvbnRhbFBvc2l0aW9uID09PSAnbGVmdCcgfHxcbiAgICAgIChjb25maWcuaG9yaXpvbnRhbFBvc2l0aW9uID09PSAnc3RhcnQnICYmICFpc1J0bCkgfHxcbiAgICAgIChjb25maWcuaG9yaXpvbnRhbFBvc2l0aW9uID09PSAnZW5kJyAmJiBpc1J0bCk7XG4gICAgY29uc3QgaXNSaWdodCA9ICFpc0xlZnQgJiYgY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiAhPT0gJ2NlbnRlcic7XG4gICAgaWYgKGlzTGVmdCkge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS5sZWZ0KCcwJyk7XG4gICAgfSBlbHNlIGlmIChpc1JpZ2h0KSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LnJpZ2h0KCcwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3kuY2VudGVySG9yaXpvbnRhbGx5KCk7XG4gICAgfVxuICAgIC8vIFNldCBob3Jpem9udGFsIHBvc2l0aW9uLlxuICAgIGlmIChjb25maWcudmVydGljYWxQb3NpdGlvbiA9PT0gJ3RvcCcpIHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3kudG9wKCcwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3kuYm90dG9tKCcwJyk7XG4gICAgfVxuXG4gICAgb3ZlcmxheUNvbmZpZy5wb3NpdGlvblN0cmF0ZWd5ID0gcG9zaXRpb25TdHJhdGVneTtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheS5jcmVhdGUob3ZlcmxheUNvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbmplY3RvciB0byBiZSB1c2VkIGluc2lkZSBvZiBhIHNuYWNrIGJhciBjb21wb25lbnQuXG4gICAqIEBwYXJhbSBjb25maWcgQ29uZmlnIHRoYXQgd2FzIHVzZWQgdG8gY3JlYXRlIHRoZSBzbmFjayBiYXIuXG4gICAqIEBwYXJhbSBzbmFja0JhclJlZiBSZWZlcmVuY2UgdG8gdGhlIHNuYWNrIGJhci5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZUluamVjdG9yPFQ+KGNvbmZpZzogTWF0U25hY2tCYXJDb25maWcsIHNuYWNrQmFyUmVmOiBNYXRTbmFja0JhclJlZjxUPik6IEluamVjdG9yIHtcbiAgICBjb25zdCB1c2VySW5qZWN0b3IgPSBjb25maWcgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYuaW5qZWN0b3I7XG5cbiAgICByZXR1cm4gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHBhcmVudDogdXNlckluamVjdG9yIHx8IHRoaXMuX2luamVjdG9yLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtwcm92aWRlOiBNYXRTbmFja0JhclJlZiwgdXNlVmFsdWU6IHNuYWNrQmFyUmVmfSxcbiAgICAgICAge3Byb3ZpZGU6IE1BVF9TTkFDS19CQVJfREFUQSwgdXNlVmFsdWU6IGNvbmZpZy5kYXRhfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTZXJ2aWNlIHRvIGRpc3BhdGNoIE1hdGVyaWFsIERlc2lnbiBzbmFjayBiYXIgbWVzc2FnZXMuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiBNYXRTbmFja0Jhck1vZHVsZX0pXG5leHBvcnQgY2xhc3MgTWF0U25hY2tCYXIgZXh0ZW5kcyBfTWF0U25hY2tCYXJCYXNlIHtcbiAgcHJvdGVjdGVkIHNpbXBsZVNuYWNrQmFyQ29tcG9uZW50ID0gU2ltcGxlU25hY2tCYXI7XG4gIHByb3RlY3RlZCBzbmFja0JhckNvbnRhaW5lckNvbXBvbmVudCA9IE1hdFNuYWNrQmFyQ29udGFpbmVyO1xuICBwcm90ZWN0ZWQgaGFuZHNldENzc0NsYXNzID0gJ21hdC1zbmFjay1iYXItaGFuZHNldCc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgb3ZlcmxheTogT3ZlcmxheSxcbiAgICBsaXZlOiBMaXZlQW5ub3VuY2VyLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBicmVha3BvaW50T2JzZXJ2ZXI6IEJyZWFrcG9pbnRPYnNlcnZlcixcbiAgICBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBwYXJlbnRTbmFja0JhcjogTWF0U25hY2tCYXIsXG4gICAgQEluamVjdChNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdENvbmZpZzogTWF0U25hY2tCYXJDb25maWcsXG4gICkge1xuICAgIHN1cGVyKG92ZXJsYXksIGxpdmUsIGluamVjdG9yLCBicmVha3BvaW50T2JzZXJ2ZXIsIHBhcmVudFNuYWNrQmFyLCBkZWZhdWx0Q29uZmlnKTtcbiAgfVxufVxuIl19