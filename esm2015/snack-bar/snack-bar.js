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
import * as i4 from "./snack-bar-module";
/** Injection token that can be used to specify default snack bar. */
export const MAT_SNACK_BAR_DEFAULT_OPTIONS = new InjectionToken('mat-snack-bar-default-options', {
    providedIn: 'root',
    factory: MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY,
});
/** @docs-private */
export function MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY() {
    return new MatSnackBarConfig();
}
/**
 * Service to dispatch Material Design snack bar messages.
 */
export class MatSnackBar {
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
        /** The CSS class to applie for handset mode. */
        this.handsetCssClass = 'mat-snack-bar-handset';
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
        const _config = Object.assign(Object.assign({}, this._defaultConfig), config);
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
            providers: [{ provide: MatSnackBarConfig, useValue: config }]
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
        const config = Object.assign(Object.assign(Object.assign({}, new MatSnackBarConfig()), this._defaultConfig), userConfig);
        const overlayRef = this._createOverlay(config);
        const container = this._attachSnackBarContainer(overlayRef, config);
        const snackBarRef = new MatSnackBarRef(container, overlayRef);
        if (content instanceof TemplateRef) {
            const portal = new TemplatePortal(content, null, {
                $implicit: config.data,
                snackBarRef
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
        this._breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(takeUntil(overlayRef.detachments())).subscribe(state => {
            const classList = overlayRef.overlayElement.classList;
            state.matches ? classList.add(this.handsetCssClass) : classList.remove(this.handsetCssClass);
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
        const isLeft = (config.horizontalPosition === 'left' ||
            (config.horizontalPosition === 'start' && !isRtl) ||
            (config.horizontalPosition === 'end' && isRtl));
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
                { provide: MAT_SNACK_BAR_DATA, useValue: config.data }
            ]
        });
    }
}
MatSnackBar.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatSnackBar_Factory() { return new MatSnackBar(i0.ɵɵinject(i1.Overlay), i0.ɵɵinject(i2.LiveAnnouncer), i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(i3.BreakpointObserver), i0.ɵɵinject(MatSnackBar, 12), i0.ɵɵinject(MAT_SNACK_BAR_DEFAULT_OPTIONS)); }, token: MatSnackBar, providedIn: i4.MatSnackBarModule });
MatSnackBar.decorators = [
    { type: Injectable, args: [{ providedIn: MatSnackBarModule },] }
];
MatSnackBar.ctorParameters = () => [
    { type: Overlay },
    { type: LiveAnnouncer },
    { type: Injector },
    { type: BreakpointObserver },
    { type: MatSnackBar, decorators: [{ type: Optional }, { type: SkipSelf }] },
    { type: MatSnackBarConfig, decorators: [{ type: Inject, args: [MAT_SNACK_BAR_DEFAULT_OPTIONS,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NuYWNrLWJhci9zbmFjay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxXQUFXLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRSxPQUFPLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBYSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxlQUFlLEVBQWlCLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25GLE9BQU8sRUFHTCxNQUFNLEVBQ04sVUFBVSxFQUNWLGNBQWMsRUFDZCxRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVEsRUFDUixXQUFXLEdBRVosTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBbUIsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDcEUsT0FBTyxFQUFDLGtCQUFrQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDekUsT0FBTyxFQUFDLG9CQUFvQixFQUFxQixNQUFNLHVCQUF1QixDQUFDO0FBQy9FLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7O0FBRy9DLHFFQUFxRTtBQUNyRSxNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FDdEMsSUFBSSxjQUFjLENBQW9CLCtCQUErQixFQUFFO0lBQ3JFLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSxxQ0FBcUM7Q0FDL0MsQ0FBQyxDQUFDO0FBRVAsb0JBQW9CO0FBQ3BCLE1B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QzlCO1FBRUQsYUFBYSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO1FBQ2xELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxlQUFlLENBQUksTUFBeUIsRUFBRSxXQUE4QjtRQUNsRixNQUFNLFlBQVksR0FBRyxNQUFNLElBQUksTUFBTSxDQUFDLGdCQUFnQixJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7UUFFM0YsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ3JCLE1BQU0sRUFBRSxZQUFZLElBQUksSUFBSSxDQUFDLFNBQVM7WUFDdEMsU0FBUyxFQUFFO2dCQUNULEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFDO2dCQUNoRCxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBQzthQUNyRDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Ozs7WUE3UEYsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLGlCQUFpQixFQUFDOzs7WUFyQ25DLE9BQU87WUFGUCxhQUFhO1lBVW5CLFFBQVE7WUFURixrQkFBa0I7WUEyRTZCLFdBQVcsdUJBQTNELFFBQVEsWUFBSSxRQUFRO1lBMURDLGlCQUFpQix1QkEyRHRDLE1BQU0sU0FBQyw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtMaXZlQW5ub3VuY2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0JyZWFrcG9pbnRPYnNlcnZlciwgQnJlYWtwb2ludHN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9sYXlvdXQnO1xuaW1wb3J0IHtPdmVybGF5LCBPdmVybGF5Q29uZmlnLCBPdmVybGF5UmVmfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0NvbXBvbmVudFBvcnRhbCwgQ29tcG9uZW50VHlwZSwgVGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50UmVmLFxuICBFbWJlZGRlZFZpZXdSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdG9yLFxuICBPcHRpb25hbCxcbiAgU2tpcFNlbGYsXG4gIFRlbXBsYXRlUmVmLFxuICBPbkRlc3Ryb3ksIFR5cGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7VGV4dE9ubHlTbmFja0JhciwgU2ltcGxlU25hY2tCYXJ9IGZyb20gJy4vc2ltcGxlLXNuYWNrLWJhcic7XG5pbXBvcnQge01BVF9TTkFDS19CQVJfREFUQSwgTWF0U25hY2tCYXJDb25maWd9IGZyb20gJy4vc25hY2stYmFyLWNvbmZpZyc7XG5pbXBvcnQge01hdFNuYWNrQmFyQ29udGFpbmVyLCBfU25hY2tCYXJDb250YWluZXJ9IGZyb20gJy4vc25hY2stYmFyLWNvbnRhaW5lcic7XG5pbXBvcnQge01hdFNuYWNrQmFyTW9kdWxlfSBmcm9tICcuL3NuYWNrLWJhci1tb2R1bGUnO1xuaW1wb3J0IHtNYXRTbmFja0JhclJlZn0gZnJvbSAnLi9zbmFjay1iYXItcmVmJztcblxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBkZWZhdWx0IHNuYWNrIGJhci4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdFNuYWNrQmFyQ29uZmlnPignbWF0LXNuYWNrLWJhci1kZWZhdWx0LW9wdGlvbnMnLCB7XG4gICAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgICBmYWN0b3J5OiBNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZLFxuICAgIH0pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0U25hY2tCYXJDb25maWcge1xuICByZXR1cm4gbmV3IE1hdFNuYWNrQmFyQ29uZmlnKCk7XG59XG5cbi8qKlxuICogU2VydmljZSB0byBkaXNwYXRjaCBNYXRlcmlhbCBEZXNpZ24gc25hY2sgYmFyIG1lc3NhZ2VzLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogTWF0U25hY2tCYXJNb2R1bGV9KVxuZXhwb3J0IGNsYXNzIE1hdFNuYWNrQmFyIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCBzbmFjayBiYXIgaW4gdGhlIHZpZXcgKmF0IHRoaXMgbGV2ZWwqIChpbiB0aGUgQW5ndWxhciBpbmplY3RvciB0cmVlKS5cbiAgICogSWYgdGhlcmUgaXMgYSBwYXJlbnQgc25hY2stYmFyIHNlcnZpY2UsIGFsbCBvcGVyYXRpb25zIHNob3VsZCBkZWxlZ2F0ZSB0byB0aGF0IHBhcmVudFxuICAgKiB2aWEgYF9vcGVuZWRTbmFja0JhclJlZmAuXG4gICAqL1xuICBwcml2YXRlIF9zbmFja0JhclJlZkF0VGhpc0xldmVsOiBNYXRTbmFja0JhclJlZjxhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFRoZSBjb21wb25lbnQgdGhhdCBzaG91bGQgYmUgcmVuZGVyZWQgYXMgdGhlIHNuYWNrIGJhcidzIHNpbXBsZSBjb21wb25lbnQuICovXG4gIHByb3RlY3RlZCBzaW1wbGVTbmFja0JhckNvbXBvbmVudDogVHlwZTxUZXh0T25seVNuYWNrQmFyPiA9IFNpbXBsZVNuYWNrQmFyO1xuXG4gIC8qKiBUaGUgY29udGFpbmVyIGNvbXBvbmVudCB0aGF0IGF0dGFjaGVzIHRoZSBwcm92aWRlZCB0ZW1wbGF0ZSBvciBjb21wb25lbnQuICovXG4gIHByb3RlY3RlZCBzbmFja0JhckNvbnRhaW5lckNvbXBvbmVudDogVHlwZTxfU25hY2tCYXJDb250YWluZXI+ID0gTWF0U25hY2tCYXJDb250YWluZXI7XG5cbiAgLyoqIFRoZSBDU1MgY2xhc3MgdG8gYXBwbGllIGZvciBoYW5kc2V0IG1vZGUuICovXG4gIHByb3RlY3RlZCBoYW5kc2V0Q3NzQ2xhc3MgPSAnbWF0LXNuYWNrLWJhci1oYW5kc2V0JztcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50bHkgb3BlbmVkIHNuYWNrYmFyIGF0ICphbnkqIGxldmVsLiAqL1xuICBnZXQgX29wZW5lZFNuYWNrQmFyUmVmKCk6IE1hdFNuYWNrQmFyUmVmPGFueT4gfCBudWxsIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9wYXJlbnRTbmFja0JhcjtcbiAgICByZXR1cm4gcGFyZW50ID8gcGFyZW50Ll9vcGVuZWRTbmFja0JhclJlZiA6IHRoaXMuX3NuYWNrQmFyUmVmQXRUaGlzTGV2ZWw7XG4gIH1cblxuICBzZXQgX29wZW5lZFNuYWNrQmFyUmVmKHZhbHVlOiBNYXRTbmFja0JhclJlZjxhbnk+IHwgbnVsbCkge1xuICAgIGlmICh0aGlzLl9wYXJlbnRTbmFja0Jhcikge1xuICAgICAgdGhpcy5fcGFyZW50U25hY2tCYXIuX29wZW5lZFNuYWNrQmFyUmVmID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NuYWNrQmFyUmVmQXRUaGlzTGV2ZWwgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgICBwcml2YXRlIF9saXZlOiBMaXZlQW5ub3VuY2VyLFxuICAgICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgICAgcHJpdmF0ZSBfYnJlYWtwb2ludE9ic2VydmVyOiBCcmVha3BvaW50T2JzZXJ2ZXIsXG4gICAgICBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBwcml2YXRlIF9wYXJlbnRTbmFja0JhcjogTWF0U25hY2tCYXIsXG4gICAgICBASW5qZWN0KE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TKSBwcml2YXRlIF9kZWZhdWx0Q29uZmlnOiBNYXRTbmFja0JhckNvbmZpZykge31cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbmQgZGlzcGF0Y2hlcyBhIHNuYWNrIGJhciB3aXRoIGEgY3VzdG9tIGNvbXBvbmVudCBmb3IgdGhlIGNvbnRlbnQsIHJlbW92aW5nIGFueVxuICAgKiBjdXJyZW50bHkgb3BlbmVkIHNuYWNrIGJhcnMuXG4gICAqXG4gICAqIEBwYXJhbSBjb21wb25lbnQgQ29tcG9uZW50IHRvIGJlIGluc3RhbnRpYXRlZC5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIGZvciB0aGUgc25hY2sgYmFyLlxuICAgKi9cbiAgb3BlbkZyb21Db21wb25lbnQ8VD4oY29tcG9uZW50OiBDb21wb25lbnRUeXBlPFQ+LCBjb25maWc/OiBNYXRTbmFja0JhckNvbmZpZyk6XG4gICAgICBNYXRTbmFja0JhclJlZjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dGFjaChjb21wb25lbnQsIGNvbmZpZykgYXMgTWF0U25hY2tCYXJSZWY8VD47XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbmQgZGlzcGF0Y2hlcyBhIHNuYWNrIGJhciB3aXRoIGEgY3VzdG9tIHRlbXBsYXRlIGZvciB0aGUgY29udGVudCwgcmVtb3ZpbmcgYW55XG4gICAqIGN1cnJlbnRseSBvcGVuZWQgc25hY2sgYmFycy5cbiAgICpcbiAgICogQHBhcmFtIHRlbXBsYXRlIFRlbXBsYXRlIHRvIGJlIGluc3RhbnRpYXRlZC5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIGZvciB0aGUgc25hY2sgYmFyLlxuICAgKi9cbiAgb3BlbkZyb21UZW1wbGF0ZSh0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiwgY29uZmlnPzogTWF0U25hY2tCYXJDb25maWcpOlxuICAgICAgTWF0U25hY2tCYXJSZWY8RW1iZWRkZWRWaWV3UmVmPGFueT4+IHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoKHRlbXBsYXRlLCBjb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGEgc25hY2tiYXIgd2l0aCBhIG1lc3NhZ2UgYW5kIGFuIG9wdGlvbmFsIGFjdGlvbi5cbiAgICogQHBhcmFtIG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gc2hvdyBpbiB0aGUgc25hY2tiYXIuXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGxhYmVsIGZvciB0aGUgc25hY2tiYXIgYWN0aW9uLlxuICAgKiBAcGFyYW0gY29uZmlnIEFkZGl0aW9uYWwgY29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgc25hY2tiYXIuXG4gICAqL1xuICBvcGVuKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uOiBzdHJpbmcgPSAnJywgY29uZmlnPzogTWF0U25hY2tCYXJDb25maWcpOlxuICAgICAgTWF0U25hY2tCYXJSZWY8VGV4dE9ubHlTbmFja0Jhcj4ge1xuICAgIGNvbnN0IF9jb25maWcgPSB7Li4udGhpcy5fZGVmYXVsdENvbmZpZywgLi4uY29uZmlnfTtcblxuICAgIC8vIFNpbmNlIHRoZSB1c2VyIGRvZXNuJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhlIGNvbXBvbmVudCwgd2UgY2FuXG4gICAgLy8gb3ZlcnJpZGUgdGhlIGRhdGEgdG8gcGFzcyBpbiBvdXIgb3duIG1lc3NhZ2UgYW5kIGFjdGlvbi5cbiAgICBfY29uZmlnLmRhdGEgPSB7bWVzc2FnZSwgYWN0aW9ufTtcblxuICAgIC8vIFNpbmNlIHRoZSBzbmFjayBiYXIgaGFzIGByb2xlPVwiYWxlcnRcImAsIHdlIGRvbid0XG4gICAgLy8gd2FudCB0byBhbm5vdW5jZSB0aGUgc2FtZSBtZXNzYWdlIHR3aWNlLlxuICAgIGlmIChfY29uZmlnLmFubm91bmNlbWVudE1lc3NhZ2UgPT09IG1lc3NhZ2UpIHtcbiAgICAgIF9jb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vcGVuRnJvbUNvbXBvbmVudCh0aGlzLnNpbXBsZVNuYWNrQmFyQ29tcG9uZW50LCBfY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIGN1cnJlbnRseS12aXNpYmxlIHNuYWNrIGJhci5cbiAgICovXG4gIGRpc21pc3MoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmKSB7XG4gICAgICB0aGlzLl9vcGVuZWRTbmFja0JhclJlZi5kaXNtaXNzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy8gT25seSBkaXNtaXNzIHRoZSBzbmFjayBiYXIgYXQgdGhlIGN1cnJlbnQgbGV2ZWwgb24gZGVzdHJveS5cbiAgICBpZiAodGhpcy5fc25hY2tCYXJSZWZBdFRoaXNMZXZlbCkge1xuICAgICAgdGhpcy5fc25hY2tCYXJSZWZBdFRoaXNMZXZlbC5kaXNtaXNzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHRoZSBzbmFjayBiYXIgY29udGFpbmVyIGNvbXBvbmVudCB0byB0aGUgb3ZlcmxheS5cbiAgICovXG4gIHByaXZhdGUgX2F0dGFjaFNuYWNrQmFyQ29udGFpbmVyKG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBNYXRTbmFja0JhckNvbmZpZyk6IF9TbmFja0JhckNvbnRhaW5lciB7XG5cbiAgICBjb25zdCB1c2VySW5qZWN0b3IgPSBjb25maWcgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYuaW5qZWN0b3I7XG4gICAgY29uc3QgaW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xuICAgICAgcGFyZW50OiB1c2VySW5qZWN0b3IgfHwgdGhpcy5faW5qZWN0b3IsXG4gICAgICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTWF0U25hY2tCYXJDb25maWcsIHVzZVZhbHVlOiBjb25maWd9XVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID1cbiAgICAgICAgbmV3IENvbXBvbmVudFBvcnRhbCh0aGlzLnNuYWNrQmFyQ29udGFpbmVyQ29tcG9uZW50LCBjb25maWcudmlld0NvbnRhaW5lclJlZiwgaW5qZWN0b3IpO1xuICAgIGNvbnN0IGNvbnRhaW5lclJlZjogQ29tcG9uZW50UmVmPF9TbmFja0JhckNvbnRhaW5lcj4gPVxuICAgICAgICBvdmVybGF5UmVmLmF0dGFjaChjb250YWluZXJQb3J0YWwpO1xuICAgIGNvbnRhaW5lclJlZi5pbnN0YW5jZS5zbmFja0JhckNvbmZpZyA9IGNvbmZpZztcbiAgICByZXR1cm4gY29udGFpbmVyUmVmLmluc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsYWNlcyBhIG5ldyBjb21wb25lbnQgb3IgYSB0ZW1wbGF0ZSBhcyB0aGUgY29udGVudCBvZiB0aGUgc25hY2sgYmFyIGNvbnRhaW5lci5cbiAgICovXG4gIHByaXZhdGUgX2F0dGFjaDxUPihjb250ZW50OiBDb21wb25lbnRUeXBlPFQ+IHwgVGVtcGxhdGVSZWY8VD4sIHVzZXJDb25maWc/OiBNYXRTbmFja0JhckNvbmZpZyk6XG4gICAgICBNYXRTbmFja0JhclJlZjxUIHwgRW1iZWRkZWRWaWV3UmVmPGFueT4+IHtcblxuICAgIGNvbnN0IGNvbmZpZyA9IHsuLi5uZXcgTWF0U25hY2tCYXJDb25maWcoKSwgLi4udGhpcy5fZGVmYXVsdENvbmZpZywgLi4udXNlckNvbmZpZ307XG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXkoY29uZmlnKTtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9hdHRhY2hTbmFja0JhckNvbnRhaW5lcihvdmVybGF5UmVmLCBjb25maWcpO1xuICAgIGNvbnN0IHNuYWNrQmFyUmVmID0gbmV3IE1hdFNuYWNrQmFyUmVmPFQgfCBFbWJlZGRlZFZpZXdSZWY8YW55Pj4oY29udGFpbmVyLCBvdmVybGF5UmVmKTtcblxuICAgIGlmIChjb250ZW50IGluc3RhbmNlb2YgVGVtcGxhdGVSZWYpIHtcbiAgICAgIGNvbnN0IHBvcnRhbCA9IG5ldyBUZW1wbGF0ZVBvcnRhbChjb250ZW50LCBudWxsISwge1xuICAgICAgICAkaW1wbGljaXQ6IGNvbmZpZy5kYXRhLFxuICAgICAgICBzbmFja0JhclJlZlxuICAgICAgfSBhcyBhbnkpO1xuXG4gICAgICBzbmFja0JhclJlZi5pbnN0YW5jZSA9IGNvbnRhaW5lci5hdHRhY2hUZW1wbGF0ZVBvcnRhbChwb3J0YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbmplY3RvciA9IHRoaXMuX2NyZWF0ZUluamVjdG9yKGNvbmZpZywgc25hY2tCYXJSZWYpO1xuICAgICAgY29uc3QgcG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChjb250ZW50LCB1bmRlZmluZWQsIGluamVjdG9yKTtcbiAgICAgIGNvbnN0IGNvbnRlbnRSZWYgPSBjb250YWluZXIuYXR0YWNoQ29tcG9uZW50UG9ydGFsPFQ+KHBvcnRhbCk7XG5cbiAgICAgIC8vIFdlIGNhbid0IHBhc3MgdGhpcyB2aWEgdGhlIGluamVjdG9yLCBiZWNhdXNlIHRoZSBpbmplY3RvciBpcyBjcmVhdGVkIGVhcmxpZXIuXG4gICAgICBzbmFja0JhclJlZi5pbnN0YW5jZSA9IGNvbnRlbnRSZWYuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgLy8gU3Vic2NyaWJlIHRvIHRoZSBicmVha3BvaW50IG9ic2VydmVyIGFuZCBhdHRhY2ggdGhlIG1hdC1zbmFjay1iYXItaGFuZHNldCBjbGFzcyBhc1xuICAgIC8vIGFwcHJvcHJpYXRlLiBUaGlzIGNsYXNzIGlzIGFwcGxpZWQgdG8gdGhlIG92ZXJsYXkgZWxlbWVudCBiZWNhdXNlIHRoZSBvdmVybGF5IG11c3QgZXhwYW5kIHRvXG4gICAgLy8gZmlsbCB0aGUgd2lkdGggb2YgdGhlIHNjcmVlbiBmb3IgZnVsbCB3aWR0aCBzbmFja2JhcnMuXG4gICAgdGhpcy5fYnJlYWtwb2ludE9ic2VydmVyLm9ic2VydmUoQnJlYWtwb2ludHMuSGFuZHNldFBvcnRyYWl0KS5waXBlKFxuICAgICAgICB0YWtlVW50aWwob3ZlcmxheVJlZi5kZXRhY2htZW50cygpKVxuICAgICkuc3Vic2NyaWJlKHN0YXRlID0+IHtcbiAgICAgIGNvbnN0IGNsYXNzTGlzdCA9IG92ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgICAgc3RhdGUubWF0Y2hlcyA/IGNsYXNzTGlzdC5hZGQodGhpcy5oYW5kc2V0Q3NzQ2xhc3MpIDogY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmhhbmRzZXRDc3NDbGFzcyk7XG4gICAgfSk7XG5cbiAgICBpZiAoY29uZmlnLmFubm91bmNlbWVudE1lc3NhZ2UpIHtcbiAgICAgIC8vIFdhaXQgdW50aWwgdGhlIHNuYWNrIGJhciBjb250ZW50cyBoYXZlIGJlZW4gYW5ub3VuY2VkIHRoZW4gZGVsaXZlciB0aGlzIG1lc3NhZ2UuXG4gICAgICBjb250YWluZXIuX29uQW5ub3VuY2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fbGl2ZS5hbm5vdW5jZShjb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSEsIGNvbmZpZy5wb2xpdGVuZXNzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX2FuaW1hdGVTbmFja0JhcihzbmFja0JhclJlZiwgY29uZmlnKTtcbiAgICB0aGlzLl9vcGVuZWRTbmFja0JhclJlZiA9IHNuYWNrQmFyUmVmO1xuICAgIHJldHVybiB0aGlzLl9vcGVuZWRTbmFja0JhclJlZjtcbiAgfVxuXG4gIC8qKiBBbmltYXRlcyB0aGUgb2xkIHNuYWNrIGJhciBvdXQgYW5kIHRoZSBuZXcgb25lIGluLiAqL1xuICBwcml2YXRlIF9hbmltYXRlU25hY2tCYXIoc25hY2tCYXJSZWY6IE1hdFNuYWNrQmFyUmVmPGFueT4sIGNvbmZpZzogTWF0U25hY2tCYXJDb25maWcpIHtcbiAgICAvLyBXaGVuIHRoZSBzbmFja2JhciBpcyBkaXNtaXNzZWQsIGNsZWFyIHRoZSByZWZlcmVuY2UgdG8gaXQuXG4gICAgc25hY2tCYXJSZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gQ2xlYXIgdGhlIHNuYWNrYmFyIHJlZiBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuIHJlcGxhY2VkIGJ5IGEgbmV3ZXIgc25hY2tiYXIuXG4gICAgICBpZiAodGhpcy5fb3BlbmVkU25hY2tCYXJSZWYgPT0gc25hY2tCYXJSZWYpIHtcbiAgICAgICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLmFubm91bmNlbWVudE1lc3NhZ2UpIHtcbiAgICAgICAgdGhpcy5fbGl2ZS5jbGVhcigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmKSB7XG4gICAgICAvLyBJZiBhIHNuYWNrIGJhciBpcyBhbHJlYWR5IGluIHZpZXcsIGRpc21pc3MgaXQgYW5kIGVudGVyIHRoZVxuICAgICAgLy8gbmV3IHNuYWNrIGJhciBhZnRlciBleGl0IGFuaW1hdGlvbiBpcyBjb21wbGV0ZS5cbiAgICAgIHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgc25hY2tCYXJSZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYuZGlzbWlzcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBubyBzbmFjayBiYXIgaXMgaW4gdmlldywgZW50ZXIgdGhlIG5ldyBzbmFjayBiYXIuXG4gICAgICBzbmFja0JhclJlZi5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpO1xuICAgIH1cblxuICAgIC8vIElmIGEgZGlzbWlzcyB0aW1lb3V0IGlzIHByb3ZpZGVkLCBzZXQgdXAgZGlzbWlzcyBiYXNlZCBvbiBhZnRlciB0aGUgc25hY2tiYXIgaXMgb3BlbmVkLlxuICAgIGlmIChjb25maWcuZHVyYXRpb24gJiYgY29uZmlnLmR1cmF0aW9uID4gMCkge1xuICAgICAgc25hY2tCYXJSZWYuYWZ0ZXJPcGVuZWQoKS5zdWJzY3JpYmUoKCkgPT4gc25hY2tCYXJSZWYuX2Rpc21pc3NBZnRlcihjb25maWcuZHVyYXRpb24hKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgb3ZlcmxheSBhbmQgcGxhY2VzIGl0IGluIHRoZSBjb3JyZWN0IGxvY2F0aW9uLlxuICAgKiBAcGFyYW0gY29uZmlnIFRoZSB1c2VyLXNwZWNpZmllZCBzbmFjayBiYXIgY29uZmlnLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlT3ZlcmxheShjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnKTogT3ZlcmxheVJlZiB7XG4gICAgY29uc3Qgb3ZlcmxheUNvbmZpZyA9IG5ldyBPdmVybGF5Q29uZmlnKCk7XG4gICAgb3ZlcmxheUNvbmZpZy5kaXJlY3Rpb24gPSBjb25maWcuZGlyZWN0aW9uO1xuXG4gICAgbGV0IHBvc2l0aW9uU3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCk7XG4gICAgLy8gU2V0IGhvcml6b250YWwgcG9zaXRpb24uXG4gICAgY29uc3QgaXNSdGwgPSBjb25maWcuZGlyZWN0aW9uID09PSAncnRsJztcbiAgICBjb25zdCBpc0xlZnQgPSAoXG4gICAgICAgIGNvbmZpZy5ob3Jpem9udGFsUG9zaXRpb24gPT09ICdsZWZ0JyB8fFxuICAgICAgICAoY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ3N0YXJ0JyAmJiAhaXNSdGwpIHx8XG4gICAgICAgIChjb25maWcuaG9yaXpvbnRhbFBvc2l0aW9uID09PSAnZW5kJyAmJiBpc1J0bCkpO1xuICAgIGNvbnN0IGlzUmlnaHQgPSAhaXNMZWZ0ICYmIGNvbmZpZy5ob3Jpem9udGFsUG9zaXRpb24gIT09ICdjZW50ZXInO1xuICAgIGlmIChpc0xlZnQpIHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3kubGVmdCgnMCcpO1xuICAgIH0gZWxzZSBpZiAoaXNSaWdodCkge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS5yaWdodCgnMCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LmNlbnRlckhvcml6b250YWxseSgpO1xuICAgIH1cbiAgICAvLyBTZXQgaG9yaXpvbnRhbCBwb3NpdGlvbi5cbiAgICBpZiAoY29uZmlnLnZlcnRpY2FsUG9zaXRpb24gPT09ICd0b3AnKSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LnRvcCgnMCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LmJvdHRvbSgnMCcpO1xuICAgIH1cblxuICAgIG92ZXJsYXlDb25maWcucG9zaXRpb25TdHJhdGVneSA9IHBvc2l0aW9uU3RyYXRlZ3k7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXkuY3JlYXRlKG92ZXJsYXlDb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5qZWN0b3IgdG8gYmUgdXNlZCBpbnNpZGUgb2YgYSBzbmFjayBiYXIgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY29uZmlnIENvbmZpZyB0aGF0IHdhcyB1c2VkIHRvIGNyZWF0ZSB0aGUgc25hY2sgYmFyLlxuICAgKiBAcGFyYW0gc25hY2tCYXJSZWYgUmVmZXJlbmNlIHRvIHRoZSBzbmFjayBiYXIuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVJbmplY3RvcjxUPihjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnLCBzbmFja0JhclJlZjogTWF0U25hY2tCYXJSZWY8VD4pOiBJbmplY3RvciB7XG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuXG4gICAgcmV0dXJuIEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7cHJvdmlkZTogTWF0U25hY2tCYXJSZWYsIHVzZVZhbHVlOiBzbmFja0JhclJlZn0sXG4gICAgICAgIHtwcm92aWRlOiBNQVRfU05BQ0tfQkFSX0RBVEEsIHVzZVZhbHVlOiBjb25maWcuZGF0YX1cbiAgICAgIF1cbiAgICB9KTtcbiAgfVxufVxuIl19