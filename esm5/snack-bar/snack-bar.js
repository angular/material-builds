import { __assign } from "tslib";
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
import * as i4 from "angular_material/src/material/snack-bar/snack-bar-module";
/** Injection token that can be used to specify default snack bar. */
export var MAT_SNACK_BAR_DEFAULT_OPTIONS = new InjectionToken('mat-snack-bar-default-options', {
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
var MatSnackBar = /** @class */ (function () {
    function MatSnackBar(_overlay, _live, _injector, _breakpointObserver, _parentSnackBar, _defaultConfig) {
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
    Object.defineProperty(MatSnackBar.prototype, "_openedSnackBarRef", {
        /** Reference to the currently opened snackbar at *any* level. */
        get: function () {
            var parent = this._parentSnackBar;
            return parent ? parent._openedSnackBarRef : this._snackBarRefAtThisLevel;
        },
        set: function (value) {
            if (this._parentSnackBar) {
                this._parentSnackBar._openedSnackBarRef = value;
            }
            else {
                this._snackBarRefAtThisLevel = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates and dispatches a snack bar with a custom component for the content, removing any
     * currently opened snack bars.
     *
     * @param component Component to be instantiated.
     * @param config Extra configuration for the snack bar.
     */
    MatSnackBar.prototype.openFromComponent = function (component, config) {
        return this._attach(component, config);
    };
    /**
     * Creates and dispatches a snack bar with a custom template for the content, removing any
     * currently opened snack bars.
     *
     * @param template Template to be instantiated.
     * @param config Extra configuration for the snack bar.
     */
    MatSnackBar.prototype.openFromTemplate = function (template, config) {
        return this._attach(template, config);
    };
    /**
     * Opens a snackbar with a message and an optional action.
     * @param message The message to show in the snackbar.
     * @param action The label for the snackbar action.
     * @param config Additional configuration options for the snackbar.
     */
    MatSnackBar.prototype.open = function (message, action, config) {
        if (action === void 0) { action = ''; }
        var _config = __assign(__assign({}, this._defaultConfig), config);
        // Since the user doesn't have access to the component, we can
        // override the data to pass in our own message and action.
        _config.data = { message: message, action: action };
        if (!_config.announcementMessage) {
            _config.announcementMessage = message;
        }
        return this.openFromComponent(SimpleSnackBar, _config);
    };
    /**
     * Dismisses the currently-visible snack bar.
     */
    MatSnackBar.prototype.dismiss = function () {
        if (this._openedSnackBarRef) {
            this._openedSnackBarRef.dismiss();
        }
    };
    MatSnackBar.prototype.ngOnDestroy = function () {
        // Only dismiss the snack bar at the current level on destroy.
        if (this._snackBarRefAtThisLevel) {
            this._snackBarRefAtThisLevel.dismiss();
        }
    };
    /**
     * Attaches the snack bar container component to the overlay.
     */
    MatSnackBar.prototype._attachSnackBarContainer = function (overlayRef, config) {
        var userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        var injector = new PortalInjector(userInjector || this._injector, new WeakMap([
            [MatSnackBarConfig, config]
        ]));
        var containerPortal = new ComponentPortal(MatSnackBarContainer, config.viewContainerRef, injector);
        var containerRef = overlayRef.attach(containerPortal);
        containerRef.instance.snackBarConfig = config;
        return containerRef.instance;
    };
    /**
     * Places a new component or a template as the content of the snack bar container.
     */
    MatSnackBar.prototype._attach = function (content, userConfig) {
        var config = __assign(__assign(__assign({}, new MatSnackBarConfig()), this._defaultConfig), userConfig);
        var overlayRef = this._createOverlay(config);
        var container = this._attachSnackBarContainer(overlayRef, config);
        var snackBarRef = new MatSnackBarRef(container, overlayRef);
        if (content instanceof TemplateRef) {
            var portal = new TemplatePortal(content, null, {
                $implicit: config.data,
                snackBarRef: snackBarRef
            });
            snackBarRef.instance = container.attachTemplatePortal(portal);
        }
        else {
            var injector = this._createInjector(config, snackBarRef);
            var portal = new ComponentPortal(content, undefined, injector);
            var contentRef = container.attachComponentPortal(portal);
            // We can't pass this via the injector, because the injector is created earlier.
            snackBarRef.instance = contentRef.instance;
        }
        // Subscribe to the breakpoint observer and attach the mat-snack-bar-handset class as
        // appropriate. This class is applied to the overlay element because the overlay must expand to
        // fill the width of the screen for full width snackbars.
        this._breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(takeUntil(overlayRef.detachments())).subscribe(function (state) {
            var classList = overlayRef.overlayElement.classList;
            var className = 'mat-snack-bar-handset';
            state.matches ? classList.add(className) : classList.remove(className);
        });
        this._animateSnackBar(snackBarRef, config);
        this._openedSnackBarRef = snackBarRef;
        return this._openedSnackBarRef;
    };
    /** Animates the old snack bar out and the new one in. */
    MatSnackBar.prototype._animateSnackBar = function (snackBarRef, config) {
        var _this = this;
        // When the snackbar is dismissed, clear the reference to it.
        snackBarRef.afterDismissed().subscribe(function () {
            // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
            if (_this._openedSnackBarRef == snackBarRef) {
                _this._openedSnackBarRef = null;
            }
            if (config.announcementMessage) {
                _this._live.clear();
            }
        });
        if (this._openedSnackBarRef) {
            // If a snack bar is already in view, dismiss it and enter the
            // new snack bar after exit animation is complete.
            this._openedSnackBarRef.afterDismissed().subscribe(function () {
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
            snackBarRef.afterOpened().subscribe(function () { return snackBarRef._dismissAfter(config.duration); });
        }
        if (config.announcementMessage) {
            this._live.announce(config.announcementMessage, config.politeness);
        }
    };
    /**
     * Creates a new overlay and places it in the correct location.
     * @param config The user-specified snack bar config.
     */
    MatSnackBar.prototype._createOverlay = function (config) {
        var overlayConfig = new OverlayConfig();
        overlayConfig.direction = config.direction;
        var positionStrategy = this._overlay.position().global();
        // Set horizontal position.
        var isRtl = config.direction === 'rtl';
        var isLeft = (config.horizontalPosition === 'left' ||
            (config.horizontalPosition === 'start' && !isRtl) ||
            (config.horizontalPosition === 'end' && isRtl));
        var isRight = !isLeft && config.horizontalPosition !== 'center';
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
    };
    /**
     * Creates an injector to be used inside of a snack bar component.
     * @param config Config that was used to create the snack bar.
     * @param snackBarRef Reference to the snack bar.
     */
    MatSnackBar.prototype._createInjector = function (config, snackBarRef) {
        var userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        return new PortalInjector(userInjector || this._injector, new WeakMap([
            [MatSnackBarRef, snackBarRef],
            [MAT_SNACK_BAR_DATA, config.data]
        ]));
    };
    MatSnackBar.decorators = [
        { type: Injectable, args: [{ providedIn: MatSnackBarModule },] }
    ];
    /** @nocollapse */
    MatSnackBar.ctorParameters = function () { return [
        { type: Overlay },
        { type: LiveAnnouncer },
        { type: Injector },
        { type: BreakpointObserver },
        { type: MatSnackBar, decorators: [{ type: Optional }, { type: SkipSelf }] },
        { type: MatSnackBarConfig, decorators: [{ type: Inject, args: [MAT_SNACK_BAR_DEFAULT_OPTIONS,] }] }
    ]; };
    MatSnackBar.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatSnackBar_Factory() { return new MatSnackBar(i0.ɵɵinject(i1.Overlay), i0.ɵɵinject(i2.LiveAnnouncer), i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(i3.BreakpointObserver), i0.ɵɵinject(MatSnackBar, 12), i0.ɵɵinject(MAT_SNACK_BAR_DEFAULT_OPTIONS)); }, token: MatSnackBar, providedIn: i4.MatSnackBarModule });
    return MatSnackBar;
}());
export { MatSnackBar };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NuYWNrLWJhci9zbmFjay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsV0FBVyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDcEUsT0FBTyxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQWEsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsZUFBZSxFQUFpQixjQUFjLEVBQUUsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkcsT0FBTyxFQUdMLE1BQU0sRUFDTixVQUFVLEVBQ1YsY0FBYyxFQUNkLFFBQVEsRUFDUixRQUFRLEVBQ1IsUUFBUSxFQUNSLFdBQVcsR0FFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3pFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7O0FBRy9DLHFFQUFxRTtBQUNyRSxNQUFNLENBQUMsSUFBTSw2QkFBNkIsR0FDdEMsSUFBSSxjQUFjLENBQW9CLCtCQUErQixFQUFFO0lBQ3JFLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSxxQ0FBcUM7Q0FDL0MsQ0FBQyxDQUFD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LE1BQU0sSUFBSSxNQUFNLENBQUMsZ0JBQWdCLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztRQUUzRixPQUFPLElBQUksY0FBYyxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksT0FBTyxDQUFXO1lBQzlFLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQztZQUM3QixDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUM7U0FDbEMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDOztnQkE5T0YsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLGlCQUFpQixFQUFDOzs7O2dCQXJDbkMsT0FBTztnQkFGUCxhQUFhO2dCQVVuQixRQUFRO2dCQVRGLGtCQUFrQjtnQkFrRTZCLFdBQVcsdUJBQTNELFFBQVEsWUFBSSxRQUFRO2dCQWpEQyxpQkFBaUIsdUJBa0R0QyxNQUFNLFNBQUMsNkJBQTZCOzs7c0JBNUUzQztDQThSQyxBQS9PRCxJQStPQztTQTlPWSxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TGl2ZUFubm91bmNlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCcmVha3BvaW50T2JzZXJ2ZXIsIEJyZWFrcG9pbnRzfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7T3ZlcmxheSwgT3ZlcmxheUNvbmZpZywgT3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21wb25lbnRQb3J0YWwsIENvbXBvbmVudFR5cGUsIFBvcnRhbEluamVjdG9yLCBUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBDb21wb25lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgSW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIE9wdGlvbmFsLFxuICBTa2lwU2VsZixcbiAgVGVtcGxhdGVSZWYsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3Rha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtTaW1wbGVTbmFja0Jhcn0gZnJvbSAnLi9zaW1wbGUtc25hY2stYmFyJztcbmltcG9ydCB7TUFUX1NOQUNLX0JBUl9EQVRBLCBNYXRTbmFja0JhckNvbmZpZ30gZnJvbSAnLi9zbmFjay1iYXItY29uZmlnJztcbmltcG9ydCB7TWF0U25hY2tCYXJDb250YWluZXJ9IGZyb20gJy4vc25hY2stYmFyLWNvbnRhaW5lcic7XG5pbXBvcnQge01hdFNuYWNrQmFyTW9kdWxlfSBmcm9tICcuL3NuYWNrLWJhci1tb2R1bGUnO1xuaW1wb3J0IHtNYXRTbmFja0JhclJlZn0gZnJvbSAnLi9zbmFjay1iYXItcmVmJztcblxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBkZWZhdWx0IHNuYWNrIGJhci4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdFNuYWNrQmFyQ29uZmlnPignbWF0LXNuYWNrLWJhci1kZWZhdWx0LW9wdGlvbnMnLCB7XG4gICAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgICBmYWN0b3J5OiBNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZLFxuICAgIH0pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0U25hY2tCYXJDb25maWcge1xuICByZXR1cm4gbmV3IE1hdFNuYWNrQmFyQ29uZmlnKCk7XG59XG5cbi8qKlxuICogU2VydmljZSB0byBkaXNwYXRjaCBNYXRlcmlhbCBEZXNpZ24gc25hY2sgYmFyIG1lc3NhZ2VzLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogTWF0U25hY2tCYXJNb2R1bGV9KVxuZXhwb3J0IGNsYXNzIE1hdFNuYWNrQmFyIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCBzbmFjayBiYXIgaW4gdGhlIHZpZXcgKmF0IHRoaXMgbGV2ZWwqIChpbiB0aGUgQW5ndWxhciBpbmplY3RvciB0cmVlKS5cbiAgICogSWYgdGhlcmUgaXMgYSBwYXJlbnQgc25hY2stYmFyIHNlcnZpY2UsIGFsbCBvcGVyYXRpb25zIHNob3VsZCBkZWxlZ2F0ZSB0byB0aGF0IHBhcmVudFxuICAgKiB2aWEgYF9vcGVuZWRTbmFja0JhclJlZmAuXG4gICAqL1xuICBwcml2YXRlIF9zbmFja0JhclJlZkF0VGhpc0xldmVsOiBNYXRTbmFja0JhclJlZjxhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudGx5IG9wZW5lZCBzbmFja2JhciBhdCAqYW55KiBsZXZlbC4gKi9cbiAgZ2V0IF9vcGVuZWRTbmFja0JhclJlZigpOiBNYXRTbmFja0JhclJlZjxhbnk+IHwgbnVsbCB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50U25hY2tCYXI7XG4gICAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5fb3BlbmVkU25hY2tCYXJSZWYgOiB0aGlzLl9zbmFja0JhclJlZkF0VGhpc0xldmVsO1xuICB9XG5cbiAgc2V0IF9vcGVuZWRTbmFja0JhclJlZih2YWx1ZTogTWF0U25hY2tCYXJSZWY8YW55PiB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fcGFyZW50U25hY2tCYXIpIHtcbiAgICAgIHRoaXMuX3BhcmVudFNuYWNrQmFyLl9vcGVuZWRTbmFja0JhclJlZiA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zbmFja0JhclJlZkF0VGhpc0xldmVsID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgICAgcHJpdmF0ZSBfbGl2ZTogTGl2ZUFubm91bmNlcixcbiAgICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICAgIHByaXZhdGUgX2JyZWFrcG9pbnRPYnNlcnZlcjogQnJlYWtwb2ludE9ic2VydmVyLFxuICAgICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcHJpdmF0ZSBfcGFyZW50U25hY2tCYXI6IE1hdFNuYWNrQmFyLFxuICAgICAgQEluamVjdChNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OUykgcHJpdmF0ZSBfZGVmYXVsdENvbmZpZzogTWF0U25hY2tCYXJDb25maWcpIHt9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW5kIGRpc3BhdGNoZXMgYSBzbmFjayBiYXIgd2l0aCBhIGN1c3RvbSBjb21wb25lbnQgZm9yIHRoZSBjb250ZW50LCByZW1vdmluZyBhbnlcbiAgICogY3VycmVudGx5IG9wZW5lZCBzbmFjayBiYXJzLlxuICAgKlxuICAgKiBAcGFyYW0gY29tcG9uZW50IENvbXBvbmVudCB0byBiZSBpbnN0YW50aWF0ZWQuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNuYWNrIGJhci5cbiAgICovXG4gIG9wZW5Gcm9tQ29tcG9uZW50PFQ+KGNvbXBvbmVudDogQ29tcG9uZW50VHlwZTxUPiwgY29uZmlnPzogTWF0U25hY2tCYXJDb25maWcpOlxuICAgIE1hdFNuYWNrQmFyUmVmPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoKGNvbXBvbmVudCwgY29uZmlnKSBhcyBNYXRTbmFja0JhclJlZjxUPjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuZCBkaXNwYXRjaGVzIGEgc25hY2sgYmFyIHdpdGggYSBjdXN0b20gdGVtcGxhdGUgZm9yIHRoZSBjb250ZW50LCByZW1vdmluZyBhbnlcbiAgICogY3VycmVudGx5IG9wZW5lZCBzbmFjayBiYXJzLlxuICAgKlxuICAgKiBAcGFyYW0gdGVtcGxhdGUgVGVtcGxhdGUgdG8gYmUgaW5zdGFudGlhdGVkLlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzbmFjayBiYXIuXG4gICAqL1xuICBvcGVuRnJvbVRlbXBsYXRlKHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+LCBjb25maWc/OiBNYXRTbmFja0JhckNvbmZpZyk6XG4gICAgTWF0U25hY2tCYXJSZWY8RW1iZWRkZWRWaWV3UmVmPGFueT4+IHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoKHRlbXBsYXRlLCBjb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGEgc25hY2tiYXIgd2l0aCBhIG1lc3NhZ2UgYW5kIGFuIG9wdGlvbmFsIGFjdGlvbi5cbiAgICogQHBhcmFtIG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gc2hvdyBpbiB0aGUgc25hY2tiYXIuXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGxhYmVsIGZvciB0aGUgc25hY2tiYXIgYWN0aW9uLlxuICAgKiBAcGFyYW0gY29uZmlnIEFkZGl0aW9uYWwgY29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgc25hY2tiYXIuXG4gICAqL1xuICBvcGVuKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uOiBzdHJpbmcgPSAnJywgY29uZmlnPzogTWF0U25hY2tCYXJDb25maWcpOlxuICAgICAgTWF0U25hY2tCYXJSZWY8U2ltcGxlU25hY2tCYXI+IHtcbiAgICBjb25zdCBfY29uZmlnID0gey4uLnRoaXMuX2RlZmF1bHRDb25maWcsIC4uLmNvbmZpZ307XG5cbiAgICAvLyBTaW5jZSB0aGUgdXNlciBkb2Vzbid0IGhhdmUgYWNjZXNzIHRvIHRoZSBjb21wb25lbnQsIHdlIGNhblxuICAgIC8vIG92ZXJyaWRlIHRoZSBkYXRhIHRvIHBhc3MgaW4gb3VyIG93biBtZXNzYWdlIGFuZCBhY3Rpb24uXG4gICAgX2NvbmZpZy5kYXRhID0ge21lc3NhZ2UsIGFjdGlvbn07XG5cbiAgICBpZiAoIV9jb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSkge1xuICAgICAgX2NvbmZpZy5hbm5vdW5jZW1lbnRNZXNzYWdlID0gbWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vcGVuRnJvbUNvbXBvbmVudChTaW1wbGVTbmFja0JhciwgX2NvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHRoZSBjdXJyZW50bHktdmlzaWJsZSBzbmFjayBiYXIuXG4gICAqL1xuICBkaXNtaXNzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vcGVuZWRTbmFja0JhclJlZikge1xuICAgICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYuZGlzbWlzcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIC8vIE9ubHkgZGlzbWlzcyB0aGUgc25hY2sgYmFyIGF0IHRoZSBjdXJyZW50IGxldmVsIG9uIGRlc3Ryb3kuXG4gICAgaWYgKHRoaXMuX3NuYWNrQmFyUmVmQXRUaGlzTGV2ZWwpIHtcbiAgICAgIHRoaXMuX3NuYWNrQmFyUmVmQXRUaGlzTGV2ZWwuZGlzbWlzcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgc25hY2sgYmFyIGNvbnRhaW5lciBjb21wb25lbnQgdG8gdGhlIG92ZXJsYXkuXG4gICAqL1xuICBwcml2YXRlIF9hdHRhY2hTbmFja0JhckNvbnRhaW5lcihvdmVybGF5UmVmOiBPdmVybGF5UmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnKTogTWF0U25hY2tCYXJDb250YWluZXIge1xuXG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuICAgIGNvbnN0IGluamVjdG9yID0gbmV3IFBvcnRhbEluamVjdG9yKHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvciwgbmV3IFdlYWtNYXAoW1xuICAgICAgW01hdFNuYWNrQmFyQ29uZmlnLCBjb25maWddXG4gICAgXSkpO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID1cbiAgICAgICAgbmV3IENvbXBvbmVudFBvcnRhbChNYXRTbmFja0JhckNvbnRhaW5lciwgY29uZmlnLnZpZXdDb250YWluZXJSZWYsIGluamVjdG9yKTtcbiAgICBjb25zdCBjb250YWluZXJSZWY6IENvbXBvbmVudFJlZjxNYXRTbmFja0JhckNvbnRhaW5lcj4gPSBvdmVybGF5UmVmLmF0dGFjaChjb250YWluZXJQb3J0YWwpO1xuICAgIGNvbnRhaW5lclJlZi5pbnN0YW5jZS5zbmFja0JhckNvbmZpZyA9IGNvbmZpZztcbiAgICByZXR1cm4gY29udGFpbmVyUmVmLmluc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsYWNlcyBhIG5ldyBjb21wb25lbnQgb3IgYSB0ZW1wbGF0ZSBhcyB0aGUgY29udGVudCBvZiB0aGUgc25hY2sgYmFyIGNvbnRhaW5lci5cbiAgICovXG4gIHByaXZhdGUgX2F0dGFjaDxUPihjb250ZW50OiBDb21wb25lbnRUeXBlPFQ+IHwgVGVtcGxhdGVSZWY8VD4sIHVzZXJDb25maWc/OiBNYXRTbmFja0JhckNvbmZpZyk6XG4gICAgTWF0U25hY2tCYXJSZWY8VCB8IEVtYmVkZGVkVmlld1JlZjxhbnk+PiB7XG5cbiAgICBjb25zdCBjb25maWcgPSB7Li4ubmV3IE1hdFNuYWNrQmFyQ29uZmlnKCksIC4uLnRoaXMuX2RlZmF1bHRDb25maWcsIC4uLnVzZXJDb25maWd9O1xuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9jcmVhdGVPdmVybGF5KGNvbmZpZyk7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fYXR0YWNoU25hY2tCYXJDb250YWluZXIob3ZlcmxheVJlZiwgY29uZmlnKTtcbiAgICBjb25zdCBzbmFja0JhclJlZiA9IG5ldyBNYXRTbmFja0JhclJlZjxUIHwgRW1iZWRkZWRWaWV3UmVmPGFueT4+KGNvbnRhaW5lciwgb3ZlcmxheVJlZik7XG5cbiAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmKSB7XG4gICAgICBjb25zdCBwb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwoY29udGVudCwgbnVsbCEsIHtcbiAgICAgICAgJGltcGxpY2l0OiBjb25maWcuZGF0YSxcbiAgICAgICAgc25hY2tCYXJSZWZcbiAgICAgIH0gYXMgYW55KTtcblxuICAgICAgc25hY2tCYXJSZWYuaW5zdGFuY2UgPSBjb250YWluZXIuYXR0YWNoVGVtcGxhdGVQb3J0YWwocG9ydGFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5qZWN0b3IgPSB0aGlzLl9jcmVhdGVJbmplY3Rvcihjb25maWcsIHNuYWNrQmFyUmVmKTtcbiAgICAgIGNvbnN0IHBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoY29udGVudCwgdW5kZWZpbmVkLCBpbmplY3Rvcik7XG4gICAgICBjb25zdCBjb250ZW50UmVmID0gY29udGFpbmVyLmF0dGFjaENvbXBvbmVudFBvcnRhbDxUPihwb3J0YWwpO1xuXG4gICAgICAvLyBXZSBjYW4ndCBwYXNzIHRoaXMgdmlhIHRoZSBpbmplY3RvciwgYmVjYXVzZSB0aGUgaW5qZWN0b3IgaXMgY3JlYXRlZCBlYXJsaWVyLlxuICAgICAgc25hY2tCYXJSZWYuaW5zdGFuY2UgPSBjb250ZW50UmVmLmluc3RhbmNlO1xuICAgIH1cblxuICAgIC8vIFN1YnNjcmliZSB0byB0aGUgYnJlYWtwb2ludCBvYnNlcnZlciBhbmQgYXR0YWNoIHRoZSBtYXQtc25hY2stYmFyLWhhbmRzZXQgY2xhc3MgYXNcbiAgICAvLyBhcHByb3ByaWF0ZS4gVGhpcyBjbGFzcyBpcyBhcHBsaWVkIHRvIHRoZSBvdmVybGF5IGVsZW1lbnQgYmVjYXVzZSB0aGUgb3ZlcmxheSBtdXN0IGV4cGFuZCB0b1xuICAgIC8vIGZpbGwgdGhlIHdpZHRoIG9mIHRoZSBzY3JlZW4gZm9yIGZ1bGwgd2lkdGggc25hY2tiYXJzLlxuICAgIHRoaXMuX2JyZWFrcG9pbnRPYnNlcnZlci5vYnNlcnZlKEJyZWFrcG9pbnRzLkhhbmRzZXRQb3J0cmFpdCkucGlwZShcbiAgICAgIHRha2VVbnRpbChvdmVybGF5UmVmLmRldGFjaG1lbnRzKCkpXG4gICAgKS5zdWJzY3JpYmUoc3RhdGUgPT4ge1xuICAgICAgY29uc3QgY2xhc3NMaXN0ID0gb3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSAnbWF0LXNuYWNrLWJhci1oYW5kc2V0JztcbiAgICAgIHN0YXRlLm1hdGNoZXMgPyBjbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkgOiBjbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9hbmltYXRlU25hY2tCYXIoc25hY2tCYXJSZWYsIGNvbmZpZyk7XG4gICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYgPSBzbmFja0JhclJlZjtcbiAgICByZXR1cm4gdGhpcy5fb3BlbmVkU25hY2tCYXJSZWY7XG4gIH1cblxuICAvKiogQW5pbWF0ZXMgdGhlIG9sZCBzbmFjayBiYXIgb3V0IGFuZCB0aGUgbmV3IG9uZSBpbi4gKi9cbiAgcHJpdmF0ZSBfYW5pbWF0ZVNuYWNrQmFyKHNuYWNrQmFyUmVmOiBNYXRTbmFja0JhclJlZjxhbnk+LCBjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnKSB7XG4gICAgLy8gV2hlbiB0aGUgc25hY2tiYXIgaXMgZGlzbWlzc2VkLCBjbGVhciB0aGUgcmVmZXJlbmNlIHRvIGl0LlxuICAgIHNuYWNrQmFyUmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIENsZWFyIHRoZSBzbmFja2JhciByZWYgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiByZXBsYWNlZCBieSBhIG5ld2VyIHNuYWNrYmFyLlxuICAgICAgaWYgKHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmID09IHNuYWNrQmFyUmVmKSB7XG4gICAgICAgIHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5hbm5vdW5jZW1lbnRNZXNzYWdlKSB7XG4gICAgICAgIHRoaXMuX2xpdmUuY2xlYXIoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9vcGVuZWRTbmFja0JhclJlZikge1xuICAgICAgLy8gSWYgYSBzbmFjayBiYXIgaXMgYWxyZWFkeSBpbiB2aWV3LCBkaXNtaXNzIGl0IGFuZCBlbnRlciB0aGVcbiAgICAgIC8vIG5ldyBzbmFjayBiYXIgYWZ0ZXIgZXhpdCBhbmltYXRpb24gaXMgY29tcGxldGUuXG4gICAgICB0aGlzLl9vcGVuZWRTbmFja0JhclJlZi5hZnRlckRpc21pc3NlZCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHNuYWNrQmFyUmVmLmNvbnRhaW5lckluc3RhbmNlLmVudGVyKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmLmRpc21pc3MoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgbm8gc25hY2sgYmFyIGlzIGluIHZpZXcsIGVudGVyIHRoZSBuZXcgc25hY2sgYmFyLlxuICAgICAgc25hY2tCYXJSZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKTtcbiAgICB9XG5cbiAgICAvLyBJZiBhIGRpc21pc3MgdGltZW91dCBpcyBwcm92aWRlZCwgc2V0IHVwIGRpc21pc3MgYmFzZWQgb24gYWZ0ZXIgdGhlIHNuYWNrYmFyIGlzIG9wZW5lZC5cbiAgICBpZiAoY29uZmlnLmR1cmF0aW9uICYmIGNvbmZpZy5kdXJhdGlvbiA+IDApIHtcbiAgICAgIHNuYWNrQmFyUmVmLmFmdGVyT3BlbmVkKCkuc3Vic2NyaWJlKCgpID0+IHNuYWNrQmFyUmVmLl9kaXNtaXNzQWZ0ZXIoY29uZmlnLmR1cmF0aW9uISkpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSkge1xuICAgICAgdGhpcy5fbGl2ZS5hbm5vdW5jZShjb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSwgY29uZmlnLnBvbGl0ZW5lc3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG92ZXJsYXkgYW5kIHBsYWNlcyBpdCBpbiB0aGUgY29ycmVjdCBsb2NhdGlvbi5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgdXNlci1zcGVjaWZpZWQgc25hY2sgYmFyIGNvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkoY29uZmlnOiBNYXRTbmFja0JhckNvbmZpZyk6IE92ZXJsYXlSZWYge1xuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSBuZXcgT3ZlcmxheUNvbmZpZygpO1xuICAgIG92ZXJsYXlDb25maWcuZGlyZWN0aW9uID0gY29uZmlnLmRpcmVjdGlvbjtcblxuICAgIGxldCBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpLmdsb2JhbCgpO1xuICAgIC8vIFNldCBob3Jpem9udGFsIHBvc2l0aW9uLlxuICAgIGNvbnN0IGlzUnRsID0gY29uZmlnLmRpcmVjdGlvbiA9PT0gJ3J0bCc7XG4gICAgY29uc3QgaXNMZWZ0ID0gKFxuICAgICAgY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ2xlZnQnIHx8XG4gICAgICAoY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ3N0YXJ0JyAmJiAhaXNSdGwpIHx8XG4gICAgICAoY29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ2VuZCcgJiYgaXNSdGwpKTtcbiAgICBjb25zdCBpc1JpZ2h0ID0gIWlzTGVmdCAmJiBjb25maWcuaG9yaXpvbnRhbFBvc2l0aW9uICE9PSAnY2VudGVyJztcbiAgICBpZiAoaXNMZWZ0KSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LmxlZnQoJzAnKTtcbiAgICB9IGVsc2UgaWYgKGlzUmlnaHQpIHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3kucmlnaHQoJzAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS5jZW50ZXJIb3Jpem9udGFsbHkoKTtcbiAgICB9XG4gICAgLy8gU2V0IGhvcml6b250YWwgcG9zaXRpb24uXG4gICAgaWYgKGNvbmZpZy52ZXJ0aWNhbFBvc2l0aW9uID09PSAndG9wJykge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS50b3AoJzAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS5ib3R0b20oJzAnKTtcbiAgICB9XG5cbiAgICBvdmVybGF5Q29uZmlnLnBvc2l0aW9uU3RyYXRlZ3kgPSBwb3NpdGlvblN0cmF0ZWd5O1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5LmNyZWF0ZShvdmVybGF5Q29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluamVjdG9yIHRvIGJlIHVzZWQgaW5zaWRlIG9mIGEgc25hY2sgYmFyIGNvbXBvbmVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgdGhhdCB3YXMgdXNlZCB0byBjcmVhdGUgdGhlIHNuYWNrIGJhci5cbiAgICogQHBhcmFtIHNuYWNrQmFyUmVmIFJlZmVyZW5jZSB0byB0aGUgc25hY2sgYmFyLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlSW5qZWN0b3I8VD4oXG4gICAgICBjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnLFxuICAgICAgc25hY2tCYXJSZWY6IE1hdFNuYWNrQmFyUmVmPFQ+KTogUG9ydGFsSW5qZWN0b3Ige1xuXG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuXG4gICAgcmV0dXJuIG5ldyBQb3J0YWxJbmplY3Rvcih1c2VySW5qZWN0b3IgfHwgdGhpcy5faW5qZWN0b3IsIG5ldyBXZWFrTWFwPGFueSwgYW55PihbXG4gICAgICBbTWF0U25hY2tCYXJSZWYsIHNuYWNrQmFyUmVmXSxcbiAgICAgIFtNQVRfU05BQ0tfQkFSX0RBVEEsIGNvbmZpZy5kYXRhXVxuICAgIF0pKTtcbiAgfVxufVxuIl19