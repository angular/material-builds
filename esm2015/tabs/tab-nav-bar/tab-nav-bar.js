import { __decorate, __metadata, __param } from "tslib";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, forwardRef, Inject, Input, NgZone, Optional, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, mixinDisabled, mixinDisableRipple, mixinTabIndex, RippleRenderer, } from '@angular/material/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MatInkBar } from '../ink-bar';
import { MatPaginatedTabHeader } from '../paginated-tab-header';
import { startWith, takeUntil } from 'rxjs/operators';
/**
 * Base class with all of the `MatTabNav` functionality.
 * @docs-private
 */
let _MatTabNavBase = /** @class */ (() => {
    let _MatTabNavBase = 
    // tslint:disable-next-line:class-name
    class _MatTabNavBase extends MatPaginatedTabHeader {
        constructor(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, 
        /**
         * @deprecated @breaking-change 9.0.0 `platform` parameter to become required.
         */
        platform, animationMode) {
            super(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode);
            this._disableRipple = false;
            /** Theme color of the nav bar. */
            this.color = 'primary';
        }
        /** Background color of the tab nav. */
        get backgroundColor() { return this._backgroundColor; }
        set backgroundColor(value) {
            const classList = this._elementRef.nativeElement.classList;
            classList.remove(`mat-background-${this.backgroundColor}`);
            if (value) {
                classList.add(`mat-background-${value}`);
            }
            this._backgroundColor = value;
        }
        /** Whether the ripple effect is disabled or not. */
        get disableRipple() { return this._disableRipple; }
        set disableRipple(value) { this._disableRipple = coerceBooleanProperty(value); }
        _itemSelected() {
            // noop
        }
        ngAfterContentInit() {
            // We need this to run before the `changes` subscription in parent to ensure that the
            // selectedIndex is up-to-date by the time the super class starts looking for it.
            this._items.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
                this.updateActiveLink();
            });
            super.ngAfterContentInit();
        }
        /**
         * Notifies the component that the active link has been changed.
         * @breaking-change 8.0.0 `element` parameter to be removed.
         */
        updateActiveLink(_element) {
            if (!this._items) {
                return;
            }
            const items = this._items.toArray();
            for (let i = 0; i < items.length; i++) {
                if (items[i].active) {
                    this.selectedIndex = i;
                    this._changeDetectorRef.markForCheck();
                    return;
                }
            }
            // The ink bar should hide itself if no items are active.
            this.selectedIndex = -1;
            this._inkBar.hide();
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], _MatTabNavBase.prototype, "backgroundColor", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], _MatTabNavBase.prototype, "disableRipple", null);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], _MatTabNavBase.prototype, "color", void 0);
    _MatTabNavBase = __decorate([
        Directive()
        // tslint:disable-next-line:class-name
        ,
        __param(1, Optional()),
        __param(5, Optional()),
        __param(6, Optional()), __param(6, Inject(ANIMATION_MODULE_TYPE)),
        __metadata("design:paramtypes", [ElementRef,
            Directionality,
            NgZone,
            ChangeDetectorRef,
            ViewportRuler,
            Platform, String])
    ], _MatTabNavBase);
    return _MatTabNavBase;
})();
export { _MatTabNavBase };
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
let MatTabNav = /** @class */ (() => {
    let MatTabNav = class MatTabNav extends _MatTabNavBase {
        constructor(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, 
        /**
         * @deprecated @breaking-change 9.0.0 `platform` parameter to become required.
         */
        platform, animationMode) {
            super(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode);
        }
    };
    __decorate([
        ContentChildren(forwardRef(() => MatTabLink), { descendants: true }),
        __metadata("design:type", QueryList)
    ], MatTabNav.prototype, "_items", void 0);
    __decorate([
        ViewChild(MatInkBar, { static: true }),
        __metadata("design:type", MatInkBar)
    ], MatTabNav.prototype, "_inkBar", void 0);
    __decorate([
        ViewChild('tabListContainer', { static: true }),
        __metadata("design:type", ElementRef)
    ], MatTabNav.prototype, "_tabListContainer", void 0);
    __decorate([
        ViewChild('tabList', { static: true }),
        __metadata("design:type", ElementRef)
    ], MatTabNav.prototype, "_tabList", void 0);
    __decorate([
        ViewChild('nextPaginator'),
        __metadata("design:type", ElementRef)
    ], MatTabNav.prototype, "_nextPaginator", void 0);
    __decorate([
        ViewChild('previousPaginator'),
        __metadata("design:type", ElementRef)
    ], MatTabNav.prototype, "_previousPaginator", void 0);
    MatTabNav = __decorate([
        Component({
            selector: '[mat-tab-nav-bar]',
            exportAs: 'matTabNavBar, matTabNav',
            inputs: ['color'],
            template: "<div class=\"mat-tab-header-pagination mat-tab-header-pagination-before mat-elevation-z4\"\n     #previousPaginator\n     aria-hidden=\"true\"\n     mat-ripple [matRippleDisabled]=\"_disableScrollBefore || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollBefore\"\n     (click)=\"_handlePaginatorClick('before')\"\n     (mousedown)=\"_handlePaginatorPress('before', $event)\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</div>\n\n<div class=\"mat-tab-link-container\" #tabListContainer (keydown)=\"_handleKeydown($event)\">\n  <div\n    class=\"mat-tab-list\"\n    [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n    #tabList\n    (cdkObserveContent)=\"_onContentChanges()\">\n    <div class=\"mat-tab-links\">\n      <ng-content></ng-content>\n    </div>\n    <mat-ink-bar></mat-ink-bar>\n  </div>\n</div>\n\n<div class=\"mat-tab-header-pagination mat-tab-header-pagination-after mat-elevation-z4\"\n     #nextPaginator\n     aria-hidden=\"true\"\n     mat-ripple [matRippleDisabled]=\"_disableScrollAfter || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollAfter\"\n     (mousedown)=\"_handlePaginatorPress('after', $event)\"\n     (click)=\"_handlePaginatorClick('after')\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</div>\n",
            host: {
                'class': 'mat-tab-nav-bar mat-tab-header',
                '[class.mat-tab-header-pagination-controls-enabled]': '_showPaginationControls',
                '[class.mat-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
                '[class.mat-primary]': 'color !== "warn" && color !== "accent"',
                '[class.mat-accent]': 'color === "accent"',
                '[class.mat-warn]': 'color === "warn"',
            },
            encapsulation: ViewEncapsulation.None,
            // tslint:disable-next-line:validate-decorators
            changeDetection: ChangeDetectionStrategy.Default,
            styles: [".mat-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-tab-header-pagination{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:transparent;touch-action:none}.mat-tab-header-pagination-controls-enabled .mat-tab-header-pagination{display:flex}.mat-tab-header-pagination-before,.mat-tab-header-rtl .mat-tab-header-pagination-after{padding-left:4px}.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-tab-header-rtl .mat-tab-header-pagination-before,.mat-tab-header-pagination-after{padding-right:4px}.mat-tab-header-rtl .mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;content:\"\";height:8px;width:8px}.mat-tab-header-pagination-disabled{box-shadow:none;cursor:default}.mat-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-tab-links{display:flex}[mat-align-tabs=center]>.mat-tab-link-container .mat-tab-links{justify-content:center}[mat-align-tabs=end]>.mat-tab-link-container .mat-tab-links{justify-content:flex-end}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-ink-bar{transition:none;animation:none}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}.cdk-high-contrast-active .mat-ink-bar{outline:solid 2px;height:0}.mat-tab-link-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.mat-tab-link{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;vertical-align:top;text-decoration:none;position:relative;overflow:hidden;-webkit-tap-highlight-color:transparent}.mat-tab-link:focus{outline:none}.mat-tab-link:focus:not(.mat-tab-disabled){opacity:1}.cdk-high-contrast-active .mat-tab-link:focus{outline:dotted 2px;outline-offset:-2px}.mat-tab-link.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-link.mat-tab-disabled{opacity:.5}.mat-tab-link .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-link{opacity:1}[mat-stretch-tabs] .mat-tab-link{flex-basis:0;flex-grow:1}.mat-tab-link.mat-tab-disabled{pointer-events:none}@media(max-width: 599px){.mat-tab-link{min-width:72px}}\n"]
        }),
        __param(1, Optional()),
        __param(5, Optional()),
        __param(6, Optional()), __param(6, Inject(ANIMATION_MODULE_TYPE)),
        __metadata("design:paramtypes", [ElementRef,
            Directionality,
            NgZone,
            ChangeDetectorRef,
            ViewportRuler,
            Platform, String])
    ], MatTabNav);
    return MatTabNav;
})();
export { MatTabNav };
// Boilerplate for applying mixins to MatTabLink.
class MatTabLinkMixinBase {
}
const _MatTabLinkMixinBase = mixinTabIndex(mixinDisableRipple(mixinDisabled(MatTabLinkMixinBase)));
/** Base class with all of the `MatTabLink` functionality. */
let _MatTabLinkBase = /** @class */ (() => {
    let _MatTabLinkBase = 
    // tslint:disable-next-line:class-name
    class _MatTabLinkBase extends _MatTabLinkMixinBase {
        constructor(_tabNavBar, elementRef, globalRippleOptions, tabIndex, _focusMonitor, animationMode) {
            super();
            this._tabNavBar = _tabNavBar;
            this.elementRef = elementRef;
            this._focusMonitor = _focusMonitor;
            /** Whether the tab link is active or not. */
            this._isActive = false;
            this.rippleConfig = globalRippleOptions || {};
            this.tabIndex = parseInt(tabIndex) || 0;
            if (animationMode === 'NoopAnimations') {
                this.rippleConfig.animation = { enterDuration: 0, exitDuration: 0 };
            }
            _focusMonitor.monitor(elementRef);
        }
        /** Whether the link is active. */
        get active() { return this._isActive; }
        set active(value) {
            if (value !== this._isActive) {
                this._isActive = value;
                this._tabNavBar.updateActiveLink(this.elementRef);
            }
        }
        /**
         * Whether ripples are disabled on interaction.
         * @docs-private
         */
        get rippleDisabled() {
            return this.disabled || this.disableRipple || this._tabNavBar.disableRipple ||
                !!this.rippleConfig.disabled;
        }
        focus() {
            this.elementRef.nativeElement.focus();
        }
        ngOnDestroy() {
            this._focusMonitor.stopMonitoring(this.elementRef);
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], _MatTabLinkBase.prototype, "active", null);
    _MatTabLinkBase = __decorate([
        Directive()
        // tslint:disable-next-line:class-name
        ,
        __param(2, Optional()), __param(2, Inject(MAT_RIPPLE_GLOBAL_OPTIONS)),
        __param(3, Attribute('tabindex')),
        __param(5, Optional()), __param(5, Inject(ANIMATION_MODULE_TYPE)),
        __metadata("design:paramtypes", [_MatTabNavBase, ElementRef, Object, String, FocusMonitor, String])
    ], _MatTabLinkBase);
    return _MatTabLinkBase;
})();
export { _MatTabLinkBase };
/**
 * Link inside of a `mat-tab-nav-bar`.
 */
let MatTabLink = /** @class */ (() => {
    let MatTabLink = class MatTabLink extends _MatTabLinkBase {
        constructor(tabNavBar, elementRef, ngZone, platform, globalRippleOptions, tabIndex, focusMonitor, animationMode) {
            super(tabNavBar, elementRef, globalRippleOptions, tabIndex, focusMonitor, animationMode);
            this._tabLinkRipple = new RippleRenderer(this, ngZone, elementRef, platform);
            this._tabLinkRipple.setupTriggerEvents(elementRef.nativeElement);
        }
        ngOnDestroy() {
            super.ngOnDestroy();
            this._tabLinkRipple._removeTriggerEvents();
        }
    };
    MatTabLink = __decorate([
        Directive({
            selector: '[mat-tab-link], [matTabLink]',
            exportAs: 'matTabLink',
            inputs: ['disabled', 'disableRipple', 'tabIndex'],
            host: {
                'class': 'mat-tab-link mat-focus-indicator',
                '[attr.aria-current]': 'active ? "page" : null',
                '[attr.aria-disabled]': 'disabled',
                '[attr.tabIndex]': 'tabIndex',
                '[class.mat-tab-disabled]': 'disabled',
                '[class.mat-tab-label-active]': 'active',
            }
        }),
        __param(4, Optional()), __param(4, Inject(MAT_RIPPLE_GLOBAL_OPTIONS)),
        __param(5, Attribute('tabindex')),
        __param(7, Optional()), __param(7, Inject(ANIMATION_MODULE_TYPE)),
        __metadata("design:paramtypes", [MatTabNav, ElementRef, NgZone,
            Platform, Object, String, FocusMonitor, String])
    ], MatTabLink);
    return MatTabLink;
})();
export { MatTabLink };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLW5hdi1iYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItbmF2LWJhci90YWItbmF2LWJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUdMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFJTCx5QkFBeUIsRUFDekIsYUFBYSxFQUNiLGtCQUFrQixFQUNsQixhQUFhLEVBRWIsY0FBYyxHQUdmLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLFlBQVksRUFBa0IsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRSxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxxQkFBcUIsRUFBNEIsTUFBTSx5QkFBeUIsQ0FBQztBQUN6RixPQUFPLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBEOzs7R0FHRztBQUdIO0lBQUEsSUFBc0IsY0FBYztJQURwQyxzQ0FBc0M7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QUM7WUFDVCxRQUFRLEVBQUUsOEJBQThCO1lBQ3hDLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLE1BQU0sRUFBRSxDQUFDLFVBQVUsRUFBRSxlQUFlLEVBQUUsVUFBVSxDQUFDO1lBQ2pELElBQUksRUFBRTtnQkFDSixPQUFPLEVBQUUsa0NBQWtDO2dCQUMzQyxxQkFBcUIsRUFBRSx3QkFBd0I7Z0JBQy9DLHNCQUFzQixFQUFFLFVBQVU7Z0JBQ2xDLGlCQUFpQixFQUFFLFVBQVU7Z0JBQzdCLDBCQUEwQixFQUFFLFVBQVU7Z0JBQ3RDLDhCQUE4QixFQUFFLFFBQVE7YUFDekM7U0FDRixDQUFDO1FBUUcsV0FBQSxRQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsTUFBTSxDQUFDLHlCQUF5QixDQUFDLENBQUE7UUFDN0MsV0FBQSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDckIsV0FBQSxRQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUE7eUNBSi9CLFNBQVMsRUFBYyxVQUFVLEVBQVUsTUFBTTtZQUNsRCxRQUFRLGtCQUVxQyxZQUFZO09BUjFELFVBQVUsQ0FtQnRCO0lBQUQsaUJBQUM7S0FBQTtTQW5CWSxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5EaXNhYmxlLCBDYW5EaXNhYmxlQ3RvcixcbiAgQ2FuRGlzYWJsZVJpcHBsZSwgQ2FuRGlzYWJsZVJpcHBsZUN0b3IsXG4gIEhhc1RhYkluZGV4LCBIYXNUYWJJbmRleEN0b3IsXG4gIE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5UYWJJbmRleCwgUmlwcGxlQ29uZmlnLFxuICBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICBSaXBwbGVSZW5kZXJlcixcbiAgUmlwcGxlVGFyZ2V0LFxuICBUaGVtZVBhbGV0dGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Rm9jdXNNb25pdG9yLCBGb2N1c2FibGVPcHRpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRJbmtCYXJ9IGZyb20gJy4uL2luay1iYXInO1xuaW1wb3J0IHtNYXRQYWdpbmF0ZWRUYWJIZWFkZXIsIE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW19IGZyb20gJy4uL3BhZ2luYXRlZC10YWItaGVhZGVyJztcbmltcG9ydCB7c3RhcnRXaXRoLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0VGFiTmF2YCBmdW5jdGlvbmFsaXR5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKClcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFRhYk5hdkJhc2UgZXh0ZW5kcyBNYXRQYWdpbmF0ZWRUYWJIZWFkZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuXG4gIC8qKiBRdWVyeSBsaXN0IG9mIGFsbCB0YWIgbGlua3Mgb2YgdGhlIHRhYiBuYXZpZ2F0aW9uLiAqL1xuICBhYnN0cmFjdCBfaXRlbXM6IFF1ZXJ5TGlzdDxNYXRQYWdpbmF0ZWRUYWJIZWFkZXJJdGVtICYge2FjdGl2ZTogYm9vbGVhbn0+O1xuXG4gIC8qKiBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSB0YWIgbmF2LiAqL1xuICBASW5wdXQoKVxuICBnZXQgYmFja2dyb3VuZENvbG9yKCk6IFRoZW1lUGFsZXR0ZSB7IHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kQ29sb3I7IH1cbiAgc2V0IGJhY2tncm91bmRDb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdDtcbiAgICBjbGFzc0xpc3QucmVtb3ZlKGBtYXQtYmFja2dyb3VuZC0ke3RoaXMuYmFja2dyb3VuZENvbG9yfWApO1xuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBjbGFzc0xpc3QuYWRkKGBtYXQtYmFja2dyb3VuZC0ke3ZhbHVlfWApO1xuICAgIH1cblxuICAgIHRoaXMuX2JhY2tncm91bmRDb2xvciA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2JhY2tncm91bmRDb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByaXBwbGUgZWZmZWN0IGlzIGRpc2FibGVkIG9yIG5vdC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVSaXBwbGUoKSB7IHJldHVybiB0aGlzLl9kaXNhYmxlUmlwcGxlOyB9XG4gIHNldCBkaXNhYmxlUmlwcGxlKHZhbHVlOiBhbnkpIHsgdGhpcy5fZGlzYWJsZVJpcHBsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfZGlzYWJsZVJpcHBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGVtZSBjb2xvciBvZiB0aGUgbmF2IGJhci4gKi9cbiAgQElucHV0KCkgY29sb3I6IFRoZW1lUGFsZXR0ZSA9ICdwcmltYXJ5JztcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICogQGRlcHJlY2F0ZWQgQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBgcGxhdGZvcm1gIHBhcmFtZXRlciB0byBiZWNvbWUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwbGF0Zm9ybT86IFBsYXRmb3JtLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGNoYW5nZURldGVjdG9yUmVmLCB2aWV3cG9ydFJ1bGVyLCBkaXIsIG5nWm9uZSwgcGxhdGZvcm0sIGFuaW1hdGlvbk1vZGUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9pdGVtU2VsZWN0ZWQoKSB7XG4gICAgLy8gbm9vcFxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIC8vIFdlIG5lZWQgdGhpcyB0byBydW4gYmVmb3JlIHRoZSBgY2hhbmdlc2Agc3Vic2NyaXB0aW9uIGluIHBhcmVudCB0byBlbnN1cmUgdGhhdCB0aGVcbiAgICAvLyBzZWxlY3RlZEluZGV4IGlzIHVwLXRvLWRhdGUgYnkgdGhlIHRpbWUgdGhlIHN1cGVyIGNsYXNzIHN0YXJ0cyBsb29raW5nIGZvciBpdC5cbiAgICB0aGlzLl9pdGVtcy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlQWN0aXZlTGluaygpO1xuICAgIH0pO1xuXG4gICAgc3VwZXIubmdBZnRlckNvbnRlbnRJbml0KCk7XG4gIH1cblxuICAvKipcbiAgICogTm90aWZpZXMgdGhlIGNvbXBvbmVudCB0aGF0IHRoZSBhY3RpdmUgbGluayBoYXMgYmVlbiBjaGFuZ2VkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wIGBlbGVtZW50YCBwYXJhbWV0ZXIgdG8gYmUgcmVtb3ZlZC5cbiAgICovXG4gIHVwZGF0ZUFjdGl2ZUxpbmsoX2VsZW1lbnQ/OiBFbGVtZW50UmVmKSB7XG4gICAgaWYgKCF0aGlzLl9pdGVtcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5faXRlbXMudG9BcnJheSgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGl0ZW1zW2ldLmFjdGl2ZSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpO1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZSBpbmsgYmFyIHNob3VsZCBoaWRlIGl0c2VsZiBpZiBubyBpdGVtcyBhcmUgYWN0aXZlLlxuICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgIHRoaXMuX2lua0Jhci5oaWRlKCk7XG4gIH1cbn1cblxuXG4vKipcbiAqIE5hdmlnYXRpb24gY29tcG9uZW50IG1hdGNoaW5nIHRoZSBzdHlsZXMgb2YgdGhlIHRhYiBncm91cCBoZWFkZXIuXG4gKiBQcm92aWRlcyBhbmNob3JlZCBuYXZpZ2F0aW9uIHdpdGggYW5pbWF0ZWQgaW5rIGJhci5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW21hdC10YWItbmF2LWJhcl0nLFxuICBleHBvcnRBczogJ21hdFRhYk5hdkJhciwgbWF0VGFiTmF2JyxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG4gIHRlbXBsYXRlVXJsOiAndGFiLW5hdi1iYXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0YWItbmF2LWJhci5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtdGFiLW5hdi1iYXIgbWF0LXRhYi1oZWFkZXInLFxuICAgICdbY2xhc3MubWF0LXRhYi1oZWFkZXItcGFnaW5hdGlvbi1jb250cm9scy1lbmFibGVkXSc6ICdfc2hvd1BhZ2luYXRpb25Db250cm9scycsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWhlYWRlci1ydGxdJzogXCJfZ2V0TGF5b3V0RGlyZWN0aW9uKCkgPT0gJ3J0bCdcIixcbiAgICAnW2NsYXNzLm1hdC1wcmltYXJ5XSc6ICdjb2xvciAhPT0gXCJ3YXJuXCIgJiYgY29sb3IgIT09IFwiYWNjZW50XCInLFxuICAgICdbY2xhc3MubWF0LWFjY2VudF0nOiAnY29sb3IgPT09IFwiYWNjZW50XCInLFxuICAgICdbY2xhc3MubWF0LXdhcm5dJzogJ2NvbG9yID09PSBcIndhcm5cIicsXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiTmF2IGV4dGVuZHMgX01hdFRhYk5hdkJhc2Uge1xuICBAQ29udGVudENoaWxkcmVuKGZvcndhcmRSZWYoKCkgPT4gTWF0VGFiTGluayksIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9pdGVtczogUXVlcnlMaXN0PE1hdFRhYkxpbms+O1xuICBAVmlld0NoaWxkKE1hdElua0Jhciwge3N0YXRpYzogdHJ1ZX0pIF9pbmtCYXI6IE1hdElua0JhcjtcbiAgQFZpZXdDaGlsZCgndGFiTGlzdENvbnRhaW5lcicsIHtzdGF0aWM6IHRydWV9KSBfdGFiTGlzdENvbnRhaW5lcjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgndGFiTGlzdCcsIHtzdGF0aWM6IHRydWV9KSBfdGFiTGlzdDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnbmV4dFBhZ2luYXRvcicpIF9uZXh0UGFnaW5hdG9yOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgncHJldmlvdXNQYWdpbmF0b3InKSBfcHJldmlvdXNQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQE9wdGlvbmFsKCkgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIGBwbGF0Zm9ybWAgcGFyYW1ldGVyIHRvIGJlY29tZSByZXF1aXJlZC5cbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKSBwbGF0Zm9ybT86IFBsYXRmb3JtLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgZGlyLCBuZ1pvbmUsIGNoYW5nZURldGVjdG9yUmVmLCB2aWV3cG9ydFJ1bGVyLCBwbGF0Zm9ybSwgYW5pbWF0aW9uTW9kZSk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFRhYkxpbmsuXG5jbGFzcyBNYXRUYWJMaW5rTWl4aW5CYXNlIHt9XG5jb25zdCBfTWF0VGFiTGlua01peGluQmFzZTpcbiAgICBIYXNUYWJJbmRleEN0b3IgJiBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmIENhbkRpc2FibGVDdG9yICYgdHlwZW9mIE1hdFRhYkxpbmtNaXhpbkJhc2UgPVxuICAgICAgICBtaXhpblRhYkluZGV4KG1peGluRGlzYWJsZVJpcHBsZShtaXhpbkRpc2FibGVkKE1hdFRhYkxpbmtNaXhpbkJhc2UpKSk7XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0VGFiTGlua2AgZnVuY3Rpb25hbGl0eS4gKi9cbkBEaXJlY3RpdmUoKVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNsYXNzLW5hbWVcbmV4cG9ydCBjbGFzcyBfTWF0VGFiTGlua0Jhc2UgZXh0ZW5kcyBfTWF0VGFiTGlua01peGluQmFzZSBpbXBsZW1lbnRzIE9uRGVzdHJveSwgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZSwgSGFzVGFiSW5kZXgsIFJpcHBsZVRhcmdldCwgRm9jdXNhYmxlT3B0aW9uIHtcblxuICAvKiogV2hldGhlciB0aGUgdGFiIGxpbmsgaXMgYWN0aXZlIG9yIG5vdC4gKi9cbiAgcHJvdGVjdGVkIF9pc0FjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsaW5rIGlzIGFjdGl2ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2lzQWN0aXZlOyB9XG4gIHNldCBhY3RpdmUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl9pc0FjdGl2ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fdGFiTmF2QmFyLnVwZGF0ZUFjdGl2ZUxpbmsodGhpcy5lbGVtZW50UmVmKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmlwcGxlIGNvbmZpZ3VyYXRpb24gZm9yIHJpcHBsZXMgdGhhdCBhcmUgbGF1bmNoZWQgb24gcG9pbnRlciBkb3duLiBUaGUgcmlwcGxlIGNvbmZpZ1xuICAgKiBpcyBzZXQgdG8gdGhlIGdsb2JhbCByaXBwbGUgb3B0aW9ucyBzaW5jZSB3ZSBkb24ndCBoYXZlIGFueSBjb25maWd1cmFibGUgb3B0aW9ucyBmb3JcbiAgICogdGhlIHRhYiBsaW5rIHJpcHBsZXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJpcHBsZUNvbmZpZzogUmlwcGxlQ29uZmlnICYgUmlwcGxlR2xvYmFsT3B0aW9ucztcblxuICAvKipcbiAgICogV2hldGhlciByaXBwbGVzIGFyZSBkaXNhYmxlZCBvbiBpbnRlcmFjdGlvbi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHJpcHBsZURpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVJpcHBsZSB8fCB0aGlzLl90YWJOYXZCYXIuZGlzYWJsZVJpcHBsZSB8fFxuICAgICAgISF0aGlzLnJpcHBsZUNvbmZpZy5kaXNhYmxlZDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfdGFiTmF2QmFyOiBfTWF0VGFiTmF2QmFzZSwgcHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpIGdsb2JhbFJpcHBsZU9wdGlvbnM6IFJpcHBsZUdsb2JhbE9wdGlvbnN8bnVsbCxcbiAgICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZywgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnJpcHBsZUNvbmZpZyA9IGdsb2JhbFJpcHBsZU9wdGlvbnMgfHwge307XG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuXG4gICAgaWYgKGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIHRoaXMucmlwcGxlQ29uZmlnLmFuaW1hdGlvbiA9IHtlbnRlckR1cmF0aW9uOiAwLCBleGl0RHVyYXRpb246IDB9O1xuICAgIH1cblxuICAgIF9mb2N1c01vbml0b3IubW9uaXRvcihlbGVtZW50UmVmKTtcbiAgfVxuXG4gIGZvY3VzKCkge1xuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5lbGVtZW50UmVmKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xufVxuXG5cbi8qKlxuICogTGluayBpbnNpZGUgb2YgYSBgbWF0LXRhYi1uYXYtYmFyYC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC10YWItbGlua10sIFttYXRUYWJMaW5rXScsXG4gIGV4cG9ydEFzOiAnbWF0VGFiTGluaycsXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdkaXNhYmxlUmlwcGxlJywgJ3RhYkluZGV4J10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRhYi1saW5rIG1hdC1mb2N1cy1pbmRpY2F0b3InLFxuICAgICdbYXR0ci5hcmlhLWN1cnJlbnRdJzogJ2FjdGl2ZSA/IFwicGFnZVwiIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIudGFiSW5kZXhdJzogJ3RhYkluZGV4JyxcbiAgICAnW2NsYXNzLm1hdC10YWItZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC10YWItbGFiZWwtYWN0aXZlXSc6ICdhY3RpdmUnLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYkxpbmsgZXh0ZW5kcyBfTWF0VGFiTGlua0Jhc2UgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBSaXBwbGVSZW5kZXJlciBmb3IgdGhlIHRhYi1saW5rLiAqL1xuICBwcml2YXRlIF90YWJMaW5rUmlwcGxlOiBSaXBwbGVSZW5kZXJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB0YWJOYXZCYXI6IE1hdFRhYk5hdiwgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgbmdab25lOiBOZ1pvbmUsXG4gICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUykgZ2xvYmFsUmlwcGxlT3B0aW9uczogUmlwcGxlR2xvYmFsT3B0aW9uc3xudWxsLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZywgZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcih0YWJOYXZCYXIsIGVsZW1lbnRSZWYsIGdsb2JhbFJpcHBsZU9wdGlvbnMsIHRhYkluZGV4LCBmb2N1c01vbml0b3IsIGFuaW1hdGlvbk1vZGUpO1xuICAgIHRoaXMuX3RhYkxpbmtSaXBwbGUgPSBuZXcgUmlwcGxlUmVuZGVyZXIodGhpcywgbmdab25lLCBlbGVtZW50UmVmLCBwbGF0Zm9ybSk7XG4gICAgdGhpcy5fdGFiTGlua1JpcHBsZS5zZXR1cFRyaWdnZXJFdmVudHMoZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy5fdGFiTGlua1JpcHBsZS5fcmVtb3ZlVHJpZ2dlckV2ZW50cygpO1xuICB9XG59XG4iXX0=