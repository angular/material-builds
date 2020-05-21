import { __decorate, __metadata, __param } from "tslib";
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
let MatSnackBar = /** @class */ (() => {
    let MatSnackBar = class MatSnackBar {
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
            const injector = new PortalInjector(userInjector || this._injector, new WeakMap([
                [MatSnackBarConfig, config]
            ]));
            const containerPortal = new ComponentPortal(MatSnackBarContainer, config.viewContainerRef, injector);
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
                const className = 'mat-snack-bar-handset';
                state.matches ? classList.add(className) : classList.remove(className);
            });
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
            if (config.announcementMessage) {
                this._live.announce(config.announcementMessage, config.politeness);
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
            return new PortalInjector(userInjector || this._injector, new WeakMap([
                [MatSnackBarRef, snackBarRef],
                [MAT_SNACK_BAR_DATA, config.data]
            ]));
        }
    };
    MatSnackBar.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatSnackBar_Factory() { return new MatSnackBar(i0.ɵɵinject(i1.Overlay), i0.ɵɵinject(i2.LiveAnnouncer), i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(i3.BreakpointObserver), i0.ɵɵinject(MatSnackBar, 12), i0.ɵɵinject(MAT_SNACK_BAR_DEFAULT_OPTIONS)); }, token: MatSnackBar, providedIn: i4.MatSnackBarModule });
    MatSnackBar = __decorate([
        Injectable({ providedIn: MatSnackBarModule }),
        __param(4, Optional()), __param(4, SkipSelf()),
        __param(5, Inject(MAT_SNACK_BAR_DEFAULT_OPTIONS)),
        __metadata("design:paramtypes", [Overlay,
            LiveAnnouncer,
            Injector,
            BreakpointObserver,
            MatSnackBar,
            MatSnackBarConfig])
    ], MatSnackBar);
    return MatSnackBar;
})();
export { MatSnackBar };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NuYWNrLWJhci9zbmFjay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsV0FBVyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDcEUsT0FBTyxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQWEsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsZUFBZSxFQUFpQixjQUFjLEVBQUUsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkcsT0FBTyxFQUdMLE1BQU0sRUFDTixVQUFVLEVBQ1YsY0FBYyxFQUNkLFFBQVEsRUFDUixRQUFRLEVBQ1IsUUFBUSxFQUNSLFdBQVcsR0FFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3pFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7O0FBRy9DLHFFQUFxRTtBQUNyRSxNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FDdEMsSUFBSSxjQUFjLENBQW9CLCtCQUErQixFQUFFO0lBQ3JFLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSxxQ0FBcUM7Q0FDL0MsQ0FBQyxDQUFDO0FBRVAsb0JBQW9C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LENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO1lBRTNGLE9BQU8sSUFBSSxjQUFjLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxPQUFPLENBQVc7Z0JBQzlFLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQztnQkFDN0IsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDO2FBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQztLQUNGLENBQUE7O0lBOU9ZLFdBQVc7UUFEdkIsVUFBVSxDQUFDLEVBQUMsVUFBVSxFQUFFLGlCQUFpQixFQUFDLENBQUM7UUE0QnJDLFdBQUEsUUFBUSxFQUFFLENBQUEsRUFBRSxXQUFBLFFBQVEsRUFBRSxDQUFBO1FBQ3RCLFdBQUEsTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUE7eUNBTHBCLE9BQU87WUFDVixhQUFhO1lBQ1QsUUFBUTtZQUNFLGtCQUFrQjtZQUNFLFdBQVc7WUFDRyxpQkFBaUI7T0E1QnpFLFdBQVcsQ0E4T3ZCO3NCQTlSRDtLQThSQztTQTlPWSxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TGl2ZUFubm91bmNlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCcmVha3BvaW50T2JzZXJ2ZXIsIEJyZWFrcG9pbnRzfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7T3ZlcmxheSwgT3ZlcmxheUNvbmZpZywgT3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21wb25lbnRQb3J0YWwsIENvbXBvbmVudFR5cGUsIFBvcnRhbEluamVjdG9yLCBUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBDb21wb25lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgSW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIE9wdGlvbmFsLFxuICBTa2lwU2VsZixcbiAgVGVtcGxhdGVSZWYsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3Rha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtTaW1wbGVTbmFja0Jhcn0gZnJvbSAnLi9zaW1wbGUtc25hY2stYmFyJztcbmltcG9ydCB7TUFUX1NOQUNLX0JBUl9EQVRBLCBNYXRTbmFja0JhckNvbmZpZ30gZnJvbSAnLi9zbmFjay1iYXItY29uZmlnJztcbmltcG9ydCB7TWF0U25hY2tCYXJDb250YWluZXJ9IGZyb20gJy4vc25hY2stYmFyLWNvbnRhaW5lcic7XG5pbXBvcnQge01hdFNuYWNrQmFyTW9kdWxlfSBmcm9tICcuL3NuYWNrLWJhci1tb2R1bGUnO1xuaW1wb3J0IHtNYXRTbmFja0JhclJlZn0gZnJvbSAnLi9zbmFjay1iYXItcmVmJztcblxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBkZWZhdWx0IHNuYWNrIGJhci4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdFNuYWNrQmFyQ29uZmlnPignbWF0LXNuYWNrLWJhci1kZWZhdWx0LW9wdGlvbnMnLCB7XG4gICAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgICBmYWN0b3J5OiBNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZLFxuICAgIH0pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0U25hY2tCYXJDb25maWcge1xuICByZXR1cm4gbmV3IE1hdFNuYWNrQmFyQ29uZmlnKCk7XG59XG5cbi8qKlxuICogU2VydmljZSB0byBkaXNwYXRjaCBNYXRlcmlhbCBEZXNpZ24gc25hY2sgYmFyIG1lc3NhZ2VzLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogTWF0U25hY2tCYXJNb2R1bGV9KVxuZXhwb3J0IGNsYXNzIE1hdFNuYWNrQmFyIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCBzbmFjayBiYXIgaW4gdGhlIHZpZXcgKmF0IHRoaXMgbGV2ZWwqIChpbiB0aGUgQW5ndWxhciBpbmplY3RvciB0cmVlKS5cbiAgICogSWYgdGhlcmUgaXMgYSBwYXJlbnQgc25hY2stYmFyIHNlcnZpY2UsIGFsbCBvcGVyYXRpb25zIHNob3VsZCBkZWxlZ2F0ZSB0byB0aGF0IHBhcmVudFxuICAgKiB2aWEgYF9vcGVuZWRTbmFja0JhclJlZmAuXG4gICAqL1xuICBwcml2YXRlIF9zbmFja0JhclJlZkF0VGhpc0xldmVsOiBNYXRTbmFja0JhclJlZjxhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudGx5IG9wZW5lZCBzbmFja2JhciBhdCAqYW55KiBsZXZlbC4gKi9cbiAgZ2V0IF9vcGVuZWRTbmFja0JhclJlZigpOiBNYXRTbmFja0JhclJlZjxhbnk+IHwgbnVsbCB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50U25hY2tCYXI7XG4gICAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5fb3BlbmVkU25hY2tCYXJSZWYgOiB0aGlzLl9zbmFja0JhclJlZkF0VGhpc0xldmVsO1xuICB9XG5cbiAgc2V0IF9vcGVuZWRTbmFja0JhclJlZih2YWx1ZTogTWF0U25hY2tCYXJSZWY8YW55PiB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fcGFyZW50U25hY2tCYXIpIHtcbiAgICAgIHRoaXMuX3BhcmVudFNuYWNrQmFyLl9vcGVuZWRTbmFja0JhclJlZiA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zbmFja0JhclJlZkF0VGhpc0xldmVsID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgICAgcHJpdmF0ZSBfbGl2ZTogTGl2ZUFubm91bmNlcixcbiAgICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICAgIHByaXZhdGUgX2JyZWFrcG9pbnRPYnNlcnZlcjogQnJlYWtwb2ludE9ic2VydmVyLFxuICAgICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcHJpdmF0ZSBfcGFyZW50U25hY2tCYXI6IE1hdFNuYWNrQmFyLFxuICAgICAgQEluamVjdChNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OUykgcHJpdmF0ZSBfZGVmYXVsdENvbmZpZzogTWF0U25hY2tCYXJDb25maWcpIHt9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW5kIGRpc3BhdGNoZXMgYSBzbmFjayBiYXIgd2l0aCBhIGN1c3RvbSBjb21wb25lbnQgZm9yIHRoZSBjb250ZW50LCByZW1vdmluZyBhbnlcbiAgICogY3VycmVudGx5IG9wZW5lZCBzbmFjayBiYXJzLlxuICAgKlxuICAgKiBAcGFyYW0gY29tcG9uZW50IENvbXBvbmVudCB0byBiZSBpbnN0YW50aWF0ZWQuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNuYWNrIGJhci5cbiAgICovXG4gIG9wZW5Gcm9tQ29tcG9uZW50PFQ+KGNvbXBvbmVudDogQ29tcG9uZW50VHlwZTxUPiwgY29uZmlnPzogTWF0U25hY2tCYXJDb25maWcpOlxuICAgIE1hdFNuYWNrQmFyUmVmPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoKGNvbXBvbmVudCwgY29uZmlnKSBhcyBNYXRTbmFja0JhclJlZjxUPjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuZCBkaXNwYXRjaGVzIGEgc25hY2sgYmFyIHdpdGggYSBjdXN0b20gdGVtcGxhdGUgZm9yIHRoZSBjb250ZW50LCByZW1vdmluZyBhbnlcbiAgICogY3VycmVudGx5IG9wZW5lZCBzbmFjayBiYXJzLlxuICAgKlxuICAgKiBAcGFyYW0gdGVtcGxhdGUgVGVtcGxhdGUgdG8gYmUgaW5zdGFudGlhdGVkLlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzbmFjayBiYXIuXG4gICAqL1xuICBvcGVuRnJvbVRlbXBsYXRlKHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+LCBjb25maWc/OiBNYXRTbmFja0JhckNvbmZpZyk6XG4gICAgTWF0U25hY2tCYXJSZWY8RW1iZWRkZWRWaWV3UmVmPGFueT4+IHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoKHRlbXBsYXRlLCBjb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGEgc25hY2tiYXIgd2l0aCBhIG1lc3NhZ2UgYW5kIGFuIG9wdGlvbmFsIGFjdGlvbi5cbiAgICogQHBhcmFtIG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gc2hvdyBpbiB0aGUgc25hY2tiYXIuXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGxhYmVsIGZvciB0aGUgc25hY2tiYXIgYWN0aW9uLlxuICAgKiBAcGFyYW0gY29uZmlnIEFkZGl0aW9uYWwgY29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgc25hY2tiYXIuXG4gICAqL1xuICBvcGVuKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uOiBzdHJpbmcgPSAnJywgY29uZmlnPzogTWF0U25hY2tCYXJDb25maWcpOlxuICAgICAgTWF0U25hY2tCYXJSZWY8U2ltcGxlU25hY2tCYXI+IHtcbiAgICBjb25zdCBfY29uZmlnID0gey4uLnRoaXMuX2RlZmF1bHRDb25maWcsIC4uLmNvbmZpZ307XG5cbiAgICAvLyBTaW5jZSB0aGUgdXNlciBkb2Vzbid0IGhhdmUgYWNjZXNzIHRvIHRoZSBjb21wb25lbnQsIHdlIGNhblxuICAgIC8vIG92ZXJyaWRlIHRoZSBkYXRhIHRvIHBhc3MgaW4gb3VyIG93biBtZXNzYWdlIGFuZCBhY3Rpb24uXG4gICAgX2NvbmZpZy5kYXRhID0ge21lc3NhZ2UsIGFjdGlvbn07XG5cbiAgICBpZiAoIV9jb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSkge1xuICAgICAgX2NvbmZpZy5hbm5vdW5jZW1lbnRNZXNzYWdlID0gbWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vcGVuRnJvbUNvbXBvbmVudChTaW1wbGVTbmFja0JhciwgX2NvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHRoZSBjdXJyZW50bHktdmlzaWJsZSBzbmFjayBiYXIuXG4gICAqL1xuICBkaXNtaXNzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vcGVuZWRTbmFja0JhclJlZikge1xuICAgICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYuZGlzbWlzcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIC8vIE9ubHkgZGlzbWlzcyB0aGUgc25hY2sgYmFyIGF0IHRoZSBjdXJyZW50IGxldmVsIG9uIGRlc3Ryb3kuXG4gICAgaWYgKHRoaXMuX3NuYWNrQmFyUmVmQXRUaGlzTGV2ZWwpIHtcbiAgICAgIHRoaXMuX3NuYWNrQmFyUmVmQXRUaGlzTGV2ZWwuZGlzbWlzcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgc25hY2sgYmFyIGNvbnRhaW5lciBjb21wb25lbnQgdG8gdGhlIG92ZXJsYXkuXG4gICAqL1xuICBwcml2YXRlIF9hdHRhY2hTbmFja0JhckNvbnRhaW5lcihvdmVybGF5UmVmOiBPdmVybGF5UmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnKTogTWF0U25hY2tCYXJDb250YWluZXIge1xuXG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuICAgIGNvbnN0IGluamVjdG9yID0gbmV3IFBvcnRhbEluamVjdG9yKHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvciwgbmV3IFdlYWtNYXAoW1xuICAgICAgW01hdFNuYWNrQmFyQ29uZmlnLCBjb25maWddXG4gICAgXSkpO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID1cbiAgICAgICAgbmV3IENvbXBvbmVudFBvcnRhbChNYXRTbmFja0JhckNvbnRhaW5lciwgY29uZmlnLnZpZXdDb250YWluZXJSZWYsIGluamVjdG9yKTtcbiAgICBjb25zdCBjb250YWluZXJSZWY6IENvbXBvbmVudFJlZjxNYXRTbmFja0JhckNvbnRhaW5lcj4gPSBvdmVybGF5UmVmLmF0dGFjaChjb250YWluZXJQb3J0YWwpO1xuICAgIGNvbnRhaW5lclJlZi5pbnN0YW5jZS5zbmFja0JhckNvbmZpZyA9IGNvbmZpZztcbiAgICByZXR1cm4gY29udGFpbmVyUmVmLmluc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsYWNlcyBhIG5ldyBjb21wb25lbnQgb3IgYSB0ZW1wbGF0ZSBhcyB0aGUgY29udGVudCBvZiB0aGUgc25hY2sgYmFyIGNvbnRhaW5lci5cbiAgICovXG4gIHByaXZhdGUgX2F0dGFjaDxUPihjb250ZW50OiBDb21wb25lbnRUeXBlPFQ+IHwgVGVtcGxhdGVSZWY8VD4sIHVzZXJDb25maWc/OiBNYXRTbmFja0JhckNvbmZpZyk6XG4gICAgTWF0U25hY2tCYXJSZWY8VCB8IEVtYmVkZGVkVmlld1JlZjxhbnk+PiB7XG5cbiAgICBjb25zdCBjb25maWcgPSB7Li4ubmV3IE1hdFNuYWNrQmFyQ29uZmlnKCksIC4uLnRoaXMuX2RlZmF1bHRDb25maWcsIC4uLnVzZXJDb25maWd9O1xuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9jcmVhdGVPdmVybGF5KGNvbmZpZyk7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fYXR0YWNoU25hY2tCYXJDb250YWluZXIob3ZlcmxheVJlZiwgY29uZmlnKTtcbiAgICBjb25zdCBzbmFja0JhclJlZiA9IG5ldyBNYXRTbmFja0JhclJlZjxUIHwgRW1iZWRkZWRWaWV3UmVmPGFueT4+KGNvbnRhaW5lciwgb3ZlcmxheVJlZik7XG5cbiAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmKSB7XG4gICAgICBjb25zdCBwb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwoY29udGVudCwgbnVsbCEsIHtcbiAgICAgICAgJGltcGxpY2l0OiBjb25maWcuZGF0YSxcbiAgICAgICAgc25hY2tCYXJSZWZcbiAgICAgIH0gYXMgYW55KTtcblxuICAgICAgc25hY2tCYXJSZWYuaW5zdGFuY2UgPSBjb250YWluZXIuYXR0YWNoVGVtcGxhdGVQb3J0YWwocG9ydGFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5qZWN0b3IgPSB0aGlzLl9jcmVhdGVJbmplY3Rvcihjb25maWcsIHNuYWNrQmFyUmVmKTtcbiAgICAgIGNvbnN0IHBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoY29udGVudCwgdW5kZWZpbmVkLCBpbmplY3Rvcik7XG4gICAgICBjb25zdCBjb250ZW50UmVmID0gY29udGFpbmVyLmF0dGFjaENvbXBvbmVudFBvcnRhbDxUPihwb3J0YWwpO1xuXG4gICAgICAvLyBXZSBjYW4ndCBwYXNzIHRoaXMgdmlhIHRoZSBpbmplY3RvciwgYmVjYXVzZSB0aGUgaW5qZWN0b3IgaXMgY3JlYXRlZCBlYXJsaWVyLlxuICAgICAgc25hY2tCYXJSZWYuaW5zdGFuY2UgPSBjb250ZW50UmVmLmluc3RhbmNlO1xuICAgIH1cblxuICAgIC8vIFN1YnNjcmliZSB0byB0aGUgYnJlYWtwb2ludCBvYnNlcnZlciBhbmQgYXR0YWNoIHRoZSBtYXQtc25hY2stYmFyLWhhbmRzZXQgY2xhc3MgYXNcbiAgICAvLyBhcHByb3ByaWF0ZS4gVGhpcyBjbGFzcyBpcyBhcHBsaWVkIHRvIHRoZSBvdmVybGF5IGVsZW1lbnQgYmVjYXVzZSB0aGUgb3ZlcmxheSBtdXN0IGV4cGFuZCB0b1xuICAgIC8vIGZpbGwgdGhlIHdpZHRoIG9mIHRoZSBzY3JlZW4gZm9yIGZ1bGwgd2lkdGggc25hY2tiYXJzLlxuICAgIHRoaXMuX2JyZWFrcG9pbnRPYnNlcnZlci5vYnNlcnZlKEJyZWFrcG9pbnRzLkhhbmRzZXRQb3J0cmFpdCkucGlwZShcbiAgICAgIHRha2VVbnRpbChvdmVybGF5UmVmLmRldGFjaG1lbnRzKCkpXG4gICAgKS5zdWJzY3JpYmUoc3RhdGUgPT4ge1xuICAgICAgY29uc3QgY2xhc3NMaXN0ID0gb3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSAnbWF0LXNuYWNrLWJhci1oYW5kc2V0JztcbiAgICAgIHN0YXRlLm1hdGNoZXMgPyBjbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkgOiBjbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9hbmltYXRlU25hY2tCYXIoc25hY2tCYXJSZWYsIGNvbmZpZyk7XG4gICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYgPSBzbmFja0JhclJlZjtcbiAgICByZXR1cm4gdGhpcy5fb3BlbmVkU25hY2tCYXJSZWY7XG4gIH1cblxuICAvKiogQW5pbWF0ZXMgdGhlIG9sZCBzbmFjayBiYXIgb3V0IGFuZCB0aGUgbmV3IG9uZSBpbi4gKi9cbiAgcHJpdmF0ZSBfYW5pbWF0ZVNuYWNrQmFyKHNuYWNrQmFyUmVmOiBNYXRTbmFja0JhclJlZjxhbnk+LCBjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnKSB7XG4gICAgLy8gV2hlbiB0aGUgc25hY2tiYXIgaXMgZGlzbWlzc2VkLCBjbGVhciB0aGUgcmVmZXJlbmNlIHRvIGl0LlxuICAgIHNuYWNrQmFyUmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIENsZWFyIHRoZSBzbmFja2JhciByZWYgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiByZXBsYWNlZCBieSBhIG5ld2VyIHNuYWNrYmFyLlxuICAgICAgaWYgKHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmID09IHNuYWNrQmFyUmVmKSB7XG4gICAgICAgIHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5hbm5vdW5jZW1lbnRNZXNzYWdlKSB7XG4gICAgICAgIHRoaXMuX2xpdmUuY2xlYXIoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9vcGVuZWRTbmFja0JhclJlZikge1xuICAgICAgLy8gSWYgYSBzbmFjayBiYXIgaXMgYWxyZWFkeSBpbiB2aWV3LCBkaXNtaXNzIGl0IGFuZCBlbnRlciB0aGVcbiAgICAgIC8vIG5ldyBzbmFjayBiYXIgYWZ0ZXIgZXhpdCBhbmltYXRpb24gaXMgY29tcGxldGUuXG4gICAgICB0aGlzLl9vcGVuZWRTbmFja0JhclJlZi5hZnRlckRpc21pc3NlZCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHNuYWNrQmFyUmVmLmNvbnRhaW5lckluc3RhbmNlLmVudGVyKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmLmRpc21pc3MoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgbm8gc25hY2sgYmFyIGlzIGluIHZpZXcsIGVudGVyIHRoZSBuZXcgc25hY2sgYmFyLlxuICAgICAgc25hY2tCYXJSZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKTtcbiAgICB9XG5cbiAgICAvLyBJZiBhIGRpc21pc3MgdGltZW91dCBpcyBwcm92aWRlZCwgc2V0IHVwIGRpc21pc3MgYmFzZWQgb24gYWZ0ZXIgdGhlIHNuYWNrYmFyIGlzIG9wZW5lZC5cbiAgICBpZiAoY29uZmlnLmR1cmF0aW9uICYmIGNvbmZpZy5kdXJhdGlvbiA+IDApIHtcbiAgICAgIHNuYWNrQmFyUmVmLmFmdGVyT3BlbmVkKCkuc3Vic2NyaWJlKCgpID0+IHNuYWNrQmFyUmVmLl9kaXNtaXNzQWZ0ZXIoY29uZmlnLmR1cmF0aW9uISkpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSkge1xuICAgICAgdGhpcy5fbGl2ZS5hbm5vdW5jZShjb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSwgY29uZmlnLnBvbGl0ZW5lc3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG92ZXJsYXkgYW5kIHBsYWNlcyBpdCBpbiB0aGUgY29ycmVjdCBsb2NhdGlvbi5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgdXNlci1zcGVjaWZpZWQgc25hY2sgYmFyIGNvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkoY29uZmlnOiBNYXRTbmFja0JhckNvbmZpZyk6IE92ZXJsYXlSZWYge1xuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSBuZXcgT3ZlcmxheUNvbmZpZygpO1xuICAgIG92ZXJsYXlDb25maWcuZGlyZWN0aW9uID0gY29uZmlnLmRpcmVjdGlvbjtcblxuICAgIGxldCBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpLmdsb2JhbCgpO1xuICAgIC8vIFNldCBob3Jpem9udGFsIHBvc2l0aW9uLlxuICAgIGNvbnN0IGlzUnRsID0gY29uZmlnLmRpcmVjdGlvbiA9PT0gJ3J0bCc7XG4gICAgY29uc3QgaXNMZWZ0ID0gKFxuICAgICAgY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ2xlZnQnIHx8XG4gICAgICAoY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ3N0YXJ0JyAmJiAhaXNSdGwpIHx8XG4gICAgICAoY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ2VuZCcgJiYgaXNSdGwpKTtcbiAgICBjb25zdCBpc1JpZ2h0ID0gIWlzTGVmdCAmJiBjb25maWcuaG9yaXpvbnRhbFBvc2l0aW9uICE9PSAnY2VudGVyJztcbiAgICBpZiAoaXNMZWZ0KSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LmxlZnQoJzAnKTtcbiAgICB9IGVsc2UgaWYgKGlzUmlnaHQpIHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3kucmlnaHQoJzAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS5jZW50ZXJIb3Jpem9udGFsbHkoKTtcbiAgICB9XG4gICAgLy8gU2V0IGhvcml6b250YWwgcG9zaXRpb24uXG4gICAgaWYgKGNvbmZpZy52ZXJ0aWNhbFBvc2l0aW9uID09PSAndG9wJykge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS50b3AoJzAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS5ib3R0b20oJzAnKTtcbiAgICB9XG5cbiAgICBvdmVybGF5Q29uZmlnLnBvc2l0aW9uU3RyYXRlZ3kgPSBwb3NpdGlvblN0cmF0ZWd5O1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5LmNyZWF0ZShvdmVybGF5Q29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluamVjdG9yIHRvIGJlIHVzZWQgaW5zaWRlIG9mIGEgc25hY2sgYmFyIGNvbXBvbmVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgdGhhdCB3YXMgdXNlZCB0byBjcmVhdGUgdGhlIHNuYWNrIGJhci5cbiAgICogQHBhcmFtIHNuYWNrQmFyUmVmIFJlZmVyZW5jZSB0byB0aGUgc25hY2sgYmFyLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlSW5qZWN0b3I8VD4oXG4gICAgICBjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnLFxuICAgICAgc25hY2tCYXJSZWY6IE1hdFNuYWNrQmFyUmVmPFQ+KTogUG9ydGFsSW5qZWN0b3Ige1xuXG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuXG4gICAgcmV0dXJuIG5ldyBQb3J0YWxJbmplY3Rvcih1c2VySW5qZWN0b3IgfHwgdGhpcy5faW5qZWN0b3IsIG5ldyBXZWFrTWFwPGFueSwgYW55PihbXG4gICAgICBbTWF0U25hY2tCYXJSZWYsIHNuYWNrQmFyUmVmXSxcbiAgICAgIFtNQVRfU05BQ0tfQkFSX0RBVEEsIGNvbmZpZy5kYXRhXVxuICAgIF0pKTtcbiAgfVxufVxuIl19